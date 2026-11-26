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
  // AUDIT-058: prava pretvorba enot je zdaj preverjen korak (prej preskočen)
  assert.equal(one("10\\,\\mathrm{m} = 1000\\,\\mathrm{cm}").checked, 1);
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

test("lesson-math: bajt in bit (meritev SŠ 18. 11.: lažen popravek »2 MB ni 1,6 · 10⁷ bit«; pregled #835)", () => {
  const good = [
    "2\\ \\mathrm{MB} = 2 \\cdot 10^6\\ \\mathrm{B} \\cdot 8\\ \\frac{\\mathrm{bit}}{\\mathrm{B}} = 1{,}6 \\cdot 10^7\\ \\mathrm{bit}",
    "100\\ \\mathrm{Mbit/s} = 100/8 = 12{,}5\\ \\mathrm{MB/s}",
    "100\\ \\frac{\\mathrm{Mbit}}{\\mathrm{s}} = \\frac{100}{8} = 12{,}5\\ \\frac{\\mathrm{MB}}{\\mathrm{s}}",
    "3\\ \\mathrm{KB} = 3 \\cdot 1000 \\cdot 8 = 24\\,000\\ \\mathrm{bit}",
    "2\\ \\mathrm{KiB} = 2 \\cdot 1024 = 2048\\ \\mathrm{B}",
    "2\\ \\mathrm{KiB} = 2 \\cdot 1024 \\cdot 8 = 16\\,384\\ \\mathrm{bit}",
    "5\\ \\mathrm{MB} = 5 \\cdot 8 = 40\\ \\mathrm{Mbit}",
    "4\\ \\mathrm{GB} = 4 \\cdot 1024 = 4096\\ \\mathrm{MB}",
    // ponovni pregled #835: natančen količnik, tudi med predponami
    "1\\ \\mathrm{Gbit/s} = 1000/8 = 125\\ \\mathrm{MB/s}",
    "24\\ \\mathrm{kbit} = 24\\,000/8 = 3000\\ \\mathrm{B}",
    "8\\ \\mathrm{Mbit/s} = 8 \\cdot 10^6/8 = 10^6\\ \\mathrm{B/s}",
    "1\\ \\mathrm{GiB} = 1024 \\cdot 1024 \\cdot 1024 = 1\\,073\\,741\\,824\\ \\mathrm{B}",
    "3\\ \\mathrm{kg} = 3 \\cdot 1000 = 3000\\ \\mathrm{g}",
  ];
  for (const t of good) assert.equal(one(t).mismatches.length, 0, t);
  // Količnik 8 in 1,024 samo na koraku od enote podatkov k pretvorbi in v pravi smeri; koraki do rezultata strogo.
  const bad = [
    "2\\ \\mathrm{MB} = 2 \\cdot 10^6 \\cdot 8 = 1{,}65 \\cdot 10^7\\ \\mathrm{bit}",
    "2\\ \\mathrm{MB} = 2 \\cdot 10^6 \\cdot 8 = 1{,}64 \\cdot 10^7\\ \\mathrm{bit}",
    "2\\ \\mathrm{MB} = 2 \\cdot 10^6 \\cdot 8 = 1{,}7 \\cdot 10^7\\ \\mathrm{bit}",
    "5\\ \\mathrm{kB} = 5 \\cdot 1000 \\cdot 8 = 41\\,000\\ \\mathrm{bit}",
    "3\\ \\mathrm{MB} = 3 \\cdot 10^6 \\cdot 8 = 3 \\cdot 10^7\\ \\mathrm{bit}",
    "5\\ \\mathrm{MB} = 5 \\cdot 8 = 50\\ \\mathrm{Mbit}",
    "4\\ \\mathrm{kB} = 4 \\cdot 1000 \\cdot 8 = 40000\\ \\mathrm{bit}",
    "10\\ \\mathrm{GB} = 10 \\cdot 1000 = 10240\\ \\mathrm{MB}",
    "16\\ \\mathrm{bit} = 16 \\cdot 8 = 128\\ \\mathrm{B}",
    "5\\ \\mathrm{kg} = 5 \\cdot 8 = 40\\ \\mathrm{N}",
    // ponovni pregled #835: napačna potenca 10 v pretvorbi ali v rezultatu, napačna smer
    "2\\ \\mathrm{MB} = 2 \\cdot 10^5 \\cdot 8 = 1{,}6 \\cdot 10^6\\ \\mathrm{bit}",
    "2\\ \\mathrm{MB} = 2 \\cdot 10^6 \\cdot 80 = 1{,}6 \\cdot 10^8\\ \\mathrm{bit}",
    "100\\ \\mathrm{Mbit/s} = 100/80 = 1{,}25\\ \\mathrm{MB/s}",
    "2\\ \\mathrm{MB} = 2 \\cdot 10^6 \\cdot 8 = 1{,}6 \\cdot 10^6\\ \\mathrm{bit}",
    "100\\ \\mathrm{Mbit/s} = 100/8 = 1{,}25",
    "100\\ \\mathrm{Mbit/s} = 100/8 = 125\\ \\mathrm{MB/s}",
    "100\\ \\mathrm{Mbit/s} = 100 \\cdot 8 = 800\\ \\mathrm{MB/s}",
    "40\\ \\mathrm{Mbit} = 40 \\cdot 8 = 320\\ \\mathrm{MB}",
  ];
  for (const t of bad) assert.equal(one(t).mismatches.length, 1, t);
});

