// Virtualni laboratorij, gibanje: pospešeno gibanje po klancu (lab-klanec), prosti pad s svetlobnimi vrati (lab-prosti-pad),
// drugi Newtonov zakon z vozičkom in škripcem (lab-newton2). Modeli: lab-model-gibanje.js (brez DOM). CSS: predpona lab-gib-.
// Risbe so v stalnem merilu (merilna črta), oprema v pravih razmerjih; gibanje teče v realnem času (posnetek ×0,1 je označen).
// Gibljivi deli (voziček, obešalo, krogla) so skupine, ki jim v vsaki sličici spremenimo le transform; ostala risba se
// nariše znova samo, ko se spremeni postavitev.
import { h, s, svgBox, select, segmented, button, toggle, slider, layout, label, stage as stageBox, controls as controlsBox } from "./kit.js";
import { lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed, tex, en, rez } from "./lab.js";
import {
  ProgaBench, PadBench, PROGA, VOZICEK, SKRIPEC, PREDMETI, PAD, G_SOLA, naklonSkoziIzhodisce, premica, koncnaHitrost, zastira, POENOSTAVITVE_GIBANJE,
} from "./lab-model-gibanje.js";

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
const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const lcdName = (L, t) => (L.querySelector(".lab-lcd-name").textContent = t, L.setAttribute("aria-label", t));
const setTxt = (el, t) => el && el.textContent !== t && (el.textContent = t);

