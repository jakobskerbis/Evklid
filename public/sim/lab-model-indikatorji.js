// Virtualni laboratorij: indikatorji (model brez DOM; testi: test/laboratorij-indikatorji.test.js).
// lab-ph: pH snovi iz gospodinjstva z rdečim zeljem, univerzalnim indikatorskim papirjem in pH-metrom.
// lab-dokaz: dokazne reakcije za škrob, reducirajoče sladkorje, beljakovine in maščobe v živilih.
// lab-slina: razgradnja škroba z amilazo iz sline pri različnih temperaturah.
// Vsaka številka ima vir ali je označena kot ocena. Poenostavitve: POENOSTAVITVE_INDIKATORJI in docs/laboratorij.md.
import { rng, gauss } from "./lab-model.js";
import { KW, KA_OCETNA, solvePH } from "./lab-model-titracija.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mix = (a, b, x) => a.map((v, i) => Math.round(v + (b[i] - v) * x));

// ================================================================ pH: ravnotežja (25 °C)
// Ogljikova kislina: pKa1 = 6,35, pKa2 = 10,33; amonijev ion pKa = 9,25 (CRC Handbook, »Dissociation constants of
// inorganic acids and bases«). Topnost CO₂: kH = 0,034 mol/(L·atm) (Sander 2015, Atmos. Chem. Phys. 15, 4399),
// CO₂ v zraku 420 ppm (NOAA, letno povprečje 2023–2024), zato je v vodi na zraku 1,43 · 10⁻⁵ mol/L CO₂.
export const KA1_CO2 = 10 ** -6.35, KA2_CO2 = 10 ** -10.33, KA_NH4 = 10 ** -9.25;
export const CO2_ZRAK = 0.034 * 420e-6;

// pH iz bilance nabojev za mešanico (koncentracije v mol/L):
// [H⁺] + [Na⁺] + [NH₄⁺] = [OH⁻] + [Cl⁻] + [CH₃COO⁻] + [HCO₃⁻] + 2[CO₃²⁻].
// cl: močna kislina (HCl), na: močna baza ali Na⁺ iz soli (NaOH, NaHCO₃), ac: ocetna kislina, co2: vse oblike ogljikove kisline,
// nh3: amoniak in amonijev ion. Leva minus desna stran narašča z [H⁺]: ena ničla, bisekcija po log[H⁺] (kot solvePH).
export function phMesanice({ cl = 0, na = 0, ac = 0, co2 = 0, nh3 = 0 }) {
  if (!co2 && !nh3) return solvePH({ cl, ac, na, V: 1 }); // ista funkcija kot pri titraciji
  const f = (h) => {
    const d = h * h + KA1_CO2 * h + KA1_CO2 * KA2_CO2;
    return h + na + (nh3 * h) / (h + KA_NH4) - KW / h - cl - (ac * KA_OCETNA) / (KA_OCETNA + h) - (co2 * (KA1_CO2 * h + 2 * KA1_CO2 * KA2_CO2)) / d;
  };
  let lo = -15, hi = 1;
  for (let i = 0; i < 70; i++) {
    const mid = (lo + hi) / 2;
    if (f(10 ** mid) > 0) hi = mid;
    else lo = mid;
  }
  return -(lo + hi) / 2;
}

