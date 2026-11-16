// Virtualni laboratorij, kemija: titracija kisline z NaOH ob indikatorju (model: lab-model-titracija.js).
// Učenec spere in napolni bireto, izpusti zrak iz konice, odpipetira vzorec, izbere indikator, titrira po kapljicah,
// sam odčita bireto, ponavlja do ujemanja in izračuna koncentracijo. Napake imajo posledice kot v pravem laboratoriju.
import { h, s, svgBox, select, segmented, button, toggle, layout, label, stage as stageBox, controls as controlsBox } from "./kit.js";
import { ticker, lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed, tex, en } from "./lab.js";
import { flaskLevel } from "./lab-kem.js";
import { TitrBench, VZORCI, INDIKATORJI, BIRETA, PIPETA, colourName, indicatorColor, POENOSTAVITVE_TITRACIJA } from "./lab-model-titracija.js";

// ---------------------------------------------------------------- mere pripomočkov (mm), risba v pravem razmerju
// Bireta 50 mL: notranji premer 11 mm (0,1 mL = 1,05 mm), zunanji 13 mm, 40 mm nad ničlo, 25 mm od oznake 50 do pipe,
// pipa 16 mm, konica 60 mm. Erlenmajerica 100 mL (ISO 1773, kot v lab-kem.js): dno Ø 64 mm, stožec 80 mm, vrat Ø 22 mm
// in 25 mm visok. Polnilna pipeta 25 mL: dolga 450 mm, bučka Ø 21 mm in 100 mm dolga (ocena po katalogih).
const MM_ML = BIRETA.mmNaML, BUR_ID = 11, BUR_OD = 13;
const FL = { R: 32, r: 11, rOut: 11, H: 105, Hc: 80 };
const r05 = (x) => Math.round(x / 0.05) * 0.05;
const flaskH = flaskLevel; // višina tekočine (mm) za prostornino (mL)
const flR = (hh) => (hh <= FL.Hc ? FL.R - ((FL.R - FL.r) * hh) / FL.Hc : FL.r);
const rgb = (c) => `rgb(${c.join(",")})`;
const mL = (x, d = 2) => `${fixed(x, d)} mL`;