// Gibanje v realnem času: requestAnimationFrame, pri »manj gibanja« pa 10 sličic na sekundo (čas teče enako hitro).
// onFrame(dt) vrne false, ko je konec. Ustavi se, ko simulacije ni več na strani.
function poganjalnik(el, onFrame) {
  let on = false, last = 0, speed = 1, gen = 0;
  const mine = (el._gibRun = (el._gibRun || 0) + 1); // »Ponastavi« zgradi poskus znova v istem elementu: stari poganjalnik se ustavi
  const tick = (g) => {
    if (!on || g !== gen || el._gibRun !== mine) return;
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

// Lepe meje osi: najmanjša »okrogla« zgornja meja nad max in korak (1, 2, 2,5 ali 5 · 10ⁿ), največ 6 razdelkov.
function os(max) {
  const m = Math.max(max, 1e-6) * 1.08;
  const e = 10 ** Math.floor(Math.log10(m / 5));
  for (const k of [1, 2, 2.5, 5, 10, 20]) {
    const st = k * e;
    if (m / st <= 6) return { top: Math.ceil(m / st) * st, step: st };
  }
  return { top: m, step: m / 5 };
}
function serije(groups, { origin = true } = {}) {
  return [...groups.entries()].map(([name, pts], i) => {
    let line;
    if (pts.length >= 2) {
      if (origin) {
        const k = naklonSkoziIzhodisce(pts);
        line = (x) => k * x;
      } else {
        const L = premica(pts);
        if (Number.isFinite(L.a)) line = (x) => L.a * x + L.b;
      }
    }
    return { id: name, pts, cls: "abc"[i % 3], shape: i % 6 < 3 ? "o" : "^", label: name, line };
  });
}
const skupine = (list, key, xk, yk) => {
  const m = new Map();
  for (const r of list) (m.get(r[key]) || m.set(r[key], []).get(r[key])).push([r[xk], r[yk]]);
  return m;
};

// ---------------------------------------------------------------- skupni deli risbe
const u = (svg, id) => `url(#${svg.uid}-${id})`;
function gradienti(svg) {
  const d = s("defs", {}, svg);
  const lin = (id, stops, { x2 = 0, y2 = 1 } = {}) => {
    const g = s("linearGradient", { id: `${svg.uid}-${id}`, x1: 0, y1: 0, x2, y2 }, d);
    for (const [o, c, a = 1] of stops) s("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g);
  };
  lin("alu", [[0, "#f3f5f7"], [0.35, "#c9cfd5"], [0.6, "#e4e8ec"], [1, "#8d959d"]]); // brušen aluminij
  lin("voz", [[0, "#3f7fd0"], [1, "#1f4f8f"]]); // modra plastika vozička
  lin("crno", [[0, "#4a5058"], [1, "#22262b"]]);
  lin("les", [[0, "#d9b27a"], [1, "#b88a50"]]);
  lin("miza", [[0, "#d4d8dc"], [1, "#a9b0b7"]]);
  lin("med", [[0, "#e6c56a"], [0.5, "#f7e3a1"], [1, "#a8822e"]], { x2: 1, y2: 0 }); // medeninaste utežice
  lin("jeklo", [[0, "#6e767e"], [0.5, "#e8ebee"], [1, "#59616a"]], { x2: 1, y2: 0 });
  const r = s("radialGradient", { id: `${svg.uid}-krogla`, cx: 0.5, cy: 0.5, r: 0.5, fx: 0.35, fy: 0.3 }, d);
  for (const [o, c] of [[0, "#ffffff"], [0.35, "#c4cad0"], [1, "#4b525a"]]) s("stop", { offset: o, "stop-color": c }, r);
  const p = s("radialGradient", { id: `${svg.uid}-pp`, cx: 0.5, cy: 0.5, r: 0.5, fx: 0.38, fy: 0.32 }, d);
  for (const [o, c] of [[0, "#ffffff"], [0.6, "#f4f1ea"], [1, "#c9c3b5"]]) s("stop", { offset: o, "stop-color": c }, p);
  return d;
}
function merilo(g, x, y, px, text) {
  s("path", { d: `M${x},${y - 4} V${y} H${x + px} V${y - 4}`, class: "lab-scale lab-gib-merilo" }, g);
  label(g, x + px / 2, y + 8, text, "tick small");
}
// Časovnik: ohišje z zaslonom LCD (vrstice besedila) in vtičnicami. Vrne elemente vrstic za sprotno posodabljanje.
function casovnikNaprava(g, svg, x, y, w, n, napis = "ČASOVNIK") {
  const hh = 18 + n * 11;
  s("rect", { x, y, width: w, height: hh, rx: 4, fill: u(svg, "crno"), class: "lab-gib-ohisje" }, g);
  label(g, x + 6, y + 6, napis, "lab-gib-panel", "start");
  for (let i = 0; i < 4; i++) s("circle", { cx: x + w - 30 + i * 7, cy: y + 6, r: 2.2, class: "lab-gib-jack" }, g);
  s("rect", { x: x + 5, y: y + 12, width: w - 10, height: n * 11 + 2, rx: 2, class: "lab-gib-lcdbg" }, g);
  return Array.from({ length: n }, (_, i) => s("text", { x: x + w - 9, y: y + 21 + i * 11, class: "lab-gib-lcdtxt", "text-anchor": "end" }, g, ""));
}
const fmtT = (t) => (t == null ? "– – – –" : num(t, 4));
const fmtMs = (t) => (t == null ? "– – –" : num(t * 1000, 1));
const kaj = { proga: "žarek zadene profil proge", telo: "žarek zastre telo vozička", zastavica: "žarek seka zastavico", nic: "žarek je nad zastavico" };

// ---------------------------------------------------------------- proga z vozičkom (klanec in Newtonov zakon)
// Risba v lokalnih koordinatah proge (x vzdolž proge, y navzgor = −), zasukana okoli desne noge. Vrne gibljive dele.
function risiProgo(svg, B, { P, X0, yMiza, newton = false }) {
  const g = s("g", {}, svg);
  const th = Math.asin(B.sinTheta - Math.sin(B.beta)) * (180 / Math.PI); // risba brez nagiba mize (manj kot 0,4°)
  const xp = X0 + 1.1 * P;
  const T = s("g", { transform: `translate(${xp.toFixed(1)},${yMiza}) rotate(${th.toFixed(3)})` }, g);
  const L = (uu) => (uu - 1.1) * P; // lokalni x
  const noga = 0.02 * P, prof = 0.015 * P, top = -noga - prof;
  // nogi z vijakom za izravnavo
  for (const uu of [0.1, 1.1]) s("rect", { x: L(uu) - 0.012 * P, y: -noga, width: 0.024 * P, height: noga, rx: 1, class: "lab-gib-noga" }, T);
  // proga: aluminijast profil z žlebom in merilom (cm)
  s("rect", { x: L(0), y: top, width: PROGA.L * P, height: prof, rx: 1, fill: u(svg, "alu"), class: "lab-gib-alu" }, T);
  s("line", { x1: L(0), y1: top + prof * 0.45, x2: L(PROGA.L), y2: top + prof * 0.45, class: "lab-gib-zleb" }, T);
  const kor = P >= 250 ? 0.05 : 0.1;
  for (let c = 0; c <= 120; c += 1) {
    const big = c % 10 === 0, mid = c % 5 === 0;
    if (!mid && P < 250) continue;
    s("line", { x1: L(c / 100), y1: top + prof, x2: L(c / 100), y2: top + prof - (big ? prof * 0.7 : mid ? prof * 0.5 : prof * 0.3), class: "lab-gib-crtica" }, T);
    // številke pod merilom, razen ob nogah (10 in 110 cm), kjer bi jih noga prekrila
    if (big && c % (kor * 200) === 0 && c > 10 && c < 110) label(T, L(c / 100), top + prof + 5.5, String(c), "lab-gib-cm");
  }
  // držalni elektromagnet na levem koncu in odbijač na desnem
  s("rect", { x: L(0.012), y: top - 0.03 * P, width: 0.025 * P, height: 0.03 * P, rx: 1.5, fill: u(svg, "crno") }, T);
  s("rect", { x: L(0.012) + 0.025 * P - 1.6, y: top - 0.022 * P, width: 1.6, height: 0.014 * P, class: "lab-gib-pol" }, T);
  s("rect", { x: L(PROGA.uMax + VOZICEK.spredaj + 0.004), y: top - 0.035 * P, width: 0.018 * P, height: 0.035 * P, rx: 1.5, fill: u(svg, "crno") }, T);
  s("path", { d: `M${L(PROGA.uMax + VOZICEK.spredaj)},${top - 0.02 * P} h${0.004 * P}`, class: "lab-gib-vzmet" }, T);
  // vrata: nosilec za progo, roka čez progo z LED, oddajnik na višini žarka
  const vr = B.vrata.map((v, i) => {
    const x = L(v.x), hv = 0.11 * P, w = Math.max(3, 0.018 * P);
    const zad = s("g", {}, T);
    s("rect", { x: x - w / 2, y: top - hv, width: w, height: hv, rx: 1, fill: u(svg, "crno"), class: "lab-gib-vrata" }, zad);
    s("rect", { x: x - w / 2 - 2, y: top - 2, width: w + 4, height: 4, rx: 1, class: "lab-gib-objemka" }, zad);
    s("circle", { cx: x, cy: top - B.zarek * P, r: Math.max(1.3, 0.004 * P), class: "lab-gib-oddajnik" }, zad);
    label(zad, x, top - hv - 9, String(i + 1), "lab-gib-st");
    return { x, zad, hv, w };
  });
  // voziček (gibljiv): lokalni x = 0 pri sprednjem robu zastavice
  const cart = s("g", { class: "lab-gib-voz" }, T);
  const r = 0.0125 * P, yb = top - VOZICEK.telo[0] * P, hb = (VOZICEK.telo[1] - VOZICEK.telo[0]) * P;
  s("rect", { x: -VOZICEK.zadaj * P, y: yb - hb, width: (VOZICEK.zadaj + VOZICEK.spredaj) * P, height: hb, rx: Math.min(3, hb / 3), fill: u(svg, "voz"), class: "lab-gib-telo" }, cart);
  s("rect", { x: -VOZICEK.zadaj * P + 1, y: yb - hb + 1, width: (VOZICEK.zadaj + VOZICEK.spredaj) * P - 2, height: Math.max(1, hb * 0.18), rx: 1, class: "lab-gib-odsev" }, cart);
  for (const xx of [-0.085, 0.035]) {
    s("circle", { cx: xx * P, cy: top - r, r, class: "lab-gib-kolo" }, cart);
    s("circle", { cx: xx * P, cy: top - r, r: r * 0.38, class: "lab-gib-os" }, cart);
  }
  // dodatne palice (250 g) ali utežice na vozičku
  let yt = yb - hb;
  for (let i = 0; i < B.nPalic; i++) {
    const ph = 0.012 * P;
    s("rect", { x: -0.095 * P, y: yt - ph, width: 0.13 * P, height: ph, rx: 1, fill: u(svg, "jeklo"), class: "lab-gib-palica" }, cart);
    yt -= ph;
  }
  if (newton) for (let i = 0; i < B.naVoz; i++) s("rect", { x: -0.075 * P + (i % 3) * 0.028 * P, y: yt - (Math.floor(i / 3) + 1) * 0.008 * P, width: 0.024 * P, height: 0.007 * P, rx: 0.8, fill: u(svg, "med"), class: "lab-gib-utez" }, cart);
  // zastavica na drogu
  s("rect", { x: -VOZICEK.zastavica * P, y: top - VOZICEK.zast[1] * P, width: VOZICEK.zastavica * P, height: (VOZICEK.zast[1] - VOZICEK.zast[0]) * P, class: "lab-gib-zast" }, cart);
  s("line", { x1: -VOZICEK.zastavica * P * 0.5, y1: top - VOZICEK.zast[0] * P, x2: -VOZICEK.zastavica * P * 0.5, y2: yb - hb, class: "lab-gib-drog" }, cart);
  if (newton) s("circle", { cx: VOZICEK.spredaj * P, cy: top - 0.03 * P, r: 1.2, class: "lab-gib-kavelj" }, cart);
  // sprednja roka vrat (prosojna, da se vidi zastavica) in LED
  const leds = vr.map((v) => {
    s("rect", { x: v.x - v.w / 2, y: top - v.hv, width: v.w, height: v.hv * 0.5, rx: 1, class: "lab-gib-vrata-spr" }, T);
    return s("circle", { cx: v.x, cy: top - v.hv + 2.6, r: 2.1, class: "lab-gib-led" }, T);
  });
  return { g, T, cart, leds, L, top, th, xp, P };
}

// LED in časovnik v risbi, HTML-merilnika in voziček ob času poteka.
function posodobiProgo(B, R, L1, L2, lcdTxt) {
  const lg = B.lega();
  R.cart.setAttribute("transform", `translate(${R.L(lg.u).toFixed(2)},0)`);
  R.leds.forEach((l, i) => l.classList.toggle("on", B.zastrt(i)));
  const c = B.casovnik(), sp = (B.run?.nacin ?? B.nacin) !== "vrata";
  const t1 = num(c.t1, 4), t2 = num(c.t2, 4), d1 = num(c.dt1 * 1000, 1), d2 = num(c.dt2 * 1000, 1);
  if (sp) {
    L1.set(t1, "s", `Δt₁ = ${d1}${nb}ms`);
    L2.set(t2, "s", `Δt₂ = ${d2}${nb}ms`);
  } else {
    L1.set(t1, "s", `Δt₁ = ${d1}${nb}ms`);
    L2.set(d2, "ms", "");
  }
  const rows = sp ? [`1  ${t1} s`, `2  ${t2} s`, `Δ1 ${d1} ms`, `Δ2 ${d2} ms`] : [`1→2 ${t1} s`, "", `Δ1 ${d1} ms`, `Δ2 ${d2} ms`];
  lcdTxt.forEach((e, i) => setTxt(e, rows[i]));
  return lg;
}
function imenaKanalov(B, L1, L2) {
  if (B.nacin === "vrata") lcdName(L1, "t₁₂ (vrata 1 → 2)"), lcdName(L2, "Δt₂ (zatemnitev 2)");
  else lcdName(L1, "t₁ (spust → vrata 1)"), lcdName(L2, "t₂ (spust → vrata 2)");
}
// Dogodki ob koncu poteka: kaj je šlo narobe (ali prav).
function porociloPoteka(B, log, { newton = false, konec = false } = {}) {
  const R = B.run, m = B.meritev(), z = R.z;
  if (konec) {
    if (R.udarec) log.push(`Voziček je z ${num(R.udarec.v, 2)}${nb}m/s zadel odbijač${newton ? " in obstal ob njem" : " in se odbil"}.`, "info");
    return;
  }
  if (z.kaj === "nic") log.push("Žarek je nad zastavico: vrata vozička sploh niso zaznala. Spusti nosilca vrat (višina žarka).", "bad");
  else if (z.kaj === "proga") log.push("Žarek zadene profil proge: vrata so ves čas zatemnjena (LED sveti) in časovnik ne dobi signala. Dvigni vrata.", "bad");
  else if (z.kaj === "telo") log.push(`Žarek zastre telo vozička namesto zastavice: zatemnitev traja, dokler ne pelje mimo ves voziček (17 cm), zato ${tex(String.raw`v = \frac{d}{\Delta t}`)} ni prava hitrost. Dvigni vrata do zastavice.`, "bad");
  if (R.nacin === "vrata" && m.dt1 != null && m.dt2 != null && m.t12 == null) log.push("Časovnik še teče: voziček je šel skozi vrata 2, preden so ga vrata 1 sprožila. Pri načinu »vrata 1 → 2« morajo biti vrata 1 bližje začetku.", "bad");
  if (R.nacin === "spust" && B.spust !== "magnet") log.push(B.spust === "potisk" ? "Voziček si sunil: ni začel iz mirovanja, zato pot ni sorazmerna s <i>t</i>²." : "Spustil si ga z roko in hkrati pritisnil tipko časovnika: začetek meritve je zamaknjen za nekaj stotink sekunde.", "warn");
  if (R.tla && R.tla.u < B.vrata[1].x + VOZICEK.zastavica + 0.01) log.push(`Obešalo je pristalo na tleh, ko je bil voziček pri ${num(R.tla.u * 100, 0)}${nb}cm; od tam vrvica ne vleče več, zato hitrost na vratih 2 ni več taka, kot bi bila ob stalni sili.`, "warn");
  if (!R.udarec && B.lega(Infinity).u < PROGA.u0 + 0.01) log.push(B.kvadri === 0 && !newton ? "Voziček se ni premaknil: na vodoravni progi ga nič ne pospešuje." : newton && !B.vrvica ? "Voziček se ni premaknil: brez vrvice ga nič ne vleče. Za preizkus trenja izberi spust »s potiskom«." : "Voziček se ni premaknil.", "info");
  else if (!newton && B.kvadri === 0 && !B.izravnana) log.push("Proga je brez kvadrov, a voziček se je sam odpeljal: miza ni vodoravna. Izravnaj progo z libelo.", "warn");
}

// ================================================================ klanec
export function labKlanec(el) {
  const B = new ProgaBench({ seed: seme() });
  B.kvadri = 2;
  const W = 400, H = 172, P = 300, X0 = 10, yMiza = 162;
  const svg = svgBox(W, H, "lab-bench lab-gib lab-gib-klanec");
  const log = eventLog();
  const L1 = lcd("t₁"), L2 = lcd("t₂");
  const table = dataTable([
    { key: "niz", label: "postavitev" },
    { key: "s", label: "<i>s</i> [m]" },
    { key: "t", label: "<i>t</i> [s]" },
    { key: "dt", label: "Δ<i>t</i> [ms]" },
    { key: "v", label: "<i>v</i> [m/s]" },
  ], { empty: "Še ni meritev. Spusti voziček, nato pritisni »Zapiši meritev«: zapišeta se obe vrati." });
  const gS = dataGraph({ x: [0, 4], y: [0, 1], xStep: 1, yStep: 0.2, xLabel: "t² [s²]", yLabel: "s [m]", title: "Pot v odvisnosti od kvadrata časa" });
  const gV = dataGraph({ x: [0, 3], y: [0, 1], xStep: 0.5, yStep: 0.2, xLabel: "t [s]", yLabel: "v [m/s]", title: "Hitrost v odvisnosti od časa" });
  const calc = h("div", { class: "lab-gib-calc", "aria-live": "polite" });
  const vHint = hint(`Hitrost ${tex(String.raw`v = \frac{d}{\Delta t}`)} je povprečna hitrost, medtem ko zastavica zastira žarek. Tako hitrost ima voziček sredi zatemnitve, zato je točka narisana ob času ${tex(String.raw`t + \frac{\Delta t}{2}`)}.`);
  const qBox = h("div");
  const meas = [];
  let graf = "st2", asked = false, slow = false;
  const run = poganjalnik(el, (dt) => frame(dt));

  const reset = () => (run.stop(), (B.run = null), (slow = false));
  const kvSeg = seg("kvadri pod levo nogo", [0, 1, 2, 3, 4, 5].map((n) => [String(n), String(n)]), "2", (v) => ((B.kvadri = +v), reset(), draw(), log.push(`Pod levo nogo ${["ni kvadrov", "je 1 kvader", "sta 2 kvadra", "so 3 kvadri", "so 4 kvadri", "je 5 kvadrov"][+v]}: ${tex(String.raw`h = ${2 * v}${en("cm")}`)}, ${tex(String.raw`\sin\theta = \frac{h}{100${en("cm")}} = ${num(0.02 * v, 2)}`)}.`, "info")));
  const levBtn = button("Izravnaj progo z libelo", () => {
    const kv = B.kvadri;
    B.izravnaj();
    reset();
    log.push(`Kvadre si odstranil, z libelo in vijakoma na nogah progo izravnal in kvadre ${kv ? "vrnil" : "pustil zunaj"}. Zdaj je nagib mize manjši od 0,3${nb}mm na meter.`, "ok");
    draw();
  });
  const mSeg = seg("masa vozička", [["0", "250 g"], ["1", "500 g"], ["2", "750 g"]], "0", (v) => ((B.nPalic = +v), reset(), draw()));
  const vrSl = [0, 1].map((i) => slider({ label: `vrata ${i + 1} pri`, min: 20, max: 110, step: 1, value: [40, 80][i], unit: "cm", onInput: (v) => (B.postaviVrata(i, v / 100), reset(), draw()) }));
  B.postaviVrata(0, 0.4), B.postaviVrata(1, 0.8);
  const zSl = slider({ label: "višina žarka nad progo", min: 5, max: 110, step: 5, value: 70, unit: "mm", onInput: (v) => ((B.zarek = v / 1000), reset(), draw()) });
  const spSeg = seg("spust", [["magnet", "elektromagnet"], ["roka", "z roko"], ["potisk", "s potiskom"]], "magnet", (v) => ((B.spust = v), reset(), draw()));
  const ncSeg = seg("način časovnika", [["spust", "od spusta"], ["vrata", "vrata 1 → 2"]], "spust", (v) => ((B.nacin = v), reset(), imenaKanalov(B, L1, L2), draw()));
  const goBtn = button("Spusti voziček", () => go(false), "primary small");
  const backBtn = button("Nazaj na začetek", () => (reset(), draw()));
  const slowBtn = button("Posnetek ×0,1", () => go(true));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => (table.clear(), (meas.length = 0), redraw()));
  const grSeg = seg("graf", [["st2", "s(t²)"], ["vt", "v(t)"]], "st2", (v) => ((graf = v), redraw()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, L1, L2)), controlsBox(
        grp("1. Klanec", hint(`Nogi proge sta 100${nb}cm narazen. Vsak kvader dvigne levo nogo za 2,0${nb}cm, zato je ${tex(String.raw`\sin\theta = \frac{h}{100${en("cm")}}`)}. Miza ni nujno vodoravna: preveri, ali voziček brez kvadrov miruje.`), row("kvadri", kvSeg), buttons(levBtn), row("voziček", mSeg)),
        grp("2. Svetlobna vrata", hint(`Zastavica na vozičku je široka 20,0${nb}mm. Žarek naj jo seka (povečava levo zgoraj). Začetek zastavice je pri 15,0${nb}cm.`), ...vrSl, zSl),
        grp("3. Spust in časovnik", hint(`Elektromagnet drži voziček; ko ga izklopiš, začne teči časovnik. V načinu »od spusta« meri čas do vsakih vrat, v načinu »vrata${nb}1${nb}→${nb}2« čas med vratoma.`), row("spust", spSeg), row("časovnik", ncSeg), buttons(goBtn, backBtn, slowBtn)),
        grp("4. Zapiši", buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Graf"), row("prikaži", grSeg), gS, vHint, gV, calc, qBox,
      notes(POENOSTAVITVE_GIBANJE.klanec, `Pospešek na klancu ${tex(String.raw`a = \frac{g(\sin\theta - \mu_\mathrm{r}\cos\theta)}{1 + I/(mr^2)}`)}, <i>g</i> = 9,806 m/s² v Ljubljani. Časovnik: ločljivost 0,1 ms (kot PASCO ME-8930), točnost ±(0,01 % + 1 digit, ocena). Ocene: koeficient kotalnega upora 0,0025–0,0045, vztrajnost koles (10 g), nagib mize 3–6 mm/m, zamik elektromagneta ~5 ms, širina žarka.`),
    ],
    tryText: "Postavi 2 kvadra in vrata na 30, 50, 70 in 90 cm (dva spusta). Nariši s(t²) in iz naklona izračunaj pospešek. Je manjši od g·sin θ? Zakaj? Kaj se zgodi s pospeškom, če voziček obtežiš?",
  });
  el.classList.add("lab");
  imenaKanalov(B, L1, L2);

  function go(sl) {
    if (sl && !B.run) return log.push("Najprej spusti voziček; posnetek pokaže zadnji spust 10-krat počasneje.", "warn");
    if (sl) B.run.t = 0;
    else {
      B.spusti();
      draw();
    }
    slow = sl;
    B.run.porocilo = B.run.konec = sl;
    draw();
    run.start(sl ? 0.1 : 1);
  }
  function frame(dt) {
    B.step(dt);
    posodobiProgo(B, R, L1, L2, lcdTxt);
    const R0 = B.run;
    if (B.izmerjeno && !R0.porocilo) (R0.porocilo = true), porociloPoteka(B, log);
    if (R0.t >= R0.tEnd && !R0.konec) (R0.konec = true), porociloPoteka(B, log, { konec: true });
    if (R0.t >= R0.tEnd + 1.5 * (slow ? 0.1 : 1)) {
      if (slow) (slow = false), draw();
      return false;
    }
  }
  function record() {
    if (!B.run || !B.izmerjeno) return log.push(B.run ? "Počakaj, da voziček pelje skozi obe vrati." : "Najprej spusti voziček.", "warn");
    if (B.run.nacin === "vrata") return log.push("Za graf <i>s</i>(<i>t</i>²) potrebuješ čas od spusta: preklopi časovnik na »od spusta« in spusti znova.", "warn");
    const m = B.meritev();
    const niz = `${2 * B.kvadri}${nb}cm, ${250 * (1 + B.nPalic)}${nb}g${B.spust === "potisk" ? ", sunek" : B.spust === "roka" ? ", roka" : ""}`;
    let n = 0;
    [[m.t1, m.dt1, 0], [m.t2, m.dt2, 1]].forEach(([t, dt, i]) => {
      if (t == null) return;
      const s_ = (B.vrata[i].nom - PROGA.u0), v = dt ? VOZICEK.zastavica / dt : null;
      table.add({ niz, s: num(s_, 2), t: num(t, 4), dt: dt ? num(dt * 1000, 1) : "–", v: v ? num(v, 3) : "–" });
      // v = d/Δt je povprečna hitrost med zatemnitvijo: tako hitrost ima voziček sredi nje, ob t + Δt/2 (ne ob t)
      meas.push({ niz, s: s_, t, t2: t * t, v, tv: v ? t + dt / 2 : null });
      n++;
    });
    if (!n) return log.push("Časovnik ni ustavljen: ni kaj zapisati.", "bad");
    redraw();
  }
  function redraw() {
    gS.hidden = graf !== "st2";
    gV.hidden = graf === "st2";
    const vm = meas.filter((r) => r.v != null);
    const a1 = os(Math.max(2, ...meas.map((r) => r.t2))), b1 = os(Math.max(1, ...meas.map((r) => r.s)));
    gS.setAxes({ x: [0, a1.top], y: [0, b1.top], xStep: a1.step, yStep: b1.step });
    gS.draw(serije(skupine(meas, "niz", "t2", "s")));
    vHint.hidden = graf === "st2";
    const a2 = os(Math.max(1.5, ...vm.map((r) => r.tv))), b2 = os(Math.max(1, ...vm.map((r) => r.v)));
    gV.setAxes({ x: [0, a2.top], y: [0, b2.top], xStep: a2.step, yStep: b2.step });
    gV.draw(serije(skupine(vm, "niz", "tv", "v")));
    const out = [];
    for (const [name, pts] of skupine(meas, "niz", "t2", "s")) {
      if (pts.length < 2) continue;
      const a = 2 * naklonSkoziIzhodisce(pts), vp = meas.filter((r) => r.niz === name && r.v != null).map((r) => [r.tv, r.v]);
      const av = vp.length >= 2 ? naklonSkoziIzhodisce(vp) : null, h_ = parseFloat(name) / 100;
      out.push(`<p><b>${name}</b>: ${tex(String.raw`a = 2k = ${rez(num(a, 3), "m/s²")}`)}${av ? `; iz <i>v</i>(<i>t</i>): ${num(av, 3)}${nb}m/s²` : ""}. ${h_ ? `Brez upora in vrtenja koles bi bil ${tex(String.raw`g\sin\theta = 9{,}81 \cdot ${num(h_, 2)} = ${num(G_SOLA * h_, 3)}${en("m/s²")}`)}; izmerjeni pospešek je ${num((100 * a) / (G_SOLA * h_), 0)}${nb}% tega.` : ""}</p>`);
    }
    calc.innerHTML = out.join("");
    const max = Math.max(0, ...[...skupine(meas, "niz", "t2", "s").values()].map((p) => p.length));
    if (max >= 4 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj pokaže graf <i>s</i>(<i>t</i>²) za voziček, ki ga spustiš iz mirovanja?",
        options: [
          { t: "Točke ležijo na premici skozi izhodišče: pot je sorazmerna s kvadratom časa, gibanje je enakomerno pospešeno z <i>a</i> = 2<i>k</i>.", ok: true, why: `Pri enakomerno pospešenem gibanju iz mirovanja je ${tex(String.raw`s = \frac{1}{2}at^2`)}, zato je naklon premice ${tex(String.raw`k = \frac{a}{2}`)}. Tudi <i>v</i>(<i>t</i>) je premica skozi izhodišče z naklonom <i>a</i>.` },
          { t: "Pot je sorazmerna s časom: voziček ima ves čas enako hitrost.", ok: false, why: "Potem bi bil premica graf <i>s</i>(<i>t</i>), ne <i>s</i>(<i>t</i>²). Hitrost na vratih 2 je večja kot na vratih 1, voziček pospešuje." },
          { t: "Pospešek je vse večji, ker voziček pada vse hitreje.", ok: false, why: "Hitrost raste, pospešek pa je stalen: sila teže vzdolž klanca in kotalni upor se med vožnjo ne spreminjata. Zato so točke na premici." },
          { t: "Težji voziček ima veliko večji pospešek.", ok: false, why: `Pospešek je skoraj neodvisen od mase: ${tex(String.raw`a = \frac{g(\sin\theta - \mu_\mathrm{r}\cos\theta)}{1 + I/(mr^2)}`)}. Težji voziček je le malo hitrejši, ker gre manjši del energije v vrtenje koles.` },
        ],
      }));
    }
  }

  let R, lcdTxt;
  function draw() {
    svg.replaceChildren();
    gradienti(svg);
    s("rect", { x: 0, y: yMiza, width: W, height: H - yMiza, fill: u(svg, "miza"), class: "lab-gib-miza" }, svg);
    // kvadri pod levo nogo
    for (let i = 0; i < B.kvadri; i++) s("rect", { x: X0 + 0.1 * P - 0.025 * P, y: yMiza - (i + 1) * PROGA.kvader * P, width: 0.05 * P, height: PROGA.kvader * P - 0.6, rx: 1, fill: u(svg, "les"), class: "lab-gib-kvader" }, svg);
    R = risiProgo(svg, B, { P, X0, yMiza });
    // kabli od vrat in magneta do časovnika
    const cx = 189, cy = 66;
    for (const v of B.vrata) {
      const xg = R.xp + R.L(v.x) * Math.cos((R.th * Math.PI) / 180), yg = yMiza + R.L(v.x) * Math.sin((R.th * Math.PI) / 180) + R.top - 0.11 * P;
      s("path", { d: `M${xg.toFixed(1)},${yg.toFixed(1)} C${xg.toFixed(1)},${yg - 25} ${cx},${cy + 30} ${cx},${cy}`, class: "lab-gib-kabel" }, svg);
    }
    lcdTxt = casovnikNaprava(svg, svg, 128, 4, 122, 4);
    // povečava pri vratih: pogled vzdolž proge (prerez), merilo 0,6 px/mm
    lupaPrerez(svg, 6, 4, 112, 82, B.zarek);
    merilo(svg, 262, 22, 0.1 * P, "10 cm");
    if (slow) label(svg, 300, 50, "POSNETEK ×0,1", "lab-gib-slow");
    posodobiProgo(B, R, L1, L2, lcdTxt);
    const z = zastira(B.zarek);
    svg.setAttribute("aria-label", `Klanec: proga 1,2 m, levo dvignjena za ${2 * B.kvadri} cm, voziček ${250 * (1 + B.nPalic)} g, vrata pri ${B.vrata.map((v) => Math.round(v.nom * 100)).join(" in ")} cm, ${kaj[z.kaj]}.`);
  }
  draw();
  redraw();
}

