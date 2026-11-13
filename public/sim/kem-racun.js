// Simulacije pri kemiji: množina snovi, stehiometrija, omejitveni reaktant, koncentracija raztopin.
import { s, svgBox, slider, select, segmented, button, buttons, readout, layout, texBlock, fmt, clamp, label, animate, rnd } from "./kit.js";
import { parseFormula, molarMass, sub, texF, BY_SYM, NA, sci, sciTex, atomBall, beaker } from "./kem-skupno.js";

// ------------------------------------------------------------ mol: množina snovi in molska masa
const SNOVI = [
  ["H2O", "voda", "l"], ["NaCl", "natrijev klorid", "s"], ["CO2", "ogljikov dioksid", "g"], ["C6H12O6", "glukoza", "s"], ["Fe", "železo", "s"],
  ["C", "ogljik", "s"], ["O2", "kisik", "g"], ["C12H22O11", "saharoza", "s"], ["CaCO3", "kalcijev karbonat", "s"], ["H2SO4", "žveplova kislina", "l"], ["Ca(OH)2", "kalcijev hidroksid", "s"],
];
export function mol(el) {
  const out = readout();
  const svg = svgBox(340, 230);
  let k = 0, m = 18;
  const draw = () => {
    svg.replaceChildren();
    const [f, , st] = SNOVI[k], M = molarMass(f), n = m / M;
    // tehtnica
    s("rect", { x: 30, y: 180, width: 140, height: 30, rx: 6, class: "box" }, svg);
    s("rect", { x: 70, y: 186, width: 60, height: 18, rx: 3, class: "fill-soft" }, svg);
    label(svg, 100, 195, `${fmt(m, 1)} g`, "lbl small");
    s("rect", { x: 40, y: 172, width: 120, height: 8, rx: 2, class: "fill-muted" }, svg);
    const hgt = clamp(Math.sqrt(m) * 10, 6, 140);
    if (st === "g") {
      s("path", { d: `M70 172 V${172 - hgt} Q100 ${160 - hgt} 130 ${172 - hgt} V172 Z`, class: "glass" }, svg);
      for (let i = 0; i < 14; i++) s("circle", { cx: 78 + ((i * 37) % 46), cy: 168 - ((i * 53) % Math.max(8, hgt - 6)), r: 3, class: "fill-b", opacity: 0.6 }, svg);
    } else if (st === "l") {
      beaker(svg, 65, 172 - Math.max(hgt, 20) - 6, 70, Math.max(hgt, 20) + 6, Math.max(hgt, 20), "#bfdbfe", { opacity: 0.8 });
    } else s("path", { d: `M${100 - hgt * 0.55} 172 Q100 ${172 - hgt * 1.1} ${100 + hgt * 0.55} 172 Z`, class: "fill-a", opacity: 0.8 }, svg);
    // most m → n → N
    const boxes = [["m", `${fmt(m, 1)} g`], ["n", `${fmt(n, n < 0.1 ? 4 : 3)} mol`], ["N", sci(n * NA, 2)]];
    boxes.forEach(([t, v], i) => {
      const y = 20 + i * 62;
      s("rect", { x: 210, y, width: 120, height: 40, rx: 8, class: "box" }, svg);
      label(svg, 225, y + 20, t, "lbl big", "start");
      label(svg, 320, y + 20, v, "lbl small", "end");
    });
    label(svg, 270, 70, `: M = ${fmt(M, 2)} g/mol`, "tick small b");
    label(svg, 270, 132, `· Nₐ`, "tick small b");
  };
  const info = () => {
    const [f, ime] = SNOVI[k], M = molarMass(f), n = m / M, comp = parseFormula(f);
    const parts = Object.entries(comp).map(([e, c]) => `${c > 1 ? c + " \\cdot " : ""}${fmt(BY_SYM[e].M, 2)}`);
    out.innerHTML =
      texBlock(`M(${texF(f)}) = ${parts.join(" + ")} = ${fmt(M, 2)}\\ \\tfrac{\\text{g}}{\\text{mol}}`) +
      texBlock(`n = \\frac{m}{M} = \\frac{${fmt(m, 1)}\\ \\text{g}}{${fmt(M, 2)}\\ \\text{g/mol}} = ${fmt(n, n < 0.1 ? 4 : 3)}\\ \\text{mol} \\qquad N = n \\cdot N_A = ${sciTex(n * NA, 2)}`) +
      `<p><b>${ime[0].toUpperCase() + ime.slice(1)}</b>: 1 mol tehta ${fmt(M, 2)} g in vsebuje 6,02·10²³ ${Object.keys(comp).length === 1 && f.length <= 2 ? "atomov" : "formulskih enot (molekul)"}.</p>
       <p class="muted">Molska masa je vsota relativnih atomskih mas vseh atomov v formuli, zapisana v g/mol. ${SNOVI[k][2] === "g" ? `Pri normalnih pogojih (0 °C, 101,3 kPa) bi ta plin zavzel ${fmt(n * 22.4, 2)} L.` : ""}</p>`;
  };
  const sl = slider({ label: "masa", min: 1, max: 200, step: 1, value: m, unit: "g", onInput: (v) => ((m = v), draw(), info()) });
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "snov", options: SNOVI.map((x, i) => [i, `${sub(x[0])} (${x[1]})`]), value: k, onChange: (v) => ((k = +v), draw(), info()) }),
      sl,
      buttons(button("1 mol", () => sl.set(Math.round(molarMass(SNOVI[k][0]))))),
    ],
    out,
    tryText: "Koliko gramov je 1 mol vode in koliko 1 mol saharoze? Zakaj imata enako število molekul, a različno maso?",
  });
}