// ---------------------------------------------------------------- vzorci iz gospodinjstva
// Kjer je sestava znana (en topljenec), pH izračunamo (sestava; razredčiti jih lahko); drugje vzamemo literaturno območje
// in seme izbere vrednost v njem (lit). »barva« je lastna barva vzorca (prekrije barvo indikatorja), a = delež (ocena).
// Viri območij: FDA/CFSAN, »Approximate pH of foods and food products« (2007): limonin sok 2,00–2,60, kis 2,40–3,40,
// kravje mleko 6,40–6,80. Kola: Reddy idr. 2016, J. Am. Dent. Assoc. 147(4), 255 (Coca-Cola 2,37, Pepsi 2,39).
// Milo: Tarun idr. 2014, Indian J. Dermatol. 59(5), 442 (mila 9–10). Ostalo je ocena.
export const PH_VZORCI = {
  limona: { name: "limonin sok", lit: [2.0, 2.6] },
  kis: { name: "kis (~5 % ocetne kisline)", sestava: { ac: 0.8 }, lit: [2.4, 3.4] }, // 4,8 % = 0,8 mol/L (M = 60,05 g/mol)
  kola: { name: "kola", lit: [2.3, 2.5], barva: [70, 30, 15], a: 0.75 },
  kava: { name: "kava (črna)", lit: [4.8, 5.2], barva: [60, 35, 20], a: 0.85, ocena: true }, // ocena po več meritvah, 4,8–5,2
  mleko: { name: "mleko", lit: [6.4, 6.8], barva: [250, 250, 245], a: 0.55 },
  voda: { name: "voda iz pipe", lit: [7.2, 8.0], ocena: true }, // pravilnik o pitni vodi dovoljuje 6,5–9,5; trda slovenska voda ~7,5 (ocena)
  destilirana: { name: "destilirana voda (na zraku)", sestava: { co2: CO2_ZRAK }, lit: [5.4, 5.8] }, // CO₂ iz zraka: pH 5,6
  soda: { name: "soda bikarbona, 1 % raztopina", sestava: { na: 10 / 84.01, co2: 10 / 84.01 }, lit: [8.1, 8.5] }, // 10 g/L, M(NaHCO₃) = 84,01 g/mol
  milo: { name: "milo, raztopljeno v vodi", lit: [9.0, 10.0], barva: [245, 245, 240], a: 0.25 },
  pasta: { name: "zobna pasta, razmešana z vodo", lit: [7.5, 9.5], barva: [250, 250, 250], a: 0.5, ocena: true },
  amoniak: { name: "čistilo z amoniakom (~1,7 % NH₃)", sestava: { nh3: 1.0 }, lit: [11.0, 12.0], jedko: true }, // 17 g/L / 17,03 g/mol; čistila 1–3 % (ocena po varnostnih listih)
  odtok: { name: "čistilo za odtoke (~2 % NaOH)", sestava: { na: 0.5 }, lit: [13.0, 14.0], jedko: true }, // 20 g/L / 40,00 g/mol (ocena)
  hcl: { name: "klorovodikova kislina 0,1 mol/L", sestava: { cl: 0.1 }, lit: [0.9, 1.1], jedko: true },
};
// Razredčitev 1 : 10 pomnoži vse koncentracije z 0,1; CO₂ v destilirani vodi ostane v ravnotežju z zrakom.
export function sestavaRazredcena(s, krat = 1) {
  const o = {};
  for (const [k, v] of Object.entries(s)) o[k] = k === "co2" && v === CO2_ZRAK ? v : v / krat;
  return o;
}
// Pravi pH vzorca (seme izbere vrednost v literaturnem območju za vzorce brez sestave).
export function pravPH(id, { r = 0.5, krat = 1 } = {}) {
  const v = PH_VZORCI[id];
  if (v.sestava) return phMesanice(sestavaRazredcena(v.sestava, krat));
  return v.lit[0] + (v.lit[1] - v.lit[0]) * r;
}
// Grobo razvrščanje (kot v učbeniku); pri vrednostih blizu meje (±0,2) priznamo obe skupini.
export const SKUPINE = { kislo: "kislo", nevtralno: "nevtralno", bazicno: "bazično" };
export function skupina(pH) {
  return pH < 6.5 ? "kislo" : pH <= 7.5 ? "nevtralno" : "bazicno";
}
export const razvrstitevOk = (pH, izbira) => [skupina(pH), skupina(pH - 0.2), skupina(pH + 0.2)].includes(izbira);

// ---------------------------------------------------------------- izvleček rdečega zelja (antociani)
// Lestvica barv: Fossen, Cabrita in Andersen 1998, Food Chem. 63(4), 435 (barva in obstojnost antocianov pri pH 1–12)
// in šolske lestvice (RSC Education, »Red cabbage indicator«). Odtenki RGB so ocena po fotografijah lestvic.
export const ZELJE = [
  { do: 3, ime: "rdeča", rgb: [205, 35, 70] },
  { do: 5, ime: "rožnata", rgb: [215, 80, 150] },
  { do: 7, ime: "vijolična", rgb: [130, 60, 160] },
  { do: 8, ime: "modro vijolična", rgb: [85, 75, 180] },
  { do: 9.5, ime: "modra", rgb: [45, 100, 195] },
  { do: 11, ime: "modro zelena", rgb: [35, 140, 150] },
  { do: 12.5, ime: "zelena", rgb: [55, 160, 70] },
  { do: 15, ime: "rumena", rgb: [215, 200, 45] },
];
export function zeljePas(pH) {
  const i = ZELJE.findIndex((b) => pH < b.do);
  const k = i < 0 ? ZELJE.length - 1 : i;
  return { ...ZELJE[k], od: k ? ZELJE[k - 1].do : 0, do: Math.min(14, ZELJE[k].do), i: k };
}
// Barva: v sredini pasu točno barva lestvice, proti robu prehaja v sosednjo (zvezni prehod).
export function zeljeBarva(pH) {
  const p = zeljePas(pH), mid = (p.od + p.do) / 2, half = (p.do - p.od) / 2;
  const n = pH >= mid ? ZELJE[p.i + 1] : ZELJE[p.i - 1];
  if (!n) return [...p.rgb];
  return mix(p.rgb, n.rgb, clamp((Math.abs(pH - mid) / half) * 0.5, 0, 0.5));
}

