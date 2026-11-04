// Povprečje in standardni odklon (SŠ): 5 vlečnih točk na premici 0–10 (korak 0,5), črta x̄, pas x̄ ± σ
// in odmiki x_i − x̄. Čipi: x̄, σ (deljeno z N) in σ².
import { skica, st, crta, napis, stevilka, vr } from "./skica.js";
import { s } from "../sim/kit.js";
import { statistika } from "./integral.js";

export const MEJA = [0, 10];

export default function narisi(host) {
  const W = 300, H = 200, L = 18, R = 282, Y = 160;
  const X = (v) => L + (v / 10) * (R - L);
  const S = skica({ w: W, h: H, navodilo: "Povleci podatke x₁ … x₅ po premici.", oznaka: "Aritmetična sredina in standardni odklon" });
  crta(S.svg, L - 6, Y, R + 6, Y, "glavna", { class: "sk-s-glavna sk-thin" });
  for (let v = 0; v <= 10; v++) {
    crta(S.svg, X(v), Y - 4, X(v), Y + 4, "glavna", { class: "sk-s-glavna sk-thin" });
    if (v % 2 === 0) stevilka(S.svg, X(v), Y + 18, st(v, 0));
  }
  const xs = [2, 3.5, 5, 6, 8.5];
  const vlecne = [];

  function izris() {
    const q = statistika(xs);
    const g = S.plast("odkloni");
    s("rect", { x: X(Math.max(0, q.x - q.sigma)), y: 18, width: X(Math.min(10, q.x + q.sigma)) - X(Math.max(0, q.x - q.sigma)), height: Y - 18, class: "sk-f-druga" }, g);
    for (const v of [q.x - q.sigma, q.x + q.sigma]) if (v >= 0 && v <= 10) crta(g, X(v), 18, X(v), Y, "druga", { class: "sk-s-druga sk-thin sk-dash" });
    // Odmiki: vsak v svoji vrstici nad premico, od x̄ do x_i.
    const vrst = xs.map((v, i) => i).sort((a, b) => xs[a] - xs[b]);
    vrst.forEach((i, j) => {
      const y = 40 + j * 22;
      crta(g, X(q.x), y, X(xs[i]), y, "druga", { "stroke-width": 2.5 });
      crta(g, X(xs[i]), y, X(xs[i]), Y, "glavna", { class: "sk-s-glavna sk-thin sk-faint" });
    });
    crta(g, X(q.x), 18, X(q.x), Y, "izbor", { "stroke-width": 2.5 });
    const t = napis(g, X(q.x) + 5, 30, "x", "izbor");
    s("tspan", { dx: -8, dy: -9, style: "font-size: 12px" }, t, "‾");
    napis(g, Math.min(R, X(q.x + q.sigma)) - 4, 30, "+σ", "druga", { "text-anchor": "end", style: "font-size: 11px" });
    xs.forEach((v, i) => vlecne[i]?.move(X(v), Y));
    S.cipi([
      { barva: "glavna", oznaka: "x_i", vrednost: xs.map((v) => st(v, 1)).join("; ") },
      { barva: "izbor", oznaka: "\\bar{x} = \\frac{1}{N} \\sum x_i", vrednost: vr(q.x, 2) },
      { barva: "druga", oznaka: "\\sigma = \\sqrt{\\frac{1}{N} \\sum (x_i - \\bar{x})^2}", vrednost: vr(q.sigma, 3) },
      { barva: "druga", oznaka: "\\sigma^2", vrednost: vr(q.var, 3) },
    ]);
  }
  izris();
  xs.forEach((v, i) =>
    vlecne.push(
      S.tocka({
        x: X(v),
        y: Y,
        label: `Podatek x${"₁₂₃₄₅"[i]}: premikaj ga po premici`,
        onMove: (px) => ((xs[i] = Math.max(MEJA[0], Math.min(MEJA[1], Math.round(((px - L) / (R - L)) * 20) / 2))), izris()),
      }),
    ),
  );
  izris();
  host.append(S.el);
}
