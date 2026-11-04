// Simulacije: kotne funkcije (pravokotni trikotnik, enotska krožnica, grafi, adicijski izreki, enačbe),
// vektorji, krožnica in stožnice, obodni in središčni kot.
import { h, s, svgBox, slider, select, segmented, toggle, readout, layout, tex, texBlock, fmt, tfmt, clamp, label, axes, fnPath, arrow, animate, playButton, buttons, draggable, handle, deg, rad, gcd } from "./kit.js";

const PI = Math.PI;
const T = (x, d = 2) => tfmt(x, d);
const sinD = (a) => Math.sin(rad(a)), cosD = (a) => Math.cos(rad(a));
const norm360 = (a) => ((a % 360) + 360) % 360;

// Kot v stopinjah kot večkratnik π (če je večkratnik 15°), sicer decimalno.
function radTex(d) {
  const k = Math.round(d / 15);
  if (Math.abs(d - k * 15) > 1e-9) return T(rad(d), 3);
  if (k === 0) return "0";
  const g = gcd(Math.abs(k), 12), n = Math.abs(k) / g, m = 12 / g, sg = k < 0 ? "-" : "";
  return m === 1 ? `${sg}${n === 1 ? "" : n}\\pi` : `${sg}\\frac{${n === 1 ? "" : n}\\pi}{${m}}`;
}
const radTxt = (d) => {
  const k = Math.round(d / 15);
  if (Math.abs(d - k * 15) > 1e-9) return fmt(rad(d), 3);
  if (k === 0) return "0";
  const g = gcd(Math.abs(k), 12), n = Math.abs(k) / g, m = 12 / g;
  return `${k < 0 ? "−" : ""}${n === 1 ? "" : n}π${m === 1 ? "" : "/" + m}`;
};
// Lok od kota a0 do a1 (stopinje, v pozitivni smeri), središče (cx, cy), y navzdol.
function arcD(cx, cy, r, a0, a1, sector = false) {
  const span = norm360(a1 - a0) || (a1 !== a0 ? 360 : 0);
  if (span >= 359.999) return `M${cx + r},${cy} A${r},${r} 0 1 0 ${cx - r},${cy} A${r},${r} 0 1 0 ${cx + r},${cy}`;
  const x0 = cx + r * cosD(a0), y0 = cy - r * sinD(a0), x1 = cx + r * cosD(a0 + span), y1 = cy - r * sinD(a0 + span);
  const arc = `A${r},${r} 0 ${span > 180 ? 1 : 0} 0 ${x1.toFixed(2)},${y1.toFixed(2)}`;
  return sector ? `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} ${arc} Z` : `M${x0.toFixed(2)},${y0.toFixed(2)} ${arc}`;
}
// Ročica, ki drsi po krožnici; onAngle(kot v stopinjah).
function circleHandle(svg, cx, cy, R, ang, cls, onAngle, snap = 0) {
  const hnd = handle(svg, cls);
  hnd.move(cx + R * cosD(ang), cy - R * sinD(ang));
  draggable(svg, hnd, (x, y) => {
    let a = norm360(deg(Math.atan2(cy - y, x - cx)));
    if (snap) {
      const r = Math.round(a / snap) * snap;
      if (Math.abs(r - a) < 4) a = norm360(r);
    }
    onAngle(a);
  });
  return hnd;
}
const dot = (svg, x, y, cls = "a", r = 5) => s("circle", { cx: x, cy: y, r, class: `pt fill-${cls}` }, svg);

