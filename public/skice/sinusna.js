// Sinusna krivulja f(x) = A sin ω(x − φ): drsniki A, ω, φ; siva osnovna krivulja sin x, oznaki A in T,
// pike na ničlah x = φ + kπ/ω.
import { skica, st, crta, napis, osi, piZapis } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";

export const OD = -2 * Math.PI, DO = 2 * Math.PI;

export function sinusna(A, w, fi) {
  const f = (x) => A * Math.sin(w * (x - fi));
  const T = (2 * Math.PI) / w;
  const nicle = [];
  for (let k = Math.ceil(((OD - fi) * w) / Math.PI - 1e-9); fi + (k * Math.PI) / w <= DO + 1e-9; k++) nicle.push(fi + (k * Math.PI) / w);
  // Prvi vrh desno od φ: x = φ + T/4 (pri A > 0 je tam vrednost A).
  return { f, T, nicle, vrh: fi + T / 4 };
}

export default function narisi(host) {
  const W = 320, H = 210;
  const S = skica({ w: W, h: H, navodilo: "Spreminjaj A, ω in φ.", oznaka: "Graf funkcije A sin ω(x − φ)" });
  const xOz = [-2, -1, 1, 2].map((k) => [k * Math.PI, piZapis(k * Math.PI)]);
  const Ax = osi(S.svg, { W, H, x: [OD - 0.7, DO + 0.7], y: [-3.4, 3.4], xOznake: xOz, yOznake: [[-3, "−3"], [-2, ""], [-1, "−1"], [1, "1"], [2, ""], [3, "3"]] });
  s("path", { d: fnPath(Math.sin, Ax, { n: 400 }), class: "sk-s-glavna sk-thin sk-faint" }, S.svg);

  let A = 2, w = 2, fi = Math.PI / 4;
  const piFmt = (v) => piZapis(v) ?? st(v, 2);
  S.drsnik({ label: "A", min: 0.5, max: 3, step: 0.5, value: A, digits: 1, barva: "izbor", onInput: (v) => ((A = v), izris()) });
  S.drsnik({ label: "ω", min: 0.5, max: 3, step: 0.5, value: w, digits: 1, barva: "druga", onInput: (v) => ((w = v), izris()) });
  S.drsnik({ label: "φ", min: -Math.PI, max: Math.PI, step: Math.PI / 12, value: fi, format: piFmt, barva: "ploskev", onInput: (v) => ((fi = v), izris()) });

  function izris() {
    const q = sinusna(A, w, fi);
    const g = S.plast("graf");
    const zg = s("g", { "clip-path": Ax.izrez }, g);
    s("path", { d: fnPath(q.f, Ax, { n: 600 }), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    for (const x of q.nicle) s("circle", { cx: Ax.X(x), cy: Ax.Y(0), r: 4, class: "sk-fill sk-fill-ploskev" }, zg);
    // Amplituda: navpična daljica od osi do vrha (rumena).
    let vrh = q.vrh;
    while (vrh > DO - 0.2) vrh -= q.T;
    while (vrh < OD) vrh += q.T;
    crta(zg, Ax.X(vrh), Ax.Y(0), Ax.X(vrh), Ax.Y(A), "izbor", { "stroke-width": 3 });
    napis(g, Ax.X(vrh) + 5, Ax.Y(A / 2) + 4, "A", "izbor");
    // Perioda: od ničle φ do φ + T (zelena puščica pod osjo, če je φ + T v sliki).
    const z0 = q.nicle.find((x) => x >= fi - 1e-9 && x + q.T <= DO + 0.3) ?? q.nicle[0];
    const yT = Ax.Y(-A) + 12 > Ax.B ? Ax.B - 4 : Ax.Y(-A) + 12;
    crta(zg, Ax.X(z0), yT, Ax.X(z0 + q.T), yT, "druga", { "stroke-width": 2.5 });
    crta(zg, Ax.X(z0), yT - 5, Ax.X(z0), yT + 5, "druga");
    crta(zg, Ax.X(z0 + q.T), yT - 5, Ax.X(z0 + q.T), yT + 5, "druga");
    napis(g, (Ax.X(z0) + Ax.X(Math.min(DO, z0 + q.T))) / 2, yT - 6, "T", "druga", { "text-anchor": "middle" });
    const blizu = q.nicle.filter((x) => x >= -1e-9).slice(0, 3).map((x) => piZapis(x, 60) ?? `≈ ${st(x, 2)}`);
    S.cipi([
      { barva: "izbor", oznaka: "A", vrednost: st(A, 1) },
      { barva: "druga", oznaka: "T = \\frac{2\\pi}{\\omega}", vrednost: `${piZapis(q.T, 60) ?? ""} ≈ ${st(q.T, 2)}`.trim() },
      { barva: "ploskev", oznaka: "\\varphi", vrednost: piFmt(fi) },
      { barva: "ploskev", oznaka: "x = \\varphi + \\frac{k\\pi}{\\omega},\\ x \\ge 0", vrednost: `${blizu.join("; ")}; …` },
    ]);
  }
  izris();
  host.append(S.el);
}
