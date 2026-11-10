// Pregled B3 (krog 3) PR #474: napadi na nove dele (preizkus znanja, plačilo, obvestilo o zasebnosti, skrbniški pogled).
// Vsak test opisuje napad iz pregleda; vsi so zdaj zaprti (j, 6. 11.). B3-9 (lestvica namestitve) je zunaj tega PR.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { impactReport } from "../server/pilot-ucinek.js";
import { pilotTasksReport, dropFormerPhotos, PHOTO_CONSENT_TEXT } from "../server/pilot-naloge.js";
import SL from "../public/i18n/sl.js";
import { recipients, sendAll } from "../scripts/obvestilo-zasebnost.js";
import { PRIVACY_VERSION } from "../server/accounts/plans.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const IMG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ==";
const quiet = { error() {}, warn() {}, info() {}, log() {} };
const mail = { accounts: true, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "e" }) }) };

async function withServer(opts, fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: quiet, ...mail, ...opts });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, o = {}) => {
      const res = await fetch(base + path, {
        method: o.method || "GET",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: o.body ? JSON.stringify(o.body) : undefined,
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      return { status: res.status, body: await res.json().catch(() => null) };
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

async function account(client, store, email, age, { pilot = true, self = true } = {}) {
  const call = client();
  const y = new Date().getFullYear() - age;
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, country: "SI", birth_date: `${y}-01-15` } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  store.db.prepare(`UPDATE parents SET email_verified_at = datetime('now'), pilot_at = ${pilot ? "datetime('now', '-15 days')" : "NULL"} WHERE email = ?`).run(email);
  let sid = null;
  if (self) {
    const s = await call("/api/students", { method: "POST", body: { name: "Maja", self: true, consent: true } });
    assert.equal(s.status, 201, JSON.stringify(s.body));
    sid = s.body.id;
  }
  return { call, sid, pid: store.db.prepare("SELECT id FROM parents WHERE email = ?").get(email).id };
}

test("B3-1 tuj račun ne more oddati preizkusa, odgovora, obvestila ali izbrisati fotografij drugega profila", async () => {
  await withServer({}, async ({ client, store }) => {
    const a = await account(client, store, "a@b3.si", 40);
    const b = await account(client, store, "b@b3.si", 40);
    assert.equal((await a.call(`/api/students/${a.sid}/pilot/quiz`, { method: "POST", body: { phase: "pre" } })).status, 200);
    await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, image: IMG, consent: true } });
    for (const [path, method, body] of [
      [`/api/students/${a.sid}/pilot/quiz`, "POST", { phase: "pre" }],
      [`/api/students/${a.sid}/pilot/quiz/answer`, "POST", { phase: "pre", index: 0, skip: true }],
      [`/api/students/${a.sid}/pilot/seen`, "POST", { what: "intro" }],
      [`/api/students/${a.sid}/pilot/photos`, "DELETE"],
      [`/api/students/${a.sid}/pilot/scan/light/photo`, "DELETE"],
      [`/api/account/pilot-photos/${a.sid}`, "DELETE"],
      [`/api/students/%3${String(a.sid).slice(-1)}/pilot/quiz/answer`, "POST", { phase: "pre", index: 0, skip: true }],
      [`/api/admin/pilot-naloge`, "GET"],
    ]) {
      const r = await b.call(path, { method, body });
      assert.ok([403, 404].includes(r.status), `${method} ${path} → ${r.status}`);
    }
    assert.equal(JSON.parse(store.db.prepare("SELECT answers FROM pilot_quiz WHERE student_id = ?").get(a.sid).answers)[0], null);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_photos").get().n, 1);
  });
});

