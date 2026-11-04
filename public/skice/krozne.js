// Krožne (inverzne) funkcije: osnovna kotna funkcija na zoženem območju (zelena), njena inverzna (bela)
// in premica y = x. Vlečna točka na osnovni funkciji ima zrcalno sliko čez y = x na inverzni.
import { skica, st, crta, napis, osi } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";

const P2 = Math.PI / 2;
const acot = (x) => P2 - Math.atan(x); // vrednosti v (0, π)
// osnova: zoženo definicijsko območje osnovne funkcije [od, do]; D, Z: območji inverzne funkcije.
export const KROZNE = {
  arcsin: { tex: "\\arcsin", f: Math.sin, inv: Math.asin, od: -P2, do: P2, D: "[-1, 1]", Z: "\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]", f_tex: "\\sin" },
  arccos: { tex: "\\arccos", f: Math.cos, inv: Math.acos, od: 0, do: Math.PI, D: "[-1, 1]", Z: "[0, \\pi]", f_tex: "\\cos" },
  arctan: { tex: "\\arctan", f: Math.tan, inv: Math.atan, od: -1.28, do: 1.28, D: "\\mathbb{R}", Z: "\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)", f_tex: "\\tan" },
  arccot: { tex: "\\operatorname{arccot}", f: (x) => Math.cos(x) / Math.sin(x), inv: acot, od: 0.3, do: Math.PI - 0.3, D: "\\mathbb{R}", Z: "(0, \\pi)", f_tex: "\\cot" },
};

export default function narisi(host) {
  const W = 290, H = 290;
  const S = skica({ w: W, h: H, navodilo: "Izberi funkcijo in povleci točko po zeleni krivulji.", oznaka: "Krožna funkcija in njena osnovna kotna funkcija" });
  const oz = [[-P2, "−π/2"], [P2, "π/2"], [Math.PI, "π"]];
  const A = osi(S.svg, { W, H, x: [-3.3, 3.6], y: [-3.3, 3.6], xOznake: [[-1, ""], [1, "1"], ...oz], yOznake: [[-1, ""], [1, "1"], ...oz] });
  crta(S.svg, A.X(-3.3), A.Y(-3.3), A.X(3.6), A.Y(3.6), "glavna", { class: "sk-s-glavna sk-thin sk-dash sk-faint" });
  napis(S.svg, A.X(3.1), A.Y(3.3), "y = x", "glavna", { "text-anchor": "end", style: "font-size: 11px; font-style: normal; opacity: 0.7" });

  let ime = "arcsin", t = 0.6, tocka;
  S.gumbi({ label: "Krožna funkcija", options: Object.keys(KROZNE), value: ime, onChange: (v) => ((ime = v), (t = (KROZNE[v].od + KROZNE[v].do) / 2 + 0.4), izris()) });

  function izris() {
    const K = KROZNE[ime];
    t = Math.min(K.do, Math.max(K.od, t));
    const g = S.plast("graf");
    const zg = s("g", { "clip-path": A.izrez }, g);
    s("path", { d: fnPath(K.f, A, { from: K.od, to: K.do, n: 300 }), class: "sk-s-druga", "stroke-width": 2.5 }, zg);
    const lo = ime === "arctan" || ime === "arccot" ? -3.3 : -1, hi = ime === "arctan" || ime === "arccot" ? 3.6 : 1;
    s("path", { d: fnPath(K.inv, A, { from: lo, to: hi, n: 300 }), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    const y = K.f(t);
    const P = [A.X(t), A.Y(y)], Q = [A.X(y), A.Y(t)];
    crta(zg, P[0], P[1], Q[0], Q[1], "izbor", { class: "sk-s-izbor sk-thin sk-dash" });
    s("circle", { cx: Q[0], cy: Q[1], r: 6, class: "sk-fill sk-fill-izbor" }, zg);
    napis(g, A.R - 4, A.T + 14, ime, "glavna", { "text-anchor": "end", style: "font-style: normal" });
    napis(g, A.R - 4, A.T + 30, K.f_tex.slice(1), "druga", { "text-anchor": "end", style: "font-style: normal" });
    if (tocka) {
      tocka.move(...P);
      if (S.svg.lastChild !== tocka) S.svg.append(tocka);
    }
    S.cipi([
      { barva: "glavna", oznaka: `D_f = ${K.D}` },
      { barva: "glavna", oznaka: `Z_f = ${K.Z}` },
      { barva: "izbor", oznaka: "x", vrednost: st(y, 3) },
      { barva: "izbor", oznaka: `${K.tex}\\,x`, vrednost: st(K.inv(y), 3) },
    ]);
  }
  izris();
  tocka = S.tocka({
    x: A.X(t),
    y: A.Y(KROZNE[ime].f(t)),
    label: "Točka na osnovni funkciji: premikaj jo levo in desno",
    onMove: (px) => {
      t = A.inv(px, 0)[0];
      izris();
    },
  });
  izris();
  host.append(S.el);
}
