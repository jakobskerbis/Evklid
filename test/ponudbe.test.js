// Pravila ponudb (server/placila/ponudbe.js): ne med poukom, učitelj jih izklopi, pod 15 let brez cene.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { offerPolicy, inLesson } from "../server/placila/ponudbe.js";
import { nowParts } from "../server/schedule.js";

const YEAR = new Date().getFullYear();
const day = (n) =>
  new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

test("offerPolicy: pouk, učitelj, šolski čas, starost", () => {
  const mon10 = { day: 1, time: "10:00" };
  const sat10 = { day: 6, time: "10:00" };
  const lessons = [{ day: 1, start: "09:50", end: "10:35" }];
  assert.equal(inLesson(lessons, mon10), true);
  assert.equal(inLesson(lessons, { day: 1, time: "10:35" }), false);
  assert.equal(inLesson(lessons, { day: 2, time: "10:00" }), false);
  assert.deepEqual(offerPolicy({ age: 16, now: mon10 }), {
    show: true,
    prices: true,
    reason: null,
  });
  assert.equal(offerPolicy({ age: 16, lessons, now: mon10 }).reason, "lesson");
  // Odmor med urami istega dne je še pouk; po zadnji uri ponudba sme biti.
  const day2 = [...lessons, { day: 1, start: "11:40", end: "12:25" }];
  assert.equal(offerPolicy({ age: 16, lessons: day2, now: { day: 1, time: "11:00" } }).reason, "lesson");
  assert.equal(offerPolicy({ age: 16, lessons: day2, now: { day: 1, time: "12:25" } }).show, true);
  assert.equal(
    offerPolicy({ age: 16, membership: { offersOff: true }, now: sat10 })
      .reason,
    "teacher_off",
  );
  // Učenec iz šole brez Urnika: med tednom od 7.00 do 15.00 brez ponudb, ob koncu tedna lahko.
  assert.equal(
    offerPolicy({ age: 16, membership: { inSchool: true }, now: mon10 }).reason,
    "school_hours",
  );
  assert.equal(
    offerPolicy({
      age: 16,
      membership: { inClass: true },
      now: { day: 1, time: "16:00" },
    }).show,
    true,
  );
  assert.equal(
    offerPolicy({ age: 16, membership: { inSchool: true }, now: sat10 }).prices,
    true,
  );
  // Pod 15 let ali neznana starost: brez cene.
  assert.deepEqual(offerPolicy({ age: 14, now: sat10 }), {
    show: true,
    prices: false,
    reason: "under_15",
  });
  assert.equal(offerPolicy({ age: null, now: sat10 }).prices, false);
});

function fakeFetch(calls) {
  let n = 0;
  return async (url, init = {}) => {
    const u = new URL(url);
    const body = init.body
      ? init.headers?.["Content-Type"]?.includes("json")
        ? JSON.parse(init.body)
        : Object.fromEntries(new URLSearchParams(init.body))
      : null;
    calls.push({ host: u.host, path: u.pathname, body });
    const p = u.pathname.replace("/v1", "");
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (p === "/prices" && init.method === "GET") return ok({ data: [] });
    if (p === "/prices") return ok({ id: "price_" + body.lookup_key });
    return ok({ id: "x_" + ++n, data: [] });
  };
}

async function withServer(fn) {
  const store = openDb(":memory:");
  const calls = [];
  const members = new Map(); // studentId → { inSchool, inClass, offersOff }
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    stripeKey: "sk_test_x",
    resendKey: "re_x",
    webhookSecret: "whsec_test",
    fetchFn: fakeFetch(calls),
    log: { error() {} },
    schoolSource: {
      access: () => null,
      students: () => [],
      membership: (db, id) => members.get(id) || null,
    },
    streamFn: async ({ onText }) => {
      onText("ok");
      return {
        text: 'ok\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>',
        stopReason: "end_turn",
      };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, {
      method: opts.method || "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: Object.entries(jar)
          .map(([k, v]) => `${k}=${v}`)
          .join("; "),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      redirect: "manual",
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      const i = kv.indexOf("=");
      jar[kv.slice(0, i)] = kv.slice(i + 1);
    }
    const type = res.headers.get("content-type") || "";
    return {
      status: res.status,
      body: type.includes("json") ? await res.json() : await res.text(),
    };
  };
  try {
    const r = await call("/api/auth/register", {
      method: "POST",
      body: {
        email: "ponudbe@kod.si",
        password: "geslo1234",
        accept_privacy: true,
        birth_date: "1985-04-12",
      },
    });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
    const kid = async (name, age) =>
      (
        await call("/api/students", {
          method: "POST",
          body: { name, birth_year: YEAR - age, consent: true },
        })
      ).body;
    const young = await kid("Lan", 12);
    const teen = await kid("Ema", 17);
    store.db
      .prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'")
      .run();
    await fn({ call, store, young, teen, members });
  } finally {
    server.close();
  }
}

