// Točki 1.1 in A1: poševnica na koncu poti ne obide preverjanj pred potmi (dnevna meja vprašanj inštruktorju).
// Express pot /api/conversations/:id/messages/ ujema kot pot brez poševnice, vmesnik računov pa je mejo
// preverjal z /\/messages$/ nad req.path, zato je bilo s poševnico vprašanj neomejeno (do meje v $).
// A1: nekanonične poti /api (velike črke v predponi, poševnica na koncu, »//«) dobijo 404, dnevna meja pa se
// preverja v obdelavi sporočila tik pred rezervacijo za klic AI.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const YEAR = new Date().getFullYear();

async function withServer(fn) {
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    const u = new URL(url);
    calls.push({ host: u.host, path: u.pathname, body: init.body ? JSON.parse(init.body) : null });
    return { ok: true, status: 200, json: async () => ({ id: "x" }), text: async () => "{}" };
  };
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn,
    log: { error() {} },
    streamFn: async ({ onText }) => {
      onText("ok");
      return { text: 'ok\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>', stopReason: "end_turn" };
    },
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
    await fn({ call, calls, store, base, jar });
  } finally {
    server.close();
  }
}

test("1.1 in A1: nekanonična pot dobi 404, dnevna meja velja na kanonični poti", async () => {
  process.env.EVKLID_FREE_DAILY_QUESTIONS = "2";
  try {
    await withServer(async ({ call, calls, store, base, jar }) => {
      const reg = await call("/api/auth/register", { method: "POST", body: { email: "posevnica@primer.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
      assert.equal(reg.status, 201);
      const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
      await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
      const kid = (await call("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 10, consent: true } })).body;
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run(); // brezplačni paket
      const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      const ask = (suffix, t, prefix = "/api") => call(`${prefix}/conversations/${conv.id}/messages${suffix}`, { method: "POST", body: { text: t } });

      // Nekanonične poti: 404, nič se ne shrani in nič ne šteje.
      for (const prefix of ["/api", "/API", "/Api"]) {
        for (const suffix of ["/", "//", "/?x=1"]) {
          const r = await ask(suffix, "mimo", prefix);
          assert.equal(r.status, 404, `${prefix}…/messages${suffix}`);
        }
      }
      for (const prefix of ["/API", "/Api"]) assert.equal((await ask("", "mimo", prefix)).status, 404, `${prefix}…/messages`);
      assert.equal((await call(`/api//conversations/${conv.id}/messages`, { method: "POST", body: { text: "mimo" } })).status, 404);
      // Kanonična pot šteje v mejo; tretje vprašanje ustavi meja, tudi z velikimi črkami za predpono (Express jih ne loči).
      assert.equal((await ask("", "prvo")).status, 200);
      assert.equal((await ask("?x=1", "drugo")).status, 200);
      for (const pot of [`/api/conversations/${conv.id}/messages`, `/api/conversations/${conv.id}/messages?x=1`, `/api/CONVERSATIONS/${conv.id}/MESSAGES`]) {
        const r = await call(pot, { method: "POST", body: { text: "tretje" } });
        assert.equal(r.status, 429, pot);
        assert.equal(r.body.code, "block.freeDaily", pot);
      }
      // Branje pogovora z velikimi črkami v predponi: 404, nič ne gre v predpomnilnik.
      const res = await fetch(`${base}/API/conversations/${conv.id}`, { headers: { cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") } });
      assert.equal(res.status, 404);
      const n = store.db.prepare("SELECT COUNT(*) AS n FROM messages WHERE conversation_id = ? AND role = 'user'").get(conv.id).n;
      assert.equal(n, 2);
    });
  } finally {
    delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
  }
});

// Velike črke v poti: Express jih pri ujemanju ne loči, preverjanja v vmesnikih pa morajo veljati enako
// (izbris profila se zapiše v profile_changes, ki omejuje menjavo profilov; opravila po izbrisu).
test("1.1: izbris profila z velikimi črkami v poti se zapiše kot izbris", async () => {
  await withServer(async ({ call, calls, store }) => {
    const reg = await call("/api/auth/register", { method: "POST", body: { email: "crke@primer.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(reg.status, 201);
    const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
    const kid = (await call("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 10, consent: true } })).body;
    assert.equal((await call(`/api/students/${kid.id}/`, { method: "DELETE" })).status, 404, "poševnica na koncu: 404 (A1)");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM students WHERE id = ?").get(kid.id).n, 1);
    const del = await call(`/api/STUDENTS/${kid.id}`, { method: "DELETE" });
    assert.equal(del.status, 200, JSON.stringify(del.body));
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM students WHERE id = ?").get(kid.id).n, 0);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM profile_changes WHERE kind = 'deleted' AND student_id = ?").get(kid.id).n, 1);
  });
});

// A1: tudi javne poti računov (prijava, nastavitve) in poti brez prijave dobijo 404, če niso kanonične.
test("A1: nekanonične javne poti /api dobijo 404, kanonične delujejo", async () => {
  await withServer(async ({ call }) => {
    assert.equal((await call("/api/config")).status, 200);
    for (const pot of ["/api/config/", "/API/config", "/api//config"]) assert.equal((await call(pot)).status, 404, pot);
    const prijava = { method: "POST", body: { email: "nihce@primer.si", password: "geslo1234" } };
    assert.equal((await call("/api/auth/login/", prijava)).status, 404);
    assert.equal((await call("/Api/auth/login", prijava)).status, 404);
    assert.notEqual((await call("/api/auth/login", prijava)).status, 404);
    assert.equal((await call("/api/students/")).status, 404);
    assert.equal((await call("/api/students")).status, 401);
  });
});

// A1 (pregled 2): zahteva v absolutni obliki (req.url brez začetne »/«) je nekanonična, tudi s pravilno potjo.
test("A1: zahteva v absolutni obliki na /api dobi 404", async () => {
  const net = await import("node:net");
  await withServer(async ({ base }) => {
    const { port } = new URL(base);
    const surovo = (vrstica) =>
      new Promise((ok, napaka) => {
        const s = net.connect(Number(port), "127.0.0.1", () => s.write(`${vrstica}\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n`));
        let out = "";
        s.on("data", (d) => (out += d));
        s.on("end", () => ok(Number(out.split(" ")[1])));
        s.on("error", napaka);
      });
    assert.equal(await surovo("GET /api/config HTTP/1.1"), 200);
    assert.equal(await surovo(`GET http://127.0.0.1:${port}/api/config HTTP/1.1`), 404);
    assert.equal(await surovo(`GET http://127.0.0.1:${port}/API/config/ HTTP/1.1`), 404);
  });
});
