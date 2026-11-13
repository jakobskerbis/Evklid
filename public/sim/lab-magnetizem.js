// Virtualni laboratorij, elektromagnetizem: elektromagnet (lab-elektromagnet), sila na vodnik v magnetnem polju (lab-sila-vodnik),
// elektromagnetna indukcija (lab-indukcija). Modeli: lab-model-magnetizem.js (brez DOM). CSS: predpona lab-mag-.
// Risbe so v stalnem merilu (merilna črta), oprema v pravih razmerjih; čas teče v realnem času (pospešek časa in posnetek ×0,1
// sta označena v risbi). Risba se nariše znova ob vsakem koraku ure (10-krat na sekundo) ali sličici poskusa.
import { h, s, svgBox, select, segmented, button, toggle, slider, layout, label, axes, stage as stageBox, controls as controlsBox } from "./kit.js";
import { ticker, lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed, tex, en, rez } from "./lab.js";
import {
  ElektromagnetBench, TULJAVE, JEDRA, NAVITJE, GRETJE, TESLA_RANGES, AM_RANGES, NAPAJALNIK_EM, KOMPAS, SPONKA, HALL,
  TehtnicaBench, MAGNETI, VODNIKI, TEHTNICA, NAPAJALNIK_TT, poljeReze,
  IndukcijaBench, MAGNET_IND, CEV, SENZOR, GALVANOMETER,
  G_SOLA, naklonSkoziIzhodisce, POENOSTAVITVE_MAGNETIZEM,
} from "./lab-model-magnetizem.js";

const seme = () => (Math.random() * 2 ** 31) | 0;
const nb = " "; // nedeljiv presledek (število in enota v isti vrstici)
const grp = (title, ...kids) => h("fieldset", { class: "lab-tit-grp" }, h("legend", {}, title), ...kids);
const buttons = (...k) => h("div", { class: "demo-buttons" }, ...k);
const row = (lab, ...kids) => h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, lab), ...kids);
const seg = (name, options, value, onChange) => {
  const x = segmented({ options, value, onChange });
  x.setAttribute("aria-label", name);
  return x;
};
const hint = (text) => h("p", { class: "lab-tit-hint", html: text });
// Slovenska množina po številu: mn(n, ["sponka", "sponki", "sponke", "sponk"]).
const mn = (n, [e, d, m, r]) => { const k = Math.abs(n) % 100; return k === 1 ? e : k === 2 ? d : k === 3 || k === 4 ? m : r; };
const num = (x, d = 1) => fixed(x, d);
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const setTxt = (el, t) => el && el.textContent !== t && (el.textContent = t);
const hitrostSeg = (opts, value, onChange) => row("hitrost časa", seg("hitrost časa", opts.map((v) => [String(v), `×${v}`]), String(value), (v) => onChange(+v)));

// Lepe meje osi: najmanjša »okrogla« zgornja meja nad max in korak (1, 2 ali 5 · 10ⁿ), največ 6 razdelkov (2,5 ne: kit.axes
// zaokroži oznake na decimalke koraka, 0,25 bi bil »0,3«).
function os(max) {
  const m = Math.max(max, 1e-9) * 1.08;
  const e = 10 ** Math.floor(Math.log10(m / 5));
  for (const k of [1, 2, 5, 10, 20]) {
    const st = k * e;
    if (m / st <= 6) return { top: Math.ceil(m / st - 1e-9) * st, step: st };
  }
  return { top: m, step: m / 5 };
}
const skupine = (list, key, xk, yk) => {
  const m = new Map();
  for (const r of list) if (r[xk] != null && r[yk] != null && Number.isFinite(r[xk]) && Number.isFinite(r[yk])) (m.get(r[key]) || m.set(r[key], []).get(r[key])).push([r[xk], r[yk]]);
  return m;
};
const serije = (groups, line = () => true) =>
  [...groups.entries()].map(([name, pts], i) => {
    let f;
    if (pts.length >= 2 && line(name)) {
      const k = naklonSkoziIzhodisce(pts);
      f = (x) => k * x;
    }
    return { id: name, pts, cls: "abc"[i % 3], shape: i % 6 < 3 ? "o" : "^", label: name, line: f };
  });

// Gibanje v realnem času (posnetek, padec magneta): requestAnimationFrame, pri »manj gibanja« 10 sličic na sekundo.
function poganjalnik(el, onFrame) {
  let on = false, last = 0, speed = 1, gen = 0;
  const mine = (el._magRun = (el._magRun || 0) + 1);
  const tick = (g) => {
    if (!on || g !== gen || el._magRun !== mine) return;
    if (el.dataset.mounted && !el.isConnected) return (on = false);
    if (el.isConnected) el.dataset.mounted = "1";
    const now = performance.now(), dt = Math.min(reduced() ? 0.25 : 0.05, (now - last) / 1000);
    last = now;
    if (onFrame(dt * speed) === false) return (on = false);
    plan(g);
  };
  const plan = (g) => (reduced() ? setTimeout(() => tick(g), 100) : requestAnimationFrame(() => tick(g)));
  return {
    start(sp = 1) {
      speed = sp;
      on = true;
      last = performance.now();
      plan(++gen);
    },
    stop() {
      on = false;
    },
    get on() {
      return on;
    },
  };
}

