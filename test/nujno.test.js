// Varnostni odgovor čez mejo porabe (public/nujno.js, server/nujno.js; j 6. 11. 2026).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { zaznajNujno, stevilke, vrstice, klici, telHref, normalize } from "../public/nujno.js";
import { preberiVrsto, varnostniPregled, VAROVALKA, NAVODILO } from "../server/nujno.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import SL from "../public/i18n/sl.js";

// [besedilo, pričakovana vrsta ali null]
const PRIMERI = [
  // zdravje (sl, tudi brez šumnikov in sleng)
  ["Moj brat ima vročino 42", "zdravje"],
  ["moj brat ima vrocino 42", "zdravje"],
  ["Sestra ima vročino 40,5 stopinj", "zdravje"],
  ["mama ima temperaturo 41", "zdravje"],
  ["Ati se je onesvestil in ne diha", "zdravje"],
  ["prijatelj je nezavesten", "zdravje"],
  ["brat močno krvavi iz roke", "zdravje"],
  ["sestrica je popila čistilo", "zdravje"],
  ["dedi je padel na glavo", "zdravje"],
  ["babi ima bolečine v prsih", "zdravje"],
  ["dojenček ima vročino 38", "zdravje"],
  ["bratec je pojedel tablete od mame", "zdravje"],
  ["vrocina 42 v nalogi iz fizike", "zdravje"],
  // zdravje (hr, sr, bs, en)
  ["Moj brat ima temperaturu 41", "zdravje"],
  ["brat se onesvijestio i ne diše", "zdravje"],
  ["Брат има температуру 41", "zdravje"],
  ["sestra jako krvari, zovi hitnu", "zdravje"],
  ["My brother has a fever of 104", "zdravje"],
  ["my sister passed out and is not breathing", "zdravje"],
  ["my dad is having a heart attack", "zdravje"],
  ["my little brother swallowed pills", "zdravje"],
  ["the baby is floppy and has a fever", "zdravje"],
  // zdravje (drugi jeziki)
  ["Mein Bruder ist bewusstlos", "zdravje"],
  ["mi hermano no respira", "zdravje"],
  ["мой брат потерял сознание", "zdravje"],
  ["弟弟昏迷了", "zdravje"],
  ["anh trai sốt 41 độ", "zdravje"],
  // stiska
  ["nočem več živeti", "stiska"],
  ["nocem vec zivet", "stiska"],
  ["rajši bi bil mrtev", "stiska"],
  ["razmišljam o samomoru", "stiska"],
  ["včasih se režem", "stiska"],
  ["želim si, da me ne bi bilo", "stiska"],
  ["ne želim više živjeti", "stiska"],
  ["hoću da umrem", "stiska"],
  ["Не желим да живим, хоћу да умрем", "stiska"],
  ["I want to kill myself", "stiska"],
  ["i dont want to live anymore", "stiska"],
  ["I've been cutting myself", "stiska"],
  ["Ich will nicht mehr leben", "stiska"],
  ["je veux mourir", "stiska"],
  ["хочу умереть", "stiska"],
  ["死にたい", "stiska"],
  ["tôi muốn chết", "stiska"],
  // nasilje
  ["oče me tepe", "nasilje"],
  ["sošolci me pretepajo", "nasilje"],
  ["stric se me dotika in ne smem nikomur povedat", "nasilje"],
  ["nekdo me izsiljuje z golimi slikami", "nasilje"],
  ["tata me tuče", "nasilje"],
  ["my stepdad hits me", "nasilje"],
  ["someone keeps asking me to send nudes", "nasilje"],
  // nevarnost
  ["v kuhinji diši po plinu", "nevarnost"],
  ["požar v hiši!", "nevarnost"],
  ["hiša gori", "nevarnost"],
  ["kuća gori", "nevarnost"],
  ["it smells like gas in my house", "nevarnost"],
  ["nekdo je vdrl v stanovanje", "nevarnost"],
  // ni nujno (šolske naloge, števila, snov)
  ["x² = 42", null],
  ["Reši enačbo x^2 = 42", null],
  ["Voda ima temperaturo 42 °C. Koliko toplote potrebujemo?", null],
  ["Telo segrejemo od 20 °C na 45 °C.", null],
  ["Kaj je vročina?", null],
  ["Magnezij gori v kisiku z belim plamenom.", null],
  ["Zaprt sistem plina pri 42 °C", null],
  ["Kaj je miokardni infarkt?", null],
  ["Kako se razmnožujejo bakterije?", null],
  ["dojenček tehta 3,5 kg, koliko je to v gramih?", null],
  ["Riješi jednačinu 2x + 4 = 42", null],
  ["Реши једначину x + 2 = 5", null],
  ["What is the boiling point of water?", null],
  ["temperature of the gas is 42 °C", null],
  ["từ từ giải bài này", null],
  ["Izračunaj 40 + 2", null],
  ["", null],
];

