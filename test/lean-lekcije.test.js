// PV-09: povezava izrekov Lean z vidnimi trditvami lekcij (scripts/lean-lekcije.mjs, docs/lean.md »Lekcije (L2)«).
import test from "node:test";
import assert from "node:assert/strict";
import { deklaracije, oznake, normaliziraj, vidnoBesedilo, citljivoBesedilo, izsekVLekciji, jePredpostavka, preveriDatoteko, kazaloJson, implikacija, glaveTabel, maskiraj, uporabi, zgostiPodpis, preveri } from "../scripts/lean-lekcije.mjs";
import { izreki as aksiomiIzreki, imenaZaPreverjanje } from "../scripts/lean-aksiomi.mjs";
import fs from "node:fs";
import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";

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

test("implikacija: »→« v vezniku na vrhu za »∀ …,« (tudi v oklepaju, »->« in omejen ∀), ne v ¬, ∃ ali let", () => {
  assert.ok(implikacija("∀ t : ℝ, (0.84 : ℝ) ^ t = 0.1 → |t - 13.2| < 0.05"));
  assert.ok(implikacija("(2:ℝ) ^ 2 = 4 ∧ ∀ x : ℝ, -1 < x → x < 4 → 2 * (x + 1) * (x - 4) < 0"));
  assert.ok(implikacija("¬ ContinuousOn f (Icc (-1) 1) ∧ ∀ x ∈ Icc (-1:ℝ) 1, x ≠ 0 → 1 / x ≠ 0"));
  assert.ok(!implikacija("¬ ∀ a b : ℝ, 0 ≤ a → 0 ≤ b → √(a + b) = √a + √b"));
  assert.ok(implikacija("∀ ε > 0, ∃ δ > 0, ∀ x : ℝ, |x - 3| < δ → |2 * x - 6| < ε"), "omejen ∀ ε > 0 je predpostavka");
  assert.ok(implikacija("(∀ x : ℝ, 0 < x → 0 ≤ x) ∧ (1 : ℕ) = 1"), "»→« v oklepaju (obvoz pregleda 3)");
  assert.ok(implikacija("(0 < x → 0 ≤ x)"), "ves sklep v oklepaju");
  assert.ok(implikacija("0 < x -> 0 ≤ x"), "ASCII »->«");
  assert.ok(implikacija("(1 : ℕ) = 1 ∧ ∀ x ∈ Set.Icc (0 : ℝ) 1, x ^ 2 ≤ x"), "omejen ∀ x ∈ S");
  assert.ok(implikacija("∀ (x : ℝ) (hx : 0 < x), 0 ≤ x"), "binder s predpostavko v ∀");
  assert.ok(!implikacija("∀ x : ℝ, x ^ 2 ≥ 0"));
  assert.ok(!implikacija("∃ x : ℝ, 0 < x → x = 1"));
  assert.ok(!implikacija("(∃ x > 0, x = 1) ∧ ¬ (∀ x : ℝ, 0 < x → x = 1)"));
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

// --- PV-09: navedki iz kviza in obvozi varoval (pregleda 3 in 4) ----------------------------------------------------

const KVIZ = `---
stanje: preverjeno
---

## Razlaga

Za vsak $x > 0$ je tudi $x^2 > 0$.

## Preveri se

? Koliko je $2^{10}$? Izberi pravilni odgovor med ponujenimi.
- $512$, ker je to dvakrat manj
~ To je $2^9$: eksponent je za ena premajhen.
+ $1024$, ker je to pravilni odgovor
> Velja $2^{10} = 1024$, ker je $2^5 = 32$ in $32^2 = 1024$.

? Vpiši vrednost $\\log_2 8$.
= 3 | 0
~ 8 | To je logaritmand, ne eksponent: $2^3 = 8$.
> Ker je $2^3 = 8$, je $\\log_2 8 = 3$.

## Povzetek

Logaritem je obratna operacija potenciranja.
`;

function kvizDatoteka(citat) {
  return datoteka(`
/-- Preveri se 1.
trditev: MAT-SS-4/primer#kviz
besedilo: »${citat}« -/
theorem kviz : (2 : ℕ) ^ 10 = 1024 := by norm_num
`);
}

test("citat iz kviza: razlaga »>« in povratna informacija »~« veljata, vprašanje in ponujeni odgovori ne (j)", () => {
  const ok = (c) => assert.deepEqual(preveriDatoteko("x.lean", kvizDatoteka(c), KVIZ, VIR, SHA).napake, [], c);
  const ne = (c, re = /vprašanja ali ponujenih odgovorov/) => {
    const n = preveriDatoteko("x.lean", kvizDatoteka(c), KVIZ, VIR, SHA).napake;
    assert.ok(n.some((x) => re.test(x)), `${c}: ${n.join(" | ")}`);
  };
  ok("Velja $2^{10} = 1024$, ker je $2^5 = 32$ in $32^2 = 1024$.");
  ok("To je $2^9$: eksponent je za ena premajhen.");
  ok("To je logaritmand, ne eksponent: $2^3 = 8$.");
  ok("Ker je $2^3 = 8$, je $\\log_2 8 = 3$.");
  ok("Za vsak $x > 0$ je tudi $x^2 > 0$.");
  ok("Logaritem je obratna operacija potenciranja.");
  ne("$1024$, ker je to pravilni odgovor");
  ne("$512$, ker je to dvakrat manj");
  ne("Koliko je $2^{10}$? Izberi pravilni odgovor med ponujenimi.");
  ne("8 | To je logaritmand, ne eksponent", /vprašanja ali ponujenih odgovorov|ni v vidnem/);
  // citat ne sme segati iz razlage v naslednje vprašanje
  ne("$32^2 = 1024$. ? Vpiši vrednost", /vprašanja ali ponujenih odgovorov|ni v vidnem/);
  const c = citljivoBesedilo(KVIZ);
  assert.ok(c.includes("Velja $2^{10}") && !c.includes("ker je to pravilni odgovor") && !c.includes("Koliko je"));
});

test("zamaknjen izrek, izrek za drugim ukazom v vrstici in »noncomputable section« niso skriti", () => {
  const txt = datoteka(`
noncomputable section Notranji

  theorem zamaknjen : (1 : ℕ) = 1 := rfl

end Notranji

example : True := trivial theorem v_vrstici : (2 : ℕ) = 2 := rfl

@[simp] protected theorem z_atributom : (3 : ℕ) = 3 := rfl
`);
  const d = deklaracije(txt).filter((x) => x.vrsta === "theorem");
  assert.deepEqual(d.map((x) => x.ime), ["zamaknjen", "v_vrstici", "z_atributom"]);
  assert.equal(d[0].polnoIme, "Evklid.Lekcije.MAT_SS_4.Primer.zamaknjen", "section ne doda imena, end ga zapre");
  assert.equal(d[2].polnoIme, "Evklid.Lekcije.MAT_SS_4.Primer.z_atributom");
  const r = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA);
  for (const ime of ["zamaknjen", "v_vrstici", "z_atributom"]) assert.ok(r.napake.some((n) => n.includes(`${ime}: docstring nima`)), ime);
  // lean-aksiomi.mjs uporablja isti razčlenjevalnik
  assert.deepEqual(aksiomiIzreki(txt).map((x) => x.split(".").pop()), ["zamaknjen", "v_vrstici", "z_atributom"]);
});

test("znakovni literal '\"' in surovi niz r#\"…\"# ne skrijeta izrekov za njima", () => {
  const txt = datoteka(`
def narekovaj : Char := '"'
def surovi : String := r#"tu je " in še "#
def ime' : ℕ := 1

theorem skrit_za_literalom : (1 : ℕ) = 1 := rfl
`);
  assert.ok(deklaracije(txt).some((x) => x.ime === "skrit_za_literalom"));
  assert.ok(maskiraj(txt).mask.includes("def ime' : ℕ := 1"), "»'« v imenu ni literal");
  assert.ok(preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA).napake.some((n) => /skrit_za_literalom: docstring nima/.test(n)));
});

