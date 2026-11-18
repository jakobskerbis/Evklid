// Neaktivni računi (server/accounts/neaktivni.js, j 18. 11. 2026): obvestilo po 12 mesecih, izbris po 24 mesecih,
// brez dvojnih sporočil, brez e-pošte mladoletnim, izklopljeno brez EVKLID_NEAKTIVNI=1. E-pošta je lažna (fetchFn).
import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { openDb } from "../server/db.js";
import { mountAccounts } from "../server/accounts/index.js";
import { runInactive, NEAKTIVNI } from "../server/accounts/neaktivni.js";

const DAY = 86400000;
const YEAR = new Date().getFullYear();
const sqlTime = (ms) => new Date(ms).toISOString().replace("T", " ").slice(0, 19);

function setup() {
  const store = openDb(":memory:");
  const mails = [];
  const fetchFn = async (url, init = {}) => {
    if (String(url).includes("resend")) mails.push(JSON.parse(init.body));
    return { ok: true, status: 200, json: async () => ({ id: "m" }) };
  };
  const api = mountAccounts(express(), store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn, log: { error() {}, info() {}, warn() {} } });
  const db = store.db;
  let n = 0;
  const parent = (email, { birth = "1985-04-12", ...cols } = {}) => {
    n++;
    const id = Number(
      db
        .prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, email_verified_at, birth_date) VALUES (?, 'x', 'v', ?, ?, datetime('now'), ?)")
        .run(email, `u${n}`, `R${n}`, birth).lastInsertRowid,
    );
    for (const [k, v] of Object.entries(cols)) db.prepare(`UPDATE parents SET ${k} = ? WHERE id = ?`).run(v, id);
    const kid = store.createStudent(`Otrok${n}`);
    db.prepare("UPDATE students SET parent_id = ? WHERE id = ?").run(id, kid.id);
    return { id, kid: kid.id };
  };
  const exists = (id) => !!db.prepare("SELECT 1 FROM parents WHERE id = ?").get(id);
  return { store, db, api, mails, parent, exists };
}

const withFlag = async (v, fn) => {
  const prev = process.env.EVKLID_NEAKTIVNI;
  if (v === undefined) delete process.env.EVKLID_NEAKTIVNI;
  else process.env.EVKLID_NEAKTIVNI = v;
  try {
    return await fn();
  } finally {
    if (prev === undefined) delete process.env.EVKLID_NEAKTIVNI;
    else process.env.EVKLID_NEAKTIVNI = prev;
  }
};
const at = (days) => new Date(Date.now() + days * DAY);

test("neaktivni: brez EVKLID_NEAKTIVNI=1 se ne zgodi nič", async () => {
  const { api, mails, parent, exists } = setup();
  const a = parent("a@x.si");
  for (const v of [undefined, "0"]) {
    await withFlag(v, async () => {
      assert.equal(await api.inactiveDaily(at(800), { force: true }), null);
      assert.equal(await api.inactiveDaily(at(800)), null);
    });
  }
  assert.equal(mails.length, 0);
  assert.ok(exists(a.id));
});

test("neaktivni: obvestilo po 12 mesecih enkrat, izbris po 24 mesecih, prijava ustavi izbris", async () => {
  const { db, api, mails, parent, exists } = setup();
  await withFlag("1", async () => {
    const a = parent("ana@x.si");
    const b = parent("bor@x.si");
    // 364 dni: še nič.
    assert.equal((await api.inactiveDaily(at(364), { force: true })).obvestilo, 0);
    assert.equal(mails.length, 0);
    // 366 dni: obvestilo obema, samo na e-naslov imetnika računa, v slovenščini.
    const r = await api.inactiveDaily(at(366), { force: true });
    assert.equal(r.obvestilo, 2);
    assert.deepEqual(mails.map((m) => m.to[0]).sort(), ["ana@x.si", "bor@x.si"]);
    assert.match(mails[0].subject, /izbrisali/);
    assert.match(mails[0].text, /eno leto niste prijavili/);
    assert.match(mails[0].text, /\?pogled=racun/);
    // Brez dvojnih sporočil: znova isti dan in naslednje dni nič novega.
    await api.inactiveDaily(at(366), { force: true });
    await api.inactiveDaily(at(500), { force: true });
    assert.equal(mails.length, 2);
    // Bor se vrne (prijava/klic API na dan 400): izbris odpade, novega obvestila ni.
    db.prepare("UPDATE parents SET last_active_at = ? WHERE id = ?").run(sqlTime(at(400).getTime()), b.id);
    const del = await api.inactiveDaily(at(731), { force: true });
    assert.equal(del.izbris, 1);
    assert.ok(!exists(a.id), "Ana izbrisana po 24 mesecih");
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM students WHERE parent_id = ?").get(a.id).n, 0, "profili izbrisani");
    assert.ok(exists(b.id), "Bor ostane");
    assert.equal(mails.length, 2);
    // Bor spet eno leto miruje: novo obvestilo za novo obdobje.
    assert.equal((await api.inactiveDaily(at(767), { force: true })).obvestilo, 1);
    assert.equal(mails.length, 3);
    assert.ok(db.prepare("SELECT 1 FROM audit_log WHERE action = 'inactive_deleted'").get());
  });
});

