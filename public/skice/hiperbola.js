// Hiperbola x²/a² − y²/b² = 1: drsnika a in b, vlečna točka T (tudi na drugo vejo), gorišči, asimptoti
// y = ±(b/a)x in pravokotnik 2a × 2b. Vedno velja |r₁ − r₂| = 2a.
import { st, crta, napis, vr } from "./skica.js";
import { s } from "../sim/kit.js";
import { hiperbola, ravnina } from "./stoznice.js";

// Parameter točke, da T ostane v okvirju (|x| ≤ 5,8, |y| ≤ 4,3).
export const tMeja = (a, b) => Math.min(Math.acosh(Math.max(1, 5.8 / a)), Math.asinh(4.3 / b));

export default function narisi(host) {
  const { S, A, P, oznakaT } = ravnina("Povleci točko T, tudi na drugo vejo.", "Hiperbola z goriščema in asimptotama");
  let a = 2, b = 1.5, t = 0.8, veja = 1, tocka;
  S.drsnik({ label: "a", min: 0.5, max: 3.5, step: 0.5, value: a, digits: 1, barva: "ploskev", onInput: (v) => ((a = v), izris()) });
  S.drsnik({ label: "b", min: 0.5, max: 3.5, step: 0.5, value: b, digits: 1, barva: "glavna", onInput: (v) => ((b = v), izris()) });
  // Gumba za vejo: s tipkovnico se T na drugo vejo ne da povleči.
  const gVeja = S.gumbi({ label: "Veja hiperbole", options: [["1", "desna veja"], ["-1", "leva veja"]], value: "1", onChange: (v) => ((veja = Number(v)), izris()) });

  function izris() {
    t = Math.max(-tMeja(a, b), Math.min(tMeja(a, b), t)); // tudi ob spremembi a ali b
    const q = hiperbola(a, b, t, veja);
    const g = S.plast("h");
    const zg = s("g", { "clip-path": A.izrez }, g);
    s("polygon", { points: [[a, b], [-a, b], [-a, -b], [a, -b]].map((v) => P(v).join(",")).join(" "), class: "sk-s-glavna sk-thin sk-faint" }, zg);
    // Asimptoti kot daljici do roba okvirja (tudi pri velikem b/a).
    const c = Math.min(6.2, 4.7 / q.k);
    for (const z of [1, -1]) crta(zg, ...P([-c, -z * q.k * c]), ...P([c, z * q.k * c]), "glavna", { class: "sk-s-glavna sk-thin sk-dash" });
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
    oznakaT(g, q.T);
    if (tocka) tocka.move(...T);
    S.cipi([
      { barva: "ploskev", oznaka: "e = \\sqrt{a^2 + b^2}", vrednost: vr(q.e) },
      { barva: "glavna", oznaka: "\\pm\\frac{b}{a}", vrednost: `±${vr(q.k)}`.replace("±≈\u00a0", "≈\u00a0±") },
      { barva: "druga", oznaka: "r_1", vrednost: vr(q.r1) },
      { barva: "izbor", oznaka: "r_2", vrednost: vr(q.r2) },
      { barva: "glavna", oznaka: "|r_1 - r_2| = 2a", vrednost: vr(Math.abs(q.r1 - q.r2)) },
    ]);
  }
  izris();
  const T0 = P(hiperbola(a, b, t, veja).T);
  tocka = S.tocka({
    x: T0[0], y: T0[1], label: "Točka T na hiperboli: premikaj jo po veji ali na drugo vejo",
    onMove: (x, y) => {
      const [vx, vy] = A.inv(x, y);
      const nova = vx < 0 ? -1 : 1;
      if (nova !== veja) gVeja.set(String((veja = nova)), true);
      const m = tMeja(a, b);
      t = Math.max(-m, Math.min(m, Math.asinh(vy / b)));
      izris();
    },
  });
  izris();
  host.append(S.el);
}
