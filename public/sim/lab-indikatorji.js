// Virtualni laboratorij, indikatorji: pH snovi iz gospodinjstva (lab-ph), dokazne reakcije v živilih (lab-dokaz),
// razgradnja škroba z amilazo iz sline (lab-slina). Modeli: lab-model-indikatorji.js (brez DOM).
import { h, s, svgBox, select, segmented, button, toggle, layout, label, stage as stageBox, controls as controlsBox } from "./kit.js";
import { ticker, lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed } from "./lab.js";
import {
  PhBench, PH_VZORCI, PAPIR, zeljePas, razvrstitevOk, SKUPINE, DokazBench, ZIVILA, PRESKUSI,
  SlinaBench, EPRUVETE, JOD_STOPNJE, POENOSTAVITVE_INDIKATORJI,
} from "./lab-model-indikatorji.js";

const grp = (title, ...kids) => h("fieldset", { class: "lab-tit-grp" }, h("legend", {}, title), ...kids);
const buttons = (...k) => h("div", { class: "demo-buttons" }, ...k);
const row = (lab, ...kids) => h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, lab), ...kids);
const seg = (name, options, value, onChange) => {
  const x = segmented({ options, value, onChange });
  x.setAttribute("aria-label", name);
  return x;
};
const hint = (text) => h("p", { class: "lab-tit-hint", html: text });
const rgb = (c) => `rgb(${c.join(" ")})`;
const num = (x, d = 1) => fixed(x, d);
const swatch = (c, name) => h("span", { class: "lab-ind-sw", style: `background:${rgb(c)}`, title: name, role: "img", "aria-label": name });
const OCALA = "Najprej si nadeni zaščitna očala. Čistilo za odtoke in čistilo z amoniakom sta jedka, kisline in reagenti škodujejo očem.";

// Epruveta s tekočino (x sredina, yT vrh, yB dno).
function epruveta(svg, x, yT, yB, fill, { w = 18, level = 0.55, cls = "" } = {}) {
  const y = yB - (yB - yT) * level;
  if (fill) s("path", { d: `M${x - w / 2 + 1.5},${y} V${yB - w / 2} A${w / 2 - 1.5},${w / 2 - 1.5} 0 0 0 ${x + w / 2 - 1.5},${yB - w / 2} V${y} Z`, fill, class: `lab-ind-liq ${cls}` }, svg);
  s("path", { d: `M${x - w / 2},${yT} V${yB - w / 2} A${w / 2},${w / 2} 0 0 0 ${x + w / 2},${yB - w / 2} V${yT}`, class: "lab-glass" }, svg);
}
function merilo(svg, x, y, px, text) {
  s("path", { d: `M${x},${y - 4} V${y} H${x + px} V${y - 4}`, class: "lab-scale" }, svg);
  label(svg, x + px / 2, y + 12, text, "tick small");
}

