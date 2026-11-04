// Dnevna uganka (j, 1. 11. 2026, predaja/igre.md »Odprto delo« 2): ena matematična uganka na dan, enaka za
// vse, v treh stopnjah (Lahko, Srednje, Težko). Uganka nastane iz datuma (UTC) in stopnje, zato jo strežnik
// (server/daily-puzzle.js) izračuna sam in preveri odgovor. Učenec odgovor naredi sam (vtipka število,
// docs/igre-smernice.md §2.1), do 2 namiga (vsak doda čas), po koncu rešitev korak za korakom.
// Modul je čist (brez DOM), da ga uporabljata brskalnik in strežnik ter ga preverijo testi.
// Besedila so ključi i18n (dz.*); računi v korakih so zapisani s simboli, zato jih ni treba prevajati.
import { fmt } from "./topics.js";
import { hash, readTyped } from "./produce.js";

export const LEVELS = ["easy", "medium", "hard"];
export const MAX_HINTS = 2;
export const HINT_MS = 30_000; // kazen za namig
export const WRONG_MS = 10_000; // kazen za napačen odgovor
export const MIN_MS = 3_000; // hitreje uganke ni mogoče prebrati in rešiti

const MINUS = "−";
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n) => String(n).replace(/\d/g, (d) => SUP[d]);
const n_ = (x) => fmt(x);
// »+ 3« / »− 3« za zapis za drugim členom
const pm = (x) => (x < 0 ? `${MINUS} ${n_(-x)}` : `+ ${n_(x)}`);
// koeficient pred x: 1 → x, −1 → −x
const cx = (c) => (c === 1 ? "x" : c === -1 ? `${MINUS}x` : `${n_(c)}x`);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

// Dan kot "YYYY-MM-DD" (UTC); vsi dobijo isto uganko ne glede na časovni pas.
export const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);
export const isDay = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && dayKey(new Date(`${s}T00:00:00Z`)) === s;
export const dayIndex = (day) => Math.floor(Date.parse(`${day}T00:00:00Z`) / 864e5);
export const prevDay = (day) => dayKey(new Date(Date.parse(`${day}T00:00:00Z`) - 864e5));

// Predlagana stopnja po stopnji šolanja: OŠ do 6. razreda Lahko, od 7. Srednje, SŠ Srednje, fakulteta Težko.
export function suggestedLevel(stage, year = 8) {
  if (stage === "faks") return "hard";
  if (stage === "ss") return "medium";
  return year <= 6 ? "easy" : "medium";
}

// Ponovljivo naključje (mulberry32) iz datuma in stopnje.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = (rnd, a, b) => a + Math.floor(rnd() * (b - a + 1));
const H = (key, vars) => ({ key, vars: vars || {} });
const list = (a) => a.map(n_).join(", ");

// ---------- vrste ugank ----------
// Vsaka vrne { kind, q: {key, vars}, show, answer, hints: [2 × {key, vars}], steps: [niz | {key, vars}], x }.
// show: { type: "seq", items } | { type: "eq", text } | { type: "pyr", rows, ask: [vrsta, mesto] } | null

