// Prevzem računa pred registracijo (Sudhodanan & Paverd 2022, OWASP): vsak razred napada ima svoj test.
// Testi iz pregledov #492 A in B; prej odprte luknje (todo) so zdaj zaprte.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { BUNDLE_ID } from "../server/mobile/store-billing.js";

const ADULT = "1985-04-12";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const RSA = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const JWK = { ...RSA.publicKey.export({ format: "jwk" }), kid: "test-kid", alg: "RS256", use: "sig" };
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
const apple = (claims, extra = {}) => ({ body: { identity_token: identityToken(claims), nonce: NONCE, accept_privacy: true, birth_date: ADULT, ...extra } });
const VICTIM = "zrtev@primer.si";

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, guest: true, scheduler: false, log: { error() {}, warn() {}, info() {} }, mobile: { appleKeys: [JWK] } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  // Mobilni odjemalec (seja v glavi).
  const appClient = (device = crypto.randomBytes(24).toString("base64url")) => {
    let session = null;
    const call = async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || (opts.body ? "POST" : "GET"),
        headers: { "content-type": "application/json", "x-app-client": "ios/1.0.0", "x-app-device": device, ...(session ? { authorization: `Bearer ${session}` } : {}), ...(opts.headers || {}) },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        redirect: "manual",
      });
      const s = res.headers.get("x-app-session");
      if (s) session = s === "-" ? null : s;
      const type = res.headers.get("content-type") || "";
      return { status: res.status, headers: res.headers, body: type.includes("json") ? await res.json() : await res.text() };
    };
    return call;
  };
  // Spletni odjemalec s piškotki (za skupno geslo in povezave iz e-pošte).
  const webClient = (extraHeaders = {}) => {
    const jar = new Map();
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || (opts.body ? "POST" : "GET"),
        headers: { "content-type": "application/json", cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "), ...extraHeaders, ...(opts.headers || {}) },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        redirect: "manual",
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar.set(kv.slice(0, i), kv.slice(i + 1));
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, headers: res.headers, body: type.includes("json") ? await res.json() : await res.text() };
    };
  };
  const register = (c, email = VICTIM, password = "napadalec1", extra = {}) =>
    c("/api/auth/register", { body: { email, password, accept_privacy: true, birth_date: ADULT, ...extra } });
  try {
    await fn({ base, store, db: store.db, appClient, webClient, register });
  } finally {
    server.close();
  }
}


// ---- Pregled #492/#500 B (tretji pregledovalec) ----

