// Elipsa x²/a² + y²/b² = 1: drsnika a in b (b ≤ a), vlečna točka T po elipsi, gorišči F₁ in F₂,
// razdalji r₁ in r₂ ter temena. Vedno velja r₁ + r₂ = 2a.
import { st, crta, napis, vr } from "./skica.js";
import { s } from "../sim/kit.js";
import { elipsa, ravnina } from "./stoznice.js";

export default function narisi(host) {
  const { S, A, P, oznakaT } = ravnina("Povleci točko T po elipsi.", "Elipsa z goriščema");
  let a = 5, b = 3, t = 1.1, tocka;
  // b < a (kot na kartici): manjši a potisne b navzdol.
  S.drsnik({ label: "a", min: 1, max: 5.5, step: 0.5, value: a, digits: 1, barva: "ploskev", onInput: (v) => {
    a = v;
    if (b > a - 0.5) slB.set((b = Math.max(0.5, a - 0.5)), true); // a > b kot na kartici
    izris();
  } });
  const slB = S.drsnik({ label: "b", min: 0.5, max: 4, step: 0.5, value: b, digits: 1, barva: "glavna", onInput: (v) => {
    b = Math.min(v, Math.max(0.5, a - 0.5));
    if (b !== v) slB.set(b, true);
    izris();
  } });

  function izris() {
    const q = elipsa(a, b, t);
    const g = S.plast("e");
    const zg = s("g", { "clip-path": A.izrez }, g);
    const O = P([0, 0]), u = A.X(1) - A.X(0);
    s("ellipse", { cx: O[0], cy: O[1], rx: a * u, ry: b * u, class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    const F1 = P([-q.e, 0]), F2 = P([q.e, 0]), T = P(q.T);
    crta(zg, ...F1, ...T, "druga", { "stroke-width": 2.5 });
    crta(zg, ...F2, ...T, "izbor", { "stroke-width": 2.5 });
    for (const v of [[a, 0], [-a, 0], [0, b], [0, -b]]) s("circle", { cx: P(v)[0], cy: P(v)[1], r: 3.5, class: "sk-fill sk-fill-glavna" }, zg);
    for (const F of [F1, F2]) s("circle", { cx: F[0], cy: F[1], r: 5, class: "sk-fill sk-fill-ploskev" }, zg);
    napis(g, F1[0], F1[1] - 10, "F₁", "ploskev", { "text-anchor": "middle" });
    napis(g, F2[0], F2[1] - 10, "F₂", "ploskev", { "text-anchor": "middle" });
    oznakaT(g, q.T);
    if (tocka) tocka.move(...T);
    S.cipi([
      { barva: "ploskev", oznaka: "e = \\sqrt{a^2 - b^2}", vrednost: vr(q.e) },
      { barva: "druga", oznaka: "r_1", vrednost: vr(q.r1) },
      { barva: "izbor", oznaka: "r_2", vrednost: vr(q.r2) },
      { barva: "glavna", oznaka: "r_1 + r_2 = 2a", vrednost: vr(q.r1 + q.r2) },
    ]);
  }
  izris();
  tocka = S.tocka({
    x: P(elipsa(a, b, t).T)[0], y: P(elipsa(a, b, t).T)[1], label: "Točka T na elipsi: premikaj jo po krivulji",
    onMove: (x, y) => {
      const [vx, vy] = A.inv(x, y);
      t = Math.atan2(vy / b, vx / a);
      izris();
    },
  });
  izris();
  host.append(S.el);
}
