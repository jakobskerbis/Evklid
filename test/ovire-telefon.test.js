// Ovire na telefonu (generalka dijaka 18. 11. 2026): ena vrstica »Imam kodo« ob registraciji (vrsto kode določi
// strežnik), Račun in »Potrdi e-naslov« brez besedil za starše pri profilu »Zame« (self_only), raven mature
// »Še ne vem« (letnik brez ravni) in letnik z ravnijo v enem izbirnem seznamu glave Inštruktorja.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import SL from "../public/i18n/sl.js";

globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { levelChoices, ravenChoices } = await import("../public/level-picker.js");

const ROOT = path.join(import.meta.dirname, "..");
const KEYS = ["code.have", "code.label", "code.hint", "code.giftLater", "code.unknown", "code.refOk", "acct.trialSelf", "lp.unsure", "lp.unsureSub"];
const ADULT = `${new Date().getFullYear() - 18}-01-01`;

test("novi ključi: v sl.js in vseh 32 ui/*.json, prevedeni, {date} ohranjen", () => {
  const dir = path.join(ROOT, "public/i18n/ui");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(files.length, 32);
  for (const k of KEYS) assert.ok(SL[k], `sl ${k}`);
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const k of KEYS) {
      assert.ok(j[k], `${f} ${k}`);
      assert.notEqual(j[k], SL[k], `${f} ${k} ni preveden`);
    }
    assert.match(j["acct.trialSelf"], /\{date\}/, f);
  }
});

async function withServer(env, fn) {
  const old = {};
  for (const [k, v] of Object.entries(env)) [old[k], process.env[k]] = [process.env[k], v];
  const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, resendKey: "", log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    let cookie = "";
    return async (p, body) => {
      const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json", cookie }, body: body ? JSON.stringify(body) : undefined });
      const set = res.headers.getSetCookie().map((c) => c.split(";")[0]);
      if (set.length) cookie = [...cookie.split("; ").filter(Boolean), ...set].join("; ");
      return { status: res.status, body: await res.json().catch(() => null) };
    };
  };
  try {
    await fn(client);
  } finally {
    server.close();
    for (const [k, v] of Object.entries(old)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
}
const reg = (c, email, extra = {}) => c("/api/auth/register", { email, password: "geslo-12345", birth_date: ADULT, accept_privacy: true, accept_terms: true, country: "SI", ...extra });

test("registracija z eno kodo: strežnik prepozna aktivacijsko, priporočila, darilno, vabilo in neznano kodo", async () => {
  await withServer({ EVKLID_PROMO_CODE: "MATURA26", EVKLID_VABILA: "pilot-ana-2026" }, async (client) => {
    const a = client();
    const first = await reg(a, "prvi@primer.si");
    assert.equal(first.status, 201);
    assert.equal(first.body.code_kind, undefined, "brez kode brez vrste");
    const refCode = first.body.parent.referral_code;

    const promo = await reg(client(), "promo@primer.si", { code: " matura26 " });
    assert.equal(promo.body.code_kind, "promo");
    assert.equal(promo.body.promo_pending, true, "aktivacijska koda čaka na potrditev kot prej");

    const ref = await reg(client(), "ref@primer.si", { code: refCode.toLowerCase() });
    assert.equal(ref.body.code_kind, "referral");
    assert.equal(ref.body.referred, true);

    const gift = await reg(client(), "dar@primer.si", { code: "dar-ab12-cd34" });
    assert.equal(gift.body.code_kind, "gift");
    assert.equal(gift.body.promo_error, undefined, "darilna koda ni napačna aktivacijska koda");

    const inv = await reg(client(), "vabilo@primer.si", { code: "PILOT-ANA-2026" });
    assert.equal(inv.body.code_kind, "invite", "koda vabila (brez ozira na velike črke)");

    const bad = await reg(client(), "napacna@primer.si", { code: "NEZNANO1" });
    assert.equal(bad.status, 201, "neznana koda registracije ne ustavi");
    assert.equal(bad.body.code_kind, "unknown");
    assert.equal(bad.body.promo_error, undefined);

    // Stara polja (mobilna aplikacija, starejši odjemalci) delujejo kot prej.
    const old = await reg(client(), "staro@primer.si", { promo_code: "MATURA26", referral_code: refCode });
    assert.equal(old.body.promo_pending, true);
    assert.equal(old.body.referred, true);
    assert.equal(old.body.code_kind, undefined);
  });
});

test("self_only: polnoleten dijak s profilom »Zame« (status in Račun), starš z otrokovim profilom ne", async () => {
  await withServer({}, async (client) => {
    const d = client();
    await reg(d, "dijak@primer.si");
    assert.equal((await d("/api/account/status")).body.self_only, false, "brez profila");
    const s = await d("/api/students", { name: "Luka", self: true, birth_year: Number(ADULT.slice(0, 4)), consent: true });
    assert.equal(s.status, 201, JSON.stringify(s.body));
    assert.equal((await d("/api/account/status")).body.self_only, true);
    assert.equal((await d("/api/account")).body.self_only, true);
  });
});

test("raven mature »Še ne vem«: letnik brez ravni, izbira v glavi je en seznam z ravnijo v napisu letnika", () => {
  const unsure = { educational_track: "SREDNJA_SOLA", curriculum_level: "3. letnik", subject: "MAT" };
  const r = ravenChoices(unsure);
  assert.deepEqual(r.map((x) => x.settings.curriculum_level), ["3. letnik OR", "3. letnik VR", "3. letnik"]);
  assert.equal(r.find((x) => x.current).label, SL["lp.unsure"]);
  assert.deepEqual(levelChoices(unsure).map((x) => x.label), ["1. letnik", "2. letnik", "3. letnik", "4. letnik"]);
  const vr = { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR" };
  assert.equal(ravenChoices(vr).find((x) => x.current).settings.curriculum_level, "4. letnik VR");
  assert.deepEqual(levelChoices(vr).map((x) => x.label), ["1. letnik VR", "2. letnik VR", "3. letnik VR", "4. letnik VR"]);
  assert.deepEqual(ravenChoices({ educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik gimnazija" }), []);
});
