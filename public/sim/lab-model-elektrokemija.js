// Virtualni laboratorij: elektrokemija (model brez DOM; testi: test/laboratorij-elektrokemija.test.js).
// lab-elektroliza: Hofmannov aparat (elektroliza vode in raztopin), Faradayev zakon, plini v merilnih ceveh.
// lab-galvanski: galvanski člen iz dveh polčlenov, solni most, Nernstova enačba, notranji upor in obremenitev.
// lab-kovine: kovine v kislinah in raztopinah soli, vrsta reaktivnosti kovin.
// Vsaka številka ima vir ali je označena kot ocena. Poenostavitve: POENOSTAVITVE_ELEKTROKEMIJA in docs/laboratorij.md.
import { rng, gauss, makeMeter, meterRead, meterSpec, fuseRate, AM_RANGES, VM_RANGES, R_VOLTMETER, NAPAJALNIK, R_PLIN } from "./lab-model.js";
import { pNas, makeThermo, thermoStep, thermoRead, VODA } from "./lab-model-toplota.js";
import { LED, TESTER } from "./lab-model-elektrika.js";
import { papirBarva } from "./lab-model-indikatorji.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const K0 = 273.15;
const LN10 = Math.LN10;
const lerp = (tab, x) => {
  if (x <= tab[0][0]) return tab[0][1] * (x / tab[0][0]); // pod prvo točko sorazmerno s koncentracijo
  for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) return tab[i - 1][1] + ((tab[i][1] - tab[i - 1][1]) * (x - tab[i - 1][0])) / (tab[i][0] - tab[i - 1][0]);
  return tab[tab.length - 1][1];
};

// ================================================================ konstante
export const F = 96485.33212; // C/mol, Faradayeva konstanta (CODATA 2018, točna: N_A · e)
export const G_ZEM = 9.80665; // m/s², standardni težni pospešek
export const P_1ATM = 101325; // Pa
export const KW = 1e-14; // ionski produkt vode pri 25 °C (CRC)
// Nernstov faktor RT/(nF) v voltih; na dekado ln 10 · RT/(nF) = 0,05916/n V pri 25 °C (Bard & Faulkner, 2. izd., §2.1).
export const nernst = (T, n = 1) => (R_PLIN * (T + K0)) / (n * F);
export const naklonDekada = (T, n = 1) => nernst(T, n) * LN10;
// Faradayev zakon: množina snovi, ki nastane pri naboju Q = I t, če za en delec potrebujemo z elektronov.
export const faradayMol = (I, t, z) => (I * t) / (z * F);
// Prostornina plina iz množine (idealni plin): V = nRT/p, p je delni tlak suhega plina (zunanji tlak minus parni tlak vode).
export const prostorninaPlina = (n, T, p) => (n * R_PLIN * (T + K0)) / p; // m³

// Laboratorij: temperatura 20–24 °C (ocena za učilnico), zračni tlak okoli 98 kPa (Ljubljana, ~300 m n. m.: po ISA 97,8 kPa,
// vreme ±1,5 kPa). Digitalni barometer: ločljivost 0,1 kPa, natančnost ±0,2 kPa (ocena za šolske vremenske postaje).
export function laboratorij(r) {
  return { T: 22 + clamp(gauss(r, 0.8, 2.5), -2, 2), p: 98000 + clamp(gauss(r, 700, 2.5), -1800, 1800) };
}
export const barometerRead = (p, r) => Math.round((p + clamp(gauss(r, 60, 2.5), -150, 150)) / 100) / 10; // kPa

// pH iz neto koncentracije močne kisline x = [H⁺] − [OH⁻] (mol/L).
export function phIzX(x) {
  const h = x >= 0 ? (x + Math.sqrt(x * x + 4 * KW)) / 2 : KW / ((-x + Math.sqrt(x * x + 4 * KW)) / 2);
  return -Math.log10(h);
}
const xIzPh = (pH) => 10 ** -pH - KW / 10 ** -pH;
// Žveplova(VI) kislina: prva stopnja popolna, HSO₄⁻ ⇌ H⁺ + SO₄²⁻ s Ka2 = 1,02 · 10⁻² (pKa 1,99, CRC Handbook, »Dissociation constants of inorganic acids«).
// Bilanca nabojev s kovinskimi ioni m (mol/L, dvovalentni): h + 2m = s (h + 2Ka)/(h + Ka).
export const KA2_H2SO4 = 1.02e-2;
export function hH2SO4(s, m = 0) {
  const Ka = KA2_H2SO4, b = Ka + 2 * m - s, c = 2 * m * Ka - 2 * s * Ka;
  return Math.max(1e-7, (-b + Math.sqrt(b * b - 4 * c)) / 2);
}

// ================================================================ 1. elektroliza v Hofmannovem aparatu
// Tekočine. Električna prevodnost κ pri 20 °C v S/m:
// H₂SO₄: CRC Handbook, »Electrical conductivity of aqueous solutions« (po masnem deležu: 1 % 4,78; 5 % 20,9; 10 % 39,1 S/m),
//   preračunano na 0,1 / 0,5 / 1 mol/L (0,98 / 4,8 / 9,2 %).
// NaOH in Na₂SO₄: iz ekvivalentne prevodnosti (CRC, »Equivalent conductivity of electrolytes in aqueous solution«, 25 °C;
//   NaOH 0,1 N 221 S cm²/mol), pri večjih koncentracijah ocena, preračunano na 20 °C z −2 %/K.
// NaCl: CRC (1 % 1,6; 5 % 7,0 S/m, enako kot MATERIALI v lab-model-elektrika.js), interpolirano.
// Voda iz pipe ~0,05 S/m (ocena za trdo vodo, 500 µS/cm), destilirana voda na zraku ~1 · 10⁻⁴ S/m (CO₂ iz zraka, ocena).
// Temperaturni koeficient prevodnosti +2 %/K (ocena; ISO 7888 uporablja ~1,9–2,1 %/K za naravne vode in soli).
// Gostote (g/mL, CRC »Concentrative properties«): H₂SO₄ 1 mol/L 1,059; Na₂SO₄ 0,5 mol/L 1,059; NaOH 1 mol/L 1,041; NaCl 1 mol/L 1,038 (linearno).
// Začetni pH: destilirana voda 5,6 (CO₂ iz zraka), Na₂SO₄ in NaCl v destilirani vodi ~6 (ocena), voda iz pipe 7,5 (ocena).
// Klorid v vodi iz pipe ~20 mg/L = 0,6 mmol/L (ocena za slovensko pitno vodo; pravilnik dovoljuje do 250 mg/L).
export const KONC_EL = [0.1, 0.5, 1];
export const TEKOCINE_EL = {
  destilirana: { name: "destilirana voda", kappa: () => 1e-4, rho: () => 998, pH: () => 5.6, cl: () => 0 },
  vodovodna: { name: "voda iz pipe", kappa: () => 0.05, rho: () => 998, pH: () => 7.5, cl: () => 6e-4 },
  h2so4: { name: "razredčena žveplova(VI) kislina", formula: "H₂SO₄", konc: true, kappa: (c) => lerp([[0.1, 4.7], [0.5, 20.0], [1, 36.0]], c), rho: (c) => 998 + 61 * c, pH: (c) => -Math.log10(hH2SO4(c)), cl: () => 0 },
  na2so4: { name: "raztopina natrijevega sulfata", formula: "Na₂SO₄", konc: true, kappa: (c) => lerp([[0.1, 1.5], [0.5, 5.4], [1, 8.1]], c), rho: (c) => 998 + 122 * c, pH: () => 6, cl: () => 0 },
  naoh: { name: "raztopina natrijevega hidroksida", formula: "NaOH", konc: true, jedko: true, kappa: (c) => lerp([[0.1, 2.0], [0.5, 9.3], [1, 16.4]], c), rho: (c) => 998 + 43 * c, pH: (c) => 14 + Math.log10(c), cl: () => 0 },
  nacl: { name: "raztopina natrijevega klorida", formula: "NaCl", konc: true, kappa: (c) => lerp([[0.1, 0.97], [0.5, 4.4], [1, 7.6]], c), rho: (c) => 998 + 40 * c, pH: () => 6, cl: (c) => c },
};

