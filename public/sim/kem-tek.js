// Simulacije za kemijska tekmovanja: Hessov zakon, pufri, oblike molekul (VSEPR).
import { s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, texBlock, fmt, clamp, label, arrow, axes, draggable } from "./kit.js";
import { solvePH } from "./kem-reakcije.js";
import { atomBall, beaker } from "./kem-skupno.js";

// ------------------------------------------------------------ hess: Hessov zakon
const HESS = [
  ["Gorenje ogljika", ["C + O₂", 0], ["CO + ½ O₂", -110.5], ["CO₂", -393.5], "Ogljik lahko zgori naravnost v CO₂ ali v dveh korakih prek CO. Entalpije nastanka CO neposredno ne moremo izmeriti, izračunamo pa jo s Hessovim zakonom."],
  ["Nastanek žveplovega trioksida", ["S + 1½ O₂", 0], ["SO₂ + ½ O₂", -296.8], ["SO₃", -395.7], "Pri proizvodnji žveplove kisline žveplo najprej zgori v SO₂, ta pa se s katalizatorjem oksidira v SO₃."],
  ["Nastanek dušikovega dioksida", ["½ N₂ + O₂", 0], ["NO + ½ O₂", 90.3], ["NO₂", 33.2], "Prvi korak je endotermen, drugi eksotermen. Skupna sprememba je vsota obeh."],
  ["Nastanek metana (iz gorenja)", ["C + 2 H₂ + 2 O₂", 0], ["CO₂ + 2 H₂O", -965.1], ["CH₄ + 2 O₂", -74.8], "Entalpijo nastanka metana izračunamo iz entalpij gorenja: pot prek CO₂ in H₂O, nato »nazaj« do metana (obrnjena reakcija gorenja metana, +890,3 kJ)."],
];
export function hess(el) {
  const out = readout();
  const svg = svgBox(340, 270);
  let k = 0, show = 2;
  const draw = () => {
    svg.replaceChildren();
    const [, A, B, C] = HESS[k];
    const vals = [A[1], B[1], C[1]], lo = Math.min(...vals), hi = Math.max(...vals), pad = (hi - lo) * 0.12 || 20;
    const Y = (e) => 30 + ((hi + pad - e) / (hi - lo + 2 * pad)) * 220;
    // os entalpije s številkami, da je merilo vidno
    const span = hi - lo + 2 * pad, st = [10, 20, 50, 100, 200, 500].find((q) => span / q <= 6) || 1000;
    s("line", { x1: 40, y1: 26, x2: 40, y2: 254, class: "axis" }, svg);
    for (let e = Math.ceil((lo - pad) / st) * st; e <= hi + pad; e += st) {
      s("line", { x1: 37, y1: Y(e), x2: 43, y2: Y(e), class: "axis" }, svg);
      label(svg, 34, Y(e), String(e), "tick small", "end");
    }
    label(svg, 4, 16, "H [kJ]", "tick small", "start");
    const lvl = ([n, e], x0, x1) => {
      s("line", { x1: x0, y1: Y(e), x2: x1, y2: Y(e), class: "graph-line" }, svg);
      label(svg, (x0 + x1) / 2, Y(e) - 10, n, "tick small b");
    };
    lvl(A, 46, 120);
    lvl(B, 130, 230);
    lvl(C, 230, 330);
    if (show >= 1) {
      arrow(svg, 110, Y(A[1]) + (B[1] < A[1] ? 2 : -2), 140, Y(B[1]) + (B[1] < A[1] ? -2 : 2), "a", 2.5);
      label(svg, 145, (Y(A[1]) + Y(B[1])) / 2, `ΔH₁ = ${fmt(B[1] - A[1], 1)} kJ`, "tick small fill-a", "start");
      arrow(svg, 220, Y(B[1]) + (C[1] < B[1] ? 2 : -2), 250, Y(C[1]) + (C[1] < B[1] ? -2 : 2), "b", 2.5);
      label(svg, 255, (Y(B[1]) + Y(C[1])) / 2, `ΔH₂ = ${fmt(C[1] - B[1], 1)} kJ`, "tick small fill-b", "start");
    }
    if (show >= 2) {
      arrow(svg, 70, Y(A[1]) + (C[1] < A[1] ? 2 : -2), 70, Y(C[1]), "c", 2.5);
      s("line", { x1: 60, y1: Y(C[1]), x2: 230, y2: Y(C[1]), class: "guide" }, svg);
      label(svg, 76, Y(C[1]) + (C[1] < A[1] ? 14 : -10), `ΔH = ${fmt(C[1] - A[1], 1)} kJ`, "tick small b fill-c", "start");
    }
  };
  const info = () => {
    const [name, A, B, C, txt] = HESS[k];
    const d1 = B[1] - A[1], d2 = C[1] - B[1];
    out.innerHTML = texBlock(`\\Delta H = \\Delta H_1 + \\Delta H_2 = (${fmt(d1, 1)}) + (${fmt(d2, 1)}) = ${fmt(d1 + d2, 1)}\\ \\text{kJ}`) +
      `<p><b>${name}.</b> ${txt}</p><p class="muted">Hessov zakon: reakcijska entalpija je odvisna le od začetnega in končnega stanja, ne od poti. Entalpija je funkcija stanja.</p>`;
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "primer", options: HESS.map((h, i) => [i, h[0]]), value: k, onChange: (v) => ((k = +v), draw(), info()) }),
      segmented({ options: [["1", "pot v dveh korakih"], ["2", "obe poti"]], value: "2", onChange: (v) => ((show = +v), draw()) }),
    ],
    out,
    tryText: "Izračunaj entalpijo reakcije CO + ½ O₂ → CO₂ iz drugih dveh vrednosti. Ali je odvisna od poti?",
  });
}

