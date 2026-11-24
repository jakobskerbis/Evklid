// Varovalka za enoten matematični zapis (j, 24. 11. 2026; faza F0 v projektnem dokumentu
// predlogi/enoten-matematicni-zapis-nacrt-2026-11-24.md). Nabor izrazov vseh glavnih konstrukcij gre skozi skupni
// izris (public/rich.js, KaTeX) in mora:
//   1. se izrisati brez napake KaTeX (nikjer razreda katex-error, nikjer surovega ukaza v vidnem besedilu),
//   2. imeti MathML za bralnike zaslona,
//   3. dati ISTI izris kot ob zadnjem posnetku (test/fiksno/mat-izrazi.json): poznejše poenotenje (F1) ne sme
//      neopazno spremeniti videza. Namerna sprememba: MAT_POSNEMI=1 node --test test/mat-varovalka.test.js
//      in razlika gre v pregled.
// Neveljaven ali nepopoln LaTeX se nikoli ne pokaže kot rdeč surov zapis.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import { marked } from "marked";
import katex from "katex";
import { createRenderer } from "../public/rich.js";

const { renderRich } = createRenderer({ marked, katex, sanitize: (h) => h });

export const IZRAZI = {
  potence: ["x^2", "x^{n+1}", "e^{-x^2}", "2^{2^{n}}", "a_n", "a_{n+1}^2", "x_{1,2}"],
  ulomki: ["\\frac{a}{b}", "\\dfrac{x+1}{x-1}", "\\frac{1}{1+\\frac{1}{x}}", "\\frac{\\frac{a}{b}}{\\frac{c}{d}}", "\\tfrac{3}{4}"],
  koreni: ["\\sqrt{x}", "\\sqrt[3]{x^2}", "\\sqrt{\\sqrt{x}+1}", "\\sqrt{\\frac{a}{b}}"],
  integrali: [
    "\\int_0^1 x^2\\,dx",
    "\\displaystyle\\int_0^1 x^2\\,dx",
    "\\int_0^1\\int_0^x xy\\,dy\\,dx",
    "\\iint_D f(x,y)\\,dA",
    "\\oint_C \\vec F\\cdot d\\vec r",
    "\\int \\frac{1}{\\sqrt{1-x^2}}\\,dx",
  ],
  odvodi: ["f'(x)", "f''(x)", "\\frac{dy}{dx}", "\\frac{d^2y}{dx^2}", "\\frac{\\partial f}{\\partial x}", "\\dot x", "\\nabla f"],
  limite: ["\\lim_{x\\to0}\\frac{\\sin x}{x}", "\\displaystyle\\lim_{n\\to\\infty}\\left(1+\\frac{1}{n}\\right)^n", "\\lim_{x\\to0^+}\\ln x"],
  vsote: ["\\sum_{i=1}^{n} i", "\\displaystyle\\sum_{i=1}^{n}i", "\\sum_{k=0}^{\\infty}\\frac{x^k}{k!}", "\\prod_{i=1}^{n} a_i", "\\sum_{i=1}^{n}\\sum_{j=1}^{m} a_{ij}"],
  matrike: [
    "\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}",
    "\\begin{bmatrix}a&b&c\\\\d&e&f\\end{bmatrix}",
    "\\det\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}",
    "\\begin{pmatrix}\\frac{1}{2}&\\sqrt2\\\\0&\\int_0^1x\\,dx\\end{pmatrix}",
  ],
  vektorji: ["\\vec{a}", "\\vec{r}(t)", "\\overrightarrow{AB}", "|\\vec a|", "\\vec a\\times\\vec b", "\\mathbf{v}"],
  sistemi: ["\\begin{cases}x+y=3\\\\x-y=1\\end{cases}", "f(x)=\\begin{cases}x^2 & x\\ge0\\\\-x & x<0\\end{cases}", "\\begin{aligned}a&=b+c\\\\&=d\\end{aligned}"],
  relacije: ["x\\le 2", "x\\ge -1", "a\\neq b", "\\pi\\approx 3{,}14", "x\\in\\mathbb{R}", "A\\subseteq B", "\\pm\\sqrt{D}"],
  grske: ["\\alpha+\\beta=\\gamma", "\\Delta x", "\\lambda\\nu", "\\varepsilon_0", "\\Omega", "\\varphi", "\\rho g h"],
  enote: ["9\\,\\mathrm{m/s}", "1200\\,\\mathrm{m^2}", "24\\,°\\mathrm{C}", "6{,}022\\cdot10^{23}\\,\\mathrm{mol^{-1}}", "\\SI"],
  kemija: ["\\mathrm{H_2O}", "\\mathrm{CO_2}", "\\mathrm{2H_2 + O_2 \\rightarrow 2H_2O}", "\\mathrm{Fe^{3+}}", "\\mathrm{SO_4^{2-}}", "\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}"],
  fizika: ["F=ma", "E=mc^2", "W=\\int\\vec F\\cdot d\\vec s", "p=\\frac{F}{S}", "U=RI", "\\Delta E = h\\nu"],
  decimalke: ["3{,}14", "0{,}5\\cdot 2", "x = 1{,}25", "-2{,}5"],
  dolgi: ["(a+b)^5 = a^5 + 5a^4b + 10a^3b^2 + 10a^2b^3 + 5ab^4 + b^5", "\\frac{1}{1\\cdot2}+\\frac{1}{2\\cdot3}+\\frac{1}{3\\cdot4}+\\dots+\\frac{1}{n(n+1)}=\\frac{n}{n+1}"],
  besedilo: ["\\text{če } x>0", "v = \\frac{s}{t}\\quad\\text{(hitrost)}"],
};
// "\\SI" je namerno neznan ukaz: tudi tak se izriše brez rdečega surovega zapisa (KaTeX ga pokaže kot ime ukaza).
const NEZNANI = new Set(["\\SI"]);

