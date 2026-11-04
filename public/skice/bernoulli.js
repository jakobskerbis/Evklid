// Bernoullijevo zaporedje (SŠ): stolpci P_n(k) za k = 0 … n, drsnika n in p, števec k; izbrani stolpec je rumen.
import { skica, st, napis, vr } from "./skica.js";
import { s } from "../sim/kit.js";
import { bernoulli, C } from "./integral.js";

export const N_MAX = 12;
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
export const nad = (k) => String(k).split("").map((c) => SUP[c]).join("");
// Verjetnost za čip: zelo majhna (a ne ničelna) je »< 0,0001«, nikoli »= 0«.
export const zapisP = (v, d = 4) => (v > 0 && v < 0.5 * 10 ** -d ? `<\u00a0${st(10 ** -d, d)}` : vr(v, d));

export default function narisi(host) {
  const W = 300, H = 212, L = 14, R = 290, T = 26, B = 184;
  const S = skica({ w: W, h: H, navodilo: "Spreminjaj n, p in k.", oznaka: "Bernoullijevo zaporedje: verjetnosti P_n(k)" });
  let n = 6, p = 0.5, k = 2;
  S.drsnik({ zvezno: false, label: "n", min: 1, max: N_MAX, step: 1, value: n, digits: 0, barva: "glavna", onInput: (v) => ((n = v), sK.meje(0, n), (k = sK.get()), izris()) });
  S.drsnik({ label: "p", min: 0.05, max: 0.95, step: 0.05, value: p, digits: 2, barva: "ploskev", onInput: (v) => ((p = v), izris()) });
  const sK = S.stevec({ label: "k", min: 0, max: n, value: k, barva: "izbor", onInput: (v) => ((k = v), izris()) });

  function izris() {
    const P = Array.from({ length: n + 1 }, (_, i) => bernoulli(n, p, i));
    const mx = Math.max(...P);
    const sir = (R - L) / (n + 1);
    const g = S.plast("stolpci");
    s("line", { x1: L, y1: B, x2: R, y2: B, class: "sk-s-glavna sk-thin" }, g);
    P.forEach((v, i) => {
      const x = L + sir * i, hgt = (v / mx) * (B - T);
      s("rect", { x: x + sir * 0.15, y: B - hgt, width: sir * 0.7, height: Math.max(0.5, hgt), class: `sk-fill sk-fill-${i === k ? "izbor" : "ploskev"}` }, g);
      napis(g, x + sir / 2, B + 14, st(i, 0), i === k ? "izbor" : "glavna", { "text-anchor": "middle", style: "font-size: 11px; font-style: normal" });
    });
    const xk = L + sir * (k + 0.5), yk = B - (P[k] / mx) * (B - T);
    napis(g, Math.min(R - 20, Math.max(L + 20, xk)), Math.max(14, yk - 6), zapisP(P[k], 3), "izbor", { "text-anchor": "middle", style: "font-size: 11px; font-style: normal; paint-order: stroke; stroke: var(--sk-bg); stroke-width: 3px" });
    napis(g, W - 3, B + 14, "k", "glavna", { "text-anchor": "end", style: "font-size: 11px" });
    const vsota = P.reduce((a, v) => a + v, 0);
    S.cipi([
      { barva: "izbor", oznaka: "P_n(k) = \\binom{n}{k} p^k (1 - p)^{n - k}", vrednost: `${st(C(n, k), 0)} · ${st(p, 2)}${nad(k)} · ${st(1 - p, 2)}${nad(n - k)} ${/^[≈<]/.test(zapisP(P[k])) ? "" : "= "}${zapisP(P[k])}` },
      { barva: "ploskev", oznaka: "\\sum_{k=0}^{n} P_n(k)", vrednost: vr(vsota, 6) },
    ]);
  }
  izris();
  host.append(S.el);
}
