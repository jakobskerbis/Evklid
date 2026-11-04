// Naloge za igre: vsak pojem ima generator gen(stopnja 1–3) → { q, a, w: [napačni …] }.
// Besedilo je kratko in čim bolj v simbolih, da se izriše na predmetu v igri (meteor, balon …).
// Modul je čist (brez DOM), zato ga uporabljajo tudi testi na strežniku.
// Drugi predmeti so v subjects/ (gen(stopnja, { lang, num })).
import { PACKS } from "./subjects/index.js";

let DEC = ",";
let LANG = "sl";
export const gameLang = () => LANG;
export function setNumberStyle(lang) {
  LANG = lang === "sl" ? "sl" : "en";
  try {
    DEC = (1.5).toLocaleString(lang).includes(",") ? "," : ".";
  } catch {
    DEC = ",";
  }
}

// Za čas klica fn drug jezik nalog in zapis števil, nato prejšnji (npr. igre izberejo pojme v enem jeziku,
// da je izbira v vseh jezikih enaka).
export function withNumberStyle(lang, fn) {
  const was = [LANG, DEC];
  setNumberStyle(lang);
  try {
    return fn();
  } finally {
    [LANG, DEC] = was;
  }
}

// ---------- pomožne ----------
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const R0 = (a, b) => {
  let x = 0;
  while (x === 0) x = R(a, b);
  return x;
};
export const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const M = "−"; // pravi minus
const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
const SUB = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };
export const sup = (n) => String(n).replace(/[-0-9]/g, (c) => SUP[c]);
const sub = (n) => String(n).replace(/[0-9]/g, (c) => SUB[c]);

// Trditev iz naloge: »?« zamenja ponujena vrednost, sicer »= vrednost« (sortirnica, »Kdo je slepar?«).
export function statement(q, v) {
  if (/\?$/.test(q) && !/[=:]\s*\?$/.test(q) && !/\?°$/.test(q)) return [q, v];
  if (q.includes("?")) return ["", q.replace("?", v)];
  return [q, /^[a-zA-Zα-ω(]{0,3}\s?[=<>≤≥]/.test(v) || v.startsWith("{") ? `⇒ ${v}` : `= ${v}`];
}
// število: decimalna vejica po jeziku, pravi minus, brez plavajočih ostankov
export function fmt(x) {
  if (!Number.isFinite(x)) return String(x);
  let s = String(Math.round(x * 1e6) / 1e6);
  if (s.includes("e")) s = x.toFixed(6).replace(/0+$/, "");
  return s.replace("-", M).replace(".", DEC);
}
// okrajšan ulomek
export function fr(n, d) {
  if (d < 0) [n, d] = [-n, -d];
  const g = gcd(n, d) || 1;
  n /= g;
  d /= g;
  if (d === 1) return fmt(n);
  return `${n < 0 ? M : ""}${Math.abs(n)}/${d}`;
}
// člen s koeficientom: c·x^p
function term(c, v, p, first) {
  if (c === 0) return "";
  const sign = c < 0 ? (first ? M : ` ${M} `) : first ? "" : " + ";
  const a = Math.abs(c);
  const coef = p === 0 ? fmt(a) : a === 1 ? "" : fmt(a);
  const varp = p === 0 ? "" : p === 1 ? v : v + sup(p);
  return sign + coef + varp;
}
// polinom iz koeficientov od najvišje potence
export function poly(cs, v = "x") {
  let out = "";
  cs.forEach((c, i) => {
    const p = cs.length - 1 - i;
    if (c) out += term(c, v, p, !out);
  });
  return out || "0";
}
const lin = (a, b, v = "x") => poly([a, b], v);
// kompleksno število a + bi
export function cx(a, b) {
  if (!b) return fmt(a);
  const bi = Math.abs(b) === 1 ? "i" : `${fmt(Math.abs(b))}i`;
  if (!a) return (b < 0 ? M : "") + bi;
  return `${fmt(a)} ${b < 0 ? M : "+"} ${bi}`;
}
const par = (s) => (/^[−-]/.test(s) || /[ +]/.test(s) ? `(${s})` : s);
const set = (xs) => `{${[...xs].sort((a, b) => a - b).map(fmt).join("; ")}}`;
const deg = (x) => `${fmt(x)}°`;
const pt = (x, y) => `(${fmt(x)}, ${fmt(y)})`;
const vec = (...xs) => `(${xs.map(fmt).join(", ")})`;

// Sestavi nalogo: napačni odgovori brez podvajanja in brez pravilnega; manjkajoče doda fill().
function mk(q, a, ws, fill) {
  const out = [];
  const seen = new Set([a]);
  const add = (w) => {
    if (w == null) return;
    const s = String(w);
    if (!seen.has(s) && s !== "NaN" && s !== "Infinity") {
      seen.add(s);
      out.push(s);
    }
  };
  ws.forEach(add);
  for (let i = 0; out.length < 3 && i < 60; i++) add(fill(i));
  return { q, a: String(a), w: shuffle(out.slice(0, 3)) };
}
// številski odgovor; napačni so tipične napake + bližnja števila
function num(q, a, ws = [], step = 1) {
  const near = [1, -1, 2, -2, 10, -10, 3, -3, 5, -5];
  const nice = (x) => Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-6 || Math.abs(a * 1000 - Math.round(a * 1000)) > 1e-6;
  return mk(q, fmt(a), ws.map((w) => (typeof w === "number" ? (nice(w) ? fmt(w) : null) : w)), (i) =>
    i < near.length ? fmt(a + near[i] * step) : fmt(a + R(-20, 20) * step),
  );
}
function frc(q, n, d, ws = []) {
  const nn = (k) => (n > 0 && d > 0 ? Math.max(1, k) : k || 1);
  return mk(q, fr(n, d), ws, (i) => fr(nn(n + R(-3, 3)), d + (i % 2 ? R(1, 3) : 0)));
}

// Kratke besede v nalogah (sl / en).
const WORDS = {
  prime: ["Praštevilo?", "Prime?"],
  notPrime: ["Sestavljeno število?", "Composite?"],
  divBy: ["Deljivo z {n}?", "Divisible by {n}?"],
  mean: ["Povprečje", "Mean"],
  median: ["Mediana", "Median"],
  mode: ["Modus", "Mode"],
  range: ["Razpon", "Range"],
  area: ["Ploščina", "Area"],
  perim: ["Obseg", "Perimeter"],
  volume: ["Prostornina", "Volume"],
  surface: ["Površina", "Surface area"],
  largest: ["Največje?", "Largest?"],
  smallest: ["Najmanjše?", "Smallest?"],
  zeros: ["ničli", "zeros"],
  zero: ["ničla", "zero"],
  vertex: ["teme", "vertex"],
  dist: ["razdalja", "distance"],
  mid: ["razpolovišče", "midpoint"],
  slope: ["naklon", "slope"],
  sol: ["rešitev", "solution"],
  scale: ["merilo", "scale factor"],
  sides: ["kotnik", "-gon"],
  inner: ["notranji kot", "interior angle"],
  outer: ["zunanji kot", "exterior angle"],
  diag: ["diagonale", "diagonals"],
  min: ["minimum", "minimum"],
  max: ["maksimum", "maximum"],
  stat: ["stacionarni točki", "stationary points"],
  tangent: ["naklon tangente", "tangent slope"],
};
const w = (k, vars = {}) => WORDS[k][LANG === "sl" ? 0 : 1].replace(/\{(\w+)\}/g, (_, v) => vars[v]);

// ---------- pojmi ----------
// [id, področje, leto šolanja, ime sl, ime en, gen]
const C = [];
const def = (id, area, year, sl, en, gen) => C.push({ id, area, year, name: { sl, en }, gen });

// ===== ARITMETIKA =====
def("add", "ar", 1, "Seštevanje", "Addition", (t) => {
  const m = [10, 100, 1000][t - 1];
  const a = R(1, m), b = R(1, m);
  if (t === 3) {
    const c = R(10, 300);
    return num(`${a} + ${b} + ${c}`, a + b + c, [a + b + c + 100, a + b + c - 10]);
  }
  return num(`${a} + ${b}`, a + b, [a + b + 10, a + b - 1], 1);
});
def("sub", "ar", 1, "Odštevanje", "Subtraction", (t) => {
  const m = [10, 100, 1000][t - 1];
  let a = R(2, m), b = R(1, a);
  return num(`${a} ${M} ${b}`, a - b, [a + b, a - b + 10, a - b - 10]);
});
def("mul", "ar", 2, "Poštevanka", "Times tables", (t) => {
  const a = t === 1 ? R(2, 5) : t === 2 ? R(2, 10) : R(11, 25);
  const b = t === 1 ? R(1, 10) : R(2, 12);
  return num(`${a} · ${b}`, a * b, [a * (b + 1), (a + 1) * b, a + b, a * (b - 1)]);
});
def("div", "ar", 3, "Deljenje", "Division", (t) => {
  const b = t === 1 ? R(2, 5) : t === 2 ? R(2, 10) : R(3, 19);
  const a = t === 3 ? R(11, 60) : R(1, 10);
  return num(`${a * b} : ${b}`, a, [a + 1, a - 1, b, a * 10]);
});
def("rem", "ar", 4, "Deljenje z ostankom", "Division with remainder", (t) => {
  const b = t === 1 ? R(2, 5) : t === 2 ? R(3, 9) : R(6, 15);
  const k = R(2, t === 3 ? 30 : 10), r = R(1, b - 1), n = k * b + r;
  const s = (q, rr) => `${q} ${LANG === "sl" ? "ost." : "r"} ${rr}`;
  return mk(`${n} : ${b}`, s(k, r), [s(k, r + 1), s(k + 1, r), s(k - 1, r + b), s(k, b - r)], () => s(k + R(-2, 2), R(0, b - 1)));
});
def("order", "ar", 5, "Vrstni red računanja", "Order of operations", (t) => {
  const a = R(2, 9), b = R(2, 9), c = R(2, 9), d = R(1, 9);
  if (t === 1) return num(`${a} + ${b} · ${c}`, a + b * c, [(a + b) * c]);
  if (t === 2) return num(`(${a} + ${b}) · ${c} ${M} ${d}`, (a + b) * c - d, [a + b * c - d, (a + b) * (c - d)]);
  const e = R(2, 4);
  return num(`${a} · (${b + c} ${M} ${c})${sup(2)} ${M} ${d}`, a * b * b - d, [(a * b) ** 2 - d, a * 2 * b - d, a * b * b + d]);
});
def("round", "ar", 4, "Zaokroževanje", "Rounding", (t) => {
  if (t < 3) {
    const to = t === 1 ? 10 : 100, n = R(to + 1, to * 99);
    const r = Math.round(n / to) * to;
    return num(`${n} ≈ ? (${to})`, r, [Math.floor(n / to) * to === r ? r + to : Math.floor(n / to) * to, r + to, r - to], to);
  }
  const x = R(1000, 99999) / 1000, dd = R(1, 2);
  const r = Math.round(x * 10 ** dd) / 10 ** dd;
  return num(`${fmt(x)} ≈ ? (${fmt(10 ** -dd)})`, r, [Math.trunc(x * 10 ** dd) / 10 ** dd, r + 10 ** -dd], 10 ** -dd);
});
def("place", "ar", 3, "Mestne vrednosti", "Place value", (t) => {
  const digits = t === 1 ? 3 : t === 2 ? 4 : 6;
  let n = R(10 ** (digits - 1), 10 ** digits - 1);
  const s = String(n);
  const i = R(1, digits - 2);
  const pv = 10 ** (digits - 1 - i), dgt = Number(s[i]);
  const parts = s.split("").map((c, j) => (j === i ? "?" : c) + "·" + 10 ** (digits - 1 - j));
  return num(`${n} = ${parts.slice(0, 4).join(" + ")}${digits > 4 ? "…" : ""}`.replace(/·1(?=\s|…|$)/g, ""), dgt, [Number(s[i + 1]), Number(s[i - 1]), dgt * pv]);
});

// ===== CELA ŠTEVILA IN DELJIVOST =====
def("neg_add", "nt", 7, "Seštevanje celih števil", "Adding integers", (t) => {
  const m = [10, 20, 60][t - 1];
  const a = R0(-m, m), b = R0(-m, m);
  if (t === 3) {
    const c = R0(-m, m);
    return num(`${fmt(a)} ${M} (${fmt(b)}) + ${par(fmt(c))}`, a - b + c, [a + b + c, -(a - b + c)]);
  }
  return num(`${fmt(a)} + ${par(fmt(b))}`, a + b, [a - b, -a - b, Math.abs(a) + Math.abs(b)]);
});
def("neg_mul", "nt", 7, "Množenje in deljenje celih števil", "Multiplying integers", (t) => {
  const a = R0(-9, 9), b = R0(-9, 9);
  if (t === 1) return num(`${fmt(a)} · ${par(fmt(b))}`, a * b, [-a * b]);
  if (t === 2) return num(`${fmt(a * b)} : ${par(fmt(b))}`, a, [-a, b]);
  const c = R0(-5, 5);
  return num(`${fmt(a)} · ${par(fmt(b))} · ${par(fmt(c))}`, a * b * c, [-a * b * c, a * b + c]);
});
def("abs", "nt", 7, "Absolutna vrednost", "Absolute value", (t) => {
  const a = R0(-20, 20), b = R0(-20, 20);
  if (t === 1) return num(`|${fmt(a)}|`, Math.abs(a), [-Math.abs(a), a === Math.abs(a) ? -a : a]);
  if (t === 2) return num(`|${fmt(a)}| + |${fmt(b)}|`, Math.abs(a) + Math.abs(b), [Math.abs(a + b), a + b]);
  return num(`|${fmt(a)} ${M} ${par(fmt(b))}| ${M} |${fmt(b)}|`, Math.abs(a - b) - Math.abs(b), [Math.abs(a) - Math.abs(b) - Math.abs(b), a - b - b]);
});
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};
def("prime", "nt", 6, "Praštevila", "Prime numbers", (t) => {
  const max = [30, 60, 120][t - 1];
  let p;
  do p = R(2, max); while (!isPrime(p));
  const fake = () => {
    let c;
    do c = R(4, max); while (isPrime(c) || (t > 1 && c % 2 === 0 && Math.random() < 0.7));
    return fmt(c);
  };
  return mk(w("prime"), fmt(p), [fake(), fake(), fake()], fake);
});
def("gcd", "nt", 6, "Največji skupni delitelj", "Greatest common divisor", (t) => {
  const g = R(2, t === 1 ? 6 : 15), a = g * R(2, t === 3 ? 12 : 6);
  let b;
  do b = g * R(2, t === 3 ? 12 : 6); while (b === a);
  const G = gcd(a, b);
  const lbl = LANG === "sl" ? "D" : "gcd";
  return num(`${lbl}(${a}, ${b})`, G, [lcm(a, b), G * 2, G / 2 === Math.round(G / 2) ? G / 2 : G + 1, Math.min(a, b)]);
});
def("lcm", "nt", 6, "Najmanjši skupni večkratnik", "Least common multiple", (t) => {
  const a = R(2, t === 1 ? 8 : t === 2 ? 15 : 30);
  let b;
  do b = R(2, t === 1 ? 8 : t === 2 ? 15 : 30); while (b === a);
  const L = lcm(a, b);
  const lbl = LANG === "sl" ? "v" : "lcm";
  return num(`${lbl}(${a}, ${b})`, L, [a * b === L ? L * 2 : a * b, gcd(a, b), L + a]);
});
def("divrule", "nt", 6, "Pravila deljivosti", "Divisibility rules", (t) => {
  const d = pick(t === 1 ? [2, 5, 10] : t === 2 ? [3, 4, 9] : [6, 8, 11, 12]);
  const max = t === 3 ? 9999 : 999;
  const good = d * R(Math.ceil(100 / d), Math.floor(max / d));
  const bad = () => {
    let x;
    do x = R(100, max); while (x % d === 0);
    return fmt(x);
  };
  return mk(w("divBy", { n: d }), fmt(good), [bad(), bad(), bad()], bad);
});
const factorize = (n) => {
  const f = [];
  for (let p = 2; n > 1; p++) {
    let e = 0;
    while (n % p === 0) {
      n /= p;
      e++;
    }
    if (e) f.push([p, e]);
  }
  return f;
};
const fstr = (f) => f.map(([p, e]) => (e > 1 ? p + sup(e) : String(p))).join(" · ");
def("factor", "nt", 7, "Razcep na prafaktorje", "Prime factorisation", (t) => {
  const ps = t === 1 ? [2, 3, 5] : [2, 3, 5, 7];
  let n = 1;
  const k = t === 1 ? 3 : t === 2 ? 4 : 5;
  for (let i = 0; i < k; i++) n *= pick(ps);
  if (t === 3) n *= pick([1, 11, 13]);
  const f = factorize(n);
  const wr = [];
  const f1 = f.map(([p, e], i) => [p, i === 0 ? e + 1 : e]);
  wr.push(fstr(f1));
  if (f.some(([, e]) => e > 1)) wr.push(fstr(f.map(([p, e]) => [p, e > 1 ? e - 1 : e])));
  const extra = [3, 7, 11, 13, 17].filter((p) => !f.some(([q]) => q === p));
  wr.push(fstr([...f, [pick(extra), 1]].sort((a, b) => a[0] - b[0])));
  return mk(`${n} = ?`, fstr(f), wr, () => fstr(f.map(([p, e]) => [p, Math.max(1, e + R(-1, 1))])));
});

