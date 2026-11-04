// Simulacije pri fiziki: merjenje, vzmet, teža, sile, trenje, gostota in vzgon, tlak, gibanje.
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, tex, texBlock, fmt, tfmt, clamp, label, axes, arrow, animate, playButton, draggable, handle } from "./kit.js";
import { G, springPath, force, car, timeGraph, dial } from "./fiz-skupno.js";

const T = (x, d = 2) => tfmt(x, d);
const randn = () => {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

// ------------------------------------------------------------ merjenje in merska napaka
export function meritve(el) {
  const svg = svgBox(340, 190);
  const out = readout();
  let L = 6.37, res = 0.1, vals = [];
  const X = (cm) => 20 + cm * 30;
  const newObj = () => ((L = Math.round((3 + Math.random() * 6) * 1000) / 1000), (vals = []));
  const measure = () => {
    const v = Math.round((L + randn() * res * 0.6) / res) * res;
    vals.push(Number(v.toFixed(3)));
    draw();
  };
  const dg = () => (res === 1 ? 0 : 1);
  const draw = () => {
    svg.replaceChildren();
    // svinčnik
    s("rect", { x: X(0), y: 16, width: X(L) - X(0) - 14, height: 16, rx: 3, class: "fill-a" }, svg);
    s("path", { d: `M${X(L) - 14},16 L${X(L)},24 L${X(L) - 14},32 Z`, class: "fill-muted" }, svg);
    // ravnilo
    s("rect", { x: 12, y: 36, width: 316, height: 40, rx: 4, class: "box" }, svg);
    for (let mm = 0; mm <= 100; mm++) {
      const cm = mm / 10, big = mm % 10 === 0, mid = mm % 5 === 0;
      if (!big && res === 1) continue;
      s("line", { x1: X(cm), y1: 36, x2: X(cm), y2: 36 + (big ? 16 : mid ? 11 : 7), class: "axis thin" }, svg);
      if (big) label(svg, X(cm), 64, String(cm), "tick");
    }
    label(svg, 328, 26, "cm", "tick", "end"); // nad desnim koncem ravnila, ne čez »10«
    // točkovni diagram meritev
    if (vals.length) {
      const lo = Math.min(...vals, L) - res * 2, hi = Math.max(...vals, L) + res * 2;
      const Ax = (v) => 30 + ((v - lo) / (hi - lo)) * 280;
      s("line", { x1: 30, y1: 160, x2: 310, y2: 160, class: "axis" }, svg);
      const mean = vals.reduce((p, q) => p + q, 0) / vals.length;
      const dev = Math.max(...vals.map((v) => Math.abs(v - mean)));
      const dx = dev > 1e-9 ? dev : res;
      s("rect", { x: Ax(mean - dx), y: 98, width: Ax(mean + dx) - Ax(mean - dx), height: 62, class: "band" }, svg);
      const count = {};
      vals.forEach((v) => {
        const k = v.toFixed(3);
        count[k] = (count[k] || 0) + 1;
        s("circle", { cx: Ax(v), cy: 160 - 9 * count[k], r: 4.5, class: "pt fill-a" }, svg);
      });
      s("line", { x1: Ax(mean), y1: 96, x2: Ax(mean), y2: 164, class: "graph-line stroke-c thin-line" }, svg);
      label(svg, Ax(mean), 88, `povprečje ${fmt(mean, dg() + 2)}`, "lbl small");
      const step = res === 1 ? 1 : (hi - lo > 1.5 ? 0.5 : 0.1);
      for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) label(svg, Ax(v), 176, fmt(v, step < 1 ? 1 : 0), "tick");
      const rel = (dx / mean) * 100;
      out.innerHTML = `<p>Meritve (${vals.length}): ${vals.map((v) => fmt(v, dg())).join("; ")} cm</p>` +
        texBlock(`\\bar{x} = \\frac{x_1 + x_2 + \\dots + x_n}{n} = ${T(mean, dg() + 2)}\\ \\text{cm}`) +
        `<p>Absolutna napaka (največje odstopanje od povprečja${dev > 1e-9 ? "" : "; ker so vse meritve enake, vzamemo najmanjši razdelek merila"}): ${tex(`\\Delta x = ${T(dx, dg() + 1)}\\ \\text{cm}`)}. Relativna napaka: ${tex(`\\delta = \\Delta x / \\bar{x} = ${T(rel, 1)}\\ \\%`)}.</p>
         <p><b>Rezultat: l = (${fmt(mean, dg() + 1)} ± ${fmt(dx, dg() + 1)}) cm.</b> Senčeni pas kaže območje ${tex("\\bar{x} \\pm \\Delta x")}.</p>
         <p class="muted">Vsaka meritev je malo drugačna (odčitavanje, paralaksa). Več meritev da zanesljivejše povprečje. Natančnejše merilo (mm) zmanjša napako.</p>`;
    } else out.innerHTML = `<p>Klikni <b>Izmeri</b> nekajkrat. Vsaka meritev je odčitek z ravnila z razdelki po ${res === 1 ? "1 cm" : "1 mm"}.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      segmented({ options: [["0.1", "ravnilo z mm"], ["1", "ravnilo s cm"]], value: "0.1", onChange: (v) => ((res = Number(v)), (vals = []), draw()) }),
      buttons(button("Izmeri", measure, "primary small"), button("Izmeri 5-krat", () => { for (let i = 0; i < 5; i++) measure(); }), button("Nov predmet", () => (newObj(), draw()))),
    ],
    out,
    tryText: "Izmeri 10-krat z ravnilom s cm in 10-krat z mm. Primerjaj relativni napaki.",
  });
  for (let i = 0; i < 3; i++) measure();
}

// ------------------------------------------------------------ vzmet: Hookov zakon in nihanje
export function vzmet(el, { mode = "hooke" } = {}) {
  if (mode === "nihanje") return vzmetNihanje(el);
  const svg = svgBox(340, 290);
  const out = readout();
  let m = 200, k = 40, pts = [];
  const sc = 7; // px na cm
  const draw = () => {
    svg.replaceChildren();
    const F = (m / 1000) * G, x = (F / k) * 100;
    const top = 18, L0 = 46, yEnd = top + L0 + x * sc;
    s("line", { x1: 30, y1: top, x2: 120, y2: top, class: "ground" }, svg);
    s("path", { d: springPath(70, top, 70, yEnd, 12, 10), class: "string", fill: "none" }, svg);
    s("line", { x1: 70, y1: yEnd, x2: 70, y2: yEnd + 6, class: "string" }, svg);
    const n = Math.round(m / 50);
    for (let i = 0; i < n; i++) s("rect", { x: 56, y: yEnd + 6 + i * 6, width: 28, height: 5, rx: 1.5, class: i % 2 ? "fill-a" : "fill-c" }, svg);
    if (n) label(svg, 92, yEnd + 6 + n * 3, `${m} g`, "lbl small", "start");
    // ravnilo
    const r0 = top + L0;
    s("rect", { x: 128, y: r0 - 6, width: 22, height: 26 * sc + 12, class: "box" }, svg);
    for (let c = 0; c <= 26; c++) {
      s("line", { x1: 128, y1: r0 + c * sc, x2: 128 + (c % 5 ? 5 : 10), y2: r0 + c * sc, class: "axis thin" }, svg);
      if (c % 5 === 0) label(svg, 144, r0 + c * sc, String(c), "tick small");
    }
    s("line", { x1: 76, y1: r0, x2: 128, y2: r0, class: "guide" }, svg);
    s("line", { x1: 76, y1: yEnd, x2: 128, y2: yEnd, class: "guide stroke-a" }, svg);
    if (x > 1.2) {
      arrow(svg, 112, r0, 112, yEnd, "a", 2);
      label(svg, 104, (r0 + yEnd) / 2, "x", "lbl small", "end");
    }
    if (n) force(svg, 70, yEnd + 6 + n * 6 + 2, 0, Math.min(60, F * 10), "b", "F");
    // graf F(x)
    const gx = (xx) => 196 + (xx / 25) * 130, gy = (ff) => 240 - (ff / 5) * 210;
    s("line", { x1: gx(0), y1: gy(0), x2: gx(25) + 6, y2: gy(0), class: "axis" }, svg);
    s("line", { x1: gx(0), y1: gy(0), x2: gx(0), y2: gy(5) - 6, class: "axis" }, svg);
    for (let xx = 5; xx <= 25; xx += 5) label(svg, gx(xx), gy(0) + 13, String(xx), "tick small");
    for (let ff = 1; ff <= 5; ff++) label(svg, gx(0) - 5, gy(ff), String(ff), "tick small", "end");
    label(svg, gx(25), gy(0) + 27, "x [cm]", "axis-label", "end");
    label(svg, gx(0) + 5, gy(5) - 2, "F [N]", "axis-label", "start");
    s("line", { x1: gx(0), y1: gy(0), x2: gx(Math.min(25, (5 / k) * 100)), y2: gy(Math.min(5, (k * 25) / 100)), class: "graph-line stroke-b thin-line", "stroke-dasharray": "5 4" }, svg);
    pts.forEach(([px, pf]) => s("circle", { cx: gx(px), cy: gy(pf), r: 4, class: "pt fill-a" }, svg));
    if (x <= 25) s("circle", { cx: gx(x), cy: gy(F), r: 5.5, class: "pt fill-accent" }, svg);
    out.innerHTML = texBlock(`F = m g = ${T(m / 1000, 3)}\\ \\text{kg}\\cdot 9{,}81\\ \\tfrac{\\text{N}}{\\text{kg}} = ${T(F, 2)}\\ \\text{N}`) +
      texBlock(`x = \\frac{F}{k} = \\frac{${T(F, 2)}\\ \\text{N}}{${k}\\ \\text{N/m}} = ${T(x, 1)}\\ \\text{cm}`) +
      `<p><b>Hookov zakon:</b> raztezek vzmeti je sorazmeren s silo, F = k·x. Točke na grafu ležijo na premici skozi izhodišče; strmina premice je koeficient vzmeti k.</p>
       <p class="muted">Trša vzmet (večji k) se pri isti sili manj raztegne. Silomer je vzmet z umerjeno skalo.</p>`;
  };
  const addPt = () => {
    const F = (m / 1000) * G, x = (F / k) * 100;
    if (!pts.some((p) => Math.abs(p[1] - F) < 1e-9)) pts.push([x, F]);
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "masa uteži", min: 0, max: 500, step: 50, value: m, unit: "g", onInput: (v) => ((m = v), addPt(), draw()) }),
      slider({ label: "koeficient k", min: 20, max: 100, step: 5, value: k, unit: "N/m", onInput: (v) => ((k = v), (pts = []), addPt(), draw()) }),
    ],
    out,
    tryText: "Podvoji maso uteži. Kolikokrat se poveča raztezek? Kaj pa, če zamenjaš vzmet z dvakrat tršo?",
  });
  addPt();
  draw();
}

function vzmetNihanje(el) {
  const svg = svgBox(340, 270);
  const out = readout();
  let m = 0.5, k = 20, A0 = 4, t = 0, hist = [];
  const sc = 6;
  const draw = () => {
    svg.replaceChildren();
    const w = Math.sqrt(k / m), Tp = (2 * Math.PI) / w, y = A0 * Math.cos(w * t);
    const top = 14, eq = 120, yb = eq + y * sc;
    s("line", { x1: 30, y1: top, x2: 110, y2: top, class: "ground" }, svg);
    const bs = 28 * Math.cbrt(m), hb = bs / 2; // večja masa → večja utež
    s("path", { d: springPath(70, top, 70, yb - hb, 12, 10), class: "string", fill: "none" }, svg);
    s("rect", { x: 70 - hb, y: yb - hb, width: bs, height: bs, rx: 4, class: "fill-a" }, svg);
    label(svg, 70, yb, `${fmt(m, 1)} kg`, "lbl inv");
    s("line", { x1: 20, y1: eq, x2: 336, y2: eq, class: "guide" }, svg);
    label(svg, 334, eq - 8, "ravnovesna lega", "tick", "end");
    [-1, 1].forEach((sg) => s("line", { x1: 40, y1: eq + sg * A0 * sc, x2: 100, y2: eq + sg * A0 * sc, class: "guide stroke-c" }, svg));
    // časovni potek
    const gx0 = 130, gx1 = 330, win = 6;
    s("line", { x1: gx0, y1: 20, x2: gx0, y2: 225, class: "axis" }, svg);
    label(svg, gx0 + 6, 26, "odmik", "axis-label", "start");
    label(svg, gx1, eq + 16, "t", "axis-label", "end");
    const t0 = Math.max(0, t - win);
    let d = "";
    hist.forEach(([tt, yy]) => {
      if (tt < t0) return;
      d += `${d ? "L" : "M"}${(gx0 + ((tt - t0) / win) * (gx1 - gx0)).toFixed(1)},${(eq + yy * sc).toFixed(1)}`;
    });
    if (d) s("path", { d, class: "graph-line stroke-b" }, svg);
    for (let n = Math.ceil(t0 / Tp); n * Tp <= t; n++) {
      const xx = gx0 + ((n * Tp - t0) / win) * (gx1 - gx0);
      s("line", { x1: xx, y1: eq - A0 * sc - 8, x2: xx, y2: eq - A0 * sc, class: "axis thin" }, svg);
    }
    s("line", { x1: 88, y1: yb, x2: gx0 + (Math.min(t, win) / win) * (gx1 - gx0), y2: yb, class: "guide stroke-a" }, svg);
    out.innerHTML = texBlock(`t_0 = 2\\pi\\sqrt{\\frac{m}{k}} = 2\\pi\\sqrt{\\frac{${T(m, 1)}}{${k}}} = ${T(Tp, 2)}\\ \\text{s},\\quad \\nu = \\frac{1}{t_0} = ${T(1 / Tp, 2)}\\ \\text{Hz}`) +
      `<p>Nihajni čas je odvisen od mase in trdote vzmeti, <b>ne pa od amplitude</b>. Največja hitrost je v ravnovesni legi: v₀ = ω·A = ${fmt(w * A0 / 100, 2)} m/s; v skrajnih legah je hitrost 0, pospešek pa največji.</p>
       <p class="muted">Črtice nad grafom označujejo cele nihaje. Energija se pretaka med prožnostno in kinetično.</p>`;
  };
  const anim = animate(el, (dt) => {
    t += dt;
    const w = Math.sqrt(k / m);
    hist.push([t, A0 * Math.cos(w * t)]);
    if (hist.length > 800) hist.shift();
    draw();
  }, { autoplay: false });
  const reset = () => ((t = 0), (hist = [[0, A0]]), draw());
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "masa m", min: 0.1, max: 2, step: 0.1, value: m, unit: "kg", onInput: (v) => ((m = v), reset()) }),
      slider({ label: "koeficient k", min: 5, max: 100, step: 5, value: k, unit: "N/m", onInput: (v) => ((k = v), reset()) }),
      slider({ label: "amplituda", min: 1, max: 8, step: 1, value: A0, unit: "cm", onInput: (v) => ((A0 = v), reset()) }),
      buttons(playButton(anim, { play: "Niha", pause: "Ustavi" }), button("Na začetek", reset)),
    ],
    out,
    tryText: "Povečaj maso na štirikratno. Kolikokrat se podaljša nihajni čas?",
  });
  reset();
}

// ------------------------------------------------------------ teža in masa
const PLANETS = [["Zemlja", 9.81, "b"], ["Luna", 1.62, "muted"], ["Mars", 3.71, "danger"], ["Venera", 8.87, "a"], ["Jupiter", 24.8, "c"]];
export function teza(el) {
  const svg = svgBox(340, 250);
  const out = readout();
  let m = 50, pi = 0;
  const draw = () => {
    svg.replaceChildren();
    const [nm, g] = PLANETS[pi];
    const F = m * g;
    // osebna tehtnica (silomer)
    s("rect", { x: 20, y: 200, width: 120, height: 22, rx: 6, class: "box" }, svg);
    s("rect", { x: 55, y: 152, width: 50, height: 48, rx: 6, class: "fill-a" }, svg);
    label(svg, 80, 176, `${m} kg`, "lbl inv");
    dial(svg, 80, 95, 42, F, 2500, "N", "silomer kaže težo");
    s("line", { x1: 10, y1: 222, x2: 150, y2: 222, class: "ground" }, svg);
    // stolpci: teža na planetih
    const bx = 170, bw = 30, base = 222, maxF = 100 * 24.8;
    PLANETS.forEach(([n, gg, col], i) => {
      const hh = ((m * gg) / maxF) * 180;
      s("rect", { x: bx + i * 33, y: base - hh, width: bw, height: hh, class: `bar fill-${col}`, opacity: i === pi ? 1 : 0.45 }, svg);
      label(svg, bx + i * 33 + bw / 2, base + 12, n, "tick small");
      label(svg, bx + i * 33 + bw / 2, base - hh - 8, fmt(m * gg, 0), "tick small");
    });
    s("line", { x1: bx - 4, y1: base, x2: 336, y2: base, class: "axis" }, svg);
    label(svg, bx, 18, `teža telesa z maso ${m} kg [N]`, "tick b", "start");
    out.innerHTML = texBlock(`F_g = m\\cdot g = ${m}\\ \\text{kg}\\cdot ${T(g, 2)}\\ \\tfrac{\\text{N}}{\\text{kg}} = ${T(F, 0)}\\ \\text{N}`) +
      `<p>${nm}: težni pospešek g = ${fmt(g, 2)} N/kg. <b>Masa</b> (${m} kg) je povsod enaka, saj pove, koliko snovi je v telesu. <b>Teža</b> je sila, s katero planet privlači telo, zato je odvisna od g.</p>
       <p class="muted">Na Luni bi silomer pokazal ${fmt(m * 1.62, 0)} N, na Jupitru ${fmt(m * 24.8, 0)} N. Tehtnica z utežmi (primerjava mas) pa bi povsod pokazala ${m} kg.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      segmented({ options: PLANETS.map(([n], i) => [String(i), n]), value: "0", onChange: (v) => ((pi = Number(v)), draw()) }),
      slider({ label: "masa", min: 1, max: 100, value: m, unit: "kg", onInput: (v) => ((m = v), draw()) }),
    ],
    out,
    tryText: "Kolikšno maso bi moralo imeti telo na Luni, da bi imelo enako težo kot telo z maso 10 kg na Zemlji?",
  });
  draw();
}

