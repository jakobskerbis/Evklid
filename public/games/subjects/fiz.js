// Pojmi za igre: fiz (glej README.md v tej mapi).
// Fizika: OŠ 8.–9. razred in gimnazija 1.–4. letnik. Kjer gre, so naloge računske (podatki izbrani tako,
// da je rezultat lep), pri pojmovnih vsebinah pa banka vprašanj. g = 10 m/s² je vedno zapisan v vprašanju.

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
const C = [];
const def = (id, area, year, sl, en, gen) => C.push({ id, area, year, name: { sl, en }, gen });

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
// »lepo« število: največ 4 veljavna mesta, ne preveliko in ne premajhno
const nice = (x) =>
  Number.isFinite(x) && Math.abs(x) >= 1e-6 && Math.abs(x) < 1e9 && Math.abs(x - Number(x.toPrecision(4))) <= 1e-9 * Math.abs(x);
// Številski odgovor z enoto; napačni: števila (tipične napake) ali že oblikovani nizi (npr. napačna enota).
function nq(ctx, q, a, unit, ws, opt = {}) {
  const f = (x) => ctx.num(x) + (unit ? " " + unit : "");
  // napačno število mora biti lepo, različno od pravilnega in izpisljivo brez zaokroževanja (6 decimalk)
  const ok = (x) => nice(x) && (opt.neg || x > 0) && Math.abs(x - a) > 1e-9 * Math.max(1, Math.abs(a)) && Math.abs(Math.round(x * 1e6) / 1e6 - x) <= 1e-9 * Math.abs(x);
  const W = ws.filter((x) => typeof x !== "number" || ok(x)).map((x) => (typeof x === "number" ? f(x) : x));
  const F = [a * 10, a / 10, a * 2, a / 2, a * 100, a / 100, a * 3, a + 1].filter(ok).map(f);
  return out(q, f(a), W, F);
}
// Banka vprašanj: vnos [stopnja, "vprašanje|pravilno|napačno|napačno|…" (sl), isto (en)].
// Stopnja 1 vzame vnose 1; stopnja 2 in 3 večinoma svoje, včasih (30 %) še z nižje stopnje.
function bank(items) {
  return (tier, ctx) => {
    let lv = tier;
    if (tier > 1 && Math.random() < 0.3) lv = tier - 1;
    let pool = items.filter((it) => it[0] === lv);
    if (!pool.length) pool = items.filter((it) => it[0] <= tier);
    const it = pick(pool);
    const [q, a, ...ws] = (ctx.lang === "sl" ? it[1] : it[2]).split("|");
    return out(q, a, ws);
  };
}

// =====================================================================
// MERJENJE IN ENOTE
// =====================================================================
const PRE_BASIC = [
  ["km", "m", 1000], ["m", "cm", 100], ["m", "mm", 1000], ["cm", "mm", 10], ["dm", "cm", 10], ["kg", "g", 1000],
  ["g", "mg", 1000], ["t", "kg", 1000], ["L", "mL", 1000], ["h", "min", 60], ["min", "s", 60], ["kW", "W", 1000],
];
const PRE_HARD = [
  ["h", "s", 3600], ["m²", "cm²", 10000], ["m²", "dm²", 100], ["m³", "L", 1000], ["m³", "dm³", 1000], ["dm³", "cm³", 1000],
  ["MW", "kW", 1000], ["MJ", "J", 1000000], ["mm", "µm", 1000], ["km", "cm", 100000], ["GW", "MW", 1000], ["s", "ms", 1000],
  ["cm³", "mL", 1], ["dm³", "L", 1], ["kN", "N", 1000], ["MPa", "kPa", 1000],
];
def("f_prefix", "fz_mer", 8, "Predpone in pretvarjanje enot", "Unit prefixes and conversions", (t, ctx) => {
  const [A, B, f] = pick(t === 3 ? PRE_HARD : PRE_BASIC);
  const typ = f === 60 || f === 3600 ? [100, 1000, 10] : f === 1 ? [10, 100, 1000, 0.1] : [];
  if (t === 1 || f === 1) return nq(ctx, `1 ${A} = ? ${B}`, f, "", [f * 10, f / 10, f * 100, ...typ]);
  const v = pick(f === 60 ? [2, 3, 1.5, 2.5, 0.5, 4, 10] : [2, 3, 5, 1.5, 2.5, 0.5, 0.2, 0.25, 0.75, 12, 25]);
  if (Math.random() < 0.5) return nq(ctx, `${ctx.num(v)} ${A} = ? ${B}`, v * f, "", [v * f * 10, v * f / 10, v * f / 100, v / f, ...(f === 60 || f === 3600 ? [v * 100, v * 1000] : [])]);
  return nq(ctx, `${ctx.num(v * f)} ${B} = ? ${A}`, v, "", [v * 10, v / 10, v * 100, v / 100, ...(f === 60 ? [(v * 60) / 100] : [])]);
});

// [enota, količina sl, količina en, stopnja]; enot, ki si jih deli več količin (J, N), ne sprašujemo obratno.
const UNITS = [
  ["N", "sila", "force", 1, "sile"], ["kg", "masa", "mass", 1, "mase"], ["s", "čas", "time", 1, "časa"], ["m", "dolžina", "length", 1, "dolžine"],
  ["m/s", "hitrost", "speed", 1, "hitrosti"], ["J", "energija", "energy", 1, "energije"], ["W", "moč", "power", 1, "moči"], ["J", "delo", "work", 1, "dela"],
  ["N", "teža", "weight", 1, "teže"], ["m³", "prostornina", "volume", 1, "prostornine"], ["K", "temperatura", "temperature", 1, "temperature"],
  ["Pa", "tlak", "pressure", 2, "tlaka"], ["kg/m³", "gostota", "density", 2, "gostote"], ["m/s²", "pospešek", "acceleration", 2, "pospeška"],
  ["V", "napetost", "voltage", 2, "napetosti"], ["A", "električni tok", "electric current", 2, "električnega toka"], ["Ω", "upor", "resistance", 2, "upora"],
  ["Hz", "frekvenca", "frequency", 2, "frekvence"], ["J", "toplota", "heat", 2, "toplote"], ["m²", "ploščina", "area", 2, "ploščine"],
  ["C", "naboj", "charge", 3, "naboja"], ["Nm", "navor", "torque", 3, "navora"], ["kg·m/s", "gibalna količina", "momentum", 3, "gibalne količine"],
  ["J/(kg·K)", "specifična toplota", "specific heat", 3, "specifične toplote"], ["T", "gostota mag. polja", "magnetic field", 3, "gostote magnetnega polja"],
];
const UNIT_POOL = ["N", "kg", "s", "m", "m/s", "J", "W", "m³", "K", "Pa", "kg/m³", "m/s²", "V", "A", "Ω", "Hz", "m²", "C", "kg·m/s"];
def("f_units", "fz_mer", 8, "Fizikalne količine in enote", "Quantities and units", (t, ctx) => {
  const lv = t === 1 ? [1] : t === 2 ? [1, 2] : [2, 3];
  const it = pick(UNITS.filter((u) => lv.includes(u[3])));
  const [u0, sl, en, , slGen] = it;
  // enota naboja: v slovenskih učbenikih As, v angleščini C
  const loc = (x) => (x === "C" && ctx.lang === "sl" ? "As" : x);
  const u = loc(u0);
  // obratno vprašanje le za enote, ki pripadajo eni sami količini v seznamu
  const unique = UNITS.filter((x) => x[0] === u0).length === 1;
  if (t > 1 && unique && Math.random() < 0.5) {
    const others = UNITS.filter((x) => x[0] !== u0 && !(u0 === "Nm" && x[0] === "J"));
    const names = others.map((x) => (ctx.lang === "sl" ? x[1] : x[2]));
    return out(L(ctx, `Količina z enoto ${u}?`, `Quantity measured in ${u}?`), L(ctx, sl, en), shuffle(names).slice(0, 6));
  }
  // napačne enote; brez enakovrednih zapisov (C = As, J = Nm = Ws)
  const pool = UNIT_POOL.map(loc).filter((x) => x !== u && !(u === "J" && x === "Nm") && !(u === "Nm" && x === "J"));
  const near = { N: ["kg", "J", "Pa"], kg: ["N", "kg/m³", "m³"], "m/s": ["m/s²", "km", "s/m"], "m/s²": ["m/s", "m²/s", "N"], W: ["J", "Wh", "V"], J: ["W", "N", "Pa"], Pa: ["N", "N·m²", "J"], "kg/m³": ["kg·m³", "m³/kg", "kg"], V: ["A", "W", "Ω"], A: ["V", "Ω", "W"], Ω: ["V", "A", "W"], K: ["J", "W", "Pa"] };
  return out(L(ctx, `Enota ${slGen}?`, `SI unit of ${en}?`), u, [...(near[u] || []), ...shuffle(pool).slice(0, 4)]);
});

def("f_conv", "fz_mer", 10, "Pretvarjanje sestavljenih enot", "Converting compound units", (t, ctx) => {
  const kind = t === 1 ? 0 : t === 2 ? pick([1, 2]) : pick([3, 4, 5, 2]);
  if (kind === 0) {
    const ms = pick([5, 10, 15, 20, 25, 30, 35, 40]), kmh = ms * 3.6;
    return nq(ctx, `${ctx.num(kmh)} km/h = ? m/s`, ms, "", [kmh * 3.6, kmh / 36, kmh / 60, kmh / 10]);
  }
  if (kind === 1) {
    const ms = pick([2, 5, 10, 15, 20, 25, 30, 50]), kmh = ms * 3.6;
    return nq(ctx, `${ctx.num(ms)} m/s = ? km/h`, kmh, "", [ms / 3.6, ms * 10, ms * 36, ms * 60]);
  }
  if (kind === 2) {
    const g = pick([0.8, 1, 1.2, 2.7, 7.8, 8.9, 11.3, 13.6, 19.3, 0.9]);
    return nq(ctx, `${ctx.num(g)} g/cm³ = ? kg/m³`, g * 1000, "", [g * 10, g * 100, g * 1e6, g / 1000]);
  }
  if (kind === 3) {
    const n = pick([1, 2, 3, 5, 10, 0.5]);
    return nq(ctx, `${ctx.num(n)} kWh = ? MJ`, n * 3.6, "", [n, n * 3600, n * 0.36, n * 36, n * 60]);
  }
  if (kind === 4) {
    const cm2 = pick([20, 50, 150, 400, 2500, 5]);
    return nq(ctx, `${ctx.num(cm2)} cm² = ? m²`, cm2 / 10000, "", [cm2 / 100, cm2 / 1000, cm2 / 1e6, cm2 * 100]);
  }
  const ml = pick([250, 500, 750, 200, 1500, 40]);
  return nq(ctx, `${ctx.num(ml)} mL = ? m³`, ml / 1e6, "", [ml / 1000, ml / 1e5, ml / 1e9, ml / 1e4]);
});

// =====================================================================
// GIBANJE
// =====================================================================
def("f_speed", "fz_gib", 8, "Hitrost", "Speed", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const v = R(2, 30), tt = pick([2, 4, 5, 10, 20, 25]), s = v * tt;
    return nq(ctx, `s = ${n(s)} m, t = ${tt} s, v = ?`, v, "m/s", [s * tt, tt / s, `${n(v)} km/h`, `${n(s)} m/s`]);
  }
  if (t === 2) {
    const v = R(2, 25), tt = pick([3, 4, 5, 6, 8, 10, 12, 15]), s = v * tt;
    if (Math.random() < 0.5) return nq(ctx, `v = ${v} m/s, t = ${tt} s, s = ?`, s, "m", [v / tt, tt / v, `${n(s)} m/s`, v + tt]);
    return nq(ctx, `s = ${n(s)} m, v = ${v} m/s, t = ?`, tt, "s", [s * v, v / s, `${n(tt)} min`]);
  }
  if (Math.random() < 0.5) {
    const ms = pick([5, 10, 15, 20, 25, 30]), kmh = ms * 3.6, tt = pick([10, 20, 30, 40, 60]);
    return nq(ctx, `v = ${n(kmh)} km/h, t = ${tt} s, s = ?`, ms * tt, "m", [kmh * tt, kmh * 3.6 * tt, (kmh * tt) / 60]);
  }
  const ms = pick([5, 10, 15, 20, 25]), min = pick([1, 2, 4, 5, 10]), s = ms * 60 * min;
  return nq(ctx, `s = ${n(s / 1000)} km, t = ${min} min, v = ?`, ms, "m/s", [s / 1000 / min, s / min, ms * 3.6, (s / 1000) / (min * 60)]);
});