test("neaktivni: brez force enkrat na dan, po 10.00 v Ljubljani", async () => {
  const { api } = setup();
  await withFlag("1", async () => {
    assert.equal(await api.inactiveDaily(new Date(Date.UTC(2030, 0, 15, 7))), null, "pred 10.00");
    const noon = new Date(Date.UTC(2030, 0, 15, 11));
    assert.ok(await api.inactiveDaily(noon));
    assert.equal(await api.inactiveDaily(noon), null);
  });
});

test("neaktivni: izbris najprej 30 dni po obvestilu; napaka pošiljanja ne šteje kot obvestilo", async () => {
  const { db, api, mails, parent, exists } = setup();
  await withFlag("1", async () => {
    const a = parent("a@x.si");
    // Ob prvem vklopu že 25 mesecev brez dejavnosti: najprej obvestilo, izbris ne takoj.
    db.prepare("UPDATE parents SET created_at = datetime('now', '-760 days'), email_verified_at = datetime('now', '-760 days') WHERE id = ?").run(a.id);
    const r = await api.inactiveDaily(at(0), { force: true });
    assert.equal(r.obvestilo, 1);
    assert.equal(r.izbris, 0);
    assert.match(mails[0].text, new RegExp(`${new Date(Date.now() + 30 * DAY).getUTCDate()}\\. `));
    assert.equal((await api.inactiveDaily(at(20), { force: true })).izbris, 0);
    assert.ok(exists(a.id));
    // Obvestilo je bilo poslano danes; izbris po 30 dneh (zapis obvestila premaknemo nazaj).
    db.prepare("UPDATE email_log SET created_at = datetime('now', '-31 days') WHERE kind = 'neaktivni'").run();
    assert.equal((await api.inactiveDaily(at(0), { force: true })).izbris, 1);
    assert.ok(!exists(a.id));
  });
  // Napaka pošiljanja: zapis se umakne, izbrisa ni, naslednjič nov poskus.
  const s2 = setup();
  await withFlag("1", async () => {
    const b = s2.parent("b@x.si");
    s2.api.mailer.fetch = async () => ({ ok: false, status: 500, json: async () => ({ message: "napaka" }) });
    const r = await s2.api.inactiveDaily(at(800), { force: true });
    assert.equal(r.napakePosiljanja, 1);
    assert.equal(r.izbris, 0);
    assert.equal(s2.db.prepare("SELECT COUNT(*) AS n FROM email_log WHERE kind = 'neaktivni'").get().n, 0);
    assert.ok(s2.exists(b.id));
  });
});

test("neaktivni: mladoletni imetnik brez e-pošte, plačani, skrbniki, gosti in nepotrjeni izvzeti; poročilo brez dejanj", async () => {
  const { db, api, mails, parent, exists } = setup();
  await withFlag("1", async () => {
    const minor = parent("dijak@x.si", { birth: `${YEAR - 16}-01-01` });
    const paid = parent("placnik@x.si", { sub_status: "active" });
    const admin = parent("skrbnik@x.si", { is_admin: 1 });
    const guest = parent("g@gost.invalid", { is_guest: 1 });
    const unverified = parent("nepotrjen@x.si", { email_verified_at: null });
    const adult = parent("odrasel@x.si");
    // Aktiven otrok (točke) šteje kot dejavnost računa.
    const active = parent("aktiven@x.si");
    db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'x', ?)").run(active.kid, sqlTime(at(500).getTime()));
    // Poročilo (dry run): brez e-pošte in izbrisa.
    const ctx = { db, sendMail: async () => assert.fail("dry run ne pošilja"), isMinor: () => false, selfOnly: () => false, email: () => ({}), appUrl: "http://x/", erase: () => assert.fail("dry run ne briše") };
    const rep = await runInactive({ ...ctx, isMinor: (p) => p.id === minor.id }, { now: at(800).getTime(), dryRun: true });
    assert.deepEqual({ o: rep.obvestilo, i: rep.izbris, m: rep.mladoletniBrezObvestila }, { o: 1, i: 1, m: 1 });
    assert.equal(mails.length, 0);
    // 13 mesecev: obvestilo samo polnoletnemu, mladoletnemu nič.
    await api.inactiveDaily(at(400), { force: true });
    assert.deepEqual(mails.map((m) => m.to[0]), ["odrasel@x.si"]);
    // 25 mesecev (+ 30 dni po obvestilu): mladoletni izbrisan brez e-pošte, odrasel izbrisan; ostali ostanejo.
    const r = await api.inactiveDaily(at(800), { force: true });
    assert.equal(r.izbris, 2);
    assert.ok(!exists(minor.id) && !exists(adult.id));
    for (const p of [paid, admin, guest, unverified, active]) assert.ok(exists(p.id));
    assert.equal(mails.length, 1);
    assert.ok(!mails.some((m) => m.to[0] === "dijak@x.si"));
  });
  assert.equal(NEAKTIVNI.obvestiloDni, 365);
  assert.equal(NEAKTIVNI.izbrisDni, 730);
});

test("neaktivni: klic API s sejo zapiše zadnjo dejavnost enkrat na dan", async () => {
  const { createApp } = await import("../server/app.js");
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({}) }), log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const r = await fetch(`${base}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "z@x.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" }) });
    const cookie = r.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
    store.db.prepare("UPDATE parents SET last_active_at = '2020-01-01 00:00:00'").run();
    await fetch(`${base}/api/account`, { headers: { cookie } });
    assert.equal(store.db.prepare("SELECT substr(last_active_at, 1, 10) AS d FROM parents").get().d, new Date().toISOString().slice(0, 10));
  } finally {
    server.close();
  }
});