test("paket pred testom: pod 15 brez cene, med poukom in z izklopom učitelja brez ponudbe", async () => {
  await withServer(async ({ call, young, teen, members }) => {
    for (const k of [young, teen]) {
      const r = await call(`/api/students/${k.id}/schedule`, {
        method: "PUT",
        body: {
          events: [{ date: day(5), kind: "test", name: "Test iz ulomkov" }],
        },
      });
      assert.equal(r.status, 200, JSON.stringify(r.body));
    }
    const offer = async (k) =>
      (await call(`/api/students/${k.id}/pass-offer`)).body;
    // Pod 15 let: le povezava s podatki za starše, brez cen.
    // Brez gumba »Poglej pakete« ob prehodu v višjo stopnjo in pri zaklenjenem poskusu za otroka pod 15.
    assert.equal((await call(`/api/students/${young.id}/level-up`)).body.offers.prices, false);
    const y = await offer(young);
    assert.equal(y.offer.parent_info, true);
    assert.deepEqual(y.passes, []);
    assert.doesNotMatch(JSON.stringify(y), /amount/);
    // 15 let in več: ponudba s cenami.
    const t = await offer(teen);
    assert.equal(t.offer.parent_info, undefined);
    assert.equal(t.passes.length, 2);
    // Učitelj je izklopil ponudbe.
    members.set(teen.id, { inClass: true, offersOff: true });
    assert.equal((await offer(teen)).offer, null);
    members.delete(teen.id);
    // Med poukom po Urniku ni ponudbe.
    const now = nowParts();
    const lesson = {
      day: now.day,
      start: "00:00",
      end: "23:59",
      name: "Matematika",
    };
    const put = await call(`/api/students/${teen.id}/schedule`, {
      method: "PUT",
      body: {
        lessons: [lesson],
        events: [{ date: day(5), kind: "test", name: "Test iz ulomkov" }],
      },
    });
    assert.equal(put.status, 200, JSON.stringify(put.body));
    assert.equal((await offer(teen)).offer, null);
  });
});

test("porabljena vprašanja: učenec iz šole in otrok pod 15 ne dobita ponudbe nakupa", async () => {
  process.env.EVKLID_FREE_DAILY_QUESTIONS = "0";
  try {
    await withServer(async ({ call, young, teen, members }) => {
      const ask = async (k) => {
        const conv = (
          await call(`/api/students/${k.id}/conversations`, { method: "POST" })
        ).body;
        return (
          await call(`/api/conversations/${conv.id}/messages`, {
            method: "POST",
            body: { text: "Pomoč?" },
          })
        ).body;
      };
      const y = await ask(young);
      assert.equal(y.upgrade, false);
      assert.doesNotMatch(y.error, /naročnin/);
      // Sobota ali po pouku: učenec iz šole vseeno ne dobi ponudbe ob omejitvi.
      members.set(teen.id, { inSchool: true });
      assert.equal((await ask(teen)).upgrade, false);
      members.delete(teen.id);
      const t = await ask(teen);
      assert.equal(t.upgrade, true);
      assert.match(t.error, /naročnino/);
    });
  } finally {
    delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
  }
});

test("lasten profil 15-letnega imetnika: točna starost iz datuma rojstva, cena in povezava za starše", async () => {
  await withServer(async ({ call, store, young, teen }) => {
    // Preizkus, ki pokrije test: otrok pod 15 ne dobi niti kartice za starše.
    await call(`/api/students/${young.id}/schedule`, {
      method: "PUT",
      body: { events: [{ date: day(2), kind: "test", name: "Test iz ulomkov" }] },
    });
    store.db.prepare("UPDATE parents SET trial_ends_at = ?").run(new Date(Date.now() + 9 * 86400000).toISOString());
    assert.equal((await call(`/api/students/${young.id}/pass-offer`)).body.offer, null);
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    // Imetnik, ki je 15 let že dopolnil (letnica sama bi previdno dala 14).
    store.db.prepare("UPDATE parents SET birth_date = ?").run(`${YEAR - 15}-01-01`);
    store.db.prepare("UPDATE students SET birth_year = ? WHERE id = ?").run(YEAR - 15, teen.id);
    await call(`/api/students/${teen.id}/schedule`, {
      method: "PUT",
      body: { events: [{ date: day(5), kind: "test", name: "Test iz ulomkov" }] },
    });
    const r = (await call(`/api/students/${teen.id}/pass-offer`)).body;
    assert.equal(r.offer.parent_info, undefined);
    assert.equal(r.offer.pay_link, true);
    assert.equal(r.passes.length, 2);
  });
});
