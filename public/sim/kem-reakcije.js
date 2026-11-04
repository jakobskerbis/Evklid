// Simulacije pri kemiji: energija pri reakcijah, reaktivnost kovin, redoks, titracija, hitrost reakcij, ravnotežje, disociacija, galvanski člen in elektroliza.
import { s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, tex, texBlock, fmt, clamp, label, arrow, animate, playButton, axes, rnd } from "./kit.js";
import { sub, beaker } from "./kem-skupno.js";

// ------------------------------------------------------------ pH iz nabojne bilance
// acids: [{C, Ka}] (močna kislina: Ka = 1e8), bases: [{C, Kb}], na: koncentracija Na⁺ (močna baza)
export function solvePH({ acids = [], bases = [], na = 0 }) {
  const Kw = 1e-14;
  const f = (h) => h + na + bases.reduce((a, b) => a + (b.C * h) / (h + Kw / b.Kb), 0) - acids.reduce((a, x) => a + (x.C * x.Ka) / (x.Ka + h), 0) - Kw / h;
  let lo = -15, hi = 1;
  for (let i = 0; i < 70; i++) {
    const m = (lo + hi) / 2;
    if (f(10 ** m) > 0) hi = m;
    else lo = m;
  }
  return -(lo + hi) / 2;
}

// ------------------------------------------------------------ energija-reakcije: eksotermne in endotermne reakcije
const RX_E = [
  ["Gorenje metana", "CH₄ + 2 O₂ → CO₂ + 2 H₂O", -890, 250, "Pri gorenju se sprošča toplota, zato z zemeljskim plinom kurimo. Za vžig potrebujemo iskro (aktivacijska energija)."],
  ["Nastanek vode", "2 H₂ + O₂ → 2 H₂O", -572, 300, "Zmes vodika in kisika je pri sobni temperaturi stabilna, ob iskri pa eksplozivno zreagira."],
  ["Nevtralizacija", "HCl + NaOH → NaCl + H₂O", -57, 15, "Raztopina se pri nevtralizaciji segreje. Aktivacijska energija je majhna, reakcija je zelo hitra."],
  ["Raztapljanje amonijevega nitrata", "NH₄NO₃(s) → NH₄⁺(aq) + NO₃⁻(aq)", 26, 35, "Raztopina se ohladi: to izkoriščajo hladilne obloge za prvo pomoč."],
  ["Razkroj apnenca", "CaCO₃ → CaO + CO₂", 178, 240, "Apnenec moramo močno segrevati (žgati v apnenici), da razpade."],
  ["Fotosinteza", "6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂", 2803, 600, "Energijo za fotosintezo dobijo rastline s svetlobo. Shranjena je v glukozi."],
];

export function energijaReakcije(el) {
  const out = readout();
  const svg = svgBox(340, 260);
  let k = 0, cat = false, ball = 0;
  const sig = (u) => 1 / (1 + Math.exp(-(u - 0.5) * 14));
  const E = (u, Er, Ep, Ea) => Er * (1 - sig(u)) + Ep * sig(u) + (Ea - (Ep - Er) / 2) * Math.exp(-(((u - 0.5) / 0.13) ** 2));
  const draw = () => {
    svg.replaceChildren();
    const [, , dH, Ea0] = RX_E[k];
    const Ea = Ea0;
    const Er = 0, Ep = dH, top = Math.max(Er, Ep) + Ea + 0.05 * Math.abs(dH), bot = Math.min(Er, Ep) - 0.15 * Math.max(Math.abs(dH), Ea);
    const X = (u) => 50 + u * 230, Y = (e) => 225 - ((e - bot) / (top - bot)) * 200;
    s("line", { x1: 40, y1: 230, x2: 40, y2: 15, class: "axis" }, svg);
    s("line", { x1: 40, y1: 230, x2: 300, y2: 230, class: "axis" }, svg);
    label(svg, 18, 120, "energija (entalpija)", "tick small", "middle").setAttribute("transform", "rotate(-90 18 120)");
    label(svg, 170, 246, "potek reakcije", "tick small");
    const path = (EaX, cls) => {
      let d = "";
      for (let i = 0; i <= 120; i++) {
        const u = i / 120;
        d += (i ? "L" : "M") + X(u).toFixed(1) + " " + Y(E(u, Er, Ep, EaX)).toFixed(1);
      }
      s("path", { d, class: cls }, svg);
    };
    path(Ea, "graph-line");
    if (cat) path(Ea * 0.5, "graph-line stroke-ok dashed");
    // nivoja
    s("line", { x1: X(0), y1: Y(Er), x2: X(0.35), y2: Y(Er), class: "guide" }, svg);
    s("line", { x1: X(0.65), y1: Y(Ep), x2: X(1), y2: Y(Ep), class: "guide" }, svg);
    label(svg, X(0.06), Y(Er) + 12, "reaktanti", "tick small b");
    label(svg, X(0.92), Y(Ep) + (dH > 0 ? -10 : 12), "produkti", "tick small b");
    // Ea in ΔH
    const xa = X(0.5), yPeak = Y(Er + Ea);
    s("line", { x1: X(0.18), y1: yPeak, x2: xa, y2: yPeak, class: "guide" }, svg);
    arrow(svg, X(0.2), Y(Er), X(0.2), yPeak + 2, "a", 2);
    label(svg, X(0.2) - 4, (Y(Er) + yPeak) / 2, "Eₐ", "lbl fill-a", "end");
    arrow(svg, X(0.82), Y(Er), X(0.82), Y(Ep) + (dH > 0 ? 2 : -2), dH < 0 ? "danger" : "accent", 2);
    s("line", { x1: X(0.65), y1: Y(Er), x2: X(0.85), y2: Y(Er), class: "guide" }, svg);
    label(svg, X(0.82) + 6, (Y(Er) + Y(Ep)) / 2, `ΔH = ${dH > 0 ? "+" : "−"}${Math.abs(dH)} kJ`, `lbl small ${dH < 0 ? "fill-danger" : "fill-accent"}`, "start");
    // kroglica
    const EaB = cat ? Ea * 0.5 : Ea;
    s("circle", { cx: X(ball), cy: Y(E(ball, Er, Ep, EaB)) - 7, r: 6, class: "fill-c" }, svg);
  };
  const info = () => {
    const [name, eq, dH, Ea, note] = RX_E[k];
    out.innerHTML = `<p><b>${name}:</b> ${eq}</p><p>${dH < 0 ? `Reakcija je <b>eksotermna</b> (ΔH < 0): produkti imajo manj energije kot reaktanti, razlika se sprosti kot toplota. Okolica se <b>segreje</b>.` : `Reakcija je <b>endotermna</b> (ΔH > 0): produkti imajo več energije kot reaktanti, energijo reakcija prejme iz okolice. Okolica se <b>ohladi</b>.`}</p>
      <p>${note}</p><p class="muted">Aktivacijska energija Eₐ je »hrib«, ki ga morajo delci preplezati, da reakcija steče.${cat ? " <b>Katalizator</b> ponudi drugo pot z nižjo Eₐ (zelena črtkana črta), ΔH pa ostane enak." : ""} Diagram ni v merilu med reakcijami.</p>`;
  };
  const anim = animate(el, (dt) => {
    ball += dt * 0.35;
    if (ball > 1) ball = 0;
    draw();
  }, { autoplay: false });
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "reakcija", options: RX_E.map((r, i) => [i, r[0]]), value: k, onChange: (v) => ((k = +v), (ball = 0), draw(), info()) }),
      toggle("katalizator", cat, (v) => ((cat = v), draw(), info())),
      buttons(playButton(anim)),
    ],
    out,
    tryText: "Poišči dve endotermni reakciji. Kaj katalizator spremeni na diagramu in česa ne spremeni?",
  });
}

