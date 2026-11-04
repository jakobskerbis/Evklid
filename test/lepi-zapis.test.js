// Lep zapis med pisanjem v klepetu (public/lepi-zapis.js): x^2 → x², 3/4 → ³⁄₄, sqrt → √, a_n → aₙ …
import { test } from "node:test";
import assert from "node:assert/strict";
import { prettify } from "../public/lepi-zapis.js";

// Vpiše besedilo znak za znakom, kot bi ga tipkal učenec, in vrne vsebino polja.
function type(str, start = "") {
  let v = start;
  let run = null;
  for (const c of str) {
    v += c;
    const r = prettify(v, c, run);
    run = r?.run ?? null;
    if (r) v = v.slice(0, r.from) + r.text;
  }
  return v;
}

test("potence in indeksi med pisanjem", () => {
  assert.equal(type("x^2+1"), "x²+1");
  assert.equal(type("2^10"), "2¹⁰");
  assert.equal(type("x^-1"), "x⁻¹");
  assert.equal(type("e^x"), "eˣ");
  assert.equal(type("x^(n+1) "), "xⁿ⁺¹ ");
  assert.equal(type("log_10"), "log₁₀");
  assert.equal(type("H_2O"), "H₂O");
  assert.equal(type("a_n"), "aₙ");
  assert.equal(type("x^2 3"), "x² 3"); // presledek konča potenco
});

test("ulomki, koreni in znaki", () => {
  assert.equal(type("3/4"), "³⁄₄");
  assert.equal(type("12/25"), "¹²⁄₂₅");
  assert.equal(type("2,5/4"), "2,5/4"); // decimalnega števila ne razbijemo
  assert.equal(type("sqrt"), "√");
  assert.equal(type("2*3"), "2·3");
  assert.equal(type("x<=3, y>=1, a!=b, x->0, +-2"), "x≤3, y≥1, a≠b, x→0, ±2");
  assert.equal(type("kvadrat"), "kvadrat"); // navadne besede ostanejo
});

test("zapis s tipkovnice se olepša, ko kazalec gre naprej", () => {
  // Tipke vstavijo (@)/(), ^(@), √(@); učenec vpiše vsebino in nadaljuje.
  assert.equal(type("+", "(3)/(4)"), "³⁄₄+");
  assert.equal(type(" ", "x^(2)"), "x² ");
  assert.equal(type(" ", "√(2)"), "√2 ");
  assert.equal(type("3", "√(2)"), "√(2)3"); // √23 bi bil drug koren
  // Zapletenejši ulomek ostane zapis, ki ga izriše predogled.
  assert.equal(type(" ", "(x+1)/(x-1)"), "(x+1)/(x-1) ");
});

test("zapis ne spremeni pomena", () => {
  assert.equal(type("+", "f(2)/(3)"), "f(2)/(3)+"); // funkcija, ne ulomek
  assert.equal(type("y", "√(x)"), "√(x)y"); // √xy bi bil drug koren
  assert.equal(type("x2/3"), "x2/3"); // ne x na 2/3
  assert.equal(type("3", "x^(2)"), "x^(2)3");
});
