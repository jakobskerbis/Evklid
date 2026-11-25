// Neodvisno preverjanje odgovorov maturitetnih generatorjev MAT (revizija #6). scripts/preveri-generatorje.js
// preveri le, da naloga sprejme svoj odgovor, zato napačna formula v generatorju tam ne pade. Tu:
// 1) za vse generatorje matura-mat-ss* preračunamo vsak čisto številski korak rešitve (test/matura-koraki-pomoc.js);
// 2) za družine nalog odgovor izračunamo znova iz podatkov naloge, z lastno formulo, in ga primerjamo z ocenjenim:
//    Bernoullijevo zaporedje (binomska verjetnost), srednje vrednosti (povprečje, mediana, modus), Heronova formula
//    s polmeroma R in r, anuitete in sedanja vrednost, drugi odvod (vrednost, prevoj, vrsta točke, konveksnost) ter
//    predznak korelacije. Podatke beremo iz data.given (vsako število iz podatkov je tudi v besedilu, test/generators).
import test from "node:test";
import assert from "node:assert/strict";
import { MATURA_MAT, naloga, neskladni, roundHalfUp } from "./matura-koraki-pomoc.js";

const SEEDS = 40;
const LEVELS = [1, 2, 3];

// ---------- branje podatkov ----------
// »p = 0{,}7«, »G_0 = 6500\ \text{€}«, »p = 2\ \%« → { p: 0.7, G_0: 6500, ... }; seznami »x_i = 8, 29, 34« → [8, 29, 34].
const num = (s) => Number(String(s).replace(/\{,\}/g, ".").replace(/\\[,;!]|\\ /g, "").replace(/\\text\{[^}]*\}|\\mathrm\{[^}]*\}|\\%|%|€/g, "").replace(/−/g, "-").trim());
function podatki(t) {
  const d = {};
  for (const gv of t.data?.given || []) {
    const m = String(gv).match(/^\s*([^=]+?)\s*=\s*(.+)$/);
    if (!m) continue;
    const key = m[1].replace(/\s+/g, "");
    const raw = m[2];
    if (/^\s*-?\d[\d{},.\s]*,\s*-?\d/.test(raw.replace(/\{,\}/g, "#"))) d[key] = raw.split(/,\s+/).map(num);
    else d[key] = num(raw);
  }
  return d;
}
const find = (t) => String(t.data?.find?.[0] ?? "");

// Polinom iz TeX: »-3x^3 + x^2 + 6x + 6« → koeficienti po potencah { 3: -3, 2: 1, 1: 6, 0: 6 }.
function polinom(tex, v = "x") {
  const s = tex.replace(/\s+/g, "").replace(/\^\{(\d+)\}/g, "^$1").replaceAll(v, "x");
  const terms = s.match(/[+-]?[^+-]+/g);
  if (!terms) return null;
  const c = {};
  for (const term of terms) {
    const m = term.match(/^([+-]?)(\d+(?:\.\d+)?)?(x(?:\^(\d+))?)?$/);
    if (!m || (!m[2] && !m[3])) return null;
    const k = m[3] ? (m[4] ? Number(m[4]) : 1) : 0;
    c[k] = (c[k] || 0) + (m[1] === "-" ? -1 : 1) * (m[2] ? Number(m[2]) : 1);
  }
  return c;
}
const odvod = (c) => Object.fromEntries(Object.entries(c).filter(([k]) => k > 0).map(([k, v]) => [k - 1, v * k]));
const vrednost = (c, x) => Object.entries(c).reduce((s, [k, v]) => s + v * x ** k, 0);
const stopnja = (c) => Math.max(...Object.keys(c).map(Number).filter((k) => c[k] !== 0));

