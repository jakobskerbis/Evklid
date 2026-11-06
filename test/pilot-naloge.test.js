// Naloge za člane pilota (server/pilot-naloge.js): samo člani pilota jih vidijo, vsaka nagrada enkrat,
// fotografija samo ob soglasju in samo za profil, star vsaj 15 let; skrbnik vidi vsote brez imen.
import crypto from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { pilotTasksReport, pilotTasksMarkdown, TOTAL, XP, SCAN_CONDITIONS, PHOTO_DAILY_MAX } from "../server/pilot-naloge.js";
import { Leagues } from "../server/leagues.js";
import { withoutPilotPhotos } from "../server/kopije.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { runRetention } from "../server/zasebnost.js";
import SL from "../public/i18n/sl.js";

const IMG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ==";
// Fotografije shranimo samo s šifrirnim ključem (brez njega bi bile v bazi nešifrirane).
process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "e" }) }), log: { error() {}, warn() {}, info() {}, log() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
    };
  };
  const warn = console.warn;
  console.warn = () => {};
  try {
    await fn({ client, store });
  } finally {
    console.warn = warn;
    server.close();
  }
}

// Račun z lastnim profilom (letnica rojstva `born`), potrjen e-naslov.
async function account(client, store, email, born) {
  const call = client();
  const y = new Date().getFullYear() - born;
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, country: "SI", birth_date: `${y}-01-15` } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run(email);
  const s = await call("/api/students", { method: "POST", body: { name: "Maja", self: true, consent: true } });
  assert.equal(s.status, 201, JSON.stringify(s.body));
  return { call, sid: s.body.id };
}
const setPilot = (store, email, on = true) => store.db.prepare(`UPDATE parents SET pilot_at = ${on ? "datetime('now')" : "NULL"} WHERE email = ?`).run(email);