// ===== ULOMKI, DECIMALNA ŠTEVILA, ODSTOTKI =====
def("frac_simplify", "fr", 6, "Krajšanje ulomkov", "Simplifying fractions", (t) => {
  let n, d;
  do {
    d = R(2, t === 1 ? 6 : 12);
    n = R(1, d - 1);
  } while (gcd(n, d) !== 1);
  const k = R(2, t === 3 ? 12 : 5);
  return frc(`${n * k}/${d * k} = ?`, n, d, [`${n * k}/${d}`, fr(n + 1, d), `${n}/${d * k}`, fr(d, n)]);
});
def("frac_add", "fr", 6, "Seštevanje in odštevanje ulomkov", "Adding fractions", (t) => {
  const d1 = R(2, 9), d2 = t === 1 ? d1 : R(2, 9);
  const n1 = R(1, d1 + (t === 3 ? 3 : -1)), n2 = R(1, d2 - (t === 1 ? 0 : 1) || 1);
  const minus = t > 1 && Math.random() < 0.5;
  const n = minus ? n1 * d2 - n2 * d1 : n1 * d2 + n2 * d1;
  return frc(`${n1}/${d1} ${minus ? M : "+"} ${n2}/${d2}`, n, d1 * d2, [
    `${minus ? n1 - n2 : n1 + n2}/${d1 + d2}`.replace("-", M),
    fr(minus ? n1 - n2 : n1 + n2, d1 * d2),
    fr(minus ? n + 2 : n - 1, d1 * d2),
  ]);
});
def("frac_mul", "fr", 7, "Množenje in deljenje ulomkov", "Multiplying fractions", (t) => {
  const a = R(1, 9), b = R(2, 9), c = R(1, 9), d = R(2, 9);
  if (t === 1) return frc(`${a}/${b} · ${c}/${d}`, a * c, b * d, [fr(a * d, b * c), fr(a + c, b + d), fr(a * c, b + d)]);
  if (t === 2) return frc(`${a}/${b} : ${c}/${d}`, a * d, b * c, [fr(a * c, b * d), fr(b * c, a * d), fr(a * d + 1, b * c)]);
  const k = R(2, 6);
  return frc(`${k} · ${a}/${b} : ${c}/${d}`, k * a * d, b * c, [fr(k * a * c, b * d), fr(a * d, k * b * c), fr(k * a * d, b)]);
});
def("frac_mixed", "fr", 6, "Mešana števila", "Mixed numbers", (t) => {
  const d = R(2, t === 1 ? 5 : 12), n = R(1, d - 1), whole = R(1, t === 3 ? 12 : 5);
  if (t < 3 || Math.random() < 0.5) return num(`${whole} ${n}/${d} = ?/${d}`, whole * d + n, [whole * n + d, whole + n, whole * d - n]);
  const top = whole * d + n;
  const mixed = (a, b) => `${a} ${b}/${d}`;
  return mk(`${top}/${d} = ?`, mixed(whole, n), [mixed(n, whole <= d ? whole : 1), mixed(whole + 1, n), mixed(whole, d - n)], () => mixed(whole + R(-2, 2), R(1, d - 1)));
});
def("frac_compare", "fr", 6, "Primerjanje ulomkov", "Comparing fractions", (t) => {
  const fs = [];
  while (fs.length < 4) {
    const d = R(2, t === 1 ? 6 : 12), n = R(1, t === 3 ? d + 2 : d - 1);
    if (!fs.some(([a, b]) => a * d === n * b)) fs.push([n, d]);
  }
  const big = Math.random() < 0.6;
  const best = fs.reduce((x, y) => ((big ? y[0] / y[1] > x[0] / x[1] : y[0] / y[1] < x[0] / x[1]) ? y : x));
  const s = (f) => `${f[0]}/${f[1]}`;
  return mk(w(big ? "largest" : "smallest"), s(best), fs.filter((f) => f !== best).map(s), () => null);
});
def("dec_add", "fr", 6, "Seštevanje decimalnih števil", "Adding decimals", (t) => {
  const p = t === 1 ? 10 : 100;
  const a = R(1, t === 3 ? 9999 : 99) / p, b = R(1, t === 3 ? 999 : 99) / (t === 3 ? 10 : p);
  const minus = t > 1 && a > b && Math.random() < 0.5;
  const r = minus ? a - b : a + b;
  return num(`${fmt(a)} ${minus ? M : "+"} ${fmt(b)}`, r, [r * 10, r / 10, r + 1 / p], 1 / p);
});
def("dec_mul", "fr", 6, "Množenje in deljenje decimalnih števil", "Multiplying decimals", (t) => {
  if (t === 1) {
    const a = R(11, 999) / 100, k = pick([10, 100, 1000]);
    return Math.random() < 0.5 ? num(`${fmt(a)} · ${k}`, a * k, [a * k * 10, a * k / 10, a + k]) : num(`${fmt(a)} : ${k}`, a / k, [a / k / 10, a / k * 10, a * k]);
  }
  const a = R(2, 9) / 10, b = R(2, 30) / 10;
  if (t === 2) return num(`${fmt(a)} · ${fmt(b)}`, a * b, [a * b * 10, a * b / 10]);
  const q = R(2, 12), d = R(2, 9) / 10;
  return num(`${fmt(q * d)} : ${fmt(d)}`, q, [q / 10, q * 10, q * d * d]);
});
def("frac_dec", "fr", 6, "Ulomki in decimalna števila", "Fractions and decimals", (t) => {
  const opts = t === 1 ? [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [1, 10], [7, 10]] : t === 2 ? [[3, 8], [1, 8], [7, 20], [9, 25], [3, 50], [5, 4]] : [[1, 3], [2, 3], [1, 6], [5, 6], [1, 9], [7, 8], [11, 20]];
  const [n, d] = pick(opts);
  const v = n / d;
  const show = (x) => (Math.abs(x * 1e4 - Math.round(x * 1e4)) > 1e-9 ? fmt(Math.floor(x * 1000) / 1000) + "…" : fmt(x));
  if (Math.random() < 0.5 || d % 3 === 0 || d === 9 || d === 6) return mk(`${n}/${d} = ?`, show(v), [show(d / n / 10), show(n / 10 + d / 100), `${fmt(n)}${DEC}${d}`, show(v * 10)], () => show(v + R(1, 9) / 100));
  return frc(`${fmt(v)} = ?`, n, d, [fr(n, d * 10), fr(n + 1, d), fr(d, n)]);
});
def("pct_of", "fr", 7, "Odstotek od količine", "Percentage of an amount", (t) => {
  const p = t === 1 ? pick([10, 20, 25, 50, 75]) : R(1, 19) * 5;
  const base = t === 3 ? R(2, 80) * 10 : R(1, 20) * 20;
  const r = (p * base) / 100;
  if (!Number.isInteger(r * 10)) return num(`10 % · 50`, 5, [50, 0.5]);
  return num(`${p} % · ${base}`, r, [r * 10, base - r, p + base, r / 10]);
});
def("pct_change", "fr", 8, "Povečanje in zmanjšanje za odstotek", "Percentage change", (t) => {
  const p = t === 1 ? pick([10, 20, 50]) : R(1, 15) * 5;
  const base = R(2, 40) * 20;
  const up = Math.random() < 0.5;
  const r = (base * (100 + (up ? p : -p))) / 100;
  if (t === 3) {
    // nazaj na prvotno ceno
    const orig = R(4, 40) * 10, pp = pick([10, 20, 25, 50]);
    const now = (orig * (100 + pp)) / 100;
    return num(`? + ${pp} % = ${fmt(now)}`, orig, [now * (1 - pp / 100), now - pp], 10);
  }
  return num(`${base} ${up ? "+" : M} ${p} %`, r, [base + (up ? p : -p), (base * p) / 100, (base * (100 + (up ? -p : p))) / 100], 10);
});
def("pct_find", "fr", 8, "Koliko odstotkov", "Finding the percentage", (t) => {
  const base = pick(t === 1 ? [10, 20, 50, 100, 200] : [40, 60, 80, 120, 150, 250, 400]);
  const p = t === 1 ? R(1, 9) * 10 : R(1, 19) * 5;
  const part = (base * p) / 100;
  if (!Number.isInteger(part)) return num(`10 / 50 = ? %`, 20, [5, 2]);
  return mk(`${fmt(part)} / ${base} = ? %`, `${p} %`, [`${fmt(part)} %`, `${fmt(Math.round((base / part) * 10) / 10)} %`, `${p + 10} %`], () => `${p + R(-4, 4) * 5} %`);
});
def("ratio", "fr", 7, "Razmerja", "Ratios", (t) => {
  const a = R(1, 9), b = R(1, 9), k = R(2, t === 3 ? 12 : 6);
  if (t === 1) return num(`${a} : ${b} = ${a * k} : ?`, b * k, [b + k, a * k, b * k + 1]);
  if (t === 2) return num(`? : ${b * k} = ${a} : ${b}`, a * k, [a + k, b * a, a * k + b]);
  const g = gcd(a, b);
  return mk(`${a * k} : ${b * k} = ?`, `${a / g} : ${b / g}`, [`${b / g} : ${a / g}`, `${a} : ${b * k}`, `${a / g + 1} : ${b / g}`], () => `${R(1, 9)} : ${R(1, 9)}`);
});
def("prop", "fr", 7, "Premo in obratno sorazmerje", "Direct and inverse proportion", (t) => {
  const x1 = R(2, 9), k = R(2, 9);
  let x2;
  do x2 = R(2, 12); while (x2 === x1);
  if (t === 1 || (t === 3 && Math.random() < 0.5)) return num(`y = k·x: ${pt(x1, k * x1)}, (${x2}, ?)`, k * x2, [(k * x1 * x1) / x2, k * x1 + x2 - x1, k + x2]);
  const prod = x1 * k * x2;
  return num(`x·y = k: ${pt(x1, k * x2)}, (${x2}, ?)`, k * x1, [k * x2 * x2 / x1, k * x2 + x2 - x1, prod]);
});

