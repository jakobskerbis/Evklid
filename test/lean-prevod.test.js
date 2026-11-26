// PV-13 (docs/preverjanje.md, »Prevod v Lean«): deterministični prevod trditve v Lean in primerjava prevoda z
// izvirnikom. Brez Leana (Lean teče v .github/workflows/lean-prevod.yml).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { prevedi, oblikaIzRacuna } from "../server/preverjanje/lean-prevod.js";
import { skladnost, obratno, leanDokaz } from "../server/preverjanje/lean-obratno.js";
import { razcleni, konstanta, Q } from "../server/preverjanje/lean-izraz.js";
import { datotekaLean, preberiIzpis, prevediVse, merjenjeFormalizacij } from "../scripts/lean-prevod.mjs";

const nabor = JSON.parse(readFileSync(new URL("./fixtures/preverjanje/nabor-v2.json", import.meta.url), "utf8")).primeri;

test("razčlenjevalnik: implicitno množenje, potence, konstante", () => {
  assert.equal(konstanta(razcleni("2^(-3)")).toString(), "1/8");
  assert.equal(konstanta(razcleni("-3^2")).toString(), "-9");
  assert.equal(konstanta(razcleni("0.75")).toString(), "3/4");
  assert.equal(konstanta(razcleni("2(3+1)")).toString(), "8");
  assert.equal(razcleni("sin(x)"), null); // zunaj obsega
  assert.equal(razcleni("e^x"), null); // e je konstanta v worker.py
  assert.equal(razcleni("x^(1/2)"), null); // necel eksponent
  assert.equal(razcleni("xy"), null); // ime iz več črk
});

test("prevod: vsako število je realno, enačba je ekvivalenca s celo množico rešitev", () => {
  const r = prevedi(["solve", ["4*x^2-3*x-27=0", "x", "-9/4, 3"]]);
  assert.ok(r.ok);
  assert.match(r.izrek, /^∀ x : ℝ, /);
  assert.ok(r.izrek.includes("↔"));
  assert.ok(!/\(\d+(\/\d+)? : ℕ\)/.test(r.izrek));
  for (const m of r.izrek.matchAll(/ : ([^ ,)]+)/g)) assert.equal(m[1], "ℝ");
  // račun brez spremenljivk: deljenje v ℝ, ne v ℕ
  const v = prevedi(["value", ["5/4+8/4", "13/4"]]);
  assert.equal(v.izrek, "(((5 : ℝ) / (4 : ℝ)) + ((8 : ℝ) / (4 : ℝ))) = ((13 : ℝ) / (4 : ℝ))");
  // območje: imenovalec ≠ 0 in koren ≥ 0 sta pogoja
  assert.ok(prevedi(["solve", ["(x^2-36)/(x-6)=12", "x", "none"]]).izrek.includes("(x - (6 : ℝ)) ≠ (0 : ℝ) ∧"));
  assert.ok(prevedi(["solve", ["sqrt(x+2)=2", "x", "2"]]).izrek.includes("(0 : ℝ) ≤ (x + (2 : ℝ))"));
  // neenačba: intervali kot meje
  assert.ok(prevedi(["ineq", ["x^2-3*x>0", "x", "(-oo, 0) U (3, oo)"]]).izrek.endsWith("↔ ((x < (0 : ℝ)) ∨ ((3 : ℝ) < x))"));
});

test("prevod: zunaj obsega ostane pri SymPy", () => {
  assert.equal(prevedi(["diff", ["x^3", "x", "3*x^2"]]).ok, false);
  assert.equal(prevedi(["solve", ["sin(x)=0", "x", "k*pi"]]).ok, false);
  assert.equal(prevedi(["solve", ["x^2=2000000", "x", "≈1414.2, ≈-1414.2"]]).ok, false);
  assert.equal(prevedi(["value", ["1/0", "0"]]).ok, false); // nedefiniran
  assert.equal(prevedi(["value", ["sqrt(-4)", "0"]]).ok, false); // v Leanu bi bil √(−4) = 0
  assert.equal(prevedi(["ineq", ["x^2>=0", "x", "(-oo, oo)"]]).ok, false); // vsa števila
  // prazno območje: 1/(1/R − 1/R) ni nikjer definiran, izrek bi bil prazno resničen
  assert.equal(prevedi(["equal", ["1/(1/R-1/R*1)", "R*R*1/(R*1-R)"]]).razlog, "prazno definicijsko območje");
  // koren izraza s spremenljivko v identiteti: območje je lahko ena točka
  assert.equal(prevedi(["equal", ["sqrt(x)", "sqrt(-x)"]]).ok, false);
});