test("pilot: naloge vidijo samo člani pilota, drugi dobijo member:false in 403", async () => {
  await withServer(async ({ client, store }) => {
    const { call, sid } = await account(client, store, "ne@pilot.si", 20);
    assert.deepEqual((await call(`/api/students/${sid}/pilot`)).body, { member: false });
    assert.equal((await call(`/api/students/${sid}/pilot/flag`, { method: "POST", body: {} })).status, 403);
    assert.equal((await call(`/api/students/${sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true } })).status, 403);
    setPilot(store, "ne@pilot.si");
    const st = (await call(`/api/students/${sid}/pilot`)).body;
    assert.equal(st.member, true);
    assert.equal(st.intro, true);
    assert.equal(st.total, TOTAL);
    assert.equal(st.done, 0);
    assert.equal(st.surveyOpen, false);
    // Prijava napake v aplikaciji iz klepeta (zastavica): član pilota sme (test teče na 127.0.0.1, ki šteje kot skrbnik,
    // zato zavrnitev nečlana preverja test/reports.test.js prek isPilot).
    assert.equal((await call(`/api/students/${sid}/bug`, { method: "POST", body: { note: "Gumb ne dela" } })).status, 201);
    // Obvestilo enkrat.
    const seen = await call(`/api/students/${sid}/pilot/seen`, { method: "POST", body: { what: "intro" } });
    assert.equal(seen.body.intro, false);
    assert.equal((await call(`/api/students/${sid}/pilot/seen`, { method: "POST", body: { what: "x" } })).status, 400);
  });
});

test("pilot: nagrada (XP in značka) samo enkrat na točko", async () => {
  await withServer(async ({ client, store }) => {
    const { call, sid } = await account(client, store, "da@pilot.si", 18);
    setPilot(store, "da@pilot.si");
    const xp = () => store.db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM xp_events WHERE student_id = ? AND reason LIKE 'pilot:%'").get(sid).s;
    const a = await call(`/api/students/${sid}/pilot/scan`, { method: "POST", body: { cond: "dark", ok: false, note: "Maja: ulomek prebran kot 12" } });
    assert.equal(a.status, 200);
    assert.equal(a.body.gained, XP.scan);
    assert.equal(a.body.badge, true);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM knowledge_items WHERE student_id = ? AND item = 'pilot'").get(sid).n, 1);
    // Ponovna ocena istega pogoja: nova ocena velja, XP ne.
    const b = await call(`/api/students/${sid}/pilot/scan`, { method: "POST", body: { cond: "dark", ok: true } });
    assert.equal(b.body.gained, 0);
    assert.equal(b.body.scans.dark.ok, true);
    assert.equal(xp(), XP.scan);
    for (let i = 0; i < 3; i++) await call(`/api/students/${sid}/pilot/flag`, { method: "POST", body: {} });
    const f1 = await call(`/api/students/${sid}/pilot/feature`, { method: "POST", body: { feature: "chat", ok: false } });
    assert.equal(f1.body.gained, XP.feature);
    const f2 = await call(`/api/students/${sid}/pilot/feature`, { method: "POST", body: { feature: "chat", note: "Odgovor je počasen" } });
    assert.equal(f2.body.gained, 0);
    assert.equal(f2.body.features.chat.ok, false); // opomba ne spremeni ocene
    assert.equal((await call(`/api/students/${sid}/pilot/feature`, { method: "POST", body: { feature: "admin", ok: true } })).status, 400);
    assert.equal(xp(), XP.scan + XP.flag + XP.feature);
    const st = (await call(`/api/students/${sid}/pilot`)).body;
    assert.equal(st.done, 3);
    // Anketa šele po enem tednu, nato enkrat XP.
    const ans = { answers: { overall: 5, tutor: 4, scan: 3, school: 4 }, improve: "scan" };
    assert.equal((await call(`/api/students/${sid}/pilot/survey`, { method: "POST", body: ans })).status, 409);
    store.db.prepare("UPDATE pilot_state SET joined_at = datetime('now', '-8 days') WHERE student_id = ?").run(sid);
    assert.equal((await call(`/api/students/${sid}/pilot`)).body.surveyNotice, true);
    assert.equal((await call(`/api/students/${sid}/pilot/survey`, { method: "POST", body: { answers: { overall: 6 }, improve: "scan" } })).status, 400);
    assert.equal((await call(`/api/students/${sid}/pilot/survey`, { method: "POST", body: ans })).body.gained, XP.survey);
    assert.equal((await call(`/api/students/${sid}/pilot/survey`, { method: "POST", body: ans })).body.gained, 0);
    assert.equal(xp(), XP.scan + XP.flag + XP.feature + XP.survey);

    // Skrbnik pri enem članu: deleži, povprečja in opombe so skriti (prag MIN_GROUP = 3), da ne razkrijejo osebe.
    let r = pilotTasksReport(store.db);
    assert.equal(r.members, 1);
    assert.equal(r.scans.find((s) => s.cond === "dark").ok, null);
    assert.equal(r.scans.find((s) => s.cond === "dark").rate, null);
    assert.equal(r.features.find((f) => f.feature === "chat").bad, null);
    assert.equal(r.survey.avg.overall, null);
    assert.equal(r.survey.improve, null);
    assert.equal(r.survey.hidden, true);
    assert.deepEqual(r.notes, []);
    assert.equal(r.notesHidden, true);
    // Še dva člana: od treh odgovorov naprej so vsote vidne; ime v opombi je zamenjano.
    for (const e of ["b@pilot.si", "c@pilot.si"]) {
      const o = await account(client, store, e, 18);
      setPilot(store, e);
      await o.call(`/api/students/${o.sid}/pilot/scan`, { method: "POST", body: { cond: "dark", ok: false, note: "Maja: koren narobe" } });
      await o.call(`/api/students/${o.sid}/pilot/feature`, { method: "POST", body: { feature: "chat", ok: false, note: "Počasno" } });
      store.db.prepare("UPDATE pilot_state SET joined_at = datetime('now', '-8 days') WHERE student_id = ?").run(o.sid);
      assert.equal((await o.call(`/api/students/${o.sid}/pilot/survey`, { method: "POST", body: ans })).status, 200);
    }
    r = pilotTasksReport(store.db);
    assert.equal(r.members, 3);
    assert.equal(r.scans.find((s) => s.cond === "dark").n, 3);
    assert.equal(r.scans.find((s) => s.cond === "dark").ok, 1);
    assert.equal(r.features.find((f) => f.feature === "chat").bad, 3);
    assert.equal(r.survey.avg.overall, 5);
    assert.equal(r.survey.improve.scan, 3);
    assert.ok(r.notes.length >= 3);
    assert.equal(r.notes.some((n) => /Maja/.test(n.note)), false);
    // Jutranji pregled: samo števila, brez opomb in brez imen ali e-naslovov.
    const md = pilotTasksMarkdown(r);
    assert.doesNotMatch(md, /Maja|@pilot|počasen|Počasno|koren/);
    assert.match(md, /\| dark \| 3 \| 1 \| 33 % \|/);
    // Odstranjen član ne šteje več med člane.
    setPilot(store, "c@pilot.si", false);
    assert.equal(pilotTasksReport(store.db).members, 2);
  });
});

test("pilot: fotografija samo ob soglasju, samo od 15 let, izbris in rok hrambe", async () => {
  await withServer(async ({ client, store }) => {
    const adult = await account(client, store, "foto@pilot.si", 18);
    const teen = await account(client, store, "mlad@pilot.si", 15); // letos dopolni 15: še štejemo kot mlajšega
    setPilot(store, "foto@pilot.si");
    setPilot(store, "mlad@pilot.si");
    const photos = () => store.db.prepare("SELECT COUNT(*) AS n FROM pilot_photos").get().n;
    // Brez kljukice: slika se ne shrani, ocena pa.
    let r = await adult.call(`/api/students/${adult.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, image: IMG } });
    assert.equal(r.status, 200);
    assert.equal(photos(), 0);
    assert.equal(r.body.photo.allowed, true);
    // S soglasjem: shranjena, šifrirana ali ne, z besedilom soglasja.
    r = await adult.call(`/api/students/${adult.sid}/pilot/scan`, { method: "POST", body: { cond: "board", ok: false, image: IMG, consent: true, problems: ["x^2=4"] } });
    assert.equal(r.body.scans.board.photo, true);
    assert.equal(photos(), 1);
    assert.match(store.db.prepare("SELECT consent FROM pilot_photos").get().consent, /30 dni/);
    assert.equal((await adult.call(`/api/students/${adult.sid}/pilot/scan`, { method: "POST", body: { cond: "screen", ok: true, image: "data:text/html;base64,AAAA", consent: true } })).status, 400);
    // Mlajši od 15: kljukice ni, poskus s soglasjem zavrnjen in nič shranjeno.
    assert.equal((await teen.call(`/api/students/${teen.sid}/pilot`)).body.photo.allowed, false);
    r = await teen.call(`/api/students/${teen.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, image: IMG, consent: true } });
    assert.equal(r.status, 403);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_scans WHERE student_id = ?").get(teen.sid).n, 0);
    // Tuj profil: zaklenjen (dostop do profila preverja server/accounts).
    assert.notEqual((await teen.call(`/api/students/${adult.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true } })).status, 200);
    // Izbris svoje fotografije.
    r = await adult.call(`/api/students/${adult.sid}/pilot/scan/board/photo`, { method: "DELETE" });
    assert.equal(r.body.scans.board.photo, false);
    assert.equal(r.body.scans.board.ok, false);
    assert.equal(photos(), 0);
    // Rok hrambe.
    await adult.call(`/api/students/${adult.sid}/pilot/scan`, { method: "POST", body: { cond: "many", ok: true, image: IMG, consent: true } });
    store.db.prepare("UPDATE pilot_photos SET created_at = datetime('now', '-31 days')").run();
    assert.equal(runRetention(store.db, { log: { log() {}, info() {}, warn() {}, error() {} } }).pilotPhotos, 1);
    assert.equal(photos(), 0);
    // Izvoz podatkov vsebuje ocene.
    const ex = await adult.call("/api/account/export", { method: "POST", body: { password: "geslo1234" } });
    assert.equal(ex.status, 200);
    const kid = ex.body.children.find((c) => c.pilot);
    assert.ok(kid && kid.pilot.scans.length >= 1);
    // Ocene niso izvožene dvakrat (enkrat v children[].pilot, ne še v other).
    assert.ok(!JSON.stringify(ex.body.other || {}).includes("pilot_scans"));
  });
});

