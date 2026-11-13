// Pojmi za igre: matematika, dopolnitev (glej README.md v tej mapi).
// Pokrije teme učnega načrta (OŠ 6.–9., gimnazija 1.–4. letnik), ki v ../topics.js še nimajo igre.
// Ena tema = en pojem (pri dveh različnih spretnostih dva). Datoteka ne uvaža ničesar.

export const SUBJECT = "MAT";
export const AREAS = []; // uporablja obstoječa matematična področja (ar, nt, fr, …)

// ---------- pomožne ----------
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const L = (ctx, sl, en) => (ctx.lang === "sl" ? sl : en);
const M = "−"; // pravi minus
const I = (n) => (n < 0 ? M + Math.abs(n) : String(n)); // celo število
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
// okrajšan ulomek n/d (z minusom spredaj)
const frs = (n, d) => {
  if (d < 0) [n, d] = [-n, -d];
  const g = gcd(n, d) || 1;
  n /= g;
  d /= g;
  return d === 1 ? I(n) : `${n < 0 ? M : ""}${Math.abs(n)}/${d}`;
};
const SUPS = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "-": "⁻", "+": "⁺", x: "ˣ", n: "ⁿ" };
const sup = (s) => String(s).replace(/[-+0-9xn]/g, (c) => SUPS[c]);
const setStr = (xs) => (xs.length ? `{${[...xs].sort((a, b) => a - b).map(I).join(", ")}}` : "∅");
const pt = (x, y) => `(${I(x)}, ${I(y)})`;
const pct = (ctx, x) => ctx.num(x) + L(ctx, " %", "%");
const C = [];
export const CONCEPTS = C;
const def = (id, area, year, glyph, sl, en, gen) => C.push({ id, area, year, glyph, name: { sl, en }, gen });

// Naloga: tipične napake najprej (premešane), nato rezervni napačni; 3–4 napačni, brez podvajanja.
function out(q, a, ws, fill = []) {
  const seen = new Set([a]);
  const w = [];
  for (const s of [...shuffle(ws), ...shuffle(fill)]) {
    if (s == null || s === "" || seen.has(s) || w.length >= 4) continue;
    seen.add(s);
    w.push(s);
  }
  return { q, a, w: shuffle(w) };
}
const nice = (x) => Number.isFinite(x) && Math.abs(x * 1e4 - Math.round(x * 1e4)) < 1e-6;
// Številski odgovor z enoto (unit vključno s presledkom, npr. " cm" ali "°").
function nq(ctx, q, a, unit, ws, opt = {}) {
  const f = (x) => ctx.num(Math.round(x * 1e6) / 1e6) + unit;
  const ok = (x) => typeof x === "number" && nice(x) && (opt.neg || x > 0) && Math.abs(x - a) > 1e-9 && (!opt.int || Number.isInteger(x));
  const W = ws.map((x) => (typeof x === "string" ? x : ok(x) ? f(x) : null));
  const st = opt.step || 1;
  const F = [a + st, a - st, a + 2 * st, a - 2 * st, a * 2, a + 3 * st, a + 10 * st].filter(ok).map(f);
  return out(q, f(a), W, F);
}
// Banka vprašanj: vnos [raven, "vprašanje|pravilno|napačno|…" (sl), isto (en)].
// Stopnja t vzame večinoma vnose ravni t, včasih (35 %) nižje ravni.
function bank(items) {
  return (tier, ctx) => {
    let lv = tier;
    if (tier > 1 && Math.random() < 0.35) lv = R(1, tier - 1);
    let pool = items.filter((it) => it[0] === lv);
    if (!pool.length) pool = items.filter((it) => it[0] <= tier);
    const it = pick(pool);
    const [q, a, ...ws] = (ctx.lang === "sl" ? it[1] : it[2]).split("|");
    return out(q, a, ws);
  };
}
// predlog s/z pred številom (izgovorjeno: z dvema, s tremi, … z osmimi)
const zs = (n) => ([2, 8, 9, 10, 11, 12].includes(n) ? "z" : "s");
const divisors = (n) => [...Array(n).keys()].map((i) => i + 1).filter((d) => n % d === 0);
const deg = (x) => `${x}°`;
const piS = (ctx, k) => (k === 1 ? "π" : `${ctx.num(k)}π`); // k·π
// k·√m (k celo ali decimalno), poenostavljeno
function rootS(ctx, k, m) {
  for (let f = 40; f >= 2; f--) if (m % (f * f) === 0) { k *= f; m /= f * f; }
  if (!nice(k)) return null;
  if (m === 1) return ctx.num(k);
  return (k === 1 ? "" : ctx.num(k)) + "√" + m;
}
// polinom iz koeficientov (od najvišje potence), spremenljivka v
function poly(cs, v = "x") {
  let s = "";
  cs.forEach((c, i) => {
    const p = cs.length - 1 - i;
    if (!c) return;
    const a = Math.abs(c);
    const sign = c < 0 ? (s ? ` ${M} ` : M) : s ? " + " : "";
    const coef = p === 0 ? String(a) : a === 1 ? "" : String(a);
    s += sign + coef + (p === 0 ? "" : p === 1 ? v : v + sup(p));
  });
  return s || "0";
}
const lin = (k, n) => poly([k, n]);

// =====================================================================
// 6. RAZRED
// =====================================================================
def("m2_multdiv", "nt", 6, "n·k", "Večkratniki in delitelji", "Multiples and divisors", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.5) {
      const n = R(3, 9), k = R(2, 9), a = n * k;
      const ws = [a + 1, a - 1, a + 2, n + k, a + n - 1, n * k + Math.ceil(n / 2), (n > 4 ? n - 1 : n + 1) * k].filter((x) => x % n !== 0 && x > 0);
      return out(L(ctx, `Kateri je večkratnik števila ${n}?`, `Which is a multiple of ${n}?`), String(a), ws.map(String));
    }
    const m = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 60]);
    const ds = divisors(m).filter((d) => d > 1 && d < m);
    const d = pick(ds);
    const non = [];
    for (let x = 2; x < m; x++) if (m % x && Math.abs(x - d) <= 6) non.push(x);
    return out(L(ctx, `Kateri je delitelj števila ${m}?`, `Which is a divisor of ${m}?`), String(d), [String(2 * m), ...shuffle(non).slice(0, 4).map(String)]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const m = pick([12, 18, 20, 24, 28, 30, 32, 36, 40, 45, 48, 50, 16, 27]);
      const c = divisors(m).length;
      return nq(ctx, L(ctx, `Koliko deliteljev ima število ${m}?`, `How many divisors does ${m} have?`), c, "", [c - 1, c - 2, c + 1, c / 2], { int: true });
    }
    const n = R(3, 12), top = pick([30, 40, 50, 60, 100]);
    const c = Math.floor(top / n);
    return nq(ctx, L(ctx, `Koliko večkratnikov števila ${n} je od 1 do ${top}?`, `How many multiples of ${n} from 1 to ${top}?`), c, "", [c - 1, c + 1, top - n, Math.round(top / n) === c ? c + 2 : Math.round(top / n)], { int: true });
  }
  if (Math.random() < 0.5) {
    const m = pick([6, 8, 10, 12, 14, 15, 16, 18, 20, 21, 24, 28]);
    const s = divisors(m).reduce((x, y) => x + y, 0);
    return nq(ctx, L(ctx, `Vsota vseh deliteljev števila ${m}?`, `Sum of all divisors of ${m}?`), s, "", [s - m, s - 1, s - m - 1, divisors(m).length], { int: true });
  }
  const m = pick([35, 49, 51, 55, 57, 63, 65, 77, 85, 91, 95, 39, 33, 45, 75]);
  const p = divisors(m)[1];
  const big = m / p;
  return nq(ctx, L(ctx, `Največji delitelj števila ${m}, manjši od ${m}?`, `Largest divisor of ${m} smaller than ${m}?`), big, "", [p, m - 1, Math.floor(m / 2), divisors(m).length > 3 ? divisors(m)[divisors(m).length - 3] : big + 2], { int: true });
});

def("m2_powprod", "pw", 6, "3⁴", "Potenca kot zapis produkta", "Powers as repeated products", (t, ctx) => {
  const prod = (b, n) => Array(n).fill(b).join(" · ");
  if (t === 1) {
    let b = R(2, 9), n = R(3, 6);
    if (Math.random() < 0.5) {
      const ws = [`${b} · ${n}`, `${b}${sup(n + 1)}`, `${b}${sup(n - 1)}`];
      if (b !== n && b ** n !== n ** b) ws.push(`${n}${sup(b)}`);
      return out(L(ctx, `${prod(b, n)} = ?`, `${prod(b, n)} = ?`), `${b}${sup(n)}`, ws);
    }
    b = R(2, 5);
    n = b === 2 ? R(3, 6) : R(2, 4);
    const v = b ** n;
    const ws = [b * n, b + n, b ** (n - 1), b ** (n + 1)];
    if (b !== n) ws.push(n ** b);
    return nq(ctx, L(ctx, `Koliko je ${b}${sup(n)}?`, `What is ${b}${sup(n)}?`), v, "", ws, { int: true });
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      let a = R(2, 5), b = R(2, 7);
      while (b === a) b = R(2, 7);
      const m = R(2, 4), n = R(2, 3);
      const q = `${prod(a, m)} · ${prod(b, n)} = ?`;
      const ws = [`${a}${sup(n)} · ${b}${sup(m)}`, `${a * b}${sup(m + n)}`, `${a}${sup(m)} + ${b}${sup(n)}`, `${a + b}${sup(m * n)}`];
      return out(q, `${a}${sup(m)} · ${b}${sup(n)}`, ws.filter((w) => w !== `${a}${sup(m)} · ${b}${sup(n)}`));
    }
    const n = R(2, 6);
    const v = 10 ** n;
    return nq(ctx, L(ctx, `Koliko je 10${sup(n)}?`, `What is 10${sup(n)}?`), v, "", [10 * n, 10 ** (n - 1), 10 ** (n + 1), 100 * n], { int: true });
  }
  if (Math.random() < 0.5) {
    const a = pick([2, 3, 5]), b = pick([2, 3, 5, 10].filter((x) => x !== a)), m = R(2, 3), n = R(1, 2);
    const v = a ** m * b ** n;
    return nq(ctx, L(ctx, `Koliko je ${a}${sup(m)} · ${b}${n > 1 ? sup(n) : ""}?`, `What is ${a}${sup(m)} · ${b}${n > 1 ? sup(n) : ""}?`), v, "", [a * m * b * n, a ** m + b ** n, a ** n * b ** m, (a * b) ** (m + n) < 5000 ? (a * b) ** (m + n) : a * m * b], { int: true });
  }
  const [a, m, b, n] = pick([[2, 5, 5, 2], [2, 4, 4, 2], [3, 3, 2, 4], [2, 6, 6, 2], [3, 4, 4, 3], [5, 2, 2, 3], [2, 3, 3, 2], [10, 2, 2, 5], [3, 2, 2, 3], [4, 3, 3, 4]]);
  const v = a ** m - b ** n;
  return nq(ctx, `${a}${sup(m)} ${M} ${b}${sup(n)} = ?`, v, "", [a * m - b * n, 0, Math.abs(v) + 2, -v], { int: true, neg: true });
});

def("m2_ineq_n", "eq", 6, "x<5", "Preproste neenačbe", "Simple inequalities", (t, ctx) => {
  const NQ = (s) => L(ctx, `Naravne rešitve: ${s}?`, `Positive integer solutions: ${s}?`);
  const rng = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };
  const upto = (n) => (n <= 4 ? setStr(rng(1, n)) : `{1, 2, …, ${n}}`);
  if (t === 1) {
    const a = R(2, 9), k = R(2, 5), strict = Math.random() < 0.6;
    const b = a + k;
    const s = `x + ${a} ${strict ? "<" : "≤"} ${b}`;
    const ans = setStr(rng(1, strict ? k - 1 : k));
    const ws = [setStr(rng(1, strict ? k : k + 1)), setStr(rng(0, strict ? k - 1 : k)), `{${strict ? k : k + 1}, ${strict ? k + 1 : k + 2}, …}`, setStr(rng(1, Math.max(1, (strict ? k - 1 : k) - 1)))];
    return out(NQ(s), ans, ws, [setStr(rng(2, k + 1)), setStr(rng(1, b))].filter((x) => x.length <= 20));
  }
  if (t === 2) {
    const a = R(2, 9), b = R(2, 9), op = pick(["≥", ">"]);
    const minus = Math.random() < 0.5;
    const s = minus ? `x ${M} ${a} ${op} ${b}` : `x + ${a} ${op} ${b + a + R(0, 4)}`;
    const lim = minus ? a + b : Number(s.split(" ").pop()) - a;
    const first = op === "≥" ? lim : lim + 1;
    const tail = (f) => `{${f}, ${f + 1}, ${f + 2}, …}`;
    const other = minus ? Math.abs(b - a) : lim + 2 * a;
    return out(NQ(s), tail(first), [tail(op === "≥" ? lim + 1 : lim), upto(first), tail(other === first ? first + 2 : other), upto(first - 1)]);
  }
  if (Math.random() < 0.5) {
    const k = R(2, 6), mm = R(2, 9) * k + R(0, k - 1), strict = Math.random() < 0.5;
    const ans = strict ? Math.ceil(mm / k) - 1 : Math.floor(mm / k);
    const s = `${k}x ${strict ? "<" : "≤"} ${mm}`;
    return nq(ctx, L(ctx, `Največja naravna rešitev neenačbe ${s}?`, `Largest positive integer solution of ${s}?`), ans, "", [ans + 1, mm - k, ans - 1, mm], { int: true });
  }
  const k = R(2, 4), c = R(1, 5), x0 = R(3, 9);
  const rhs = k * x0 + c; // kx + c < rhs → x < x0
  const s = `${k}x + ${c} < ${rhs}`;
  return nq(ctx, L(ctx, `Koliko naravnih rešitev ima ${s}?`, `How many positive integer solutions: ${s}?`), x0 - 1, "", [x0, x0 + 1, (rhs + c) / k, x0 - 2], { int: true });
});

const R3_ITEMS = [["jabolk", "apples", "kg"], ["krompirja", "potatoes", "kg"], ["sira", "cheese", "kg"], ["soka", "juice", "L"], ["olja", "oil", "L"], ["mleka", "milk", "L"], ["blaga", "fabric", "m"], ["vrvi", "rope", "m"]];
def("m2_rule3", "fr", 6, "⇒", "Sklepni račun", "Rule of three", (t, ctx) => {
  const kind = t === 1 ? 0 : t === 2 ? pick([1, 2]) : pick([3, 4, 1]);
  if (kind === 0 || kind === 3) {
    // premo sorazmerje: cena
    const [sl, en, u] = pick(R3_ITEMS);
    const unit = kind === 0 ? R(2, 9) : pick([1.5, 2.5, 0.8, 1.2, 3.5, 0.6, 2.4, 1.25]);
    const a = R(2, 6);
    let b = R(2, 12);
    while (b === a) b = R(2, 12);
    const c = Math.round(a * unit * 100) / 100, ans = b * unit;
    const q = L(ctx, `Za ${a} ${u} ${sl} plačamo ${ctx.num(c)} €. Za ${b} ${u}?`, `${a} ${u} of ${en} cost ${ctx.num(c)} €. ${b} ${u}?`);
    return nq(ctx, q, ans, " €", [c + (b - a), c * b, ans + unit, ans - unit], { step: unit });
  }
  if (kind === 1) {
    // obratno sorazmerje: hitrost in čas
    const [v1, v2] = pick([[60, 80], [40, 60], [60, 90], [50, 100], [80, 60], [90, 60], [100, 50], [60, 40], [30, 60], [60, 30], [40, 80], [80, 40], [60, 120], [50, 75]]);
    const t1 = pick([1, 2, 3, 4, 5, 6, 8].filter((x) => Number.isInteger((x * v1) / v2)));
    const t2 = (t1 * v1) / v2;
    const q = L(ctx, `Pri ${v1} km/h vožnja traja ${t1} h. Pri ${v2} km/h?`, `At ${v1} km/h the trip takes ${t1} h. At ${v2} km/h?`);
    return nq(ctx, q, t2, " h", [(t1 * v2) / v1, t1 + (v2 > v1 ? 1 : -1), t1 - (v2 > v1 ? 1 : -1) * (v2 - v1) / 10, t1]);
  }
  if (kind === 2) {
    // obratno sorazmerje: pretok in čas
    const [v1, v2] = pick([[6, 8], [4, 6], [5, 10], [10, 5], [8, 6], [6, 4], [3, 9], [9, 6], [12, 8], [8, 12], [4, 10], [10, 4]]);
    const t1 = pick([10, 12, 15, 20, 24, 30, 36, 40, 45, 60].filter((x) => Number.isInteger((x * v1) / v2)));
    const t2 = (t1 * v1) / v2;
    const q = L(ctx, `Pri ${v1} L/min se sod napolni v ${t1} min. Pri ${v2} L/min?`, `At ${v1} L/min a barrel fills in ${t1} min. At ${v2} L/min?`);
    return nq(ctx, q, t2, " min", [(t1 * v2) / v1, t1 - (v2 - v1), t2 + 5, t1], { step: 5 });
  }
  // obratno sorazmerje: iskana hitrost
  const [t1, v1, t2] = pick([[2, 60, 3], [3, 60, 2], [2, 90, 3], [3, 40, 2], [4, 60, 3], [3, 80, 4], [2, 75, 3], [4, 45, 3], [1.5, 80, 2], [2, 60, 1.5], [2.5, 60, 2], [3, 50, 2.5], [5, 60, 4], [6, 40, 4]]);
  const v2 = (v1 * t1) / t2;
  const q = L(ctx, `Pri ${v1} km/h pot traja ${ctx.num(t1)} h. Hitrost za ${ctx.num(t2)} h?`, `At ${v1} km/h the trip takes ${ctx.num(t1)} h. Speed for ${ctx.num(t2)} h?`);
  return nq(ctx, q, v2, " km/h", [(v1 * t2) / t1, v1 + (t1 - t2) * 10, v1 * t1, v2 + 10], { step: 10 });
});