test("B3-2 XP: vzporedni zadnji odgovori, ponovni začetek, »Ne vem« ×6 ne dajo več kot 2 × XP.quiz", async () => {
  await withServer({}, async ({ client, store }) => {
    const a = await account(client, store, "xp@b3.si", 40);
    await a.call(`/api/students/${a.sid}/pilot/quiz`, { method: "POST", body: { phase: "pre" } });
    for (let i = 0; i < 5; i++) await a.call(`/api/students/${a.sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: i, skip: true } });
    const rs = await Promise.all(Array.from({ length: 8 }, () => a.call(`/api/students/${a.sid}/pilot/quiz/answer`, { method: "POST", body: { phase: "pre", index: 5, skip: true } })));
    assert.equal(rs.filter((r) => r.status === 200).length, 1);
    await a.call(`/api/students/${a.sid}/pilot/quiz`, { method: "POST", body: { phase: "pre" } });
    const n = store.db.prepare("SELECT COALESCE(SUM(amount),0) AS n FROM xp_events WHERE student_id = ? AND reason LIKE 'pilot: quiz%'").get(a.sid).n;
    assert.equal(n, 10);
  });
});

test("B3-3 plačilo: brez gesla računa ga ne odda nihče na seji (otrok na starševi napravi)", async () => {
  await withServer({}, async ({ client, store }) => {
    const a = await account(client, store, "stars@b3.si", 40, { self: false });
    // starš doda profil 10-letnika; otrok dobi napravo (ista seja, kot je v družini običajno)
    const k = await a.call("/api/students", { method: "POST", body: { name: "Tim", birth_year: new Date().getFullYear() - 10, consent: true } });
    assert.equal(k.status, 201, JSON.stringify(k.body));
    await a.call(`/api/students/${k.body.id}/pilot`);
    // Otrok: brez gesla računa in brez odklepa → pričakovano 403 (ali vsaj potrditev z geslom računa).
    store.db.prepare("UPDATE parents SET pilot_at = datetime('now', '-15 days') WHERE id = ?").run(a.pid);
    const r = await a.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "no" } });
    assert.ok([401, 403].includes(r.status), "odgovor o plačilu brez gesla računa se ne shrani");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_wtp").get().n, 0);
  });
});

test("B3-4 obvestilo o zasebnosti: brez gesla računa ga nihče na napravi ne skrije", async () => {
  await withServer({}, async ({ client, store }) => {
    const a = await account(client, store, "obv@b3.si", 40, { pilot: false });
    store.db.prepare("UPDATE parents SET privacy_version = '2026-10-29' WHERE id = ?").run(a.pid);
    const st = (await a.call("/api/account/status")).body;
    assert.ok(st.parent.privacy_notice);
    // public/account.js:462 pokaže obvestilo, ko je account_unlocked; pričakovali bi, da ga otrok (brez gesla) ne more potrditi.
    const r = await a.call("/api/account/privacy-seen", { method: "POST" });
    assert.ok([401, 403].includes(r.status), "otrok na starševi napravi ne potrdi obvestila namesto starša");
    assert.ok((await a.call("/api/account/status")).body.parent.privacy_notice, "pasica ostane");
  });
});

test("B3-5 /api/account/pilot-photos/:sid ne obide gesla profila brata ali zaklepa računa", async () => {
  await withServer({ accountLock: true }, async ({ client, store }) => {
    const a = await account(client, store, "druz@b3.si", 45, { self: false });
    const y = new Date().getFullYear() - 16;
    const s1 = (await a.call("/api/students", { method: "POST", body: { name: "Brat", birth_year: y, consent: true, profile_password: "brat1234" } })).body;
    const s2 = (await a.call("/api/students", { method: "POST", body: { name: "Sestra", birth_year: y, consent: true, profile_password: "sestra1234" } })).body;
    assert.ok(s1.id && s2.id, JSON.stringify([s1, s2]));
    const sc = await a.call(`/api/students/${s2.id}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, image: IMG, consent: true } });
    assert.equal(sc.status, 200, JSON.stringify(sc.body));
    // Naprava zaklenjena (račun in profila), na njej je brat.
    await a.call("/api/account/lock", { method: "POST" });
    store.db.prepare("DELETE FROM profile_unlocks").run();
    assert.equal((await a.call(`/api/students/${s2.id}/pilot/photos`, { method: "DELETE" })).status, 423, "pot profila je zaklenjena");
    const r = await a.call(`/api/account/pilot-photos/${s2.id}`, { method: "DELETE" });
    assert.ok([403, 423].includes(r.status), `pot Računa vrne ${r.status}`);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_photos WHERE student_id = ?").get(s2.id).n, 1, "sestrine fotografije ostanejo");
  });
});