// ------------------------------------------------------------ reaktivnost: kovine v vodi in kislini, kovina v raztopini soli
const METALI = [
  ["K", "kalij", 4, 4, "2 K + 2 H₂O → 2 KOH + H₂", "2 K + 2 HCl → 2 KCl + H₂"],
  ["Na", "natrij", 4, 4, "2 Na + 2 H₂O → 2 NaOH + H₂", "2 Na + 2 HCl → 2 NaCl + H₂"],
  ["Ca", "kalcij", 2, 3, "Ca + 2 H₂O → Ca(OH)₂ + H₂", "Ca + 2 HCl → CaCl₂ + H₂"],
  ["Mg", "magnezij", 0.3, 3, "Mg + 2 H₂O → Mg(OH)₂ + H₂ (zelo počasi)", "Mg + 2 HCl → MgCl₂ + H₂"],
  ["Al", "aluminij", 0, 2, "", "2 Al + 6 HCl → 2 AlCl₃ + 3 H₂"],
  ["Zn", "cink", 0, 2, "", "Zn + 2 HCl → ZnCl₂ + H₂"],
  ["Fe", "železo", 0, 1, "", "Fe + 2 HCl → FeCl₂ + H₂"],
  ["Pb", "svinec", 0, 0.2, "", "Pb + 2 HCl → PbCl₂ + H₂ (zelo počasi)"],
  ["Cu", "baker", 0, 0, "", ""],
  ["Ag", "srebro", 0, 0, "", ""],
  ["Au", "zlato", 0, 0, "", ""],
];
const RED = [
  ["Mg", 2, "magnezij", "MgSO4", "#e9eef6", "magnezijev sulfat"],
  ["Zn", 2, "cink", "ZnSO4", "#e9eef6", "cinkov sulfat"],
  ["Fe", 2, "železo", "FeSO4", "#b7e4c7", "železov(II) sulfat"],
  ["Cu", 2, "baker", "CuSO4", "#3b82f6", "bakrov(II) sulfat"],
  ["Ag", 1, "srebro", "AgNO3", "#e9eef6", "srebrov nitrat"],
];
const METAL_COL = { Mg: "#c9ced6", Zn: "#a3acb9", Fe: "#6b7280", Cu: "#c2703d", Ag: "#e2e8f0" };

export function reaktivnost(el, { mode = "kisline" } = {}) {
  if (mode === "redoks") return redoks(el);
  const out = readout();
  const svg = svgBox(340, 260);
  let mi = 3, acid = true, bubbles = [], left = 1;
  const draw = () => {
    svg.replaceChildren();
    // vrsta reaktivnosti
    const W = 300 / METALI.length;
    METALI.forEach(([sym], i) => {
      const x = 20 + i * W;
      s("rect", { x: x + 1, y: 10, width: W - 2, height: 22, rx: 4, class: i === mi ? "fill-accent" : "fill-soft" }, svg);
      label(svg, x + W / 2, 21, sym, i === mi ? "lbl small inv" : "tick small b");
      if (sym === "Cu") {
        s("line", { x1: x, y1: 6, x2: x, y2: 36, class: "stroke-danger", "stroke-width": 2 }, svg);
        label(svg, x, 44, "H", "tick small fill-danger");
      }
    });
    label(svg, 20, 52, "bolj reaktivne", "tick small", "start");
    label(svg, 320, 52, "manj reaktivne", "tick small", "end");
    // epruveta
    const x = 130, y = 70, w = 80, hgt = 170;
    s("path", { d: `M${x} ${y} V${y + hgt - 30} A40 40 0 0 0 ${x + w} ${y + hgt - 30} V${y}`, class: "glass" }, svg);
    s("path", { d: `M${x + 3} ${y + 50} V${y + hgt - 30} A37 37 0 0 0 ${x + w - 3} ${y + hgt - 30} V${y + 50} Z`, style: `fill:${acid ? "#dbeafe" : "#e0f2fe"};opacity:0.9`, class: "liquid" }, svg);
    const r = METALI[mi][acid ? 3 : 2];
    const size = 14 * Math.sqrt(left);
    s("rect", { x: x + w / 2 - size, y: y + hgt - 18 - size, width: size * 2, height: size, rx: 3, style: `fill:${METAL_COL[METALI[mi][0]] || "#9aa5b8"}`, class: "metal" }, svg);
    bubbles.forEach((b) => s("circle", { cx: b.x, cy: b.y, r: b.r, class: "bubble" }, svg));
    label(svg, x + w / 2, y + 40, acid ? "HCl(aq)" : "H₂O", "tick small");
    if (r >= 4) label(svg, x + w + 10, y + 60, "burna reakcija!", "lbl small fill-danger", "start");
  };
  const info = () => {
    const [sym, ime, rw, ra, ew, ea] = METALI[mi];
    const r = acid ? ra : rw, eq = acid ? ea : ew;
    const speed = r >= 4 ? "zelo burno (nevarno, v šoli ne izvajamo)" : r >= 3 ? "hitro" : r >= 2 ? "zmerno" : r >= 1 ? "počasi" : r > 0 ? "zelo počasi" : "";
    out.innerHTML = r > 0
      ? `<p><b>${ime[0].toUpperCase() + ime.slice(1)}</b> v ${acid ? "klorovodikovi kislini" : "vodi"} reagira <b>${speed}</b>. Mehurčki so <b>vodik</b>.</p><p>${eq}</p>`
      : `<p><b>${ime[0].toUpperCase() + ime.slice(1)}</b> v ${acid ? "klorovodikovi kislini" : "vodi"} <b>ne reagira</b>. ${["Cu", "Ag", "Au"].includes(sym) ? "Je manj reaktiven od vodika (desno od H v vrsti), zato vodika iz kisline ne izpodrine." : acid ? "" : "Z vodo reagirajo le najbolj reaktivne kovine."}</p>`;
    out.innerHTML += `<p class="muted">Bolj reaktivna je kovina, laže odda elektrone. Kovine levo od vodika izpodrinijo vodik iz kislin.${sym === "Al" ? " Aluminij je prekrit z zaščitno plastjo oksida, zato reakcija steče šele po nekaj časa." : ""}</p>`;
  };
  animate(el, (dt) => {
    const r = METALI[mi][acid ? 3 : 2];
    if (r > 0 && left > 0.05 && Math.random() < r * dt * 8) bubbles.push({ x: 170 + rnd(-12, 12), y: 222, r: rnd(2, 3.5 + r / 2), v: rnd(40, 70) });
    if (r > 0) left = Math.max(0.05, left - r * dt * 0.004);
    bubbles.forEach((b) => ((b.y -= b.v * dt), (b.x += rnd(-0.5, 0.5))));
    bubbles = bubbles.filter((b) => b.y > 125);
    draw();
  });
  const reset = () => ((bubbles = []), (left = 1), draw(), info());
  reset();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "kovina", options: METALI.map((m, i) => [i, `${m[1]} (${m[0]})`]), value: mi, onChange: (v) => ((mi = +v), reset()) }),
      segmented({ options: [["kislina", "v kislino (HCl)"], ["voda", "v vodo"]], value: "kislina", onChange: (v) => ((acid = v === "kislina"), reset()) }),
    ],
    out,
    tryText: "Katere kovine ne reagirajo s klorovodikovo kislino? Zakaj iz zlata delamo nakit?",
  });
}