test(`zaznavalnik: ${PRIMERI.length} primerov (sl, hr, sr, bs, en in drugi)`, () => {
  assert.ok(PRIMERI.length >= 60);
  const napake = PRIMERI.filter(([t, v]) => zaznajNujno(t) !== v).map(([t, v]) => `${JSON.stringify(t)}: ${zaznajNujno(t)} ≠ ${v}`);
  assert.deepEqual(napake, []);
});

test("normalize: šumniki, cirilica in apostrofi", () => {
  assert.equal(normalize("Nočem VEČ živet"), "nocem vec zivet");
  assert.equal(normalize("Хоћу"), "hocu");
  assert.equal(normalize("don't"), "dont");
});

test("številke: Slovenija, fakulteta, druga država", () => {
  const si = stevilke({});
  assert.deepEqual([si.sos, si.policija, si.otroci, si.odrasli], ["112", "113", "116 111", "116 123"]);
  assert.deepEqual(klici("stiska", si), ["116 111", "116 123", "112"]);
  assert.deepEqual(klici("stiska", stevilke({ educational_track: "UNIVERZA" })), ["116 123", "112"]);
  const us = stevilke({ school_system: "US" });
  if (us.si === false) assert.equal(us.sos, "911");
  assert.equal(telHref("116 111"), "tel:116111");
});

test("vrstice: vse vrste imajo ključe v sl.js in v vseh 32 jezikih", () => {
  const dirs = readdirSync(new URL("../public/i18n/ui/", import.meta.url)).filter((f) => f.endsWith(".json"));
  assert.equal(dirs.length, 32);
  const tables = dirs.map((f) => [f, JSON.parse(readFileSync(new URL(`../public/i18n/ui/${f}`, import.meta.url), "utf8"))]);
  const keys = new Set(["nujno.oznaka", "nujno.zapri", "nujno.klic", "nujno.opomba", "nujno.opombaKratka", "nujno.stiska.drugje", "nujno.nasilje.1b"]);
  for (const st of [stevilke({}), stevilke({ educational_track: "UNIVERZA" }), { si: false, sos: "911", pomoc: "988" }])
    for (const v of ["zdravje", "stiska", "nasilje", "nevarnost"]) for (const [k] of vrstice(v, st)) keys.add(k);
  for (const k of keys) {
    assert.ok(SL[k], `sl: ${k}`);
    for (const [f, tb] of tables) assert.ok(tb[k], `${f}: ${k}`);
  }
  // Besedila, ki jih je potrdil j (kartica-nujno, 6. 11.)
  assert.equal(SL["nujno.zdravje.1"], "Takoj pokliči {sos} ali povej odraslemu ob sebi, naj pokliče zdaj.");
  assert.equal(SL["nujno.stiska.tom"], "Pokliči TOM telefon {otroci} (brezplačno, vsak dan 12–20).");
});

test("varnostni pregled: odgovor modela → vrsta", () => {
  assert.equal(preberiVrsto("ZDRAVJE"), "zdravje");
  assert.equal(preberiVrsto(" stiska."), "stiska");
  assert.equal(preberiVrsto("NE"), null);
  assert.equal(preberiVrsto("NO"), null);
  assert.equal(preberiVrsto("Hmm?"), "zdravje"); // nejasno: raje lažni alarm
  assert.match(NAVODILO, /ZDRAVJE, STISKA, NASILJE, NEVARNOST ali NE/);
});

function fakeUsage() {
  const kv = new Map();
  const logs = [];
  return { kvGet: (k) => kv.get(k) ?? null, kvSet: (k, v) => kv.set(k, String(v)), log: (...a) => logs.push(a), logs };
}

test("varnostni pregled: kratek klic, strošek aplikacije, varovalka na dan", async () => {
  const usage = fakeUsage();
  const bodies = [];
  const createFn = async (b) => (bodies.push(b), { content: [{ type: "text", text: "ZDRAVJE" }], usage: { input_tokens: 200, output_tokens: 2 }, model: b.model });
  assert.equal(await varnostniPregled({ text: "brat je čuden in bled", usage, studentId: 7, createFn }), "zdravje");
  assert.equal(bodies[0].max_tokens, 150);
  assert.match(bodies[0].model, /haiku/);
  assert.equal(usage.logs[0][0], null); // ne šteje v mejo učenca
  assert.equal(usage.logs[0][3], "varnost");
  for (let i = 1; i < VAROVALKA; i++) await varnostniPregled({ text: "x", usage, studentId: 7, createFn });
  assert.equal(bodies.length, VAROVALKA);
  assert.equal(await varnostniPregled({ text: "x", usage, studentId: 7, createFn }), null);
  assert.equal(bodies.length, VAROVALKA); // varovalka: brez klica
  // Drug učenec ima svojo varovalko; napaka API vrne null.
  assert.equal(await varnostniPregled({ text: "x", usage, studentId: 8, createFn: async () => { throw new Error("529"); } }), null);
});