function seq(level, rnd) {
  const v = rnd();
  const mk = (terms, ans, hints, steps, x = "seq") => ({ kind: "seq", q: H("dz.q.seq"), show: { type: "seq", items: terms.map(n_) }, answer: ans, hints, steps, x });
  if (level === "easy") {
    const a = R(rnd, 2, 20), d = R(rnd, 3, 12);
    const t = [0, 1, 2, 3, 4].map((i) => a + i * d);
    return mk(t, a + 5 * d, [H("dz.h.diffs1"), H("dz.h.rule", { rule: `+ ${n_(d)}` })], [`${n_(t[1])} ${MINUS} ${n_(t[0])} = ${n_(d)}`, `${n_(t[2])} ${MINUS} ${n_(t[1])} = ${n_(d)}`, `${n_(t[4])} + ${n_(d)} = ${n_(a + 5 * d)}`]);
  }
  if (level === "medium") {
    if (v < 0.5) {
      // razlike rastejo enakomerno (kvadratno zaporedje)
      const a = R(rnd, 1, 12), d = R(rnd, 1, 6), c = R(rnd, 2, 4);
      const t = [a];
      for (let i = 0; i < 5; i++) t.push(t[i] + d + c * i);
      const diffs = [0, 1, 2, 3].map((i) => d + c * i);
      return mk(t.slice(0, 5), t[5], [H("dz.h.diffs1"), H("dz.h.grow", { list: list(diffs), c: n_(c) })], [`Δ: ${list(diffs)}`, `${n_(diffs[3])} + ${n_(c)} = ${n_(diffs[3] + c)}`, `${n_(t[4])} + ${n_(diffs[3] + c)} = ${n_(t[5])}`]);
    }
    const a = R(rnd, 2, 7), r = R(rnd, 2, 3);
    const t = [0, 1, 2, 3, 4].map((i) => a * r ** i);
    return mk(t, a * r ** 5, [H("dz.h.ratio1"), H("dz.h.rule", { rule: `· ${n_(r)}` })], [`${n_(t[1])} : ${n_(t[0])} = ${n_(r)}`, `${n_(t[2])} : ${n_(t[1])} = ${n_(r)}`, `${n_(t[4])} · ${n_(r)} = ${n_(a * r ** 5)}`]);
  }
  if (v < 0.5) {
    // vsak člen iz dveh prejšnjih
    const [p, q] = [[1, 1], [1, 2], [2, 1]][R(rnd, 0, 2)];
    const t = [R(rnd, 1, 5), R(rnd, 1, 6)];
    for (let i = 2; i < 7; i++) t.push(p * t[i - 1] + q * t[i - 2]);
    const term = (c, s) => (c === 1 ? s : `${n_(c)} · ${s}`);
    const rule = `aₙ = ${term(p, "aₙ₋₁")} + ${term(q, "aₙ₋₂")}`;
    const st = (i) => `${term(p, n_(t[i - 1]))} + ${term(q, n_(t[i - 2]))} = ${n_(t[i])}`;
    return mk(t.slice(0, 6), t[6], [H("dz.h.two"), H("dz.h.rule", { rule })], [rule, st(2), st(3), st(6)]);
  }
  // vsak člen: prejšnji krat p, nato prišteješ q
  const p = R(rnd, 2, 3);
  let q = R(rnd, -5, 5) || 4;
  const t = [R(rnd, Math.abs(q) + 1, 9)];
  for (let i = 1; i < 6; i++) t.push(p * t[i - 1] + q);
  const rule = `aₙ₊₁ = ${n_(p)} · aₙ ${pm(q)}`;
  const st = (i) => `${n_(p)} · ${n_(t[i - 1])} ${pm(q)} = ${n_(t[i])}`;
  return mk(t.slice(0, 5), t[5], [H("dz.h.lin1"), H("dz.h.rule", { rule })], [rule, st(1), st(2), st(5)]);
}

function think(level, rnd) {
  if (level === "easy") {
    const x = R(rnd, 3, 20), m = R(rnd, 2, 9), a = R(rnd, 1, 30), r = m * x + a;
    const eq = `${n_(m)} · x + ${n_(a)} = ${n_(r)}`;
    return { kind: "think", q: H("dz.q.think", { m: n_(m), a: n_(a), r: n_(r) }), show: null, answer: x, hints: [H("dz.h.back"), H("dz.h.eq", { eq })], steps: [eq, `${n_(m)} · x = ${n_(r)} ${MINUS} ${n_(a)} = ${n_(r - a)}`, `x = ${n_(r - a)} : ${n_(m)} = ${n_(x)}`], x: "think" };
  }
  if (level === "medium") {
    const m = R(rnd, 3, 7), k = R(rnd, 2, m - 1), t = R(rnd, 2, 9), x = m * t, a = (m - k) * t;
    const eq = `${n_(m)} · (x ${MINUS} ${n_(a)}) = ${n_(k)} · x`;
    return { kind: "think", q: H("dz.q.think2", { m: n_(m), a: n_(a), k: n_(k) }), show: null, answer: x, hints: [H("dz.h.letX"), H("dz.h.eq", { eq })], steps: [eq, `${cx(m)} ${MINUS} ${n_(m * a)} = ${cx(k)}`, `${cx(m - k)} = ${n_(m * a)}`, `x = ${n_(x)}`], x: "think" };
  }
  const x = R(rnd, 3, 30);
  let y = R(rnd, 3, 29);
  if (y >= x) y++;
  const s = x + y, p = x * y, ans = x * x + y * y;
  return {
    kind: "sumsq", q: H("dz.q.sumsq", { s: n_(s), p: n_(p) }), show: null, answer: ans,
    hints: [H("dz.h.square"), H("dz.h.eq", { eq: `x² + y² = ${n_(s)}² ${MINUS} 2 · ${n_(p)}` })],
    steps: ["(x + y)² = x² + 2xy + y²", `x² + y² = (x + y)² ${MINUS} 2xy`, `${n_(s)}² ${MINUS} 2 · ${n_(p)} = ${n_(s * s)} ${MINUS} ${n_(2 * p)} = ${n_(ans)}`], x: "sumsq",
  };
}

