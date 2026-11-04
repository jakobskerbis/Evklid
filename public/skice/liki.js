// Štirikotniki (OŠ, kartice Kvadrat, Pravokotnik, Paralelogram, Romb, Trapez, Deltoid): drsniki za mere,
// označena skica z višino (rumeno, črtkano), diagonalami (črtkano) in pri trapezu s srednjico s (zeleno).
import { skica, crta, napis, lokKota, praviKot, vr, seznam } from "./skica.js";
import { s } from "../sim/kit.js";
import { stirikotnik } from "./geometrija.js";

// Drsniki in čipi po liku; vsak lik je v okvirju pri največjih merah (širina ≤ 10, višina ≤ 6,5 enote).
// Pri trapezu je c ≤ a, da nožišče višine iz D leži na osnovnici a.
export const LIKI = {
  kvadrat: { mere: { a: [2, 6, 4] }, cipi: (q, p) => [["o = 4a", q.o, "glavna"], ["S = a^2", q.S, "ploskev"], ["d = a\\sqrt{2}", q.d, "izbor"]] },
  pravokotnik: { mere: { a: [2, 10, 6], b: [1, 6, 3.5] }, cipi: (q) => [["o = 2a + 2b", q.o, "glavna"], ["S = a b", q.S, "ploskev"], ["d = \\sqrt{a^2 + b^2}", q.d, "izbor"]] },
  paralelogram: { mere: { a: [3, 6, 5], b: [2, 4, 3.5], alfa: [30, 90, 60] }, cipi: (q) => [["o = 2a + 2b", q.o, "glavna"], ["v_a", q.va, "izbor"], ["S = a \\cdot v_a", q.S, "ploskev"]] },
  romb: { mere: { a: [2, 5, 4], alfa: [30, 90, 60] }, cipi: (q) => [["o = 4a", q.o, "glavna"], ["v", q.v, "izbor"], ["e,\\ f", [q.e, q.f], "glavna"], ["S = a \\cdot v = \\frac{e f}{2}", q.S, "ploskev"]] },
  trapez: { mere: { a: [4, 10, 8], c: [1, 4, 3], v: [1, 6, 3.5] }, cipi: (q) => [["b = d", q.b, "glavna"], ["o = a + b + c + d", q.o, "glavna"], ["s = \\frac{a + c}{2}", q.s, "druga"], ["S = \\frac{(a + c) \\cdot v}{2}", q.S, "ploskev"]] },
  deltoid: { mere: { e: [3, 6.5, 5.5], f: [2, 8, 5] }, cipi: (q) => [["a,\\ b", [q.a, q.b], "glavna"], ["o = 2a + 2b", q.o, "glavna"], ["S = \\frac{e f}{2}", q.S, "ploskev"]] },
};
const IME = { a: "a", b: "b", c: "c", v: "v", alfa: "α", e: "e", f: "f" };

