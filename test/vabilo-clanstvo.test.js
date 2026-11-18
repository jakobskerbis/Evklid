// Koda vabila samodejno doda člana pilota (#751, j 2026-11-15: koda za vsako osebo, velja enkrat). Registracija z
// veljavno kodo shrani samo zgoščeno kodo; šele potrditev e-naslova kodo porabi (ena koda = en račun) in račun je
// član pilota (meja plačanega paketa brezplačno do EVKLID_PILOT_DO, oznaka za naloge in mnenja). Brez potrditve,
// z napačno, porabljeno ali umaknjeno kodo ali po koncu pilota ni članstva. Vse gre v dnevnik dostopov.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { isPilotParent } from "../server/accounts/pilot-meja.js";
import { BUNDLE_ID } from "../server/mobile/store-billing.js";

const CODE = "Gim-Ana-7q2k";
const OTHER = "gim-miha-x9p4";

// Pilot traja še 30 dni (testi ne padejo po koncu pilota 2026); končan pilot: predvčerajšnjim.
const day = (d) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
const DO = day(30);
const KONEC = day(-2);
const NOOP_LOG = { error() {}, info() {}, warn() {} };

// Prijava z Apple (kot test/pregled-492-500-b.test.js): podpisan žeton s testnim ključem.
const RSA = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const JWK = { ...RSA.publicKey.export({ format: "jwk" }), kid: "test-kid", alg: "RS256", use: "sig" };
const NONCE = "nakljucni-niz-1234567890";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
function identityToken(claims) {
  const now = Math.floor(Date.now() / 1000);
  const input = `${b64({ alg: "RS256", kid: "test-kid" })}.${b64({ iss: "https://appleid.apple.com", aud: BUNDLE_ID, exp: now + 600, iat: now, nonce: crypto.createHash("sha256").update(NONCE).digest("hex"), ...claims })}`;
  return `${input}.${crypto.sign("RSA-SHA256", Buffer.from(input), RSA.privateKey).toString("base64url")}`;
}

