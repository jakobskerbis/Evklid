// Pravilni n-kotnik (kartica Diagonale n-kotnika, OŠ): števec n od 3 do 12, vse diagonale,
// karakteristični trikotnik s središčem O, stranico a, polmeroma R (oglišče) in r (sredina stranice).
// Čipi: število diagonal, vsota notranjih kotov in a, r, S v enotah R.
import { skica, st, crta, napis, vr } from "./skica.js";
import { s } from "../sim/kit.js";
import { nKotnik } from "./geometrija.js";

export const N_MIN = 3, N_MAX = 12;

export default function narisi(host) {
  const W = 300, H = 244, O = [150, 122], Rp = 100;
  const S = skica({ w: W, h: H, navodilo: "Spreminjaj število oglišč n.", oznaka: "Pravilni n-kotnik z diagonalami in karakterističnim trikotnikom" });
  let n = 6;
  S.stevec({ label: "n", min: N_MIN, max: N_MAX, value: n, barva: "izbor", onInput: (v) => ((n = v), izris()) });

  function izris() {
    const q = nKotnik(n);
    const g = S.plast("lik");
    // Oglišče V₀ spodaj levo, V₁ spodaj desno: stranica a je vodoravna na dnu.
    const V = Array.from({ length: n }, (_, i) => {
      const t = Math.PI / 2 + Math.PI / n - (2 * Math.PI * i) / n;
      return [O[0] + Rp * Math.cos(t), O[1] + Rp * Math.sin(t)];
    });
    s("polygon", { points: V.map((v) => v.join(",")).join(" "), class: "sk-f-ploskev" }, g);
    for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) crta(g, ...V[i], ...V[j], "glavna", { class: "sk-s-glavna sk-thin sk-faint" });
    s("polygon", { points: V.map((v) => v.join(",")).join(" "), class: "sk-s-glavna" }, g);
    // Karakteristični trikotnik O V₀ V₁.
    const [A, B] = [V[0], V[1]], Mx = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    s("polygon", { points: `${O} ${A} ${B}`, class: "sk-f-izbor" }, g);
    crta(g, ...A, ...B, "izbor", { "stroke-width": 3 });
    crta(g, ...O, ...B, "druga", { "stroke-width": 2.5 });
    crta(g, ...O, ...Mx, "ploskev", { class: "sk-s-ploskev sk-dash", "stroke-width": 2.5 });
    s("circle", { cx: O[0], cy: O[1], r: 4, class: "sk-fill sk-fill-glavna" }, g);
    napis(g, O[0] - 8, O[1] - 6, "O", "glavna", { "text-anchor": "end" });
    napis(g, Mx[0], Mx[1] + 15, "a", "izbor", { "text-anchor": "middle" });
    napis(g, (O[0] + B[0]) / 2 + 8, (O[1] + B[1]) / 2 - 2, "R", "druga");
    napis(g, (O[0] + Mx[0]) / 2 - 7, (O[1] + Mx[1]) / 2 + 4, "r", "ploskev", { "text-anchor": "end" });
    const zR = (v, e = "") => `${vr(v, 3)}${e}`;
    S.cipi([
      { barva: "glavna", oznaka: "d_n = \\frac{n(n - 3)}{2}", vrednost: st(q.d, 0) },
      { barva: "glavna", oznaka: "(n - 2) \\cdot 180^\\circ", vrednost: `${st(q.vsota, 0)}°` },
      { barva: "glavna", oznaka: "\\frac{(n - 2) \\cdot 180^\\circ}{n}", vrednost: `${vr(q.kot, 2)}°` },
      { barva: "izbor", oznaka: "a", vrednost: zR(q.a, " R") },
      { barva: "ploskev", oznaka: "r", vrednost: zR(q.r, " R") },
      { barva: "izbor", oznaka: "S", vrednost: zR(q.S, " R²") },
    ]);
  }
  izris();
  host.append(S.el);
}