// Piramida: vsaka opeka je vsota dveh pod njo. Vrstice od vrha navzdol, null = prazna opeka.
function pyr(level, rnd) {
  const mk = (rows, ask, answer, hints, steps) => ({ kind: "pyr", q: H("dz.q.pyr"), show: { type: "pyr", rows: rows.map((r) => r.map((v) => (v == null ? null : n_(v)))), ask }, answer, hints, steps, x: "pyr" });
  if (level === "easy") {
    const a = R(rnd, 1, 20), b = R(rnd, 1, 20), c = R(rnd, 1, 20);
    const calc = `${n_(a)} + ${n_(b)} = ${n_(a + b)}, ${n_(b)} + ${n_(c)} = ${n_(b + c)}`;
    return mk([[null], [null, null], [a, b, c]], [0, 0], a + 2 * b + c, [H("dz.h.pyr1"), H("dz.h.calc", { calc })], [`${n_(a)} + ${n_(b)} = ${n_(a + b)}`, `${n_(b)} + ${n_(c)} = ${n_(b + c)}`, `${n_(a + b)} + ${n_(b + c)} = ${n_(a + 2 * b + c)}`]);
  }
  if (level === "medium") {
    const a = R(rnd, 1, 20), b = R(rnd, 1, 20), c = R(rnd, 1, 20), T = a + 2 * b + c;
    const eq = `(${n_(a)} + x) + (x + ${n_(c)}) = ${n_(T)}`;
    return mk([[T], [null, null], [a, null, c]], [2, 1], b, [H("dz.h.letX"), H("dz.h.eq", { eq })], [eq, `2x = ${n_(T)} ${MINUS} ${n_(a + c)} = ${n_(T - a - c)}`, `x = ${n_(b)}`]);
  }
  const a = R(rnd, 1, 15), b = R(rnd, 1, 15), c = R(rnd, 1, 15), d = R(rnd, 1, 15), T = a + 3 * b + 3 * c + d;
  const eq = `${n_(a)} + 3x + 3 · ${n_(c)} + ${n_(d)} = ${n_(T)}`;
  return mk([[T], [null, null], [null, null, null], [a, null, c, d]], [3, 1], b, [H("dz.h.letX"), H("dz.h.eq", { eq })], [H("dz.s.pyr4"), eq, `3x = ${n_(T)} ${MINUS} ${n_(a + 3 * c + d)} = ${n_(3 * b)}`, `x = ${n_(b)}`]);
}

const modpow = (a, n, m) => {
  let r = 1 % m, b = a % m;
  for (let e = n; e > 0; e >>= 1, b = (b * b) % m) if (e & 1) r = (r * b) % m;
  return r;
};

