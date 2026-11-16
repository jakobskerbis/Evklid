// Tipke kalkulatorja po poglavju (public/graph/tipke-poglavja.js).
import test from "node:test";
import assert from "node:assert/strict";
import { chapterProfile, adaptKeys, fxGroupFor, brezPodvojitev } from "../public/graph/tipke-poglavja.js";
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
  // ime teme pred imenom sklopa; »vrste trikotnikov«, »logika«, biologija niso analiza/logaritmi/enačbe
  assert.equal(p("MAT-SS-4/obrestni-racun", { unit: "Zaporedja in vrste" }), "fin");
  assert.equal(p("MAT-SS-4/statistika", { unit: "Kombinatorika in verjetnost" }), "stat");
  assert.equal(p("MAT-OS-7/vrste-trikotnikov-in-notranji-koti", { unit: "Trikotnik" }), "geo");
  assert.equal(p("MAT-SS-4/geometrijska-vrsta", { unit: "Zaporedja in vrste" }), "ana");
  assert.equal(p("MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje", { unit: "Zaporedja in vrste" }), "eq");
  assert.equal(p("MAT-SS-1/osnove-logike", { unit: "Množice in števila" }), "num");
  assert.equal(p("FIZ-OS-9/elektricni-krog"), "fiz");
  assert.equal(p("BIO-SS-3/imunski-sistem"), null);
  assert.equal(p("BIO-SS-4/statistika-v-biologiji"), "stat");
});

test("prilagojene tipke: stalne ostanejo na mestu, 24 tipk, brez podvojenih, vsaka se izračuna", () => {
  const FIXED = ["#2nd", "#left", "#right", "#more", "(", ")"];
  for (const prof of [null, "trig", "log", "ana", "comb", "stat", "fin", "geo", "num", "eq", "cplx", "fiz", "kem"]) {
    const keys = adaptKeys(FN_KEYS, prof);
    assert.equal(keys.length, FN_KEYS.length, prof);
    FN_KEYS.forEach((k, i) => FIXED.includes(k[1]) && assert.equal(keys[i][1], k[1], `${prof}: ${k[1]} na mestu`));
    const ins = keys.map((k) => k[1]);
    assert.equal(new Set(ins).size, ins.length, `${prof}: podvojena tipka`);
    assert.ok(keys.every((k) => k[0] && k[1]), prof);
    // Način 2nd: nobena funkcija in nobena oznaka ni dvakrat (j 2026-11-05: »i« in »e« dvakrat).
    const dve = keys.filter((k) => !FIXED.includes(k[1]));
    for (const [ime, f] of [["funkcija", (k) => k[3] ?? k[1]], ["oznaka", (k) => (k[3] ? k[2] : k[0])]]) {
      const v = dve.map(f);
      assert.equal(new Set(v).size, v.length, `${prof}: 2nd ${ime} dvakrat (${v.join(" ")})`);
    }
    if (prof) assert.ok(FX_GROUPS.some(([id]) => id === fxGroupFor(prof)), `${prof}: skupina f(x)`);
  }
  assert.deepEqual(adaptKeys(FN_KEYS, null), FN_KEYS);
  // brezPodvojitev ne zamenja glavne funkcije tipke (pregled #457): geo obdrži x³, fiz eˣ; spremeni se samo 2nd
  assert.ok(adaptKeys(FN_KEYS, "geo").some((k) => k[1] === "³"), "geo: x³");
  assert.ok(adaptKeys(FN_KEYS, "fiz").some((k) => k[1] === "e^("), "fiz: eˣ");
  const dvojne = [["a", "a(", "b", "b("], ["c", "c(", "b", "b("], ["d", "b(", "c", "c("]];
  const ena = brezPodvojitev(dvojne);
  assert.deepEqual(ena.map((k) => k[1]), dvojne.map((k) => k[1]), "glavne funkcije ostanejo");
  assert.deepEqual(ena[1], ["c", "c("], "2nd že drugje, glavna ne: brez 2nd");
  assert.equal(ena[2].length, 4, "obe že drugje: 2nd iz rezerve");
  assert.ok(!["a(", "b(", "c("].includes(ena[2][3]), ena[2].join(" "));
  const stat = adaptKeys(FN_KEYS, "stat").map((k) => k[1]);
  assert.equal(stat[1], "mean(");
  // nove tipke dajo veljaven račun v znanstvenem kalkulatorju
  for (const [s, v] of [["mean(1;2;3)", 2], ["stdev(1;2;3)", 1], ["stdevp(1;2;2;3)", Math.sqrt(0.5)], ["total(1;2;3)", 6], ["cot(45°)", 1], ["logb(8;2)", 3], ["gcd(12;18)", 6], ["10^(2)", 100], ["count(4;5)", 2]]) {
    const r = evaluate(s, { comma: true, deg: true });
    assert.ok(r && !r.error && Math.abs(r.value - v) < 1e-9, `${s}: ${JSON.stringify(r)}`);
  }
});
