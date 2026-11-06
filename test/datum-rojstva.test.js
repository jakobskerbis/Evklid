// Datum rojstva je obvezen (j 2026-11-06): registracija brez njega ne uspe, stari računi brez datuma ga ob
// prijavi vpišejo enkrat (ali izberejo »Pozneje«), mlajši od 15 let (SI, ZVOP-2) gredo prek soglasja staršev.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import SL from "../public/i18n/sl.js";

const ymd = (yearsAgo, days = 1) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - yearsAgo);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};
// Dan pred 15. rojstnim dnem: še 14 let.
const almost15 = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 15);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

async function withServer(fn, extra = {}) {
  const store = openDb(":memory:");
  const logged = [];
  const rec = (...a) => logged.push(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" "));
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "email_1" }) }),
    log: { error: rec, warn: rec, info: rec, log: rec },
    ...extra,
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
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
  // Osebni podatki ne gredo v dnevnik: med testom ujamemo tudi console.*.
  const orig = { log: console.log, info: console.info, warn: console.warn, error: console.error };
  for (const k of Object.keys(orig)) console[k] = rec;
  try {
    await fn({ client, store, logged });
  } finally {
    Object.assign(console, orig);
    server.close();
  }
}

const body = (email, extra = {}) => ({ email, password: "geslo1234", accept_privacy: true, country: "SI", ...extra });
const register = (call, email, extra) => call("/api/auth/register", { method: "POST", body: body(email, extra) });
const parentRow = (store, email) => store.db.prepare("SELECT * FROM parents WHERE email = ?").get(email);

test("registracija: brez datuma rojstva prijazno sporočilo, nič shranjeno", async () => {
  await withServer(async ({ client, store }) => {
    const a = client();
    let r;
    for (const bad of [undefined, "", "2010-02-30", "12.4.1985", ymd(-1)]) {
      r = await register(a, "brez@primer.si", bad === undefined ? {} : { birth_date: bad });
      assert.equal(r.status, 400, String(bad));
      assert.equal(r.body.birth_date, true);
      assert.match(r.body.error, /datum rojstva/);
      assert.match(r.body.error, /starš/); // pove, zakaj ga potrebujemo
    }
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM parents").get().n, 0);
    // Aplikacija pokaže prevedeno besedilo birth.missing (vsi jeziki: test/i18n.test.js); slovensko je enako strežniku.
    assert.equal(SL["birth.missing"], r.body.error);
  });
});

test("registracija: mlajši od 15 let gre prek staršev, 15+ in polnoletni dobijo račun", async () => {
  await withServer(async ({ client, store }) => {
    const kid = await register(client(), "otrok@primer.si", { birth_date: almost15() });
    assert.equal(kid.status, 403);
    assert.equal(kid.body.under_age, true);
    assert.equal(kid.body.min_age, 15); // ZVOP-2: meja v Sloveniji je 15 let
    assert.equal(parentRow(store, "otrok@primer.si"), undefined);

    const teen = await register(client(), "dijak@primer.si", { birth_date: ymd(15) });
    assert.equal(teen.status, 201);
    assert.equal(teen.body.parent.minor, true); // plačila prek staršev
    assert.equal(teen.body.parent.need_birth, false);
    assert.equal(teen.body.parent.birth_missing, false);

    const adult = client();
    const r = await register(adult, "odrasla@primer.si", { birth_date: ymd(30) });
    assert.equal(r.status, 201);
    assert.equal(r.body.parent.minor, false);
    assert.equal(r.body.parent.need_birth, false);
    assert.equal(parentRow(store, "odrasla@primer.si").birth_date, ymd(30));
  });
});

