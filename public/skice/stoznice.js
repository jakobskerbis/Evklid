// Stožnice v ravnini (krožnica, elipsa, hiperbola, parabola): računi za skice in skupni koordinatni sistem.
// Oznake kot na kartici lista MAT-SŠ: središče (p, q), polosi a, b, linearna ekscentričnost e, gorišče G.
import { skica, st, osi, napis } from "./skica.js";

// Enačba z vstavljenimi števili, npr. »(x − 1)² + (y + 2)² = 9«; pri središču v 0 samo »x²«.
export function kroznica(p, q, r) {
  const clen = (ime, c) => (Math.abs(c) < 1e-9 ? `${ime}²` : `(${ime} ${c > 0 ? "−" : "+"} ${st(Math.abs(c), 1)})²`);
  return { p, q, r, enacba: `${clen("x", p)} + ${clen("y", q)} = ${st(r * r, 2)}` };
}

// Elipsa x²/a² + y²/b² = 1 (a ≥ b): gorišči (±e, 0), e² = a² − b²; točka pri parametru t.
export function elipsa(a, b, t) {
  const e = Math.sqrt(Math.max(0, a * a - b * b));
  const T = [a * Math.cos(t), b * Math.sin(t)];
  const r1 = Math.hypot(T[0] + e, T[1]), r2 = Math.hypot(T[0] - e, T[1]);
  return { e, T, r1, r2 };
}

// Hiperbola x²/a² − y²/b² = 1: gorišči (±e, 0), e² = a² + b²; veja v = ±1, parameter t.
export function hiperbola(a, b, t, v = 1) {
  const e = Math.sqrt(a * a + b * b);
  const T = [v * a * Math.cosh(t), b * Math.sinh(t)];
  const r1 = Math.hypot(T[0] + e, T[1]), r2 = Math.hypot(T[0] - e, T[1]);
  return { e, T, r1, r2, k: b / a };
}

// Parabola y² = 2px: gorišče G(p/2, 0), vodnica x = −p/2; točka z ordinato y.
export function parabola(p, y) {
  const T = [(y * y) / (2 * p), y];
  return { T, G: [p / 2, 0], dG: Math.hypot(T[0] - p / 2, T[1]), dV: T[0] + p / 2 };
}

// Skica z mrežo na [−6, 6] × [−4,54; 4,54]: 24 px na enoto na obeh oseh (krožnica je okrogla).
export function ravnina(navodilo, oznaka) {
  const W = 300, H = 230;
  const S = skica({ w: W, h: H, navodilo, oznaka });
  const oz = [-4, -2, 2, 4].map((v) => [v, st(v, 0)]);
  const A = osi(S.svg, { W, H, x: [-6, 6], y: [-4.5417, 4.5417], rob: 6, xOznake: [[-6, ""], ...oz, [6, ""]], yOznake: oz });
  const P = (v) => [A.X(v[0]), A.Y(v[1])];
  // Oznaka točke ob njej, na strani stran od središča, vedno v okvirju.
  const oznakaT = (g, v, ime = "T") => {
    const [x, y] = P(v);
    napis(g, Math.min(A.R - 12, Math.max(A.L + 12, x + (v[0] >= 0 ? 12 : -12))), Math.min(A.B - 4, Math.max(A.T + 14, y + (v[1] >= 0 ? -10 : 20))), ime, "glavna", { "text-anchor": "middle" });
  };
  return { S, A, P, oznakaT };
}