test("»private« izrek je dovoljen le kot »pomozno«; aksiomi ga izpustijo", () => {
  const txt = datoteka(`
/-- Razlaga.
trditev: MAT-SS-4/primer#skrit
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
private theorem skrit : (6 : ℝ) / 2 = 3 := by norm_num

/-- Orodje.
pomozno -/
private theorem orodje : (1 : ℕ) = 1 := rfl
`);
  const r = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA);
  assert.equal(r.napake.length, 1, r.napake.join(" | "));
  assert.match(r.napake[0], /skrit: »private« izrek/);
  assert.deepEqual(r.trditve, []);
  assert.deepEqual(aksiomiIzreki(txt), []);
});

test("primer izpolnljivosti: golo ime, »@izrek« brez argumentov in »#check« za primerom ne štejejo", () => {
  const izrek = (ime) => `/-- Razlaga.
trditev: MAT-SS-4/primer#${ime.replaceAll("_", "-")}
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
theorem ${ime} (x : ℝ) (hx : 0 < x) : 0 ≤ x := hx.le
`;
  const txt = datoteka(`
${izrek("golo")}
example := golo

${izrek("afna")}
example : True := by
  have := @afna
  trivial

${izrek("check")}
example : True := trivial
#check check 1 one_pos

${izrek("v_oklepaju")}
example := (v_oklepaju)

${izrek("prav")}
example := @prav 1 one_pos

${izrek("projekcija")}
example := (projekcija 1 one_pos).le
`);
  const r = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA);
  const brez = r.napake.filter((n) => /brez primera izpolnljivosti/.test(n)).map((n) => n.match(/ (\w+): predpostavke/)[1]);
  assert.deepEqual(brez, ["golo", "afna", "check", "v_oklepaju"]);
  assert.ok(uporabi("t\n    (by norm_num)", "t"), "argument v naslednji vrstici");
  assert.ok(!uporabi("exact t", "t"));
});