function redoks(el) {
  const out = readout();
  const svg = svgBox(340, 240);
  let mi = 1, si = 3, p = 0;
  const reacts = () => mi < si;
  const mix = (c1, c2, t) => {
    const a = c1.match(/\w\w/g).map((x) => parseInt(x, 16)), b = c2.match(/\w\w/g).map((x) => parseInt(x, 16));
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
  };
  const draw = () => {
    svg.replaceChildren();
    const [ms] = RED[mi], [ss, , , , scol] = RED[si];
    const prodCol = ms === "Cu" ? "#3b82f6" : RED[mi][4];
    const col = reacts() ? mix(scol, prodCol, p) : scol;
    beaker(svg, 30, 50, 130, 170, 130, col, { opacity: ss === "Cu" || ms === "Cu" ? 0.75 : 0.9 });
    // trak kovine
    s("rect", { x: 85, y: 20, width: 20, height: 180, rx: 2, style: `fill:${METAL_COL[ms]}`, class: "metal" }, svg);
    if (reacts() && p > 0) {
      const n = Math.round(p * 24);
      for (let i = 0; i < n; i++) {
        const yy = 100 + ((i * 37) % 95), side = i % 2 ? 105 : 79;
        s("circle", { cx: side + (i % 2 ? 1 : -1) * (i % 3), cy: yy, r: 2.5 + (i % 3), style: `fill:${ss === "Ag" ? "#9ca3af" : METAL_COL[ss]}` }, svg);
      }
    }
    label(svg, 95, 236, `${sub(RED[si][3])}(aq)`, "tick small");
    // pogled od blizu
    const zx = 200, zy = 60, zw = 130, zh = 150;
    s("rect", { x: zx, y: zy, width: zw, height: zh, rx: 10, class: "box" }, svg);
    label(svg, zx + zw / 2, zy - 10, "pogled od blizu", "tick small");
    s("rect", { x: zx + 2, y: zy + 2, width: 36, height: zh - 4, style: `fill:${METAL_COL[ms]}`, opacity: 0.6 }, svg);
    const k = reacts() ? Math.round(p * 5) : 0;
    for (let i = 0; i < 6; i++) {
      const y = zy + 16 + i * 23;
      if (i >= k) s("circle", { cx: zx + 26, cy: y, r: 9, style: `fill:${METAL_COL[ms]}`, class: "metal" }, svg), label(svg, zx + 26, y, ms, "tick small b");
      else {
        // atom kovine je odšel kot ion, na njegovo mesto se je usedel atom iz raztopine
        s("circle", { cx: zx + 26, cy: y, r: 9, style: `fill:${METAL_COL[ss]}`, class: "metal" }, svg);
        label(svg, zx + 26, y, ss, "tick small b");
        s("circle", { cx: zx + 70 + (i % 2) * 30, cy: y, r: 8, class: "ion-m" }, svg);
        label(svg, zx + 70 + (i % 2) * 30, y, `${ms}${RED[mi][1] > 1 ? "²" : ""}⁺`, "tick small");
      }
    }
    for (let i = k; i < 5; i++) {
      const y = zy + 22 + i * 26;
      s("circle", { cx: zx + 100 - (i % 2) * 28, cy: y, r: 8, class: "ion-x" }, svg);
      label(svg, zx + 100 - (i % 2) * 28, y, `${ss}${RED[si][1] > 1 ? "²" : ""}⁺`, "tick small");
    }
  };
  const info = () => {
    const [ms, mq, mime] = RED[mi], [ss, sq, sime, sf, , sn] = RED[si];
    if (mi === si) return (out.innerHTML = `<p>Kovina in ioni v raztopini so istega elementa, zato se ne zgodi nič.</p>`);
    if (!reacts()) return (out.innerHTML = `<p><b>Ni reakcije.</b> ${mime[0].toUpperCase() + mime.slice(1)} je manj reaktiven kot ${sime}, zato ionov ${ss}${sq > 1 ? "²" : ""}⁺ ne more reducirati.</p><p class="muted">Vrsta reaktivnosti: Mg > Zn > Fe > Cu > Ag. Bolj reaktivna kovina izpodrine manj reaktivno iz raztopine njene soli.</p>`);
    const L = mq * sq / (mq === sq ? mq : 1), a = L / mq, b = L / sq;
    const ion = (x, q) => `\\mathrm{${x}}^{${q > 1 ? q : ""}+}`;
    out.innerHTML =
      texBlock(`${a > 1 ? a : ""}\\,\\mathrm{${ms}} + ${b > 1 ? b : ""}\\,${ion(ss, sq)} \\to ${a > 1 ? a : ""}\\,${ion(ms, mq)} + ${b > 1 ? b : ""}\\,\\mathrm{${ss}}`) +
      `<p><b>Oksidacija</b> (oddaja elektronov): ${ms} → ${ms}${mq > 1 ? "²" : ""}⁺ + ${mq} e⁻<br><b>Redukcija</b> (sprejem elektronov): ${ss}${sq > 1 ? "²" : ""}⁺ + ${sq} e⁻ → ${ss}</p>
       <p>Na kovini ${mime} se nabira ${sime}${ss === "Cu" ? " (rjava prevleka), modra barva raztopine bledi" : ss === "Ag" ? " (sivi kristali)" : ""}${ms === "Cu" ? ", raztopina postaja modra zaradi ionov Cu²⁺" : ""}. Reducent je ${ms}, oksidant ${ss}${sq > 1 ? "²" : ""}⁺ (${sn}).</p>`;
  };
  const anim = animate(el, (dt) => {
    if (!reacts()) return;
    p = Math.min(1, p + dt * 0.12);
    draw();
    if (p >= 1) return false;
  }, { autoplay: false });
  const reset = () => ((p = 0), draw(), info(), reacts() && anim.play());
  reset();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "kovina", options: RED.map((r, i) => [i, `${r[2]} (${r[0]})`]), value: mi, onChange: (v) => ((mi = +v), reset()) }),
      select({ label: "raztopina", options: RED.map((r, i) => [i, `${sub(r[3])} (${r[5]})`]), value: si, onChange: (v) => ((si = +v), reset()) }),
      buttons(button("Znova", reset)),
    ],
    out,
    tryText: "Potopi baker v raztopino srebrovega nitrata. Kaj se oksidira in kaj reducira? Kaj pa, če potopiš srebro v raztopino bakrovega sulfata?",
  });
}

