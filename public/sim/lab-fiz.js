// Virtualni laboratorij, fizika. Učenec sam sestavi poskus, meri in vidi posledice napak.
import { h, s, fmt, svgBox, slider, select, segmented, button, layout, label } from "./kit.js";
import { ticker, lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed, tex, rez } from "./lab.js";
import { OhmBench, LOADS, AM_RANGES, VM_RANGES, NAPAJALNIK, UPOR, POENOSTAVITVE, fitOrigin } from "./lab-model.js";

// Barvne oznake uporov (4 obročki: dve števki, množitelj, toleranca ±5 % = zlata).
export const BANDS = { R47: ["#f2c500", "#8e44ad", "#000", "#c9a227"], R100: ["#7b4a12", "#000", "#7b4a12", "#c9a227"], R220: ["#d62728", "#d62728", "#7b4a12", "#c9a227"], R470: ["#f2c500", "#8e44ad", "#7b4a12", "#c9a227"] };
// Stalna os toka za vsak porabnik: največji tok pri 12 V, zaokrožen navzgor.
const YMAX = { R47: 300, R100: 150, R220: 75, R470: 30, L6: 150 };
const POS = [["zaporedno", "zaporedno"], ["vzporedno", "vzporedno"], ["brez", "odklopljen"]];

