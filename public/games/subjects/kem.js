// Pojmi za igre: kem (glej README.md v tej mapi).
// Molske mase s šolskimi zaokroženimi relativnimi atomskimi masami:
// H 1, C 12, N 14, O 16, Na 23, Mg 24, Al 27, P 31, S 32, Cl 35,5, K 39, Ca 40, Fe 56, Cu 63,5.
// Molska prostornina plina pri 0 °C in 101,3 kPa: 22,4 L/mol; N_A = 6,02 · 10²³ mol⁻¹.
export const AREAS = [
  ["km_atom", { sl: "Atom in periodni sistem", en: "Atoms and the periodic table" }, "#0ea5e9"],
  ["km_spo", { sl: "Ioni, formule in imena", en: "Ions, formulas and names" }, "#6366f1"],
  ["km_kol", { sl: "Množina snovi in raztopine", en: "Amount of substance and solutions" }, "#f97316"],
  ["km_rea", { sl: "Kemijske reakcije in redoks", en: "Chemical reactions and redox" }, "#ef4444"],
  ["km_kb", { sl: "Kisline, baze in soli", en: "Acids, bases and salts" }, "#22c55e"],
  ["km_org", { sl: "Organska kemija", en: "Organic chemistry" }, "#a855f7"],
  ["km_vez", { sl: "Vezi in snovi", en: "Bonds and matter" }, "#eab308"],
];

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
const SUBS = "₀₁₂₃₄₅₆₇₈₉", SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sub = (s) => String(s).replace(/\d/g, (d) => SUBS[d]);
const sup = (s) => String(s).replace(/\d/g, (d) => SUPS[d]).replace(/\+/g, "⁺").replace(/-/g, "⁻");
// "Ca3(PO4)2" → "Ca₃(PO₄)₂", "SO4^2-" → "SO₄²⁻", "->" → "→"
const F = (s) =>
  s
    .replace(/\^(\d*[+-])/g, (_, c) => sup(c))
    .replace(/([A-Za-z)\]])(\d+)/g, (_, l, d) => l + sub(d))
    .replace(/<=>/g, "⇌")
    .replace(/->/g, "→");
// "slovensko|english" → izbrani jezik
const L = (ctx, s) => (typeof s === "string" && s.includes("|") ? s.split("|")[ctx.lang === "sl" ? 0 : 1] : s);
// naloga: napačni brez podvajanja in brez pravilnega; najprej ws (tipične napake), nato pool
function mk(q, a, ws, pool = []) {
  const seen = new Set([String(a)]);
  const out = [];
  for (const w of [...ws, ...shuffle(pool)]) {
    if (w == null || w === "") continue;
    const s = String(w);
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  if (out.length < 3) throw new Error("premalo napačnih: " + q);
  return { q, a: String(a), w: shuffle(out.slice(0, 3)) };
}
// celoštevilski odgovor; dopolni z bližnjimi nenegativnimi števili
function ints(q, a, ws, min = 0) {
  const near = [1, -1, 2, -2, 3, -3, 4, 5].map((d) => a + d).filter((x) => x >= min);
  return mk(q, String(a), ws.filter((x) => Number.isInteger(x) && x >= min).map(String), near.map(String));
}
// številski odgovor z enoto; napačni so tipične napake (števila), dopolni s faktorji
function numU(ctx, q, a, ws, unit = "") {
  const f = (x) => ctx.num(Math.round(x * 1000) / 1000) + (unit ? " " + unit : "");
  const ok = (x) => Number.isFinite(x) && x > 0 && Math.abs(x - a) > 1e-9 && Math.abs(Math.round(x * 1000) - x * 1000) < 1e-6;
  return mk(q, f(a), ws.filter(ok).map(f), [a * 2, a / 2, a * 10, a / 10, a + 1, a * 3].filter(ok).map(f));
}
// banka: [vprašanje, pravilni, napačni …] v obliki "sl|en"
function bank(ctx, items) {
  const [q, a, ...ws] = pick(items).map((s) => L(ctx, s));
  return mk(q, a, shuffle(ws));
}
// "Kateri je X?": pravilni iz yes, napačni iz no
function which(ctx, q, yes, no) {
  return mk(L(ctx, q), L(ctx, pick(yes)), shuffle(no).map((s) => L(ctx, s)));
}

const C = [];
const def = (id, area, year, sl, en, gen) => C.push({ id, area, year, name: { sl, en }, gen });

// ===== ATOM IN PERIODNI SISTEM =====
// [simbol, sl, en, Z, zamenljivi simboli]
const EL = [
  ["H", "vodik", "hydrogen", 1, ["He", "Hg", "V", "Hy"]],
  ["He", "helij", "helium", 2, ["H", "Hl", "Hg", "Ha"]],
  ["Li", "litij", "lithium", 3, ["L", "Lt", "Lu", "Ti"]],
  ["Be", "berilij", "beryllium", 4, ["B", "Br", "Ba", "Bi"]],
  ["B", "bor", "boron", 5, ["Bo", "Br", "Be", "Ba"]],
  ["C", "ogljik", "carbon", 6, ["Ca", "Co", "O", "Cb"]],
  ["N", "dušik", "nitrogen", 7, ["Na", "Ne", "D", "Ni"]],
  ["O", "kisik", "oxygen", 8, ["K", "Ox", "Os", "Ki"]],
  ["F", "fluor", "fluorine", 9, ["Fl", "Fe", "Fr", "Fu"]],
  ["Ne", "neon", "neon", 10, ["N", "Na", "Ni", "Nn"]],
  ["Na", "natrij", "sodium", 11, ["N", "Ne", "So", "Sd"]],
  ["Mg", "magnezij", "magnesium", 12, ["Mn", "Ma", "M", "Mz"]],
  ["Al", "aluminij", "aluminium", 13, ["Ag", "Au", "Ar", "Am"]],
  ["Si", "silicij", "silicon", 14, ["S", "Sc", "Sn", "Sl"]],
  ["P", "fosfor", "phosphorus", 15, ["Pb", "F", "Po", "Ph"]],
  ["S", "žveplo", "sulfur", 16, ["Si", "Sn", "Su", "Sr"]],
  ["Cl", "klor", "chlorine", 17, ["C", "Kl", "Ca", "Co"]],
  ["Ar", "argon", "argon", 18, ["Ag", "Al", "Au", "Am"]],
  ["K", "kalij", "potassium", 19, ["Ka", "Ca", "P", "Kr"]],
  ["Ca", "kalcij", "calcium", 20, ["K", "C", "Ka", "Cd"]],
  ["Fe", "železo", "iron", 26, ["F", "Ir", "Fr", "Ze"]],
  ["Cu", "baker", "copper", 29, ["C", "Co", "Ba", "Cr"]],
  ["Zn", "cink", "zinc", 30, ["Z", "Ci", "Sn", "Zr"]],
  ["Ag", "srebro", "silver", 47, ["Au", "Al", "Sr", "Si"]],
  ["Au", "zlato", "gold", 79, ["Ag", "Al", "Zl", "Go"]],
  ["Pb", "svinec", "lead", 82, ["P", "Sv", "Pt", "Le"]],
  ["Hg", "živo srebro", "mercury", 80, ["H", "He", "Ag", "Me"]],
  ["Sn", "kositer", "tin", 50, ["S", "Si", "Ti", "Ko"]],
  ["I", "jod", "iodine", 53, ["J", "Io", "In", "Id"]],
  ["Br", "brom", "bromine", 35, ["B", "Bo", "Be", "Ba"]],
  ["Mn", "mangan", "manganese", 25, ["Mg", "Ma", "Mo", "Ng"]],
  ["Ba", "barij", "barium", 56, ["B", "Br", "Be", "Bi"]],
];
const el = (s) => EL.find((e) => e[0] === s);
const elName = (ctx, e) => (ctx.lang === "sl" ? e[1] : e[2]);
const SYM1 = ["H", "He", "Li", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Fe", "Cu"];
const SYM3 = ["Fe", "Cu", "Zn", "Ag", "Au", "Pb", "Hg", "Sn", "I", "Br", "Mn", "Ba", "K", "Na", "Si", "P", "S", "Cl"];
def("k_sym", "km_atom", 8, "Simboli elementov", "Element symbols", (t, ctx) => {
  if (t === 2) {
    const e = el(pick(EL.map((x) => x[0])));
    const same = EL.filter((x) => x !== e && (x[0][0] === e[0][0] || e[4].includes(x[0])));
    const q = ctx.lang === "sl" ? `Ime elementa ${e[0]}?` : `Element ${e[0]}?`;
    return mk(q, elName(ctx, e), shuffle(same).map((x) => elName(ctx, x)), EL.filter((x) => x !== e).map((x) => elName(ctx, x)));
  }
  const e = el(pick(t === 1 ? SYM1 : SYM3));
  const q = ctx.lang === "sl" ? `Simbol za ${e[1]}?` : `Symbol for ${e[2]}?`;
  return mk(q, e[0], shuffle(e[4]));
});

// [simbol, Z, A]
const ISO1 = [["H", 1, 1], ["H", 1, 2], ["He", 2, 4], ["Li", 3, 7], ["Be", 4, 9], ["B", 5, 11], ["C", 6, 12], ["C", 6, 14], ["N", 7, 14], ["O", 8, 16], ["F", 9, 19], ["Ne", 10, 20], ["Na", 11, 23], ["Mg", 12, 24], ["Al", 13, 27], ["Si", 14, 28], ["P", 15, 31], ["S", 16, 32], ["Cl", 17, 35], ["Ar", 18, 40], ["K", 19, 39], ["Ca", 20, 40]];
const ISO2 = [["H", 1, 3], ["C", 6, 13], ["N", 7, 15], ["O", 8, 18], ["Mg", 12, 26], ["Cl", 17, 37], ["K", 19, 40], ["Fe", 26, 56], ["Cu", 29, 63], ["Cu", 29, 65], ["Zn", 30, 64], ["Br", 35, 79], ["Ag", 47, 107], ["I", 53, 127], ["Au", 79, 197], ["Pb", 82, 208], ["U", 92, 235], ["U", 92, 238]];
// [simbol, Z, A, naboj]
const IONS_A = [["Na", 11, 23, 1], ["Mg", 12, 24, 2], ["Al", 13, 27, 3], ["O", 8, 16, -2], ["F", 9, 19, -1], ["S", 16, 32, -2], ["Cl", 17, 35, -1], ["K", 19, 39, 1], ["Ca", 20, 40, 2], ["N", 7, 14, -3], ["Li", 3, 7, 1], ["Fe", 26, 56, 2], ["Fe", 26, 56, 3], ["Cu", 29, 63, 2], ["Zn", 30, 64, 2]];
const nuc = (s, Z, A, ch = 0) => `${sup(A)}${sub(Z)}${s}${ch ? sup((Math.abs(ch) > 1 ? Math.abs(ch) : "") + (ch > 0 ? "+" : "-")) : ""}`;
def("k_atom", "km_atom", 8, "Protoni, nevtroni, elektroni", "Protons, neutrons, electrons", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const P = sl ? "protonov" : "Protons", N = sl ? "nevtronov" : "Neutrons", E = sl ? "elektronov" : "Electrons";
  const ask = (what, x) => (sl ? `Število ${what} v ${x}?` : `${what} in ${x}?`);
  if (t === 3) {
    if (Math.random() < 0.35) {
      const [s, Z, A] = pick([...ISO1, ...ISO2].filter((x) => x[2] > x[1]));
      const n = A - Z;
      return ints(sl ? `Masno število: ${Z} p⁺ in ${n} n⁰?` : `Mass number: ${Z} p⁺ and ${n} n⁰?`, A, [Z, n, Math.abs(n - Z), A + Z]);
    }
    const [s, Z, A, ch] = pick(IONS_A);
    const x = nuc(s, Z, A, ch);
    if (Math.random() < 0.7) return ints(ask(E, x), Z - ch, [Z, Z + ch, A - Z, A]);
    return ints(ask(N, x), A - Z, [Z, A, A - Z + ch, Z - ch]);
  }
  const [s, Z, A] = pick(t === 1 ? ISO1 : [...ISO1, ...ISO2, ...ISO2]);
  const x = nuc(s, Z, A);
  const k = R(0, 2);
  if (k === 0) return ints(ask(P, x), Z, [A, A - Z, A + Z]);
  if (k === 1) return ints(ask(N, x), A - Z, [A, Z, A + Z]);
  return ints(ask(E, x), Z, [A, A - Z, Z + 1]);
});

// razporeditev po lupinah za Z ≤ 20
const shells = (Z) => {
  const s = [Math.min(Z, 2)];
  if (Z > 2) s.push(Math.min(Z - 2, 8));
  if (Z > 10) s.push(Math.min(Z - 10, 8));
  if (Z > 18) s.push(Z - 18);
  return s;
};
const shStr = (a) => a.join(", ");
const valence = (Z) => shells(Z).at(-1);
const BYZ = (Z) => EL.find((e) => e[3] === Z);
def("k_shell", "km_atom", 8, "Elektronske lupine", "Electron shells", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const Z = R(t === 2 ? 1 : 3, 20), e = BYZ(Z), s = shells(Z);
  if (t === 1) {
    const ws = [shells(Z - 1), shells(Z + 1 > 20 ? Z - 2 : Z + 1)].map(shStr);
    if (s.length > 1) ws.push(shStr([...s].reverse()), shStr([...s.slice(0, -1), s.at(-1) + 1]));
    if (Z > 18) ws.push(shStr([2, 8, Z - 10]));
    if (s.length === 2) ws.push(shStr([2, s[1] - 1, 1]), shStr([Z]));
    if (Z > 10) ws.push(shStr([2, Z - 2]));
    return mk(sl ? `Elektroni po lupinah: ${e[0]}?` : `Electrons per shell: ${e[0]}?`, shStr(s), shuffle(ws));
  }
  if (t === 2) {
    const v = valence(Z);
    return ints(sl ? `Število zunanjih elektronov: ${e[0]}?` : `Valence electrons: ${e[0]}?`, v, [Z, s.length, 8 - v, v + 10, v + 1], 1);
  }
  const ws = [BYZ(Z - 1), BYZ(Z + 1), BYZ(Z + 8), BYZ(Z - 8), BYZ(Z > 10 ? Z - 2 : Z + 2)].filter((x) => x && x[3] <= 20).map((x) => x[0]);
  return mk(sl ? `Element z razporeditvijo ${shStr(s)}?` : `Element with shells ${shStr(s)}?`, e[0], ws, ["Na", "Mg", "Cl", "O", "C", "N"]);
});