def("m2_geo6", "ge", 6, "•—•", "Točka, premica, daljica, poltrak", "Points, lines, segments, rays", (t, ctx) => {
  if (t === 3 && Math.random() < 0.6) {
    const n = R(5, 8), c = (n * (n - 1)) / 2;
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Na premici je ${n} točk. Koliko daljic določajo?`, `${n} points on a line. How many segments?`), c, "", [n * (n - 1), n - 1, n, 2 * n], { int: true });
    return nq(ctx, L(ctx, `${n} točk, nobene 3 na isti premici. Koliko premic?`, `${n} points, no 3 on a line. How many lines?`), c, "", [n * (n - 1), n, n - 1, n * n], { int: true });
  }
  if (t === 2 && Math.random() < 0.3) {
    const d = pick([3, 5, 7, 9, 4.5, 6, 11, 13, 2.4, 8.6]);
    return nq(ctx, L(ctx, `AB = ${ctx.num(d)} cm, M je razpolovišče AB. AM = ?`, `AB = ${ctx.num(d)} cm, M is the midpoint. AM = ?`), d / 2, " cm", [d * 2, d, d / 4], { step: 0.5 });
  }
  return GEO6(t, ctx);
});
const GEO6 = bank([
  [1, "Del premice med dvema točkama je?|daljica|poltrak|premica|lok", "Part of a line between two points?|segment|ray|line|arc"],
  [1, "Del premice z enim samim krajiščem je?|poltrak|daljica|premica|lok", "Part of a line with one endpoint?|ray|segment|line|arc"],
  [1, "Koliko krajišč ima daljica?|2|1|0|3", "How many endpoints does a segment have?|2|1|0|3"],
  [1, "Koliko krajišč ima poltrak?|1|2|0|3", "How many endpoints does a ray have?|1|2|0|3"],
  [1, "Koliko krajišč ima premica?|0|1|2|neskončno", "How many endpoints does a line have?|0|1|2|infinitely many"],
  [1, "Koliko premic gre skozi dve različni točki?|1|2|0|neskončno", "How many lines pass through two points?|1|2|0|infinitely many"],
  [1, "Koliko premic gre skozi eno točko?|neskončno|1|2|0", "How many lines pass through one point?|infinitely many|1|2|0"],
  [1, "Premici v ravnini brez skupne točke sta?|vzporedni|pravokotni|sekajoči|enaki", "Two lines in a plane with no common point?|parallel|perpendicular|intersecting|equal"],
  [1, "Premici, ki se sekata pod pravim kotom, sta?|pravokotni|vzporedni|enaki|poševni", "Lines meeting at a right angle are?|perpendicular|parallel|equal|oblique"],
  [1, "Znak za vzporednost?|∥|⊥|∠|≅", "Symbol for parallel?|∥|⊥|∠|≅"],
  [1, "Znak za pravokotnost?|⊥|∥|∠|≅", "Symbol for perpendicular?|⊥|∥|∠|≅"],
  [1, "Skupna točka dveh sekajočih se premic je?|presečišče|krajišče|razpolovišče|središče", "Common point of two intersecting lines?|intersection|endpoint|midpoint|centre"],
  [1, "Točka, ki daljico razdeli na dva enaka dela?|razpolovišče|presečišče|krajišče|središče kroga", "Point that splits a segment in half?|midpoint|intersection|endpoint|circle centre"],
  [2, "Razdaljo točke od premice merimo po?|pravokotnici|vzporednici|poltraku|krožnici", "Distance from a point to a line is along?|the perpendicular|a parallel|a ray|a circle"],
  [2, "a ∥ b in b ∥ c. Kaj velja?|a ∥ c|a ⊥ c|a ⊥ b|b ⊥ c", "a ∥ b and b ∥ c. Which holds?|a ∥ c|a ⊥ c|a ⊥ b|b ⊥ c"],
  [2, "V ravnini: a ⊥ b in b ⊥ c. Kaj velja?|a ∥ c|a ⊥ c|a ∥ b|b ∥ c", "In a plane: a ⊥ b and b ⊥ c. Which holds?|a ∥ c|a ⊥ c|a ∥ b|b ∥ c"],
  [2, "Koliko vzporednic k p gre skozi T, ki ni na p?|1|0|2|neskončno", "How many parallels to p through T not on p?|1|0|2|infinitely many"],
  [2, "Koliko pravokotnic na p gre skozi točko T?|1|0|2|neskončno", "How many perpendiculars to p through T?|1|0|2|infinitely many"],
  [2, "Na koliko poltrakov razdeli premico točka na njej?|2|1|3|4", "A point on a line splits it into how many rays?|2|1|3|4"],
  [2, "Na premici so točke A, B, C. Koliko daljic?|3|2|6|1", "Points A, B, C lie on a line. How many segments?|3|2|6|1"],
  [3, "Točke, 3 cm oddaljene od premice p, ležijo na?|dveh vzporednicah|eni vzporednici|pravokotnici|krožnici", "Points 3 cm from line p lie on?|two parallels|one parallel|a perpendicular|a circle"],
]);

const ANG_KIND = [
  ["ničelni kot", "zero angle"], ["ostri kot", "acute angle"], ["pravi kot", "right angle"], ["topi kot", "obtuse angle"],
  ["iztegnjeni kot", "straight angle"], ["izbočeni kot", "reflex angle"], ["polni kot", "full angle"],
];
const angKind = (a) => (a === 0 ? 0 : a < 90 ? 1 : a === 90 ? 2 : a < 180 ? 3 : a === 180 ? 4 : a < 360 ? 5 : 6);
def("m2_angkind", "ge", 6, "∡", "Vrste kotov", "Types of angles", (t, ctx) => {
  const nm = (i) => L(ctx, ANG_KIND[i][0], ANG_KIND[i][1]);
  if (t === 3 && Math.random() < 0.65) {
    // kazalca na uri
    const r = Math.random();
    if (r < 0.4) {
      const h = R(1, 11), raw = 30 * h, a = Math.min(raw, 360 - raw);
      return nq(ctx, L(ctx, `Manjši kot med kazalcema ob ${h}.00?`, `Smaller angle between the hands at ${h}:00?`), a, "°", [360 - a, a + 30, a - 30, h * 6], { int: true, step: 30 });
    }
    if (r < 0.75) {
      const h = R(1, 11), raw = Math.abs(30 * h + 15 - 180), a = Math.min(raw, 360 - raw), naive = Math.min(Math.abs(30 * h - 180), 360 - Math.abs(30 * h - 180));
      return nq(ctx, L(ctx, `Manjši kot med kazalcema ob ${h}.30?`, `Smaller angle between the hands at ${h}:30?`), a, "°", [naive, a + 30, 360 - a, a + 15], { int: true, step: 15 });
    }
    const m = pick([5, 10, 15, 20, 25, 30, 40, 45, 50]);
    return nq(ctx, L(ctx, `Za koliko stopinj se minutni kazalec zavrti v ${m} min?`, `How far does the minute hand turn in ${m} min?`), 6 * m, "°", [m, 30 * m > 360 ? 3 * m : 30 * m, 12 * m, 360 - 6 * m], { int: true, step: 6 });
  }
  const pool = t === 1 ? [1, 1, 2, 3, 3, 4] : [0, 1, 3, 5, 5, 6, 2, 4];
  const k = pick(pool);
  const val = [0, R(1, 89), 90, R(91, 179), 180, R(181, 359), 360][k];
  if (t >= 2 && Math.random() < 0.4 && k > 0 && k < 6) {
    // obratno: izberi kot dane vrste
    const others = [R(5, 85), 90, R(95, 175), 180, R(185, 355), 360].filter((x) => angKind(x) !== k);
    return out(L(ctx, `Kateri kot je ${ANG_KIND[k][0]}?`, `Which angle is an ${ANG_KIND[k][1]}?`.replace("an r", "a r").replace("an s", "a s").replace("an f", "a f")), deg(val), others.map(deg));
  }
  const wrong = (t === 1 ? [1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5, 6]).filter((i) => i !== k).map(nm);
  return out(L(ctx, `Kakšen je kot ${val}°?`, `What type is a ${val}° angle?`), nm(k), shuffle(wrong).slice(0, 4));
});

def("m2_circparts", "ge", 6, "⊙", "Krog in krožnica", "Circle: radius, diameter, chord", (t, ctx) => {
  if (t === 1 && Math.random() < 0.5) {
    const r = pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 2.5, 3.5, 4.5, 6.5]);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Polmer krožnice je ${ctx.num(r)} cm. Premer?`, `Radius ${ctx.num(r)} cm. Diameter?`), 2 * r, " cm", [r / 2, r, 4 * r, r * r], { step: 1 });
    return nq(ctx, L(ctx, `Premer krožnice je ${ctx.num(2 * r)} cm. Polmer?`, `Diameter ${ctx.num(2 * r)} cm. Radius?`), r, " cm", [4 * r, 2 * r, r / 2], { step: 1 });
  }
  if (t === 3 && Math.random() < 0.6) {
    const r = R(3, 9);
    if (Math.random() < 0.5) {
      const d = pick([r - R(1, 2), r, r + R(1, 3)]);
      const opts = L(ctx, ["v notranjosti kroga", "na krožnici", "zunaj kroga", "v središču"], ["inside the circle", "on the circle", "outside the circle", "at the centre"]);
      const i = d < r ? 0 : d === r ? 1 : 2;
      return out(L(ctx, `r = ${r} cm, |ST| = ${d} cm. Kje leži točka T?`, `r = ${r} cm, |ST| = ${d} cm. Where is T?`), opts[i], opts.filter((_, j) => j !== i));
    }
    const d = pick([r - R(1, 2), r, r + R(1, 3)]);
    const opts = L(ctx, ["sekanta", "tangenta", "mimobežnica", "polmer"], ["secant", "tangent", "disjoint line", "radius"]);
    const i = d < r ? 0 : d === r ? 1 : 2;
    return out(L(ctx, `r = ${r} cm, premica p je ${d} cm od S. p je?`, `r = ${r} cm, line p is ${d} cm from S. p is a?`), opts[i], opts.filter((_, j) => j !== i));
  }
  return CIRC6(t, ctx);
});
const CIRC6 = bank([
  [1, "Daljica od središča do krožnice je?|polmer|premer|tetiva|lok", "Segment from the centre to the circle?|radius|diameter|chord|arc"],
  [1, "Tetiva skozi središče krožnice je?|premer|polmer|tangenta|lok", "A chord through the centre is the?|diameter|radius|tangent|arc"],
  [1, "Daljica med dvema točkama krožnice je?|tetiva|polmer|tangenta|lok", "Segment joining two points of a circle?|chord|radius|tangent|arc"],
  [1, "Najdaljša tetiva krožnice je?|premer|polmer|lok|tangenta", "The longest chord of a circle is the?|diameter|radius|arc|tangent"],
  [1, "Točke, ki so od S oddaljene za r, tvorijo?|krožnico|krog|premer|tetivo", "Points at distance r from S form a?|circle|disc|diameter|chord"],
  [1, "Krožnica skupaj z notranjostjo je?|krog|krožni lok|polmer|tetiva", "A circle together with its interior is a?|disc|arc|radius|chord"],
  [1, "Del krožnice med dvema njenima točkama je?|krožni lok|tetiva|premer|polmer", "Part of a circle between two of its points?|arc|chord|diameter|radius"],
  [1, "Kolikokrat je premer daljši od polmera?|2-krat|3-krat|4-krat|enako dolg", "How many times longer is the diameter than the radius?|2 times|3 times|4 times|equal"],
  [1, "Koliko polmerov ima krožnica?|neskončno|1|2|4", "How many radii does a circle have?|infinitely many|1|2|4"],
  [1, "Oznaka za polmer je?|r|d|S|o", "Usual symbol for the radius?|r|d|S|C"],
  [1, "Oznaka za premer je?|d|r|S|o", "Usual symbol for the diameter?|d|r|S|C"],
  [1, "Kako imenujemo točko S v k(S, r)?|središče|krajišče|presečišče|teme", "What is point S in k(S, r)?|centre|endpoint|intersection|vertex"],
  [2, "Premica z dvema skupnima točkama s krožnico?|sekanta|tangenta|mimobežnica|polmer", "A line meeting a circle in two points?|secant|tangent|disjoint line|radius"],
  [2, "Premica z eno skupno točko s krožnico?|tangenta|sekanta|mimobežnica|premer", "A line meeting a circle in one point?|tangent|secant|disjoint line|diameter"],
  [2, "Premica brez skupnih točk s krožnico?|mimobežnica|tangenta|sekanta|tetiva", "A line with no points on the circle?|disjoint line|tangent|secant|chord"],
  [2, "Tangenta je na polmer v dotikališču?|pravokotna|vzporedna|enako dolga|pod kotom 45°", "At the touching point a tangent is to the radius?|perpendicular|parallel|equal|at 45°"],
  [2, "Del kroga med tetivo in lokom je?|krožni odsek|krožni izsek|kolobar|polkrog", "Part of a disc between a chord and an arc?|segment|sector|annulus|semicircle"],
  [2, "Del kroga med dvema polmeroma in lokom je?|krožni izsek|krožni odsek|kolobar|tetiva", "Part of a disc between two radii and an arc?|sector|segment|annulus|chord"],
  [2, "Lik med dvema krožnicama z istim središčem?|kolobar|krožni izsek|krožni odsek|lok", "Shape between two circles with one centre?|annulus|sector|segment|arc"],
  [2, "Kolikšna je najdaljša tetiva pri r = 5 cm?|10 cm|5 cm|2,5 cm|25 cm", "Longest chord when r = 5 cm?|10 cm|5 cm|2.5 cm|25 cm"],
  [2, "Koliko tangent gre skozi točko na krožnici?|1|2|0|neskončno", "How many tangents through a point on the circle?|1|2|0|infinitely many"],
  [2, "Koliko tangent gre skozi točko zunaj kroga?|2|1|0|neskončno", "How many tangents from a point outside the circle?|2|1|0|infinitely many"],
]);

def("m2_constr6", "ge", 6, "⟂", "Osnovne konstrukcije", "Basic constructions", (t, ctx) => {
  if (t === 1 && Math.random() < 0.5) {
    if (Math.random() < 0.5) {
      const a = R(10, 85) * 2;
      return nq(ctx, L(ctx, `Simetrala kota ${a}° ga razdeli na kota po?`, `The bisector of ${a}° makes two angles of?`), a / 2, "°", [a * 2, a, 180 - a, 90 - a / 2], { step: 1 });
    }
    const d = pick([6, 7, 9, 11, 12, 13, 8.4, 10, 15, 5]);
    return nq(ctx, L(ctx, `AB = ${ctx.num(d)} cm. Razdalja od A do razpolovišča?`, `AB = ${ctx.num(d)} cm. Distance from A to the midpoint?`), d / 2, " cm", [d, 2 * d, d / 4, d - 1], { step: 0.5 });
  }
  if (t === 3 && Math.random() < 0.6) {
    const target = pick([15, 22.5, 30, 45, 75, 105, 120, 135, 150, 165]);
    const pick1 = CONSTR_EXPR.filter((e) => e[1] === target);
    const others = CONSTR_EXPR.filter((e) => e[1] !== target);
    const q = L(ctx, `Kako načrtamo kot ${ctx.num(target)}°?`, `How do we construct ${ctx.num(target)}°?`);
    return out(q, pick(pick1)[0], shuffle(others).slice(0, 5).map((e) => e[0]));
  }
  return CON6(t, ctx);
});
// zapisi kotov, ki jih načrtamo s šestilom in ravnilom: [zapis, vrednost]
const CONSTR_EXPR = [
  ["60° : 2", 30], ["90° : 2", 45], ["30° : 2", 15], ["45° : 2", 22.5], ["60° + 15°", 75], ["45° + 30°", 75], ["90° + 15°", 105],
  ["60° + 45°", 105], ["90° + 45°", 135], ["180° − 30°", 150], ["90° + 30°", 120], ["180° − 60°", 120], ["180° − 15°", 165],
  ["90° + 60°", 150], ["180° − 45°", 135], ["60° + 30°", 90], ["90° − 30°", 60], ["45° + 15°", 60],
];
const CON6 = bank([
  [1, "Simetrala daljice je na daljico?|pravokotna|vzporedna|poševna|enako dolga", "The perpendicular bisector is to the segment?|perpendicular|parallel|oblique|equal"],
  [1, "Simetrala daljice gre skozi njeno?|razpolovišče|krajišče|podaljšek|tretjino", "The perpendicular bisector passes through the?|midpoint|endpoint|extension|third point"],
  [1, "Simetrala kota razdeli kot na?|dva enaka kota|dva prava kota|tri enake kote|ostri in topi kot", "The angle bisector splits the angle into?|two equal angles|two right angles|three equal angles|acute and obtuse"],
  [1, "Kaj potrebujemo za simetralo daljice?|šestilo in ravnilo|samo kotomer|samo ravnilo|samo svinčnik", "Tools for a perpendicular bisector?|compass and ruler|protractor only|ruler only|pencil only"],
  [1, "Koliko simetral ima daljica?|1|2|0|3", "How many perpendicular bisectors has a segment?|1|2|0|3"],
  [1, "Koliko simetral ima kot?|1|2|0|3", "How many bisectors does an angle have?|1|2|0|3"],
  [1, "Simetrala kota je?|poltrak|daljica|krožnica|lok", "An angle bisector is a?|ray|segment|circle|arc"],
  [1, "Simetrala daljice je?|premica|poltrak|daljica|lok", "A perpendicular bisector is a?|line|ray|segment|arc"],
  [1, "Kot med simetralo daljice in daljico?|90°|45°|180°|60°", "Angle between a segment and its perpendicular bisector?|90°|45°|180°|60°"],
  [1, "Simetrala pravega kota ga razdeli na?|2 × 45°|2 × 90°|2 × 30°|45° in 60°", "Bisecting a right angle gives?|2 × 45°|2 × 90°|2 × 30°|45° and 60°"],
  [1, "Simetrala iztegnjenega kota ga razdeli na?|2 × 90°|2 × 45°|2 × 180°|2 × 60°", "Bisecting a straight angle gives?|2 × 90°|2 × 45°|2 × 180°|2 × 60°"],
  [1, "Pravokotnica na p skozi T je s p?|pravokotna|vzporedna|enaka|mimobežna", "The perpendicular to p through T is to p?|perpendicular|parallel|equal|skew"],
  [2, "Točke, enako oddaljene od A in B, so na?|simetrali AB|daljici AB|krožnici skozi A|vzporednici AB", "Points equidistant from A and B lie on the?|perp. bisector of AB|segment AB|circle through A|parallel to AB"],
  [2, "Točke, enako oddaljene od krakov kota, so na?|simetrali kota|kraku kota|pravokotnici|loku", "Points equidistant from both arms lie on the?|angle bisector|arm|perpendicular|arc"],
  [2, "Kateri lik ima vse notranje kote po 60°?|enakostranični △|kvadrat|pravokotnik|pravokotni △", "Which shape has all interior angles 60°?|equilateral △|square|rectangle|right △"],
  [2, "Kot 90° dobimo, če razpolovimo?|iztegnjeni kot|polni kot|kot 60°|kot 45°", "Bisecting which angle gives 90°?|a straight angle|a full angle|a 60° angle|a 45° angle"],
  [2, "Kot 30° je polovica kota?|60°|90°|45°|15°", "30° is half of?|60°|90°|45°|15°"],
  [2, "Kot 45° je polovica kota?|90°|60°|180°|30°", "45° is half of?|90°|60°|180°|30°"],
  [3, "Kot med simetralama dveh sokotov?|90°|180°|45°|60°", "Angle between the bisectors of a linear pair?|90°|180°|45°|60°"],
  [3, "T leži na simetrali daljice AB, TA = 5 cm. TB = ?|5 cm|10 cm|2,5 cm|ni znano", "T is on the bisector of AB, TA = 5 cm. TB = ?|5 cm|10 cm|2.5 cm|unknown"],
  [3, "T je na simetrali kota, 4 cm od enega kraka. Od drugega?|4 cm|8 cm|2 cm|ni znano", "T on an angle bisector is 4 cm from one arm. Other arm?|4 cm|8 cm|2 cm|unknown"],
]);

const SYMM = [
  ["kvadrat", "square", 4], ["pravokotnik (ne kvadrat)", "rectangle (not a square)", 2], ["enakostranični △", "equilateral △", 3],
  ["enakokraki △ (ne enakostranični)", "isosceles △ (not equilateral)", 1], ["raznostranični △", "scalene △", 0], ["romb (ne kvadrat)", "rhombus (not a square)", 2],
  ["deltoid (ne romb)", "kite (not a rhombus)", 1], ["enakokraki trapez (ne pravokotnik)", "isosceles trapezium (not a rectangle)", 1],
  ["splošni paralelogram", "general parallelogram", 0], ["krog", "circle", -1], ["daljica", "line segment", 2], ["pravilni šestkotnik", "regular hexagon", 6],
  ["kot", "angle", 1], ["pravilni petkotnik", "regular pentagon", 5],
];
def("m2_symm", "ge", 6, "◁|▷", "Simetrija in zrcaljenje", "Symmetry and reflection", (t, ctx) => {
  const cnt = (n) => (n < 0 ? L(ctx, "neskončno", "infinitely many") : String(n));
  const ALL = [0, 1, 2, 3, 4, 6, -1];
  if (t === 1 || (t >= 2 && Math.random() < 0.25)) {
    const [sl, en, n] = pick(SYMM);
    return out(L(ctx, `Koliko osi simetrije ima ${sl}?`, `Lines of symmetry: ${en}?`), cnt(n), shuffle(ALL.filter((x) => x !== n)).slice(0, 4).map(cnt));
  }
  if (t === 2) {
    if (Math.random() < 0.5) return SYM2(t, ctx);
    const d = pick([2, 3, 4, 5, 6, 7, 1.5, 2.5, 3.5, 4.5]);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `T je ${ctx.num(d)} cm od osi simetrije. |TT′| = ?`, `T is ${ctx.num(d)} cm from the mirror line. |TT′| = ?`), 2 * d, " cm", [d, d / 2, 4 * d], { step: 1 });
    return nq(ctx, L(ctx, `|AA′| = ${ctx.num(2 * d)} cm. Kako daleč je A od osi?`, `|AA′| = ${ctx.num(2 * d)} cm. How far is A from the mirror line?`), d, " cm", [2 * d, 4 * d, d / 2], { step: 1 });
  }
  if (Math.random() < 0.45) {
    const n = R(5, 12);
    return nq(ctx, L(ctx, `Koliko osi simetrije ima pravilni ${n}-kotnik?`, `Lines of symmetry of a regular ${n}-gon?`), n, "", [n / 2, 2 * n, n - 2, n - 1], { int: true });
  }
  const a = R(3, 9), x = R(1, a - 1), y = R(1, 9);
  if (Math.random() < 0.5) {
    const ws = [pt(a + x, y), pt(a, y), pt(2 * a + x, y), pt(y, 2 * a - x)];
    if (2 * a - y >= 0 && 2 * a - y !== y) ws.push(pt(x, 2 * a - y));
    return out(L(ctx, `T${pt(x, y)} zrcalimo čez premico x = ${a}. T′ = ?`, `Reflect T${pt(x, y)} in the line x = ${a}. T′ = ?`), pt(2 * a - x, y), ws);
  }
  const ws = [pt(y, a + x), pt(y, a), pt(y, 2 * a + x), pt(2 * a - x, y)];
  if (2 * a - y >= 0 && 2 * a - y !== y) ws.push(pt(2 * a - y, x));
  return out(L(ctx, `T${pt(y, x)} zrcalimo čez premico y = ${a}. T′ = ?`, `Reflect T${pt(y, x)} in the line y = ${a}. T′ = ?`), pt(y, 2 * a - x), ws);
});
const SYM2 = bank([
  [2, "Točka na osi simetrije se preslika?|sama vase|na drugo stran osi|v neskončnost|na os x", "A point on the mirror line maps to?|itself|the other side|infinity|the x-axis"],
  [2, "Daljica TT′ je na os simetrije?|pravokotna|vzporedna|enako dolga|pod kotom 45°", "Segment TT′ is to the mirror line?|perpendicular|parallel|equal|at 45°"],
  [2, "Os simetrije je za daljico TT′?|simetrala|težiščnica|vzporednica|tangenta", "For segment TT′ the mirror line is its?|perp. bisector|median|parallel|tangent"],
  [2, "Pri zrcaljenju se dolžina daljice?|ne spremeni|podvoji|razpolovi|poveča za 1", "Under reflection a segment's length?|stays the same|doubles|halves|grows by 1"],
  [2, "Pri zrcaljenju se velikost kota?|ne spremeni|podvoji|razpolovi|zmanjša za 90°", "Under reflection an angle's size?|stays the same|doubles|halves|drops by 90°"],
  [2, "Koliko osi simetrije ima črka H?|2|1|0|4", "How many lines of symmetry has the letter H?|2|1|0|4"],
]);