// AUDIT-061: točna števila brez »≈« se primerjajo točno (pol zadnjega mesta), ne z 1 % operandov.
test("AUDIT-061: 305 − 7 = 297 in 1000 − 1 = 990 se ujameta, zaokrožitve in π ostanejo", () => {
  const R = String.raw;
  for (const t of [R`$100 - 1 = 98$`, R`$305 - 7 = 297$`, R`$1000 - 1 = 990$`, R`$250 + 250 - 3 = 499$`, R`$2{,}5 \cdot 4 = 10{,}05$`]) assert.equal(checkArithmetic(t).mismatches.length, 1, t);
  for (const t of [R`$305 - 7 = 298$`, R`$\pi \cdot 10 = 31{,}4$`, R`$39{,}9 - 39{,}8 = 0{,}1$`, R`$\frac{10}{3} = 3{,}33$`, R`$1{,}2 \cdot 10^{3} = 1200$`, R`$2^{-1} = 0{,}5$`, R`$20 + 1{,}5 \cdot 5{,}71 = 20 + 8{,}57$`, R`$0 = 8$`]) {
    assert.deepEqual(checkArithmetic(t).mismatches, [], t);
  }
});

// AUDIT-062: »:« med števili je deljenje, € je enota, % sredi računa je količnik.
test("AUDIT-062: 48 : 6 = 7, 20 % · 60 = 3 in 80 € · 0,75 = 65 € se ujamejo", () => {
  const R = String.raw;
  for (const t of [R`$48 : 6 = 7$`, R`$(12 - 4) : 2 = 8 : 2 = 3$`, R`$20\ \% \cdot 60 = 3$`, R`$80\ € \cdot 0{,}75 = 65\ €$`]) assert.equal(checkArithmetic(t).mismatches.length, 1, t);
  for (const t of [
    R`$48 : 6 = 8$`,
    R`$20\ \% \cdot 60 = 12$`,
    R`$80\ € \cdot 0{,}75 = 60\ €$`,
    R`$0{,}10 \cdot 100 = 10\,\%$`,
    R`$\dfrac{1}{51} \cdot 100\,\% \approx 2{,}0\,\%$`,
    R`$\frac{42}{100} = 0{,}42\,\%\ \mathrm{C}$`,
    R`$3 : 4 : 5$`,
    R`$1 : 2 = 2 : 4$`,
    "$7 : 4 = 1$, ostane $3$", // deljenje z ostankom
    R`$50\,\text{cm} : 2\,\text{m} = 50 : 200 = 1 : 4$`, // razmerje količin
  ]) {
    assert.deepEqual(checkArithmetic(t).mismatches, [], t);
  }
});

