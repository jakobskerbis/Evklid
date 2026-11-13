// Pojmi za igre: matematika 1.–5. razred OŠ (glej README.md v tej mapi).
// Dopolni matematiko iz ../topics.js (SUBJECT = "MAT"), zato uporablja njena področja ar, fr, ge, st, sq
// in doda eno novo: me (Merjenje). Ne podvaja add, sub, mul, div, rem, round, order, place, perimeter, units, seq_next.
// Za 1. in 2. razred: kratka vprašanja z malo besedami. Napačni odgovori so tipične otroške napake.

export const SUBJECT = "MAT";

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
const C = [];
const def = (id, area, year, glyph, sl, en, gen) => C.push({ id, area, year, glyph, name: { sl, en }, gen });

// Naloga: tipične napake najprej (premešane), nato rezervni napačni; 3–4 napačni, brez podvajanja.
function out(q, a, ws, fill = []) {
  const seen = new Set([a]);
  const w = [];
  for (const s of [...shuffle(ws), ...fill]) {
    if (s == null || s === "" || seen.has(s) || w.length >= 4) continue;
    seen.add(s);
    w.push(s);
  }
  return { q, a, w: shuffle(w) };
}
// Celo število; od 10 000 naprej s presledki med tisočicami (sl) oziroma vejicami (en).
const G = (ctx, n) => (Math.abs(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ctx.lang === "sl" ? " " : ",") : String(n));
// Številski odgovor (cela nenegativna števila); napačni so tipične napake, nato bližnja števila.
function nq(ctx, q, a, ws, unit = "", step = 1) {
  const f = (x) => (unit === "€" && ctx.lang !== "sl" ? "€" + G(ctx, x) : G(ctx, x) + (unit ? " " + unit : ""));
  const ok = (x) => Number.isInteger(x) && x >= 0 && x !== a;
  const W = ws.filter((x) => typeof x !== "number" || ok(x)).map((x) => (typeof x === "number" ? f(x) : x));
  const F = [1, -1, 2, -2, 10, -10, 3, -3, 5, 4].map((d) => a + d * step).filter(ok).map(f);
  return out(q, f(a), W, F);
}
// Izbira enega izmed nizov (napačni so izključno iz ws).
const choice = (q, a, ws) => out(q, a, ws);
// k različnih vrednosti iz generatorja
function distinct(k, gen) {
  const s = new Set();
  for (let i = 0; s.size < k && i < 500; i++) s.add(gen());
  return [...s];
}
// Slovenska dvojina/množina: oblike "1|2|3–4|5+"; odloča zadnji dve števki (21 bonbonov, 102 strani).
function pl(n, forms) {
  const f = forms.split("|"), m = n % 100;
  return `${n} ${m === 1 ? f[0] : m === 2 ? f[1] : m === 3 || m === 4 ? f[2] : f[3]}`;
}
const plEn = (n, forms) => {
  const [s, p] = forms.split("|");
  return `${n} ${n === 1 ? s : p}`;
};
const smallTail = (n) => n % 100 >= 1 && n % 100 <= 4; // pri teh se glagol in samostalnik ne ujemata kot pri 5+

// Števila z besedo (sl, en).
const U = ["", "ena", "dva", "tri", "štiri", "pet", "šest", "sedem", "osem", "devet"];
const U_IN = ["", "ena", "dva", "tri", "štiri", "pet", "šest", "sedem", "osem", "devet"];
const TEEN = ["deset", "enajst", "dvanajst", "trinajst", "štirinajst", "petnajst", "šestnajst", "sedemnajst", "osemnajst", "devetnajst"];
const TENS = ["", "", "dvajset", "trideset", "štirideset", "petdeset", "šestdeset", "sedemdeset", "osemdeset", "devetdeset"];
const HUND = ["", "sto", "dvesto", "tristo", "štiristo", "petsto", "šeststo", "sedemsto", "osemsto", "devetsto"];
const w99 = (n) => (n < 10 ? U[n] : n < 20 ? TEEN[n - 10] : n % 10 ? U_IN[n % 10] + "in" + TENS[Math.floor(n / 10)] : TENS[n / 10]);
const w999 = (n) => [HUND[Math.floor(n / 100)], n % 100 ? w99(n % 100) : ""].filter(Boolean).join(" ");
function slWords(n) {
  if (n === 0) return "nič";
  if (n === 1000000) return "milijon";
  const th = Math.floor(n / 1000), r = n % 1000;
  const parts = [];
  if (th === 1) parts.push("tisoč");
  else if (th) parts.push(w999(th) + " tisoč"); // dva tisoč, sto dva tisoč
  if (r) parts.push(w999(r));
  return parts.join(" ");
}
const okWords = (n) => n < 1000 || Math.floor(n / 1000) === 1 || Math.floor(n / 1000) % 100 !== 1; // brez »sto ena tisoč«
const EU = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const ET = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const e99 = (n) => (n < 20 ? EU[n] : ET[Math.floor(n / 10)] + (n % 10 ? "-" + EU[n % 10] : ""));
const e999 = (n) => {
  const h = Math.floor(n / 100), r = n % 100;
  return [h ? EU[h] + " hundred" : "", r ? (h ? "and " : "") + e99(r) : ""].filter(Boolean).join(" ");
};
function enWords(n) {
  if (n === 1000000) return "one million";
  const th = Math.floor(n / 1000), r = n % 1000;
  const parts = [];
  if (th) parts.push(e999(th) + " thousand");
  if (r) parts.push((th && r < 100 ? "and " : "") + e999(r));
  return parts.join(" ");
}
const words = (ctx, n) => (ctx.lang === "sl" ? slWords(n) : enWords(n));
// Predlog s/z pred številom, kot ga preberemo (s petimi, z dvema, z desetimi, s 50 = s petdesetimi).
const zs = (n) => (/^[cčfhkpsšt]/.test(slWords(n)) ? "s" : "z");

// Napake pri pisnem računanju
const digits = (n) => String(n).split("").reverse().map(Number);
function noCarry(a, b) {
  const x = digits(a), y = digits(b);
  let r = 0;
  for (let i = 0; i < Math.max(x.length, y.length); i++) r += ((x[i] || 0) + (y[i] || 0)) % 10 * 10 ** i;
  return r;
}
function swapSub(a, b) {
  const x = digits(a), y = digits(b);
  let r = 0;
  for (let i = 0; i < x.length; i++) r += Math.abs((x[i] || 0) - (y[i] || 0)) * 10 ** i;
  return r;
}
const swapTU = (n) => n - (n % 100) + (n % 10) * 10 + Math.floor((n % 100) / 10); // zamenjani desetice in enice
const hasCarry = (a, b) => noCarry(a, b) !== a + b;

// Banka: stopnja 1 vzame vnose 1; stopnji 2 in 3 večinoma svoje, v 25 % z nižje stopnje.
function bank(items) {
  return (tier, ctx) => {
    let lv = tier;
    if (tier > 1 && Math.random() < 0.25) lv = tier - 1;
    let pool = items.filter((it) => it[0] === lv);
    if (!pool.length) pool = items.filter((it) => it[0] <= tier);
    const it = pick(pool);
    const [q, a, ...ws] = (ctx.lang === "sl" ? it[1] : it[2]).split("|");
    return out(q, a, ws);
  };
}

// =====================================================================
// ARITMETIKA (ar)
// =====================================================================
// Največje/najmanjše med 4 števili
function extreme(ctx, xs, big) {
  const best = big ? Math.max(...xs) : Math.min(...xs);
  const q = big ? L(ctx, "Katero število je največje?", "Which number is largest?") : L(ctx, "Katero število je najmanjše?", "Which number is smallest?");
  return choice(q, G(ctx, best), xs.filter((x) => x !== best).map((x) => G(ctx, x)));
}
// Predhodnik / naslednik
function neighbour(ctx, n, before) {
  if (before) return nq(ctx, L(ctx, `Predhodnik števila ${G(ctx, n)}?`, `Number just before ${G(ctx, n)}?`), n - 1, n < 20 ? [n + 1, n - 2, n + 2] : [n + 1, n - 10, n - 2, n % 100 === 0 ? n - 101 : n - 11]);
  return nq(ctx, L(ctx, `Naslednik števila ${G(ctx, n)}?`, `Number just after ${G(ctx, n)}?`), n + 1, n < 20 ? [n - 1, n + 2, n - 2] : [n - 1, n + 10, n + 2, n % 10 === 9 ? n - 8 : n + 11]);
}
// Besede → število
function fromWords(ctx, n, ws) {
  return nq(ctx, `»${words(ctx, n)}« = ?`, n, ws);
}

def("m_n20", "ar", 1, "20", "Števila do 20", "Numbers to 20", (t, ctx) => {
  const top = t === 1 ? 10 : 20;
  const k = t === 1 ? R(0, 2) : R(0, 3);
  if (k === 0) {
    const base = R(t === 1 ? 2 : 6, top - 2);
    const xs = distinct(4, () => Math.max(0, Math.min(top, base + R(-4, 4))));
    return extreme(ctx, xs, t < 3 || Math.random() < 0.5);
  }
  if (k === 1) {
    const [a, b] = distinct(2, () => R(0, top));
    const s = (x, op, y) => `${x} ${op} ${y}`;
    const lt = a < b;
    return choice(L(ctx, "Kaj je prav?", "Which is true?"), s(a, lt ? "<" : ">", b), [s(a, lt ? ">" : "<", b), s(a, "=", b), s(b, lt ? "<" : ">", a)]);
  }
  if (k === 2) {
    if (t === 1) {
      const a = R(1, 9);
      return nq(ctx, `${a - 1}, ?, ${a + 1}`, a, [a + 1, a - 1, a + 2]);
    }
    const n = t === 2 ? R(2, 19) : pick([10, 20, 11, 19, R(2, 18)]);
    return neighbour(ctx, n, n === 20 || Math.random() < 0.5); // 1. razred: do 20
  }
  const e = R(1, 9), ones = e === 1 ? "one" : "ones";
  if (Math.random() < 0.5) return nq(ctx, L(ctx, `1 D ${e} E = ?`, `1 ten ${e} ${ones} = ?`), 10 + e, [e * 10 + 1, 1 + e, 10 + e + 1, 10 + e - 1, 100 + e]);
  return nq(ctx, L(ctx, `${10 + e} = 1 D ? E`, `${10 + e} = 1 ten and ? ones`), e, [10 + e, e + 1, 1, e - 1]);
});

def("m_missing", "ar", 1, "□", "Manjkajoče število", "Missing number", (t, ctx) => {
  if (t === 1) {
    const s = R(3, 10), a = R(1, s - 1);
    const q = Math.random() < 0.5 ? `${a} + ? = ${s}` : `? + ${a} = ${s}`;
    return nq(ctx, q, s - a, [s + a, s - a + 1, s - a - 1, a]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const s = R(11, 20), a = R(2, 9);
      if (s - a < 1) return nq(ctx, `${a} + ? = 10`, 10 - a, [10 + a, a]);
      return nq(ctx, `${a} + ? = ${s}`, s - a, [s + a, s - a + 1, s - a - 1, a]);
    }
    const s = R(11, 20), b = R(2, 9);
    return nq(ctx, `${s} ${M} ? = ${s - b}`, b, [s + (s - b), s - b, b + 1, b - 1]);
  }
  const k = R(0, 2);
  if (k === 0) {
    const a = R(2, 9), b = R(2, 20 - a);
    return nq(ctx, `? ${M} ${a} = ${b}`, a + b, [b - a, a + b + 1, a + b - 1, b]);
  }
  if (k === 1) {
    const s = R(12, 20), b = R(3, 9);
    return nq(ctx, `${s} ${M} ? = ${b}`, s - b, [s + b, s - b + 1, s - b - 1, b]);
  }
  const a = R(3, 9), s = R(11, 20);
  return nq(ctx, `? + ${a} = ${s}`, s - a, [s + a, s - a + 1, s - a - 1, a]);
});

def("m_double", "ar", 1, "2×", "Podvajanje in razpolavljanje", "Doubling and halving", (t, ctx) => {
  const dbl = (n) => nq(ctx, L(ctx, `Podvoji ${n}.`, `Double ${n}.`), 2 * n, [2 * n + 1, 2 * n - 1, n + 2, n, n / 2]);
  const half = (m) => nq(ctx, L(ctx, `Razpolovi ${m}.`, `Halve ${m}.`), m / 2, [m / 2 + 1, m / 2 - 1, 2 * m, m - 2]);
  if (t === 1) {
    const r = Math.random();
    if (r < 0.3) {
      const n = R(1, 5);
      return nq(ctx, `${n} + ${n} = ?`, 2 * n, [2 * n + 1, 2 * n - 1, n + 1]);
    }
    return r < 0.65 ? dbl(R(1, 5)) : half(2 * R(1, 5));
  }
  if (t === 2) {
    if (Math.random() < 0.2) {
      const n = R(2, 9);
      return nq(ctx, `${n} + ${n} = ?`, 2 * n, [2 * n + 1, 2 * n - 1, n + 1]);
    }
    return Math.random() < 0.5 ? dbl(R(6, 10)) : half(2 * R(6, 10));
  }
  // 1. razred: vse do 20
  const k = R(0, 2);
  if (k === 0) {
    const n = R(6, 10);
    return nq(ctx, L(ctx, `Katero število podvojim, da dobim ${2 * n}?`, `Which number doubled makes ${2 * n}?`), n, [2 * n, n + 1, n - 1, n + 2]);
  }
  if (k === 1) return half(2 * R(6, 10));
  const h = R(4, 10);
  return nq(ctx, L(ctx, `Polovica števila je ${h}. Katero je število?`, `Half of a number is ${h}. The number?`), 2 * h, [h / 2, h, h + 2, 2 * h + 1]);
});

// Predmeti za kratke besedilne naloge. Oblike v tožilniku (imam 1 bonbon, 2 bonbona, 3 bonbone, 5 bonbonov).
const OBJ = [
  ["bonbon|bonbona|bonbone|bonbonov", "sweet|sweets", true],
  ["jabolko|jabolki|jabolka|jabolk", "apple|apples", true],
  ["piškot|piškota|piškote|piškotov", "biscuit|biscuits", true],
  ["jagodo|jagodi|jagode|jagod", "strawberry|strawberries", true],
  ["balon|balona|balone|balonov", "balloon|balloons", false],
  ["sličico|sličici|sličice|sličic", "sticker|stickers", false],
  ["frnikolo|frnikoli|frnikole|frnikol", "marble|marbles", false],
  ["kocko|kocki|kocke|kock", "block|blocks", false],
];
def("m_word1", "ar", 1, "?", "Besedilne naloge do 20", "Word problems to 20", (t, ctx) => {
  const [slf, enf, food] = pick(OBJ);
  const has = (a) => L(ctx, `Imam ${pl(a, slf)}.`, `I have ${plEn(a, enf)}.`);
  const top = t === 1 ? 10 : 20;
  const kind = t === 1 ? R(0, 1) : t === 2 ? R(0, 2) : R(1, 3);
  if (kind === 0) {
    const a = R(2, top - 2), b = R(2, Math.max(2, Math.min(9, top - a)));
    return nq(ctx, `${has(a)} ${L(ctx, `Dobim še ${b}. Koliko jih imam?`, `I get ${b} more. How many now?`)}`, a + b, [a - b, a + b + 1, a + b - 1, b]);
  }
  if (kind === 1) {
    const a = R(t === 3 ? 11 : 3, top), b = R(2, Math.max(2, Math.min(9, a - 1)));
    const verb = food && Math.random() < 0.6 ? L(ctx, `Pojem jih ${b}.`, `I eat ${b}.`) : L(ctx, `Podarim jih ${b}.`, `I give away ${b}.`);
    return nq(ctx, `${has(a)} ${verb} ${L(ctx, "Koliko jih ostane?", "How many are left?")}`, a - b, [a + b, a - b + 1, a - b - 1, b]);
  }
  if (kind === 2) {
    const c = t === 2 ? pick([10, 20]) : 20, a = R(c === 10 ? 2 : 11, c - 1);
    return nq(ctx, `${has(a)} ${L(ctx, `Koliko jih manjka do ${c}?`, `How many more to make ${c}?`)}`, c - a, [c + a, c - a + 1, c - a - 1, a]);
  }
  const a = R(6, 20), b = R(2, a - 1);
  return nq(ctx, L(ctx, `Imam ${pl(a, slf)}, brat pa ${b}. Za koliko več jih imam?`, `I have ${plEn(a, enf)}, my brother ${b}. How many more?`), a - b, [a + b, a - b + 1, a - b - 1, a]);
});