// Hofmannov aparat (mere po katalogih učil, ocena): stranski cevi s skalo 0–50 mL po 0,1 mL, notranji premer 14,1 mm
// (50 mL na 32 cm skale, 1 mL = 6,4 mm); pod oznako 50 je še ~7 mL do kolena, nato plin uide v spojno cev in skozi srednjo cev ven.
// Srednja cev z bučko (presek bučke ~12 cm²), po polnjenju je gladina v bučki 4 cm nad oznako 0. V aparatu je 160 mL tekočine.
// Električna pot med elektrodama (navzdol, skozi spojno cev, navzgor) je ~12 cm dolga s presekom ~1,6 cm², z zožitvijo ob
// majhnih elektrodah: konstanta celice K = l/A ≈ 700 m⁻¹ (ocena), upor tekočine R = K/κ.
// Toplotna kapaciteta: 160 g tekočine (c vode, VODA iz lab-model-toplota.js) in ~155 g borosilikatnega stekla (c = 0,83 J/(g K), CRC),
// toplotna prevodnost do okolice 0,4 W/K (ocena za tanke steklene cevi).
// Skala cevi: stalna napaka do ±0,1 mL (ocena, kot razred B), oko odčita sredino meniska do ±0,05 mL, zapis po 0,1 mL.
export const HOFMANN = { Vskala: 50, Vmax: 57, A: 1.56e-4, Arez: 12e-4, h0: 0.04, K: 700, Vtek: 0.16, Vblizu: 0.015, Cst: 155 * 0.83, G: 0.4, kal: 0.1, oko: 0.05 };
export const R_ZICE = 0.1; // Ω, vodniki s krokodilčki (ocena)

// Elektrodna kinetika (Tafel): η = (b / ln 10) · arsinh(i / 2i₀), i v A/cm², b v V na dekado.
// Platina: H₂ i₀ = 10⁻³ A/cm² (Bard & Faulkner, tab. 3.4.1: H₂ na Pt v 1 M H₂SO₄), b = 0,03 V; O₂ i₀ ~10⁻⁷, b = 0,10 V (ocena,
// da je prenapetost kisika na Pt ~0,5 V pri 10 mA/cm²); Cl₂ i₀ ~10⁻⁴, b = 0,04 V (ocena po Trasattiju).
// Grafit: H₂ i₀ ~10⁻⁶ (ocena; ogljik je slab katalizator za vodik), O₂ 10⁻⁸, Cl₂ 10⁻⁵ A/cm² (ocena); na grafitni anodi se ~8 %
// naboja porabi za oksidacijo ogljika do CO₂ (C + 2H₂O → CO₂ + 4H⁺ + 4e⁻; ocena), zato je kisika manj in anoda se obrablja.
// Površina: platinasta ploščica 1 cm × 1 cm (obe strani 2 cm²), grafitna palčka Ø 6 mm, 2 cm v tekočini (~4 cm²) (ocena).
// Praktični začetek razvijanja plinov na Pt v 0,5 M H₂SO₄ je tako pri ~1,7–1,9 V, na grafitu pri ~2,1–2,4 V
// (termodinamsko 1,23 V; Atkins, Physical Chemistry: ΔG° = 237,1 kJ/mol → E = 1,229 V).
export const ELEKTRODE = {
  pt: { name: "platina", A: 2, H2: [1e-3, 0.03], O2: [1e-7, 0.1], Cl2: [1e-4, 0.04], co2: 0 },
  grafit: { name: "grafit", A: 4, H2: [1e-6, 0.12], O2: [1e-8, 0.12], Cl2: [1e-5, 0.06], co2: 0.08 },
};
// Ravnotežni potenciali (proti SHE, 25 °C, Bard & Faulkner, dodatek C): O₂/H₂O 1,229 V (dE/dT = −0,85 mV/K), Cl₂/Cl⁻ 1,358 V
// (dE/dT = −1,25 mV/K), H⁺/H₂ 0 V. Termonevtralna napetost elektrolize vode 1,481 V (ΔH = −285,83 kJ/mol, NIST/CODATA):
// nad njo se razlika (U − 1,481 V) · I sprosti kot toplota.
export const E_O2 = 1.229, E_CL2 = 1.358, U_TERMONEVTRALNA = 1.481;
// Difuzijski koeficient Cl⁻ 2,03 · 10⁻⁵ cm²/s (CRC, »Ionic conductivity and diffusion at infinite dilution«), mejna plast ob
// elektrodi, ki jo mešajo mehurčki, ~0,05 cm (ocena): mejni tok oksidacije kloridov i_lim = 2F D c / δ.
const D_CL = 2.03e-5, DELTA_EL = 0.05;
// Topnost plinov (Henryjeva konstanta, mol/(L·atm), 25 °C, Sander 2015, Atmos. Chem. Phys. 15, 4399): O₂ 1,3 · 10⁻³,
// H₂ 7,8 · 10⁻⁴, CO₂ 0,034. Klor skupaj s hidrolizo (Cl₂ + H₂O ⇌ HClO + H⁺ + Cl⁻) ~0,10 mol/L pri 20 °C in 1 atm (CRC: 7,3 g/L).
// Plin se raztaplja v ~15 mL tekočine ob elektrodi; od nastalega plina se raztopi delež φ · (1 − c/c_nas) (φ ocena).
// Voda je na začetku nasičena z zrakom (20,95 % O₂), zato kisik zaostaja manj kot bi brez tega.
export const TOPNOST = { H2: 7.8e-4, O2: 1.3e-3, CO2: 0.034, Cl2: 0.1 };
export const RAZTAPLJANJE = { H2: 0.5, O2: 0.5, CO2: 0.7, Cl2: 0.8 };
const PLINI = ["H2", "O2", "Cl2", "CO2", "zrak"];
const prazno = () => ({ H2: 0, O2: 0, Cl2: 0, CO2: 0, zrak: 0 });
// Ostali (nefaradajski) tok ob elektrodah, ko je napetost pod razkrojno: ~2 µA/cm² pri nekaj voltih (ocena; nečistoče, raztopljeni O₂).
const I_OSTALI = 2e-6;

const eta = (i, [i0, b]) => (b / LN10) * Math.asinh(i / (2 * i0));
const iTafel = (et, [i0, b]) => (et <= 0 ? 0 : 2 * i0 * Math.sinh(Math.min(300, (et * LN10) / b)));

