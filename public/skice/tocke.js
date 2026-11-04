// Analitična geometrija v ravnini: točke A, B, C se vlečejo po mreži (korak 0,5); daljica AB z
// razpoloviščem S, trikotnik ABC s ploščino in orientacijo (puščica v smeri A → B → C).
import { skica, st, crta, napis, osi } from "./skica.js";
import { s } from "../sim/kit.js";

export const MEJA = 4;

export function tocke([x1, y1], [x2, y2], [x3, y3]) {
  const d2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  const det = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
  return { d: Math.sqrt(d2), d2, S: [(x1 + x2) / 2, (y1 + y2) / 2], det, ploscina: Math.abs(det) / 2, orientacija: det > 0 ? 1 : det < 0 ? -1 : 0 };
}

const tocno = (v) => Math.abs(v - Number(v.toFixed(2))) < 1e-9;

export default function narisi(host) {
  const W = 300, H = 260;
  const S = skica({ w: W, h: H, navodilo: "Povleci oglišča A, B in C.", oznaka: "Točke v ravnini: razdalja, razpolovišče in ploščina trikotnika" });
  const oz = [-4, -2, 2, 4].map((v) => [v, st(v, 0)]);
  const Ax = osi(S.svg, { W, H, x: [-5, 5.35], y: [-4.5, 4.5], rob: 6, xOznake: oz, yOznake: oz });
  const P = (v) => [Ax.X(v[0]), Ax.Y(v[1])];
  const T = { A: [-3, -2], B: [3, 1], C: [-1, 3] };
  const vlecne = {};

  function izris() {
    const q = tocke(T.A, T.B, T.C);
    const g = S.plast("lik");
    s("polygon", { points: [T.A, T.B, T.C].map((v) => P(v).join(",")).join(" "), class: "sk-f-ploskev" }, g);
    crta(g, ...P(T.B), ...P(T.C), "glavna", { class: "sk-s-glavna sk-thin" });
    crta(g, ...P(T.C), ...P(T.A), "glavna", { class: "sk-s-glavna sk-thin" });
    crta(g, ...P(T.A), ...P(T.B), "izbor", { "stroke-width": 3 });
    // Orientacija: krožna puščica okoli težišča v smeri A → B → C.
    if (q.orientacija) {
      const G = P([(T.A[0] + T.B[0] + T.C[0]) / 3, (T.A[1] + T.B[1] + T.C[1]) / 3]), r = 11, sw = q.orientacija > 0 ? 0 : 1;
      // Tri četrtine kroga: pri pozitivni orientaciji v nasprotni smeri urinega kazalca do spodnje točke,
      // pri negativni v smeri urinega kazalca do zgornje; v obeh točkah gre puščica v desno.
      const z = [G[0] + r, G[1]], k = [G[0], G[1] + (q.orientacija > 0 ? r : -r)];
      s("path", { d: `M${z} A${r},${r} 0 1 ${sw} ${k}`, class: "sk-s-glavna sk-thin" }, g);
      s("path", { d: `M${k[0] - 6},${k[1] - 4} L${k} L${k[0] - 6},${k[1] + 4}`, class: "sk-s-glavna sk-thin" }, g);
    }
    const Sp = P(q.S);
    s("circle", { cx: Sp[0], cy: Sp[1], r: 5, class: "sk-fill sk-fill-druga" }, g);
    napis(g, Sp[0] + 8, Sp[1] + 16, "S", "druga");
    for (const [ime, v] of Object.entries(T)) {
      const [x, y] = P(v);
      napis(g, Math.min(W - 10, x + 14), Math.max(14, y - 10), ime, "glavna");
      const t = vlecne[ime];
      if (t) {
        t.move(x, y);
        if (S.svg.lastChild !== t) S.svg.append(t);
      }
    }
    const zv = (v) => `(${st(v[0], 2)}, ${st(v[1], 2)})`;
    S.cipi([
      { barva: "izbor", oznaka: "d(A, B)", vrednost: `√${st(q.d2, 2)} ${tocno(q.d) ? "=" : "≈"} ${st(q.d, 2)}` },
      { barva: "druga", oznaka: "S", vrednost: zv(q.S) },
      { barva: "ploskev", oznaka: "S_{\\triangle ABC}", vrednost: st(q.ploscina, 2) },
      { barva: "glavna", oznaka: "\\text{orientacija}", vrednost: q.orientacija > 0 ? "pozitivna ↺" : q.orientacija < 0 ? "negativna ↻" : "točke so kolinearne" },
    ]);
  }
  izris();
  for (const ime of Object.keys(T))
    vlecne[ime] = S.tocka({
      x: P(T[ime])[0],
      y: P(T[ime])[1],
      label: `Oglišče ${ime}: premikaj ga po mreži`,
      onMove: (x, y) => {
        const [vx, vy] = Ax.inv(x, y);
        T[ime] = [Math.max(-MEJA, Math.min(MEJA, Math.round(vx * 2) / 2)), Math.max(-MEJA, Math.min(MEJA, Math.round(vy * 2) / 2))];
        izris();
      },
    });
  izris();
  host.append(S.el);
}
