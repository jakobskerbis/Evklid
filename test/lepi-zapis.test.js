// Lep zapis med pisanjem v klepetu (public/lepi-zapis.js). Od 24. 11. 2026 (enoten matematični zapis F2) polje ne piše
// znakov Unicode za potence, indekse in ulomke (x², ³⁄₄, aₙ): ostane zapis v vrstici, ki ga izriše KaTeX.
import { test } from "node:test";
import assert from "node:assert/strict";
import { prettify } from "../public/lepi-zapis.js";
import { splitFormulas } from "../public/vnos-formul.js";

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

const UNICODE_STRUKTURA = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎⁄ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ]/u;

test("potence in indeksi ostanejo zapis, ki ga izriše KaTeX (ne x², ne aₙ)", () => {
  for (const s of ["x^2+1", "2^10", "x^-1", "e^x", "x^(n+1) ", "log_10", "H_2O", "a_n", "x^2 3"]) {
    const v = type(s);
    assert.equal(v, s, s);
    assert.ok(!UNICODE_STRUKTURA.test(v), s);
  }
  // Vsak tak zapis je v poslanem sporočilu in v polju formula (splitFormulas → KaTeX).
  assert.deepEqual(splitFormulas(type("x^2+1")), [{ tex: "x^{2}" }, { text: "+1" }]);
  assert.deepEqual(splitFormulas(type("a_n")), [{ tex: "a_{n}" }]);
});

test("ulomek iz števil postane ulomek, ki ga izriše KaTeX", () => {
  assert.equal(type("3/4"), "(3)/(4)");
  assert.equal(type("12/25"), "(12)/(25)"); // več števk v imenovalcu
  assert.equal(type("Koliko je 3/4 od 12?"), "Koliko je (3)/(4) od 12?");
  assert.deepEqual(splitFormulas(type("3/4 od 12")), [{ tex: "\\frac{3}{4}" }, { text: " od 12" }]);
  assert.deepEqual(splitFormulas(type("12/25")), [{ tex: "\\frac{12}{25}" }]);
  assert.equal(type("2,5/4"), "2,5/4"); // decimalnega števila ne razbijemo
  assert.equal(type("x2/3"), "x2/3"); // ne x na 2/3
  assert.equal(type("1/2/2025"), "1/2/2025"); // datum: druga poševnica vrne prvotni zapis
  assert.equal(type(" ", "(3)/(4)"), "(3)/(4) "); // zapis s tipkovnice ostane
});

test("posamezni znaki dobijo pravi matematični znak", () => {
  assert.equal(type("sqrt"), "√");
  assert.equal(type("sqrt(2)"), "√(2)");
  assert.deepEqual(splitFormulas(type("sqrt(2)")), [{ tex: "\\sqrt{2}" }]);
  assert.equal(type("2*3"), "2·3");
  assert.equal(type("x<=3, y>=1, a!=b, x->0, +-2"), "x≤3, y≥1, a≠b, x→0, ±2");
  assert.equal(type("kvadrat"), "kvadrat"); // navadne besede ostanejo
});

test("zapis s tipkovnice ostane nespremenjen (izriše ga KaTeX)", () => {
  assert.equal(type(" ", "x^(2)"), "x^(2) ");
  assert.equal(type(" ", "√(2)"), "√(2) ");
  assert.equal(type("3", "√(2)"), "√(2)3");
  assert.equal(type(" ", "(x+1)/(x-1)"), "(x+1)/(x-1) ");
  assert.equal(type("+", "f(2)/(3)"), "f(2)/(3)+");
});

test("Backspace takoj po dodani števki imenovalca vrne prejšnji ulomek", () => {
  const r1 = prettify("3/4", "4", null);
  assert.equal(r1.text, "(3)/(4)");
  const r2 = prettify("(3)/(4)5", "5", r1.run);
  assert.deepEqual([r2.from, r2.text, r2.undo], [6, "5)", ")"]); // (3)/(45); Backspace → (3)/(4)
});