test("AUDIT-061 (pregled): zaokrožen rezultat z ničlami na koncu ob decimalnem podatku ni napaka", () => {
  const R = String.raw;
  for (const t of [R`$0{,}5 \cdot 1500 \cdot 25^2 = 469\,000$`, R`$9{,}81 \cdot 125 = 1230$`, R`$1200 \cdot 1{,}035^5 = 1430$`]) assert.deepEqual(checkArithmetic(t).mismatches, [], t);
  for (const t of [R`$2{,}5 \cdot 4 = 10{,}05$`, R`$305 - 7 = 297$`]) assert.equal(checkArithmetic(t).mismatches.length, 1, t);
});

// AUDIT-058: pretvorbe enot s predponami se preverijo točno, ne po »mantisi« (prej je bil 72 km/h = 200 m/s »pretvorba«).
test("AUDIT-058: napaka ×10ⁿ z enotami se ujame, prave pretvorbe ostanejo brez popravka", () => {
  const R = String.raw;
  const wrong = [
    R`$\rho = \frac{540\ \mathrm{g}}{200\ \mathrm{cm^3}} = 27\ \mathrm{g/cm^3}$`,
    R`$72\ \mathrm{km/h} = 200\ \mathrm{m/s}$`,
    R`$5\ \mathrm{cm} = 0{,}5\ \mathrm{m}$`,
    R`$3\ \mathrm{kg} = 300\ \mathrm{g}$`,
    R`$5\ \mathrm{min} = 30\ \mathrm{s}$`,
    R`$I = \frac{6\ \mathrm{V}}{12\ \Omega} = 2\ \mathrm{A}$`,
    R`$c = \sqrt{3^2+4^2} = \sqrt{25} = 7\ \mathrm{cm}$`,
    R`$M(\mathrm{H_2SO_4}) = 2 \cdot 1 + 32 + 4 \cdot 16 = 96\ \mathrm{g/mol}$`,
    R`$72\ \mathrm{km/h} = \frac{72}{3{,}6} = 200\ \mathrm{m/s}$`,
    R`$t = 1{,}5\ \mathrm{h} = 9\ \mathrm{min}$`,
  ];
  for (const t of wrong) assert.equal(checkArithmetic(t).mismatches.length, 1, t);
  const right = [
    R`$72\ \mathrm{km/h} = 20\ \mathrm{m/s}$`,
    R`$0{,}3\ \mathrm{kW} = 300\ \mathrm{W}$`,
    R`$84\,000\ \mathrm{J} = 84\ \mathrm{kJ}$`,
    R`$3\ \mathrm{kg} = 3 \cdot 100 = 300\ \mathrm{dag}$`,
    R`$72\ \mathrm{km/h} = \frac{72}{3{,}6} = 20\ \mathrm{m/s}$`,
    R`$\rho = \frac{540\ \mathrm{g}}{200\ \mathrm{cm^3}} = 2{,}7\ \mathrm{g/cm^3}$`,
    R`$I = \frac{6\ \mathrm{V}}{12\ \Omega} = 0{,}5\ \mathrm{A}$`,
    R`$F = 2\ \mathrm{kg} \cdot 3\ \mathrm{m/s^2} = 6\ \mathrm{N}$`,
    R`$1\ \mathrm{eV} = 1{,}602 \cdot 10^{-19}\ \mathrm{J}$`,
    R`$Q = 2\ \mathrm{kg} \cdot 4200\ \mathrm{J/(kg\,K)} \cdot 10\ \mathrm{K} = 84\,000\ \mathrm{J}$`,
    R`$E = 2\ \mathrm{kW} \cdot 3\ \mathrm{h} = 6\ \mathrm{kWh}$`,
    R`$V \approx 3142\,\mathrm{cm^3} \approx 3{,}1\,\mathrm{L}$`,
    R`$\frac{1000\,\text{m}}{1\,\text{km}} = 1$`,
    R`$1\,\mathrm{s} \approx 16{,}7$`, // izjava (merilo), ne račun
    R`$1200\,\mathrm{nt} = 400$`, // nukleotidi, ne nanotone
  ];
  for (const t of right) assert.deepEqual(checkArithmetic(t).mismatches, [], t);
});