export function labTitracija(el) {
  const B = new TitrBench({ seed: (Math.random() * 2 ** 31) | 0 });
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const W = 400, H = 566;
  const svg = svgBox(W, H, "lab-bench lab-tit");
  const log = eventLog();
  const phLcd = lcd("pH-meter");
  const status = h("p", { class: "lab-status", "aria-live": "polite" });
  const swatch = h("span", { class: "lab-tit-swatch", "aria-hidden": "true", hidden: true }); // barva raztopine ob pipi (ime barve je v status)
  const table = dataTable(
    [
      { key: "vz", label: "vzorec" },
      { key: "ind", label: "indikator" },
      { key: "r1", label: "začetni [mL]" },
      { key: "r2", label: "končni [mL]" },
      { key: "v", label: "<i>V</i> [mL]" },
    ],
    { empty: "Še ni titracij. Zapiši začetni odčitek birete, titriraj do končne točke in zapiši končni odčitek." },
  );
  const summary = h("p", { class: "lab-tit-sum", "aria-live": "polite" });
  const graph = dataGraph({ x: [0, 50], y: [0, 14], xStep: 10, yStep: 2, xLabel: "V(NaOH) [mL]", yLabel: "pH", title: "Titracijska krivulja: pH v odvisnosti od prostornine dodanega NaOH" });
  const qBox = h("div");
  const said = new Set();

  // ---------------------------------------------------------------- kontrole
  const goggles = toggle("zaščitna očala", false, (v) => ((B.goggles = v), v && log.push("Nadel si si zaščitna očala.", "ok")));
  const rinseBtn = button("Speri bireto s titrantom", () => rinse());
  const fillBtn = button("Napolni bireto z NaOH", () => fill(), "primary small");
  const purgeBtn = button("Izpusti zrak iz konice", () => purge());
  const sampleSel = select({ label: "vzorec", options: Object.entries(VZORCI).map(([k, v]) => [k, v.name]), value: "hcl" });
  // Priprava pipete in erlenmajerice (model: pipette(id, { pipeta, erlenmajerica })). Kot pri bireti: pipeto moraš sprati sam.
  const pipRinse = toggle("pipeto prej speri z vzorcem", false);
  const flaskSeg = segmented({ options: [["voda", "z destilirano vodo"], ["vzorec", "z vzorcem"]], value: "voda" });
  flaskSeg.setAttribute("aria-label", "erlenmajerico speri");
  const pipBtn = button(`Odpipetiraj ${fixed(PIPETA.V, 2)} mL v erlenmajerico`, () => pipette(), "primary small");
  const indSeg = segmented({ options: Object.entries(INDIKATORJI).map(([k, v]) => [k, v.name]), value: "fenolftalein" });
  indSeg.setAttribute("aria-label", "indikator");
  const indBtn = button("Dodaj 2 kapljici indikatorja", () => addInd());
  const phT = toggle("pH-meter v erlenmajerici", false, (v) => (v && log.push("pH-elektroda je v erlenmajerici. Zapisuj pH in volumen za titracijsko krivuljo; za celo krivuljo titriraj tudi čez ekvivalentno točko.", "info"), draw()));
  const tapSeg = segmented({ options: [["zaprta", "pipa zaprta"], ["kapljice", "po kapljicah"], ["curek", "curek"]], value: "zaprta", onChange: (v) => tap(v) });
  tapSeg.setAttribute("aria-label", "pipa birete");
  const dropBtn = button("1 kapljica", () => oneDrop(), "primary small");
  const readIn = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "lab-tit-in", placeholder: "npr. 0,35", "aria-label": "odčitek birete v mililitrih" });
  readIn.addEventListener("keydown", (e) => e.key === "Enter" && record());
  const recBtn = button("Zapiši začetni odčitek", () => record(), "primary small");
  const phBtn = button("Zapiši pH", () => recPH());
  const autoT = toggle("zapisuj pH samodejno", true);
  const cIn = h("input", { type: "text", inputmode: "decimal", autocomplete: "off", class: "lab-tit-in", placeholder: "npr. 0,0962", "aria-label": "izračunana koncentracija kisline v mol na liter" });
  cIn.addEventListener("keydown", (e) => e.key === "Enter" && checkC());
  const cBtn = button("Preveri koncentracijo", () => checkC(), "primary small");
  const calc = h("div", { class: "lab-tit-calc", hidden: true },
    h("p", { class: "muted", html: `${tex(String.raw`c(\text{kisline}) = \frac{c(\mathrm{NaOH}) \cdot V(\mathrm{NaOH})}{V(\text{vzorca})}`)}; ${tex(String.raw`c(\mathrm{NaOH}) = 0{,}1000${en("mol/L")}`)}, ${tex(String.raw`V(\text{vzorca}) = 25{,}00${en("mL")}`)}. Vzemi povprečje titracij, ki se ujemajo.` }),
    h("label", { class: "lab-tit-field" }, h("span", { class: "demo-slider-label" }, "c(kisline) [mol/L]"), cIn), h("div", { class: "demo-buttons" }, cBtn));
  const grp = (title, ...kids) => h("fieldset", { class: "lab-tit-grp" }, h("legend", {}, title), ...kids);
  const buttons = (...k) => h("div", { class: "demo-buttons" }, ...k);

  // Risba in koraki v skupnem okvirju: na širokem zaslonu drug ob drugem, risba pripeta (textbook.css, .lab-tit-top).
  layout(el, {
    extra: [h("div", { class: "lab-tit-top" }, stageBox(svg, h("div", { class: "lab-meters" }, phLcd)), controlsBox(
      grp("1. Priprava", buttons(goggles)),
      grp("2. Bireta (NaOH, 0,1000 mol/L)", buttons(rinseBtn, fillBtn, purgeBtn)),
      grp("3. Vzorec in indikator", sampleSel, buttons(pipRinse), h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, "erlenmajerico speri"), flaskSeg), buttons(pipBtn),
        h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, "indikator"), indSeg), buttons(indBtn, phT)),
      // Odčitek pred pipo: vrstni red je začetni odčitek → titracija → končni odčitek; stanje raztopine ob pipi (telefon: erlenmajerica je nad kontrolami).
      grp("4. Titracija", h("p", { class: "lab-tit-hint" }, "Najprej zapiši začetni odčitek (spodnji rob meniska v povečavi). Nato odpri pipo, blizu končne točke dodajaj po eno kapljico. Ko barva ostane, zapri pipo in zapiši končni odčitek."),
        h("label", { class: "lab-tit-field" }, h("span", { class: "demo-slider-label" }, "odčitek birete [mL]"), readIn), buttons(recBtn), tapSeg, buttons(dropBtn), h("div", { class: "lab-tit-now" }, swatch, status), buttons(phBtn, autoT)),
      log, // dnevnik v stolpcu s koraki: na širokem zaslonu ob pripeti risbi, na telefonu takoj pod koraki
    )), h("h4", { class: "lab-h" }, "Titracije"), table, summary, calc, h("h4", { class: "lab-h" }, "Titracijska krivulja (s pH-metrom)"), graph, qBox,
      notes(POENOSTAVITVE_TITRACIJA, "HCl + NaOH → NaCl + H₂O; CH₃COOH + NaOH → CH₃COONa + H₂O. pH iz bilance nabojev; K<sub>w</sub> = 1,0 · 10⁻¹⁴ in K<sub>a</sub>(CH₃COOH) = 1,75 · 10⁻⁵ pri 25 °C (CRC Handbook). Prehodna območja indikatorjev: fenolftalein 8,2–10,0, metiloranž 3,1–4,4, bromtimol modro 6,0–7,6 (CRC Handbook), pK<sub>In</sub> po Harrisu (Quantitative Chemical Analysis). Bireta 50 mL razreda A ±0,05 mL (ISO 385), polnilna pipeta 25 mL razreda A ±0,03 mL (ISO 648), kapljica ~0,05 mL (Harris). Ocene: pretok iz pipe, voda v neoprani bireti (0,8 mL), zračni mehurček (0,2–0,5 mL), barve indikatorjev, pH-meter ±0,02.")],
    tryText: "Določi neznano koncentracijo klorovodikove kisline: titriraj, dokler se dve titraciji ne ujemata na 0,10 mL, in izračunaj c. Nato titriraj ocetno kislino enkrat z metiloranžem in enkrat s fenolftaleinom. Napovej, kateri da pravi rezultat, in razloži zakaj. Kaj se zgodi, če bireto napolniš, ne da bi jo prej spral s titrantom?",
  });
  el.classList.add("lab");

  // ---------------------------------------------------------------- stanje poskusa
  let cur = null; // tekoča titracija: { R1, R1t, ind, id, trial, mehur, wrongRead }
  let pip = null; // pipetiranje: { t, dur }
  let pts = [], prevPts = [], last = null, pipR = 0; // točke pH(V) in odčitek ob pipetiranju
  let lastColour = "", colourT = 0, lastFlowWarn = 0;
  const rows = [];
  const need = () => (B.goggles ? true : (log.push("Natrijev hidroksid je jedek, tudi razredčen škoduje očem; kisline prav tako. Najprej si nadeni zaščitna očala.", "warn"), false));

  function rinse() {
    if (!need()) return;
    closeTap();
    B.rinse();
    cur = null;
    log.push("Bireto si trikrat spral z nekaj mL raztopine NaOH in jo izpraznil v čašo za odpadke. Voda iz birete je odstranjena.", "ok");
    sync();
  }
  function fill() {
    if (!need()) return;
    closeTap();
    const was = B.filled, r = B.fill();
    if (!was && r.water) log.push("Bireto si napolnil z lijakom. Bila je še mokra od pomivanja z vodo, zato je titrant zdaj malo razredčen.", "warn");
    else log.push(was ? "Bireto si dopolnil z NaOH nekoliko pod ničlo. Odstrani lijak in zapiši nov začetni odčitek." : "Bireto si z lijakom napolnil z NaOH nekoliko pod ničlo. V konici je še zrak.", "info");
    if (cur && was) (cur = null), log.push("Ker si bireto dopolnil sredi titracije, začni s to titracijo znova (nov začetni odčitek).", "warn");
    sync();
  }
  function purge() {
    if (!need()) return;
    if (!B.filled) return log.push("Bireta je prazna. Najprej jo napolni.", "warn");
    closeTap();
    const r = B.purge();
    log.push(r.mehur > 0 ? "Pipo si za trenutek povsem odprl nad čašo za odpadke: zračni mehurček je odšel iz konice, konica je polna raztopine." : "Iz konice je izteklo malo raztopine v čašo za odpadke; zraka v konici ni bilo.", "ok");
    if (cur) (cur = null), log.push("Gladina v bireti se je spremenila: zapiši nov začetni odčitek.", "warn");
    sync();
  }
  function pipette() {
    if (!need()) return;
    closeTap();
    if (cur && B.flask && B.flask.added > 0) log.push("Prejšnje titracije nisi končal (ni končnega odčitka), zato je ni v tabeli.", "warn");
    const id = sampleSel.get();
    const pipeta = pipRinse.get() ? "vzorec" : "mokra", erlenmajerica = flaskSeg.get();
    B.pipette(id, { pipeta, erlenmajerica });
    cur = null;
    pip = { t: 0, dur: reduced ? 0 : 3 };
    if (pts.length) prevPts = pts;
    pts = [];
    last = null;
    pipR = r05(B.reading());
    lastColour = "";
    if (pipeta === "mokra") log.push("Pipeta je bila še mokra od pomivanja z vodo: voda v njej je vzorec malo razredčila.", "warn");
    if (erlenmajerica === "vzorec") log.push("Erlenmajerico si splaknil z vzorcem: kapljice vzorca, ki so ostale v njej, dodajo kislino.", "warn");
    log.push(`S propipeto si v polnilno pipeto posrkal vzorec do oznake in ga izpustil v erlenmajerico: ${fixed(PIPETA.V, 2)} mL. Vzorec: ${VZORCI[id].name}.${erlenmajerica === "voda" ? " Erlenmajerica je mokra od destilirane vode, kar ne moti: množina kisline ostane enaka." : ""}`, "info");
    sync();
  }
  function addInd() {
    const id = indSeg.get();
    if (!B.flask) return log.push("Najprej odpipetiraj vzorec v erlenmajerico.", "warn");
    if (id === "brez") return log.push("Izbral si »brez indikatorja«: v erlenmajerici ne bo nobene spremembe barve.", "info");
    const r = B.addIndicator(id);
    if (!r.ok) return log.push("V erlenmajerici je že indikator. Za drug indikator vzemi novo erlenmajerico z vzorcem.", "warn");
    const ind = INDIKATORJI[id];
    log.push(`V erlenmajerico si dodal 2 kapljici indikatorja: ${ind.name} (prehod pri pH ${fixed(ind.obmocje[0], 1)}–${fixed(ind.obmocje[1], 1)}: ${ind.kisla} → ${ind.bazicna}).`, "info");
    sync();
  }
  function canFlow() {
    if (!need()) return false;
    if (!B.filled) return log.push("Bireta je prazna. Najprej jo napolni.", "warn"), false;
    if (pip) return false;
    if (!B.flask) return log.push("Pod bireto ni erlenmajerice z vzorcem. Najprej odpipetiraj vzorec.", "warn"), false;
    if (!cur) return log.push("Najprej odčitaj bireto in zapiši začetni odčitek. Brez njega ne veš, koliko NaOH si porabil.", "warn"), false;
    return true;
  }
  function tap(v) {
    if (v !== "zaprta" && !canFlow()) return tapSeg.set("zaprta", true);
    B.tap = v;
  }
  function closeTap() {
    B.tap = "zaprta";
    tapSeg.set("zaprta", true);
  }
  function oneDrop() {
    if (!canFlow()) return;
    if (B.bur.u >= BIRETA.V - 1e-6) return log.push("Gladina je pri oznaki 50 mL. Dopolni bireto in začni znova.", "warn");
    B.drop();
    drops.push({ y: 0 });
    draw();
  }
  const parse = (str) => {
    const v = Number(String(str).trim().replace(",", "."));
    return String(str).trim() === "" || !Number.isFinite(v) ? null : v;
  };
  function record() {
    const v = parse(readIn.value);
    if (!B.filled) return log.push("Bireta je prazna: ni kaj odčitati.", "warn");
    if (v == null || v < 0 || v > 50) return log.push("Vpiši odčitek birete v mL med 0 in 50, na 0,05 mL natančno (npr. 0,35 ali 24,80).", "warn");
    const Rt = B.reading();
    const off = Math.abs(v - Rt) > 0.075;
    if (off) log.push(`Zapisal si ${mL(v)}. Preveri odčitek v povečavi: oči v višini spodnjega roba meniska, štej razdelke po 0,1 mL od zadnje oštevilčene oznake navzdol.`, "warn");
    if (!cur) {
      if (!B.flask) return log.push("Najprej odpipetiraj vzorec v erlenmajerico, nato zapiši začetni odčitek.", "warn");
      if (B.flask.added > 0) return log.push("V erlenmajerico je NaOH že tekel. Za pravo titracijo vzemi novo erlenmajerico z vzorcem.", "warn");
      pipR = r05(Rt);
      cur = { R1: v, R1t: Rt, id: B.flask.id, ind: B.flask.ind, trial: B.flask.trial, mehur: B.bur.mehur, wrongRead: off };
      if (B.flask.ind === "brez") log.push("V erlenmajerici ni indikatorja. Kako boš vedel, kdaj ustaviti?", "warn");
      log.push(`Začetni odčitek: ${mL(v)}. Zdaj titriraj.`, "info");
    } else {
      if (B.flask.added > 0 && v < cur.R1) return log.push(`Končni odčitek (${mL(v)}) ne more biti manjši od začetnega (${mL(cur.R1)}): skala birete narašča navzdol.`, "warn");
      if (B.flask.added <= 0) {
        cur.R1 = v;
        cur.wrongRead = off;
        log.push(`Začetni odčitek popravljen: ${mL(v)}.`, "info");
        return sync();
      }
      closeTap();
      const f = B.flask, n0 = f.cl + f.ac, Veq = n0 / B.bur.c;
      const row = { vz: VZORCI[cur.id].short, ind: INDIKATORJI[f.ind].name, r1: fixed(cur.R1, 2), r2: fixed(v, 2), v: fixed(v - cur.R1, 2), V: v - cur.R1, id: cur.id,
        indId: f.ind, over: f.added - Veq, mehur: cur.mehur > 0 && B.bur.mehur === 0 ? cur.mehur : 0, razr: 1 - B.bur.c / B.cNaOH, read: cur.wrongRead || off, pipeta: f.pipeta, erlenmajerica: f.erlenmajerica };
      rows.push(row);
      table.add(row);
      log.push(`Končni odčitek: ${mL(v)}. Porabil si ${mL(v - cur.R1)} NaOH.`, "ok");
      cur = null;
      readIn.value = "";
      calc.hidden = false;
      if (!VZORCI[row.id].mocna) askIndicator();
      summarize();
    }
    sync();
  }
  // Titracije istega vzorca, ki se ujemajo na 0,10 mL (največ jih v oknu 0,10 mL).
  function concordant(id) {
    const V = rows.filter((r) => r.id === id).map((r) => r.V).sort((a, b) => a - b);
    let best = [];
    for (let i = 0; i < V.length; i++) {
      const g = V.filter((x) => x >= V[i] - 1e-9 && x <= V[i] + 0.1 + 1e-9);
      if (g.length > best.length) best = g;
    }
    return best;
  }
  function summarize() {
    const id = rows.at(-1).id, set = concordant(id), n = rows.filter((r) => r.id === id).length;
    if (set.length >= 2) {
      const mean = set.reduce((a, b) => a + b, 0) / set.length;
      const k = set.length, ujema = k === 2 ? "titraciji se ujemata" : k <= 4 ? "titracije se ujemajo" : "titracij se ujema";
      summary.innerHTML = `Ujemanje (${VZORCI[id].short}): ${k} ${ujema} na 0,10 mL (${set.map((x) => fixed(x, 2)).join(", ")}). Povprečje <b>${mL(mean)}</b>. Iz njega izračunaj koncentracijo.`;
    } else summary.textContent = n === 1 ? "Prva titracija je pogosto groba (z njo izveš približno porabo). Ponovi jo natančneje: blizu končne točke po kapljicah." : `Titracije vzorca ${VZORCI[id].short} se še ne ujemajo na 0,10 mL. Ponovi titracijo.`;
  }
  function checkC() {
    const v = parse(cIn.value);
    if (!rows.length) return;
    if (v == null || v <= 0) return log.push("Vpiši koncentracijo v mol/L (npr. 0,0962).", "warn");
    const id = rows.at(-1).id, set = concordant(id);
    const use = set.length >= 2 ? set : [rows.at(-1).V];
    const Vm = use.reduce((a, b) => a + b, 0) / use.length;
    const cExp = (B.cNaOH * Vm) / PIPETA.V, cTrue = B.c[id];
    if (Math.abs(v / cExp - 1) > 0.005)
      return log.push(`Račun ne drži: iz povprečne porabe ${mL(Vm)} dobiš c = 0,1000 mol/L · ${fixed(Vm, 2)} mL / 25,00 mL. Preveri račun in enote.`, "warn");
    const err = v / cTrue - 1;
    const why = [];
    const rs = rows.filter((r) => r.id === id && use.some((x) => Math.abs(x - r.V) < 1e-9));
    if (rs.some((r) => r.indId === "brez")) why.push("titracija brez indikatorja (končne točke ni videti)");
    if (rs.some((r) => r.indId === "metiloranz" && !VZORCI[id].mocna)) why.push("metiloranž pri šibki kislini spremeni barvo, ko je nevtralizirane šele okoli 30 % kisline");
    if (rs.some((r) => r.over > 0.15 && r.indId !== "brez")) why.push("preveč NaOH: končno točko si prešel (pipa je bila predolgo odprta)");
    if (rs.some((r) => r.over < -0.15 && r.indId !== "brez" && !(r.indId === "metiloranz" && !VZORCI[id].mocna))) why.push("titracijo si ustavil pred končno točko");
    if (rs.some((r) => r.mehur > 0)) why.push("zračni mehurček iz konice: odčitek je večji od prostornine, ki je stekla v erlenmajerico");
    if (rs.some((r) => r.razr > 0.002)) why.push(`bireta ni bila sprana s titrantom: voda je NaOH razredčila za ${fixed(Math.max(...rs.map((r) => r.razr)) * 100, 1)} %, zato ga porabiš več`);
    if (rs.some((r) => r.pipeta === "mokra")) why.push("pipeta ni bila sprana z vzorcem: voda v njej je vzorec razredčila, zato je v erlenmajerici manj kisline in porabiš manj NaOH");
    if (rs.some((r) => r.erlenmajerica === "vzorec")) why.push("erlenmajerica je bila sprana z vzorcem: ostanek vzorca doda kislino, zato porabiš več NaOH");
    if (rs.some((r) => r.read)) why.push("nenatančen odčitek birete");
    let t = `Račun je pravilen: c = ${fixed(v, 4)} mol/L. Prava koncentracija vzorca je ${fixed(cTrue, 4)} mol/L, tvoj rezultat odstopa za ${err >= 0 ? "+" : "−"}${fixed(Math.abs(err) * 100, 1)} %.`;
    if (Math.abs(err) <= 0.005) t += " Odlično: natančnost dobre titracije je nekaj desetink odstotka.";
    else if (why.length) t += ` Vzrok: ${why.join("; ")}.`;
    else t += " Odstopanje je večje od natančnosti pripomočkov. Ponovi titracijo skrbneje (po kapljicah blizu končne točke).";
    if (id === "kis") t += ` Nerazredčen kis ima 10-krat več: ${fixed(v * 10, 3)} mol/L, to je ${fixed(v * 10 * 60.05, 0)} g ocetne kisline v litru (približno ${fixed((v * 10 * 60.05) / 10, 1)} %).`;
    log.push(t, Math.abs(err) <= 0.005 ? "ok" : "bad");
    askIndicator();
    askOvershoot();
  }
  function askIndicator() {
    if (said.has("q1")) return;
    said.add("q1");
    qBox.append(conclusion({
      text: "Kateri indikator je primeren za titracijo ocetne kisline z natrijevim hidroksidom in zakaj?",
      options: [
        { t: "Fenolftalein, ker je pri ekvivalentni točki raztopina natrijevega acetata bazična (pH ≈ 8,7).", ok: true, why: "Acetatni ion sprejema protone iz vode (CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻), zato je pH pri ekvivalentni točki okoli 8,7. Fenolftalein spremeni barvo med pH 8,2 in 10,0, prav v strmem delu titracijske krivulje." },
        { t: "Metiloranž, ker kislino titriramo in je metiloranž v kislini rdeč.", ok: false, why: "Metiloranž postane rumen že pri pH 4,4. Pri ocetni kislini je takrat nevtralizirane šele okoli 30 % kisline (raztopina je pufer), zato je izračunana koncentracija veliko premajhna." },
        { t: "Kateri koli, saj je raztopina pri ekvivalentni točki vedno nevtralna (pH 7).", ok: false, why: "pH 7 pri ekvivalentni točki velja le za močno kislino in močno bazo. Pri šibki kislini nastane sol, katere anion je baza, zato je pH višji od 7." },
      ],
    }));
  }
  function askOvershoot() {
    if (said.has("q2")) return;
    said.add("q2");
    qBox.append(conclusion({
      text: "Pri eni titraciji si pipo pustil odprto in je raztopina s fenolftaleinom postala močno rožnata. Kakšna je koncentracija kisline, izračunana iz te titracije?",
      options: [
        { t: "Previsoka, ker je odčitana prostornina NaOH večja, kot je potrebna za nevtralizacijo.", ok: true, why: "c(kisline) = c(NaOH) · V(NaOH) / V(vzorca). Odvečni NaOH poveča V(NaOH), zato je rezultat prevelik. Zato blizu končne točke titriraš po kapljicah in ustaviš pri prvi obstojni bledo rožnati barvi." },
        { t: "Prenizka, ker je v erlenmajerici preveč baze.", ok: false, why: "Večja porabljena prostornina baze je v števcu enačbe, zato je izračunana koncentracija kisline večja, ne manjša." },
        { t: "Pravilna, saj se je barva spremenila, torej je končna točka dosežena.", ok: false, why: "Barva pove le, da je končna točka že mimo, ne pa za koliko. Pravi volumen je volumen do prve obstojne bledo rožnate barve." },
      ],
    }));
  }
  // Poraba za graf: od odčitka, ko v erlenmajerico še ni steklo nič NaOH (tudi če si bireto po pipetiranju napolnil ali dolil).
  function vNow() {
    if (B.flask && B.flask.added <= 0) pipR = r05(B.reading());
    return Math.max(0, r05(B.reading()) - pipR);
  }
  function recPH(auto = false) {
    if (!phT.get() || !B.flask) return auto ? null : log.push("Najprej vstavi pH-elektrodo v erlenmajerico z vzorcem (vklopi »pH-meter v erlenmajerici«).", "warn");
    const V = vNow(), p = B.readPH();
    if (last && Math.abs(last[0] - V) < 0.04 && auto) return;
    if (pts.length >= 250) return;
    pts.push([V, p]);
    last = [V, p];
    redraw();
  }
  // Ekvivalentna točka iz izmerjene krivulje: sredina najstrmejšega odseka, ko je skok že mimo.
  function equivalence(P) {
    const q = [...P].sort((a, b) => a[0] - b[0]);
    let best = null;
    for (let i = 1; i < q.length; i++) {
      const dV = q[i][0] - q[i - 1][0];
      if (dV <= 0) continue;
      const k = (q[i][1] - q[i - 1][1]) / dV;
      if (!best || k > best.k) best = { k, V: (q[i][0] + q[i - 1][0]) / 2, p: (q[i][1] + q[i - 1][1]) / 2, dV, i };
    }
    if (!best || best.k < 3 || q.at(-1)[1] < best.p + 0.5 || q[0][1] > best.p - 1.5) return null;
    return best;
  }
  function redraw() {
    const S = [];
    if (prevPts.length) S.push({ pts: prevPts, shape: "^", cls: "b", label: "prejšnja titracija" });
    S.push({ pts, shape: "o", cls: "a", label: "izmerjeno" });
    const eq = equivalence(pts);
    if (eq) {
      // V iz najstrmejšega odseka; pH le, če sta sosednji točki največ 0,2 mL narazen (sicer bi bila sredina skoka ugibanje).
      const pOk = eq.dV <= 0.2 + 1e-9, pTxt = pOk ? `, pH ≈ ${fixed(eq.p, 1)}` : "";
      S.push({ pts: [[eq.V, eq.p]], shape: "^", cls: "c", label: `ekvivalentna točka pri V ≈ ${mL(eq.V, 1)}${pTxt}` });
      if (!said.has(`eq${B.trial}`)) said.add(`eq${B.trial}`), log.push(`Na krivulji je skok pH: ekvivalentna točka je pri V ≈ ${mL(eq.V, 1)} (najstrmejši del krivulje)${pTxt}.${pOk ? "" : " Za pH v ekvivalentni točki blizu skoka dodajaj po kapljicah, da so meritve gostejše."}`, "ok");
    }
    graph.draw(S);
  }

  // ---------------------------------------------------------------- čas
  const drops = [];
  let dropAcc = 0;
  function tick(dt) {
    if (pip) {
      pip.t += dt;
      if (pip.t >= pip.dur) pip = null;
    }
    const before = B.flask?.added ?? 0;
    B.step(dt);
    const after = B.flask?.added ?? 0;
    if (B.tap === "kapljice" && after > before) drops.push({ y: 0 });
    while (B.events.length) {
      const e = B.events.shift();
      if (e.type === "mehurcek") log.push(`Iz konice je s curkom ušel zračni mehurček. Gladina v bireti je padla za ~${mL(e.V, 1)}, v erlenmajerico pa ta prostornina ni stekla.`, "bad");
      if (e.type === "prazna") log.push("Gladina je dosegla oznako 50 mL: pipa je zaprta. Pod oznako ne moreš odčitati.", "warn"), tapSeg.set("zaprta", true);
    }
    if (B.tap !== tapSeg.get()) tapSeg.set(B.tap, true);
    if (!reduced) {
      for (const d of drops) d.y += dt * 1.6; // pot od konice do gladine v ~0,6 s
      while (drops.length && drops[0].y >= 1) drops.shift();
    } else drops.length = 0;
    vNow();
    if (phT.get() && autoT.get() && B.flask && !pip) {
      const V = vNow(), p = B.pH();
      if (!last || (V - last[0] >= 0.5 - 1e-9) || (V > last[0] + 0.04 && Math.abs(p - last[1]) >= 0.3)) recPH(true);
    }
    // barva raztopine: dnevnik ob vsaki spremembi (tudi za bralnik zaslona)
    if (B.flask && !pip) {
      const name = colourName(INDIKATORJI[B.flask.ind], B.pH());
      if (name !== lastColour) {
        colourT += dt;
        if (colourT > 0.15 || !lastColour) {
          if (lastColour && B.flask.ind !== "brez") log.push(`Raztopina v erlenmajerici je zdaj ${name}.`, name === INDIKATORJI[B.flask.ind].bazicna || name.includes("rožnata") ? "ok" : "info");
          lastColour = name;
          colourT = 0;
        }
      } else colourT = 0;
    }
    if (B.tap === "curek" && B.flask && B.endSeen() && B.pH() > INDIKATORJI[B.flask.ind].konec + 2 && B.t - lastFlowWarn > 6 && B.flask.ind !== "brez") {
      lastFlowWarn = B.t;
      log.push("Pipa je še vedno povsem odprta, raztopina je že močno obarvana: končno točko si prešel.", "bad");
    }
    readOut();
    draw();
  }
  function readOut() {
    phLcd.set(phT.get() && B.flask ? B.readPH().toFixed(2) : "", "pH", phT.get() ? (B.flask ? "±0,02 pH" : "elektroda ni v raztopini") : "izklopljen");
    let t = "";
    if (pip) t = "Pipetiranje: vzorec izteka iz pipete ob steni erlenmajerice.";
    else if (B.flask) {
      const name = colourName(INDIKATORJI[B.flask.ind], B.pH());
      t = `Raztopina v erlenmajerici: ${name}${B.flask.ind === "brez" ? " (brez indikatorja)" : ""}.`;
      if (B.flash > 0.25 && B.flask.ind !== "brez" && !B.endSeen() && (B.flashTau || 0) > 0.8) t += ` Ob kapljici se za trenutek pokaže ${INDIKATORJI[B.flask.ind].bazicna} barva, ki ob vrtinčenju izgine.`;
      if (B.tap !== "zaprta") t += B.tap === "curek" ? " NaOH teče v curku." : " NaOH kaplja (~2 kapljici na sekundo).";
    } else if (!B.filled) t = "Bireta je prazna, erlenmajerica še ni pripravljena.";
    if (status.textContent !== t) status.textContent = t; // ne napoveduj iste vrstice 10-krat na sekundo
  }
  function sync() {
    recBtn.textContent = cur ? "Zapiši končni odčitek" : "Zapiši začetni odčitek";
    readOut();
    draw();
  }

  // ---------------------------------------------------------------- risanje
  // Levo: celota v merilu 0,6 px/mm. Desno zgoraj: povečava meniska (9 px/mm), desno spodaj: erlenmajerica od blizu (1,6 px/mm).
  const K = 0.6, BX = 112, Y0 = 84, Y50 = Y0 + BIRETA.V * MM_ML * K, BENCH = 548;
  const yR = (R) => Y0 + R * MM_ML * K;
  const FB = BENCH - 6 * K - 6 * K; // podnožje stojala 6 mm, ploščica 6 mm
  const ZX = 206, ZY = 26, ZW = 188, ZH = 236, ZK = 9; // povečava
  const CX = 206, CY = 290, CW = 188, CH = 254, CK = 1.6, CFB = CY + CH - 26; // od blizu
  const PX = 172; // pipeta v stojalu

  function flaskShape(fx, fb, k) {
    const R = FL.R * k, rr = FL.rOut * k, hc = FL.Hc * k, hh = FL.H * k;
    return `M${fx - rr},${fb - hh} V${fb - hc} L${fx - R},${fb - 4} Q${fx - R},${fb} ${fx - R + 4},${fb} H${fx + R - 4} Q${fx + R},${fb} ${fx + R},${fb - 4} L${fx + rr},${fb - hc} V${fb - hh}`;
  }
  function flaskLiquid(fx, fb, k, V, fill, parent) {
    if (V <= 0) return;
    const top = flaskH(V), p = [];
    for (const hh of [0, Math.min(top, FL.Hc), top].filter((v, i, a) => a.indexOf(v) === i)) p.push([hh, flR(hh) - 1.5]);
    const L = p.map(([hh, r]) => `${fx - r * k},${fb - 1 - hh * k}`), Rr = p.map(([hh, r]) => `${fx + r * k},${fb - 1 - hh * k}`).reverse();
    return s("polygon", { points: [...L, ...Rr].join(" "), fill, class: "lab-tit-sol" }, parent);
  }
  function draw() {
    svg.replaceChildren();
    const f = B.flask, b = B.bur;
    const sampleV = f ? (pip ? f.Vs * Math.min(1, pip.t / pip.dur) : f.V) : 0;
    const col = f && !pip ? rgb(B.colour()) : "rgb(247,250,252)";
    const R = B.reading();
    // ---- levo: stojalo, bireta, erlenmajerica, pipeta
    s("line", { x1: 4, y1: BENCH, x2: 198, y2: BENCH, class: "lab-tit-bench" }, svg);
    s("rect", { x: 14, y: BENCH - 6 * K - 0.5, width: 150, height: 6 * K + 0.5, rx: 1.5, class: "lab-box" }, svg);
    s("rect", { x: 24, y: 40, width: 6, height: BENCH - 6 * K - 40, rx: 2, class: "lab-tit-rod" }, svg);
    s("rect", { x: BX - 36, y: FB, width: 72, height: 6 * K, class: "lab-tit-tile" }, svg);
    // objemka birete
    for (const cy of [Y0 - 16, yR(47.5)]) {
      s("rect", { x: 27, y: cy - 3, width: BX - 27 - 6, height: 6, rx: 2, class: "lab-tit-rod" }, svg);
      s("rect", { x: BX - 9, y: cy - 6, width: 18, height: 12, rx: 3, class: "lab-tit-clamp" }, svg);
    }
    // titrant v bireti
    const ri = (BUR_ID / 2) * K, ro = (BUR_OD / 2) * K;
    if (B.filled) s("rect", { x: BX - ri, y: yR(R), width: 2 * ri, height: Y50 + 15 + 9.6 - yR(R), class: "lab-liq lab-liq-voda" }, svg);
    s("path", { d: `M${BX - ro},${Y0 - 40 * K} V${Y50 + 25 * K} M${BX + ro},${Y0 - 40 * K} V${Y50 + 25 * K}`, class: "lab-glass" }, svg);
    for (let v = 0; v <= 50; v += 5) {
      s("line", { x1: BX - ro, y1: yR(v), x2: BX - ro + (v % 10 ? 2.5 : 4), y2: yR(v), class: "lab-mark" }, svg);
      if (v % 10 === 0) s("text", { x: BX - ro - 3, y: yR(v) + 3.5, class: "tick small", "text-anchor": "end" }, svg, String(v));
    }
    // pipa in konica
    const ys = Y50 + 25 * K, yt = ys + 16 * K, ytip = yt + 60 * K;
    s("rect", { x: BX - 5, y: ys, width: 10, height: 16 * K, rx: 2, class: "lab-tit-cock" }, svg);
    s("rect", { x: B.tap === "zaprta" ? BX - 13 : BX + 5, y: ys + 3, width: 8, height: 4, rx: 1.5, class: "lab-tit-cock" }, svg);
    s("path", { d: `M${BX - ro},${yt} L${BX - 1},${ytip} H${BX + 1} L${BX + ro},${yt}`, class: B.filled ? "lab-liq lab-liq-voda" : "lab-tit-none" }, svg);
    s("path", { d: `M${BX - ro},${yt} L${BX - 1},${ytip} M${BX + ro},${yt} L${BX + 1},${ytip}`, class: "lab-glass" }, svg);
    if (b.mehur > 0 && B.filled) s("ellipse", { cx: BX, cy: yt + 12, rx: 2.4, ry: 5, class: "lab-tit-air" }, svg);
    // erlenmajerica
    flaskLiquid(BX, FB, K, sampleV, col, svg);
    s("path", { d: flaskShape(BX, FB, K), class: "lab-glass" }, svg);
    if (phT.get()) s("rect", { x: BX + 0.6, y: FB - FL.H * K - 30, width: 6, height: 30 + FL.H * K - 4 * K - 2, rx: 2, class: "lab-tit-electrode" }, svg);
    // pipeta 25 mL v stojalu: konica 10 mm nad mizo, oznaka na zgornjem steblu
    const pTop = BENCH - 10 * K - 450 * K, pBulb0 = pTop + 200 * K, pBulb1 = pBulb0 + 100 * K, pTip = BENCH - 10 * K;
    s("rect", { x: PX - 14, y: pBulb1 + 40, width: 28, height: 4, rx: 1.5, class: "lab-tit-rod" }, svg);
    s("path", { d: `M${PX - 2.5},${pTop} V${pBulb0} Q${PX - 6.3},${pBulb0 + 6} ${PX - 6.3},${pBulb0 + 14} V${pBulb1 - 14} Q${PX - 6.3},${pBulb1 - 6} ${PX - 2.5},${pBulb1} L${PX - 0.8},${pTip} M${PX + 2.5},${pTop} V${pBulb0} Q${PX + 6.3},${pBulb0 + 6} ${PX + 6.3},${pBulb0 + 14} V${pBulb1 - 14} Q${PX + 6.3},${pBulb1 - 6} ${PX + 2.5},${pBulb1} L${PX + 0.8},${pTip}`, class: "lab-glass" }, svg);
    s("line", { x1: PX - 4, y1: pTop + 50 * K, x2: PX + 4, y2: pTop + 50 * K, class: "lab-tit-ring" }, svg);
    label(svg, PX, pTop - 22, "pipeta", "lbl small");
    label(svg, PX, pTop - 9, "25 mL", "lbl small");
    label(svg, BX + 8, Y0 - 32, "bireta 50 mL", "lbl small", "start"); // desno od birete: levo je palica stojala
    label(svg, BX, BENCH + 12, "erlenmajerica 100 mL", "lbl small");
    // merilo 10 cm
    s("line", { x1: 40, y1: 24, x2: 40 + 100 * K, y2: 24, class: "lab-scale" }, svg);
    s("text", { x: 40 + 50 * K, y: 18, class: "tick small", "text-anchor": "middle" }, svg, "10 cm");

    drawZoom(R);
    drawClose(sampleV, col);
    svg.setAttribute("aria-label", `Bireta na stojalu nad erlenmajerico na beli ploščici; povečava meniska in pogled od blizu. ${B.filled ? `Spodnji rob meniska je med oznakama ${fixed(Math.floor(R * 10 + 1e-9) / 10, 1)} in ${fixed(Math.floor(R * 10 + 1e-9) / 10 + 0.1, 1)} mL.` : "Bireta je prazna."}`);
    // gumbi, ki trenutno nimajo smisla
    purgeBtn.disabled = !B.filled;
    indBtn.disabled = !B.flask;
    swatch.hidden = !f;
    if (f) swatch.style.background = col;
    dropBtn.disabled = !B.filled;
  }

  // povečava meniska: ±1,2 mL okoli gladine, razdelki po 0,1 mL
  function drawZoom(R) {
    const g = s("g", {}, svg);
    s("rect", { x: ZX, y: ZY, width: ZW, height: ZH, rx: 8, class: "lab-tit-win" }, g);
    label(g, ZX + ZW / 2, ZY - 12, "menisk, povečano 15×", "tick", "middle");
    const id = `${svg.uid}-zc`;
    const clip = s("clipPath", { id }, g);
    s("rect", { x: ZX, y: ZY, width: ZW, height: ZH, rx: 8 }, clip);
    const z = s("g", { "clip-path": `url(#${id})` }, g);
    const mid = ZY + ZH / 2, c = B.filled ? Math.min(BIRETA.V, Math.max(0, R)) : 0.8;
    const Y = (v) => mid + (v - c) * MM_ML * ZK;
    const tl = ZX + 70, tr = tl + BUR_ID * ZK;
    if (B.filled && R <= BIRETA.V + 1.2) {
      const ym = Y(R), cap = 2.2 * ZK; // menisk se ob steni dvigne ~2 mm (ocena za vodno raztopino v cevi Ø 11 mm)
      s("path", { d: `M${tl},${ym - cap} Q${tl + 6},${ym} ${(tl + tr) / 2},${ym} Q${tr - 6},${ym} ${tr},${ym - cap} V${ZY + ZH} H${tl} Z`, class: "lab-liq lab-liq-voda" }, z);
      s("path", { d: `M${tl},${ym - cap} Q${tl + 6},${ym} ${(tl + tr) / 2},${ym} Q${tr - 6},${ym} ${tr},${ym - cap}`, class: "lab-tit-menisk" }, z);
    }
    for (let i = Math.ceil((c - 1.4) * 10); i <= Math.floor((c + 1.4) * 10); i++) {
      if (i < 0 || i > 500) continue;
      const v = i / 10, y = Y(v), whole = i % 10 === 0, half = i % 5 === 0;
      s("line", { x1: tl, y1: y, x2: whole ? tr : tl + (half ? 0.55 : 0.32) * (tr - tl), y2: y, class: whole ? "lab-tit-gr big" : "lab-tit-gr" }, z);
      if (whole) s("text", { x: tl - 8, y: y + 5, class: "lab-tit-num", "text-anchor": "end" }, z, String(i / 10));
    }
    s("path", { d: `M${tl},${ZY} V${ZY + ZH} M${tr},${ZY} V${ZY + ZH}`, class: "lab-glass" }, z);
    if (!B.filled) label(g, (tl + tr) / 2, mid + 40, "prazna", "lbl small");
    // oko v višini meniska
    if (B.filled) {
      const ym = Y(R);
      s("path", { d: `M${ZX + 8},${ym} q8,-7 16,0 q-8,7 -16,0 z`, class: "lab-tit-eye" }, g);
      s("circle", { cx: ZX + 16, cy: ym, r: 2.4, class: "lab-tit-pupil" }, g);
      s("line", { x1: ZX + 26, y1: ym, x2: tl - 30, y2: ym, class: "lab-tit-sight" }, g);
    }
  }

  // erlenmajerica od blizu na beli ploščici, konica birete, kapljice, curek, elektroda
  function drawClose(sampleV, col) {
    const g = s("g", {}, svg);
    s("rect", { x: CX, y: CY, width: CW, height: CH, rx: 8, class: "lab-tit-win" }, g);
    label(g, CX + CW / 2, CY - 12, "erlenmajerica od blizu", "tick", "middle");
    const k = CK, fx = CX + 78, fb = CFB, neck = fb - FL.H * k;
    s("rect", { x: fx - 45 * k, y: fb, width: 90 * k, height: 6 * k, class: "lab-tit-tile" }, g);
    const liq = flaskLiquid(fx, fb, k, sampleV, col, g);
    const top = fb - 1 - flaskH(sampleV) * k;
    // lokalna barva ob kapljici
    if (B.flask && !pip && B.flash > 0.05 && B.flask.ind !== "brez" && liq) {
      const c = indicatorColor(INDIKATORJI[B.flask.ind], 13), depth = fb - 1 - top;
      s("ellipse", { cx: fx - 5 * k, cy: top + Math.min(7, depth / 2), rx: 8 + 10 * B.flash, ry: Math.min(depth / 2 - 1, 3 + 3 * B.flash), fill: rgb(c), opacity: Math.min(0.85, B.flash), class: "lab-tit-flash" }, g);
    }
    s("path", { d: flaskShape(fx, fb, k), class: "lab-glass" }, g);
    // konica birete: od zgornjega roba do 20 mm pod vrhom vratu
    const tip = neck + 15 * k, tx = fx - 4 * k;
    s("path", { d: `M${tx - 4},${CY + 2} L${tx - 1.6},${tip} H${tx + 1.6} L${tx + 4},${CY + 2} Z`, class: B.filled ? "lab-liq lab-liq-voda" : "lab-tit-none" }, g);
    s("path", { d: `M${tx - 4},${CY + 2} L${tx - 1.6},${tip} M${tx + 4},${CY + 2} L${tx + 1.6},${tip}`, class: "lab-glass" }, g);
    if (B.bur.mehur > 0 && B.filled) {
      s("ellipse", { cx: tx, cy: CY + 34, rx: 2.8, ry: 11, class: "lab-tit-air" }, g);
      label(g, tx - 8, CY + 34, "zrak", "lbl small", "end");
    }
    if (B.tap === "curek" && B.filled && sampleV > 0) s("line", { x1: tx, y1: tip, x2: tx, y2: top, class: "lab-tit-stream" }, g);
    if (!reduced) for (const d of drops) s("ellipse", { cx: tx, cy: tip + 4 + d.y * (top - tip - 4), rx: 2.2, ry: 3, class: "lab-tit-drop" }, g);
    else if (B.tap === "kapljice") s("ellipse", { cx: tx, cy: tip + 5, rx: 2.2, ry: 3, class: "lab-tit-drop" }, g);
    if (phT.get()) {
      // elektroda Ø 12 mm, steklena bučka 4 mm nad dnom
      const ex = fx - 1.5 * k, eb = fb - 4 * k;
      s("rect", { x: ex, y: CY + 2, width: 12 * k, height: eb - 6 - CY - 2, rx: 3, class: "lab-tit-electrode" }, g);
      s("ellipse", { cx: ex + 6 * k, cy: eb - 6, rx: 6 * k - 1, ry: 6, class: "lab-tit-bulb" }, g);
      label(g, ex + 12 * k + 4, CY + 22, "elektroda", "lbl small", "start");
    }
    label(g, fx, fb + 17, "bela ploščica", "tick small", "middle");
    s("line", { x1: CX + 12, y1: CY + 24, x2: CX + 12 + 20 * k, y2: CY + 24, class: "lab-scale" }, g);
    s("text", { x: CX + 12 + 10 * k, y: CY + 18, class: "tick small", "text-anchor": "middle" }, g, "2 cm");
  }

  sync();
  redraw();
  ticker(el, tick, 100);
}