def("m2_charts", "st", 6, "▥", "Prikazi podatkov", "Reading data displays", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.5) {
      const s = pick([2, 4, 5, 10, 20, 25, 50]), k = R(5, 12);
      return nq(ctx, L(ctx, `1 razdelek = ${s}. Stolpec je visok ${k} razdelkov. Vrednost?`, `1 division = ${s}. A bar is ${k} divisions high. Value?`), s * k, "", [s + k, k, s * (k - 1), s * (k + 1)], { int: true, step: s });
    }
    const s = pick([2, 3, 4, 5, 10, 6]), k = R(3, 8);
    return nq(ctx, L(ctx, `Slikovni prikaz: ● = ${s}. Koliko pomeni ${"●".repeat(k)}?`, `Pictogram: ● = ${s}. What does ${"●".repeat(k)} show?`), s * k, "", [k, s + k, s * (k - 1), s * (k + 1)], { int: true, step: s });
  }
  if (t === 2) {
    if (Math.random() < 0.4) {
      const s = pick([2, 4, 6, 8, 10, 20]), k = R(2, 6);
      return nq(ctx, L(ctx, `● = ${s}, ◐ = polovica. Koliko je ${"●".repeat(k)}◐?`, `● = ${s}, ◐ = half. What is ${"●".repeat(k)}◐?`), s * k + s / 2, "", [s * (k + 1), k + 1, s * k + 1, s * k], { int: true, step: s / 2 });
    }
    const v = shuffle([...Array(26).keys()].map((i) => i + 5)).slice(0, 4);
    const mx = Math.max(...v), mn = Math.min(...v), sum = v.reduce((a, b) => a + b, 0);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Stolpci: ${v.join(", ")}. Največji − najmanjši?`, `Bars: ${v.join(", ")}. Tallest − shortest?`), mx - mn, "", [mx, mn, mx + mn, v[0] - v[3] > 0 ? v[0] - v[3] : v[3] - v[0]], { int: true });
    return nq(ctx, L(ctx, `Stolpci: ${v.join(", ")}. Koliko skupaj?`, `Bars: ${v.join(", ")}. Total?`), sum, "", [sum - v[3], sum + 10, sum - 10, mx * 4], { int: true });
  }
  if (Math.random() < 0.3) return CH3(t, ctx);
  // brez negativnih števil (cela števila so šele v 7. razredu)
  const h1 = R(6, 10), dh = R(2, 5), rate = R(1, 4), warm = Math.random() < 0.6;
  const t1 = warm ? R(0, 8) : R(rate * dh, rate * dh + 8), t2 = warm ? t1 + rate * dh : t1 - rate * dh;
  return nq(ctx, L(ctx, `Ob ${h1}. uri ${t1} °C, ob ${h1 + dh}. uri ${t2} °C. ${warm ? "Ogrevanje" : "Ohlajanje"} na uro?`, `${t1} °C at ${h1}:00, ${t2} °C at ${h1 + dh}:00. ${warm ? "Warming" : "Cooling"} per hour?`), rate, " °C", [rate * dh, t2, rate * 2, rate + 1, dh], { int: true });
});
const CH3 = bank([
  [3, "Spremembo temperature skozi dan najbolje kaže?|črtni prikaz|tortni prikaz|slikovni prikaz|Vennov diagram", "Temperature over a day is best shown by a?|line graph|pie chart|pictogram|Venn diagram"],
  [3, "Podatke v vrsticah in stolpcih uredimo v?|preglednico|tortni prikaz|črtni prikaz|drevo", "Data arranged in rows and columns form a?|table|pie chart|line graph|tree"],
  [3, "Na stolpčnem prikazu višina stolpca kaže?|vrednost|čas|barvo|širino", "On a bar chart the bar height shows the?|value|time|colour|width"],
  [3, "Na črtnem prikazu je na vodoravni osi pogosto?|čas|vsota|odstotek|barva", "On a line graph the horizontal axis often shows?|time|the total|a percentage|colour"],
]);

def("m2_count", "st", 6, "3·4", "Kombinatorične situacije", "Counting possibilities", (t, ctx) => {
  if (t === 1) {
    const PAIRS = [["Majic", "hlač", "Shirts", "trousers", "Kombinacij?", "Outfits?"], ["Juh", "glavnih jedi", "Soups", "main courses", "Kosil?", "Meals?"],
      ["Okusov sladoleda", "kornetov", "Ice-cream flavours", "cones", "Možnosti?", "Choices?"], ["Poti od A do B", "od B do C", "Roads A to B", "B to C", "Poti od A do C?", "Routes A to C?"],
      ["Barv", "velikosti", "Colours", "sizes", "Različnih izdelkov?", "Different items?"]];
    const [s1, s2, e1, e2, sq, eq] = pick(PAIRS);
    const a = R(2, 6), b = R(2, 6);
    return nq(ctx, L(ctx, `${s1}: ${a}, ${s2}: ${b}. ${sq}`, `${e1}: ${a}, ${e2}: ${b}. ${eq}`), a * b, "", [a + b, a * b - 1, a * b + a, 2 * (a + b), a ** b > 200 ? a * b + b : a ** b], { int: true });
  }
  if (t === 2) {
    const a = R(2, 4), b = R(2, 5), c = R(2, 4);
    return nq(ctx, L(ctx, `Juh: ${a}, glavnih jedi: ${b}, sladic: ${c}. Kosil?`, `Soups: ${a}, mains: ${b}, desserts: ${c}. Meals?`), a * b * c, "", [a + b + c, a * b + c, a * b, b * c, a * b * c - 1], { int: true });
  }
  const r = Math.random();
  if (r < 0.4) {
    const n = R(3, 5), digs = [1, 2, 3, 4, 5].slice(0, n).join(", "), rep = Math.random() < 0.5;
    const ans = rep ? n * n : n * (n - 1);
    const q = rep ? L(ctx, `Števke ${digs}, s ponavljanjem. Dvomestnih števil?`, `Digits ${digs}, repeats allowed. 2-digit numbers?`) : L(ctx, `Števke ${digs}, brez ponavljanja. Dvomestnih števil?`, `Digits ${digs}, no repeats. 2-digit numbers?`);
    return nq(ctx, q, ans, "", [rep ? n * (n - 1) : n * n, 2 * n, n + n - 1, (n * (n - 1)) / 2, rep ? n * n - 1 : n * (n - 1) + 1], { int: true });
  }
  if (r < 0.7) {
    const n = R(4, 7), ans = (n * (n - 1)) / 2;
    return nq(ctx, L(ctx, `Oseb: ${n}. Vsak se rokuje z vsakim. Rokovanj?`, `${n} people each shake hands once. Handshakes?`), ans, "", [n * (n - 1), n * n, n, ans + n], { int: true });
  }
  const n = R(3, 4);
  return nq(ctx, L(ctx, `Na koliko načinov se ${n} otroci postavijo v vrsto?`, `In how many ways can ${n} children line up?`), n === 3 ? 6 : 24, "", [n * n, n, 2 * n, n === 3 ? 9 : 12, n === 3 ? 3 : 16], { int: true });
});


// =====================================================================
// 7. RAZRED
// =====================================================================
def("m2_fracword", "fr", 7, "⅗", "Ulomki v besedilnih nalogah", "Fractions in word problems", (t, ctx) => {
  const FR = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 8], [5, 8], [2, 7], [3, 7], [5, 6], [7, 10]];
  const [p, q] = pick(FR);
  if (t === 1) {
    const k = R(2, 12), W = q * k, ans = p * k;
    const T = pick([
      [`Pot je dolga ${W} km. Prehodili so ${p}/${q} poti. Koliko km?`, `A ${W} km trail; they walked ${p}/${q}. How many km?`, " km"],
      [`Imel je ${W} €, porabil je ${p}/${q}. Koliko je porabil?`, `He had ${W} € and spent ${p}/${q}. Amount spent?`, " €"],
      [`Knjiga: ${W * 10} strani, prebral je ${p}/${q}. Koliko strani?`, `A ${W * 10}-page book; ${p}/${q} read. Pages read?`, "", 10],
      [`V vreči je ${W} kg moke, porabili so ${p}/${q}. Koliko kg?`, `A ${W} kg sack of flour; ${p}/${q} used. How many kg?`, " kg"],
    ]);
    const m = T[3] || 1;
    return nq(ctx, L(ctx, T[0], T[1]), ans * m, T[2], [k * m, W * m - ans * m, (W * m) / p, q * k * p * m, ans * m + p], { int: true });
  }
  if (t === 2) {
    const k = R(2, 10), W = q * k, part = p * k;
    const T = pick([
      [`${p}/${q} poti je ${part} km. Kako dolga je vsa pot?`, `${p}/${q} of a trail is ${part} km. Whole trail?`, " km"],
      [`${p}/${q} vsote je ${part} €. Kolikšna je vsa vsota?`, `${p}/${q} of a sum is ${part} €. Whole sum?`, " €"],
      [`Prebral je ${p}/${q} knjige, to je ${part * 10} strani. Vse strani?`, `${p}/${q} of a book is ${part * 10} pages. All pages?`, "", 10],
    ]);
    const m = T[3] || 1;
    return nq(ctx, L(ctx, T[0], T[1]), W * m, T[2], [(part * p * m) / q, part * q * m, (part * m) / p, part * m + q, W * m - part * m], { int: true });
  }
  if (Math.random() < 0.5) {
    const k = R(2, 10), W = q * k, rest = (q - p) * k;
    return nq(ctx, L(ctx, `Imel je ${W} €, porabil je ${p}/${q}. Koliko mu ostane?`, `He had ${W} € and spent ${p}/${q}. How much is left?`), rest, " €", [p * k, W - p, (W * (q - p)) / p, rest + k], { int: true });
  }
  const k = R(2, 6) * 10, W = q * k, rest = (q - p) * k;
  return nq(ctx, L(ctx, `Prebral je ${p}/${q} knjige, ostane ${rest} strani. Vse strani?`, `${p}/${q} of a book read, ${rest} pages left. All pages?`), W, "", [(rest * q) / p, rest * q, rest + p * k + k, (rest * p) / q + rest, p * k], { int: true });
});

// stopinje in minute
const dm = (d, m) => (m ? `${d}° ${m}′` : `${d}°`);
const DM = (x) => dm(Math.floor(x / 60), x % 60); // x v minutah
def("m2_degmin", "ge", 7, "°′", "Računanje s koti (stopinje in minute)", "Degrees and minutes", (t, ctx) => {
  if (t === 1) {
    const d = R(5, 170), f = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8, 0.9]), m = Math.round(f * 60);
    if (Math.random() < 0.5) {
      const ws = [dm(d, Math.round(f * 100) < 60 && Math.round(f * 100) !== m ? Math.round(f * 100) : m + 5), dm(d, Math.round(f * 10)), dm(d + 1, m), dm(d, 60 - m === m ? m + 10 : 60 - m)];
      return out(`${ctx.num(d + f)}° = ?`, dm(d, m), ws);
    }
    const r3 = (x) => `${ctx.num(Math.round(x * 1000) / 1000)}°`;
    const ws = [r3(d + m / 100), r3(d + 1 + f), r3(d + f + 0.1 < d + 1 ? d + f + 0.1 : d + f - 0.1), r3(d + m / 10 < d + 1 ? d + m / 10 : d + m / 1000)];
    return out(`${dm(d, m)} = ?°`, r3(d + f), ws);
  }
  if (t === 2) {
    const r = Math.random();
    if (r < 0.4) {
      const m1 = R(20, 55), m2 = R(Math.max(5, 61 - m1), 55), d1 = R(10, 80), d2 = R(10, 80);
      const tot = (d1 + d2) * 60 + m1 + m2;
      return out(`${dm(d1, m1)} + ${dm(d2, m2)} = ?`, DM(tot), [DM(tot - 60), DM(tot + 60), DM(tot + 10), DM(tot - 10)]);
    }
    if (r < 0.8) {
      const big = pick([90, 180, 100, 120, 150]), m2 = R(5, 55), d2 = R(10, big - 20);
      const res = big * 60 - d2 * 60 - m2;
      const ws = [dm(big - d2, 60 - m2), 100 - m2 < 60 ? dm(big - d2 - 1, 100 - m2) : null, dm(big - d2, m2), dm(big - d2 - 1, m2), DM(res + 60), DM(res - 10), DM(res + 10), DM(res - 60)];
      return out(`${big}° ${M} ${dm(d2, m2)} = ?`, DM(res), ws);
    }
    const d = R(10, 80), m = R(5, 55);
    const res = 180 * 60 - d * 60 - m, comp = 90 * 60 - d * 60 - m;
    return out(L(ctx, `Sokot kota ${dm(d, m)}?`, `Supplement of ${dm(d, m)}?`), DM(res), [DM(comp), dm(180 - d, 60 - m), DM(res + 60), dm(179 - d, m), DM(res - 60), DM(res + 10)]);
  }
  if (Math.random() < 0.5) {
    const k = R(2, 4), d = R(10, 40), m = R(Math.ceil(60 / k), 55);
    const tot = k * (d * 60 + m);
    return out(`${k} · ${dm(d, m)} = ?`, DM(tot), [DM(tot - 60 * Math.floor((k * m) / 60)), DM(tot + 60), dm(k * d, m), DM(tot - 30)]);
  }
  const k = pick([2, 3, 4]);
  let resMin, tot;
  do {
    resMin = R(10, 60) * 60 + R(1, 11) * 5;
    tot = resMin * k;
  } while (tot % 60 === 0 || tot >= 360 * 60);
  const D = Math.floor(tot / 60), Mi = tot % 60;
  const wrongNaive = dm(Math.floor(D / k), Math.floor(Mi / k));
  return out(`${dm(D, Mi)} : ${k} = ?`, DM(resMin), [wrongNaive, DM(resMin + 30), DM(resMin - 30), DM(resMin + 60)]);
});

def("m2_congr", "ge", 7, "≅", "Skladnost in načrtovanje trikotnikov", "Congruence and constructing triangles", (t, ctx) => {
  if (t === 1) {
    const S = [
      ["a, b, c", "SSS"], ["a, b, γ", "SKS"], ["b, c, α", "SKS"], ["a, c, β", "SKS"], ["c, α, β", "KSK"], ["a, β, γ", "KSK"], ["b, α, γ", "KSK"],
      ["a, b, α; a > b", "SsK"], ["a, b, β; b > a", "SsK"], ["a, c, α; a > c", "SsK"], ["a, c, γ; c > a", "SsK"], ["b, c, β; b > c", "SsK"], ["b, c, γ; c > b", "SsK"],
    ];
    const [d, a] = pick(S);
    const nm = (x) => (ctx.lang === "sl" ? x : EN_RULE[x]);
    return out(L(ctx, `Podatki ${d}. Izrek o skladnosti?`, `Given ${d}. Congruence rule?`), nm(a), ["SSS", "SKS", "KSK", "SsK", "KKK"].filter((x) => x !== a).map(nm));
  }
  if (t === 2) {
    if (Math.random() < 0.6) {
      const a = R(2, 8), b = R(a + 2, a + 9), lo = b - a, hi = a + b;
      const ans = R(lo + 1, hi - 1);
      return nq(ctx, L(ctx, `Stranici merita ${a} cm in ${b} cm. Tretja je lahko?`, `Two sides are ${a} cm and ${b} cm. The third can be?`), ans, " cm", [lo, hi, hi + R(1, 3), Math.max(1, lo - R(1, 2))], { int: true });
    }
    const al = pick([100, 110, 120, 95, 130, 105, 140, 85, 70]), lim = 180 - al;
    const ans = R(10, lim - 5);
    return nq(ctx, L(ctx, `α = ${al}°. Kateri β je lahko kot istega △?`, `α = ${al}°. Which β is possible in the same △?`), ans, "°", [lim, lim + 5, lim + 15, lim + 10], { int: true });
  }
  const a = R(3, 9), b = R(a + 1, a + 8);
  const cnt = 2 * a - 1;
  return nq(ctx, L(ctx, `a = ${a} cm, b = ${b} cm. Koliko celih c (v cm) je možnih?`, `a = ${a} cm, b = ${b} cm. How many whole-cm values can c take?`), cnt, "", [cnt + 2, cnt + 1, a + b - 1, b - a], { int: true });
});
const EN_RULE = { SSS: "SSS", SKS: "SAS", KSK: "ASA", SsK: "SsA", KKK: "AAA" };

def("m2_tripts", "ge", 7, "T", "Značilne točke trikotnika", "Special points of a triangle", (t, ctx) => {
  if (t >= 2 && Math.random() < 0.35) {
    const k = R(2, 9);
    const r = Math.random();
    if (t === 2 && r < 0.5) return nq(ctx, L(ctx, `Težiščnica meri ${3 * k} cm. Razdalja od oglišča do težišča?`, `A median is ${3 * k} cm. Vertex to centroid?`), 2 * k, " cm", [k, 1.5 * k, 3 * k], { step: 1 });
    if (t === 2) return nq(ctx, L(ctx, `Pravokotni △ s hipotenuzo ${2 * k} cm. Polmer očrtane krožnice?`, `Right △ with hypotenuse ${2 * k} cm. Circumradius?`), k, " cm", [2 * k, 4 * k, k / 2], { step: 1 });
    if (r < 0.5) return nq(ctx, L(ctx, `Težiščnica meri ${3 * k} cm. Od težišča do razpolovišča?`, `A median is ${3 * k} cm. Centroid to the side's midpoint?`), k, " cm", [2 * k, 1.5 * k, 3 * k], { step: 1 });
    return nq(ctx, L(ctx, `Enakostranični △ z višino ${3 * k} cm. Polmer očrtane krožnice?`, `Equilateral △ with height ${3 * k} cm. Circumradius?`), 2 * k, " cm", [k, 1.5 * k, 3 * k], { step: 1 });
  }
  return TRIPTS(t, ctx);
});
const TRIPTS = bank([
  [1, "Težišče je presečišče?|težiščnic|nosilk višin|simetral stranic|simetral kotov", "The centroid is where these meet?|medians|altitudes|perp. bisectors|angle bisectors"],
  [1, "Višinska točka je presečišče?|nosilk višin|težiščnic|simetral stranic|simetral kotov", "The orthocentre is where these meet?|altitudes (lines)|medians|perp. bisectors|angle bisectors"],
  [1, "Središče očrtane krožnice je presečišče?|simetral stranic|simetral kotov|nosilk višin|težiščnic", "The circumcentre is where these meet?|perp. bisectors|angle bisectors|altitudes|medians"],
  [1, "Središče včrtane krožnice je presečišče?|simetral kotov|simetral stranic|nosilk višin|težiščnic", "The incentre is where these meet?|angle bisectors|perp. bisectors|altitudes|medians"],
  [1, "Težiščnica gre iz oglišča do … nasprotne stranice?|razpolovišča|vznožja višine|krajišča|podaljška", "A median goes from a vertex to the?|midpoint of a side|foot of an altitude|another vertex|circle centre"],
  [1, "Višina trikotnika je na stranico?|pravokotna|vzporedna|enako dolga|pod kotom 45°", "An altitude is to its side?|perpendicular|parallel|equal|at 45°"],
  [1, "Središče očrtane krožnice je enako oddaljeno od?|oglišč|stranic|težišča|višin", "The circumcentre is equidistant from the?|vertices|sides|centroid|altitudes"],
  [1, "Središče včrtane krožnice je enako oddaljeno od?|stranic|oglišč|težišča|razpolovišč", "The incentre is equidistant from the?|sides|vertices|centroid|midpoints"],
  [1, "Težišče deli težiščnico v razmerju (od oglišča)?|2 : 1|1 : 2|1 : 1|3 : 1", "The centroid divides a median (from the vertex) in?|2 : 1|1 : 2|1 : 1|3 : 1"],
  [1, "Koliko težiščnic ima trikotnik?|3|1|2|6", "How many medians does a triangle have?|3|1|2|6"],
  [1, "Kje leži težišče vsakega trikotnika?|znotraj trikotnika|zunaj trikotnika|na stranici|v oglišču", "Where is the centroid of any triangle?|inside|outside|on a side|at a vertex"],
  [1, "Kje leži središče včrtane krožnice?|znotraj trikotnika|zunaj trikotnika|na stranici|v oglišču", "Where is the incentre?|inside|outside|on a side|at a vertex"],
  [1, "Krožnica skozi vsa tri oglišča je?|očrtana krožnica|včrtana krožnica|enotska krožnica|težiščnica", "The circle through all three vertices is the?|circumcircle|incircle|unit circle|median"],
  [1, "Krožnica, ki se dotika vseh treh stranic, je?|včrtana krožnica|očrtana krožnica|enotska krožnica|višina", "The circle touching all three sides is the?|incircle|circumcircle|unit circle|altitude"],
  [2, "Topokotni △: središče očrtane krožnice je?|zunaj trikotnika|znotraj trikotnika|na stranici|v oglišču", "Obtuse △: the circumcentre lies?|outside|inside|on a side|at a vertex"],
  [2, "Ostrokotni △: središče očrtane krožnice je?|znotraj trikotnika|zunaj trikotnika|na stranici|v oglišču", "Acute △: the circumcentre lies?|inside|outside|on a side|at a vertex"],
  [2, "Pravokotni △: središče očrtane krožnice je?|na hipotenuzi|zunaj trikotnika|v oglišču C|na kateti", "Right △: the circumcentre lies?|on the hypotenuse|outside|at vertex C|on a leg"],
  [2, "Topokotni △: višinska točka je?|zunaj trikotnika|znotraj trikotnika|na stranici|v težišču", "Obtuse △: the orthocentre lies?|outside|inside|on a side|at the centroid"],
  [2, "Ostrokotni △: višinska točka je?|znotraj trikotnika|zunaj trikotnika|na stranici|v oglišču", "Acute △: the orthocentre lies?|inside|outside|on a side|at a vertex"],
  [2, "Pravokotni △ (γ = 90°): višinska točka je?|v oglišču C|v oglišču A|zunaj trikotnika|na hipotenuzi", "Right △ (γ = 90°): the orthocentre is?|at vertex C|at vertex A|outside|on the hypotenuse"],
  [2, "Enakostranični △: težišče in središče očrtane krožnice?|sovpadata|sta različni točki|sta zunaj|sta na stranici", "Equilateral △: centroid and circumcentre?|coincide|are different|are outside|are on a side"],
  [3, "Središče očrtane krožnice je na stranici, ko je △?|pravokoten|ostrokoten|topokoten|enakostraničen", "The circumcentre is on a side when the △ is?|right-angled|acute|obtuse|equilateral"],
  [3, "Višinska točka je v oglišču, ko je △?|pravokoten|ostrokoten|topokoten|enakostraničen", "The orthocentre is at a vertex when the △ is?|right-angled|acute|obtuse|equilateral"],
  [3, "Višinska točka je zunaj △, ko je △?|topokoten|ostrokoten|pravokoten|enakostraničen", "The orthocentre is outside when the △ is?|obtuse|acute|right-angled|equilateral"],
  [3, "Polmer včrtane krožnice merimo do stranice?|pravokotno|vzporedno|pod kotom 45°|do oglišča", "The inradius is measured to a side?|perpendicularly|parallel to it|at 45°|to a vertex"],
]);

def("m2_quadkind", "ge", 7, "▱", "Vrste štirikotnikov", "Types of quadrilaterals", (t, ctx) => {
  if (t === 1) {
    const al = R(25, 85) + (Math.random() < 0.5 ? 0 : 70);
    if (al === 90) return nq(ctx, L(ctx, `Paralelogram: α = 80°. β = ?`, `Parallelogram: α = 80°. β = ?`), 100, "°", [80, 280, 10], { int: true });
    const sh = pick([["Paralelogram", "Parallelogram"], ["Romb", "Rhombus"]]);
    const which = pick(["β", "γ", "δ"]);
    const ans = which === "γ" ? al : 180 - al;
    return nq(ctx, L(ctx, `${sh[0]}: α = ${al}°. ${which} = ?`, `${sh[1]}: α = ${al}°. ${which} = ?`), ans, "°", [which === "γ" ? 180 - al : al, 360 - al, Math.abs(90 - al) || 45, 360 - 2 * al > 0 ? 360 - 2 * al : 2 * al - 180], { int: true, step: 5 });
  }
  if (t === 2) {
    const r = Math.random();
    if (r < 0.35) {
      const al = R(40, 85), w = pick(["δ", "β"]);
      // trapez ABCD, a ∥ c: α + δ = 180°; β ni določen z α
      if (w === "δ") return nq(ctx, L(ctx, `Trapez (a ∥ c): α = ${al}°. δ = ?`, `Trapezium (a ∥ c): α = ${al}°. δ = ?`), 180 - al, "°", [al, 360 - al, 90 - al, 2 * al], { int: true, step: 5 });
      const be = R(40, 85);
      return nq(ctx, L(ctx, `Trapez (a ∥ c): α = ${al}°, β = ${be}°. γ = ?`, `Trapezium (a ∥ c): α = ${al}°, β = ${be}°. γ = ?`), 180 - be, "°", [180 - al, 360 - al - be, be, 180 - al - be > 0 ? 180 - al - be : al], { int: true, step: 5 });
    }
    if (r < 0.65) {
      const al = R(40, 85), w = pick(["β", "γ", "δ"]);
      const ans = w === "β" ? al : 180 - al;
      return nq(ctx, L(ctx, `Enakokraki trapez (a ∥ c): α = ${al}°. ${w} = ?`, `Isosceles trapezium (a ∥ c): α = ${al}°. ${w} = ?`), ans, "°", [w === "β" ? 180 - al : al, 360 - al, 90 + al, 2 * al], { int: true, step: 5 });
    }
    const al = R(6, 14) * 10, ga = R(4, 12) * 10;
    if (al + ga >= 340 || al === ga) return nq(ctx, L(ctx, `Deltoid (β = δ): α = 80°, γ = 60°. β = ?`, `Kite (β = δ): α = 80°, γ = 60°. β = ?`), 110, "°", [220, 140, 100, 70], { int: true });
    const be = (360 - al - ga) / 2;
    return nq(ctx, L(ctx, `Deltoid (β = δ): α = ${al}°, γ = ${ga}°. β = ?`, `Kite (β = δ): α = ${al}°, γ = ${ga}°. β = ?`), be, "°", [360 - al - ga, 180 - (al + ga) / 2 === be ? be + 10 : 180 - (al + ga) / 2, (180 - al - ga) > 0 ? 180 - al - ga : be + 20, 180 - al], { int: true, step: 5 });
  }
  if (Math.random() < 0.3) return t3QuadAngle(ctx);
  return QUADK(t, ctx);
});
function t3QuadAngle(ctx) {
  const a = R(50, 110), b = R(60, 120), c = R(50, 110), d = 360 - a - b - c;
  if (d <= 20 || d >= 180) return t3QuadAngle(ctx);
  return nq(ctx, L(ctx, `Štirikotnik: α = ${a}°, β = ${b}°, γ = ${c}°. δ = ?`, `Quadrilateral: α = ${a}°, β = ${b}°, γ = ${c}°. δ = ?`), d, "°", [180 - (a + b + c - 180), 540 - a - b - c, Math.abs(180 - a - b - c) || d + 10, d + 20], { int: true, step: 10 });
}
const QUADK = bank([
  [3, "V vsakem rombu sta diagonali?|pravokotni|enako dolgi|vzporedni|enaki stranici", "In every rhombus the diagonals are?|perpendicular|equal|parallel|equal to a side"],
  [3, "V vsakem pravokotniku sta diagonali?|enako dolgi|pravokotni|vzporedni|različno dolgi", "In every rectangle the diagonals are?|equal|perpendicular|parallel|unequal"],
  [3, "V vsakem paralelogramu diagonali?|se razpolavljata|sta pravokotni|sta enako dolgi|sta vzporedni", "In every parallelogram the diagonals?|bisect each other|are perpendicular|are equal|are parallel"],
  [3, "V vsakem deltoidu sta diagonali?|pravokotni|enako dolgi|vzporedni|enaki stranici", "In every kite the diagonals are?|perpendicular|equal|parallel|equal to a side"],
  [3, "Štirikotnik z dvema paroma vzporednih stranic je vedno?|paralelogram|pravokotnik|romb|kvadrat", "Two pairs of parallel sides: it is always a?|parallelogram|rectangle|rhombus|square"],
  [3, "Paralelogram s pravim kotom je vedno?|pravokotnik|romb|deltoid|kvadrat", "A parallelogram with a right angle is always a?|rectangle|rhombus|kite|square"],
  [3, "Paralelogram z enako dolgimi stranicami je vedno?|romb|pravokotnik|kvadrat|pravokotni trapez", "A parallelogram with equal sides is always a?|rhombus|rectangle|square|right trapezium"],
  [3, "Štirikotnik z AB = AD in CB = CD je vedno?|deltoid|romb|paralelogram|kvadrat", "A quadrilateral with AB = AD, CB = CD is always a?|kite|rhombus|parallelogram|square"],
  [3, "V vsakem paralelogramu sta nasprotna kota?|enako velika|suplementarna|komplementarna|prava", "In every parallelogram opposite angles are?|equal|supplementary|complementary|right"],
  [3, "Sosednja kota paralelograma sta vedno?|suplementarna|enako velika|komplementarna|prava", "Adjacent angles of a parallelogram are always?|supplementary|equal|complementary|right"],
  [3, "Vsota notranjih kotov štirikotnika?|360°|180°|540°|720°", "Sum of interior angles of a quadrilateral?|360°|180°|540°|720°"],
  [3, "Koliko diagonal ima štirikotnik?|2|4|1|3", "How many diagonals does a quadrilateral have?|2|4|1|3"],
  [3, "Koliko parov vzporednih stranic ima paralelogram?|2|1|0|4", "How many pairs of parallel sides has a parallelogram?|2|1|0|4"],
]);