function box(level, rnd) {
  const mk = (text, answer, hints, steps, x = "box", q = H("dz.q.box"), kind = "box") => ({ kind, q, show: { type: "eq", text }, answer, hints, steps, x });
  if (level === "easy") {
    const x = R(rnd, 2, 15), m = R(rnd, 2, 9);
    if (rnd() < 0.5) {
      const a = R(rnd, 1, Math.min(20, m * x - 1)), r = m * x - a;
      return mk(`□ · ${n_(m)} ${MINUS} ${n_(a)} = ${n_(r)}`, x, [H("dz.h.back"), H("dz.h.calc", { calc: `${n_(r)} + ${n_(a)} = ${n_(r + a)}` })], [`□ · ${n_(m)} = ${n_(r)} + ${n_(a)} = ${n_(r + a)}`, `□ = ${n_(r + a)} : ${n_(m)} = ${n_(x)}`]);
    }
    const a = R(rnd, 1, 20), r = (x + a) * m;
    return mk(`(□ + ${n_(a)}) · ${n_(m)} = ${n_(r)}`, x, [H("dz.h.back"), H("dz.h.calc", { calc: `${n_(r)} : ${n_(m)} = ${n_(x + a)}` })], [`□ + ${n_(a)} = ${n_(r)} : ${n_(m)} = ${n_(x + a)}`, `□ = ${n_(x + a)} ${MINUS} ${n_(a)} = ${n_(x)}`]);
  }
  if (level === "medium") {
    const m = R(rnd, 2, 6);
    let k = R(rnd, 2, 8);
    if (k >= m) k++;
    const x = R(rnd, -9, 15) || 7, a = R(rnd, 1, 9), b = m * (x - a) - k * x;
    const right = b ? `${n_(k)} · □ ${pm(b)}` : `${n_(k)} · □`;
    const rx = b ? `${cx(k)} ${pm(b)}` : cx(k);
    return mk(`${n_(m)} · (□ ${MINUS} ${n_(a)}) = ${right}`, x, [H("dz.h.collect"), H("dz.h.eq", { eq: `${cx(m)} ${MINUS} ${n_(m * a)} = ${rx}` })], ["□ = x", `${cx(m)} ${MINUS} ${n_(m * a)} = ${rx}`, `${cx(m - k)} = ${n_(b + m * a)}`, Math.abs(m - k) === 1 ? `x = ${n_(x)}` : `x = ${n_(b + m * a)} : ${m - k < 0 ? `(${n_(m - k)})` : n_(m - k)} = ${n_(x)}`]);
  }
  // ostanek potence: ostanki se ponavljajo v krogu
  // a ≡ 0, 1 ali −1 (mod m) da prazen ali dolgočasen krog (vedno 0, vedno 1, izmenično): taka a izpusti
  let a, m;
  do [a, m] = [R(rnd, 2, 9), R(rnd, 5, 13)];
  while ([0, 1, m - 1].includes(a % m));
  const n = R(rnd, 25, 199);
  const res = [];
  const seen = new Map();
  let first = 0, L = 0;
  for (let e = 1; ; e++) {
    const r = modpow(a, e, m);
    if (seen.has(r)) {
      first = seen.get(r);
      L = e - first;
      break;
    }
    seen.set(r, e);
    res.push(r);
  }
  const e = n < first ? n : first + ((n - first) % L);
  const ans = modpow(a, n, m);
  const shown = res.slice(0, Math.min(res.length, 8));
  return mk(`${n_(a)}${sup(n)} : ${n_(m)}`, ans, [H("dz.h.cycle"), H("dz.h.cycleIs", { list: `${list(shown)}, …`, L: n_(L) })], [`${n_(a)}ᵏ : ${n_(m)} → ${list(res)}, …`, H("dz.s.period", { L: n_(L) }), `${n_(a)}${sup(n)} → ${n_(a)}${sup(e)} : ${n_(m)} → ${n_(ans)}`], "mod", H("dz.q.mod"), "mod");
}

function pct(level, rnd) {
  const P = [10, 20, 25, 50];
  const p = P[R(rnd, 0, 3)], q = P[R(rnd, 0, 3)];
  let x = 400;
  for (let i = 0; i < 12; i++) {
    const c = 20 * R(rnd, 2, 25);
    if ((c * (100 + p) * (100 - q)) % 10000 === 0) {
      x = c;
      break;
    }
  }
  const r = (x * (100 + p) * (100 - q)) / 10000;
  const f1 = n_((100 + p) / 100), f2 = n_((100 - q) / 100), f = n_(((100 + p) * (100 - q)) / 10000);
  return {
    kind: "pct", q: H("dz.q.pct", { p: n_(p), q: n_(q), r: n_(r) }), show: null, answer: x,
    hints: [H("dz.h.pct", { p: n_(p), q: n_(q), f1, f2 }), H("dz.h.eq", { eq: `x · ${f1} · ${f2} = ${n_(r)}` })],
    steps: [`x · ${f1} · ${f2} = ${n_(r)}`, `x · ${f} = ${n_(r)}`, `x = ${n_(r)} : ${f} = ${n_(x)}`], x: "pct",
  };
}

