#!/usr/bin/env node
// Enote in zaokroževanje v generatorjih nalog (PV-07, docs/preverjanje.md). Brez modela AI.
//
//   enote          vsaka formula naloge (t.formula) mora biti dimenzijsko pravilna, ko količine nadomestimo z enotami
//                  iz podatkov (t.data.given), iskano količino pa z enoto odgovora. Vmesne količine (ω = 2πν) dobijo
//                  enoto iz svoje definicije. Pretvorbe brez količin (1 cm = 10 mm) preveri ukaz »units« z vrednostjo.
//   zaokrozevanje  število decimalk, ki ga zahteva besedilo naloge (»Zaokroži na dve decimalki«), mora biti enako
//                  decimalkam odgovora (answer.decimals), po katerih se ocenjuje.
//
//   node scripts/enote-generatorjev.mjs [--semena 3] [--predpona dod-fiz] [--json p.json] [--porocilo p.md]
//                                       [--dodatek pregled.md] [--strogo]
import { writeFileSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { GENERATORS, generateTask } from "../server/practice/index.js";
import { wilson } from "./meri-preverjanje.mjs";

// ---------------------------------------------------------------------------------------------------------------
// Enote: zapis v TeX ali besedilu → zapis za worker (units=True). Imena, ki jih worker nima, razširimo tukaj.
const SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };
const RAZSIRI = {
  MeV: "(10^6*eV)", keV: "(10^3*eV)", GeV: "(10^9*eV)", pm: "(m/10^12)", fm: "(m/10^15)", um: "um", us: "us",
  MBq: "(10^6*Bq)", kBq: "(10^3*Bq)", GBq: "(10^9*Bq)", umol: "(mol/10^6)", nmol: "(mol/10^9)", ug: "(g/10^6)",
  kNm: "(kN*m)", Nm: "(N*m)", kcal: "(4184*J)", cal: "(4.184*J)", ha: "(10^4*m^2)", GW: "(10^9*W)", GJ: "(10^9*J)",
  mbar: "(bar/1000)", dag: "(10*g)", obr: "1", rpm: "(1/min)", M: "(mol/L)", mM: "(mol/(1000*L))", ppm: "(1/10^6)", mPa: "(Pa/1000)",
  // valuta: lastna dimenzija, ki je v teh nalogah nima nobena druga količina (svetilnost cd); le za primerjavo enot
  EUR: "cd", µm: "um", µs: "us", µmol: "(mol/10^6)", µg: "(g/10^6)", µF: "uF", µC: "uC", µA: "(A/10^6)", µL: "(L/10^6)",
};
// imena, ki jih pozna worker (server/cas/worker.py, UNITS) ali RAZSIRI
const ZNANE = new Set(
  ("m cm mm km um nm dm g kg mg t s ms us ns min h d N kN J kJ MJ eV W kW MW Wh kWh Pa kPa MPa hPa bar atm V kV mV A mA kA " +
    "ohm Ohm kohm Mohm C mC uC nC F uF nF pF T mT Wb H mH Hz kHz MHz GHz K mol mmol L l mL ml dL rad Bq Gy Sv cd lm lx ly au AU pi percent")
    .split(" ")
    .concat(Object.keys(RAZSIRI)),
);

/** Enota (»\mathrm{J/(mol\,K)}«, »m/s²«, »°C«, »µmol/L«, »%«) → zapis za worker ali null. */
export function enotaVZapis(u) {
  let s = String(u ?? "").trim();
  if (!s) return "1";
  s = s
    .replace(/\\(?:mathrm|text|textrm|mbox|operatorname)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, "$1")
    .replace(/\\(?:mathrm|text)\s*\{([^{}]*)\}/g, "$1")
    .replace(/\{([^{}]*)\}/g, "($1)")
    .replace(/\\(?:,|;|:|!| )|~/g, " ")
    .replace(/\\mu|μ/g, "µ")
    .replace(/\\Omega|Ω/g, "ohm")
    .replace(/\\%|%/g, "percent")
    .replace(/€|\\euro|EUR/g, "EUR")
    .replace(/\^?\s*\\circ\s*C|°\s*C|℃/g, "K")
    .replace(/\^?\s*\\circ|°/g, "(pi/180)")
    .replace(/\\cdot|·|⋅/g, "*")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (x) => "^(" + [...x].map((c) => SUP[c]).join("") + ")");
  if (/[\\[\]{}$|]/.test(s)) return null;
  // imena enot in eksplicitno množenje med njimi (»mol L« → mol*L, »kg m^2« → kg*m^2)
  let napaka = false;
  s = s.replace(/µ?[A-Za-z]+/g, (ime) => {
    if (!ZNANE.has(ime)) napaka = true;
    return RAZSIRI[ime] && RAZSIRI[ime] !== ime ? RAZSIRI[ime] : ime.replace(/^µ/, "u");
  });
  if (napaka) return null;
  s = s.replace(/([\w)])\s+(?=[(\w])/g, "$1*").replace(/\s+/g, "");
  // »L/100 km«, »J/mol K«: vse za edino poševnico je imenovalec
  const g0 = [...s].reduce((a, c, k) => (c === "(" ? a.g++ : c === ")" ? a.g-- : c === "/" && a.g === 0 && a.p.push(k), a), { g: 0, p: [] }).p;
  if (g0.length === 1 && /\*/.test(s.slice(g0[0] + 1))) s = `${s.slice(0, g0[0])}/(${s.slice(g0[0] + 1)})`;
  if (!/^[\w*/^().+\-]+$/.test(s)) return null;
  return s;
}

