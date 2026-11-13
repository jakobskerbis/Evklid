// Virtualni laboratorij, kemija. Učenec sam izbere snovi, količine in pripomočke, meri in vidi posledice.
import { h, s, fmt, svgBox, slider, select, segmented, button, toggle, layout, label } from "./kit.js";
import { ticker, lcd, dataTable, dataGraph, conclusion, eventLog, notes, fixed } from "./lab.js";
import { Co2Bench, ACIDS, M, BUCKA, VM_SOBA, POENOSTAVITVE } from "./lab-model.js";

// Erlenmajerica 100 mL (ISO 1773): dno Ø 64 mm, stožec do višine 80 mm, vrat Ø 22 mm in 25 mm visok.
const RB = 32, RN = 11, HC = 80, HN = 25, KB = (RB - RN) / HC;
// Višina tekočine (mm) za prostornino V (mL).
export function flaskLevel(mL) {
  const V = mL * 1000;
  const Vc = (Math.PI * (RB ** 3 - (RB - KB * HC) ** 3)) / (3 * KB);
  if (V <= Vc) return (RB - Math.cbrt(RB ** 3 - (3 * KB * V) / Math.PI)) / KB;
  return Math.min(HC + HN, HC + (V - Vc) / (Math.PI * RN * RN));
}
const frac = (x) => x - Math.floor(x);
const rAt = (hmm) => (hmm <= HC ? RB - KB * hmm : RN);