// elektronska konfiguracija (Z ≤ 30)
const ORB = [["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6], ["4s", 2], ["3d", 10]];
const DISP = ["1s", "2s", "2p", "3s", "3p", "3d", "4s"];
const CORE = { He: ["1s"], Ne: ["1s", "2s", "2p"], Ar: ["1s", "2s", "2p", "3s", "3p"] };
function confObj(Z) {
  const o = {};
  let left = Z;
  for (const [k, c] of ORB) {
    if (left <= 0) break;
    o[k] = Math.min(c, left);
    left -= o[k];
  }
  if (Z === 24 || Z === 29) Object.assign(o, { "3d": Z === 24 ? 5 : 10, "4s": 1 });
  return o;
}
const confStr = (o, core) => {
  const skip = CORE[core] || [];
  return [core ? `[${core}]` : "", ...DISP.filter((k) => o[k] && !skip.includes(k)).map((k) => k + sup(o[k]))].filter(Boolean).join(" ");
};
const coreOf = (Z) => (Z > 18 ? "Ar" : Z > 10 ? "Ne" : "");
const TM = [[21, "Sc"], [22, "Ti"], [23, "V"], [24, "Cr"], [25, "Mn"], [26, "Fe"], [27, "Co"], [28, "Ni"], [29, "Cu"], [30, "Zn"]];
const SYMZ = (Z) => (BYZ(Z) || [TM.find((x) => x[0] === Z)?.[1]])[0];
def("k_conf", "km_atom", 10, "Elektronska konfiguracija", "Electron configuration", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const ask = (x) => (sl ? `Elektronska konfiguracija ${x}?` : `Electron configuration of ${x}?`);
  if (t === 1) {
    const Z = R(2, 13), o = confObj(Z);
    const ws = [confStr(confObj(Z - 1)), confStr(confObj(Z + 1)), confStr(confObj(Z === 2 ? 4 : Z - 2))];
    if (Z >= 5) ws.push(confStr({ "1s": 2, "2p": Z - 2 }));
    if (Z >= 3) ws.push(confStr({ "1s": 2, "2s": Z - 2 }));
    return mk(ask(SYMZ(Z)), confStr(o), shuffle(ws));
  }
  if (t === 2) {
    const Z = R(11, 20), c = coreOf(Z);
    const ws = [confStr(confObj(Z - 1), coreOf(Z - 1)), confStr(confObj(Z + 1), coreOf(Z + 1)), confStr(confObj(Z - 2), coreOf(Z - 2))];
    if (Z >= 19) ws.push(confStr({ "3d": Z - 18 }, "Ar"), confStr({ "3s": 2, "3p": 6, "3d": Z - 18 }, "Ne"));
    else ws.push(confStr({ ...confObj(Z), "3s": undefined, "3p": Z - 10 }, "Ne"));
    return mk(ask(SYMZ(Z)), confStr(confObj(Z), c), shuffle(ws));
  }
  if (Math.random() < 0.3) {
    // ioni: najprej odide 4s
    const [Z, s, ch] = pick([[26, "Fe", 2], [26, "Fe", 3], [29, "Cu", 2], [30, "Zn", 2], [25, "Mn", 2], [28, "Ni", 2], [27, "Co", 2]]);
    const o = confObj(Z), d = o["3d"], s4 = o["4s"];
    const right = { "3d": d - (ch - s4), "4s": 0 };
    const ws = [confStr({ "3d": d - ch, "4s": s4 }, "Ar"), confStr(o, "Ar"), confStr({ "3d": right["3d"] - 1 }, "Ar"), right["3d"] < 10 ? confStr({ "3d": right["3d"] + 1 }, "Ar") : null];
    return mk(ask(s + sup((ch > 1 ? ch : "") + "+")), confStr(right, "Ar"), shuffle(ws));
  }
  const [Z, s] = pick([...TM, [24, "Cr"], [29, "Cu"]]);
  const o = confObj(Z);
  const special = Z === 24 ? [confStr({ "3d": 4, "4s": 2 }, "Ar")] : Z === 29 ? [confStr({ "3d": 9, "4s": 2 }, "Ar")] : [];
  const ws = [confStr({ "3d": Z - 18 }, "Ar"), confStr(confObj(Z - 1), "Ar"), Z < 30 ? confStr(confObj(Z + 1), "Ar") : null, Z > 21 ? confStr({ "3d": Z - 20 }, "Ar") : null];
  return mk(ask(s), confStr(o, "Ar"), [...special, ...shuffle(ws)]);
});

const METALS = ["Na", "K", "Mg", "Ca", "Al", "Fe", "Cu", "Zn", "Li", "Ag"];
const NONMET = ["O", "N", "S", "Cl", "C", "P", "F", "H", "Br", "I"];
const NOBLE = ["He", "Ne", "Ar", "Kr"];
const HALO = ["F", "Cl", "Br", "I"];
const ALK = ["Li", "Na", "K"];
const EARTH = ["Be", "Mg", "Ca", "Ba"];
// [simbol, perioda, skupina 1–18]
const PG = [["H", 1, 1], ["He", 1, 18], ["Li", 2, 1], ["Be", 2, 2], ["B", 2, 13], ["C", 2, 14], ["N", 2, 15], ["O", 2, 16], ["F", 2, 17], ["Ne", 2, 18], ["Na", 3, 1], ["Mg", 3, 2], ["Al", 3, 13], ["Si", 3, 14], ["P", 3, 15], ["S", 3, 16], ["Cl", 3, 17], ["Ar", 3, 18], ["K", 4, 1], ["Ca", 4, 2], ["Fe", 4, 8], ["Cu", 4, 11], ["Zn", 4, 12], ["Br", 4, 17]];
const TRENDS = [
  [["Li", "Be", "B", "C", "N", "O", "F"], "p"], [["Na", "Mg", "Al", "Si", "P", "S", "Cl"], "p"],
  [["Li", "Na", "K", "Rb", "Cs"], "g"], [["Be", "Mg", "Ca", "Sr", "Ba"], "g"], [["F", "Cl", "Br", "I"], "g"],
];
def("k_pse", "km_atom", 8, "Periodni sistem", "Periodic table", (t, ctx) => {
  const sl = ctx.lang === "sl";
  if (t === 1) {
    const k = R(0, 6);
    if (k === 0) return which(ctx, "Kateri element je kovina?|Which element is a metal?", METALS, [...NONMET, ...NOBLE]);
    if (k === 1) return which(ctx, "Kateri element je nekovina?|Which element is a non-metal?", NONMET, METALS);
    if (k === 2) return which(ctx, "Kateri element je žlahtni plin?|Which element is a noble gas?", NOBLE, ["H", "O", "N", "Cl", "F", "Na"]);
    if (k === 3) return which(ctx, "Kateri element je halogen?|Which element is a halogen?", HALO, ["O", "N", "S", "Ne", "Na", "H", "Ar"]);
    if (k === 4) return which(ctx, "Kateri element je alkalijska kovina?|Which element is an alkali metal?", ALK, ["H", "Mg", "Ca", "Al", "Be", "Ba"]);
    const [s, p, g] = pick(PG.filter((x) => x[1] <= 4 && x[2] !== 8 && x[2] !== 11 && x[2] !== 12));
    return ints(sl ? `Perioda elementa ${s}?` : `Period of ${s}?`, p, [g, g > 10 ? g - 10 : g + 1, p + 1, p - 1], 1);
  }
  if (t === 2) {
    if (Math.random() < 0.6) {
      const [s, p, g] = pick(PG);
      return ints(sl ? `Skupina (1–18) elementa ${s}?` : `Group (1–18) of ${s}?`, g, [g > 10 ? g - 10 : g + 10, p, el(s)?.[3] ?? g + 1, g + 1, g - 1], 1);
    }
    const [s, p, g] = pick(PG.filter((x) => x[2] !== 8 && x[2] !== 11 && x[2] !== 12 && x[0] !== "H" && x[0] !== "He"));
    const ws = PG.filter((x) => (x[1] === p && Math.abs(x[2] - g) <= 1 && x[2] !== g) || (x[2] === g && x[1] !== p)).map((x) => x[0]);
    return mk(sl ? `Element v ${p}. periodi in ${g}. skupini?` : `Element in period ${p}, group ${g}?`, s, shuffle(ws), PG.filter((x) => x[0] !== s).map((x) => x[0]));
  }
  const k = R(0, 2);
  // EN v 1. skupini ni strogo padajoča (K in Rb imata 0,82), zato je tam ne sprašujemo
  const [set, kind] = pick(k === 1 ? TRENDS.filter((x) => x[0][0] !== "Li" || x[1] === "p") : TRENDS);
  // IE v periodi ni monotona (Be > B, N > O, Mg > Al, P > S): zato vedno vključimo alkalijsko kovino (najmanjša IE)
  const idx = (k === 2 && kind === "p" ? [0, ...shuffle(set.map((_, i) => i).slice(1)).slice(0, 3)] : shuffle(set.map((_, i) => i)).slice(0, 4)).sort((a, b) => a - b);
  const lowFirst = kind === "p" ? k !== 1 : k === 1; // polmer, IE v periodi: levo; EN v skupini: zgoraj
  const right = set[lowFirst ? idx[0] : idx[3]];
  const q = [
    "Največji polmer atoma?|Largest atomic radius?",
    "Največja elektronegativnost?|Highest electronegativity?",
    "Najmanjša ionizacijska energija?|Lowest ionization energy?",
  ][k];
  return mk(L(ctx, q), right, idx.map((i) => set[i]).filter((s) => s !== right));
});

// ===== IONI, FORMULE IN IMENA =====
const chg = (c) => (Math.abs(c) > 1 ? Math.abs(c) : "") + (c > 0 ? "+" : "-");
const ion = (s, c) => F(`${s}^${chg(c)}`);
// [simbol, naboj, ime iona sl, en]
const MONO = [
  ["Na", 1, "natrijev ion", "sodium ion"], ["K", 1, "kalijev ion", "potassium ion"], ["Li", 1, "litijev ion", "lithium ion"],
  ["Mg", 2, "magnezijev ion", "magnesium ion"], ["Ca", 2, "kalcijev ion", "calcium ion"], ["Al", 3, "aluminijev ion", "aluminium ion"],
  ["Cl", -1, "kloridni ion", "chloride ion"], ["F", -1, "fluoridni ion", "fluoride ion"], ["Br", -1, "bromidni ion", "bromide ion"],
  ["I", -1, "jodidni ion", "iodide ion"], ["O", -2, "oksidni ion", "oxide ion"], ["S", -2, "sulfidni ion", "sulfide ion"],
  ["N", -3, "nitridni ion", "nitride ion"],
];
const TRANS = [
  ["Fe", 2, "železov(II) ion", "iron(II) ion"], ["Fe", 3, "železov(III) ion", "iron(III) ion"], ["Cu", 2, "bakrov(II) ion", "copper(II) ion"],
  ["Cu", 1, "bakrov(I) ion", "copper(I) ion"], ["Ag", 1, "srebrov ion", "silver ion"], ["Zn", 2, "cinkov ion", "zinc ion"],
  ["Pb", 2, "svinčev(II) ion", "lead(II) ion"], ["Ba", 2, "barijev ion", "barium ion"],
];
const wrongCharges = (s, c) => [-c, c > 0 ? c + 1 : c - 1, c > 0 ? c - 8 : 8 + c, Math.abs(c) > 1 ? Math.sign(c) : 2 * c, c > 0 ? c - 1 : c + 1].filter((x) => x && x !== c && Math.abs(x) <= 7).map((x) => ion(s, x));
def("k_ion", "km_spo", 8, "Ioni in naboji", "Ions and charges", (t, ctx) => {
  const sl = ctx.lang === "sl";
  if (t === 1) {
    const [s, c] = pick(MONO.filter((x) => Math.abs(x[1]) < 3));
    return mk(sl ? `Ion, ki ga tvori ${s}?` : `Ion formed by ${s}?`, ion(s, c), shuffle(wrongCharges(s, c)));
  }
  if (t === 2) {
    const [s, c, nsl, nen] = pick(MONO);
    if (Math.random() < 0.4) return mk(sl ? `Ion, ki ga tvori ${s}?` : `Ion formed by ${s}?`, ion(s, c), shuffle(wrongCharges(s, c)));
    const extra = { S: [F("SO4^2-"), F("SO3^2-")], N: [F("NO3^-"), F("NO2^-")], Cl: [F("ClO3^-"), "Cl₂"], O: [F("OH^-"), "O₂"] }[s] || [];
    return mk(`${sl ? nsl[0].toUpperCase() + nsl.slice(1) : nen[0].toUpperCase() + nen.slice(1)}?`, ion(s, c), [...shuffle(extra).slice(0, 1), ...shuffle(wrongCharges(s, c))]);
  }
  if (Math.random() < 0.5) {
    const [s, c, nsl, nen] = pick(TRANS);
    const name = sl ? nsl : nen;
    const sibling = TRANS.filter((x) => x[0] === s && x[1] !== c).map((x) => ion(x[0], x[1]));
    const other = { Ag: "Au", Zn: "Sn", Pb: "P", Ba: "B", Fe: "F", Cu: "Co" }[s];
    return mk(`${name[0].toUpperCase() + name.slice(1)}?`, ion(s, c), [...sibling, ion(other, c), ...shuffle(wrongCharges(s, c))]);
  }
  // ion iz števila protonov in elektronov
  const [s, Z, , c] = pick(IONS_A.filter((x) => x[1] <= 20));
  const e = Z - c;
  const ws = [s, ion(s, -c)];
  for (const d of [-1, 1, -2, 2]) {
    const n = BYZ(Z + d);
    if (n && n[3] <= 20 && Z + d - e !== 0) ws.push(ion(n[0], Z + d - e));
  }
  return mk(`${Z} p⁺, ${e} e⁻ → ?`, ion(s, c), shuffle(ws));
});

// [formula z nabojem, sl, en, napačni …]
const POLY1 = [
  ["SO4^2-", "Sulfatni ion", "Sulfate ion", "SO3^2-", "S^2-", "SO4^-", "SO4^3-"],
  ["NO3^-", "Nitratni ion", "Nitrate ion", "NO2^-", "N^3-", "NO3^2-", "NO4^-"],
  ["CO3^2-", "Karbonatni ion", "Carbonate ion", "HCO3^-", "CO2^2-", "CO3^-", "C^4-"],
  ["PO4^3-", "Fosfatni ion", "Phosphate ion", "PO3^3-", "PO4^2-", "P^3-", "PO4^-"],
  ["OH^-", "Hidroksidni ion", "Hydroxide ion", "O^2-", "H^+", "OH^2-", "H3O^+"],
  ["NH4^+", "Amonijev ion", "Ammonium ion", "NH3", "NH4^-", "NH3^+", "NH2^-"],
];
const POLY2 = [
  ["SO3^2-", "Sulfitni ion", "Sulfite ion", "SO4^2-", "S^2-", "SO3^-", "SO2^2-"],
  ["NO2^-", "Nitritni ion", "Nitrite ion", "NO3^-", "N^3-", "NO2^2-", "NO^-"],
  ["HCO3^-", "Hidrogenkarbonatni ion", "Hydrogencarbonate ion", "CO3^2-", "HCO3^2-", "H2CO3", "HCO2^-"],
  ["H3O^+", "Oksonijev ion", "Oxonium ion", "H2O", "OH^-", "H3O^-", "H2O^+"],
  ["CH3COO^-", "Acetatni ion", "Acetate ion", "CH3COOH", "HCOO^-", "CH3COO^2-", "CH3CO^-"],
];
const POLY3 = [
  ["MnO4^-", "Permanganatni ion", "Permanganate ion", "MnO4^2-", "MnO2", "Mn^2+", "MnO3^-"],
  ["Cr2O7^2-", "Dikromatni ion", "Dichromate ion", "CrO4^2-", "Cr2O7^-", "Cr^3+", "Cr2O4^2-"],
  ["ClO3^-", "Kloratni ion", "Chlorate ion", "ClO4^-", "Cl^-", "ClO^-", "ClO3^2-"],
  ["ClO^-", "Hipokloritni ion", "Hypochlorite ion", "Cl^-", "ClO3^-", "ClO2^-", "ClO^2-"],
  ["CN^-", "Cianidni ion", "Cyanide ion", "CN^2-", "C^4-", "N^3-", "CNO^-"],
  ["SO4^2-", "Sulfatni ion", "Sulfate ion", "SO3^2-", "S2O3^2-", "SO4^-", "HSO4^-"],
];
// formula → ime (družine -at, -it, -id)
const POLYREV = [
  ["SO4^2-", "sulfatni ion|sulfate ion"], ["SO3^2-", "sulfitni ion|sulfite ion"], ["S^2-", "sulfidni ion|sulfide ion"],
  ["NO3^-", "nitratni ion|nitrate ion"], ["NO2^-", "nitritni ion|nitrite ion"], ["N^3-", "nitridni ion|nitride ion"],
  ["ClO3^-", "kloratni ion|chlorate ion"], ["ClO^-", "hipokloritni ion|hypochlorite ion"], ["Cl^-", "kloridni ion|chloride ion"],
];
// formula → ime za stopnjo 1: [formula, ime, zamenljiva imena]
const POLY1REV = [
  ["SO4^2-", "sulfatni ion|sulfate ion", ["sulfitni ion|sulfite ion", "sulfidni ion|sulfide ion"]],
  ["NO3^-", "nitratni ion|nitrate ion", ["nitritni ion|nitrite ion", "nitridni ion|nitride ion"]],
  ["CO3^2-", "karbonatni ion|carbonate ion", ["hidrogenkarbonatni ion|hydrogencarbonate ion"]],
  ["PO4^3-", "fosfatni ion|phosphate ion", ["fosfidni ion|phosphide ion"]],
  ["OH^-", "hidroksidni ion|hydroxide ion", ["oksidni ion|oxide ion", "oksonijev ion|oxonium ion"]],
  ["NH4^+", "amonijev ion|ammonium ion", ["amoniak|ammonia", "nitridni ion|nitride ion"]],
];
def("k_poly", "km_spo", 9, "Večatomni ioni", "Polyatomic ions", (t, ctx) => {
  if (t === 1 && Math.random() < 0.5) {
    const i = R(0, POLY1REV.length - 1), [f, a, ws] = POLY1REV[i];
    const short = (x) => x.length <= 20;
    return mk(`${F(f)} = ?`, L(ctx, a), shuffle(ws).map((x) => L(ctx, x)).filter(short), POLY1REV.filter((_, j) => j !== i).map((x) => L(ctx, x[1])));
  }
  if (t === 3 && Math.random() < 0.5) {
    const i = R(0, POLYREV.length - 1), fam = Math.floor(i / 3) * 3;
    const ws = POLYREV.filter((_, j) => j !== i && j >= fam && j < fam + 3).map((x) => L(ctx, x[1]));
    return mk(`${F(POLYREV[i][0])} = ?`, L(ctx, POLYREV[i][1]), ws, POLYREV.filter((_, j) => j !== i).map((x) => L(ctx, x[1])));
  }
  const [f, nsl, nen, ...ws] = pick(t === 1 ? POLY1 : t === 2 ? [...POLY1, ...POLY2, ...POLY2] : POLY3);
  return mk(`${ctx.lang === "sl" ? nsl : nen}?`, F(f), shuffle(ws).map(F));
});

// kationi: [ključ, simbol, naboj, sl pridevnik, en, dovoljeni anioni]
const CAT = [
  ["Na", "Na", 1, "natrijev", "sodium", "Cl Br I F O S OH NO3 SO4 CO3 PO4"],
  ["K", "K", 1, "kalijev", "potassium", "Cl Br I F O S OH NO3 SO4 CO3 PO4"],
  ["Li", "Li", 1, "litijev", "lithium", "Cl Br F O N OH NO3 SO4 CO3"],
  ["Mg", "Mg", 2, "magnezijev", "magnesium", "Cl Br F O S N OH NO3 SO4 CO3 PO4"],
  ["Ca", "Ca", 2, "kalcijev", "calcium", "Cl Br F O S N OH NO3 SO4 CO3 PO4"],
  ["Ba", "Ba", 2, "barijev", "barium", "Cl O OH NO3 SO4 CO3"],
  ["Al", "Al", 3, "aluminijev", "aluminium", "Cl Br F O N OH NO3 SO4 PO4"],
  ["Zn", "Zn", 2, "cinkov", "zinc", "Cl O S OH NO3 SO4 CO3"],
  ["NH4", "NH4", 1, "amonijev", "ammonium", "Cl Br NO3 SO4 CO3 PO4"],
  ["Fe2", "Fe", 2, "železov(II)", "iron(II)", "Cl O S OH SO4"],
  ["Fe3", "Fe", 3, "železov(III)", "iron(III)", "Cl Br O OH NO3 SO4 PO4"],
  ["Cu2", "Cu", 2, "bakrov(II)", "copper(II)", "Cl O S OH NO3 SO4 CO3"],
  ["Ag", "Ag", 1, "srebrov", "silver", "Cl Br I O S NO3"],
];
// anioni: [ključ, naboj, sl, en, zamenljiva imena sl|en]
const AN = {
  Cl: [-1, "klorid", "chloride", ["klorat|chlorate", "perklorat|perchlorate", "hipoklorit|hypochlorite"]],
  Br: [-1, "bromid", "bromide", ["bromat|bromate", "borid|boride"]],
  I: [-1, "jodid", "iodide", ["jodat|iodate"]],
  F: [-1, "fluorid", "fluoride", ["fosfid|phosphide"]],
  O: [-2, "oksid", "oxide", ["hidroksid|hydroxide", "peroksid|peroxide"]],
  S: [-2, "sulfid", "sulfide", ["sulfat|sulfate", "sulfit|sulfite"]],
  N: [-3, "nitrid", "nitride", ["nitrat|nitrate", "nitrit|nitrite"]],
  OH: [-1, "hidroksid", "hydroxide", ["oksid|oxide", "peroksid|peroxide", "hidrid|hydride"]],
  NO3: [-1, "nitrat", "nitrate", ["nitrit|nitrite", "nitrid|nitride"]],
  SO4: [-2, "sulfat", "sulfate", ["sulfit|sulfite", "sulfid|sulfide"]],
  CO3: [-2, "karbonat", "carbonate", ["karbid|carbide", "oksalat|oxalate"]],
  PO4: [-3, "fosfat", "phosphate", ["fosfid|phosphide", "fosfit|phosphite"]],
};
const isPoly = (k) => /[A-Z].*[A-Z]|\d/.test(k);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const part = (s, n, paren = isPoly(s)) => (n === 1 ? s : paren ? `(${s})${n}` : s + n);
const formula = (cs, x, as, y, paren = true) => F(part(cs, x, paren && isPoly(cs)) + part(as, y, paren && isPoly(as)));
function salt(cat, ak) {
  const c = cat[2], a = -AN[ak][0], g = gcd(c, a);
  return [a / g, c / g];
}
const saltName = (ctx, cat, ak, an = ctx.lang === "sl" ? AN[ak][1] : AN[ak][2]) => `${ctx.lang === "sl" ? cat[3] : cat[4]} ${an}`;
function pickSalt(ctx, polyOnly, monoOnly) {
  for (;;) {
    const cat = pick(CAT), ak = pick(cat[5].split(" "));
    if (polyOnly && !isPoly(ak) && !isPoly(cat[1])) continue;
    if (monoOnly && (isPoly(ak) || isPoly(cat[1]) || cat[0].length > 2)) continue;
    if (saltName({ lang: "sl" }, cat, ak).length > 20 || saltName({ lang: "en" }, cat, ak).length > 20) continue;
    return [cat, ak];
  }
}
function saltWrongs(cat, ak) {
  const [x, y] = salt(cat, ak), c = cat[2], a = -AN[ak][0], cs = cat[1];
  const ws = [formula(cs, 1, ak, 1), formula(cs, y, ak, x), formula(cs, a, ak, c), formula(cs, x, ak, y + 1), formula(cs, x + 1, ak, y), formula(cs, x + 1, ak, y + 1), formula(cs, x, ak, y + 2)];
  if ((x > 1 && isPoly(cs)) || (y > 1 && isPoly(ak))) ws.unshift(formula(cs, x, ak, y, false));
  return ws;
}
def("k_formula", "km_spo", 9, "Formule ionskih spojin", "Formulas of ionic compounds", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const [cat, ak] = pickSalt(ctx, t === 2, t === 1);
  const [x, y] = salt(cat, ak);
  const right = formula(cat[1], x, ak, y);
  const ws = saltWrongs(cat, ak);
  const cap = (x) => x[0].toUpperCase() + x.slice(1);
  const q = t === 3 ? `${cap(saltName(ctx, cat, ak))}?` : `Formula: ${ion(cat[1], cat[2])} ${sl ? "in" : "and"} ${ion(ak, AN[ak][0])}?`;
  return mk(q, right, [ws[0], ...shuffle(ws.slice(1))]);
});
def("k_name", "km_spo", 9, "Imena ionskih spojin", "Naming ionic compounds", (t, ctx) => {
  const [cat, ak] = pickSalt(ctx, t === 2, t === 1);
  const [x, y] = salt(cat, ak);
  const right = saltName(ctx, cat, ak);
  const ws = AN[ak][3].map((n) => saltName(ctx, cat, ak, L(ctx, n)));
  const swap = { K: "Ca", Ca: "K", Fe2: "Fe3", Fe3: "Fe2", Mg: "Mn", Ag: "Au", Na: "N", Cu2: "Cu1" }[cat[0]];
  const swapName = { Ca: "kalcijev|calcium", K: "kalijev|potassium", Fe3: "železov(III)|iron(III)", Fe2: "železov(II)|iron(II)", Mn: "manganov|manganese", Au: "zlatov|gold", N: "dušikov|nitrogen", Cu1: "bakrov(I)|copper(I)" }[swap];
  if (swapName) ws.unshift(`${L(ctx, swapName)} ${ctx.lang === "sl" ? AN[ak][1] : AN[ak][2]}`);
  const pool = cat[5].split(" ").filter((k) => k !== ak).map((k) => saltName(ctx, cat, k));
  return mk(`${formula(cat[1], x, ak, y)} = ?`, right, ws.filter((s) => s.length <= 20), pool.filter((s) => s.length <= 20));
});

