// Kotne funkcije v pravokotnem trikotniku: hipotenuza c = 5, oglišče B se vleče po krožnem loku
// okoli A; pravi kot je pri C. sin α = a/c, cos α = b/c, tan α = a/b, cot α = b/a.
import { skica, st, crta, napis } from "./skica.js";
import { s } from "../sim/kit.js";

export const C_HIP = 5;
export const ALFA_MIN = 5;
export const ALFA_MAX = 85;

// Vse količine pri kotu α (v stopinjah); preverjeno v test/skice.test.js.
export function racunaj(alfaStopinj) {
  const al = (Math.min(ALFA_MAX, Math.max(ALFA_MIN, alfaStopinj)) * Math.PI) / 180;
  const c = C_HIP;
  const a = c * Math.sin(al);
  const b = c * Math.cos(al);
  return { alfa: (al * 180) / Math.PI, a, b, c, sin: a / c, cos: b / c, tan: a / b, cot: b / a };
}

export default function narisi(host) {
  const W = 320, H = 230, M = 38; // 38 px na enoto, A spodaj levo
  const A = [36, 200];
  const S = skica({ w: W, h: H, navodilo: "Povleci oglišče B.", oznaka: "Pravokotni trikotnik s hipotenuzo 5" });
  // Lok, po katerem se giblje B (rahlo črtkan).
  const r = C_HIP * M;
  const lok = (deg) => [A[0] + r * Math.cos((deg * Math.PI) / 180), A[1] - r * Math.sin((deg * Math.PI) / 180)];
  const [x0, y0] = lok(ALFA_MIN), [x1, y1] = lok(ALFA_MAX);
  s("path", { d: `M${x0},${y0} A${r},${r} 0 0 0 ${x1},${y1}`, class: "sk-s-glavna sk-dash sk-faint" }, S.svg);

  let alfa = 36.87;
  let tocka;
  const sl = S.drsnik({ label: "α", min: ALFA_MIN, max: ALFA_MAX, step: 0.1, value: alfa, unit: "°", digits: 1, barva: "izbor", onInput: (v) => nastavi(v) });

  function nastavi(v) {
    const q = racunaj(v);
    alfa = q.alfa;
    const B = [A[0] + q.b * M, A[1] - q.a * M];
    const C = [B[0], A[1]];
    const g = S.plast("lik");
    s("polygon", { points: `${A} ${B} ${C}`, class: "sk-f-ploskev" }, g);
    crta(g, A[0], A[1], C[0], C[1], "druga", { "stroke-width": 3 }); // b
    crta(g, C[0], C[1], B[0], B[1], "ploskev", { "stroke-width": 3 }); // a
    crta(g, A[0], A[1], B[0], B[1], "glavna", { "stroke-width": 2.5 }); // c
    const pa = q.a * M, pb = q.b * M; // kateti v enotah SVG
    const lim = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const k = lim(Math.min(pa, pb) * 0.4, 6, 12); // pravi kot pri C (manjši pri ozkem trikotniku)
    s("path", { d: `M${C[0] - k},${C[1]} L${C[0] - k},${C[1] - k} L${C[0]},${C[1] - k}`, class: "sk-s-glavna sk-thin" }, g);
    const rr = lim(pb - k - 3, 10, 26); // lok kota α ne seka oznake pravega kota
    const e = [A[0] + rr * Math.cos((alfa * Math.PI) / 180), A[1] - rr * Math.sin((alfa * Math.PI) / 180)];
    s("path", { d: `M${A[0] + rr},${A[1]} A${rr},${rr} 0 0 0 ${e[0]},${e[1]}`, class: "sk-s-izbor" }, g);
    // Oznaka α: v kotu, kadar je dovolj prostora; pri ostrem kotu nad c, pri ozkem trikotniku levo od c.
    const th = ((alfa < 28 ? alfa + 10 : alfa > 60 ? alfa + 14 : alfa / 2) * Math.PI) / 180;
    const ra = Math.max(rr + 10, alfa > 60 ? 36 : 40);
    napis(g, A[0] + ra * Math.cos(th), A[1] - ra * Math.sin(th), "α", "izbor", { "text-anchor": "middle", "dominant-baseline": "central" });
    napis(g, A[0] - 14, A[1] + 16, "A");
    napis(g, C[0] + 6, C[1] + 16, "C");
    napis(g, B[0] + (alfa < 20 ? 6 : 12), Math.max(16, B[1] - (alfa < 20 ? 14 : 4)), "B");
    napis(g, (A[0] + C[0]) / 2, A[1] + 18, "b", "druga", { "text-anchor": "middle" });
    napis(g, C[0] + 8, (B[1] + C[1]) / 2, "a", "ploskev");
    napis(g, (A[0] + B[0]) / 2 - 14, (A[1] + B[1]) / 2 - 6, "c = 5", "glavna", { "text-anchor": "end" });
    if (tocka) {
      tocka.move(...B);
      if (S.svg.lastChild !== tocka) S.svg.append(tocka); // točka ostane nad likom (premik bi ji vzel fokus)
    }
    S.cipi([
      { barva: "izbor", oznaka: "\\alpha", vrednost: `${st(q.alfa, 1)}°` },
      { barva: "ploskev", oznaka: "\\sin\\alpha = \\frac{a}{c}", vrednost: `${st(q.a)} : 5 ≈ ${st(q.sin, 3)}` },
      { barva: "druga", oznaka: "\\cos\\alpha = \\frac{b}{c}", vrednost: `${st(q.b)} : 5 ≈ ${st(q.cos, 3)}` },
      { barva: "glavna", oznaka: "\\tan\\alpha = \\frac{a}{b}", vrednost: `${st(q.a)} : ${st(q.b)} ≈ ${st(q.tan, 3)}` },
      { barva: "glavna", oznaka: "\\cot\\alpha = \\frac{b}{a}", vrednost: `${st(q.b)} : ${st(q.a)} ≈ ${st(q.cot, 3)}` },
    ]);
    if (Math.abs(sl.get() - alfa) > 0.05) sl.set(Math.round(alfa * 10) / 10, true);
  }

  nastavi(alfa);
  const q0 = racunaj(alfa);
  tocka = S.tocka({
    x: A[0] + q0.b * M,
    y: A[1] - q0.a * M,
    label: "Oglišče B: premikaj ga po loku",
    // Levo spodaj od A (kot pod −90°) je B bližje zgornji meji: ne preskoči z 85° na 5°.
    onMove: (x, y) => {
      const d = (Math.atan2(A[1] - y, x - A[0]) * 180) / Math.PI;
      nastavi(d < -90 ? 180 : d);
    },
  });
  nastavi(alfa);
  host.append(S.el);
}
