// Računanje z enotami v znanstvenem kalkulatorju (j, 27. 11. 2026; public/graph/enote.js, scicore.js evaluateUnits).
import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { UNIT_GROUPS, parseUnit, knownUnit, unitTex, unitResultTex, unitKeys, token, sameDims, siUnit, OFFSET_TEMP } from "../public/graph/enote.js";
import { evaluate, QUANTITIES, unitVarName } from "../public/graph/scicore.js";
import { analyze, previewTex } from "../public/graph/scisolve.js";
import { parse } from "../public/graph/math.js";
import { entryBase, caretStops, backspace, deleteForward, insertKey, selectionSpan, analyzeLive, withChem } from "../public/graph/sci-vnos.js";
import { adaptKeys, chapterProfile } from "../public/graph/tipke-poglavja.js";
import { FN_KEYS } from "../public/graph/sci.js";
import { unitSI } from "../server/lesson-math.js";
import sl from "../public/i18n/sl.js";

const env = { vars: {}, funcs: {}, ans: 0, deg: true, comma: true };
const T = (s) => s.replace(/\[([^\]]+)\]/g, (_, u) => token(u)); // »5[km]« → »5⟦km⟧«
const ev = (s, e = env) => evaluate(T(s), e);
const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));

test("vsaka enota na tipkovnici je znana, ena količina ima eno dimenzijo", () => {
  for (const [g, syms] of UNIT_GROUPS) {
    const dims = syms.filter((u) => !(u in OFFSET_TEMP)).map((u) => parseUnit(u)?.d);
    for (const [i, u] of syms.entries()) assert.ok(knownUnit(u), `${g}: ${u}`);
    for (const d of dims) assert.deepEqual(d, dims[0], g);
    assert.ok(sl[`sc.q.${g}`], `ime količine sc.q.${g}`);
  }
});

test("faktorji se ujemajo s pretvornikom (QUANTITIES) in s preračunom lekcij (unitSI)", () => {
  for (const q of QUANTITIES) {
    if (q.id === "temperature" || q.id === "angle") continue;
    const base = parseUnit(q.units[0][0]);
    for (const [u, f] of q.units) {
      const p = parseUnit(u);
      assert.ok(p, u);
      assert.ok(near(p.f / base.f, f), `${q.id} ${u}`);
      assert.deepEqual(p.d, base.d, u);
    }
  }
  const bases = [
    [1.7, 2.3, 3.1, 0.7, 1.9, 2.9],
    [0.37, 5.3, 0.61, 4.1, 0.53, 1.3],
  ];
  let compared = 0;
  for (const [, syms] of UNIT_GROUPS)
    for (const u of syms) {
      const p = parseUnit(u);
      if (!p || u === "KM") continue; // v lekcijah je KM kilomol na liter, tu konjska moč
      for (const b of bases) {
        const s = unitSI(u.replace(/μ/g, "µ"), b);
        if (s === null) continue;
        compared++;
        assert.ok(Math.abs(s / (p.f * p.d.reduce((x, e, i) => x * b[i] ** e, 1)) - 1) < 1e-9, `${u} pri ${b}`);
      }
    }
  assert.ok(compared > 60, `primerjanih ${compared}`);
});