def("m2_quadcon", "ge", 7, "□✎", "Načrtovanje štirikotnikov", "Constructing quadrilaterals", (t, ctx) => QUADC(t, ctx));
const QUADC = bank([
  [1, "S koliko podatki je določen kvadrat?|1|2|3|4", "How many measurements fix a square?|1|2|3|4"],
  [1, "S koliko podatki je določen pravokotnik?|2|1|3|4", "How many measurements fix a rectangle?|2|1|3|4"],
  [1, "S koliko podatki je določen romb?|2|1|3|4", "How many measurements fix a rhombus?|2|1|3|4"],
  [1, "S koliko podatki je določen paralelogram?|3|2|4|5", "How many measurements fix a parallelogram?|3|2|4|5"],
  [1, "S koliko podatki je določen deltoid?|3|2|4|5", "How many measurements fix a kite?|3|2|4|5"],
  [1, "S koliko podatki je določen trapez?|4|3|5|2", "How many measurements fix a trapezium?|4|3|5|2"],
  [1, "S koliko podatki je določen splošni štirikotnik?|5|4|3|6", "How many measurements fix a general quadrilateral?|5|4|3|6"],
  [1, "S koliko podatki je določen enakokraki trapez?|3|2|4|5", "How many measurements fix an isosceles trapezium?|3|2|4|5"],
  [1, "S koliko podatki je določen trikotnik?|3|2|4|1", "How many measurements fix a triangle?|3|2|4|1"],
  [1, "S koliko podatki je določen enakostranični △?|1|2|3|0", "How many measurements fix an equilateral △?|1|2|3|0"],
  [1, "S koliko podatki je določen enakokraki △?|2|1|3|4", "How many measurements fix an isosceles △?|2|1|3|4"],
  [1, "S koliko podatki je določen pravokotni △?|2|1|3|4", "How many measurements fix a right △?|2|1|3|4"],
  [2, "Paralelogram iz a, b, α: prvi △ po izreku?|SKS|SSS|KSK|SsK", "Parallelogram from a, b, α: first △ by?|SAS|SSS|ASA|SsA"],
  [2, "Paralelogram iz a, b, e: prvi △ po izreku?|SSS|SKS|KSK|SsK", "Parallelogram from a, b, e: first △ by?|SSS|SAS|ASA|SsA"],
  [2, "Paralelogram iz a, e, f: prvi △ po izreku?|SSS|SKS|KSK|SsK", "Parallelogram from a, e, f: first △ by?|SSS|SAS|ASA|SsA"],
  [2, "Romb iz a in α: prvi △ po izreku?|SKS|SSS|KSK|SsK", "Rhombus from a and α: first △ by?|SAS|SSS|ASA|SsA"],
  [2, "Romb iz a in e: prvi △ po izreku?|SSS|SKS|KSK|SsK", "Rhombus from a and e: first △ by?|SSS|SAS|ASA|SsA"],
  [2, "Romb iz diagonal e in f: prvi △ po izreku?|SKS|SSS|KSK|SsK", "Rhombus from diagonals e and f: first △ by?|SAS|SSS|ASA|SsA"],
  [2, "Pravokotnik iz a in b: prvi △ po izreku?|SKS|SSS|KSK|SsK", "Rectangle from a and b: first △ by?|SAS|SSS|ASA|SsA"],
  [2, "Pravokotnik iz a in diagonale e: prvi △?|SsK|SKS|SSS|KSK", "Rectangle from a and diagonal e: first △ by?|SsA|SAS|SSS|ASA"],
  [2, "Deltoid iz a, b, e (e = AC): prvi △ po izreku?|SSS|SKS|KSK|SsK", "Kite from a, b, e (e = AC): first △ by?|SSS|SAS|ASA|SsA"],
  [2, "Deltoid iz a, b in α: prvi △ po izreku?|SKS|SSS|KSK|SsK", "Kite from a, b and α: first △ by?|SAS|SSS|ASA|SsA"],
  [2, "Trapez iz a, b, c, d: pomožni △ po izreku?|SSS|SKS|KSK|SsK", "Trapezium from a, b, c, d: auxiliary △ by?|SSS|SAS|ASA|SsA"],
  [3, "Trapez iz a, b, c, d: stranice pomožnega △?|a − c, b, d|a, b, c|a + c, b, d|a, c, d", "Trapezium from a, b, c, d: auxiliary △ sides?|a − c, b, d|a, b, c|a + c, b, d|a, c, d"],
  [3, "V paralelogramu ABCD velja?|c = a, d = b|c = b, d = a|a = b|c = d", "In parallelogram ABCD?|c = a, d = b|c = b, d = a|a = b|c = d"],
  [3, "Diagonala e razdeli štirikotnik na?|dva trikotnika|dva štirikotnika|tri trikotnike|dva kvadrata", "Diagonal e splits a quadrilateral into?|two triangles|two quadrilaterals|three triangles|two squares"],
  [3, "Splošni štirikotnik: prvi △ iz 3 podatkov, nato še?|2|3|1|0", "General quadrilateral: first △ uses 3 values, then?|2|3|1|0"],
  [3, "S koliko podatki je določen pravokotni trapez?|3|2|4|5", "How many measurements fix a right trapezium?|3|2|4|5"],
]);

def("m2_pie", "st", 7, "◔", "Tortni prikaz", "Pie charts", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.6) {
      const p = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75]);
      return nq(ctx, L(ctx, `Delež ${pct(ctx, p)}. Središčni kot izseka?`, `A ${pct(ctx, p)} share. Sector angle?`), 3.6 * p, "°", [p, 2 * p, 3.6 * p * 2, 360 - 3.6 * p], { step: 18 });
    }
    const [n, d] = pick([[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 3], [3, 4], [1, 8], [3, 8], [2, 5], [1, 10], [1, 12]]);
    return nq(ctx, L(ctx, `Izsek je ${n}/${d} kroga. Središčni kot?`, `A ${n}/${d} share. Sector angle?`), (360 * n) / d, "°", [(180 * n) / d, (100 * n) / d, 360 - (360 * n) / d, (360 * d) / n > 360 ? 90 * n : (360 * d) / n], { step: 10 });
  }
  if (t === 2) {
    const r = Math.random();
    if (r < 0.35) {
      const p = pick([5, 10, 15, 20, 25, 30, 40, 45, 50, 60, 70, 75, 80]), a = 3.6 * p;
      return nq(ctx, L(ctx, `Izsek s kotom ${ctx.num(a)}°. Koliko odstotkov?`, `A ${ctx.num(a)}° sector. What percentage?`), p, L(ctx, " %", "%"), [a, a / 10, 100 - p, 2 * p], { step: 5 });
    }
    if (r < 0.7) {
      const [n, d] = pick([[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 3], [3, 4], [1, 8], [3, 8], [2, 5], [3, 5], [1, 10], [3, 10], [1, 12], [5, 12]]);
      const N = d * R(2, 8), k = (N * n) / d;
      return nq(ctx, L(ctx, `Rdeča barva: ${k} od ${N} vprašanih. Kot izseka?`, `${k} of ${N} chose red. Sector angle?`), (360 * k) / N, "°", [k, (100 * k) / N, (180 * k) / N, 360 - (360 * k) / N], { step: 10 });
    }
    const a = R(4, 14) * 10, b = R(4, 14) * 10;
    if (a + b >= 340) return nq(ctx, L(ctx, `Izseka merita 120° in 90°. Tretji, zadnji izsek?`, `Sectors: 120° and 90°. The third (last)?`), 150, "°", [210, 30, 180, 60], { int: true });
    return nq(ctx, L(ctx, `Izseka merita ${a}° in ${b}°. Tretji, zadnji izsek?`, `Sectors: ${a}° and ${b}°. The third (last)?`), 360 - a - b, "°", [180 - a - b > 0 ? 180 - a - b : a + b, 100 - a - b > 0 ? 100 - a - b : 360 - a, a + b, 360 - a], { int: true, step: 10 });
  }
  const deg = pick([90, 120, 180, 72, 60, 36, 45, 30, 144, 108, 54, 18, 40, 150, 135, 216, 270, 240]);
  const N = pick([60, 120, 180, 240, 360, 40, 80, 200, 30, 24].filter((x) => (x * deg) % 360 === 0 && x !== deg));
  const k = (N * deg) / 360;
  return nq(ctx, L(ctx, `Vprašanih je ${N}, izsek meri ${deg}°. Koliko oseb?`, `${N} people asked; a sector is ${deg}°. How many people?`), k, "", [deg, (N * deg) / 100, N - k, Math.round((k * 3) / 2)], { int: true });
});

// =====================================================================
// 8. RAZRED
// =====================================================================
def("m2_real", "nt", 8, "√2", "Realna števila", "Real numbers", (t, ctx) => {
  const IRR = ["√2", "√3", "√5", "√7", "π", "√10", "√12", "√15", "2√3", "√20", "√8", "3√2", "√6", "−√5", "√2 + 1"];
  const RAT = () => [["√4"], ["√9"], ["√16"], ["√25"], ["√36"], ["√49"], ["√100"], [ctx.num(0.5)], ["3/4"], [M + "2"], [ctx.num(1.25)], ["22/7"], [ctx.num(3.14)], [M + "√9"], ["√1"]].map((x) => x[0]);
  if (t === 1) {
    if (Math.random() < 0.5) return out(L(ctx, "Katero število je iracionalno?", "Which number is irrational?"), pick(IRR), shuffle(RAT()).slice(0, 4));
    return out(L(ctx, "Katero število je racionalno?", "Which number is rational?"), pick(RAT()), shuffle(IRR).slice(0, 4));
  }
  if (t === 2) {
    let n;
    do n = R(2, 150); while (Number.isInteger(Math.sqrt(n)));
    const k = Math.floor(Math.sqrt(n)), between = (a) => L(ctx, `${a} in ${a + 1}`, `${a} and ${a + 1}`);
    const half = Math.floor(n / 2);
    return out(L(ctx, `Med katerima zaporednima celima številoma je √${n}?`, `Between which consecutive integers is √${n}?`), between(k), [between(k - 1), between(k + 1), half !== k && half - 1 !== k ? between(half) : between(k + 2), k > 1 ? between(k - 2) : between(k + 3)]);
  }
  if (Math.random() < 0.4) {
    let n;
    do n = R(3, 99); while (Number.isInteger(Math.sqrt(n)));
    const k = Math.floor(Math.sqrt(n));
    return nq(ctx, L(ctx, `Koliko celih števil je med ${M}√${n} in √${n}?`, `How many integers lie between ${M}√${n} and √${n}?`), 2 * k + 1, "", [2 * k, k, 2 * k + 2, k + 1], { int: true });
  }
  const POOL = [["π", Math.PI], ["√10", Math.sqrt(10)], [ctx.num(3.1), 3.1], ["√8", Math.sqrt(8)], ["3", 3], ["10/3", 10 / 3], ["√11", Math.sqrt(11)], [ctx.num(3.2), 3.2], ["2√2", 2 * Math.sqrt(2)], [ctx.num(2.9), 2.9], ["√13", Math.sqrt(13)], ["7/2", 3.5],
    ["√3", Math.sqrt(3)], ["√5", Math.sqrt(5)], ["2", 2], [ctx.num(1.8), 1.8], ["7/4", 1.75], [ctx.num(2.2), 2.2], ["√6", Math.sqrt(6)], ["5/2", 2.5], ["√7", Math.sqrt(7)], ["8/3", 8 / 3]];
  let sel;
  for (;;) {
    sel = shuffle(POOL).slice(0, 4);
    const v = sel.map((x) => x[1]).sort((a, b) => a - b);
    if (v.every((x, i) => i === 0 || x - v[i - 1] >= 0.04)) break;
  }
  const big = Math.random() < 0.5;
  const ans = sel.reduce((a, b) => ((big ? b[1] > a[1] : b[1] < a[1]) ? b : a));
  return out(L(ctx, big ? "Katero število je največje?" : "Katero število je najmanjše?", big ? "Which number is the largest?" : "Which number is the smallest?"), ans[0], sel.filter((x) => x !== ans).map((x) => x[0]));
});

const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [12, 5, 13], [4, 3, 5], [8, 6, 10], [15, 8, 17]];
def("m2_pythuse", "ge", 8, "◪", "Uporaba Pitagorovega izreka", "Using Pythagoras' theorem", (t, ctx) => {
  const cm = (x) => ctx.num(x) + " cm";
  const rc = (k, m) => { const r = rootS(ctx, k, m); return r == null ? null : r + " cm"; };
  if (t === 1) {
    if (Math.random() < 0.55) {
      const [a, b, c] = pick(TRIPLES);
      return nq(ctx, L(ctx, `Pravokotnik ${a} cm × ${b} cm. Diagonala?`, `Rectangle ${a} cm × ${b} cm. Diagonal?`), c, " cm", [a + b, Math.abs(b - a), a * a + b * b, (a + b) / 2 === c ? c + 2 : (a + b) / 2]);
    }
    const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [1.5, 2, 2.5], [2.4, 3.2, 4], [1.2, 1.6, 2], [0.9, 1.2, 1.5], [1.8, 2.4, 3]]);
    return nq(ctx, L(ctx, `Lestev ${ctx.num(c)} m, vznožje ${ctx.num(a)} m od zidu. Kako visoko seže?`, `A ${ctx.num(c)} m ladder, foot ${ctx.num(a)} m from the wall. Height?`), b, " m", [c - a, c + a, (c + a) / 2, Math.round((c * c - a * a) * 100) / 100], { step: 0.5 });
  }
  if (t === 2) {
    const [a, b, c] = pick(TRIPLES);
    if (Math.random() < 0.5) {
      const base = 2 * a, forgot = c * c - base * base;
      return out(L(ctx, `Enakokraki △: osnovnica ${base} cm, krak ${c} cm. Višina?`, `Isosceles △: base ${base} cm, legs ${c} cm. Height?`), cm(b), [forgot > 0 ? rc(1, forgot) : null, cm(c - a), cm(2 * b), cm(c + a), rc(1, c * c + a * a)]);
    }
    return out(L(ctx, `Romb z diagonalama ${2 * a} cm in ${2 * b} cm. Stranica?`, `Rhombus with diagonals ${2 * a} cm and ${2 * b} cm. Side?`), cm(c), [cm(2 * c), cm(a + b), cm(c + 1), cm(4 * c)]);
  }
  const r = Math.random();
  if (r < 0.35) {
    const a = R(2, 12);
    return out(L(ctx, `Kvadrat s stranico ${a} cm. Diagonala?`, `Square with side ${a} cm. Diagonal?`), rc(a, 2), [cm(2 * a), rc(a, 3), rc(2 * a, 2), rc(a / 2, 2)]);
  }
  if (r < 0.7) {
    const a = R(2, 12);
    return out(L(ctx, `Enakostranični △ s stranico ${a} cm. Višina?`, `Equilateral △ with side ${a} cm. Height?`), rc(a / 2, 3), [rc(a, 3), rc(a / 2, 5), rc(a / 2, 2), cm(a)]);
  }
  const [x, h, l] = pick(TRIPLES.filter((tr) => tr[2] <= 17));
  const c = pick([2, 4, 6, 8, 10]), A = c + 2 * x;
  const forgot = l * l - (A - c) * (A - c);
  return out(L(ctx, `Enakokraki trapez: a = ${A} cm, c = ${c} cm, krak ${l} cm. Višina?`, `Isosceles trapezium: a = ${A} cm, c = ${c} cm, leg ${l} cm. h?`), cm(h), [forgot > 0 ? rc(1, forgot) : null, cm(l - x), cm(x), cm(l + x), rc(1, l * l + x * x)]);
});

const KRAT = { 2: ["Dvakratnik", "Twice"], 3: ["Trikratnik", "Three times"], 4: ["Štirikratnik", "Four times"], 5: ["Petkratnik", "Five times"] };
def("m2_eqwrite", "eq", 8, "x=?", "Zapis enačbe iz besedila", "Writing equations from words", (t, ctx) => {
  const kind = t === 1 ? R(1, 4) : t === 2 ? R(5, 7) : R(8, 11);
  const a = R(2, 9), k = R(2, 5);
  if (kind === 1) {
    const b = a + R(3, 20);
    return out(L(ctx, `Število, povečano za ${a}, je ${b}.`, `A number increased by ${a} is ${b}.`), `x + ${a} = ${b}`, [`x ${M} ${a} = ${b}`, `${a}x = ${b}`, `x = ${b} + ${a}`, `${a} ${M} x = ${b}`]);
  }
  if (kind === 2) {
    const b = R(3, 20);
    return out(L(ctx, `Število, zmanjšano za ${a}, je ${b}.`, `A number decreased by ${a} is ${b}.`), `x ${M} ${a} = ${b}`, [`${a} ${M} x = ${b}`, `x + ${a} = ${b}`, `x/${a} = ${b}`, `x = ${b} ${M} ${a}`]);
  }
  if (kind === 3) {
    const b = k * R(2, 12);
    return out(L(ctx, `${KRAT[k][0]} števila je ${b}.`, `${KRAT[k][1]} a number is ${b}.`), `${k}x = ${b}`, [`x + ${k} = ${b}`, `x/${k} = ${b}`, `x ${M} ${k} = ${b}`, `x${sup(k)} = ${b}`]);
  }
  if (kind === 4) {
    const [sl, en, d] = pick([["Polovica", "Half of", 2], ["Tretjina", "A third of", 3], ["Četrtina", "A quarter of", 4], ["Petina", "A fifth of", 5]]);
    const b = R(2, 15);
    return out(L(ctx, `${sl} števila je ${b}.`, `${en} a number is ${b}.`), `x/${d} = ${b}`, [`${d}x = ${b}`, `x ${M} ${d} = ${b}`, `${d}/x = ${b}`, `x + ${d} = ${b}`]);
  }
  if (kind === 5) {
    const b = R(5, 30);
    return out(L(ctx, `${KRAT[k][0]} števila, zmanjšan za ${a}, je ${b}.`, `${KRAT[k][1]} a number, minus ${a}, is ${b}.`), `${k}x ${M} ${a} = ${b}`, [`${k}(x ${M} ${a}) = ${b}`, `${k}x + ${a} = ${b}`, `x ${M} ${k * a} = ${b}`, `${a} ${M} ${k}x = ${b}`]);
  }
  if (kind === 6) {
    const b = k * R(a + 1, a + 10);
    return out(L(ctx, `${KRAT[k][0]} za ${a} večjega števila je ${b}.`, `${KRAT[k][1]} (a number plus ${a}) is ${b}.`), `${k}(x + ${a}) = ${b}`, [`${k}x + ${a} = ${b}`, `${k}(x ${M} ${a}) = ${b}`, `x + ${k * a} = ${b}`, `${k} + x + ${a} = ${b}`]);
  }
  if (kind === 7) {
    const b = R(a + 2, a + 12);
    return out(L(ctx, `Tretjina števila, povečana za ${a}, je ${b}.`, `A third of a number, plus ${a}, is ${b}.`), `x/3 + ${a} = ${b}`, [`(x + ${a})/3 = ${b}`, `3x + ${a} = ${b}`, `x/3 = ${a} + ${b}`, `x/${a} + 3 = ${b}`]);
  }
  if (kind === 8) {
    const b = 2 * R(5, 40) + 1;
    return out(L(ctx, `Vsota dveh zaporednih naravnih števil je ${b}.`, `Two consecutive whole numbers add up to ${b}.`), `x + (x + 1) = ${b}`, [`x + x = ${b}`, `x(x + 1) = ${b}`, `x + 1 = ${b}`, `x + 2x = ${b}`]);
  }
  if (kind === 9) {
    const kk = R(3, 5), x = R(6, 12), b = (kk + 1) * x;
    return out(L(ctx, `Sin ima x let, oče je ${kk}-krat starejši. Skupaj ${b} let.`, `Son is x, father ${kk} times as old. Ages total ${b}.`), `x + ${kk}x = ${b}`, [`${kk}x = ${b}`, `x + (x + ${kk}) = ${b}`, `x + ${kk} = ${b}`, `${kk}x ${M} x = ${b}`]);
  }
  if (kind === 10) {
    const d = R(1, 6), x = R(2, 10), o = 2 * x + 2 * (x + d);
    return out(L(ctx, `Pravokotnik: a = x, b je za ${d} cm daljša, o = ${o} cm.`, `Rectangle: a = x, b is ${d} cm longer, P = ${o} cm.`), `2x + 2(x + ${d}) = ${o}`, [`x + (x + ${d}) = ${o}`, `2x + x + ${d} = ${o}`, `x(x + ${d}) = ${o}`, `4x + ${d} = ${o}`]);
  }
  const d = R(2, 9), x = R(5, 20), b = 2 * x + d;
  return out(L(ctx, `V prvi škatli je x kroglic, v drugi za ${d} več. Skupaj ${b}.`, `Box 1 holds x balls, box 2 holds ${d} more. Total ${b}.`), `x + (x + ${d}) = ${b}`, [`x + ${d} = ${b}`, `x + ${d}x = ${b}`, `2x = ${b} + ${d}`, `x(x + ${d}) = ${b}`]);
});

def("m2_arc", "ge", 8, "◜", "Krožni lok in krožni izsek", "Arc length and sector area", (t, ctx) => {
  const pc = (k, u) => piS(ctx, Math.round(k * 1000) / 1000) + " " + u;
  const okk = (k) => k > 0 && Math.abs(k * 2 - Math.round(k * 2)) < 1e-9; // celo ali pol
  const ANG = [30, 36, 40, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270];
  let r, al;
  if (t === 1 || t === 2) {
    do { r = R(2, 12); al = pick(ANG); } while (!okk((t === 1 ? r * al : (r * r * al) / 2) / 180));
    if (t === 1) {
      const k = (r * al) / 180;
      const ws = [k / 2, 2 * k, (r * r * al) / 360].filter(okk).map((x) => pc(x, "cm"));
      return out(L(ctx, `r = ${r} cm, α = ${al}°. Dolžina krožnega loka?`, `r = ${r} cm, α = ${al}°. Arc length?`), pc(k, "cm"), [...ws, pc(k, "cm²"), pc(k + 1, "cm")]);
    }
    const k = (r * r * al) / 360;
    const ws = [2 * k, k / 2, (r * al) / 180, (r * al) / 360].filter(okk).map((x) => pc(x, "cm²"));
    return out(L(ctx, `r = ${r} cm, α = ${al}°. Ploščina krožnega izseka?`, `r = ${r} cm, α = ${al}°. Sector area?`), pc(k, "cm²"), [...ws, pc(k, "cm"), pc(k + 1, "cm²")]);
  }
  if (Math.random() < 0.6) {
    do { r = R(2, 12); al = pick(ANG); } while (!okk((r * al) / 180));
    const k = (r * al) / 180;
    return nq(ctx, L(ctx, `r = ${r} cm, lok l = ${pc(k, "cm")}. Središčni kot?`, `r = ${r} cm, arc l = ${pc(k, "cm")}. Central angle?`), al, "°", [al * 2, al / 2, (180 * r) / k, al + 30], { step: 10 });
  }
  const m = R(1, 6), [aa, f] = pick([[90, 4], [180, 2], [120, 3], [60, 6], [45, 8], [30, 12]]);
  const rr = f === 4 ? 2 * m : f === 2 ? m : m * (f === 3 ? 3 : f === 6 ? 6 : f === 8 ? 4 : 6);
  const k = (rr * rr) / f;
  if (!okk(k)) return nq(ctx, L(ctx, `α = 90°, ploščina izseka 4π cm². Polmer?`, `α = 90°, sector area 4π cm². Radius?`), 4, " cm", [2, 16, 8, 1], { int: true });
  return nq(ctx, L(ctx, `α = ${aa}°, ploščina izseka ${pc(k, "cm²")}. Polmer?`, `α = ${aa}°, sector area ${pc(k, "cm²")}. Radius?`), rr, " cm", [k, rr * rr, Math.sqrt(k), rr / 2, 2 * rr], { step: 1 });
});