// ------------------------------------------------------------ kotne funkcije v pravokotnem trikotniku
export function trigTrikotnik(el) {
  const svg = svgBox(340, 270);
  const out = readout();
  let alpha = 35, c = 6, fn = "sin";
  const k = 34;
  const ROLE = { sin: ["a", "c"], cos: ["b", "c"], tan: ["a", "b"], cot: ["b", "a"] };
  const draw = () => {
    svg.replaceChildren();
    const a = c * sinD(alpha), b = c * cosD(alpha);
    const x0 = 170 - (b * k) / 2;
    const A = [x0, 245], C = [x0 + b * k, 245], B = [x0 + b * k, 245 - a * k];
    const on = ROLE[fn];
    const col = (side) => (on[0] === side ? "a" : on[1] === side ? "b" : null);
    s("polygon", { points: [A, C, B].map((p) => p.join(",")).join(" "), class: "shape fill-soft" }, svg);
    const side = (P, Q, nm) => s("line", { x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], class: col(nm) ? `graph-line stroke-${col(nm)}` : "edge" }, svg);
    side(B, C, "a");
    side(A, C, "b");
    side(A, B, "c");
    s("path", { d: `M${C[0] - 14},${C[1]} V${C[1] - 14} H${C[0]}`, class: "right-angle" }, svg);
    s("path", { d: arcD(A[0], A[1], 34, 0, alpha, true), class: "angle-fill fill-c" }, svg);
    label(svg, A[0] + 46 * cosD(alpha / 2), A[1] - 46 * sinD(alpha / 2), "α", "lbl");
    if (90 - alpha > 8) {
      s("path", { d: arcD(B[0], B[1], 22, 180 + alpha, 270, true), class: "angle-fill fill-muted" }, svg);
      label(svg, B[0] - 12, B[1] + 34, "β", "lbl small");
    }
    [["A", A, -10, 12], ["C", C, 10, 12], ["B", B, 10, -8]].forEach(([n, P, dx, dy]) => label(svg, P[0] + dx, P[1] + dy, n, "pt-lbl"));
    const sideLbl = (x, y, txt, nm, anchor = "middle") => label(svg, x, y, txt, `lbl small${col(nm) ? "" : ""}`, anchor);
    sideLbl(C[0] + 8, (B[1] + C[1]) / 2, `a = ${fmt(a)}`, "a", "start");
    sideLbl((A[0] + C[0]) / 2, A[1] + 16, `b = ${fmt(b)}`, "b");
    sideLbl((A[0] + B[0]) / 2 - 18 * sinD(alpha), (A[1] + B[1]) / 2 - 18 * cosD(alpha), `c = ${fmt(c)}`, "c");
    label(svg, 330, 16, "a: nasprotna kateta kota α", "tick", "end");
    label(svg, 330, 32, "b: priležna kateta, c: hipotenuza", "tick", "end");
    const v = { sin: a / c, cos: b / c, tan: a / b, cot: b / a };
    const nm = { sin: "\\sin", cos: "\\cos", tan: "\\tan", cot: "\\cot" }[fn];
    const words = { sin: "nasprotna kateta / hipotenuza", cos: "priležna kateta / hipotenuza", tan: "nasprotna kateta / priležna kateta", cot: "priležna kateta / nasprotna kateta" }[fn];
    out.innerHTML = texBlock(`${nm}\\alpha = \\frac{${on[0]}}{${on[1]}} = \\frac{${T({ a, b, c }[on[0]])}}{${T({ a, b, c }[on[1]])}} \\approx ${T(v[fn], 4)}`) +
      `<p>${words[0].toUpperCase() + words.slice(1)}. Pri α = ${alpha}°: sin α ≈ ${fmt(v.sin, 3)}, cos α ≈ ${fmt(v.cos, 3)}, tan α ≈ ${fmt(v.tan, 3)}, cot α ≈ ${fmt(v.cot, 3)}.</p>
       <p>Spremeni velikost trikotnika (c): stranice se spremenijo, <b>razmerja ostanejo enaka</b>. Kotne funkcije so odvisne samo od kota.</p>
       <p class="muted">β = 90° − α = ${90 - alpha}°, zato sin α = cos β in tan α = cot β. Velja tudi sin²α + cos²α = 1.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      segmented({ options: [["sin", "sinus"], ["cos", "kosinus"], ["tan", "tangens"], ["cot", "kotangens"]], value: fn, onChange: (v) => ((fn = v), draw()) }),
      slider({ label: "kot α", min: 5, max: 85, value: alpha, unit: "°", onInput: (v) => ((alpha = v), draw()) }),
      slider({ label: "hipotenuza c", min: 2, max: 7, step: 0.5, value: c, onInput: (v) => ((c = v), draw()) }),
    ],
    out,
    tryText: "Pri katerem kotu sta sinus in kosinus enaka? Koliko je takrat tangens?",
  });
  draw();
}

// ------------------------------------------------------------ enotska krožnica
// Kvadrant kota (0 = na osi). Kot najprej prevedemo na [0°, 360°) in toleriramo napako zaokroževanja (360° je na osi).
const QUAD = (a) => {
  a = norm360(a);
  const r = a % 90;
  return r < 1e-9 || 90 - r < 1e-9 ? 0 : Math.floor(a / 90) + 1;
};
const refAngle = (a) => ((a = norm360(a)), a <= 90 ? a : a <= 180 ? 180 - a : a <= 270 ? a - 180 : 360 - a);
const clean = (x) => (Math.abs(x) < 1e-10 ? 0 : x);

export function enotska(el, { mode = "krog" } = {}) {
  if (mode === "graf") return enotskaGraf(el);
  if (mode === "adicija") return adicija(el);
  if (mode === "enacba") return trigEnacba(el);
  const svg = svgBox(340, 340);
  const out = readout();
  let phi = 135, showTan = false;
  const cx = 170, cy = 170, R = 120;
  const ctl = slider({ label: "kot φ", min: 0, max: 360, value: phi, unit: "°", onInput: (v) => ((phi = v), draw()) });
  const draw = () => {
    svg.replaceChildren();
    s("line", { x1: 10, y1: cy, x2: 330, y2: cy, class: "axis" }, svg);
    s("line", { x1: cx, y1: 330, x2: cx, y2: 10, class: "axis" }, svg);
    s("circle", { cx, cy, r: R, class: "guide solid", fill: "none" }, svg);
    [["I", 1, -1], ["II", -1, -1], ["III", -1, 1], ["IV", 1, 1]].forEach(([q, sx, sy]) => label(svg, cx + sx * 150, cy + sy * 150, q, "tick b"));
    label(svg, cx + R + 6, cy + 13, "1", "tick", "start");
    label(svg, cx - 8, cy - R - 6, "1", "tick", "end");
    const c = cosD(phi), sn = sinD(phi);
    const P = [cx + R * c, cy - R * sn];
    s("path", { d: arcD(cx, cy, 30, 0, phi, true), class: "angle-fill fill-c" }, svg);
    label(svg, cx + 44 * cosD(phi / 2), cy - 44 * sinD(phi / 2), "φ", "lbl");
    if (showTan && Math.abs(c) > 0.02) {
      const t = sn / c, ty = clamp(cy - R * t, -400, 740);
      s("line", { x1: cx + R, y1: 0, x2: cx + R, y2: 340, class: "guide" }, svg);
      s("line", { x1: cx, y1: cy, x2: cx + R, y2: ty, class: "guide stroke-c" }, svg);
      s("line", { x1: cx + R, y1: cy, x2: cx + R, y2: ty, class: "graph-line stroke-c" }, svg);
      if (ty > 10 && ty < 330) label(svg, cx + R + 6, ty, `tan φ`, "lbl small", "start");
    }
    s("line", { x1: cx, y1: cy, x2: P[0], y2: P[1], class: "ray-line" }, svg);
    s("line", { x1: cx, y1: cy, x2: P[0], y2: cy, class: "graph-line stroke-a" }, svg);
    s("line", { x1: P[0], y1: cy, x2: P[0], y2: P[1], class: "graph-line stroke-b" }, svg);
    s("line", { x1: cx, y1: P[1], x2: P[0], y2: P[1], class: "guide" }, svg);
    if (Math.abs(c) > 0.15) label(svg, (cx + P[0]) / 2, cy + (sn > 0 ? 16 : -12), "cos φ", "lbl small");
    if (Math.abs(sn) > 0.15) label(svg, P[0] + (c >= 0 ? 8 : -8), (cy + P[1]) / 2, "sin φ", "lbl small", c >= 0 ? "start" : "end");
    circleHandle(svg, cx, cy, R, phi, "accent", (a) => ((phi = Math.round(a)), ctl.set(phi, true), draw()), 15);
    label(svg, P[0] + (c >= 0 ? 14 : -14), P[1] + (sn >= 0 ? -14 : 16), `T(${fmt(c)}, ${fmt(sn)})`, "lbl small", c >= 0 ? "start" : "end");
    const q = QUAD(phi), ref = refAngle(phi);
    const sgnW = (v) => (Math.abs(v) < 1e-10 ? "0" : v > 0 ? "+" : "−");
    const tanTxt = Math.abs(c) < 1e-10 ? "ne obstaja" : fmt(clean(sn / c), 3);
    out.innerHTML = texBlock(`\\varphi = ${phi}^\\circ = ${radTex(phi)}\\ \\text{rad}`) +
      `<p><span class="dot dot-a"></span> cos φ = <b>${fmt(clean(c), 3)}</b> (abscisa točke T), <span class="dot dot-b"></span> sin φ = <b>${fmt(clean(sn), 3)}</b> (ordinata točke T), tan φ = sin φ / cos φ = <b>${tanTxt}</b>.</p>
       <p>${q ? `Kot je v ${q}. kvadrantu: sin ${sgnW(sn)}, cos ${sgnW(c)}, tan ${Math.abs(c) < 1e-10 ? "–" : sgnW(sn / c)}. Pripadajoči ostri kot je ${ref}°, zato sta |sin φ| = sin ${ref}° in |cos φ| = cos ${ref}°.` : "Kot leži na koordinatni osi."}</p>
       <p class="muted">Točka T je vedno na krožnici s polmerom 1, zato velja sin²φ + cos²φ = 1. Kot 360° je cel obrat: vrednosti se ponavljajo s periodo 2π.</p>`;
  };
  layout(el, { stage: [svg], controls: [ctl, toggle("pokaži tangens", showTan, (v) => ((showTan = v), draw()))], out, tryText: "Povleci T na 30°, 150°, 210° in 330°. Kaj imajo skupnega sinusi teh kotov?" });
  draw();
}

function enotskaGraf(el) {
  const svg = svgBox(340, 200);
  const out = readout();
  let phi = 0, fn = "sin";
  const ccx = 58, cy = 100, R = 46, gx0 = 122, gx1 = 332, sx = (gx1 - gx0) / (2 * PI);
  const F = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
  const ctl = slider({ label: "kot φ", min: 0, max: 360, value: 0, unit: "°", onInput: (v) => ((phi = v), draw()) });
  const draw = () => {
    svg.replaceChildren();
    s("line", { x1: ccx - R - 8, y1: cy, x2: ccx + R + 8, y2: cy, class: "axis thin" }, svg);
    s("line", { x1: ccx, y1: cy - R - 8, x2: ccx, y2: cy + R + 8, class: "axis thin" }, svg);
    s("circle", { cx: ccx, cy, r: R, class: "guide solid", fill: "none" }, svg);
    s("line", { x1: gx0, y1: cy, x2: gx1 + 4, y2: cy, class: "axis" }, svg);
    s("line", { x1: gx0, y1: 8, x2: gx0, y2: 192, class: "axis" }, svg);
    for (let k = 1; k <= 4; k++) {
      const x = gx0 + (k * PI * sx) / 2;
      s("line", { x1: x, y1: cy - 3, x2: x, y2: cy + 3, class: "axis" }, svg);
      label(svg, x, cy + 13, ["π/2", "π", "3π/2", "2π"][k - 1], "tick");
    }
    label(svg, gx0 - 4, cy - R, "1", "tick", "end");
    label(svg, gx0 - 4, cy + R, "−1", "tick", "end");
    const A = { X: (x) => gx0 + x * sx, Y: (y) => cy - y * R, x0: 0, x1: 2 * PI, y0: -2.1, y1: 2.1 };
    if (fn === "tan") [PI / 2, (3 * PI) / 2].forEach((x) => s("line", { x1: A.X(x), y1: 8, x2: A.X(x), y2: 192, class: "guide stroke-danger" }, svg));
    s("path", { d: fnPath(F[fn], A, { n: 300 }), class: "graph-line stroke-muted thin-line", opacity: 0.45 }, svg);
    const t = rad(phi);
    if (t > 0) s("path", { d: fnPath(F[fn], A, { to: t, n: Math.max(8, Math.round(300 * (t / (2 * PI)))) }), class: "graph-line" }, svg);
    const c = Math.cos(t), sn = Math.sin(t), P = [ccx + R * c, cy - R * sn];
    s("path", { d: arcD(ccx, cy, 14, 0, phi, true), class: "angle-fill fill-c" }, svg);
    s("line", { x1: ccx, y1: cy, x2: P[0], y2: P[1], class: "ray-line", "stroke-width": 2 }, svg);
    const val = fn === "tan" ? (Math.abs(c) < 1e-9 ? NaN : sn / c) : fn === "sin" ? sn : c;
    if (fn === "sin") s("line", { x1: P[0], y1: cy, x2: P[0], y2: P[1], class: "graph-line stroke-b" }, svg);
    if (fn === "cos") s("line", { x1: ccx, y1: cy, x2: P[0], y2: cy, class: "graph-line stroke-a" }, svg);
    if (Number.isFinite(val) && Math.abs(val) < 2.1) {
      const G = [A.X(t), A.Y(val)];
      s("line", { x1: fn === "sin" ? P[0] : gx0, y1: G[1], x2: G[0], y2: G[1], class: "guide" }, svg);
      s("line", { x1: G[0], y1: cy, x2: G[0], y2: G[1], class: `graph-line stroke-${fn === "sin" ? "b" : fn === "cos" ? "a" : "c"}` }, svg);
      dot(svg, G[0], G[1], "accent", 4.5);
    }
    dot(svg, P[0], P[1], "accent", 4.5);
    const info = {
      sin: ["sinus", "[−1, 1]", "2π", "kπ", "Graf sinusa dobimo tako, da ordinato točke na krožnici nanašamo nad kot."],
      cos: ["kosinus", "[−1, 1]", "2π", "π/2 + kπ", "Kosinus je abscisa točke na krožnici. Graf je graf sinusa, premaknjen za π/2 v levo."],
      tan: ["tangens", "ℝ (vsa realna števila)", "π", "kπ", "Tangens ne obstaja pri π/2 + kπ (navpične asimptote, rdeče)."],
    }[fn];
    out.innerHTML = `<p>φ = ${Math.round(phi)}° = ${radTxt(Math.round(phi))} rad, ${info[0]} φ = <b>${Number.isFinite(val) ? fmt(clean(val), 3) : "ne obstaja"}</b>.</p>
      <p>Zaloga vrednosti: ${info[1]}. Osnovna perioda: ${info[2]}. Ničle: x = ${info[3]}, k ∈ ℤ.</p>
      <p class="muted">${info[4]}</p>`;
  };
  const anim = animate(el, (dt) => {
    phi += dt * 60;
    if (phi >= 360) phi = 360;
    ctl.set(Math.round(phi), true);
    draw();
    if (phi >= 360) return false;
  }, { autoplay: false });
  layout(el, {
    stage: [svg],
    controls: [
      segmented({ options: [["sin", "sinus"], ["cos", "kosinus"], ["tan", "tangens"]], value: fn, onChange: (v) => ((fn = v), draw()) }),
      ctl,
      buttons(playButton(anim, { play: "Nariši graf", pause: "Ustavi" }), h("button", { type: "button", class: "secondary small", onclick: () => (anim.pause(), (phi = 0), ctl.set(0, true), draw()) }, "Na začetek")),
    ],
    out,
    tryText: "Kje ima sinus največjo vrednost? Kje je kosinus enak 0?",
  });
  const prevPlay = anim.play;
  anim.play = () => {
    if (phi >= 360) phi = 0;
    prevPlay();
  };
  draw();
}

function adicija(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  let a = 40, b = 30, op = "+";
  const cx = 150, cy = 165, R = 120;
  const draw = () => {
    svg.replaceChildren();
    s("line", { x1: 10, y1: cy, x2: 330, y2: cy, class: "axis" }, svg);
    s("line", { x1: cx, y1: 295, x2: cx, y2: 10, class: "axis" }, svg);
    s("circle", { cx, cy, r: R, class: "guide solid", fill: "none" }, svg);
    const g = op === "+" ? a + b : a - b;
    s("path", { d: arcD(cx, cy, 34, 0, a, true), class: "angle-fill fill-a" }, svg);
    if (op === "+") s("path", { d: arcD(cx, cy, 50, a, a + b, true), class: "angle-fill fill-b" }, svg);
    else s("path", { d: arcD(cx, cy, 50, a - b, a, true), class: "angle-fill fill-b" }, svg);
    const ray = (ang, col, nm) => {
      const P = [cx + R * cosD(ang), cy - R * sinD(ang)];
      s("line", { x1: cx, y1: cy, x2: P[0], y2: P[1], class: `graph-line stroke-${col}` }, svg);
      dot(svg, P[0], P[1], col);
      label(svg, cx + (R + 18) * cosD(ang), cy - (R + 18) * sinD(ang), nm, "lbl small");
      return P;
    };
    ray(a, "a", "α");
    const P = ray(g, "c", op === "+" ? "α+β" : "α−β");
    s("line", { x1: P[0], y1: cy, x2: P[0], y2: P[1], class: "guide stroke-c" }, svg);
    s("line", { x1: cx, y1: P[1], x2: P[0], y2: P[1], class: "guide stroke-c" }, svg);
    label(svg, cx + 64 * cosD(op === "+" ? a + b / 2 : a - b / 2), cy - 64 * sinD(op === "+" ? a + b / 2 : a - b / 2), "β", "lbl small");
    const sa = sinD(a), ca = cosD(a), sb = sinD(b), cb = cosD(b);
    const sg = sinD(g), cg = cosD(g);
    const pm = op === "+" ? "+" : "-", mp = op === "+" ? "-" : "+";
    // negativen faktor v oklepaju: 0,866 · (−0,5)
    const F3 = (x) => (Number(x.toFixed(3)) < 0 ? `(${T(x, 3)})` : T(x, 3));
    out.innerHTML = texBlock(`\\sin(\\alpha ${pm} \\beta) = \\sin\\alpha\\cos\\beta ${pm} \\cos\\alpha\\sin\\beta = ${F3(sa)}\\cdot ${F3(cb)} ${pm} ${F3(ca)}\\cdot ${F3(sb)} = ${T(sg, 3)}`) +
      texBlock(`\\cos(\\alpha ${pm} \\beta) = \\cos\\alpha\\cos\\beta ${mp} \\sin\\alpha\\sin\\beta = ${F3(ca)}\\cdot ${F3(cb)} ${mp} ${F3(sa)}\\cdot ${F3(sb)} = ${T(cg, 3)}`) +
      `<p>Preverba na krožnici: kot α ${op === "+" ? "+" : "−"} β = ${g}°, njegova točka ima koordinati (${fmt(cg, 3)}, ${fmt(sg, 3)}). <b>Pozor:</b> sin(α ${op === "+" ? "+" : "−"} β) ni sin α ${op === "+" ? "+" : "−"} sin β = ${fmt(op === "+" ? sa + sb : sa - sb, 3)}.</p>
       <p class="muted">${a === b && op === "+" ? `Ker je β = α, dobimo formuli za dvojni kot: sin 2α = 2 sin α cos α = ${fmt(2 * sa * ca, 3)}, cos 2α = cos²α − sin²α = ${fmt(ca * ca - sa * sa, 3)}.` : "Nastavi β = α, pa dobiš formuli za dvojni kot."}</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      segmented({ options: [["+", "α + β"], ["-", "α − β"]], value: op, onChange: (v) => ((op = v), draw()) }),
      slider({ label: "α", min: 0, max: 180, step: 5, value: a, unit: "°", onInput: (v) => ((a = v), draw()) }),
      slider({ label: "β", min: 0, max: 180, step: 5, value: b, unit: "°", onInput: (v) => ((b = v), draw()) }),
    ],
    out,
    tryText: "Izračunaj sin 75° kot sin(45° + 30°). Preveri z drsnikoma.",
  });
  draw();
}