def("f_accel", "fz_gib", 8, "Pospešek", "Acceleration", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const a = pick([1, 2, 3, 4, 5, 6, 8]), tt = pick([2, 3, 4, 5, 10]), dv = a * tt;
    return nq(ctx, `Δv = ${dv} m/s, t = ${tt} s, a = ?`, a, "m/s²", [dv * tt, tt / dv, `${n(a)} m/s`]);
  }
  if (t === 2) {
    const a = pick([1, 2, 3, 4, 5]), tt = pick([2, 3, 4, 5, 6]), v0 = R(2, 10), v = v0 + a * tt;
    return nq(ctx, `v₀ = ${v0} m/s, v = ${v} m/s, t = ${tt} s, a = ?`, a, "m/s²", [v / tt, (v + v0) / tt, (v - v0) * tt, `${n(a)} m/s`]);
  }
  const k = R(0, 2);
  if (k === 0) {
    const ms = pick([10, 15, 20, 25, 30]), tt = pick([2, 4, 5, 10]), kmh = ms * 3.6;
    return nq(ctx, L(ctx, `0 → ${n(kmh)} km/h v ${tt} s, a = ?`, `0 → ${n(kmh)} km/h in ${tt} s, a = ?`), ms / tt, "m/s²", [kmh / tt, ms * tt, `${n(ms / tt)} m/s`]);
  }
  if (k === 1) {
    const v0 = R(2, 10), a = pick([2, 3, 4]), tt = pick([3, 4, 5, 6]);
    return nq(ctx, `v₀ = ${v0} m/s, a = ${a} m/s², t = ${tt} s, v = ?`, v0 + a * tt, "m/s", [a * tt, v0 + a, (v0 + a) * tt, v0 * a * tt]);
  }
  const a = pick([2, 4, 5]), tt = pick([2, 3, 4, 5, 6]), v0 = a * tt;
  return nq(ctx, L(ctx, `Zavira z ${v0} m/s, a = ${n(-a)} m/s². t do ustavitve?`, `Brakes from ${v0} m/s, a = ${n(-a)} m/s². Stop time?`), tt, "s", [v0 * a, a / v0, v0 - a, v0 + a]);
});

def("f_fall", "fz_gib", 9, "Prosti pad", "Free fall", (t, ctx) => {
  const G = "(g = 10 m/s²)";
  if (t === 1) {
    const tt = R(1, 6);
    return nq(ctx, L(ctx, `Prosti pad: t = ${tt} s, v = ? ${G}`, `Free fall: t = ${tt} s, v = ? ${G}`), 10 * tt, "m/s", [5 * tt * tt, 10 * tt * tt, 10 / tt]);
  }
  if (t === 2) {
    const tt = R(1, 6);
    return nq(ctx, L(ctx, `Prosti pad: t = ${tt} s, h = ? ${G}`, `Free fall: t = ${tt} s, h = ? ${G}`), 5 * tt * tt, "m", [10 * tt * tt, 10 * tt, 5 * tt]);
  }
  const tt = R(1, 6), h = 5 * tt * tt;
  if (Math.random() < 0.5) return nq(ctx, L(ctx, `Pad z višine ${h} m: t = ? ${G}`, `Fall from ${h} m: t = ? ${G}`), tt, "s", [h / 10, h / 5, 2 * tt, tt * tt]);
  return nq(ctx, L(ctx, `Pad z višine ${h} m: v ob tleh = ? ${G}`, `Fall from ${h} m: impact v = ? ${G}`), 10 * tt, "m/s", [20 * h, 10 * h, 5 * tt]);
});

def("f_uam", "fz_gib", 10, "Enakomerno pospešeno gibanje", "Uniformly accelerated motion", (t, ctx) => {
  if (t === 1) {
    const a = pick([2, 4, 6, 1, 3]), tt = pick([2, 4, 5, 6, 10]);
    return nq(ctx, `v₀ = 0, a = ${a} m/s², t = ${tt} s, s = ?`, (a * tt * tt) / 2, "m", [a * tt * tt, a * tt, (a * tt) / 2]);
  }
  if (t === 2) {
    const v0 = R(2, 10), a = pick([2, 4, 6]), tt = R(2, 5);
    const s = v0 * tt + (a * tt * tt) / 2;
    return nq(ctx, `v₀ = ${v0} m/s, a = ${a} m/s², t = ${tt} s, s = ?`, s, "m", [v0 * tt + a * tt * tt, (a * tt * tt) / 2, v0 * tt, (v0 + a * tt) * tt]);
  }
  // v² = v₀² + 2as
  const a = pick([1, 2, 4, 5]), v = pick([2, 4, 6, 8, 10, 12, 20]), s = (v * v) / (2 * a);
  if (!Number.isInteger(s * 10)) return nq(ctx, `v₀ = 0, a = 2 m/s², s = 25 m, v = ?`, 10, "m/s", [100, 50, 5]);
  if (Math.random() < 0.5) return nq(ctx, `v₀ = 0, a = ${a} m/s², s = ${ctx.num(s)} m, v = ?`, v, "m/s", [v * v, Math.sqrt(a * s), a * s, 2 * v]);
  return nq(ctx, L(ctx, `Zavira z ${v} m/s, a = ${ctx.num(-a)} m/s². Pot do ustavitve?`, `Brakes from ${v} m/s, a = ${ctx.num(-a)} m/s². Stopping distance?`), s, "m", [(v * v) / a, v / (2 * a), v / a, v * a]);
});

def("f_circ", "fz_gib", 11, "Enakomerno kroženje", "Uniform circular motion", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const [v, r] = pick([[2, 1], [2, 2], [4, 2], [6, 3], [6, 4], [4, 8], [10, 5], [8, 4], [10, 2], [6, 2], [3, 1], [12, 6]]);
    return nq(ctx, L(ctx, `v = ${v} m/s, r = ${r} m: radialni pospešek = ?`, `v = ${v} m/s, r = ${r} m: centripetal a = ?`), (v * v) / r, "m/s²", [v / r, v * v * r, v * r, (2 * v) / r]);
  }
  if (t === 2) {
    const T = pick([0.1, 0.2, 0.25, 0.5, 2, 4, 5]), N = pick([10, 20, 40]), tt = N * T;
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `${N} obratov v ${n(tt)} s, T = ?`, `${N} turns in ${n(tt)} s, T = ?`), T, "s", [N / tt, N * tt, tt]);
    return nq(ctx, L(ctx, `${N} obratov v ${n(tt)} s, ν = ?`, `${N} turns in ${n(tt)} s, f = ?`), N / tt, "Hz", [tt / N, N * tt, N]);
  }
  const m = pick([0.5, 1, 2, 4, 5]), [v, r] = pick([[2, 1], [4, 2], [6, 3], [4, 8], [10, 5], [6, 4], [8, 4], [10, 2]]);
  return nq(ctx, L(ctx, `m = ${n(m)} kg, v = ${v} m/s, r = ${r} m: radialna sila = ?`, `m = ${n(m)} kg, v = ${v} m/s, r = ${r} m: centripetal F = ?`), (m * v * v) / r, "N", [(m * v) / r, m * v * v, (v * v) / r, m * v * v * r]);
});

// =====================================================================
// SILE IN TEKOČINE
// =====================================================================
def("f_weight", "fz_sil", 8, "Teža in masa", "Weight and mass", (t, ctx) => {
  const n = ctx.num, G = "(g = 10 N/kg)";
  if (t === 1) {
    const m = pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 50, 60]);
    return nq(ctx, L(ctx, `m = ${m} kg, teža = ? ${G}`, `m = ${m} kg, weight = ? ${G}`), m * 10, "N", [`${n(m)} N`, m / 10, `${n(m * 10)} kg`]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const g = pick([50, 100, 200, 250, 300, 400, 500, 750, 800]);
      return nq(ctx, L(ctx, `m = ${g} g, teža = ? ${G}`, `m = ${g} g, weight = ? ${G}`), g / 100, "N", [g * 10, g / 10, g / 1000]);
    }
    const m = pick([2, 5, 8, 15, 25, 40, 60, 75]);
    return nq(ctx, L(ctx, `Teža = ${m * 10} N, m = ? ${G}`, `Weight = ${m * 10} N, m = ? ${G}`), m, "kg", [m * 100, m * 10, `${n(m)} N`]);
  }
  if (Math.random() < 0.5) {
    const m = pick([5, 10, 20, 25, 50, 60, 75]);
    return nq(ctx, L(ctx, `Luna (g = 1,6 N/kg): m = ${m} kg, teža = ?`, `Moon (g = 1.6 N/kg): m = ${m} kg, weight = ?`), m * 1.6, "N", [m * 10, m, m / 1.6, `${n(m * 1.6)} kg`]);
  }
  const m = pick([2, 3, 4, 5, 10, 20, 0.5]);
  return nq(ctx, L(ctx, `m = ${n(m)} kg, teža = ? (g = 9,81 N/kg)`, `m = ${n(m)} kg, weight = ? (g = 9.81 N/kg)`), m * 9.81, "N", [m / 9.81, m * 10, `${n(m)} N`, m * 98.1]);
});

def("f_density", "fz_sil", 8, "Gostota", "Density", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const rho = pick([0.5, 0.8, 1, 2, 2.5, 2.7, 4, 5, 7.8, 8, 11.3]), V = pick([10, 20, 50, 100, 200]), m = rho * V;
    return nq(ctx, `m = ${n(m)} g, V = ${V} cm³, ρ = ?`, rho, "g/cm³", [m * V, V / m, `${n(rho)} kg/m³`]);
  }
  if (t === 2) {
    const rho = pick([800, 1000, 2700, 7800, 900, 2500]), V = pick([0.5, 2, 0.2, 0.1, 3, 0.01]);
    if (Math.random() < 0.5) return nq(ctx, `ρ = ${rho} kg/m³, V = ${n(V)} m³, m = ?`, rho * V, "kg", [rho / V, V / rho, `${n(rho * V)} g`]);
    const m = rho * V;
    return nq(ctx, `m = ${n(m)} kg, ρ = ${rho} kg/m³, V = ?`, V, "m³", [m * rho, rho / m, `${n(V)} L`]);
  }
  // pretvorba: kg in dm³ → kg/m³
  const rho = pick([800, 900, 1000, 2700, 7800, 8900, 1200, 2500]), V = pick([1, 2, 5, 0.5, 4]), m = (rho * V) / 1000;
  return nq(ctx, `m = ${n(m)} kg, V = ${n(V)} dm³, ρ = ?`, rho, "kg/m³", [rho / 1000, rho / 10, rho * 1000, V / m]);
});

def("f_pressure", "fz_sil", 8, "Tlak", "Pressure", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const S = pick([2, 4, 5, 0.5, 10]), p = pick([20, 50, 100, 150, 200, 300, 400]), F = p * S;
    return nq(ctx, `F = ${n(F)} N, S = ${n(S)} m², p = ?`, p, "Pa", [F * S, S / F, `${n(p)} N`]);
  }
  if (t === 2) {
    // ploščina v cm²
    const S = pick([2, 4, 5, 10, 20, 25, 50]), F = pick([10, 20, 40, 50, 100, 200]), p = (F / S) * 10000;
    return nq(ctx, `F = ${F} N, S = ${S} cm², p = ?`, p, "Pa", [F / S, (F / S) * 100, F * S, (F / S) * 1000]);
  }
  if (Math.random() < 0.5) {
    const m = pick([40, 50, 60, 80, 100]), S = pick([200, 250, 400, 500]), p = (m * 10) / (S / 10000);
    return nq(ctx, L(ctx, `m = ${m} kg na S = ${S} cm², p = ? (g = 10 N/kg)`, `m = ${m} kg on S = ${S} cm², p = ? (g = 10 N/kg)`), p, "Pa", [p / 10, (m * 10) / S, (m * 10) / (S / 100), m / S]);
  }
  const p = pick([100, 200, 250, 500]), S = pick([2, 4, 0.5, 10]);
  return nq(ctx, `p = ${p} kPa, S = ${n(S)} m², F = ?`, p * S, "kN", [p / S, S / p, p * S * 1000]);
});

