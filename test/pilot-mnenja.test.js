// Mnenja članov pilota (server/pilot-mnenja.js): samo člani, vprašanje po smiselni uporabi in največ enkrat na teden,
// objava samo z izrecnim dovoljenjem in ne za mlajše od 15 let, skrbnik vidi seznam brez imen, izvoz in izbris (GDPR).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { opinionState, opinionsReport, publishAllowed, withoutName, MIN_DAYS, MIN_SOLVED, ASK_EVERY_DAYS, AFTER_OPINION_DAYS, DAILY_MAX, TEXT_MAX, CONSENT_VERSION } from "../server/pilot-mnenja.js";
import { SEALED } from "../server/crypto-polje.js";
import SL from "../public/i18n/sl.js";
import crypto from "node:crypto";

// Besedili shranimo samo šifrirani: testi tečejo s ključem (brez ključa posebej spodaj).
process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "e" }) }), log: { error() {}, warn() {}, info() {}, log() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
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
  const warn = console.warn;
  console.warn = () => {};
  try {
    await fn({ client, store });
  } finally {
    console.warn = warn;
    server.close();
  }
}

// Račun z lastnim profilom »Maja« (starost `age`), potrjen e-naslov.
async function account(client, store, email, age) {
  const call = client();
  const y = new Date().getFullYear() - age;
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, country: "SI", birth_date: `${y}-01-15` } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run(email);
  const s = await call("/api/students", { method: "POST", body: { name: "Maja", self: true, consent: true } });
  assert.equal(s.status, 201, JSON.stringify(s.body));
  return { call, sid: s.body.id };
}
const setPilot = (store, email) => store.db.prepare("UPDATE parents SET pilot_at = datetime('now') WHERE email = ?").run(email);
const xpDay = (store, sid, daysAgo) => store.db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'vaja', datetime('now', ?))").run(sid, `-${daysAgo} days`);
const CONSENT = SL["mn.publish"];

test("mnenje: samo za člane pilota; nečlan dobi member:false in 403", async () => {
  await withServer(async ({ client, store }) => {
    const { call, sid } = await account(client, store, "ne@mnenje.si", 17);
    assert.deepEqual((await call(`/api/students/${sid}/pilot/mnenje`)).body, { member: false });
    assert.equal((await call(`/api/students/${sid}/pilot/mnenje`, { method: "POST", body: { stars: 5 } })).status, 403);
    assert.equal((await call(`/api/students/${sid}/pilot/mnenje/vprasano`, { method: "POST" })).status, 403);
    assert.equal((await call("/api/admin/pilot-mnenja")).status, 403);
    // Tuj profil: drug račun ne pride do stanja ali oddaje.
    const other = await account(client, store, "drug@mnenje.si", 17);
    setPilot(store, "ne@mnenje.si");
    assert.ok([403, 404].includes((await other.call(`/api/students/${sid}/pilot/mnenje`)).status));
    assert.ok([403, 404].includes((await other.call(`/api/students/${sid}/pilot/mnenje`, { method: "POST", body: { stars: 1 } })).status));
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja").get().n, 0);
  });
});