// ------------------------------------------------------------ stehiometrija: mase pri reakciji, omejitveni reaktant
const REAKCIJE = [
  ["2 H₂ + O₂ → 2 H₂O", [[2, "H2"], [1, "O2"]], [[2, "H2O"]]],
  ["CH₄ + 2 O₂ → CO₂ + 2 H₂O", [[1, "CH4"], [2, "O2"]], [[1, "CO2"], [2, "H2O"]]],
  ["2 Mg + O₂ → 2 MgO", [[2, "Mg"], [1, "O2"]], [[2, "MgO"]]],
  ["CaCO₃ → CaO + CO₂", [[1, "CaCO3"]], [[1, "CaO"], [1, "CO2"]]],
  ["4 Fe + 3 O₂ → 2 Fe₂O₃", [[4, "Fe"], [3, "O2"]], [[2, "Fe2O3"]]],
  ["N₂ + 3 H₂ → 2 NH₃", [[1, "N2"], [3, "H2"]], [[2, "NH3"]]],
  ["C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O", [[1, "C6H12O6"], [6, "O2"]], [[6, "CO2"], [6, "H2O"]]],
];
// Molekule za risanje: atomi z odmiki.
const SHAPES = {
  H2: [["H", -5, 0], ["H", 5, 0]], O2: [["O", -6, 0], ["O", 6, 0]], N2: [["N", -6, 0], ["N", 6, 0]], H2O: [["O", 0, 0], ["H", -8, 6], ["H", 8, 6]],
  NH3: [["N", 0, 0], ["H", -9, 5], ["H", 9, 5], ["H", 0, -9]], CH4: [["C", 0, 0], ["H", -9, -6], ["H", 9, -6], ["H", -9, 6], ["H", 9, 6]], CO2: [["C", 0, 0], ["O", -11, 0], ["O", 11, 0]],
};
const DELCI = [
  ["2 H₂ + O₂ → 2 H₂O", [2, "H2"], [1, "O2"], [[2, "H2O"]]],
  ["N₂ + 3 H₂ → 2 NH₃", [1, "N2"], [3, "H2"], [[2, "NH3"]]],
  ["CH₄ + 2 O₂ → CO₂ + 2 H₂O", [1, "CH4"], [2, "O2"], [[1, "CO2"], [2, "H2O"]]],
];

export function stehiometrija(el, { mode = "mase" } = {}) {
  return mode === "delci" ? omejitveni(el) : mase(el);
}

