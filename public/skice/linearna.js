// Linearna funkcija y = kx + n: drsnika k in n; trikotnik naklona z oznakama 1 in k, točka N(0, n) in ničla x₀.
// Na listu za SŠ še naklonski kot φ s k = tan φ, kot na kartici Premica (OŠ: brez kota, linearna-os.js).
import { skica, st, crta, napis, osi, par, vr } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";

export function linearna(k, n) {
  const x0 = k === 0 ? null : -n / k;
  // φ: kot med premico in pozitivno smerjo osi x, 0° ≤ φ < 180° (pri k < 0 top kot).
  const at = (Math.atan(k) * 180) / Math.PI;
  return { f: (x) => k * x + n, x0, alfa: k < 0 ? 180 + at : at, vsakX: k === 0 && n === 0 };
}

export default function narisi(host, { kot = true } = {}) {
  const W = 300, H = 240;
  const S = skica({ w: W, h: H, navodilo: "Spreminjaj k in n.", oznaka: "Graf linearne funkcije" });
  const oz = [-4, -2, 2, 4].map((v) => [v, st(v, 0)]);
  // Enako merilo na obeh oseh (284 : 224 px), da je narisani kot φ pravi.
  const A = osi(S.svg, { W, H, x: [-5, 5], y: [-3.94, 3.94], rob: 8, xOznake: oz, yOznake: [-2, 2].map((v) => [v, st(v, 0)]) });
  let k = 0.5, n = 1;
  S.drsnik({ pripni: [0], label: "k", min: -3, max: 3, step: 0.25, value: k, digits: 2, barva: "izbor", onInput: (v) => ((k = v), izris()) });
  S.drsnik({ pripni: [0], label: "n", min: -3, max: 3, step: 0.5, value: n, digits: 1, barva: "druga", onInput: (v) => ((n = v), izris()) });

  function izris() {
    const q = linearna(k, n);
    const g = S.plast("graf");
    const zg = s("g", { "clip-path": A.izrez }, g);
    s("path", { d: fnPath(q.f, A, { n: 2 }), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    // Trikotnik naklona: od N za 1 v desno, nato za k gor ali dol.
    const N = [A.X(0), A.Y(n)], D = [A.X(1), A.Y(n)], K = [A.X(1), A.Y(n + k)];
    crta(zg, ...N, ...D, "ploskev", { "stroke-width": 2.5 });
    crta(zg, ...D, ...K, "izbor", { "stroke-width": 2.5 });
    napis(g, (N[0] + D[0]) / 2, D[1] + (k >= 0 ? 15 : -7), "1", "ploskev", { "text-anchor": "middle", style: "font-style: normal" });
    // Oznaka k ob vidnem delu navpične stranice (pri velikem n je del stranice zunaj okvirja).
    const yk = (Math.min(A.B, Math.max(A.T, D[1])) + Math.min(A.B, Math.max(A.T, K[1]))) / 2;
    if (Math.abs(k) > 0.2 && Math.abs(D[1] - K[1]) > 1 && yk > A.T + 8 && yk < A.B - 4) napis(g, D[0] + 6, yk + 4, "k", "izbor");
    if (kot && Math.abs(k) > 0.05 && q.x0 !== null && q.x0 > A.x0 && q.x0 < A.x1) {
      // Kot α med osjo x in premico, v ničli.
      const r = 20, Z = [A.X(q.x0), A.Y(0)], th = Math.atan(k * ((A.Y(0) - A.Y(1)) / (A.X(1) - A.X(0))));
      const ang = k > 0 ? th : Math.PI + th; // smer premice navzgor
      const e = [Z[0] + r * Math.cos(ang), Z[1] - r * Math.sin(ang)];
      s("path", { d: `M${Z[0] + r},${Z[1]} A${r},${r} 0 0 0 ${e[0]},${e[1]}`, class: "sk-s-ploskev" }, zg);
      napis(g, Z[0] + 30 * Math.cos(ang / 2), Z[1] - 30 * Math.sin(ang / 2) + 4, "φ", "ploskev", { "text-anchor": "middle" });
    }
    s("circle", { cx: N[0], cy: N[1], r: 5, class: "sk-fill sk-fill-druga" }, zg);
    napis(g, N[0] - 8, N[1] + (k >= 0 ? -8 : 16), "N", "druga", { "text-anchor": "end" });
    if (q.x0 !== null && q.x0 > A.x0 && q.x0 < A.x1) {
      s("circle", { cx: A.X(q.x0), cy: A.Y(0), r: 5, class: "sk-fill sk-fill-glavna" }, zg);
      napis(g, A.X(q.x0) + (k >= 0 ? -6 : 6), A.Y(0) - 8, "x₀", "glavna", { "text-anchor": k >= 0 ? "end" : "start" }); // na prazni strani premice
    }
    const cipi = [{ barva: "izbor", oznaka: kot ? "k = \\tan\\varphi" : "k", vrednost: st(k, 2) }];
    if (kot) cipi.push({ barva: "ploskev", oznaka: "\\varphi", vrednost: `${vr(q.alfa, 1)}°` });
    cipi.push(
      { barva: "druga", oznaka: "n", vrednost: st(n, 2) },
      { barva: "druga", oznaka: "N(0, n)", vrednost: `N${par(0, n, 2)}` },
      { barva: "glavna", oznaka: "x_0 = -\\frac{n}{k}", vrednost: q.x0 === null ? (q.vsakX ? "vsak x" : "ni ničle") : `${Math.abs(q.x0 - Number(q.x0.toFixed(2))) < 1e-9 ? "" : "≈\u00a0"}${st(q.x0, 2)}` },
    );
    S.cipi(cipi);
  }
  izris();
  host.append(S.el);
}