// ---------------------------------------------------------------- univerzalni indikatorski papir
// Barvna lestvica na škatlici, pH 0–14 po 1 (odtenki so ocena po lestvicah proizvajalcev, npr. Macherey-Nagel pH-Fix 0–14).
// Odčitek: primerjaš barvo papirja z lestvico, natančnost ±1 pH (navodila proizvajalcev za papir s celimi enotami).
export const PAPIR = [
  [190, 20, 45], [220, 40, 40], [235, 85, 40], [245, 130, 40], [245, 175, 45], [235, 210, 50], [190, 210, 60], [110, 180, 70],
  [50, 160, 110], [40, 140, 160], [40, 100, 180], [60, 70, 170], [80, 50, 150], [90, 40, 120], [80, 30, 100],
];
export function papirBarva(pH) {
  const x = clamp(pH, 0, 14), i = Math.min(13, Math.floor(x));
  return mix(PAPIR[i], PAPIR[i + 1], x - i);
}
// Oko izbere najbližje polje lestvice: zaznava barve ±0,5 pH (ocena), zato je napaka največ 1.
export function papirOdcitek(pH, r) {
  return clamp(Math.round(pH + clamp(gauss(r, 0.25, 2), -0.5, 0.5)), 0, 14);
}

// Lastna barva vzorca prekrije barvo indikatorja (kola, kava) ali jo posvetli (mleko, zobna pasta).
export function zVzorcem(rgb, id) {
  const v = PH_VZORCI[id];
  return v.barva ? mix(rgb, v.barva, v.a) : rgb;
}

// ---------------------------------------------------------------- pH-meter
// Ločljivost 0,01 pH. Po umerjanju s tremi pufri (pH 4,01, 7,00, 10,01 pri 25 °C, ±0,02; DIN 19266) natančnost ±0,05 pH
// (ocena za šolski pH-meter): stalni zamik ≤ 0,012, napaka naklona ≤ 0,3 % (≤ 0,021 pri pH 0 ali 14), nihanje ≤ 0,01.
// Neumerjen (star) meter: zamik 0,3–0,8 pH in naklon 90–97 % (ocena za postarano elektrodo).
// Neoprana elektroda: kapljica prejšnjega vzorca in spomin stekla premakneta odčitek za 15 % razlike do prejšnjega
// vzorca, kar ob mešanju pojema s časovno konstanto 30 s (ocena).
export const PH_METER_IND = { napaka: 0.05, dec: 2, pufri: [4.01, 7.0, 10.01], zamik: [0.3, 0.8], naklon: [0.9, 0.97], prenos: 0.15, tau: 30 };