test("pilot: skrbnik doda člana po e-naslovu, drugi ne", async () => {
  process.env.EVKLID_ADMIN_EMAILS = "skrbnik@pilot.si";
  try {
    await withServer(async ({ client, store }) => {
      const admin = await account(client, store, "skrbnik@pilot.si", 30);
      const m = await account(client, store, "clan@pilot.si", 19);
      assert.equal((await m.call("/api/admin/pilot-naloge")).status, 403);
      assert.equal((await m.call("/api/admin/pilot-naloge/clani", { method: "POST", body: { email: "clan@pilot.si" } })).status, 403);
      assert.equal((await admin.call("/api/admin/pilot-naloge/clani", { method: "POST", body: { email: "nihce@pilot.si" } })).status, 404);
      assert.equal((await admin.call("/api/admin/pilot-naloge/clani", { method: "POST", body: { email: "clan@pilot.si" } })).status, 200);
      assert.equal((await m.call(`/api/students/${m.sid}/pilot`)).body.member, true);
      const r = (await admin.call("/api/admin/pilot-naloge")).body;
      assert.deepEqual(r.accounts, ["clan@pilot.si"]);
      assert.equal(r.scans.length, SCAN_CONDITIONS.length);
      await admin.call("/api/admin/pilot-naloge/clani", { method: "POST", body: { email: "clan@pilot.si", on: false } });
      assert.equal((await m.call(`/api/students/${m.sid}/pilot`)).body.member, false);
    });
  } finally {
    delete process.env.EVKLID_ADMIN_EMAILS;
  }
});

