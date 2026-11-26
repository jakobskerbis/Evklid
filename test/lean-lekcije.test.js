// PV-09: povezava izrekov Lean z vidnimi trditvami lekcij (scripts/lean-lekcije.mjs, docs/lean.md »Lekcije (L2)«).
import test from "node:test";
import assert from "node:assert/strict";
import { deklaracije, oznake, normaliziraj, vidnoBesedilo, izsekVLekciji, jePredpostavka, preveriDatoteko, kazaloJson, implikacija, glaveTabel } from "../scripts/lean-lekcije.mjs";

const VIR = "content/lessons/MAT-SS-4/primer.md";
const SHA = "a".repeat(64);
const LEKCIJA = `---
stanje: preverjeno
avtor: AI
---

## Razlaga

Za vsak $n$ velja $\\binom{n}{k} = \\binom{n}{n-k}$, kjer je $k \\le n$.

Pri deljenju je $\\frac{6}{2}\\,=\\,3$.

:::risba skica
opis: skrito besedilo risbe
:::

<<RACUN
vrednost: 6/2 | 3
>>
`;

const glava = `/-
vir: ${VIR}
sha256: ${SHA}
-/
module

public import Mathlib

namespace Evklid.Lekcije.MAT_SS_4.Primer
`;

test("deklaracije: ime, polno ime, docstring, binderji in predpostavke", () => {
  const txt = `${glava}
/-- Razlaga: simetrija.
trditev: MAT-SS-4/primer#simetrija
besedilo: »$\\binom{n}{k} = \\binom{n}{n-k}$« -/
theorem simetrija (n k : ℕ) (hk : k ≤ n) : Nat.choose n k = Nat.choose n (n - k) :=
  (Nat.choose_symm hk).symm

@[simp] theorem brez_doc {R : Type*} [CommRing R] (a : R) (f : ℕ → ℝ) : a = a := rfl

end Evklid.Lekcije.MAT_SS_4.Primer
`;
  const d = deklaracije(txt);
  assert.equal(d.length, 2);
  assert.equal(d[0].ime, "simetrija");
  assert.equal(d[0].polnoIme, "Evklid.Lekcije.MAT_SS_4.Primer.simetrija");
  assert.deepEqual(d[0].binderji.filter(jePredpostavka).map((b) => b.imena), [["hk"]]);
  assert.equal(oznake(d[0].doc.text).trditev, "MAT-SS-4/primer#simetrija");
  assert.equal(oznake(d[0].doc.text).besedilo, "$\\binom{n}{k} = \\binom{n}{n-k}$");
  assert.equal(d[1].ime, "brez_doc");
  assert.equal(d[1].doc, null);
  assert.deepEqual(d[1].binderji.filter(jePredpostavka), [], "spremenljivke in razredi niso predpostavke");
});

test("izsek: dobesedno v vidnem besedilu, presledki in LaTeX \\, ne štejejo; risba, RACUN in glava ne", () => {
  assert.ok(izsekVLekciji("Pri deljenju je $\\frac{6}{2} = 3$.", LEKCIJA));
  assert.ok(izsekVLekciji("velja   $\\binom{n}{k}\n= \\binom{n}{n-k}$", LEKCIJA));
  assert.ok(!izsekVLekciji("skrito besedilo risbe", LEKCIJA));
  assert.ok(!izsekVLekciji("vrednost: 6/2", LEKCIJA));
  assert.ok(!izsekVLekciji("stanje: preverjeno", LEKCIJA));
  assert.ok(!izsekVLekciji("$\\binom{n}{k} = \\binom{n}{k}$", LEKCIJA), "drug izraz ni isti izsek");
  assert.ok(!izsekVLekciji("", LEKCIJA));
  assert.equal(normaliziraj("a\\,b \\; c\n\n d"), "a b c d");
  assert.ok(!vidnoBesedilo(LEKCIJA).includes("RACUN"));
});

function datoteka(telo) {
  return `${glava}\n${telo}\nend Evklid.Lekcije.MAT_SS_4.Primer\n`;
}

