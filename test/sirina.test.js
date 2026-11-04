// Široke formule in tabele v lekcijah (public/sirina.js, public/textbook.css; j 2026-10-31).
// Celoten videz v brskalniku preverja scripts/preveri-videz-lekcij.cjs.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { MIN, pomanjsaj } from "../public/sirina.js";

const pub = (f) => fs.readFileSync(path.join(import.meta.dirname, "..", "public", f), "utf8");

test("textbook icon size never applies to KaTeX svgs (root sign kept its bar)", () => {
  const rule = pub("textbook.css").split("\n").find((l) => l.startsWith(".textbook svg"));
  assert.ok(rule, "pravilo za ikone");
  assert.match(rule, /:not\(\.katex svg\)/);
});

// Element, katerega širina raste s pisavo (kot formula ali tabela).
function fake(natural, base = 20) {
  const el = { style: { fontSize: "" } };
  const size = () => (el.style.fontSize ? parseFloat(el.style.fontSize) : base);
  globalThis.getComputedStyle = () => ({ fontSize: `${size()}px` });
  return { el, meri: () => (natural * size()) / base };
}

test("too wide: shrinks just enough to fit", () => {
  const { el, meri } = fake(330);
  pomanjsaj(el, 300, meri);
  assert.ok(meri() <= 301, `širina ${meri()}`);
  assert.ok(parseFloat(el.style.fontSize) > 20 * 0.85);
});

test("far too wide: stops at the minimum size and leaves the rest to the scrollbar", () => {
  const { el, meri } = fake(900);
  pomanjsaj(el, 300, meri);
  assert.equal(Number(parseFloat(el.style.fontSize).toFixed(1)), 20 * MIN);
  assert.ok(meri() > 300);
});

test("fits already: size is left alone (and an old size is cleared)", () => {
  const { el, meri } = fake(200);
  el.style.fontSize = "16px";
  pomanjsaj(el, 300, meri);
  assert.equal(el.style.fontSize, "");
});

test("lesson and »Razloži drugače« both get fitted", () => {
  const js = pub("textbook.js");
  assert.match(js, /wireFormulas\(box\);\n\s+prilagodiSirino\(box\);/);
  assert.match(js, /wireFormulas\(altBody\);\n\s+prilagodiSirino\(altBody\);/);
});

test("an inline formula never breaks across two lines", () => {
  assert.match(pub("textbook.css"), /^\.textbook \.katex \{ white-space: nowrap; \}$/m);
});

test("a setting with only a few values is buttons, not a slider (axis sliders stay sliders)", async () => {
  const { GUMBI_DO } = await import("../public/sim/kit.js");
  assert.ok(GUMBI_DO >= 4 && GUMBI_DO <= 8);
  const kit = pub("sim/kit.js");
  assert.match(kit, /n <= GUMBI_DO && !wrap\.classList\.contains\("axis-slider"\)/);
  assert.match(kit, /sl\.classList\.add\("axis-slider"\);\n\s+sl\.sync\?\.\(\);/);
  assert.match(pub("textbook.css"), /\.demo-slider\.as-choice \.demo-choice/);
});

test("a formula that does not fit is folded at its equals signs: left side on top, each »= …« below", async () => {
  const { zlozTex } = await import("../public/sirina.js");
  assert.equal(zlozTex("a = b + c = d"), "\\begin{aligned}&a \\\\ &\\quad {}= b + c \\\\ &\\quad {}= d\\end{aligned}");
  assert.equal(zlozTex("s = v t"), "\\begin{aligned}&s \\\\ &\\quad {}= v t\\end{aligned}");
  // relacije v ulomku, oklepaju ali {…} ostanejo na mestu
  assert.equal(zlozTex("F = \\dfrac{a = b}{c}"), "\\begin{aligned}&F \\\\ &\\quad {}= \\dfrac{a = b}{c}\\end{aligned}");
  assert.equal(zlozTex("\\left( x = 1 \\right) + (a \\ge 0)"), null);
  // stopnja 1: le izjave, ločene s \quad, vsaka v svoji vrstici
  assert.equal(zlozTex("x^2 = 4 \\qquad (x > 0)", 1), "\\begin{aligned}&x^2 = 4 \\\\ &(x > 0)\\end{aligned}");
  // kemijska enačba v enem \mathrm
  assert.equal(zlozTex("\\mathrm{CaCO_3 \\to CaO + CO_2}"), "\\begin{aligned}&\\mathrm{CaCO_3} \\\\ &\\quad {}\\to \\mathrm{CaO + CO_2}\\end{aligned}");
  // ni kje zložiti ali že ima vrstice
  assert.equal(zlozTex("x + y"), null);
  assert.equal(zlozTex("\\begin{aligned}a&=b\\end{aligned}"), null);
});