function trigEnacba(el) {
  const svg = svgBox(340, 220);
  const out = readout();
  let fn = "sin", k = 0.5;
  const ccx = 62, cy = 110, R = 50, gx0 = 128, gx1 = 332, sx = (gx1 - gx0) / (2 * PI);
  const ks = slider({ label: "desna stran a", min: -1.5, max: 1.5, step: 0.05, value: k, onInput: (v) => ((k = v), draw()) });
  const draw = () => {
    svg.replaceChildren();
    s("circle", { cx: ccx, cy, r: R, class: "guide solid", fill: "none" }, svg);
    s("line", { x1: ccx - R - 8, y1: cy, x2: ccx + R + 8, y2: cy, class: "axis thin" }, svg);
    s("line", { x1: ccx, y1: cy - R - 10, x2: ccx, y2: cy + R + 10, class: "axis thin" }, svg);
    s("line", { x1: gx0, y1: cy, x2: gx1 + 4, y2: cy, class: "axis" }, svg);
    s("line", { x1: gx0, y1: 10, x2: gx0, y2: 210, class: "axis" }, svg);
    for (let j = 1; j <= 4; j++) label(svg, gx0 + (j * PI * sx) / 2, cy + 13, ["π/2", "π", "3π/2", "2π"][j - 1], "tick");
    const A = { X: (x) => gx0 + x * sx, Y: (y) => cy - y * R, x0: 0, x1: 2 * PI, y0: -2, y1: 2 };
    const f = { sin: Math.sin, cos: Math.cos, tan: Math.tan }[fn];
    s("path", { d: fnPath(f, A, { n: 300 }), class: "graph-line" }, svg);
    const yk = cy - k * R;
    s("line", { x1: gx0, y1: yk, x2: gx1, y2: yk, class: "graph-line stroke-a thin-line" }, svg);
    label(svg, gx1, yk - 8, `y = ${fmt(k)}`, "lbl small", "end");
    // rešitve v [0, 2π)
    let sol = [];
    if (fn === "sin" && Math.abs(k) <= 1) {
      const x0 = Math.asin(k);
      sol = [x0, PI - x0];
    } else if (fn === "cos" && Math.abs(k) <= 1) {
      const x0 = Math.acos(k);
      sol = [x0, 2 * PI - x0];
    } else if (fn === "tan") {
      const x0 = Math.atan(k);
      sol = [x0, x0 + PI];
    }
    sol = [...new Set(sol.map((x) => Number((((x % (2 * PI)) + 2 * PI) % (2 * PI)).toFixed(9))))].sort((p, q) => p - q);
    // na krožnici
    if (fn === "sin" && Math.abs(k) <= 1) s("line", { x1: ccx - R - 6, y1: yk, x2: ccx + R + 6, y2: yk, class: "graph-line stroke-a thin-line" }, svg);
    if (fn === "cos" && Math.abs(k) <= 1) s("line", { x1: ccx + k * R, y1: cy - R - 6, x2: ccx + k * R, y2: cy + R + 6, class: "graph-line stroke-a thin-line" }, svg);
    if (fn === "tan") s("line", { x1: ccx - R * 1.2 * Math.cos(Math.atan(k)), y1: cy + R * 1.2 * Math.sin(Math.atan(k)), x2: ccx + R * 1.2 * Math.cos(Math.atan(k)), y2: cy - R * 1.2 * Math.sin(Math.atan(k)), class: "graph-line stroke-a thin-line" }, svg);
    sol.forEach((x, i) => {
      const P = [ccx + R * Math.cos(x), cy - R * Math.sin(x)];
      s("line", { x1: ccx, y1: cy, x2: P[0], y2: P[1], class: `graph-line stroke-${i ? "c" : "b"} thin-line` }, svg);
      dot(svg, P[0], P[1], i ? "c" : "b", 4.5);
      const G = [A.X(x), A.Y(f(x))];
      s("line", { x1: G[0], y1: cy, x2: G[0], y2: G[1], class: `guide stroke-${i ? "c" : "b"}` }, svg);
      dot(svg, G[0], G[1], i ? "c" : "b", 4.5);
    });
    const nm = { sin: "\\sin", cos: "\\cos", tan: "\\tan" }[fn];
    const fmtX = (x) => `${fmt(deg(x), 1)}° (${fmt(x, 3)} rad)`;
    let html = texBlock(`${nm} x = ${T(k)}`);
    if (!sol.length) html += `<p><b>Enačba nima rešitev</b>, ker je ${fn === "sin" ? "sinus" : "kosinus"} vedno med −1 in 1: premica y = ${fmt(k)} ne seka grafa.</p>`;
    else {
      html += `<p>Rešitve na [0, 2π): ${sol.map((x, i) => `<span class="dot dot-${i ? "c" : "b"}"></span> x${i ? "₂" : "₁"} = ${fmtX(x)}`).join(", ")}.</p>`;
      // pri sin x = ±1 in cos x = ±1 se obe veji splošne rešitve ujemata: ena točka na krožnici
      const one = sol.length === 1;
      const gen = {
        sin: one ? `x = \\arcsin(${T(k)}) + 2k\\pi` : `x = \\arcsin(${T(k)}) + 2k\\pi \\ \\text{ ali } \\ x = \\pi - \\arcsin(${T(k)}) + 2k\\pi`,
        cos: one ? `x = \\arccos(${T(k)}) + 2k\\pi` : `x = \\pm\\arccos(${T(k)}) + 2k\\pi`,
        tan: `x = \\arctan(${T(k)}) + k\\pi`,
      }[fn];
      html += `<p>Splošna rešitev (k ∈ ℤ):</p>${texBlock(gen)}<p class="muted">${fn === "tan" ? "Tangens ima periodo π, zato rešitve ponavljamo na π." : one ? `Na krožnici je samo ena točka z ${fn === "sin" ? "ordinato" : "absciso"} ${fmt(k)}: premica se krožnice le dotakne.` : "Na krožnici sta dve točki z enako " + (fn === "sin" ? "ordinato (zrcalno čez os y)." : "absciso (zrcalno čez os x).")} Neskončno rešitev dobimo, ker so kotne funkcije periodične.</p>`;
    }
    out.innerHTML = html;
  };
  layout(el, {
    stage: [svg],
    controls: [
      segmented({ options: [["sin", "sin x = a"], ["cos", "cos x = a"], ["tan", "tan x = a"]], value: fn, onChange: (v) => ((fn = v), (k = clamp(k, -1.5, 1.5)), draw()) }),
      ks,
    ],
    out,
    tryText: "Pri katerih vrednostih a ima enačba sin x = a na [0, 2π) samo eno rešitev?",
  });
  draw();
}