export class ElektrolizaBench {
  constructor({ seed = 1, T, p } = {}) {
    const r = (this.r = rng(seed));
    const L = laboratorij(r);
    this.lab = { T: T ?? L.T, p: p ?? L.p };
    this.T = this.lab.T; // temperatura tekočine (°C)
    this.elektrode = "pt";
    this.tek = null; // { id, c }
    this.U = 0; // nastavljena napetost napajalnika
    this.Ilim = 0.5; // omejitev toka (A)
    this.vklop = false;
    this.pol = "L-"; // leva elektroda na − (katoda) | "L+"
    this.pipa = [true, true]; // odprta?
    this.amRange = "200m";
    this.fuse = { mA: { Q: 0, blown: false }, A10: { Q: 0, blown: false } };
    this.meter = makeMeter(r);
    this.thermo = makeThermo(r);
    this.indikator = false;
    this.t = 0;
    this.Q = 0; // pretečeni naboj (C), točno
    this.nGen = prazno(); // nastali plini (mol), točno po Faradayu
    this.izlito = prazno(); // plin, ki je ušel (odprta pipa, polna cev)
    this.kal = [0, 1].map(() => clamp(gauss(r, HOFMANN.kal / 2.5, 2.5), -HOFMANN.kal, HOFMANN.kal));
    this.arms = [0, 1].map(() => ({ g: prazno(), d: prazno(), x: 0, polna: false }));
    this.last = { I: 0, Ucell: 0, Uout: 0, cc: false, fO2: 1, fCl2: 0, fCO2: 0, Erev: 0 };
    this.events = [];
  }
  get katoda() {
    return this.pol === "L-" ? 0 : 1;
  }
  get anoda() {
    return 1 - this.katoda;
  }
  fuseOf(range = this.amRange) {
    return AM_RANGES[range].unit === "A" ? this.fuse.A10 : this.fuse.mA;
  }
  // Nalij tekočino skozi srednjo cev. Pipi morata biti odprti, da zrak uide; sicer zrak ostane ujet v ceveh.
  napolni(id, c = 0.5) {
    const T = TEKOCINE_EL[id];
    this.tek = { id, c: T.konc ? c : 0 };
    this.T = this.lab.T;
    const x = xIzPh(T.pH(c));
    const pw = pNas(this.T);
    this.arms = [0, 1].map((i) => {
      const a = { g: prazno(), d: prazno(), x, polna: false };
      a.d.O2 = 0.2095 * ((this.lab.p - pw) / P_1ATM) * TOPNOST.O2 * HOFMANN.Vblizu; // z zrakom nasičena voda
      if (!this.pipa[i]) a.g.zrak = ((this.lab.p - pw) * HOFMANN.Vmax * 1e-6) / (R_PLIN * (this.T + K0)); // zrak ostane ujet
      return a;
    });
    this.izlito = prazno();
    return { ujet: this.pipa.map((o) => !o) };
  }
  izprazni() {
    this.tek = null;
    this.vklop = false;
    this.arms = [0, 1].map(() => ({ g: prazno(), d: prazno(), x: 0, polna: false }));
  }
  odpriPipo(i, odprta) {
    this.pipa[i] = odprta;
    if (odprta) this._izpusti(i);
  }
  _izpusti(i) {
    const g = this.arms[i].g;
    for (const k of PLINI) (this.izlito[k] += g[k]), (g[k] = 0);
    this.arms[i].polna = false;
  }
  replaceFuse() {
    const f = this.fuseOf();
    f.blown = false;
    f.Q = 0;
  }
  // Ravnotežja pri trenutni sestavi: pH ob katodi in anodi, koncentracija kloridov, upor tekočine.
  stanje() {
    const T = this.T, k = naklonDekada(T, 1), E = ELEKTRODE[this.elektrode];
    const tk = TEKOCINE_EL[this.tek?.id ?? "destilirana"], c = this.tek?.c ?? 0;
    const pHa = phIzX(this.arms[this.anoda].x), pHc = phIzX(this.arms[this.katoda].x);
    const kappa = tk.kappa(c) * (1 + 0.02 * (T - 20));
    return {
      E, A: E.A, k,
      EO2: E_O2 - 0.00085 * (T - 25) - k * pHa,
      EH2: -k * pHc,
      cl: tk.cl(c),
      ECl2: E_CL2 - 0.00125 * (T - 25) - k * Math.log10(Math.max(tk.cl(c), 1e-9)),
      R: HOFMANN.K / kappa,
    };
  }
  // Potencial anode pri gostoti toka i (A/cm²): kisik in klor se razvijata hkrati (skupni potencial).
  _anoda(i, st) {
    const iO2 = (E) => iTafel(E - st.EO2, st.E.O2);
    if (st.cl < 1e-6) return { Ea: st.EO2 + eta(i, st.E.O2), fCl: 0 };
    const ilim = (2 * F * D_CL * (st.cl / 1000)) / DELTA_EL;
    const iCl = (E) => {
      const k = iTafel(E - st.ECl2, st.E.Cl2);
      return k / (1 + k / ilim);
    };
    let lo = Math.min(st.EO2, st.ECl2), hi = st.EO2 + eta(i, st.E.O2) + 1e-9;
    for (let n = 0; n < 60; n++) {
      const m = (lo + hi) / 2;
      iO2(m) + iCl(m) > i ? (hi = m) : (lo = m);
    }
    const Ea = (lo + hi) / 2, tot = iO2(Ea) + iCl(Ea);
    return { Ea, fCl: tot > 0 ? iCl(Ea) / tot : 0 };
  }
  // Napetost na celici pri toku I (A).
  uCelice(I, st = this.stanje()) {
    const i = I / st.A;
    const Ec = st.EH2 - eta(i, st.E.H2);
    const { Ea, fCl } = this._anoda(i, st);
    return { U: Ea - Ec + I * st.R, fCl, Erev: Math.min(st.EO2, st.ECl2) - st.EH2 };
  }
  solve() {
    const out = { I: 0, Ucell: 0, Uout: 0, cc: false, fO2: 1, fCl2: 0, fCO2: 0, Erev: 0, Ires: 0 };
    const st = this.stanje();
    out.Erev = this.uCelice(0, st).Erev;
    const on = this.vklop && this.tek && !this.fuseOf().blown;
    if (!on) return (this.last = { ...out, Uout: this.vklop ? this.U : 0 });
    const Rext = NAPAJALNIK.rs + AM_RANGES[this.amRange].rsh + R_ZICE;
    const Uc = (I) => this.uCelice(I, st).U + I * Rext;
    let I = 0;
    if (this.U > Uc(0)) {
      let lo = 0, hi = this.U / (st.R + Rext) + 1e-12;
      for (let n = 0; n < 60; n++) {
        const m = (lo + hi) / 2;
        Uc(m) > this.U ? (hi = m) : (lo = m);
      }
      I = (lo + hi) / 2;
    }
    if (I > this.Ilim) (I = this.Ilim), (out.cc = true);
    const cel = this.uCelice(I, st);
    out.Ires = Math.min(I_OSTALI * st.A * (this.U / 2), this.U / st.R);
    out.I = I + out.Ires;
    out.Ucell = I > 0 ? cel.U : Math.min(this.U, out.Erev);
    out.Uout = out.cc ? cel.U + I * Rext : this.U;
    out.fCl2 = I > 0 ? cel.fCl : 0;
    out.fCO2 = (1 - out.fCl2) * st.E.co2;
    out.fO2 = 1 - out.fCl2 - out.fCO2;
    out.If = I; // faradajski del
    return (this.last = out);
  }
  step(dt) {
    let left = dt;
    while (left > 1e-9) {
      const h = Math.min(0.5, left);
      this._step(h);
      left -= h;
    }
  }
  _step(h) {
    const s = this.solve();
    // varovalka v ampermetru (IEC 60127-2 kot v lab-model.js)
    if (this.vklop && this.tek) {
      const f = this.fuseOf();
      if (!f.blown) {
        f.Q += h * fuseRate(s.I, AM_RANGES[this.amRange].fuse);
        if (f.Q >= 1) (f.blown = true), this.events.push({ t: this.t, type: "varovalka", I: s.I });
      }
    }
    const I = s.If || 0;
    if (I > 0) {
      this.Q += I * h;
      const dn = { H2: (I * h) / (2 * F), O2: (I * h * s.fO2) / (4 * F), Cl2: (I * h * s.fCl2) / (2 * F), CO2: (I * h * s.fCO2) / (4 * F) };
      for (const k in dn) this.nGen[k] += dn[k];
      const K = this.arms[this.katoda], A = this.arms[this.anoda];
      this._zberi(this.katoda, { H2: dn.H2 });
      this._zberi(this.anoda, { O2: dn.O2, Cl2: dn.Cl2, CO2: dn.CO2 });
      // ob katodi nastane OH⁻ (2H₂O + 2e⁻ → H₂ + 2OH⁻), ob anodi H⁺ (2H₂O → O₂ + 4H⁺ + 4e⁻; C + 2H₂O → CO₂ + 4H⁺ + 4e⁻)
      K.x -= (I * h) / F / HOFMANN.Vblizu;
      A.x += ((I * h) / F) * (s.fO2 + s.fCO2) / HOFMANN.Vblizu;
    }
    // Joulova toplota: (U − 1,481 V) · I nad termonevtralno napetostjo; ves tok, če je napetost pod njo, ne greje.
    const tk = this.tek ? TEKOCINE_EL[this.tek.id] : null;
    if (tk) {
      const C = HOFMANN.Vtek * tk.rho(this.tek.c) * VODA.c / 1000 + HOFMANN.Cst;
      const P = I * Math.max(0, s.Ucell - U_TERMONEVTRALNA) + s.Ires * s.Ucell;
      this.T += (h * (P - HOFMANN.G * (this.T - this.lab.T))) / C;
    }
    this.t += h;
    thermoStep(this.thermo, this.T, h);
  }
  // Plin iz elektrode: del se raztopi, ostalo se zbere v cevi (ali uide, če je pipa odprta ali cev polna).
  _zberi(i, dn) {
    const a = this.arms[i];
    for (const [k, n] of Object.entries(dn)) {
      if (!n) continue;
      const cap = TOPNOST[k] * HOFMANN.Vblizu;
      const raz = RAZTAPLJANJE[k] * n * Math.max(0, 1 - a.d[k] / cap);
      a.d[k] += raz;
      if (k === "Cl2") a.x += raz / HOFMANN.Vblizu; // Cl₂ + H₂O → HClO + H⁺ + Cl⁻
      if (this.pipa[i]) this.izlito[k] += n - raz;
      else a.g[k] += n - raz;
    }
    if (this.pipa[i]) return;
    const V = this.volumni()[i];
    if (V > HOFMANN.Vmax) {
      const f = 1 - HOFMANN.Vmax / V;
      for (const k of PLINI) (this.izlito[k] += a.g[k] * f), (a.g[k] *= 1 - f);
      if (!a.polna) (a.polna = true), this.events.push({ t: this.t, type: "polna", i });
    }
  }
  nPlina(i) {
    return PLINI.reduce((s, k) => s + this.arms[i].g[k], 0);
  }
  // Prostornini plina v obeh ceveh (mL). Tlak plina = zračni tlak + ρ g Δh (gladina v bučki je višja) − parni tlak vode.
  volumni() {
    const T = this.T, pw = pNas(T), rho = this.tek ? TEKOCINE_EL[this.tek.id].rho(this.tek.c) : 998;
    const n = [0, 1].map((i) => this.nPlina(i));
    let V = n.map((x) => prostorninaPlina(x, T, this.lab.p - pw));
    for (let it = 0; it < 6; it++) {
      const yr = HOFMANN.h0 + (V[0] + V[1]) / HOFMANN.Arez;
      V = n.map((x, i) => prostorninaPlina(x, T, this.lab.p - pw + rho * G_ZEM * (yr + V[i] / HOFMANN.A)));
    }
    return V.map((v) => v * 1e6);
  }
  // Razlika gladin med bučko in cevjo (m): zaradi nje je plin stisnjen.
  razlikaGladin(i) {
    const V = this.volumni().map((v) => v * 1e-6);
    return HOFMANN.h0 + (V[0] + V[1]) / HOFMANN.Arez + V[i] / HOFMANN.A;
  }
  // Odčitek prostornine na skali (sredina meniska), mL po 0,1 mL.
  odcitek(i) {
    const V = this.volumni()[i];
    if (V > HOFMANN.Vskala + 0.05) return { text: "> 50", value: NaN, cez: true };
    const v = Math.round((V + this.kal[i] + clamp(gauss(this.r, HOFMANN.oko / 2.5, 2.5), -HOFMANN.oko, HOFMANN.oko)) * 10) / 10;
    return { text: Math.max(0, v).toFixed(1), value: Math.max(0, v) };
  }
  // Prostornina na skali brez očesne napake (za risbo meniska v povečavi).
  naSkali(i) {
    return this.volumni()[i] + this.kal[i];
  }
  readA() {
    const s = this.last;
    if (this.fuseOf().blown) return { text: "0.0", value: 0, over: false, fuse: true };
    return meterRead(this.meter, this.vklop && this.tek ? s.I : 0, AM_RANGES[this.amRange], "A");
  }
  // Prikaz napajalnika: napetost po 0,1 V, tok po 0,01 A (±(1 % + 1 digit), ocena za šolske napajalnike).
  readSupply() {
    const s = this.last;
    return { U: Math.round(s.Uout * 10) / 10, I: Math.round(s.I * 100) / 100, cc: s.cc };
  }
  readT() {
    return thermoRead(this.thermo);
  }
  pH(i) {
    return phIzX(this.arms[i].x);
  }
  // Barva tekočine v kraku z univerzalnim indikatorjem (lestvica papirja iz lab-model-indikatorji.js).
  // Klor (HClO) indikator razbarva (beli barvila): nad ~1 mmol/L raztopljenega klora barva bledi proti bledo rumeni (ocena).
  barva(i) {
    if (!this.indikator) return null;
    const c = papirBarva(this.pH(i)), cl = this.arms[i].d.Cl2 / HOFMANN.Vblizu, f = clamp((cl - 1e-3) / 0.02, 0, 1);
    return c.map((v, k) => Math.round(v + ([236, 238, 200][k] - v) * f));
  }
  // Barva v srednji cevi (tam se tekočina ne spremeni).
  barvaZacetna() {
    return this.indikator && this.tek ? papirBarva(TEKOCINE_EL[this.tek.id].pH(this.tek.c)) : null;
  }
  sestava(i) {
    const g = this.arms[i].g, n = this.nPlina(i) || 1;
    return { H2: g.H2 / n, O2: (g.O2 + 0.2095 * g.zrak) / n, Cl2: g.Cl2 / n, CO2: g.CO2 / n, zrak: g.zrak / n };
  }
  // Preskus plina ob pipi: odpreš pipo in plin pride ven. tlecka (tleča trska), goreca (goreča trska), lakmus (vlažen modri lakmusov papir).
  // Tleča trska se v plinu z več kot ~50 % kisika znova vžge (ocena; v zraku z 21 % le tli). Vodik z zrakom ob plamenu poči (meje vnetljivosti 4–75 %, CRC).
  preskus(i, vrsta) {
    if (this.pipa[i]) return { ok: false, text: "Pipa je odprta: plin je že ušel. Zapri pipo in počakaj, da se plin nabere." };
    const V = this.volumni()[i];
    if (V < 1.5) return { ok: false, text: "V cevi je premalo plina (vsaj 2 mL), da bi ga preizkusil." };
    const x = this.sestava(i);
    this.odpriPipo(i, true);
    this.pipa[i] = false; // po preskusu jo spet zapremo
    let res;
    if (vrsta === "tlecka") res = x.O2 > 0.5 ? { plin: "O2", text: "Tleča trska se znova vžge: v cevi je <b>kisik</b>." } : x.H2 > 0.3 ? { plin: "H2", text: "Tleča trska ugasne, plin ob njej tiho poči ali zagori z bledim plamenom." } : { plin: null, text: "Tleča trska ugasne." };
    else if (vrsta === "goreca") res = x.H2 > 0.3 ? { plin: "H2", text: "Plin ob goreči trski <b>poči</b> (pisk): v cevi je <b>vodik</b>." } : x.Cl2 > 0.2 ? { plin: "Cl2", text: "Plamen se zmanjša; zavoha se oster vonj po kloru. Klor je strupen – ne vohaj ga!" } : x.O2 > 0.5 ? { plin: "O2", text: "Trska zagori svetleje: plin podpira gorenje (kisik)." } : { plin: null, text: "Ni opazne spremembe." };
    else res = x.Cl2 > 0.05 ? { plin: "Cl2", text: "Vlažen modri lakmusov papir najprej pordeči, nato pobledi: <b>klor</b> beli barvila." } : { plin: null, text: "Lakmusov papir se ne spremeni." };
    return { ok: true, V, sestava: x, ...res };
  }
}