// kisline in molekulske spojine: [formula, ime sl|en, napačne formule …]
const MOL1 = [
  ["CO2", "Ogljikov dioksid|Carbon dioxide", "CO", "C2O", "CO3", "C2O2"],
  ["CO", "Ogljikov monoksid|Carbon monoxide", "CO2", "C2O", "Co", "C2O2"],
  ["SO2", "Žveplov dioksid|Sulfur dioxide", "SO3", "S2O", "SO4", "SO"],
  ["NH3", "Amoniak|Ammonia", "NH4^+", "NH2", "N3H", "NH4"],
  ["CH4", "Metan|Methane", "C2H6", "CH3", "C4H", "CH2"],
  ["H2O2", "Vodikov peroksid|Hydrogen peroxide", "H2O", "HO2", "H2O3", "OH^-"],
  ["HCl", "Klorovodikova kislina|Hydrochloric acid", "HClO", "Cl2", "HCl2", "HClO3"],
  ["H2SO4", "Žveplova(VI) kislina|Sulfuric acid", "H2SO3", "H2S", "HSO4", "SO4"],
  ["HNO3", "Dušikova(V) kislina|Nitric acid", "HNO2", "NH3", "H2NO3", "NO3"],
  ["O3", "Ozon|Ozone", "O2", "O", "O4", "CO3"],
];
const MOL2 = [
  ["H2SO3", "Žveplova(IV) kislina|Sulfurous acid", "H2SO4", "H2S", "SO2", "HSO3"],
  ["HNO2", "Dušikova(III) kislina|Nitrous acid", "HNO3", "NH3", "NO2", "H3NO2"],
  ["H2CO3", "Ogljikova kislina|Carbonic acid", "CO2", "HCO3", "H2CO2", "CH3COOH"],
  ["H3PO4", "Fosforjeva(V) kislina|Phosphoric acid", "H3PO3", "HPO4", "H2PO4", "H3PO5"],
  ["CH3COOH", "Ocetna kislina|Acetic acid", "HCOOH", "C2H5OH", "CH3CHO", "H2CO3"],
  ["HF", "Fluorovodikova kislina|Hydrofluoric acid", "HF2", "F2", "HFO", "HCl"],
  ["SO3", "Žveplov trioksid|Sulfur trioxide", "SO2", "S3O", "SO4", "S2O3"],
  ["NO2", "Dušikov dioksid|Nitrogen dioxide", "N2O", "NO", "N2O4", "NO3"],
  ["N2O", "Didušikov oksid|Dinitrogen oxide", "NO2", "NO", "N2O2", "N2O4"],
  ["N2O4", "Didušikov tetraoksid|Dinitrogen tetroxide", "NO2", "N4O2", "N2O5", "NO4"],
  ["CCl4", "Ogljikov tetraklorid|Carbon tetrachloride", "CCl2", "C4Cl", "CCl3", "CaCl4"],
  ["PCl5", "Fosforjev pentaklorid|Phosphorus pentachloride", "PCl3", "P5Cl", "PCl4", "PCl"],
  ["PCl3", "Fosforjev triklorid|Phosphorus trichloride", "PCl5", "P3Cl", "PCl", "PCl2"],
  ["SiO2", "Silicijev dioksid|Silicon dioxide", "SiO", "Si2O", "SO2", "SiO4"],
];
const MOLREV = [
  ["SO3", "žveplov trioksid|sulfur trioxide", "žveplov dioksid|sulfur dioxide", "žveplova(VI) kislina|sulfuric acid", "trižveplov oksid|trisulfur oxide"],
  ["SO2", "žveplov dioksid|sulfur dioxide", "žveplov trioksid|sulfur trioxide", "žveplova(IV) kislina|sulfurous acid", "dižveplov oksid|disulfur oxide"],
  ["CO", "ogljikov monoksid|carbon monoxide", "ogljikov dioksid|carbon dioxide", "kobalt|cobalt", "kalcijev oksid|calcium oxide"],
  ["CO2", "ogljikov dioksid|carbon dioxide", "ogljikov monoksid|carbon monoxide", "diogljikov oksid|dicarbon oxide", "ogljikova kislina|carbonic acid"],
  ["NO2", "dušikov dioksid|nitrogen dioxide", "didušikov oksid|dinitrogen oxide", "nitritni ion|nitrite ion", "dušikov monoksid|nitrogen monoxide"],
  ["N2O", "didušikov oksid|dinitrogen oxide", "dušikov dioksid|nitrogen dioxide", "dušikov monoksid|nitrogen monoxide", "didušikov tetraoksid|dinitrogen tetroxide"],
  ["N2O4", "didušikov tetraoksid|dinitrogen tetroxide", "dušikov dioksid|nitrogen dioxide", "didušikov pentoksid|dinitrogen pentoxide", "dušikov tetraoksid|nitrogen tetroxide"],
  ["CCl4", "ogljikov tetraklorid|carbon tetrachloride", "kalcijev klorid|calcium chloride", "tetraogljikov klorid|tetracarbon chloride", "ogljikov triklorid|carbon trichloride"],
  ["H2O2", "vodikov peroksid|hydrogen peroxide", "voda|water", "hidroksidni ion|hydroxide ion", "ozon|ozone"],
  ["SiO2", "silicijev dioksid|silicon dioxide", "žveplov dioksid|sulfur dioxide", "kositrov dioksid|tin dioxide", "silicij|silicon"],
  ["NH3", "amoniak|ammonia", "amonijev ion|ammonium ion", "dušik|nitrogen", "metan|methane"],
  ["CH4", "metan|methane", "etan|ethane", "metanol|methanol", "amoniak|ammonia"],
  ["O3", "ozon|ozone", "trioksid|trioxide", "ogljikov dioksid|carbon dioxide", "voda|water"],
];
def("k_kisl", "km_spo", 9, "Kisline in molekulske spojine", "Acids and molecular compounds", (t, ctx) => {
  if (t === 3 && Math.random() < 0.5) {
    const [f, ...names] = pick(MOLREV);
    return bank(ctx, [[`${F(f)} = ?`, ...names]]);
  }
  const [f, name, ...ws] = pick(t === 1 ? MOL1 : t === 2 ? [...MOL1, ...MOL2] : MOL2);
  return mk(`${L(ctx, name)}?`, F(f), shuffle(ws).map(F));
});

