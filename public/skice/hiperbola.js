// Hiperbola x²/a² − y²/b² = 1: drsnika a in b, vlečna točka T (tudi na drugo vejo), gorišči, asimptoti
// y = ±(b/a)x in pravokotnik 2a × 2b. Vedno velja |r₁ − r₂| = 2a.
import { st, crta, napis, vr } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";
import { hiperbola, ravnina } from "./stoznice.js";

export const T_MEJA = 2.2; // parameter točke: T ostane v okvirju

export default function narisi(host) {
  const { S, A, P } = ravnina("Povleci točko T, tudi na drugo vejo.", "Hiperbola z goriščema in asimptotama");
  let a = 2, b = 1.5, t = 0.8, veja = 1, tocka;
  S.drsnik({ label: "a", min: 0.5, max: 3.5, step: 0.5, value: a, digits: 1, barva: "ploskev", onInput: (v) => ((a = v), izris()) });
  S.drsnik({ label: "b", min: 0.5, max: 3.5, step: 0.5, value: b, digits: 1, barva: "glavna", onInput: (v) => ((b = v), izris()) });

  function izris() {
    const q = hiperbola(a, b, t, veja);
    const g = S.plast("h");
    const zg = s("g", { "clip-path": A.izrez }, g);
    s("polygon", { points: [[a, b], [-a, b], [-a, -b], [a, -b]].map((v) => P(v).join(",")).join(" "), class: "sk-s-glavna sk-thin sk-faint" }, zg);
    for (const z of [1, -1]) s("path", { d: fnPath((x) => z * q.k * x, A, { n: 2 }), class: "sk-s-glavna sk-thin sk-dash" }, zg);
    for (const v of [1, -1]) {
      const d = [];
      for (let i = 0; i <= 120; i++) {
        const u = -3 + (6 * i) / 120;
        d.push(`${i ? "L" : "M"}${P([v * a * Math.cosh(u), b * Math.sinh(u)]).map((c) => c.toFixed(1)).join(",")}`);
      }
      s("path", { d: d.join(""), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    }
    const F1 = P([-q.e, 0]), F2 = P([q.e, 0]), T = P(q.T);
    crta(zg, ...F1, ...T, "druga", { "stroke-width": 2.5 });
    crta(zg, ...F2, ...T, "izbor", { "stroke-width": 2.5 });
    for (const F of [F1, F2]) s("circle", { cx: F[0], cy: F[1], r: 5, class: "sk-fill sk-fill-ploskev" }, zg);
    napis(g, F1[0], F1[1] - 10, "F₁", "ploskev", { "text-anchor": "middle" });
    napis(g, F2[0], F2[1] - 10, "F₂", "ploskev", { "text-anchor": "middle" });
    if (tocka) tocka.move(...T);
    S.cipi([
      { barva: "ploskev", oznaka: "e = \\sqrt{a^2 + b^2}", vrednost: vr(q.e) },
      { barva: "glavna", oznaka: "y = \\pm\\frac{b}{a}x", vrednost: `±${vr(q.k)}`.replace("±≈ ", "≈ ±") },
      { barva: "druga", oznaka: "r_1", vrednost: vr(q.r1) },
      { barva: "izbor", oznaka: "r_2", vrednost: vr(q.r2) },
      { barva: "glavna", oznaka: "|r_1 - r_2| = 2a", vrednost: `${vr(Math.abs(q.r1 - q.r2))} = ${st(2 * a, 1)}` },
    ]);
  }
  izris();
  const T0 = P(hiperbola(a, b, t, veja).T);
  tocka = S.tocka({
    x: T0[0], y: T0[1], label: "Točka T na hiperboli: premikaj jo po veji ali na drugo vejo",
    onMove: (x, y) => {
      const [vx, vy] = A.inv(x, y);
      veja = vx < 0 ? -1 : 1;
      t = Math.max(-T_MEJA, Math.min(T_MEJA, Math.asinh(vy / b)));
      izris();
    },
  });
  izris();
  host.append(S.el);
}