// ------------------------------------------------------------ sestavljanje sil
export function sile(el) {
  const svg = svgBox(340, 340);
  const out = readout();
  let F1 = [6, 2], F2 = [1, 5], comp = false, eqv = false;
  const draw = () => {
    svg.replaceChildren();
    const A = axes(svg, { W: 340, H: 340, x: [-10, 10], y: [-10, 10], xStep: 2, yStep: 2, xLabel: "Fₓ [N]", yLabel: "F_y [N]" });
    const O = [A.X(0), A.Y(0)];
    const R = [F1[0] + F2[0], F1[1] + F2[1]];
    const P = (v) => [A.X(v[0]), A.Y(v[1])];
    s("polygon", { points: [O, P(F1), P(R), P(F2)].map((q) => q.join(",")).join(" "), class: "shape fill-soft", "stroke-opacity": 0 }, svg);
    s("line", { x1: P(F1)[0], y1: P(F1)[1], x2: P(R)[0], y2: P(R)[1], class: "guide", "data-name": "Paralelogram" }, svg);
    s("line", { x1: P(F2)[0], y1: P(F2)[1], x2: P(R)[0], y2: P(R)[1], class: "guide" }, svg);
    if (comp) [[F1, "a"], [F2, "b"]].forEach(([F, col]) => {
      s("line", { x1: O[0], y1: O[1], x2: A.X(F[0]), y2: O[1], class: `guide stroke-${col}` }, svg);
      s("line", { x1: A.X(F[0]), y1: O[1], x2: A.X(F[0]), y2: A.Y(F[1]), class: `guide stroke-${col}` }, svg);
    });
    if (eqv && (R[0] || R[1])) arrow(svg, O[0], O[1], A.X(-R[0]), A.Y(-R[1]), "danger", 3, { "stroke-dasharray": "7 5" });
    if (R[0] || R[1]) arrow(svg, O[0], O[1], ...P(R), "c", 4);
    arrow(svg, O[0], O[1], ...P(F1), "a", 3.5);
    arrow(svg, O[0], O[1], ...P(F2), "b", 3.5);
    s("circle", { cx: O[0], cy: O[1], r: 7, class: "node" }, svg);
    [["F₁", F1, "a"], ["F₂", F2, "b"]].forEach(([nm, v, col]) => {
      const hnd = handle(svg, col);
      label(hnd, 14, -12, nm, "pt-lbl");
      hnd.move(...P(v));
      draggable(svg, hnd, (x, y) => {
        const [u, w] = A.inv(x, y), nu = clamp(Math.round(u), -9, 9), nw = clamp(Math.round(w), -9, 9);
        if (nu !== v[0] || nw !== v[1]) ((v[0] = nu), (v[1] = nw), draw());
      });
    });
    if (R[0] || R[1]) label(svg, ...P(R).map((q, i) => q + (i ? -12 : 12)), "R", "pt-lbl");
    const mag = (v) => Math.hypot(v[0], v[1]);
    const ang = (v) => (Math.atan2(v[1], v[0]) * 180) / Math.PI;
    const zero = !R[0] && !R[1];
    out.innerHTML = `<p><span class="dot dot-a"></span> F₁ = ${fmt(mag(F1), 1)} N, <span class="dot dot-b"></span> F₂ = ${fmt(mag(F2), 1)} N, <span class="dot dot-c"></span> rezultanta <b>R = ${fmt(mag(R), 1)} N</b>${zero ? "" : ` pod kotom ${fmt(ang(R), 0)}° glede na os x`}.</p>
      ${texBlock(`\\vec R = \\vec F_1 + \\vec F_2 = (${F1[0]} + ${F2[0] < 0 ? `(${F2[0]})` : F2[0]},\\ ${F1[1]} + ${F2[1] < 0 ? `(${F2[1]})` : F2[1]})\\ \\text{N} = (${R[0]},\\ ${R[1]})\\ \\text{N}`)}
      <p>${zero ? "<b>Sili sta v ravnovesju:</b> sta enako veliki in nasprotno usmerjeni, vsota je 0." : "Sili sestavimo s paralelogramom: rezultanta je njegova diagonala. Sile v isti smeri se seštejejo, nasprotne se odštejejo."} ${eqv && !zero ? "Rdeča sila −R uravnovesi obe sili: telo ostane v miru." : ""}</p>
      <p class="muted">|R| je največja, ko kažeta sili v isto smer (${fmt(mag(F1) + mag(F2), 1)} N), in najmanjša, ko kažeta nasprotno (${fmt(Math.abs(mag(F1) - mag(F2)), 1)} N).</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [toggle("pokaži komponente", comp, (v) => ((comp = v), draw())), toggle("sila, ki uravnovesi (−R)", eqv, (v) => ((eqv = v), draw()))],
    out,
    tryText: "Nastavi sili tako, da bo rezultanta 0. Nato nastavi dve sili po 5 N, ki dasta rezultanto 5 N.",
  });
  draw();
}

// ------------------------------------------------------------ klada: trenje in Newtonov zakon
const SURF = [["les", "les na lesu", 0.5, 0.3], ["guma", "guma na betonu", 0.9, 0.7], ["led", "kovina na ledu", 0.1, 0.05], ["nic", "brez trenja", 0, 0]];
export function klada(el, { mode = "trenje" } = {}) {
  const svg = svgBox(340, 230);
  const svg2 = svgBox(340, 190);
  const out = readout();
  let m = 5, F = 10, surf = mode === "newton" ? "nic" : "les", x = 0, v = 0, t = 0, hist = [];
  const sf = () => SURF.find((q) => q[0] === surf);
  const state = () => {
    const [, , ms, mk] = sf(), Fn = m * G;
    const Fs = ms * Fn, Fk = mk * Fn;
    let Ft, a;
    if (Math.abs(v) < 1e-6) {
      if (F <= Fs) (Ft = F), (a = 0);
      else (Ft = Fk), (a = (F - Fk) / m);
    } else (Ft = Fk), (a = (F - Fk) / m);
    return { Fn, Fs, Fk, Ft, a };
  };
  const draw = () => {
    svg.replaceChildren();
    const st = state();
    const yG = 150, PXM = 60; // 60 px na meter poti
    // podlaga s črticami, ki se premikajo pod klado (pogled sledi kladi)
    s("rect", { x: 0, y: yG, width: 340, height: 80, class: surf === "led" ? "fill-soft" : "wall" }, svg);
    const off = (((x * PXM) % 30) + 30) % 30;
    for (let gx = -off; gx < 340; gx += 30) s("line", { x1: gx, y1: yG, x2: gx - 10, y2: yG + 10, class: "axis thin" }, svg);
    // velikost klade raste z maso (enaka gostota: rob ∝ ∛m)
    const side = 30 * Math.cbrt(m), bw = side * 1.3, bh = side;
    const bx = 140 - bw / 2;
    s("rect", { x: bx, y: yG - bh, width: bw, height: bh, rx: 3, class: "fill-a" }, svg);
    label(svg, bx + bw * 0.28, yG - bh * 0.72, `${m} kg`, "tick small b inv");
    // vse sile v istem merilu: 0,85 px na N
    const fs = 0.85;
    force(svg, bx + bw, yG - bh / 2, F * fs, 0, "b", "");
    if (F > 0) label(svg, bx + bw + Math.max(F * fs, 30) / 2 + 6, yG - bh / 2 - 13, `F = ${fmt(F, 0)} N`, "lbl small");
    if (st.Ft > 0.01) {
      force(svg, bx, yG - 4, -st.Ft * fs, 0, "danger", "");
      label(svg, bx - Math.max(st.Ft * fs, 40) / 2, yG - 17, `F_tr = ${fmt(st.Ft, 1)} N`, "lbl small");
    }
    force(svg, bx + bw / 2 + 8, yG - bh / 2, 0, st.Fn * fs, "text", "F_g", { width: 2 });
    force(svg, bx + bw / 2 - 8, yG - bh, 0, -st.Fn * fs, "c", "F_N", { width: 2 });
    label(svg, 4, 14, "vse puščice sil v istem merilu", "tick small", "start");
    if (Math.abs(v) > 0.01) label(svg, 336, 14, `v = ${fmt(v, 1)} m/s`, "lbl small", "end");
    // graf
    svg2.replaceChildren();
    if (mode === "trenje") {
      const Fmax = 100;
      const A = axes(svg2, { W: 340, H: 190, x: [0, Fmax], y: [0, Math.max(10, st.Fs * 1.3)], xLabel: "F vlečna [N]", yLabel: "F_tr [N]", pad: 34 });
      const d = `M${A.X(0)},${A.Y(0)} L${A.X(st.Fs)},${A.Y(st.Fs)} L${A.X(st.Fs)},${A.Y(st.Fk)} L${A.X(Fmax)},${A.Y(st.Fk)}`;
      s("path", { d, class: "graph-line stroke-danger", fill: "none" }, svg2);
      s("circle", { cx: A.X(F), cy: A.Y(st.Ft), r: 5.5, class: "pt fill-accent" }, svg2);
      label(svg2, A.X(st.Fs / 2), A.Y(st.Fs / 2) - 14, "lepenje", "tick b");
      label(svg2, A.X((st.Fs + Fmax) / 2), A.Y(st.Fk) - 10, "drsenje", "tick b");
    } else {
      timeGraph(svg2, { tMax: 10, y0: 0, y1: 20, yLabel: "v [m/s]", t, f: (tt) => { const p = hist.findLast?.((q) => q[0] <= tt + 1e-9); return p ? p[1] : 0; }, cls: "stroke-b" });
    }
    const [, sname, ms, mk] = sf();
    const moving = st.a > 0 || Math.abs(v) > 1e-6;
    out.innerHTML = (mode === "trenje"
      ? texBlock(`F_{tr,\\max} = k_l\\, F_N = ${T(ms)}\\cdot ${T(st.Fn, 1)}\\ \\text{N} = ${T(st.Fs, 1)}\\ \\text{N}`) +
        `<p>Podlaga: ${sname} (koeficient lepenja k_l = ${fmt(ms)}, trenja k_tr = ${fmt(mk)}). ${F <= st.Fs && !moving ? `Vlečna sila ${fmt(F, 0)} N je premajhna: <b>sila lepenja</b> je enako velika in nasprotna, klada miruje.` : `Klada drsi. Sila trenja je F_tr = k_tr · F_N = ${fmt(st.Fk, 1)} N in je manjša od največje sile lepenja.`}</p>`
      : texBlock(`a = \\frac{F - F_{tr}}{m} = \\frac{${T(F, 0)} - ${T(st.Ft, 1)}}{${m}} = ${T(st.a, 2)}\\ \\tfrac{\\text{m}}{\\text{s}^2}`) +
        `<p><b>2. Newtonov zakon:</b> rezultanta sil daje telesu pospešek a = F/m. Večja sila → večji pospešek, večja masa → manjši. ${surf === "nic" ? "Brez trenja klada pospešuje že pri majhni sili." : ""}</p>`) +
      `<p class="muted">Teža F_g = m·g = ${fmt(st.Fn, 1)} N, podlaga deluje s silo F_N enake velikosti navzgor. ${mode === "newton" ? "Ko vlečno silo nastaviš na 0, se klada brez trenja giblje naprej enakomerno (1. Newtonov zakon)." : "Sila trenja ni odvisna od hitrosti, odvisna je od pritisne sile in vrste podlage."}</p>`;
  };
  const anim = animate(el, (dt) => {
    const st = state();
    if (Math.abs(v) < 1e-6 && st.a <= 0) {
      v = 0;
      if (mode === "trenje") return draw(), false;
    }
    let a = st.a;
    if (v > 0 && F < st.Fk) a = (F - st.Fk) / m;
    v = Math.max(0, v + a * dt);
    x += v * dt;
    if (mode === "newton") {
      t += dt;
      hist.push([t, v]);
      if (t >= 10) return draw(), false;
    }
    draw();
  }, { autoplay: false });
  const restart = () => {
    x = 0;
    v = 0;
    t = 0;
    hist = [[0, 0]];
    draw();
  };
  const ctl = [
    slider({ label: "vlečna sila F", min: 0, max: mode === "trenje" ? 60 : 40, value: F, unit: "N", onInput: (val) => ((F = val), mode === "trenje" ? (draw(), anim.play()) : draw()) }),
    slider({ label: "masa m", min: 1, max: 10, value: m, unit: "kg", onInput: (val) => ((m = val), mode === "trenje" ? (restart(), anim.play()) : draw()) }),
    select({ label: "podlaga", options: SURF.filter((q) => mode === "newton" || q[0] !== "nic").map((q) => [q[0], q[1]]), value: surf, onChange: (val) => ((surf = val), mode === "trenje" ? (restart(), anim.play()) : draw()) }),
  ];
  if (mode === "newton") ctl.push(buttons(playButton(anim, { play: "Spusti", pause: "Ustavi" }), button("Na začetek", () => (anim.pause(), restart()))));
  layout(el, { stage: [svg, svg2], controls: ctl, out, tryText: mode === "trenje" ? "Počasi večaj vlečno silo. Pri kateri sili se klada premakne? Zakaj potem za vlečenje zadošča manjša sila?" : "Podvoji maso in podvoji silo. Ali se pospešek spremeni?" });
  restart();
  if (mode === "trenje") anim.play();
}

// ------------------------------------------------------------ gostota, plavanje in vzgon
const LIQ = [["voda", "voda", 1000], ["slana", "morska voda", 1030], ["olje", "olje", 900], ["alkohol", "alkohol", 790]];
const MAT = [["pluta", "pluta", 240], ["les", "les (bor)", 520], ["led", "led", 917], ["plastika", "plastika (PE)", 950], ["opeka", "opeka", 1900], ["aluminij", "aluminij", 2700], ["zelezo", "železo", 7870]];
export function gostota(el, { mode = "gostota" } = {}) {
  const svg = svgBox(340, 270);
  const out = readout();
  let liq = "voda", mat = mode === "vzgon" ? "aluminij" : "les", V = 500, depth = 60;
  const draw = () => {
    svg.replaceChildren();
    const rl = LIQ.find((q) => q[0] === liq)[2], ro = MAT.find((q) => q[0] === mat)[2];
    const side = Math.cbrt(V) * 6; // cm → px (6 px/cm)
    const m = (ro * V) / 1e6, Fg = m * G;
    const tank = { x: mode === "vzgon" ? 40 : 70, y: 70, w: 200, h: 180 };
    const surfY = mode === "vzgon" ? 120 : 110;
    s("rect", { x: tank.x, y: surfY, width: tank.w, height: tank.y + tank.h - surfY, class: "fill-b", opacity: liq === "olje" ? 0.3 : 0.22 }, svg);
    s("path", { d: `M${tank.x},${tank.y} V${tank.y + tank.h} H${tank.x + tank.w} V${tank.y}`, class: "beaker" }, svg);
    let html;
    if (mode === "gostota") {
      const f = ro / rl;
      let top;
      if (f < 1) top = surfY - side * (1 - f);
      else top = tank.y + tank.h - side;
      const cx = tank.x + tank.w / 2;
      s("rect", { x: cx - side / 2, y: top, width: side, height: side, rx: 2, class: "fill-a", opacity: 0.9 }, svg);
      s("line", { x1: tank.x, y1: surfY, x2: tank.x + tank.w, y2: surfY, class: "graph-line stroke-b thin-line" }, svg);
      const sub = Math.min(1, f);
      const Fb = rl * G * (V * sub) / 1e6;
      // obe sili v istem merilu: daljša puščica je dolga 70 px
      const ks = 70 / Math.max(Fg, Fb);
      force(svg, cx + 10, top + side / 2, 0, Fg * ks, "text", "F_g", { width: 2.5 });
      force(svg, cx - 10, top + side / 2, 0, -Fb * ks, "c", "F_vzg", { width: 2.5 });
      label(svg, 300, 90, `ρ telesa`, "tick", "middle");
      label(svg, 300, 106, `${ro} kg/m³`, "lbl small");
      label(svg, 300, 140, `ρ tekočine`, "tick", "middle");
      label(svg, 300, 156, `${rl} kg/m³`, "lbl small");
      html = texBlock(`m = \\rho V = ${ro}\\ \\tfrac{\\text{kg}}{\\text{m}^3}\\cdot ${T(V / 1e6, 6)}\\ \\text{m}^3 = ${T(m, 3)}\\ \\text{kg}`) +
        `<p>${f < 1 ? `Gostota telesa je <b>manjša</b> od gostote tekočine, zato telo <b>plava</b>. Potopljen je le ${fmt(f * 100, 0)} % prostornine (ρ_telesa / ρ_tekočine), da je vzgon enak teži.` : f === 1 ? "Gostoti sta enaki: telo lebdi v tekočini." : `Gostota telesa je <b>večja</b> od gostote tekočine, zato telo <b>potone</b>: tudi ko je povsem potopljeno, je vzgon (${fmt(rl * G * V / 1e6, 2)} N) manjši od teže (${fmt(Fg, 2)} N).`}</p>
         <p class="muted">Gostota ni odvisna od velikosti telesa: večji kos lesa plava enako globoko (v deležih) kot manjši.</p>`;
    } else {
      // telo na silomeru, spuščeno v tekočino
      const cx = tank.x + tank.w / 2;
      const bottom = surfY - 10 + (depth / 100) * (side + 20);
      const top = bottom - side < 0 ? 0 : bottom - side;
      const subH = clamp(top + side - surfY, 0, side), Vs = (subH / side) * V;
      const Fb = (rl * G * Vs) / 1e6, reading = Math.max(0, Fg - Fb);
      s("line", { x1: cx, y1: 36, x2: cx, y2: top, class: "string" }, svg);
      s("rect", { x: cx - side / 2, y: top, width: side, height: side, rx: 2, class: "fill-a", opacity: 0.9 }, svg);
      s("rect", { x: cx - 26, y: 6, width: 52, height: 30, rx: 6, class: "meter" }, svg);
      label(svg, cx, 21, `${fmt(reading, 2)} N`, "meter-label");
      // izpodrinjena tekočina v merilnem valju
      s("path", { d: "M282,120 V250 H322 V120", class: "beaker" }, svg);
      const lvl = (Vs / 1000) * 120;
      s("rect", { x: 283, y: 249 - lvl, width: 38, height: lvl, class: "fill-b", opacity: 0.35 }, svg);
      label(svg, 302, 108, `${fmt(Vs, 0)} cm³`, "lbl small");
      label(svg, 302, 262, "izpodrinjena", "tick small");
      const ks = 70 / Math.max(Fg, Fb);
      force(svg, cx + side / 2 + 12, top + side / 2, 0, Fg * ks, "text", "F_g", { width: 2.5 });
      if (Fb > 0.01) force(svg, cx - side / 2 - 12, top + side / 2, 0, -Fb * ks, "c", "F_vzg", { width: 2.5 });
      html = texBlock(`F_{vzg} = \\rho_{tek}\\, g\\, V_{pot} = ${rl}\\cdot 9{,}81\\cdot ${T(Vs / 1e6, 6)} = ${T(Fb, 2)}\\ \\text{N}`) +
        `<p>Silomer kaže ${fmt(Fg, 2)} N − ${fmt(Fb, 2)} N = <b>${fmt(reading, 2)} N</b>. <b>Arhimedov zakon:</b> vzgon je enak teži izpodrinjene tekočine (${fmt(Vs, 0)} cm³ ${LIQ.find((q) => q[0] === liq)[1]}).</p>
         <p class="muted">${Fg - Fb <= 0 ? "Vzgon je že večji od teže: telo bi samo splavalo, vrvica se ohlapi." : "Ko je telo povsem potopljeno, se vzgon z globino ne spreminja več."}</p>`;
    }
    out.innerHTML = html;
  };
  const ctl = [
    select({ label: "telo", options: MAT.map((q) => [q[0], `${q[1]} (${q[2]} kg/m³)`]), value: mat, onChange: (v) => ((mat = v), draw()) }),
    select({ label: "tekočina", options: LIQ.map((q) => [q[0], `${q[1]} (${q[2]} kg/m³)`]), value: liq, onChange: (v) => ((liq = v), draw()) }),
    slider({ label: "prostornina", min: 100, max: 1000, step: 50, value: V, unit: "cm³", onInput: (v) => ((V = v), draw()) }),
  ];
  if (mode === "vzgon") ctl.push(slider({ label: "spusti telo", min: 0, max: 100, value: depth, unit: "%", onInput: (v) => ((depth = v), draw()) }));
  layout(el, { stage: [svg], controls: ctl, out, tryText: mode === "vzgon" ? "Spuščaj telo počasi v vodo. Kdaj se odčitek silomera neha spreminjati?" : "Kateri material plava v olju, potone pa v vodi? Kaj pa obratno?" });
  draw();
}

// ------------------------------------------------------------ tlak
const BRICK = [["pokonci", 0.12, 0.065], ["na boku", 0.25, 0.065], ["plosko", 0.25, 0.12]];
const SHOES = [["petke", 0.0004], ["čevlji", 0.05], ["krplje", 0.25], ["smuči", 0.6]];
export function tlak(el, { mode = "ploskev" } = {}) {
  if (mode === "hidro") return tlakHidro(el);
  const svg = svgBox(340, 220);
  const out = readout();
  let obj = "opeka", ori = 2, shoe = 1, m = 60;
  const ctl = h("div", { class: "demo-controls" });
  const draw = () => {
    svg.replaceChildren();
    let mass, S, wPx, hPx, name;
    if (obj === "opeka") {
      const [nm, a, b] = BRICK[ori];
      mass = 2.5;
      S = a * b;
      name = `opeka ${nm}`;
      const dims = { 0: [0.12, 0.25], 1: [0.25, 0.12], 2: [0.25, 0.065] }[ori];
      wPx = dims[0] * 400;
      hPx = dims[1] * 400;
    } else {
      mass = m;
      S = SHOES[shoe][1];
      name = SHOES[shoe][0];
      wPx = Math.min(240, Math.max(18, Math.sqrt(S / 2) * 260));
      hPx = 110;
    }
    const F = mass * G, p = F / S;
    const sink = clamp(Math.log10(p / 200) * 14, 0, 60);
    const ys = 150;
    s("rect", { x: 0, y: ys, width: 340, height: 70, class: "fill-soft" }, svg);
    s("line", { x1: 0, y1: ys, x2: 340, y2: ys, class: "axis thin" }, svg);
    const cx = 170;
    if (obj === "opeka") s("rect", { x: cx - wPx / 2, y: ys + sink - hPx, width: wPx, height: hPx, rx: 2, class: "fill-danger", opacity: 0.8 }, svg);
    else {
      const top = ys + sink - hPx;
      s("circle", { cx, cy: top + 14, r: 12, class: "fill-a" }, svg);
      s("rect", { x: cx - 13, y: top + 28, width: 26, height: 46, rx: 8, class: "fill-a" }, svg);
      s("line", { x1: cx - 6, y1: top + 72, x2: cx - 8, y2: ys + sink - 6, class: "ray-line" }, svg);
      s("line", { x1: cx + 6, y1: top + 72, x2: cx + 8, y2: ys + sink - 6, class: "ray-line" }, svg);
      s("rect", { x: cx - wPx / 2, y: ys + sink - 6, width: wPx, height: 6, rx: 3, class: "fill-c" }, svg);
    }
    s("rect", { x: cx - wPx / 2, y: ys + sink, width: wPx, height: 3, class: "fill-danger", opacity: 0.5 }, svg);
    label(svg, 10, 20, `ploščina stika S = ${fmt(S * 1e4, 0)} cm²`, "tick b", "start");
    label(svg, 10, 38, `pogrezne se ${fmt(sink / 10, 1)} cm (v snegu)`, "tick", "start");
    out.innerHTML = texBlock(`p = \\frac{F}{S} = \\frac{${T(F, 1)}\\ \\text{N}}{${T(S, 4)}\\ \\text{m}^2} = ${T(p, 0)}\\ \\text{Pa} = ${T(p / 1000, 1)}\\ \\text{kPa}`) +
      `<p>${name}: teža ${fmt(F, 1)} N se porazdeli po ploščini ${fmt(S * 1e4, 0)} cm². <b>Manjša ploskev → večji tlak</b> pri isti sili.</p>
       <p class="muted">Zato imajo krplje in smuči veliko ploskev (manj se pogrezamo), noži in igle pa majhno (velik tlak, lažje režejo).</p>`;
  };
  const build = () => {
    ctl.replaceChildren(
      segmented({ options: [["opeka", "opeka"], ["clovek", "človek"]], value: obj, onChange: (v) => ((obj = v), build()) }),
      obj === "opeka"
        ? segmented({ options: BRICK.map((b, i) => [String(i), b[0]]), value: String(ori), onChange: (v) => ((ori = Number(v)), draw()) })
        : segmented({ options: SHOES.map((b, i) => [String(i), b[0]]), value: String(shoe), onChange: (v) => ((shoe = Number(v)), draw()) }),
      ...(obj === "clovek" ? [slider({ label: "masa", min: 20, max: 100, step: 5, value: m, unit: "kg", onInput: (v) => ((m = v), draw()) })] : []),
    );
    draw();
  };
  layout(el, { stage: [svg], controls: ctl, out, tryText: "Kolikokrat večji tlak naredi opeka, ki stoji pokonci, kot opeka, ki leži plosko?" });
  build();
}

function tlakHidro(el) {
  const svg = svgBox(340, 280);
  const out = readout();
  let liq = "voda", hd = 10, p0 = true;
  const draw = () => {
    svg.replaceChildren();
    const rl = LIQ.find((q) => q[0] === liq)[2];
    const top = 30, bot = 260, maxH = 40, Y = (d) => top + (d / maxH) * (bot - top);
    s("rect", { x: 20, y: top, width: 130, height: bot - top, class: "fill-b", opacity: 0.25 }, svg);
    s("line", { x1: 20, y1: top, x2: 150, y2: top, class: "graph-line stroke-b thin-line" }, svg);
    for (let d = 0; d <= maxH; d += 10) {
      s("line", { x1: 150, y1: Y(d), x2: 158, y2: Y(d), class: "axis thin" }, svg);
      label(svg, 162, Y(d), `${d} m`, "tick small", "start");
    }
    // potapljač
    const yy = Y(hd);
    s("ellipse", { cx: 80, cy: yy, rx: 22, ry: 8, class: "fill-a" }, svg);
    s("circle", { cx: 106, cy: yy - 2, r: 7, class: "fill-a" }, svg);
    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => arrow(svg, 80 + dx * 46, yy + dy * 32, 80 + dx * 26, yy + dy * 12, "c", 2));
    const pH = rl * G * hd, p = pH + (p0 ? 101300 : 0);
    // graf p(h)
    const gx = (d) => 210 + (d / maxH) * 120, gy = (pp) => 250 - (pp / 6e5) * 210;
    s("line", { x1: 210, y1: 250, x2: 334, y2: 250, class: "axis" }, svg);
    s("line", { x1: 210, y1: 250, x2: 210, y2: 34, class: "axis" }, svg);
    label(svg, 214, 40, "p [kPa]", "axis-label", "start");
    label(svg, 334, 264, "h [m]", "axis-label", "end");
    for (let k = 0; k <= 6; k += 2) label(svg, 206, gy(k * 1e5), String(k * 100), "tick small", "end");
    for (let d = 0; d <= maxH; d += 20) label(svg, gx(d), 262, String(d), "tick small");
    s("line", { x1: gx(0), y1: gy(p0 ? 101300 : 0), x2: gx(maxH), y2: gy(rl * G * maxH + (p0 ? 101300 : 0)), class: "graph-line stroke-c" }, svg);
    s("circle", { cx: gx(hd), cy: gy(p), r: 5, class: "pt fill-accent" }, svg);
    out.innerHTML = texBlock(`p = ${p0 ? "p_0 + " : ""}\\rho g h = ${p0 ? "101{,}3\\ \\text{kPa} + " : ""}${rl}\\cdot 9{,}81\\cdot ${hd}\\ \\text{Pa} = ${T(p / 1000, 1)}\\ \\text{kPa}`) +
      `<p>Hidrostatični tlak narašča <b>premo sorazmerno z globino</b> in z gostoto tekočine. V vodi se poveča za približno 1 bar (100 kPa) na vsakih 10 m.</p>
       <p class="muted">Tlak v tekočini deluje v vse smeri enako (puščice). Ni odvisen od oblike posode, le od globine pod gladino.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "globina h", min: 0, max: 40, value: hd, unit: "m", onInput: (v) => ((hd = v), draw()) }),
      select({ label: "tekočina", options: LIQ.map((q) => [q[0], `${q[1]} (${q[2]} kg/m³)`]), value: liq, onChange: (v) => ((liq = v), draw()) }),
      toggle("prištej zračni tlak p₀", p0, (v) => ((p0 = v), draw())),
    ],
    out,
    tryText: "Na kateri globini je tlak v vodi dvakrat večji kot na gladini?",
  });
  draw();
}

