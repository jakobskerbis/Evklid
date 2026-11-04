// Simulacije pri fiziki: delo, moč, energija (skejter), izkoristek, met, klanec, trki, kroženje, orbite.
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, texBlock, fmt, tfmt, clamp, label, axes, arrow, animate, playButton } from "./kit.js";
import { G, force, timeGraph } from "./fiz-skupno.js";

const T = (x, d = 2) => tfmt(x, d);
const rad = (d) => (d * Math.PI) / 180;

// ------------------------------------------------------------ delo in moč
export function delo(el, { mode = "delo" } = {}) {
  if (mode === "moc") return moc(el);
  const svg = svgBox(340, 170), svg2 = svgBox(340, 170);
  const out = readout();
  let F = 50, ang = 30, sx = 6;
  const draw = () => {
    svg.replaceChildren();
    svg2.replaceChildren();
    const yG = 135, px = 22; // px na meter
    s("rect", { x: 0, y: yG, width: 340, height: 35, class: "wall" }, svg);
    const x0 = 30, x1 = x0 + sx * px, bw = 54, bh = 40;
    s("rect", { x: x0, y: yG - bh, width: bw, height: bh, rx: 3, class: "fill-a", opacity: 0.25 }, svg);
    s("rect", { x: x1, y: yG - bh, width: bw, height: bh, rx: 3, class: "fill-a" }, svg);
    arrow(svg, x0 + bw / 2, yG + 18, x1 + bw / 2, yG + 18, "text", 2);
    label(svg, (x0 + x1) / 2 + bw / 2, yG + 9, `s = ${sx} m`, "lbl small");
    const ox = x1 + bw, oy = yG - bh / 2, L = 1.4 * F;
    const fx = L * Math.cos(rad(ang)), fy = -L * Math.sin(rad(ang));
    if (F > 0) {
      s("line", { x1: ox + fx, y1: oy + fy, x2: ox, y2: oy, class: "string" }, svg);
      if (ang > 2) {
        s("line", { x1: ox, y1: oy, x2: ox + fx, y2: oy, class: "guide stroke-b" }, svg);
        s("line", { x1: ox + fx, y1: oy, x2: ox + fx, y2: oy + fy, class: "guide stroke-c" }, svg);
        arrow(svg, ox, oy, ox + fx, oy, "b", 3);
        arrow(svg, ox, oy, ox, oy + fy, "c", 2.5);
        label(svg, ox + fx / 2, oy + 13, "F∥", "lbl small");
        label(svg, ox - 12, oy + fy / 2, "F⊥", "lbl small");
      }
      arrow(svg, ox, oy, ox + fx, oy + fy, "a", 3.5);
      label(svg, ox + fx + 10, oy + fy - 6, "F", "lbl small");
    }
    const Fp = F * Math.cos(rad(ang)), W = Fp * sx;
    const A = axes(svg2, { W: 340, H: 170, x: [0, 10], y: [0, 100], xLabel: "s [m]", yLabel: "F∥ [N]", pad: 34, xStep: 1, yStep: 20 });
    s("rect", { x: A.X(0), y: A.Y(Fp), width: A.X(sx) - A.X(0), height: A.Y(0) - A.Y(Fp), class: "area-fill fill-b" }, svg2);
    s("line", { x1: A.X(0), y1: A.Y(Fp), x2: A.X(10), y2: A.Y(Fp), class: "graph-line stroke-b" }, svg2);
    label(svg2, A.X(sx / 2), A.Y(Fp / 2), `W = ${fmt(W, 0)} J`, "lbl");
    out.innerHTML = texBlock(`A = F\\, s \\cos\\alpha = ${F}\\ \\text{N}\\cdot ${sx}\\ \\text{m}\\cdot\\cos ${ang}^\\circ = ${T(W, 0)}\\ \\text{J}`) +
      `<p>Delo opravi le komponenta sile v smeri premika (F∥ = ${fmt(Fp, 1)} N). ${ang === 90 ? "Sila je pravokotna na premik, zato <b>ne opravi dela</b>." : ang === 0 ? "Sila kaže v smeri premika, zato vsa opravlja delo." : "Komponenta F⊥ ne opravi dela."}</p>
       <p class="muted">Delo je ploščina pod grafom F∥(s). Enota: 1 J = 1 N · 1 m.</p>`;
  };
  layout(el, {
    stage: [svg, svg2],
    controls: [
      slider({ label: "sila F", min: 0, max: 100, step: 5, value: F, unit: "N", onInput: (v) => ((F = v), draw()) }),
      slider({ label: "kot α", min: 0, max: 90, step: 5, value: ang, unit: "°", onInput: (v) => ((ang = v), draw()) }),
      slider({ label: "pot s", min: 0, max: 10, value: sx, unit: "m", onInput: (v) => ((sx = v), draw()) }),
    ],
    out,
    tryText: "Pri katerem kotu opravi sila 100 N na poti 10 m le polovico največjega dela?",
  });
  draw();
}