test("mnenje: vprašanje šele po 3 dneh uporabe ali 10 rešenih nalogah, največ enkrat na teden, po oddaji ne prej kot čez 30 dni", async () => {
  await withServer(async ({ client, store }) => {
    const { call, sid } = await account(client, store, "da@mnenje.si", 17);
    setPilot(store, "da@mnenje.si");
    const due = (now) => opinionState(store.db, sid, now ? { now } : {}).due;
    assert.equal(due(), false);
    for (let d = 0; d < MIN_DAYS - 1; d++) xpDay(store, sid, d);
    xpDay(store, sid, 0); // isti dan dvakrat šteje enkrat
    assert.equal(due(), false);
    xpDay(store, sid, MIN_DAYS - 1);
    assert.equal(due(), true);
    assert.equal((await call(`/api/students/${sid}/pilot/mnenje`)).body.due, true);
    // Pokazano vprašanje: teden dni miru, tudi brez odgovora.
    const seen = await call(`/api/students/${sid}/pilot/mnenje/vprasano`, { method: "POST" });
    assert.equal(seen.body.due, false);
    assert.equal(due(new Date(Date.now() + (ASK_EVERY_DAYS - 1) * 864e5)), false);
    assert.equal(due(new Date(Date.now() + (ASK_EVERY_DAYS + 0.1) * 864e5)), true);
    // Oddano mnenje: aplikacija sama ne vpraša znova prej kot čez 30 dni.
    assert.equal((await call(`/api/students/${sid}/pilot/mnenje`, { method: "POST", body: { stars: 4 } })).status, 201);
    assert.equal(due(new Date(Date.now() + (ASK_EVERY_DAYS + 1) * 864e5)), false);
    assert.equal(due(new Date(Date.now() + (AFTER_OPINION_DAYS + 0.1) * 864e5)), true);
  });
  // Druga pot: 10 rešenih nalog (brez dni).
  await withServer(async ({ client, store }) => {
    const { sid } = await account(client, store, "naloge@mnenje.si", 17);
    setPilot(store, "naloge@mnenje.si");
    const add = (solved) => store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, solved) VALUES (?, 't', 1, '{}', ?)").run(sid, solved);
    for (let i = 0; i < MIN_SOLVED - 1; i++) add(1);
    add(0);
    assert.equal(opinionState(store.db, sid).due, false);
    add(1);
    assert.equal(opinionState(store.db, sid).due, true);
  });
});

test("mnenje: ocena 1–5 je obvezna, besedili neobvezni, šifrirani in brez imena profila; največ nekaj na dan", async () => {
  await withServer(async ({ client, store }) => {
    const { call, sid } = await account(client, store, "oddaja@mnenje.si", 17);
    setPilot(store, "oddaja@mnenje.si");
    const post = (body) => call(`/api/students/${sid}/pilot/mnenje`, { method: "POST", body });
    for (const stars of [0, 6, 2.5, "x", null, undefined, true, "5", [5]]) assert.equal((await post({ stars })).status, 400, String(stars));
    const r = await post({ stars: 5, liked: "  Maja pravi:\nrazlage po korakih  ", bothers: "x".repeat(TEXT_MAX + 50) });
    assert.equal(r.status, 201);
    assert.equal(r.body.sent, 1);
    const row = store.db.prepare("SELECT * FROM pilot_mnenja WHERE student_id = ?").get(sid);
    assert.equal(row.stars, 5);
    assert.equal(row.publish, 0);
    assert.equal(row.consent, null);
    assert.ok(row.liked.startsWith("enc1:") && row.bothers.startsWith("enc1:"), "besedili sta šifrirani");
    assert.ok(SEALED.some((t) => t.table === "pilot_mnenja" && t.cols.includes("liked") && t.cols.includes("bothers")));
    const rep = opinionsReport(store.db);
    assert.equal(rep.opinions[0].liked, "[ime] pravi: razlage po korakih");
    assert.equal(rep.opinions[0].bothers.length, TEXT_MAX);
    // Samo ocena, brez besedila.
    assert.equal((await post({ stars: 1 })).status, 201);
    assert.equal(store.db.prepare("SELECT liked, bothers FROM pilot_mnenja ORDER BY id DESC").get().liked, null);
    for (let i = 2; i < DAILY_MAX; i++) assert.equal((await post({ stars: 3 })).status, 201);
    assert.equal((await post({ stars: 3 })).status, 429);
  });
});

