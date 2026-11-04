// Aritmetično in geometrijsko zaporedje (SŠ): stolpci a₁ … a₈, drsniki a₁, d (ali q) in n.
// Prvih n stolpcev je obarvanih (vsota s_n), ostali so sivi; merilo se prilagodi členom, tudi negativnim.
// Aritmetično: oznaka d med prvima stolpcema. Geometrijsko: črtkana krivulja y = a₁ q^(x − 1) pri q > 0.
import { skica, st, crta, napis, vr, novId } from "./skica.js";
import { s } from "../sim/kit.js";
import { zaporedje, brezNic } from "./analiza.js";

export const N_MAX = 8;
const SUB = "₀₁₂₃₄₅₆₇₈₉", SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const pod = (n) => String(n).split("").map((c) => SUB[c]).join("");
const nad = (n) => String(n).split("").map((c) => SUP[c]).join("");
// Decimalke v čipu: pri zelo majhnih členih (npr. 4 · 0,25⁷) več, da ne pišemo »≈ 0«.
const dec = (v) => (v && Math.abs(v) < 0.01 ? 6 : 3);
const ok = (v) => (v < 0 ? `(${st(v, 2)})` : st(v, 2)); // negativno število v oklepaju
const je = (v, d = 2) => {
  const t = vr(v, d);
  return t.startsWith("≈") ? t : `=\u00a0${t}`;
};

export default function narisi(host, vrsta = "aritmeticno") {
  const ar = vrsta === "aritmeticno";
  const W = 300, H = 232, L = 30, R = 294, T = 24, B = 196;
  const S = skica({ w: W, h: H, navodilo: `Spreminjaj a₁, ${ar ? "d" : "q"} in n.`, oznaka: ar ? "Aritmetično zaporedje v stolpcih" : "Geometrijsko zaporedje v stolpcih" });
  const id = novId("izrez");
  s("rect", { x: L - 4, y: T - 16, width: R - L + 8, height: B - T + 32 }, s("clipPath", { id }, s("defs", {}, S.svg)));
  let a1 = ar ? 2 : 1, k = ar ? 1.5 : 1.5, n = 5;
  const sA = S.drsnik({ label: "a₁", min: -4, max: 4, step: 0.5, value: a1, digits: 1, barva: "ploskev", onInput: (v) => ((a1 = ar ? v : brezNic(v, a1, 0.1)), a1 !== v && sA.set(a1, true), izris()) });
  const sK = ar
    ? S.drsnik({ label: "d", min: -2, max: 2, step: 0.5, value: k, digits: 1, barva: "izbor", onInput: (v) => ((k = v), izris()) })
    : S.drsnik({ label: "q", min: -2, max: 2, step: 0.25, value: k, digits: 2, barva: "izbor", onInput: (v) => ((k = brezNic(v, k, 0.01)), k !== v && sK.set(k, true), izris()) });
  S.drsnik({ zvezno: false, label: "n", min: 1, max: N_MAX, step: 1, value: n, digits: 0, barva: "glavna", onInput: (v) => ((n = v), izris()) });

  function izris() {
    const q = zaporedje(vrsta, a1, k, n);
    const cl = Array.from({ length: N_MAX }, (_, i) => q.clen(i + 1));
    let lo = Math.min(0, ...cl), hi = Math.max(0, ...cl);
    if (hi - lo < 1e-9) hi = 1;
    const Y = (v) => B - ((v - lo) / (hi - lo)) * (B - T);
    const sir = (R - L) / N_MAX, X = (i) => L + sir * (i + 0.5); // sredina stolpca a_(i+1)
    const g = S.plast("stolpci");
    const kr = s("g", {}, g); // krivulja pod stolpci in oznakami
    crta(g, L - 4, Y(0), R + 2, Y(0), "glavna", { class: "sk-s-glavna sk-thin" });
    cl.forEach((v, i) => {
      const y0 = Y(0), y1 = Y(v), notri = i < n;
      s("rect", { x: X(i) - sir * 0.32, y: Math.min(y0, y1), width: sir * 0.64, height: Math.max(1, Math.abs(y1 - y0)), class: notri ? "sk-fill sk-fill-ploskev" : "", style: notri ? "" : "fill: var(--sk-glavna); fill-opacity: 0.22" }, g);
      napis(g, X(i), v >= 0 ? Math.max(12, y1 - 5) : Math.min(B + 14, y1 + 13), vr(v, Math.abs(v) < 10 ? 2 : 0), "glavna", { "text-anchor": "middle", style: `font-size: 10px; font-style: normal; paint-order: stroke; stroke: var(--sk-bg); stroke-width: 3px; ${notri ? "" : "opacity: 0.6"}` });
      napis(g, X(i), H - 6, `a${pod(i + 1)}`, notri ? "ploskev" : "glavna", { "text-anchor": "middle", style: `font-size: 12px; ${notri ? "" : "opacity: 0.6"}` });
    });
    if (ar && Math.abs(k) > 1e-9) {
      // d: razlika višin prvih dveh stolpcev, navpična puščica ob drugem stolpcu.
      const x = X(1) + sir * 0.38, ya = Y(cl[0]), yb = Y(cl[1]);
      crta(g, X(0), ya, x + 3, ya, "izbor", { class: "sk-s-izbor sk-thin sk-dash" });
      crta(g, x, ya, x, yb, "izbor", { "stroke-width": 2.5 });
      if (Math.abs(yb - ya) > 10) napis(g, x + 4, (ya + yb) / 2 + 4, "d", "izbor", { style: "font-size: 12px" });
    }
    if (!ar && k > 0) {
      const tocke = [];
      for (let j = 0; j <= 140; j++) {
        const t = (j / 140) * (N_MAX - 1); // t = n − 1
        tocke.push(`${(L + sir * (t + 0.5)).toFixed(1)},${Y(a1 * k ** t).toFixed(1)}`);
      }
      s("polyline", { points: tocke.join(" "), class: "sk-s-izbor sk-dash", "clip-path": `url(#${id})`, "stroke-width": 2 }, kr);
    }
    const i = pod(n);
    const cipi = ar
      ? [
          { barva: "ploskev", oznaka: "a_n = a_1 + (n - 1) d", vrednost: `a${i} = ${st(a1, 2)} + ${n - 1} · ${ok(k)} ${je(q.an)}` },
          { barva: "ploskev", oznaka: "s_n = \\frac{n (a_1 + a_n)}{2}", vrednost: `s${i} = ${n} · (${st(a1, 2)} + ${ok(q.an)}) : 2 ${je(q.sn)}` },
        ]
      : [
          { barva: "ploskev", oznaka: "a_n = a_1 q^{n - 1}", vrednost: `a${i} = ${st(a1, 2)} · ${ok(k)}${nad(n - 1)} ${je(q.an, dec(q.an))}` },
          k === 1
            ? { barva: "ploskev", oznaka: "s_n = n a_1 \\ (q = 1)", vrednost: `s${i} = ${n} · ${ok(a1)} ${je(q.sn, dec(q.sn))}` }
            : { barva: "ploskev", oznaka: "s_n = a_1 \\frac{q^n - 1}{q - 1}", vrednost: `s${i} = ${st(a1, 2)} · (${ok(k)}${nad(n)} − 1) : (${st(k, 2)} − 1) ${je(q.sn, dec(q.sn))}` },
        ];
    S.cipi(cipi);
  }
  izris();
  host.append(S.el);
}
