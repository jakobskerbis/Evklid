// K-04 (načrt kakovosti po reviziji, P0): varna odpoved preverjevalnikov. Ko SymPy, Lean ali model ne dela (izklop,
// manjkajoč program, sesutje, rok, nerazumljiv izpis), nobena trditev iz nabora v2 (N-01) ne sme dobiti višjega
// statusa, kot ga dovoljujejo preostali dokazi. Za SymPy to pomeni: status vsake trditve je točno tak kot pri
// preverjanju brez SymPy (skener-lokalno), nobena napačna ni potrjena in nobena ni »dokazano«.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import express from "express";
import { naloziNabor, razvrsti } from "../scripts/meri-preverjanje.mjs";
import { verifyAiFull, solveWithRetries, mountScan } from "../server/scan.js";
import { casStop, casStanje } from "../server/cas.js";
import { izSkenerja } from "../public/preverjanje/statusi.js";
import { stanjePreverjevalnikov } from "../server/preverjevalniki.js";
import { leanDokazi, oznakeIzDokazov } from "../server/oznake-vsebine.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const vsi = naloziNabor().filter((p) => p.sol);
// Pri izpadih z rokom vsaka zahteva čaka rok: vsaka šesta trditev (vse skupine) je dovolj in test ostane hiter.
const vzorec = vsi.filter((_, i) => i % 6 === 0);
const lazni = (ime) => fileURLToPath(new URL(`./fixtures/odpoved/${ime}`, import.meta.url));
const mapa = mkdtempSync(join(tmpdir(), "evklid-k04-"));
const ENV = ["EVKLID_CAS", "EVKLID_PYTHON", "EVKLID_CAS_TIMEOUT_MS", "EVKLID_K04_DNEVNIK"];
const prej = Object.fromEntries(ENV.map((k) => [k, process.env[k]]));
after(() => {
  casStop();
  for (const k of ENV) prej[k] === undefined ? delete process.env[k] : (process.env[k] = prej[k]);
  rmSync(mapa, { recursive: true, force: true });
});

async function statusi(primeri, cas) {
  const out = new Map();
  for (const p of primeri) out.set(p.id, izSkenerja((await verifyAiFull(p.naloga, p.sol, { cas })).status));
  return out;
}

// Vsak izpad začne s čistim stanjem: ustavljen proces, samo njegove spremenljivke okolja, svoj dnevnik zahtev, ki ga
// lažni worker piše ob vsaki prejeti zahtevi (dokaz, da je test res šel skozi izpad, ne mimo njega).
let n = 0;
function okolje(env) {
  casStop();
  for (const k of ENV) delete process.env[k];
  const dnevnik = join(mapa, `zahteve-${++n}.txt`);
  Object.assign(process.env, env, { EVKLID_K04_DNEVNIK: dnevnik });
  return () => (existsSync(dnevnik) ? readFileSync(dnevnik, "utf8").split("\n").filter(Boolean).length : 0);
}

// Brez SymPy: dokazi, ki ostanejo (lokalna točna algebra in numerika). To je zgornja meja za vsak izpad.
const lokalno = await statusi(vsi, false);

test("izhodišče brez SymPy: nič napačno potrjenih ali previsokih, znane šibke (kot test/preverjanje-meritev)", () => {
  // Pripeto, da pokvarjen lokalni del (npr. »ni znano« kot uspeh) ne premakne izhodišča skupaj z izpadi.
  const razred = (r) => vsi.filter((p) => razvrsti(p, lokalno.get(p.id)) === r).map((p) => p.id);
  assert.deepEqual(razred("napacno_potrjena"), []);
  assert.deepEqual(razred("previsok_status"), []);
  assert.deepEqual(razred("napacna_sibko"), ["periodicna-004", "periodicna-006", "periodicna-010", "druge-017"]);
  assert.ok(![...lokalno.values()].includes("dokazano"));
});

test("kontrola: test zazna preverjevalnik, ki vse potrdi (sicer primerjava ne bi ničesar merila)", async () => {
  const zahtev = okolje({ EVKLID_PYTHON: lazni("lazniv.sh") });
  const st = await statusi(vsi, true);
  const dvignjeni = vsi.filter((p) => st.get(p.id) !== lokalno.get(p.id));
  assert.ok(dvignjeni.length > 100, `le ${dvignjeni.length} razlik`);
  assert.ok(zahtev() > 100, `lažni worker je dobil le ${zahtev()} zahtev`);
});

// [ime, okolje, trditve, najmanj zahtev, ki jih mora dobiti lažni worker]
const IZPADI = [
  ["izklopljen (EVKLID_CAS=0)", { EVKLID_CAS: "0" }, vsi, 0],
  ["sesutje ob vsaki zahtevi", { EVKLID_PYTHON: lazni("sesutje.sh") }, vsi, 100],
  ["rok: worker ne odgovori", { EVKLID_PYTHON: lazni("rok.sh"), EVKLID_CAS_TIMEOUT_MS: "25" }, vzorec, 20],
  ["nerazumljiv izpis", { EVKLID_PYTHON: lazni("smeti.sh"), EVKLID_CAS_TIMEOUT_MS: "25" }, vzorec, 20],
  ["manjka program", { EVKLID_PYTHON: "/ni/tega/pythona" }, vsi, 0],
];

