// Maturitetni generatorji MAT: vsak izpisani številski korak rešitve (»a · b ≈ c«) se mora izračunati iz izpisanih
// števil na pol enote zadnjega mesta natančno, izpisani rezultati pa se ne smejo za eno ali dve enoti zadnjega mesta
// razlikovati od ocenjenega odgovora. Prej je npr. »G_0 = 9700/1,215506 ≈ 7980,21« dalo dijaku 7980,22, odgovor
// 7980,21 pa je preverjanje označilo z »Zaokrožil si v napačno smer« (revizija #5). Pomoč: test/matura-koraki-pomoc.js.
import test from "node:test";
import assert from "node:assert/strict";
import { MATURA_MAT, naloga, neskladni, skorajOdgovor, koraki, besedilo, formule } from "./matura-koraki-pomoc.js";

// Generatorji, kjer so vmesni rezultati prej imeli premalo mest: več semen.
const PRIZADETI = ["anuitete", "posevna-telesa-vrtenine", "premice-ravnine", "matura-telesa", "priblizki-napake", "iracionalne-enacbe"];
const semena = (g) => (PRIZADETI.some((p) => g.id.endsWith(p)) ? 300 : 100);

function* naloge() {
  for (const g of MATURA_MAT) {
    for (const level of [1, 2, 3]) {
      for (let seed = 1; seed <= semena(g); seed++) {
        const t = naloga(g, level, seed);
        if (t) yield t;
      }
    }
  }
}
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
});

// »1x«, »- 1m«, »x^{1}«: koeficient 1 in potenco 1 pišemo brez enice (revizija #5: odvedljivost, vsota potenc).
const KOEF_1 = /(?<![\d}.,\\_^{])1[a-zA-Z](?![a-zA-Z])/;
const POTENCA_1_SPREMENLJIVKE = /[a-zA-Z]\^\{?1\}?(?![\d.,{])/;
const POTENCA_1 = /(?<!_(?:\{[^{}]*\}|\w))\^\{?1\}?(?![\d.,{])/; // meja integrala \int_{-1}^{1} ni potenca

test("besedila: brez koeficienta 1 (»1x«) in brez potence 1 (»x^{1}«)", () => {
  const napake = [];
  for (const t of naloge()) {
    for (const f of formule(t.text)) if (POTENCA_1.test(f)) napake.push(`${kje(t)} (besedilo): ${f}`);
    for (const f of formule(besedilo(t))) {
      if (KOEF_1.test(f) || POTENCA_1_SPREMENLJIVKE.test(f)) napake.push(`${kje(t)}: ${f}`);
    }
  }
  assert.deepEqual(napake.slice(0, 20), [], `${napake.length} zapisov z odvečno enico`);
  assert.ok(KOEF_1.test("\\lvert x^3 - 1x \\rvert") && POTENCA_1.test("koeficient pri x^{1}") && !POTENCA_1.test("\\int_{-1}^{1} x\\,dx"));
});