test("B3-6 skrbnik: iz razlike dveh zaporednih poročil se rezultat posameznega učenca ne da izračunati", () => {
  const store = openDb(":memory:");
  const db = store.db;
  impactReport(db, 3);
  const ids = [1, 2, 3, 4, 5, 6].map((i) => Number(db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`U${i}`).lastInsertRowid));
  const add = (sid, score) => db.prepare("INSERT INTO pilot_quiz (student_id, phase, topic_id, items, answers, score, finished_at) VALUES (?, 'pre', 't', '[0,0,0,0,0,0]', '[0,0,0,0,0,0]', ?, datetime('now'))").run(sid, score);
  add(ids[0], 2);
  add(ids[1], 5);
  add(ids[2], 3);
  const r3 = impactReport(db, 3).quiz;
  add(ids[3], 1); // četrti učenec (skrbnik ve, kdo je ravnokar končal: pilot_add v dnevniku, e-naslovi v poročilu)
  const r4 = impactReport(db, 3).quiz;
  const leaked = Math.round((r4.pre * r4.nPre - r3.pre * r3.nPre) * 6);
  assert.notEqual(leaked, 1, "rezultat četrtega učenca je izračunljiv iz dveh poročil");
  assert.equal(r4.pre, r3.pre, "vsota se osveži šele po 3 novih");
  // Tudi s »prikazanimi« števili (shownPre) se razlika ne da izračunati: paket ostane enak.
  assert.equal(r4.shownPre, r3.shownPre);
  add(5, 6);
  add(6, 6);
  const r6 = impactReport(db, 3).quiz;
  assert.equal(r6.shownPre, 6);
  assert.notEqual(r6.pre, r3.pre);
});

test("B3-7 plačilo: pri 3 enakih odgovorih skrbnik ne vidi porazdelitve, e-naslovi niso na isti strani", async () => {
  await withServer({}, async ({ client, store }) => {
    const ppl = [];
    for (const e of ["p1@b3.si", "p2@b3.si", "p3@b3.si"]) {
      const x = await account(client, store, e, 40);
      await x.call(`/api/students/${x.sid}/pilot`);
      assert.equal((await x.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "no", password: "geslo1234" } })).status, 200);
      ppl.push(x);
    }
    store.db.prepare("UPDATE parents SET is_admin = 1 WHERE email = 'p1@b3.si'").run();
    const rep = (await ppl[0].call("/api/admin/pilot-naloge")).body;
    assert.equal(rep.accounts, undefined, "e-naslovov ni na strani z vsotami");
    assert.equal(rep.impact.wtp.pay, null, "pod 5 odgovori ni porazdelitve");
    assert.equal(rep.impact.wtp.n, "< 5");
    assert.doesNotMatch(JSON.stringify(rep), /@b3\.si/);
  });
});

test("B3-8 izbris profila in računa pobriše vse nove tabele; izvoz jih vsebuje", async () => {
  await withServer({}, async ({ client, store }) => {
    const db = store.db;
    const a = await account(client, store, "gdpr@b3.si", 40);
    await a.call(`/api/students/${a.sid}/pilot/quiz`, { method: "POST", body: { phase: "pre" } });
    await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, note: "x", image: IMG, consent: true } });
    await a.call(`/api/students/${a.sid}/pilot/flag`, { method: "POST" });
    assert.equal((await a.call("/api/account/pilot-wtp", { method: "POST", body: { pay: "skip", password: "geslo1234" } })).status, 200);
    const exp = (await a.call("/api/account/export", { method: "POST", body: { password: "geslo1234" } })).body;
    const s = JSON.stringify(exp);
    for (const t of ["pilot_quiz", "pilot_wtp", "pilot_rewards", "pilot_state", "pilot_photos"]) assert.match(s, new RegExp(t), t);
    assert.equal((await a.call("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    for (const t of ["pilot_quiz", "pilot_wtp", "pilot_rewards", "pilot_state", "pilot_photos", "pilot_scans"]) assert.equal(db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n, 0, t);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM xp_events WHERE reason LIKE 'pilot:%'").get().n, 0);
  });
});