// ---------- primerjava z ocenjenim odgovorom ----------
function enak(t, mine) {
  const a = t.answer;
  if (a.type === "fraction") return Math.abs(a.num / a.den - mine) < 1e-9 * Math.max(1, Math.abs(mine));
  if (a.type !== "number") return false;
  if (a.decimals != null) return Math.abs(roundHalfUp(a.value, a.decimals) - roundHalfUp(mine, a.decimals)) < 10 ** -a.decimals / 2;
  return Math.abs(a.value - mine) < 1e-9 * Math.max(1, Math.abs(mine));
}
const izbrana = (t) => (t.answer.type === "choice" ? String(t.answer.options[t.answer.index]) : null);

// ---------- družine: vsaka vrne null (naloga ni iz te družine) ali { ok, zakaj } ----------
const C = (n, k) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
};
const binom = (n, p, k) => C(n, k) * p ** k * (1 - p) ** (n - k);

function bernoulli(t) {
  const f = find(t);
  const d = podatki(t);
  if (!/^P_\{?\d+\}?\(\d+\)$|^P\(X \\(ge|le) \d+\)$|z največjo|^n$/.test(f) || !Number.isInteger(d.n) && f !== "n") return null;
  // Verjetnost uspeha: dana p, 1/m (ugibanje med m odgovori), poštena kocka (šestica) ali kovanec.
  let p = d.p;
  if (p == null && d.m) p = 1 / d.m;
  if (p == null && /kock/.test(t.text) && /šestic/.test(t.text)) p = 1 / 6;
  if (p == null && /kovan/.test(t.text)) p = 1 / 2;
  if (p == null || !(p > 0 && p < 1)) return null;
  const n = d.n;
  let mine;
  let m;
  if ((m = f.match(/^P_\{?(\d+)\}?\((\d+)\)$/))) {
    if (!/natanko/.test(t.text) || Number(m[1]) !== n) return { ok: false, zakaj: `»natanko« ali n v besedilu: ${f}` };
    mine = binom(n, p, Number(m[2]));
  } else if ((m = f.match(/^P\(X \\ge (\d+)\)$/))) {
    if (!/vsaj/.test(t.text)) return { ok: false, zakaj: "»vsaj« ni v besedilu" };
    mine = 1;
    for (let k = 0; k < Number(m[1]); k++) mine -= binom(n, p, k);
  } else if ((m = f.match(/^P\(X \\le (\d+)\)$/))) {
    if (!/največ/.test(t.text)) return { ok: false, zakaj: "»največ« ni v besedilu" };
    mine = 0;
    for (let k = 0; k <= Number(m[1]); k++) mine += binom(n, p, k);
  } else if (/z največjo/.test(f)) {
    let best = 0;
    for (let k = 1; k <= n; k++) if (binom(n, p, k) > binom(n, p, best) + 1e-12) best = k;
    mine = best;
  } else if (f === "n" && d.P) {
    // Najmanjši n z 1 - (1 - p)^n > P.
    mine = 1;
    while (1 - (1 - p) ** mine <= d.P) mine++;
  } else return null;
  return { ok: enak(t, mine), zakaj: `p = ${p}, n = ${n}: ${mine}` };
}

function sredine(t) {
  const f = find(t);
  const d = podatki(t);
  const vsota = (xs) => xs.reduce((s, x) => s + x, 0);
  const povp = (xs) => vsota(xs) / xs.length;
  let mine;
  if (f === "\\bar x" && Array.isArray(d.x_i)) mine = povp(d.x_i);
  else if (f === "\\mathrm{Me}" && Array.isArray(d.x_i)) {
    const s = [...d.x_i].sort((a, b) => a - b);
    const h = s.length >> 1;
    mine = s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
  } else if (/^\\mathrm\{Mo\}$/.test(f) && Array.isArray(d.x_i)) {
    const cnt = new Map();
    for (const x of d.x_i) cnt.set(x, (cnt.get(x) || 0) + 1);
    const max = Math.max(...cnt.values());
    const mods = [...cnt].filter(([, c]) => c === max).map(([x]) => x);
    if (mods.length !== 1) return { ok: false, zakaj: `modus ni enoličen: ${mods}` };
    mine = mods[0];
  } else if (/^x_\{?\d+\}?$/.test(f) && Array.isArray(d.x_i) && d["\\barx"] != null && d.N) {
    if (d.x_i.length !== d.N - 1) return { ok: false, zakaj: "znanih podatkov ni N - 1" };
    mine = d.N * d["\\barx"] - vsota(d.x_i);
  } else if (f === "\\bar x_A - \\bar x_B" && Array.isArray(d.x_A) && Array.isArray(d.x_B)) mine = povp(d.x_A) - povp(d.x_B);
  else return null;
  if (d.N && Array.isArray(d.x_i) && !/^x_/.test(f) && d.x_i.length !== d.N) return { ok: false, zakaj: "N se ne ujema s številom podatkov" };
  return { ok: enak(t, mine), zakaj: `${f} = ${mine}` };
}