// Ohmov zakon: napajalnik, upornik ali žarnica, ampermeter in voltmeter.
export function labOhm(el, { load = "R100" } = {}) {
  const B = new OhmBench({ seed: (Math.random() * 2 ** 31) | 0 });
  B.load = load in LOADS ? load : "R100";
  const svg = svgBox(400, 250, "lab-circuit");
  svg.setAttribute("aria-label", "Električni krog");
  const log = eventLog();
  const sup = lcd("napajalnik"), am = lcd("ampermeter"), vm = lcd("voltmeter");
  const meters = h("div", { class: "lab-meters" }, sup, am, vm);
  const table = dataTable([
    { key: "p", label: "porabnik" },
    { key: "U", label: "<i>U</i> [V]" },
    { key: "I", label: "<i>I</i> [mA]" },
    { key: "R", label: "<i>U</i>/<i>I</i> [Ω]" },
  ]);
  const graph = dataGraph({ x: [0, 12], y: [0, YMAX[B.load]], xStep: 2, xLabel: "U [V]", yLabel: "I [mA]", title: "Graf toka v odvisnosti od napetosti" });
  const fitOut = h("p", { class: "lab-fitout", "aria-live": "polite" });
  const qBox = h("div");
  const series = {}; // id porabnika → [[U, I_mA]]
  const asked = new Set();
  let last = { U: null, I: null };

  const uSl = slider({ label: "napetost napajalnika", min: 0, max: NAPAJALNIK.max, step: 0.1, value: 0, unit: "V", onInput: (v) => (B.U0 = v) });
  const loadSel = select({ label: "porabnik", options: Object.entries(LOADS).map(([k, L]) => [k, L.name]), value: B.load, onChange: (v) => ((B.load = v), graph.setAxes({ y: [0, YMAX[v]] }), redrawGraph(), refresh()) });
  // po vsaki spremembi vezja takoj nov odčitek, da »Zapiši meritev« ne zapiše vrednosti prejšnjega vezja
  const refresh = () => (B.solve(), readMeters(), draw());
  const amSeg = segmented({ options: POS, value: B.amPos, onChange: (v) => ((B.amPos = v), refresh()) });
  const vmSeg = segmented({ options: POS, value: B.vmPos, onChange: (v) => ((B.vmPos = v), refresh()) });
  amSeg.setAttribute("aria-label", "ampermeter priključi");
  vmSeg.setAttribute("aria-label", "voltmeter priključi");
  const amRange = select({ label: "območje ampermetra", options: [["20m", "20 mA"], ["200m", "200 mA"], ["10", "10 A (drug priključek)"]], value: B.amRange, onChange: (v) => ((B.amRange = v), refresh()) });
  const vmRange = select({ label: "območje voltmetra", options: [["2", "2 V"], ["20", "20 V"], ["200", "200 V"]], value: B.vmRange, onChange: (v) => ((B.vmRange = v), refresh()) });
  const rec = button("Zapiši meritev", () => record(), "primary small");
  const fuseBtn = button("Zamenjaj varovalko v ampermetru", () => (B.replaceFuse(), log.push("Nova varovalka je v ampermetru.", "ok"), refresh()));
  const partBtn = button("Vzemi nov porabnik", () => (B.replacePart(), log.push(`${LOADS[B.load].type === "R" ? "Nov" : "Nova"} ${LOADS[B.load].name}.`, "ok"), refresh()));
  const clearBtn = button("Izbriši meritve", () => (table.clear(), Object.keys(series).forEach((k) => delete series[k]), redrawGraph()));
  const row = (lab, ...kids) => h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, lab), ...kids);

  layout(el, {
    stage: [svg, meters],
    controls: [uSl, loadSel, row("ampermeter", amSeg), amRange, row("voltmeter", vmSeg), vmRange, h("div", { class: "demo-buttons" }, rec, fuseBtn, partBtn, clearBtn)],
    extra: [log, h("h4", { class: "lab-h" }, "Meritve"), table, graph, fitOut, qBox, notes(POENOSTAVITVE.ohm, `Ohmov zakon ${tex(String.raw`I = \frac{U}{R}`)}. Natančnost merilnikov: navodila šolskega multimetra s 3½ mesta. Varovalke: IEC 60127-2 (hitre, F). Žarnica: moč ∝ <i>U</i><sup>1,6</sup>.`)],
    tryText: "Napovej, kolikšen tok teče skozi upornik 100 Ω pri 6 V. Izmeri tok pri vsaj petih napetostih in iz naklona grafa določi upor. Potem priključi žarnico: ali je tudi njen graf premica? Kaj se zgodi, če ampermeter priključiš vzporedno?",
  });
  el.classList.add("lab");

  function record() {
    const p = B.load;
    const Uv = last.U, Ir = last.I;
    const Ushow = Uv == null ? "–" : Uv.over ? "OL" : fixed(Uv.value, VM_RANGES[B.vmRange].dec);
    let ImA = null, Ishow = "–";
    if (Ir && !Ir.over) {
      const r = AM_RANGES[B.amRange];
      ImA = Ir.value * (r.unit === "A" ? 1000 : 1);
      Ishow = fixed(ImA, Math.max(0, r.dec - (r.unit === "A" ? 3 : 0)));
    } else if (Ir?.over) Ishow = "OL";
    const ok = Uv && !Uv.over && ImA != null;
    const R = ok && Math.abs(ImA) > 1e-9 ? fixed((Uv.value / ImA) * 1000, (Uv.value / ImA) * 1000 >= 100 ? 0 : 1) : "–";
    table.add({ p: LOADS[p].name.replace("upornik ", "").replace(" / 0,1 A", ""), U: Ushow, I: Ishow, R });
    if (ok) (series[p] ||= []).push([Uv.value, ImA]);
    else log.push("Ta meritev ni popolna: za graf potrebuješ odčitek obeh merilnikov.", "warn");
    redrawGraph();
    maybeAsk(p);
  }
  function redrawGraph() {
    const cur = B.load;
    const list = Object.entries(series).map(([id, pts]) => {
      const k = LOADS[id].type === "R" && pts.length >= 3 ? fitOrigin(pts) : NaN;
      return { id, pts, shape: LOADS[id].type === "L" ? "^" : "o", cls: id === cur ? "a" : "b", label: LOADS[id].name, line: Number.isFinite(k) ? (x) => k * x : null, k };
    });
    graph.draw(list);
    const fit = list.find((S) => S.id === cur && Number.isFinite(S.k));
    fitOut.innerHTML = fit
      ? `Črtkana premica skozi izhodišče se tvojim točkam najbolje prilega. Naklon: ${fmt(fit.k, 2)} mA/V = ${fmt(fit.k / 1000, 5)} A/V, zato ${tex(String.raw`R = \frac{1}{\text{naklon}} = ${rez(fmt(1000 / fit.k, 1), "Ω")}`)}. Na uporniku piše ${LOADS[cur].nom} Ω ± 5 %.`
      : LOADS[cur].type === "R" ? "Za premico in upor iz naklona potrebuješ vsaj 3 meritve." : `Žarnica: primerjaj ${tex(String.raw`\frac{U}{I}`)} pri različnih napetostih.`;
  }
  function maybeAsk(p) {
    const pts = series[p] || [];
    const type = LOADS[p].type;
    if (asked.has(type) || pts.length < 4 || Math.max(...pts.map((q) => q[0])) < 4) return;
    asked.add(type);
    qBox.append(
      type === "R"
        ? conclusion({
            text: "Kaj kažejo tvoje meritve za upornik?",
            options: [
              { t: "Točke ležijo na premici skozi izhodišče: tok je premo sorazmeren z napetostjo, upor je stalen.", ok: true, why: "To je Ohmov zakon. Majhna odstopanja od premice so merilne napake (zadnje mesto merilnika, napaka umeritve)." },
              { t: "Tok narašča vedno počasneje, ker se upor veča.", ok: false, why: `Pri uporniku ${tex(String.raw`\frac{U}{I}`)} ostaja skoraj enak. Tako se obnaša žarnica, ker se nitka segreje.` },
              { t: "Tok je od napetosti neodvisen.", ok: false, why: "Poglej tabelo: ko podvojiš napetost, se podvoji tudi tok." },
            ],
          })
        : conclusion({
            text: "Kaj kažejo tvoje meritve za žarnico?",
            options: [
              { t: "Graf se ukrivi navzdol: z napetostjo se upor žarnice veča, ker se nitka segreje.", ok: true, why: "Upor kovine raste s temperaturo; volframova nitka pri svetenju doseže okoli 2000 °C in ima ~10-krat večji upor kot hladna." },
              { t: "Graf je premica skozi izhodišče, tako kot pri uporniku.", ok: false, why: `Primerjaj ${tex(String.raw`\frac{U}{I}`)} pri 2 V in pri 6 V: ni enak, zato upor žarnice ni stalen in njen graf ni premica.` },
              { t: "Tok pada, ko napetost raste.", ok: false, why: "Tok še vedno narašča, a počasneje kot napetost." },
            ],
          }),
    );
  }

  const say = {
    vroc: (e) => [`Upornik se greje: moč ${fmt(e.P, 2)} W je večja od dovoljene ${fmt(UPOR.P, 2)} W.`, "warn"],
    zgorel: () => ["Upornik je zgorel (dim, zoglenela prevleka). Krog je prekinjen. Preveč moči: <i>P</i> = <i>U</i>·<i>I</i>.", "bad"],
    nitka: () => ["Nitka žarnice se je pretrgala: napetost je bila precej večja od nazivnih 6 V.", "bad"],
    varovalka: (e) => [`Pok! V ampermetru je pregorela varovalka (tok ${fmt(Math.abs(e.I), 2)} A). Ampermeter zdaj ne meri toka. Ampermeter ima zelo majhen upor, zato ga vedno veži zaporedno.`, "bad"],
    cc: () => ["Napajalnik je omejil tok na 1 A in znižal napetost (lučka CC). Je v krogu kratek stik?", "warn"],
  };
  let nEv = 0;
  let readT = 0;
  const tick = (dt) => {
    B.step(dt);
    while (nEv < B.events.length) {
      const e = B.events[nEv++];
      const [t, k] = say[e.type](e);
      log.push(t, k);
    }
    readT += dt;
    if (readT >= 0.4) (readT = 0), readMeters();
    draw();
  };
  function readMeters() {
    const st = B.state;
    sup.set(Math.max(0, st.Usup).toFixed(1), "V", st.cc ? "CC: omejitev toka" : `nastavljeno ${fmt(B.U0, 1)}\u00a0V`);
    last.I = B.readA();
    last.U = B.readV();
    const ar = AM_RANGES[B.amRange], vr = VM_RANGES[B.vmRange];
    if (last.I) am.set(last.I.text, last.I.over ? "" : ar.unit, `območje ${ar.max * ar.k}\u00a0${ar.unit}`);
    else am.set("", "", "ni priključen");
    if (last.U) vm.set(last.U.text, last.U.over ? "" : "V", `območje ${vr.max}\u00a0V`);
    else vm.set("", "", "ni priključen");
  }

  // ---------------------------------------------------------------- risanje kroga
  const X0 = 50, X1 = 300, Y0 = 40, Y1 = 210, YC = 125;
  const meter = (x, y, letter, kind) => drawMeter(svg, x, y, letter, kind === "A" && B.fuseOf().blown);
  function draw() {
    svg.replaceChildren();
    const wire = (d) => s("path", { d, class: "lab-wire" }, svg);
    const dot = (x, y) => s("circle", { cx: x, cy: y, r: 3.5, class: "lab-node" }, svg);
    // zanka
    wire(`M${X0},${YC - 40} V${Y0} H${X1} V${Y1} H${X0} V${YC + 40}`);
    // napajalnik
    s("rect", { x: X0 - 30, y: YC - 40, width: 60, height: 80, rx: 6, class: "lab-box" }, svg);
    label(svg, X0, YC - 22, "+", "lbl");
    label(svg, X0, YC + 24, "−", "lbl");
    s("text", { x: X0, y: YC + 2, class: "tick", "text-anchor": "middle", "dominant-baseline": "middle" }, svg, "0–12 V");
    s("circle", { cx: X0 + 18, cy: YC - 30, r: 4, class: B.state.cc ? "fill-danger" : "lab-led-off" }, svg);
    // zaporedni merilniki na zgornji žici
    const ser = [["A", B.amPos], ["V", B.vmPos]].filter(([, p]) => p === "zaporedno").map(([k]) => k);
    const sx = ser.length === 2 ? [130, 200] : [165];
    ser.forEach((k, i) => meter(sx[i], Y0, k, k));
    // vzporedni merilniki
    const par = [["V", B.vmPos], ["A", B.amPos]].filter(([, p]) => p === "vzporedno").map(([k]) => k);
    par.forEach((k, i) => {
      const x = i === 0 ? 362 : 215;
      if (x > X1) wire(`M${X1},${Y0} H${x} V${Y1} H${X1}`), dot(X1, Y0), dot(X1, Y1);
      else wire(`M${x},${Y0} V${Y1}`), dot(x, Y0), dot(x, Y1);
      meter(x, YC, k, k);
    });
    // porabnik
    const L = LOADS[B.load], p = B.part;
    if (L.type === "R") {
      drawResistor(svg, X1, YC, B.load, p);
      label(svg, X1 - 18, YC, `${L.nom} Ω`, "lbl small", "end");
      if (p.burnt) label(svg, X1 - 18, YC + 18, "zgorel", "lbl small", "end");
      else if (p.T > 90) label(svg, X1 - 18, YC + 18, "vroč!", "lbl small", "end");
    } else {
      drawLamp(svg, X1, YC, B.brightness(), p.burnt);
      label(svg, X1 - 22, YC, "6 V", "lbl small", "end");
      if (p.burnt) label(svg, X1, YC + 36, "pregorela", "lbl small");
    }
    fuseBtn.hidden = !B.fuseOf().blown;
    partBtn.hidden = !p.burnt;
    partBtn.textContent = L.type === "R" ? "Vzemi nov upornik" : "Vzemi novo žarnico";
  }


  graph.setAxes({ y: [0, YMAX[B.load]] });
  redrawGraph();
  readMeters();
  draw();
  ticker(el, tick, 100);
}

