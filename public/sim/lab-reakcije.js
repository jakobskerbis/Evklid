// Virtualni laboratorij, kemijske reakcije: hitrost reakcije (lab-hitrost), energija pri reakcijah (lab-energija),
// plamenska reakcija (lab-plamenska). Modeli: lab-model-reakcije.js (brez DOM). CSS: predpona lab-rk-.
// Risbe so v stalnem merilu (merilna črta); steklo, mehurčki, stojalo in prijemalo so iz lab-elektrokemija.js.
// Mehurčki in plamen so v ločeni plasti (plastMehurckov), da animacija teče gladko, čeprav se risba obnovi 10-krat na sekundo.
import { h, s, svgBox, select, segmented, button, toggle, slider, layout, label, stage as stageBox, controls as controlsBox, texBlock } from "./kit.js";
import { ticker, lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed, tex, en, rez } from "./lab.js";
import { gradienti, plastMehurckov, steklo, tekocina, mehurcki, stojalo, prijemalo, ura } from "./lab-elektrokemija.js";
import {
  MarmorBench, MagnezijBench, TiosulfatBench, PeroksidBench, MARMOR, MARMOR_OBLIKE, MARMOR_MASE, KONC_HCL, MG_TRAK, TIO, TIO_VOLUMNI, KATALIZATORJI, PEROKSID_V,
  BRIZGA, KalorimeterBench, TRDNE, DH, TERMOMETRI, ekstrapolacija, entalpija,
  PlamenBench, IONI, BARVE_PLAMENA, valovRgb, cmf, kobalt, energijaFotona, E_NAB, POENOSTAVITVE_REAKCIJE,
} from "./lab-model-reakcije.js";

const seme = () => (Math.random() * 2 ** 31) | 0;
const nb = " ";
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
const cFmt = (c) => num(c, c < 1 ? 1 : 0).replace(/,0$/, "");
const hitrostSeg = (opts, value, onChange) => row("hitrost časa", seg("hitrost časa", opts.map((v) => [String(v), `×${v}`]), String(value), (v) => onChange(+v)));
const pseudo = (i, a) => ((Math.sin(i * 12.9898 + a * 78.233) * 43758.5453) % 1 + 1) % 1;
function os(max) {
  const m = Math.max(max, 1e-9) * 1.08;
  const e = 10 ** Math.floor(Math.log10(m / 5));
  for (const k of [1, 2, 5, 10, 20]) {
    const st = k * e;
    if (m / st <= 6) return { top: Math.ceil(m / st - 1e-9) * st, step: st };
  }
  return { top: m, step: m / 5 };
}
const serije = (map) => [...map.entries()].map(([name, pts], i) => ({ id: name, pts, cls: "abc"[i % 3], shape: i % 6 < 3 ? "o" : "^", label: name }));