// ================================================================ pH snovi iz gospodinjstva
export function labPh(el) {
  const B = new PhBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const W = 400, H = 262;
  const svg = svgBox(W, H, "lab-bench lab-ind lab-ind-ph");
  const log = eventLog();
  const meterL = lcd("pH-meter");
  const ids = Object.keys(PH_VZORCI);
  const nr = (id) => ids.indexOf(id) + 1;
  const KR = { limona: "limona", kis: "kis", kola: "kola", kava: "kava", mleko: "mleko", voda: "voda iz pipe", destilirana: "destil. voda", soda: "soda bikarbona", milo: "milo", pasta: "zobna pasta", amoniak: "amoniak", odtok: "čistilo za odtoke", hcl: "HCl" };
  const kratko = (id) => `${nr(id)}. ${KR[id]}${(B.krat[id] || 1) > 1 ? ` 1 : ${B.krat[id]}` : ""}`;
  const ime = (id) => `${PH_VZORCI[id].name}${(B.krat[id] || 1) > 1 ? `, razredčen 1 : ${B.krat[id]}` : ""}`;
  const table = dataTable([
    { key: "vz", label: "vzorec" },
    { key: "nac", label: "način" },
    { key: "ph", label: "pH" },
  ], { empty: "Še ni meritev. Izberi vzorec in ga preizkusi z rdečim zeljem, papirjem ali pH-metrom." });
  const graph = dataGraph({ x: [0, 15], y: [0, 14], xStep: 1, yStep: 2, xLabel: "št.", yLabel: "pH", title: "Izmerjeni pH (vodoravna os: številka vzorca) vzorcev po treh načinih" });
  const lineSvg = svgBox(360, 92, "lab-ind-line");
  const qBox = h("div");
  const meas = { zelje: [], papir: [], meter: [] };
  const razvrsceni = new Map(); // id → { pH, izbira, ok }
  const zadnji = {}; // id → zadnji odčitek (za razvrščanje)
  let cur = "kis", show = { zelje: null, papir: null }, asked = false, askedR = false, dilMeasured = false;

  const goggles = toggle("zaščitna očala", false, (v) => ((B.goggles = v), v && log.push("Nadel si si zaščitna očala.", "ok")));
  const sampleSel = select({ label: "vzorec", options: ids.map((k) => [k, `${nr(k)}. ${PH_VZORCI[k].name}`]), value: cur, onChange: (v) => ((cur = v), (show = { zelje: null, papir: null }), status(), draw()) });
  const dilBtn = button("Razredči 10-krat z destilirano vodo", () => dilute());
  const cabBtn = button("Dodaj izvleček rdečega zelja", () => zelje(), "primary small");
  const papBtn = button("Pomoči univerzalni indikatorski papir", () => papir(), "primary small");
  const calBtn = button("Umeri s pufri pH 4, 7 in 10", () => calibrate());
  const rinseBtn = button("Speri elektrodo z destilirano vodo", () => (B.sperI(), log.push("Elektroda je sprana in obrisana.", "ok"), draw()));
  const dipBtn = button("Potopi elektrodo v vzorec", () => dip(), "primary small");
  const recBtn = button("Zapiši odčitek pH-metra", () => recMeter());
  const sortSeg = seg("razvrsti vzorec", Object.entries(SKUPINE), "", (v) => sort(v));
  const now = h("p", { class: "lab-status", "aria-live": "polite" });

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, meterL)), controlsBox(
        grp("1. Varnost", hint("Pri delu s čistili in kislinami nosiš zaščitna očala. Čistilo za odtoke je zelo jedko: ne dotikaj se ga, ne vohaj ga od blizu."), goggles),
        grp("2. Vzorec", sampleSel, buttons(dilBtn), now),
        grp("3. Merjenje", hint("Rdeče zelje in papir pokažeta pH z barvo. pH-meter je natančen šele po umerjanju; elektrodo speri med vzorci."), buttons(cabBtn, papBtn), buttons(calBtn, rinseBtn), buttons(dipBtn, recBtn)),
        grp("4. Razvrsti", hint("Je izbrani vzorec kisel, nevtralen ali bazičen? Razvrsti ga, ko ga izmeriš."), sortSeg),
        log,
      )),
      h("h4", { class: "lab-h" }, "Meritve"), table,
      h("h4", { class: "lab-h" }, "pH vzorcev"), graph,
      h("h4", { class: "lab-h" }, "Lestvica pH"), h("figure", { class: "lab-graph-wrap" }, lineSvg), qBox,
      notes(POENOSTAVITVE_INDIKATORJI.ph, "pH iz bilance nabojev; Kw = 1,0·10⁻¹⁴, pKa: ocetna kislina 4,76, ogljikova kislina 6,35 in 10,33, NH₄⁺ 9,25 (CRC Handbook). CO₂ v vodi: kH = 0,034 mol/(L·atm) (Sander 2015), 420 ppm v zraku. Območja pH živil: FDA, Approximate pH of Foods (2007); kola: Reddy idr. 2016; milo: Tarun idr. 2014. Rdeče zelje: Fossen idr. 1998, Food Chem. 63, 435. Pufri pH 4,01/7,00/10,01 (DIN 19266). Ocene: kava, voda iz pipe, zobna pasta, čistila, barve lestvic, napake pH-metra."),
    ],
    tryText: "Napovej, ali je milo kislo ali bazično, in preveri z rdečim zeljem. Izmeri destilirano vodo s pH-metrom, ki ga še nisi umeril, nato ga umeri in izmeri znova. Razredči klorovodikovo kislino in kis 10-krat: za koliko se spremeni pH?",
  });
  el.classList.add("lab");

  function status() {
    const v = PH_VZORCI[cur];
    now.textContent = `${ime(cur)}${v.jedko ? " – jedko!" : ""}${v.sestava ? "" : " (sestave ne poznamo natančno)"}`;
    dilBtn.disabled = !v.sestava || (B.krat[cur] || 1) >= 100;
  }
  const need = () => (B.goggles ? true : (log.push(OCALA, "warn"), false));
  function add(nac, pH, text) {
    zadnji[cur] = pH;
    if (nac === "meter" && (cur === "hcl" || cur === "kis") && B.krat[cur] >= 10) dilMeasured = true;
    const x = nr(cur) + { zelje: -0.2, papir: 0, meter: 0.2 }[nac];
    meas[nac].push([x, pH]);
    table.add({ vz: kratko(cur), nac: { zelje: "zelje", papir: "papir", meter: "pH-meter" }[nac], ph: text });
    redraw();
  }
  function dilute() {
    const r = B.razredci(cur);
    if (!r.ok) return log.push(r.why === "sestava" ? "Ta vzorec ima v sebi veliko različnih snovi; razredčimo le tiste, pri katerih vemo, kaj je v njih." : "Bolj kot 1 : 100 ne redčimo.", "warn");
    log.push(`Odpipetiral si 10 mL vzorca in ga z destilirano vodo razredčil do 100 mL: zdaj ${ime(cur)}.`, "info");
    show = { zelje: null, papir: null };
    status(), draw();
  }
  function zelje() {
    if (!need()) return;
    const r = B.zelje(cur);
    show.zelje = r.rgb;
    const p = r.pas, mid = (p.od + p.do) / 2;
    log.push(`Barva z rdečim zeljem: <b>${p.ime}</b>, po lestvici pH ${num(p.od, p.od % 1 ? 1 : 0)}–${num(p.do, p.do % 1 ? 1 : 0)}.${PH_VZORCI[cur].barva && PH_VZORCI[cur].a > 0.5 ? " Lastna barva vzorca prekrije barvo indikatorja; bolje izmeri s pH-metrom." : ""}`, "info");
    add("zelje", mid, `${num(p.od, p.od % 1 ? 1 : 0)}–${num(p.do, p.do % 1 ? 1 : 0)}`);
    draw();
  }
  function papir() {
    if (!need()) return;
    const r = B.papir(cur);
    show.papir = r.rgb;
    log.push(`Papir primerjaš z lestvico: najbolj je podoben polju <b>pH ${r.odcitek}</b> (natančnost ±1).`, "info");
    add("papir", r.odcitek, `≈ ${r.odcitek}`);
    draw();
  }
  function calibrate() {
    if (!need()) return;
    B.umeri();
    log.push("Elektrodo si potopil v pufre pH 4,01, 7,00 in 10,01 in jo vmes spiral. pH-meter je umerjen.", "ok");
    draw();
  }
  function dip() {
    if (!need()) return;
    const r = B.potopi(cur);
    if (r.umazana) log.push("Elektrode nisi spral: kapljica prejšnjega vzorca je zdaj v tem vzorcu. Odčitek se počasi spreminja.", "warn");
    if (!B.cal) log.push("pH-meter še ni umerjen; odčitek je lahko napačen za več desetink.", "warn");
    draw();
  }
  function recMeter() {
    const v = B.readPH();
    if (v == null || B.elektroda.v !== cur) return log.push("Elektroda ni v tem vzorcu. Potopi jo in počakaj, da se odčitek ustali.", "warn");
    add("meter", v, num(v, 2));
  }
  function sort(v) {
    if (!v) return;
    if (zadnji[cur] == null) return sortSeg.set("", true), log.push("Vzorec najprej izmeri.", "warn");
    const pH = B.pH(cur), ok = razvrstitevOk(pH, v);
    razvrsceni.set(cur, { pH: zadnji[cur], izbira: v, ok });
    log.push(ok ? `Prav: ${ime(cur)} je ${SKUPINE[v]}.` : `Ne čisto: izmeril si pH ${num(zadnji[cur], 1)}. Kislo je pod ~6,5, nevtralno okoli 7, bazično nad ~7,5.`, ok ? "ok" : "warn");
    sortSeg.set("", true);
    drawLine();
    if (razvrsceni.size >= 5 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj velja za snovi iz kuhinje in kopalnice, ki si jih izmeril?",
        options: [
          { t: "Kis, limonin sok in kola so kisli (pH pod 7), soda bikarbona, milo in čistila so bazični; čistilo za odtoke ima najvišji pH in je najbolj jedko.", ok: true, why: "Kisline imajo pH pod 7, baze nad 7. Bolj ko je pH oddaljen od 7, močnejša je kislina ali baza in bolj je nevarna. Čistilo za odtoke (NaOH) ima pH okoli 14, zato je jedko." },
          { t: "Vse tekočine iz kuhinje so kisle, vse iz kopalnice bazične.", ok: false, why: "Mleko je skoraj nevtralno, soda bikarbona iz kuhinje je bazična. Odloča snov, ne prostor." },
          { t: "Destilirana voda ima vedno točno pH 7.", ok: false, why: "Destilirana voda na zraku raztopi malo ogljikovega dioksida iz zraka in ima pH okoli 5,6. Le popolnoma čista voda brez CO₂ ima pH 7." },
          { t: "Snov z večjim pH je bolj kisla.", ok: false, why: "Ravno obratno: manjši pH pomeni bolj kislo. pH 2 je kisel, pH 12 bazičen." },
        ],
      }));
    }
  }
  function maybeDilQ() {
    if (askedR) return;
    if (!dilMeasured) return;
    askedR = true;
    qBox.append(conclusion({
      text: "Kislino razredčiš 10-krat. Kaj se zgodi s pH?",
      options: [
        { t: "Pri močni kislini (HCl) se pH zviša za 1, pri šibki (kis) le za približno 0,5.", ok: true, why: "pH pove, koliko je ionov H⁺: 10-krat manj ionov je za 1 večji pH. Močna kislina je vsa razpadla na ione, zato se pH zviša za 1. Pri šibki kislini razpade le majhen del molekul; po razredčenju razpade večji del, zato se pH zviša le za ~0,5." },
        { t: "pH se zviša na 7, ker je zdaj v raztopini večinoma voda.", ok: false, why: "Raztopina ostane kisla: kislina je še vedno v njej, le manj je je. Do pH 7 bi jo morali razredčiti zelo veliko." },
        { t: "pH se zmanjša za 1.", ok: false, why: "Ko je kisline manj, je raztopina manj kisla, pH se poveča." },
        { t: "pH se ne spremeni, ker je kislina še vedno ista.", ok: false, why: "pH ni odvisen le od snovi, temveč tudi od tega, koliko je je v litru. Tako se ne spremeni le pH sode bikarbone." },
      ],
    }));
  }
  function redraw() {
    graph.draw([
      { id: "z", pts: [...meas.zelje], cls: "a", shape: "o", label: "rdeče zelje (sredina pasu)" },
      { id: "p", pts: [...meas.papir], cls: "b", shape: "^", label: "indikatorski papir" },
      { id: "m", pts: [...meas.meter], cls: "c", shape: "o", label: "pH-meter" },
    ].filter((x) => x.pts.length));
    maybeDilQ();
  }
  // Lestvica pH 0–14 z barvami papirja in razvrščenimi vzorci (številka vzorca nad izmerjenim pH).
  function drawLine() {
    lineSvg.replaceChildren();
    const x0 = 14, w = 332 / 14, y = 52;
    PAPIR.slice(0, 14).forEach((c, i) => s("rect", { x: x0 + i * w, y, width: w + 0.5, height: 14, fill: rgb(c) }, lineSvg));
    for (let n = 0; n <= 14; n += 2) label(lineSvg, x0 + n * w, y + 26, String(n), "tick small");
    label(lineSvg, x0 + 3.25 * w, y - 44, "kislo", "lbl small");
    label(lineSvg, x0 + 7 * w, y - 44, "nevtralno", "lbl small");
    label(lineSvg, x0 + 10.75 * w, y - 44, "bazično", "lbl small");
    const used = [];
    for (const [id, v] of razvrsceni) {
      const x = x0 + Math.max(0, Math.min(14, v.pH)) * w;
      const lvl = used.filter((u) => Math.abs(u - x) < 16).length;
      used.push(x);
      s("circle", { cx: x, cy: y - 10 - lvl * 14, r: 6.5, class: `lab-ind-dot ${v.ok ? "ok" : "bad"} ${v.izbira}` }, lineSvg);
      label(lineSvg, x, y - 10 - lvl * 14, String(nr(id)), "lab-ind-dotn");
    }
    lineSvg.setAttribute("aria-label", razvrsceni.size ? `Razvrščeni vzorci: ${[...razvrsceni].map(([id, v]) => `${PH_VZORCI[id].name} pH ${num(v.pH, 1)} ${SKUPINE[v.izbira]}`).join("; ")}.` : "Lestvica pH od 0 do 14, še brez razvrščenih vzorcev.");
  }

  ticker(el, (dt) => {
    B.step(dt);
    const v = B.readPH();
    meterL.set(v == null ? "" : num(v, 2), "pH", B.cal ? "umerjen" : "ni umerjen");
  }, 250);

  // ---------------------------------------------------------------- risba (1 cm = 10 px)
  function draw() {
    svg.replaceChildren();
    s("line", { x1: 0, y1: 176, x2: W, y2: 176, class: "lab-tit-bench" }, svg);
    const V = PH_VZORCI[cur], own = V.barva ? `rgb(${V.barva.join(" ")} / ${V.a})` : "rgb(220 235 248 / 0.6)";
    // čaša z vzorcem in pH-meter
    const bx0 = 236, bx1 = 300, yT = 108, yB = 176;
    s("rect", { x: bx0 + 2, y: 134, width: bx1 - bx0 - 4, height: yB - 136, rx: 3, fill: own, class: "lab-ind-liq" }, svg);
    s("path", { d: `M${bx0 - 5},${yT - 2} Q${bx0},${yT} ${bx0},${yT + 5} V${yB - 5} Q${bx0},${yB} ${bx0 + 5},${yB} H${bx1 - 5} Q${bx1},${yB} ${bx1},${yB - 5} V${yT}`, class: "lab-glass" }, svg);
    label(svg, (bx0 + bx1) / 2, 190, "vzorec", "lbl small");
    const inS = B.elektroda.v === cur;
    const ex = inS ? 272 : 346, ey = inS ? 166 : 150;
    s("rect", { x: ex - 5, y: ey - 76, width: 10, height: 64, rx: 4, class: "lab-tit-electrode" }, svg);
    s("ellipse", { cx: ex, cy: ey - 8, rx: 6, ry: 8, class: "lab-tit-bulb" }, svg);
    s("path", { d: `M${ex},${ey - 76} C${ex},${ey - 100} 360,30 372,40`, class: "lab-top-cable" }, svg);
    s("rect", { x: 338, y: 14, width: 56, height: 40, rx: 6, class: "lab-ind-meter" }, svg);
    label(svg, 366, 34, "pH", "lbl inv");
    label(svg, 366, 64, B.cal ? "umerjen" : "ni umerjen", "tick small");
    if (!inS) label(svg, 346, 190, B.elektroda.cist ? "sprana" : "neoprana", "tick small");
    // epruveta z izvlečkom rdečega zelja
    epruveta(svg, 40, 70, 176, show.zelje ? rgb(show.zelje) : null, { w: 20, level: 0.5 });
    label(svg, 40, 190, "rdeče zelje", "lbl small");
    // papir in lestvica
    s("rect", { x: 110, y: 80, width: 14, height: 70, rx: 1.5, class: "lab-ind-paper" }, svg);
    if (show.papir) s("rect", { x: 110, y: 120, width: 14, height: 30, fill: rgb(show.papir) }, svg);
    label(svg, 117, 190, "papir", "lbl small");
    const cw = 25;
    PAPIR.forEach((c, i) => (s("rect", { x: 12 + i * cw, y: 210, width: cw - 2, height: 18, rx: 2, fill: rgb(c) }, svg), label(svg, 12 + i * cw + (cw - 2) / 2, 238, String(i), "tick small")));
    label(svg, 200, 252, "barvna lestvica indikatorskega papirja (pH)", "tick small");
    if (!B.goggles) label(svg, 180, 26, "brez zaščitnih očal", "lab-warn");
    merilo(svg, 166, 186, 20, "2 cm");
    svg.setAttribute("aria-label", `Vzorec ${ime(cur)}. Epruveta z rdečim zeljem: ${show.zelje ? zeljePas(B.pH(cur)).ime : "prazna"}. Indikatorski papir ${show.papir ? "obarvan" : "suh"}. Elektroda ${inS ? "v vzorcu" : "zunaj"}.`);
  }
  status();
  redraw();
  drawLine();
  draw();
}