test("preveriDatoteko: pravilna datoteka da kazalo { id, izrek, sha256, vir, besedilo }", () => {
  const txt = datoteka(`
/-- Razlaga: simetrija.
trditev: MAT-SS-4/primer#simetrija
besedilo: »velja $\\binom{n}{k} = \\binom{n}{n-k}$, kjer je $k \\le n$.« -/
theorem simetrija (n k : ℕ) (hk : k ≤ n) : Nat.choose n k = Nat.choose n (n - k) :=
  (Nat.choose_symm hk).symm

/-- Predpostavka trditve \`simetrija\` se da izpolniti (n = 5, k = 2). -/
example := simetrija 5 2 (by norm_num)

/-- Pomožna trditev.
pomozno -/
theorem pomoc (x : ℝ) (hx : 0 < x) : 0 ≤ x := hx.le

/-- Razlaga: deljenje.
trditev: MAT-SS-4/primer#deljenje
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
theorem deljenje : (6 : ℝ) / 2 = 3 := by norm_num
`);
  const r = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA);
  assert.deepEqual(r.napake, []);
  assert.deepEqual(r.trditve.map((t) => t.id), ["MAT-SS-4/primer#simetrija", "MAT-SS-4/primer#deljenje"]);
  assert.deepEqual(r.trditve[0], {
    id: "MAT-SS-4/primer#simetrija",
    izrek: "Evklid.Lekcije.MAT_SS_4.Primer.simetrija",
    sha256: SHA,
    vir: VIR,
    besedilo: "velja $\\binom{n}{k} = \\binom{n}{n-k}$, kjer je $k \\le n$.",
    izpolnljivo: "primer",
  });
  assert.equal(r.trditve[1].besedilo, "Pri deljenju je $\\frac{6}{2} = 3$.");
  assert.ok(kazaloJson(r.trditve).startsWith("[\n{"));
  assert.deepEqual(JSON.parse(kazaloJson(r.trditve)), r.trditve);
});

