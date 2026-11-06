// Pregled #492–#496 B (tretji prehod): napadi na prevzem, zaklep zakonitega starša in mobilne poti.
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
        headers: { "content-type": "application/json", cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "), ...extraHeaders },
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


const link = (url) => { const u = new URL(url); return u.pathname + u.search; };

// B-1 (P1, #492): starš se registrira v aplikaciji za iPhone in odpre povezavo »Potrdite e-naslov« v Pošti (Safari, brez
// seje aplikacije). Isto naredi pregledovalnik povezav v e-pošti (Microsoft Safe Links, šolski Arnes/M365), ki odpre
// vsak GET. Potrditev ne sme izbrisati gesla lastnika in ga odjaviti v aplikaciji.
test("B-1 own verify link opened in Safari or by a mail link scanner keeps the owner's password and app session", async () => {
  await withServer(async ({ appClient, webClient, register }) => {
    const app = appClient();
    const reg = await register(app, "stars@primer.si", "lastnik12345");
    assert.equal(reg.status, 201);
    const v = await webClient()(link(reg.body.dev_verify_url)); // Safari ali pregledovalnik povezav
    assert.equal(v.status, 302);
    assert.equal((await app("/api/account")).status, 200, "aplikacija je po potrditvi e-naslova odjavljena");
    assert.equal((await appClient()("/api/auth/login", { body: { email: "stars@primer.si", password: "lastnik12345" } })).status, 200, "lastnikovo geslo po potrditvi ne deluje več");
  });
});

// B-2 (P2, #492 + #493): ponastavitev gesla potrdi e-naslov, žetona za potrditev pa ne izbriše. Stara povezava iz prve
// e-pošte (7 dni) nato na potrjenem računu znova »potrdi« in zbriše novo geslo ter odjavi vse naprave.
test("B-2 old verify link after a password reset does nothing to the verified account", async () => {
  await withServer(async ({ webClient, register, db }) => {
    const first = webClient();
    const reg = await register(first, "pozabljiv@primer.si", "prvo-geslo1");
    const forgot = await webClient()("/api/auth/forgot", { body: { email: "pozabljiv@primer.si" } });
    const token = new URL(forgot.body.dev_reset_url).searchParams.get("reset");
    const me = webClient();
    assert.equal((await me("/api/auth/reset", { body: { token, password: "novo-geslo12" } })).status, 200);
    const verifiedAt = db.prepare("SELECT email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id).email_verified_at;
    assert.ok(verifiedAt, "ponastavitev potrdi e-naslov");
    await webClient()(link(reg.body.dev_verify_url)); // stara e-pošta, drug zavihek ali pregledovalnik
    assert.equal((await me("/api/account")).status, 200, "stara povezava za potrditev je odjavila lastnika");
    assert.equal((await webClient()("/api/auth/login", { body: { email: "pozabljiv@primer.si", password: "novo-geslo12" } })).status, 200, "stara povezava je zbrisala novo geslo");
  });
});

// B-3 (P2, #492): Applov žeton z email_verified=false (Apple pri »Sign in with Apple at Work & School« naslova ne preveri)
// ustvari račun s tujim naslovom in napadalčevim apple_sub. Lastnik naslova si nastavi geslo (»Pozabljeno geslo«),
// napadalec pa se s svojim Apple ID še vedno prijavi v isti račun.
test("B-3 Apple token with an unverified email creates no account; a reset clears an Apple ID linked before verification", async () => {
  await withServer(async ({ appClient, webClient, register, db }) => {
    const attacker = appClient();
    const r = await attacker("/api/auth/apple", apple({ sub: "apple.napadalec", email: VICTIM, email_verified: "false" }));
    assert.equal(r.status, 400, JSON.stringify(r.body));
    assert.equal(r.body.no_email, true);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM parents WHERE email = ?").get(VICTIM).n, 0);
    // Stari račun (pred popravkom): nepotrjen naslov z napadalčevim Apple ID. Lastnikova ponastavitev ga odveže.
    const reg = await register(webClient(), VICTIM, "napadalec1");
    db.prepare("UPDATE parents SET apple_sub = 'apple.napadalec' WHERE id = ?").run(reg.body.parent.id);
    const forgot = await webClient()("/api/auth/forgot", { body: { email: VICTIM } });
    const token = new URL(forgot.body.dev_reset_url).searchParams.get("reset");
    const victim = webClient();
    assert.equal((await victim("/api/auth/reset", { body: { token, password: "zrtvino-geslo" } })).status, 200);
    assert.equal(db.prepare("SELECT apple_sub FROM parents WHERE id = ?").get(reg.body.parent.id).apple_sub, null);
    const again = await appClient()("/api/auth/apple", apple({ sub: "apple.napadalec", email: VICTIM, email_verified: "false" }));
    assert.notEqual(again.body?.parent?.id, reg.body.parent.id, "napadalčev Apple ID odpre račun, ki ga zdaj uporablja lastnik naslova");
  });
});

// B-6 (P1-1 popravek): povezava brez seje vodi na stran, ki vpraša za geslo; z geslom se potrdi brez odjave,
// »tega računa nisem ustvaril« pa zaščiti račun (neuporabno geslo, odjava povsod, žeton za novo geslo v odgovoru).
test("B-6 verify without the account's session: GET asks, POST with password confirms, not_mine wipes and resets", async () => {
  await withServer(async ({ appClient, webClient, register, db }) => {
    const app = appClient();
    const reg = await register(app, "tretji@primer.si", "lastnik12345");
    const verifyPath = link(reg.body.dev_verify_url);
    const token = new URL(reg.body.dev_verify_url).searchParams.get("token");
    const safari = webClient();
    const g = await safari(verifyPath);
    assert.equal(g.headers.get("location"), `/?verify=${token}`);
    assert.equal(db.prepare("SELECT email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id).email_verified_at, null, "GET ne potrdi");
    assert.equal((await safari("/api/auth/verify", { body: { token, password: "napacno-geslo" } })).status, 401);
    assert.equal((await safari("/api/auth/verify", { body: { token, password: "lastnik12345" } })).status, 200);
    assert.ok(db.prepare("SELECT email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id).email_verified_at);
    assert.equal((await safari("/api/account")).status, 200, "z geslom je Safari prijavljen");
    assert.equal((await app("/api/account")).status, 200, "aplikacija ostane prijavljena");

    // Pred-prevzem: tujec se registrira z naslovom lastnika, lastnik pove, da računa ni ustvaril.
    const foreign = webClient();
    const r2 = await register(foreign, "lastnik@primer.si", "tujcevo-geslo1");
    const t2 = new URL(r2.body.dev_verify_url).searchParams.get("token");
    const owner = webClient();
    const nm = await owner("/api/auth/verify", { body: { token: t2, not_mine: true } });
    assert.equal(nm.status, 200);
    assert.ok(nm.body.reset);
    assert.equal((await foreign("/api/account")).status, 401, "tujčeva seja ne velja več");
    assert.equal((await webClient()("/api/auth/login", { body: { email: "lastnik@primer.si", password: "tujcevo-geslo1" } })).status, 401);
    assert.equal((await owner("/api/auth/reset", { body: { token: nm.body.reset, password: "lastnikovo-geslo" } })).status, 200);
    assert.equal((await owner("/api/auth/verify", { body: { token: t2, not_mine: true } })).status, 400, "žeton velja enkrat");
  });
});

// B-4 (#496): oddaljen odjemalec ne dobi povezave, tudi če pošlje glavo, ki bi ga naredila »lokalnega«; lokalno brez glav jo.
test("B-4 dev links: forwarded headers never count as local, plain localhost still gets them", async () => {
  await withServer(async ({ webClient, register }) => {
    const plain = await register(webClient(), "lokalno@primer.si", "geslo12345");
    assert.ok(plain.body.dev_verify_url, "lokalni razvoj brez e-pošte potrebuje povezavo v odgovoru");
    for (const h of [{ "x-forwarded-for": "127.0.0.1" }, { "cf-connecting-ip": "127.0.0.1" }, { forwarded: "for=127.0.0.1" }]) {
      const f = await webClient(h)("/api/auth/forgot", { body: { email: "lokalno@primer.si" } });
      assert.equal(f.body.dev_reset_url, undefined, `povezava za novo geslo z glavo ${Object.keys(h)[0]}`);
    }
  });
});

// B-5 (#492): potrditev iz lastne seje (ista naprava) ne zbriše gesla in ne odjavi drugih naprav lastnika.
test("B-5 own-session verify keeps other devices of the owner signed in", async () => {
  await withServer(async ({ appClient, webClient, register }) => {
    const web = webClient();
    await register(web, "dve@primer.si", "lastnik12345");
    const phone = appClient();
    assert.equal((await phone("/api/auth/login", { body: { email: "dve@primer.si", password: "lastnik12345" } })).status, 200);
    const resend = await web("/api/auth/resend-verification", { method: "POST" });
    const v = await web(link(resend.body.dev_verify_url));
    assert.equal(v.headers.get("location"), "/?verified=1");
    assert.equal((await phone("/api/account")).status, 200);
  });
});
