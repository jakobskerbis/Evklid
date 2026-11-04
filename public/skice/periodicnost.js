// Periodičnost: graf sin in cos (perioda 2π) ali tan in cot (perioda π); pas ene periode, vlečna točka
// na prvi funkciji in vodoravna črta, ki pokaže, kje se vrednost ponovi (x₀ + kT).
import { skica, st, crta, napis, osi, piZapis } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";

const cot = (x) => Math.cos(x) / Math.sin(x);
export const PARI = {
  sin: { ime: "sin in cos", f: Math.sin, g: Math.cos, T: 2 * Math.PI, f_tex: "\\sin", g_tex: "\\cos" },
  tan: { ime: "tan in cot", f: Math.tan, g: cot, T: Math.PI, f_tex: "\\tan", g_tex: "\\cot" },
};
export const OD = -2 * Math.PI, DO = 2 * Math.PI;

// Vsa mesta x₀ + kT v [od, do], kjer ima funkcija isto vrednost kot v x₀.
export function ponovitve(par, x0, od = OD, doX = DO) {
  const T = PARI[par].T, xs = [];
  for (let k = Math.ceil((od - x0) / T - 1e-9); x0 + k * T <= doX + 1e-9; k++) xs.push(x0 + k * T);
  return xs;
}

// Točka ne sme na navpično asimptoto tangensa.
export function omejiX(par, x) {
  x = Math.min(DO - 0.05, Math.max(OD + 0.05, x));
  if (par !== "tan") return x;
  const k = Math.round(x / Math.PI - 0.5), a = (k + 0.5) * Math.PI; // najbližja asimptota
  return Math.abs(x - a) < 0.25 ? a + Math.sign(x - a || 1) * 0.25 : x;
}

export default function narisi(host) {
  const W = 320, H = 200;
  const S = skica({ w: W, h: H, navodilo: "Povleci točko po grafu.", oznaka: "Periodičnost kotnih funkcij" });
  const xOz = [-2, -1, 1, 2].map((k) => [k * Math.PI, piZapis(k * Math.PI)]);
  const A = osi(S.svg, { W, H, x: [OD - 0.7, DO + 0.7], y: [-2.6, 2.6], xOznake: xOz, yOznake: [[-2, "−2"], [-1, "−1"], [1, "1"], [2, "2"]] });

  let par = "sin", x0 = 1;
  let tocka;
  S.gumbi({ options: Object.entries(PARI).map(([k, p]) => [k, p.ime]), value: par, onChange: (v) => ((par = v), (x0 = omejiX(par, x0)), izris()) });

  function izris() {
    const P = PARI[par];
    const g = S.plast("graf");
    const zg = s("g", { "clip-path": A.izrez }, g);
    // Pas ene periode od 0 do T.
    s("rect", { x: A.X(0), y: A.T, width: A.X(P.T) - A.X(0), height: A.B - A.T, class: "sk-fill sk-fill-ploskev", opacity: 0.14 }, zg);
    napis(g, (A.X(0) + A.X(P.T)) / 2, A.B - 6, `T = ${piZapis(P.T)}`, "ploskev", { "text-anchor": "middle", style: "font-size: 12px" });
    if (par === "tan") for (let k = -2; k <= 1; k++) crta(zg, A.X((k + 0.5) * Math.PI), A.T, A.X((k + 0.5) * Math.PI), A.B, "glavna", { class: "sk-s-glavna sk-thin sk-dash sk-faint" });
    s("path", { d: fnPath(P.g, A, { n: 480 }), class: "sk-s-druga sk-thin" }, zg);
    s("path", { d: fnPath(P.f, A, { n: 480 }), class: "sk-s-glavna" }, zg);
    const y0 = P.f(x0);
    crta(zg, A.L, A.Y(y0), A.R, A.Y(y0), "izbor", { class: "sk-s-izbor sk-thin sk-dash" });
    for (const x of ponovitve(par, x0)) s("circle", { cx: A.X(x), cy: A.Y(y0), r: 4.5, class: "sk-fill sk-fill-izbor" }, zg);
    if (tocka) {
      tocka.move(A.X(x0), A.Y(y0));
      if (S.svg.lastChild !== tocka) S.svg.append(tocka);
    }
    S.cipi([
      { barva: "ploskev", oznaka: "T", vrednost: `${piZapis(P.T)} ≈ ${st(P.T, 2)}` },
      { barva: "glavna", oznaka: "x_0", vrednost: st(x0, 2) },
      { barva: "izbor", oznaka: `${P.f_tex}\\,x_0`, vrednost: st(y0, 3) },
      { barva: "izbor", oznaka: `${P.f_tex}\\,(x_0 + T)`, vrednost: st(P.f(x0 + P.T), 3) },
    ]);
  }
  izris();
  tocka = S.tocka({
    x: A.X(x0),
    y: A.Y(PARI[par].f(x0)),
    label: "Točka na grafu: premikaj jo levo in desno",
    onMove: (px) => {
      x0 = omejiX(par, A.inv(px, 0)[0]);
      izris();
    },
  });
  izris();
  host.append(S.el);
}
