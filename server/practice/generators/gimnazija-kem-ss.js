// Gimnazija: drugi tip naloge za teme kem-ss, ki so imele en sam generator (j, 2026-11-25).
// Merila: docs/kakovost.md §2. Relativne atomske mase kot v kem.js (H 1,01, C 12,01, N 14,01, O 16,00,
// Na 22,99, Cl 35,45 ...); molske mase snovi so vsota, zaokrožena na dve decimalki, in so navedene v besedilu.
// Vse naloge s pH veljajo pri 25 °C (pH + pOH = 14).
import { NAMES, g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { num, wrapGens } from "./matura-util.js";

// ---------- pomožne funkcije ----------
const AR = { H: 1.01, He: 4.0, C: 12.01, N: 14.01, O: 16.0, Na: 22.99, Mg: 24.31, Al: 26.98, S: 32.07, Cl: 35.45, K: 39.1, Ca: 40.08, Fe: 55.85, Cu: 63.55, Zn: 65.38, Ag: 107.87, Ba: 137.33 };
const ROUND = ["na celo število", "na eno decimalko", "na dve decimalki", "na tri decimalke", "na štiri decimalke"];
const zaokr = (d) => `Zaokroži ${ROUND[d]}.`;
const q = (v, u) => `${v}\\ \\mathrm{${u}}`;
const needsRounding = (x, d) => Math.abs(x - roundHalfUp(x, d)) > 1e-9;
// "= 4{,}5\ \mathrm{g}" ali "\approx 4{,}51\ \mathrm{g}"
const res = (x, d, u) => `${needsRounding(x, d) ? "\\approx" : "="} ${u ? q(tx(roundHalfUp(x, d), d), u) : tx(roundHalfUp(x, d), d)}`;
const name = (r) => r.pick(NAMES);
const UA = {
  "mol/L": ["mol/l", "M", "mol/dm3", "mol/dm³"],
  L: ["l", "dm3", "dm³"],
  mL: ["ml", "cm3", "cm³"],
  "g/mol": ["gmol-1"],
};
// Številski odgovor: napake kot [vrednost, zakaj]; alt = drugi sprejemljivi rezultati (vmesno zaokroževanje).
function ans(value, decimals, unit, mistakes = [], alt = []) {
  const a = num(value, decimals, mistakes.map(([v, why]) => ({ value: v, why })), unit);
  if (unit && UA[unit]) a.unitAlternatives = UA[unit];
  const ok = alt.filter((x) => Number.isFinite(x) && Math.abs(roundHalfUp(x, decimals) - roundHalfUp(value, decimals)) > 1e-9);
  if (ok.length) {
    a.alsoAccept = ok;
    a.mistakes = a.mistakes.filter((m) => ok.every((x) => Math.abs(roundHalfUp(x, decimals) - roundHalfUp(m.value, decimals)) > 1e-9));
  }
  return a;
}
const task = (text, answer, hint, given, find, formula, sol) => ({ text, answer, hint, data: { given, find }, formula, solution: sol.join("\n") });

// Sestava formule, tudi z oklepaji in kristalnovodnimi hidrati: "CuSO4·5H2O" → { Cu: 1, S: 1, O: 9, H: 10 }.
function comp(f) {
  const out = {};
  for (const part of f.split("·")) {
    const lead = part.match(/^(\d*)(.*)$/);
    const mult = lead[1] ? Number(lead[1]) : 1;
    const stack = [{}];
    const re = /([A-Z][a-z]?|\(|\))(\d*)/g;
    let m;
    while ((m = re.exec(lead[2]))) {
      const k = m[2] ? Number(m[2]) : 1;
      if (m[1] === "(") stack.push({});
      else if (m[1] === ")") {
        const grp = stack.pop();
        for (const [e, c] of Object.entries(grp)) stack.at(-1)[e] = (stack.at(-1)[e] || 0) + c * k;
      } else stack.at(-1)[m[1]] = (stack.at(-1)[m[1]] || 0) + k;
    }
    for (const [e, c] of Object.entries(stack[0])) out[e] = (out[e] || 0) + c * mult;
  }
  return out;
}
const molar = (f) => roundHalfUp(Object.entries(comp(f)).reduce((s, [e, k]) => s + AR[e] * k, 0), 2);
// Formula v TeX: "CuSO4·5H2O" → \mathrm{CuSO_{4} \cdot 5\,H_{2}O}
const sp = (f) =>
  `\\mathrm{${f
    .split("·")
    .map((p) => p.replace(/^(\d+)/, "$1\\,").replace(/([A-Za-z)])(\d+)/g, "$1_{$2}"))
    .join(" \\cdot ")}}`;
const Mtx = (f) => tx(molar(f), 2);
const Mdat = (f) => `M(${sp(f)}) = ${q(Mtx(f), "g/mol")}`;
const Mtxt = (f) => `$${Mdat(f)}$`;

const NA_TXT = "$N_A = 6{,}02 \\cdot 10^{23}\\ \\mathrm{mol^{-1}}$";
const NA_DAT = "N_A = 6{,}02 \\cdot 10^{23}\\ \\mathrm{mol^{-1}}";
const NA_SOL = "6{,}02 \\cdot 10^{23}\\ \\mathrm{mol^{-1}}";
const VM_TXT = "$V_m = 22{,}4\\ \\mathrm{L/mol}$";
const VM_DAT = "V_m = 22{,}4\\ \\mathrm{L/mol}";
const SCI = "Rezultat zapiši kot $x \\cdot 10^{23}$ in vpiši število $x$, zaokroženo na dve decimalki.";
const NP = "pri normalnih pogojih";

// =====================================================================
// KEM-SS-1/mnozina-snovi: število delcev (N_A) in molska prostornina plinov
// =====================================================================
const MOLEC = [
  ["H2O", "vode"], ["CO2", "ogljikovega dioksida"], ["NH3", "amonijaka"], ["CH4", "metana"],
  ["C6H12O6", "glukoze"], ["C2H5OH", "etanola"], ["O2", "kisika"], ["N2", "dušika"],
  ["H2SO4", "žveplove(VI) kisline"], ["SO2", "žveplovega dioksida"], ["Cl2", "klora"],
];
const GASES = [
  ["H2", "vodika"], ["He", "helija"], ["O2", "kisika"], ["N2", "dušika"], ["CO2", "ogljikovega dioksida"],
  ["CH4", "metana"], ["NH3", "amonijaka"], ["Cl2", "klora"], ["SO2", "žveplovega dioksida"],
];
const EL_GEN = { H: "vodika", C: "ogljika", O: "kisika", N: "dušika" };
// Snovi z elementom, ki je v formuli večkrat (za štetje atomov).
const ATOMS = [["H2O", "vode", "H"], ["NH3", "amonijaka", "H"], ["CH4", "metana", "H"], ["C6H12O6", "glukoze", "C"], ["C6H12O6", "glukoze", "H"], ["C2H5OH", "etanola", "H"], ["C2H5OH", "etanola", "C"], ["CO2", "ogljikovega dioksida", "O"], ["H2SO4", "žveplove(VI) kisline", "O"], ["SO2", "žveplovega dioksida", "O"]];
const N_PICK = [0.1, 0.2, 0.25, 0.4, 0.5, 0.75, 1.5, 2, 2.5, 3, 4];

function mnozina(level, r) {
  const v = r.int(0, level === 3 ? 2 : 3);
  if (level === 1) {
    if (v === 0) {
      const [f, gen] = r.pick(MOLEC);
      const n = r.pick(N_PICK);
      const x = n * 6.02;
      return task(
        `V vzorcu je $${q(tx(n), "mol")}$ ${gen} ($${sp(f)}$). Koliko molekul ${gen} je v vzorcu? ${NA_TXT}. ${SCI}`,
        ans(x, 2, null, [[n / 6.02, "Množino pomnoži z Avogadrovo konstanto, ne deli z njo."], [6.02, "Upoštevaj, koliko molov snovi je v vzorcu."]]),
        "En mol snovi vsebuje $N_A$ delcev: število molekul je množina krat $N_A$.",
        [`n = ${q(tx(n), "mol")}`, NA_DAT],
        ["N"],
        "N = n \\cdot N_A",
        [`$N = n \\cdot N_A = ${q(tx(n), "mol")} \\cdot ${NA_SOL}$`, `$N ${res(x, 2)} \\cdot 10^{23}$`, `$x ${res(x, 2)}$`],
      );
    }
    if (v === 1) {
      const [f, gen] = r.pick(MOLEC);
      const mant = r.int(12, 150) / 10;
      const n = mant / 6.02;
      return task(
        `Vzorec ${gen} ($${sp(f)}$) vsebuje $${tx(mant)} \\cdot 10^{23}$ molekul. Kolikšna je množina ${gen} v vzorcu? ${NA_TXT}. ${zaokr(3)}`,
        ans(n, 3, "mol", [[mant * 6.02, "Število delcev deli z Avogadrovo konstanto, ne množi."], [6.02 / mant, "Deli število delcev z $N_A$, ne obratno."]]),
        "Množina pove, koliko »paketov« po $N_A$ delcev je v vzorcu: deli število delcev z $N_A$.",
        [`N = ${tx(mant)} \\cdot 10^{23}`, NA_DAT],
        ["n"],
        "n = \\dfrac{N}{N_A}",
        [`$n = \\dfrac{N}{N_A} = \\dfrac{${tx(mant)} \\cdot 10^{23}}{${NA_SOL}}$`, `$n ${res(n, 3, "mol")}$`],
      );
    }
    const [f, gen] = r.pick(GASES);
    if (v === 2) {
      const n = r.pick(N_PICK);
      const V = n * 22.4;
      return task(
        `Kolikšno prostornino zavzame $${q(tx(n), "mol")}$ ${gen} ($${sp(f)}$) ${NP}? ${VM_TXT}. ${zaokr(2)}`,
        ans(V, 2, "L", [[n / 22.4, "Prostornina je množina krat molska prostornina, ne deljeno."], [22.4 / n, "Množino pomnoži z $V_m$."]]),
        "Pri normalnih pogojih zavzame 1 mol katerega koli plina $22{,}4\\ \\mathrm{L}$.",
        [`n = ${q(tx(n), "mol")}`, VM_DAT],
        ["V"],
        "V = n \\cdot V_m",
        [`$V = n \\cdot V_m = ${q(tx(n), "mol")} \\cdot ${q("22{,}4", "L/mol")}$`, `$V ${res(V, 2, "L")}$`],
      );
    }
    const V = r.int(5, 900) / 10;
    const n = V / 22.4;
    return task(
      `Plin $${sp(f)}$ iz jeklenke bi ${NP} zavzel $${q(tx(V), "L")}$. Kolikšna je množina ${gen} v jeklenki? ${VM_TXT}. ${zaokr(3)}`,
      ans(n, 3, "mol", [[V * 22.4, "Prostornino deli z molsko prostornino, ne množi."], [22.4 / V, "Deli prostornino z $V_m$, ne obratno."]]),
      "Ugotovi, kolikokrat je v dani prostornini po $22{,}4\\ \\mathrm{L}$ (en mol plina).",
      [`V = ${q(tx(V), "L")}`, VM_DAT],
      ["n"],
      "n = \\dfrac{V}{V_m}",
      [`$n = \\dfrac{V}{V_m} = \\dfrac{${q(tx(V), "L")}}{${q("22{,}4", "L/mol")}}$`, `$n ${res(n, 3, "mol")}$`],
    );
  }
  if (level === 2) {
    if (v === 0) {
      const [f, gen] = r.pick(MOLEC);
      const M = molar(f);
      const m = roundHalfUp((M * r.int(4, 60)) / 20, 1);
      const n = m / M;
      const x = n * 6.02;
      return task(
        `Koliko molekul je v $${q(tx(m), "g")}$ ${gen} ($${sp(f)}$)? ${Mtxt(f)}, ${NA_TXT}. ${SCI}`,
        ans(x, 2, null, [[m * 6.02, "Maso najprej pretvori v množino z molsko maso."], [(M / m) * 6.02, "Množina je masa deljeno z molsko maso, ne obratno."]], [roundHalfUp(n, 3) * 6.02]),
        "Najprej izračunaj množino snovi iz mase, nato število molekul.",
        [`m = ${q(tx(m), "g")}`, Mdat(f), NA_DAT],
        ["N"],
        ["n = \\dfrac{m}{M}", "N = n \\cdot N_A"],
        [`$n = \\dfrac{m}{M} = \\dfrac{${q(tx(m), "g")}}{${q(Mtx(f), "g/mol")}} ${res(n, 4, "mol")}$`, `$N = n \\cdot N_A ${res(x, 2)} \\cdot 10^{23}$`, `$x ${res(x, 2)}$`],
      );
    }
    if (v === 1 || v === 2) {
      const [f, gen] = r.pick(GASES);
      const M = molar(f);
      if (v === 1) {
        const m = roundHalfUp((M * r.int(2, 60)) / 20, 1);
        const n = m / M;
        const V = n * 22.4;
        return task(
          `Balon napolnimo z $${q(tx(m), "g")}$ ${gen} ($${sp(f)}$). Kolikšno prostornino bi ta plin zavzel ${NP}? ${Mtxt(f)}, ${VM_TXT}. ${zaokr(2)}`,
          ans(V, 2, "L", [[m * 22.4, "Maso najprej pretvori v množino; $V_m$ velja za 1 mol, ne za 1 g."], [(M / m) * 22.4, "Množina je masa deljeno z molsko maso, ne obratno."], [m / 22.4, "Prostornina je množina krat $V_m$."]], [roundHalfUp(n, 3) * 22.4]),
          "Iz mase izračunaj množino plina, nato uporabi molsko prostornino.",
          [`m = ${q(tx(m), "g")}`, Mdat(f), VM_DAT],
          ["V"],
          ["n = \\dfrac{m}{M}", "V = n \\cdot V_m"],
          [`$n = \\dfrac{m}{M} = \\dfrac{${q(tx(m), "g")}}{${q(Mtx(f), "g/mol")}} ${res(n, 4, "mol")}$`, `$V = n \\cdot V_m ${res(V, 2, "L")}$`],
        );
      }
      const V = r.int(5, 500) / 10;
      const n = V / 22.4;
      const m = n * M;
      return task(
        `Kolikšna je masa $${q(tx(V), "L")}$ ${gen} ($${sp(f)}$) ${NP}? ${Mtxt(f)}, ${VM_TXT}. ${zaokr(2)}`,
        ans(m, 2, "g", [[V * M, "Prostornino najprej pretvori v množino z molsko prostornino."], [n / M, "Masa je množina krat molska masa, ne deljeno."]], [roundHalfUp(n, 3) * M, roundHalfUp(n, 4) * M]),
        "Iz prostornine izračunaj množino plina, nato maso.",
        [`V = ${q(tx(V), "L")}`, Mdat(f), VM_DAT],
        ["m"],
        ["n = \\dfrac{V}{V_m}", "m = n \\cdot M"],
        [`$n = \\dfrac{V}{V_m} = \\dfrac{${q(tx(V), "L")}}{${q("22{,}4", "L/mol")}} ${res(n, 4, "mol")}$`, `$m = n \\cdot M ${res(m, 2, "g")}$`],
      );
    }
    const [f, gen, el] = r.pick(ATOMS);
    const c = comp(f);
    const k = c[el];
    const all = Object.values(c).reduce((s, x) => s + x, 0);
    const n = r.pick(N_PICK);
    const x = n * k * 6.02;
    return task(
      `Koliko atomov ${EL_GEN[el]} je v $${q(tx(n), "mol")}$ ${gen} ($${sp(f)}$)? ${NA_TXT}. ${SCI}`,
      ans(x, 2, null, [[n * 6.02, "To je število molekul; vsaka molekula ima več atomov tega elementa."], [n * all * 6.02, `Šteješ le atome ${EL_GEN[el]}, ne vseh atomov v molekuli.`]]),
      `Najprej izračunaj število molekul, nato upoštevaj, koliko atomov ${EL_GEN[el]} je v eni molekuli.`,
      [`n = ${q(tx(n), "mol")}`, NA_DAT],
      [`N(\\mathrm{${el}})`],
      ["N = n \\cdot N_A", `N(\\mathrm{${el}}) = ${k} \\cdot N`],
      [`$N = n \\cdot N_A = ${q(tx(n), "mol")} \\cdot ${NA_SOL} ${res(n * 6.02, 3)} \\cdot 10^{23}$`, `Ena molekula $${sp(f)}$ ima ${k} ${k === 2 ? "atoma" : k <= 4 ? "atome" : "atomov"} ${EL_GEN[el]}.`, `$N(\\mathrm{${el}}) = ${k} \\cdot N ${res(x, 2)} \\cdot 10^{23}$`, `$x ${res(x, 2)}$`],
    );
  }
  // ---------- raven 3 ----------
  if (v === 0) {
    const [f, gen, el] = r.pick(ATOMS);
    const c = comp(f);
    const k = c[el];
    const all = Object.values(c).reduce((s, x) => s + x, 0);
    const M = molar(f);
    const m = roundHalfUp((M * r.int(4, 40)) / 20, 1);
    const n = m / M;
    const x = n * k * 6.02;
    return task(
      `Koliko atomov ${EL_GEN[el]} je v $${q(tx(m), "g")}$ ${gen} ($${sp(f)}$)? ${Mtxt(f)}, ${NA_TXT}. ${SCI}`,
      ans(x, 2, null, [[n * 6.02, "To je število molekul; upoštevaj, koliko atomov tega elementa ima ena molekula."], [m * k * 6.02, "Maso najprej pretvori v množino z molsko maso."], [n * all * 6.02, `Šteješ le atome ${EL_GEN[el]}, ne vseh atomov.`]], [roundHalfUp(n, 3) * k * 6.02, roundHalfUp(n, 4) * k * 6.02]),
      "Pot: masa → množina → število molekul → število atomov.",
      [`m = ${q(tx(m), "g")}`, Mdat(f), NA_DAT],
      [`N(\\mathrm{${el}})`],
      ["n = \\dfrac{m}{M}", "N = n \\cdot N_A", `N(\\mathrm{${el}}) = ${k} \\cdot N`],
      [
        `$n = \\dfrac{m}{M} = \\dfrac{${q(tx(m), "g")}}{${q(Mtx(f), "g/mol")}} ${res(n, 4, "mol")}$`,
        `$N = n \\cdot N_A ${res(n * 6.02, 3)} \\cdot 10^{23}$ molekul`,
        `$N(\\mathrm{${el}}) = ${k} \\cdot N ${res(x, 2)} \\cdot 10^{23}$`,
        `$x ${res(x, 2)}$`,
      ],
    );
  }
  if (v === 1) {
    const [f] = r.pick(GASES.slice(2));
    const M = molar(f);
    const V = r.int(10, 60) / 10;
    const m = roundHalfUp((V / 22.4) * M, 2);
    const n = V / 22.4;
    const Mc = m / n;
    const who = name(r);
    return task(
      `${who} je v bučko s prostornino $${q(tx(V), "L")}$ ${g(who, "ujel", "ujela")} neznan plin. Masa plina je $${q(tx(m, 2), "g")}$, prostornina je merjena ${NP}. Kolikšna je molska masa plina? ${VM_TXT}. ${zaokr(1)}`,
      ans(Mc, 1, "g/mol", [[(m * V) / 22.4, "Množina je prostornina deljeno z $V_m$; molska masa je masa deljeno z množino."], [m / V, "To je gostota plina v g/L, ne molska masa."]], [m / roundHalfUp(n, 3), m / roundHalfUp(n, 4)]),
      "Iz prostornine najprej izračunaj množino plina.",
      [`V = ${q(tx(V), "L")}`, `m = ${q(tx(m, 2), "g")}`, VM_DAT],
      ["M"],
      ["n = \\dfrac{V}{V_m}", "M = \\dfrac{m}{n}"],
      [
        `$n = \\dfrac{V}{V_m} = \\dfrac{${q(tx(V), "L")}}{${q("22{,}4", "L/mol")}} ${res(n, 4, "mol")}$`,
        `$M = \\dfrac{m}{n} = \\dfrac{m \\cdot V_m}{V} = \\dfrac{${tx(m, 2)}\\ \\mathrm{g} \\cdot 22{,}4\\ \\mathrm{L/mol}}{${q(tx(V), "L")}} ${res(Mc, 1, "g/mol")}$`,
        `Tako molsko maso ima na primer $${sp(f)}$ ($M = ${q(Mtx(f), "g/mol")}$).`,
      ],
    );
  }
  const [X, genX] = r.pick(MOLEC);
  const [Y, genY] = r.pick(GASES.filter(([y]) => y !== X && y !== "He"));
  const MX = molar(X);
  const MY = molar(Y);
  const V = r.int(5, 200) / 10;
  const n = V / 22.4;
  const m = n * MX;
  return task(
    `Koliko gramov ${genX} ($${sp(X)}$) vsebuje enako število molekul kot $${q(tx(V), "L")}$ ${genY} ($${sp(Y)}$) ${NP}? ${Mtxt(X)}, ${Mtxt(Y)}, ${VM_TXT}. ${zaokr(2)}`,
    ans(m, 2, "g", [[n * MY, "Enako število molekul pomeni enako množino, ne enako maso: uporabi molsko maso iskane snovi."], [V * MX, "Prostornino plina najprej pretvori v množino z $V_m$."], [(n / MX), "Masa je množina krat molska masa, ne deljeno."]], [roundHalfUp(n, 3) * MX, roundHalfUp(n, 4) * MX]),
    "Enako število molekul pomeni enako množino snovi. Najprej izračunaj množino plina.",
    [`V = ${q(tx(V), "L")}`, Mdat(X), Mdat(Y), VM_DAT],
    [`m(${sp(X)})`],
    ["n = \\dfrac{N}{N_A} \\Rightarrow n_1 = n_2", "n = \\dfrac{V}{V_m}", "m = n \\cdot M"],
    [
      `$n(${sp(Y)}) = \\dfrac{V}{V_m} = \\dfrac{${q(tx(V), "L")}}{${q("22{,}4", "L/mol")}} ${res(n, 4, "mol")}$`,
      `Enako število molekul pomeni enako množino: $n(${sp(X)}) = n(${sp(Y)})$.`,
      `$m(${sp(X)}) = n \\cdot M(${sp(X)}) ${res(m, 2, "g")}$`,
    ],
  );
}

// =====================================================================
// KEM-SS-1/stehiometrija: računanje po urejeni enačbi, omejitveni reaktant, izkoristek
// =====================================================================
const SP_GEN = {
  H2: "vodika", O2: "kisika", H2O: "vode", CH4: "metana", CO2: "ogljikovega dioksida", Mg: "magnezija", MgO: "magnezijevega oksida",
  CaCO3: "kalcijevega karbonata", CaO: "kalcijevega oksida", Zn: "cinka", HCl: "klorovodika", ZnCl2: "cinkovega klorida",
  Na: "natrija", Cl2: "klora", NaCl: "natrijevega klorida", N2: "dušika", NH3: "amonijaka", Al: "aluminija", Al2O3: "aluminijevega oksida",
  Fe2O3: "železovega(III) oksida", CO: "ogljikovega monoksida", Fe: "železa", C3H8: "propana", NaOH: "natrijevega hidroksida",
  H2SO4: "žveplove(VI) kisline", Na2SO4: "natrijevega sulfata", MgCl2: "magnezijevega klorida", KClO3: "kalijevega klorata",
  KCl: "kalijevega klorida", S: "žvepla", FeS: "železovega(II) sulfida", C2H5OH: "etanola", Cu: "bakra", CuO: "bakrovega(II) oksida",
};
const GAS = new Set(["H2", "O2", "N2", "CO2", "CH4", "NH3", "Cl2", "CO", "C3H8"]);
function rxn(s, ctx) {
  const side = (x) => x.split(" + ").map((t) => { const m = t.match(/^(\d*)(.+)$/); return { nu: m[1] ? Number(m[1]) : 1, f: m[2] }; });
  const [l, p] = s.split(" -> ");
  const R = { ctx, re: side(l), pr: side(p) };
  // Kontrola ob nalaganju: enačba mora biti urejena.
  const tot = (sd) => { const o = {}; for (const { nu, f } of sd) for (const [e, k] of Object.entries(comp(f))) o[e] = (o[e] || 0) + nu * k; return JSON.stringify(Object.entries(o).sort()); };
  if (tot(R.re) !== tot(R.pr)) throw new Error(`neurejena enačba: ${s}`);
  R.all = [...R.re.map((x) => ({ ...x, re: true })), ...R.pr.map((x) => ({ ...x, re: false }))];
  R.tex = [R.re, R.pr].map((sd) => sd.map((x) => `${x.nu > 1 ? `${x.nu}\\,` : ""}${sp(x.f)}`).join(" + ")).join(" \\rightarrow ");
  return R;
}
const RXN = [
  rxn("2H2 + O2 -> 2H2O", "Vodik gori v kisiku"),
  rxn("CH4 + 2O2 -> CO2 + 2H2O", "Zemeljski plin (metan) gori"),
  rxn("2Mg + O2 -> 2MgO", "Magnezijev trak gori na zraku"),
  rxn("CaCO3 -> CaO + CO2", "Pri žganju apnenca poteka reakcija"),
  rxn("Zn + 2HCl -> ZnCl2 + H2", "Cink raztapljamo v klorovodikovi kislini"),
  rxn("2Na + Cl2 -> 2NaCl", "Natrij reagira s klorom"),
  rxn("N2 + 3H2 -> 2NH3", "Amonijak pridobivajo s sintezo"),
  rxn("4Al + 3O2 -> 2Al2O3", "Aluminijev prah gori"),
  rxn("Fe2O3 + 3CO -> 2Fe + 3CO2", "V plavžu poteka reakcija"),
  rxn("C3H8 + 5O2 -> 3CO2 + 4H2O", "Propan v plinskem gorilniku gori"),
  rxn("2NaOH + H2SO4 -> Na2SO4 + 2H2O", "Pri nevtralizaciji poteka reakcija"),
  rxn("Mg + 2HCl -> MgCl2 + H2", "Magnezij raztapljamo v klorovodikovi kislini"),
  rxn("2KClO3 -> 2KCl + 3O2", "Pri segrevanju kalijevega klorata poteka reakcija"),
  rxn("Fe + S -> FeS", "Zmes železa in žvepla segrejemo"),
  rxn("C2H5OH + 3O2 -> 2CO2 + 3H2O", "Etanol gori"),
  rxn("2Cu + O2 -> 2CuO", "Bakreno žico žarimo na zraku"),
];
const RXN2 = RXN.filter((R) => R.re.length === 2);
const ratioTex = (B, A) => `\\dfrac{${B.nu}}{${A.nu}}`;
const nT = (x) => `n(${sp(x.f)})`;

function stehiometrija(level, r) {
  const v = r.int(0, 2);
  if (level === 1) {
    // Snovi z različnima koeficientoma, sicer je odgovor kar dana množina.
    let R, A, B;
    for (let i = 0; i < 40; i++) {
      R = r.pick(RXN);
      if (v === 0) [A, B] = [r.pick(R.re), r.pick(R.pr)];
      else if (v === 1) [A, B] = [r.pick(R.pr), r.pick(R.re)];
      else {
        const sd = R.re.length === 2 && (R.pr.length < 2 || r.int(0, 1) === 0) ? R.re : R.pr.length === 2 ? R.pr : R.all;
        A = r.pick(sd);
        B = r.pick(sd.filter((x) => x !== A));
      }
      if (A.nu !== B.nu) break;
    }
    const nA = r.pick([0.2, 0.3, 0.5, 0.6, 0.8, 1.2, 1.5, 2, 2.4, 3, 4.5]);
    const nB = (nA * B.nu) / A.nu;
    const reA = R.re.includes(A);
    const reB = R.re.includes(B);
    const ask =
      reA && !reB ? `Koliko molov ${SP_GEN[B.f]} nastane, ko popolnoma zreagira $${q(tx(nA), "mol")}$ ${SP_GEN[A.f]}?`
        : !reA && reB ? `Koliko molov ${SP_GEN[B.f]} se porabi, ko nastane $${q(tx(nA), "mol")}$ ${SP_GEN[A.f]}?`
          : reA ? `Koliko molov ${SP_GEN[B.f]} zreagira z $${q(tx(nA), "mol")}$ ${SP_GEN[A.f]}?`
            : `Koliko molov ${SP_GEN[B.f]} nastane hkrati s $${q(tx(nA), "mol")}$ ${SP_GEN[A.f]}?`;
    return task(
      `${R.ctx}: $${R.tex}$. ${ask} ${zaokr(3)}`,
      ans(nB, 3, "mol", [[nA, "Upoštevaj koeficiente v enačbi: množine niso enake."], [(nA * A.nu) / B.nu, "Razmerje koeficientov si obrnil."]]),
      "Koeficienti v urejeni enačbi povedo razmerje množin snovi.",
      [`${nT(A)} = ${q(tx(nA), "mol")}`],
      [nT(B)],
      `\\dfrac{${nT(B)}}{${nT(A)}} = ${ratioTex(B, A)}`,
      [`Iz enačbe: $\\dfrac{${nT(B)}}{${nT(A)}} = ${ratioTex(B, A)}$`, `$${nT(B)} = ${q(tx(nA), "mol")} \\cdot ${ratioTex(B, A)} ${res(nB, 3, "mol")}$`],
    );
  }
  if (level === 2) {
    let R, A, B;
    if (v === 1) {
      R = r.pick(RXN.filter((x) => x.all.some((y) => GAS.has(y.f))));
      B = r.pick(R.all.filter((y) => GAS.has(y.f)));
      A = r.pick(R.all.filter((y) => y !== B && (y.re !== B.re || (y.re && B.re))));
    } else {
      R = r.pick(RXN.filter((x) => x.pr.some((y) => y.f !== "H2O")));
      // v = 0: iz mase reaktanta masa produkta; v = 2: koliko reaktanta potrebujemo za dano maso produkta.
      const re = r.pick(R.re);
      const pr = r.pick(R.pr.filter((y) => y.f !== "H2O"));
      [A, B] = v === 0 ? [re, pr] : [pr, re];
    }
    const MA = molar(A.f);
    const MB = molar(B.f);
    const mA = r.int(20, 600) / 10;
    const nA = mA / MA;
    const nB = (nA * B.nu) / A.nu;
    const alt = (fn) => [fn(roundHalfUp(nA, 3)), fn(roundHalfUp(nA, 4))];
    const sol1 = [`$${nT(A)} = \\dfrac{m}{M} = \\dfrac{${q(tx(mA), "g")}}{${q(Mtx(A.f), "g/mol")}} ${res(nA, 4, "mol")}$`, `$${nT(B)} = ${nT(A)} \\cdot ${ratioTex(B, A)} ${res(nB, 4, "mol")}$`];
    if (v === 1) {
      const V = nB * 22.4;
      return task(
        `${R.ctx}: $${R.tex}$. Kolikšna prostornina ${SP_GEN[B.f]} ${NP} ${A.re && B.re ? `zreagira z $${q(tx(mA), "g")}$ ${SP_GEN[A.f]}` : `${B.re ? "zreagira" : "nastane"}, ${A.re ? "ko zreagira" : "ko nastane"} $${q(tx(mA), "g")}$ ${SP_GEN[A.f]}`}? ${Mtxt(A.f)}, ${VM_TXT}. ${zaokr(2)}`,
        ans(V, 2, "L", [[nA * 22.4, "Upoštevaj razmerje koeficientov v enačbi."], [(nA * A.nu * 22.4) / B.nu, "Razmerje koeficientov si obrnil."], [mA * (B.nu / A.nu) * 22.4, "Maso najprej pretvori v množino z molsko maso."]], alt((n) => ((n * B.nu) / A.nu) * 22.4)),
        "Pot: masa → množina snovi → množina plina (po enačbi) → prostornina.",
        [`m(${sp(A.f)}) = ${q(tx(mA), "g")}`, Mdat(A.f), VM_DAT],
        [`V(${sp(B.f)})`],
        ["n = \\dfrac{m}{M}", `\\dfrac{${nT(B)}}{${nT(A)}} = ${ratioTex(B, A)}`, "V = n \\cdot V_m"],
        [...sol1, `$V = ${nT(B)} \\cdot V_m ${res(V, 2, "L")}$`],
      );
    }
    const mB = nB * MB;
    return task(
      v === 0
        ? `${R.ctx}: $${R.tex}$. Koliko gramov ${SP_GEN[B.f]} nastane iz $${q(tx(mA), "g")}$ ${SP_GEN[A.f]}? ${Mtxt(A.f)}, ${Mtxt(B.f)}. ${zaokr(2)}`
        : `${R.ctx}: $${R.tex}$. Koliko gramov ${SP_GEN[B.f]} potrebujemo, da nastane $${q(tx(mA), "g")}$ ${SP_GEN[A.f]}? ${Mtxt(A.f)}, ${Mtxt(B.f)}. ${zaokr(2)}`,
      ans(mB, 2, "g", [[nA * MB, "Upoštevaj razmerje koeficientov v enačbi."], [(nA * A.nu * MB) / B.nu, "Razmerje koeficientov si obrnil."], [(mA * B.nu) / A.nu, "Koeficienti povedo razmerje množin, ne mas: računaj z množino."]], alt((n) => ((n * B.nu) / A.nu) * MB)),
      "Pot: masa → množina → množina druge snovi (po enačbi) → masa.",
      [`m(${sp(A.f)}) = ${q(tx(mA), "g")}`, Mdat(A.f), Mdat(B.f)],
      [`m(${sp(B.f)})`],
      ["n = \\dfrac{m}{M}", `\\dfrac{${nT(B)}}{${nT(A)}} = ${ratioTex(B, A)}`, "m = n \\cdot M"],
      [...sol1, `$m(${sp(B.f)}) = ${nT(B)} \\cdot M ${res(mB, 2, "g")}$`],
    );
  }
  // ---------- raven 3 ----------
  if (v === 2) {
    // Izkoristek reakcije.
    const R = r.pick(RXN.filter((x) => x.pr.some((y) => !GAS.has(y.f) && y.f !== "H2O")));
    // Prvi reaktant je omejitveni, drugi (če je) je v prebitku.
    const A = R.re[0];
    const P = r.pick(R.pr.filter((y) => !GAS.has(y.f) && y.f !== "H2O"));
    const MA = molar(A.f);
    const MP = molar(P.f);
    const mA = r.int(50, 500) / 10;
    const theo = ((mA / MA) * P.nu * MP) / A.nu;
    const mD = roundHalfUp((theo * r.int(60, 95)) / 100, 2);
    const eta = (mD / theo) * 100;
    const who = name(r);
    return task(
      `${R.ctx}: $${R.tex}$. ${who} je iz $${q(tx(mA), "g")}$ ${SP_GEN[A.f]}${R.re.length > 1 ? ` in prebitka ${SP_GEN[R.re[1].f]}` : ""} ${g(who, "dobil", "dobila")} $${q(tx(mD, 2), "g")}$ ${SP_GEN[P.f]}. Kolikšen je izkoristek reakcije? ${Mtxt(A.f)}, ${Mtxt(P.f)}. Rezultat v odstotkih zaokroži ${ROUND[1]}.`,
      ans(eta, 1, "%", [[(theo / mD) * 100, "Izkoristek je dejanska masa deljeno s teoretično, ne obratno."], [(mD / ((mA / MA) * MP)) * 100, "Pri teoretični masi upoštevaj razmerje koeficientov."], [(mD / mA) * 100, "Primerjaj maso produkta s teoretično maso produkta, ne z maso reaktanta."]]),
      "Najprej po enačbi izračunaj teoretično maso produkta, nato jo primerjaj z dobljeno.",
      [`m(${sp(A.f)}) = ${q(tx(mA), "g")}`, `m_{dej}(${sp(P.f)}) = ${q(tx(mD, 2), "g")}`, Mdat(A.f), Mdat(P.f)],
      ["\\eta"],
      ["n = \\dfrac{m}{M}", `\\dfrac{${nT(P)}}{${nT(A)}} = ${ratioTex(P, A)}`, "\\eta = \\dfrac{m_{dej}}{m_{teor}} \\cdot 100\\ \\%"],
      [
        `$${nT(A)} = \\dfrac{${q(tx(mA), "g")}}{${q(Mtx(A.f), "g/mol")}} ${res(mA / MA, 4, "mol")}$`,
        `$${nT(P)} = ${nT(A)} \\cdot ${ratioTex(P, A)} ${res((mA / MA) * P.nu / A.nu, 4, "mol")}$`,
        `$m_{teor} = ${nT(P)} \\cdot M ${res(theo, 2, "g")}$`,
        `$\\eta = \\dfrac{${tx(mD, 2)}\\ \\mathrm{g}}{${tx(roundHalfUp(theo, 2), 2)}\\ \\mathrm{g}} \\cdot 100\\ \\% ${res(eta, 1, "\\%").replace("\\mathrm{\\%}", "\\%")}$`,
      ],
    );
  }
  // Omejitveni reaktant: v = 0 masa produkta, v = 1 masa reaktanta, ki ostane v prebitku.
  const R = r.pick(RXN2);
  const [A1, A2] = R.re;
  const x1 = r.int(2, 20) / 10;
  const f = r.pick([0.4, 0.5, 0.6, 0.7, 0.75, 1.3, 1.5, 1.6, 2, 2.5]);
  const M1 = molar(A1.f);
  const M2 = molar(A2.f);
  const m1 = roundHalfUp(x1 * A1.nu * M1, 1);
  const m2 = roundHalfUp(x1 * f * A2.nu * M2, 1);
  const n1 = m1 / M1;
  const n2 = m2 / M2;
  const [L, E, nL, nE, ML, ME, mE] = n1 / A1.nu <= n2 / A2.nu ? [A1, A2, n1, n2, M1, M2, m2] : [A2, A1, n2, n1, M2, M1, m1];
  const xi = nL / L.nu;
  const head = `${R.ctx}: $${R.tex}$. Za reakcijo imamo $${q(tx(m1), "g")}$ ${SP_GEN[A1.f]} in $${q(tx(m2), "g")}$ ${SP_GEN[A2.f]}.`;
  const sol = [
    `$${nT(A1)} = \\dfrac{${q(tx(m1), "g")}}{${q(Mtx(A1.f), "g/mol")}} ${res(n1, 4, "mol")}$, $${nT(A2)} = \\dfrac{${q(tx(m2), "g")}}{${q(Mtx(A2.f), "g/mol")}} ${res(n2, 4, "mol")}$`,
    `Za $${nT(L)} ${res(nL, 4, "mol")}$ bi potrebovali $${nT(E)} = ${nT(L)} \\cdot ${ratioTex(E, L)} ${res(xi * E.nu, 4, "mol")}$; imamo je $${tx(roundHalfUp(nE, 4), 4)}\\ \\mathrm{mol}$, zato je $${sp(E.f)}$ v prebitku, $${sp(L.f)}$ pa omejitveni reaktant.`,
  ];
  const given = [`m(${sp(A1.f)}) = ${q(tx(m1), "g")}`, `m(${sp(A2.f)}) = ${q(tx(m2), "g")}`, Mdat(A1.f), Mdat(A2.f)];
  if (v === 0) {
    const P = r.pick(R.pr.filter((y) => y.f !== "H2O").length ? R.pr.filter((y) => y.f !== "H2O") : R.pr);
    const MP = molar(P.f);
    const mP = xi * P.nu * MP;
    const fromE = (nE / E.nu) * P.nu * MP;
    return task(
      `${head} Koliko gramov ${SP_GEN[P.f]} največ nastane? ${Mtxt(A1.f)}, ${Mtxt(A2.f)}, ${Mtxt(P.f)}. ${zaokr(2)}`,
      ans(mP, 2, "g", [[fromE, "Računal si z reaktantom v prebitku: produkt določa omejitveni reaktant."], [nL * MP, "Upoštevaj razmerje koeficientov v enačbi."]], [roundHalfUp(nL, 3) / L.nu * P.nu * MP, roundHalfUp(nL, 4) / L.nu * P.nu * MP]),
      "Pretvori obe masi v množini in po enačbi ugotovi, kateri reaktant se porabi prvi.",
      [...given, Mdat(P.f)],
      [`m(${sp(P.f)})`],
      ["n = \\dfrac{m}{M}", `\\dfrac{${nT(P)}}{${nT(L)}} = ${ratioTex(P, L)}`, "m = n \\cdot M"],
      [...sol, `$${nT(P)} = ${nT(L)} \\cdot ${ratioTex(P, L)} ${res(xi * P.nu, 4, "mol")}$`, `$m(${sp(P.f)}) = n \\cdot M ${res(mP, 2, "g")}$`],
    );
  }
  const used = xi * E.nu * ME;
  const left = mE - used;
  return task(
    `${head} Koliko gramov reaktanta v prebitku ostane po reakciji? ${Mtxt(A1.f)}, ${Mtxt(A2.f)}. ${zaokr(2)}`,
    ans(left, 2, "g", [[used, "To je masa, ki je zreagirala; vprašanje je, koliko je ostane."], [mE - nL * ME, "Pri porabi reaktanta v prebitku upoštevaj razmerje koeficientov."]], [mE - (roundHalfUp(nL, 3) / L.nu) * E.nu * ME, mE - (roundHalfUp(nL, 4) / L.nu) * E.nu * ME]),
    "Najprej ugotovi omejitveni reaktant, nato izračunaj, koliko reaktanta v prebitku se porabi.",
    given,
    ["m_{ostane}"],
    ["n = \\dfrac{m}{M}", `\\dfrac{${nT(E)}}{${nT(L)}} = ${ratioTex(E, L)}`, "m_{ostane} = m_{začetna} - m_{porabljena}"],
    [...sol, `$m_{porabljena}(${sp(E.f)}) = ${tx(roundHalfUp(xi * E.nu, 4), 4)}\\ \\mathrm{mol} \\cdot ${q(Mtx(E.f), "g/mol")} ${res(used, 2, "g")}$`, `$m_{ostane} = ${q(tx(mE), "g")} - ${q(tx(roundHalfUp(used, 2), 2), "g")} ${res(left, 2, "g")}$`],
  );
}

// =====================================================================
// KEM-SS-1/raztopine: množinska koncentracija, redčenje, mešanje, pretvorba iz masnega deleža
// =====================================================================
const SOLUTES = [
  // [formula, rodilnik, največja koncentracija v nalogah v mol/L (pod topnostjo pri 20 °C)]
  ["NaCl", "natrijevega klorida", 5], ["NaOH", "natrijevega hidroksida", 6], ["KCl", "kalijevega klorida", 3], ["KNO3", "kalijevega nitrata", 2],
  ["CuSO4", "bakrovega(II) sulfata", 1], ["C6H12O6", "glukoze", 2], ["Na2CO3", "natrijevega karbonata", 1.5], ["NH4Cl", "amonijevega klorida", 5], ["AgNO3", "srebrovega nitrata", 5],
];
// Koncentrirani reagenti: [formula, rodilnik, masni delež v %, gostota v g/mL] (tabelne vrednosti pri 20 °C).
const CONC = [["HCl", "klorovodikove kisline", 36, 1.18], ["H2SO4", "žveplove(VI) kisline", 96, 1.84], ["HNO3", "dušikove(V) kisline", 65, 1.39], ["NH3", "amonijaka", 25, 0.91], ["NaOH", "natrijevega hidroksida", 20, 1.22]];
// Kristalohidrati: [hidrat, brezvodna sol, ime hidrata v tožilniku, v rodilniku, rodilnik soli, število molekul vode]
const HYD = [["CuSO4·5H2O", "CuSO4", "modro galico", "modre galice", "bakrovega(II) sulfata", 5], ["Na2CO3·10H2O", "Na2CO3", "kristalno sodo", "kristalne sode", "natrijevega karbonata", 10], ["MgSO4·7H2O", "MgSO4", "grenko sol", "grenke soli", "magnezijevega sulfata", 7], ["FeSO4·7H2O", "FeSO4", "zeleno galico", "zelene galice", "železovega(II) sulfata", 7]];
const cU = (c) => q(tx(c), "mol/L");

function raztopine(level, r) {
  const v = r.int(0, 3);
  const who = name(r);
  const [f, gen, cmax] = r.pick(SOLUTES);
  // Koncentracije le do topnosti snovi pri sobni temperaturi.
  const pc = (arr) => r.pick(arr.filter((c) => c <= cmax));
  if (level === 1) {
    if (v === 0) {
      const c1 = pc([0.1, 0.2, 0.5, 1, 1.5, 2, 3]);
      const V1 = r.pick([5, 10, 20, 25, 50]);
      const V2 = r.pick([100, 200, 250, 500, 1000]);
      const c2 = (c1 * V1) / V2;
      const d = c2 < 0.1 ? 4 : 3;
      return task(
        `${who} ${g(who, "je odpipetiral", "je odpipetirala")} $${q(V1, "mL")}$ raztopine ${gen} s koncentracijo $${cU(c1)}$ v merilno bučko in jo z vodo ${g(who, "dopolnil", "dopolnila")} do $${q(V2, "mL")}$. Kolikšna je koncentracija nove raztopine? ${zaokr(d)}`,
        ans(c2, d, "mol/L", [[(c1 * V2) / V1, "Pri redčenju se koncentracija zmanjša: razmerje prostornin si obrnil."], [c1, "Z dodajanjem vode se množina ne spremeni, koncentracija pa se zmanjša."]]),
        "Pri redčenju se množina topljenca ne spremeni.",
        [`c_1 = ${cU(c1)}`, `V_1 = ${q(V1, "mL")}`, `V_2 = ${q(V2, "mL")}`],
        ["c_2"],
        "c_1 V_1 = c_2 V_2",
        [`$c_2 = \\dfrac{c_1 V_1}{V_2} = \\dfrac{${cU(c1)} \\cdot ${q(V1, "mL")}}{${q(V2, "mL")}}$`, `$c_2 ${res(c2, d, "mol/L")}$`],
      );
    }
    if (v === 1) {
      const c = pc([0.05, 0.1, 0.2, 0.25, 0.5, 0.8, 1.2, 2]);
      const V = r.pick([0.1, 0.2, 0.25, 0.4, 0.5, 1.5, 2]);
      const n = c * V;
      return task(
        `V steklenici je $${q(tx(V), "L")}$ raztopine ${gen} ($${sp(f)}$) s koncentracijo $${cU(c)}$. Kolikšna množina ${gen} je raztopljena v njej? ${zaokr(3)}`,
        ans(n, 3, "mol", [[c / V, "Množina je koncentracija krat prostornina, ne deljeno."], [V / c, "Množina je koncentracija krat prostornina."]]),
        "Koncentracija pove množino topljenca v 1 L raztopine.",
        [`V = ${q(tx(V), "L")}`, `c = ${cU(c)}`],
        ["n"],
        "n = c \\cdot V",
        [`$n = c \\cdot V = ${cU(c)} \\cdot ${q(tx(V), "L")}$`, `$n ${res(n, 3, "mol")}$`],
      );
    }
    if (v === 2) {
      const c1 = pc([1, 2, 2.5, 5, 6]);
      const c2 = r.pick([0.05, 0.1, 0.2, 0.25, 0.5]);
      const V2 = r.pick([100, 250, 500, 1000]);
      const V1 = (c2 * V2) / c1;
      const d = V1 < 10 ? 2 : 1;
      return task(
        `Pripraviti želimo $${q(V2, "mL")}$ raztopine ${gen} s koncentracijo $${cU(c2)}$ iz založne raztopine s koncentracijo $${cU(c1)}$. Koliko mL založne raztopine potrebujemo? ${zaokr(d)}`,
        ans(V1, d, "mL", [[(c1 * V2) / c2, "Razmerje koncentracij si obrnil: založne raztopine potrebujemo manj, kot je končne."], [c2 * V2, "Množino topljenca deli s koncentracijo založne raztopine."]]),
        "Množina topljenca v odmerjeni založni raztopini je enaka množini v končni raztopini.",
        [`c_1 = ${cU(c1)}`, `c_2 = ${cU(c2)}`, `V_2 = ${q(V2, "mL")}`],
        ["V_1"],
        "c_1 V_1 = c_2 V_2",
        [`$V_1 = \\dfrac{c_2 V_2}{c_1} = \\dfrac{${cU(c2)} \\cdot ${q(V2, "mL")}}{${cU(c1)}}$`, `$V_1 ${res(V1, d, "mL")}$`],
      );
    }
    const V = r.pick([0.25, 0.5, 1, 2]);
    const m = r.int(2, 40);
    const gam = m / V;
    return task(
      `V $${q(tx(V), "L")}$ raztopine je raztopljenih $${q(m, "g")}$ ${gen}. Kolikšna je masna koncentracija ${gen} v $\\mathrm{g/L}$? ${zaokr(1)}`,
      ans(gam, 1, "g/L", [[V / m, "Masna koncentracija je masa deljeno s prostornino, ne obratno."], [m * V, "Maso deli s prostornino raztopine."]]),
      "Masna koncentracija pove, koliko gramov topljenca je v 1 L raztopine.",
      [`m = ${q(m, "g")}`, `V = ${q(tx(V), "L")}`],
      ["\\gamma"],
      "\\gamma = \\dfrac{m}{V}",
      [`$\\gamma = \\dfrac{m}{V} = \\dfrac{${q(m, "g")}}{${q(tx(V), "L")}}$`, `$\\gamma ${res(gam, 1, "g/L")}$`],
    );
  }
  const M = molar(f);
  if (level === 2) {
    if (v === 0) {
      const c = pc([0.05, 0.1, 0.15, 0.2, 0.25, 0.5, 1]);
      const V = r.pick([50, 100, 200, 250, 500]);
      const m = c * (V / 1000) * M;
      return task(
        `${who} mora pripraviti $${q(V, "mL")}$ raztopine ${gen} ($${sp(f)}$) s koncentracijo $${cU(c)}$. Koliko gramov ${gen} mora natehtati? ${Mtxt(f)}. ${zaokr(2)}`,
        ans(m, 2, "g", [[c * V * M, "Prostornino pretvori iz mL v L."], [(c * (V / 1000)) / M, "Masa je množina krat molska masa, ne deljeno."], [c * M, "Upoštevaj prostornino raztopine."]]),
        "Najprej izračunaj množino topljenca v raztopini, nato njegovo maso.",
        [`V = ${q(V, "mL")}`, `c = ${cU(c)}`, Mdat(f)],
        ["m"],
        ["n = c \\cdot V", "m = n \\cdot M"],
        [`$V = ${q(V, "mL")} = ${q(tx(V / 1000), "L")}$`, `$n = c \\cdot V = ${cU(c)} \\cdot ${q(tx(V / 1000), "L")} ${res(c * V / 1000, 4, "mol")}$`, `$m = n \\cdot M ${res(m, 2, "g")}$`],
      );
    }
    if (v === 1) {
      const m = r.int(5, 100) / 10;
      const V = r.pick([100, 150, 200, 250, 500]);
      const c = m / M / (V / 1000);
      return task(
        `V vodi raztopimo $${q(tx(m), "g")}$ ${gen} ($${sp(f)}$) in dobimo $${q(V, "mL")}$ raztopine. Kolikšna je množinska koncentracija raztopine? ${Mtxt(f)}. ${zaokr(3)}`,
        ans(c, 3, "mol/L", [[m / (V / 1000), "To je masna koncentracija; maso najprej pretvori v množino."], [m / M / V, "Prostornino pretvori iz mL v L."], [(m * M) / (V / 1000), "Množina je masa deljeno z molsko maso."]], [roundHalfUp(m / M, 4) / (V / 1000), roundHalfUp(m / M, 3) / (V / 1000)]),
        "Iz mase izračunaj množino topljenca, prostornino pretvori v litre.",
        [`m = ${q(tx(m), "g")}`, `V = ${q(V, "mL")}`, Mdat(f)],
        ["c"],
        ["n = \\dfrac{m}{M}", "c = \\dfrac{n}{V}"],
        [`$n = \\dfrac{m}{M} = \\dfrac{${q(tx(m), "g")}}{${q(Mtx(f), "g/mol")}} ${res(m / M, 4, "mol")}$`, `$V = ${q(tx(V / 1000), "L")}$`, `$c = \\dfrac{n}{V} ${res(c, 3, "mol/L")}$`],
      );
    }
    const c1 = pc([0.1, 0.2, 0.25, 0.4, 0.5, 1, 2]);
    const V1 = r.pick([20, 25, 40, 50, 80, 100]);
    if (v === 2) {
      const Vw = r.pick([30, 50, 60, 100, 150, 200]);
      const V2 = V1 + Vw;
      const c2 = (c1 * V1) / V2;
      const d = c2 < 0.1 ? 4 : 3;
      return task(
        `K $${q(V1, "mL")}$ raztopine ${gen} s koncentracijo $${cU(c1)}$ dolijemo $${q(Vw, "mL")}$ vode. Kolikšna je koncentracija nastale raztopine? Prostornini se seštejeta. ${zaokr(d)}`,
        ans(c2, d, "mol/L", [[(c1 * V1) / Vw, "Končna prostornina je raztopina skupaj z dodano vodo."], [(c1 * V2) / V1, "Pri redčenju se koncentracija zmanjša: razmerje prostornin si obrnil."]]),
        "Najprej izračunaj končno prostornino; množina topljenca ostane enaka.",
        [`V_1 = ${q(V1, "mL")}`, `c_1 = ${cU(c1)}`, `V_{vode} = ${q(Vw, "mL")}`],
        ["c_2"],
        ["V_2 = V_1 + V_{vode}", "c_1 V_1 = c_2 V_2"],
        [`$V_2 = ${q(V1, "mL")} + ${q(Vw, "mL")} = ${q(V2, "mL")}$`, `$c_2 = \\dfrac{c_1 V_1}{V_2} = \\dfrac{${cU(c1)} \\cdot ${q(V1, "mL")}}{${q(V2, "mL")}} ${res(c2, d, "mol/L")}$`],
      );
    }
    const k = r.pick([2, 4, 5, 8, 10]);
    const c2 = c1 / k;
    const V2 = (c1 * V1) / c2;
    const Vw = V2 - V1;
    return task(
      `Imamo $${q(V1, "mL")}$ raztopine ${gen} s koncentracijo $${cU(c1)}$. Koliko mL vode moramo doliti, da bo koncentracija $${cU(c2)}$? Prostornini se seštejeta. ${zaokr(1)}`,
      ans(Vw, 1, "mL", [[V2, "To je končna prostornina raztopine; od nje odštej prostornino, ki jo že imaš."], [(c2 * V1) / c1, "Razmerje koncentracij si obrnil."]]),
      "Najprej izračunaj končno prostornino razredčene raztopine.",
      [`V_1 = ${q(V1, "mL")}`, `c_1 = ${cU(c1)}`, `c_2 = ${cU(c2)}`],
      ["V_{vode}"],
      ["c_1 V_1 = c_2 V_2", "V_{vode} = V_2 - V_1"],
      [`$V_2 = \\dfrac{c_1 V_1}{c_2} = \\dfrac{${cU(c1)} \\cdot ${q(V1, "mL")}}{${cU(c2)}} ${res(V2, 1, "mL")}$`, `$V_{vode} = V_2 - V_1 = ${q(tx(V2), "mL")} - ${q(V1, "mL")} ${res(Vw, 1, "mL")}$`],
    );
  }
  // ---------- raven 3 ----------
  if (v === 0) {
    const c1 = pc([0.1, 0.2, 0.25, 0.5, 0.8, 1, 1.5, 2]);
    const c2 = r.pick([0.05, 0.1, 0.3, 0.4, 0.6, 1.2, 2.5].filter((c) => c <= cmax && c !== c1));
    const V1 = r.pick([50, 100, 150, 200, 250]);
    const V2 = r.pick([50, 100, 300, 400, 500]);
    const c = (c1 * V1 + c2 * V2) / (V1 + V2);
    return task(
      `${who} ${g(who, "je zmešal", "je zmešala")} $${q(V1, "mL")}$ raztopine ${gen} s koncentracijo $${cU(c1)}$ in $${q(V2, "mL")}$ raztopine ${gen} s koncentracijo $${cU(c2)}$. Kolikšna je koncentracija zmesi? Prostornini se seštejeta. ${zaokr(3)}`,
      ans(c, 3, "mol/L", [[(c1 + c2) / 2, "Navadno povprečje koncentracij velja le pri enakih prostorninah: seštej množini."], [c1 + c2, "Koncentracij ne seštevaš: seštej množini in ju deli s skupno prostornino."], [(c1 * V1 + c2 * V2) / Math.max(V1, V2), "Deli s skupno prostornino zmesi."]]),
      "Izračunaj množino topljenca v vsaki raztopini, ju seštej in deli s skupno prostornino.",
      [`V_1 = ${q(V1, "mL")}`, `c_1 = ${cU(c1)}`, `V_2 = ${q(V2, "mL")}`, `c_2 = ${cU(c2)}`],
      ["c"],
      ["n = c \\cdot V", "c = \\dfrac{n_1 + n_2}{V_1 + V_2}"],
      [
        `$n_1 = ${cU(c1)} \\cdot ${q(tx(V1 / 1000), "L")} = ${q(tx(roundHalfUp(c1 * V1 / 1000, 4)), "mol")}$`,
        `$n_2 = ${cU(c2)} \\cdot ${q(tx(V2 / 1000), "L")} = ${q(tx(roundHalfUp(c2 * V2 / 1000, 4)), "mol")}$`,
        `$c = \\dfrac{n_1 + n_2}{V_1 + V_2} = \\dfrac{${q(tx(roundHalfUp((c1 * V1 + c2 * V2) / 1000, 4)), "mol")}}{${q(tx((V1 + V2) / 1000), "L")}} ${res(c, 3, "mol/L")}$`,
      ],
    );
  }
  if (v === 1 || v === 2) {
    const [cf, cgen, w, rho] = r.pick(CONC);
    const Mc = molar(cf);
    const c = (w / 100) * rho * 1000 / Mc;
    const base = `Koncentrirana raztopina ${cgen} ima masni delež $${cf === "NH3" ? "\\mathrm{NH_{3}}" : sp(cf)}$ $${w}\\ \\%$ in gostoto $${q(tx(rho), "g/mL")}$.`;
    const given = [`w = ${w}\\ \\%`, `\\rho = ${q(tx(rho), "g/mL")}`, Mdat(cf)];
    const solC = [`Vzemimo $V = 1\\ \\mathrm{L} = 1000\\ \\mathrm{mL}$: $m_{raztopine} = \\rho V = ${tx(rho)} \\cdot 1000\\ \\mathrm{g} = ${q(tx(rho * 1000), "g")}$`, `$m(${sp(cf)}) = w \\cdot m_{raztopine} = ${tx(w / 100)} \\cdot ${q(tx(rho * 1000), "g")} ${res(w * rho * 10, 1, "g")}$`, `$n = \\dfrac{m}{M} ${res(c, 2, "mol")}$ v $1\\ \\mathrm{L}$`];
    if (v === 1) {
      return task(
        `${base} Kolikšna je njena množinska koncentracija? ${Mtxt(cf)}. ${zaokr(2)}`,
        ans(c, 2, "mol/L", [[(w * rho) / Mc, "Gostota je v g/mL: preračunaj na 1 L = 1000 mL."], [(w / 100) * 1000 / Mc, "Upoštevaj gostoto: 1 L raztopine nima mase 1000 g."], [rho * 1000 / Mc, "Upoštevaj masni delež: topljenec je le del mase raztopine."]]),
        "Izračunaj, koliko gramov topljenca je v 1 L raztopine, nato to pretvori v množino.",
        given,
        ["c"],
        ["m_{raztopine} = \\rho \\cdot V", "m = w \\cdot m_{raztopine}", "c = \\dfrac{n}{V} = \\dfrac{w \\cdot \\rho}{M}"],
        [...solC, `$c ${res(c, 2, "mol/L")}$`],
      );
    }
    const c2 = r.pick([0.1, 0.2, 0.25, 0.5, 1]);
    const V2 = r.pick([250, 500, 1000]);
    const n = c2 * V2 / 1000;
    const Vk = (n * Mc) / (w / 100) / rho;
    return task(
      `${base} Koliko mL te raztopine potrebujemo za pripravo $${q(V2, "mL")}$ raztopine s koncentracijo $${cU(c2)}$? ${Mtxt(cf)}. ${zaokr(1)}`,
      ans(Vk, 1, "mL", [[(n * Mc) / rho, "Upoštevaj masni delež: koncentrirana raztopina ni čista snov."], [(n * Mc) / (w / 100), "To je masa koncentrirane raztopine v g; z gostoto jo pretvori v prostornino."], [n * Mc, "To je masa čiste snovi; preračunaj še na raztopino z masnim deležem in gostoto."]]),
      "Izračunaj množino in maso čiste snovi v končni raztopini, nato maso in prostornino koncentrirane raztopine.",
      [...given, `V_2 = ${q(V2, "mL")}`, `c_2 = ${cU(c2)}`],
      ["V"],
      ["n = c_2 \\cdot V_2", "m = n \\cdot M", "m_{raztopine} = \\dfrac{m}{w}", "V = \\dfrac{m_{raztopine}}{\\rho}"],
      [
        `$n = c_2 V_2 = ${cU(c2)} \\cdot ${q(tx(V2 / 1000), "L")} = ${q(tx(n), "mol")}$`,
        `$m = n \\cdot M ${res(n * Mc, 3, "g")}$`,
        `$m_{raztopine} = \\dfrac{m}{w} = \\dfrac{${tx(roundHalfUp(n * Mc, 3), 3)}\\ \\mathrm{g}}{${tx(w / 100)}} ${res((n * Mc) / (w / 100), 3, "g")}$`,
        `$V = \\dfrac{m_{raztopine}}{\\rho} ${res(Vk, 1, "mL")}$`,
      ],
    );
  }
  // Kristalohidrat.
  const [hf, sf, hname, hgen, sgen, k] = r.pick(HYD);
  const Ms = molar(sf);
  const Mw = molar("H2O");
  const Mh = roundHalfUp(Ms + k * Mw, 2);
  const c = r.pick([0.05, 0.1, 0.2, 0.25, 0.5]);
  const V = r.pick([100, 200, 250, 500]);
  const n = c * V / 1000;
  const m = n * Mh;
  return task(
    `${who} pripravlja $${q(V, "mL")}$ raztopine ${sgen} s koncentracijo $${cU(c)}$. Na voljo ima le ${hname} ($${sp(hf)}$). Koliko gramov ${hgen} mora natehtati? ${Mtxt(sf)}, ${Mtxt("H2O")}. ${zaokr(2)}`,
    ans(m, 2, "g", [[n * Ms, "Tehtaš hidrat: v molsko maso vštej tudi kristalno vodo."], [n * (Ms + Mw), `Ena formulska enota hidrata vsebuje ${k} molekul vode, ne ene.`], [c * V * Mh, "Prostornino pretvori iz mL v L."]]),
    "Množina hidrata je enaka množini soli v raztopini; molska masa hidrata vključuje kristalno vodo.",
    [`V = ${q(V, "mL")}`, `c = ${cU(c)}`, Mdat(sf), Mdat("H2O")],
    [`m(${sp(hf)})`],
    ["n = c \\cdot V", `M(${sp(hf)}) = M(${sp(sf)}) + ${k} \\cdot M(\\mathrm{H_{2}O})`, "m = n \\cdot M"],
    [
      `$n(${sp(sf)}) = c \\cdot V = ${cU(c)} \\cdot ${q(tx(V / 1000), "L")} = ${q(tx(n), "mol")} = n(${sp(hf)})$`,
      `$M(${sp(hf)}) = ${tx(Ms, 2)} + ${k} \\cdot ${tx(Mw, 2)} = ${q(tx(Mh, 2), "g/mol")}$`,
      `$m = n \\cdot M = ${q(tx(n), "mol")} \\cdot ${q(tx(Mh, 2), "g/mol")} ${res(m, 2, "g")}$`,
    ],
  );
}

// =====================================================================
// KEM-SS-2/ph: močne kisline in baze, pOH, redčenje, nevtralizacija (25 °C)
// =====================================================================
const ACIDS = [["HCl", "klorovodikove kisline"], ["HNO3", "dušikove(V) kisline"]];
const BASES = [["NaOH", "natrijevega hidroksida"], ["KOH", "kalijevega hidroksida"]];
const BASES2 = [["Ba(OH)2", "barijevega hidroksida"], ["Ca(OH)2", "kalcijevega hidroksida"]];
const PH_SUM = "\\mathrm{pH} + \\mathrm{pOH} = 14";
const lg = Math.log10;

function ph(level, r) {
  const v = r.int(0, level === 3 ? 2 : 3);
  if (level === 1) {
    if (v === 0) {
      const given = r.int(0, 1) === 0 ? "pH" : "pOH";
      const other = given === "pH" ? "pOH" : "pH";
      const x = r.int(150, 1250) / 100;
      const y = 14 - x;
      return task(
        `Raztopina ima pri $25\\ {}^\\circ\\mathrm{C}$ $\\mathrm{${given}} = ${tx(x, 2)}$. Kolikšen je njen $\\mathrm{${other}}$? ${zaokr(2)}`,
        ans(y, 2, null, [[x, `$\\mathrm{pH}$ in $\\mathrm{pOH}$ nista enaka: pri $25\\ {}^\\circ\\mathrm{C}$ se seštejeta v 14.`], [7 - x, "Vsota pH in pOH je 14, ne 7."]]),
        "Pri 25 °C sta pH in pOH povezana z vsoto.",
        [`\\mathrm{${given}} = ${tx(x, 2)}`],
        [`\\mathrm{${other}}`],
        PH_SUM,
        [`$${PH_SUM}$`,`$\\mathrm{${other}} = 14 - ${tx(x, 2)} ${res(y, 2)}$`],
      );
    }
    if (v === 1) {
      const [bf, bgen] = r.pick(BASES);
      const n = r.int(1, 4);
      const c = 10 ** -n;
      return task(
        `Kolikšen je pH raztopine ${bgen} ($${sp(bf)}$) s koncentracijo $${q(tx(c), "mol/L")}$ pri $25\\ {}^\\circ\\mathrm{C}$? ${zaokr(2)}`,
        ans(14 - n, 2, null, [[n, "To je pOH; pH dobiš iz vsote pH + pOH = 14."], [-n, "Pazi na predznak: pOH = −log[OH⁻] je pozitiven."]]),
        "Močna baza popolnoma disociira: $[\\mathrm{OH^-}]$ je enaka koncentraciji baze. Najprej izračunaj pOH.",
        [`c(${sp(bf)}) = ${q(tx(c), "mol/L")}`],
        ["\\mathrm{pH}"],
        ["[\\mathrm{OH^-}] = c", "\\mathrm{pOH} = -\\log [\\mathrm{OH^-}]", PH_SUM],
        [`$[\\mathrm{OH^-}] = ${q(tx(c), "mol/L")} = 10^{-${n}}\\ \\mathrm{mol/L}$`, `$\\mathrm{pOH} = ${n}$`, `$\\mathrm{pH} = 14 - ${n} = ${14 - n}$`],
      );
    }
    if (v === 2) {
      // Vsakdanje snovi s približnim pH ali dve raztopini z naključnim pH.
      const real = r.pick([["Limonin sok", 2, "paradižnikov sok", 4], ["Želodčni sok", 2, "kava", 5], ["Kis", 3, "destilirana voda", 7], ["Kisli dež", 4, "destilirana voda", 7], ["Sok pomaranče", 3, "kava", 5]]);
      let [A, a, B, b] = real;
      if (r.int(0, 1) === 0) {
        a = r.int(1, 9);
        b = a + r.int(1, 4);
        [A, B] = ["Raztopina A", "raztopina B"];
      }
      const d = b - a;
      const ratio = 10 ** d;
      return task(
        `${A} ima pH ${A === "Raztopina A" ? "" : "približno "}$${a}$, ${B} pa pH $${b}$. Kolikokrat večja je koncentracija oksonijevih ionov v prvi kot v drugi tekočini?`,
        ans(ratio, 0, null, [[d, "pH je logaritemska lestvica: razlika 1 pomeni 10-krat."], [b / a, "Ne deliš vrednosti pH: $[\\mathrm{H_3O^+}] = 10^{-\\mathrm{pH}}$."], [10 * d, "Pri razliki več enot pH se faktorji 10 množijo, ne seštevajo."]]),
        "Zapiši obe koncentraciji kot potenci števila 10 in ju deli.",
        [`\\mathrm{pH}_1 = ${a}`, `\\mathrm{pH}_2 = ${b}`],
        ["\\dfrac{[\\mathrm{H_3O^+}]_1}{[\\mathrm{H_3O^+}]_2}"],
        ["[\\mathrm{H_3O^+}] = 10^{-\\mathrm{pH}}\\ \\mathrm{mol/L}"],
        [`$[\\mathrm{H_3O^+}]_1 = 10^{-${a}}\\ \\mathrm{mol/L}$, $[\\mathrm{H_3O^+}]_2 = 10^{-${b}}\\ \\mathrm{mol/L}$`, `$\\dfrac{10^{-${a}}}{10^{-${b}}} = 10^{${b} - ${a}} = 10^{${d}} = ${tx(ratio)}$`],
      );
    }
    const p = r.int(1, 4);
    const c = 10 ** -p;
    return task(
      `Raztopina ima pH $${p}$. Kolikšna je koncentracija oksonijevih ionov $[\\mathrm{H_3O^+}]$ v $\\mathrm{mol/L}$? Zapiši jo kot decimalno število.`,
      ans(c, 4, "mol/L", [[10 ** -(14 - p), "To je koncentracija hidroksidnih ionov, ne oksonijevih."], [p / 10, "$[\\mathrm{H_3O^+}] = 10^{-\\mathrm{pH}}$, ne pH deljen z 10."]]),
      "pH je negativni desetiški logaritem koncentracije oksonijevih ionov.",
      [`\\mathrm{pH} = ${p}`],
      ["[\\mathrm{H_3O^+}]"],
      "[\\mathrm{H_3O^+}] = 10^{-\\mathrm{pH}}\\ \\mathrm{mol/L}",
      [`$[\\mathrm{H_3O^+}] = 10^{-${p}}\\ \\mathrm{mol/L}$`, `$[\\mathrm{H_3O^+}] = ${q(tx(c), "mol/L")}$`],
    );
  }
  if (level === 2) {
    if (v === 0) {
      const p = r.int(150, 380) / 100;
      const cm = 10 ** -p * 1000;
      const d = cm < 1 ? 3 : 2;
      return task(
        `Vzorec ${p < 3 ? "želodčnega soka" : "kisle deževnice"} ima pH $${tx(p, 2)}$. Kolikšna je koncentracija oksonijevih ionov v $\\mathrm{mmol/L}$? ${zaokr(d)}`,
        ans(cm, d, "mmol/L", [[10 ** -p, "Rezultat pretvori iz mol/L v mmol/L."], [p,"$[\\mathrm{H_3O^+}] = 10^{-\\mathrm{pH}}$; pH ni koncentracija."]]),
        "Iz pH izračunaj koncentracijo v mol/L, nato jo pretvori v mmol/L.",
        [`\\mathrm{pH} = ${tx(p, 2)}`],
        ["[\\mathrm{H_3O^+}]"],
        ["[\\mathrm{H_3O^+}] = 10^{-\\mathrm{pH}}\\ \\mathrm{mol/L}", "1\\ \\mathrm{mol/L} = 1000\\ \\mathrm{mmol/L}"],
        [`$[\\mathrm{H_3O^+}] = 10^{-${tx(p, 2)}}\\ \\mathrm{mol/L} ${res(10 ** -p, d + 3, "mol/L")}$`, `$[\\mathrm{H_3O^+}] ${res(cm, d, "mmol/L")}$`],
      );
    }
    if (v === 1 || v === 2) {
      const two = v === 2;
      const [bf, bgen] = r.pick(two ? BASES2 : BASES);
      const c = r.pick(two ? [0.0015, 0.002, 0.0025, 0.003, 0.004, 0.005, 0.006, 0.008] : [0.0015, 0.002, 0.003, 0.004, 0.005, 0.008, 0.015, 0.02, 0.025, 0.04, 0.05, 0.08]);
      const oh = two ? 2 * c : c;
      const pOH = -lg(oh);
      const pH = 14 - pOH;
      return task(
        `Kolikšen je pH raztopine ${bgen} ($${sp(bf)}$) s koncentracijo $${q(tx(c), "mol/L")}$ pri $25\\ {}^\\circ\\mathrm{C}$? Baza popolnoma disociira. ${zaokr(2)}`,
        ans(pH, 2, null, [[pOH, "To je pOH; pH dobiš iz vsote pH + pOH = 14."], two ? [14 + lg(c), "Ena formulska enota da dva hidroksidna iona: $[\\mathrm{OH^-}] = 2c$."] : [-lg(c), "To bi bil pH kisline s to koncentracijo; baza daje ione $\\mathrm{OH^-}$."], [14 + Math.log(oh), "Uporabi desetiški logaritem (log), ne naravnega (ln)."]]),
        two ? "Najprej ugotovi, koliko ionov $\\mathrm{OH^-}$ da ena formulska enota baze." : "Močna baza popolnoma disociira: najprej izračunaj pOH.",
        [`c(${sp(bf)}) = ${q(tx(c), "mol/L")}`],
        ["\\mathrm{pH}"],
        [two ? "[\\mathrm{OH^-}] = 2c" : "[\\mathrm{OH^-}] = c", "\\mathrm{pOH} = -\\log [\\mathrm{OH^-}]", PH_SUM],
        [
          two ? `$${sp(bf)} \\rightarrow ${sp(bf.slice(0, 2))}^{2+} + 2\\,\\mathrm{OH^-}$, zato $[\\mathrm{OH^-}] = 2c = ${q(tx(oh), "mol/L")}$` : `$[\\mathrm{OH^-}] = c = ${q(tx(oh), "mol/L")}$`,
          `$\\mathrm{pOH} = -\\log(${tx(oh)}) ${res(pOH, 3)}$`,
          `$\\mathrm{pH} = 14 - \\mathrm{pOH} ${res(pH, 2)}$`,
        ],
      );
    }
    const [af, agen] = r.pick(ACIDS);
    const c1 = r.pick([0.1, 0.05, 0.2, 0.02, 0.5, 0.01]);
    const V1 = r.pick([5, 10, 20, 25]);
    const V2 = r.pick([100, 250, 500, 1000]);
    const c2 = (c1 * V1) / V2;
    const pH = -lg(c2);
    const who = name(r);
    return task(
      `${who} ${g(who, "je razredčil", "je razredčila")} $${q(V1, "mL")}$ ${agen} ($${sp(af)}$) s koncentracijo $${q(tx(c1), "mol/L")}$ z vodo do $${q(V2, "mL")}$. Kolikšen je pH razredčene raztopine? ${zaokr(2)}`,
      ans(pH, 2, null, [[-lg(c1), "To je pH pred redčenjem; z redčenjem se koncentracija zmanjša."], [-lg((c1 * V2) / V1), "Pri redčenju se koncentracija zmanjša: razmerje prostornin si obrnil."]], [-lg(roundHalfUp(c2, 5))]),
      "Najprej izračunaj koncentracijo kisline po redčenju.",
      [`V_1 = ${q(V1, "mL")}`, `c_1 = ${q(tx(c1), "mol/L")}`, `V_2 = ${q(V2, "mL")}`],
      ["\\mathrm{pH}"],
      ["c_1 V_1 = c_2 V_2", "[\\mathrm{H_3O^+}] = c_2", "\\mathrm{pH} = -\\log [\\mathrm{H_3O^+}]"],
      [`$c_2 = \\dfrac{c_1 V_1}{V_2} = \\dfrac{${q(tx(c1), "mol/L")} \\cdot ${q(V1, "mL")}}{${q(V2, "mL")}} ${res(c2, 6, "mol/L")}$`, `Močna kislina popolnoma protolizira: $[\\mathrm{H_3O^+}] = c_2$.`, `$\\mathrm{pH} = -\\log(${tx(roundHalfUp(c2, 6))}) ${res(pH, 2)}$`],
    );
  }
  // ---------- raven 3 ----------
  if (v === 0) {
    // pH zmesi močne kisline in močne baze (ena je v prebitku).
    const [af, agen] = r.pick(ACIDS);
    const [bf, bgen] = r.pick(BASES);
    const ca = r.pick([0.1, 0.2, 0.05, 0.15]);
    const cb = r.pick([0.1, 0.2, 0.05, 0.15]);
    const Va = r.pick([10, 20, 25, 30, 40, 50]);
    let Vb = r.pick([10, 15, 20, 25, 30, 40, 50]);
    if (Math.abs(ca * Va - cb * Vb) < 1e-9) Vb += 5;
    const na = ca * Va; // mmol
    const nb = cb * Vb;
    const Vt = Va + Vb;
    const acid = na > nb;
    const ex = Math.abs(na - nb);
    const cex = ex / Vt;
    const pH = acid ? -lg(cex) : 14 + lg(cex);
    return task(
      `Zmešamo $${q(Va, "mL")}$ ${agen} ($${sp(af)}$, $c = ${q(tx(ca), "mol/L")}$) in $${q(Vb, "mL")}$ raztopine ${bgen} ($${sp(bf)}$, $c = ${q(tx(cb), "mol/L")}$). Kolikšen je pH zmesi pri $25\\ {}^\\circ\\mathrm{C}$? Prostornini se seštejeta. ${zaokr(2)}`,
      ans(pH, 2, null, [[acid ? -lg(ex / Va) : 14 + lg(ex / Vb), "Prebitek se razporedi po celotni prostornini zmesi."], [acid ? 14 + lg(cex) : -lg(cex), acid ? "V prebitku je kislina, zato je zmes kisla." : "To je pOH; v prebitku je baza, pH dobiš iz pH + pOH = 14."], [acid ? -lg(ca) : 14 + lg(cb), "Upoštevaj, da se del kisline in baze nevtralizira."]]),
      "Izračunaj množini $\\mathrm{H_3O^+}$ in $\\mathrm{OH^-}$, ugotovi, kaj je v prebitku, in prebitek deli s skupno prostornino.",
      [`V_k = ${q(Va, "mL")}`, `c_k = ${q(tx(ca), "mol/L")}`, `V_b = ${q(Vb, "mL")}`, `c_b = ${q(tx(cb), "mol/L")}`],
      ["\\mathrm{pH}"],
      ["n = c \\cdot V", "\\mathrm{H_3O^+} + \\mathrm{OH^-} \\rightarrow 2\\,\\mathrm{H_2O}", acid ? "\\mathrm{pH} = -\\log [\\mathrm{H_3O^+}]" : "\\mathrm{pOH} = -\\log [\\mathrm{OH^-}]", PH_SUM],
      [
        `$n(\\mathrm{H_3O^+}) = ${q(tx(ca), "mol/L")} \\cdot ${q(Va, "mL")} = ${q(tx(roundHalfUp(na, 4)), "mmol")}$`,
        `$n(\\mathrm{OH^-}) = ${q(tx(cb), "mol/L")} \\cdot ${q(Vb, "mL")} = ${q(tx(roundHalfUp(nb, 4)), "mmol")}$`,
        `V prebitku je ${acid ? "$\\mathrm{H_3O^+}$" : "$\\mathrm{OH^-}$"}: $${q(tx(roundHalfUp(ex, 4)), "mmol")}$ v $${q(Vt, "mL")}$`,
        `$[${acid ? "\\mathrm{H_3O^+}" : "\\mathrm{OH^-}"}] = \\dfrac{${tx(roundHalfUp(ex, 4))}\\ \\mathrm{mmol}}{${q(Vt, "mL")}} ${res(cex, 5, "mol/L")}$`,
        acid ? `$\\mathrm{pH} = -\\log(${tx(roundHalfUp(cex, 5))}) ${res(pH, 2)}$` : `$\\mathrm{pOH} = -\\log(${tx(roundHalfUp(cex, 5))}) ${res(-lg(cex), 2)}$, $\\mathrm{pH} = 14 - \\mathrm{pOH} ${res(pH, 2)}$`,
      ],
    );
  }
  if (v === 1) {
    // Nevtralizacija: potrebna prostornina baze (oz. kisline) z upoštevanjem razmerja v enačbi.
    const sulf = r.int(0, 1) === 0;
    const ca = r.pick([0.05, 0.1, 0.15, 0.2, 0.25]);
    const Va = r.pick([10, 20, 25, 40, 50]);
    const cb = r.pick([0.1, 0.2, 0.25, 0.5]);
    if (sulf) {
      const Vb = (2 * ca * Va) / cb;
      return task(
        `Koliko mL raztopine natrijevega hidroksida ($c = ${q(tx(cb), "mol/L")}$) potrebujemo za popolno nevtralizacijo $${q(Va, "mL")}$ žveplove(VI) kisline ($c = ${q(tx(ca), "mol/L")}$)? Enačba: $\\mathrm{H_{2}SO_{4}} + 2\\,\\mathrm{NaOH} \\rightarrow \\mathrm{Na_{2}SO_{4}} + 2\\,\\mathrm{H_{2}O}$. ${zaokr(1)}`,
        ans(Vb, 1, "mL", [[(ca * Va) / cb, "Ena molekula $\\mathrm{H_2SO_4}$ nevtralizira dve formulski enoti NaOH."], [(ca * Va) / (2 * cb), "Razmerje koeficientov si obrnil: NaOH je potrebno dvakrat več."], [(cb * Va) / ca, "Množina je koncentracija krat prostornina; razmerje koncentracij si obrnil."]]),
        "Izračunaj množino kisline, iz enačbe množino NaOH, nato prostornino raztopine NaOH.",
        [`c(\\mathrm{NaOH}) = ${q(tx(cb), "mol/L")}`, `V(\\mathrm{H_{2}SO_{4}}) = ${q(Va, "mL")}`, `c(\\mathrm{H_{2}SO_{4}}) = ${q(tx(ca), "mol/L")}`],
        ["V(\\mathrm{NaOH})"],
        ["n = c \\cdot V", "n(\\mathrm{NaOH}) = 2 \\cdot n(\\mathrm{H_{2}SO_{4}})", "V = \\dfrac{n}{c}"],
        [`$n(\\mathrm{H_{2}SO_{4}}) = ${q(tx(ca), "mol/L")} \\cdot ${q(Va, "mL")} = ${q(tx(roundHalfUp(ca * Va, 4)), "mmol")}$`, `$n(\\mathrm{NaOH}) = 2 \\cdot ${tx(roundHalfUp(ca * Va, 4))}\\ \\mathrm{mmol} = ${q(tx(roundHalfUp(2 * ca * Va, 4)), "mmol")}$`, `$V(\\mathrm{NaOH}) = \\dfrac{n}{c} = \\dfrac{${tx(roundHalfUp(2 * ca * Va, 4))}\\ \\mathrm{mmol}}{${q(tx(cb), "mol/L")}} ${res(Vb, 1, "mL")}$`],
      );
    }
    const [bf, bgen] = r.pick(BASES2);
    // Raztopina baze je redkejša (cb/5), da je poraba kisline primerna za bireto.
    const cbb = roundHalfUp(cb / 5, 3);
    const Vk2 = (2 * cbb * Va) / ca;
    return task(
      `Koliko mL klorovodikove kisline ($c = ${q(tx(ca), "mol/L")}$) porabimo za nevtralizacijo $${q(Va, "mL")}$ raztopine ${bgen} ($c = ${q(tx(cbb), "mol/L")}$)? Enačba: $${sp(bf)} + 2\\,\\mathrm{HCl} \\rightarrow ${sp(bf.slice(0, 2) + "Cl2")} + 2\\,\\mathrm{H_{2}O}$. ${zaokr(1)}`,
      ans(Vk2, 1, "mL", [[(cbb * Va) / ca, `Ena formulska enota $${sp(bf)}$ nevtralizira dve molekuli HCl.`], [(cbb * Va) / (2 * ca), "Razmerje koeficientov si obrnil: HCl je potrebno dvakrat več."]]),
      "Izračunaj množino baze, iz enačbe množino HCl, nato prostornino kisline.",
      [`c(\\mathrm{HCl}) = ${q(tx(ca), "mol/L")}`, `V(${sp(bf)}) = ${q(Va, "mL")}`, `c(${sp(bf)}) = ${q(tx(cbb), "mol/L")}`],
      ["V(\\mathrm{HCl})"],
      ["n = c \\cdot V", `n(\\mathrm{HCl}) = 2 \\cdot n(${sp(bf)})`, "V = \\dfrac{n}{c}"],
      [`$n(${sp(bf)}) = ${q(tx(cbb), "mol/L")} \\cdot ${q(Va, "mL")} = ${q(tx(roundHalfUp(cbb * Va, 4)), "mmol")}$`, `$n(\\mathrm{HCl}) = 2 \\cdot ${tx(roundHalfUp(cbb * Va, 4))}\\ \\mathrm{mmol} = ${q(tx(roundHalfUp(2 * cbb * Va, 4)), "mmol")}$`, `$V(\\mathrm{HCl}) = \\dfrac{n}{c} = \\dfrac{${tx(roundHalfUp(2 * cbb * Va, 4))}\\ \\mathrm{mmol}}{${q(tx(ca), "mol/L")}} ${res(Vk2, 1, "mL")}$`],
    );
  }
  // Masa NaOH za raztopino z danim pH (obratna naloga).
  const [bf, bgen] = r.pick(BASES);
  const Mb = molar(bf);
  const p = r.int(110, 130) / 10;
  const V = r.pick([100, 250, 500, 1000]);
  const pOH = 14 - p;
  const c = 10 ** -pOH;
  const mg = c * (V / 1000) * Mb * 1000;
  return task(
    `Koliko miligramov ${bgen} ($${sp(bf)}$) moramo raztopiti v vodi, da dobimo $${q(V, "mL")}$ raztopine s pH $${tx(p)}$ pri $25\\ {}^\\circ\\mathrm{C}$? ${Mtxt(bf)}. ${zaokr(1)}`,
    ans(mg, 1, "mg", [[10 ** -p * (V / 1000) * Mb * 1000, "Iz pH dobiš $[\\mathrm{H_3O^+}]$; za bazo potrebuješ $[\\mathrm{OH^-}]$ iz pOH."], [c * V * Mb * 1000, "Prostornino pretvori iz mL v L."], [c * (V / 1000) * Mb, "Rezultat pretvori iz g v mg."]]),
    "Iz pH izračunaj pOH in koncentracijo hidroksidnih ionov.",
    [`V = ${q(V, "mL")}`, `\\mathrm{pH} = ${tx(p)}`, Mdat(bf)],
    ["m"],
    [PH_SUM, "[\\mathrm{OH^-}] = 10^{-\\mathrm{pOH}}\\ \\mathrm{mol/L}", "n = c \\cdot V", "m = n \\cdot M"],
    [
      `$\\mathrm{pOH} = 14 - ${tx(p)} = ${tx(roundHalfUp(pOH, 1))}$`,
      `$c(${sp(bf)}) = [\\mathrm{OH^-}] = 10^{-${tx(roundHalfUp(pOH, 1))}}\\ \\mathrm{mol/L} ${res(c, 6, "mol/L")}$`,
      `$n = c \\cdot V = ${tx(roundHalfUp(c, 6))}\\ \\mathrm{mol/L} \\cdot ${q(tx(V / 1000), "L")} ${res(c * V / 1000, 7, "mol")}$`,
      `$m = n \\cdot M ${res(mg / 1000, 4, "g")} ${res(mg, 1, "mg")}$`,
    ],
  );
}

export const GIMNAZIJA_KEM_SS = wrapGens([
  { id: "gim-mnozina-dop", topics: ["KEM-SS-1/mnozina-snovi"], gen: mnozina },
  { id: "gim-stehiometrija-dop", topics: ["KEM-SS-1/stehiometrija"], gen: stehiometrija },
  { id: "gim-raztopine-dop", topics: ["KEM-SS-1/raztopine"], gen: raztopine },
  { id: "gim-ph-dop", topics: ["KEM-SS-2/ph"], gen: ph },
]);