// ================================================================ 2. galvanski člen
// Standardni elektrodni potenciali (25 °C, proti SHE; CRC Handbook, »Electrochemical series«): Mg²⁺/Mg −2,372, Zn²⁺/Zn −0,7618,
// Fe²⁺/Fe −0,447, Pb²⁺/Pb −0,1262, Cu²⁺/Cu +0,3419, Ag⁺/Ag +0,7996 V. Molske mase IUPAC 2021, gostote CRC.
// Standardne tvorbene entalpije ionov v vodi (kJ/mol, NBS-tabele, Wagman idr. 1982, enake v CRC): Mg²⁺ −466,85, Zn²⁺ −153,89,
// Fe²⁺ −89,1, Pb²⁺ −1,7, Cu²⁺ +64,77, Ag⁺ +105,58.
// Barve kovin (lesk) so za risbo; »sol« je raztopina z lastnimi ioni kovine.
export const KOVINE = {
  Mg: { name: "magnezij", sym: "Mg", E0: -2.372, z: 2, M: 24.305, rho: 1.738, dHf: -466.85, sol: "MgSO4" },
  Zn: { name: "cink", sym: "Zn", E0: -0.7618, z: 2, M: 65.38, rho: 7.14, dHf: -153.89, sol: "ZnSO4" },
  Fe: { name: "železo", sym: "Fe", E0: -0.447, z: 2, M: 55.845, rho: 7.874, dHf: -89.1, sol: "FeSO4" },
  Pb: { name: "svinec", sym: "Pb", E0: -0.1262, z: 2, M: 207.2, rho: 11.34, dHf: -1.7, sol: "PbNO3" },
  Cu: { name: "baker", sym: "Cu", E0: 0.3419, z: 2, M: 63.546, rho: 8.96, dHf: 64.77, sol: "CuSO4" },
  Ag: { name: "srebro", sym: "Ag", E0: 0.7996, z: 1, M: 107.8682, rho: 10.49, dHf: 105.58, sol: "AgNO3" },
};
// Raztopine soli. κ pri 1 mol/L (S/m) ocena po CRC (»Electrical conductivity of aqueous solutions«), κ(c) ≈ κ₁ · c^0,8 (ocena).
// Difuzijski koeficienti ionov (10⁻⁵ cm²/s, CRC, »Ionic conductivity and diffusion at infinite dilution«): Mg²⁺ 0,706, Zn²⁺ 0,703,
// Fe²⁺ 0,719, Pb²⁺ 0,945, Cu²⁺ 0,714, Ag⁺ 1,648.
export const SOLI = {
  MgSO4: { name: "magnezijev sulfat", formula: "MgSO₄", ion: "Mg", k1: 4.9, D: 0.706e-5, pH: 6.5 },
  ZnSO4: { name: "cinkov sulfat", formula: "ZnSO₄", ion: "Zn", k1: 4.5, D: 0.703e-5, pH: 5.0 },
  FeSO4: { name: "železov(II) sulfat", formula: "FeSO₄", ion: "Fe", k1: 4.4, D: 0.719e-5, pH: 3.5 },
  PbNO3: { name: "svinčev(II) nitrat", formula: "Pb(NO₃)₂", ion: "Pb", k1: 7.5, D: 0.945e-5, pH: 4.0, strupeno: true },
  CuSO4: { name: "bakrov(II) sulfat", formula: "CuSO₄", ion: "Cu", k1: 4.6, D: 0.714e-5, pH: 4.0 },
  AgNO3: { name: "srebrov nitrat", formula: "AgNO₃", ion: "Ag", k1: 6.8, D: 1.648e-5, pH: 6.0 },
};
export const kappaSoli = (sol, c) => SOLI[sol].k1 * c ** 0.8;
export const KONC_G = [0.001, 0.01, 0.1, 1];