// ===== POTENCE IN KORENI =====
def("square", "pw", 7, "Kvadrati", "Squares", (t) => {
  const a = t === 1 ? R(2, 10) : t === 2 ? R(11, 20) : R(21, 30) * pick([1, -1]);
  const s = t === 3 && a < 0 ? `(${fmt(a)})${sup(2)}` : `${fmt(a)}${sup(2)}`;
  return num(s, a * a, [2 * a, -a * a, a * a + a, (a + 1) * (a + 1)]);
});
def("cube", "pw", 8, "Kubi in višje potence", "Cubes and powers", (t) => {
  const a = t === 1 ? R(2, 5) : R(2, 10) * (t === 3 ? pick([1, -1]) : 1);
  if (t === 2 && Math.random() < 0.5) {
    const n = R(4, 10);
    return num(`2${sup(n)}`, 2 ** n, [2 * n, 2 ** (n - 1), n * n]);
  }
  return num(`${par(fmt(a))}${sup(3)}`, a ** 3, [3 * a, a * a, -(a ** 3)]);
});
def("sqrt", "pw", 7, "Kvadratni in kubični koren", "Square and cube roots", (t) => {
  if (t === 3 && Math.random() < 0.5) {
    const a = R(2, 10) * pick([1, -1]);
    return num(`∛${par(fmt(a ** 3))}`, a, [-a, a * a, Math.round(a ** 3 / 3)]);
  }
  const a = t === 1 ? R(1, 10) : R(11, 25);
  return num(`√${a * a}`, a, [(a * a) / 2, a + 1, a - 1, a * 2]);
});
def("pow_rules", "pw", 8, "Pravila za računanje s potencami", "Laws of exponents", (t) => {
  const b = pick(["a", "x", "2", "3", "y"]), m = R(2, 9), n = R(2, 9);
  const P = (e) => `${b}${sup(e)}`;
  if (t === 1) return mk(`${P(m)} · ${P(n)}`, P(m + n), [P(m * n), `${b === "2" || b === "3" ? Number(b) * 2 : "2" + b}${sup(m + n)}`, P(Math.abs(m - n))], () => P(R(2, 20)));
  if (t === 2) {
    const [hi, lo] = m === n ? [m + n, n] : [Math.max(m, n), Math.min(m, n)];
    return mk(`${P(hi)} : ${P(lo)}`, P(hi - lo), [P(hi + lo), P(Math.round(hi / lo) || 1) === P(hi - lo) ? P(hi * lo) : P(Math.round(hi / lo)), P(hi * lo)], () => P(R(1, 20)));
  }
  return mk(`(${P(m)})${sup(n)}`, P(m * n), [P(m + n), P(m ** n > 99 ? m * n + 1 : m ** n), `${b}${sup(m)}${sup(n)}`], () => P(R(2, 81)));
});
def("neg_exp", "pw", 9, "Negativni eksponenti", "Negative exponents", (t) => {
  const b = R(2, t === 1 ? 5 : 10), e = t === 1 ? 1 : R(1, t === 2 ? 2 : 3);
  if (t === 3 && Math.random() < 0.5) {
    const n = R(1, 4), d = R(2, 5);
    if (gcd(n, d) === 1) return frc(`(${n}/${d})${sup(-2)}`, d * d, n * n, [fr(n * n, d * d), fr(-d * d, n * n), fr(2 * d, n)]);
  }
  return frc(`${b}${sup(-e)}`, 1, b ** e, [fmt(-(b ** e)), fr(-1, b ** e), fmt(b ** e), fr(1, b * e)]);
});
def("sci", "pw", 8, "Znanstveni zapis", "Scientific notation", (t) => {
  const m = R(11, 99) / 10, e = t === 3 ? R(-6, -1) : R(2, t === 1 ? 5 : 9);
  const n = m * 10 ** e;
  const shown = e < 0 ? n.toFixed(-e + 1).replace(".", DEC) : fmt(n);
  return num(`${shown} = ${fmt(m)} · 10^?`, e, [e + 1, e - 1, -e]);
});
def("roots_rules", "pw", 9, "Računanje s koreni", "Simplifying roots", (t) => {
  const k = R(2, t === 1 ? 4 : 9);
  const r = pick([2, 3, 5, 6, 7]);
  const s = (a, b) => (a === 1 ? `√${b}` : `${a}√${b}`);
  if (t === 3) {
    const a = R(1, 5), b = R(1, 5);
    return mk(`√${a * a * r} + √${b * b * r}`, s(a + b, r), [s(1, (a + b) * (a + b) * r) === s(a + b, r) ? s(a * b, r) : `√${(a * a + b * b) * r}`, s(a * b, r), s(a + b, 2 * r)], () => s(R(2, 12), r));
  }
  return mk(`√${k * k * r}`, s(k, r), [s(r, k * k), s(k * k, r), s(k, r * 2)], () => s(R(2, 12), r));
});

// ===== ALGEBRA =====
def("like_terms", "al", 7, "Združevanje podobnih členov", "Collecting like terms", (t) => {
  const a = R0(-9, 9), b = R0(-9, 9), c = R0(-9, 9), d = R0(-9, 9);
  if (t === 1) return mk(`${poly([a, 0])} + ${par(poly([b, 0]))}`, poly([a + b, 0]), [poly([a * b, 0]), poly([a + b, 0], "x²"), poly([a - b, 0])], () => poly([R0(-18, 18), 0]));
  if (t === 2) return mk(`${poly([a, c])} + ${par(poly([b, d]))}`, poly([a + b, c + d]), [poly([a + b + c + d, 0]), poly([a + b, c - d]), poly([a - b, c + d])], () => poly([R0(-18, 18), R(-18, 18)]));
  return mk(`${poly([a, b, 0])} ${M} (${poly([c, d, 0])})`, poly([a - c, b - d, 0]), [poly([a + c, b + d, 0]), poly([a - c, b + d, 0]), poly([a - c + b - d, 0])], () => poly([R0(-18, 18), R0(-18, 18), 0]));
});
def("expand", "al", 8, "Odpravljanje oklepajev", "Expanding brackets", (t) => {
  const k = R0(-9, 9), a = R0(-9, 9), b = R0(-9, 9);
  if (t === 1) return mk(`${fmt(k)}(${lin(1, a)})`, lin(k, k * a), [lin(k, a), lin(1, k * a), lin(k, -k * a)], () => lin(k, R(-40, 40)));
  if (t === 2) return mk(`(${lin(1, a)})(${lin(1, b)})`, poly([1, a + b, a * b]), [poly([1, 0, a * b]), poly([1, a * b, a + b]), poly([1, a + b, -a * b])], () => poly([1, R(-15, 15), R(-40, 40)]));
  const c = R0(-5, 5), d = R0(-5, 5);
  return mk(`(${lin(c, a)})(${lin(d, b)})`, poly([c * d, c * b + a * d, a * b]), [poly([c * d, 0, a * b]), poly([c * d, c * b - a * d, a * b]), poly([c + d, c * b + a * d, a * b])], () => poly([c * d, R(-40, 40), a * b]));
});
def("binom", "al", 8, "Kvadrat dvočlenika in razlika kvadratov", "Squares of binomials", (t) => {
  const a = R0(-9, 9), k = t === 3 ? R(2, 5) : 1;
  if (t === 2 && Math.random() < 0.5) {
    const b = R(1, 9);
    return mk(`(x + ${b})(x ${M} ${b})`, poly([1, 0, -b * b]), [poly([1, 0, b * b]), poly([1, -2 * b, -b * b]), poly([1, 2 * b, -b * b])], () => poly([1, 0, -R(1, 99)]));
  }
  return mk(`(${lin(k, a)})${sup(2)}`, poly([k * k, 2 * k * a, a * a]), [poly([k * k, 0, a * a]), poly([k * k, k * a, a * a]), poly([k, 2 * k * a, a * a])], () => poly([k * k, R(-40, 40), a * a]));
});
def("factor_alg", "al", 9, "Razstavljanje izrazov", "Factorising", (t) => {
  const p = R0(-9, 9);
  let q = R0(-9, 9);
  if (q === -p) q = p === 9 ? 8 : -p + 1 || 2;
  const f = (a) => `(${lin(1, a)})`;
  if (t === 1) {
    const k = R(2, 9), b = R0(-9, 9);
    return mk(poly([k, k * b]), `${k}${f(b)}`, [`${k}${f(k * b)}`, `x${f(k * b)}`, `${k}${f(-b)}`], () => `${R(2, 9)}${f(R0(-9, 9))}`);
  }
  if (t === 2) {
    const b = R(1, 12);
    return mk(poly([1, 0, -b * b]), `${f(-b)}${f(b)}`, [`${f(-b)}${f(-b)}`, `${f(b)}${f(b)}`, `${f(-b * b)}${f(1)}`], () => `${f(R0(-12, 12))}${f(R0(-12, 12))}`);
  }
  return mk(poly([1, p + q, p * q]), `${f(Math.min(p, q))}${f(Math.max(p, q))}`, [`${f(-p)}${f(-q)}`, `${f(p + q)}${f(1)}`, `${f(p * q)}${f(1)}`, `${f(-Math.min(p, q))}${f(Math.max(p, q))}`], () => `${f(R0(-9, 9))}${f(R0(-9, 9))}`);
});
def("evaluate", "al", 7, "Vrednost izraza", "Evaluating expressions", (t) => {
  const x = R0(t === 1 ? 1 : -5, 5), a = R0(-6, 6), b = R(-9, 9);
  if (t === 1) return num(`${lin(a, b)}, x = ${fmt(x)}`, a * x + b, [a + x + b, a * x - b]);
  const c = R0(-3, 3);
  return num(`${poly([c, a, b])}, x = ${fmt(x)}`, c * x * x + a * x + b, [-c * x * x + a * x + b, c * 2 * x + a * x + b]);
});
def("rational", "al", 10, "Krajšanje racionalnih izrazov", "Simplifying rational expressions", (t) => {
  const a = R(1, 9), b = R0(-9, 9);
  if (t === 1) return mk(`(${poly([1, 0, -a * a])}) / (${lin(1, -a)})`, lin(1, a), [lin(1, -a), poly([1, 0, -a]), lin(1, a * a)], () => lin(1, R0(-12, 12)));
  if (t === 2) return mk(`(${poly([1, a + b, a * b])}) / (${lin(1, a)})`, lin(1, b), [lin(1, -b), lin(1, a + b), lin(1, a * b)], () => lin(1, R0(-12, 12)));
  return mk(`(${poly([1, 2 * a, a * a])}) / (${poly([1, 0, -a * a])})`, `(${lin(1, a)}) / (${lin(1, -a)})`, [`(${lin(1, -a)}) / (${lin(1, a)})`, `${lin(1, a)}`, `1 / (${lin(1, -a)})`], () => `(${lin(1, R(1, 9))}) / (${lin(1, -R(1, 9))})`);
});

// ===== ENAČBE IN NEENAČBE =====
const xs = (v) => `x = ${fmt(v)}`;
function xeq(q, x, ws) {
  return mk(q, xs(x), ws.filter(Number.isInteger).map(xs), () => xs(x + R0(-6, 6)));
}
def("lin1", "eq", 7, "Preproste enačbe", "One-step equations", (t) => {
  const x = R(t === 3 ? -12 : 1, 12), a = R0(t === 1 ? 1 : -9, 9);
  if (t === 1) return xeq(`x + ${Math.abs(a)} = ${x + Math.abs(a)}`, x, [x + 2 * Math.abs(a), x + Math.abs(a)]);
  return xeq(`${fmt(a)}x = ${fmt(a * x)}`, x, [a * x * a, -x, a * x - a]);
});
def("lin2", "eq", 8, "Linearne enačbe", "Linear equations", (t) => {
  const x = R(-9, 9), a = R0(-9, 9), b = R0(-15, 15);
  if (t === 1) return xeq(`${lin(a, b)} = ${fmt(a * x + b)}`, x, [(a * x + 2 * b) / a, -x, a * x + b - b * 2]);
  let c;
  do c = R0(-9, 9); while (c === a);
  const d = a * x + b - c * x;
  if (t === 2) return xeq(`${lin(a, b)} = ${lin(c, d)}`, x, [-x, x + 1, (d + b) / (a - c) || x + 2]);
  const k = R(2, 5), m = R0(-6, 6);
  const rhs = k * (x + m) - x;
  return xeq(`${k}(${lin(1, m)}) = ${lin(1, rhs)}`, x, [(rhs - m) / (k - 1), (rhs - k * m) / (k + 1), -x]);
});
def("lin_frac", "eq", 9, "Enačbe z ulomki", "Equations with fractions", (t) => {
  const d = R(2, 6), x = d * R(-6, 6), b = R(-9, 9);
  if (t === 1) return xeq(`x/${d} = ${fmt(x / d)}`, x, [x / d / d, x / d + d, -x]);
  if (t === 2) return xeq(`x/${d} ${b < 0 ? M : "+"} ${Math.abs(b)} = ${fmt(x / d + b)}`, x, [x / d, x + b * d * 2, x / d + b]);
  const e = R(2, 6), y = d * e * R(-3, 3);
  return xeq(`x/${d} + x/${e} = ${fr(y * (d + e), d * e)}`, y, [y * 2, y / 2, -y]);
});
def("ineq", "eq", 9, "Linearne neenačbe", "Linear inequalities", (t) => {
  const x = R(-9, 9), a = R0(t === 1 ? 1 : -6, 6), b = R(-12, 12);
  const op = pick(["<", ">", "≤", "≥"]);
  const flip = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" };
  const sol = a > 0 ? op : flip[op];
  const s = (o, v) => `x ${o} ${fmt(v)}`;
  return mk(`${lin(a, b)} ${op} ${fmt(a * x + b)}`, s(sol, x), [s(flip[sol], x), s(sol, -x), s(sol, x + 1)], () => s(sol, x + R0(-5, 5)));
});
def("system", "eq", 9, "Sistemi linearnih enačb", "Simultaneous equations", (t) => {
  const x = R(-6, 6), y = R(-6, 6);
  let a = 1, b = 1, c = 1, d = -1;
  if (t >= 2) [a, b, c, d] = [R0(-4, 4), 1, 1, R0(-4, 4)];
  if (t === 3) [a, b, c, d] = [R(2, 5), R(2, 5), R(2, 5), -R(2, 5)];
  if (a * d - b * c === 0) d += 1;
  const e1 = `${poly([a, 0])} ${b < 0 ? M : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}y = ${fmt(a * x + b * y)}`;
  const e2 = `${poly([c, 0])} ${d < 0 ? M : "+"} ${Math.abs(d) === 1 ? "" : Math.abs(d)}y = ${fmt(c * x + d * y)}`;
  return mk(`${e1}; ${e2}`, pt(x, y), [pt(y, x), pt(-x, y), pt(x, -y)], () => pt(x + R0(-3, 3), y + R(-3, 3)));
});
def("quad", "eq", 10, "Kvadratne enačbe", "Quadratic equations", (t) => {
  if (t === 1) {
    const r = R(1, 12);
    return mk(`x${sup(2)} = ${r * r}`, set([-r, r]), [set([r]), set([r * r, -r * r]), set([r / 2 === Math.round(r / 2) ? r / 2 : r + 1, -r])], () => set([R(1, 15), -R(1, 15)]));
  }
  const p = R(-9, 9), q = R(-9, 9);
  if (p === q) return mk(`(${lin(1, -p)})${sup(2)} = 0`, set([p]), [set([-p]), set([p, -p]), set([p * p])], () => set([R(-9, 9)]));
  if (t === 2) return mk(`(${lin(1, -p)})(${lin(1, -q)}) = 0`, set([p, q]), [set([-p, -q]), set([p, -q]), set([p * q, p + q])], () => set([R(-9, 9), R(-9, 9)]));
  return mk(`${poly([1, -(p + q), p * q])} = 0`, set([p, q]), [set([-p, -q]), set([p + q, p * q]), set([-p, q])], () => set([R(-9, 9), R(-9, 9)]));
});
def("discr", "eq", 10, "Diskriminanta", "Discriminant", (t) => {
  const a = t === 1 ? 1 : R0(-4, 4), b = R(-9, 9), c = R(-9, 9);
  const D = b * b - 4 * a * c;
  return num(`D: ${poly([a, b, c])} = 0`, D, [b * b + 4 * a * c, b - 4 * a * c, -D, b * b - 2 * a * c]);
});
def("vieta", "eq", 10, "Vietovi pravili", "Vieta's formulas", (t) => {
  const a = t === 3 ? R(2, 4) : 1, b = R0(-12, 12), c = R0(-12, 12);
  const s = Math.random() < 0.5;
  const q = `${poly([a, b, c])} = 0: x${sub(1)} ${s ? "+" : "·"} x${sub(2)}`;
  return s ? frc(q, -b, a, [fr(b, a), fr(c, a), fr(-c, a)]) : frc(q, c, a, [fr(-c, a), fr(-b, a), fr(b, a)]);
});
def("abs_eq", "eq", 10, "Enačbe z absolutno vrednostjo", "Absolute value equations", (t) => {
  const a = R(-9, 9), r = R(1, 9);
  if (t === 1) return mk(`|x| = ${r}`, set([-r, r]), [set([r]), set([-r]), set([0, r])], () => set([R(-9, 9), R(-9, 9)]));
  const k = t === 3 ? R(2, 3) : 1;
  const sols = [(a + r) / k, (a - r) / k];
  if (sols.some((v) => !Number.isInteger(v))) return mk(`|x ${M} ${Math.abs(a)}| = ${r}`.replace(`${M} ${Math.abs(a)}`, a < 0 ? `+ ${-a}` : `${M} ${a}`), set([a + r, a - r]), [set([r - a, -r - a]), set([a + r]), set([a + r, r - a])], () => set([R(-15, 15), R(-15, 15)]));
  return mk(`|${lin(k, -a)}| = ${r}`, set(sols), [set(sols.map((v) => -v)), set([sols[0]]), set([(r - a) / k, (-r - a) / k].map((v) => Math.round(v * 100) / 100))], () => set([R(-15, 15), R(-15, 15)]));
});
def("exp_eq", "eq", 11, "Eksponentne enačbe", "Exponential equations", (t) => {
  const b = pick([2, 3, 5]);
  const pw = (e) => (e >= 0 ? fmt(b ** e) : `1/${b ** -e}`);
  if (t === 1) {
    const e = R(1, b === 2 ? 7 : 4);
    return xeq(`${b}ˣ = ${b ** e}`, e, [b ** e / b, e + 1, e - 1]);
  }
  if (t === 2) {
    const x = R(-3, 4), k = R0(-3, 3);
    return xeq(`${b}^(x ${k < 0 ? M : "+"} ${Math.abs(k)}) = ${pw(x + k)}`, x, [x + 2 * k, x + k, -x]);
  }
  const x = R(-2, 3), e = 2 * x - 1;
  return xeq(`${b}^(2x ${M} 1) = ${pw(e)}`, x, [e, x + 1, (e - 1) / 2 === x ? -x : (e - 1) / 2]);
});
def("log_eq", "eq", 11, "Logaritemske enačbe", "Logarithmic equations", (t) => {
  const b = pick([2, 3, 10]), e = R(1, b === 2 ? 6 : 3);
  if (t === 1) return xeq(`log${sub(b)} x = ${e}`, b ** e, [b * e, e ** b, b ** e + 1]);
  const k = R(1, 9);
  return xeq(`log${sub(b)} (x + ${k}) = ${e}`, b ** e - k, [b ** e + k, b * e - k, b ** e]);
});