// ------------------------------------------------------------ vektorji
export function vektorji(el, { mode = "vsota" } = {}) {
  const svg = svgBox(340, 340);
  const out = readout();
  let a = [3, 1], b = [1, 3], op = "+", kk = 2;
  // prednastavljena para (za predvajalnik videa, ki ne more vleči); vlečenje izbiro preklopi na »lastna«
  const PARI = { 1: [[3, 1], [1, 3]], 2: [[3, 1], [-1, 3]], 3: [[3, 1], [-3, 1]], 4: [[2, 0], [4, 0]] };
  const par = select({
    label: "vektorja",
    options: [["1", "a (3, 1), b (1, 3): oster kot"], ["2", "a (3, 1), b (−1, 3): pravi kot"], ["3", "a (3, 1), b (−3, 1): top kot"], ["4", "a (2, 0), b (4, 0): vzporedna"], ["0", "lastna (povleci konca)"]],
    value: "1",
    onChange: (v) => PARI[v] && ((a = [...PARI[v][0]]), (b = [...PARI[v][1]]), draw()),
  });
  const ctl = [par];
  const draw = () => {
    svg.replaceChildren();
    const A = axes(svg, { W: 340, H: 340, x: [-6, 6], y: [-6, 6], xStep: 1, yStep: 1 });
    const O = [A.X(0), A.Y(0)];
    const P = (v) => [A.X(v[0]), A.Y(v[1])];
    const vec = (from, v, col, w = 3, extra = {}) => arrow(svg, A.X(from[0]), A.Y(from[1]), A.X(from[0] + v[0]), A.Y(from[1] + v[1]), col, w, extra);
    const len = (v) => Math.hypot(v[0], v[1]);
    let html = "";
    if (mode === "vsota") {
      let r;
      if (op === "+") {
        r = [a[0] + b[0], a[1] + b[1]];
        s("polygon", { points: [O, P(a), P(r), P(b)].map((q) => q.join(",")).join(" "), class: "shape fill-soft", "stroke-opacity": 0 }, svg);
        vec(a, b, "b", 2, { "stroke-dasharray": "6 5" });
        vec(b, a, "a", 2, { "stroke-dasharray": "6 5" });
        vec([0, 0], r, "c", 3.5);
        html = texBlock(`\\vec a + \\vec b = (${a[0]}, ${a[1]}) + (${b[0]}, ${b[1]}) = (${r[0]}, ${r[1]})`) + `<p>Pravilo trikotnika: vektor b prenesemo v konec vektorja a. Pravilo paralelograma da isti rezultat (diagonala). Seštevamo po komponentah.</p>`;
      } else if (op === "-") {
        r = [a[0] - b[0], a[1] - b[1]];
        vec(a, [-b[0], -b[1]], "b", 2, { "stroke-dasharray": "6 5" });
        vec(b, r, "c", 2, { "stroke-dasharray": "6 5" });
        vec([0, 0], r, "c", 3.5);
        html = texBlock(`\\vec a - \\vec b = \\vec a + (-\\vec b) = (${a[0] - b[0]}, ${a[1] - b[1]})`) + `<p>Razlika je vektor od konca b do konca a (črtkano). Odštejemo tako, da prištejemo nasprotni vektor −b.</p>`;
      } else {
        r = [kk * a[0], kk * a[1]];
        vec([0, 0], r, "c", 3.5);
        html = texBlock(`${T(kk, 1)}\\cdot\\vec a = ${T(kk, 1)}\\cdot(${a[0]}, ${a[1]}) = (${T(r[0], 1)}, ${T(r[1], 1)})`) + `<p>${kk < 0 ? "Negativen k obrne smer." : kk === 0 ? "Pri k = 0 dobimo ničelni vektor." : "Pozitiven k ohrani smer."} Dolžina se pomnoži z |k|: |k·a| = ${fmt(Math.abs(kk))} · ${fmt(len(a))} = ${fmt(len(r))}.</p>`;
      }
      html += `<p class="muted">|a| = √(${a[0]}² + ${a[1]}²) ≈ ${fmt(len(a))}, |b| ≈ ${fmt(len(b))}, |rezultat| ≈ ${fmt(len(r))}.</p>`;
    } else {
      const d = a[0] * b[0] + a[1] * b[1], la = len(a), lb = len(b);
      const cosf = la && lb ? d / (la * lb) : NaN, phi = deg(Math.acos(clamp(cosf, -1, 1)));
      if (la > 0) {
        const t = d / (la * la), pr = [t * a[0], t * a[1]];
        s("line", { x1: A.X(-6 * a[0] / la * 2), y1: A.Y(-6 * a[1] / la * 2), x2: A.X(6 * a[0] / la * 2), y2: A.Y(6 * a[1] / la * 2), class: "guide" }, svg);
        s("line", { x1: A.X(b[0]), y1: A.Y(b[1]), x2: A.X(pr[0]), y2: A.Y(pr[1]), class: "guide stroke-b" }, svg);
        s("line", { x1: O[0], y1: O[1], x2: A.X(pr[0]), y2: A.Y(pr[1]), class: "graph-line stroke-c", "stroke-width": 6, opacity: 0.5 }, svg);
      }
      if (la && lb) {
        const a0 = deg(Math.atan2(a[1], a[0])), b0 = deg(Math.atan2(b[1], b[0]));
        const from = norm360(b0 - a0) <= 180 ? a0 : b0;
        s("path", { d: arcD(O[0], O[1], 26, from, from + phi, true), class: `angle-fill ${Math.abs(d) < 1e-9 ? "fill-ok" : "fill-c"}` }, svg);
      }
      html = texBlock(`\\vec a\\cdot\\vec b = a_x b_x + a_y b_y = ${a[0]}\\cdot ${b[0] < 0 ? `(${b[0]})` : b[0]} + ${a[1]}\\cdot ${b[1] < 0 ? `(${b[1]})` : b[1]} = ${d}`) +
        (la && lb ? texBlock(`\\cos\\varphi = \\frac{\\vec a\\cdot\\vec b}{|\\vec a|\\,|\\vec b|} = \\frac{${d}}{${T(la)}\\cdot ${T(lb)}} = ${T(cosf, 3)} \\Rightarrow \\varphi \\approx ${T(phi, 1)}^\\circ`) : "") +
        `<p>${d === 0 ? "<b>Skalarni produkt je 0: vektorja sta pravokotna.</b>" : la && lb && Math.abs(Math.abs(cosf) - 1) < 1e-9 ? (d > 0 ? "Kot med vektorjema je 0°: vektorja sta vzporedna in enako usmerjena, skalarni produkt je enak produktu dolžin." : "Kot med vektorjema je 180°: vektorja sta vzporedna in nasprotno usmerjena.") : d > 0 ? "Skalarni produkt je pozitiven: kot med vektorjema je oster." : "Skalarni produkt je negativen: kot med vektorjema je top."}</p>
         <p class="muted">Vijolična daljica je pravokotna projekcija b na a, dolga |b|·cos φ ≈ ${fmt(la ? d / la : 0)}. Skalarni produkt = |a| · (dolžina projekcije).</p>`;
    }
    vec([0, 0], a, "a", 3.5);
    vec([0, 0], b, "b", 3.5);
    [["a", a, "a"], ["b", b, "b"]].forEach(([nm, v, col]) => {
      const hnd = handle(svg, col);
      label(hnd, 12, -12, nm, "pt-lbl");
      hnd.move(...P(v));
      draggable(svg, hnd, (x, y) => {
        const [u, w] = A.inv(x, y);
        const nu = clamp(Math.round(u), -6, 6), nw = clamp(Math.round(w), -6, 6);
        if (nu !== v[0] || nw !== v[1]) {
          v[0] = nu;
          v[1] = nw;
          par.sel.value = "0";
          draw();
        }
      });
    });
    out.innerHTML = html;
  };
  if (mode === "vsota") {
    const ks = slider({ label: "k", min: -2, max: 3, step: 0.5, value: kk, onInput: (v) => ((kk = v), draw()) });
    ks.style.display = "none";
    ctl.push(segmented({ options: [["+", "a + b"], ["-", "a − b"], ["k", "k · a"]], value: op, onChange: (v) => ((op = v), (ks.style.display = v === "k" ? "" : "none"), draw()) }), ks);
  }
  layout(el, {
    stage: [svg],
    controls: ctl,
    out,
    tryText: mode === "vsota" ? "Kdaj je |a + b| = |a| + |b|? Kdaj je a + b ničelni vektor?" : "Postavi a = (3, 1). Poišči vektor b, ki je pravokoten na a.",
  });
  draw();
}