// =====================================================================
// 9. RAZRED
// =====================================================================
const QUAD_NAMES = { sl: ["I. kvadrant", "II. kvadrant", "III. kvadrant", "IV. kvadrant"], en: ["quadrant I", "quadrant II", "quadrant III", "quadrant IV"] };
def("m2_graphs", "fn", 9, "xy", "Koordinatni sistem in odvisnost količin", "Coordinates and dependent quantities", (t, ctx) => {
  if (t === 1) {
    const x = R(1, 9) * pick([1, -1]), y = R(1, 9) * pick([1, -1]);
    if (Math.random() < 0.6) {
      const qi = x > 0 ? (y > 0 ? 0 : 3) : y > 0 ? 1 : 2;
      const names = QUAD_NAMES[ctx.lang === "sl" ? "sl" : "en"];
      return out(L(ctx, `V katerem kvadrantu leži T${pt(x, y)}?`, `In which quadrant is T${pt(x, y)}?`), names[qi], names.filter((_, i) => i !== qi));
    }
    const k = R(1, 9) * pick([1, -1]), m = R(1, 9);
    if (Math.random() < 0.5) return out(L(ctx, "Katera točka leži na osi y?", "Which point lies on the y-axis?"), pt(0, k), [pt(k, 0), pt(k, k), pt(1, k), pt(k, 1)].filter((s) => s !== pt(0, k)), [pt(m, m), pt(-m, m)]);
    return out(L(ctx, "Katera točka leži na osi x?", "Which point lies on the x-axis?"), pt(k, 0), [pt(0, k), pt(k, k), pt(k, 1), pt(1, k)].filter((s) => s !== pt(k, 0)), [pt(m, m), pt(m, -m)]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const k = R(1, 4) * pick([1, -1]), n = R(-5, 5), x = R(-4, 5);
      const y = k * x + n, on = (X, Y) => Y === k * X + n;
      const cands = [[y, x], [x, y + 1], [x, y - 1], [-x, y], [x, -y], [x + 1, y]].filter(([X, Y]) => !on(X, Y)).map(([X, Y]) => pt(X, Y));
      return out(L(ctx, `Katera točka leži na grafu y = ${lin(k, n)}?`, `Which point lies on y = ${lin(k, n)}?`), pt(x, y), cands);
    }
    const k = R(2, 9), x1 = R(2, 6);
    let x2 = R(2, 12);
    while (x2 === x1) x2 = R(2, 12);
    return nq(ctx, L(ctx, `Premo sorazmerje: pri x = ${x1} je y = ${k * x1}. y pri x = ${x2}?`, `Direct proportion: x = ${x1} gives y = ${k * x1}. y at x = ${x2}?`), k * x2, "", [k * x1 + (x2 - x1), (k * x1 * x1) / x2, k * x2 + k, x2 * x1], { int: true, neg: true });
  }
  const r = Math.random();
  if (r < 0.35) {
    const a = R(2, 5), b = R(1, 4);
    return out(L(ctx, `Taksi: ${a} € zagon in ${b} € na km. Cena y za x km?`, `Taxi: ${a} € start plus ${b} € per km. Cost y for x km?`), `y = ${lin(b, a)}`, [`y = ${lin(a, b)}`, `y = ${lin(a + b, 0)}`, `y = ${lin(b, 0)}`, `y = ${lin(b, -a)}`]);
  }
  if (r < 0.7) {
    const V = pick([100, 200, 300, 500, 120, 240]), q = pick([2, 4, 5, 10, 20]);
    return out(L(ctx, `V sodu je ${V} L, odteka ${q} L na minuto. Ostanek y po x min?`, `A tank holds ${V} L and loses ${q} L/min. Left y after x min?`), `y = ${V} ${M} ${q}x`, [`y = ${V} + ${q}x`, `y = ${q}x ${M} ${V}`, `y = ${V}x ${M} ${q}`, `y = ${q}x`]);
  }
  const p = pick([1.5, 2, 2.5, 3, 4, 1.2, 0.8]);
  return out(L(ctx, `1 kg stane ${ctx.num(p)} €. Cena y za x kg?`, `1 kg costs ${ctx.num(p)} €. Cost y of x kg?`), `y = ${ctx.num(p)}x`, [`y = x + ${ctx.num(p)}`, `y = x/${ctx.num(p)}`, `y = ${ctx.num(p)}`, `x = ${ctx.num(p)}y`]);
});

def("m2_word9", "eq", 9, "?=", "Besedilne naloge z enačbami", "Word problems with equations", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.6) {
      const x = R(5, 40), n = pick([2, 3]);
      const s = n === 2 ? 2 * x + 1 : 3 * x + 3;
      return nq(ctx, L(ctx, `Vsota ${n === 2 ? "dveh" : "treh"} zaporednih naravnih števil je ${s}. ${n === 2 ? "Manjše" : "Najmanjše"}?`, `${n === 2 ? "Two" : "Three"} consecutive whole numbers sum to ${s}. ${n === 2 ? "Smaller" : "Smallest"}?`), x, "", [x + 1, n === 3 ? x + 2 : Math.round(s / 2), s / n, x - 1], { int: true });
    }
    const [f, sl, en] = pick([[2, "polovico", "half of itself"], [3, "tretjino", "a third of itself"], [4, "četrtino", "a quarter of itself"]]);
    const x = f * R(2, 12), s = x + x / f;
    return nq(ctx, L(ctx, `Število, povečano za svojo ${sl}, je ${s}. Število?`, `A number plus ${en} is ${s}. The number?`), x, "", [s - s / f, s / 2, (s * f) / (f - 1), x + f], { int: true });
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const b = R(2, 15), d = R(1, 8), o = 2 * (2 * b + d);
      return nq(ctx, L(ctx, `Obseg pravokotnika je ${o} cm, a je za ${d} cm daljša od b. b = ?`, `Rectangle perimeter ${o} cm, a is ${d} cm longer than b. b = ?`), b, " cm", [b + d, (o - d) / 2, o / 4, (o / 2 - d) / 4], { step: 1 });
    }
    let m, S, x, F;
    do { m = R(2, 4); S = R(5, 14); x = R(2, 12); F = m * (S + x) - x; } while (F < 25 || F > 60 || F <= m * S);
    return nq(ctx, L(ctx, `Oče ${F} let, sin ${S}. Čez koliko let bo oče ${m}-krat starejši?`, `Dad ${F}, son ${S}. In how many years is dad ${m}× as old?`), x, "", [F - m * S, (F - m * S) / m, x + 1, F / m - S], { int: true });
  }
  if (Math.random() < 0.5) {
    const h = R(10, 30), z = R(2, h - 2), legs = 4 * z + 2 * (h - z);
    return nq(ctx, L(ctx, `Kokoši in zajci: ${h} glav, ${legs} nog. Koliko je zajcev?`, `Hens and rabbits: ${h} heads, ${legs} legs. Rabbits?`), z, "", [h - z, legs / 4, legs - 2 * h, Math.round(legs / 6)], { int: true });
  }
  const n = R(8, 25), x = R(2, n - 2), sum = 2 * x + (n - x);
  return nq(ctx, L(ctx, `${n} kovancev po 1 € in 2 €, skupaj ${sum} €. Kovancev po 2 €?`, `${n} coins of 1 € and 2 € make ${sum} €. How many 2 € coins?`), x, "", [n - x, sum / 2, sum - n + 1, Math.round(sum / 3)], { int: true });
});

def("m2_thales", "ge", 9, "S∥", "Talesov izrek o sorazmerjih", "Intercept theorem", (t, ctx) => {
  if (t === 1) {
    const [p, q] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5], [3, 7], [4, 5]]);
    const k = R(1, 4), Ld = (p + q) * k;
    const short = Math.random() < 0.5;
    const ans = (short ? p : q) * k;
    return nq(ctx, L(ctx, `Daljico ${Ld} cm razdelimo v razmerju ${p} : ${q}. ${short ? "Krajši" : "Daljši"} del?`, `Segment ${Ld} cm, split in the ratio ${p} : ${q}. ${short ? "Shorter" : "Longer"} part?`), ans, " cm", [(short ? q : p) * k, Ld / 2, (Ld * (short ? p : q)) / ((short ? q : p) || 1), Ld / (p + q)], { step: 1 });
  }
  if (t === 2) {
    const a = R(2, 6), b = a + R(1, 6), f = pick([1.5, 2, 3, 0.5, 2.5]);
    const a2 = a * f, b2 = b * f;
    if (!nice(a2) || !nice(b2)) return nq(ctx, `AA′ ∥ BB′: SA = 4, SB = 6, SA′ = 6. SB′ = ?`, 9, "", [8, 4, 12, 10]);
    if (Math.random() < 0.5) return nq(ctx, `AA′ ∥ BB′: SA = ${a}, SB = ${b}, SA′ = ${ctx.num(a2)}. SB′ = ?`, b2, "", [a2 + (b - a), (a2 * a) / b, b * a, b2 + 1], { step: 0.5 });
    return nq(ctx, `AA′ ∥ BB′: SA = ${a}, AB = ${b - a}, SA′ = ${ctx.num(a2)}. A′B′ = ?`, b2 - a2, "", [b2, b - a, a2 - (b - a), (a2 * (b - a)) / b], { step: 0.5 });
  }
  if (Math.random() < 0.5) {
    const a = R(2, 6), ab = R(1, 5), f = pick([1.5, 2, 3, 2.5]);
    const b = a + ab, aa = a * f, bb = b * f;
    return nq(ctx, `AA′ ∥ BB′: SA = ${a}, AB = ${ab}, AA′ = ${ctx.num(aa)}. BB′ = ?`, bb, "", [(aa * ab) / a, aa + ab, (aa * a) / b, aa * 2], { step: 0.5 });
  }
  const [h, s] = pick([[2, 3], [1, 2], [1.5, 2], [2, 5], [1, 1.5], [1.2, 2], [1.6, 2], [2, 1]]);
  const big = s * pick([4, 5, 6, 8, 10]), H = (h * big) / s;
  return nq(ctx, L(ctx, `Palica ${ctx.num(h)} m: senca ${ctx.num(s)} m. Drevo: senca ${ctx.num(big)} m. Višina drevesa?`, `Pole ${ctx.num(h)} m: shadow ${ctx.num(s)} m. Tree: shadow ${ctx.num(big)} m. Tree height?`), H, " m", [(s * big) / h, big + (h - s), big, H + 1], { step: 1 });
});