function moc(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  let m = 60, hh = 10, tt = 20, prog = 1;
  const draw = () => {
    svg.replaceChildren();
    const top = 24, base = 236, Y = (y) => base - (y / 20) * (base - top);
    // stopnice
    let d = `M60,${base}`;
    const n = Math.max(1, Math.round(hh * 2));
    for (let i = 0; i < n; i++) d += ` V${Y(((i + 1) * hh) / n)} H${60 + ((i + 1) * 180) / n}`;
    d += ` V${base} Z`;
    s("path", { d, class: "wall" }, svg);
    // človek v merilu (1,7 m), širši pri večji masi
    const y = prog * hh, xx = 60 + prog * 180, kpx = (base - top) / 20, hu = 1.7 * kpx, wu = 0.45 * kpx * Math.sqrt(m / 60);
    s("circle", { cx: xx - wu / 2, cy: Y(y) - hu + 0.13 * kpx, r: 0.13 * kpx, class: "fill-a" }, svg);
    s("rect", { x: xx - wu, y: Y(y) - hu + 0.27 * kpx, width: wu, height: hu - 0.27 * kpx, rx: wu / 3, class: "fill-a" }, svg);
    s("line", { x1: 40, y1: Y(hh), x2: 300, y2: Y(hh), class: "guide" }, svg);
    arrow(svg, 300, base, 300, Y(hh), "c", 2);
    label(svg, 308, (base + Y(hh)) / 2, `h = ${hh} m`, "lbl small", "start");
    label(svg, 10, 16, `t = ${fmt(prog * tt, 1)} s`, "lbl small", "start");
    // stolpec moči v stalnem merilu (0–6 kW)
    const Pw = (m * G * hh) / tt, ph = Math.min(1, Pw / 6000) * 150;
    s("rect", { x: 14, y: 40, width: 16, height: 150, class: "fill-soft" }, svg);
    s("rect", { x: 14, y: 190 - ph, width: 16, height: ph, class: "bar fill-a" }, svg);
    label(svg, 22, 32, "P", "tick b");
    label(svg, 22, 202, `${fmt(Pw / 1000, 2)} kW`, "tick small");
    const W = m * G * hh, P = W / tt;
    out.innerHTML = texBlock(`A = m g h = ${m}\\cdot 9{,}81\\cdot ${hh} = ${T(W, 0)}\\ \\text{J}`) + texBlock(`P = \\frac{A}{t} = \\frac{${T(W, 0)}\\ \\text{J}}{${tt}\\ \\text{s}} = ${T(P, 0)}\\ \\text{W}`) +
      `<p>Moč pove, <b>kako hitro</b> opravljamo delo. Če isto stopnišče pretečeš v pol krajšem času, je delo enako, moč pa dvakrat večja.</p>
       <p class="muted">${fmt(P, 0)} W je toliko kot ${fmt(P / 10, 1)} LED žarnic po 10 W. 1 kW = 1000 W; 1 konjska moč ≈ 736 W.</p>`;
  };
  const anim = animate(el, (dt) => {
    prog = Math.min(1, prog + dt / tt * 4);
    draw();
    if (prog >= 1) return false;
  }, { autoplay: false });
  const prevPlay = anim.play;
  anim.play = () => {
    if (prog >= 1) prog = 0;
    prevPlay();
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "masa m", min: 20, max: 120, step: 5, value: m, unit: "kg", onInput: (v) => ((m = v), draw()) }),
      slider({ label: "višina h", min: 2, max: 20, value: hh, unit: "m", onInput: (v) => ((hh = v), draw()) }),
      slider({ label: "čas t", min: 4, max: 60, value: tt, unit: "s", onInput: (v) => ((tt = v), draw()) }),
      buttons(playButton(anim, { play: "Teci po stopnicah (4× hitreje)", pause: "Ustavi" })),
    ],
    out,
    tryText: "Koliko časa potrebuješ, da po stopnicah do višine 10 m razviješ moč 1 kW?",
  });
  draw();
}

// ------------------------------------------------------------ skejter: ohranitev energije
export function skejt(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  const m = 50, k = 0.3, Lx = 5;
  let h0 = 6, mu = 0, x = -Math.sqrt(6 / k), dir = 1, E = m * G * 6, Q = 0;
  const yOf = (xx) => k * xx * xx;
  const X = (xx) => 30 + ((xx + Lx) / (2 * Lx)) * 200, Y = (yy) => 230 - yy * 20; // 20 px na meter v obeh smereh
  const reset = () => {
    x = -Math.min(Lx, Math.sqrt(h0 / k));
    dir = 1;
    E = m * G * yOf(x);
    Q = 0;
  };
  const draw = () => {
    svg.replaceChildren();
    let d = "";
    for (let i = 0; i <= 80; i++) {
      const xx = -Lx + (2 * Lx * i) / 80;
      d += `${i ? "L" : "M"}${X(xx).toFixed(1)},${Y(Math.min(yOf(xx), 8.4)).toFixed(1)}`;
    }
    s("path", { d, class: "graph-line stroke-muted", "stroke-width": 5, fill: "none" }, svg);
    for (let hh = 0; hh <= 8; hh += 2) {
      s("line", { x1: 26, y1: Y(hh), x2: 234, y2: Y(hh), class: "grid" }, svg);
      label(svg, 22, Y(hh), `${hh} m`, "tick small", "end");
    }
    const y = yOf(x), Ep = m * G * y, Ek = Math.max(0, E - Ep);
    const slope = 2 * k * x;
    s("circle", { cx: X(x) - (slope / Math.hypot(1, slope)) * 10, cy: Y(y) - 12, r: 9, class: "ball" }, svg);
    s("line", { x1: X(x) - 14, y1: Y(y) - 3 + slope * 3, x2: X(x) + 14, y2: Y(y) - 3 - slope * 3, class: "ray-line" }, svg);
    // stolpci energije
    const Etot = m * G * h0, sc = 190 / (m * G * 8.4);
    const bars = [["E_p", Ep, "b"], ["E_k", Ek, "a"], ["Q", Q, "danger"], ["skupaj", Ep + Ek + Q, "c"]];
    bars.forEach(([nm, v, col], i) => {
      const bx = 248 + i * 23;
      s("rect", { x: bx, y: 230 - v * sc, width: 18, height: v * sc, class: `bar fill-${col}` }, svg);
      label(svg, bx + 9, 242, nm, "tick small");
    });
    s("line", { x1: 244, y1: 230, x2: 340, y2: 230, class: "axis" }, svg);
    s("line", { x1: 244, y1: 230 - Etot * sc, x2: 340, y2: 230 - Etot * sc, class: "guide" }, svg);
    label(svg, 292, 18, "energija [kJ]", "tick b");
    const v = Math.sqrt((2 * Ek) / m);
    out.innerHTML = `<p>Višina ${fmt(y, 2)} m, hitrost ${fmt(v, 2)} m/s.</p>` +
      texBlock(`E_p + E_k${mu ? " + Q" : ""} = ${T(Ep / 1000, 2)} + ${T(Ek / 1000, 2)}${mu ? ` + ${T(Q / 1000, 2)}` : ""} = ${T((Ep + Ek + Q) / 1000, 2)}\\ \\text{kJ}`) +
      `<p>${mu ? "Zaradi trenja se del mehanske energije pretvori v notranjo energijo (toploto Q): skejter se ne vrne več do začetne višine. <b>Skupna energija pa ostane enaka.</b>" : "Brez trenja se potencialna energija pretaka v kinetično in nazaj, <b>vsota ostane enaka</b>: skejter se vedno vrne na začetno višino."}</p>
       <p class="muted">Na dnu je hitrost največja: v = √(2gh) = ${fmt(Math.sqrt(2 * G * h0), 1)} m/s (brez trenja). E_p = mgh, E_k = mv²/2, m = ${m} kg.</p>`;
  };
  const anim = animate(el, (dt) => {
    for (let i = 0; i < 8; i++) {
      const h = dt / 8, y = yOf(x), Ep = m * G * y;
      let Ek = E - Ep;
      if (Ek <= 0) {
        dir = x > 0 ? -1 : 1;
        Ek = 1e-6;
      }
      const v = Math.sqrt((2 * Ek) / m), slope = 2 * k * x;
      const dx = (dir * v * h) / Math.hypot(1, slope);
      const ds = Math.abs(dx) * Math.hypot(1, slope);
      const loss = Math.min(Ek, mu * m * G * ds);
      E -= loss;
      Q += loss;
      x = clamp(x + dx, -Lx, Lx);
      if (yOf(x) * m * G > E) dir = -dir;
    }
    draw();
    if (E - m * G * yOf(x) < 1 && Math.abs(x) < 0.05 && mu) return false;
  }, { autoplay: false });
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "začetna višina", min: 1, max: 7.5, step: 0.5, value: h0, unit: "m", onInput: (v) => ((h0 = v), reset(), draw()) }),
      slider({ label: "trenje", min: 0, max: 0.1, step: 0.01, value: mu, onInput: (v) => ((mu = v), draw()), format: (v) => (v ? fmt(v, 2) : "brez") }),
      buttons(playButton(anim, { play: "Spusti", pause: "Ustavi" }), button("Na začetek", () => (anim.pause(), reset(), draw()))),
    ],
    out,
    tryText: "Kako visoko je skejter, ko sta kinetična in potencialna energija enaki?",
  });
  reset();
  draw();
}

