// Kompleksna števila: z = a + bi se vleče po kompleksni ravnini (mreža 0,5), z̄ je zrcalna slika čez
// realno os, krožnica ima polmer |z|.
import { skica, st, crta, napis, stevilka } from "./skica.js";
import { s } from "../sim/kit.js";

export const MEJA = 4;

export function kompleksno(a, b) {
  const abs2 = a * a + b * b;
  return { a, b, konj: [a, -b], abs: Math.sqrt(abs2), zKonj: abs2 };
}

// »2 + 1,5i«, »2 − 1,5i«, »−1 + 0i«
export const zapisZ = (a, b) => `${st(a, 1)} ${b < 0 ? "−" : "+"} ${st(Math.abs(b), 1)}i`;

export default function narisi(host) {
  const W = 300, H = 260, M = 30, O = [150, 130];
  const S = skica({ w: W, h: H, navodilo: "Povleci točko z.", oznaka: "Kompleksno število v kompleksni ravnini" });
  for (let k = -MEJA; k <= MEJA; k++) {
    crta(S.svg, O[0] + k * M, O[1] - MEJA * M - 6, O[0] + k * M, O[1] + MEJA * M + 6, "glavna", { class: "sk-grid" });
    crta(S.svg, O[0] - MEJA * M - 6, O[1] + k * M, O[0] + MEJA * M + 6, O[1] + k * M, "glavna", { class: "sk-grid" });
  }
  crta(S.svg, 10, O[1], W - 10, O[1], "glavna", { class: "sk-s-glavna sk-thin" });
  crta(S.svg, O[0], H - 4, O[0], 4, "glavna", { class: "sk-s-glavna sk-thin" });
  napis(S.svg, W - 12, O[1] - 8, "Re", "glavna", { "text-anchor": "end", style: "font-style: normal" });
  napis(S.svg, O[0] + 8, 16, "Im", "glavna", { style: "font-style: normal" });
  for (const k of [-4, -2, 2, 4]) {
    stevilka(S.svg, O[0] + k * M, O[1] + 15, st(k, 0));
    stevilka(S.svg, O[0] - 12, O[1] - k * M + 4, `${st(k, 0)}i`, { "text-anchor": "end" });
  }

  let a = 2, b = 1.5;
  const pos = (x, y) => [O[0] + x * M, O[1] - y * M];
  let tocka;

  function izris() {
    const q = kompleksno(a, b);
    const g = S.plast("z");
    const Z = pos(a, b), K = pos(a, -b);
    s("circle", { cx: O[0], cy: O[1], r: q.abs * M, class: "sk-s-druga sk-dash" }, g);
    crta(g, Z[0], Z[1], K[0], K[1], "izbor", { class: "sk-s-izbor sk-thin sk-dash" });
    crta(g, O[0], O[1], Z[0], Z[1], "druga", { "stroke-width": 2.5 });
    crta(g, O[0], O[1], K[0], K[1], "izbor", { class: "sk-s-izbor sk-faint" });
    s("circle", { cx: K[0], cy: K[1], r: 6, class: "sk-fill sk-fill-izbor" }, g);
    const levo = a < 0;
    const vOkvir = (y) => Math.min(H - 6, Math.max(14, y)); // oznaka ob robu mreže ostane vidna
    napis(g, Z[0] + (levo ? -16 : 16), vOkvir(Z[1] + (b >= 0 ? -10 : 18)), "z", "ploskev", { "text-anchor": "middle" });
    napis(g, K[0] + (levo ? -16 : 16), vOkvir(K[1] + (b >= 0 ? 18 : -10)), "z̄", "izbor", { "text-anchor": "middle" });
    const sred = pos(a / 2, b / 2);
    if (q.abs > 0.8) napis(g, sred[0] + (b * a >= 0 ? -10 : 10), sred[1] - 6, "|z|", "druga", { "text-anchor": "middle" });
    if (tocka) {
      tocka.move(...Z);
      if (S.svg.lastChild !== tocka) S.svg.append(tocka);
    }
    const tocen = Math.abs(q.abs - Number(q.abs.toFixed(2))) < 1e-9;
    S.cipi([
      { barva: "ploskev", oznaka: "z = a + bi", vrednost: zapisZ(a, b) },
      { barva: "izbor", oznaka: "\\bar{z} = a - bi", vrednost: zapisZ(a, -b) },
      { barva: "druga", oznaka: "|z| = \\sqrt{a^2 + b^2}", vrednost: `√${st(q.zKonj, 2)} ${tocen ? "=" : "≈"} ${st(q.abs, 2)}` },
      { barva: "glavna", oznaka: "z \\cdot \\bar{z} = |z|^2", vrednost: st(q.zKonj, 2) },
    ]);
  }

  izris();
  tocka = S.tocka({
    x: pos(a, b)[0],
    y: pos(a, b)[1],
    label: "Število z: premikaj ga po kompleksni ravnini",
    korak: 0.5,
    merilo: M,
    izhodisce: O,
    onMove: (x, y) => {
      const na = Math.min(MEJA, Math.max(-MEJA, (x - O[0]) / M));
      const nb = Math.min(MEJA, Math.max(-MEJA, (O[1] - y) / M));
      a = Math.round(na * 2) / 2;
      b = Math.round(nb * 2) / 2;
      izris();
    },
  });
  izris();
  host.append(S.el);
}