function heron(t) {
  if (!t.generator.endsWith("heronova-formula")) return null;
  const f = find(t).replace(/\s+/g, "");
  const d = podatki(t);
  const H = (a, b, c) => {
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  };
  const abc = d.a && d.b && d.c;
  let mine;
  if (f === "S" && abc) mine = H(d.a, d.b, d.c);
  else if (f === "R" && abc) {
    const S = d.S ?? H(d.a, d.b, d.c);
    if (d.S != null && Math.abs(d.S - H(d.a, d.b, d.c)) > 1e-6 * d.S) return { ok: false, zakaj: `dana ploščina ${d.S} ni Heronova ${H(d.a, d.b, d.c)}` };
    mine = (d.a * d.b * d.c) / (4 * S);
  } else if (f === "r" && d.S && d.s) mine = d.S / d.s;
  else if (f === "r" && abc) mine = H(d.a, d.b, d.c) / ((d.a + d.b + d.c) / 2);
  else if (f === "v" && abc && /najdaljš/.test(t.text)) mine = (2 * H(d.a, d.b, d.c)) / Math.max(d.a, d.b, d.c);
  else if (/^r\\\[\\mathrm\{cm\}\]$/.test(f) && d.o && d.S) mine = ((2 * d.S) / d.o) * 100;
  else if (f === "R-r" && abc) {
    const S = H(d.a, d.b, d.c);
    mine = (d.a * d.b * d.c) / (4 * S) - S / ((d.a + d.b + d.c) / 2);
  } else if (f === "S-\\pir^2" && abc) {
    const S = H(d.a, d.b, d.c);
    mine = S - Math.PI * (S / ((d.a + d.b + d.c) / 2)) ** 2;
  } else if (f === "c" && d.S && d.r && d.a && d.b) {
    mine = (2 * d.S) / d.r - d.a - d.b;
    if (Math.abs(H(d.a, d.b, mine) - d.S) > 1e-6 * d.S) return { ok: false, zakaj: `stranica ${mine} ne da ploščine ${d.S}` };
  } else return null;
  return { ok: enak(t, mine), zakaj: `${f} = ${mine}` };
}