def("f_fluids", "fz_sil", 8, "Hidrostatični tlak in vzgon", "Fluid pressure and buoyancy", (t, ctx) => {
  const n = ctx.num, G = "(g = 10 N/kg)";
  if (t === 1) {
    const h = pick([1, 2, 3, 4, 5, 8, 10, 20, 50]);
    return nq(ctx, L(ctx, `Hidrostatični tlak v vodi na ${h} m? ${G}`, `Hydrostatic pressure at ${h} m in water? ${G}`), h * 10, "kPa", [h, h * 100, h / 10, `${n(h * 10)} Pa`]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const V = pick([1, 2, 3, 5, 0.5, 10]);
      return nq(ctx, L(ctx, `Potopljeno telo V = ${n(V)} dm³: vzgon = ? ${G}`, `Submerged body V = ${n(V)} dm³: buoyancy = ? ${G}`), V * 10, "N", [V, V * 100, V * 10000]);
    }
    const W = pick([20, 30, 50, 80, 100, 120]), Fv = pick([5, 10, 15, 20]);
    return nq(ctx, L(ctx, `Teža ${W} N, v vodi silomer kaže ${W - Fv} N. Vzgon?`, `Weight ${W} N, in water ${W - Fv} N. Buoyancy?`), Fv, "N", [W, W - Fv, W + Fv, 2 * W - Fv]);
  }
  if (Math.random() < 0.5) {
    const rho = pick([200, 400, 500, 600, 700, 800, 900, 250]);
    const a = `${ctx.num(rho / 10)} %`;
    return out(L(ctx, `Telo ρ = ${rho} kg/m³ plava v vodi. Potopljeni del?`, `Body ρ = ${rho} kg/m³ floats in water. Part submerged?`), a, [`${ctx.num(100 - rho / 10)} %`, `${ctx.num(rho / 100)} %`, "100 %", "50 %", `${ctx.num(rho / 20)} %`]);
  }
  const rho = pick([500, 800, 900, 1000, 2700, 7800, 11300, 920, 1200]);
  const ans = rho < 1000 ? 0 : rho === 1000 ? 1 : 2;
  const opts = ctx.lang === "sl" ? ["plava", "lebdi", "potone", "se dviga v zrak"] : ["floats", "hovers", "sinks", "rises into the air"];
  return out(L(ctx, `Kaj naredi telo z ρ = ${rho} kg/m³ v vodi?`, `What does a body with ρ = ${rho} kg/m³ do in water?`), opts[ans], opts.filter((_, i) => i !== ans));
});

const NEWTON = bank([
  [3, "Zemlja vleče jabolko z 1 N. Jabolko Zemljo?|1 N|0 N|10 N|0,1 N", "Earth pulls an apple with 1 N. Apple pulls Earth?|1 N|0 N|10 N|0.1 N"],
  [3, "Rezultanta sil je 0. Pospešek telesa?|0 m/s²|9,81 m/s²|odvisen od mase|1 m/s²", "Net force is 0. Acceleration?|0 m/s²|9.81 m/s²|depends on mass|1 m/s²"],
  [3, "Avtobus naglo zavre. Potniki se nagnejo?|naprej|nazaj|v levo|navzgor", "A bus brakes hard. Passengers lean?|forward|backward|to the left|upward"],
  [3, "Rezultanta 0, v = 5 m/s. Hitrost čez 10 s?|5 m/s|0 m/s|50 m/s|0,5 m/s", "Net force 0, v = 5 m/s. Speed after 10 s?|5 m/s|0 m/s|50 m/s|0.5 m/s"],
  [3, "2-krat večja sila, ista masa. Pospešek?|2-krat večji|2-krat manjši|enak|4-krat večji", "Twice the force, same mass. Acceleration?|twice as big|half as big|the same|4 times as big"],
  [3, "Ista sila, 2-krat večja masa. Pospešek?|2-krat manjši|2-krat večji|enak|4-krat manjši", "Same force, twice the mass. Acceleration?|half as big|twice as big|the same|a quarter"],
  [3, "Sila in nasprotna sila delujeta na?|različni telesi|isto telo|tla|zrak", "Action and reaction act on?|different bodies|the same body|the ground|the air"],
]);
def("f_newton", "fz_sil", 9, "Newtonovi zakoni", "Newton's laws", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const m = pick([2, 3, 4, 5, 10, 20, 50]), a = pick([2, 3, 4, 5, 0.5]);
    return nq(ctx, `m = ${m} kg, a = ${n(a)} m/s², F = ?`, m * a, "N", [m / a, a / m, `${n(m * a)} J`, m + a]);
  }
  if (t === 2) {
    const m = pick([2, 4, 5, 10, 20, 25, 50]), a = pick([2, 3, 4, 5, 0.5]), F = m * a;
    if (Math.random() < 0.5) return nq(ctx, `F = ${n(F)} N, m = ${m} kg, a = ?`, a, "m/s²", [F * m, m / F, `${n(a)} m/s`]);
    return nq(ctx, `F = ${n(F)} N, a = ${n(a)} m/s², m = ?`, m, "kg", [F * a, a / F, `${n(m)} N`]);
  }
  if (Math.random() < 0.6) {
    const m = pick([2, 4, 5, 10]), a = pick([1, 2, 3, 4]), F2 = pick([5, 10, 20]), F1 = m * a + F2;
    return nq(ctx, L(ctx, `Nasprotni sili ${F1} N in ${F2} N, m = ${m} kg, a = ?`, `Opposite forces ${F1} N and ${F2} N, m = ${m} kg, a = ?`), a, "m/s²", [(F1 + F2) / m, F1 / m, F1 - F2, F2 / m]);
  }
  return NEWTON(3, ctx);
});

def("f_friction", "fz_sil", 10, "Trenje", "Friction", (t, ctx) => {
  const n = ctx.num, k = pick([0.1, 0.2, 0.3, 0.4, 0.5]);
  if (t === 1) {
    const Fn = pick([100, 200, 300, 400, 500, 1000]), Ft = Fn * k;
    return nq(ctx, L(ctx, `Telo drsi, pritisna sila ${Fn} N, k = ${n(k)}. Trenje?`, `Sliding, normal force ${Fn} N, μ = ${n(k)}. Friction?`), Ft, "N", [Fn / k, Fn - Ft, Fn, Ft / 10]);
  }
  if (t === 2) {
    // telo drsi (pri mirujočem telesu brez vlečne sile trenja ni)
    const m = pick([10, 20, 40, 50, 100]), Ft = m * 10 * k;
    return nq(ctx, L(ctx, `m = ${m} kg drsi po tleh, k = ${n(k)}. Trenje? (g = 10 N/kg)`, `m = ${m} kg slides, μ = ${n(k)}. Friction? (g = 10 N/kg)`), Ft, "N", [m * k, m / k, m * 10, (m * 10) / k]);
  }
  const m = pick([5, 10, 20]), a = pick([1, 2, 3]), fr = m * 10 * k, F = m * a + fr;
  return nq(ctx, L(ctx, `m = ${m} kg, k = ${n(k)}, vlečna sila ${n(F)} N: a = ? (g = 10 m/s²)`, `m = ${m} kg, μ = ${n(k)}, pull ${n(F)} N: a = ? (g = 10 m/s²)`), a, "m/s²", [F / m, (F + fr) / m, fr / m, F - fr]);
});

def("f_lever", "fz_sil", 10, "Navor in vzvod", "Torque and levers", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const F = pick([10, 20, 40, 50, 100, 30]), r = pick([0.2, 0.5, 1, 2, 0.25, 3]), M = F * r;
    return nq(ctx, L(ctx, `F = ${F} N, ročica r = ${n(r)} m, M = ?`, `F = ${F} N, lever arm r = ${n(r)} m, M = ?`), M, "Nm", [F / r, r / F, `${n(M)} N`, F + r]);
  }
  for (let i = 0; i < 40; i++) {
    if (t === 2) {
      const F1 = R(1, 6) * 10, r1 = R(1, 4), r2 = R(1, 6), F2 = (F1 * r1) / r2;
      if (r1 === r2 || !nice(F2) || !Number.isInteger(F2 * 10)) continue;
      return nq(ctx, L(ctx, `Ravnovesje: ${F1} N · ${r1} m = F · ${r2} m, F = ?`, `Balance: ${F1} N · ${r1} m = F · ${r2} m, F = ?`), F2, "N", [(F1 * r2) / r1, F1 * r1, F1 * r1 * r2, F1]);
    }
    const m1 = R(2, 8) * 5, r1 = pick([1, 1.5, 2, 2.5, 3]), m2 = R(2, 8) * 5, r2 = (m1 * r1) / m2;
    if (m1 === m2 || !Number.isInteger(r2 * 10) || r2 > 5) continue;
    return nq(ctx, L(ctx, `Gugalnica: ${m1} kg na ${n(r1)} m, ${m2} kg na ? m`, `Seesaw: ${m1} kg at ${n(r1)} m, ${m2} kg at ? m`), r2, "", [(m2 * r1) / m1, r1, m1 * r1, r1 * 2]);
  }
  return nq(ctx, L(ctx, `Ravnovesje: 30 N · 2 m = F · 3 m, F = ?`, `Balance: 30 N · 2 m = F · 3 m, F = ?`), 20, "N", [45, 60, 180]);
});

// =====================================================================
// DELO, ENERGIJA, GIBALNA KOLIČINA
// =====================================================================
def("f_work", "fz_ene", 9, "Delo", "Work", (t, ctx) => {
  const n = ctx.num, A = L(ctx, "A", "W");
  if (t === 1) {
    const F = pick([10, 20, 25, 50, 100, 200]), s = pick([2, 3, 4, 5, 10]), W = F * s;
    return nq(ctx, `F = ${F} N, s = ${s} m, ${A} = ?`, W, "J", [F / s, s / F, `${n(W)} W`, `${n(W)} N`]);
  }
  if (t === 2) {
    const m = pick([2, 5, 10, 20, 50]), h = pick([2, 3, 4, 5, 10]);
    if (Math.random() < 0.3) return out(L(ctx, `Torbo ${m} kg nesemo ${h} m vodoravno. Delo teže?`, `Carry a ${m} kg bag ${h} m horizontally. Work of gravity?`), "0 J", [`${n(m * 10 * h)} J`, `${n(m * h)} J`, `${n(m * 10)} J`, `${n(m * 10 * h * 2)} J`]);
    return nq(ctx, L(ctx, `Dvignemo ${m} kg za ${h} m. A = ? (g = 10 N/kg)`, `Lift ${m} kg by ${h} m. W = ? (g = 10 N/kg)`), m * 10 * h, "J", [m * h, (m * h) / 10, m * 10 + h, `${n(m * 10 * h)} W`]);
  }
  const F = pick([1, 2, 4, 5]), s = pick([0.5, 2, 3, 1.5]), W = F * s;
  return out(`F = ${F} kN, s = ${n(s)} km, ${A} = ?`, `${n(W)} MJ`, [`${n(W)} kJ`, `${n(W)} J`, `${n(W * 1000)} MJ`, `${n(F + s)} MJ`]);
});

def("f_energy", "fz_ene", 9, "Kinetična in potencialna energija", "Kinetic and potential energy", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const m = pick([1, 2, 3, 5, 10, 20]), h = pick([2, 3, 4, 5, 10, 20]);
    return nq(ctx, L(ctx, `m = ${m} kg, h = ${h} m, Wp = ? (g = 10 N/kg)`, `m = ${m} kg, h = ${h} m, PE = ? (g = 10 N/kg)`), m * 10 * h, "J", [m * h, 5 * m * h, 100 * m * h]);
  }
  if (t === 2) {
    const m = pick([2, 4, 6, 10, 0.5, 1]), v = pick([2, 3, 4, 5, 6, 10]);
    return nq(ctx, L(ctx, `m = ${n(m)} kg, v = ${v} m/s, Wk = ?`, `m = ${n(m)} kg, v = ${v} m/s, KE = ?`), (m * v * v) / 2, "J", [m * v * v, (m * v) / 2, m * v]);
  }
  if (Math.random() < 0.5) {
    const v = pick([5, 10, 15, 20, 30]);
    return nq(ctx, L(ctx, `Navpični met z ${v} m/s: največja višina = ? (g = 10 m/s²)`, `Thrown up at ${v} m/s: max height = ? (g = 10 m/s²)`), (v * v) / 20, "m", [(v * v) / 10, v / 20, v / 10, v * v]);
  }
  const m = pick([500, 1000, 1200, 2000]), v = pick([10, 20, 30]);
  return nq(ctx, L(ctx, `Avto m = ${m} kg, v = ${v} m/s, Wk = ?`, `Car m = ${m} kg, v = ${v} m/s, KE = ?`), (m * v * v) / 2000, "kJ", [(m * v * v) / 1000, (m * v) / 2000, (m * v * v) / 2]);
});

