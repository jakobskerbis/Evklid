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
  ima(/a2: besedilo »To v lekciji ne piše\.« ni v vidnem besedilu/);
  ima(/a3: id MAT-SS-4\/druga#ena ni oblike MAT-SS-4\/primer#/);
  ima(/hip: predpostavke hx brez primera izpolnljivosti/);
  ima(/sklep: predpostavke »→« v sklepu brez primera/);
  ima(/kratek: besedilo »\$k \\le n\$« je krajše od 15 znakov/);
  assert.equal(r.napake.length, 8);
  assert.ok(r.opozorila.some((o) => /isti citat .* ima 4 izreke /.test(o)), r.opozorila.join(" | "));
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

test("lean/oznake-dolg.json: zaklenjena datoteka brez oznak, nov ali spremenjen neoznačen izrek pade, seznam se le krči", () => {
  const koren = fs.mkdtempSync(path.join(os.tmpdir(), "lean-oznake-"));
  fs.mkdirSync(path.join(koren, "content/lessons/MAT-SS-4"), { recursive: true });
  fs.mkdirSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4"), { recursive: true });
  const pravi = crypto.createHash("sha256").update(LEKCIJA).digest("hex");
  const lekcija = (ime) => {
    fs.writeFileSync(path.join(koren, `content/lessons/MAT-SS-4/${ime}.md`), LEKCIJA);
    return `/-\nvir: content/lessons/MAT-SS-4/${ime}.md\nsha256: ${pravi}\n-/\nmodule\n\npublic import Mathlib\n\nnamespace Evklid.Lekcije.MAT_SS_4.X\n`;
  };
  const neoznacena = (ime, dodatek = "") => `${lekcija(ime)}
/-- Razlaga brez oznak. -/
theorem brez (x : ℝ) : x = x := rfl

theorem s_predpostavko (x : ℝ) (hx : 0 < x) : 0 ≤ x := hx.le
${dodatek}
end Evklid.Lekcije.MAT_SS_4.X
`;
  const pot = "lean/Evklid/Lekcije/MAT_SS_4/Stara.lean";
  const vir = "content/lessons/MAT-SS-4/stara.md";
  fs.writeFileSync(path.join(koren, pot), neoznacena("stara"));
  const dir = path.join(koren, "lean/Evklid/Lekcije");
  const podpisi = Object.fromEntries(deklaracije(fs.readFileSync(path.join(koren, pot), "utf8")).filter((d) => d.vrsta === "theorem").map((d) => [d.polnoIme, zgostiPodpis(d.podpis)]));
  const vnos = { pot, vir, izreki: podpisi };
  const zapisi = (x) => fs.writeFileSync(path.join(koren, "lean/oznake-dolg.json"), JSON.stringify(x));
  const brezPric = (r) => r.napake.filter((n) => !/brez primera izpolnljivosti/.test(n));

  // brez seznama: oznake manjkajo
  assert.ok(preveri({ dir, root: koren }).napake.some((n) => /Stara\.lean:\d+ brez: docstring nima/.test(n)));
  // na seznamu: oznake se ne preverjajo, kazala ni, pravilo za priče pa velja
  zapisi([vnos]);
  let r = preveri({ dir, root: koren, osnovaOznak: [vnos] });
  assert.deepEqual(r.trditve, []);
  assert.deepEqual(r.napake.map((n) => n.replace(/^.*?\.lean:\d+ /, "")), ["s_predpostavko: predpostavke hx brez primera izpolnljivosti, ki izrek uporabi (docs/lean.md, »Lekcije (L2)«)"]);
  // nov neoznačen izrek v zaklenjeni datoteki pade; označen se preveri in gre v kazalo
  fs.writeFileSync(path.join(koren, pot), neoznacena("stara", "theorem nov_izrek : (1 : ℕ) = 1 := rfl\n\n/-- R.\ntrditev: MAT-SS-4/stara#ozn\nbesedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/\ntheorem oznacen : (6 : ℝ) / 2 = 3 := by norm_num\n"));
  r = preveri({ dir, root: koren });
  assert.deepEqual(brezPric(r).map((n) => n.replace(/^.*?\.lean:\d+ /, "")), ["nov_izrek: nov ali spremenjen neoznačen izrek v datoteki z lean/oznake-dolg.json; označi ga (»trditev:«/»besedilo:« ali »pomozno«)"]);
  assert.deepEqual(r.trditve.map((t) => t.id), ["MAT-SS-4/stara#ozn"]);
  // spremenjen podpis zaklenjenega izreka pade (in vnos je zastarel)
  fs.writeFileSync(path.join(koren, pot), neoznacena("stara").replace("theorem brez (x : ℝ) : x = x", "theorem brez (x : ℝ) : x + 0 = x"));
  r = preveri({ dir, root: koren });
  assert.ok(r.napake.some((n) => /brez: nov ali spremenjen neoznačen izrek/.test(n)));
  assert.ok(r.napake.some((n) => /oznake-dolg\.json: .*\.brez ni \(več\) neoznačen/.test(n)));
  fs.writeFileSync(path.join(koren, pot), neoznacena("stara"));
  // sprememba »vir:« pade
  zapisi([{ ...vnos, vir: "content/lessons/MAT-SS-4/druga.md" }]);
  assert.ok(preveri({ dir, root: koren }).napake.some((n) => /ni zaklenjeni content\/lessons\/MAT-SS-4\/druga\.md/.test(n)));
  // nova neoznačena datoteka, ki ni na seznamu, pade
  zapisi([vnos]);
  fs.writeFileSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4/Nova.lean"), neoznacena("nova"));
  r = preveri({ dir, root: koren, osnovaOznak: [vnos] });
  assert.ok(r.napake.some((n) => /Nova\.lean:\d+ brez: docstring nima/.test(n)));
  assert.ok(!r.napake.some((n) => /Stara\.lean:\d+ brez: docstring nima/.test(n)));
  fs.rmSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4/Nova.lean"));
  // seznam se ne sme večati: nova pot, nov izrek v vnosu, spremenjen vir glede na osnovo; podvojen vnos; neobstoječa pot
  const osnova = [{ ...vnos, izreki: { [Object.keys(podpisi)[0]]: Object.values(podpisi)[0] } }];
  assert.ok(preveri({ dir, root: koren, osnovaOznak: osnova }).napake.some((n) => /nov ali spremenjen izrek .*s_predpostavko \(dovoljeno le odstranjevanje\)/.test(n)));
  assert.ok(preveri({ dir, root: koren, osnovaOznak: [] }).napake.some((n) => /oznake-dolg\.json: nov vnos .*Stara\.lean/.test(n)));
  assert.ok(preveri({ dir, root: koren, osnovaOznak: [{ ...vnos, vir: "x.md" }] }).napake.some((n) => /Stara\.lean spremenjen vir/.test(n)));
  zapisi([vnos, vnos]);
  assert.ok(preveri({ dir, root: koren }).napake.some((n) => /oznake-dolg\.json: podvojena pot/.test(n)));
  zapisi([vnos, { pot: "lean/Evklid/Lekcije/MAT_SS_4/Ni.lean", vir: "x", izreki: {} }]);
  assert.ok(preveri({ dir, root: koren }).napake.some((n) => /Ni\.lean ne obstaja/.test(n)));
  // osnova ima seznam, PR ga nima
  fs.rmSync(path.join(koren, "lean/oznake-dolg.json"));
  assert.ok(preveri({ dir, root: koren, osnovaOznak: [vnos] }).napake.some((n) => /oznake-dolg\.json manjka, osnovna veja pa ga ima/.test(n)));
  assert.ok(preveri({ dir, root: koren, osnovaDolga: [{ izrek: "X.y", podpis: "0" }] }).napake.some((n) => /izpolnljivo-dolg\.json manjka/.test(n)));
  fs.rmSync(koren, { recursive: true });
});

// --- Pregledi 1, 2, 4 (HEAD 20c8a6c0): obvozi in lažne zavrnitve -------------------------------------------------

const naloga = (ime, telo = "(x : ℝ) (h1 : x > 1) (h2 : x < 0) : (2 : ℝ) = 3 := by linarith") => `/-- Razlaga.
trditev: MAT-SS-4/primer#${ime.replaceAll("_", "-").toLowerCase()}
besedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/
theorem ${ime} ${telo}
`;
const napakePri = (telo) => preveriDatoteko("x.lean", datoteka(telo), LEKCIJA, VIR, SHA).napake;
const brezPrimera = (telo) => napakePri(telo).filter((n) => /brez primera izpolnljivosti/.test(n)).map((n) => n.match(/ ([^\s:]+): predpostavke/)[1]);

test("»variable« s predpostavko in »include« sta napaka; »variable« s tipi in razredi ne", () => {
  const n = napakePri(`section
variable (w : (1 : ℕ) = 0)
include w
variable {R : Type*} [CommRing R] (n : ℕ)
${naloga("lazna", ": (2 : ℕ) = 3 := by omega")}
end`);
  assert.ok(n.some((x) => /»variable« s predpostavko w/.test(x)), n.join(" | "));
  assert.ok(n.some((x) => /»include« v datoteki lekcije/.test(x)));
  assert.equal(n.filter((x) => /variable|include/.test(x)).length, 2);
});

test("ime v «…»: znotraj ni komentarja ali niza; ime gre v kazalo in aksiome", () => {
  for (const telo of [naloga("lazna", "(«a--» : ℕ) (w : (1 : ℕ) = 0) :\n    «a--» = «a--» + 1\n    := by omega"), naloga("lazna", "(«x\"» : ℕ) (w : (1 : ℕ) = 0) («y\"» : ℕ) : «x\"» = «x\"» := rfl")]) {
    assert.deepEqual(brezPrimera(telo), ["lazna"], telo);
  }
  const txt = datoteka("theorem «moj izrek» : True := trivial\n");
  assert.deepEqual(deklaracije(txt).map((d) => d.polnoIme), ["Evklid.Lekcije.MAT_SS_4.Primer.«moj izrek»"]);
  assert.deepEqual(aksiomiIzreki(txt), ["Evklid.Lekcije.MAT_SS_4.Primer.«moj izrek»"]);
});

test("delna uporaba: primer mora podati vse eksplicitne predpostavke (po mestu ali z imenom, z @ vse do zadnje)", () => {
  assert.deepEqual(brezPrimera(`${naloga("nemogoce")}\nexample := nemogoce 0\n`), ["nemogoce"]);
  assert.deepEqual(brezPrimera(`${naloga("nemogoce")}\nexample := nemogoce 0 (by simp)\n`), ["nemogoce"]);
  assert.deepEqual(brezPrimera(`${naloga("polna")}\nexample := polna 0 (by simp) (by simp)\n`), []);
  assert.deepEqual(brezPrimera(`${naloga("imenovani")}\nexample := imenovani (h1 := w.1) (h2 := w.2)\n`), []);
  assert.deepEqual(brezPrimera(`${naloga("en_imenovan")}\nexample := en_imenovan (h1 := w.1)\n`), ["en_imenovan"]);
  assert.deepEqual(brezPrimera(`${naloga("afna", "{x : ℝ} (h1 : x > 1) : x = x := rfl")}\nexample := @afna 2\n`), ["afna"]);
  assert.deepEqual(brezPrimera(`${naloga("afna2", "{x : ℝ} (h1 : x > 1) : x = x := rfl")}\nexample := @afna2 2 (by norm_num)\n`), []);
  assert.deepEqual(brezPrimera(`${naloga("vrstica")}\nexample :=\n  vrstica 0\n    (by simp) (by simp)\n`), [], "argumenti v bolj zamaknjeni naslednji vrstici");
  // »fun«/»λ« takoj za »:=« predpostavko le prestavi v primer
  assert.deepEqual(brezPrimera(`${naloga("fun_h")}\nexample := fun (h : (1 : ℕ) = 0) => fun_h 0 (absurd h (by simp)) (absurd h (by simp))\n`), ["fun_h"]);
  assert.deepEqual(brezPrimera(`${naloga("lam_h")}\nexample := λ (h : (1 : ℕ) = 0) => lam_h 0 (absurd h (by simp)) (absurd h (by simp))\n`), ["lam_h"]);
});

test("predpostavka v sklepu: »∀ _ : P,«, »→« v oklepaju v »∨« in »↔«; »(n : ℕ) → …« ni predpostavka", () => {
  assert.ok(implikacija("∀ _w : (1:ℕ) = 0, (2:ℕ) = 3"));
  assert.ok(implikacija("x = x ∨ ((1:ℕ) = 0 → (2:ℕ) = 3)"));
  assert.ok(implikacija("(2:ℕ) = 3 ↔ ((1:ℕ) = 0 → (2:ℕ) = 3)"));
  assert.ok(!implikacija("(n : ℕ) → n = n"));
  assert.ok(implikacija("(h : (1:ℕ) = 0) → (2:ℕ) = 3"));
  assert.ok(!implikacija("∀ f : ℝ → ℝ, f = f"));
  assert.deepEqual(brezPrimera(naloga("pi", ": (n : ℕ) → n = n := fun _ => rfl")), []);
  // primer s predpostavko »∀ _ : P,« v tipu ni priča
  assert.deepEqual(brezPrimera(`${naloga("t_vt")}\nexample : ∀ _w : (1 : ℕ) = 0, (2 : ℝ) = 3 := fun w => t_vt 0 (absurd w (by simp)) (absurd w (by simp))\n`), ["t_vt"]);
});

test("jePredpostavka: False, IsEmpty, Nonempty, Convex…, NeZero, razred brez spremenljivke izreka; ℝ≥0 je tip", () => {
  for (const tip of ["False", "IsEmpty ℝ", "Nonempty S", "ConvexOn ℝ Set.univ f", "Convex ℝ D", "NeZero n"]) assert.ok(jePredpostavka({ oklep: "(", imena: ["w"], tip }), tip);
  assert.ok(!jePredpostavka({ oklep: "(", imena: ["x"], tip: "ℝ≥0" }));
  assert.ok(!jePredpostavka({ oklep: "(", imena: ["x"], tip: "ℝ≥0∞" }));
  assert.deepEqual(brezPrimera(naloga("nnreal", "(x : ℝ≥0) : x = x := rfl")), [], "ℝ≥0 ni predpostavka (lažna zavrnitev)");
  assert.deepEqual(brezPrimera(naloga("fintype", "[Fintype ℝ] : (2 : ℕ) = 3 := by sorry")), ["fintype"]);
  assert.deepEqual(brezPrimera(naloga("razred", "{R : Type*} [CommRing R] (a : R) : a = a := rfl")), []);
  assert.deepEqual(brezPrimera(`section\nvariable {V : Type*}\n${naloga("razred_var", "[AddCommGroup V] (a : V) : a = a := rfl")}\nend`), [], "spremenljivka iz »variable«");
});

test("konec ukaza: vrstica v stolpcu 0 (»macro_rules«, »#check«) konča primer; »#s« v dokazu ne; »mutual … end« ne zapre prostora", () => {
  assert.deepEqual(brezPrimera(`${naloga("makro")}\nexample : True := trivial\nmacro_rules | \`(zz) => \`(makro 0 (by simp) (by simp))\n`), ["makro"]);
  assert.deepEqual(brezPrimera(`${naloga("check")}\nexample : True := trivial\n#check check 0 (by simp) (by simp)\n`), ["check"]);
  assert.deepEqual(brezPrimera(`${naloga("kard")}\nexample : True := by\n  have := #s\n  exact (fun _ => trivial) (kard 0 (by simp) (by simp))\n`), [], "»#s« ni ukaz");
  const d = deklaracije(datoteka("mutual\ntheorem m1 : True := trivial\nend\ntheorem po : True := trivial\n"));
  assert.deepEqual(d.map((x) => x.polnoIme), ["Evklid.Lekcije.MAT_SS_4.Primer.m1", "Evklid.Lekcije.MAT_SS_4.Primer.po"]);
});

test("priča po polnem imenu: istoimenski izrek v drugem prostoru ne šteje, polno ime šteje", () => {
  const txt = `namespace A\n${naloga("t")}\nend A\nnamespace B\n${naloga("u", "(x : ℝ) (h1 : x > 1) : x = x := rfl").replace("theorem u ", "theorem t ")}\nexample := t 2 (by norm_num)\nend B\n`;
  assert.deepEqual(napakePri(txt).filter((n) => /brez primera/.test(n)).map((n) => n.replace(/^x\.lean:\d+ /, "").slice(0, 25)), ["t: predpostavke h1, h2 br"], "A.t nima priče, B.t jo ima");
  assert.deepEqual(brezPrimera(`${naloga("polno", "(x : ℝ) (h1 : x > 1) : x = x := rfl")}\nexample := Evklid.Lekcije.MAT_SS_4.Primer.polno 2 (by norm_num)\n`), [], "polno ime (lažna zavrnitev)");
});

test("robni primeri: '\"' brez surovega niza, glava tabele, foo_izpolnljivo z def, pomozno+trditev, velike črke v id, gnezdeni komentar", () => {
  assert.ok(deklaracije("def c : Char := '\"'\ntheorem skrit : True := trivial\n").some((d) => d.ime === "skrit"));
  assert.ok(!deklaracije("/- a /- b -/ theorem skrit : True := trivial -/\ntheorem z : True := trivial").some((d) => d.ime === "skrit"));
  const md = `${LEKCIJA}\n| kvadrant | sin | cos |\n|---|---|---|\n| I. | $+$ | $+$ |\n`;
  const tab = preveriDatoteko("x.lean", datoteka(`/-- R.\ntrditev: MAT-SS-4/primer#tab\nbesedilo: »| kvadrant | sin | cos |« -/\ntheorem tab : (1 : ℕ) = 1 := rfl\n`), md, VIR, SHA).napake;
  assert.ok(tab.some((n) => /je glava tabele/.test(n)), tab.join(" | "));
  const defIzp = napakePri("def foo : ℕ := 1\ntheorem foo_izpolnljivo : foo = 1 := rfl\n");
  assert.ok(defIzp.some((n) => /foo_izpolnljivo: docstring nima .*ni primer izpolnljivosti za foo/.test(n)), defIzp.join(" | "));
  assert.ok(napakePri("/-- R.\ntrditev: MAT-SS-4/primer#x\npomozno -/\ntheorem obe : (1 : ℕ) = 1 := rfl\n").some((n) => /»pomozno« in »trditev:« hkrati/.test(n)));
  assert.ok(napakePri("/-- R.\ntrditev: MAT-SS-4/primer#Velike\nbesedilo: »Pri deljenju je $\\frac{6}{2}\\,=\\,3$.« -/\ntheorem velike : (1 : ℕ) = 1 := rfl\n").some((n) => /id MAT-SS-4\/primer#Velike ni oblike/.test(n)));
});

test("»pomozno« pri izreku iz »Preveri se« je napaka brez razloga; z »pomozno – razlog« ne", () => {
  assert.ok(napakePri("/-- Preveri se 2: 2 = 2.\npomozno -/\ntheorem kv : (2 : ℕ) = 2 := rfl\n").some((n) => /»pomozno« pri izreku iz »Preveri se«/.test(n)));
  assert.ok(napakePri("/-- Orodje.\npomozno -/\ntheorem kviz9 : (2 : ℕ) = 2 := rfl\n").some((n) => /»pomozno« pri izreku iz »Preveri se«/.test(n)), "po imenu");
  assert.deepEqual(napakePri("/-- Preveri se 2: 2 = 2.\npomozno – razlaga kviza števila ne navede -/\ntheorem kv : (2 : ℕ) = 2 := rfl\n"), []);
});

test("preveri(): sha256 lekcije, podvojen vnos v dolgu", () => {
  const koren = fs.mkdtempSync(path.join(os.tmpdir(), "lean-sha-"));
  fs.mkdirSync(path.join(koren, "content/lessons/MAT-SS-4"), { recursive: true });
  fs.mkdirSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4"), { recursive: true });
  fs.writeFileSync(path.join(koren, VIR), LEKCIJA);
  fs.writeFileSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4/Primer.lean"), datoteka(""));
  const dir = path.join(koren, "lean/Evklid/Lekcije");
  assert.ok(preveri({ dir, root: koren }).napake.some((n) => /spremenjena po dokazu/.test(n)));
  fs.writeFileSync(path.join(koren, "lean/izpolnljivo-dolg.json"), JSON.stringify([{ izrek: "A.b", podpis: "1" }, { izrek: "A.b", podpis: "1" }]));
  assert.ok(preveri({ dir, root: koren }).napake.some((n) => /izpolnljivo-dolg\.json: podvojen izrek/.test(n)));
  fs.rmSync(koren, { recursive: true });
});

test("sporočila: sklanjanje »izrekov«, »…« le pri prirezanem citatu, dolžina v kodnih točkah", async () => {
  const { izrekov, prirezi } = await import("../scripts/lean-lekcije.mjs");
  assert.deepEqual([1, 2, 3, 4, 5, 101, 102, 104].map(izrekov), ["1 izrek", "2 izreka", "3 izreke", "4 izreke", "5 izrekov", "101 izrek", "102 izreka", "104 izreke"]);
  assert.equal(prirezi("kratko", 60), "kratko");
  assert.equal(prirezi("𝔸".repeat(61), 60), `${"𝔸".repeat(60)}…`);
  // 8 kodnih točk je 16 enot UTF-16 (𝔸 je par nadomestkov): še vedno prekratko
  const n = preveriDatoteko("x.lean", datoteka("/-- R.\ntrditev: MAT-SS-4/primer#k\nbesedilo: »𝔸𝔸𝔸𝔸𝔸𝔸𝔸𝔸« -/\ntheorem k : (1 : ℕ) = 1 := rfl\n"), `${LEKCIJA}\n𝔸𝔸𝔸𝔸𝔸𝔸𝔸𝔸\n`, VIR, SHA).napake;
  assert.deepEqual(n.map((x) => x.replace(/^.*?: /, "")), ["besedilo »𝔸𝔸𝔸𝔸𝔸𝔸𝔸𝔸« je krajše od 15 znakov (daljši citat ali »besedilo-kratko: <razlog>«)"]);
});

test("robni primeri 2: opozorilo pri »pomozno« s primerom, vzorci »| …«, primer konča pri naslednji deklaraciji v isti vrstici, glava in podvojen vir", () => {
  const r = preveriDatoteko("x.lean", datoteka("/-- Pomožno za Primer 2.\npomozno -/\ntheorem orodje : (1 : ℕ) = 1 := rfl\n"), LEKCIJA, VIR, SHA);
  assert.ok(r.opozorila.some((o) => /orodje: »pomozno«, docstring pa omenja primer/.test(o)));
  const vz = deklaracije(datoteka("theorem rek : ℕ → ℕ\n  | 0 => 0\n  | n + 1 => n\n"));
  assert.equal(vz[0].izjava, "ℕ → ℕ");
  assert.deepEqual(brezPrimera(`${naloga("ista")}\nexample : True := trivial theorem drugi : True := (fun _ => trivial) (ista 0 (by simp) (by simp))\n`).filter((x) => x === "ista"), ["ista"]);
  const koren = fs.mkdtempSync(path.join(os.tmpdir(), "lean-vir-"));
  fs.mkdirSync(path.join(koren, "content/lessons/MAT-SS-4"), { recursive: true });
  fs.mkdirSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4"), { recursive: true });
  fs.writeFileSync(path.join(koren, VIR), LEKCIJA);
  const pravi = crypto.createHash("sha256").update(LEKCIJA).digest("hex");
  fs.writeFileSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4/A.lean"), datoteka("").replace(SHA, pravi));
  fs.writeFileSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4/B.lean"), datoteka("").replace(SHA, pravi));
  fs.writeFileSync(path.join(koren, "lean/Evklid/Lekcije/MAT_SS_4/C.lean"), "theorem brez_glave : True := trivial\n");
  const n = preveri({ dir: path.join(koren, "lean/Evklid/Lekcije"), root: koren }).napake;
  assert.ok(n.some((x) => /B\.lean: lekcija .* ima že drugo datoteko/.test(x)), n.join(" | "));
  assert.ok(n.some((x) => /C\.lean: v glavi manjka »vir:«/.test(x)));
  fs.rmSync(koren, { recursive: true });
});

// --- Zadnji krog pregledov (eb84ee07) ---------------------------------------------------------------------------

test("predpostavka v »{…}« ali »⦃…⦄« mora biti podana z imenom ali z »@«", () => {
  assert.deepEqual(brezPrimera(`${naloga("strogo", "(x : ℝ) ⦃h1 : x > 1⦄ ⦃h2 : x < 0⦄ : (2 : ℝ) = 3 := by linarith")}\nexample := strogo 0\n`), ["strogo"]);
  assert.deepEqual(brezPrimera(`${naloga("impl", "(x : ℝ) {h1 : x > 1} {h2 : x < 0} : (2 : ℝ) = 3 := by linarith")}\nexample := impl (x := 0)\n`), ["impl"]);
  assert.deepEqual(brezPrimera(`${naloga("impl2", "(x : ℝ) {h1 : x > 1} : x = x := rfl")}\nexample := impl2 2 (h1 := by norm_num)\n`), []);
  assert.deepEqual(brezPrimera(`${naloga("impl3", "(x : ℝ) {h1 : x > 1} : x = x := rfl")}\nexample := @impl3 2 (by norm_num)\n`), []);
  // »@« s spremenljivkami v »{…}« in razredom: vse po mestu do zadnje predpostavke
  assert.deepEqual(brezPrimera(`${naloga("afna3", "{R : Type*} [LinearOrder R] (x : R) (h : x < x) : False := lt_irrefl x h")}\nexample := @afna3 ℕ _ 0\n`), ["afna3"]);
  assert.deepEqual(brezPrimera(`${naloga("afna4", "{R : Type*} [LinearOrder R] (x : R) (h : x ≤ x) : x = x := rfl")}\nexample := @afna4 ℕ _ 0 le_rfl\n`), []);
});

test("»variable«/»include« kjerkoli (za »open … in«, za drugim ukazom); binderji do naslednjega ukaza", () => {
  const n = napakePri(`section variable (w : (1 : ℕ) = 0) include w
open Nat in variable (v : (2 : ℕ) = 0)
variable (a : ℕ)
(u : (3 : ℕ) = 0)
  include u
${naloga("lazna", ": (2 : ℕ) = 3 := by omega")}
end`);
  for (const ime of ["w", "v", "u"]) assert.ok(n.some((x) => new RegExp(`»variable« s predpostavko ${ime} `).test(x)), `${ime}: ${n.join(" | ")}`);
  assert.equal(n.filter((x) => /»include«/.test(x)).length, 2);
});

test("konec primera tudi pred zamaknjenim ukazom (»#check«, »macro_rules«)", () => {
  assert.deepEqual(brezPrimera(`${naloga("zcheck")}\nexample : True := trivial\n  #check zcheck 0 (by simp) (by simp)\n`), ["zcheck"]);
  assert.deepEqual(brezPrimera(`${naloga("zmakro")}\nexample : True := trivial\n  macro_rules | \`(zz) => \`(zmakro 0 (by simp) (by simp))\n`), ["zmakro"]);
});

test("»¬« v tipu primera je predpostavka (razen če je zanikanje v sklepu izreka)", () => {
  assert.deepEqual(brezPrimera(`${naloga("neg1")}\nexample : ¬ (1 : ℕ) = 0 := by intro w; exact neg1 0 (absurd w (by norm_num)) (absurd w (by norm_num))\n`), ["neg1"]);
  assert.deepEqual(brezPrimera(`${naloga("neg2")}\nexample : ¬ (1 : ℕ) = 0 := (fun w => neg2 0 (absurd w (by norm_num)) (absurd w (by norm_num)))\n`), ["neg2"]);
  assert.deepEqual(brezPrimera(`${naloga("neg3", "(a : ℝ) (h : a < 0) : ¬ 0 < a := not_lt.2 h.le")}\nexample : ¬ (0 : ℝ) < -1 := neg3 (-1) (by norm_num)\n`), [], "zanikanje v sklepu");
});

test("ime izreka, vezano v primeru z »let«/»have«/»fun«/»match«, ne šteje", () => {
  assert.deepEqual(brezPrimera(`${naloga("senca")}\nexample : True := let senca := fun (_ _ _ : ℕ) => trivial; senca 0 0 0\n`), ["senca"]);
  assert.deepEqual(brezPrimera(`${naloga("senca2")}\nexample : True := by\n  have senca2 : ℕ → ℕ → ℕ → True := fun _ _ _ => trivial\n  exact senca2 0 0 0\n`), ["senca2"]);
  assert.deepEqual(brezPrimera(`${naloga("senca3")}\nexample : True := (fun senca3 => senca3 0 0 0) (fun (_ _ _ : ℕ) => trivial)\n`), ["senca3"]);
  assert.deepEqual(brezPrimera(`${naloga("senca4")}\nexample : True := match (fun (_ _ _ : ℕ) => trivial) with | senca4 => senca4 0 0 0\n`), ["senca4"]);
});

test("preživele mutacije: T_izpolnljivo brez T, imenski prostori, by/fun/λ kot argument, ∨ v tipu primera, _root_", () => {
  // T_izpolnljivo, ki T ne uporabi, ni priča (in T ostane brez primera)
  assert.deepEqual(brezPrimera(`${naloga("osn")}\ntheorem osn_izpolnljivo : (2 : ℝ) = 2 := rfl\n`), ["osn"]);
  // T_izpolnljivo v drugem imenskem prostoru ni priča za T
  assert.deepEqual(brezPrimera(`${naloga("osn2", "(x : ℝ) (h1 : x > 1) : x = x := rfl")}\nnamespace D\ntheorem osn2_izpolnljivo : (2 : ℝ) = 2 := Evklid.Lekcije.MAT_SS_4.Primer.osn2 2 (by norm_num)\nend D\n`), ["osn2"]);
  // tuj imenski prostor: »C.t« ne razreši izreka »Primer.t«; nadrejen prostor pa razreši
  assert.deepEqual(brezPrimera(`${naloga("tt", "(x : ℝ) (h1 : x > 1) : x = x := rfl")}\nexample := C.tt 2 (by norm_num)\n`), ["tt"]);
  assert.deepEqual(brezPrimera(`${naloga("tt2", "(x : ℝ) (h1 : x > 1) : x = x := rfl")}\nnamespace Pod\nexample := tt2 2 (by norm_num)\nend Pod\n`), []);
  assert.deepEqual(brezPrimera(`namespace Pod\n${naloga("tt3", "(x : ℝ) (h1 : x > 1) : x = x := rfl")}\nend Pod\nexample := tt3 2 (by norm_num)\n`), ["tt3"], "izrek v podprostoru brez predpone");
  assert.deepEqual(brezPrimera(`namespace Pod\n${naloga("tt4", "(x : ℝ) (h1 : x > 1) : x = x := rfl")}\nend Pod\nexample := Pod.tt4 2 (by norm_num)\n`), []);
  // »by …«, »fun …« in »λ …« kot zadnji argument štejejo
  assert.deepEqual(brezPrimera(`${naloga("zby", "(x : ℝ) (h1 : x > 1) : x = x := rfl")}\nexample := zby 2 by norm_num\n`), []);
  assert.deepEqual(brezPrimera(`${naloga("zfun", "(f : ℕ → ℕ) (h1 : ∀ n, f n = n) : f 0 = 0 := h1 0")}\nexample := zfun fun n => n\n`), ["zfun"], "fun je en argument (f), h1 manjka");
  assert.deepEqual(brezPrimera(`${naloga("zlam", "(f : ℕ → ℕ) (h1 : ∀ n, f n = n) : f 0 = 0 := h1 0")}\nexample := zlam (fun n => n) λ _ => rfl\n`), []);
  // ∨/↔ v tipu primera nista predpostavka (priča za izrek s sklepom »∨«)
  assert.deepEqual(brezPrimera(`${naloga("ali", "(x : ℝ) (h1 : x ≠ 0) : 0 < x ∨ x < 0 := h1.lt_or_lt.symm")}\nexample : (0 : ℝ) < 1 ∨ (1 : ℝ) < 0 := ali 1 one_ne_zero\n`), []);
  // _root_.
  assert.equal(deklaracije(datoteka("theorem _root_.koren_izrek : True := trivial\n"))[0].polnoIme, "koren_izrek");
});

test("preživele mutacije 2: ključna beseda za imenom ni argument, »<|«, »(t).2 …«, »→« v tipu primera", () => {
  assert.deepEqual(brezPrimera(`${naloga("zw", "(h1 : (1 : ℕ) = 0) : False := absurd h1 (by simp)")}\nexample : False := by\n  rcases zw with ⟨⟩\n`), ["zw"]);
  assert.deepEqual(brezPrimera(`${naloga("zd", "(h1 : (1 : ℕ) = 1) : True := trivial")}\nexample := zd <| rfl\n`), []);
  assert.deepEqual(brezPrimera(`${naloga("zp", ": (1 : ℕ) = 1 ∧ ∀ x : ℝ, 0 < x → 0 ≤ x := ⟨rfl, fun _ h => h.le⟩")}\nexample := (zp).2 1 one_pos\n`), []);
  assert.deepEqual(brezPrimera(`${naloga("zi")}\nexample : (1 : ℕ) = 0 → (2 : ℝ) = 3 := by\n  intro w\n  exact zi 0 (absurd w (by norm_num)) (absurd w (by norm_num))\n`), ["zi"]);
});

test("tip primera z »∨« omejenih »∀« (sklep izreka) ni predpostavka primera", () => {
  assert.deepEqual(brezPrimera(`${naloga("zs", "(S : Set ℝ) (h : S = Set.univ) : (∀ x ∈ S, 0 ≤ x ^ 2) ∨ False := Or.inl fun x _ => sq_nonneg x")}\nexample : (∀ x ∈ (Set.univ : Set ℝ), 0 ≤ x ^ 2) ∨ False := zs Set.univ rfl\n`), []);
});
