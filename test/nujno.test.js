// Varnostni odgovor čez mejo porabe (public/nujno.js, server/nujno.js; j 6. 11. 2026).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { zaznajNujno, stevilke, vrstice, klici, telHref, normalize, drzavaNaprave, DRZAVE } from "../public/nujno.js";
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
  const drzave = Object.keys(DRZAVE).flatMap((d) => [stevilke({}, d), stevilke({ educational_track: "UNIVERZA" }, d)]);
  for (const st of [stevilke({}), stevilke({ educational_track: "UNIVERZA" }), { si: false, sos: "911", pomoc: "988" }, ...drzave])
    for (const v of ["zdravje", "stiska", "nasilje", "nevarnost"])
      for (const [k, p] of vrstice(v, st)) {
        keys.add(k);
        if (p.ure) keys.add(p.ure[0]);
      }
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
// Neodvisna nabora iz pregledov PR #479 (A: priklic in lažni alarmi; C §5: snov, vrinjene besede, izsiljevanje)
// in dodatni primeri avtorja. Zahteva pregleda: priklic ≥ 95 %, natančnost ≥ 90 %; tu morajo biti vsi pravilni.
const PREGLED_NUJNI = [
  // --- sl zdravje
  ["brat se ne zbudi", "zdravje"],
  ["sestrica je modra", "zdravje"],
  ["sestrica je cisto modra v obraz", "zdravje"],
  ["mami je padla in ne odgovarja", "zdravje"],
  ["oci je padel po stopnicah in krvavi iz glave", "zdravje"],
  ["moj brat ima vrocino 41", "zdravje"],
  ["sestra ima 40,5 vročine", "zdravje"],
  ["dedi se je zgrudil", "zdravje"],
  ["babica ne diha več", "zdravje"],
  ["brat je pojedel mamine tablete", "zdravje"],
  ["mlajši brat je spil čistilo", "zdravje"],
  ["prijatelj se je porezal in kri kar teče", "zdravje"],
  ["sošolec se trese in pena mu gre iz ust", "zdravje"],
  ["po pikom ose mu je zatekel cel obraz in ne more dihat", "zdravje"],
  ["dojencek ne pije že cel dan in je cist mlahav", "zdravje"],
  ["dojenček ima 39 in ne joka več", "zdravje"],
  ["ata ima hude bolecine v prsih", "zdravje"],
  ["mama se ne premakne in ne odpre oči", "zdravje"],
  ["brat je v bazenu pod vodo in ne pride ven", "zdravje"],
  // --- sl stiska
  ["nočem več živet", "stiska"],
  ["nocem vec zivet", "stiska"],
  ["rada bi umrla", "stiska"],
  ["najrajši se bi ubil", "stiska"],
  ["se režem", "stiska"],
  ["spet sem se rezala", "stiska"],
  ["vsem bi bilo lažje brez mene", "stiska"],
  ["ne vidim več smisla v ničemer, hočem končat vse", "stiska"],
  ["mislim na samomor", "stiska"],
  ["jutri se bom vrgel pod vlak", "stiska"],
  ["kms", "stiska"],
  // --- sl nasilje
  ["mama me spet tepe", "nasilje"],
  ["oče me pretepa", "nasilje"],
  ["oči je spet tepel mamo", "nasilje"],
  ["stric se me dotika tam kjer nočem", "nasilje"],
  ["pošlji več slik ali jih objavim, mi je napisal", "nasilje"],
  ["nekdo grozi da bo objavil moje gole slike", "nasilje"],
  ["hoče 200 evrov drugače pošlje slike vsem", "nasilje"],
  ["sošolci me vsak dan pretepajo", "nasilje"],
  ["fant mi je rekel da me bo ubil", "nasilje"],
  // --- sl nevarnost
  ["smrdi po plinu", "nevarnost"],
  ["v kuhinji diši po plinu", "nevarnost"],
  ["gori v hiši", "nevarnost"],
  ["stanovanje je polno dima", "nevarnost"],
  ["voda nam teče v hišo, poplava", "nevarnost"],
  ["v bloku je požar", "nevarnost"],
  // --- hr / sr / bs
  ["brat se ne budi", "zdravje"],
  ["sestra je plava i ne diše", "zdravje"],
  ["mama je pala i ne reaguje", "zdravje"],
  ["brat ima temperaturu 41", "zdravje"],
  ["ne želim više živjeti", "stiska"],
  ["necu vise da zivim", "stiska"],
  ["hocu da se ubijem", "stiska"],
  ["режем се", "stiska"],
  ["mama me opet tuče", "nasilje"],
  ["otac me bije", "nasilje"],
  ["пошаљи још слика или ћу их објавити", "nasilje"],
  ["prijeti da ce objaviti moje slike", "nasilje"],
  ["miriše na plin", "nevarnost"],
  ["smrdi na plin u kuhinji", "nevarnost"],
  ["gori kuća", "nevarnost"],
  ["kuca gori", "nevarnost"],
  // --- en
  ["my brother wont wake up", "zdravje"],
  ["my sister is turning blue", "zdravje"],
  ["my mom collapsed", "zdravje"],
  ["my little brother has a fever of 104", "zdravje"],
  ["i want to die", "stiska"],
  ["i dont want to live anymore", "stiska"],
  ["i keep cutting myself", "stiska"],
  ["everyone would be better off without me", "stiska"],
  ["kms fr", "stiska"],
  ["my dad hits me", "nasilje"],
  ["he said send more pics or ill post them", "nasilje"],
  ["someone is blackmailing me with my nudes", "nasilje"],
  ["smells like gas in the house", "nevarnost"],
  ["the house is on fire", "nevarnost"],
  // --- tipkarske
  ["brat ma vrocino 42", "zdravje"],
  ["nocm vec zivt", "stiska"],
  ["mama me tepe vsak dan", "nasilje"],
  ["smrdi po plnu", "nevarnost"],
  ...[
    ["mama me spet tepe", "nasilje"],
    ["mama me opet tuče", "nasilje"],
    ["ne želim više živjet", "stiska"],
    ["не хочу больше жить", "stiska"],
    ["не хочу більше жити", "stiska"],
    ["nie chcę już żyć", "stiska"],
    ["nem akarok már élni", "stiska"],
    ["nu mai vreau să trăiesc", "stiska"],
    ["nuk dua më të jetoj", "stiska"],
    ["не сакам повеќе да живеам", "stiska"],
    ["jaz bi se ubil", "stiska"],
    ["sem se porezal", "stiska"],
    ["ne bi rad več živel", "stiska"],
    ["kms", "stiska"],
    ["i want to disappear", "stiska"],
    ["pošlji več slik ali jih objavim", "nasilje"],
    ["grozi da bo objavil moje slike", "nasilje"],
    ["hoče denar drugače objavi slike", "nasilje"],
    ["prijeti da će objaviti moje slike", "nasilje"],
    ["he threatened to post my pics", "nasilje"],
    ["amenaza con publicar mis fotos", "nasilje"],
    ["minaccia di pubblicare le mie foto", "nasilje"],
    ["droht meine Bilder zu posten", "nasilje"],
    ["menace de publier mes photos", "nasilje"],
    ["ameaça publicar minhas fotos", "nasilje"],
    ["угрожает выложить мои фото", "nasilje"],
    ["sestrica je modra", "zdravje"],
    ["diši na plin", "nevarnost"],
    ["brat se ne zbudi", "zdravje"],
    ["brat ne diha več", "zdravje"],
    ["smrdi po plinu", "nevarnost"],
    ["baby ne pije", "zdravje"],
    ["moj brat ima vročino 42", "zdravje"],
    ["už nechci žít", "stiska"],
    ["хоћу да умрем", "stiska"],
  ],
];
const PREGLED_SNOV = [
  // lažni alarmi v nalogah / snovi
  ["x² = 42", null],
  ["Reši enačbo 2x + 40 = 42", null],
  ["Voda ima 42 °C, koliko toplote odda?", null],
  ["Termometer kaže 41 °C. Pretvori v kelvine.", null],
  ["Kaj je normalna telesna temperatura človeka?", null],
  ["Kako deluje plinska turbina?", null],
  ["Idealni plin: p = 2 bar, V = 3 l, izračunaj n", null],
  ["Zakaj kri teče po žilah?", null],
  ["Kaj je požarni trikotnik pri kemiji?", null],
  ["Razloži Evklidov algoritem", null],
  ["Ta naloga me ubija haha", null],
  ["umiram od dolgcasa", null],
  ["ta test me bo ubil", null],
  ["Kako se izračuna pospešek pri prostem padu?", null],
  ["Ion kalija ima naboj +1", null],
  ["V zgodbi Kekec ga tepe Bedanec", null],
  ["Kaj je fotosinteza?", null],
  ["kako se reže torta na 8 enakih kosov", null],
  ["the gas law PV = nRT", null],
  ["how does fire need oxygen", null],
  ["this homework is killing me lol", null],
  ["Koliko je 40 + 2?", null],
  ["Kemijska reakcija gorenja metana", null],
  ["Razloži plinski zakon", null],
  ["Kaj je strelna rana v fiziki, gibalna količina krogle?", null],
  ["Zakaj je nebo modro?", null],
  ["Napiši spis o poplavi v Sloveniji 2023", null],
  ["mi je dolgcas, zaigrajva igro", null],
  ...[
    "Baker ne reagira s klorovodikovo kislino", "Kako kri teče po žilah?", "Grozi mi negativna ocena", "grozi mi enka", "Preti mi pad iz matematike",
    "Prijeti mi jedinica", "Тело тонет в воде", "Benda tenggelam di air?", "Matahari tenggelam", "هل يغرق الجسم في الماء",
    "Is there a break in the graph at x = 2?", "Ahora me toca a mí", "Mi tocca studiare", "打我电话", "化学反応が起きない", "반응이 안 일어나요", "Czy żarówka pali się?",
    "Mă bate gândul să învăț", "Die Flamme erstickt ohne Sauerstoff", "To je otrava", "An ambulance drives at 90 km/h", "Kaj je oteklina?",
    "Kaj je srčni napad pri biologiji?", "Kako se je Sokrat zastrupil?", "Kaj je poplava v geografiji?", "Moj brat gre na plavanje",
    "Mama je kupila modro majico", "Kemija: požarni trikotnik", "Kaj je pozar", "Ali lahko pošlješ sliko grafa?",
    "Objavi sliko ali pa jo pošlji učitelju", "Mama ima 40 let", "the gas law", "Zakaj je morje modro",
  ].map((s) => [s, null]),
];
const DODATNI_NUJNI = [
  "ati me je včeraj spet pretepel", "mami je padla po stopnicah in se ne odziva", "sestrica je spila nekaj iz steklenice za čiščenje",
  "brat je pogoltnil baterijo", "prijateljica pravi da se bo ubila", "mislim da se bom ubil", "ne zdržim več, rad bi umrl",
  "dedek ima 40,2 in se trese", "smrdi kot plin v kopalnici", "v kuhinji gori", "oče grozi, da me bo pretepel", "stric me sili da se slečem",
  "my friend overdosed", "i took too many pills", "my dad beat me again", "he keeps hitting me", "my brother is unconscious",
  "there is a fire in my house", "brat se je utopil skoraj", "mama ne diha", "sestra ne more dihati", "on me bije svaki dan", "hoću da se ubijem",
  "I am going to kill myself tonight", "mom fell and wont respond",
];
const DODATNI_SNOV = [
  "Koliko kisika porabi gorenje?", "Kaj je infarkt?", "Kako se reže krivulja z ravnino?", "Plin v jeklenki ima tlak 40 bar",
  "Brat je dobil 5 iz matematike", "Kaj se zgodi, ko kri ne strdi?", "Razloži, zakaj ribe ne dihajo zraka", "oče je rekel da moram vaditi",
  "grozi nam nevihta", "The baby elephant drinks milk", "Kako dolgo živi muha?", "Pošlji mi slike zvezkov ali pa jih objavi v skupini",
  "Napiši pesem o ognju", "Dojenček spi 16 ur na dan",
];

