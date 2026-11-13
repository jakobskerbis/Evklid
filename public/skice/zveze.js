// Osnovne zveze: enotska krožnica, točka P(cos α, sin α) se vleče po krožnici; tan α je odsek na
// tangenti x = 1 (presečišče premice OP s tangento). Kot je v stopinjah in radianih.
import { skica, st, crta, napis, piZapis, novId } from "./skica.js";
import { s } from "../sim/kit.js";

export function zveze(stopinj) {
  const d = ((Math.round(stopinj) % 360) + 360) % 360;
  const r = (d * Math.PI) / 180;
  const sin = Math.sin(r), cos = Math.cos(r);
  const tan = Math.abs(cos) < 1e-9 ? null : sin / cos;
  return { stopinj: d, rad: r, radPi: piZapis(r, 12), sin, cos, tan };
}

// Zaokrožena vrednost z »≈«, točna (npr. 0,5) z »=« izpuščenim.
const pribl = (v) => (Math.abs(v - Number(v.toFixed(3))) < 1e-9 ? st(v, 3) : `≈\u00a0${st(v, 3)}`);

export default function narisi(host) {
  const W = 320, H = 250, O = [120, 125], R = 88;
  const S = skica({ w: W, h: H, navodilo: "Povleci točko P po krožnici.", oznaka: "Enotska krožnica s sinusom, kosinusom in tangensom" });
  const defs = s("defs", {}, S.svg);
  const okvir = novId("okvir");
  s("rect", { x: 4, y: 4, width: W - 8, height: H - 8 }, s("clipPath", { id: okvir }, defs));
  crta(S.svg, 8, O[1], W - 8, O[1], "glavna", { class: "sk-s-glavna sk-thin" });
  crta(S.svg, O[0], H - 6, O[0], 6, "glavna", { class: "sk-s-glavna sk-thin" });
  s("circle", { cx: O[0], cy: O[1], r: R, class: "sk-s-glavna" }, S.svg);
  crta(S.svg, O[0] + R, 6, O[0] + R, H - 6, "izbor", { class: "sk-s-izbor sk-thin sk-faint" });
  napis(S.svg, O[0] + R + 5, 18, "x = 1", "izbor", { style: "font-style: normal; font-size: 12px" });
  napis(S.svg, O[0] - 14, O[1] + 16, "O");

  let alfa = 50, tocka;
  function izris() {
    const q = zveze(alfa);
    const g = S.plast("zveze");
    const P = [O[0] + q.cos * R, O[1] - q.sin * R];
    const Px = [P[0], O[1]];
    // Kot α od pozitivne osi x.
    const rr = 22, e = [O[0] + rr * q.cos, O[1] - rr * q.sin];
    if (q.stopinj) s("path", { d: `M${O[0] + rr},${O[1]} A${rr},${rr} 0 ${q.stopinj > 180 ? 1 : 0} 0 ${e[0]},${e[1]}`, class: "sk-s-glavna sk-thin" }, g);
    // Premica OP do tangente (pri cos < 0 v nasprotni smeri).
    const zg = s("g", { "clip-path": `url(#${okvir})` }, g);
    if (q.tan !== null) {
      const T = [O[0] + R, O[1] - q.tan * R];
      crta(zg, P[0], P[1], T[0], T[1], "glavna", { class: "sk-s-glavna sk-thin sk-dash" });
      crta(zg, O[0] + R, O[1], T[0], T[1], "izbor", { "stroke-width": 3.5 });
      if (Math.abs(q.tan) < 1.3) napis(g, T[0] + 6, (O[1] + T[1]) / 2 + 4, "tan α", "izbor", { style: "font-size: 12px" });
    }
    crta(g, O[0], O[1], P[0], P[1], "glavna", { "stroke-width": 1.6 });
    crta(g, O[0], O[1], Px[0], Px[1], "druga", { "stroke-width": 3.5 });
    crta(g, Px[0], Px[1], P[0], P[1], "ploskev", { "stroke-width": 3.5 });
    napis(g, (O[0] + Px[0]) / 2, O[1] + (q.sin >= 0 ? 16 : -8), "cos α", "druga", { "text-anchor": "middle", style: "font-size: 12px" });
    napis(g, Px[0] + (q.cos >= 0 ? 5 : -5), (O[1] + P[1]) / 2 + 4, "sin α", "ploskev", { "text-anchor": q.cos >= 0 ? "start" : "end", style: "font-size: 12px" });
    napis(g, P[0] + (q.cos >= 0 ? 10 : -10), P[1] + (q.sin >= 0 ? -10 : 18), "P", "glavna", { "text-anchor": "middle" });
    if (tocka) {
      tocka.move(...P);
      if (S.svg.lastChild !== tocka) S.svg.append(tocka);
    }
    S.cipi([
      { barva: "glavna", oznaka: "\\alpha", vrednost: q.radPi === "0" ? "0° = 0 rad" : q.radPi ? `${q.stopinj}° = ${q.radPi} ≈\u00a0${st(q.rad, 3)} rad` : `${q.stopinj}° ≈\u00a0${st(q.rad, 3)} rad` },
      { barva: "ploskev", oznaka: "\\sin\\alpha", vrednost: pribl(q.sin) },
      { barva: "druga", oznaka: "\\cos\\alpha", vrednost: pribl(q.cos) },
      { barva: "izbor", oznaka: "\\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha}", vrednost: q.tan === null ? "ni definiran" : pribl(q.tan) },
      { barva: "glavna", oznaka: "\\sin^2\\alpha + \\cos^2\\alpha", vrednost: st(q.sin ** 2 + q.cos ** 2, 3) },
    ]);
  }
  izris();
  tocka = S.tocka({
    x: O[0] + Math.cos((alfa * Math.PI) / 180) * R,
    y: O[1] - Math.sin((alfa * Math.PI) / 180) * R,
    label: "Točka P: premikaj jo po krožnici",
    onMove: (x, y) => {
      if (Math.hypot(x - O[0], y - O[1]) < 4) return;
      alfa = (Math.atan2(O[1] - y, x - O[0]) * 180) / Math.PI;
      izris();
    },
  });
  izris();
  host.append(S.el);
}
