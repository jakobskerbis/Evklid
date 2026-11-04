// Parabola y² = 2px: drsnik p, vlečna točka T, gorišče G(p/2, 0) in vodnica x = −p/2.
// Vedno velja d(T, G) = d(T, v).
import { st, crta, napis, vr } from "./skica.js";
import { s } from "../sim/kit.js";
import { parabola, ravnina } from "./stoznice.js";

export default function narisi(host) {
  const { S, A, P, oznakaT } = ravnina("Povleci točko T po paraboli.", "Parabola z goriščem in vodnico");
  let p = 2, y = 2, tocka;
  S.drsnik({ label: "p", min: 0.5, max: 4, step: 0.5, value: p, digits: 1, barva: "ploskev", onInput: (v) => ((p = v), izris()) });
  // T ostane v okvirju: x = y²/2p ≤ 5,8 in |y| ≤ 4,3.
  const omeji = (v) => Math.max(-Math.min(4.3, Math.sqrt(11.6 * p)), Math.min(Math.min(4.3, Math.sqrt(11.6 * p)), v));

  function izris() {
    y = omeji(y);
    const q = parabola(p, y);
    const g = S.plast("p");
    const zg = s("g", { "clip-path": A.izrez }, g);
    const d = [];
    for (let i = 0; i <= 120; i++) {
      const u = -5 + (10 * i) / 120;
      d.push(`${i ? "L" : "M"}${P([(u * u) / (2 * p), u]).map((c) => c.toFixed(1)).join(",")}`);
    }
    s("path", { d: d.join(""), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    crta(zg, A.X(-p / 2), A.T, A.X(-p / 2), A.B, "druga", { class: "sk-s-druga sk-dash" });
    napis(g, A.X(-p / 2) - 4, A.T + 12, "v", "druga", { "text-anchor": "end" });
    const G = P(q.G), T = P(q.T), V = P([-p / 2, y]);
    crta(zg, ...T, ...G, "izbor", { "stroke-width": 2.5 });
    crta(zg, ...T, ...V, "druga", { "stroke-width": 2.5 });
    s("circle", { cx: G[0], cy: G[1], r: 5, class: "sk-fill sk-fill-ploskev" }, zg);
    napis(g, G[0] + 6, G[1] + 18, "G", "ploskev");
    oznakaT(g, q.T);
    if (tocka) tocka.move(...T);
    S.cipi([
      { barva: "ploskev", oznaka: "\\frac{p}{2}", vrednost: st(p / 2, 2) },
      { barva: "izbor", oznaka: "d(T, G)", vrednost: vr(q.dV) }, // enaki razdalji, zaokrožena enako
      { barva: "druga", oznaka: "d(T, v)", vrednost: vr(q.dV) },
    ]);
  }
  izris();
  tocka = S.tocka({
    x: P(parabola(p, y).T)[0], y: P(parabola(p, y).T)[1], label: "Točka T na paraboli: premikaj jo gor in dol",
    onMove: (x, py) => ((y = A.inv(x, py)[1]), izris()),
  });
  izris();
  host.append(S.el);
}