// ===== FUNKCIJE =====
def("fval", "fn", 8, "Vrednost funkcije", "Function values", (t) => {
  const a = R0(-5, 5), b = R(-9, 9), x = R(-5, 5);
  if (t === 1) return num(`f(x) = ${lin(a, b)}; f(${fmt(x)})`, a * x + b, [a + x + b, a * x - b, -(a * x + b)]);
  const c = R0(-3, 3);
  if (t === 2) return num(`f(x) = ${poly([c, a, b])}; f(${fmt(x)})`, c * x * x + a * x + b, [c * -x * -x * (x < 0 ? -1 : 1) + a * x + b, c * 2 * x + a * x + b]);
  const k = R(1, 3);
  return num(`f(x) = ${poly([c, a, b])}; f(${fmt(x)} + ${k})`, c * (x + k) ** 2 + a * (x + k) + b, [c * x * x + a * x + b + k, c * (x * x + k * k) + a * (x + k) + b]);
});
def("slope", "fn", 9, "Naklon premice", "Slope of a line", (t) => {
  const x1 = R(-5, 5), y1 = R(-5, 5), dx = R0(-4, 4) * (t === 1 ? 1 : 1);
  const k = t === 1 ? R0(-4, 4) : R0(-9, 9) / (t === 3 ? R(1, 3) : 1);
  const kk = t === 3 ? R0(-6, 6) : k;
  const dd = t === 3 ? R(2, 4) : 1;
  const x2 = x1 + dx * dd, y2 = y1 + kk * dx;
  return frc(`${w("slope")}: ${pt(x1, y1)}, ${pt(x2, y2)}`, y2 - y1, x2 - x1, [fr(x2 - x1, y2 - y1), fr(y2 + y1, x2 + x1 || 1), fr(y1 - y2, x2 - x1)]);
});
def("intercept", "fn", 9, "Ničla in začetna vrednost", "Zero and intercept", (t) => {
  const a = R0(-6, 6), x0 = R(-8, 8);
  const b = -a * x0;
  if (t === 1) return num(`f(x) = ${lin(a, b)}; f(0)`, b, [x0, -b, a]);
  if (t === 2) return xeq(`f(x) = ${lin(a, b)}; ${w("zero")}`, x0, [-x0, b, b / -a === x0 ? a : b]);
  let d = R(2, 4), n = R0(-9, 9);
  if (n % d === 0) n += 1;
  return mk(`f(x) = ${lin(d, n)}; ${w("zero")}`, `x = ${fr(-n, d)}`, [`x = ${fr(n, d)}`, `x = ${fr(-d, n)}`, `x = ${fmt(-n)}`], () => `x = ${fr(R0(-9, 9), d)}`);
});
def("line_eq", "fn", 9, "Enačba premice", "Equation of a line", (t) => {
  const k = R0(-5, 5), n = R(-9, 9), x1 = R(-4, 4), x2 = x1 + R(1, 4);
  const ln = (a, b) => `y = ${lin(a, b)}`;
  if (t === 1) return mk(`k = ${fmt(k)}, n = ${fmt(n)}`.replace("k =", LANG === "sl" ? "k =" : "m =").replace("n =", LANG === "sl" ? "n =" : "c ="), ln(k, n), [ln(n, k), ln(k, -n), ln(-k, n)], () => ln(R0(-5, 5), R(-9, 9)));
  if (t === 2) return mk(`k = ${fmt(k)}, ${pt(x1, k * x1 + n)}`.replace("k =", LANG === "sl" ? "k =" : "m ="), ln(k, n), [ln(k, k * x1 + n), ln(k, -n), ln(-k, n + 2 * k * x1)], () => ln(k, R(-12, 12)));
  return mk(`${pt(x1, k * x1 + n)}, ${pt(x2, k * x2 + n)}`, ln(k, n), [ln(-k, n), ln(k, -n), ln(n, k)], () => ln(R0(-5, 5), R(-9, 9)));
});
def("quad_vertex", "fn", 10, "Teme parabole", "Vertex of a parabola", (t) => {
  const p = R(-6, 6), q = R(-9, 9), a = t === 1 ? 1 : R0(-3, 3);
  if (t === 1) return mk(`y = ${p ? `(${lin(1, -p)})` : "x"}${sup(2)}${q ? ` ${q < 0 ? M : "+"} ${Math.abs(q)}` : ""}: ${w("vertex")}`, pt(p, q), [pt(-p, q), pt(q, p), pt(p, -q)], () => pt(R(-6, 6), R(-9, 9)));
  return mk(`y = ${poly([a, -2 * a * p, a * p * p + q])}: ${w("vertex")}`, pt(p, q), [pt(-p, q), pt(p, a * p * p + q), pt(-2 * a * p, q)], () => pt(R(-6, 6), R(-9, 9)));
});
def("quad_zero", "fn", 10, "Ničle kvadratne funkcije", "Zeros of a quadratic", (t) => {
  const p = R(-8, 8);
  let q = R(-8, 8);
  if (q === p) q = p + 1;
  const a = t === 3 ? R0(-3, 3) : 1;
  // ničla 0 da faktor x (ne »(x)«), ki stoji spredaj
  const fac = [p, q].sort((u, v) => (u === 0 ? -1 : v === 0 ? 1 : 0)).map((z) => (z ? `(${lin(1, -z)})` : "x")).join("");
  if (t === 1) return mk(`f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}${fac}: ${w("zeros")}`, set([p, q]), [set([-p, -q]), set([p, -q]), set([p * q])], () => set([R(-8, 8), R(-8, 8)]));
  return mk(`f(x) = ${poly([a, -a * (p + q), a * p * q])}: ${w("zeros")}`, set([p, q]), [set([-p, -q]), set([p + q, p * q]), set([a, p * q])], () => set([R(-8, 8), R(-8, 8)]));
});
def("compose", "fn", 11, "Sestavljanje funkcij", "Composite functions", (t) => {
  const a = R0(-4, 4), b = R(-5, 5), c = R0(-3, 3), d = R(-5, 5), x = R(-3, 3);
  const f = (v) => a * v + b, g = (v) => c * v + d;
  if (t < 3) return num(`f(x) = ${lin(a, b)}, g(x) = ${lin(c, d)}; f(g(${fmt(x)}))`, f(g(x)), [g(f(x)), f(x) + g(x), f(x) * g(x)]);
  return mk(`f(x) = ${lin(a, b)}, g(x) = ${lin(c, d)}; (f∘g)(x)`, lin(a * c, a * d + b), [lin(a * c, c * b + d), lin(a + c, b + d), lin(a * c, b * d)], () => lin(a * c, R(-20, 20)));
});
def("inverse", "fn", 11, "Inverzna funkcija", "Inverse functions", (t) => {
  const a = R(2, 6) * pick([1, -1]), b = R0(-9, 9);
  const x = R(-5, 5);
  if (t < 3) return num(`f(x) = ${lin(a, b)}; f${sup(-1)}(${fmt(a * x + b)})`, x, [a * (a * x + b) + b, -x, a * x + b - b]);
  const bs = b < 0 ? `+ ${-b}` : `${M} ${b}`;
  return mk(`f(x) = ${lin(a, b)}; f${sup(-1)}(x)`, `(x ${bs}) / ${fmt(a)}`, [`(x ${b < 0 ? `${M} ${-b}` : `+ ${b}`}) / ${fmt(a)}`, `${fmt(a)}x ${bs}`, `1 / (${lin(a, b)})`], () => null);
});
def("log_val", "fn", 11, "Logaritmi", "Logarithms", (t) => {
  const b = pick([2, 3, 5, 10]), e = R(t === 1 ? 0 : -3, b === 2 ? 8 : 4);
  const arg = e >= 0 ? fmt(b ** e) : `1/${b ** -e}`;
  if (t === 3 && Math.random() < 0.5) {
    const k = R(1, 9);
    return num(`ln e${sup(k)}`, k, [Math.round(Math.E * k), 1, 0]);
  }
  return num(`log${sub(b)} ${arg}`, e, [e >= 0 ? b ** e / b : -1 / e, -e, e + 1]);
});
def("log_rules", "fn", 11, "Pravila za logaritme", "Laws of logarithms", (t) => {
  const b = pick([2, 3]), m = R(1, 4), n = R(1, 4);
  if (t === 1) return num(`log${sub(b)} ${b ** m} + log${sub(b)} ${b ** n}`, m + n, [m * n, b ** (m + n), m - n]);
  if (t === 2) return num(`log${sub(b)} ${b ** (m + n)} ${M} log${sub(b)} ${b ** n}`, m, [m + 2 * n, (m + n) / n, n]);
  const k = R(2, 5);
  return num(`log${sub(b)} ${b ** m}${sup(k)}`, k * m, [m ** k, k + m, b ** m * k]);
});
def("domain", "fn", 10, "Definicijsko območje", "Domain of a function", (t) => {
  const a = R0(-9, 9);
  const as = a < 0 ? `+ ${-a}` : `${M} ${a}`;
  const iv = (l, x, r) => `${l}${x}${r}`;
  if (t === 1) return mk(`f(x) = √(x ${as})`, iv("[", `${fmt(a)}, ∞`, ")"), [iv("(", `${fmt(a)}, ∞`, ")"), iv("[", `${fmt(-a)}, ∞`, ")"), iv("(−∞, ", fmt(a), "]"), iv("(", `${fmt(a)}, ∞`, ")") === iv("[", `${fmt(-a)}, ∞`, ")") ? "ℝ" : "ℝ"], () => null);
  if (t === 2) return mk(`f(x) = ln(x ${as})`, iv("(", `${fmt(a)}, ∞`, ")"), [iv("[", `${fmt(a)}, ∞`, ")"), iv("(", `${fmt(-a)}, ∞`, ")"), "ℝ", iv("(−∞, ", fmt(a), ")")], () => null);
  return mk(`f(x) = 1 / (x ${as})`, `ℝ \\ {${fmt(a)}}`, [`ℝ \\ {${fmt(-a)}}`, `(${fmt(a)}, ∞)`, "ℝ", `ℝ \\ {0}`], () => null);
});