def("m_n100", "ar", 2, "100", "Števila do 100", "Numbers to 100", (t, ctx) => {
  const tn = (d) => (d === 1 ? "ten" : "tens");
  const DE = (d, e) => (e ? L(ctx, `${d} D ${e} E`, `${d} ${tn(d)} ${e} ${e === 1 ? "one" : "ones"}`) : L(ctx, `${d} D`, `${d} ${tn(d)}`));
  const k = t === 1 ? R(0, 1) : t === 2 ? R(1, 3) : R(2, 4);
  if (k === 0) {
    const d = R(1, 9), e = R(0, 9), n = 10 * d + e;
    return nq(ctx, `${DE(d, e)} = ?`, n, [e ? 10 * e + d : d, d + e, e ? Number(`${d}0${e}`) : 100 * d, n + 1, n - 1]);
  }
  if (k === 1) {
    const x = R(1, 9), y = R(1, 9);
    if (x === y) return extreme(ctx, distinct(4, () => R(10, 99)), true);
    const xs = distinct(4, () => pick([10 * x + y, 10 * y + x, 10 * x + x, 10 * y + y, 10 * x + y + 1, 10 * y + x - 1]));
    return extreme(ctx, xs, t === 1 || Math.random() < 0.5);
  }
  if (k === 2) {
    if (t === 2) {
      const d = R(1, 9), e = R(1, 9), n = 10 * d + e;
      return nq(ctx, L(ctx, `${n} = ? D ${e} E`, `${n} = ? tens and ${e} ${e === 1 ? "one" : "ones"}`), d, [e, n, d + 1, 10 * d]);
    }
    const n = 10 * R(2, 9) + R(1, 9);
    const lo = n - (n % 10);
    const s = (a, b) => L(ctx, `${a} in ${b}`, `${a} and ${b}`);
    return choice(L(ctx, `Med katerima deseticama je ${n}?`, `Which two tens is ${n} between?`), s(lo, lo + 10), [s(lo, n), s(n, lo + 10), s(lo - 10, lo), s(lo + 10, lo + 20)]);
  }
  if (k === 3) {
    const n = t === 2 ? R(11, 98) : pick([10 * R(2, 9), 10 * R(1, 8) + 9]);
    return neighbour(ctx, n, n % 10 === 0 ? true : n % 10 === 9 ? false : Math.random() < 0.5);
  }
  return extreme(ctx, distinct(4, () => R(10, 99)), false);
});

def("m_tens", "ar", 2, "+10", "Računanje do 100", "Mental maths to 100", (t, ctx) => {
  const add = (a, b) => nq(ctx, `${a} + ${b} = ?`, a + b, [noCarry(a, b), a + b + 10, a + b - 10, a + b + 1, a + b - 1]);
  const sub = (a, b) => nq(ctx, `${a} ${M} ${b} = ?`, a - b, [swapSub(a, b), a - b + 10, a - b - 10, a - b + 1, a + b]);
  if (t === 1) {
    const k = R(0, 3);
    if (k === 0) {
      const a = R(1, 8), b = R(1, 9 - a);
      return nq(ctx, `${a * 10} + ${b * 10} = ?`, (a + b) * 10, [a + b, (a + b) * 10 + 10, (a + b) * 10 - 10, (a + b) * 100]);
    }
    if (k === 1) {
      const a = R(2, 9), b = R(1, a - 1);
      return nq(ctx, `${a * 10} ${M} ${b * 10} = ?`, (a - b) * 10, [a - b, (a - b) * 10 + 10, (a + b) * 10]);
    }
    const n = R(11, 89), d = 10 * R(1, Math.floor((99 - n) / 10) || 1);
    if (k === 2 && n + d <= 99) return nq(ctx, `${n} + ${d} = ?`, n + d, [n + d / 10, n + d + 1, n + d - 1, n + d + 10]);
    const m = R(21, 99), e = 10 * R(1, Math.floor(m / 10) - 1);
    return nq(ctx, `${m} ${M} ${e} = ?`, m - e, [m - e / 10, m - e + 10, m - e - 1, m + e]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const a = 10 * R(1, 8) + R(2, 9), b = R(10 - (a % 10), 9);
      return add(a, b);
    }
    const a = 10 * R(2, 9) + R(0, 7), b = R((a % 10) + 1, 9);
    return sub(a, b);
  }
  if (Math.random() < 0.5) {
    const a = R(15, 79), b = R(11, 99 - a);
    return add(a, b);
  }
  const a = R(30, 99), b = R(11, a - 5);
  return sub(a, b);
});