// ===== MNOŽINA SNOVI IN RAZTOPINE =====
const AR = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40, Fe: 56, Cu: 63.5 };
const ZN = { H: 1, C: 6, N: 7, O: 8, Na: 11, Mg: 12, Al: 13, P: 15, S: 16, Cl: 17, K: 19, Ca: 20, Fe: 26, Cu: 29 };
// "Ca3(PO4)2", "CuSO4·5H2O" → { Ca: 3, P: 2, O: 8 }; noIdx: brez indeksov, noGroup: brez indeksa za oklepajem
function parse(f, mode = "") {
  const out = {};
  for (const piece of f.split("·")) {
    const [, coef, rest] = piece.match(/^(\d*)(.*)$/);
    const k0 = coef && mode !== "noIdx" ? +coef : 1;
    const st = [{}];
    const re = /([A-Z][a-z]?|\(|\))(\d*)/g;
    let m;
    while ((m = re.exec(rest))) {
      const n = m[2] && mode !== "noIdx" ? +m[2] : 1;
      if (m[1] === "(") st.push({});
      else if (m[1] === ")") {
        const g = st.pop(), top = st.at(-1);
        for (const e in g) top[e] = (top[e] || 0) + g[e] * (mode === "noGroup" ? 1 : n);
      } else {
        const top = st.at(-1);
        top[m[1]] = mode === "noIdx" ? 1 : (top[m[1]] || 0) + n;
      }
    }
    for (const e in st[0]) out[e] = mode === "noIdx" ? 1 : (out[e] || 0) + st[0][e] * k0;
  }
  return out;
}
const molar = (f, mode, tab = AR) => Object.entries(parse(f, mode)).reduce((s, [e, n]) => s + tab[e] * n, 0);
const r1 = (x) => Math.round(x * 10) / 10;
const r3 = (x) => Math.round(x * 1000) / 1000;
const nice1 = (x) => Math.abs(x * 10 - Math.round(x * 10)) < 1e-9;
const MM1 = ["H2O", "CO2", "O2", "N2", "H2", "NaCl", "CH4", "NH3", "HCl", "MgO", "CaO", "CO", "NaOH", "KCl", "SO2", "Cl2"];
const MM2 = ["H2SO4", "CaCO3", "HNO3", "C6H12O6", "Na2CO3", "C2H5OH", "CuSO4", "Fe2O3", "MgCl2", "Al2O3", "NaHCO3", "KNO3", "H3PO4", "NH4Cl", "Na2SO4", "CaCl2"];
const MM3 = ["Ca3(PO4)2", "Al2(SO4)3", "(NH4)2SO4", "Mg(OH)2", "Fe(OH)3", "Cu(NO3)2", "Ca(NO3)2", "CuSO4·5H2O", "Al(NO3)3", "C12H22O11", "Mg3(PO4)2", "Ca(OH)2", "(NH4)3PO4", "Na2SO4·10H2O"];
def("k_molar", "km_kol", 9, "Molska masa", "Molar mass", (t, ctx) => {
  const f = pick([MM1, MM2, MM3][t - 1]);
  const M = molar(f);
  const ws = [molar(f, "noIdx"), molar(f, "", ZN), molar(f, "noGroup"), M - 16, M + 16, M - 1, M + 2];
  return numU(ctx, `M(${F(f)}) = ?`, M, ws, "g/mol");
});
const NN = [0.1, 0.2, 0.25, 0.5, 1.5, 2, 3, 4, 5];
function pickNM(list, ns) {
  for (;;) {
    const f = pick(list), M = molar(f), n = pick(ns), m = n * M;
    if (nice1(m)) return [f, M, n, r1(m)];
  }
}
def("k_mol", "km_kol", 9, "Množina snovi n = m/M", "Amount of substance n = m/M", (t, ctx) => {
  const sl = ctx.lang === "sl";
  if (t === 1) {
    const [f, M, n, m] = pickNM(MM1, NN);
    return numU(ctx, `${ctx.num(m)} g ${F(f)} → n = ?`, n, [M / m, m, n * 10, 1 / n, n * 2], "mol");
  }
  if (t === 2) {
    const [f, M, n, m] = pickNM([...MM1, ...MM2], NN);
    return numU(ctx, `${ctx.num(n)} mol ${F(f)} → m = ?`, m, [M, M / n, n * molar(f, "noIdx"), m * 10, n / M], "g");
  }
  if (Math.random() < 0.5) {
    const [f, M, n, m] = pickNM([...MM2, ...MM3], NN);
    return numU(ctx, `${ctx.num(m)} g ${F(f)} → n = ?`, n, [M / m, m / molar(f, "noIdx"), m / molar(f, "noGroup"), n * 10, 1 / n], "mol");
  }
  const f = pick(["H2O", "CO2", "H2SO4", "CaCO3", "Fe2O3", "Al2O3", "NH3", "CH4", "C6H12O6", "Ca3(PO4)2", "HNO3"]);
  const cnt = parse(f), els = Object.keys(cnt), e = pick(els.filter((x) => cnt[x] > 1).length ? els.filter((x) => cnt[x] > 1) : els);
  const n = pick([0.5, 2, 3, 0.1]);
  const atoms = Object.values(cnt).reduce((a, b) => a + b, 0);
  return numU(ctx, `${ctx.num(n)} mol ${F(f)}: n(${e}) = ?`, n * cnt[e], [n, n * atoms, cnt[e], n / cnt[e]], "mol");
});

const NA = 6.02e23;
const DEC = (ctx) => (ctx.num(1.5).includes(",") ? "," : ".");
function sci(ctx, x, sig = 3, strip = false) {
  let e = Math.floor(Math.log10(x) + 1e-12), m = x / 10 ** e;
  let ms = m.toFixed(sig - 1);
  if (+ms >= 10) {
    e++;
    ms = (m / 10).toFixed(sig - 1);
  }
  if (strip) ms = ms.replace(/\.?0+$/, "");
  return `${ms.replace(".", DEC(ctx))} · 10${sup(e)}`;
}
const sciQ = (ctx, q, x, ws) => mk(q, sci(ctx, x), ws.filter((w) => w > 0).map((w) => sci(ctx, w)));
def("k_avog", "km_kol", 10, "Število delcev N = n · Nₐ", "Number of particles N = n · Nₐ", (t, ctx) => {
  const sl = ctx.lang === "sl";
  if (t === 1) {
    const n = pick([0.1, 0.2, 0.5, 1.5, 2, 3, 4, 5, 10]);
    return sciQ(ctx, sl ? `Število delcev v ${ctx.num(n)} mol?` : `Particles in ${ctx.num(n)} mol?`, n * NA, [NA / n, n * NA / 10, n * NA * 10, NA, 6.02e22 / n]);
  }
  if (t === 2) {
    const n = pick([0.1, 0.2, 0.5, 1.5, 2, 3, 4, 5, 10]);
    const q = sl ? `${sci(ctx, n * NA, 4, true)} molekul → n = ?` : `${sci(ctx, n * NA, 4, true)} molecules → n = ?`;
    return numU(ctx, q, n, [1 / n, n * 10, n / 10, n * 2], "mol");
  }
  if (Math.random() < 0.5) {
    const [f, e, k] = pick([["H2O", "H", 2], ["CO2", "O", 2], ["NH3", "H", 3], ["CH4", "H", 4], ["H2SO4", "O", 4], ["O2", "O", 2], ["N2", "N", 2], ["C2H6", "H", 6], ["SO3", "O", 3]]);
    const n = pick([0.5, 1, 2, 0.1]);
    const all = Object.values(parse(f)).reduce((a, b) => a + b, 0);
    const q = sl ? `Število atomov ${e} v ${ctx.num(n)} mol ${F(f)}?` : `${e} atoms in ${ctx.num(n)} mol ${F(f)}?`;
    return sciQ(ctx, q, n * k * NA, [n * NA, n * all * NA, (n * NA) / k, k * NA, n * k * NA * 10, (n * k * NA) / 10]);
  }
  const [f, M, n, m] = pickNM(["H2O", "CO2", "O2", "CH4", "NH3", "N2", "HCl", "H2"], [0.1, 0.5, 2, 0.2, 1.5]);
  const q = sl ? `Število molekul v ${ctx.num(m)} g ${F(f)}?` : `Molecules in ${ctx.num(m)} g ${F(f)}?`;
  return sciQ(ctx, q, n * NA, [m * NA, (M / m) * NA, n * NA * 10, (n * NA) / 10]);
});

const GAS = ["O2", "N2", "H2", "CO2", "CH4", "He", "Cl2", "NH3", "Ar", "SO2"];
const AR2 = { ...AR, He: 4, Ar: 40 };
def("k_vm", "km_kol", 10, "Molska prostornina plina", "Molar volume of a gas", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const cond = `(0 °C, ${ctx.num(101.3)} kPa)`;
  const g = pick(GAS);
  if (t === 1) {
    const n = pick([0.1, 0.25, 0.5, 2, 3, 4, 5, 10]);
    return numU(ctx, `${ctx.num(n)} mol ${F(g)} ${cond}: V = ?`, r3(n * 22.4), [r3(22.4 / n), r3(n * 24.5), 22.4, r3(n * 2.24), r3(n * 224)], "L");
  }
  if (t === 2) {
    const n = pick([0.1, 0.25, 0.5, 2, 3, 4, 5]);
    return numU(ctx, `${ctx.num(r3(n * 22.4))} L ${F(g)} ${cond}: n = ?`, n, [r3(n * 22.4), 1 / n, n * 10, n / 10], "mol");
  }
  for (;;) {
    const f = pick(GAS), M = molar(f, "", AR2), n = pick([0.1, 0.25, 0.5, 2, 1.5]), m = n * M;
    if (!nice1(m)) continue;
    const Mn = molar(f, "noIdx", AR2);
    return numU(ctx, `${ctx.num(m)} g ${F(f)} ${cond}: V = ?`, r3(n * 22.4), [Mn !== M ? r3((m / Mn) * 22.4) : null, r3(m * 22.4), r3(n * 24.5), n, r3((M / m) * 22.4)].filter((x) => x != null), "L");
  }
});

const pct = (ctx, x) => `${ctx.num(x)} %`;
def("k_w", "km_kol", 9, "Masni delež", "Mass fraction", (t, ctx) => {
  const sl = ctx.lang === "sl";
  for (;;) {
    const w = pick([2, 4, 5, 8, 10, 12, 15, 20, 25, 30, 40]), mr = pick([50, 80, 100, 120, 150, 200, 250, 300, 400, 500]);
    const ms = (w * mr) / 100, mw = mr - ms;
    if (!nice1(ms)) continue;
    const P = (x) => pct(ctx, x);
    if (t === 1) {
      const q = sl ? `${ctx.num(ms)} g soli v ${mr} g raztopine: w = ?` : `${ctx.num(ms)} g salt in ${mr} g solution: w = ?`;
      return mk(q, P(w), [P(r1((ms / mw) * 100)), P(100 - w), P(w / 10), P(w * 2)]);
    }
    if (t === 2) {
      const q = sl ? `${ctx.num(ms)} g sladkorja + ${ctx.num(mw)} g vode: w = ?` : `${ctx.num(ms)} g sugar + ${ctx.num(mw)} g water: w = ?`;
      return mk(q, P(w), [P(r1((ms / mw) * 100)), P(100 - w), P(r1((mw / mr) * 100 / 10)), P(w * 2)]);
    }
    if (Math.random() < 0.5) {
      const q = sl ? `${mr} g raztopine, w = ${P(w)}: m(soli) = ?` : `${mr} g solution, w = ${P(w)}: m(salt) = ?`;
      return numU(ctx, q, ms, [mw, ms * 10, w, mr / w, (w * mw) / 100], "g");
    }
    const q = sl ? `${mr} g raztopine, w = ${P(w)}: m(vode) = ?` : `${mr} g solution, w = ${P(w)}: m(water) = ?`;
    return numU(ctx, q, mw, [ms, mr, mr + ms, mr - w], "g");
  }
});

def("k_conc", "km_kol", 10, "Koncentracija raztopin", "Concentration of solutions", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const ML = "mol/L";
  if (t === 1) {
    for (;;) {
      const n = pick([0.1, 0.2, 0.25, 0.5, 1, 2, 3]), V = pick([0.25, 0.5, 2, 4, 5, 10]), c = n / V;
      if (!nice1(c * 100)) continue;
      return numU(ctx, sl ? `${ctx.num(n)} mol v ${ctx.num(V)} L: c = ?` : `${ctx.num(n)} mol in ${ctx.num(V)} L: c = ?`, c, [n * V, V / n, c * 10, c / 10], ML);
    }
  }
  if (t === 2) {
    for (;;) {
      const m = pick([2, 5, 10, 15, 20, 25, 40, 50]), Vml = pick([100, 200, 250, 500]), g = m / (Vml / 1000);
      if (!nice1(g)) continue;
      return numU(ctx, sl ? `${m} g v ${Vml} mL: γ = ?` : `${m} g in ${Vml} mL: γ = ?`, g, [m / Vml, (m * Vml) / 1000, Vml / m, g / 10], "g/L");
    }
  }
  if (Math.random() < 0.4) {
    const c1 = pick([0.5, 1, 2, 4, 5]), V1 = pick([50, 100, 200]), k = pick([2, 4, 5, 10]), V2 = V1 * k, c2 = c1 / k;
    const q = sl ? `${V1} mL (${ctx.num(c1)} ${ML}) razredčimo na ${V2} mL: c = ?` : `${V1} mL of ${ctx.num(c1)} ${ML} diluted to ${V2} mL: c = ?`;
    return numU(ctx, q, c2, [c1 * k, c1 / (k - 1), c1 - c2, c1], ML);
  }
  for (;;) {
    const f = pick(["NaOH", "NaCl", "HCl", "KOH", "H2SO4", "C6H12O6", "CaCl2", "NaHCO3"]), M = molar(f);
    const n = pick([0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1]), Vml = pick([100, 200, 250, 500]), m = n * M, c = n / (Vml / 1000);
    if (!nice1(m * 10) || !nice1(c * 100) || c > 2) continue; // realne (topne) koncentracije
    const q = sl ? `${ctx.num(m)} g ${F(f)} v ${Vml} mL: c = ?` : `${ctx.num(m)} g ${F(f)} in ${Vml} mL: c = ?`;
    const ws = [n, c / 1000, c * 10, n / Vml].map((x) => ctx.num(x) + " " + ML);
    ws.unshift(ctx.num(m / (Vml / 1000)) + " g/L");
    return mk(q, ctx.num(c) + " " + ML, ws, [c * 2, c / 2, c / 10].map((x) => ctx.num(x) + " " + ML));
  }
});