// ---------------------------------------------------------------------------------------------------------------
// Formule: TeX → zapis za worker, količine kot oznake §i§.
const GRSKE = "alpha beta gamma delta epsilon varepsilon zeta eta theta vartheta iota kappa lambda mu nu xi rho varrho sigma tau upsilon phi varphi chi psi omega Gamma Delta Theta Lambda Xi Pi Sigma Phi Psi Omega".split(" ");
const FUNKCIJE = { sin: "sin", cos: "cos", tan: "tan", tg: "tan", cot: "cot", ctg: "cot", ln: "ln", log: "log10", lg: "log10", exp: "exp" };
const FUNKCIJE_ZAPIS = new Set(Object.values(FUNKCIJE));

/** Vsebina zavitih oklepajev od položaja i (s[i] === "{"): [vsebina, položaj za »}«] ali null. */
function skupina(s, i) {
  if (s[i] !== "{") return null;
  let g = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === "{") g++;
    else if (s[j] === "}" && --g === 0) return [s.slice(i + 1, j), j + 1];
  }
  return null;
}

/** Ime količine v normalni obliki (»c_{\text{nova}}« in »c_{\mathrm{nova}}« sta isto). */
export const imeKolicine = (x) => x.replace(/\\(?:text|mathrm|textrm)\s*/g, "").replace(/[\s{}]/g, "");

/**
 * TeX formula → { deli: [zapis], kolicine: [ime] } ali null, kadar formule ne znamo prevesti brez dvoma.
 * Zapis ima količine kot §i§ (i je indeks v kolicine).
 */