test("AUDIT-058 (pregled): merilo, napaka v razlagi in pretvorbeni faktor niso napaka; napačne enote ob enakih številih so", () => {
  const R = String.raw;
  for (const t of [R`$1\ \mathrm{cm} = 500\ \mathrm{m}$ v naravi (merilo $1 : 50\,000$)`, R`Druga napaka je $35\,\mathrm{dag} = 35\,\mathrm{g}$.`, R`$v = 0{,}6\,\mathrm{cm/min} \cdot 60 = 36\,\mathrm{cm/h}$`]) assert.deepEqual(checkArithmetic(t).mismatches, [], t);
  for (const t of [R`$W = 50\ \mathrm{N} \cdot 2\ \mathrm{cm} = 100\ \mathrm{J}$`, R`$P = \frac{600\ \mathrm{J}}{2\ \mathrm{min}} = 300\ \mathrm{W}$`, R`$1\ \mathrm{mm} = 100\ \mu\mathrm{m}$`, R`$Q = 4200\ \mathrm{J/(kg\,K)} \cdot 0{,}5\ \mathrm{kg} \cdot 20\ \mathrm{K} = 4{,}2\ \mathrm{kJ}$`]) assert.equal(checkArithmetic(t).mismatches.length, 1, t);
});

test("AUDIT-062 (pregled): h:mm ni deljenje, »45 € : 3« se preračuna", () => {
  const R = String.raw;
  for (const t of [R`$1:30\,\mathrm{h} = 90\,\mathrm{min}$`, R`$8:05 = 8\,\mathrm{h}\,5\,\mathrm{min}$`, R`$45\ € : 3 = 15\ €$`]) assert.deepEqual(checkArithmetic(t).mismatches, [], t);
  assert.equal(checkArithmetic(R`$45\ € : 3 = 12\ €$`).mismatches.length, 1);
});

// Prevzem (26. 11.): po združitvi AUDIT-058/061/062 popis pokritosti ni smel dobiti lažnih napak.
test("AUDIT-058 + 061 po združitvi: račun v SI brez enot, zaokrožen faktor, zaokrožen vmesni korak", () => {
  const R = String.raw;
  for (const t of [
    R`$F = 1000\cdot 9{,}81\cdot 0{,}25\cdot 1{,}05 \approx 2{,}58\ \mathrm{kN}$`,
    R`$n = 0{,}02\cdot 0{,}01819 = 0{,}3638\ \mathrm{mmol}$`,
    R`$P_\mathrm{max} = \frac{0{,}8^2}{4 \cdot 200} = 0{,}8\,\mathrm{mW}$`,
    R`$t = \dfrac{4756{,}7\ \mathrm{s}}{60} \approx 79{,}3\ \mathrm{min}$`,
    R`$y = 10 \cdot 3 - 4{,}905 \cdot 3^2 = 30 - 44{,}1 = -14{,}1\,\text{m}$`,
  ])
    assert.deepEqual(checkArithmetic(t).mismatches, [], t);
  for (const t of [R`$n = 0{,}02\cdot 0{,}01819 = 3{,}638\ \mathrm{mmol}$`, R`$4{,}905 \cdot 2 + 1 = 10 + 1$`])
    assert.equal(checkArithmetic(t).mismatches.length, 1, t);
});