test("pilot: besedila so v slovenskem katalogu (vsi jeziki: test/i18n.test.js)", () => {
  for (const k of ["pn.title", "pn.ok", "pn.bad", "pn.photoSave", "pn.photoRules", "pn.photoAi", "pn.later", "pilot.n.title"]) assert.ok(SL[k], k);
  for (const c of SCAN_CONDITIONS) assert.ok(SL[`pn.cond.${c}`], c);
});

test("pilot: prijava napake v aplikaciji (zastavica v klepetu) samo za skrbnika in člane pilota", async () => {
  const { default: express } = await import("express");
  const { mountReports } = await import("../server/reports.js");
  const store = openDb(":memory:");
  const a = store.db.prepare("INSERT INTO students (name, settings) VALUES ('A', '{}')").run().lastInsertRowid;
  const b = store.db.prepare("INSERT INTO students (name, settings) VALUES ('B', '{}')").run().lastInsertRowid;
  const app = express();
  app.use(express.json());
  const loadStudent = (req, res) => store.getStudent(Number(req.params.id)) || (res.status(404).json({}), null);
  mountReports(app, store, { loadStudent, loadConversation: () => null, localOnly: (q, r, n) => n(), isAdmin: () => false, isPilot: (id) => id === a });
  const server = app.listen(0);
  const post = (id) => fetch(`http://127.0.0.1:${server.address().port}/api/students/${id}/bug`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note: "Ne dela" }) });
  const warn = console.warn;
  console.warn = () => {};
  try {
    assert.equal((await post(a)).status, 201);
    assert.equal((await post(b)).status, 403);
  } finally {
    console.warn = warn;
    server.close();
  }
});