// ===== GEOMETRIJA =====
def("angles_tri", "ge", 6, "Koti v trikotniku", "Angles in a triangle", (t) => {
  const a = R(20, 100), b = R(15, 160 - a);
  if (t === 3) {
    const g = R(40, 140);
    return num(`△: α = β, γ = ${deg(g)}; α = ?°`, (180 - g) / 2, [180 - g, 90 - g / 4, g / 2]);
  }
  return num(`△: ${deg(a)}, ${deg(b)}, ?°`, 180 - a - b, [360 - a - b, 90 - (a + b) / 2, a + b]);
});
def("angles_lines", "ge", 6, "Sokoti, sovršni in sosednji koti", "Angles on lines", (t) => {
  const a = R(15, 165);
  if (t === 1) return num(`α + β = 180°, α = ${deg(a)}; β = ?°`, 180 - a, [90 - a, a, 360 - a]);
  if (t === 2) {
    const b = R(10, 80);
    return num(`α + β = 90°, α = ${deg(b)}; β = ?°`, 90 - b, [180 - b, b, 45]);
  }
  const b = R(20, 340 - a);
  return num(`α + β + γ = 360°, α = ${deg(a)}, β = ${deg(b)}; γ = ?°`, 360 - a - b, [180 - a - b, a + b, 360 - a]);
});
def("polygon_angle", "ge", 8, "Koti v mnogokotniku", "Angles in polygons", (t) => {
  const n = pick([3, 4, 5, 6, 8, 9, 10, 12]);
  if (t === 1) return num(`n = ${n}: Σ = ?°`, (n - 2) * 180, [n * 180, (n - 1) * 180, 360]);
  if (t === 2) return num(`${n}-${w("sides")}: ${w("inner")} = ?°`, ((n - 2) * 180) / n, [360 / n, (n * 180) / n, 180 - 360 / n + 10]);
  return Math.random() < 0.5 ? num(`${n}-${w("sides")}: ${w("outer")} = ?°`, 360 / n, [((n - 2) * 180) / n, 180 / n, 360 / (n - 1)]) : num(`${n}-${w("sides")}: ${w("diag")}`, (n * (n - 3)) / 2, [n * (n - 3), n - 3, (n * (n - 1)) / 2]);
});
def("perimeter", "ge", 5, "Obseg likov", "Perimeter", (t) => {
  const a = R(2, 20), b = R(2, 20), c = R(2, 20);
  if (t === 1) return num(`${w("perim")}: □ a = ${a}`, 4 * a, [a * a, 2 * a, 3 * a]);
  if (t === 2) return num(`${w("perim")}: ▭ ${a} × ${b}`, 2 * (a + b), [a * b, a + b, 2 * a + b]);
  const s = Math.max(a, b, c) * 2 < a + b + c ? [a, b, c] : [5, 6, 7];
  return num(`${w("perim")}: △ ${s.join(", ")}`, s[0] + s[1] + s[2], [s[0] * s[1] / 2, (s[0] + s[1] + s[2]) / 2, s[0] * s[1] * s[2] > 999 ? s[0] + s[1] : s[0] * s[1] * s[2]]);
});
def("area", "ge", 6, "Ploščina likov", "Area of shapes", (t) => {
  const a = R(2, 15), b = R(2, 15), h = R(2, 12);
  const H = LANG === "sl" ? "v" : "h";
  if (t === 1) return num(`${w("area")}: ▭ ${a} × ${b}`, a * b, [2 * (a + b), a + b, a * b * 2]);
  if (t === 2) {
    const aa = 2 * a;
    return pick([
      () => num(`${w("area")}: △ a = ${aa}, ${H} = ${h}`, (aa * h) / 2, [aa * h, aa + h, aa * h / 4]),
      () => num(`${w("area")}: ▱ a = ${a}, ${H} = ${h}`, a * h, [(a * h) / 2, 2 * (a + h), a + h]),
    ])();
  }
  const c = a + 2 * R(1, 4);
  return num(`${w("area")}: ⏢ a = ${c}, c = ${a}, ${H} = ${h}`, ((a + c) * h) / 2, [(a + c) * h, c * h, a * c * h / 2]);
});
def("circle", "ge", 8, "Krog: obseg in ploščina", "Circles", (t) => {
  const r = R(1, 12);
  const pi = (k) => (k === 1 ? "π" : `${fmt(k)}π`);
  if (t === 1) return mk(`${w("perim")}: ○ r = ${r}`, pi(2 * r), [pi(r * r), pi(r), pi(4 * r)], () => pi(R(1, 30)));
  if (t === 2) return mk(`${w("area")}: ○ r = ${r}`, pi(r * r), [pi(2 * r), pi(r * r * 2), pi(r)].filter((x) => x !== pi(r * r)), () => pi(R(1, 150)));
  const d = 2 * r;
  return mk(`${w("area")}: ○ d = ${d}`, pi(r * r), [pi(d * d), pi(d), pi(2 * d)], () => pi(R(1, 150)));
});
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
def("pyth", "ge", 8, "Pitagorov izrek", "Pythagoras' theorem", (t) => {
  const k = t === 1 ? 1 : R(1, 3);
  const [a, b, c] = pick(TRIPLES).map((x) => x * k);
  if (t === 1) return num(`a = ${a}, b = ${b}, c = ?`, c, [a + b, a * a + b * b, Math.abs(b - a)]);
  if (t === 2) return num(`a = ${a}, c = ${c}, b = ?`, b, [c - a, Math.round(Math.sqrt(a * a + c * c)), c + a]);
  const x = R(1, 6), y = R(1, 6);
  const s = x * x + y * y;
  const r = Math.sqrt(s);
  const root = (n) => (Math.sqrt(n) % 1 === 0 ? fmt(Math.sqrt(n)) : `√${n}`);
  return mk(`a = ${x}, b = ${y}, c = ?`, root(s), [root(x + y), root(Math.abs(x * x - y * y) || 2), fmt(x + y)], () => root(R(2, 80)));
});
def("volume", "ge", 8, "Prostornina teles", "Volume", (t) => {
  const a = R(2, 10), b = R(2, 10), c = R(2, 10), r = R(1, 6), h = R(2, 12);
  if (t === 1) return num(`${w("volume")}: ⬛ a = ${a}`, a ** 3, [6 * a * a, 3 * a, a * a]);
  if (t === 2) return num(`${w("volume")}: ${a} × ${b} × ${c}`, a * b * c, [2 * (a * b + b * c + a * c), a + b + c, a * b]);
  const pi = (k) => (k === 1 ? "π" : `${fmt(k)}π`);
  return Math.random() < 0.5
    ? mk(`${w("volume")}: ⌭ r = ${r}, ${LANG === "sl" ? "v" : "h"} = ${h}`, pi(r * r * h), [pi(2 * r * h), pi(r * h), pi((r * r * h) / 3) === pi(r * r * h) ? pi(r * r) : pi(Math.round((r * r * h) / 3))], () => pi(R(1, 400)))
    : mk(`${w("volume")}: ◬ r = ${r}, ${LANG === "sl" ? "v" : "h"} = ${3 * h}`, pi(r * r * h), [pi(3 * r * r * h), pi(r * 3 * h), pi(2 * r * 3 * h)], () => pi(R(1, 400)));
});
def("surface", "ge", 9, "Površina teles", "Surface area", (t) => {
  const a = R(2, 10), b = R(2, 10), c = R(2, 10);
  if (t === 1) return num(`${w("surface")}: ⬛ a = ${a}`, 6 * a * a, [a ** 3, 4 * a * a, 12 * a]);
  if (t === 2) return num(`${w("surface")}: ${a} × ${b} × ${c}`, 2 * (a * b + b * c + a * c), [a * b * c, a * b + b * c + a * c, 4 * (a + b + c)]);
  const r = R(1, 6);
  return mk(`${w("surface")}: ● r = ${r}`, `${fmt(4 * r * r)}π`, [`${fr(4 * r ** 3, 3).replace(/^(.+\/.+)$/, "($1)")}π`, `${fmt(2 * r * r)}π`, `${fmt(4 * r)}π`], () => `${R(2, 150)}π`);
});
def("similar", "ge", 9, "Podobnost likov", "Similar shapes", (t) => {
  const k = R(2, 5), a = R(2, 9), b = R(2, 9);
  if (t === 1) return num(`a = ${a} → a′ = ${a * k}; b = ${b} → b′ = ?`, b * k, [b + (a * k - a), b * a, b * k + 1]);
  if (t === 2) return num(`${w("scale")} ${k}: P = ${a * b} → P′ = ?`, a * b * k * k, [a * b * k, a * b * 2 * k, a * b + k]);
  return num(`${w("scale")} ${k}: V = ${a} → V′ = ?`, a * k ** 3, [a * k * k, a * k, a * 3 * k]);
});
def("coord_dist", "ge", 9, "Razdalja med točkama", "Distance between points", (t) => {
  const [p, q] = pick(TRIPLES.slice(0, 4));
  const x1 = R(-5, 5), y1 = R(-5, 5);
  const s = pick([1, -1]), u = pick([1, -1]);
  if (t === 1) {
    const d = R(1, 9);
    return num(`${w("dist")}: ${pt(x1, y1)}, ${pt(x1 + d, y1)}`, d, [x1 + d, d * d, Math.abs(2 * x1 + d)]);
  }
  if (t === 2) return num(`${w("dist")}: ${pt(x1, y1)}, ${pt(x1 + s * p, y1 + u * q)}`, Math.hypot(p, q), [p + q, p * p + q * q, Math.abs(p - q)]);
  const dx = R(1, 5), dy = R(1, 5);
  const n = dx * dx + dy * dy;
  const root = Math.sqrt(n) % 1 === 0 ? fmt(Math.sqrt(n)) : `√${n}`;
  return mk(`${w("dist")}: ${pt(x1, y1)}, ${pt(x1 + dx, y1 - dy)}`, root, [`√${dx + dy}`, fmt(dx + dy), `√${Math.abs(dx * dx - dy * dy) || 3}`], () => `√${R(2, 60)}`);
});
def("midpoint", "ge", 9, "Razpolovišče daljice", "Midpoint", (t) => {
  const x1 = R(-9, 9), y1 = R(-9, 9), x2 = x1 + 2 * R(-5, 5), y2 = y1 + 2 * R(-5, 5);
  if (t < 3) return mk(`${w("mid")}: ${pt(x1, y1)}, ${pt(x2, y2)}`, pt((x1 + x2) / 2, (y1 + y2) / 2), [pt(x2 - x1, y2 - y1), pt(x1 + x2, y1 + y2), pt((x2 - x1) / 2, (y2 - y1) / 2)], () => pt(R(-9, 9), R(-9, 9)));
  return mk(`${w("mid")} ${pt((x1 + x2) / 2, (y1 + y2) / 2)}, A = ${pt(x1, y1)}; B = ?`, pt(x2, y2), [pt((x1 + x2) / 2 - x1, (y1 + y2) / 2 - y1), pt(-x2, -y2), pt(x1 + x2, y1 + y2)], () => pt(R(-9, 9), R(-9, 9)));
});
def("units", "ge", 5, "Pretvarjanje enot", "Unit conversion", (t) => {
  const L = [["km", 1000], ["m", 1], ["dm", 0.1], ["cm", 0.01], ["mm", 0.001]];
  const i = R(0, 3), j = R(i + 1, Math.min(4, i + 2));
  const [u1, f1] = L[i], [u2, f2] = L[j];
  const p = t === 1 ? 1 : t === 2 ? 2 : 3;
  const v = t === 1 ? R(1, 9) : R(11, 99) / 10;
  const r = (v * (f1 / f2) ** p);
  const u = (s) => (p === 1 ? s : s + sup(p));
  if (Math.random() < 0.5) return num(`${fmt(v)} ${u(u1)} = ? ${u(u2)}`, r, [v * (f1 / f2) * (p > 1 ? 10 : 10), v * (f1 / f2) ** p / 10, v * (f1 / f2) ** p * 10].map((x) => Math.round(x * 1e6) / 1e6));
  return num(`${fmt(r)} ${u(u2)} = ? ${u(u1)}`, v, [v * 10, v / 10, r * 10]);
});