for (const [ime, env, primeri, najmanj] of IZPADI) {
  test(`izpad SymPy – ${ime}: noben status nad lokalnimi dokazi, nič napačno potrjenih`, async () => {
    const zahtev = okolje(env);
    const st = await statusi(primeri, true);
    if (najmanj) assert.ok(zahtev() >= najmanj, `lažni worker je dobil le ${zahtev()} zahtev: izpad ni bil preizkušen`);
    const razlike = primeri.filter((p) => st.get(p.id) !== lokalno.get(p.id)).map((p) => `${p.id}: ${lokalno.get(p.id)} → ${st.get(p.id)}`);
    assert.deepEqual(razlike, [], "izpad je spremenil status");
    const potrjene = primeri.filter((p) => razvrsti(p, st.get(p.id)) === "napacno_potrjena").map((p) => p.id);
    assert.deepEqual(potrjene, [], "napačno potrjene ob izpadu");
    assert.ok(![...st.values()].includes("dokazano"), "»dokazano« brez Leana");
    // /healthz/stanje: SymPy je med preverjevalniki, ki ne delajo (izklopljen, zagon ni uspel, rok ali sesutje)
    const s = stanjePreverjevalnikov({ cas: casStanje() });
    assert.ok(s.nedelujejo.includes("sympy"), JSON.stringify(s.sympy));
  });
}

test("izpad SymPy: /healthz pove, kateri preverjevalnik ne dela", () => {
  const s = stanjePreverjevalnikov({ cas: { vklopljen: false, deluje: null }, ai: { deluje: false }, lean: 0 });
  assert.deepEqual(s.nedelujejo, ["sympy", "lean", "model"]);
  assert.equal(s.sympy.vklopljen, false);
  const ok = stanjePreverjevalnikov({ cas: { vklopljen: true, deluje: true }, ai: { deluje: true }, lean: 3 });
  assert.deepEqual(ok.nedelujejo, []);
  const zagon = stanjePreverjevalnikov({ cas: { vklopljen: true, deluje: false }, ai: null, lean: 3 });
  assert.deepEqual(zagon.nedelujejo, ["sympy"]);
  assert.equal(zagon.model.deluje, null, "brez podatkov o modelu ne trdimo, da dela");
  // proces teče, a zahteve ostajajo brez odgovora: ena prepočasna ni izpad, niz je
  const ena = stanjePreverjevalnikov({ cas: { vklopljen: true, deluje: true, neuspesnih: 1, razlog: "rok" }, ai: { deluje: true }, lean: 3 });
  assert.deepEqual(ena.nedelujejo, []);
  const zatika = stanjePreverjevalnikov({ cas: { vklopljen: true, deluje: true, neuspesnih: 3, razlog: "rok" }, ai: { deluje: true }, lean: 3 });
  assert.deepEqual(zatika.nedelujejo, ["sympy"]);
  assert.equal(zatika.sympy.razlog, "rok");
});

test("/healthz/stanje vsebuje preverjevalnike (ob izpadu SymPy je »sympy« med nedelujočimi)", async () => {
  okolje({ EVKLID_CAS: "0" });
  const app = createApp(openDb(":memory:"), { scheduler: false });
  const server = app.listen(0);
  try {
    const st = await (await fetch(`http://127.0.0.1:${server.address().port}/healthz/stanje`)).json();
    assert.ok(Array.isArray(st.preverjevalniki?.nedelujejo), JSON.stringify(st.preverjevalniki));
    assert.ok(st.preverjevalniki.nedelujejo.includes("sympy"));
    assert.equal(typeof st.preverjevalniki.lean.dokazov, "number");
  } finally {
    server.close();
  }
});

test("izpad Leana: brez veljavnih dokazov nobena lekcija ni »Formalno dokazano«", () => {
  // Lean ne teče na strežniku: oznaka izhaja iz dokazov v repozitoriju (CI lean.yml). Manjka mapa, dokaz je zastarel
  // (sha besedila se ne ujema) ali ga ni → ni oznake.
  assert.equal(leanDokazi("/ni/te/mape").size, 0);
  const dokaz = (lean) => oznakeIzDokazov({ stanje: "pregledano", lean }).some((o) => o.id === "formalno");
  assert.equal(dokaz(null), false);
  assert.equal(dokaz({ izreki: 4, svez: false }), false);
  assert.equal(dokaz({ izreki: 0, svez: true }), false);
  assert.equal(dokaz({ izreki: 4, svez: true }), true);
  assert.equal(stanjePreverjevalnikov({ cas: { vklopljen: true, deluje: true }, lean: 0 }).lean.deluje, false);
});

test("izpad modela: brez rešitve ni statusa; padla ponovitev ne dvigne statusa prvega poskusa", async () => {
  // a) model ne odgovori: pot vrne 503 brez rešitve in brez statusa
  const app = express();
  app.use(express.json());
  const napaka = Object.assign(new Error("529 overloaded"), { status: 529 });
  mountScan(app, { loadStudent: () => ({ id: 1, settings: {} }), solveFn: async () => Promise.reject(napaka) });
  const server = app.listen(0);
  try {
    const r = await fetch(`http://127.0.0.1:${server.address().port}/api/students/1/scan/solve`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: "x^2=4" }) });
    const body = await r.json();
    assert.ok(r.status >= 500, `status ${r.status}`);
    assert.equal(body.solution, undefined);
    assert.equal(body.status, undefined);
  } finally {
    server.close();
  }
  // b) prvi poskus je napačen, ponovitev pade (izpad modela): ostane prvi poskus z izidom preverjanja kode, ne višji
  const verify = (sol) => verifyAiFull("x^2=4", sol, { cas: false });
  let klici = 0;
  const ask = async () => {
    if (klici++) throw napaka;
    return { sol: { kind: "equation", variable: "x", solutions: ["2"] }, usage: {} };
  };
  const { check } = await solveWithRetries({ ask, verify });
  assert.equal(klici, 2, "ponovitev je bila poskušena");
  assert.equal(check.status, "wrong", "manjkajoča rešitev −2 ostane napaka");
  assert.equal(check.verified, false);
});
