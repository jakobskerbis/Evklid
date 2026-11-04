// Ploščina med krivuljama in prostornina vrtenine (SŠ kartica Ploščina, vrtenina); gumba preklopita skici.
// Ploščina: f(x) = 3,5 − (x − 2)²/2 in g(x) = 0,5 + x/2, vlečni meji a in b na osi x; S = ∫ |f − g| dx.
// Vrtenina: f(x) = 0,3x² − 1,2x + 2 na [0, 4] se vrti okoli osi x (psevdo 3D); drsnik x premika rumen
// presek s ploščino πf²(x); V = π ∫ f² dx.
import { skica, st, crta, napis, osi, vr } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";
import { f1, g1, ploscina, f2, vrtenina } from "./integral.js";

export const MEJA = [0, 4];
const W = 300, H = 230;
const VRSTE = ["Ploščina", "Vrtenina"];

export default function narisi(host) {
  const ovoj = document.createElement("div");
  const gumbi = [];
  const preklop = (v) => {
    [P.el, V.el].forEach((el, i) => (el.hidden = VRSTE[i] !== v));
    gumbi.forEach((gb) => gb.set(v, true));
  };
  const P = ploscinaSkica(), V = vrteninaSkica();
  for (const S of [P, V]) gumbi.push(S.gumbi({ label: "Skica", options: VRSTE, value: VRSTE[0], onChange: preklop }));
  V.el.hidden = true;
  ovoj.append(P.el, V.el);
  host.append(ovoj);
}

function ploscinaSkica() {
  const S = skica({ w: W, h: H, navodilo: "Povleci meji a in b po osi x.", oznaka: "Ploščina med krivuljama" });
  const A = osi(S.svg, { W, H, x: [-0.35, 4.35], y: [-0.3, 3.9], rob: 8, xOznake: [1, 2, 3, 4].map((v) => [v, st(v, 0)]), yOznake: [1, 2, 3].map((v) => [v, st(v, 0)]) });
  const T = { a: 0.5, b: 3.8 };
  const vlecne = {};
  function izris() {
    const [lo, hi] = [Math.min(T.a, T.b), Math.max(T.a, T.b)];
    const g = S.plast("graf");
    if (hi > lo) {
      const nazaj = fnPath(g1, A, { from: hi, to: lo, n: 2 }).replace(/^M/, "L");
      s("path", { d: `${fnPath(f1, A, { from: lo, to: hi, n: 120 })}${nazaj}Z`, class: "sk-f-ploskev" }, g);
    }
    for (const x of [lo, hi]) crta(g, A.X(x), A.Y(0), A.X(x), A.Y(Math.max(f1(x), g1(x))), "glavna", { class: "sk-s-glavna sk-thin sk-dash" });
    s("path", { d: fnPath(f1, A, { from: -0.35, to: 4.35, n: 200 }), class: "sk-s-glavna", "stroke-width": 2.5 }, g);
    s("path", { d: fnPath(g1, A, { from: -0.35, to: 4.35, n: 2 }), class: "sk-s-druga", "stroke-width": 2.5 }, g);
    napis(g, A.X(2) + 4, A.Y(f1(2)) - 7, "f", "glavna");
    napis(g, A.X(4.2), A.Y(g1(4.2)) + 16, "g", "druga", { "text-anchor": "middle" });
    for (const k of ["a", "b"]) {
      napis(g, A.X(T[k]), A.Y(0) + 16, k, "glavna", { "text-anchor": "middle" });
      vlecne[k]?.move(A.X(T[k]), A.Y(0));
    }
    S.cipi([
      { barva: "glavna", oznaka: "a,\\ b", vrednost: `${st(T.a, 1)}; ${st(T.b, 1)}` },
      { barva: "ploskev", oznaka: "S = \\int_a^b \\lvert f(x) - g(x) \\rvert\\,dx", vrednost: vr(ploscina(T.a, T.b), 3) },
    ]);
  }
  izris();
  for (const k of ["a", "b"])
    vlecne[k] = S.tocka({
      x: A.X(T[k]),
      y: A.Y(0),
      label: `Meja ${k}: premikaj jo po osi x`,
      onMove: (x) => ((T[k] = Math.max(MEJA[0], Math.min(MEJA[1], Math.round(A.inv(x, 0)[0] * 10) / 10))), izris()),
    });
  izris();
  return S;
}

function vrteninaSkica() {
  const S = skica({ w: W, h: H, navodilo: "Premikaj presek z drsnikom x.", oznaka: "Prostornina vrtenine okoli osi x" });
  const A = osi(S.svg, { W, H, x: [-0.35, 4.35], y: [-2.4, 2.4], rob: 8, xOznake: [1, 2, 3, 4].map((v) => [v, st(v, 0)]), yOznake: [-2, -1, 1, 2].map((v) => [v, st(v, 0)]), mreza: false });
  const V = vrtenina();
  const elipsa = (g, x, cls, extra = {}) => {
    const r = Math.abs(A.Y(f2(x)) - A.Y(0));
    return s("ellipse", { cx: A.X(x), cy: A.Y(0), rx: r * 0.28, ry: r, class: cls, ...extra }, g);
  };
  // Plašč telesa: obris f in −f, tanki preseki, osnovi na x = 0 in x = 4.
  const telo = s("g", {}, S.svg);
  const obris = `${fnPath(f2, A, { from: 0, to: 4, n: 120 })}${fnPath((x) => -f2(x), A, { from: 4, to: 0, n: 120 }).replace(/^M/, "L")}Z`;
  s("path", { d: obris, class: "sk-f-ploskev" }, telo);
  for (let x = 0.5; x < 4; x += 0.5) elipsa(telo, x, "sk-s-ploskev sk-thin sk-faint");
  elipsa(telo, 0, "sk-s-glavna sk-thin");
  elipsa(telo, 4, "sk-s-glavna sk-thin");
  s("path", { d: fnPath(f2, A, { from: 0, to: 4, n: 120 }), class: "sk-s-glavna", "stroke-width": 2.5 }, telo);
  s("path", { d: fnPath((x) => -f2(x), A, { from: 0, to: 4, n: 120 }), class: "sk-s-glavna sk-dash sk-thin" }, telo);
  let x = 2.5;
  S.drsnik({ label: "x", min: 0, max: 4, step: 0.1, value: x, digits: 1, barva: "izbor", onInput: (v) => ((x = v), izris()) });
  function izris() {
    const g = S.plast("presek");
    elipsa(g, x, "sk-f-izbor");
    elipsa(g, x, "sk-s-izbor", { "stroke-width": 2.5 });
    crta(g, A.X(x), A.Y(0), A.X(x), A.Y(f2(x)), "izbor", { "stroke-width": 2 });
    napis(g, A.X(x) + Math.abs(A.Y(f2(x)) - A.Y(0)) * 0.28 + 4, (A.Y(0) + A.Y(f2(x))) / 2, "f(x)", "izbor", { style: "font-size: 11px" });
    napis(g, A.X(0.1), A.T + 12, "f(x) = 0,3x² − 1,2x + 2", "glavna", { style: "font-size: 11px" });
    S.cipi([
      { barva: "izbor", oznaka: "f(x)", vrednost: vr(f2(x), 3) },
      { barva: "izbor", oznaka: "\\pi f^2(x)", vrednost: vr(Math.PI * f2(x) ** 2, 3) },
      { barva: "ploskev", oznaka: "V = \\pi \\int_0^4 f^2(x)\\,dx", vrednost: vr(V, 3) },
    ]);
  }
  izris();
  return S;
}