// ===== TRIGONOMETRIJA =====
const S = { 0: "0", 30: "1/2", 45: "√2/2", 60: "√3/2", 90: "1" };
const TN = { 0: "0", 30: "√3/3", 45: "1", 60: "√3" };
function trigVal(fn, d) {
  d = ((d % 360) + 360) % 360;
  const q = Math.floor(d / 90);
  const r = [d, 180 - d, d - 180, 360 - d][q > 3 ? 3 : q];
  const ref = d % 90 === 0 ? (d / 90) % 2 === 0 ? 0 : 90 : r;
  const sin = Math.sin((d * Math.PI) / 180), cos = Math.cos((d * Math.PI) / 180);
  const sign = (v) => (Math.abs(v) < 1e-9 ? "" : v < 0 ? M : "");
  if (fn === "sin") return sign(sin) + (d % 180 === 0 ? "0" : S[d % 90 === 0 ? 90 : ref]);
  if (fn === "cos") return sign(cos) + ((d + 90) % 180 === 0 ? "0" : S[d % 90 === 0 ? 90 : 90 - ref] ?? S[ref]);
  if (Math.abs(cos) < 1e-9) return null;
  const tv = sin / cos;
  return sign(tv) + (d % 180 === 0 ? "0" : TN[ref]);
}
const ALL_TRIG = ["0", "1/2", "√2/2", "√3/2", "1", "√3/3", "√3", "−1/2", "−√2/2", "−√3/2", "−1", "−√3"];
const RAD = { 30: "π/6", 45: "π/4", 60: "π/3", 90: "π/2", 120: "2π/3", 135: "3π/4", 150: "5π/6", 180: "π", 210: "7π/6", 225: "5π/4", 240: "4π/3", 270: "3π/2", 300: "5π/3", 315: "7π/4", 330: "11π/6", 360: "2π" };
def("trig_right", "tr", 9, "Kotne funkcije v pravokotnem trikotniku", "Right-angled trigonometry", (t) => {
  const k = t === 3 ? R(2, 3) : 1;
  const [a, b, c] = pick(TRIPLES.slice(0, 4)).map((x) => x * k);
  const fn = pick(t === 1 ? ["sin", "cos"] : ["sin", "cos", "tan"]);
  const n = fn === "sin" ? a : fn === "cos" ? b : a, d = fn === "tan" ? b : c;
  return frc(`a = ${a}, b = ${b}, c = ${c}; ${fn} α`, n, d, [fr(d, n), fr(fn === "sin" ? b : a, fn === "tan" ? a : c), fr(fn === "tan" ? a : b, fn === "tan" ? c : a)]);
});
def("trig_values", "tr", 10, "Vrednosti kotnih funkcij", "Exact trig values", (t) => {
  const d = pick(t === 1 ? [30, 45, 60] : [0, 30, 45, 60, 90]);
  const fn = pick(t === 1 ? ["sin", "cos"] : ["sin", "cos", "tan"]);
  const v = trigVal(fn, d);
  if (v == null) return mk(`sin 30°`, "1/2", ["√3/2", "√2/2", "1"], () => null);
  return mk(`${fn} ${deg(d)}`, v, ALL_TRIG.filter((x) => !x.startsWith(M) && x !== v).sort(() => Math.random() - 0.5), () => null);
});
def("radians", "tr", 10, "Stopinje in radiani", "Degrees and radians", (t) => {
  const keys = Object.keys(RAD).map(Number).filter((d) => (t === 1 ? d <= 180 && d % 30 === 0 && d % 90 !== 30 : true));
  const d = pick(keys.length ? keys : [90, 180]);
  const others = Object.entries(RAD).filter(([k]) => Number(k) !== d);
  if (Math.random() < 0.5) return mk(`${deg(d)} = ? rad`, RAD[d], shuffle(others).map(([, v]) => v), () => null);
  return mk(`${RAD[d]} = ?°`, deg(d), shuffle(others).map(([k]) => deg(Number(k))), () => null);
});
def("trig_unit", "tr", 11, "Enotska krožnica", "The unit circle", (t) => {
  const ds = [120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  const d = pick(ds), fn = pick(t === 1 ? ["sin", "cos"] : ["sin", "cos", "tan"]);
  const v = trigVal(fn, d);
  if (v == null) return mk(`cos ${t === 3 ? RAD[d] : deg(d)}`, trigVal("cos", d), ALL_TRIG.filter((x) => x !== trigVal("cos", d)).sort(() => Math.random() - 0.5), () => null);
  const flip = v.startsWith(M) ? v.slice(1) : v === "0" ? "1" : M + v;
  return mk(`${fn} ${t === 3 ? RAD[d] : deg(d)}`, v, [flip, ...shuffle(ALL_TRIG.filter((x) => x !== v && x !== flip))], () => null);
});
def("trig_eq", "tr", 11, "Trigonometrijske enačbe", "Trigonometric equations", (t) => {
  const cases = [
    ["sin x = 1/2", "{π/6; 5π/6}", ["{π/6; 7π/6}", "{π/3; 2π/3}", "{π/6}"]],
    ["sin x = √3/2", "{π/3; 2π/3}", ["{π/6; 5π/6}", "{π/3; 4π/3}", "{π/3}"]],
    ["cos x = 1/2", "{π/3; 5π/3}", ["{π/3; 2π/3}", "{π/6; 11π/6}", "{π/3}"]],
    ["cos x = 0", "{π/2; 3π/2}", ["{0; π}", "{π/2}", "{π}"]],
    ["sin x = −1", "{3π/2}", ["{π/2}", "{π}", "{π; 3π/2}"]],
    ["tan x = 1", "{π/4; 5π/4}", ["{π/4; 3π/4}", "{π/4}", "{3π/4; 7π/4}"]],
    ["cos x = −√2/2", "{3π/4; 5π/4}", ["{π/4; 7π/4}", "{3π/4; 7π/4}", "{5π/4}"]],
    ["sin x = 0", "{0; π}", ["{π/2; 3π/2}", "{0}", "{π}"]],
    ["tan x = √3", "{π/3; 4π/3}", ["{π/6; 7π/6}", "{π/3; 2π/3}", "{π/3}"]],
  ];
  const [q, a, ws] = pick(t === 1 ? cases.slice(0, 4) : cases);
  return mk(`${q}, x ∈ [0, 2π)`.replace("−", M), a, ws, () => null);
});
def("trig_id", "tr", 11, "Zveze med kotnimi funkcijami", "Trig identities", (t) => {
  const [a, b, c] = pick(TRIPLES.slice(0, 4));
  if (t === 1) return num(`sin² α + cos² α`, 1, [0, 2, "sin 2α"]);
  if (t === 2) return frc(`sin α = ${a}/${c}, 0° < α < 90°; cos α`, b, c, [fr(c - a, c), fr(a, b), fr(b, a)]);
  return frc(`sin α = ${a}/${c}, cos α = ${b}/${c}; tan α`, a, b, [fr(b, a), fr(a * b, c * c), fr(a, c)]);
});

// ===== ZAPOREDJA =====
def("seq_next", "sq", 5, "Nadaljuj zaporedje", "Number patterns", (t) => {
  const a = R(1, 20), d = R0(-7, 9);
  if (t === 1) return num(`${[0, 1, 2, 3].map((i) => fmt(a + i * d)).join(", ")}, ?`, a + 4 * d, [a + 5 * d, a + 4 * d + 1, a + 3 * d * 2]);
  if (t === 2) {
    const r = R(2, 3);
    return num(`${[0, 1, 2, 3].map((i) => fmt(a * r ** i)).join(", ")}, ?`, a * r ** 4, [a * r ** 3 + a, a * r ** 4 + r, a * r ** 3 * 2 + 1]);
  }
  const x = R(1, 5), y = R(1, 5);
  const s = [x, y];
  while (s.length < 6) s.push(s.at(-1) + s.at(-2));
  return num(`${s.slice(0, 5).join(", ")}, ?`, s[5], [s[4] * 2, s[5] + 1, s[4] + 2]);
});
def("arith", "sq", 11, "Aritmetično zaporedje", "Arithmetic sequences", (t) => {
  const a = R(-9, 9), d = R0(-6, 6), n = R(5, t === 1 ? 10 : 30);
  if (t === 1) return num(`a${sub(1)} = ${fmt(a)}, d = ${fmt(d)}; a${sub(n)}`, a + (n - 1) * d, [a + n * d, a * n + d, (n - 1) * d]);
  if (t === 2) return num(`a${sub(1)} = ${fmt(a)}, a${sub(5)} = ${fmt(a + 4 * d)}; d`, d, [4 * d + a, d * 5 / 4 === Math.round(d * 5 / 4) ? d * 5 / 4 : -d, (a + 4 * d) / 5 === Math.round((a + 4 * d) / 5) ? (a + 4 * d) / 5 : d + 1]);
  return num(`a${sub(3)} = ${fmt(a + 2 * d)}, a${sub(7)} = ${fmt(a + 6 * d)}; a${sub(1)}`, a, [a + 2 * d - d, a + d * 3, -a]);
});
def("geom", "sq", 11, "Geometrijsko zaporedje", "Geometric sequences", (t) => {
  const a = R0(-5, 5), q = pick(t === 1 ? [2, 3] : [-3, -2, 2, 3, 4]), n = R(3, t === 1 ? 5 : 7);
  if (t < 3) return num(`a${sub(1)} = ${fmt(a)}, q = ${fmt(q)}; a${sub(n)}`, a * q ** (n - 1), [a * q ** n, a * q * (n - 1), q ** (n - 1)]);
  return num(`a${sub(2)} = ${fmt(a * q)}, a${sub(4)} = ${fmt(a * q ** 3)}; a${sub(1)} (q > 0)`.replace(" (q > 0)", q > 0 ? " (q > 0)" : " (q < 0)"), a, [a * q, -a, a * q * q]);
});
def("series", "sq", 11, "Vsota členov zaporedja", "Sums of sequences", (t) => {
  if (t === 1) {
    const n = R(5, 20);
    return num(`1 + 2 + … + ${n}`, (n * (n + 1)) / 2, [n * n, n * (n - 1) / 2, (n * (n + 1))]);
  }
  if (t === 2) {
    const a = R(1, 9), d = R(1, 5), n = R(5, 12);
    return num(`a${sub(1)} = ${a}, d = ${d}; S${sub(n)}`, (n * (2 * a + (n - 1) * d)) / 2, [n * (2 * a + (n - 1) * d), a + (n - 1) * d, (n * (a + (n - 1) * d)) / 1]);
  }
  const a = R(1, 5), q = pick([2, 3]), n = R(3, 6);
  return num(`a${sub(1)} = ${a}, q = ${q}; S${sub(n)}`, (a * (q ** n - 1)) / (q - 1), [a * q ** n, a * q ** (n - 1), (a * (q ** n - 1))]);
});
def("geom_inf", "sq", 12, "Geometrijska vrsta", "Geometric series", (t) => {
  const a = R(1, 9) * (t === 3 ? pick([1, -1]) : 1);
  const [qn, qd] = pick(t === 1 ? [[1, 2], [1, 3]] : [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [-1, 2], [-1, 3]]);
  const q = `${qn < 0 ? M : ""}${Math.abs(qn)}/${qd}`;
  return frc(`a${sub(1)} = ${fmt(a)}, q = ${q}; S`, a * qd, qd - qn, [fr(a * qd, qd + qn), fr(a * qn, qd), fr(a, qd - qn)]);
});

// ===== STATISTIKA IN VERJETNOST =====
function dataSet(n, mean, spread) {
  const d = Array.from({ length: n - 1 }, () => mean + R(-spread, spread));
  d.push(mean * n - d.reduce((s, x) => s + x, 0));
  return d;
}
def("mean", "st", 6, "Aritmetična sredina", "Mean", (t) => {
  const n = t === 1 ? 3 : t === 2 ? 5 : 6, m = R(3, t === 3 ? 60 : 20);
  let d = dataSet(n, m, Math.min(m - 1, 6));
  if (t === 3) d = d.map((x) => x + 0); // celo povprečje, več števil
  if (d.some((x) => x < 0)) d = Array(n).fill(m);
  const sorted = [...d].sort((a, b) => a - b);
  return num(`${w("mean")}: ${shuffle(d).join("; ")}`, m, [sorted[Math.floor(n / 2)] === m ? m + 1 : sorted[Math.floor(n / 2)], d.reduce((s, x) => s + x, 0), m * 2 === sorted.at(-1) ? m - 1 : (sorted[0] + sorted.at(-1)) / 2 === m ? m + 2 : (sorted[0] + sorted.at(-1)) / 2]);
});
def("median", "st", 7, "Mediana", "Median", (t) => {
  const n = t === 1 ? 5 : t === 2 ? 7 : 6;
  const d = Array.from({ length: n }, () => R(1, 40));
  const s = [...d].sort((a, b) => a - b);
  const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  return num(`${w("median")}: ${d.join("; ")}`, med, [d[Math.floor(n / 2)], Math.round((d.reduce((a, b) => a + b, 0) / n) * 10) / 10, s[Math.floor(n / 2) + 1]], 0.5);
});
def("mode", "st", 6, "Modus in razpon", "Mode and range", (t) => {
  const d = Array.from({ length: t === 1 ? 5 : 8 }, () => R(1, 15));
  const m = d[0];
  d.push(m, m);
  const data = shuffle(d);
  const cnt = {};
  data.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1));
  const top = Math.max(...Object.values(cnt));
  const modes = Object.keys(cnt).filter((k) => cnt[k] === top);
  if (modes.length === 1 && Math.random() < 0.5) return num(`${w("mode")}: ${data.join("; ")}`, Number(modes[0]), [top, Math.max(...data), data[Math.floor(data.length / 2)]]);
  return num(`${w("range")}: ${data.join("; ")}`, Math.max(...data) - Math.min(...data), [Math.max(...data), Math.max(...data) + Math.min(...data), data.length]);
});
def("prob_basic", "st", 7, "Verjetnost dogodka", "Probability", (t) => {
  if (t === 1) {
    const k = R(1, 5);
    const set6 = shuffle([1, 2, 3, 4, 5, 6]).slice(0, k).sort();
    return frc(`🎲: P(${set6.length === 1 ? set6[0] : "{" + set6.join(", ") + "}"})`, k, 6, [fr(1, k + 1), fr(6 - k, 6), fr(k, 5)]);
  }
  const r = R(1, 9), b = R(1, 9), g = t === 3 ? R(1, 6) : 0;
  const total = r + b + g;
  const label = `🔴×${r} 🔵×${b}${g ? ` 🟢×${g}` : ""}: P(🔴)`;
  return frc(label, r, total, [fr(r, b), fr(b, total), fr(1, total)]);
});
def("prob_two", "st", 9, "Verjetnost dveh dogodkov", "Combined probability", (t) => {
  if (t === 1) {
    const k = R(0, 2);
    const c = [1, 2, 1][k];
    return frc(`🪙🪙: P(${k} × ⊕)`, c, 4, [fr(1, 3), fr(1, 2), fr(c, 3)].filter((x) => x !== fr(c, 4)));
  }
  if (t === 2) {
    const s = R(2, 12);
    const ways = 6 - Math.abs(7 - s);
    return frc(`🎲🎲: P(Σ = ${s})`, ways, 36, [fr(1, 11), fr(ways, 12), fr(1, 6) === fr(ways, 36) ? fr(1, 36) : fr(1, 6)]);
  }
  const r = R(2, 6), b = R(2, 6), n = r + b;
  return frc(`🔴×${r} 🔵×${b}, 2× ${LANG === "sl" ? "brez vračanja" : "no replacement"}: P(🔴🔴)`, r * (r - 1), n * (n - 1), [fr(r * r, n * n), fr(r, n), fr(r * (r - 1), n * n)]);
});
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const C2 = (n, k) => fact(n) / (fact(k) * fact(n - k));
def("factorial", "st", 10, "Permutacije in fakulteta", "Permutations and factorials", (t) => {
  const n = R(3, t === 1 ? 6 : 8);
  if (t === 1) return num(`${n}!`, fact(n), [n * (n - 1), fact(n - 1), n * n]);
  if (t === 2) {
    const k = R(2, 3);
    return num(`${n}! / ${n - k}!`, fact(n) / fact(n - k), [fact(k), n * k, fact(n) / fact(k)]);
  }
  return num(`(${n} + 1)! / ${n}!`, n + 1, [n, fact(n), 1]);
});
def("combin", "st", 11, "Kombinacije", "Combinations", (t) => {
  const n = R(4, t === 1 ? 6 : 10), k = R(2, Math.min(4, n - 1));
  if (t < 3) return num(`C(${n}, ${k})`, C2(n, k), [fact(n) / fact(n - k), n * k, C2(n, k - 1)]);
  return num(`C(${n}, ${k}) + C(${n}, ${k + 1})`, C2(n + 1, k + 1), [C2(n, k) * C2(n, k + 1), C2(n + 1, k), C2(n, k + 2)]);
});
def("expected", "st", 12, "Pričakovana vrednost", "Expected value", (t) => {
  const vals = t === 1 ? [0, 1] : [1, 2, 3];
  let ps = t === 1 ? [R(1, 9), 0] : [R(1, 5), R(1, 4), 0];
  ps[ps.length - 1] = 10 - ps.reduce((a, b) => a + b, 0);
  if (ps.at(-1) <= 0) ps = t === 1 ? [3, 7] : [2, 5, 3];
  const E = vals.reduce((s, v, i) => s + v * ps[i], 0) / 10;
  return num(`X: ${vals.map((v, i) => `${v} (${fmt(ps[i] / 10)})`).join(", ")}; E(X)`, E, [vals.reduce((a, b) => a + b, 0) / vals.length, E * 10, E + 0.5], 0.1);
});

