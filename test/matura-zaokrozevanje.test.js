// Maturitetni generatorji MAT: vsak izpisani številski korak rešitve (»a · b ≈ c«) se mora izračunati iz izpisanih
// števil na pol enote zadnjega mesta natančno, izpisani rezultati pa se ne smejo za eno ali dve enoti zadnjega mesta
// razlikovati od ocenjenega odgovora. Prej je npr. »G_0 = 9700/1,215506 ≈ 7980,21« dalo dijaku 7980,22, odgovor
// 7980,21 pa je preverjanje označilo z »Zaokrožil si v napačno smer« (revizija #5). Pomoč: test/matura-koraki-pomoc.js.
import test from "node:test";
import assert from "node:assert/strict";
import { MATURA_MAT, naloga, neskladni, skorajOdgovor, koraki, besedilo, formule } from "./matura-koraki-pomoc.js";
import { decimalke, ap } from "../server/practice/generators/matura-util.js";

// Generatorji, kjer so vmesni rezultati prej imeli premalo mest ali rezultat pade na mejo zaokrožanja: več semen
// (napake pri približkih so se pokazale šele pri semenih 600–2800).
const PRIZADETI = ["anuitete", "posevna-telesa-vrtenine", "premice-ravnine", "matura-telesa", "priblizki-napake", "iracionalne-enacbe"];
const semena = (g) => (PRIZADETI.some((p) => g.id.endsWith(p)) ? 3200 : 100);

const NALOGE = [];
for (const g of MATURA_MAT) {
  for (const level of [1, 2, 3]) {
    for (let seed = 1; seed <= semena(g); seed++) {
      const t = naloga(g, level, seed);
      if (t) NALOGE.push(t);
    }
  }
}
const naloge = () => NALOGE;
const kje = (t) => `${t.generator} L${t.level} s${t.seed}`;

test("rešitve: vsak čisto številski korak se izide iz izpisanih števil, noben izpisan rezultat ni za zadnjo števko mimo odgovora", () => {
  const napake = [];
  let n = 0;
  let k = 0;
  const poGen = {};
  for (const t of naloge()) {
    n++;
    const ks = koraki(t).length;
    k += ks;
    poGen[t.generator] = (poGen[t.generator] || 0) + ks;
    for (const s of neskladni(t)) napake.push(`${kje(t)}: ${s.tex} (izračun ${s.a.value}, izpisano ${s.b.value})`);
    for (const b of skorajOdgovor(t)) napake.push(`${kje(t)}: izpisano ${b.tex}, odgovor ${t.answer.value} (${t.answer.decimals} dec.)`);
  }
  assert.ok(n > 10000, `${n} nalog`);
  assert.ok(k > 10000, `preračunanih korakov: ${k}`);
  // Preverjanje res zajame prizadete generatorje (sicer bi sprememba zapisa tiho izklopila test).
  for (const p of ["anuitete", "posevna-telesa-vrtenine", "premice-ravnine", "matura-telesa"]) {
    const id = Object.keys(poGen).find((x) => x.endsWith(p));
    assert.ok(id && poGen[id] >= 200, `${p}: preračunanih korakov ${id ? poGen[id] : 0}`);
  }
  assert.deepEqual(napake.slice(0, 20), [], `${napake.length} neskladnih korakov`);
});