function mase(el) {
  const out = readout();
  const svg = svgBox(340, 220);
  let k = 0, m = 10;
  const draw = () => {
    svg.replaceChildren();
    const [, re, pr] = REAKCIJE[k];
    const [c0, f0] = re[0], n0 = m / molarMass(f0), x = n0 / c0;
    const all = [...re.map((r) => [...r, "r"]), ...pr.map((p) => [...p, "p"])];
    const W = 320 / all.length;
    const masses = all.map(([c, f]) => c * x * molarMass(f));
    // stalno merilo za izbrano reakcijo: vrh stolpca je največja masa pri 100 g prvega reaktanta
    const mMax = (Math.max(...masses) * 100) / m;
    label(svg, 330, 14, `merilo: polna višina = ${fmt(mMax, 0)} g`, "tick small", "end");
    all.forEach(([c, f, side], i) => {
      const cx = 10 + W * i + W / 2, mm = masses[i], h = (mm / mMax) * 110;
      s("rect", { x: cx - 18, y: 140 - h, width: 36, height: h, rx: 3, class: `bar ${side === "r" ? "fill-a" : "fill-b"}` }, svg);
      label(svg, cx, 132 - h, `${fmt(mm, mm < 10 ? 2 : 1)} g`, "tick small b");
      label(svg, cx, 156, sub(f), "lbl small");
      label(svg, cx, 176, `n = ${fmt(c * x, 3)} mol`, "tick small");
      label(svg, cx, 194, `M = ${fmt(molarMass(f), 1)}`, "tick small");
      if (i === re.length - 1) s("line", { x1: cx + W / 2, y1: 20, x2: cx + W / 2, y2: 200, class: "guide" }, svg);
    });
    const mr = masses.slice(0, re.length).reduce((a, b) => a + b, 0), mp = masses.slice(re.length).reduce((a, b) => a + b, 0);
    label(svg, 10 + (W * re.length) / 2, 212, `reaktanti: ${fmt(mr, 2)} g`, "tick small b");
    label(svg, 10 + W * re.length + (W * pr.length) / 2, 212, `produkti: ${fmt(mp, 2)} g`, "tick small b");
  };
  const info = () => {
    const [eq, re, pr] = REAKCIJE[k];
    const [c0, f0] = re[0], M0 = molarMass(f0), n0 = m / M0;
    const [c1, f1] = pr[0], n1 = (n0 * c1) / c0, M1 = molarMass(f1);
    out.innerHTML =
      `<p><b>${eq}</b></p>` +
      texBlock(`n(${texF(f0)}) = \\frac{${fmt(m, 1)}\\ \\text{g}}{${fmt(M0, 2)}\\ \\text{g/mol}} = ${fmt(n0, 3)}\\ \\text{mol}`) +
      texBlock(`\\frac{n(${texF(f1)})}{n(${texF(f0)})} = \\frac{${c1}}{${c0}} \\Rightarrow n(${texF(f1)}) = ${fmt(n1, 3)}\\ \\text{mol},\\quad m = n M = ${fmt(n1 * M1, 2)}\\ \\text{g}`) +
      `<p class="muted">Koeficienti v enačbi povedo razmerje <b>množin</b> (molov), ne mas. Skupna masa reaktantov je enaka skupni masi produktov (zakon o ohranitvi mase).</p>`;
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "reakcija", options: REAKCIJE.map((r, i) => [i, r[0]]), value: k, onChange: (v) => ((k = +v), draw(), info()) }),
      slider({ label: "masa 1. reaktanta", min: 1, max: 100, value: m, unit: "g", onInput: (v) => ((m = v), draw(), info()) }),
    ],
    out,
    tryText: "Koliko gramov vode nastane iz 4 g vodika? Preveri, da je masa reaktantov enaka masi produktov.",
  });
}