test("AUDIT-058 (pregled prevzema): račun brez enot v običajni enoti iste količine ni napaka", () => {
  const R = String.raw;
  for (const t of [
    R`$m = 0{,}002 \cdot 180 = 360\ \mathrm{mg}$`,
    R`$V = 0{,}25 \cdot 2 = 500\ \mathrm{mL}$`,
    R`$c = \dfrac{0{,}05}{250} = 0{,}2\ \mathrm{mol/L}$`,
    R`$E = 2000 \cdot 3 = 6\ \mathrm{kWh}$`,
    R`$t = \dfrac{120}{80} = 90\ \mathrm{min}$`,
    R`$\rho = \dfrac{540}{200} = 2700\ \mathrm{kg/m^3}$`,
    R`$s = 4 \cdot 25 = 1\ \mathrm{m}$`,
    R`$m(\mathrm{SO_4^{2-}}) = 0{,}000934 \cdot 96{,}06 \approx 89{,}73\ \mathrm{mg}$`,
  ])
    assert.deepEqual(checkArithmetic(t).mismatches, [], t);
  for (const t of [R`$s = 340 \cdot 3 = 10{,}2\ \mathrm{km}$`, R`$s = 90 \cdot 2 = 1{,}8\ \mathrm{km}$`, R`$m = 2 \cdot 30 = 1\ \mathrm{kg}$`, R`$F = 2 \cdot 30 = 1\ \mathrm{N}$`, R`$F = 50 \cdot 2 = 1000\ \mathrm{N}$`, R`$F = 1000 \cdot 9{,}81 \cdot 0{,}25 \cdot 1{,}05 \approx 25{,}8\ \mathrm{kN}$`, R`$V = 0{,}25 \cdot 2 = 50\ \mathrm{mL}$`, R`$9{,}81 \cdot 2 = 19{,}63$`, R`$m = 0{,}002 \cdot 180 = 36\ \mathrm{mg}$`, R`$72\ \mathrm{km/h} = \frac{72}{3{,}6} = 200\ \mathrm{m/s}$`, R`$2{,}5 \cdot 4 = 10{,}05$`])
    assert.equal(checkArithmetic(t).mismatches.length, 1, t);
});

test("AUDIT-087: potenca pred \\cdot in besedilo z več besedami nista lažna napaka", () => {
  const mm = (s) => checkArithmetic(s).mismatches.length;
  assert.equal(mm("$10^4 \\cdot 10^1 = 10^5$"), 0);
  assert.equal(mm("$10^4 \\cdot 10^1 = 10^6$"), 1);
  assert.equal(mm("$\\text{št. skupine} - 10 = 16 - 10 = 6$"), 0);
  assert.equal(mm("$\\text{št. skupine} - 10 = 16 - 10 = 7$"), 1);
  assert.equal(mm("$3{,}97 \\cdot 10^{-19} : 1{,}602 \\cdot 10^{-19} = 2{,}478$"), 0);
  assert.equal(mm("$2^3 \\cdot 10^2 = 800$"), 0);
  // pregled: ukazi v enoti niso besede, oznaka za številom je enota (napaka ostane najdena)
  assert.equal(mm("$d = 2 \\cdot 3\\,\\mathrm{\\mu m} = 7\\,\\mathrm{\\mu m}$"), 1);
  assert.equal(mm("$1\\,\\mathrm{J} = 1\\,\\mathrm{N \\cdot m} = 2\\,\\mathrm{kg \\cdot m^2/s^2}$"), 1);
  assert.equal(mm("$\\dfrac{60\\,\\mathrm{^\\circ C}}{30\\,\\mathrm{^\\circ C}} = 3$"), 1);
  assert.equal(mm("$12 \\cdot 3 = 37\\ \\text{kosov jabolk}$"), 1);
  assert.equal(mm("$v = 72\\ \\text{km na uro} \\cdot 2 = 145\\ \\text{km na uro}$"), 1);
});

test("AUDIT-088: ure v minute v verigi niso lažna napaka", () => {
  assert.equal(checkArithmetic("$t = \\dfrac{8}{10}\\ \\text{h} = \\dfrac{8 \\times 60}{10}\\ \\text{min} = 48\\ \\text{min}$").mismatches.length, 0);
});