export default function narisi(host, lik = "kvadrat") {
  const L = LIKI[lik];
  const W = 300, H = 206, M = 24;
  const S = skica({ w: W, h: H, navodilo: "Spreminjaj mere lika.", oznaka: `${lik[0].toUpperCase()}${lik.slice(1)} z označenimi merami` });
  const p = Object.fromEntries(Object.entries(L.mere).map(([k, [, , v]]) => [k, v]));
  for (const [k, [min, max]] of Object.entries(L.mere))
    S.drsnik({ label: IME[k], min, max, step: k === "alfa" ? 5 : 0.5, value: p[k], digits: k === "alfa" ? 0 : 1, unit: k === "alfa" ? "°" : "", barva: k === "v" ? "izbor" : "glavna", onInput: (v) => ((p[k] = v), izris()) });

  function izris() {
    const q = stirikotnik(lik, p);
    const xs = q.T.map((t) => t[0]), ys = q.T.map((t) => t[1]);
    const dx = (W - (Math.max(...xs) - Math.min(...xs)) * M) / 2 - Math.min(...xs) * M, dy = (H + (Math.max(...ys) - Math.min(...ys)) * M) / 2 + Math.min(...ys) * M;
    const P = (v) => [dx + v[0] * M, dy - v[1] * M];
    const [A, B, C, D] = q.T.map(P);
    const g = S.plast("lik");
    const Gx = (A[0] + B[0] + C[0] + D[0]) / 4, Gy = (A[1] + B[1] + C[1] + D[1]) / 4;
    const ven = (Q, d) => {
      const l = Math.hypot(Q[0] - Gx, Q[1] - Gy) || 1;
      return [Q[0] + ((Q[0] - Gx) / l) * d, Math.min(H - 4, Math.max(14, Q[1] + ((Q[1] - Gy) / l) * d + 4))];
    };
    const sred = (P1, P2) => [(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2];
    s("polygon", { points: `${A} ${B} ${C} ${D}`, class: "sk-f-ploskev" }, g);
    const diag = (P1, P2, ime, t = 0.3) => {
      crta(g, ...P1, ...P2, "glavna", { class: "sk-s-glavna sk-thin sk-dash" });
      napis(g, P1[0] + (P2[0] - P1[0]) * t + 6, P1[1] + (P2[1] - P1[1]) * t - 4, ime, "glavna", { style: "font-size: 12px" });
    };
    const visina = (Z, K, ime) => {
      crta(g, ...Z, ...K, "izbor", { class: "sk-s-izbor sk-dash", "stroke-width": 2.5 });
      praviKot(g, K, [K[0] + 10, K[1]], Z, 7, "izbor");
      napis(g, Z[0] + 5, (Z[1] + K[1]) / 2 + 4, ime, "izbor");
    };
    // Oznake stranic: pri kvadratu, rombu in trapezu (kraka) se ponovijo, kot na kartici.
    const stranice = { kvadrat: "aaaa", pravokotnik: "abab", paralelogram: "abab", romb: "aaaa", trapez: "abcd", deltoid: "baab" }[lik];
    if (lik === "kvadrat" || lik === "pravokotnik") {
      diag(A, C, "d");
      for (const [V, P1, P2] of [[A, B, D], [B, C, A], [C, D, B], [D, A, C]]) praviKot(g, V, P1, P2, 8, "glavna");
    }
    if (lik === "paralelogram" || lik === "romb") {
      diag(A, C, "e", 0.62);
      diag(B, D, "f", 0.3);
      // Nožišče višine iz D je lahko za B (b cos α > a): premica AB se podaljša s črtkano črto.
      if (D[0] > B[0]) crta(g, ...B, D[0], A[1], "glavna", { class: "sk-s-glavna sk-thin sk-dash" });
      visina(D, [D[0], A[1]], "v");
      if (lik === "paralelogram") s("tspan", { dy: 4, style: "font-size: 10px" }, g.lastChild, "a");
      const lok = lokKota(g, A, B, D, 16, "ploskev");
      napis(g, ...lok(28).map((v, i) => v + (i ? 4 : 0)), "α", "ploskev", { "text-anchor": "middle", style: "font-size: 12px" });
    }
    if (lik === "trapez") {
      visina(D, [D[0], A[1]], "v");
      const [s1, s2] = [sred(A, D), sred(B, C)];
      crta(g, ...s1, ...s2, "druga", { class: "sk-s-druga sk-dash", "stroke-width": 2.5 });
      napis(g, (s1[0] + s2[0]) / 2, s1[1] - 6, "s", "druga", { "text-anchor": "middle" });
    }
    if (lik === "deltoid") {
      diag(A, C, "e", 0.15);
      diag(B, D, "f", 0.78);
      praviKot(g, [A[0], B[1]], B, C, 8, "glavna");
    }
    s("polygon", { points: `${A} ${B} ${C} ${D}`, class: "sk-s-glavna" }, g);
    [[A, B], [B, C], [C, D], [D, A]].forEach(([P1, P2], i) => napis(g, ...ven(sred(P1, P2), 12), stranice[i], "glavna", { "text-anchor": "middle" }));
    [["A", A], ["B", B], ["C", C], ["D", D]].forEach(([ime, V]) => napis(g, ...ven(V, 14), ime, "glavna", { "text-anchor": "middle", style: "font-size: 12px; font-style: normal" }));
    S.cipi(L.cipi(q, p).map(([oznaka, v, barva]) => ({ barva, oznaka, vrednost: Array.isArray(v) ? seznam(v, 2) : vr(v, 2) })));
  }
  izris();
  host.append(S.el);
}