// Barva raztopine po Beer-Lambertovem zakonu: T = 10^(−ε c l) za rdeči, zeleni in modri del svetlobe. Efektivne absorptivnosti
// (L/(mol cm)) so ocena, prilagojena fotografijam: Cu²⁺ (vodni kompleks absorbira rdečo, vrh pri ~800 nm, ε ≈ 12 L/(mol cm), CRC)
// 0,62 / 0,24 / 0,07; Fe²⁺ (bledo zelen, ε ≈ 1 pri 960 nm) 0,10 / 0,02 / 0,09; ostali ioni so brezbarvni. Pot svetlobe l v cm.
const ABS = { Cu: [0.62, 0.24, 0.07], Fe: [0.1, 0.02, 0.09] };
export function barvaRaztopine(ioni, l = 3) {
  const base = [242, 247, 250];
  return base.map((v, k) => Math.round(v * 10 ** -Object.entries(ioni).reduce((s, [ion, c]) => s + (ABS[ion]?.[k] ?? 0) * c * l, 0)));
}

// Polčlen: elektroda v raztopini. Potencial po Nernstu E = E° + (RT/zF) ln c (aktivnost ≈ koncentracija, poenostavitev).
// Magnezij: v vodnih raztopinah ga pokriva plast MgO/Mg(OH)₂ in hkrati korodira (razvija H₂), zato izmerimo mešani potencial
// ~−1,5…−1,7 V proti SHE (Song & Atrens 1999, Adv. Eng. Mater. 1, 11), ne −2,37 V; vzamemo −1,55 V, od c odvisen le malo (ocena).
// Neobrušena kovina (oksidna plast) ima potencial bolj pozitiven: Mg +0,25, Zn +0,03, Fe +0,05, Pb +0,02, Cu +0,01 V (ocena).
// Kovina v raztopini tuje soli: če je bolj reaktivna od kovine v soli, se nanjo izloča ta kovina (prevleka) in potencial v ~90 s
// zdrsne k potencialu izločene kovine (ocena); če je manj reaktivna, določajo potencial sledovi lastnih ionov (~10⁻⁶ mol/L, ocena) in niha.
// Nihanje potenciala (ocena): urejen polčlen ±1 mV, magnezij ±15 mV, kovina brez lastnih ionov ±10 mV (počasno, τ = 60 s).
export const MG_MESANI = -1.55;
export const OKSID = { Mg: 0.25, Zn: 0.03, Fe: 0.05, Pb: 0.02, Cu: 0.01, Ag: 0 };
export const GALV = {
  Rmost: { papir: 8000, ucev: 400, brez: 1e13, suh: 5e9 }, // Ω (ocena): trak filtrirnega papirja s KNO₃, U-cev z agarjem in KNO₃, brez, suh trak
  Ksol: TESTER.K, // m⁻¹: konstanta »celice« med elektrodo in koncem mostu (~3 cm, ploščica 2 cm × 3 cm), isto kot v lab-prevodnost
  tauPrevleka: 90,
  sledovi: 1e-6,
  drift: { urejen: 2e-4, Mg: 3e-3, tuj: 2e-3, tau: 60 },
  lebdi: { sd: 1e-3, tau: 20, max: 0.006 }, // odprt vhod voltmetra »lebdi« (ocena)
};
// Porabniki: uporniki, rdeča LED (Vf 1,8 V pri 20 mA, LED iz lab-model-elektrika.js; I = 20 mA · e^((U − 1,8)/0,05), n·U_T ≈ 0,05 V,
// ocena za rdeče LED), majhen motorček za sončne celice (navitje 10 Ω, zažene se pri ~15 mA; ocena po podatkih prodajalcev učil).
export const BREME = {
  brez: { name: "brez porabnika" },
  R100: { name: "upornik 100 Ω", R: 100 },
  R1k: { name: "upornik 1 kΩ", R: 1000 },
  R10k: { name: "upornik 10 kΩ", R: 10000 },
  R100k: { name: "upornik 100 kΩ", R: 100000 },
  led: { name: "rdeča LED" },
  motor: { name: "motorček", R: 10, Izagon: 0.015 },
};
const iLed = (U) => (U <= 0 ? 0 : LED.Inom * (Math.exp((U - LED.Vf) / 0.05) - Math.exp(-LED.Vf / 0.05)));

