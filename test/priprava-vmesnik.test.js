// Priprava na test PR 7 (vmesnik): izris besedila iz zapiskov brez spremembe znakov ([?] ostane), prevodi za žive jezike,
// odstranjevanje tem iz obsega testa (PUT …/priprave/:pid izkljucene → teme, načrt, kviz) in podatki za »Danes«.
// Pot v brskalniku na 8 napravah: scripts/preveri-pripravo.cjs.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { LIVE_UI_LANGUAGES } from "../public/i18n/languages.js";
import SL from "../public/priprava/sl.js";
import { besediloZFormulami, oznaciNegotovo, negotovihPoViru, naslednjaEnota, dniMed, esc } from "../public/priprava/izris.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");

test("izris: besedilo iz zapiskov ostane, kot je (brez Markdowna in HTML), [?] je označen, formula z [?] se ne izriše", () => {
  const fake = (tex) => `<k>${tex}</k>`;
  const ven = besediloZFormulami("Odvod od x2 [?] je *2x* in a_1_ <b>x</b>: $\\int x\\,dx$ ali $x2 [?]$.", fake);
  // Znaki besedila so vsi tu (ubežani), Markdown ni uporabljen.
  assert.ok(ven.includes("*2x*") && ven.includes("a_1_"));
  assert.ok(ven.includes("&lt;b&gt;x&lt;/b&gt;") && !ven.includes("<b>"));
  assert.ok(ven.includes("<k>\\int x\\,dx</k>"));
  // Formula z negotovim branjem ostane izvirnik z dolarji in oznako, ne izriše se kot x².
  assert.ok(ven.includes("$x2 <mark class=\"pr-neg\">[?]</mark>$"));
  assert.equal((ven.match(/pr-neg/g) || []).length, 2);
  // Brez izrisa (KaTeX še ni naložen) ostane izvirni zapis.
  assert.equal(besediloZFormulami("a $b$ c", null), "a $b$ c");
  // Neuspel izris: izvirnik.
  assert.equal(besediloZFormulami("$x$", () => { throw new Error("x"); }), "$x$");
  assert.equal(oznaciNegotovo(esc("<[?]>")), '&lt;<mark class="pr-neg">[?]</mark>&gt;');
});

test("izris: negotova mesta po virih, dnevi do testa, naslednja enota", () => {
  const m = negotovihPoViru([{ vir_id: 1, negotovo: ["x2", "y2"] }, { vir_id: 1, negotovo: [] }, { vir_id: 2, negotovo: ["H2"] }, { vir_id: 3 }]);
  assert.deepEqual([...m], [[1, 2], [2, 1]]);
  assert.equal(dniMed("2026-11-28", "2026-12-04"), 6);
  assert.equal(dniMed("2026-12-04", "2026-11-28"), -6);
  assert.equal(dniMed(null, "2026-12-04"), null);
  const nalogaa = { vrsta: "vaja", tema: { id: "t" } };
  assert.equal(naslednjaEnota({ naslednja: nalogaa, dnevi: [] }), nalogaa);
  const pt = { vrsta: "poskusni_test", tema: null };
  assert.equal(naslednjaEnota({ naslednja: null, danes: "2026-12-03", dnevi: [{ datum: "2026-12-03", naloge: [pt] }] }), pt);
  assert.equal(naslednjaEnota({ naslednja: null, danes: "2026-12-03", dnevi: [{ datum: "2026-12-04", naloge: [pt] }] }), null);
});

test("prevodi: živi jeziki imajo vse ključe vmesnika priprave z istimi spremenljivkami, drugih datotek ni", () => {
  const dir = new URL("../public/priprava/i18n/", import.meta.url);
  const datoteke = fs.readdirSync(dir).sort();
  assert.deepEqual(datoteke, LIVE_UI_LANGUAGES.filter((l) => l !== "sl").map((l) => `${l}.json`).sort());
  const spremenljivke = (v) => [...new Set(JSON.stringify(v).match(/\{\w+\}/g) || [])].sort();
  for (const f of datoteke) {
    const d = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    for (const [k, v] of Object.entries(SL)) {
      assert.ok(d[k] !== undefined, `${f}: manjka ${k}`);
      assert.equal(typeof d[k], typeof v, `${f}: ${k} (množina)`);
      if (typeof v === "object") assert.ok(typeof d[k].other === "string", `${f}: ${k}.other`);
      assert.deepEqual(spremenljivke(d[k]), spremenljivke(v), `${f}: ${k}`);
      // Oznaka negotovega branja ostane ista v vseh jezikih.
      assert.equal(JSON.stringify(d[k]).includes("[?]"), JSON.stringify(v).includes("[?]"), `${f}: ${k} [?]`);
    }
    for (const k of Object.keys(d)) assert.ok(SL[k] !== undefined, `${f}: odvečen ${k}`);
  }
});