// ------------------------------------------------------------ izkoristek
export function izkoristek(el) {
  const svg = svgBox(340, 250);
  const out = readout();
  let m = 400, hh = 12, P = 3000, eta = 60, prog = 1;
  const draw = () => {
    svg.replaceChildren();
    const W = m * G * hh, Pk = (P * eta) / 100, t = W / Pk, Ein = P * t;
    // dvigalo
    const top = 30, base = 220, Y = (y) => base - (y / 20) * (base - top);
    s("rect", { x: 40, y: top - 14, width: 70, height: 14, class: "box" }, svg);
    s("circle", { cx: 75, cy: top - 22, r: 12, class: "meter" }, svg);
    label(svg, 75, top - 22, "M", "meter-label");
    const y = prog * hh;
    s("line", { x1: 75, y1: top, x2: 75, y2: Y(y) - 30 * Math.cbrt(m / 400), class: "string" }, svg);
    const bs = 30 * Math.cbrt(m / 400); // večja masa → večje breme
    s("rect", { x: 75 - bs / 2, y: Y(y) - bs, width: bs, height: bs, rx: 3, class: "fill-a" }, svg);
    label(svg, 75 - bs / 2 - 4, Y(y) - bs / 2, `${m} kg`, "lbl small", "end");
    s("line", { x1: 20, y1: base, x2: 130, y2: base, class: "ground" }, svg);
    s("line", { x1: 20, y1: Y(hh), x2: 130, y2: Y(hh), class: "guide" }, svg);
    label(svg, 128, Y(hh) - 8, `${hh} m`, "tick", "end");
    // Sankeyjev diagram
    const sc = 120 / Ein, wIn = Ein * sc, wUse = W * sc, wLoss = wIn - wUse;
    const x0 = 160, yIn = 60;
    s("rect", { x: x0, y: yIn, width: 40, height: wIn, class: "fill-accent", opacity: 0.8 }, svg);
    s("path", { d: `M${x0 + 40},${yIn} H${x0 + 120} L${x0 + 140},${yIn + wUse / 2} L${x0 + 120},${yIn + wUse} H${x0 + 40} Z`, class: "fill-b", opacity: 0.85 }, svg);
    if (wLoss > 1) s("path", { d: `M${x0 + 40},${yIn + wUse} H${x0 + 70} Q${x0 + 70 + wLoss},${yIn + wUse} ${x0 + 70 + wLoss},${yIn + wUse + wLoss + 30} L${x0 + 70},${yIn + wUse + wLoss + 30} Q${x0 + 70},${yIn + wIn} ${x0 + 40},${yIn + wIn} Z`, class: "fill-danger", opacity: 0.75 }, svg);
    label(svg, x0 + 20, yIn - 12, `vložena ${fmt(Ein / 1000, 1)} kJ`, "lbl small");
    label(svg, x0 + 128, yIn - 12, `koristna ${fmt(W / 1000, 1)} kJ`, "lbl small");
    if (wLoss > 1) label(svg, x0 + 70 + wLoss / 2, yIn + wUse + wLoss + 44, `izgube ${fmt((Ein - W) / 1000, 1)} kJ`, "lbl small");
    out.innerHTML = texBlock(`\\eta = \\frac{A_{kor}}{E_{vlož}} = \\frac{${T(W / 1000, 1)}\\ \\text{kJ}}{${T(Ein / 1000, 1)}\\ \\text{kJ}} = ${eta}\\ \\%`) +
      `<p>Motor z močjo ${fmt(P / 1000, 1)} kW in izkoristkom ${eta} % daje koristno moč ${fmt(Pk / 1000, 2)} kW. Breme dvigne v času t = A / P_kor = <b>${fmt(t, 1)} s</b>.</p>
       <p class="muted">Izgube (rdeče) se večinoma spremenijo v toploto (trenje, segrevanje žic). Izkoristek je vedno manjši od 100 %.</p>`;
  };
  const anim = animate(el, (dt) => {
    const W = m * G * hh, t = W / ((P * eta) / 100);
    prog = Math.min(1, prog + dt / t);
    draw();
    if (prog >= 1) return false;
  }, { autoplay: false });
  const prevPlay = anim.play;
  anim.play = () => {
    if (prog >= 1) prog = 0;
    prevPlay();
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "masa bremena", min: 100, max: 1000, step: 50, value: m, unit: "kg", onInput: (v) => ((m = v), draw()) }),
      slider({ label: "višina", min: 2, max: 20, value: hh, unit: "m", onInput: (v) => ((hh = v), draw()) }),
      slider({ label: "moč motorja", min: 1000, max: 10000, step: 500, value: P, unit: "W", onInput: (v) => ((P = v), draw()) }),
      slider({ label: "izkoristek η", min: 20, max: 95, step: 5, value: eta, unit: "%", onInput: (v) => ((eta = v), draw()) }),
      buttons(playButton(anim, { play: "Dvigni", pause: "Ustavi" })),
    ],
    out,
    tryText: "Kolikšen izkoristek bi moral imeti motor, da bi isto breme dvignil v pol krajšem času?",
  });
  draw();
}

