// Zaporedja, limita, odvod in diferencial: računi za skice (preverjeni v test/skice.test.js).
// Skice odvoda uporabljajo f(x) = x²/2 (f′(x) = x), da so vrednosti v čipih natančne.
import { skica, st, osi } from "./skica.js";

export const f = (x) => (x * x) / 2;
export const fOdvod = (x) => x;

// Člena in vsota: aritmetično (d) ali geometrijsko (q) zaporedje.
export function zaporedje(vrsta, a1, k, n) {
  const clen = (i) => (vrsta === "aritmeticno" ? a1 + (i - 1) * k : a1 * k ** (i - 1));
  const an = clen(n);
  const sn = vrsta === "aritmeticno" ? (n / 2) * (a1 + an) : k === 1 ? n * a1 : (a1 * (k ** n - 1)) / (k - 1);
  return { clen, an, sn };
}

// Limita lim_{x→a} x²/2 = a²/2 = b: največji δ, da je |f(x) − b| < ε za vsak x z 0 < |x − a| < δ.
export function limita(a, eps) {
  // Meja je na strani večjega |x| (tam f hitreje raste): |x| < √(a² + 2ε). Na strani proti 0 je
  // dovoljeni odmik vedno vsaj tolikšen (konkavnost korena), zato je δ = √(a² + 2ε) − |a|.
  const b = f(a), A = Math.abs(a);
  return { b, delta: Math.sqrt(A * A + 2 * eps) - A };
}

// Diferenčni kvocient (sekanta) in odvod (tangenta) v x₀.
export function odvod(x0, h) {
  const df = f(x0 + h) - f(x0);
  return { y0: f(x0), df, kvocient: df / h, k: fOdvod(x0) };
}

// Diferencial: Δf = f(x₀ + dx) − f(x₀), df = f′(x₀) dx; razlika Δf − df.
export function diferencial(x0, dx) {
  const Df = f(x0 + dx) - f(x0), d = fOdvod(x0) * dx;
  return { y0: f(x0), Df, df: d, razlika: Df - d };
}

// Drsnik brez vrednosti 0 (h, dx, a₁, q): preskoči jo v smeri premika.
// Drsnik je skoraj zvezen: |v| < korak (izpis bi bil 0) se pripne na ±korak na strani v; pri v = 0 (puščica) skoči čez.
export const brezNic = (v, prej, korak) => (Math.abs(v) >= korak - 1e-9 ? v : v > 0 ? korak : v < 0 ? -korak : prej > 0 ? -korak : korak);

// Skupni okvir za skice s funkcijo x²/2: x ∈ [−3,5; 3,5], y ∈ [−1,2; 5,6].
export function okvir(navodilo, oznaka) {
  const W = 300, H = 250;
  const S = skica({ w: W, h: H, navodilo, oznaka });
  const oz = [-3, -2, -1, 1, 2, 3].map((v) => [v, st(v, 0)]);
  const A = osi(S.svg, { W, H, x: [-3.5, 3.5], y: [-1.2, 5.6], rob: 8, xOznake: oz, yOznake: [1, 2, 3, 4, 5].map((v) => [v, st(v, 0)]) });
  return { S, A, W, H };
}

// Točka x₀ na korak 0,1 v [−2,5; 2,5], tako da je tudi x₀ + d (h ali dx) v okvirju: |x₀ + d| ≤ 3,2, f ≤ 5,12.
export function omejiX0(x0, d) {
  const lo = Math.max(-2.5, -3.2 - d), hi = Math.min(2.5, 3.2 - d);
  return Math.round(Math.min(hi, Math.max(lo, x0)) * 10) / 10 || 0; // || 0: brez »−0«
}