// ================================================================ dokazne reakcije v živilih
const OKR = { kruh: "kruh", krompir: "krom.", sok: "sok", med: "med", beljak: "belj.", mleko: "mleko", olje: "olje", sladkor: "slad.", glukoza: "gluk.", voda: "voda" };
const KRATKO = { jod: "škrob", fehling: "red. sl.", biuret: "belj.", madez: "maščobe" };
export function labDokaz(el) {
  const B = new DokazBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const W = 400, H = 220;
  const svg = svgBox(W, H, "lab-bench lab-ind lab-ind-dok");
  const log = eventLog();
  const table = dataTable([
    { key: "z", label: "živilo" },
    { key: "p", label: "preskus" },
    { key: "b", label: "barva" },
    { key: "s", label: "tvoj sklep" },
  ], { empty: "Še ni preskusov. Izberi živilo in preskus ter ga izvedi." });
  const grid = svgBox(360, 40 + 22 * Object.keys(ZIVILA).length, "lab-ind-grid");
  const qBox = h("div");
  const res = {}; // `${živilo}:${preskus}` → { rgb, ime, ok }
  const rack = []; // zadnjih 6 epruvet
  let zivilo = "kruh", test = "jod", last = null, asked = false;
  const goggles = toggle("zaščitna očala", false, (v) => ((B.goggles = v), v && log.push("Nadel si si zaščitna očala.", "ok")));
  const zSel = select({ label: "živilo", options: Object.entries(ZIVILA).map(([k, v]) => [k, v.name]), value: zivilo, onChange: (v) => (zivilo = v) });
  const tSel = select({ label: "preskus", options: Object.entries(PRESKUSI).map(([k, v]) => [k, v.name]), value: test, onChange: (v) => (test = v) });
  const heat = toggle("Fehlingov preskus segrej v vreli vodni kopeli", false);
  const hyd = toggle("vzorec prej segrej s kapljico razredčene HCl", false);
  const clean = toggle("nova epruveta in sprana kapalka", true);
  const goBtn = button("Izvedi preskus", () => run(), "primary small");
  const yes = button("Snov je v živilu", () => answer(true));
  const no = button("Snovi ni", () => answer(false));
  yes.disabled = no.disabled = true;

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg), controlsBox(
        grp("1. Varnost", hint("Fehlingov in biuretni reagent vsebujeta jedek natrijev hidroksid, jodovica obarva kožo. Nosi zaščitna očala; epruveto v vreli vodi drži s prijemalko."), goggles),
        grp("2. Preskus", hint("Malo živila zmečkaj z vodo v epruveti in dodaj nekaj kapljic reagenta."), zSel, tSel, heat, hyd, clean, buttons(goBtn)),
        grp("3. Sklep", hint("Iz barve sklepaj: je iskana snov v živilu?"), buttons(yes, no)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Rezultati"), table,
      h("h4", { class: "lab-h" }, "Pregled barv"), h("figure", { class: "lab-graph-wrap" }, grid), qBox,
      notes(POENOSTAVITVE_INDIKATORJI.dokaz, "Sestava živil: USDA FoodData Central (SR Legacy). Barvne stopnje s Fehlingovim reagentom kot pri Benedictovem polkvantitativnem testu (modra, zelena, rumena, oranžna, opečnato rdeča). Ocene: meje zaznave (škrob ~0,01 %, reducirajoči sladkor ~0,1 %, beljakovine ~0,2 %, maščobe ~2 %), redčenje vzorcev, ostanek v kapalki."),
    ],
    tryText: "Napovej, katera živila vsebujejo škrob, in preveri z jodovico. Preizkusi glukozo in namizni sladkor s Fehlingovim reagentom, enkrat brez segrevanja in enkrat s segrevanjem. Kaj se zgodi s sladkorjem, če ga prej segreješ s kislino?",
  });
  el.classList.add("lab");

  function run() {
    if (!B.goggles) return log.push(OCALA, "warn");
    const r = B.preskus(zivilo, test, { segrej: heat.get(), hidroliza: hyd.get(), cista: clean.get() });
    last = { zivilo, test, r, hyd: hyd.get() && test === "fehling" };
    rack.push({ rgb: r.rgb, t: OKR[zivilo], p: { jod: "jod", fehling: "Feh.", biuret: "biur.", madez: "mad." }[test] });
    if (rack.length > 6) rack.shift();
    log.push(`${ZIVILA[zivilo].name} + ${PRESKUSI[test].name.split(" (")[0]}: <b>${r.ime}</b>.`, "info");
    if (r.brezToplote) log.push("Fehlingov reagent brez segrevanja ne reagira: raztopina ostane modra, tudi če je sladkor v živilu.", "warn");
    if (r.onesnazeno) log.push("Kapalka ni bila sprana: v epruveto je prišel ostanek prejšnjega vzorca.", "warn");
    yes.disabled = no.disabled = false;
    draw();
  }
  function answer(say) {
    if (!last) return;
    const { r } = last, k = `${last.zivilo}:${last.test}`;
    // Pravilen sklep sledi barvi; lažna barva (brez segrevanja, umazana kapalka) da napačen sklep, čeprav si barvo prav prebral.
    const ok = say === r.pravi;
    const seen = say === r.pozitiven;
    res[k] = { rgb: r.rgb, ime: r.ime, ok };
    table.add({ z: ZIVILA[last.zivilo].name + (last.hyd ? " (hidroliza)" : ""), p: KRATKO[last.test], b: h("span", {}, swatch(r.rgb, r.ime), " ", r.ime), s: `${say ? "je" : "ni"} ${ok ? "✓" : "✗"}` });
    if (ok) log.push("Sklep je pravilen.", "ok");
    else if (seen) log.push(`Barvo si prav prebral, a preskus je zavajal: ${r.brezToplote ? "brez segrevanja Fehlingov reagent ne pokaže sladkorja" : "kapalka je prenesla prejšnji vzorec"}. Ponovi pravilno.`, "warn");
    else log.push(`Poglej barvo še enkrat: brez ${PRESKUSI[last.test].snov} je ${{ jod: "rumeno rjava", fehling: "modra", biuret: "svetlo modra", madez: "madež se posuši" }[last.test]}.`, "warn");
    last = null;
    yes.disabled = no.disabled = true;
    drawGrid();
    if (Object.keys(res).length >= 6 && Object.keys(res).some((x) => x.endsWith(":fehling")) && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Zakaj med s Fehlingovim reagentom po segrevanju da opečnato rdečo oborino, namizni sladkor pa ostane moder?",
        options: [
          { t: "Med vsebuje glukozo in fruktozo, ki sta reducirajoča sladkorja; saharoza (namizni sladkor) ni reducirajoča, dokler je s kislino ne razgradiš na glukozo in fruktozo.", ok: true, why: "Reducirajoči sladkorji reducirajo modre ione Cu²⁺ v rdeči Cu₂O. V saharozi je skupina, ki bi reducirala, porabljena za vez med obema deloma. Ko jo s kislino in toploto razgradiš (hidroliza), dobiš glukozo in fruktozo, ki reagirata." },
          { t: "Namizni sladkor ni sladkor, ker je iz pese.", ok: false, why: "Saharoza iz pese ali sladkornega trsa je ista snov in je sladkor (disaharid). Le ne reducira Fehlingovega reagenta." },
          { t: "Med je bolj sladek, zato reagira močneje.", ok: false, why: "Sladkost s tem nima zveze: tudi zelo koncentrirana raztopina saharoze ostane modra." },
          { t: "Sladkor bi reagiral, če bi ga bilo več.", ok: false, why: "Tudi čista saharoza (100 %) ne da oborine. Odloča vrsta sladkorja, ne količina." },
        ],
      }));
    }
  }
  function drawGrid() {
    grid.replaceChildren();
    const keys = Object.keys(PRESKUSI), cx = (j) => 150 + j * 54;
    keys.forEach((t, j) => label(grid, cx(j), 16, KRATKO[t], "tick small"));
    Object.entries(ZIVILA).forEach(([z, v], i) => {
      const y = 40 + i * 22;
      label(grid, 4, y, v.name.split(" (")[0], "lbl small", "start");
      keys.forEach((t, j) => {
        const r = res[`${z}:${t}`];
        s("circle", { cx: cx(j), cy: y, r: 8, class: r ? "lab-ind-cell" : "lab-socket", fill: r ? rgb(r.rgb) : null }, grid);
        if (r && !r.ok) label(grid, cx(j) + 14, y, "✗", "lab-warn small");
      });
    });
    grid.setAttribute("aria-label", `Pregled barv: ${Object.entries(res).map(([k, v]) => `${ZIVILA[k.split(":")[0]].name}, ${KRATKO[k.split(":")[1]]}: ${v.ime}`).join("; ") || "še prazno"}.`);
  }
  // ---------------------------------------------------------------- risba: stojalo z epruvetami in vodna kopel
  function draw() {
    svg.replaceChildren();
    s("line", { x1: 0, y1: 176, x2: W, y2: 176, class: "lab-tit-bench" }, svg);
    s("rect", { x: 14, y: 120, width: 250, height: 10, rx: 2, class: "lab-ind-rack" }, svg);
    s("rect", { x: 20, y: 130, width: 6, height: 46, class: "lab-ind-rack" }, svg);
    s("rect", { x: 252, y: 130, width: 6, height: 46, class: "lab-ind-rack" }, svg);
    for (let i = 0; i < 6; i++) {
      const x = 42 + i * 38, t = rack[i];
      epruveta(svg, x, 60, 168, t ? rgb(t.rgb) : null, { w: 18, level: 0.4 });
      if (t) label(svg, x, 190, t.t, "tick small"), label(svg, x, 204, t.p, "tick small");
    }
    // vodna kopel na kuhalniku
    const on = heat.get();
    s("rect", { x: 292, y: 164, width: 90, height: 12, rx: 3, class: "lab-top-plate" }, svg);
    s("rect", { x: 302, y: 104, width: 70, height: 58, rx: 3, fill: "rgb(191 224 247 / 0.7)", class: "lab-ind-liq" }, svg);
    s("path", { d: "M298,96 V160 H376 V96", class: "lab-glass" }, svg);
    if (on) for (let i = 0; i < 5; i++) s("circle", { cx: 310 + i * 13, cy: 150 - (i % 2) * 18, r: 2.5, class: "lab-top-bubble" }, svg);
    label(svg, 337, 190, on ? "vrela vodna kopel" : "kopel (ne greje)", "tick small");
    if (!B.goggles) label(svg, 200, 24, "brez zaščitnih očal", "lab-warn");
    merilo(svg, 327, 200, 20, "2 cm");
    svg.setAttribute("aria-label", `Stojalo z epruvetami: ${rack.map((t) => `${t.t} ${t.p}`).join(", ") || "prazno"}. Vodna kopel ${on ? "vre" : "ne greje"}.`);
  }
  heat.querySelector("input").addEventListener("change", draw);
  drawGrid();
  draw();
}