test("an inline formula never overlaps the lines around it and keeps line spacing even", async () => {
  const css = pub("textbook.css");
  // celota (inline-block): vedno razširi vrstico, nikoli ne prekrije sosednje; rahlo višja ne razmakne vrstice
  assert.match(css, /\.katex:not\(\.katex-display > \.katex\) \{ display: inline-block; text-indent: 0; margin-block: -0\.15em; \}/);
  // višja (ulomek \dfrac) se izriše v velikosti besedila; šele previsoka gre v svojo vrstico
  const { besedilniTex } = await import("../public/sirina.js");
  assert.equal(besedilniTex("\\dfrac{1}{2} + \\dbinom{n}{k}"), "\\frac{1}{2} + \\binom{n}{k}");
  assert.equal(besedilniTex("\\frac12"), null);
  const { VISOKA } = await import("../public/sirina.js");
  assert.ok(VISOKA > 1 && VISOKA <= 1.3);
  assert.match(pub("sirina.js"), /if \(visoka < Infinity && k\.getBoundingClientRect\(\)\.height > visoka\) k = zlozi\(k, "t"\) \|\| k;/);
});

// j 2026-11-04: »Predolge zapise ustrezno prelomi v drugo vrstico. Če je mogoče, ne uporabljaj scrollanja. To naj velja
// za vse enačbe.« Celoten videz v simulacijah, klepetu in nalogah preverja scripts/preveri-formule.cjs.
test("every equation in the app is fitted: sims, chat, exercises, formula cards (not only lessons)", async () => {
  for (const f of ["app.js", "kalkulator.js"]) assert.match(pub(f), /import \{ initSirina \} from "\.\/sirina\.js";[\s\S]*\ninitSirina\(\);\ninitDrsniki\(\);/, f);
  const js = pub("sirina.js");
  assert.match(js, /mo\.observe\(document\.body, \{ childList: true, subtree: true \}\)/);
  // simulacija ob vsakem premiku drsnika: rešitev za isto obliko formule brez merjenja (drsnik ostane gladek)
  assert.match(js, /tex\.replace\(\/\\d\/g, "0"\)/);
  const { OKVIRI } = await import("../public/sirina.js");
  for (const sel of [".demo-eq", ".graf-eq", ".formula-body", ".fm-f"]) assert.ok(OKVIRI.includes(sel), sel);
  // v okviru se formula ne prelomi sama sredi izraza; zloži jo sirina.js
  assert.match(pub("ui.css"), /^:is\(\.demo-eq, \.graf-eq, \.formula-body, \.fm-f\) \.katex \{ white-space: nowrap; \}$/m);
  // zbirka formul nima več svojega pomanjševanja (prej 78 %, brez zlaganja)
  assert.doesNotMatch(pub("graph/tools.js"), /function fit\(\)/);
});

test("sim formulas fold like lesson ones: statements, then »= …«, »⇒« and »ali« start a new line", async () => {
  const { zlozTex } = await import("../public/sirina.js");
  // stehiometrija (j-jev posnetek s telefona): ⇒ in \quad začneta novo vrstico
  const t = "\\frac{n(\\mathrm{MgO})}{n(\\mathrm{Mg})} = \\frac{2}{2} \\Rightarrow n(\\mathrm{MgO}) = 0{,}041\\ \\text{mol},\\quad m = n M = 1{,}66\\ \\text{g}";
  assert.equal(zlozTex(t, 1), "\\begin{aligned}&\\frac{n(\\mathrm{MgO})}{n(\\mathrm{Mg})} = \\frac{2}{2} \\\\ &\\Rightarrow  n(\\mathrm{MgO}) = 0{,}041\\ \\text{mol}, \\\\ &m = n M = 1{,}66\\ \\text{g}\\end{aligned}");
  // »ali« med dvema rešitvama začne novo izjavo (razmik pred njim odpade)
  assert.equal(zlozTex("x = a + 2k\\pi \\ \\text{ ali } \\ x = \\pi - a", 1), "\\begin{aligned}&x = a + 2k\\pi \\\\ &\\text{ali}\\ x = \\pi - a\\end{aligned}");
  assert.equal(zlozTex("x = 1 \\quad\\text{in}\\quad y = 2", 1), "\\begin{aligned}&x = 1 \\\\ &\\text{in}\\ y = 2\\end{aligned}");
});

