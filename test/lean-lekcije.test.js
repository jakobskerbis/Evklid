// PV-09: povezava izrekov Lean z vidnimi trditvami lekcij (scripts/lean-lekcije.mjs, docs/lean.md »Lekcije (L2)«).
import test from "node:test";
import assert from "node:assert/strict";
import { deklaracije, oznake, normaliziraj, vidnoBesedilo, izsekVLekciji, jePredpostavka, preveriDatoteko, kazaloJson } from "../scripts/lean-lekcije.mjs";

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
besedilo: »$\\binom{n}{k} = \\binom{n}{n-k}$« -/
theorem simetrija (n k : ℕ) (hk : k ≤ n) : Nat.choose n k = Nat.choose n (n - k) :=
  (Nat.choose_symm hk).symm

/-- Predpostavka trditve \`simetrija\` se da izpolniti (n = 5, k = 2). -/
example : (2 : ℕ) ≤ 5 := by norm_num

/-- Pomožna trditev.
pomozno -/
theorem pomoc (x : ℝ) (hx : 0 < x) : 0 ≤ x := hx.le

/-- Razlaga: deljenje.
trditev: MAT-SS-4/primer#deljenje
besedilo: »$\\frac{6}{2}\\,=\\,3$« -/
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
    besedilo: "$\\binom{n}{k} = \\binom{n}{n-k}$",
    izpolnljivo: "primer",
  });
  assert.equal(r.trditve[1].besedilo, "$\\frac{6}{2} = 3$");
  assert.ok(kazaloJson(r.trditve).startsWith("[\n{"));
  assert.deepEqual(JSON.parse(kazaloJson(r.trditve)), r.trditve);
});

test("preveriDatoteko: manjkajoča oznaka, podvojen id, izmišljen citat, tuj id, predpostavke brez primera", () => {
  const txt = datoteka(`
/-- Razlaga: brez oznake. -/
theorem brez : (1 : ℕ) = 1 := rfl

/-- Razlaga.
trditev: MAT-SS-4/primer#ena
besedilo: »Pri deljenju« -/
theorem a1 : (1 : ℕ) = 1 := rfl

/-- Razlaga.
trditev: MAT-SS-4/primer#ena
besedilo: »To v lekciji ne piše.« -/
theorem a2 : (1 : ℕ) = 1 := rfl

/-- Razlaga.
trditev: MAT-SS-4/druga#ena
besedilo: »Pri deljenju« -/
theorem a3 : (1 : ℕ) = 1 := rfl

/-- Razlaga.
trditev: MAT-SS-4/primer#hip
besedilo: »Pri deljenju« -/
theorem hip (x : ℝ) (hx : x ≠ 0) : x / x = 1 := div_self hx

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
  assert.equal(r.napake.length, 6);
});

test("preveriDatoteko: izpolnljivost s primerom, z izrekom _izpolnljivo ali »izpolnljivo: ročno – razlog«", () => {
  const izrek = (ime, dodatno = "") => `/-- Razlaga.
trditev: MAT-SS-4/primer#${ime.replaceAll("_", "-")}
besedilo: »Pri deljenju«${dodatno} -/
theorem ${ime} (x : ℝ) (hx : 0 < x) : 0 ≤ x := hx.le
`;
  const txt = datoteka(`
${izrek("prvi")}
/-- Primer brez te besede: \`prvi\`. -/
example : (0 : ℝ) < 1 := one_pos

${izrek("drugi")}
theorem drugi_izpolnljivo : ∃ x : ℝ, 0 < x := ⟨1, one_pos⟩

${izrek("tretji", "\nizpolnljivo: ročno – primer zahteva zaporedje iz lekcije")}
${izrek("cetrti", "\nizpolnljivo: ročno")}
/-- Predpostavke trditve \`cetrti\` se dajo izpolniti, a citat »besedilo:« ne šteje.
besedilo: »izpolniti \`prvi\`« -/
example : (0 : ℝ) < 1 := one_pos
`);
  const r = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA);
  const brez = r.napake.filter((n) => /brez primera izpolnljivosti/.test(n)).map((n) => n.match(/ (\w+): predpostavke/)[1]);
  assert.deepEqual(brez, ["prvi"], "primer brez »izpoln…« ni primer izpolnljivosti; ročno brez razloga ne velja");
  assert.equal(r.trditve.find((t) => t.izrek.endsWith(".tretji")).izpolnljivo, "ročno");
  assert.equal(r.trditve.find((t) => t.izrek.endsWith(".cetrti")).izpolnljivo, "primer");
  assert.ok(!r.trditve.some((t) => t.izrek.endsWith("_izpolnljivo")), "izrek _izpolnljivo ni trditev lekcije");
});
