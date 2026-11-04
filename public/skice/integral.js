// Integral in kombinatorika: računi za skice (preverjeni v test/skice.test.js).
// Skici integrala in trapezne metode uporabljata f(x) = 0,3x³ − 1,75x² + 2,7x + 0,5 na [0, 4]: ∫ = 82/15.
// f′(4) ≠ f′(0), zato se napaki trapezov ne izničita (pri n = 1 je napaka 0,53, pri n = 12 pod 0,005).
export const A_INT = 0, B_INT = 4;
export const f = (x) => 0.3 * x ** 3 - 1.75 * x * x + 2.7 * x + 0.5;
export const F = (x) => 0.075 * x ** 4 - (1.75 / 3) * x ** 3 + 1.35 * x * x + 0.5 * x; // F′ = f
export const TOCNO = F(B_INT) - F(A_INT);

// Riemannova vsota s srednjimi vrednostmi: n pravokotnikov širine Δx = (b − a)/n, višina f v sredini.
export function riemann(n, a = A_INT, b = B_INT, fn = f) {
  const dx = (b - a) / n;
  const pr = Array.from({ length: n }, (_, i) => ({ x0: a + i * dx, xs: a + (i + 0.5) * dx, fi: fn(a + (i + 0.5) * dx) }));
  return { dx, pr, vsota: pr.reduce((s, p) => s + p.fi * dx, 0) };
}

// Trapezna metoda: h = (b − a)/n, T = h/2 (f(a) + 2f(a + h) + … + 2f(b − h) + f(b)).
export function trapez(n, a = A_INT, b = B_INT, fn = f) {
  const h = (b - a) / n;
  const y = Array.from({ length: n + 1 }, (_, i) => fn(a + i * h));
  return { h, y, T: (h / 2) * (y[0] + y[n] + 2 * y.slice(1, -1).reduce((s, v) => s + v, 0)) };
}

// Simpsonovo pravilo za ploščino in prostornino (napaka pri 2000 korakih je pod 10⁻¹⁰).
export function simpson(fn, a, b, n = 2000) {
  if (a === b) return 0;
  const h = (b - a) / n;
  let s = fn(a) + fn(b);
  for (let i = 1; i < n; i++) s += fn(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

// Ploščina med krivuljama f₁ (zgoraj desno) in g (premica): S = ∫ |f₁ − g| dx.
export const f1 = (x) => 3.5 - ((x - 2) ** 2) / 2;
export const g1 = (x) => 0.5 + x / 2;
export const ploscina = (a, b) => simpson((x) => Math.abs(f1(x) - g1(x)), Math.min(a, b), Math.max(a, b), 4000);

// Vrtenina okoli osi x: f₂(x) = 0,3x² − 1,2x + 2 na [0, 4], V = π ∫ f₂² dx.
export const f2 = (x) => 0.3 * x * x - 1.2 * x + 2;
export const vrtenina = () => Math.PI * simpson((x) => f2(x) ** 2, 0, 4);

// Binomski koeficient (natančno za n ≤ 30).
export function C(n, r) {
  if (r < 0 || r > n) return 0;
  let c = 1;
  for (let i = 1; i <= Math.min(r, n - r); i++) c = (c * (n - Math.min(r, n - r) + i)) / i;
  return Math.round(c);
}

// Bernoullijevo zaporedje: P_n(k) = C(n, k) p^k (1 − p)^(n − k).
export const bernoulli = (n, p, k) => C(n, k) * p ** k * (1 - p) ** (n - k);

// Aritmetična sredina, standardni odklon (deljeno z N) in varianca.
export function statistika(xs) {
  const N = xs.length, x = xs.reduce((s, v) => s + v, 0) / N;
  const var_ = xs.reduce((s, v) => s + (v - x) ** 2, 0) / N;
  return { N, x, sigma: Math.sqrt(var_), var: var_ };
}