function anuitete(t) {
  if (!t.generator.endsWith("anuitete")) return null;
  const f = find(t);
  const d = podatki(t);
  if (d.p == null) return null;
  const q = 1 + d.p / 100;
  const c2 = (x) => roundHalfUp(x, 2);
  let mine;
  let m;
  if (f === "a" && d.G_0 && d.n) mine = (d.G_0 * q ** d.n * (q - 1)) / (q ** d.n - 1);
  else if (f === "R_1" && d.G_0 && d.a) mine = d.a - c2((d.G_0 * d.p) / 100);
  else if ((m = f.match(/^([oR])_(\d+)$/)) && d.G_0 && d.a) {
    // Amortizacijski načrt, vsak znesek zaokrožen na cent.
    let D = d.G_0;
    let o;
    let R;
    for (let i = 1; i <= Number(m[2]); i++) {
      o = c2((D * d.p) / 100);
      R = c2(d.a - o);
      D = c2(D - R);
    }
    mine = m[1] === "o" ? o : R;
  } else if (f === "o" && d.G_0 && d.n && d.a) mine = d.n * d.a - d.G_0;
  else if (f === "G_0" && d.G && d.k) mine = d.G / q ** d.k;
  else if (f === "G_0" && d.a && d.n) mine = (d.a * (q ** d.n - 1)) / ((q - 1) * q ** d.n);
  else if ((m = f.match(/^D_\{(\d+)\}$/)) && d.G_0 && d.a) {
    const k = Number(m[1]);
    mine = d.G_0 * q ** k - (d.a * (q ** k - 1)) / (q - 1);
  } else if (f === "X" && d.G_1 && d.G_2 && d.t != null) mine = d.G_1 * q ** (d.t - d.t_1) + d.G_2 / q ** (d.t_2 - d.t);
  else if (f === "x" && d.G_0 && d.t_1 && d.t_2) mine = d.G_0 / (q ** -d.t_1 + q ** -d.t_2);
  else return null;
  return { ok: enak(t, mine), zakaj: `${f} = ${mine}` };
}

