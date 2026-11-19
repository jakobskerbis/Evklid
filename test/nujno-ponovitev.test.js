// Varnostni pregled, ko ponudnik AI ne odgovori (j 18. 11. 2026; server/nujno.js, server/app.js):
// ena ponovitev v ozadju, pozni zadetek (okno v istem toku ali ob naslednjem odgovoru), nepregledano brez okna,
// števci za lastnika in zaprte vrzeli (»Razloži podrobneje«, dnevna in mesečna meja z računi).
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import {
  pregledSPonovitvijo,
  varnostniPregled,
  nujnoPredZavrnitvijo,
  vrstaPoznihOken,
  poznoOkno,
  pregledovDanes,
  stevci,
  stej,
  varnostStanje,
  varnostPorocilo,
  STEVCI,
  STEVCI_KV,
  VAROVALKA,
  ROK_MS,
  ROK_PONOVITVE_MS,
} from "../server/nujno.js";

const pocakaj = (ms) => new Promise((r) => setTimeout(r, ms));
// Časovniki ponovitve v ozadju procesa ne držijo pri življenju (server/nujno.js); testi brez strežnika zato potrebujejo svojega.
const drzi = setInterval(() => {}, 1000);
after(() => clearInterval(drzi));
async function doKler(pogoj, opis = "pogoj", ms = 8000) {
  const t0 = Date.now();
  while (!(await pogoj())) {
    if (Date.now() - t0 > ms) assert.fail(`ni izpolnjeno v ${ms} ms: ${opis}`);
    await pocakaj(10);
  }
}
// Kratki roki za teste: prvi poskus 80 ms, ponovitev 300 ms, brez premora.
const CASI = { rokMs: 80, rokPonovitveMs: 300, premorMs: 0 };
const odgovor = (text) => ({ content: [{ type: "text", text }], usage: { input_tokens: 220, output_tokens: 2 }, model: "claude-haiku-5-5" });

// Lažni varnostni pregled: pravilo(besedilo, zaporedni poskus za to besedilo) → "NE" | vrsta | "napaka" | "visi".
function varnost(pravilo) {
  const poskusi = new Map();
  const fn = async (body) => {
    const b = body.messages[0].content;
    const n = (poskusi.get(b) || 0) + 1;
    poskusi.set(b, n);
    fn.klici.push({ b, n });
    const k = await pravilo(b, n);
    if (k === "napaka") throw Object.assign(new Error("529 overloaded"), { status: 529 });
    if (k === "visi") return new Promise(() => {});
    return odgovor(k);
  };
  fn.klici = [];
  return fn;
}
// Zapora: obljuba, ki jo test odpre sam (vrstni red dogodkov ne sme biti odvisen od hitrosti stroja).
const zapora = () => {
  let odpri;
  const p = new Promise((r) => (odpri = r));
  return { p, odpri };
};
// Izpad ponudnika za besedilo, ki ustreza `re`: prvi klic pade (ali z "visi" ne odgovori), ponovitev počaka, da jo
// test spusti, in vrne `vrsta`. Zadetek tako pride zanesljivo po koncu odgovora. Druga besedila dobijo NE.
function pozenZadetek(re, vrsta, prvi = "napaka") {
  const cakajo = [];
  const fn = varnost(async (b, n) => {
    if (!re.test(b)) return "NE";
    if (n === 1) return prvi;
    await new Promise((r) => cakajo.push(r));
    return vrsta;
  });
  fn.spusti = async () => {
    await doKler(() => cakajo.length > 0, "ponovitev je v teku");
    for (const r of cakajo.splice(0)) r();
  };
  return fn;
}
// Roki za teste z zaporo: ponovitev sme čakati na test.
const CASI_ZAPORA = { rokMs: 80, rokPonovitveMs: 20000, premorMs: 0 };
function fakeUsage() {
  const kv = new Map();
  const logs = [];
  return { kvGet: (k) => kv.get(k) ?? null, kvSet: (k, v) => kv.set(k, String(v)), log: (...a) => logs.push(a), logs, kv, creditOut: () => false };
}
const danes = (usage) => {
  const { dan, zadnje_nepregledano, ...d } = stevci(usage, 1)[0];
  return d;
};
const samo = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v));

// ---------------------------------------------------------------------------
// 1. Pregled z eno ponovitvijo (brez strežnika)

test("ponovitev: zdrav ponudnik – en klic, brez ponovitve, brez štetja", async () => {
  const usage = fakeUsage();
  const fn = varnost((b) => (/stric/.test(b) ? "NASILJE" : "NE"));
  const a = pregledSPonovitvijo({ text: "koliko je 2 + 2", usage, studentId: 1, createFn: fn, varovalka: false, casi: CASI });
  assert.deepEqual(await a.prvi, { vrsta: null, izid: "ok" });
  assert.equal(await a.pozno, null);
  const b = pregledSPonovitvijo({ text: "stric me je zaklenil v sobo", usage, studentId: 1, createFn: fn, varovalka: false, casi: CASI });
  assert.deepEqual(await b.prvi, { vrsta: "nasilje", izid: "ok" });
  assert.equal(await b.pozno, null);
  assert.equal(fn.klici.length, 2);
  assert.deepEqual(samo(danes(usage)), {});
  // Privzeti roki: učenec čaka največ 5 s, ponovitev v ozadju ima 20 s.
  assert.deepEqual([ROK_MS, ROK_PONOVITVE_MS], [5000, 20000]);
});

test("ponovitev: napaka ponudnika → en ponovni poskus → zadetek; strošek aplikacije, ne učenca", async () => {
  const usage = fakeUsage();
  const fn = varnost((b, n) => (n === 1 ? "napaka" : "STISKA"));
  const { prvi, pozno } = pregledSPonovitvijo({ text: "ne vem, kaj naj naredim", usage, studentId: 7, createFn: fn, varovalka: false, casi: CASI });
  assert.deepEqual(await prvi, { vrsta: null, izid: "napaka" });
  assert.deepEqual(await pozno, { vrsta: "stiska", izid: "ok" });
  assert.equal(fn.klici.length, 2);
  assert.deepEqual(samo(danes(usage)), { napaka: 1, ponovitve: 1, pozni_zadetki: 1 });
  // Plačan je samo uspeli klic (ponovitev): student_id NULL in vrsta »varnost« (ne šteje v mejo ali bazen učenca).
  assert.equal(usage.logs.length, 1);
  assert.deepEqual([usage.logs[0][0], usage.logs[0][3]], [null, "varnost"]);
});

test("ponovitev: ponudnik ne odgovori (rok) → prvi poskus se konča ob roku, ponovitev najde zadetek", async () => {
  const usage = fakeUsage();
  const fn = varnost((b, n) => (n === 1 ? "visi" : "ZDRAVJE"));
  const t0 = Date.now();
  const { prvi, pozno } = pregledSPonovitvijo({ text: "dedek čudno govori", usage, studentId: 7, createFn: fn, varovalka: false, casi: CASI });
  assert.deepEqual(await prvi, { vrsta: null, izid: "rok" });
  const cas = Date.now() - t0;
  assert.ok(cas >= CASI.rokMs - 10 && cas < CASI.rokMs + 5000, `prvi poskus se je končal po ${cas} ms`);
  assert.deepEqual(await pozno, { vrsta: "zdravje", izid: "ok" });
  assert.deepEqual(samo(danes(usage)), { rok: 1, ponovitve: 1, pozni_zadetki: 1 });
});

