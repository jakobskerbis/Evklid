// Skupni deli za simulacije pri fiziki: vzmeti, puščice sil, vozički, časovni grafi.
import { s, arrow, label, axes, fnPath, fmt } from "./kit.js";

export const G = 9.81;

// Pot vzmeti (cikcak) od (x1, y1) do (x2, y2).
export function springPath(x1, y1, x2, y2, n = 10, w = 9) {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, px = -uy, py = ux;
  const a = Math.min(10, L * 0.12);
  let d = `M${x1},${y1} L${x1 + ux * a},${y1 + uy * a}`;
  const seg = (L - 2 * a) / (2 * n);
  for (let i = 0; i < 2 * n; i++) {
    const t = a + seg * (i + 0.5), sg = i % 2 ? -1 : 1;
    d += ` L${(x1 + ux * t + px * w * sg).toFixed(1)},${(y1 + uy * t + py * w * sg).toFixed(1)}`;
  }
  return d + ` L${x2 - ux * a},${y2 - uy * a} L${x2},${y2}`;
}

// Puščica sile z oznako ob konici. Dolžina v pikslih je (fx, fy).
export function force(svg, x, y, fx, fy, col, name, { width = 3, off = 12, cls = "lbl small" } = {}) {
  if (Math.hypot(fx, fy) < 2) return;
  arrow(svg, x, y, x + fx, y + fy, col, width);
  if (name) {
    const L = Math.hypot(fx, fy);
    label(svg, x + fx + (fx / L) * off, y + fy + (fy / L) * off, name, cls);
  }
}

// Avto, ki stoji na cesti v točki (x, y) (y = cesta).
export function car(svg, x, y, col = "a", flip = false) {
  const g = s("g", { transform: `translate(${x},${y})${flip ? " scale(-1,1)" : ""}` }, svg);
  s("rect", { x: -20, y: -17, width: 40, height: 12, rx: 4, class: `fill-${col}` }, g);
  s("path", { d: "M-11,-17 L-6,-26 L8,-26 L13,-17 Z", class: `fill-${col}`, opacity: 0.75 }, g);
  s("circle", { cx: -11, cy: -4, r: 4.5, class: "fill-text" }, g);
  s("circle", { cx: 11, cy: -4, r: 4.5, class: "fill-text" }, g);
  return g;
}

// Graf količine v odvisnosti od časa: osi + krivulja do časa t (+ senčenje ploščine).
export function timeGraph(svg, { W = 340, H = 190, tMax, y0, y1, yLabel, f, t, cls = "", area = false, yStep }) {
  const A = axes(svg, { W, H, x: [0, tMax], y: [y0, y1], xLabel: "t [s]", yLabel, pad: 34, yStep });
  if (area && t > 0) {
    const n = 80;
    let d = `M${A.X(0)},${A.Y(0)}`;
    for (let i = 0; i <= n; i++) {
      const u = (t * i) / n;
      d += ` L${A.X(u).toFixed(1)},${A.Y(Math.max(y0, Math.min(y1, f(u)))).toFixed(1)}`;
    }
    s("path", { d: d + ` L${A.X(t)},${A.Y(0)} Z`, class: "area-fill fill-b" }, svg);
  }
  s("path", { d: fnPath(f, A, { n: 200 }), class: "graph-line stroke-muted thin-line", opacity: 0.35, "data-name": "Celoten potek" }, svg);
  if (t > 0) s("path", { d: fnPath(f, A, { to: t, n: Math.max(4, Math.round(200 * (t / tMax))) }), class: `graph-line ${cls}`, "data-name": "Potek do t" }, svg);
  const y = f(t);
  if (Number.isFinite(y) && y >= y0 && y <= y1) s("circle", { cx: A.X(t), cy: A.Y(y), r: 4.5, class: "pt fill-accent", "data-name": "Trenutek t" }, svg);
  return A;
}

// Merilnik s številčnico (npr. silomer, manometer).
export function dial(svg, cx, cy, r, value, max, unit, title) {
  s("circle", { cx, cy, r, class: "meter" }, svg);
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI * (1.25 - 1.5 * (i / 10)), c = Math.cos(a), sn = Math.sin(a);
    s("line", { x1: cx + c * r * 0.78, y1: cy - sn * r * 0.78, x2: cx + c * r * 0.92, y2: cy - sn * r * 0.92, class: "axis thin" }, svg);
  }
  const a = Math.PI * (1.25 - 1.5 * Math.max(0, Math.min(1, value / max)));
  s("line", { x1: cx, y1: cy, x2: cx + Math.cos(a) * r * 0.75, y2: cy - Math.sin(a) * r * 0.75, class: "graph-line stroke-danger", "stroke-width": 2.5 }, svg);
  s("circle", { cx, cy, r: 3, class: "fill-text" }, svg);
  label(svg, cx, cy + r * 0.45, `${fmt(value, value < 10 ? 2 : value < 100 ? 1 : 0)} ${unit}`, "lbl small");
  if (title) label(svg, cx, cy - r - 9, title, "tick b");
}
