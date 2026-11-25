// Čakalna vrsta za AI (server/vrsta-ai.js, točka 23 načrta izboljšav): meja hkratnih odgovorov inštruktorja, vrstni
// red prihoda, sprostitev ob napaki in prekinitvi, rok čakanja (napaka 529 kot ob preobremenitvi) in mesto v vrsti.
// Na koncu v aplikaciji (preizkusni način, EVKLID_AI_SOCASNO=1): drugo hkratno sporočilo dobi fazo »queue« in se konča.
import test from "node:test";
import assert from "node:assert/strict";
import { createVrsta, napakaVrste } from "../server/vrsta-ai.js";
import { errorText, apiErrorCode } from "../server/claude.js";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import sl from "../public/i18n/sl.js";
import { readFileSync, readdirSync } from "node:fs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("meja hkratnih mest in vrstni red prihoda (FIFO)", async () => {
  const v = createVrsta({ socasno: 2, cakanjeMs: 5000, razmikMs: 0 });
  let hkrati = 0;
  let najvec = 0;
  const vrstni = [];
  const delo = async (i) => {
    const m = await v.vstopi();
    vrstni.push(i);
    hkrati++;
    najvec = Math.max(najvec, hkrati);
    await sleep(10 + (i % 3) * 5);
    hkrati--;
    m.sprosti();
  };
  await Promise.all([0, 1, 2, 3, 4, 5, 6].map(delo));
  assert.equal(najvec, 2);
  assert.deepEqual(vrstni, [0, 1, 2, 3, 4, 5, 6]);
  assert.deepEqual(v.stanje(), { aktivni: 0, cakajo: 0, socasno: 2 });
});

test("mesto v vrsti: takoj ob vstopu in ob vsaki spremembi; cakal pove, ali je čakal", async () => {
  const v = createVrsta({ socasno: 1, cakanjeMs: 5000, razmikMs: 0 });
  const prvi = await v.vstopi();
  assert.equal(prvi.cakal, false);
  const mesta = { a: [], b: [], c: [] };
  const a = v.vstopi({ onMesto: (n) => mesta.a.push(n) });
  const b = v.vstopi({ onMesto: (n) => mesta.b.push(n) });
  const c = v.vstopi({ onMesto: (n) => mesta.c.push(n) });
  assert.deepEqual(mesta, { a: [1], b: [2], c: [3] });
  prvi.sprosti();
  const ma = await a;
  assert.equal(ma.cakal, true);
  assert.deepEqual(mesta, { a: [1], b: [2, 1], c: [3, 2] });
  ma.sprosti();
  (await b).sprosti();
  (await c).sprosti();
  assert.deepEqual(mesta.c, [3, 2, 1]);
  assert.equal(v.stanje().aktivni, 0);
});

test("mesto v vrsti: spremembe največ enkrat na razmikMs, zadnja pride z zamikom", async () => {
  const v = createVrsta({ socasno: 1, cakanjeMs: 5000, razmikMs: 60 });
  const a = await v.vstopi();
  const w1 = v.vstopi();
  const w2 = v.vstopi();
  const mesta = [];
  const z = v.vstopi({ onMesto: (n) => mesta.push(n) });
  assert.deepEqual(mesta, [3]);
  await sleep(70);
  a.sprosti(); // 3 → 2: razmik je pretekel, takoj
  assert.deepEqual(mesta, [3, 2]);
  (await w1).sprosti(); // 2 → 1 takoj za prejšnjo: odloženo
  assert.deepEqual(mesta, [3, 2]);
  await sleep(80);
  assert.deepEqual(mesta, [3, 2, 1]);
  (await w2).sprosti();
  (await z).sprosti();
  assert.deepEqual(mesta, [3, 2, 1]);
  assert.deepEqual(v.stanje(), { aktivni: 0, cakajo: 0, socasno: 1 });
});

test("sprostitev ob napaki: mesto se vrne, dvojna sprostitev ne doda mesta", async () => {
  const v = createVrsta({ socasno: 1, cakanjeMs: 5000, razmikMs: 0 });
  const delo = async () => {
    const m = await v.vstopi();
    try {
      throw new Error("model ni odgovoril");
    } finally {
      m.sprosti();
      m.sprosti();
    }
  };
  await assert.rejects(delo(), /model ni odgovoril/);
  assert.equal(v.stanje().aktivni, 0);
  const a = await v.vstopi();
  const b = v.vstopi();
  assert.equal(v.stanje().cakajo, 1, "dvojna sprostitev ni sprostila dveh mest");
  a.sprosti();
  (await b).sprosti();
  assert.deepEqual(v.stanje(), { aktivni: 0, cakajo: 0, socasno: 1 });
});

