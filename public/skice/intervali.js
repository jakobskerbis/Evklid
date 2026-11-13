// Realna števila in intervali: številska premica od −5 do 5, vrsta intervala z gumbi, krajišči z drsnikoma.
// Polna pika: krajišče je v intervalu, prazna: ni.
import { skica, st, crta, stevilka } from "./skica.js";
import { s } from "../sim/kit.js";

export const MIN = -5;
export const MAX = 5;
export const KORAK = 0.5;
export const VRSTE = ["(a, b)", "[a, b]", "[a, b)", "(a, b]"];

// Zapis intervala z dejanskimi števili; pri decimalni vejici loči krajišči podpičje.
export function interval(vrsta, a, b) {
  const lz = vrsta[0] === "[", dz = vrsta[vrsta.length - 1] === "]";
  const ločilo = Number.isInteger(a) && Number.isInteger(b) ? ", " : "; ";
  return {
    a,
    b,
    levoZaprt: lz,
    desnoZaprt: dz,
    zapis: `${lz ? "[" : "("}${st(a, 2)}${ločilo}${st(b, 2)}${dz ? "]" : ")"}`,
    neenacba: `${st(a, 2)} ${lz ? "≤" : "<"} x ${dz ? "≤" : "<"} ${st(b, 2)}`,
    vsebuje: (x) => (lz ? x >= a : x > a) && (dz ? x <= b : x < b),
    dolzina: b - a,
  };
}

// Krajišči ostaneta urejeni: a < b (premaknjeni drsnik potisne drugega).
export function uredi(a, b, premaknjen) {
  a = Math.min(MAX, Math.max(MIN, a));
  b = Math.min(MAX, Math.max(MIN, b));
  if (a < b) return [a, b];
  if (premaknjen === "a") return a + KORAK <= MAX ? [a, a + KORAK] : [MAX - KORAK, MAX];
  return b - KORAK >= MIN ? [b - KORAK, b] : [MIN, MIN + KORAK];
}

export default function narisi(host) {
  const W = 320, H = 76, Y = 34;
  const px = (x) => 22 + ((x - MIN) / (MAX - MIN)) * (W - 44);
  const S = skica({ w: W, h: H, navodilo: "Izberi vrsto intervala in premakni krajišči.", oznaka: "Interval na številski premici" });
  // Številska premica z oznakami celih števil.
  crta(S.svg, 8, Y, W - 8, Y, "glavna", { class: "sk-s-glavna sk-thin" });
  s("path", { d: `M${W - 14},${Y - 5} L${W - 7},${Y} L${W - 14},${Y + 5}`, class: "sk-s-glavna sk-thin" }, S.svg);
  for (let x = MIN; x <= MAX; x++) {
    crta(S.svg, px(x), Y - 4, px(x), Y + 4, "glavna", { class: "sk-s-glavna sk-thin" });
    stevilka(S.svg, px(x), Y + 20, st(x, 0));
  }

  let vrsta = "[a, b)", a = -1, b = 2.5;
  S.gumbi({ label: "Vrsta intervala", options: VRSTE, value: vrsta, onChange: (v) => ((vrsta = v), izris()) });
  const slA = S.drsnik({ label: "a", min: MIN, max: MAX, step: KORAK, value: a, digits: 1, barva: "izbor", onInput: (v) => premakni(v, b, "a") });
  const slB = S.drsnik({ label: "b", min: MIN, max: MAX, step: KORAK, value: b, digits: 1, barva: "druga", onInput: (v) => premakni(a, v, "b") });

  function premakni(na, nb, kateri) {
    [a, b] = uredi(na, nb, kateri);
    if (slA.get() !== a) slA.set(a, true);
    if (slB.get() !== b) slB.set(b, true);
    izris();
  }

  function izris() {
    const I = interval(vrsta, a, b);
    const g = S.plast("interval");
    crta(g, px(a), Y, px(b), Y, "ploskev", { "stroke-width": 6 });
    const krajisce = (x, zaprt, barva) => s("circle", { cx: px(x), cy: Y, r: 6.5, class: `sk-s-${barva} ${zaprt ? `sk-fill-${barva}` : "sk-fill-bg"}`, "stroke-width": 2.5 }, g);
    krajisce(a, I.levoZaprt, "izbor");
    krajisce(b, I.desnoZaprt, "druga");
    S.cipi([
      { barva: "ploskev", oznaka: "I", vrednost: I.zapis },
      { barva: "ploskev", oznaka: "x \\in I", vrednost: I.neenacba },
      { barva: "glavna", oznaka: "b - a", vrednost: st(I.dolzina, 2) },
    ]);
  }

  izris();
  host.append(S.el);
}