// Dokaz CO₂: soda bikarbona in kislina v bučki na tehtnici, plin skozi cevko v apnico ali trska v vratu bučke.
export function labCo2(el) {
  const B = new Co2Bench({ seed: (Math.random() * 2 ** 31) | 0 });
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const svg = svgBox(400, 300, "lab-bench");
  svg.setAttribute("aria-label", "Bučka na tehtnici, cevka in epruveta");
  const log = eventLog();
  const bal = lcd("tehtnica"), clock = lcd("štoparica");
  const status = h("p", { class: "lab-status", "aria-live": "polite" });
  const table = dataTable(
    [
      { key: "t", label: "<i>t</i> [s]" },
      { key: "m", label: "<i>m</i> [g]" },
      { key: "dm", label: "Δ<i>m</i> [g]" },
      { key: "o", label: "apnica" },
    ],
    { empty: "Še ni meritev. Ko streseš sodo v kislino, pritisni »Zapiši meritev« (ali vklopi zapis vsakih 10 s)." },
  );
  const graph = dataGraph({ x: [0, 180], y: [-1, 0.1], xStep: 30, xLabel: "t [s]", yLabel: "Δm [g]", title: "Graf spremembe mase v odvisnosti od časa", origin: false });
  const qBox = h("div");
  const pts = [];
  let m0 = null, auto = false, nextAuto = 0, nEv = 0, readT = 0;
  const said = new Set();

  const acidSel = select({ label: "tekočina", options: Object.entries(ACIDS).map(([k, A]) => [k, A.name]), value: "kis" });
  const volSl = slider({ label: "merilni valj", min: 10, max: 60, step: 5, value: 30, unit: "mL" });
  const sodaSl = slider({ label: "soda bikarbona", min: 0.2, max: 5, step: 0.1, value: 1, unit: "g" });
  const goggles = toggle("zaščitna očala", false, (v) => v && log.push("Nadel si si zaščitna očala.", "ok"));
  const pourBtn = button("Nalij v bučko", () => pour(), "primary small");
  const sodaBtn = button("Stresi sodo v bučko", () => addSoda(), "primary small");
  const stopSeg = segmented({ options: [["brez", "brez zamaška"], ["cevka", "zamašek s cevko"], ["zaprto", "zamašek brez cevke"]], value: "brez", onChange: (v) => (B.setStopper(v), draw()) });
  stopSeg.setAttribute("aria-label", "zamašek");
  const tubeSel = select({ label: "v epruveti", options: [["apnica", "apnica, 10 mL"], ["voda", "voda, 10 mL"]], value: "apnica", onChange: (v) => ((B.epruveta = v), draw()) });
  const splintBtn = button("Prižgi trsko in jo podrži v vratu bučke", () => splint());
  const recBtn = button("Zapiši meritev", () => record(), "primary small");
  const autoT = toggle("zapisuj vsakih 10 s", false, (v) => ((auto = v), (nextAuto = Math.ceil(elapsed() / 10) * 10)));
  const row = (lab, ...kids) => h("div", { class: "lab-row" }, h("span", { class: "demo-slider-label" }, lab), ...kids);

  layout(el, {
    stage: [svg, h("div", { class: "lab-meters" }, bal, clock)],
    controls: [
      acidSel, volSl, h("div", { class: "demo-buttons" }, pourBtn, goggles),
      sodaSl, h("div", { class: "demo-buttons" }, sodaBtn),
      row("zamašek", stopSeg), tubeSel,
      h("div", { class: "demo-buttons" }, splintBtn),
      h("div", { class: "demo-buttons" }, recBtn, autoT),
    ],
    extra: [status, log, h("h4", { class: "lab-h" }, "Meritve"), table, graph, qBox, notes(POENOSTAVITVE.co2, "NaHCO₃ + H⁺ → Na⁺ + H₂O + CO₂. Molske mase IUPAC; topnost CO₂ (Sander 2015) in Ca(OH)₂ (CRC); citronska kislina v limoninem soku 47 g/L (Penniston 2008); molska prostornina plina pri 20 °C in 101,3 kPa 24,1 L/mol.")],
    tryText: "Kako bi dokazal, da pri reakciji sode bikarbone s kislino nastaja ogljikov dioksid? Preizkusi apnico in trsko. Kateri dokaz je zanesljiv? Napovej, za koliko gramov se zmanjša masa bučke, če porabiš 1 g sode, in to izmeri. Kaj se zgodi s 4 g sode in 60 mL kisa?",
  });
  el.classList.add("lab");

  const elapsed = () => (B.t0 == null ? 0 : B.t - B.t0);
  function pour() {
    const id = acidSel.get();
    if (ACIDS[id].nevarno && !goggles.get()) return log.push("Klorovodikova kislina je jedka. Najprej si nadeni zaščitna očala.", "warn");
    if (B.Vliq * 1000 + volSl.get() > 100) return log.push("Toliko ne gre v 100 mL bučko: tekočina bi segala v vrat.", "warn");
    const before = B.t0, mBefore = B.liquidMass;
    B.pour(id, volSl.get());
    // med poskusom: Δm štejemo od nove začetne mase (dolito tekočino tehtnica pokaže takoj)
    if (before != null && m0 != null) m0 += Math.round((B.liquidMass - mBefore) * 100) / 100;
    log.push(`Z merilnim valjem si v bučko nalil ${volSl.get()}\u00a0mL. Tekočina: ${ACIDS[id].name}.`, "info");
    if (before == null && B.t0 != null) start();
    draw();
  }
  function addSoda() {
    const before = B.t0;
    const g = B.addSoda(sodaSl.get());
    log.push(`Na tehtalni ladjici si stehtal ${fixed(g, 2)}\u00a0g sode in jo stresel v bučko.`, "info");
    if (before == null && B.t0 != null) start();
    else if (m0 != null) m0 += Math.round(g * 100) / 100;
    if (B.t0 == null && B.acid && ACIDS[B.acid.id]?.cH === 0) log.push("Soda se v vodi raztaplja, mehurčkov ni: brez kisline ni reakcije.", "info");
    draw();
  }
  function start() {
    m0 = B.readMass();
    log.push(`Začetna masa bučke s snovmi: ${fixed(m0, 2)}\u00a0g. Štoparica teče.`, "info");
    const lim = Math.max(0.5, Math.ceil(B.co2Theory() * M.CO2 * 1.15 * 2) / 2);
    graph.setAxes({ y: [-lim, 0.1], yStep: lim > 2 ? 0.5 : lim > 1 ? 0.25 : lim > 0.5 ? 0.2 : 0.1 });
    nextAuto = 10;
    redraw();
  }
  function record() {
    if (m0 == null) return log.push("Najprej daj v bučko kislino in sodo, da se reakcija začne.", "warn");
    const m = B.readMass(), t = elapsed();
    const o = B.zamasek === "cevka" && B.epruveta === "apnica" ? (B.milky() > 0.3 ? "motna" : "bistra") : "–";
    table.add({ t: fixed(t, 1), m: fixed(m, 2), dm: fixed(m - m0 + 0, 2), o });
    pts.push([t, m - m0]);
    redraw();
  }
  function redraw() {
    graph.draw([{ pts, shape: "o", cls: "a", label: "izmerjeno" }]);
  }
  function splint() {
    const r = B.splint();
    if (!r.ok) log.push("Z zamaškom na bučki trske ne moreš vstaviti. Najprej izberi »brez zamaška«.", "warn");
    draw();
  }
  const say = {
    prelito: (e) => (e.where === "cevka" ? "Pena je prišla v cevko in v epruveto! Preveč sode ali kisline za to bučko." : "Pena je prelila bučko! Del raztopine je stekel po mizi, zato je tudi izguba mase prevelika. Vzemi manj snovi."),
    zamasek: () => "Pok! Zamašek je izletel in raztopina je brizgnila. V zaprti bučki plin poveča tlak: plin mora imeti izhod.",
    motna: () => "Apnica se je pomotnila: CO₂ + Ca(OH)₂ → CaCO₃ (bela oborina) + H₂O.",
    bistra: () => "Apnica se je spet zbistrila: ob presežku CO₂ iz CaCO₃ nastane topen Ca(HCO₃)₂.",
    "trska-ugasne": (e) => `Trska je ugasnila: v vratu bučke je le še ${fmt(e.o2 * 100, 0)} % kisika (v zraku ga je 21 %).`,
    "trska-gori": (e) => `Trska gori naprej: v vratu bučke je ${fmt(e.o2 * 100, 0)} % kisika.`,
  };
  const kind = { prelito: "bad", zamasek: "bad", motna: "ok", bistra: "info", "trska-ugasne": "ok", "trska-gori": "info" };

  function tick(dt) {
    B.step(dt);
    while (nEv < B.events.length) {
      const e = B.events[nEv++];
      log.push(say[e.type](e), kind[e.type]);
    }
    if (auto && m0 != null && elapsed() >= nextAuto) (nextAuto += 10), record();
    readT += dt;
    if (readT >= 0.5) (readT = 0), readOut();
    move(dt);
    draw();
  }
  function readOut() {
    bal.set(B.readMass().toFixed(2), "g", "berljivost 0,01\u00a0g");
    clock.set(B.t0 == null ? "0.0" : elapsed().toFixed(1), "s", B.t0 == null ? "čaka na reakcijo" : "od stika sode s kislino");
    const q = B.rate * VM_SOBA * 1e6; // mL/s
    const done = B.t0 != null && (B.soda < 1e-6 || (B.acid?.nH ?? 0) < 1e-6);
    status.textContent = B.t0 == null ? "" : q > 40 ? "Burno penjenje." : q > 5 ? "Mehurčki nastajajo." : q > 0.3 ? "Penjenje se umirja." : done ? `Reakcija je končana: porabila se je ${B.soda < 1e-6 ? "vsa soda" : "vsa kislina"}.` : "";
    if (done && q < 0.3) ending();
  }
  function ending() {
    if (!said.has("end")) {
      said.add("end");
      if (!B.milkySaid && !B.events.some((e) => e.type.startsWith("trska"))) log.push("Mehurčki so nastajali. Kateri plin je to? Preizkusi ga z apnico ali s trsko.", "info");
    }
    const tested = B.milkySaid || B.events.some((e) => e.type === "trska-ugasne");
    if (tested && !said.has("q1")) {
      said.add("q1");
      qBox.append(
        conclusion({
          text: "Kako si dokazal, da je nastali plin ogljikov dioksid?",
          options: [
            { t: "Apnica se je pomotnila.", ok: true, why: "To je značilen dokaz za CO₂: s Ca(OH)₂ nastane netopen CaCO₃." },
            { t: "Trska je ugasnila.", ok: false, why: "Trska ugasne tudi v dušiku ali drugem plinu, ki ne podpira gorenja. Pove le, da plin ni kisik in da ga je veliko." },
            { t: "Nastajali so mehurčki.", ok: false, why: "Mehurčki pokažejo, da nastaja plin, ne pa kateri." },
            { t: "Masa bučke se je zmanjšala.", ok: false, why: "Pove, da je plin ušel iz bučke, ne pa, kateri plin je bil." },
          ],
        }),
      );
    }
    const lossTh = B.reacted() * M.CO2;
    const last = pts.at(-1);
    if (!said.has("q2") && last && pts.length >= 3 && B.spilled < 0.01 && B.zamasek !== "zaprto" && -last[1] < lossTh - 0.03) {
      said.add("q2");
      qBox.append(
        conclusion({
          text: `Po enačbi bi moralo iz bučke uiti ${fmt(lossTh, 2)} g CO₂ (${fmt(B.reacted() * M.NaHCO3, 2)} g sode · 44,01 / 84,01). Izmeril si ${fmt(-last[1], 2)} g. Zakaj je izmerjena izguba manjša?`,
          options: [
            { t: "Del CO₂ je še v bučki: raztopljen v tekočini in kot plin nad njo, ki uhaja počasi.", ok: true, why: "V litru vode se pri 20 °C raztopi okoli 1,7 g CO₂. CO₂ je tudi težji od zraka (1,84 g/L proti 1,20 g/L), zato bučka, polna CO₂, tehta nekaj stotink grama več. Če počakaš nekaj minut, se masa še malo zmanjša." },
            { t: "Pri kemijski reakciji se masa ne ohranja.", ok: false, why: "Masa se ohranja. Manjka le CO₂, ki je še v bučki (raztopljen v tekočini in nad njo)." },
            { t: "Tehtnica ni dovolj natančna.", ok: false, why: "Tehtnica meri na 0,01 g natančno. Ta napaka je mnogo manjša od razlike." },
          ],
        }),
      );
    }
  }

  // ---------------------------------------------------------------- risanje
  const K = 1.4, FX = 110, FB = 262, TX = 312, TT = 60, TB = 262;
  const yOf = (mm) => FB - mm * K;
  let bubbles = [], tubeBubbles = [];
  function move(dt) {
    const q = B.rate * VM_SOBA * 1e6;
    const lvl = flaskLevel(B.Vliq * 1000);
    if (!reduced) {
      const n = Math.min(12, q * dt * 0.6 + (Math.random() < q * dt * 0.6 % 1 ? 1 : 0));
      for (let i = 0; i < n; i++) bubbles.push({ x: (Math.random() - 0.5) * 1.6 * rAt(0) * K * 0.8, y: FB - 4, r: 1.5 + Math.random() * 2 });
      bubbles.forEach((b) => (b.y -= 70 * dt));
      bubbles = bubbles.filter((b) => b.y > yOf(lvl));
      if (B.zamasek === "cevka" && B.bubbles > 0) for (let i = 0; i < Math.min(6, q * dt * 0.4 + (Math.random() < 0.3 ? 1 : 0)); i++) tubeBubbles.push({ x: TX + (Math.random() - 0.5) * 8, y: TB - 14, r: 2 + Math.random() * 2 });
      tubeBubbles.forEach((b) => (b.y -= 60 * dt));
      tubeBubbles = tubeBubbles.filter((b) => b.y > TB - 90);
    } else {
      // brez gibanja: mirujoči mehurčki, njihovo število kaže hitrost nastajanja plina
      const n = Math.min(40, Math.round(q * 0.8));
      bubbles = Array.from({ length: n }, (_, i) => ({ x: Math.sin(i * 7.3) * rAt(0) * K * 0.7, y: FB - 6 - ((i * 37) % Math.max(4, lvl * K - 8)), r: 2.2 }));
      tubeBubbles = [];
    }
  }
  function draw() {
    svg.replaceChildren();
    // tehtnica
    s("rect", { x: FX - 72, y: FB + 2, width: 144, height: 30, rx: 5, class: "lab-box" }, svg);
    s("text", { x: FX, y: FB + 20, class: "tick", "text-anchor": "middle" }, svg, "tehtnica · 0,01 g");
    // stojalo za epruveto
    s("rect", { x: TX - 30, y: TB - 30, width: 60, height: 8, rx: 2, class: "lab-box" }, svg);
    s("rect", { x: TX - 30, y: TB + 6, width: 60, height: 8, rx: 2, class: "lab-box" }, svg);
    for (const x of [TX - 30, TX + 26]) s("rect", { x, y: TB - 30, width: 4, height: FB + 32 - (TB - 30), class: "lab-box" }, svg);
    // tekočina in pena v bučki
    const Vl = B.Vliq * 1000, lvl = flaskLevel(Vl);
    const trap = (h0, h1, cls) => {
      const p = [];
      for (const hh of [h0, Math.min(h1, HC), h1].filter((v, i, a) => v >= h0 && v <= h1 && a.indexOf(v) === i)) p.push([hh, rAt(hh)]);
      const L = p.map(([hh, r]) => `${FX - r * K},${yOf(hh)}`), R = p.map(([hh, r]) => `${FX + r * K},${yOf(hh)}`).reverse();
      s("polygon", { points: [...L, ...R].join(" "), class: cls }, svg);
    };
    if (Vl > 0) trap(0, lvl, `lab-liq lab-liq-${B.acid?.id || "voda"}`);
    const foamH = Math.min(HC + HN, flaskLevel(Math.min(140, Vl + B.foam * 1000))) - lvl;
    if (foamH > 0.5) {
      trap(lvl, lvl + foamH, "lab-foam");
      // mehurčki pene (pena se vidi tudi na svetlem ozadju)
      for (let i = 0, n = Math.min(90, Math.round(foamH * 1.5)); i < n; i++) {
        const hh = lvl + frac(Math.sin(i * 78.233) * 43758.5) * foamH;
        s("circle", { cx: FX + (frac(Math.sin(i * 12.9898) * 43758.5) - 0.5) * 1.7 * rAt(hh) * K, cy: yOf(hh), r: 1.6 + frac(i * 0.37) * 1.8, class: "lab-foam-b" }, svg);
      }
    }
    // soda na dnu
    const solid = B.soda * M.NaHCO3;
    if (solid > 0.005) {
      const r = Math.cbrt((3 * (solid / 1.1) * 1000) / (2 * Math.PI)) * K;
      // kupček na dnu (polelipsa nad dnom bučke)
      s("path", { d: `M${FX - r * 1.3},${FB - 1} A${r * 1.3},${r * 0.9} 0 0 1 ${FX + r * 1.3},${FB - 1} Z`, class: "lab-powder" }, svg);
    }
    bubbles.forEach((b) => s("circle", { cx: FX + b.x, cy: b.y, r: b.r, class: "lab-bubble" }, svg));
    // bučka (obris) z oznakami 25, 50, 75, 100 mL
    const xl = FX - RB * K, xr = FX + RB * K, yc = yOf(HC), yt = yOf(HC + HN);
    s("path", { d: `M${FX - RN * K},${yt} V${yc} L${xl},${FB - 5} Q${xl},${FB} ${xl + 5},${FB} H${xr - 5} Q${xr},${FB} ${xr},${FB - 5} L${FX + RN * K},${yc} V${yt}`, class: "lab-glass" }, svg);
    for (const v of [25, 50, 75, 100]) {
      const y = yOf(flaskLevel(v)), x = FX + rAt(flaskLevel(v)) * K;
      s("line", { x1: x - 12, y1: y, x2: x - 3, y2: y, class: "lab-mark" }, svg);
      s("text", { x: x - 14, y: y + 3, class: "tick small", "text-anchor": "end" }, svg, String(v));
    }
    // zamašek, cevka, epruveta
    if (B.zamasek !== "brez") s("path", { d: `M${FX - RN * K - 3},${yt - 12} H${FX + RN * K + 3} L${FX + RN * K - 1},${yt + 12} H${FX - RN * K + 1} Z`, class: "lab-stopper" }, svg);
    const tl = 55; // gladina apnice v epruveti: 10 mL v epruveti Ø 16 mm je ~65 mm visoko
    s("rect", { x: TX - 11, y: TB - tl * K, width: 22, height: tl * K, class: "lab-liq lab-liq-voda" }, svg);
    const milk = B.epruveta === "apnica" ? B.milky() : 0;
    if (milk > 0.01) {
      s("rect", { x: TX - 11, y: TB - tl * K, width: 22, height: tl * K, class: "lab-milk", opacity: Math.min(0.95, milk) }, svg);
      // bela oborina CaCO₃ kot drobni delci: motnost se vidi tudi brez razlikovanja barv
      for (let i = 0, n = Math.round(60 * Math.min(1, milk)); i < n; i++) s("circle", { cx: TX - 8 + frac(Math.sin(i * 12.9898) * 43758.5) * 16, cy: TB - 4 - frac(Math.sin(i * 78.233) * 43758.5) * (tl * K - 8), r: 1.1, class: "lab-ppt" }, svg);
    }
    tubeBubbles.forEach((b) => s("circle", { cx: b.x, cy: b.y, r: b.r, class: "lab-bubble" }, svg));
    s("path", { d: `M${TX - 11},${TT} V${TB - 8} Q${TX - 11},${TB + 3} ${TX},${TB + 3} Q${TX + 11},${TB + 3} ${TX + 11},${TB - 8} V${TT}`, class: "lab-glass" }, svg);
    label(svg, TX + 16, TT + 10, B.epruveta, "lbl small", "start");
    if (B.epruveta === "apnica") label(svg, TX + 16, TT + 26, milk > 0.3 ? "motna" : "bistra", "lbl small", "start");
    if (B.zamasek === "cevka") s("path", { d: `M${FX},${yt - 12} V30 H${TX} V${TB - 14}`, class: "lab-tube" }, svg);
    // pena, ki je prelila bučko: teče po zunanji steni in naredi lužo na mizi ob tehtnici
    if (B.spilled > 0.05 && B.zamasek === "brez") {
      const run = `M${FX + RN * K + 1.5},${yt} V${yc} L${xr + 2},${FB} H${FX + 73} V${FB + 30}`;
      s("path", { d: run, class: "lab-foam-run-edge" }, svg);
      s("path", { d: run, class: "lab-foam-run" }, svg);
      s("ellipse", { cx: FX + 72 + 20, cy: FB + 31, rx: Math.min(26, 8 + B.spilled * 3), ry: 3.5, class: `lab-liq lab-liq-${B.acid?.id || "voda"} lab-puddle` }, svg);
      if (foamH > 0.5 && lvl + foamH >= HC + HN - 0.5) s("ellipse", { cx: FX, cy: yt, rx: RN * K + 5, ry: 7, class: "lab-foam" }, svg);
    }
    // trska
    if (B.flame) {
      const x = FX + 6, y = yt + 6;
      s("line", { x1: x + 50, y1: y - 60, x2: x, y2: y, class: "lab-splint" }, svg);
      if (B.flame.out) for (let i = 0; i < 3; i++) s("circle", { cx: x + i * 4, cy: y - 8 - i * 8, r: 3 + i, class: "lab-smoke" }, svg);
      else s("path", { d: `M${x},${y - 2} q-7,-10 0,-24 q7,14 0,24 z`, class: "lab-flame" }, svg);
    }
    // merilo
    s("line", { x1: 16, y1: 22, x2: 16 + 10 * K * 2, y2: 22, class: "lab-scale" }, svg);
    s("text", { x: 16 + 10 * K, y: 17, class: "tick small", "text-anchor": "middle" }, svg, "2 cm");
    if (stopSeg.get() !== B.zamasek) stopSeg.set(B.zamasek, true); // zamašek je izletel
    splintBtn.disabled = false;
    tubeSel.hidden = B.zamasek !== "cevka";
  }

  readOut();
  redraw();
  draw();
  ticker(el, tick, 100);
}
