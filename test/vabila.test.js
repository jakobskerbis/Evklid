// Kode vabila v pilot (server/vabila.js, j 2026-11-15): veljavna / neveljavna, velike in male črke, prazno okolje,
// omejitev poskusov, javna pot tudi z računi (brez prijave), koda nikoli v dnevniku.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import express from "express";
import { isInviteCode, inviteCodes, shortInviteCodes, createInviteLimiter, mountInviteApi, LIMITS, MIN_CODE } from "../server/vabila.js";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const env = { EVKLID_VABILA: " Ana-7Q2k, MIHA_x9-ab;  Pet3r-123 \n", EVKLID_PILOT_DO: "2026-12-15" };

test("vabila: veljavne in neveljavne kode, velike in male črke", () => {
  assert.deepEqual(inviteCodes(env), ["ana-7q2k", "miha_x9-ab", "pet3r-123"]);
  for (const c of ["ana-7q2k", "ANA-7Q2K", "  Miha_X9-AB ", "pet3r-123"]) assert.equal(isInviteCode(c, env), true, c);
  for (const c of ["ana", "ana-7q2k2", "", "   ", null, undefined, 42, {}, ["ana-7q2k"], "x".repeat(65), "ana-7q2k,miha_x9-ab", "ana-7q2k miha_x9-ab"])
    assert.equal(isInviteCode(c, env), false, String(c));
});

test("vabila: prazno ali manjkajoče okolje ne sprejme ničesar", () => {
  for (const e of [{}, { EVKLID_VABILA: "" }, { EVKLID_VABILA: " , ; " }]) {
    assert.deepEqual(inviteCodes(e), []);
    assert.equal(isInviteCode("", e), false);
    assert.equal(isInviteCode("ana", e), false);
  }
  assert.deepEqual(inviteCodes({ EVKLID_VABILA: `ok-12345 ${"y".repeat(65)}` }), ["ok-12345"], "predolga koda v okolju ne velja");
});

test("vabila: kode krajše od 8 znakov ne veljajo, ob zagonu eno opozorilo brez kod", () => {
  assert.equal(MIN_CODE, 8);
  const e = { EVKLID_VABILA: "abc, 1234567 12345678 Dolga-koda1" };
  assert.deepEqual(inviteCodes(e), ["12345678", "dolga-koda1"]);
  assert.equal(shortInviteCodes(e), 2);
  for (const c of ["abc", "1234567"]) assert.equal(isInviteCode(c, e), false, c);
  assert.equal(isInviteCode("12345678", e), true);
  const warns = [];
  const log = { warn: (m) => warns.push(m) };
  const app = express();
  mountInviteApi(app, { env: e, log });
  assert.equal(warns.length, 1);
  assert.match(warns[0], /2 kod krajših od 8/);
  assert.doesNotMatch(warns[0], /abc|1234567\b/);
  mountInviteApi(express(), { env: { EVKLID_VABILA: "12345678" }, log });
  assert.equal(warns.length, 1, "brez kratkih kod brez opozorila");
});

test("vabila: omejevalnik šteje samo napačne kode, na IP in skupaj", () => {
  let t = 0;
  const warns = [];
  const lim = createInviteLimiter({ perIp: 3, windowMs: 1000, globalFails: 5, globalMs: 10000 }, () => t, { warn: (m) => warns.push(m) });
  for (let i = 0; i < 50; i++) assert.equal(lim.blocked("a"), false, "uspešna preverjanja se ne štejejo");
  lim.fail("a");
  lim.fail("a");
  assert.equal(lim.blocked("a"), false);
  lim.fail("a");
  assert.equal(lim.blocked("a"), "ip", "3 napačne z istega IP");
  assert.equal(lim.blocked("b"), false, "drug IP");
  t = 1001;
  assert.equal(lim.blocked("a"), false, "po oknu spet");
  assert.equal(warns.length, 0);
  lim.fail("b");
  lim.fail("c");
  assert.equal(lim.blocked("d"), "global", "preveč napačnih kod skupaj");
  assert.equal(warns.length, 1, "opozorilo ob doseženi skupni meji");
  lim.fail("e");
  assert.equal(warns.length, 1, "enkrat na epizodo");
  t = 20000;
  assert.equal(lim.blocked("d"), false);
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
        assert.equal((await post({})).status, 400, "brez kode: neveljaven zahtevek");
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
    // Uspešna preverjanja se ne štejejo: razred na istem omrežju odpre povezavo večkrat kot LIMITS.perIp.
    await withApp({ accounts: false }, async ({ base, post }) => {
      const h = { "cf-connecting-ip": "203.0.113.8" };
      for (let i = 0; i < LIMITS.perIp * 2; i++) assert.equal((await post({ koda: i % 2 ? "pilot-a1" : "Pilot-B2" }, h)).status, 200, `odprtje ${i + 1}`);
      // Neveljavni zahtevki (ne JSON objekt, koda ni besedilo) so 400 in se ne štejejo kot ugibanje.
      for (let i = 0; i < LIMITS.perIp; i++) {
        for (const body of [{ koda: 42 }, { koda: ["pilot-a1"] }, ["pilot-a1"], { koda: null }, { koda: "   " }, "null", '"pilot-a1"'])
          assert.equal((await post(body, h)).status, 400, JSON.stringify(body));
        const txt = await fetch(`${base}/api/vabilo`, { method: "POST", headers: { "content-type": "text/plain", ...h }, body: "pilot-a1" });
        assert.equal(txt.status, 400, "text/plain");
      }
      assert.equal((await post({ koda: "pilot-a1" }, h)).status, 200, "po neveljavnih zahtevkih veljavna koda še dela");
    });
    // Omejitev: po LIMITS.perIp napačnih kodah z istega naslova 429 (tudi za veljavno kodo).
    await withApp({ accounts: false }, async ({ post }) => {
      const h = { "cf-connecting-ip": "203.0.113.9" };
      for (let i = 0; i < LIMITS.perIp; i++) assert.equal((await post({ koda: `napacna-${i}` }, h)).status, 200);
      const r = await post({ koda: "pilot-a1" }, h);
      assert.equal(r.status, 429);
      assert.deepEqual(await r.json(), { ok: false, tooMany: true });
      assert.equal((await post({ koda: "pilot-a1" }, { "cf-connecting-ip": "203.0.113.10" })).status, 200, "drug naslov ni zaklenjen");
    });
    // Skupna meja napačnih kod (razpršeno ugibanje): ločen odgovor busy (stran brez obljube časa), opozorilo v dnevniku.
    {
      const app = express();
      const warns = [];
      const log = { warn: (m) => warns.push(m) };
      const limiter = createInviteLimiter({ perIp: 100, windowMs: 1000, globalFails: 3, globalMs: 60000 }, undefined, log);
      mountInviteApi(app, { env: { EVKLID_VABILA: "pilot-a1" }, log, limiter });
      const server = app.listen(0);
      const url = `http://127.0.0.1:${server.address().port}/api/vabilo`;
      const p = (koda, ip) => fetch(url, { method: "POST", headers: { "content-type": "application/json", "cf-connecting-ip": ip }, body: JSON.stringify({ koda }) });
      try {
        for (let i = 0; i < 3; i++) assert.equal((await p(`ugibam-${i}x`, `198.51.100.${i}`)).status, 200);
        const r = await p("pilot-a1", "198.51.100.77");
        assert.equal(r.status, 429);
        assert.deepEqual(await r.json(), { ok: false, busy: true });
        assert.equal(warns.length, 1);
        assert.match(warns[0], /skupna meja/);
      } finally {
        server.close();
      }
    }
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