export class PhBench {
  constructor({ seed = 1 } = {}) {
    const r = (this.r = rng(seed));
    this.lit = {};
    for (const k of Object.keys(PH_VZORCI)) this.lit[k] = r();
    const M = PH_METER_IND;
    const sgn = r() < 0.5 ? -1 : 1;
    this.surov = { off: sgn * (M.zamik[0] + (M.zamik[1] - M.zamik[0]) * r()), slope: M.naklon[0] + (M.naklon[1] - M.naklon[0]) * r() };
    this.umerjen = { off: clamp(gauss(r, 0.005, 2.4), -0.012, 0.012), slope: 1 + clamp(gauss(r, 0.0012, 2.5), -0.003, 0.003) };
    this.cal = null; // null = neumerjen
    this.goggles = false;
    this.krat = {}; // razredčitev vzorca (1, 10, 100)
    this.elektroda = { v: null, cist: true, prej: null, t: 0 }; // v: vzorec, v katerem je; prej: pH tekočine, ki ostane na njej
  }
  pH(id) {
    return pravPH(id, { r: this.lit[id], krat: this.krat[id] || 1 });
  }
  razredci(id) {
    if (!PH_VZORCI[id].sestava) return { ok: false, why: "sestava" };
    if ((this.krat[id] || 1) >= 100) return { ok: false, why: "dovolj" };
    const e = this.elektroda;
    if (e.v === id) (e.prej = this.pH(id)), (e.v = null); // elektrodo vzameš ven; na njej ostane nerazredčen vzorec
    this.krat[id] = (this.krat[id] || 1) * 10;
    return { ok: true, krat: this.krat[id] };
  }
  potrebna(id) {
    return !this.goggles ? { ok: false, why: "ocala" } : null;
  }
  zelje(id) {
    return this.potrebna(id) || { ok: true, pas: zeljePas(this.pH(id)), rgb: zVzorcem(zeljeBarva(this.pH(id)), id) };
  }
  papir(id) {
    return this.potrebna(id) || { ok: true, rgb: zVzorcem(papirBarva(this.pH(id)), id), odcitek: papirOdcitek(this.pH(id), this.r) };
  }
  umeri() {
    if (!this.goggles) return { ok: false, why: "ocala" };
    this.cal = this.umerjen;
    Object.assign(this.elektroda, { v: null, cist: true, prej: null, t: 0 }); // med pufri jo spereš
    return { ok: true };
  }
  sperI() {
    Object.assign(this.elektroda, { v: null, cist: true, prej: null });
    return { ok: true };
  }
  potopi(id) {
    const n = this.potrebna(id);
    if (n) return n;
    const e = this.elektroda;
    const prej = e.v != null && e.v !== id ? this.pH(e.v) : e.prej;
    const umazana = !e.cist && prej != null && e.v !== id;
    Object.assign(e, { v: id, cist: false, prej: umazana ? prej : null, t: 0 });
    return { ok: true, umazana };
  }
  step(dt) {
    this.elektroda.t += dt;
  }
  // Odčitek pH-metra (null, če elektroda ni v vzorcu).
  readPH() {
    const e = this.elektroda;
    if (e.v == null) return null;
    const m = this.cal || this.surov, p = this.pH(e.v);
    let x = p + (e.prej != null ? PH_METER_IND.prenos * (e.prej - p) * Math.exp(-e.t / PH_METER_IND.tau) : 0);
    x = 7 + (x - 7) * m.slope + m.off + clamp(gauss(this.r, 0.004, 2.5), -0.01, 0.01);
    return Math.round(clamp(x, -1, 15) * 100) / 100;
  }
}

