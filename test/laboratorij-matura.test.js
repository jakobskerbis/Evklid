// Maturitetni poskus (public/sim/lab-matura.js, lab-matura-naloge.js, matura/*.js; načrt laboratorija, faza 3).
// 1) brez brskalnika: vsaka naloga je popolna (10 točk, prava enota prva), točkovanje rezultata, enote in napake;
//    toleranca je umerjena s simulacijo skrbnega dijaka v modelu poskusa;
// 2) v pravem brskalniku (Playwright, če je nameščen): »Matura« začne nalogo z novim vzorcem, med nalogo so izračunani
//    rezultati skriti, oddaja prave vrednosti da vse točke za rezultat, enoto in napako, meritve štejejo iz dnevnika.
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { MATURA } from "../public/sim/lab-matura-naloge.js";
import { oceni, tockeRezultata, TOCKE } from "../public/sim/lab-matura.js";
import { KORAKI } from "../public/sim/lab-vodeno-koraki.js";
import { ENGINES } from "../public/sim/index.js";
import { TitrBench, NAOH_C, PIPETA } from "../public/sim/lab-model-titracija.js";
// Naloge s simulacijo in igro v svoji datoteki (test/matura/<ključ>.js): testi brez brskalnika se registrirajo ob uvozu.
import * as maturaHooke from "./matura/lab-hooke.js";
import * as maturaLom from "./matura/lab-lom.js";
import * as maturaGrelnik from "./matura/lab-grelnik.js";
import { Co2Bench, M as MOL } from "../public/sim/lab-model.js";
import { TiosulfatBench, reakcijskiCas } from "../public/sim/lab-model-reakcije.js";
import { ElektrolizaBench, barometerRead } from "../public/sim/lab-model-elektrokemija.js";

test("every matura task is complete: 10 points, the right unit first, a calibrated tolerance", () => {
  for (const [key, def] of Object.entries(MATURA)) {
    assert.ok(KORAKI[key] && ENGINES[key], `${key}: matura le pri vodenem poskusu`);
    for (const f of ["naslov", "naloga", "kolicina"]) assert.ok(def[f]?.length > 2, `${key}: manjka ${f}`);
    assert.ok(def.naloga.length > 60, `${key}: naloga prekratka`);
    assert.equal(def.enote[0][1], 1, `${key}: prva enota je prava (faktor 1)`);
    assert.ok(def.enote.some((e) => e[1] == null), `${key}: med enotami je vsaj ena napačna količina`);
    assert.ok(def.tol > 0 && def.tol <= 0.1, `${key}: toleranca ${def.tol}`);
    assert.equal(typeof def.resnica, "function");
    assert.equal(def.meritve.reduce((a, m) => a + m.tock, 0), 4, `${key}: meritve skupaj 4 točke`);
    for (const m of def.meritve) assert.ok(m.kaj.length > 5 && typeof m.ok === "function");
    // Izbirniki za skrivanje so v motorju (razred brez pike).
    const motor = fs.readFileSync(`public/sim/${ENGINES[key][0]}`, "utf8");
    for (const s of def.skrij || []) assert.ok(motor.includes(s.replace(/^\./, "")), `${key}: izbirnika ${s} ni v motorju`);
    // Motor izpostavi model, iz katerega naloga bere pravo vrednost.
    assert.match(motor, /el\._labBench = /, `${key}: motor ne izpostavi modela (el._labBench)`);
  }
});

test("scoring: result by relative error, unit, measurement uncertainty", () => {
  assert.equal(tockeRezultata(0.01, 0.025), 4);
  assert.equal(tockeRezultata(0.025, 0.025), 4);
  assert.equal(tockeRezultata(0.04, 0.025), 3);
  assert.equal(tockeRezultata(0.07, 0.025), 2);
  assert.equal(tockeRezultata(0.12, 0.025), 1);
  assert.equal(tockeRezultata(0.2, 0.025), 0);
  assert.equal(tockeRezultata(NaN, 0.025), 0);
  const def = { tol: 0.025, enote: [["mol/L", 1], ["mmol/L", 1e-3], ["g/L", null]], meritve: [{ kaj: "a", tock: 3, ok: () => true }, { kaj: "b", tock: 1, ok: () => { throw new Error("x"); } }] };
  const r = oceni(def, { rezultat: "0,0985", enota: "mol/L", napaka: "0,0010" }, 0.0978, {});
  assert.equal(r.max, 10);
  assert.equal(r.tocke, 3 + 4 + 1 + 1, "meritev b (napaka v ok) ne šteje");
  assert.equal(TOCKE.rezultat + TOCKE.enota + TOCKE.napaka, 6);
  // mmol/L se pretvori; g/L je napačna količina: ni točk za rezultat, enoto in napako.
  assert.equal(oceni(def, { rezultat: "98,5", enota: "mmol/L", napaka: "1,0" }, 0.0978, {}).tocke, 9);
  const gl = oceni(def, { rezultat: "3,59", enota: "g/L", napaka: "0,1" }, 0.0978, {});
  assert.deepEqual(gl.postavke.slice(2).map((p) => p.tock), [0, 0, 0]);
  // Napaka: prava vrednost mora biti v intervalu, interval ne sme biti nesmiselno širok.
  const nap = (n) => oceni(def, { rezultat: "0,0985", enota: "mol/L", napaka: n }, 0.0978, {}).postavke.at(-1).tock;
  assert.equal(nap("0,0005"), 0, "prava vrednost ni v intervalu");
  assert.equal(nap(""), 0, "brez napake");
  assert.equal(nap("0,02"), 0, "napaka 20 % je prevelika");
  assert.equal(nap("0,0008"), 1);
  assert.equal(oceni(def, { rezultat: "abc", enota: "mol/L", napaka: "" }, 0.0978, {}).postavke[2].tock, 0);
  // izMeritev: rezultat mora izhajati iz učenčevih meritev (do 2·tol), sicer znana vrednost brez meritev ne šteje.
  const dm = (v) => ({ ...def, izMeritev: () => v });
  const rz = (d, x = "0,0985") => oceni(d, { rezultat: x, enota: "mol/L", napaka: "0,0010" }, 0.0978, {});
  assert.equal(rz(dm(0.0990)).postavke[2].tock, 4, "iz meritev 0,0990: ujema se");
  assert.equal(rz(dm(0.0920)).postavke[2].tock, 0, "iz meritev 0,0920: rezultat ni iz meritev");
  assert.match(rz(dm(0.0920)).postavke[2].opomba, /ne ujema s tvojimi meritvami/);
  assert.equal(rz(dm(NaN)).postavke[2].tock, 0, "brez meritev");
  assert.equal(rz(dm(0.0990)).mer, 0.099);
});