test("ponovitev: tudi drugi poskus ne uspe → nepregledano, brez vrste, v dnevniku brez vsebine; natanko ena ponovitev", async () => {
  const besedilo = "skrivnost-ki-ne-sme-v-dnevnik";
  const opozorila = [];
  const prej = console.warn;
  console.warn = (...a) => opozorila.push(a.join(" "));
  try {
    for (const [drugi, izid] of [["napaka", "napaka"], ["visi", "rok"]]) {
      const usage = fakeUsage();
      const fn = varnost((b, n) => (n === 1 ? "napaka" : drugi));
      const { prvi, pozno } = pregledSPonovitvijo({ text: besedilo, usage, studentId: 7, createFn: fn, varovalka: false, casi: CASI });
      assert.equal((await prvi).vrsta, null);
      assert.deepEqual(await pozno, { vrsta: null, izid });
      await pocakaj(30);
      assert.equal(fn.klici.length, 2, "prvi poskus in natanko ena ponovitev");
      assert.deepEqual(samo(danes(usage)), { napaka: 1, ponovitve: 1, nepregledano: 1 });
      assert.match(stevci(usage, 1)[0].zadnje_nepregledano, /^\d{4}-\d\d-\d\dT/);
      // Zapis števcev: samo znana imena in števila, nič o sporočilu ali učencu.
      const zapis = usage.kv.get(STEVCI_KV);
      assert.ok(!zapis.includes(besedilo) && !/student|ucenec|pogovor|"7"/.test(zapis), zapis);
      const dan = Object.values(JSON.parse(zapis))[0];
      assert.deepEqual(Object.keys(dan).sort(), [...STEVCI, "zadnje_nepregledano"].sort());
    }
  } finally {
    console.warn = prej;
  }
  assert.ok(opozorila.some((o) => /ostaja nepregledano/.test(o)));
  assert.ok(opozorila.every((o) => !o.includes(besedilo)), "besedilo sporočila ne gre v dnevnik");
});

test("ponovitev: neznan odgovor ne sproži ponovitve; pri ponovitvi ne odpre okna niti čez mejo", async () => {
  const usage = fakeUsage();
  const fn = varnost(() => "Hmm?");
  const a = pregledSPonovitvijo({ text: "nekaj", usage, studentId: 1, createFn: fn, varovalka: false, casi: CASI });
  assert.deepEqual(await a.prvi, { vrsta: null, izid: "neznano" });
  assert.equal(await a.pozno, null);
  assert.equal(fn.klici.length, 1);
  // Čez mejo (varovalka): neznan odgovor prvega poskusa ostane lažni alarm »zdravje« (kot doslej) …
  const b = pregledSPonovitvijo({ text: "nekaj drugega", usage, studentId: 1, createFn: fn, casi: CASI });
  assert.deepEqual(await b.prvi, { vrsta: "zdravje", izid: "neznano" });
  // … pri ponovitvi v ozadju pa okna ne odpre (pozno okno brez zadetka bi bilo lažni alarm).
  const fn2 = varnost((x, n) => (n === 1 ? "napaka" : "Hmm?"));
  const c = pregledSPonovitvijo({ text: "nekaj tretjega", usage, studentId: 1, createFn: fn2, casi: CASI });
  assert.equal((await c.prvi).vrsta, null);
  assert.deepEqual(await c.pozno, { vrsta: null, izid: "neznano" });
  assert.deepEqual(samo(danes(usage)), { neznano: 3, napaka: 1, ponovitve: 1 });
});

test("ponovitev: brez dobroimetja in nad varovalko ni klica in ni ponovitve, a je prešteto; ponovitev ne šteje v varovalko", async () => {
  const usage = { ...fakeUsage(), creditOut: () => true };
  const fn = varnost(() => "STISKA");
  const a = pregledSPonovitvijo({ text: "x", usage, studentId: 1, createFn: fn, casi: CASI });
  assert.deepEqual(await a.prvi, { vrsta: null, izid: "preskok", razlog: "dobroimetje" });
  assert.equal(await a.pozno, null);
  assert.equal(fn.klici.length, 0);
  assert.deepEqual(samo(danes(usage)), { brez_dobroimetja: 1 });
  assert.equal(varnostStanje(usage).danes.nepregledano, 1); // javno stanje: sporočilo brez pregleda

  const u2 = fakeUsage();
  const ne = varnost(() => "NE");
  for (let i = 0; i < VAROVALKA; i++) await pregledSPonovitvijo({ text: `sporočilo ${i}`, usage: u2, studentId: 5, createFn: ne, casi: CASI }).prvi;
  const b = pregledSPonovitvijo({ text: "enajsto", usage: u2, studentId: 5, createFn: ne, casi: CASI });
  assert.deepEqual(await b.prvi, { vrsta: null, izid: "preskok", razlog: "varovalka" });
  assert.equal(await b.pozno, null);
  assert.equal(ne.klici.length, VAROVALKA);
  assert.deepEqual(samo(danes(u2)), { nad_varovalko: 1 });
  assert.equal(varnostStanje(u2).danes.nepregledano, 0); // varovalka je pravilo, ne izpad: javno ni šteta

  // Ponovitev je del istega sporočila: v varovalko šteje enkrat.
  const u3 = fakeUsage();
  const fn3 = varnost((x, n) => (n === 1 ? "napaka" : "NE"));
  const c = pregledSPonovitvijo({ text: "eno sporočilo", usage: u3, studentId: 9, createFn: fn3, casi: CASI });
  await c.pozno;
  assert.equal(fn3.klici.length, 2);
  assert.equal(pregledovDanes(u3, 9), 1);
});

test("varnostniPregled ostane en sam poskus (živi preizkus filtra): brez ponovitve in brez štetja", async () => {
  const usage = fakeUsage();
  const fn = varnost(() => "napaka");
  assert.equal(await varnostniPregled({ text: "x", usage, studentId: 1, createFn: fn, varovalka: false }), null);
  await pocakaj(30);
  assert.equal(fn.klici.length, 1);
  assert.equal(usage.kv.has(STEVCI_KV), false);
});