def("m_even", "ar", 2, "2n", "Soda in liha števila", "Even and odd numbers", (t, ctx) => {
  const even = Math.random() < 0.5;
  const top = t === 1 ? 20 : 100;
  if (t === 3 && Math.random() < 0.35) {
    const n = 2 * R(10, 48);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Katero sodo število sledi številu ${n}?`, `Next even number after ${n}?`), n + 2, [n + 1, n + 3, n + 4, n - 2]);
    const m = n + 1;
    return nq(ctx, L(ctx, `Katero liho število sledi številu ${m}?`, `Next odd number after ${m}?`), m + 2, [m + 1, m + 3, m + 4, m - 2]);
  }
  const want = (x) => (x % 2 === 0) === even;
  // napačni imajo pri 3. stopnji »zavajajoče« desetice (41 ni sodo, čeprav je 4 sodo)
  const lure = () => {
    if (t < 3) return R(1, top);
    const lastOk = even ? pick([1, 3, 5, 7, 9]) : pick([0, 2, 4, 6, 8]);
    const other = even ? () => pick([2, 4, 6, 8]) : () => pick([1, 3, 5, 7, 9]);
    return other() * 10 + lastOk;
  };
  let a;
  do a = R(1, top); while (!want(a));
  const ws = distinct(3, () => {
    let x;
    do x = lure(); while (want(x) || x === a);
    return x;
  });
  return choice(even ? L(ctx, "Katero število je sodo?", "Which number is even?") : L(ctx, "Katero število je liho?", "Which number is odd?"), String(a), ws.map(String));
});

def("m_repadd", "ar", 2, "3·4", "Množenje in deljenje: pomen", "Meaning of × and ÷", (t, ctx) => {
  if (t === 1) {
    const k = R(2, 5), n = pick([2, 3, 4, 5, 10]);
    return nq(ctx, `${Array(k).fill(n).join(" + ")} = ? · ${n}`, k, [n, k * n, k + 1, k - 1]);
  }
  if (t === 2) {
    const k = R(2, 5), n = pick([2, 5, 10, 3, 4]);
    if (Math.random() < 0.5) return nq(ctx, `${Array(k).fill(n).join(" + ")} = ?`, k * n, [k + n, (k + 1) * n, (k - 1) * n, k * n + 1]);
    return nq(ctx, `${k} · ${n} = ${Array(k - 1).fill(n).join(" + ")} + ?`, n, [k, k * n, n + 1, (k - 1) * n]);
  }
  const k = R(2, 5), q = R(2, 10), n = k * q;
  if (Math.random() < 0.5) return nq(ctx, L(ctx, `${n} razdelim na ${pl(k, "enak del|enaka dela|enake dele|enakih delov")}. Koliko je en del?`, `Split ${n} into ${k} equal parts. One part?`), q, [n - k, k, q + 1, q - 1, n + k]);
  return nq(ctx, L(ctx, `Koliko skupin po ${q} je v ${n}?`, `How many groups of ${q} in ${n}?`), k, [n - q, q, k + 1, k - 1]);
});

def("m_n1000", "ar", 3, "1000", "Števila do 1000", "Numbers to 1000", (t, ctx) => {
  const k = t === 1 ? R(0, 1) : t === 2 ? R(0, 2) : R(0, 3);
  if (k === 0) {
    let n;
    if (t === 1) n = R(21, 99);
    else if (t === 2) n = 100 * R(1, 9) + R(21, 99);
    else n = 100 * R(1, 9) + pick([R(1, 9), 10 * R(1, 9), R(10, 19), R(21, 99)]);
    if (n % 10 === 0 && n < 100) n += R(1, 9);
    const h = Math.floor(n / 100), r = n % 100;
    return fromWords(ctx, n, [r >= 20 && r % 10 ? swapTU(n) : null, h && r ? Number(`${h * 100}${r}`) : null, h && r && r < 10 ? h * 100 + r * 10 : null, n + 10, n - 10, h ? r * 10 + h : null].filter((x) => x != null));
  }
  if (k === 1) {
    if (t === 1) {
      const n = R(21, 99);
      return neighbour(ctx, n, Math.random() < 0.5);
    }
    const ds = distinct(3, () => R(1, 9));
    const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => 100 * ds[p[0]] + 10 * ds[p[1]] + ds[p[2]]);
    return extreme(ctx, shuffle(perms).slice(0, 4), t === 2 || Math.random() < 0.5);
  }
  if (k === 2) {
    const before = Math.random() < 0.5;
    const n = before ? 100 * R(1, 9) + (t === 3 ? 0 : pick([0, 10 * R(1, 9)])) : 100 * R(1, 8) + (t === 3 ? 99 : pick([99, 10 * R(1, 9) + 9]));
    return neighbour(ctx, n, before);
  }
  const ds = distinct(3, () => R(0, 9)).filter(Boolean);
  if (ds.length < 3) return neighbour(ctx, 100 * R(2, 9), true);
  const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => 100 * ds[p[0]] + 10 * ds[p[1]] + ds[p[2]]);
  return extreme(ctx, shuffle(perms).slice(0, 4), false);
});

def("m_wrt", "ar", 3, "±", "Pisno seštevanje in odštevanje", "Column addition and subtraction", (t, ctx) => {
  const add = (a, b) => nq(ctx, `${a} + ${b} = ?`, a + b, [noCarry(a, b), a + b + 10, a + b - 10, a + b + 100, a + b + 1]);
  const sub = (a, b) => nq(ctx, `${a} ${M} ${b} = ?`, a - b, [swapSub(a, b), a - b + 10, a - b + 100, a - b - 10, a - b + 110]);
  for (let i = 0; i < 50; i++) {
    if (t === 1) {
      const a = R(102, 789), b = R(101, 899 - a);
      if (b > 0 && hasCarry(a, b) && a + b < 1000) return add(a, b);
    } else if (t === 2) {
      const a = R(300, 989), b = R(101, a - 100);
      if (swapSub(a, b) !== a - b) return sub(a, b);
    } else if (Math.random() < 0.5) {
      const a = R(155, 789), b = R(145, 999 - a);
      if (noCarry(a, b) !== a + b && (a % 10) + (b % 10) >= 10 && (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) >= 9 && a + b < 1000) return add(a, b);
    } else {
      const a = 100 * R(3, 9) + pick([0, 10 * R(0, 4) + R(0, 4)]), b = R(105, a - 50);
      if (swapSub(a, b) !== a - b && b > 0) return sub(a, b);
    }
  }
  return add(456, 378);
});

def("m_unknown", "ar", 3, "?·6", "Neznano število pri množenju in deljenju", "Missing number in × and ÷", (t, ctx) => {
  if (t === 1) {
    const b = pick([2, 3, 4, 5, 10]), a = R(2, 10), p = a * b;
    return nq(ctx, Math.random() < 0.5 ? `? · ${b} = ${p}` : `${b} · ? = ${p}`, a, [a + 1, a - 1, p - b, p + b]);
  }
  const a = R(2, 10), b = R(t === 2 ? 2 : 6, 10), p = a * b;
  const k = t === 2 ? R(0, 1) : R(1, 2);
  if (k === 0) return nq(ctx, `${b} · ? = ${p}`, a, [a + 1, a - 1, p - b, p + b]);
  if (k === 1) return nq(ctx, `? : ${b} = ${a}`, p, [a + b, p + b, p - b, b - a > 0 ? b - a : a * (b + 1)]);
  return nq(ctx, `${p} : ? = ${a}`, b, [b + 1, b - 1, p - a, p + a]);
});

def("m_word3", "ar", 3, "a·b", "Besedilne naloge do 1000", "Word problems to 1000", (t, ctx) => {
  if (t === 1) {
    const b = R(5, 10), a = R(2, 5);
    const T = pick([
      [`V škatli je ${b} jajc. Koliko jajc je v ${a} škatlah?`, `A box holds ${b} eggs. How many eggs in ${a} boxes?`],
      [`V vrečki je ${b} bonbonov. Koliko jih je v ${a} vrečkah?`, `A bag has ${b} sweets. How many in ${a} bags?`],
      [`Na polici je ${b} knjig. Koliko knjig je na ${a} policah?`, `A shelf holds ${b} books. How many on ${a} shelves?`],
      [`V vazi je ${b} rož. Koliko rož je v ${a} vazah?`, `A vase has ${b} flowers. How many in ${a} vases?`],
      [`V peresnici je ${b} barvic. Koliko jih je v ${a} peresnicah?`, `A pencil case has ${b} crayons. How many in ${a} cases?`],
    ]);
    return nq(ctx, L(ctx, T[0], T[1]), a * b, [a + b, a * b + b, a * b - b, a * (b + 1)]);
  }
  if (t === 2) {
    const k = R(2, 9), q = R(2, 10), n = k * q;
    if (n < 10) return nq(ctx, L(ctx, `V škatli je 6 jajc. Koliko jajc je v ${k} škatlah?`, `A box holds 6 eggs. How many eggs in ${k} boxes?`), 6 * k, [6 + k, 6 * k + 6, 6 * k - 6]);
    if (Math.random() < 0.5)
      return nq(ctx, L(ctx, `${n} bonbonov razdelim med ${pl(k, "otroka|otroka|otroke|otrok")}. Koliko dobi vsak?`, `Share ${n} sweets among ${k} children. How many each?`), q, [n - k, k, q + 1, q - 1, n + k]);
    return nq(ctx, L(ctx, `${n} jajc dam v škatle po ${k}. Koliko škatel napolnim?`, `I pack ${n} eggs, ${k} per box. How many boxes?`), q, [n - k, k, q + 1, q - 1, n * k]);
  }
  const k = R(0, 2);
  if (k === 0) {
    const n = 10 * R(12, 45), r = 10 * R(3, n / 10 - 2);
    return nq(ctx, L(ctx, `Knjiga ima ${n} strani. Preberem ${r}. Koliko jih še ostane?`, `A book has ${n} pages. I read ${r}. How many pages are left?`), n - r, [n + r, swapSub(n, r), n - r + 10, n - r - 10]);
  }
  if (k === 1) {
    const a = R(120, 600), b = R(25, 300);
    return nq(ctx, L(ctx, `Kolo stane ${a} €, čelada ${b} €. Koliko stane oboje?`, `A bike costs €${a}, a helmet €${b}. Cost of both?`), a + b, [noCarry(a, b), a - b, a + b + 10, a + b - 10], "€");
  }
  const a = R(150, 900), b = R(40, a - 50);
  return nq(ctx, L(ctx, `Do morja je ${a} km. Prevozimo ${b} km. Koliko km še ostane?`, `The sea is ${a} km away. We drive ${b} km. How far is left?`), a - b, [a + b, swapSub(a, b), a - b + 10, a - b - 10], "km");
});

def("m_n10k", "ar", 4, "9999", "Števila do 10 000", "Numbers to 10,000", (t, ctx) => {
  const k = t === 1 ? R(0, 1) : t === 2 ? R(1, 3) : R(2, 4);
  if (k === 0) {
    const th = R(1, 9), r = pick([R(1, 9), R(11, 99), 100 * R(1, 9) + R(1, 99), 100 * R(1, 9)]);
    const n = th * 1000 + r;
    return fromWords(ctx, n, [Number(`${th * 1000}${r}`), r < 100 ? th * 100 + r : th * 1000 + Math.floor(r / 10), r >= 20 && r % 10 ? swapTU(n) : null, r < 100 ? th * 1000 + r * 10 : th * 1000 + Math.floor(r / 10), n + 1000].filter((x) => x != null && x < 100000 && x !== n));
  }
  if (k === 1) {
    const before = Math.random() < 0.5;
    const n = before ? pick([1000 * R(2, 9), 100 * R(11, 99), 1000 * R(1, 9) + 10 * R(1, 9)]) : pick([1000 * R(1, 8) + 999, 100 * R(10, 98) + 99]);
    if (before) return nq(ctx, L(ctx, `Predhodnik števila ${n}?`, `Number just before ${n}?`), n - 1, [n + 1, n - 10, n - 100, n - 11]);
    return nq(ctx, L(ctx, `Naslednik števila ${n}?`, `Number just after ${n}?`), n + 1, [n - 1, n + 11, n + 1 - 1000, n + 101]);
  }
  if (k === 2) {
    const ds = distinct(4, () => R(1, 9));
    const xs = distinct(4, () => Number(shuffle(ds).join("")));
    return extreme(ctx, xs, t === 2 || Math.random() < 0.5);
  }
  if (k === 3) {
    const step = pick([10, 100, 1000]), more = Math.random() < 0.5;
    const n = more ? R(1000, 9999 - step) - (step === 1000 ? 0 : 0) : R(1000 + step, 9999);
    // izberi prehod čez desetico/stotico, kjer je to smiselno
    const base = step === 10 ? n - (n % 100) + pick([90, 95, 97]) : step === 100 ? n - (n % 1000) + pick([900, 950, 920]) : n;
    const x = Math.max(1000, Math.min(9999 - step, base));
    if (more) return nq(ctx, L(ctx, `Za ${step} večje od ${x}?`, `${step} more than ${x}?`), x + step, [x + step / 10, x + step * 10 <= 99999 ? x + step * 10 : x - step, x + step - (step === 10 ? 100 : step === 100 ? 1000 : 0) > 0 ? x + step - (step === 10 ? 100 : step === 100 ? 1000 : 0) : null, x - step].filter((v) => v != null));
    const y = Math.max(1000 + step, x);
    return nq(ctx, L(ctx, `Za ${step} manjše od ${y}?`, `${step} less than ${y}?`), y - step, [y + step, y - step / 10, y - step * 10 >= 0 ? y - step * 10 : y + step * 2]);
  }
  const Q = pick([
    [L(ctx, "Koliko stotic je v 1000?", "How many hundreds make 1000?"), 10, [100, 1000, 1]],
    [L(ctx, "Koliko desetic je v 1000?", "How many tens make 1000?"), 100, [10, 1000, 1]],
    [L(ctx, "Koliko tisočic je v 10 000?", "How many thousands make 10,000?"), 10, [100, 1000, 1]],
    [L(ctx, "Koliko stotic je v 10 000?", "How many hundreds make 10,000?"), 100, [10, 1000, 10000]],
  ]);
  return nq(ctx, Q[0], Q[1], Q[2]);
});

def("m_x10", "ar", 4, "·10", "Množenje in deljenje z 10, 100, 1000", "× and ÷ by 10, 100, 1000", (t, ctx) => {
  if (t === 1) {
    const k = R(0, 2);
    if (k === 0) {
      const n = R(2, 99);
      return nq(ctx, `${n} · 10 = ?`, n * 10, [n * 100, n, n + 10, Number(`${n}01`.slice(0, String(n).length + 1)) === n * 10 ? n * 100 : Number(`${String(n)[0]}0${String(n).slice(1)}`)]);
    }
    if (k === 1) {
      const n = R(2, 99);
      return nq(ctx, `${n} · 100 = ?`, n * 100, [n * 10, n * 1000, n + 100]);
    }
    const n = R(2, 99);
    return nq(ctx, `${n * 10} : 10 = ?`, n, [n * 100, n * 10, n * 10 - 10]);
  }
  if (t === 2) {
    const k = R(0, 3);
    if (k === 0) {
      const n = R(2, 9);
      return nq(ctx, `${n} · 1000 = ?`, n * 1000, [n * 100, n * 10000, n + 1000]);
    }
    if (k === 1) {
      const n = R(2, 99);
      return nq(ctx, `${n * 100} : 100 = ?`, n, [n * 10, n * 1000, n * 100 - 100]);
    }
    if (k === 2) {
      const n = R(2, 99), f = pick([10, 100]);
      return nq(ctx, `? · ${f} = ${G(ctx, n * f)}`, n, [n * f, n * 10 === n * f ? n * 100 : n * 10, n * f * f]);
    }
    const n = R(2, 9);
    return nq(ctx, `${n * 1000} : 1000 = ?`, n, [n * 10, n * 100, n * 1000]);
  }
  const a = R(2, 9), b = R(2, 9);
  const k = R(0, 2);
  if (k === 0) return nq(ctx, `${a * 10} · ${b * 10} = ?`, a * b * 100, [a * b * 10, a * b * 1000, (a + b) * 10]);
  if (k === 1) return nq(ctx, `${a * 10} · ${b} = ?`, a * b * 10, [a * b, a * b * 100, a * 10 + b]);
  return nq(ctx, `${a * b * 100} : ${b * 10} = ?`, a * 10, [a, a * 100, a * b * 10]);
});

// Pisno množenje: napaka »pozabljen prenos«
function forgotCarry(a, b) {
  const x = digits(a);
  let s = "";
  for (let i = 0; i < x.length; i++) {
    const p = x[i] * b;
    s = (i === x.length - 1 ? String(p) : String(p % 10)) + s;
  }
  return Number(s);
}
def("m_mulw", "ar", 4, "×", "Pisno množenje", "Long multiplication", (t, ctx) => {
  for (let i = 0; i < 40; i++) {
    if (t < 3) {
      const a = t === 1 ? R(13, 99) : R(102, 999), b = R(3, 9);
      const p = a * b, fc = forgotCarry(a, b);
      if (fc === p || a % 10 === 0) continue;
      return nq(ctx, `${a} · ${b} = ?`, p, [fc, p + b, p - b, a * (b + 1), p + 10]);
    }
    const a = R(12, 98), b = R(12, 39);
    if (a % 10 === 0 || b % 10 === 0) continue;
    const p = a * b, b1 = Math.floor(b / 10), b0 = b % 10;
    const noShift = a * b0 + a * b1;
    const cross = Number(`${Math.floor(a / 10) * b1}${(a % 10) * b0}`);
    return nq(ctx, `${a} · ${b} = ?`, p, [noShift, cross, p + 10, p - 10, a * b0 * 10 + a * b1].filter((x) => x < 100000));
  }
  return nq(ctx, "47 · 6 = ?", 282, [242, 288, 276]);
});

def("m_n1m", "ar", 5, "10⁶", "Števila do milijona", "Numbers to a million", (t, ctx) => {
  const k = t === 1 ? R(0, 1) : t === 2 ? R(1, 3) : R(2, 4);
  if (k === 0) {
    let n;
    do n = R(11, 999) * 1000 + pick([0, 100 * R(1, 9), R(1, 999)]);
    while (!okWords(n) || words(ctx, n).length > 50 || (n % 1000 === 0 && Math.random() < 0.5));
    const th = Math.floor(n / 1000), r = n % 1000;
    return fromWords(ctx, n, [th % 100 >= 20 && th % 10 ? swapTU(th) * 1000 + r : null, r ? th * 1000 + Math.floor(r / 10) : th * 100, th * 10000 + r < 1000000 ? th * 10000 + r : null, r && r < 100 ? th * 1000 + r * 10 : n + 10000, n + 1000].filter((x) => x != null && x !== n));
  }
  if (k === 1) {
    const Q = pick([
      [L(ctx, "1 milijon = ? tisoč", "1 million = ? thousand"), 1000, [100, 10000, 1000000]],
      [L(ctx, "Koliko ničel ima milijon?", "How many zeros in a million?"), 6, [5, 7, 3]],
      [`1${G(ctx, 1000000).slice(1)} = ? · ${G(ctx, 100000)}`, 10, [100, 1000, 1]],
      [`1${G(ctx, 1000000).slice(1)} = ? · ${G(ctx, 10000)}`, 100, [10, 1000, 10000]],
      [L(ctx, "Koliko tisočic je v 100 000?", "How many thousands make 100,000?"), 100, [10, 1000, 10000]],
    ]);
    return nq(ctx, Q[0], Q[1], Q[2]);
  }
  if (k === 2) {
    const before = Math.random() < 0.5;
    const n = before ? pick([100000, 1000000, 10000 * R(2, 99), 1000 * R(11, 999)]) : pick([99999, 10000 * R(2, 98) + 9999, 1000 * R(11, 998) + 999]);
    const f = (x) => G(ctx, x);
    if (before) return choice(L(ctx, `Predhodnik števila ${f(n)}?`, `Number just before ${f(n)}?`), f(n - 1), [f(n + 1), f(n - 10), f(n - 1000), f(Math.floor((n - 1) / 10))]);
    return choice(L(ctx, `Naslednik števila ${f(n)}?`, `Number just after ${f(n)}?`), f(n + 1), [f(n - 1), f(n + 10), f(n + 1001), f(n + 1 - 1000)]);
  }
  if (k === 3) {
    let n;
    do n = R(10000, 999999); while (n % 1000 === 500 || Math.round(n / 1000) * 1000 >= 1000000);
    const r = Math.round(n / 1000) * 1000, down = Math.floor(n / 1000) * 1000;
    return nq(ctx, L(ctx, `Zaokroži na tisočice: ${G(ctx, n)}`, `Round to the nearest thousand: ${G(ctx, n)}`), r, [down === r ? down + 1000 : down, Math.round(n / 100) * 100 === r ? r + 100 : Math.round(n / 100) * 100, Math.round(n / 10000) * 10000 === r ? r + 10000 : Math.round(n / 10000) * 10000], "", 1000);
  }
  const ds = distinct(6, () => R(1, 9));
  const xs = distinct(4, () => Number(shuffle(ds).join("")));
  return extreme(ctx, xs, Math.random() < 0.5);
});

def("m_divw", "ar", 5, "÷", "Pisno deljenje", "Long division", (t, ctx) => {
  const dropZeros = (q) => Number(String(q).replace(/0/g, "")) || q + 1;
  for (let i = 0; i < 60; i++) {
    const d = R(2, 9);
    let q;
    if (t === 1) q = R(11, 99);
    else if (t === 2) q = Math.random() < 0.6 ? 100 * R(1, 9) + R(1, 9) : R(101, 999); // pogosto ničla v sredini količnika
    else q = Math.random() < 0.6 ? pick([1000 * R(1, 9) + R(1, 99), 100 * R(10, 99) + R(0, 9) * 10 * 0 + R(1, 9), 100 * R(1, 9) + 10 * R(1, 9)]) : R(101, 2000);
    const n = q * d;
    if (n >= 10000 || (t === 1 && n > 999)) continue;
    const ws = [String(q).includes("0") ? dropZeros(q) : null, q * 10, q + 10, q + 1, q - 1, Math.floor(q / 10)].filter((x) => x != null && x !== q && x > 0);
    return nq(ctx, `${n} : ${d} = ?`, q, ws);
  }
  return nq(ctx, "624 : 3 = ?", 208, [28, 280, 218]);
});

def("m_word5", "ar", 5, "1+2", "Sestavljene besedilne naloge", "Two-step word problems", (t, ctx) => {
  const ZV = "zvezek|zvezka|zvezke|zvezkov";
  if (t === 1) {
    const k = R(2, 6), p = R(2, 5), q = R(1, 4);
    return nq(ctx, L(ctx, `Kupim ${pl(k, ZV)} po ${p} € in pero za ${q} €. Koliko plačam?`, `I buy ${k} notebooks at €${p} and a pen for €${q}. Total?`), k * p + q, [p + q, k * (p + q), k * p, k + p + q], "€");
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const k = R(2, 6), p = R(2, 8), N = pick([10, 20, 50].filter((x) => x > k * p));
      return nq(ctx, L(ctx, `Kupim ${pl(k, ZV)} po ${p} €. Plačam ${zs(N)} ${N} €. Koliko mi vrnejo?`, `I buy ${k} notebooks at €${p} and pay €${N}. Change?`), N - k * p, [k * p, N - p, N - k - p, N - k * p + 1], "€");
    }
    let a, b, c;
    do {
      a = R(20, 60);
      b = R(5, 19);
      c = R(5, 19);
    } while (smallTail(a) || smallTail(b) || smallTail(c) || b >= a);
    return nq(ctx, L(ctx, `Avtobus: ${a} ljudi. Izstopi ${b}, vstopi ${c}. Zdaj jih je?`, `Bus: ${a} people. ${b} get off, ${c} get on. How many now?`), a - b + c, [a + b + c, a - b - c, a + b - c, a - b + c + 1]);
  }
  if (Math.random() < 0.5) {
    const a = R(2, 9), b = R(2, 6);
    return nq(ctx, L(ctx, `Kmet ima ${pl(a, "kokoš|kokoši|kokoši|kokoši")} in ${pl(b, "kravo|kravi|krave|krav")}. Koliko nog imajo skupaj?`, `A farmer has ${a} hens and ${b} cows. How many legs in all?`), 2 * a + 4 * b, [a + b, 4 * a + 2 * b, 2 * (a + b), 4 * (a + b)]);
  }
  const k = R(2, 4), p = R(6, 15), M0 = pick([50, 100].filter((x) => x > k * p));
  return nq(ctx, L(ctx, `Imam ${M0} €. Kupim ${pl(k, "knjigo|knjigi|knjige|knjig")} po ${p} €. Koliko mi ostane?`, `I have €${M0}. I buy ${k} books at €${p} each. What is left?`), M0 - k * p, [M0 - p, k * p, M0 - k - p, M0 - k * p + 10], "€");
});

// =====================================================================
// ULOMKI (fr)
// =====================================================================
const F = (n, d) => `${n}/${d}`;

def("m_half", "fr", 2, "½", "Polovica in četrtina", "Halves and quarters", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.15) return nq(ctx, L(ctx, "Koliko polovic je celota?", "How many halves make a whole?"), 2, [4, 1, 3]);
    const n = 2 * R(1, 15);
    return nq(ctx, L(ctx, `Polovica od ${n} = ?`, `Half of ${n} = ?`), n / 2, [n, 2 * n, n / 2 + 1, n - 2, n / 2 - 1]);
  }
  if (t === 2) {
    const r = Math.random();
    if (r < 0.15) return nq(ctx, L(ctx, "Koliko četrtin je celota?", "How many quarters make a whole?"), 4, [2, 1, 3, 8]);
    if (r < 0.3) return nq(ctx, L(ctx, "Koliko četrtin je polovica?", "How many quarters make a half?"), 2, [4, 1, 3]);
    const n = 4 * R(1, 10);
    return nq(ctx, L(ctx, `Četrtina od ${n} = ?`, `A quarter of ${n} = ?`), n / 4, [n / 2, n - 4, n / 4 + 1, 4 * n, n / 4 - 1]);
  }
  const r = Math.random();
  if (r < 0.2) return Math.random() < 0.5 ? nq(ctx, L(ctx, "Pol ure = ? min", "Half an hour = ? min"), 30, [50, 20, 15, 60]) : nq(ctx, L(ctx, "Četrt ure = ? min", "A quarter of an hour = ? min"), 15, [25, 30, 4, 45]);
  if (r < 0.6) {
    const n = 2 * R(11, 50);
    return nq(ctx, L(ctx, `Polovica od ${n} = ?`, `Half of ${n} = ?`), n / 2, [2 * n, n - 2, n / 2 + 1, n / 2 + 10]);
  }
  const n = 4 * R(6, 25);
  return nq(ctx, L(ctx, `Četrtina od ${n} = ?`, `A quarter of ${n} = ?`), n / 4, [n / 2, n - 4, n / 4 + 1, n / 4 + 10]);
});

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const KOS = "enak kos|enaka kosa|enake kose|enakih kosov";
def("m_frac_name", "fr", 3, "¼", "Ulomek kot del celote", "Fractions as parts of a whole", (t, ctx) => {
  const whole = pick([
    ["Torta", "A cake"],
    ["Pica", "A pizza"],
    ["Čokolada", "A chocolate bar"],
    ["Pita", "A pie"],
  ]);
  if (t === 1) {
    if (Math.random() < 0.2) {
      const d = R(2, 10), nm = ["", "", "polovic", "tretjin", "četrtin", "petin", "šestin", "sedmin", "osmin", "devetin", "desetin"][d];
      const en = ["", "", "halves", "thirds", "quarters", "fifths", "sixths", "sevenths", "eighths", "ninths", "tenths"][d];
      return nq(ctx, L(ctx, `Koliko ${nm} je celota?`, `How many ${en} make a whole?`), d, [d + 1, d - 1, 1, 2 * d]);
    }
    const d = R(2, 10);
    return choice(L(ctx, `${whole[0]} ima ${pl(d, KOS)}. Kolikšen del je en kos?`, `${whole[1]} has ${d} equal pieces. One piece is?`), F(1, d), [String(d), F(1, d + 1), F(d, 1), F(1, d - 1 > 1 ? d - 1 : d + 2)]);
  }
  let d, m;
  do {
    d = R(3, 10);
    m = R(1, d - 1);
  } while (gcd(m, d) !== 1 || 2 * m === d);
  if (t === 2) {
    if (Math.random() < 0.5) return choice(L(ctx, `${whole[0]} ima ${pl(d, KOS)}. Pojem ${m}. Kolikšen del pojem?`, `${whole[1]}: ${d} equal pieces. I eat ${m}. Part eaten?`), F(m, d), [F(d - m, d), F(d, m), F(m, d - m), F(m + 1, d)]);
    return choice(L(ctx, `Pobarvam ${m} od ${d} enakih delov. Kolikšen del je pobarvan?`, `I colour ${m} of ${d} equal parts. What part is coloured?`), F(m, d), [F(d - m, d), F(d, m), F(m, d - m), F(m, d + 1)]);
  }
  if (Math.random() < 0.6) return choice(L(ctx, `${whole[0]} ima ${pl(d, KOS)}. Pojem ${m}. Kolikšen del ostane?`, `${whole[1]}: ${d} equal pieces. I eat ${m}. Part left?`), F(d - m, d), [F(m, d), F(d, d - m), F(d - m, m), F(d - m - 1 > 0 ? d - m - 1 : d - m + 1, d)]);
  return choice(L(ctx, `Pobarvam ${m} od ${d} enakih delov. Kolikšen del ni pobarvan?`, `I colour ${m} of ${d} equal parts. What part is not coloured?`), F(d - m, d), [F(m, d), F(d, d - m), F(d - m, m), F(m, d - m)]);
});

def("m_frac_of", "fr", 4, "⅓·", "Ulomek od količine", "Fraction of an amount", (t, ctx) => {
  if (t === 1) {
    const d = R(2, 10), q = R(2, 10), n = d * q;
    return nq(ctx, L(ctx, `${F(1, d)} od ${n} = ?`, `${F(1, d)} of ${n} = ?`), q, [n * d, n - d, d, q + 1]);
  }
  if (t === 2) {
    let d, m;
    do {
      d = R(3, 10);
      m = R(2, d - 1);
    } while (gcd(m, d) !== 1);
    const q = R(2, 10), n = d * q;
    return nq(ctx, L(ctx, `${F(m, d)} od ${n} = ?`, `${F(m, d)} of ${n} = ?`), m * q, [q, n - m, (m + 1) * q, n * m, n - q === m * q ? n + q : n - q]);
  }
  const r = Math.random();
  if (r < 0.3) {
    const d = R(2, 10), q = R(2, 12);
    return nq(ctx, L(ctx, `${F(1, d)} od ? = ${q}`, `${F(1, d)} of ? = ${q}`), d * q, [q, d + q, q - d > 0 ? q - d : d * q + d, d * q + q]);
  }
  const [m, d, big, small, f] = pick([
    [1, 2, "h", "min", 60], [1, 4, "h", "min", 60], [3, 4, "h", "min", 60], [1, 3, "h", "min", 60], [2, 3, "h", "min", 60], [1, 6, "h", "min", 60], [5, 6, "h", "min", 60],
    [1, 2, "kg", "dag", 100], [1, 4, "kg", "dag", 100], [3, 4, "kg", "dag", 100], [1, 5, "kg", "dag", 100], [2, 5, "kg", "dag", 100],
    [1, 2, "m", "cm", 100], [3, 4, "m", "cm", 100], [1, 5, "m", "cm", 100], [3, 10, "m", "cm", 100],
    [1, 2, "L", "dL", 10], [1, 5, "L", "dL", 10], [3, 5, "L", "dL", 10], [7, 10, "L", "dL", 10],
    [1, 2, "€", "c", 100], [1, 4, "€", "c", 100], [3, 4, "€", "c", 100], [1, 5, "€", "c", 100], [1, 10, "€", "c", 100],
  ]);
  const v = (m * f) / d;
  const wsRaw = [f / d, m * 10, (m * 100) / d, m * f, f - v];
  const one = big === "€" ? "€1" : `1 ${big}`, sm = small === "c" ? "cents" : small;
  return nq(ctx, L(ctx, `${F(m, d)} od 1 ${big} = ? ${small}`, `${F(m, d)} of ${one} = ? ${sm}`), v, wsRaw.filter((x) => Number.isInteger(x) && x !== v));
});

def("m_frac_cmp", "fr", 5, "⅓<½", "Primerjanje ulomkov", "Comparing simple fractions", (t, ctx) => {
  const big = Math.random() < 0.6;
  const Q = big ? L(ctx, "Kateri ulomek je največji?", "Which fraction is largest?") : L(ctx, "Kateri ulomek je najmanjši?", "Which fraction is smallest?");
  let fs;
  if (t === 1) {
    const d = R(5, 12);
    fs = distinct(4, () => R(1, d - 1)).map((n) => [n, d]);
  } else if (t === 2) {
    fs = distinct(4, () => R(2, 12)).map((d) => [1, d]);
  } else {
    if (Math.random() < 0.3) {
      const d = R(3, 9);
      return choice(L(ctx, "Kateri ulomek je enak 1?", "Which fraction equals 1?"), F(d, d), [F(1, d), F(d - 1, d), F(d, d + 1), F(d + 1, d)]);
    }
    const n = R(2, 5);
    fs = distinct(4, () => R(n + 1, 12)).map((d) => [n, d]);
  }
  const best = fs.reduce((x, y) => ((big ? y[0] / y[1] > x[0] / x[1] : y[0] / y[1] < x[0] / x[1]) ? y : x));
  return choice(Q, F(...best), fs.filter((f) => f !== best).map((f) => F(...f)));
});

def("m_dec_intro", "fr", 5, "0,1", "Desetinke in stotinke", "Tenths and hundredths", (t, ctx) => {
  const n = ctx.num;
  const dec = n(1.5).includes(",") ? "," : ".";
  if (t === 1) {
    const a = R(1, 9);
    if (Math.random() < 0.5) return choice(`${F(a, 10)} = ?`, n(a / 10), [n(a / 100), `${a}${dec}10`, String(a), `10${dec}${a}`]);
    return nq(ctx, `${n(a / 10)} = ?/10`, a, [a * 10, 1, 10 - a]);
  }
  if (t === 2) {
    let a;
    do a = R(11, 99); while (a % 10 === 0);
    if (Math.random() < 0.5) return choice(`${F(a, 100)} = ?`, n(a / 100), [n(a / 10), n(a / 1000), `${a}${dec}100`, String(a)]);
    if (Math.random() < 0.5) return nq(ctx, `${n(a / 100)} = ?/100`, a, [a * 10, Math.floor(a / 10), a / 10 === Math.floor(a / 10) ? a + 1 : a % 10]);
    const w = R(1, 9), d = R(1, 9);
    return choice(`${w} + ${F(d, 10)} = ?`, n(w + d / 10), [`${w}${dec}${d}0`.replace(new RegExp(`\\${dec}(\\d)0$`), `${dec}0$1`), n(w + d), n((w + d) / 10), `${d}${dec}${w}`]);
  }
  // največje/najmanjše: napaka »daljše je večje« (0,45 > 0,5)
  const big = Math.random() < 0.6;
  for (let i = 0; i < 50; i++) {
    const d1 = R(1, 8);
    const pool = [d1 / 10, (d1 + 1) / 10, d1 / 10 + R(1, 9) / 100, d1 / 10 + R(1, 9) / 100, (d1 + 1) / 10 + R(1, 9) / 100, R(1, 9) / 100, d1 / 100];
    const xs = [...new Set(shuffle(pool).map((x) => Math.round(x * 100) / 100))].slice(0, 4);
    if (xs.length < 4) continue;
    const best = big ? Math.max(...xs) : Math.min(...xs);
    return choice(big ? L(ctx, "Katero število je največje?", "Which number is largest?") : L(ctx, "Katero število je najmanjše?", "Which number is smallest?"), n(best), xs.filter((x) => x !== best).map(n));
  }
  return choice(L(ctx, "Katero število je največje?", "Which number is largest?"), n(0.5), [n(0.45), n(0.05), n(0.39)]);
});

// =====================================================================
// GEOMETRIJA (ge)
// =====================================================================
// [sl ime, en ime, vogali/stranice, sl množina (2|3–4) za »imata/imajo«, en množina]
const SHAPES = [
  ["trikotnik", "triangle", 3, "trikotnika|trikotniki", "triangles", "△"],
  ["kvadrat", "square", 4, "kvadrata|kvadrati", "squares", "□"],
  ["pravokotnik", "rectangle", 4, "pravokotnika|pravokotniki", "rectangles", "▭"],
  ["petkotnik", "pentagon", 5, "petkotnika|petkotniki", "pentagons", ""],
  ["šestkotnik", "hexagon", 6, "šestkotnika|šestkotniki", "hexagons", ""],
];
def("m_shapes", "ge", 1, "△", "Liki", "2D shapes", (t, ctx) => {
  const basic = SHAPES.slice(0, 3);
  const NAMES = ["krog", "trikotnik", "kvadrat", "pravokotnik"], NAMES_EN = ["circle", "triangle", "square", "rectangle"];
  const nm = (i) => L(ctx, NAMES[i], NAMES_EN[i]);
  const ask = (s, side) => (side ? L(ctx, `Koliko stranic ima ${s[0]}?`, `How many sides does a ${s[1]} have?`) : L(ctx, `Koliko vogalov ima ${s[0]}?`, `How many corners does a ${s[1]} have?`));
  if (t === 1) {
    const k = R(0, 9);
    if (k < 5) {
      const s = pick(basic);
      return nq(ctx, ask(s, Math.random() < 0.5), s[2], [s[2] + 1, s[2] - 1, s[2] === 3 ? 4 : 3, 0]);
    }
    if (k === 5) return nq(ctx, L(ctx, "Koliko vogalov ima krog?", "How many corners does a circle have?"), 0, [1, 2, 4]);
    if (k < 8) {
      const i = R(0, 3), sym = ["○", "△", "□", "▭"][i];
      // kvadrat je tudi pravokotnik: ob □ pravokotnik ni med napačnimi
      const ws = [0, 1, 2, 3].filter((j) => j !== i && !(i === 2 && j === 3)).map(nm);
      if (i === 2) ws.push(L(ctx, "petkotnik", "pentagon"));
      return choice(L(ctx, `Kako se imenuje lik ${sym}?`, `What is this shape: ${sym}?`), nm(i), ws);
    }
    const P = pick([
      [L(ctx, "Kateri lik nima vogalov?", "Which shape has no corners?"), 0, [1, 2, 3]],
      [L(ctx, "Kateri lik ima 3 vogale?", "Which shape has 3 corners?"), 1, [0, 2, 3]],
      [L(ctx, "Kateri lik ima 3 stranice?", "Which shape has 3 sides?"), 1, [0, 2, 3]],
      [L(ctx, "Kateri lik je okrogel?", "Which shape is round?"), 0, [1, 2, 3]],
      [L(ctx, "Kateri lik ima 4 enako dolge stranice?", "Which shape has 4 equal sides?"), 2, [0, 1]],
    ]);
    const ws = P[2].map(nm);
    if (P[1] === 2) ws.push(L(ctx, "petkotnik", "pentagon"));
    return choice(P[0], nm(P[1]), ws);
  }
  if (t === 2) {
    if (Math.random() < 0.25) {
      const P = pick([
        [L(ctx, "Kateri lik ima 4 enako dolge stranice?", "Which shape has 4 equal sides?"), "kvadrat", "square", ["trikotnik", "krog", "petkotnik"], ["triangle", "circle", "pentagon"]],
        [L(ctx, "Kateri lik ima 5 vogalov?", "Which shape has 5 corners?"), "petkotnik", "pentagon", ["trikotnik", "kvadrat", "šestkotnik"], ["triangle", "square", "hexagon"]],
        [L(ctx, "Kateri lik nima ravnih stranic?", "Which shape has no straight sides?"), "krog", "circle", ["trikotnik", "kvadrat", "pravokotnik"], ["triangle", "square", "rectangle"]],
      ]);
      return choice(P[0], L(ctx, P[1], P[2]), ctx.lang === "sl" ? P[3] : P[4]);
    }
    const s = pick(basic), k = R(2, 4);
    const [f2, f34] = s[3].split("|");
    const q = L(ctx, `Koliko vogalov ${k === 2 ? "imata" : "imajo"} ${k} ${k === 2 ? f2 : f34}?`, `How many corners do ${k} ${s[4]} have?`);
    return nq(ctx, q, k * s[2], [k + s[2], (k - 1) * s[2], k * s[2] + 1, k * s[2] - 1]);
  }
  if (Math.random() < 0.5) {
    const s = pick(SHAPES.slice(3));
    return nq(ctx, ask(s, Math.random() < 0.5), s[2], [s[2] + 1, s[2] - 1, s[2] === 5 ? 4 : 8]);
  }
  const [a, b] = shuffle(SHAPES).slice(0, 2);
  return nq(ctx, L(ctx, `${a[0][0].toUpperCase() + a[0].slice(1)} in ${b[0]}: koliko vogalov skupaj?`, `A ${a[1]} and a ${b[1]}: how many corners in all?`), a[2] + b[2], [a[2] * b[2], a[2] + b[2] + 1, a[2] + b[2] - 1, Math.max(a[2], b[2])]);
});

const SOLID = { kocka: "cube", kvader: "cuboid", krogla: "sphere", valj: "cylinder", stožec: "cone", piramida: "pyramid" };
const SOLID_NAMES = Object.keys(SOLID);
def("m_solids", "ge", 2, "3D", "Telesa", "3D solids", (t, ctx) => {
  const nm = (s) => L(ctx, s, SOLID[s]);
  // kocka je tudi kvader: ob kocki kvader ni med napačnimi
  const others = (s, n = 3) => shuffle(SOLID_NAMES.filter((x) => x !== s && !(s === "kocka" && x === "kvader"))).slice(0, n).map(nm);
  if (t === 1) {
    const [o, oen, s] = pick([
      ["Žoga", "A ball", "krogla"], ["Pomaranča", "An orange", "krogla"], ["Frnikola", "A marble", "krogla"], ["Globus", "A globe", "krogla"],
      ["Pločevinka", "A tin can", "valj"], ["Sveča", "A candle", "valj"], ["Hlod", "A log", "valj"],
      ["Škatla za čevlje", "A shoe box", "kvader"], ["Opeka", "A brick", "kvader"], ["Omara", "A wardrobe", "kvader"],
      ["Kornet za sladoled", "An ice-cream cone", "stožec"], ["Čarovniški klobuk", "A witch's hat", "stožec"],
      ["Igralna kocka", "A dice", "kocka"],
    ]);
    if (s === "kocka" && ctx.lang === "sl") return choice("Ploskve kocke so?", "enaki kvadrati", ["krogi", "trikotniki", "različni liki"]);
    return choice(L(ctx, `${o}: katero telo?`, `${oen}: which solid?`), nm(s), others(s));
  }
  if (t === 2) {
    const P = pick([
      ["kocka", "oglišč", "vertices", 8, [6, 12, 4]], ["kocka", "robov", "edges", 12, [8, 6, 10]], ["kocka", "ploskev", "faces", 6, [4, 8, 12]],
      ["kvader", "oglišč", "vertices", 8, [6, 12, 4]], ["kvader", "robov", "edges", 12, [8, 6, 4]], ["kvader", "ploskev", "faces", 6, [4, 8, 12]],
      ["krogla", "oglišč", "vertices", 0, [1, 2, 8]], ["valj", "oglišč", "vertices", 0, [2, 4, 8]],
    ]);
    if (Math.random() < 0.3) {
      return pick([
        () => choice(L(ctx, "Katero telo se kotali v vse smeri?", "Which solid rolls in every direction?"), nm("krogla"), others("krogla")),
        () => choice(L(ctx, "Kotali se in ima 2 ravni ploskvi?", "It rolls and has 2 flat faces?"), nm("valj"), [nm("krogla"), nm("kocka"), nm("kvader")]),
        () => choice(L(ctx, "Katero telo nima ravnih ploskev?", "Which solid has no flat faces?"), nm("krogla"), [nm("valj"), nm("kocka"), nm("stožec")]),
        () => nq(ctx, L(ctx, "Koliko robov se stika v oglišču kocke?", "How many edges meet at a corner of a cube?"), 3, [4, 2, 6]),
      ])();
    }
    return nq(ctx, L(ctx, `Koliko ${P[1]} ima ${P[0]}?`, `How many ${P[2]} does a ${SOLID[P[0]]} have?`), P[3], P[4]);
  }
  if (Math.random() < 0.5) {
    return pick([
      () => nq(ctx, L(ctx, "Koliko ravnih ploskev ima valj?", "How many flat faces does a cylinder have?"), 2, [1, 0, 3]),
      () => nq(ctx, L(ctx, "Koliko ravnih ploskev ima stožec?", "How many flat faces does a cone have?"), 1, [2, 0, 3]),
      () => nq(ctx, L(ctx, "Koliko ravnih ploskev ima krogla?", "How many flat faces does a sphere have?"), 0, [1, 2, 6]),
      () => choice(L(ctx, "Katero telo ima 6 enakih kvadratnih ploskev?", "Which solid has 6 equal square faces?"), nm("kocka"), [nm("stožec"), nm("valj"), nm("piramida")]),
      () => choice(L(ctx, "Katero telo ima 1 ravno ploskev in vrh?", "Which solid has 1 flat face and a tip?"), nm("stožec"), [nm("valj"), nm("krogla"), nm("kocka")]),
      () => choice(L(ctx, "Katero telo ima 2 ravni ploskvi?", "Which solid has 2 flat faces?"), nm("valj"), [nm("stožec"), nm("krogla"), nm("kocka")]),
    ])();
  }
  const k = R(2, 4), P = pick([["oglišč", "vertices", 8], ["robov", "edges", 12], ["ploskev", "faces", 6]]);
  return nq(ctx, L(ctx, `${k === 2 ? "2 kocki" : `${k} kocke`}: koliko ${P[0]} skupaj?`, `${k} cubes: how many ${P[1]} in all?`), k * P[2], [k + P[2], P[2], (k - 1) * P[2], k * P[2] + k]);
});

const LINES = [
  [1, "Ravna črta brez začetka in konca?|premica|daljica|poltrak|lok", "A straight line with no ends?|line|segment|ray|arc"],
  [1, "Del premice med dvema točkama?|daljica|poltrak|premica|krožnica", "Part of a line between two points?|segment|ray|line|circle"],
  [1, "Ravna črta z začetkom, a brez konca?|poltrak|premica|daljica|lok", "Straight, with a start but no end?|ray|line|segment|arc"],
  [1, "Koliko krajišč ima daljica?|2|1|0|3", "How many endpoints does a segment have?|2|1|0|3"],
  [1, "Koliko krajišč ima premica?|0|1|2|4", "How many endpoints does a line have?|0|1|2|4"],
  [1, "Kako označimo točko?|z veliko črko|z malo črko|s številko|z barvo", "How do we label a point?|capital letter|small letter|a number|a colour"],
  [1, "Kako označimo premico?|z malo črko|z veliko črko|s številko|z barvo", "How do we label a line?|small letter|capital letter|a number|a colour"],
  [1, "S čim narišemo ravno črto?|z ravnilom|s šestilom|s tehtnico|z uro", "What do we draw a straight line with?|a ruler|compasses|scales|a clock"],
  [2, "S čim narišemo krožnico?|s šestilom|z ravnilom|s tehtnico|z uro", "What do we draw a circle with?|compasses|a ruler|scales|a clock"],
  [1, "Krajišči daljice AB sta?|A in B|samo A|A in C|samo B", "The endpoints of segment AB are?|A and B|only A|A and C|only B"],
  [1, "Črta, ki ni ravna, je?|kriva črta|premica|daljica|poltrak", "A line that is not straight is?|a curve|a line|a segment|a ray"],
  [1, "Koliko premic gre skozi dve točki?|1|2|0|3", "How many lines pass through two points?|1|2|0|3"],
  [1, "Česa ne moremo izmeriti z ravnilom?|premice|daljice|stranice|roba kocke", "Which can we not measure with a ruler?|a line|a segment|a side|a cube edge"],
  [2, "Koliko premic gre skozi eno točko?|neskončno|1|2|0", "How many lines pass through one point?|infinitely many|1|2|0"],
  [2, "Koliko daljic določajo 3 točke, ki niso na isti premici?|3|2|6|9", "How many segments join 3 points not in a line?|3|2|6|9"],
  [2, "Koliko daljic določajo 4 točke (nobene 3 na premici)?|6|4|8|12", "Segments joining 4 points (no 3 in a line)?|6|4|8|12"],
  [2, "Koliko stranic ima lik, omejen s 3 daljicami?|3|4|6|2", "A shape bounded by 3 segments has how many sides?|3|4|6|2"],
  [2, "Točka, ki leži na dveh premicah hkrati, je?|presečišče|krajišče|središče|oglišče kocke", "A point on two lines at once is their?|intersection|endpoint|centre|cube vertex"],
  [2, "Kaj lahko izmerimo z ravnilom?|daljico|premico|poltrak|vse tri", "What can we measure with a ruler?|a segment|a line|a ray|all three"],
];
const LINES_BANK = bank(LINES);
def("m_lines", "ge", 3, "•—•", "Točke, črte, daljice", "Points, lines and segments", (t, ctx) => {
  if (t === 1) return LINES_BANK(1, ctx);
  if (t === 2 && Math.random() < 0.5) return LINES_BANK(2, ctx);
  if (t === 2) {
    const a = R(2, 12), b = R(2, 12);
    return nq(ctx, L(ctx, `B je na daljici AC. |AB| = ${a} cm, |BC| = ${b} cm. |AC| = ?`, `B lies on segment AC. AB = ${a} cm, BC = ${b} cm. AC = ?`), a + b, [Math.abs(a - b) || a + b + 2, 2 * (a + b), a + b + 1, a + b - 1], "cm");
  }
  const k = R(0, 2);
  if (k === 0) {
    const a = 2 * R(2, 12);
    return nq(ctx, L(ctx, `|AB| = ${a} cm, M je na sredini AB. |AM| = ?`, `AB = ${a} cm, M is its midpoint. AM = ?`), a / 2, [a, 2 * a, a / 2 + 1], "cm");
  }
  if (k === 1) {
    const c = R(2, 9), m = R(1, 9);
    return nq(ctx, `${c} cm ${m} mm = ? mm`, 10 * c + m, [c + m, 100 * c + m, 10 * c + m + 10, Number(`${c}0${m}`)]);
  }
  const ac = R(10, 20), ab = R(2, ac - 2);
  return nq(ctx, L(ctx, `B je na daljici AC. |AC| = ${ac} cm, |AB| = ${ab} cm. |BC| = ?`, `B lies on AC. AC = ${ac} cm, AB = ${ab} cm. BC = ?`), ac - ab, [ac + ab, ab, ac - ab + 1], "cm");
});

// 4. razred: pravi kot, vzporednost, pravokotnost. Brez stopinj ter ostrih in topih kotov (to je 6. razred).
const ANGLE = [
  [1, "Koliko pravih kotov ima kvadrat?|4|2|1|0", "How many right angles does a square have?|4|2|1|0"],
  [1, "Koliko pravih kotov ima pravokotnik?|4|2|1|3", "How many right angles does a rectangle have?|4|2|1|3"],
  [1, "Ob kateri uri kazalca oklepata pravi kot?|3:00|6:00|12:00|5:00", "At what time do the hands make a right angle?|3:00|6:00|12:00|5:00"],
  [1, "Ob kateri uri kazalca oklepata pravi kot?|9:00|6:00|12:00|1:00", "At what time do the hands make a right angle?|9:00|6:00|12:00|1:00"],
  [1, "Premici, ki se sekata pod pravim kotom, sta?|pravokotni|vzporedni|poševni|enako dolgi", "Lines meeting at a right angle are?|perpendicular|parallel|oblique|equal in length"],
  [1, "Premici v ravnini, ki se ne sekata, sta?|vzporedni|pravokotni|poševni|enako dolgi", "Lines in a plane that never meet are?|parallel|perpendicular|oblique|equal in length"],
  [1, "Znak za »je pravokotna na«?|⊥|∥|=|<", "Symbol for »is perpendicular to«?|⊥|∥|=|<"],
  [1, "Znak za »je vzporedna z«?|∥|⊥|=|<", "Symbol for »is parallel to«?|∥|⊥|=|<"],
  [1, "S čim narišemo pravi kot?|z geotrikotnikom|s šestilom|s tehtnico|z uro", "What do we draw a right angle with?|a set square|compasses|scales|a clock"],
  [1, "Sosednji stranici kvadrata sta?|pravokotni|vzporedni|poševni|različno dolgi", "Neighbouring sides of a square are?|perpendicular|parallel|oblique|different lengths"],
  [1, "Nasprotni stranici pravokotnika sta?|vzporedni|pravokotni|poševni|različno dolgi", "Opposite sides of a rectangle are?|parallel|perpendicular|oblique|different lengths"],
  [1, "Katera črka ima pravi kot?|L|O|S|V", "Which letter has a right angle?|L|O|S|V"],
  [1, "Katera črka ima pravi kot?|T|C|O|A", "Which letter has a right angle?|T|C|O|A"],
  [1, "Koliko pravih kotov ima ena ploskev kocke?|4|2|6|8", "How many right angles on one face of a cube?|4|2|6|8"],
  [2, "Največ koliko pravih kotov ima trikotnik?|1|2|3|0", "At most how many right angles in a triangle?|1|2|3|0"],
  [2, "p ⊥ q in q ⊥ r. Kakšni sta p in r?|vzporedni|pravokotni|poševni|enako dolgi", "p ⊥ q and q ⊥ r. Then p and r are?|parallel|perpendicular|oblique|equal in length"],
  [2, "p ∥ q in q ⊥ r. Kakšni sta p in r?|pravokotni|vzporedni|poševni|enako dolgi", "p ∥ q and q ⊥ r. Then p and r are?|perpendicular|parallel|oblique|equal in length"],
  [2, "p ∥ q in q ∥ r. Kakšni sta p in r?|vzporedni|pravokotni|poševni|enako dolgi", "p ∥ q and q ∥ r. Then p and r are?|parallel|perpendicular|oblique|equal in length"],
  [2, "V kolikšnem času se veliki kazalec zavrti za pravi kot?|15 min|90 min|30 min|60 min", "How long does the minute hand take to turn a right angle?|15 min|90 min|30 min|60 min"],
  [2, "Pravokotni premici: koliko pravih kotov nastane?|4|1|2|3", "Two perpendicular lines: how many right angles?|4|1|2|3"],
  [2, "Koliko parov vzporednih stranic ima pravokotnik?|2|4|1|0", "Pairs of parallel sides in a rectangle?|2|4|1|0"],
  [2, "Koliko parov vzporednih stranic ima kvadrat?|2|4|1|0", "Pairs of parallel sides in a square?|2|4|1|0"],
  [2, "Koliko parov vzporednih stranic ima trikotnik?|0|1|2|3", "Pairs of parallel sides in a triangle?|0|1|2|3"],
  [2, "Kateri lik ima 4 prave kote?|pravokotnik|trikotnik|petkotnik|krog", "Which shape has 4 right angles?|rectangle|triangle|pentagon|circle"],
  [2, "Ob kateri uri kažeta kazalca v nasprotni smeri?|6:00|3:00|9:00|12:00", "At what time do the hands point opposite ways?|6:00|3:00|9:00|12:00"],
  [2, "Skozi točko T: koliko pravokotnic na premico p?|1|2|0|4", "Through point T: how many perpendiculars to line p?|1|2|0|4"],
  [2, "T ni na p. Koliko vzporednic s p gre skozi T?|1|2|0|4", "T is not on p. How many parallels to p through T?|1|2|0|4"],
  [2, "S čim preverimo, ali je kot pravi?|z geotrikotnikom|s šestilom|s tehtnico|z uro", "What do we check a right angle with?|a set square|compasses|scales|a clock"],
  [3, "Za koliko pravih kotov se zavrti veliki kazalec v 30 min?|2|1|3|30", "Minute hand in 30 min turns how many right angles?|2|1|3|30"],
  [3, "Za koliko pravih kotov se zavrti veliki kazalec v 45 min?|3|2|4|45", "Minute hand in 45 min turns how many right angles?|3|2|4|45"],
  [3, "Za koliko pravih kotov se zavrti veliki kazalec v 1 uri?|4|1|2|12", "Minute hand in 1 hour turns how many right angles?|4|1|2|12"],
  [3, "Ura je 12:00. Veliki kazalec se zavrti za 2 prava kota. Ura?|12:30|12:20|12:15|2:00", "12:00. The minute hand turns 2 right angles. Time?|12:30|12:20|12:15|2:00"],
  [3, "Ura je 12:00. Veliki kazalec se zavrti za 3 prave kote. Ura?|12:45|12:30|12:03|3:00", "12:00. The minute hand turns 3 right angles. Time?|12:45|12:30|12:03|3:00"],
  [3, "Koliko pravih kotov imajo vse ploskve kocke skupaj?|24|6|12|8", "Right angles on all faces of a cube together?|24|6|12|8"],
  [3, "Koliko pravih kotov imata 2 kvadrata skupaj?|8|4|2|6", "How many right angles do 2 squares have?|8|4|2|6"],
  [3, "Koliko pravih kotov imajo 3 pravokotniki skupaj?|12|3|7|9", "How many right angles do 3 rectangles have?|12|3|7|9"],
  [3, "a ⊥ b, b ⊥ c, c ⊥ d. Kakšni sta a in d?|pravokotni|vzporedni|poševni|enako dolgi", "a ⊥ b, b ⊥ c, c ⊥ d. Then a and d are?|perpendicular|parallel|oblique|equal in length"],
  [3, "a ⊥ b in a ∥ c. Kakšni sta b in c?|pravokotni|vzporedni|poševni|enako dolgi", "a ⊥ b and a ∥ c. Then b and c are?|perpendicular|parallel|oblique|equal in length"],
  [3, "Koliko parov pravokotnih stranic ima pravokotnik?|4|2|1|8", "Pairs of perpendicular sides in a rectangle?|4|2|1|8"],
  [3, "Koliko pravokotnic na premico p lahko narišemo?|neskončno|1|2|4", "How many perpendiculars to line p can we draw?|infinitely many|1|2|4"],
  [3, "Koliko pravih kotov je med kazalcema ob 6:00?|2|1|3|6", "How many right angles between the hands at 6:00?|2|1|3|6"],
  [3, "Koliko pravih kotov ima pravokotni trikotnik?|1|2|3|0", "How many right angles in a right-angled triangle?|1|2|3|0"],
];
def("m_angle", "ge", 4, "∟", "Pravi kot, vzporednice, pravokotnice", "Right angles, parallel and perpendicular lines", bank(ANGLE));

// Samo črke, ki so (ne)simetrične v vseh običajnih pisavah: B, C, D, E, K so ponekod nesimetrične, zato jih ni.
const SYM = ["A", "H", "I", "M", "O", "T", "U", "V", "W", "X", "Y"];
const NOSYM = ["F", "G", "J", "L", "N", "P", "Q", "R", "S", "Z"];
def("m_sym", "ge", 4, "⇋", "Simetrija", "Symmetry", (t, ctx) => {
  if (t === 1 || (t === 2 && Math.random() < 0.5)) {
    const yes = Math.random() < (t === 1 ? 0.7 : 0.4);
    const a = pick(yes ? SYM : NOSYM), ws = shuffle(yes ? NOSYM : SYM).slice(0, 3);
    return choice(yes ? L(ctx, "Katera črka je simetrična?", "Which letter is symmetric?") : L(ctx, "Katera črka ni simetrična?", "Which letter is not symmetric?"), a, ws);
  }
  // zrcaljenje čez os: točka in njena slika sta enako daleč od osi
  if (t === 3 && Math.random() < 0.4) {
    const d = R(2, 9);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Točka je ${d} cm od osi. Koliko je od svoje slike?`, `A point is ${d} cm from the axis. How far from its image?`), 2 * d, [d, d + 2, d * 4], "cm");
    return nq(ctx, L(ctx, `Točka je ${2 * d} cm od svoje slike. Koliko je od osi?`, `A point is ${2 * d} cm from its image. How far from the axis?`), d, [2 * d, 4 * d, d + 1], "cm");
  }
  const P = pick([
    [L(ctx, "Koliko osi simetrije ima kvadrat?", "Lines of symmetry of a square?"), "4", ["2", "1", "8"]],
    [L(ctx, "Pravokotnik 3 cm × 5 cm: koliko osi simetrije?", "Rectangle 3 cm × 5 cm: lines of symmetry?"), "2", ["4", "1", "0"]],
    [L(ctx, "Koliko osi simetrije ima krog?", "Lines of symmetry of a circle?"), L(ctx, "neskončno", "infinitely many"), ["1", "2", "4"]],
    [L(ctx, "Koliko osi simetrije ima črka H?", "Lines of symmetry of the letter H?"), "2", ["1", "0", "4"]],
    [L(ctx, "Koliko osi simetrije ima črka A?", "Lines of symmetry of the letter A?"), "1", ["2", "0", "3"]],
    [L(ctx, "Koliko osi simetrije ima črka T?", "Lines of symmetry of the letter T?"), "1", ["2", "0", "4"]],
    [L(ctx, "Koliko osi simetrije ima črka V?", "Lines of symmetry of the letter V?"), "1", ["2", "0", "3"]],
    [L(ctx, "Koliko osi simetrije ima črka F?", "Lines of symmetry of the letter F?"), "0", ["1", "2", "4"]],
    [L(ctx, "Koliko osi simetrije ima črka S?", "Lines of symmetry of the letter S?"), "0", ["1", "2", "4"]],
    [L(ctx, "Koliko osi simetrije ima črka L?", "Lines of symmetry of the letter L?"), "0", ["1", "2", "4"]],
    [L(ctx, "Koliko osi simetrije ima srček ♥?", "Lines of symmetry of a heart ♥?"), "1", ["2", "0", "4"]],
    [L(ctx, "Os simetrije razdeli lik na dva?", "A line of symmetry splits a shape into two?"), L(ctx, "enaka dela", "matching halves"), [L(ctx, "različna dela", "different parts"), L(ctx, "kroga", "circles"), L(ctx, "trikotnika", "triangles")]],
    [L(ctx, "Kaj uporabimo za preverjanje simetrije?", "What helps us check symmetry?"), L(ctx, "ogledalo", "a mirror"), [L(ctx, "tehtnico", "scales"), L(ctx, "uro", "a clock"), L(ctx, "šestilo", "compasses")]],
  ]);
  return choice(P[0], P[1], P[2]);
});