// [enačba, koeficienti po snoveh, snovi]
const EQS = [
  ["N2 + 3 H2 -> 2 NH3", [1, 3, 2], ["N2", "H2", "NH3"]],
  ["2 H2 + O2 -> 2 H2O", [2, 1, 2], ["H2", "O2", "H2O"]],
  ["CH4 + 2 O2 -> CO2 + 2 H2O", [1, 2, 1, 2], ["CH4", "O2", "CO2", "H2O"]],
  ["2 Na + Cl2 -> 2 NaCl", [2, 1, 2], ["Na", "Cl2", "NaCl"]],
  ["4 Al + 3 O2 -> 2 Al2O3", [4, 3, 2], ["Al", "O2", "Al2O3"]],
  ["2 KClO3 -> 2 KCl + 3 O2", [2, 2, 3], ["KClO3", "KCl", "O2"]],
  ["C3H8 + 5 O2 -> 3 CO2 + 4 H2O", [1, 5, 3, 4], ["C3H8", "O2", "CO2", "H2O"]],
  ["2 H2O2 -> 2 H2O + O2", [2, 2, 1], ["H2O2", "H2O", "O2"]],
  ["2 Mg + O2 -> 2 MgO", [2, 1, 2], ["Mg", "O2", "MgO"]],
  ["CaCO3 -> CaO + CO2", [1, 1, 1], ["CaCO3", "CaO", "CO2"]],
  ["Fe + S -> FeS", [1, 1, 1], ["Fe", "S", "FeS"]],
  ["C + O2 -> CO2", [1, 1, 1], ["C", "O2", "CO2"]],
  ["NaOH + HCl -> NaCl + H2O", [1, 1, 1, 1], ["NaOH", "HCl", "NaCl", "H2O"]],
];
def("k_stoich", "km_kol", 10, "Računanje po enačbi", "Reaction stoichiometry", (t, ctx) => {
  const sl = ctx.lang === "sl";
  for (;;) {
    const [eq, co, sp] = pick(EQS);
    const i = R(0, eq.split(" -> ")[0].split(" + ").length - 1); // izhodna snov je reaktant
    let j = R(0, sp.length - 1);
    if (i === j) continue;
    const a = co[i], b = co[j];
    if (t === 1) {
      if (a === b && Math.random() < 0.7) continue;
      const k = pick([1, 2, 3, 5]);
      const nx = a * k, ny = b * k;
      return numU(ctx, `${F(eq)}: ${nx} mol ${F(sp[i])} → n(${F(sp[j])})?`, ny, [nx, (k * a * a) / b, b, ny * a, ny + 1], "mol");
    }
    if (t === 2 && a !== b) continue;
    if (t === 3 && a === b) continue;
    const Mx = molar(sp[i]), My = molar(sp[j]);
    const n = pick([0.1, 0.2, 0.5, 1, 2, 3]) * a, mx = n * Mx, my = (n * b * My) / a;
    if (!nice1(mx) || !nice1(my)) continue;
    const q = `${F(eq)}: ${ctx.num(mx)} g ${F(sp[i])} → m(${F(sp[j])})?`;
    return numU(ctx, q, my, [(n * My), mx, (n * a * My) / b, mx * My / Mx === my ? null : (mx * My) / Mx, my * 2].filter((x) => x != null), "g");
  }
});

// ===== KEMIJSKE REAKCIJE IN REDOKS =====
const BAL1 = ["2 H2 + O2 -> 2 H2O", "2 Mg + O2 -> 2 MgO", "N2 + 3 H2 -> 2 NH3", "2 Na + Cl2 -> 2 NaCl", "H2 + Cl2 -> 2 HCl", "2 H2O2 -> 2 H2O + O2", "2 HgO -> 2 Hg + O2", "2 Ca + O2 -> 2 CaO", "2 K + Cl2 -> 2 KCl", "2 CO + O2 -> 2 CO2", "4 Na + O2 -> 2 Na2O", "2 Cu + O2 -> 2 CuO", "2 H2O -> 2 H2 + O2"];
const BAL2 = ["CH4 + 2 O2 -> CO2 + 2 H2O", "4 Al + 3 O2 -> 2 Al2O3", "4 Fe + 3 O2 -> 2 Fe2O3", "Zn + 2 HCl -> ZnCl2 + H2", "2 Na + 2 H2O -> 2 NaOH + H2", "Mg + 2 HCl -> MgCl2 + H2", "2 KClO3 -> 2 KCl + 3 O2", "2 NaOH + H2SO4 -> Na2SO4 + 2 H2O", "Ca(OH)2 + 2 HCl -> CaCl2 + 2 H2O", "2 Al + 6 HCl -> 2 AlCl3 + 3 H2", "3 Fe + 2 O2 -> Fe3O4", "N2 + O2 -> 2 NO", "2 SO2 + O2 -> 2 SO3", "2 Al + 3 Cl2 -> 2 AlCl3"];
const BAL3 = ["C3H8 + 5 O2 -> 3 CO2 + 4 H2O", "2 C2H6 + 7 O2 -> 4 CO2 + 6 H2O", "C2H5OH + 3 O2 -> 2 CO2 + 3 H2O", "C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O", "Fe2O3 + 3 CO -> 2 Fe + 3 CO2", "2 C4H10 + 13 O2 -> 8 CO2 + 10 H2O", "3 Cu + 8 HNO3 -> 3 Cu(NO3)2 + 2 NO + 4 H2O", "4 NH3 + 5 O2 -> 4 NO + 6 H2O", "2 Al + 3 CuSO4 -> Al2(SO4)3 + 3 Cu", "3 Ca(OH)2 + 2 H3PO4 -> Ca3(PO4)2 + 6 H2O", "4 FeS2 + 11 O2 -> 2 Fe2O3 + 8 SO2", "C2H4 + 3 O2 -> 2 CO2 + 2 H2O", "2 C2H2 + 5 O2 -> 4 CO2 + 2 H2O", "6 CO2 + 6 H2O -> C6H12O6 + 6 O2"];
const terms = (eq) => eq.split(" -> ").map((side) => side.split(" + ").map((s) => {
  const m = s.match(/^(\d+) (.+)$/);
  return m ? [+m[1], m[2]] : [1, s];
}));
const showEq = (sides) => F(sides.map((side) => side.map(([c, s]) => (c === "?" ? "? " : c === 1 ? "" : c + " ") + s).join(" + ")).join(" -> "));
def("k_bal", "km_rea", 8, "Urejanje enačb", "Balancing equations", (t, ctx) => {
  const sides = terms(pick([BAL1, BAL2, BAL3][t - 1]));
  const all = sides.flatMap((s, i) => s.map((x, j) => [i, j, x[0]]));
  const cands = all.filter((x) => x[2] > 1);
  const [i, j, c] = Math.random() < 0.85 && cands.length ? pick(cands) : pick(all);
  const shown = sides.map((s) => s.map((x) => [...x]));
  shown[i][j][0] = "?";
  const sp = sides[i][j][1];
  const idx = (sp.match(/\d+/g) || []).map(Number);
  return ints(showEq(shown), c, [...all.map((x) => x[2]), ...idx, c * 2, c + 1, c - 1], 1);
});

// [enačba, vrsta]
const RTYPE = [
  ["N2 + 3 H2 -> 2 NH3", 0], ["2 Na + Cl2 -> 2 NaCl", 0], ["Fe + S -> FeS", 0], ["CaO + H2O -> Ca(OH)2", 0], ["H2 + Cl2 -> 2 HCl", 0], ["SO3 + H2O -> H2SO4", 0],
  ["CaCO3 -> CaO + CO2", 1], ["2 H2O -> 2 H2 + O2", 1], ["2 HgO -> 2 Hg + O2", 1], ["2 KClO3 -> 2 KCl + 3 O2", 1], ["2 H2O2 -> 2 H2O + O2", 1], ["NH4Cl -> NH3 + HCl", 1],
  ["CH4 + 2 O2 -> CO2 + 2 H2O", 2], ["C3H8 + 5 O2 -> 3 CO2 + 4 H2O", 2], ["C2H5OH + 3 O2 -> 2 CO2 + 3 H2O", 2], ["2 C2H6 + 7 O2 -> 4 CO2 + 6 H2O", 2],
  ["HCl + NaOH -> NaCl + H2O", 3], ["H2SO4 + 2 KOH -> K2SO4 + 2 H2O", 3], ["HNO3 + KOH -> KNO3 + H2O", 3], ["2 HCl + Ca(OH)2 -> CaCl2 + 2 H2O", 3],
  ["AgNO3 + KCl -> AgCl + KNO3", 4], ["BaCl2 + Na2SO4 -> BaSO4 + 2 NaCl", 4], ["CuSO4 + 2 NaOH -> Cu(OH)2 + Na2SO4", 4], ["Pb(NO3)2 + 2 KI -> PbI2 + 2 KNO3", 4],
];
const TYPES = ["sinteza|synthesis", "razkroj|decomposition", "gorenje|combustion", "nevtralizacija|neutralization", "obarjanje|precipitation"];
const ENDO = ["fotosinteza|photosynthesis", "razkroj CaCO₃|CaCO₃ decomposition", "elektroliza vode|water electrolysis", "taljenje ledu|melting ice", "izparevanje vode|evaporating water"];
const EXO = ["gorenje metana|burning methane", "celično dihanje|cellular respiration", "nevtralizacija|neutralization", "rjavenje železa|rusting of iron", "gorenje lesa|burning wood", "zmrzovanje vode|freezing water"];
def("k_rtype", "km_rea", 8, "Vrste kemijskih reakcij", "Types of chemical reactions", (t, ctx) => {
  if (t === 3 && Math.random() < 0.6) {
    return Math.random() < 0.5
      ? which(ctx, "Kateri proces je endotermen?|Which process is endothermic?", ENDO, EXO)
      : which(ctx, "Kateri proces je eksotermen?|Which process is exothermic?", EXO, ENDO);
  }
  const pool = t === 1 ? RTYPE.filter((x) => x[1] < 3) : RTYPE;
  const [eq, k] = pick(pool);
  const opts = (t === 1 ? TYPES.slice(0, 3).concat(TYPES[3]) : TYPES).map((s) => L(ctx, s));
  return mk(`${ctx.lang === "sl" ? "Vrsta" : "Type"}: ${F(eq)}`, opts[k], shuffle(opts.filter((_, i) => i !== k)));
});

const FAST = ["večja|faster", "manjša|slower", "enaka|unchanged", "reakcija se ustavi|reaction stops"];
const RATE = [
  ["Višja temperatura: hitrost reakcije?|Higher temperature: reaction rate?", 0],
  ["Nižja temperatura: hitrost reakcije?|Lower temperature: reaction rate?", 1],
  ["Večja koncentracija reaktantov: hitrost?|Higher reactant concentration: rate?", 0],
  ["Manjša koncentracija reaktantov: hitrost?|Lower reactant concentration: rate?", 1],
  ["Trdni reaktant zdrobimo v prah: hitrost?|Solid reactant ground to powder: rate?", 0],
  ["Dodamo katalizator: hitrost reakcije?|Catalyst added: reaction rate?", 0],
];
const RATEB = [
  ["Katalizator pospeši reakcijo, ker?|A catalyst works because it?", "zniža Eₐ|lowers Eₐ", "zviša Eₐ|raises Eₐ", "zviša temperaturo|raises temperature", "poveča ΔH|increases ΔH"],
  ["Katalizator se med reakcijo?|During a reaction a catalyst is?", "ne porabi|not used up", "porabi|used up", "spremeni v produkt|turned into product", "razgradi|destroyed"],
  ["Encimi so biološki?|Enzymes are biological?", "katalizatorji|catalysts", "reaktanti|reactants", "inhibitorji|inhibitors", "topila|solvents"],
  ["Snov, ki upočasni reakcijo?|Substance that slows a reaction?", "inhibitor|inhibitor", "katalizator|catalyst", "encim|enzyme", "reaktant|reactant"],
  ["Pri višji T delci trkajo?|At higher T particles collide?", "pogosteje|more often", "redkeje|less often", "enako pogosto|equally often", "nikoli|never"],
  ["Enota za hitrost reakcije?|Unit of reaction rate?", "mol/(L·s)|mol/(L·s)", "mol/L|mol/L", "L/s|L/s", "mol·s/L|mol·s/L"],
];
// [ravnotežje, sprememba, premik: 0 desno, 1 levo, 2 ni premika]
const EQUIL = [
  ["N2 + 3 H2 <=> 2 NH3 (ΔH < 0)", [["višji tlak|higher pressure", 0], ["nižji tlak|lower pressure", 1], ["višja T|higher T", 1], ["nižja T|lower T", 0], ["dodamo N2|add N2", 0], ["odvzamemo NH3|remove NH3", 0], ["katalizator|catalyst", 2]]],
  ["2 SO2 + O2 <=> 2 SO3 (ΔH < 0)", [["višji tlak|higher pressure", 0], ["višja T|higher T", 1], ["nižja T|lower T", 0], ["dodamo O2|add O2", 0], ["odvzamemo SO2|remove SO2", 1], ["katalizator|catalyst", 2]]],
  ["N2O4 <=> 2 NO2 (ΔH > 0)", [["višji tlak|higher pressure", 1], ["nižji tlak|lower pressure", 0], ["višja T|higher T", 0], ["nižja T|lower T", 1], ["dodamo NO2|add NO2", 1]]],
  ["H2 + I2 <=> 2 HI", [["višji tlak|higher pressure", 2], ["dodamo H2|add H2", 0], ["odvzamemo HI|remove HI", 0], ["dodamo HI|add HI", 1]]],
  ["CaCO3(s) <=> CaO(s) + CO2(g) (ΔH > 0)", [["višja T|higher T", 0], ["nižja T|lower T", 1], ["višji tlak|higher pressure", 1], ["odvzamemo CO2|remove CO2", 0]]],
];
const SHIFT = ["v desno|to the right", "v levo|to the left", "ni premika|no shift", "reakcija se ustavi|reaction stops"];
def("k_rate", "km_rea", 11, "Hitrost reakcij in ravnotežje", "Reaction rate and equilibrium", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.35) return bank(ctx, RATEB);
    const [q, k] = pick(RATE);
    return mk(L(ctx, q), L(ctx, FAST[k]), shuffle(FAST.filter((_, i) => i !== k).map((s) => L(ctx, s))));
  }
  if (t === 2) {
    for (;;) {
      const dc = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.2]), dt = pick([2, 4, 5, 10, 20, 40]), v = dc / dt;
      if (!nice1(v * 1000)) continue;
      return numU(ctx, `Δc = ${ctx.num(dc)} mol/L, Δt = ${dt} s: v = ?`, v, [dc * dt, dt / dc, v * 10, v / 10], "mol/(L·s)");
    }
  }
  const [eq, ch] = pick(EQUIL);
  const [c, k] = pick(ch);
  return mk(`${F(eq)}: ${F(L(ctx, c))}?`, L(ctx, SHIFT[k]), SHIFT.filter((_, i) => i !== k).map((s) => L(ctx, s)));
});

