import test from "node:test";
import assert from "node:assert/strict";
import { checkArithmetic, normalizeTex, evaluate } from "../server/lesson-math.js";
import { checkLessonSource } from "../server/lesson-check.js";

const one = (tex) => checkArithmetic(`## Razlaga\n$${tex}$\n`);

test("lesson-math: pravilni koraki se ujemajo", () => {
  const ok = [
    "37 \\cdot 7 = 259",
    "I = \\dfrac{1500\\,\\mathrm{W}}{230\\,\\mathrm{V}} \\approx 6{,}5\\,\\mathrm{A}",
    "-6^2 = -(6\\cdot 6) = -36",
    "(-6)^2 = (-6)\\cdot(-6) = 36",
    "\\sqrt{\\dfrac{16}{25}} = \\dfrac{4}{5}",
    "p = 3{,}14 \\cdot 25 = 78{,}5\\,\\text{cm}^2",
    "25\\% \\cdot 80 = 20",
    "\\Delta T = 35 - 15 = 20\\,^\\circ\\text{C}",
    "2 \\cdot 10^{-3} = 0{,}002",
    "r = \\dfrac{62{,}8}{2 \\cdot 3{,}14} = \\dfrac{62{,}8}{6{,}28} = 10\\,\\text{cm}",
    "o = 2\\pi r = 2 \\cdot 3{,}14 \\cdot 5 = 31{,}4",
    "\\dfrac{3}{4} \\cdot 100\\,\\% = 75\\,\\%",
    "R = \\dfrac{6\\,\\text{V}}{0{,}25\\,\\text{A}} = 24\\,\\Omega",
    "\\sqrt{50} \\approx 7",
    "v = \\sqrt{400} = 20\\,\\frac{\\text{m}}{\\text{s}}",
    "|3{,}0 - 2{,}2| = 0{,}8",
    "\\sqrt[3]{27} = 3",
    "M(\\mathrm{NaCl}) = 23 + 35{,}5 = 58{,}5",
    "W_f = 3{,}97 \\cdot 10^{-19}/1{,}602 \\cdot 10^{-19}\\,\\mathrm{eV} \\approx 2{,}48\\,\\mathrm{eV}",
    "E = 100\\,\\mathrm{V}/1{,}0 \\cdot 10^{-3}\\,\\mathrm{m} = 1{,}0 \\cdot 10^5\\,\\mathrm{V/m}",
    "2\\frac{1}{3} = \\frac{7}{3}",
    "1\\frac{5}{12}+1\\frac{10}{12}=2\\frac{15}{12}=3\\frac{3}{12}=3\\frac{1}{4}",
    "4\\,596\\,382 \\approx 4\\,600\\,000 \\approx 5\\,000\\,000",
    "14{,}0 \\cdot 2{,}85 - 4{,}905 \\cdot 2{,}85^2 \\approx 39{,}9 - 39{,}8 \\approx 0",
  ];
  for (const tex of ok) {
    const r = one(tex);
    assert.equal(r.mismatches.length, 0, tex);
    assert.ok(r.checked >= 1, `nič preverjeno: ${tex}`);
  }
});

test("lesson-math: napačni koraki so najdeni", () => {
  for (const tex of [
    "37 \\cdot 7 = 269",
    "\\sqrt{9+16} = 3 + 4 = 7",
    "A = 2\\,\\mathrm{kW} \\cdot 3\\,\\mathrm{h} = 5\\,\\mathrm{kWh}",
    "\\dfrac{1}{3} \\approx 0{,}35",
    "v^2 = 10^2 - 8^2 = 100 - 36 = 64",
    "2 + 2 = 5",
  ]) {
    assert.ok(one(tex).mismatches.length >= 1, tex);
  }
  const r = one("37 \\cdot 7 = 269");
  assert.equal(r.mismatches[0].left, "259");
  assert.equal(r.mismatches[0].right, "269");
});

test("lesson-math: pretvorbe enot in simbolni deli se izpustijo", () => {
  for (const tex of [
    "10\\,\\mathrm{m} = 1000\\,\\mathrm{cm}",
    "1\\,\\mathrm{kWh} = 3{,}6 \\cdot 10^6\\,\\mathrm{J}",
    "72\\,\\mathrm{km/h} = 20\\,\\mathrm{m/s}",
    "x^2 = 9",
    "S = 4x(2x + 3)",
    "a \\le 5 = b",
    "2\\,\\mathrm{H_2} + \\mathrm{O_2} \\rightarrow 2\\,\\mathrm{H_2O}",
    "3\\,\\text{kg} = 3 \\cdot 100 = 300\\,\\text{dag}",
    "1\\,\\mathrm{eV} = 1{,}602 \\cdot 10^{-19}\\,\\mathrm{J}",
    "Q_V = 2{,}0 \\cdot 20{,}785 \\cdot 100\\,\\mathrm{J} \\approx 4{,}16\\,\\mathrm{kJ}",
    "150^\\circ = \\frac{5\\pi}{6}",
    "0{,}10 \\cdot 100 = 10\\,\\%",
    "100\\,\\% = 3 \\cdot 100 = 300",
    "\\frac{1000\\,\\text{m}}{1\\,\\text{km}} = 1.",
    "1\\,\\text{h}\\,30\\,\\text{min} = 90\\,\\text{min}",
    "3 = 7",
  ]) {
    assert.equal(one(tex).mismatches.length, 0, tex);
  }
  assert.equal(one("10\\,\\mathrm{m} = 1000\\,\\mathrm{cm}").checked, 0);
  assert.equal(normalizeTex("x + 1"), null);
  assert.equal(evaluate("2 pi"), 2 * Math.PI);
  assert.equal(evaluate("2(3+4)"), 14);
  assert.equal(evaluate("-6**2"), -36);
});

test("lesson-math: Pogoste napake, Preveri se in vrstice z »napačno« se ne preverjajo", () => {
  const body = [
    "## Razlaga",
    "Napačno: $2 + 2 = 5$.",
    "Dobimo $0 = 4$, kar ni res.",
    "Ocenimo: $48^2 \\approx 50^2 = 2500$.",
    "## Pogoste napake",
    "$\\sqrt{9+16} = 3 + 4 = 7$",
    "## Preveri se",
    "? Koliko je $6 \\cdot 7$?",
    "- $6 \\cdot 7 = 48$",
    "+ $42$",
  ].join("\n");
  assert.equal(checkArithmetic(body).mismatches.length, 0);
});

test("lesson-check: napačen račun v rešenem primeru je napaka", () => {
  const src = `---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo
Besedilo.

## Razlaga
Besedilo.

## Rešeni primeri
### Primer 1
Naloga.

**Podatki:** $a = 3$
**Iščemo:** $b$

:::formula
$b = 2a$
:::

**Rešitev:**

1. $b = 2 \\cdot 3 = 7$

### Primer 2
Naloga.

**Podatki:** $a = 4$
**Iščemo:** $b$

:::formula
$b = 2a$
:::

**Rešitev:**

1. $b = 2 \\cdot 4 = 8$

## Pogoste napake
Besedilo.

## Povzetek
Besedilo.

## Drugače: Na sliki
Besedilo.

## Drugače: Bolj natančno
Besedilo.

## Preveri se
? Vprašanje 1
+ a
- b
- c
? Vprašanje 2
+ a
- b
- c
? Vprašanje 3
+ a
- b
- c
`;
  const r = checkLessonSource(src);
  assert.ok(r.errors.some((e) => /račun se ne ujema/.test(e) && /6 ≠ 7/.test(e)), r.errors.join("\n"));
  assert.equal(r.calcChecked, 2);
});