async function withServer(env, fn) {
  const prev = {};
  for (const [k, v] of Object.entries(env)) {
    prev[k] = process.env[k];
    process.env[k] = v;
  }
  const store = openDb(":memory:");
  const mails = [];
  const fetchFn = async (url, init = {}) => {
    if (new URL(url).host === "api.resend.com") mails.push(JSON.parse(init.body));
    return { ok: true, status: 200, json: async () => ({ id: "x" }) };
  };
  const logs = [];
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn, log: { error() {}, info: (m) => logs.push(String(m)), warn() {} }, mobile: { appleKeys: [JWK] } });
  const server = app.listen(0);
  // Ponoven zagon strežnika na isti bazi (ob zagonu teče purgePilotKv, kot vsakih 30 min).
  const restart = () => createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn, log: NOOP_LOG, mobile: { appleKeys: [JWK] } });
  const base = `http://127.0.0.1:${server.address().port}`;
  // Vsak »uporabnik« ima svoje piškotke.
  const client = () => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
        redirect: "manual",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
    };
  };
  const register = async (call, email, invite) => {
    const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: "2009-03-04", ...(invite !== undefined ? { invite } : {}) } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    return r.body;
  };
  const appleSignIn = (claims) =>
    fetch(`${base}/api/auth/apple`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-app-client": "ios/1.0.0", "x-app-device": crypto.randomBytes(24).toString("base64url") },
      body: JSON.stringify({ identity_token: identityToken(claims), nonce: NONCE, accept_privacy: true, birth_date: "1985-04-12" }),
    }).then(async (r) => ({ status: r.status, body: await r.json() }));
  const verifyLink = (email) => /\/api\/auth\/verify\?token=[\w-]+/.exec(mails.filter((m) => m.to[0] === email).at(-1).text)[0];
  const verify = async (call, email) => assert.equal((await call(verifyLink(email))).status, 302);
  const parent = (email) => store.db.prepare("SELECT * FROM parents WHERE email = ?").get(email);
  const actions = (email) => store.db.prepare("SELECT action, ok FROM audit_log WHERE parent_id = ? AND action LIKE 'pilot_invite%' ORDER BY id").all(parent(email).id).map((r) => `${r.action}:${r.ok}`);
  const tokenOf = (email) => new URL(verifyLink(email), base).searchParams.get("token");
  // Profil s shranjeno fotografijo pilota (kot ob »Shrani fotografijo«).
  const addPhoto = (email) => {
    const sid = Number(store.db.prepare("INSERT INTO students (name, settings, parent_id) VALUES ('Ana', '{}', ?)").run(parent(email).id).lastInsertRowid);
    const scan = Number(store.db.prepare("INSERT INTO pilot_scans (student_id, cond, ok) VALUES (?, 'svetlo', 1)").run(sid).lastInsertRowid);
    store.db.prepare("INSERT INTO pilot_photos (scan_id, student_id, image, consent) VALUES (?, ?, 'x', '{}')").run(scan, sid);
    return sid;
  };
  const photos = (email) => store.db.prepare("SELECT COUNT(*) AS n FROM pilot_photos WHERE student_id IN (SELECT id FROM students WHERE parent_id = ?)").get(parent(email).id).n;
  try {
    await fn({ store, client, register, verify, parent, actions, logs, call: client(), restart, appleSignIn, tokenOf, addPhoto, photos });
  } finally {
    server.close();
    for (const [k, v] of Object.entries(prev)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
}

const ENV = { EVKLID_VABILA: `${CODE.toLowerCase()} ${OTHER}`, EVKLID_PILOT_DO: DO, EVKLID_PILOT_EMAILS: "", EVKLID_ADMIN_EMAILS: "skrbnik@primer.si" };

test("vabilo → pilot: koda čaka do potrditve e-naslova, nato član pilota (meja, naloge), koda porabljena", async () => {
  await withServer(ENV, async ({ store, client, register, verify, parent, actions, logs }) => {
    const ana = client();
    const r = await register(ana, "ana@primer.si", ` ${CODE.toUpperCase()} `);
    assert.equal(r.invite, "pending");
    // Pred potrditvijo: ni pilota, koda ni porabljena, v bazi samo zgoščena koda.
    let p = parent("ana@primer.si");
    assert.match(p.pilot_invite_hash, /^[0-9a-f]{64}$/);
    const plain = crypto.createHash("sha256").update(`vabilo|${CODE.toLowerCase()}`).digest("hex");
    assert.notEqual(p.pilot_invite_hash, plain, "HMAC s strežniško skrivnostjo, ne golo zgoščena koda");
    assert.equal(p.pilot_invite_at, null);
    assert.equal(isPilotParent(p), false, "brez potrjenega e-naslova ni pilota");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 0);
    assert.equal((await ana("/api/account")).body.pilot, null);

    await verify(ana, "ana@primer.si");
    p = parent("ana@primer.si");
    assert.ok(p.pilot_invite_at, "koda porabljena ob potrditvi");
    assert.ok(p.pilot_at, "oznaka pilota za naloge in mnenja (kot jo nastavi skrbnik)");
    assert.equal(isPilotParent(p), true);
    const acc = (await ana("/api/account")).body;
    assert.equal(acc.pilot?.kind, "pilot");
    assert.equal(acc.pilot.last_day, DO);
    const use = store.db.prepare("SELECT * FROM pilot_vabila").all();
    assert.equal(use.length, 1);
    assert.equal(use[0].parent_id, p.id);
    assert.deepEqual(actions("ana@primer.si"), ["pilot_invite_pending:1", "pilot_invite_used:1"]);
    assert.ok(logs.some((m) => m.includes(`račun ${p.id}`) && m.includes("pilot")), "zapis v dnevnik strežnika brez kode");
    assert.ok(!logs.some((m) => m.toLowerCase().includes(CODE.toLowerCase())), "koda nikoli v dnevniku");

    // Koda se nikjer v bazi ne shrani kot besedilo.
    for (const { name } of store.db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all()) {
      const rows = store.db.prepare(`SELECT * FROM "${name}"`).all();
      assert.ok(!JSON.stringify(rows).toLowerCase().includes(CODE.toLowerCase()), `koda v tabeli ${name}`);
    }
    // Izvoz podatkov pove članstvo, zgoščene kode ne.
    const exp = await ana("/api/account/export", { method: "POST", body: { password: "geslo1234" } });
    assert.equal(exp.status, 200);
    assert.ok(exp.body.parent?.pilot_invite_at || JSON.stringify(exp.body).includes("pilot_invite_at"));
    assert.ok(!JSON.stringify(exp.body).includes(p.pilot_invite_hash), "zgoščena koda ni v izvozu");

    // Ista koda drugič: registracija uspe, koda ne velja; stran /vabilo pove, da je porabljena.
    const miha = client();
    assert.equal((await register(miha, "miha@primer.si", CODE)).invite, "invalid");
    assert.equal(parent("miha@primer.si").pilot_invite_hash, null);
    await verify(miha, "miha@primer.si");
    assert.equal(isPilotParent(parent("miha@primer.si")), false);
    assert.deepEqual(actions("miha@primer.si"), ["pilot_invite_rejected:0"]);
    const page = await client()("/api/vabilo", { method: "POST", body: { koda: CODE } });
    assert.deepEqual(page.body, { ok: false, used: true });
    assert.deepEqual((await client()("/api/vabilo", { method: "POST", body: { koda: OTHER } })).body, { ok: true, do: DO });
  });
});