def("m_perim", "ge", 4, "o▭", "Obseg kvadrata in pravokotnika", "Perimeter of squares and rectangles", (t, ctx) => {
  const u = pick(["cm", "cm", "m", "dm"]);
  const S = (x) => `${x} ${u}`;
  if (t === 1) {
    if (Math.random() < 0.6) {
      const a = R(2, 12);
      return choice(L(ctx, `Kvadrat s stranico ${a} ${u}. Obseg?`, `Square with side ${a} ${u}. Perimeter?`), S(4 * a), [`${a * a} ${u}²`, S(2 * a), S(3 * a), S(a + 4)].filter((x) => x !== S(4 * a)));
    }
    const s = distinct(3, () => R(3, 12)).sort((x, y) => x - y);
    if (s[0] + s[1] <= s[2]) s[2] = s[0] + s[1] - 1;
    const sum = s[0] + s[1] + s[2];
    return choice(L(ctx, `Trikotnik: ${s.join(` ${u}, `)} ${u}. Obseg?`, `Triangle: ${s.join(` ${u}, `)} ${u}. Perimeter?`), S(sum), [S(sum + 1), S(sum - 1), S(s[0] + s[1]), S(sum + 10)]);
  }
  if (t === 2) {
    const [a, b] = distinct(2, () => R(2, 15));
    return choice(L(ctx, `Pravokotnik: a = ${a} ${u}, b = ${b} ${u}. Obseg?`, `Rectangle: a = ${a} ${u}, b = ${b} ${u}. Perimeter?`), S(2 * (a + b)), [S(a + b), S(a * b), `${a * b} ${u}²`, S(2 * a + b)].filter((x) => x !== S(2 * (a + b))));
  }
  if (Math.random() < 0.5) {
    const a = R(3, 15), o = 4 * a;
    return choice(L(ctx, `Obseg kvadrata je ${o} ${u}. Stranica?`, `A square's perimeter is ${o} ${u}. Side?`), S(a), [S(o / 2), S(o - 4), S(4 * o), S(a + 1)]);
  }
  const [a, b] = distinct(2, () => R(2, 15)), o = 2 * (a + b);
  return choice(L(ctx, `Pravokotnik: o = ${o} ${u}, a = ${a} ${u}. b = ?`, `Rectangle: P = ${o} ${u}, a = ${a} ${u}. b = ?`), S(b), [S(o - a), S(o - 2 * a), S(o / 2), S(b + 1)].filter((x) => x !== S(b)));
});

