// Primeri za grafični kalkulator. Napis je formula (TeX), zato ne potrebuje prevoda.
import { emptyState, newId } from "./model.js";

const ex = (texts, extra = {}) => () => {
  const s = emptyState();
  s.items = texts.map((x, i) => {
    const it = typeof x === "string" ? { text: x } : x;
    return { id: newId(), type: "expr", color: i % 8, ...it };
  });
  Object.assign(s.settings, extra.settings || {});
  if (extra.view) s.view = extra.view;
  return s;
};

export const EXAMPLES = [
  { label: "y = kx + n", icon: "trending-up", state: ex(["y = kx + n", "k = 0.5", "n = 1", { text: "(0, n)", color: 1 }]) },
  { label: "y = a(x-p)^2 + q", icon: "chart-spline", state: ex(["y = a(x - p)^2 + q", "a = 1", "p = 2", "q = -3", { text: "(p, q)", color: 0 }]) },
  { label: "y = A\\sin(Bx + C)", icon: "activity", state: ex(["y = A sin(Bx + C)", { text: "A = 2", slider: { min: -5, max: 5, step: 0.1 } }, { text: "B = 1", slider: { min: 0, max: 5, step: 0.1 } }, { text: "C = 0", slider: { min: -3.2, max: 3.2, step: 0.1, play: true } }], { settings: { piX: true }, view: { xmin: -7, xmax: 7, ymin: -4, ymax: 4 } }) },
  { label: "(x-a)^2 + (y-b)^2 = c^2", icon: "circle", state: ex(["(x - a)^2 + (y - b)^2 = c^2", "a = 1", "b = 2", "c = 3", { text: "(a, b)", color: 1 }]) },
  { label: "y \\ge x^2 - 4,\\ y \\le x + 2", icon: "chart-area", state: ex(["y >= x^2 - 4", "y <= x + 2"]) },
  { label: "f(x) = x^3 - 3x,\\ f'(x)", icon: "chart-spline", state: ex([{ text: "f(x) = x^3 - 3x", tools: { deriv: true, tangent: 1.5 } }]) },
  { label: "\\int_a^b f(x)\\,dx", icon: "chart-area", state: ex([{ text: "f(x) = 0.5x^2 + 1", tools: { area: [-1, 2] } }]) },
  { label: "y = 2^x,\\ y = \\log_2 x", icon: "chart-spline", state: ex(["y = 2^x", "y = log_2(x)", { text: "y = x", style: "dash", color: 5 }]) },
  { label: "\\begin{cases}-x & x<0\\\\ \\sqrt{x} & x \\ge 0\\end{cases}", icon: "chart-spline", state: ex(["y = {x < 0: -x, √x}"]) },
  { label: "r = \\sin(k\\theta)", icon: "flower", state: ex(["r = sin(kθ)", { text: "k = 4", slider: { min: 1, max: 8, step: 1 } }], { view: { xmin: -1.6, xmax: 1.6, ymin: -1.2, ymax: 1.2 } }) },
  { label: "(\\sin(at),\\ \\sin(bt))", icon: "infinity", state: ex(["(sin(at), sin(bt))", { text: "a = 3", slider: { min: 1, max: 6, step: 1 } }, { text: "b = 2", slider: { min: 1, max: 6, step: 1 } }], { view: { xmin: -2, xmax: 2, ymin: -1.5, ymax: 1.5 } }) },
  { label: "x^3 + y^3 = 6xy", icon: "spline", state: ex(["x^3 + y^3 = 6xy", { text: "x + y = -2", style: "dash", color: 5 }]) },
  {
    label: "y = ax + b\\ (R^2)",
    icon: "table",
    state: () => {
      const s = emptyState();
      s.items = [
        { id: newId(), type: "note", text: "" },
        { id: newId(), type: "table", color: 1, reg: "lin", cols: [{ name: "x_1", values: [1, 2, 3, 4, 5, 6, 7] }, { name: "y_1", values: [2.1, 3.8, 6.3, 7.9, 9.7, 12.4, 13.8] }] },
      ];
      s.items.shift();
      s.view = { xmin: -1, xmax: 9, ymin: -2, ymax: 16 };
      s.settings.square = false;
      return s;
    },
  },
  { label: "a_n = a_{n-1} + d,\\ a_1 = 2", icon: "chart-column", state: ex(["a(n) = a(n - 1) + d", "a(1) = 2", { text: "d = 1.5", slider: { min: -3, max: 3, step: 0.5 } }, { text: "b(n) = (-1)^n · 10/n", color: 3 }], { view: { xmin: -1, xmax: 16, ymin: -12, ymax: 26 }, settings: { square: false } }) },
  { label: "\\sum_{n=1}^{k} \\frac{\\sin(nx)}{n}", icon: "sigma", state: ex(["y = ∑_(n=1)^(k) sin(nx)/n", { text: "k = 5", slider: { min: 1, max: 30, step: 1 } }], { settings: { piX: true }, view: { xmin: -7, xmax: 7, ymin: -3, ymax: 3 } }) },
];
