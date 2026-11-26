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