test("račun z enotami: vrednost in enota rezultata", () => {
  const cases = [
    ["5[km] + 300[m]", 5.3, "km"],
    ["300[m] + 5[km]", 5300, "m"],
    ["2[kg] · 9,81[m/s²]", 19.62, "N"],
    ["72[km/h] → [m/s]", 20, "m/s"],
    ["10[m] / 2[s]", 5, "m/s"], // število se veže na enoto: (10 m)/(2 s)
    ["72[km/h] · 2[h]", 144, "km"], // del sestavljene enote
    ["12[V] / 4[Ω]", 3, "A"],
    ["230[V] · 2[A]", 460, "W"],
    ["1[kWh] → [J]", 3.6e6, "J"],
    ["√(16[m²])", 4, "m"],
    ["2^3[m]", 8, "m"], // eksponent ostane brez enote
    ["(2+3)[m]", 5, "m"],
    ["1 000[m] → [km]", 1, "km"],
    ["1,2E3[g] → [kg]", 1.2, "kg"],
    ["5×10^(3)[m] → [km]", 5, "km"],
    ["2[kg] · 3[m/s]", 6, "kg·m/s"],
    ["1[L] → [cm³]", 1000, "cm³"],
    ["1[g/cm³] → [kg/m³]", 1000, "kg/m³"],
    ["3[kΩ] · 2[mA]", 6, "V"],
    ["0,5[mol/L] · 2[L]", 1, "mol"],
    ["5[m] − 5[m]", 0, "m"],
    ["1[atm] → [kPa]", 101.325, "kPa"],
    ["20[°C] → [K]", 293.15, "K"],
    ["68[°F] → [°C]", 20, "°C"],
    ["300[K] → [°C]", 26.85, "°C"],
    ["−40[°C] → [°F]", -40, "°F"],
    // rezultat v enotah računa, ko ni enote z imenom (pregled 27. 11.)
    ["150[km] / 2[h]", 75, "km/h"],
    ["5[cm] · 3[cm]", 15, "cm²"],
    ["5[km]²", 25, "km²"],
    ["10[m] / 2[s]", 5, "m/s"],
    // enota se veže na zadnji člen pred njo
    ["10[m] / 2^(3)[s]", 1.25, "m/s"],
    ["10[m] / (2+3)[s]", 2, "m/s"],
    ["10[m] / 5·10^3[s]", 0.002, "m/s"],
    ["2^−3[m]", 0.125, "m"],
    // ničelni rezultat: dimenzija iz zgradbe računa
    ["2[kg] · 0[m/s²]", 0, "N"],
    ["0[m] / 5[s]", 0, "m/s"],
    ["2[kg] · 0[m]", 0, "kg·m"],
    ["5[m] − 5[m]", 0, "m"],
    // dovoljene funkcije, naključna števila, ocenjeni integrali, enota v integralu in vsoti
    ["|−2[m]|", 2, "m"],
    ["max(5[m]; 300[cm])", 5, "m"],
    ["∛(8[m³])", 2, "m"],
    ["root(16[m⁴]; 4)", 2, "m"],
    ["∫(x[m]; 0; 2)", 2, "m"],
    ["∑_(n=1)^(3)(n[m])", 6, "m"],
    ["(∫(cos(x)/(1+x^2); 0; ∞))[m]", 0.5779, "m"],
    ["1[m]·1[m]·1[m]·1[m]·1[m]", 1, "m⁵"],
    // ∫ in ∑ z ničelno vrednostjo: dimenzija iz člena in meja
    ["∫(x[m]; −1; 1)", 0, "m"],
    ["∫(x; 0; 2[m])", 2, "m²"],
    ["∑_(n=−1)^(1)(n[m])", 0, "m"],
    // dva simbola iste količine: SI, ne cm·m
    ["1[cm] · 1[m]", 0.01, "m²"],
    ["10[km] / 2[h] / 5[s]", 10000 / 3600 / 10, "m/s²"],
  ];
  for (const [s, v, u] of cases) {
    const r = ev(s);
    assert.ok(!r.error, `${s}: ${JSON.stringify(r.error)}`);
    assert.ok(near(r.value, v) || (r.est && Math.abs(r.value - v) < 1e-3), `${s}: ${r.value}`);
    assert.equal(r.unit?.sym, u, s);
  }
  // enote se pokrajšajo: navadno število (tudi točna oblika)
  const r = ev("5[km] / 300[m]");
  assert.ok(near(r.value, 50 / 3) && !r.unit);
});