// ---------------------------------------------------------------- deli kroga (tudi lab-elektrika.js)
// Merilnik: krog s črko; pregorela varovalka je prečrtana.
export function drawMeter(svg, x, y, letter, blown = false) {
  const g = s("g", { class: "lab-meter" }, svg);
  s("circle", { cx: x, cy: y, r: 17, class: "lab-meter-body" }, g);
  s("text", { x, y: y + 1, class: "lbl", "text-anchor": "middle", "dominant-baseline": "middle" }, g, letter);
  if (blown) s("path", { d: `M${x - 9},${y + 11} l18,-22`, class: "lab-broken" }, g);
  return g;
}
// Upornik z barvnimi obročki (20 × 60, pokončen ali ležeč), rdeč, ko je vroč; zgorel je črn in se kadi.
export function drawResistor(svg, x, y, id, part, { horiz = false } = {}) {
  const g = s("g", horiz ? { transform: `rotate(-90 ${x} ${y})` } : {}, svg);
  s("rect", { x: x - 10, y: y - 30, width: 20, height: 60, rx: 7, class: part.burnt ? "lab-burnt" : "lab-res" }, g);
  if (!part.burnt) BANDS[id]?.forEach((c, i) => s("rect", { x: x - 10, y: y - 20 + i * 10 + (i === 3 ? 6 : 0), width: 20, height: 5, fill: c }, g));
  if (!part.burnt && part.T > 40) s("rect", { x: x - 10, y: y - 30, width: 20, height: 60, rx: 7, class: "fill-danger", opacity: Math.min(0.7, (part.T - 40) / 300) }, g);
  if (part.burnt) drawSmoke(svg, x, y - (horiz ? 14 : 34));
  return g;
}
// Žarnica: sij raste s svetlostjo b (1 = nazivna); pregorela ima pretrgano nitko.
export function drawLamp(svg, x, y, b, burnt, r = 16) {
  if (b > 0.01) s("circle", { cx: x, cy: y, r: r + 2 + 22 * Math.min(1, b), class: "lab-glow", opacity: Math.min(0.85, 0.15 + 0.6 * b) }, svg);
  s("circle", { cx: x, cy: y, r, class: "lab-bulb" }, svg);
  const k = r * 0.69;
  s("path", { d: burnt ? `M${x - k},${y - k} l7,7 M${x + k},${y + k} l-7,-7 M${x + k},${y - k} l${-2 * k},${2 * k}` : `M${x - k},${y - k} l${2 * k},${2 * k} M${x + k},${y - k} l${-2 * k},${2 * k}`, class: b > 0.02 && !burnt ? "lab-filament lab-fil-hot" : "lab-filament" }, svg);
}
export function drawSmoke(svg, x, y) {
  for (let i = 0; i < 3; i++) s("circle", { cx: x + (i - 1) * 7, cy: y - i * 9, r: 5 + i * 2, class: "lab-smoke", style: `animation-delay:${i * 0.4}s` }, svg);
}