function drugiOdvod(t) {
  if (!t.generator.endsWith("drugi-odvod")) return null;
  const f = find(t);
  const fx = (t.data?.given || []).find((g) => /^f\(x\) = /.test(g));
  const f2x = (t.data?.given || []).find((g) => /^f''\(x\) = /.test(g));
  const d = podatki(t);
  const P = fx ? polinom(fx.slice(7)) : null;
  const P2 = f2x ? polinom(f2x.slice(9)) : P && odvod(odvod(P));
  const ch = izbrana(t);
  // f(x) = x^3 + ax^2 + bx + c s prevojem v x_0 in tangento s smernim koeficientom k: f''(x_0) = 0 da a = -3x_0,
  // f'(x_0) = 3x_0^2 + 2a x_0 + b = k da b = k + 3x_0^2.
  if (f === "b" && d.x_0 != null && d.k != null && /f\(x\) = x\^3 \+ ax\^2 \+ bx/.test(t.text) && /prevoj/.test(t.text)) {
    return { ok: enak(t, d.k + 3 * d.x_0 ** 2), zakaj: `b = ${d.k + 3 * d.x_0 ** 2}` };
  }
  // Največja hitrost pri s(t), t ≥ 0: v = s' je največja v ničli v' = s'' ali pri t = 0.
  const st = (t.data?.given || []).find((g) => /^s\(t\) = /.test(g));
  if (f === "v_{\\max}" && st) {
    const S = polinom(st.slice(7), "t");
    if (!S || stopnja(S) !== 3) return null;
    const V = odvod(S);
    const A = odvod(V);
    const tz = -(A[0] || 0) / A[1];
    const mine = Math.max(vrednost(V, 0), tz > 0 ? vrednost(V, tz) : -Infinity);
    return { ok: enak(t, mine), zakaj: `v_max = ${mine}` };
  }
  if (!P2) return null;
  let m;
  if ((m = f.match(/^f''\((-?\d+)\)$/))) return { ok: enak(t, vrednost(P2, Number(m[1]))), zakaj: `f''(${m[1]}) = ${vrednost(P2, Number(m[1]))}` };
  // Ničle f'' (stopnje 1 ali 2) po velikosti.
  const nicle = () => {
    const a = P2[2] || 0;
    const b = P2[1] || 0;
    const c = P2[0] || 0;
    if (!a) return [-c / b];
    const D = b * b - 4 * a * c;
    return D > 0 ? [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((x, y) => x - y) : [];
  };
  if (f === "x_0" && P && stopnja(P) === 3) return { ok: enak(t, nicle()[0]), zakaj: `prevoj x = ${nicle()[0]}` };
  if (f === "y_0" && P) {
    const xs = nicle();
    const x0 = xs[xs.length - 1]; // pri kvartiki »prevoj z večjo absciso«
    if (stopnja(P) === 4 && !/večjo absciso/.test(t.text)) return { ok: false, zakaj: "kateri prevoj?" };
    return { ok: enak(t, vrednost(P, x0)), zakaj: `prevoj (${x0}, ${vrednost(P, x0)})` };
  }
  if (/konveksnost/.test(f) && d.x_1 != null) {
    const v = vrednost(P2, d.x_1);
    const want = v > 0 ? "konveksen" : v < 0 ? "konkaven" : "ima prevoj";
    return { ok: ch === want, zakaj: `f''(${d.x_1}) = ${v} → ${want}, izbrano ${ch}` };
  }
  if (/vrsta točke/.test(f) && P && d.x_0 != null) {
    if (Math.abs(vrednost(odvod(P), d.x_0)) > 1e-9) return { ok: false, zakaj: `f'(${d.x_0}) ≠ 0: točka ni stacionarna` };
    const v = vrednost(P2, d.x_0);
    const want = v > 0 ? "lokalni minimum" : v < 0 ? "lokalni maksimum" : "test z drugim odvodom ne odloči";
    return { ok: ch === want, zakaj: `f''(${d.x_0}) = ${v} → ${want}, izbrano ${ch}` };
  }
  if (/interval konveksnosti/.test(f) && P && stopnja(P) === 3) {
    const x0 = nicle()[0];
    const want = P2[1] > 0 ? `(${x0}, \\infty)` : `(-\\infty, ${x0})`;
    return { ok: ch?.replace(/\s+/g, "") === want.replace(/\s+/g, ""), zakaj: `f'' > 0 na ${want}, izbrano ${ch}` };
  }
  return null;
}

function korelacija(t) {
  const f = find(t);
  if (!/povezanost|pravilna interpretacija/.test(f)) return null;
  const d = podatki(t);
  const ch = izbrana(t);
  if (Array.isArray(d.x) && Array.isArray(d.y)) {
    const n = d.x.length;
    const mx = d.x.reduce((s, v) => s + v, 0) / n;
    const my = d.y.reduce((s, v) => s + v, 0) / n;
    let sxy = 0;
    let sxx = 0;
    let syy = 0;
    for (let i = 0; i < n; i++) {
      sxy += (d.x[i] - mx) * (d.y[i] - my);
      sxx += (d.x[i] - mx) ** 2;
      syy += (d.y[i] - my) ** 2;
    }
    const r = sxy / Math.sqrt(sxx * syy);
    // Široke meje: odgovor mora biti jasen, ne na meji med »šibko« in »ni«.
    const want = r >= 0.5 ? "pozitivna" : r <= -0.5 ? "negativna" : Math.abs(r) < 0.35 ? "ni povezanosti" : null;
    return { ok: want != null && ch === want, zakaj: `r = ${r.toFixed(3)} → ${want}, izbrano ${ch}` };
  }
  if (typeof d.r === "number") {
    if (Math.abs(d.r) < 0.3) return { ok: /ni povezan|povezanosti (skoraj )?ni/.test(ch), zakaj: `r = ${d.r}, izbrano ${ch}` };
    const neg = /negativn/.test(ch);
    const poz = /pozitivn/.test(ch);
    const ok = d.r < 0 ? neg && !poz : poz && !neg;
    const mocna = Math.abs(d.r) >= 0.7 ? /močna/.test(ch) : true;
    return { ok: ok && mocna, zakaj: `r = ${d.r}, izbrano ${ch}` };
  }
  return null;
}

const DRUZINE = { bernoulli, sredine, heron, anuitete, drugiOdvod, korelacija };
const DOM = { bernoulli: "bernoulli", sredine: "statisticna-naloga", heron: "heronova-formula", anuitete: "anuitete", drugiOdvod: "drugi-odvod", korelacija: "statisticna-naloga" };

// Vse naloge enkrat (~40 semen × 3 ravni × vsi generatorji).
const NALOGE = [];
for (const g of MATURA_MAT) for (const level of LEVELS) for (let seed = 1; seed <= SEEDS; seed++) {
  const t = naloga(g, level, seed);
  if (t) NALOGE.push(t);
}
const kje = (t) => `${t.generator} L${t.level} s${t.seed}`;

test("vsi MAT matura generatorji: čisto številski koraki rešitev se izidejo", () => {
  assert.ok(NALOGE.length > 3500, `${NALOGE.length} nalog`);
  assert.ok(new Set(NALOGE.map((t) => t.generator)).size === MATURA_MAT.length, "vsak generator ima naloge");
  const napake = NALOGE.flatMap((t) => neskladni(t).map((s) => `${kje(t)}: ${s.tex} (izračun ${s.a.value}, izpisano ${s.b.value})`));
  assert.deepEqual(napake.slice(0, 20), [], `${napake.length} neskladnih korakov`);
});

for (const [ime, fn] of Object.entries(DRUZINE)) {
  test(`neodvisni izračun odgovora: ${ime}`, (tc) => {
    const napake = [];
    let n = 0;
    const gens = new Set();
    const brez = new Map(); // naloge domačega generatorja družine, ki jih preverjanje ne zajame (po iskani količini)
    for (const t of NALOGE) {
      const r = fn(t);
      if (!r) {
        if (t.generator.endsWith(DOM[ime]) && !Object.values(DRUZINE).some((g) => g(t))) brez.set(find(t), (brez.get(find(t)) || 0) + 1);
        continue;
      }
      // Samopreverjanje: pokvarjen odgovor (drugo število, druga možnost) mora pasti.
      const a = t.answer;
      const pokvarjen = a.type === "number" ? { ...a, value: a.value * 1.07 + 1 } : a.type === "fraction" ? { ...a, num: a.num + 1 } : { ...a, index: (a.index + 1) % a.options.length };
      if (fn({ ...t, answer: pokvarjen }).ok) napake.push(`${kje(t)}: pokvarjen odgovor ${JSON.stringify(pokvarjen.value ?? pokvarjen.num ?? pokvarjen.index)} je sprejet`);
      n++;
      gens.add(t.generator.replace(/^mat-ss\d-(geo-)?matura-/, ""));
      if (!r.ok) napake.push(`${kje(t)}: ${r.zakaj}; ocenjeno ${JSON.stringify({ ...t.answer, mistakes: undefined, why: undefined })}`);
    }
    // Preverjanje mora res zajeti družino (sprememba zapisa podatkov ga ne sme tiho izklopiti).
    tc.diagnostic(`${ime}: ${n} nalog (${[...gens].join(", ")}); ne zajame: ${JSON.stringify(Object.fromEntries(brez))}`);
    assert.ok(n >= 30, `${ime}: preverjenih le ${n} nalog`);
    assert.deepEqual(napake.slice(0, 15), [], `${ime}: ${napake.length} od ${n} napačnih`);
  });
}

test("branje podatkov in polinomov", () => {
  assert.deepEqual(polinom("-3x^3 + x^2 + 6x + 6"), { 3: -3, 2: 1, 1: 6, 0: 6 });
  assert.deepEqual(polinom("-24x"), { 1: -24 });
  assert.deepEqual(podatki({ data: { given: ["p = 0{,}7", "G_0 = 6500\\ \\text{€}", "x_i = 8, 29, 34", "\\bar x = 19{,}5", "p = 2{,}5\\ \\%"] } }), {
    p: 2.5,
    G_0: 6500,
    x_i: [8, 29, 34],
    "\\barx": 19.5,
  });
  // Bernoulli: napačen odgovor pade.
  const t = { generator: "x", text: "… natanko …", data: { given: ["n = 4", "k = 2", "p = 0{,}5"], find: ["P_{4}(2)"] }, answer: { type: "number", value: 0.375, decimals: 4 } };
  assert.equal(bernoulli(t).ok, true);
  assert.equal(bernoulli({ ...t, answer: { ...t.answer, value: 0.25 } }).ok, false);
});