test("napake z enotami povedo, kaj je narobe", () => {
  const cases = [
    ["5[m] + 3[s]", "unitMismatch"],
    ["sin(2[m])", "unitFunc"],
    ["round(2,5[km])", "unitFunc"],
    ["1^(2[m])", "unitFunc"],
    ["3[m]!", "unitFunc"],
    ["max(5[m]; 1[s])", "unitMismatch"],
    ["5[m] − 5[s]", "unitMismatch"],
    ["5[m] − 5[m] → [s]", "unitConvert"],
    ["Pol(3[m]; 4[m])", "unitCalcOnly"],
    ["∫(x[m]; −1; 1) + 1[s]", "unitMismatch"],
    ["∑_(n=−1)^(1)(n[m]) + 2[s]", "unitMismatch"],
    ["2[m] + 1", "unitMismatch"],
    ["√(2[m])", "unitPower"],
    ["5[m] → [s]", "unitConvert"],
    ["5[km] / 300[m] → [m]", "unitConvert"],
    ["20[°C] · 2", "unitTemp"],
    ["20[°C] + 5[K] → [K]", "unitTemp"],
    ["20[°C]", "unitTemp"],
    ["a = 5[m]", "unitCalcOnly"],
    ["2x[m] = 4[m]", "unitCalcOnly"],
    ["5[m] → 3", "unitTarget"],
    ["5[m] → [m] → [km]", "unitTarget"],
    ["5[xyz]", "unitUnknown"],
  ];
  for (const [s, code] of cases) assert.equal(ev(s).error?.code, code, s);
  assert.equal(ev("x[m]").error?.code, "missing");
  assert.equal(analyze(T("x + 2[m] = 5[m]"), env).error?.code, "unitCalcOnly");
  assert.equal(analyze(T("f(x) = x[m]"), env).error?.code, "unitCalcOnly");
  assert.deepEqual(ev("5[m] → [s]").error.info, { from: "m", to: "s" });
  assert.deepEqual(ev("150[km] / 2[h] → [kg]").error.info, { from: "km/h", to: "kg" });
  // naključno število z enoto: dimenzija ni odvisna od žreba
  for (const s of ["rand[m]", "randint(1; 6)[m]", "rand·2[m] + 1[m]"]) assert.equal(ev(s).unit?.sym, "m", s);
  // koren negativnega: »ni definirano« kot brez enot
  assert.equal(ev("√(−4[m²])").value, null);
});

test("imena enot v izrazu: math.js nobenega ne prebere kot funkcijo (U_{uuCH} ni cosh)", () => {
  for (let i = 0; i < 800; i++) {
    const name = unitVarName(`test${i}`);
    const code = name.slice(4);
    assert.deepEqual(parse(`U_{uu${code}}`), { k: "var", name }, name);
  }
});

test("Ans nosi enoto prejšnjega rezultata", () => {
  const a = ev("5[km] + 300[m]");
  const e = { ...env, ans: a.value, ansUnit: a.unit.sym };
  assert.deepEqual([ev("Ans · 2", e).value, ev("Ans · 2", e).unit.sym], [10.6, "km"]);
  assert.deepEqual([ev("Ans → [m]", e).value, ev("Ans → [m]", e).unit.sym], [5300, "m"]);
  assert.equal(ev("Ans + 1", e).error?.code, "unitMismatch");
  assert.equal(ev("Ans + 200[m]", e).value, 5500);
  // Ans ohrani vse števke (1/3 m/s · 3 = 1 m/s)
  const third = ev("1[m] / 3[s]");
  assert.equal(ev("Ans · 3", { ...env, ans: third.value, ansUnit: "m/s" }).value, 1);
  // temperatura v Ans se pretvori naprej
  const c = ev("20[°C] → [°F]");
  const tc = ev("Ans → [°C]", { ...env, ans: c.value, ansUnit: "°F" });
  assert.ok(near(tc.value, 20) && tc.unit.sym === "°C", JSON.stringify(tc));
  assert.equal(ev("Ans · 2", { ...env, ans: c.value, ansUnit: "°F" }).error?.code, "unitTemp");
  assert.equal(ev("Ans", { ...env, ans: 68, ansUnit: "°F" }).unit?.sym, "°F");
  assert.equal(ev("20[°F] → [°C]").value, -6.666666666667);
  // brez Ans v vnosu velja navaden račun
  assert.deepEqual(ev("2 + 3", e), evaluate("2 + 3", env));
});

test("molska masa z enotami je v g/mol", () => {
  const r = withChem(T("2[mol] · M(H2O)"), evaluate, env);
  assert.equal(r.unit?.sym, "g");
  assert.ok(Math.abs(r.value - 36.03) < 0.01, String(r.value));
  // Ans v gramih / M(H₂O) = mol
  const n = withChem("Ans / M(H2O)", evaluate, { ...env, ans: 36.03, ansUnit: "g" });
  assert.equal(n.unit?.sym, "mol");
  assert.ok(Math.abs(n.value - 2) < 0.01, String(n.value));
});