def("m_area", "ge", 5, "cm²", "Ploščina kvadrata in pravokotnika", "Area of squares and rectangles", (t, ctx) => {
  const u = pick(["cm", "cm", "m", "dm"]);
  const A = (x) => `${x} ${u}²`, S = (x) => `${x} ${u}`;
  if (t === 1) {
    if (Math.random() < 0.3) {
      const a = R(2, 6), b = R(2, 9);
      return nq(ctx, L(ctx, `Koliko kvadratkov 1 cm² pokrije pravokotnik ${a} cm × ${b} cm?`, `How many 1 cm squares cover a ${a} cm × ${b} cm rectangle?`), a * b, [2 * (a + b), a + b, a * b + a]);
    }
    const a = R(2, 12);
    return choice(L(ctx, `Kvadrat s stranico ${a} ${u}. Ploščina?`, `Square with side ${a} ${u}. Area?`), A(a * a), [S(a * a), A(4 * a), A(2 * a), A(a * a + a)].filter((x) => x !== A(a * a)));
  }
  if (t === 2) {
    const [a, b] = distinct(2, () => R(2, 15));
    return choice(L(ctx, `Pravokotnik: a = ${a} ${u}, b = ${b} ${u}. Ploščina?`, `Rectangle: a = ${a} ${u}, b = ${b} ${u}. Area?`), A(a * b), [A(2 * (a + b)), S(a * b), A(a + b), A(a * b + a)].filter((x) => x !== A(a * b)));
  }
  const k = R(0, 2);
  if (k === 0) {
    const a = R(2, 12), b = R(2, 12), p = a * b;
    return choice(L(ctx, `Pravokotnik: p = ${p} ${u}², a = ${a} ${u}. b = ?`, `Rectangle: area ${p} ${u}², a = ${a} ${u}. b = ?`), S(b), [S(p - a), A(b), Number.isInteger(p / 2 - a) && p / 2 - a > 0 ? S(p / 2 - a) : S(p + a), S(b + 1), S(2 * b)].filter((x) => x !== S(b)));
  }
  if (k === 1) {
    const a = R(2, 12), p = a * a;
    return choice(L(ctx, `Ploščina kvadrata je ${p} ${u}². Stranica?`, `A square's area is ${p} ${u}². Side?`), S(a), [A(a), S(p / 2), S(p / 4), S(a + 1), S(a - 1), S(2 * a)].filter((x) => !/\./.test(x) && x !== S(a) && x !== S(0)));
  }
  const P = pick([
    ["1 dm² = ? cm²", 100, [10, 1000, 4]], ["1 m² = ? dm²", 100, [10, 1000, 4]], ["1 cm² = ? mm²", 100, [10, 1000, 4]],
    ["3 dm² = ? cm²", 300, [30, 3000, 103]], ["5 m² = ? dm²", 500, [50, 5000, 105]], ["200 cm² = ? dm²", 2, [20, 2000, 200]],
  ]);
  return nq(ctx, P[0], P[1], P[2]);
});