// ------------------------------------------------------------ navpični in poševni met
export function met(el, { mode = "posevni" } = {}) {
  const svg = svgBox(340, 250);
  const out = readout();
  const vert = mode === "navpicni";
  let v0 = vert ? 15 : 18, ang = vert ? 90 : 45, h0 = 0, t = 0, ghosts = [], show = "h";
  const svg2 = vert ? svgBox(340, 170) : null;
  const pos = (tt) => [v0 * Math.cos(rad(ang)) * tt, h0 + v0 * Math.sin(rad(ang)) * tt - (G * tt * tt) / 2];
  const tFlight = () => {
    const vy = v0 * Math.sin(rad(ang));
    return (vy + Math.sqrt(vy * vy + 2 * G * h0)) / G;
  };
  const draw = () => {
    svg.replaceChildren();
    const tf = tFlight();
    // stalne osi (za največjo hitrost in višino), da se sprememba vnosa vidi na sliki
    const span = 120, hmax = 70;
    const A = axes(svg, { W: 340, H: 250, x: vert ? [-5, 5] : [0, span], y: [0, vert ? hmax : span * (210 / 290)], xLabel: vert ? "" : "x [m]", yLabel: "y [m]", pad: 30, xStep: vert ? 5 : 20, yStep: vert ? 10 : 20 });
    if (h0 > 0) s("rect", { x: A.X(vert ? -1 : 0) - (vert ? 0 : 10), y: A.Y(h0), width: vert ? A.X(1) - A.X(-1) : 10, height: A.Y(0) - A.Y(h0), class: "wall" }, svg);
    ghosts.forEach((g) => s("path", { d: g.d, class: "graph-line stroke-muted thin-line", opacity: 0.4, fill: "none" }, svg));
    let d = "";
    for (let i = 0; i <= 120; i++) {
      const p = pos((tf * i) / 120);
      d += `${i ? "L" : "M"}${A.X(p[0]).toFixed(1)},${A.Y(Math.max(0, p[1])).toFixed(1)}`;
    }
    if (!vert) s("path", { d, class: "graph-line stroke-c thin-line", "stroke-dasharray": "5 4", fill: "none" }, svg);
    for (let k = 0; k * 0.25 <= t; k++) {
      const p = pos(k * 0.25);
      s("circle", { cx: A.X(p[0]) + (vert ? 12 : 0), cy: A.Y(Math.max(0, p[1])), r: 2.5, class: "pt fill-c" }, svg);
    }
    const p = pos(t), vx = v0 * Math.cos(rad(ang)), vy = v0 * Math.sin(rad(ang)) - G * t;
    s("circle", { cx: A.X(p[0]), cy: A.Y(Math.max(0, p[1])), r: 8, class: "ball" }, svg);
    const vs = 3;
    if (!vert) {
      arrow(svg, A.X(p[0]), A.Y(p[1]), A.X(p[0]) + vx * vs, A.Y(p[1]), "b", 2.5);
      arrow(svg, A.X(p[0]), A.Y(p[1]), A.X(p[0]), A.Y(p[1]) - vy * vs, "a", 2.5);
    } else arrow(svg, A.X(p[0]) - 16, A.Y(p[1]), A.X(p[0]) - 16, A.Y(p[1]) - vy * vs, "a", 2.5);
    arrow(svg, A.X(p[0]), A.Y(p[1]), A.X(p[0]) + vx * vs, A.Y(p[1]) - vy * vs, "c", 3);
    label(svg, 336, 14, `t = ${fmt(t, 2)} s`, "lbl small", "end");
    const tTop = Math.max(0, (v0 * Math.sin(rad(ang))) / G), H = h0 + (v0 * Math.sin(rad(ang))) ** 2 / (2 * G);
    if (vert) {
      svg2.replaceChildren();
      timeGraph(svg2, show === "h" ? { tMax: 7, y0: 0, y1: 70, yStep: 10, yLabel: "h [m]", f: (u) => (u <= tf ? Math.max(0, pos(u)[1]) : NaN), t, cls: "stroke-c" } : { tMax: 7, y0: -40, y1: 35, yStep: 10, yLabel: "v [m/s]", f: (u) => (u <= tf ? v0 - G * u : NaN), t, cls: "stroke-a" });
      out.innerHTML = texBlock(`h_{\\max} = ${h0 ? `h_0 + ` : ""}\\frac{v_0^2}{2g} = ${h0 ? `${h0} + ` : ""}\\frac{${v0}^2}{2\\cdot 9{,}81} = ${T(H, 2)}\\ \\text{m}`) +
        `<p>Hitrost se vsako sekundo zmanjša za 9,81 m/s. Na vrhu (po ${fmt(tTop, 2)} s) je hitrost 0, pospešek pa še vedno g navzdol. Žoga pade na tla po ${fmt(tf, 2)} s s hitrostjo ${fmt(Math.sqrt(v0 * v0 + 2 * G * h0), 1)} m/s.</p>
         <p class="muted">Trenutna hitrost: v = v₀ − g t = ${fmt(vy, 1)} m/s. Vijolične pike so lege vsake 0,25 s: na vrhu so bolj skupaj.</p>`;
    } else {
      const D = vx * tf;
      out.innerHTML = texBlock(`D = v_0\\cos\\alpha\\cdot t = ${T(vx, 2)}\\ \\tfrac{\\text{m}}{\\text{s}}\\cdot ${T(tf, 2)}\\ \\text{s} = ${T(D, 1)}\\ \\text{m}`) +
        `<p>Vodoravna komponenta hitrosti (turkizna) je <b>stalna</b> (${fmt(vx, 1)} m/s), navpična (oranžna) se enakomerno spreminja kot pri navpičnem metu. Največja višina ${fmt(H, 1)} m, čas leta ${fmt(tf, 2)} s.</p>
         <p class="muted">${h0 ? "Z višine leti telo dlje pri kotu, manjšem od 45°." : "Pri h₀ = 0 je domet največji pri 45°; kota α in 90° − α dasta enak domet."} Sivo: prejšnji meti.</p>`;
    }
  };
  const anim = animate(el, (dt) => {
    const tf = tFlight();
    t = Math.min(tf, t + dt);
    draw();
    if (t >= tf) {
      if (!vert) {
        let d = "";
        const svgA = svg.querySelector("path.stroke-c");
        if (svgA) d = svgA.getAttribute("d");
        ghosts.push({ d, D: v0 * Math.cos(rad(ang)) * tf });
        if (ghosts.length > 4) ghosts.shift();
      }
      return false;
    }
  }, { autoplay: false });
  const prevPlay = anim.play;
  anim.play = () => {
    if (t >= tFlight() - 1e-9) t = 0;
    prevPlay();
  };
  const restart = () => (anim.pause(), (t = 0), draw());
  const ctl = [];
  if (vert) ctl.push(segmented({ options: [["h", "h(t)"], ["v", "v(t)"]], value: show, onChange: (v) => ((show = v), draw()) }));
  ctl.push(slider({ label: "začetna hitrost", min: 2, max: 30, value: v0, unit: "m/s", onInput: (v) => ((v0 = v), restart()) }));
  if (!vert) ctl.push(slider({ label: "kot α", min: 5, max: 85, step: 5, value: ang, unit: "°", onInput: (v) => ((ang = v), restart()) }));
  ctl.push(slider({ label: "začetna višina", min: 0, max: 20, value: h0, unit: "m", onInput: (v) => ((h0 = v), (ghosts = []), restart()) }));
  ctl.push(buttons(playButton(anim, { play: "Vrzi", pause: "Ustavi" }), button("Na začetek", restart)));
  layout(el, { stage: vert ? [svg, svg2] : [svg], controls: ctl, out, tryText: vert ? "Podvoji začetno hitrost. Kolikokrat višje poleti žoga?" : "Vrzi pod kotoma 30° in 60°. Kaj opaziš pri dometu?" });
  draw();
}