// ------------------------------------------------------------ titracija: nevtralizacija in titracijska krivulja
const INDIKATORJI = {
  fenolftalein: ["fenolftalein", [[0, "#f1f5f9"], [8.2, "#f1f5f9"], [10, "#ec4899"], [14, "#db2777"]], [8.2, 10]],
  univerzalni: ["univerzalni indikator", [[1, "#dc2626"], [3, "#f97316"], [5, "#facc15"], [7, "#22c55e"], [9, "#0ea5e9"], [11, "#2563eb"], [13, "#7c3aed"]], null],
  lakmus: ["lakmus", [[0, "#dc2626"], [5, "#dc2626"], [6.5, "#9333ea"], [8, "#2563eb"], [14, "#2563eb"]], [5, 8]],
  bromtimol: ["bromtimol modro", [[0, "#facc15"], [6, "#facc15"], [7, "#22c55e"], [7.6, "#2563eb"], [14, "#2563eb"]], [6, 7.6]],
  metiloranz: ["metiloranž", [[0, "#dc2626"], [3.1, "#dc2626"], [4.4, "#facc15"], [14, "#facc15"]], [3.1, 4.4]],
};
function indColor(ind, pH) {
  const st = INDIKATORJI[ind][1];
  if (pH <= st[0][0]) return st[0][1];
  for (let i = 1; i < st.length; i++)
    if (pH <= st[i][0]) {
      const t = (pH - st[i - 1][0]) / (st[i][0] - st[i - 1][0]);
      const a = st[i - 1][1].match(/\w\w/g).map((x) => parseInt(x, 16)), b = st[i][1].match(/\w\w/g).map((x) => parseInt(x, 16));
      return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * t)).join(",")})`;
    }
  return st.at(-1)[1];
}
const TIT = {
  mkmb: ["HCl (močna kislina) z NaOH", "acid", 1e8, "NaOH", "HCl"],
  skmb: ["CH₃COOH (šibka kislina) z NaOH", "acid", 1.8e-5, "NaOH", "CH₃COOH"],
  sbmk: ["NH₃ (šibka baza) s HCl", "base", 1.8e-5, "HCl", "NH₃"],
  mbmk: ["NaOH (močna baza) s HCl", "base", 1e8, "HCl", "NaOH"],
};
function titPH(kind, ca, Va, ct, Vt) {
  const [, type, K] = TIT[kind];
  const V = Va + Vt, A = (ca * Va) / V, T = (ct * Vt) / V;
  if (type === "acid") return solvePH({ acids: [{ C: A, Ka: K }], na: T });
  // baza s HCl: Cl⁻ = T (močna kislina)
  return K > 1 ? solvePH({ acids: [{ C: T, Ka: 1e8 }], na: A }) : solvePH({ acids: [{ C: T, Ka: 1e8 }], bases: [{ C: A, Kb: K }] });
}

export function titracija(el, { mode = "os" } = {}) {
  const out = readout();
  const ss = mode === "ss";
  const svg = svgBox(340, ss ? 270 : 250);
  let kind = ss ? "skmb" : "mkmb", ind = ss ? "fenolftalein" : "univerzalni", ca = 0.1, Va = 20, ct = 0.1, Vt = 0, drops = [];
  const Veq = () => (ca * Va) / ct;
  const draw = () => {
    svg.replaceChildren();
    const pH = titPH(kind, ca, Va, ct, Vt);
    const bx = ss ? 250 : 80, by = ss ? 150 : 120, bw = ss ? 70 : 120, bh = ss ? 100 : 110;
    // bireta
    const cx = bx + bw / 2;
    s("rect", { x: cx - 6, y: ss ? 20 : 10, width: 12, height: ss ? 95 : 85, rx: 2, class: "glass" }, svg);
    const lvl = 1 - Vt / 50;
    s("rect", { x: cx - 4, y: (ss ? 20 : 10) + 2 + (1 - lvl) * (ss ? 91 : 81), width: 8, height: lvl * (ss ? 91 : 81), style: "fill:#bfdbfe" }, svg);
    s("path", { d: `M${cx - 3} ${ss ? 115 : 95} L${cx} ${ss ? 128 : 108} L${cx + 3} ${ss ? 115 : 95} Z`, class: "glass" }, svg);
    drops.forEach((d) => s("circle", { cx: cx, cy: d, r: 2.5, style: "fill:#93c5fd" }, svg));
    const level = clamp(bh * 0.45 + Vt * (ss ? 0.6 : 0.9), 0, bh - 6);
    beaker(svg, bx, by, bw, bh, level, indColor(ind, pH), { opacity: 0.85 });
    label(svg, cx + 14, ss ? 30 : 20, `${TIT[kind][3]} ${fmt(ct, 2)} M`, "tick small", "start");
    // pH-meter
    if (!ss) {
      s("rect", { x: 230, y: 130, width: 90, height: 56, rx: 8, class: "box" }, svg);
      label(svg, 275, 146, "pH-meter", "tick small");
      label(svg, 275, 168, fmt(pH, 2), "lbl big");
      // delci
      const nH = pH < 7 ? Math.round(clamp(-Math.log10(1e-7) + Math.log10(10 ** -pH), 0, 7)) : 0;
      const nOH = pH > 7 ? Math.round(clamp(pH - 7, 0, 7)) : 0;
      label(svg, 275, 205, nH ? `veliko H₃O⁺` : nOH ? "veliko OH⁻" : "H₃O⁺ = OH⁻", "tick small b");
      label(svg, 275, 220, pH < 6.5 ? "kislo" : pH > 7.5 ? "bazično" : "nevtralno", "tick small");
      return;
    }
    // krivulja
    const A = axes(svg, { W: 240, H: 270, x: [0, 50], y: [0, 14], pad: 30, xStep: 10, yStep: 2, xLabel: "V / mL", yLabel: "pH" });
    const band = INDIKATORJI[ind][2];
    if (band) s("rect", { x: A.X(0), y: A.Y(band[1]), width: A.X(50) - A.X(0), height: A.Y(band[0]) - A.Y(band[1]), class: "band", style: `fill:${indColor(ind, (band[0] + band[1]) / 2)};opacity:0.25` }, svg);
    let d = "";
    for (let i = 0; i <= 200; i++) {
      const v = (i / 200) * 50;
      d += (i ? "L" : "M") + A.X(v).toFixed(1) + " " + A.Y(titPH(kind, ca, Va, ct, v)).toFixed(1);
    }
    s("path", { d, class: "graph-line", "data-name": "Titracijska krivulja" }, svg);
    const ve = Veq();
    if (ve <= 50) {
      const pe = titPH(kind, ca, Va, ct, ve);
      s("line", { x1: A.X(ve), y1: A.Y(0), x2: A.X(ve), y2: A.Y(pe), class: "guide", "data-name": "Prostornina pri TE" }, svg);
      s("circle", { cx: A.X(ve), cy: A.Y(pe), r: 4, class: "fill-danger", "data-name": "Točka ekvivalence" }, svg);
      label(svg, A.X(ve) + 5, A.Y(pe) + (TIT[kind][1] === "acid" ? 10 : -10), "TE", "tick small b", "start");
      if (TIT[kind][2] < 1) {
        const ph = titPH(kind, ca, Va, ct, ve / 2);
        s("circle", { cx: A.X(ve / 2), cy: A.Y(ph), r: 3.5, class: "fill-b", "data-name": "Polovična nevtralizacija" }, svg);
      }
    }
    s("circle", { cx: A.X(Vt), cy: A.Y(pH), r: 5, class: "fill-a", "data-name": "Trenutni pH" }, svg);
  };
  const info = () => {
    const pH = titPH(kind, ca, Va, ct, Vt), ve = Veq(), [name, type, K, tt, an] = TIT[kind];
    const color = INDIKATORJI[ind][0];
    if (!ss) {
      const ok = Math.abs(Vt - ve) < 0.25;
      out.innerHTML = `<p>V čaši je ${Va} mL HCl (c = ${fmt(ca, 2)} mol/L) in ${color}. Dodali smo <b>${fmt(Vt, 1)} mL</b> NaOH. pH = <b>${fmt(pH, 2)}</b>.</p>
        <p>${ok ? '<b class="ok-text">Nevtralizacija je končana!</b> Vsi oksonijevi ioni so zreagirali s hidroksidnimi: H₃O⁺ + OH⁻ → 2 H₂O. V čaši je raztopina NaCl, pH = 7.' : Vt < ve ? `Kislina je še v prebitku. Do nevtralizacije manjka še ${fmt(ve - Vt, 1)} mL baze.` : "Baza je v prebitku, raztopina je bazična."}</p>
        <p class="muted">HCl + NaOH → NaCl + H₂O. Pri nevtralizaciji nastaneta sol in voda.</p>`;
      return;
    }
    const pe = titPH(kind, ca, Va, ct, ve);
    const good = Object.entries(INDIKATORJI).filter(([, v]) => v[2] && v[2][0] <= pe + 1.2 && v[2][1] >= pe - 1.2).map(([, v]) => v[0]);
    out.innerHTML =
      texBlock(`V_{\\mathrm{TE}} = \\frac{c_{\\text{analit}}\\, V_{\\text{analit}}}{c_{\\text{titrant}}} = \\frac{${fmt(ca, 2)} \\cdot ${Va}}{${fmt(ct, 2)}} = ${fmt(ve, 1)}\\ \\text{mL}`) +
      `<p>Pri ${fmt(Vt, 1)} mL ${tt} je pH = <b>${fmt(pH, 2)}</b>. V točki ekvivalence (TE) je pH = <b>${fmt(pe, 2)}</b>${K < 1 ? (type === "acid" ? ": nastane acetatni ion, ki je šibka baza, zato je pH > 7" : ": nastane amonijev ion, ki je šibka kislina, zato je pH < 7") : ""}.</p>
       ${K < 1 ? `<p>Pri polovični nevtralizaciji (${fmt(ve / 2, 1)} mL, turkizna pika) velja pH = p${type === "acid" ? "K<sub>a</sub>" : "K<sub>a</sub>(NH₄⁺)"} = ${fmt(type === "acid" ? -Math.log10(K) : 14 + Math.log10(K), 2)}. Tam je raztopina pufer.</p>` : ""}
       <p class="muted">Primerni indikatorji (preskok blizu pH v TE): ${good.join(", ") || "noben od ponujenih"}. Pas na grafu kaže območje preskoka barve izbranega indikatorja.</p>`;
  };
  let target = null;
  const anim = animate(el, (dt) => {
    if (Math.random() < dt * 6) drops.push(ss ? 128 : 108);
    drops = drops.map((d) => d + dt * 120).filter((d) => d < (ss ? 175 : 160));
    const rate = Math.abs(Vt - Veq()) < 2 ? 0.6 : 2.5;
    Vt = Math.min(50, Vt + rate * dt);
    if (target != null && Vt >= target) Vt = target;
    vs.set(Math.round(Vt * 10) / 10, true);
    draw();
    info();
    if (Vt >= 50 || (target != null && Vt >= target)) return false;
  }, { autoplay: false });
  const vs = slider({ label: `dodan ${ss ? "titrant" : "NaOH"}`, min: 0, max: 50, step: 0.1, value: Vt, unit: "mL", onInput: (v) => ((Vt = v), anim.pause(), (drops = []), draw(), info()) });
  const kids = [vs];
  if (ss) {
    kids.unshift(select({ label: "titracija", options: Object.entries(TIT).map(([k, v]) => [k, v[0]]), value: kind, onChange: (v) => ((kind = v), draw(), info()) }));
    kids.push(slider({ label: "c analita", min: 0.02, max: 0.2, step: 0.01, value: ca, unit: "mol/L", onInput: (v) => ((ca = v), draw(), info()) }));
  }
  kids.push(select({ label: "indikator", options: Object.entries(INDIKATORJI).map(([k, v]) => [k, v[0]]), value: ind, onChange: (v) => ((ind = v), draw(), info()) }));
  kids.push(buttons(playButton(anim, { play: "Kapljaj", pause: "Ustavi" }), button("Znova", () => ((Vt = 0), anim.pause(), (drops = []), vs.set(0)))));
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: kids,
    out,
    tryText: ss ? "Primerjaj krivulji močne in šibke kisline. Zakaj fenolftalein ustreza za ocetno kislino, metiloranž pa ne?" : "Kapljaj bazo, dokler indikator ne spremeni barve. Pri koliko mL je raztopina nevtralna? Poskusi še s fenolftaleinom.",
  });
}

// ------------------------------------------------------------ hitrost: hitrost reakcije in trki delcev
export function hitrost(el) {
  const out = readout();
  const svg = svgBox(340, 320);
  const box = { x: 10, y: 10, w: 320, h: 180 };
  let T = 20, n0 = 15, cat = false, P = [], time = 0, hist = [], coll = 0, ok = 0, acc = 0;
  const sigma = () => 45 * Math.sqrt((T + 273) / 293);
  const gauss = () => Math.sqrt(-2 * Math.log(Math.random() + 1e-9)) * Math.cos(2 * Math.PI * Math.random());
  const reset = () => {
    P = [];
    for (let i = 0; i < 2 * n0; i++) P.push({ t: i < n0 ? "A" : "B", x: rnd(box.x + 10, box.x + box.w - 10), y: rnd(box.y + 10, box.y + box.h - 10), vx: gauss() * sigma(), vy: gauss() * sigma() });
    time = 0;
    hist = [[0, n0]];
    coll = ok = 0;
    acc = 0;
  };
  const Ea = () => (cat ? 1.4 : 3.2);
  const step = (dt) => {
    time += dt;
    P.forEach((p) => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const r = p.t === "C" ? 8 : 6;
      if (p.x < box.x + r) (p.x = box.x + r), (p.vx = Math.abs(p.vx));
      if (p.x > box.x + box.w - r) (p.x = box.x + box.w - r), (p.vx = -Math.abs(p.vx));
      if (p.y < box.y + r) (p.y = box.y + r), (p.vy = Math.abs(p.vy));
      if (p.y > box.y + box.h - r) (p.y = box.y + box.h - r), (p.vy = -Math.abs(p.vy));
    });
    const s0 = 45;
    for (let i = 0; i < P.length; i++)
      for (let j = i + 1; j < P.length; j++) {
        const a = P[i], b = P[j];
        if (a.dead || b.dead) continue;
        const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy, R = (a.t === "C" ? 8 : 6) + (b.t === "C" ? 8 : 6);
        if (d2 > R * R || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
        const rv = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (rv <= 0) continue;
        if ((a.t === "A" && b.t === "B") || (a.t === "B" && b.t === "A")) {
          coll++;
          const E = (rv * rv) / (2 * s0 * s0);
          if (E > Ea()) {
            ok++;
            a.t = "C";
            a.vx = (a.vx + b.vx) / 2;
            a.vy = (a.vy + b.vy) / 2;
            b.dead = true;
            continue;
          }
        }
        a.vx -= rv * nx;
        a.vy -= rv * ny;
        b.vx += rv * nx;
        b.vy += rv * ny;
      }
    P = P.filter((p) => !p.dead);
    acc += dt;
    if (acc > 0.25) {
      acc = 0;
      hist.push([time, P.filter((p) => p.t === "A").length]);
      if (hist.length > 400) hist.shift();
    }
  };
  const draw = () => {
    svg.replaceChildren();
    s("rect", { x: box.x, y: box.y, width: box.w, height: box.h, rx: 8, class: "box" }, svg);
    P.forEach((p) => s("circle", { cx: p.x, cy: p.y, r: p.t === "C" ? 8 : 6, class: p.t === "A" ? "fill-a" : p.t === "B" ? "fill-b" : "fill-c", "data-name": `Delci ${p.t}` }, svg));
    const t1 = Math.max(30, Math.ceil(time / 10) * 10);
    const A = axes(svg, { W: 340, H: 320, x: [0, t1], y: [0, n0], pad: 30, padT: 205, xStep: t1 / 5, yStep: n0 >= 20 ? 10 : 5, xLabel: "t / s", yLabel: "N(A)" });
    s("path", { d: hist.map(([t, n], i) => `${i ? "L" : "M"}${A.X(t).toFixed(1)} ${A.Y(n).toFixed(1)}`).join(""), class: "graph-line stroke-a", "data-name": "Delci A" }, svg);
  };
  const info = () => {
    const nA = P.filter((p) => p.t === "A").length;
    out.innerHTML = `<p>A + B → C. Preostalo delcev A: <b>${nA}</b> od ${n0}. Trkov A–B: ${coll}, uspešnih: <b>${ok}</b>${coll ? ` (${fmt((100 * ok) / coll, 0)} %)` : ""}.</p>
      <p class="muted">Reagirajo le delci, ki trčijo z dovolj veliko energijo (vsaj aktivacijsko energijo). Višja temperatura pomeni hitrejše delce in več uspešnih trkov, večja koncentracija več trkov, katalizator pa zniža aktivacijsko energijo.</p>`;
  };
  let tInfo = 0;
  const anim = animate(el, (dt) => {
    step(dt);
    draw();
    if ((tInfo += dt) > 0.3) (tInfo = 0), info();
  });
  const restart = () => (reset(), draw(), info());
  restart();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "temperatura", min: 0, max: 100, step: 5, value: T, unit: "°C", onInput: (v) => {
        const f = Math.sqrt((v + 273) / (T + 273));
        T = v;
        P.forEach((p) => ((p.vx *= f), (p.vy *= f)));
      } }),
      slider({ label: "delcev A in B", min: 5, max: 25, value: n0, onInput: (v) => ((n0 = v), restart()) }),
      toggle("katalizator", cat, (v) => (cat = v)),
      buttons(playButton(anim), button("Znova", restart)),
    ],
    out,
    tryText: "Primerjaj, koliko časa traja, da zreagira polovica delcev A pri 10 °C in pri 90 °C. Kaj naredi katalizator?",
  });
}

// ------------------------------------------------------------ ravnotezje: 2 NO₂ ⇌ N₂O₄
export function ravnotezje(el) {
  const out = readout();
  const svg = svgBox(340, 320);
  let T = 25, V = 1, mol = [], time = 0, hist = [], acc = 0, note = "Sistem je v ravnotežju: obe reakciji potekata enako hitro.";
  const kf = 0.05, kb = () => 1.0 * Math.exp(0.045 * (T - 25));
  const W = () => 140 + 180 * (V / 2);
  const add = (t, n) => {
    for (let i = 0; i < n; i++) mol.push({ t, x: rnd(20, 10 + W() - 10), y: rnd(20, 170), a: rnd(0, 6.28) });
  };
  const counts = () => [mol.filter((m) => m.t === 1).length, mol.filter((m) => m.t === 2).length];
  const reset = () => {
    mol = [];
    add(1, 16);
    add(2, 12);
    time = 0;
    hist = [];
  };
  const step = (dt) => {
    time += dt;
    const [n1, n2] = counts();
    const rf = (kf * n1 * (n1 - 1)) / V, rb = kb() * n2;
    if (Math.random() < rf * dt) {
      const a = mol.findIndex((m) => m.t === 1), b = mol.findIndex((m, i) => m.t === 1 && i !== a);
      if (a >= 0 && b >= 0) {
        mol[a].t = 2;
        mol.splice(b, 1);
      }
    }
    if (Math.random() < rb * dt) {
      const m = mol.find((x) => x.t === 2);
      if (m) {
        m.t = 1;
        mol.push({ t: 1, x: m.x + 6, y: m.y, a: rnd(0, 6.28) });
      }
    }
    mol.forEach((m) => {
      m.a += rnd(-1, 1) * dt * 3;
      m.x = clamp(m.x + Math.cos(m.a) * 40 * dt, 20, 10 + W() - 12);
      m.y = clamp(m.y + Math.sin(m.a) * 40 * dt, 20, 172);
      if (m.x <= 20 || m.x >= 10 + W() - 12) m.a = Math.PI - m.a;
      if (m.y <= 20 || m.y >= 172) m.a = -m.a;
    });
    acc += dt;
    if (acc > 0.25) {
      acc = 0;
      hist.push([time, ...counts()]);
      if (hist.length > 360) hist.shift();
    }
  };
  const draw = () => {
    svg.replaceChildren();
    const [n1] = counts();
    s("rect", { x: 10, y: 10, width: W(), height: 172, rx: 6, style: `fill:#a0522d;opacity:${clamp((n1 / V) * 0.012, 0, 0.6)}` }, svg);
    s("rect", { x: 10, y: 10, width: W(), height: 172, rx: 6, class: "box", fill: "none" }, svg);
    s("rect", { x: 10 + W(), y: 10, width: 8, height: 172, class: "piston" }, svg);
    mol.forEach((m) => {
      if (m.t === 1) s("circle", { cx: m.x, cy: m.y, r: 5, style: "fill:#b45309" }, svg);
      else [-5, 5].forEach((d) => s("circle", { cx: m.x + d, cy: m.y, r: 5, style: "fill:#e5e7eb;stroke:#6b7280;stroke-width:1" }, svg));
    });
    const t0 = hist.length ? hist[0][0] : 0, t1 = Math.max(t0 + 30, time);
    const A = axes(svg, { W: 340, H: 320, x: [t0, t1], y: [0, 50], pad: 30, padT: 200, xStep: 10, yStep: 10, xLabel: "t / s", yLabel: "N", xFmt: () => "" });
    [[1, "stroke-a"], [2, "stroke-muted"]].forEach(([k, c]) => s("path", { d: hist.map((h, i) => `${i ? "L" : "M"}${A.X(h[0]).toFixed(1)} ${A.Y(h[k]).toFixed(1)}`).join(""), class: `graph-line ${c}` }, svg));
    label(svg, 334, 214, "NO₂", "tick small fill-a", "end");
    label(svg, 334, 228, "N₂O₄", "tick small", "end");
  };
  const info = () => {
    const [n1, n2] = counts(), c1 = n1 / V, c2 = n2 / V, K = kf / kb(), Q = c1 ? c2 / (c1 * c1) : Infinity;
    const dir = Math.abs(Q / K - 1) < 0.25 ? "približno v ravnotežju" : Q < K ? "poteka v smeri <b>nastajanja N₂O₄</b> (→)" : "poteka v smeri <b>razpada N₂O₄</b> (←)";
    out.innerHTML = texBlock(`2\\,\\mathrm{NO_2}\\ (\\text{rjav}) \\rightleftharpoons \\mathrm{N_2O_4}\\ (\\text{brezbarven}) \\qquad \\Delta H < 0`) +
      `<p>N(NO₂) = ${n1}, N(N₂O₄) = ${n2}. Q = ${fmt(Q, 3)}, K = ${fmt(K, 3)} → reakcija ${dir}.</p><p>${note}</p>
       <p class="muted">Le Chatelierovo načelo: če ravnotežje zmotimo, se sistem odzove tako, da motnjo zmanjša.</p>`;
  };
  let tInfo = 0;
  const anim = animate(el, (dt) => {
    for (let i = 0; i < 3; i++) step(dt);
    draw();
    if ((tInfo += dt) > 0.3) (tInfo = 0), info();
  });
  reset();
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "temperatura", min: 0, max: 100, step: 5, value: T, unit: "°C", onInput: (v) => {
        note = v > T ? "Segrevanje: ravnotežje se premakne v <b>endotermno smer</b> (razpad N₂O₄), plin postane bolj rjav." : "Ohlajanje: ravnotežje se premakne v <b>eksotermno smer</b> (nastaja N₂O₄), plin postane svetlejši.";
        T = v;
      } }),
      slider({ label: "prostornina", min: 0.4, max: 2, step: 0.1, value: V, onInput: (v) => {
        note = v < V ? "Stiskanje: tlak se poveča, ravnotežje se premakne na stran z <b>manj molekulami plina</b> (N₂O₄)." : "Razpenjanje: ravnotežje se premakne na stran z <b>več molekulami plina</b> (NO₂).";
        V = v;
        mol.forEach((m) => (m.x = Math.min(m.x, 10 + W() - 12)));
      } }),
      buttons(
        button("Dodaj NO₂", () => (add(1, 10), (note = "Dodali smo NO₂: ravnotežje se premakne v smer njegove porabe (nastaja več N₂O₄)."))),
        button("Odstrani N₂O₄", () => {
          let k = 0;
          mol = mol.filter((m) => !(m.t === 2 && k++ < 6));
          note = "Odstranili smo N₂O₄: ravnotežje se premakne v smer njegovega nastajanja.";
        }),
        playButton(anim),
        button("Znova", () => ((T = 25), (V = 1), reset(), (note = "Sistem je v ravnotežju."), draw(), info()))
      ),
    ],
    out,
    tryText: "Segrej sistem na 80 °C. Kako se spremeni barva in razmerje molekul? Nato stisni posodo.",
  });
}