// =====================================================================
// MERJENJE (me)
// =====================================================================
// [sl, en] urejeni po velikosti; sosednji se jasno razlikujejo
const SIZE_SETS = [
  [["Kaj je najtežje?", "Which is heaviest?"], ["Kaj je najlažje?", "Which is lightest?"], [["mravlja", "an ant"], ["jagoda", "a strawberry"], ["jabolko", "an apple"], ["lubenica", "a watermelon"], ["otrok", "a child"], ["konj", "a horse"], ["slon", "an elephant"]]],
  [["Kaj je najdaljše?", "Which is longest?"], ["Kaj je najkrajše?", "Which is shortest?"], [["mravlja", "an ant"], ["radirka", "an eraser"], ["svinčnik", "a pencil"], ["miza", "a table"], ["avto", "a car"], ["vlak", "a train"]]],
  [["V kaj gre največ vode?", "Which holds the most water?"], ["V kaj gre najmanj vode?", "Which holds the least water?"], [["žlička", "a teaspoon"], ["kozarec", "a glass"], ["steklenica", "a bottle"], ["vedro", "a bucket"], ["kad", "a bathtub"], ["bazen", "a pool"]]],
  [["Kaj je najvišje?", "Which is tallest?"], ["Kaj je najnižje?", "Which is shortest?"], [["mravlja", "an ant"], ["miš", "a mouse"], ["mačka", "a cat"], ["otrok", "a child"], ["hiša", "a house"], ["nebotičnik", "a skyscraper"]]],
];
def("m_sizes", "me", 1, "↔", "Daljše, težje, več", "Longer, heavier, more", (t, ctx) => {
  const [qmax, qmin, items] = pick(SIZE_SETS);
  const idx = distinct(4, () => R(0, items.length - 1));
  const big = t === 1 ? true : t === 2 ? false : Math.random() < 0.5;
  const best = big ? Math.max(...idx) : Math.min(...idx);
  const nm = (i) => (ctx.lang === "sl" ? items[i][0] : items[i][1]);
  return choice(L(ctx, (big ? qmax : qmin)[0], (big ? qmax : qmin)[1]), nm(best), idx.filter((i) => i !== best).map(nm));
});