test("vabilo → pilot: napačna koda ne ustavi registracije; brez kode nič; dve čakajoči registraciji – velja prva potrjena", async () => {
  await withServer(ENV, async ({ store, client, register, verify, parent, actions }) => {
    const a = client();
    const r = await register(a, "napacna@primer.si", "ni-taka-koda");
    assert.equal(r.invite, "invalid");
    assert.equal(parent("napacna@primer.si").pilot_invite_hash, null);
    const b = client();
    assert.equal((await register(b, "brez@primer.si")).invite, undefined, "brez kode ni polja invite");
    assert.equal((await register(client(), "nebesedilo@primer.si", { koda: OTHER })).invite, undefined, "koda, ki ni besedilo, se prezre");

    // Ista koda pri dveh računih pred potrditvijo: oba čakata, članstvo dobi samo prvi potrjeni.
    const x = client();
    const y = client();
    assert.equal((await register(x, "x@primer.si", OTHER)).invite, "pending");
    assert.equal((await register(y, "y@primer.si", OTHER)).invite, "pending");
    await verify(y, "y@primer.si");
    await verify(x, "x@primer.si");
    assert.equal(isPilotParent(parent("y@primer.si")), true);
    assert.equal(isPilotParent(parent("x@primer.si")), false);
    assert.equal(parent("x@primer.si").pilot_invite_hash, null, "čakajoča koda drugega računa odpade");
    assert.deepEqual(actions("x@primer.si"), ["pilot_invite_pending:1", "pilot_invite_taken:0"]);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 1);
  });
});