def("m2_prism", "ge", 9, "⬡", "Prizma", "Prisms", (t, ctx) => {
  if (t === 1) {
    const n = R(3, 8), w = pick([0, 1, 2]);
    const ans = [n + 2, 3 * n, 2 * n][w];
    const what = L(ctx, ["ploskev", "robov", "oglišč"][w], ["faces", "edges", "vertices"][w]);
    return nq(ctx, L(ctx, `Koliko ${what} ima ${n}-strana prizma?`, `How many ${what} does a prism with ${n === 8 ? "an" : "a"} ${n}-gon base have?`), ans, "", [n + 2, 3 * n, 2 * n, n, 2 * n + 2, n + 1], { int: true });
  }
  if (t === 2) {
    const a = R(2, 8), v = R(3, 12);
    const V = a * a * v, P = 2 * a * a + 4 * a * v;
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Pravilna 4-strana prizma: a = ${a} cm, v = ${v} cm. V = ?`, `Square prism: a = ${a} cm, h = ${v} cm. Volume?`), V, " cm³", [a * v, 4 * a * v, P, a * a + v], { int: true });
    return nq(ctx, L(ctx, `Pravilna 4-strana prizma: a = ${a} cm, v = ${v} cm. P = ?`, `Square prism: a = ${a} cm, h = ${v} cm. Surface area?`), P, " cm²", [V, 4 * a * v, a * a + 4 * a * v, 2 * a * a + a * v], { int: true });
  }
  const [x, y, z] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]]);
  const v = R(2, 12);
  const B = (x * y) / 2;
  if (Math.random() < 0.5) return nq(ctx, L(ctx, `Osnova: pravokotni △ ${x}, ${y}, ${z} cm; v = ${v} cm. V = ?`, `Base: right △ ${x}, ${y}, ${z} cm; h = ${v} cm. V = ?`), B * v, " cm³", [x * y * v, x * y * z, (x + y + z) * v, (B * v) / 3], { int: true });
  const P = 2 * B + (x + y + z) * v;
  return nq(ctx, L(ctx, `Osnova: pravokotni △ ${x}, ${y}, ${z} cm; v = ${v} cm. P = ?`, `Base: right △ ${x}, ${y}, ${z} cm; h = ${v} cm. Surface?`), P, " cm²", [B + (x + y + z) * v, (x + y + z) * v, 2 * x * y + (x + y + z) * v, B * v], { int: true });
});

// [a, v, v₁]: (a/2, v, v₁) je pitagorejska trojica; v₁ = višina stranske ploskve
const PYR = [[6, 4, 5], [8, 3, 5], [12, 8, 10], [16, 6, 10], [10, 12, 13], [24, 5, 13], [18, 12, 15], [24, 9, 15], [16, 15, 17], [30, 8, 17], [24, 16, 20], [32, 12, 20], [14, 24, 25], [4, 1.5, 2.5], [12, 4.5, 7.5]];
def("m2_pyramid", "ge", 9, "▲", "Piramida", "Pyramids", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.6) {
      const n = R(3, 8), w = pick([0, 1, 2]);
      const ans = [n + 1, 2 * n, n + 1][w];
      const what = L(ctx, ["ploskev", "robov", "oglišč"][w], ["faces", "edges", "vertices"][w]);
      return nq(ctx, L(ctx, `Koliko ${what} ima ${n}-strana piramida?`, `How many ${what} does a pyramid with ${n === 8 ? "an" : "a"} ${n}-gon base have?`), ans, "", [n, 2 * n, 3 * n, n + 2, n + 1, 2 * n + 1], { int: true });
    }
    const a = R(2, 9), v = 3 * R(1, 5);
    return nq(ctx, L(ctx, `Pravilna 4-strana piramida: a = ${a} cm, v = ${v} cm. V = ?`, `Square pyramid: a = ${a} cm, h = ${v} cm. Volume?`), (a * a * v) / 3, " cm³", [a * a * v, (a * a * v) / 2, (a * v) / 3, (4 * a * v) / 3], { int: true });
  }
  const [a, v, va] = pick(PYR);
  const cm = (x) => ctx.num(x) + " cm";
  if (t === 2 && Math.random() < 0.6) {
    const sq = a * a + v * v, df = Math.abs(v * v - (a * a) / 4);
    return out(L(ctx, `Pravilna 4-strana piramida: a = ${ctx.num(a)} cm, v = ${ctx.num(v)} cm. v₁ = ?`, `Square pyramid: a = ${ctx.num(a)} cm, h = ${ctx.num(v)} cm. Slant height?`), cm(va), [Number.isInteger(sq) ? rootS(ctx, 1, sq) + " cm" : null, cm(a / 2 + v), cm(va + 1), cm(va - 1), Number.isInteger(df) && df > 0 ? rootS(ctx, 1, df) + " cm" : null, cm(a + v)]);
  }
  if (t === 2) {
    const A = R(2, 10), V = 3 * R(1, 6) * (A % 3 === 0 ? 1 : 1);
    return nq(ctx, L(ctx, `Pravilna 4-strana piramida: a = ${A} cm, v = ${V} cm. V = ?`, `Square pyramid: a = ${A} cm, h = ${V} cm. Volume?`), (A * A * V) / 3, " cm³", [A * A * V, (A * A * V) / 2, (4 * A * V) / 3, (A * A * V) / 3 + A], { int: true });
  }
  const P = a * a + 2 * a * va;
  if (Math.random() < 0.35) return nq(ctx, L(ctx, `Pravilna 4-strana piramida: a = ${ctx.num(a)} cm, v₁ = ${ctx.num(va)} cm. Plašč?`, `Sq. pyramid: a = ${ctx.num(a)} cm, slant height ${ctx.num(va)} cm. Lateral area?`), 2 * a * va, " cm²", [4 * a * va, a * va, P, a * a + a * va]);
  return nq(ctx, L(ctx, `Pravilna 4-strana piramida: a = ${ctx.num(a)} cm, v = ${ctx.num(v)} cm. P = ?`, `Square pyramid: a = ${ctx.num(a)} cm, h = ${ctx.num(v)} cm. Surface area?`), P, " cm²", [a * a + 4 * a * va, 2 * a * va, a * a + 2 * a * v, a * a + a * va]);
});

// =====================================================================
// 1. LETNIK
// =====================================================================
def("m2_sets", "st", 10, "A∩B", "Množice", "Sets", (t, ctx) => {
  const mkSets = () => {
    for (;;) {
      const U = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      const A = U.slice(0, R(2, 4)), B = [...U.slice(0, R(1, 2)).filter(() => Math.random() < 0.9), ...U.slice(4, 4 + R(1, 3))];
      const Bs = [...new Set(B)];
      const un = [...new Set([...A, ...Bs])];
      const is = A.filter((x) => Bs.includes(x));
      if (un.length <= 6 && is.length >= 1 && Bs.length >= 2 && is.length < A.length && is.length < Bs.length) return [A, Bs];
    }
  };
  const ops = (A, B) => ({
    "∪": [...new Set([...A, ...B])], "∩": A.filter((x) => B.includes(x)), "A\\B": A.filter((x) => !B.includes(x)), "B\\A": B.filter((x) => !A.includes(x)),
  });
  if (t === 1 || (t === 2 && Math.random() < 0.6)) {
    const [A, B] = mkSets(), o = ops(A, B);
    const op = t === 1 ? pick(["∪", "∩"]) : pick(["A\\B", "B\\A"]);
    const sym = { "∪": "A ∪ B", "∩": "A ∩ B", "A\\B": "A \\ B", "B\\A": "B \\ A" }[op];
    const ws = Object.keys(o).filter((k) => k !== op).map((k) => setStr(o[k]));
    return out(`A = ${setStr(A)}, B = ${setStr(B)}. ${sym} = ?`, setStr(o[op]), [...ws, setStr(A), setStr(B)]);
  }
  if (t === 2) {
    const a = R(8, 20), b = R(5, 15), c = R(2, Math.min(a, b) - 1);
    return nq(ctx, `|A| = ${a}, |B| = ${b}, |A ∩ B| = ${c}. |A ∪ B| = ?`, a + b - c, "", [a + b, a + b - 2 * c, a + b + c, Math.max(a, b)], { int: true });
  }
  const r = Math.random();
  if (r < 0.35) {
    const n = R(2, 7);
    return nq(ctx, L(ctx, `|A| = ${n}. Koliko podmnožic ima A?`, `|A| = ${n}. How many subsets has A?`), 2 ** n, "", [n * n, 2 * n, 2 ** n - 1, n + 1, n === 2 ? 3 : 2 ** (n - 1)], { int: true });
  }
  if (r < 0.65) {
    const N = R(20, 32), both = R(2, 8), f = R(both + 3, 18), bb = R(both + 3, 15), none = N - (f + bb - both);
    if (none < 1) return nq(ctx, L(ctx, `30 dijakov: 18 nogomet, 15 košarka, 7 nič. Oboje?`, `30 students: 18 football, 15 basketball, 7 neither. Both?`), 10, "", [3, 23, 8, 33], { int: true });
    return nq(ctx, L(ctx, `${N} dijakov: ${f} nogomet, ${bb} košarka, ${none} nič. Oboje?`, `${N} students: ${f} football, ${bb} basketball, ${none} neither. Both?`), both, "", [f + bb - N, f + bb - none, f - both, N - none, both + none], { int: true });
  }
  const U = [1, 2, 3, 4, 5, 6, 7, 8].slice(0, R(5, 6));
  const A = shuffle(U).slice(0, R(2, 3));
  const comp = U.filter((x) => !A.includes(x));
  const extra = U.length + 1;
  return out(`U = ${setStr(U)}, A = ${setStr(A)}. Aᶜ = ?`, setStr(comp), [setStr(A), setStr(comp.slice(1)), setStr([...comp, extra]), setStr(U), "∅"]);
});

def("m2_divis", "nt", 10, "a|b", "Deljivost, D in v", "Divisibility, gcd and lcm", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.5) {
      let g, m, n;
      do { g = R(2, 9); m = R(2, 9); n = R(2, 9); } while (m === n || gcd(m, n) !== 1);
      const a = g * m, b = g * n;
      return nq(ctx, L(ctx, `D(${a}, ${b}) = ${g}. v(${a}, ${b}) = ?`, `gcd(${a}, ${b}) = ${g}. lcm(${a}, ${b}) = ?`), g * m * n, "", [a * b, m * n, a + b, (a * b) / (g * g * 2) === m * n ? a * b / 2 : g * m * n * 2], { int: true });
    }
    let p, q;
    do { p = R(4, 30); q = R(4, 30); } while (p === q || gcd(p, q) !== 1);
    const bad = new Set();
    while (bad.size < 4) {
      const g = pick([2, 3, 5]), x = g * R(2, 10), y = g * R(2, 10);
      if (x !== y) bad.add(`${x} in ${y}`);
    }
    return out(L(ctx, "Kateri števili sta tuji (D = 1)?", "Which two numbers are coprime?"), L(ctx, `${p} in ${q}`, `${p} and ${q}`), [...bad].map((s) => L(ctx, s, s.replace(" in ", " and "))));
  }
  if (t === 2) {
    const ps = shuffle([2, 3, 5, 7]).slice(0, Math.random() < 0.6 ? 2 : 3).sort((a, b) => a - b);
    const es = ps.map(() => R(1, 4));
    const str = ps.map((p, i) => (es[i] > 1 ? p + sup(es[i]) : String(p))).join(" · ");
    const cnt = es.reduce((a, e) => a * (e + 1), 1);
    return nq(ctx, L(ctx, `Koliko deliteljev ima ${str}?`, `How many divisors has ${str}?`), cnt, "", [es.reduce((a, e) => a * e, 1), es.reduce((a, e) => a + e, 0), es.reduce((a, e) => a + e + 1, 0), cnt - 1, cnt + 2], { int: true });
  }
  const d = R(5, 9), r1 = R(1, d - 1);
  if (Math.random() < 0.5) {
    const k = R(2, 6), ans = (k * r1) % d;
    return nq(ctx, L(ctx, `Ostanek pri a : ${d} je ${r1}. Ostanek pri ${k}a : ${d}?`, `a : ${d} leaves remainder ${r1}. Remainder of ${k}a : ${d}?`), ans, "", [k * r1, r1, k, (k * r1 + 1) % d, d - ans], { int: true, neg: false });
  }
  const r2 = R(1, d - 1), ans = (r1 + r2) % d;
  return nq(ctx, L(ctx, `a : ${d} → ostanek ${r1}, b : ${d} → ostanek ${r2}. Ostanek (a + b) : ${d}?`, `a : ${d} → rem. ${r1}, b : ${d} → rem. ${r2}. Rem. of (a + b) : ${d}?`), ans, "", [r1 + r2, Math.abs(r1 - r2), r1 * r2 % d, d - ans === ans ? ans + 1 : d - ans], { int: true, neg: false });
});

def("m2_rational", "fr", 10, "0,3…", "Racionalna števila in decimalni zapis", "Rational numbers and decimals", (t, ctx) => {
  const sep = ctx.num(0.5).charAt(1);
  if (t === 1) {
    const good = pick([4, 5, 8, 20, 25, 40, 16, 50, 2, 10]), badD = [3, 6, 7, 9, 11, 12, 15, 14, 21];
    const coprimeNum = (d) => { let n; do n = R(1, Math.min(2 * d, 39)); while (gcd(n, d) !== 1 || n === d); return n; };
    const fin = Math.random() < 0.5;
    const ansD = fin ? good : pick(badD);
    const ans = `${coprimeNum(ansD)}/${ansD}`;
    const others = shuffle(fin ? badD : [4, 5, 8, 20, 25, 40, 16, 50, 2, 10]).slice(0, 4).map((d) => `${coprimeNum(d)}/${d}`);
    return out(L(ctx, fin ? "Kateri ulomek ima končni decimalni zapis?" : "Kateri ulomek ima neskončni periodični decimalni zapis?", fin ? "Which fraction has a terminating decimal?" : "Which fraction has a repeating decimal?"), ans, others);
  }
  const val = (n, d) => n / d;
  const wrongF = (pairs, n, d) => pairs.filter(([a, b]) => b > 0 && Math.abs(val(a, b) - val(n, d)) > 1e-12).map(([a, b]) => frs(a, b));
  if (t === 2) {
    if (Math.random() < 0.5) {
      const a = R(1, 8);
      return out(`0${sep}${String(a).repeat(4)}… = ?`, frs(a, 9), wrongF([[a, 10], [a, 99], [a, 90], [a + 1, 9], [10 * a + a, 100]], a, 9));
    }
    let ab;
    do ab = R(10, 98); while (ab % 11 === 0);
    const s2 = String(ab).padStart(2, "0");
    return out(`0${sep}${s2.repeat(3)}… = ?`, frs(ab, 99), wrongF([[ab, 100], [ab, 90], [ab, 9], [ab, 999], [ab + 1, 99]], ab, 99));
  }
  let a, b;
  do { a = R(1, 8); b = R(1, 8); } while (a === b);
  const n = 9 * a + b, d = 90; // 0,abbb… = (10a + b − a)/90
  return out(`0${sep}${a}${String(b).repeat(4)}… = ?`, frs(n, d), wrongF([[10 * a + b, 99], [10 * a + b, 90], [10 * a + b, 100], [b, 9], [10 * a + b - b, 90]], n, d));
});

def("m2_linfn", "fn", 10, "k∥", "Linearna funkcija: graf in lastnosti", "Linear functions: graph and properties", (t, ctx) => {
  const ln = (k, n) => `y = ${lin(k, n)}`;
  if (t === 1) {
    const k = R(1, 5) * pick([1, -1]), n = R(-6, 6);
    let m = R(-6, 6);
    while (m === n) m = R(-6, 6);
    if (Math.random() < 0.5) {
      return out(L(ctx, `Vzporednica k ${ln(k, n)} skozi ${pt(0, m)}?`, `Parallel to ${ln(k, n)} through ${pt(0, m)}?`), ln(k, m), [ln(-k, m), ln(k, n), m ? ln(k, -m) : ln(k, 1), ln(k, m + k), ln(m || 1, k)], [ln(k, m + 1), ln(k, m - 1), ln(-k, n)]);
    }
    const x0 = R(1, 6) * pick([1, -1]), b = -k * x0;
    return out(L(ctx, `Ničla funkcije f(x) = ${lin(k, b)}?`, `Zero of f(x) = ${lin(k, b)}?`), `x = ${I(x0)}`, [`x = ${I(-x0)}`, `x = ${I(b)}`, `x = ${I(k)}`, `x = ${I(x0 + 1)}`, `x = ${I(x0 - 1)}`, `x = ${I(-b)}`]);
  }
  if (t === 2) {
    if (Math.random() < 0.6) {
      const k = pick([2, 3, 4, 5, -2, -3, -4, -5]), n = R(-5, 5);
      const kk = (num, den) => frs(num, den);
      return out(L(ctx, `Smerni koeficient pravokotnice na ${ln(k, n)}?`, `Slope of a line perpendicular to ${ln(k, n)}?`), kk(-1, k), [kk(1, k), I(-k), I(k), kk(-k, 2)]);
    }
    // smerni koeficient premice skozi dve točki
    const x1 = R(-5, 5), y1 = R(-5, 5), dx = R(1, 6) * pick([1, -1]);
    let dy = R(-8, 8);
    while (!dy) dy = R(-8, 8);
    const x2 = x1 + dx, y2 = y1 + dy;
    const ws = [frs(dx, dy), frs(-dy, dx), x1 + x2 ? frs(y1 + y2, x1 + x2) : null, frs(dy + 1, dx), I(dy), dx + 1 ? frs(dy, dx + 1) : frs(dy, dx - 1)].filter((w) => w && w !== frs(dy, dx));
    return out(L(ctx, `A${pt(x1, y1)}, B${pt(x2, y2)}. Smerni koeficient premice AB?`, `A${pt(x1, y1)}, B${pt(x2, y2)}. Slope of line AB?`), frs(dy, dx), ws);
  }
  const x0 = R(1, 6) * pick([1, -1]), n = R(1, 6) * pick([1, -1]);
  const kNum = -n, kDen = x0; // premica skozi (x0, 0) in (0, n)
  if (!Number.isInteger(kNum / kDen)) {
    const area = Math.abs(x0 * n) / 2;
    return nq(ctx, L(ctx, `Ploščina △ med osema in premico skozi ${pt(x0, 0)}, ${pt(0, n)}?`, `Area of △ between the axes and line via ${pt(x0, 0)}, ${pt(0, n)}?`), area, "", [area * 2, Math.abs(x0) + Math.abs(n), area / 2], { step: 0.5 });
  }
  const k = kNum / kDen, area = Math.abs(x0 * n) / 2;
  return nq(ctx, L(ctx, `Ploščina △ med osema in premico ${ln(k, n)}?`, `Area of △ between the axes and ${ln(k, n)}?`), area, "", [area * 2, Math.abs(x0) + Math.abs(n), Math.abs(n * k) / 2 === area ? area + 1 : Math.abs(n * k) / 2], { step: 0.5 });
});

def("m2_linpar", "eq", 10, "ax=b", "Linearne enačbe s parametrom", "Linear equations with a parameter", (t, ctx) => {
  if (t === 1) {
    const k = R(2, 6), x = R(1, 6), a = R(-8, 10), c = k * x + a;
    return nq(ctx, L(ctx, `x = ${x} je rešitev enačbe ${k}x + a = ${I(c)}. a = ?`, `x = ${x} solves ${k}x + a = ${I(c)}. a = ?`), a, "", [c + k * x, c - x, -a, (c - x) / k, c - k], { int: true, neg: true });
  }
  if (t === 2) {
    if (Math.random() < 0.6) {
      const k = R(2, 7) * pick([1, -1]), p = R(1, 9), q = R(1, 9);
      // ax − p = kx + q nima rešitve za a = k
      return out(L(ctx, `Za kateri a enačba ax ${M} ${p} = ${lin(k, q)} nima rešitve?`, `For which a does ax ${M} ${p} = ${lin(k, q)} have no solution?`), `a = ${I(k)}`, [`a = ${I(-k)}`, `a = ${I(p + q)}`, `a = 0`, `a = ${I(k + 1)}`, `a = ${I(q - p)}`]);
    }
    const [d1, d2] = pick([[2, 3], [2, 5], [3, 4], [2, 4], [3, 6], [4, 6], [2, 6], [5, 10], [3, 5]]);
    const l = (d1 * d2) / gcd(d1, d2), x = l * R(1, 4), s = x / d1 + x / d2;
    return nq(ctx, `x/${d1} + x/${d2} = ${ctx.num(s)}. x = ?`, x, "", [s * (d1 + d2), (s * d1 * d2) / 2, s / (d1 + d2) * d1 * d2 === x ? x + l : (s / (d1 + d2)) * d1 * d2, s * l], { step: 1 });
  }
  const k = R(1, 6), r = Math.random();
  const A = (sgn) => `a ${sgn < 0 ? M : "+"} ${k}`;
  if (r < 0.4) return out(L(ctx, `(a ${M} ${k})x = a² ${M} ${k * k}, a ≠ ${k}. x = ?`, `(a ${M} ${k})x = a² ${M} ${k * k}, a ≠ ${k}. x = ?`), `x = ${A(1)}`, [`x = ${A(-1)}`, `x = a`, `x = ${k} ${M} a`, `x = a² + ${k}`]);
  if (r < 0.8) return out(L(ctx, `(a + ${k})x = a² ${M} ${k * k}, a ≠ ${M}${k}. x = ?`, `(a + ${k})x = a² ${M} ${k * k}, a ≠ ${M}${k}. x = ?`), `x = ${A(-1)}`, [`x = ${A(1)}`, `x = a`, `x = ${k} ${M} a`, `x = a² ${M} ${k}`]);
  const inf = Math.random() < 0.5;
  const opts = L(ctx, ["neskončno rešitev", "nobene rešitve", "natanko eno rešitev", "natanko dve rešitvi"], ["infinitely many", "no solution", "exactly one solution", "two solutions"]);
  const q = inf ? `(a ${M} ${k})x = a ${M} ${k}` : `(a ${M} ${k})x = a + ${k}`;
  return out(L(ctx, `${q}. Za a = ${k} ima enačba?`, `${q}. For a = ${k} it has?`), opts[inf ? 0 : 1], opts.filter((_, i) => i !== (inf ? 0 : 1)));
});

// intervali s celimi krajišči
const iv = (lo, hi, lc, rc) => `${lo === -Infinity ? "(" : lc ? "[" : "("}${lo === -Infinity ? M + "∞" : I(lo)}, ${hi === Infinity ? "∞" : I(hi)}${hi === Infinity ? ")" : rc ? "]" : ")"}`;
def("m2_ineqint", "eq", 10, "x≥", "Linearne neenačbe in intervali", "Linear inequalities as intervals", (t, ctx) => {
  const sol = (op, s) => (op === ">" ? iv(s, Infinity, false) : op === "≥" ? iv(s, Infinity, true) : op === "<" ? iv(-Infinity, s, false, false) : iv(-Infinity, s, false, true));
  const FLIP = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" }, STRICT = { "<": "≤", "≤": "<", ">": "≥", "≥": ">" };
  if (t <= 2) {
    const s = R(-8, 8), a = t === 1 ? R(2, 6) : -R(2, 6), b = R(-9, 9), op = pick(["<", ">", "≤", "≥"]);
    const c = a * s + b, eff = a > 0 ? op : FLIP[op];
    return out(`${lin(a, b)} ${op} ${I(c)}`, sol(eff, s), [sol(FLIP[eff], s), sol(STRICT[eff], s), sol(eff, -s === s ? s + 1 : -s), sol(a > 0 ? FLIP[op] : op, s + 1)]);
  }
  const lo = R(-6, 3), hi = lo + R(1, 6), a = R(2, 4), b = R(-6, 6);
  const lc = Math.random() < 0.5, rc = Math.random() < 0.5;
  const q = `${I(a * lo + b)} ${lc ? "≤" : "<"} ${lin(a, b)} ${rc ? "≤" : "<"} ${I(a * hi + b)}`;
  return out(q, iv(lo, hi, lc, rc), [iv(lo, hi, !lc, rc), iv(lo, hi, lc, !rc), iv(a * lo + b, a * hi + b, lc, rc), iv(lo - b, hi - b, lc, rc), iv(lo, hi, !lc, !rc)]);
});

def("m2_transv", "ge", 10, "∦", "Koti ob vzporednicah in pari kotov", "Angles with parallels", (t, ctx) => {
  if (t === 1) {
    const d = R(10, 80), m = R(1, 59), comp = Math.random() < 0.5;
    const tot = (comp ? 90 : 180) * 60 - d * 60 - m;
    const q = L(ctx, `${comp ? "Komplementarni" : "Suplementarni"} kot kota ${dm(d, m)}?`, `${comp ? "Complement" : "Supplement"} of ${dm(d, m)}?`);
    const other = (comp ? 180 : 90) * 60 - d * 60 - m;
    return out(q, DM(tot), [other > 0 ? DM(other) : null, dm(Math.floor(tot / 60) + 1, tot % 60), dm(Math.floor(tot / 60), m), DM(tot + 10), DM(tot - 60)]);
  }
  if (t === 2) {
    const a = R(20, 160);
    if (a === 90) return nq(ctx, L(ctx, "p ∥ q, prečnica t. α = 70°. Izmenični kot?", "p ∥ q, transversal t. α = 70°. Alternate angle?"), 70, "°", [110, 20, 140], { int: true });
    const [sl, en, same] = pick([["Istoležni kot", "Corresponding angle", true], ["Izmenični kot", "Alternate angle", true], ["Notranji kot na isti strani", "Co-interior angle", false], ["Sovršni kot", "Vertically opposite angle", true], ["Sokot", "Linear pair angle", false]]);
    const ans = same ? a : 180 - a;
    return nq(ctx, L(ctx, `p ∥ q, prečnica t, α = ${a}°. ${sl}?`, `p ∥ q, transversal t, α = ${a}°. ${en}?`), ans, "°", [same ? 180 - a : a, Math.abs(90 - a), 360 - a, 2 * a < 360 ? 2 * a : a / 2], { step: 5 });
  }
  if (Math.random() < 0.5) {
    const d = R(1, 7) * 10, al = (180 + d) / 2;
    return nq(ctx, L(ctx, `p ∥ q: α, β notranja na isti strani, α − β = ${d}°. α = ?`, `p ∥ q: α, β co-interior, α − β = ${d}°. α = ?`), al, "°", [180 - al, al + d, 90 + d, (360 + d) / 2], { step: 5 });
  }
  const n = R(4, 9), c = (n * (n - 1)) / 2;
  return nq(ctx, L(ctx, `${n} ${n === 4 ? "premice" : "premic"} v splošni legi. Koliko presečišč?`, `${n} lines in general position. Intersection points?`), c, "", [n * (n - 1), n * n, n - 1, 2 * n], { int: true });
});

def("m2_tri10", "ge", 10, "△O", "Trikotnik: koti in značilne točke", "Triangle: angles and special points", (t, ctx) => {
  if (t === 1) {
    const a = R(20, 80), b = R(20, 160 - a) ;
    const g = 180 - a - b;
    const r = Math.random();
    if (r < 0.5) return nq(ctx, L(ctx, `α = ${a}°, β = ${b}°. Zunanji kot pri C?`, `α = ${a}°, β = ${b}°. Exterior angle at C?`), a + b, "°", [g, 180 - a, 360 - a - b, 180 + g], { int: true, step: 5 });
    return nq(ctx, L(ctx, `Zunanja kota pri A in B: ${180 - a}° in ${180 - b}°. γ = ?`, `Exterior angles at A and B: ${180 - a}°, ${180 - b}°. γ = ?`), g, "°", [a + b, 360 - (180 - a) - (180 - b) + 180 === g ? g + 10 : 360 - (180 - a) - (180 - b) + 180, 360 - a - b, Math.abs(a - b) || 10], { int: true, step: 5 });
  }
  if (t === 2) {
    const k = R(2, 9), r = Math.random();
    if (r < 0.35) return nq(ctx, L(ctx, `Težiščnica tₐ = ${3 * k} cm. |AT| = ?`, `Median from A is ${3 * k} cm. |AT| = ?`), 2 * k, " cm", [k, 1.5 * k, 3 * k, 2 * k + 1], { int: true });
    if (r < 0.7) {
      const [x, y, z] = pick(TRIPLES);
      return nq(ctx, L(ctx, `Pravokotni △ s katetama ${x} cm in ${y} cm. R = ?`, `Right △ with legs ${x} cm and ${y} cm. Circumradius?`), z / 2, " cm", [z, (x + y) / 2, (x * y) / (x + y + z), z / 3], { step: 0.5 });
    }
    const o = 2 * R(6, 20), rr = R(1, Math.floor(o / (6 * Math.sqrt(3)))); // r ≤ o/(6√3), enakost le pri enakostraničnem
    return nq(ctx, L(ctx, `Obseg △ je ${o} cm, polmer včrtane krožnice ${rr} cm. Ploščina?`, `△ perimeter ${o} cm, inradius ${rr} cm. Area?`), (rr * o) / 2, " cm²", [rr * o, (rr * o) / 4, (rr * rr * o) / 2, o + rr], { int: true });
  }
  const a = R(4, 10) * 10, b = R(3, 14 - a / 10) * 10;
  const g = 180 - a - b;
  if (g <= 0) return nq(ctx, L(ctx, `α = 50°, β = 70°, S središče včrtane krožnice. Kot ASB?`, `α = 50°, β = 70°. Angle AIB (I: incentre)?`), 120, "°", [60, 150, 110, 240], { int: true });
  if (Math.random() < 0.5) return nq(ctx, L(ctx, `α = ${a}°, β = ${b}°, S središče včrtane krožnice. Kot ASB?`, `α = ${a}°, β = ${b}°. Angle AIB (I: incentre)?`), 90 + g / 2, "°", [g, 90 + g, 180 - g / 2, (a + b) / 2, 2 * g], { int: true, step: 5 });
  const gg = R(3, 8) * 10 + pick([0, 5]);
  return nq(ctx, L(ctx, `γ = ${gg}°, O središče očrtane krožnice. Kot AOB?`, `γ = ${gg}°, O the circumcentre. Angle AOB?`), 2 * gg, "°", [gg, gg / 2, 180 - gg, 90 + gg / 2], { step: 5 });
});

def("m2_quad10", "ge", 10, "◇", "Štirikotniki in krog", "Quadrilaterals and circles", (t, ctx) => {
  if (t === 1) {
    const r = Math.random();
    if (r < 0.5) {
      const c = R(2, 10), a = c + 2 * R(1, 5), v = R(2, 10);
      return nq(ctx, L(ctx, `Trapez: a = ${a} cm, c = ${c} cm, v = ${v} cm. Ploščina?`, `Trapezium: a = ${a} cm, c = ${c} cm, h = ${v} cm. Area?`), ((a + c) * v) / 2, " cm²", [(a + c) * v, a * v, a * c * v, ((a - c) * v) / 2], { step: 1 });
    }
    const e = R(3, 14), f = R(3, 14), sh = pick([["Romb", "Rhombus"], ["Deltoid", "Kite"]]);
    return nq(ctx, L(ctx, `${sh[0]} z diagonalama ${e} cm in ${f} cm. Ploščina?`, `${sh[1]} with diagonals ${e} cm and ${f} cm. Area?`), (e * f) / 2, " cm²", [e * f, e + f, (e * f) / 4, 2 * (e + f)], { step: 0.5 });
  }
  if (t === 2) {
    const r = Math.random();
    if (r < 0.45) {
      const S = 2 * R(10, 85);
      return nq(ctx, L(ctx, `Središčni kot meri ${S}°. Obodni kot nad istim lokom?`, `Central angle ${S}°. Inscribed angle on the same arc?`), S / 2, "°", [S, 2 * S, 180 - S / 2, 180 - S], { step: 1 });
    }
    if (r < 0.9) {
      const o = R(10, 85);
      return nq(ctx, L(ctx, `Obodni kot meri ${o}°. Središčni kot nad istim lokom?`, `Inscribed angle ${o}°. Central angle on the same arc?`), 2 * o, "°", [o, o / 2, 180 - o, 90 + o], { step: 1 });
    }
    return out(L(ctx, "Obodni kot nad premerom (v polkrogu) meri?", "An inscribed angle on a diameter measures?"), "90°", ["180°", "45°", "60°", "120°"]);
  }
  if (Math.random() < 0.5) {
    const a = R(50, 130), w = pick([["α", "γ"], ["β", "δ"]]);
    return nq(ctx, L(ctx, `Tetivni štirikotnik: ${w[0]} = ${a}°. ${w[1]} = ?`, `Cyclic quadrilateral: ${w[0]} = ${a}°. ${w[1]} = ?`), 180 - a, "°", [a, 360 - a, 90 - a / 2 > 0 ? 90 - a / 2 : a / 2, 2 * a < 360 ? 2 * a : a / 2], { step: 5 });
  }
  const a = R(4, 12), b = R(3, 11), c = R(2, 10);
  const d = a + c - b;
  if (d <= 0) return nq(ctx, L(ctx, "Tangentni štirikotnik: a = 7, b = 5, c = 4. d = ?", "Tangential quadrilateral: a = 7, b = 5, c = 4. d = ?"), 6, "", [8, 2, 16, 5], { int: true });
  return nq(ctx, L(ctx, `Tangentni štirikotnik: a = ${a}, b = ${b}, c = ${c}. d = ?`, `Tangential quadrilateral: a = ${a}, b = ${b}, c = ${c}. d = ?`), d, "", [a + b - c, b + c - a, a + b + c - 2 * b === d ? d + 2 : 0, Math.round((a + b + c) / 3)], { int: true });
});

// =====================================================================
// 2. LETNIK
// =====================================================================
const RT = { 2: "√", 3: "∛", 4: "∜" };
const rootN = (n, inner) => (RT[n] ? RT[n] : sup(n) + "√") + inner;
def("m2_ratexp", "pw", 11, "ⁿ√a", "Potence z racionalnimi eksponenti", "Rational exponents", (t, ctx) => {
  const E = (b, m, n) => `${b}^(${m < 0 ? M : ""}${Math.abs(m)}/${n})`;
  if (t === 1) {
    if (Math.random() < 0.55) {
      const [b, n, r] = pick([[4, 2, 2], [9, 2, 3], [25, 2, 5], [49, 2, 7], [100, 2, 10], [8, 3, 2], [27, 3, 3], [64, 3, 4], [125, 3, 5], [1000, 3, 10], [16, 4, 2], [81, 4, 3], [32, 5, 2], [64, 6, 2], [36, 2, 6], [64, 2, 8]]);
      return nq(ctx, `${E(b, 1, n)} = ?`, r, "", [b / n, b * n, r * r === b ? r + 1 : r * r, 1 / r, -r], { neg: true, step: 1 });
    }
    const n = R(2, 5);
    let m = R(1, 7);
    while (gcd(m, n) !== 1 || m === n) m = R(1, 7);
    const inner = m === 1 ? "x" : `x${sup(m)}`;
    const P = (a, b) => `x^(${a}/${b})`;
    return out(`${rootN(n, inner)} = ?`, P(m, n), [m === 1 ? `${n}x` : P(n, m), m === 1 ? `x${sup(n)}` : `x${sup(m * n)}`, P(1, m * n), P(m, n + 1), m > 1 ? `x${sup(m)}/${n}` : P(1, n + 1)]);
  }
  if (t === 2) {
    const [b, n, r] = pick([[8, 3, 2], [27, 3, 3], [16, 4, 2], [4, 2, 2], [9, 2, 3], [32, 5, 2], [25, 2, 5], [81, 4, 3], [64, 3, 4], [100, 2, 10], [125, 3, 5], [1000, 3, 10], [64, 6, 2], [16, 2, 4]]);
    let m = pick([2, 3, 4, 5].filter((x) => gcd(x, n) === 1 && r ** x <= 10000));
    if (m === undefined) m = n + 1;
    const v = r ** m;
    return nq(ctx, `${E(b, m, n)} = ?`, v, "", [(b * m) / n, r * m, r ** (m + 1), b ** m <= 10000 ? b ** m : r ** (m - 1), m * n], { step: 1 });
  }
  if (Math.random() < 0.5) {
    const [b, n, r] = pick([[8, 3, 2], [27, 3, 3], [16, 4, 2], [4, 2, 2], [9, 2, 3], [32, 5, 2], [25, 2, 5], [81, 4, 3], [64, 3, 4], [100, 2, 10], [125, 3, 5]]);
    const m = pick([1, 2, 3].filter((x) => gcd(x, n) === 1));
    const v = r ** m;
    return out(`${E(b, -m, n)} = ?`, frs(1, v), [I(-v), I(v), frs(-1, v), frs(1, b), frs(-m * b, n), frs(1, r * m)].filter((x) => x !== frs(1, v)));
  }
  const [p, q, op] = pick([[2, 3, "·"], [2, 4, "·"], [3, 4, "·"], [2, 5, "·"], [3, 6, "·"], [2, 3, ":"], [2, 4, ":"], [3, 6, ":"], [4, 6, "·"], [2, 6, ":"]]);
  const num = op === "·" ? p + q : q - p, den = p * q;
  const P = (a, b) => { const g = gcd(a, b); return `x^(${a / g}/${b / g})`; };
  const ans = P(num, den);
  return out(`${rootN(p, "x")} ${op} ${rootN(q, "x")} = ?`, ans, [P(1, den), P(2, p + q), P(1, p + q), op === "·" ? P(q - p, den) : P(p + q, den), `x${sup(p + q)}`].filter((x) => x !== ans));
});

def("m2_qineq", "eq", 11, "x²<", "Kvadratna neenačba", "Quadratic inequalities", (t, ctx) => {
  const fac = (r) => (r === 0 ? "x" : `(x ${r > 0 ? M : "+"} ${Math.abs(r)})`);
  let r1 = R(-7, 6), r2 = R(r1 + 1, 8);
  const inside = (lc) => iv(r1, r2, lc, lc), outside = (lc) => `${iv(-Infinity, r1, false, lc)} ∪ ${iv(r2, Infinity, lc)}`;
  const opsAll = ["<", "≤", ">", "≥"];
  if (t <= 2) {
    const op = pick(opsAll), closed = op === "≤" || op === "≥", inn = op === "<" || op === "≤";
    const lhs = t === 1 ? (r1 === 0 ? `x${fac(r2)}` : r2 === 0 ? `x${fac(r1)}` : `${fac(r1)}${fac(r2)}`) : poly([1, -(r1 + r2), r1 * r2]);
    const ans = inn ? inside(closed) : outside(closed);
    const ws = [inn ? outside(closed) : inside(closed), inn ? inside(!closed) : outside(!closed), inn ? iv(-r2, -r1, closed, closed) : `${iv(-Infinity, -r2, false, closed)} ∪ ${iv(-r1, Infinity, closed)}`, inn ? outside(!closed) : inside(!closed)];
    return out(`${lhs} ${op} 0`, ans, ws);
  }
  const r = Math.random();
  if (r < 0.5) {
    // negativni vodilni koeficient
    const op = pick(["≥", ">", "≤", "<"]), closed = op === "≤" || op === "≥", inn = op === "≥" || op === ">";
    const lhs = poly([-1, r1 + r2, -r1 * r2]);
    const ans = inn ? inside(closed) : outside(closed);
    return out(`${lhs} ${op} 0`, ans, [inn ? outside(closed) : inside(closed), inn ? inside(!closed) : outside(!closed), inn ? outside(!closed) : inside(!closed), inn ? iv(-r2, -r1, closed, closed) : iv(-r2, -r1, !closed, !closed)]);
  }
  const c = R(1, 9);
  if (r < 0.75) {
    const [q, a] = pick([[">", "ℝ"], ["<", "∅"], ["≥", "ℝ"], ["≤", "∅"]]);
    return out(`x² + ${c} ${q} 0`, a, [a === "ℝ" ? "∅" : "ℝ", iv(-c, c, false, false), `${iv(-Infinity, -c, false, false)} ∪ ${iv(c, Infinity, false)}`, `ℝ \\ {${c}}`]);
  }
  const [q, a] = pick([[">", `ℝ \\ {${c}}`], ["<", "∅"], ["≥", "ℝ"], ["≤", `{${c}}`]]);
  return out(`(x ${M} ${c})² ${q} 0`, a, ["ℝ", "∅", `{${c}}`, `ℝ \\ {${c}}`, iv(c, Infinity, false)].filter((x) => x !== a));
});

def("m2_expfn", "fn", 11, "aˣ", "Eksponentna funkcija", "Exponential functions", (t, ctx) => {
  const bases = [[2, "2"], [3, "3"], [0.5, "(1/2)"], [1 / 3, "(1/3)"], [4, "4"], [5, "5"], [10, "10"]];
  const ex = (s) => sup(s).replace(/ /g, "");
  if (t === 1) {
    const [b, bs] = pick(bases);
    const x = R(-3, 3) || 2;
    const v = b ** x;
    const vs = (y) => { const r = Math.round(y * 1e9) / 1e9; if (Number.isInteger(r)) return I(r); const inv = Math.round(1 / r); return Math.abs(inv - 1 / r) < 1e-9 ? frs(1, inv) : null; };
    if (Math.abs(v) > 10000 || !vs(v)) return nq(ctx, `f(x) = 2ˣ. f(3) = ?`, 8, "", [6, 9, 5, 16], { int: true });
    const ws = [I(-Math.abs(Math.round(v >= 1 ? v : 1 / v))), vs(1 / v), x !== 0 ? I(Math.round(b * x * 100) / 100) : "0", vs(b ** (x + 1)), vs(b ** (x - 1))].filter((w) => w && w !== vs(v) && !/\./.test(w));
    return out(`f(x) = ${bs}ˣ. f(${I(x)}) = ?`, vs(v), ws, ["0", "1", I(x)]);
  }
  const b = pick([2, 3, 4, 5]), c = R(1, 6) * pick([1, -1]), d = R(-3, 3);
  const fs = `f(x) = ${b}${d === 0 ? "ˣ" : ex(d < 0 ? `x+${-d}` : `x-${d}`)} ${c < 0 ? M : "+"} ${Math.abs(c)}`;
  if (t === 2) {
    if (Math.random() < 0.5) return out(L(ctx, `${fs}. Vodoravna asimptota?`, `${fs}. Horizontal asymptote?`), `y = ${I(c)}`, [`y = ${I(-c)}`, "y = 0", `x = ${I(c)}`, `y = ${I(c + 1)}`, `x = ${I(d)}`]);
    const v0 = b ** -d + c;
    const vs = (y) => (Number.isInteger(y) ? I(y) : frs(Math.round(y * b ** Math.abs(d)), b ** Math.abs(d)));
    return out(L(ctx, `${fs}. f(0) = ?`, `${fs}. f(0) = ?`), vs(v0), [vs(c), vs(c + 2), vs(b ** d + c), vs(v0 - 1), vs(-v0), vs(v0 + 2), vs(c - 1)].filter((w) => w !== vs(v0)));
  }
  const r = Math.random();
  if (r < 0.35) return out(L(ctx, `${fs}. Zaloga vrednosti?`, `${fs}. Range?`), iv(c, Infinity, false), [iv(-c, Infinity, false), iv(0, Infinity, false), "ℝ", iv(c, Infinity, true), iv(-Infinity, c, false, false)]);
  if (r < 0.65) {
    const dec = pick(["(1/2)", "(2/3)", "(1/3)", "(3/4)", `${ctx.num(0.4)}`, "(1/5)"]);
    const inc = shuffle(["2", "(3/2)", "3", "(5/4)", "10", `${ctx.num(1.5)}`, "(4/3)"]).slice(0, 4);
    return out(L(ctx, "Katera funkcija je padajoča?", "Which function is decreasing?"), `f(x) = ${dec}ˣ`, inc.map((s) => `f(x) = ${s}ˣ`));
  }
  const k = R(1, b === 2 ? 5 : 3), N = b ** k;
  return out(L(ctx, `Ničla funkcije f(x) = ${b}ˣ ${M} ${N}?`, `Zero of f(x) = ${b}ˣ ${M} ${N}?`), `x = ${k}`, [`x = ${N / b}`, `x = ${N}`, `x = ${I(-k)}`, `x = ${k + 1}`, "x = 0", `x = ${k - 1}`].filter((w) => w !== `x = ${k}`));
});

// =====================================================================
// 3. LETNIK
// =====================================================================
// k·π/d okrajšano: piF(1, 2) = "π/2", piF(2, 3) = "2π/3", piF(4, 1) = "4π"
const piF = (n, d) => {
  const g = gcd(n, d) || 1;
  n /= g;
  d /= g;
  if (n === 0) return "0";
  const s = (n < 0 ? M : "") + (Math.abs(n) === 1 ? "" : Math.abs(n)) + "π";
  return d === 1 ? s : `${s}/${d}`;
};
def("m2_triggraph", "tr", 12, "∿", "Grafi kotnih funkcij", "Graphs of trig functions", (t, ctx) => {
  const arg = (p, q) => (q === 1 ? (p === 1 ? "x" : `${p}x`) : `(${p === 1 ? "" : p}x/${q})`);
  if (t === 1) {
    if (Math.random() < 0.6) {
      const [p, q] = pick([[1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [1, 3], [2, 3], [3, 2], [1, 4], [6, 1]]);
      const fn = pick(["sin", "cos", "tan"]);
      const a = arg(p, q);
      const per = fn === "tan" ? piF(q, p) : piF(2 * q, p);
      const sp = a.startsWith("(") ? "" : " ";
      return out(L(ctx, `Osnovna perioda f(x) = ${fn}${sp}${a}?`, `Period of f(x) = ${fn}${sp}${a}?`), per, [fn === "tan" ? piF(2 * q, p) : piF(q, p), piF(2 * p, q), fn === "tan" ? "2π" : "π", piF(4 * q, p), "2π", piF(p, q), piF(q, 2 * p), piF(3 * q, p)].filter((x) => x !== per));
    }
    const A = R(2, 6) * pick([1, -1]), fn = pick(["sin", "cos"]), b = R(1, 4);
    const d = R(-3, 3);
    const f = `${A < 0 ? M : ""}${Math.abs(A)} ${fn} ${b === 1 ? "x" : b + "x"}${d ? ` ${d < 0 ? M : "+"} ${Math.abs(d)}` : ""}`;
    return nq(ctx, L(ctx, `Amplituda funkcije f(x) = ${f}?`, `Amplitude of f(x) = ${f}?`), Math.abs(A), "", [A, 2 * Math.abs(A), b, Math.abs(A) + d, Math.abs(d) || Math.abs(A) + 1], { neg: true, int: true });
  }
  if (t === 2) {
    const A = R(1, 4) * pick([1, -1]), d = R(-3, 3), fn = pick(["sin", "cos"]), b = R(1, 3);
    const f = `${A < 0 ? M : ""}${Math.abs(A) === 1 ? "" : Math.abs(A) + " "}${fn} ${b === 1 ? "x" : b + "x"}${d ? ` ${d < 0 ? M : "+"} ${Math.abs(d)}` : ""}`;
    const a = Math.abs(A);
    const rng = (lo, hi) => `[${I(lo)}, ${I(hi)}]`;
    if (Math.random() < 0.6) {
      return out(L(ctx, `Zaloga vrednosti f(x) = ${f}?`, `Range of f(x) = ${f}?`), rng(d - a, d + a), [rng(-a, a), rng(d - 1, d + 1), rng(-a - d, a - d), rng(d, d + a), rng(d - 2 * a, d + 2 * a), rng(d - a - 1, d + a + 1), rng(d - a, d + a + 1)].filter((x) => x !== rng(d - a, d + a)));
    }
    return nq(ctx, L(ctx, `Največja vrednost f(x) = ${f}?`, `Maximum value of f(x) = ${f}?`), d + a, "", [d + A === d + a ? d - a : d + A, a, d + 1, d + 2 * a, a - d], { neg: true, int: true });
  }
  const opts = (amt, dir) => {
    const D = { r: ["v desno", "to the right"], l: ["v levo", "to the left"], u: ["navzgor", "up"], d: ["navzdol", "down"] };
    return L(ctx, `za ${amt} ${D[dir][0]}`, `${amt} ${D[dir][1]}`);
  };
  const fn = pick(["sin", "cos"]);
  const r = Math.random();
  if (r < 0.3) {
    const c = R(1, 5), up = Math.random() < 0.5;
    return out(L(ctx, `f(x) = ${fn} x ${up ? "+" : M} ${c}: premik grafa ${fn} x?`, `f(x) = ${fn} x ${up ? "+" : M} ${c}: shift of ${fn} x?`), opts(c, up ? "u" : "d"), [opts(c, up ? "d" : "u"), opts(c, "r"), opts(c, "l"), opts(2 * c, up ? "u" : "d")]);
  }
  const [n, dd] = pick([[1, 2], [1, 3], [1, 4], [1, 6], [2, 3], [3, 4], [5, 6]]);
  const right = Math.random() < 0.5;
  if (r < 0.65) {
    const s = piF(n, dd);
    return out(L(ctx, `f(x) = ${fn}(x ${right ? M : "+"} ${s}): premik grafa ${fn} x?`, `f(x) = ${fn}(x ${right ? M : "+"} ${s}): shift of ${fn} x?`), opts(s, right ? "r" : "l"), [opts(s, right ? "l" : "r"), opts(s, "u"), opts(s, "d"), opts(piF(2 * n, dd), right ? "r" : "l")]);
  }
  const k = pick([2, 3]);
  const inner = piF(n, dd), sh = piF(n, dd * k);
  return out(L(ctx, `f(x) = ${fn}(${k}x ${right ? M : "+"} ${inner}): premik grafa ${fn} ${k}x?`, `f(x) = ${fn}(${k}x ${right ? M : "+"} ${inner}): shift of ${fn} ${k}x?`), opts(sh, right ? "r" : "l"), [opts(inner, right ? "r" : "l"), opts(sh, right ? "l" : "r"), opts(inner, right ? "l" : "r"), opts(sh, "u")]);
});

const TRIGV = { 0: ["0", "1"], 30: ["1/2", "√3/2"], 45: ["√2/2", "√2/2"], 60: ["√3/2", "1/2"], 90: ["1", "0"], 120: ["√3/2", M + "1/2"], 135: ["√2/2", M + "√2/2"], 150: ["1/2", M + "√3/2"], 180: ["0", M + "1"] };
const TRIG_POOL = ["0", "1/2", "√2/2", "√3/2", "1", M + "1/2", M + "√2/2", M + "√3/2", M + "1"];
def("m2_addthm", "tr", 12, "α+β", "Adicijski izreki in dvojni kot", "Addition and double-angle formulas", (t, ctx) => {
  if (t === 1) return ADD1(t, ctx);
  if (t === 2) {
    if (Math.random() < 0.4) {
      const [q, a] = pick([["sin 75°", "(√6 + √2)/4"], ["cos 75°", "(√6 − √2)/4"], ["sin 15°", "(√6 − √2)/4"], ["cos 15°", "(√6 + √2)/4"], ["sin 105°", "(√6 + √2)/4"], ["cos 105°", "(√2 − √6)/4"], ["tan 15°", "2 − √3"], ["tan 75°", "2 + √3"], ["sin 165°", "(√6 − √2)/4"]]);
      const pool = ["(√6 + √2)/4", "(√6 − √2)/4", "(√2 − √6)/4", "2 − √3", "2 + √3", "(√3 + 1)/2", "√6/4", "(√6 + √2)/2"];
      return out(`${q} = ?`, a, shuffle(pool.filter((x) => x !== a)).slice(0, 4));
    }
    const sum = pick([30, 45, 60, 90, 120, 135, 150, 180]);
    const kind = R(0, 3); // 0: sin(a+b), 1: cos(a+b), 2: sin(a−b), 3: cos(a−b)
    let a, b;
    if (kind < 2) { b = R(1, Math.floor(sum / 10) - 1) * 5; a = sum - b; } else { b = R(1, 8) * 5; a = sum + b; }
    if (a <= 0 || b <= 0 || a === b) return ADD1(1, ctx);
    const fs = kind % 2 === 0 ? 0 : 1;
    const q = [`sin ${a}° cos ${b}° + cos ${a}° sin ${b}°`, `cos ${a}° cos ${b}° ${M} sin ${a}° sin ${b}°`, `sin ${a}° cos ${b}° ${M} cos ${a}° sin ${b}°`, `cos ${a}° cos ${b}° + sin ${a}° sin ${b}°`][kind];
    const ans = TRIGV[sum][fs];
    return out(`${q} = ?`, ans, [TRIGV[sum][1 - fs], ...shuffle(TRIG_POOL)].filter((x) => x !== ans).slice(0, 5));
  }
  const [x, y, z] = pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [7, 24, 25], [24, 7, 25]]);
  const useSin = Math.random() < 0.5, want = pick(["sin", "cos"]);
  const given = useSin ? `sin α = ${x}/${z}` : `cos α = ${y}/${z}`;
  const z2 = z * z, s2 = frs(2 * x * y, z2), c2 = frs(y * y - x * x, z2);
  const ans = want === "sin" ? s2 : c2;
  const ws = want === "sin" ? [frs(2 * x, z), frs(x * y, z2), c2, frs(2 * y, z)] : [frs(x * x - y * y, z2), s2, frs(y * y, z2), frs(2 * y * y, z2)];
  return out(L(ctx, `${given}, α ostri. ${want} 2α = ?`, `${given}, α acute. ${want} 2α = ?`), ans, ws.filter((w) => w !== ans), [frs(1, z), frs(x + y, z)]);
});
const ADD1 = bank([
  [1, "sin(α + β) = sin α cos β + ?|cos α sin β|sin α sin β|cos α cos β|sin α cos β", "sin(α + β) = sin α cos β + ?|cos α sin β|sin α sin β|cos α cos β|sin α cos β"],
  [1, "sin(α − β) = sin α cos β − ?|cos α sin β|sin α sin β|cos α cos β|sin β cos β", "sin(α − β) = sin α cos β − ?|cos α sin β|sin α sin β|cos α cos β|sin β cos β"],
  [1, "cos(α + β) = cos α cos β − ?|sin α sin β|cos α sin β|sin α cos β|cos α cos β", "cos(α + β) = cos α cos β − ?|sin α sin β|cos α sin β|sin α cos β|cos α cos β"],
  [1, "cos(α − β) = cos α cos β + ?|sin α sin β|cos α sin β|sin α cos β|sin β cos β", "cos(α − β) = cos α cos β + ?|sin α sin β|cos α sin β|sin α cos β|sin β cos β"],
  [1, "sin 2x = ?|2 sin x cos x|2 sin x|sin x cos x|cos² x − sin² x", "sin 2x = ?|2 sin x cos x|2 sin x|sin x cos x|cos² x − sin² x"],
  [1, "cos 2x = cos² x − ?|sin² x|cos² x|2 sin x|1", "cos 2x = cos² x − ?|sin² x|cos² x|2 sin x|1"],
  [1, "cos 2x = 1 − ?|2 sin² x|sin² x|2 cos² x|2 sin x", "cos 2x = 1 − ?|2 sin² x|sin² x|2 cos² x|2 sin x"],
  [1, "cos 2x = 2 cos² x − ?|1|2|sin² x|2 sin² x", "cos 2x = 2 cos² x − ?|1|2|sin² x|2 sin² x"],
  [1, "2 sin x cos x = ?|sin 2x|cos 2x|sin x²|2 sin 2x", "2 sin x cos x = ?|sin 2x|cos 2x|sin x²|2 sin 2x"],
  [1, "cos² x − sin² x = ?|cos 2x|sin 2x|1|2 cos x", "cos² x − sin² x = ?|cos 2x|sin 2x|1|2 cos x"],
  [1, "1 − 2 sin² x = ?|cos 2x|sin 2x|cos² x|1 − sin 2x", "1 − 2 sin² x = ?|cos 2x|sin 2x|cos² x|1 − sin 2x"],
  [1, "tan(α + β) = (tan α + tan β) : ?|1 − tan α tan β|1 + tan α tan β|tan α tan β|1 − tan α", "tan(α + β) = (tan α + tan β) : ?|1 − tan α tan β|1 + tan α tan β|tan α tan β|1 − tan α"],
  [1, "sin(90° + x) = ?|cos x|sin x|−cos x|−sin x", "sin(90° + x) = ?|cos x|sin x|−cos x|−sin x"],
  [1, "cos(180° − x) = ?|−cos x|cos x|sin x|−sin x", "cos(180° − x) = ?|−cos x|cos x|sin x|−sin x"],
]);

def("m2_sincos", "tr", 12, "△sin", "Sinusni in kosinusni izrek", "Laws of sines and cosines", (t, ctx) => {
  const S = ["a", "b", "c"], A = ["α", "β", "γ"];
  if (t === 1) {
    if (Math.random() < 0.6) {
      const [i, j, k] = shuffle([0, 1, 2]);
      const kind = R(0, 2);
      const data = kind === 0 ? "a, b, c" : kind === 1 ? `${[S[i], S[j]].sort().join(", ")}, ${A[k]}` : `${S[i]}, ${[A[j], A[k]].sort((x, y) => A.indexOf(x) - A.indexOf(y)).join(", ")}`;
      const cos = kind < 2;
      const opts = L(ctx, ["kosinusni izrek", "sinusni izrek", "Pitagorov izrek", "Talesov izrek"], ["law of cosines", "law of sines", "Pythagoras", "Thales' theorem"]);
      return out(L(ctx, `Znani so ${data}. Kateri izrek uporabimo?`, `Given ${data}. Which law do we use?`), opts[cos ? 0 : 1], opts.filter((_, x) => x !== (cos ? 0 : 1)));
    }
    const [ang, sv] = pick([[30, 0.5], [90, 1], [150, 0.5]]);
    const a = R(2, 12);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `a = ${a} cm, α = ${ang}°. Polmer očrtane krožnice R?`, `a = ${a} cm, α = ${ang}°. Circumradius R?`), a / (2 * sv), " cm", [a * sv, a / sv, 2 * a * sv, a], { step: 0.5 });
    return nq(ctx, L(ctx, `R = ${a} cm, α = ${ang}°. a = ?`, `R = ${a} cm, α = ${ang}°. a = ?`), 2 * a * sv, " cm", [a * sv, a / (2 * sv), 2 * a, a / sv], { step: 0.5 });
  }
  if (t === 2) {
    const [b, c, a, ang] = pick([[3, 8, 7, 60], [5, 8, 7, 60], [7, 15, 13, 60], [8, 15, 13, 60], [5, 21, 19, 60], [16, 21, 19, 60], [6, 16, 14, 60], [10, 16, 14, 60], [3, 5, 7, 120], [7, 8, 13, 120], [5, 16, 19, 120], [6, 10, 14, 120], [9, 15, 21, 120]]);
    const [x, y, z] = pick([["b", "c", "a"], ["a", "c", "b"], ["a", "b", "c"]]);
    const g = { a: "α", b: "β", c: "γ" }[z];
    const other = ang === 60 ? b * b + c * c + b * c : b * b + c * c - b * c;
    const ws = [rootS(ctx, 1, b * b + c * c), rootS(ctx, 1, other), String(b + c), String(c - b), rootS(ctx, 1, b * b + c * c - 2 * b * c)];
    return out(`${x} = ${b}, ${y} = ${c}, ${g} = ${ang}°. ${z} = ?`, String(a), ws.filter((w) => w !== String(a) && !/NaN/.test(w)));
  }
  // sinusni izrek: b = a · sin β / sin α
  const SIN = { 30: [1, 2, 1], 45: [1, 2, 2], 60: [1, 2, 3], 90: [1, 1, 1], 120: [1, 2, 3], 135: [1, 2, 2], 150: [1, 2, 1] }; // sin = (p/q)√m
  for (;;) {
    const al = pick([30, 45, 60, 90, 120, 135, 150]), be = pick([30, 45, 60, 90, 120, 135]);
    if (al + be >= 180 || al === be) continue;
    const [pa, qa, ma] = SIN[al], [pb, qb, mb] = SIN[be];
    // b = a · (pb/qb)√mb / ((pa/qa)√ma) = a · (pb·qa)/(qb·pa) · √(mb·ma) / ma
    const a = R(1, 6) * 2 * ma;
    const k = (a * pb * qa) / (qb * pa * ma), m = mb * ma;
    if (!Number.isInteger(k * 2)) continue;
    const ans = rootS(ctx, k, m);
    const inv = (pa * qb * a) / (qa * pb * mb); // napačno obrnjeno razmerje (· √(ma·mb))
    const ws = [rootS(ctx, inv, m), rootS(ctx, k * 2, m), String(a), rootS(ctx, k, m === 1 ? 2 : 1), rootS(ctx, k / 2, m)].filter((w) => w !== ans);
    return out(`a = ${a}, α = ${al}°, β = ${be}°. b = ?`, ans, ws);
  }
});

def("m2_poly", "al", 12, "p(x)", "Polinomi", "Polynomials", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.5) {
      const m = R(1, 4), n = R(1, 4), a = R(1, 5), b = R(1, 5) * pick([1, -1]);
      const p1 = poly([1, 0, ...Array(Math.max(0, m - 1)).fill(0), a].slice(0, m + 1).map((v, i, arr) => (i === arr.length - 1 ? a : v)));
      const P1 = m === 1 ? `(x + ${a})` : `(x${sup(m)} + ${a})`;
      const P2 = n === 1 ? `(x ${b < 0 ? M : "+"} ${Math.abs(b)})` : `(x${sup(n)} ${b < 0 ? M : "+"} ${Math.abs(b)})`;
      void p1;
      return nq(ctx, L(ctx, `Stopnja polinoma ${P1}${P2}?`, `Degree of ${P1}${P2}?`), m + n, "", [m * n, Math.max(m, n), m + n + 1, m + n - 1], { int: true });
    }
    const a = R(2, 5), b = R(2, 5) * pick([1, -1]), m = R(1, 3), n = R(1, 3);
    const P1 = `(${a}x${m > 1 ? sup(m) : ""} ${M} 1)`, P2 = `(${b < 0 ? M : ""}${Math.abs(b)}x${n > 1 ? sup(n) : ""} + 2)`;
    return nq(ctx, L(ctx, `Vodilni koeficient polinoma ${P1}${P2}?`, `Leading coefficient of ${P1}${P2}?`), a * b, "", [a + b, a, b, -a * b, m + n], { int: true, neg: true });
  }
  const cs = [R(1, 3) * pick([1, -1]), R(-5, 5), R(-6, 6), R(-9, 9)];
  const p = (x) => cs.reduce((s, c) => s * x + c, 0);
  if (t === 2) {
    const c = R(1, 3) * pick([1, -1]);
    const div = `(x ${c > 0 ? M : "+"} ${Math.abs(c)})`;
    return nq(ctx, L(ctx, `Ostanek pri (${poly(cs)}) : ${div}?`, `Remainder of (${poly(cs)}) : ${div}?`), p(c), "", [p(-c), cs[3], cs.reduce((a, b) => a + b, 0), p(c) + c, -p(c)], { int: true, neg: true });
  }
  if (Math.random() < 0.5) {
    const r = R(1, 3) * pick([1, -1]), a = R(-6, 6), b = -(r ** 3) - a * r;
    if (!b) return nq(ctx, L(ctx, `p(x) = x³ + ax ${M} 6 ima ničlo 2. a = ?`, `p(x) = x³ + ax ${M} 6 has root 2. a = ?`), -1, "", [1, 7, -7, 3], { int: true, neg: true });
    const bs = `${b < 0 ? M : "+"} ${Math.abs(b)}`;
    return nq(ctx, L(ctx, `p(x) = x³ + ax ${bs} ima ničlo ${I(r)}. a = ?`, `p(x) = x³ + ax ${bs} has root ${I(r)}. a = ?`), a, "", [-a, (r ** 3 - b) / r, (b - r ** 3) / r === a ? a + 1 : (b - r ** 3) / r, a + r], { int: true, neg: true });
  }
  if (Math.random() < 0.5 && Math.abs(cs[0] + cs[1] + cs[2]) <= 9 && cs[0] + cs[1] + cs[2] !== 0) cs[3] = -(cs[0] + cs[1] + cs[2]); // x = 1 je ničla
  const ps = poly(cs), sum = cs.reduce((a, b) => a + b, 0);
  return out(L(ctx, `Ali je x = 1 ničla p(x) = ${ps}?`, `Is x = 1 a root of p(x) = ${ps}?`), sum === 0 ? L(ctx, "da, p(1) = 0", "yes, p(1) = 0") : L(ctx, `ne, p(1) = ${I(sum)}`, `no, p(1) = ${I(sum)}`),
    [sum === 0 ? L(ctx, `ne, p(1) = ${I(cs[3])}`, `no, p(1) = ${I(cs[3])}`) : L(ctx, "da, p(1) = 0", "yes, p(1) = 0"), L(ctx, `ne, p(1) = ${I(sum + 2)}`, `no, p(1) = ${I(sum + 2)}`), L(ctx, `ne, p(1) = ${I(p(-1) === sum ? sum - 3 : p(-1))}`, `no, p(1) = ${I(p(-1) === sum ? sum - 3 : p(-1))}`), L(ctx, `ne, p(1) = ${I(-sum || 5)}`, `no, p(1) = ${I(-sum || 5)}`), L(ctx, `ne, p(1) = ${I(sum + 1)}`, `no, p(1) = ${I(sum + 1)}`)]);
});

def("m2_polygraph", "fn", 12, "⌒", "Graf polinoma", "Graphs of polynomials", (t, ctx) => {
  const fac = (r, k) => `(x ${r > 0 ? M : "+"} ${Math.abs(r)})${k > 1 ? sup(k) : ""}`;
  if (t === 1) {
    const a = R(1, 4) * pick([1, -1]), n = R(2, 5), toPos = Math.random() < 0.5;
    const cs = Array(n + 1).fill(0);
    cs[0] = a;
    cs[n - 1] = R(1, 5) * pick([1, -1]);
    cs[n] = R(-6, 6);
    const ps = poly(cs);
    const sign = a > 0 ? 1 : -1, end = toPos ? sign : sign * (n % 2 ? -1 : 1);
    const ans = end > 0 ? "∞" : M + "∞";
    return out(L(ctx, `p(x) = ${ps}. Ko gre x → ${toPos ? "" : M}∞, gre p(x) → ?`, `p(x) = ${ps}. As x → ${toPos ? "" : M}∞, p(x) → ?`), ans, [end > 0 ? M + "∞" : "∞", "0", I(a), L(ctx, "ne obstaja", "no limit")]);
  }
  const r1 = R(-4, 4) || 1;
  let r2 = R(-4, 4);
  while (r2 === r1 || r2 === 0) r2 = R(-4, 4);
  const k1 = R(1, 3), k2 = R(1, 2);
  const ps = `${fac(r1, k1)}${fac(r2, k2)}`;
  if (t === 2) {
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `p(x) = ${ps}. Stopnja ničle x = ${I(r1)}?`, `p(x) = ${ps}. Multiplicity of x = ${I(r1)}?`), k1, "", [k2, k1 + k2, k1 + 1, 2 * k1], { int: true });
    const touch = k1 % 2 === 0;
    const opts = L(ctx, ["se dotakne osi x", "seka os x", "ima tam pol", "ima asimptoto"], ["touches the x-axis", "crosses the x-axis", "has a pole", "has an asymptote"]);
    return out(L(ctx, `p(x) = ${ps}. Pri x = ${I(r1)} graf?`, `p(x) = ${ps}. At x = ${I(r1)} the graph?`), opts[touch ? 0 : 1], opts.filter((_, i) => i !== (touch ? 0 : 1)));
  }
  if (Math.random() < 0.5) {
    const r3 = pick([-5, 5, 6, -6].filter((x) => x !== r1 && x !== r2));
    const p0 = (-r1) ** 1 * (-r2) * (-r3);
    return nq(ctx, `p(x) = ${fac(r1, 1)}${fac(r2, 1)}${fac(r3, 1)}. p(0) = ?`, p0, "", [-p0, r1 * r2 * r3 === p0 ? p0 + 1 : r1 * r2 * r3, r1 + r2 + r3, 0], { int: true, neg: true });
  }
  const k3 = R(1, 3);
  const ps3 = `x${k3 > 1 ? sup(k3) : ""}${fac(r1, k1)}${fac(r2, k2)}`;
  return nq(ctx, L(ctx, `Koliko različnih ničel ima p(x) = ${ps3}?`, `How many distinct roots does p(x) = ${ps3} have?`), 3, "", [k1 + k2 + k3, 2, 4, k1 + k2 + k3 + 1], { int: true });
});

const sq2 = (v, c) => (c === 0 ? `${v}²` : `(${v} ${c > 0 ? M : "+"} ${Math.abs(c)})²`); // (x − p)²
def("m2_circeq", "ge", 12, "S,r", "Enačba krožnice", "Equation of a circle", (t, ctx) => {
  const p = R(-6, 6), q = R(-6, 6), r = R(1, 9);
  const S = (x, y) => `S${pt(x, y)}`;
  if (t === 1) {
    const eq = `${sq2("x", p)} + ${sq2("y", q)} = ${r * r}`;
    if (Math.random() < 0.5) return out(L(ctx, `${eq}. Središče?`, `${eq}. Centre?`), S(p, q), [S(-p, -q), S(p, -q), S(-p, q), S(q, p)].filter((x) => x !== S(p, q)), [S(p + 1, q), S(p, q - 1), S(r, 0), S(0, r), S(r, r)]);
    return nq(ctx, L(ctx, `${eq}. Polmer?`, `${eq}. Radius?`), r, "", [r * r, 2 * r, r * r / 2, r + 1], { int: true });
  }
  if (t === 2) {
    const D = -2 * p, E = -2 * q, F = p * p + q * q - r * r;
    const eq = `x² + y²${D ? ` ${D < 0 ? M : "+"} ${Math.abs(D)}x` : ""}${E ? ` ${E < 0 ? M : "+"} ${Math.abs(E)}y` : ""}${F ? ` ${F < 0 ? M : "+"} ${Math.abs(F)}` : ""} = 0`;
    if (!D && !E) return C.find((c) => c.id === "m2_circeq").gen(1, ctx);
    if (Math.random() < 0.5) return out(L(ctx, `${eq}. Središče?`, `${eq}. Centre?`), S(p, q), [S(-p, -q), S(D, E), S(-D, -E), S(q, p)].filter((x) => x !== S(p, q)), [S(p + 1, q)]);
    const wrongR = Math.abs(F) ? Math.sqrt(Math.abs(F)) : r + 1;
    return nq(ctx, L(ctx, `${eq}. Polmer?`, `${eq}. Radius?`), r, "", [r * r, Number.isInteger(wrongR) ? wrongR : r + 2, p * p + q * q, r + 1], { int: true });
  }
  const kind = pick(["sek", "tan", "mim"]);
  const vert = Math.random() < 0.5;
  const dist = kind === "sek" ? R(0, r - 1) : kind === "tan" ? r : r + R(1, 3);
  const c0 = (vert ? p : q) + dist * pick([1, -1]);
  const eq = `${sq2("x", p)} + ${sq2("y", q)} = ${r * r}`;
  const line = `${vert ? "x" : "y"} = ${I(c0)}`;
  const n = { sek: 2, tan: 1, mim: 0 }[kind];
  if (eq.length + line.length > 34) return C.find((c) => c.id === "m2_circeq").gen(t, ctx);
  return out(L(ctx, `${eq} in ${line}. Koliko skupnih točk?`, `${eq} and ${line}. Common points?`), String(n), ["0", "1", "2", "3"].filter((x) => x !== String(n)));
});

def("m2_conics", "ge", 12, "y²=", "Elipsa, hiperbola, parabola", "Ellipse, hyperbola, parabola", (t, ctx) => {
  const EL = [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [17, 8, 15], [17, 15, 8], [25, 7, 24], [25, 24, 7]]; // a, b, e
  const HY = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17]];
  const elS = (a, b) => `x²/${a * a} + y²/${b * b} = 1`, hyS = (a, b) => `x²/${a * a} ${M} y²/${b * b} = 1`;
  const F = (e) => `(±${e}, 0)`;
  if (t === 1) {
    if (Math.random() < 0.5) {
      const names = L(ctx, ["elipsa", "hiperbola", "parabola", "krožnica"], ["ellipse", "hyperbola", "parabola", "circle"]);
      const k = R(0, 3);
      const [a, b] = pick(EL);
      const [ha, hb] = pick(HY);
      const p = 2 * R(1, 6);
      const q = [elS(a, b), hyS(ha, hb), `y² = ${2 * p}x`, `x² + y² = ${R(2, 9) ** 2}`][k];
      const ws = names.filter((_, i) => i !== k && !(k === 3 && i === 0)); // krožnica je tudi elipsa
      if (k === 3) ws.push(L(ctx, "premica", "line"));
      return out(L(ctx, `${q}: katera krivulja?`, `${q}: which curve?`), names[k], ws);
    }
    const [a, b] = pick(EL);
    const half = Math.random() < 0.5;
    return nq(ctx, L(ctx, `Elipsa ${elS(a, b)}. ${half ? "Velika polos" : "Mala polos"}?`, `Ellipse ${elS(a, b)}. ${half ? "Semi-major axis" : "Semi-minor axis"}?`), half ? a : b, "", [half ? a * a : b * b, half ? b : a, 2 * (half ? a : b), half ? a * a / 2 : b + 1], { int: true });
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const [a, b, e] = pick(EL);
      const sum = a * a + b * b;
      return out(L(ctx, `Elipsa ${elS(a, b)}. Gorišči?`, `Ellipse ${elS(a, b)}. Foci?`), F(e), [`(±${rootS(ctx, 1, sum)}, 0)`, F(a), F(b), `(0, ±${e})`]);
    }
    const [a, b, e] = pick(HY);
    const df = Math.abs(a * a - b * b);
    return out(L(ctx, `Hiperbola ${hyS(a, b)}. Gorišči?`, `Hyperbola ${hyS(a, b)}. Foci?`), F(e), [`(±${rootS(ctx, 1, df)}, 0)`, F(a), F(b), `(0, ±${e})`]);
  }
  if (Math.random() < 0.5) {
    const [a, b] = pick(HY);
    const fr2 = (n, d) => { const s = frs(n, d); return s.includes("/") ? s.replace(/^(\d+)\/(\d+)$/, "$1x/$2") : `${s}x`; };
    const asym = (n, d) => `y = ±${fr2(n, d)}`;
    return out(L(ctx, `Hiperbola ${hyS(a, b)}. Asimptoti?`, `Hyperbola ${hyS(a, b)}. Asymptotes?`), asym(b, a), [asym(a, b), asym(b * b, a * a), asym(b, Math.sqrt(a * a + b * b)), asym(a, Math.sqrt(a * a + b * b))]);
  }
  const p = 2 * R(1, 6), f = p / 2;
  const ver = Math.random() < 0.5;
  const eq = ver ? `x² = ${2 * p}y` : `y² = ${2 * p}x`;
  if (Math.random() < 0.5) {
    const P2 = (x, y) => `F${pt(x, y)}`;
    return out(L(ctx, `Parabola ${eq}. Gorišče?`, `Parabola ${eq}. Focus?`), ver ? P2(0, f) : P2(f, 0), ver ? [P2(f, 0), P2(0, p), P2(0, 2 * p), P2(0, -f)] : [P2(0, f), P2(p, 0), P2(2 * p, 0), P2(-f, 0)]);
  }
  const v = ver ? "y" : "x", o = ver ? "x" : "y";
  return out(L(ctx, `Parabola ${eq}. Vodnica?`, `Parabola ${eq}. Directrix?`), `${v} = ${I(-f)}`, [`${v} = ${f}`, `${v} = ${I(-p)}`, `${o} = ${I(-f)}`, `${v} = ${I(-2 * p)}`]);
});

def("m2_solids", "ge", 12, "V=", "Površina in prostornina teles", "Surface area and volume of solids", (t, ctx) => {
  const pc = (k, u) => `${piS(ctx, k)} ${u}`;
  if (t === 1) {
    const r = R(1, 6), v = R(2, 10), kind = R(0, 2);
    if (kind === 0) return out(L(ctx, `Valj: r = ${r} cm, v = ${v} cm. Prostornina?`, `Cylinder: r = ${r} cm, h = ${v} cm. Volume?`), pc(r * r * v, "cm³"), [pc(2 * r * v, "cm³"), pc(r * v, "cm³"), pc(2 * r * r * v, "cm³"), pc((r * r * v) / 3, "cm³"), pc(4 * r * r * v, "cm³"), pc((r * r * v) / 2, "cm³"), pc(r * r + r * v, "cm³")].filter((x) => !/\d[,.]\d{3}/.test(x)));
    if (kind === 1) {
      const vv = 3 * R(1, 4);
      return out(L(ctx, `Stožec: r = ${r} cm, v = ${vv} cm. Prostornina?`, `Cone: r = ${r} cm, h = ${vv} cm. Volume?`), pc((r * r * vv) / 3, "cm³"), [pc(r * r * vv, "cm³"), pc((r * vv) / 3, "cm³"), pc((2 * r * r * vv) / 3, "cm³"), pc((r * r * vv) / 2, "cm³")].filter((x) => !/\d[,.]\d{3}/.test(x)));
    }
    return out(L(ctx, `Krogla: r = ${r} cm. Površina?`, `Sphere: r = ${r} cm. Surface area?`), pc(4 * r * r, "cm²"), [pc(2 * r * r, "cm²"), pc(r * r, "cm²"), pc(4 * r, "cm²"), pc(8 * r * r, "cm²")]);
  }
  if (t === 2) {
    const kind = R(0, 2);
    if (kind === 0) {
      const [r, v, s] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [9, 12, 15], [8, 15, 17], [12, 5, 13]]);
      return out(L(ctx, `Stožec: r = ${r} cm, v = ${v} cm. Plašč?`, `Cone: r = ${r} cm, h = ${v} cm. Lateral area?`), pc(r * s, "cm²"), [pc(r * v, "cm²"), pc(r * (r + s), "cm²"), pc(2 * r * s, "cm²"), pc(r * r * v, "cm²")]);
    }
    if (kind === 1) {
      const r = 3 * R(1, 3);
      return out(L(ctx, `Krogla: r = ${r} cm. Prostornina?`, `Sphere: r = ${r} cm. Volume?`), pc((4 * r ** 3) / 3, "cm³"), [pc(4 * r * r, "cm³"), pc(4 * r ** 3, "cm³"), pc(r ** 3, "cm³"), pc((r ** 3) / 3, "cm³")].filter((x) => x !== pc((4 * r ** 3) / 3, "cm³")));
    }
    const r = R(1, 6), v = R(2, 10);
    return out(L(ctx, `Valj: r = ${r} cm, v = ${v} cm. Površina?`, `Cylinder: r = ${r} cm, h = ${v} cm. Surface area?`), pc(2 * r * (r + v), "cm²"), [pc(2 * r * v, "cm²"), pc(r * (r + v), "cm²"), pc(r * r * v, "cm²"), pc(2 * r * r + r * v, "cm²"), pc(r * r + 2 * r * v, "cm²"), pc(4 * r * (r + v), "cm²")]);
  }
  const kind = R(0, 3);
  if (kind === 0) {
    const r = R(1, 6), v = R(2, 9);
    return nq(ctx, L(ctx, `Valj: V = ${piS(ctx, r * r * v)} cm³, r = ${r} cm. Višina?`, `Cylinder: V = ${piS(ctx, r * r * v)} cm³, r = ${r} cm. Height?`), v, " cm", [r * v, r * r * v, v * r * r / 2, v + r], { int: true });
  }
  if (kind === 1) {
    const r = 3 * R(1, 2);
    const V = (4 * r ** 3) / 3;
    return nq(ctx, L(ctx, `Krogla: V = ${piS(ctx, V)} cm³. Polmer?`, `Sphere: V = ${piS(ctx, V)} cm³. Radius?`), r, " cm", [V / 4, Math.round(Math.cbrt(V)), 2 * r, r * r], { int: true });
  }
  if (kind === 2) {
    const a = 2 * R(1, 6);
    return out(L(ctx, `Kocki z robom ${a} cm je očrtana krogla. Polmer?`, `Sphere circumscribed about a cube, edge ${a} cm. Radius?`), `${rootS(ctx, a / 2, 3)} cm`, [`${rootS(ctx, a / 2, 2)} cm`, `${ctx.num(a / 2)} cm`, `${rootS(ctx, a, 3)} cm`, `${ctx.num(a)} cm`]);
  }
  const a = 2 * R(1, 8);
  return nq(ctx, L(ctx, `Kocki z robom ${a} cm je včrtana krogla. Polmer?`, `Sphere inscribed in a cube, edge ${a} cm. Radius?`), a / 2, " cm", [a, a / 4, 2 * a], { int: true });
});

def("m2_seqlim", "sq", 13, "aₙ→", "Lastnosti in limita zaporedja", "Sequence properties and limit", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.5) {
      const names = L(ctx, ["naraščajoče", "padajoče", "alternirajoče", "konstantno"], ["increasing", "decreasing", "alternating", "constant"]);
      const k = R(2, 9), c = R(1, 9);
      const opts = [
        [`aₙ = ${k}n ${M} ${c}`, 0], [`aₙ = ${c} ${M} ${k}n`, 1], [`aₙ = ${k}/n`, 1], [`aₙ = ${c} ${M} ${k}/n`, 0],
        [`aₙ = n² + ${c}`, 0], [`aₙ = (${M}1)ⁿ · ${k}`, 2], [`aₙ = (${M}${k})ⁿ`, 2], [`aₙ = ${k}ⁿ`, 0],
        [`aₙ = 1/${k}ⁿ`, 1], [`aₙ = (${M}1)ⁿ/n`, 2], [`aₙ = ${c} + ${k}/n`, 1], [`aₙ = ${M}n² + ${c}`, 1],
      ];
      const [f, i] = pick(opts);
      return out(L(ctx, `Zaporedje ${f} je?`, `The sequence ${f} is?`), names[i], names.filter((_, j) => j !== i));
    }
    const p = R(1, 3), q = R(-6, 6), n = R(3, 6);
    const v = (m) => p * m * m + q * m;
    const f = `${p === 1 ? "" : p}n²${q ? ` ${q < 0 ? M : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}n` : ""}`;
    const sub = "₀₁₂₃₄₅₆₇₈₉";
    return nq(ctx, L(ctx, `aₙ = ${f}. a${sub[n]} = ?`, `aₙ = ${f}. a${sub[n]} = ?`), v(n), "", [v(n + 1), v(n - 1), p * n * n - q * n, p * 2 * n + q * n, p * n + q * n], { neg: true, int: true });
  }
  if (t === 2) {
    const kind = R(0, 3);
    if (kind === 0) {
      let a = R(1, 9), b = R(-9, 9), c = R(1, 9), d = R(-9, 9);
      if (Math.random() < 0.3) a = -a;
      if (gcd(a, c) === Math.max(Math.abs(a), c) && Math.random() < 0.5) c = c + 1;
      const term = (x, y, e) => `${x === 1 ? "" : x === -1 ? M : I(x)}n${e}${y ? ` ${y < 0 ? M : "+"} ${Math.abs(y)}` : ""}`;
      const e = pick(["", "²"]);
      const q = `lim n→∞ (${term(a, b, e)})/(${term(c, d, e)})`;
      return out(L(ctx, `${q} = ?`, `${q} = ?`), frs(a, c), [frs(c, a), d ? frs(b, d) : null, "0", c + d ? frs(a + b, c + d) : null, frs(-a, c)], ["1", "∞"]);
    }
    if (kind === 1) {
      const a = R(1, 9), b = R(1, 9), c = R(1, 9);
      const q = `lim n→∞ (${a === 1 ? "" : a}n + ${b})/(${c === 1 ? "" : c}n² + 1)`;
      return out(L(ctx, `${q} = ?`, `${q} = ?`), "0", [frs(a, c), frs(b, 1), "∞", frs(a + b, c + 1)], ["1", I(a), frs(b, c), "1/2"]);
    }
    if (kind === 2) {
      const k = R(1, 3);
      const q = `lim n→∞ (1 + ${k === 1 ? "1" : k}/n)ⁿ`;
      const ek = k === 1 ? "e" : `e${sup(k)}`;
      return out(L(ctx, `${q} = ?`, `${q} = ?`), ek, ["1", "∞", k === 1 ? "2" : `${k}e`, k === 1 ? "e²" : "e", "0"]);
    }
    const c = R(1, 9), den = R(2, 5), s = pick(["+", M]);
    const q = `lim n→∞ (${c} ${s} 1/${den}ⁿ)`;
    return out(L(ctx, `${q} = ?`, `${q} = ?`), String(c), ["0", "∞", `1/${den}`, I(s === "+" ? c + 1 : c - 1)]);
  }
  if (Math.random() < 0.6) {
    let k, e;
    do {
      k = R(1, 5);
      e = pick([3, 4, 6, 7, 8, 9, 11, 12, 15]);
    } while ((100 * k) % e === 0);
    const L0 = R(-3, 5), cnt = Math.floor((100 * k) / e);
    const f = `aₙ = ${L0 ? `${I(L0)} + ` : ""}${k}/n`;
    return nq(ctx, L(ctx, `${f}, ε = ${ctx.num(e / 100)}. Koliko členov je zunaj ε-okolice?`, `${f}, ε = ${ctx.num(e / 100)}. Terms outside the ε-band?`), cnt, "", [cnt + 1, cnt - 1, Math.floor((10 * k) / e) || null, k * e], { int: true });
  }
  const a = 2 * R(1, 6);
  const q = `lim n→∞ (√(n² + ${a}n) ${M} n)`;
  return out(L(ctx, `${q} = ?`, `${q} = ?`), String(a / 2), ["0", "∞", String(a), a === 4 ? "16" : `√${a}`, "1"]); // √4 = 2 bi bil pravilen
});

def("m2_normal", "st", 13, "σ", "Normalna porazdelitev", "Normal distribution", (t, ctx) => {
  const [mu, sg] = pick([[100, 15], [50, 4], [70, 5], [170, 8], [20, 2], [60, 10], [30, 3]]);
  const head = L(ctx, `Normalna porazdelitev, μ = ${ctx.num(mu)}, σ = ${ctx.num(sg)}.`, `Normal distribution, μ = ${ctx.num(mu)}, σ = ${ctx.num(sg)}.`);
  const P = (x) => pct(ctx, x);
  if (t === 1) {
    if (Math.random() < 0.6) {
      const z = pick([-3, -2, -1, 1, 2, 3, -1.5, 1.5, 0.5, -0.5, 2.5]);
      const x = mu + z * sg;
      if (!Number.isInteger(x)) return C.find((c) => c.id === "m2_normal").gen(t, ctx);
      return nq(ctx, `${head} ${L(ctx, `x = ${ctx.num(x)}. z = ?`, `x = ${ctx.num(x)}. z = ?`)}`, z, "", [-z, x - mu, x / sg, z * 2, z + 1], { neg: true, step: 0.5 });
    }
    const sgn = pick([">", "<"]);
    return out(`${head} P(X ${sgn} ${ctx.num(mu)}) = ?`, P(50), [P(0), P(100), P(68), P(34), P(25)]);
  }
  if (t === 2) {
    const k = R(1, 3);
    const p = [68, 95, 99.7][k - 1];
    return out(`${head} P(${ctx.num(mu - k * sg)} < X < ${ctx.num(mu + k * sg)}) ≈ ?`, P(p), [P(68), P(95), P(99.7), P(50), P(34), P(47.5)].filter((x) => x !== P(p)));
  }
  const kind = R(0, 7);
  if (kind === 7) {
    const k = pick([1, 2]), up = Math.random() < 0.5;
    const pv = k === 1 ? 16 : 2.5;
    const a = up ? mu + k * sg : mu - k * sg;
    const q = L(ctx, `P(X ${up ? ">" : "<"} a) ≈ ${ctx.num(pv)} %. a?`, `P(X ${up ? ">" : "<"} a) ≈ ${ctx.num(pv)}%. a?`);
    return nq(ctx, `${head} ${q}`, a, "", [up ? mu - k * sg : mu + k * sg, up ? mu + (3 - k) * sg : mu - (3 - k) * sg, mu + (up ? 1 : -1) * k * sg * 2, mu], { int: true, step: sg });
  }
  const cases = [
    [`X > ${ctx.num(mu + sg)}`, 16], [`X < ${ctx.num(mu - sg)}`, 16], [`X > ${ctx.num(mu + 2 * sg)}`, 2.5], [`X < ${ctx.num(mu - 2 * sg)}`, 2.5],
    [`${ctx.num(mu)} < X < ${ctx.num(mu + sg)}`, 34], [`${ctx.num(mu + sg)} < X < ${ctx.num(mu + 2 * sg)}`, 13.5],
    [`X < ${ctx.num(mu + 2 * sg)}`, 97.5], [`X < ${ctx.num(mu + sg)}`, 84], [`X > ${ctx.num(mu - sg)}`, 84], [`X > ${ctx.num(mu + 3 * sg)}`, 0.15],
  ];
  const [cond, p] = pick(cases);
  return out(`${head} P(${cond}) ≈ ?`, P(p), [P(16), P(2.5), P(34), P(13.5), P(84), P(97.5), P(68), P(5), P(0.3), P(47.5)].filter((x) => x !== P(p)));
});