test(`zaznavalnik, pregled A in C: ${PREGLED_NUJNI.length} nujnih, ${PREGLED_SNOV.length + DODATNI_SNOV.length} iz snovi`, () => {
  const zgresen = PREGLED_NUJNI.filter(([s, v]) => zaznajNujno(s) !== v).map(([s, v]) => `${s} → ${zaznajNujno(s)} (${v})`);
  const dodatni = DODATNI_NUJNI.filter((s) => !zaznajNujno(s));
  const lazni = [...PREGLED_SNOV.map(([s]) => s), ...DODATNI_SNOV].filter((s) => zaznajNujno(s)).map((s) => `${s} → ${zaznajNujno(s)}`);
  assert.deepEqual([...zgresen, ...dodatni], []);
  assert.deepEqual(lazni, []);
});

test("strežnik: izklopljen klepet (503) vrne varnostni odgovor; brez AI pregleda ob porabljenem dobroimetju", async () => {
  const prev = process.env.EVKLID_CHAT_OFF;
  process.env.EVKLID_CHAT_OFF = "1";
  const calls = [];
  const varnostFn = async (b) => (calls.push(b), { content: [{ type: "text", text: "STISKA" }], usage: { input_tokens: 150, output_tokens: 2 }, model: b.model });
  try {
    await withServer({ streamFn: fakeStream("x" + META), varnostFn }, async ({ call }) => {
      const s = (await call("/api/students", { name: "Gost" })).body;
      const c = (await call(`/api/students/${s.id}/conversations`, {})).body;
      const r = await call(`/api/conversations/${c.id}/messages`, { text: "mama me spet tepe" });
      assert.equal(r.status, 503);
      assert.equal(r.body.chat_off, true);
      assert.equal(r.body.nujno.vrsta, "nasilje");
      assert.equal(calls.length, 0); // lokalno, brez AI
      const r2 = await call(`/api/conversations/${c.id}/messages`, { text: "nekaj čudnega se dogaja" });
      assert.equal(r2.body.nujno.vrsta, "stiska");
      assert.equal(calls.length, 1);
    });
  } finally {
    if (prev === undefined) delete process.env.EVKLID_CHAT_OFF;
    else process.env.EVKLID_CHAT_OFF = prev;
  }
  // Dobroimetje porabljeno: klic bi zagotovo padel, ostane lokalni zaznavalnik.
  const usage = { ...fakeUsage(), creditOut: () => true };
  let klicev = 0;
  assert.equal(await varnostniPregled({ text: "x", usage, studentId: 1, createFn: async () => (klicev++, {}) }), null);
  assert.equal(klicev, 0);
});