// ===== ANALIZA =====
def("limit_poly", "an", 12, "Limita zvezne funkcije", "Limits of continuous functions", (t) => {
  const a = R(-4, 4), b = R0(-5, 5), c = R(-9, 9), d = R0(-3, 3);
  if (t === 1) return num(`lim x→${fmt(a)} (${lin(b, c)})`, b * a + c, [b + c, c, -(b * a + c)]);
  return num(`lim x→${fmt(a)} (${poly([d, b, c])})`, d * a * a + b * a + c, [b * a + c, d * a + b * a + c, d * a * a]);
});
def("limit_00", "an", 12, "Limite oblike 0/0", "Limits of the form 0/0", (t) => {
  const a = R0(-6, 6);
  if (t === 1) return num(`lim x→${fmt(a)} (${poly([1, 0, -a * a])}) / (${lin(1, -a)})`, 2 * a, [0, a, a * a]);
  const b = R0(-6, 6);
  if (t === 2) return num(`lim x→${fmt(a)} (${poly([1, -(a + b), a * b])}) / (${lin(1, -a)})`, a - b, [a + b, 0, -b]);
  return num(`lim x→${fmt(a)} (${poly([1, 0, 0, -(a ** 3)])}) / (${lin(1, -a)})`, 3 * a * a, [a * a, 3 * a, 0]);
});
def("limit_inf", "an", 12, "Limite v neskončnosti", "Limits at infinity", (t) => {
  const a = R0(-9, 9), b = R0(-9, 9), c = R(-9, 9), d = R(-9, 9);
  if (t === 1) return num(`lim x→∞ ${fmt(Math.abs(a))}/x`, 0, [Math.abs(a), 1, "∞"]);
  if (t === 2) return frc(`lim x→∞ (${lin(a, c)}) / (${lin(b, d)})`, a, b, [fr(c, d || 1), "0", "∞"]);
  return mk(`lim x→∞ (${poly([a, c, 1])}) / (${lin(b, d)})`, (a / b > 0 ? "" : M) + "∞", [fr(a, b), "0", (a / b > 0 ? M : "") + "∞"], () => null);
});
def("limit_special", "an", 12, "Posebne limite", "Special limits", (t) => {
  const k = R(2, 9);
  const cases = [
    [`lim x→0 sin(${k}x) / x`, fmt(k), [fr(1, k), "1", "0"]],
    [`lim x→0 sin x / x`, "1", ["0", "∞", "π"]],
    [`lim x→0 (eˣ ${M} 1) / x`, "1", ["0", "e", "∞"]],
    [`lim x→∞ (1 + 1/x)ˣ`, "e", ["1", "∞", "0"]],
    [`lim x→0 (1 ${M} cos x) / x²`, "1/2", ["0", "1", "2"]],
    [`lim x→∞ (1 + ${k}/x)ˣ`, `e${sup(k)}`, ["e", "1", `${k}e`]],
    [`lim x→0 tan(${k}x) / x`, fmt(k), [fr(1, k), "1", "0"]],
    [`lim x→0 ln(1 + x) / x`, "1", ["0", "e", "∞"]],
  ];
  const [q, a, ws] = pick(t === 1 ? cases.slice(0, 3) : t === 2 ? cases.slice(0, 5) : cases);
  return mk(q, a, ws, () => null);
});
def("der_power", "an", 12, "Odvod potence", "Power rule", (t) => {
  const n = R(2, 9), c = t === 1 ? 1 : R0(-9, 9);
  if (t === 3 && Math.random() < 0.5) {
    const p = pick([[1, 2], [3, 2], [-1, 1], [-2, 1]]);
    if (p[1] === 1) return mk(`(x${sup(p[0])})′`, `${fmt(p[0])}x${sup(p[0] - 1)}`, [`${fmt(p[0])}x${sup(p[0] + 1)}`, `x${sup(p[0] - 1)}`, `${fmt(-p[0])}x${sup(p[0] - 1)}`], () => null);
    return mk(p[0] === 1 ? `(√x)′` : `(x√x)′`, p[0] === 1 ? "1 / (2√x)" : "3√x / 2", p[0] === 1 ? ["2√x", "1 / √x", "√x / 2"] : ["2√x / 3", "√x", "3x / 2"], () => null);
  }
  return mk(`(${poly([c, 0].concat(Array(n - 1).fill(0)))})′`, poly([c * n].concat(Array(n - 1).fill(0))), [poly([c * n].concat(Array(n).fill(0))), poly([c].concat(Array(n - 1).fill(0))), poly([c * (n - 1)].concat(Array(n - 1).fill(0)))], () => poly([c * n + R0(-3, 3)].concat(Array(n - 1).fill(0))));
});
def("der_poly", "an", 12, "Odvod polinoma", "Differentiating polynomials", (t) => {
  const deg3 = t === 3;
  const cs = deg3 ? [R0(-5, 5), R(-9, 9), R(-9, 9), R(-9, 9)] : [R0(-6, 6), R0(-9, 9), R(-9, 9)];
  const n = cs.length - 1;
  const d = cs.slice(0, -1).map((c, i) => c * (n - i));
  const wrong1 = cs.slice(0, -1); // pozabljen eksponent
  const wrong2 = d.map((c, i) => (i === d.length - 1 ? c + cs.at(-1) : c)); // konstanta ostane
  const wrong3 = cs.slice(0, -1).map((c, i) => c * (n - i)).concat([0]); // potenca ostane
  return mk(`(${poly(cs)})′`, poly(d), [poly(wrong1), poly(wrong2), poly(wrong3)], () => poly(d.map((c) => c + R(-2, 2))));
});
def("der_elem", "an", 12, "Odvodi elementarnih funkcij", "Derivatives of elementary functions", (t) => {
  const cases = [
    ["(sin x)′", "cos x", [`${M}cos x`, `${M}sin x`, "sin x"]],
    ["(cos x)′", `${M}sin x`, ["sin x", "cos x", `${M}cos x`]],
    ["(eˣ)′", "eˣ", ["x·eˣ⁻¹", "e", "ln x"]],
    ["(ln x)′", "1/x", ["ln x / x", "eˣ", "x"]],
    ["(tan x)′", "1/cos² x", ["1/sin² x", `${M}1/cos² x`, "cos² x"]],
    ["(2ˣ)′", "2ˣ · ln 2", ["x · 2ˣ⁻¹", "2ˣ", "2ˣ / ln 2"]],
    ["(log₂ x)′", "1 / (x ln 2)", ["ln 2 / x", "1/x", "x ln 2"]],
    ["(arctan x)′", "1 / (1 + x²)", ["1 / √(1 − x²)", "1 / (1 − x²)", `${M}1 / (1 + x²)`]],
    ["(arcsin x)′", "1 / √(1 − x²)", ["1 / (1 + x²)", `${M}1 / √(1 − x²)`, "√(1 − x²)"]],
  ];
  const [q, a, ws] = pick(t === 1 ? cases.slice(0, 4) : t === 2 ? cases.slice(0, 7) : cases);
  return mk(q, a, ws, () => null);
});
def("der_chain", "an", 12, "Odvod sestavljene funkcije", "Chain rule", (t) => {
  const k = R(2, 9), b = R0(-5, 5), n = R(2, 5);
  const cases = [
    [`(sin ${k}x)′`, `${k} cos ${k}x`, [`cos ${k}x`, `${M}${k} cos ${k}x`, `${k} sin ${k}x`]],
    [`(e${sup(k)}ˣ)′`.replace(`${sup(k)}ˣ`, `^(${k}x)`), `${k}e^(${k}x)`, [`e^(${k}x)`, `${k}x·e^(${k}x ${M} 1)`, `e^(${k})`]],
    [`((${lin(1, b)})${sup(n)})′`, `${n}(${lin(1, b)})${sup(n - 1)}`, [`(${lin(1, b)})${sup(n - 1)}`, `${n}(${lin(1, b)})${sup(n)}`, `${n}x${sup(n - 1)}`]],
    [`(ln(${lin(k, b)}))′`, `${k} / (${lin(k, b)})`, [`1 / (${lin(k, b)})`, `${k} ln(${lin(k, b)})`, `1 / ${k}x`]],
    [`(cos(x${sup(2)}))′`, `${M}2x sin(x²)`, ["2x sin(x²)", `${M}sin(x²)`, `${M}2x cos(x²)`]],
    [`(√(${lin(k, b)}))′`, `${k} / (2√(${lin(k, b)}))`, [`1 / (2√(${lin(k, b)}))`, `${k}√(${lin(k, b)})`, `${k} / √(${lin(k, b)})`]],
  ];
  const [q, a, ws] = pick(t === 1 ? cases.slice(0, 2) : t === 2 ? cases.slice(0, 4) : cases);
  return mk(q, a, ws, () => null);
});
def("der_prod", "an", 12, "Odvod produkta in kvocienta", "Product and quotient rules", (t) => {
  const k = R(2, 6);
  const cases = [
    ["(x · eˣ)′", "(x + 1)eˣ", ["eˣ", "x · eˣ", "(x − 1)eˣ"]],
    ["(x · sin x)′", "sin x + x cos x", ["cos x", "x cos x", "sin x − x cos x"]],
    ["(x² · ln x)′", "2x ln x + x", ["2x / x", "2x ln x", "2x + 1/x"]],
    [`(x${sup(k)} · eˣ)′`, `(x${sup(k)} + ${k}x${sup(k - 1)})eˣ`, [`${k}x${sup(k - 1)}eˣ`, `x${sup(k)}eˣ`, `(x${sup(k)} ${M} ${k}x${sup(k - 1)})eˣ`]],
    ["(sin x / x)′", "(x cos x − sin x) / x²", ["cos x", "(sin x − x cos x) / x²", "cos x / x²"]],
    ["(ln x / x)′", "(1 − ln x) / x²", ["1 / x²", "(ln x − 1) / x²", "1/x"]],
    [`(1 / (x + ${k}))′`, `${M}1 / (x + ${k})²`, [`1 / (x + ${k})²`, `ln(x + ${k})`, `${M}1 / (x + ${k})`]],
  ];
  const [q, a, ws] = pick(t === 1 ? cases.slice(0, 2) : t === 2 ? cases.slice(0, 4) : cases);
  return mk(q.replace(/−/g, M), a.replace(/−/g, M), ws.map((x) => x.replace(/−/g, M)), () => null);
});
def("der_value", "an", 12, "Odvod v točki in tangenta", "Derivative at a point", (t) => {
  const a = R0(-3, 3), b = R(-6, 6), c = R(-9, 9), x = R(-3, 3);
  if (t < 3) return num(`f(x) = ${poly([a, b, c])}; f′(${fmt(x)})`, 2 * a * x + b, [a * x * x + b * x + c, a * x + b, 2 * a * x]);
  const d = R0(-2, 2);
  return num(`${w("tangent")}: y = ${poly([d, a, b, c])}, x = ${fmt(x)}`, 3 * d * x * x + 2 * a * x + b, [d * x ** 3 + a * x * x + b * x + c, 3 * d * x + 2 * a + b, 3 * d * x * x + 2 * a * x]);
});
def("extrema", "an", 12, "Ekstremi funkcij", "Extrema", (t) => {
  const p = R(-6, 6), q = R(-9, 9), a = t === 1 ? 1 : pick([1, -1, 2, -2]);
  if (t < 3) {
    const kind = a > 0 ? "min" : "max";
    return mk(`f(x) = ${poly([a, -2 * a * p, a * p * p + q])}: ${w(kind)}`, pt(p, q), [pt(-p, q), pt(p, a * p * p + q), pt(q, p)], () => pt(R(-6, 6), R(-9, 9)));
  }
  const k = R(1, 4);
  return mk(`f(x) = ${poly([1, 0, -3 * k * k, R(-5, 5)])}: x (${w("stat")})`, set([-k, k]), [set([-3 * k * k, 3 * k * k]), set([0, k]), set([-k * k, k * k].map((v) => (k === 1 ? v * 2 : v)))], () => set([R(-9, 9), R(-9, 9)]));
});
def("int_indef", "an", 12, "Nedoločeni integral", "Indefinite integrals", (t) => {
  const n = R(1, 5), c = R(1, 9) * (n + 1);
  const P = (k, e) => (e === 0 ? fmt(k) : `${k === 1 ? "" : fmt(k)}x${e === 1 ? "" : sup(e)}`);
  if (t === 1) return mk(`∫ ${P(c, n)} dx`, `${P(c / (n + 1), n + 1)} + C`, [`${P(c * n, n - 1)} + C`, `${P(c, n + 1)} + C`, `${P(c / n, n + 1)} + C`], () => `${P(c / (n + 1) + R(1, 4), n + 1)} + C`);
  const cases = [
    ["∫ cos x dx", "sin x + C", [`${M}sin x + C`, `${M}cos x + C`, "cos x + C"]],
    ["∫ sin x dx", `${M}cos x + C`, ["cos x + C", "sin x + C", `${M}sin x + C`]],
    ["∫ eˣ dx", "eˣ + C", ["x·eˣ + C", "eˣ⁺¹ / (x + 1) + C", "ln x + C"]],
    ["∫ 1/x dx", "ln|x| + C", ["x⁻² + C", `${M}1/x² + C`, "eˣ + C"]],
    ["∫ 1/cos² x dx", "tan x + C", ["cot x + C", `${M}tan x + C`, "sin x + C"]],
    [`∫ e^(${n + 1}x) dx`, `e^(${n + 1}x) / ${n + 1} + C`, [`${n + 1}e^(${n + 1}x) + C`, `e^(${n + 1}x) + C`, `e^(${n + 2}x) / ${n + 2} + C`]],
    ["∫ 1 / (1 + x²) dx", "arctan x + C", ["ln(1 + x²) + C", "arcsin x + C", `${M}1 / x + C`]],
  ];
  const [q, a, ws] = pick(t === 2 ? cases.slice(0, 4) : cases);
  return mk(q, a, ws, () => null);
});
def("int_def", "an", 12, "Določeni integral", "Definite integrals", (t) => {
  const a = R(0, 2), b = a + R(1, 3), k = R(1, 5);
  if (t === 1) return num(`∫${sub(a)}${sup(b)} ${2 * k}x dx`, k * (b * b - a * a), [2 * k * (b * b - a * a), 2 * k * (b - a), k * (b - a)]);
  if (t === 2) return num(`∫${sub(a)}${sup(b)} ${3 * k}x² dx`, k * (b ** 3 - a ** 3), [3 * k * (b ** 3 - a ** 3), 6 * k * (b - a), k * (b ** 2 - a ** 2)]);
  const cases = [
    ["∫₀^π sin x dx", "2", ["0", "1", "π"]],
    ["∫₀^(π/2) cos x dx", "1", ["0", "π/2", `${M}1`]],
    ["∫₁^e 1/x dx", "1", ["e", "0", "e − 1"]],
    ["∫₀¹ eˣ dx", "e − 1", ["e", "1", "e + 1"]],
    [`∫${sub(-b)}${sup(b)} x³ dx`, "0", [fmt(b ** 4 / 2), fmt(b ** 4), fmt(b ** 4 / 4)]],
  ];
  const [q, ans, ws] = pick(cases);
  return mk(q.replace(/−/g, M), ans.replace(/−/g, M), ws.map((x) => x.replace(/−/g, M)), () => null);
});
def("int_area", "an", 12, "Ploščina pod krivuljo", "Area under a curve", (t) => {
  const b = R(1, 6), k = R(1, 3);
  if (t === 1) return num(`${w("area")}: y = ${2 * k}x, 0 ≤ x ≤ ${b}`, k * b * b, [2 * k * b * b, 2 * k * b, k * b]);
  if (t === 2) return num(`${w("area")}: y = ${3 * k}x², 0 ≤ x ≤ ${b}`, k * b ** 3, [3 * k * b ** 3, 6 * k * b, k * b * b]);
  const r = R(1, 4);
  // med parabolo y = r² − x² in osjo x: 4r³/3
  return frc(`${w("area")}: y = ${r * r} ${M} x², y = 0`, 4 * r ** 3, 3, [fr(2 * r ** 3, 3), fmt(2 * r * r * r), fr(r ** 3, 3)]);
});

