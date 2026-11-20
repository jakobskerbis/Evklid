// Obnova iz varnostne kopije ne vrne izbrisanih računov in profilov (docs/izbris-izvoz.md, točka 8): izbris zapiše
// seznam izbrisov zunaj baze, ob zagonu (createApp) se izbrisi ponovijo za vrstice, ki jih je obnova vrnila. Nov račun s
// ponovno uporabljenim id-jem (in istim e-naslovom) ostane. Seznam gre šifriran tudi v R2 in se od tam vrne.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { makeBackup, listBackups, restoreFile, applyPendingRestore, beriIzbrise, dodajIzbrise, izbrisiFile, pocistiStare, IZBRISI_DNI } from "../server/kopije.js";
import { eraseAccount, ponovitevIzbrisov } from "../server/accounts/izbris.js";
import { uskladiIzbrise, startCloudBackups } from "../server/kopije-oblak.js";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "evklid-obnova-izbris-"));
const quiet = { info() {}, error() {}, warn() {} };
const OPTS = { accounts: true, scheduler: false, log: quiet };
// Kopije z današnjim datumom (starejše od 22 dni bi obnova pobrisala kot pretečene).
const ura = (h) => new Date(Date.now() - h * 3600e3);

function parent(db, email, createdAt = null) {
  const vals = { email, password_hash: "x", name: "Ana", ...(createdAt ? { created_at: createdAt } : {}) };
  // Ostali obvezni stolpci brez privzete vrednosti (žetoni, kode): naključna vrednost.
  for (const c of db.prepare("PRAGMA table_info(parents)").all())
    if (c.notnull && c.dflt_value == null && !c.pk && !(c.name in vals)) vals[c.name] = /INT/i.test(c.type) ? 0 : crypto.randomUUID();
  const id = db.prepare(`INSERT INTO parents (${Object.keys(vals).join(", ")}) VALUES (${Object.keys(vals).map(() => "?").join(", ")}) RETURNING id`).get(...Object.values(vals)).id;
  const sid = db.prepare("INSERT INTO students (name, parent_id, settings, created_at) VALUES (?, ?, '{}', ?) RETURNING id").get(`Otrok ${email}`, id, createdAt || "2026-11-20 10:00:00").id;
  return { id, sid };
}

// Obnova po poti strežnika: kopija → obnovi.db → applyPendingRestore (server/index.js) → createApp ponovi izbrise.
function restore(file, backup) {
  fs.copyFileSync(backup, restoreFile(file));
  assert.equal(applyPendingRestore(file, { log: quiet }).restored, true);
  const store = openDb(file);
  createApp(store, OPTS);
  return store;
}

