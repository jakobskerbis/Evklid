import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "katex";
import { splitFormulas, toTex, hasFormula, varnaMesta, brisiNazaj, brisiNaprej, delisKazalcem, OZNAKA } from "../public/vnos-formul.js";
import { TUTOR_CHIPS, applyTemplate } from "../public/tipkovnica-data.js";

// Ulomki, integrali, zaporedja in vsote v klepetu z inštruktorjem (j, 4. 11.): zapis s tipk se izriše kot formula.
const tex = (s) => splitFormulas(s).filter((p) => "tex" in p).map((p) => p.tex);

test("keyboard notation becomes formulas, the rest stays text", () => {
  assert.deepEqual(splitFormulas("Koliko je (3)/(4) + (1)/(8)?"), [{ text: "Koliko je " }, { tex: "\\frac{3}{4} + \\frac{1}{8}" }, { text: "?" }]);
  assert.deepEqual(tex("√(2)·x^(2)"), ["\\sqrt{2}·x^{2}"]);
  assert.deepEqual(tex("∛(8)"), ["\\sqrt[3]{8}"]);
  assert.deepEqual(tex("(x+1)^(2)"), ["(x+1)^{2}"]);
  assert.deepEqual(tex("10^(−3) m"), ["10^{−3}"]);
  // Zaporedja in vsote
  assert.deepEqual(tex("a_(n+1) = 2a_n + 3"), ["a_{n+1}", "a_{n}"]);
  assert.deepEqual(tex("∑_(n=1)^∞ (1)/(n^(2))"), ["\\sum_{n=1}^{∞} \\frac{1}{n^{2}}"]);
  // Integrali: tipka ∫ na plasti f(x), tipki ∫ in ∫ₐᵇ v vrstici nad tipkami
  assert.deepEqual(tex("∫(x^(2);0;1)"), ["\\int_{0}^{1} x^{2}\\,dx"]);
  assert.deepEqual(tex("∫(x;;)"), ["\\int x\\,dx"]);
  assert.deepEqual(tex("∫ (x^(2)) dx"), ["\\int x^{2}\\,dx"]);
  assert.deepEqual(tex("∫_(0)^(1) (x²) dx je?"), ["\\int_{0}^{1} x²\\,dx"]);
  assert.deepEqual(tex("lim_(x→0)((sin(x))/(x))"), ["\\lim_{x→0} \\frac{\\sin (x)}{x}"]); // ena formula (AUDIT-013)
  assert.deepEqual(tex("d/dx(x³)"), ["\\frac{d}{dx}"]);
  // Navadno besedilo ostane besedilo.
  for (const s of ["Živjo, kako rešim nalogo?", "3/4 + 1/8", "moja_spremenljivka", "(a) dx", "cena (z DDV) / (brez)"]) assert.ok(!hasFormula(s), s);
  assert.equal(toTex("a{b}%"), "a\\{b\\}\\%");
});

// AUDIT-013: telo limite, vsote in produkta v oklepaju je del iste formule (prej dva kosa in surov »(i)«)
test("lim_(x→0)(x^(2)), ∑_(i=1)^(5)(i), ∏_(i=1)^(5)(i): operator in telo sta ena formula (AUDIT-013)", () => {
  assert.deepEqual(splitFormulas("lim_(x→0)(x^(2))"), [{ tex: "\\lim_{x→0} x^{2}" }]);
  assert.deepEqual(splitFormulas("lim_(x→0) (x^(2))"), [{ tex: "\\lim_{x→0} x^{2}" }]);
  assert.deepEqual(splitFormulas("∑_(i=1)^(5)(i)"), [{ tex: "\\sum_{i=1}^{5} i" }]);
  assert.deepEqual(splitFormulas("∑_(i=1)^(5) (i)"), [{ tex: "\\sum_{i=1}^{5} i" }]);
  assert.deepEqual(splitFormulas("∏_(i=1)^(5)(i)"), [{ tex: "\\prod_{i=1}^{5} i" }]);
  assert.deepEqual(splitFormulas("∏_(i=1)^(5) (i)"), [{ tex: "\\prod_{i=1}^{5} i" }]);
  // vsota v telesu obdrži oklepaj (pomen se ne spremeni)
  assert.deepEqual(tex("∑_(i=1)^(5)(i+1)"), ["\\sum_{i=1}^{5} \\left(i+1\\right)"]);
  assert.deepEqual(splitFormulas("Koliko je ∑_(i=1)^(3)(i)?"), [{ text: "Koliko je " }, { tex: "\\sum_{i=1}^{3} i" }, { text: "?" }]);
  // navaden oklepaj brez operatorja ostane besedilo
  assert.ok(!hasFormula("(a)(b)"));
  for (const s of ["lim_(x→0)(x^(2))", "∑_(i=1)^(5)(i)", "∏_(i=1)^(5)(i)", "∑_(i=1)^(5)(i+1)"]) for (const t of tex(s)) assert.doesNotThrow(() => katex.renderToString(t, { throwOnError: true, strict: "ignore" }), t);
});

