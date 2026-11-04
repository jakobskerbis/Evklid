// Potenčna in korenska funkcija: gumbi za vrsto eksponenta (2k, 2k + 1, −2k, −(2k + 1)), dva primera
// in pri pozitivnem eksponentu še korenska funkcija (inverzna k prvemu primeru).
import { skica, st, napis, osi } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";

const sodaKoren = (n) => (x) => (x < 0 ? NaN : x ** (1 / n));
const lihaKoren = (n) => (x) => Math.sign(x) * Math.abs(x) ** (1 / n);
export const VRSTE = {
  "2k": { n: [2, 4], D: "\\mathbb{R}", Z: "[0, \\infty)", parnost: "soda", koren: { f: sodaKoren(2), tex: "\\sqrt{x}", D: "[0, \\infty)" } },
  "2k+1": { n: [3, 5], D: "\\mathbb{R}", Z: "\\mathbb{R}", parnost: "liha", koren: { f: lihaKoren(3), tex: "\\sqrt[3]{x}", D: "\\mathbb{R}" } },
  "−2k": { n: [-2, -4], D: "\\mathbb{R} \\setminus \\{0\\}", Z: "(0, \\infty)", parnost: "soda", koren: null },
  "−(2k+1)": { n: [-1, -3], D: "\\mathbb{R} \\setminus \\{0\\}", Z: "\\mathbb{R} \\setminus \\{0\\}", parnost: "liha", koren: null },
};
export const potenca = (n) => (x) => (n < 0 && x === 0 ? NaN : x ** n);

export default function narisi(host) {
  const W = 290, H = 250;
  const S = skica({ w: W, h: H, navodilo: "Izberi vrsto eksponenta.", oznaka: "Grafi potenčnih in korenskih funkcij" });
  const oz = [-2, -1, 1, 2].map((v) => [v, st(v, 0)]);
  const A = osi(S.svg, { W, H, x: [-2.6, 2.6], y: [-2.4, 2.6], rob: 8, xOznake: oz, yOznake: oz });
  let vrsta = "2k";
  S.gumbi({ label: "Vrsta eksponenta", options: Object.keys(VRSTE), value: vrsta, onChange: (v) => ((vrsta = v), izris()) });

  function izris() {
    const V = VRSTE[vrsta];
    const g = S.plast("graf");
    const zg = s("g", { "clip-path": A.izrez }, g);
    const [n1, n2] = V.n;
    if (V.koren) s("path", { d: fnPath(V.koren.f, A, { n: 400 }), class: "sk-s-druga sk-dash", "stroke-width": 2.5 }, zg);
    s("path", { d: fnPath(potenca(n2), A, { n: 600 }), class: "sk-s-ploskev", "stroke-width": 2.5 }, zg);
    s("path", { d: fnPath(potenca(n1), A, { n: 600 }), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    const leg = [[`y = x${sup(n1)}`, "glavna"], [`y = x${sup(n2)}`, "ploskev"]];
    if (V.koren) leg.push([n1 === 2 ? "y = √x" : "y = ∛x", "druga"]);
    leg.forEach(([t, b], i) => napis(g, A.L + 6, A.T + 14 + i * 16, t, b, { style: "font-size: 12px" }));
    const cipi = [
      { barva: "glavna", oznaka: "n", vrednost: `${st(n1, 0)}, ${st(n2, 0)}` },
      { barva: "glavna", oznaka: `D_f = ${V.D}` },
      { barva: "glavna", oznaka: `Z_f = ${V.Z}` },
      { barva: "glavna", oznaka: "f", vrednost: V.parnost },
    ];
    if (V.koren) cipi.push({ barva: "druga", oznaka: `${V.koren.tex}:\\ D_f = ${V.koren.D}` });
    S.cipi(cipi);
  }
  izris();
  host.append(S.el);
}

const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵" };
const sup = (n) => String(n).split("").map((c) => SUP[c] ?? c).join("");