test("predloge dokaza: brez prepovedanih ukazov, vsaka predloga je cel dokaz", () => {
  for (const p of nabor.slice(0, 400)) {
    const r = p.racun && prevedi(p.racun);
    if (!r || !r.ok) continue;
    for (const d of r.dokazi) assert.ok(!/\b(sorry|admit|axiom|native_decide|set_option|import)\b|#/.test(d), `${p.id}: ${d}`);
    assert.ok(!/[\r\n]/.test(r.izrek));
  }
  // ime spremenljivke h ne trči z imeni hipotez
  const r = prevedi(["solve", ["800*10=1000*h", "h", "8"]]);
  assert.ok(r.ok && r.dokazi[0].includes("intro hE"));
});

test("skladnost: vsak lasten prevod nabora je skladen z izvirnikom", () => {
  const { prevodi, neskladni } = prevediVse(nabor);
  assert.ok(prevodi.length > 500, `prevedenih ${prevodi.length}`);
  assert.deepEqual(neskladni, []);
});

test("skladnost: napačni prevodi so neskladni", () => {
  const r = ["solve", ["4*x^2-3*x-27=0", "x", "-9/4, 3"]];
  const prav = "∀ x : ℝ, 4*x^2 - 3*x - 27 = 0 ↔ x = -9/4 ∨ x = 3";
  assert.equal(skladnost(r, prav).skladno, true);
  for (const [izrek, zakaj] of [
    ["∀ x : ℝ, 4*x^2 - 3*x - 27 = 0 → x = -9/4 ∨ x = 3", "samo ena smer"],
    ["∀ x : ℝ, 4*x^2 - 3*x - 27 = 0 ↔ x = 3", "manjka rešitev"],
    ["∀ x : ℝ, 4*x^2 - 3*x - 27 = 0 ↔ x = -9/4 ∨ x = 3 ∨ x = 0", "tuja rešitev"],
    ["∀ x : ℕ, 4*x^2 - 3*x - 27 = 0 ↔ x = 3", "naravna števila"],
    ["∀ x : ℝ, 4*x*2 - 3*x - 27 = 0 ↔ x = -9/4 ∨ x = 3", "x*2 namesto x^2"],
    ["∀ x : ℝ, 0 < x → (4*x^2 - 3*x - 27 = 0 ↔ x = 3)", "dodatna predpostavka"],
    ["∃ x : ℝ, 4*x^2 - 3*x - 27 = 0", "∃"],
    ["∀ y : ℝ, 4*y^2 - 3*y - 27 = 0 ↔ y = -9/4 ∨ y = 3", "druga spremenljivka"],
    ["∀ x : ℝ, 4*x^2 - 3*x - 27 = 0 ↔ x = -9/4 ∨ x = 3 := by sorry", "dokaz v izreku"],
  ])
    assert.equal(skladnost(r, izrek).skladno, false, zakaj);
  // račun: brez tipa je ℕ (5/4 + 8/4 = 1 + 2 = 3)
  assert.equal(skladnost(["value", ["5/4+8/4", "13/4"]], "5 / 4 + 8 / 4 = 13 / 4").skladno, false);
  assert.equal(skladnost(["value", ["5/4+8/4", "13/4"]], "(5 / 4 + 8 / 4 : ℝ) = 13 / 4").skladno, true);
  // manjkajoč pogoj imenovalca: v Leanu je x/0 = 0
  const l = ["ineq", ["(x-5)/(x-8)<=0", "x", "[5, 8)"]];
  assert.equal(skladnost(l, "∀ x : ℝ, (x - 5) / (x - 8) ≤ 0 ↔ 5 ≤ x ∧ x < 8").skladno, false);
  assert.equal(skladnost(l, "∀ x : ℝ, (x ≠ 8 ∧ (x - 5) / (x - 8) ≤ 0) ↔ x < 8 ∧ x ≥ 5").skladno, true);
  assert.equal(skladnost(l, "∀ x : ℝ, (x ≠ 8 ∧ (x - 5) / (x - 8) ≤ 0) ↔ 5 ≤ x ∧ x ≤ 8").skladno, false);
  // vzorčenje ne zamenja |·| in linearnega izraza (meja zunaj običajnih točk)
  assert.equal(skladnost(["ineq", ["x-2000<0", "x", "(-oo, 2000)"]], "∀ x : ℝ, -|x - 2000| < 0 ↔ x < 2000").skladno, false);
  // prazna množica rešitev: ¬ (…) in A ≠ B
  assert.equal(skladnost(["solve", ["x^2+1=0", "x", "none"]], "∀ x : ℝ, x ^ 2 + 1 ≠ 0").skladno, true);
  assert.equal(skladnost(["solve", ["x^2+1=0", "x", "none"]], "∀ x : ℝ, ¬ (x ^ 2 + 1 = 0)").skladno, true);
});

test("obratni prevod: beli seznam", () => {
  assert.throws(() => obratno("∀ x : ℝ, x = Real.pi"));
  assert.throws(() => obratno("∀ x : ℝ, x ^ 1000000 = x"));
  assert.throws(() => obratno("∀ x : ℝ, x = 1\n#eval 1"));
  assert.throws(() => obratno("∀ x : ℝ, 1 < x < 2"));
  assert.throws(() => obratno("(|5 - 7| : ℝ) = |2|"));
  assert.doesNotThrow(() => obratno("∀ x : ℝ, √(x + 1) ^ 2 = x + 1"));
});

test("leanDokaz: šteje le skladen, dokazan izrek z dovoljenimi aksiomi", () => {
  const r = ["solve", ["3*x+5=0", "x", "-5/3"]];
  const { izrek } = prevedi(r);
  const ok = { izid: "proved", aksiomi: ["propext", "Classical.choice", "Quot.sound"] };
  assert.equal(leanDokaz(r, izrek, ok).how, "formal");
  assert.equal(leanDokaz(r, izrek, { ...ok, aksiomi: ["sorryAx"] }), null);
  assert.equal(leanDokaz(r, izrek, { izid: "failed" }), null);
  assert.equal(leanDokaz(r, "∀ x : ℝ, 3*x+5 = 0 → x = -5/3", ok), null);
});

test("datoteka Lean in branje izpisa", () => {
  const p = [{ id: "a", izrek: "(1 : ℝ) = 1", dokazi: ["norm_num", "rfl"] }];
  const { besedilo, izreki } = datotekaLean(p);
  assert.ok(besedilo.startsWith("import Mathlib\n"));
  assert.equal(izreki.length, 2);
  assert.throws(() => datotekaLean([{ id: "b", izrek: "True", dokazi: ["sorry"] }]));
  assert.throws(() => datotekaLean([{ id: "c", izrek: "True", dokazi: ["trivial\n#eval 1"] }]));
  const [a, b] = izreki;
  const izpis = [
    JSON.stringify({ pos: { line: a.aksiomi }, severity: "information", data: `'${a.ime}' depends on axioms: [propext]` }),
    JSON.stringify({ pos: { line: b.zacetek + 1 }, severity: "error", data: "unsolved goals" }),
    JSON.stringify({ pos: { line: b.aksiomi }, severity: "information", data: `'${b.ime}' depends on axioms: [sorryAx]` }),
  ].join("\n");
  const [ia, ib] = preberiIzpis(izpis, izreki);
  assert.equal(ia.dokazano, true);
  assert.equal(ib.dokazano, false);
  // tuj aksiom brez napake ni dokaz
  const [ic] = preberiIzpis(JSON.stringify({ pos: { line: a.aksiomi }, severity: "information", data: `'${a.ime}' depends on axioms: [propext, sorryAx]` }), [a]);
  assert.equal(ic.dokazano, false);
  assert.deepEqual(ic.tuji, ["sorryAx"]);
});

test("nabor napačnih prevodov (ločen model AI): vsi napačni zaznani, vsaj 90 % pravilnih sprejetih", () => {
  const f = merjenjeFormalizacij();
  assert.ok(f.napacni >= 100);
  assert.deepEqual(
    f.spusceni.map((p) => p.id),
    [],
  );
  assert.ok(f.sprejeti >= 0.9 * f.pravilni, `${f.sprejeti}/${f.pravilni}`);
});

test("oblika: sistem zahteva vse spremenljivke", () => {
  assert.ok(oblikaIzRacuna(["solve", ["x+y=2, x-y=0", "x, y", "x=1"]]).napaka);
  assert.equal(oblikaIzRacuna(["solve", ["x+y=2, x-y=0", "x, y", "x=1, y=1"]]).vrsta, "sistem");
  assert.ok(new Q(6n, 8n).eq(new Q(3n, 4n)));
});

// Pregled (model AI, 26. 11. 2026): luknje, ki jih vzorčenje ni videlo.
test("skladnost: Leanov x/0 = 0 ne sme skriti točke (imenovalec brez pogoja je neskladen)", () => {
  const ne = (r, i) => assert.equal(skladnost(r, i).skladno, false, i);
  ne(["solve", ["x^2=1", "x", "1"]], "∀ x : ℝ, (x ^ 2 * ((x + 1) / (x + 1)) = 1) ↔ (x = 1)");
  ne(["solve", ["x^2=1", "x", "1"]], "∀ x : ℝ, (x ^ 2 * ((x + 1) * (x + 1) ^ (-1 : ℤ)) = 1) ↔ (x = 1)");
  ne(["ineq", ["x^2<=1", "x", "(-1, 1)"]], "∀ x : ℝ, (x ^ 2 + 2 * (1 - (x ^ 2 - 1) / (x ^ 2 - 1)) ≤ 1) ↔ (-1 < x ∧ x < 1)");
  ne(["solve", ["sqrt(x)=2", "x", "4"]], "∀ x : ℝ, (Real.sqrt x = 2) ↔ (x = 4)");
  // pogoj z lastnim nevarovanim imenovalcem ne varuje (x²/x je v Leanu pri x = 0 enako 0)
  ne(["solve", ["1/x=2", "x", "1/2"]], "∀ x : ℝ, (x ^ 2 / x ≠ 0 ∧ 1 / x = (2:ℝ)) ↔ (x = 1/2)");
  ne(["value", ["1", "1"]], "((1 : ℝ) / (2 - 2)) = 0 + 1");
  // enakovreden zapis pogoja je skladen
  assert.equal(skladnost(["solve", ["1/x=2", "x", "1/2"]], "∀ x : ℝ, ((x + 0) * 1 ≠ 0 ∧ 1 / x = (2:ℝ)) ↔ (x = 1/2)").skladno, true);
  assert.equal(skladnost(["solve", ["sqrt(x)=2", "x", "4"]], "∀ x : ℝ, ((0:ℝ) ≤ x ∧ Real.sqrt x = 2) ↔ (x = 4)").skladno, true);
});

test("skladnost: primerjava je točna (brez tolerance)", () => {
  const ne = (r, i) => assert.equal(skladnost(r, i).skladno, false, i);
  const majhno = "0.1^12*0.1^12*0.1^12*0.1^12";
  ne(["value", ["1", `1+${majhno}`]], "(1 : ℝ) = 1");
  ne(["equal", ["x", `x+${majhno}`]], "∀ x : ℝ, x = x");
  ne(["solve", [`x=1+${majhno}`, "x", "1"]], "∀ x : ℝ, x = 1 ↔ x = 1");
  const d = "1.41421356237309504880168872420969807856967187537694807317667973799";
  ne(["solve", ["x^2=2", "x", `${d}, -${d}`]], "∀ x : ℝ, (x ^ 2 = (2:ℝ)) ↔ (x = Real.sqrt 2 ∨ x = -Real.sqrt 2)");
  // točno enaki koreni v drugem zapisu: √8 = 2√2
  assert.equal(skladnost(["solve", ["x^2=8", "x", "2*sqrt(2), -sqrt(8)"]], "∀ x : ℝ, (x ^ 2 = (8:ℝ)) ↔ (x = 2 * Real.sqrt 2 ∨ x = -(2 * Real.sqrt 2))").skladno, true);
});

test("skladnost: ugnezdene potence ne ustavijo strežnika, x⁰ in 0⁰ nista v obsegu", () => {
  const t = Date.now();
  assert.equal(skladnost(["value", ["(((((((10)^12)^12)^12)^12)^12)^12)^12", "1"]], "(1 : ℝ) = 1").skladno, false);
  assert.equal(skladnost(["value", ["1", "1"]], "(((((((((10:ℝ)^64)^64)^64)^64)^64)^64)^64)) = 1").skladno, false);
  assert.ok(Date.now() - t < 2000);
  assert.equal(prevedi(["equal", ["x^0", "1"]]).ok, false);
  assert.equal(prevedi(["value", ["0^0", "1"]]).ok, false);
});

test("datoteka Lean: dokaz ne sme vsebovati ukazov (instance, notation …)", () => {
  for (const d of ["norm_num\ninstance (priority := high) evilLE : LE ℝ := ⟨fun _ _ => True⟩", "norm_num\nnotation \"x\" => 1", "norm_num\nattribute [simp] foo", "norm_num\nopen Real in trivial"])
    assert.throws(() => datotekaLean([{ id: "a", izrek: "∀ x : ℝ, x ^ 2 ≤ -1", dokazi: [d] }]), /prepovedana/);
});

// Drugi krog pregleda (model AI): predznak vsote korenov, prazno območje pod zaokrožitvijo, čas.
test("skladnost: predznak p − q√2 z velikima p, q je točen (Pellov par)", () => {
  const p = "405635685060423865006987953410600042845579632756521";
  const q = "286827743597476442537332434074520260478106619164061"; // p² − 2q² = −1, p − q√2 ≈ −1,2·10⁻⁵¹
  assert.equal(skladnost(["ineq", ["x < 0", "x", "(0, inf)"]], `∀ x : ℝ, ((${p} : ℝ) - ${q} * Real.sqrt 2) * x < 0 ↔ 0 < x`).skladno, false);
  assert.equal(skladnost(["value", [`abs(${p} - ${q}*sqrt(2))`, `${p} - ${q}*sqrt(2)`]], `(${p} : ℝ) - ${q} * Real.sqrt 2 = ${p} - ${q} * Real.sqrt 2`).skladno, false);
  // pravilna različica (|·| = −(…)) ostane skladna
  assert.equal(skladnost(["value", [`abs(${p} - ${q}*sqrt(2))`, `${q}*sqrt(2) - ${p}`]], `|(${p} : ℝ) - ${q} * Real.sqrt 2| = ${q} * Real.sqrt 2 - ${p}`).skladno, true);
});

test("prazno definicijsko območje pod zaokrožitvijo: zunaj obsega in neskladno", () => {
  const B = "10^12*10^12*10^12*10^12*10^12";
  assert.equal(prevedi(["equal", [`1/(${B}*(x/3*3-x))`, "5"]]).ok, false);
  const d = "((10:ℝ) ^ 12 * 10 ^ 12 * 10 ^ 12 * 10 ^ 12 * 10 ^ 12 * (x / 3 * 3 - x))";
  assert.equal(skladnost(["equal", [`1/(${B}*(x/3*3-x))`, "5"]], `∀ x : ℝ, ${d} ≠ 0 → 1 / ${d} = 5`).skladno, false);
});

test("skladnost: velik izraz ne traja (proračun dela)", () => {
  let t = Date.now();
  assert.equal(skladnost(["equal", ["(a+b+c+d)*(a+b+c+d)", "(a+b+c+d)^2"]], "∀ a b c d : ℝ, (a+b+c+d)^20 * (a+b+c+d)^20 * (a+b+c+d)^20 = (a+b+c+d)^2").skladno, false);
  assert.ok(Date.now() - t < 3000, `${Date.now() - t} ms`);
  t = Date.now();
  const koreni = Array.from({ length: 120 }, (_, i) => `Real.sqrt ${999999999999999989n - 2n * BigInt(i)}`).join(" + ");
  skladnost(["value", ["1", "1"]], `(1:ℝ) + ${koreni} = 1`);
  assert.ok(Date.now() - t < 3000, `${Date.now() - t} ms`);
});