test("števci: šifriran zapis z vsemi ključi vsak dan, 60 dni, neznano ime se ne zapiše; poročili za stanje in skrbnika", async () => {
  const usage = fakeUsage();
  stej(usage, "rok");
  stej(usage, "nekaj_drugega");
  stej(usage, "__proto__");
  assert.deepEqual(samo(danes(usage)), { rok: 1 });
  // S ključem za podatke je zapis šifriran (kot oznake stiske): iz baze se ne vidi, ali je bil kak zadetek.
  const prej = process.env.EVKLID_DATA_KEY;
  process.env.EVKLID_DATA_KEY = Buffer.alloc(32, 7).toString("base64");
  try {
    const u = fakeUsage();
    stej(u, "napaka");
    const d1 = u.kv.get(STEVCI_KV);
    assert.match(d1, /^enc1:/);
    stej(u, "pozni_zadetki");
    assert.equal(u.kv.get(STEVCI_KV).length, d1.length, "zadetek ne spremeni dolžine zapisa");
    assert.deepEqual(samo(danes(u)), { napaka: 1, pozni_zadetki: 1 });
    // Javno stanje: samo rok, napaka in nepregledano; nič o zadetkih.
    const javno = varnostStanje(u);
    assert.deepEqual(Object.keys(javno).sort(), ["danes", "vceraj", "vklopljen", "zadnjeNepregledano"]);
    assert.deepEqual(javno.danes, { rok: 0, napaka: 1, nepregledano: 0 });
    assert.ok(!/zadet|pozn/.test(JSON.stringify(javno)));
    // Skrbnik: vsi števci 7 dni, najnovejši prvi.
    const p = varnostPorocilo(u, vrstaPoznihOken());
    assert.equal(p.dnevi.length, 7);
    assert.equal(p.dnevi[0].pozni_zadetki, 1);
    assert.equal(p.pozna_okna_cakajo, 0);
    assert.equal(p.varovalka_na_dan, VAROVALKA);
  } finally {
    if (prej === undefined) delete process.env.EVKLID_DATA_KEY;
    else process.env.EVKLID_DATA_KEY = prej;
  }
  // Starejši od 60 dni se pobrišejo.
  const u2 = fakeUsage();
  const stari = Object.fromEntries(Array.from({ length: 70 }, (_, i) => [new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10), { rok: 1 }]));
  u2.kvSet(STEVCI_KV, JSON.stringify(stari));
  stej(u2, "rok");
  assert.equal(Object.keys(JSON.parse(u2.kv.get(STEVCI_KV))).length, 60);
  // Pokvarjen zapis ali usage brez kv ne vrže napake (stanje strežnika ne sme pasti).
  const u3 = fakeUsage();
  u3.kvSet(STEVCI_KV, "{pokvarjeno");
  assert.deepEqual(varnostStanje(u3).danes, { rok: 0, napaka: 0, nepregledano: 0 });
  assert.deepEqual(varnostStanje(undefined).danes, { rok: 0, napaka: 0, nepregledano: 0 });
  assert.doesNotThrow(() => stej({}, "rok"));
  // vklopljen: s ključem API in brez stikala.
  const [k, m, v] = [process.env.ANTHROPIC_API_KEY, process.env.EVKLID_MOCK, process.env.EVKLID_VARNOST_VSAKO];
  try {
    process.env.ANTHROPIC_API_KEY = "sk-test-ni-pravi";
    delete process.env.EVKLID_MOCK;
    delete process.env.EVKLID_VARNOST_VSAKO;
    assert.equal(varnostStanje(u3).vklopljen, true);
    process.env.EVKLID_VARNOST_VSAKO = "0";
    assert.equal(varnostStanje(u3).vklopljen, false);
    assert.match(varnostPorocilo(u3).razlog, /EVKLID_VARNOST_VSAKO/);
    delete process.env.EVKLID_VARNOST_VSAKO;
    process.env.EVKLID_MOCK = "1";
    assert.equal(varnostStanje(u3).vklopljen, false);
  } finally {
    for (const [ime, vr] of [["ANTHROPIC_API_KEY", k], ["EVKLID_MOCK", m], ["EVKLID_VARNOST_VSAKO", v]]) {
      if (vr === undefined) delete process.env[ime];
      else process.env[ime] = vr;
    }
  }
});

test("pozna okna: eno na vrsto, po vrsti, rok, vrnitev in profil z istim id", () => {
  let zdaj = 1_000_000;
  let poteklo = 0;
  const q = vrstaPoznihOken({ veljaMs: 1000, obPoteku: () => poteklo++, zdaj: () => zdaj });
  const ana = { id: 1, created_at: "2026-11-18 10:00:00" };
  const bor = { id: 2, created_at: "2026-11-18 10:00:00" };
  assert.equal(q.vzemi(ana), null);
  q.dodaj(ana, { vrsta: "stiska" });
  q.dodaj(ana, { vrsta: "stiska" }); // ista vrsta se ne podvoji
  q.dodaj(ana, { vrsta: "zdravje" });
  q.dodaj(null, { vrsta: "zdravje" });
  q.dodaj(ana, {});
  assert.equal(q.stevilo(), 2);
  assert.equal(q.vzemi(bor), null, "drug učenec ne dobi tujega okna");
  const prvo = q.vzemi(ana);
  assert.equal(prvo.vrsta, "stiska");
  assert.equal(q.stevilo(), 1);
  // Neoddano okno gre nazaj in obdrži svoj rok.
  q.vrni(ana, prvo);
  assert.equal(q.stevilo(), 2);
  assert.equal(q.vzemi(ana).vrsta, "zdravje");
  assert.equal(q.vzemi(ana).vrsta, "stiska");
  assert.equal(q.vzemi(ana), null);
  // Nov profil z istim id (izbrisan in znova ustvarjen) okna ne podeduje.
  q.dodaj(ana, { vrsta: "nasilje" });
  assert.equal(q.vzemi({ id: 1, created_at: "2026-11-18 10:00:07" }), null);
  // Po izbrisu profila se okno pobriše (klic po izbrisu v server/app.js).
  q.obdrzi((id, ustvarjen) => !(id === 1 && ustvarjen === ana.created_at));
  assert.equal(q.stevilo(), 0);
  // Rok: po POZNO_VELJA_MS okna ni več, prešteto je kot poteklo (tudi če je poteklo med rezervacijo).
  q.dodaj(bor, { vrsta: "stiska" });
  const rezervirano = (q.dodaj(ana, { vrsta: "zdravje" }), q.vzemi(ana));
  zdaj += 1001;
  assert.equal(q.vzemi(bor), null);
  q.vrni(ana, rezervirano);
  assert.equal(q.stevilo(), 0);
  assert.equal(poteklo, 2);
  // Podatki za odjemalca: enaki kot pri pravočasnem zadetku pregleda (vrsta, številke, ai).
  assert.deepEqual(Object.keys(poznoOkno({ vrsta: "nasilje", do: 1 }, {})).sort(), ["ai", "st", "vrsta"]);
  assert.equal(poznoOkno(null, {}), null);
});