test("every formula from the tutor keys renders in KaTeX", () => {
  const samples = ["(3)/(4)", "x^(2)", "√((x+1)/(2))", "a_(n)", "∑_(n=1)^(10) n", "∫ (x) dx", "∫_(0)^(π) (sin(x)) dx", "∫(e^(x);0;1)", "lim_(x→∞)((1)/(x))", "a{b}%#&~"];
  for (const s of samples) for (const t of [toTex(s), ...tex(s)]) assert.doesNotThrow(() => katex.renderToString(t, { throwOnError: true, strict: "ignore" }), `${s} → ${t}`);
  // Prazna predloga (pravkar vstavljena tipka) se ne zlomi.
  for (const [, ins] of TUTOR_CHIPS) {
    const { value } = applyTemplate("", 0, 0, ins);
    for (const t of tex(value)) assert.doesNotThrow(() => katex.renderToString(t, { throwOnError: true, strict: "ignore" }), `${ins} → ${t}`);
  }
});

test("tutor input: keys for fractions, powers, sequences, integrals and sums; drawn inside the field", () => {
  const ins = TUTOR_CHIPS.map(([, v]) => v);
  for (const v of ["(@)/()", "^(@)", "_(@)", "∫ (@) dx", "∫_(@)^() () dx", "∑_(n=1)^(@) "]) assert.ok(ins.includes(v), v);
  const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  assert.match(html, /<textarea id="input"[^>]*data-izris-v-polju/, "ulomek se izriše v polju klepeta (public/predogled-vnosa.js)");
  assert.doesNotMatch(html, /id="formula-preview"/, "ne še enkrat nad poljem");
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /splitFormulas\(p\)\.map/, "sporočilo učenca izriše zapis s tipk");
  assert.match(app, /dataset\.izrisVisina/, "polje klepeta zraste po izrisu");
});

test("»Razloži« in a lesson sends the original TeX, not the clickable-symbol wrappers", async () => {
  globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
  const { annotateTex, plainTex } = await import("../public/formula-data.js");
  // j, 4. 11.: Eulerjeva formula je prišla k inštruktorju kot »\htmlData^{\htmlData\htmlData} = cos \htmlData …«.
  const euler = "e^{i\\varphi} = \\cos\\varphi + i\\sin\\varphi";
  const shown = annotateTex(euler, "MAT");
  assert.match(shown, /\\htmlData/);
  assert.equal(plainTex(shown), euler);
  assert.equal(plainTex("\\htmlData{fx=a}{\\frac{1}{2}}x"), "\\frac{1}{2}x");
  assert.equal(plainTex("x^2"), "x^2");
  assert.equal(plainTex("\\htmlData{fx=a} x \\htmlData{fx=b}{y}"), "\\htmlData{fx=a} x y", "pokvarjena oznaka ne ustavi ostalih");
  assert.equal(plainTex("\\htmlData{fx=a}{\\varphi}x"), "\\varphi x");
  const tb = readFileSync(new URL("../public/textbook.js", import.meta.url), "utf8");
  assert.match(tb, /\$\$\{plainTex\(tex\)\.trim\(\)\}\$/);
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /renderMath\(fxMod\.now\(\)\.plainTex\(p\.slice\(1, -1\)\), false, false\)/, "tudi starejša sporočila (formula-info.js je naložen, preden se izriše)");
});

test("tutor: a dropped connection shows a clear message, not the browser's »network error«", () => {
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /err instanceof TypeError && \/\^\(network \?error\|failed to fetch\|load failed\|networkerror\)\/i/);
  assert.match(app, /dropped \? t\("off\.serverBusy"\) : err\.message/);
});

test("tutor: a reply cut off mid-stream keeps what arrived and loses the typing dot", () => {
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  const c = app.slice(app.indexOf("  } catch (err) {\n    // Odgovor, prekinjen sredi izpisa"));
  assert.ok(c.length > 0 && c.indexOf('bubble.classList.remove("typing")') < c.indexOf("err.chatOff"));
  assert.match(c, /pacer\.finish\(\);\s*pacer\.skip\(\);/);
});

// Polje, ki zapis pokaže kot formulo (j, 14. 11.: »Ulomek naj se izpiše namesto surovega zapisa«): kazalec ne sme stati
// med »)/(«, ⌫ na znaku zgradbe ulomka ne razbije.