test("titration matura: measurement criteria read the log and the table", () => {
  const t = MATURA["lab-titracija"];
  const ok = (dn, vrstice = []) => t.meritve.map((m) => m.ok({ dnevnik: dn, vrstice }));
  const SPR = "Bireto si trikrat spral z raztopino NaOH.", NAP = "Bireto si z lijakom napolnil.", ZR = "Odprl si pipo: zračni mehurček je odšel iz konice.";
  const PIP = "S propipeto si v polnilno pipeto posrkal vzorec do oznake in ga izpustil v erlenmajerico: 25,00 mL. Vzorec: klorovodikova kislina HCl.";
  const MOK = "Pipeta je bila še mokra od pomivanja z vodo: voda v njej je vzorec malo razredčila.";
  const r = (V, vz = "HCl") => ({ vzorec: vz, indikator: "fenolftalein", "V [mL]": V });
  assert.deepEqual(ok([SPR, NAP, ZR, PIP], [r("20,00"), r("20,05")]), [true, true, true, true]);
  assert.deepEqual(ok([NAP, SPR, NAP, ZR, PIP]), [false, true, true, false], "prvo polnjenje brez spiranja");
  assert.deepEqual(ok([SPR, NAP, MOK, PIP, PIP]).slice(0, 3), [true, false, false], "brez zraka, mokra pipeta");
  assert.equal(ok([], [r("20,00"), r("20,05", "CH₃COOH")])[3], false, "ujemata se le titraciji HCl");
  // Iz meritev: povprečje ujemajočih se titracij HCl (groba prva titracija ne šteje).
  assert.ok(Math.abs(t.izMeritev({ vrstice: [r("21,40"), r("20,00"), r("20,10")] }) - (0.1 * 20.05) / 25) < 1e-12);
  assert.ok(Number.isNaN(t.izMeritev({ vrstice: [r("20,00"), r("20,30")] })), "brez ujemanja");
});

// Toleranca titracije: skrben dijak v modelu (spiranje, brez zraka, pravilna pipeta, po kapljicah do obstojne barve,
// odčitek na 0,05 mL) mora biti v 95 % vzorcev znotraj tol, sicer bi tudi brezhibno delo izgubljalo točke.
test("titration tolerance: a careful student lands within tol in at least 95 % of samples", () => {
  const t = MATURA["lab-titracija"];
  const pol = (x) => Math.round(x / 0.05) * 0.05;
  let v = 0;
  const N = 500;
  for (let s = 1; s <= N; s++) {
    const B = new TitrBench({ seed: s * 7919 });
    B.goggles = true;
    B.rinse();
    B.fill();
    B.purge();
    B.pipette("hcl");
    B.addIndicator("fenolftalein");
    const R1 = pol(B.reading());
    while (!B.endSeen() && B.bur.u < 50) B.drop();
    const c = (NAOH_C * (pol(B.reading()) - R1)) / PIPETA.V;
    const prava = t.resnica(B);
    assert.ok(prava >= 0.08 && prava <= 0.12);
    if (Math.abs(c - prava) / prava <= t.tol) v++;
  }
  assert.ok(v / N >= 0.95, `le ${v}/${N} znotraj ${t.tol * 100} %`);
});

// ---- lab-co2, lab-hitrost, lab-elektroliza (public/sim/matura/<ključ>.js): meritve in umeritev tolerance.
// Kontekst kot lab-vodeno.js → kontekst: dnevnik (NBSP je že navaden presledek), vrstice tabele, nastavitve.
const kont = (dnevnik, vrstice = [], par = {}) => ({ dnevnik, vrstice, par: (ime) => par[ime] ?? "" });
const deleZnotraj = (n, f) => {
  let v = 0;
  for (let s = 1; s <= n; s++) if (f(s)) v++;
  return v / n;
};