test("»_izpolnljivo« je izvzet le, če je priča za svoj izrek (ga uporabi, brez lastnih predpostavk)", () => {
  const txt = datoteka(`
/-- Razlaga.
trditev: MAT-SS-4/primer#osnova
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
theorem osnova (x : ℝ) (hx : 0 < x) : 0 ≤ x := hx.le

theorem osnova_izpolnljivo : (0 : ℝ) ≤ 1 := osnova 1 one_pos

theorem skrita_trditev_izpolnljivo : (6 : ℝ) / 2 = 3 := by norm_num

/-- Razlaga.
trditev: MAT-SS-4/primer#druga
besedilo: »Za vsak $n$ velja $\\binom{n}{k} = \\binom{n}{n-k}$, kjer je $k \\le n$.« -/
theorem druga (x : ℝ) (hx : 0 < x) : 0 ≤ x := hx.le

theorem druga_izpolnljivo (y : ℝ) (hy : 0 < y) : 0 ≤ y := druga y hy

theorem tuja_izpolnljivo : (0 : ℝ) ≤ 1 := osnova 1 one_pos
`);
  const r = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA);
  const ima = (re) => assert.ok(r.napake.some((n) => re.test(n)), `${re}: ${r.napake.join(" | ")}`);
  ima(/skrita_trditev_izpolnljivo: docstring nima .*ni primer izpolnljivosti za skrita_trditev/);
  ima(/druga_izpolnljivo: docstring nima/);
  ima(/druga: predpostavke hx brez primera/);
  ima(/tuja_izpolnljivo: docstring nima/);
  assert.equal(r.napake.length, 4, r.napake.join(" | "));
});

test("strukture z dokazom (Affine.Triangle, podtip) so predpostavke; primer jih ne sme vzeti kot binder", () => {
  assert.ok(jePredpostavka({ oklep: "(", imena: ["t"], tip: "Affine.Triangle ℝ P" }));
  assert.ok(jePredpostavka({ oklep: "(", imena: ["x"], tip: "{ y : ℝ // 0 < y }" }));
  assert.ok(!jePredpostavka({ oklep: "(", imena: ["P"], tip: "EuclideanSpace ℝ (Fin 2)" }));
  const txt = datoteka(`
/-- Razlaga.
trditev: MAT-SS-4/primer#trikotnik
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
theorem trikotnik (t : Affine.Triangle ℝ (EuclideanSpace ℝ (Fin 2))) : t.points 0 = t.points 0 := rfl

example (t : Affine.Triangle ℝ (EuclideanSpace ℝ (Fin 2))) := trikotnik t
`);
  const r = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA);
  assert.ok(r.napake.some((n) => /trikotnik: predpostavke t brez primera/.test(n)), r.napake.join(" | "));
});

