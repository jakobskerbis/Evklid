// Izreki v pravokotnem trikotniku (kartica Pitagorov izrek, OŠ): hipotenuza AB = c = 8, C se vleče po
// Talesovi krožnici; nožišče višine se pripne na korak 0,5, zato so a₁, b₁, a², b² natančni.
// Čipi: Pitagorov (c² = a² + b²), višinski (v_c² = a₁ · b₁) in Evklidov izrek (a² = c · a₁, b² = c · b₁).
import { skica, st, crta, napis, praviKot } from "./skica.js";
import { s } from "../sim/kit.js";
import { talesov, stop } from "./geometrija.js";

export const C_HIP = 8;
// a₁ = NB od 0,5 do c − 0,5 s korakom 0,5.
export const omejiA1 = (v) => Math.min(C_HIP - 0.5, Math.max(0.5, Math.round(v * 2) / 2));
export const pravokotni = (v) => {
  const a1 = omejiA1(v);
  return { ...talesov(C_HIP, stop(Math.acos(1 - (2 * a1) / C_HIP))), a1, b1: C_HIP - a1 };
};

const tocno = (...vs) => vs.every((v) => Math.abs(v - Number(v.toFixed(2))) < 1e-9);
const sub = (t, x, y, osnova, indeks, barva, extra = {}) => s("tspan", { dy: 4, style: "font-size: 10px" }, napis(t, x, y, osnova, barva, extra), indeks);

export default function narisi(host) {
  const W = 300, H = 222, M = 30, O = [150, 196];
  const P = (v) => [O[0] + v[0] * M, O[1] - v[1] * M];
  const S = skica({ w: W, h: H, navodilo: "Povleci oglišče C po Talesovi krožnici.", oznaka: "Pravokotni trikotnik nad premerom Talesove krožnice" });
  const Rp = (C_HIP / 2) * M;
  s("path", { d: `M${O[0] - Rp},${O[1]} A${Rp},${Rp} 0 0 1 ${O[0] + Rp},${O[1]}`, class: "sk-s-glavna sk-dash sk-faint" }, S.svg);
  let a1 = 2, tocka;

  function izris() {
    const q = pravokotni(a1);
    a1 = q.a1;
    const [A, B, C, N] = [q.A, q.B, q.C, q.N].map(P);
    const g = S.plast("lik");
    s("polygon", { points: `${A} ${B} ${C}`, class: "sk-f-ploskev" }, g);
    crta(g, ...A, ...N, "druga", { "stroke-width": 4 }); // b₁
    crta(g, ...N, ...B, "ploskev", { "stroke-width": 4 }); // a₁
    crta(g, ...B, ...C, "ploskev", { "stroke-width": 2.5 });
    crta(g, ...C, ...A, "druga", { "stroke-width": 2.5 });
    crta(g, ...C, ...N, "izbor", { class: "sk-s-izbor sk-dash", "stroke-width": 2.5 });
    praviKot(g, C, A, B, 9, "glavna");
    praviKot(g, N, B, C, 7, "izbor");
    napis(g, A[0] - 6, A[1] + 16, "A", "glavna", { "text-anchor": "end" });
    napis(g, B[0] + 6, B[1] + 16, "B");
    napis(g, C[0], C[1] - 10, "C", "glavna", { "text-anchor": "middle" });
    sub(g, (A[0] + N[0]) / 2, N[1] + 16, "b", "1", "druga", { "text-anchor": "middle" });
    sub(g, (N[0] + B[0]) / 2, N[1] + 16, "a", "1", "ploskev", { "text-anchor": "middle" });
    napis(g, (B[0] + C[0]) / 2 + 8, (B[1] + C[1]) / 2 - 4, "a", "ploskev");
    napis(g, (A[0] + C[0]) / 2 - 8, (A[1] + C[1]) / 2 - 4, "b", "druga", { "text-anchor": "end" });
    if (q.vc * M > 30) sub(g, N[0] + (a1 < C_HIP / 2 ? -6 : 6), (C[1] + N[1]) / 2 + 4, "v", "c", "izbor", { "text-anchor": a1 < C_HIP / 2 ? "end" : "start" });
    tocka?.move(...C);
    const a2 = q.a * q.a, b2 = q.b * q.b, v2 = q.vc * q.vc;
    const je = (...vs) => (tocno(...vs) ? "=" : "≈");
    S.cipi([
      { barva: "glavna", oznaka: "c^2 = a^2 + b^2", vrednost: `${st(C_HIP ** 2, 0)} ${je(a2, b2)} ${st(a2, 2)} + ${st(b2, 2)}` },
      { barva: "izbor", oznaka: "v_c^2 = a_1 \\cdot b_1", vrednost: `${st(v2, 2)} ${je(v2)} ${st(q.a1, 2)} · ${st(q.b1, 2)}` },
      { barva: "ploskev", oznaka: "a^2 = c \\cdot a_1", vrednost: `${st(a2, 2)} ${je(a2)} ${st(C_HIP, 0)} · ${st(q.a1, 2)}` },
      { barva: "druga", oznaka: "b^2 = c \\cdot b_1", vrednost: `${st(b2, 2)} ${je(b2)} ${st(C_HIP, 0)} · ${st(q.b1, 2)}` },
    ]);
  }
  izris();
  tocka = S.tocka({
    x: P(pravokotni(a1).C)[0],
    y: P(pravokotni(a1).C)[1],
    label: "Oglišče C: premikaj ga po Talesovi krožnici",
    // Nožišče višine sledi navpični projekciji kazalca na premer AB.
    onMove: (x) => ((a1 = omejiA1(C_HIP / 2 - (x - O[0]) / M)), izris()),
  });
  izris();
  host.append(S.el);
}