// ------------------------------------------------------------ premo gibanje
export function gibanje(el, { mode = "enakomerno" } = {}) {
  const road = svgBox(340, 90);
  const svg = svgBox(340, 200);
  const out = readout();
  const acc = mode === "pospeseno";
  let v0 = acc ? 2 : 8, a = acc ? 2 : 0, x0 = 0, t = 0, show = "s";
  const tMax = 10;
  const xAt = (tt) => x0 + v0 * tt + (a * tt * tt) / 2, vAt = (tt) => v0 + a * tt;
  // Cesta v stalnem merilu (2,5 px na meter): hitrejši avto se res hitreje premika po sliki.
  // Ko avto pride blizu roba, se pogled premakne za njim.
  const PX = 2.5, WM = 296 / PX;
  let cam = 0;
  const camReset = () => (cam = x0 - (v0 < 0 || a < 0 ? 0.7 : 0.15) * WM);
  const draw = () => {
    road.replaceChildren();
    svg.replaceChildren();
    const xc = xAt(t);
    if (xc < cam + 0.12 * WM) cam = xc - 0.12 * WM;
    if (xc > cam + 0.88 * WM) cam = xc - 0.88 * WM;
    const X = (xx) => 22 + (xx - cam) * PX;
    s("rect", { x: 0, y: 58, width: 340, height: 14, class: "fill-soft" }, road);
    for (let m = Math.ceil((cam - 10) / 10) * 10; m <= cam + WM + 10; m += 10) {
      if (X(m) < 0 || X(m) > 340) continue;
      s("line", { x1: X(m), y1: 58, x2: X(m), y2: m % 20 ? 64 : 72, class: "axis thin" }, road);
      if (m % 20 === 0) label(road, X(m), 84, `${m} m`, "tick small");
    }
    for (let k = 0; k <= Math.floor(t + 1e-9); k++) {
      const xk = X(xAt(k));
      if (xk > -4 && xk < 344) s("circle", { cx: xk, cy: 52, r: 3, class: "pt fill-c" }, road);
    }
    car(road, X(xc), 56, "a", vAt(t) < 0);
    label(road, 336, 12, `t = ${fmt(t, 1)} s · v = ${fmt(vAt(t), 1)} m/s`, "lbl small", "end");
    label(road, 4, 12, "merilo: 20 m", "tick small", "start");
    s("line", { x1: 4, y1: 20, x2: 4 + 20 * PX, y2: 20, class: "axis" }, road);
    // grafi imajo stalne osi, da se sprememba vnosa vidi kot sprememba naklona
    const cfg = {
      s: { f: xAt, yLabel: "x [m]", lo: acc ? -150 : -100, hi: acc ? 450 : 300 },
      v: { f: vAt, yLabel: "v [m/s]", lo: acc ? -45 : -10, hi: acc ? 70 : 20 },
      a: { f: () => a, yLabel: "a [m/s²]", lo: -5, hi: 5 },
    }[show];
    timeGraph(svg, { tMax, y0: cfg.lo, y1: cfg.hi, yLabel: cfg.yLabel, f: cfg.f, t, cls: show === "s" ? "stroke-a" : show === "v" ? "stroke-b" : "stroke-c", area: show === "v" });
    const xs = xAt(t) - x0;
    out.innerHTML = (acc
      ? texBlock(`v = v_0 + a t = ${T(v0, 1)} + ${T(a, 1)}\\cdot ${T(t, 1)} = ${T(vAt(t), 1)}\\ \\tfrac{\\text{m}}{\\text{s}}`) + texBlock(`s = v_0 t + \\frac{a t^2}{2} = ${T(xs, 1)}\\ \\text{m}`)
      : texBlock(`s = v\\cdot t = ${T(v0, 1)}\\ \\tfrac{\\text{m}}{\\text{s}}\\cdot ${T(t, 1)}\\ \\text{s} = ${T(xs, 1)}\\ \\text{m}`)) +
      `<p>${acc ? "Pri enakomerno pospešenem gibanju se hitrost vsako sekundo spremeni za enako vrednost a. Vijolične pike (položaj vsako sekundo) so vse bolj narazen." : "Pri enakomernem gibanju telo v enakih časih prepotuje enake poti: vijolične pike (vsako sekundo) so enako narazen."}</p>
       <p class="muted">${show === "v" ? "Ploščina pod grafom v(t) je prepotovana pot." : show === "s" ? (acc ? "Graf x(t) je parabola; njen naklon v vsaki točki je trenutna hitrost." : "Graf x(t) je premica; njen naklon je hitrost.") : "Pospešek je stalen, zato je graf a(t) vodoravna premica."}</p>`;
  };
  const anim = animate(el, (dt) => {
    t = Math.min(tMax, t + dt);
    draw();
    if (t >= tMax) return false;
  }, { autoplay: false });
  const restart = () => (anim.pause(), (t = 0), camReset(), draw());
  const ctl = [
    segmented({ options: acc ? [["s", "x(t)"], ["v", "v(t)"], ["a", "a(t)"]] : [["s", "x(t)"], ["v", "v(t)"]], value: show, onChange: (v) => ((show = v), draw()) }),
    slider({ label: acc ? "začetna hitrost v₀" : "hitrost v", min: acc ? -5 : -10, max: 20, step: 1, value: v0, unit: "m/s", onInput: (v) => ((v0 = v), restart()) }),
  ];
  if (acc) ctl.push(slider({ label: "pospešek a", min: -4, max: 5, step: 0.5, value: a, unit: "m/s²", onInput: (v) => ((a = v), restart()) }));
  else ctl.push(slider({ label: "začetna lega x₀", min: 0, max: 100, step: 10, value: x0, unit: "m", onInput: (v) => ((x0 = v), restart()) }));
  ctl.push(buttons(playButton(anim, { play: "Vozi", pause: "Ustavi" }), button("Na začetek", restart)));
  const prevPlay = anim.play;
  anim.play = () => {
    if (t >= tMax) (t = 0), camReset();
    prevPlay();
  };
  layout(el, { stage: [road, svg], controls: ctl, out, tryText: acc ? "Nastavi v₀ = 10 m/s in a = −2 m/s². Kdaj se avto ustavi in kaj se zgodi potem?" : "Nastavi negativno hitrost. Kako izgleda graf x(t)?" });
  camReset();
  draw();
}