// ===== VEKTORJI, MATRIKE, KOMPLEKSNA ŠTEVILA =====
def("vec_add", "la", 10, "Seštevanje vektorjev", "Adding vectors", (t) => {
  const a = [R(-6, 6), R(-6, 6)], b = [R(-6, 6), R(-6, 6)], k = R0(-4, 4);
  if (t === 1) return mk(`${vec(...a)} + ${vec(...b)}`, vec(a[0] + b[0], a[1] + b[1]), [vec(a[0] - b[0], a[1] - b[1]), vec(a[0] * b[0], a[1] * b[1]), vec(a[0] + b[1], a[1] + b[0])], () => vec(R(-12, 12), R(-12, 12)));
  if (t === 2) return mk(`${fmt(k)} · ${vec(...a)}`, vec(k * a[0], k * a[1]), [vec(k * a[0], a[1]), vec(k + a[0], k + a[1]), vec(-k * a[0], -k * a[1])], () => vec(R(-24, 24), R(-24, 24)));
  const c = [R(-6, 6), R(-6, 6), R(-6, 6)], d = [R(-6, 6), R(-6, 6), R(-6, 6)];
  return mk(`${fmt(k)}${vec(...c)} ${M} ${vec(...d)}`, vec(...c.map((x, i) => k * x - d[i])), [vec(...c.map((x, i) => k * x + d[i])), vec(...c.map((x, i) => k * (x - d[i]))), vec(...c.map((x, i) => x - d[i]))], () => vec(R(-20, 20), R(-20, 20), R(-20, 20)));
});
def("vec_len", "la", 10, "Dolžina vektorja", "Length of a vector", (t) => {
  if (t < 3) {
    const [a, b, c] = pick(TRIPLES.slice(0, 4));
    const s1 = pick([1, -1]), s2 = pick([1, -1]);
    return num(`|${vec(s1 * a, s2 * b)}|`, c, [a + b, a * a + b * b, Math.abs(s1 * a + s2 * b)]);
  }
  const v = pick([[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9]]);
  return num(`|${vec(v[0], -v[1], v[2])}|`, v[3], [v[0] + v[1] + v[2], v[3] * v[3], v[0] - v[1] + v[2]]);
});
def("dot", "la", 11, "Skalarni produkt", "Dot product", (t) => {
  const n = t === 3 ? 3 : 2;
  const a = Array.from({ length: n }, () => R(-6, 6)), b = Array.from({ length: n }, () => R(-6, 6));
  const d = a.reduce((s, x, i) => s + x * b[i], 0);
  return num(`${vec(...a)} · ${vec(...b)}`, d, [a.reduce((s, x, i) => s + x + b[i], 0), -d, a[0] * b[0]]);
});
def("cross", "la", 13, "Vektorski produkt", "Cross product", (t) => {
  const a = [R(-4, 4), R(-4, 4), R(-4, 4)], b = [R(-4, 4), R(-4, 4), R(-4, 4)];
  const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  return mk(`${vec(...a)} × ${vec(...b)}`, vec(...c), [vec(...c.map((x) => -x)), vec(a[0] * b[0], a[1] * b[1], a[2] * b[2]), vec(c[0], -c[1], c[2])], () => vec(R(-20, 20), R(-20, 20), R(-20, 20)));
});
const mat = (m) => `(${m.map((r) => r.map(fmt).join("  ")).join("; ")})`;
def("det2", "la", 13, "Determinanta", "Determinants", (t) => {
  const [a, b, c, d] = [R(-6, 6), R(-6, 6), R(-6, 6), R(-6, 6)];
  if (t < 3) return num(`det ${mat([[a, b], [c, d]])}`, a * d - b * c, [a * d + b * c, a * b - c * d, b * c - a * d]);
  const m = [[R(-3, 3), R(-3, 3), R(-3, 3)], [0, R(-3, 3), R(-3, 3)], [0, 0, R(-3, 3)]];
  return num(`det ${mat(m)}`, m[0][0] * m[1][1] * m[2][2], [m[0][0] + m[1][1] + m[2][2], -(m[0][0] * m[1][1] * m[2][2]) || 1, m[0][0] * m[1][1]]);
});
def("mat_mul", "la", 13, "Računanje z matrikami", "Matrix operations", (t) => {
  const A = [[R(-3, 3), R(-3, 3)], [R(-3, 3), R(-3, 3)]], B = [[R(-3, 3), R(-3, 3)], [R(-3, 3), R(-3, 3)]];
  if (t === 1) return mk(`${mat(A)} + ${mat(B)}`, mat(A.map((r, i) => r.map((x, j) => x + B[i][j]))), [mat(A.map((r, i) => r.map((x, j) => x - B[i][j]))), mat(A.map((r, i) => r.map((x, j) => x * B[i][j]))), mat(A.map((r, i) => r.map((x, j) => x + B[j][i])))], () => mat([[R(-6, 6), R(-6, 6)], [R(-6, 6), R(-6, 6)]]));
  const P = [[0, 0], [0, 0]], Q = [[0, 0], [0, 0]];
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) {
    P[i][j] += A[i][k] * B[k][j];
    Q[i][j] += B[i][k] * A[k][j];
  }
  return mk(`${mat(A)} · ${mat(B)}`, mat(P), [mat(Q), mat(A.map((r, i) => r.map((x, j) => x * B[i][j]))), mat(P.map((r) => r.map((x, j) => (j ? x : -x))))], () => mat([[R(-9, 9), R(-9, 9)], [R(-9, 9), R(-9, 9)]]));
});
def("cx_add", "la", 12, "Seštevanje kompleksnih števil", "Adding complex numbers", (t) => {
  const a = R(-9, 9), b = R0(-9, 9), c = R(-9, 9), d = R0(-9, 9);
  const minus = t > 1 && Math.random() < 0.5;
  const k = t === 3 ? R(2, 4) : 1;
  const re = minus ? a - k * c : a + k * c, im = minus ? b - k * d : b + k * d;
  return mk(`(${cx(a, b)}) ${minus ? M : "+"} ${k > 1 ? k : ""}(${cx(c, d)})`, cx(re, im), [cx(minus ? a + k * c : a - k * c, minus ? b + k * d : b - k * d), cx(re + im, 0), cx(im, re)], () => cx(R(-20, 20), R0(-20, 20)));
});
def("cx_mul", "la", 12, "Množenje kompleksnih števil", "Multiplying complex numbers", (t) => {
  const a = R(-5, 5), b = R0(-5, 5), c = R(-5, 5), d = R0(-5, 5);
  if (t === 1) return mk(`i · (${cx(a, b)})`, cx(-b, a), [cx(b, a), cx(-b, -a), cx(a, -b)], () => cx(R(-9, 9), R0(-9, 9)));
  if (t === 2) return mk(`(${cx(a, b)})(${cx(c, d)})`, cx(a * c - b * d, a * d + b * c), [cx(a * c + b * d, a * d + b * c), cx(a * c, b * d), cx(a * c - b * d, a * d - b * c)], () => cx(R(-30, 30), R0(-30, 30)));
  // deljenje z lepim rezultatom: z = p + qi, w = c + di, (z·w)/w
  const p = R(-5, 5), q = R0(-5, 5);
  const num_ = [p * c - q * d, p * d + q * c];
  return mk(`(${cx(num_[0], num_[1])}) / (${cx(c, d)})`, cx(p, q), [cx(p, -q), cx(-p, q), cx(q, p)], () => cx(R(-9, 9), R0(-9, 9)));
});
def("cx_abs", "la", 12, "Absolutna vrednost in konjugirano število", "Modulus and conjugate", (t) => {
  const [a, b, c] = pick(TRIPLES.slice(0, 4));
  const s1 = pick([1, -1]), s2 = pick([1, -1]);
  if (t === 1) return mk(`${LANG === "sl" ? "konj." : "conj."} (${cx(s1 * a, s2 * b)})`, cx(s1 * a, -s2 * b), [cx(-s1 * a, s2 * b), cx(-s1 * a, -s2 * b), cx(s2 * b, s1 * a)], () => null);
  if (t === 2) return num(`|${cx(s1 * a, s2 * b)}|`, c, [a + b, a * a + b * b, Math.abs(s1 * a + s2 * b)]);
  return num(`(${cx(a, b)})(${cx(a, -b)})`, a * a + b * b, [a * a - b * b, c, 2 * a]);
});
def("cx_pow", "la", 12, "Potence števila i", "Powers of i", (t) => {
  const n = t === 1 ? R(2, 4) : R(5, t === 2 ? 30 : 200);
  const r = ["1", "i", `${M}1`, `${M}i`][n % 4];
  return mk(`i${sup(n)}`, r, ["1", "i", `${M}1`, `${M}i`].filter((x) => x !== r), () => null);
});

// Pojmi drugih predmetov: generator dobi še jezik in oblikovalnik števil.
const CTX = { get lang() { return LANG; }, num: (x) => fmt(x) };
const SUBJ_AREAS = [];
for (const [key, pack] of Object.entries(PACKS)) {
  const subject = pack.SUBJECT || key; // npr. mat15.js dopolni matematiko (SUBJECT = "MAT")
  for (const a of pack.AREAS || []) SUBJ_AREAS.push([a[0], a[1], a[2], subject]);
  for (const c of pack.CONCEPTS || []) C.push({ id: c.id, area: c.area, year: c.year, name: c.name, glyph: c.glyph, subject, gen: (tier) => c.gen(tier, CTX) });
}
for (const c of C) c.subject ||= "MAT";
export const CONCEPTS = C;
export const AREAS = [
  ["ar", { sl: "Aritmetika", en: "Arithmetic" }, "#f97316"],
  ["nt", { sl: "Cela števila in deljivost", en: "Integers and divisibility" }, "#ef4444"],
  ["fr", { sl: "Ulomki, decimalna števila, odstotki", en: "Fractions, decimals, percentages" }, "#ec4899"],
  ["pw", { sl: "Potence in koreni", en: "Powers and roots" }, "#a855f7"],
  ["al", { sl: "Algebrski izrazi", en: "Algebraic expressions" }, "#6366f1"],
  ["eq", { sl: "Enačbe in neenačbe", en: "Equations and inequalities" }, "#3b82f6"],
  ["fn", { sl: "Funkcije", en: "Functions" }, "#0ea5e9"],
  ["ge", { sl: "Geometrija", en: "Geometry" }, "#14b8a6"],
  ["tr", { sl: "Trigonometrija", en: "Trigonometry" }, "#22c55e"],
  ["sq", { sl: "Zaporedja in vrste", en: "Sequences and series" }, "#84cc16"],
  ["st", { sl: "Statistika in verjetnost", en: "Statistics and probability" }, "#eab308"],
  ["an", { sl: "Analiza", en: "Calculus" }, "#f59e0b"],
  ["la", { sl: "Vektorji, matrike, kompleksna števila", en: "Vectors, matrices, complex numbers" }, "#d946ef"],
].map((a) => [...a, "MAT"]).concat(SUBJ_AREAS);
export const SUBJECTS = [...new Set(AREAS.map((a) => a[3]))];
export const conceptName = (c) => c.name[LANG] || c.name.en;
export const areaName = (id) => {
  const a = AREAS.find((x) => x[0] === id);
  return a ? a[1][LANG] || a[1].en : id;
};
export const concept = (id) => C.find((c) => c.id === id);

// Ena naloga; ob napaki generatorja (ne bi se smelo zgoditi) varna rezervna naloga.
export function makeQuestion(id, tier = 1) {
  const c = concept(id);
  for (let i = 0; i < 6; i++) {
    try {
      const q = c.gen(Math.max(1, Math.min(3, tier)));
      if (q && q.q && q.a && q.w.length >= 3 && !q.w.includes(q.a)) return q;
    } catch {}
  }
  const a = R(2, 9), b = R(2, 9);
  return num(`${a} + ${b}`, a + b);
}