test("varnostni pregled: privzeto Haiku, kratek rok brez ponovitev", () => {
  const src = readFileSync(new URL("../server/nujno.js", import.meta.url), "utf8");
  assert.match(src, /env\("EVKLID_VARNOST_MODEL", "claude-haiku-5-5"\)/);
  assert.match(src, /timeout: ROK_MS, maxRetries: 0/);
  assert.match(readFileSync(new URL("../public/app.js", import.meta.url), "utf8"), /if \(!\$\("#chat-off"\)\.hidden\) \{\n\s+const n = lokalnoNujno\(text\);/);
});

test("številke po državi: preverjene linije, imena samo v svoji državi, država naprave (j, 6. 11.)", () => {
  // Hrvaški učenec brez izbrane države (privzeto SI), telefon v Zagrebu: hrvaške številke, ne TOM.
  const hr = stevilke({ school_system: "SI" }, drzavaNaprave("Europe/Zagreb"));
  assert.equal(hr.drzava, "HR");
  assert.deepEqual(klici("stiska", hr), ["116 111", "112"]);
  assert.deepEqual(klici("nasilje", hr), ["112", "192", "116 111"]);
  const fill = (str, p) => str.replace(/\{(\w+)\}/g, (_, n) => p[n]);
  const tekst = (st, v) => vrstice(v, st).map(([k, p]) => fill(SL[k], { ...p, ure: p.ure ? fill(SL[p.ure[0]], p.ure[1]) : "" }));
  assert.ok(tekst(hr, "stiska").includes("Pokliči Hrabri telefon 116 111 (brezplačno, ob delavnikih 9–20)."));
  for (const v of ["stiska", "nasilje"]) assert.ok(!tekst(hr, v).some((x) => /TOM|Samarijan/.test(x)), v);
  // Srbija: 112 še ne deluje, po vrsti reševalci 194, gasilci 193, policija 192.
  const rs = stevilke({}, "RS");
  assert.deepEqual([klici("zdravje", rs), klici("nevarnost", rs), klici("nasilje", rs)], [["194"], ["193"], ["192", "116 111"]]);
  assert.ok(tekst(rs, "zdravje")[1].includes("194"));
  // Šolski sistem druge države ima prednost pred napravo; študent dobi linijo za odrasle.
  assert.equal(stevilke({ school_system: "DE" }, "SI").drzava, "DE");
  assert.deepEqual(klici("stiska", stevilke({ educational_track: "UNIVERZA" }, "AT")), ["142", "112"]);
  assert.deepEqual(klici("stiska", stevilke({}, "DE")), ["116 111", "0800 111 0 111", "112"]);
  // Brez znane države ostane Slovenija; drugi sistemi: reševalci pred policijo (pregled C).
  assert.equal(stevilke({}, "").si, true);
  assert.equal(stevilke({ school_system: "BR" }).sos, "192");
  assert.equal(stevilke({ school_system: "PK" }).sos, "1122");
  // Država naprave: časovni pas pred jezikom, brez poizvedb na splet.
  assert.equal(drzavaNaprave("Europe/Belgrade", ["en-US"]), "RS");
  assert.equal(drzavaNaprave("", ["bs-BA"]), "BA");
  assert.equal(drzavaNaprave("America/Chicago", ["sl-SI"]), "SI");
  // Linije v tabeli so brezplačne (opomba »klic je brezplačen«).
  for (const [d, x] of Object.entries(DRZAVE)) for (const l of [x.otroci, x.odrasli].filter(Boolean)) assert.match(l.st, /^(116 ?1(11|23)|080|0800|14[27])/, d);
});