test("star račun brez datuma: ob prijavi enkrat vprašamo, »Pozneje« ne zaklene, datum se vpiše samo enkrat", async () => {
  await withServer(async ({ client, store, logged }) => {
    const a = client();
    assert.equal((await register(a, "star@primer.si", { birth_date: ymd(40) })).status, 201);
    store.db.prepare("UPDATE parents SET birth_date = NULL WHERE email = 'star@primer.si'").run();

    const s1 = await a("/api/account/status");
    assert.equal(s1.body.parent.need_birth, true);
    assert.equal(s1.body.parent.birth_missing, true);
    assert.equal(s1.body.parent.minor, false); // star račun ostane kot doslej, dokler ne vpiše datuma

    // Pozneje: ne vprašamo več, račun deluje naprej, v zavihku Račun ostane možnost vpisa.
    const later = await a("/api/account/birth-date", { method: "POST", body: { later: true } });
    assert.equal(later.status, 200);
    assert.equal(later.body.parent.need_birth, false);
    assert.equal(later.body.parent.birth_missing, true);
    const b = client();
    assert.equal((await b("/api/auth/login", { method: "POST", body: { email: "star@primer.si", password: "geslo1234" } })).status, 200);
    assert.equal((await b("/api/account/status")).body.parent.need_birth, false);

    // Napačen datum: 400 z oznako polja; nič shranjeno.
    for (const bad of ["", "2001-13-01", ymd(-2)]) {
      const r = await b("/api/account/birth-date", { method: "POST", body: { birth_date: bad } });
      assert.equal(r.status, 400, bad);
      assert.equal(r.body.birth_date, true);
    }
    assert.equal(parentRow(store, "star@primer.si").birth_date, null);

    const ok = await b("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(40) } });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.under_age, undefined);
    assert.equal(ok.body.parent.minor, false);
    assert.equal(ok.body.parent.birth_missing, false);
    assert.equal(parentRow(store, "star@primer.si").birth_date, ymd(40));
    // Enkrat vpisanega datuma ni mogoče spremeniti (mladoletni se ne more narediti polnoletnega in obratno).
    const again = await b("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(16) } });
    assert.equal(again.status, 409);
    assert.equal(parentRow(store, "star@primer.si").birth_date, ymd(40));
    // Datum rojstva ne gre v dnevnik.
    assert.ok(!logged.some((l) => l.includes(ymd(40)) || l.includes(ymd(16))), logged.join("\n"));
  });
});

test("star račun: mladoleten in mlajši od 15 let po vpisu datuma", async () => {
  await withServer(async ({ client, store }) => {
    const teen = client();
    await register(teen, "najstnik@primer.si", { birth_date: ymd(40) });
    const kid = client();
    await register(kid, "otrok@primer.si", { birth_date: ymd(40) });
    store.db.prepare("UPDATE parents SET birth_date = NULL").run();

    // 16 let: shranjeno, plačila prek staršev (minor), brez poziva k soglasju.
    const t16 = await teen("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(16) } });
    assert.equal(t16.status, 200);
    assert.equal(t16.body.under_age, undefined);
    assert.equal(t16.body.parent.minor, true);

    // 14 let: shranjeno (plačila prek staršev), odgovor pove mejo za soglasje staršev.
    const k14 = await kid("/api/account/birth-date", { method: "POST", body: { birth_date: almost15() } });
    assert.equal(k14.status, 200);
    assert.equal(k14.body.under_age, true);
    assert.equal(k14.body.min_age, 15);
    assert.equal(k14.body.parent.minor, true);
    assert.equal(k14.body.parent.need_birth, false);
  });
});

test("datum rojstva: brez prijave 401, gost ga ne vpisuje", async () => {
  await withServer(
    async ({ client }) => {
      assert.equal((await client()("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(30) } })).status, 401);
      const g = client();
      const guest = await g("/api/auth/guest", { method: "POST", body: { accept_privacy: true } });
      assert.equal(guest.status, 201);
      assert.equal(guest.body.parent.need_birth, false);
      assert.equal((await g("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(30) } })).status, 400);
    },
    { guest: true },
  );
});