// ------------------------------------------------------------ disociacija: močne in šibke kisline (baze)
const DIS = [
  ["HCl", "klorovodikova kislina", "acid", Infinity, "Cl"],
  ["HNO3", "dušikova(V) kislina", "acid", Infinity, "NO₃"],
  ["HF", "fluorovodikova kislina", "acid", 6.8e-4, "F"],
  ["CH3COOH", "ocetna kislina", "acid", 1.8e-5, "CH₃COO"],
  ["H2CO3", "ogljikova kislina (1. stopnja)", "acid", 4.3e-7, "HCO₃"],
  ["NaOH", "natrijev hidroksid", "base", Infinity, "Na"],
  ["NH3", "amonijak", "base", 1.8e-5, "NH₄"],
];
export function disociacija(el) {
  const out = readout();
  const svg = svgBox(340, 230);
  let k = 3, lc = -1, ph = 0;
  const N = 24;
  const seeds = Array.from({ length: N }, () => [rnd(0, 1), rnd(0, 1), rnd(0, 1), rnd(0, 1), rnd(0, 6.28)]);
  const alpha = () => {
    const [, , , K] = DIS[k], C = 10 ** lc;
    return K === Infinity ? 1 : (-K + Math.sqrt(K * K + 4 * K * C)) / (2 * C);
  };
  const draw = () => {
    svg.replaceChildren();
    const [f, , type, , an] = DIS[k];
    beaker(svg, 20, 20, 200, 200, 185, "#e0f2fe", { opacity: 0.6 });
    const a = alpha(), nd = Math.round(a * N);
    seeds.forEach(([u, v, u2, v2, ang], i) => {
      const x = 40 + u * 160, y = 50 + v * 150, j = Math.sin(ph * 2 + i) * 2;
      if (i < nd) {
        const x2 = 40 + u2 * 160, y2 = 50 + v2 * 150;
        if (type === "acid") {
          s("circle", { cx: x + j, cy: y, r: 6, class: "fill-danger" }, svg);
          label(svg, x + j, y, "+", "tick small inv b");
          s("circle", { cx: x2 - j, cy: y2, r: 8, class: "fill-b" }, svg);
          label(svg, x2 - j, y2, "−", "tick small inv b");
        } else {
          s("circle", { cx: x + j, cy: y, r: 6, class: "fill-a" }, svg);
          label(svg, x + j, y, "−", "tick small inv b");
          s("circle", { cx: x2 - j, cy: y2, r: 8, class: "fill-c" }, svg);
          label(svg, x2 - j, y2, "+", "tick small inv b");
        }
      } else {
        const dx = Math.cos(ang + ph * 0.3) * 8, dy = Math.sin(ang + ph * 0.3) * 8;
        s("circle", { cx: x + j, cy: y, r: 8, class: type === "acid" ? "fill-b" : "fill-c" }, svg);
        s("circle", { cx: x + j + dx, cy: y + dy, r: 5, class: type === "acid" ? "fill-danger" : "fill-muted", opacity: 0.85 }, svg);
      }
    });
    // stolpec stopnje disociacije
    s("rect", { x: 260, y: 30, width: 40, height: 180, class: "bar-frame" }, svg);
    s("rect", { x: 260, y: 30 + 180 * (1 - a), width: 40, height: 180 * a, class: "bar fill-a" }, svg);
    label(svg, 280, 20, `α = ${fmt(a * 100, a < 0.1 ? 2 : 1)} %`, "tick small b");
    label(svg, 120, 12, type === "acid" ? `rdeči: H₃O⁺, turkizni: ${an}⁻` : `oranžni: OH⁻, vijolični: ${an}⁺`, "tick small");
  };
  const info = () => {
    const [f, ime, type, K, an] = DIS[k], C = 10 ** lc, a = alpha();
    const x = a * C, p = type === "acid" ? -Math.log10(x) : 14 + Math.log10(x);
    const strong = K === Infinity;
    const eq = type === "acid" ? `\\mathrm{${f.replace(/(\d)/g, "_$1")}} + \\mathrm{H_2O} ${strong ? "\\to" : "\\rightleftharpoons"} \\mathrm{H_3O^+} + \\mathrm{${an.replace(/[₀-₉]/g, (c) => "_" + "₀₁₂₃₄₅₆₇₈₉".indexOf(c))}^-}` : f === "NaOH" ? `\\mathrm{NaOH} \\to \\mathrm{Na^+} + \\mathrm{OH^-}` : `\\mathrm{NH_3} + \\mathrm{H_2O} \\rightleftharpoons \\mathrm{NH_4^+} + \\mathrm{OH^-}`;
    out.innerHTML = texBlock(eq) +
      `<p><b>${ime}</b>, c = ${fmt(C, C < 0.01 ? 4 : 3)} mol/L: ${strong ? `${type === "acid" ? "močna kislina" : "močna baza"}, v vodi popolnoma disociira (α = 100 %).` : `${type === "acid" ? "šibka kislina" : "šibka baza"}, K<sub>${type === "acid" ? "a" : "b"}</sub> = ${fmt(K / 10 ** Math.floor(Math.log10(K)), 1)}·10<sup>${Math.floor(Math.log10(K))}</sup>. Disociira le ${fmt(a * 100, a < 0.1 ? 2 : 1)} % molekul.`}</p>
       <p>pH = <b>${fmt(p, 2)}</b></p><p class="muted">Šibke kisline in baze so pri nižji koncentraciji bolj disociirane (večji α). Na sliki je ${N} formulskih enot.</p>`;
  };
  animate(el, (dt) => {
    ph += dt;
    draw();
  });
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "snov", options: DIS.map((d, i) => [i, `${sub(d[0])} (${d[1]})`]), value: k, onChange: (v) => ((k = +v), draw(), info()) }),
      slider({ label: "koncentracija", min: -3, max: 0, step: 0.1, value: lc, format: (v) => `${fmt(10 ** v, v < -2 ? 4 : 3)} mol/L`, onInput: (v) => ((lc = v), draw(), info()) }),
    ],
    out,
    tryText: "Primerjaj HCl in ocetno kislino pri enaki koncentraciji. Za koliko se razlikujeta pH? Kaj se zgodi z α ocetne kisline, ko jo razredčiš?",
  });
}