function omejitveni(el) {
  const out = readout();
  const svg = svgBox(340, 250);
  let k = 0, nA = 6, nB = 4, t = 0;
  const result = () => {
    const [, [ca], [cb], prods] = DELCI[k];
    const x = Math.min(Math.floor(nA / ca), Math.floor(nB / cb));
    return { x, leftA: nA - x * ca, leftB: nB - x * cb, prods: prods.map(([c, f]) => [c * x, f]) };
  };
  const mol = (f, x, y, op = 1) => {
    const g = s("g", { opacity: op }, svg);
    (SHAPES[f] || []).forEach(([sym, dx, dy]) => atomBall(g, x + dx, y + dy, sym, sym === "H" ? 5 : 7));
  };
  const grid = (list, x0, y0, cols) => list.forEach(([f, op], i) => mol(f, x0 + (i % cols) * 30, y0 + Math.floor(i / cols) * 28, op));
  const draw = () => {
    svg.replaceChildren();
    const [, [, fa], [, fb]] = DELCI[k];
    const r = result();
    s("rect", { x: 5, y: 20, width: 150, height: 210, rx: 8, class: "box" }, svg);
    s("rect", { x: 185, y: 20, width: 150, height: 210, rx: 8, class: "box" }, svg);
    label(svg, 80, 10, "pred reakcijo", "tick small b");
    label(svg, 260, 10, "po reakciji", "tick small b");
    label(svg, 170, 125, "→", "lbl big");
    grid(Array(nA).fill([fa, 1]), 22, 38, 5);
    grid(Array(nB).fill([fb, 1]), 22, 135, 5);
    if (t > 0) {
      const op = clamp(t, 0, 1);
      const list = [...r.prods.flatMap(([n, f]) => Array(n).fill([f, op])), ...Array(r.leftA).fill([fa, 1]), ...Array(r.leftB).fill([fb, 1])];
      grid(list, 202, 38, 5);
    }
  };
  const info = () => {
    const [eq, [ca, fa], [cb, fb]] = DELCI[k];
    const r = result();
    const limit = nA / ca < nB / cb ? fa : nA / ca > nB / cb ? fb : null;
    out.innerHTML = `<p><b>${eq}</b>. Pred reakcijo: ${nA} × ${sub(fa)}, ${nB} × ${sub(fb)}.</p>` +
      (t > 0
        ? `<p>Nastane ${r.prods.map(([n, f]) => `${n} × ${sub(f)}`).join(" in ")}. Ostane ${r.leftA} × ${sub(fa)} in ${r.leftB} × ${sub(fb)}.</p>
           <p>${limit ? `<b>Omejitveni reaktant je ${sub(limit)}</b>: porabi se prvi, zato določa, koliko produkta nastane. Drugi reaktant je v prebitku.` : "Reaktanta sta v točnem stehiometrijskem razmerju, porabita se oba."}</p>`
        : `<p>Pritisni <b>Reagiraj</b>. Koliko produkta nastane in kateri reaktant ostane?</p>`) +
      `<p class="muted">Razmerje ${sub(fa)} : ${sub(fb)} v enačbi je ${ca} : ${cb}.</p>`;
  };
  const anim = animate(el, (dt) => {
    t = Math.min(1, t + dt * 1.5);
    draw();
    if (t >= 1) return info(), false;
  }, { autoplay: false });
  const reset = () => ((t = 0), anim.pause(), draw(), info());
  reset();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "reakcija", options: DELCI.map((r, i) => [i, r[0]]), value: k, onChange: (v) => ((k = +v), reset()) }),
      slider({ label: "molekul 1. reaktanta", min: 0, max: 15, value: nA, onInput: (v) => ((nA = v), reset()) }),
      slider({ label: "molekul 2. reaktanta", min: 0, max: 15, value: nB, onInput: (v) => ((nB = v), reset()) }),
      buttons(button("Reagiraj", () => ((t = 0.01), anim.play()), "primary small"), button("Znova", reset)),
    ],
    out,
    tryText: "Nastavi 6 molekul H₂ in 4 molekule O₂. Kateri reaktant ostane? Kako izbereš količini, da ne ostane nič?",
  });
}