// ================================================================ amilaza v slini razgrajuje škrob
const KRAT_EP = { t0: "0 °C", t20: "20 °C", t37: "37 °C", kuh: "kuh.", t70: "70 °C", kontrola: "brez" };
export function labSlina(el) {
  const B = new SlinaBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const W = 400, H = 238;
  const svg = svgBox(W, H, "lab-bench lab-ind lab-ind-sl");
  const log = eventLog();
  const swL = lcd("štoparica");
  const table = dataTable([{ key: "t", label: "<i>t</i> [min]" }, ...EPRUVETE.map((e) => ({ key: e.id, label: KRAT_EP[e.id] }))], { empty: "Še ni meritev. Pripravi epruvete in dodaj slino; vsako minuto kaneš kapljico iz vsake epruvete na ploščico z jodovico." });
  const graph = dataGraph({ x: [0, 80], y: [0, 40], xStep: 10, yStep: 5, xLabel: "T [°C]", yLabel: "čas razgradnje [min]", title: "Čas, ko jodovica ne pokaže več škroba, pri različnih temperaturah", origin: false });
  const qBox = h("div");
  const auto = { every: 60, next: 60 };
  let speed = 10, spots = null, asked = false;
  const starchSeg = seg("škrob", [["1", "1 % škrob"], ["5", "5 % škrob"]], "1", (v) => (B.skrob = +v));
  const same = toggle("ista kapalka za vse epruvete, brez spiranja", false, (v) => (B.ista = v));
  const goBtn = button("Dodaj slino v epruvete in zaženi štoparico", () => start(), "primary small");
  const spotBtn = button("Kapljice z jodovico zdaj", () => sample(false));
  const speedSeg = row("hitrost časa", seg("hitrost časa", [["1", "×1"], ["10", "×10"], ["60", "×60"]], "10", (v) => (speed = +v)));

  layout(el, {
    extra: [
      h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, swL)), controlsBox(
        grp("1. Priprava", hint("V šest epruvet daš po 5 mL škrobovice in jih postaviš v vodne kopeli. Slino zbereš v čisto čašo (le svojo), razredčiš jo z vodo 1 : 10. Del je prej prekuhan."), starchSeg, same, buttons(goBtn)),
        grp("2. Merjenje", hint("Vsako minuto kaneš kapljico iz vsake epruvete k jodovici na ploščici. Ko kapljica ostane rumeno rjava, škroba ni več."), speedSeg, buttons(spotBtn)),
        log,
      )),
      h("h4", { class: "lab-h" }, "Barva kapljic z jodovico"), table,
      h("h4", { class: "lab-h" }, "Čas razgradnje"), graph, qBox,
      notes(POENOSTAVITVE_INDIKATORJI.slina, "Slinska α-amilaza: optimum ~37 °C in pH 6,7–7,0, nad ~60 °C se uniči (Bernfeld 1955, Methods Enzymol. 1, 149). Ocene: oblika krivulje (Q10 = 2, povratna izguba aktivnosti nad ~40 °C, razpolovni čas 1 min pri 60 °C), Km = 0,2 %, ~5 min pri 37 °C, barvne stopnje jodovice, prenos s kapalko."),
    ],
    tryText: "Napovej, v kateri epruveti bo škrob izginil najprej. Kaj pričakuješ pri prekuhani slini? Ponovi s 5 % škrobom in z isto kapalko za vse epruvete: kaj se spremeni?",
  });
  el.classList.add("lab");

  function start() {
    B.zacni();
    auto.next = auto.every;
    table.clear();
    sample(true);
    log.push(`Slina je v epruvetah (${B.skrob} % škrob). Štoparica teče.`, "info");
    if (B.skrob > 1) log.push("Škroba je veliko: amilaza ga bo razgrajevala dolgo.", "warn");
    draw();
  }
  function sample(isAuto) {
    if (!B.tubes) return log.push("Najprej dodaj slino v epruvete.", "warn");
    const before = B.tubes.map((u) => u.tKonec);
    spots = B.vzorci();
    const row0 = { t: isAuto ? String(Math.round(B.t / 60)) : num(B.t / 60, 1) };
    spots.forEach((p) => (row0[p.id] = swatch(p.rgb, p.ime)));
    table.add(row0, { quiet: isAuto });
    B.tubes.forEach((u, i) => {
      if (before[i] == null && u.tKonec != null) log.push(`${u.name}: kapljica ostane rumeno rjava po ${num(u.tKonec / 60, 0)} min. Škroba ni več.`, "ok");
    });
    if (B.ista && B.tubes.find((u) => u.id === "kuh").tKonec != null) log.push("Prekuhana slina je »razgradila« škrob: s kapalko si vanjo prenesel amilazo iz druge epruvete.", "warn");
    redraw();
    if (B.t >= 15 * 60 && !asked) {
      asked = true;
      qBox.append(conclusion({
        text: "Kaj pokaže poskus z amilazo iz sline?",
        options: [
          { t: "Amilaza najhitreje razgrajuje škrob pri ~37 °C; pri 0 °C dela zelo počasi, pri 70 °C in po prekuhanju pa se uniči in ne dela več.", ok: true, why: "Encim je beljakovina. Ko je topleje, se molekule hitreje gibljejo in reakcija teče hitreje, a nad ~40 °C se oblika beljakovine začne spreminjati. Pri 70 °C in pri vrenju se nepovratno spremeni (denaturira). Pri 0 °C encim ni uničen: če epruveto segreješ, spet deluje." },
          { t: "Čim višja je temperatura, tem hitreje amilaza razgrajuje škrob.", ok: false, why: "Pri 70 °C škrob ostane: kapljica je še po pol ure modro črna. Encim se pri visoki temperaturi uniči." },
          { t: "Škrob razpade sam od sebe, slina ga le obarva.", ok: false, why: "V kontrolni epruveti brez sline in v epruveti s prekuhano slino škrob ostane. Razgradi ga encim amilaza." },
          { t: "Mraz amilazo za vedno uniči, zato pri 0 °C ne deluje.", ok: false, why: "Pri 0 °C amilaza deluje počasi, uničena pa ni. Uniči jo vročina." },
        ],
      }));
    }
  }
  function redraw() {
    const pts = (B.tubes || []).filter((u) => u.tKonec != null && u.id !== "kontrola").map((u) => [u.T + (u.kuhana ? 1.5 : 0), u.tKonec / 60]);
    graph.draw([{ id: "s", pts, cls: "a", shape: "o", label: "čas do rumeno rjave kapljice" }]);
  }
  ticker(el, (dt) => {
    let left = dt * speed;
    for (let g = 0; left > 1e-9 && g < 200 && B.teče; g++) {
      const d = Math.min(left, Math.max(0, auto.next - B.t));
      if (d > 0) B.step(d), (left -= d);
      if (B.t >= auto.next - 1e-6) sample(true), (auto.next += auto.every);
      if (B.t >= 40 * 60) (B.teče = false), log.push("Po 40 minutah je poskus končan.", "info");
    }
    swL.set(B.tubes ? `${Math.floor(B.t / 60)}:${String(Math.floor(B.t % 60)).padStart(2, "0")}` : "", "", B.tubes ? "od dodajanja sline" : "dodaj slino");
    if (B.teče) draw();
  }, 200);

  // ---------------------------------------------------------------- risba: šest epruvet v kopelih, ploščica z jodovico
  function draw() {
    svg.replaceChildren();
    s("line", { x1: 0, y1: 150, x2: W, y2: 150, class: "lab-tit-bench" }, svg);
    const bath = { 0: "rgb(225 240 252 / 0.8)", 20: "rgb(205 225 240 / 0.6)", 37: "rgb(247 214 190 / 0.6)", 70: "rgb(247 180 150 / 0.7)" };
    EPRUVETE.forEach((e, i) => {
      const x = 36 + i * 66, u = B.tubes?.[i];
      s("rect", { x: x - 24, y: 82, width: 48, height: 66, rx: 4, fill: bath[e.T], class: "lab-ind-bath" }, svg);
      const cloud = u ? Math.min(1, u.S / 1) : 0;
      epruveta(svg, x, 30, 140, `rgb(240 240 236 / ${0.35 + 0.5 * cloud})`, { w: 16, level: 0.55 });
      if (e.T === 0) for (let k = 0; k < 3; k++) s("rect", { x: x - 20 + k * 13, y: 88 + (k % 2) * 8, width: 9, height: 9, rx: 2, class: "lab-top-ice" }, svg);
      label(svg, x, 162, KRAT_EP[e.id], "tick small");
      const p = spots?.[i];
      s("circle", { cx: x, cy: 196, r: 14, class: "lab-ind-well" }, svg);
      s("circle", { cx: x, cy: 196, r: 10, fill: rgb(p ? p.rgb : JOD_STOPNJE[3][2]), class: "lab-ind-cell" }, svg);
    });
    label(svg, 200, 224, "ploščica z jodovico: zadnje kapljice", "tick small");
    svg.setAttribute("aria-label", `Šest epruvet v vodnih kopelih: ${EPRUVETE.map((e, i) => `${e.name}${spots?.[i] ? `, kapljica ${spots[i].ime}` : ""}`).join("; ")}.`);
  }
  redraw();
  draw();
}