test("čez mejo: učenec počaka samo na prvi poskus; pozni zadetek gre v vrsto za naslednji odgovor", async () => {
  const usage = fakeUsage();
  const q = vrstaPoznihOken();
  const ana = { id: 3, created_at: "x", settings: {} };
  // Lokalni zaznavalnik najde sam: brez klica AI, nič v vrsti.
  const fn = varnost(() => "napaka");
  assert.equal((await nujnoPredZavrnitvijo({ text: "oče me tepe", student: ana, usage, createFn: fn, pozna: q, casi: CASI })).vrsta, "nasilje");
  assert.equal(fn.klici.length, 0);
  // Besedilo, ki ga lokalni zaznavalnik ne ujame: prvi poskus pade → brez okna zdaj; zavrnitev ne čaka na ponovitev
  // (ta še teče, ko je odgovor že znan), okno gre v vrsto šele po njej.
  const fn2 = pozenZadetek(/čudno/, "STISKA");
  assert.equal(await nujnoPredZavrnitvijo({ text: "danes je vse nekam čudno", student: ana, usage, createFn: fn2, pozna: q, casi: CASI_ZAPORA }), null);
  assert.equal(q.stevilo(), 0, "ponovitev še teče");
  await fn2.spusti();
  await doKler(() => q.stevilo() === 1, "pozno okno v vrsti");
  assert.equal(q.vzemi(ana).vrsta, "stiska");
  // Posredna stiska lokalno (»pogovor«) in pozni zadetek: blažje okno zdaj, polno v vrsti.
  const fn3 = pozenZadetek(/ne zdržim/, "STISKA");
  assert.equal((await nujnoPredZavrnitvijo({ text: "ne zdržim več", student: ana, usage, createFn: fn3, pozna: q, casi: CASI_ZAPORA })).vrsta, "pogovor");
  await fn3.spusti();
  await doKler(() => q.stevilo() === 1, "polno okno v vrsti");
  assert.equal(q.vzemi(ana).vrsta, "stiska");
  // Brez vrste (klic iz starejše kode) ne pade; ponovitev, ki ne uspe, ne doda ničesar.
  assert.equal(await nujnoPredZavrnitvijo({ text: "danes je vse nekam čudno!", student: ana, usage, createFn: varnost(() => "napaka"), casi: CASI }), null);
  await pocakaj(40);
  assert.equal(q.stevilo(), 0);
});

// ---------------------------------------------------------------------------
// 2. Strežnik

const META = '\n<<META subject=MAT topic="x" error=0 mode=A flag=none>>';
const metaFlag = (flag) => `\n<<META subject=MAT topic="x" error=0 mode=A flag=${flag}>>`;
function tok(text, { ms = 0, fail = false } = {}) {
  return async ({ onText }) => {
    if (ms) await pocakaj(ms);
    if (fail) throw Object.assign(new Error("overloaded"), { status: 529 });
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn" };
  };
}
async function withServer(opts, fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, varnostCasi: CASI, ...opts });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body, method) => {
    const res = await fetch(base + path, { method: method || (body ? "POST" : "GET"), headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  const ucenec = async (name) => {
    const s = (await call("/api/students", { name })).body;
    const c = (await call(`/api/students/${s.id}/conversations`, {})).body;
    const poslji = async (text, extra = {}, conv = c.id) => {
      const r = await call(`/api/conversations/${conv}/messages`, { text, ...extra });
      return r.status === 200 && typeof r.body === "string" ? events(r.body) : r;
    };
    return { s, c, poslji, novPogovor: async () => (await call(`/api/students/${s.id}/conversations`, {})).body.id };
  };
  const usage = app.locals.usage;
  try {
    await fn({ call, store, app, usage, ucenec, base, stanje: () => danes(usage) });
  } finally {
    server.close();
  }
}
const events = (sse) => sse.split("\n\n").filter(Boolean).map((c) => ({ event: /^event: (.*)$/m.exec(c)[1], data: JSON.parse(/^data: (.*)$/m.exec(c)[1]) }));
const okna = (ev) => ev.filter((e) => e.event === "nujno").map((e) => e.data.vrsta);
const pred = (ev, a, b) => ev.findIndex((e) => e.event === a) >= 0 && ev.findIndex((e) => e.event === a) < ev.findIndex((e) => e.event === b);

test("strežnik: rok → ponovitev → zadetek → okno v istem toku; odgovor ni shranjen za druge, strošek je aplikacije", async () => {
  const varnostFn = varnost((b, n) => (/zaklenil/.test(b) ? (n === 1 ? "visi" : "NASILJE") : "NE"));
  // Inštruktor pri prvem sporočilu odgovarja, dokler pozno okno ni v toku (prvi poskus pregleda poteče po 80 ms).
  let stevciZdaj = null;
  let prvo = true;
  const streamFn = async (a) => {
    if (prvo) {
      prvo = false;
      await doKler(() => stevciZdaj().pozno_v_toku === 1, "pozno okno v toku");
    }
    return tok("Razumem." + META)(a);
  };
  await withServer({ streamFn, varnostFn }, async ({ ucenec, store, stanje }) => {
    stevciZdaj = stanje;
    const { poslji } = await ucenec("Ana");
    const ev = await poslji("stric me je zaklenil v sobo");
    assert.deepEqual(okna(ev), ["nasilje"], "natanko eno okno");
    assert.equal(ev.find((e) => e.event === "nujno").data.ai, true);
    assert.ok(pred(ev, "nujno", "done"));
    assert.equal(ev.at(-1).event, "done");
    assert.equal(varnostFn.klici.length, 2);
    assert.deepEqual(samo(stanje()), { rok: 1, ponovitve: 1, pozni_zadetki: 1, pozno_v_toku: 1 });
    // Kot pravočasen zadetek: odgovor na sporočilo z zadetkom ne ostane v predpomnilniku za druge (pregled #846).
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM answer_cache").get().n, 0);
    // Strošek: samo aplikacija (student_id NULL, vrsta »varnost«).
    const rows = store.db.prepare("SELECT student_id FROM usage WHERE kind = 'varnost'").all();
    assert.ok(rows.length >= 1 && rows.every((r) => r.student_id === null));
    // Naslednje sporočilo: okno ni podvojeno.
    assert.deepEqual(okna(await poslji("koliko je 2 + 2")), []);
  });
});

test("strežnik: ponovitev ne zadržuje odgovora inštruktorja (odgovor pride, ko ponovitev še teče)", async () => {
  // Prvi poskus ne odgovori (rok 80 ms), ponovitev čaka na zaporo: odgovor mora priti prej.
  const varnostFn = pozenZadetek(/čudno/, "STISKA", "visi");
  await withServer({ streamFn: tok("Razumem." + META), varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, stanje }) => {
    const { poslji } = await ucenec("Bine");
    const ev = await poslji("doma je vse čudno");
    assert.equal(ev.at(-1).event, "done");
    assert.deepEqual(okna(ev), []);
    assert.deepEqual(samo(stanje()), { rok: 1, ponovitve: 1 }, "ponovitev še teče, odgovor je že tu");
    await varnostFn.spusti();
    await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
    assert.deepEqual(okna(await poslji("koliko je 2 + 2")), ["stiska"]);
  });
});

test("strežnik: zadetek ponovitve po koncu odgovora → okno ob naslednjem odgovoru, enkrat, samo temu učencu", async () => {
  const varnostFn = pozenZadetek(/zaklenil/, "NASILJE");
  await withServer({ streamFn: tok("Razumem." + META), varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, store, stanje, app, call }) => {
    const ana = await ucenec("Ana");
    const bor = await ucenec("Bor");
    const ev1 = await ana.poslji("stric me je zaklenil v sobo");
    assert.deepEqual(okna(ev1), [], "ob izpadu ponudnika v prvem odgovoru ni okna");
    assert.equal(ev1.at(-1).event, "done");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM answer_cache").get().n, 1, "odgovor je bil shranjen, preden je prišel zadetek");
    await varnostFn.spusti();
    await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM answer_cache").get().n, 0, "pozni zadetek ga pobriše");
    assert.equal((await call("/api/usage")).body.varnost.pozna_okna_cakajo, 1);
    // Drug učenec okna ne dobi.
    assert.deepEqual(okna(await bor.poslji("koliko je 3 + 3")), []);
    // Ana ga dobi ob naslednjem odgovoru (tudi v drugem pogovoru): isto okno kot ob pravočasnem zadetku.
    const drugi = await ana.novPogovor();
    const ev2 = await ana.poslji("koliko je 2 + 2", {}, drugi);
    assert.deepEqual(okna(ev2), ["nasilje"]);
    const okno = ev2.find((e) => e.event === "nujno").data;
    assert.deepEqual([okno.ai, okno.st.sos, Object.keys(okno).sort()], [true, "112", ["ai", "st", "vrsta"]]);
    assert.ok(pred(ev2, "nujno", "done"));
    // Samo enkrat.
    await doKler(() => stanje().pozno_naslednji === 1, "oddano okno prešteto");
    assert.deepEqual(okna(await ana.poslji("koliko je 5 + 5")), []);
    assert.deepEqual(okna(await ana.poslji("koliko je 6 + 6", {}, drugi)), []);
    assert.deepEqual(samo(stanje()), { napaka: 1, ponovitve: 1, pozni_zadetki: 1, pozno_naslednji: 1 });
    assert.equal(varnostPorocilo(app.locals.usage).dnevi[0].pozni_zadetki, 1);
    assert.equal((await call("/api/usage")).body.varnost.pozna_okna_cakajo, 0);
  });
});