// ================================================================ dokazne reakcije (lab-dokaz)
// Sestava na 100 g (USDA FoodData Central, SR Legacy; zaokroženo): škrob, reducirajoči sladkorji (glukoza, fruktoza,
// laktoza, maltoza), saharoza, beljakovine, maščobe. Trdna živila zmečkaš z vodo (~1 g v 5 mL, redčenje 1/6, ocena),
// tekoča uporabiš razredčena 1 : 1 (beljak, mleko) ali kar tako.
export const ZIVILA = {
  kruh: { name: "kruh (bel)", skrob: 43, red: 4, sah: 0.5, belj: 9, mast: 3.3, redci: 1 / 6 },
  krompir: { name: "krompir (surov)", skrob: 15, red: 0.5, sah: 0.2, belj: 2, mast: 0.1, redci: 1 / 6 },
  sok: { name: "jabolčni sok", skrob: 0, red: 8.4, sah: 1.3, belj: 0.1, mast: 0.1, redci: 1 },
  med: { name: "med", skrob: 0, red: 75, sah: 0.9, belj: 0.3, mast: 0, redci: 1 / 6 },
  beljak: { name: "jajčni beljak", skrob: 0, red: 0.4, sah: 0, belj: 10.9, mast: 0.2, redci: 1 / 2 },
  mleko: { name: "mleko", skrob: 0, red: 4.8, sah: 0, belj: 3.3, mast: 3.5, redci: 1 / 2 },
  olje: { name: "sončnično olje", skrob: 0, red: 0, sah: 0, belj: 0, mast: 100, redci: 1 },
  sladkor: { name: "namizni sladkor (saharoza)", skrob: 0, red: 0, sah: 100, belj: 0, mast: 0, redci: 1 / 6 },
  glukoza: { name: "glukoza", skrob: 0, red: 100, sah: 0, belj: 0, mast: 0, redci: 1 / 6 },
  voda: { name: "voda (kontrola)", skrob: 0, red: 0, sah: 0, belj: 0, mast: 0, redci: 1 },
};
// Preskusi. Barve in meje zaznave (masni delež snovi v epruveti, %) so ocena po šolskih navodilih:
// jodovica (Lugolova raztopina) z škrobom modro črna, brez njega rumeno rjava (zazna ~0,01 % škroba);
// Fehlingov reagent po segrevanju v vreli vodni kopeli (~3 min): modra → zelena (0,1–0,5 %) → rumena (0,5–1 %)
// → oranžna (1–1,5 %) → opečnato rdeča oborina Cu₂O (nad 1,5 %), lestvica kot pri Benedictovem polkvantitativnem testu;
// biuretni reagent (NaOH + CuSO₄): svetlo modra, z beljakovinami vijolična (zazna ~0,2 %, ocena); masten madež na papirju:
// prosojen madež, ki se ne posuši, rahlo nad ~2 % in izrazito nad ~20 % maščob (ocena).
export const PRESKUSI = {
  jod: { name: "jodovica (škrob)", snov: "škrob", kljuc: "skrob" },
  fehling: { name: "Fehlingov reagent (reducirajoči sladkorji)", snov: "reducirajoči sladkor", kljuc: "red" },
  biuret: { name: "biuretni reagent (beljakovine)", snov: "beljakovine", kljuc: "belj" },
  madez: { name: "madež na papirju (maščobe)", snov: "maščobe", kljuc: "mast" },
};
const STOPNJE = {
  jod: [[0, "rumeno rjava", [196, 130, 40]], [0.01, "temno modra", [60, 50, 120]], [0.3, "modro črna", [25, 20, 55]]],
  fehling: [[0, "modra", [70, 130, 210]], [0.1, "zelena", [90, 160, 90]], [0.5, "rumena", [215, 190, 50]], [1, "oranžna", [225, 130, 40]], [1.5, "opečnato rdeča", [175, 60, 30]]],
  biuret: [[0, "svetlo modra", [140, 185, 230]], [0.2, "svetlo vijolična", [165, 120, 200]], [1, "vijolična", [120, 60, 160]]],
  madez: [[0, "madež se posuši", [235, 230, 215]], [2, "rahlo prosojen madež", [220, 210, 180]], [20, "prosojen masten madež", [205, 190, 150]]],
};
// Delež snovi v epruveti (%). Saharoza: s kapljico HCl in segrevanjem hidrolizira v glukozo in fruktozo (reducirajoči sladkor).
export function delez(z, kljuc, { hidroliza = false } = {}) {
  if (kljuc === "red") return (z.red + (hidroliza ? z.sah * (360.3 / 342.3) : 0)) * z.redci; // C₁₂H₂₂O₁₁ + H₂O → 2 C₆H₁₂O₆
  return z[kljuc] * (kljuc === "mast" ? 1 : z.redci);
}
export function barvaPreskusa(test, x) {
  const st = STOPNJE[test];
  let k = 0;
  for (let i = 0; i < st.length; i++) if (x >= st[i][0]) k = i;
  return { ime: st[k][1], rgb: st[k][2], pozitiven: k > 0, stopnja: k };
}
export const NEGATIVNO = Object.fromEntries(Object.entries(STOPNJE).map(([k, v]) => [k, v[0][1]]));

export class DokazBench {
  constructor({ seed = 1 } = {}) {
    this.r = rng(seed);
    this.goggles = false;
    this.zadnji = null; // vzorec, ki je ostal v kapalki
    this.n = 0;
  }
  // segrej: Fehlingov reagent deluje šele v vreli vodni kopeli; cista: nova epruveta in sprana kapalka.
  // Z umazano kapalko pride v epruveto ~5 % prejšnjega vzorca (ocena: ostanek v kapalki), kar da lažno pozitiven rezultat.
  preskus(id, test, { segrej = false, hidroliza = false, cista = true } = {}) {
    if (!this.goggles) return { ok: false, why: "ocala" };
    const z = ZIVILA[id], k = PRESKUSI[test].kljuc;
    let x = delez(z, k, { hidroliza: hidroliza && test === "fehling" });
    let onesnazeno = false;
    if (!cista && this.zadnji && this.zadnji !== id) {
      const y = delez(ZIVILA[this.zadnji], k);
      if (y > x) onesnazeno = barvaPreskusa(test, 0.95 * x + 0.05 * y).stopnja > barvaPreskusa(test, x).stopnja;
      x = 0.95 * x + 0.05 * y;
    }
    this.zadnji = id;
    this.n++;
    const brezToplote = test === "fehling" && !segrej;
    const b = brezToplote ? barvaPreskusa(test, 0) : barvaPreskusa(test, x);
    return { ok: true, ...b, brezToplote, onesnazeno, pravi: barvaPreskusa(test, delez(z, k, { hidroliza: hidroliza && test === "fehling" })).pozitiven };
  }
}

