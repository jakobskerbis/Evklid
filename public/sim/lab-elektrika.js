// Virtualni laboratorij, elektrika: zaporedna in vzporedna vezava (lab-vezava), prevodnost snovi (lab-prevodnost).
// Modeli: lab-model-elektrika.js. Deli kroga (merilnik, upornik, žarnica) so isti kot pri Ohmovem zakonu (lab-fiz.js).
import { h, s, fmt, svgBox, slider, select, segmented, button, toggle, layout, label, stage as stageBox, controls as controlsBox } from "./kit.js";
import { ticker, lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed, tex, rez } from "./lab.js";
import { drawMeter, drawResistor, drawLamp } from "./lab-fiz.js";
import { AM_RANGES, VM_RANGES, NAPAJALNIK, UPOR, makeMeter, meterRead, fuseRate, rng } from "./lab-model.js";
import { VezBench, VEZ_DELI, MATERIALI, tester, POENOSTAVITVE_ELEKTRIKA } from "./lab-model-elektrika.js";

const grp = (title, ...kids) => h("fieldset", { class: "lab-tit-grp" }, h("legend", {}, title), ...kids);
const buttons = (...k) => h("div", { class: "demo-buttons" }, ...k);
const row = (lab, ...kids) => h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, lab), ...kids);
const SUB = ["₁", "₂", "₃"];
const short = (k) => (VEZ_DELI[k].type === "R" ? `${VEZ_DELI[k].nom} Ω` : { L6: "žarnica", zica: "žica", prazno: "prazno" }[k]);

