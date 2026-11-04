// Enakostranični trikotnik (OŠ): drsnik a; višina v, težišče T, R = 2v/3 do oglišča, r = v/3 do stranice,
// kota 60° (pri oglišču) in 30° (med višino in stranico).
import { skica, crta, napis, lokKota, praviKot, vr } from "./skica.js";
import { s } from "../sim/kit.js";
import { enakostranicni } from "./geometrija.js";

export default function narisi(host) {
  const W = 300, H = 230, M = 28, Y0 = 214;
  const S = skica({ w: W, h: H, navodilo: "Spreminjaj stranico a.", oznaka: "Enakostranični trikotnik z višino in polmeroma" });
  let a = 6;
  S.drsnik({ label: "a", min: 3, max: 7, step: 0.5, value: a, digits: 1, barva: "glavna", onInput: (v) => ((a = v), izris()) });

  function izris() {
    const q = enakostranicni(a);
    const g = S.plast("lik");
    const A = [W / 2 - (a * M) / 2, Y0], B = [W / 2 + (a * M) / 2, Y0], C = [W / 2, Y0 - q.v * M], N = [W / 2, Y0], T = [W / 2, Y0 - q.r * M];
    s("polygon", { points: `${A} ${B} ${C}`, class: "sk-f-ploskev" }, g);
    s("polygon", { points: `${A} ${B} ${C}`, class: "sk-s-glavna" }, g);
    crta(g, ...C, ...N, "izbor", { class: "sk-s-izbor sk-dash", "stroke-width": 2.5 });
    praviKot(g, N, B, C, 8, "izbor");
    crta(g, ...T, ...B, "druga", { "stroke-width": 2.5 });
    s("circle", { cx: T[0], cy: T[1], r: 4, class: "sk-fill sk-fill-glavna" }, g);
    lokKota(g, A, B, C, 16, "ploskev");
    napis(g, A[0] + 30, A[1] - 7, "60°", "ploskev", { style: "font-size: 11px; font-style: normal" });
    lokKota(g, C, N, A, 24, "ploskev");
    napis(g, C[0] - 4, C[1] + 40, "30°", "ploskev", { "text-anchor": "end", style: "font-size: 11px; font-style: normal" });
    napis(g, C[0] + 6, (C[1] + T[1]) / 2, "v", "izbor");
    napis(g, (T[0] + B[0]) / 2 + 2, (T[1] + B[1]) / 2 - 6, "R", "druga");
    napis(g, T[0] - 5, (T[1] + N[1]) / 2 + 5, "r", "druga", { "text-anchor": "end" });
    napis(g, T[0] + 8, T[1] - 4, "T", "glavna", { style: "font-size: 12px" });
    napis(g, (A[0] + C[0]) / 2 - 10, (A[1] + C[1]) / 2, "a", "glavna", { "text-anchor": "end" });
    napis(g, (B[0] + C[0]) / 2 + 10, (B[1] + C[1]) / 2, "a", "glavna");
    S.cipi([
      { barva: "glavna", oznaka: "o = 3a", vrednost: vr(q.o, 1) },
      { barva: "izbor", oznaka: "v = \\frac{a\\sqrt{3}}{2}", vrednost: vr(q.v, 2) },
      { barva: "ploskev", oznaka: "S = \\frac{a^2\\sqrt{3}}{4}", vrednost: vr(q.S, 2) },
      { barva: "druga", oznaka: "R = \\frac{2}{3} v", vrednost: vr(q.R, 2) },
      { barva: "druga", oznaka: "r = \\frac{1}{3} v", vrednost: vr(q.r, 2) },
    ]);
  }
  izris();
  host.append(S.el);
}
