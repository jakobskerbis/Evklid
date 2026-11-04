// Ikone primerov v grafičnem kalkulatorju: majhen graf, ki ga izriše dejanska funkcija primera (premica, parabola,
// sinusoida, krožnica, ploščina …), da ikona pokaže pravo obliko krivulje. Brez DOM (preizkus v test/ex-ikone.test.js).

const N = 120;
const r1 = (v) => Math.round(v * 10) / 10;

/**
 * SVG ikona 24 × 24 iz opisa: { view: [xmin, xmax, ymin, ymax], parts: [...] }. Del je
 * { fn: x => y, from?, to? } | { par: t => [x, y], t: [a, b] } | { pts: [[x, y], ...] } |
 * { fill: { top: x => y, bot?: x => y, from, to } }; dash: true nariše črtkano, faint: true bledo, w tanjšo črto.
 * Krivulja se ob robu pogleda prekine (tan, log …), osi pa se narišejo bledo, kjer so v pogledu.
 */
export function curveIcon({ view, parts }, cls = "") {
  const [x0, x1, y0, y1] = view;
  const P = 2; // rob, da debela črta ni odrezana
  const sx = (x) => P + ((x - x0) / (x1 - x0)) * (24 - 2 * P);
  const sy = (y) => 24 - P - ((y - y0) / (y1 - y0)) * (24 - 2 * P);
  const inside = (x, y) => Number.isFinite(y) && y >= y0 - (y1 - y0) * 0.02 && y <= y1 + (y1 - y0) * 0.02 && x >= x0 && x <= x1;
  const path = (pts) => {
    let d = "";
    let pen = false;
    for (const [x, y] of pts) {
      if (!inside(x, y)) {
        pen = false;
        continue;
      }
      d += `${pen ? "L" : "M"}${r1(sx(x))} ${r1(sy(y))}`;
      pen = true;
    }
    return d;
  };
  const sample = (f, a = x0, b = x1) => Array.from({ length: N + 1 }, (_, i) => a + ((b - a) * i) / N).map((x) => [x, f(x)]);
  let out = "";
  // osi
  const ax = [];
  if (y0 < 0 && y1 > 0) ax.push(`M${P} ${r1(sy(0))}H${24 - P}`);
  if (x0 < 0 && x1 > 0) ax.push(`M${r1(sx(0))} ${P}V${24 - P}`);
  if (ax.length) out += `<path d="${ax.join("")}" stroke-width="1" opacity=".35"/>`;
  for (const p of parts) {
    const st = `${p.dash ? ` stroke-dasharray="2 2.2" stroke-width="1.5"` : p.w ? ` stroke-width="${p.w}"` : ""}${p.faint ? ` opacity=".55"` : ""}`;
    if (p.fill) {
      const { top, bot = () => 0, from, to } = p.fill;
      const clamp = (y) => (Number.isFinite(y) ? Math.max(y0, Math.min(y1, y)) : Math.max(y0, Math.min(y1, 0)));
      const a = Math.max(x0, from);
      const b = Math.min(x1, to);
      const up = sample(top, a, b).map(([x, y]) => `${r1(sx(x))} ${r1(sy(clamp(y)))}`);
      const dn = sample(bot, a, b).reverse().map(([x, y]) => `${r1(sx(x))} ${r1(sy(clamp(y)))}`);
      out += `<path d="M${up.join("L")}L${dn.join("L")}Z" fill="currentColor" stroke="none" opacity=".28"/>`;
    } else if (p.pts) {
      out += p.pts.filter(([x, y]) => inside(x, y)).map(([x, y]) => `<circle cx="${r1(sx(x))}" cy="${r1(sy(y))}" r="${p.r || 1.4}" fill="currentColor" stroke="none"${st}/>`).join("");
    } else {
      const pts = p.par ? Array.from({ length: 4 * N + 1 }, (_, i) => p.par(p.t[0] + ((p.t[1] - p.t[0]) * i) / (4 * N))) : sample(p.fn, p.from ?? x0, p.to ?? x1);
      const d = path(pts);
      if (d) out += `<path d="${d}"${st}/>`;
    }
  }
  return `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${out}</svg>`;
}

const { sin, cos, sqrt, log2, PI } = Math;