// Povečan prerez pri vratih (pogled vzdolž proge): profil proge, voziček, zastavica, krak vrat in žarek.
function lupaPrerez(svg, x, y, w, hh, zarek, newton) {
  const k = 0.6, yb = y + hh - 10, cx = x + w / 2; // 0,6 px/mm, dno proge
  const id = `${svg.uid}-lupa`;
  s("rect", { x, y, width: w, height: hh, rx: 7 }, s("clipPath", { id }, s("defs", {}, svg)));
  s("rect", { x, y, width: w, height: hh, rx: 7, class: "lab-gib-lupa-bg" }, svg);
  const g = s("g", { "clip-path": `url(#${id})` }, svg);
  const Y = (mm) => yb - mm * k;
  s("rect", { x: cx - 60 * k, y: Y(15), width: 120 * k, height: 15 * k, rx: 1, fill: u(svg, "alu"), class: "lab-gib-alu" }, g); // profil proge 12 cm
  s("rect", { x: cx - 48 * k, y: Y(VOZICEK.telo[1] * 1000), width: 96 * k, height: (VOZICEK.telo[1] - VOZICEK.telo[0]) * 1000 * k, rx: 2, fill: u(svg, "voz") }, g);
  for (const s_ of [-1, 1]) s("rect", { x: cx + s_ * 44 * k - 4 * k, y: Y(15 + VOZICEK.telo[0] * 1000), width: 8 * k, height: 25 * k * 0.6, rx: 2, class: "lab-gib-kolo" }, g);
  s("rect", { x: cx - 1, y: Y(VOZICEK.zast[1] * 1000 + 15), width: 2, height: (VOZICEK.zast[1] - VOZICEK.zast[0]) * 1000 * k, class: "lab-gib-zast" }, g);
  // vrata: kraka levo in desno od proge, prečka zgoraj, žarek med krakoma
  const hv = 110, yz = Y(15 + zarek * 1000);
  for (const s_ of [-1, 1]) s("rect", { x: cx + s_ * 70 * k - 6 * k, y: Y(hv + 15), width: 12 * k, height: (hv + 15) * k, rx: 1.5, fill: u(svg, "crno") }, g);
  s("rect", { x: cx - 76 * k, y: Y(hv + 15) - 6, width: 152 * k, height: 7, rx: 1.5, fill: u(svg, "crno") }, g);
  s("line", { x1: cx - 64 * k, y1: yz, x2: cx + 64 * k, y2: yz, class: "lab-gib-zarek" }, g);
  s("rect", { x, y, width: w, height: hh, rx: 7, class: "lab-gib-lupa-rob" }, svg);
  label(svg, x + w / 2, y + hh + 7, "povečava pri vratih (×2)", "lab-gib-cm");
}