// ------------------------------------------------------------ klanec
export function klanec(el, { mode = "newton" } = {}) {
  const svg = svgBox(340, 300);
  const out = readout();
  let ang = mode === "trenje" ? 15 : 30, m = 5, ms = mode === "trenje" ? 0.5 : 0, mk = mode === "trenje" ? 0.4 : 0, sPos = 0, v = 0, comp = true;
  const Lm = 6;
  const st = () => {
    const a = rad(ang), Fg = m * G, Fpar = Fg * Math.sin(a), Fn = Fg * Math.cos(a);
    const moving = v > 1e-6 || Fpar > ms * Fn + 1e-9;
    const Ft = moving ? mk * Fn : Fpar;
    return { Fg, Fpar, Fn, Ft, moving, acc: moving ? (Fpar - mk * Fn) / m : 0 };
  };
  const draw = () => {
    svg.replaceChildren();
    const a = rad(ang), q = st();
    const B = [310, 285], len = 280, A = [B[0] - len * Math.cos(a), B[1] - len * Math.sin(a)];
    s("polygon", { points: `${A[0]},${A[1]} ${B[0]},${B[1]} ${A[0]},${B[1]}`, class: "wall" }, svg);
    s("path", { d: `M${A[0] + 40},${B[1]} A40,40 0 0 0 ${A[0] + 40 * Math.cos(a)},${B[1] - 40 * Math.sin(a)}`, class: "graph-line stroke-c thin-line", fill: "none" }, svg);
    label(svg, A[0] + 52, B[1] - 12, `${ang}°`, "lbl small", "start");
    // klada
    const u = [Math.cos(a), Math.sin(a)], nrm = [Math.sin(a), -Math.cos(a)];
    const pos = 30 + (sPos / Lm) * (len - 100);
    const C = [A[0] + u[0] * pos, A[1] + u[1] * pos];
    const bh = 22 * Math.cbrt(m), bw = bh * 1.5; // večja masa → večja klada
    const corner = (p, q2) => [C[0] + u[0] * p + nrm[0] * q2, C[1] + u[1] * p + nrm[1] * q2];
    s("polygon", { points: [corner(0, 0), corner(bw, 0), corner(bw, bh), corner(0, bh)].map((p) => p.join(",")).join(" "), class: "fill-a" }, svg);
    const M = corner(bw / 2, bh / 2), fs = 1; // vse sile v istem merilu: 1 px na N
    force(svg, M[0], M[1], 0, q.Fg * fs, "text", "F_g");
    if (comp) {
      force(svg, M[0], M[1], u[0] * q.Fpar * fs, u[1] * q.Fpar * fs, "b", "F∥", { width: 2.5 });
      force(svg, M[0], M[1], -nrm[0] * q.Fn * fs, -nrm[1] * q.Fn * fs, "c", "F⊥", { width: 2.5 });
    }
    const Bm = corner(bw / 2, 0);
    force(svg, Bm[0], Bm[1], nrm[0] * q.Fn * fs, nrm[1] * q.Fn * fs, "muted", "F_N", { width: 2 });
    if (q.Ft > 0.05) force(svg, corner(0, 3)[0], corner(0, 3)[1], -u[0] * q.Ft * fs, -u[1] * q.Ft * fs, "danger", "F_tr", { width: 2.5 });
    const crit = ms ? (Math.atan(ms) * 180) / Math.PI : 0;
    out.innerHTML = texBlock(`F_\\parallel = m g \\sin\\alpha = ${T(q.Fpar, 1)}\\ \\text{N},\\quad F_\\perp = m g\\cos\\alpha = ${T(q.Fn, 1)}\\ \\text{N}`) +
      (q.moving
        ? texBlock(`a = g(\\sin\\alpha - k_{tr}\\cos\\alpha) = ${T(q.acc, 2)}\\ \\tfrac{\\text{m}}{\\text{s}^2}`) + `<p>Klada drsi navzdol. ${ms ? "Sila trenja je k_tr · F_N = " + fmt(q.Ft, 1) + " N." : "Brez trenja je pospešek g·sin α, neodvisen od mase."}</p>`
        : `<p>Klada <b>miruje</b>: sila lepenja (${fmt(q.Ft, 1)} N) uravnoveša dinamično komponento teže. Največja sila lepenja je k_l · F_N = ${fmt(ms * q.Fn, 1)} N.</p>`) +
      `<p class="muted">${ms ? `Klada začne drseti pri kotu, kjer je tan α = k_l: α = ${fmt(crit, 1)}° (k_l = ${fmt(ms, 2)}).` : "Teža se razstavi na komponento vzdolž klanca (F∥) in pravokotno nanj (F⊥). Podlaga deluje s silo F_N = F⊥."}</p>`;
  };
  const anim = animate(el, (dt) => {
    const q = st();
    if (!q.moving) return draw(), false;
    v = Math.max(0, v + q.acc * dt);
    sPos += v * dt;
    if (sPos >= Lm) {
      sPos = Lm;
      draw();
      return false;
    }
    draw();
  }, { autoplay: false });
  const restart = () => (anim.pause(), (sPos = 0), (v = 0), draw());
  const ctl = [
    slider({ label: "naklon α", min: 0, max: 60, value: ang, unit: "°", onInput: (val) => ((ang = val), restart()) }),
    slider({ label: "masa m", min: 1, max: 10, value: m, unit: "kg", onInput: (val) => ((m = val), restart()) }),
  ];
  if (mode === "trenje") ctl.push(slider({ label: "koef. lepenja", min: 0, max: 1, step: 0.05, value: ms, onInput: (val) => ((ms = val), (mk = val * 0.8), restart()) }));
  else ctl.push(toggle("trenje (k_l = 0,3, k_tr = 0,25)", false, (val) => ((ms = val ? 0.3 : 0), (mk = val ? 0.25 : 0), restart())));
  ctl.push(toggle("razstavi težo", comp, (val) => ((comp = val), draw())));
  ctl.push(buttons(playButton(anim, { play: "Spusti", pause: "Ustavi" }), button("Na vrh", restart)));
  layout(el, { stage: [svg], controls: ctl, out, tryText: mode === "trenje" ? "Počasi večaj naklon. Pri katerem kotu klada zdrsne? Ali je to odvisno od mase?" : "Ali težja klada brez trenja drsi hitreje?" });
  draw();
}

