// Eksponentna in logaritemska funkcija: drsnik a (preskoči a = 1), y = aˣ in y = logₐ x sta zrcalni čez
// y = x; točki (0, 1) in (1, 0); vlečna točka na eksponentni funkciji in njena zrcalna slika na logaritmu.
import { skica, st, crta, napis, osi } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";

export const brezEna = (v, prej) => (Math.abs(v - 1) < 1e-9 ? (prej > 1 ? 0.9 : 1.1) : v);
export const exp = (a) => (x) => a ** x;
export const log = (a) => (x) => (x > 0 ? Math.log(x) / Math.log(a) : NaN);

export default function narisi(host) {
  const W = 290, H = 270;
  const S = skica({ w: W, h: H, navodilo: "Spreminjaj osnovo a in povleci točko po eksponentni krivulji.", oznaka: "Eksponentna in logaritemska funkcija" });
  const oz = [-2, 2, 4].map((v) => [v, st(v, 0)]);
  const A = osi(S.svg, { W, H, x: [-3, 5], y: [-3, 5], rob: 8, xOznake: [...oz, [1, "1"]], yOznake: [...oz, [1, "1"]] });
  crta(S.svg, A.X(-3), A.Y(-3), A.X(5), A.Y(5), "glavna", { class: "sk-s-glavna sk-thin sk-dash sk-faint" });
  let a = 2, x = 1.5, tocka;
  const slA = S.drsnik({ label: "a", min: 0.2, max: 4, step: 0.1, value: a, digits: 1, barva: "ploskev", onInput: (v) => ((a = brezEna(v, a)), a !== v && slA.set(a, true), izris()) });

  // Vlečna točka ostane v okvirju: aˣ med 0,02 in 4,8.
  const omeji = (t) => {
    const lim = Math.log(4.8) / Math.log(a), lim2 = Math.log(0.02) / Math.log(a);
    const [lo, hi] = a > 1 ? [Math.max(-2.9, lim2), Math.min(4.9, lim)] : [Math.max(-2.9, lim), Math.min(4.9, lim2)];
    return Math.min(hi, Math.max(lo, t));
  };

  function izris() {
    x = omeji(x);
    const g = S.plast("graf");
    const zg = s("g", { "clip-path": A.izrez }, g);
    s("path", { d: fnPath(log(a), A, { from: 0.0005, to: 5, n: 600 }), class: "sk-s-druga", "stroke-width": 2.5 }, zg);
    s("path", { d: fnPath(exp(a), A, { n: 400 }), class: "sk-s-ploskev", "stroke-width": 2.5 }, zg);
    const y = a ** x, P = [A.X(x), A.Y(y)], Q = [A.X(y), A.Y(x)];
    crta(zg, ...P, ...Q, "izbor", { class: "sk-s-izbor sk-thin sk-dash" });
    s("circle", { cx: Q[0], cy: Q[1], r: 6, class: "sk-fill sk-fill-izbor" }, zg);
    for (const [px, py] of [[0, 1], [1, 0]]) s("circle", { cx: A.X(px), cy: A.Y(py), r: 4.5, class: "sk-fill sk-fill-glavna" }, zg);
    napis(g, A.R - 4, A.T + 14, "y = aˣ", "ploskev", { "text-anchor": "end", style: "font-style: normal" });
    napis(g, A.R - 4, A.T + 30, "y = logₐ x", "druga", { "text-anchor": "end", style: "font-style: normal" });
    if (tocka) {
      tocka.move(...P);
      if (S.svg.lastChild !== tocka) S.svg.append(tocka);
    }
    S.cipi([
      { barva: "ploskev", oznaka: "a", vrednost: st(a, 1) },
      { barva: "ploskev", oznaka: "f(x) = a^x", vrednost: a > 1 ? "naraščajoča" : "padajoča" },
      { barva: "izbor", oznaka: "x", vrednost: `≈ ${st(x, 2)}` },
      { barva: "izbor", oznaka: "y = a^x", vrednost: `≈ ${st(y, 2)}` },
      { barva: "izbor", oznaka: "\\log_a y = x", vrednost: `≈ ${st(x, 2)}` },
    ]);
  }
  izris();
  tocka = S.tocka({ x: A.X(x), y: A.Y(a ** x), label: "Točka na eksponentni funkciji: premikaj jo levo in desno", onMove: (px) => ((x = A.inv(px, 0)[0]), izris()) });
  izris();
  host.append(S.el);
}
