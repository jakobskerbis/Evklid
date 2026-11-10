import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { makeBackup, listBackups } from "../server/kopije.js";
import { startBackupChecks, checkBackups } from "../server/kopije-preveri.js";
import { verifyInWorker } from "../server/kopije-preizkus.js";
import { seal, newKey } from "../server/crypto-polje.js";

const quiet = { info() {}, error() {}, warn() {} };
const NOW = new Date("2026-11-09T03:40:00Z"); // 4.40 po ljubljanskem času, dnevna kopija 2026-11-09 že narejena
const ENV = { EVKLID_ADMIN_EMAILS: "skrbnik@primer.si, drugi@primer.si" };
const CLOUD = { EVKLID_KOPIJE_S3_URL: "https://r2.primer", EVKLID_KOPIJE_S3_BUCKET: "b", EVKLID_KOPIJE_S3_KEY_ID: "k", EVKLID_KOPIJE_S3_SECRET: "s" };
const listing = (keys) => new Response(`<ListBucketResult>${keys.map((k) => `<Key>${k}</Key>`).join("")}</ListBucketResult>`, { status: 200 });

function setup({ before } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-preveri-"));
  const file = path.join(dir, "evklid.db");
  const store = openDb(file);
  store.db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run("Ana");
  before?.(store.db);
  assert.equal(makeBackup(store.db, file, { now: NOW }).made, true);
  const mailer = { enabled: true, sent: [], fail: false, async send(m) {
    if (this.fail) throw new Error("Resend 500");
    this.sent.push(m);
  } };
  const logs = { error: [], warn: [] };
  const log = { info() {}, error: (m) => logs.error.push(m), warn: (m) => logs.warn.push(m) };
  const done = () => {
    store.db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  };
  return { file, store, mailer, logs, log, done };
}
const corrupt = (file) => {
  const fd = fs.openSync(file, "r+");
  fs.writeSync(fd, Buffer.alloc(4096, 0x41), 0, 4096, 0); // glava baze SQLite uničena
  fs.closeSync(fd);
};

test("preverjanje kopij: zdrava kopija → ok, brez e-pošte (v ločeni niti)", async () => {
  const s = setup();
  const checks = startBackupChecks(s.store.db, s.file, { scheduler: false, log: s.log, now: () => NOW, env: ENV, mailer: s.mailer });
  const r = await checks.run({ force: true });
  assert.equal(r.ok, true, r.napake.join("; "));
  assert.equal(r.kopija, "2026-11-09");
  assert.equal(s.mailer.sent.length, 0);
  assert.equal(s.logs.error.length, 0);
  assert.deepEqual(checks.status(), { datum: "2026-11-09", ok: true });
  s.done();
});

test("preverjanje kopij: pokvarjena kopija (v niti) → napaka, en e-mail na skrbnika na dan, naslednji dan spet", async () => {
  const s = setup();
  corrupt(listBackups(s.file)[0].file);
  let t = NOW;
  const checks = startBackupChecks(s.store.db, s.file, { scheduler: false, log: s.log, now: () => t, env: ENV, mailer: s.mailer });
  const r = await checks.run({ force: true });
  assert.equal(r.ok, false);
  assert.match(r.napake.join(";"), /kopija ni cela/);
  assert.ok(s.logs.error.some((e) => /NAPAKA: preizkus varnostne kopije/.test(e)));
  assert.deepEqual(s.mailer.sent.map((m) => m.to), ["skrbnik@primer.si", "drugi@primer.si"]);
  assert.match(s.mailer.sent[0].subject, /ni uspel \(2026-11-09\)/);
  assert.ok(!s.logs.error.some((e) => /@/.test(e)), "naslovi ne v dnevnik");
  // Isti dan: spet napaka, e-pošte pa ne več; dan je opravljen.
  await checks.run({ force: true });
  assert.equal(s.mailer.sent.length, 2);
  assert.equal(await checks.tick(), undefined);
  assert.deepEqual(checks.status(), { datum: "2026-11-09", ok: false });
  // Naslednji dan (kopija še vedno pokvarjena in zastarela): nov e-mail.
  t = new Date("2026-11-10T03:40:00Z");
  await checks.tick();
  assert.equal(s.mailer.sent.length, 4);
  assert.match(s.mailer.sent[2].subject, /2026-11-10/);
  s.done();
});