// ------------------------------------------------------------ trki
export function trki(el) {
  const svg = svgBox(340, 110), svg2 = svgBox(340, 200);
  const out = readout();
  let m1 = 2, m2 = 1, v1 = 3, v2 = -1, kind = "prozni", x1, x2, u1, u2, hit, t;
  const W1 = () => 26 + m1 * 6, W2 = () => 26 + m2 * 6;
  const reset = () => {
    x1 = 40;
    x2 = 220;
    u1 = v1;
    u2 = v2;
    hit = false;
    t = 0;
  };
  const after = () => {
    if (kind === "neprozni") {
      const v = (m1 * v1 + m2 * v2) / (m1 + m2);
      return [v, v];
    }
    return [((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2), ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2)];
  };
  const draw = () => {
    svg.replaceChildren();
    s("line", { x1: 0, y1: 100, x2: 340, y2: 100, class: "ground" }, svg);
    const cart = (x, w, col, nm, v) => {
      s("rect", { x, y: 64, width: w, height: 30, rx: 4, class: `fill-${col}` }, svg);
      s("circle", { cx: x + 8, cy: 96, r: 4, class: "fill-text" }, svg);
      s("circle", { cx: x + w - 8, cy: 96, r: 4, class: "fill-text" }, svg);
      label(svg, x + w / 2, 79, nm, "lbl inv");
      if (Math.abs(v) > 0.05) arrow(svg, x + w / 2, 52, x + w / 2 + v * 12, 52, col, 2.5);
    };
    cart(x1, W1(), "a", `${m1} kg`, u1);
    cart(x2, W2(), "b", `${m2} kg`, u2);
    // gibalne količine pred in po (stalno merilo: 3,2 px na kg·m/s)
    svg2.replaceChildren();
    const [a1, a2] = after();
    const before = [m1 * v1, m2 * v2], aft = [m1 * a1, m2 * a2];
    const sc = 3.2, y0 = 104;
    const group = (x, vals, title) => {
      label(svg2, x + 60, 12, title, "tick b");
      s("line", { x1: x, y1: y0, x2: x + 120, y2: y0, class: "axis thin" }, svg2);
      [["p₁", vals[0], "a"], ["p₂", vals[1], "b"], ["skupaj", vals[0] + vals[1], "c"]].forEach(([nm, v, col], i) => {
        const bx = x + 8 + i * 38, hh = v * sc;
        s("rect", { x: bx, y: hh >= 0 ? y0 - hh : y0, width: 28, height: Math.abs(hh), class: `bar fill-${col}` }, svg2);
        label(svg2, bx + 14, 196, nm, "tick small");
        label(svg2, bx + 14, hh >= 0 ? y0 - hh - 7 : y0 - hh + 9, fmt(v, 1), "tick small");
      });
    };
    group(20, before, "gibalna količina pred trkom");
    group(190, hit ? aft : [0, 0], "po trku");
    if (!hit) label(svg2, 250, 70, "(še ni trka)", "tick");
    const Ek0 = (m1 * v1 * v1 + m2 * v2 * v2) / 2, Ek1 = (m1 * a1 * a1 + m2 * a2 * a2) / 2;
    out.innerHTML = texBlock(`m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2' \\Rightarrow ${T(before[0] + before[1], 1)} = ${T(aft[0] + aft[1], 1)}\\ \\tfrac{\\text{kg m}}{\\text{s}}`) +
      `<p>Po trku: v₁' = ${fmt(a1, 2)} m/s, v₂' = ${fmt(a2, 2)} m/s. <b>Skupna gibalna količina se ohrani</b> pri vsakem trku.</p>
       <p>Kinetična energija: pred ${fmt(Ek0, 1)} J, po ${fmt(Ek1, 1)} J. ${kind === "prozni" ? "Pri prožnem trku se ohrani tudi kinetična energija." : `Pri neprožnem trku (vozička se sprimeta) se ${fmt(Ek0 - Ek1, 1)} J pretvori v notranjo energijo.`}</p>`;
  };
  const anim = animate(el, (dt) => {
    t += dt;
    x1 += u1 * dt * 12;
    x2 += u2 * dt * 12;
    if (!hit && x1 + W1() >= x2) {
      hit = true;
      [u1, u2] = after();
      x1 = x2 - W1();
    }
    draw();
    if (x1 < -80 || x2 > 420 || x1 > 420 || x2 < -80 || t > 30) return false;
  }, { autoplay: false });
  const restart = () => (anim.pause(), reset(), draw());
  const prevPlay = anim.play;
  anim.play = () => {
    if (t > 0) reset();
    prevPlay();
  };
  layout(el, {
    stage: [svg, svg2],
    controls: [
      segmented({ options: [["prozni", "prožni trk"], ["neprozni", "neprožni trk"]], value: kind, onChange: (v) => ((kind = v), restart()) }),
      slider({ label: "m₁", min: 1, max: 5, value: m1, unit: "kg", onInput: (v) => ((m1 = v), restart()) }),
      slider({ label: "v₁", min: 0, max: 5, step: 0.5, value: v1, unit: "m/s", onInput: (v) => ((v1 = v), restart()) }),
      slider({ label: "m₂", min: 1, max: 5, value: m2, unit: "kg", onInput: (v) => ((m2 = v), restart()) }),
      slider({ label: "v₂", min: -5, max: 0, step: 0.5, value: v2, unit: "m/s", onInput: (v) => ((v2 = v), restart()) }),
      buttons(playButton(anim, { play: "Zaženi", pause: "Ustavi" }), button("Na začetek", restart)),
    ],
    out,
    tryText: "Pri prožnem trku nastavi enaki masi in v₂ = 0. Kaj se zgodi s prvim vozičkom?",
  });
  reset();
  draw();
}