// [formula, element, oksidacijsko število]
const OX1 = [["O2", "O", 0], ["Na", "Na", 0], ["Cl2", "Cl", 0], ["NaCl", "Na", 1], ["NaCl", "Cl", -1], ["H2O", "O", -2], ["H2O", "H", 1], ["CO2", "C", 4], ["MgO", "Mg", 2], ["Al2O3", "Al", 3], ["CaCl2", "Ca", 2], ["NH3", "N", -3], ["CH4", "C", -4], ["HCl", "Cl", -1], ["SO2", "S", 4], ["Fe2O3", "Fe", 3], ["FeO", "Fe", 2], ["CuO", "Cu", 2], ["Cu2O", "Cu", 1]];
const OX2 = [["H2SO4", "S", 6], ["HNO3", "N", 5], ["H3PO4", "P", 5], ["H2SO3", "S", 4], ["HNO2", "N", 3], ["NO2", "N", 4], ["NO", "N", 2], ["N2O", "N", 1], ["CO", "C", 2], ["KMnO4", "Mn", 7], ["MnO2", "Mn", 4], ["K2Cr2O7", "Cr", 6], ["KClO3", "Cl", 5], ["HClO", "Cl", 1], ["HClO4", "Cl", 7], ["H2S", "S", -2], ["SO3", "S", 6], ["Na2SO4", "S", 6], ["CaCO3", "C", 4]];
const OX3 = [["SO4^2-", "S", 6], ["SO3^2-", "S", 4], ["NO3^-", "N", 5], ["NH4^+", "N", -3], ["MnO4^-", "Mn", 7], ["Cr2O7^2-", "Cr", 6], ["CrO4^2-", "Cr", 6], ["PO4^3-", "P", 5], ["ClO^-", "Cl", 1], ["H2O2", "O", -1], ["Na2O2", "O", -1], ["NaH", "H", -1], ["CaH2", "H", -1], ["OF2", "O", 2], ["CH3OH", "C", -2], ["HCOOH", "C", 2], ["C2H6", "C", -3], ["NO2^-", "N", 3]];
const oxs = (x) => (x > 0 ? `+${x}` : x < 0 ? `−${-x}` : "0");
def("k_ox", "km_rea", 10, "Oksidacijska števila", "Oxidation numbers", (t, ctx) => {
  const [f, e, x] = pick([OX1, OX2, OX3][t - 1]);
  const q = ctx.lang === "sl" ? `Oksidacijsko število ${e} v ${F(f)}?` : `Oxidation number of ${e} in ${F(f)}?`;
  const ws = shuffle([-x, x + 2, x - 2, x + 1, x - 1].filter((y) => Math.abs(y) <= 8));
  return mk(q, oxs(x), ws.map(oxs));
});

const REDOXB = [
  ["Oksidacija je?|Oxidation is?", "oddajanje e⁻|loss of electrons", "sprejemanje e⁻|gain of electrons", "sprejemanje H⁺|gain of H⁺", "oddajanje kisika|loss of oxygen"],
  ["Redukcija je?|Reduction is?", "sprejemanje e⁻|gain of electrons", "oddajanje e⁻|loss of electrons", "vezava kisika|gain of oxygen", "oddajanje H⁺|loss of H⁺"],
  ["Oksidant se med reakcijo?|An oxidizing agent is?", "reducira|reduced", "oksidira|oxidized", "nevtralizira|neutralized", "razgradi|decomposed"],
  ["Reducent se med reakcijo?|A reducing agent is?", "oksidira|oxidized", "reducira|reduced", "nevtralizira|neutralized", "razgradi|decomposed"],
  ["Oksidacijsko število pri oksidaciji?|Oxidation number when oxidized?", "se poveča|increases", "se zmanjša|decreases", "ostane enako|stays the same", "postane 0|becomes 0"],
  ["Oksidacijsko število pri redukciji?|Oxidation number when reduced?", "se zmanjša|decreases", "se poveča|increases", "ostane enako|stays the same", "postane 0|becomes 0"],
  ["Na → Na⁺ + e⁻ je?|Na → Na⁺ + e⁻ is?", "oksidacija|oxidation", "redukcija|reduction", "nevtralizacija|neutralization", "obarjanje|precipitation"],
  ["Cl₂ + 2 e⁻ → 2 Cl⁻ je?|Cl₂ + 2 e⁻ → 2 Cl⁻ is?", "redukcija|reduction", "oksidacija|oxidation", "nevtralizacija|neutralization", "obarjanje|precipitation"],
  ["Fe²⁺ → Fe³⁺ + e⁻ je?|Fe²⁺ → Fe³⁺ + e⁻ is?", "oksidacija|oxidation", "redukcija|reduction", "nevtralizacija|neutralization", "razkroj|decomposition"],
  ["Cu²⁺ + 2 e⁻ → Cu je?|Cu²⁺ + 2 e⁻ → Cu is?", "redukcija|reduction", "oksidacija|oxidation", "nevtralizacija|neutralization", "razkroj|decomposition"],
  ["Na katodi poteka?|At the cathode there is?", "redukcija|reduction", "oksidacija|oxidation", "nevtralizacija|neutralization", "obarjanje|precipitation"],
  ["Na anodi poteka?|At the anode there is?", "oksidacija|oxidation", "redukcija|reduction", "nevtralizacija|neutralization", "obarjanje|precipitation"],
  ["Oksidacijsko število prostega elementa?|Oxidation number of a free element?", "0", "+1", "−1", "+2"],
];
// [enačba, oksidira se, reducira se, produkt oksidacije, produkt redukcije]
const REDOXR = [
  ["Zn + Cu^2+ -> Zn^2+ + Cu", "Zn", "Cu^2+", "Zn^2+", "Cu"],
  ["Fe + Cu^2+ -> Fe^2+ + Cu", "Fe", "Cu^2+", "Fe^2+", "Cu"],
  ["Mg + 2 H^+ -> Mg^2+ + H2", "Mg", "H^+", "Mg^2+", "H2"],
  ["Cu + 2 Ag^+ -> Cu^2+ + 2 Ag", "Cu", "Ag^+", "Cu^2+", "Ag"],
  ["Zn + 2 H^+ -> Zn^2+ + H2", "Zn", "H^+", "Zn^2+", "H2"],
  ["2 Na + Cl2 -> 2 Na^+ + 2 Cl^-", "Na", "Cl2", "Na^+", "Cl^-"],
  ["Mg + Zn^2+ -> Mg^2+ + Zn", "Mg", "Zn^2+", "Mg^2+", "Zn"],
  ["Cl2 + 2 Br^- -> 2 Cl^- + Br2", "Br^-", "Cl2", "Br2", "Cl^-"],
  ["2 Fe^3+ + 2 I^- -> 2 Fe^2+ + I2", "I^-", "Fe^3+", "I2", "Fe^2+"],
];
const ACT = ["K", "Na", "Mg", "Al", "Zn", "Fe", "Pb", "Cu", "Ag", "Au"]; // E° narašča
def("k_redox", "km_rea", 10, "Oksidacija in redukcija", "Oxidation and reduction", (t, ctx) => {
  if (t === 1) return bank(ctx, REDOXB);
  if (t === 2) {
    const [eq, ox, red, pox, pred] = pick(REDOXR);
    const k = R(0, 3);
    const q = ["kaj se oksidira?|what is oxidized?", "kaj se reducira?|what is reduced?", "oksidant?|oxidizing agent?", "reducent?|reducing agent?"][k];
    const a = k === 0 || k === 3 ? ox : red;
    return mk(`${F(eq)}: ${L(ctx, q)}`, F(a), [ox, red, pox, pred].filter((s) => s !== a).map(F));
  }
  const k = R(0, 2);
  if (k === 0) return which(ctx, "Katera kovina izloči Cu iz CuSO₄?|Which metal displaces Cu from CuSO₄?", ["Zn", "Fe", "Mg"], ["Ag", "Au", "Pt", "Hg"]);
  if (k === 1) return which(ctx, "Katera kovina s HCl sprošča H₂?|Which metal releases H₂ with HCl?", ["Zn", "Mg", "Fe"], ["Cu", "Ag", "Au", "Pt"]);
  const idx = shuffle(ACT.map((_, i) => i)).slice(0, 4).sort((a, b) => a - b);
  return mk(L(ctx, "Najmočnejši reducent?|Strongest reducing agent?"), ACT[idx[0]], idx.slice(1).map((i) => ACT[i]));
});

// ===== KISLINE, BAZE IN SOLI =====
const IND = [
  ["Lakmus v kislini?|Litmus in acid?", "rdeč|red", "moder|blue", "zelen|green", "brezbarven|colourless"],
  ["Lakmus v bazi?|Litmus in a base?", "moder|blue", "rdeč|red", "rumen|yellow", "brezbarven|colourless"],
  ["Fenolftalein v bazi?|Phenolphthalein in a base?", "rožnat|pink", "brezbarven|colourless", "rumen|yellow", "zelen|green"],
  ["Fenolftalein v kislini?|Phenolphthalein in acid?", "brezbarven|colourless", "rožnat|pink", "moder|blue", "rdeč|red"],
  ["Metiloranž v kislini?|Methyl orange in acid?", "rdeč|red", "rumen|yellow", "moder|blue", "zelen|green"],
  ["Metiloranž v bazi?|Methyl orange in a base?", "rumen|yellow", "rdeč|red", "moder|blue", "rožnat|pink"],
  ["Univerzalni indikator pri pH 7?|Universal indicator at pH 7?", "zelen|green", "rdeč|red", "vijoličen|purple", "rumen|yellow"],
  ["Univerzalni indikator pri pH 1?|Universal indicator at pH 1?", "rdeč|red", "zelen|green", "vijoličen|purple", "moder|blue"],
];
const ACIDS = ["HCl", "HNO3", "H2SO4", "CH3COOH", "H3PO4"], BASES = ["NaOH", "KOH", "Ca(OH)2", "Ba(OH)2", "LiOH"], NEUTRAL = ["NaCl", "KNO3", "KCl", "C6H12O6"];
const SOUR = ["kis|vinegar", "limonin sok|lemon juice", "želodčni sok|gastric juice", "jogurt|yogurt"];
const BASIC = ["milnica|soapy water", "čistilo za odtok|drain cleaner", "apnena voda|limewater", "amoniakova voda|ammonia solution"];
const NEUTR = ["destilirana voda|distilled water", "slana voda|salt water", "sladkorna voda|sugar water"];
const phs = (x) => `pH = ${x}`;
def("k_acid", "km_kb", 9, "Kisline, baze in pH", "Acids, bases and pH", (t, ctx) => {
  if (t === 1) {
    if (Math.random() < 0.4) return bank(ctx, IND);
    const k = R(0, 2);
    const acid = shuffle([1, 2, 3, 4, 5, 6]), base = shuffle([8, 9, 10, 11, 12, 13, 14]);
    if (k === 0) return mk(L(ctx, "Katera raztopina je kisla?|Which solution is acidic?"), phs(acid[0]), [phs(7), phs(base[0]), phs(base[1])]);
    if (k === 1) return mk(L(ctx, "Katera raztopina je bazična?|Which solution is basic?"), phs(base[0]), [phs(7), phs(acid[0]), phs(acid[1])]);
    return mk(L(ctx, "Katera raztopina je nevtralna?|Which solution is neutral?"), phs(7), [phs(acid[0]), phs(base[0]), phs(base[1])]);
  }
  if (t === 2) {
    const k = R(0, 3);
    if (k === 0) return which(ctx, "Katera snov je kislina?|Which substance is an acid?", ACIDS.map(F), [...BASES, ...NEUTRAL].map(F));
    if (k === 1) return which(ctx, "Katera snov je baza?|Which substance is a base?", BASES.map(F), [...ACIDS, ...NEUTRAL].map(F));
    if (k === 2) return bank(ctx, [
      ["Ion, ki povzroča kislost?|Ion responsible for acidity?", "H₃O⁺", "OH⁻", "Na⁺", "Cl⁻"],
      ["Ion, ki povzroča bazičnost?|Ion responsible for basicity?", "OH⁻", "H₃O⁺", "Na⁺", "O²⁻"],
      ["Kislina + baza → sol + ?|Acid + base → salt + ?", "H₂O", "H₂", "O₂", "CO₂"],
      ["Kislina + kovina (Zn) → sol + ?|Acid + metal (Zn) → salt + ?", "H₂", "H₂O", "O₂", "CO₂"],
      ["Kislina + karbonat → sol + H₂O + ?|Acid + carbonate → salt + H₂O + ?", "CO₂", "H₂", "O₂", "CO"],
    ]);
    const v = shuffle([1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13]).slice(0, 4).sort((a, b) => a - b);
    return Math.random() < 0.5
      ? mk(L(ctx, "Najbolj kisla raztopina?|Most acidic solution?"), phs(v[0]), v.slice(1).map(phs))
      : mk(L(ctx, "Najbolj bazična raztopina?|Most basic solution?"), phs(v[3]), v.slice(0, 3).map(phs));
  }
  const k = R(0, 2);
  if (k === 0) return which(ctx, "Katera snov je kisla?|Which substance is acidic?", SOUR, [...shuffle(BASIC).slice(0, 2), pick(NEUTR)]);
  if (k === 1) return which(ctx, "Katera snov je bazična?|Which substance is basic?", BASIC, [...shuffle(SOUR).slice(0, 2), pick(NEUTR)]);
  return which(ctx, "Katera snov je nevtralna?|Which substance is neutral?", NEUTR, [...shuffle(SOUR).slice(0, 2), pick(BASIC)]);
});

const ACIDAN = [["HCl", "Cl"], ["HNO3", "NO3"], ["H2SO4", "SO4"], ["H3PO4", "PO4"]];
const BASECAT = [["NaOH", "Na"], ["KOH", "K"], ["LiOH", "Li"], ["Ca(OH)2", "Ca"], ["Mg(OH)2", "Mg"], ["Ba(OH)2", "Ba"], ["Al(OH)3", "Al"]];
const lcm = (a, b) => (a * b) / gcd(a, b);
const co = (n, s) => (n === 1 ? s : `${n} ${s}`);
def("k_neut", "km_kb", 9, "Nevtralizacija", "Neutralization", (t, ctx) => {
  for (;;) {
    const [af, ak] = pick(t === 1 ? ACIDAN.slice(0, 3) : ACIDAN), [bf, ck] = pick(t === 1 ? BASECAT.slice(0, 4) : BASECAT);
    const cat = CAT.find((c) => c[0] === ck);
    if (!cat[5].split(" ").includes(ak)) continue;
    const [x, y] = salt(cat, ak), right = formula(cat[1], x, ak, y);
    if (t < 3) {
      const ws = saltWrongs(cat, ak);
      return mk(`${F(af)} + ${F(bf)} → ? + H₂O`, right, [ws[0], ...shuffle(ws.slice(1))]);
    }
    const a = -AN[ak][0], c = cat[2], w = lcm(a, c);
    if (w === 1) continue;
    const q = `${F(co(y, af))} + ${F(co(x, bf))} → ${right} + ? H₂O`;
    return ints(q, w, [a, c, a + c, a * c, w + 1, w - 1], 1);
  }
});

