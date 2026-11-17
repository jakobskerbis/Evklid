// Koda vabila samodejno doda člana pilota (#751, j 2026-11-15: koda za vsako osebo, velja enkrat). Registracija z
// veljavno kodo shrani samo zgoščeno kodo; šele potrditev e-naslova kodo porabi (ena koda = en račun) in račun je
// član pilota (meja plačanega paketa brezplačno do EVKLID_PILOT_DO, oznaka za naloge in mnenja). Brez potrditve,
// z napačno, porabljeno ali umaknjeno kodo ali po koncu pilota ni članstva. Vse gre v dnevnik dostopov.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { isPilotParent } from "../server/accounts/pilot-meja.js";

const CODE = "Gim-Ana-7q2k";
const OTHER = "gim-miha-x9p4";

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
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn, log: { error() {}, info: (m) => logs.push(String(m)), warn() {} } });
  const server = app.listen(0);
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
  const verifyLink = (email) => /\/api\/auth\/verify\?token=[\w-]+/.exec(mails.filter((m) => m.to[0] === email).at(-1).text)[0];
  const verify = async (call, email) => assert.equal((await call(verifyLink(email))).status, 302);
  const parent = (email) => store.db.prepare("SELECT * FROM parents WHERE email = ?").get(email);
  const actions = (email) => store.db.prepare("SELECT action, ok FROM audit_log WHERE parent_id = ? AND action LIKE 'pilot_invite%' ORDER BY id").all(parent(email).id).map((r) => `${r.action}:${r.ok}`);
  try {
    await fn({ store, client, register, verify, parent, actions, logs, call: client() });
  } finally {
    server.close();
    for (const [k, v] of Object.entries(prev)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
}

const ENV = { EVKLID_VABILA: `${CODE.toLowerCase()} ${OTHER}`, EVKLID_PILOT_DO: "2026-12-15", EVKLID_PILOT_EMAILS: "" };
const inPilot = Date.now() < Date.parse("2026-12-15T23:00:00Z");

test("vabilo → pilot: koda čaka do potrditve e-naslova, nato član pilota (meja, naloge), koda porabljena", { skip: inPilot ? false : "pilot 2026 je končan" }, async () => {
  await withServer(ENV, async ({ store, client, register, verify, parent, actions, logs }) => {
    const ana = client();
    const r = await register(ana, "ana@primer.si", ` ${CODE.toUpperCase()} `);
    assert.equal(r.invite, "pending");
    // Pred potrditvijo: ni pilota, koda ni porabljena, v bazi samo zgoščena koda.
    let p = parent("ana@primer.si");
    assert.match(p.pilot_invite_hash, /^[0-9a-f]{64}$/);
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
    assert.equal(acc.pilot.last_day, "2026-12-15");
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
    assert.deepEqual((await client()("/api/vabilo", { method: "POST", body: { koda: OTHER } })).body, { ok: true, do: "2026-12-15" });
  });
});

test("vabilo → pilot: napačna koda ne ustavi registracije; brez kode nič; dve čakajoči registraciji – velja prva potrjena", { skip: inPilot ? false : "pilot 2026 je končan" }, async () => {
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

test("vabilo → pilot: umaknjena koda konča članstvo, izbris računa kode ne sprosti", { skip: inPilot ? false : "pilot 2026 je končan" }, async () => {
  await withServer(ENV, async ({ store, client, register, verify, parent }) => {
    const a = client();
    await register(a, "ana@primer.si", CODE);
    await verify(a, "ana@primer.si");
    assert.equal(isPilotParent(parent("ana@primer.si")), true);
    // j kodo umakne s seznama: članstvo iz kode ne velja več (e-naslov na EVKLID_PILOT_EMAILS bi še veljal).
    process.env.EVKLID_VABILA = OTHER;
    assert.equal(isPilotParent(parent("ana@primer.si")), false);
    assert.equal((await a("/api/account")).body.pilot, null);
    process.env.EVKLID_VABILA = `${CODE} ${OTHER}`;
    assert.equal(isPilotParent(parent("ana@primer.si")), true, "koda spet na seznamu");

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

test("vabilo → pilot: po koncu pilota ali z umaknjeno kodo ob potrditvi se koda ne porabi", async () => {
  await withServer({ ...ENV, EVKLID_PILOT_DO: "2026-01-31" }, async ({ store, client, register, verify, parent, actions }) => {
    const a = client();
    assert.equal((await register(a, "pozno@primer.si", CODE)).invite, "pending");
    await verify(a, "pozno@primer.si");
    assert.equal(parent("pozno@primer.si").pilot_invite_at, null);
    assert.equal(isPilotParent(parent("pozno@primer.si")), false);
    assert.deepEqual(actions("pozno@primer.si"), ["pilot_invite_pending:1", "pilot_invite_ended:0"]);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 0, "koda ostane neporabljena");
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

test("vabilo → pilot: potrditev s ponastavitvijo gesla tudi porabi kodo", { skip: inPilot ? false : "pilot 2026 je končan" }, async () => {
  await withServer(ENV, async ({ store, client, register, parent }) => {
    const a = client();
    await register(a, "reset@primer.si", CODE);
    // Povezava za novo geslo (kot iz e-pošte »Pozabljeno geslo«): ponastavitev potrdi e-naslov.
    const token = "t".repeat(40);
    const { sha256 } = await import("../server/accounts/auth.js");
    store.db.prepare("UPDATE parents SET reset_token_hash = ?, reset_expires_at = ? WHERE email = ?").run(sha256(token), new Date(Date.now() + 3600000).toISOString(), "reset@primer.si");
    const r = await client()("/api/auth/reset", { method: "POST", body: { token, password: "novogeslo1" } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.ok(parent("reset@primer.si").pilot_invite_at);
    assert.equal(isPilotParent(parent("reset@primer.si")), true);
  });
});
