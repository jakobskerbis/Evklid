// Kode vabila v pilot (server/vabila.js, j 2026-11-15): veljavna / neveljavna, velike in male črke, prazno okolje,
// omejitev poskusov, javna pot tudi z računi (brez prijave), koda nikoli v dnevniku.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { isInviteCode, inviteCodes, createInviteLimiter, LIMITS } from "../server/vabila.js";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const env = { EVKLID_VABILA: " Ana-7Q2k, MIHA_x9;  Pet3r \n", EVKLID_PILOT_DO: "2026-12-15" };

test("vabila: veljavne in neveljavne kode, velike in male črke", () => {
  assert.deepEqual(inviteCodes(env), ["ana-7q2k", "miha_x9", "pet3r"]);
  for (const c of ["ana-7q2k", "ANA-7Q2K", "  Miha_X9 ", "pet3r"]) assert.equal(isInviteCode(c, env), true, c);
  for (const c of ["ana", "ana-7q2k2", "", "   ", null, undefined, 42, {}, ["ana-7q2k"], "x".repeat(65), "ana-7q2k,miha_x9", "ana-7q2k miha_x9"])
    assert.equal(isInviteCode(c, env), false, String(c));
});

test("vabila: prazno ali manjkajoče okolje ne sprejme ničesar", () => {
  for (const e of [{}, { EVKLID_VABILA: "" }, { EVKLID_VABILA: " , ; " }]) {
    assert.deepEqual(inviteCodes(e), []);
    assert.equal(isInviteCode("", e), false);
    assert.equal(isInviteCode("ana", e), false);
  }
  assert.deepEqual(inviteCodes({ EVKLID_VABILA: `ok ${"y".repeat(65)}` }), ["ok"], "predolga koda v okolju ne velja");
});

test("vabila: omejevalnik na IP in skupaj za napačne kode", () => {
  let t = 0;
  const lim = createInviteLimiter({ perIp: 3, windowMs: 1000, globalFails: 5, globalMs: 10000 }, () => t);
  assert.ok(lim.take("a") && lim.take("a") && lim.take("a"));
  assert.equal(lim.take("a"), false, "4. poskus z istega IP");
  assert.equal(lim.take("b"), true, "drug IP");
  t = 1001;
  assert.equal(lim.take("a"), true, "po oknu spet");
  for (let i = 0; i < 5; i++) lim.fail();
  assert.equal(lim.take("c"), false, "preveč napačnih kod skupaj");
  t = 20000;
  assert.equal(lim.take("c"), true);
  assert.ok(LIMITS.perIp >= 5 && LIMITS.perIp <= 20, "privzeta meja na IP");
});

async function withApp(opts, fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { error() {}, warn() {}, info() {} }, ...opts });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body, headers = {}) =>
    fetch(`${base}/api/vabilo`, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
  try {
    await fn({ base, post });
  } finally {
    server.close();
    store.db.close?.();
  }
}

test("vabila: POST /api/vabilo brez računov in z računi (brez prijave), samo da/ne, brez kode v dnevniku", async () => {
  const old = { v: process.env.EVKLID_VABILA, d: process.env.EVKLID_PILOT_DO };
  process.env.EVKLID_VABILA = "Pilot-A1 pilot-b2";
  process.env.EVKLID_PILOT_DO = "2026-12-15";
  const logs = [];
  const warn = console.warn;
  const log = console.log;
  console.warn = (...a) => logs.push(a.join(" "));
  console.log = (...a) => logs.push(a.join(" "));
  try {
    for (const accounts of [false, true]) {
      await withApp({ accounts }, async ({ base, post }) => {
        let r = await post({ koda: "PILOT-a1" });
        assert.equal(r.status, 200, `accounts=${accounts}`);
        assert.equal(r.headers.get("cache-control"), "no-store");
        assert.deepEqual(await r.json(), { ok: true, do: "2026-12-15" });
        r = await post({ koda: "ugibam-123" });
        assert.equal(r.status, 200);
        assert.deepEqual(await r.json(), { ok: false }, "neveljavna: samo ok:false, brez namiga");
        assert.deepEqual(await (await post({})).json(), { ok: false });
        assert.equal((await post("{ni json")).status, 400);
        assert.equal((await post({ koda: "x".repeat(5000) })).status, 400, "predolgo telo: 4xx, ne 5xx");
        // GET ne obstaja kot vir kod (ni seznama, koda ni v naslovu).
        const g = await fetch(`${base}/api/vabilo`);
        assert.notEqual(g.status, 200);
        assert.doesNotMatch(await g.text(), /pilot-a1|pilot-b2/i);
        // Nekanonična pot (velike črke, poševnica) ne gre mimo: 404 (server/app.js, točka A1).
        assert.equal((await fetch(`${base}/api/vabilo/`, { method: "POST", headers: { "content-type": "application/json" }, body: '{"koda":"pilot-a1"}' })).status, 404);
        // Stran /vabilo je javna in se naloži.
        const page = await fetch(`${base}/vabilo?koda=pilot-a1`);
        assert.equal(page.status, 200);
        assert.match(await page.text(), /id="vab-form"/);
      });
    }
    // Omejitev: po LIMITS.perIp poskusih z istega naslova 429 (tudi za veljavno kodo).
    await withApp({ accounts: false }, async ({ post }) => {
      const h = { "cf-connecting-ip": "203.0.113.9" };
      for (let i = 0; i < LIMITS.perIp; i++) assert.equal((await post({ koda: `napacna-${i}` }, h)).status, 200);
      const r = await post({ koda: "pilot-a1" }, h);
      assert.equal(r.status, 429);
      assert.deepEqual(await r.json(), { ok: false, tooMany: true });
      assert.equal((await post({ koda: "pilot-a1" }, { "cf-connecting-ip": "203.0.113.10" })).status, 200, "drug naslov ni zaklenjen");
    });
  } finally {
    console.warn = warn;
    console.log = log;
    for (const [k, v] of [["EVKLID_VABILA", old.v], ["EVKLID_PILOT_DO", old.d]]) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
  assert.ok(!logs.some((l) => /pilot-a1|ugibam|napacna/i.test(l)), `koda v dnevniku: ${logs.filter((l) => /pilot-a1|ugibam|napacna/i.test(l)).join(" | ")}`);
});

test("vabila: EVKLID_VABILA je opisan v .env.example in docs", () => {
  assert.match(fs.readFileSync(".env.example", "utf8"), /^EVKLID_VABILA=/m);
  assert.match(fs.readFileSync("docs/stroski-ai.md", "utf8"), /EVKLID_VABILA/);
  const mail = fs.readFileSync("docs/vabilo-email.md", "utf8");
  assert.match(mail, /https:\/\/evklid\.app\/vabilo\?koda=KODA/);
  const body = mail.split("---")[1].replace(/\*\*Zadeva:\*\*[^\n]*/, "");
  assert.ok(body.split(/\s+/).filter(Boolean).length <= 120, "e-pošta največ 120 besed");
});