def("k_ph", "km_kb", 11, "Računanje pH", "Calculating pH", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const ML = "mol/L";
  const n = R(1, 13);
  if (t === 1) return ints(`[H₃O⁺] = 10${sup(-n)} ${ML}: pH = ?`, n, [14 - n, n + 1, n - 1, 10 - n].filter((x) => x !== n), 0);
  if (t === 2) {
    const k = R(0, 2);
    if (k === 0) return ints(`[OH⁻] = 10${sup(-n)} ${ML}: pH = ?`, 14 - n, [n, 14 + n, 13 - n, 15 - n], 0);
    if (k === 1) return ints(`pOH = ${n}: pH = ?`, 14 - n, [n, 14 + n, 7 + n, 13 - n], 0);
    const m = R(1, 4), strong = Math.random() < 0.5;
    const c = ctx.num(10 ** -m);
    return strong
      ? ints(sl ? `HCl, c = ${c} ${ML}: pH = ?` : `HCl, c = ${c} ${ML}: pH = ?`, m, [14 - m, m + 1, 10 * m, 7 - m].filter((x) => x !== m), 0)
      : ints(sl ? `NaOH, c = ${c} ${ML}: pH = ?` : `NaOH, c = ${c} ${ML}: pH = ?`, 14 - m, [m, 14 + m, 13 - m, 7 + m], 0);
  }
  if (Math.random() < 0.5) {
    const p = R(1, 13);
    const pw = (e) => `10${sup(e)} ${ML}`;
    return mk(`pH = ${p}: [H₃O⁺] = ?`, pw(-p), [pw(p), pw(p - 14), `${p} ${ML}`, pw(-(p + 1)), pw(1 - p)]);
  }
  const p = R(1, 4), k = pick([1, 2]); // največ pH 6: še daleč od avtoprotolize vode
  const q = sl ? `Močno kislino s pH ${p} razredčimo ${10 ** k}×: pH?` : `Strong acid, pH ${p}, diluted ${10 ** k}×: pH?`;
  return ints(q, p + k, [p - k, p * 10 ** k, p, p + 10 ** k > 14 ? p + k + 1 : p + 10 ** k], 0);
});

// ===== ORGANSKA KEMIJA =====
const PRE = ["met", "et", "prop", "but", "pent", "heks", "hept", "okt", "non", "dek"];
const PRE_EN = ["meth", "eth", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
const CH = (c, h, tail = "") => F(`C${c > 1 ? c : ""}H${h > 1 ? h : ""}${tail}`);
// rodilnik imena: metan → metana
def("k_hom", "km_org", 9, "Ogljikovodiki in homologne vrste", "Hydrocarbons and homologous series", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const fq = (stem, en) => (sl ? `Formula ${stem}?` : `Formula of ${en}?`);
  if (t === 1) {
    const n = R(1, 10);
    if (Math.random() < 0.4) {
      const nm = (k, sfx = "an") => alkName(ctx, k, sfx);
      return mk(`${CH(n, 2 * n + 2)} = ?`, nm(n), [n > 1 ? nm(n, "en") : null, n > 1 ? nm(n - 1) : null, n < 10 ? nm(n + 1) : null, nm(n === 1 ? 3 : 1)].filter(Boolean), PRE.map((_, i) => nm(i + 1)));
    }
    return mk(fq(PRE[n - 1] + "ana", PRE_EN[n - 1] + "ane"), CH(n, 2 * n + 2), [CH(n, 2 * n), CH(n, 2 * n + 1), CH(n + 1, 2 * n + 2), CH(n, n + 2), CH(n, 2 * n - 2)].filter((x, i) => i !== 4 || n > 1));
  }
  if (t === 2) {
    if (Math.random() < 0.3) {
      return bank(ctx, [
        ["Splošna formula alkanov?|General formula of alkanes?", "CₙH₂ₙ₊₂", "CₙH₂ₙ", "CₙH₂ₙ₋₂", "CₙH₂ₙ₊₁"],
        ["Splošna formula alkenov?|General formula of alkenes?", "CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂", "CₙHₙ"],
        ["Splošna formula alkinov?|General formula of alkynes?", "CₙH₂ₙ₋₂", "CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙHₙ"],
        ["Alkani imajo med atomi C?|Alkanes have C–C bonds that are?", "enojne vezi|single", "dvojno vez|double", "trojno vez|triple", "ionske vezi|ionic"],
        ["Alkeni imajo med atomi C?|Alkenes contain a C–C bond that is?", "dvojno vez|double", "le enojne vezi|only single", "trojno vez|triple", "ionsko vez|ionic"],
        ["Alkini imajo med atomi C?|Alkynes contain a C–C bond that is?", "trojno vez|triple", "dvojno vez|double", "le enojne vezi|only single", "ionsko vez|ionic"],
      ]);
    }
    const n = R(2, 6), ene = Math.random() < 0.6;
    const [h, sfx, sfxEn] = ene ? [2 * n, "ena", "ene"] : [2 * n - 2, "ina", "yne"];
    return mk(fq(PRE[n - 1] + sfx, PRE_EN[n - 1] + sfxEn), CH(n, h), shuffle([CH(n, 2 * n + 2), CH(n, ene ? 2 * n - 2 : 2 * n), CH(n, h + 1), CH(n, h - 1)]));
  }
  const k = R(0, 2), n = R(1, 5);
  if (k === 0) {
    const nn = R(3, 8);
    return mk(L(ctx, "Kateri ogljikovodik je alkan?|Which hydrocarbon is an alkane?"), CH(nn, 2 * nn + 2), [CH(nn, 2 * nn), CH(nn, 2 * nn - 2), CH(nn, 2 * nn - 4)]);
  }
  if (k === 1) {
    const name = n === 1 ? "metanol|methanol" : n === 2 ? "etanol|ethanol" : `${PRE[n - 1]}an-1-ol|${PRE_EN[n - 1]}an-1-ol`;
    return mk(sl ? `Formula ${L(ctx, name)}a?` : `Formula of ${L(ctx, name)}?`, CH(n, 2 * n + 1, "OH"), [CH(n, 2 * n + 2, "OH"), CH(n, 2 * n, "OH"), CH(n, 2 * n - 1, "OH"), CH(n + 1, 2 * n + 1, "OH")].filter((x) => !x.includes("H₀")));
  }
  // karboksilne kisline: CₙH₂ₙ₊₁COOH (n = 0 → HCOOH)
  const m = R(0, 3);
  const acid = m === 0 ? "HCOOH" : CH(m, 2 * m + 1, "COOH");
  const name = ["metanojske kisline|methanoic acid", "etanojske kisline|ethanoic acid", "propanojske kisline|propanoic acid", "butanojske kisline|butanoic acid"][m];
  const ws = [m === 0 ? "CH₃OH" : CH(m, 2 * m + 2, "COOH"), m === 0 ? "H₂COOH" : CH(m, 2 * m, "COOH"), CH(m + 1, 2 * m + 3, "COOH"), m === 0 ? "HCHO" : CH(m + 1, 2 * m + 3, "OH")];
  return mk(sl ? `Formula ${L(ctx, name)}?` : `Formula of ${L(ctx, name)}?`, acid, ws);
});

const alkName = (ctx, n, sfx = "an") => (ctx.lang === "sl" ? PRE[n - 1] + sfx : PRE_EN[n - 1] + (sfx === "an" ? "ane" : sfx === "en" ? "ene" : sfx));
const chain = (n) => (n === 1 ? "CH₄" : n === 2 ? "CH₃CH₃" : n === 3 ? "CH₃CH₂CH₃" : F(`CH3(CH2)${n - 2}CH3`));
// [struktura, ime sl|en, napačna imena …]
const ORG2 = [
  ["CH2=CH2", "eten|ethene", "etan|ethane", "etin|ethyne", "propen|propene"],
  ["CH2=CHCH3", "propen|propene", "propan|propane", "propin|propyne", "eten|ethene"],
  ["CH2=CHCH2CH3", "but-1-en|but-1-ene", "but-2-en|but-2-ene", "butan|butane", "but-1-in|but-1-yne"],
  ["CH3CH=CHCH3", "but-2-en|but-2-ene", "but-1-en|but-1-ene", "butan|butane", "but-2-in|but-2-yne"],
  ["HC≡CH", "etin|ethyne", "eten|ethene", "etan|ethane", "propin|propyne"],
  ["HC≡CCH3", "propin|propyne", "propen|propene", "etin|ethyne", "propan|propane"],
  ["CH3OH", "metanol|methanol", "etanol|ethanol", "metan|methane", "metanal|methanal"],
  ["CH3CH2OH", "etanol|ethanol", "metanol|methanol", "etanal|ethanal", "propanol|propanol"],
  ["CH3CH2CH2OH", "propan-1-ol|propan-1-ol", "propan-2-ol|propan-2-ol", "propanal|propanal", "butan-1-ol|butan-1-ol"],
  ["CH3CH(OH)CH3", "propan-2-ol|propan-2-ol", "propan-1-ol|propan-1-ol", "propanon|propanone", "propanal|propanal"],
  ["CH3CH2CH2CH2OH", "butan-1-ol|butan-1-ol", "butan-2-ol|butan-2-ol", "propan-1-ol|propan-1-ol", "butanal|butanal"],
  ["CH3CHClCH3", "2-kloropropan|2-chloropropane", "1-kloropropan|1-chloropropane", "2-kloropropen|2-chloropropene", "kloroetan|chloroethane"],
];
const ORG3 = [
  ["HCHO", "metanal|methanal", "metanol|methanol", "etanal|ethanal", "metanojska kislina|methanoic acid"],
  ["CH3CHO", "etanal|ethanal", "etanol|ethanol", "propanal|propanal", "propanon|propanone"],
  ["CH3CH2CHO", "propanal|propanal", "propanon|propanone", "propanol|propanol", "etanal|ethanal"],
  ["CH3COCH3", "propanon|propanone", "propanal|propanal", "propan-2-ol|propan-2-ol", "etanal|ethanal"],
  ["CH3COCH2CH3", "butanon|butanone", "butanal|butanal", "propanon|propanone", "butan-2-ol|butan-2-ol"],
  ["HCOOH", "metanojska kislina|methanoic acid", "etanojska kislina|ethanoic acid", "metanal|methanal", "metanol|methanol"],
  ["CH3COOH", "etanojska kislina|ethanoic acid", "metanojska kislina|methanoic acid", "etanal|ethanal", "etanol|ethanol"],
  ["CH3CH2COOH", "propanojska kislina|propanoic acid", "etanojska kislina|ethanoic acid", "propanal|propanal", "butanojska kislina|butanoic acid"],
  ["CH3COOCH3", "metil etanoat|methyl ethanoate", "etil metanoat|ethyl methanoate", "etil etanoat|ethyl ethanoate", "etanojska kislina|ethanoic acid"],
  ["HCOOCH2CH3", "etil metanoat|ethyl methanoate", "metil etanoat|methyl ethanoate", "etil etanoat|ethyl ethanoate", "propanojska kislina|propanoic acid"],
  ["CH3COOCH2CH3", "etil etanoat|ethyl ethanoate", "metil propanoat|methyl propanoate", "etil metanoat|ethyl methanoate", "butanojska kislina|butanoic acid"],
  ["CH3CH2OCH2CH3", "dietil eter|diethyl ether", "etil etanoat|ethyl ethanoate", "butanol|butanol", "butanon|butanone"],
];
def("k_iupac", "km_org", 9, "Imena organskih spojin", "Naming organic compounds", (t, ctx) => {
  if (t === 1) {
    const n = R(1, 10);
    const ws = [n > 1 ? alkName(ctx, n - 1) : null, n < 10 ? alkName(ctx, n + 1) : null, n > 1 ? alkName(ctx, n, "en") : null, n > 2 ? alkName(ctx, n - 2) : alkName(ctx, n + 2)];
    return mk(`${chain(n)} = ?`, alkName(ctx, n), ws, PRE.map((_, i) => alkName(ctx, i + 1)));
  }
  const [s, ...names] = pick(t === 2 ? ORG2 : [...ORG3, ...ORG3, ...ORG2.slice(8)]);
  return bank(ctx, [[`${F(s)} = ?`, ...names]]);
});

const FG1 = [
  ["R–OH", "alkohol|alcohol", ["aldehid|aldehyde", "eter|ether", "keton|ketone", "amin|amine"]],
  ["R–COOH", "karboksilna kislina|carboxylic acid", ["aldehid|aldehyde", "keton|ketone", "eter|ether", "amin|amine"]],
  ["R–CHO", "aldehid|aldehyde", ["keton|ketone", "alkohol|alcohol", "eter|ether", "ester|ester"]],
  ["R–CO–R'", "keton|ketone", ["aldehid|aldehyde", "eter|ether", "alkohol|alcohol", "amin|amine"]],
  ["R–COO–R'", "ester|ester", ["eter|ether", "keton|ketone", "aldehid|aldehyde", "alkohol|alcohol"]],
  ["R–O–R'", "eter|ether", ["ester|ester", "alkohol|alcohol", "keton|ketone", "aldehid|aldehyde"]],
  ["R–NH₂", "amin|amine", ["amid|amide", "alkohol|alcohol", "eter|ether", "aldehid|aldehyde"]],
  ["R–X (X = Cl, Br)", "halogenoalkan|haloalkane", ["alkohol|alcohol", "amin|amine", "eter|ether", "ester|ester"]],
  ["R–CH=CH–R'", "alken|alkene", ["alkan|alkane", "alkin|alkyne", "eter|ether", "keton|ketone"]],
  ["R–C≡C–R'", "alkin|alkyne", ["alken|alkene", "alkan|alkane", "aldehid|aldehyde", "amin|amine"]],
  ["R–CO–NH₂", "amid|amide", ["amin|amine", "keton|ketone", "ester|ester", "aldehid|aldehyde"]],
  ["C₆H₅–R", "aren|arene", ["alken|alkene", "alkin|alkyne", "alkan|alkane", "eter|ether"]],
];
// ime → skupina spojin
const FG2 = [
  ["alkohol|alcohol", ["metanol|methanol", "etanol|ethanol", "propan-1-ol|propan-1-ol", "butan-2-ol|butan-2-ol"]],
  ["aldehid|aldehyde", ["metanal|methanal", "etanal|ethanal", "propanal|propanal"]],
  ["keton|ketone", ["propanon|propanone", "butanon|butanone", "pentan-2-on|pentan-2-one"]],
  ["ester|ester", ["metil etanoat|methyl ethanoate", "etil etanoat|ethyl ethanoate", "etil metanoat|ethyl methanoate"]],
  ["alken|alkene", ["eten|ethene", "propen|propene", "but-1-en|but-1-ene"]],
  ["alkin|alkyne", ["etin|ethyne", "propin|propyne"]],
  ["alkan|alkane", ["metan|methane", "propan|propane", "heksan|hexane"]],
  ["eter|ether", ["etoksietan|ethoxyethane", "metoksimetan|methoxymethane"]],
];
const BIOMOL = [
  ["Monomer beljakovin?|Monomer of proteins?", "aminokislina|amino acid", "glukoza|glucose", "nukleotid|nucleotide", "glicerol|glycerol"],
  ["Monomer škroba?|Monomer of starch?", "glukoza|glucose", "fruktoza|fructose", "saharoza|sucrose", "aminokislina|amino acid"],
  ["Vez med aminokislinama?|Bond between amino acids?", "peptidna|peptide", "glikozidna|glycosidic", "estrska|ester", "ionska|ionic"],
  ["Trigliceridi so estri glicerola in?|Triglycerides are esters of glycerol and?", "maščobnih kislin|fatty acids", "aminokislin|amino acids", "glukoze|glucose", "etanola|ethanol"],
  ["Glukoza je?|Glucose is a?", "monosaharid|monosaccharide", "disaharid|disaccharide", "polisaharid|polysaccharide", "aminokislina|amino acid"],
  ["Saharoza je?|Sucrose is a?", "disaharid|disaccharide", "monosaharid|monosaccharide", "polisaharid|polysaccharide", "lipid|lipid"],
  ["Celuloza je?|Cellulose is a?", "polisaharid|polysaccharide", "monosaharid|monosaccharide", "disaharid|disaccharide", "beljakovina|protein"],
  ["Polimer etena?|Polymer of ethene?", "polieten|polyethene", "polipropen|polypropene", "najlon|nylon", "celuloza|cellulose"],
];
def("k_fg", "km_org", 9, "Funkcionalne skupine", "Functional groups", (t, ctx) => {
  if (t === 1) {
    const [g, a, ws] = pick(FG1);
    return mk(`${g}: ${L(ctx, "skupina spojin?|compound class?")}`, L(ctx, a), shuffle(ws).map((s) => L(ctx, s)));
  }
  if (t === 3 && Math.random() < 0.5) return bank(ctx, BIOMOL);
  const i = R(0, FG2.length - 1), [cls, names] = FG2[i];
  const others = shuffle(FG2.filter((_, j) => j !== i).map((x) => L(ctx, x[0])));
  return mk(`${L(ctx, pick(names))}: ${L(ctx, "skupina spojin?|compound class?")}`, L(ctx, cls), others);
});