// ================================================================ zaporedna in vzporedna vezava
export function labVezava(el) {
  const B = new VezBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const W = 440, H = 284;
  const svg = svgBox(W, H, "lab-circuit lab-vez");
  const log = eventLog();
  const sup = lcd("napajalnik"), am = lcd("ampermeter"), vm = lcd("voltmeter");
  const table = dataTable([
    { key: "vez", label: "vezje" },
    { key: "am", label: "ampermeter" },
    { key: "I", label: "<i>I</i> [mA]" },
    { key: "vm", label: "voltmeter" },
    { key: "U", label: "<i>U</i> [V]" },
  ]);
  const summary = h("div", { class: "lab-vez-sum", "aria-live": "polite" });
  const graph = dataGraph({ x: [0, 1500], y: [0, 1500], xStep: 250, yStep: 250, xLabel: "izračunani R [Ω]", yLabel: "izmerjeni U/I [Ω]", title: "Izmerjena skupna upornost v odvisnosti od izračunane" });
  const qBox = h("div");
  const asked = new Set();
  const sets = new Map(); // podpis vezja → { I: {glavni, 1, 2, 3}, U: {…} }
  const rPts = new Map(); // podpis vezja → [R izračunani, R izmerjeni]
  const lampsSeen = new Set();
  let last = { U: null, I: null };

  const refresh = () => (B.solve(), readMeters(), draw(), sync());
  const vezSeg = segmented({ options: [["zaporedno", "zaporedna"], ["vzporedno", "vzporedna"], ["mesano", "mešana"]], value: B.vez, onChange: (v) => ((B.vez = v), refresh()) });
  vezSeg.setAttribute("aria-label", "vezava");
  const nSeg = segmented({ options: [["2", "2"], ["3", "3"]], value: "2", onChange: (v) => ((B.n = +v), refresh()) });
  nSeg.setAttribute("aria-label", "število elementov");
  const nRow = row("elementov", nSeg);
  const opts = Object.entries(VEZ_DELI).map(([k, L]) => [k, L.name]);
  const slotSel = [0, 1, 2].map((i) => select({ label: `element ${i + 1}`, options: opts, value: B.kinds[i], onChange: (v) => (B.setKind(i, v), refresh()) }));
  const uSl = slider({ label: "napetost napajalnika", min: 0, max: NAPAJALNIK.max, step: 0.1, value: 0, unit: "V", onInput: (v) => (B.U0 = v) });
  const POS = [["zaporedno", "zaporedno"], ["vzporedno", "vzporedno"], ["brez", "odklopljen"]];
  const AT = [["glavni", "pri napajalniku"], ["1", "1"], ["2", "2"], ["3", "3"]];
  const meterCtl = (m, name) => {
    const pos = segmented({ options: POS, value: m.pos, onChange: (v) => ((m.pos = v), refresh()) });
    const at = segmented({ options: AT, value: m.at, onChange: (v) => ((m.at = v), refresh()) });
    pos.setAttribute("aria-label", `${name}: kako je priključen`);
    at.setAttribute("aria-label", `${name}: pri katerem elementu`);
    return { pos, at };
  };
  const amC = meterCtl(B.am, "ampermeter"), vmC = meterCtl(B.vm, "voltmeter");
  const amRange = select({ label: "območje ampermetra", options: [["20m", "20 mA"], ["200m", "200 mA"], ["10", "10 A (drug priključek)"]], value: B.amRange, onChange: (v) => ((B.amRange = v), refresh()) });
  const vmRange = select({ label: "območje voltmetra", options: [["2", "2 V"], ["20", "20 V"], ["200", "200 V"]], value: B.vmRange, onChange: (v) => ((B.vmRange = v), refresh()) });
  const rec = button("Zapiši meritev", () => record(), "primary small");
  const fuseBtn = button("Zamenjaj varovalko v ampermetru", () => (B.replaceFuse(), log.push("Nova varovalka je v ampermetru.", "ok"), refresh()));
  const partBtn = button("Zamenjaj pokvarjene dele", () => (B.replaceBurnt(), log.push("V vezju so novi deli.", "ok"), refresh()));
  const clearBtn = button("Izbriši meritve", () => (table.clear(), sets.clear(), rPts.clear(), sync(), redrawGraph()));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, sup, am, vm)), controlsBox(
        grp("1. Sestavi vezje", row("vezava", vezSeg), nRow, ...slotSel),
        grp("2. Merilnika", h("p", { class: "lab-tit-hint" }, "»Pri napajalniku« zaporedno pomeni v glavnem vodu, vzporedno pa na sponkah napajalnika. Številka je element v vezju."),
          row("ampermeter", amC.pos), row("kje", amC.at), amRange, row("voltmeter", vmC.pos), row("kje", vmC.at), vmRange),
        grp("3. Meri", uSl, buttons(rec, fuseBtn, partBtn, clearBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table, summary,
      h("h4", { class: "lab-h" }, "Skupna upornost"), graph, qBox,
      notes(POENOSTAVITVE_ELEKTRIKA.vezava, "Zaporedno: <i>I</i> je povsod enak, <i>U</i> = <i>U</i>₁ + <i>U</i>₂, <i>R</i> = <i>R</i>₁ + <i>R</i>₂. Vzporedno: <i>U</i> je na vseh vejah enak, <i>I</i> = <i>I</i>₁ + <i>I</i>₂, 1/<i>R</i> = 1/<i>R</i>₁ + 1/<i>R</i>₂ (Kirchhoffova zakona). Upori ±5 %, 0,5 W; žarnica 6 V / 0,1 A; natančnost merilnikov iz navodil šolskega multimetra s 3½ mesta; varovalke IEC 60127-2 (F)."),
    ],
    tryText: "Veži dva upornika zaporedno in izmeri napetost na vsakem in na napajalniku. Kaj opaziš? Nato ju veži vzporedno in izmeri tok v vsaki veji in v glavnem vodu. Z dvema žarnicama primerjaj svetlost pri zaporedni in vzporedni vezavi, potem eno odvij (»prazno podnožje«). Kaj se zgodi z drugo?",
  });
  el.classList.add("lab");

  // ---------------------------------------------------------------- meritve
  const sig = () => `${B.vez}|${B.count}|${B.kinds.slice(0, B.count).join(",")}|${fixed(B.U0, 1)}`;
  const vezName = () => `${{ zaporedno: "zap.", vzporedno: "vzp.", mesano: "meš." }[B.vez]} ${B.kinds.slice(0, B.count).map(short).join(", ")}`;
  const where = (m, kind) => {
    if (m.pos === "brez" || (m.at !== "glavni" && +m.at > B.count)) return "–";
    if (kind === "A") return m.pos === "zaporedno" ? (m.at === "glavni" ? "glavni vod" : `veja ${m.at}`) : m.at === "glavni" ? "na napajalniku (!)" : `vzporedno z ${m.at} (!)`;
    return m.pos === "vzporedno" ? (m.at === "glavni" ? "napajalnik" : `element ${m.at}`) : "zaporedno (!)";
  };
  function record() {
    const Ir = last.I, Uv = last.U;
    let Ishow = "–", Ival = null;
    if (Ir?.over) Ishow = "OL";
    else if (Ir) {
      const r = AM_RANGES[B.amRange];
      Ival = Ir.value * (r.unit === "A" ? 1000 : 1);
      Ishow = fixed(Ival, Math.max(0, r.dec - (r.unit === "A" ? 3 : 0)));
    }
    const Ushow = Uv == null ? "–" : Uv.over ? "OL" : fixed(Uv.value, VM_RANGES[B.vmRange].dec);
    table.add({ vez: vezName(), am: where(B.am, "A"), I: Ishow, vm: where(B.vm, "V"), U: Ushow });
    if (!Ir && !Uv) return log.push("Noben merilnik ni priključen: priključi ampermeter ali voltmeter.", "warn");
    if (B.am.pos === "vzporedno" || B.vm.pos === "zaporedno") log.push("Ta meritev ni pravilna: ampermeter veži zaporedno, voltmeter vzporedno.", "warn");
    const k = sig();
    const set = sets.get(k) || { I: {}, U: {} };
    sets.set(k, set);
    if (Ival != null && B.am.pos === "zaporedno" && (B.am.at === "glavni" || +B.am.at <= B.count)) set.I[B.am.at] = Ival;
    if (Uv && !Uv.over && B.vm.pos === "vzporedno" && (B.vm.at === "glavni" || +B.vm.at <= B.count) && B.am.pos !== "vzporedno") set.U[B.vm.at] = Uv.value;
    // skupna upornost: napetost napajalnika in tok v glavnem vodu, samo pri samih upornikih
    const Rn = B.nominalTotal();
    if (set.I.glavni > 0 && set.U.glavni != null && Number.isFinite(Rn)) rPts.set(k, [Rn, (set.U.glavni / set.I.glavni) * 1000]);
    sync();
    redrawGraph();
    maybeAsk(set);
  }
  // Povzetek meritev za trenutno vezje: vsote tokov in napetosti (Kirchhoff) in skupna upornost.
  function sync() {
    const set = sets.get(sig());
    const c = B.count, ids = ["1", "2", "3"].slice(0, c);
    const mA = (x) => `${fixed(x, x >= 20 ? 1 : 2)} mA`, V = (x) => `${fixed(x, 2)} V`;
    if (!set || (!Object.keys(set.I).length && !Object.keys(set.U).length)) {
      summary.innerHTML = `<p class="muted">Za to vezje še ni meritev. Izmeri tok v glavnem vodu in v vejah ter napetost na napajalniku in na vsakem elementu.</p>`;
      return;
    }
    const li = [];
    const list = (o, sym, f) => ["glavni", ...ids].filter((k) => o[k] != null).map((k) => `<i>${sym}</i>${k === "glavni" ? "" : SUB[k - 1]} = ${f(o[k])}`).join(", ");
    if (Object.keys(set.I).length) li.push(`Tokovi: ${list(set.I, "I", mA)}`);
    if (Object.keys(set.U).length) li.push(`Napetosti: ${list(set.U, "U", V)}`);
    const has = (o, ks) => ks.every((k) => o[k] != null);
    const sum = (o, ks) => ks.reduce((a, k) => a + o[k], 0);
    const plus = (sym, ks) => ks.map((k) => `<i>${sym}</i>${SUB[k - 1]}`).join(" + ");
    if (B.vez === "zaporedno" && has(set.U, ["glavni", ...ids])) li.push(`${plus("U", ids)} = <b>${V(sum(set.U, ids))}</b>, <i>U</i> = <b>${V(set.U.glavni)}</b>`);
    if (B.vez === "vzporedno" && has(set.I, ["glavni", ...ids])) li.push(`${plus("I", ids)} = <b>${mA(sum(set.I, ids))}</b>, <i>I</i> = <b>${mA(set.I.glavni)}</b>`);
    if (B.vez === "mesano") {
      if (has(set.I, ["glavni", "2", "3"])) li.push(`${plus("I", ["2", "3"])} = <b>${mA(sum(set.I, ["2", "3"]))}</b>, <i>I</i> = <b>${mA(set.I.glavni)}</b>`);
      if (has(set.U, ["glavni", "1", "2"])) li.push(`<i>U</i>₁ + <i>U</i>₂ = <b>${V(set.U[1] + set.U[2])}</b>, <i>U</i> = <b>${V(set.U.glavni)}</b>`);
    }
    const Rp = rPts.get(sig());
    if (Rp) li.push(`Skupna upornost: ${tex(String.raw`\frac{U}{I} = ${rez(fmt(Rp[1], Rp[1] >= 100 ? 0 : 1), "Ω")}`)}, iz oznak na upornikih izračunaš ${fmt(Rp[0], Rp[0] >= 100 ? 0 : 1)} Ω (upori ±5 %).`);
    summary.innerHTML = `<p><b>To vezje (${vezName()}, ${fixed(B.U0, 1)} V):</b></p><ul>${li.map((x) => `<li>${x}</li>`).join("")}</ul>`;
  }
  function redrawGraph() {
    const pts = [...rPts.values()];
    graph.draw(pts.length ? [{ id: "R", pts, cls: "a", label: "tvoja vezja", line: (x) => x }] : []);
  }
  function maybeAsk(set) {
    const ids = ["1", "2", "3"].slice(0, B.count);
    const all = (o) => ["glavni", ...ids].every((k) => o[k] != null);
    if (B.vez === "zaporedno" && all(set.U) && !asked.has("zap")) {
      asked.add("zap");
      qBox.append(conclusion({
        text: "Kaj velja za napetosti pri zaporedni vezavi?",
        options: [
          { t: "Vsota napetosti na elementih je enaka napetosti napajalnika; največja napetost je na največjem uporu.", ok: true, why: "Isti tok teče skozi vse elemente, zato je <i>U</i><sub>i</sub> = <i>I</i> · <i>R</i><sub>i</sub>, napetosti pa se seštejejo: <i>U</i> = <i>U</i>₁ + <i>U</i>₂. Majhna razlika je napaka merilnika in padec napetosti na ampermetru." },
          { t: "Na vsakem elementu je napetost napajalnika.", ok: false, why: "Tako je pri vzporedni vezavi. Poglej tabelo: pri zaporedni vezavi je napetost na vsakem elementu manjša." },
          { t: "Napetost se razdeli na enake dele, ne glede na upor.", ok: false, why: "Na večjem uporu izmeriš večjo napetost, ker je <i>U</i> = <i>I</i> · <i>R</i> pri istem toku." },
        ],
      }));
    }
    if (B.vez === "vzporedno" && all(set.I) && !asked.has("vzp")) {
      asked.add("vzp");
      qBox.append(conclusion({
        text: "Kaj velja za tokove pri vzporedni vezavi?",
        options: [
          { t: "Tok v glavnem vodu je enak vsoti tokov v vejah; skozi manjši upor teče večji tok.", ok: true, why: `Naboj se v razcepišču ne izgubi (1. Kirchhoffov zakon): <i>I</i> = <i>I</i>₁ + <i>I</i>₂. Napetost na vseh vejah je enaka, zato je ${tex(String.raw`I_i = \frac{U}{R_i}`)}, skupna upornost pa je manjša od najmanjše. Če je izmerjena vsota <i>I</i>₁ + <i>I</i>₂ za malenkost (~1 %) večja od <i>I</i>, to ni napaka zakona: ampermeter ima upor ~1 Ω, ki tok v glavnem vodu zmanjša nekoliko bolj kot tok v posamezni veji, k temu pa prišteješ še napako merilnika.` },
          { t: "Tok je v vseh vejah in v glavnem vodu enak.", ok: false, why: "Tako je pri zaporedni vezavi. Pri vzporedni se tok razdeli med veje." },
          { t: "Skupna upornost je vsota uporov.", ok: false, why: "Vsota velja za zaporedno vezavo. Vzporedno dodan upornik odpre novo pot toku, zato je skupna upornost manjša: 1/<i>R</i> = 1/<i>R</i>₁ + 1/<i>R</i>₂." },
        ],
      }));
    }
  }
  function lampQuestion() {
    if (asked.has("luc") || lampsSeen.size < 2) return;
    asked.add("luc");
    qBox.append(conclusion({
      text: "Zakaj žarnici svetita šibko, ko sta vezani zaporedno, in kaj se zgodi, ko eno odviješ?",
      options: [
        { t: "Zaporedno ima vsaka le del napetosti, zato sveti šibko; ko eno odviješ, je krog prekinjen in ugasne tudi druga. Vzporedno ima vsaka polno napetost in sveti naprej.", ok: true, why: "Pri zaporedni vezavi je ena sama pot toka. Tako so bile vezane stare novoletne lučke: ena pregorela, vse so ugasnile. V hiši so porabniki vezani vzporedno." },
        { t: "Zaporedno vsaka dobi polovico toka, zato svetita šibko.", ok: false, why: "Tok je pri zaporedni vezavi skozi obe žarnici enak. Manjša je napetost na vsaki." },
        { t: "Ko eno odviješ, druga vedno zasveti močneje.", ok: false, why: "To velja le, če je druga vezana zaporedno s še kakšnim uporom. Pri zaporedni vezavi dveh žarnic odvita žarnica prekine krog." },
      ],
    }));
  }

  // ---------------------------------------------------------------- čas, dogodki, merilniki
  const say = {
    vroc: (e) => [`Upornik ${e.i + 1} se greje: moč ${fmt(e.P, 2)} W je večja od dovoljene ${fmt(UPOR.P, 2)} W.`, "warn"],
    zgorel: (e) => [`Upornik ${e.i + 1} je zgorel (dim, zoglenela prevleka). Njegova veja je prekinjena.`, "bad"],
    nitka: (e) => [`Nitka žarnice ${e.i + 1} se je pretrgala: napetost na njej je bila precej večja od nazivnih 6 V.`, "bad"],
    varovalka: (e) => [`Pok! V ampermetru je pregorela varovalka (tok ${fmt(Math.abs(e.I), 2)} A). Ampermeter ima zelo majhen upor, zato ga vedno veži zaporedno.`, "bad"],
    cc: () => ["Napajalnik je omejil tok na 1 A in znižal napetost (lučka CC). Je v vezju kratek stik (žica ali ampermeter vzporedno)?", "warn"],
  };
  let nEv = 0, readT = 0;
  ticker(el, (dt) => {
    B.step(dt);
    while (nEv < B.events.length) {
      const e = B.events[nEv++];
      log.push(...say[e.type](e));
    }
    readT += dt;
    if (readT >= 0.4) (readT = 0), readMeters();
    // žarnice pri zaporedni in vzporedni vezavi (za vprašanje o svetlosti)
    if (B.U0 >= 4 && B.kinds.slice(0, B.count).filter((k) => k === "L6").length >= 2 && B.vez !== "mesano") lampsSeen.add(B.vez), lampQuestion();
    draw();
  }, 100);
  function readMeters() {
    const st = B.state;
    sup.set(Math.max(0, st.Usup).toFixed(1), "V", st.cc ? "CC: omejitev toka" : `nastavljeno ${fmt(B.U0, 1)} V`);
    last.I = B.readA();
    last.U = B.readV();
    const ar = AM_RANGES[B.amRange], vr = VM_RANGES[B.vmRange];
    if (last.I) am.set(last.I.text, last.I.over ? "" : ar.unit, `${where(B.am, "A")}, ${ar.max * ar.k} ${ar.unit}`);
    else am.set("", "", "ni priključen");
    if (last.U) vm.set(last.U.text, last.U.over ? "" : "V", `${where(B.vm, "V")}, ${vr.max} V`);
    else vm.set("", "", "ni priključen");
  }

  // ---------------------------------------------------------------- risanje
  const Y0 = 70, Y1 = 250, YC = 160, XS = 95;
  function draw() {
    svg.replaceChildren();
    const c = B.count;
    nRow.hidden = B.vez === "mesano";
    slotSel[2].hidden = c < 3;
    for (const C of [amC, vmC]) C.at.querySelector('[data-v="3"]').hidden = c < 3;
    const wire = (d) => s("path", { d, class: "lab-wire" }, svg);
    const dot = (x, y) => s("circle", { cx: x, cy: y, r: 3.5, class: "lab-node" }, svg);
    const blown = B.fuseOf().blown;
    const meters = [["A", B.am], ["V", B.vm]].filter(([, m]) => m.pos !== "brez" && (m.at === "glavni" || +m.at <= c));
    const on = (at, pos) => meters.filter(([, m]) => m.at === at && m.pos === pos).map(([k]) => k);
    const meter = (x, y, k) => drawMeter(svg, x, y, k, k === "A" && blown);
    // lege elementov: ležeči na zgornji žici (zaporedno, element 1 pri mešani) ali pokončni v vejah
    const P = [];
    let xEnd;
    if (B.vez === "zaporedno") (c === 2 ? [250, 345] : [230, 300, 370]).forEach((x) => P.push({ x, y: Y0, horiz: true })), (xEnd = 410);
    else if (B.vez === "vzporedno") (c === 2 ? [250, 345] : [220, 300, 380]).forEach((x) => P.push({ x, y: YC })), (xEnd = P[c - 1].x);
    else P.push({ x: 228, y: Y0, horiz: true }, { x: 305, y: YC }, { x: 385, y: YC }), (xEnd = 385);
    // žice
    wire(`M40,${YC - 40} V${Y0} H${xEnd} ${B.vez === "zaporedno" ? `V${Y1}` : ""} M${xEnd},${Y1} H40 V${YC + 40}`);
    if (B.vez === "zaporedno") wire(`M${xEnd},${Y0} V${Y1}`);
    P.forEach((p, i) => {
      if (p.horiz) return;
      wire(`M${p.x},${Y0} V${Y1}`);
      if (i < c - 1) dot(p.x, Y0), dot(p.x, Y1);
    });
    // napajalnik
    s("rect", { x: 10, y: YC - 40, width: 60, height: 80, rx: 6, class: "lab-box" }, svg);
    label(svg, 40, YC - 22, "+", "lbl");
    label(svg, 40, YC + 24, "−", "lbl");
    s("text", { x: 40, y: YC + 2, class: "tick", "text-anchor": "middle", "dominant-baseline": "middle" }, svg, "0–12 V");
    s("circle", { cx: 58, cy: YC - 30, r: 4, class: B.state.cc ? "fill-danger" : "lab-led-off" }, svg);
    // merilniki v glavnem vodu in na napajalniku
    on("glavni", "zaporedno").forEach((k, j) => meter(135 + 40 * j, Y0, k));
    on("glavni", "vzporedno").forEach((k, j) => (wire(`M${XS},${Y0} V${Y1}`), dot(XS, Y0), dot(XS, Y1), meter(XS, j ? YC + 45 : YC, k)));
    // elementi in merilniki pri njih (merilniki na koncu, da jih sij žarnice ne prekrije)
    const later = [];
    const meterL = (x, y, k) => later.push(() => meter(x, y, k));
    P.forEach((p, i) => {
      const k = B.kinds[i], L = VEZ_DELI[k], part = B.parts[i], id = String(i + 1);
      const ser = on(id, "zaporedno"), par = on(id, "vzporedno");
      if (p.horiz) {
        ser.forEach((m, j) => meterL(p.x + (ser.length > 1 ? (j ? 19 : -19) : 0), Y1, m));
        par.forEach((m, j) => {
          const yy = j ? Y0 + 42 : Y0 - 42;
          wire(`M${p.x - 34},${Y0} V${yy} H${p.x + 34} V${Y0}`), dot(p.x - 34, Y0), dot(p.x + 34, Y0), meterL(p.x, yy, m);
        });
      } else {
        ser.forEach((m, j) => meterL(p.x, j ? YC + 55 : YC - 55, m));
        par.forEach((m, j) => {
          const xx = j ? p.x - 34 : p.x + 34;
          wire(`M${p.x},${YC - 38} H${xx} V${YC + 38} H${p.x}`), dot(p.x, YC - 38), dot(p.x, YC + 38), meterL(xx, YC, m);
        });
      }
      drawPart(p, k, L, part, i);
      const lx = p.x, ly = p.horiz ? Y0 - 18 : Y1 + 18;
      label(svg, lx, p.horiz && par.length ? Y0 + (par.length > 1 ? 72 : 24) : ly, `${i + 1}: ${short(k)}${part.burnt ? (L.type === "R" ? " zgorel" : " pregorela") : ""}`, "lbl small");
    });
    later.forEach((f) => f());
    fuseBtn.hidden = !blown;
    partBtn.hidden = !B.parts.slice(0, c).some((p) => p.burnt);
    const st = B.state;
    svg.setAttribute("aria-label", `${{ zaporedno: "Zaporedna", vzporedno: "Vzporedna", mesano: "Mešana" }[B.vez]} vezava: ${P.map((_, i) => {
      const k = B.kinds[i];
      return `${i + 1} ${VEZ_DELI[k].name}${k === "L6" ? (B.brightness(i) > 0.5 ? " (sveti)" : B.brightness(i) > 0.03 ? " (sveti šibko)" : " (ne sveti)") : ""}`;
    }).join(", ")}. Ampermeter: ${where(B.am, "A")}. Voltmeter: ${where(B.vm, "V")}.${st.cc ? " Napajalnik omejuje tok." : ""}`);
  }
  function drawPart(p, k, L, part, i) {
    const { x, y, horiz } = p;
    if (L.type === "R") return drawResistor(svg, x, y, k, part, { horiz });
    if (L.type === "L") return drawLamp(svg, x, y, B.brightness(i), part.burnt);
    // prazno podnožje: dve sponki brez povezave; žica: debela črta (kratek stik)
    const g = s("g", horiz ? { transform: `rotate(-90 ${x} ${y})` } : {}, svg);
    s("rect", { x: x - 12, y: y - 22, width: 24, height: 44, rx: 4, class: "lab-socket" }, g);
    if (L.type === "W") s("path", { d: `M${x},${y - 22} V${y + 22}`, class: "lab-short" }, g);
    else s("circle", { cx: x, cy: y - 22, r: 3, class: "lab-node" }, g), s("circle", { cx: x, cy: y + 22, r: 3, class: "lab-node" }, g);
  }

  redrawGraph();
  readMeters();
  draw();
  sync();
}