test("prekinitev v vrsti: zahteva gre iz vrste, drugi se premaknejo naprej", async () => {
  const v = createVrsta({ socasno: 1, cakanjeMs: 5000, razmikMs: 0 });
  const a = await v.vstopi();
  const ctl = new AbortController();
  const b = v.vstopi({ signal: ctl.signal });
  const mc = [];
  const c = v.vstopi({ onMesto: (n) => mc.push(n) });
  ctl.abort();
  await assert.rejects(b, (e) => e.name === "AbortError");
  assert.deepEqual(mc, [2, 1]);
  assert.equal(v.stanje().cakajo, 1);
  a.sprosti();
  (await c).sprosti();
  // Že prekinjen signal: takoj zavrnjeno, mesto ostane prosto.
  const d = new AbortController();
  d.abort();
  await assert.rejects(v.vstopi({ signal: d.signal }), (e) => e.name === "AbortError");
  assert.deepEqual(v.stanje(), { aktivni: 0, cakajo: 0, socasno: 1 });
});

test("rok čakanja: napaka 529 kot ob preobremenitvi, zahteva gre iz vrste", async () => {
  const v = createVrsta({ socasno: 1, cakanjeMs: 30, razmikMs: 0 });
  const a = await v.vstopi();
  const t0 = Date.now();
  const err = await v.vstopi().catch((e) => e);
  assert.ok(Date.now() - t0 >= 25);
  assert.equal(err.status, 529);
  assert.equal(err.vrsta, true);
  assert.equal(apiErrorCode(err), "529 preveč hkratnih vprašanj");
  assert.match(errorText(napakaVrste()), /\(Koda: 529 preveč hkratnih vprašanj\)$/);
  assert.equal(v.stanje().cakajo, 0);
  a.sprosti();
  assert.equal(v.stanje().aktivni, 0);
});

test("EVKLID_AI_SOCASNO=0: brez meje", async () => {
  const v = createVrsta({ socasno: 0, cakanjeMs: 10, razmikMs: 0 });
  const vsi = await Promise.all([1, 2, 3, 4].map(() => v.vstopi()));
  assert.ok(vsi.every((m) => m.cakal === false));
  for (const m of vsi) m.sprosti();
});

test("napis chat.waitQueue v slovenščini in vseh 32 jezikih, z {n}", () => {
  assert.equal(sl["chat.waitQueue"], "Veliko učencev hkrati. V vrsti si (mesto\u00a0{n}) …");
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  const langs = readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(langs.length, 32);
  for (const f of langs) {
    const s = JSON.parse(readFileSync(new URL(f, dir), "utf8"))["chat.waitQueue"];
    assert.ok(s && s !== sl["chat.waitQueue"] && s.includes("{n}"), f);
  }
});

// --- v aplikaciji (preizkusni način brez ključa API) ---
const vprasanj = (store, id) => store.db.prepare("SELECT COALESCE(SUM(n), 0) AS n FROM question_log WHERE student_id = ?").get(id).n;
function events(body) {
  return body
    .split("\n\n")
    .filter(Boolean)
    .map((c) => ({ event: /^event: (.*)$/m.exec(c)?.[1], data: JSON.parse(/^data: (.*)$/m.exec(c)?.[1] || "null") }));
}

