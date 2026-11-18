// E-mail skrbniku ob oznaki stiske (server/stiska-obvestilo.js, j 18. 11. 2026): brez vsebine in imena, največ en
// e-mail na 10 minut s številom, napake samo v dnevnik, stikalo EVKLID_STISKA_EMAIL in namestnik, pregledano_ob.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { newKey, isEncrypted, openPregled } from "../server/crypto-polje.js";
import { runRetention } from "../server/zasebnost.js";
import { startStiskaObvestila, stiskaEmail, prejemniki, seznamStisk, OKNO_MS, POSKUSOV, POT } from "../server/stiska-obvestilo.js";

const ADULT = "1985-04-12";
const SKRITO = "Ne morem več, moja skrivnost Zvezdoslav";
const DISTRESS_REPLY = 'Slišim te, Miha. Pokliči TOM 116 111. Je zdaj kdo pri tebi?\n<<META subject=MAT topic="-" error=0 mode=A flag=distress done=0>>';
const ADMIN = "skrbnik@primer.si";
const NAMESTNIK = "namestnik@primer.si";

function belezka() {
  const vrstice = [];
  const f = (...a) => vrstice.push(a.join(" "));
  return { vrstice, error: f, warn: f, info: f };
}
function postar({ napaka = false } = {}) {
  const poslano = [];
  return {
    poslano,
    enabled: true,
    async send(m) {
      if (napaka) throw new Error(`Resend 503 za ${m.to}`);
      poslano.push(m);
    },
  };
}
const withEnv = async (vars, fn) => {
  const prev = Object.fromEntries(Object.keys(vars).map((k) => [k, process.env[k]]));
  Object.assign(process.env, vars);
  try {
    return await fn();
  } finally {
    for (const [k, v] of Object.entries(prev)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
};
const tick = () => new Promise((r) => setImmediate(r));

function oznaka(store, s, c) {
  return store.addEvent({ student_id: s.id, conversation_id: c.id, subject: "MAT", topic: "x", error: 0, mode: "A", flag: "distress" });
}

test("stiska e-mail: samo vrsta, stopnja, čas in povezava; brez imena, vsebine in id-jev", () => {
  const m = stiskaEmail([{ ob: "2026-11-18T13:05:00Z", vrsta: "stiska" }], { EVKLID_BASE_URL: "https://primer.app/" });
  assert.match(m.subject, /nova oznaka stiske \(stopnja visoka\) – preglej v 24 urah/);
  assert.match(m.text, /18\. 11\. 2026 14\.05 – stiska, stopnja visoka/);
  assert.ok(m.text.includes(`https://primer.app${POT}`));
  assert.ok(m.html.includes(`https://primer.app${POT}`));
  const vec = stiskaEmail([{ ob: "2026-11-18T13:05:00Z", vrsta: "pogovor" }, { ob: "2026-11-18T13:06:00Z", vrsta: "zdravje" }, { ob: "2026-11-18T13:07:00Z", vrsta: null }], {});
  assert.match(vec.subject, /3 novih oznak stiske \(stopnja nujno \(112\)\)/);
  assert.match(vec.text, /vrsta ni zapisana, stopnja neznana/);
});

test("stiska e-mail: prejemniki, stikalo EVKLID_STISKA_EMAIL in namestnik", () => {
  assert.deepEqual(prejemniki({}), []);
  assert.deepEqual(prejemniki({ EVKLID_ADMIN_EMAILS: ADMIN }), [ADMIN]);
  assert.deepEqual(prejemniki({ EVKLID_ADMIN_EMAILS: `${ADMIN}, Skrbnik@primer.si`, EVKLID_STISKA_EMAIL_NAMESTNIK: NAMESTNIK }), [ADMIN, NAMESTNIK]);
  assert.deepEqual(prejemniki({ EVKLID_STISKA_EMAIL_NAMESTNIK: NAMESTNIK }), [NAMESTNIK]);
  for (const off of ["0", "off", "ne", "false"]) assert.deepEqual(prejemniki({ EVKLID_ADMIN_EMAILS: ADMIN, EVKLID_STISKA_EMAIL: off }), []);
  assert.deepEqual(prejemniki({ EVKLID_ADMIN_EMAILS: ADMIN, EVKLID_STISKA_EMAIL: "1" }), [ADMIN]);
});

test("stiska e-mail: v nizu oznak največ en e-mail na 10 minut, nato en s številom; namestnik dobi enakega", async () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Miha");
  const c = store.createConversation(s.id);
  let ura = new Date("2026-11-18T10:00:00Z");
  const mailer = postar();
  const log = belezka();
  const o = startStiskaObvestila(store.db, { scheduler: false, env: { EVKLID_ADMIN_EMAILS: ADMIN, EVKLID_STISKA_EMAIL_NAMESTNIK: NAMESTNIK }, mailer, log, now: () => ura });
  o.nova(oznaka(store, s, c), "stiska");
  await tick();
  assert.equal(mailer.poslano.length, 2, "skrbnik in namestnik");
  assert.deepEqual(mailer.poslano.map((m) => m.to).sort(), [NAMESTNIK, ADMIN].sort());
  assert.match(mailer.poslano[0].subject, /nova oznaka stiske/);
  // Še tri oznake v 10 minutah: nič novega.
  for (const v of ["nasilje", "zdravje", "pogovor"]) {
    ura = new Date(ura.getTime() + 2 * 60e3);
    o.nova(oznaka(store, s, c), v);
    await tick();
  }
  assert.equal(mailer.poslano.length, 2);
  assert.equal(o.stanje().cakajo, 3);
  assert.equal(await o.run(), "čaka");
  ura = new Date(Date.parse("2026-11-18T10:00:00Z") + OKNO_MS);
  assert.equal(await o.run(), "poslano");
  assert.equal(mailer.poslano.length, 4);
  assert.match(mailer.poslano[2].subject, /3 novih oznak stiske \(stopnja nujno \(112\)\)/);
  assert.equal(o.stanje().cakajo, 0);
  assert.equal(await o.run(), null, "nič ne čaka");
  // Čakajoče oznake v kv so šifrirane, kadar je ključ.
  store.db.close();
});

test("stiska e-mail: napaka pošte ne vrže, gre v dnevnik brez naslova, ponovi se po oknu in po POSKUSOV obupa", async () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Miha");
  const c = store.createConversation(s.id);
  let ura = new Date("2026-11-18T10:00:00Z");
  const mailer = postar({ napaka: true });
  const log = belezka();
  const o = startStiskaObvestila(store.db, { scheduler: false, env: { EVKLID_ADMIN_EMAILS: ADMIN }, mailer, log, now: () => ura });
  assert.doesNotThrow(() => o.nova(oznaka(store, s, c), "stiska"));
  await tick();
  assert.ok(log.vrstice.some((v) => /oznaka stiske: e-pošta skrbniku ni uspela/.test(v)));
  assert.ok(log.vrstice.every((v) => !v.includes("@")), "brez e-naslovov v dnevniku");
  assert.equal(o.stanje().cakajo, 1);
  assert.equal(await o.run(), "čaka", "naslednji poskus šele po oknu");
  for (let i = 1; i < POSKUSOV; i++) {
    ura = new Date(ura.getTime() + OKNO_MS);
    assert.equal(await o.run(), "napaka");
  }
  assert.equal(o.stanje().cakajo, 0, "po POSKUSOV obupa (oznaka ostane na strani skrbnika)");
  assert.equal(seznamStisk(store.db).length, 1);
  // Brez prejemnika ali izklopljeno: nič ne čaka, nič ne pošlje.
  const m2 = postar();
  const off = startStiskaObvestila(store.db, { scheduler: false, env: { EVKLID_ADMIN_EMAILS: ADMIN, EVKLID_STISKA_EMAIL: "0" }, mailer: m2, log, now: () => ura });
  off.nova(oznaka(store, s, c), "stiska");
  await tick();
  assert.equal(m2.poslano.length, 0);
  assert.equal(off.stanje().cakajo, 0);
  assert.equal(off.stanje().vklopljeno, false);
  // Vrsta okna se zapiše tudi, ko je e-mail izklopljen.
  assert.equal(seznamStisk(store.db)[0].vrsta, "stiska");
  store.db.close();
});