export function formulaVZapis(tex) {
  let s = String(tex)
    .replace(/\\(?:left|right|displaystyle|big|Big)/g, "")
    .replace(/\\(?:quad|qquad)[\s\S]*$/, "") // »v = a t \quad (v_0 = 0)«: pogoj ni del formule
    .trim();
  const kolicine = [];
  const out = [];
  let i = 0;
  const operand = () => out.length && /[\w)§.]$/.test(out[out.length - 1]);
  const push = (z, zacetekOperanda) => {
    if (zacetekOperanda && operand()) out.push("*");
    out.push(z);
  };
  const pod = (t) => {
    const r = formulaVZapis(t);
    if (!r || r.deli.length !== 1) return null;
    // količine v podizrazu prenesemo v naš seznam
    return r.deli[0].replace(/§(\d+)§/g, (_, k) => {
      const ime = r.kolicine[Number(k)];
      let j = kolicine.indexOf(ime);
      if (j < 0) j = kolicine.push(ime) - 1;
      return `§${j}§`;
    });
  };
  while (i < s.length) {
    const r = s.slice(i);
    let m;
    if ((m = r.match(/^(?:\s+|\\[,;:! ]|~)/))) {
      i += m[0].length;
      continue;
    }
    if ((m = r.match(/^\d{1,3}(?:(?:\\[,; ]|\s|\{\}|~)\d{3}(?!\d))+(?:\{,\}\d+)?|^\d+(?:\{,\}\d+|[.,]\d+)?/))) {
      // 20\,000 in 24 600: razmik med tisočicami ni množenje
      push(m[0].replace(/\\[,; ]|\s|\{\}|~/g, "").replace(/\{,\}|,/, "."), true);
      i += m[0].length;
      continue;
    }
    if ((m = r.match(/^\\[dt]?frac\s*/))) {
      const a = skupina(s, i + m[0].length);
      const b = a && skupina(s, a[1]);
      if (!b) return null;
      const za = pod(a[0]);
      const zb = pod(b[0]);
      if (za == null || zb == null) return null;
      push(`((${za})/(${zb}))`, true);
      i = b[1];
      continue;
    }
    if ((m = r.match(/^\\sqrt\s*(?:\[(\d+)\])?\s*/))) {
      const a = skupina(s, i + m[0].length);
      if (!a) return null;
      const za = pod(a[0]);
      if (za == null) return null;
      push(m[1] ? `((${za})^(1/${m[1]}))` : `sqrt(${za})`, true);
      i = a[1];
      continue;
    }
    if ((m = r.match(/^\^\s*\\circ\s*(?:\\mathrm\{C\}|C(?![a-z]))?/))) {
      // 180^\circ: kot (brez dimenzije); 20^\circ C: temperatura
      push(/C/.test(m[0]) ? "*K" : "*(pi/180)", false);
      i += m[0].length;
      continue;
    }
    if (r[0] === "^") {
      const a = skupina(s, i + 1);
      let z;
      if (a) {
        z = pod(a[0]);
        i = a[1];
      } else if (/^\^\s*(-?\d)/.test(r)) {
        const d = r.match(/^\^\s*(-?\d)/);
        z = d[1];
        i += d[0].length;
      } else return null;
      if (z == null) return null;
      out.push(`^(${z})`);
      continue;
    }
    if ((m = r.match(/^\\(?:mathrm|text|textrm)\s*/))) {
      const a = skupina(s, i + m[0].length);
      if (!a) return null;
      const e = enotaVZapis(`\\mathrm{${a[0]}}`);
      if (e == null) return null; // besede (»na uro«, »od«) in neznane enote
      push(`(${e})`, true);
      i = a[1];
      continue;
    }
    if ((m = r.match(/^(?:\\Omega(?![a-zA-Z])|Ω)/)) && operand()) {
      push("(ohm)", true); // 2\ \Omega: enota, ne količina
      i += m[0].length;
      continue;
    }
    if ((m = r.match(/^(?:\\%|%)/))) {
      push("(percent)", true);
      i += m[0].length;
      continue;
    }
    if ((m = r.match(/^(?:\\cdot|\\times|·)/))) {
      out.push("*");
      i += m[0].length;
      continue;
    }
    if ((m = r.match(/^(?:\\approx|\\doteq|≈|=)/))) {
      out.push("=");
      i += m[0].length;
      continue;
    }
    if ((m = r.match(/^[+\-*/:()]/))) {
      if (m[0] === "(") push("(", !FUNKCIJE_ZAPIS.has(out[out.length - 1])); // sin(…) ni sin·(…)
      else out.push(m[0] === ":" ? "/" : m[0]);
      i += 1;
      continue;
    }
    if ((m = r.match(/^\\pi(?![a-zA-Z])/))) {
      push("pi", true);
      i += m[0].length;
      continue;
    }
    if ((m = r.match(/^\\([a-z]+)(?![a-zA-Z])\s*/)) && FUNKCIJE[m[1]]) {
      // funkcija z argumentom v oklepajih
      if (s[i + m[0].length] !== "(") return null;
      push(FUNKCIJE[m[1]], true);
      i += m[0].length;
      continue;
    }
    // količina: črka ali grška, z \Delta spredaj, ' , indeks in oznako v oklepaju (M(\mathrm{Al}))
    m = r.match(/^(\\Delta\s*)?(?:\\(?:[a-zA-Z]+)(?![a-zA-Z])|[a-zA-Z])/);
    if (m && (!m[0].startsWith("\\") || m[1] || GRSKE.includes(m[0].slice(1)))) {
      let j = i + m[0].length;
      if (m[1] && /^\\Delta\s*$/.test(m[0])) return null;
      while (s[j] === "'") j++;
      if (s[j] === "_") {
        const a = skupina(s, j + 1);
        if (a) j = a[1];
        else if (/[A-Za-z0-9]/.test(s[j + 1] || "")) j += 2;
        else return null;
      }
      if (s[j] === "(" && /^\((?:\\(?:mathrm|text)\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|[A-Za-z]{1,3})\)/.test(s.slice(j))) {
        j += s.slice(j).match(/^\((?:\\(?:mathrm|text)\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|[A-Za-z]{1,3})\)/)[0].length;
      }
      const ime = imeKolicine(s.slice(i, j));
      let k = kolicine.indexOf(ime);
      if (k < 0) k = kolicine.push(ime) - 1;
      push(`§${k}§`, true);
      i = j;
      continue;
    }
    return null; // |x|, [enota], \text{ od }, \Rightarrow …
  }
  const zapis = out.join("");
  if (/\*\*|\(\)|^[=*/]|[=*/+\-]$/.test(zapis)) return null;
  // deli na najvišji ravni
  const deli = [];
  let g = 0;
  let z = 0;
  for (let k = 0; k < zapis.length; k++) {
    if (zapis[k] === "(") g++;
    else if (zapis[k] === ")") g--;
    else if (zapis[k] === "=" && g === 0) {
      deli.push(zapis.slice(z, k));
      z = k + 1;
    }
    if (g < 0) return null;
  }
  if (g !== 0) return null;
  deli.push(zapis.slice(z));
  if (deli.some((d) => !d) || deli.some((d) => d.includes("="))) return null;
  return { deli, kolicine };
}

/** Formule naloge: seznam TeX (implikacije »⇒« razbijemo na ločene formule). */
export function formuleNaloge(t) {
  return [].concat(t.formula || []).flatMap((f) => String(f).split(/\\(?:Rightarrow|Leftrightarrow|implies|iff)|⇒/));
}