test("mnenje: objava samo z izrecnim dovoljenjem (true + besedilo), preklic kadar koli", async () => {
  await withServer(async ({ client, store }) => {
    const { call, sid } = await account(client, store, "objava@mnenje.si", 17);
    setPilot(store, "objava@mnenje.si");
    assert.equal((await call(`/api/students/${sid}/pilot/mnenje`)).body.canPublish, true);
    const post = (body) => call(`/api/students/${sid}/pilot/mnenje`, { method: "POST", body });
    const pub = () => store.db.prepare("SELECT publish, consent FROM pilot_mnenja ORDER BY id DESC").get();
    // Neznano besedilo dovoljenja: 400, nič se ne shrani.
    // Tudi prejšnje besedilo (brez zvezdic in brez kraja objave) ne velja več.
    const OLD = "Dovolim, da Evklid moje mnenje objavi brez imena (samo razred ali letnik).";
    for (const consent_text of ["Dovolim vse.", CONSENT + " ", "x", OLD]) assert.equal((await post({ stars: 5, publish: true, consent_text })).status, 400);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja").get().n, 0);
    // Privzeto izklopljeno; "true", 1 ali manjkajoče besedilo dovoljenja ne štejejo.
    for (const body of [{ stars: 5 }, { stars: 5, publish: "true", consent_text: CONSENT }, { stars: 5, publish: 1, consent_text: CONSENT }]) {
      const r = await post(body);
      assert.equal(r.body.publish, false);
      assert.equal(pub().publish, 0);
    }
    store.db.prepare("DELETE FROM pilot_mnenja").run();
    assert.equal((await post({ stars: 5, publish: true })).body.publish, false);
    // Besedilo v drugem jeziku vmesnika velja; zapiše se jezik besedila, ne poslani.
    const DE = JSON.parse(fs.readFileSync(new URL("../public/i18n/ui/de.json", import.meta.url), "utf8"))["mn.publish"];
    assert.equal((await post({ stars: 5, publish: true, consent_text: DE, lang: "sl" })).body.publish, true);
    assert.equal(JSON.parse(pub().consent).lang, "de");
    store.db.prepare("DELETE FROM pilot_mnenja").run();
    store.db.prepare("DELETE FROM pilot_mnenja_prenehalo").run();
    const ok = await post({ stars: 5, liked: "Vse", publish: true, consent_text: CONSENT, lang: "sl" });
    assert.equal(ok.body.publish, true);
    assert.equal(ok.body.published, true);
    const c = JSON.parse(pub().consent);
    assert.equal(c.text, CONSENT);
    assert.equal(c.lang, "sl");
    assert.ok(c.v === CONSENT_VERSION && CONSENT_VERSION >= 2 && c.at);
    // Preklic: velja za vsa mnenja profila; zapis o preklicu ostane.
    assert.equal((await call(`/api/students/${sid}/pilot/mnenje/objava`, { method: "POST", body: { publish: true } })).status, 400);
    const w = await call(`/api/students/${sid}/pilot/mnenje/objava`, { method: "POST", body: { publish: false } });
    assert.equal(w.body.published, false);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja WHERE publish = 1").get().n, 0);
    assert.ok(JSON.parse(pub().consent).withdrawn_at);
  });
});

test("mnenje: bivši član pilota vidi stanje dovoljenja in ga lahko prekliče, oddati ne more več", async () => {
  await withServer(async ({ client, store }) => {
    const { call, sid } = await account(client, store, "bivsi@mnenje.si", 17);
    setPilot(store, "bivsi@mnenje.si");
    assert.equal((await call(`/api/students/${sid}/pilot/mnenje`, { method: "POST", body: { stars: 5, publish: true, consent_text: CONSENT } })).body.publish, true);
    store.db.prepare("UPDATE parents SET pilot_at = NULL WHERE email = 'bivsi@mnenje.si'").run();
    assert.deepEqual((await call(`/api/students/${sid}/pilot/mnenje`)).body, { member: false, published: true });
    assert.equal((await call(`/api/students/${sid}/pilot/mnenje`, { method: "POST", body: { stars: 5 } })).status, 403);
    const w = await call(`/api/students/${sid}/pilot/mnenje/objava`, { method: "POST", body: { publish: false } });
    assert.deepEqual(w.body, { member: false });
    assert.equal(store.db.prepare("SELECT publish FROM pilot_mnenja").get().publish, 0);
    const js = fs.readFileSync(new URL("../public/mnenje.js", import.meta.url), "utf8");
    assert.match(js, /card\.hidden = !st\?\.member && !st\?\.published/);
  });
});