// ---------------------------------------------------------------- skupni deli risbe
const u = (svg, id) => `url(#${svg.uid}-${id})`;
function gradienti(svg) {
  const d = s("defs", {}, svg);
  const lin = (id, stops, { x2 = 1, y2 = 0 } = {}) => {
    const g = s("linearGradient", { id: `${svg.uid}-${id}`, x1: 0, y1: 0, x2, y2 }, d);
    for (const [o, c, a = 1] of stops) s("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g);
  };
  // baker navitja: lakirana žica, valj (temna robova, svetel pas levo od sredine)
  lin("baker", [[0, "#5e2a12"], [0.18, "#a9592e"], [0.36, "#f0b48a"], [0.5, "#c97a47"], [0.8, "#8c4420"], [1, "#4d220e"]]);
  lin("bakerv", [[0, "#5e2a12"], [0.2, "#b8673a"], [0.42, "#f2bb93"], [0.6, "#c47443"], [1, "#55260f"]], { x2: 0, y2: 1 });
  lin("tuljavnica", [[0, "#2b2f35"], [0.45, "#4b525b"], [1, "#1c1f23"]], { x2: 0, y2: 1 });
  lin("zelezo", [[0, "#3b3f45"], [0.38, "#9097a0"], [0.6, "#6a7179"], [1, "#33373c"]]);
  lin("zelezov", [[0, "#3b3f45"], [0.38, "#9097a0"], [0.6, "#6a7179"], [1, "#33373c"]], { x2: 0, y2: 1 });
  lin("lamele", [[0, "#545b63"], [0.4, "#8d959e"], [1, "#454b52"]], { x2: 0, y2: 1 });
  lin("lamelev", [[0, "#545b63"], [0.4, "#8d959e"], [1, "#454b52"]]);
  lin("jeklo", [[0, "#6e767e"], [0.45, "#e8ebee"], [1, "#59616a"]]);
  lin("jeklov", [[0, "#8a929a"], [0.4, "#eef1f3"], [1, "#6a727a"]], { x2: 0, y2: 1 });
  lin("nikelj", [[0, "#8b9198"], [0.35, "#f5f7f9"], [0.6, "#c4c9ce"], [1, "#7b8188"]]);
  lin("miza", [[0, "#d4d8dc"], [0.15, "#c3c8cd"], [1, "#a9b0b7"]], { x2: 0, y2: 1 });
  lin("rumena", [[0, "#f4c430"], [1, "#d9a514"]], { x2: 0, y2: 1 });
  lin("ohisje", [[0, "#4a525c"], [1, "#2c3238"]], { x2: 0, y2: 1 });
  lin("modro", [[0, "#2f4a6b"], [1, "#1c2f47"]], { x2: 0, y2: 1 });
  lin("plosca", [[0, "#d9dde2"], [1, "#b4bbc3"]], { x2: 0, y2: 1 });
  lin("palica", [[0, "#7c838b"], [0.45, "#e1e5e9"], [1, "#6f767e"]]);
  lin("les", [[0, "#d9b27a"], [1, "#b88a50"]], { x2: 0, y2: 1 });
  lin("steklo", [[0, "#5d7385", 0.42], [0.1, "#ffffff", 0.7], [0.22, "#ffffff", 0.12], [0.6, "#ffffff", 0.04], [0.86, "#a9bccb", 0.25], [1, "#4f6577", 0.5]]);
  lin("rdeca", [[0, "#8f1d1d"], [0.45, "#e0463c"], [1, "#9c2020"]], { x2: 0, y2: 1 });
  lin("zelena", [[0, "#1d5e33"], [0.45, "#3fae63"], [1, "#1f6236"]], { x2: 0, y2: 1 });
  lin("tiskanina", [[0, "#1f6b3a"], [0.5, "#2f8a4c"], [1, "#1b5e33"]]);
  lin("koza", [[0, "#e9b38f"], [1, "#c98d68"]]);
  lin("zaslon", [[0, "#0e1a24"], [1, "#132636"]], { x2: 0, y2: 1 });
  return d;
}
function merilo(g, x, y, px, text) {
  s("path", { d: `M${x},${y - 4} V${y} H${x + px} V${y - 4}`, class: "lab-scale lab-mag-merilo" }, g);
  label(g, x + px + 4, y - 2, text, "lab-mag-miza", "start");
}
// Vodnik z izolacijo (rdeča ali črna) in odsevom.
function zica(g, d, barva) {
  s("path", { d, class: `lab-mag-wire ${barva}` }, g);
  s("path", { d, class: "lab-mag-wire-hl" }, g);
}
// Krokodilček (izoliran ročaj v barvi vodnika, kovinski čeljusti): (x, y) je sredina med čeljustma in ročajem, čeljusti
// so v smeri kot + 180°, vodnik vstopi v ročaj na koncu (rep). Kot v stopinjah.
const rep = (x, y, kot) => [x + 9 * Math.cos((kot * Math.PI) / 180), y + 9 * Math.sin((kot * Math.PI) / 180)];
function krokodil(g, x, y, barva, kot = 90) {
  const k = s("g", { transform: `translate(${x},${y}) rotate(${kot})` }, g);
  s("path", { d: "M-3,-3.5 L9,-2.2 L9,2.2 L-3,3.5 Z", class: `lab-mag-clip ${barva}` }, k);
  s("path", { d: "M-9,-2.6 L-3,-3 L-3,3 L-9,2.6 Z", fill: "#c9ced4", stroke: "#7d848b", "stroke-width": 0.5 }, k);
  s("path", { d: "M-9,-2.6 L-7.5,-1.5 L-6,-2.4 L-4.5,-1.4 L-3,-2.4", fill: "none", stroke: "#7d848b", "stroke-width": 0.5 }, k);
}
// Kabel, ki z (A) pade na mizo (yT), leži po njej in se dvigne do (B): pri vtiču na sprednji plošči visi navpično (izB = [0, 1]),
// iz krokodilčka gre vodoravno (izA = [1, 0]). Pravi kabli niso napeti, zato ne gredo poševno čez naprave.
function kabel(g, A, B, yT, barva, izA = [1, 0], izB = [0, 1]) {
  const sx = Math.sign(B[0] - A[0]) || 1;
  const hA = Math.max(0, yT - A[1]), hB = Math.max(0, yT - B[1]);
  const P1 = A[0] + sx * Math.max(10, hA * 0.35), P2 = B[0] - sx * Math.max(10, hB * 0.35);
  const cA = [A[0] + izA[0] * Math.max(8, hA * 0.3), A[1] + izA[1] * hA * 0.6], cB = [B[0] + izB[0] * Math.max(8, hB * 0.3), B[1] + izB[1] * hB * 0.6];
  const f = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const d = (P2 - P1) * sx > 0
    ? `M${f(A)} C${f(cA)} ${f([P1 - sx * 8, yT])} ${f([P1, yT])} L${f([P2, yT])} C${f([P2 + sx * 8, yT])} ${f(cB)} ${f(B)}`
    : `M${f(A)} C${f(cA)} ${f(cB)} ${f(B)}`;
  zica(g, d, barva);
}
// 4-mm vtičnica (pušica) na ohišju.
function pusica(g, x, y, barva = "k", r = 3) {
  s("circle", { cx: x, cy: y, r: r + 1, fill: barva === "r" ? "#8f1b1b" : "#111", stroke: "#000", "stroke-width": 0.5 }, g);
  s("circle", { cx: x, cy: y, r: r * 0.45, fill: "#c9ced4" }, g);
}
// Laboratorijsko stojalo: podnožje in palica.
function stojalo(g, svg, xRod, yTop, yBase, w = 90) {
  s("rect", { x: xRod - 14, y: yBase - 6, width: w, height: 6, rx: 1.5, fill: "#3d434a" }, g);
  s("rect", { x: xRod - 2.2, y: yTop, width: 4.4, height: yBase - yTop - 6, fill: u(svg, "palica") }, g);
}
// Mufa na palici in roka do xTo (prijemalo z dvema čeljustma, širine w).
function prijemalo(g, svg, xRod, y, xTo, w = 10) {
  s("rect", { x: xRod - 5, y: y - 5, width: 10, height: 10, rx: 1.5, fill: "#5a626b" }, g);
  s("circle", { cx: xRod - 7, cy: y, r: 2.2, fill: "#3f464e" }, g);
  s("rect", { x: xRod, y: y - 1.6, width: xTo - xRod - w / 2 - 2, height: 3.2, fill: u(svg, "palica") }, g);
  s("path", { d: `M${xTo - w / 2 - 3},${y - 4} h${w + 6} v8 h${-(w + 6)} Z`, fill: "none", stroke: "#5a626b", "stroke-width": 2.2 }, g);
}
// Digitalni multimeter v rumenem ovitku: zaslon, vrtljivo stikalo, vtičnice (10A, mA, COM, VΩ).
function multimeter(g, svg, x, y, w, hh, { text = "", unit = "", kot = 0, ime = "" }) {
  s("rect", { x, y, width: w, height: hh, rx: w * 0.14, fill: u(svg, "rumena"), stroke: "#a87d0c", "stroke-width": 1 }, g);
  s("rect", { x: x + w * 0.08, y: y + hh * 0.05, width: w * 0.84, height: hh * 0.9, rx: w * 0.08, fill: u(svg, "ohisje") }, g);
  const lx = x + w * 0.15, ly = y + hh * 0.1, lw = w * 0.7, lh = hh * 0.2;
  s("rect", { x: lx, y: ly, width: lw, height: lh, rx: 2, class: "lab-mag-lcdbg" }, g);
  label(g, lx + lw - 3, ly + lh * 0.55, text.replace(".", ",").replace("-", "−"), "lab-mag-lcdtxt", "end").setAttribute("style", `font-size:${(w * 0.17).toFixed(1)}px`);
  if (unit) label(g, lx + lw - 3, ly + lh * 0.88, unit, "lab-mag-lcdunit", "end").setAttribute("style", `font-size:${(w * 0.09).toFixed(1)}px`);
  const cx = x + w / 2, cy = y + hh * 0.56, R = w * 0.25;
  s("circle", { cx, cy, r: R + 3, fill: "#20252a", stroke: "#59616a", "stroke-width": 1 }, g);
  s("circle", { cx, cy, r: R, fill: "#3a4148" }, g);
  const a = ((kot - 90) * Math.PI) / 180;
  s("line", { x1: cx - Math.cos(a) * R * 0.6, y1: cy - Math.sin(a) * R * 0.6, x2: cx + Math.cos(a) * R, y2: cy + Math.sin(a) * R, stroke: "#f2f4f6", "stroke-width": 2.4, "stroke-linecap": "round" }, g);
  const jy = y + hh * 0.86, js = ["10A", "mA", "COM", "VΩ"];
  js.forEach((j, i) => {
    const jx = x + w * (0.2 + i * 0.2);
    s("circle", { cx: jx, cy: jy, r: w * 0.055, fill: j === "COM" ? "#111" : "#b3261e", stroke: "#888", "stroke-width": 0.6 }, g);
    label(g, jx, jy - w * 0.1, j, "lab-mag-jack").setAttribute("style", `font-size:${(w * 0.075).toFixed(1)}px`);
  });
  if (ime) label(g, x + w / 2, y - 5, ime, "lab-mag-oznaka");
  return { jack: (j) => [x + w * (0.2 + js.indexOf(j) * 0.2), jy] };
}
// Laboratorijski napajalnik: prikazovalnika napetosti in toka, LED CV/CC, gumba za napetost in tok, sponki + in −.
function napajalnik(g, svg, x, y, { on, U, I, cc, Uset, Umax, Iset, Imax, ime }) {
  const pw = 146, ph = 76;
  s("rect", { x, y, width: pw, height: ph, rx: 4, fill: u(svg, "plosca"), stroke: "#7d858e", "stroke-width": 1 }, g);
  s("rect", { x: x + 3, y: y + ph - 4, width: pw - 6, height: 3, rx: 1, fill: "#9aa2ab" }, g);
  s("rect", { x: x + 6, y: y + 8, width: 52, height: 22, rx: 2, fill: "#1a1d1a" }, g);
  s("rect", { x: x + 64, y: y + 8, width: 52, height: 22, rx: 2, fill: "#1a1d1a" }, g);
  if (on) {
    label(g, x + 54, y + 20, U.toFixed(1).replace(".", ","), "lab-mag-seg red", "end");
    label(g, x + 112, y + 20, I.toFixed(2).replace(".", ","), "lab-mag-seg grn", "end");
  }
  label(g, x + 32, y + 37, "V", "lab-mag-panel");
  label(g, x + 90, y + 37, "A", "lab-mag-panel");
  s("circle", { cx: x + 123, cy: y + 14, r: 2.4, fill: on && !cc ? "#3bd16f" : "#55605a" }, g);
  s("circle", { cx: x + 123, cy: y + 24, r: 2.4, fill: on && cc ? "#ff5a3c" : "#605555" }, g);
  label(g, x + 129, y + 14, "CV", "lab-mag-panel", "start");
  label(g, x + 129, y + 24, "CC", "lab-mag-panel", "start");
  for (const [kx, val, mx] of [[x + 24, Uset, Umax], [x + 62, Iset, Imax]]) {
    s("circle", { cx: kx, cy: y + 54, r: 9, fill: "#2d3238", stroke: "#15181b", "stroke-width": 1 }, g);
    s("circle", { cx: kx - 2, cy: y + 52, r: 3, fill: "rgb(255 255 255 / 0.12)" }, g);
    const a = (-135 + (270 * val) / mx) * (Math.PI / 180);
    s("line", { x1: kx, y1: y + 54, x2: kx + Math.sin(a) * 8, y2: y + 54 - Math.cos(a) * 8, stroke: "#eef1f4", "stroke-width": 1.6 }, g);
  }
  label(g, x + 24, y + 69, "U", "lab-mag-panel");
  label(g, x + 62, y + 69, "I", "lab-mag-panel");
  const tP = [x + 102, y + 56], tM = [x + 126, y + 56];
  s("circle", { cx: tP[0], cy: tP[1], r: 5, fill: "#c62828", stroke: "#7a1414" }, g);
  s("circle", { cx: tM[0], cy: tM[1], r: 5, fill: "#1c1c1c", stroke: "#000" }, g);
  // oznaki sponk levo od njiju (kabla z vtičev visita navzdol in bi ju prekrila)
  label(g, tP[0] - 8.5, tP[1], "+", "lab-mag-panel");
  label(g, tM[0] - 8.5, tM[1], "−", "lab-mag-panel");
  s("circle", { cx: x + 84, cy: y + 56, r: 3, fill: on ? "#3bd16f" : "#55605a", stroke: "#222", "stroke-width": 0.5 }, g);
  if (ime) label(g, x + pw / 2, y - 5, ime, "lab-mag-oznaka");
  return { plus: tP, minus: tM };
}
// Tuljava (navpična os, pogled od spredaj): navitje iz lakirane bakrene žice v plasteh, tuljavnica s prirobnicama, priključka desno.
// cx, cy = sredina navitja; S = enot na cm. Vrne lego priključkov.
function tuljava(g, svg, cx, cy, S, { N, vroca = 0 } = {}) {
  const L = NAVITJE.L * 100 * S, r2 = NAVITJE.r2 * 100 * S, fl = 0.35 * S, fw = r2 + 0.3 * S;
  const y0 = cy - L / 2, y1 = cy + L / 2;
  s("rect", { x: cx - r2, y: y0, width: 2 * r2, height: L, fill: u(svg, "baker"), class: "lab-mag-navitje" }, g);
  // ovoji: žica Ø ~0,9 mm (pri 1000 ovojih 0,45 mm); vsak ovoj je črta, rahlo poševna (korak vijačnice), plasti se izmenjujejo
  const dz = Math.max(0.9, (N >= 1000 ? 0.045 : N >= 500 ? 0.09 : 0.13) * S);
  let k = 0;
  for (let y = y0 + dz; y < y1 - 0.2; y += dz, k++) s("line", { x1: cx - r2 + 0.4, y1: y + (k % 2 ? 0.25 : -0.25) * dz, x2: cx + r2 - 0.4, y2: y - (k % 2 ? 0.25 : -0.25) * dz, class: "lab-mag-ovoj" }, g);
  s("rect", { x: cx - r2 * 0.55, y: y0, width: r2 * 0.16, height: L, class: "lab-mag-lesk" }, g);
  if (vroca > 0) s("rect", { x: cx - r2, y: y0, width: 2 * r2, height: L, class: "lab-mag-vroce", style: `opacity:${Math.min(0.55, vroca).toFixed(2)}` }, g);
  for (const y of [y0 - fl, y1]) s("rect", { x: cx - fw, y, width: 2 * fw, height: fl, rx: 0.8, fill: u(svg, "tuljavnica"), class: "lab-mag-prirobnica" }, g);
  // papirnata nalepka s številom ovojev spodaj levo na navitju (kot na šolskih tuljavah); prirobnica je za napis pretanka
  const nw = Math.min(2 * r2 - 3, 21), nh = 5.6, nx = cx - r2 + 1.5, ny = y1 - nh - 1.5;
  s("rect", { x: nx, y: ny, width: nw, height: nh, rx: 0.6, class: "lab-mag-nalepka-bg" }, g);
  label(g, nx + nw / 2, ny + nh / 2, `N = ${N}`, "lab-mag-nalepka");
  const t1 = [cx + fw + 2.5, y0 - fl / 2], t2 = [cx + fw + 2.5, y1 + fl / 2];
  for (const t of [t1, t2]) {
    s("rect", { x: cx + fw - 0.5, y: t[1] - 1.8, width: 3, height: 3.6, fill: "#1c1f23" }, g);
    pusica(g, t[0], t[1], "k", 1.6);
  }
  return { t1, t2, y0: y0 - fl, y1: y1 + fl, fw };
}
// Zmerni valovi toplote nad vročim predmetom.
function toplota(g, x, y, w, moc) {
  if (moc <= 0) return;
  for (let i = 0; i < 3; i++) {
    const xx = x - w / 2 + ((i + 0.5) * w) / 3;
    s("path", { d: `M${xx},${y} q3,-4 0,-8 q-3,-4 0,-8`, class: "lab-mag-val", style: `opacity:${Math.min(0.8, moc).toFixed(2)}` }, g);
  }
}
// Pisarniška sponka (pogled od spredaj): žica, upognjena v dve zanki.
function sponka(g, x, y, S, kot = 0) {
  const L = 3.2 * S, w = 0.8 * S;
  const k = s("g", { transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${kot.toFixed(1)})` }, g);
  s("path", { d: `M${w * 0.15},${L * 0.25} V${L - w / 2} a${w * 0.35},${w * 0.35} 0 0 1 ${-w * 0.7},0 V${w / 2} a${w * 0.5},${w * 0.5} 0 0 1 ${w},0 V${L * 0.78}`, class: "lab-mag-sponka" }, k);
}
// Kompas od zgoraj: številčnica s stranmi neba (S, V, J, Z), igla (rdeči konec kaže proti severu polja).
function kompasRisba(g, cx, cy, r, kot, ime = "kompas (od zgoraj)") {
  s("circle", { cx, cy, r: r + 2.5, class: "lab-mag-kompas-ohisje" }, g);
  s("circle", { cx, cy, r, class: "lab-mag-kompas-dial" }, g);
  for (let i = 0; i < 36; i++) {
    const a = (i * 10 * Math.PI) / 180, L = i % 9 === 0 ? 4 : i % 3 === 0 ? 2.5 : 1.5;
    s("line", { x1: cx + Math.sin(a) * r, y1: cy - Math.cos(a) * r, x2: cx + Math.sin(a) * (r - L), y2: cy - Math.cos(a) * (r - L), class: "lab-mag-kompas-crt" }, g);
  }
  [["S", 0], ["V", 90], ["J", 180], ["Z", 270]].forEach(([t, a]) => {
    const q = (a * Math.PI) / 180;
    label(g, cx + Math.sin(q) * (r - 8), cy - Math.cos(q) * (r - 8), t, "lab-mag-kompas-txt");
  });
  const n = s("g", { transform: `translate(${cx},${cy}) rotate(${kot.toFixed(1)})` }, g);
  s("path", { d: `M0,${-r * 0.82} L${r * 0.11},0 L${-r * 0.11},0 Z`, class: "lab-mag-igla-n" }, n);
  s("path", { d: `M0,${r * 0.82} L${r * 0.11},0 L${-r * 0.11},0 Z`, class: "lab-mag-igla-s" }, n);
  s("circle", { cx: 0, cy: 0, r: 1.6, fill: "#c9ced4", stroke: "#555", "stroke-width": 0.5 }, n);
  if (ime) label(g, cx, cy + r + 9, ime, "lab-mag-oznaka");
}
// Roka od zgoraj desno: zapestje, dlan, kazalec in palec, ki držita magnet za zgornji konec (odprta: prsta razmaknjena).
function prsti(g, svg, x, y, odprta) {
  const d = odprta ? 8 : 3.6, k = s("g", { class: "lab-mag-roka-g" }, g);
  s("path", { d: `M${x + 46},${y - 44} C${x + 34},${y - 34} ${x + 22},${y - 28} ${x + 12},${y - 20}`, class: "lab-mag-zapestje" }, k);
  s("ellipse", { cx: x + 9, cy: y - 17, rx: 10, ry: 7.5, transform: `rotate(-35 ${x + 9} ${y - 17})`, fill: u(svg, "koza"), class: "lab-mag-dlan" }, k);
  s("path", { d: `M${x + 6},${y - 14} Q${x + d + 3},${y - 6} ${x + d},${y + 1}`, class: "lab-mag-prst" }, k);
  s("path", { d: `M${x + 1},${y - 18} Q${x - d - 4},${y - 9} ${x - d},${y + 1}`, class: "lab-mag-prst" }, k);
}

// ================================================================ 1. elektromagnet
const TUL_OPTS = Object.entries(TULJAVE).map(([k, v]) => [k, `${v.N} ovojev (${num(v.R, 1)}${nb}Ω, največ ${num(v.Imax, v.Imax < 2 ? 2 : 1)}${nb}A)`]);
const JED_OPTS = [["zrak", "brez jedra"], ["palica", "palica iz mehkega železa"], ["zebelj", "kaljen jeklen žebelj"], ["u", "U-jedro z jarmom"]];
const JED_KRATKO = { zrak: "brez", palica: "palica", zebelj: "žebelj", u: "U-jedro" };
// opts.raven === "os": 9. razred OŠ – enaka oprema in meritve, a kvalitativen sklep (tok, ovoji, jedro, smer toka → pola)
// brez sorazmernosti B ∝ N I, μ0 in nasičenja.
export function labElektromagnet(el, opts = {}) {
  const OS = opts.raven === "os";
  const B = new ElektromagnetBench({ seed: seme() });
  B.prikljuceno = false; // učenec krog sestavi sam: krokodilčka sta na začetku odložena na mizi
  const W = 400, H = 320, S = 5, xc = 95, yc = 175, yMiza = 300; // 1 cm = 5 enot
  const Y = (z) => yc - z * 100 * S;
  const SOCK = [336, 80]; // vtičnica za sondo na teslametru (teslameter ni v desnem zgornjem kotu, kjer je na telefonu gumb »Pripni sliko«)
  const svg = svgBox(W, H, "lab-bench lab-mag lab-mag-em");
  const log = eventLog();
  const supL = lcd("napajalnik"), amL = lcd("ampermeter"), teL = lcd("teslameter"), thL = lcd("termometer"), spL = lcd("sponke");
  const table = dataTable([
    { key: "N", label: "<i>N</i>" },
    { key: "jedro", label: "jedro" },
    { key: "z", label: "sonda" },
    { key: "I", label: "<i>I</i> [A]" },
    { key: "B", label: "<i>B</i> [mT]" },
    { key: "n", label: "sponke" },
  ], { empty: "Še ni meritev. Sestavi krog, nastavi teslameter na nič, vklopi napajalnik in zapisuj tok in gostoto polja." });
  const gBI = dataGraph({ x: [0, 3], y: [0, 50], xStep: 0.5, yStep: 10, xLabel: "I [A]", yLabel: "B [mT]", title: "Gostota magnetnega polja v odvisnosti od toka" });
  const gBN = dataGraph({ x: [0, 1000], y: [0, 50], xStep: 200, yStep: 10, xLabel: "N", yLabel: "B [mT]", title: "Gostota magnetnega polja v odvisnosti od števila ovojev" });
  const gBz = dataGraph({ x: [-10, 15], y: [0, 50], xStep: 5, yStep: 10, xLabel: "z [cm]", yLabel: "B [mT]", title: "Gostota magnetnega polja vzdolž osi tuljave", origin: false });
  const calc = h("div", { class: "lab-mag-calc", "aria-live": "polite" });
  const qBox = h("div");
  const meas = [];
  let speed = 1, graf = "BI", asked = false;
  const said = {};
  const once = (k, text, kind = "warn") => said[k] || ((said[k] = true), log.push(text, kind));

  const tSel = select({ label: "tuljava", options: TUL_OPTS, value: B.tuljava, onChange: (v) => ((B.tuljava = v), (B.sponke = 0), log.push(`Na stojalo si vpel tuljavo s ${TULJAVE[v].N} ovoji.`, "info"), sync()) });
  const jSel = select({ label: "jedro", options: JED_OPTS, value: B.jedro, onChange: (v) => setJedro(v) });
  const razSeg = row("ploščici pod jarmom", seg("plastični ploščici pod jarmom", [["0", "brez"], ["0.5", "0,5 mm"], ["1", "1 mm"], ["2", "2 mm"]], String(B.razmik), (v) => ((B.razmik = +v), log.push(+v ? `Med kraka in jarem si vložil plastični ploščici debeline ${num(+v, +v < 1 ? 1 : 0)}${nb}mm.` : "Jarem se krakov dotika neposredno (reža je le ~0,03 mm).", "info"), sync())));
  const amPosSeg = row("ampermeter", seg("vezava ampermetra", [["zaporedno", "zaporedno"], ["vzporedno", "vzporedno s tuljavo"]], B.amPos, (v) => ((B.amPos = v), (said.kratek = false), log.push(v === "zaporedno" ? "Ampermeter je vezan zaporedno s tuljavo: skozi oba teče isti tok." : "Ampermeter si vezal vzporedno s tuljavo.", v === "zaporedno" ? "info" : "warn"))));
  const amSel = select({ label: "vtičnica in območje ampermetra", options: [["10", "10 A (vtičnica 10A)"], ["200m", "200 mA (vtičnica mA)"], ["20m", "20 mA (vtičnica mA)"]], value: B.amRange, onChange: (v) => (B.amRange = v) });
  const prT = toggle("vodnika priključena na tuljavo", false, (v) => ((B.prikljuceno = v), log.push(v ? "Krokodilčka sta na priključkih tuljave: krog je sklenjen." : "Snel si krokodilčka s tuljave: krog je odprt.", "info")));
  const smerBtn = button("Zamenjaj priključka na tuljavi", () => ((B.smer *= -1), log.push("Zamenjal si krokodilčka na tuljavi: tok teče skozi navitje v nasprotni smeri.", "info")));
  const uSl = slider({ label: "napetost napajalnika", min: 0, max: 12, step: 0.1, value: 0, unit: "V", onInput: (v) => (B.U = v) });
  const onT = toggle("napajalnik vklopljen", false, (v) => ((B.vklop = v), log.push(v ? "Napajalnik je vklopljen." : "Napajalnik je izklopljen.", "info")));
  const fuseBtn = button("Zamenjaj varovalko v ampermetru", () => (B.replaceFuse(), log.push("V ampermetru je nova varovalka.", "ok")));
  const zSl = slider({ label: "konica sonde (od sredine tuljave)", min: -10, max: 15, step: 0.5, value: 10, unit: "cm", digits: 1, onInput: (v) => setZ(v) });
  const orSeg = row("sonda", seg("lega Hallovega elementa", [["os", "vzdolž osi"], ["prec", "zasukana za 90°"]], "os", (v) => ((B.sonda.orient = v), log.push(v === "os" ? "Hallov element je pravokoten na os tuljave: meri komponento polja vzdolž osi." : "Sondo si zasukal za 90°: Hallov element meri komponento polja pravokotno na os.", v === "os" ? "info" : "warn"))));
  const rgSeg = row("območje", seg("območje teslametra", [["20", "20 mT"], ["200", "200 mT"], ["2000", "2000 mT"]], "20", (v) => (B.sonda.range = v)));
  const nicBtn = button("Nastavi ničlo teslametra", () => nicli());
  const dvigBtn = button("Pomoči pol v sponke in dvigni", () => sponke(), "primary small");
  const otrBtn = button("Otresi sponke", () => ((B.sponke = 0), log.push("Sponke si otresel nazaj v posodico.", "info")));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => ((meas.length = 0), table.clear(), redraw()));
  const grSeg = seg("graf", [["BI", "B(I)"], ["BN", "B(N)"], ["Bz", "B(z)"]], "BI", (v) => ((graf = v), redraw()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, supL, amL, teL, thL, spL)), controlsBox(
        grp("1. Tuljava in jedro", hint(`Vse tri tuljave imajo enako tuljavnico in približno enako bakra: več ovojev pomeni tanjšo žico, večji upor in manjši dovoljeni tok.`), tSel, jSel, razSeg),
        grp("2. Električni krog", hint(`Napajalnik → ampermeter → tuljava → napajalnik. Napajalnik da do 12${nb}V in največ 3${nb}A (nato preide v način CC). Vhod mA ima varovalko 0,2${nb}A.`), amPosSeg, amSel, prT, buttons(smerBtn), uSl, onT, buttons(fuseBtn)),
        grp("3. Teslameter s Hallovo sondo", hint(`Preden meriš, nastavi ničlo: sonda daleč od tuljave, tok izklopljen. Konica sonde je pri <i>z</i>; tuljava sega od −3 do +3${nb}cm.`), zSl, orSeg, rgSeg, buttons(nicBtn)),
        grp("4. Sponke in kompas", hint("Spodnji konec tuljave ali jedra pomoči v posodico s sponkami in dvigni. Kompas na kladi kaže, kateri pol je spodaj."), buttons(dvigBtn, otrBtn)),
        grp("5. Zapiši", hitrostSeg([1, 10, 60], 1, (v) => (speed = v)), buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Graf"), row("prikaži", grSeg), gBI, gBN, gBz, calc, qBox,
      notes(OS ? POENOSTAVITVE_MAGNETIZEM.elektromagnet.filter((t) => !/nasič|B–H/.test(t)) : POENOSTAVITVE_MAGNETIZEM.elektromagnet, "Polje debele tuljave na osi (integral Biot–Savartovega zakona), μ0 = 1,2566·10⁻⁶ T m/A (CODATA 2018). Tuljave po katalogu LD Didactic (562 13/14/15: 250, 500, 1000 ovojev; 0,6/2,5/9,5 Ω; 5/2,5/1,25 A). Baker α = 0,0039 /K (CRC). Zemeljsko polje v Ljubljani 48 µT, inklinacija 63° (WMM2025). Teslameter ±(2 % + 1 digit) (ocena po šolskih teslametrih). Ocene: krivulja B–H in remanenca železa, razmagnetilni faktor, sila na sponke, toplotna upornost navitja, termično varovalo."),
    ],
    tryText: OS
      ? "Priključi tuljavo, vklopi tok in dvigni sponke. Koliko sponk dvigne tuljava s 1000 ovoji pri 0,5 A in koliko pri 1 A? Koliko jih dvigne z železno palico? Zamenjaj priključka na tuljavi: kam zdaj kaže igla kompasa?"
      : "Nastavi ničlo teslametra, sondo postavi v sredino tuljave (z = 0) in izmeri B pri več tokih za vse tri tuljave. Je B sorazmerna z N·I? Nato vstavi železno palico in izmeri polje ob njenem koncu. Koliko sponk dvigne tuljava brez jedra in koliko z jedrom?",
  });
  el.classList.add("lab");

  function sync() {
    const u_ = B.jedro === "u";
    razSeg.hidden = !u_;
    zSl.input.disabled = u_;
    zSl.hidden = u_;
  }
  function setJedro(v) {
    B.jedro = v;
    B.sponke = 0;
    B.Mrem = B.Mrem0 = 0;
    B.Mmax = 0;
    log.push(v === "zrak" ? "Tuljava je brez jedra." : v === "u" ? "Tuljavo si nataknil na krak U-jedra in jedro zaprl z jarmom. Ploščata sonda gre le v režo med krakom in jarmom." : `V tuljavo si vstavil ${v === "palica" ? "palico iz mehkega železa (Ø 20 mm, 12 cm)" : "kaljen jeklen žebelj (Ø 5 mm, 10 cm)"}.`, "info");
    if (JEDRA[v].L && B.sonda.z < B.zMin) setZ(B.zMin * 100, true);
    sync();
  }
  function setZ(v, quiet) {
    let z = v / 100;
    if (z < B.zMin) {
      z = Math.ceil(B.zMin * 200) / 200;
      if (!quiet) once(`jedro-${B.jedro}`, `Sonda se ustavi na koncu jedra: v železo ne more. Meri polje ob koncu jedra (<i>z</i> ≥ ${num(z * 100, 1)}${nb}cm).`, "info");
      zSl.set(z * 100, true);
    }
    B.sonda.z = z;
  }
  function nicli() {
    const tok = Math.abs(B.st.Icoil) > 5e-3;
    B.nicli();
    B.sonda.nicNapacna = tok;
    if (tok) log.push("Ničlo si nastavil, ko teče tok: teslameter bo od vsake meritve odšteval tudi polje tuljave. Izklopi tok in nastavi ničlo znova.", "bad");
    else log.push("Teslameter kaže nič: odšteje zemeljsko polje vzdolž sonde (~0,04 mT) in odmik Hallovega elementa.", "ok");
  }
  function sponke() {
    if (!B.st.Icoil && !(B.Mrem && JEDRA[B.jedro].L)) {
      B.sponke = 0;
      return log.push("Tok ne teče: nobena sponka se ne prime.", "info");
    }
    const n = B.dvigniSponke();
    if (B.jedro === "u") log.push(`Jedro je zaprto: polje je skoraj vse v železu, zato ${n ? `se jarma ${mn(n, ["prime", "primeta", "primejo", "prime"])} le ${n} ${mn(n, ["sponka", "sponki", "sponke", "sponk"])}` : "se jarma ne prime nobena sponka"}. Jarem pa drži z veliko silo: ~${num(B.nosilnostJarma(), 0)}${nb}N (kot bi nosil ${num(B.nosilnostJarma() / G_SOLA, 0)}${nb}kg).`, "info");
    else if (!n) log.push(B.jedro === "zrak" ? "Sponke se le rahlo premaknejo, a nobena ne ostane: ob koncu tuljave brez jedra je polje šibko in se počasi spreminja." : "Nobena sponka ne ostane: sila je premajhna.", "info");
    else log.push(`Dvignil si ${n} ${mn(n, ["sponko", "sponki", "sponke", "sponk"])}.`, "ok");
  }
  function events() {
    for (const e of B.events.splice(0)) {
      if (e.type === "varovalka") log.push(`Varovalka v ampermetru je pregorela (tok ${num(e.I, 2)}${nb}A, vhod mA zdrži 0,2${nb}A). ${B.amPos === "vzporedno" ? "Ampermeter vzporedno s tuljavo je kratek stik za napajalnik." : "Za večje tokove uporabi vtičnico 10A."} Zamenjaj varovalko.`, "bad");
      if (e.type === "prevec") log.push(`Tok ${num(Math.abs(e.I), 2)}${nb}A je večji od dovoljenega za to tuljavo (${num(B.coil.Imax, 2)}${nb}A): navitje se greje.`, "warn");
      if (e.type === "vonj") log.push(`Diši po vročem laku: navitje ima ${num(e.T, 0)}${nb}°C. Zmanjšaj tok, sicer se izolacija poškoduje.`, "bad");
      if (e.type === "izklop") log.push(`Termično varovalo v tuljavi je prekinilo tok (${num(e.T, 0)}${nb}°C). Počakaj, da se navitje ohladi pod ${GRETJE.vklop}${nb}°C.`, "bad");
      if (e.type === "vklop") log.push(`Navitje se je ohladilo (${num(e.T, 0)}${nb}°C): termično varovalo je spet sklenilo krog.`, "info");
      if (e.type === "cc") log.push("Napajalnik je v načinu CC (omejitev 3 A): napetost na izhodu je nižja od nastavljene.", "info");
      if (e.type === "sponke") log.push(e.na ? `Nekaj sponk je odpadlo, ${mn(e.na, [`ostala je ${e.na}`, `ostali sta ${e.na}`, `ostale so ${e.na}`, `ostalo jih je ${e.na}`])}.` : JEDRA[B.jedro].L && !B.st.Icoil ? (B.jedro === "zebelj" ? "Zadnja sponka je odpadla: kaljeno jeklo je ostalo nekaj časa magnetno (remanenca), nato je magnetizacija toliko popustila, da sponke ni več zdržala." : "Ko je tok prenehal teči, so vse sponke odpadle: mehko železo skoraj ne ostane magnetno.") : "Sponke so odpadle.", "info");
    }
    const st = B.st;
    if (B.amPos === "vzporedno" && st.I > 0.5 && !B.fuseOf().blown) once("kratek", "Ampermeter je vzporedno s tuljavo: ima skoraj nič upora, zato teče skoraj ves tok skozenj (kratek stik). Napajalnik je v načinu CC, tuljava pa skoraj nima toka.", "bad");
    if (B.jedro === "zebelj" && !st.Icoil && B.sponke > 0) once("rem", "Tok je izklopljen, a sponka še visi na žeblju: kaljeno jeklo ostane magnetno (remanenca).", "info");
  }
  function readouts() {
    const st = B.st, P = NAPAJALNIK_EM;
    supL.set(B.vklop ? num(st.Usup, 1) : "", "V", B.vklop ? `${num(st.Isup, 2)}${nb}A · ${st.cc ? "CC" : "CV"}` : "izklopljen");
    const a = B.readA(), r = AM_RANGES[B.amRange];
    amL.set(a.over ? "OL" : a.text, r.unit, B.fuseOf().blown ? "varovalka pregorela" : `območje ${r.unit === "A" ? `10${nb}A` : `${r.max * 1000}${nb}mA`}`);
    const t = B.readT();
    const ni = B.jedro === "u" && !B.vReziMogoce;
    teL.set(ni ? "–" : t.over ? "OL" : t.text, "mT", ni ? "sonda ne gre v režo" : `${TESLA_RANGES[B.sonda.range].max * 1000}${nb}mT · ${B.sonda.nicSet ? "ničla nastavljena" : "ničla ni nastavljena"}`);
    thL.set(num(B.T, 1), "°C", B.odprto ? "varovalo prekinilo" : B.T > GRETJE.vonj ? "diši po laku!" : B.T > GRETJE.vroca ? "vroče" : `${B.coil.N} ovojev`);
    spL.set(String(B.sponke), "", B.jedro === "u" ? `jarem drži ~${num(B.nosilnostJarma(), 0)}${nb}N` : "");
    void P;
  }
  function record() {
    const a = B.readA(), t = B.readT(), rA = AM_RANGES[B.amRange];
    const I = a.over ? NaN : (a.value / rA.k) * (rA.unit === "mA" ? 1 : 1);
    const ni = B.jedro === "u" && !B.vReziMogoce;
    if (ni) log.push("Sonda ni v reži (brez ploščic je reža le ~0,03 mm, sonda je debela 0,5 mm): gostote polja ne moreš izmeriti.", "warn");
    if (t.over) log.push("Teslameter kaže OL: polje je večje od območja. Izberi večje območje.", "warn");
    if (!B.sonda.nicSet) log.push("Teslameter ni bil nastavljen na nič: odčitek vsebuje zemeljsko polje (~0,04 mT) in odmik sonde. Pri šibkih poljih je napaka velika.", "warn");
    if (B.sonda.orient !== "os") log.push("Sonda je zasukana za 90°: meri prečno komponento, ki je na osi skoraj nič. Obrni jo vzdolž osi.", "warn");
    if (B.sonda.nicNapacna) log.push("Ničla je bila nastavljena med tokom: zapisana gostota polja je premajhna.", "warn");
    const z = B.jedro === "u" ? `reža ${num(B.razmik, B.razmik < 1 ? 1 : 0)}${nb}mm` : `${num(B.sonda.z * 100, 1)}${nb}cm`;
    const Bv = ni || t.over ? NaN : t.value;
    const nS = B.sponke;
    table.add({ N: String(B.coil.N), jedro: JED_KRATKO[B.jedro], z, I: a.over ? "OL" : num(I, rA.dec + (rA.unit === "mA" ? 3 : 0)), B: ni ? "–" : t.over ? "OL" : t.text.replace(".", ","), n: String(nS) });
    meas.push({ N: B.coil.N, jedro: B.jedro, z: B.jedro === "u" ? null : B.sonda.z * 100, I: Math.abs(I), B: Math.abs(Bv), n: nS });
    redraw();
  }
  function redraw() {
    const jName = (j) => JED_OPTS.find((o) => o[0] === j)[1];
    const graph = { BI: gBI, BN: gBN, Bz: gBz }[graf];
    for (const g of [gBI, gBN, gBz]) g.hidden = g !== graph;
    let groups, line = () => false;
    if (graf === "BI") {
      groups = skupine(meas.map((m) => ({ ...m, g: `${m.N} ov., ${JED_KRATKO[m.jedro]}${m.z != null ? `, ${num(m.z, 1)} cm` : ""}` })), "g", "I", "B");
      line = (n) => n.includes("brez");
    } else if (graf === "BN") {
      groups = skupine(meas.map((m) => ({ ...m, g: `${num(Math.round(m.I * 10) / 10, 1)} A, ${JED_KRATKO[m.jedro]}` })), "g", "N", "B");
      line = (n) => n.endsWith("brez");
    } else groups = skupine(meas.filter((m) => m.z != null).map((m) => ({ ...m, g: `${m.N} ov., ${JED_KRATKO[m.jedro]}, ${num(m.I, 1)} A` })), "g", "z", "B");
    const pts = [...groups.values()].flat();
    const ax = os(Math.max(graf === "BI" ? 1 : 1000, ...pts.map((p) => p[0]))), ay = os(Math.max(1, ...pts.map((p) => p[1])));
    if (graf === "Bz") graph.setAxes({ x: [Math.min(-10, Math.floor(Math.min(...pts.map((p) => p[0]), 0) / 5) * 5), 15], y: [0, ay.top], xStep: 5, yStep: ay.step });
    else graph.setAxes({ x: [0, ax.top], y: [0, ay.top], xStep: ax.step, yStep: ay.step });
    graph.draw(serije(groups, line));
    // izračun: B/(N·I) za meritve v sredini tuljave brez jedra
    const sred = meas.filter((m) => m.jedro === "zrak" && m.z != null && Math.abs(m.z) < 0.6 && m.I > 0.05 && Number.isFinite(m.B));
    const out = [];
    if (sred.length && !OS) {
      const k = sred.reduce((s_, m) => s_ + m.B / (m.N * m.I), 0) / sred.length;
      out.push(`<p>Brez jedra v sredini tuljave: ${tex(String.raw`\frac{B}{NI} = ${rez(num(k * 1000, 2))}`)}${nb}<b>µT/A</b> (povprečje ${sred.length} meritev). Za dolgo tuljavo bi bilo ${tex(String.raw`\frac{\mu_0}{l} = ${num((1.2566e-6 / NAVITJE.L) * 1e6, 1)}`)}${nb}µT/A; tuljava je kratka in debela, zato je polje v sredini manjše.</p>`);
    }
    const zel = meas.filter((m) => m.jedro !== "zrak" && Number.isFinite(m.B) && m.I > 0.05);
    if (zel.length && sred.length) {
      const k0 = sred.reduce((s_, m) => s_ + m.B / (m.N * m.I), 0) / sred.length;
      const best = zel.reduce((a, m) => (m.B / (m.N * m.I) > a.B / (a.N * a.I) ? m : a));
      const f = num(best.B / (best.N * best.I) / k0, 0);
      out.push(OS ? `<p>Z jedrom (${jName(best.jedro)}) je gostota magnetnega polja pri enakem toku in številu ovojev do ${f}-krat večja kot v sredini tuljave brez jedra.</p>` : `<p>Z jedrom (${jName(best.jedro)}) je ${tex(String.raw`\frac{B}{NI}`)} do ${f}-krat večje kot v sredini tuljave brez jedra.</p>`);
    }
    calc.innerHTML = out.join("");
    const nN = new Set(meas.filter((m) => m.jedro === "zrak" && Number.isFinite(m.B)).map((m) => m.N)).size;
    if (!asked && (nN >= 2 || meas.length >= 6)) {
      asked = true;
      qBox.append(conclusion(OS ? {
        text: "Kaj pokažejo tvoje meritve o elektromagnetu?",
        options: [
          { t: "Elektromagnet je močnejši, če skozi tuljavo teče večji tok, če ima tuljava več ovojev in če vanjo vstaviš železno jedro. Ko zamenjaš smer toka, se zamenjata tudi pola.", ok: true, why: "Vsak ovoj s tokom je kot majhen magnet: več ovojev in večji tok dajo močnejše polje (teslameter kaže več, tuljava dvigne več sponk). Železo v tuljavi se namagneti in polje okrepi. Kateri konec tuljave je severni pol, je odvisno od smeri toka, zato se igla kompasa obrne, ko zamenjaš priključka." },
          { t: "Moč elektromagneta je odvisna le od napetosti napajalnika, število ovojev ni pomembno.", ok: false, why: "Pri enakem toku ima tuljava s 1000 ovoji dvakrat močnejše polje kot tuljava s 500 ovoji. Pomemben je tok, ne napetost: pri isti napetosti teče skozi tuljavo z več ovoji manjši tok, ker ima večji upor." },
          { t: "Železno jedro polje oslabi, ker železo magnetno polje »vpije«.", ok: false, why: "Z železnim jedrom tuljava dvigne veliko več sponk in teslameter ob koncu jedra kaže veliko večjo gostoto polja: železo se namagneti in polje okrepi." },
          { t: "Ko zamenjaš smer toka, ostane severni pol na istem koncu tuljave.", ok: false, why: "Igla kompasa pod tuljavo se obrne: ko tok teče v nasprotni smeri, se pola tuljave zamenjata." },
        ],
      } : {
        text: "Kaj pokažejo tvoje meritve o gostoti magnetnega polja v sredini tuljave?",
        options: [
          { t: "Brez jedra je <i>B</i> sorazmerna z <i>N</i>·<i>I</i>; železno jedro polje večkrat okrepi, a pri velikem toku narašča vse počasneje (nasičenje).", ok: true, why: "Vsak ovoj prispeva enak delež polja, zato je <i>B</i> ∝ <i>N I</i>. Železo se magnetizira in doda svoje polje, dokler se ne nasiči (pri ~1,5–2 T); palica okrepi polje le ~20-krat, ker se odprto jedro samo razmagnetuje, zaprto U-jedro pa ga okrepi veliko bolj." },
          { t: "<i>B</i> je odvisna le od toka, število ovojev ni pomembno.", ok: false, why: "Pri istem toku ima tuljava s 1000 ovoji dvakrat večje polje kot tuljava s 500 ovoji. Pomemben je zmnožek <i>N I</i> (število ovojev krat tok)." },
          { t: "Železno jedro polje vedno okrepi za enak faktor, ne glede na tok.", ok: false, why: "Pri U-jedru se z večjim tokom krivulja <i>B</i>(<i>I</i>) upogne: železo se nasiči. Faktor, za katerega jedro okrepi polje, se zato zmanjšuje." },
          { t: "Tuljava z več ovoji ima pri isti napetosti vedno močnejše polje.", ok: false, why: "Pri isti napetosti ima tuljava z več ovoji tudi večji upor (tanjša žica), zato teče manjši tok. Pri 12 V je <i>N I</i> pri 1000 ovojih (1,25 A) manjše kot pri 500 ovojih (3 A)." },
        ],
      }));
    }
  }

  function draw() {
    svg.replaceChildren();
    gradienti(svg);
    const st = B.st, J = JEDRA[B.jedro], uJ = B.jedro === "u";
    s("rect", { x: 0, y: yMiza, width: W, height: H - yMiza, fill: u(svg, "miza"), class: "lab-mag-mizarob" }, svg);
    stojalo(svg, svg, 24, 8, yMiza, 54);
    // ravnilo za lego sonde (0 v sredini tuljave)
    const rx = 56;
    if (!uJ) {
      s("rect", { x: rx, y: Y(0.155), width: 7, height: Y(-0.105) - Y(0.155), rx: 0.8, class: "lab-mag-ravnilo" }, svg);
      for (let c = -10; c <= 15; c++) {
        const y = Y(c / 100), big = c % 5 === 0;
        s("line", { x1: rx, y1: y, x2: rx + (big ? 4 : 2.2), y2: y, class: "lab-mag-ravnilo-crt" }, svg);
        if (big) label(svg, rx + 5.6, y, String(c).replace("-", "−"), "lab-mag-ravnilo-st", "middle");
      }
    }
    // jedro (za tuljavo) in sonda (gre od zgoraj po osi; v tuljavi jo zakrije navitje)
    const zb = J.L ? Y(-J.L / 2) : 0;
    if (J.L) {
      const w = J.R * 100 * S;
      if (B.jedro === "palica") s("rect", { x: xc - w, y: Y(J.L / 2), width: 2 * w, height: J.L * 100 * S, rx: 1, fill: u(svg, "zelezo"), class: "lab-mag-jedro" }, svg);
      else {
        // žebelj: glava zgoraj, konica spodaj
        const y0 = Y(J.L / 2), y1 = Y(-J.L / 2);
        s("path", { d: `M${xc - w},${y0} H${xc + w} V${y1 - 2.2} L${xc},${y1} L${xc - w},${y1 - 2.2} Z`, fill: u(svg, "jeklo"), class: "lab-mag-jedro" }, svg);
        s("rect", { x: xc - 2.4 * w, y: y0 - 1.4, width: 4.8 * w, height: 1.6, rx: 0.5, fill: u(svg, "jeklo"), class: "lab-mag-jedro" }, svg);
      }
    }
    let gU = null;
    if (uJ) gU = uJedro(svg);
    // sonda
    const sonda = uJ ? null : Y(Math.max(B.zMin, B.sonda.z));
    if (sonda != null) {
      const yH = sonda - 92;
      prijemalo(svg, svg, 24, yH + 6, xc, 6);
      s("rect", { x: xc - 1.5, y: yH + 10, width: 3, height: sonda - yH - 10, rx: 1.2, fill: u(svg, "jeklo"), class: "lab-mag-sonda" }, svg);
      s("rect", { x: xc - 3, y: yH - 6, width: 6, height: 18, rx: 2, fill: "#1f2328", class: "lab-mag-rocaj" }, svg);
      s("path", { d: `M${xc},${yH - 6} C${xc},${yH - 26} 220,${Math.max(8, yH - 30)} ${SOCK[0]},${SOCK[1]}`, class: "lab-mag-kabel" }, svg);
    }
    // tuljava
    const vr = Math.max(0, (B.T - 40) / 120);
    const Tu = tuljava(svg, svg, xc, yc, S, { N: B.coil.N, vroca: vr });
    if (B.T > GRETJE.vroca) toplota(svg, xc, Tu.y0 - (uJ ? 26 : 4), 34, (B.T - GRETJE.vroca) / 50);
    if (uJ) svg.append(gU.front);
    // konica sonde v tuljavi: obris, ki se vidi skozi navitje (kje meri)
    if (sonda != null) {
      s("circle", { cx: xc, cy: sonda, r: 1.6, class: "lab-mag-hall" }, svg);
      if (B.sonda.orient !== "os") s("rect", { x: xc - 3.5, y: sonda - 0.8, width: 7, height: 1.6, class: "lab-mag-hall-el" }, svg);
      else s("rect", { x: xc - 0.8, y: sonda - 3.5, width: 1.6, height: 3.5, class: "lab-mag-hall-el" }, svg);
    }
    // prijemalo za tuljavo (ali za U-jedro)
    if (!uJ) prijemalo(svg, svg, 24, yc, xc - Tu.fw - 1, 4);
    // sponke pod polom
    const yPol = uJ ? gU.yDno : J.L ? zb : Tu.y1;
    s("ellipse", { cx: xc, cy: yMiza - 4, rx: 22, ry: 4, class: "lab-mag-posoda" }, svg);
    for (let i = 0; i < 9; i++) sponka(svg, xc - 16 + ((i * 7) % 30), yMiza - 9 + (i % 3) * 1.2, S * 0.85, 80 + ((i * 47) % 40));
    s("path", { d: `M${xc - 22},${yMiza - 4} a22,4 0 0 0 44,0 v3 a22,4 0 0 1 -44,0 Z`, class: "lab-mag-posoda-rob" }, svg);
    const n = B.sponke;
    if (n > 0) {
      const ver = Math.min(n, 30), cols = Math.min(3, Math.ceil(ver / 6)), per = Math.ceil(ver / cols);
      let k = 0;
      for (let c = 0; c < cols && k < ver; c++)
        for (let i = 0; i < per && k < ver; i++, k++) sponka(svg, xc + (c - (cols - 1) / 2) * 5 + (i % 2 ? 1 : -1), yPol + 1 + i * 2.4 * S * 0.6, S * 0.6, (i % 2 ? 6 : -6) + c * 4);
      if (n > ver) label(svg, xc + 18, yPol + 12, `${n}`, "lab-mag-oznaka");
    }
    // kompas na kladi in povečava od zgoraj
    const kx = xc + KOMPAS.x * 100 * S, ky = (uJ ? gU.yDno : J.L ? zb : Tu.y1) - KOMPAS.dz * 100 * S;
    for (let y = ky + 3, i = 0; y < yMiza; y += 9, i++) s("rect", { x: kx - 11, y, width: 22, height: Math.min(9, yMiza - y), rx: 0.8, fill: u(svg, "les"), class: "lab-mag-klada" }, svg);
    s("ellipse", { cx: kx, cy: ky, rx: 9, ry: 3, class: "lab-mag-kompas-ohisje" }, svg);
    const kot = B.kompas().kot;
    s("line", { x1: kx - 6 * Math.sin((kot * Math.PI) / 180), y1: ky, x2: kx + 6 * Math.sin((kot * Math.PI) / 180), y2: ky, class: "lab-mag-igla-bok" }, svg);
    const ix = 202, iy = 128;
    s("path", { d: `M${kx + 9},${ky - 1} L${ix - 18},${iy + 14}`, class: "lab-mag-vodilo" }, svg);
    kompasRisba(svg, ix, iy, 20, kot);
    // teslameter (levo zgoraj desno od sonde)
    teslameterNaprava(svg, 206, 12);
    // ampermeter in napajalnik
    const a = B.readA(), Ir = AM_RANGES[B.amRange];
    const dm = multimeter(svg, svg, 176, 190, 54, 104, { text: B.fuseOf().blown ? "0.00" : a.over ? "OL" : a.text, unit: Ir.unit, kot: { "20m": 20, "200m": 45, "10": 80 }[B.amRange], ime: "ampermeter" });
    const sp = napajalnik(svg, svg, 246, 218, { on: B.vklop, U: st.Usup, I: st.Isup, cc: st.cc, Uset: B.U, Umax: 12, Iset: NAPAJALNIK_EM.ilim, Imax: 3, ime: "napajalnik 0–12 V, 3 A" });
    // vodniki s krokodilčki
    const jIn = dm.jack(B.amRange === "10" ? "10A" : "mA"), jCom = dm.jack("COM");
    const [t1, t2] = B.smer > 0 ? [Tu.t1, Tu.t2] : [Tu.t2, Tu.t1];
    // krokodilčka: na priključkih tuljave (čeljusti na pušici, kabel iz ročaja v desno) ali snet in odložen na mizo
    const prik = B.prikljuceno;
    const k1 = prik ? [t1[0] + 6, t1[1], 0] : [t1[0] + 16, yMiza - 3, 8], k2 = prik ? [t2[0] + 6, t2[1], 0] : [t2[0] + 30, yMiza - 2, -6];
    const tt1 = rep(...k1), tt2 = rep(...k2);
    // kabli visijo z vtičev navzdol in ležijo na mizi (vsak v svoji »progi«, da se ne prekrivajo)
    if (B.amPos === "zaporedno") {
      kabel(svg, sp.plus, jIn, yMiza + 4, "r", [0, 1]);
      kabel(svg, tt1, jCom, yMiza + 8, "r");
      kabel(svg, tt2, sp.minus, yMiza + 12, "k");
    } else {
      kabel(svg, tt1, sp.plus, yMiza + 4, "r");
      kabel(svg, tt1, jIn, yMiza + 8, "r");
      kabel(svg, tt2, jCom, yMiza + 11, "k");
      kabel(svg, tt2, sp.minus, yMiza + 14, "k");
    }
    krokodil(svg, ...k1.slice(0, 2), "r", k1[2]);
    krokodil(svg, ...k2.slice(0, 2), "k", k2[2]);
    merilo(svg, 14, H - 5, 5 * S, "5 cm");
    if (speed > 1) label(svg, 330, 206, `čas teče ×${speed}`, "lab-mag-warn");
    svg.setAttribute("aria-label", `Elektromagnet: tuljava s ${B.coil.N} ovoji, ${JEDRA[B.jedro].name}; tok ${num(Math.abs(st.Icoil), 2)} A; ${uJ ? "ploščata sonda v reži" : `konica sonde ${num(B.sonda.z * 100, 1)} cm od sredine tuljave`}; ${B.sponke} ${mn(B.sponke, ["sponka", "sponki", "sponke", "sponk"])}; igla kompasa odklonjena za ${num(Math.abs(kot), 0)}°.`);
  }
  // U-jedro (obrnjeno navzdol, ∩) z jarmom spodaj; tuljava je na levem kraku. Vrne sprednji del (za tuljavo spredaj).
  function uJedro(g) {
    const a = 4 * S, xl = xc, xr = xc + 12 * S, yBar = yc - 6.4 * S, yJar = yc + 6.4 * S, gap = Math.max(1.4, B.razmik * 0.9), lam = (x, y, w, hh, vert) => {
      s("rect", { x, y, width: w, height: hh, fill: u(svg, vert ? "lamelev" : "lamele"), class: "lab-mag-lamele" }, g);
      for (let q = 1.2; q < (vert ? w : hh); q += 1.2) s("line", vert ? { x1: x + q, y1: y + 0.3, x2: x + q, y2: y + hh - 0.3, class: "lab-mag-lamela" } : { x1: x + 0.3, y1: y + q, x2: x + w - 0.3, y2: y + q, class: "lab-mag-lamela" }, g);
    };
    prijemalo(g, svg, 24, yBar, xl - a / 2 - 2, 4);
    lam(xl - a / 2, yBar - a / 2, xr - xl + a, a, false); // zgornji del
    lam(xl - a / 2, yBar + a / 2, a, yJar - yBar - a - gap, true); // levi krak (za tuljavo)
    const front = s("g", {});
    lam.call(null, xr - a / 2, yBar + a / 2, a, yJar - yBar - a - gap, true);
    // ploščici in jarem
    const yJ = yJar - a / 2;
    if (B.razmik > 0) for (const x of [xl, xr]) s("rect", { x: x - a / 2 - 1, y: yJ - gap, width: a + 2, height: gap, class: "lab-mag-ploscica" }, front);
    const jg = front;
    s("rect", { x: xl - a / 2, y: yJ, width: xr - xl + a, height: a, fill: u(svg, "lamele"), class: "lab-mag-lamele" }, jg);
    for (let q = 1.2; q < a; q += 1.2) s("line", { x1: xl - a / 2 + 0.3, y1: yJ + q, x2: xr + a / 2 - 0.3, y2: yJ + q, class: "lab-mag-lamela" }, jg);
    // ploščata sonda v reži pod levim krakom (od leve)
    if (B.razmik >= HALL.debelina) {
      s("rect", { x: xl - a / 2 - 26, y: yJ - gap / 2 - 0.6, width: 26 + a * 0.55, height: 1.2, fill: u(svg, "jeklo"), class: "lab-mag-sonda" }, front);
      s("rect", { x: xl - a / 2 - 40, y: yJ - gap / 2 - 3, width: 14, height: 6, rx: 2, fill: "#1f2328" }, front);
      s("path", { d: `M${xl - a / 2 - 40},${yJ - gap / 2} C${xl - 70},${yJ - 70} 200,40 ${SOCK[0]},${SOCK[1]}`, class: "lab-mag-kabel" }, front);
      if (B.sonda.orient !== "os") s("rect", { x: xl - 0.8, y: yJ - gap / 2 - 3, width: 1.6, height: 6, class: "lab-mag-hall-el" }, front);
    } else {
      s("rect", { x: xl - a / 2 - 40, y: yJ - 3 - 10, width: 14, height: 6, rx: 2, fill: "#1f2328" }, front);
      s("rect", { x: xl - a / 2 - 26, y: yJ - 10 - 0.6, width: 22, height: 1.2, fill: u(svg, "jeklo"), class: "lab-mag-sonda" }, front);
      s("path", { d: `M${xl - a / 2 - 40},${yJ - 10} C${xl - 70},${yJ - 70} 200,40 ${SOCK[0]},${SOCK[1]}`, class: "lab-mag-kabel" }, front);
    }
    return { front, yDno: yJ + a };
  }
  function teslameterNaprava(g, x, y) {
    const w = 150, hh = 80;
    s("rect", { x, y, width: w, height: hh, rx: 5, fill: u(svg, "modro"), stroke: "#101c2b", "stroke-width": 1 }, g);
    label(g, x + 8, y + 9, "TESLAMETER", "lab-mag-panel-sv", "start");
    s("rect", { x: x + 8, y: y + 16, width: 84, height: 28, rx: 2, class: "lab-mag-lcdbg" }, g);
    const t = B.readT(), ni = B.jedro === "u" && !B.vReziMogoce;
    label(g, x + 88, y + 31, ni ? "– – –" : t.over ? "OL" : t.text.replace(".", ",").replace("-", "−"), "lab-mag-lcdbig", "end");
    label(g, x + 88, y + 41, "mT", "lab-mag-lcdunit", "end");
    // izbirnik območja
    const kx = x + 118, ky = y + 30, idx = ["20", "200", "2000"].indexOf(B.sonda.range);
    s("circle", { cx: kx, cy: ky, r: 11, fill: "#20252a", stroke: "#5c6670", "stroke-width": 1 }, g);
    const ang = (-50 + idx * 50) * (Math.PI / 180);
    s("line", { x1: kx, y1: ky, x2: kx + Math.sin(ang) * 9, y2: ky - Math.cos(ang) * 9, stroke: "#f2f4f6", "stroke-width": 2, "stroke-linecap": "round" }, g);
    ["20", "200", "2000"].forEach((r, i) => {
      const q = (-50 + i * 50) * (Math.PI / 180);
      label(g, kx + Math.sin(q) * 17, ky - Math.cos(q) * 16, r, "lab-mag-panel-sv small");
    });
    // tipka za ničlo in vtičnica za sondo
    s("rect", { x: x + 10, y: y + 54, width: 22, height: 14, rx: 3, fill: "#c62828", stroke: "#7a1414" }, g);
    label(g, x + 21, y + 61.5, "0", "lab-mag-panel-sv");
    label(g, x + 38, y + 61.5, "ničla", "lab-mag-panel-sv small", "start");
    s("circle", { cx: SOCK[0], cy: SOCK[1], r: 4.5, fill: "#111", stroke: "#666", "stroke-width": 0.8 }, g);
    label(g, SOCK[0] - 8, SOCK[1], "sonda", "lab-mag-panel-sv small", "end");
  }

  sync();
  draw();
  readouts();
  redraw();
  ticker(el, (dt) => {
    B.step(dt * speed);
    events();
    readouts();
    draw();
  }, 100);
}

// ================================================================ 2. sila na vodnik: tokovna tehtnica
export function labSilaVodnik(el) {
  const B = new TehtnicaBench({ seed: seme() });
  const W = 400, H = 300, S = 6, yMiza = 286, xm = 120; // 1 cm = 6 enot
  const svg = svgBox(W, H, "lab-bench lab-mag lab-mag-tt");
  const log = eventLog();
  const teL = lcd("tehtnica"), amL = lcd("ampermeter"), supL = lcd("napajalnik");
  const table = dataTable([
    { key: "n", label: "magneti" },
    { key: "L", label: "<i>L</i> [cm]" },
    { key: "I", label: "<i>I</i> [A]" },
    { key: "dm", label: "Δ<i>m</i> [g]" },
    { key: "F", label: "<i>F</i> [mN]" },
  ], { empty: "Še ni meritev. Tariraj tehtnico, nastavi tok in zapiši spremembo odčitka." });
  const gI = dataGraph({ x: [0, 5], y: [0, 20], xStep: 1, yStep: 5, xLabel: "I [A]", yLabel: "F [mN]", title: "Sila na vodnik v odvisnosti od toka" });
  const gL = dataGraph({ x: [0, 8], y: [0, 20], xStep: 2, yStep: 5, xLabel: "L [cm]", yLabel: "F [mN]", title: "Sila na vodnik v odvisnosti od dolžine vodnika v polju" });
  const calc = h("div", { class: "lab-mag-calc", "aria-live": "polite" });
  const qBox = h("div");
  const meas = [];
  let graf = "FI", asked = false;
  const said = {};
  const once = (k, text, kind = "warn") => said[k] || ((said[k] = true), log.push(text, kind));

  const nSeg = row("magneti", seg("število magnetov v nosilcu", [1, 2, 3, 4, 5, 6].map((n) => [String(n), String(n)]), "6", (v) => ((B.nMag = +v), (said.tara = false), log.push(`V nosilcu ${mn(+v, ["je", "sta", "so", "je"])} ${v} ${mn(+v, ["magnet", "magneta", "magneti", "magnetov"])}. Masa na tehtnici se je spremenila: tariraj znova.`, "info"))));
  const polSeg = row("pola", seg("razpored polov", [["1", "severni spredaj"], ["-1", "severni zadaj"]], "1", (v) => ((B.polaritetaMag = +v), log.push("Magnete si v nosilcu obrnil: pola sta zamenjana.", "info"))));
  const kotSeg = row("nosilec", seg("smer polja glede na vodnik", [["precno", "polje prečno na vodnik"], ["vzporedno", "zasukan za 90°"]], "precno", (v) => ((B.kot = v), log.push(v === "precno" ? "Nosilec stoji tako, da je polje v reži pravokotno na vodnik." : "Nosilec si zasukal za 90°: polje je zdaj vzporedno z vodnikom.", v === "precno" ? "info" : "warn"))));
  const lSel = select({ label: "tiskanina (dolžina vodnika v polju)", options: VODNIKI.map((L) => [String(L), `${num(L * 100, 0)} cm`]), value: String(B.L), onChange: (v) => ((B.L = +v), log.push(`Zamenjal si tiskanino: vodoravni del vodnika je dolg ${num(+v * 100, 0)}${nb}cm.`, "info")) });
  const visSeg = row("višina", seg("višina vodnika", [["reza", "v reži"], ["rob", "na robu reže"], ["nad", "1 cm nad magnetom"]], "reza", (v) => ((B.visina = v), log.push(v === "reza" ? "Vodoravni del vodnika je sredi reže med magnetoma." : v === "rob" ? "Vodnik je na zgornjem robu reže: polje je tam šibkejše." : "Vodnik je nad magnetom, zunaj reže: tam je le šibko stresano polje.", v === "reza" ? "info" : "warn"))));
  const taraBtn = button("Tariraj tehtnico (TARE)", () => (B.tariraj(), log.push(B.st.I ? "Tariral si med tokom: tehtnica zdaj kaže spremembo glede na ta tok, ne glede na nič." : "Tehtnica kaže 0,00 g.", B.st.I ? "warn" : "ok")), "primary small");
  const onT = toggle("napajalnik vklopljen", false, (v) => ((B.vklop = v), log.push(v ? "Napajalnik je vklopljen." : "Napajalnik je izklopljen.", "info")));
  const uSl = slider({ label: "napetost (gumb U)", min: 0, max: 12, step: 0.1, value: B.U, unit: "V", onInput: (v) => (B.U = v) });
  const iSl = slider({ label: "omejitev toka (gumb I)", min: 0, max: 5, step: 0.1, value: 0, unit: "A", onInput: (v) => (B.Ilim = v) });
  const amSel = select({ label: "vtičnica in območje ampermetra", options: [["10", "10 A (vtičnica 10A)"], ["200m", "200 mA (vtičnica mA)"]], value: B.amRange, onChange: (v) => (B.amRange = v) });
  const smerBtn = button("Zamenjaj priključka na tiskanini", () => ((B.smer *= -1), log.push("Zamenjal si vodnika na tiskanini: tok teče v nasprotni smeri.", "info")));
  const fuseBtn = button("Zamenjaj varovalko v ampermetru", () => (B.replaceFuse(), log.push("V ampermetru je nova varovalka.", "ok")));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => ((meas.length = 0), table.clear(), redraw()));
  const grSeg = seg("graf", [["FI", "F(I)"], ["FL", "F(L)"]], "FI", (v) => ((graf = v), redraw()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, teL, amL, supL)), controlsBox(
        grp("1. Magnet na tehtnici", hint("Nosilec iz jekla z magneti stoji na tehtnici. Med severnim (rdečim, S) in južnim (zelenim, J) polom je reža s skoraj enakomernim poljem."), nSeg, polSeg, kotSeg),
        grp("2. Vodnik", hint("Tiskanina je pritrjena na stojalo in se magneta ne dotika. Vodoravni del bakrene vezi gre skozi režo."), lSel, visSeg),
        grp("3. Tehtnica in tok", hint(`Najprej tariraj. Krog ima skoraj nič upora, zato napajalnik dela v načinu CC: tok nastaviš z gumbom I (do 5${nb}A).`), buttons(taraBtn), amSel, uSl, iSl, onT, buttons(smerBtn, fuseBtn)),
        grp("4. Zapiši", buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Graf"), row("prikaži", grSeg), gI, gL, calc, qBox,
      notes(POENOSTAVITVE_MAGNETIZEM.sila, `Sila na vodnik ${tex(String.raw`F = ILB\sin\alpha`)}; tehtnica kaže ${tex(String.raw`\Delta m = \frac{F}{g}`)} (tretji Newtonov zakon), <i>g</i> = 9,806 m/s² v Ljubljani. Tehtnica 0,01 g (npr. KERN EMB 200-2). Ocene po šolskih kompletih (npr. PASCO SF-8607): gostota polja feritnih magnetov v reži ~0,09 T, širina magneta 1,4 cm, oblika polja ob robu, upor tiskanine.`),
    ],
    tryText: "Tariraj tehtnico in povečuj tok od 0 do 5 A po 1 A. Nariši F(I) in iz naklona izračunaj B. Nato pri 3 A zamenjaj tiskanine (1, 2, 4, 8 cm). Kaj se zgodi, ko zamenjaš smer toka ali nosilec zasukaš za 90°?",
  });
  el.classList.add("lab");

  function events() {
    for (const e of B.events.splice(0)) {
      if (e.type === "varovalka") log.push(`Varovalka v ampermetru je pregorela (tok ${num(e.I, 2)}${nb}A, vhod mA zdrži 0,2${nb}A). Uporabi vtičnico 10A in zamenjaj varovalko.`, "bad");
      if (e.type === "toplo") log.push(`Tiskanina se segreva (${num(e.T, 0)}${nb}°C): pri velikem toku se baker greje, sila na vodnik pa se zaradi tega ne spremeni.`, "info");
    }
    if (B.vklop && B.Ilim > 0 && B.U < 0.1) once("u0", "Gumb za napetost je na nič: tok ne teče. Napetost nastavi na nekaj voltov, tok pa omeji z gumbom I.", "warn");
  }
  function readouts() {
    const st = B.st, t = B.read();
    teL.set(t.text, "g", B.tarirano ? "tarirano" : "ni tarirano");
    const a = B.readA(), r = AM_RANGES[B.amRange];
    amL.set(a.over ? "OL" : a.text, r.unit, B.fuseOf().blown ? "varovalka pregorela" : `območje ${r.unit === "A" ? `10${nb}A` : `${r.max * 1000}${nb}mA`}`);
    supL.set(B.vklop ? num(st.Usup, 2) : "", "V", B.vklop ? `${num(st.Isup, 2)}${nb}A · ${st.cc ? "CC" : "CV"}` : "izklopljen");
  }
  function record() {
    const t = B.read(), a = B.readA(), rA = AM_RANGES[B.amRange];
    if (!B.tarirano || Math.abs(t.value) > 20) once("tara", `Tehtnica ni tarirana: odčitek ${t.text.replace(".", ",")}${nb}g vsebuje maso nosilca z magneti. Tariraj, ko tok ne teče, in meri znova.`, "bad");
    const I = a.over ? NaN : a.value / rA.k;
    const dm = t.value, F = (dm / 1000) * G_SOLA * 1000; // mN
    table.add({ n: String(B.nMag), L: num(B.L * 100, 0), I: a.over ? "OL" : num(I, rA.unit === "A" ? 2 : 3), dm: num(dm, 2), F: num(F, 2) });
    meas.push({ n: B.nMag, L: B.L * 100, I, dm, F, vis: B.visina, kot: B.kot });
    if (B.kot !== "precno" && Math.abs(B.st.I) > 0.5) once("vzp", "Polje je vzporedno z vodnikom: sila je skoraj nič (sin 0° = 0).", "info");
    redraw();
  }
  function redraw() {
    gI.hidden = graf !== "FI";
    gL.hidden = graf !== "FL";
    const ok = meas.filter((m) => Number.isFinite(m.I) && Number.isFinite(m.F) && Math.abs(m.dm) < 20);
    const gr1 = skupine(ok.map((m) => ({ ...m, g: `${num(m.L, 0)} cm, ${m.n} mag.`, x: Math.abs(m.I), y: Math.abs(m.F) })), "g", "x", "y");
    const gr2 = skupine(ok.map((m) => ({ ...m, g: `${num(Math.round(Math.abs(m.I) * 10) / 10, 1)} A, ${m.n} mag.`, x: m.L, y: Math.abs(m.F) })), "g", "x", "y");
    const a1 = os(Math.max(1, ...[...gr1.values()].flat().map((p) => p[0]))), b1 = os(Math.max(2, ...[...gr1.values()].flat().map((p) => p[1])));
    gI.setAxes({ x: [0, Math.max(5, a1.top)], y: [0, b1.top], xStep: 1, yStep: b1.step });
    gI.draw(serije(gr1));
    const b2 = os(Math.max(2, ...[...gr2.values()].flat().map((p) => p[1])));
    gL.setAxes({ x: [0, 8], y: [0, b2.top], xStep: 2, yStep: b2.step });
    gL.draw(serije(gr2));
    const out = [];
    for (const [name, pts] of gr1) {
      if (pts.length < 2) continue;
      const k = naklonSkoziIzhodisce(pts), L = parseFloat(name) / 100;
      out.push(`<p><b>${name}</b>: naklon <i>F</i>(<i>I</i>) je ${num(k, 2)}${nb}mN/A, zato je ${tex(String.raw`B = \frac{k}{L} = \frac{${num(k / 1000, 5)}${en("N/A")}}{${num(L, 2)}${en("m")}} = ${rez(num(k / 1000 / L, 3), "T")}`)}.</p>`);
    }
    for (const [name, pts] of gr2) {
      if (pts.length < 2) continue;
      const k = naklonSkoziIzhodisce(pts), I = parseFloat(name.replace(",", "."));
      if (I > 0) out.push(`<p><b>${name}</b>: naklon <i>F</i>(<i>L</i>) je ${num(k, 2)}${nb}mN/cm, zato je ${tex(String.raw`B = \frac{k}{I} = ${rez(num((k * 100) / 1000 / I, 3), "T")}`)}.</p>`);
    }
    calc.innerHTML = out.join("");
    const max = Math.max(0, ...[...gr1.values(), ...gr2.values()].map((p) => p.length));
    if (max >= 4 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj pokažejo meritve s tokovno tehtnico?",
        options: [
          { t: "Sila je sorazmerna s tokom in z dolžino vodnika v polju: <i>F</i> = <i>B I L</i>, ko je vodnik pravokoten na polje.", ok: true, why: "Obe premici gresta skozi izhodišče. Iz naklona izračunaš gostoto polja <i>B</i>; ko je polje vzporedno z vodnikom, sile ni (sin 0° = 0)." },
          { t: "Tehtnica kaže manj, ker tok magnet segreje in ga naredi lažjega.", ok: false, why: "Masa magneta se ne spremeni. Tehtnica čuti silo, s katero vodnik deluje na magnet: po tretjem Newtonovem zakonu je nasprotno enaka sili polja na vodnik." },
          { t: "Sila je sorazmerna s kvadratom toka.", ok: false, why: "Točke na grafu <i>F</i>(<i>I</i>) ležijo na premici, ne na paraboli: dvakrat večji tok da dvakrat večjo silo." },
          { t: "Smer toka ni pomembna, tehtnica vedno kaže več.", ok: false, why: "Ko zamenjaš smer toka (ali pola), se sila obrne: odčitek se zmanjša namesto poveča. Smer sile da pravilo desne roke." },
        ],
      }));
    }
  }

  function draw() {
    svg.replaceChildren();
    gradienti(svg);
    s("rect", { x: 0, y: yMiza, width: W, height: H - yMiza, fill: u(svg, "miza"), class: "lab-mag-mizarob" }, svg);
    stojalo(svg, svg, 30, 10, yMiza, 70);
    // tehtnica
    const bx = 60, bw = 120, by = 252;
    s("path", { d: `M${bx},${yMiza} L${bx + 4},${by} H${bx + bw - 4} L${bx + bw},${yMiza} Z`, fill: "url(#" + svg.uid + "-plosca)", stroke: "#7d858e", "stroke-width": 1 }, svg);
    s("rect", { x: bx + 30, y: by + 8, width: 60, height: 17, rx: 2, class: "lab-mag-lcdbg" }, svg);
    const tr = B.read();
    label(svg, bx + 80, by + 17, tr.text.replace(".", ",").replace("-", "−"), "lab-mag-lcdbal", "end");
    label(svg, bx + 83, by + 18, "g", "lab-mag-lcdunit", "start");
    for (const [x, t] of [[bx + 10, "ON"], [bx + bw - 22, "TARE"]]) {
      s("rect", { x, y: by + 11, width: 13, height: 9, rx: 2, fill: "#3a4148" }, svg);
      label(svg, x + 6.5, by + 27, t, "lab-mag-panel");
    }
    s("rect", { x: xm - 3, y: by - 5, width: 6, height: 5, fill: "#6d757d" }, svg);
    s("rect", { x: bx + 16, y: by - 8, width: bw - 32, height: 3.5, rx: 1, fill: u(svg, "jeklov"), stroke: "#6d757d", "stroke-width": 0.5 }, svg);
    // nosilec z magneti (poševni pogled: sprednja ploskev in zgornja ploskev z režo)
    const vz = B.kot !== "precno", Lh = vz ? 4 * S : 10 * S, dep = vz ? { x: 26, y: -19 } : { x: 13, y: -10 };
    const hx0 = xm - Lh / 2, hy = by - 8, hh = 3.5 * S, top = hy - hh;
    const P = (x, f) => [x + dep.x * f, top + dep.y * f];
    const poly = (pts, attrs) => s("polygon", { points: pts.map((p) => p.map((q) => q.toFixed(1)).join(",")).join(" "), ...attrs }, svg);
    const back = () => {
      poly([P(hx0, 0.7), P(hx0 + Lh, 0.7), P(hx0 + Lh, 1), P(hx0, 1)], { fill: u(svg, "jeklov"), class: "lab-mag-nosilec" });
      poly([P(hx0 + 1, 0.42), P(hx0 + Lh - 1, 0.42), P(hx0 + Lh - 1, 0.58), P(hx0 + 1, 0.58)], { class: "lab-mag-reza" });
      // magneti na zadnji steni reže (pobarvan pol)
      if (!vz) for (const m of B.magneti) poly([P(xm + m.x1 * 100 * S + 0.3, 0.58), P(xm + m.x2 * 100 * S - 0.3, 0.58), P(xm + m.x2 * 100 * S - 0.3, 0.7), P(xm + m.x1 * 100 * S + 0.3, 0.7)], { fill: u(svg, B.polaritetaMag > 0 ? "zelena" : "rdeca"), class: "lab-mag-pol" });
    };
    const front = () => {
      if (!vz) for (const m of B.magneti) poly([P(xm + m.x1 * 100 * S + 0.3, 0.3), P(xm + m.x2 * 100 * S - 0.3, 0.3), P(xm + m.x2 * 100 * S - 0.3, 0.42), P(xm + m.x1 * 100 * S + 0.3, 0.42)], { fill: u(svg, B.polaritetaMag > 0 ? "rdeca" : "zelena"), class: "lab-mag-pol" });
      poly([P(hx0, 0), P(hx0 + Lh, 0), P(hx0 + Lh, 0.3), P(hx0, 0.3)], { fill: u(svg, "jeklov"), class: "lab-mag-nosilec" });
      s("rect", { x: hx0, y: top, width: Lh, height: hh, fill: u(svg, "jeklo"), class: "lab-mag-nosilec" }, svg);
      poly([P(hx0 + Lh, 0), P(hx0 + Lh, 1), [hx0 + Lh + dep.x, top + dep.y + hh], [hx0 + Lh, top + hh]], { fill: "#5d656d", class: "lab-mag-nosilec" });
      if (vz) {
        // zasukan nosilec: reža gre v globino, vidni so magneti ob obeh straneh
        s("rect", { x: xm - 4, y: top + 2, width: 8, height: hh - 4, fill: "#1b1e22" }, svg);
        s("rect", { x: xm - 6, y: top + 2, width: 2, height: hh - 4, fill: u(svg, B.polaritetaMag > 0 ? "rdeca" : "zelena") }, svg);
        s("rect", { x: xm + 4, y: top + 2, width: 2, height: hh - 4, fill: u(svg, B.polaritetaMag > 0 ? "zelena" : "rdeca") }, svg);
      }
    };
    back();
    // tiskanina z vezjem (stoji v sredini globine reže)
    const yb = { reza: top + 0.5 * dep.y + 4, rob: top + 0.5 * dep.y - 1, nad: top + 0.5 * dep.y - 1 - 1 * S }[B.visina];
    const L = B.L * 100 * S, bw2 = L + 2.2 * S, bxL = xm + 0.5 * dep.x - bw2 / 2, byT = top - 7.5 * S;
    s("rect", { x: bxL, y: byT, width: bw2, height: yb - byT + 1.5, rx: 1.5, fill: u(svg, "tiskanina"), class: "lab-mag-pcb" }, svg);
    const xA = xm + 0.5 * dep.x - L / 2, xB = xm + 0.5 * dep.x + L / 2, yv = yb - 1.6;
    s("path", { d: `M${xA},${byT + 8} V${yv} H${xB} V${byT + 8}`, class: "lab-mag-vez" }, svg);
    s("path", { d: `M${xA},${byT + 8} V${yv} H${xB} V${byT + 8}`, class: "lab-mag-vez-hl" }, svg);
    pusica(svg, xA, byT + 6, "k", 2);
    pusica(svg, xB, byT + 6, "k", 2);
    // oznaka dolžine levo od tiskanine (na njej bi prekrila bakreno vez pri kratkih vodnikih)
    label(svg, bxL - 3, byT + 18, `L = ${num(B.L * 100, 0)}${nb}cm`, "lab-mag-oznaka halo", "end");
    // držalo tiskanine na stojalu
    s("rect", { x: 30, y: byT - 10, width: xm + 0.5 * dep.x - 30, height: 3.4, fill: u(svg, "palica") }, svg);
    s("rect", { x: 25, y: byT - 13, width: 10, height: 10, rx: 1.5, fill: "#5a626b" }, svg);
    s("rect", { x: xm + 0.5 * dep.x - 8, y: byT - 12, width: 16, height: 12, rx: 1.5, fill: "#3a4148" }, svg);
    front();
    // ampermeter in napajalnik
    const st = B.st, a = B.readA(), Ir = AM_RANGES[B.amRange];
    const dm = multimeter(svg, svg, 200, 104, 54, 104, { text: B.fuseOf().blown ? "0.00" : a.over ? "OL" : a.text, unit: Ir.unit, kot: { "200m": 45, "10": 80 }[B.amRange], ime: "ampermeter" });
    const sp = napajalnik(svg, svg, 246, 208, { on: B.vklop, U: st.Usup, I: st.Isup, cc: st.cc, Uset: B.U, Umax: 12, Iset: B.Ilim, Imax: 5, ime: "napajalnik 0–12 V, 0–5 A" });
    const jIn = dm.jack(B.amRange === "10" ? "10A" : "mA"), jCom = dm.jack("COM");
    const [cL, cR] = B.smer > 0 ? [[xA, byT + 6], [xB, byT + 6]] : [[xB, byT + 6], [xA, byT + 6]];
    kabel(svg, sp.plus, jIn, yMiza + 5, "r", [0, 1]);
    // krokodilčka s čeljustma navzdol na pušicah tiskanine, kabla gresta iz ročajev navzgor
    const rL = rep(cL[0], cL[1] - 6, -90), rR = rep(cR[0], cR[1] - 6, -90);
    zica(svg, `M${jCom[0]},${jCom[1]} C${jCom[0]},${jCom[1] + 30} ${jCom[0] - 40},${byT - 50} ${rL[0]},${rL[1] - 2} L${rL[0]},${rL[1]}`, "r");
    // črni kabel: z vtiča navzdol, po mizi do reže med tehtnico in ampermetrom, tam navzgor in v loku do krokodilčka
    const T2 = yMiza + 9, [mx, my] = sp.minus;
    zica(svg, `M${mx},${my} C${mx},${T2} ${mx - 12},${T2} ${mx - 24},${T2} L196,${T2} C184,${T2} 186,${byT - 34} ${rR[0] + 24},${byT - 34} C${rR[0] + 6},${byT - 34} ${rR[0]},${rR[1] - 12} ${rR[0]},${rR[1]}`, "k");
    krokodil(svg, cL[0], cL[1] - 6, "r", -90);
    krokodil(svg, cR[0], cR[1] - 6, "k", -90);
    // povečava od zgoraj
    povecava(svg, 210, 8, 182, 80);
    merilo(svg, 14, H - 4, 5 * S, "5 cm");
    svg.setAttribute("aria-label", `Tokovna tehtnica: ${B.nMag} ${mn(B.nMag, ["magnet", "magneta", "magneti", "magnetov"])} na tehtnici, tiskanina z vodnikom ${num(B.L * 100, 0)} cm ${B.visina === "reza" ? "v reži" : B.visina === "rob" ? "na robu reže" : "nad magnetom"}, polje ${B.kot === "precno" ? "prečno na vodnik" : "vzporedno z vodnikom"}; tok ${num(Math.abs(st.I), 2)} A; tehtnica kaže ${tr.text} g.`);
  }
  // Pogled od zgoraj (povečano ×2): reža z magneti, vodnik s smerjo toka, polje B in sila (⊙ navzgor, ⊗ navzdol).
  function povecava(g, x, y, w, hh) {
    const k = 18, cx = x + w / 2, cy = y + hh / 2 - 4; // 18 enot na cm
    s("rect", { x, y, width: w, height: hh, rx: 7, class: "lab-mag-lupa-bg" }, g);
    const vz = B.kot !== "precno";
    const nSpr = B.polaritetaMag > 0; // severni pol spredaj (spodaj v pogledu od zgoraj)
    const half = (B.nMag * MAGNETI.w * 100 * k) / 2;
    if (!vz) {
      s("rect", { x: cx - half, y: cy - 16, width: 2 * half, height: 8, fill: u(svg, nSpr ? "zelena" : "rdeca") }, g);
      s("rect", { x: cx - half, y: cy + 8, width: 2 * half, height: 8, fill: u(svg, nSpr ? "rdeca" : "zelena") }, g);
      for (let i = 0; i < B.nMag; i++) {
        const xx = cx - half + (i + 0.5) * ((2 * half) / B.nMag);
        label(g, xx, cy - 12, nSpr ? "J" : "S", "lab-mag-polst");
        label(g, xx, cy + 12, nSpr ? "S" : "J", "lab-mag-polst");
        if (i > 0) for (const yy of [cy - 16, cy + 8]) s("line", { x1: cx - half + i * ((2 * half) / B.nMag), y1: yy, x2: cx - half + i * ((2 * half) / B.nMag), y2: yy + 8, class: "lab-mag-meja" }, g);
      }
      for (let i = 0; i < B.nMag; i++) {
        const xx = cx - half + (i + 0.5) * ((2 * half) / B.nMag);
        s("line", { x1: xx + 6, y1: nSpr ? cy + 7 : cy - 7, x2: xx + 6, y2: nSpr ? cy - 5 : cy + 5, class: "lab-mag-bpuscica", "marker-end": `url(#${svg.uid}-bm)` }, g);
      }
    } else {
      s("rect", { x: cx - 16, y: y + 6, width: 8, height: hh - 22, fill: u(svg, nSpr ? "rdeca" : "zelena") }, g);
      s("rect", { x: cx + 8, y: y + 6, width: 8, height: hh - 22, fill: u(svg, nSpr ? "zelena" : "rdeca") }, g);
      for (let i = 0; i < 3; i++) s("line", { x1: nSpr ? cx - 7 : cx + 7, y1: y + 14 + i * 18, x2: nSpr ? cx + 5 : cx - 5, y2: y + 14 + i * 18, class: "lab-mag-bpuscica", "marker-end": `url(#${svg.uid}-bm)` }, g);
    }
    const mk = s("marker", { id: `${svg.uid}-bm`, viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 5, markerHeight: 5, orient: "auto-start-reverse" }, s("defs", {}, g));
    s("path", { d: "M0,0 L10,5 L0,10 z", class: "lab-mag-bfill" }, mk);
    const Lw = B.L * 100 * k;
    const dash = B.visina === "nad" ? "3 2" : null;
    s("line", { x1: cx - Lw / 2, y1: cy, x2: cx + Lw / 2, y2: cy, class: "lab-mag-vez lupa", "stroke-dasharray": dash }, g);
    const sm = B.smer;
    if (B.st.I) s("line", { x1: cx - sm * 10, y1: cy, x2: cx + sm * 10, y2: cy, class: "lab-mag-ipuscica", "marker-end": `url(#${svg.uid}-im)` }, g);
    const mi = s("marker", { id: `${svg.uid}-im`, viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto-start-reverse" }, s("defs", {}, g));
    s("path", { d: "M0,0 L10,5 L0,10 z", class: "lab-mag-ifill" }, mi);
    const F = B.sila, Fa = Math.abs(F);
    if (Fa > 2e-4) {
      // simbol sile leži na žici (desno od puščice toka), da ne pade na magnete
      const r = Math.min(6, 3 + Fa * 600), fx = cx + Math.max(Lw / 4, 12 + r);
      s("circle", { cx: fx, cy, r, class: "lab-mag-fkrog" }, g);
      if (F > 0) s("circle", { cx: fx, cy, r: r * 0.25, class: "lab-mag-fpika" }, g);
      else s("path", { d: `M${fx - r * 0.6},${cy - r * 0.6} L${fx + r * 0.6},${cy + r * 0.6} M${fx + r * 0.6},${cy - r * 0.6} L${fx - r * 0.6},${cy + r * 0.6}`, class: "lab-mag-fkriz" }, g);
      label(g, fx + r + 2, cy - 3.5, "F", "lab-mag-oznaka halo", "start");
    }
    label(g, x + 8, y + hh - 7, "pogled od zgoraj (povečano)", "lab-mag-oznaka", "start");
    label(g, x + w - 8, y + hh - 7, "B: od S proti J", "lab-mag-oznaka", "end");
  }

  draw();
  readouts();
  redraw();
  ticker(el, (dt) => {
    B.step(dt);
    events();
    readouts();
    draw();
  }, 100);
}

// ================================================================ 3. elektromagnetna indukcija
export function labIndukcija(el) {
  const B = new IndukcijaBench({ seed: seme() });
  B.prikljuceno = false; // učenec tuljavo priključi sam (sicer senzor kaže le brum odprtega vhoda)
  const W = 400, H = 330, S = 4.2, yMiza = 312, xt = 58; // 1 cm = 4,2 enote
  const yTop = yMiza - (CEV.L + CEV.pena) * 100 * S; // vrh cevi (cev stoji na blazinici)
  const svg = svgBox(W, H, "lab-bench lab-mag lab-mag-ind");
  const log = eventLog();
  const uL = lcd("merilnik"), p1L = lcd("vrh 1"), p2L = lcd("vrh 2");
  const table = dataTable([
    { key: "N", label: "<i>N</i>" },
    { key: "h", label: "<i>h</i> [cm]" },
    { key: "v", label: "<i>v</i> [m/s]" },
    { key: "U1", label: "<i>U</i><sub>1</sub> [V]" },
    { key: "U2", label: "<i>U</i><sub>2</sub> [V]" },
    { key: "P", label: "∫<i>U</i>d<i>t</i> [mV s]" },
  ], { empty: "Še ni meritev. Priključi tuljavo na senzor, spusti magnet skozi tuljavo in zapiši vrhova napetosti ter ploščino pod prvim vrhom." });
  const trace = svgBox(360, 190, "lab-mag-trace");
  trace.setAttribute("aria-label", "Zapis napetosti U(t) zadnjega poskusa");
  const traceCap = h("p", { class: "lab-mag-cap" });
  const gU = dataGraph({ x: [0, 3], y: [0, 2], xStep: 0.5, yStep: 0.5, xLabel: "v [m/s]", yLabel: "Uvrh [V]", title: "Največja inducirana napetost v odvisnosti od hitrosti magneta" });
  const gP = dataGraph({ x: [0, 40], y: [0, 20], xStep: 10, yStep: 5, xLabel: "h [cm]", yLabel: "∫U dt [mV s]", title: "Ploščina pod vrhom v odvisnosti od višine spusta" });
  const calc = h("div", { class: "lab-mag-calc", "aria-live": "polite" });
  const qBox = h("div");
  const meas = [];
  let graf = "Uv", asked = false, slow = false;
  const run = poganjalnik(el, (dt) => frame(dt));
  const reset = () => (run.stop(), (B.run = null), (slow = false));

  const tSel = select({ label: "tuljava", options: Object.entries(TULJAVE).map(([k, v]) => [k, `${v.N} ovojev (${num(v.R, 1)}${nb}Ω)`]), value: B.tuljava, onChange: (v) => ((B.tuljava = v), reset(), draw()) });
  const mSeg = row("merilnik", seg("merilnik", [["senzor", "senzor napetosti"], ["galvanometer", "galvanometer"]], "senzor", (v) => ((B.merilnik = v), reset(), sync(), draw())));
  const prT = toggle("vodnika priključena na tuljavo", false, (v) => ((B.prikljuceno = v), reset(), log.push(v ? "Krokodilčka sta na priključkih tuljave." : "Snel si krokodilčka s tuljave: vhod senzorja je odprt.", "info"), draw()));
  const rgSeg = row("območje", seg("območje senzorja", [["10", "±10 V"], ["1", "±1 V"]], "10", (v) => ((B.range = v), reset(), draw())));
  const fsSeg = row("vzorčenje", seg("frekvenca vzorčenja", [["100", "100 Hz"], ["1000", "1 kHz"], ["10000", "10 kHz"]], "1000", (v) => ((B.fs = +v), reset(), draw())));
  const nSeg = row("način", seg("način", [["spust", "spust skozi cev"], ["roka", "z roko (na palčki)"]], "spust", (v) => ((B.nacin = v), reset(), sync(), draw())));
  const polSeg = row("spodaj", seg("pol magneta spodaj", [["1", "severni pol"], ["-1", "južni pol"]], "1", (v) => ((B.pol = +v), reset(), log.push(+v > 0 ? "Magnet je obrnjen s severnim polom navzdol." : "Magnet si obrnil: južni pol je zdaj spodaj.", "info"), draw())));
  const cevSeg = row("cev", seg("notranji premer cevi", [["siroka", "14 mm"], ["ozka", "12 mm"]], "siroka", (v) => ((B.cev = v), reset(), draw())));
  const hSl = slider({ label: "višina spusta nad sredino tuljave", min: 10, max: 35, step: 5, value: 30, unit: "cm", onInput: (v) => ((B.h = v / 100), reset(), draw()) });
  const vSl = slider({ label: "hitrost roke", min: 0.1, max: 1, step: 0.1, value: 0.3, unit: "m/s", digits: 1, onInput: (v) => ((B.vRoka = v), reset(), draw()) });
  B.h = 0.3;
  const goBtn = button("Spusti magnet", () => go(false), "primary small");
  const slowBtn = button("Posnetek ×0,1", () => go(true));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => ((meas.length = 0), table.clear(), redraw()));
  const grSeg = seg("graf", [["Uv", "Uvrh(v)"], ["Ph", "∫U dt (h)"]], "Uv", (v) => ((graf = v), redraw()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, uL, p1L, p2L)), controlsBox(
        grp("1. Tuljava in merilnik", hint(`Tuljava je iz istega kompleta kot pri elektromagnetu. Senzor ima 12 bitov: na območju ±1${nb}V meri natančneje, a večjo napetost odreže.`), tSel, mSeg, prT, rgSeg, fsSeg),
        grp("2. Magnet", hint(`Magnet NdFeB Ø 12${nb}mm × 20${nb}mm spustiš iz roke na vrhu cevi; <i>h</i> je razdalja od magneta do sredine tuljave (tuljavo premikaš po cevi).`), nSeg, polSeg, cevSeg, hSl, vSl),
        grp("3. Merjenje", buttons(goBtn, slowBtn), buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Zapis napetosti"), h("figure", { class: "lab-mag-trace-wrap" }, trace), traceCap,
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Graf"), row("prikaži", grSeg), gU, gP, calc, qBox,
      notes(POENOSTAVITVE_MAGNETIZEM.indukcija, "Faradayev zakon <i>U</i> = −dΦ/d<i>t</i>, Φ = vsota pretokov skozi vse ovoje; prosti pad <i>v</i> = √(2<i>gh</i>), <i>g</i> = 9,806 m/s². Magnet NdFeB: Br 1,22–1,32 T za razred N38–N42 (ocena 1,25 T). Tuljava LD Didactic (250/500/1000 ovojev). Ocene: senzor napetosti (12 bitov, šum, ±1 %), galvanometer (±1 mA, 1,6 s), dimenzije navitja."),
    ],
    tryText: "Spusti magnet z višin 10, 20 in 30 cm. Zakaj je drugi vrh večji in nasprotno obrnjen? Primerjaj ploščini pod vrhoma. Kaj se zgodi, ko magnet obrneš? Poskusi vzorčenje 100 Hz in območje ±1 V.",
  });
  el.classList.add("lab");

  function sync() {
    const sp = B.nacin === "spust", se = B.merilnik === "senzor";
    cevSeg.hidden = !sp;
    hSl.hidden = !sp;
    vSl.hidden = sp;
    rgSeg.hidden = !se;
    fsSeg.hidden = !se;
    goBtn.textContent = sp ? "Spusti magnet" : "Potisni magnet v tuljavo in ga izvleci";
  }
  function go(sl) {
    if (sl && !B.run) return log.push("Najprej izvedi poskus; posnetek ga pokaže 10-krat počasneje.", "warn");
    if (!sl) {
      B.spusti();
      B.run.porocilo = false;
    } else B.run.t = 0;
    slow = sl;
    run.start(sl ? 0.1 : 1);
  }
  function porocilo() {
    const R = B.run, G = R.G;
    if (G.zataknjen) return log.push("Magnet se je v ozki cevi zataknil (notranji premer 12,0 mm, magnet s prevleko je malo debelejši): skozi tuljavo ni šel in napetosti ni.", "bad");
    if (!B.prikljuceno) return log.push("Tuljava ni priključena: senzor kaže le brum in šum odprtega vhoda (nekaj mV), ne inducirane napetosti.", "bad");
    if (R.galv) {
      const o = R.maxTh;
      return log.push(Math.abs(o) >= GALVANOMETER.kon - 1e-6 ? "Kazalec galvanometra je udaril ob omejilo: sunek toka je prevelik. Uporabi tuljavo z manj ovoji." : `Kazalec galvanometra je zanihal do ${num(Math.abs(o) * 100, 0)}${nb}% skale ${o > 0 ? "v desno" : "v levo"} in se vrnil. Hitri vrhovi napetosti so prekratki, da bi jim kazalec sledil: odklon pove naboj, ki je stekel.`, "info");
    }
    const a = B.analiza();
    if (R.clipped) log.push(`Napetost je presegla območje senzorja (±${B.range}${nb}V): vrh je odrezan. Izberi ±10${nb}V.`, "bad");
    if (B.fs <= 100) log.push("Pri 100 Hz je med vzorci 10 ms, vrh pa traja le nekaj milisekund: vzorci ga zgrešijo, zato je izmerjeni vrh nižji in oglat. Izberi 10 kHz.", "warn");
    if (a) log.push(`Vrhova: ${num(a.U1, 3)}${nb}V in ${num(a.U2, 3)}${nb}V. Ploščini pod njima: ${num(a.P1 * 1000, 2)} in ${num(a.P2 * 1000, 2)}${nb}mV${nb}s.`, "ok");
  }
  function frame(dt) {
    B.step(dt);
    readouts();
    draw();
    const R = B.run;
    if (R.t >= R.tEnd && !R.porocilo) (R.porocilo = true), slow || porocilo(), drawTrace();
    if (R.t >= R.tEnd + 0.3 * (slow ? 0.1 : 1)) {
      if (slow) (slow = false), draw();
      return false;
    }
  }
  function readouts() {
    const R = B.run;
    if (!R || R.galv) {
      uL.set(R?.galv ? num(sample(R, R.t) * 100, 0) : "0,000", R?.galv ? "%" : "V", R?.galv ? "odklon galvanometra" : `±${B.range}${nb}V · ${B.fs >= 1000 ? `${B.fs / 1000}${nb}kHz` : `${B.fs}${nb}Hz`}`);
      p1L.set("–", "V");
      p2L.set("–", "V");
      return;
    }
    const U = sample(R, R.t);
    uL.set(num(U, B.range === "1" ? 3 : 2), "V", `±${B.range}${nb}V · ${B.fs >= 1000 ? `${B.fs / 1000}${nb}kHz` : `${B.fs}${nb}Hz`}`);
    if (R.t >= R.tEnd) {
      const a = B.analiza();
      p1L.set(a ? num(a.U1, 3) : "–", "V", a ? `${num(a.P1 * 1000, 2)}${nb}mV${nb}s` : "");
      p2L.set(a ? num(a.U2, 3) : "–", "V", a ? `${num(a.P2 * 1000, 2)}${nb}mV${nb}s` : "");
    } else p1L.set("…", "V"), p2L.set("…", "V");
  }
  function sample(R, t) {
    const vz = R.vzorci;
    if (!vz.length || t < vz[0][0]) return 0;
    let lo = 0, hi = vz.length - 1;
    if (t >= vz[hi][0]) return vz[hi][1];
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (vz[m][0] <= t) lo = m;
      else hi = m;
    }
    return vz[lo][1];
  }
  function record() {
    const R = B.run;
    if (!R || R.t < R.tEnd) return log.push(R ? "Počakaj, da se zapis konča." : "Najprej izvedi poskus.", "warn");
    if (R.galv) return log.push("Galvanometer pokaže le odklon kazalca. Za tabelo vrhov in ploščin izberi senzor napetosti.", "warn");
    const a = B.analiza();
    if (!a || R.G.zataknjen || !B.prikljuceno) return log.push("Ni inducirane napetosti, ki bi jo lahko zapisal.", "warn");
    const sp = B.nacin === "spust", v = sp ? Math.sqrt(2 * G_SOLA * B.h) : B.vRoka;
    if (R.clipped) log.push("Vrh je odrezan: zapisana največja napetost je premajhna.", "warn");
    table.add({ N: String(B.coil.N), h: sp ? num(B.h * 100, 0) : "roka", v: num(v, 2), U1: num(a.U1, 3), U2: num(a.U2, 3), P: num(a.P1 * 1000, 2) });
    meas.push({ N: B.coil.N, h: sp ? B.h * 100 : null, v, U: (Math.abs(a.U1) + Math.abs(a.U2)) / 2, P: Math.abs(a.P1) * 1000, sp });
    redraw();
  }
  function redraw() {
    gU.hidden = graf !== "Uv";
    gP.hidden = graf !== "Ph";
    const g1 = skupine(meas.map((m) => ({ ...m, g: `${m.N} ovojev` })), "g", "v", "U");
    const g2 = skupine(meas.filter((m) => m.sp).map((m) => ({ ...m, g: `${m.N} ovojev` })), "g", "h", "P");
    const ax = os(Math.max(2.5, ...[...g1.values()].flat().map((p) => p[0]))), ay = os(Math.max(0.5, ...[...g1.values()].flat().map((p) => p[1])));
    gU.setAxes({ x: [0, ax.top], y: [0, ay.top], xStep: ax.step, yStep: ay.step });
    gU.draw(serije(g1));
    const by = os(Math.max(5, ...[...g2.values()].flat().map((p) => p[1])));
    gP.setAxes({ x: [0, 40], y: [0, by.top], xStep: 10, yStep: by.step });
    gP.draw([...g2.entries()].map(([name, pts], i) => {
      const m = pts.reduce((s_, p) => s_ + p[1], 0) / pts.length;
      return { id: name, pts, cls: "abc"[i % 3], shape: "o", label: name, line: pts.length >= 2 ? () => m : undefined };
    }));
    const out = [];
    for (const [name, pts] of g1) {
      if (pts.length < 2) continue;
      const k = naklonSkoziIzhodisce(pts);
      out.push(`<p><b>${name}</b>: premica skozi izhodišče, ki se točkam najbolje prilega, ima naklon <i>U</i><sub>vrh</sub> : <i>v</i> = ${num(k, 3)}${nb}V/(m/s). Ali točke ležijo na njej?</p>`);
    }
    for (const [name, pts] of g2) {
      if (pts.length < 2) continue;
      const m = pts.reduce((s_, p) => s_ + p[1], 0) / pts.length, sd = Math.sqrt(pts.reduce((s_, p) => s_ + (p[1] - m) ** 2, 0) / (pts.length - 1));
      out.push(`<p><b>${name}</b>: ploščina pod vrhom je ${num(m, 2)} ± ${num(sd, 2)}${nb}mV${nb}s, ne glede na višino: to je sprememba pretoka <i>N</i>ΔΦ = ${num(m / 1000, 4)}${nb}Wb skozi vse ovoje.</p>`);
    }
    calc.innerHTML = out.join("");
    if (!asked && meas.length >= 3) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj pokažejo zapisi napetosti, ko magnet pade skozi tuljavo?",
        options: [
          { t: "Napetost se inducira, ko se pretok skozi tuljavo spreminja; vrh je sorazmeren s hitrostjo, ploščina pod vrhom (<i>N</i>ΔΦ) pa je od hitrosti neodvisna. Vrhova sta nasprotno obrnjena (Lenzovo pravilo).", ok: true, why: "<i>U</i> = −<i>N</i> dΦ/d<i>t</i>: hitrejši magnet spremeni pretok v krajšem času, zato je napetost večja, vrh pa ožji, ploščina ostane enaka. Ko se magnet bliža, pretok raste, ko se oddaljuje, pada: napetost zamenja predznak. Drugi vrh je večji, ker je magnet takrat hitrejši." },
          { t: "Napetost je največja, ko je magnet v sredini tuljave.", ok: false, why: "V sredini je pretok največji, a se ta trenutek ne spreminja: napetost je tam nič (prehod med vrhovoma)." },
          { t: "Drugi vrh je večji, ker se magnet v tuljavi namagneti.", ok: false, why: "Magnet je trajni magnet; drugi vrh je večji, ker magnet med padanjem pospešuje in iz tuljave izstopi hitreje, kot je vstopil." },
          { t: "Če magnet obrneš, se napetost ne spremeni.", ok: false, why: "Z obrnjenim magnetom pretok raste v nasprotno smer, zato sta oba vrhova nasprotno obrnjena. Smer inducirane napetosti je taka, da tok nasprotuje spremembi pretoka (Lenz)." },
        ],
      }));
    }
  }
  // Velik zapis U(t) pod risbo: os časa okoli prehoda magneta, ploščini vrhov pobarvani.
  function drawTrace() {
    trace.replaceChildren();
    const R = B.run;
    if (!R || R.galv) {
      traceCap.textContent = R?.galv ? "Pri galvanometru ni zapisa: opazuj kazalec v risbi." : "Ko izvedeš poskus, se tu pokaže zapis napetosti.";
      return;
    }
    const vz = R.vzorci, a = B.analiza();
    let t0 = 0, t1 = R.tEnd;
    if (a && B.nacin === "spust" && !R.G.zataknjen && B.prikljuceno) {
      const dt = Math.max(0.03, (a.t2 - a.t1) * 2.2);
      t0 = Math.max(0, (a.t1 + a.t2) / 2 - dt);
      t1 = Math.min(R.tEnd, (a.t1 + a.t2) / 2 + dt);
    }
    const vis = vz.filter((p) => p[0] >= t0 && p[0] <= t1);
    const ym = os(Math.max(0.01, ...vis.map((p) => Math.abs(p[1]))));
    const A = axes(trace, { W: 360, H: 190, x: [t0 * 1000, t1 * 1000], y: [-ym.top, ym.top], pad: 40, padT: 10, padR: 10, xLabel: "t [ms]", yLabel: "U [V]", xStep: os((t1 - t0) * 1000).step, yStep: ym.step, origin: false });
    if (a) {
      const ic = vis.findIndex((p) => p[0] >= (a.t1 + a.t2) / 2);
      const area = (pts, cls) => pts.length > 1 && s("path", { d: `M${A.X(pts[0][0] * 1000)},${A.Y(0)} ${pts.map((p) => `L${A.X(p[0] * 1000).toFixed(1)},${A.Y(p[1]).toFixed(1)}`).join(" ")} L${A.X(pts[pts.length - 1][0] * 1000)},${A.Y(0)} Z`, class: `lab-mag-ploscina ${cls}` }, trace);
      if (ic > 0) area(vis.slice(0, ic + 1), "a"), area(vis.slice(ic), "b");
    }
    s("polyline", { points: vis.map((p) => `${A.X(p[0] * 1000).toFixed(1)},${A.Y(p[1]).toFixed(1)}`).join(" "), class: "lab-mag-sled" }, trace);
    if (B.fs <= 1000) for (const p of vis) s("circle", { cx: A.X(p[0] * 1000).toFixed(1), cy: A.Y(p[1]).toFixed(1), r: 1.4, class: "lab-mag-vzorec" }, trace);
    traceCap.innerHTML = a && B.prikljuceno && !R.G.zataknjen ? `Pobarvani ploščini sta ∫<i>U</i>d<i>t</i> pod vrhovoma: ${num(a.P1 * 1000, 2)} in ${num(a.P2 * 1000, 2)}${nb}mV${nb}s.${R.clipped ? " Vrh je odrezan (območje senzorja)." : ""}` : "Ni inducirane napetosti.";
  }

  function draw() {
    svg.replaceChildren();
    gradienti(svg);
    const sp = B.nacin === "spust", R = B.run, lg = B.lega();
    s("rect", { x: 0, y: yMiza, width: W, height: H - yMiza, fill: u(svg, "miza"), class: "lab-mag-mizarob" }, svg);
    stojalo(svg, svg, 22, 10, yMiza, 76);
    // lega tuljave: pri spustu je sredina tuljave h pod magnetom na vrhu cevi, z roko je tuljava na stojalu
    const zRel = sp ? B.h : 0.2;
    const yRel = yTop + CEV.vrh * 100 * S; // središče magneta ob spustu (1,5 cm pod vrhom cevi)
    const yc = sp ? yRel + zRel * 100 * S : yMiza - 26 * S;
    const Ym = (z) => yc - z * 100 * S;
    let ravnilo = null;
    if (sp) {
      // blazinica in cev
      s("rect", { x: xt - 12, y: yMiza - CEV.pena * 100 * S, width: 24, height: CEV.pena * 100 * S, rx: 1.5, class: "lab-mag-pena" }, svg);
      const ri = (B.cev === "ozka" ? CEV.ozka : CEV.notranji) * 100 * S / 2, ro = ri + 0.2 * S;
      prijemalo(svg, svg, 22, yTop + 30, xt - ro - 1, 3);
      prijemalo(svg, svg, 22, yMiza - 40, xt - ro - 1, 3);
      // magnet za steklom
      magnet(svg, xt, Ym(lg.z));
      s("rect", { x: xt - ro, y: yTop, width: 2 * ro, height: yMiza - CEV.pena * 100 * S - yTop, fill: u(svg, "steklo"), class: "lab-mag-cev" }, svg);
      s("rect", { x: xt - ro * 0.6, y: yTop + 2, width: 1.2, height: yMiza - 10 - yTop, class: "lab-mag-cev-hl" }, svg);
      // ravnilo levo od cevi: 0 pri središču magneta ob spustu; stoji pred rokami prijemal, da se številke vidijo
      const rx = xt - ro - 21;
      ravnilo = () => {
        s("rect", { x: rx, y: yRel - 2, width: 7, height: 37 * S + 4, rx: 0.8, class: "lab-mag-ravnilo" }, svg);
        for (let c = 0; c <= 37; c++) {
          const y = yRel + c * S, big = c % 5 === 0;
          s("line", { x1: rx, y1: y, x2: rx + (big ? 4 : 2), y2: y, class: "lab-mag-ravnilo-crt" }, svg);
          if (big) label(svg, rx + 5.4, y, String(c), "lab-mag-ravnilo-st");
        }
        label(svg, rx - 2, yRel + 37 * S + 8, "cm", "lab-mag-oznaka", "start");
      };
      // roka na vrhu cevi
      if (!R || R.G.zataknjen || (R && R.t < 0.02)) prsti(svg, svg, xt, yRel - 2, false);
      else prsti(svg, svg, xt, yTop - 4, true);
    } else {
      // z roko: magnet na leseni palčki, roka nad njim
      const ym = Ym(lg.z);
      s("rect", { x: xt - 0.8, y: ym - 4 - 34 * S, width: 1.6, height: 34 * S, fill: u(svg, "les"), class: "lab-mag-palcka" }, svg);
      magnet(svg, xt, ym);
      s("ellipse", { cx: xt + 1, cy: ym - 4 - 34 * S + 3, rx: 7, ry: 5, fill: u(svg, "koza"), class: "lab-mag-dlan" }, svg);
    }
    // tuljava na cevi (spredaj), pritrjena s prijemalom
    const Tu = tuljava(svg, svg, xt, yc, S, { N: B.coil.N });
    prijemalo(svg, svg, 22, yc, xt - Tu.fw - 1, 3);
    ravnilo?.();
    // merilnik: zbiralnik podatkov in prenosnik, ali galvanometer
    const se = B.merilnik === "senzor";
    let vhod;
    if (se) {
      const lx = 112, ly = yMiza - 30;
      s("rect", { x: lx, y: ly, width: 82, height: 28, rx: 4, fill: u(svg, "ohisje"), stroke: "#15181b", "stroke-width": 0.8 }, svg);
      // vtičnici zgoraj (kabla prideta od zgoraj), napis spodaj, da ga kabla ne prekrijeta
      label(svg, lx + 5, ly + 22, "ZBIRALNIK PODATKOV", "lab-mag-panel-sv small", "start");
      pusica(svg, lx + 14, ly + 9, "r", 2.2);
      pusica(svg, lx + 28, ly + 9, "k", 2.2);
      s("circle", { cx: lx + 72, cy: ly + 9, r: 2.2, fill: "#3bd16f" }, svg);
      label(svg, lx + 38, ly + 10, "U", "lab-mag-panel-sv small", "start");
      vhod = [[lx + 14, ly + 9], [lx + 28, ly + 9]];
      s("path", { d: `M${lx + 82},${ly + 14} C${lx + 88},${ly + 14} ${lx + 86},${yMiza - 4} 196,${yMiza - 4}`, class: "lab-mag-kabel" }, svg);
      prenosnik(svg, 200, yMiza - 150, 188, 150);
    } else {
      vhod = galvanometer(svg, 108, yMiza - 70);
      prenosnik(svg, 200, yMiza - 150, 188, 150, true);
    }
    // vodnika od tuljave do merilnika
    const tA = Tu.t1, tB = Tu.t2;
    const pr = B.prikljuceno;
    // krokodilčka s čeljustma na pušicah tuljave (ali snet in odložen na mizo), kabla iz ročajev do vhoda
    const c1 = pr ? [tA[0] + 6, tA[1], 0] : [tA[0] + 22, yMiza - 3, 10], c2 = pr ? [tB[0] + 6, tB[1], 0] : [tB[0] + 34, yMiza - 2, -8];
    const r1 = rep(...c1), r2 = rep(...c2);
    zica(svg, `M${vhod[0][0]},${vhod[0][1]} C${vhod[0][0]},${vhod[0][1] - 30} ${r1[0] + 34},${r1[1]} ${r1[0]},${r1[1]}`, "r");
    zica(svg, `M${vhod[1][0]},${vhod[1][1]} C${vhod[1][0]},${vhod[1][1] - 20} ${r2[0] + 34},${r2[1] + 10} ${r2[0]},${r2[1]}`, "k");
    krokodil(svg, c1[0], c1[1], "r", c1[2]);
    krokodil(svg, c2[0], c2[1], "k", c2[2]);
    merilo(svg, 120, H - 5, 10 * S, "10 cm");
    if (slow) label(svg, 300, 182, "POSNETEK ×0,1", "lab-mag-slow");
    svg.setAttribute("aria-label", `Indukcija: tuljava s ${B.coil.N} ovoji, ${sp ? `magnet pade z višine ${num(B.h * 100, 0)} cm nad sredino tuljave` : `magnet na palčki, hitrost ${num(B.vRoka, 1)} m/s`}, ${B.pol > 0 ? "severni" : "južni"} pol spodaj, ${se ? `senzor ±${B.range} V, ${B.fs} Hz` : "galvanometer"}.`);
  }
  // Magnet NdFeB: ponikljan valj, severni pol označen z rdečo barvo.
  function magnet(g, x, y) {
    const w = MAGNET_IND.D * 100 * S, hh = MAGNET_IND.L * 100 * S, top = y - hh / 2;
    s("rect", { x: x - w / 2, y: top, width: w, height: hh, rx: 0.8, fill: u(svg, "nikelj"), class: "lab-mag-magnet" }, g);
    const nTop = B.pol < 0; // pol = +1: severni spodaj
    s("rect", { x: x - w / 2, y: nTop ? top : top + hh - 2.2, width: w, height: 2.2, fill: "#d33a2c", class: "lab-mag-npol" }, g);
  }
  // Prenosnik z zapisom senzorja (kot v programu zbiralnika): mreža, sled napetosti do trenutnega časa.
  function prenosnik(g, x, y, w, hh, galv = false) {
    s("rect", { x, y, width: w, height: hh - 12, rx: 5, fill: "#2b3036", stroke: "#15181b", "stroke-width": 1 }, g);
    s("path", { d: `M${x - 8},${y + hh} L${x + 2},${y + hh - 12} H${x + w - 2} L${x + w + 8},${y + hh} Z`, fill: "#9aa2ab", stroke: "#6d757d", "stroke-width": 0.8 }, g);
    const sx = x + 6, sy = y + 6, sw = w - 12, sh = hh - 24;
    s("rect", { x: sx, y: sy, width: sw, height: sh, fill: u(svg, "zaslon") }, g);
    for (let i = 1; i < 8; i++) s("line", { x1: sx + (i * sw) / 8, y1: sy, x2: sx + (i * sw) / 8, y2: sy + sh, class: "lab-mag-mreza" }, g);
    for (let i = 1; i < 6; i++) s("line", { x1: sx, y1: sy + (i * sh) / 6, x2: sx + sw, y2: sy + (i * sh) / 6, class: "lab-mag-mreza" + (i === 3 ? " nic" : "") }, g);
    if (galv) return label(g, sx + sw / 2, sy + sh / 2, "galvanometer: ni zapisa", "lab-mag-zaslon-txt");
    const R = B.run;
    const rng_ = SENZOR.ranges[B.range];
    label(g, sx + 3, sy + 6, `U [V], ±${B.range}`, "lab-mag-zaslon-txt", "start");
    label(g, sx + sw - 3, sy + sh - 5, B.fs >= 1000 ? `${B.fs / 1000} kHz` : `${B.fs} Hz`, "lab-mag-zaslon-txt", "end");
    if (!R) return;
    // okno časa: pri spustu okoli prehoda magneta skozi tuljavo, z roko ves zapis
    let t0 = 0, t1 = R.tEnd;
    if (B.nacin === "spust" && !R.G.zataknjen) {
      const tc = Math.sqrt((2 * B.h) / 9.806);
      t0 = Math.max(0, tc - 0.06);
      t1 = tc + 0.06;
    }
    const X = (t) => sx + ((t - t0) / (t1 - t0)) * sw, Yv = (v) => sy + sh / 2 - (v / rng_) * (sh / 2) * 0.95;
    const pts = R.vzorci.filter((p) => p[0] >= t0 && p[0] <= Math.min(t1, R.t)).map((p) => `${X(p[0]).toFixed(1)},${Yv(p[1]).toFixed(1)}`);
    if (pts.length > 1) s("polyline", { points: pts.join(" "), class: "lab-mag-zaslon-sled" }, g);
    label(g, sx + 3, sy + sh - 5, `${num((t1 - t0) * 1000 / 8, 0)} ms/razdelek`, "lab-mag-zaslon-txt", "start");
  }
  // Demonstracijski galvanometer z ničlo na sredini. Vrne lego sponk.
  function galvanometer(g, x, y) {
    const w = 78, hh = 64;
    s("rect", { x, y, width: w, height: hh, rx: 4, fill: u(svg, "ohisje"), stroke: "#15181b" }, g);
    s("rect", { x: x + 5, y: y + 5, width: w - 10, height: 36, rx: 2, fill: "#f4f1e6" }, g);
    const cx = x + w / 2, cy = y + 40, r = 30;
    for (let i = -5; i <= 5; i++) {
      const a = (i * 9 * Math.PI) / 180, L = i % 5 === 0 ? 6 : 3.5;
      s("line", { x1: cx + Math.sin(a) * r, y1: cy - Math.cos(a) * r, x2: cx + Math.sin(a) * (r - L), y2: cy - Math.cos(a) * (r - L), stroke: "#222", "stroke-width": 0.6 }, g);
    }
    label(g, cx, y + 30, "0", "lab-mag-galv-st");
    label(g, cx - 24, y + 22, "−", "lab-mag-galv-st");
    label(g, cx + 24, y + 22, "+", "lab-mag-galv-st");
    const R = B.run, th = R?.galv ? sample(R, R.t) : 0, a = (th * 45 * Math.PI) / 180;
    s("line", { x1: cx, y1: cy, x2: cx + Math.sin(a) * (r - 2), y2: cy - Math.cos(a) * (r - 2), stroke: "#c62828", "stroke-width": 1.2 }, g);
    label(g, cx, y + hh - 14, "galvanometer ±1 mA", "lab-mag-panel-sv small");
    pusica(g, x + 14, y + hh - 6, "r", 2.2);
    pusica(g, x + w - 14, y + hh - 6, "k", 2.2);
    return [[x + 14, y + hh - 6], [x + w - 14, y + hh - 6]];
  }

  sync();
  draw();
  readouts();
  redraw();
  drawTrace();
}