test("CO₂ matura: measurement criteria read the log and the table", () => {
  const t = MATURA["lab-co2"];
  const ok = (dn, vrstice = [], par = { zamašek: "brez zamaška" }) => t.meritve.map((m) => m.ok(kont(dn, vrstice, par)));
  const OC = "Nadel si si zaščitna očala.", KIS = (V) => `Z merilnim valjem si v bučko nalil ${V} mL. Tekočina: kis (5 % ocetna kislina).`;
  const HCL = (V) => `Z merilnim valjem si v bučko nalil ${V} mL. Tekočina: klorovodikova kislina, 1 mol/L.`;
  const M0 = "Začetna masa bučke s snovmi: 107,45 g. Štoparica teče.";
  const PREL = "Pena je prelila bučko! Del raztopine je stekel po mizi, zato je tudi izguba mase prevelika. Vzemi manj snovi.";
  const r = (ts) => ({ "t [s]": ts, "m [g]": "106,95", "Δm [g]": "-0,50", apnica: "–" });
  assert.deepEqual(ok([OC, KIS(30), M0], [r("10,0"), r("150,0"), r("300,0")]), [true, true, true, true]);
  assert.deepEqual(ok([KIS(30), OC, M0], [r("10,0"), r("150,0"), r("290,0")]), [false, true, true, false], "očala po kislini, zapis le 290 s");
  assert.deepEqual(ok([OC, KIS(15), M0, PREL]).slice(1, 3), [false, false], "15 mL kisa je premalo, pena je prelila bučko");
  assert.deepEqual(ok([OC, HCL(20), KIS(5)]).slice(1, 3), [true, true], "20 mL HCl in 5 mL kisa sta dovolj");
  assert.equal(ok([OC, KIS(30)], [], { zamašek: "zamašek s cevko" })[2], false, "bučka mora biti odprta");
  assert.equal(ok([OC, KIS(30)], [r("300,0"), r("310,0")])[3], false, "vsaj tri meritve");
  // Priprava stresi vzorec v prazno bučko (brez vrstice v dnevniku); prava vrednost je masa vzorca, ne vsa soda.
  const B = new Co2Bench({ seed: 5 });
  t.priprava({ _labBench: B });
  assert.ok(B.vzorec >= 0.79 && B.vzorec <= 1.41 && B.soda > 0 && B.t0 == null);
  B.addSoda(0.5);
  assert.equal(t.resnica(B), B.vzorec);
  assert.equal(t.resnica(new Co2Bench({ seed: 5 })), 0, "brez vzorca (Ponastavi) šteje soda v bučki");
});

// Skrben dijak: 30 mL kisa na vzorec, bučka odprta, končna masa 5 minut po začetku reakcije.
test("CO₂ tolerance: a careful student lands within tol in at least 95 % of samples", () => {
  const t = MATURA["lab-co2"];
  const N = 500;
  const delez = deleZnotraj(N, (s) => {
    const B = new Co2Bench({ seed: s * 7919 });
    t.priprava({ _labBench: B });
    const prava = t.resnica(B);
    assert.ok(prava >= 0.79 && prava <= 1.41);
    B.step(5);
    B.pour("kis", 30);
    const m0 = B.readMass();
    while (B.t - B.t0 < 300) B.step(0.5);
    assert.equal(B.spilled, 0, "30 mL kisa se ne preliva");
    const m = ((m0 - B.readMass()) * MOL.NaHCO3) / MOL.CO2;
    return Math.abs(m - prava) / prava <= t.tol;
  });
  assert.ok(delez >= 0.95, `le ${(delez * 100).toFixed(1)} % znotraj ${t.tol * 100} %`);
});

test("reaction-rate matura: measurement criteria read the thiosulfate log and table", () => {
  const t = MATURA["lab-hitrost"];
  const PRIP = (V, T) => `V bučki je ${V} mL raztopine tiosulfata in ${50 - V} mL vode${T ? `, segreto na ${T} °C` : ""}.`;
  const PRIL = "Prilil si 5 mL HCl in zagnal štoparico. Glej od zgoraj, kdaj križ izgine. Diši po SO₂ – delaj v zračnem prostoru.";
  const KRIZ = (s) => `Križ je izginil po ${s} s.`;
  const ZGODAJ = "Križ je še precej viden (prosojnost 30 %). Prezgodaj si ustavil; tak čas je prekratek.";
  const MOTNA = "Raztopina je že povsem motna. Ustavi štoparico: zamujen čas je napaka meritve.";
  // Ena meritev: dnevnik (priprava, prilivanje, čas) in vrstica tabele s temperaturo.
  const mer = (V, T, s, kopel, napaka) => ({ dn: [PRIP(V, kopel), PRIL, ...(napaka ? [napaka] : []), KRIZ(s)], r: { "c(S₂O₃²⁻) [mol/L]": "0,147", "T [°C]": T, "t [s]": s, "1/t [10⁻³ s⁻¹]": "22,1" } });
  const ok = (...ms) => t.meritve.map((m) => m.ok(kont(["Nadel si si zaščitna očala.", ...ms.flatMap((x) => x.dn)], ms.map((x) => x.r), { poskus: "tiosulfat (križ)" })));
  const lepo = [mer(50, "22,0", "45,2"), mer(50, "22,1", "44,6"), mer(50, "39,8", "11,3", 40), mer(50, "39,7", "11,5", 40)];
  assert.deepEqual(ok(...lepo), [true, true, true, true]);
  assert.deepEqual(ok(mer(50, "22,0", "45,2"), mer(50, "22,1", "44,6"), mer(50, "32,9", "24,0", 33), mer(50, "32,8", "24,3", 33)), [false, true, true, true], "le 10 °C razlike");
  assert.deepEqual(ok(mer(50, "22,0", "45,2"), mer(40, "22,1", "56,0"), mer(50, "39,8", "11,3", 40), mer(50, "39,7", "11,5", 40)).slice(1, 3), [false, false], "dve raztopini, pri sobni temperaturi ena meritev z 50 mL");
  assert.equal(ok(mer(50, "22,0", "45,2"), mer(50, "22,1", "40,0"), ...lepo.slice(2))[2], false, "časa se ne ujemata na 5 %");
  assert.deepEqual(ok(...lepo.slice(0, 3), mer(50, "39,7", "13,9", 40, MOTNA)).slice(2), [false, false], "prepozno ustavljena meritev ne šteje");
  assert.equal(ok(mer(50, "22,0", "40,1", 0, ZGODAJ), ...lepo)[3], false, "prezgodaj ustavljeno");
  // Tabela je pri drugem poskusu (marmor) skrita: meritve tiosulfata ne štejejo.
  assert.deepEqual(t.meritve.map((m) => m.ok(kont(lepo.flatMap((x) => x.dn), lepo.map((x) => x.r), { poskus: "marmor + HCl (masa)" }))), [false, false, false, false]);
  assert.equal(t.resnica({ tio: new TiosulfatBench({ seed: 3 }) }), 52);
});