test("strežnik: ponovitev ne uspe → nepregledano, nobenega okna (ne zdaj ne pozneje), vidno v stanju in pri skrbniku", async () => {
  const varnostFn = varnost((b) => (/čudno/.test(b) ? "napaka" : "NE"));
  await withServer({ streamFn: tok("Razumem." + META), varnostFn }, async ({ ucenec, stanje, call, store }) => {
    const { poslji } = await ucenec("Cene");
    const ev = await poslji("doma je vse zelo čudno");
    assert.deepEqual(okna(ev), []);
    assert.equal(ev.at(-1).event, "done");
    await doKler(() => stanje().nepregledano === 1, "nepregledano");
    assert.equal(varnostFn.klici.length, 2, "ena ponovitev, ne več");
    assert.deepEqual(okna(await poslji("koliko je 2 + 2")), [], "izpad ponudnika ne odpre okna niti pozneje");
    assert.deepEqual(samo(stanje()), { napaka: 1, ponovitve: 1, nepregledano: 1 });
    // Javno stanje strežnika: samo števila o ponudniku.
    const javno = (await call("/healthz/stanje")).body.varnostniPregled;
    assert.deepEqual(javno.danes, { rok: 0, napaka: 1, nepregledano: 1 });
    assert.match(javno.zadnjeNepregledano, /^\d{4}-/);
    // Skrbnik (/api/usage): vsi števci.
    const skrbnik = (await call("/api/usage")).body.varnost;
    assert.equal(skrbnik.dnevi[0].nepregledano, 1);
    assert.equal(skrbnik.dnevi.length, 7);
    // V bazi o nepregledanem sporočilu ni drugega kot števec: besedila ne.
    const kv = store.db.prepare("SELECT value FROM kv WHERE key = ?").get(STEVCI_KV).value;
    assert.ok(!kv.includes("čudno"));
  });
});

test("strežnik: izpad ponudnika ne zasuje učencev z okni (vsako sporočilo en klic in ena ponovitev, nič oken)", async () => {
  let izpad = true;
  const varnostFn = varnost(() => (izpad ? "napaka" : "NE"));
  await withServer({ streamFn: tok("Razumem." + META), varnostFn }, async ({ ucenec, stanje }) => {
    const ucenci = await Promise.all(["Ana", "Bor", "Cene"].map(ucenec));
    let vseh = 0;
    for (let krog = 0; krog < 3; krog++) {
      for (const u of ucenci) {
        const ev = await u.poslji(`naloga ${krog}: koliko je ${krog} + ${u.s.id}`);
        assert.deepEqual(okna(ev), []);
        assert.equal(ev.at(-1).event, "done");
        vseh++;
      }
    }
    await doKler(() => stanje().nepregledano === vseh, "vsa sporočila prešteta kot nepregledana");
    assert.equal(varnostFn.klici.length, 2 * vseh, "prvi poskus in ena ponovitev na sporočilo");
    assert.deepEqual(samo(stanje()), { napaka: vseh, ponovitve: vseh, nepregledano: vseh });
    // Ponudnik spet dela: nobenega zaostalega okna, števci izpada se ne spreminjajo več.
    izpad = false;
    for (const u of ucenci) assert.deepEqual(okna(await u.poslji("in še ena naloga")), []);
    assert.equal(varnostFn.klici.length, 2 * vseh + ucenci.length);
    assert.deepEqual(samo(stanje()), { napaka: vseh, ponovitve: vseh, nepregledano: vseh });
  });
});

test("strežnik: blažje okno »pogovor« zdaj, polno okno poznega zadetka ob naslednjem odgovoru", async () => {
  const varnostFn = pozenZadetek(/ne zdržim/, "STISKA");
  await withServer({ streamFn: tok("Razumem." + META), varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, stanje }) => {
    const { poslji } = await ucenec("Dora");
    assert.deepEqual(okna(await poslji("ne zdržim več")), ["pogovor"]);
    await varnostFn.spusti();
    await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
    assert.deepEqual(okna(await poslji("koliko je 2 + 2")), ["stiska"]);
    await doKler(() => stanje().pozno_naslednji === 1, "oddano");
    assert.deepEqual(okna(await poslji("koliko je 4 + 4")), []);
  });
});