// ---------------------------------------------------------------- skupni deli risbe
const u = (svg, id) => `url(#${svg.uid}-${id})`;
function grad(svg) {
  const d = gradienti(svg);
  const lin = (id, stops, { x2 = 1, y2 = 0 } = {}) => {
    const g = s("linearGradient", { id: `${svg.uid}-${id}`, x1: 0, y1: 0, x2, y2 }, d);
    for (const [o, c, a = 1] of stops) s("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g);
  };
  const rad = (id, stops, { fx = 0.5, fy = 0.5 } = {}) => {
    const g = s("radialGradient", { id: `${svg.uid}-${id}`, cx: 0.5, cy: 0.5, r: 0.5, fx, fy }, d);
    for (const [o, c, a = 1] of stops) s("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g);
  };
  lin("stiropor", [[0, "#cfd3d6"], [0.12, "#f7f8f8"], [0.5, "#ffffff"], [0.85, "#e9ebec"], [1, "#c2c7cb"]]);
  lin("kopel", [[0, "#7fb3d9", 0.45], [1, "#4f8fbf", 0.55]], { x2: 0, y2: 1 });
  lin("posoda", [[0, "#dfe6ec", 0.55], [0.1, "#ffffff", 0.7], [0.5, "#f4f7f9", 0.35], [1, "#c9d2da", 0.6]]);
  lin("medenina", [[0, "#7a5a1e"], [0.35, "#f2d48a"], [0.6, "#c9a24a"], [1, "#6d4f17"]]);
  lin("jeklo", [[0, "#6e767e"], [0.45, "#e8ebee"], [1, "#59616a"]]);
  lin("zaslon", [[0, "#b9c4a2"], [1, "#a9b591"]], { x2: 0, y2: 1 });
  rad("marmor", [[0, "#ffffff"], [0.6, "#e9e6df"], [1, "#b9b3a6"]], { fx: 0.35, fy: 0.3 });
  rad("krompir", [[0, "#fbf3c8"], [0.7, "#ecdc94"], [1, "#c8b46a"]], { fx: 0.35, fy: 0.3 });
  rad("kuhan", [[0, "#f3ead0"], [0.7, "#d9c99a"], [1, "#b2a170"]], { fx: 0.35, fy: 0.3 });
  rad("jetra", [[0, "#9a3a35"], [0.7, "#6d1f1d"], [1, "#4a1210"]], { fx: 0.35, fy: 0.3 });
  rad("jetrak", [[0, "#8d7466"], [0.7, "#6e5547"], [1, "#4e3a30"]], { fx: 0.35, fy: 0.3 });
  rad("sij", [[0, "#ffffff", 0.9], [1, "#ffffff", 0]]);
  return d;
}
// Erlenmajerica 100 mL: dno Ø 6,4 cm, vrat Ø 2,2 cm, višina 10,5 cm (ISO 1773, kot v lab-kovine). Vrne geometrijo; steklo nariše .steklo().
function erlen(g, svg, fx, yB, S, { V = 0, fill = "rgb(205 226 240 / 0.6)", pena = 0, prelito = false } = {}) {
  const bw = 6.4 * S, nw = 2.2 * S, hh = 10.5 * S, nh = 2.6 * S, x0 = fx - bw / 2, yN = yB - hh + nh, top = yB - hh;
  const body = `M${fx - nw / 2},${top} V${yN} L${x0 + 2},${yB - 3} Q${x0},${yB} ${x0 + 4},${yB} H${x0 + bw - 4} Q${x0 + bw},${yB} ${x0 + bw - 2},${yB - 3} L${fx + nw / 2},${yN} V${top}`;
  const wAt = (y) => (y < yN ? nw : bw - ((yB - y) / (yB - yN)) * (bw - nw));
  const hAt = (Vm) => {
    let y = yB, acc = 0;
    while (acc < Vm && y > top) acc += Math.PI * (wAt(y - 0.25) / S / 2) ** 2 * (0.25 / S), (y -= 0.25);
    return y;
  };
  let liqTop = yB;
  if (V > 0) {
    liqTop = hAt(V);
    const wl = wAt(liqTop);
    s("path", { d: `M${fx - wl / 2},${liqTop} H${fx + wl / 2} L${x0 + bw - 2},${yB - 3} Q${x0 + bw},${yB} ${x0 + bw - 4},${yB} H${x0 + 4} Q${x0},${yB} ${x0 + 2},${yB - 3} Z`, fill, class: "lab-ek-liq" }, g);
    s("path", { d: `M${fx - wl / 2 + 0.5},${liqTop - 1.2} Q${fx},${liqTop + 1.2} ${fx + wl / 2 - 0.5},${liqTop - 1.2}`, class: "lab-ek-menisk" }, g);
    const foam = Math.min(pena, 120);
    if (foam > 2) {
      const yf = Math.max(top, hAt(V + foam));
      s("path", { d: `M${fx - wAt(yf) / 2},${yf} Q${fx},${yf - 4} ${fx + wAt(yf) / 2},${yf} L${fx + wl / 2},${liqTop} H${fx - wl / 2} Z`, class: "lab-ek-foam" }, g);
      for (let i = 0; i < Math.min(50, foam); i++) {
        const q = pseudo(i, 1), y = yf + 2 + pseudo(i, 2) * (liqTop - yf - 2), w = wAt(y) - 4;
        s("circle", { cx: fx - w / 2 + q * w, cy: y, r: 1 + pseudo(i, 3) * 1.6, class: "lab-ek-foam-b" }, g);
      }
    }
    if (prelito) {
      const d = `M${fx + nw / 2 - 1},${top - 2} q9,4 10,${hh - 8} q6,6 22,6`;
      s("path", { d, class: "lab-ek-spill-rob" }, g);
      s("path", { d, class: "lab-ek-spill" }, g);
    }
  }
  return {
    liqTop, wAt, top, nw, bw, x0, yN,
    steklo() {
      s("path", { d: body, fill: u(svg, "steklo"), class: "lab-ek-glass" }, g);
      s("path", { d: `M${fx - nw / 2 + 3},${top + 4} V${yN + 2} L${x0 + 8},${yB - 10}`, class: "lab-ek-hl-line" }, g);
      s("path", { d: `M${fx - nw / 2 - 1.4},${top} h${nw + 2.8}`, stroke: "#9fb2c1", "stroke-width": 2.4, "stroke-linecap": "round" }, g); // zavihan rob vratu
    },
  };
}
// Zaslon digitalnega instrumenta v risbi.
function zaslon(g, svg, x, y, w, hh, text, unit = "") {
  s("rect", { x, y, width: w, height: hh, rx: 2, fill: u(svg, "zaslon"), stroke: "#6f7a5c", "stroke-width": 0.6 }, g);
  label(g, x + w - (unit ? 16 : 4), y + hh / 2 + 0.5, String(text).replace(".", ","), "lab-rk-lcd", "end").setAttribute("style", `font-size:${(hh * 0.62).toFixed(1)}px`);
  if (unit) label(g, x + w - 3, y + hh / 2 + 1, unit, "lab-rk-lcdu", "end");
}
// Digitalna tehtnica 0,01 g: ohišje 20 × 6 cm, jeklena tehtalna plošča Ø 12 cm.
function tehtnica(g, svg, cx, yB, S, text) {
  const w = 20 * S, x = cx - w / 2;
  s("rect", { x, y: yB - 4.2 * S, width: w, height: 4.2 * S, rx: 6, fill: u(svg, "ohisje") }, g);
  s("rect", { x: cx - 6 * S, y: yB - 4.9 * S, width: 12 * S, height: 0.7 * S, rx: 2, fill: u(svg, "jeklo") }, g);
  zaslon(g, svg, x + w * 0.56, yB - 3.4 * S, w * 0.36, 2.2 * S, text, "g");
  s("circle", { cx: x + w * 0.12, cy: yB - 2.3 * S, r: 4, fill: "#c62828" }, g);
  label(g, x + w * 0.24, yB - 2.3 * S, "TARA", "lab-rk-panel", "start");
  return yB - 4.9 * S;
}
// Štoparica (digitalna, na mizi).
function stoparica(g, svg, x, y, text, tece) {
  s("rect", { x, y, width: 64, height: 40, rx: 10, fill: "#2f6fb3", stroke: "#1d4f86", "stroke-width": 1 }, g);
  s("rect", { x: x + 26, y: y - 5, width: 12, height: 6, rx: 2, fill: "#9aa3ad" }, g);
  zaslon(g, svg, x + 6, y + 8, 52, 18, text);
  label(g, x + 32, y + 33, tece ? "teče" : "stoji", "lab-rk-panel w");
}
// Plinska brizga 100 mL na stojalu (valj 15 cm), bat pri prostornini V; cevka iz zamaška bučke.
function brizgaRisba(g, svg, { x0, sy, S, V, izpadel, yB, fromX, fromY }) {
  const L = 15 * S, d = 3.4 * S, xp = x0 + 6 + (Math.min(V, BRIZGA.izpade) / 100) * L, xr = x0 + L * 0.95;
  stojalo(g, svg, xr, sy - 50, yB, 70);
  s("rect", { x: xr - 5, y: sy - d / 2 - 9, width: 10, height: 8, rx: 1.5, fill: "#5a626b" }, g);
  s("path", { d: `M${fromX},${fromY} V${sy} H${x0 - 2}`, class: "lab-ek-cevka" }, g);
  s("rect", { x: x0 - 6, y: sy - 3, width: 8, height: 6, fill: u(svg, "steklo"), class: "lab-ek-glass" }, g);
  if (!izpadel) {
    s("rect", { x: xp, y: sy - d / 2 + 2, width: 5, height: d - 4, rx: 1, fill: "#3b3f45", stroke: "#8a929b", "stroke-width": 0.5 }, g);
    s("rect", { x: xp + 5, y: sy - 2.5, width: L + 10, height: 5, fill: u(svg, "steklo"), class: "lab-ek-glass" }, g);
    s("rect", { x: xp + L + 12, y: sy - d / 2 - 2, width: 4, height: d + 4, rx: 1.5, fill: u(svg, "steklo"), class: "lab-ek-glass" }, g);
  } else s("rect", { x: x0 + L - 10, y: yB - 6, width: L * 0.6, height: 6, rx: 2, fill: u(svg, "steklo"), class: "lab-ek-glass", transform: `rotate(-6 ${x0 + L} ${yB})` }, g);
  s("rect", { x: x0, y: sy - d / 2, width: L + 8, height: d, rx: 3, fill: u(svg, "steklo"), class: "lab-ek-glass" }, g);
  s("rect", { x: x0 + 2, y: sy - d / 2 + 3, width: L + 4, height: 2.5, class: "lab-ek-hl" }, g);
  s("path", { d: `M${xr - 6},${sy - d / 2 - 2} h12 M${xr - 6},${sy + d / 2 + 2} h12`, stroke: "#5a626b", "stroke-width": 3, "stroke-linecap": "round" }, g);
  for (let v = 0; v <= 100; v += 2) {
    const x = x0 + 6 + (v / 100) * L, Lt = v % 10 === 0 ? 7 : 4;
    s("line", { x1: x, y1: sy + d / 2 - Lt, x2: x, y2: sy + d / 2, class: "lab-ek-tick" }, g);
    if (v % 20 === 0) label(g, x, sy + d / 2 + 8, String(v), "lab-ek-num");
  }
  label(g, x0 + L / 2, sy - d / 2 - 8, "plinska brizga 100 mL", "tick small");
}
// Vodna kopel: plastična posoda z vodo (presek), w × hh v enotah risbe.
function kopel(g, svg, x, yB, w, hh, T) {
  s("rect", { x, y: yB - hh, width: w, height: hh, rx: 4, fill: u(svg, "posoda"), stroke: "#8fa2b2", "stroke-width": 1 }, g);
  s("rect", { x: x + 2, y: yB - hh * 0.72, width: w - 4, height: hh * 0.72 - 2, rx: 3, fill: u(svg, "kopel") }, g);
  s("path", { d: `M${x + 2},${yB - hh * 0.72} h${w - 4}`, stroke: "rgb(255 255 255 / 0.7)", "stroke-width": 1 }, g);
  label(g, x + w / 2, yB + 9, `vodna kopel ${num(T, 0)}${nb}°C`, "lab-ek-miza small");
  return yB - hh * 0.72;
}
function merilo(g, x, y, S, cm = 5) {
  s("path", { d: `M${x},${y} v-4 h${cm * S} v4`, class: "lab-scale lab-ek-mizacrta" }, g);
  label(g, x + (cm * S) / 2, y - 9, `${cm} cm`, "lab-ek-miza");
}
// Vata v vratu bučke.
function vata(g, cx, y, w) {
  for (let i = 0; i < 9; i++) s("ellipse", { cx: cx - w / 2 + 2 + pseudo(i, 4) * (w - 4), cy: y - 3 + pseudo(i, 5) * 9, rx: 3 + pseudo(i, 6) * 2.5, ry: 2.4 + pseudo(i, 7) * 2, class: "lab-rk-vata" }, g);
}
// Zamašek iz gume s cevko.
function zamasek(g, fx, top, nw) {
  s("path", { d: `M${fx - nw / 2 - 1.5},${top - 6} H${fx + nw / 2 + 1.5} L${fx + nw / 2 - 1},${top + 10} H${fx - nw / 2 + 1} Z`, fill: "#7b5236", stroke: "#4e3320", "stroke-width": 0.5 }, g);
}

// ================================================================ 1. hitrost reakcije
const NACINI = [["marmor", "marmor + HCl (masa)"], ["mg", "Mg + HCl (brizga)"], ["tio", "tiosulfat (križ)"], ["h2o2", "H₂O₂ + katalizator"]];
const KAT_OPTS = Object.entries(KATALIZATORJI).map(([k, v]) => [k, v.name]);
export function labHitrost(el, opts = {}) {
  const OS = opts.raven === "os";
  const sd = seme();
  const T = new MarmorBench({ seed: sd }).lab.T; // ena učilnica: vsi štirje poskusi pri isti sobni temperaturi
  const Bs = { marmor: new MarmorBench({ seed: sd, T }), mg: new MagnezijBench({ seed: sd + 1, T }), tio: new TiosulfatBench({ seed: sd + 2, T }), h2o2: new PeroksidBench({ seed: sd + 3, T }) };
  let mode = "marmor", speed = 1, interval = 30, nextAuto = interval, asked = false;
  const W = 400, H = 300, S = 8, yB = 268;
  const svg = svgBox(W, H, "lab-bench lab-ek lab-rk lab-rk-hit");
  grad(svg);
  const gD = s("g", {}, svg);
  const P = plastMehurckov(svg, W, H);
  const log = eventLog();
  const swL = lcd("štoparica"), maL = lcd("tehtnica"), brL = lcd("plinska brizga"), thL = lcd("termometer");
  const meters = h("div", { class: "lab-meters" }); // največ trije merilniki: pripeta risba na telefonu ostane velika
  const said = {};
  const once = (k, text, kind = "warn") => said[k] || ((said[k] = true), log.push(text, kind));
  // stanje po načinih: oznaka poskusa, serije za graf
  const st = { marmor: { run: null, n: 0, ser: new Map(), r0: [] }, mg: { run: null, n: 0, ser: new Map(), r0: [] }, tio: { rows: [] }, h2o2: { run: null, n: 0, ser: new Map(), r0: [] } };
  const tabs = {
    marmor: dataTable([{ key: "p", label: "poskus" }, { key: "t", label: "<i>t</i> [s]" }, { key: "m", label: "<i>m</i> [g]" }, { key: "dm", label: "Δ<i>m</i> [g]" }], { empty: "Še ni meritev. Nalij kislino, dodaj marmor, zamaši z vato in zapisuj maso." }),
    mg: dataTable([{ key: "p", label: "poskus" }, { key: "t", label: "<i>t</i> [s]" }, { key: "V", label: "<i>V</i>(H₂) [mL]" }], { empty: "Še ni meritev. Nalij kislino, spusti trak magnezija v bučko, zamaši in zapisuj prostornino." }),
    tio: dataTable([{ key: "c", label: OS ? "raztopina" : "<i>c</i>(S₂O₃²⁻) [mol/L]" }, { key: "T", label: "<i>T</i> [°C]" }, { key: "t", label: "<i>t</i> [s]" }, ...(OS ? [] : [{ key: "it", label: "1/<i>t</i> [10⁻³ s⁻¹]" }])], { empty: "Še ni meritev. Pripravi raztopino, prilij kislino in ustavi štoparico, ko križa ne vidiš več." }),
    h2o2: dataTable([{ key: "p", label: "poskus" }, { key: "t", label: "<i>t</i> [s]" }, { key: "V", label: "<i>V</i>(O₂) [mL]" }], { empty: "Še ni meritev. Nalij peroksid, dodaj katalizator, zamaši in zapisuj prostornino kisika." }),
  };
  const gPots = {
    marmor: dataGraph({ x: [0, 300], y: [0, 2], xStep: 60, yStep: 0.5, xLabel: "t [s]", yLabel: "Δm [g]", title: "Izguba mase v odvisnosti od časa za več poskusov" }),
    mg: dataGraph({ x: [0, 120], y: [0, 60], xStep: 20, yStep: 10, xLabel: "t [s]", yLabel: "V(H₂) [mL]", title: "Prostornina vodika v odvisnosti od časa za več poskusov" }),
    h2o2: dataGraph({ x: [0, 120], y: [0, 60], xStep: 20, yStep: 10, xLabel: "t [s]", yLabel: "V(O₂) [mL]", title: "Prostornina kisika v odvisnosti od časa za več poskusov" }),
  };
  const gR0s = {
    marmor: dataGraph({ x: [0, 2], y: [0, 1], xStep: 0.5, yStep: 0.2, xLabel: "c(HCl) [mol/L]", yLabel: "r₀ [g/min]", title: "Začetna hitrost izgube mase v odvisnosti od koncentracije kisline" }),
    mg: dataGraph({ x: [0, 2], y: [0, 1], xStep: 0.5, yStep: 0.2, xLabel: "c(HCl) [mol/L]", yLabel: "r₀ [mL/s]", title: "Začetna hitrost nastajanja vodika v odvisnosti od koncentracije kisline" }),
  };
  const gTc = dataGraph({ x: [0, 0.16], y: [0, 50], xStep: 0.04, yStep: 10, xLabel: OS ? "mL zaloge" : "c [mol/L]", yLabel: "1/t [10⁻³ s⁻¹]", title: "Hitrost (1/t) v odvisnosti od koncentracije tiosulfata" });
  const gTT = dataGraph({ x: [15, 55], y: [0, 50], xStep: 5, yStep: 10, xLabel: "T [°C]", yLabel: "1/t [10⁻³ s⁻¹]", title: "Hitrost (1/t) v odvisnosti od temperature", origin: false });
  const calc = h("div", { class: "lab-ek-calc", "aria-live": "polite" });
  const qBox = h("div");

  const goggles = toggle("zaščitna očala", false, (v) => {
    for (const B of Object.values(Bs)) B.ocala = v;
    if (v) log.push("Nadel si si zaščitna očala.", "ok");
  });
  const nacinSeg = seg("poskus", NACINI.map(([k, t]) => [k, t]), mode, (v) => ((mode = v), sync()));
  const kopelSl = slider({ label: "vodna kopel", min: 20, max: 50, step: 5, value: 20, unit: "°C", format: (v) => (v <= 20 ? "sobna temperatura" : `${v} °C`), onInput: (v) => setKopel(v) });
  // (a) marmor
  const mcSel = select({ label: "klorovodikova kislina (40 mL)", options: KONC_HCL.map((c) => [String(c), `${cFmt(c)} mol/L`]), value: "1" });
  const moSel = select({ label: "marmor (CaCO₃)", options: Object.entries(MARMOR_OBLIKE).map(([k, v]) => [k, v.name]), value: "srednji" });
  const mmSel = select({ label: "masa marmorja", options: MARMOR_MASE.map((m) => [String(m), `${m} g`]), value: "5" });
  const vataT = toggle("vata v vratu bučke", true, (v) => ((Bs.marmor.vata = v), log.push(v ? "V vrat bučke si dal kos vate: CO₂ uhaja, kapljice kisline pa ne." : "Bučka je brez vate.", v ? "info" : "warn")));
  const hkratiT = toggle("ob dodatku hkrati zaženi štoparico", true);
  const mNalij = button("Nalij 40 mL kisline v bučko na tehtnici", () => nalij(), "primary small");
  const mDodaj = button("Dodaj marmor (in vato)", () => dodaj(), "primary small");
  // (b) magnezij
  const gcSel = select({ label: "klorovodikova kislina (50 mL)", options: KONC_HCL.map((c) => [String(c), `${cFmt(c)} mol/L`]), value: "1" });
  const glSel = select({ label: "magnezijev trak", options: MG_TRAK.dolzine.map((l) => [String(l), `${l} cm (~${num(l * MG_TRAK.gNaCm, 3)} g)`]), value: "5" });
  const batSeg = row("bat brizge", seg("bat brizge", [["gladek", "gladek (namazan)"], ["zatika", "suh, zatika se"]], "gladek", (v) => setBrizga("zatika", v === "zatika")));
  const zamSeg = row("zamašek", seg("zamašek", [["tesen", "tesen"], ["pusca", "pušča"]], "tesen", (v) => setBrizga("pusca", v === "pusca")));
  const gNalij = button("Nalij 50 mL kisline v erlenmajerico", () => nalij(), "primary small");
  const gDodaj = button("Spusti trak v kislino in zamaši", () => dodaj(), "primary small");
  // (c) tiosulfat
  const tvSel = select({ label: "raztopina Na₂S₂O₃ (40 g/L) + voda do 50 mL", options: TIO_VOLUMNI.map((V) => [String(V), `${V} mL raztopine + ${50 - V} mL vode${OS ? "" : ` (${num((TIO.c0 * V) / 50, 3)} mol/L)`}`]), value: "50" });
  const tPrip = button("Pripravi 50 mL v bučki na listu s križem", () => nalij(), "primary small");
  const tZlij = button("Prilij 5 mL HCl (2 mol/L) in zaženi štoparico", () => dodaj(), "primary small");
  const tStop = button("Križa ne vidim več – ustavi štoparico", () => stopTio(), "primary small");
  // (d) peroksid
  const pvSel = select({ label: "3-odstotni H₂O₂ (z vodo do 25 mL)", options: PEROKSID_V.map((V) => [String(V), `${V} mL`]), value: "5" });
  const pkSel = select({ label: "katalizator", options: KAT_OPTS, value: "mno2_05" });
  const pNalij = button("Nalij peroksid in vodo v erlenmajerico", () => nalij(), "primary small");
  const pDodaj = button("Dodaj katalizator in zamaši", () => dodaj(), "primary small");
  const pTrska = button("Odmaši in vstavi tlečo trsko v vrat", () => trska());
  const pFilt = button("Prefiltriraj, posuši in stehtaj MnO₂", () => filtriraj());
  // skupno
  const startBtn = button("Zaženi štoparico", () => startUra());
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const autoSeg = row("zapisuj samodejno", seg("samodejni zapis", [["10", "vsakih 10 s"], ["30", "vsakih 30 s"], ["0", "ne"]], "30", (v) => ((interval = +v), (nextAuto = Math.ceil((B().cas() + 0.01) / Math.max(1, interval)) * interval))));
  const clrBtn = button("Izbriši meritve tega poskusa", () => clear());
  const grSeg = seg("graf", [["pot", "potek"], ["r0", "začetna hitrost"]], "pot", () => redraw());
  const grTSeg = seg("graf", [["c", "1/t od c"], ["T", "1/t od T"]], "c", () => redraw());
  const gm = grp("2. Marmor in klorovodikova kislina", hint(`Bučka stoji na tehtnici (0,01${nb}g). CO₂ uhaja iz bučke, zato se masa manjša. Vata zadrži kapljice kisline.`), mcSel, moSel, mmSel, vataT, buttons(mNalij, mDodaj));
  const gg = grp("2. Magnezij in klorovodikova kislina", hint(`Vodik potiska bat brizge. Brizga meri do 100${nb}mL; pri ~110${nb}mL bat izpade.`), gcSel, glSel, buttons(gNalij, gDodaj));
  const gt = grp("2. Natrijev tiosulfat in kislina", hint(`Bučko postavi na list s črnim križem in glej od zgoraj skozi raztopino. Žveplo, ki nastaja, raztopino skali. Štoparico ustavi sam, ko križa ne vidiš več.`), tvSel, buttons(tPrip, tZlij, tStop));
  const gp = grp("2. Vodikov peroksid in katalizator", hint(`Kisik potiska bat brizge. Katalizator pospeši razkroj, a se pri tem ne porabi. Z MnO₂ da 5${nb}mL 3-odstotnega H₂O₂ okoli 50${nb}mL kisika; pri 10 ali 20${nb}mL ga nastane več, kot ga sprejme brizga (100${nb}mL), in bat izpade.`), pvSel, pkSel, buttons(pNalij, pDodaj, pTrska, pFilt));
  const gBriz = grp("Plinska brizga", batSeg, zamSeg);
  const gZap = grp("3. Merjenje", hitrostSeg([1, 5, 20], 1, (v) => (speed = v)), hkratiT, autoSeg, buttons(startBtn, recBtn, clrBtn));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(P.wrap, meters), controlsBox(
        grp("1. Priprava", hint("Najprej si nadeni zaščitna očala: klorovodikova kislina draži kožo in oči, pri tiosulfatu nastaja dražljiv SO₂ (zračen prostor)."), goggles, row("poskus", nacinSeg), kopelSl, hint("Raztopine segreješ v vodni kopeli (kopel nima termostata in se počasi ohlaja). Pri brizgi bučka stoji v kopeli.")),
        gm, gg, gt, gp, gBriz, gZap, log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), ...Object.values(tabs),
      h("h4", { class: "lab-h" }, "Graf"), row("prikaži", grSeg), row("prikaži", grTSeg), ...Object.values(gPots), ...Object.values(gR0s), gTc, gTT, calc, qBox,
      notes(OS ? POENOSTAVITVE_REAKCIJE.hitrost.filter((t) => !/∝|Ea\b|Michaelis|reda/.test(t)) : POENOSTAVITVE_REAKCIJE.hitrost, OS ? "Marmor: Plummer, Wigley in Parkhurst (1978); gostota kalcita (CRC). Ocene: delovanje katalizatorjev, vidnost križa, trenje bata, ohlajanje kopeli." : "Marmor: Plummer, Wigley in Parkhurst (Am. J. Sci. 1978) – hitrost ∝ [H⁺] pri pH < 3,5; kalcit 2,71 g/cm³ (CRC); topnost CO₂ 0,038 mol/L (Sander 2015). Magnezij: kinetika iz lab-kovine (RSC »Disappearing magnesium«). Tiosulfat: hitrost ∝ [S₂O₃²⁻], Ea ≈ 52 kJ/mol (ocena; Q10 ≈ 2). KI: k = 0,0115 L/(mol s) pri 25 °C, Ea 56 kJ/mol (Liebhafsky in Mohammad 1933). Reakcijski čas človeka ~0,25 s. Ocene: konstante MnO₂ in katalaze, vidnost križa, trenje bata, ohlajanje kopeli."),

    ],
    tryText: OS
      ? "Primerjaj marmor v koščkih in v prahu: kdaj bučka hitreje izgublja maso? Nato razkroji vodikov peroksid brez katalizatorja, z MnO₂, s surovim in s kuhanim krompirjem. Pri katerem nastaja kisik najhitreje? Kaj se zgodi s tlečo trsko?"
      : "Izmeri izgubo mase marmorja v 0,5; 1 in 2 mol/L HCl in iz začetnih hitrosti določi red reakcije glede na kislino. Pri tiosulfatu izmeri čas izginotja križa pri petih koncentracijah in dveh temperaturah: je 1/t sorazmeren s c in kolikokrat se hitrost poveča pri 10 °C višji temperaturi?",
  });
  el.classList.add("lab");

  const B = () => Bs[mode];
  function sync() {
    gm.hidden = mode !== "marmor";
    gg.hidden = mode !== "mg";
    gt.hidden = mode !== "tio";
    gp.hidden = mode !== "h2o2";
    gBriz.hidden = !(mode === "mg" || mode === "h2o2");
    startBtn.hidden = mode === "tio";
    recBtn.hidden = mode === "tio";
    autoSeg.hidden = mode === "tio";
    for (const [k, t] of Object.entries(tabs)) t.hidden = k !== mode;
    grSeg.parentElement.hidden = mode === "tio" || mode === "h2o2" || OS;
    grTSeg.parentElement.hidden = mode !== "tio";
    if (mode === "h2o2" || OS) grSeg.set("pot", true);
    kopelSl.set(B().TkopSet > B().lab.T + 0.5 ? B().TkopSet : 20, true);
    meters.replaceChildren(swL, ...(mode === "marmor" ? [maL] : []), ...(mode === "mg" || mode === "h2o2" ? [brL] : []), thL);
    redraw();
    draw();
  }
  function setKopel(v) {
    B().kopel(v);
    log.push(v > B().lab.T + 0.5 ? `Vodno kopel si segrel na ${v}${nb}°C${mode === "mg" || mode === "h2o2" ? "; bučka stoji v kopeli" : "; raztopine se v njej segrejejo"}.` : "Kopel ima sobno temperaturo.", "info");
  }
  function setBrizga(k, v) {
    Bs.mg[k] = v;
    Bs.h2o2[k] = v;
    if (v) log.push(k === "zatika" ? "Bat je suh in se zatika: premakne se šele pri večjem nadtlaku, nato poskoči." : "Zamašek ne tesni: ob nadtlaku plin uhaja mimo njega.", "warn");
  }
  const ocalaMsg = () => log.push("Brez zaščitnih očal ne nalivaj kisline ali peroksida! Najprej si nadeni očala.", "bad");
  function nalij() {
    const b = B();
    let r;
    if (mode === "marmor") r = b.nalij(+mcSel.get());
    else if (mode === "mg") r = b.nalij(+gcSel.get());
    else if (mode === "tio") r = b.ocala ? b.pripravi(+tvSel.get()) : { ok: false, why: "ocala" };
    else r = b.nalij(+pvSel.get());
    if (!r.ok) return r.why === "ocala" ? ocalaMsg() : null;
    st[mode].run = null;
    b.ura = null;
    b.uraStop = null;
    const T = b.Tkop;
    if (mode === "marmor") log.push(`Na tehtnici je bučka s 40${nb}mL HCl (${cFmt(+mcSel.get())}${nb}mol/L${T > b.lab.T + 0.5 ? `, segreta na ${num(T, 0)}${nb}°C` : ""}).`, "ok");
    if (mode === "mg") log.push(`V erlenmajerici je 50${nb}mL HCl (${cFmt(+gcSel.get())}${nb}mol/L). Brizga še ni priključena.`, "ok");
    if (mode === "tio") log.push(`V bučki je ${tvSel.get()}${nb}mL raztopine tiosulfata in ${50 - +tvSel.get()}${nb}mL vode${T > b.lab.T + 0.5 ? `, segreto na ${num(T, 0)}${nb}°C` : ""}.`, "ok");
    if (mode === "h2o2") log.push(`V erlenmajerici je ${pvSel.get()}${nb}mL 3-odstotnega H₂O₂ in ${25 - +pvSel.get()}${nb}mL vode.`, "ok");
    draw();
  }
  function dodaj() {
    const b = B(), S_ = st[mode];
    let r, lab;
    if (mode === "marmor") {
      r = b.dodaj(moSel.get(), +mmSel.get());
      lab = `${cFmt(b.c)} M, ${moSel.get() === "prah" ? "prah" : moSel.get()}, ${mmSel.get()} g, ${num(b.T, 0)} °C`;
    } else if (mode === "mg") {
      r = b.dodaj(+glSel.get());
      lab = `${cFmt(b.c)} M, ${glSel.get()} cm, ${num(b.Tkop, 0)} °C`;
    } else if (mode === "tio") {
      r = b.zlij(2);
      if (r.ok) b.zazeni();
    } else {
      r = b.dodaj(pkSel.get());
      lab = `${KATALIZATORJI[pkSel.get()].name.replace(/, .*$/, "")}${pkSel.get().startsWith("mno2") ? ` ${pkSel.get() === "mno2_05" ? "0,5" : "0,1"} g` : ""}, ${pvSel.get()} mL, ${num(b.Tkop, 0)} °C`;
    }
    if (!r.ok) {
      if (r.why === "ocala") return ocalaMsg();
      if (r.why === "ze") return log.push("V bučki že poteka reakcija. Za nov poskus najprej nalij svežo raztopino.", "warn");
      return log.push("Najprej nalij raztopino.", "warn");
    }
    if (mode === "tio") {
      log.push(`Prilil si 5${nb}mL HCl in zagnal štoparico. Glej od zgoraj, kdaj križ izgine. Diši po SO₂ – delaj v zračnem prostoru.`, "ok");
      draw();
      return;
    }
    S_.n++;
    S_.run = `${S_.n}: ${lab}`;
    S_.ser.set(S_.run, []);
    S_.m0 = null;
    if (hkratiT.get()) startUra();
    if (mode === "marmor") {
      // začetna masa takoj po dodatku (t = 0)
      const o = b.beriMaso();
      S_.m0 = o.value;
      tabs.marmor.add({ p: String(S_.n), t: "0", m: o.text.replace(".", ","), dm: "0,00" });
      S_.ser.get(S_.run).push([0, 0]);
    }
    else log.push("Štoparica še ne teče! Zaženi jo čim prej, sicer bodo časi napačni.", "warn");
    if (mode === "marmor") {
      log.push(`Dodal si ${num(r.m, 2)}${nb}g marmorja${b.vata ? " in vrat zamašil z vato" : ""}.`, "ok");
      if (!b.vata) once("vata", "Brez vate bodo mehurčki CO₂ iz bučke razpršili tudi kapljice kisline: izguba mase bo prevelika.", "warn");
    }
    if (mode === "mg") log.push(`Spustil si ${glSel.get()}${nb}cm traku (${num(r.m, 3)}${nb}g) v kislino in zamašil z zamaškom s cevko do brizge.`, "ok");
    if (mode === "h2o2") log.push(`Dodal si katalizator: ${KATALIZATORJI[pkSel.get()].name}. Zamašek s cevko je na bučki.`, "ok");
    redraw();
    draw();
  }
  function startUra() {
    const b = B();
    if (mode === "tio") return;
    const late = b.t;
    b.zazeni();
    nextAuto = interval || Infinity;
    if (st[mode].run && late > 1.5) log.push(`Štoparico si zagnal ${num(late, 0)}${nb}s po začetku reakcije: vsi časi so za toliko prekratki, začetna hitrost bo videti prevelika.`, "bad");
  }
  function stopTio() {
    const b = Bs.tio;
    if (!b.zmes || !b.ura) return log.push("Najprej prilij kislino in zaženi štoparico.", "warn");
    if (b.uraStop != null) return log.push("Štoparica je že ustavljena. Za novo meritev pripravi svežo raztopino.", "info");
    const t = b.ustavi(0); // reakcijski čas je tvoj
    const vid = b.vidnost();
    if (vid > 0.12) log.push(`Križ je še precej viden (prosojnost ${Math.round(vid * 100)}${nb}%). Prezgodaj si ustavil; tak čas je prekratek.`, "warn");
    const c = b.c, T = b.T;
    st.tio.rows.push({ c, T, t, V: b.Vz });
    tabs.tio.add({ c: OS ? `${b.Vz} mL + ${50 - b.Vz} mL vode` : num(c, 3), T: num(T, 1), t: num(t, 1), it: num(1000 / t, 1) });
    log.push(`Križ je izginil po ${num(t, 1)}${nb}s.`, "ok");
    redraw();
  }
  function record({ quiet = false } = {}) {
    const b = B(), S_ = st[mode];
    if (!S_.run) return log.push("Najprej začni poskus (dodaj reaktant).", "warn");
    const t = b.cas();
    if (mode === "marmor") {
      const o = b.beriMaso();
      if (S_.m0 == null) S_.m0 = o.value;
      const dm = S_.m0 - o.value;
      tabs.marmor.add({ p: String(S_.n), t: num(t, 0), m: o.text.replace(".", ","), dm: num(dm, 2) }, { quiet });
      S_.ser.get(S_.run).push([t, dm]);
    } else {
      const o = b.brizga.beri();
      tabs[mode].add({ p: String(S_.n), t: num(t, 0), V: o.text.replace(".", ",") }, { quiet });
      if (Number.isFinite(o.value)) S_.ser.get(S_.run).push([t, o.value]);
      if (o.cez) once(`cez-${S_.run}`, "Plina je več kot 100 mL: brizga ga ne more več meriti. Uporabi manj reaktanta.", "bad");
    }
    redraw();
  }
  function clear() {
    if (mode === "tio") (st.tio.rows.length = 0), tabs.tio.clear();
    else (st[mode].ser.clear(), tabs[mode].clear(), (st[mode].run = null), (st[mode].n = 0));
    redraw();
  }
  function trska() {
    const b = Bs.h2o2;
    if (!b.kat) return log.push("V bučki še ni reakcije.", "info");
    const r = b.trska();
    log.push(r === "vzplamti" ? "Tleča trska je v vratu bučke vzplamtela: plin je kisik." : r === "zazari" ? "Trska je močneje zažarela, a ni vzplamtela: kisika je malo več kot v zraku." : "Trska je ugasnila: kisika ni več kot v zraku (reakcija skoraj ne poteka).", r === "vzplamti" ? "ok" : "info");
  }
  function filtriraj() {
    const b = Bs.h2o2, f = b.filtriraj();
    if (!f) return log.push(b.kat ? "Ta katalizator se ne da preprosto odfiltrirati in stehtati (raztopljen KI ali košček krompirja ali jeter)." : "V bučki ni katalizatorja.", "info");
    log.push(`MnO₂ si prefiltriral, posušil in stehtal: ${f.text.replace(".", ",")}${nb}g (na začetku ${num(f.m0, 2)}${nb}g). Katalizator se pri reakciji ne porabi.`, "ok");
  }
  function redraw() {
    for (const [k, g] of Object.entries(gPots)) g.hidden = k !== mode || (grSeg.value === "r0" && mode !== "h2o2" && !OS);
    for (const [k, g] of Object.entries(gR0s)) g.hidden = k !== mode || OS || grSeg.value !== "r0";
    const gPot = gPots[mode], gR0 = gR0s[mode];
    gTc.hidden = mode !== "tio" || grTSeg.value !== "c";
    gTT.hidden = mode !== "tio" || grTSeg.value !== "T";
    const out = [];
    if (mode === "tio") {
      const rows = st.tio.rows;
      const byT = new Map(), byC = new Map();
      for (const r of rows) {
        const kT = `${Math.round(r.T / 5) * 5} °C`, kC = OS ? `${r.V} mL` : `${num(r.c, 3)} mol/L`;
        (byT.get(kT) || byT.set(kT, []).get(kT)).push([OS ? r.V : r.c, 1000 / r.t]);
        (byC.get(kC) || byC.set(kC, []).get(kC)).push([r.T, 1000 / r.t]);
      }
      const ymax = os(Math.max(10, ...rows.map((r) => 1000 / r.t)));
      gTc.setAxes({ x: OS ? [0, 50] : [0, 0.16], xStep: OS ? 10 : 0.04, y: [0, ymax.top], yStep: ymax.step });
      gTT.setAxes({ y: [0, ymax.top], yStep: ymax.step });
      gTc.draw(serije(byT));
      gTT.draw(serije(byC));
      for (const [k, p] of byT) if (p.length >= 2 && !OS) {
        const q = p.map(([c, it]) => it / c), avg = q.reduce((a, b) => a + b, 0) / q.length, dev = Math.max(...q.map((x) => Math.abs(x / avg - 1)));
        out.push(`<p>Pri ${k}: ${tex(String.raw`\frac{1/t}{c} = ${num(avg, 0)} \cdot 10^{-3}${en("L/(mol s)")}`)}, odstopanje ${num(dev * 100, 0)}${nb}% → ${dev < 0.1 ? `${tex(String.raw`\frac{1}{t}`)} je sorazmeren s <i>c</i> (reakcija 1. reda glede na tiosulfat).` : "točke še niso na premici skozi izhodišče."}</p>`);
      }
      for (const [k, p] of byC) if (p.length >= 2) {
        const a = p.reduce((x, y) => (y[0] < x[0] ? y : x)), b = p.reduce((x, y) => (y[0] > x[0] ? y : x));
        if (b[0] - a[0] >= 5) {
          const q10 = (b[1] / a[1]) ** (10 / (b[0] - a[0]));
          out.push(OS ? `<p>${k}: pri ${num(b[0], 0)}${nb}°C je križ izginil ${num(b[1] / a[1], 1)}-krat hitreje kot pri ${num(a[0], 0)}${nb}°C.</p>` : `<p>${k}: med ${num(a[0], 0)} in ${num(b[0], 0)}${nb}°C se hitrost poveča ${num(b[1] / a[1], 1)}-krat, to je ~${num(q10, 1)}-krat na 10${nb}°C. Aktivacijska energija iz Arrheniusove enačbe: <i>E</i><sub>a</sub> ≈ ${num((8.314 * Math.log(b[1] / a[1])) / (1 / (a[0] + 273.15) - 1 / (b[0] + 273.15)) / 1000, 0)}${nb}kJ/mol.</p>`);
        }
      }
    } else {
      const S_ = st[mode];
      const pts = [...S_.ser.values()].flat();
      const ax = os(Math.max(mode === "marmor" ? 300 : 120, ...pts.map((p) => p[0]))), ay = os(Math.max(mode === "marmor" ? 0.5 : 20, ...pts.map((p) => p[1])));
      gPot.setAxes({ x: [0, ax.top], xStep: ax.step, y: [0, ay.top], yStep: ay.step });
      gPot.draw(serije(S_.ser));
      // začetna hitrost: prva zapisana točka v prvih 60 s
      const r0 = [];
      for (const [name, p] of S_.ser) {
        const q = p.find((x) => x[0] > 5 && x[0] <= 65);
        if (!q) continue;
        const c = +name.split(": ")[1].split(" M")[0].replace(",", ".");
        r0.push({ name, c, r: q[1] / q[0] });
      }
      const unit = mode === "marmor" ? "g/min" : "mL/s", f = mode === "marmor" ? 60 : 1;
      for (const x of r0) if (x.r > 0) out.push(`<p>Poskus ${x.name}: začetna hitrost ≈ ${num(x.r * f, mode === "marmor" ? 3 : 2)}${nb}${unit}</p>`);
      if (mode !== "h2o2") {
        const m = new Map();
        for (const x of r0) {
          const k = x.name.replace(/^\d+: [\d,]+ M, /, "");
          (m.get(k) || m.set(k, []).get(k)).push([x.c, x.r * f]);
        }
        const yy = os(Math.max(0.1, ...r0.map((x) => x.r * f)));
        gR0.setAxes({ y: [0, yy.top], yStep: yy.step });
        gR0.draw(serije(m));
        if (!OS) for (const [k, p] of m) {
          const a = p.reduce((x, y) => (y[0] < x[0] ? y : x)), b = p.reduce((x, y) => (y[0] > x[0] ? y : x));
          if (b[0] > a[0] * 1.5 && a[1] > 0 && b[1] > 0) out.push(`<p>${k}: ko se <i>c</i>(HCl) poveča ${num(b[0] / a[0], 0)}-krat, se začetna hitrost poveča ${num(b[1] / a[1], 1)}-krat → red reakcije glede na HCl ≈ ${num(Math.log(b[1] / a[1]) / Math.log(b[0] / a[0]), 1)}.</p>`);
        }
      }
    }
    calc.innerHTML = out.join("");
    const nRuns = st.marmor.n + st.mg.n + st.h2o2.n + st.tio.rows.length;
    if (!asked && nRuns >= 4) {
      asked = true;
      qBox.append(conclusion(OS ? {
        text: "Kaj pokažejo tvoji poskusi o hitrosti kemijske reakcije?",
        options: [
          { t: "Reakcija poteka hitreje, če je raztopina bolj koncentrirana ali toplejša, če je trdna snov zdrobljena in če dodamo katalizator.", ok: true, why: "Delci reagirajo, ko trčijo. Več delcev v raztopini, hitrejši delci (višja temperatura) in večja površina trdne snovi pomenijo več trkov. Katalizator (MnO₂, katalaza v krompirju) reakcijo pospeši, sam pa se ne porabi: MnO₂ ima po poskusu enako maso." },
          { t: "Katalizator se pri reakciji porabi, zato ga moramo dodajati.", ok: false, why: "MnO₂ si po poskusu prefiltriral in stehtal: masa je ostala enaka. Katalizator reakcijo pospeši, a se ne porabi." },
          { t: "Koščki marmorja reagirajo enako hitro kot marmor v prahu, ker je snov ista.", ok: false, why: "Prah ima veliko večjo površino, zato kislina naenkrat reagira z več delci: masa bučke se zmanjšuje veliko hitreje." },
          { t: "Kuhan krompir razkroji vodikov peroksid enako hitro kot surov.", ok: false, why: "Pri kuhanju se encim katalaza uniči (denaturira), zato s kuhanim krompirjem kisik skoraj ne nastaja." },
        ],
      } : {
        text: "Kaj pokažejo tvoje meritve o hitrosti reakcije?",
        options: [
          { t: "Hitrost je sorazmerna s koncentracijo (pri marmorju in tiosulfatu reakcija 1. reda), pri 10 °C višji temperaturi se poveča ~2-krat (tiosulfat), večja površina in katalizator pa reakcijo pospešita, ne da bi se spremenila končna množina produkta.", ok: true, why: "Po teoriji trkov je hitrost sorazmerna s številom uspešnih trkov: z višjo koncentracijo jih je sorazmerno več, z višjo temperaturo ima več delcev energijo, večjo od aktivacijske (Arrheniusova enačba, <i>E</i><sub>a</sub> ≈ 50 kJ/mol da faktor ~2 na 10 °C). Katalizator zniža aktivacijsko energijo. Končna množina CO₂ ali O₂ je odvisna le od omejitvenega reaktanta." },
          { t: "Z višjo temperaturo nastane več produkta.", ok: false, why: "Temperatura spremeni le hitrost. Končna izguba mase pri marmorju je enaka množini CO₂, ki jo določa omejitveni reaktant, ne glede na temperaturo." },
          { t: "Hitrost marmorja v kislini je odvisna le od mase marmorja, ne od velikosti koščkov.", ok: false, why: "Kislina reagira le na površini. Enaka masa v manjših koščkih ali v prahu ima veliko večjo površino, zato je začetna hitrost večja." },
          { t: "Pri tiosulfatu je čas izginotja križa sorazmeren s koncentracijo.", ok: false, why: "Čas je obratno sorazmeren: pri dvakrat večji koncentraciji križ izgine v pol krajšem času, zato je 1/<i>t</i> (merilo hitrosti) sorazmeren s <i>c</i>." },
        ],
      }));
    }
  }

  ticker(el, (dt) => {
    const d = dt * speed;
    for (const b of Object.values(Bs)) b.step(d);
    const b = B();
    const tece = !!b.ura && b.uraStop == null;
    swL.set(b.ura ? ura(b.cas()) : "", "", b.ura ? (tece ? "teče" : "ustavljena") : "ne teče");
    thL.set(num(b.T, 1), "°C", b.Tkop > b.lab.T + 0.5 ? `v raztopini; kopel ${num(b.Tkop, 0)}${nb}°C` : "v raztopini");
    if (mode === "marmor") maL.set(b.c != null ? b.beriMaso().text : "", "g");
    if (mode === "mg" || mode === "h2o2") {
      const o = b.brizga.beri();
      const on = mode === "mg" ? !!b.K.kos : !!b.kat;
      brL.set(on ? (Number.isFinite(o.value) ? o.text : o.cez ? "> 100" : "–") : "", "mL", on ? (b.brizga.izpadel ? "bat je izpadel" : "") : "ni priključena");
    }
    // samodejni zapis
    if (tece && interval && st[mode].run && b.cas() >= nextAuto) {
      record({ quiet: true });
      nextAuto += interval;
    }
    for (const e of b.events.splice(0)) {
      if (e.type === "pena") log.push("Pena je šla čez rob bučke! Del raztopine je odtekel, zato je izguba mase prevelika. Uporabi koščke namesto prahu ali bolj razredčeno kislino.", "bad");
      if (e.type === "bat") log.push("Bat je izpadel iz brizge: plina je bilo več kot ~110 mL. Uporabi manj reaktanta.", "bad");
    }
    if (mode === "mg" && b.K.prelito) once("mgpena", "Pena je šla čez rob in v cevko proti brizgi.", "bad");
    if (mode === "marmor" && b.kos && b.kos.m < 1e-4) once(`kon-${st.marmor.run}`, "Ves marmor je zreagiral: marmor je bil omejitveni reaktant.", "info");
    if (mode === "marmor" && b.kos && b.nH < 1e-5 && b.kos.m > 0.01) once(`kis-${st.marmor.run}`, `Kislina je porabljena, v bučki je ostalo ${num(b.kos.m, 2)}${nb}g marmorja: kislina je bila omejitveni reaktant.`, "info");
    if (mode === "tio" && b.zmes && b.uraStop == null && b.vidnost() < 0.005 && b.t > 3) once(`tio-${b.Vz}-${b.TkopSet}-${st.tio.rows.length}`, "Raztopina je že povsem motna. Ustavi štoparico: zamujen čas je napaka meritve.", "warn");
    draw();
  });

  function draw() {
    gD.replaceChildren();
    P.begin();
    const b = B();
    s("rect", { x: 0, y: yB, width: W, height: H - yB, fill: u(svg, "miza") }, gD);
    const tece = !!b.ura && b.uraStop == null;
    stoparica(gD, svg, 8, 10, b.ura ? ura(b.cas()) : "0:00,0", tece);
    if (mode === "marmor") drawMarmor(b);
    else if (mode === "tio") drawTio(b);
    else drawBrizga(b);
    if (!b.ocala) label(gD, 170, 14, "brez zaščitnih očal", "lab-warn");
    if (speed > 1) label(gD, 40, 64, `čas teče ×${speed}`, "lab-warn small");
    merilo(gD, 330, H - 6, S);
    P.commit();
  }
  function drawMarmor(b) {
    const fx = 92, yPan = tehtnica(gD, svg, fx, yB, S, b.c != null ? b.beriMaso().text : "0.00");
    const liq = b.c != null ? MARMOR.Vkis : 0;
    const E = erlen(gD, svg, fx, yPan, S, { V: liq, fill: "rgb(214 230 238 / 0.62)", pena: b.pena, prelito: b.prelito });
    const m = b.mehurcki();
    if (b.kos && b.kos.m > 1e-4) {
      const o = b.kos.oblika, f = Math.max(0.2, (b.kos.m / b.kos.m0) ** (1 / 3));
      if (o === "prah") {
        const hP = 2 + 3 * f * Math.min(1, b.kos.m0 / 5);
        s("path", { d: `M${fx - E.bw / 2 + 6},${yPan - 1.5} Q${fx},${yPan - 1.5 - hP * 2} ${fx + E.bw / 2 - 6},${yPan - 1.5} Z`, fill: "#f1eee6", stroke: "#b8b1a2", "stroke-width": 0.4 }, gD);
        if (m) mehurcki(P.g, { x: fx, w: E.bw * 0.7, y0: yPan - 3, y1: E.liqTop + 1, n: [0, 4, 9, 16, 26][m], r: [0.4, 1.1], v: 15 * S });
      } else {
        const d = { veliki: 1.2, srednji: 0.6, mali: 0.3 }[o] * S * f, n = Math.min(40, Math.round((b.kos.m0 / (MARMOR.rho * ({ veliki: 1.2, srednji: 0.6, mali: 0.3 }[o]) ** 3)) * 1));
        for (let i = 0; i < n; i++) {
          const w = E.bw - 10, row_ = Math.floor((i * d) / w), x = fx - w / 2 + ((i * d * 1.05) % w) + d / 2, y = yPan - 2 - d / 2 - row_ * d * 0.75;
          const pts = Array.from({ length: 6 }, (_, k) => {
            const a = (k / 6) * 2 * Math.PI + pseudo(i, k), rr = (d / 2) * (0.75 + 0.35 * pseudo(i, k + 9));
            return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * 0.8 * Math.sin(a)).toFixed(1)}`;
          });
          s("polygon", { points: pts.join(" "), fill: u(svg, "marmor"), stroke: "#9b9484", "stroke-width": 0.4 }, gD);
          if (m && i % Math.max(1, Math.round(n / 8)) === 0) mehurcki(P.g, { x, w: d, y0: y - d / 3, y1: E.liqTop + 1, n: [0, 1, 2, 3, 5][m], r: [0.4, 1.1], v: 15 * S, key: i });
        }
      }
    }
    E.steklo();
    if (b.c != null && b.vata) vata(gD, fx, E.top, E.nw);
    label(gD, 8, yB + 12, "erlenmajerica 100 mL na tehtnici", "lab-ek-miza small", "start");
    if (b.Tkop > b.lab.T + 0.5) {
      const yw = kopel(gD, svg, 210, yB, 92, 46, b.Tkop);
      steklo(gD, svg, 236, yw - 18, 26, yB - yw + 14, { rx: 2 });
      label(gD, 249, yw - 24, "HCl", "tick small");
    }
    povecava(b, 262, 150, 58);
  }
  // povečava ~4× dna bučke: koščki marmorja z mehurčki CO₂
  function povecava(b, cx, cy, r) {
    if (!b.kos || b.kos.m < 1e-4) return;
    const id = `${svg.uid}-pov`, m = b.mehurcki();
    s("circle", { cx, cy, r }, s("clipPath", { id }, s("defs", {}, gD)));
    const c = s("g", { "clip-path": `url(#${id})` }, gD);
    s("rect", { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r, fill: "rgb(214 230 238)" }, c);
    s("rect", { x: cx - r, y: cy + r * 0.62, width: 2 * r, height: r, fill: u(svg, "steklo"), class: "lab-ek-glass" }, c);
    const o = b.kos.oblika, f = Math.max(0.2, (b.kos.m / b.kos.m0) ** (1 / 3));
    const d0 = o === "prah" ? 2 : { veliki: 1.2, srednji: 0.6, mali: 0.3 }[o] * 32 * f;
    let x = cx - r - d0 * 0.3;
    for (let i = 0; x < cx + r && i < 90; i++) {
      if (o === "prah") {
        s("circle", { cx: cx - r + pseudo(i, 1) * 2 * r, cy: cy + r * 0.62 - 1.5 - pseudo(i, 2) * 8, r: 1.4 + pseudo(i, 3) * 1.2, fill: "#f1eee6", stroke: "#b8b1a2", "stroke-width": 0.4 }, c);
        x += 1.6;
        continue;
      }
      // nepravilni koščki različnih velikosti, ponekod naloženi drug na drugega
      const d = d0 * (0.7 + 0.6 * pseudo(i, 4)), y = cy + r * 0.62 - d / 2 - (i % 3 === 2 ? d * 0.55 : 0);
      const pts = Array.from({ length: 7 }, (_, k) => {
        const a = (k / 7) * 2 * Math.PI + pseudo(i, k), rr = (d / 2) * (0.72 + 0.32 * pseudo(i, k + 11));
        return `${(x + d / 2 + rr * Math.cos(a)).toFixed(1)},${(y + rr * 0.78 * Math.sin(a)).toFixed(1)}`;
      });
      s("polygon", { points: pts.join(" "), fill: u(svg, "marmor"), stroke: "#9b9484", "stroke-width": 0.7 }, c);
      s("path", { d: `M${x + d * 0.25},${y - d * 0.1} l${d * 0.2},${-d * 0.12}`, stroke: "#c9c2b3", "stroke-width": 0.6 }, c); // žila v marmorju
      x += d * (i % 3 === 2 ? 0.3 : 0.9);
    }
    if (m) mehurcki(P.krog(cx, cy, r), { x: cx, w: 2 * r * 0.9, y0: cy + r * 0.5, y1: cy - r, n: [0, 3, 7, 12, 20][m], r: [1.2, 3.4], v: 15 * S * 4, key: 3 });
    s("circle", { cx, cy, r, class: "lab-sil-lupa-frame" }, gD);
    label(gD, cx, cy - r - 8, "povečava ~4× (marmor in mehurčki CO₂)", "tick small");
  }
  function drawTio(b) {
    const fx = 92, yP = yB - 2;
    // list papirja s križem (perspektiva)
    s("path", { d: `M${fx - 64},${yB + 6} L${fx - 50},${yB - 8} H${fx + 50} L${fx + 64},${yB + 6} Z`, fill: "#fbfbf8", stroke: "#c8c8c0", "stroke-width": 0.6 }, gD);
    s("path", { d: `M${fx - 30},${yB + 2} L${fx + 30},${yB - 5} M${fx - 30},${yB - 5} L${fx + 30},${yB + 2}`, stroke: "#111", "stroke-width": 3.2 }, gD);
    const mot = b.zmes ? 1 - b.vidnost() : 0;
    const fill = `rgb(${Math.round(214 + 34 * mot)} ${Math.round(230 + 14 * mot)} ${Math.round(238 - 70 * mot)} / ${(0.55 + 0.43 * mot).toFixed(2)})`;
    const E = erlen(gD, svg, fx, yP, S, { V: b.zmes ? 55 : b.pripravljeno ? 50 : 0, fill });
    E.steklo();
    label(gD, 8, yB + 14, "erlenmajerica na listu s križem", "lab-ek-miza small", "start");
    // pogled od zgoraj: križ skozi raztopino
    const cx = 250, cy = 150, r = 62, id = `${svg.uid}-zg`;
    s("circle", { cx, cy, r }, s("clipPath", { id }, s("defs", {}, gD)));
    const c = s("g", { "clip-path": `url(#${id})` }, gD);
    s("rect", { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r, fill: "#fbfbf8" }, c);
    s("path", { d: `M${cx - r * 0.7},${cy - r * 0.7} L${cx + r * 0.7},${cy + r * 0.7} M${cx - r * 0.7},${cy + r * 0.7} L${cx + r * 0.7},${cy - r * 0.7}`, stroke: "#111", "stroke-width": 9 }, c);
    s("circle", { cx, cy, r: r * 0.92, fill: "none", stroke: "#8fa2b2", "stroke-width": 3 }, c);
    if (b.zmes) s("circle", { cx, cy, r: r * 0.9, fill: `rgb(246 242 214 / ${mot.toFixed(3)})` }, c);
    s("circle", { cx, cy, r, class: "lab-sil-lupa-frame" }, gD);
    label(gD, cx, cy - r - 8, "pogled od zgoraj skozi raztopino", "tick small");
    if (b.Tkop > b.lab.T + 0.5) {
      const yw = kopel(gD, svg, 300, yB, 88, 44, b.Tkop);
      steklo(gD, svg, 318, yw - 18, 22, yB - yw + 14);
      steklo(gD, svg, 350, yw - 10, 14, yB - yw + 6);
    }
  }
  function drawBrizga(b) {
    const fx = 60, mg = mode === "mg";
    const bath = b.Tkop > b.lab.T + 0.5;
    const V = mg ? (b.c != null ? 50 : 0) : b.V != null ? 25 : 0;
    const kat = mg ? b.K.kos : b.kat;
    let liqCol = "rgb(214 230 238 / 0.62)";
    if (!mg && b.kat === "ki") liqCol = `rgb(232 205 120 / 0.65)`; // malo joda obarva raztopino rumeno
    if (bath) kopel(gD, svg, fx - 40, yB, 80, 70, b.Tkop);
    const E = erlen(gD, svg, fx, yB - 2, S, { V, fill: liqCol, pena: mg ? b.K.pena : (b.kat?.startsWith("jetra") && !KATALIZATORJI[b.kat].kuhan ? Math.min(60, b.hitrostPlina() * 12) : 0), prelito: mg && b.K.prelito });
    const m = b.mehurcki(), yb = yB - 5;
    if (mg && b.K.kos && b.K.kos.m > 1e-6) {
      const L = 5 * S * Math.max(0.15, (b.K.kos.m / b.K.kos.m0) ** 0.5), yS = m >= 3 ? E.liqTop + 8 : yb;
      s("path", { d: `M${fx - L / 2},${yS} q${L / 4},-3 ${L / 2},0 t${L / 2},0`, fill: "none", stroke: u(svg, "m-Mg"), "stroke-width": 2.6, "stroke-linecap": "round" }, gD);
      if (m) mehurcki(P.g, { x: fx, w: L, y0: yS, y1: E.liqTop + 1, n: [0, 2, 5, 10, 16][m], r: [0.5, 1.3], v: 15 * S });
    }
    if (!mg && b.kat) {
      const K = KATALIZATORJI[b.kat];
      if (K.tip === "mno2") s("path", { d: `M${fx - 16},${yb + 2} Q${fx},${yb - (K.m > 0.2 ? 6 : 3)} ${fx + 16},${yb + 2} Z`, fill: "#1d1d1f" }, gD);
      if (K.tip === "ki") for (let i = 0; i < 6; i++) s("rect", { x: fx - 10 + i * 3.5, y: yb - 1 - (i % 2), width: 2.4, height: 2.4, fill: "#fafafa", stroke: "#999", "stroke-width": 0.3 }, gD);
      if (K.tip === "katalaza") {
        const jet = b.kat.startsWith("jetra"), nar = b.kat === "krompirNariban";
        const n = jet ? 3 : nar ? 14 : 5;
        for (let i = 0; i < n; i++) {
          const x = fx - 18 + (i * 36) / n + 3, sz = jet ? 7 : nar ? 2.2 : 6.5;
          if (jet) s("path", { d: `M${x - sz},${yb} q${sz / 2},-${sz} ${sz * 1.6},-${sz * 0.5} q${sz / 2},${sz * 0.7} -${sz * 0.2},${sz * 0.6} Z`, fill: u(svg, K.kuhan ? "jetrak" : "jetra") }, gD);
          else s("rect", { x: x - sz / 2, y: yb - sz - (nar ? pseudo(i, 1) * 4 : 0), width: sz, height: sz, rx: nar ? 0.6 : 1, fill: u(svg, K.kuhan ? "kuhan" : "krompir"), stroke: "#a89650", "stroke-width": 0.4 }, gD);
        }
      }
      if (m) mehurcki(P.g, { x: fx, w: 30, y0: yb - 2, y1: E.liqTop + 1, n: [0, 2, 5, 10, 18][m], r: [0.4, 1.2], v: 15 * S });
    }
    E.steklo();
    if (kat) {
      zamasek(gD, fx, E.top, E.nw);
      brizgaRisba(gD, svg, { x0: 120, sy: 110, S, V: b.brizga.izpadel ? 0 : b.brizga.x, izpadel: b.brizga.izpadel, yB, fromX: fx + 3, fromY: E.top - 6 });
    } else if (V) label(gD, 190, 110, "brizga čaka na zamašek", "tick small");
    label(gD, 8, yB + 12, "erlenmajerica 100 mL", "lab-ek-miza small", "start");
  }
  sync();
}

// ================================================================ 2. energija pri reakcijah
const PROCESI_E = {
  nevtr: { name: "HCl + NaOH (nevtralizacija)", os: "kislina + baza (nevtralizacija)" },
  ocetna: { name: "CH₃COOH + NaOH (šibka kislina)" },
  NH4NO3: { name: "raztapljanje NH₄NO₃" },
  NaOH: { name: "raztapljanje NaOH (peleti)" },
  CaCl2: { name: "raztapljanje CaCl₂" },
  mg: { name: "Mg + HCl" },
  titr: { name: "termometrijska titracija HCl z NaOH" },
};
export function labEnergija(el, opts = {}) {
  const OS = opts.raven === "os";
  const B = new KalorimeterBench({ seed: seme() });
  let zadnji = { text: "–" }, proc = "nevtr", speed = 1, interval = 30, nextAuto = 30, tRec = 0, asked = false, faza = "prazno";
  const W = 400, H = 300, S = 10, yB = 276; // 1 cm = 10 enot
  const svg = svgBox(W, H, "lab-bench lab-ek lab-rk lab-rk-kal");
  grad(svg);
  const gD = s("g", {}, svg);
  const P = plastMehurckov(svg, W, H);
  const log = eventLog();
  const thL = lcd("termometer"), swL = lcd("štoparica"), buL = lcd("bireta");
  const said = {};
  const once = (k, text, kind = "warn") => said[k] || ((said[k] = true), log.push(text, kind));
  const table = dataTable([{ key: "t", label: "<i>t</i> [s]" }, { key: "V", label: "<i>V</i>(NaOH) [mL]" }, { key: "T", label: "<i>T</i> [°C]" }, { key: "op", label: "opomba" }], { empty: "Še ni meritev. Nalij raztopino v kalorimeter, zapisuj temperaturo, nato zlij ali stresi drugo snov in zapisuj naprej." });
  table.classList.add("lab-rk-tab");
  const gTt = dataGraph({ x: [0, 600], y: [15, 30], xStep: 120, yStep: 5, xLabel: "t [s]", yLabel: "T [°C]", title: "Temperatura v kalorimetru v odvisnosti od časa", origin: false });
  const gTV = dataGraph({ x: [0, 50], y: [15, 30], xStep: 10, yStep: 5, xLabel: "V(NaOH) [mL]", yLabel: "T [°C]", title: "Temperatura v odvisnosti od dodane prostornine NaOH (termometrijska titracija)", origin: false });
  const calc = h("div", { class: "lab-ek-calc", "aria-live": "polite" });
  const qBox = h("div");
  const pts = [];
  const goggles = toggle("zaščitna očala", false, (v) => ((B.ocala = v), v && log.push("Nadel si si zaščitna očala.", "ok")));
  const pSel = select({ label: "reakcija", options: Object.entries(PROCESI_E).filter(([k]) => !OS || ["nevtr", "NH4NO3", "NaOH", "CaCl2", "mg"].includes(k)).map(([k, v]) => [k, OS && v.os ? v.os : v.name]), value: proc, onChange: (v) => ((proc = v), syncP()) });
  const cSel = select({ label: "koncentracija kisline in baze", options: [["1", "1 mol/L"], ["2", "2 mol/L"], ["4", "4 mol/L"]], value: "1" });
  const gSel = select({ label: "masa trdne snovi", options: [["2", "2 g"], ["5", "5 g"], ["10", "10 g"]], value: "5" });
  const mgSel = select({ label: "magnezij", options: [["prah:0.2", "prah 0,2 g"], ["prah:0.3", "prah 0,3 g"], ["trak:0.3", "trak 0,3 g"]], value: "prah:0.3" });
  const dvSel = select({ label: "korak birete", options: [["1", "1 mL"], ["2", "2 mL"], ["5", "5 mL"]], value: "2" });
  const posSeg = row("posoda", seg("posoda", [["stiropor", "lonček iz stiropora"], ["casa", "steklena čaša"]], "stiropor", (v) => ((B.posoda = v), B.w || log.push(v === "casa" ? "Izbral si stekleno čašo 400 mL: steklo pobere in odda veliko toplote." : "Lonček iz stiropora (v čaši za stabilnost): skoraj nič toplote ne pobere in slabo prevaja.", v === "casa" ? "warn" : "info"))));
  const lidT = toggle("pokrov z luknjama za termometer in mešalo", true, (v) => ((B.pokrov = v), log.push(v ? "Kalorimeter je pokrit." : "Kalorimeter je odkrit: toplota uhaja skozi gladino.", v ? "info" : "warn")));
  const mesT = toggle("mešaj", true, (v) => ((B.mesaj = v), log.push(v ? "Mešaš z mešalom." : "Ne mešaš: temperatura v kalorimetru ni povsod enaka.", v ? "info" : "warn")));
  const thSel = select({ label: "termometer", options: Object.entries(TERMOMETRI).map(([k, v]) => [k, v.name]), value: "digitalni", onChange: (v) => (B.termometer = v) });
  const b1 = button("1. Nalij v kalorimeter", () => prva(), "primary small");
  const b2 = button("2. Zlij / stresi / dodaj", () => druga(), "primary small");
  const bT = button("Dodaj iz birete", () => titr(), "primary small");
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const autoSeg = row("zapisuj samodejno", seg("samodejni zapis", [["15", "vsakih 15 s"], ["30", "vsakih 30 s"], ["0", "ne"]], "30", (v) => ((interval = +v), (nextAuto = Math.ceil((tRec + 0.01) / Math.max(1, interval)) * interval))));
  const clrBtn = button("Izprazni in začni znova", () => reset());
  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(P.wrap, h("div", { class: "lab-meters" }, thL, swL, buL)), controlsBox(
        grp("1. Kalorimeter", hint("Lonček iz stiropora s pokrovom, mešalom in termometrom. Toplota reakcije segreje (ali ohladi) raztopino, malo je uide skozi steno in pokrov."), goggles, posSeg, lidT, mesT, thSel),
        grp("2. Snovi", pSel, cSel, gSel, mgSel, dvSel, hint(OS ? "Najprej nalij prvo raztopino ali vodo in nekaj časa zapisuj temperaturo. Nato dodaj drugo snov in zapisuj naprej." : "Pred dodatkom vsaj 2 minuti zapisuj temperaturo (začetna temperatura), po dodatku še ~8 minut: premico ohlajanja podaljšaj nazaj do časa mešanja."), buttons(b1, b2, bT)),
        grp("3. Merjenje", hitrostSeg([1, 5, 20], 1, (v) => (speed = v)), autoSeg, buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Graf"), gTt, gTV, calc, qBox,
      notes(OS ? POENOSTAVITVE_REAKCIJE.energija.filter((t) => !/kJ|entalpij|ΔfH/i.test(t)) : POENOSTAVITVE_REAKCIJE.energija, OS ? "Toplota pri nevtralizaciji in raztapljanju: Atkins, CRC Handbook. Izgube toplote: model »Mešanje vode« (stiropor, steklo). Ocene: mešanje, plasti, termometer." : "Nevtralizacija −57,1 kJ/mol (močna kislina in baza, ~1 mol/L; Atkins), ocetna kislina −56,1 kJ/mol (ocena), raztapljanje NH₄NO₃ +25,69, NaOH −44,51, CaCl₂ −81,33 kJ/mol (CRC), ΔfH(Mg²⁺) = −466,85 kJ/mol (NBS). c(vode) = 4,18 J/(g K). Izgube toplote: model »Voda« (stiropor k = 0,035 W/(m K), steklo 1,14 W/(m K)). Ocene: mešanje, plasti, toplotna kapaciteta termometra."),
    ],
    tryText: OS
      ? "Raztopi amonijev nitrat v vodi in nato kalcijev klorid: pri katerem se raztopina segreje in pri katerem ohladi? Nato zlij kislino in bazo: je nevtralizacija eksotermna ali endotermna reakcija?"
      : "Izmeri reakcijsko entalpijo nevtralizacije: 50 mL 1 M HCl in 50 mL 1 M NaOH v lončku iz stiropora s pokrovom. Ponovi v stekleni čaši brez pokrova. Zakaj je izmerjena |ΔH| manjša od −57 kJ/mol v literaturi? Nato izvedi termometrijsko titracijo in poišči ekvivalentno točko.",
  });
  el.classList.add("lab");
  function syncP() {
    const tr = ["NH4NO3", "NaOH", "CaCl2"].includes(proc);
    cSel.hidden = tr || proc === "mg";
    gSel.hidden = !tr;
    mgSel.hidden = proc !== "mg";
    dvSel.hidden = proc !== "titr";
    bT.hidden = proc !== "titr";
    b2.hidden = proc === "titr";
    buL.hidden = proc !== "titr";
    autoSeg.hidden = proc === "titr";
    b1.textContent = tr ? "1. Nalij 100 mL vode" : proc === "mg" ? "1. Nalij 50 mL 1 M HCl" : proc === "titr" ? `1. Nalij 25 mL HCl` : `1. Nalij 50 mL ${proc === "ocetna" ? "CH₃COOH" : "HCl"}`;
    b2.textContent = tr ? `2. Stresi ${TRDNE[proc].formula}` : proc === "mg" ? "2. Dodaj magnezij" : "2. Zlij 50 mL NaOH";
    redraw();
    draw();
  }
  function reset() {
    B.reset();
    pts.length = 0;
    table.clear();
    faza = "prazno";
    tRec = 0;
    nextAuto = interval;
    redraw();
    draw();
  }
  function prva() {
    if (faza !== "prazno") reset();
    const tr = ["NH4NO3", "NaOH", "CaCl2"].includes(proc), c = proc === "mg" ? 1 : +cSel.get();
    const r = tr ? B.nalij("voda", 0, 100) : B.nalij(proc === "ocetna" ? "CH3COOH" : "HCl", c, proc === "titr" ? 25 : 50);
    if (!r.ok) return log.push("Brez zaščitnih očal ne delaj s kislinami in bazami! Najprej si nadeni očala.", "bad");
    if (r.jedko) log.push(`Kislina ${c}${nb}mol/L je jedka: obvezno očala in rokavice. Za merjenje zadošča 1${nb}mol/L.`, "warn");
    faza = "prva";
    tRec = 0;
    nextAuto = interval;
    if (!tr && proc !== "titr" && proc !== "mg") B.pripravi2(c, 50);
    log.push(tr ? "V kalorimetru je 100 mL vode. Zapisuj začetno temperaturo." : `V kalorimetru je ${proc === "titr" ? 25 : 50}${nb}mL ${proc === "ocetna" ? "ocetne" : "klorovodikove"} kisline (${c}${nb}mol/L). Zapisuj začetno temperaturo.`, "ok");
    if (B.posoda === "casa") once("casa", "Steklena čaša pobere veliko toplote (~90 J/K) in jo hitro oddaja: izmerjena sprememba temperature bo manjša.", "warn");
    record();
  }
  function druga() {
    if (faza !== "prva") return log.push(faza === "prazno" ? "Najprej nalij prvo raztopino ali vodo." : "Snov si že dodal. Za nov poskus izprazni kalorimeter.", "warn");
    if (tRec < 60 && !OS) once("zgodaj", "Začetno temperaturo meri vsaj 1–2 minuti, da vidiš, ali je stalna.", "info");
    let r;
    const tr = ["NH4NO3", "NaOH", "CaCl2"].includes(proc);
    if (tr) r = B.stresi(proc, +gSel.get());
    else if (proc === "mg") {
      const [o, g] = mgSel.get().split(":");
      r = B.dodajMg(o, +g);
    } else {
      const d = B.druga;
      log.push(`Temperatura raztopine NaOH v merilnem valju: ${num(d.T, 1)}${nb}°C.`, "info");
      r = B.zlij();
    }
    if (!r.ok) return log.push("Brez zaščitnih očal ne! Najprej si nadeni očala.", "bad");
    if (r.jedko) log.push(tr ? "NaOH je jedek in se pri raztapljanju močno segreje: očala, rokavice, pelete jemlji z žličko, ne s prsti." : "NaOH 4 mol/L je zelo jedek: obvezno očala in rokavice. Raztopina se lahko močno segreje.", "warn");
    faza = "druga";
    record({ op: tr ? `${TRDNE[proc].formula} ${gSel.get()} g` : proc === "mg" ? "Mg" : "zlito" });
    log.push(tr ? `Stresel si ${gSel.get()}${nb}g ${TRDNE[proc].name}a v vodo.` : proc === "mg" ? "Dodal si magnezij v kislino. Vodik uhaja skozi luknjo v pokrovu." : "Zlil si NaOH v kalorimeter.", "ok");
    draw();
  }
  function titr() {
    if (faza === "prazno") return log.push("Najprej nalij 25 mL HCl v kalorimeter.", "warn");
    const r = B.titriraj(+dvSel.get(), +cSel.get());
    if (!r.ok) return log.push("Brez zaščitnih očal ne! Najprej si nadeni očala.", "bad");
    faza = "titr";
    log.push(`Iz birete si dodal ${dvSel.get()}${nb}mL NaOH (skupaj ${num(r.V, 0)}${nb}mL). Premešaj in počakaj, da se temperatura ustali, nato zapiši.`, "info");
    draw();
  }
  function record({ quiet = false, op = "" } = {}) {
    if (!B.w) return log.push("V kalorimetru ni ničesar.", "warn");
    const o = B.readT();
    const V = B.titr ? B.titr.V : proc === "titr" ? 0 : null;
    table.add({ t: num(tRec, 0), V: V == null ? "–" : num(V, 0), T: o.text.replace(".", ","), op }, { quiet });
    pts.push({ t: tRec, T: o.value, V, faza, op, mes: B.mesaj, dt: B.tMix != null ? B.t - B.tMix : null });
    if (faza === "druga" && !B.mesaj && B.tMix != null && B.t - B.tMix < 40) once("nemes", "Odčitek brez mešanja tik po dodatku: termometer kaže temperaturo plasti ob sondi, ne celotne raztopine.", "warn");
    redraw();
  }
  function redraw() {
    const tit = proc === "titr", graph = tit ? gTV : gTt;
    gTV.hidden = !tit;
    gTt.hidden = tit;
    const p = pts.filter((q) => Number.isFinite(q.T));
    const tMix = B.tMix;
    const out = [];
    let series;
    if (tit) {
      const q = p.filter((x) => x.V != null).map((x) => [x.V, x.T]);
      const ax = os(Math.max(30, ...q.map((x) => x[0])));
      const ys = q.map((x) => x[1]), y0 = Math.floor(Math.min(19, ...ys)), y1 = Math.ceil(Math.max(y0 + 5, ...ys) + 0.5);
      graph.setAxes({ x: [0, ax.top], xStep: ax.step, y: [y0, y1], yStep: y1 - y0 > 10 ? 2 : 1 });
      series = [{ id: "T", pts: q, cls: "a", shape: "o", label: "T(V)" }];
      if (q.length >= 4) {
        const mx = q.reduce((a, b) => (b[1] > a[1] ? b : a));
        out.push(`<p>Najvišja temperatura pri <i>V</i> = ${num(mx[0], 0)}${nb}mL NaOH: ekvivalentna točka. ${OS ? "" : `${tex(String.raw`c(\mathrm{HCl}) = \frac{c(\mathrm{NaOH})\,V}{25${en("mL")}} \approx ${num((+cSel.get() * mx[0]) / 25, 2)}${en("mol/L")}`)}.`}</p>`);
      }
    } else {
      const q = p.map((x) => [x.t, x.T]);
      const ax = os(Math.max(300, ...q.map((x) => x[0])));
      const ys = q.map((x) => x[1]), y0 = Math.floor(Math.min(18, ...ys) - 0.5), y1 = Math.ceil(Math.max(y0 + 6, ...ys) + 0.5);
      graph.setAxes({ x: [0, ax.top], xStep: ax.step, y: [y0, y1], yStep: y1 - y0 > 20 ? 5 : y1 - y0 > 8 ? 2 : 1 });
      const pred = p.filter((x) => x.faza === "prva"), po = p.filter((x) => x.faza !== "prva");
      series = [{ id: "pred", pts: pred.map((x) => [x.t, x.T]), cls: "a", shape: "o", label: "pred dodatkom" }, { id: "po", pts: po.map((x) => [x.t, x.T]), cls: "b", shape: "^", label: "po dodatku" }];
      if (tMix != null && pred.length && po.length >= 4) {
        const T0 = pred.reduce((a, x) => a + x.T, 0) / pred.length;
        const endo = proc === "NH4NO3";
        const e = ekstrapolacija(po.map((x) => [x.t, x.T]), tMix, { endo });
        const ext = po.reduce((a, x) => ((endo ? x.T < a.T : x.T > a.T) ? x : a));
        if (e && !OS) series.push({ id: "ex", pts: [[tMix, e.T]], cls: "c", shape: "^", label: "ekstrapolacija", line: (x) => e.T + e.k * (x - tMix) });
        const dTe = e ? e.T - (proc === "nevtr" || proc === "ocetna" ? (T0 + B.druga.T) / 2 : T0) : null;
        const T0m = proc === "nevtr" || proc === "ocetna" ? (T0 + B.druga.T) / 2 : T0;
        const dTm = ext.T - T0m;
        if (OS) out.push(`<p>Začetna temperatura ${num(T0m, 1)}${nb}°C, ${endo ? "najnižja" : "najvišja"} ${num(ext.T, 1)}${nb}°C: temperatura se je ${dTm > 0 ? "zvišala" : "znižala"} za ${num(Math.abs(dTm), 1)}${nb}°C → ${dTm > 0 ? "<b>eksotermna</b> sprememba (sprošča toploto v okolico)" : "<b>endotermna</b> sprememba (prejema toploto iz okolice)"}.</p>`);
        else {
          const tr = ["NH4NO3", "NaOH", "CaCl2"].includes(proc);
          const m = tr ? 100 + +gSel.get() : proc === "mg" ? 50 : 100, n = B.nReakcija();
          const lit = proc === "nevtr" ? DH.nevtr : proc === "ocetna" ? DH.ocetna : proc === "mg" ? DH.Mg : TRDNE[proc].dH;
          out.push(`<p>Začetna temperatura <i>T</i><sub>0</sub> = ${num(T0m, 1)}${nb}°C${proc === "nevtr" || proc === "ocetna" ? " (povprečje obeh raztopin)" : ""}; ${endo ? "najnižja" : "najvišja"} izmerjena ${num(ext.T, 1)}${nb}°C (Δ<i>T</i> = ${num(dTm, 1)}${nb}K)${e ? `; z ekstrapolacijo do časa mešanja ${num(e.T, 1)}${nb}°C (Δ<i>T</i> = ${num(dTe, 1)}${nb}K)` : ""}.</p>`);
          if (e) out.push(`${texBlock(String.raw`\Delta H = -\dfrac{mc\,\Delta T}{n} = -\dfrac{${num(m, 0)}${en("g")} \cdot 4{,}18${en("J/(g K)")} \cdot ${dTe < 0 ? `(${num(dTe, 1)}${en("K")})` : `${num(dTe, 1)}${en("K")}`}}{${num(n * 1000, 1)}${en("mmol")}} = ${rez(num(entalpija({ m, dT: dTe, n }), 1), "kJ/mol")}`)}<p>Literatura: ${num(lit, 1)}${nb}kJ/mol; brez ekstrapolacije ${num(entalpija({ m, dT: dTm, n }), 1)}${nb}kJ/mol.</p>`);
        }
      }
    }
    graph.draw(series);
    calc.innerHTML = out.join("");
    if (!asked && pts.filter((x) => x.faza !== "prva").length >= 6) {
      asked = true;
      qBox.append(conclusion(OS ? {
        text: "Kaj si ugotovil o energiji pri kemijskih reakcijah in raztapljanju?",
        options: [
          { t: "Pri eksotermni spremembi se okolica (raztopina) segreje, ker se toplota sprošča; pri endotermni (raztapljanje NH₄NO₃) se ohladi, ker se toplota porablja.", ok: true, why: "Nevtralizacija, raztapljanje NaOH in CaCl₂ ter magnezij s kislino sproščajo toploto: termometer pokaže višjo temperaturo. Amonijev nitrat pri raztapljanju toploto prejema iz vode, zato se ta ohladi (tako delujejo hladilni obkladki)." },
          { t: "Pri vseh reakcijah se raztopina segreje.", ok: false, why: "Pri raztapljanju amonijevega nitrata se je temperatura znižala: to je endotermna sprememba." },
          { t: "Ko se raztopina ohladi, reakcija sprošča mraz.", ok: false, why: "»Mraza« ni: pri endotermni spremembi snov prejema toploto iz okolice (vode), zato se ta ohladi." },
          { t: "Pokrov in lonček iz stiropora nista pomembna.", ok: false, why: "Brez pokrova in v stekleni čaši toplota hitro uhaja, zato je sprememba temperature manjša, kot bi morala biti." },
        ],
      } : {
        text: "Zakaj je izmerjena |Δ<i>H</i>| nevtralizacije običajno manjša od literaturne vrednosti −57,1 kJ/mol?",
        options: [
          { t: "Del sproščene toplote segreje lonček, termometer in zrak ter uide skozi steno in pokrov; ekstrapolacija popravi le izgube po mešanju, toplotne kapacitete posode pa ne.", ok: true, why: `Reakcija je eksotermna (Δ<i>H</i> < 0). V računu ${tex(String.raw`-\frac{mc\,\Delta T}{n}`)} upoštevamo le raztopino. Lonček iz stiropora pobere le nekaj J/K, steklena čaša pa ~90 J/K (≈ 20 % toplotne kapacitete 100 g vode) in še hitro oddaja toploto, zato je tam |Δ<i>H</i>| očitno manjša. Ekstrapolacija premice ohlajanja nazaj do časa mešanja popravi ohlajanje med meritvijo.` },
          { t: "Ker je nevtralizacija endotermna reakcija.", ok: false, why: "Temperatura se je zvišala: sistem je oddal toploto v raztopino, reakcija je eksotermna, Δ<i>H</i> < 0." },
          { t: "Ker termometer kaže preveč.", ok: false, why: "Stalna napaka termometra se v razliki Δ<i>T</i> odšteje. Manjša |Δ<i>H</i>| je posledica toplote, ki ne ostane v raztopini." },
          { t: "Ker je bilo premalo NaOH.", ok: false, why: "V računu uporabimo množino omejitvenega reaktanta (<i>n</i> nastale vode). Pri 50 mL 1 M HCl in 50 mL 1 M NaOH je to 50 mmol." },
        ],
      }));
    }
  }
  ticker(el, (dt) => {
    const d = dt * speed;
    B.step(d);
    if (B.w) tRec += d;
    const o = (zadnji = B.readT());
    thL.set(B.w ? o.text : "", "°C", B.termometer === "stekleni" ? "razdelki 0,5 °C" : "±0,5 °C, 0,1 °C");
    swL.set(B.w ? ura(tRec) : "", "", B.w ? "od nalivanja" : "");
    buL.set(B.titr ? num(B.titr.V, 1) : "0,0", "mL", "NaOH v bireti");
    if (B.w && interval && proc !== "titr" && tRec >= nextAuto) {
      record({ quiet: true });
      nextAuto += interval;
    }
    if (B.w && B.T > 45) once("vroce", `Raztopina je vroča (${num(B.T, 0)}${nb}°C). Lončka ne drži v roki.`, "warn");
    draw();
  });
  function draw() {
    gD.replaceChildren();
    P.begin();
    s("rect", { x: 0, y: yB, width: W, height: H - yB, fill: u(svg, "miza") }, gD);
    const cx = 110, w = B.w, sty = B.posoda === "stiropor";
    // lonček iz stiropora Ø 7,5 cm (zgoraj 8,5 cm), višina 9,5 cm, v čaši 400 mL; ali čaša 400 mL (Ø 7,6 × 11 cm)
    const top = yB - (sty ? 9.5 : 11) * S, bw = (sty ? 7.5 : 7.6) * S, tw = (sty ? 8.5 : 7.6) * S;
    if (sty) steklo(gD, svg, cx - 4.6 * S, yB - 7 * S, 9.2 * S, 7 * S, { rx: 4 });
    const mm = w ? w.m * 1000 : 0, Ab = Math.PI * (bw / S / 2) ** 2, hh = (mm / Ab) * S;
    const yL = yB - 3 - hh;
    const tCol = B.w ? Math.min(1, Math.abs(B.T - 20) / 25) : 0;
    const liq = B.w ? (B.T > 20 ? `rgb(${Math.round(214 + 30 * tCol)} ${Math.round(228 - 20 * tCol)} ${Math.round(238 - 50 * tCol)} / 0.7)` : `rgb(${Math.round(214 - 40 * tCol)} ${Math.round(230)} ${Math.round(238 + 17 * tCol)} / 0.7)`) : null;
    const wAt = (y) => bw + ((yB - y) / (yB - top)) * (tw - bw);
    if (w) {
      s("path", { d: `M${cx - wAt(yL) / 2 + 2},${yL} H${cx + wAt(yL) / 2 - 2} L${cx + bw / 2 - 2},${yB - 3} H${cx - bw / 2 + 2} Z`, fill: liq, class: "lab-ek-liq" }, gD);
      s("path", { d: `M${cx - wAt(yL) / 2 + 2},${yL - 1} Q${cx},${yL + 1.5} ${cx + wAt(yL) / 2 - 2},${yL - 1}`, class: "lab-ek-menisk" }, gD);
      const R = B.reak;
      if (R?.tip === "trdna" && R.n > 1e-5) {
        const f = Math.min(1, (R.n / B.nReakcija()) ** 0.5);
        for (let i = 0; i < Math.ceil(14 * f); i++) {
          const x = cx - bw / 2 + 8 + pseudo(i, 1) * (bw - 16), y = yB - 5 - pseudo(i, 2) * 3;
          if (R.snov === "NaOH") s("ellipse", { cx: x, cy: y, rx: 3.5, ry: 1.6, fill: "#f6f6f2", stroke: "#bdbdb4", "stroke-width": 0.4 }, gD);
          else s("rect", { x: x - 1.5, y: y - 1.5, width: 3, height: 2.6, fill: "#fbfbf8", stroke: "#bdbdb4", "stroke-width": 0.4 }, gD);
        }
      }
      if (R?.tip === "mg" && R.m > 1e-5) {
        const f = (R.m / R.m0) ** 0.5;
        if (R.oblika === "trak") s("path", { d: `M${cx - 20 * f},${yL + 10} q${10 * f},-4 ${20 * f},0 t${20 * f},0`, fill: "none", stroke: u(svg, "m-Mg"), "stroke-width": 3, "stroke-linecap": "round" }, gD);
        else s("path", { d: `M${cx - 22},${yB - 4} Q${cx},${yB - 4 - 4 * f} ${cx + 22},${yB - 4} Z`, fill: "#c3c9d0" }, gD);
        mehurcki(P.g, { x: cx, w: bw * 0.6, y0: yB - 5, y1: yL + 1, n: 14, r: [0.5, 1.3], v: 150 });
      }
    }
    // posoda
    const body = `M${cx - tw / 2},${top} L${cx - bw / 2},${yB} H${cx + bw / 2} L${cx + tw / 2},${top}`;
    if (sty) {
      // prerez lončka: neprozorne stene iz stiropora (~3 mm), znotraj raztopina
      const t = 3.5;
      for (const k of [-1, 1]) {
        s("path", { d: `M${cx + (k * tw) / 2},${top} L${cx + (k * bw) / 2},${yB} L${cx + k * (bw / 2 - t)},${yB - t} L${cx + k * (tw / 2 - t)},${top} Z`, fill: u(svg, "stiropor"), stroke: "#7f878e", "stroke-width": 1 }, gD);
        for (let i = 0; i < 26; i++) {
          const q = pseudo(i, 8 + k), y = top + q * (yB - top);
          s("circle", { cx: cx + k * (wAt(y) / 2 - 1.2 - pseudo(i, 9) * 1.6), cy: y, r: 0.7, class: "lab-rk-pena" }, gD);
        }
      }
      s("rect", { x: cx - bw / 2, y: yB - t, width: bw, height: t, fill: u(svg, "stiropor"), stroke: "#7f878e", "stroke-width": 1 }, gD);
      s("path", { d: `M${cx - tw / 2 - 1.5},${top} h${tw + 3}`, stroke: "#e4e7e9", "stroke-width": 2.6, "stroke-linecap": "round" }, gD);
    } else steklo(gD, svg, cx - bw / 2, top, bw, yB - top, { rx: 3 });
    // pokrov, termometer, mešalo
    const xs = cx + 12, xm = cx - 16;
    if (B.termometer === "digitalni") {
      s("rect", { x: xs - 1.5, y: top - 70, width: 3, height: yB - 12 - top + 70, rx: 1.2, fill: u(svg, "sonda") }, gD);
      s("rect", { x: xs - 5, y: top - 92, width: 10, height: 24, rx: 3, fill: "#2c3238" }, gD);
      s("path", { d: `M${xs},${top - 92} q0,-14 40,-16 H${W - 150}`, class: "lab-top-cable" }, gD);
      s("rect", { x: W - 150, y: top - 126, width: 70, height: 40, rx: 6, fill: u(svg, "ohisje") }, gD);
      zaslon(gD, svg, W - 145, top - 120, 60, 22, B.w ? zadnji.text : "–", "°C");
    } else {
      s("rect", { x: xs - 2.5, y: top - 110, width: 5, height: yB - 10 - top + 110, rx: 2.5, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gD);
      const Tr = B.w ? (B.Tp2 ?? B.T) : 20;
      const yZ = (T) => yB - 22 - (T - 0) * 1.6;
      s("rect", { x: xs - 0.8, y: yZ(Math.max(0, Tr)), width: 1.6, height: yB - 14 - yZ(Math.max(0, Tr)), fill: "#c62828" }, gD);
      s("circle", { cx: xs, cy: yB - 12, r: 3, fill: "#c62828" }, gD);
      lupaTerm(Tr, xs, yZ);
    }
    s("path", { d: `M${xm},${top - 40} V${yB - 10} M${xm - 6},${yB - 10} h12`, stroke: "#c9d2d8", "stroke-width": 2.2, "stroke-linecap": "round", transform: B.mesaj ? `translate(${(Math.sin(performance.now() / 300) * 3).toFixed(1)},0)` : "" }, gD);
    if (B.pokrov) s("rect", { x: cx - tw / 2 - 3, y: top - 5, width: tw + 6, height: 5, rx: 1.5, fill: sty ? "#eceeef" : "#dde6ee", stroke: "#a8aeb3", "stroke-width": 0.8 }, gD);
    label(gD, cx, yB + 12, sty ? "lonček iz stiropora (prerez)" : "steklena čaša 400 mL", "lab-ek-miza small");
    // merilni valj 100 mL z drugo raztopino ali bireta
    if (proc === "titr") {
      const bx = cx + 30, Vb = 50 - (B.titr?.V ?? 0), bt = 16, bl = top - 50 - bt;
      stojalo(gD, svg, 196, 8, yB, 50);
      s("rect", { x: 191, y: 45, width: 10, height: 10, rx: 1.5, fill: "#5a626b" }, gD);
      s("rect", { x: bx + 4, y: 48.4, width: 191 - bx - 4, height: 3.2, fill: u(svg, "palica") }, gD);
      s("path", { d: `M${bx - 6},${46} h12 v8 h-12 Z`, fill: "none", stroke: "#5a626b", "stroke-width": 2.2 }, gD);
      s("rect", { x: bx - 3.5, y: bt + (1 - Vb / 50) * bl, width: 7, height: (Vb / 50) * bl, fill: "rgb(214 230 238 / 0.7)" }, gD);
      steklo(gD, svg, bx - 4, bt, 8, bl + 6, { rx: 2 });
      for (let v = 0; v <= 50; v += 5) s("line", { x1: bx + 4, y1: bt + (v / 50) * bl, x2: bx + (v % 10 ? 1.5 : 0), y2: bt + (v / 50) * bl, class: "lab-ek-tick" }, gD);
      s("path", { d: `M${bx - 1.5},${bt + bl + 6} h3 l-1,12 h-1 Z`, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gD);
      s("rect", { x: bx - 5, y: bt + bl + 8, width: 10, height: 3, rx: 1, fill: "#2f6fb3" }, gD);
      label(gD, 206, bt + 70, "bireta 50 mL", "tick small", "start");
      label(gD, 206, bt + 84, `NaOH ${cSel.get()} mol/L`, "tick small", "start");
    } else if (proc === "nevtr" || proc === "ocetna") {
      const vx = 335, vw = 2.8 * S, vh = 15 * S, full = faza === "prva" ? 1 : 0;
      s("rect", { x: vx - vw / 2 - 6, y: yB - 4, width: vw + 12, height: 4, rx: 1.5, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gD);
      if (full) tekocina(gD, svg, vx - vw / 2 + 1.5, yB - 4 - 0.5 * vh * 0.9, vw - 3, 0.5 * vh * 0.9, "rgb(214 230 238 / 0.65)");
      steklo(gD, svg, vx - vw / 2, yB - 4 - vh, vw, vh, { rx: 1 });
      for (let v = 0; v <= 100; v += 10) s("line", { x1: vx - vw / 2 + 1, y1: yB - 4 - (v / 100) * vh * 0.9, x2: vx - vw / 2 + (v % 50 ? 5 : 8), y2: yB - 4 - (v / 100) * vh * 0.9, class: "lab-ek-tick" }, gD);
      label(gD, vx, yB + 12, "merilni valj: NaOH", "lab-ek-miza small");
    } else if (["NH4NO3", "NaOH", "CaCl2", "mg"].includes(proc)) {
      const gx = 335;
      s("ellipse", { cx: gx, cy: yB - 3, rx: 22, ry: 4, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gD);
      if (faza === "prva" || faza === "prazno") s("path", { d: `M${gx - 12},${yB - 4} Q${gx},${yB - 11} ${gx + 12},${yB - 4} Z`, fill: proc === "mg" ? "#c3c9d0" : "#f8f8f4", stroke: "#b5b5aa", "stroke-width": 0.5 }, gD);
      label(gD, gx, yB + 12, proc === "mg" ? "magnezij" : TRDNE[proc].formula, "lab-ek-miza small");
    }
    if (!B.ocala) label(gD, 150, 14, "brez zaščitnih očal", "lab-warn");
    if (speed > 1) label(gD, 8, 20, `čas teče ×${speed}`, "lab-warn small", "start");
    merilo(gD, 222, H - 4, S);
    P.commit();
  }
  // Povečava steklenega termometra (razdelki po 0,5 °C).
  function lupaTerm(T, xs, yZ) {
    const lx = 200, ly = 130, lw = 76, lh = 96, id = `${svg.uid}-lt`, k = 14; // 14 enot na °C
    s("rect", { x: lx, y: ly, width: lw, height: lh, rx: 8 }, s("clipPath", { id }, s("defs", {}, gD)));
    s("rect", { x: lx, y: ly, width: lw, height: lh, rx: 8, class: "lab-sil-lupa-bg" }, gD);
    const c = s("g", { "clip-path": `url(#${id})` }, gD), ym = ly + lh / 2, Y = (q) => ym - (q - T) * k;
    s("rect", { x: lx + 26, y: ly, width: 14, height: lh, fill: u(svg, "steklo") }, c);
    s("rect", { x: lx + 31, y: ym, width: 4, height: lh, fill: "#c62828" }, c);
    for (let q = Math.floor(T - 4) * 2; q <= Math.ceil(T + 4) * 2; q++) {
      const v = q / 2, y = Y(v);
      s("line", { x1: lx + 40, y1: y, x2: lx + 40 + (q % 2 ? 6 : 12), y2: y, class: "lab-sil-tick" }, c);
      if (q % 2 === 0) label(c, lx + 62, y, String(v), "tick b");
    }
    s("rect", { x: lx, y: ly, width: lw, height: lh, rx: 8, class: "lab-sil-lupa-frame" }, gD);
    s("line", { x1: xs + 3, y1: yZ(T), x2: lx, y2: ym, class: "lab-tit-sight" }, gD);
    label(gD, lx + lw / 2, ly + lh + 10, "povečano: °C", "tick small");
  }
  syncP();
}

// ================================================================ 3. plamenska reakcija
const VZ_OPTS = (B) => Object.entries(B.vzorci).map(([k, v]) => [k, v.neznan ? v.name : `${v.name} (${IONI[k].name})`]);
const ION_OPTS = [["", "– izberi –"], ...Object.entries(IONI).map(([k, v]) => [k, `${v.ion} (${v.name})`]), ["Na+K", "Na⁺ in K⁺"]];
export function labPlamenska(el, opts = {}) {
  const OS = opts.raven === "os";
  const B = new PlamenBench({ seed: seme() });
  const W = 400, H = 300, S = 10, yB = 286; // 1 cm = 10 enot
  const svg = svgBox(W, H, "lab-bench lab-ek lab-rk lab-rk-pl");
  grad(svg);
  const gD = s("g", {}, svg);
  const P = plastMehurckov(svg, W, H);
  const log = eventLog();
  const stL = lcd("zanka"), plL = lcd("plamen");
  const said = {};
  const once = (k, text, kind = "warn") => said[k] || ((said[k] = true), log.push(text, kind));
  let vz = "Na", spek = true, asked = false, zadnjeCrte = [];
  const rows = [];
  const table = dataTable([{ key: "v", label: "vzorec" }, { key: "b", label: "barva" }, ...(OS ? [] : [{ key: "l", label: "črte [nm]" }]), { key: "i", label: "ion" }, { key: "ok", label: "" }], { empty: "Še ni zapisov. Očisti zanko, zajemi vzorec, drži ga v plamenu in zapiši barvo in ion." });
  table.classList.add("lab-rk-tab");
  const calc = h("div", { class: "lab-ek-calc", "aria-live": "polite" });
  const qBox = h("div");
  const goggles = toggle("zaščitna očala", false, (v) => ((B.ocala = v), v && log.push("Nadel si si zaščitna očala.", "ok")));
  const onT = toggle("plin odprt in gorilnik prižgan", false, (v) => ((B.prizgan = v), log.push(v ? (B.zrak < 0.3 ? "Gorilnik gori s svetlim, rumenim plamenom (zračna odprtina je zaprta)." : "Gorilnik gori.") : "Gorilnik je ugasnjen.", "info")));
  const zrSeg = row("zračna odprtina", seg("zračna odprtina", [["0", "zaprta"], ["0.5", "pol odprta"], ["1", "odprta"]], "0", (v) => ((B.zrak = +v), log.push(+v === 1 ? "Zračna odprtina je odprta: nesvetel, modrikast plamen z modrim notranjim stožcem; najbolj vroč je tik nad vrhom stožca." : +v ? "Zračna odprtina je pol odprta." : "Zračna odprtina je zaprta: svetel rumen plamen s sajami. V njem barv ne boš videl.", +v ? "info" : "warn"))));
  const cistiBtn = button("Očisti zanko: v HCl, nato žari", () => cisti());
  const namBtn = button("Pomoči zanko v HCl", () => (B.namoci(), log.push("Zanko si pomočil v koncentrirano HCl: sol se bo bolje prijela (kloridi so hlapnejši).", "info")));
  const vzSel = select({ label: "vzorec na urnem steklu", options: VZ_OPTS(B), value: vz, onChange: (v) => (vz = v) });
  const zajBtn = button("Zajemi vzorec z zanko", () => zajemi(), "primary small");
  const inT = toggle("drži zanko v plamenu", false, (v) => ((B.vPlamenu = v), v && !B.prizgan && log.push("Gorilnik ne gori.", "info")));
  const coT = toggle("glej skozi modro kobaltovo steklo", false, (v) => ((B.steklo = v), v && log.push("Kobaltovo steklo zadrži rumeno svetlobo natrija, prepusti pa modro in temno rdečo.", "info")));
  const spT = toggle("ročni spektroskop", true, (v) => ((spek = v), draw()));
  const bSel = select({ label: "barva plamena (kaj vidiš)", options: [["", "– izberi –"], ...BARVE_PLAMENA.map((b) => [b, b]), ["brez barve", "brez (ni barve)"]], value: "" });
  const iSel = select({ label: "ion v vzorcu", options: ION_OPTS, value: "" });
  const recBtn = button("Zapiši v preglednico", () => record(), "primary small");
  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(P.wrap, h("div", { class: "lab-meters" }, stL, plL)), controlsBox(
        grp("1. Gorilnik", hint("Očala! Koncentrirana HCl je jedka in hlapi; plamen ima ~1500 °C. Zračna odprtina na cevi gorilnika uravnava dotok zraka."), goggles, onT, zrSeg),
        grp("2. Zanka iz nikroma", hint("Čista zanka plamena ne obarva. Ostanki natrija s prstov ali prejšnjega vzorca obarvajo plamen rumeno."), buttons(cistiBtn, namBtn), vzSel, buttons(zajBtn), inT),
        grp("3. Opazuj", coT, spT, bSel, iSel, buttons(recBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Preglednica"), table, calc, qBox,
      notes(POENOSTAVITVE_REAKCIJE.plamenska, "Valovne dolžine črt: NIST Atomic Spectra Database (zrak), v nm. Li: 670,78. Na: 588,995 in 589,592. K: 766,49; 769,90 in 404,41. Ca: 422,67. Sr: 460,73. Ba: 553,55. Cu: 510,55; 515,32 in 521,82. Molekulski pasovi CaOH, SrOH, BaCl, CuCl: Pearse in Gaydon (ocena vrhov). Barva iz CIE 1931 (Wyman in sod. 2013) v sRGB. Ocene: jakosti, hlapnost, prepustnost kobaltovega stekla."),
    ],
    tryText: OS
      ? "Odpri zračno odprtino, očisti zanko in preizkusi vseh sedem soli. Zapiši barvo plamena za vsak element. Nato ugotovi, kateri ion je v neznanih vzorcih. Pri enem je skrit tudi kalij: poglej skozi modro steklo."
      : "Preizkusi znane soli in s spektroskopom odčitaj črte. Nato določi ione v štirih neznanih vzorcih. Zakaj natrij prekrije kalij in kako ga vseeno odkriješ? Izračunaj energijo fotona natrijeve črte E = hc/λ.",
  });
  el.classList.add("lab");
  function cisti() {
    if (!B.ocala) return log.push("Brez zaščitnih očal ne delaj s koncentrirano HCl!", "bad");
    if (!B.prizgan) return log.push("Prižgi gorilnik: zanko po namakanju v HCl žariš v plamenu.", "info");
    const o = B.ocisti();
    const Na = B.zanka.Na ?? 0;
    log.push(o * 10 > 0.05 ? `Zanko si pomočil v HCl in žaril: plamen je še ${Na > 0.002 ? "rumen" : "rahlo obarvan"}. Ponovi.` : "Plamen ostane brezbarven: zanka je čista.", o * 10 > 0.05 ? "info" : "ok");
  }
  function zajemi() {
    const umazana = B.ostanek() > 0.01;
    const r = B.zajemi(vz);
    if (r.ok && umazana) log.push("Zanka ni bila čista: na njej je še natrij ali prejšnji vzorec. Plamen bo obarvan tudi z njima.", "warn");
    if (!r.ok) return log.push("Brez zaščitnih očal ne!", "bad");
    if (r.slabo) log.push("Zanka ni bila pomočena v HCl: sol se je slabo prijela, plamen bo komaj obarvan.", "warn");
    log.push(`Zajel si vzorec: ${B.vzorci[vz].name}. Drži zanko na robu plamena.`, "info");
  }
  function record() {
    const b = bSel.get(), i = iSel.get();
    if (!b || !i) return log.push("Izberi barvo plamena in ion, ki ga sklepaš.", "warn");
    const V = B.vzorci[B.zadnji ?? vz], sest = Object.keys(V.sestava).sort().join("+");
    const prav = (i === "Na+K" ? "K+Na" : i) === sest;
    const l = zadnjeCrte.length ? zadnjeCrte.slice(0, 3).map((c) => (c.crta ? String(c.odcitek) : `~${c.odcitek} (pas)`)).join(", ") : "–";
    rows.push({ v: V.name, b, i, prav });
    table.add({ v: V.name, b, l, i: i === "Na+K" ? "Na⁺, K⁺" : IONI[i].ion, ok: V.neznan ? (prav ? "✓" : "✗") : prav ? "✓" : "✗" });
    if (!prav) log.push(V.neznan ? "Ne čisto: v tem vzorcu je drug ion. Očisti zanko in preizkusi znova; primerjaj z znanimi solmi." : "Ta sol ne vsebuje izbranega iona.", "warn");
    const nX = rows.filter((r) => r.prav && r.v.startsWith("neznani")).length;
    calc.innerHTML = `<p>Pravilno določenih neznanih vzorcev: ${new Set(rows.filter((r) => r.prav && r.v.startsWith("neznani")).map((r) => r.v)).size} od 4.</p>` + (!OS && zadnjeCrte[0] ? `<p class="lab-rk-eq">Najsvetlejša ${zadnjeCrte[0].crta ? "črta" : "črta (pas)"} ${zadnjeCrte[0].odcitek}${nb}nm: ${tex(String.raw`E = \frac{hc}{\lambda} = ${num(energijaFotona(zadnjeCrte[0].l) * 1e19, 2)} \cdot 10^{-19}${en("J")} = ${num(energijaFotona(zadnjeCrte[0].l) / E_NAB, 2)}${en("eV")}`)}.</p>` : "");
    if (!asked && rows.length >= 4 && nX >= 1) {
      asked = true;
      qBox.append(conclusion(OS ? {
        text: "Zakaj ima plamen pri vsakem elementu drugačno barvo?",
        options: [
          { t: "Vsak element ima svojo razporeditev elektronov. V vročem plamenu elektroni preskočijo na višjo lupino in pri vrnitvi oddajo svetlobo, ki je značilna za ta element.", ok: true, why: "Zato lahko element prepoznamo po barvi plamena: natrij rumeno, litij karminasto rdeče, baker modro zeleno. Tako nastanejo tudi barve ognjemetov." },
          { t: "Barvo da klor, ki je v vseh vzorcih.", ok: false, why: "Vsi vzorci so kloridi, a imajo različne barve plamena. Barvo določa kovina (njen ion), ne klor." },
          { t: "Sol v plamenu zgori in dim je obarvan.", ok: false, why: "Svetlobo oddajajo atomi kovine, ki jih plamen vzbudi; ne gre za dim." },
          { t: "Barva je odvisna od tega, kako dolgo držimo zanko v plamenu.", ok: false, why: "Barva je značilna za element; s časom le zbledi, ker sol izhlapi." },
        ],
      } : {
        text: "Kaj pojasni, zakaj ima vsak element svoje črte v spektru plamena?",
        options: [
          { t: "Elektroni v atomu imajo le določene energije. V plamenu atom prejme energijo, elektron preide v višje stanje in pri prehodu nazaj odda foton z energijo <i>E</i> = <i>hc</i>/λ, ki je enaka razliki energij stanj – ta je za vsak element drugačna.", ok: true, why: "Natrijeva črta 589 nm ustreza 2,1 eV (prehod 3p → 3s). Ker so energijski nivoji za vsak element drugačni, je spekter »prstni odtis« elementa. Natrij sveti tako močno, da prekrije druge elemente; kalij odkrijemo skozi kobaltovo steklo, ki zadrži rumeno svetlobo." },
          { t: "Plamen segreje sol in ta seva zvezen spekter kot žareče telo.", ok: false, why: "V spektroskopu vidimo ostre črte (in pri Ca, Sr, Ba pasove molekul), ne zveznega spektra. Zvezen spekter da le svetel plamen s sajami." },
          { t: "Daljša valovna dolžina pomeni večjo energijo fotona.", ok: false, why: "<i>E</i> = <i>hc</i>/λ: rdeča črta litija (671 nm, 1,85 eV) ima manj energije kot rumena natrijeva (589 nm, 2,10 eV)." },
          { t: "Barvo plamena dajo kloridni ioni.", ok: false, why: "Vsi vzorci so kloridi, a imajo različne črte. Svetlobo oddajajo atomi kovine." },
        ],
      }));
    }
  }
  ticker(el, (dt) => {
    B.step(dt);
    const sol = Object.entries(B.zanka).filter(([, n]) => n > 0.002);
    stL.set(sol.length ? "vzorec" : "čista", "", B.vPlamenu ? "v plamenu" : "zunaj plamena");
    const vid = B.vidnostSoli();
    plL.set(!B.prizgan ? "ugasnjen" : B.zrak < 0.3 ? "svetel" : "nesvetel", "", B.prizgan && B.vPlamenu && vid > 0.3 ? `obarvan: ${rgbIme()}` : B.prizgan && B.zrak < 0.3 && B.vPlamenu ? "barve ni videti" : "");
    if (B.vPlamenu && B.prizgan) zadnjeCrte = B.odcitajCrte().length && vid > 0.2 ? B.odcitajCrte() : zadnjeCrte;
    if (B.vPlamenu && B.prizgan && B.zrak < 0.3) once("svetel", "V svetlem rumenem plamenu barve soli skoraj ne vidiš. Odpri zračno odprtino.", "warn");
    if (B.vPlamenu && B.prizgan && (B.zanka.Na ?? 0) > 0.01 && Object.keys(B.vzorci[B.zadnji ?? "Na"]?.sestava ?? {}).every((e) => e !== "Na")) once(`na-${B.zadnji}-${B.cistil}`, "Plamen je rumen od natrija na umazani zanki in prekrije barvo vzorca. Očisti zanko!", "warn");
    draw();
  });
  function draw() {
    gD.replaceChildren();
    P.begin();
    s("rect", { x: 0, y: yB, width: W, height: H - yB, fill: u(svg, "miza") }, gD);
    const bx = 90; // os gorilnika
    // podnožje Ø 9 cm, cev Ø 1,1 cm × 12 cm, zračna odprtina 3 cm nad podnožjem
    s("path", { d: `M${bx - 45},${yB} L${bx - 38},${yB - 12} H${bx + 38} L${bx + 45},${yB} Z`, fill: "#3a3f45", stroke: "#22262a", "stroke-width": 1 }, gD);
    s("rect", { x: bx + 30, y: yB - 9, width: 26, height: 5, rx: 2, fill: u(svg, "medenina") }, gD);
    s("path", { d: `M${bx + 56},${yB - 6.5} H${W - 10}`, stroke: "#c4562c", "stroke-width": 7, "stroke-linecap": "round" }, gD);
    s("path", { d: `M${bx + 56},${yB - 8} H${W - 10}`, stroke: "rgb(255 255 255 / 0.3)", "stroke-width": 1.5 }, gD);
    const ct = yB - 12 - 12 * S;
    s("rect", { x: bx - 5.5, y: ct, width: 11, height: 12 * S, fill: u(svg, "medenina") }, gD);
    // vrtljiv obroč z odprtino
    const ry = yB - 12 - 3 * S;
    s("rect", { x: bx - 7, y: ry - 8, width: 14, height: 16, rx: 1.5, fill: u(svg, "medenina"), stroke: "#6d4f17", "stroke-width": 0.6 }, gD);
    s("rect", { x: bx - 3.5, y: ry - 4, width: 7 * B.zrak + 0.01, height: 8, fill: "#1b1b1b" }, gD);
    label(gD, bx - 12, ry, "zrak", "tick small", "end");
    label(gD, bx, yB + 9, "plinski gorilnik", "lab-ek-miza small");
    // plamen (v plasti, s plapolanjem)
    if (B.prizgan) plamen(bx, ct);
    // zanka: nikromova žica na držalu (stekleni ročaj)
    const inF = B.vPlamenu, lx = inF ? bx + 27 : 210, ly = inF ? ct - 26.5 : 190;
    s("path", { d: `M${lx + 4},${ly} L${lx + 90},${ly + 40}`, stroke: "#b9a27a", "stroke-width": 5, "stroke-linecap": "round" }, gD);
    s("path", { d: `M${lx + 4},${ly} L${lx - 22},${ly - 12}`, stroke: "#8f8f8f", "stroke-width": 1, fill: "none" }, gD);
    const hot = inF && B.prizgan;
    s("circle", { cx: lx - 25, cy: ly - 13.5, r: 3, fill: "none", stroke: hot ? "#ff8a2a" : "#8f8f8f", "stroke-width": 1.1 }, gD);
    const sol = Object.entries(B.zanka).filter(([, n]) => n > 0.01);
    if (sol.length) s("circle", { cx: lx - 25, cy: ly - 13.5, r: 2.2, fill: "rgb(250 250 245 / 0.85)" }, gD);
    // urno steklo z vzorcem in čaša s HCl
    const V = B.vzorci[vz], cu = Object.keys(V.sestava).includes("Cu") && !V.neznan;
    s("ellipse", { cx: 330, cy: yB - 3, rx: 24, ry: 4, fill: u(svg, "steklo"), class: "lab-ek-glass" }, gD);
    s("path", { d: `M${318},${yB - 4} Q${330},${yB - 11} ${342},${yB - 4} Z`, fill: cu || V.sestava.Cu ? "#5fb3a0" : "#f8f8f4", stroke: "#b5b5aa", "stroke-width": 0.5 }, gD);
    label(gD, 330, yB + 9, V.neznan ? V.name.replace("neznani vzorec", "vzorec X") : V.name, "lab-ek-miza small");
    tekocina(gD, svg, 252, yB - 22, 26, 20, "rgb(236 240 214 / 0.7)");
    steklo(gD, svg, 250, yB - 34, 30, 33, { rx: 2 });
    label(gD, 265, yB + 9, "HCl (konc.)", "lab-ek-miza small");
    if (B.steklo) {
      // kobaltovo steklo pred plamenom (v plasti nad plamenom)
      P.g._sig.push("kob");
      s("rect", { x: bx - 46, y: ct - 110, width: 92, height: 100, rx: 3, fill: "rgb(40 60 200 / 0.55)", stroke: "#1b2a8a", "stroke-width": 1.5 }, P.g);
      label(gD, bx, ct - 116, "kobaltovo steklo", "tick small");
    }
    if (spek) spektroskop(B.prizgan && B.vPlamenu);
    if (!B.ocala) label(gD, 210, 14, "brez zaščitnih očal", "lab-warn");
    merilo(gD, 12, 30, S);
    svg.setAttribute("aria-label", `Plinski gorilnik ${B.prizgan ? (B.zrak < 0.3 ? "s svetlim plamenom" : "z nesvetlim plamenom") : "ne gori"}${B.vPlamenu ? ", zanka je v plamenu" : ""}; barva plamena ${rgbIme()}.`);
    P.commit();
  }
  function rgbIme() {
    if (!B.prizgan) return "ni";
    const vid = B.vidnostSoli();
    if (!B.vPlamenu || vid < 0.3) return B.zrak < 0.3 ? "rumena (saje)" : "bledo modra";
    const [r, g, b] = B.barva().rgb, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn || 1;
    const hue = (mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60;
    const ime = hue < 15 || hue >= 340 ? "rdeča" : hue < 38 ? "oranžno rdeča" : hue < 52 ? "oranžna" : hue < 70 ? "rumena" : hue < 150 ? "zelena" : hue < 190 ? "modro zelena" : hue < 255 ? "modra" : hue < 300 ? "vijolična" : "rožnato vijolična";
    return (mx - mn) / (mx || 1) < 0.3 ? `bledo ${ime}` : ime;
  }
  // Plamen: svetel (saje: rumeno oranžen, plapola) ali nesvetel (bledo vijoličasto moder z modrim notranjim stožcem); sol ga obarva.
  function plamen(bx, ct) {
    const z = B.zrak, g = P.g, sp = B.barva(), vid = B.vidnostSoli();
    const salt = B.vPlamenu && vid > 0.05 ? sp.rgb : null;
    const Hf = (12 - 4 * z) * S, Wf = (2.4 - 0.6 * z) * S;
    const id = `${P.g._uid}-f${Math.round(z * 10)}`;
    g._sig.push(`f${z}|${salt?.join() ?? ""}|${Math.round(vid * 20)}|${B.steklo}`);
    const d = s("defs", {}, g);
    const lg = s("linearGradient", { id, x1: 0, y1: 1, x2: 0, y2: 0 }, d);
    const stops = z < 0.3 ? [[0, "#5a7bd8", 0.7], [0.08, "#ffcf6a", 0.9], [0.5, "#ffb030", 0.92], [0.85, "#ff8a1a", 0.6], [1, "#ff6a00", 0]] : [[0, "#3b5bdb", 0.55], [0.3, "#7b6fe0", 0.32], [0.8, "#8f7fe6", 0.18], [1, "#a593f0", 0]];
    for (const [o, c, a] of stops) s("stop", { offset: o, "stop-color": c, "stop-opacity": a }, lg);
    const path = `M${bx - Wf / 2},${ct} C${bx - Wf * 0.7},${ct - Hf * 0.4} ${bx - Wf * 0.25},${ct - Hf * 0.75} ${bx},${ct - Hf} C${bx + Wf * 0.25},${ct - Hf * 0.75} ${bx + Wf * 0.7},${ct - Hf * 0.4} ${bx + Wf / 2},${ct} Z`;
    const fl = s("g", { class: z < 0.3 ? "lab-rk-flame lab-rk-flame-s" : "lab-rk-flame", style: `transform-origin:${bx}px ${ct}px` }, g);
    s("path", { d: path, fill: `url(#${id})` }, fl);
    if (salt) {
      const a = Math.min(0.92, 0.15 + vid * (z < 0.3 ? 0.4 : 0.85));
      const cc = salt;
      s("path", { d: `M${bx - Wf * 0.55},${ct - Hf * 0.12} C${bx - Wf * 0.75},${ct - Hf * 0.45} ${bx - Wf * 0.3},${ct - Hf * 0.85} ${bx},${ct - Hf * 1.03} C${bx + Wf * 0.3},${ct - Hf * 0.85} ${bx + Wf * 0.75},${ct - Hf * 0.45} ${bx + Wf * 0.55},${ct - Hf * 0.12} Z`, fill: rgb(cc, a), class: "lab-rk-salt" }, fl);
    }
    if (z >= 0.3) {
      const hc = (2.5 + (1 - z) * 2) * S;
      s("path", { d: `M${bx - 4.5},${ct} Q${bx - 3.5},${ct - hc * 0.7} ${bx},${ct - hc} Q${bx + 3.5},${ct - hc * 0.7} ${bx + 4.5},${ct} Z`, fill: "rgb(70 120 255 / 0.85)", stroke: "rgb(150 200 255 / 0.9)", "stroke-width": 0.8 }, fl);
    }
  }
  // Ročni spektroskop: pogled skozi okular, lestvica 400–780 nm, črte v barvi valovne dolžine.
  function spektroskop(on) {
    const x0 = 150, y0 = 54, w = 232, hh = 74, X = (l) => x0 + 8 + ((l - 400) / 380) * (w - 16);
    s("rect", { x: x0, y: y0, width: w, height: hh, rx: 8, fill: "#07080b", stroke: "#4a4f55", "stroke-width": 2 }, gD);
    // šibek zvezen spekter (sipana svetloba) in črte
    if (on) {
      const sp = B.spekter();
      const vis = sp.map((q) => ({ ...q, v: q.I * (B.steklo ? kobalt(q.l) : 1) }));
      const max = Math.max(1e-9, ...vis.filter((q) => q.el || q.vir === "saje").map((q) => q.v * eye(q.l)));
      for (const q of vis) {
        const b = Math.min(1, ((q.v * eye(q.l)) / max) ** 0.45);
        if (b < 0.04 || q.l < 400 || q.l > 780) continue;
        const c = valovRgb(q.l);
        if (q.vir === "saje") s("rect", { x: X(q.l - 5), y: y0 + 8, width: X(q.l + 5) - X(q.l - 5) + 0.5, height: 44, fill: rgb(c, b * 0.85) }, gD);
        else if (q.w) s("rect", { x: X(q.l - q.w / 2), y: y0 + 8, width: Math.max(1.5, X(q.l + q.w / 2) - X(q.l - q.w / 2)), height: 44, fill: rgb(c, b * 0.75), class: "lab-rk-pas" }, gD);
        else s("rect", { x: X(q.l) - 0.9, y: y0 + 8, width: 1.8, height: 44, fill: rgb(c, b) }, gD);
      }
    }
    for (let l = 400; l <= 780; l += 10) {
      const big = l % 50 === 0;
      s("line", { x1: X(l), y1: y0 + 54, x2: X(l), y2: y0 + 54 + (big ? 7 : 4), stroke: "#c9ced4", "stroke-width": 0.7 }, gD);
      if (l % 100 === 0) label(gD, X(l), y0 + 69, String(l), "lab-rk-skala");
    }
    label(gD, x0 + w - 6, y0 + 69, "nm", "lab-rk-skala", "end");
    label(gD, x0 + w / 2, y0 + hh + 10, "pogled skozi ročni spektroskop", "tick small");
  }
  // občutljivost očesa (CIE ȳ), spodaj omejena, da se temno rdeče kalijeve črte v spektroskopu še vidijo (kot v resnici)
  const eye = (l) => Math.max(0.004, cmf(l)[1]);
  draw();
}
