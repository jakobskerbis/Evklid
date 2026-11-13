// Oznake lekcije (:::simboli): klikljive formule poznajo pomen oznake v tej lekciji.
import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { annotateTex, withFormulaSubject, parseSymbolsBlock, symbolKeyOf, symbolsIn, lookupSymbol } from "../public/formula-data.js";
import { parseLesson, expandFormulaBlocks } from "../server/textbook.js";
import { checkSymbols } from "../server/lesson-check.js";

const BLOCK = `T | prepustnost (transmitanca) | T = \\frac{I}{I_0} | – | število med 0 in 1
I, I_0 | jakost svetlobe | | |
\\varepsilon | molarni absorpcijski koeficient | | L\\,mol^{-1}\\,cm^{-1}
\\Delta H | reakcijska entalpija | | kJ/mol
\\mathrm{pH} | pH raztopine | | –
x_{1,2} | rešitvi enačbe | |`;

const codes = (tex) => [...tex.matchAll(/\\htmlData\{fx=([^}]*)\}/g)].map((m) => decodeURIComponent(m[1].replace(/\./g, "%")));

test("ključi oznak iz TeX", () => {
  assert.equal(symbolKeyOf("I_{0}"), "I_0");
  assert.equal(symbolKeyOf("\\varepsilon"), "ε");
  assert.equal(symbolKeyOf("\\Delta H"), "ΔH");
  assert.equal(symbolKeyOf("\\mathrm{pH}"), "pH");
  assert.equal(symbolKeyOf("F_{\\mathrm{rez}}"), "F_rez");
  assert.equal(symbolKeyOf("2x + 1"), null);
});

test("blok se razbere; vejica v {…} ne loči oznak", () => {
  const { list, errors } = parseSymbolsBlock(BLOCK + "\nnapačna vrstica\n\\rho |  | |");
  assert.deepEqual(list.map((g) => g.keys), [["T"], ["I", "I_0"], ["ε"], ["ΔH"], ["pH"], ["x_1,2"]]);
  assert.equal(list[0].r, "T = \\frac{I}{I_0}");
  assert.equal(list[0].note, "število med 0 in 1");
  assert.equal(errors.length, 2);
});

test("oznaka lekcije ima prednost pred slovarjem (T = prepustnost, ne temperatura)", () => {
  const { list } = parseSymbolsBlock(BLOCK);
  const plain = codes(annotateTex("T = \\frac{I}{I_0}", "KEM"));
  assert.deepEqual(plain, ["s:KEM:T"]); // brez oznak lekcije: slovar (temperatura), I ni znan
  withFormulaSubject("KEM", () => {
    const tex = "T = \\frac{I}{I_0},\\ \\Delta H = -5\\,\\mathrm{kJ/mol},\\ \\mathrm{pH} = 7,\\ c = 2\\,\\mathrm{mol/L}";
    const out = annotateTex(tex);
    const c = codes(out);
    const local = c.find((x) => x.endsWith(":T")).split(":")[1];
    assert.match(local, /^@\d+$/);
    assert.equal(lookupSymbol("T", local).n, "prepustnost (transmitanca)");
    // »I, I_0 | jakost svetlobe«: kartica pokaže obe oznaki skupaj (ime v dvojini ali množini).
    assert.deepEqual(lookupSymbol("I_0", local).keys, ["I", "I_0"]);
    assert.deepEqual(lookupSymbol("I_0", local).texs, ["I", "I_0"]);
    assert.ok(c.includes(`s:${local}:I_0`) && c.includes(`s:${local}:ΔH`) && c.includes(`s:${local}:pH`));
    assert.ok(c.includes("s:KEM:c"), "oznake, ki jih lekcija nima, vzame iz slovarja");
    assert.ok(c.includes("u:kJ/mol") && c.includes("u:mol/L"));
    katex.renderToString(out, { throwOnError: true, trust: true, strict: "ignore" });
    // Sestavni deli zveze za kartico.
    assert.deepEqual(symbolsIn("T = \\frac{I}{I_0}", local).map(([k]) => k), ["T", "I", "I_0"]);
  }, list);
});

test("ρ = m/V: sestavni deli iz slovarja", () => {
  assert.deepEqual(symbolsIn("\\rho = \\frac{m}{V}", "FIZ").map(([k, s]) => `${s}:${k}`), ["FIZ:ρ", "FIZ:m", "FIZ:V"]);
});

test("lekcija: blok se ne izpiše, oznake gredo v aplikacijo", () => {
  const src = `---\nstanje: osnutek\n---\n\n## Razlaga\n\n$$T = \\frac{I}{I_0}$$\n\n:::simboli\n${BLOCK}\n:::\n`;
  const L = parseLesson(src);
  assert.equal(L.symbols.length, 6);
  assert.ok(!JSON.stringify(L.sections).includes("simboli"));
  assert.equal(expandFormulaBlocks(":::simboli\nT | x | |\n:::\nbesedilo", "plain").trim(), "besedilo");
});

test("preverjevalnik: manjkajoče oznake izpostavljenih formul, neizrisljiva enota", () => {
  const warn = [];
  const err = [];
  checkSymbols("$$A = \\varepsilon\\, b\\, c$$\n\n:::simboli\nA | absorbanca | | –\n\\varepsilon | koeficient | | L\\,mol^{-1\n:::\n", (e) => err.push(e), (w) => warn.push(w));
  assert.ok(warn.some((w) => /2 oznak.*b, c/.test(w)), warn.join("; "));
  assert.ok(err.some((e) => /enota/.test(e)), err.join("; "));
});

test("oznake ne pokvarijo razmikov, opisa stolpcev in nezaprtih ukazov", () => {
  assert.equal(symbolKeyOf("\\hat\\theta"), "hat(θ)");
  const { list } = parseSymbolsBlock("m | masa | | kg\nc | hitrost | | m/s\n\\mathrm{pH} | pH | | –");
  const opt = { throwOnError: true, trust: true, strict: "ignore" };
  for (const g of [null, list]) {
    withFormulaSubject("FIZ", () => {
      for (const tex of ["a \\\\[2mm] b = m c", "\\begin{array}{c|c} m & c \\end{array}", "x_\\mathrm{pH}"]) {
        const out = annotateTex(tex);
        assert.doesNotThrow(() => katex.renderToString(out, opt), out);
        assert.ok(!/\[2\\htmlData|\{\\htmlData\{fx=[^}]*\}\{c\}\|/.test(out), out);
      }
      assert.doesNotThrow(() => annotateTex("5\\,\\mathrm{"));
      assert.doesNotThrow(() => annotateTex("5\\,\\mathrm{}"));
    }, g);
  }
});

test("pokončna enota ali diferencial ni oznaka lekcije (kg/m³: m ni masa)", () => {
  const { list } = parseSymbolsBlock("m | masa telesa | | kg\ns | lega | | m\nd | razdalja | | m\ne | Eulerjevo število | |");
  withFormulaSubject("FIZ", () => {
    const own = (tex) => codes(annotateTex(tex)).filter((c) => /^s:@/.test(c)).map((c) => c.split(":")[2]);
    assert.deepEqual(own("\\frac{\\text{kg}}{\\text{m}^3}"), []);
    assert.deepEqual(own("\\dfrac{\\mathrm{m}}{\\mathrm{s}}"), []);
    assert.deepEqual(own("E\\,\\mathrm{d}x"), []);
    assert.deepEqual(own("\\mathrm{e}^{-t} + m"), ["e", "m"]);
  }, list);
});