test("stiska e-mail: pregled oznake šifriran in enako dolg pri vseh oznakah; rok hrambe ga pobriše", async () => {
  await withEnv({ EVKLID_DATA_KEY: newKey() }, async () => {
    const store = openDb(":memory:");
    const s = store.createStudent("Miha");
    const c = store.createConversation(s.id);
    const o = startStiskaObvestila(store.db, { scheduler: false, env: { EVKLID_ADMIN_EMAILS: ADMIN }, mailer: postar(), log: belezka() });
    const id = oznaka(store, s, c);
    o.nova(id, "nasilje");
    await tick();
    store.addEvent({ student_id: s.id, conversation_id: c.id, subject: "MAT", topic: "x", error: 0, mode: "A", flag: "unsafe" });
    store.addEvent({ student_id: s.id, conversation_id: c.id, subject: "MAT", topic: "x", error: 0, mode: "A", flag: "none" });
    const rows = store.db.prepare("SELECT flag, pregled FROM events ORDER BY id").all();
    assert.equal(rows[2].pregled, null, "navaden dogodek brez pregleda");
    assert.ok(isEncrypted(rows[0].pregled) && isEncrypted(rows[1].pregled));
    assert.equal(rows[0].pregled.length, rows[1].pregled.length, "stiska in druga oznaka sta enako dolgi");
    assert.equal(openPregled(rows[0].pregled).v, "nasilje");
    assert.ok(isEncrypted(store.db.prepare("SELECT value FROM kv WHERE key = 'stiska_obvestilo'").get().value), "čakajoče šifrirane");
    store.db.exec("UPDATE events SET created_at = datetime('now', '-91 days')");
    runRetention(store.db, { log: belezka() });
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM events WHERE pregled IS NOT NULL").get().n, 0);
    store.db.close();
  });
});