export class GalvanBench {
  constructor({ seed = 1, T } = {}) {
    const r = (this.r = rng(seed));
    this.lab = laboratorij(r);
    if (T != null) this.lab.T = T;
    this.casi = [this._casa("Zn", 1), this._casa("Cu", 1)];
    this.most = "brez";
    this.rdeca = 1; // rdeči vodnik (V) na čaši 1, črni (COM) na čaši 0
    this.vmRange = "2";
    this.amRange = "20m";
    this.breme = "brez";
    this.meterV = makeMeter(r);
    this.meterA = makeMeter(r);
    this.lebdi = 0;
    this.t = 0;
    this.last = { U: 0, I: 0, E: 0, Ri: 0 };
  }
  _casa(kovina, c, sol = KOVINE[kovina].sol) {
    return { kovina, sol, c, obrusen: false, t: 0, drift: 0, dep: 0 };
  }
  postavi(i, { kovina, c, sol }) {
    const old = this.casi[i];
    kovina ??= old.kovina;
    c ??= old.c;
    sol ??= KOVINE[kovina].sol;
    const n = this._casa(kovina, c, sol);
    if (kovina === old.kovina) n.obrusen = old.obrusen;
    this.casi[i] = n;
  }
  obrusi(i) {
    this.casi[i].obrusen = true;
  }
  // Kovina v raztopini tuje soli: bolj reaktivna izpodriva (prevleka), manj reaktivna ne.
  tuja(i) {
    const b = this.casi[i], ion = SOLI[b.sol].ion;
    if (ion === b.kovina) return null;
    return KOVINE[b.kovina].E0 < KOVINE[ion].E0 ? "izpodriva" : "ne";
  }
  // Potencial polčlena brez nihanja (V proti SHE).
  E0pol(i) {
    const b = this.casi[i], K = KOVINE[b.kovina], T = this.lab.T, ox = b.obrusen ? 0 : OKSID[b.kovina];
    const own = (k, c) => (k === "Mg" ? MG_MESANI + 0.3 * nernst(T, 2) * Math.log(c) : KOVINE[k].E0 + nernst(T, KOVINE[k].z) * Math.log(c));
    const tj = this.tuja(i);
    if (!tj) return own(b.kovina, b.c) + ox;
    if (tj === "ne") return own(b.kovina, GALV.sledovi) + ox;
    const ion = SOLI[b.sol].ion, f = 1 - Math.exp(-b.t / GALV.tauPrevleka);
    return (1 - f) * (own(b.kovina, GALV.sledovi) + ox) + f * own(ion, b.c);
  }
  potencial(i) {
    return this.E0pol(i) + this.casi[i].drift;
  }
  get com() {
    return 1 - this.rdeca;
  }
  // Gonilna napetost, kot jo kaže voltmeter (rdeči minus črni vodnik).
  emf() {
    return this.potencial(this.rdeca) - this.potencial(this.com);
  }
  // Napoved samo iz standardnih potencialov (razlika E°) in po Nernstu.
  napovedE0() {
    return KOVINE[this.casi[this.rdeca].kovina].E0 - KOVINE[this.casi[this.com].kovina].E0;
  }
  napovedNernst() {
    const T = this.lab.T, e = (b) => KOVINE[b.kovina].E0 + nernst(T, KOVINE[b.kovina].z) * Math.log(b.c);
    return e(this.casi[this.rdeca]) - e(this.casi[this.com]);
  }
  Ri() {
    const sol = this.casi.reduce((s, b) => s + GALV.Ksol / kappaSoli(b.sol, b.c), 0);
    return GALV.Rmost[this.most] + sol;
  }
  // Napetost na sponkah: (E − U)/Ri = U/R_V + I_bremena(U).
  solve() {
    const E = this.emf(), Ri = this.Ri(), B = BREME[this.breme];
    const Ram = this.breme === "brez" ? 0 : AM_RANGES[this.amRange].rsh;
    const iB = (U) => {
      if (this.breme === "brez") return 0;
      if (this.breme === "led") return iLed(U);
      return U / (B.R + Ram);
    };
    const f = (U) => (E - U) / Ri - U / R_VOLTMETER - iB(U);
    let lo = Math.min(0, E), hi = Math.max(0, E);
    for (let n = 0; n < 80; n++) {
      const m = (lo + hi) / 2;
      f(m) > 0 ? (lo = m) : (hi = m);
    }
    const U = (lo + hi) / 2, I = iB(U);
    return (this.last = { U, I, E, Ri, sveti: this.breme === "led" && I >= LED.Imin, vrti: this.breme === "motor" && Math.abs(I) >= B.Izagon });
  }
  step(dt) {
    const r = this.r;
    for (const b of this.casi) {
      b.t += dt;
      const sd = b.kovina === "Mg" ? GALV.drift.Mg : SOLI[b.sol].ion !== b.kovina ? GALV.drift.tuj : GALV.drift.urejen;
      b.drift += -b.drift * (dt / GALV.drift.tau) + gauss(r, sd * Math.sqrt(dt), 3);
      if (this.tuja(this.casi.indexOf(b)) === "izpodriva") b.dep = 1 - Math.exp(-b.t / GALV.tauPrevleka);
    }
    const L = GALV.lebdi;
    this.lebdi = clamp(this.lebdi - this.lebdi * (dt / L.tau) + gauss(r, L.sd * Math.sqrt(dt), 3), -L.max, L.max);
    this.t += dt;
    this.solve();
  }
  // Odprt krog (brez mostu ali suh trak): vhod voltmetra lebdi in kaže nekaj milivoltov, ki se spreminjajo.
  readV() {
    const s = this.last, U = s.Ri > 1e9 ? s.U + this.lebdi : s.U;
    return meterRead(this.meterV, U, VM_RANGES[this.vmRange], "V");
  }
  readA() {
    if (this.breme === "brez") return null;
    return meterRead(this.meterA, this.last.I, AM_RANGES[this.amRange], "A");
  }
}