test("vabilo → pilot: umaknjena koda konča mejo, oznako pilota in fotografije; izbris računa kode ne sprosti", async () => {
  await withServer(ENV, async ({ store, client, register, verify, parent, restart, addPhoto, photos }) => {
    const a = client();
    await register(a, "ana@primer.si", CODE);
    await verify(a, "ana@primer.si");
    assert.equal(isPilotParent(parent("ana@primer.si")), true);
    addPhoto("ana@primer.si");
    // j kodo umakne s seznama: meja iz kode takoj ne velja več (e-naslov na EVKLID_PILOT_EMAILS bi še veljal).
    process.env.EVKLID_VABILA = OTHER;
    assert.equal(isPilotParent(parent("ana@primer.si")), false);
    assert.equal((await a("/api/account")).body.pilot, null);
    // Ob zagonu (in vsakih 30 min) odpadeta tudi oznaka pilota (naloge, mnenje, seznam skrbnika) in fotografije.
    restart();
    const p = parent("ana@primer.si");
    assert.equal(p.pilot_at, null);
    assert.equal(photos("ana@primer.si"), 0, "fotografije pilota izbrisane (public/zasebnost.html)");
    assert.ok(store.db.prepare("SELECT 1 FROM audit_log WHERE parent_id = ? AND action = 'pilot_invite_revoked' AND actor = 'system'").get(p.id));
    assert.equal(p.pilot_invite_hash, null, "izključitev je enkratna: koda odpade z računa");
    assert.equal(p.pilot_invite_at, null);
    // Koda spet na seznamu: članstvo se samo ne vrne.
    process.env.EVKLID_VABILA = `${CODE} ${OTHER}`;
    assert.equal(isPilotParent(parent("ana@primer.si")), false);
    // Skrbnik račun znova doda (»Dodaj«): naslednje čiščenje ga ne odstrani znova in fotografij ne briše.
    process.env.EVKLID_VABILA = OTHER;
    const admin = client();
    await register(admin, "skrbnik@primer.si");
    await verify(admin, "skrbnik@primer.si");
    store.db.prepare("UPDATE parents SET is_admin = 1 WHERE email = ?").run("skrbnik@primer.si");
    assert.equal((await admin("/api/admin/pilot-naloge/clani", { method: "POST", body: { email: "ana@primer.si", on: true } })).status, 200);
    addPhoto("ana@primer.si");
    restart();
    restart();
    assert.ok(parent("ana@primer.si").pilot_at, "ponovni »Dodaj« ostane");
    assert.equal(photos("ana@primer.si"), 1, "fotografije po ponovnem »Dodaj« ostanejo");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE parent_id = ? AND action = 'pilot_invite_revoked'").get(p.id).n, 1, "izključitev samo enkrat");
    process.env.EVKLID_VABILA = `${CODE} ${OTHER}`;

    // Izbris računa: vrstica porabljene kode ostane brez povezave na račun, koda ostane porabljena.
    const del = await a("/api/account", { method: "DELETE", body: { password: "geslo1234", confirm: true } });
    assert.ok(del.status < 300, JSON.stringify(del.body));
    const use = store.db.prepare("SELECT * FROM pilot_vabila").all();
    assert.equal(use.length, 1);
    assert.equal(use[0].parent_id, null);
    const again = client();
    assert.equal((await register(again, "ana@primer.si", CODE)).invite, "invalid", "nov račun z isto kodo ne dobi pilota");
  });
});