// ------------------------------------------------------------ krožnica in stožnice
export function stozernice(el, { mode = "kroznica" } = {}) {
  if (mode !== "kroznica") return stoznice(el);
  const svg = svgBox(340, 340);
  const out = readout();
  let S = [1, 1], r = 3, t = 40, tang = false;
  const draw = () => {
    svg.replaceChildren();
    const A = axes(svg, { W: 340, H: 340, x: [-7, 7], y: [-7, 7], xStep: 1, yStep: 1 });
    const k = A.X(1) - A.X(0);
    s("circle", { cx: A.X(S[0]), cy: A.Y(S[1]), r: r * k, class: "graph-line", fill: "none" }, svg);
    const Tp = [S[0] + r * cosD(t), S[1] + r * sinD(t)];
    s("line", { x1: A.X(S[0]), y1: A.Y(S[1]), x2: A.X(Tp[0]), y2: A.Y(Tp[1]), class: "graph-line stroke-a thin-line" }, svg);
    label(svg, (A.X(S[0]) + A.X(Tp[0])) / 2 - 10 * sinD(t), (A.Y(S[1]) + A.Y(Tp[1])) / 2 - 10 * cosD(t), "r", "lbl small");
    if (tang) {
      const d = [-sinD(t), cosD(t)];
      s("line", { x1: A.X(Tp[0] - 9 * d[0]), y1: A.Y(Tp[1] - 9 * d[1]), x2: A.X(Tp[0] + 9 * d[0]), y2: A.Y(Tp[1] + 9 * d[1]), class: "graph-line stroke-c thin-line" }, svg);
    }
    const hS = handle(svg, "b");
    label(hS, 12, -12, "S", "pt-lbl");
    hS.move(A.X(S[0]), A.Y(S[1]));
    draggable(svg, hS, (x, y) => {
      const [u, v] = A.inv(x, y), nu = clamp(Math.round(u), -5, 5), nv = clamp(Math.round(v), -5, 5);
      if (nu !== S[0] || nv !== S[1]) (S = [nu, nv]), draw();
    });
    const hT = handle(svg, "a");
    label(hT, 12, -12, "T", "pt-lbl");
    hT.move(A.X(Tp[0]), A.Y(Tp[1]));
    draggable(svg, hT, (x, y) => {
      const [u, v] = A.inv(x, y);
      t = norm360(deg(Math.atan2(v - S[1], u - S[0])));
      draw();
    });
    const [p, q] = S, D = -2 * p, E = -2 * q, F = p * p + q * q - r * r;
    const sh = (nm, v) => (v === 0 ? `${nm}^2` : `(${nm} ${v > 0 ? "-" : "+"} ${Math.abs(v)})^2`);
    const tm = (v, nm) => (v === 0 ? "" : ` ${v > 0 ? "+" : "-"} ${Math.abs(v) === 1 && nm ? "" : T(Math.abs(v))}${nm}`);
    out.innerHTML = texBlock(`${sh("x", p)} + ${sh("y", q)} = ${T(r * r)}`) +
      `<p>Središče S(${p}, ${q}), polmer r = ${fmt(r)}. Krožnica je množica točk, ki so od S oddaljene za r.</p>` +
      texBlock(`x^2 + y^2${tm(D, "x")}${tm(E, "y")}${tm(F, "")} = 0`) +
      `<p>Točka T(${fmt(Tp[0])}, ${fmt(Tp[1])}): (x − p)² + (y − q)² = ${fmt((Tp[0] - p) ** 2 + (Tp[1] - q) ** 2)} = r². ${tang ? `Tangenta v T je pravokotna na polmer ST.` : ""}</p>
       <p class="muted">Iz splošne oblike dobimo središče S(−D/2, −E/2) in r² = p² + q² − F.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "polmer r", min: 1, max: 6, step: 0.5, value: r, onInput: (v) => ((r = v), draw()) }),
      toggle("tangenta v točki T", tang, (v) => ((tang = v), draw())),
    ],
    out,
    tryText: "Povleci S v izhodišče. Kakšna je takrat enačba krožnice?",
  });
  draw();
}

function stoznice(el) {
  const svg = svgBox(340, 340);
  const out = readout();
  let kind = "elipsa", a = 5, b = 3, p = 2, t = 50;
  const ctl = h("div", { class: "demo-controls" });
  const draw = () => {
    svg.replaceChildren();
    const A = axes(svg, { W: 340, H: 340, x: [-8, 8], y: [-8, 8], xStep: 1, yStep: 1 });
    const pt = (q) => [A.X(q[0]), A.Y(q[1])];
    let F1, F2, Tq, html;
    if (kind === "elipsa") {
      const e = Math.sqrt(Math.abs(a * a - b * b));
      [F1, F2] = a >= b ? [[-e, 0], [e, 0]] : [[0, -e], [0, e]];
      s("ellipse", { cx: A.X(0), cy: A.Y(0), rx: A.X(a) - A.X(0), ry: A.Y(0) - A.Y(b), class: "graph-line", fill: "none" }, svg);
      Tq = [a * cosD(t), b * sinD(t)];
      const r1 = Math.hypot(Tq[0] - F1[0], Tq[1] - F1[1]), r2 = Math.hypot(Tq[0] - F2[0], Tq[1] - F2[1]);
      html = texBlock(`\\frac{x^2}{${T(a * a)}} + \\frac{y^2}{${T(b * b)}} = 1`) +
        `<p>Elipsa je množica točk, ki imajo <b>vsoto razdalj</b> do gorišč F₁ in F₂ enako ${a >= b ? "2a" : "2b"}: r₁ + r₂ = ${fmt(r1)} + ${fmt(r2)} = <b>${fmt(r1 + r2)}</b>.</p>
         <p class="muted">Linearna ekscentričnost e = √(${a >= b ? "a² − b²" : "b² − a²"}) = ${fmt(e)}, numerična ε = e/${a >= b ? "a" : "b"} = ${fmt(e / Math.max(a, b))}. Pri a = b dobimo krožnico (ε = 0).</p>`;
    } else if (kind === "hiperbola") {
      const e = Math.sqrt(a * a + b * b);
      [F1, F2] = [[-e, 0], [e, 0]];
      [1, -1].forEach((sg) => s("line", { x1: A.X(-8), y1: A.Y(-8 * sg * b / a), x2: A.X(8), y2: A.Y(8 * sg * b / a), class: "guide" }, svg));
      [1, -1].forEach((sg) => s("path", { d: fnPath((y) => y, { ...A, X: (u) => A.X(sg * a * Math.cosh(u)), Y: (u) => A.Y(b * Math.sinh(u)) }, { from: -3, to: 3, n: 160 }), class: "graph-line", fill: "none" }, svg));
      const u = rad(t - 180) / 2.2;
      Tq = [a * Math.cosh(u), b * Math.sinh(u)];
      const r1 = Math.hypot(Tq[0] - F1[0], Tq[1] - F1[1]), r2 = Math.hypot(Tq[0] - F2[0], Tq[1] - F2[1]);
      html = texBlock(`\\frac{x^2}{${T(a * a)}} - \\frac{y^2}{${T(b * b)}} = 1`) +
        `<p>Hiperbola je množica točk, ki imajo <b>absolutno razliko razdalj</b> do gorišč enako 2a: |r₁ − r₂| = |${fmt(r1)} − ${fmt(r2)}| = <b>${fmt(Math.abs(r1 - r2))}</b> = 2 · ${fmt(a)}.</p>
         <p class="muted">e = √(a² + b²) = ${fmt(e)}. Asimptoti (črtkano): y = ±${fmt(b / a)} x. Veji se jima vse bolj približujeta.</p>`;
    } else {
      F1 = [p / 2, 0];
      F2 = null;
      s("line", { x1: A.X(-p / 2), y1: A.T, x2: A.X(-p / 2), y2: A.B, class: "graph-line stroke-c thin-line" }, svg);
      label(svg, A.X(-p / 2) - 4, A.T + 12, "vodnica", "lbl small", "end");
      s("path", { d: fnPath((y) => y, { ...A, X: (y) => A.X((y * y) / (2 * p)), Y: (y) => A.Y(y) }, { from: -8, to: 8, n: 200 }), class: "graph-line", fill: "none" }, svg);
      const y = clamp((t - 180) / 22, -7.5, 7.5);
      Tq = [(y * y) / (2 * p), y];
      const r1 = Math.hypot(Tq[0] - F1[0], Tq[1]);
      s("line", { x1: A.X(Tq[0]), y1: A.Y(Tq[1]), x2: A.X(-p / 2), y2: A.Y(Tq[1]), class: "graph-line stroke-c thin-line" }, svg);
      html = texBlock(`y^2 = 2px = ${T(2 * p)}x`) +
        `<p>Parabola je množica točk, ki so <b>enako oddaljene od gorišča F in od vodnice</b> x = −p/2: razdalja do F = ${fmt(r1)}, razdalja do vodnice = ${fmt(Tq[0] + p / 2)}.</p>
         <p class="muted">Gorišče F(p/2, 0) = (${fmt(p / 2)}, 0). Večji p pomeni širšo parabolo. Žarki, vzporedni z osjo, se po odboju zberejo v gorišču (satelitska antena).</p>`;
    }
    [F1, F2].filter(Boolean).forEach((F, i) => {
      s("line", { x1: A.X(F[0]), y1: A.Y(F[1]), x2: A.X(Tq[0]), y2: A.Y(Tq[1]), class: `graph-line stroke-${i ? "b" : "a"} thin-line` }, svg);
      dot(svg, ...pt(F), i ? "b" : "a", 5);
      label(svg, A.X(F[0]), A.Y(F[1]) + 16, F2 ? `F${i ? "₂" : "₁"}` : "F", "pt-lbl");
    });
    const hT = handle(svg, "c");
    label(hT, 12, -12, "T", "pt-lbl");
    hT.move(...pt(Tq));
    draggable(svg, hT, (x, y) => {
      const [u, v] = A.inv(x, y);
      if (kind === "elipsa") t = norm360(deg(Math.atan2(v / b, u / a)));
      else if (kind === "hiperbola") t = clamp(180 + deg(Math.asinh(v / b) * 2.2), 0, 360);
      else t = clamp(180 + v * 22, 0, 360);
      draw();
    });
    out.innerHTML = html + `<p class="muted">Povleci točko T po krivulji.</p>`;
  };
  const build = () => {
    const sl = [];
    if (kind !== "parabola") {
      sl.push(slider({ label: "a", min: 1, max: 7, step: 0.5, value: a, onInput: (v) => ((a = v), draw()) }));
      sl.push(slider({ label: "b", min: 1, max: 7, step: 0.5, value: b, onInput: (v) => ((b = v), draw()) }));
    } else sl.push(slider({ label: "p", min: 0.5, max: 5, step: 0.5, value: p, onInput: (v) => ((p = v), draw()) }));
    ctl.replaceChildren(segmented({ options: [["elipsa", "elipsa"], ["hiperbola", "hiperbola"], ["parabola", "parabola"]], value: kind, onChange: (v) => ((kind = v), (t = v === "elipsa" ? 50 : 200), build()) }), ...sl);
    draw();
  };
  layout(el, { stage: [svg], controls: ctl, out, tryText: "Nastavi elipso z a = b. Kam se premakneta gorišči in katero krivuljo dobiš?" });
  build();
}

// ------------------------------------------------------------ obodni in središčni kot
export function obodni(el, { mode = "obodni" } = {}) {
  const svg = svgBox(340, 320);
  const out = readout();
  const cx = 170, cy = 160, R = 125;
  let A = 200, B = 340, C = 95, D = 140, second = false;
  if (mode === "tales") (A = 180), (B = 0), (C = 60);
  if (mode === "tetivni") (A = 210), (B = 320), (C = 40), (D = 140);
  const P = (a) => [cx + R * cosD(a), cy - R * sinD(a)];
  // kot pri V med točkama X in Y
  const angleAt = (V, X, Y) => {
    const u = [X[0] - V[0], X[1] - V[1]], w = [Y[0] - V[0], Y[1] - V[1]];
    return deg(Math.acos(clamp((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w)), -1, 1)));
  };
  const onArc = (x, from, span) => norm360(x - from) <= span;
  const draw = () => {
    svg.replaceChildren();
    s("circle", { cx, cy, r: R, class: "guide solid", fill: "none" }, svg);
    let html;
    if (mode === "tetivni") {
      const pts = [A, B, C, D].map(P);
      const sorted = [A, B, C, D].map((a, i) => [norm360(a), i]).sort((p, q) => p[0] - q[0]).map((q) => q[1]);
      const poly = sorted.map((i) => pts[i]);
      s("polygon", { points: poly.map((q) => q.join(",")).join(" "), class: "shape fill-soft" }, svg);
      const ang = poly.map((V, i) => angleAt(V, poly[(i + 3) % 4], poly[(i + 1) % 4]));
      const names = sorted.map((i) => "ABCD"[i]);
      poly.forEach((V, i) => {
        const X = poly[(i + 3) % 4], Y = poly[(i + 1) % 4];
        const a1 = deg(Math.atan2(V[1] - X[1], X[0] - V[0])), a2 = deg(Math.atan2(V[1] - Y[1], Y[0] - V[0]));
        const from = norm360(a2 - a1) <= 180 ? a1 : a2;
        s("path", { d: arcD(V[0], V[1], 22, from, from + ang[i], true), class: `angle-fill fill-${i % 2 ? "b" : "a"}` }, svg);
      });
      [A, B, C, D].forEach((a, i) => {
        const set = [(v) => (A = v), (v) => (B = v), (v) => (C = v), (v) => (D = v)][i];
        circleHandle(svg, cx, cy, R, a, "text", (v) => (set(Math.round(v)), draw()));
        const Q = [cx + (R + 16) * cosD(a), cy - (R + 16) * sinD(a)];
        label(svg, Q[0], Q[1], "ABCD"[i], "pt-lbl");
      });
      html = `<p><span class="dot dot-a"></span> ${names[0]} + ${names[2]}: ${fmt(ang[0], 1)}° + ${fmt(ang[2], 1)}° = <b>${fmt(ang[0] + ang[2], 1)}°</b></p>
        <p><span class="dot dot-b"></span> ${names[1]} + ${names[3]}: ${fmt(ang[1], 1)}° + ${fmt(ang[3], 1)}° = <b>${fmt(ang[1] + ang[3], 1)}°</b></p>
        <p>V tetivnem štirikotniku (oglišča na krožnici) je vsota nasprotnih kotov 180°. Velja tudi obratno: če je vsota nasprotnih kotov 180°, štirikotnik lahko včrtamo v krožnico.</p>`;
    } else {
      const PA = P(A), PB = P(B), PC = P(C);
      // lok AB, ki ne vsebuje C
      let from = A, span = norm360(B - A);
      if (onArc(C, from, span)) (from = B), (span = norm360(A - B));
      s("path", { d: arcD(cx, cy, R, from, from + span), class: "arc-thick" }, svg);
      const gamma = angleAt(PC, PA, PB);
      const central = span;
      s("line", { x1: PA[0], y1: PA[1], x2: PB[0], y2: PB[1], class: "edge" }, svg);
      s("path", { d: arcD(cx, cy, 26, from, from + central, true), class: "angle-fill fill-c" }, svg);
      s("line", { x1: cx, y1: cy, x2: PA[0], y2: PA[1], class: "graph-line stroke-c thin-line" }, svg);
      s("line", { x1: cx, y1: cy, x2: PB[0], y2: PB[1], class: "graph-line stroke-c thin-line" }, svg);
      const inscribed = (pc, a, cls) => {
        const Q = P(pc);
        s("line", { x1: Q[0], y1: Q[1], x2: PA[0], y2: PA[1], class: `graph-line stroke-${cls} thin-line` }, svg);
        s("line", { x1: Q[0], y1: Q[1], x2: PB[0], y2: PB[1], class: `graph-line stroke-${cls} thin-line` }, svg);
        const a1 = deg(Math.atan2(Q[1] - PA[1], PA[0] - Q[0])), a2 = deg(Math.atan2(Q[1] - PB[1], PB[0] - Q[0]));
        const st = norm360(a2 - a1) <= 180 ? a1 : a2;
        if (mode === "tales" && Math.abs(a - 90) < 0.6) {
          const u = [cosD(st), -sinD(st)], w = [cosD(st + 90), -sinD(st + 90)];
          s("path", { d: `M${Q[0] + 16 * u[0]},${Q[1] + 16 * u[1]} L${Q[0] + 16 * (u[0] + w[0])},${Q[1] + 16 * (u[1] + w[1])} L${Q[0] + 16 * w[0]},${Q[1] + 16 * w[1]}`, class: "right-angle" }, svg);
        } else s("path", { d: arcD(Q[0], Q[1], 24, st, st + a, true), class: `angle-fill fill-${cls}` }, svg);
      };
      inscribed(C, gamma, "a");
      let g2 = null;
      if (second && mode === "obodni") {
        if (!onArc(D, from, span) && Math.abs(norm360(D - A)) > 2 && Math.abs(norm360(D - B)) > 2) {
          g2 = angleAt(P(D), PA, PB);
          inscribed(D, g2, "b");
        }
      }
      s("circle", { cx, cy, r: 4, class: "pt fill-c" }, svg);
      label(svg, cx + 10, cy + 14, "S", "pt-lbl");
      const hs = [["A", A, (v) => (A = v)], ["B", B, (v) => (B = v)], ["C", C, (v) => (C = v)]];
      if (second && mode === "obodni") hs.push(["D", D, (v) => (D = v)]);
      hs.forEach(([nm, a, set]) => {
        if (mode === "tales" && nm !== "C") {
          s("circle", { cx: P(a)[0], cy: P(a)[1], r: 5, class: "pt fill-text" }, svg);
        } else circleHandle(svg, cx, cy, R, a, nm === "C" ? "a" : nm === "D" ? "b" : "text", (v) => {
          v = Math.round(v);
          if (Math.min(norm360(v - A), norm360(A - v)) < 3 && nm !== "A") return;
          if (Math.min(norm360(v - B), norm360(B - v)) < 3 && nm !== "B") return;
          set(v);
          draw();
        });
        label(svg, cx + (R + 16) * cosD(a), cy - (R + 16) * sinD(a), nm, "pt-lbl");
      });
      html = mode === "tales"
        ? `<p>AB je premer krožnice, zato je obodni kot pri C vedno <b>${fmt(gamma, 1)}° = 90°</b> (Talesov izrek). Središčni kot nad premerom je iztegnjeni kot 180°, polovica je 90°.</p>
           <p class="muted">Uporaba: vsak trikotnik, včrtan v polkrog, je pravokoten. Središče očrtane krožnice pravokotnega trikotnika je razpolovišče hipotenuze.</p>`
        : `<p><span class="dot dot-a"></span> Obodni kot ∠ACB = <b>${fmt(gamma, 1)}°</b>, <span class="dot dot-c"></span> središčni kot ∠ASB = <b>${fmt(central, 1)}°</b> = 2 · ${fmt(gamma, 1)}°.</p>
           <p>Obodni kot je <b>polovica središčnega kota</b> nad istim lokom (debelo). ${g2 != null ? `<span class="dot dot-b"></span> Drugi obodni kot ∠ADB = ${fmt(g2, 1)}°: obodni koti nad istim lokom so enaki.` : "Premakni C po krožnici: dokler ostane na isti strani tetive AB, se kot ne spremeni."}</p>
           <p class="muted">Če je AB premer, je središčni kot 180° in obodni kot 90° (Talesov izrek).</p>`;
    }
    out.innerHTML = html;
  };
  layout(el, {
    stage: [svg],
    controls: mode === "obodni" ? [toggle("drugi obodni kot (točka D)", second, (v) => ((second = v), draw()))] : null,
    out,
    tryText: mode === "tales" ? "Ali obstaja točka C na krožnici, kjer kot ni pravi?" : mode === "tetivni" ? "Premakni oglišča tako, da dobiš pravokotnik. Ali je vsak pravokotnik tetiven?" : "Kaj se zgodi z obodnim kotom, ko C preskoči na drugo stran tetive AB?",
  });
  draw();
}