// ------------------------------------------------------------ galvanski: galvanski člen in elektroliza
const E0 = [["Mg", -2.37, "#c9ced6", "#e9eef6"], ["Zn", -0.76, "#a3acb9", "#e9eef6"], ["Fe", -0.44, "#6b7280", "#b7e4c7"], ["Pb", -0.13, "#64748b", "#e9eef6"], ["Cu", 0.34, "#c2703d", "#60a5fa"], ["Ag", 0.8, "#e2e8f0", "#e9eef6"]];
const ELEKTROLIZA = {
  CuCl2: ["CuCl₂(aq)", 1.4, "Cu²⁺ + 2 e⁻ → Cu", "2 Cl⁻ → Cl₂ + 2 e⁻", "Na katodi se izloča baker (rjava plast), na anodi nastaja klor (rumenozelen plin z ostrim vonjem).", "#60a5fa"],
  H2O: ["voda (z malo H₂SO₄)", 1.8, "4 H₂O + 4 e⁻ → 2 H₂ + 4 OH⁻", "2 H₂O → O₂ + 4 H⁺ + 4 e⁻", "Na katodi nastaja vodik, na anodi kisik. Prostornina vodika je dvakrat večja: 2 H₂O → 2 H₂ + O₂.", "#e0f2fe"],
  NaCl: ["NaCl(aq) (slana voda)", 2.2, "2 H₂O + 2 e⁻ → H₂ + 2 OH⁻", "2 Cl⁻ → Cl₂ + 2 e⁻", "Na katodi nastaja vodik (natrij je preveč reaktiven, da bi se izločil), na anodi klor. V raztopini ostane NaOH.", "#e0f2fe"],
};
export function galvanski(el) {
  const out = readout();
  const svg = svgBox(340, 260);
  let mode = "clen", L = 1, R = 4, p = 0, phase = 0, ez = "CuCl2", U = 4, gasK = 0, gasA = 0;
  const draw = () => {
    svg.replaceChildren();
    if (mode === "clen") {
      const [ls, le, lc, lsol] = E0[L], [rs, re, rc, rsol] = E0[R];
      const anodeLeft = le < re, E = Math.abs(re - le), on = L !== R;
      beaker(svg, 30, 110, 110, 130, 100, lsol, { opacity: 0.55 });
      beaker(svg, 200, 110, 110, 130, 100, rsol, { opacity: 0.55 });
      s("path", { d: "M115 150 V95 H225 V150", class: "salt-bridge" }, svg);
      label(svg, 170, 86, "solni most", "tick small");
      const wl = 14 * (anodeLeft && on ? 1 - 0.5 * p : on ? 1 + 0.4 * p : 1), wr = 14 * (!anodeLeft && on ? 1 - 0.5 * p : on ? 1 + 0.4 * p : 1);
      s("rect", { x: 70 - wl / 2, y: 60, width: wl, height: 160, style: `fill:${lc}`, class: "metal" }, svg);
      s("rect", { x: 255 - wr / 2, y: 60, width: wr, height: 160, style: `fill:${rc}`, class: "metal" }, svg);
      s("path", { d: "M70 60 V30 H255 V60", class: "wire" }, svg);
      s("circle", { cx: 162, cy: 30, r: 20, class: "meter" }, svg);
      label(svg, 162, 30, `${fmt(on ? E : 0, 2)} V`, "lbl small");
      if (on) {
        for (let i = 0; i < 6; i++) {
          let u = (phase * 0.25 + i / 6) % 1;
          if (!anodeLeft) u = 1 - u;
          const path = [[70, 60], [70, 30], [255, 30], [255, 60]], tot = 30 + 185 + 30;
          let d = u * tot, x = 70, y = 60;
          for (let k = 1; k < path.length; k++) {
            const seg = Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]);
            if (d <= seg) {
              const t = d / seg;
              x = path[k - 1][0] + (path[k][0] - path[k - 1][0]) * t;
              y = path[k - 1][1] + (path[k][1] - path[k - 1][1]) * t;
              break;
            }
            d -= seg;
          }
          if (Math.abs(x - 162) > 22 || y > 40) s("circle", { cx: x, cy: y, r: 3.5, class: "electron" }, svg);
        }
        label(svg, 70, 250, anodeLeft ? "anoda (−)" : "katoda (+)", `tick small b ${anodeLeft ? "fill-danger" : "fill-accent"}`);
        label(svg, 255, 250, anodeLeft ? "katoda (+)" : "anoda (−)", `tick small b ${anodeLeft ? "fill-accent" : "fill-danger"}`);
      }
      label(svg, 105, 128, `${ls}${ls === "Ag" ? "⁺" : "²⁺"}`, "tick small");
      label(svg, 235, 128, `${rs}${rs === "Ag" ? "⁺" : "²⁺"}`, "tick small");
    } else {
      const [name, Ud, , , , col] = ELEKTROLIZA[ez];
      const on = U > Ud;
      beaker(svg, 60, 90, 220, 150, 130, col, { opacity: 0.5 });
      s("rect", { x: 105, y: 60, width: 14, height: 160, class: "metal", style: "fill:#4b5563" }, svg);
      s("rect", { x: 221, y: 60, width: 14, height: 160, class: "metal", style: "fill:#4b5563" }, svg);
      if (ez === "CuCl2" && on) s("rect", { x: 103, y: 120, width: 18, height: 100, rx: 2, style: `fill:#c2703d;opacity:${clamp(gasK / 40, 0.1, 1)}` }, svg);
      s("path", { d: "M112 60 V30 H150 M190 30 H228 V60", class: "wire" }, svg);
      s("line", { x1: 150, y1: 18, x2: 150, y2: 42, class: "batt-long" }, svg);
      s("line", { x1: 160, y1: 24, x2: 160, y2: 36, class: "batt-short" }, svg);
      s("path", { d: "M160 30 H190", class: "wire" }, svg);
      label(svg, 170, 12, `${fmt(U, 1)} V`, "tick small b");
      label(svg, 112, 250, "katoda (−)", "tick small b fill-danger");
      label(svg, 228, 250, "anoda (+)", "tick small b fill-accent");
      // ioni
      for (let i = 0; i < 8; i++) {
        const y = 135 + ((i * 29) % 95), drift = on ? ((phase * 25 + i * 17) % 90) : (i * 11) % 90;
        s("circle", { cx: 220 - drift - 20, cy: y, r: 5, class: "ion-m" }, svg);
        s("circle", { cx: 120 + drift + 20, cy: y + 10, r: 5, class: "ion-x" }, svg);
      }
      if (on) {
        const bub = (x, n, cls) => {
          for (let i = 0; i < n; i++) s("circle", { cx: x + ((i * 7) % 14) - 7, cy: 215 - ((phase * 40 + i * 23) % 100), r: 2.5, class: cls }, svg);
        };
        if (ez !== "CuCl2") bub(112, 8, "bubble");
        bub(228, ez === "H2O" ? 4 : 8, "bubble");
      }
    }
  };
  const info = () => {
    if (mode === "clen") {
      const [ls, le] = E0[L], [rs, re] = E0[R];
      if (L === R) return (out.innerHTML = "<p>Obe elektrodi sta iz iste kovine, napetost je 0 V. Izberi dve različni kovini.</p>");
      const [an, ea, ka, ek] = le < re ? [ls, le, rs, re] : [rs, re, ls, le];
      const qa = an === "Ag" ? 1 : 2, qk = ka === "Ag" ? 1 : 2;
      out.innerHTML =
        texBlock(`E = E^\\circ_{\\text{katoda}} - E^\\circ_{\\text{anoda}} = ${fmt(ek, 2)}\\ \\text{V} - (${fmt(ea, 2)}\\ \\text{V}) = ${fmt(ek - ea, 2)}\\ \\text{V}`) +
        `<p><b>Anoda (−), oksidacija:</b> ${an} → ${an}${qa > 1 ? "²" : ""}⁺ + ${qa} e⁻<br><b>Katoda (+), redukcija:</b> ${ka}${qk > 1 ? "²" : ""}⁺ + ${qk} e⁻ → ${ka}</p>
         <p>Elektroni tečejo po žici od anode h katodi, ioni pa skozi solni most sklenejo krog. Anoda se raztaplja, na katodi se izloča kovina.</p>
         <p class="muted">Kovina z bolj negativnim standardnim elektrodnim potencialom je anoda. Daniellov člen (Zn | Cu) da 1,10 V.</p>`;
    } else {
      const [name, Ud, kat, anod, txt] = ELEKTROLIZA[ez];
      out.innerHTML = U > Ud
        ? `<p><b>Elektroliza ${name}.</b> Zunanji vir poganja elektrone, zato potekata nespontani reakciji.</p><p><b>Katoda (−), redukcija:</b> ${kat}<br><b>Anoda (+), oksidacija:</b> ${anod}</p><p>${txt}</p>`
        : `<p>Napetost ${fmt(U, 1)} V je premajhna. Za elektrolizo ${name} potrebujemo vsaj okoli ${fmt(Ud, 1)} V (razkrojna napetost).</p>`;
      out.innerHTML += `<p class="muted">Pri elektrolizi je katoda negativna, anoda pozitivna (obratno kot pri galvanskem členu), na katodi pa je vedno redukcija.</p>`;
    }
  };
  const anim = animate(el, (dt) => {
    phase += dt;
    if (mode === "clen") p = Math.min(1, p + dt * 0.03);
    else if (U > ELEKTROLIZA[ez][1]) gasK += dt * (U - ELEKTROLIZA[ez][1]) * 4;
    draw();
  });
  const opts = E0.map((e, i) => [i, `${e[0]} (E° = ${fmt(e[1], 2)} V)`]);
  const selL = select({ label: "leva elektroda", options: opts, value: L, onChange: (v) => ((L = +v), (p = 0), draw(), info()) });
  const selR = select({ label: "desna elektroda", options: opts, value: R, onChange: (v) => ((R = +v), (p = 0), draw(), info()) });
  const selE = select({ label: "elektrolit", options: Object.entries(ELEKTROLIZA).map(([k, v]) => [k, v[0]]), value: ez, onChange: (v) => ((ez = v), (gasK = 0), draw(), info()) });
  const slU = slider({ label: "napetost vira", min: 0, max: 6, step: 0.2, value: U, unit: "V", onInput: (v) => ((U = v), info()) });
  const show = () => {
    selL.hidden = selR.hidden = mode !== "clen";
    selE.hidden = slU.hidden = mode === "clen";
  };
  show();
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [segmented({ options: [["clen", "galvanski člen"], ["elektroliza", "elektroliza"]], value: mode, onChange: (v) => ((mode = v), show(), draw(), info()) }), selL, selR, selE, slU, buttons(playButton(anim))],
    out,
    tryText: "Sestavi člen z največjo napetostjo. Pri elektrolizi vode primerjaj, koliko mehurčkov nastaja na vsaki elektrodi.",
  });
}