// ------------------------------------------------------------ enakomerno kroženje
export function krozenje(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  let r = 1.5, Tp = 2, m = 0.5, phi = 0, fly = null;
  const draw = () => {
    svg.replaceChildren();
    const cx = 170, cy = 150, k = 70, R = r * k;
    s("circle", { cx, cy, r: R, class: "guide", fill: "none" }, svg);
    s("circle", { cx, cy, r: 4, class: "fill-text" }, svg);
    const w = (2 * Math.PI) / Tp, v = w * r, ar = v * v / r;
    let P;
    if (fly) P = [fly.x, fly.y];
    else P = [cx + R * Math.cos(phi), cy - R * Math.sin(phi)];
    if (!fly) s("line", { x1: cx, y1: cy, x2: P[0], y2: P[1], class: "string" }, svg);
    s("circle", { cx: P[0], cy: P[1], r: 10 * Math.cbrt(m / 0.5), class: "ball" }, svg);
    const vs = 5; // 5 px na m/s
    const tx = fly ? fly.vx : -Math.sin(phi), ty = fly ? fly.vy : -Math.cos(phi);
    arrow(svg, P[0], P[1], P[0] + tx * v * vs, P[1] + ty * v * vs, "b", 3);
    label(svg, P[0] + tx * (v * vs + 12), P[1] + ty * (v * vs + 12), "v", "lbl small");
    if (!fly) {
      // 1 px na m/s²; predolgo puščico skrajšamo do središča in jo narišemo črtkano
      const full = ar, al = Math.min(R - 6, full), cut = full > al;
      arrow(svg, P[0], P[1], P[0] - Math.cos(phi) * al, P[1] + Math.sin(phi) * al, "c", 3, cut ? { "stroke-dasharray": "6 4" } : {});
      label(svg, P[0] - Math.cos(phi) * (al + 12), P[1] + Math.sin(phi) * (al + 12), cut ? "a_r (skrajšana)" : "a_r", "lbl small");
    }
    out.innerHTML = texBlock(`v = \\frac{2\\pi r}{t_0} = \\frac{2\\pi\\cdot ${T(r, 1)}}{${T(Tp, 1)}} = ${T(v, 2)}\\ \\tfrac{\\text{m}}{\\text{s}},\\quad a_r = \\frac{v^2}{r} = ${T(ar, 2)}\\ \\tfrac{\\text{m}}{\\text{s}^2}`) +
      texBlock(`F_r = m a_r = ${T(m, 1)}\\cdot ${T(ar, 2)} = ${T(m * ar, 2)}\\ \\text{N},\\quad \\omega = \\frac{2\\pi}{t_0} = ${T(w, 2)}\\ \\text{s}^{-1}`) +
      `<p>Hitrost je vedno <b>tangentna</b> na krožnico, radialni pospešek kaže <b>v središče</b>. Velikost hitrosti je stalna, smer pa se ves čas spreminja.</p>
       <p class="muted">${fly ? "Vrvica je prerezana: brez centripetalne sile telo nadaljuje premo v smeri tangente (1. Newtonov zakon)." : "Centripetalno silo daje napeta vrvica. Prereži jo in poglej, kam odleti kamen."}</p>`;
  };
  const anim = animate(el, (dt) => {
    if (fly) {
      fly.x += fly.vx * fly.v * dt * 70;
      fly.y += fly.vy * fly.v * dt * 70;
      draw();
      if (fly.x < -20 || fly.x > 360 || fly.y < -20 || fly.y > 320) return false;
      return;
    }
    phi += ((2 * Math.PI) / Tp) * dt;
    draw();
  }, { autoplay: false });
  const cutBtn = button("Prereži vrvico", () => {
    if (fly) {
      fly = null;
      cutBtn.textContent = "Prereži vrvico";
      draw();
      return;
    }
    const R = r * 70, v = ((2 * Math.PI) / Tp) * r;
    fly = { x: 170 + R * Math.cos(phi), y: 150 - R * Math.sin(phi), vx: -Math.sin(phi), vy: -Math.cos(phi), v };
    cutBtn.textContent = "Nova vrvica";
    anim.play();
  });
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "polmer r", min: 0.5, max: 1.9, step: 0.1, value: r, unit: "m", onInput: (v) => ((r = v), draw()) }),
      slider({ label: "obhodni čas t₀", min: 0.5, max: 5, step: 0.5, value: Tp, unit: "s", onInput: (v) => ((Tp = v), draw()) }),
      slider({ label: "masa m", min: 0.1, max: 2, step: 0.1, value: m, unit: "kg", onInput: (v) => ((m = v), draw()) }),
      buttons(playButton(anim, { play: "Vrti", pause: "Ustavi" }), cutBtn),
    ],
    out,
    tryText: "Kolikokrat se poveča potrebna sila, če kamen vrtiš dvakrat hitreje (pol krajši t₀)?",
  });
  draw();
}