test("strežnik: okno novega sporočila ima prednost; pozno okno druge vrste počaka na naslednji odgovor, enaka vrsta se ne podvoji", async () => {
  const varnostFn = pozenZadetek(/čudno|drugače/, "STISKA");
  await withServer({ streamFn: tok("Razumem." + META), varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, stanje }) => {
    const { poslji } = await ucenec("Ema");
    assert.deepEqual(okna(await poslji("doma je vse čudno")), []);
    await varnostFn.spusti();
    await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
    // Novo sporočilo ima svoj zadetek (lokalno, zdravje): eno okno, pozno (stiska) ostane v vrsti.
    assert.deepEqual(okna(await poslji("Ati se je onesvestil in ne diha")), ["zdravje"]);
    assert.deepEqual(okna(await poslji("koliko je 2 + 2")), ["stiska"]);
    await doKler(() => stanje().pozno_naslednji === 1, "oddano");
    assert.deepEqual(okna(await poslji("koliko je 3 + 3")), []);
    // Pozno okno enake vrste, kot jo nosi novo sporočilo samo: eno okno, potem nič več.
    assert.deepEqual(okna(await poslji("danes je vse drugače")), []);
    await varnostFn.spusti();
    await doKler(() => stanje().pozni_zadetki === 2, "drugi pozni zadetek");
    assert.deepEqual(okna(await poslji("nočem več živeti")), ["stiska"]);
    await doKler(() => stanje().pozno_naslednji === 2, "šteto kot oddano");
    assert.deepEqual(okna(await poslji("koliko je 7 + 7")), []);
  });
});

test("strežnik: inštruktor je stisko označil sam → pozni zadetek iste vrste ne doda okna, druge vrste pride naslednjič", async () => {
  const stiska = "Slišim te. Pokliči TOM telefon 116 111." + metaFlag("distress");
  for (const [vrsta, naslednjic] of [["STISKA", []], ["NASILJE", ["nasilje"]]]) {
    const varnostFn = pozenZadetek(/smisla/, vrsta);
    let prvi = true;
    const streamFn = (a) => (prvi ? ((prvi = false), tok(stiska)(a)) : tok("Razumem." + META)(a));
    await withServer({ streamFn, varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, stanje }) => {
      const { poslji } = await ucenec("Fani");
      assert.deepEqual(okna(await poslji("nič več nima smisla")), ["stiska"]);
      await varnostFn.spusti();
      await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
      assert.deepEqual(okna(await poslji("koliko je 2 + 2")), naslednjic, vrsta);
      if (!naslednjic.length) assert.equal(stanje().pozno_ze_okno, 1);
    });
  }
});

test("strežnik: ob napaki inštruktorja gre čakajoče pozno okno kot dogodek pred napako, enkrat", async () => {
  const varnostFn = pozenZadetek(/čudno/, "ZDRAVJE");
  let pade = false;
  const streamFn = (a) => tok("Razumem." + META, { fail: pade })(a);
  await withServer({ streamFn, varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, stanje }) => {
    const { poslji } = await ucenec("Gal");
    assert.deepEqual(okna(await poslji("babica je čudno bleda")), []);
    await varnostFn.spusti();
    await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
    pade = true;
    const ev = await poslji("koliko je 2 + 2");
    assert.deepEqual(okna(ev), ["zdravje"]);
    assert.ok(pred(ev, "nujno", "error"));
    assert.equal(ev.at(-1).data.nujno, undefined, "ne dvakrat");
    pade = false;
    await doKler(() => stanje().pozno_naslednji === 1, "oddano");
    assert.deepEqual(okna(await poslji("koliko je 3 + 3")), []);
  });
});

test("strežnik: prekinjena povezava pred koncem odgovora → pozno okno ostane za naslednji odgovor", async () => {
  const varnostFn = pozenZadetek(/čudno/, "STISKA");
  // Inštruktor pri drugem sporočilu odgovarja, dokler ga test ne spusti (učenec vmes prekine povezavo).
  let cakaj = null;
  const streamFn = async (a) => {
    if (cakaj) await cakaj.p;
    return tok("Razumem." + META)(a);
  };
  await withServer({ streamFn, varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, stanje, call, base }) => {
    const { poslji, c } = await ucenec("Hana");
    assert.deepEqual(okna(await poslji("vse je čudno")), []);
    await varnostFn.spusti();
    await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
    // Naslednji odgovor: okno gre v tok, a učenec povezavo prekine pred koncem.
    cakaj = zapora();
    const ac = new AbortController();
    const r = await fetch(`${base}/api/conversations/${c.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "koliko je 2 + 2" }), signal: ac.signal });
    const bralec = r.body.getReader();
    let prejeto = "";
    while (!/event: nujno/.test(prejeto)) {
      const { value, done } = await bralec.read();
      assert.equal(done, false, "tok je še odprt");
      prejeto += new TextDecoder().decode(value);
    }
    ac.abort();
    // Strežnik ne ve, ali je učenec okno videl: gre nazaj v vrsto in pride še enkrat (raje dvakrat kot nikoli).
    await doKler(async () => (await call("/api/usage")).body.varnost.pozna_okna_cakajo === 1, "okno je spet v vrsti");
    assert.equal(stanje().pozno_naslednji, 0);
    cakaj.odpri();
    cakaj = null;
    let ev = null;
    await doKler(async () => Array.isArray((ev = await poslji("koliko je 3 + 3"))), "pogovor je spet prost");
    assert.deepEqual(okna(ev), ["stiska"]);
    await doKler(() => stanje().pozno_naslednji === 1, "oddano");
    assert.deepEqual(okna(await poslji("koliko je 4 + 4")), []);
  });
});

test("strežnik: izbrisan profil – pozno okno ne preide na nov profil z istim id", async () => {
  const varnostFn = pozenZadetek(/čudno/, "STISKA");
  await withServer({ streamFn: tok("Razumem." + META), varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, stanje, call }) => {
    const stari = await ucenec("Iza");
    assert.deepEqual(okna(await stari.poslji("vse je čudno")), []);
    await varnostFn.spusti();
    await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
    assert.equal((await call("/api/usage")).body.varnost.pozna_okna_cakajo, 1);
    assert.equal((await call(`/api/students/${stari.s.id}`, null, "DELETE")).status, 200);
    const novi = await ucenec("Jan");
    assert.equal(novi.s.id, stari.s.id, "SQLite id izbrisanega profila dodeli novemu");
    assert.deepEqual(okna(await novi.poslji("koliko je 2 + 2")), []);
    assert.equal((await call("/api/usage")).body.varnost.pozna_okna_cakajo, 0);
  });
});

test("strežnik: mobilna aplikacija z lastnim blažjim oknom – pozno okno počaka na odgovor, v katerem bo vidno", async () => {
  const varnostFn = pozenZadetek(/čudno/, "NASILJE");
  await withServer({ streamFn: tok("Razumem." + META), varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, stanje, base }) => {
    const { poslji, c } = await ucenec("Kaja");
    assert.deepEqual(okna(await poslji("vse je čudno")), []);
    await varnostFn.spusti();
    await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
    const mobilno = async (text) =>
      events(await (await fetch(`${base}/api/conversations/${c.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json", "x-app-client": "evklid-mobile" }, body: JSON.stringify({ text }) })).text());
    // Aplikacija za »ne zdržim več« sama takoj pokaže blažje okno in okna strežnika ne pokaže več: pozno okno ostane v vrsti.
    assert.deepEqual(okna(await mobilno("ne zdržim več")), ["pogovor"]);
    assert.equal(stanje().pozno_naslednji, 0);
    assert.deepEqual(okna(await mobilno("koliko je 2 + 2")), ["nasilje"]);
    await doKler(() => stanje().pozno_naslednji === 1, "oddano");
    assert.deepEqual(okna(await mobilno("koliko je 3 + 3")), []);
  });
});

// ---------------------------------------------------------------------------
// 3. Vrzeli

test("vrzel »Razloži podrobneje«: besedilo z zastavico deep gre skozi pregled kot vsako drugo", async () => {
  const varnostFn = varnost((b) => (/zaklenil/.test(b) ? "NASILJE" : "NE"));
  await withServer({ streamFn: tok("Razumem." + META), varnostFn }, async ({ ucenec }) => {
    const { poslji } = await ucenec("Ana");
    await poslji("koliko je 3x + 2 = 11");
    const n = varnostFn.klici.length;
    // Stalno besedilo gumba: pregledano (NE), brez okna.
    assert.deepEqual(okna(await poslji("Tega ne razumem dobro. Razloži podrobneje, korak za korakom.", { deep: true })), []);
    assert.equal(varnostFn.klici.length, n + 1);
    // Prosto besedilo z zastavico deep pregleda ne obide več.
    assert.deepEqual(okna(await poslji("stric me je zaklenil v sobo", { deep: true })), ["nasilje"]);
    assert.equal(varnostFn.klici.length, n + 2);
  });
});

test("vrzel sporočilo samo s sliko: brez besedila ni pregleda (ostane inštruktor), z besedilom je", async () => {
  const varnostFn = varnost((b) => (/zaklenil/.test(b) ? "NASILJE" : "NE"));
  const image = { media_type: "image/png", data: "iVBORw0KGgo=" };
  await withServer({ streamFn: tok("Razumem." + META), varnostFn }, async ({ ucenec }) => {
    const { poslji } = await ucenec("Bor");
    assert.deepEqual(okna(await poslji("", { image })), []);
    assert.equal(varnostFn.klici.length, 0);
    assert.deepEqual(okna(await poslji("stric me je zaklenil v sobo", { image })), ["nasilje"]);
    assert.equal(varnostFn.klici.length, 1);
  });
});

test("vrzel čez mejo (brez računov): prvi poskus pade → zavrnitev brez okna; pozni zadetek ob naslednji zavrnitvi, enkrat", async () => {
  const prev = process.env.EVKLID_DAILY_QUESTIONS;
  process.env.EVKLID_DAILY_QUESTIONS = "1";
  const varnostFn = pozenZadetek(/čudno/, "STISKA");
  try {
    await withServer({ streamFn: tok("Razumem." + META), varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, stanje }) => {
      const { poslji } = await ucenec("Cene");
      await poslji("2 + 2");
      const r1 = await poslji("doma je vse čudno");
      assert.deepEqual([r1.status, r1.body.limit, r1.body.nujno], [429, true, undefined]);
      await varnostFn.spusti();
      await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
      const r2 = await poslji("kdaj lahko spet vprašam");
      assert.deepEqual([r2.status, r2.body.nujno?.vrsta, r2.body.nujno?.ai], [429, "stiska", true]);
      await doKler(() => stanje().pozno_naslednji === 1, "oddano");
      const r3 = await poslji("res ne morem več vprašati");
      assert.deepEqual([r3.status, r3.body.nujno], [429, undefined]);
    });
  } finally {
    if (prev === undefined) delete process.env.EVKLID_DAILY_QUESTIONS;
    else process.env.EVKLID_DAILY_QUESTIONS = prev;
  }
});

