// Trikotnik z vlečnimi oglišči A, B, C (po mreži s korakom 0,5), koti α, β, γ.
// OŠ (kartica Trikotnik): višina v_c, obseg in ploščina S = c · v_c / 2.
// SŠ (kartica Polmera): očrtana krožnica (O, R) in včrtana krožnica (I, r); R = abc/(4S), r = S/s.
import { skica, crta, napis, novId, lokKota, praviKot, vr, seznam } from "./skica.js";
import { s } from "../sim/kit.js";
import { trikotnik } from "./geometrija.js";

const W = 300, H = 240, M = 28, X0 = 10, Y0 = 228; // 28 px na enoto, izhodišče spodaj levo
export const MEJE = { x: [0.5, 9.5], y: [0.5, 7] };
const P = (v) => [X0 + v[0] * M, Y0 - v[1] * M];
const omeji = (v, [lo, hi]) => Math.min(hi, Math.max(lo, Math.round(v * 2) / 2));

export default function narisi(host, { krozici = false } = {}) {
  const S = skica({ w: W, h: H, navodilo: "Povleci oglišča A, B in C.", oznaka: krozici ? "Trikotnik z očrtano in včrtano krožnico" : "Trikotnik z višino na stranico c" });
  const id = novId("okvir");
  s("rect", { x: 0, y: 0, width: W, height: H }, s("clipPath", { id }, s("defs", {}, S.svg)));
  const T = { A: [1, 1], B: [8.5, 1.5], C: [3.5, 6] };
  const vlecne = {};

  function izris() {
    const q = trikotnik(T.A, T.B, T.C);
    const [A, B, C] = [T.A, T.B, T.C].map(P);
    const g = S.plast("lik");
    const zg = s("g", { "clip-path": `url(#${id})` }, g);
    const Gx = (A[0] + B[0] + C[0]) / 3, Gy = (A[1] + B[1] + C[1]) / 3;
    s("polygon", { points: `${A} ${B} ${C}`, class: "sk-f-ploskev" }, zg);
    if (!q.izrojen && krozici) {
      const O = P(q.O), I = P(q.I);
      s("circle", { cx: O[0], cy: O[1], r: q.R * M, class: "sk-s-druga" }, zg);
      crta(zg, ...O, ...A, "druga", { class: "sk-s-druga sk-thin sk-dash" });
      napis(g, (O[0] + A[0]) / 2 - 4, (O[1] + A[1]) / 2 - 5, "R", "druga", { "text-anchor": "end", style: "font-size: 12px" });
      s("circle", { cx: O[0], cy: O[1], r: 4, class: "sk-fill sk-fill-druga" }, zg);
      if (O[0] > 8 && O[0] < W - 16 && O[1] > 16 && O[1] < H - 4) napis(g, O[0] + 7, O[1] - 7, "O", "druga"); // O je lahko zunaj okvirja
      s("circle", { cx: I[0], cy: I[1], r: q.r * M, class: "sk-s-izbor" }, zg);
      // r do dotikališča na AB (nožišče pravokotnice iz I).
      const ab = [T.B[0] - T.A[0], T.B[1] - T.A[1]], t = ((q.I[0] - T.A[0]) * ab[0] + (q.I[1] - T.A[1]) * ab[1]) / (q.c * q.c);
      const D = P([T.A[0] + t * ab[0], T.A[1] + t * ab[1]]);
      crta(zg, ...I, ...D, "izbor", { class: "sk-s-izbor sk-thin" });
      napis(g, (I[0] + D[0]) / 2 + 5, (I[1] + D[1]) / 2 + 4, "r", "izbor", { style: "font-size: 12px" });
      s("circle", { cx: I[0], cy: I[1], r: 4, class: "sk-fill sk-fill-izbor" }, zg);
      napis(g, I[0] + 6, I[1] - 6, "I", "izbor", { style: "font-size: 12px" });
    }
    if (!q.izrojen && !krozici) {
      // Višina v_c: nožišče N na premici AB; zunaj stranice c je AB podaljšana s črtkano črto.
      const N = P(q.N);
      if (q.t < 0) crta(zg, ...N, ...A, "glavna", { class: "sk-s-glavna sk-thin sk-dash" });
      if (q.t > 1) crta(zg, ...B, ...N, "glavna", { class: "sk-s-glavna sk-thin sk-dash" });
      crta(zg, ...C, ...N, "izbor", { class: "sk-s-izbor sk-dash", "stroke-width": 2.5 });
      if (q.vc * M > 14) praviKot(zg, N, C, q.t > 0.5 ? A : B, 8, "izbor");
      // Oznaka na strani višine, ki je stran od oglišča A (tam ni stranice b).
      const levo = C[0] < A[0];
      s("tspan", { dy: 4, style: "font-size: 10px" }, napis(g, (C[0] + N[0]) / 2 + (levo ? -6 : 6), (C[1] + N[1]) / 2, "v", "izbor", { "text-anchor": levo ? "end" : "start" }), "c");
    }
    crta(g, ...B, ...C, "glavna");
    crta(g, ...C, ...A, "glavna");
    crta(g, ...A, ...B, "glavna", { "stroke-width": 3 });
    // Koti (lok in oznaka na simetrali kota), stranice na sredini, oglišča stran od težišča.
    if (!q.izrojen)
      for (const [V, P1, P2, ime, kot] of [[A, B, C, "α", q.alfa], [B, C, A, "β", q.beta], [C, A, B, "γ", q.gama]]) {
        const r = Math.max(9, Math.min(16, Math.hypot(P1[0] - V[0], P1[1] - V[1]) / 3, Math.hypot(P2[0] - V[0], P2[1] - V[1]) / 3));
        const tocka = lokKota(g, V, P1, P2, r, "ploskev");
        if (kot > 14) napis(g, ...tocka(r + 11).map((v, i) => v + (i ? 4 : 0)), ime, "ploskev", { "text-anchor": "middle", style: "font-size: 12px" });
      }
    const ven = (Q, d) => {
      const l = Math.hypot(Q[0] - Gx, Q[1] - Gy) || 1;
      return [Math.min(W - 8, Math.max(8, Q[0] + ((Q[0] - Gx) / l) * d)), Math.min(H - 4, Math.max(14, Q[1] + ((Q[1] - Gy) / l) * d + 4))];
    };
    for (const [ime, P1, P2] of [["a", B, C], ["b", C, A], ["c", A, B]]) napis(g, ...ven([(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2], 12), ime, "glavna", { "text-anchor": "middle" });
    for (const [ime, V] of [["A", A], ["B", B], ["C", C]]) {
      napis(g, ...ven(V, 18), ime, "glavna", { "text-anchor": "middle" });
      vlecne[ime]?.move(...V);
    }
    if (q.izrojen) return S.cipi([{ barva: "napaka", oznaka: "\\text{trikotnik}", vrednost: "oglišča ležijo na isti premici" }]);
    if (krozici)
      S.cipi([
        { barva: "glavna", oznaka: "s = \\frac{a + b + c}{2}", vrednost: vr(q.s, 2) },
        { barva: "ploskev", oznaka: "S = \\sqrt{s(s - a)(s - b)(s - c)}", vrednost: vr(q.S, 2) },
        { barva: "druga", oznaka: "R = \\frac{abc}{4S}", vrednost: vr(q.R, 2) },
        { barva: "izbor", oznaka: "r = \\frac{S}{s}", vrednost: vr(q.r, 2) },
        { barva: "ploskev", oznaka: "\\alpha,\\ \\beta,\\ \\gamma", vrednost: seznam([q.alfa, q.beta, q.gama], 1, "°") },
      ]);
    else
      S.cipi([
        { barva: "glavna", oznaka: "a,\\ b,\\ c", vrednost: seznam([q.a, q.b, q.c], 2) },
        { barva: "glavna", oznaka: "o = a + b + c", vrednost: vr(q.o, 2) },
        { barva: "izbor", oznaka: "v_c", vrednost: vr(q.vc, 2) },
        { barva: "ploskev", oznaka: "S = \\frac{c \\cdot v_c}{2}", vrednost: vr(q.S, 2) },
        { barva: "ploskev", oznaka: "\\alpha,\\ \\beta,\\ \\gamma", vrednost: seznam([q.alfa, q.beta, q.gama], 1, "°") },
        { barva: "ploskev", oznaka: "\\alpha + \\beta + \\gamma", vrednost: "180°" },
      ]);
  }

  izris();
  for (const ime of Object.keys(T))
    vlecne[ime] = S.tocka({
      x: P(T[ime])[0],
      y: P(T[ime])[1],
      label: `Oglišče ${ime}: premikaj ga po mreži`,
      onMove: (x, y) => {
        const v = [omeji((x - X0) / M, MEJE.x), omeji((Y0 - y) / M, MEJE.y)];
        // Dve oglišči ne moreta biti v isti točki.
        if (Object.entries(T).some(([k, w]) => k !== ime && w[0] === v[0] && w[1] === v[1])) return;
        T[ime] = v;
        izris();
      },
    });
  izris();
  host.append(S.el);
}
