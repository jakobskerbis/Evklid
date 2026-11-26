// PV-11 (docs/preverjanje.md, »Status nalog na polah«): rešitve nalog na polah mature in NPZ v trditve.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { resitveDela, korakiPoti, mutiraj, trditveDela, popisPol, povzemi, porocilo } from "../scripts/status-pol.mjs";
import * as cas from "../server/cas.js";

const HAVE = await cas.casAvailable();
after(() => cas.casStop());

const pari = (t) => korakiPoti(t).map((k) => `${k.prej} | ${k.potem}`);

test("resitveDela: odgovor, točkovnik, poti in le pravilna izbira", () => {
  const r = resitveDela({ answer: "$x = 2$", scoring: "1 točka", ways: [{ text: "a" }, { text: "b" }], choices: ["A", "B", "C"], correct: [1] });
  assert.deepEqual(
    r.map((x) => x.vir),
    ["odgovor", "tockovnik", "pot 1", "pot 2", "izbira"],
  );
  assert.equal(r[4].besedilo, "B");
});

test("korakiPoti: implikacija, veznik, »in« sredi izpeljave, »ali« kot ena trditev", () => {
  assert.deepEqual(pari("$$x + 2 = -2 \\quad\\Rightarrow\\quad x = -4.$$"), ["x + 2 = -2 | x = -4"]);
  assert.deepEqual(pari("$4x^{2} + x^{2} = 180$, torej $5x^{2} = 180$ in $x^{2} = 36$."), ["4x^(2) + x^(2) = 180 | 5x^(2) = 180", "5x^(2) = 180 | x^(2) = 36"]);
  assert.deepEqual(pari("$$y^{2} = 9,$$\ntorej $y = 3$ ali $y = -3$."), ["y^(2) = 9 | y = 3 ali y = -3"]);
  // »ali« združi tudi nerešeni obliki
  assert.deepEqual(pari("$(x - 1)^{2} = 4$, torej $x - 1 = 2$ ali $x - 1 = -2$, od tod $x = 3$ ali $x = -1$."), [
    "(x - 1)^(2) = 4 | x - 1 = 2 ali x - 1 = -2",
    "x - 1 = 2 ali x - 1 = -2 | x = 3 ali x = -1",
  ]);
});

test("korakiPoti: seznami in pogoji niso koraki", () => {
  // seznam enačb v podatkih
  assert.deepEqual(pari("enačbe $2x^{2} + x - 6 = 0$, $x^{2} + 6x + 34 = 0$ in $9x^{2} - 12x + 4 = 0$"), []);
  // hkratna pogoja (lažni alarm pred pregledom)
  assert.deepEqual(pari("Pogoja: $x + 3 > 0$ in $x - 1 > 0$, torej $x > 1$."), ["x - 1 > 0 | x > 1"]);
  // formuli brez veznika in rešena oblika na začetku
  assert.deepEqual(pari("Velja $2x = 4$. Potem $3y = 6$."), []);
  assert.deepEqual(pari("$x = 2$, torej $x + 1 = 3$."), []);
  // celoštevilski n, k
  assert.deepEqual(pari("$2n = 10$, torej $n = 5$."), []);
});

test("mutiraj: zadnje celo število + 1", () => {
  assert.equal(mutiraj("x = -4"), "x = -5");
  assert.equal(mutiraj("5x^(2) = 180"), "5x^(2) = 181");
  assert.equal(mutiraj("y = 3 ali y = -3"), "y = 3 ali y = -4");
  assert.equal(mutiraj("x = a"), null);
});

test("trditveDela: pravilen korak izračunano, napačen napaka, prazen brez statusa", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  const st = async (text) => (await trditveDela({ ways: [{ text }] }, { cas })).filter((x) => x.vir === "korak").map((x) => x.status);
  assert.deepEqual(await st("$$x + 2 = -2 \\Rightarrow x = -4$$"), ["izracunano"]);
  assert.deepEqual(await st("$$x + 2 = -2 \\Rightarrow x = -3$$"), ["napaka"]);
  assert.deepEqual(await st("$5x^{2} = 180$ in $x^{2} = 36$, torej $x = 6$ ali $x = -6$"), ["izracunano"]);
  // iz enačbe brez realne rešitve sledi vsaka: ni potrditve
  assert.deepEqual(await st("$$x^{2} + 6x + 34 = 0 \\Rightarrow x^{2} = 5$$"), ["nepreverjeno"]);
});

test("popis in poročilo ene pole (brez SymPy)", async () => {
  const pole = await popisPol({ predpona: "NPZ9-MAT" });
  assert.ok(pole.length >= 1);
  const p = povzemi(pole);
  assert.equal(p.nalog, pole.reduce((s, x) => s + x.naloge.length, 0));
  assert.equal(p.poViru.korak.vse, 0);
  const md = porocilo(pole, { datum: "2026-11-26", commit: "x", mutacije: { izidi: [], vstavljenih: 0, ujete: 0, napacnoPotrjene: 0 } });
  assert.match(md, /## Naloge po statusu/);
  assert.match(md, /## Zaznavanje vstavljenih napak/);
  assert.match(md, /## Po nalogah/);
});