test("a long sum is continued before + or − in balanced pieces, never inside brackets or after a sign", async () => {
  const { zlozTex } = await import("../public/sirina.js");
  const vsota = "3\\cdot 1\\,000 + 4\\cdot 100 + 5\\cdot 10 + 6\\cdot 1";
  assert.equal(zlozTex(vsota, 2), null); // brez relacije: stopnja 2 ne pomaga
  assert.equal(zlozTex(vsota, 3), "\\begin{aligned}&3\\cdot 1\\,000 + 4\\cdot 100 \\\\ &\\quad {}+ 5\\cdot 10 + 6\\cdot 1\\end{aligned}");
  // del za enačajem: nadaljevanje je zamaknjeno še za en \quad
  assert.equal(zlozTex("S = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 36", 3), "\\begin{aligned}&S \\\\ &\\quad {}= 1 + 2 + 3 + 4 \\\\ &\\quad \\quad {}+ 5 + 6 + 7 + 8 \\\\ &\\quad {}= 36\\end{aligned}");
  // predznak (»= -3«, »(-2)«, »\\cdot -1«) in oklepaji ostanejo celi
  const z = zlozTex("y = -30 + 2\\cdot(-20 - 10) - 40\\cdot -10 + 50", 3);
  assert.ok(!/\{\}-30|\{\}- 10|\{\}-10/.test(z), z);
  assert.match(z, /2\\cdot\(-20 - 10\)/);
  // dolg zmnožek števil in enot: pred ·, nikoli sredi števila v desetiškem zapisu (»2\\cdot10^6«)
  const f = zlozTex("F = 1{,}6\\cdot10^{-19}\\,\\mathrm{A\\,s} \\cdot 2\\cdot10^6\\,\\mathrm{m/s} \\cdot 0{,}3\\,\\mathrm{T} \\cdot 0{,}5", 3, 20);
  assert.equal(f, "\\begin{aligned}&F \\\\ &\\quad {}= 1{,}6\\cdot10^{-19}\\,\\mathrm{A\\,s} \\\\ &\\quad \\quad {}\\cdot 2\\cdot10^6\\,\\mathrm{m/s} \\cdot 0{,}3\\,\\mathrm{T} \\cdot 0{,}5\\end{aligned}");
});

test("with a line length (meja) only the statements that do not fit are folded; matrices stay whole", async () => {
  const { zlozTex } = await import("../public/sirina.js");
  const t = "c^2 = a^2 + b^2 - 2ab\\cos\\gamma:\\quad 64 = 61 + 45 - 2\\cdot 7{,}81\\cdot 6{,}71\\cdot\\cos 67^\\circ";
  assert.equal(zlozTex(t, 2, 24), "\\begin{aligned}&c^2 = a^2 + b^2 - 2ab\\cos\\gamma: \\\\ &64 \\\\ &\\quad {}= 61 + 45 - 2\\cdot 7{,}81\\cdot 6{,}71\\cdot\\cos 67^\\circ\\end{aligned}");
  // determinanta je celota; zložimo pri enačajih okoli nje
  assert.equal(zlozTex("p(\\lambda) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc"), "\\begin{aligned}&p(\\lambda) \\\\ &\\quad {}= \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} \\\\ &\\quad {}= ad - bc\\end{aligned}");
  for (const x of ["\\begin{cases} x = 1 \\\\ y = 2 \\end{cases}", "a &= b \\\\ c &= d"]) assert.equal(zlozTex(x), null);
  // puščice niso oklepaji (\\leftarrow, \\rightarrow)
  assert.equal(zlozTex("x \\leftarrow y = a \\rightarrow b"), "\\begin{aligned}&x \\leftarrow y \\\\ &\\quad {}= a \\\\ &\\quad {}\\rightarrow b\\end{aligned}");
});

test("decimal comma in sim formulas has no gap (»0,041«, not »0, 041«); lists stay lists", async () => {
  const { decVejica } = await import("../public/sim/kit.js");
  assert.equal(decVejica("n = 0,041\\ \\text{mol}"), "n = 0{,}041\\ \\text{mol}");
  assert.equal(decVejica("2,5 + 3,75 = 6,25"), "2{,}5 + 3{,}75 = 6{,}25");
  assert.equal(decVejica("10^{2,5}"), "10^{2{,}5}");
  for (const t of ["1{,}5", "x_{1,2} = 3", "\\{1,2,3\\}", "\\{1,5\\}", "(1,2,3)", "T(1, 2)", "5\\,000"]) assert.equal(decVejica(t), t);
  assert.match(pub("sim/kit.js"), /katex\.renderToString\(decVejica\(t\)/);
  assert.match(pub("demos.js"), /katex\.renderToString\(decVejica\(t\)/);
});