// ------------------------------------------------------------ prosti pad v pravem merilu in pravem času
// Merilo slike se prilagodi višini (večja višina → pogled se oddalji, krogla in človek sta manjša),
// krogla pa pada v resničnem času s pospeškom g izbranega kraja.
const PAD_KRAJI = [["Zemlja", 9.81], ["Luna", 1.62], ["Mars", 3.71], ["Jupiter", 24.8]];
export function prostiPad(el) {
  const W = 340, HH = 330, ground = 300, topY = 22;
  const svg = svgBox(W, HH);
  const out = readout();
  let H = 20, gi = 0, slow = 1, t = 0, running = false, t0 = 0, view = null;
  const R = 0.11; // polmer krogle (nogometna žoga) v metrih
  const g = () => PAD_KRAJI[gi][1];
  const tEnd = () => Math.sqrt((2 * H) / g());
  const strobe = () => [0.05, 0.1, 0.2, 0.25, 0.5, 1].find((d) => tEnd() / d <= 14) || 1;
  const niceStep = (span) => [0.5, 1, 2, 5, 10, 20, 25, 50].find((st) => span / st <= 6) || 50;
  const draw = () => {
    svg.replaceChildren();
    const target = Math.max(H * 1.12, 2.3); // koliko metrov je vidnih v višino
    view = view == null ? target : view;
    const k = (ground - topY) / view; // px na meter
    const Y = (m) => ground - m * k;
    const tt = Math.min(t, tEnd()), y = H - (g() * tt * tt) / 2, v = g() * tt;
    // tla in višinska skala
    s("rect", { x: 0, y: ground, width: W, height: HH - ground, class: "fill-soft" }, svg);
    s("line", { x1: 0, y1: ground, x2: W, y2: ground, class: "ground" }, svg);
    const st = niceStep(view);
    s("line", { x1: 46, y1: Y(0), x2: 46, y2: Math.max(topY - 6, Y(view)), class: "axis" }, svg);
    for (let m = 0; m <= view + 1e-9; m += st) {
      s("line", { x1: 42, y1: Y(m), x2: 50, y2: Y(m), class: "axis" }, svg);
      label(svg, 38, Y(m) + 4, `${fmt(m, st < 1 ? 1 : 0)} m`, "tick small", "end");
    }
    // stolp z ograjo, s katerega spustimo kroglo
    const bx = 88, bw = Math.max(14, Math.min(60, 3 * k));
    s("rect", { x: bx, y: Y(H), width: bw, height: H * k, class: "fill-muted", opacity: 0.35 }, svg);
    s("line", { x1: bx, y1: Y(H), x2: bx + bw + 30, y2: Y(H), class: "axis" }, svg);
    s("line", { x1: bx + 10, y1: Y(H) + 0.3, x2: W - 8, y2: Y(H) + 0.3, class: "guide" }, svg);
    label(svg, bx + bw + 34, Y(H) - 6, `h = ${fmt(H, 0)} m`, "lbl small", "start");
    // človek, visok 1,7 m, za primerjavo velikosti
    const px = 250, hu = 1.7 * k;
    const head = 0.12 * k, lw = Math.max(1, 0.06 * k);
    s("circle", { cx: px, cy: ground - hu + head, r: head, class: "fill-a" }, svg);
    s("line", { x1: px, y1: ground - hu + 2 * head, x2: px, y2: ground - 0.85 * k, class: "graph-line stroke-a", "stroke-width": lw }, svg);
    s("line", { x1: px, y1: ground - 0.85 * k, x2: px - 0.18 * k, y2: ground, class: "graph-line stroke-a", "stroke-width": lw }, svg);
    s("line", { x1: px, y1: ground - 0.85 * k, x2: px + 0.18 * k, y2: ground, class: "graph-line stroke-a", "stroke-width": lw }, svg);
    s("line", { x1: px - 0.3 * k, y1: ground - 1.3 * k, x2: px + 0.3 * k, y2: ground - 1.3 * k, class: "graph-line stroke-a", "stroke-width": lw }, svg);
    if (hu < 26) label(svg, px, ground - hu - 6, "1,7 m", "tick small");
    // stroboskopske sence (vsakih dt sekund) in krogla
    const bxBall = bx + bw + 16, r = Math.max(2, R * k), dts = strobe();
    for (let i = 1; i * dts < tt - 1e-9; i++) {
      const yi = H - (g() * (i * dts) ** 2) / 2;
      s("circle", { cx: bxBall, cy: Y(yi) - r, r, class: "ghost" }, svg);
    }
    s("circle", { cx: bxBall, cy: Y(y) - r, r, class: "ball" }, svg);
    // majhno kroglo označimo s krožcem, da jo oko najde (krogla sama ostane v merilu)
    if (r < 5) s("circle", { cx: bxBall, cy: Y(y) - r, r: 9, class: "graph-line stroke-danger thin-line", fill: "none", "stroke-dasharray": "3 2" }, svg);
    // merilnik hitrosti v stalnem merilu 0–75 m/s
    const mx = 312, vmax = 75, vy = (vv) => ground - (vv / vmax) * (ground - topY);
    s("rect", { x: mx - 7, y: vy(vmax), width: 14, height: ground - vy(vmax), rx: 3, class: "box" }, svg);
    if (v > 0) s("rect", { x: mx - 7, y: vy(v), width: 14, height: ground - vy(v), rx: 3, class: "fill-c" }, svg);
    for (let vv = 0; vv <= vmax; vv += 25) label(svg, mx - 10, vy(vv) + 4, String(vv), "tick small", "end");
    label(svg, mx, topY - 8, "v [m/s]", "tick small");
    label(svg, 8, 14, `t = ${fmt(tt, 2)} s${slow > 1 ? ` (prikaz ${slow}× počasneje)` : ""}`, "lbl small", "start");
    out.innerHTML = texBlock(`t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2\\cdot ${fmt(H, 0)}\\ \\text{m}}{${tfmt(g(), 2)}\\ \\text{m/s}^2}} = ${tfmt(tEnd(), 2)}\\ \\text{s},\\quad v = g\\,t = ${tfmt(g() * tEnd(), 1)}\\ \\tfrac{\\text{m}}{\\text{s}}`) +
      `<p>Zdaj: t = ${fmt(tt, 2)} s, prepotovano s = ½·g·t² = ${fmt(H - y, 2)} m, hitrost v = g·t = <b>${fmt(v, 1)} m/s</b> (${fmt(v * 3.6, 0)} km/h).</p>
       <p class="muted">Slika je v merilu: krogla ima premer 22 cm, človek je visok 1,7 m. Krogla pada v resničnem času${slow > 1 ? " (zdaj upočasnjeno)" : ""}. Sence kažejo lego vsakih ${fmt(dts, 2)} s: razmiki se večajo, ker hitrost vsako sekundo naraste za ${fmt(g(), 2)} m/s. Zračni upor zanemarimo.</p>`;
  };
  const tick = (now) => {
    if (!el.isConnected || !running) return;
    t = ((now - t0) / 1000) / slow;
    if (t >= tEnd()) (t = tEnd()), (running = false);
    draw();
    if (running) requestAnimationFrame(tick);
  };
  const drop = () => {
    t = 0;
    t0 = performance.now();
    running = true;
    requestAnimationFrame(tick);
  };
  // ob spremembi višine se pogled gladko približa/oddalji
  let zooming = false;
  const zoom = () => {
    if (zooming) return;
    zooming = true;
    const step = () => {
      const target = Math.max(H * 1.12, 2.3);
      view += (target - view) * 0.25;
      if (Math.abs(target - view) < target * 0.002) view = target;
      if (!running) draw();
      if (view !== target && el.isConnected) requestAnimationFrame(step);
      else zooming = false;
    };
    requestAnimationFrame(step);
  };
  const reset = () => ((running = false), (t = 0), draw(), zoom());
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "višina h", min: 1, max: 100, step: 1, value: H, unit: "m", onInput: (v) => ((H = v), reset()) }),
      select({ label: "kraj", options: PAD_KRAJI.map(([n, gg], i) => [String(i), `${n} (g = ${fmt(gg, 2)} m/s²)`]), value: "0", onChange: (v) => ((gi = Number(v)), reset()) }),
      select({ label: "hitrost prikaza", options: [["1", "resnični čas"], ["2", "2× počasneje"], ["5", "5× počasneje"]], value: "1", onChange: (v) => ((slow = Number(v)), reset()) }),
      buttons(button("Spusti kroglo", drop, "primary small")),
    ],
    out,
    tryText: "Kolikokrat dlje pada krogla, če višino povečaš 4-krat? Primerjaj padec z 20 m na Zemlji in na Luni.",
  });
  draw();
}