test("mnenje: ime profila izgine v vseh sklonih in brez ločevanja velikih črk, druge besede ostanejo", () => {
  assert.equal(withoutName("Maja pravi, Maji je všeč, maja in MAJO; majhen maj", "Maja"), "[ime] pravi, [ime] je všeč, [ime] in [ime]; majhen maj");
  assert.equal(withoutName("Jan in Janu, januar, Janov zvezek, jantar", "Jan"), "[ime] in [ime], januar, [ime] zvezek, jantar");
  assert.equal(withoutName("Zaliki Brezovnikovi pomaga; zalika, BREZOVNIK", "Zalika Brezovnik"), "[ime] [ime] pomaga; [ime], [ime]");
  assert.equal(withoutName("Al je tu, ali Ala ne", "Al"), "[ime] je tu, ali Ala ne"); // kratko ime samo kot cela beseda
  assert.equal(withoutName("a + b (c)", "A. B"), "a + b (c)"); // posamezne črke niso ime
  assert.equal(withoutName("Žana, Žano; Čufarjeva", "Žana Čufar"), "[ime], [ime]; [ime]");
  assert.equal(withoutName("1+1 (x)", "x (1+1) [a]"), "1+1 (x)"); // znaki izraza v imenu ne pokvarijo vzorca
  assert.equal(withoutName("besedilo", ""), "besedilo");
});

test("mnenje: brez ključa za šifriranje se besedili ne shranita (samo ocena) in aplikacija polj ne pokaže", async () => {
  const key = process.env.EVKLID_DATA_KEY;
  delete process.env.EVKLID_DATA_KEY;
  try {
    await withServer(async ({ client, store }) => {
      const { call, sid } = await account(client, store, "brezkljuca@mnenje.si", 17);
      setPilot(store, "brezkljuca@mnenje.si");
      assert.equal((await call(`/api/students/${sid}/pilot/mnenje`)).body.canText, false);
      assert.equal((await call(`/api/students/${sid}/pilot/mnenje`, { method: "POST", body: { stars: 3, liked: "Skrivnost", bothers: "Tudi" } })).status, 201);
      const row = store.db.prepare("SELECT stars, liked, bothers FROM pilot_mnenja").get();
      assert.deepEqual({ ...row }, { stars: 3, liked: null, bothers: null });
    });
  } finally {
    process.env.EVKLID_DATA_KEY = key;
  }
  await withServer(async ({ client, store }) => {
    const { call, sid } = await account(client, store, "skljucem@mnenje.si", 17);
    setPilot(store, "skljucem@mnenje.si");
    assert.equal((await call(`/api/students/${sid}/pilot/mnenje`)).body.canText, true);
  });
  assert.match(fs.readFileSync(new URL("../public/mnenje.js", import.meta.url), "utf8"), /st\.canText\s*\?/);
});

test("mnenje: mlajši od 15 let (ali brez letnice) stikala ne dobi in strežnik dovoljenja ne sprejme", async () => {
  await withServer(async ({ client, store }) => {
    // Starš z otrokom, starim 13 let.
    const call = client();
    const r = await call("/api/auth/register", { method: "POST", body: { email: "stars@mnenje.si", password: "geslo1234", accept_privacy: true, country: "SI", birth_date: "1985-04-12" } });
    assert.equal(r.status, 201);
    store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = 'stars@mnenje.si'").run();
    const y = new Date().getFullYear();
    const kid = (await call("/api/students", { method: "POST", body: { name: "Lan", birth_year: y - 13, consent: true } })).body;
    setPilot(store, "stars@mnenje.si");
    assert.equal((await call(`/api/students/${kid.id}/pilot/mnenje`)).body.canPublish, false);
    const p = await call(`/api/students/${kid.id}/pilot/mnenje`, { method: "POST", body: { stars: 4, publish: true, consent_text: CONSENT } });
    assert.equal(p.status, 201);
    assert.equal(p.body.publish, false);
    assert.equal(store.db.prepare("SELECT publish, consent FROM pilot_mnenja").get().publish, 0);
    // Meja kot pri fotografijah pilota: v letu 15. rojstnega dne še ne.
    const set = (year) => store.db.prepare("UPDATE students SET birth_year = ? WHERE id = ?").run(year, kid.id);
    set(y - 15);
    assert.equal(publishAllowed(store.db, kid.id), false);
    set(y - 16);
    assert.equal(publishAllowed(store.db, kid.id), true);
    set(null);
    assert.equal(publishAllowed(store.db, kid.id), false);
  });
});