test("preveriDatoteko: manjkajoča oznaka, podvojen id, izmišljen ali kratek citat, tuj id, predpostavke brez primera", () => {
  const txt = datoteka(`
/-- Razlaga: brez oznake. -/
theorem brez : (1 : ℕ) = 1 := rfl

/-- Razlaga.
trditev: MAT-SS-4/primer#ena
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
theorem a1 : (1 : ℕ) = 1 := rfl

/-- Razlaga.
trditev: MAT-SS-4/primer#ena
besedilo: »To v lekciji ne piše.« -/
theorem a2 : (1 : ℕ) = 1 := rfl

/-- Razlaga.
trditev: MAT-SS-4/druga#ena
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
theorem a3 : (1 : ℕ) = 1 := rfl

/-- Razlaga.
trditev: MAT-SS-4/primer#hip
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
theorem hip (x : ℝ) (hx : x ≠ 0) : x / x = 1 := div_self hx

/-- Razlaga.
trditev: MAT-SS-4/primer#sklep
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
theorem sklep : (1 : ℕ) = 1 ∧ ∀ x : ℝ, 0 < x → 0 ≤ x := ⟨rfl, fun _ h => h.le⟩

/-- Razlaga.
trditev: MAT-SS-4/primer#kratek
besedilo: »$k \\le n$« -/
theorem kratek : (1 : ℕ) = 1 := rfl

theorem nima_docstringa : (1 : ℕ) = 1 := rfl
`);
  const r = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA);
  const ima = (re) => assert.ok(r.napake.some((n) => re.test(n)), `pričakovana napaka ${re}: ${r.napake.join(" | ")}`);
  ima(/brez: docstring nima »trditev/);
  ima(/nima_docstringa: docstring nima »trditev/);
  ima(/a2: id MAT-SS-4\/primer#ena je že pri a1/);
  ima(/a2: besedilo »To v lekciji ne piše\.…« ni v vidnem besedilu/);
  ima(/a3: id MAT-SS-4\/druga#ena ni oblike MAT-SS-4\/primer#/);
  ima(/hip: predpostavke hx brez primera izpolnljivosti/);
  ima(/sklep: predpostavke »→« v sklepu brez primera/);
  ima(/kratek: besedilo »\$k \\le n\$« je krajše od 15 znakov/);
  assert.equal(r.napake.length, 8);
  assert.ok(r.opozorila.some((o) => /isti citat .* ima 4 izrekov/.test(o)), r.opozorila.join(" | "));
});

test("implikacija: »→« v vezniku na vrhu za »∀ …,«, ne v ¬, ∃, let ali oklepaju", () => {
  assert.ok(implikacija("∀ t : ℝ, (0.84 : ℝ) ^ t = 0.1 → |t - 13.2| < 0.05"));
  assert.ok(implikacija("(2:ℝ) ^ 2 = 4 ∧ ∀ x : ℝ, -1 < x → x < 4 → 2 * (x + 1) * (x - 4) < 0"));
  assert.ok(implikacija("¬ ContinuousOn f (Icc (-1) 1) ∧ ∀ x ∈ Icc (-1:ℝ) 1, x ≠ 0 → 1 / x ≠ 0"));
  assert.ok(!implikacija("¬ ∀ a b : ℝ, 0 ≤ a → 0 ≤ b → √(a + b) = √a + √b"));
  assert.ok(!implikacija("∀ ε > 0, ∃ δ > 0, ∀ x : ℝ, |x - 3| < δ → |2 * x - 6| < ε"));
  assert.ok(!implikacija("(∀ x : ℝ, 0 < x → 0 ≤ x) ∧ (1 : ℕ) = 1"));
  assert.ok(!implikacija("a ^ u = a ^ v ↔ u = v"));
});

test("glava tabele ni citat, vrstica je", () => {
  const md = "## Razlaga\n\n| kvadrant | sin | cos |\n|---|---|---|\n| I. $0^\\circ$–$90^\\circ$ | $+$ | $+$ |\n";
  const g = glaveTabel(md);
  assert.ok(g.has("| kvadrant | sin | cos |"));
  assert.ok(!g.has("| I. $0^\\circ$–$90^\\circ$ | $+$ | $+$ |"));
});

test("primer izpolnljivosti mora izrek uporabiti (sam docstring ne zadošča)", () => {
  const izrek = (ime, dodatno = "") => `/-- Razlaga.
trditev: MAT-SS-4/primer#${ime.replaceAll("_", "-")}
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.«${dodatno} -/
theorem ${ime} (x : ℝ) (hx : 0 < x) : 0 ≤ x := hx.le
`;
  const txt = datoteka(`
${izrek("prvi")}
/-- Predpostavke trditve \`prvi\` se dajo izpolniti (x = 1). -/
example : (0 : ℝ) < 1 := one_pos

${izrek("drugi")}
theorem drugi_izpolnljivo : (0 : ℝ) ≤ 1 := drugi 1 one_pos

${izrek("tretji", "\nizpolnljivo: ročno – primer zahteva zaporedje iz lekcije")}
${izrek("cetrti")}
example (y : ℝ) (hy : 0 < y) := cetrti y hy

${izrek("peti")}
example := peti 1 one_pos
`);
  const r = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA);
  const brez = r.napake.filter((n) => /brez primera izpolnljivosti/.test(n)).map((n) => n.match(/ (\w+): predpostavke/)[1]);
  assert.deepEqual(brez, ["prvi", "cetrti"], "docstring brez uporabe in primer z lastnimi predpostavkami ne štejeta");
  assert.equal(r.trditve.find((t) => t.izrek.endsWith(".tretji")).izpolnljivo, "ročno");
  assert.equal(r.trditve.find((t) => t.izrek.endsWith(".peti")).izpolnljivo, "primer");
  assert.ok(!r.trditve.some((t) => t.izrek.endsWith("_izpolnljivo")), "izrek _izpolnljivo ni trditev lekcije");
});