const POSNETEK = new URL("./fiksno/mat-izrazi.json", import.meta.url);
const odtis = (h) => crypto.createHash("sha256").update(h).digest("hex").slice(0, 16);
const vidno = (h) => h.replace(/<span class="katex-mathml">[\s\S]*?<\/math><\/span>/g, "").replace(/<[^>]+>/g, "");

const izrisi = {};
for (const [vrsta, seznam] of Object.entries(IZRAZI)) {
  test(`${vrsta}: vrstični in samostojni izris brez napake, z MathML`, () => {
    for (const tex of seznam) {
      for (const [ime, src] of [["vrstica", `Izraz $${tex}$ v povedi.`], ["blok", `$$${tex}$$`]]) {
        const h = renderRich(src);
        izrisi[`${vrsta}|${ime}|${tex}`] = odtis(h);
        if (NEZNANI.has(tex)) continue;
        assert.doesNotMatch(h, /katex-error/, `${ime}: ${tex}`);
        assert.match(h, /<math xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML"/, `MathML: ${tex}`);
        assert.doesNotMatch(vidno(h), /\\[a-zA-Z]+|\$/, `surov ostanek: ${tex}`);
      }
    }
  });
}

test("neveljaven ali nepopoln LaTeX ne pokaže rdečega surovega zapisa in ne podre besedila okoli", () => {
  for (const tex of ["\\frac{1}{", "x^", "\\sqrt{", "\\begin{pmatrix}1&2", "}{", "\\left(x", "a_{"]) {
    const h = renderRich(`Pred $${tex}$ za.`);
    assert.match(h, /Pred/);
    assert.match(h, /za\./);
    assert.doesNotMatch(h, /<script/i);
  }
});

test("besedilo, ki ni matematika, ostane besedilo", () => {
  const h = renderRich("Cena je 5 € in 3 kg jabolk.");
  assert.doesNotMatch(h, /katex/);
  assert.match(h, /Cena je 5 € in 3 kg jabolk\./);
});

test("izris je enak zadnjemu posnetku (test/fiksno/mat-izrazi.json)", (t) => {
  // Izrisi se zberejo v testih zgoraj; ta test teče zadnji.
  assert.ok(fs.existsSync(POSNETEK) || !process.env.CI, "manjka test/fiksno/mat-izrazi.json (v CI se ne zapiše sam)");
  if (process.env.MAT_POSNEMI === "1" || !fs.existsSync(POSNETEK)) {
    fs.mkdirSync(new URL("./fiksno/", import.meta.url), { recursive: true });
    fs.writeFileSync(POSNETEK, JSON.stringify(Object.fromEntries(Object.entries(izrisi).sort()), null, 1) + "\n");
    t.diagnostic("posnetek zapisan");
    return;
  }
  const prej = JSON.parse(fs.readFileSync(POSNETEK, "utf8"));
  const razlike = Object.keys({ ...prej, ...izrisi }).filter((k) => prej[k] !== izrisi[k]);
  assert.deepEqual(razlike, [], "izris se je spremenil (namerno? MAT_POSNEMI=1)");
});