// ================================================================ amilaza iz sline (lab-slina)
// Človeška slinska α-amilaza: optimum ~37 °C in pH 6,7–7,0 (Bernfeld 1955, Methods Enzymol. 1, 149; učbeniški podatek),
// nad ~60 °C se nepovratno denaturira. Oblika krivulje je ocena:
// hitrost V(T) = V37 · Q10^((T − 37)/10) · f(T)/f(37), Q10 = 2 (ocena, običajno za encime 2–3),
// f(T) = 1 / (1 + e^((T − 42)/4)) povratna izguba aktivnosti nad ~40 °C (ocena; vrh krivulje pri ~38 °C),
// nepovratna denaturacija: razpolovni čas aktivnega encima 1 min pri 60 °C, e-krat krajši na vsake 3 K (ocena).
// Razgradnja škroba po Michaelis–Mentenovi: dS/dt = −V · S / (Km + S), Km = 0,2 % (ocena; 1–5 mg/mL v literaturi).
// V37 je izbran tako, da 1 % škrob z razredčeno slino pri 37 °C izgine v ~5 min (šolska navodila: 2–10 min; ocena).
export const AMILAZA = { Q10: 2, Tf: 42, wf: 4, Td: 60, wd: 3, tHalf: 60, Km: 0.2, V37: (0.2 * Math.log(10) + 0.9) / 300 };
const fRev = (T) => 1 / (1 + Math.exp((T - AMILAZA.Tf) / AMILAZA.wf));
export const hitrostAmilaze = (T) => AMILAZA.V37 * AMILAZA.Q10 ** ((T - 37) / 10) * (fRev(T) / fRev(37));
export const denaturacija = (T) => (Math.LN2 / AMILAZA.tHalf) * Math.exp((T - AMILAZA.Td) / AMILAZA.wd);
// Barva kapljice z jodovico glede na preostali škrob (%, ocena): modro črna → temno modra → vijolično rjava (dekstrini) → rumeno rjava.
export const JOD_STOPNJE = [[0.5, "modro črna", [25, 20, 55]], [0.25, "temno modra", [55, 50, 125]], [0.1, "vijolično rjava", [125, 65, 75]], [0, "rumeno rjava", [196, 130, 40]]];
export function jodBarva(S) {
  const s = JOD_STOPNJE.find(([m]) => S >= m) || JOD_STOPNJE[3];
  return { ime: s[1], rgb: s[2], razgrajen: S < 0.1 };
}
// Epruvete: 5 mL škroba in 1 mL razredčene sline (1 : 10, ocena) v vodni kopeli. Vrstni red je tudi vrstni red jemanja kapljic.
export const EPRUVETE = [
  { id: "t0", name: "0 °C (led)", T: 0, slina: true },
  { id: "t20", name: "20 °C (sobna)", T: 20, slina: true },
  { id: "t37", name: "37 °C (telo)", T: 37, slina: true },
  { id: "kuh", name: "prekuhana slina, 37 °C", T: 37, slina: true, kuhana: true },
  { id: "t70", name: "70 °C", T: 70, slina: true },
  { id: "kontrola", name: "brez sline (voda), 37 °C", T: 37, slina: false },
];
// Ista kapalka za vse epruvete brez spiranja: v naslednjo epruveto prenese ~0,05 mL tekočine (od ~6 mL), torej ~0,8 % encima (ocena).
export const KAPALKA_PRENOS = 0.05 / 6;