/** Opisi ikon po vrsti primerov v examples.js (ključ je napis primera). */
export const IKONE = {
  "y = kx + n": { view: [-4, 4, -3, 4], parts: [{ fn: (x) => 0.5 * x + 1 }, { pts: [[0, 1]], r: 1.6 }] },
  "y = a(x-p)^2 + q": { view: [-1.5, 5.5, -4, 4], parts: [{ fn: (x) => (x - 2) ** 2 - 3 }, { pts: [[2, -3]], r: 1.6 }] },
  "y = A\\sin(Bx + C)": { view: [-5, 5, -3, 3], parts: [{ fn: (x) => 2 * sin(x) }] },
  "(x-a)^2 + (y-b)^2 = c^2": { view: [-3.5, 5.5, -2.5, 6.5], parts: [{ par: (t) => [1 + 3 * cos(t), 2 + 3 * sin(t)], t: [0, 2 * PI] }, { pts: [[1, 2]], r: 1.6 }] },
  "y \\ge x^2 - 4,\\ y \\le x + 2": {
    view: [-3.5, 4, -5, 5.5],
    parts: [{ fill: { top: (x) => x + 2, bot: (x) => x * x - 4, from: -2, to: 3 } }, { fn: (x) => x * x - 4 }, { fn: (x) => x + 2 }],
  },
  "f(x) = x^3 - 3x,\\ f'(x)": {
    view: [-2.6, 2.6, -3.5, 3.5],
    parts: [{ fn: (x) => x ** 3 - 3 * x }, { fn: (x) => 3.75 * (x - 1.5) - 1.125, from: 0.85, to: 2.15, faint: true }, { pts: [[1.5, -1.125]], r: 1.5 }],
  },
  "\\int_a^b f(x)\\,dx": { view: [-2.5, 3, -0.8, 4.5], parts: [{ fill: { top: (x) => 0.5 * x * x + 1, from: -1, to: 2 } }, { fn: (x) => 0.5 * x * x + 1 }] },
  "y = 2^x,\\ y = \\log_2 x": {
    view: [-3, 4.5, -3, 4.5],
    parts: [{ fn: (x) => x, dash: true, faint: true }, { fn: (x) => 2 ** x }, { fn: (x) => (x > 0 ? log2(x) : NaN), from: 0.01 }],
  },
  "\\begin{cases}-x & x<0\\\\ \\sqrt{x} & x \\ge 0\\end{cases}": { view: [-3, 4, -1, 3.2], parts: [{ fn: (x) => -x, to: 0 }, { fn: (x) => sqrt(x), from: 0 }] },
  "r = \\sin(k\\theta)": { view: [-1.1, 1.1, -1.1, 1.1], parts: [{ par: (t) => [sin(4 * t) * cos(t), sin(4 * t) * sin(t)], t: [0, 2 * PI], w: 1.5 }] },
  "(\\sin(at),\\ \\sin(bt))": { view: [-1.15, 1.15, -1.15, 1.15], parts: [{ par: (t) => [sin(3 * t), sin(2 * t)], t: [0, 2 * PI], w: 1.6 }] },
  "x^3 + y^3 = 6xy": {
    view: [-4, 4.5, -4, 4.5],
    parts: [{ fn: (x) => -2 - x, dash: true, faint: true }, { par: (t) => [(6 * t) / (1 + t ** 3), (6 * t * t) / (1 + t ** 3)], t: [-0.62, 30] }, { par: (t) => [(6 * t) / (1 + t ** 3), (6 * t * t) / (1 + t ** 3)], t: [-30, -1.6] }],
  },
  "y = ax + b\\ (R^2)": {
    view: [-0.5, 8, -1, 15.5],
    parts: [{ fn: (x) => 1.989 * x + 0.043, faint: true }, { pts: [[1, 2.1], [2, 3.8], [3, 6.3], [4, 7.9], [5, 9.7], [6, 12.4], [7, 13.8]], r: 1.3 }],
  },
  "a_n = a_{n-1} + d,\\ a_1 = 2": {
    view: [-0.5, 8.5, -11, 13],
    parts: [{ pts: [1, 2, 3, 4, 5, 6, 7].map((n) => [n, 2 + 1.5 * (n - 1)]), r: 1.3 }, { pts: [1, 2, 3, 4, 5, 6, 7].map((n) => [n, ((-1) ** n * 10) / n]), r: 1.1, faint: true }],
  },
  "\\sum_{n=1}^{k} \\frac{\\sin(nx)}{n}": {
    view: [-9.5, 9.5, -2.2, 2.2],
    parts: [{ fn: (x) => [1, 2, 3, 4, 5].reduce((s, n) => s + sin(n * x) / n, 0), w: 1.6 }],
  },
};

/** Ikona primera: graf, če ga poznamo, sicer splošna ikona. */
export function exampleIcon(ex, icon) {
  const d = IKONE[ex.label];
  return d ? curveIcon(d, "gc-ex-curve") : icon(ex.icon || "chart-spline");
}