test("pilot: odjemalec pošlje fotografijo samo ob kljukici in samo, kjer jo smemo ponuditi", async () => {
  const fs = await import("node:fs");
  const read = (p) => fs.readFileSync(new URL(`../public/${p}`, import.meta.url), "utf8");
  const scan = read("scan/scan.js");
  assert.match(scan, /image: consent \? S\.shot : undefined/);
  assert.match(scan, /\$\{photo \? `<label class="pn-consent">/); // kljukica samo, ko photo.allowed
  assert.match(read("pilot-naloge.js"), /if \(consent && image && s\.photo\.allowed\)/);
  // Značka »Pilot« je skrita vsem, ki je nimajo (zbirke in deljena kartica).
  const { KNOWLEDGE } = await import("../public/zbirke.js");
  const { shareCardModel } = await import("../public/deli-kartico.js");
  assert.equal(KNOWLEDGE.find((x) => x.id === "pilot")?.hidden, true);
  const of = (items) => shareCardModel({ items }).collections.find((c) => c.id === "lige").of;
  assert.equal(of([{ id: "pilot" }]), of([]) + 1);
});

test("pilot: povzetek za jutranji pregled (scripts/pilot-naloge.js) brez imen in e-naslovov", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const path = await import("node:path");
  const { execFileSync } = await import("node:child_process");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pilot-"));
  const file = path.join(dir, "t.db");
  const store = openDb(file);
  store.db.prepare("INSERT INTO students (id, name, settings) VALUES (1, 'Ana', '{}')").run();
  const { migratePilotTasks } = await import("../server/pilot-naloge.js");
  migratePilotTasks(store.db);
  store.db.exec("INSERT INTO pilot_state (student_id) VALUES (1); INSERT INTO pilot_scans (student_id, cond, ok) VALUES (1, 'board', 0)");
  store.db.close?.();
  const out = execFileSync(process.execPath, ["scripts/pilot-naloge.js"], { env: { ...process.env, EVKLID_DB: file }, encoding: "utf8", cwd: new URL("..", import.meta.url).pathname });
  assert.match(out, /# Pilot: naloge članov/);
  assert.match(out, /\| board \| 1 \| – \| – \|/); // ena ocena: pod pragom (MIN_GROUP) brez deleža
  assert.doesNotMatch(out, /Ana/);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("pilot: soglasje z jezikom in rokom, prepis samo s fotografijo, magični bajti, dnevna meja", async () => {
  await withServer(async ({ client, store }) => {
    const a = await account(client, store, "zapis@pilot.si", 18);
    setPilot(store, "zapis@pilot.si");
    // Brez fotografije: prepis se ne shrani (otrok bere »samo ocena in opomba«).
    await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, problems: ["Ime: Maja Novak"] } });
    assert.equal(store.db.prepare("SELECT problems FROM pilot_scans WHERE cond = 'light'").get().problems, null);
    // S fotografijo: prepis (šifriran), soglasje kot JSON z različico in jezikom, rok izbrisa.
    const r = await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "board", ok: true, image: IMG, consent: true, problems: ["x^2=4"], lang: "de" } });
    assert.equal(r.status, 200);
    assert.notEqual(store.db.prepare("SELECT problems FROM pilot_scans WHERE cond = 'board'").get().problems, null);
    const ph = store.db.prepare("SELECT image, consent, expires_at, julianday(expires_at) - julianday(created_at) AS d FROM pilot_photos").get();
    assert.ok(!ph.image.startsWith("data:image/"));
    const c = JSON.parse(ph.consent);
    assert.equal(c.v, 2);
    assert.equal(c.lang, "de");
    assert.equal(c.days, 30);
    assert.match(c.text, /prebere umetna inteligenca/);
    assert.match(c.text, /Shranjene kopije ne pošljemo nikomur/);
    assert.ok(Math.abs(ph.d - 30) < 0.01, `rok ${ph.d}`);
    // Ponovna ocena s fotografijo obdrži novi prepis; izbris fotografije izbriše tudi prepis (sprožilec).
    await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "board", ok: false, image: IMG, consent: true, problems: ["y=2x"] } });
    assert.notEqual(store.db.prepare("SELECT problems FROM pilot_scans WHERE cond = 'board'").get().problems, null);
    await a.call(`/api/students/${a.sid}/pilot/scan/board/photo`, { method: "DELETE" });
    assert.equal(store.db.prepare("SELECT problems FROM pilot_scans WHERE cond = 'board'").get().problems, null);
    await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "board", ok: true, image: IMG, consent: true, problems: ["x^2=4"], lang: "de" } });
    // Napačne slike: tip ne ustreza bajtom, ni niz, prevelika.
    for (const image of ["data:image/png;base64,/9j/4AAQSkZJRgABAQ==", { x: 1 }, `data:image/jpeg;base64,/9j/${"A".repeat(2 * 1024 * 1024)}`])
      assert.equal((await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "screen", ok: true, image, consent: true } })).status, 400);
    // Dnevna meja shranjenih fotografij.
    store.db.prepare("UPDATE pilot_state SET photo_day = date('now'), photo_n = ? WHERE student_id = ?").run(PHOTO_DAILY_MAX, a.sid);
    assert.equal((await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "many", ok: true, image: IMG, consent: true } })).status, 429);
    // Daljši rok v nastavitvi ne velja (največ 30 dni).
    process.env.EVKLID_PILOT_PHOTO_DAYS = "90";
    try {
      const { photoDays } = await import("../server/pilot-naloge.js");
      assert.equal(photoDays(), 30);
    } finally {
      delete process.env.EVKLID_PILOT_PHOTO_DAYS;
    }
  });
});

test("pilot: starš vidi pilot in fotografije v Računu, izstop iz pilota izbriše fotografije", async () => {
  await withServer(async ({ client, store }) => {
    const a = await account(client, store, "stars@pilot.si", 18);
    const b = await account(client, store, "drug@pilot.si", 18);
    setPilot(store, "stars@pilot.si");
    await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "board", ok: true, image: IMG, consent: true } });
    await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, image: IMG, consent: true } });
    const acc = (await a.call("/api/account")).body;
    assert.deepEqual(acc.children.find((c) => c.id === a.sid).pilot, { member: true, photos: 2 });
    // Tuj račun ne more izbrisati fotografij drugega.
    assert.equal((await b.call(`/api/account/pilot-photos/${a.sid}`, { method: "DELETE" })).status, 404);
    // Bivši član (npr. potekla šolska licenca) še vidi, kje so fotografije, in jih lahko izbriše.
    setPilot(store, "stars@pilot.si", false);
    const st = (await a.call(`/api/students/${a.sid}/pilot`)).body;
    assert.deepEqual(st, { member: false, photos: ["board", "light"] });
    const del = await a.call(`/api/account/pilot-photos/${a.sid}`, { method: "DELETE" });
    assert.equal(del.status, 200);
    assert.deepEqual({ member: del.body.member, photos: del.body.photos, deleted: del.body.deleted }, { member: false, photos: 0, deleted: 2 });
    // Skrbnik odstrani račun iz pilota: fotografije gredo takoj.
    setPilot(store, "stars@pilot.si");
    await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "dark", ok: true, image: IMG, consent: true } });
    store.db.prepare("UPDATE parents SET is_admin = 1 WHERE email = 'drug@pilot.si'").run();
    assert.equal((await b.call("/api/admin/pilot-naloge/clani", { method: "POST", body: { email: "stars@pilot.si", on: false } })).status, 200);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_photos").get().n, 0);
    // Učenec z vsemi fotografijami naenkrat (DELETE …/pilot/photos) dela tudi za bivšega člana.
    assert.equal((await a.call(`/api/students/${a.sid}/pilot/photos`, { method: "DELETE" })).status, 200);
  });
});

test("pilot: XP iz nalog šteje na profilu, v ligah ne; varnostna kopija je brez fotografij", async () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  store.db.prepare("INSERT INTO xp_events (student_id, amount, reason) VALUES (?, 20, 'pilot: survey'), (?, 7, 'naloga')").run(s.id, s.id);
  const lg = new Leagues(store);
  const m = lg.xpBetween([s.id], "2000-01-01", "2999-01-01");
  assert.equal(m.get(s.id), 7);
  // Kopija: VACUUM INTO, nato brez pilot_photos.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-pilot-kopija-"));
  try {
    const file = path.join(dir, "k.db");
    const src = new DatabaseSync(":memory:");
    src.exec("CREATE TABLE pilot_photos (scan_id INTEGER PRIMARY KEY, image TEXT); INSERT INTO pilot_photos VALUES (1, 'x'), (2, 'y');");
    src.exec(`VACUUM INTO '${file}'`);
    src.close();
    assert.equal(withoutPilotPhotos(file), 2);
    const k = new DatabaseSync(file, { readOnly: true });
    assert.equal(k.prepare("SELECT COUNT(*) AS n FROM pilot_photos").get().n, 0);
    k.close();
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("pilot: soglasje za fotografijo pove, da jo ob branju prebere ponudnik AI, shranjene kopije pa ne dobi", async () => {
  const fs = await import("node:fs");
  assert.match(SL["pn.photoAi"], /prebere umetna inteligenca/);
  assert.doesNotMatch(JSON.stringify(SL["pn.photoRules"]), /ne pošljemo, tudi ne ponudniku/);
  const scan = fs.readFileSync(new URL("../public/scan/scan.js", import.meta.url), "utf8");
  assert.match(scan, /t\("pn\.photoAi"\)/);
});