test("vabilo → pilot: skrbnikov »Odstrani« konča tudi mejo člana iz kode in izbriše fotografije", async () => {
  await withServer(ENV, async ({ store, client, register, verify, parent, addPhoto, photos }) => {
    const a = client();
    await register(a, "ana@primer.si", CODE);
    await verify(a, "ana@primer.si");
    addPhoto("ana@primer.si");
    const admin = client();
    await register(admin, "skrbnik@primer.si");
    await verify(admin, "skrbnik@primer.si");
    store.db.prepare("UPDATE parents SET is_admin = 1 WHERE email = ?").run("skrbnik@primer.si");
    assert.deepEqual((await admin("/api/admin/pilot-naloge/clani")).body.accounts, ["ana@primer.si"]);
    const r = await admin("/api/admin/pilot-naloge/clani", { method: "POST", body: { email: "ana@primer.si", on: false } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(parent("ana@primer.si").pilot_at, null);
    assert.equal(isPilotParent(parent("ana@primer.si")), false, "brez oznake pilota ni meje plačanega paketa");
    assert.equal((await a("/api/account")).body.pilot, null);
    assert.equal(photos("ana@primer.si"), 0);
    assert.deepEqual((await admin("/api/admin/pilot-naloge/clani")).body.accounts, []);
    // Skrbnik ga doda nazaj: koda je še na seznamu, meja spet velja.
    await admin("/api/admin/pilot-naloge/clani", { method: "POST", body: { email: "ana@primer.si", on: true } });
    assert.equal(isPilotParent(parent("ana@primer.si")), true);
  });
});

test("vabilo → pilot: po koncu pilota registracija pove »ended«, potrditev kode ne porabi; z umaknjeno kodo tudi ne", async () => {
  await withServer({ ...ENV, EVKLID_PILOT_DO: KONEC }, async ({ store, client, register, verify, parent, actions }) => {
    const a = client();
    assert.equal((await register(a, "pozno@primer.si", CODE)).invite, "ended");
    assert.equal(parent("pozno@primer.si").pilot_invite_hash, null);
    await verify(a, "pozno@primer.si");
    assert.equal(parent("pozno@primer.si").pilot_invite_at, null);
    assert.equal(isPilotParent(parent("pozno@primer.si")), false);
    assert.deepEqual(actions("pozno@primer.si"), ["pilot_invite_ended:0"]);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 0, "koda ostane neporabljena");
  });
  await withServer(ENV, async ({ client, register, verify, parent, actions }) => {
    // Pilot se konča med registracijo in potrditvijo.
    const a = client();
    assert.equal((await register(a, "vmes@primer.si", CODE)).invite, "pending");
    process.env.EVKLID_PILOT_DO = KONEC;
    await verify(a, "vmes@primer.si");
    assert.equal(parent("vmes@primer.si").pilot_invite_at, null);
    assert.deepEqual(actions("vmes@primer.si"), ["pilot_invite_pending:1", "pilot_invite_ended:0"]);
  });
  await withServer(ENV, async ({ client, register, verify, parent, actions }) => {
    const a = client();
    assert.equal((await register(a, "umik@primer.si", CODE)).invite, "pending");
    process.env.EVKLID_VABILA = OTHER; // j kodo umakne, preden učenec potrdi e-naslov
    await verify(a, "umik@primer.si");
    assert.equal(parent("umik@primer.si").pilot_invite_at, null);
    assert.deepEqual(actions("umik@primer.si"), ["pilot_invite_pending:1", "pilot_invite_revoked:0"]);
  });
});

test("vabilo → pilot: po koncu pilota se porabljene kode in kode na računih izbrišejo", async () => {
  await withServer(ENV, async ({ store, client, register, verify, parent, restart }) => {
    const a = client();
    await register(a, "ana@primer.si", CODE);
    await verify(a, "ana@primer.si");
    await register(client(), "caka@primer.si", OTHER); // čakajoča koda, nikoli potrjena
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 1);
    restart(); // med pilotom se nič ne izbriše
    assert.ok(parent("ana@primer.si").pilot_invite_at);
    process.env.EVKLID_PILOT_DO = KONEC;
    restart();
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 0);
    for (const e of ["ana@primer.si", "caka@primer.si"]) {
      assert.equal(parent(e).pilot_invite_hash, null, e);
      assert.equal(parent(e).pilot_invite_at, null, e);
    }
    assert.equal(isPilotParent(parent("ana@primer.si")), false);
  });
});

test("vabilo → pilot: koda se porabi tudi ob potrditvi z geslom, s sejo in ob ogledu stanja (/api/account/status)", async () => {
  await withServer(ENV, async ({ store, client, register, parent, actions, tokenOf }) => {
    // POST /api/auth/verify z geslom (povezava odprta v drugem brskalniku).
    await register(client(), "geslo@primer.si", CODE);
    const r1 = await client()("/api/auth/verify", { method: "POST", body: { token: tokenOf("geslo@primer.si"), password: "geslo1234" } });
    assert.equal(r1.status, 200, JSON.stringify(r1.body));
    assert.equal(isPilotParent(parent("geslo@primer.si")), true);
    assert.deepEqual(actions("geslo@primer.si"), ["pilot_invite_pending:1", "pilot_invite_used:1"]);

    // POST /api/auth/verify s sejo istega računa.
    const s = client();
    await register(s, "seja@primer.si", OTHER);
    const r2 = await s("/api/auth/verify", { method: "POST", body: { token: tokenOf("seja@primer.si") } });
    assert.equal(r2.status, 200, JSON.stringify(r2.body));
    assert.equal(isPilotParent(parent("seja@primer.si")), true);

    // Račun, potrjen drugače (brez confirmEmail): koda se porabi ob ogledu stanja.
    process.env.EVKLID_VABILA = `${CODE} ${OTHER} gim-tretja-k8m2`;
    const t = client();
    await register(t, "stanje@primer.si", "gim-tretja-k8m2");
    store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run("stanje@primer.si");
    assert.equal(parent("stanje@primer.si").pilot_invite_at, null);
    const st = await t("/api/account/status");
    assert.equal(st.status, 200);
    assert.ok(parent("stanje@primer.si").pilot_invite_at);
    assert.equal(isPilotParent(parent("stanje@primer.si")), true);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 3);
  });
});