test("pomoč: zazna prejšnje napake (premalo mest v vmesnem rezultatu, verigo čez dve vrstici)", () => {
  const t = (solution, value = 7980.22, decimals = 2) => ({ solution, answer: { type: "number", value, decimals } });
  // Prej v anuitetah: 9700/1,215506 = 7980,2156…, izpisano 7980,21.
  assert.equal(neskladni(t("$G_0 = \\dfrac{9700}{1{,}215506} \\approx 7980{,}21$ €")).length, 1);
  assert.equal(neskladni(t("$G_0 = \\dfrac{9700}{1{,}21550625} \\approx 7980{,}21$ €")).length, 0);
  // Posevna telesa: π · 2² · 4,532 = 56,95…, izpisano 56,9.
  assert.equal(neskladni(t("$V = \\pi \\cdot 2^2 \\cdot 4{,}532 \\approx 56{,}9\\ \\mathrm{cm^3}$", 56.9, 1)).length, 1);
  // Veriga čez vrstici z isto levo stranjo.
  assert.equal(neskladni(t("$D_{3} \\approx 7000{,}00 - 1234{,}56$\n$D_{3} \\approx 5765{,}45$ €")).length, 1);
  assert.equal(neskladni(t("$D_{3} \\approx 7000{,}00 - 1234{,}56$\n$D_{3} \\approx 5765{,}44$ €")).length, 0);
  // Izjave in pretvorbe niso računi; zaokrožitev na tisočice je.
  assert.equal(koraki(t("Enakost $0 = -2$ ni resnična; $r = 20\\ \\mathrm{cm} = 0{,}2\\ \\mathrm{m}$")).length, 0);
  assert.equal(neskladni(t("$22758 \\approx 23000$", 23000, null)).length, 0);
  // Izpisan rezultat, ki je za cent mimo odgovora.
  assert.equal(skorajOdgovor(t("$G_0 \\approx 7980{,}21$ €")).length, 1);
  assert.equal(skorajOdgovor(t("$G_0 \\approx 7980{,}22$ €")).length, 0);
  // Druga količina z drugo enoto (r = 12,5 cm pri odgovoru 12,3 l) ni zgrešen odgovor.
  assert.equal(skorajOdgovor({ solution: "$r = 12{,}5\\ \\mathrm{cm}$", answer: { type: "number", value: 12.3, decimals: 1, unit: "l" } }).length, 0);
  // decimalke: nikoli manj kot d mest, null, ko nobeno število mest ne zadošča; ap: »=« le pri natančni vrednosti.
  assert.equal(decimalke(1.21550625, 6, (x) => 9700 / x, 2), 7); // 9700/1,215506 ≈ 7980,2156 → 7 mest
  assert.equal(decimalke(2, 6, (x) => x, 2), 6);
  assert.equal(decimalke(1 / 3, 2, (x) => x * 3, 5, 3), null);
  assert.equal(ap(1.025 ** 5, 9), "\\approx");
  assert.equal(ap(1.055 ** 3, 9), "=");
});

// »1x«, »- 1m«, »x^{1}«: koeficient 1 in potenco 1 pišemo brez enice (revizija #5: odvedljivost, vsota potenc).
const KOEF_1 = /(?<![\d}.,\\_^{])1[a-zA-Z](?![a-zA-Z])/;
// Tudi število ali oklepaj na potenco 1 (»3700 · 1,03^{1}«, »0,6^{1}«); izjema so mestne vrednosti v dvojiškem
// zapisu (2^5 + 2^3 + 2^1 + 2^0), kjer je 2^1 namenoma zapisan.
const POTENCA_1_SPREMENLJIVKE = /[a-zA-Z\d})]\^\{?1\}?(?![\d.,{])/;
const IZJEME_POTENCA_1 = ["dvojiski-sestav"];
const POTENCA_1 = /(?<!_(?:\{[^{}]*\}|\w))\^\{?1\}?(?![\d.,{])/; // meja integrala \int_{-1}^{1} ni potenca

test("besedila: brez koeficienta 1 (»1x«) in brez potence 1 (»x^{1}«)", () => {
  const napake = [];
  for (const t of naloge()) {
    for (const f of formule(t.text)) if (POTENCA_1.test(f)) napake.push(`${kje(t)} (besedilo): ${f}`);
    for (const f of formule(besedilo(t))) {
      const pot1 = POTENCA_1_SPREMENLJIVKE.test(f.replace(/_(?:\{[^{}]*\}|\w)\^\{?1\}?/g, "")) && !IZJEME_POTENCA_1.some((x) => t.generator.endsWith(x));
      if (KOEF_1.test(f) || pot1) napake.push(`${kje(t)}: ${f}`);
    }
  }
  assert.deepEqual(napake.slice(0, 20), [], `${napake.length} zapisov z odvečno enico`);
  assert.ok(KOEF_1.test("\\lvert x^3 - 1x \\rvert") && POTENCA_1.test("koeficient pri x^{1}") && !POTENCA_1.test("\\int_{-1}^{1} x\\,dx"));
  assert.ok(POTENCA_1_SPREMENLJIVKE.test("3700 \\cdot 1{,}03^{1}") && POTENCA_1_SPREMENLJIVKE.test("\\right)^{1}") && !POTENCA_1_SPREMENLJIVKE.test("x^{12}"));
});