test("A3 P1-1: shranjeno besedilo soglasja je natanko to, kar otrok vidi ob kljukici (s stavkom o izbrisu)", () => {
  const rules = SL["pn.photoRules"].other.replace("{n}", "30");
  assert.equal(PHOTO_CONSENT_TEXT(30), `${SL["pn.photoSave"]}. ${rules} ${SL["pn.photoAi"]}`);
  assert.match(SL["pn.photoAi"], /Prej ju lahko izbrišeš pod »Pomagaj izboljšati Evklid«\./);
});

test("A3 P2-3 / B3-5: bivšemu članu (šoli je potekla licenca) se fotografije izbrišejo pri dnevnem čiščenju", async () => {
  await withServer({}, async ({ client, store }) => {
    const a = await account(client, store, "biv@b3.si", 40);
    assert.equal((await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, image: IMG, consent: true } })).status, 200);
    assert.equal(dropFormerPhotos(store.db), 0, "član: fotografija ostane");
    store.db.prepare("UPDATE parents SET pilot_at = NULL WHERE id = ?").run(a.pid); // ne prek skrbnika (npr. šolska licenca)
    assert.equal(dropFormerPhotos(store.db), 1);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_photos").get().n, 0);
  });
});

test("anketa: razlika dveh zaporednih poročil ne razkrije ocene četrtega", () => {
  const db = openDb(":memory:").db;
  pilotTasksReport(db);
  const add = (i, v) => {
    const sid = Number(db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`S${i}`).lastInsertRowid);
    db.prepare("INSERT INTO pilot_survey (student_id, answers, created_at) VALUES (?, ?, datetime('now', ?))").run(sid, JSON.stringify({ overall: v, tutor: v, scan: v, school: v, improve: "scan" }), `+${i} seconds`);
  };
  [5, 4, 3].forEach((v, i) => add(i, v));
  const r3 = pilotTasksReport(db).survey;
  add(3, 1);
  const r4 = pilotTasksReport(db).survey;
  assert.equal(r4.avg.overall, r3.avg.overall);
  assert.equal(r4.shown, 3);
  assert.equal(r4.n, 4);
});

test("e-pošta o novi politiki: brez --poslji nič, nato vsak potrjen obstoječi račun enkrat", async () => {
  await withServer({}, async ({ client, store }) => {
    const db = store.db;
    const a = await account(client, store, "staro@b3.si", 40, { pilot: false });
    const b = await account(client, store, "novo@b3.si", 40, { pilot: false });
    const c = await account(client, store, "nepotrjen@b3.si", 40, { pilot: false });
    db.prepare("UPDATE parents SET privacy_version = '2026-10-29' WHERE id IN (?, ?)").run(a.pid, c.pid);
    db.prepare("UPDATE parents SET email_verified_at = NULL WHERE id = ?").run(c.pid);
    assert.deepEqual(recipients(db).map((r) => r.email), ["staro@b3.si"], "nov račun in nepotrjen naslov ne");
    const sent = [];
    const mailer = { send: async (m) => sent.push(m) };
    assert.deepEqual(await sendAll(db, mailer, { baseUrl: "https://evklid.si", pause: 0 }), { sent: 1, failed: 0 });
    assert.equal(sent[0].to, "staro@b3.si");
    assert.match(sent[0].text, /https:\/\/evklid\.si\/zasebnost\.html/);
    assert.match(sent[0].text, /Nič vam ni treba narediti\./);
    assert.deepEqual(await sendAll(db, mailer), { sent: 0, failed: 0 }, "drugič nič");
    assert.equal(db.prepare("SELECT period FROM email_log WHERE kind = 'privacy'").get().period, PRIVACY_VERSION);
    void b;
  });
});