// Skrben dijak: 50 mL raztopine, dvakrat pri sobni temperaturi in dvakrat v kopeli pri 40 °C, ustavi ob izginotju križa
// (z reakcijskim časom, kot ga ima motor), povprečna časa in temperaturi z 0,1 natančnostjo kot v tabeli.
test("reaction-rate tolerance: a careful student's activation energy lands within tol in at least 95 % of samples", () => {
  const t = MATURA["lab-hitrost"];
  const meri = (B) => {
    B.pripravi(50);
    B.zlij(2);
    B.zazeni();
    while (B.kriz == null) B.step(0.05);
    const tk = B.kriz + reakcijskiCas(B.r);
    while (B.t < tk - 1e-9) B.step(Math.min(0.05, tk - B.t));
    return { t: Math.round(B.ustavi(0) * 10) / 10, T: Math.round(B.T * 10) / 10 + 273.15 };
  };
  const avg = (x, k) => x.reduce((s, y) => s + y[k], 0) / x.length;
  const delez = deleZnotraj(500, (s) => {
    const B = new TiosulfatBench({ seed: s * 7919 + 1 });
    B.ocala = true;
    const a = [meri(B), meri(B)];
    B.kopel(40);
    const b = [meri(B), meri(B)];
    assert.ok(avg(b, "T") - avg(a, "T") >= 15, "kopel pri 40 °C je vsaj 15 °C toplejša");
    const Ea = (8.314 * Math.log(avg(a, "t") / avg(b, "t"))) / (1 / avg(a, "T") - 1 / avg(b, "T")) / 1000;
    const prava = t.resnica({ tio: B });
    return Math.abs(Ea - prava) / prava <= t.tol;
  });
  assert.ok(delez >= 0.95, `le ${(delez * 100).toFixed(1)} % znotraj ${t.tol * 100} %`);
});

test("electrolysis matura: measurement criteria read the log and the table", () => {
  const t = MATURA["lab-elektroliza"];
  const NAL = "V aparat si natočil tekočino: razredčena žveplova(VI) kislina 0,5 mol/L. Ko je tekočina do pip, pipi zapri.";
  const UJET = "Natočil si tekočino (razredčena žveplova(VI) kislina 0,5 mol/L), a obe pipi sta bili zaprti: zrak je ostal ujet v cevi. Odpri pipo, da zrak uide, in jo nato zapri.";
  const NA2SO4 = "V aparat si natočil tekočino: raztopina natrijevega sulfata 0,5 mol/L. Ko je tekočina do pip, pipi zapri.";
  const VKL = "Napajalnik je vklopljen.", MEH = "Na elektrodah se pojavijo mehurčki (napetost na aparatu 2,95 V, tok 118,4 mA).";
  const H2 = "Plin ob goreči trski poči (pisk): v cevi je vodik.", O2 = "Tleča trska se znova vžge: v cevi je kisik.";
  const VAR = "Varovalka v ampermetru je pregorela (tok 0,25 A, vhod mA zdrži 0,2 A). Uporabi vtičnico 10A ali manjšo omejitev toka in zamenjaj varovalko.";
  const zaprti = { "pipa levo odprta": "ne", "pipa desno odprta": "ne" };
  const r = (s, I, Vk) => ({ "t [s]": s, "I [mA]": I, "V katoda (−) [mL]": Vk, "V anoda (+) [mL]": "5,0" });
  const tab = [r("300", "118,9", "6,9"), r("600", "119,1", "13,9"), r("900", "119,2", "21,0")];
  const ok = (dn, vrstice = tab, par = zaprti) => t.meritve.map((m) => m.ok(kont(dn, vrstice, par)));
  assert.deepEqual(ok([NAL, VKL, MEH, H2, O2]), [true, true, true, true]);
  assert.deepEqual(ok([UJET, VKL, MEH, H2]), [false, true, true, false], "ujet zrak, kisik ni dokazan");
  assert.equal(ok([NA2SO4, VKL, H2, O2])[0], false, "elektrolit ni žveplova(VI) kislina");
  assert.equal(ok([NAL], tab, { ...zaprti, "pipa desno odprta": "da" })[0], false, "pipa odprta");
  assert.deepEqual(ok([NAL, VAR], tab).slice(1, 3), [false, true], "pregorela varovalka");
  assert.deepEqual(ok([NAL], [r("300", "118,9", "6,9"), r("600", "119,1", "13,9"), r("900", "0,0", "13,9")]).slice(1, 3), [false, false], "tok 0 ne šteje, premalo vodika");
  assert.equal(ok([H2, O2, NAL])[3], false, "dokaz iz prejšnjega polnjenja ne šteje");
  assert.equal(Math.round(t.resnica(new ElektrolizaBench({ seed: 1 }))), 96485);
});

