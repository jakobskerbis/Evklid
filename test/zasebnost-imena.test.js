// Imena otrok drugih računov ne smejo priti v noben odgovor API (osebni podatki mladoletnih).
// Lestvice z drugimi učenci (lige, razredi, skupine prijateljev, dnevna uganka, kviz, vitrina) kažejo samo
// vzdevke (server/leagues.js). Test preleti VSE poti GET kot drug račun in kot učitelj razreda, v katerem je
// otrok, in išče njegovo pravo ime. Do 6. 11. 2026 je GET /api/students/:id/xp vračal `leaderboard` z imeni
// in id-ji 30 profilov cele namestitve.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const NAME = "Zala Novak";
const LEAK = /Zala|Novak/;

async function withServer(fn) {
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    const u = new URL(url);
    const json = String(init.headers?.["Content-Type"] || "").includes("json");
    calls.push({ host: u.host, body: init.body ? (json ? JSON.parse(init.body) : Object.fromEntries(new URLSearchParams(init.body))) : null });
    return { ok: true, status: 200, json: async () => ({ id: "x", data: [] }) };
  };
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    stripeKey: "sk_test_x",
    resendKey: "re_x",
    webhookSecret: "whsec_test",
    fetchFn,
    log: { error() {} },
    streamFn: async ({ onText }) => {
      onText("ok");
      return { text: "ok", stopReason: "end_turn" };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
        redirect: "manual",
        // Kot na Renderju (za posrednikom): sicer bi lokalni klici dobili skrbniške poti (isLocalRequest).
        headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.9", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      const text = await res.text();
      let body = text;
      try {
        body = JSON.parse(text);
      } catch {}
      return { status: res.status, text, body };
    };
  };
  const register = async (c, email) => {
    const r = await c("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, r.text);
    const mail = calls.filter((x) => x.host === "api.resend.com").at(-1);
    const v = await c(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
    assert.equal(v.status, 302);
  };
  const child = async (c, name) => {
    const r = await c("/api/students", { method: "POST", body: { name, birth_year: new Date().getFullYear() - 12, consent: true } });
    assert.equal(r.status, 201, r.text);
    return r.body.id;
  };
  const getRoutes = () => {
    const out = [];
    const walk = (stack) => {
      for (const l of stack) {
        if (l.route?.methods?.get) out.push(...[l.route.path].flat().filter((p) => typeof p === "string"));
        else if (l.handle?.stack) walk(l.handle.stack);
      }
    };
    walk(app.router.stack);
    return out;
  };
  try {
    await fn({ client, store, register, child, getRoutes });
  } finally {
    server.close();
  }
}

test("GET /xp vrne samo XP svojega profila, brez lestvice z imeni drugih računov", async () => {
  await withServer(async ({ client, store, register, child }) => {
    const a = client();
    const b = client();
    await register(a, "a@zasebnost.test");
    await register(b, "b@zasebnost.test");
    const A = await child(a, NAME);
    const B = await child(b, "Bor");
    const xp = store.db.prepare("INSERT INTO xp_events (student_id, amount, reason) VALUES (?, ?, 'test')");
    xp.run(A, 80);
    xp.run(B, 5);
    const r = await b(`/api/students/${B}/xp`);
    assert.equal(r.status, 200);
    assert.equal(r.body.total, 5);
    assert.ok(!("leaderboard" in r.body), "odgovor ne sme imeti lestvice");
    assert.doesNotMatch(r.text, LEAK);
    // Tuj profil ostane zaprt.
    assert.equal((await b(`/api/students/${A}/xp`)).status, 404);
  });
});

test("nobena pot GET ne pokaže imena otroka drugemu računu, sošolcu ali učitelju", async () => {
  await withServer(async ({ client, store, register, child, getRoutes }) => {
    const a = client(); // starš otroka z imenom NAME
    const b = client(); // drug račun: prijatelj v skupini in sošolec
    const t = client(); // učitelj razreda
    await register(a, "a@zasebnost.test");
    await register(b, "b@zasebnost.test");
    await register(t, "t@zasebnost.test");
    const A = await child(a, NAME);
    const B = await child(b, "Bor");
    const xp = store.db.prepare("INSERT INTO xp_events (student_id, amount, reason) VALUES (?, ?, 'test')");
    xp.run(A, 80);
    xp.run(B, 5);
    // Skupina prijateljev (A jo ustvari, B se pridruži) in razred učitelja (oba se pridružita).
    const fg = await a(`/api/students/${A}/friend-groups`, { method: "POST", body: { name: "Skupina" } });
    assert.equal(fg.status, 201, fg.text);
    assert.equal((await b(`/api/students/${B}/classes`, { method: "POST", body: { code: fg.body.code } })).status, 201);
    const cl = await t("/api/teacher/classes", { method: "POST", body: { name: "8.b" } });
    assert.equal(cl.status, 201, cl.text);
    const code = cl.body.code;
    assert.equal((await a(`/api/students/${A}/classes`, { method: "POST", body: { code } })).status, 201);
    assert.equal((await b(`/api/students/${B}/classes`, { method: "POST", body: { code } })).status, 201);
    // Lestvice so res napolnjene (sicer bi test nič ne dokazal): B vidi A-jev vzdevek in XP.
    const lg = await b(`/api/students/${B}/league`);
    assert.equal(lg.status, 200);
    assert.ok(lg.body.classes.every((c) => c.board.length === 2 && c.board.some((m) => m.xp === 80 && m.nickname)), lg.text);
    assert.doesNotMatch(lg.text, LEAK);

    const routes = getRoutes();
    assert.ok(routes.length > 50, `našel samo ${routes.length} poti`);
    const fill = (p, sid) => p.replace(/:(id|sid|studentId)\b/g, sid).replace(/:code\b/g, code).replace(/:[A-Za-z_]+/g, "1").replace(/\*.*$/, "x");
    const leaks = [];
    for (const [who, label, sid] of [[b, "drug račun", B], [t, "učitelj", B]]) {
      for (const p of routes) {
        const r = await who(fill(p, sid));
        if (LEAK.test(r.text)) leaks.push(`${label}: GET ${p} -> ${r.text.slice(0, 160)}`);
      }
    }
    assert.deepEqual(leaks, []);
    // A sam svoje ime seveda vidi (preverimo, da iskanje deluje).
    assert.match((await a("/api/students")).text, LEAK);
  });
});