// ================================================================ prosti pad
export function labProstiPad(el) {
  const B = new PadBench({ seed: seme() });
  const W = 400, H = 300, P = 120, yTla = 292, y0 = yTla - PAD.visina * P, xs = 80;
  const svg = svgBox(W, H, "lab-bench lab-gib lab-gib-pad");
  const log = eventLog();
  const tL = lcd("t (spust → vrata)"), dL = lcd("Δt (zatemnitev)");
  const table = dataTable([
    { key: "pr", label: "predmet" },
    { key: "h", label: "<i>h</i> [m]" },
    { key: "t", label: "<i>t</i> [s]" },
    { key: "t2", label: "<i>t</i>² [s²]" },
    { key: "v", label: "<i>v</i> [m/s]" },
  ], { empty: "Še ni meritev. Spusti predmet in zapiši čas; vrata premikaj po stojalu." });
  const gH = dataGraph({ x: [0, 0.5], y: [0, 2], xStep: 0.1, yStep: 0.5, xLabel: "t² [s²]", yLabel: "h [m]", title: "Višina padca v odvisnosti od kvadrata časa" });
  const gV = dataGraph({ x: [0, 1], y: [0, 7], xStep: 0.2, yStep: 1, xLabel: "t [s]", yLabel: "v [m/s]", title: "Hitrost v odvisnosti od časa" });
  const calc = h("div", { class: "lab-gib-calc", "aria-live": "polite" });
  const vHint = hint(`Hitrost ${tex(String.raw`v = \frac{D}{\Delta t}`)} je povprečna hitrost, medtem ko predmet zastira žarek. Tako hitrost ima predmet sredi zatemnitve, zato je točka narisana ob času ${tex(String.raw`t + \frac{\Delta t}{2}`)}.`);
  const qBox = h("div"), qBox2 = h("div");
  const meas = [];
  let graf = "ht2", asked = false, asked2 = false, slow = false, lcdTxt, ball;
  const run = poganjalnik(el, (dt) => frame(dt));
  const reset = () => (run.stop(), (B.run = null), (slow = false));

  const prSel = select({ label: "predmet", options: Object.entries(PREDMETI).map(([id, p]) => [id, p.name]), value: B.predmet, onChange: (v) => {
    B.predmet = v;
    reset();
    if (!B.drzi()) log.push(`Elektromagnet drži le predmete iz jekla; ${PREDMETI[v].name} ni iz jekla. Uporabi klešče s stikalom.`, "warn");
    draw();
  } });
  const spSeg = seg("spust", [["magnet", "elektromagnet"], ["klesce", "klešče s stikalom"]], "magnet", (v) => ((B.spust = v), reset(), draw()));
  const hSl = slider({ label: "vrata pod predmetom", min: 2, max: 200, step: 1, value: 100, unit: "cm", onInput: (v) => (B.postavi(v / 100), reset(), draw()) });
  const oSl = slider({ label: "premik vrat naprej–nazaj", min: -10, max: 10, step: 0.5, value: 0, unit: "mm", digits: 1, onInput: (v) => ((B.premik = v / 1000), reset(), draw()) });
  const goBtn = button("Spusti", () => go(false), "primary small");
  const slowBtn = button("Posnetek ×0,1", () => go(true));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => (table.clear(), (meas.length = 0), redraw()));
  const grSeg = seg("graf", [["ht2", "h(t²)"], ["vt", "v(t)"]], "ht2", (v) => ((graf = v), redraw()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, tL, dL)), controlsBox(
        grp("1. Predmet in spust", prSel, row("spust", spSeg), hint("Elektromagnet drži le jekleno kroglico. Ko tok izklopiš, začne teči časovnik; ustavi ga predmet, ko zastre žarek.")),
        grp("2. Svetlobna vrata", hint(`<i>h</i> je razdalja od spodnjega roba predmeta do žarka (merilni trak na stojalu, 1${nb}mm). Žarek mora iti skozi sredino padajočega predmeta: preveri v povečavi od zgoraj.`), hSl, oSl),
        grp("3. Merjenje", buttons(goBtn, slowBtn), buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Graf"), row("prikaži", grSeg), gH, vHint, gV, calc, qBox, qBox2,
      notes(POENOSTAVITVE_GIBANJE.pad, `Prosti pad ${tex(String.raw`h = \frac{1}{2}gt^2`)}, <i>g</i> = 9,806 m/s² (Ljubljana, GRS 80). Zračni upor ${tex(String.raw`F = \frac{1}{2}\rho cAv^2`)}, ${tex(String.raw`\rho = \frac{pM}{RT}`)}, <i>c</i> = 0,47 za kroglo (NASA Glenn, »Shape Effects on Drag«). Namiznoteniška žogica 40 mm, 2,7 g (ITTF). Ocene: <i>c</i> stožca, filtra in peresa, zamik elektromagneta ~5 ms in klešč ~12 ms, zamik vrat ob postavitvi.`),
    ],
    tryText: "Kroglico spusti z višin 20, 50, 100, 150 in 200 cm. Nariši h(t²) in iz naklona izračunaj g. Nato isto naredi s filtrom za kavo. Kdaj filter neha pospeševati?",
  });
  el.classList.add("lab");

  function go(sl) {
    if (sl && !B.run) return log.push("Najprej spusti predmet; posnetek pokaže zadnji spust 10-krat počasneje.", "warn");
    if (!sl) {
      if (!B.spusti()) return log.push("Elektromagnet tega predmeta ne drži: pade, še preden ga spustiš. Izberi klešče s stikalom.", "bad");
    } else B.run.t = 0;
    slow = sl;
    B.run.porocilo = B.run.konec = sl;
    draw();
    run.start(sl ? 0.1 : 1);
  }
  function frame(dt) {
    B.step(dt);
    upd();
    const R = B.run;
    if (R.t >= R.tEnd && !R.porocilo) {
      R.porocilo = true;
      const m = B.meritev();
      if (m.t == null) log.push(`Predmet je šel mimo žarka: vrata so ${num(Math.abs(B.odmik) * 1000, 1)}${nb}mm iz navpičnice. Premakni jih (povečava od zgoraj).`, "bad");
      else if (m.dt != null && PREDMETI[B.predmet].krogla && Math.abs(B.odmik) > 0.25 * PREDMETI[B.predmet].D) log.push(`Žarek je kroglico le oplazil (${num(Math.abs(B.odmik) * 1000, 1)}${nb}mm iz navpičnice): zastrl je krajšo tetivo, zato je Δ<i>t</i> prekratek in ${tex(String.raw`v = \frac{D}{\Delta t}`)} prevelik. Premakni vrata naprej–nazaj, da gre žarek skozi križec v povečavi od zgoraj.`, "warn");
      if (m.t != null && B.hNom < 0.1) log.push(`Vrata so le ${num(B.hNom * 100, 0)}${nb}cm pod predmetom: zamik spusta (nekaj ms) je tu velik del izmerjenega časa.`, "warn");
    }
    if (R.t >= R.tEnd + 1.2 * (slow ? 0.1 : 1)) {
      if (slow) (slow = false), draw();
      return false;
    }
  }
  function record() {
    if (!B.run || B.tece) return log.push(B.run ? "Počakaj, da predmet pade." : "Najprej spusti predmet.", "warn");
    const m = B.meritev(), Pr = PREDMETI[B.predmet];
    if (m.t == null) return log.push("Časovnik ni ustavljen: ni kaj zapisati.", "bad");
    const v = m.dt ? Pr.L / m.dt : null, pr = Pr.name.replace(/ \(.*\)/, "");
    table.add({ pr: KRATKO[B.predmet] ?? pr, h: num(B.hNom, 2), t: num(m.t, 4), t2: num(m.t * m.t, 4), v: v ? num(v, 2) : "–" });
    // v = L/Δt je povprečna hitrost med zatemnitvijo: na grafu v(t) spada k sredini zatemnitve, t + Δt/2
    meas.push({ pr, id: B.predmet, h: B.hNom, t: m.t, t2: m.t * m.t, v, tv: v ? m.t + m.dt / 2 : null });
    redraw();
  }
  function redraw() {
    gH.hidden = graf !== "ht2";
    gV.hidden = graf === "ht2";
    const vm = meas.filter((r) => r.v != null);
    const a1 = os(Math.max(0.4, ...meas.map((r) => r.t2))), b1 = os(Math.max(2, ...meas.map((r) => r.h)));
    gH.setAxes({ x: [0, a1.top], y: [0, b1.top], xStep: a1.step, yStep: b1.step });
    gH.draw(serije(skupine(meas, "pr", "t2", "h")));
    vHint.hidden = graf === "ht2";
    const a2 = os(Math.max(0.6, ...vm.map((r) => r.tv))), b2 = os(Math.max(2, ...vm.map((r) => r.v)));
    gV.setAxes({ x: [0, a2.top], y: [0, b2.top], xStep: a2.step, yStep: b2.step });
    gV.draw(serije(skupine(vm, "pr", "tv", "v"), { origin: false }));
    const out = [];
    for (const [name, pts] of skupine(meas, "pr", "t2", "h")) {
      if (pts.length < 2) continue;
      const k = naklonSkoziIzhodisce(pts), L = premica(pts), id = meas.find((r) => r.pr === name).id;
      const vt = koncnaHitrost(PREDMETI[id], B.rho);
      const lahek = vt < 4, upor = !lahek && vt < 12, hMax = Math.max(...pts.map((p) => p[1]));
      // delež upora ob vratih pri največji višini: F/(mg) = (v/v_t)², v² = v_t²(1 − e^(−2gh/v_t²)) (upor ∝ v²)
      const delez = 1 - Math.exp((-2 * G_SOLA * hMax) / (vt * vt)), zamik = id === "jeklo" && 2 * k < 9.75 ? " Manj kot 9,81: časovnik začne teči ob izklopu magneta, kroglica pa se odlepi nekaj milisekund pozneje (zamik je največji delež pri majhnih višinah)." : "";
      out.push(`<p><b>${name}</b>: ${lahek || upor ? "2<i>k</i>" : "<i>g</i> = 2<i>k</i>"} = <b>${num(2 * k, 2)}${nb}m/s²</b>${pts.length >= 3 ? ` (premica, ki ni nujno skozi izhodišče: ${num(2 * L.a, 2)}${nb}m/s²)` : ""}.${lahek ? ` To ni težni pospešek: zaradi zračnega upora točke ne ležijo na premici. Končna hitrost v tem zraku je ~${num(vt, 1)}${nb}m/s.` : upor ? ` To ni težni pospešek: zračni upor jo močno zavira. Pri padcu z ${num(hMax, 2)}${nb}m je upor ob vratih že ~${Math.round(delez * 20) * 5}${nb}% njene teže, zato žogica pospešuje vse manj in 2<i>k</i> je manjši od <i>g</i>. Končna hitrost v tem zraku je ~${num(vt, 1)}${nb}m/s.` : ""}${zamik}</p>`);
    }
    calc.innerHTML = out.join("");
    const nJ = meas.filter((r) => r.id === "jeklo").length, nL = Math.max(0, ...["stozec", "filter", "pero", "pingpong"].map((id) => meas.filter((r) => r.id === id).length));
    if (nJ >= 4 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj pove naklon premice <i>h</i>(<i>t</i>²) za jekleno kroglico?",
        options: [
          { t: `Naklon je ${tex(String.raw`\frac{g}{2}`)}: iz njega dobiš težni pospešek, ki je enak pri vseh višinah.`, ok: true, why: `Pri prostem padu iz mirovanja velja ${tex(String.raw`h = \frac{1}{2}gt^2`)}, zato je naklon premice ${tex(String.raw`\frac{g}{2} \approx 4{,}9${en("m/s²")}`)}. Pri jekleni kroglici je zračni upor tudi po 2 m padca le približno 1 % teže, zato se <i>g</i> iz naklona spremeni le za nekaj tisočink: <i>g</i> ≈ 9,8 m/s² pri vseh višinah.` },
          { t: "Naklon je kar <i>g</i>.", ok: false, why: "Iz <i>h</i> = ½<i>gt</i>² je naklon premice skozi izhodišče ½<i>g</i>. Če naklon vzameš za <i>g</i>, dobiš ~4,9 m/s²." },
          { t: "Z višino težni pospešek raste, ker kroglica pada vse hitreje.", ok: false, why: "Hitrost raste, pospešek pa ne: zato so točke na premici. Na nekaj metrih višine se tudi <i>g</i> sam ne spremeni opazno (manj kot milijoninka)." },
          { t: "Težja kroglica bi imela večji naklon.", ok: false, why: "Brez zračnega upora vsa telesa padajo z enakim pospeškom <i>g</i>, ne glede na maso (Galilej). Pri težkih in majhnih telesih je upor zanemarljiv." },
        ],
      }));
    }
    if (nL >= 3 && !asked2) {
      asked2 = true;
      qBox2.append(conclusion({
        text: "Zakaj filter za kavo (ali pero) pade veliko počasneje kot jeklena kroglica?",
        options: [
          { t: "Zračni upor raste s hitrostjo; pri lahkem in širokem predmetu hitro postane enak teži, nato pada s stalno končno hitrostjo.", ok: true, why: "Upor <i>F</i> = ½ρ<i>cAv</i>² je pri filtru (velik presek, masa 1 g) enak teži že pri ~1,1 m/s, zato filter po nekaj decimetrih ne pospešuje več: točke na grafu <i>v</i>(<i>t</i>) so vodoravne, <i>h</i>(<i>t</i>²) ni premica." },
          { t: "Lahka telesa imajo manjši težni pospešek.", ok: false, why: "Težni pospešek je za vsa telesa enak (v vakuumu pero in kroglica padeta enako hitro). Razlika je samo zračni upor, ki je pri lahkem in širokem telesu velik v primerjavi s težo." },
          { t: "Filter nosi vzgon zraka.", ok: false, why: "Vzgon je teža izpodrinjenega zraka: za tanek papir je več stokrat manjši od teže. Filter ustavlja upor zaradi gibanja skozi zrak, ne vzgon." },
          { t: "Klešče filter spustijo počasneje kot magnet kroglico.", ok: false, why: "Zamik klešč je ~12 ms, kar je pri času ~2 s zanemarljivo. Filter je počasnejši ves čas padanja, ker ga zavira zrak." },
        ],
      }));
    }
  }

  function upd() {
    const lg = B.lega(), Pr = PREDMETI[B.predmet];
    ball.setAttribute("transform", `translate(${(lg.x * P).toFixed(2)},${(lg.y * P).toFixed(2)})`);
    led.classList.toggle("on", B.zastrt());
    const c = B.casovnik();
    tL.set(num(c.t, 4), "s", c.stop[0] ? "ustavljen" : B.run ? "teče" : "");
    dL.set(num(c.dt * 1000, 1), "ms", Pr.L ? `${Pr.krogla ? "premer" : "višina"} ${num(Pr.L * 1000, 0)}${nb}mm` : "");
    setTxt(lcdTxt[0], `t  ${num(c.t, 4)} s`);
    setTxt(lcdTxt[1], `Δt ${num(c.dt * 1000, 1)} ms`);
  }
  let led;
  function draw() {
    svg.replaceChildren();
    gradienti(svg);
    const Pr = PREDMETI[B.predmet], yG = y0 + B.h * P;
    s("rect", { x: 0, y: yTla, width: W, height: H - yTla, class: "lab-gib-tla" }, svg);
    // človek za primerjavo (1,70 m)
    const xc = 150, hc = 1.7 * P, yc = yTla - hc;
    s("path", { d: `M${xc},${yc + 0.13 * hc} v${0.42 * hc} M${xc},${yc + 0.55 * hc} l-9,${0.45 * hc} M${xc},${yc + 0.55 * hc} l9,${0.45 * hc} M${xc},${yc + 0.2 * hc} l-12,${0.3 * hc} M${xc},${yc + 0.2 * hc} l12,${0.3 * hc}`, class: "lab-gib-clovek" }, svg);
    s("circle", { cx: xc, cy: yc + 0.065 * hc, r: 0.065 * hc, class: "lab-gib-clovek-g" }, svg);
    label(svg, xc + 16, yc + 6, "1,70 m", "lab-gib-cm", "start");
    // stojalo: podnožje, drog, roka z elektromagnetom ali kleščami
    s("rect", { x: 30, y: yTla - 6, width: 70, height: 6, rx: 2, fill: u(svg, "crno") }, svg);
    s("rect", { x: 44, y: yTla - 2.38 * P, width: 5, height: 2.38 * P - 6, fill: u(svg, "jeklo"), class: "lab-gib-drog-st" }, svg);
    s("rect", { x: 44, y: y0 - 22, width: xs - 40, height: 4, rx: 1, fill: u(svg, "jeklo") }, svg);
    if (B.spust === "magnet") {
      s("rect", { x: xs - 7, y: y0 - 18, width: 14, height: 16, rx: 2, class: "lab-gib-tuljava" }, svg);
      s("rect", { x: xs - 3, y: y0 - 3, width: 6, height: 3, class: "lab-gib-pol" }, svg);
    } else {
      s("path", { d: `M${xs - 8},${y0 - 18} l3,14 M${xs + 8},${y0 - 18} l-3,14`, class: "lab-gib-klesce" }, svg);
      s("rect", { x: xs - 9, y: y0 - 19, width: 18, height: 4, rx: 1, fill: u(svg, "crno") }, svg);
    }
    // merilni trak od spodnjega roba predmeta navzdol
    s("rect", { x: 50, y: y0, width: 8, height: PAD.hMax * P, class: "lab-gib-trak" }, svg);
    for (let c = 0; c <= 200; c += 10) {
      const yy = y0 + (c / 100) * P;
      s("line", { x1: 50, y1: yy, x2: 50 + (c % 50 ? 3 : 6), y2: yy, class: "lab-gib-crtica" }, svg);
      if (c % 50 === 0) label(svg, 40, yy, String(c), "lab-gib-cm", "end");
    }
    label(svg, 40, y0 - 9, "cm", "lab-gib-cm", "end");
    // vrata: nosilec na drogu, krak z žarkom (pogled od spredaj, žarek gre v risbo), LED
    s("rect", { x: 49, y: yG - 2, width: xs - 49 - 10, height: 4, fill: u(svg, "jeklo") }, svg);
    s("path", { d: `M${xs - 11},${yG + 4} V${yG - 10} H${xs + 11} V${yG + 4}`, class: "lab-gib-vrata-pad" }, svg);
    s("line", { x1: xs - 9, y1: yG, x2: xs + 9, y2: yG, class: "lab-gib-zarek" }, svg);
    led = s("circle", { cx: xs, cy: yG - 7, r: 2, class: "lab-gib-led" }, svg);
    s("path", { d: `M${xs + 11},${yG - 6} C${xs + 60},${yG - 6} 200,${250} 238,${246}`, class: "lab-gib-kabel" }, svg);
    s("path", { d: `M${xs + 7},${y0 - 12} C${xs + 70},${y0 - 12} 200,${230} 238,${236}`, class: "lab-gib-kabel" }, svg);
    // lovilna posoda
    s("rect", { x: xs - 14, y: yTla - 0.04 * P, width: 28, height: 0.04 * P, rx: 1, class: "lab-gib-posoda" }, svg);
    // predmet (gibljiv)
    ball = s("g", {}, svg);
    const rr = (Pr.D / 2) * P;
    if (Pr.krogla) s("circle", { cx: xs, cy: y0 - Math.max(rr, 1.4), r: Math.max(rr, 1.4), fill: u(svg, B.predmet === "jeklo" ? "krogla" : "pp"), class: "lab-gib-krogla" }, ball);
    else if (B.predmet === "pero") s("path", { d: `M${xs - rr},${y0 - 2} Q${xs},${y0 - 6} ${xs + rr},${y0 - 3}`, class: "lab-gib-pero" }, ball);
    else {
      const hh = Pr.L * P;
      s("path", { d: B.predmet === "stozec" ? `M${xs},${y0} L${xs - rr},${y0 - hh} H${xs + rr} Z` : `M${xs - rr * 0.65},${y0} H${xs + rr * 0.65} L${xs + rr},${y0 - hh} H${xs - rr} Z`, class: "lab-gib-papir" }, ball);
    }
    // časovnik in povečava od zgoraj
    lcdTxt = casovnikNaprava(svg, svg, 236, 214, 156, 2);
    lupaZgoraj(svg, 200, 56, 168, 112, B, Pr);
    merilo(svg, 172, 284, 0.5 * P, "50 cm");
    if (slow) label(svg, 280, 30, "POSNETEK ×0,1", "lab-gib-slow");
    upd();
    svg.setAttribute("aria-label", `Prosti pad: ${Pr.name} na ${B.spust === "magnet" ? "elektromagnetu" : "kleščah"}, svetlobna vrata ${Math.round(B.hNom * 100)} cm niže, žarek ${num(Math.abs(B.odmik) * 1000, 1)} mm iz navpičnice.`);
  }
  draw();
  redraw();
}