test("mnenje: skrbnik vidi seznam brez imena, številke profila, e-naslova in ure; drugi ne", async () => {
  await withServer(async ({ client, store }) => {
    const { call, sid } = await account(client, store, "clan@mnenje.si", 17);
    setPilot(store, "clan@mnenje.si");
    await call(`/api/students/${sid}/pilot/mnenje`, { method: "POST", body: { stars: 4, liked: "Maja ima rada grafe", bothers: "Počasno", publish: true, consent_text: CONSENT } });
    assert.equal((await call("/api/admin/pilot-mnenja")).status, 403);
    store.db.prepare("UPDATE parents SET is_admin = 1 WHERE email = 'clan@mnenje.si'").run();
    const r = await call("/api/admin/pilot-mnenja");
    assert.equal(r.status, 200);
    assert.equal(r.body.n, 1);
    assert.equal(r.body.avg, 4);
    const o = r.body.opinions[0];
    assert.deepEqual(Object.keys(o).sort(), ["bothers", "consent", "grade", "label", "liked", "month", "publish", "stars"]);
    assert.match(o.label, /^M-[2-9A-HJ-NP-Z]{4}$/);
    assert.equal(o.consent, "given");
    assert.deepEqual(r.body.ended, []);
    assert.match(o.month, /^\d{4}-\d{2}$/);
    assert.equal(o.publish, true);
    const raw = JSON.stringify(r.body);
    assert.ok(!raw.includes("Maja") && !raw.includes("clan@mnenje.si") && !raw.includes("student_id"));
    assert.equal(o.liked, "[ime] ima rada grafe");
    // Preklic: skrbnik vidi »preklicano« z dnem (umakniti mora objavo).
    await call(`/api/students/${sid}/pilot/mnenje/objava`, { method: "POST", body: { publish: false } });
    const o2 = (await call("/api/admin/pilot-mnenja")).body.opinions[0];
    assert.equal(o2.consent, "withdrawn");
    assert.match(o2.withdrawn_day, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(o2.publish, false);
  });
});

test("mnenje: izvoz podatkov ga vsebuje (odšifrirano), izbris profila in računa ga izbriše", async () => {
  await withServer(async ({ client, store }) => {
    const { call, sid } = await account(client, store, "gdpr@mnenje.si", 17);
    setPilot(store, "gdpr@mnenje.si");
    await call(`/api/students/${sid}/pilot/mnenje`, { method: "POST", body: { stars: 2, liked: "Učbenik", bothers: "Tipkovnica", publish: true, consent_text: CONSENT } });
    await call(`/api/students/${sid}/pilot/mnenje/vprasano`, { method: "POST" });
    const ex = await call("/api/account/export", { method: "POST", body: { password: "geslo1234" } });
    assert.equal(ex.status, 200);
    const mine = ex.body.children.find((c) => c.id === sid).pilot_opinions;
    assert.equal(mine.length, 1);
    assert.equal(mine[0].stars, 2);
    assert.equal(mine[0].liked, "Učbenik");
    assert.equal(mine[0].bothers, "Tipkovnica");
    assert.equal(mine[0].publish, 1);
    assert.ok(!ex.body.other?.pilot_mnenja, "ni podvojeno v other");
    assert.equal(ex.body.other?.pilot_mnenja_vprasano?.length, 1);
    assert.match(mine[0].label, /^M-/);
    const label = mine[0].label;
    const del = await call("/api/account", { method: "DELETE", body: { password: "geslo1234" } });
    assert.ok(del.status < 300, JSON.stringify(del.body));
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja").get().n, 0);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja_vprasano").get().n, 0);
    // Dovoljenje je bilo dano: ostane samo oznaka z razlogom in dnem, brez vsebine in brez povezave z računom.
    const ended = store.db.prepare("SELECT * FROM pilot_mnenja_prenehalo").all();
    assert.equal(ended.length, 1);
    assert.deepEqual(Object.keys(ended[0]).sort(), ["day", "label", "reason"]);
    assert.equal(ended[0].label, label);
    assert.equal(ended[0].reason, "izbris");
    assert.deepEqual(opinionsReport(store.db).ended.map((e) => e.label), [label]);
  });
});