const ORX1 = [
  ["Eten + H₂ → ?|Ethene + H₂ → ?", "etan|ethane", "etin|ethyne", "etanol|ethanol", "metan|methane"],
  ["Eten + H₂O → ?|Ethene + H₂O → ?", "etanol|ethanol", "etan|ethane", "etanal|ethanal", "etin|ethyne"],
  ["Eten + Br₂ → ?|Ethene + Br₂ → ?", "1,2-dibromoetan|1,2-dibromoethane", "bromoetan|bromoethane", "1,1-dibromoetan|1,1-dibromoethane", "bromoeten|bromoethene"],
  ["Eten + HCl → ?|Ethene + HCl → ?", "kloroetan|chloroethane", "1,2-dikloroetan|1,2-dichloroethane", "kloroeten|chloroethene", "etan|ethane"],
  ["Popolno gorenje alkana da?|Complete combustion of an alkane gives?", "CO₂ in H₂O|CO₂ and H₂O", "CO in H₂O|CO and H₂O", "C in H₂|C and H₂", "CO₂ in H₂|CO₂ and H₂"],
  ["Alkoholno vrenje glukoze da etanol in?|Fermentation of glucose gives ethanol and?", "CO₂", "O₂", "H₂O", "H₂"],
  ["Eten + Cl₂ → ?|Ethene + Cl₂ → ?", "1,2-dikloroetan|1,2-dichloroethane", "kloroetan|chloroethane", "1,1-dikloroetan|1,1-dichloroethane", "kloroeten|chloroethene"],
  ["Propen + H₂ → ?|Propene + H₂ → ?", "propan|propane", "propin|propyne", "propanol|propanol", "etan|ethane"],
  ["Etin + 2 H₂ → ?|Ethyne + 2 H₂ → ?", "etan|ethane", "eten|ethene", "etanol|ethanol", "metan|methane"],
  ["CH₄ + 2 O₂ → CO₂ + ?", "2 H₂O", "H₂O", "2 H₂", "4 H₂O"],
  ["Nepopolno gorenje da strupeni?|Incomplete combustion gives toxic?", "CO", "H₂O", "O₂", "N₂"],
  ["Eten razbarva bromovico, ker je?|Ethene decolourises bromine water: it is?", "nenasičen|unsaturated", "nasičen|saturated", "kisel|acidic", "ionski|ionic"],
];
const ORX2 = [
  ["Vrsta reakcije: eten + Br₂?|Reaction type: ethene + Br₂?", "adicija|addition", "substitucija|substitution", "eliminacija|elimination", "kondenzacija|condensation"],
  ["Vrsta reakcije: metan + Cl₂ (svetloba)?|Reaction type: methane + Cl₂ (light)?", "substitucija|substitution", "adicija|addition", "eliminacija|elimination", "polimerizacija|polymerization"],
  ["Etanol → eten + H₂O je?|Ethanol → ethene + H₂O is?", "eliminacija|elimination", "adicija|addition", "substitucija|substitution", "polimerizacija|polymerization"],
  ["Nastanek polietena iz etena je?|Making polyethene from ethene is?", "polimerizacija|polymerization", "eliminacija|elimination", "substitucija|substitution", "nevtralizacija|neutralization"],
  ["Alkohol + karboksilna kislina → ?|Alcohol + carboxylic acid → ?", "ester + voda|ester + water", "eter + voda|ether + water", "sol + voda|salt + water", "aldehid + H₂|aldehyde + H₂"],
  ["Metan + Cl₂ (svetloba) → CH₃Cl + ?|Methane + Cl₂ (light) → CH₃Cl + ?", "HCl", "H₂", "H₂O", "CH₄"],
];
const ORX3 = [
  ["Blaga oksidacija etanola → ?|Mild oxidation of ethanol → ?", "etanal|ethanal", "eten|ethene", "etan|ethane", "metanol|methanol"],
  ["Oksidacija propan-2-ola → ?|Oxidation of propan-2-ol → ?", "propanon|propanone", "propanal|propanal", "propen|propene", "propan|propane"],
  ["Oksidacija etanala → ?|Oxidation of ethanal → ?", "etanojska kislina|ethanoic acid", "etanol|ethanol", "eten|ethene", "metanal|methanal"],
  ["Formula benzena?|Formula of benzene?", "C₆H₆", "C₆H₁₂", "C₆H₁₄", "C₆H₁₀"],
  ["Hidroliza estra da kislino in?|Ester hydrolysis gives an acid and?", "alkohol|an alcohol", "aldehid|an aldehyde", "eter|an ether", "keton|a ketone"],
  ["Monomer PVC?|Monomer of PVC?", "kloroeten|chloroethene", "eten|ethene", "propen|propene", "kloroetan|chloroethane"],
];
def("k_orgrx", "km_org", 12, "Organske reakcije", "Organic reactions", (t, ctx) => bank(ctx, t === 1 ? ORX1 : t === 2 ? [...ORX1, ...ORX2] : [...ORX2, ...ORX3, ...ORX3]));

// ===== VEZI IN SNOVI =====
const IONIC = ["NaCl", "KBr", "MgO", "CaF2", "Na2O", "LiF", "CaCl2", "KCl"];
const COVAL = ["H2O", "CO2", "NH3", "CH4", "HCl", "Cl2", "O2", "N2", "H2"];
const METAL = ["Fe", "Cu", "Al", "Mg", "Na", "Zn"];
const POLAR = ["H2O", "HCl", "NH3", "HF"], NONPOL = ["H2", "Cl2", "O2", "N2", "F2", "Br2"];
const BONDB = [
  ["Vez v molekuli N₂?|Bond in an N₂ molecule?", "trojna|triple", "enojna|single", "dvojna|double", "ionska|ionic"],
  ["Vez v molekuli O₂?|Bond in an O₂ molecule?", "dvojna|double", "enojna|single", "trojna|triple", "ionska|ionic"],
  ["Vez v molekuli Cl₂?|Bond in a Cl₂ molecule?", "enojna|single", "dvojna|double", "trojna|triple", "ionska|ionic"],
  ["Vez C–C v etinu?|C–C bond in ethyne?", "trojna|triple", "enojna|single", "dvojna|double", "ionska|ionic"],
  ["Vez C–C v etenu?|C–C bond in ethene?", "dvojna|double", "enojna|single", "trojna|triple", "ionska|ionic"],
  ["Oblika molekule CH₄?|Shape of CH₄?", "tetraedrična|tetrahedral", "kotna|bent", "linearna|linear", "trikotna planarna|trigonal planar"],
  ["Oblika molekule H₂O?|Shape of H₂O?", "kotna|bent", "linearna|linear", "trikotna planarna|trigonal planar", "trikotna piramidalna|trigonal pyramidal"],
  ["Oblika molekule CO₂?|Shape of CO₂?", "linearna|linear", "kotna|bent", "trikotna planarna|trigonal planar", "tetraedrična|tetrahedral"],
  ["Oblika molekule NH₃?|Shape of NH₃?", "trikotna piramidalna|trigonal pyramidal", "trikotna planarna|trigonal planar", "kotna|bent", "linearna|linear"],
  ["Oblika molekule BF₃?|Shape of BF₃?", "trikotna planarna|trigonal planar", "trikotna piramidalna|trigonal pyramidal", "kotna|bent", "tetraedrična|tetrahedral"],
  ["Glavne sile med molekulami H₂O?|Main forces between H₂O molecules?", "vodikove vezi|hydrogen bonds", "ionske vezi|ionic bonds", "kovinske vezi|metallic bonds", "kovalentne vezi|covalent bonds"],
  ["Najbolj elektronegativen element?|Most electronegative element?", "F", "O", "Cl", "N"],
  ["Elektroni v kovinski vezi so?|Electrons in a metallic bond are?", "delokalizirani|delocalized", "vezani na en atom|bound to one atom", "izgubljeni|lost", "v jedru|in the nucleus"],
];
// 4. možnost ni »vodikova vez«: ta je med molekulami H₂O, NH₃ … res prisotna in bi bila sporna
const BT = ["ionska|ionic", "kovalentna|covalent", "kovinska|metallic", "ni kemijske vezi|no chemical bond"];
const BT2 = ["ionska|ionic", "polarna kovalentna|polar covalent", "nepolarna kovalentna|nonpolar covalent", "kovinska|metallic"];
def("k_bond", "km_vez", 9, "Kemijske vezi", "Chemical bonds", (t, ctx) => {
  const q = (f) => (ctx.lang === "sl" ? `Vrsta kemijske vezi v ${F(f)}?` : `Chemical bond in ${F(f)}?`);
  if (t === 1) {
    const k = R(0, 2), f = pick([IONIC, COVAL, METAL][k]);
    return mk(q(f), L(ctx, BT[k]), BT.filter((_, i) => i !== k).map((s) => L(ctx, s)));
  }
  if (t === 2) {
    const k = R(0, 3), f = pick([IONIC, POLAR, NONPOL, METAL][k]);
    return mk(q(f), L(ctx, BT2[k]), BT2.filter((_, i) => i !== k).map((s) => L(ctx, s)));
  }
  return bank(ctx, BONDB);
});

const ELEM = ["kisik|oxygen", "železo|iron", "baker|copper", "dušik|nitrogen", "žveplo|sulfur", "zlato|gold", "helij|helium"];
const COMP = ["destilirana voda|distilled water", "ogljikov dioksid|carbon dioxide", "natrijev klorid|sodium chloride", "glukoza|glucose", "amoniak|ammonia"];
const MIX = ["zrak|air", "morska voda|sea water", "granit|granite", "mleko|milk", "bron|bronze", "kis|vinegar"];
const PHASE = ["taljenje|melting", "strjevanje|freezing", "izparevanje|vaporization", "kondenzacija|condensation", "sublimacija|sublimation", "depozicija|deposition"];
const PHQ = ["trdno → tekoče?|solid → liquid?", "tekoče → trdno?|liquid → solid?", "tekoče → plinasto?|liquid → gas?", "plinasto → tekoče?|gas → liquid?", "trdno → plinasto?|solid → gas?"];
// metoda ločevanja v imenovalniku (brez predloga s/z, ki bi izdal odgovor)
const SEP = [
  ["Ločevanje: pesek + voda?|Separating sand + water?", "filtracija|filtration", "lij ločnik|separating funnel", "magnet|magnet", "kromatografija|chromatography"],
  ["Čista voda iz slane vode?|Pure water from salt water?", "destilacija|distillation", "filtracija|filtration", "magnet|magnet", "kromatografija|chromatography"],
  ["Ločevanje barvil v črnilu?|Separating dyes in ink?", "kromatografija|chromatography", "filtracija|filtration", "magnet|magnet", "lij ločnik|separating funnel"],
  ["Ločevanje: železo + žveplo?|Separating iron filings + sulfur?", "magnet|magnet", "filtracija|filtration", "destilacija|distillation", "kromatografija|chromatography"],
  ["Ločevanje: olje + voda?|Separating oil + water?", "lij ločnik|separating funnel", "magnet|magnet", "filtracija|filtration", "kromatografija|chromatography"],
  ["Ločevanje: etanol + voda?|Separating ethanol + water?", "destilacija|distillation", "filtracija|filtration", "magnet|magnet", "lij ločnik|separating funnel"],
];
const MATB = [
  ["Stalna oblika in prostornina?|Fixed shape and volume?", "trdnina|solid", "kapljevina|liquid", "plin|gas", "raztopina|solution"],
  ["Zapolni vso posodo?|Fills the whole container?", "plin|gas", "trdnina|solid", "kapljevina|liquid", "kristal|crystal"],
  ["Stalna prostornina, oblika posode?|Fixed volume, takes container's shape?", "kapljevina|liquid", "plin|gas", "trdnina|solid", "kristal|crystal"],
  ["Topnost plinov v vodi pri višji T?|Gas solubility in water at higher T?", "se zmanjša|decreases", "se poveča|increases", "ostane enaka|stays the same", "postane 0|becomes zero"],
  ["Topnost večine trdnin pri višji T?|Solubility of most solids at higher T?", "se poveča|increases", "se zmanjša|decreases", "ostane enaka|stays the same", "postane 0|becomes zero"],
  ["Raztopina, ki ne raztopi več topljenca?|Solution that dissolves no more solute?", "nasičena|saturated", "nenasičena|unsaturated", "razredčena|dilute", "nevtralna|neutral"],
  ["Difuzija je najhitrejša v?|Diffusion is fastest in?", "plinu|a gas", "kapljevini|a liquid", "trdnini|a solid", "kristalu|a crystal"],
  ["Zmes, v kateri ne vidimo delov?|Mixture with no visible parts?", "homogena|homogeneous", "heterogena|heterogeneous", "suspenzija|suspension", "emulzija|emulsion"],
  ["Snov, ki jo raztapljamo?|Substance that is dissolved?", "topljenec|solute", "topilo|solvent", "raztopina|solution", "usedlina|precipitate"],
  ["Snov, v kateri raztapljamo?|Substance that dissolves the solute?", "topilo|solvent", "topljenec|solute", "raztopina|solution", "usedlina|precipitate"],
  ["Čista snov se tali pri?|A pure substance melts at?", "stalni temperaturi|a fixed temperature", "vedno 0 °C|always 0 °C", "vedno 100 °C|always 100 °C", "spremenljivi T|a varying T"],
  ["Gostota ledu glede na vodo?|Density of ice vs water?", "manjša|lower", "večja|higher", "enaka|the same", "dvakrat večja|twice as high"],
];
def("k_matter", "km_vez", 8, "Snovi, zmesi in agregatna stanja", "Substances, mixtures and states", (t, ctx) => {
  if (t === 1) {
    const k = R(0, 2);
    if (k === 0) return which(ctx, "Kaj je zmes?|Which is a mixture?", MIX, [...ELEM, ...COMP]);
    if (k === 1) return which(ctx, "Kaj je element?|Which is an element?", ELEM, [...MIX, ...COMP]);
    return which(ctx, "Kaj je spojina?|Which is a compound?", COMP, [...ELEM, ...MIX]);
  }
  if (t === 2) {
    if (Math.random() < 0.5) return bank(ctx, SEP);
    const k = R(0, PHQ.length - 1);
    const qq = L(ctx, PHQ[k]);
    return mk(qq[0].toUpperCase() + qq.slice(1), L(ctx, PHASE[k]), shuffle(PHASE.filter((_, i) => i !== k)).map((s) => L(ctx, s)));
  }
  return bank(ctx, MATB);
});

export const CONCEPTS = C;