/** Zapis podatka brez vrednosti: »0*(m/s)« → »(m/s)«, »6.67*10^(-11)*(N*m^2/kg^2)« → »(N*m^2/kg^2)«, »40« → »1«. */
export function brezVrednosti(z) {
  if (!/[A-Za-z]/.test(z)) return "1";
  const e = z.replace(/^[\d.*^()\-]+\*(?=[A-Za-z(])/, "");
  return /^[\d.*^()\-]+$/.test(e) ? "1" : e;
}

/** Podatki naloge → Map(ime količine → zapis enote). Podatek brez enote je brez dimenzije. */
export function enotePodatkov(t) {
  const enote = new Map();
  for (const p of t.data?.given || []) {
    const [lev, ...desno] = String(p).split("=");
    if (!desno.length) continue;
    const l = formulaVZapis(lev);
    const d = formulaVZapis(desno.join("="));
    if (!l || !d || l.deli.length !== 1 || l.deli[0] !== "§0§" || d.kolicine.length || d.deli.length !== 1) continue;
    enote.set(l.kolicine[0], brezVrednosti(d.deli[0]));
  }
  const iskane = (t.data?.find || []).map((f) => formulaVZapis(f)).filter((f) => f && f.deli[0] === "§0§");
  const eo = enotaVZapis(t.answer?.unit);
  if (iskane.length === 1 && eo && t.answer?.unit) enote.set(iskane[0].kolicine[0], eo);
  return enote;
}

// Fizikalne konstante, kadar jih podatki ne naštejejo in jih ne definira nobena formula naloge. R, h, G, c so v
// nalogah pogosto upor, višina, nukleotid, koncentracija: zanje ne ugibamo.
const KONSTANTE = { g: "m/s^2", N_A: "1/mol", k_B: "J/K", "\\varepsilon_0": "F/m", "\\mu_0": "H/m" };
const PRASTEVILA = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

/**
 * Enote vseh količin v formulah naloge: podatki, iskana količina, konstante, definicije (ω = 2πν) in različice z
 * indeksom (F_g dobi enoto F, kadar jo ima). Vrne Map(ime → zapis) in seznam formul s prevodi.
 */
export function enoteNaloge(t) {
  const enote = enotePodatkov(t);
  for (const [ime, e] of enote) {
    // konstanta ravnotežja brez enote (dogovor c/c°): dimenzije ne poznamo
    if (/^K_/.test(ime) && !/[A-Za-z]/.test(e)) enote.delete(ime);
  }
  const formule = formuleNaloge(t).map((tex) => ({ tex: tex.trim(), z: formulaVZapis(tex) }));
  const definirane = new Set(formule.flatMap((f) => (f.z ? f.z.deli.filter((d) => /^§\d+§$/.test(d)).map((d) => f.z.kolicine[Number(d.slice(1, -1))]) : [])));
  const celzij = (t.data?.given || []).some((p) => /\\circ\s*\\?(?:mathrm\{)?C|°C/.test(p));
  const izpeljane = new Set();
  const definicije = new Set(); // enota iz formule naloge (ω = 2πν), ne iz podatkov
  const dodaj = (ime) => {
    if (enote.has(ime)) return true;
    if (ime === "T" && celzij) return enote.set("T", "K"), izpeljane.add("T"), true;
    if (ime in KONSTANTE && !definirane.has(ime)) return enote.set(ime, KONSTANTE[ime]), izpeljane.add(ime), true;
    // različica: F_g → F, \Delta T → T, c' → c (le, če je osnova znana)
    const osn = (x) => x.replace(/^\\Delta/, "").replace(/'+/g, "").replace(/_.*$|\(.*$/, "");
    const osnova = osn(ime);
    // le »varne« različice: ', \Delta, številčni indeks ali besedni indeks (V_{pod}, m_{topljenca}); enočrkovni indeks
    // (V_m, N_A, F_g) pogosto pomeni drugo količino
    const varna = (x) => {
      const ind = (x.match(/_(.*)$/) || [])[1];
      return ind == null || /^\d+$/.test(ind) || ind.replace(/\\[a-z]+/g, "").replace(/[^A-Za-z0-9]/g, "").length >= 2;
    };
    if (!varna(ime)) return false;
    if (osnova !== ime && enote.has(osnova)) return enote.set(ime, enote.get(osnova)), izpeljane.add(ime), true;
    // sorodnik z isto osnovo iz podatkov (t_0 ↔ t_1, \Delta t ↔ t_2): le, če imajo vsi znani sorodniki isto enoto
    const sorodni = [...enote].filter(([k]) => k !== ime && osn(k) === osnova && varna(k) && !izpeljane.has(k)).map(([, e]) => e.replace(/^[\d.*^()\-]+\*/, ""));
    if (/_/.test(ime) && sorodni.length && sorodni.every((e) => e === sorodni[0]) && /[A-Za-z]/.test(sorodni[0])) return enote.set(ime, sorodni[0]), izpeljane.add(ime), true;
    return false;
  };
  // vsaka količina dobi svoj iracionalni faktor: m_1 + v − v_0 se ne sme odšteti v m_1 (pregled PV-07)
  const faktor = (ime) => `sqrt(${PRASTEVILA[[...enote.keys()].indexOf(ime) % PRASTEVILA.length]})`;
  const zamenjaj = (zapis, kol) => zapis.replace(/§(\d+)§/g, (_, k) => `(${faktor(kol[Number(k)])}*(${enote.get(kol[Number(k)])}))`);
  for (let krog = 0; krog < 6; krog++) {
    let novo = false;
    for (const f of formule) {
      if (!f.z) continue;
      const neznane = f.z.kolicine.filter((k) => !dodaj(k));
      if (neznane.length !== 1) continue;
      // definicija: en del je sama neznana količina, drugi deli so znani
      const ki = f.z.kolicine.indexOf(neznane[0]);
      const sam = f.z.deli.findIndex((d) => d === `§${ki}§`);
      if (sam < 0) continue;
      const drug = f.z.deli.find((d, j) => j !== sam && !d.includes(`§${ki}§`));
      if (!drug) continue;
      enote.set(neznane[0], zamenjaj(drug, f.z.kolicine));
      izpeljane.add(neznane[0]);
      definicije.add(neznane[0]);
      f.definira = neznane[0];
      novo = true;
    }
    if (!novo) break;
  }
  return {
    enote,
    izpeljane,
    formule: formule.map((f) => {
      if (!f.z) return { tex: f.tex, deli: null, razlog: "formule ne znam prevesti" };
      // formula, iz katere je enota vmesne količine, se z njo ujema po konstrukciji: ni preverjanje
      if (f.definira) return { tex: f.tex, deli: null, razlog: `definicija enote za ${f.definira}` };
      const izDef = f.z.kolicine.filter((k) => definicije.has(k));
      const manjka = f.z.kolicine.filter((k) => !enote.has(k));
      if (manjka.length) return { tex: f.tex, deli: null, razlog: `brez enote: ${manjka.join(", ")}` };
      return { tex: f.tex, deli: f.z.deli.map((d) => zamenjaj(d, f.z.kolicine)), brezKolicin: !f.z.kolicine.length, kolicine: f.z.kolicine, izDef };
    }),
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Zaokroževanje: decimalke iz besedila naloge.
const BESEDE = { eno: 1, ena: 1, eni: 1, dve: 2, dva: 2, dvema: 2, tri: 3, trema: 3, štiri: 4, stiri: 4, pet: 5, one: 1, two: 2, three: 3, four: 4, five: 5 };

/** Decimalke, ki jih zahteva besedilo (»Zaokroži na dve decimalki«, »na celo število«, »Round to 2 decimal places«) ali null. */
export function decimalkeBesedila(besedilo) {
  // velja zadnje navodilo (»povprečje zaokroži na dve decimalki … Zaokroži na eno decimalko.«)
  const s = String(besedilo || "")
    .replace(/\$[^$]*\$/g, " ")
    .toLowerCase();
  let zadnje = null;
  for (const [re, vrednost] of NAVODILA)
    for (const m of s.matchAll(re)) {
      const d = vrednost(m);
      if (d != null && (!zadnje || m.index >= zadnje.i)) zadnje = { i: m.index, d };
    }
  return zadnje ? zadnje.d : null;
}

const stevilo = (x) => (x in BESEDE ? BESEDE[x] : /^\d+$/.test(x) ? Number(x) : null);
const ZAOKROZI = String.raw`zaokro[žz]\w*(?:\s+(?:rezultat|odgovor|ga|jo|ju|jih|vrednost|število))?\s+`;
// pregled PV-07: tudi »na dve decimalki« brez »zaokroži«, »na cente«, »na cel mililiter«, »zaokroži ga na«,
// »to 2 decimal places« brez »round« in »nearest tenth«; »na centimeter« ostane brez statusa (odvisno od enote)
const NAVODILA = [
  [/(?:^|[^a-zšžč])na\s+(\d+|[a-zšč]+)\s+(?:decimal|mest)/g, (m) => stevilo(m[1])],
  [new RegExp(ZAOKROZI + String.raw`na\s+(?:celo|cela|celi|celih|cele|cel)\b`, "g"), () => 0],
  [new RegExp(ZAOKROZI + String.raw`na\s+(desetink|stotink|tisočink|cent(?:e|ov)?\b)`, "g"), (m) => ({ desetink: 1, stotink: 2, tisočink: 3 })[m[1]] ?? 2],
  [/\bto\s+(\d+|one|two|three|four|five)\s+decimal/g, (m) => stevilo(m[1])],
  [/\bnearest\s+(whole|integer|tenth|hundredth|thousandth|cent)\b/g, (m) => ({ whole: 0, integer: 0, tenth: 1, hundredth: 2, thousandth: 3, cent: 2 })[m[1]]],
];

// ---------------------------------------------------------------------------------------------------------------
// Trditve ene naloge in popis.

/** [{ vir: enote|zaokrozevanje, tex, status, why? }] */
/** Naloga z enotami: odgovor ali kateri od podatkov ima enoto. */
export const zEnotami = (t) => Boolean(t.answer?.unit) || (t.data?.given || []).some((p) => /\\(?:mathrm|text)\{|°|\\circ|\\Omega|\\%|%/.test(p));

export async function trditveNaloge(t, { cas }) {
  const out = [];
  const { formule } = zEnotami(t) ? enoteNaloge(t) : { formule: [] };
  for (const f of formule) {
    if (!f.deli) {
      out.push({ vir: "enote", tex: f.tex, status: "nepreverjeno", why: f.razlog });
      continue;
    }
    if (f.deli.length < 2) continue; // izraz brez enačaja (4 + 3 + 2 + 1) ni trditev o enotah
    let r;
    if (f.brezKolicin && /°\s*C|\\circ\s*\\?(?:mathrm\{)?C/.test(f.tex)) {
      out.push({ vir: "enote", tex: f.tex, status: "nepreverjeno", why: "pretvorba °C ni množenje (prištejemo 273,15)" });
      continue;
    }
    if (f.brezKolicin) {
      // pretvorba enot (1 cm = 10 mm): vrednost in dimenzija, zaporedni deli
      r = { ok: true, how: "symbolic" };
      for (let k = 0; k + 1 < f.deli.length && r.ok === true; k++) {
        const x = await cas.casCheck("units", [f.deli[k], f.deli[k + 1]]);
        if (x.ok !== true) r = x;
        else if (x.how !== "symbolic") r = { ...r, how: x.how };
      }
    } else r = await cas.casCheck("dim", f.deli);
    let status = r.ok === true ? (r.how === "symbolic" ? "izracunano" : "numericno") : r.ok === false ? "napaka" : "nepreverjeno";
    // dogovor M = M_r · g/mol: molska masa iz relativnih atomskih mas (M(H₂O) = 2 A_r(H) + A_r(O)) ni napaka
    if (status === "napaka" && f.kolicine?.some((k) => /^[AM]_r/.test(k))) {
      status = "nepreverjeno";
      r.why = `dogovor M = M_r · g/mol (${r.why})`;
    }
    // enota vmesne količine je iz definicije, ki je ne preverimo: potrditev velja le, če je definicija pravilna
    if ((status === "izracunano" || status === "numericno") && f.izDef?.length) {
      status = "delno";
      r.why = `enota ${f.izDef.join(", ")} iz definicije v nalogi`;
    }
    out.push({ vir: "enote", tex: f.tex, status, why: r.why || "", zapis: f.deli.join(" = ").slice(0, 200) });
  }
  const zahteva = decimalkeBesedila(t.question || t.text || t.prompt || "");
  const d = t.answer?.decimals;
  if (zahteva != null && t.answer?.type === "number") {
    const ok = d == null ? null : d === zahteva;
    out.push({
      vir: "zaokrozevanje",
      tex: `besedilo: ${zahteva} dec., odgovor: ${d ?? "brez"}`,
      status: ok === true ? "izracunano" : ok === false ? "napaka" : "nepreverjeno",
      why: ok === false ? `besedilo zahteva ${zahteva} decimalk, odgovor se ocenjuje na ${d}` : "",
    });
  }
  return out;
}

export function nalogeGeneratorja(g, semena) {
  const out = [];
  for (const raven of [1, 2, 3])
    for (let seme = 1; seme <= semena; seme++) {
      let t;
      try {
        t = generateTask(g.topics[0], raven, seme, undefined, g.maxYear ?? undefined);
      } catch {
        continue;
      }
      if (t && t.generator === g.id) out.push(t);
    }
  return out;
}

const RED = ["napaka", "nepreverjeno", "delno", "numericno", "izracunano"];
const najsibkejsi = (st) => (st.length ? (st.includes("napaka") ? "napaka" : st.every((s) => s === "izracunano") ? "izracunano" : st.every((s) => s === "izracunano" || s === "numericno") ? "numericno" : st.some((s) => s !== "nepreverjeno") ? "delno" : "nepreverjeno") : null);

/** Predmet generatorja iz prve teme (FIZ-TEK-OS/… → FIZ; UNI-… po imenu teme). */
export const predmet = (g) => {
  const t = String(g.topics?.[0] || "");
  const p = t.split(/[-_/:]/)[0].toUpperCase();
  if (p !== "UNI") return p || "?";
  return /fiz|meh|elektr|termo|opti|kvant|jedr/i.test(t) ? "FIZ" : /kem|chem/i.test(t) ? "KEM" : "UNI";
};

export async function popis({ semena = 3, predpona = "", cas }) {
  const gen = [];
  for (const g of GENERATORS) {
    if (!g.id.startsWith(predpona)) continue;
    const naloge = nalogeGeneratorja(g, semena);
    const trditve = [];
    let stEnot = 0;
    for (const t of naloge) {
      if (zEnotami(t)) stEnot++;
      for (const x of await trditveNaloge(t, { cas })) trditve.push({ ...x, raven: t.level, seme: t.seed });
    }
    if (!trditve.length && !stEnot) continue; // generator brez enot in brez zahteve po zaokroževanju
    const st = (v) => najsibkejsi(trditve.filter((x) => x.vir === v).map((x) => x.status));
    gen.push({ id: g.id, predmet: predmet(g), nalog: naloge.length, zEnotami: stEnot, enote: st("enote"), zaokrozevanje: st("zaokrozevanje"), trditve });
  }
  return gen;
}

// ---------------------------------------------------------------------------------------------------------------
// Nabor z znano resnico (test/fixtures/preverjanje/enote-v1.json): ujete napačne, lažni alarmi, napačno potrjene.
export const NABOR_ENOTE = fileURLToPath(new URL("../test/fixtures/preverjanje/enote-v1.json", import.meta.url));
// slepi nabor: sestavil drug model AI le iz opisa vmesnika, brez vpogleda v preverjevalnik (72 pravilnih, 72 napačnih)
export const NABOR_ENOTE_SLEPI = fileURLToPath(new URL("../test/fixtures/preverjanje/enote-slepi-v1.json", import.meta.url));

export async function izmeriNabor(pot, { cas }) {
  const { naloge } = JSON.parse(readFileSync(pot, "utf8"));
  const izidi = [];
  for (const n of naloge) {
    const t = { data: { given: n.given, find: n.find }, formula: [n.formula], answer: { type: "number", unit: n.unit || null } };
    const tr = (await trditveNaloge(t, { cas })).filter((x) => x.vir === "enote");
    // pretvorba brez enote odgovora: naloga še vedno ima enote v formuli
    const x = tr[0] || (await trditveNaloge({ ...t, answer: { type: "number", unit: "m" } }, { cas })).find((y) => y.vir === "enote");
    izidi.push({ id: n.id, resnica: n.resnica, status: x ? x.status : "nepreverjeno", why: x?.why || "" });
  }
  const nap = izidi.filter((x) => x.resnica === "napacna");
  const pra = izidi.filter((x) => x.resnica === "pravilna");
  const potrjen = (s) => s === "izracunano" || s === "numericno";
  return {
    izidi,
    ujete: nap.filter((x) => x.status === "napaka").length,
    napacnih: nap.length,
    napacnoPotrjene: nap.filter((x) => potrjen(x.status)).length,
    lazniAlarmi: pra.filter((x) => x.status === "napaka").length,
    potrjenePravilne: pra.filter((x) => potrjen(x.status)).length,
    pravilnih: pra.length,
  };
}

const tocke = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const odst = (x) => `${(100 * x).toFixed(1).replace(".", ",")} %`;
const ki = (k, n) => {
  const w = wilson(k, n);
  return `${tocke(k)}/${tocke(n)} (${n ? odst(k / n) : "–"}; 95-% interval ${w ? `${odst(w[0])}–${odst(w[1])}` : "–"})`;
};

export function povzemi(gen) {
  const trd = gen.flatMap((g) => g.trditve);
  const po = (v) => Object.fromEntries([["vse", trd.filter((x) => x.vir === v).length], ...RED.map((s) => [s, trd.filter((x) => x.vir === v && x.status === s).length])]);
  const gs = (v) => Object.fromEntries(["izracunano", "numericno", "delno", "napaka", "nepreverjeno", null].map((s) => [String(s), gen.filter((g) => g[v] === s).length]));
  return { generatorjev: gen.length, enote: po("enote"), zaokrozevanje: po("zaokrozevanje"), genEnote: gs("enote"), genZaokrozevanje: gs("zaokrozevanje") };
}

export function porocilo(gen, { datum, commit, semena, ukaz = "", dodatek = "", nabor = null, slepi = null }) {
  const p = povzemi(gen);
  const n = p.generatorjev;
  const v = [];
  v.push(`# Enote in zaokroževanje v generatorjih (PV-07), ${datum}`, "");
  v.push(`- Commit: \`${commit}\`; ukaz: \`${ukaz}\`; brez modela AI; SymPy prek server/cas.js (ukaza dim in units)`);
  v.push(`- Vzorec: ravni 1–3, semena 1–${semena}. Generatorji z enotami ali zahtevo po zaokroževanju: ${n}.`);
  v.push("- »enote«: formula naloge je dimenzijsko pravilna s podatki in enoto odgovora (pretvorba brez količin: tudi vrednost).");
  v.push("- »zaokroževanje«: decimalke, ki jih zahteva besedilo, so enake decimalkam, po katerih se odgovor ocenjuje.", "");
  if (nabor) {
    v.push("## Nabor z znano resnico (`test/fixtures/preverjanje/enote-v1.json`)", "");
    v.push(`- Ujete napačne formule: ${ki(nabor.ujete, nabor.napacnih)}; napačno potrjene: ${ki(nabor.napacnoPotrjene, nabor.napacnih)}.`);
    v.push(`- Lažni alarmi na pravilnih: ${ki(nabor.lazniAlarmi, nabor.pravilnih)}; potrjene pravilne: ${ki(nabor.potrjenePravilne, nabor.pravilnih)}.`);
    v.push("- Nabor je sestavil isti avtor kot preverjevalnik (40 parov formul in 10 parov pretvorb).", "");
  }
  if (slepi) {
    v.push("## Slepi nabor (`test/fixtures/preverjanje/enote-slepi-v1.json`)", "");
    v.push(`- Ujete napačne formule: ${ki(slepi.ujete, slepi.napacnih)}; napačno potrjene: ${ki(slepi.napacnoPotrjene, slepi.napacnih)}.`);
    v.push(`- Lažni alarmi na pravilnih: ${ki(slepi.lazniAlarmi, slepi.pravilnih)}; potrjene pravilne: ${ki(slepi.potrjenePravilne, slepi.pravilnih)}.`);
    v.push("- Sestavil ga je drug model AI le iz opisa vmesnika, brez vpogleda v preverjevalnik. Prva meritev (pred popravki");
    v.push("  pregleda): ujete 69/72, napačno potrjene 0/72, lažni alarmi 0/72. Popravki pregleda (`\\exp`, brezdimenzijske formule)");
    v.push("  so nastali po tej meritvi, zato zgornje številke niso več povsem slepe.", "");
  }
  v.push("## Formule (trditve »enote«)", "");
  const e = p.enote;
  v.push(`- Preverjene: ${ki(e.izracunano + e.numericno + e.napaka, e.vse)}; od tega izračunano ${tocke(e.izracunano)}, številsko ${tocke(e.numericno)}, napaka ${tocke(e.napaka)}.`);
  v.push(`- Delno (enota vmesne količine iz definicije v nalogi, ki je ne preverimo): ${ki(e.delno, e.vse)}.`);
  v.push(`- Brez statusa: ${ki(e.nepreverjeno, e.vse)} (formule z besedilom, absolutno vrednostjo, količino brez enote …).`, "");
  v.push("## Generatorji", "");
  v.push("| Status enot | Generatorjev |", "| --- | --- |");
  for (const [s, k] of Object.entries(p.genEnote)) v.push(`| ${s === "null" ? "ni formul" : s} | ${ki(k, n)} |`);
  v.push("", "## Po predmetu (trditve »enote«)", "");
  v.push("| Predmet | Generatorjev | Formul | Preverjenih | Napak |", "| --- | --- | --- | --- | --- |");
  for (const pr of [...new Set(gen.map((g) => g.predmet))].sort()) {
    const gg = gen.filter((g) => g.predmet === pr);
    const t = gg.flatMap((g) => g.trditve.filter((x) => x.vir === "enote"));
    const ok = t.filter((x) => x.status !== "nepreverjeno").length;
    v.push(`| ${pr} | ${gg.length} | ${tocke(t.length)} | ${ki(ok, t.length)} | ${t.filter((x) => x.status === "napaka").length} |`);
  }
  v.push("", "## Zaokroževanje", "");
  const z = p.zaokrozevanje;
  v.push(`- Nalog z zahtevo v besedilu: ${tocke(z.vse)}; skladnih ${ki(z.izracunano, z.vse)}; neskladnih ${tocke(z.napaka)}; odgovor brez decimalk ${tocke(z.nepreverjeno)}.`, "");
  v.push("## Zaznane napake", "");
  const nap = gen.flatMap((g) => g.trditve.filter((x) => x.status === "napaka").map((x) => ({ g: g.id, ...x })));
  const vidne = new Map();
  for (const x of nap) {
    const k = `${x.g}|${x.vir}|${x.tex}`;
    if (!vidne.has(k)) vidne.set(k, { ...x, krat: 0 });
    vidne.get(k).krat++;
  }
  if (!vidne.size) v.push("Nobene.");
  for (const x of vidne.values()) v.push(`- \`${x.g}\` (${x.vir}, raven ${x.raven}, seme ${x.seme}${x.krat > 1 ? `, ${x.krat}×` : ""}): \`${x.tex.replace(/`/g, "'")}\`${x.why ? ` (${x.why})` : ""}`);
  if (dodatek) v.push("", dodatek.trim());
  v.push("", "## Omejitve", "");
  v.push("- Preverjena je le dimenzija formul, ne vrednost (vrednosti preverjata PV-04 in PV-10); pretvorbe brez količin tudi vrednost.");
  v.push("- Količina brez enote v podatkih (N = 40) je brez dimenzije; različica z indeksom (F_g) dobi enoto osnove (F), kadar je znana.");
  v.push("- Valuta (€) ima lastno dimenzijo le za primerjavo; logaritem sme imeti argument z enoto (pH = −log c).");
  v.push("");
  return v.join("\n");
}

async function main(argv) {
  const opt = (ime, privzeto = null) => {
    const i = argv.indexOf(ime);
    return i >= 0 ? argv[i + 1] : privzeto;
  };
  const semena = Number(opt("--semena", 3));
  const cas = await import("../server/cas.js");
  if (!(await cas.casAvailable())) {
    console.error("SymPy ni na voljo");
    return 1;
  }
  const gen = await popis({ semena, predpona: opt("--predpona", ""), cas });
  const p = povzemi(gen);
  console.log(JSON.stringify(p));
  const { izidi: _izidi, ...nabor } = await izmeriNabor(NABOR_ENOTE, { cas });
  console.log("Nabor:", JSON.stringify(nabor));
  const { izidi: _izidiS, ...slepi } = await izmeriNabor(NABOR_ENOTE_SLEPI, { cas });
  console.log("Slepi nabor:", JSON.stringify(slepi));
  const j = opt("--json");
  if (j) writeFileSync(j, JSON.stringify({ povzetek: p, generatorji: gen.map((g) => ({ ...g, trditve: g.trditve.filter((x) => x.status === "napaka") })) }) + "\n");
  const r = opt("--porocilo");
  if (r) {
    let commit = "";
    try {
      commit = execSync("git rev-parse HEAD").toString().trim();
    } catch {}
    const dodatek = opt("--dodatek") ? readFileSync(opt("--dodatek"), "utf8") : "";
    writeFileSync(r, porocilo(gen, { datum: new Date().toISOString().slice(0, 10), commit, semena, ukaz: `node scripts/enote-generatorjev.mjs ${argv.join(" ")}`, dodatek, nabor, slepi }));
  }
  let koda = 0;
  if (argv.includes("--strogo")) {
    if (cas.casIzpadi().skupaj) {
      console.error("SymPy ni odgovoril na vse zahteve:", JSON.stringify(cas.casIzpadi()));
      koda = 1;
    }
    if (nabor.napacnoPotrjene || nabor.lazniAlarmi || slepi.napacnoPotrjene || slepi.lazniAlarmi) {
      console.error("Nabor: napačno potrjene ali lažni alarmi");
      koda = 1;
    }
  }
  cas.casStop();
  return koda;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(await main(process.argv.slice(2)));