def("f_power", "fz_ene", 9, "Moč", "Power", (t, ctx) => {
  const n = ctx.num, A = L(ctx, "A", "W");
  if (t === 1) {
    const P = pick([10, 20, 25, 30, 50, 100, 200, 500]), tt = pick([2, 4, 5, 10, 20, 60]), W = P * tt;
    return nq(ctx, `${A} = ${W} J, t = ${tt} s, P = ?`, P, "W", [W * tt, tt / W, `${n(P)} J`]);
  }
  if (t === 2) {
    const P = pick([0.5, 1, 2, 1.5, 3]), tt = pick([1, 2, 5, 10]);
    return nq(ctx, `P = ${n(P)} kW, t = ${tt} min, ${A} = ?`, P * 60 * tt, "kJ", [P * tt, P * tt * 60000, (P * 60) / tt, P * tt * 1000]);
  }
  for (let i = 0; i < 30; i++) {
    const m = pick([50, 100, 200, 500]), h = pick([2, 3, 4, 5, 6, 10, 12]), tt = pick([5, 10, 20, 30, 60]), P = (m * 10 * h) / tt;
    if (!Number.isInteger(P)) continue;
    return nq(ctx, L(ctx, `${m} kg dvignemo za ${h} m v ${tt} s. P = ? (g = 10 N/kg)`, `Lift ${m} kg by ${h} m in ${tt} s. P = ? (g = 10 N/kg)`), P, "W", [(m * h) / tt, m * 10 * h, m * 10 * h * tt, `${n(P)} J`]);
  }
  return nq(ctx, `F = 500 N, v = 4 m/s, P = ?`, 2000, "W", [125, 0.008, "2000 J"]);
});

def("f_eff", "fz_ene", 9, "Izkoristek", "Efficiency", (t, ctx) => {
  const n = ctx.num;
  for (let i = 0; i < 40; i++) {
    const inn = pick([100, 200, 400, 500, 1000, 800, 2000]), e = pick([10, 20, 25, 40, 50, 60, 75, 80, 90]), use = (inn * e) / 100;
    if (!Number.isInteger(use)) continue;
    if (t === 1) {
      const inv = (inn / use) * 100;
      return out(L(ctx, `Vložimo ${inn} J, koristno ${use} J. η = ?`, `Input ${inn} J, useful ${use} J. η = ?`), `${e} %`, [`${100 - e} %`, nice(inv) && Number.isInteger(inv * 10) ? `${n(inv)} %` : null, `${n(e / 100)} %`, `${n(inn - use)} %`, `${use} %`, `${e < 90 ? e + 10 : e - 15} %`]);
    }
    if (t === 2) return nq(ctx, L(ctx, `η = ${e} %, vloženo ${inn} J. Koristno delo?`, `η = ${e} %, input ${inn} J. Useful work?`), use, "J", [inn - use, (inn * 100) / e, inn * e, inn + e]);
    if (Math.random() < 0.5) {
      const P = pick([1, 2, 4, 5, 10]), u = (P * e) / 100;
      return nq(ctx, L(ctx, `Motor prejme ${P} kW, η = ${e} %. Koristna moč?`, `Motor input ${P} kW, η = ${e} %. Useful power?`), u, "kW", [P - u, P * e, (P * 100) / e]);
    }
    return nq(ctx, L(ctx, `Koristno ${use} J, η = ${e} %. Vloženo delo?`, `Useful ${use} J, η = ${e} %. Input work?`), inn, "J", [(use * e) / 100, use + e, use * e, use - (use * e) / 100]);
  }
  return out("η = ?", "50 %", ["5 %", "0,5 %", "200 %"]);
});

def("f_mom", "fz_ene", 10, "Gibalna količina", "Momentum", (t, ctx) => {
  const n = ctx.num, G = L(ctx, "G", "p"), U = "kg·m/s";
  if (t === 1) {
    const m = pick([2, 3, 4, 5, 10, 0.5]), v = pick([2, 3, 4, 5, 6, 10]);
    return nq(ctx, `m = ${n(m)} kg, v = ${v} m/s, ${G} = ?`, m * v, U, [m / v, m * v * v, `${n((m * v * v) / 2)} J`, `${n(m * v)} N`]);
  }
  if (t === 2) {
    const F = pick([10, 20, 50, 100, 200]), dt = pick([0.1, 0.2, 0.5, 2]), dG = F * dt;
    if (Math.random() < 0.5) return nq(ctx, `F = ${F} N, Δt = ${n(dt)} s, Δ${G} = ?`, dG, U, [F / dt, dt / F, F + dt]);
    return nq(ctx, `Δ${G} = ${n(dG)} ${U}, Δt = ${n(dt)} s, F = ?`, F, "N", [dG * dt, dt / dG, dG]);
  }
  for (let i = 0; i < 40; i++) {
    const m1 = R(1, 4), v1 = pick([2, 3, 4, 6, 8, 10, 12]), m2 = R(1, 4), v = (m1 * v1) / (m1 + m2);
    if (!Number.isInteger(v * 10)) continue;
    return nq(ctx, L(ctx, `${m1} kg z ${v1} m/s + mirujoči ${m2} kg, sprimeta se: v = ?`, `${m1} kg at ${v1} m/s sticks to ${m2} kg at rest: v = ?`), v, "m/s", [v1 / 2, v1, (m2 * v1) / (m1 + m2), m1 * v1]);
  }
  return nq(ctx, L(ctx, `2 kg z 6 m/s + mirujoči 1 kg, sprimeta se: v = ?`, `2 kg at 6 m/s sticks to 1 kg at rest: v = ?`), 4, "m/s", [3, 6, 2, 12]);
});

// =====================================================================
// TOPLOTA
// =====================================================================
def("f_temp", "fz_top", 9, "Temperatura in temperaturne lestvice", "Temperature scales", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const c = pick([10, 20, 25, 27, 30, 37, 50, 77, 100, 127]);
    return nq(ctx, `${c} °C = ? K`, c + 273, "", [c - 273, 273 - c, c + 100, c], { neg: true });
  }
  if (t === 2) {
    const T = pick([73, 173, 200, 223, 250, 263, 293, 300, 323, 373, 400, 573]);
    return nq(ctx, `${T} K = ? °C`, T - 273, "", [T + 273, 273 - T, T - 100], { neg: true });
  }
  const k = R(0, 2);
  if (k === 0) {
    const a = pick([10, 15, 20, 25]), b = a + pick([20, 30, 40, 50, 60]);
    return nq(ctx, L(ctx, `Z ${a} °C na ${b} °C: ΔT = ? K`, `From ${a} °C to ${b} °C: ΔT = ? K`), b - a, "", [b - a + 273, b + 273, a + b]);
  }
  if (k === 1) {
    const T = pick([280, 300, 320, 350]), d = pick([10, 20, 30, 50]);
    return nq(ctx, L(ctx, `${T} K segrejemo za ${d} °C: ? K`, `Heat ${T} K by ${d} °C: ? K`), T + d, "", [T + d + 273, d + 273, T + d - 273]);
  }
  return out(L(ctx, `Absolutna ničla = ? °C`, `Absolute zero = ? °C`), n(-273), ["0", "273", n(-100), n(-373)]);
});

def("f_heat", "fz_top", 9, "Toplota (Q = m·c·ΔT)", "Heat (Q = m·c·ΔT)", (t, ctx) => {
  const n = ctx.num, cw = `c = ${n(4.2)} kJ/(kg·K)`;
  if (t === 1) {
    const m = pick([1, 2, 3, 5, 0.5]), dT = pick([5, 10, 20, 40, 50]), Q = m * 4.2 * dT;
    return nq(ctx, `m = ${n(m)} kg, ${cw}, ΔT = ${dT} K, Q = ?`, Q, "kJ", [m * 4.2, 4.2 * dT, `${n(Q)} J`, m * dT]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const m = pick([1, 2, 5, 0.5]), dT = pick([5, 10, 20, 40]), Q = m * 4.2 * dT;
      return nq(ctx, `Q = ${n(Q)} kJ, m = ${n(m)} kg, ${cw}, ΔT = ?`, dT, "K", [Q / m, Q / 4.2, Q * m * 4.2, (Q * m) / 4.2]);
    }
    const [c] = pick([[900], [450], [380], [130], [2100], [500]]), m = pick([1, 2, 4, 5]), dT = pick([10, 20, 50, 100]), Q = (m * c * dT) / 1000;
    return nq(ctx, `m = ${m} kg, c = ${c} J/(kg·K), ΔT = ${dT} K, Q = ?`, Q, "kJ", [Q * 1000, (m * c) / 1000, (c * dT) / 1000, Q / 10]);
  }
  if (Math.random() < 0.6) {
    const m = pick([1, 2, 0.5, 5]), a = pick([10, 15, 20, 25]), b = a + pick([20, 30, 50, 60]), Q = m * 4.2 * (b - a);
    return nq(ctx, `m = ${n(m)} kg, ${cw}, ${a} °C → ${b} °C, Q = ?`, Q, "kJ", [m * 4.2 * b, m * 4.2 * a, m * 4.2 * (a + b), m * (b - a)]);
  }
  const m = pick([2, 3, 5, 0.5, 4]);
  return nq(ctx, L(ctx, `Stalimo ${n(m)} kg ledu pri 0 °C (qt = 336 kJ/kg). Q = ?`, `Melt ${n(m)} kg of ice at 0 °C (L = 336 kJ/kg). Q = ?`), m * 336, "kJ", [336 / m, 336, m * 336 * 1000, m * 4.2]);
});

