// Poskusi (kot Casio fx-991CW): met kocke in kovanca, številska premica, preverjanje enakosti in neenakosti.
// Računanje brez DOM (testi v test/tools.test.js); reševanje neenačb in računanje izrazov: scisolve.analyze.
import { analyze } from "./scisolve.js";

const choose = (n, k) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
};

/** Verjetnosti vsote pik pri k kockah: [{ x, p }] za x = k … 6k. */
export function diceDist(k) {
  let d = [1]; // d[s] = verjetnost vsote s (od 0)
  for (let i = 0; i < k; i++) {
    const nd = new Array(d.length + 6).fill(0);
    d.forEach((p, s) => {
      for (let f = 1; f <= 6; f++) nd[s + f] += p / 6;
    });
    d = nd;
  }
  return d.map((p, x) => ({ x, p })).filter((o) => o.x >= k && o.x <= 6 * k);
}

/** Verjetnosti števila grbov pri k kovancih: [{ x, p }] za x = 0 … k. */
export const coinDist = (k) => Array.from({ length: k + 1 }, (_, x) => ({ x, p: choose(k, x) / 2 ** k }));

/**
 * n metov k kock ali kovancev. Vrne { counts: { izid: frekvenca }, last: [posamezni izidi zadnjega meta] }.
 * Kocka: izid je vsota pik; kovanec: število grbov (1 = grb).
 */
export function roll(kind, k, n, rnd = Math.random) {
  const counts = {};
  let last = [];
  for (let i = 0; i < n; i++) {
    last = Array.from({ length: k }, () => (kind === "dice" ? 1 + Math.floor(rnd() * 6) : rnd() < 0.5 ? 1 : 0));
    const x = last.reduce((a, b) => a + b, 0);
    counts[x] = (counts[x] || 0) + 1;
  }
  return { counts, last };
}

/** Preveri enakost ali neenakost brez neznank (Casio »Preveri«): { value: true|false, tex } ali { error }. */
export function verify(text, { comma = true } = {}) {
  const src = String(text ?? "").trim();
  if (!src) return null;
  if (!/[=<>≤≥≠]/.test(src)) return { error: "notCmp" };
  const r = analyze(src, { comma });
  if (!r) return null;
  if (r.kind === "bool") return { value: r.value, tex: r.tex };
  if (r.error && r.error.code !== "missing") return { error: "syntax" };
  return { error: "unknowns" };
}

const ALL = { lo: -Infinity, hi: Infinity, loIn: false, hiIn: false };

/**
 * Množica rešitev neenačbe (ali enačbe) z eno neznanko kot seznam intervalov za številsko premico.
 * @returns {{ v, intervals: [{lo, hi, loIn, hiIn}], tex } | { error } | null}
 */
export function solutionSet(text, { comma = true } = {}) {
  const src = String(text ?? "").trim();
  if (!src) return null;
  const r = analyze(src, { comma });
  if (!r) return null;
  // periodične (sin x > 0): ena perioda in TeX periode (period), da se vidi, da se ponavlja
  if (r.kind === "ineq") return { v: r.v, intervals: r.intervals.map((i) => ({ ...i })), tex: r.tex, period: r.periodic ? r.interval : null };
  if (r.kind === "solve" && !r.all) {
    const pts = (r.roots || []).filter(Number.isFinite);
    return { v: r.v, intervals: r.none ? [] : pts.map((x) => ({ lo: x, hi: x, loIn: true, hiIn: true })), tex: r.tex, period: r.interval || null };
  }
  if (r.kind === "solve" && r.all) return { v: r.v, intervals: [{ ...ALL }], tex: r.tex };
  return { error: "line" };
}

/** Presek dveh množic intervalov. */
export function intersect(A, B) {
  const out = [];
  for (const a of A)
    for (const b of B) {
      const lo = Math.max(a.lo, b.lo);
      const hi = Math.min(a.hi, b.hi);
      if (lo > hi) continue;
      const loIn = (a.lo === lo ? a.loIn : true) && (b.lo === lo ? b.loIn : true);
      const hiIn = (a.hi === hi ? a.hiIn : true) && (b.hi === hi ? b.hiIn : true);
      if (lo === hi && !(loIn && hiIn)) continue;
      out.push({ lo, hi, loIn: Number.isFinite(lo) && loIn, hiIn: Number.isFinite(hi) && hiIn });
    }
  return out.sort((x, y) => x.lo - y.lo);
}