async function withServer(store, fn, { fetchFail = false } = {}) {
  const calls = [];
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn: async (url, init = {}) => {
      const body = init.body ? JSON.parse(init.body) : null;
      calls.push({ url, body });
      if (fetchFail && /stisk/.test(body?.subject || "")) return { ok: false, status: 503, json: async () => ({ message: "napaka" }) };
      return { ok: true, status: 200, json: async () => ({ id: "m" }) };
    },
    log: { error() {}, info() {}, warn() {} },
    varnostFn: async () => ({ content: [{ type: "text", text: "NE" }] }),
    streamFn: async ({ onText }) => {
      onText(DISTRESS_REPLY);
      return { text: DISTRESS_REPLY, stopReason: "end_turn" };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (p, opts = {}) => {
      const res = await fetch(base + p, {
        method: opts.method || "GET",
        headers: { "Content-Type": "application/json", "X-Forwarded-For": "203.0.113.5", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "), ...(opts.headers || {}) },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        redirect: "manual",
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
    await fn({ client, calls });
  } finally {
    server.close();
  }
}

async function register(call, calls, email) {
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const mail = calls.filter((c) => String(c.url).includes("resend") && c.body.to[0] === email).at(-1);
  assert.equal((await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0])).status, 302);
}
async function child(call) {
  const s = await call("/api/students", { method: "POST", body: { name: "Miha", birth_year: new Date().getFullYear() - 12, consent: true, profile_password: "1234" } });
  assert.equal(s.status, 201, JSON.stringify(s.body));
  await call(`/api/students/${s.body.id}/unlock`, { method: "POST", body: { password: "1234" } });
  return s.body;
}

test("stiska e-mail v aplikaciji: oznaka → en e-mail skrbniku brez imena in vsebine; stran skrbnika in pregledano_ob", async () => {
  await withEnv({ EVKLID_DATA_KEY: newKey(), EVKLID_ADMIN_EMAILS: ADMIN, EVKLID_STISKA_EMAIL_NAMESTNIK: NAMESTNIK, EVKLID_STISKA_EMAIL: "" }, async () => {
    const store = openDb(":memory:");
    await withServer(store, async ({ client, calls }) => {
      const starš = client();
      await register(starš, calls, "ana@primer.si");
      const s = await child(starš);
      const c = await starš(`/api/students/${s.id}/conversations`, { method: "POST" });
      const r = await starš(`/api/conversations/${c.body.id}/messages`, { method: "POST", body: { text: SKRITO } });
      assert.match(r.body, /event: nujno/);
      assert.match(r.body, /event: done/);
      await tick();
      const maili = calls.filter((x) => String(x.url).includes("resend") && /stisk/.test(x.body.subject));
      assert.equal(maili.length, 2, "skrbnik in namestnik, vsak en e-mail");
      assert.deepEqual(maili.map((m) => m.body.to[0]).sort(), [ADMIN, NAMESTNIK].sort());
      for (const m of maili) {
        const vse = JSON.stringify(m.body);
        for (const prepovedano of ["Miha", "Zvezdoslav", "skrivnost", "Ne morem", "Slišim te", "116 111", "ana@primer.si", `"${s.id}"`, c.body.title || "Nov pogovor"]) {
          assert.equal(vse.includes(prepovedano), false, `e-mail ne sme vsebovati »${prepovedano}«`);
        }
        assert.match(m.body.text, /stiska, stopnja visoka/);
        assert.ok(m.body.text.includes(POT));
      }
      // Drugo sporočilo takoj za tem: v 10 minutah ni novega e-maila.
      await starš(`/api/conversations/${c.body.id}/messages`, { method: "POST", body: { text: "Še vedno." } });
      await tick();
      assert.equal(calls.filter((x) => String(x.url).includes("resend") && /stisk/.test(x.body.subject)).length, 2);

      // Starš ni skrbnik: stran je zaprta.
      assert.equal((await starš(`${POT}?json=1`)).status, 403);
      const ev = store.db.prepare("SELECT id FROM events WHERE student_id = ? ORDER BY id LIMIT 1").get(s.id).id;
      assert.equal((await starš(`${POT}/${ev}/pregledano`, { method: "POST" })).status, 403);

      const skrbnik = client();
      await register(skrbnik, calls, ADMIN);
      const l = await skrbnik(`${POT}?json=1`);
      assert.equal(l.status, 200, JSON.stringify(l.body));
      assert.equal(l.body.oznake.length, 2);
      assert.equal(l.body.povzetek.odprtih, 2);
      assert.ok(!JSON.stringify(l.body).includes("Miha"), "brez imena");
      assert.ok(!JSON.stringify(l.body).includes("Zvezdoslav"), "brez vsebine");
      assert.equal(l.body.oznake.at(-1).vrsta, "stiska");
      const html = await skrbnik(POT);
      assert.match(html.body, /Označi kot pregledano/);
      assert.ok(!html.body.includes("Miha"));
      // Napačen id, ne-stiska, obrazec z druge strani.
      assert.equal((await skrbnik(`${POT}/abc/pregledano`, { method: "POST" })).status, 404);
      assert.equal((await skrbnik(`${POT}/999999/pregledano`, { method: "POST" })).status, 404);
      assert.equal((await skrbnik(`${POT}/${ev}/pregledano`, { method: "POST", headers: { "Sec-Fetch-Site": "cross-site" } })).status, 403);
      // Označi kot pregledano: pregledano_ob zapisan, šifriran, v dnevniku dostopov; drugič se ne spremeni.
      const p = await skrbnik(`${POT}/${ev}/pregledano?json=1`, { method: "POST" });
      assert.equal(p.status, 200);
      assert.ok(Date.parse(p.body.pregledano_ob) > 0);
      const p2 = await skrbnik(`${POT}/${ev}/pregledano?json=1`, { method: "POST" });
      assert.equal(p2.body.pregledano_ob, p.body.pregledano_ob);
      assert.equal((await skrbnik(`${POT}/${ev}/pregledano`, { method: "POST" })).status, 303);
      const raw = store.db.prepare("SELECT pregled FROM events WHERE id = ?").get(ev).pregled;
      assert.ok(isEncrypted(raw));
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'stiska_pregledano'").get().n, 1);
      const l2 = await skrbnik(`${POT}?json=1`);
      assert.equal(l2.body.povzetek.pregledanih, 1);
      assert.equal(l2.body.povzetek.v_roku, 1);
      const o = l2.body.oznake.find((x) => x.id === ev);
      assert.equal(o.v_roku, true);
      assert.ok(o.ur_do_pregleda >= 0 && o.ur_do_pregleda < 1);
    });
    store.db.close();
  });
});

test("stiska e-mail v aplikaciji: Resend ne dela → učenec vseeno dobi varnostni odgovor; brez skrbnika ni e-maila", async () => {
  await withEnv({ EVKLID_ADMIN_EMAILS: ADMIN, EVKLID_STISKA_EMAIL: "" }, async () => {
    const store = openDb(":memory:");
    await withServer(
      store,
      async ({ client, calls }) => {
        const starš = client();
        await register(starš, calls, "ana@primer.si");
        const s = await child(starš);
        const c = await starš(`/api/students/${s.id}/conversations`, { method: "POST" });
        const r = await starš(`/api/conversations/${c.body.id}/messages`, { method: "POST", body: { text: SKRITO } });
        assert.equal(r.status, 200);
        assert.match(r.body, /event: nujno/);
        assert.match(r.body, /event: done/);
        await tick();
        assert.equal(calls.filter((x) => /stisk/.test(x.body?.subject || "")).length, 1, "poskus je bil, ni uspel");
      },
      { fetchFail: true },
    );
    store.db.close();
  });
  await withEnv({ EVKLID_ADMIN_EMAILS: ADMIN, EVKLID_STISKA_EMAIL: "0" }, async () => {
    const store = openDb(":memory:");
    await withServer(store, async ({ client, calls }) => {
      const starš = client();
      await register(starš, calls, "ana@primer.si");
      const s = await child(starš);
      const c = await starš(`/api/students/${s.id}/conversations`, { method: "POST" });
      const r = await starš(`/api/conversations/${c.body.id}/messages`, { method: "POST", body: { text: SKRITO } });
      assert.match(r.body, /event: done/);
      await tick();
      assert.equal(calls.filter((x) => /stisk/.test(x.body?.subject || "")).length, 0);
    });
    store.db.close();
  });
});