// Skrben dijak: 0,5 mol/L H₂SO₄ z odprtima pipama, pipi zaprti, 5–8 V; vsako minuto odčita tok, ko je na katodi vsaj
// 20 mL, odčita čas, prostornino, barometer in termometer; parni tlak interpolira iz tabele v nalogi.
test("electrolysis tolerance: a careful student's Faraday constant lands within tol in at least 95 % of samples", () => {
  const t = MATURA["lab-elektroliza"];
  const PW = [[20, 2.33], [22, 2.64], [24, 2.97], [26, 3.35], [28, 3.77]];
  const pw = (T) => {
    const i = Math.max(0, Math.min(PW.length - 2, PW.findIndex((x) => x[0] > T) - 1));
    const [[a, pa], [b, pb]] = [PW[i], PW[i + 1]];
    return (pa + ((pb - pa) * (T - a)) / (b - a)) * 1000;
  };
  const delez = deleZnotraj(500, (s) => {
    const B = new ElektrolizaBench({ seed: s * 7919 });
    B.napolni("h2so4", 0.5);
    B.odpriPipo(0, false);
    B.odpriPipo(1, false);
    B.U = 5 + (s % 4);
    B.vklop = true;
    let cas = 0;
    const I = [];
    while (!(B.odcitek(B.katoda).value >= 20)) B.step(60), (cas += 60), I.push(B.readA().value / 1000);
    const V = B.odcitek(B.katoda).value, p = barometerRead(B.lab.p, B.r) * 1000, T = B.readT().value;
    assert.ok(T < 28, "tekočina se ne segreje nad tabelo v nalogi");
    const n = ((p - pw(T)) * V * 1e-6) / (8.314 * (T + 273.15));
    const Fx = ((I.reduce((a, b) => a + b, 0) / I.length) * cas) / (2 * n);
    return Math.abs(Fx - t.resnica(B)) / t.resnica(B) <= t.tol;
  });
  assert.ok(delez >= 0.95, `le ${(delez * 100).toFixed(1)} % znotraj ${t.tol * 100} %`);
});

// ---------------------------------------------------------------- v brskalniku
const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
let browser = null;
before(async () => {
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
});
after(() => browser?.close());

const PUB = path.resolve("public");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/lab.css"><link rel="stylesheet" href="/textbook.css">
<main id="v" class="lab-view"><section class="card lab-bench"><div id="m"></div></section></main>
<script type="module">
import { mountSim } from "/sim/index.js";
import { vodi } from "/sim/lab-vodeno.js";
const m = document.getElementById("m");
window.m = m;
window.wait = (ms) => new Promise((r) => setTimeout(r, ms));
window.dokler = async (f, ms = 15000) => {
  const t0 = performance.now();
  while (!f()) {
    if (performance.now() - t0 > ms) throw new Error("ni dočakal: " + f.toString().slice(0, 80));
    await wait(50);
  }
};
const txt = (e) => (e?.textContent || "").replace(/\\s+/g, " ").trim();
window.txt = txt;
window.dogodki = [];
window.mount = async (id, nacin) => {
  await mountSim(id, m, {});
  window.vod = vodi(m, id, { nacin, onMatura: (d, o) => dogodki.push([d, o?.tocke]) });
  await wait(100);
};
// Gumb v kartici (vodenje) ali v poskusu.
window.gumb = async (t, vKartici = false) => {
  const b = [...m.querySelectorAll("button")].find((x) => !!x.closest(".lab-vod-wrap") === vKartici && txt(x).startsWith(t) && !x.disabled);
  if (!b) throw new Error("ni gumba " + t);
  b.click();
  await wait(150);
};
window.stikalo = async (t) => {
  const c = [...m.querySelectorAll(".demo-check")].find((x) => txt(x).startsWith(t))?.querySelector("input");
  if (!c) throw new Error("ni stikala " + t);
  if (!c.checked) c.click();
  await wait(120);
};
window.oddaj = async (rez, enota, nap) => {
  const k = m.querySelector(".lab-mat");
  k.querySelector('input[aria-label^="rezultat"]').value = rez;
  k.querySelector("select").value = enota;
  k.querySelector('input[aria-label^="napaka"]').value = nap;
  await gumb("Oddaj rezultat", true);
};
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t-mat.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