// ------------------------------------------------------------ raztopina: masni delež, množinska koncentracija
const TOPLJENCI = [
  ["NaCl", "natrijev klorid", "#e2e8f0", 36],
  ["C12H22O11", "saharoza", "#fef3c7", 200],
  ["CuSO4", "bakrov(II) sulfat", "#2563eb", 20],
  ["KMnO4", "kalijev permanganat", "#7e22ce", 6.4],
];
export function raztopina(el, { mode = "masni" } = {}) {
  const out = readout();
  const svg = svgBox(340, 230);
  const masni = mode === "masni";
  let k = masni ? 0 : 2, ms = 20, mv = 100, n = 0.05, V = 250;
  const draw = () => {
    svg.replaceChildren();
    const [f, , col, sol] = TOPLJENCI[k];
    let conc, over = 0;
    if (masni) {
      const maxS = (sol * mv) / 100;
      over = Math.max(0, ms - maxS);
      conc = Math.min(ms, maxS) / (Math.min(ms, maxS) + mv);
    } else conc = n / (V / 1000);
    const level = masni ? clamp(40 + mv * 0.9, 40, 175) : clamp(V * 0.33, 25, 175);
    const intensity = masni ? clamp(conc * 3.5, 0, 0.95) : clamp(conc * 1.8, 0, 0.95);
    beaker(svg, 40, 30, 150, 190, level, col, { opacity: 0.12 + intensity * 0.85 });
    // delci topljenca
    const N = masni ? Math.round(clamp(ms - over, 0, 100) / 2) : Math.round(n * 200);
    for (let i = 0; i < Math.min(N, 80); i++) {
      const x = 50 + ((i * 47) % 130), y = 220 - 8 - ((i * 31) % Math.max(10, level - 16));
      s("circle", { cx: x, cy: y, r: 2.5, class: "fill-text", opacity: 0.45 }, svg);
    }
    if (over > 0) for (let i = 0; i < Math.min(30, over); i++) s("rect", { x: 55 + ((i * 23) % 115), y: 208 - Math.floor(i / 10) * 5, width: 6, height: 5, style: `fill:${col}`, class: "metal" }, svg);
    // stolpec
    const val = masni ? conc * 100 : conc, max = masni ? 70 : 1;
    s("rect", { x: 260, y: 30, width: 40, height: 180, class: "bar-frame" }, svg);
    s("rect", { x: 260, y: 30 + 180 * (1 - clamp(val / max, 0, 1)), width: 40, height: 180 * clamp(val / max, 0, 1), class: "bar fill-c" }, svg);
    label(svg, 280, 20, masni ? `w = ${fmt(val, 1)} %` : `c = ${fmt(val, 3)} M`, "tick small b");
    label(svg, 115, 18, masni ? `${fmt(ms, 0)} g ${sub(f)} + ${fmt(mv, 0)} g vode` : `${fmt(n, 3)} mol ${sub(f)} v ${fmt(V, 0)} mL`, "tick small");
  };
  const info = () => {
    const [f, ime, , sol] = TOPLJENCI[k];
    if (masni) {
      const maxS = (sol * mv) / 100, dis = Math.min(ms, maxS), w = dis / (dis + mv);
      out.innerHTML =
        texBlock(`w = \\frac{m_{\\text{topljenec}}}{m_{\\text{raztopina}}} = \\frac{${fmt(dis, 1)}\\ \\text{g}}{${fmt(dis, 1)}\\ \\text{g} + ${fmt(mv, 0)}\\ \\text{g}} = ${fmt(w, 3)} = ${fmt(w * 100, 1)}\\ \\%`) +
        `<p>${ms > maxS ? `<b>Raztopina je nasičena.</b> V ${fmt(mv, 0)} g vode se pri 20 °C raztopi največ ${fmt(maxS, 1)} g snovi ${ime}, ostalih ${fmt(ms - maxS, 1)} g ostane na dnu.` : `Raztopina je nenasičena: raztopi se lahko še ${fmt(maxS - ms, 1)} g snovi.`}</p>
         <p class="muted">Topnost ${ime} pri 20 °C je približno ${sol} g na 100 g vode. Če dolijemo vodo, se masni delež zmanjša (razredčenje).</p>`;
    } else {
      const c = n / (V / 1000), M = molarMass(f);
      out.innerHTML =
        texBlock(`c = \\frac{n}{V} = \\frac{${fmt(n, 3)}\\ \\text{mol}}{${fmt(V / 1000, 3)}\\ \\text{L}} = ${fmt(c, 3)}\\ \\tfrac{\\text{mol}}{\\text{L}}`) +
        `<p>To je ${fmt(n * M, 2)} g snovi ${ime} (M = ${fmt(M, 2)} g/mol). Pri razredčenju ostane množina topljenca enaka: c₁V₁ = c₂V₂. Če prostornino podvojiš, se koncentracija razpolovi.</p>
         <p class="muted">Barva je toliko intenzivnejša, kolikor večja je koncentracija (to izkorišča spektrofotometrija).</p>`;
    }
  };
  const upd = () => (draw(), info());
  const kids = [select({ label: "topljenec", options: TOPLJENCI.map((t, i) => [i, `${sub(t[0])} (${t[1]})`]), value: k, onChange: (v) => ((k = +v), upd()) })];
  if (masni) kids.push(slider({ label: "masa topljenca", min: 0, max: 120, value: ms, unit: "g", onInput: (v) => ((ms = v), upd()) }), slider({ label: "masa vode", min: 20, max: 150, step: 5, value: mv, unit: "g", onInput: (v) => ((mv = v), upd()) }));
  else kids.push(slider({ label: "množina topljenca", min: 0.005, max: 0.25, step: 0.005, value: n, unit: "mol", onInput: (v) => ((n = v), upd()) }), slider({ label: "prostornina", min: 50, max: 500, step: 10, value: V, unit: "mL", onInput: (v) => ((V = v), upd()) }));
  upd();
  layout(el, {
    stage: svg,
    controls: kids,
    out,
    tryText: masni ? "Koliko soli moraš raztopiti v 100 g vode, da dobiš 10-odstotno raztopino? Kdaj postane raztopina nasičena?" : "Pripravi 0,1 M raztopino bakrovega sulfata. Kaj se zgodi s koncentracijo, ko podvojiš prostornino?",
  });
}
