// Razdelek »Za maturo« v lekcijah MAT-SS (j, 13. 11. 2026, točki C4 in C5): preverjalnik lekcij, rešitev za gumbom,
// ena naloga = en korak lekcije, ustno vprašanje iz bloka »:::premisli« gre v »Vprašaj me«.
import test from "node:test";
import assert from "node:assert/strict";
import { checkLessonSource } from "../server/lesson-check.js";
import { hideSolutions, parseLesson } from "../server/textbook.js";
import { lessonSteps } from "../public/lesson-steps.js";
import { lessonQuestions } from "../server/ustno.js";

const ID = "MAT-SS-4/binomski-izrek";
const base = (zaMaturo) => `---\nstanje: osnutek\navtor: AI\n---\n## Zakaj se tega učimo\nBesedilo.\n## Povzetek\n- Točka.\n${zaMaturo}`;
const dobro = `## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Razvij $(x + 1)^2$.

**Rešitev:**

1. $(x + 1)^2 = x^2 + 2x + 1$.

**Točkovanje:** 1 točka za vsak pravilen člen.

### Naloga 2: krajša strukturirana naloga, 6 točk, pola 2 (z računalom)

Izračunaj.

**Rešitev:**

1. Račun.

**Točkovanje:** 2 točki za postopek, 4 točke za rezultat.

### Ustno vprašanje 1

:::premisli
Kaj pove binomski izrek o potenci dvočlenika?
---
Pove, kako razvijemo potenco dvočlenika $(a + b)^n$. Koeficienti so binomski simboli iz Pascalovega trikotnika. Vsota eksponentov v vsakem členu je $n$.
:::

### Ustno vprašanje 2

:::premisli
Kako so v Pascalovem trikotniku povezana sosednja števila?
---
Vsako število je vsota dveh števil nad njim.
:::
`;
const opozorila = (md) => checkLessonSource(base(md), ID).warnings.filter((w) => /Za maturo/.test(w));

test("Za maturo: preverjalnik opozori, če razdelek v lekciji MAT-SS manjka", () => {
  assert.ok(opozorila("").some((w) => /manjka razdelek »## Za maturo«/.test(w)));
  // Druge poti (npr. OŠ) razdelka ne potrebujejo.
  assert.ok(!checkLessonSource(base(""), "MAT-OS-9/premica-v-ravnini").warnings.some((w) => /Za maturo/.test(w)));
});

test("Za maturo: pravilen razdelek nima opozoril", () => {
  assert.deepEqual(opozorila(dobro), []);
});

test("Za maturo: manjka oznaka pole, točke, rešitev, točkovanje ali vzorčni odgovor", () => {
  const slabo = dobro
    .replace("kratka naloga, 3 točke, pola 1 (brez računala)", "kratka naloga")
    .replace("**Točkovanje:** 2 točki za postopek, 4 točke za rezultat.", "")
    .replace("**Rešitev:**\n\n1. Račun.", "1. Račun.")
    .replace("sosednja števila?\n---\n", "sosednja števila?\n");
  const w = opozorila(slabo).join("\n");
  assert.match(w, /manjka »pola 1 \(brez računala\)« ali »pola 2 \(z računalom\)«/);
  assert.match(w, /manjka število točk/);
  assert.match(w, /manjka celotna rešitev/);
  assert.match(w, /manjka vrstica »\*\*Točkovanje:\*\* …«/);
  assert.match(w, /blok »:::premisli«/);
});

test("Za maturo: rešitev s točkovanjem je skrita za gumbom, ena naloga je en korak", () => {
  const html = hideSolutions(dobro.split("### Naloga 2")[0]);
  assert.match(html, /<details class="tb-solution"><summary>Pokaži rešitev<\/summary>[\s\S]*Točkovanje:[\s\S]*<\/details>/);
  const steps = lessonSteps([{ title: "Za maturo", md: dobro.replace(/^## Za maturo\n/, "").trim() }]);
  assert.deepEqual(steps.map((s) => s.md.split("\n")[0]), ["### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)", "### Naloga 2: krajša strukturirana naloga, 6 točk, pola 2 (z računalom)", "### Ustno vprašanje 1", "### Ustno vprašanje 2"]);
});

test("Za maturo: ustno vprašanje z vzorčnim odgovorom je kandidat za »Vprašaj me«", () => {
  const qs = lessonQuestions(ID, parseLesson(base(dobro)), "Binomski izrek", { pregled: false });
  assert.ok(qs.some((q) => /Kaj pove binomski izrek/.test(q.besedilo)));
});

test("Za maturo: ustna vprašanja ne nadomestijo vmesnih vprašanj v razlagi, naloge se ne štejejo v besede (tudi z dodatkom v naslovu)", () => {
  const vse = checkLessonSource(base(dobro.replace("## Za maturo", "## Za maturo (osnovna in višja raven)")), ID).warnings;
  assert.ok(vse.some((w) => /vmesni vprašanji »:::premisli« \(0\)/.test(w)), "dve ustni vprašanji ne štejeta kot premisli v razlagi");
  const dolgo = dobro.replace("Izračunaj.", "Besedilo naloge. ".repeat(1500));
  assert.ok(!checkLessonSource(base(dolgo), ID).warnings.some((w) => /besed/.test(w) && /dolg|2800/.test(w)));
  // Nedeljiv presledek pred »točke« je v redu.
  assert.ok(!opozorila(dobro.replace("3 točke", "3 točke")).some((w) => /manjka število točk/.test(w)));
});

test("Za maturo: dolga naloga s skrito rešitvijo ostane en korak", () => {
  const dolga = `### Naloga 1: krajša strukturirana naloga, 8 točk, pola 1 (brez računala)\n\n${"Besedilo naloge. ".repeat(60)}\n\n**Rešitev:**\n\n${"1. Korak rešitve.\n".repeat(80)}\n**Točkovanje:** 8 točk.\n\n### Ustno vprašanje 1\n\nVprašanje.`;
  const steps = lessonSteps([{ title: "Za maturo", md: dolga }]);
  assert.deepEqual(steps.map((s) => s.md.split("\n")[0]), ["### Naloga 1: krajša strukturirana naloga, 8 točk, pola 1 (brez računala)", "### Ustno vprašanje 1"]);
});