def("f_states", "fz_top", 9, "Agregatna stanja in prenos toplote", "States of matter and heat transfer", bank([
  [1, "Trdno → kapljevina se imenuje?|taljenje|strjevanje|izparevanje|kondenzacija", "Solid → liquid is called?|melting|freezing|evaporation|condensation"],
  [1, "Kapljevina → trdno se imenuje?|strjevanje|taljenje|sublimacija|izparevanje", "Liquid → solid is called?|freezing|melting|sublimation|evaporation"],
  [1, "Kapljevina → plin se imenuje?|izparevanje|kondenzacija|taljenje|strjevanje", "Liquid → gas is called?|evaporation|condensation|melting|freezing"],
  [1, "Plin → kapljevina se imenuje?|kondenzacija|izparevanje|taljenje|sublimacija", "Gas → liquid is called?|condensation|evaporation|melting|sublimation"],
  [1, "Trdno → plin brez kapljevine?|sublimacija|taljenje|izparevanje|kondenzacija", "Solid → gas, skipping liquid?|sublimation|melting|evaporation|condensation"],
  [1, "Tališče ledu pri normalnem tlaku?|0 °C|100 °C|4 °C|−10 °C", "Ice melts at (normal pressure)?|0 °C|100 °C|4 °C|−10 °C"],
  [1, "Vrelišče vode pri normalnem tlaku?|100 °C|0 °C|50 °C|273 °C", "Water boils at (normal pressure)?|100 °C|0 °C|50 °C|273 °C"],
  [1, "Kako potuje toplota po kovinski žlici?|s prevajanjem|s sevanjem|s konvekcijo|z izparevanjem", "Heat travels along a metal spoon by?|conduction|radiation|convection|evaporation"],
  [1, "Kako pride toplota s Sonca na Zemljo?|s sevanjem|s prevajanjem|s konvekcijo|z vetrom", "Heat from the Sun reaches Earth by?|radiation|conduction|convection|wind"],
  [1, "Topel zrak nad radiatorjem se?|dviga|spušča|ne giblje|utekočini", "Warm air above a heater?|rises|sinks|stays still|turns liquid"],
  [1, "Dober toplotni prevodnik?|baker|les|volna|stiropor", "Good thermal conductor?|copper|wood|wool|polystyrene"],
  [1, "Dober toplotni izolator?|stiropor|baker|aluminij|železo", "Good thermal insulator?|polystyrene|copper|aluminium|iron"],
  [1, "Kaj meri termometer?|temperaturo|toploto|maso|tlak", "A thermometer measures?|temperature|heat|mass|pressure"],
  [2, "Med taljenjem ledu temperatura?|ostane enaka|narašča|pada|niha", "While ice melts, its temperature?|stays the same|rises|falls|oscillates"],
  [2, "Prenos toplote z gibanjem tekočine?|konvekcija|prevajanje|sevanje|sublimacija", "Heat carried by a moving fluid?|convection|conduction|radiation|sublimation"],
  [2, "Prenos toplote tudi skozi vakuum?|sevanje|prevajanje|konvekcija|noben", "Heat transfer through a vacuum?|radiation|conduction|convection|none"],
  [2, "Toplota sama prehaja na telo, ki je?|hladnejše|toplejše|težje|večje", "Heat flows by itself to a body that is?|colder|warmer|heavier|larger"],
  [2, "Pri segrevanju se večina teles?|raztegne|skrči|ne spremeni|zmanjša maso", "When heated, most bodies?|expand|contract|don't change|lose mass"],
  [2, "Notranja energija ob segrevanju?|se poveča|se zmanjša|ostane enaka|izgine", "Internal energy when heated?|increases|decreases|stays the same|vanishes"],
  [2, "Temne površine sevanje?|bolj vpijajo|bolj odbijajo|ne vpijajo|prepuščajo", "Dark surfaces and radiation?|absorb more|reflect more|never absorb|let it through"],
  [2, "Voda pri 100 °C in normalnem tlaku?|vre|zmrzne|se tali|sublimira", "Water at 100 °C, normal pressure?|boils|freezes|melts|sublimes"],
  [3, "Voda ima največjo gostoto pri?|4 °C|0 °C|100 °C|−4 °C", "Water is densest at?|4 °C|0 °C|100 °C|−4 °C"],
  [3, "Na visoki gori voda vre pri?|nižji temperaturi|višji temperaturi|točno 100 °C|0 °C", "On a high mountain water boils at?|a lower temperature|a higher temperature|exactly 100 °C|0 °C"],
  [3, "Pri izhlapevanju kapljevina?|se ohlaja|se segreva|zmrzne|zavre", "An evaporating liquid?|cools down|warms up|freezes|starts boiling"],
  [3, "Pri strjevanju telo toploto?|oddaja|prejema|ne izmenjuje|ustvarja", "While freezing, a body heat?|gives off|absorbs|exchanges no|creates"],
  [3, "Pri taljenju telo toploto?|prejema|oddaja|ne izmenjuje|ustvarja", "While melting, a body heat?|absorbs|gives off|exchanges no|creates"],
  [3, "Led ima v primerjavi z vodo?|manjšo gostoto|večjo gostoto|enako gostoto|dvojno gostoto", "Compared with water, ice has?|lower density|higher density|equal density|double density"],
  [3, "Specifična toplota vode?|4200 J/(kg·K)|420 J/(kg·K)|42 J/(kg·K)|1000 J/(kg·K)", "Specific heat of water?|4200 J/(kg·K)|420 J/(kg·K)|42 J/(kg·K)|1000 J/(kg·K)"],
  [3, "Podnevi ob morju veter piha?|z morja na kopno|s kopnega na morje|navpično navzdol|sploh ne piha", "Daytime sea breeze blows?|from sea to land|from land to sea|straight down|not at all"],
]));

def("f_gas", "fz_top", 11, "Plinski zakoni", "Gas laws", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const p1 = pick([50, 100, 120, 150, 200]), V1 = pick([2, 4, 6, 8, 10, 12, 20]), k = pick([2, 4, 0.5]), V2 = V1 / k;
    if (!Number.isInteger(V2 * 10)) return nq(ctx, L(ctx, `T = konst.: p₁ = 100 kPa, V₁ = 6 L, V₂ = 3 L, p₂ = ?`, `T const: p₁ = 100 kPa, V₁ = 6 L, V₂ = 3 L, p₂ = ?`), 200, "kPa", [50, 400, 100]);
    return nq(ctx, L(ctx, `T = konst.: p₁ = ${p1} kPa, V₁ = ${V1} L, V₂ = ${n(V2)} L, p₂ = ?`, `T const: p₁ = ${p1} kPa, V₁ = ${V1} L, V₂ = ${n(V2)} L, p₂ = ?`), p1 * k, "kPa", [p1 / k, p1 * k * k, p1, p1 * V1 * V2]);
  }
  if (t === 2) {
    const [T1, T2] = pick([[300, 600], [300, 450], [200, 400], [400, 300], [250, 500], [300, 400], [400, 600], [600, 300]]);
    // V₁ tako, da je V₂ lepo število (npr. 300 K → 400 K zahteva V₁ deljiv s 3)
    const V1 = pick([2, 3, 4, 6, 12].filter((v) => Number.isInteger((v * T2 * 10) / T1))), V2 = (V1 * T2) / T1;
    const t1 = T1 - 273, t2 = T2 - 273;
    return nq(ctx, L(ctx, `p = konst.: V₁ = ${V1} L pri ${n(t1)} °C. Pri ${n(t2)} °C V₂ = ?`, `p const: V₁ = ${V1} L at ${n(t1)} °C. At ${n(t2)} °C V₂ = ?`), V2, "L", [(V1 * t2) / t1, (V1 * T1) / T2, V1, V1 + (t2 - t1) / 100]);
  }
  for (let i = 0; i < 40; i++) {
    const p1 = pick([100, 200]), pr = pick([0.5, 2, 4]), p2 = p1 * pr;
    const T1 = pick([200, 300, 400]), tr = pick([1.5, 2, 0.5, 1]), T2 = T1 * tr, V1 = pick([2, 3, 4, 6, 10, 12]);
    const V2 = (V1 * tr) / pr;
    if (!Number.isInteger(V2 * 10)) continue;
    return nq(ctx, `p: ${p1} → ${p2} kPa, T: ${T1} → ${T2} K, V₁ = ${V1} L, V₂ = ?`, V2, "L", [V1 * tr * pr, (V1 * pr) / tr, V1 / (tr * pr), V1 * tr, V1 / pr]);
  }
  return nq(ctx, `p: 100 → 200 kPa, T: 300 → 450 K, V₁ = 4 L, V₂ = ?`, 3, "L", [12, 6, 2]);
});

// =====================================================================
// ELEKTRIKA IN MAGNETIZEM
// =====================================================================
def("f_ohm", "fz_ele", 9, "Ohmov zakon", "Ohm's law", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const R_ = pick([2, 3, 4, 6, 8, 10, 12, 20]), I = pick([1, 2, 3, 4, 0.5]), U = R_ * I;
    if (Math.random() < 0.5) return nq(ctx, `U = ${n(U)} V, R = ${R_} Ω, I = ?`, I, "A", [U * R_, R_ / U, `${n(I)} V`]);
    return nq(ctx, `R = ${R_} Ω, I = ${n(I)} A, U = ?`, U, "V", [R_ / I, I / R_, `${n(U)} A`, R_ + I]);
  }
  if (t === 2) {
    const R_ = pick([10, 20, 30, 40, 60, 100]), mA = pick([50, 100, 200, 250, 500]), U = (R_ * mA) / 1000;
    return nq(ctx, `U = ${n(U)} V, I = ${mA} mA, R = ?`, R_, "Ω", [U / mA, (U * mA) / 1000, U * mA, R_ / 1000]);
  }
  const Rk = pick([1, 2, 4, 5, 10]), mA = pick([2, 3, 5, 10, 0.5]), U = Rk * mA;
  if (Math.random() < 0.5) return nq(ctx, `R = ${Rk} kΩ, I = ${n(mA)} mA, U = ?`, U, "V", [U * 1000, U / 1000, Rk / mA, mA / Rk]);
  return out(`U = ${n(U)} V, R = ${Rk} kΩ, I = ?`, `${n(mA)} mA`, [`${n(mA)} A`, `${n(U * Rk)} mA`, `${n(mA / 1000)} mA`, `${n(mA * 1000)} mA`]);
});

const PAR = [[6, 3], [12, 4], [12, 6], [20, 5], [10, 10], [30, 6], [6, 6], [4, 4], [12, 12], [20, 30], [60, 30], [15, 10], [40, 10], [24, 8], [18, 9], [3, 6], [4, 12], [8, 8], [20, 20]];
def("f_resist", "fz_ele", 9, "Zaporedna in vzporedna vezava", "Series and parallel circuits", (t, ctx) => {
  const n = ctx.num;
  const ser = (a, b) => L(ctx, `${a} Ω in ${b} Ω zaporedno, R = ?`, `${a} Ω and ${b} Ω in series, R = ?`);
  const par = (a, b) => L(ctx, `${a} Ω in ${b} Ω vzporedno, R = ?`, `${a} Ω and ${b} Ω in parallel, R = ?`);
  if (t === 1) {
    const a = R(1, 20), b = R(1, 20);
    return nq(ctx, ser(a, b), a + b, "Ω", [(a * b) / (a + b), a * b, Math.abs(a - b), (a + b) / 2]);
  }
  const [a, b] = pick(PAR), Rp = (a * b) / (a + b);
  if (t === 2) return nq(ctx, par(a, b), Rp, "Ω", [a + b, a * b, (a + b) / (a * b), (a + b) / 2]);
  if (Math.random() < 0.5) {
    const I = pick([1, 2, 3, 0.5]), U = I * (a + b);
    return nq(ctx, L(ctx, `${a} Ω in ${b} Ω zaporedno na ${n(U)} V. I = ?`, `${a} Ω and ${b} Ω in series on ${n(U)} V. I = ?`), I, "A", [U / a, U / b, U / a + U / b, U * (a + b)]);
  }
  const U = Rp * pick([1, 2, 3]);
  if (U > 60) return nq(ctx, L(ctx, `6 Ω in 3 Ω vzporedno na 6 V. I = ?`, `6 Ω and 3 Ω in parallel on 6 V. I = ?`), 3, "A", [1, 2, 0.667]);
  return nq(ctx, L(ctx, `${a} Ω in ${b} Ω vzporedno na ${n(U)} V. Skupni I = ?`, `${a} Ω and ${b} Ω in parallel on ${n(U)} V. Total I = ?`), U / a + U / b, "A", [U / (a + b), U / a, U / b, U * Rp]);
});

def("f_epower", "fz_ele", 9, "Električno delo in moč", "Electric energy and power", (t, ctx) => {
  const n = ctx.num, A = L(ctx, "A", "E");
  if (t === 1) {
    const U = pick([6, 12, 24, 230]), I = pick([0.5, 1, 2, 3, 5]), P = U * I;
    return nq(ctx, `U = ${U} V, I = ${n(I)} A, P = ?`, P, "W", [U / I, I / U, `${n(P)} J`, U + I]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const P = pick([0.5, 1, 2, 1.5, 3]), h = pick([2, 3, 4, 5, 10]), E = P * h;
      return nq(ctx, `P = ${n(P)} kW, t = ${h} h, ${A} = ?`, E, "kWh", [P / h, h / P, `${n(E)} kW`, E * 1000]);
    }
    const P = pick([100, 200, 500, 50, 1000]), h = pick([2, 4, 5, 10, 20]), E = (P * h) / 1000;
    return nq(ctx, `P = ${P} W, t = ${h} h, ${A} = ?`, E, "kWh", [P * h, (P * h) / 100, P / h, (P * h) / 3600]);
  }
  if (Math.random() < 0.5) {
    for (let i = 0; i < 30; i++) {
      const U = pick([6, 12, 24, 10, 20]), R_ = pick([2, 3, 4, 6, 8, 10, 12]), P = (U * U) / R_;
      if (!Number.isInteger(P * 10)) continue;
      return nq(ctx, `U = ${U} V, R = ${R_} Ω, P = ?`, P, "W", [U / R_, U * R_, U * U * R_, (U * U) / (2 * R_)]);
    }
  }
  const P = pick([100, 200, 500, 1000, 2000]), h = pick([2, 4, 5, 10]), pr = pick([0.1, 0.2, 0.25, 0.15]), cost = ((P * h) / 1000) * pr;
  return out(L(ctx, `${P} W, ${h} h, ${n(pr)} €/kWh: cena = ?`, `${P} W, ${h} h, ${n(pr)} €/kWh: cost = ?`), `${n(cost)} €`, [`${n(P * h * pr)} €`, `${n(cost * 10)} €`, `${n(cost / 10)} €`, `${n(P * pr)} €`]);
});