test("in a browser: the titration matura task from start to points", async (t) => {
  if (!browser) return t.skip("Playwright ni nameščen");
  const server = await serve();
  const page = await browser.newPage({ viewport: { width: 360, height: 740 }, locale: "sl-SI" });
  const napake = [];
  page.on("pageerror", (e) => napake.push(e.message));
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/t-mat.html`);
    await page.waitForFunction(() => window.ready);
    await page.evaluate(() => mount("lab-titracija", "vodeno"));
    // Izbira načina ima tri gumbe; »Matura« pokaže uvod naloge, kartica korakov je skrita.
    const nacini = await page.evaluate(() => [...m.querySelectorAll(".lab-vod-nacin .seg-btn")].map(txt));
    assert.deepEqual(nacini, ["Vodeno", "Prosto", "Matura"]);
    await page.evaluate(() => [...m.querySelectorAll(".lab-vod-nacin .seg-btn")].find((b) => txt(b) === "Matura").click());
    await page.evaluate(() => wait(200));
    let s = await page.evaluate(() => ({ korak: m.querySelector(".lab-vod:not(.lab-mat)")?.hidden, mat: !m.querySelector(".lab-mat")?.hidden, naslov: txt(m.querySelector(".lab-mat h3")) }));
    assert.deepEqual(s, { korak: true, mat: true, naslov: "Koncentracija klorovodikove kisline" });

    // Začni nalogo: nov vzorec (novo seme), vzorec ostane HCl.
    await page.evaluate(() => gumb("Začni nalogo", true));
    await page.evaluate(() => dokler(() => m.querySelector(".lab-mat .lab-mat-polja")));
    const zdaj = await page.evaluate(() => m._labBench.c.hcl);
    assert.ok(zdaj >= 0.08 && zdaj <= 0.12);
    assert.deepEqual(await page.evaluate(() => dogodki), [["zacetek", undefined]]);

    // Priprava kot na maturi: očala, spiranje, polnjenje, zrak iz konice, pravilno pipetiranje.
    await page.evaluate(async () => {
      await stikalo("zaščitna očala");
      await gumb("Speri bireto");
      await gumb("Napolni bireto");
      await gumb("Izpusti zrak");
      await stikalo("pipeto prej speri");
      await gumb("Odpipetiraj");
    });
    // Med nalogo je preverjanje koncentracije skrito (pove pravo vrednost).
    const skrito = await page.evaluate(() => [...m.querySelectorAll(".lab-tit-calc")].every((x) => x.classList.contains("lab-mat-skrito")));
    assert.ok(skrito, "»Preveri koncentracijo« je med nalogo skrit");

    // Brez enote: opozorilo, ni oddaje.
    await page.evaluate(() => oddaj("0,1", "", ""));
    assert.match(await page.evaluate(() => txt(m.querySelector(".lab-mat .lab-why"))), /Izberi enoto/);
    // Prava vrednost v mmol/L z napako 1 %, a brez titracij: rezultat ne izhaja iz meritev, zato 0 točk (prava vrednost
    // brez meritev ne šteje); enota 1, napaka 1, meritve 3 od 4 (titraciji se še ne ujemata).
    const prava = await page.evaluate(() => m._labBench.c.hcl);
    const v = (x) => String(x).replace(".", ",");
    await page.evaluate(([a, b]) => oddaj(a, "mmol/L", b), [v((prava * 1000).toFixed(2)), v((prava * 10).toFixed(2))]);
    s = await page.evaluate(() => ({ h: txt(m.querySelector(".lab-mat h3")), li: [...m.querySelectorAll(".lab-mat-ocena li b")].map(txt), skrito: m.querySelectorAll(".lab-mat-skrito").length }));
    assert.equal(s.h, "5 od 10 točk");
    assert.deepEqual(s.li.slice(-3), ["Rezultat: 0/4", "Enota: 1/1", "Napaka meritve: 1/1"]);
    assert.match(await page.evaluate(() => txt(m.querySelector(".lab-mat-ocena"))), /Iz tvojih meritev tega rezultata še ni mogoče izračunati/);
    assert.equal(s.li.find((x) => x.startsWith("Dve titraciji")), "Dve titraciji HCl se ujemata na 0,10 mL: 0/1");
    assert.equal(s.skrito, 0, "po oddaji je vse spet vidno");
    assert.deepEqual(await page.evaluate(() => dogodki.at(-1)), ["oddano", 5]);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("evklid.lab.matura"))["lab-titracija"].tocke), 5);

    // »Nova naloga«: meritve se pobrišejo, dnevnik naloge začne znova (spiranje ne šteje več).
    await page.evaluate(() => gumb("Nova naloga", true));
    await page.evaluate(() => dokler(() => m.querySelector(".lab-mat .lab-mat-polja")));
    await page.evaluate(() => oddaj("0,05", "mol/L", "0,001"));
    s = await page.evaluate(() => [...m.querySelectorAll(".lab-mat-ocena li b")].map(txt));
    assert.equal(s[0], "Bireto si pred polnjenjem spral s titrantom: 0/1");
    // Najboljši rezultat ostane 5.
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("evklid.lab.matura"))["lab-titracija"].tocke), 5);

    // Na telefonu kartica ne povzroči vodoravnega drsenja.
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    // »Prosto« skrije kartico naloge.
    await page.evaluate(() => [...m.querySelectorAll(".lab-vod-nacin .seg-btn")].find((b) => txt(b) === "Prosto").click());
    await page.evaluate(() => wait(200));
    assert.equal(await page.evaluate(() => m.querySelector(".lab-mat").hidden), true);
    assert.deepEqual(napake, []);
  } finally {
    await page.close();
    server.close();
  }
});

// Igre iz test/matura/<ključ>.js: »Matura« → »Začni nalogo« → meritve s kliki kot učenec → med nalogo so izbirniki `skrij`
// skriti → oddaja prave vrednosti (iz m._labBench) s pravo enoto in napako 1 % da vseh 10 točk.
const IGRE = { "lab-hooke": maturaHooke.igra, "lab-lom": maturaLom.igra, "lab-grelnik": maturaGrelnik.igra };
for (const [key, igra] of Object.entries(IGRE))
  test(`in a browser: the ${key} matura task from start to 10 points`, async (t) => {
    if (!browser) return t.skip("Playwright ni nameščen");
    const server = await serve();
    const page = await browser.newPage({ viewport: { width: 360, height: 740 }, locale: "sl-SI" });
    const napake = [];
    page.on("pageerror", (e) => napake.push(e.message));
    try {
      await page.goto(`http://127.0.0.1:${server.address().port}/t-mat.html`);
      await page.waitForFunction(() => window.ready);
      await page.evaluate((k) => mount(k, "vodeno"), key);
      await page.evaluate(() => [...m.querySelectorAll(".lab-vod-nacin .seg-btn")].find((b) => txt(b) === "Matura").click());
      await page.evaluate(() => wait(200));
      assert.equal(await page.evaluate(() => txt(m.querySelector(".lab-mat h3"))), MATURA[key].naslov);
      await page.evaluate(() => gumb("Začni nalogo", true));
      await page.evaluate(() => dokler(() => m.querySelector(".lab-mat .lab-mat-polja")));
      await page.evaluate(`(${igra})()`);
      await page.evaluate(() => wait(800)); // vodenje skrije znova ob vsakem pregledu (lab-vodeno.js → tick)
      // Vsak izbirnik `skrij` (in račun) ima med nalogo vsaj en element in vsi so skriti.
      const skrito = await page.evaluate(async (k) => {
        const { MATURA: M } = await import("/sim/lab-matura-naloge.js");
        return Object.fromEntries([...M[k].skrij, ".lab-racun"].map((s) => [s, [...m.querySelectorAll(s)].filter((x) => !x.closest(".lab-vod-wrap")).map((x) => x.classList.contains("lab-mat-skrito"))]));
      }, key);
      for (const [s, v] of Object.entries(skrito)) assert.ok(v.length && v.every(Boolean), `${key}: ${s} med nalogo ni skrit (${v})`);
      // Oddaja prave vrednosti v pravi enoti z napako 1 %.
      const prava = await page.evaluate(async (k) => (await import("/sim/lab-matura-naloge.js")).MATURA[k].resnica(m._labBench), key);
      assert.ok(Number.isFinite(prava) && prava > 0, `${key}: prava vrednost ${prava}`);
      const v = (x) => String(Number(x.toPrecision(6))).replace(".", ",");
      await page.evaluate(([a, e, b]) => oddaj(a, e, b), [v(prava), MATURA[key].enote[0][0], v(prava * 0.01)]);
      const s = await page.evaluate(() => ({ h: txt(m.querySelector(".lab-mat h3")), li: [...m.querySelectorAll(".lab-mat-ocena li b")].map(txt), skrito: m.querySelectorAll(".lab-mat-skrito").length }));
      assert.deepEqual(s.li.slice(-3), ["Rezultat: 4/4", "Enota: 1/1", "Napaka meritve: 1/1"], `${key}: ${s.li}`);
      assert.deepEqual(s.li.slice(0, -3), MATURA[key].meritve.map((x) => `${x.kaj.replace(/\s+/g, " ")}: ${x.tock}/${x.tock}`), `${key}: meritve`);
      assert.equal(s.h, "10 od 10 točk");
      assert.equal(s.skrito, 0, "po oddaji je vse spet vidno");
      assert.deepEqual(napake, []);
    } finally {
      await page.close();
      server.close();
    }
  });