test("preverjanje kopij: pogovori, šifrirani z drugim ključem → neberljive vrstice (v niti)", async () => {
  const saved = { cur: process.env.EVKLID_DATA_KEY, old: process.env.EVKLID_DATA_KEYS_OLD };
  try {
    process.env.EVKLID_DATA_KEY = newKey();
    delete process.env.EVKLID_DATA_KEYS_OLD;
    const s = setup({
      before: (db) => {
        const sid = db.prepare("SELECT id FROM students").get().id;
        db.prepare("INSERT INTO conversations (student_id, title) VALUES (?, ?)").run(sid, seal("Ulomki"));
      },
    });
    process.env.EVKLID_DATA_KEY = newKey(); // ključ zamenjan brez EVKLID_DATA_KEYS_OLD
    const r = await checkBackups(s.file, { now: NOW, env: {} });
    assert.equal(r.ok, false);
    assert.match(r.napake.join(";"), /1 šifriranih vrstic se s sedanjim ključem ne da prebrati/);
    s.done();
  } finally {
    for (const [k, v] of [["EVKLID_DATA_KEY", saved.cur], ["EVKLID_DATA_KEYS_OLD", saved.old]]) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
});

test("preverjanje kopij: nit, ki traja predolgo, se ustavi z napako", async () => {
  const s = setup();
  const r = await verifyInWorker(s.file, listBackups(s.file)[0].file, { timeoutMs: 1 });
  assert.equal(r.ok, false);
  assert.match(r.notes[0], /trajal predolgo/);
  s.done();
});

test("preverjanje kopij: e-mail ne gre skozi → dan ni opravljen, ponovi ob naslednjem pregledu", async () => {
  const s = setup();
  corrupt(listBackups(s.file)[0].file);
  s.mailer.fail = true;
  const checks = startBackupChecks(s.store.db, s.file, { scheduler: false, log: s.log, now: () => NOW, env: ENV, mailer: s.mailer, worker: false });
  const r1 = await checks.tick();
  assert.equal(r1.koncano, false);
  assert.equal(r1.poslano, null);
  s.mailer.fail = false;
  const r2 = await checks.tick();
  assert.equal(r2.poslano, "2026-11-09");
  assert.equal(r2.koncano, true);
  assert.equal(s.mailer.sent.length, 2);
  assert.equal(await checks.tick(), undefined, "opravljeno");
  // Ko Resend ves čas ne deluje: največ 4 poskusi na dan.
  const t = new Date("2026-11-10T03:40:00Z");
  const c2 = startBackupChecks(s.store.db, s.file, { scheduler: false, log: s.log, now: () => t, env: ENV, mailer: { ...s.mailer, fail: true, sent: [] }, worker: false });
  const tries = [];
  for (let i = 0; i < 6; i++) tries.push((await c2.tick())?.poskusov ?? null);
  assert.deepEqual(tries, [1, 2, 3, 4, null, null]);
  s.done();
});

test("preverjanje kopij: shramba zunaj trenutno nedosegljiva → en tihi ponovni poskus, nato alarm", async () => {
  const s = setup();
  const fetchFn = async () => {
    throw new Error("fetch failed");
  };
  const checks = startBackupChecks(s.store.db, s.file, { scheduler: false, log: s.log, now: () => NOW, env: { ...ENV, ...CLOUD }, mailer: s.mailer, fetchFn, worker: false });
  const r1 = await checks.tick();
  assert.equal(r1.koncano, false);
  assert.equal(s.mailer.sent.length, 0);
  assert.equal(s.logs.error.length, 0);
  assert.equal(s.logs.warn.length, 1);
  const r2 = await checks.tick();
  assert.equal(r2.koncano, true);
  assert.equal(s.mailer.sent.length, 2);
  assert.match(s.mailer.sent[0].text, /seznama kopij zunaj strežnika ni bilo mogoče dobiti/);
  s.done();
});

test("preverjanje kopij: brez današnje kopije in brez kopije zunaj strežnika → napaka; samo GET", async () => {
  const s = setup();
  const r1 = await checkBackups(s.file, { now: new Date("2026-11-10T03:40:00Z"), env: {}, worker: false });
  assert.equal(r1.ok, false);
  assert.match(r1.napake[0], /današnje dnevne kopije/);
  const calls = [];
  const fetchWith = (keys) => async (_url, o) => {
    calls.push(o.method);
    return listing(keys);
  };
  const r2 = await checkBackups(s.file, { now: NOW, env: CLOUD, fetchFn: fetchWith(["kopije/evklid-2026-11-08.db.enc"]), worker: false });
  assert.equal(r2.ok, false);
  assert.equal(r2.prehodna, false);
  assert.match(r2.napake[0], /2026-11-09 zunaj strežnika ni/);
  const r3 = await checkBackups(s.file, { now: NOW, env: CLOUD, fetchFn: fetchWith(["kopije/evklid-2026-11-09.db.enc"]), worker: false });
  assert.equal(r3.ok, true, r3.napake.join("; "));
  assert.deepEqual([...new Set(calls)], ["GET"], "nič se ne naloži ali pobriše");
  s.done();
});

test("preverjanje kopij: urnik samo ponoči, enkrat na dan, počaka na zahteve v teku", async () => {
  const s = setup();
  let t = new Date("2026-11-09T02:00:00Z"); // 3.00 v Ljubljani: še ne
  let busy = true;
  const checks = startBackupChecks(s.store.db, s.file, { scheduler: false, log: s.log, now: () => t, env: ENV, mailer: s.mailer, worker: false, isBusy: () => busy });
  assert.equal(checks.tick(), undefined);
  t = NOW;
  assert.equal(checks.tick(), undefined); // zahteve v teku: počaka
  assert.equal(checks.status(), null);
  busy = false;
  await checks.tick();
  assert.deepEqual(checks.status(), { datum: "2026-11-09", ok: true });
  assert.equal(await checks.run(), null, "isti dan se ne ponovi");
  t = new Date("2026-11-09T07:10:00Z"); // 8.10: prepozno za začetek
  assert.equal(checks.tick(), undefined);
  // Izklop: EVKLID_KOPIJE_PREVERI=0.
  assert.equal(startBackupChecks(s.store.db, s.file, { scheduler: false, env: { EVKLID_KOPIJE_PREVERI: "0" } }).status(), null);
  s.done();
});
