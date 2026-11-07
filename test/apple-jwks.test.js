// Pregled #492 B, ponovni: prenos Applovih ključev (JWKS) ob neznanem kid kot DoS.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { verifyAppleIdentityToken, resetAppleKeyCache } from "../server/mobile/apple-crypto.js";

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

// Hkratni ponarejeni žetoni (po zagonu strežnika ali ko je predpomnilnik starejši od minute) vsak sproži svoj prenos.
// Pričakovano: en prenos v teku, ostali počakajo nanj.
test("RB-J2 concurrent junk tokens share one JWKS download", async () => {
  resetAppleKeyCache();
  let calls = 0;
  const { publicKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
  const jwk = { ...publicKey.export({ format: "jwk" }), kid: "pravi", alg: "RS256" };
  const fetchFn = async () => {
    calls++;
    await new Promise((r) => setTimeout(r, 30));
    return { ok: true, json: async () => ({ keys: [jwk] }) };
  };
  await Promise.all(Array.from({ length: 20 }, (_, i) => verifyAppleIdentityToken(junk(`hkratni-${i}`), { audiences: ["a"], fetchFn }).catch(() => {})));
  assert.ok(calls <= 2, `prenosov: ${calls}`);
});

// Po neuspelem prenosu napaka ostane do konca minute (brez novega zahtevka); prazen odgovor ne izbriše znanih ključev.
test("RB-J3 empty JWKS answer keeps the last known keys", async () => {
  resetAppleKeyCache();
  const { publicKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
  const jwk = { ...publicKey.export({ format: "jwk" }), kid: "pravi", alg: "RS256" };
  let answer = { keys: [jwk] };
  let calls = 0;
  const fetchFn = async () => {
    calls++;
    return { ok: true, json: async () => answer };
  };
  // Prvi prenos uspe; neznan kid v isti minuti ne sproži novega prenosa.
  await verifyAppleIdentityToken(junk("pravi"), { audiences: ["a"], fetchFn }).catch(() => {});
  answer = { keys: [] };
  await verifyAppleIdentityToken(junk("neznan"), { audiences: ["a"], fetchFn }).catch(() => {});
  assert.equal(calls, 1);
  // Žeton s pravim kid pride do preverjanja podpisa (ključ je še znan): napaka je »podpis«, ne »neznan ključ«.
  const err = await verifyAppleIdentityToken(junk("pravi"), { audiences: ["a"], fetchFn }).catch((e) => e);
  assert.match(String(err?.message), /Podpis/);
});