test("»→« v oklepaju brez primera je napaka; stari izreki so v dolgu le z istim podpisom, dolg se le krči", () => {
  const telo = `
/-- Razlaga.
trditev: MAT-SS-4/primer#oklep
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
theorem oklep (a : ℝ) : (1 < a → 0 < a) ∧ (a = a) := ⟨fun h => by linarith, rfl⟩
`;
  const txt = datoteka(telo);
  const ime = "Evklid.Lekcije.MAT_SS_4.Primer.oklep";
  const r0 = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA);
  assert.ok(r0.napake.some((n) => /oklep: predpostavke »→« v sklepu brez primera/.test(n)));
  const podpis = zgostiPodpis(deklaracije(txt).find((d) => d.ime === "oklep").podpis);
  const r1 = preveriDatoteko("x.lean", txt, LEKCIJA, VIR, SHA, new Map([[ime, podpis]]));
  assert.deepEqual(r1.napake, []);
  assert.equal(r1.trditve[0].izpolnljivo, "dolg");
  const spremenjen = datoteka(telo.replace("1 < a → 0 < a", "2 < a → 0 < a"));
  assert.ok(preveriDatoteko("x.lean", spremenjen, LEKCIJA, VIR, SHA, new Map([[ime, podpis]])).napake.some((n) => /brez primera/.test(n)), "sprememba izreka ga vzame iz dolga");
  const sPrimerom = datoteka(`${telo}\nexample := (oklep 2).1 (by norm_num)\n`);
  assert.ok(preveriDatoteko("x.lean", sPrimerom, LEKCIJA, VIR, SHA, new Map([[ime, podpis]])).napake.some((n) => /odstrani ga iz lean\/izpolnljivo-dolg.json/.test(n)));

  // preveri(): nov vnos v dolgu glede na osnovno vejo je napaka
  const koren = fs.mkdtempSync(path.join(os.tmpdir(), "lean-dolg-"));
  fs.mkdirSync(path.join(koren, "content/lessons/MAT-SS-4"), { recursive: true });
  fs.mkdirSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4"), { recursive: true });
  fs.writeFileSync(path.join(koren, VIR), LEKCIJA);
  const pravi = crypto.createHash("sha256").update(LEKCIJA).digest("hex");
  fs.writeFileSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4/Primer.lean"), txt.replace(SHA, pravi));
  fs.writeFileSync(path.join(koren, "lean/izpolnljivo-dolg.json"), JSON.stringify([{ izrek: ime, podpis }]));
  const dir = path.join(koren, "lean/Evklid/Lekcije");
  assert.deepEqual(preveri({ dir, root: koren }).napake, []);
  assert.deepEqual(preveri({ dir, root: koren, osnovaDolga: [{ izrek: ime, podpis }] }).napake, []);
  assert.ok(preveri({ dir, root: koren, osnovaDolga: [] }).napake.some((n) => /nov vnos .*oklep/.test(n)));
  fs.writeFileSync(path.join(koren, "lean/izpolnljivo-dolg.json"), JSON.stringify([{ izrek: ime, podpis }, { izrek: "X.ni", podpis: "0" }]));
  assert.ok(preveri({ dir, root: koren }).napake.some((n) => /X\.ni ni \(več\) izrek/.test(n)));
  fs.rmSync(koren, { recursive: true });
});

test("lean-aksiomi: vsak izrek iz kazala gre v #print axioms (napačno ime v kazalu Lean zavrne)", () => {
  assert.deepEqual(imenaZaPreverjanje(["A.x", "A.y"], [{ izrek: "A.x" }, { izrek: "A.napacno" }]), ["A.x", "A.y", "A.napacno"]);
});