// ---------------------------------------------------------------- naloge v test/matura/<ključ>.js
// Vsaka datoteka ob uvozu doda svoje preizkuse brez brskalnika (točkovnik, toleranca); privzeti izvoz je igra v brskalniku:
// meritve s kliki v testni strani, vrne pričakovane točke za meritve. Pomočniki za igre: test/matura/_pomoc.js.
const MAT_DIR = new URL("./matura/", import.meta.url);
const MAT_IGRE = {};
for (const f of fs.existsSync(MAT_DIR) ? fs.readdirSync(MAT_DIR).filter((x) => /^lab-.*\.js$/.test(x)).sort() : [])
{
  // Datoteke z imenovanim izvozom `igra` (hooke, lom, grelnik) igra preizkus IGRE zgoraj; tu le privzeti izvoz.
  const igra = (await import(new URL(f, MAT_DIR))).default;
  if (typeof igra === "function") MAT_IGRE[path.basename(f, ".js")] = igra;
}
const { default: matPomoc } = await import(new URL("matura/_pomoc.js", import.meta.url));

test("in a browser: matura tasks from test/matura, real measurements, then the true value scores fully", { timeout: 300000 }, async (t) => {
  if (!browser) return t.skip("Playwright ni nameščen");
  const server = await serve();
  t.after(() => server.close());
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: "sl-SI" });
  t.after(() => page.close());
  const napake = [];
  page.on("pageerror", (e) => napake.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/t-mat.html`);
  await page.waitForFunction(() => window.ready);
  await page.evaluate(`(${matPomoc.toString()})()`);
  for (const [key, igra] of Object.entries(MAT_IGRE)) {
    await t.test(key, async () => {
      const def = MATURA[key];
      await page.evaluate((k) => mount(k, "vodeno"), key);
      await page.evaluate(() => [...m.querySelectorAll(".lab-vod-nacin .seg-btn")].find((b) => txt(b) === "Matura").click());
      await page.evaluate(() => wait(200));
      assert.equal(await page.evaluate(() => txt(m.querySelector(".lab-mat h3"))), def.naslov);
      await page.evaluate(() => gumb("Začni nalogo", true));
      await page.evaluate(() => dokler(() => m.querySelector(".lab-mat .lab-mat-polja")));
      const meritve = await page.evaluate(`(${igra.toString()})()`);
      // Med nalogo so skriti vsi izbirniki naloge (in jih poskus res ima).
      const skrito = await page.evaluate((sel) => sel.map((s) => {
        const e = [...m.querySelectorAll(s)].filter((x) => !x.closest(".lab-vod-wrap"));
        return [s, e.length > 0 && e.every((x) => x.classList.contains("lab-mat-skrito"))];
      }), def.skrij || []);
      for (const [s, ok] of skrito) assert.ok(ok, `${key}: ${s} med nalogo ni skrit`);
      // Prava vrednost iz modela, prava enota, napaka 2·tol: vse točke za rezultat, enoto in napako.
      const prava = await page.evaluate(async (k) => (await import("/sim/lab-matura-naloge.js")).MATURA[k].resnica(m._labBench), key);
      assert.ok(Number.isFinite(prava) && prava > 0, `${key}: prava vrednost ${prava}`);
      const v = (x) => String(x).replace(".", ",");
      await page.evaluate(([a, e, b]) => oddaj(a, e, b), [v(prava.toPrecision(6)), def.enote[0][0], v((prava * def.tol * 2).toPrecision(3))]);
      const s = await page.evaluate(() => ({ h: txt(m.querySelector(".lab-mat h3")), li: [...m.querySelectorAll(".lab-mat-ocena li b")].map(txt), skrito: m.querySelectorAll(".lab-mat-skrito").length }));
      assert.deepEqual(s.li.slice(-3), ["Rezultat: 4/4", "Enota: 1/1", "Napaka meritve: 1/1"], key);
      assert.equal(s.h, `${meritve + 6} od 10 točk`, `${key}: ${s.li.join("; ")}`);
      assert.equal(s.skrito, 0, `${key}: po oddaji je vse spet vidno`);
    });
  }
  assert.deepEqual(napake, []);
});

// Igre drugih nalog v test/matura/<ključ>.js: export default { igra: async () => { … } } teče v testni strani le s kliki
// kot učenec (po »Začni nalogo«); meritve: točke posameznih meritev po igri; novaNeznanka: true, če »Nova naloga« da novo
// pravo vrednost.
const IGRE_OBJ_DIR = new URL("./matura/", import.meta.url);
const IGRE_OBJ = {};
for (const f of fs.existsSync(IGRE_OBJ_DIR) ? fs.readdirSync(IGRE_OBJ_DIR).filter((x) => /^lab-.*\.js$/.test(x)).sort() : [])
{
  // Le datoteke, katerih privzeti izvoz je predmet { igra, meritve, novaNeznanka } (co2, hitrost, elektroliza).
  const d = (await import(new URL(f, IGRE_OBJ_DIR))).default;
  if (d && typeof d === "object" && typeof d.igra === "function") IGRE_OBJ[path.basename(f, ".js")] = d;
}

test("in a browser: other matura tasks hide the result and give full points for the true value", { timeout: 300000 }, async (t) => {
  if (!browser) return t.skip("Playwright ni nameščen");
  const server = await serve();
  t.after(() => server.close());
  const page = await browser.newPage({ viewport: { width: 360, height: 740 }, locale: "sl-SI" });
  t.after(() => page.close());
  const napake = [];
  page.on("pageerror", (e) => napake.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/t-mat.html`);
  await page.waitForFunction(() => window.ready);
  const resnica = (k) => page.evaluate((k) => import(`/sim/matura/${k}.js`).then((d) => d.default.resnica(m._labBench)), k);
  const v = (x) => String(+x.toPrecision(6)).replace(".", ",");
  for (const [key, igra] of Object.entries(IGRE_OBJ)) {
    await t.test(key, async () => {
      const def = MATURA[key];
      await page.evaluate(async (k) => (window.vod?.stop(), await mount(k, "matura")), key);
      assert.equal(await page.evaluate(() => txt(m.querySelector(".lab-mat h3"))), def.naslov);
      await page.evaluate(() => gumb("Začni nalogo", true));
      await page.evaluate(() => dokler(() => m.querySelector(".lab-mat .lab-mat-polja")));
      await page.evaluate(`(${igra.igra.toString()})()`);
      await page.evaluate(() => wait(800)); // kartica ponovi skrivanje ob vsakem pregledu (lab-vodeno.js → tick)
      // Med nalogo so izračunani rezultati in prava vrednost skriti.
      for (const sel of def.skrij || []) {
        const s = await page.evaluate((sel) => [...m.querySelectorAll(sel)].map((x) => x.classList.contains("lab-mat-skrito")), sel);
        assert.ok(s.length > 0 && s.every(Boolean), `${key}: ${sel} med nalogo ni skrit (${s})`);
      }
      // Prava vrednost v pravi enoti z napako tol: vse točke za rezultat, enoto in napako.
      const x = await resnica(key);
      assert.ok(Number.isFinite(x) && x > 0, `${key}: prava vrednost ${x}`);
      await page.evaluate(([a, e, b]) => oddaj(a, e, b), [v(x), def.enote[0][0], v(x * def.tol)]);
      const li = await page.evaluate(() => [...m.querySelectorAll(".lab-mat-ocena li b")].map(txt));
      assert.deepEqual(li.slice(-3), ["Rezultat: 4/4", "Enota: 1/1", "Napaka meritve: 1/1"], `${key}: ${li.join("; ")}`);
      // Točke za meritve po igri (igra.meritve), prebrane iz dnevnika, tabele in nastavitev v pravem brskalniku.
      if (igra.meritve) assert.deepEqual(li.slice(0, def.meritve.length).map((x) => Number(x.match(/(\d+)\/\d+$/)[1])), igra.meritve, `${key}: ${li.join("; ")}`);
      assert.equal(await page.evaluate(() => m.querySelectorAll(".lab-mat-skrito").length), 0, "po oddaji je vse spet vidno");
      // »Nova naloga« postavi poskus znova: nov vzorec (ali ista konstanta modela, kjer je neznanka konstanta).
      await page.evaluate(() => gumb("Nova naloga", true));
      await page.evaluate(() => dokler(() => m.querySelector(".lab-mat .lab-mat-polja")));
      const y = await resnica(key);
      if (igra.novaNeznanka) assert.notEqual(y, x, `${key}: nova naloga ima nov vzorec`);
      else assert.equal(y, x);
    });
  }
  assert.deepEqual(napake, []);
});