test("obnova iz kopije: izbrisan račun ostane izbrisan, nov račun s ponovno uporabljenim id-jem ostane", () => {
  const dir = tmp();
  const file = path.join(dir, "evklid.db");
  let store = openDb(file);
  createApp(store, OPTS);
  const db = store.db;
  const drugi = parent(db, "drugi@example.com", "2026-10-01 08:00:00");
  const ana = parent(db, "ana@example.com", "2026-11-01 10:00:00");
  makeBackup(db, file, { manual: true, now: ura(2) });

  eraseAccount(db, ana.id, { transaction: true });
  const z = beriIzbrise(file);
  assert.equal(z.length, 1);
  assert.deepEqual(z[0].r, [ana.id, "2026-11-01 10:00:00"]);
  assert.deepEqual(z[0].s, [[ana.sid, "2026-11-01 10:00:00"]]);
  const besedilo = fs.readFileSync(izbrisiFile(file), "utf8");
  assert.doesNotMatch(besedilo, /ana@example|Ana|Otrok/, "seznam izbrisov brez e-naslova in imen");

  // Ista oseba se znova registrira z istim e-naslovom in dobi isti id (SQLite ponovno uporabi največji id).
  const nova = parent(db, "ana@example.com");
  assert.equal(nova.id, ana.id);
  makeBackup(db, file, { manual: true, now: ura(1) });
  db.close();
  const [poNovem, predIzbrisom] = listBackups(file).filter((b) => b.manual);

  // Obnova kopije izpred izbrisa: Ana in njen profil se ob zagonu izbrišeta znova, drugi račun ostane.
  store = restore(file, predIzbrisom.file);
  const q = (sql, ...a) => store.db.prepare(sql).all(...a);
  assert.deepEqual(q("SELECT id FROM parents WHERE email = 'ana@example.com'"), []);
  assert.deepEqual(q("SELECT id FROM students WHERE id = ? OR parent_id = ?", ana.sid, ana.id), []);
  assert.equal(q("SELECT id FROM parents WHERE id = ?", drugi.id).length, 1);
  assert.equal(q("SELECT id FROM students WHERE id = ?", drugi.sid).length, 1);
  assert.equal(q("SELECT 1 FROM audit_log WHERE action = 'erase_reapplied'").length, 1);
  assert.equal(beriIzbrise(file).length, 1, "ponovitev ne doda novega zapisa");
  store.db.close();

  // Obnova kopije z novim računom (isti id, isti e-naslov): ostane z dostopom in profilom.
  store = restore(file, poNovem.file);
  assert.deepEqual({ ...store.db.prepare("SELECT id, email FROM parents WHERE id = ?").get(nova.id) }, { id: nova.id, email: "ana@example.com" });
  assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM students WHERE parent_id = ?").get(nova.id).n, 1);
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("obnova iz kopije: profil, izbrisan sam (DELETE /api/students/:id), ostane izbrisan", async () => {
  const dir = tmp();
  const file = path.join(dir, "evklid.db");
  const store = openDb(file);
  const app = createApp(store, { ...OPTS, accounts: false });
  const server = app.listen(0);
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const add = async (name) => (await (await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) })).json()).id;
    const a = await add("Brisani");
    const b = await add("Ostane");
    assert.ok(a && b);
    makeBackup(store.db, file, { manual: true, now: ura(1) });
    assert.equal((await (await fetch(`${base}/api/students/${a}`, { method: "DELETE" })).json()).ok, true);
    assert.deepEqual(beriIzbrise(file)[0].s.map((x) => x[0]), [a]);
  } finally {
    server.close();
  }
  store.db.close();
  const s2 = restore(file, listBackups(file)[0].file);
  assert.deepEqual(s2.db.prepare("SELECT name FROM students ORDER BY id").all().map((r) => r.name), ["Ostane"]);
  s2.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("seznam izbrisov: stari zapisi se pobrišejo, dvojniki se ne podvojijo, pokvarjen seznam se javi", () => {
  const dir = tmp();
  const file = path.join(dir, "evklid.db");
  const now = new Date("2026-11-20T12:00:00Z");
  const star = { at: new Date(now - (IZBRISI_DNI + 1) * 864e5).toISOString(), r: [1, "2026-01-01 00:00:00"], s: [] };
  const nov = { at: "2026-11-19T12:00:00.000Z", r: [2, "2026-02-01 00:00:00"], s: [[5, "2026-02-01 00:00:00"]] };
  assert.equal(dodajIzbrise(file, [star, nov, nov, { at: 5 }], now).dodanih, 2);
  assert.deepEqual(beriIzbrise(file), [nov]);
  assert.equal(dodajIzbrise(file, [nov], now).dodanih, 0);
  // Dnevno čiščenje po rokih hrambe pobriše stare zapise tudi brez novega izbrisa (in brez R2).
  pocistiStare(file, new Date(now.getTime() + (IZBRISI_DNI + 2) * 864e5));
  assert.deepEqual(beriIzbrise(file), []);
  fs.writeFileSync(izbrisiFile(file), "{pokvarjeno");
  pocistiStare(file, now); // pokvarjenega seznama čiščenje ne prepiše
  assert.equal(fs.readFileSync(izbrisiFile(file), "utf8"), "{pokvarjeno");
  const errors = [];
  const store = openDb(file);
  assert.deepEqual(ponovitevIzbrisov(store.db, file, { log: { error: (m) => errors.push(m), info() {} } }), { racuni: 0, profili: 0 });
  assert.match(errors[0], /seznama izbrisov ni mogoče prebrati/);
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

// Shramba v pomnilniku, ki se obnaša kot S3 (samo PUT in GET predmeta).
function fakeS3() {
  const objects = new Map();
  const fetchFn = async (url, { method, body }) => {
    const key = decodeURIComponent(new URL(url).pathname.replace(/^\/kopije-vedro\//, ""));
    if (method === "PUT") return objects.set(key, Buffer.from(body)), new Response("");
    if (method === "GET" && !new URL(url).searchParams.get("list-type")) return objects.has(key) ? new Response(objects.get(key)) : new Response("<Code>NoSuchKey</Code>", { status: 404 });
    return new Response("<ListBucketResult></ListBucketResult>");
  };
  return { objects, fetchFn };
}
const CFG = { url: "https://r2.example", bucket: "kopije-vedro", keyId: "id", secret: "s", region: "auto", keepDays: 30 };
const ENV = { EVKLID_KOPIJE_S3_URL: CFG.url, EVKLID_KOPIJE_S3_BUCKET: CFG.bucket, EVKLID_KOPIJE_S3_KEY_ID: "id", EVKLID_KOPIJE_S3_SECRET: "s" };

test("seznam izbrisov v R2: šifriran, po izgubi diska se vrne in izbrisi se ponovijo", async () => {
  const prej = process.env.EVKLID_DATA_KEY;
  process.env.EVKLID_DATA_KEY = crypto.randomBytes(32).toString("base64");
  try {
    const s3 = fakeS3();
    // Stari strežnik: izbris, nato urna kopija zunaj naloži seznam (in ga ne nalaga znova, dokler se ne spremeni).
    const dirA = tmp();
    const fileA = path.join(dirA, "evklid.db");
    const a = openDb(fileA);
    createApp(a, OPTS);
    const ana = parent(a.db, "ana@example.com", "2026-11-01 10:00:00");
    makeBackup(a.db, fileA, { manual: true, now: ura(1) });
    eraseAccount(a.db, ana.id, { transaction: true });
    const c = startCloudBackups(fileA, { scheduler: false, log: quiet, env: ENV, fetchFn: s3.fetchFn });
    await c.run();
    assert.equal(c.status().napaka, false);
    const obj = s3.objects.get("kopije/evklid-izbrisi.json.enc");
    assert.ok(obj, "seznam izbrisov je v shrambi");
    assert.doesNotMatch(obj.toString("latin1"), /2026-11-01|created/, "v shrambi šifriran");
    assert.deepEqual((await uskladiIzbrise(CFG, fileA, { fetchFn: s3.fetchFn })).nalozeno, false, "nespremenjen se ne naloži znova");
    a.db.close();

    // Nov disk: prazna baza brez seznama; kopija iz R2 (tu: lokalna kopija izpred izbrisa) se obnovi.
    const dirB = tmp();
    const fileB = path.join(dirB, "evklid.db");
    openDb(fileB).db.close();
    assert.deepEqual(await uskladiIzbrise(CFG, fileB, { fetchFn: s3.fetchFn, upload: false }), { dodanih: 1, nalozeno: false }); // server/index.js ob zagonu
    const b = restore(fileB, listBackups(fileA)[0].file);
    assert.equal(b.db.prepare("SELECT COUNT(*) AS n FROM parents WHERE email = 'ana@example.com'").get().n, 0);
    assert.equal(b.db.prepare("SELECT COUNT(*) AS n FROM students WHERE id = ?").get(ana.sid).n, 0);
    b.db.close();

    // Obnova posnetka diska: lokalni seznam je star, baza ima Ano; urni prenos iz R2 izbris ponovi (poIzbrisih).
    const dirC = tmp();
    const fileC = path.join(dirC, "evklid.db");
    fs.copyFileSync(listBackups(fileA)[0].file, fileC);
    const cs = openDb(fileC);
    createApp(cs, OPTS); // brez lokalnega seznama: Ana je še tu
    assert.equal(cs.db.prepare("SELECT COUNT(*) AS n FROM parents WHERE id = ?").get(ana.id).n, 1);
    const ponovi = () => ponovitevIzbrisov(cs.db, fileC, { log: quiet });
    await startCloudBackups(fileC, { scheduler: false, log: quiet, env: ENV, fetchFn: s3.fetchFn, poIzbrisih: ponovi }).run();
    assert.equal(cs.db.prepare("SELECT COUNT(*) AS n FROM parents WHERE id = ?").get(ana.id).n, 0);
    cs.db.close();

    // Brez ključa se seznam ne prenaša (nešifrirano ne gre ven).
    delete process.env.EVKLID_DATA_KEY;
    assert.equal(await uskladiIzbrise(CFG, fileA, { fetchFn: s3.fetchFn }), null);
    for (const d of [dirA, dirB, dirC]) fs.rmSync(d, { recursive: true, force: true });
  } finally {
    if (prej === undefined) delete process.env.EVKLID_DATA_KEY;
    else process.env.EVKLID_DATA_KEY = prej;
  }
});
