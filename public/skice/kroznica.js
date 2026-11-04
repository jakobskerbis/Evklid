// Krožnica (x − p)² + (y − q)² = r²: vlečno središče S(p, q) in točka na krožnici, ki spreminja polmer.
import { st, crta, napis } from "./skica.js";
import { s } from "../sim/kit.js";
import { kroznica, ravnina } from "./stoznice.js";

export default function narisi(host) {
  const { S, A, P } = ravnina("Povleci središče ali točko na krožnici.", "Krožnica s središčem in polmerom");
  let p = 1, q = 0.5, r = 2.5, kot = 0.6;
  const vlec = {};
  const pol = (v) => Math.round(v * 2) / 2; // mreža s korakom 0,5

  // Točka na krožnici ostane v okvirju: če je zunaj, se premakne na najbližji kot, kjer je vidna.
  const vOkvirju = (u) => {
    const [x, y] = [p + r * Math.cos(u), q + r * Math.sin(u)];
    return Math.abs(x) <= 5.7 && Math.abs(y) <= 4.2;
  };
  function popraviKot() {
    if (vOkvirju(kot)) return;
    for (let d = 0.1; d <= Math.PI; d += 0.1)
      for (const u of [kot + d, kot - d]) if (vOkvirju(u)) return void (kot = u);
  }

  function izris() {
    popraviKot();
    const k = kroznica(p, q, r);
    const g = S.plast("k");
    const zg = s("g", { "clip-path": A.izrez }, g);
    const C = P([p, q]), T = P([p + r * Math.cos(kot), q + r * Math.sin(kot)]);
    s("circle", { cx: C[0], cy: C[1], r: r * (A.X(1) - A.X(0)), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    crta(zg, ...C, ...T, "druga", { "stroke-width": 2.5 });
    napis(g, Math.min(A.R - 8, Math.max(A.L + 14, (C[0] + T[0]) / 2 - 6)), Math.min(A.B - 4, Math.max(A.T + 14, (C[1] + T[1]) / 2 - 6)), "r", "druga", { "text-anchor": "end" });
    napis(g, C[0] - 8, C[1] + 16, "S", "ploskev", { "text-anchor": "end" });
    if (vlec.S) vlec.S.move(...C);
    if (vlec.T) vlec.T.move(...T);
    S.cipi([
      { barva: "ploskev", oznaka: "p", vrednost: st(p, 1) },
      { barva: "ploskev", oznaka: "q", vrednost: st(q, 1) },
      { barva: "druga", oznaka: "r", vrednost: st(r, 2) },
      { barva: "glavna", oznaka: "\\text{enačba}", vrednost: k.enacba }, // splošna oblika je že na kartici
    ]);
  }
  izris();
  vlec.S = S.tocka({
    x: P([p, q])[0], y: P([p, q])[1], label: "Središče krožnice: premikaj ga po mreži",
    onMove: (x, y) => {
      const [vx, vy] = A.inv(x, y);
      p = Math.max(-4, Math.min(4, pol(vx)));
      q = Math.max(-3, Math.min(3, pol(vy)));
      izris();
    },
  });
  vlec.T = S.tocka({
    x: 0, y: 0, label: "Točka na krožnici: z njo spremeniš polmer",
    onMove: (x, y) => {
      const [vx, vy] = A.inv(x, y);
      const d = Math.hypot(vx - p, vy - q);
      if (d < 0.2) return;
      kot = Math.atan2(vy - q, vx - p);
      r = Math.max(0.5, Math.min(4, Math.round(d * 2) / 2));
      izris();
    },
  });
  izris();
  host.append(S.el);
}