function incl(level, rnd) {
  const N = R(rnd, 100, 999);
  const a = R(rnd, 3, 12);
  const ok = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((b) => b % a && a % b);
  const b = ok[R(rnd, 0, ok.length - 1)];
  const l = (a * b) / gcd(a, b);
  const A = Math.floor(N / a), B = Math.floor(N / b), C = Math.floor(N / l), ans = A + B - C;
  const calc = `⌊${n_(N)} : ${n_(a)}⌋ = ${n_(A)}, ⌊${n_(N)} : ${n_(b)}⌋ = ${n_(B)}, ⌊${n_(N)} : ${n_(l)}⌋ = ${n_(C)}`;
  return {
    kind: "incl", q: H("dz.q.incl", { N: n_(N), a: n_(a), b: n_(b) }), show: null, answer: ans,
    hints: [H("dz.h.incl"), H("dz.h.calc", { calc })],
    steps: [H("dz.s.lcm", { a: n_(a), b: n_(b), l: n_(l) }), `⌊${n_(N)} : ${n_(a)}⌋ = ${n_(A)}`, `⌊${n_(N)} : ${n_(b)}⌋ = ${n_(B)}`, `⌊${n_(N)} : ${n_(l)}⌋ = ${n_(C)}`, `${n_(A)} + ${n_(B)} ${MINUS} ${n_(C)} = ${n_(ans)}`], x: "incl",
  };
}

function divs(level, rnd) {
  const PR = [2, 3, 5, 7, 11];
  let ex, N, cnt;
  for (let i = 0; ; i++) {
    ex = [R(rnd, 0, 4), R(rnd, 0, 3), R(rnd, 0, 2), R(rnd, 0, 1), R(rnd, 0, 1)];
    N = PR.reduce((s, p, j) => s * p ** ex[j], 1);
    cnt = ex.reduce((s, e) => s * (e + 1), 1);
    if ((N >= 72 && N <= 9999 && cnt >= 8 && ex.filter(Boolean).length >= 2) || i > 50) break;
  }
  if (!(N >= 72 && N <= 9999 && cnt >= 8)) [ex, N, cnt] = [[3, 2, 1, 0, 0], 360, 24];
  const f = PR.map((p, j) => (ex[j] ? (ex[j] > 1 ? `${p}${sup(ex[j])}` : `${p}`) : "")).filter(Boolean).join(" · ");
  const prod = ex.filter(Boolean).map((e) => `(${e} + 1)`).join(" · ");
  return { kind: "div", q: H("dz.q.div", { N: n_(N) }), show: null, answer: cnt, hints: [H("dz.h.factor"), H("dz.h.factorIs", { N: n_(N), f })], steps: [`${n_(N)} = ${f}`, `${prod} = ${n_(cnt)}`], x: "div" };
}

const POOLS = {
  easy: [seq, think, pyr, box],
  medium: [seq, think, pyr, box, pct],
  hard: [seq, think, pyr, box, incl, divs],
};

// Uganka dneva za stopnjo. Vrsta se vrti po dnevih (zaporedni dnevi imajo različne vrste), števila so iz
// semena datuma in stopnje. Enak dan in stopnja → enaka uganka (tudi na strežniku).
export function puzzleFor(day, level) {
  if (!isDay(day) || !LEVELS.includes(level)) return null;
  const pool = POOLS[level];
  const li = LEVELS.indexOf(level);
  const gen = pool[(((dayIndex(day) + li * 2) % pool.length) + pool.length) % pool.length];
  const p = gen(level, rng(hash(`dz:${day}:${level}`)));
  return { day, level, ...p };
}

// Odgovor kot število (»42«, »−7«, »42,0«, »84/2«); null, če vnos ni število.
export function checkAnswer(puzzle, input) {
  const s = String(input ?? "").trim();
  if (!puzzle || !s || s.length > 24) return null;
  const x = readTyped(s);
  if (!x || !x.d) return null;
  return x.n === puzzle.answer * x.d;
}

// Čas s kaznimi: namigi in napačni odgovori.
export const totalMs = (ms, hints, wrong) => ms + hints * HINT_MS + wrong * WRONG_MS;

// »41,2 s« ali »1:05«
export function timeText(ms) {
  const s = Math.max(0, ms) / 1000;
  if (s < 60) return `${fmt(Math.floor(s * 10) / 10)} s`;
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return m >= 60 ? `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${m}:${String(r).padStart(2, "0")}`;
}