// kratka imena za tabelo (šest stolpcev mora iti na telefon brez vodoravnega drsenja)
const KRATKO = { jeklo: "kroglica", pingpong: "žogica", stozec: "stožec", filter: "filter", pero: "pero" };

// Povečava od zgoraj: žarek med krakoma vrat, navpičnica (križec) in obris predmeta.
function lupaZgoraj(svg, x, y, w, hh, B, Pr) {
  const k = Math.min(3, 70 / (Pr.D * 1000)), cx = x + w / 2, cy = y + hh / 2 + 4; // px/mm
  const id = `${svg.uid}-lupaz`;
  s("rect", { x, y, width: w, height: hh, rx: 8 }, s("clipPath", { id }, s("defs", {}, svg)));
  s("rect", { x, y, width: w, height: hh, rx: 8, class: "lab-gib-lupa-bg" }, svg);
  const g = s("g", { "clip-path": `url(#${id})` }, svg);
  const yb = cy + B.odmik * 1000 * k;
  s("circle", { cx, cy, r: (Pr.D / 2) * 1000 * k, class: "lab-gib-obris" }, g);
  for (const s_ of [-1, 1]) s("rect", { x: cx + s_ * (w / 2 - 14) - 7, y: yb - 9, width: 14, height: 18, rx: 2, fill: u(svg, "crno") }, g);
  s("line", { x1: cx - w / 2 + 21, y1: yb, x2: cx + w / 2 - 21, y2: yb, class: "lab-gib-zarek" }, g);
  s("path", { d: `M${cx - 6},${cy} H${cx + 6} M${cx},${cy - 6} V${cy + 6}`, class: "lab-gib-kriz" }, g);
  s("rect", { x, y, width: w, height: hh, rx: 8, class: "lab-gib-lupa-rob" }, svg);
  label(svg, cx, y + 9, `od zgoraj, povečano ${num(k / 0.12, 0)}×`, "lab-gib-cm");
  label(svg, cx, y + hh - 8, `žarek ${num(Math.abs(B.odmik) * 1000, 1)}${nb}mm iz navpičnice`, "lab-gib-cm");
}

