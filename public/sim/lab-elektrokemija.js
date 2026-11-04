// Virtualni laboratorij, elektrokemija: elektroliza v Hofmannovem aparatu (lab-elektroliza), galvanski člen (lab-galvanski),
// kovine v kislinah in raztopinah soli (lab-kovine). Modeli: lab-model-elektrokemija.js (brez DOM). CSS: predpona lab-ek-.
// Risbe so v stalnem merilu (merilna črta), oprema v pravih razmerjih; mehurčki se gibljejo z realno hitrostjo dviganja.
import { h, s, svgBox, select, segmented, button, toggle, slider, layout, label, stage as stageBox, controls as controlsBox } from "./kit.js";
import { ticker, lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed } from "./lab.js";
import { AM_RANGES, VM_RANGES, R_PLIN } from "./lab-model.js";
import { pNas } from "./lab-model-toplota.js";
import {
  ElektrolizaBench, TEKOCINE_EL, KONC_EL, HOFMANN, ELEKTRODE, F, barometerRead, prostorninaPlina,
  GalvanBench, KOVINE, SOLI, KONC_G, BREME, naklonDekada, barvaRaztopine,
  KovineBench, KINETIKA, RAZTOPINE_K, OBLIKE, MASE, VRSTA, POSODA_K, POENOSTAVITVE_ELEKTROKEMIJA,
} from "./lab-model-elektrokemija.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seme = () => (Math.random() * 2 ** 31) | 0;
const nb = "\u00a0"; // nedeljiv presledek (število in enota v isti vrstici)
const grp = (title, ...kids) => h("fieldset", { class: "lab-tit-grp" }, h("legend", {}, title), ...kids);
const buttons = (...k) => h("div", { class: "demo-buttons" }, ...k);
const row = (lab, ...kids) => h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, lab), ...kids);
const seg = (name, options, value, onChange) => {
  const x = segmented({ options, value, onChange });
  x.setAttribute("aria-label", name);
  return x;
};
const hint = (text) => h("p", { class: "lab-tit-hint", html: text });
const num = (x, d = 1) => fixed(x, d);
const rgb = (c, a = 1) => `rgb(${c.join(" ")} / ${a})`;
const cFmt = (c) => (c >= 0.1 ? num(c, 1) : String(c).replace(".", ","));
// Štoparica: minute:sekunde,desetinke.
export const ura = (t) => {
  const m = Math.floor(t / 60), sec = t - 60 * m;
  return `${m}:${sec.toFixed(1).padStart(4, "0").replace(".", ",")}`;
};
// Zamik animacije iz ure: risba se nariše znova večkrat na sekundo, mehurčki pa tečejo gladko naprej.
export const faza = (T, d) => (-((performance.now() / 1000 + d) % T)).toFixed(2);
const hitrostSeg = (opts, value, onChange) => row("hitrost časa", seg("hitrost časa", opts.map((v) => [String(v), `×${v}`]), String(value), (v) => onChange(+v)));