// ================================================================ kovine in nekovine: kaj prevaja električni tok?
export function labPrevodnost(el) {
  const seed = (Math.random() * 2 ** 31) | 0;
  const r = rng(seed), amM = makeMeter(r);
  const W = 400, H = 262;
  const svg = svgBox(W, H, "lab-bench lab-prev");
  const log = eventLog();
  const amLcd = lcd("ampermeter");
  const status = h("p", { class: "lab-status", "aria-live": "polite" });
  const st = { mat: "baker", ind: "zarnica", am: false, amRange: "200m", fuse: false, magnet: false };
  const tested = new Map(); // id → { luc, magnet, sijaj, upogib, uvr }
  const ptsIon = { zarnica: new Map(), led: new Map() }; // koncentracija soli → tok (mA)
  let reading = null;

  const matSel = select({ label: "snov med sponkama", options: Object.entries(MATERIALI).map(([k, m]) => [k, m.name]), value: st.mat, onChange: (v) => ((st.mat = v), (st.magnet = false), test()) });
  const indSeg = segmented({ options: [["zarnica", "žarnica 3,8 V"], ["led", "LED z uporom 150 Ω"]], value: st.ind, onChange: (v) => ((st.ind = v), test()) });
  indSeg.setAttribute("aria-label", "lučka");
  const amT = toggle("ampermeter v krogu", false, (v) => ((st.am = v), test()));
  const amRange = select({ label: "območje ampermetra", options: [["200m", "200 mA"], ["10", "10 A (drug priključek)"]], value: st.amRange, onChange: (v) => ((st.amRange = v), test()) });
  const fuseBtn = button("Zamenjaj varovalko v ampermetru", () => ((st.fuse = false), log.push("Nova varovalka je v ampermetru.", "ok"), test()));
  const magBtn = button("Približaj magnet", () => magnet());
  const sijBtn = button("Poglej površino", () => look());
  const upBtn = button("Poskusi upogniti", () => bend());
  const recBtn = button("Zapiši v tabelo", () => note(), "primary small");
  const tbody = h("tbody");
  const table = h("table", { class: "demo-table lab-table lab-prev-table" },
    h("thead", {}, h("tr", {}, ...["snov", "tok", "magnet", "površina", "upogib", "skupina"].map((t) => h("th", { scope: "col" }, t)))), tbody);
  const none = h("p", { class: "muted lab-empty" }, "Še ni zapisanih snovi. Preizkusi snov in pritisni »Zapiši v tabelo«.");
  const checkBtn = button("Preveri razvrstitev", () => check(), "primary small");
  const checkOut = h("p", { class: "lab-fitout", "aria-live": "polite" });
  const graph = dataGraph({ x: [0, 20], y: [0, 200], xStep: 5, yStep: 50, xLabel: "sol v vodi [%]", yLabel: "I [mA]", title: "Tok skozi slano vodo v odvisnosti od deleža soli" });
  const qBox = h("div");

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, amLcd), status), controlsBox(
        grp("1. Preizkuševalnik", h("p", { class: "lab-tit-hint" }, "Baterija 4,5 V, lučka in dve sponki. Če snov prevaja električni tok, je krog sklenjen in lučka zasveti."), row("lučka", indSeg), buttons(amT), amRange),
        grp("2. Snov", matSel, buttons(magBtn, sijBtn, upBtn), buttons(recBtn, fuseBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Tabela snovi"), h("div", { class: "lab-table-wrap" }, table, none), buttons(checkBtn), checkOut,
      h("h4", { class: "lab-h" }, "Slana voda (z ampermetrom)"), graph, qBox,
      notes(POENOSTAVITVE_ELEKTRIKA.prevodnost, "Specifična upornost kovin pri 20 °C (CRC Handbook): baker 1,68 · 10⁻⁸ Ω m, aluminij 2,65 · 10⁻⁸ Ω m, železo 9,7 · 10⁻⁸ Ω m; žveplo ~2 · 10¹⁵ Ω m. Prevodnost raztopin NaCl (CRC Handbook): 1 % 1,6 S/m, 5 % 7,0 S/m, 20 % 19,6 S/m. Ocene: mina svinčnika ~3 · 10⁻⁵ Ω m, izolatorji, vodovodna voda, notranji upor baterije, razkrojna napetost pri elektrolizi."),
    ],
    tryText: "Napovej, katere snovi bodo prevajale električni tok. Preizkusi vse kovine, mino svinčnika in nekaj snovi, ki niso kovine. Ali prevajajo samo kovine? Primerjaj destilirano vodo, vodovodno vodo in slano vodo z različno količino soli, najprej z žarnico, nato z LED.",
  });
  el.classList.add("lab");

  const stanje = { sveti: "sveti", sibko: "sveti šibko", ne: "ne sveti" };
  const cur = () => tester(st.mat, st.ind, st.am && !st.fuse ? AM_RANGES[st.amRange].rsh : st.am ? 1e12 : 0);
  function test() {
    const m = MATERIALI[st.mat];
    const t = cur();
    status.textContent = `${m.name}: ${st.ind === "led" ? "LED" : "žarnica"} ${stanje[t.stanje]}.${t.mehurcki ? " Na ploščicah nastajajo mehurčki." : ""}`;
    amRange.hidden = !st.am;
    fuseBtn.hidden = !st.fuse;
    readAm();
    draw(t);
  }
  function readAm() {
    if (!st.am) return (reading = null), amLcd.set("", "", "ni priključen");
    if (st.fuse) return (reading = null), amLcd.set("0.0", "mA", "varovalka pregorela");
    const rg = AM_RANGES[st.amRange];
    reading = meterRead(amM, cur().I, rg, "A");
    amLcd.set(reading.text, reading.over ? "" : rg.unit, `območje ${rg.max * rg.k} ${rg.unit}`);
  }
  const entry = () => {
    if (!tested.has(st.mat)) tested.set(st.mat, {});
    return tested.get(st.mat);
  };
  function magnet() {
    const m = MATERIALI[st.mat];
    st.magnet = true;
    if (m.tekocina) log.push("Magnet ne privlači tekočine v čaši.", "info");
    else log.push(m.magnet ? `Magnet privlači ${m.name.split(" (")[0]}.` : `Magnet ne privlači snovi ${m.name.split(" (")[0]}.`, m.magnet ? "ok" : "info");
    entry().magnet = m.magnet ? "privlači" : "ne";
    draw(cur());
  }
  function look() {
    const m = MATERIALI[st.mat];
    const t = m.tekocina ? "prozorna tekočina" : m.sijaj === true ? "kovinski sijaj" : m.sijaj ? "rahel siv sijaj" : "brez kovinskega sijaja";
    log.push(`${m.name}: ${t}${m.sijaj === true ? " (ko jo podrgneš, se sveti)" : ""}.`, "info");
    entry().sijaj = t;
  }
  function bend() {
    const m = MATERIALI[st.mat];
    const t = m.tekocina ? "tekočina" : m.upogib;
    log.push(`${m.name}: ${t}.`, "info");
    entry().upogib = t;
  }
  function note() {
    const t = cur(), e = entry();
    e.luc = `${st.ind === "led" ? "LED" : "žarnica"} ${stanje[t.stanje]}`;
    if (reading && !reading.over) {
      const mA = reading.value * (AM_RANGES[st.amRange].unit === "A" ? 1000 : 1);
      e.luc += ` (${fmt(mA, 1)} mA)`;
      const c = MATERIALI[st.mat].conc;
      if (c != null) ptsIon[st.ind].set(c, mA), drawGraph();
    }
    if (MATERIALI[st.mat].conc != null && !st.am) log.push("Za graf vključi ampermeter in zapiši tok pri slani vodi z različno količino soli (in pri destilirani vodi).", "info");
    drawTable();
    if (tested.size >= 6 && [...tested.keys()].some((k) => k === "grafit") && [...tested.keys()].some((k) => MATERIALI[k].tekocina)) ask();
  }
  function drawTable() {
    none.hidden = tested.size > 0;
    table.hidden = tested.size === 0;
    tbody.replaceChildren(...[...tested].map(([id, e]) => {
      const sel = h("select", { "aria-label": `skupina: ${MATERIALI[id].name}` }, ...[["", "izberi …"], ["kovina", "kovina"], ["nekovina", "nekovina"], ["drugo", "drugo"]].map(([v, l]) => h("option", { value: v }, l)));
      sel.value = e.uvr ?? "";
      sel.addEventListener("change", () => ((e.uvr = sel.value || undefined), (checkOut.textContent = "")));
      const td = (l, v) => h("td", { "data-l": l }, v ?? "–");
      return h("tr", { "data-id": id }, h("th", { scope: "row" }, MATERIALI[id].name), td("tok", e.luc), td("magnet", e.magnet), td("površina", e.sijaj), td("upogib", e.upogib), td("skupina", sel));
    }));
  }
  function check() {
    const rows = [...tested];
    if (!rows.length) return (checkOut.textContent = "Najprej zapiši nekaj snovi v tabelo.");
    const missing = rows.filter(([, e]) => !e.uvr).length;
    const wrong = rows.filter(([id, e]) => e.uvr && e.uvr !== MATERIALI[id].vrsta);
    tbody.querySelectorAll("tr").forEach((tr) => {
      const e = tested.get(tr.dataset.id);
      tr.classList.toggle("ok", !!e.uvr && e.uvr === MATERIALI[tr.dataset.id].vrsta);
      tr.classList.toggle("bad", !!e.uvr && e.uvr !== MATERIALI[tr.dataset.id].vrsta);
    });
    const hint = wrong.map(([id]) => ({
      grafit: "Grafit prevaja tok in se malo sveti, a je ogljik, nekovina: krhek je in ga magnet ne privlači.",
      zveplo: "Žveplo je element, a ni kovina: ne prevaja toka, je krhko in nima kovinskega sijaja.",
      baker: "Baker je kovina, čeprav ga magnet ne privlači: magnet privlači le železo, nikelj in kobalt.",
      aluminij: "Aluminij je kovina, čeprav ga magnet ne privlači.",
    })[id] || `${MATERIALI[id].name}: ${MATERIALI[id].vrsta === "drugo" ? "ni element, temveč spojina ali zmes (npr. raztopina), zato spada med »drugo«." : `spada med »${MATERIALI[id].vrsta}«.`}`);
    checkOut.innerHTML = wrong.length ? `<b>${wrong.length} ${wrong.length === 1 ? "snov ni" : "snovi niso"} v pravi skupini.</b> ${hint.join(" ")}` : `<b>${missing ? "Do zdaj prav." : "Vse prav."}</b> ${missing ? `Razvrsti še ${missing} ${missing === 1 ? "snov" : "snovi"}.` : "Kovine prevajajo tok, se svetijo in se upogibajo. Med nekovinami tok prevaja le grafit."}`;
  }
  function drawGraph() {
    const ser = (k, cls, shape, label) => ({ id: k, pts: [...ptsIon[k]].sort((a, b) => a[0] - b[0]), cls, shape, label });
    graph.draw([ser("zarnica", "a", "o", "z žarnico"), ser("led", "b", "^", "z LED")].filter((x) => x.pts.length));
  }
  function ask() {
    if (qBox.children.length) return;
    qBox.append(conclusion({
      text: "Kaj lahko sklepaš iz svojih meritev?",
      options: [
        { t: "Vse kovine prevajajo električni tok, prevajajo pa ga tudi nekatere snovi, ki niso kovine: grafit in slana voda.", ok: true, why: "Kovine dobro prevajajo tok. Grafit je nekovina, ki tok prevaja, slana voda pa je raztopina, v kateri tok prenašajo ioni (zato nastajajo mehurčki)." },
        { t: "Električni tok prevajajo samo kovine.", ok: false, why: "Mina svinčnika (grafit) ni kovina, pa žarnica vseeno zasveti." },
        { t: "Vse kovine privlači magnet.", ok: false, why: "Magnet privlači železo, bakra in aluminija pa ne. Z magnetom kovine ne prepoznaš." },
        { t: "Voda vedno prevaja električni tok.", ok: false, why: "Destilirana voda tok prevaja zelo slabo. Tok dobro prevaja voda z raztopljenimi ioni, npr. slana voda. Zato je voda iz pipe nevarna ob električnih napravah." },
      ],
    }));
  }

  // ---------------------------------------------------------------- risanje
  const COL = { baker: "#c46a32", aluminij: "#c9ced6", zelezo: "#6f747c", grafit: "#3b3d42", zveplo: "#f2d43b", steklo: "#cfe8ef", plastika: "#4f8fd6", les: "#b98a52", guma: "#e7799a", papir: "#f6f3ea", sol: "#f4f4f4" };
  function draw(t) {
    svg.replaceChildren();
    const m = MATERIALI[st.mat];
    const wire = (d) => s("path", { d, class: "lab-wire" }, svg);
    // baterija 4,5 V (ploščata), + levo, − desno
    s("rect", { x: 18, y: 160, width: 80, height: 76, rx: 6, class: "lab-batt" }, svg);
    s("rect", { x: 30, y: 152, width: 8, height: 10, class: "lab-batt-pole" }, svg);
    s("rect", { x: 76, y: 152, width: 8, height: 10, class: "lab-batt-pole" }, svg);
    label(svg, 34, 176, "+", "lbl lab-batt-t");
    label(svg, 80, 176, "−", "lbl lab-batt-t");
    label(svg, 58, 212, "4,5 V", "lbl small lab-batt-t");
    const cx1 = 175, cx2 = 335, cy = 190; // sponki
    const yEnd = m.tekocina ? 140 : cy - 20; // pri tekočini sponki držita bakreni ploščici nad čašo
    wire(`M34,152 V60 H${cx2} V${yEnd}`);
    wire(`M80,152 V120 H${cx1} V${yEnd}`);
    // kazalo toka
    if (st.ind === "led") {
      if (t.b > 0) s("circle", { cx: 220, cy: 60, r: 14 + 18 * Math.min(1, t.b), class: "lab-led-glow", opacity: Math.min(0.85, 0.2 + 0.6 * t.b) }, svg);
      s("path", { d: "M206,70 V56 a14,14 0 0 1 28,0 V70 Z", class: t.b > 0 ? "lab-led on" : "lab-led" }, svg);
      s("rect", { x: 268, y: 52, width: 34, height: 16, rx: 6, class: "lab-res" }, svg);
      label(svg, 220, 90, "LED", "lbl small"), label(svg, 285, 90, "150 Ω", "lbl small");
    } else {
      drawLamp(svg, 220, 60, t.b, false);
      label(svg, 220, 96, "3,8 V", "lbl small");
    }
    if (st.am) drawMeter(svg, 34, 106, "A", st.fuse);
    // snov med sponkama
    if (m.tekocina) {
      s("path", { d: `M${cx1 + 10},150 V246 H${cx2 - 10} V150`, class: "lab-glass" }, svg);
      s("rect", { x: cx1 + 12, y: 176, width: cx2 - cx1 - 24, height: 68, class: m.ioni ? "lab-liq lab-liq-voda" : "lab-liq lab-liq-cista" }, svg);
      for (const x of [cx1 + 30, cx2 - 30]) {
        wire(`M${x === cx1 + 30 ? cx1 : cx2},140 H${x} V146`);
        s("rect", { x: x - 4, y: 146, width: 8, height: 84, class: "lab-plate" }, svg);
        if (t.mehurcki) for (let i = 0; i < 4; i++) s("circle", { cx: x + (i % 2 ? 7 : -7), cy: 220 - i * 13, r: 2.4, class: "lab-bubble lab-rise", style: `animation-delay:${i * 0.35}s` }, svg);
      }
      label(svg, (cx1 + cx2) / 2, 258, m.name, "lbl small");
    } else {
      const thick = ["baker", "aluminij", "zelezo"].includes(st.mat) ? 6 : st.mat === "grafit" ? 4 : 16;
      s("rect", { x: cx1 - 20, y: cy - thick / 2 + 10, width: cx2 - cx1 + 40, height: thick, rx: thick / 2, fill: COL[st.mat], class: "lab-sample" }, svg);
      for (const x of [cx1, cx2]) {
        s("path", { d: `M${x - 9},${cy - 20} L${x + 9},${cy - 20} L${x + 7},${cy + 6} L${x - 7},${cy + 6} Z`, class: "lab-clip" }, svg);
        s("path", { d: `M${x - 9},${cy + 24} L${x + 9},${cy + 24} L${x + 7},${cy + 14} L${x - 7},${cy + 14} Z`, class: "lab-clip" }, svg);
      }
      label(svg, (cx1 + cx2) / 2, 236, m.name, "lbl small");
      if (st.magnet) {
        const mx = (cx1 + cx2) / 2, my = m.magnet ? cy + 26 : cy + 48;
        s("path", { d: `M${mx - 18},${my + 26} V${my} H${mx - 6} V${my + 26} M${mx + 6},${my + 26} V${my} H${mx + 18} V${my + 26}`, class: "lab-magnet" }, svg);
      }
    }
    svg.setAttribute("aria-label", `Baterija 4,5 V, ${st.ind === "led" ? "LED" : "žarnica"} in dve sponki${m.tekocina ? " na bakrenih ploščicah v čaši" : ""}; med njima ${m.name}. ${st.ind === "led" ? "LED" : "Žarnica"} ${stanje[t.stanje]}.`);
  }

  // Varovalka v ampermetru (IEC 60127-2, F): pri kovinah z žarnico teče okoli 0,3 A, kar je za vhod 200 mA na meji.
  let fuseQ = 0;
  ticker(el, (dt) => {
    if (!st.am || st.fuse) return;
    fuseQ += dt * fuseRate(cur().I, AM_RANGES[st.amRange].fuse);
    if (fuseQ >= 1) (st.fuse = true), (fuseQ = 0), log.push("Pok! V ampermetru je pregorela varovalka 200 mA. Za večje tokove uporabi priključek 10 A.", "bad"), test();
    else readAm();
  }, 400);
  drawTable();
  drawGraph();
  test();
}