test("vabilo → pilot: ponastavitev gesla nikoli potrjenega računa kode ne porabi (vnesel jo je ustvarjalec računa)", async () => {
  await withServer(ENV, async ({ store, client, register, parent, actions }) => {
    const a = client();
    await register(a, "reset@primer.si", CODE);
    // Povezava za novo geslo (kot iz e-pošte »Pozabljeno geslo«): dokaže nabiralnik, ne kode.
    const token = "t".repeat(40);
    const { sha256 } = await import("../server/accounts/auth.js");
    store.db.prepare("UPDATE parents SET reset_token_hash = ?, reset_expires_at = ? WHERE email = ?").run(sha256(token), new Date(Date.now() + 3600000).toISOString(), "reset@primer.si");
    const r = await client()("/api/auth/reset", { method: "POST", body: { token, password: "novogeslo1" } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const p = parent("reset@primer.si");
    assert.ok(p.email_verified_at);
    assert.equal(p.pilot_invite_hash, null);
    assert.equal(p.pilot_invite_at, null);
    assert.equal(isPilotParent(p), false);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 0, "koda ostane neporabljena");
    assert.deepEqual(actions("reset@primer.si"), ["pilot_invite_pending:1", "pilot_invite_rejected:0"]);
  });
});

test("vabilo → pilot: prijava z Apple na nepotrjen račun kode ne porabi", async () => {
  await withServer(ENV, async ({ store, client, register, parent, actions, appleSignIn }) => {
    await register(client(), "lastnik@primer.si", CODE); // tujec ustvari račun s tujim naslovom in kodo
    const r = await appleSignIn({ sub: "apple.lastnik", email: "lastnik@primer.si", email_verified: true });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const p = parent("lastnik@primer.si");
    assert.equal(p.apple_sub, "apple.lastnik");
    assert.ok(p.email_verified_at);
    assert.equal(p.pilot_invite_hash, null);
    assert.equal(p.pilot_invite_at, null);
    assert.equal(isPilotParent(p), false);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 0);
    assert.deepEqual(actions("lastnik@primer.si"), ["pilot_invite_pending:1", "pilot_invite_rejected:0"]);
  });
});

test("vabilo → pilot: »Računa nisem ustvaril jaz« kode ne porabi (vnesel jo je tujec)", async () => {
  await withServer(ENV, async ({ store, client, register, parent, actions }) => {
    const tujec = client();
    await register(tujec, "lastnik@primer.si", CODE);
    const token = "v".repeat(40);
    const { sha256 } = await import("../server/accounts/auth.js");
    store.db.prepare("UPDATE parents SET verify_token_hash = ? WHERE email = ?").run(sha256(token), "lastnik@primer.si");
    const r = await client()("/api/auth/verify", { method: "POST", body: { token, not_mine: true } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const p = parent("lastnik@primer.si");
    assert.ok(p.email_verified_at);
    assert.equal(p.pilot_invite_hash, null);
    assert.equal(p.pilot_invite_at, null);
    assert.equal(isPilotParent(p), false);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 0, "koda ostane neporabljena");
    assert.deepEqual(actions("lastnik@primer.si"), ["pilot_invite_pending:1", "pilot_invite_rejected:0"]);
  });
});
