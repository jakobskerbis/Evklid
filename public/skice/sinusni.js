// Sinusni izrek (SŠ): A in B sta na očrtani krožnici s polmerom R = 3, C se vleče po krožnici.
// Premer skozi C je 2R; vsa tri razmerja a/sin α, b/sin β, c/sin γ so enaka 2R.
import { skica, st, crta, napis, lokKota, vr, seznam } from "./skica.js";
import { s } from "../sim/kit.js";
import { trikotnik, rad } from "./geometrija.js";

export const R_OCRT = 3, KOT_A = 215, KOT_B = 325, ODMIK = 10;

// Kot točke C na krožnici (v stopinjah, 0° desno, v nasprotni smeri urinega kazalca), stran od A in B.
export function kotC(t) {
  let v = ((t % 360) + 360) % 360;
  for (const m of [KOT_A, KOT_B]) if (Math.abs(v - m) < ODMIK) v = v < m ? m - ODMIK : m + ODMIK;
  return v;
}

export function sinusni(t) {
  const na = (d) => [R_OCRT * Math.cos(rad(d)), R_OCRT * Math.sin(rad(d))];
  const A = na(KOT_A), B = na(KOT_B), C = na(kotC(t));
  const q = trikotnik(A, B, C);
  const sin = (d) => Math.sin(rad(d));
  return { A, B, C, ...q, ra: q.a / sin(q.alfa), rb: q.b / sin(q.beta), rc: q.c / sin(q.gama), dveR: 2 * R_OCRT };
}

export default function narisi(host) {
  const W = 300, H = 236, O = [150, 114], M = 32;
  const P = (v) => [O[0] + v[0] * M, O[1] - v[1] * M];
  const S = skica({ w: W, h: H, navodilo: "Povleci oglišče C po krožnici.", oznaka: "Sinusni izrek: trikotnik v očrtani krožnici" });
  s("circle", { cx: O[0], cy: O[1], r: R_OCRT * M, class: "sk-s-druga" }, S.svg);
  let t = 100, tocka;

  function izris() {
    const q = sinusni(t);
    const [A, B, C] = [q.A, q.B, q.C].map(P);
    const g = S.plast("lik");
    const D = [2 * O[0] - C[0], 2 * O[1] - C[1]];
    crta(g, ...C, ...D, "druga", { class: "sk-s-druga sk-dash", "stroke-width": 2 });
    s("circle", { cx: O[0], cy: O[1], r: 4, class: "sk-fill sk-fill-druga" }, g);
    const nor = [-(D[1] - C[1]), D[0] - C[0]], ln = Math.hypot(...nor) || 1;
    napis(g, (C[0] + 3 * O[0]) / 4 + (nor[0] / ln) * 12, (C[1] + 3 * O[1]) / 4 + (nor[1] / ln) * 12 + 4, "2R", "druga", { "text-anchor": "middle", style: "font-size: 12px" });
    s("polygon", { points: `${A} ${B} ${C}`, class: "sk-f-ploskev" }, g);
    s("polygon", { points: `${A} ${B} ${C}`, class: "sk-s-glavna" }, g);
    const Gx = (A[0] + B[0] + C[0]) / 3, Gy = (A[1] + B[1] + C[1]) / 3;
    for (const [V, P1, P2, ime, kot] of [[A, B, C, "α", q.alfa], [B, C, A, "β", q.beta], [C, A, B, "γ", q.gama]]) {
      const lok = lokKota(g, V, P1, P2, 15, "ploskev");
      if (kot > 16) napis(g, ...lok(27).map((v, i) => v + (i ? 4 : 0)), ime, "ploskev", { "text-anchor": "middle", style: "font-size: 12px" });
    }
    const ven = (Q, d) => {
      const l = Math.hypot(Q[0] - Gx, Q[1] - Gy) || 1;
      return [Q[0] + ((Q[0] - Gx) / l) * d, Math.min(H - 4, Math.max(14, Q[1] + ((Q[1] - Gy) / l) * d + 4))];
    };
    for (const [ime, P1, P2] of [["a", B, C], ["b", C, A], ["c", A, B]]) napis(g, ...ven([(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2], 11), ime, "glavna", { "text-anchor": "middle" });
    for (const [ime, V] of [["A", A], ["B", B]]) napis(g, ...ven(V, 16), ime, "glavna", { "text-anchor": "middle" });
    napis(g, ...ven(C, 20), "C", "glavna", { "text-anchor": "middle" });
    if (tocka) tocka.move(...C);
    S.cipi([
      { barva: "glavna", oznaka: "a,\\ b,\\ c", vrednost: seznam([q.a, q.b, q.c], 2) },
      { barva: "ploskev", oznaka: "\\alpha,\\ \\beta,\\ \\gamma", vrednost: seznam([q.alfa, q.beta, q.gama], 1, "°") },
      { barva: "glavna", oznaka: "\\frac{a}{\\sin\\alpha}", vrednost: vr(q.ra, 2) },
      { barva: "glavna", oznaka: "\\frac{b}{\\sin\\beta}", vrednost: vr(q.rb, 2) },
      { barva: "glavna", oznaka: "\\frac{c}{\\sin\\gamma}", vrednost: vr(q.rc, 2) },
      { barva: "druga", oznaka: "2R", vrednost: st(q.dveR, 0) },
    ]);
  }
  izris();
  tocka = S.tocka({
    x: P(sinusni(t).C)[0],
    y: P(sinusni(t).C)[1],
    label: "Oglišče C: premikaj ga po krožnici",
    onMove: (x, y) => ((t = kotC((Math.atan2(O[1] - y, x - O[0]) * 180) / Math.PI)), izris()),
  });
  izris();
  host.append(S.el);
}