// ------------------------------------------------------------ gravitacija in orbite
export function orbita(el) {
  const svg = svgBox(340, 320);
  const out = readout();
  let kv = 1, areas = false, st, trail, t, sectors;
  const r0 = 1, sc = 75, cx = 210, cy = 160;
  const reset = () => {
    st = { x: r0, y: 0, vx: 0, vy: kv };
    trail = [];
    t = 0;
    sectors = [];
  };
  const acc = (x, y) => {
    const r3 = Math.pow(x * x + y * y, 1.5);
    return [-x / r3, -y / r3];
  };
  const draw = () => {
    svg.replaceChildren();
    if (areas) sectors.forEach((sec, i) => s("path", { d: `M${cx},${cy} ` + sec.map((p, j) => `${j ? "L" : "L"}${(cx + p[0] * sc).toFixed(1)},${(cy - p[1] * sc).toFixed(1)}`).join(" ") + " Z", class: `fill-${i % 2 ? "b" : "a"}`, opacity: 0.35 }, svg));
    if (trail.length > 1) s("path", { d: trail.map((p, i) => `${i ? "L" : "M"}${(cx + p[0] * sc).toFixed(1)},${(cy - p[1] * sc).toFixed(1)}`).join(""), class: "graph-line stroke-c thin-line", fill: "none" }, svg);
    s("circle", { cx, cy, r: 14, class: "fill-a" }, svg);
    s("circle", { cx: cx + st.x * sc, cy: cy - st.y * sc, r: 7, class: "fill-b" }, svg);
    const r = Math.hypot(st.x, st.y), v = Math.hypot(st.vx, st.vy);
    arrow(svg, cx + st.x * sc, cy - st.y * sc, cx + (st.x + st.vx * 0.5) * sc, cy - (st.y + st.vy * 0.5) * sc, "b", 2.5);
    const [ax, ay] = acc(st.x, st.y);
    arrow(svg, cx + st.x * sc, cy - st.y * sc, cx + (st.x + ax * 0.25) * sc, cy - (st.y + ay * 0.25) * sc, "c", 2.5);
    const E = (kv * kv) / 2 - 1;
    const type = kv >= Math.SQRT2 - 1e-9 ? "Planet <b>uide</b> (ubežna hitrost: √2-kratnik krožne). Tir ni več zaprt." : Math.abs(kv - 1) < 1e-9 ? "Tir je <b>krožnica</b>: gravitacija daje ravno pravo centripetalno silo." : `Tir je <b>elipsa</b>; zvezda je v enem gorišču. Začetna točka je ${kv < 1 ? "najbolj oddaljena (afelij)" : "najbližja (perihelij)"}.`;
    const a = E < 0 ? -1 / (2 * E) : Infinity;
    out.innerHTML = texBlock(`F = G\\frac{m M}{r^2} \\ \\Rightarrow\\ \\frac{F}{F_0} = \\frac{r_0^2}{r^2} = ${T(1 / (r * r), 2)}`) +
      `<p>${type} Trenutno: razdalja ${fmt(r, 2)} r₀, hitrost ${fmt(v, 2)} v_k.</p>
       <p class="muted">${Number.isFinite(a) ? `Velika polos a = ${fmt(a, 2)} r₀, obhodni čas t₀ = ${fmt(Math.pow(a, 1.5), 2)}-kratnik krožnega (3. Keplerjev zakon: t₀² ∝ a³). ` : ""}${areas ? "Obarvane ploskve so opisane v enakih časih: so enako velike (2. Keplerjev zakon), zato je planet blizu zvezde hitrejši." : ""}</p>`;
  };
  const anim = animate(el, (dt) => {
    const steps = 40, h = (dt * 1.6) / steps;
    for (let i = 0; i < steps; i++) {
      const [ax, ay] = acc(st.x, st.y);
      st.vx += (ax * h) / 2;
      st.vy += (ay * h) / 2;
      st.x += st.vx * h;
      st.y += st.vy * h;
      const [bx, by] = acc(st.x, st.y);
      st.vx += (bx * h) / 2;
      st.vy += (by * h) / 2;
      t += h;
      const k = Math.floor(t / 0.4);
      if (!sectors[k]) sectors[k] = [];
      if (sectors.length <= 24) sectors[k].push([st.x, st.y]);
    }
    trail.push([st.x, st.y]);
    if (trail.length > 1500) trail.shift();
    draw();
    if (Math.hypot(st.x, st.y) > 6) return false;
  }, { autoplay: false });
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "začetna hitrost", min: 0.5, max: 1.5, step: 0.05, value: kv, onInput: (v) => ((kv = v), anim.pause(), reset(), draw()), format: (v) => `${fmt(v, 2)} · v_krožna` }),
      toggle("pokaži ploskve v enakih časih", areas, (v) => ((areas = v), draw())),
      buttons(playButton(anim, { play: "Zaženi", pause: "Ustavi" }), button("Na začetek", () => (anim.pause(), reset(), draw()))),
    ],
    out,
    tryText: "Poišči hitrost, pri kateri planet ravno še ostane v orbiti. Koliko je to v primerjavi s krožno hitrostjo?",
  });
  reset();
  draw();
}