// ================================================================ drugi Newtonov zakon
export function labNewton2(el) {
  const B = new ProgaBench({ seed: seme(), skripec: true });
  B.nacin = "vrata";
  const W = 400, H = 326, P = 270, X0 = 20, yMiza = 74, yTla = yMiza + SKRIPEC.miza * P, yPolica = yMiza + 120;
  const svg = svgBox(W, H, "lab-bench lab-gib lab-gib-newton");
  const log = eventLog();
  const L1 = lcd("t₁₂"), L2 = lcd("Δt₂");
  const stanje = h("p", { class: "lab-tit-hint lab-gib-stanje", "aria-live": "polite" });
  const table = dataTable([
    { key: "m", label: "<i>m</i> [g]" },
    { key: "F", label: "<i>F</i> [N]" },
    { key: "v1", label: "<i>v</i>₁ [m/s]" },
    { key: "v2", label: "<i>v</i>₂ [m/s]" },
    { key: "a", label: "<i>a</i> [m/s²]" },
  ], { empty: "Še ni meritev. Izravnaj trenje, spusti voziček in zapiši meritev." });
  const gF = dataGraph({ x: [0, 0.8], y: [0, 2.5], xStep: 0.1, yStep: 0.5, xLabel: "F [N]", yLabel: "a [m/s²]", title: "Pospešek v odvisnosti od sile" });
  const gM = dataGraph({ x: [0, 4], y: [0, 2.5], xStep: 1, yStep: 0.5, xLabel: "1/m [1/kg]", yLabel: "a [m/s²]", title: "Pospešek v odvisnosti od obratne vrednosti mase" });
  const calc = h("div", { class: "lab-gib-calc", "aria-live": "polite" });
  const qBox = h("div"), qBox2 = h("div");
  const meas = [];
  let graf = "aF", asked = false, asked2 = false, slow = false, R, lcdTxt, vrv, obes;
  const run = poganjalnik(el, (dt) => frame(dt));
  const reset = () => (run.stop(), (B.run = null), (slow = false));
  const ch = () => (reset(), syncUt(), draw());

  const podSl = slider({ label: "podložka pod levo nogo", min: 0, max: 8, step: 0.5, value: 0, unit: "mm", digits: 1, onInput: (v) => ((B.podlozka = v), ch()) });
  const levBtn = button("Izravnaj progo z libelo", () => (B.izravnaj(), log.push("Progo si izravnal z libelo (brez podložke). Nagib mize je zdaj manjši od 0,3 mm na meter.", "ok"), ch()));
  const vrvT = toggle("vrvica pripeta na voziček", true, (v) => ((B.vrvica = v), ch()));
  const toH = button("Utežico z vozička na obešalo", () => move(1));
  const toC = button("Utežico z obešala na voziček", () => move(-1));
  const fromBox = button("Dodaj utežico iz škatle na obešalo", () => {
    if (!B.prestavi("s", "o")) return log.push("V škatli ni več utežic.", "warn");
    log.push("Utežico si vzel iz škatle: sila se je povečala, a tudi skupna masa.", "warn"), ch();
  });
  const toBox = button("Utežico z obešala v škatlo", () => (B.prestavi("o", "s") ? ch() : log.push("Na obešalu ni utežic.", "warn")));
  const palSeg = seg("palice po 250 g na vozičku", [["0", "0"], ["1", "1"], ["2", "2"]], "0", (v) => ((B.nPalic = +v), ch()));
  const skSeg = seg("višina škripca", [["-1", "5 cm niže"], ["0", "v višini kavlja"], ["1", "5 cm više"]], "0", (v) => ((B.visinaSkripca = +v), ch()));
  const vrSl = [0, 1].map((i) => slider({ label: `vrata ${i + 1} pri`, min: 20, max: 110, step: 1, value: [30, 70][i], unit: "cm", onInput: (v) => (B.postaviVrata(i, v / 100), ch()) }));
  B.postaviVrata(0, 0.3), B.postaviVrata(1, 0.7);
  const spSeg = seg("spust", [["magnet", "elektromagnet"], ["roka", "z roko"], ["potisk", "s potiskom"]], "magnet", (v) => ((B.spust = v), ch()));
  const ncSeg = seg("način časovnika", [["vrata", "vrata 1 → 2"], ["spust", "od spusta"]], "vrata", (v) => ((B.nacin = v), imenaKanalov(B, L1, L2), ch()));
  const goBtn = button("Spusti voziček", () => go(false), "primary small");
  const backBtn = button("Nazaj na začetek", () => ch());
  const slowBtn = button("Posnetek ×0,1", () => go(true));
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const clrBtn = button("Izbriši meritve", () => (table.clear(), (meas.length = 0), redraw()));
  const grSeg = seg("graf", [["aF", "a(F)"], ["am", "a(1/m)"]], "aF", (v) => ((graf = v), redraw()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, L1, L2)), controlsBox(
        grp("1. Proga in trenje", hint("Kotalni upor izravnaš s podložko pod levo nogo. Preizkus: odpni vrvico, voziček sunkni in primerjaj Δ<i>t</i>₁ in Δ<i>t</i>₂. Ko sta enaka, se giblje enakomerno."), podSl, buttons(levBtn), vrvT),
        grp("2. Uteži", hint("Obešalo ima 10 g, šest utežic po 10 g je na vozičku, na obešalu ali v škatli. Če jih prestavljaš z vozička na obešalo, se skupna masa ne spremeni."), stanje, buttons(toH, toC), buttons(fromBox, toBox), row("palice 250 g", palSeg)),
        grp("3. Škripec", hint("Vrvica naj bo vzporedna s progo."), row("škripec", skSeg)),
        grp("4. Vrata in časovnik", ...vrSl, row("spust", spSeg), row("časovnik", ncSeg), buttons(goBtn, backBtn, slowBtn)),
        grp("5. Zapiši", buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Graf"), row("prikaži", grSeg), gF, gM, calc, qBox, qBox2,
      notes(POENOSTAVITVE_GIBANJE.newton, `Drugi Newtonov zakon za voziček in obešalo: ${tex(String.raw`a = \frac{m_\mathrm{o}g - F_\mathrm{tr}}{M + m_\mathrm{o} + (I_\mathrm{k} + I_\text{š})/r^2}`)}, <i>g</i> = 9,806 m/s². Uteži razreda M3 (OIML R111-1). Pospešek iz hitrosti na vratih: ${tex(String.raw`a = \frac{v_2^2 - v_1^2}{2s}`)}. Ocene: kotalni upor, vztrajnost koles in škripca, trenje v ležaju, višina mize 90 cm.`),
    ],
    tryText: "Najprej izravnaj trenje. Nato utežice eno za drugo prestavljaj z vozička na obešalo in vsakič izmeri pospešek. Je graf a(F) premica skozi izhodišče? Kaj pokaže naklon? Kaj se zgodi, če vrata 2 postaviš na 105 cm?",
  });
  el.classList.add("lab");
  imenaKanalov(B, L1, L2);

  // Vedno ista utežica zamenja mesto (B.kje): skupna masa ostane točno enaka, nobena ni šteta dvakrat.
  function move(d) {
    if (!(d > 0 ? B.prestavi("v", "o") : B.prestavi("o", "v"))) return log.push(d > 0 ? "Na vozičku ni več utežic." : "Na obešalu ni utežic.", "warn");
    ch();
  }
  function syncUt() {
    const box = SKRIPEC.n - B.naObes - B.naVoz;
    stanje.innerHTML = `Na vozičku ${B.naVoz} × 10${nb}g${B.nPalic ? ` in ${B.nPalic} × 250${nb}g` : ""}, na obešalu 10${nb}g + ${B.naObes} × 10${nb}g = <b>${10 + 10 * B.naObes}${nb}g</b>, v škatli ${box}. Skupaj v gibanju: <b>${Math.round((B.Mnaz + B.moNaz) * 1000)}${nb}g</b>.`;
  }
  function go(sl) {
    if (sl && !B.run) return log.push("Najprej spusti voziček; posnetek pokaže zadnji spust 10-krat počasneje.", "warn");
    if (sl) B.run.t = 0;
    else B.spusti();
    slow = sl;
    B.run.porocilo = B.run.konec = sl;
    draw();
    run.start(sl ? 0.1 : 1);
  }
  function frame(dt) {
    B.step(dt);
    upd();
    const R0 = B.run;
    if (B.izmerjeno && !R0.porocilo) {
      R0.porocilo = true;
      porociloPoteka(B, log, { newton: true });
    }
    if (R0.t >= R0.tEnd && !R0.konec) {
      R0.konec = true;
      porociloPoteka(B, log, { newton: true, konec: true });
      const m = B.meritev();
      if (!B.vrvica && m.dt1 && m.dt2) {
        const q = m.dt2 / m.dt1;
        log.push(`Preizkus trenja: ${tex(String.raw`\frac{\Delta t_2}{\Delta t_1} = ${num(q, 3)}`)}. ${q > 1.02 ? "Voziček se ustavlja: podložka je premajhna." : q < 0.98 ? "Voziček pospešuje: proga je preveč nagnjena." : "Hitrost je skoraj enaka: trenje je izravnano."}`, q > 1.02 || q < 0.98 ? "warn" : "ok");
      }
    }
    if (R0.t >= R0.tEnd + 1.5 * (slow ? 0.1 : 1)) {
      if (slow) (slow = false), draw();
      return false;
    }
  }
  function record() {
    if (!B.run || !B.izmerjeno) return log.push(B.run ? "Počakaj, da voziček pelje skozi obe vrati." : "Najprej spusti voziček.", "warn");
    if (!B.vrvica) return log.push("Brez vrvice na voziček ne deluje sila obešala; to je bil le preizkus trenja.", "warn");
    const m = B.meritev();
    if (!m.dt1 || !m.dt2) return log.push("Ena od vrat ni izmerila zatemnitve: ni hitrosti.", "bad");
    const v1 = VOZICEK.zastavica / m.dt1, v2 = VOZICEK.zastavica / m.dt2;
    let a;
    if (B.run.nacin === "vrata") a = (v2 * v2 - v1 * v1) / (2 * (B.vrata[1].nom - B.vrata[0].nom));
    else if (m.t2 != null) a = (2 * (B.vrata[1].nom - PROGA.u0)) / (m.t2 * m.t2);
    if (a == null || !Number.isFinite(a)) return log.push("Časovnik ni ustavljen: ni kaj zapisati.", "bad");
    const mg = Math.round((B.Mnaz + B.moNaz) * 1000), F = B.moNaz * G_SOLA;
    table.add({ m: String(mg), F: num(F, 3), v1: num(v1, 3), v2: num(v2, 3), a: num(a, 3) });
    meas.push({ m: mg, mk: `m = ${mg}${nb}g`, Fk: `F = ${num(F, 2)}${nb}N`, F, a, im: 1 / (mg / 1000) });
    redraw();
  }
  function redraw() {
    gF.hidden = graf !== "aF";
    gM.hidden = graf === "aF";
    const ay = os(Math.max(2, ...meas.map((r) => r.a))), a1 = os(Math.max(0.7, ...meas.map((r) => r.F))), a2 = os(Math.max(3.5, ...meas.map((r) => r.im)));
    gF.setAxes({ x: [0, a1.top], y: [0, ay.top], xStep: a1.step, yStep: ay.step });
    gF.draw(serije(skupine(meas, "mk", "F", "a"), { origin: false }));
    gM.setAxes({ x: [0, a2.top], y: [0, ay.top], xStep: a2.step, yStep: ay.step });
    gM.draw(serije(skupine(meas, "Fk", "im", "a")));
    const out = [];
    for (const [name, pts] of skupine(meas, "mk", "F", "a")) {
      if (pts.length < 3) continue;
      const L = premica(pts);
      out.push(`<p><b>${name}</b>: naklon ${tex(String.raw`\frac{a}{F} = ${num(L.a, 2)}${en("kg⁻¹")}`)}, torej ${tex(String.raw`m = \frac{F}{a} \approx ${rez(num(1000 / L.a, 0), "g")}`)} (voziček, uteži in obešalo: ${name.slice(4)}${1000 / L.a > 1.03 * parseFloat(name.slice(4)) ? "; malo več, ker sila zavrti tudi kolesa in škripec" : ""}). Odsek na osi <i>a</i>: ${num(L.b, 3)}${nb}m/s²${Math.abs(L.b) > 0.03 ? " – premica ne gre skozi izhodišče: trenje ni izravnano." : "."}</p>`);
    }
    calc.innerHTML = out.join("");
    const maxF = Math.max(0, ...[...skupine(meas, "mk", "F", "a").values()].map((p) => p.length));
    const maxM = Math.max(0, ...[...skupine(meas, "Fk", "im", "a").values()].map((p) => new Set(p.map((q) => q[0].toFixed(3))).size));
    if (maxF >= 4 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj velja za pospešek pri stalni skupni masi?",
        options: [
          { t: `Pospešek je sorazmeren s silo: dvakrat večja sila, dvakrat večji pospešek; naklon premice je ${tex(String.raw`\frac{1}{m}`)}.`, ok: true, why: `Drugi Newtonov zakon: ${tex(String.raw`a = \frac{F}{m}`)}. Pri izravnanem trenju so točke <i>a</i>(<i>F</i>) na premici skozi izhodišče, naklon je obratna vrednost skupne mase (z maso obešala in s koleščki).` },
          { t: "Pospešek je pri vseh silah enak, spremeni se le hitrost.", ok: false, why: "Izračunani pospeški so pri večji sili večji: točke na grafu <i>a</i>(<i>F</i>) se dvigajo. Če bi bil pospešek pri vseh silah enak, bi ležale na vodoravni črti." },
          { t: "Pospešek je sorazmeren z maso obešala, voziček ne vpliva.", ok: false, why: "Sila obešala pospešuje ves sistem: voziček, uteži na njem in obešalo. Zato je naklon 1/(skupna masa), ne 1/(masa obešala)." },
          { t: "Premica gre vedno skozi izhodišče, tudi brez izravnave trenja.", ok: false, why: "Brez izravnave mora sila najprej premagati kotalni upor (~10 mN), zato premica seka os <i>F</i> desno od izhodišča." },
        ],
      }));
    }
    if (maxM >= 3 && !asked2) {
      asked2 = true;
      qBox2.append(conclusion({
        text: "Zakaj si za graf <i>a</i>(<i>F</i>) utežice prestavljal z vozička na obešalo, namesto da bi jih jemal iz škatle?",
        options: [
          { t: "Tako je skupna masa, ki jo sila pospešuje, ves čas enaka, zato graf kaže le vpliv sile.", ok: true, why: `Sila obešala pospešuje voziček in obešalo skupaj. Če utežico vzameš iz škatle, povečaš silo in maso hkrati; točke potem niso več na eni premici (${tex(String.raw`a = \frac{F}{m}`)} se spremeni na dva načina). Graf ${tex(String.raw`a\left(\frac{1}{m}\right)`)} pri stalni sili pa pokaže vpliv mase.` },
          { t: "Da je voziček lažji in hitrejši.", ok: false, why: "Masa vozička se zmanjša, a obešalo postane enako težje: skupna masa ostane enaka. Prav to je namen." },
          { t: "Ker utežice iz škatle niso tako natančne.", ok: false, why: "Vse utežice so iz istega kompleta (razred M3, ±20 mg). Gre za to, kaj ostane stalno: skupna masa." },
          { t: "Vseeno je, od kod vzameš utežico.", ok: false, why: "Ni vseeno: utežica iz škatle poveča tudi skupno maso, zato se pospešek poveča manj, kot bi se pri stalni masi." },
        ],
      }));
    }
  }
  function upd() {
    const lg = posodobiProgo(B, R, L1, L2, lcdTxt);
    // vrvica od kavlja do vrha škripca in navpično do obešala
    const kx = X0 + (lg.u + VOZICEK.spredaj) * P, ky = yMiza + R.top - 0.03 * P;
    const px = X0 + SKRIPEC.x * P, rp = 0.025 * P, pyTop = ky - B.visinaSkripca * SKRIPEC.dy * P;
    const yo = yTla - SKRIPEC.H0 * P + lg.padec * P;
    vrv.setAttribute("d", B.vrvica ? `M${kx.toFixed(1)},${ky.toFixed(1)} L${px.toFixed(1)},${pyTop.toFixed(1)} A${rp},${rp} 0 0 1 ${(px + rp).toFixed(1)},${(pyTop + rp).toFixed(1)} V${(yo - obes.hh).toFixed(1)}` : `M${(px + rp).toFixed(1)},${(pyTop + rp).toFixed(1)} V${(yo - obes.hh).toFixed(1)}`);
    obes.g.setAttribute("transform", `translate(0,${(lg.padec * P).toFixed(2)})`);
  }
  function draw() {
    svg.replaceChildren();
    gradienti(svg);
    // miza s polico in tla
    s("rect", { x: 10, y: yMiza, width: X0 + 1.18 * P - 10, height: 6, fill: u(svg, "miza"), class: "lab-gib-miza" }, svg);
    for (const x of [16, X0 + 1.14 * P]) s("rect", { x, y: yMiza + 6, width: 6, height: yTla - yMiza - 6, class: "lab-gib-noga-miza" }, svg);
    s("rect", { x: 16, y: yPolica, width: X0 + 1.14 * P - 10, height: 4, class: "lab-gib-noga-miza" }, svg);
    s("rect", { x: 0, y: yTla, width: W, height: H - yTla, class: "lab-gib-tla" }, svg);
    label(svg, 30, yTla - 8, "tla", "lab-gib-cm", "start");
    // podložka pod levo nogo
    if (B.podlozka > 0) s("rect", { x: X0 + 0.1 * P - 5, y: yMiza - (B.podlozka / 1000) * P - 0.5, width: 10, height: Math.max(0.8, (B.podlozka / 1000) * P), class: "lab-gib-podlozka" }, svg);
    R = risiProgo(svg, B, { P, X0, yMiza, newton: true });
    // škripec na koncu proge
    const px = X0 + SKRIPEC.x * P, rp = 0.025 * P, ky = yMiza + R.top - 0.03 * P, pc = ky - B.visinaSkripca * SKRIPEC.dy * P + rp;
    s("path", { d: `M${X0 + 1.2 * P},${yMiza + R.top + 2} L${px},${pc}`, class: "lab-gib-nosilec" }, svg);
    s("circle", { cx: px, cy: pc, r: rp, class: "lab-gib-skripec" }, svg);
    s("circle", { cx: px, cy: pc, r: 1.2, class: "lab-gib-os" }, svg);
    // obešalo z utežicami (gibljivo)
    const og = s("g", {}, svg), ox = px + rp, yo = yTla - SKRIPEC.H0 * P, dh = 0.006 * P, n = B.naObes;
    s("rect", { x: ox - 0.015 * P, y: yo - 2, width: 0.03 * P, height: 2, rx: 0.6, fill: u(svg, "med") }, og);
    s("line", { x1: ox, y1: yo - 2, x2: ox, y2: yo - 2 - (n + 1.5) * dh, class: "lab-gib-drog" }, og);
    for (let i = 0; i < n; i++) s("rect", { x: ox - 0.014 * P, y: yo - 2 - (i + 1) * dh, width: 0.028 * P, height: dh - 0.4, rx: 0.6, fill: u(svg, "med"), class: "lab-gib-utez" }, og);
    obes = { g: og, hh: 2 + (n + 1.5) * dh };
    vrv = s("path", { class: "lab-gib-vrvica" }, svg);
    // časovnik na polici pod mizo, kabli od vrat; povečava in merilo pod mizo
    lcdTxt = casovnikNaprava(svg, svg, 36, yPolica - 62, 122, 4);
    for (const v of B.vrata) s("path", { d: `M${X0 + v.x * P},${yMiza + R.top - 0.11 * P} C${X0 + v.x * P - 30},${yMiza - 30} ${X0 + 1.0 * P},${yMiza + 40} 158,${yPolica - 40}`, class: "lab-gib-kabel" }, svg);
    lupaPrerez(svg, 196, yPolica - 96, 104, 82, B.zarek);
    merilo(svg, 100, yTla - 22, 0.1 * P, "10 cm");
    label(svg, X0 + SKRIPEC.x * P + 14, yMiza + 0.45 * SKRIPEC.miza * P, "90 cm", "lab-gib-cm", "start");
    if (slow) label(svg, 250, 24, "POSNETEK ×0,1", "lab-gib-slow");
    upd();
    svg.setAttribute("aria-label", `Voziček na vodoravni progi, vrvica čez škripec do obešala z ${10 + 10 * B.naObes} g. Skupaj ${Math.round((B.Mnaz + B.moNaz) * 1000)} g. Podložka ${num(B.podlozka, 1)} mm, škripec ${B.visinaSkripca ? (B.visinaSkripca > 0 ? "previsoko" : "prenizko") : "v višini kavlja"}.`);
  }
  syncUt();
  draw();
  redraw();
}