// ------------------------------------------------------------ pufer: pufrska raztopina
export function pufer(el) {
  const out = readout();
  const svg = svgBox(340, 270);
  let cHA = 0.1, cA = 0.1, added = 0, histB = [], histW = [];
  const Ka = 1.8e-5, V0 = 100, cT = 0.1; // mL, mol/L dodane kisline ali baze
  const phs = (vAdd) => {
    const V = V0 + Math.abs(vAdd), nT = (cT * Math.abs(vAdd)) / 1000;
    const nHA = (cHA * V0) / 1000, nA = (cA * V0) / 1000;
    const acids = [{ C: (nHA + nA) / (V / 1000), Ka }];
    let na = nA / (V / 1000);
    if (vAdd > 0) acids.push({ C: nT / (V / 1000), Ka: 1e8 });
    else na += nT / (V / 1000);
    const buf = solvePH({ acids, na });
    const water = vAdd > 0 ? solvePH({ acids: [{ C: nT / (V / 1000), Ka: 1e8 }] }) : vAdd < 0 ? solvePH({ na: nT / (V / 1000) }) : 7;
    return [buf, water];
  };
  const record = () => {
    histB = [];
    histW = [];
    for (let v = -20; v <= 20; v += 0.5) {
      const [b, w] = phs(v);
      histB.push([v, b]);
      histW.push([v, w]);
    }
  };
  const draw = () => {
    svg.replaceChildren();
    const A = axes(svg, { W: 340, H: 270, x: [-20, 20], y: [0, 14], pad: 30, xStep: 5, yStep: 2, xLabel: "mL", yLabel: "pH", xFmt: (v) => String(Math.abs(v)) });
    label(svg, 40, 258, "← NaOH", "tick small b", "start");
    label(svg, 330, 258, "HCl →", "tick small b", "end");
    s("path", { d: histW.map(([v, p], i) => `${i ? "L" : "M"}${A.X(v)} ${A.Y(p)}`).join(""), class: "graph-line stroke-c" }, svg);
    s("path", { d: histB.map(([v, p], i) => `${i ? "L" : "M"}${A.X(v)} ${A.Y(p)}`).join(""), class: "graph-line stroke-b" }, svg);
    const [b, w] = phs(added);
    s("circle", { cx: A.X(added), cy: A.Y(b), r: 5, class: "fill-b" }, svg);
    s("circle", { cx: A.X(added), cy: A.Y(w), r: 5, class: "fill-c" }, svg);
    label(svg, 300, 22, "pufer", "tick small b fill-b", "end");
    label(svg, 300, 36, "voda", "tick small b fill-c", "end");
  };
  const info = () => {
    const [b, w] = phs(added), pKa = -Math.log10(Ka);
    out.innerHTML = texBlock(`\\text{pH} = \\text{p}K_a + \\log\\frac{[\\mathrm{CH_3COO^-}]}{[\\mathrm{CH_3COOH}]} = ${fmt(pKa, 2)} + \\log\\frac{${fmt(cA, 2)}}{${fmt(cHA, 2)}} = ${fmt(pKa + Math.log10(cA / cHA), 2)}`) +
      `<p>V 100 mL pufra (ocetna kislina + natrijev acetat) in v 100 mL vode smo dodali ${fmt(Math.abs(added), 1)} mL ${added > 0 ? "HCl" : "NaOH"} (0,1 mol/L). pH pufra: <b>${fmt(b, 2)}</b>, pH vode: <b>${fmt(w, 2)}</b>.</p>
       <p class="muted">Pufer vsebuje šibko kislino in njeno konjugirano bazo. Dodano kislino nevtralizira acetat (CH₃COO⁻ + H₃O⁺ → CH₃COOH + H₂O), dodano bazo pa ocetna kislina. Zato se pH skoraj ne spremeni, dokler pufra ne »porabimo«.</p>`;
  };
  const upd = () => (record(), draw(), info());
  upd();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "dodano (− NaOH, + HCl)", min: -20, max: 20, step: 0.5, value: added, unit: "mL", onInput: (v) => ((added = v), draw(), info()) }),
      slider({ label: "c(CH₃COOH)", min: 0.01, max: 0.2, step: 0.01, value: cHA, unit: "mol/L", onInput: (v) => ((cHA = v), upd()) }),
      slider({ label: "c(CH₃COO⁻)", min: 0.01, max: 0.2, step: 0.01, value: cA, unit: "mol/L", onInput: (v) => ((cA = v), upd()) }),
    ],
    out,
    tryText: "Za koliko se spremeni pH vode in za koliko pH pufra, ko dodaš 5 mL HCl? Kako vpliva koncentracija pufra na njegovo kapaciteto?",
  });
}