async function streznik() {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { log() {}, info() {}, warn() {}, error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (method, p, body) => {
    const r = await fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: await r.json() };
  };
  const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "4. letnik", educational_track: "SREDNJA_SOLA", subject: "MAT" } })).body;
  const datum = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const plan = (await req("POST", `/api/students/${s.id}/test-plan`, { path: "MAT-SS-4", units: [2], date: datum })).body.plan;
  const zap = fs.readFileSync(new URL("./fixtures/priprava/mat-integrali.md", import.meta.url), "utf8");
  assert.equal((await req("POST", `/api/students/${s.id}/priprave/${plan.pripravaId}/viri`, { besedilo: zap })).status, 201);
  const konec = async () => {
    await new Promise((r) => server.close(r));
    store.db.close();
  };
  return { store, req, s, pid: plan.pripravaId, konec };
}

test("obseg: odstranjena tema ni v obsegu, pokritosti, načrtu in kvizu; vrne se s praznim seznamom; vseh ni mogoče odstraniti", async () => {
  const { req, s, pid, konec } = await streznik();
  const P = `/api/students/${s.id}/priprave/${pid}`;
  try {
    const prej = (await req("GET", `${P}/teme`)).body;
    assert.ok(prej.obseg.length >= 2);
    assert.deepEqual(prej.izkljucene, []);
    const ven = prej.obseg[0].id;
    const r = await req("PUT", P, { izkljucene: [ven, ven] });
    assert.equal(r.status, 200);
    assert.deepEqual(r.body.priprava.izkljucene, [ven]);
    const z = (await req("GET", `${P}/teme`)).body;
    assert.ok(!z.obseg.some((t) => t.id === ven));
    assert.deepEqual(z.izkljucene.map((t) => t.id), [ven]);
    assert.equal(z.pokritost.vseh, prej.obseg.length - 1);
    // Predznanje je pred celim obsegom (odstranjena tema ni predznanje).
    assert.ok(!z.predznanje.some((t) => t.id === ven));
    assert.deepEqual(z.predznanje, prej.predznanje);
    const n = (await req("GET", `${P}/nacrt`)).body;
    assert.ok(!n.dnevi.flatMap((d) => d.naloge).some((x) => x.tema?.id === ven));
    // Za »Danes«: koliko nalog enota potrebuje (nacrt.js OPRAVLJENO_NALOG) in koliko jih je danes rešenih.
    assert.deepEqual(Object.keys(n.potrebnoNalog).sort(), ["nova", "ponovitev", "vaja"]);
    assert.deepEqual(n.nalogDanes, {});
    const k = (await req("POST", `${P}/kviz`, { dolzina: 6, teme: [ven] })).body;
    assert.equal(k.code, "kviz_teme"); // odstranjene teme ni v načrtu, zato je kviz ne sme izbrati
    const napredek = (await req("GET", `${P}/napredek`)).body;
    assert.ok(!napredek.teme.some((t) => t.id === ven));
    // Vse teme odstranjene: obseg ostane cel (test brez tem ni test), izkljucene je prazen.
    const vse = (await req("PUT", P, { izkljucene: prej.obseg.map((t) => t.id) })).body.priprava;
    assert.equal(vse.izkljucene.length, prej.obseg.length);
    const z2 = (await req("GET", `${P}/teme`)).body;
    assert.equal(z2.obseg.length, prej.obseg.length);
    assert.deepEqual(z2.izkljucene, []);
    // Prazen seznam vrne vse teme.
    assert.deepEqual((await req("PUT", P, { izkljucene: [] })).body.priprava.izkljucene, []);
    assert.equal((await req("GET", `${P}/teme`)).body.obseg.length, prej.obseg.length);
    // Napačen vnos.
    for (const b of [{ izkljucene: "x" }, { izkljucene: [1] }, { izkljucene: ["a b"] }, { izkljucene: Array.from({ length: 201 }, (_, i) => `t${i}`) }])
      assert.equal((await req("PUT", P, b)).body.code, "priprava_teme");
  } finally {
    await konec();
  }
});

test("vmesnik: priprava je len modul (ni v prvem nalaganju), stari obrazec testa je odstranjen", () => {
  const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.ok(app.includes('lenModul("./priprava/priprava.js")'));
  assert.ok(!app.includes('id="tp-form"'));
  const css = fs.readFileSync(new URL("../public/priprava/priprava.css", import.meta.url), "utf8");
  // Samo barve iz :root (svetla in temna tema), razen bele na modri podlagi pripravljenosti.
  const barve = css.match(/#[0-9a-f]{3,8}\b/gi) || [];
  assert.deepEqual([...new Set(barve.map((x) => x.toLowerCase()))], ["#fff"]);
});
