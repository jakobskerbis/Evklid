// Virtualni laboratorij, toplota: grelec in izkoristek (lab-grelnik), mešanje tople in hladne vode (lab-mesanje),
// taljenje ledu in vrenje vode (lab-faze), ohlajanje čaja v različnih posodah (lab-ohlajanje).
// Modeli: lab-model-toplota.js (brez DOM). Čas teče v realnem času, učenec ga lahko pospeši.
import { h, s, fmt, svgBox, slider, select, segmented, button, toggle, layout, label, stage as stageBox, controls as controlsBox } from "./kit.js";
import { ticker, lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed } from "./lab.js";
import { drawMeter } from "./lab-fiz.js";
import { AM_RANGES, VM_RANGES } from "./lab-model.js";
import {
  GrelnikBench, MesanjeBench, FazeBench, OhlajanjeBench, izkoristek, geometrija, POSODE, VODA, GRELEC, NAPAJALNIK_T, KRAJI, KUHALNIK,
  SKODELICE, CAJ, T_IDEALNA, tlakNaVisini, vrelisce, POENOSTAVITVE_TOPLOTA,
} from "./lab-model-toplota.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const grp = (title, ...kids) => h("fieldset", { class: "lab-tit-grp" }, h("legend", {}, title), ...kids);
const buttons = (...k) => h("div", { class: "demo-buttons" }, ...k);
const row = (lab, ...kids) => h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, lab), ...kids);
const seg = (name, options, value, onChange) => {
  const x = segmented({ options, value, onChange });
  x.setAttribute("aria-label", name);
  return x;
};
const hint = (text) => h("p", { class: "lab-tit-hint", html: text });
// Štoparica: minute:sekunde,desetinke.
const ura = (t) => {
  const m = Math.floor(t / 60), sec = t - 60 * m;
  if (m >= 10) return `${m}:${String(Math.floor(sec)).padStart(2, "0")}`; // po 10 min brez desetink, da gre na zaslon
  return `${m}:${sec.toFixed(1).padStart(4, "0").replace(".", ",")}`;
};
const minSek = (t) => ((t = Math.round(t)), `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`); // najprej zaokroži, sicer 22:60
// Barva vode po temperaturi (od modrikaste hladne do rožnate vroče).
// Modra do ~45 °C bledi, nad tem postaja rožnato oranžna (brez sivih in zelenih vmesnih barv).
const barva = (T) => {
  const x = clamp((T - 5) / 85, 0, 1), k = x < 0.5 ? x * 2 : (x - 0.5) * 2;
  const [p, q] = x < 0.5 ? [[191, 224, 247], [226, 238, 248]] : [[226, 238, 248], [247, 196, 168]];
  return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * k)).join(" ")})`;
};
const hitrostSeg = (opts, value, onChange) => row("hitrost časa", seg("hitrost časa", opts.map((v) => [String(v), `×${v}`]), String(value), (v) => onChange(+v)));
// Risba se nariše znova 10-krat na sekundo: zamik animacije iz ure, da mehurčki in dim tečejo gladko naprej.
const faza = (T, d) => (-((performance.now() / 1000 + d) % T)).toFixed(2);
// Čaša: obris s kljunom. x0 levo, x1 desno, yT zgoraj, yB dno.
function casa(svg, x0, x1, yT, yB) {
  s("path", { d: `M${x0 - 6},${yT - 2} Q${x0},${yT} ${x0},${yT + 6} V${yB - 6} Q${x0},${yB} ${x0 + 6},${yB} H${x1 - 6} Q${x1},${yB} ${x1},${yB - 6} V${yT}`, class: "lab-glass" }, svg);
}
function voda(svg, x0, x1, yTop, yB, T, cls = "") {
  if (yB - yTop < 2) return;
  s("rect", { x: x0 + 1.5, y: yTop, width: x1 - x0 - 3, height: yB - yTop - 1.5, rx: 3, fill: barva(T), class: `lab-top-water ${cls}` }, svg);
  s("line", { x1: x0 + 1.5, y1: yTop, x2: x1 - 1.5, y2: yTop, class: "lab-top-surface" }, svg);
}
function mehurcki(svg, x0, x1, yTop, yB, n) {
  for (let i = 0; i < n; i++) {
    const x = x0 + 10 + ((i * 37) % Math.max(10, x1 - x0 - 20)), y = yB - 8 - ((i * 23) % Math.max(8, yB - yTop - 12));
    s("circle", { cx: x, cy: y, r: 2.2 + (i % 3), class: "lab-top-bubble lab-rise", style: `animation-delay:${faza(1.4, i * 0.27)}s` }, svg);
  }
}
function para(svg, xc, yT, moc) {
  if (moc <= 0.02) return;
  for (let i = -1; i <= 1; i++)
    s("path", { d: `M${xc + i * 20},${yT - 6} q-7,-10 0,-20 q7,-10 0,-20`, class: "lab-top-steam", opacity: clamp(moc, 0, 0.8).toFixed(2) }, svg);
}
// Sonda digitalnega termometra: ročaj in kovinska palica do konice (x, yTip).
function sonda(svg, x, yTop, yTip) {
  s("line", { x1: x, y1: yTop + 22, x2: x, y2: yTip, class: "lab-top-probe" }, svg);
  s("rect", { x: x - 5, y: yTop, width: 10, height: 24, rx: 3, class: "lab-top-handle" }, svg);
  s("path", { d: `M${x},${yTop} q0,-10 -12,-14`, class: "lab-top-cable" }, svg);
}
function merilo(svg, x, y, px, text) {
  s("path", { d: `M${x},${y - 4} V${y} H${x + px} V${y - 4}`, class: "lab-scale" }, svg);
  label(svg, x + px / 2, y + 12, text, "tick small");
}
// Pogosti deli: ura s pospeševanjem in samodejnim zapisom ob okroglih časih (model stopi točno do tega časa).
function ura0(el, B, { speed, auto, running, record, tick }) {
  ticker(el, (dt) => {
    let left = dt * speed();
    for (let g = 0; left > 1e-9 && g < 200; g++) {
      const tgt = auto.on && running() ? auto.next : Infinity;
      const d = Math.min(left, Math.max(0, tgt - B.t));
      if (d > 0) B.step(d), (left -= d);
      if (auto.on && running() && B.t >= auto.next - 1e-6) record(true), (auto.next += auto.every);
      else if (d <= 0) break;
    }
    tick();
  }, 100);
}

// ================================================================ grelec: Q = m c ΔT in W = U I t
export function labGrelnik(el) {
  const B = new GrelnikBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const W = 400, H = 282;
  const svg = svgBox(W, H, "lab-bench lab-top lab-top-grel");
  const log = eventLog();
  const supL = lcd("napajalnik"), vmL = lcd("voltmeter"), amL = lcd("ampermeter"), thL = lcd("termometer"), swL = lcd("štoparica"), balL = lcd("tehtnica");
  const table = dataTable([
    { key: "t", label: "<i>t</i> [s]" },
    { key: "U", label: "<i>U</i> [V]" },
    { key: "I", label: "<i>I</i> [A]" },
    { key: "T", label: "<i>T</i> [°C]" },
  ], { empty: "Še ni meritev. Zapiši začetno temperaturo, nato vklopi grelec." });
  const graph = dataGraph({ x: [0, 600], y: [10, 50], xStep: 60, yStep: 5, xLabel: "t [s]", yLabel: "T [°C]", title: "Temperatura vode v odvisnosti od časa", origin: false });
  const calc = h("div", { class: "lab-top-calc", "aria-live": "polite" });
  const qBox = h("div");
  const meas = []; // { t, U, I, T, on, mes }
  const auto = { on: true, every: 30, next: 30 };
  let speed = 1, mStud = null, nEv = 0, ccSaid = false, asked = false;

  const mSl = slider({ label: "masa vode", min: 100, max: 350, step: 10, value: 200, unit: "g" });
  const pourBtn = button("Natoči svežo vodo", () => pour());
  const weighBtn = button("Stehtaj vodo", () => weigh(), "primary small");
  const potT = toggle("grelec je potopljen v vodo", true, (v) => ((B.potopljen = v), v || log.push("Grelec si dvignil iz vode.", "warn"), draw()));
  const lidT = toggle("pokrov na čaši", false, (v) => ((B.pokrov = v), draw()));
  const uSl = slider({ label: "napetost napajalnika", min: 0, max: NAPAJALNIK_T.max, step: 0.5, value: 12, unit: "V", onInput: (v) => ((B.U0 = v), (ccSaid = false)) });
  const iSl = slider({ label: "omejitev toka", min: NAPAJALNIK_T.imin, max: NAPAJALNIK_T.imax, step: 0.5, value: 5, unit: "A", onInput: (v) => ((B.Ilim = v), (ccSaid = false)) });
  const onBtn = button("Vklopi grelec", () => setOn(!B.on), "primary small");
  const fixBtn = button("Zamenjaj grelec", () => (B.zamenjajGrelec(), log.push("Nov grelec je v čaši.", "ok"), draw()));
  const mixT = toggle("mešaj z mešalno palčko", false, (v) => ((B.mesaj = v), draw()));
  const autoT = toggle("zapisuj vsakih 30 s", true, (v) => (auto.on = v));
  const recBtn = button("Zapiši meritev", () => record(false), "primary small");
  const clrBtn = button("Izbriši meritve", () => (table.clear(), (meas.length = 0), redraw()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, supL, vmL, amL, thL, swL, balL)), controlsBox(
        grp("1. Voda in grelec", hint("Natoči vodo v čašo 400 mL in jo stehtaj (čaša je že tarirana). Grelec mora biti ves pod vodo."), mSl, buttons(pourBtn, weighBtn), potT, lidT),
        grp("2. Napajalnik", hint("Grelec je narejen za 12 V in 50 W. Napajalnik da do 30 V; ko tok doseže omejitev, zniža napetost (lučka CC)."), uSl, iSl, buttons(onBtn, fixBtn)),
        grp("3. Meri", hitrostSeg([1, 10, 60], 1, (v) => (speed = v)), mixT, autoT, buttons(recBtn, clrBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Segrevanje vode"), graph,
      h("h4", { class: "lab-h" }, "Toplota, delo in izkoristek"), calc, qBox,
      notes(POENOSTAVITVE_TOPLOTA.grelnik, "<i>Q</i> = <i>m c</i> Δ<i>T</i>, <i>W</i> = <i>U I t</i>, η = <i>Q</i>/<i>W</i>. Specifična toplota vode 4182 J/(kg·K) pri 20 °C (IAPWS, CRC Handbook); borosilikatno steklo ~0,83 kJ/(kg·K) (Schott). Natančnost multimetra iz navodil šolskega multimetra s 3½ mesta; termometer ±0,5 °C, ločljivost 0,1 °C; tehtnica ±0,2 g, ločljivost 0,1 g. Ocene: koeficienti prestopa toplote, izhlapevanje (analogija Chilton–Colburn), razplastenost, pregrevanje grelca."),
    ],
    tryText: "Segrej 200 g vode z grelcem 12 V približno 5 minut (izberi ×10) in izračunaj izkoristek. Nato poskus ponovi s pokrovom in z mešanjem. Kdaj je izkoristek večji in zakaj? Kaj se zgodi, če grelec vklopiš, ko ni v vodi?",
  });
  el.classList.add("lab");

  function pour() {
    if (B.on) setOn(false);
    B.nalij(mSl.get());
    mStud = null;
    meas.length = 0;
    table.clear();
    auto.next = auto.every;
    log.push(`V čaši je sveža voda iz pipe (približno ${mSl.get()} g). Stehtaj jo.`, "info");
    redraw(), readMeters(), draw();
  }
  function weigh() {
    const r = B.readM();
    mStud = r.value;
    balL.set(r.text, "g", "masa vode");
    log.push(`Tehtnica: ${r.text.replace(".", ",")} g vode.`, "ok");
    if (B.voda.m < 0.14) log.push("Voda komaj pokrije grelno spiralo. Natoči je več.", "warn");
    sync();
  }
  function setOn(v) {
    if (v && !B.tekla) {
      record(true); // začetna temperatura pri t = 0
      B.tekla = true;
      auto.next = auto.every;
    }
    B.on = v;
    onBtn.textContent = v ? "Izklopi grelec" : "Vklopi grelec";
    log.push(v ? "Grelec je vklopljen, štoparica teče." : `Grelec je izklopljen (segreval je ${fixed(B.tOn, 1)} s). Premešaj vodo in odčitaj najvišjo temperaturo.`, v ? "info" : "ok");
    readMeters(), draw();
  }
  let lastU = null, lastI = null, lastT = null;
  function readMeters() {
    const st = B.state;
    supL.set(B.on ? fixed(st.Uout, 1) : "", B.on ? "V" : "", B.on ? (st.cc ? `CC: omejitev ${fmt(B.Ilim, 1)}\u00a0A` : `nastavljeno ${fmt(B.U0, 1)}\u00a0V`) : "izhod izklopljen");
    lastU = B.readV(), lastI = B.readA(), lastT = B.readT();
    vmL.set(lastU.text, lastU.over ? "" : "V", "na grelcu");
    amL.set(lastI.text, lastI.over ? "" : "A", "območje 10 A");
    thL.set(lastT.text, "°C", B.mesaj ? "voda se meša" : "sonda ob strani");
    swL.set(ura(B.t), "", B.on ? "grelec greje" : B.tekla ? "grelec je izklopljen" : "čaka na vklop");
    if (mStud == null) balL.set("", "", "stehtaj vodo");
  }
  function record(isAuto) {
    readMeters();
    const r = { t: B.t, U: lastU.value, I: lastI.value, T: lastT.value, on: B.on, mes: B.mesaj };
    meas.push(r);
    const num = (x, d) => (x.over ? "OL" : fixed(x.value, d));
    table.add({ t: fixed(r.t, isAuto ? 0 : 1), U: num(lastU, lastU.value >= 19.995 ? 1 : 2), I: num(lastI, 2), T: fixed(r.T, 1) }, { quiet: isAuto });
    if (!isAuto && B.tekla && !B.on && !B.mesaj && B.plasti > 0.3) log.push("Voda ni premešana: termometer ob strani kaže manj od povprečne temperature.", "warn");
    redraw(), sync();
  }
  function redraw() {
    const tMax = Math.max(600, Math.ceil((B.t + 1) / 300) * 300);
    const Ts = meas.map((m) => m.T).filter(Number.isFinite);
    const lo = Math.floor((Math.min(B.voda.T, ...Ts) - 2) / 5) * 5, hi = Math.max(lo + 20, Math.ceil((Math.max(B.voda.T, ...Ts) + 3) / 5) * 5);
    graph.setAxes({ x: [0, tMax], y: [lo, hi], xStep: tMax > 1200 ? 300 : tMax > 600 ? 120 : 60, yStep: hi - lo > 50 ? 10 : 5 });
    graph.draw(meas.length ? [{ id: "T", pts: meas.map((m) => [m.t, m.T]), cls: "a", label: "termometer" }] : []);
  }
  // Izračun iz učenčevih podatkov: začetna T pri t = 0, najvišja T po izklopu, povprečna U in I med segrevanjem.
  function sync() {
    const zac = [...meas].reverse().find((m) => m.t === 0);
    const med = meas.filter((m) => m.on && m.I > 0 && Number.isFinite(m.U));
    const po = meas.filter((m) => !m.on && m.t > 0);
    const out = [];
    if (mStud == null) out.push("<li>Stehtaj vodo: potrebuješ maso <i>m</i>.</li>");
    if (!zac) out.push("<li>Pred vklopom zapiši začetno temperaturo (ob vklopu se zapiše sama).</li>");
    if (!med.length) out.push("<li>Med segrevanjem zapiši vsaj eno meritev napetosti in toka.</li>");
    if (B.on) out.push("<li>Ko se voda segreje za 10–20 °C, izklopi grelec.</li>");
    else if (B.tekla && !po.length) out.push("<li>Po izklopu premešaj vodo in zapiši najvišjo temperaturo.</li>");
    if (out.length) return (calc.innerHTML = `<ul>${out.join("")}</ul>`);
    const U = med.reduce((a, m) => a + m.U, 0) / med.length, I = med.reduce((a, m) => a + m.I, 0) / med.length;
    const T1 = zac.T, T2 = Math.max(...po.map((m) => m.T)), m = mStud / 1000, t = B.tOn;
    const r = izkoristek({ m, T1, T2, U, I, t });
    const dT = T2 - T1;
    calc.innerHTML = `<p><i>W</i> = <i>U I t</i> = ${fixed(U, 2)} V · ${fixed(I, 2)} A · ${fixed(t, 1)} s = <b>${fixed(r.W / 1000, 2)} kJ</b></p>
      <p><i>Q</i> = <i>m c</i> Δ<i>T</i> = ${fixed(m, 4)} kg · 4182 J/(kg·K) · (${fixed(T2, 1)} − ${fixed(T1, 1)}) K = <b>${fixed(r.Q / 1000, 2)} kJ</b></p>
      <p>η = <i>Q</i>/<i>W</i> = <b>${fmt(100 * r.eta, 0)} %</b></p>
      ${dT < 3 ? `<p class="lab-top-warn">Δ<i>T</i> je samo ${fixed(dT, 1)} K. Napaka razlike dveh odčitkov je ~0,2 K, to je že ${fmt((100 * 0.2) / Math.max(dT, 0.1), 0)} %. Manj vode ali daljše segrevanje da natančnejši rezultat.</p>` : ""}
      ${po.every((x) => !x.mes) ? `<p class="lab-top-warn">Končne temperature nisi zapisal med mešanjem. Voda brez mešanja ni enako topla povsod.</p>` : ""}`;
    if (!asked && r.eta > 0 && r.eta < 1.2) {
      asked = true;
      qBox.append(conclusion({
        text: "Zakaj je izkoristek grelca manjši od 100\u00a0%?",
        options: [
          { t: "Del električnega dela segreje čašo, grelec in termometer, del toplote pa uide v zrak skozi steno, dno in gladino (tudi z izhlapevanjem).", ok: true, why: "Električna energija se v grelcu skoraj v celoti spremeni v toploto, a vsa ne ostane v vodi. Steklena čaša (~110 g) prejme okoli desetino toplote, ki jo prejme 200 g vode, zrak pa še nekaj. Pokrov zmanjša izhlapevanje, mešanje pa da pravo končno temperaturo, zato je izmerjeni izkoristek večji." },
          { t: "Grelec del električne energije uniči.", ok: false, why: "Energija se ne uniči (zakon o ohranitvi energije). V grelcu se električno delo spremeni v toploto, ki pa se razdeli med vodo, posodo in okolico." },
          { t: "Večino energije porabita ampermeter in voltmeter.", ok: false, why: "Ampermeter ima upor ~0,01 Ω: pri 4 A je to ~0,2 W, voltmeter z 10 MΩ pa porabi le nekaj mikrovatov. Grelec ima 50 W." },
          { t: "Topla voda ima precej manjšo specifično toploto kot hladna.", ok: false, why: "Specifična toplota vode se med 0 in 100 °C spremeni za manj kot 1 %. Razlika do 100 % je veliko večja." },
        ],
      }));
    }
  }

  const say = {
    suh: () => ["Grelec ni v vodi! Zrak mu toplote ne odvzame dovolj hitro, zato se hitro segreva. Takoj ga izklopi.", "bad"],
    plitvo: () => ["Voda ne pokrije vse grelne spirale. Del grelca je v zraku in se pregreva.", "warn"],
    vroc: (e) => [`Grelec je segret že na ${fmt(e.T, 0)} °C. V vodi bi bil le kakšnih 20 °C toplejši od vode.`, "warn"],
    varovalka: () => ["Ohišje grelca se je segrelo nad 250 °C in termična varovalka je prekinila tok. Grelec je pokvarjen; zamenjaj ga.", "bad"],
    zica: (e) => [`Grelna žica je pregorela: moč je bila ${fmt(e.P, 0)} W, grelec pa je narejen za 50 W. Moč raste s kvadratom napetosti (<i>P</i> = <i>U</i>²/<i>R</i>).`, "bad"],
    prenapetost: (e) => [`Na grelcu je ${fmt(e.U, 1)} V, več od nazivnih 12 V. Grelec se bolj greje, kot je zanj varno.`, "warn"],
    vre: () => ["Voda vre. Temperatura ne raste več, voda izpareva.", "info"],
  };
  ura0(el, B, {
    speed: () => speed, auto, running: () => B.tekla, record,
    tick: () => {
      while (nEv < B.events.length) {
        const e = B.events[nEv++];
        log.push(...say[e.type](e));
        if (e.type === "zica" || e.type === "varovalka") draw();
      }
      const st = B.state;
      if (st.cc && !ccSaid) (ccSaid = true), log.push(`Napajalnik je omejil tok na ${fmt(B.Ilim, 1)} A (lučka CC). Na grelcu je le ${fmt(st.Uh, 1)} V.`, "warn");
      readMeters();
      draw();
      if (B.tekla && meas.length) redraw();
    },
  });

  // ---------------------------------------------------------------- risba (1 cm = 14 px)
  const K = 1400, yB = 248, X0 = 205, X1 = 311, yT = yB - 133;
  function draw() {
    svg.replaceChildren();
    const st = B.state, w = B.voda;
    s("line", { x1: 0, y1: yB + 1, x2: W, y2: yB + 1, class: "lab-tit-bench" }, svg);
    // napajalnik
    s("rect", { x: 8, y: 150, width: 86, height: 66, rx: 6, class: "lab-box" }, svg);
    label(svg, 51, 172, "0–30 V", "tick");
    label(svg, 51, 190, B.on ? `${fmt(st.Uout, 1)} V` : "izklopljen", "tick small");
    s("circle", { cx: 80, cy: 206, r: 4, class: st.cc ? "fill-danger" : "lab-led-off" }, svg);
    s("circle", { cx: 22, cy: 206, r: 4, class: B.on ? "fill-ok" : "lab-led-off" }, svg);
    label(svg, 40, 146, "+", "lbl small");
    label(svg, 80, 146, "−", "lbl small");
    // grelec: v čaši ali na mizi ob čaši
    const hx = B.potopljen ? 280 : 380;
    const wire = (d) => s("path", { d, class: "lab-wire" }, svg);
    wire(`M30,150 V30 H${hx + 4} V84`);
    wire(`M70,150 V74 H${hx - 4} V84`);
    drawMeter(svg, 130, 30, "A");
    s("path", { d: "M200,30 V35 M200,69 V74", class: "lab-wire" }, svg);
    drawMeter(svg, 200, 52, "V");
    // čaša in voda
    const Hpx = geometrija(POSODE.casa400, w.m).H * K;
    voda(svg, X0, X1, yB - Hpx, yB, w.T);
    if (B.plasti > 0.4) s("rect", { x: X0 + 2, y: yB - Hpx + 1, width: X1 - X0 - 4, height: Hpx * 0.45, fill: barva(w.T + B.plasti), opacity: 0.85 }, svg);
    if (w.vre) mehurcki(svg, X0, X1, yB - Hpx, yB, 9);
    casa(svg, X0, X1, yT, yB);
    for (let v = 100; v <= 400; v += 100) {
      const y = yB - (v / 1e6 / ((Math.PI * 0.076 * 0.076) / 4)) * K;
      if (y > yT + 6) s("line", { x1: X0, y1: y, x2: X0 + 9, y2: y, class: "lab-mark" }, svg);
    }
    // grelec: ročaj, palica in spirala med 0,5 in 3 cm nad dnom
    const hot = B.pokvarjen ? 0 : clamp((B.Tel - 60) / 200, 0, 1);
    const cls = B.pokvarjen ? "lab-top-coil burnt" : "lab-top-coil";
    s("rect", { x: hx - 9, y: 84, width: 18, height: 30, rx: 4, class: "lab-top-handle" }, svg);
    const yc0 = yB - GRELEC.z0 * K, yc1 = yB - GRELEC.z1 * K;
    s("line", { x1: hx, y1: 114, x2: hx, y2: yc1, class: cls }, svg);
    for (let i = 0; i < 5; i++) {
      const y = yc1 + ((yc0 - yc1) * i) / 4;
      s("ellipse", { cx: hx - 22, cy: y, rx: 22, ry: 4.5, class: cls }, svg);
    }
    if (hot > 0) s("rect", { x: hx - 46, y: yc1 - 6, width: 50, height: yc0 - yc1 + 12, rx: 6, class: "fill-danger", opacity: (0.55 * hot).toFixed(2) }, svg);
    if (B.pokvarjen) for (let i = 0; i < 3; i++) s("circle", { cx: hx - 30 + i * 12, cy: yc1 - 14 - i * 6, r: 6 + i * 2, class: "lab-smoke", style: `animation-delay:${faza(1.6, i * 0.5)}s` }, svg);
    if (B.potopljen) label(svg, hx + 16, 104, B.pokvarjen ? "pokvarjen" : "12 V / 50 W", "tick small", "start");
    else label(svg, W - 4, yB + 16, B.pokvarjen ? "grelec pokvarjen" : "grelec v zraku", "tick small", "end"); // pod mizo: nad spiralo je dim
    // termometer, pokrov, mešalna palčka
    sonda(svg, X0 + 18, 96, yB - 22);
    if (B.pokrov) s("rect", { x: X0 - 6, y: yT - 7, width: X1 - X0 + 12, height: 6, rx: 2, class: "lab-top-lid" }, svg);
    if (B.mesaj) s("line", { x1: X0 + 64, y1: yT - 26, x2: X0 + 46, y2: yB - 8, class: "lab-top-rod" }, svg);
    if (!B.pokrov && w.T > 45) para(svg, (X0 + X1) / 2, yT, (w.T - 45) / 60);
    label(svg, (X0 + X1) / 2, yB + 16, "čaša 400 mL", "tick small");
    merilo(svg, 120, yB + 14, 28, "2 cm");
    fixBtn.hidden = !B.pokvarjen;
    svg.setAttribute("aria-label", `Potopni grelec ${B.potopljen ? "v čaši z vodo" : "na mizi ob čaši, ni v vodi"}${B.pokvarjen ? ", pokvarjen" : ""}; napajalnik ${B.on ? "vklopljen" : "izklopljen"}; ampermeter zaporedno, voltmeter vzporedno z grelcem; termometer v vodi${B.pokrov ? ", čaša je pokrita" : ""}${B.mesaj ? ", voda se meša" : ""}.`);
  }

  readMeters();
  redraw();
  draw();
  sync();
}

// ================================================================ mešanje tople in hladne vode
export function labMesanje(el) {
  const B = new MesanjeBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const W = 400, H = 250;
  const svg = svgBox(W, H, "lab-bench lab-top lab-top-mes");
  const log = eventLog();
  const thL = lcd("termometer"), balL = lcd("tehtnica"), swL = lcd("štoparica");
  const table = dataTable([
    { key: "pos", label: "posoda" },
    { key: "w1", label: "topla <i>m</i>₁, <i>T</i>₁" },
    { key: "w2", label: "hladna <i>m</i>₂, <i>T</i>₂" },
    { key: "Tm", label: "<i>T</i> izm. [°C]" },
    { key: "Tc", label: "<i>T</i> izr. [°C]" },
  ], { empty: "Še ni meritev. Natoči hladno vodo, zlij k njej toplo, premešaj in zapiši končno temperaturo." });
  const graph = dataGraph({ x: [0, 120], y: [10, 60], xStep: 20, yStep: 10, xLabel: "t [s]", yLabel: "T [°C]", title: "Temperatura zmesi po zlivanju", origin: false });
  const calc = h("div", { class: "lab-top-calc", "aria-live": "polite" });
  const qBox = h("div");
  const pts = [];
  const auto = { on: true, every: 2, next: 2 };
  let speed = 1, trial = null, asked = false;
  const st = { m1: 100, T1: 80, m2: 100, T2: 20, tehtaj: true };

  const posSeg = seg("posoda", [["stiropor", "lonček iz stiropora"], ["casa400", "steklena čaša"]], B.posoda, (v) => ((B.posoda = v), B.faza === "prazno" || log.push("Posodo zamenjaš pri novem poskusu.", "info"), draw()));
  const lidT = toggle("pokrov s luknjo za termometer", true, (v) => ((B.pokrov = v), draw()));
  const m2Sl = slider({ label: "hladna voda m₂", min: 50, max: 150, step: 10, value: 100, unit: "g", onInput: (v) => ((st.m2 = v), draw()) });
  const T2Sl = slider({ label: "hladna voda T₂", min: 10, max: 25, step: 1, value: 20, unit: "°C", onInput: (v) => ((st.T2 = v), draw()) });
  const m1Sl = slider({ label: "topla voda m₁", min: 50, max: 150, step: 10, value: 100, unit: "g", onInput: (v) => ((st.m1 = v), draw()) });
  const T1Sl = slider({ label: "topla voda T₁", min: 40, max: 80, step: 5, value: 80, unit: "°C", onInput: (v) => ((st.T1 = v), draw()) });
  const wT = toggle("vodo stehtam (sicer natočim do oznake)", true, (v) => (st.tehtaj = v));
  const coldBtn = button("Natoči hladno vodo", () => cold(), "primary small");
  const mixBtn = button("Zlij toplo vodo v posodo", () => mix(), "primary small");
  const stirT = toggle("mešaj", false, (v) => ((B.mesaj = v), draw()));
  const recBtn = button("Zapiši končno temperaturo", () => record(), "primary small");
  const newBtn = button("Nov poskus", () => reset());

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, thL, balL, swL)), controlsBox(
        grp("1. Posoda (kalorimeter)", row("posoda", posSeg), lidT),
        grp("2. Voda", m2Sl, T2Sl, m1Sl, T1Sl, wT),
        grp("3. Poskus", hint("Hladno vodo natoči v posodo in počakaj, da se termometer ustali. Nato zlij toplo vodo, premešaj in zapiši najvišjo temperaturo."), buttons(coldBtn, mixBtn), stirT, hitrostSeg([1, 10], 1, (v) => (speed = v)), buttons(recBtn, newBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table, calc,
      h("h4", { class: "lab-h" }, "Temperatura po zlivanju"), graph, qBox,
      notes(POENOSTAVITVE_TOPLOTA.mesanje, "Toplotna bilanca: <i>m</i>₁<i>c</i>(<i>T</i>₁ − <i>T</i>) = <i>m</i>₂<i>c</i>(<i>T</i> − <i>T</i>₂), torej <i>T</i> = (<i>m</i>₁<i>T</i>₁ + <i>m</i>₂<i>T</i>₂)/(<i>m</i>₁ + <i>m</i>₂). Steklo ~0,83 kJ/(kg·K), k = 1,14 W/(m·K) (Schott Duran); stiropor k = 0,035 W/(m·K) (EN 13163). Termometer ±0,5 °C, tehtnica ±0,2 g. Ocene: mase in stene posod, prestop toplote, razplastenost."),
    ],
    tryText: "Zmešaj 100 g vode z 80 °C in 100 g vode z 20 °C v lončku iz stiropora s pokrovom. Napovej končno temperaturo, nato poskus ponovi v stekleni čaši brez pokrova. Kaj se zgodi, če zapišeš temperaturo, preden premešaš?",
  });
  el.classList.add("lab");

  function cold() {
    if (B.faza === "zmes") return log.push("V posodi je že zmes. Za nov poskus pritisni »Nov poskus«.", "warn");
    const m = B.nalijHladno(st.m2, st.T2);
    trial = { pos: B.posoda, pokrov: B.pokrov, m2: st.tehtaj ? B.readM(m).value : st.m2, m2w: st.tehtaj };
    if (st.tehtaj) balL.set(B.readM(m).text, "g", "hladna voda");
    else balL.set("", "", "ne tehtaš");
    pts.length = 0;
    log.push(`V posodi je hladna voda (${st.tehtaj ? `${fixed(trial.m2, 1)} g` : `do oznake ${st.m2} mL`}). Počakaj, da se termometer ustali.`, "info");
    redraw(), draw();
  }
  function mix() {
    if (B.faza !== "hladna") return log.push(B.faza === "prazno" ? "Najprej natoči hladno vodo v posodo." : "Topla voda je že v posodi.", "warn");
    const r = B.zlij(st.m1, st.T1);
    trial.T2 = r.T2;
    trial.T1 = r.T1;
    trial.m1 = st.tehtaj ? B.readM(r.m1).value : st.m1;
    if (st.tehtaj) balL.set(B.readM(r.m1).text, "g", "topla voda");
    pts.length = 0;
    pts.push([0, B.readT().value]);
    auto.next = auto.every;
    log.push(`Topla voda (${fixed(trial.T1, 1)} °C) je v posodi. Hladna je imela ${fixed(trial.T2, 1)} °C.`, "info");
    redraw(), draw(), sync();
  }
  function record() {
    if (B.faza !== "zmes") return log.push("Najprej zlij toplo vodo k hladni.", "warn");
    const T = B.readT().value, Tc = T_IDEALNA(trial.m1, trial.T1, trial.m2, trial.T2);
    const name = `${trial.pos === "stiropor" ? "stiropor" : "steklo"}${trial.pokrov ? " s pokrovom" : ""}`;
    const g = (m, T) => `${trial.m2w ? fixed(m, 1) : `≈\u00a0${m}`}\u00a0g, ${fixed(T, 1)}\u00a0°C`;
    table.add({ pos: name, w1: g(trial.m1, trial.T1), w2: g(trial.m2, trial.T2), Tm: fixed(T, 1), Tc: fixed(Tc, 1) });
    if (B.premesano < 5) log.push("Zmesi nisi premešal: termometer pri dnu kaže temperaturo hladnejše plasti. Premešaj in zapiši znova.", "bad");
    else if (B.t > 240) log.push("Dolgo si čakal: zmes se je medtem že ohladila, zato je izmerjena temperatura nižja.", "warn");
    if (!trial.m2w) log.push("Vode nisi stehtal: maso si ocenil po oznaki, ki je natančna le na ~5 %.", "warn");
    trial.done = { T, Tc, ok: B.premesano >= 5 };
    sync();
    if (trial.done.ok && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Zakaj je izmerjena končna temperatura malo nižja od izračunane?",
        options: [
          { t: "Topla voda je oddala toploto ne le hladni vodi, ampak tudi posodi, termometru in zraku.", ok: true, why: "Formula <i>T</i> = (<i>m</i>₁<i>T</i>₁ + <i>m</i>₂<i>T</i>₂)/(<i>m</i>₁ + <i>m</i>₂) upošteva samo vodo. Steklena čaša (~110 g stekla) prejme kar nekaj toplote in jo oddaja v zrak, zato je zmes v njej za nekaj stopinj hladnejša. Lonček iz stiropora je lahek in dober izolator, zato je razlika manjša od 1 °C." },
          { t: "Pri mešanju se je del toplote uničil.", ok: false, why: "Toplota se ne uniči. Kolikor je topla voda odda, toliko je prejmejo hladna voda, posoda in okolica." },
          { t: "Hladna voda se vedno segreje za več stopinj, kot se topla ohladi.", ok: false, why: "Pri enakih masah sta spremembi enaki: <i>m</i>₁Δ<i>T</i>₁ = <i>m</i>₂Δ<i>T</i>₂. Večjo spremembo ima voda z manjšo maso." },
          { t: "Termometer kaže preveč, ker je bil prej v topli vodi.", ok: false, why: "Sonda se ustali v nekaj sekundah. Če bi kazala preveč, bi bila izmerjena temperatura višja, ne nižja." },
        ],
      }));
    }
  }
  function sync() {
    if (!trial?.T1) return (calc.innerHTML = "");
    const Tc = T_IDEALNA(trial.m1, trial.T1, trial.m2, trial.T2);
    calc.innerHTML = `<p><i>T</i> = (<i>m</i>₁<i>T</i>₁ + <i>m</i>₂<i>T</i>₂)/(<i>m</i>₁ + <i>m</i>₂) = (${fixed(trial.m1, 1)} g · ${fixed(trial.T1, 1)} °C + ${fixed(trial.m2, 1)} g · ${fixed(trial.T2, 1)} °C)/${fixed(trial.m1 + trial.m2, 1)} g = <b>${fixed(Tc, 1)} °C</b></p>${trial.done ? `<p>Izmeril si ${fixed(trial.done.T, 1)} °C, to je ${fixed(Math.abs(trial.done.T - Tc), 1)} °C ${trial.done.T < Tc ? "manj" : "več"}, kot kaže izračun.</p>` : ""}`;
  }
  function reset() {
    B.faza = "prazno";
    B.mesaj = false;
    stirT.set(false);
    trial = null;
    pts.length = 0;
    B.th.Tp = null;
    calc.innerHTML = "";
    balL.set("", "", "");
    redraw(), draw();
  }
  function redraw() {
    const tMax = Math.max(120, Math.ceil(B.t / 60) * 60);
    graph.setAxes({ x: [0, tMax], xStep: tMax > 300 ? 60 : 20 });
    const ser = pts.length ? [{ id: "T", pts: [...pts], cls: "a", label: "termometer" }] : [];
    if (trial?.T1) ser.push({ id: "Tc", pts: [], cls: "b", label: "izračun", line: () => T_IDEALNA(trial.m1, trial.T1, trial.m2, trial.T2) });
    graph.draw(ser);
  }
  ura0(el, B, {
    speed: () => speed, auto, running: () => B.faza === "zmes",
    record: () => pts.push([B.t, B.readT().value]),
    tick: () => {
      const r = B.readT();
      thL.set(B.faza === "prazno" ? "" : r.text, "°C", B.faza === "prazno" ? "posoda je prazna" : B.mesaj ? "mešaš" : "sonda pri dnu");
      swL.set(B.faza === "zmes" ? ura(B.t) : "", "", B.faza === "zmes" ? "od zlivanja" : "začne ob zlivanju");
      if (B.faza === "zmes") redraw();
      draw();
    },
  });

  // ---------------------------------------------------------------- risba (1 cm = 12 px)
  function draw() {
    svg.replaceChildren();
    const yB = 214, P = POSODE[B.posoda];
    s("line", { x1: 0, y1: yB + 1, x2: W, y2: yB + 1, class: "lab-tit-bench" }, svg);
    // kozarca s toplo in hladno vodo (pred zlivanjem)
    const small = (xc, m, T, name, empty) => {
      const x0 = xc - 34, x1 = xc + 34, A = (Math.PI * 0.068 * 0.068) / 4;
      if (!empty) voda(svg, x0, x1, yB - (m / 1e6 / A) * 1200, yB, T);
      casa(svg, x0, x1, yB - 96, yB);
      label(svg, xc, yB + 16, name, "tick small");
      label(svg, xc, yB - 104, empty ? "prazna" : `${m} g, ${T} °C`, "tick small");
    };
    small(52, st.m1, st.T1, "topla voda", B.faza === "zmes");
    small(348, st.m2, st.T2, "hladna voda", B.faza !== "prazno");
    // kalorimeter
    const xc = 200, wd = P.d * 1200, x0 = xc - wd / 2, x1 = xc + wd / 2, yT = yB - 130;
    if (B.faza !== "prazno") {
      const w = B.voda, Hpx = geometrija(P, w.m).H * 1200;
      const lo = w.T - B.plasti, hi = w.T + (B.plasti * (B.m2 ?? 0.1)) / (B.m1 ?? 0.1);
      voda(svg, x0 + 3, x1 - 3, yB - Hpx, yB - 3, lo);
      if (B.plasti > 0.5) s("rect", { x: x0 + 5, y: yB - Hpx, width: wd - 10, height: Hpx * 0.45, fill: barva(hi), opacity: 0.9 }, svg);
    }
    if (B.posoda === "stiropor") {
      s("path", { d: `M${x0 - 8},${yT} L${x0},${yB} H${x1} L${x1 + 8},${yT}`, class: "lab-top-foam" }, svg);
      s("path", { d: `M${x0 - 2},${yT} L${x0 + 4},${yB - 4} H${x1 - 4} L${x1 + 2},${yT}`, class: "lab-top-foam-in" }, svg);
    } else casa(svg, x0, x1, yT, yB);
    if (B.pokrov) s("rect", { x: x0 - 12, y: yT - 7, width: wd + 24, height: 7, rx: 2, class: B.posoda === "stiropor" ? "lab-top-foam" : "lab-top-lid" }, svg);
    sonda(svg, xc - 18, yT - 40, yB - 10);
    if (B.mesaj) s("line", { x1: xc + 30, y1: yT - 30, x2: xc + 8, y2: yB - 8, class: "lab-top-rod" }, svg);
    label(svg, xc, yB + 16, B.posoda === "stiropor" ? "lonček iz stiropora" : "steklena čaša", "tick small");
    merilo(svg, 300, yB + 30, 24, "2 cm");
    svg.setAttribute("aria-label", `Kalorimeter: ${P.name}${B.pokrov ? " s pokrovom" : ""}. ${B.faza === "prazno" ? "Posoda je prazna." : B.faza === "hladna" ? "V posodi je hladna voda." : `V posodi je zmes${B.plasti > 0.5 ? ", topla voda je še zgoraj" : ""}.`}`);
  }
  redraw();
  draw();
  thL.set("", "°C", "posoda je prazna");
}

// ================================================================ taljenje ledu in vrenje vode
export function labFaze(el) {
  const B = new FazeBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const W = 400, H = 262;
  const svg = svgBox(W, H, "lab-bench lab-top lab-top-faze");
  const log = eventLog();
  const thL = lcd("termometer"), swL = lcd("štoparica"), plL = lcd("kuhalnik");
  const status = h("p", { class: "lab-status", "aria-live": "polite" });
  const table = dataTable([
    { key: "t", label: "<i>t</i> [min:s]" },
    { key: "T", label: "<i>T</i> [°C]" },
    { key: "v", label: "v čaši" },
  ], { empty: "Še ni meritev. Vklopi kuhalnik; meritve se zapisujejo vsakih 30 s." });
  const graph = dataGraph({ x: [0, 20], y: [-25, 115], xStep: 2, yStep: 20, xLabel: "t [min]", yLabel: "T [°C]", title: "Temperatura vsebine čaše med segrevanjem", origin: false });
  const qBox = h("div");
  const meas = [];
  const auto = { on: true, every: 30, next: 30 };
  let speed = 10, nEv = 0, gram = 150, salt = 0;
  const asked = new Set();

  const iceSeg = seg("led", [["100", "100 g"], ["150", "150 g"], ["200", "200 g"]], "150", (v) => (gram = +v));
  const saltSeg = seg("sol", [["0", "brez"], ["10", "10 g"], ["30", "30 g"]], "0", (v) => (salt = +v));
  const krajSel = select({ label: "kraj (zračni tlak)", options: Object.entries(KRAJI).map(([k, x]) => [k, `${x.name}, ${fmt(tlakNaVisini(x.h) / 1000, 1)} kPa`]), value: B.kraj, onChange: (v) => ((B.kraj = v), draw()) });
  const prepBtn = button("Pripravi čašo z ledom", () => prep(), "primary small");
  const stSeg = seg("stopnja kuhalnika", [["1", "1"], ["2", "2"], ["3", "3"]], "2", (v) => (B.stopnja = +v));
  const posSeg = seg("termometer", [["sredina", "v sredini"], ["dno", "na dnu"]], "sredina", (v) => ((B.polozaj = v), v === "dno" && log.push("Sonda se zdaj dotika dna čaše.", "info"), draw()));
  const onBtn = button("Vklopi kuhalnik", () => setOn(!B.on), "primary small");
  const autoT = toggle("zapisuj vsakih 30 s", true, (v) => (auto.on = v));
  const recBtn = button("Zapiši meritev", () => record(false));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, thL, swL, plL), status), controlsBox(
        grp("1. Priprava", hint("V čašo 600 mL daš zdrobljen led iz zamrzovalnika (−15 °C). Lahko mu dodaš kuhinjsko sol."), row("led", iceSeg), row("sol", saltSeg), krajSel, buttons(prepBtn)),
        grp("2. Segrevanje", hint("Led ves čas mešaš. Sonda termometra naj bo v sredini, ne na dnu."), row("stopnja", stSeg), row("termometer", posSeg), buttons(onBtn), hitrostSeg([1, 10, 60], 10, (v) => (speed = v)), autoT, buttons(recBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Krivulja segrevanja"), graph, qBox,
      notes(POENOSTAVITVE_TOPLOTA.faze, "Talilna toplota ledu 334 kJ/kg, izparilna toplota vode 2257 kJ/kg pri 100 °C, specifična toplota ledu 2,1 kJ/(kg·K) (CRC Handbook). Vrelišče iz Antoinove enačbe (pri 101,3 kPa 100,0 °C, pri 96 kPa 98,5 °C, kot v parnih tabelah); tlak iz standardne atmosfere (ISA). Tališče slane vode: CRC Handbook (5 % NaCl −3,05 °C, 10 % −6,56 °C, evtektik −21,1 °C). Ocene: moč, ki jo kuhalnik odda v čašo, izgube, segrevanje dna."),
    ],
    tryText: "Segrevaj 150 g ledu brez soli na stopnji 2 (×60). Kaj se dogaja s temperaturo, ko se led tali, in kaj, ko voda vre? Pri kateri temperaturi zavre voda v Ljubljani in pri kateri na Kredarici? Nato ponovi z 10 g soli in s sondo na dnu čaše.",
  });
  el.classList.add("lab");

  function prep() {
    B.pripravi(gram, salt);
    meas.length = 0;
    table.clear();
    auto.next = auto.every;
    nEv = 0;
    B.events.length = 0;
    onBtn.textContent = "Vklopi kuhalnik";
    log.push(`V čaši je ${gram} g zdrobljenega ledu${salt ? ` in ${salt} g soli` : ""}.`, "info");
    redraw(), draw();
  }
  function setOn(v) {
    if (v && B.W < 0.02) return log.push("V čaši skoraj ni več vode. Pripravi novo čašo z ledom.", "warn");
    if (v && !B.tekla) record(true), (B.tekla = true), (auto.next = auto.every);
    B.on = v;
    onBtn.textContent = v ? "Izklopi kuhalnik" : "Vklopi kuhalnik";
    draw();
  }
  function record(isAuto) {
    const r = B.readT();
    if (!Number.isFinite(r.value)) return;
    meas.push([B.t / 60, r.value]);
    table.add({ t: minSek(B.t), T: fixed(r.value, 1), v: B.stanje }, { quiet: isAuto });
    if (!isAuto && B.polozaj === "dno" && B.Pk > 20 && !asked.has("dno-hint")) asked.add("dno-hint"), log.push("Sonda se dotika dna, ki je na kuhalniku toplejše od vode. Termometer kaže preveč.", "warn");
    redraw();
  }
  function redraw() {
    const tMax = Math.max(20, Math.ceil(B.t / 60 / 10) * 10);
    graph.setAxes({ x: [0, tMax], xStep: tMax > 40 ? 10 : tMax > 20 ? 5 : 2 });
    graph.draw(meas.length ? [{ id: "T", pts: [...meas], cls: "a", label: "termometer" }] : []);
  }
  function ask(k, q) {
    if (asked.has(k)) return;
    asked.add(k);
    qBox.append(conclusion(q));
  }
  const say = {
    tali: () => (B.sol > 0 ? ["Sol topi led: nastaja slana voda, temperatura pada pod 0 °C.", "info"] : ["Led se začne taliti. Opazuj termometer.", "info"]),
    stalilo: (e) => [`Ves led se je stalil (pri ${fmt(e.T, 1)} °C). Zdaj se segreva voda.`, "ok"],
    vre: (e) => [`Voda vre pri ${fixed(e.T, 1)} °C. Mehurčki so vodna para.`, "ok"],
    suho: () => ["Skoraj vsa voda je izparela, zato se je kuhalnik izklopil: prazna čaša na vroči plošči lahko poči.", "bad"],
  };
  ura0(el, B, {
    speed: () => speed, auto, running: () => B.tekla, record,
    tick: () => {
      while (nEv < B.events.length) {
        const e = B.events[nEv++];
        log.push(...say[e.type](e));
        if (e.type === "stalilo" && B.sol === 0)
          ask("tali", {
            text: "Zakaj je temperatura med taljenjem ledu ostala pri 0\u00a0°C, čeprav je kuhalnik ves čas grel?",
            options: [
              { t: "Vsa dovedena toplota se je porabila za taljenje: za razbijanje vezi med molekulami v kristalu ledu, ne za hitrejše gibanje molekul.", ok: true, why: "To je talilna toplota: za 1 kg ledu pri 0 °C potrebuješ 334 kJ. Dokler je v čaši še led, temperatura ne naraste. Iz dolžine ravnega dela grafa lahko oceniš moč kuhalnika: <i>P</i> ≈ <i>m</i> · 334 kJ/kg / <i>t</i>." },
              { t: "Kuhalnik med taljenjem ni grel.", ok: false, why: "Kuhalnik je grel ves čas z enako močjo. Toplota je šla v led, a je ni bilo videti na termometru." },
              { t: "Termometer v ledu ne meri pravilno.", ok: false, why: "Termometer meri pravilno: zmes ledu in vode ima res 0 °C. Ko se led stali, temperatura spet raste." },
              { t: "Led toploto odbija nazaj v zrak.", ok: false, why: "Led toplote ne odbija, prejema jo. Vsa prejeta toplota se porabi za taljenje, zato temperatura ne naraste." },
            ],
          });
        if (e.type === "vre" && e.T < 99.5) // ob morju voda zavre pri ~100 °C: vprašanje »zakaj ne pri 100 °C« tam ni smiselno
          ask("vre", {
            text: `Zakaj je voda zavrela pri ${fixed(e.T, 1)}\u00a0°C in ne točno pri 100\u00a0°C?`,
            options: [
              { t: "Vrelišče je odvisno od zračnega tlaka: 100 °C velja pri 101,3 kPa. Višje kot smo, manjši je tlak, zato voda zavre pri nižji temperaturi.", ok: true, why: `Voda zavre, ko je tlak njene pare enak zračnemu tlaku. ${B.sol > 0 ? "Sol vrelišče še malo zviša. " : ""}Ob morju voda vre pri 100 °C, v Ljubljani pri ~99 °C, na Kredarici pri ~92 °C. V loncu na pritisk je tlak večji, zato voda vre pri ~120 °C in hrana se skuha hitreje.` },
              { t: "Termometer je pokvarjen.", ok: false, why: "Termometer meri na ±0,5 °C. Razlika je v zraku nad nami, ne v termometru: izberi drug kraj in poglej." },
              { t: "Kuhalnik je prešibak, da bi vodo segrel do 100 °C.", ok: false, why: "Tudi z najmočnejšo stopnjo voda ne bo toplejša od vrelišča. Več moči pomeni le, da voda hitreje izpareva." },
            ],
          });
      }
      const r = B.readT();
      thL.set(r.text, "°C", B.polozaj === "dno" ? "sonda na dnu" : "sonda v sredini");
      swL.set(ura(B.t), "", B.tekla ? "od vklopa" : "čaka na vklop");
      plL.set(B.on ? String(B.stopnja) : "0", "", B.on ? `stopnja ${B.stopnja}` : B.Pk > 5 ? "izklopljen, še topel" : "izklopljen");
      status.textContent = `V čaši: ${B.stanje}${B.sol ? " (slana)" : ""}. Vrelišče tu: ${fixed(vrelisce(B.p), 1)}\u00a0°C.`;
      if (!B.on && onBtn.textContent !== "Vklopi kuhalnik") onBtn.textContent = "Vklopi kuhalnik";
      if (B.tekla) redraw();
      draw();
    },
  });

  // ---------------------------------------------------------------- risba (1 cm = 12 px)
  const ICE = Array.from({ length: 30 }, (_, i) => ({ x: (i * 0.37) % 1, y: Math.floor(i / 6), r: (i * 47) % 90 }));
  function draw() {
    svg.replaceChildren();
    const P = POSODE.casa600, yB = 222, wd = P.d * 1200, xc = 250, x0 = xc - wd / 2, x1 = xc + wd / 2, yT = yB - 144;
    s("line", { x1: 0, y1: 246, x2: W, y2: 246, class: "lab-tit-bench" }, svg);
    // kuhalnik
    s("rect", { x: 160, y: yB + 2, width: 180, height: 22, rx: 4, class: "lab-top-plate" }, svg);
    s("rect", { x: 178, y: yB, width: 144, height: 5, rx: 2, class: "lab-top-plate-top" }, svg);
    if (B.Pk > 3) s("rect", { x: 178, y: yB, width: 144, height: 5, rx: 2, class: "fill-danger", opacity: clamp(B.Pk / 250, 0, 0.9).toFixed(2) }, svg);
    s("circle", { cx: 326, cy: yB + 13, r: 6, class: "lab-top-knob" }, svg);
    label(svg, 154, yB + 17, B.on ? `stopnja ${B.stopnja}` : "izklopljen", "tick small", "end");
    // vsebina: tekoča voda in koščki ledu
    const A = (Math.PI * P.d * P.d) / 4;
    // koščki ledu: brez vode ležijo na dnu, v vodi plavajo tik pod gladino
    const hl = (B.ml / VODA.rho / A) * 1200, nIce = Math.min(30, Math.round((B.led / 0.2) * 30)), plava = hl > 14;
    if (B.ml > 1e-4) voda(svg, x0, x1, yB - hl, yB, B.T);
    for (let i = 0; i < nIce; i++) {
      const c = ICE[i], col = i % 6, rw = Math.floor(i / 6);
      const x = x0 + 8 + (col * (wd - 30)) / 5 + c.x * 6;
      const y = plava ? Math.min(yB - 13, yB - hl - 4 + rw * 10) : yB - 13 - rw * 10;
      s("rect", { x, y, width: 14, height: 11, rx: 2, transform: `rotate(${c.r - 45} ${x + 7} ${y + 5})`, class: "lab-top-ice" }, svg);
    }
    if (B.sol > 0 && B.led > 0.01 && !plava) for (let i = 0; i < 8; i++) s("circle", { cx: x0 + 14 + i * 11, cy: yB - 18 - Math.ceil(nIce / 6) * 10 + ((i * 5) % 7), r: 1.8, class: "lab-top-salt" }, svg);
    if (B.stanje === "voda vre") mehurcki(svg, x0, x1, yB - hl, yB, 11), para(svg, xc, yT, 0.7);
    else if (B.T > 50 && B.ml > 0.01) para(svg, xc, yT, (B.T - 50) / 80);
    casa(svg, x0, x1, yT, yB);
    for (let v = 100; v <= 500; v += 100) {
      const y = yB - (v / 1e6 / A) * 1200;
      s("line", { x1: x0, y1: y, x2: x0 + 10, y2: y, class: "lab-mark" }, svg);
      if (v % 200 === 0) label(svg, x0 + 13, y + 4, String(v), "tick small", "start");
    }
    sonda(svg, x1 - 22, yT - 42, B.polozaj === "dno" ? yB - 2 : yB - 40);
    label(svg, xc, 256, "čaša 600 mL na kuhalniku", "tick small");
    // tlak in vrelišče
    label(svg, 12, 30, KRAJI[B.kraj].name, "tick small", "start");
    label(svg, 12, 48, `p = ${fmt(B.p / 1000, 1)} kPa`, "tick small", "start");
    label(svg, 12, 66, `vrelišče ${fixed(vrelisce(B.p), 1)} °C`, "tick small", "start");
    merilo(svg, 20, 238, 24, "2 cm");
    svg.setAttribute("aria-label", `Čaša na kuhalniku (${B.on ? `stopnja ${B.stopnja}` : "izklopljen"}). V čaši: ${B.stanje}, ${fmt(B.led * 1000, 0)} g ledu in ${fmt(B.ml * 1000, 0)} g vode${B.sol ? ", s soljo" : ""}. Sonda termometra je ${B.polozaj === "dno" ? "na dnu" : "v sredini"}.`);
  }
  redraw();
  draw();
}

// ================================================================ ohlajanje čaja v različnih posodah
export function labOhlajanje(el) {
  const B = new OhlajanjeBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const W = 400, H = 242;
  const svg = svgBox(W, H, "lab-bench lab-top lab-top-ohl");
  const log = eventLog();
  const thL = [0, 1, 2].map((i) => lcd(`posoda ${i + 1}`));
  const swL = lcd("štoparica");
  const CLS = ["a", "b", "c"];
  const table = dataTable([
    { key: "t", label: "<i>t</i> [min]" },
    { key: "T0", label: "<i>T</i>₁ [°C]" },
    { key: "T1", label: "<i>T</i>₂ [°C]" },
    { key: "T2", label: "<i>T</i>₃ [°C]" },
  ], { empty: "Še ni meritev. Nalij čaj; meritve se zapisujejo vsako minuto." });
  const graph = dataGraph({ x: [0, 60], y: [20, 100], xStep: 10, yStep: 10, xLabel: "t [min]", yLabel: "T [°C]", title: "Ohlajanje čaja v treh posodah", origin: false });
  const qBox = h("div");
  const meas = [[], [], []];
  const auto = { on: true, every: 60, next: 60 };
  let speed = 60, asked = false;
  const opts = [["", "brez posode"], ...Object.entries(SKODELICE).map(([k, x]) => [k, x.name])];
  const sels = [0, 1, 2].map((i) => select({ label: `posoda ${i + 1}`, options: opts, value: B.vrste[i], onChange: (v) => ((B.vrste[i] = v || null), draw()) }));
  const pourBtn = button(`Nalij čaj (${CAJ.T} °C, ${CAJ.m * 1000} g)`, () => pour(), "primary small");
  const recBtn = button("Zapiši meritev", () => record(false));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, ...thL, swL)), controlsBox(
        grp("1. Posode", hint("Izberi tri posode. V vsako naliješ enako čaja, posode imajo sobno temperaturo (20 °C)."), ...sels, buttons(pourBtn)),
        grp("2. Merjenje", hitrostSeg([10, 60, 300], 60, (v) => (speed = v)), buttons(recBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "Ohlajanje"), graph, qBox,
      notes(POENOSTAVITVE_TOPLOTA.ohlajanje, "Newtonov zakon ohlajanja: toplotni tok je sorazmeren z razliko temperatur, <i>P</i> = <i>G</i> (<i>T</i> − <i>T</i><sub>sobe</sub>). Porcelan ~1,1 kJ/(kg·K), k ≈ 1,5 W/(m·K); stiropor k = 0,035 W/(m·K) (EN 13163); izhlapevanje po analogiji Chilton–Colburn. Ocene: mase in stene posod, prestop toplote, termovka."),
    ],
    tryText: "Nalij čaj v porcelansko skodelico s pokrovčkom in brez njega ter v termovko. Napovej, v kateri bo čez pol ure najtoplejši. Zakaj se čaj na začetku ohlaja hitreje kot pozneje? Kaj naredi pokrovček?",
  });
  el.classList.add("lab");

  function pour() {
    if (!B.vrste.some(Boolean)) return log.push("Izberi vsaj eno posodo.", "warn");
    B.nalij();
    B.cups.forEach((c, i) => c && (B.th[i].Tp = c.T)); // sonda je takoj v čaju: zapis pri t = 0 ni prazen (sicer NaN, »1 izven grafa«)
    meas.forEach((m) => (m.length = 0));
    table.clear();
    auto.next = auto.every;
    record(true);
    log.push("Čaj je v posodah. Štoparica teče.", "info");
    draw();
  }
  function record(isAuto) {
    if (!B.cups) return log.push("Najprej nalij čaj.", "warn");
    const r = [0, 1, 2].map((i) => B.readT(i));
    r.forEach((x, i) => x && meas[i].push([B.t / 60, x.value]));
    table.add({ t: isAuto ? String(Math.round(B.t / 60)) : fixed(B.t / 60, 1), T0: r[0] ? fixed(r[0].value, 1) : "–", T1: r[1] ? fixed(r[1].value, 1) : "–", T2: r[2] ? fixed(r[2].value, 1) : "–" }, { quiet: isAuto });
    redraw();
    if (B.t >= 20 * 60 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Zakaj se čaj v zaprti termovki skoraj ne ohladi, v odprti skodelici pa hitro?",
        options: [
          { t: "Med stenama termovke je vakuum (ni prevajanja in konvekcije), svetleča stena slabo seva, zamašek pa prepreči izhlapevanje.", ok: true, why: "Čaj oddaja toploto s prevajanjem skozi steno, s konvekcijo zraka, s sevanjem in z izhlapevanjem z gladine. Termovka zavira vse štiri poti. Odprta skodelica največ izgubi z izhlapevanjem: zato tudi pokrovček veliko pomaga. Bolj ko je čaj topel, hitreje se ohlaja (Newtonov zakon), zato je krivulja na začetku strma." },
          { t: "Termovka je iz kovine, ki dobro prevaja toploto in jo vrača čaju.", ok: false, why: "Dober prevodnik toploto odvaja, ne vrača. Termovka deluje, ker med notranjo in zunanjo steno ni snovi, ki bi prevajala." },
          { t: "V termovki je manj čaja.", ok: false, why: "V vseh posodah je 200 g čaja. Razlika je v tem, kako hitro posoda prepušča toploto v okolico." },
          { t: "Porcelan toploto ustvarja, termovka pa ne.", ok: false, why: "Posoda toplote ne ustvarja. Porcelan na začetku čaju toploto vzame (skodelica se segreje), zato se čaj v težki skodelici v prvi minuti ohladi za ~15 °C." },
        ],
      }));
    }
  }
  function redraw() {
    const tMax = Math.max(60, Math.ceil(B.t / 60 / 30) * 30);
    graph.setAxes({ x: [0, tMax], xStep: tMax > 120 ? 30 : 10 });
    graph.draw(meas.map((pts, i) => (B.cups?.[i] ? { id: `c${i}`, pts: [...pts], cls: CLS[i], shape: i === 1 ? "^" : "o", label: `${i + 1}: ${SKODELICE[B.vrste[i]].name}` } : null)).filter(Boolean));
  }
  ura0(el, B, {
    speed: () => speed, auto, running: () => B.teče, record,
    tick: () => {
      thL.forEach((L, i) => {
        const r = B.readT(i);
        L.set(r ? r.text : "", "°C", B.vrste[i] ? SKODELICE[B.vrste[i]].name : "brez posode");
      });
      swL.set(B.teče ? ura(B.t) : "", "", B.teče ? "od nalivanja" : "nalij čaj");
      if (B.teče) redraw();
      draw();
    },
  });

  // ---------------------------------------------------------------- risba: tri posode (1 cm = 9 px)
  function cup(xc, vrsta, c, i) {
    const yB = 196;
    label(svg, xc, yB + 16, `${i + 1}`, "lbl small");
    if (!vrsta) return void s("rect", { x: xc - 30, y: yB - 60, width: 60, height: 60, rx: 6, class: "lab-socket" }, svg);
    const S = SKODELICE[vrsta], P = POSODE[S.posoda], wd = P.d * 900;
    const x0 = xc - wd / 2, x1 = xc + wd / 2;
    const tall = S.posoda === "termovka" ? 130 : S.posoda === "stiropor" ? 92 : 80;
    const yT = yB - tall;
    const T = c ? c.T : 20, H = c ? Math.min(tall - 8, geometrija(P, c.m).H * 900) : 0;
    if (S.posoda === "termovka") {
      s("rect", { x: x0 - 7, y: yT, width: wd + 14, height: tall, rx: 10, class: "lab-top-thermos" }, svg);
      if (c && !S.pokrov) s("ellipse", { cx: xc, cy: yT + 6, rx: wd / 2 - 2, ry: 4, class: "lab-top-tea" }, svg);
      if (S.pokrov) s("rect", { x: xc - wd / 2 + 4, y: yT - 14, width: wd - 8, height: 16, rx: 3, class: "lab-top-stopper" }, svg);
    } else {
      if (S.posoda === "porcelan" || S.posoda === "kovina") s("path", { d: `M${x1},${yT + 18} q22,4 0,40`, class: S.posoda === "kovina" ? "lab-top-enamel-h" : "lab-top-porc-h" }, svg);
      if (c) s("rect", { x: x0 + 3, y: yB - H, width: wd - 6, height: H - 3, fill: barva(T), class: "lab-top-tea-in" }, svg);
      const path = S.posoda === "stiropor" ? `M${x0 - 6},${yT} L${x0 + 2},${yB} H${x1 - 2} L${x1 + 6},${yT} Z` : `M${x0},${yT} V${yB - 8} Q${x0},${yB} ${x0 + 8},${yB} H${x1 - 8} Q${x1},${yB} ${x1},${yB - 8} V${yT} Z`;
      s("path", { d: path, class: { porcelan: "lab-top-porc", kovina: "lab-top-enamel", stiropor: "lab-top-foam" }[S.posoda] }, svg);
      if (c) s("rect", { x: x0 + 4, y: yB - H, width: wd - 8, height: 4, class: "lab-top-tea" }, svg);
      if (S.pokrov) s("rect", { x: x0 - 8, y: yT - 7, width: wd + 16, height: 7, rx: 3, class: S.posoda === "stiropor" ? "lab-top-foam" : "lab-top-porc" }, svg);
    }
    if (c) sonda(svg, x0 + 12, yT - 34, yB - 14);
    if (c && !S.pokrov && T > 40) para(svg, xc + 6, yT - 4, (T - 40) / 60);
  }
  function draw() {
    svg.replaceChildren();
    s("line", { x1: 0, y1: 197, x2: W, y2: 197, class: "lab-tit-bench" }, svg);
    [70, 200, 330].forEach((x, i) => cup(x, B.vrste[i], B.cups?.[i], i));
    merilo(svg, 360, 226, 18, "2 cm");
    svg.setAttribute("aria-label", `Tri posode s čajem: ${B.vrste.map((k, i) => `${i + 1} ${k ? SKODELICE[k].name : "brez posode"}`).join(", ")}.`);
  }
  redraw();
  draw();
}
