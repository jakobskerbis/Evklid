// Kosinusni izrek (SŠ): A je pritrjen, B se vleče po osnovnici, C po mreži (korak 0,5); kot γ pri C.
// Čipi: a, b, γ, c² in a² + b² − 2ab cos γ (vedno enaka).
import { skica, st, crta, napis, lokKota, vr } from "./skica.js";
import { s } from "../sim/kit.js";
import { trikotnik, rad } from "./geometrija.js";

const W = 300, H = 240, M = 28, X0 = 10, Y0 = 228;
const P = (v) => [X0 + v[0] * M, Y0 - v[1] * M];
const omeji = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.round(v * 2) / 2));

export function kosinusni(A, B, C) {
  const q = trikotnik(A, B, C);
  const dvaAB = 2 * q.a * q.b * Math.cos(rad(q.gama));
  return { ...q, c2: q.c * q.c, desno: q.a * q.a + q.b * q.b - dvaAB, dvaAB };
}

export default function narisi(host) {
  const S = skica({ w: W, h: H, navodilo: "Povleci oglišči B in C.", oznaka: "Kosinusni izrek: stranica c in kot γ" });
  const A = [1, 1], T = { B: [8.5, 1], C: [3, 6] };
  const vlecne = {};

  function izris() {
    const q = kosinusni(A, T.B, T.C);
    const [pA, pB, pC] = [A, T.B, T.C].map(P);
    const g = S.plast("lik");
    s("polygon", { points: `${pA} ${pB} ${pC}`, class: "sk-f-ploskev" }, g);
    crta(g, ...pB, ...pC, "ploskev", { "stroke-width": 2.5 });
    crta(g, ...pC, ...pA, "druga", { "stroke-width": 2.5 });
    crta(g, ...pA, ...pB, "izbor", { "stroke-width": 3 });
    if (!q.izrojen) {
      const lok = lokKota(g, pC, pA, pB, 18, "glavna");
      if (q.gama > 14) napis(g, ...lok(31).map((v, i) => v + (i ? 4 : 0)), "γ", "glavna", { "text-anchor": "middle" });
    }
    const Gx = (pA[0] + pB[0] + pC[0]) / 3, Gy = (pA[1] + pB[1] + pC[1]) / 3;
    const ven = (Q, d) => {
      const l = Math.hypot(Q[0] - Gx, Q[1] - Gy) || 1;
      return [Math.min(W - 8, Math.max(8, Q[0] + ((Q[0] - Gx) / l) * d)), Math.min(H - 4, Math.max(14, Q[1] + ((Q[1] - Gy) / l) * d + 4))];
    };
    for (const [ime, P1, P2, b] of [["a", pB, pC, "ploskev"], ["b", pC, pA, "druga"], ["c", pA, pB, "izbor"]]) napis(g, ...ven([(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2], 12), ime, b, { "text-anchor": "middle" });
    napis(g, ...ven(pA, 18), "A", "glavna", { "text-anchor": "middle" });
    for (const ime of ["B", "C"]) {
      const V = P(T[ime]);
      napis(g, ...ven(V, 18), ime, "glavna", { "text-anchor": "middle" });
      vlecne[ime]?.move(...V);
    }
    if (q.izrojen) return S.cipi([{ barva: "napaka", oznaka: "\\text{trikotnik}", vrednost: "oglišča ležijo na isti premici" }]);
    S.cipi([
      { barva: "ploskev", oznaka: "a", vrednost: vr(q.a, 2) },
      { barva: "druga", oznaka: "b", vrednost: vr(q.b, 2) },
      { barva: "glavna", oznaka: "\\gamma", vrednost: `${vr(q.gama, 1)}°` },
      { barva: "izbor", oznaka: "c^2", vrednost: vr(q.c2, 2) },
      { barva: "glavna", oznaka: "2ab\\cos\\gamma", vrednost: vr(q.dvaAB, 2) },
      { barva: "izbor", oznaka: "a^2 + b^2 - 2ab\\cos\\gamma", vrednost: vr(q.desno, 2) },
    ]);
  }

  izris();
  for (const ime of ["B", "C"])
    vlecne[ime] = S.tocka({
      x: P(T[ime])[0],
      y: P(T[ime])[1],
      label: ime === "B" ? "Oglišče B: premikaj ga po osnovnici" : "Oglišče C: premikaj ga po mreži",
      onMove: (x, y) => {
        const v = ime === "B" ? [omeji((x - X0) / M, 2, 10), 1] : [omeji((x - X0) / M, 0.5, 10), omeji((Y0 - y) / M, 1.5, 7.5)];
        const drugo = ime === "B" ? T.C : T.B;
        if ((v[0] === A[0] && v[1] === A[1]) || (v[0] === drugo[0] && v[1] === drugo[1])) return;
        T[ime] = v;
        izris();
      },
    });
  izris();
  host.append(S.el);
}