def("f_charge", "fz_ele", 9, "Električni naboj in tok", "Electric charge and current", (t, ctx) => {
  const n = ctx.num, Q = L(ctx, "naboj", "charge"), U = L(ctx, "As", "C");
  if (t === 1) {
    const I = pick([0.5, 1, 2, 3, 5]), s = pick([2, 4, 5, 10, 20, 60]), e = I * s;
    return nq(ctx, `I = ${n(I)} A, t = ${s} s, ${Q} = ?`, e, U, [I / s, s / I, `${n(e)} A`]);
  }
  if (t === 2) {
    const I = pick([0.5, 1, 2, 3, 0.2]), m = pick([1, 2, 5, 10]), e = I * m * 60;
    if (Math.random() < 0.5) return nq(ctx, `I = ${n(I)} A, t = ${m} min, ${Q} = ?`, e, U, [I * m, I * m * 3600, (I * 60) / m]);
    return nq(ctx, `${Q} = ${n(e)} ${U}, I = ${n(I)} A, t = ?`, m * 60, "s", [e * I, I / e, `${m} s`]);
  }
  if (Math.random() < 0.5) {
    const mAh = pick([500, 1000, 2000, 2500, 3000, 4000]);
    return nq(ctx, `${mAh} mAh = ? ${U}`, mAh * 3.6, "", [mAh, mAh * 60, mAh / 1000, mAh * 3600]);
  }
  const I = pick([2, 3, 4, 5, 0.5]), m = pick([1, 2, 5]), e = I * m * 60;
  return nq(ctx, L(ctx, `${Q} ${n(e)} ${U} v ${m} min, I = ?`, `${Q} ${n(e)} ${U} in ${m} min, I = ?`), I, "A", [e / m, e * m * 60, (m * 60) / e]);
});

def("f_circuit", "fz_ele", 9, "Električni krog in naboji", "Circuits and charges", bank([
  [1, "Merilnik električnega toka?|ampermeter|voltmeter|ohmmeter|termometer", "Current is measured with?|an ammeter|a voltmeter|an ohmmeter|a thermometer"],
  [1, "Merilnik električne napetosti?|voltmeter|ampermeter|tehtnica|termometer", "Voltage is measured with?|a voltmeter|an ammeter|a balance|a thermometer"],
  [1, "Ampermeter v krog vežemo?|zaporedno|vzporedno|kakorkoli|ga ne vežemo", "An ammeter is connected?|in series|in parallel|any way|not at all"],
  [1, "Voltmeter vežemo?|vzporedno|zaporedno|kakorkoli|ga ne vežemo", "A voltmeter is connected?|in parallel|in series|any way|not at all"],
  [1, "Sila med istoimenskima nabojema je?|odbojna|privlačna|nič|vedno navpična", "Force between like charges?|repulsive|attractive|zero|always vertical"],
  [1, "Sila med raznoimenskima nabojema je?|privlačna|odbojna|nič|vedno navpična", "Force between opposite charges?|attractive|repulsive|zero|always vertical"],
  [1, "Naboj elektrona?|negativen|pozitiven|0|odvisen od snovi", "Charge of an electron?|negative|positive|zero|depends on material"],
  [1, "Naboj protona?|pozitiven|negativen|0|odvisen od snovi", "Charge of a proton?|positive|negative|zero|depends on material"],
  [1, "Naboj nevtrona?|0|pozitiven|negativen|odvisen od snovi", "Charge of a neutron?|zero|positive|negative|depends on material"],
  [1, "Dober električni prevodnik?|baker|guma|steklo|les", "Good electrical conductor?|copper|rubber|glass|wood"],
  [1, "Električni izolator?|guma|baker|železo|aluminij", "Electrical insulator?|rubber|copper|iron|aluminium"],
  [1, "Tok teče le, če je krog?|sklenjen|odprt|prekinjen|brez vira", "Current flows only if the circuit is?|closed|open|broken|without a source"],
  [1, "Telo z več elektroni kot protoni je?|negativno|pozitivno|nevtralno|magnetno", "A body with extra electrons is?|negative|positive|neutral|magnetic"],
  [2, "Zaporedno vezani žarnici: tok?|v obeh enak|v obeh različen|v drugi 0|v drugi dvojen", "Two bulbs in series: current?|same in both|different|zero in 2nd|double in 2nd"],
  [2, "Vzporedno vezani žarnici: napetost?|na obeh enaka|na obeh različna|na drugi 0|na drugi dvojna", "Two bulbs in parallel: voltage?|same on both|different|zero on 2nd|double on 2nd"],
  [2, "Zaporedna vezava, ena žarnica pregori. Druga?|ugasne|sveti močneje|sveti enako|utripa", "Series: one bulb fails. The other?|goes out|glows brighter|glows the same|flickers"],
  [2, "Vzporedna vezava, ena žarnica pregori. Druga?|sveti naprej|ugasne|tudi pregori|utripa", "Parallel: one bulb fails. The other?|stays lit|goes out|fails too|flickers"],
  [2, "Drgnemo balon ob lase. Prenašajo se?|elektroni|protoni|nevtroni|cela jedra", "Rubbing a balloon on hair moves?|electrons|protons|neutrons|whole nuclei"],
  [2, "Dogovorjena smer toka?|od + proti −|od − proti +|v obe smeri|ni določena", "Conventional current flows?|from + to −|from − to +|both ways|not defined"],
  [2, "Napetost v hišnem omrežju?|230 V|12 V|1,5 V|1000 V", "Household mains voltage (EU)?|230 V|12 V|1.5 V|1000 V"],
  [2, "Napetost baterije AA?|1,5 V|230 V|12 V|0,1 V", "Voltage of an AA battery?|1.5 V|230 V|12 V|0.1 V"],
  [2, "Varovalka ob prevelikem toku?|prekine krog|poveča tok|poveča napetost|shrani naboj", "A fuse with too much current?|breaks the circuit|raises the current|raises the voltage|stores charge"],
  [3, "Pri zaporedni vezavi se napetosti?|seštevajo|odštevajo|izničijo|množijo", "In series, the voltages?|add up|subtract|cancel out|multiply"],
  [3, "Pri vzporedni vezavi se toki vej?|seštevajo|odštevajo|izničijo|množijo", "In parallel, branch currents?|add up|subtract|cancel out|multiply"],
  [3, "Dodamo vzporedni upornik. Skupni upor?|se zmanjša|se poveča|ostane enak|postane 0", "Add a resistor in parallel. Total R?|decreases|increases|stays the same|becomes 0"],
  [3, "Dodamo zaporedni upornik. Tok?|se zmanjša|se poveča|ostane enak|se podvoji", "Add a resistor in series. Current?|decreases|increases|stays the same|doubles"],
  [3, "Kratek stik: upor je?|zelo majhen|zelo velik|neskončen|enak žarnici", "Short circuit: resistance is?|very small|very large|infinite|same as a bulb"],
  [3, "Upor kovinske žice pri segrevanju?|se poveča|se zmanjša|ostane enak|postane 0", "Metal wire resistance when heated?|increases|decreases|stays the same|becomes 0"],
  [3, "Daljša žica (ista snov in presek): upor?|večji|manjši|enak|0", "Longer wire (same material, area): R?|larger|smaller|equal|zero"],
  [3, "Debelejša žica (ista snov in dolžina): upor?|manjši|večji|enak|0", "Thicker wire (same material, length): R?|smaller|larger|equal|zero"],
]));

def("f_magnet", "fz_ele", 9, "Magnetizem", "Magnetism", bank([
  [1, "Sila med istoimenskima poloma magnetov?|odbojna|privlačna|nič|vedno navzdol", "Force between like magnetic poles?|repulsive|attractive|zero|always downward"],
  [1, "Sila med raznoimenskima poloma?|privlačna|odbojna|nič|vedno navzdol", "Force between opposite poles?|attractive|repulsive|zero|always downward"],
  [1, "Magnet privlači?|železo|baker|aluminij|les", "A magnet attracts?|iron|copper|aluminium|wood"],
  [1, "Česa magnet ne privlači?|aluminija|železa|niklja|kobalta", "A magnet does NOT attract?|aluminium|iron|nickel|cobalt"],
  [1, "Igla kompasa kaže približno proti?|severu|vzhodu|zahodu|Luni", "A compass needle points roughly to?|north|east|west|the Moon"],
  [1, "Magnet ima vedno?|dva pola|en pol|tri pole|nobenega pola", "A magnet always has?|two poles|one pole|three poles|no poles"],
  [1, "Prelomljen magnet: vsak kos ima?|oba pola|le severni pol|le južni pol|nobenega pola", "A broken magnet: each piece has?|both poles|only a N pole|only a S pole|no poles"],
  [1, "Okoli vodnika s tokom je?|magnetno polje|zvok|svetloba|vakuum", "Around a wire with current there is?|a magnetic field|sound|light|a vacuum"],
  [1, "Elektromagnet je?|tuljava s tokom|trajni magnet|baterija|kompas", "An electromagnet is?|a coil with current|a permanent magnet|a battery|a compass"],
  [1, "Polje paličastega magneta je najmočnejše?|ob polih|na sredini|daleč stran|povsod enako", "A bar magnet's field is strongest?|at the poles|in the middle|far away|equal everywhere"],
  [1, "Elektromagnet izklopimo. Polje?|izgine|ostane enako|se okrepi|se obrne", "Switch an electromagnet off. Field?|disappears|stays the same|gets stronger|reverses"],
  [1, "Ali ima Zemlja magnetno polje?|da|ne|le ponoči|le na ekvatorju", "Does Earth have a magnetic field?|yes|no|only at night|only at the equator"],
  [2, "Elektromagnet okrepimo z?|železnim jedrom|bakrenim jedrom|lesenim jedrom|manj ovoji", "Strengthen an electromagnet with?|an iron core|a copper core|a wooden core|fewer turns"],
  [2, "Več ovojev tuljave (isti tok). Polje?|močnejše|šibkejše|enako|nič", "More turns on a coil (same current). Field?|stronger|weaker|unchanged|zero"],
  [2, "Večji tok skozi tuljavo. Polje?|močnejše|šibkejše|enako|obrnjeno", "More current in a coil. Field?|stronger|weaker|unchanged|reversed"],
  [2, "Obrnemo smer toka v tuljavi. Pola?|se zamenjata|ostaneta|izgineta|se podvojita", "Reverse the current in a coil. Poles?|swap|stay the same|disappear|double"],
  [2, "Enota gostote magnetnega polja?|T|Wb|H|V", "Unit of magnetic flux density?|T|Wb|H|V"],
  [2, "Elektromotor električno energijo pretvarja v?|mehansko|kemično|jedrsko|svetlobno", "An electric motor converts electric energy to?|mechanical|chemical|nuclear|light"],
  [2, "Generator mehansko energijo pretvarja v?|električno|kemično|jedrsko|svetlobno", "A generator converts mechanical energy to?|electrical|chemical|nuclear|light"],
  [3, "Severni pol igle kaže proti Zemljinemu?|južnemu mag. polu|severnemu mag. polu|ekvatorju|Soncu", "Compass N pole points to Earth's?|magnetic S pole|magnetic N pole|equator|Sun"],
  [3, "Inducirana napetost nastane ob?|spremembi polja|stalnem polju|stalnem toku|mirovanju magneta", "Induced voltage arises from a?|changing field|constant field|constant current|magnet at rest"],
  [3, "Transformator za delovanje potrebuje?|izmenični tok|enosmerni tok|trajni magnet|baterijo", "A transformer works with?|alternating current|direct current|a permanent magnet|a battery"],
  [3, "Sila na vodnik, vzporeden s poljem?|0|največja|polovična|odvisna od barve", "Force on a wire parallel to the field?|zero|maximal|half|depends on colour"],
  [3, "Lenzovo pravilo: induciran tok spremembi?|nasprotuje|pomaga|ne vpliva|jo podvoji", "Lenz's law: induced current and the change?|opposes it|helps it|ignores it|doubles it"],
  [3, "Polarni sij povzročajo?|delci s Sonca|Lunina svetloba|oblaki|vulkani", "Auroras are caused by?|solar wind|moonlight|clouds|volcanoes"],
  [3, "Na naboj, ki miruje v mag. polju, deluje sila?|0|največja|v smeri polja|navzgor", "Force on a charge at rest in a B field?|zero|maximal|along the field|upward"],
]));

