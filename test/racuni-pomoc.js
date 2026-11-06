// Pomočnik za teste trde meje AI: strežnik z računi (starš s potrjenim e-naslovom, otrok brez paketa, preizkus potekel).
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

export const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>';
const YEAR = new Date().getFullYear();

// Strežnik z računi (kot test/pravice.test.js): starš, potrjen e-naslov, otrok brez paketa.
export async function withAccounts(env, fn, extra = {}) {
  const prev = {};
  for (const [k, v] of Object.entries(env)) {
    prev[k] = process.env[k];
    process.env[k] = v;
  }
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    calls.push({ host: new URL(url).host, body: init.body ? JSON.parse(init.body) : null });
    return { ok: true, status: 200, json: async () => ({ id: "x" }) };
  };
  const members = [];
  const licence = { schoolId: 1, schoolName: "OŠ Test", licenceId: 10, plan: "class", seats: 5, subjects: null, grades: null, validUntil: new Date(Date.now() + 60 * 86400000).toISOString(), aiCapUsdMonth: 0 };
  const schoolSource = { access: (db, id) => (members.includes(id) ? licence : null), students: () => members };
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn,
    log: { error() {} },
    schoolSource,
    streamFn: async ({ onText }) => {
      onText("ok");
      return { text: "ok" + META, stopReason: "end_turn" };
    },
    ...extra,
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, opts = {}) => {
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
  try {
    const r = await call("/api/auth/register", { method: "POST", body: { email: "meja@x.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(calls.filter((c) => c.host === "api.resend.com").at(-1).body.text)[0]);
    const kid = (await call("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 13, consent: true } })).body;
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    await fn({ call, store, kid, members, app, calls });
  } finally {
    server.close();
    for (const [k, v] of Object.entries(prev)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

