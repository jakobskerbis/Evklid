// Krožni lok in izsek (OŠ): drsnika r in α; izsek je obarvan, lok l poudarjen.
import { skica, st, crta, napis, vr } from "./skica.js";
import { s } from "../sim/kit.js";
import { izsek, rad } from "./geometrija.js";

export default function narisi(host) {
  const W = 300, H = 230, O = [150, 115], M = 20;
  const S = skica({ w: W, h: H, navodilo: "Spreminjaj polmer r in kot α.", oznaka: "Krožni lok in krožni izsek" });
  let r = 4, alfa = 120;
  S.drsnik({ label: "r", min: 1, max: 5, step: 0.5, value: r, digits: 1, barva: "druga", onInput: (v) => ((r = v), izris()) });
  S.drsnik({ label: "α", min: 0, max: 360, step: 5, value: alfa, unit: "°", digits: 0, barva: "ploskev", onInput: (v) => ((alfa = v), izris()) });

  function izris() {
    const q = izsek(r, alfa);
    const g = S.plast("lik");
    const R = r * M;
    const T = (deg, d = R) => [O[0] + d * Math.cos(-rad(deg)), O[1] + d * Math.sin(-rad(deg))];
    s("circle", { cx: O[0], cy: O[1], r: R, class: "sk-s-glavna sk-thin" }, g);
    // Izsek od 0° v nasprotni smeri urinega kazalca (pri 360° cel krog).
    if (alfa >= 360) {
      s("circle", { cx: O[0], cy: O[1], r: R, class: "sk-f-ploskev" }, g);
      s("circle", { cx: O[0], cy: O[1], r: R, class: "sk-s-izbor", "stroke-width": 3.5 }, g);
    } else if (alfa > 0) {
      const z = T(0), k = T(alfa), velik = alfa > 180 ? 1 : 0;
      s("path", { d: `M${O} L${z} A${R},${R} 0 ${velik} 0 ${k} Z`, class: "sk-f-ploskev" }, g);
      s("path", { d: `M${z} A${R},${R} 0 ${velik} 0 ${k}`, class: "sk-s-izbor", "stroke-width": 3.5 }, g);
      crta(g, ...O, ...k, "druga", { "stroke-width": 2 });
      const rl = Math.min(18, R * 0.4);
      s("path", { d: `M${T(0, rl)} A${rl},${rl} 0 ${velik} 0 ${T(alfa, rl)}`, class: "sk-s-ploskev sk-thin" }, g);
      if (alfa >= 20) napis(g, ...T(alfa / 2, rl + 12).map((v, i) => v + (i ? 4 : 0)), "α", "ploskev", { "text-anchor": "middle" });
    }
    crta(g, ...O, ...T(0), "druga", { "stroke-width": 2.5 });
    s("circle", { cx: O[0], cy: O[1], r: 4, class: "sk-fill sk-fill-glavna" }, g);
    napis(g, O[0] + R / 2, O[1] + 16, "r", "druga", { "text-anchor": "middle" });
    if (alfa > 0) napis(g, ...T(alfa / 2, R + 12).map((v, i) => (i ? Math.min(H - 4, Math.max(14, v + 5)) : v)), "l", "izbor", { "text-anchor": "middle" });
    S.cipi([
      { barva: "druga", oznaka: "r", vrednost: st(r, 1) },
      { barva: "ploskev", oznaka: "\\alpha", vrednost: `${st(alfa, 0)}°` },
      { barva: "izbor", oznaka: "l = \\frac{\\pi r \\alpha}{180^\\circ}", vrednost: vr(q.l, 2) },
      { barva: "ploskev", oznaka: "S = \\frac{\\pi r^2 \\alpha}{360^\\circ}", vrednost: vr(q.S, 2) },
    ]);
  }
  izris();
  host.append(S.el);
}