def("f_induct", "fz_ele", 12, "Transformator in magnetna sila", "Transformers and magnetic force", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const [N1, N2, U1] = pick([[1000, 50, 230], [500, 100, 230], [200, 1000, 12], [100, 500, 24], [2000, 100, 230], [400, 1200, 6], [600, 300, 12], [1150, 60, 230]]);
    return nq(ctx, `N₁ = ${N1}, N₂ = ${N2}, U₁ = ${U1} V, U₂ = ?`, (U1 * N2) / N1, "V", [(U1 * N1) / N2, U1, U1 * N2, U1 / N1]);
  }
  if (t === 2) {
    const I = pick([1, 2, 4, 5, 10]), l = pick([0.1, 0.2, 0.5, 1]), B = pick([0.1, 0.2, 0.5, 1, 0.05]), F = I * l * B;
    return nq(ctx, L(ctx, `I = ${I} A, l = ${n(l)} m, B = ${n(B)} T (pravokotno), F = ?`, `I = ${I} A, l = ${n(l)} m, B = ${n(B)} T (perpendicular), F = ?`), F, "N", [(I * B) / l, (I * l) / B, (B * l) / I]);
  }
  if (Math.random() < 0.5) {
    const B = pick([0.1, 0.2, 0.5, 1]), l = pick([0.2, 0.5, 1, 2]), v = pick([2, 5, 10, 4]), U = B * l * v;
    return nq(ctx, L(ctx, `Vodnik l = ${n(l)} m, v = ${v} m/s, B = ${n(B)} T: Ui = ?`, `Rod l = ${n(l)} m, v = ${v} m/s, B = ${n(B)} T: induced U = ?`), U, "V", [(B * v) / l, (B * l) / v, (l * v) / B]);
  }
  const [N1, N2, I1] = pick([[100, 1000, 5], [200, 50, 1], [500, 100, 2], [100, 400, 8], [1000, 100, 0.5]]);
  return nq(ctx, L(ctx, `N₁ = ${N1}, N₂ = ${N2}, I₁ = ${n(I1)} A, I₂ = ? (idealni)`, `N₁ = ${N1}, N₂ = ${N2}, I₁ = ${n(I1)} A, I₂ = ? (ideal)`), (I1 * N1) / N2, "A", [(I1 * N2) / N1, I1, I1 * N1]);
});

// =====================================================================
// VALOVANJE, SVETLOBA, ATOM
// =====================================================================
def("f_wave", "fz_val", 12, "Valovanje (c = λ·ν)", "Waves (v = λ·f)", (t, ctx) => {
  const n = ctx.num, nu = L(ctx, "ν", "f"), c = L(ctx, "c", "v");
  if (t === 1) {
    const la = pick([0.5, 1, 2, 4, 5, 0.2]), f = pick([2, 4, 5, 10, 20, 50, 100]);
    return nq(ctx, `λ = ${n(la)} m, ${nu} = ${f} Hz, ${c} = ?`, la * f, "m/s", [la / f, f / la, la + f]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) {
      const f = pick([2, 4, 5, 10, 20, 50, 100, 0.5]);
      return nq(ctx, `${nu} = ${n(f)} Hz, T = ?`, 1 / f, "s", [f, 10 / f, 1 / (2 * f), 2 / f]);
    }
    const f = pick([170, 340, 680, 85, 1700, 34]);
    return nq(ctx, L(ctx, `Zvok: c = 340 m/s, ν = ${f} Hz, λ = ?`, `Sound: v = 340 m/s, f = ${f} Hz, λ = ?`), 340 / f, "m", [340 * f, f / 340, 340 - f]);
  }
  if (Math.random() < 0.5) {
    const f = pick([4, 5, 6, 7.5]), la = 300 / f * 10;
    return out(L(ctx, `c = 3·10⁸ m/s, ν = ${n(f)}·10¹⁴ Hz, λ = ?`, `c = 3·10⁸ m/s, f = ${n(f)}·10¹⁴ Hz, λ = ?`), `${n(la)} nm`, [`${n(la)} µm`, `${n(la)} pm`, `${n(la * 10)} nm`, `${n(la / 10)} nm`]);
  }
  const s = pick([1, 2, 3, 0.5, 4]);
  return nq(ctx, L(ctx, `Odmev po ${n(s)} s, c = 340 m/s. Razdalja do stene?`, `Echo after ${n(s)} s, v = 340 m/s. Distance to wall?`), 170 * s, "m", [340 * s, 85 * s, 340 / s]);
});

const OPTICS = bank([
  [1, "V enakorodni snovi se svetloba širi?|premočrtno|v krogih|cik-cak|le navzgor", "In a uniform medium light travels?|in straight lines|in circles|zigzag|only upward"],
  [1, "Svetilo je?|Sonce|Luna|zrcalo|knjiga", "Which is a light source?|the Sun|the Moon|a mirror|a book"],
  [1, "Luna sveti, ker?|odbija svetlobo|sama sveti|gori|je vroča", "The Moon shines because it?|reflects sunlight|makes its own light|burns|is hot"],
  [1, "Senca nastane za?|neprozornim telesom|prozornim steklom|svetilom|zrakom", "A shadow forms behind?|an opaque object|clear glass|a light source|air"],
  [1, "Ravno zrcalo: vpadni in odbojni kot?|sta enaka|sta različna|sta vedno 0°|sta vedno 90°", "Plane mirror: angles of incidence, reflection?|equal|different|always 0°|always 90°"],
  [1, "Vpadni kot merimo od?|vpadne pravokotnice|zrcala|tal|očesa", "The angle of incidence is measured from?|the normal|the mirror|the floor|the eye"],
  [1, "Slika v ravnem zrcalu je?|navidezna|realna|manjša|obrnjena navzdol", "The image in a plane mirror is?|virtual|real|smaller|upside down"],
  [1, "Zbiralna leča je na sredini?|debelejša|tanjša|ravna|votla", "A converging lens in the middle is?|thicker|thinner|flat|hollow"],
  [1, "Razpršilna leča je na sredini?|tanjša|debelejša|enako debela|votla", "A diverging lens in the middle is?|thinner|thicker|equally thick|hollow"],
  [1, "Lupa je?|zbiralna leča|razpršilna leča|ravno zrcalo|prizma", "A magnifying glass is?|a converging lens|a diverging lens|a plane mirror|a prism"],
  [1, "Mavrica nastane zaradi?|razklona svetlobe|odboja zvoka|magnetizma|vetra", "A rainbow is due to?|dispersion of light|echo|magnetism|wind"],
  [1, "Lunin mrk: med Soncem in Luno je?|Zemlja|Venera|oblak|nič", "Lunar eclipse: between Sun and Moon is?|the Earth|Venus|a cloud|nothing"],
  [1, "Sončev mrk: med Soncem in Zemljo je?|Luna|Mars|oblak|nič", "Solar eclipse: between Sun and Earth is?|the Moon|Mars|a cloud|nothing"],
  [1, "Bela svetloba je?|mešanica barv|ena sama barva|brez energije|zvok", "White light is?|a mix of colours|a single colour|energy-free|sound"],
  [2, "Iz zraka v vodo se žarek lomi?|proti pravokotnici|od pravokotnice|se ne lomi|nazaj", "From air into water a ray bends?|toward the normal|away from normal|not at all|backward"],
  [2, "Iz vode v zrak se žarek lomi?|od pravokotnice|proti pravokotnici|se ne lomi|nazaj", "From water into air a ray bends?|away from normal|toward the normal|not at all|backward"],
  [2, "Hitrost svetlobe v vakuumu?|300000 km/s|300 km/s|340 m/s|3000 km/h", "Speed of light in a vacuum?|300000 km/s|300 km/s|340 m/s|3000 km/h"],
  [2, "Svetloba je v vodi glede na vakuum?|počasnejša|hitrejša|enako hitra|ustavljena", "Light in water, compared with vacuum, is?|slower|faster|equally fast|stopped"],
  [2, "Svetloba s Sonca do Zemlje potuje okoli?|8 minut|1 sekundo|1 dan|1 leto", "Sunlight reaches Earth in about?|8 minutes|1 second|1 day|1 year"],
  [2, "Cikel Luninih men traja okoli?|29,5 dni|7 dni|365 dni|1 dan", "The Moon's phases repeat about every?|29.5 days|7 days|365 days|1 day"],
  [2, "Rdeča majica v čisto modri svetlobi je?|temna (črna)|rdeča|modra|bela", "A red shirt in pure blue light looks?|dark (black)|red|blue|white"],
  [2, "Leča z jakostjo −2 dpt je?|razpršilna|zbiralna|ravno zrcalo|prizma", "A lens of −2 D is?|diverging|converging|a plane mirror|a prism"],
  [2, "Zemlja se zavrti okoli svoje osi v?|enem dnevu|enem mesecu|enem letu|eni uri", "Earth spins once on its axis in?|one day|one month|one year|one hour"],
  [3, "Popolni odboj je možen pri prehodu v snov z?|manjšim n|večjim n|enakim n|n = 0", "Total internal reflection: into a medium with?|lower n|higher n|equal n|n = 0"],
  [3, "Lomni količnik vode je približno?|1,33|0,75|3|1", "Refractive index of water is about?|1.33|0.75|3|1"],
  [3, "Predmet med goriščem in zbiralno lečo. Slika?|navidezna, povečana|realna, pomanjšana|realna, enako velika|navidezna, manjša", "Object inside f of a converging lens. Image?|virtual, enlarged|real, smaller|real, same size|virtual, smaller"],
  [3, "Predmet na razdalji 2f od zbiralne leče. Slika?|realna, enako velika|navidezna, povečana|realna, povečana|navidezna, manjša", "Object at 2f from a converging lens. Image?|real, same size|virtual, enlarged|real, enlarged|virtual, smaller"],
  [3, "Razpršilna leča da vedno sliko?|navidezno, manjšo|realno, večjo|realno, obrnjeno|navidezno, večjo", "A diverging lens always gives an image?|virtual, smaller|real, larger|real, inverted|virtual, larger"],
  [3, "S čim popravimo kratkovidnost?|z razpršilno lečo|z zbiralno lečo|z ravnim steklom|s prizmo", "Short-sightedness is corrected with?|a diverging lens|a converging lens|flat glass|a prism"],
  [3, "S čim popravimo daljnovidnost?|z zbiralno lečo|z razpršilno lečo|z ravnim steklom|s prizmo", "Long-sightedness is corrected with?|a converging lens|a diverging lens|flat glass|a prism"],
  [3, "Nebo je modro zaradi?|sipanja svetlobe|odboja od morja|modrega plina|oblakov", "The sky is blue because of?|scattering of light|sea reflection|a blue gas|clouds"],
  [3, "Svetloba je valovanje, ki je?|elektromagnetno|mehansko|zvočno|vodno", "Light is a wave that is?|electromagnetic|mechanical|a sound wave|a water wave"],
]);
def("f_optics", "fz_val", 8, "Svetloba: odboj in lom", "Light: reflection and refraction", (t, ctx) => {
  if (t === 1 && Math.random() < 0.3) {
    const a = R(1, 8) * 10;
    return out(L(ctx, `Vpadni kot ${a}°. Odbojni kot?`, `Angle of incidence ${a}°. Angle of reflection?`), `${a}°`, [`${90 - a}°`, `${180 - a}°`, `${2 * a}°`].filter((x) => x !== `${a}°`).concat(`${a + 10}°`));
  }
  if (t === 2 && Math.random() < 0.3) {
    const b = pick([10, 20, 25, 30, 35, 40, 50, 60, 65, 70, 80]);
    return out(L(ctx, `Žarek oklepa z zrcalom ${b}°. Odbojni kot?`, `Ray makes ${b}° with the mirror. Reflection angle?`), `${90 - b}°`, [`${b}°`, `${180 - b}°`, `${90 + b}°`, `${2 * b}°`]);
  }
  return OPTICS(t, ctx);
});

