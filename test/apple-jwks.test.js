// Pregled #492 B, ponovni: prenos Applovih ključev (JWKS) ob neznanem kid kot DoS.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { verifyAppleIdentityToken, resetAppleKeyCache, AppleSignatureError } from "../server/mobile/apple-crypto.js";

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const junk = (kid) => `${b64({ alg: "RS256", kid })}.${b64({ sub: "x" })}.${Buffer.from("podpis").toString("base64url")}`;

// Ko Apple ne odgovarja (izpad, 429 za naš IP), vsak ponarejen žeton z izmišljenim kid sproži nov prenos (8 s čakanja),
// ker se keyCache.at zapiše samo ob uspehu. Pričakovano: največ en poskus na minuto tudi ob napaki.
test("RB-J1 failing Apple JWKS is fetched at most once a minute, not once per junk token", async () => {
  resetAppleKeyCache();
  let calls = 0;
  const fetchFn = async () => {
    calls++;
    return { ok: false, status: 503, json: async () => ({}) };
  };
  for (let i = 0; i < 10; i++) await verifyAppleIdentityToken(junk(`izmisljen-${i}`), { audiences: ["a"], fetchFn }).catch(() => {});
  assert.ok(calls <= 1, `prenosov: ${calls}`);
});

const mk = (kid) => ({ ...crypto.generateKeyPairSync("rsa", { modulusLength: 2048 }).publicKey.export({ format: "jwk" }), kid, alg: "RS256" });
const msg = (p) => p.then(() => "ok", (e) => String(e.message));
// Čas pod nadzorom (meja ene minute in rok ključev); obnovi se po vsakem testu.
function clock(t) {
  const real = Date.now;
  const c = { t: 1e12, restore: () => (Date.now = real) };
  Date.now = () => c.t;
  t.after(c.restore);
  return c;
}

// Hkratne zahteve: en prenos v teku, ostali počakajo nanj. Pravi uporabnik, ki pride med prenosom (sproži ga ponarejen
// žeton), dobi ključe in pride do preverjanja podpisa, ne napake »ni mogoče prenesti« (brez inflight bi jo dobil).
test("RB-J2 concurrent requests share one JWKS download; a real kid joining it gets the keys", async () => {
  resetAppleKeyCache();
  let calls = 0;
  const k = mk("pravi");
  const fetchFn = async () => {
    calls++;
    await new Promise((r) => setTimeout(r, 20));
    return { ok: true, json: async () => ({ keys: [k] }) };
  };
  const out = await Promise.all([
    ...Array.from({ length: 10 }, (_, i) => msg(verifyAppleIdentityToken(junk(`hkratni-${i}`), { audiences: ["a"], fetchFn }))),
    msg(verifyAppleIdentityToken(junk("pravi"), { audiences: ["a"], fetchFn })),
  ]);
  assert.equal(calls, 1);
  assert.match(out.at(-1), /Podpis/, out.join(" | "));
});

// Prazen odgovor PO minuti (res se prenese) ne izbriše znanih ključev.
test("RB-J3 empty JWKS answer after a minute keeps the last known keys", async (t) => {
  const c = clock(t);
  resetAppleKeyCache();
  let answer = { keys: [mk("pravi")] };
  let calls = 0;
  const fetchFn = async () => {
    calls++;
    return { ok: true, json: async () => answer };
  };
  await msg(verifyAppleIdentityToken(junk("pravi"), { audiences: ["a"], fetchFn }));
  answer = { keys: [] };
  c.t += 61000;
  assert.match(await msg(verifyAppleIdentityToken(junk("neznan"), { audiences: ["a"], fetchFn })), /Neznan/);
  assert.equal(calls, 2, "prazen odgovor je bil prenesen");
  assert.match(await msg(verifyAppleIdentityToken(junk("pravi"), { audiences: ["a"], fetchFn })), /Podpis/);
});

// Apple ne odgovarja: zadnji znani ključi veljajo (tudi za prvi klic) do 7 dni, potem ne več.
test("RB-J4 stale keys during an Apple outage: used up to 7 days, also by the first caller", async (t) => {
  const c = clock(t);
  resetAppleKeyCache();
  let up = true;
  const fetchFn = async () => {
    if (!up) throw new TypeError("fetch failed");
    return { ok: true, json: async () => ({ keys: [mk("pravi")] }) };
  };
  await msg(verifyAppleIdentityToken(junk("pravi"), { audiences: ["a"], fetchFn }));
  up = false;
  c.t += 25 * 3600000; // starejši od dneva → nov prenos, ki ne uspe
  assert.match(await msg(verifyAppleIdentityToken(junk("pravi"), { audiences: ["a"], fetchFn })), /Podpis/, "prvi klic");
  assert.match(await msg(verifyAppleIdentityToken(junk("pravi"), { audiences: ["a"], fetchFn })), /Podpis/, "drugi klic v isti minuti");
  c.t += 7 * 24 * 3600000;
  assert.doesNotMatch(await msg(verifyAppleIdentityToken(junk("pravi"), { audiences: ["a"], fetchFn })), /Podpis/, "po 7 dneh ključ ne velja več");
});

// Apple ne odgovarja in ključev še ni: to ni napačen žeton (apple-signin.js: 502 »Apple se ne odziva«, ne 401),
// enako za prvi klic in za klice v naslednji minuti (pregled #506 A P3-5, B).
test("RB-J5 JWKS download failure is not a signature error (502, not 401), also within the minute", async () => {
  resetAppleKeyCache();
  const fetchFn = async () => ({ ok: false, status: 503, json: async () => ({}) });
  for (let i = 0; i < 2; i++) {
    const err = await verifyAppleIdentityToken(junk("pravi"), { audiences: ["a"], fetchFn }).catch((e) => e);
    assert.ok(err instanceof Error && !(err instanceof AppleSignatureError), `klic ${i + 1}: ${err?.constructor?.name}`);
  }
});