test("varnaMesta: kazalec v števcu, imenovalcu, pred in za ulomkom, ne med )/( ali med √ in (", () => {
  assert.deepEqual(varnaMesta("π()/()"), [0, 1, 2, 5, 6]);
  assert.deepEqual(varnaMesta("(3)/(4)"), [0, 1, 2, 5, 6, 7]);
  assert.deepEqual(varnaMesta("√(2)"), [0, 2, 3, 4]);
  assert.deepEqual(varnaMesta("12"), [0, 1, 2]);
  // med dvema ulomkoma sme stati povsod (zapis ostane enak, tudi ko se formuli združita)
  assert.ok([7, 8, 9, 10].every((p) => varnaMesta("(1)/(2) + (3)/(4)").includes(p)));
});

test("delisKazalcem: oznaka kazalca je v števcu ulomka", () => {
  assert.deepEqual(delisKazalcem("π()/()", 2), [{ text: "π" }, { tex: `\\frac{${OZNAKA}}{}` }]);
});

test("brisiNazaj: prazen ulomek izgine cel, iz imenovalca skok v števec, navaden znak se zbriše normalno", () => {
  assert.deepEqual(brisiNazaj("π()/()", 5), { value: "π", caret: 1 });
  assert.deepEqual(brisiNazaj("π()/()", 2), { value: "π", caret: 1 });
  assert.deepEqual(brisiNazaj("π(1)/(5)", 6), { value: "π(1)/(5)", caret: 3 });
  assert.deepEqual(brisiNazaj("(3)/(4)", 1), { value: "(3)/(4)", caret: 0 });
  assert.deepEqual(brisiNazaj("x^()", 3), { value: "x", caret: 1 });
  assert.deepEqual(brisiNazaj("√(2)", 2), { value: "√(2)", caret: 0 });
  assert.equal(brisiNazaj("(3)/(4)", 2), null, "števka 3 se zbriše kot vsak znak");
  assert.equal(brisiNazaj("1/5", 3), null, "brez zapisa formule navaden ⌫");
});

test("brisiNazaj v telesu integrala in brisiNaprej (Del): zgradba ostane cela", () => {
  assert.deepEqual(brisiNazaj("∫ () dx", 3), { value: "∫ ", caret: 2 });
  assert.deepEqual(brisiNazaj("∫_(0)^(1) (x) dx", 11), { value: "∫_(0)^(1) (x) dx", caret: 10 });
  assert.deepEqual(brisiNaprej("(1)/(2)", 2), { value: "(1)/(2)", caret: 5 });
  assert.deepEqual(brisiNaprej("π()/()", 1), { value: "π", caret: 1 });
  assert.equal(brisiNaprej("(1)/(2)", 1), null, "števka se zbriše kot vsak znak");
});

// AUDIT-012: grški diferencial (dθ, dφ) je diferencial; ∫(f;a;b) dobi diferencial iz edine proste črke v f
test("integral z grško spremenljivko: ∫ (θ) dθ, ∫_(0)^(1) (θ) dθ, ∫(θ;0;1) so ena formula z dθ (AUDIT-012)", () => {
  assert.deepEqual(splitFormulas("∫ (θ) dθ"), [{ tex: "\\int θ\\,dθ" }]);
  assert.deepEqual(splitFormulas("∫_(0)^(1) (θ) dθ"), [{ tex: "\\int_{0}^{1} θ\\,dθ" }]);
  assert.deepEqual(splitFormulas("∫ (sin(φ)) dφ = ?"), [{ tex: "\\int \\sin (φ)\\,dφ" }, { text: " = ?" }]);
  assert.deepEqual(tex("∫(θ;0;1)"), ["\\int_{0}^{1} θ\\,dθ"]);
  assert.deepEqual(tex("∫(sin(θ);0;π)"), ["\\int_{0}^{π} \\sin (θ)\\,dθ"]);
  assert.deepEqual(tex("∫(e^(t);0;1)"), ["\\int_{0}^{1} e^{t}\\,dt"]);
  assert.deepEqual(tex("∫(θ)"), ["\\int θ\\,dθ"]);
  // brez proste črke ali z več črkami ostane dx (kot prej)
  assert.deepEqual(tex("∫(x^(2);0;1)"), ["\\int_{0}^{1} x^{2}\\,dx"]);
  assert.deepEqual(tex("∫(5;0;1)"), ["\\int_{0}^{1} 5\\,dx"]);
  assert.deepEqual(tex("∫(a·t;0;1)"), ["\\int_{0}^{1} a·t\\,dx"]);
  assert.deepEqual(tex("∫(e^(x);0;1)"), ["\\int_{0}^{1} e^{x}\\,dx"]);
  for (const s of ["∫ (θ) dθ", "∫_(0)^(1) (θ) dθ", "∫(θ;0;1)"]) for (const t of tex(s)) assert.doesNotThrow(() => katex.renderToString(t, { throwOnError: true, strict: "ignore" }), t);
  // ⌫ na prazni predlogi z dθ izbriše celo predlogo (zgradba je prepoznana)
  assert.deepEqual(brisiNazaj("∫ () dθ", 3), { value: "∫ ", caret: 2 });
});