// ================================================================ 3. kovine v kislinah in raztopinah soli
// Oblika kovine in specifična površina a (cm²/g):
// trak: tanka ploščica debeline d, a = 2/(d ρ) (magnezijev trak 0,2 mm, ostali 0,25 mm; mere trakov za šole, ocena);
// granule (ostružki pri Mg): kroglice Ø 3 mm, a = 6/(d ρ), z neravno površino ×2 (ocena);
// prah: delci Ø ~50 µm, a = 6/(d ρ), a se delci sprimejo in delno plavajo, zato le 30 % površine moči kislina (ocena).
// Ko se kovina raztaplja, se površina manjša: A ∝ (m/m₀)^p, p = 2/3 za kroglice in prah, 1/2 za trak (ocena).
export const OBLIKE = {
  trak: { name: "trak", a: (K) => 2 / ((K.sym === "Mg" ? 0.02 : 0.025) * K.rho), p: 0.5 },
  granule: { name: "granule", a: (K) => (2 * 6) / (0.3 * K.rho), p: 2 / 3 },
  prah: { name: "prah", a: (K) => (0.3 * 6) / (0.005 * K.rho), p: 2 / 3 },
};
export const MASE = [0.05, 0.1, 0.2, 0.5]; // g
// Hitrost raztapljanja v kislini (mol H₂ na s): r = k · A · [H⁺] · e^(−Ea/R (1/T − 1/T₀)), T₀ = 20 °C, Ea = 40 kJ/mol (ocena; v
// literaturi 20–60 kJ/mol za Mg in Zn v HCl). Konstante k (mol/(s cm² · mol/L)) so ocena po šolskih meritvah: Mg 1,0 · 10⁻⁵
// (RSC »Disappearing magnesium«: 3 cm traku v 1 M HCl izgine v ~1 min), Zn 6 · 10⁻⁷ (granule: zmeren tok mehurčkov), Fe 6 · 10⁻⁸
// (počasni mehurčki), Cu 0 (baker z ioni H⁺ ne reagira: E°(Cu²⁺/Cu) > 0). Magnezij počasi reagira tudi z vodo (2 · 10⁻⁹ mol/(s cm²), ocena).
export const KINETIKA = { k: { Mg: 1.0e-5, Zn: 6e-7, Fe: 6e-8, Cu: 0, Ag: 0 }, Ea: 40000, kVoda: 2e-9 };
// Izpodrivanje v raztopini soli: ione dovaja difuzija skozi mejno plast δ (mirno ~0,02 cm, ob stresanju ~0,004 cm; ocena):
// tok j = D c / δ; ko je razlika potencialov majhna, se kovina izloča počasneje: f = min(1, (ΔE°/0,8 V)³) (ocena; Zn v FeSO₄ zato
// počrni šele v nekaj minutah, Zn v CuSO₄ v nekaj sekundah). Prevleka je izrazita, ko je izločeno ~5 · 10⁻⁷ mol/cm² (~3 µm bakra; ocena):
// delež pokritosti 1 − e^(−n/(A · 5 · 10⁻⁷)).
export const IZPODRIVANJE = { delta: 0.02, deltaMes: 0.004, vidno: 5e-7 };
export const reagiraS = (kovina, ion) => KOVINE[kovina].E0 < KOVINE[ion].E0;
// Raztopine: kisline (HCl, H₂SO₄) in soli. 50 mL v erlenmajerici 100 mL (do vratu ~130 mL, BUCKA v lab-model.js) ali v čaši 100 mL.
export const KISLINE = {
  HCl: { name: "klorovodikova kislina", formula: "HCl", konc: [0.5, 1, 2, 6] },
  H2SO4: { name: "razredčena žveplova(VI) kislina", formula: "H₂SO₄", konc: [0.5, 1, 2] },
};
export const RAZTOPINE_K = { ...Object.fromEntries(Object.entries(KISLINE).map(([k, v]) => [k, { ...v, kislina: true }])), ...Object.fromEntries(["MgSO4", "ZnSO4", "FeSO4", "CuSO4", "AgNO3"].map((k) => [k, { ...SOLI[k], konc: k === "AgNO3" ? [0.05, 0.1] : [0.1, 0.5] }])) };
// Toplotna kapaciteta: raztopina (c vode) in polovica stekla erlenmajerice (75 g, c = 0,84 J/(g K), ocena), izgube 0,08 W/K (ocena).
// Pena (ocena, kot pri lab-co2): nastaja s 1,2 mL na mL plina in razpade s τ = 3 s; čez rob gre, ko tekočina in pena presežeta 130 mL.
// Plinska brizga 100 mL z razdelki po 1 mL: odčitek na 0,5 mL, napaka ±0,5 mL (ocena); bat izpade pri ~110 mL.
// Tehtnica 0,01 g, ±0,01 g (ocena). Plin v brizgi: zrak v bučki se pri segrevanju razteza in tudi potisne bat (realen pojav).
export const POSODA_K = { V: 50, Vbucka: 130, Cst: 0.5 * 75 * 0.84, G: 0.08, pena: 1.2, tauPena: 3, brizga: 100, izpade: 110 };

