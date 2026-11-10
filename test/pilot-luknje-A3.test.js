// Pregledovalec A3 (prehod 2), PR #477: poskusi dobiti več brezplačnega AI, kot ga dovolijo odločitve j.
// Zagon: node --test test/pilot-luknje-A3.test.js
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { withAccounts } from "./racuni-pomoc.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { BUNDLE_ID } from "../server/mobile/store-billing.js";
import { guaranteeUsd, subscriptionCeiling, detailedShare, explanationsFor } from "../server/accounts/plans.js";

const DAY = 86400000;
const dayIso = (d) => new Date(Date.now() + d * DAY).toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();
const ENV = { EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(10) };
const cap = (lvl) => subscriptionCeiling(guaranteeUsd(lvl));

async function ask(call, kidId) {
  const conv = (await call(`/api/students/${kidId}/conversations`, { method: "POST" })).body;
  return (await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "v" } })).status;
}
const spend = (store, kidId, usd) => {
  const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kidId).parent_id;
  store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, parent_id) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ?)").run(kidId, usd, pid);
};

// A3-1: zaklep stopnje je na id računa; HMAC zapis po izbrisu hrani samo znesek, ne stopnje. Izbris računa in nov
// račun z istim naslovom in profilom FAKS sredi meseca tako dvigne mejo z OŠ (1,9 $) na FAKS (4,5 $) – izbris
// obide zaklep stopnje, ki ga je j potrdil (19:5x).
test("A3-1 izbris računa + nov račun s profilom FAKS sredi meseca ne sme dvigniti zaklenjene stopnje", async () => {
  await withAccounts(ENV, async ({ call, store, kid, calls }) => {
    spend(store, kid.id, cap("OS") + 0.3); // nad mejo OŠ (meja + rep), daleč pod mejo FAKS
    assert.equal(await ask(call, kid.id), 429, "OŠ porabljena");
    assert.equal((await call("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    const r = await call("/api/auth/register", { method: "POST", body: { email: "meja@x.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(calls.filter((c) => c.host === "api.resend.com").at(-1).body.text)[0]);
    const k2 = (await call("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 20, consent: true, settings: { educational_track: "UNIVERZA" } } })).body;
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    const m = (await call(`/api/students/${k2.id}/usage`)).body;
    assert.equal(await ask(call, k2.id), 429, "isti naslov, isti mesec, nova stopnja FAKS: ustavljen (meja FAKS: " + JSON.stringify(m.explanations_month) + ")");
    assert.equal(await ask(call, k2.id), 429, "isti naslov, isti mesec: ustavljen kot pred izbrisom");
  });
});

// A3-2 (odločitev j): število profilov ni zaklenjeno. En profil OŠ porabi 1,9 $, račun doda prazen drugi profil
// (pilot dovoli 4) in ima takoj skupni delež Družine 3,2 $. Po pravilu »več profilov = Družina« je to dovoljeno,
// a je v nasprotju z namenom zaklepa (»nov profil sredi meseca meje ne dvigne«). Ne šteje kot napaka, dokler j ne odloči.
// Privzeto PILOT_LOCK_PROFILES = true (server/accounts/pilot-meja.js); pri false ta test ne velja (odločitev j).
const { PILOT_LOCK_PROFILES } = await import("../server/accounts/pilot-meja.js");
test("A3-2 (odloči j) drugi profil sredi meseca ne dvigne meje z OŠ na Družino", { skip: !PILOT_LOCK_PROFILES && "PILOT_LOCK_PROFILES = false (j)" }, async () => {
  await withAccounts(ENV, async ({ call, store, kid }) => {
    spend(store, kid.id, cap("OS") + 0.3);
    assert.equal(await ask(call, kid.id), 429, "OŠ porabljena");
    const r = await call("/api/students", { method: "POST", body: { name: "Eva", birth_year: YEAR - 12, consent: true } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.equal(await ask(call, kid.id), 429, "prazen drugi profil sredi meseca ne odpre nove meje");
  });
});

// A3-3: prijava z Apple poveže obstoječ NEPOTRJEN račun z istim e-naslovom in ga označi kot potrjenega
// (server/mobile/apple-signin.js 64–66), geslo in seje napadalca pa ostanejo. Napadalec vnaprej registrira naslov
// lastnika (ali člana pilota); ko se lastnik prvič prijavi z Apple, ima napadalec potrjen račun lastnika =
// inštruktor brez meje. PR je popravil isto pot pri ustvarjanju računa (verified: !!who.emailVerified), povezave pa ne.
const RSA = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const JWK = { ...RSA.publicKey.export({ format: "jwk" }), kid: "test-kid", alg: "RS256", use: "sig" };
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const NONCE = "nakljucni-niz-1234567890";
function identityToken(claims) {
  const input = `${b64({ alg: "RS256", kid: "test-kid" })}.${b64({
    iss: "https://appleid.apple.com",
    aud: BUNDLE_ID,
    exp: Math.floor(Date.now() / 1000) + 600,
    iat: Math.floor(Date.now() / 1000),
    nonce: crypto.createHash("sha256").update(NONCE).digest("hex"),
    ...claims,
  })}`;
  return `${input}.${crypto.sign("RSA-SHA256", Buffer.from(input), RSA.privateKey).toString("base64url")}`;
}

// Popravek je v ločenem PR #492 (prijava z Apple); tu ostane kot todo, dokler #492 ni združen.
test("A3-3 Apple poveže vnaprej registriran nepotrjen račun lastnika: napadalčevo geslo ne sme odpreti lastnika", { todo: "popravek v PR #492" }, async () => {
  const prev = process.env.EVKLID_ADMIN_EMAILS;
  process.env.EVKLID_ADMIN_EMAILS = "lastnik@x.si";
  const store = openDb(":memory:");
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "x" }) }),
    log: { error() {}, warn() {}, info() {} },
    mobile: { appleKeys: [JWK] },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = (headers = {}) => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || (opts.body ? "POST" : "GET"),
        headers: { "content-type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "), ...headers },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
    };
  };
  try {
    const attacker = client();
    const reg = await attacker("/api/auth/register", { body: { email: "lastnik@x.si", password: "napadalec1", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(reg.status, 201, JSON.stringify(reg.body));
    assert.equal(reg.body.dev_verify_url, undefined, "brez razvojne povezave (popravek PR)");
    // Lastnik se prijavi z Apple (isti, pri Applu potrjen naslov).
    const owner = client({ "x-app-client": "ios/1.0.0", "x-app-device": crypto.randomBytes(24).toString("base64url") });
    const a = await owner("/api/auth/apple", { body: { identity_token: identityToken({ sub: "apple-lastnik", email: "lastnik@x.si", email_verified: "true" }), nonce: NONCE } });
    assert.equal(a.status, 200, JSON.stringify(a.body));
    const row = store.db.prepare("SELECT email_verified_at FROM parents WHERE email = 'lastnik@x.si'").get();
    assert.ok(row.email_verified_at, "Apple je naslov potrdil");
    // Napadalec: njegova seja in geslo ne smeta več odpreti računa (zdaj potrjen račun lastnika = AI brez meje).
    const still = await attacker("/api/account");
    const login = await client()("/api/auth/login", { body: { email: "lastnik@x.si", password: "napadalec1" } });
    assert.ok(still.status === 401 && login.status !== 200, `seja napadalca ${still.status}, prijava z njegovim geslom ${login.status}`);
  } finally {
    server.close();
    if (prev === undefined) delete process.env.EVKLID_ADMIN_EMAILS;
    else process.env.EVKLID_ADMIN_EMAILS = prev;
  }
});
