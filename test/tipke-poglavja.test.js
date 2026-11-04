// Tipke kalkulatorja po poglavju (public/graph/tipke-poglavja.js).
import test from "node:test";
import assert from "node:assert/strict";
import { chapterProfile, adaptKeys, fxGroupFor } from "../public/graph/tipke-poglavja.js";
import { FN_KEYS } from "../public/graph/sci.js";
import { evaluate } from "../public/graph/scicore.js";
import { FX_GROUPS } from "../public/tipkovnica-data.js";

test("poglavje → profil tipk", () => {
  const p = (id, extra = {}) => chapterProfile({ id, ...extra });
  assert.equal(p("MAT-SS-2/logaritem"), "log");
  assert.equal(p("MAT-SS-3/trigonometrijske-enacbe"), "trig");
  assert.equal(p("MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku"), "trig");
  assert.equal(p("MAT-SS-1/trikotnik"), "geo"); // »trikotnik« ni kotna funkcija
  assert.equal(p("MAT-SS-4/statistika"), "stat");
  assert.equal(p("MAT-SS-4/kombinatorika"), "comb");
  assert.equal(p("MAT-SS-4/odvod"), "ana");
  assert.equal(p("MAT-SS-2/kompleksna-stevila"), "cplx");
  assert.equal(p("MAT-SS-4/obrestni-racun"), "fin");
  assert.equal(p("MAT-SS-1/linearne-enacbe"), "eq");
  assert.equal(p("FIZ-OS-8/tlak"), "fiz");
  assert.equal(p("KEM-OS-8/molska-masa"), "kem");
  assert.equal(p("MAT-SS-1/x", { unit: "Statistika" }), "stat"); // tudi po imenu sklopa
  assert.equal(chapterProfile(null), null);
});

test("prilagojene tipke: stalne ostanejo na mestu, 24 tipk, brez podvojenih, vsaka se izračuna", () => {
  const FIXED = ["#2nd", "#left", "#right", "#more", "(", ")"];
  for (const prof of ["trig", "log", "ana", "comb", "stat", "fin", "geo", "num", "eq", "cplx", "fiz", "kem"]) {
    const keys = adaptKeys(FN_KEYS, prof);
    assert.equal(keys.length, FN_KEYS.length, prof);
    FN_KEYS.forEach((k, i) => FIXED.includes(k[1]) && assert.equal(keys[i][1], k[1], `${prof}: ${k[1]} na mestu`));
    const ins = keys.map((k) => k[1]);
    assert.equal(new Set(ins).size, ins.length, `${prof}: podvojena tipka`);
    assert.ok(keys.every((k) => k[0] && k[1]), prof);
    assert.ok(FX_GROUPS.some(([id]) => id === fxGroupFor(prof)), `${prof}: skupina f(x)`);
  }
  assert.deepEqual(adaptKeys(FN_KEYS, null), FN_KEYS);
  const stat = adaptKeys(FN_KEYS, "stat").map((k) => k[1]);
  assert.equal(stat[1], "mean(");
  // nove tipke dajo veljaven račun v znanstvenem kalkulatorju
  for (const [s, v] of [["mean(1;2;3)", 2], ["stdev(1;2;3)", 1], ["total(1;2;3)", 6], ["cot(45°)", 1], ["logb(8;2)", 3], ["gcd(12;18)", 6], ["10^(2)", 100], ["count(4;5)", 2]]) {
    const r = evaluate(s, { comma: true, deg: true });
    assert.ok(r && !r.error && Math.abs(r.value - v) < 1e-9, `${s}: ${JSON.stringify(r)}`);
  }
});