test("mnenje: izbris profila izbriše mnenja; brez danega dovoljenja ne ostane noben zapis", async () => {
  await withServer(async ({ client, store }) => {
    // Starš z dvema otrokoma (16 in 17 let): prvi dovoli objavo, drugi ne.
    const call = client();
    const r = await call("/api/auth/register", { method: "POST", body: { email: "profil@mnenje.si", password: "geslo1234", accept_privacy: true, country: "SI", birth_date: "1980-04-12" } });
    assert.equal(r.status, 201);
    store.db.prepare("UPDATE parents SET email_verified_at = datetime('now'), pilot_at = datetime('now') WHERE email = 'profil@mnenje.si'").run();
    const y = new Date().getFullYear();
    const a = (await call("/api/students", { method: "POST", body: { name: "Ana", birth_year: y - 17, consent: true } })).body;
    const b = (await call("/api/students", { method: "POST", body: { name: "Bor", birth_year: y - 16, consent: true } })).body;
    assert.ok(a.id && b.id, JSON.stringify([a, b]));
    assert.equal((await call(`/api/students/${a.id}/pilot/mnenje`, { method: "POST", body: { stars: 5, liked: "Vse", publish: true, consent_text: CONSENT } })).body.publish, true);
    assert.equal((await call(`/api/students/${b.id}/pilot/mnenje`, { method: "POST", body: { stars: 2, bothers: "Nič" } })).status, 201);
    await call(`/api/students/${b.id}/pilot/mnenje/vprasano`, { method: "POST" });
    const n = (sid) => store.db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja WHERE student_id = ?").get(sid).n;
    const delB = await call(`/api/students/${b.id}`, { method: "DELETE", body: { password: "geslo1234" } });
    assert.ok(delB.status < 300, JSON.stringify(delB.body));
    assert.equal(n(b.id), 0);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja_vprasano WHERE student_id = ?").get(b.id).n, 0);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja_prenehalo").get().n, 0, "brez dovoljenja ni zapisa");
    assert.equal(n(a.id), 1, "mnenje drugega profila ostane");
    const delA = await call(`/api/students/${a.id}`, { method: "DELETE", body: { password: "geslo1234" } });
    assert.ok(delA.status < 300, JSON.stringify(delA.body));
    assert.equal(n(a.id), 0);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja_prenehalo").get().n, 1);
  });
});

test("mnenje: aplikacija nič ne objavi sama, vpraša samo na mirnem zaslonu, stikalo je privzeto izklopljeno", () => {
  const js = fs.readFileSync(new URL("../public/mnenje.js", import.meta.url), "utf8");
  assert.match(js, /const form = \{ stars: 0, publish: false \}/);
  assert.match(js, /role="switch" aria-checked="false" id="mn-publish"/);
  assert.match(js, /st\.canPublish\s*\?/);
  assert.match(js, /#view-path[^\n]*#view-me/); // samo Učna pot ali Jaz
  assert.match(js, /dialog\[open\]/);
  assert.match(js, /#graph-overlay/); // ne čez odprt kalkulator
  assert.match(js, /!typing\(\)/); // ne med tipkanjem
  assert.match(js, /e\.target === dlg && !dlg\.dataset\.dirty/); // dotik ob robu ne zavrže napisanega
  // Mnenja bere samo skrbniški seznam; nobena javna stran jih ne naloži.
  for (const f of ["index.html", "starsi.html", "o-evklidu.html", "pristajalna.js", "zacetna.js"]) {
    assert.ok(!fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8").includes("pilot-mnenja"), f);
  }
  const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  assert.match(html, /id="me-mnenje-card" hidden/);
  const priv = fs.readFileSync(new URL("../public/zasebnost.html", import.meta.url), "utf8");
  assert.match(priv, /Mnenje o aplikaciji/);
});

test("mnenje: besedilo dovoljenja pove, kaj in kje objavimo (vsi jeziki, zasebnost.html)", () => {
  assert.equal(CONSENT, "Dovolim, da Evklid moje zvezdice in mnenje objavi na strani evklid.app brez imena (samo razred ali letnik).");
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.ok(files.length >= 32);
  for (const f of files) {
    const v = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"))["mn.publish"];
    assert.ok(typeof v === "string" && v.includes("evklid.app") && v !== CONSENT, `${f}: mn.publish brez evklid.app ali nepreveden`);
  }
  const z = fs.readFileSync(new URL("../public/zasebnost.html", import.meta.url), "utf8");
  assert.ok(z.includes("zvezdice in mnenje objavimo na strani evklid.app brez imena"));
  assert.ok(z.includes("Besedili shranimo šifrirani; če šifriranje ni na voljo, besedil ne shranimo."));
});