const LENS = [[30, 10, 15], [20, 10, 20], [15, 10, 30], [60, 20, 30], [40, 20, 40], [30, 20, 60], [12, 4, 6], [6, 4, 12], [8, 4, 8], [24, 8, 12], [12, 8, 24], [36, 12, 18], [18, 12, 36], [20, 15, 60], [25, 20, 100], [50, 25, 50], [100, 20, 25]];
def("f_lens", "fz_val", 12, "Leče", "Lenses", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const f = pick([10, 20, 25, 50, 100, 40, 12.5]);
    if (Math.random() < 0.5) return nq(ctx, L(ctx, `Zbiralna leča f = ${n(f)} cm. Jakost leče?`, `Converging lens f = ${n(f)} cm. Lens power?`), 100 / f, L(ctx, "dpt", "D"), [f / 100, f, 10 / f, 1 / f]);
    return nq(ctx, L(ctx, `Zbiralna leča ${n(100 / f)} dpt. Goriščna razdalja?`, `Converging lens ${n(100 / f)} D. Focal length?`), f, "cm", [100 * f, f / 10, 1 / f, 100 / f]);
  }
  const [a, f, b] = pick(LENS);
  if (t === 2) return nq(ctx, L(ctx, `Zbiralna leča f = ${f} cm, a = ${a} cm, b = ?`, `Converging lens f = ${f} cm, a = ${a} cm, b = ?`), b, "cm", [a - f, a + f, (a * f) / (a + f), (a + f) / 2]);
  if (Math.random() < 0.5) return nq(ctx, L(ctx, `a = ${a} cm, b = ${b} cm, goriščna razdalja f = ?`, `a = ${a} cm, b = ${b} cm, focal length f = ?`), f, "cm", [a + b, Math.abs(a - b), (a + b) / 2, (a * b) / Math.abs(a - b)]);
  return nq(ctx, L(ctx, `f = ${f} cm, a = ${a} cm: povečava = ?`, `f = ${f} cm, a = ${a} cm: magnification = ?`), b / a, "", [a / b, b / f, a / f, f / a]);
});

def("f_halflife", "fz_val", 13, "Radioaktivni razpad", "Radioactive decay", (t, ctx) => {
  const n = ctx.num;
  if (t === 1) {
    const N0 = pick([400, 800, 1600, 1000, 640, 3200, 2000]), k = R(1, 4), N = N0 / 2 ** k;
    const sl = k === 1 ? "po 1 razpolovnem času" : `po ${k} razpolovnih časih`;
    const en = k === 1 ? "after 1 half-life" : `after ${k} half-lives`;
    return nq(ctx, L(ctx, `N₀ = ${N0} jeder, ${sl} N = ?`, `N₀ = ${N0} nuclei, ${en} N = ?`), N, "", [N0 / 2 ** (k - 1), N0 / 2 ** (k + 1), N0 - N, N0 / (2 * k)]);
  }
  if (t === 2) {
    const h = pick([2, 3, 5, 8, 10]), k = R(1, 4), p = 100 / 2 ** k;
    return nq(ctx, L(ctx, `t½ = ${h} ${h === 2 ? "dneva" : "dni"}, po ${h * k} dneh ostane ? %`, `t½ = ${h} days, after ${h * k} days ? % remains`), p, "", [100 - p, 100 / 2 ** (k + 1), 100 / 2 ** (k - 1), 100 / (2 * k)]);
  }
  const k = R(2, 4), h = pick([2, 3, 4, 5, 6, 8]), T = h * k, frac = 2 ** k;
  if (Math.random() < 0.5) return nq(ctx, L(ctx, `Po ${T} h ostane 1/${frac} snovi. t½ = ?`, `After ${T} h, 1/${frac} remains. t½ = ?`), h, "h", [T / frac, T / (k + 1), T * k, T / 2]);
  const m0 = pick([64, 80, 96, 160, 320, 48]);
  return nq(ctx, L(ctx, `m₀ = ${m0} g, t½ = ${h} h, po ${T} h m = ?`, `m₀ = ${m0} g, t½ = ${h} h, after ${T} h m = ?`), m0 / frac, "g", [m0 / 2 ** (k - 1), m0 / 2 ** (k + 1), m0 - m0 / frac, m0 / (2 * k)]);
});

// α: res α-sevalci; β⁻: res β⁻-sevalci (da naloga ne opisuje razpada, ki ga ni)
const ALPHA = [["U", 238, 92], ["U", 235, 92], ["Ra", 226, 88], ["Rn", 222, 86], ["Po", 210, 84], ["Th", 232, 90], ["Pu", 239, 94], ["Am", 241, 95]];
const BETA = [["C", 14, 6], ["Co", 60, 27], ["I", 131, 53], ["Cs", 137, 55], ["Sr", 90, 38], ["Na", 24, 11], ["Pb", 210, 82], ["P", 32, 15]];
const NUCLIDES = [["U", 238, 92], ["U", 235, 92], ["C", 12, 6], ["C", 14, 6], ["O", 16, 8], ["Fe", 56, 26], ["Pb", 206, 82], ["Ra", 226, 88], ["Co", 60, 27], ["I", 131, 53], ["Na", 23, 11], ["K", 40, 19], ["Rn", 222, 86], ["Cs", 137, 55], ["Sr", 90, 38], ["Po", 210, 84], ["Th", 232, 90]];
const ATOM = bank([
  [1, "Atomsko jedro sestavljajo?|protoni in nevtroni|elektroni in protoni|samo elektroni|fotoni", "The nucleus is made of?|protons and neutrons|electrons only|protons only|photons"],
  [1, "V elektronski ovojnici so?|elektroni|protoni|nevtroni|jedra", "The electron cloud contains?|electrons|protons|neutrons|nuclei"],
  [1, "Delec α je?|jedro helija|elektron|foton|nevtron", "An α particle is?|a helium nucleus|an electron|a photon|a neutron"],
  [1, "Delec β⁻ je?|elektron|jedro helija|foton|proton", "A β⁻ particle is?|an electron|a helium nucleus|a photon|a proton"],
  [1, "Žarki γ so?|fotoni|elektroni|protoni|jedra helija", "Gamma rays are?|photons|electrons|protons|helium nuclei"],
  [1, "Najbolj prodorno sevanje?|γ|α|β⁻|vsa enako", "Most penetrating radiation?|γ|α|β⁻|all equal"],
  [1, "Najmanj prodorno sevanje?|α|γ|β⁻|vsa enako", "Least penetrating radiation?|α|γ|β⁻|all equal"],
  [1, "Izotopa istega elementa se razlikujeta v?|številu nevtronov|številu protonov|vrstnem številu|imenu elementa", "Two isotopes of an element differ in?|neutron number|proton number|atomic number|element name"],
  [1, "Masno število A pove število?|nukleonov|protonov|elektronov|nevtronov", "Mass number A counts?|nucleons|protons|electrons|neutrons"],
  [1, "Vrstno število Z pove število?|protonov|nevtronov|nukleonov|izotopov", "Atomic number Z counts?|protons|neutrons|nucleons|isotopes"],
  [1, "V enem razpolovnem času razpade?|polovica jeder|vsa jedra|četrtina jeder|eno jedro", "In one half-life, what decays?|half the nuclei|all nuclei|a quarter|one nucleus"],
  [1, "Jedrske elektrarne izkoriščajo?|cepitev jeder|zlivanje jeder|gorenje premoga|sončno sevanje", "Nuclear power plants use?|nuclear fission|nuclear fusion|burning coal|sunlight"],
  [1, "Sonce sveti zaradi?|zlivanja jeder|cepitve jeder|gorenja plina|elektrike", "The Sun shines due to?|nuclear fusion|nuclear fission|burning gas|electricity"],
  [2, "Energija fotona je sorazmerna?|s frekvenco|z valovno dolžino|s hitrostjo|z maso", "Photon energy is proportional to?|frequency|wavelength|speed|mass"],
  [2, "Fotoefekt: svetloba iz kovine izbije?|elektrone|protone|nevtrone|jedra", "Photoelectric effect: light ejects?|electrons|protons|neutrons|nuclei"],
  [2, "Večja frekvenca svetlobe: energija fotona?|večja|manjša|enaka|0", "Higher light frequency: photon energy?|larger|smaller|the same|zero"],
  [2, "Najbolj energijski fotoni vidne svetlobe?|vijolični|rdeči|rumeni|zeleni", "Most energetic visible photons?|violet|red|yellow|green"],
  [2, "Pogosta enota energije v atomski fiziki?|eV|V|W|N", "Common energy unit in atomic physics?|eV|V|W|N"],
  [3, "Pri razpadu α se Z?|zmanjša za 2|zmanjša za 4|poveča za 1|ne spremeni", "In α decay, Z?|decreases by 2|decreases by 4|increases by 1|stays the same"],
  [3, "Pri razpadu β⁻ se Z?|poveča za 1|zmanjša za 1|zmanjša za 2|ne spremeni", "In β⁻ decay, Z?|increases by 1|decreases by 1|decreases by 2|stays the same"],
  [3, "Pri sevanju γ se A?|ne spremeni|zmanjša za 4|poveča za 1|zmanjša za 2", "In γ emission, A?|stays the same|decreases by 4|increases by 1|decreases by 2"],
  [3, "Pri razpadu β⁻ se v jedru nevtron spremeni v?|proton|pozitron|foton|delec α", "In β⁻ decay a neutron becomes a?|proton|positron|photon|α particle"],
]);
def("f_atom", "fz_val", 13, "Atom in jedro", "Atom and nucleus", (t, ctx) => {
  const n = ctx.num;
  const [s, A, Z] = pick(NUCLIDES);
  if (t === 1 && Math.random() < 0.4) return nq(ctx, L(ctx, `${s}-${A} (Z = ${Z}): število nevtronov?`, `${s}-${A} (Z = ${Z}): number of neutrons?`), A - Z, "", [A, Z, A + Z]);
  if (t === 2 && Math.random() < 0.4) {
    const [la, E] = pick([[620, 2], [310, 4], [248, 5], [1240, 1], [496, 2.5], [400, 3.1], [155, 8], [124, 10]]);
    return nq(ctx, L(ctx, `λ = ${la} nm, E fotona = ? (hc = 1240 eV·nm)`, `λ = ${la} nm, photon E = ? (hc = 1240 eV·nm)`), E, "eV", [la / 1240, 1240 * la, E * 10, E / 10]);
  }
  if (t === 3 && Math.random() < 0.5) {
    const AZ = (a, z) => `A = ${a}, Z = ${z}`;
    if (Math.random() < 0.5) {
      const [, A, Z] = pick(ALPHA);
      return out(L(ctx, `Razpad α: A = ${A}, Z = ${Z} → ?`, `α decay: A = ${A}, Z = ${Z} → ?`), AZ(A - 4, Z - 2), [AZ(A - 2, Z - 4), AZ(A - 4, Z + 2), AZ(A, Z + 1), AZ(A - 4, Z)]);
    }
    const [, B, Zb] = pick(BETA);
    return out(L(ctx, `Razpad β⁻: A = ${B}, Z = ${Zb} → ?`, `β⁻ decay: A = ${B}, Z = ${Zb} → ?`), AZ(B, Zb + 1), [AZ(B, Zb - 1), AZ(B - 1, Zb + 1), AZ(B + 1, Zb), AZ(B - 4, Zb - 2)]);
  }
  return ATOM(t, ctx);
});

export const AREAS = [
  ["fz_mer", { sl: "Merjenje in enote", en: "Measurement and units" }, "#64748b"],
  ["fz_gib", { sl: "Gibanje", en: "Motion" }, "#0ea5e9"],
  ["fz_sil", { sl: "Sile in tekočine", en: "Forces and fluids" }, "#6366f1"],
  ["fz_ene", { sl: "Delo, energija, gibalna količina", en: "Work, energy, momentum" }, "#f59e0b"],
  ["fz_top", { sl: "Toplota", en: "Heat" }, "#ef4444"],
  ["fz_ele", { sl: "Elektrika in magnetizem", en: "Electricity and magnetism" }, "#eab308"],
  ["fz_val", { sl: "Valovanje, svetloba, atom", en: "Waves, light, atoms" }, "#a855f7"],
];
export const CONCEPTS = C;
