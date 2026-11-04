// Definicija integrala (SŠ kartica Integrali): n pravokotnikov (1–40) z višino f v sredini podintervala,
// srednji pravokotnik je poudarjen z f_i in Δx_i. Čipi: Σ f_i Δx_i, ∫ f dx = 82/15 in razlika.
import { skica, st, crta, napis, osi, vr } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";
import { f, riemann, TOCNO, A_INT, B_INT } from "./integral.js";

export const N_MIN = 1, N_MAX = 40;

// Okvir za f(x) = 0,3x³ − 1,75x² + 2,7x + 0,5 na [0, 4] (skupen z drugimi skicami integrala).
export function okvirInt(navodilo, oznaka) {
  const W = 300, H = 220;
  const S = skica({ w: W, h: H, navodilo, oznaka });
  const A = osi(S.svg, { W, H, x: [-0.35, 4.35], y: [-0.3, 2.85], rob: 8, xOznake: [1, 2, 3, 4].map((v) => [v, st(v, 0)]), yOznake: [1, 2].map((v) => [v, st(v, 0)]) });
  napis(S.svg, A.X(0) + 6, A.T + 12, "f(x) = 0,3x³ − 1,75x² + 2,7x + 0,5", "glavna", { style: "font-size: 11px" });
  return { S, A };
}

export default function narisi(host) {
  const { S, A } = okvirInt("Spreminjaj število pravokotnikov n.", "Definicija integrala: Riemannova vsota");
  let n = 6;
  S.drsnik({ label: "n", min: N_MIN, max: N_MAX, step: 1, value: n, digits: 0, barva: "ploskev", onInput: (v) => ((n = v), izris()) });

  function izris() {
    const q = riemann(n);
    const g = S.plast("graf");
    const izb = Math.ceil(n / 2) - 1; // poudarjen pravokotnik
    q.pr.forEach((p, i) => {
      s("rect", { x: A.X(p.x0), y: A.Y(p.fi), width: A.X(p.x0 + q.dx) - A.X(p.x0), height: A.Y(0) - A.Y(p.fi), class: i === izb ? "sk-f-izbor" : "sk-f-ploskev" }, g);
      if (n <= 20 || i === izb) s("rect", { x: A.X(p.x0), y: A.Y(p.fi), width: A.X(p.x0 + q.dx) - A.X(p.x0), height: A.Y(0) - A.Y(p.fi), class: i === izb ? "sk-s-izbor" : "sk-s-ploskev sk-thin", style: "fill: none" }, g);
    });
    s("path", { d: fnPath(f, A, { from: A_INT, to: B_INT, n: 200 }), class: "sk-s-glavna", "stroke-width": 2.5 }, g);
    const p = q.pr[izb], xm = A.X(p.xs);
    s("circle", { cx: xm, cy: A.Y(p.fi), r: 4, class: "sk-fill sk-fill-izbor" }, g);
    crta(g, xm, A.Y(p.fi), xm, A.Y(0), "izbor", { class: "sk-s-izbor sk-thin sk-dash" });
    const t = napis(g, xm + 6, (A.Y(p.fi) + A.Y(0)) / 2, "f", "izbor", { style: "font-size: 12px" });
    s("tspan", { dy: 4, style: "font-size: 9px" }, t, "i");
    // Nad osjo (pod njo so oznake osi), z obrobo v barvi ozadja, da se bere čez sosednje pravokotnike.
    const d = napis(g, xm, A.Y(0) - 5, "Δx", "izbor", { "text-anchor": "middle", style: "font-size: 11px; paint-order: stroke; stroke: var(--sk-bg); stroke-width: 3px" });
    s("tspan", { dy: 3, style: "font-size: 8px" }, d, "i");
    S.cipi([
      { barva: "ploskev", oznaka: "n", vrednost: st(n, 0) },
      { barva: "izbor", oznaka: "\\Delta x_i = \\frac{b - a}{n}", vrednost: vr(q.dx, 3) },
      { barva: "ploskev", oznaka: "\\sum f_i \\Delta x_i", vrednost: vr(q.vsota, 4) },
      { barva: "glavna", oznaka: "\\int_0^4 f(x)\\,dx", vrednost: `82/15 ${vr(TOCNO, 4)}` },
      { barva: "napaka", oznaka: "\\text{razlika}", vrednost: vr(q.vsota - TOCNO, 4) },
    ]);
  }
  izris();
  host.append(S.el);
}