// ------------------------------------------------------------ vsepr: oblike molekul
const VSEPR = [
  ["BeCl₂", "Be", "Cl", 2, 0, "linearna", "180°"],
  ["CO₂", "C", "O", 2, 0, "linearna", "180°"],
  ["BF₃", "B", "F", 3, 0, "trikotna ravninska", "120°"],
  ["SO₂", "S", "O", 2, 1, "kotna (upognjena)", "≈ 119°"],
  ["CH₄", "C", "H", 4, 0, "tetraedrična", "109,5°"],
  ["NH₃", "N", "H", 3, 1, "trikotna piramidalna", "≈ 107°"],
  ["H₂O", "O", "H", 2, 2, "kotna (upognjena)", "≈ 104,5°"],
  ["PCl₅", "P", "Cl", 5, 0, "trikotna bipiramidalna", "90° in 120°"],
  ["SF₄", "S", "F", 4, 1, "gugalnica", "≈ 90° in ≈ 120°"],
  ["ClF₃", "Cl", "F", 3, 2, "oblika črke T", "≈ 90°"],
  ["XeF₂", "Xe", "F", 2, 3, "linearna", "180°"],
  ["SF₆", "S", "F", 6, 0, "oktaedrična", "90°"],
  ["BrF₅", "Br", "F", 5, 1, "kvadratna piramidalna", "≈ 90°"],
  ["XeF₄", "Xe", "F", 4, 2, "kvadratna ravninska", "90°"],
];
const r3 = Math.sqrt(3) / 2;
const DIRS = {
  2: [[1, 0, 0], [-1, 0, 0]],
  3: [[1, 0, 0], [-0.5, r3, 0], [-0.5, -r3, 0]],
  4: [[0, 1, 0], [0.943, -0.333, 0], [-0.471, -0.333, 0.816], [-0.471, -0.333, -0.816]],
  5: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-0.5, 0, r3], [-0.5, 0, -r3]],
  6: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]],
};
export function vsepr(el) {
  const out = readout();
  const svg = svgBox(340, 260, "solid3d");
  let k = 5, yaw = 0.6, pitch = 0.35, lone = true;
  const rot = ([x, y, z]) => {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
    const y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    return [x1, y1, z2];
  };
  const draw = () => {
    svg.replaceChildren();
    const [, c, l, nb, nl] = VSEPR[k];
    const dom = nb + nl, dirs = DIRS[dom] || DIRS[2];
    const isLP = (i) => (dom === 6 ? (nl === 1 ? i === 0 : nl === 2 ? i === 0 || i === 1 : false) : dom === 5 ? (nl === 1 ? i === 2 : nl === 2 ? i === 2 || i === 3 : nl === 3 ? i >= 2 : false) : dom === 4 ? (nl === 1 ? i === 0 : nl === 2 ? i <= 1 : false) : dom === 3 ? nl === 1 && i === 0 : false);
    const cx = 170, cy = 130, R = 85;
    const items = dirs.map((d, i) => {
      const [x, y, z] = rot(d);
      return { x: cx + x * R, y: cy - y * R, z, lp: isLP(i) };
    });
    items.push({ x: cx, y: cy, z: 0, center: true });
    items.sort((a, b) => a.z - b.z);
    items.forEach((it) => {
      if (it.center) return atomBall(svg, cx, cy, c, 20);
      if (it.lp) {
        if (!lone) return;
        const mx = cx + (it.x - cx) * 0.6, my = cy + (it.y - cy) * 0.6;
        const ang = (Math.atan2(it.y - cy, it.x - cx) * 180) / Math.PI;
        s("ellipse", { cx: mx, cy: my, rx: 30, ry: 16, transform: `rotate(${ang} ${mx} ${my})`, class: "lone-pair", opacity: 0.55 + 0.25 * it.z }, svg);
        [-4, 4].forEach((o) => s("circle", { cx: mx - o * Math.sin((ang * Math.PI) / 180), cy: my + o * Math.cos((ang * Math.PI) / 180), r: 2.3, class: "fill-text" }, svg));
        return;
      }
      s("line", { x1: cx, y1: cy, x2: it.x, y2: it.y, class: "bond", "stroke-width": 4 + it.z * 1.5 }, svg);
      atomBall(svg, it.x, it.y, l, 14 + it.z * 3);
    });
  };
  const info = () => {
    const [f, c, , nb, nl, shape, ang] = VSEPR[k];
    out.innerHTML = `<p><b>${f}</b>: okoli osrednjega atoma ${c} so ${nb + nl} elektronske domene (${nb} vezne${nl ? `, ${nl} nevezn${nl === 1 ? "i par" : nl === 2 ? "a para" : "i pari"}` : ""}), oznaka AX<sub>${nb}</sub>${nl ? `E<sub>${nl}</sub>` : ""}.</p>
      <p>Oblika molekule: <b>${shape}</b>, vezni kot ${ang}.</p>
      <p class="muted">VSEPR: elektronski pari okoli osrednjega atoma se razporedijo čim dlje drug od drugega. Nevezni pari zavzamejo več prostora, zato zmanjšajo vezne kote (CH₄ 109,5°, NH₃ 107°, H₂O 104,5°). Obliko določajo le položaji atomov. Povleci molekulo, da jo zavrtiš.</p>`;
  };
  let last = null;
  draggable(svg, svg, (x, y) => {
    if (last) {
      yaw += (x - last[0]) * 0.012;
      pitch = clamp(pitch + (y - last[1]) * 0.012, -1.4, 1.4);
      draw();
    }
    last = [x, y];
  }, { onStart: (x, y) => (last = [x, y]), onEnd: () => (last = null) });
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "molekula", options: VSEPR.map((v, i) => [i, `${v[0]} (${v[5]})`]), value: k, onChange: (v) => ((k = +v), draw(), info()) }),
      toggle("pokaži nevezne pare", lone, (v) => ((lone = v), draw())),
    ],
    out,
    tryText: "Primerjaj CH₄, NH₃ in H₂O: vsi imajo 4 elektronske domene. Zakaj so oblike različne? Zakaj je XeF₄ ravninska?",
  });
}
