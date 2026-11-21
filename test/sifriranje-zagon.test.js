// Produkcija brez EVKLID_DATA_KEY: strežnik se ne zažene (osebni podatki bi šli v bazo nešifrirani), razen z
// EVKLID_ALLOW_PLAINTEXT=1; /healthz/stanje pove, ali je šifriranje vklopljeno, Straža ob false pade.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { jeProdukcija, zagonBrezKljuca } from "../server/crypto-polje.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { presojaStanja } from "../scripts/straza.mjs";

test("zagon brez ključa: produkcija po RENDER, NODE_ENV ali https; izjema samo izrecno", () => {
  assert.equal(jeProdukcija({}), false);
  assert.equal(jeProdukcija({ RENDER: "true" }), true);
  assert.equal(jeProdukcija({ NODE_ENV: "production" }), true);
  assert.equal(jeProdukcija({ EVKLID_BASE_URL: "https://evklid.app" }), true);
  assert.equal(jeProdukcija({ EVKLID_BASE_URL: "http://localhost:3000", NODE_ENV: "test" }), false);
  assert.match(zagonBrezKljuca({ RENDER: "true" }), /EVKLID_DATA_KEY.*EVKLID_ALLOW_PLAINTEXT=1/s);
  assert.equal(zagonBrezKljuca({ RENDER: "true", EVKLID_ALLOW_PLAINTEXT: "1" }), null);
  assert.equal(zagonBrezKljuca({ RENDER: "true", EVKLID_DATA_KEY: crypto.randomBytes(32).toString("base64") }), null);
  assert.equal(zagonBrezKljuca({}), null, "razvoj, testi in preizkusni način brez ključa delajo kot prej");
});

// Zažene server/index.js; vrne { code } ob koncu procesa ali { stanje } (/healthz/stanje), ko odgovori.
async function zazeni(extra) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-sifriranje-"));
  const port = 39000 + Math.floor(Math.random() * 900);
  const env = { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_NEWS: "0", EVKLID_PDF: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", EVKLID_ACCOUNTS: "0", ANTHROPIC_API_KEY: "", EVKLID_BACKUPS: "0", ...extra };
  for (const k of ["EVKLID_DATA_KEY", "EVKLID_ALLOW_PLAINTEXT", "NODE_ENV", "EVKLID_BASE_URL"]) if (!(k in extra)) delete env[k];
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { env, stdio: ["ignore", "ignore", "pipe"] });
  let stderr = "";
  srv.stderr.on("data", (d) => (stderr += d));
  const konec = new Promise((resolve) => srv.on("exit", (code) => resolve({ code, stderr })));
  try {
    for (let i = 0; i < 150; i++) {
      const r = await Promise.race([konec, new Promise((res) => setTimeout(res, 100))]);
      if (r) return r;
      try {
        return { stanje: await (await fetch(`http://127.0.0.1:${port}/healthz/stanje`)).json() };
      } catch {
        // še se zaganja
      }
    }
    throw new Error("strežnik se ni zagnal");
  } finally {
    srv.kill();
    await konec;
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("zagon na Renderju brez EVKLID_DATA_KEY: izhod z napako; z EVKLID_ALLOW_PLAINTEXT=1 teče, stanje sifriranje: false", async () => {
  const r = await zazeni({ RENDER: "true" });
  assert.notEqual(r.code, 0);
  assert.equal(r.stanje, undefined);
  assert.match(r.stderr, /ne zažene.*EVKLID_DATA_KEY/s);
  const ok = await zazeni({ RENDER: "true", EVKLID_ALLOW_PLAINTEXT: "1" });
  assert.equal(ok.stanje?.sifriranje, false);
});

test("/healthz/stanje: sifriranje true s ključem; Straža pade samo ob false", async () => {
  const prej = process.env.EVKLID_DATA_KEY;
  process.env.EVKLID_DATA_KEY = crypto.randomBytes(32).toString("base64");
  const server = createApp(openDb(":memory:"), { scheduler: false }).listen(0);
  try {
    const j = await (await fetch(`http://127.0.0.1:${server.address().port}/healthz/stanje`)).json();
    assert.equal(j.sifriranje, true);
  } finally {
    server.close();
    if (prej === undefined) delete process.env.EVKLID_DATA_KEY;
    else process.env.EVKLID_DATA_KEY = prej;
  }
  const osnova = { id: "x", razlicica: "y", kopije: { napaka: false } };
  assert.deepEqual(presojaStanja({ ...osnova, sifriranje: true }).napake, []);
  assert.deepEqual(presojaStanja(osnova).napake, [], "starejši strežnik brez polja ne podre Straže");
  assert.match(presojaStanja({ ...osnova, sifriranje: false }).napake[0], /šifriranje/);
});

// Kvote gostov (server/accounts/guest.js guestNet): s ključem podatkov je omrežje v bazi HMAC, ki ga brez ključa ni
// mogoče obrniti s preizkušanjem vseh naslovov IPv4; brez ključa (razvoj) ostane sha256 kot prej.
test("netHash: s ključem HMAC (stabilen, drugačen od sha256), brez ključa sha256 kot prej", async () => {
  const { netHash } = await import("../server/crypto-polje.js");
  const nodeCrypto = await import("node:crypto");
  const prej = { k: process.env.EVKLID_DATA_KEY, o: process.env.EVKLID_DATA_KEYS_OLD };
  try {
    delete process.env.EVKLID_DATA_KEY;
    delete process.env.EVKLID_DATA_KEYS_OLD;
    const plain = nodeCrypto.createHash("sha256").update("evklid-guest-net|203.0.113.7").digest("hex");
    assert.equal(netHash("203.0.113.7"), plain);
    process.env.EVKLID_DATA_KEY = nodeCrypto.randomBytes(32).toString("base64");
    const a = netHash("203.0.113.7");
    assert.match(a, /^[0-9a-f]{64}$/);
    assert.notEqual(a, plain);
    assert.equal(netHash("203.0.113.7"), a, "ista vrednost za isto omrežje");
    assert.notEqual(netHash("203.0.113.8"), a);
    process.env.EVKLID_DATA_KEY = nodeCrypto.randomBytes(32).toString("base64");
    assert.notEqual(netHash("203.0.113.7"), a, "drug ključ, druga vrednost");
  } finally {
    if (prej.k === undefined) delete process.env.EVKLID_DATA_KEY;
    else process.env.EVKLID_DATA_KEY = prej.k;
    if (prej.o === undefined) delete process.env.EVKLID_DATA_KEYS_OLD;
    else process.env.EVKLID_DATA_KEYS_OLD = prej.o;
  }
});
