// Kvadratna funkcija v temenski obliki f(x) = a(x − p)² + q: drsniki a, p, q; teme T in simetrala x = p.
// Čipi: T, b = −2ap, c = ap² + q, D = b² − 4ac in ničli (ali »ni realnih«).
import { skica, st, crta, napis, osi } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";

export function kvadratna(a, p, q) {
  const b = -2 * a * p, c = a * p * p + q, D = b * b - 4 * a * c;
  const r = Math.abs(D) < 1e-12 ? 0 : D;
  const nicle = r < 0 ? [] : r === 0 ? [p] : [p - Math.sqrt(-q / a), p + Math.sqrt(-q / a)];
  return { f: (x) => a * (x - p) ** 2 + q, b, c, D: r, nicle };
}

// a = 0 ni kvadratna funkcija: drsnik ga preskoči.
export const brezNic = (v, prej) => (Math.abs(v) < 1e-9 ? (prej > 0 ? -0.5 : 0.5) : v);

export default function narisi(host) {
  const W = 300, H = 240;
  const S = skica({ w: W, h: H, navodilo: "Spreminjaj a, p in q.", oznaka: "Graf kvadratne funkcije v temenski obliki" });
  const oz = [-4, -2, 2, 4].map((v) => [v, st(v, 0)]);
  const A = osi(S.svg, { W, H, x: [-5, 5], y: [-4.5, 4.5], rob: 8, xOznake: oz, yOznake: oz });
  let a = 1, p = 1, q = -2;
  const slA = S.drsnik({ label: "a", min: -2, max: 2, step: 0.5, value: a, digits: 1, barva: "glavna", onInput: (v) => ((a = brezNic(v, a)), a !== v && slA.set(a, true), izris()) });
  S.drsnik({ label: "p", min: -3, max: 3, step: 0.5, value: p, digits: 1, barva: "izbor", onInput: (v) => ((p = v), izris()) });
  S.drsnik({ label: "q", min: -3, max: 3, step: 0.5, value: q, digits: 1, barva: "druga", onInput: (v) => ((q = v), izris()) });

  function izris() {
    const k = kvadratna(a, p, q);
    const g = S.plast("graf");
    const zg = s("g", { "clip-path": A.izrez }, g);
    crta(zg, A.X(p), A.T, A.X(p), A.B, "izbor", { class: "sk-s-izbor sk-thin sk-dash" });
    s("path", { d: fnPath(k.f, A, { n: 200 }), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    for (const x of k.nicle) s("circle", { cx: A.X(x), cy: A.Y(0), r: 5, class: "sk-fill sk-fill-ploskev" }, zg);
    s("circle", { cx: A.X(p), cy: A.Y(q), r: 6, class: "sk-fill sk-fill-druga" }, zg);
    napis(g, A.X(p) + 9, A.Y(q) + (a > 0 ? 16 : -8), "T", "druga");
    napis(g, Math.min(A.R - 4, A.X(p) + 5), A.T + 12, "x = p", "izbor", { style: "font-size: 11px" });
    const z = (v) => `${Math.abs(v - Number(v.toFixed(2))) < 1e-9 ? "" : "≈ "}${st(v, 2)}`;
    S.cipi([
      { barva: "druga", oznaka: "T(p, q)", vrednost: `T(${st(p, 1)}, ${st(q, 1)})` },
      { barva: "glavna", oznaka: "b = -2ap", vrednost: st(k.b, 2) },
      { barva: "glavna", oznaka: "c = ap^2 + q", vrednost: st(k.c, 2) },
      { barva: "glavna", oznaka: "D = b^2 - 4ac", vrednost: st(k.D, 2) },
      { barva: "ploskev", oznaka: "x_{1,2}", vrednost: k.nicle.length ? k.nicle.map(z).join("; ") : "ni realnih" },
    ]);
  }
  izris();
  host.append(S.el);
}