async function zAplikacijo(env, fn) {
  const prej = {};
  for (const [k, v] of Object.entries({ EVKLID_MOCK: "1", EVKLID_MOCK_DELAY_MS: "20", ...env })) {
    prej[k] = process.env[k];
    process.env[k] = v;
  }
  const store = openDb(":memory:");
  const server = createApp(store, { scheduler: false }).listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, body, signal) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}), signal });
  const nov = async (name) => {
    const s = await (await post("/api/students", { name, settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" } })).json();
    const c = await (await post(`/api/students/${s.id}/conversations`)).json();
    return { s, c };
  };
  try {
    await fn({ store, post, nov });
  } finally {
    server.close();
    for (const [k, v] of Object.entries(prej)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
}

test("aplikacija: EVKLID_AI_SOCASNO=1, drugo hkratno sporočilo dobi fazo queue (mesto 1) in se konča", async () => {
  await zAplikacijo({ EVKLID_AI_SOCASNO: "1", EVKLID_AI_VRSTA_MS: "30000" }, async ({ post, nov }) => {
    const [a, b] = [await nov("Ana"), await nov("Bor")];
    const vprasaj = async (x, text) => events(await (await post(`/api/conversations/${x.c.id}/messages`, { text })).text());
    const [ea, eb] = await Promise.all([vprasaj(a, "Koliko je 17 krat 23?"), vprasaj(b, "Koliko je 19 krat 21?")]);
    const vrsta = (ev) => ev.filter((e) => e.event === "phase" && e.data.phase === "queue");
    const cakal = vrsta(ea).length ? ea : eb;
    const prvi = cakal === ea ? eb : ea;
    assert.equal(vrsta(prvi).length, 0, "prvi ne čaka");
    assert.deepEqual(vrsta(cakal).map((e) => e.data.mesto), [1]);
    for (const ev of [ea, eb]) assert.equal(ev.at(-1).event, "done", ev.map((e) => e.event).join(","));
    // Vrsta je pred prvim besedilom; ko pride na vrsto, faza »answer« (spet »Pripravljam razlago …«).
    const imena = cakal.map((e) => (e.event === "phase" ? e.data.phase : e.event));
    assert.ok(imena.indexOf("queue") < imena.indexOf("answer") && imena.indexOf("answer") < imena.indexOf("delta"), imena.join(","));
  });
});

test("aplikacija: predolgo čakanje v vrsti → napaka 529 kot ob preobremenitvi, vprašanje ne šteje", async () => {
  await zAplikacijo({ EVKLID_AI_SOCASNO: "1", EVKLID_AI_VRSTA_MS: "50", EVKLID_MOCK_DELAY_MS: "40" }, async ({ store, post, nov }) => {
    const [a, b] = [await nov("Ana"), await nov("Bor")];
    const prvo = post(`/api/conversations/${a.c.id}/messages`, { text: "Koliko je 17 krat 23?" }).then((r) => r.text());
    await sleep(20);
    const eb = events(await (await post(`/api/conversations/${b.c.id}/messages`, { text: "Koliko je 19 krat 21?" })).text());
    const napaka = eb.find((e) => e.event === "error");
    assert.ok(napaka, eb.map((e) => e.event).join(","));
    assert.match(napaka.data.error, /\(Koda: 529 preveč hkratnih vprašanj\)/);
    assert.ok(eb.some((e) => e.event === "phase" && e.data.phase === "queue"));
    assert.equal(events(await prvo).at(-1).event, "done");
    // Neuspelo sporočilo se ne shrani in ne šteje v dnevno mejo (kot ob vsaki napaki API).
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM messages WHERE conversation_id = ?").get(b.c.id).n, 0);
    assert.equal(vprasanj(store, b.s.id), 0, "čakanje brez odgovora ne šteje v dnevno mejo");
    assert.equal(vprasanj(store, a.s.id), 1);
  });
});

test("aplikacija: učenec zapre aplikacijo med čakanjem v vrsti → vprašanje ne šteje, mesto se sprosti", async () => {
  await zAplikacijo({ EVKLID_AI_SOCASNO: "1", EVKLID_AI_VRSTA_MS: "30000", EVKLID_MOCK_DELAY_MS: "30" }, async ({ store, post, nov }) => {
    const [a, b, c] = [await nov("Ana"), await nov("Bor"), await nov("Cene")];
    const prvo = post(`/api/conversations/${a.c.id}/messages`, { text: "Koliko je 17 krat 23?" }).then((r) => r.text());
    await sleep(15);
    const ac = new AbortController();
    const rb = await post(`/api/conversations/${b.c.id}/messages`, { text: "Koliko je 19 krat 21?" }, ac.signal);
    const prvi = new TextDecoder().decode((await rb.body.getReader().read()).value);
    assert.match(prvi, /"queue"/, "Bor čaka v vrsti");
    ac.abort();
    await sleep(100);
    assert.equal(vprasanj(store, b.s.id), 0, "zaprto med čakanjem ne šteje");
    assert.equal(events(await prvo).at(-1).event, "done");
    assert.equal(vprasanj(store, a.s.id), 1);
    // Mesto se je sprostilo: naslednji učenec ne čaka.
    const ec = events(await (await post(`/api/conversations/${c.c.id}/messages`, { text: "Koliko je 11 krat 23?" })).text());
    assert.ok(!ec.some((e) => e.event === "phase" && e.data.phase === "queue"), ec.map((e) => e.event).join(","));
    assert.equal(ec.at(-1).event, "done");
  });
});