// Računi (kot v test/accounts.test.js): lažna Stripe in Resend.
function fakeFetch(calls) {
  let n = 0;
  return async (url, init = {}) => {
    const body = init.body ? (init.headers["Content-Type"]?.includes("json") ? JSON.parse(init.body) : Object.fromEntries(new URLSearchParams(init.body))) : null;
    const u = new URL(url);
    calls.push({ path: u.pathname, body, host: u.host });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.host === "api.resend.com") return ok({ id: "email_" + ++n });
    if (u.pathname.endsWith("/prices") && init.method === "GET") return ok({ data: [] });
    return ok({ id: "x_" + ++n, data: [] });
  };
}
async function zRacuni(opts, fn) {
  const store = openDb(":memory:");
  const calls = [];
  const app = createApp(store, { accounts: true, scheduler: false, stripeKey: "sk_test_x", resendKey: "re_x", webhookSecret: "whsec_test", fetchFn: fakeFetch(calls), log: { error() {} }, varnostCasi: CASI, ...opts });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const a = async (path, o = {}) => {
    const res = await fetch(base + path, { method: o.method || "GET", redirect: "manual", headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") }, body: o.body ? JSON.stringify(o.body) : undefined });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
    }
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    const reg = await a("/api/auth/register", { method: "POST", body: { email: "varnost@primer.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(reg.status, 201);
    await a(/\/api\/auth\/verify\?token=[\w-]+/.exec(calls.filter((c) => c.host === "api.resend.com").at(-1).body.text)[0]);
    const kid = (await a("/api/students", { method: "POST", body: { name: "Lan", birth_year: new Date().getFullYear() - 10, consent: true } })).body;
    const conv = (await a(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
    const ask = (text, extra = {}) => a(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text, ...extra } });
    await fn({ a, ask, kid, conv, store, app });
  } finally {
    server.close();
  }
}

test("vrzel dnevna meja vprašanj (računi): zavrnitev prebere sporočilo in nosi varnostni odgovor; meja ostane", async () => {
  process.env.EVKLID_FREE_DAILY_QUESTIONS = "1";
  const varnostFn = varnost((b) => (/zaklenil/.test(b) ? "NASILJE" : "NE"));
  const streamFn = async ({ onText }) => (onText("ok"), { text: 'ok\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>', stopReason: "end_turn" });
  try {
    await zRacuni({ streamFn, varnostFn }, async ({ ask, store, conv, kid, app }) => {
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run(); // brezplačni paket
      assert.equal((await ask("koliko je 2 + 2")).status, 200);
      const n = varnostFn.klici.length;
      // Navadno sporočilo čez mejo: ista zavrnitev kot prej, brez okna.
      const navadno = await ask("še eno vprašanje");
      assert.deepEqual([navadno.status, navadno.body.code, navadno.body.limit, navadno.body.upgrade, navadno.body.nujno], [429, "block.freeDaily", true, false, undefined]);
      // Sporočilo, ki ga ujame samo pregled z AI: prej ga strežnik sploh ni prebral.
      const ai = await ask("stric me je zaklenil v sobo");
      assert.deepEqual([ai.status, ai.body.code, ai.body.limit, ai.body.nujno?.vrsta, ai.body.nujno?.ai], [429, "block.freeDaily", true, "nasilje", true]);
      assert.match(ai.body.error, /\d/);
      // Lokalni zaznavalnik na strežniku: brez klica AI.
      const klicev = varnostFn.klici.length;
      const lokalno = await ask("oče me tepe");
      assert.deepEqual([lokalno.status, lokalno.body.nujno?.vrsta, lokalno.body.nujno?.ai], [429, "nasilje", undefined]);
      assert.equal(varnostFn.klici.length, klicev);
      assert.equal(klicev, n + 2);
      // Meja drži: nič se ne shrani in nič ne šteje; strošek pregleda ni učenčev.
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM messages WHERE conversation_id = ? AND role = 'user'").get(conv.id).n, 1);
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM usage WHERE student_id = ? AND kind = 'varnost'").get(kid.id).n, 0);
      assert.ok(store.db.prepare("SELECT COUNT(*) AS n FROM usage WHERE student_id IS NULL AND kind = 'varnost'").get().n >= 2);
      // Čez mejo velja varovalka (največ VAROVALKA pregledov profila na dan); naprej samo lokalni zaznavalnik, prešteto.
      for (let i = 0; i < VAROVALKA; i++) await ask(`čez mejo ${i}`);
      const pred = varnostFn.klici.length;
      const cez = await ask("stric me je spet zaklenil v sobo");
      assert.deepEqual([cez.status, cez.body.nujno], [429, undefined]);
      assert.equal(varnostFn.klici.length, pred);
      assert.ok(danes(app.locals.usage).nad_varovalko >= 1);
    });
  } finally {
    delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
  }
});

test("vrzel mesečna meja brezplačnega paketa (računi): zavrnitev nosi varnostni odgovor, telo ostane isto", async () => {
  process.env.EVKLID_FREE_POOL_USD = "0";
  process.env.EVKLID_FREE_STUDENT_USD = "0.5";
  const varnostFn = varnost((b) => (/zaklenil/.test(b) ? "NASILJE" : "NE"));
  const streamFn = async ({ onText }) => (onText("ok"), { text: 'ok\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>', stopReason: "end_turn" });
  try {
    await zRacuni({ streamFn, varnostFn }, async ({ ask, store, kid }) => {
      store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku', 'chat', 0.6)").run(kid.id);
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
      const navadno = await ask("koliko je 2 + 2");
      assert.deepEqual([navadno.status, navadno.body.code, navadno.body.limit, navadno.body.nujno], [429, "block.freeMonth", true, undefined]);
      assert.equal(typeof navadno.body.upgrade, "boolean");
      const nujno = await ask("stric me je zaklenil v sobo");
      assert.deepEqual([nujno.status, nujno.body.code, nujno.body.limit, nujno.body.nujno?.vrsta], [429, "block.freeMonth", true, "nasilje"]);
      assert.deepEqual(Object.keys(nujno.body).filter((k) => k !== "nujno").sort(), Object.keys(navadno.body).sort());
    });
  } finally {
    delete process.env.EVKLID_FREE_POOL_USD;
    delete process.env.EVKLID_FREE_STUDENT_USD;
  }
});

test("vrzel porabljeno dobroimetje pri ponudniku: pregleda ni (kot doslej), a je prešteto in vidno v stanju", async () => {
  const varnostFn = varnost(() => "STISKA");
  await withServer({ streamFn: tok("Razumem." + META), varnostFn }, async ({ ucenec, usage, call, stanje }) => {
    const { poslji } = await ucenec("Dora");
    usage.markCreditOut();
    const r = await poslji("doma je vse čudno");
    assert.deepEqual([r.status, r.body.code, r.body.nujno], [429, "block.creditOut", undefined]);
    assert.equal(varnostFn.klici.length, 0);
    assert.deepEqual(samo(stanje()), { brez_dobroimetja: 1 });
    assert.equal((await call("/healthz/stanje")).body.varnostniPregled.danes.nepregledano, 1);
    // Lokalni zaznavalnik dela naprej.
    assert.equal((await poslji("oče me tepe")).body.nujno.vrsta, "nasilje");
  });
});

test("pregled #858: prekinitev, preden prvi poskus pregleda novega sporočila konča, pozno okno ostane v vrsti", async () => {
  let vrataDrugo = null;
  const cakajo = [];
  const varnostFn = varnost(async (b, n) => {
    if (/čudno/.test(b)) {
      if (n === 1) return "napaka";
      await new Promise((r) => cakajo.push(r));
      return "STISKA";
    }
    if (/2 \+ 2/.test(b) && vrataDrugo) await vrataDrugo.p;
    return "NE";
  });
  let cakaj = null;
  const streamFn = async (a) => {
    if (cakaj) await cakaj.p;
    return tok("Razumem." + META)(a);
  };
  await withServer({ streamFn, varnostFn, varnostCasi: { rokMs: 3000, rokPonovitveMs: 20000, premorMs: 0 } }, async ({ ucenec, stanje, call, base }) => {
    const { poslji, c } = await ucenec("Hana");
    assert.deepEqual(okna(await poslji("vse je čudno")), []);
    await doKler(() => cakajo.length > 0, "ponovitev");
    for (const r of cakajo.splice(0)) r();
    await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
    assert.equal((await call("/api/usage")).body.varnost.pozna_okna_cakajo, 1);
    cakaj = zapora();
    vrataDrugo = zapora();
    const ac = new AbortController();
    const rp = fetch(`${base}/api/conversations/${c.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "koliko je 2 + 2" }), signal: ac.signal }).catch(() => null);
    await doKler(() => varnostFn.klici.some((k) => /2 \+ 2/.test(k.b)), "pregled drugega sporočila teče");
    ac.abort();
    await rp;
    await pocakaj(200);
    vrataDrugo.odpri();
    await pocakaj(200);
    cakaj.odpri();
    cakaj = null;
    assert.equal((await call("/api/usage")).body.varnost.pozna_okna_cakajo, 1, "okno ostane v vrsti");
    let ev = null;
    await doKler(async () => Array.isArray((ev = await poslji("koliko je 3 + 3"))), "prost");
    assert.deepEqual(okna(ev), ["stiska"], "pozno okno bi moralo priti ob naslednjem odgovoru");
  });
});

test("pregled #858: inštruktorjeva oznaka stiske, ko je mesto zasedlo pozno okno druge vrste, pride ob naslednjem odgovoru", async () => {
  const varnostFn = pozenZadetek(/zaklenil/, "NASILJE");
  let n = 0;
  const streamFn = async (a) => {
    n++;
    return n === 2 ? tok("Takoj pokliči 112." + metaFlag("distress"))(a) : tok("Razumem." + META)(a);
  };
  await withServer({ streamFn, varnostFn, varnostCasi: CASI_ZAPORA }, async ({ ucenec, stanje, call }) => {
    const { poslji } = await ucenec("Ana");
    assert.deepEqual(okna(await poslji("stric me je zaklenil v sobo")), []);
    await varnostFn.spusti();
    await doKler(() => stanje().pozni_zadetki === 1, "pozni zadetek");
    const ev = await poslji("kaj naj zdaj naredim s prijateljem");
    assert.deepEqual(okna(ev), ["nasilje"]);
    assert.equal((await call("/api/usage")).body.varnost.pozna_okna_cakajo, 1, "okno inštruktorja čaka");
    const naslednje = okna(await poslji("hvala"));
    assert.equal(naslednje.length, 1);
    assert.notEqual(naslednje[0], "nasilje");
  });
});