export class SlinaBench {
  constructor({ seed = 1 } = {}) {
    this.r = rng(seed);
    this.t = 0;
    this.teče = false;
    this.skrob = 1; // %, 1 je pravilno, 5 je preveč
    this.ista = false; // ista kapalka brez spiranja
    this.tubes = null;
  }
  zacni() {
    // V37 se med ljudmi razlikuje (količina amilaze v slini); ±15 % (ocena).
    const osebek = 1 + clamp(gauss(this.r, 0.08, 2), -0.15, 0.15);
    this.tubes = EPRUVETE.map((e) => ({ ...e, S: this.skrob, E: e.slina && !e.kuhana ? osebek : 0, tKonec: null }));
    this.t = 0;
    this.teče = true;
  }
  step(dt) {
    if (!this.teče) return;
    const n = Math.max(1, Math.ceil(dt / 0.5)), h = dt / n;
    for (let i = 0; i < n; i++) {
      this.t += h;
      for (const u of this.tubes) {
        if (u.E <= 0 || u.S <= 0) continue;
        u.E *= Math.exp(-denaturacija(u.T) * h);
        u.S = Math.max(0, u.S - h * u.E * hitrostAmilaze(u.T) * (u.S / (AMILAZA.Km + u.S)));
      }
    }
  }
  // Kapljica iz vsake epruvete na ploščico z jodovico (enkrat na minuto). Z isto kapalko se encim prenaša naprej.
  vzorci() {
    const out = this.tubes.map((u) => {
      const b = jodBarva(u.S);
      if (b.razgrajen && u.tKonec == null) u.tKonec = this.t;
      return { id: u.id, ...b, S: u.S };
    });
    if (this.ista) for (let i = 1; i < this.tubes.length; i++) this.tubes[i].E += KAPALKA_PRENOS * this.tubes[i - 1].E;
    return out;
  }
}
// Čas do izginotja škroba (s) v idealni epruveti pri T (brez jemanja kapljic), za teste in razlago.
export function casRazgradnje(T, { skrob = 1, kuhana = false, tMax = 3600 } = {}) {
  if (kuhana) return Infinity;
  let S = skrob, E = 1, t = 0;
  const h = 0.5;
  while (S >= 0.1 && t < tMax) {
    E *= Math.exp(-denaturacija(T) * h);
    S -= h * E * hitrostAmilaze(T) * (S / (AMILAZA.Km + S));
    t += h;
  }
  return S < 0.1 ? t : Infinity;
}

export const POENOSTAVITVE_INDIKATORJI = {
  ph: [
    "Pri kisu, sodi bikarboni, amoniaku, čistilu za odtoke, destilirani vodi in HCl pH izračunamo iz sestave. Pri drugih snoveh (limona, kola, kava, mleko, voda iz pipe, milo, zobna pasta) vzamemo vrednost iz meritev drugih ljudi, ker je v njih preveč različnih snovi.",
    "Raztopine so idealne in imajo 25 °C. Pravi pH-meter v zelo kislih in zelo bazičnih raztopinah pokaže malo drugačno vrednost.",
    "Barve rdečega zelja in indikatorskega papirja so narisane po barvnih lestvicah; prava barva je odvisna od tega, kako močan je izvleček in kateri papir imaš.",
    "Kapljica prejšnjega vzorca na neoprani elektrodi premakne odčitek. Pri pravem merilniku je ta napaka odvisna od vzorca; tu je ocenjena za vse enako.",
    "Razredčiti lahko samo vzorce, pri katerih vemo, kaj je v njih.",
  ],
  dokaz: [
    "Sestava živil je povprečje iz preglednic. Pravo živilo ima lahko več ali manj sladkorja ali beljakovin.",
    "Barve in najmanjše količine, ki jih preskus še pokaže, so ocenjene po šolskih navodilih.",
    "Segrevanje v vreli vodni kopeli je skrajšano na trenutek. Pravi preskus s Fehlingovim reagentom traja nekaj minut.",
    "Pri umazani kapalki pride v epruveto vedno enak delež prejšnjega vzorca.",
  ],
  slina: [
    "Slina je pri vseh ljudeh podobna; v resnici ima nekdo veliko več amilaze kot drug.",
    "Epruvete imajo že na začetku temperaturo kopeli. V resnici se segrevajo ali ohlajajo nekaj minut.",
    "Krivulja hitrosti encima pri različnih temperaturah je ocenjena tako, da je najhitrejši pri ~37 °C in da se pri 60 °C in več uniči.",
    "Barva kapljice z jodovico je odvisna samo od količine škroba, ki je še ostal.",
  ],
};