export class KovineBench {
  constructor({ seed = 1, T, p } = {}) {
    const r = (this.r = rng(seed));
    const L = laboratorij(r);
    this.lab = { T: T ?? L.T, p: p ?? L.p };
    this.ocala = false;
    this.brizga = true;
    this.mesaj = false;
    this.thermo = makeThermo(r);
    this.brizgaKal = clamp(gauss(r, 0.2, 2.5), -0.4, 0.4);
    this.reset();
  }
  reset() {
    this.tek = null; // { id, c, V (mL), h (mol/L), ioni: { ion: mol }, s (sulfat mol/L) }
    this.kos = null; // { kovina, oblika, m0, m }
    this.T = this.lab.T;
    this.t = 0;
    this.nH2 = 0; // nastali vodik (mol)
    this.nIzgubljen = 0;
    this.dep = {}; // ion → izločena kovina (mol)
    this.pena = 0;
    this.prelito = false;
    this.batIzpadel = false;
    this.rateH2 = 0; // mol/s
    this.rateDep = 0;
    this.nZrak = 0;
    this.dim = false;
  }
  nalij(id, c) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    const R = RAZTOPINE_K[id];
    this.reset();
    this.tek = { id, c, V: POSODA_K.V, ioni: {} };
    if (!R.kislina) this.tek.ioni[R.ion] = (c * POSODA_K.V) / 1000;
    if (id === "HCl") this.tek.nH = (c * POSODA_K.V) / 1000;
    if (id === "H2SO4") this.tek.s = c;
    this.dim = id === "HCl" && c >= 6;
    this._zrak();
    return { ok: true, dim: this.dim };
  }
  _zrak() {
    const Vh = (POSODA_K.Vbucka - POSODA_K.V) * 1e-6, pw = pNas(this.lab.T);
    this.nZrak = this.brizga ? ((this.lab.p - pw) * Vh) / (R_PLIN * (this.lab.T + K0)) : 0;
  }
  dodaj(kovina, oblika, m) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    if (!this.tek) return { ok: false, why: "tekocina" };
    if (this.kos) return { ok: false, why: "ze" };
    this.kos = { kovina, oblika, m0: m, m };
    this.t = 0;
    return { ok: true };
  }
  // Kovino vzameš ven (prevleka ostane na njej), splakneš in osušiš.
  odstrani() {
    const k = this.kos;
    this.kos = null;
    return k;
  }
  // Koncentracija H⁺ (mol/L).
  h() {
    const t = this.tek;
    if (!t) return 0;
    const V = t.V / 1000;
    if (t.id === "HCl") return Math.max(1e-7, t.nH / V);
    if (t.id === "H2SO4") return hH2SO4(t.s, Object.values(t.ioni).reduce((s, n) => s + n, 0) / V);
    return 10 ** -SOLI[t.id].pH;
  }
  povrsina() {
    const k = this.kos;
    if (!k || k.m <= 0) return 0;
    const K = KOVINE[k.kovina], O = OBLIKE[k.oblika];
    return O.a(K) * k.m0 * (k.m / k.m0) ** O.p;
  }
  step(dt) {
    let left = dt;
    while (left > 1e-9) {
      const hstep = Math.min(0.2, left);
      this._step(hstep);
      left -= hstep;
    }
  }
  _step(dt) {
    const t = this.tek, k = this.kos;
    this.rateH2 = 0;
    this.rateDep = 0;
    if (t && k && k.m > 1e-7) {
      const K = KOVINE[k.kovina], A = this.povrsina(), V = t.V / 1000;
      const arr = Math.exp((-KINETIKA.Ea / R_PLIN) * (1 / (this.T + K0) - 1 / (293.15)));
      const h = this.h();
      let rH = (KINETIKA.k[k.kovina] ?? 0) * A * h * arr;
      if (k.kovina === "Mg") rH += KINETIKA.kVoda * A * arr;
      // izpodrivanje: ioni manj reaktivne kovine v raztopini
      let rD = 0, dH = 0, ionD = null;
      const R = RAZTOPINE_K[t.id];
      if (!R.kislina) {
        ionD = R.ion;
        if (reagiraS(k.kovina, ionD)) {
          const c = (t.ioni[ionD] ?? 0) / V; // mol/L
          const dE = KOVINE[ionD].E0 - K.E0;
          rD = (SOLI[t.id].D * (c / 1000)) / (this.mesaj ? IZPODRIVANJE.deltaMes : IZPODRIVANJE.delta) * A * Math.min(1, (dE / 0.8) ** 3); // mol iona/s
        }
      }
      // časovni korak omeji, da kovine ali ionov ne zmanjka v enem koraku
      const metalRate = rH + (ionD ? (rD * KOVINE[ionD].z) / K.z : 0); // mol kovine/s
      const nMetal = k.m / K.M;
      let s = 1;
      if (metalRate * dt > nMetal) s = nMetal / (metalRate * dt);
      if (ionD && rD * dt * s > (t.ioni[ionD] ?? 0)) s = Math.min(s, (t.ioni[ionD] ?? 0) / (rD * dt));
      if (t.id === "HCl" && 2 * rH * dt * s > t.nH) s = Math.min(s, t.nH / (2 * rH * dt));
      rH *= s;
      rD *= s;
      const dn = rH * dt, dd = rD * dt, dm = (dn + (ionD ? (dd * KOVINE[ionD].z) / K.z : 0)) * K.M;
      k.m = Math.max(0, k.m - dm);
      this.nH2 += dn;
      if (t.id === "HCl") t.nH -= 2 * dn;
      t.ioni[k.kovina] = (t.ioni[k.kovina] ?? 0) + dm / K.M;
      if (ionD && dd) {
        t.ioni[ionD] -= dd;
        this.dep[ionD] = (this.dep[ionD] ?? 0) + dd;
        dH += (dd * KOVINE[ionD].z) / K.z * -(K.dHf - (K.z / KOVINE[ionD].z) * KOVINE[ionD].dHf) * 1000;
      }
      dH += dn * -K.dHf * 1000; // M + 2H⁺ → M²⁺ + H₂, ΔH = ΔfH(M²⁺)
      this.rateH2 = rH;
      this.rateDep = rD;
      this.T += (dH - POSODA_K.G * (this.T - this.lab.T) * dt) / (t.V * VODA.c / 1000 + POSODA_K.Cst); // V mL ≈ g
    } else if (t) {
      this.T += (-POSODA_K.G * (this.T - this.lab.T) * dt) / (t.V * VODA.c / 1000 + POSODA_K.Cst);
    }
    // pena
    const vRate = this.rateH2 * prostorninaPlina(1, this.T, this.lab.p) * 1e6; // mL/s
    this.pena += dt * (POSODA_K.pena * vRate - this.pena / POSODA_K.tauPena);
    if (t && t.V + this.pena > POSODA_K.Vbucka && !this.prelito) this.prelito = true;
    if (this.brizga && !this.batIzpadel && this.Vbrizga() > POSODA_K.izpade) {
      this.batIzpadel = true;
    }
    if (this.batIzpadel || !this.brizga) this.nIzgubljen = this.nH2;
    this.t += dt;
    thermoStep(this.thermo, this.T, dt);
  }
  // Prostornina plina v brizgi (mL): zrak in vodik v bučki in brizgi pri temperaturi raztopine (plin nad njo), nasičen z vodno paro.
  Vbrizga() {
    if (!this.brizga || !this.tek) return 0;
    if (this.batIzpadel) return 0;
    const pw = pNas(this.T), n = this.nZrak + this.nH2 - this.nIzgubljen;
    const V = prostorninaPlina(n, this.T, this.lab.p - pw) * 1e6 - (POSODA_K.Vbucka - this.tek.V);
    return Math.max(0, V);
  }
  odcitekBrizge() {
    if (this.batIzpadel) return { text: "bat je izpadel", value: NaN };
    const V = this.Vbrizga();
    if (V > POSODA_K.brizga) return { text: "> 100", value: NaN, cez: true };
    const v = Math.max(0, Math.round((V + this.brizgaKal + clamp(gauss(this.r, 0.12, 2.5), -0.3, 0.3)) * 2) / 2);
    return { text: v.toFixed(1), value: v };
  }
  // mL/s nastajanja vodika
  hitrostPlina() {
    return this.rateH2 * prostorninaPlina(1, this.T, this.lab.p) * 1e6;
  }
  // Mehurčki: 0 ni, 1 posamezni, 2 zmerno, 3 živahno, 4 burno.
  mehurcki() {
    const v = this.hitrostPlina();
    return v < 0.002 ? 0 : v < 0.03 ? 1 : v < 0.3 ? 2 : v < 3 ? 3 : 4;
  }
  // Pokritost kovine s prevleko izločene kovine (0–1).
  prevleka() {
    const A = this.kos ? OBLIKE[this.kos.oblika].a(KOVINE[this.kos.kovina]) * this.kos.m0 : 1;
    const n = Object.values(this.dep).reduce((s, x) => s + x, 0);
    return 1 - Math.exp(-n / (A * IZPODRIVANJE.vidno));
  }
  barva() {
    const t = this.tek;
    if (!t) return null;
    const V = t.V / 1000, c = {};
    for (const [ion, n] of Object.entries(t.ioni)) c[ion] = n / V;
    return barvaRaztopine(c, 4);
  }
  readT() {
    return thermoRead(this.thermo);
  }
  // Tehtnica 0,01 g (±0,01 g, ocena).
  tehtaj(m) {
    return Math.max(0, Math.round((m + clamp(gauss(this.r, 0.004, 2.5), -0.01, 0.01)) * 100) / 100);
  }
  reakcija() {
    const t = this.tek, k = this.kos;
    if (!t || !k) return null;
    const R = RAZTOPINE_K[t.id];
    return R.kislina ? KINETIKA.k[k.kovina] > 0 : reagiraS(k.kovina, R.ion);
  }
}
// Vrsta reaktivnosti iz standardnih potencialov (od najbolj do najmanj reaktivne).
export const VRSTA = ["Mg", "Zn", "Fe", "Cu", "Ag"];

export { meterSpec };

export const POENOSTAVITVE_ELEKTROKEMIJA = {
  elektroliza: [
    "Tok skozi tekočino je izračunan iz prevodnosti raztopine in oblike aparata; prenapetosti na elektrodah so ocenjene po podatkih za platino in grafit.",
    "Vsak elektron, ki steče skozi krog, sodeluje pri nastanku plina (Faradayev zakon); del plina se raztopi v tekočini ob elektrodi.",
    "Tekočina v vsakem kraku je dobro premešana, med krakoma se ne meša; v resnici ioni in plini počasi potujejo tudi v sosednji krak.",
    "Plin upoštevamo kot idealni plin, nasičen z vodno paro; tlak v cevi je zračni tlak plus tlak stolpca tekočine do gladine v bučki.",
    "Prevodnost raztopin in topnost plinov sta vzeti pri 20–25 °C; s temperaturo se prevodnost spreminja za 2 % na stopinjo.",
  ],
  galvanski: [
    "V Nernstovi enačbi računamo s koncentracijami namesto z aktivnostmi; v resnici se pri 1 mol/L razlikujejo za več deset odstotkov, a se v razliki potencialov večinoma odštejejo.",
    "Standardni potenciali veljajo pri 25 °C; pri drugi temperaturi popravimo le Nernstov faktor RT/zF.",
    "Magnezij ima v vodi oksidno plast in hkrati korodira, zato izmerimo mešani potencial (ocena −1,55 V), ne standardnega.",
    "Notranji upor člena (solni most in raztopini) je ocenjen; elektrode se pod obremenitvijo ne polarizirajo dodatno.",
  ],
  kovine: [
    "Hitrosti reakcij kovin s kislino so ocenjene po šolskih meritvah; hitrost je sorazmerna s površino kovine in koncentracijo ionov H⁺.",
    "Pri izpodrivanju ione dovaja difuzija; debelina mejne plasti in vidnost prevleke sta ocenjeni.",
    "Raztopina je ves čas enako topla; toplota reakcije se porazdeli po raztopini in delu stekla.",
    "Železov(II) sulfat na zraku počasi porumeni (Fe²⁺ → Fe³⁺); tega tu ne upoštevamo.",
  ],
};