// ---------------------------------------------------------------- skupni deli risbe
// Barve kovin (lesk): temni rob, svetla sredina, srednji ton. Zn sivo modrikast, Cu rdeče rjav, Mg srebrn, Fe temno siv, Ag svetel, Pb modro siv.
const KOV_BARVE = {
  Mg: ["#9aa1a9", "#f4f6f8", "#c3c9d0"], Zn: ["#6f7c8a", "#d5dde6", "#9aa7b4"], Fe: ["#3b3f45", "#9097a0", "#5b6168"],
  Pb: ["#4d5660", "#9aa3ad", "#6a737d"], Cu: ["#7a3a1d", "#e7a07a", "#b2643c"], Ag: ["#a8afb7", "#ffffff", "#d4d9de"],
  Pt: ["#9ea3a8", "#f2f3f4", "#c7cbcf"], C: ["#1d1e21", "#5a5d63", "#303236"],
};
// Barve prevlek, ki nastanejo pri izpodrivanju (gobast baker, temno sivo srebro, črno železo, temno siv cink).
const PREVLEKA = { Cu: "#9c4a26", Ag: "#8d9196", Fe: "#2a2b2d", Zn: "#4e555c" };
const u = (svg, id) => `url(#${svg.uid}-${id})`;
export function gradienti(svg) {
  const d = s("defs", {}, svg);
  const lin = (id, stops, { x2 = 1, y2 = 0 } = {}) => {
    const g = s("linearGradient", { id: `${svg.uid}-${id}`, x1: 0, y1: 0, x2, y2 }, d);
    for (const [o, c, a = 1] of stops) s("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g);
  };
  // steklo: temnejša robova (lom svetlobe v debelini stekla), svetel odsev levo, skoraj prozorna sredina
  lin("steklo", [[0, "#5d7385", 0.42], [0.08, "#ffffff", 0.7], [0.18, "#ffffff", 0.12], [0.6, "#ffffff", 0.04], [0.86, "#a9bccb", 0.25], [1, "#4f6577", 0.5]]);
  lin("senca", [[0, "#000", 0.2], [0.22, "#000", 0], [0.78, "#000", 0], [1, "#000", 0.26]]);
  for (const [k, [a, b, c]] of Object.entries(KOV_BARVE)) lin(`m-${k}`, [[0, a], [0.38, b], [0.6, c], [1, a]]);
  lin("miza", [[0, "#d4d8dc"], [0.15, "#c3c8cd"], [1, "#a9b0b7"]], { x2: 0, y2: 1 }); // svetla laboratorijska delovna plošča
  lin("rumena", [[0, "#f4c430"], [1, "#d9a514"]], { x2: 0, y2: 1 });
  lin("ohisje", [[0, "#4a525c"], [1, "#2c3238"]], { x2: 0, y2: 1 });
  lin("plosca", [[0, "#d9dde2"], [1, "#b4bbc3"]], { x2: 0, y2: 1 });
  lin("guma", [[0, "#2a2a2a"], [0.5, "#4a4a4a"], [1, "#222"]]);
  lin("palica", [[0, "#7c838b"], [0.45, "#e1e5e9"], [1, "#6f767e"]]);
  lin("papir", [[0, "#cdbf9f"], [1, "#e9dfc4"]], { x2: 0, y2: 1 });
  lin("sonda", [[0, "#8f969d"], [0.5, "#eef1f3"], [1, "#7d848b"]]);
  mehurGrad(svg, d);
  return d;
}
// Mehurček: skoraj prozorna sredina, temnejši rob (lom svetlobe na meji plin–tekočina), bel odsev zgoraj levo.
function mehurGrad(svg, d) {
  const mh = s("radialGradient", { id: `${svg.uid}-mehur`, cx: 0.5, cy: 0.5, r: 0.5, fx: 0.36, fy: 0.32 }, d);
  for (const [o, c, a] of [[0, "#ffffff", 0.95], [0.28, "#ffffff", 0.3], [0.72, "#e6eef4", 0.12], [0.9, "#6d8aa3", 0.55], [1, "#4a6780", 0.85]]) s("stop", { offset: o, "stop-color": c, "stop-opacity": a }, mh);
}
// Plast za gibljive mehurčke: ločen SVG z istim viewBox nad risbo, v svoji plasti (will-change). Animacija tako v vsaki
// sličici riše le mehurčke, ne cele risbe z gradienti in obrezovanji (na telefonu je bila to glavnina dela).
// Risba se obnovi večkrat na sekundo; mehurčki se zamenjajo le, ko se spremeni njihov opis (število, pot, velikost),
// sicer tečejo naprej brez ponovnega zagona animacij.
export function plastMehurckov(svg, W, H) {
  const ov = svgBox(W, H, "lab-ek-ov");
  ov.removeAttribute("role");
  ov.setAttribute("aria-hidden", "true");
  mehurGrad(ov, s("defs", {}, ov));
  let cur = s("g", {}, ov), sig = "", n = 0;
  const P = {
    wrap: h("div", { class: "lab-ek-risba" }, svg, ov),
    g: cur,
    begin() {
      n = 0;
      P.g = s("g", {});
      P.g._sig = [];
      P.g._uid = ov.uid;
    },
    commit() {
      const nov = P.g, ns = nov._sig.join(";");
      if (ns !== sig) (cur.replaceWith(nov), (cur = nov), (sig = ns));
      P.g = cur;
    },
    // obrezan del plasti (krog povečave)
    krog(cx, cy, r) {
      const id = `${ov.uid}-k${n++}`;
      P.g._sig.push(`k${cx},${cy},${r}`);
      s("circle", { cx, cy, r }, s("clipPath", { id }, P.g));
      const c = s("g", { "clip-path": `url(#${id})` }, P.g);
      c._sig = P.g._sig;
      c._uid = ov.uid;
      return c;
    },
  };
  return P;
}
// Steklena cev ali posoda: obris z debelino stekla in odsevom.
export function steklo(g, svg, x, y, w, hh, { rx = 2, dno = true } = {}) {
  s("rect", { x, y, width: w, height: hh, rx, fill: u(svg, "steklo"), class: "lab-ek-glass" }, g);
  if (w > 6) s("rect", { x: x + w * 0.12, y: y + 2, width: Math.max(1, w * 0.07), height: Math.max(0, hh - 4), rx: 1, class: "lab-ek-hl" }, g);
  if (!dno) s("line", { x1: x + 0.6, y1: y + hh, x2: x + w - 0.6, y2: y + hh, class: "lab-ek-glass-in" }, g);
}
export function tekocina(g, svg, x, y, w, hh, fill, { menisk = true, rx = 0 } = {}) {
  if (hh <= 0.2) return;
  const m = Math.min(2.2, w * 0.12);
  s("path", { d: `M${x},${y - m} Q${x + w / 2},${y + m} ${x + w},${y - m} V${y + hh - rx} Q${x + w},${y + hh} ${x + w - rx},${y + hh} H${x + rx} Q${x},${y + hh} ${x},${y + hh - rx} Z`, fill, class: "lab-ek-liq" }, g);
  s("rect", { x, y: y - m, width: w, height: hh + m, fill: u(svg, "senca"), class: "lab-ek-noev" }, g);
  if (menisk) s("path", { d: `M${x},${y - m} Q${x + w / 2},${y + m} ${x + w},${y - m}`, class: "lab-ek-menisk" }, g);
}
// Mehurčki: n mehurčkov od y0 navzgor do y1, širina pasu w. Hitrost dviganja v enotah risbe na sekundo.
export function mehurcki(g, { x, w, y0, y1, n, r = [0.7, 1.5], v = 90, key = 0 }) {
  const d = y1 - y0;
  if (n <= 0 || d > -2) return;
  g._sig?.push([x, w, y0, y1, n, ...r, v, key].map((q) => Math.round(q * 2)).join());
  const fill = `url(#${g._uid ?? g.ownerSVGElement?.uid}-mehur)`;
  const dur = Math.abs(d) / v;
  for (let i = 0; i < n; i++) {
    const f = (i * 0.618 + key * 0.13) % 1, q = (i * 0.37 + key * 0.21) % 1;
    const T = dur * (0.8 + 0.4 * q);
    s("circle", { cx: (x - w / 2 + ((i * 0.53 + 0.2 + key * 0.07) % 1) * w).toFixed(1), cy: y0.toFixed(1), r: (r[0] + q * (r[1] - r[0])).toFixed(2), fill, class: "lab-ek-bub", style: `--d:${d.toFixed(1)}px;--dx:${((((i * 0.29) % 1) - 0.5) * 2.5).toFixed(1)}px;--f:${f.toFixed(2)};animation-duration:${T.toFixed(2)}s;animation-delay:${faza(T, f * T)}s` }, g);
  }
}
// Vodnik z izolacijo (rdeča ali črna) in odsevom.
function zica(g, d, barva) {
  s("path", { d, class: `lab-ek-wire ${barva}` }, g);
  s("path", { d, class: "lab-ek-wire-hl" }, g);
}
// Krokodilček (izoliran ročaj v barvi vodnika, kovinski čeljusti); kot v stopinjah.
function krokodil(g, x, y, barva, kot = 90) {
  const k = s("g", { transform: `translate(${x},${y}) rotate(${kot})` }, g);
  s("path", { d: "M-3,-3.5 L9,-2.2 L9,2.2 L-3,3.5 Z", class: `lab-ek-clip ${barva}` }, k);
  s("path", { d: "M-9,-2.6 L-3,-3 L-3,3 L-9,2.6 Z", fill: "#c9ced4", stroke: "#7d848b", "stroke-width": 0.5 }, k);
  s("path", { d: "M-9,-2.6 L-7.5,-1.5 L-6,-2.4 L-4.5,-1.4 L-3,-2.4", fill: "none", stroke: "#7d848b", "stroke-width": 0.5 }, k);
}
// Laboratorijsko stojalo: podnožje, palica, mufa in prijemalo.
export function stojalo(g, svg, xRod, yTop, yBase, w = 90) {
  s("rect", { x: xRod - 14, y: yBase - 6, width: w, height: 6, rx: 1.5, fill: "#3d434a" }, g);
  s("rect", { x: xRod - 2.2, y: yTop, width: 4.4, height: yBase - yTop - 6, fill: u(svg, "palica") }, g);
}
export function prijemalo(g, svg, xRod, y, xTo, w = 10) {
  s("rect", { x: xRod - 5, y: y - 5, width: 10, height: 10, rx: 1.5, fill: "#5a626b" }, g);
  s("rect", { x: xRod, y: y - 1.6, width: xTo - xRod - w / 2 - 2, height: 3.2, fill: u(svg, "palica") }, g);
  s("path", { d: `M${xTo - w / 2 - 3},${y - 4} h${w + 6} v8 h${-(w + 6)} Z`, fill: "none", stroke: "#5a626b", "stroke-width": 2.2 }, g);
  s("rect", { x: xTo - w / 2 - 1.5, y: y - 3.2, width: 1.5, height: 6.4, fill: "#b48a5a" }, g); // plutovina
  s("rect", { x: xTo + w / 2, y: y - 3.2, width: 1.5, height: 6.4, fill: "#b48a5a" }, g);
}
// Digitalni multimeter v rumenem ovitku: zaslon, vrtljivo stikalo, vtičnice (10A, mA, COM, VΩ).
function multimeter(g, svg, x, y, w, hh, { text = "", unit = "", kot = 0, jack = "mA", ime = "" }) {
  s("rect", { x, y, width: w, height: hh, rx: w * 0.14, fill: u(svg, "rumena"), stroke: "#a87d0c", "stroke-width": 1 }, g);
  s("rect", { x: x + w * 0.08, y: y + hh * 0.05, width: w * 0.84, height: hh * 0.9, rx: w * 0.08, fill: u(svg, "ohisje") }, g);
  const lx = x + w * 0.15, ly = y + hh * 0.1, lw = w * 0.7, lh = hh * 0.2;
  s("rect", { x: lx, y: ly, width: lw, height: lh, rx: 2, class: "lab-ek-lcdbg" }, g);
  label(g, lx + lw - 3, ly + lh * 0.55, text.replace(".", ","), "lab-ek-lcdtxt", "end").setAttribute("style", `font-size:${(w * 0.17).toFixed(1)}px`);
  if (unit) label(g, lx + lw - 3, ly + lh * 0.88, unit, "lab-ek-lcdunit", "end").setAttribute("style", `font-size:${(w * 0.09).toFixed(1)}px`);
  const cx = x + w / 2, cy = y + hh * 0.56, R = w * 0.25;
  s("circle", { cx, cy, r: R + 3, fill: "#20252a", stroke: "#59616a", "stroke-width": 1 }, g);
  s("circle", { cx, cy, r: R, fill: "#3a4148" }, g);
  const a = ((kot - 90) * Math.PI) / 180;
  s("line", { x1: cx - Math.cos(a) * R * 0.6, y1: cy - Math.sin(a) * R * 0.6, x2: cx + Math.cos(a) * R, y2: cy + Math.sin(a) * R, stroke: "#f2f4f6", "stroke-width": 2.4, "stroke-linecap": "round" }, g);
  const jy = y + hh * 0.86, js = ["10A", "mA", "COM", "VΩ"];
  js.forEach((j, i) => {
    const jx = x + w * (0.2 + i * 0.2);
    s("circle", { cx: jx, cy: jy, r: w * 0.055, fill: j === "COM" ? "#111" : "#b3261e", stroke: "#888", "stroke-width": 0.6 }, g);
    label(g, jx, jy - w * 0.1, j, "lab-ek-jack").setAttribute("style", `font-size:${(w * 0.075).toFixed(1)}px`);
  });
  if (ime) label(g, x + w / 2, y - 5, ime, "tick small");
  return { jack: (j) => [x + w * (0.2 + js.indexOf(j) * 0.2), jy] };
}

// ================================================================ 1. elektroliza: Hofmannov aparat
const TEK_OPTS = Object.entries(TEKOCINE_EL).map(([k, v]) => [k, v.name + (v.formula ? ` (${v.formula})` : "")]);
const VODA_BARVA = [196, 222, 242]; // bistra tekočina v steklu je rahlo modrikasta (risba)
export function labElektroliza(el) {
  const B = new ElektrolizaBench({ seed: seme() });
  const W = 400, H = 458, S = 6.4, ML = 0.641 * S; // 1 cm = 6,4 enote, 1 mL v cevi = 4,1 enote
  const svg = svgBox(W, H, "lab-bench lab-ek lab-ek-hof");
  gradienti(svg);
  const gBack = s("g", {}, svg), gLiq = s("g", {}, svg), gGlass = s("g", {}, svg), gTop = s("g", {}, svg);
  const P = plastMehurckov(svg, W, H);
  const log = eventLog();
  const supL = lcd("napajalnik"), amL = lcd("ampermeter"), swL = lcd("štoparica"), thL = lcd("termometer v bučki"), baL = lcd("barometer"), vLL = lcd("cev levo"), vRL = lcd("cev desno");
  const table = dataTable([
    { key: "t", label: "<i>t</i> [s]" },
    { key: "I", label: "<i>I</i> [mA]" },
    { key: "Vk", label: "<i>V</i> katoda (−) [mL]" },
    { key: "Va", label: "<i>V</i> anoda (+) [mL]" },
  ], { empty: "Še ni meritev. Napolni aparat, zapri pipi, vklopi napajalnik in štoparico, nato zapisuj odčitke." });
  const graph = dataGraph({ x: [0, 400], y: [0, 50], xStep: 50, yStep: 5, xLabel: "Q [C]", yLabel: "V [mL]", title: "Prostornina plina na katodi in anodi v odvisnosti od naboja Q = I·t" });
  const calc = h("div", { class: "lab-ek-calc", "aria-live": "polite" });
  const qBox = h("div");
  const rows = []; // { t, I (A), Vk, Va }
  let tekId = "h2so4", conc = 0.5, speed = 1, asked = false, nTick = 0, efekt = null;
  const st = { ura: false, t: 0, auto: false, next: 60 };
  const said = {};
  const once = (k, text, kind = "warn") => said[k] || ((said[k] = true), log.push(text, kind));
  const xs = [70, 136], xc = 103, wT = 11, wi = 9, y0 = 60, yBend = y0 + HOFMANN.Vmax * ML, yCon = yBend + 8, yBot = yBend + 26, yBase = 440;

  // ---- kontrole
  const tekSel = select({ label: "tekočina", options: TEK_OPTS, value: tekId, onChange: (v) => ((tekId = v), sync()) });
  const cSel = select({ label: "koncentracija", options: KONC_EL.map((c) => [String(c), `${cFmt(c)} mol/L`]), value: String(conc), onChange: (v) => (conc = +v) });
  const elSeg = row("elektrodi", seg("elektrodi", [["pt", "platina"], ["grafit", "grafit"]], "pt", (v) => ((B.elektrode = v), log.push(`Elektrodi iz ${v === "pt" ? "platine" : "grafita"}.`, "info"), draw(true))));
  const indT = toggle("v tekočino kani univerzalni indikator", false, (v) => ((B.indikator = v), draw(true)));
  const fillBtn = button("Nalij tekočino skozi srednjo cev", () => fill(), "primary small");
  const emptyBtn = button("Izprazni in speri aparat", () => (B.izprazni(), (said.bub = said.cl = said.hot = said.dist = said.cc = false), log.push("Aparat je prazen in spran.", "info"), sync(), draw(true)));
  const pipaT = [0, 1].map((i) => toggle(`pipa ${i ? "desno" : "levo"} odprta`, true, (v) => tap(i, v)));
  const polSeg = row("priključitev", seg("priključitev elektrod", [["L-", "levo −, desno +"], ["L+", "levo +, desno −"]], "L-", (v) => ((B.pol = v), log.push(v === "L-" ? "Leva elektroda je na negativnem polu (katoda), desna na pozitivnem (anoda)." : "Leva elektroda je zdaj na pozitivnem polu (anoda), desna na negativnem (katoda).", "info"), draw(true))));
  const amSel = select({ label: "območje ampermetra", options: [["20m", "20 mA"], ["200m", "200 mA"], ["10", "10 A (vtičnica 10A)"]], value: B.amRange, onChange: (v) => ((B.amRange = v), draw(true)) });
  const uSl = slider({ label: "napetost napajalnika", min: 0, max: 12, step: 0.1, value: 0, unit: "V", onInput: (v) => (B.U = v) });
  const iSl = slider({ label: "omejitev toka", min: 0.05, max: 1, step: 0.05, value: B.Ilim, unit: "A", onInput: (v) => (B.Ilim = v) });
  const onT = toggle("napajalnik vklopljen", false, (v) => ((B.vklop = v), log.push(v ? "Napajalnik je vklopljen." : "Napajalnik je izklopljen.", "info")));
  const fuseBtn = button("Zamenjaj varovalko v ampermetru", () => (B.replaceFuse(), log.push("Nova varovalka F 200 mA je v ampermetru.", "ok")));
  const swStart = button("Štoparica: začni / ustavi", () => (st.ura = !st.ura));
  const swZero = button("Štoparica na nič", () => ((st.t = 0), (st.next = 60)));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const autoT = toggle("zapiši samodejno vsako minuto (po štoparici)", false, (v) => ((st.auto = v), (st.next = Math.floor(st.t / 60) * 60 + 60)));
  const clrBtn = button("Izbriši meritve", () => (rows.length = 0, table.clear(), redraw()));
  let cev = 0;
  const cevSeg = row("cev", seg("cev za preskus", [["0", "levo"], ["1", "desno"]], "0", (v) => (cev = +v)));
  const testBtns = [["tlecka", "Tleča trska k pipi"], ["goreca", "Goreča trska k pipi"], ["lakmus", "Vlažen lakmusov papir"]].map(([k, t]) => button(t, () => gasTest(k)));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(P.wrap, h("div", { class: "lab-meters" }, supL, amL, swL, vLL, vRL, thL, baL)), controlsBox(
        grp("1. Priprava", hint("Pipi naj bosta pri polnjenju odprti, da zrak uide iz cevi; ko tekočina pride do pip, ju zapri. Žveplova kislina in natrijev hidroksid sta jedka: zaščitna očala."), tekSel, cSel, elSeg, indT, buttons(fillBtn, emptyBtn), ...pipaT),
        grp("2. Električni krog", hint("Napajalnik, ampermeter in elektrodi so vezani zaporedno. Omejitev toka ščiti napajalnik; ampermeter ima na vhodu mA varovalko F 200 mA."), polSeg, amSel, uSl, iSl, onT, buttons(fuseBtn)),
        grp("3. Merjenje", hitrostSeg([1, 10, 60], 1, (v) => (speed = v)), buttons(swStart, swZero), autoT, buttons(recBtn, clrBtn)),
        grp("4. Preskus plina", hint("Ko se v cevi nabere vsaj nekaj mililitrov plina, k pipi približaj trsko in pipo odpri."), cevSeg, buttons(...testBtns)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Prostornina plina in naboj"), graph, calc, qBox,
      notes(POENOSTAVITVE_ELEKTROKEMIJA.elektroliza, "Faradayev zakon <i>n</i> = <i>Q</i>/(<i>zF</i>), <i>F</i> = 96 485 C/mol (CODATA 2018). Razkrojna napetost vode 1,229 V (Atkins), izmenjalni tokovi vodika na platini (Bard & Faulkner, tab. 3.4.1), prevodnost raztopin (CRC Handbook), topnost plinov (Sander 2015), parni tlak vode (Antoinova enačba). Ocene: prenapetost kisika in klora, kinetika na grafitu, oblika aparata (konstanta celice 700 m⁻¹), raztapljanje plinov ob elektrodi, toplotne izgube."),
    ],
    tryText: "Napovej, v kateri cevi se bo nabralo več plina. Elektrolizo naredi z razredčeno žveplovo kislino, nato poskusi destilirano vodo in raztopino natrijevega klorida. Kaj se zgodi, če zamenjaš pola? Iz svojih meritev izračunaj Faradayevo konstanto.",
  });
  el.classList.add("lab");

  function sync() {
    cSel.sel.disabled = !TEKOCINE_EL[tekId].konc;
  }
  function fill() {
    if (B.tek) return log.push("Aparat je že poln. Najprej ga izprazni in speri.", "warn");
    const r = B.napolni(tekId, conc);
    const ime = TEKOCINE_EL[tekId].name + (TEKOCINE_EL[tekId].konc ? ` ${cFmt(conc)} mol/L` : "");
    if (r.ujet.some(Boolean)) log.push(`Natočil si tekočino (${ime}), a ${r.ujet.every(Boolean) ? "obe pipi sta bili zaprti" : "ena pipa je bila zaprta"}: zrak je ostal ujet v cevi. Odpri pipo, da zrak uide, in jo nato zapri.`, "warn");
    else log.push(`V aparat si natočil tekočino: ${ime}. Ko je tekočina do pip, pipi zapri.`, "ok");
    if (TEKOCINE_EL[tekId].jedko || tekId === "h2so4") log.push("Pazi: tekočina je jedka. Nosi zaščitna očala.", "info");
    draw(true);
  }
  function tap(i, v) {
    const imelo = B.nPlina(i) > 0;
    B.odpriPipo(i, v);
    if (v && imelo) log.push(`Pipa ${i ? "desno" : "levo"} je odprta: plin je ušel, tekočina se je dvignila do pipe.`, "info");
    draw(true);
  }
  function gasTest(k) {
    if (!B.tek) return log.push("Aparat je prazen.", "warn");
    const r = B.preskus(cev, k);
    log.push(r.text, r.ok ? (r.plin ? "ok" : "info") : "warn");
    if (r.ok) {
      efekt = { i: cev, k, plin: r.plin, until: performance.now() + 2600 };
      if (r.plin === "Cl2") log.push("Klor je strupen. Pri elektrolizi raztopine NaCl naj bo prostor dobro prezračen.", "warn");
    }
    pipaT[cev].set(false);
    draw(true);
  }
  function record() {
    const a = B.readA(), Ir = AM_RANGES[B.amRange];
    if (!B.tek) return log.push("Aparat je prazen.", "warn");
    if (a.over) return log.push("Ampermeter kaže OL: izberi večje območje.", "warn");
    const k = B.katoda, an = B.anoda, ok = B.odcitek(k), oa = B.odcitek(an);
    const ImA = a.value * (Ir.unit === "A" ? 1000 : 1);
    rows.push({ t: st.t, I: ImA / 1000, Vk: ok.value, Va: oa.value });
    table.add({ t: num(st.t, 0), I: num(ImA, Ir.unit === "A" ? 0 : Ir.dec), Vk: ok.text.replace(".", ","), Va: oa.text.replace(".", ",") }, { quiet: st.auto });
    redraw();
  }
  // Naboj iz zapisanih meritev (trapezno pravilo, kot bi ga računal učenec), prostornina pri izmerjenem p in T.
  function redraw() {
    const Q = [];
    let q = 0;
    rows.forEach((r, i) => {
      if (i) q += ((r.I + rows[i - 1].I) / 2) * (r.t - rows[i - 1].t);
      else q = r.I * r.t;
      Q.push(q);
    });
    const p = barometerRead(B.lab.p, B.r) * 1000, T = B.readT().value || B.lab.T, Vm = prostorninaPlina(1, T, p - pNas(T)) * 1e6;
    const maxQ = Math.max(400, ...Q.map((x) => Math.ceil(x / 200) * 200));
    graph.setAxes({ x: [0, maxQ], xStep: maxQ / 8 });
    graph.draw([
      { id: "k", pts: rows.map((r, i) => [Q[i], r.Vk]).filter((p) => Number.isFinite(p[1])), cls: "a", shape: "o", label: "katoda (−)", line: (x) => (x / (2 * F)) * Vm },
      { id: "a", pts: rows.map((r, i) => [Q[i], r.Va]).filter((p) => Number.isFinite(p[1])), cls: "b", shape: "^", label: "anoda (+)", line: (x) => (x / (4 * F)) * Vm },
    ]);
    const last = rows.length ? rows[rows.length - 1] : null;
    if (!last || !(last.Vk > 2) || !(Q[Q.length - 1] > 0)) return calc.replaceChildren(h("p", { class: "muted" }, "Ko zapišeš nekaj meritev z vsaj 2 mL plina, se tu izračunajo naboj, množina vodika in Faradayeva konstanta iz tvojih podatkov. Premici na grafu sta napoved po Faradayevem zakonu (H₂: Q/2F, O₂: Q/4F) pri izmerjenem tlaku in temperaturi."));
    const Qs = Q[Q.length - 1], pw = pNas(T), n = ((p - pw) * last.Vk * 1e-6) / (R_PLIN * (T + 273.15)), Fx = Qs / (2 * n);
    calc.replaceChildren(
      h("p", { html: `<b>Naboj:</b> <i>Q</i> = Σ <i>Ī</i>·Δ<i>t</i> = ${num(Qs, 1)}${nb}C (iz tvojih odčitkov toka in časa).` }),
      h("p", { html: `<b>Vodik:</b> zračni tlak je ${num(p / 1000, 1)}${nb}kPa, parni tlak vode pri ${num(T, 1)}${nb}°C pa ${num(pw / 1000, 2)}${nb}kPa, zato je <i>n</i>(H₂) = (<i>p</i> − <i>p</i><sub>H₂O</sub>)·<i>V</i>/(<i>RT</i>) = ${num(n * 1000, 3)}${nb}mmol.` }),
      h("p", { html: `<b>Faradayeva konstanta:</b> <i>F</i> = <i>Q</i>/(2<i>n</i>) = ${num(Fx, 0).replace(/\B(?=(\d{3})+(?!\d))/g, nb)}${nb}C/mol (literatura 96${nb}485${nb}C/mol, odstopanje ${num(((Fx - F) / F) * 100, 1)}${nb}%).` }),
      Number.isFinite(last.Va) && last.Va > 0.5 ? h("p", { html: `<b>Razmerje:</b> <i>V</i>(katoda) : <i>V</i>(anoda) = ${num(last.Vk / last.Va, 2)} : 1.` }) : null,
    );
    if (!asked && rows.length >= 3 && last.Vk >= 10 && ["h2so4", "na2so4", "naoh"].includes(B.tek?.id)) {
      asked = true;
      qBox.append(conclusion({
        text: "Na katodi (−) se nabere približno dvakrat toliko plina kot na anodi (+). Zakaj?",
        options: [
          { t: "Pri razkroju vode 2H₂O → 2H₂ + O₂ nastaneta dve molekuli vodika na eno molekulo kisika. Za H₂ sta potrebna 2 elektrona, za O₂ 4, zato pri istem naboju nastane dvakrat več vodika.", ok: true, why: "Isti naboj steče skozi obe elektrodi. Na katodi 2H₂O + 2e⁻ → H₂ + 2OH⁻, na anodi 2H₂O → O₂ + 4H⁺ + 4e⁻. Pri enakem tlaku in temperaturi enako število molekul zavzame enako prostornino (Avogadrov zakon), zato je razmerje prostornin 2 : 1." },
          { t: "Vodik je lažji od kisika, zato zavzame več prostora.", ok: false, why: "Prostornina plina pri danem tlaku in temperaturi je odvisna od števila molekul, ne od njihove mase. Mol vodika in mol kisika zavzameta enako prostornino." },
          { t: "Skozi katodo teče večji tok kot skozi anodo.", ok: false, why: "Elektrodi sta v istem zaporednem krogu: skozi obe teče isti tok. Razlika je v tem, koliko elektronov potrebuje ena molekula plina." },
          { t: "Kisik se raztaplja v vodi, zato ga je za polovico manj.", ok: false, why: "Raztopi se le malo kisika na začetku (zato je razmerje na začetku malo večje od 2). Ko je voda ob anodi nasičena, ostane razmerje 2 : 1, kar določa enačba reakcije." },
        ],
      }));
    }
  }

  ticker(el, (dt) => {
    let left = dt * speed;
    while (left > 1e-9) {
      const d = Math.min(left, st.auto && st.ura ? Math.max(1e-3, st.next - st.t) : left);
      B.step(d);
      if (st.ura) st.t += d;
      left -= d;
      if (st.auto && st.ura && st.t >= st.next - 1e-6) (st.next += 60), record();
    }
    events();
    readouts();
    if (++nTick % 2 === 0) draw();
  }, 100);

  function events() {
    const s0 = B.last;
    for (const e of B.events.splice(0)) {
      if (e.type === "varovalka") log.push(`Varovalka v ampermetru je pregorela (tok ${num(e.I, 2)} A, vhod mA zdrži 0,2 A). Uporabi vtičnico 10A ali manjšo omejitev toka in zamenjaj varovalko.`, "bad");
      if (e.type === "polna") log.push(`Cev ${e.i ? "desno" : "levo"} je polna: plin uhaja pod cevjo v srednjo cev in iz aparata. Izklopi napajalnik ali odpri pipo.`, "warn");
    }
    if (!B.vklop || !B.tek) return;
    if (s0.If > 1e-3) once("bub", `Na elektrodah se pojavijo mehurčki (napetost na aparatu ${num(s0.Ucell, 2)} V, tok ${num(s0.I * 1000, 1)} mA).`, "info");
    if (B.tek.id === "destilirana" && B.U > 6 && s0.I < 1e-3) once("dist", "Tok je skoraj nič in mehurčkov ni: destilirana voda skoraj nima ionov in ne prevaja. Dodaj elektrolit (npr. malo H₂SO₄ ali Na₂SO₄).");
    if (s0.cc) once("cc", "Napajalnik je v načinu omejitve toka (CC): napetost je nižja od nastavljene.", "info");
    if (s0.fCl2 > 0.3) once("cl", "Ob anodi diši po kloru in tekočina rahlo porumeni: iz kloridnih ionov nastaja klor. Klor je strupen – zračenje!");
    if (B.T > B.lab.T + 5) once("hot", `Tekočina se segreva (${num(B.T, 1)} °C): Joulova toplota pri velikem toku. Topel plin zavzame več prostora in vsebuje več vodne pare; zmanjšaj tok.`);
  }
  function readouts() {
    const sp = B.readSupply();
    supL.set(B.vklop ? num(sp.U, 1) : "", "V", B.vklop ? `${num(sp.I, 2)}${nb}A · ${sp.cc ? "CC" : "CV"}` : "izklopljen");
    const a = B.readA(), r = AM_RANGES[B.amRange];
    amL.set(a.over ? "OL" : a.text, r.unit, B.fuseOf().blown ? "varovalka pregorela" : `območje ${r.unit === "A" ? `10${nb}A` : `${r.max * 1000}${nb}mA`}`);
    swL.set(ura(st.t), "", st.ura ? "teče" : "ustavljena");
    const T = B.readT();
    thL.set(B.tek ? T.text : "", "°C");
    baL.set(num(barometerRead(B.lab.p, B.r), 1), "kPa", `v prostoru ${num(B.lab.T, 0)}${nb}°C`);
    for (const [i, L] of [[0, vLL], [1, vRL]]) {
      const o = B.odcitek(i);
      L.set(B.tek ? o.text : "", "mL", !B.tek ? "prazno" : B.pipa[i] ? "pipa odprta" : i === B.katoda ? "katoda (−)" : "anoda (+)");
    }
  }

  // ---- risba (1 cm = 6,4 enote)
  function drawStatic() {
    gBack.replaceChildren();
    gGlass.replaceChildren();
    s("rect", { x: 0, y: yBase, width: W, height: H - yBase, fill: u(svg, "miza") }, gBack);
    stojalo(gBack, svg, 30, 8, yBase, 120);
    prijemalo(gBack, svg, 30, 120, xc, wT);
    prijemalo(gBack, svg, 30, yCon - 40, xc, wT);
    // stranski cevi in srednja cev z bučko
    for (const x of xs) {
      steklo(gGlass, svg, x - wT / 2, y0 - 22, wT, yBot - (y0 - 22), { rx: 2 });
      for (let v = 0; v <= 50; v++) {
        const y = y0 + v * ML, L = v % 10 === 0 ? 5 : v % 5 === 0 ? 3.5 : 2;
        s("line", { x1: x + wT / 2 - L, y1: y, x2: x + wT / 2, y2: y, class: "lab-ek-tick" }, gGlass);
        if (v % 10 === 0) label(gGlass, x + (x < xc ? -wT / 2 - 2 : wT / 2 + 2), y, String(v), "lab-ek-num", x < xc ? "end" : "start");
      }
    }
    steklo(gGlass, svg, xc - 4, 52, 8, yCon - 52, { rx: 1 });
    s("ellipse", { cx: xc, cy: 34, rx: 15, ry: 19, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gGlass);
    s("ellipse", { cx: xc - 6, cy: 28, rx: 2.5, ry: 10, class: "lab-ek-hl" }, gGlass);
    s("rect", { x: xs[0], y: yCon - wi / 2 - 1, width: xs[1] - xs[0], height: wi + 2, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gGlass);
    // gumijasta zamaška z elektrodama spodaj
    for (const x of xs) s("rect", { x: x - wT / 2 - 0.5, y: yBot - 4, width: wT + 1, height: 9, rx: 1.5, fill: u(svg, "guma") }, gGlass);
    // merilna črta
    // merilna črta na sprednjem robu mize (desno od podnožja stojala)
    s("path", { d: `M${150},${H - 5} v-4 h${5 * S} v4`, class: "lab-scale lab-ek-mizacrta" }, gGlass);
    label(gGlass, 150 + 5 * S + 4, H - 8, "5 cm", "lab-ek-miza", "start");
  }
  function draw(force) {
    if (force === true || !gBack.firstChild) drawStatic();
    gLiq.replaceChildren();
    P.begin();
    gTop.replaceChildren();
    const tek = B.tek, Vs = B.volumni(), sp = B.readSupply(), s0 = B.last;
    const base = tek ? VODA_BARVA : null;
    const col = (i) => rgb(B.barva(i) ?? base, B.indikator ? 0.88 : 0.75);
    const yr = y0 - (tek ? (HOFMANN.h0 + ((Vs[0] + Vs[1]) * 1e-6) / HOFMANN.Arez) * 100 * S : 0);
    // srednja cev in bučka
    if (tek) {
      const rc = rgb(B.barvaZacetna() ?? base, B.indikator ? 0.85 : 0.75);
      const yb = Math.max(yr, 18);
      s("path", { d: `M${xc - 13},${yb} Q${xc},${yb + 1.5} ${xc + 13},${yb} A15,19 0 0 1 ${xc + 3},${52} V${yCon} H${xc - 3} V${52} A15,19 0 0 1 ${xc - 13},${yb} Z`, fill: rc, class: "lab-ek-liq" }, gLiq);
      s("rect", { x: xs[0], y: yCon - wi / 2, width: xs[1] - xs[0], height: wi, fill: rc }, gLiq);
    }
    xs.forEach((x, i) => {
      const yTop = y0 - 18, ym = tek ? (B.pipa[i] ? y0 - 16 : y0 + Math.min(Vs[i], HOFMANN.Vmax) * ML) : yBot;
      // plin (klor je rumeno zelen)
      if (tek && ym > yTop + 1) {
        const cl = B.sestava(i).Cl2;
        s("rect", { x: x - wi / 2, y: yTop, width: wi, height: ym - yTop, fill: cl > 0.05 ? `rgb(214 230 120 / ${(0.15 + 0.4 * cl).toFixed(2)})` : "rgb(255 255 255 / 0.06)" }, gLiq);
      }
      if (tek) tekocina(gLiq, svg, x - wi / 2, ym, wi, yBot - 4 - ym, col(i));
      // elektroda
      const kat = i === B.katoda, yE = yBend + 6;
      if (B.elektrode === "pt") s("rect", { x: x - 2.4, y: yE - 3, width: 4.8, height: 6.4, rx: 0.4, fill: u(svg, "m-Pt"), stroke: "#7d848b", "stroke-width": 0.4 }, gLiq);
      else s("rect", { x: x - 1.9, y: yE - 7, width: 3.8, height: 13, rx: 0.8, fill: u(svg, "m-C") }, gLiq);
      s("line", { x1: x, y1: yE + 3, x2: x, y2: yBot + 8, stroke: "#9aa1a8", "stroke-width": 1 }, gLiq);
      // mehurčki od elektrode navzgor; več jih je pri večji gostoti toka. Mehurčki pri elektrolizi so drobni (0,05–0,5 mm),
      // v risbi so povečani, da se vidijo (vodikovi ~0,6 mm, kisikovi ~1 mm); roj se dviga s ~8 cm/s (ocena).
      const I = s0.If || 0;
      if (tek && I > 2e-4) {
        const iDen = (I / ELEKTRODE[B.elektrode].A) * (kat ? 1 : s0.fO2 * 0.5 + s0.fCl2 * 0.6 + s0.fCO2 * 0.5);
        const n = Math.round(clamp(3 + 5 * Math.log10(iDen / 1e-4), 1, 16));
        const top = Math.max(ym + 2, y0 - 14);
        if (yE - 4 > top) mehurcki(P.g, { x, w: 4.5, y0: yE - 3, y1: top, n, r: kat ? [0.35, 0.7] : [0.5, 1], v: 8 * S, key: i });
        if (B.arms[i].polna) mehurcki(P.g, { x: xc, w: 3, y0: yCon, y1: yr + 2, n: Math.round(n / 2), r: [0.9, 1.6], v: 14 * S, key: 3 + i });
      }
      // pipa: ročaj vzdolž cevi = odprta, prečno = zaprta
      const yt = y0 - 14;
      s("rect", { x: x - wT / 2 - 3, y: yt - 3, width: wT + 6, height: 6, rx: 3, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gTop);
      s("path", { d: B.pipa[i] ? `M${x},${yt - 9} V${yt + 9}` : `M${x - 10},${yt} H${x + 10}`, class: "lab-ek-tap" }, gTop);
      if (x < xc) label(gTop, x - 4, yBot + 22, kat ? "katoda (−)" : "anoda (+)", "tick small lab-ek-halo-bg", "end");
      else label(gTop, x + 2, yBot + 44, kat ? "katoda (−)" : "anoda (+)", "tick small lab-ek-halo-bg");
      // krokodilček na priključku elektrode
      krokodil(gTop, x, yBot + 9, kat ? "k" : "r", 90);
    });
    // učinek preskusa (trska ob pipi)
    if (efekt && performance.now() < efekt.until) {
      const x = xs[efekt.i], y = y0 - 34;
      s("line", { x1: x + 4, y1: y, x2: x + 36, y2: y - 14, class: "lab-ek-splint" }, gTop);
      if (efekt.k === "tlecka" && efekt.plin === "O2") s("ellipse", { cx: x + 3, cy: y, rx: 4, ry: 7, class: "lab-ek-flame" }, gTop);
      else if (efekt.k === "tlecka") s("circle", { cx: x + 4, cy: y, r: 1.6, fill: "#c43d12" }, gTop);
      if (efekt.k === "goreca") s("ellipse", { cx: x + 3, cy: y - 2, rx: efekt.plin === "H2" ? 8 : 3.5, ry: efekt.plin === "H2" ? 6 : 6, class: efekt.plin === "H2" ? "lab-ek-pop" : "lab-ek-flame" }, gTop);
      if (efekt.k === "goreca" && efekt.plin === "H2") label(gTop, x + 20, y - 18, "pok!", "lab-ek-poptxt");
      if (efekt.k === "lakmus") s("rect", { x: x - 2, y: y - 18, width: 4, height: 14, fill: efekt.plin === "Cl2" ? "#f1eee6" : "#5c7fb8" }, gTop);
    } else efekt = null;
    // sonda termometra v bučki
    if (tek) {
      s("line", { x1: xc + 6, y1: 2, x2: xc + 6, y2: 44, class: "lab-ek-sonda", "stroke-width": 2.2, "stroke-linecap": "round" }, gTop);
      s("line", { x1: xc + 6, y1: 2, x2: xc + 6, y2: 2.5, class: "lab-top-cable" }, gTop);
    }
    // napajalnik (22 cm × 12 cm) in ampermeter (9 cm × 18 cm)
    const px = 248, py = 342, pw = 146, ph = 78;
    s("rect", { x: px, y: py, width: pw, height: ph, rx: 4, fill: u(svg, "plosca"), stroke: "#7d858e", "stroke-width": 1 }, gTop);
    s("rect", { x: px + 6, y: py + 8, width: 52, height: 22, rx: 2, fill: "#1a1d1a" }, gTop);
    s("rect", { x: px + 64, y: py + 8, width: 52, height: 22, rx: 2, fill: "#1a1d1a" }, gTop);
    if (B.vklop) {
      label(gTop, px + 54, py + 20, sp.U.toFixed(1).replace(".", ","), "lab-ek-seg red", "end");
      label(gTop, px + 112, py + 20, sp.I.toFixed(2).replace(".", ","), "lab-ek-seg grn", "end");
    }
    label(gTop, px + 32, py + 38, "V", "lab-ek-panel");
    label(gTop, px + 90, py + 38, "A", "lab-ek-panel");
    s("circle", { cx: px + 126, cy: py + 14, r: 2.4, fill: B.vklop && !sp.cc ? "#3bd16f" : "#55605a" }, gTop);
    s("circle", { cx: px + 126, cy: py + 24, r: 2.4, fill: B.vklop && sp.cc ? "#ff5a3c" : "#605555" }, gTop);
    label(gTop, px + 136, py + 14, "CV", "lab-ek-panel", "start");
    label(gTop, px + 136, py + 24, "CC", "lab-ek-panel", "start");
    for (const [kx, val, mx] of [[px + 26, B.U, 12], [px + 70, B.Ilim, 1]]) {
      s("circle", { cx: kx, cy: py + 56, r: 9, fill: "#2d3238", stroke: "#15181b", "stroke-width": 1 }, gTop);
      const a = (-135 + (270 * val) / mx) * (Math.PI / 180);
      s("line", { x1: kx, y1: py + 56, x2: kx + Math.sin(a) * 8, y2: py + 56 - Math.cos(a) * 8, stroke: "#eef1f4", "stroke-width": 1.6 }, gTop);
    }
    label(gTop, px + 26, py + 72, "U", "lab-ek-panel");
    label(gTop, px + 70, py + 72, "I max", "lab-ek-panel");
    const tPlus = [px + 104, py + 58], tMin = [px + 128, py + 58];
    s("circle", { cx: tPlus[0], cy: tPlus[1], r: 5, fill: "#c62828", stroke: "#7a1414" }, gTop);
    s("circle", { cx: tMin[0], cy: tMin[1], r: 5, fill: "#1c1c1c", stroke: "#000" }, gTop);
    label(gTop, tPlus[0], py + 72, "+", "lab-ek-panel");
    label(gTop, tMin[0], py + 72, "−", "lab-ek-panel");
    label(gTop, px + pw / 2, py - 6, "napajalnik 0–12 V", "tick small");
    const a = B.readA(), Ir = AM_RANGES[B.amRange];
    const dm = multimeter(gTop, svg, 176, 300, 58, 116, { text: a.over ? "OL" : a.text, unit: Ir.unit, kot: { "20m": 20, "200m": 45, "10": 80 }[B.amRange], ime: "ampermeter" });
    const jIn = dm.jack(B.amRange === "10" ? "10A" : "mA"), jCom = dm.jack("COM");
    // vodniki: + → ampermeter → anoda, katoda → −
    const xa = xs[B.anoda], xk = xs[B.katoda], yP = yBot + 9;
    zica(gTop, `M${tPlus[0]},${tPlus[1]} C${tPlus[0]},${yBase - 6} ${jIn[0] + 40},${yBase - 6} ${jIn[0]},${jIn[1]}`, "r");
    zica(gTop, `M${jCom[0]},${jCom[1]} C${jCom[0]},${yBase - 2} ${xa + 30},${yBase - 2} ${xa},${yP + 9}`, "r");
    zica(gTop, `M${tMin[0]},${tMin[1]} C${tMin[0]},${yBase + 10} ${xk - 20},${yBase + 10} ${xk},${yP + 9}`, "k");
    // povečani skali (lupa) ob meniskih in povečava elektrod
    for (const i of [0, 1]) lupaCev(gTop, svg, 176 + i * 112, 14, 104, 150, i);
    lupaElektrod(gTop, svg, 322, 262, 50);
    P.commit();
    if (speed > 1) label(gTop, 320, H - 9, `čas teče ×${speed}`, "lab-warn small");
    svg.setAttribute("aria-label", `Hofmannov aparat${tek ? `, tekočina: ${TEKOCINE_EL[tek.id].name}` : ", prazen"}. Levo ${B.katoda === 0 ? "katoda" : "anoda"}, desno ${B.katoda === 1 ? "katoda" : "anoda"}. Plin levo ${num(Vs[0], 1)} mL, desno ${num(Vs[1], 1)} mL. Pipi: ${B.pipa.map((p) => (p ? "odprta" : "zaprta")).join(", ")}. Napajalnik ${B.vklop ? "vklopljen" : "izklopljen"}.`);
  }
  // Povečava elektrod (~4×): mehurčki vodika so drobnejši in jih je več, kisikovi večji (mehurčki 0,1–0,5 mm, ocena po fotografijah).
  function lupaElektrod(g, svg, cx, cy, r) {
    const id = `${svg.uid}-lupael`, s0 = B.last, I = B.vklop && B.tek ? s0.If || 0 : 0, M = 4 * S; // 1 cm = 25,6 enote
    s("circle", { cx, cy, r }, s("clipPath", { id }, s("defs", {}, g)));
    const c = s("g", { "clip-path": `url(#${id})` }, g);
    s("rect", { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r, class: "lab-sil-lupa-bg" }, c);
    [B.katoda, B.anoda].forEach((arm, j) => {
      const x0 = cx - r + j * r, ex = x0 + r / 2, kat = j === 0;
      if (B.tek) s("rect", { x: x0, y: cy - r, width: r, height: 2 * r, fill: rgb(B.barva(arm) ?? VODA_BARVA, B.indikator ? 0.88 : 0.75) }, c);
      const yE = cy + r * 0.35;
      if (B.elektrode === "pt") s("rect", { x: ex - 0.5 * M, y: yE - 0.5 * M, width: M, height: 1 * M, fill: u(svg, "m-Pt"), stroke: "#7d848b", "stroke-width": 0.6 }, c);
      else s("rect", { x: ex - 0.3 * M, y: yE - 0.7 * M, width: 0.6 * M, height: 2 * M, rx: 3, fill: u(svg, "m-C") }, c);
      s("line", { x1: ex, y1: yE + 0.5 * M, x2: ex, y2: cy + r, stroke: "#9aa1a8", "stroke-width": 2 }, c);
      if (I > 2e-4 && B.tek) {
        const iDen = (I / ELEKTRODE[B.elektrode].A) * (kat ? 1 : s0.fO2 * 0.5 + s0.fCl2 * 0.6 + s0.fCO2 * 0.5);
        const n = Math.round(clamp(6 + 9 * Math.log10(iDen / 1e-4), 2, 34));
        mehurcki(P.krog(cx, cy, r), { x: ex, w: (B.elektrode === "pt" ? 1 : 0.6) * M, y0: yE - (B.elektrode === "pt" ? 0.5 : 0.7) * M, y1: cy - r, n, r: kat ? [0.6, 1.4] : [1.1, 2.4], v: 8 * M, key: 5 + j });
      }
      label(c, ex + (kat ? 1.5 : -1.5), cy - 9, kat ? "katoda (−)" : "anoda (+)", "lab-ek-miza small lab-ek-halo");
    });
    s("line", { x1: cx, y1: cy - r, x2: cx, y2: cy + r, stroke: "var(--muted)", "stroke-width": 1, "stroke-dasharray": "3 3" }, g);
    s("circle", { cx, cy, r, class: "lab-sil-lupa-frame" }, g);
    label(g, cx, cy - r - 7, "elektrodi, povečano ~4×", "tick small");
  }
  // Povečana skala cevi okoli meniska: 0,1 mL razdelki, številke navzdol.
  function lupaCev(g, svg, x, y, w, hh, i) {
    const id = `${svg.uid}-lupa${i}`;
    s("rect", { x, y, width: w, height: hh, rx: 8 }, s("clipPath", { id }, s("defs", {}, g)));
    s("rect", { x, y, width: w, height: hh, rx: 8, class: "lab-sil-lupa-bg" }, g);
    const c = s("g", { "clip-path": `url(#${id})` }, g);
    const ppu = 34, yc = y + hh / 2, filled = !!B.tek;
    const v = filled ? (B.pipa[i] ? 0 : Math.min(B.naSkali(i), 57)) : 0, Y = (q) => yc + (q - v) * ppu;
    const cx0 = x + 28, cw = w - 40;
    // cev (široka v povečavi), plin zgoraj, tekočina spodaj z meniskom
    s("rect", { x: cx0, y, width: cw, height: hh, fill: u(svg, "steklo") }, c);
    if (filled) {
      const ym = B.pipa[i] ? y - 10 : yc;
      const col = rgb(B.barva(i) ?? VODA_BARVA, B.indikator ? 0.85 : 0.6);
      s("path", { d: `M${cx0},${ym - 7} Q${cx0 + cw / 2},${ym + 7} ${cx0 + cw},${ym - 7} V${y + hh} H${cx0} Z`, fill: col }, c);
      s("path", { d: `M${cx0},${ym - 7} Q${cx0 + cw / 2},${ym + 7} ${cx0 + cw},${ym - 7}`, class: "lab-ek-menisk" }, c);
      s("rect", { x: cx0, y, width: cw, height: hh, fill: u(svg, "senca") }, c);
    }
    for (let n = Math.ceil((v - hh / 2 / ppu) * 10); n <= Math.floor((v + hh / 2 / ppu) * 10); n++) {
      if (n < 0) continue;
      const yy = Y(n / 10), big = n % 10 === 0, mid = n % 5 === 0;
      s("line", { x1: cx0 + cw - (big ? 22 : mid ? 15 : 9), y1: yy, x2: cx0 + cw, y2: yy, class: "lab-sil-tick" }, c);
      if (big) label(c, cx0 - 3, yy, String(n / 10), "tick b", "end");
    }
    s("rect", { x: cx0 + cw * 0.14, y, width: 4, height: hh, class: "lab-ek-hl" }, c);
    s("rect", { x, y, width: w, height: hh, rx: 8, class: "lab-sil-lupa-frame" }, g);
    label(g, x + w / 2, y + hh + 11, `povečano ${i ? "desno" : "levo"}`, "tick small");
  }
  sync();
  draw(true);
  redraw();
  readouts();
}
// Brezbarvna raztopina je v steklu videti rahlo modrikasta; barvne ostanejo, kot jih da Beer-Lambertov zakon.
const bistra = (c) => c.map((v, i) => Math.round(v - [26, 14, 6][i] * (Math.min(...c) / 242)));

// ================================================================ 2. galvanski člen
const KOV_OPTS = Object.entries(KOVINE).map(([k, v]) => [k, `${v.name} (${k})`]);
const SOL_OPTS = Object.entries(SOLI).map(([k, v]) => [k, `${v.name} (${v.formula})`]);
const MOST_OPTS = [["brez", "brez mostu"], ["papir", "trak filtrirnega papirja s KNO₃"], ["suh", "suh trak papirja"], ["ucev", "U-cev z agarjem in KNO₃"]];
export function labGalvanski(el) {
  const B = new GalvanBench({ seed: seme() });
  const W = 400, H = 346, S = 13; // 1 cm = 13 enot
  const svg = svgBox(W, H, "lab-bench lab-ek lab-ek-gal");
  gradienti(svg);
  const gBack = s("g", {}, svg), gD = s("g", {}, svg);
  const P = plastMehurckov(svg, W, H);
  const log = eventLog();
  const vmL = lcd("voltmeter"), amL = lcd("ampermeter"), thL = lcd("temperatura raztopin");
  const table = dataTable([
    { key: "l", label: "levo" },
    { key: "d", label: "desno" },
    { key: "m", label: "most, porabnik" },
    { key: "U", label: "<i>U</i> [V]" },
    { key: "E", label: "Δ<i>E</i>° [V]" },
  ], { empty: "Še ni meritev. Sestavi člen, poveži ga s solnim mostom in zapiši napetost." });
  const graph = dataGraph({ x: [-1, 3.5], y: [-1, 3.5], xStep: 0.5, yStep: 0.5, xLabel: "ΔE° [V]", yLabel: "U [V]", title: "Izmerjena napetost v odvisnosti od razlike standardnih elektrodnih potencialov (rdeči minus črni vodnik)" });
  const graphK = dataGraph({ x: [-3, 3], y: [-120, 120], xStep: 1, yStep: 20, xLabel: "lg(c rdeči / c črni)", yLabel: "U [mV]", title: "Koncentracijski členi: napetost v odvisnosti od desetiškega logaritma razmerja koncentracij" });
  const qBox = h("div");
  const pts = [], ptsK = [];
  let asked = false, askedK = false, nTick = 0;
  const said = {};
  const once = (k, text, kind = "warn") => said[k] || ((said[k] = true), log.push(text, kind));

  const casa = (i) => {
    const kSel = select({ label: "kovina", options: KOV_OPTS, value: B.casi[i].kovina, onChange: (v) => (B.postavi(i, { kovina: v }), sSel.set(KOVINE[v].sol), changed(i)) });
    const sSel = select({ label: "raztopina", options: SOL_OPTS, value: B.casi[i].sol, onChange: (v) => (B.postavi(i, { sol: v }), changed(i)) });
    const cSel = select({ label: "koncentracija", options: KONC_G.map((c) => [String(c), `${cFmt(c)} mol/L`]), value: String(B.casi[i].c), onChange: (v) => (B.postavi(i, { c: +v }), changed(i)) });
    const brus = button("Obrusi elektrodo z brusnim papirjem", () => (B.obrusi(i), log.push(`${KOVINE[B.casi[i].kovina].name[0].toUpperCase() + KOVINE[B.casi[i].kovina].name.slice(1)} je obrušen: oksidna plast je odstranjena, kovina se sveti.`, "ok"), draw()));
    return { kSel, sSel, cSel, brus };
  };
  const C = [casa(0), casa(1)];
  const mostSeg = select({ label: "solni most", options: MOST_OPTS, value: B.most, onChange: (v) => ((B.most = v), log.push({ brez: "Solni most si odstranil.", papir: "Trak filtrirnega papirja, namočen v raztopino KNO₃, povezuje čaši.", suh: "Čaši povezuje suh trak papirja.", ucev: "Čaši povezuje U-cev z agarjem in KNO₃." }[v], "info"), draw()) });
  const redSeg = row("rdeči vodnik (V)", seg("rdeči vodnik voltmetra", [["0", "na levo elektrodo"], ["1", "na desno elektrodo"]], "1", (v) => ((B.rdeca = +v), draw())));
  const vmSel = select({ label: "območje voltmetra", options: [["2", "2 V"], ["20", "20 V"]], value: B.vmRange, onChange: (v) => (B.vmRange = v) });
  const brSel = select({ label: "porabnik (zaporedno z ampermetrom)", options: Object.entries(BREME).map(([k, v]) => [k, v.name]), value: B.breme, onChange: (v) => ((B.breme = v), draw()) });
  const amSel = select({ label: "območje ampermetra", options: [["20m", "20 mA"], ["200m", "200 mA"]], value: B.amRange, onChange: (v) => (B.amRange = v) });
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => (table.clear(), (pts.length = ptsK.length = 0), redraw()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(P.wrap, h("div", { class: "lab-meters" }, vmL, amL, thL)), controlsBox(
        grp("1. Leva čaša", C[0].kSel, C[0].sSel, C[0].cSel, buttons(C[0].brus)),
        grp("2. Desna čaša", C[1].kSel, C[1].sSel, C[1].cSel, buttons(C[1].brus)),
        grp("3. Povezava", hint("Solni most sklene krog med raztopinama: po njem potujejo ioni. Brez njega tok ne more teči."), mostSeg),
        grp("4. Merilnik in porabnik", hint("Voltmeter ima notranji upor 10 MΩ. Rdeči vodnik je na vtičnici V, črni na COM: pozitivna napetost pomeni, da je rdeča elektroda pozitivni pol."), redSeg, vmSel, brSel, amSel, buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Napetost člena in vrsta potencialov"), graph,
      h("h4", { class: "lab-h" }, "Koncentracijski člen"), hint("Daj v obe čaši isto kovino v raztopini njene soli z različnima koncentracijama. Premica je idealna Nernstova napoved s koncentracijami, trikotniki so napoved z aktivnostmi (»dejavnimi« koncentracijami). Primerjaj, kam padejo tvoje meritve."), graphK, qBox,
      notes(POENOSTAVITVE_ELEKTROKEMIJA.galvanski, "Standardni elektrodni potenciali: CRC Handbook, »Electrochemical series« (Mg −2,372, Zn −0,762, Fe −0,447, Pb −0,126, Cu +0,342, Ag +0,800 V). Nernstova enačba <i>E</i> = <i>E</i>° + (<i>RT</i>/<i>zF</i>) ln <i>c</i>. Aktivnostni koeficienti γ± pri 25 °C: Robinson & Stokes (1959), CRC Handbook (npr. CuSO₄ 0,41 pri 0,01 mol/L, 0,042 pri 1 mol/L). Magnezij: mešani potencial ~−1,55 V (ocena po Song & Atrens 1999). Voltmeter ±(0,5 % + 2 digita), 10 MΩ. Ocene: upor solnega mostu (papir ~8 kΩ, U-cev ~0,4 kΩ), upor raztopin, oksidne plasti, nihanje potenciala."),
    ],
    tryText: "Sestavi Daniellov člen (cink v ZnSO₄, baker v CuSO₄) in izmeri napetost brez solnega mostu in z njim. Napovej, kateri pari kovin dajo največjo napetost. Razredči eno raztopino: za koliko se spremeni napetost? Kaj pokaže člen iz dveh bakrovih elektrod v različno koncentriranih raztopinah?",
  });
  el.classList.add("lab");

  function changed(i) {
    const b = B.casi[i];
    const ion = SOLI[b.sol].ion;
    if (ion !== b.kovina) log.push(KOVINE[b.kovina].E0 < KOVINE[ion].E0 ? `${KOVINE[b.kovina].name[0].toUpperCase() + KOVINE[b.kovina].name.slice(1)} je v raztopini soli bolj žlahtne kovine: nanj se izloča ${KOVINE[ion].name} in potencial se spreminja. Za polčlen daj kovino v raztopino njene soli.` : `Kovina je v raztopini tuje soli: brez lastnih ionov potencial ni določen in niha.`, "warn");
    if (SOLI[b.sol].strupeno) log.push("Svinčeve spojine so strupene: delaj z rokavicami, odpadke zberi posebej.", "info");
    if (b.sol === "AgNO3") log.push("Srebrov nitrat na koži pusti temne madeže: rokavice.", "info");
    draw();
  }
  function opis(b) {
    return `${b.kovina} | ${SOLI[b.sol].formula} ${cFmt(b.c)} M${b.obrusen ? "" : " (neobr.)"}`;
  }
  function record() {
    const v = B.readV();
    const r = VM_RANGES[B.vmRange];
    if (v.over) return log.push("Voltmeter kaže OL: napetost je večja od območja. Izberi 20 V.", "warn");
    const a = B.readA(), Ir = AM_RANGES[B.amRange];
    const dE = B.napovedE0();
    table.add({ l: opis(B.casi[0]), d: opis(B.casi[1]), m: `${MOST_OPTS.find((m) => m[0] === B.most)[1].replace("trak filtrirnega papirja s KNO₃", "papir s KNO₃").replace("U-cev z agarjem in KNO₃", "U-cev")}${B.breme !== "brez" ? `, ${BREME[B.breme].name}${a && !a.over ? ` (${a.text.replace(".", ",")} ${Ir.unit})` : ""}` : ""}`, U: num(v.value, r.dec), E: num(dE, 2) });
    const [L, R] = B.casi;
    if (B.most === "papir" || B.most === "ucev") {
      if (L.kovina === R.kovina && SOLI[L.sol].ion === L.kovina && SOLI[R.sol].ion === R.kovina) ptsK.push([Math.log10(B.casi[B.rdeca].c / B.casi[B.com].c), v.value * 1000, B.napovedAktivnost() * 1000]);
      else if (B.breme === "brez") pts.push([dE, v.value, L.kovina === "Mg" || R.kovina === "Mg"]);
    }
    if (B.most === "brez" || B.most === "suh") once("odprt", "Brez prevodne povezave med raztopinama krog ni sklenjen: voltmeter kaže le nekaj milivoltov, ki se spreminjajo.", "info");
    redraw();
  }
  function redraw() {
    graph.draw([
      { id: "p", pts: pts.filter((p) => !p[2]).map((p) => [p[0], p[1]]), cls: "a", shape: "o", label: "pari kovin", line: (x) => x },
      { id: "mg", pts: pts.filter((p) => p[2]).map((p) => [p[0], p[1]]), cls: "c", shape: "^", label: "z magnezijem" },
    ].filter((x) => x.pts.length || x.id === "p"));
    const k = naklonDekada(B.lab.T, 2) * 1000;
    graphK.draw([
      { id: "ideal", pts: [], cls: "a", label: "idealna Nernstova premica (koncentracije)", line: (x) => k * x },
      { id: "akt", pts: ptsK.map((p) => [p[0], p[2]]), cls: "c", shape: "^", label: "napoved z aktivnostmi" },
      { id: "k", pts: ptsK.map((p) => [p[0], p[1]]), cls: "b", shape: "o", label: "izmerjeno" },
    ].filter((x) => x.pts.length || x.id === "ideal"));
    if (!asked && pts.length >= 3 && new Set(table.rows.map((r) => r.l + r.d)).size >= 3) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj velja za galvanske člene, ki si jih sestavil?",
        options: [
          { t: "Negativni pol je bolj reaktivna kovina (bolj negativen standardni elektrodni potencial); napetost je tem večja, čim bolj sta kovini narazen v vrsti potencialov.", ok: true, why: "Bolj reaktivna kovina se oksidira in oddaja elektrone (anoda, −), ioni manj reaktivne se reducirajo (katoda, +). Napetost je približno razlika standardnih potencialov, npr. Cu − Zn = 0,34 − (−0,76) = 1,10 V. Magnezij da manj, ker ga pokriva oksidna plast." },
          { t: "Negativni pol je vedno baker.", ok: false, why: "Baker je v paru s cinkom pozitivni pol (katoda), ker je manj reaktiven. V paru s srebrom je baker negativni pol." },
          { t: "Napetost je večja, če sta elektrodi večji.", ok: false, why: "Velikost elektrod spremeni le notranji upor in s tem tok, ki ga člen da porabniku. Napetost brez porabnika je odvisna od kovin in koncentracij." },
          { t: "Brez solnega mostu je napetost največja, ker tok ne teče.", ok: false, why: "Brez solnega mostu krog ni sklenjen: voltmeter ne meri napetosti člena in kaže skoraj 0 V. Solni most omogoča, da ioni potujejo med raztopinama." },
        ],
      }));
    }
    if (!askedK && ptsK.some((p) => Math.abs(p[0]) >= 1)) {
      askedK = true;
      qBox.append(conclusion({
        text: "Zakaj ima člen iz dveh enakih elektrod napetost, ko sta raztopini različno koncentrirani, in zakaj je izmerjena napetost manjša od idealne Nernstove premice?",
        options: [
          { t: "Potencial elektrode je odvisen od koncentracije ionov (Nernstova enačba), zato je elektroda v bolj koncentrirani raztopini pozitivni pol. V bolj koncentrirani raztopini ioni drug drugega ovirajo, zato je njihova »dejavna« koncentracija (aktivnost) manjša od prave in napetost manjša od idealne.", ok: true, why: "Idealno <i>E</i> = <i>E</i>° + (0,0592 V/2)·lg <i>c</i>: pri razmerju bakrovih raztopin 1 : 100 bi dobili 2 · 0,0296 V = 0,059 V. Natančneje velja <i>E</i> = <i>E</i>° + (0,0592 V/2)·lg <i>a</i>, <i>a</i> = γ·<i>c</i>. V 1 mol/L CuSO₄ je γ ≈ 0,04, v 0,01 mol/L pa ≈ 0,41, zato je razmerje aktivnosti le ~1 : 10 in napetost ~0,03 V. V razredčeni raztopini se baker raztaplja, v koncentrirani se izloča, dokler se raztopini ne izenačita." },
          { t: "Napetost je napaka merilnika; prava napetost je 0 V.", ok: false, why: "Pri enakih koncentracijah je napetost res skoraj 0 V, pri različnih pa je resnična. Da je manjša od idealne, ni napaka: ujema se z Nernstovo enačbo, ko namesto koncentracij vzamemo aktivnosti." },
          { t: "Del napetosti se porabi v solnem mostu, zato je manjša od idealne.", ok: false, why: "Voltmeter ima upor 10 MΩ, solni most le nekaj kΩ: na mostu ostane manj kot desetinka odstotka napetosti. Napetost je manjša, ker so aktivnosti ionov manjše od koncentracij." },
          { t: "Ker je v bolj koncentrirani raztopini več vode.", ok: false, why: "Ravno obratno: v bolj koncentrirani je več bakrovih ionov. Potencial določa aktivnost ionov Cu²⁺, ki raste s koncentracijo, a počasneje kot koncentracija." },
        ],
      }));
    }
  }

  ticker(el, (dt) => {
    B.step(dt);
    const v = B.readV(), r = VM_RANGES[B.vmRange];
    vmL.set(v.over ? "OL" : v.text, "V", `območje ${r.max} V`);
    const a = B.readA(), Ir = AM_RANGES[B.amRange];
    amL.set(a ? (a.over ? "OL" : a.text) : "", Ir.unit, a ? BREME[B.breme].name : "ni porabnika");
    thL.set(num(B.lab.T, 1), "°C");
    if (B.breme === "led" && B.last.sveti) once("led", "LED komaj opazno sveti: člen ima veliko napetost, a velik notranji upor, zato je tok le desetinka miliampera.", "info");
    if (B.breme === "led" && !B.last.sveti && Math.abs(B.last.E) > 0.2) once("ledne", "LED ne sveti: potrebuje vsaj ~1,8 V in nekaj miliamperov, člen pa da premalo.", "info");
    if (B.breme === "motor" && !B.last.vrti) once("motor", "Motorček se ne vrti: notranji upor člena je prevelik, tok je premajhen.", "info");
    if (B.breme !== "brez" && Math.abs(B.last.E) > 0.05 && Math.abs(B.last.U) < 0.5 * Math.abs(B.last.E)) once("padec", "Z obremenitvijo napetost na sponkah močno pade: del napetosti se porabi na notranjem uporu solnega mostu in raztopin.", "info");
    if (B.casi.some((b) => b.kovina === "Mg") && B.most !== "brez") once("mg", "Magnezijev trak se prevleče z mehurčki: magnezij reagira tudi z vodo. Izmerjeni potencial je zato manj negativen od standardnega.", "info");
    if (++nTick % 3 === 0) draw();
  }, 100);

  // ---- risba (1 cm = 13 enot): dve 100 mL čaši (Ø 5 cm × 7 cm), trak 1,5 cm × 9 cm, multimeter 9 cm × 18 cm
  const yB = 318, bw = 5 * S, bh = 7 * S, bx = [22, 152], yLiq = yB - 4.1 * S;
  function draw() {
    gBack.replaceChildren();
    gD.replaceChildren();
    P.begin();
    s("rect", { x: 0, y: yB, width: W, height: H - yB, fill: u(svg, "miza") }, gBack);
    const ex = (i) => bx[i] + bw / 2 - (i ? 8 : -8);
    B.casi.forEach((b, i) => {
      const x0 = bx[i];
      const c = SOLI[b.sol].ion === "Cu" ? { Cu: b.c } : SOLI[b.sol].ion === "Fe" ? { Fe: b.c } : {};
      const col = barvaRaztopine(c, 5); // pot svetlobe skozi čašo 5 cm
      tekocina(gD, svg, x0 + 2, yLiq, bw - 4, yB - 2 - yLiq, rgb(bistra(col), 0.85), { rx: 3 });
      // elektroda (trak 1,5 cm × 9 cm) s prevleko v tuji soli
      const sx = ex(i) - 0.75 * S, sy = yB - 1 * S - 9 * S, sw = 1.5 * S, sh = 9 * S;
      s("rect", { x: sx, y: sy, width: sw, height: sh, rx: 1, fill: u(svg, `m-${b.kovina}`), stroke: "#555b62", "stroke-width": 0.5 }, gD);
      if (!b.obrusen) s("rect", { x: sx, y: sy, width: sw, height: sh, rx: 1, class: "lab-ek-oxid" }, gD);
      if (b.dep > 0.02) s("rect", { x: sx, y: yLiq, width: sw, height: sy + sh - yLiq, rx: 1, fill: PREVLEKA[SOLI[b.sol].ion] ?? "#555", opacity: (0.92 * b.dep).toFixed(2) }, gD);
      if (b.kovina === "Mg" && B.most !== "brez") mehurcki(P.g, { x: sx + sw / 2, w: sw, y0: sy + sh - 4, y1: yLiq + 2, n: 5, r: [0.6, 1.2], v: 12 * S, key: i });
      steklo(gD, svg, x0, yB - bh, bw, bh, { rx: 4 });
      s("path", { d: `M${x0 - 3},${yB - bh} q3,0 3,3`, class: "lab-ek-glass-in" }, gD);
      for (let m = 20; m <= 80; m += 20) {
        const y = yB - (m / 19.6) * S;
        s("line", { x1: x0 + bw - 9, y1: y, x2: x0 + bw - 2, y2: y, class: "lab-ek-tick" }, gD);
      }
      label(gD, x0 + bw / 2, yB + 12, `${b.kovina} | ${SOLI[b.sol].formula}`, "lab-ek-miza");
      label(gD, x0 + bw / 2, yB + 23, `${cFmt(b.c)} mol/L`, "lab-ek-miza");
      krokodil(gD, ex(i), sy - 4, i === B.rdeca ? "r" : "k", -90);
    });
    // solni most
    const xm0 = bx[0] + bw - 14, xm1 = bx[1] + 14, ym = yB - bh - 16;
    if (B.most === "papir" || B.most === "suh") {
      const d = `M${xm0},${yB - 14} V${yB - bh + 4} Q${xm0},${ym} ${(xm0 + xm1) / 2},${ym} Q${xm1},${ym} ${xm1},${yB - bh + 4} V${yB - 14}`;
      s("path", { d, class: `lab-ek-most ${B.most === "suh" ? "suh" : ""}` }, gD);
      s("path", { d, class: "lab-ek-most-rob" }, gD);
    } else if (B.most === "ucev") {
      const d = `M${xm0},${yB - 14} V${yB - bh + 4} Q${xm0},${ym - 6} ${(xm0 + xm1) / 2},${ym - 6} Q${xm1},${ym - 6} ${xm1},${yB - bh + 4} V${yB - 14}`;
      s("path", { d, class: "lab-ek-ucev" }, gD);
      s("path", { d, class: "lab-ek-ucev-gel" }, gD);
      s("path", { d, class: "lab-ek-ucev-hl" }, gD);
    }
    // multimeter (voltmeter) 9 × 18 cm, stoji desno
    const v = B.readV(), mx = 280, my = 84, mw = 9 * S * 0.9, mh = 18 * S * 0.9;
    const dm = multimeter(gD, svg, mx, my, mw, mh, { text: v.over ? "OL" : v.text, unit: "V", kot: B.vmRange === "2" ? -60 : -35, ime: "voltmeter" });
    const jV = dm.jack("VΩ"), jC = dm.jack("COM");
    const top = (i) => [ex(i), yB - 10 * S - 10];
    const [rx, ry] = top(B.rdeca), [kx, ky] = top(B.com);
    // vodnika gresta od krokodilčkov navzgor, čez čaši in mimo desne čaše navzdol do vtičnic (ne čez elektrodo)
    const vod = (x, y, j, dy, k) => `M${x},${y} C${x},${y - dy} ${250 + k},${y - dy} ${256 + k},${j[1] - 4} S${j[0] - 14},${j[1] + 30} ${j[0]},${j[1]}`;
    zica(gD, vod(rx, ry, jV, B.rdeca ? 34 : 48, 8), "r");
    zica(gD, vod(kx, ky, jC, B.rdeca ? 48 : 34, 0), "k");
    // porabnik na ploščici nad čašama, zaporedno z ampermetrom (multimeter na območju mA)
    if (B.breme !== "brez") {
      const px = 92, py = 22, pw = 78, ph = 34, a = B.readA(), Ir = AM_RANGES[B.amRange];
      const am = multimeter(gD, svg, 196, 14, 46, 92, { text: a ? (a.over ? "OL" : a.text) : "", unit: Ir.unit, kot: B.amRange === "20m" ? 20 : 45, ime: "ampermeter" });
      const jA = am.jack("mA"), jAc = am.jack("COM");
      s("rect", { x: px, y: py, width: pw, height: ph, rx: 3, fill: "#2e6b4a", stroke: "#1d4a32" }, gD);
      if (B.breme === "led") {
        s("path", { d: `M${px + 34},${py + 24} v-10 a5,5 0 0 1 10,0 v10 Z`, fill: B.last.sveti ? "#ff3b30" : "#d98b8b", stroke: "#8c1d18", "stroke-width": 0.8 }, gD);
        if (B.last.sveti) s("circle", { cx: px + 39, cy: py + 14, r: 9, fill: "#ff5a4f", opacity: clamp(B.last.I / 0.002, 0.15, 0.6).toFixed(2) }, gD);
      } else if (B.breme === "motor") {
        s("rect", { x: px + 26, y: py + 8, width: 26, height: 18, rx: 4, fill: u(svg, "palica") }, gD);
        s("circle", { cx: px + 56, cy: py + 17, r: 3, fill: "#c9a227", class: B.last.vrti ? "lab-ek-spin" : "" }, gD);
      } else {
        s("rect", { x: px + 24, y: py + 13, width: 30, height: 8, rx: 3, fill: "#d9c79e", stroke: "#8a7650", "stroke-width": 0.8 }, gD);
        label(gD, px + pw / 2, py + 30, BREME[B.breme].name.replace("upornik ", ""), "lab-ek-panel");
      }
      label(gD, px + pw / 2, py - 5, BREME[B.breme].name, "tick small");
      zica(gD, `M${px + 4},${py + ph / 2} C${px - 20},${py + ph / 2} ${ex(0)},${py + 60} ${ex(0)},${yB - 10 * S - 10}`, B.rdeca === 0 ? "r" : "k");
      zica(gD, `M${px + pw - 4},${py + ph / 2} C${px + pw + 14},${py + ph / 2} ${jA[0] - 6},${jA[1] + 22} ${jA[0]},${jA[1]}`, B.rdeca === 1 ? "r" : "k");
      zica(gD, `M${jAc[0]},${jAc[1]} C${jAc[0]},${jAc[1] + 26} ${ex(1)},${py + 64} ${ex(1)},${yB - 10 * S - 10}`, B.rdeca === 1 ? "r" : "k");
    }
    s("path", { d: `M${352},${H - 8} v-4 h${2 * S} v4`, class: "lab-scale lab-ek-mizacrta" }, gD);
    label(gD, 352 + S, H - 15, "2 cm", "lab-ek-miza");
    P.commit();
    svg.setAttribute("aria-label", `Galvanski člen: levo ${opis(B.casi[0])}, desno ${opis(B.casi[1])}, ${MOST_OPTS.find((m) => m[0] === B.most)[1]}. Voltmeter kaže ${v.over ? "OL" : v.text.replace(".", ",") + " V"}.`);
  }
  redraw();
  draw();
}