test("zapis vnosa: enota je en žeton, kazalec nikoli v njej", () => {
  for (const s of ["5[km]", "5[km] + 300[m]", "72[km/h]→[m/s]", "2[kg]·9,81[m/s²]", "20[°C]→[K]", "3[kΩ]", "5[μm]", "5[km]→", "→[km]"]) {
    const text = T(s);
    const b = entryBase(text, env);
    assert.ok(b?.ok, s);
    const toks = [...text.matchAll(/⟦[^⟧]*⟧/g)].map((m) => [m.index, m.index + m[0].length]);
    for (const { p } of caretStops(b)) assert.ok(!toks.some(([a, e]) => a < p && p < e), `${s}: kazalec na ${p}`);
    assert.doesNotThrow(() => katex.renderToString(b.tex.replace(/\d{4}/g, "1"), { throwOnError: true, strict: "ignore" }), s);
  }
  assert.equal(entryBase(T("72[km/h]→[m/s]"), env).tex, "72\\operatorname{km/h}{}\\rightarrow\\operatorname{m/s}{}");
  // izrecno množenje ostane vidno (pika med enotama in pred številom)
  assert.match(ev("1E3[m] · 2E3[m]").tex, /\\operatorname\{m\}\{\}\\cdot 2/);
  assert.match(ev("[m] · [s]").tex, /\\operatorname\{m\}\{\}\\cdot \\operatorname\{s\}/);
  // brez enot puščica ostane kot prej (kemijska enačba ni pretvorba)
  assert.ok(!String(previewTex("2H2 + O2 → 2H2O")).includes("rightarrow"));
  // puščica pred črko je veljaven TeX
  assert.doesNotThrow(() => katex.renderToString(previewTex(T("5[km]→x")), { throwOnError: true, strict: "ignore" }));
});

test("brisanje in vstavljanje: enota gre cela", () => {
  const t = T("5[km]+3");
  assert.deepEqual(backspace(t, 5), { text: "5+3", pos: 1 });
  assert.deepEqual(backspace(t, 3), { text: "5+3", pos: 1 }); // kazalec v enoti šteje kot za njo
  assert.deepEqual(deleteForward(t, 1), { text: "5+3", pos: 1 });
  assert.deepEqual(deleteForward(t, 2), { text: "5+3", pos: 1 });
  assert.deepEqual(insertKey(t, 3, "2"), { text: T("5[km]2+3"), pos: 6 });
  assert.deepEqual(selectionSpan(t, 3, 6), [1, 6]);
});

test("predogled: vrednost in enota že med tipkanjem", () => {
  const r = analyzeLive(T("72[km/h]→[m/s]"), env);
  assert.equal(r.kind, "value");
  assert.equal(r.value, 20);
  assert.equal(r.unit.sym, "m/s");
});

test("vse enote se izrišejo (vnos in rezultat), ključi zapisa so isti kot v besedilu", () => {
  const all = UNIT_GROUPS.flatMap(([, s]) => s).concat(["kg·m/s", "kg·m²/s", "1/s", "kg/m·s²"]);
  for (const u of all) {
    for (const tex of [`5${unitTex(u)}`, `5${unitResultTex(u)}`]) assert.doesNotThrow(() => katex.renderToString(tex, { throwOnError: true, strict: "ignore" }), u);
    assert.ok(unitKeys(u).length > 0, u);
  }
  // enota rezultata iz dimenzije se prebere nazaj (Ans)
  for (const d of [[1, 1, -1, 0, 0, 0], [0, 0, -1, 0, 0, 0], [2, 1, -1, 0, 0, 0], [-1, 1, -1, 0, 0, 0]]) assert.ok(sameDims(parseUnit(siUnit(d)).d, d), siUnit(d));
});

test("tipka Enote: v fiziki in kemiji na tipkovnici, 2nd je pretvorba", () => {
  for (const subject of ["FIZ", "KEM"]) {
    const keys = adaptKeys(FN_KEYS, chapterProfile({ id: `${subject}-SS-1/x`, subject }));
    const k = keys.find((x) => x[1] === "#units");
    assert.ok(k, subject);
    assert.equal(k[3], "→");
  }
  assert.ok(!adaptKeys(FN_KEYS, null).some((x) => x[1] === "#units"));
});