// --- strežnik ---
function fakeStream(text, fail = false) {
  return async ({ onText }) => {
    if (fail) throw Object.assign(new Error("overloaded"), { status: 529 });
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn" };
  };
}
async function withServer(opts, fn) {
  const store = openDb(":memory:");
  const app = createApp(store, opts);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body) => {
    const res = await fetch(base + path, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, store });
  } finally {
    server.close();
  }
}
const events = (sse) => sse.split("\n\n").filter(Boolean).map((c) => ({ event: /^event: (.*)$/m.exec(c)[1], data: JSON.parse(/^data: (.*)$/m.exec(c)[1]) }));
const META = "\n<<META subject=MAT topic=\"x\" error=0 mode=A flag=none>>";

test("strežnik: čez mejo vrne varnostni odgovor (lokalno brez AI, sicer kratek pregled)", async () => {
  const prev = process.env.EVKLID_DAILY_QUESTIONS;
  process.env.EVKLID_DAILY_QUESTIONS = "1";
  const calls = [];
  const varnostFn = async (b) => (calls.push(b), { content: [{ type: "text", text: "NASILJE" }], usage: { input_tokens: 150, output_tokens: 2 }, model: b.model });
  try {
    await withServer({ streamFn: fakeStream("Pozdravljen." + META), varnostFn }, async ({ call, store }) => {
      const s = (await call("/api/students", { name: "Ana" })).body;
      const c = (await call(`/api/students/${s.id}/conversations`, {})).body;
      await call(`/api/conversations/${c.id}/messages`, { text: "2 + 2" });
      // Lokalni zaznavalnik: brez klica AI.
      const r = await call(`/api/conversations/${c.id}/messages`, { text: "Moj brat ima vročino 42" });
      assert.equal(r.status, 429);
      assert.equal(r.body.limit, true);
      assert.equal(r.body.nujno.vrsta, "zdravje");
      assert.equal(r.body.nujno.st.sos, "112");
      assert.equal(calls.length, 0);
      // Lokalni ne ujame: kratek pregled, strošek z student_id NULL in vrsto »varnost«.
      const r2 = await call(`/api/conversations/${c.id}/messages`, { text: "stric me je čudno gledal in zaklenil vrata" });
      assert.equal(r2.status, 429);
      assert.equal(r2.body.nujno.vrsta, "nasilje");
      assert.equal(r2.body.nujno.ai, true);
      assert.equal(calls.length, 1);
      const row = store.db.prepare("SELECT student_id, kind FROM usage WHERE kind = 'varnost'").get();
      assert.deepEqual({ ...row }, { student_id: null, kind: "varnost" });
    });
  } finally {
    if (prev === undefined) delete process.env.EVKLID_DAILY_QUESTIONS;
    else process.env.EVKLID_DAILY_QUESTIONS = prev;
  }
});

test("strežnik: pod mejo varnostni odgovor pred odgovorom inštruktorja, ob napaki AI lokalno", async () => {
  await withServer({ streamFn: fakeStream("Razumem." + META) }, async ({ call }) => {
    const s = (await call("/api/students", { name: "Bor" })).body;
    const c = (await call(`/api/students/${s.id}/conversations`, {})).body;
    const ev = events((await call(`/api/conversations/${c.id}/messages`, { text: "oče me tepe" })).body);
    assert.equal(ev[0].event, "nujno");
    assert.equal(ev[0].data.vrsta, "nasilje");
    assert.equal(ev.at(-1).event, "done"); // inštruktor odgovori normalno
    const navadno = events((await call(`/api/conversations/${c.id}/messages`, { text: "x² = 42" })).body);
    assert.ok(!navadno.some((e) => e.event === "nujno"));
  });
  await withServer({ streamFn: fakeStream("", true) }, async ({ call }) => {
    const s = (await call("/api/students", { name: "Eva" })).body;
    const c = (await call(`/api/students/${s.id}/conversations`, {})).body;
    const ev = events((await call(`/api/conversations/${c.id}/messages`, { text: "v kuhinji diši po plinu" })).body);
    assert.equal(ev[0].event, "nujno");
    assert.equal(ev.at(-1).event, "error");
  });
});