// ================================================================ 3. kovine v kislinah in raztopinah soli
const RAZ_OPTS = Object.entries(RAZTOPINE_K).map(([k, v]) => [k, `${v.name} (${v.formula})`]);
const KOVINE_K = ["Mg", "Zn", "Fe", "Cu"];
const STOLPCI = ["HCl", "H2SO4", "MgSO4", "ZnSO4", "FeSO4", "CuSO4", "AgNO3"];
export function labKovine(el) {
  const B = new KovineBench({ seed: seme() });
  const W = 400, H = 300, S = 8; // 1 cm = 8 enot
  const svg = svgBox(W, H, "lab-bench lab-ek lab-ek-kov");
  gradienti(svg);
  const gD = s("g", {}, svg);
  const P = plastMehurckov(svg, W, H);
  const log = eventLog();
  const swL = lcd("štoparica"), brL = lcd("plinska brizga"), thL = lcd("termometer"), baL = lcd("tehtnica");
  const table = dataTable([
    { key: "p", label: "poskus" },
    { key: "t", label: "<i>t</i> [s]" },
    { key: "V", label: "<i>V</i>(H₂) [mL]" },
    { key: "T", label: "<i>T</i> [°C]" },
  ], { empty: "Še ni meritev. Nalij kislino, priključi brizgo, dodaj kovino in zapisuj prostornino plina." });
  const graph = dataGraph({ x: [0, 300], y: [0, 100], xStep: 30, yStep: 10, xLabel: "t [s]", yLabel: "V(H₂) [mL]", title: "Prostornina plina v brizgi v odvisnosti od časa za različne kovine" });
  const gridBox = h("div", { class: "lab-ek-grid-wrap" });
  const orderBox = h("div", { class: "lab-ek-order" });
  const qBox = h("div");
  const series = new Map();
  const grid = {}; // `${kovina}:${raztopina}` → { rekel, ok }
  let rId = "HCl", rC = 1, kov = "Mg", obl = "trak", masa = 0.05, speed = 1, tRun = 0, run = null, asked = false, nTick = 0;
  const said = {};
  const once = (k, text, kind = "warn") => said[k] || ((said[k] = true), log.push(text, kind));
  const goggles = toggle("zaščitna očala", false, (v) => ((B.ocala = v), v && log.push("Nadel si si zaščitna očala.", "ok")));
  const rSel = select({ label: "raztopina", options: RAZ_OPTS, value: rId, onChange: (v) => ((rId = v), syncC()) });
  const cSel = select({ label: "koncentracija", options: [], onChange: (v) => (rC = +v) });
  const pourBtn = button("Nalij 50 mL v čisto posodo", () => pour(), "primary small");
  const brT = toggle("plinska brizga 100 mL priključena (za kisline)", true, (v) => ((B.brizga = v), B.tek && !B.kos && B._zrak(), draw()));
  const mesT = toggle("stresaj posodo (mešanje)", false, (v) => (B.mesaj = v));
  const kSel = select({ label: "kovina", options: KOVINE_K.map((k) => [k, `${KOVINE[k].name} (${k})`]), value: kov, onChange: (v) => (kov = v) });
  const oSel = select({ label: "oblika", options: Object.entries(OBLIKE).map(([k, v]) => [k, v.name + (k === "granule" ? " (pri Mg ostružki)" : "")]), value: obl, onChange: (v) => (obl = v) });
  const mSel = select({ label: "masa", options: MASE.map((m) => [String(m), `${num(m, 2)} g`]), value: String(masa), onChange: (v) => (masa = +v) });
  const addBtn = button("Stehtaj in dodaj kovino", () => add(), "primary small");
  const outBtn = button("Vzemi kovino ven in jo stehtaj", () => takeOut());
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const yesBtn = button("Reakcija poteče ✓", () => answer(true));
  const noBtn = button("Ni reakcije ✗", () => answer(false));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(P.wrap, h("div", { class: "lab-meters" }, swL, brL, thL, baL)), controlsBox(
        grp("1. Varnost", hint("Kisline so jedke, srebrov nitrat obarva kožo, pri reakciji nastaja vnetljiv vodik: zaščitna očala, brez ognja v bližini."), goggles),
        grp("2. Raztopina", rSel, cSel, brT, mesT, buttons(pourBtn)),
        grp("3. Kovina", kSel, oSel, mSel, buttons(addBtn, outBtn)),
        grp("4. Opazuj in zapiši", hitrostSeg([1, 10, 60], 1, (v) => (speed = v)), hint("Opazuj vsaj minuto. Nato v preglednico zapiši, ali reakcija poteče."), buttons(recBtn), buttons(yesBtn, noBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Preglednica: ali kovina reagira?"), gridBox,
      h("h4", { class: "lab-h" }, "Meritve plina"), table, graph,
      h("h4", { class: "lab-h" }, "Vrsta reaktivnosti kovin"), orderBox, qBox,
      notes(POENOSTAVITVE_ELEKTROKEMIJA.kovine, "Standardni elektrodni potenciali (CRC Handbook), tvorbene entalpije ionov (NBS-tabele, Wagman 1982), difuzijski koeficienti ionov (CRC), Ka2(H₂SO₄) = 1,02·10⁻². Barva raztopine CuSO₄ po Beer-Lambertovem zakonu. Ocene: hitrostne konstante (Mg po RSC »Disappearing magnesium«), aktivacijska energija 40 kJ/mol, površine trakov, granul in prahu, mejna plast, pena, toplotne izgube."),
    ],
    tryText: "Napovej, katera kovina bo s klorovodikovo kislino reagirala najhitreje. Primerjaj magnezij, cink, železo in baker v 1 mol/L HCl. Nato daj cink v raztopino bakrovega(II) sulfata in baker v raztopino cinkovega sulfata. Iz preglednice razvrsti kovine po reaktivnosti.",
  });
  el.classList.add("lab");

  function syncC() {
    const R = RAZTOPINE_K[rId];
    cSel.sel.replaceChildren(...R.konc.map((c) => h("option", { value: String(c) }, `${cFmt(c)} mol/L${R.kislina && c >= 6 ? " (jedka)" : ""}`)));
    rC = R.konc.includes(1) ? 1 : R.konc[R.konc.length - 1];
    cSel.sel.value = String(rC);
  }
  function pour() {
    if (B.kos) log.push("Kovino si vzel ven, posodo spral in natočil svežo raztopino.", "info");
    const kis = RAZTOPINE_K[rId].kislina;
    if (!kis) B.brizga = false;
    else B.brizga = brT.get();
    const r = B.nalij(rId, rC);
    if (!r.ok) return log.push("Najprej si nadeni zaščitna očala.", "warn");
    run = null;
    tRun = 0;
    log.push(`Natočil si 50 mL: ${RAZTOPINE_K[rId].name} ${cFmt(rC)} mol/L${kis ? (B.brizga ? " v erlenmajerico z brizgo" : " v erlenmajerico (brez brizge)") : " v čašo"}.`, "ok");
    if (r.dim) log.push("Klorovodikova kislina 6 mol/L (~20 %) je jedka in ostro diši: hlapi HCl dražijo oči in dihala (vidno se kadi šele koncentrirana, ~37 %, 12 mol/L). Delaj v digestoriju; za ta poskus zadošča 1–2 mol/L.", "bad");
    if (rId === "AgNO3") log.push("Srebrov nitrat na koži pusti temne madeže: rokavice.", "info");
    draw();
  }
  function add() {
    const r = B.dodaj(kov, obl, masa);
    if (!r.ok) return log.push({ ocala: "Najprej si nadeni zaščitna očala.", tekocina: "Najprej nalij raztopino.", ze: "V posodi je že kovina. Vzemi jo ven ali nalij svežo raztopino." }[r.why], "warn");
    const m = B.tehtaj(masa);
    baL.set(num(m, 2), "g", `${KOVINE[kov].name}, ${OBLIKE[obl].name}`);
    tRun = 0;
    run = `${kov} ${OBLIKE[obl].name} ${num(masa, 2)} g + ${RAZTOPINE_K[B.tek.id].formula} ${cFmt(B.tek.c)} M`;
    log.push(`Na tehtnici ${num(m, 2)} g; ${KOVINE[kov].name} (${OBLIKE[obl].name}) je v raztopini${RAZTOPINE_K[B.tek.id].kislina && B.brizga ? ", zamašek z brizgo je na bučki" : ""}.`, "ok");
    draw();
  }
  function takeOut() {
    const k = B.odstrani();
    if (!k) return log.push("V posodi ni kovine.", "warn");
    const m = B.tehtaj(k.m);
    baL.set(num(m, 2), "g", "po poskusu (oprano, osušeno)");
    log.push(`Kovino si vzel ven, jo splaknil in osušil: ${num(m, 2)} g (prej ${num(k.m0, 2)} g).`, "info");
    draw();
  }
  function record() {
    if (!B.tek || !run) return log.push("Najprej nalij raztopino in dodaj kovino.", "warn");
    const o = B.odcitekBrizge(), T = B.readT();
    table.add({ p: run, t: num(tRun, 0), V: B.brizga ? o.text.replace(".", ",") : "–", T: T.text.replace(".", ",") });
    if (B.brizga && Number.isFinite(o.value)) {
      if (!series.has(run)) series.set(run, []);
      series.get(run).push([tRun, o.value]);
    }
    redraw();
  }
  function answer(say) {
    if (!B.tek || (!B.kos && !run)) return log.push("Najprej izvedi poskus: nalij raztopino in dodaj kovino.", "warn");
    if (tRun < 30) return log.push("Opazuj vsaj pol minute (pri železu in pri izpodrivanju je sprememba počasna).", "warn");
    const k = run.split(" ")[0], id = B.tek.id;
    const prav = RAZTOPINE_K[id].kislina ? KINETIKA.k[k] > 0 : KOVINE[k].E0 < KOVINE[RAZTOPINE_K[id].ion].E0;
    const col = id === "H2SO4" ? "H2SO4" : id;
    grid[`${k}:${col}`] = { rekel: say, ok: say === prav };
    log.push(say === prav ? "Zapisano. Opažanje se ujema." : `Poglej še enkrat: ${prav ? "reakcija poteka, a počasi ali le na površini (mehurčki, prevleka, sprememba barve)" : "ni mehurčkov, ni prevleke in barva se ne spreminja"}.`, say === prav ? "ok" : "warn");
    drawGrid();
  }
  function drawGrid() {
    const th = (t) => h("th", { scope: "col", html: t });
    const tbl = h("table", { class: "demo-table lab-table lab-ek-grid" },
      h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "kovina"), ...STOLPCI.map((c) => th(RAZTOPINE_K[c].formula.replace("SO₄", "<wbr>SO₄").replace("NO₃", "<wbr>NO₃"))))),
      h("tbody", {}, ...KOVINE_K.map((k) => h("tr", {}, h("th", { scope: "row" }, k), ...STOLPCI.map((c) => {
        const g = grid[`${k}:${c}`];
        return h("td", { class: g ? (g.ok ? "ok" : "bad") : "", "aria-label": g ? `${k} in ${RAZTOPINE_K[c].formula}: ${g.rekel ? "reagira" : "ne reagira"}${g.ok ? "" : ", preveri"}` : `${k} in ${RAZTOPINE_K[c].formula}: še ni preizkušeno` }, g ? (g.rekel ? "✓" : "✗") : "·");
      })))));
    gridBox.replaceChildren(tbl, h("p", { class: "muted lab-ek-gridnote" }, "✓ reakcija poteče (plin, prevleka ali sprememba barve), ✗ ni reakcije. Rdeč okvir: opažanje preveri še enkrat."));
  }
  // vrstni red: 5 izbirnih seznamov
  const mesta = [0, 1, 2, 3, 4].map((i) => select({ label: `${i + 1}. (${i === 0 ? "najbolj reaktivna" : i === 4 ? "najmanj reaktivna" : "…"})`, options: [["", "izberi"], ...VRSTA.map((k) => [k, `${KOVINE[k].name} (${k})`])], value: "" }));
  const checkBtn = button("Preveri vrstni red", () => checkOrder(), "primary small");
  const orderOut = h("p", { class: "lab-status", "aria-live": "polite" });
  orderBox.append(hint("Iz preglednice razvrsti kovine od najbolj do najmanj reaktivne. Srebra ne preizkusiš sam, a iz poskusa z bakrom in raztopino srebrovega nitrata veš, kje je."), h("div", { class: "lab-ek-mesta" }, ...mesta), buttons(checkBtn), orderOut);
  function checkOrder() {
    const izb = mesta.map((m) => m.get());
    if (izb.some((x) => !x) || new Set(izb).size < 5) return (orderOut.textContent = "Vsako kovino izberi enkrat.");
    const ok = izb.every((x, i) => x === VRSTA[i]);
    orderOut.textContent = ok ? "Pravilno: Mg > Zn > Fe > Cu > Ag." : `Ne čisto. Pomagaj si s preglednico: kovina, ki izpodrine drugo iz raztopine njene soli, je bolj reaktivna.`;
    if (ok && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj pove vrsta reaktivnosti kovin Mg > Zn > Fe > Cu > Ag?",
        options: [
          { t: "Bolj reaktivna kovina izpodrine manj reaktivno iz raztopine njene soli; kovine levo od vodika (Mg, Zn, Fe) s kislinami sproščajo vodik, baker in srebro ne.", ok: true, why: "Bolj reaktivna kovina laže odda elektrone: Zn + Cu²⁺ → Zn²⁺ + Cu. Kovine z negativnim standardnim potencialom reducirajo ione H⁺ v kislini do vodika; baker (E° = +0,34 V) in srebro tega ne zmoreta. Zato magnezij burno reagira s kislino, baker pa sploh ne." },
          { t: "Težje kovine so bolj reaktivne.", ok: false, why: "Srebro je težje od magnezija, a skoraj ne reagira. Reaktivnost je odvisna od tega, kako lahko kovina odda elektrone, ne od mase." },
          { t: "Vse kovine reagirajo s kislinami, le različno hitro.", ok: false, why: "Baker v klorovodikovi ali razredčeni žveplovi kislini ne sprošča vodika, tudi po dolgem času ne. Manj reaktivne kovine od vodika ionov H⁺ ne reducirajo." },
          { t: "Kovina izpodrine katerokoli drugo kovino iz raztopine soli.", ok: false, why: "Baker v raztopini cinkovega sulfata ostane nespremenjen: manj reaktivna kovina ne izpodrine bolj reaktivne." },
        ],
      }));
    }
  }
  function redraw() {
    graph.draw([...series.entries()].map(([name, p], i) => ({ id: name, pts: p, cls: "abc"[i % 3], shape: i % 6 < 3 ? "o" : "^", label: name })));
  }

  ticker(el, (dt) => {
    const d = dt * speed;
    B.step(d);
    if (B.kos || run) tRun += d;
    const o = B.odcitekBrizge(), T = B.readT();
    swL.set(run ? ura(tRun) : "", "", run ? "od dodatka kovine" : "");
    brL.set(B.brizga && B.tek ? (Number.isFinite(o.value) ? o.text : o.cez ? "> 100" : "–") : "", "mL", B.brizga ? (B.batIzpadel ? "bat je izpadel" : "") : "ni priključena");
    thL.set(B.tek ? T.text : "", "°C");
    if (B.kos) {
      const m = B.mehurcki();
      if (m >= 4) once(`burno-${run}`, "Burna reakcija: raztopina se peni in segreva.", "info");
      if (B.prelito) once(`pena-${run}`, "Pena je šla čez rob in v cevko proti brizgi! Uporabi manj kovine, trak namesto prahu ali bolj razredčeno kislino.", "bad");
      if (B.batIzpadel) once(`bat-${run}`, "Bat je izpadel iz brizge: plina je bilo več kot 100 mL in je ušel. Uporabi manjšo maso kovine.", "bad");
      if (B.T > B.lab.T + 15) once(`vroce-${run}`, `Raztopina je vroča (${num(B.T, 0)} °C). Bučke ne drži v roki.`, "warn");
      if (B.tek && !RAZTOPINE_K[B.tek.id].kislina && B.prevleka() > 0.5) once(`prev-${run}`, prevlekaOpis(), "info");
      if (B.kos.kovina === "Mg" && B.tek && !RAZTOPINE_K[B.tek.id].kislina && B.mehurcki() >= 2) once(`mgH2-${run}`, "Na magneziju se razvijajo mehurčki vodika: izločena kovina in magnezij tvorita drobne galvanske člene, na izločeni kovini se voda reducira do vodika (Mg + 2H₂O → Mg²⁺ + 2OH⁻ + H₂). Raztopina se segreva.", "info");
      if (B.tek && RAZTOPINE_K[B.tek.id].kislina && B.kos.m <= 1e-6) once(`konec-${run}`, "Kovina se je popolnoma raztopila; plin ne nastaja več.", "info");
      if (B.tek?.id === "HCl" && B.tek.nH < 1e-5 && B.kos.m > 0) once(`kis-${run}`, "Kislina je porabljena, del kovine je ostal: kislina je bila omejitveni reaktant.", "info");
    }
    if (++nTick % 2 === 0) draw();
  }, 100);
  function prevlekaOpis() {
    const ion = RAZTOPINE_K[B.tek.id].ion;
    return {
      Cu: "Na kovini nastaja rdeče rjava prevleka bakra; modra barva raztopine počasi bledi.",
      Ag: "Na kovini rastejo sivi in srebrno bleščeči kristali srebra; raztopina se obarva modrikasto (Cu²⁺).",
      Fe: "Kovina se prevleče s temno, skoraj črno plastjo železa; bledo zelena barva raztopine počasi izginja.",
      Zn: "Kovina se prevleče s temno sivo plastjo cinka.",
    }[ion] ?? "Kovina se prevleče.";
  }

  // ---- risba (1 cm = 8 enot): erlenmajerica 100 mL (dno Ø 6,4 cm, višina 10,5 cm) ali čaša 100 mL, brizga 100 mL (bat 15 cm)
  const yB = 268;
  function draw() {
    gD.replaceChildren();
    P.begin();
    s("rect", { x: 0, y: yB, width: W, height: H - yB, fill: u(svg, "miza") }, gD);
    const t = B.tek, kis = t ? RAZTOPINE_K[t.id].kislina : rId in RAZTOPINE_K && RAZTOPINE_K[rId].kislina;
    const fx = 50, col = t ? B.barva() : null;
    const liqCol = col ? rgb(bistra(col), 0.85) : null;
    let liqTop = yB;
    if (kis || !t) {
      // erlenmajerica: dno 6,4 cm, vrat 2,2 cm, višina 10,5 cm
      const bw = 6.4 * S, nw = 2.2 * S, hh = 10.5 * S, nh = 2.6 * S, x0 = fx - bw / 2;
      const yN = yB - hh + nh;
      const body = `M${fx - nw / 2},${yB - hh} V${yN} L${x0 + 2},${yB - 3} Q${x0},${yB} ${x0 + 4},${yB} H${x0 + bw - 4} Q${x0 + bw},${yB} ${x0 + bw - 2},${yB - 3} L${fx + nw / 2},${yN} V${yB - hh}`;
      if (t) {
        // višina tekočine iz oblike stožca (prisekani stožec od dna do vratu)
        const wAt = (y) => bw - ((yB - y) / (yB - yN)) * (bw - nw);
        const hAt = (V) => {
          let y = yB, acc = 0;
          while (acc < V && y > yN) acc += Math.PI * (wAt(y - 0.25) / S / 2) ** 2 * (0.25 / S), (y -= 0.25);
          return y;
        };
        const foam = Math.min(B.pena, 120);
        liqTop = hAt(t.V);
        s("path", { d: `M${fx - wAt(liqTop) / 2},${liqTop} H${fx + wAt(liqTop) / 2} L${x0 + bw - 2},${yB - 3} Q${x0 + bw},${yB} ${x0 + bw - 4},${yB} H${x0 + 4} Q${x0},${yB} ${x0 + 2},${yB - 3} Z`, fill: liqCol, class: "lab-ek-liq" }, gD);
        s("path", { d: `M${fx - wAt(liqTop) / 2 + 0.5},${liqTop - 1.2} Q${fx},${liqTop + 1.2} ${fx + wAt(liqTop) / 2 - 0.5},${liqTop - 1.2}`, class: "lab-ek-menisk" }, gD);
        if (foam > 2) {
          const yf = Math.max(yB - hh, hAt(t.V + foam));
          s("path", { d: `M${fx - wAt(yf) / 2},${yf} Q${fx},${yf - 4} ${fx + wAt(yf) / 2},${yf} L${fx + wAt(liqTop) / 2},${liqTop} H${fx - wAt(liqTop) / 2} Z`, class: "lab-ek-foam" }, gD);
          for (let i = 0; i < Math.min(60, foam * 1.2); i++) {
            const q = (i * 0.618) % 1, y = yf + 2 + ((i * 0.377) % 1) * (liqTop - yf - 2), w = wAt(y) - 4;
            s("circle", { cx: fx - w / 2 + q * w, cy: y, r: 1 + ((i * 0.29) % 1) * 1.6, class: "lab-ek-foam-b" }, gD);
          }
        }
        if (B.prelito) {
          const d = `M${fx + nw / 2 - 1},${yB - hh - 2} q9,4 10,${hh - 8} q6,6 22,6`;
          s("path", { d, class: "lab-ek-spill-rob" }, gD);
          s("path", { d, class: "lab-ek-spill" }, gD);
        }
      }
      kos(fx, liqTop, bw * 0.7);
      s("path", { d: body, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gD);
      if (t && B.kos && B.kos.m > 1e-6) povecavaKis(54, 58, 44, liqCol);
      s("path", { d: `M${fx - nw / 2 + 3},${yB - hh + 4} V${yN + 2} L${x0 + 8},${yB - 10}`, class: "lab-ek-hl-line" }, gD);
      label(gD, 4, yB + 12, "erlenmajerica 100 mL", "lab-ek-miza", "start");
      // zamašek s cevko in sondo termometra
      if (t && B.brizga) {
        s("path", { d: `M${fx - nw / 2 - 1.5},${yB - hh - 6} H${fx + nw / 2 + 1.5} L${fx + nw / 2 - 1},${yB - hh + 10} H${fx - nw / 2 + 1} Z`, fill: "#8b5e3c" }, gD);
        const sy = 112;
        s("path", { d: `M${fx + 3},${yB - hh + 6} V${sy} H${108}`, class: "lab-ek-cevka" }, gD);
        brizga(sy);
      }
      if (t) {
        s("line", { x1: fx - 3, y1: yB - hh - 30, x2: fx - 3, y2: yB - 4, class: "lab-ek-sonda", "stroke-width": 2.2, "stroke-linecap": "round" }, gD);
        s("path", { d: `M${fx - 3},${yB - hh - 30} q0,-10 -14,-14`, class: "lab-top-cable" }, gD);
      }
    } else {
      // čaša 100 mL (Ø 5 cm × 7 cm), 20 mL raztopine = 1 cm
      const bw = 5 * S, hh = 7 * S, x0 = fx - bw / 2;
      liqTop = yB - 2 - (t ? t.V / (Math.PI * 2.5 * 2.5) : 0) * S;
      tekocina(gD, svg, x0 + 1.5, liqTop, bw - 3, yB - 1.5 - liqTop, liqCol, { rx: 3 });
      kos(fx, liqTop, bw * 0.8, true);
      steklo(gD, svg, x0, yB - hh, bw, hh, { rx: 3 });
      label(gD, 4, yB + 12, "čaša 100 mL", "lab-ek-miza", "start");
      if (t) povecava(250, 136, 104, liqCol);
      if (t) {
        s("line", { x1: fx + 12, y1: yB - hh - 24, x2: fx + 12, y2: yB - 4, class: "lab-ek-sonda", "stroke-width": 2.2, "stroke-linecap": "round" }, gD);
        s("path", { d: `M${fx + 12},${yB - hh - 24} q0,-10 -14,-14`, class: "lab-top-cable" }, gD);
      }
    }
    if (!B.ocala) label(gD, 150, 14, "brez zaščitnih očal", "lab-warn");
    if (speed > 1) label(gD, 340, 14, `čas teče ×${speed}`, "lab-warn small");
    s("path", { d: `M${340},${H - 8} v-4 h${5 * S} v4`, class: "lab-scale lab-ek-mizacrta" }, gD);
    label(gD, 340 + 2.5 * S, H - 15, "5 cm", "lab-ek-miza");
    P.commit();
    svg.setAttribute("aria-label", `${t ? `${RAZTOPINE_K[t.id].name} ${cFmt(t.c)} mol/L` : "Prazna posoda"}${B.kos ? `, v njej ${KOVINE[B.kos.kovina].name} (${OBLIKE[B.kos.oblika].name}), mehurčki: ${["ni", "posamezni", "zmerno", "živahno", "burno"][B.mehurcki()]}${B.prevleka() > 0.3 ? ", kovina je prevlečena" : ""}` : ""}${B.brizga && t ? `, v brizgi ${B.odcitekBrizge().text.replace(".", ",")} mL` : ""}.`);
  }
  // Kovina v posodi: trak (pri Mg ob burni reakciji priplava na gladino), granule ali prah; prevleka po izpodrivanju.
  function kos(x, yTop, w, casa = false) {
    const k = B.kos;
    if (!k || k.m <= 1e-6) return;
    const f = Math.max(0.15, (k.m / k.m0) ** 0.5), m = B.mehurcki(), pr = B.prevleka(), ion = B.tek ? RAZTOPINE_K[B.tek.id].ion : null;
    const over = pr > 0.02 && ion ? { fill: PREVLEKA[ion], opacity: (0.95 * pr).toFixed(2) } : null;
    const parts = [];
    if (k.oblika === "trak") {
      if (casa) {
        // trak 1 cm × 8 cm, naslonjen na steno čaše; prevleka le na potopljenem delu
        const wS = 1 * S, x0 = x + 2, y1 = yB - 3, L = 8 * S, y0 = y1 - L;
        s("rect", { x: x0, y: y0, width: wS, height: L * f + (1 - f) * 0, fill: u(svg, `m-${k.kovina}`), stroke: "#555b62", "stroke-width": 0.4, transform: `rotate(-12 ${x0} ${y1})` }, gD);
        if (over) s("rect", { x: x0, y: yTop - 1, width: wS, height: y1 - yTop + 1, ...over, transform: `rotate(-12 ${x0} ${y1})` }, gD);
        if (pr > 0.4 && ion === "Ag") for (let i = 0; i < 6; i++) s("path", { d: `M${x0 + 2 + i * 1.2},${yTop + 3 + (i % 3) * 2} l-3,-${3 + (i % 2) * 2} M${x0 + 2 + i * 1.2},${yTop + 3 + (i % 3) * 2} l3,-${2 + (i % 3)}`, stroke: "#e8ecef", "stroke-width": 0.8, transform: `rotate(-12 ${x0} ${y1})` }, gD);
        if (m > 0) mehurcki(P.g, { x: x0 + wS / 2, w: wS, y0: y1 - 2, y1: yTop + 1, n: [0, 2, 5, 9, 14][m], r: [0.6, 1.2], v: 15 * S });
        return;
      }
      // magnezijev trak mehurčki dvignejo s dna (ocena), sicer leži na dnu
      const yS = k.kovina === "Mg" && m >= 3 ? yTop + (yB - yTop) * 0.35 : yB - 3;
      const L = 5 * S * f;
      s("path", { d: `M${x - L / 2},${yS} q${L / 4},-3 ${L / 2},0 t${L / 2},0`, fill: "none", stroke: u(svg, `m-${k.kovina}`), "stroke-width": 2.6, "stroke-linecap": "round" }, gD);
      if (over) s("path", { d: `M${x - L / 2},${yS} q${L / 4},-3 ${L / 2},0 t${L / 2},0`, fill: "none", stroke: over.fill, opacity: over.opacity, "stroke-width": 2.6 }, gD);
      parts.push([x - L / 2, x + L / 2, yS]);
    } else if (k.oblika === "granule") {
      const n = Math.max(1, Math.round(6 * f)), yb = yB - 3;
      for (let i = 0; i < n; i++) {
        const gx = x - w / 3 + ((i * 0.61) % 1) * (w / 1.5), r = 2.2 + ((i * 0.37) % 1);
        s("ellipse", { cx: gx, cy: yb - r * 0.8, rx: r * 1.15, ry: r * 0.8, fill: u(svg, `m-${k.kovina}`), stroke: "#4d535a", "stroke-width": 0.4 }, gD);
        if (over) s("ellipse", { cx: gx, cy: yb - r * 0.8, rx: r * 1.15, ry: r * 0.8, ...over }, gD);
        parts.push([gx - r, gx + r, yb - r]);
      }
    } else {
      const yb = yB - 2.5, hP = 1.6 * f + 0.6;
      s("path", { d: `M${x - w / 2.4},${yb} Q${x},${yb - hP * 2} ${x + w / 2.4},${yb} Z`, fill: KOV_BARVE[k.kovina][2], stroke: "#5b6168", "stroke-width": 0.3 }, gD);
      if (over) s("path", { d: `M${x - w / 2.4},${yb} Q${x},${yb - hP * 2} ${x + w / 2.4},${yb} Z`, ...over }, gD);
      parts.push([x - w / 2.6, x + w / 2.6, yb - hP]);
    }
    if (m >= 3) for (let i = 0; i < (m >= 4 ? 18 : 9); i++) s("circle", { cx: x - w / 2 + ((i * 0.618) % 1) * w, cy: yTop - 0.5 - ((i * 0.37) % 1) * 1.5, r: 0.8 + ((i * 0.29) % 1), class: "lab-ek-foam-b" }, gD); // pena na gladini
    if (m > 0) for (const [a, b, y] of parts) mehurcki(P.g, { x: (a + b) / 2, w: Math.max(3, b - a), y0: y, y1: yTop + 1, n: Math.ceil([0, 1, 3, 6, 12][m] / Math.max(1, parts.length / 2)), r: m >= 4 ? [0.7, 1.8] : [0.5, 1.2], v: 15 * S, key: Math.round(a) });
  }
  // Povečava (~4×) kovine v raztopini soli: prevleka raste na potopljenem delu (gobast baker, iglice srebra, temno železo ali cink).
  function povecava(cx, cy, r, liqCol) {
    const id = `${svg.uid}-pov`, k = B.kos, yl = cy - r * 0.35;
    s("circle", { cx, cy, r }, s("clipPath", { id }, s("defs", {}, gD)));
    const c = s("g", { "clip-path": `url(#${id})` }, gD);
    s("rect", { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r, class: "lab-sil-lupa-bg" }, c);
    s("rect", { x: cx - r, y: yl, width: 2 * r, height: 2 * r, fill: liqCol }, c);
    s("path", { d: `M${cx - r},${yl - 5} Q${cx - r * 0.7},${yl} ${cx - r * 0.4},${yl} H${cx + r}`, class: "lab-ek-menisk" }, c);
    if (k && k.m > 1e-6) {
      const pr = B.prevleka(), ion = RAZTOPINE_K[B.tek.id].ion, m = B.mehurcki();
      const pseudo = (i, a) => ((Math.sin(i * 12.9898 + a * 78.233) * 43758.5453) % 1 + 1) % 1;
      const drawCoat = (x0, y0, w, hh) => {
        if (pr < 0.02 || !PREVLEKA[ion]) return;
        s("rect", { x: x0, y: y0, width: w, height: hh, fill: PREVLEKA[ion], opacity: (0.85 * pr).toFixed(2) }, c);
        const n = Math.round(40 * pr);
        for (let i = 0; i < n; i++) {
          const px = x0 + pseudo(i, 1) * w, py = y0 + pseudo(i, 2) * hh;
          if (ion === "Ag") s("path", { d: `M${px},${py} l${-4 - 6 * pseudo(i, 3)},${-3 - 5 * pseudo(i, 4)} M${px},${py} l${4 + 5 * pseudo(i, 5)},${-2 - 6 * pseudo(i, 6)} M${px},${py} l${-1},${-6 - 6 * pseudo(i, 7)}`, stroke: "#eef1f4", "stroke-width": 1.1, "stroke-linecap": "round" }, c);
          else s("circle", { cx: px, cy: py, r: 1.4 + 2.2 * pseudo(i, 3), fill: ion === "Cu" ? (i % 2 ? "#b8643a" : "#7d3a1d") : i % 2 ? "#1d1e20" : "#4e555c", opacity: 0.9 }, c);
        }
      };
      if (k.oblika === "trak") {
        const w = 52, x0 = cx - w / 2;
        s("rect", { x: x0, y: cy - r, width: w, height: 2 * r, fill: u(svg, `m-${k.kovina}`) }, c);
        s("rect", { x: x0 + w * 0.3, y: cy - r, width: 3, height: 2 * r, fill: "rgb(255 255 255 / 0.35)" }, c);
        drawCoat(x0, yl, w, cy + r - yl);
        if (m > 0) mehurcki(P.krog(cx, cy, r), { x: cx, w: w + 10, y0: cy + r, y1: yl + 3, n: [0, 3, 6, 10, 16][m], r: [1.5, 3.5], v: 15 * S * 4, key: 7 });
      } else {
        const n = k.oblika === "prah" ? 26 : 5, yb = cy + r * 0.85;
        for (let i = 0; i < n; i++) {
          const rr = k.oblika === "prah" ? 3 + 2 * pseudo(i, 9) : 14 + 6 * pseudo(i, 9), gx = cx - r * 0.7 + pseudo(i, 8) * r * 1.4, gy = yb - pseudo(i, 10) * (k.oblika === "prah" ? 14 : 8) - rr * 0.6;
          s("ellipse", { cx: gx, cy: gy, rx: rr * 1.15, ry: rr * 0.8, fill: u(svg, `m-${k.kovina}`), stroke: "#4d535a", "stroke-width": 0.5 }, c);
          if (pr > 0.02 && PREVLEKA[ion]) s("ellipse", { cx: gx, cy: gy, rx: rr * 1.15, ry: rr * 0.8, fill: PREVLEKA[ion], opacity: (0.85 * pr).toFixed(2) }, c);
        }
        if (m > 0) mehurcki(P.krog(cx, cy, r), { x: cx, w: r * 1.2, y0: yb - 10, y1: yl + 3, n: [0, 3, 6, 10, 16][m], r: [1.5, 3.5], v: 15 * S * 4, key: 8 });
      }
    }
    s("circle", { cx, cy, r, class: "lab-sil-lupa-frame" }, gD);
    s("line", { x1: cx - r * 0.72, y1: cy + r * 0.72, x2: cx - r * 1.1, y2: cy + r * 1.1, stroke: "#4a4f55", "stroke-width": 7, "stroke-linecap": "round" }, gD);
    label(gD, cx, cy - r - 8, "povečava ~4× (kovina v raztopini)", "tick small");
  }
  // Povečava (~4×, 1 cm = 32 enot) dna erlenmajerice: kovina in mehurčki vodika, ki so v pravem merilu komaj vidni.
  // Mehurčki vodika ob kovini merijo 0,1–1 mm in se dvigajo s ~4 cm/s (ocena po Stokesovem zakonu).
  function povecavaKis(cx, cy, r, liqCol) {
    const id = `${svg.uid}-povk`, k = B.kos, m = B.mehurcki(), M = 4 * S, yDno = cy + r * 0.6;
    const pseudo = (i, a) => ((Math.sin(i * 12.9898 + a * 78.233) * 43758.5453) % 1 + 1) % 1;
    s("circle", { cx, cy, r }, s("clipPath", { id }, s("defs", {}, gD)));
    const c = s("g", { "clip-path": `url(#${id})` }, gD);
    s("rect", { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r, fill: liqCol }, c);
    s("rect", { x: cx - r, y: yDno, width: 2 * r, height: r, fill: u(svg, "steklo"), class: "lab-ek-glass" }, c);
    const f = Math.max(0.15, (k.m / k.m0) ** 0.5), parts = [];
    if (k.oblika === "trak") {
      const L = (2 * r - 12) * Math.min(1, 1.3 * f), yS = k.kovina === "Mg" && m >= 3 ? cy - r * 0.15 : yDno - 3;
      s("path", { d: `M${cx - L / 2},${yS} q${L / 4},-7 ${L / 2},0 t${L / 2},0`, fill: "none", stroke: u(svg, `m-${k.kovina}`), "stroke-width": 4.5, "stroke-linecap": "round" }, c);
      // mehurčki, ki se še držijo traku
      for (let i = 0; i < [0, 3, 7, 12, 18][m]; i++) {
        const q = pseudo(i, 11), x = cx - L / 2 + q * L, rr = 0.7 + 1.1 * pseudo(i, 12);
        s("circle", { cx: x.toFixed(1), cy: (yS - 3.5 * Math.sin(2 * Math.PI * q) + (i % 2 ? -2.6 : 2.6) - (i % 2 ? rr : -rr) * 0.6).toFixed(1), r: rr.toFixed(2), fill: u(svg, "mehur"), class: "lab-ek-bubst" }, c);
      }
      parts.push([cx - L / 2, cx + L / 2, yS - 2]);
    } else {
      const prah = k.oblika === "prah", n = prah ? Math.max(6, Math.round(34 * f)) : Math.max(1, Math.round(4 * f));
      for (let i = 0; i < n; i++) {
        const rr = prah ? 1.4 + 1.2 * pseudo(i, 9) : (6 + 3 * pseudo(i, 9)) * Math.max(0.5, f), gx = cx - r * 0.6 + pseudo(i, 8) * r * 1.2, gy = yDno - rr * 0.7 - (prah ? pseudo(i, 10) * 5 * f : 0);
        s("ellipse", { cx: gx, cy: gy, rx: rr * 1.15, ry: rr * 0.8, fill: u(svg, `m-${k.kovina}`), stroke: "#4d535a", "stroke-width": 0.4 }, c);
        if (!prah) parts.push([gx - rr, gx + rr, gy - rr * 0.6]);
      }
      if (prah) parts.push([cx - r * 0.6, cx + r * 0.6, yDno - 4]);
    }
    const pc = m > 0 ? P.krog(cx, cy, r) : null;
    if (m > 0) for (const [a, b, y] of parts) mehurcki(pc, { x: (a + b) / 2, w: b - a, y0: y, y1: cy - r, n: Math.ceil([0, 3, 6, 10, 16][m] / Math.max(1, parts.length / 2)), r: m >= 4 ? [1, 2.6] : [0.7, 1.8], v: 4 * M, key: 9 + Math.round(a) });
    s("circle", { cx, cy, r, class: "lab-sil-lupa-frame" }, gD);
    label(gD, 4, cy - r - 6, "kovina, povečano ~4×", "tick small", "start");
  }
  // Plinska brizga 100 mL: valj 15 cm za 100 mL, bat in drog, prijemalo na stojalu; povečava ob robu bata.
  function brizga(sy) {
    const x0 = 112, L = 15 * S, d = 3.4 * S, V = B.batIzpadel ? 0 : Math.min(B.Vbrizga(), POSODA_K.izpade), xp = x0 + 6 + (V / 100) * L;
    // stojalo za brizgo: palica za valjem, prijemalo objame valj
    stojalo(gD, svg, 236, 40, yB, 70);
    s("rect", { x: 236 - 5, y: sy - d / 2 - 9, width: 10, height: 8, rx: 1.5, fill: "#5a626b" }, gD);
    s("rect", { x: x0 - 6, y: sy - 3, width: 8, height: 6, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gD);
    // bat in drog
    if (!B.batIzpadel) {
      s("rect", { x: xp, y: sy - d / 2 + 2, width: 5, height: d - 4, rx: 1, fill: "#3b3f45", stroke: "#8a929b", "stroke-width": 0.5 }, gD);
      s("rect", { x: xp + 5, y: sy - 2.5, width: L + 10, height: 5, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gD);
      s("rect", { x: xp + L + 12, y: sy - d / 2 - 2, width: 4, height: d + 4, rx: 1.5, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gD);
    } else s("rect", { x: 298, y: yB - 6, width: L * 0.6, height: 6, rx: 2, fill: u(svg, "steklo"), class: "lab-ek-glass", transform: `rotate(-6 298 ${yB})` }, gD);
    s("rect", { x: x0, y: sy - d / 2, width: L + 8, height: d, rx: 3, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gD);
    s("rect", { x: x0 + 2, y: sy - d / 2 + 3, width: L + 4, height: 2.5, class: "lab-ek-hl" }, gD);
    s("path", { d: `M${236 - 6},${sy - d / 2 - 2} h12 M${236 - 6},${sy + d / 2 + 2} h12`, stroke: "#5a626b", "stroke-width": 3, "stroke-linecap": "round" }, gD);
    for (let v = 0; v <= 100; v += 2) {
      const x = x0 + 6 + (v / 100) * L, Lt = v % 10 === 0 ? 7 : 4;
      s("line", { x1: x, y1: sy + d / 2 - Lt, x2: x, y2: sy + d / 2, class: "lab-ek-tick" }, gD);
      if (v % 20 === 0) label(gD, x, sy + d / 2 + 8, String(v), "lab-ek-num");
    }
    label(gD, x0 + L / 2, sy - d / 2 - 8, "plinska brizga 100 mL", "tick small");
    // povečava ob robu bata (±4 mL)
    const lx = 150, ly = 168, lw = 236, lh = 62, id = `${svg.uid}-lupab`, ppu = lw / 9, vc = B.batIzpadel ? 0 : clamp(V + B.brizgaKal, 0, 100), X = (q) => lx + lw / 2 + (q - vc) * ppu;
    s("rect", { x: lx, y: ly, width: lw, height: lh, rx: 8 }, s("clipPath", { id }, s("defs", {}, gD)));
    s("rect", { x: lx, y: ly, width: lw, height: lh, rx: 8, class: "lab-sil-lupa-bg" }, gD);
    const c = s("g", { "clip-path": `url(#${id})` }, gD);
    s("rect", { x: lx, y: ly + 8, width: lw, height: lh - 16, fill: u(svg, "steklo") }, c);
    if (!B.batIzpadel) {
      s("rect", { x: X(vc), y: ly + 24, width: 26, height: lh - 34, rx: 2, fill: "#3b3f45", stroke: "#8a929b", "stroke-width": 1 }, c);
      s("line", { x1: X(vc), y1: ly + 20, x2: X(vc), y2: ly + lh - 8, class: "lab-tit-sight" }, c);
    }
    for (let n = Math.ceil(vc - 5); n <= Math.floor(vc + 5); n++) {
      if (n < 0 || n > 100) continue;
      const x = X(n), big = n % 10 === 0, mid = n % 5 === 0;
      s("line", { x1: x, y1: ly + lh - 8, x2: x, y2: ly + lh - 8 - (big ? 14 : mid ? 10 : 6), class: "lab-sil-tick" }, c);
      if (mid) label(c, x, ly + 15, String(n), "tick b");
    }
    s("rect", { x: lx, y: ly, width: lw, height: lh, rx: 8, class: "lab-sil-lupa-frame" }, gD);
    label(gD, lx + lw / 2, ly + lh + 11, "povečano: rob bata pokaže prostornino", "tick small lab-ek-halo-bg");
  }
  syncC();
  drawGrid();
  redraw();
  draw();
}
