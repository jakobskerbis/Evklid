// Fotografski prikaz poskusa lab-prevodnost (docs/laboratorij.md »Fotografski prikaz«; prizor
// scripts/lab-foto/prizor_prevodnost.py). Snov, lučka, ampermeter in vezava pridejo iz motorja (lab-elektrika.js),
// svetlost lučke, mehurčki in odčitek iz modela (lab-model-elektrika.js: tester()); slike so le podlaga.
import { s, label } from "./kit.js";

export const OKNA_PREVODNOST = { prevodnost: [0, 0, 400, 262] };

// Prosojnost svetečega sloja: model da svetlost b (1 = nazivna, linearno v sevanju). Sloj je izrisan pri nazivni
// svetlosti; ker se plasti mešajo v zaslonskih vrednostih (sRGB), je za sevanje ∝ b prava prosojnost ≈ b^(1/2,2).
export const prosojnostSvetenja = (b) => (b > 1e-4 ? Math.min(1, b) ** (1 / 2.2) : 0);
// Mehurčki elektrolize: plin nastaja sorazmerno s tokom (Faraday); sloj z mehurčki pri ~200 mA je poln, pod 1 mA jih
// ni (model: mehurcki = ioni in I > 1 mA). Vmes logaritemsko, da so vidni tudi mehurčki pri nekaj mA (LED).
export const prosojnostMehurckov = (I) => (I > 1e-3 ? Math.min(1, 0.25 + (0.75 * Math.log10(I / 1e-3)) / Math.log10(200)) : 0);
// Vodniki za stanje motorja (am: ampermeter v krogu, obmocje "200m" | "10", tekocina: sponki na ploščicah v čaši).
export function vodnikiPrevodnosti(am, obmocje, tekocina) {
  const v = tekocina ? "tekocina" : "trdno";
  return [`minus-${v}`, `ind-${v}`, ...(am ? [obmocje === "10" ? "plus-A10" : "plus-AmA", "ACOM-ind"] : ["plus-ind"])];
}

// Izrez z mehkim robom (~8 enot; izrez ima 14 enot roba okoli predmetov): šum in svetloba, ki jo steklo odbije na pult,
// se na robu izreza ne vidita kot pravokotnik.
function mehko(o, ime, parent, extra = {}) {
  const S = o.p.meta.sloji[ime], id = o.id("p"), fid = o.id("q");
  s("feGaussianBlur", { stdDeviation: 3 }, s("filter", { id: fid, x: -0.2, y: -0.2, width: 1.4, height: 1.4 }, o.defs));
  const mk = s("mask", { id, maskUnits: "userSpaceOnUse", x: S.x, y: S.y, width: S.w, height: S.h }, o.defs);
  s("rect", { x: S.x + 6, y: S.y + 6, width: S.w - 12, height: S.h - 12, fill: "#fff", filter: `url(#${fid})` }, mk);
  return o.slika(ime, s("g", { mask: `url(#${id})` }, parent), extra);
}

// st: { mat, ime, tekocina, ind "zarnica"|"led", b, am, obmocje, varovalka, I [A], odcitek (niz za zaslon), magnet, privlaci, mehurcki }
export function risiPrevodnost(o, meta, st) {
  const K = meta.sidra.prevodnost, g = o.okno("prevodnost");
  o.slika("prevodnost", g);
  if (st.am) o.slika(`gumb-${st.obmocje === "10" ? "10" : "200m"}`, g);
  const ind = st.ind === "led" ? "led" : "zarnica";
  o.slika(`ind-${ind}`, g);
  const sv = prosojnostSvetenja(st.b);
  if (sv > 0) o.slika(`ind-${ind}-sveti`, g, { opacity: sv.toFixed(3) });
  if (st.tekocina) {
    mehko(o, "vzorec-tekocina", g);
    const mh = st.mehurcki ? prosojnostMehurckov(st.I) : 0;
    if (mh > 0) mehko(o, "vzorec-tekocina-mehurcki", g, { opacity: mh.toFixed(3) });
  } else {
    mehko(o, `vzorec-${st.mat}`, g);
    if (st.magnet) o.slika(st.privlaci ? "magnet-privlaci" : "magnet-blizu", g);
  }
  for (const v of vodnikiPrevodnosti(st.am, st.obmocje, st.tekocina)) o.slika(`vod-${v}`, g);
  if (st.tekocina) o.slika("sponke-tekocina", g);
  // zaslon ampermetra: besedilo v ravnini zaslona (afina preslikava vogalov levo zgoraj, desno zgoraj, levo spodaj)
  if (st.am && st.odcitek) {
    const [lz, dz, ls] = K.amLcd, [w, hh] = meta.zasloni.am;
    const m = `matrix(${(dz[0] - lz[0]) / w} ${(dz[1] - lz[1]) / w} ${(ls[0] - lz[0]) / hh} ${(ls[1] - lz[1]) / hh} ${lz[0]} ${lz[1]})`;
    s("text", { class: "lab-prev-lcd", transform: m, x: w - 3, y: hh * 0.8, "font-size": hh * 0.82, "text-anchor": "end", fill: "rgb(24,28,24)", "font-family": "ui-monospace, Menlo, Consolas, monospace", "font-weight": 700 }, g,
      String(st.odcitek).replace(".", ","));
  }
  // sij lučke (zaslonsko mešanje; jakost iz modela)
  if (sv > 0.05) {
    const fid = o.id("s"), [x, y] = ind === "led" ? K.led : K.nitka, k = Math.min(1, st.b);
    s("feGaussianBlur", { stdDeviation: ind === "led" ? 3 : 5 }, s("filter", { id: fid, x: -1.5, y: -1.5, width: 4, height: 4 }, o.defs));
    s("circle", { cx: x, cy: y, r: ind === "led" ? 3 + 7 * sv : 5 + 12 * k, fill: ind === "led" ? "rgb(255,40,20)" : "rgb(255,214,140)", opacity: (ind === "led" ? 0.2 + 0.5 * sv : 0.15 + 0.5 * k).toFixed(2), filter: `url(#${fid})`, style: "mix-blend-mode:screen" }, g);
  }
  // napisi
  label(o.g, K.bat[0], K.bat[1] + 12, "baterija 4,5 V", "lbl small");
  label(o.g, K.am[0], K.am[1] + 12, st.am ? "ampermeter" : "ampermeter (ni v krogu)", "lbl small");
  if (st.am && st.varovalka) label(o.g, K.am[0], K.am[1] + 25, "pregorela varovalka", "lab-warn small");
  label(o.g, K.lucka[0], K.lucka[1] + 12, ind === "led" ? "LED in upor 150 Ω" : "žarnica 3,8 V", "lbl small");
  label(o.g, K.vzorec[0], 256, st.ime, "lbl small");
  const d = K.merilo50[1] - K.merilo50[0];
  s("line", { x1: 392 - d, y1: 250, x2: 392, y2: 250, class: "lab-scale" }, o.g);
  s("text", { x: 392 - d / 2, y: 244, class: "lbl small", "text-anchor": "middle" }, o.g, "5 cm");
}