// Pregledovalniki povezav: HEAD (in GET brez seje) ne smeta ničesar spremeniti.
test("RB-1 HEAD on the verify link (link scanner, prefetch) changes nothing", async () => {
  await withServer(async ({ webClient, register, db }) => {
    const attacker = webClient();
    const reg = await register(attacker);
    const u = new URL(reg.body.dev_verify_url);
    const before = db.prepare("SELECT password_hash, verify_token_hash, email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id);
    for (const method of ["HEAD", "GET"]) {
      const r = await webClient()(u.pathname + u.search, { method });
      assert.equal(r.status, 302);
      assert.match(r.headers.get("location"), /^\/\?verify=/);
    }
    const after = db.prepare("SELECT password_hash, verify_token_hash, email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id);
    assert.deepEqual(after, before);
    assert.equal((await attacker("/api/account")).status, 200);
  });
});

// Povezavo odpre brskalnik, v katerem je prijavljen DRUG račun (sorojenec, drug starš): ne potrdi.
test("RB-2 GET verify link with another account's session does not confirm", async () => {
  await withServer(async ({ webClient, register, db }) => {
    const attacker = webClient();
    const reg = await register(attacker);
    const other = webClient();
    assert.equal((await register(other, "drug@primer.si", "drugo-geslo1")).status, 201);
    const u = new URL(reg.body.dev_verify_url);
    const r = await other(u.pathname + u.search);
    assert.match(r.headers.get("location"), /^\/\?verify=/);
    assert.equal(db.prepare("SELECT email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id).email_verified_at, null);
  });
});

// P2: povezava za potrditev nima roka in je po #492 enaka povezavi za novo geslo (not_mine vrne žeton za ponastavitev
// v odgovoru). Kdor jo najde v zgodovini brskalnika (/api/auth/verify?token=… in /?verify=…), v e-pošti, ki je bila
// posredovana, ali v dnevniku pregledovalnika povezav, prevzame račun lastnika, ki ga je ustvaril sam in še ni potrdil.
// Pričakovano: not_mine zaščiti račun (geslo, seje), novo geslo pa pošlje na e-naslov (ali žeton poteče).
// PADE na 81d17919.
test("RB-3 a leaked verify link must not hand out a password reset token inline", async () => {
  await withServer(async ({ webClient, register }) => {
    const owner = webClient();
    const reg = await register(owner, "lastnik@primer.si", "lastnikovo-geslo");
    const token = new URL(reg.body.dev_verify_url).searchParams.get("token");
    const finder = webClient(); // npr. zgodovina na skupnem računalniku
    const nm = await finder("/api/auth/verify", { body: { token, not_mine: true } });
    assert.equal(nm.status, 200);
    assert.equal(nm.body.reset, undefined, "najditelj povezave dobi žeton za novo geslo in prevzame račun");
  });
});

// P3: meja neuspelih prijav z Apple (30 / 15 min na omrežje) šteje tudi poljubne smeti brez podpisa. En učenec v šolskem
// omrežju (NAT, ena IPv4) s 30 zahtevami zaklene prijavo z Apple za vse na tem omrežju; računi samo z Apple se sploh ne
// morejo prijaviti. Pričakovano: veljaven Applov podpis gre skozi (meja naj varuje samo prenos ključev / neveljavne).
// PADE na 81d17919.
test("RB-4 junk Apple requests from a shared school IP must not block a valid Apple sign-in", async () => {
  await withServer(async ({ appClient }) => {
    const school = { "x-forwarded-for": "193.2.1.66" };
    const kid = appClient();
    for (let i = 0; i < 31; i++) await kid("/api/auth/apple", { body: { identity_token: "x", nonce: "kratek" }, headers: school });
    const teacher = appClient();
    const r = await teacher("/api/auth/apple", { ...apple({ sub: "apple.ucitelj", email: "ucitelj@sola.si", email_verified: true }), headers: school });
    assert.equal(r.status, 201, JSON.stringify(r.body));
  });
});

// P3 (obstaja že na main, #492 se dotika iste vrstice): povezava nepotrjenega nekdanjega gosta z Apple nastavi
// email_verified_at mimo confirmEmail: guest_net ostane, 7-dnevnega preizkusa ni, poraba gosta se ne zapiše za omrežje.
// PADE na 81d17919.
test("RB-5 Apple link of an unverified former guest confirms like the verify link (trial, guest_net)", async () => {
  await withServer(async ({ appClient, db }) => {
    const g = appClient();
    assert.equal((await g("/api/auth/guest", { body: { accept_privacy: true } })).status, 201);
    const up = await g("/api/auth/upgrade", { body: { email: "gost@primer.si", password: "gostovo-geslo", accept_privacy: true, birth_date: ADULT } });
    assert.equal(up.status, 200, JSON.stringify(up.body));
    const r = await appClient()("/api/auth/apple", apple({ sub: "apple.gost", email: "gost@primer.si", email_verified: true }));
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const row = db.prepare("SELECT guest_net, trial_ends_at, email_verified_at FROM parents WHERE id = ?").get(up.body.parent.id);
    assert.ok(row.email_verified_at);
    assert.equal(row.guest_net, null, "guest_net ostane");
    assert.ok(row.trial_ends_at, "ni preizkusa");
  });
});

// Geslo prek strani za potrditev: brez žetona ni orakla; z napačnim žetonom vedno 400, tudi s pravim geslom.
test("RB-6 verify POST without a valid token is no password oracle", async () => {
  await withServer(async ({ webClient, register }) => {
    await register(webClient(), "o@primer.si", "pravo-geslo-1");
    const c = webClient();
    const a = await c("/api/auth/verify", { body: { token: "x".repeat(43), password: "pravo-geslo-1" } });
    const b = await c("/api/auth/verify", { body: { token: "x".repeat(43), password: "napacno" } });
    assert.equal(a.status, 400);
    assert.deepEqual(a.body, b.body);
  });
});

// DoS lastnika: napadalec izčrpa mejo računa (acct<id>) z napačnimi gesli na /api/auth/verify z različnih omrežij;
// lastnik naslova mora še vedno imeti izhod »nisem ustvaril«. (Izvoz je do potrditve zaprt, #747, zato tu ne šteje.)
test("RB-7 attacker exhausting the account-wide limit cannot stop not_mine", async () => {
  await withServer(async ({ webClient, register }) => {
    const attacker = webClient();
    const reg = await register(attacker);
    const token = new URL(reg.body.dev_verify_url).searchParams.get("token");
    assert.equal((await attacker("/api/account/export", { body: { password: "x" } })).status, 403);
    for (let i = 0; i < 30; i++) {
      const r = await webClient()("/api/auth/verify", { body: { token, password: `napacno${i}` }, headers: { "x-forwarded-for": `10.0.${i}.1` } });
      assert.equal(r.status, 401, `poskus ${i + 1}`);
    }
    const victim = webClient();
    assert.equal((await victim("/api/auth/verify", { body: { token, password: "ugibam" }, headers: { "x-forwarded-for": "10.9.9.9" } })).status, 429);
    const nm = await victim("/api/auth/verify", { body: { token, not_mine: true }, headers: { "x-forwarded-for": "10.9.9.9" } });
    assert.equal(nm.status, 200);
    assert.equal((await attacker("/api/account")).status, 401);
  });
});

// ---- #747 pregled 2, P1: profil iz časa pred potrditvijo ne ostane tistemu, ki prevzame naslov ----
// Tujec (napačno vpisan e-naslov) ustvari račun in profil mladoletnega, nato lastnik naslova račun prevzame. Profil in
// shranjena aktivacijska koda odpadeta (izbris kot DELETE /api/account), poraba ostane šteta za omrežje (guest_spent),
// v dnevniku je zapis unverified_takeover_cleared.
const MINOR = `${new Date().getFullYear() - 16}-03-04`;
async function strangerWithProfile({ webClient, register, db }) {
  const stranger = webClient();
  const reg = await register(stranger, VICTIM, "napadalec1", { birth_date: MINOR });
  assert.equal(reg.status, 201, JSON.stringify(reg.body));
  const kid = await stranger("/api/students", { body: { name: "Tujčev", birth_year: new Date().getFullYear() - 16, consent: true } });
  assert.equal(kid.status, 201, JSON.stringify(kid.body));
  db.prepare("INSERT INTO question_log (student_id, day, n) VALUES (?, date('now'), 3)").run(kid.body.id);
  db.prepare("UPDATE parents SET promo_pending = 'KODA123' WHERE id = ?").run(reg.body.parent.id);
  return { stranger, reg, kidId: kid.body.id, parentId: reg.body.parent.id };
}
function assertCleared(db, { kidId, parentId }, how) {
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM students WHERE id = ?").get(kidId).n, 0, "profil izbrisan");
  const p = db.prepare("SELECT email_verified_at, promo_pending FROM parents WHERE id = ?").get(parentId);
  assert.ok(p.email_verified_at, "naslov potrjen");
  assert.equal(p.promo_pending, null, "koda tujca ne velja");
  assert.equal(db.prepare("SELECT COALESCE(SUM(questions),0) AS n FROM guest_spent WHERE day = date('now')").get().n, 3, "poraba ostane šteta za omrežje");
  const a = db.prepare("SELECT target FROM audit_log WHERE parent_id = ? AND action = 'unverified_takeover_cleared'").all(parentId);
  assert.deepEqual(a.map((r) => r.target), [`${how}:1`]);
}

test("#747 P1: »Računa nisem ustvaril jaz« izbriše profil tujca", async () => {
  await withServer(async (ctx) => {
    const s = await strangerWithProfile(ctx);
    const token = new URL(s.reg.body.dev_verify_url).searchParams.get("token");
    const r = await ctx.webClient()("/api/auth/verify", { body: { token, not_mine: true } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assertCleared(ctx.db, s, "not_mine");
    assert.equal((await s.stranger("/api/account")).status, 401);
  });
});

test("#747 P1: novo geslo prek povezave iz e-pošte na nepotrjenem računu izbriše profil tujca; potrjen račun ostane cel", async () => {
  await withServer(async (ctx) => {
    const { sha256 } = await import("../server/accounts/auth.js");
    const s = await strangerWithProfile(ctx);
    const forgot = await ctx.webClient()("/api/auth/forgot", { body: { email: VICTIM } });
    assert.equal(forgot.status, 200);
    const token = "r".repeat(40);
    ctx.db.prepare("UPDATE parents SET reset_token_hash = ?, reset_expires_at = ? WHERE id = ?").run(sha256(token), new Date(Date.now() + 3600000).toISOString(), s.parentId);
    const r = await ctx.webClient()("/api/auth/reset", { body: { token, password: "lastnik-geslo1" } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assertCleared(ctx.db, s, "reset");
    // Potrjen račun: ponastavitev gesla profilov ne briše.
    const owner = ctx.webClient();
    const reg2 = await ctx.register(owner, "potrjen@primer.si", "geslo-lastnika1", { birth_date: MINOR });
    ctx.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE id = ?").run(reg2.body.parent.id);
    const kid = await owner("/api/students", { body: { name: "Moj", birth_year: new Date().getFullYear() - 16, consent: true } });
    assert.equal(kid.status, 201);
    ctx.db.prepare("UPDATE parents SET reset_token_hash = ?, reset_expires_at = ? WHERE id = ?").run(sha256("q".repeat(40)), new Date(Date.now() + 3600000).toISOString(), reg2.body.parent.id);
    assert.equal((await ctx.webClient()("/api/auth/reset", { body: { token: "q".repeat(40), password: "novo-geslo-12" } })).status, 200);
    assert.equal(ctx.db.prepare("SELECT COUNT(*) AS n FROM students WHERE id = ?").get(kid.body.id).n, 1);
  });
});

test("#747 P1: prijava z Apple na nepotrjen račun z istim naslovom izbriše profil tujca", async () => {
  await withServer(async (ctx) => {
    const s = await strangerWithProfile(ctx);
    const r = await ctx.appClient()("/api/auth/apple", apple({ sub: "apple.lastnik", email: VICTIM, email_verified: true }, { birth_date: MINOR }));
    assert.ok(r.status < 300, `${r.status} ${JSON.stringify(r.body)}`);
    assertCleared(ctx.db, s, "apple");
  });
});