const DAYS = ["ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota", "nedelja"];
const DAYS_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_INS = ["ponedeljkom", "torkom", "sredo", "četrtkom", "petkom", "soboto", "nedeljo"];
const MONTHS = ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"];
const MONTHS_INS = ["januarjem", "februarjem", "marcem", "aprilom", "majem", "junijem", "julijem", "avgustom", "septembrom", "oktobrom", "novembrom", "decembrom"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
def("m_days", "me", 1, "31", "Dnevi, tedni, meseci", "Days, weeks and months", (t, ctx) => {
  const day = (i) => L(ctx, DAYS[((i % 7) + 7) % 7], DAYS_EN[((i % 7) + 7) % 7]);
  const mon = (i) => L(ctx, MONTHS[((i % 12) + 12) % 12], MONTHS_EN[((i % 12) + 12) % 12]);
  const dayQ = (d, shift) => {
    const ws = [day(d - shift), day(d + shift + 1), day(d + shift - 1), day(d), day(d + 3)];
    return choice(L(ctx, `Danes je ${DAYS[d]}. ${shift === 1 ? "Kaj bo jutri?" : shift === -1 ? "Kaj je bilo včeraj?" : shift === 2 ? "Kaj bo pojutrišnjem?" : `Kaj bo čez ${shift} dni?`}`, `Today is ${DAYS_EN[d]}. ${shift === 1 ? "Tomorrow?" : shift === -1 ? "Yesterday?" : shift === 2 ? "The day after tomorrow?" : `In ${shift} days?`}`), day(d + shift), ws);
  };
  if (t === 1) {
    if (Math.random() < 0.1) return nq(ctx, L(ctx, "Koliko dni ima teden?", "How many days in a week?"), 7, [5, 6, 10, 12]);
    return dayQ(R(0, 6), Math.random() < 0.55 ? 1 : -1);
  }
  if (t === 2) {
    const k = R(0, 4);
    if (k === 0) return nq(ctx, L(ctx, "Koliko mesecev ima leto?", "How many months in a year?"), 12, [10, 7, 4, 52]);
    if (k === 1) return dayQ(R(0, 6), 2);
    const m = R(0, 11), after = Math.random() < 0.5;
    if (after) return choice(L(ctx, `Kateri mesec je za ${MONTHS_INS[m]}?`, `Which month comes after ${MONTHS_EN[m]}?`), mon(m + 1), [mon(m - 1), mon(m + 2), mon(m + 6)]);
    return choice(L(ctx, `Kateri mesec je pred ${MONTHS_INS[m]}?`, `Which month comes before ${MONTHS_EN[m]}?`), mon(m - 1), [mon(m + 1), mon(m - 2), mon(m + 6)]);
  }
  const k = R(0, 3);
  if (k === 0) {
    // Kateri dan je med torkom in četrtkom?
    const d = R(0, 6), ins = (i) => DAYS_INS[((i % 7) + 7) % 7];
    return choice(L(ctx, `Kateri dan je med ${ins(d - 1)} in ${ins(d + 1)}?`, `Which day is between ${DAYS_EN[(d + 6) % 7]} and ${DAYS_EN[(d + 1) % 7]}?`), day(d), [day(d - 1), day(d + 1), day(d + 2), day(d - 2)]);
  }
  if (k === 1) {
    if (Math.random() < 0.3) return nq(ctx, L(ctx, "2 tedna = ? dni", "2 weeks = ? days"), 14, [9, 12, 10, 20]);
    const e = R(1, 6);
    return nq(ctx, L(ctx, `1 teden in ${pl(e, "dan|dneva|dnevi|dni")} = ? dni`, `1 week and ${plEn(e, "day|days")} = ? days`), 7 + e, [1 + e, 10 + e, 7 + e + 1, 7 + e - 1]);
  }
  if (k === 2) return dayQ(R(0, 6), R(3, 5));
  return Math.random() < 0.5
    ? choice(L(ctx, "Kateri je prvi mesec v letu?", "Which is the first month of the year?"), mon(0), [mon(11), mon(2), mon(8)])
    : choice(L(ctx, "Kateri je zadnji mesec v letu?", "Which is the last month of the year?"), mon(11), [mon(0), mon(10), mon(5)]);
});

// 2. razred: števila do 100, zato tudi pri cm največ 100 (1 m = 100 cm).
const LEN_EST = [
  ["Dolžina svinčnika", "A pencil's length", 15, "cm", ["15 m", "1 cm", "1 m"]],
  ["Višina vrat", "A door's height", 2, "m", ["2 cm", "20 m", "20 cm"]],
  ["Dolžina zvezka", "An exercise book's length", 30, "cm", ["30 m", "3 cm", "3 m"]],
  ["Dolžina radirke", "An eraser's length", 4, "cm", ["4 m", "40 cm", "40 m"]],
  ["Višina hiše", "A house's height", 10, "m", ["10 cm", "100 m", "1 m"]],
  ["Dolžina učilnice", "A classroom's length", 8, "m", ["8 cm", "80 m", "80 cm"]],
  ["Dolžina avtomobila", "A car's length", 4, "m", ["4 cm", "40 m", "40 cm"]],
  ["Dolžina žlice", "A spoon's length", 15, "cm", ["15 m", "1 cm", "1 m"]],
  ["Višina šolske torbe", "A school bag's height", 40, "cm", ["40 m", "4 cm", "4 m"]],
  ["Višina žirafe", "A giraffe's height", 5, "m", ["5 cm", "50 m", "50 cm"]],
  ["Dolžina postelje", "A bed's length", 2, "m", ["2 cm", "20 m", "20 cm"]],
  ["Višina kozarca", "A glass's height", 10, "cm", ["10 m", "1 cm", "1 m"]],
  ["Širina dlani", "The width of a hand", 8, "cm", ["8 m", "80 cm", "1 cm"]],
  ["Dolžina čevlja", "A shoe's length", 20, "cm", ["20 m", "2 cm", "2 m"]],
];
def("m_len", "me", 2, "cm", "Dolžina: m in cm", "Length: m and cm", (t, ctx) => {
  if (t === 1) {
    const [s, e, v, u, ws] = pick(LEN_EST);
    return choice(L(ctx, `${s} je približno?`, `${e} is about?`), `${v} ${u}`, ws);
  }
  if (t === 2) {
    const k = R(0, 3);
    if (k === 0) return Math.random() < 0.5 ? nq(ctx, "1 m = ? cm", 100, [10, 1, 1000]) : choice("50 cm + 50 cm = ?", "1 m", ["100 m", "10 cm", "1 cm", "50 m"]);
    if (k === 1) {
      const a = R(10, 60), b = R(5, 99 - a);
      return nq(ctx, `${a} cm + ${b} cm = ?`, a + b, [noCarry(a, b), a + b + 10, a + b - 1], "cm");
    }
    const b = 10 * R(1, 9);
    return nq(ctx, `1 m ${M} ${b} cm = ? cm`, 100 - b, [b, 100 + b, 100 - b + 10, 90 - b > 0 ? 90 - b : 110 - b]);
  }
  const k = R(0, 3);
  if (k === 0) {
    let a;
    do a = R(11, 89); while (a % 10 === 0);
    // napaka: do 1 m dopolni le desetice (35 + 75) ali vzame 1 m kot 10 cm
    return nq(ctx, `${a} cm + ? cm = 1 m`, 100 - a, [110 - a, 100 + a, a, 100 - a + 1, 100 - a - 1]);
  }
  if (k === 1) {
    const b = R(11, 89);
    return nq(ctx, `1 m ${M} ${b} cm = ? cm`, 100 - b, [b, 1 + b, 110 - b, 100 - b - 10, 100 - b + 1]);
  }
  if (k === 2) return pick([
    () => nq(ctx, L(ctx, "1 m = ? · 10 cm", "1 m = ? · 10 cm"), 10, [100, 1, 50]),
    () => nq(ctx, L(ctx, "1 m = ? · 50 cm", "1 m = ? · 50 cm"), 2, [50, 1, 5]),
    () => nq(ctx, L(ctx, "1 m = ? · 20 cm", "1 m = ? · 20 cm"), 5, [20, 2, 10]),
    () => nq(ctx, L(ctx, "1 m = ? · 25 cm", "1 m = ? · 25 cm"), 4, [25, 2, 5]),
  ])();
  // napaka: 99 cm je več kot 1 m, ker je 99 več kot 1
  const big = Math.random() < 0.5;
  const opts = shuffle([["1 m", 100], ["90 cm", 90], ["99 cm", 99], ["50 cm", 50], ["2 m", 200], ["10 cm", 10], ["60 cm", 60], ["9 cm", 9]]);
  const xs = opts.slice(0, 4);
  const best = xs.reduce((x, y) => ((big ? y[1] > x[1] : y[1] < x[1]) ? y : x));
  return choice(big ? L(ctx, "Kaj je najdaljše?", "Which is longest?") : L(ctx, "Kaj je najkrajše?", "Which is shortest?"), best[0], xs.filter((x) => x !== best).map((x) => x[0]));
});

// Ura z besedo: »pol osmih« = 7:30, »četrt na devet« = 8:15, »tri četrt na devet« = 8:45
const HM = (h, m) => `${h}:${String(m).padStart(2, "0")}`;
const H_GEN = ["", "enih", "dveh", "treh", "štirih", "petih", "šestih", "sedmih", "osmih", "devetih", "desetih", "enajstih", "dvanajstih"];
const H_NOM = ["", "eno", "dve", "tri", "štiri", "pet", "šest", "sedem", "osem", "devet", "deset", "enajst", "dvanajst"];
const H_EN = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const nextH = (h) => (h % 12) + 1, prevH = (h) => ((h + 10) % 12) + 1;
def("m_clock", "me", 2, "◷", "Ura", "Telling the time", (t, ctx) => {
  const h = R(1, 12);
  if (t === 1) {
    if (Math.random() < 0.5)
      return choice(L(ctx, `Mali kazalec je na ${h}, veliki na 12. Koliko je ura?`, `Short hand on ${h}, long hand on 12. What time is it?`), HM(h, 0), [HM(nextH(h), 0), HM(prevH(h), 0), HM(12, h === 12 ? 0 : h * 5) === HM(h, 0) ? HM(h, 30) : HM(12, (h % 12) * 5)]);
    return choice(L(ctx, `Mali kazalec je med ${h} in ${nextH(h)}, veliki na 6. Koliko je ura?`, `Short hand between ${h} and ${nextH(h)}, long hand on 6. Time?`), HM(h, 30), [HM(nextH(h), 30), HM(h, 6), HM(prevH(h), 30), HM(h, 0)]);
  }
  if (t === 2) {
    const k = R(0, 3);
    if (k === 0) return choice(L(ctx, `»pol ${H_GEN[nextH(h)]}« = ?`, `»half past ${H_EN[h]}« = ?`), HM(h, 30), [HM(nextH(h), 30), HM(h, 0), HM(prevH(h), 30)]);
    if (k === 1) return choice(L(ctx, `»četrt na ${H_NOM[nextH(h)]}« = ?`, `»quarter past ${H_EN[h]}« = ?`), HM(h, 15), [HM(nextH(h), 15), HM(h, 45), HM(nextH(h), 0)]);
    if (k === 2) return choice(L(ctx, `»tri četrt na ${H_NOM[nextH(h)]}« = ?`, `»quarter to ${H_EN[nextH(h)]}« = ?`), HM(h, 45), [HM(nextH(h), 45), HM(h, 15), HM(nextH(h), 15)]);
    return choice(L(ctx, `Mali kazalec je na ${h}, veliki na 12. Koliko je ura?`, `Short hand on ${h}, long hand on 12. What time is it?`), HM(h, 0), [HM(nextH(h), 0), HM(h, 12), HM(prevH(h), 0)]);
  }
  const s = R(6, 10), sm = pick([0, 15, 30, 45]), d = pick([15, 30, 45, 60, 90]);
  const tot = s * 60 + sm + d, eh = Math.floor(tot / 60), em = tot % 60;
  const dTxt = d === 60 ? L(ctx, "1 uro", "1 hour") : d === 90 ? L(ctx, "1 uro in 30 min", "1 h 30 min") : `${d} min`;
  const naive = sm + (d % 60); // napaka: minute do 100
  return choice(L(ctx, `Ura je ${HM(s, sm)}. Koliko bo ura čez ${dTxt}?`, `It is ${HM(s, sm)}. What time in ${dTxt}?`), HM(eh, em), [naive >= 60 && naive < 100 ? `${s + Math.floor(d / 60)}:${naive}` : HM(eh, (em + 30) % 60), HM(eh + 1, em), HM(eh, em === 0 ? 30 : em - 15 >= 0 ? em - 15 : em + 15), HM(eh - 1 >= 1 ? eh - 1 : eh + 2, em)]);
});

// Denar kot v slovenskih učbenikih 1.–5. razreda: »3 € 40 c«; angleško »€3.40«, »40c«.
const eurc = (ctx, e, c) => {
  if (ctx.lang !== "sl") return e ? `€${e}${c ? "." + String(c).padStart(2, "0") : ""}` : `${c}c`;
  return [e ? `${e} €` : "", c ? `${c} c` : ""].filter(Boolean).join(" ") || "0 €";
};
const fmtC = (ctx, c) => eurc(ctx, Math.floor(c / 100), c % 100); // znesek v centih
// 2. razred: števila do 100, zato centi največ 100 (1 € = 100 c)
def("m_money", "me", 2, "€", "Denar: evri in centi", "Money: euros and cents", (t, ctx) => {
  const E = (x) => eurc(ctx, x, 0);
  if (t === 1) {
    const k = R(0, 3);
    if (k === 0) {
      const a = R(1, 10), b = R(1, 10);
      return nq(ctx, `${E(a)} + ${E(b)} = ?`, a + b, [a + b + 1, a + b - 1, Math.abs(a - b) || a + b + 2, a + b + 10], "€");
    }
    if (k === 1) {
      const a = R(5, 20), b = R(1, a - 1);
      return nq(ctx, L(ctx, `Imam ${a} €. Porabim ${b} €. Koliko mi ostane?`, `I have €${a}. I spend €${b}. What is left?`), a - b, [a + b, a - b + 1, a - b - 1, b], "€");
    }
    if (k === 2) return choice(L(ctx, "1 € = ? c", "€1 = ? cents"), "100", ["10", "1000", "50"]);
    const ns = [[5, 2], [10, 5], [2, 1], [5, 1], [10, 2], [20, 5], [10, 10], [20, 10], [5, 5]];
    const [a, b] = pick(ns);
    const c2 = R(0, 2);
    return nq(ctx, `${E(a)} + ${E(b)} + ${E(c2 + 1)} = ?`, a + b + c2 + 1, [a + b, a + b + c2, a + b + c2 + 2], "€");
  }
  if (t === 2) {
    const k = R(0, 3);
    if (k === 0) {
      const a = 10 * R(1, 8), b = 10 * R(1, 9 - a / 10);
      return choice(`${fmtC(ctx, a)} + ${fmtC(ctx, b)} = ?`, fmtC(ctx, a + b), [E(a + b), fmtC(ctx, a + b + 10), fmtC(ctx, a + b - 10 || a + b + 20), fmtC(ctx, a + b + 100)]);
    }
    if (k === 1) {
      const c = 10 * R(1, 9);
      return choice(`${E(1)} ${M} ${fmtC(ctx, c)} = ?`, fmtC(ctx, 100 - c), [fmtC(ctx, c), fmtC(ctx, 110 - c), fmtC(ctx, 100 + c), fmtC(ctx, 90 - c > 0 ? 90 - c : 120 - c)]);
    }
    if (k === 2) return choice(`${fmtC(ctx, 50)} + ${fmtC(ctx, 50)} = ?`, E(1), [E(100), fmtC(ctx, 10), fmtC(ctx, 50), fmtC(ctx, 1)]);
    const a = 10 * R(2, 9), b = 10 * R(1, a / 10 - 1);
    return choice(`${fmtC(ctx, a)} ${M} ${fmtC(ctx, b)} = ?`, fmtC(ctx, a - b), [a + b <= 100 ? fmtC(ctx, a + b) : null, fmtC(ctx, a - b + 10), fmtC(ctx, a - b + 20), a - b > 10 ? fmtC(ctx, a - b - 10) : null, E(a - b)]);
  }
  const k = R(0, 2);
  if (k === 0) {
    // koliko centov manjka do 1 €
    let a;
    do a = 5 * R(3, 19); while (a % 10 === 0 && Math.random() < 0.6);
    return choice(`${fmtC(ctx, a)} + ? = ${E(1)}`, fmtC(ctx, 100 - a), [fmtC(ctx, 110 - a), fmtC(ctx, a), fmtC(ctx, 100 - a + 10), a < 90 ? fmtC(ctx, 90 - a) : null, fmtC(ctx, 105 - a), fmtC(ctx, 100 + a)].filter((x) => x !== fmtC(ctx, 100 - a)));
  }
  if (k === 1) {
    const e = R(1, 5), c1 = 10 * R(1, 8), c2 = 10 * R(1, 9 - c1 / 10);
    return choice(`${eurc(ctx, e, c1)} + ${fmtC(ctx, c2)} = ?`, eurc(ctx, e, c1 + c2), [eurc(ctx, e + 1, c1 + c2 >= 100 ? c1 + c2 - 100 : c1 + c2), fmtC(ctx, 100 * e + c1 + c2 + 10), eurc(ctx, e + c2 / 10, c1), eurc(ctx, e, Math.abs(c1 - c2) || c1 + c2 + 20)]);
  }
  const N = pick([5, 10, 20]), price = 100 * R(1, N - 1) + 10 * R(1, 9); // v centih
  const ch = 100 * N - price;
  // napaka: centov ne odštejemo od 100 (vrnejo 1 € 40 c namesto 1 € 60 c)
  const naive = 100 * (N - Math.floor(price / 100)) + (price % 100);
  const fmt = (c) => fmtC(ctx, c);
  return choice(L(ctx, `Stane ${fmt(price)}. Plačam ${zs(N)} ${N} €. Koliko mi vrnejo?`, `It costs ${fmt(price)}. I pay €${N}. Change?`), fmt(ch), [fmt(naive), fmt(naive - 100), fmt(ch + 100), fmt(ch + 10), ch > 10 ? fmt(ch - 10) : null, fmt(price)].filter((x) => x && x !== fmt(ch)));
});

const MASS_VOL = [
  ["Masa jabolka je približno?", "An apple's mass is about?", "15 dag", ["15 kg", "150 kg", "1 dag"]],
  ["Masa vreče moke je približno?", "A bag of flour is about?", "1 kg", ["1 dag", "100 kg", "10 dag"]],
  ["Masa učenca 3. razreda je približno?", "An 8-year-old's mass is about?", "30 kg", ["30 dag", "300 kg", "3 kg"]],
  ["Masa tablice čokolade je približno?", "A bar of chocolate is about?", "10 dag", ["10 kg", "100 kg", "1 dag"]],
  ["Masa hlebca kruha je približno?", "A loaf of bread is about?", "1 kg", ["1 dag", "100 kg", "10 dag"]],
  ["Masa avtomobila je približno?", "A car's mass is about?", "1000 kg", ["10 kg", "100 dag", "10 dag"]],
  ["Masa mačke je približno?", "A cat's mass is about?", "4 kg", ["4 dag", "40 kg", "400 kg"]],
  ["V plastenko mleka gre približno?", "A bottle of milk holds about?", "1 L", ["1 dL", "100 L", "10 L"]],
  ["V kozarec gre približno?", "A glass holds about?", "2 dL", ["2 L", "20 L", "200 L"]],
  ["V vedro gre približno?", "A bucket holds about?", "10 L", ["10 dL", "1000 L", "1 dL"]],
  ["V kad gre približno?", "A bathtub holds about?", "150 L", ["15 dL", "150 dL", "15 L"]],
  ["V skodelico čaja gre približno?", "A cup of tea holds about?", "2 dL", ["2 L", "20 L", "200 L"]],
  ["V pločevinko soka gre približno?", "A can of juice holds about?", "3 dL", ["3 L", "30 L", "300 L"]],
];
def("m_massvol", "me", 3, "kg", "Masa in prostornina", "Mass and capacity", (t, ctx) => {
  if (t === 1) {
    const [s, e, a, ws] = pick(MASS_VOL);
    return choice(L(ctx, s, e), a, ws);
  }
  if (t === 2) {
    const [A, B, f] = pick([["kg", "dag", 100], ["dag", "g", 10], ["kg", "g", 1000], ["L", "dL", 10]]);
    const v = f === 1000 ? 1 : R(1, 9); // 3. razred: do 1000
    if (Math.random() < 0.6) return nq(ctx, `${v} ${A} = ? ${B}`, v * f, [v * f * 10, (v * f) / 10, v, v + f]);
    return nq(ctx, `${v * f} ${B} = ? ${A}`, v, [v * 10, v * f * 10, v * f / 10 === v ? v * 100 : v * f / 10]);
  }
  const k = R(0, 3);
  if (k === 0) {
    const c = 10 * R(1, 9);
    return nq(ctx, `1 kg ${M} ${c} dag = ? dag`, 100 - c, [c, 1000 - c, 100 + c, 10 - c / 10 > 0 ? 10 - c / 10 : 110 - c]);
  }
  if (k === 1) {
    const a = R(1, 5), b = R(1, 9);
    return nq(ctx, `${a} L + ${b} dL = ? dL`, 10 * a + b, [a + b, 100 * a + b, Number(`${a}0${b}`) === 10 * a + b ? 10 * b + a : Number(`${a}0${b}`)]);
  }
  if (k === 2) {
    const a = R(1, 5), b = R(1, 99);
    return nq(ctx, `${a} kg ${b} dag = ? dag`, 100 * a + b, [a + b, Number(`${a}${b}`) === 100 * a + b ? 10 * a + b : Number(`${a}${b}`), 1000 * a + b]);
  }
  return pick([
    () => nq(ctx, L(ctx, "Pol kilograma = ? dag", "Half a kilogram = ? dag"), 50, [5, 500, 20, 25]),
    () => nq(ctx, L(ctx, "Pol litra = ? dL", "Half a litre = ? dL"), 5, [50, 500, 2]),
    () => nq(ctx, L(ctx, "Četrt kilograma = ? dag", "A quarter of a kilogram = ? dag"), 25, [4, 250, 40, 50]),
  ])();
});

const CONV = [
  ["km", "m", 1000], ["m", "dm", 10], ["m", "cm", 100], ["m", "mm", 1000], ["dm", "cm", 10], ["cm", "mm", 10],
  ["t", "kg", 1000], ["kg", "dag", 100], ["kg", "g", 1000], ["dag", "g", 10], ["L", "dL", 10], ["L", "mL", 1000], ["dL", "mL", 100], ["hL", "L", 100],
];
def("m_conv", "me", 4, "⇄", "Pretvarjanje enot", "Converting units", (t, ctx) => {
  if (t < 3) {
    const pool = t === 1 ? CONV.filter((c) => c[2] <= 100) : CONV;
    const [A, B, f] = pick(pool), v = R(2, 9);
    const fA = (x) => x;
    if (t === 1 || Math.random() < 0.5) return nq(ctx, `${fA(v)} ${A} = ? ${B}`, v * f, [v * f * 10, (v * f) / 10, v, v * (f === 10 ? 100 : 10)]);
    return nq(ctx, `${G(ctx, v * f)} ${B} = ? ${A}`, v, [v * 10, v * f * 10, v * 100, v * f]);
  }
  const [A, B, f] = pick(CONV.filter((c) => c[2] >= 10));
  const a = R(1, 9), b = R(1, f - 1 > 99 ? 99 : f - 1);
  const ans = a * f + b;
  return nq(ctx, `${a} ${A} ${b} ${B} = ? ${B}`, ans, [Number(`${a}${b}`), a + b, a * f * 10 + b, f === 10 ? a * 100 + b : a * f + b * 10].filter((x) => x !== ans));
});

def("m_timecalc", "me", 4, "min", "Računanje s časom", "Working with time", (t, ctx) => {
  if (t === 1) {
    const P = pick([
      ["h", "min", 60, "h", "min"], ["min", "s", 60, "min", "s"], ["dan|dneva|dnevi|dni", "h", 24, "day|days", "h"], ["teden|tedna|tedni|tednov", "dni", 7, "week|weeks", "days"], ["leto|leti|leta|let", "mesecev", 12, "year|years", "months"],
    ]);
    const v = R(1, 5);
    const left = P[0].includes("|") ? L(ctx, pl(v, P[0]), plEn(v, P[3])) : `${v} ${P[0]}`;
    return nq(ctx, `${left} = ? ${L(ctx, P[1], P[4])}`, v * P[2], [v * 100, v * 10, v * P[2] + P[2], v + P[2]]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const h = R(1, 4), m = pick([5, 10, 15, 20, 25, 30, 40, 45, 50]);
      return nq(ctx, `${h} h ${m} min = ? min`, 60 * h + m, [100 * h + m, h + m, 60 + m, 60 * h + m + 10]);
    }
    const h = R(1, 4), m = pick([10, 15, 20, 30, 40, 45, 50]), tot = 60 * h + m;
    const s = (a, b) => `${a} h ${b} min`;
    const dec = Math.floor(tot / 100), rem = tot % 100; // napaka: deli s 100
    return choice(`${tot} min = ?`, s(h, m), [rem < 60 ? s(dec, rem) : s(h + 1, m), s(h, m + 10 < 60 ? m + 10 : m - 10), s(h + 1, m), s(h - 1 > 0 ? h - 1 : h + 2, m)].filter((x) => x !== s(h, m)));
  }
  if (Math.random() < 0.5) {
    const sh = R(7, 15), sm = pick([10, 15, 20, 30, 40, 45, 50]), d = pick([20, 25, 30, 35, 40, 45, 50]);
    const tot = sh * 60 + sm + d, eh = Math.floor(tot / 60), em = tot % 60;
    if (eh === sh) return nq(ctx, L(ctx, `Od ${HM(sh, sm)} do ${HM(eh, em)}: koliko minut?`, `From ${HM(sh, sm)} to ${HM(eh, em)}: how many minutes?`), d, [d + 10, d - 5, 60 - d], "min");
    const naive = eh * 100 + em - (sh * 100 + sm); // napaka: računa kot z desetiškimi števili
    return nq(ctx, L(ctx, `Od ${HM(sh, sm)} do ${HM(eh, em)}: koliko minut?`, `From ${HM(sh, sm)} to ${HM(eh, em)}: how many minutes?`), d, [naive, d + 10, 60 - d === d ? d + 5 : 60 - d, d - 10], "min");
  }
  const sh = R(14, 19), sm = pick([0, 15, 30, 45]), dh = R(1, 2), dm = pick([15, 30, 45]);
  const tot = sh * 60 + sm + dh * 60 + dm, eh = Math.floor(tot / 60), em = tot % 60;
  const naive = sm + dm;
  return choice(L(ctx, `Film se začne ob ${HM(sh, sm)} in traja ${dh} h ${dm} min. Kdaj se konča?`, `A film starts at ${HM(sh, sm)}, lasts ${dh} h ${dm} min. Ends at?`), HM(eh, em), [naive >= 60 ? `${sh + dh}:${naive}` : HM(eh + 1, em), HM(eh, (em + 30) % 60), HM(eh - 1, em), HM(eh + 1, em)].filter((x) => x !== HM(eh, em)));
});

def("m_dec_units", "me", 5, "1,5L", "Decimalni zapis količin", "Decimals in measures", (t, ctx) => {
  const n = (x) => ctx.num(Math.round(x * 1000) / 1000);
  const sep = ctx.num(1.5).includes(",") ? "," : ".";
  const eur = (x) => (ctx.lang === "sl" ? `${x.toFixed(2).replace(".", sep)} €` : `€${x.toFixed(2)}`);
  const cents = L(ctx, "c", "cents");
  if (t === 1) {
    const e = R(1, 9), c = R(1, 99), x = e + c / 100;
    if (Math.random() < 0.5) return nq(ctx, `${eur(x)} = ? ${cents}`, 100 * e + c, [Number(`${e}${c}`) === 100 * e + c ? 1000 * e + c : Number(`${e}${c}`), e + c, 1000 * e + c, Number(`${e}0${c}`) === 100 * e + c ? 10 * e + c : Number(`${e}0${c}`)].filter((v) => v !== 100 * e + c));
    const tot = 100 * e + 10 * R(1, 9);
    return choice(`${tot} ${cents} = ?`, eur(tot / 100), [eur(tot / 10), eur(tot / 1000), L(ctx, `${tot} €`, `€${tot}`), eur(e + (tot % 100) / 1000)].filter((s) => s !== eur(tot / 100)));
  }
  if (t === 2) {
    const [A, B, f] = pick([["kg", "g", 1000], ["kg", "dag", 100], ["L", "dL", 10], ["L", "mL", 1000], ["km", "m", 1000], ["t", "kg", 1000], ["m", "cm", 100]]);
    const v = pick([0.5, 1.5, 2.5, 1.2, 3.4, 0.2, 2.25, 0.75, 4.5, 1.25].filter((x) => Number.isInteger(Math.round(x * f * 1e6) / 1e6)));
    const r = Math.round(v * f);
    return nq(ctx, `${n(v)} ${A} = ? ${B}`, r, [Math.round(r / 10), r * 10, Math.floor(v) * f + Math.round((v % 1) * 100), Math.round(v * 100) === r ? Math.round(v * 10) : Math.round(v * 100)].filter((x) => x !== r));
  }
  if (Math.random() < 0.6) {
    const [A, B, f] = pick([["g", "kg", 1000], ["cm", "m", 100], ["dL", "L", 10], ["mL", "L", 1000], ["dag", "kg", 100]]);
    const v = pick([0.5, 0.25, 0.75, 0.2, 0.4, 0.35, 0.8, 1.5, 2.25, 0.05].filter((x) => Number.isInteger(Math.round(x * f * 1e6) / 1e6) && x * f >= 1));
    const small = Math.round(v * f);
    return choice(`${small} ${A} = ? ${B}`, n(v), [n(v * 10), n(v / 10), String(small), n(small / 10) === n(v) ? n(v * 100) : n(small / 10)].filter((x) => x !== n(v)));
  }
  // največja/najmanjša količina: ista količina v različnih enotah (napaka: 1,5 m < 105 cm, ker je 105 > 15)
  const [B, S] = pick([["m", "cm"], ["kg", "dag"], ["€", "c"]]);
  const a = R(1, 5);
  const vals = shuffle([5, 50, 45, 55, 15, 30, 3, 70, 7, 25]).slice(0, 4).map((x) => 100 * a + x);
  const show = (v, i) => {
    const asBig = (i + R(0, 1)) % 2 === 0;
    if (B === "€") return asBig ? eur(v / 100) : L(ctx, `${v} c`, `${v}c`);
    return asBig ? `${n(v / 100)} ${B}` : `${v} ${S}`;
  };
  const shown = vals.map(show);
  const big = Math.random() < 0.5;
  const bi = vals.indexOf(big ? Math.max(...vals) : Math.min(...vals));
  const Q = { m: [["Kaj je najdaljše?", "Which is longest?"], ["Kaj je najkrajše?", "Which is shortest?"]], kg: [["Kaj je najtežje?", "Which is heaviest?"], ["Kaj je najlažje?", "Which is lightest?"]], "€": [["Kaj je največ denarja?", "Which is the most money?"], ["Kaj je najmanj denarja?", "Which is the least money?"]] }[B][big ? 0 : 1];
  return choice(L(ctx, Q[0], Q[1]), shown[bi], shown.filter((_, i) => i !== bi));
});

// =====================================================================
// STATISTIKA (st)
// =====================================================================
const VOTE_SETS = [
  [["pes", "dog"], ["mačka", "cat"], ["zajec", "rabbit"], ["konj", "horse"]],
  [["rdeča", "red"], ["modra", "blue"], ["zelena", "green"], ["rumena", "yellow"]],
  [["sliva", "plum"], ["hruška", "pear"], ["banana", "banana"], ["jabolko", "apple"]],
];
def("m_table", "st", 2, "▤", "Branje preglednice", "Reading a table", (t, ctx) => {
  const set = shuffle(pick(t === 1 ? VOTE_SETS.slice(0, 2) : VOTE_SETS));
  const nm = (i) => L(ctx, set[i][0], set[i][1]);
  const list = (vals, show = String) => vals.map((v, i) => `${nm(i)} ${show(v)}`).join(", ");
  if (t === 1) {
    if (Math.random() < 0.4) {
      // črtice: | za vsak glas
      const vals = distinct(2, () => R(1, 7)), i = R(0, 1);
      return nq(ctx, `${list(vals, (v) => "|".repeat(v))}. ${L(ctx, `Koliko glasov ima ${nm(i)}?`, `Votes for ${nm(i)}?`)}`, vals[i], vals.filter((_, j) => j !== i));
    }
    const vals = distinct(4, () => R(1, 9)), big = Math.random() < 0.6;
    const bi = vals.indexOf(big ? Math.max(...vals) : Math.min(...vals));
    return choice(`${list(vals)}. ${big ? L(ctx, "Največ glasov?", "Most votes?") : L(ctx, "Najmanj glasov?", "Fewest votes?")}`, nm(bi), [0, 1, 2, 3].filter((j) => j !== bi).map(nm));
  }
  const top = t === 2 ? 10 : 30;
  if (Math.random() < 0.5) {
    const vals = distinct(3, () => R(2, top));
    const sum = vals[0] + vals[1] + vals[2];
    return nq(ctx, `${list(vals)}. ${L(ctx, "Koliko je vseh glasov?", "Total votes?")}`, sum, [sum + 1, sum - 1, sum + 10, sum - 10, Math.max(...vals)]);
  }
  const vals = distinct(2, () => R(2, top)).sort((x, y) => y - x);
  return nq(ctx, `${list(vals)}. ${L(ctx, `Za koliko več glasov ima ${nm(0)}?`, `How many more votes for ${nm(0)}?`)}`, vals[0] - vals[1], [vals[0] + vals[1], vals[0], vals[1], vals[0] - vals[1] + 1]);
});

def("m_pict", "st", 3, "■■", "Figurni prikaz", "Pictograms", (t, ctx) => {
  const key = t === 1 ? pick([2, 10]) : pick([5, 10, 2, 4]);
  const sq = (k) => "■".repeat(k);
  if (t < 3) {
    const k = R(2, 9);
    return nq(ctx, L(ctx, `Ključ: ■ = ${key}. Koliko je ${sq(k)}?`, `Key: ■ = ${key}. What is ${sq(k)}?`), k * key, [k, k + key, k * key + key, k * key - key]);
  }
  if (Math.random() < 0.5) {
    const k = R(2, 9), v = k * key;
    return nq(ctx, L(ctx, `Ključ: ■ = ${key}. Koliko ■ narišem za ${v}?`, `Key: ■ = ${key}. How many ■ show ${v}?`), k, [v, v - key, k + 1, k - 1]);
  }
  const [a, b] = distinct(2, () => R(2, 8)).sort((x, y) => x - y);
  return nq(ctx, L(ctx, `Ključ: ■ = ${key}. A: ${sq(a)}, B: ${sq(b)}. Za koliko več B?`, `Key: ■ = ${key}. A: ${sq(a)}, B: ${sq(b)}. B is more by?`), (b - a) * key, [b - a, (b + a) * key, b * key, (b - a) * key + key]);
});

def("m_combos", "st", 4, "a×b", "Kombinacije", "Counting combinations", (t, ctx) => {
  if (t < 3) {
    const a = R(2, t === 1 ? 4 : 6), b = R(2, t === 1 ? 3 : 5);
    const T = pick([
      [`${pl(a, "majica|majici|majice|majic")} in ${pl(b, "kapa|kapi|kape|kap")}. Koliko različnih kombinacij?`, `${a} T-shirts and ${b} caps. How many different outfits?`],
      [`${pl(a, "okus|okusa|okusi|okusov")} sladoleda, ${pl(b, "vrsta|vrsti|vrste|vrst")} kornetov. Koliko izbir?`, `${a} ice-cream flavours, ${b} kinds of cone. How many choices?`],
      [`${pl(a, "juha|juhi|juhe|juh")} in ${pl(b, "glavna jed|glavni jedi|glavne jedi|glavnih jedi")}. Koliko različnih kosil?`, `${a} soups and ${b} main dishes. How many different lunches?`],
      [`${pl(a, "vrsta|vrsti|vrste|vrst")} kruha in ${pl(b, "namaz|namaza|namazi|namazov")}. Koliko različnih sendvičev?`, `${a} kinds of bread, ${b} spreads. How many different sandwiches?`],
    ]);
    if (t === 2 && Math.random() < 0.2) return nq(ctx, L(ctx, "Vržem kovanec in kocko. Koliko izidov?", "I toss a coin and roll a dice. How many outcomes?"), 12, [8, 6, 2, 36]);
    return nq(ctx, L(ctx, T[0], T[1]), a * b, [a + b, a * b + 1, a * a === a * b ? b * b : a * a, a * b * 2]);
  }
  const r3 = Math.random();
  if (r3 < 0.3) {
    const a = R(2, 3), b = R(2, 3), c = R(2, 3);
    return nq(ctx, L(ctx, `${pl(a, "majica|majici|majice|majic")}, ${pl(b, "kapa|kapi|kape|kap")} in ${pl(c, "šal|šala|šali|šalov")}. Koliko kombinacij?`, `${a} T-shirts, ${b} caps and ${c} scarves. How many outfits?`), a * b * c, [a + b + c, a * b + c, a * b, a * b * c + 1]);
  }
  if (r3 < 0.65) {
    const n = R(3, 7);
    return nq(ctx, L(ctx, `${pl(n, "igralec|igralca|igralci|igralcev")}, vsak z vsakim enkrat. Koliko iger?`, `${n} players, each plays each other once. How many games?`), (n * (n - 1)) / 2, [n * (n - 1), n * n, n, (n * (n - 1)) / 2 + 1]);
  }
  const P = pick([
    [L(ctx, "Števke 1, 2, 3, vsaka enkrat. Koliko trimestnih števil?", "Digits 1, 2, 3, each once. How many 3-digit numbers?"), 6, [3, 9, 27]],
    [L(ctx, "Koliko dvomestnih števil iz 1, 2, 3 brez ponavljanja?", "2-digit numbers from 1, 2, 3, no repeats?"), 6, [3, 9, 5]],
    [L(ctx, "Koliko dvomestnih števil iz 1, 2, 3, 4 brez ponavljanja?", "2-digit numbers from 1, 2, 3, 4, no repeats?"), 12, [16, 8, 6]],
    [L(ctx, "Koliko dvomestnih števil iz števk 1 in 2, lahko ponovljenih?", "2-digit numbers from 1 and 2, repeats allowed?"), 4, [2, 3, 6]],
    [L(ctx, "Na koliko načinov se v vrsto postavijo 3 otroci?", "In how many ways can 3 children stand in a line?"), 6, [3, 9, 4]],
  ]);
  return nq(ctx, P[0], P[1], P[2]);
});

// Gotovo, mogoče, nemogoče: dogodki z razredom 0 nemogoče, 1 mogoče, 2 gotovo
def("m_chance", "st", 5, "?!", "Gotovo, mogoče, nemogoče", "Certain, possible, impossible", (t, ctx) => {
  const DIE = [
    ["pade 7", "a 7", 0], ["pade 0", "a 0", 0], ["pade več kot 6", "more than 6", 0], ["pade 10", "a 10", 0],
    ["pade 6", "a 6", 1], ["pade 1", "a 1", 1], ["pade sodo število", "an even number", 1], ["pade liho število", "an odd number", 1], ["pade več kot 4", "more than 4", 1], ["pade manj kot 3", "less than 3", 1],
    ["pade 8", "an 8", 0], ["pade 9", "a 9", 0], ["pade manj kot 10", "less than 10", 2], ["pade manj kot 7", "less than 7", 2], ["pade vsaj 1", "at least 1", 2], ["pade število do 6", "a number up to 6", 2], ["pade več kot 0", "more than 0", 2],
  ];
  const BAG = [
    ["izvlečem zeleno", "drawing green", 0], ["izvlečem rumeno", "drawing yellow", 0], ["izvlečem belo", "drawing white", 0],
    ["izvlečem rdečo", "drawing red", 1], ["izvlečem modro", "drawing blue", 1],
    ["izvlečem kroglico", "drawing a ball", 2],
  ];
  const COIN = [["pade grb", "heads", 1], ["pade cifra", "tails", 1], ["pade grb ali cifra", "heads or tails", 2], ["pade grb in cifra", "heads and tails", 0]];
  if (t === 3 && Math.random() < 0.5) {
    const P = pick([
      [L(ctx, "Vržem kocko. Koliko je vseh izidov?", "Rolling a dice: how many outcomes?"), 6, [1, 2, 12]],
      [L(ctx, "Vržem kocko. Koliko izidov je sodih?", "Rolling a dice: how many even outcomes?"), 3, [2, 4, 6]],
      [L(ctx, "Vržem kocko. Koliko izidov je večjih od 4?", "Rolling a dice: how many outcomes above 4?"), 2, [1, 3, 4]],
      [L(ctx, "Vržem kocko. Koliko izidov je manjših od 3?", "Rolling a dice: how many outcomes below 3?"), 2, [3, 1, 4]],
      [L(ctx, "Mečem kovanec. Koliko je vseh izidov?", "Tossing a coin: how many outcomes?"), 2, [1, 3, 4]],
      [L(ctx, "Vržem kocko. Koliko izidov je deljivih s 3?", "Rolling a dice: outcomes divisible by 3?"), 2, [3, 1, 6]],
    ]);
    return nq(ctx, P[0], P[1], P[2]);
  }
  const ctxs = t === 1 ? ["die", "die", "coin"] : ["die", "bag", "coin"];
  const c = pick(ctxs);
  const [list, head] =
    c === "die" ? [DIE, L(ctx, "Vržem kocko (1–6).", "I roll a dice (1–6).")] : c === "bag" ? [BAG, L(ctx, "Vreča: rdeče in modre kroglice.", "A bag has red and blue balls.")] : [COIN, L(ctx, "Vržem kovanec.", "I toss a coin.")];
  const cls = t === 1 ? pick([0, 2]) : pick([0, 1, 2]);
  const ask = [L(ctx, "Kaj je nemogoče?", "Which is impossible?"), L(ctx, "Kaj je mogoče, a ne gotovo?", "Possible, not certain?"), L(ctx, "Kaj je gotovo?", "Which is certain?")][cls];
  const good = list.filter((e) => e[2] === cls), bad = list.filter((e) => e[2] !== cls);
  if (!good.length || bad.length < 3) return nq(ctx, L(ctx, "Vržem kocko. Koliko je vseh izidov?", "Rolling a dice: how many outcomes?"), 6, [1, 2, 12]);
  const e = pick(good), nm = (x) => L(ctx, x[0], x[1]);
  return choice(`${head} ${ask}`, nm(e), shuffle(bad).slice(0, 3).map(nm));
});

// =====================================================================
// ZAPOREDJA (sq)
// =====================================================================
const SH = ["○", "△", "□", "◇", "●", "▲"];
def("m_pattern", "sq", 1, "○△○", "Vzorci", "Patterns", (t, ctx) => {
  if (Math.random() < 0.5) {
    const motifs = t === 1 ? [[0, 1], [0, 1, 2]] : t === 2 ? [[0, 0, 1], [0, 1, 1], [0, 1, 2]] : [[0, 0, 1, 1], [0, 1, 1, 2], [0, 1, 2, 1], [0, 0, 1, 2]];
    const m = pick(motifs), sh = shuffle(SH).slice(0, 3);
    const len = m.length * 2 + R(0, m.length - 1);
    const seq = Array.from({ length: len + 1 }, (_, i) => sh[m[i % m.length]]);
    const a = seq[len];
    return choice(`${seq.slice(0, len).join(" ")} ?`, a, [...sh.filter((s) => s !== a), ...shuffle(SH.filter((s) => !sh.includes(s))).slice(0, 2)]);
  }
  let start, d;
  if (t === 1) {
    d = 1;
    start = R(0, 15);
  } else if (t === 2) {
    d = pick([2, -1, 2]);
    start = d > 0 ? R(0, 10) : R(8, 20);
  } else {
    d = pick([-2, 2, 3, 5, -5]);
    start = d === -2 ? R(12, 20) : d === 5 ? 0 : d === -5 ? 20 : R(1, 6);
  }
  const s = [0, 1, 2, 3].map((i) => start + i * d);
  const a = start + 4 * d;
  return nq(ctx, `${s.join(", ")}, ?`, a, [a + d, a - d, a + 1 === a + d ? a + 2 : a + 1, s[3]]);
});

def("m_skip", "sq", 2, "+5", "Štetje po 2, 5, 10", "Counting in 2s, 5s and 10s", (t, ctx) => {
  if (t === 1) {
    const d = pick([2, 5, 10]), start = d * R(0, 5);
    const s = [0, 1, 2, 3].map((i) => start + i * d), a = start + 4 * d;
    return nq(ctx, `${s.join(", ")}, ?`, a, [a + 1, a + d, s[3] + 1, a - 1]);
  }
  if (t === 2) {
    const d = pick([2, 5, 10]), back = Math.random() < 0.5;
    const start = back ? R(50, 99) : R(1, 50);
    const s = [0, 1, 2, 3].map((i) => start + (back ? -i : i) * d), a = start + (back ? -4 : 4) * d;
    return nq(ctx, `${s.join(", ")}, ?`, a, [back ? a + 2 * d : a - 2 * d, a + 1, a - 1, back ? a - d : a + d]);
  }
  const k = R(0, 2);
  if (k === 0) {
    const d = pick([3, 4]), back = Math.random() < 0.4, start = back ? d * R(5, 10) : d * R(0, 5);
    const s = [0, 1, 2, 3].map((i) => start + (back ? -i : i) * d), a = start + (back ? -4 : 4) * d;
    return nq(ctx, `${s.join(", ")}, ?`, a, [back ? a - d : a + d, a + 1, a - 1, a + 2, back ? a + 2 * d : a - 2 * d]);
  }
  const d = pick([2, 5, 10, 3, 4]), start = R(1, 40);
  const s = [0, 1, 2, 3].map((i) => start + i * d), miss = R(1, 2);
  const shown = s.map((x, i) => (i === miss ? "?" : x)).join(", ");
  return nq(ctx, shown, s[miss], [s[miss] + 1, s[miss] - 1, s[miss] + d, s[miss] - d]);
});

export const AREAS = [["me", { sl: "Merjenje", en: "Measurement" }, "#06b6d4"]];
export const CONCEPTS = C;
