// Virtualni laboratorij, toplota: grelec in izkoristek (lab-grelnik), mešanje vode (lab-mesanje),
// taljenje in vrenje (lab-faze), ohlajanje čaja (lab-ohlajanje). Brez DOM (testi: test/laboratorij-toplota.test.js).
// Vsaka številka ima vir ali je označena kot ocena. Temperature so v °C, mase v kg, energije v J, čas v s.
import { rng, gauss, makeMeter, meterRead, AM_RANGES, VM_RANGES, P_ATM, R_PLIN } from "./lab-model.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerpTab = (tab, x) => {
  if (x <= tab[0][0]) return tab[0][1];
  for (let i = 1; i < tab.length; i++)
    if (x <= tab[i][0]) {
      const [x0, y0] = tab[i - 1], [x1, y1] = tab[i];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  return tab[tab.length - 1][1];
};

// ------------------------------------------------------------------ snovi
// Voda: c = 4182 J/(kg·K) pri 20 °C (IAPWS-95; CRC Handbook 4,1818 kJ/(kg·K)); med 0 in 100 °C se spremeni
// za manj kot 1 % (4217 pri 0 °C, 4216 pri 100 °C), zato je stalna. ρ = 998,2 kg/m³ pri 20 °C (CRC).
export const VODA = { c: 4182, rho: 998.2 };
// Led: c = 2100 J/(kg·K) pri okoli −10 °C (CRC: 2,05–2,11 kJ/(kg·K)); talilna toplota 334 kJ/kg
// (CRC: 6,01 kJ/mol / 18,015 g/mol = 333,6 kJ/kg; šolske tabele 334 kJ/kg).
export const LED = { c: 2100, Lt: 334e3 };
// Izparilna toplota pri 100 °C 2257 kJ/kg (CRC: 40,65 kJ/mol), pri 20 °C 2454 kJ/kg (IAPWS); vmes linearno.
export const L_IZP = 2257e3;
export const Lizp = (T) => L_IZP + 2462 * (100 - T);
// NaCl: c = 864 J/(kg·K) (CRC), M = 58,44 g/mol (IUPAC).
export const SOL = { c: 864, M: 0.05844 };
// Sobna temperatura in vlažnost v učilnici (ocena); voda iz pipe, ki je nekaj časa stala (ocena).
export const T_SOBA = 20;
export const VLAGA = 0.5;
export const T_PIPA = 18;
const SIGMA = 5.670374e-8; // W/(m²·K⁴), CODATA 2018

// ------------------------------------------------------------------ nasičeni parni tlak in vrelišče
// Antoinova enačba za vodo, 1–100 °C (Dortmund Data Bank; A = 8,07131, B = 1730,63, C = 233,426, tlak v mmHg).
// Pri 760 mmHg da 99,99 °C, pri 96 kPa 98,50 °C (parne tabele IAPWS-IF97: 98,49 °C).
const ANT = { A: 8.07131, B: 1730.63, C: 233.426, mmHg: 133.322 };
export const pNas = (T) => ANT.mmHg * 10 ** (ANT.A - ANT.B / (ANT.C + T)); // Pa
export const vrelisce = (p) => ANT.B / (ANT.A - Math.log10(p / ANT.mmHg)) - ANT.C; // °C
// Zračni tlak na nadmorski višini po standardni atmosferi (ISA, ICAO Doc 7488): p = p₀ (1 − 2,25577 · 10⁻⁵ h)^5,25588.
// Dejanski tlak se z vremenom spreminja za ±2 kPa (to je ±0,6 °C pri vrelišču).
export const tlakNaVisini = (h) => P_ATM * (1 - 2.25577e-5 * h) ** 5.25588;
export const KRAJI = {
  morje: { name: "ob morju (0 m)", h: 0 },
  ljubljana: { name: "Ljubljana (295 m)", h: 295 },
  rogla: { name: "Rogla (1517 m)", h: 1517 },
  kredarica: { name: "Kredarica (2515 m)", h: 2515 },
};
// Gostota nasičene vodne pare (idealni plin) v kg/m³.
const rhoPara = (T) => (pNas(T) * 0.018015) / (R_PLIN * (T + 273.15));

// Tališče raztopine NaCl v odvisnosti od masnega deleža soli (CRC Handbook, Concentrative properties of aqueous
// solutions: NaCl 1 % −0,59 °C, 2 % −1,19, 5 % −3,05, 10 % −6,56, 15 % −10,89, 20 % −16,46; evtektik 23,3 % pri −21,1 °C).
export const TALISCE_NACL = [[0, 0], [0.01, -0.59], [0.02, -1.19], [0.05, -3.05], [0.1, -6.56], [0.15, -10.89], [0.2, -16.46], [0.233, -21.1]];
export const T_EVTEKTIK = -21.1;
export const talisceSoli = (w) => (w <= 0 ? 0 : w >= 0.233 ? T_EVTEKTIK : lerpTab(TALISCE_NACL, w));
// Zvišanje vrelišča: ΔT = K_b · i · φ · b, K_b = 0,512 K·kg/mol (CRC), i = 2, osmozni koeficient φ ≈ 0,93 (Robinson in Stokes).
// Ko voda izpareva, raztopina postane nasičena (topnost NaCl pri 100 °C 39,1 g na 100 g vode, CRC); več soli se izloči.
export const SOL_NASICENA = 0.391;
export const zvisanjeVrelisca = (sol, voda) => (voda > 0 ? 0.512 * 2 * 0.93 * (Math.min(sol, SOL_NASICENA * voda) / SOL.M / voda) : 0);

// ------------------------------------------------------------------ prenos toplote
// Zunanja stena: naravna konvekcija ~4,5 W/(m²·K) (ocena za majhno pokončno steno pri ΔT 10–60 K, Churchill–Chu)
// in sevanje h_s = 4 ε σ T³ (ε stekla, porcelana in emajla ~0,9, vode 0,96). Notranja stran: voda ob steni ~250 W/(m²·K)
// (ocena, naravna konvekcija v vodi). Dno na mizi: 3 W/(m²·K) (ocena; pod dnom miruje zrak, les slabo prevaja).
// Izhlapevanje z odprte gladine: h_m = h_k / (ρ c_p) · Le^(−2/3) (Chilton–Colburn, Le = 0,85), gostota nasičene pare iz
// Antoinove enačbe; zrak ima relativno vlago 50 % (ocena). Gladina: konvekcija 6 W/(m²·K) (ocena, topla ploskev navzgor).
export const PRENOS = { hKonv: 4.5, hNotri: 250, hDno: 3, hGladina: 6, Le: 0.85, rhoCpZrak: 1206 };
const hZunaj = (T, eps, Tr = T_SOBA) => PRENOS.hKonv + 4 * eps * SIGMA * ((T + Tr) / 2 + 273.15) ** 3;
const zaporedno = (...g) => 1 / g.reduce((s, x) => s + 1 / x, 0);

// Posode. m: masa posode, c: specifična toplota, d: notranji premer, k in t: toplotna prevodnost in debelina stene,
// eps: emisivnost zunanje površine. Gout: izmerjena skupna prevodnost (termovka), pokrov: { k, t } ali { G }.
// Viri: borosilikatno steklo c = 830 J/(kg·K) pri 20 °C, ~900 pri 100 °C (vzamemo 840), k = 1,14 W/(m·K) (Schott Duran); porcelan c ≈ 1085 J/(kg·K), k ≈ 1,5 W/(m·K)
// (Engineering Toolbox); jeklo c = 470–500 J/(kg·K), k = 16–50 W/(m·K) (CRC); stiropor (EPS) c ≈ 1300 J/(kg·K),
// k = 0,035 W/(m·K) (EN 13163). Mase, premeri in debeline so ocene za običajne šolske in domače posode.
export const POSODE = {
  casa400: { name: "steklena čaša 400 mL", m: 0.11, c: 840, d: 0.076, k: 1.14, t: 0.0018, eps: 0.9, pokrov: { k: 1.14, t: 0.002 }, Vmax: 0.4 },
  casa600: { name: "steklena čaša 600 mL", m: 0.17, c: 840, d: 0.09, k: 1.14, t: 0.002, eps: 0.9, pokrov: { k: 1.14, t: 0.002 }, Vmax: 0.6 },
  stiropor: { name: "lonček iz stiropora", m: 0.004, c: 1300, d: 0.075, k: 0.035, t: 0.0025, eps: 0.9, pokrov: { k: 0.035, t: 0.002 }, Vmax: 0.35 },
  porcelan: { name: "porcelanska skodelica", m: 0.28, c: 1085, d: 0.08, k: 1.5, t: 0.004, eps: 0.9, pokrov: { k: 1.5, t: 0.004 }, Vmax: 0.3 },
  kovina: { name: "emajliran kovinski lonček", m: 0.15, c: 480, d: 0.08, k: 30, t: 0.001, eps: 0.9, pokrov: { k: 30, t: 0.001 }, Vmax: 0.3 },
  // Termovka: kakovostna termovka 0,35 L izgubi ~10 K v 6 urah pri 90 °C (ocena iz navodil proizvajalcev),
  // torej G ≈ 0,01 W/K skupaj z zamaškom: 0,006 W/K stene in dno, 0,004 W/K zamašek. Notranja stena je jeklena.
  termovka: { name: "termovka", m: 0.12, c: 480, d: 0.065, Gout: 0.006, eps: 0.1, pokrov: { G: 0.004 }, Vmax: 0.35 },
};

// Geometrija vode v valjasti posodi: višina, ploščina dna in omočenega plašča.
export function geometrija(P, m) {
  const Ab = (Math.PI * P.d * P.d) / 4;
  const H = m / (VODA.rho * Ab);
  return { H, Ab, As: Math.PI * P.d * H };
}
// Prevodnosti voda → posoda (Gin) in posoda → soba (Gout) v W/K. naKuhalniku: dno ne oddaja v sobo.
export function prevodnosti(P, m, Tv = T_SOBA, { naKuhalniku = false } = {}) {
  const { Ab, As } = geometrija(P, m);
  const A = Ab + As;
  if (P.Gout != null) return { Gin: PRENOS.hNotri * A, Gout: P.Gout };
  const pol = P.t / (2 * P.k); // pol stene na vsaki strani »vozlišča« posode
  const Gin = zaporedno(PRENOS.hNotri * A, A / pol);
  const Gout = zaporedno(As / pol, hZunaj(Tv, P.eps) * As) + (naKuhalniku ? 0 : zaporedno(Ab / pol, PRENOS.hDno * Ab));
  return { Gin, Gout };
}
// Izgube skozi vrh: odprta gladina (konvekcija, sevanje, izhlapevanje) ali pokrov. Vrne { P (W), dm (kg/s) }.
export function izgubeVrh(P, T, pokrov, Tr = T_SOBA) {
  const A = (Math.PI * P.d * P.d) / 4;
  if (pokrov) {
    const L = P.pokrov;
    const G = L.G ?? zaporedno((L.k * A) / L.t, hZunaj(T, P.eps) * A);
    return { P: G * (T - Tr), dm: 0 };
  }
  const hm = (PRENOS.hGladina / PRENOS.rhoCpZrak) * PRENOS.Le ** (-2 / 3);
  const dm = hm * A * (rhoPara(Math.min(T, 100)) - VLAGA * rhoPara(Tr)); // kg/s (negativno: rosenje na hladno vodo)
  const h = PRENOS.hGladina + 4 * 0.96 * SIGMA * ((T + Tr) / 2 + 273.15) ** 3;
  return { P: h * A * (T - Tr) + dm * Lizp(T), dm };
}

// ------------------------------------------------------------------ merilniki
// Digitalni termometer s kovinsko sondo: ločljivost 0,1 °C, natančnost ±0,5 °C med −20 in 120 °C (razred šolskih
// termometrov, npr. Voltcraft DET3R, TFA 30.1018); odzivni čas sonde v vodi ~4 s (ocena, časovna konstanta).
// Napaka: stalni zamik do ±0,25 °C, naklon do ±0,1 % (pri 120 °C 0,12 °C), nihanje zadnjega mesta do ±0,06 °C, zaokrožanje 0,05 °C:
// skupaj ≤ 0,48 °C, torej v mejah ±0,5 °C v vsem območju.
export const TERMOMETER = { tol: 0.5, dec: 1, tau: 4, off: 0.25, gain: 0.001, jit: 0.06, Tmin: -20, Tmax: 120 };
export function makeThermo(r) {
  const T = TERMOMETER;
  return { off: clamp(gauss(r, 0.1, 2.5), -T.off, T.off), gain: clamp(gauss(r, 0.0004, 2.5), -T.gain, T.gain), r, Tp: null };
}
export function thermoStep(th, T, dt) {
  th.Tp = th.Tp == null ? T : th.Tp + (T - th.Tp) * (1 - Math.exp(-dt / TERMOMETER.tau));
}
export function thermoRead(th) {
  if (th.Tp == null) return { text: "–", value: NaN };
  const jit = clamp(gauss(th.r, 0.025, 2.4), -TERMOMETER.jit, TERMOMETER.jit);
  const v = Math.round((th.Tp * (1 + th.gain) + th.off + jit) * 10) / 10;
  return { text: v.toFixed(1), value: v };
}
// Šolska elektronska tehtnica do 600 g: ločljivost 0,1 g, linearnost ±0,2 g (razred tehtnic kot Kern EMB 600-1, ocena).
// Stalni zamik do ±0,08 g, naklon do ±0,01 %, zaokrožanje 0,05 g: skupaj ≤ 0,2 g. Posodo prej tariramo.
export const TEHTNICA = { tol: 0.2, dec: 1, max: 600 };
export function makeTehtnica(r) {
  return { off: clamp(gauss(r, 0.03, 2.7), -0.08, 0.08), gain: clamp(gauss(r, 4e-5, 2.5), -1e-4, 1e-4) };
}
export function tehtnicaRead(t, gram) {
  if (gram > TEHTNICA.max) return { text: "OL", value: NaN };
  const v = Math.round((gram * (1 + t.gain) + t.off) * 10) / 10;
  return { text: v.toFixed(1), value: v };
}

// ------------------------------------------------------------------ voda v posodi (dve vozlišči: voda in posoda)
// step(dt, Pin): Pin je toplotni tok v vodo (W). Pri vrelišču se voda ne segreje več, ampak izpareva.
// idealno: brez posode in brez izgub (za primerjavo z enačbo Q = m c ΔT).
export class Voda {
  constructor(posoda, { m, T, Tv = T_SOBA, pokrov = false, idealno = false, p = P_ATM, naKuhalniku = false }) {
    Object.assign(this, { P: posoda, m, T, Tv, pokrov, idealno, p, naKuhalniku, izparelo: 0, vre: false });
  }
  get Cv() {
    return this.idealno ? 0 : this.P.m * this.P.c;
  }
  get Tb() {
    return vrelisce(this.p);
  }
  step(dt, Pin = 0) {
    const C = this.m * VODA.c;
    if (this.idealno) {
      this.T += (Pin * dt) / C;
    } else {
      const { Gin, Gout } = prevodnosti(this.P, this.m, this.Tv, this);
      const top = izgubeVrh(this.P, this.T, this.pokrov);
      const Pv = Gin * (this.T - this.Tv);
      this.T += ((Pin - Pv - top.P) * dt) / C;
      this.Tv += ((Pv - Gout * (this.Tv - T_SOBA)) * dt) / this.Cv;
      this.m -= top.dm * dt;
      this.izparelo += top.dm * dt;
    }
    this.vre = false;
    if (this.T > this.Tb) {
      const dm = ((this.T - this.Tb) * this.m * VODA.c) / Lizp(this.Tb);
      this.m -= dm;
      this.izparelo += dm;
      this.T = this.Tb;
      this.vre = true;
    }
  }
}
// Integracija v korakih po 0,2 s (eksplicitna Eulerjeva metoda; najkrajša časovna konstanta je ~5 s).
const KORAK = 0.2;
const steps = (dt, fn) => {
  for (let n = Math.max(1, Math.ceil(dt / KORAK)), i = 0; i < n; i++) fn(dt / n);
};

// ------------------------------------------------------------------ grelec in izkoristek (lab-grelnik)
// Potopni grelec 12 V / 50 W: R = U²/P = 2,88 Ω (toleranca ±5 %, ocena); upor žice iz kantala se s temperaturo skoraj
// ne spreminja (α ≈ 2 · 10⁻⁵ /K), zato je stalen. Ohišje grelca: toplotna kapaciteta 10 J/K (~20 g jekla, ocena),
// prevodnost v vodo 2,0 W/K (~700 W/(m²·K) na ~30 cm², ocena), v zrak 0,1 W/K (konvekcija in sevanje, ocena).
// Grelna žica je od ohišja oddaljena 2,5 K/W (ocena): pri 50 W je ~125 K toplejša od ohišja.
// Termična varovalka v ohišju prekine pri 250 °C (ocena) in se ne povrne; žica pregori nad 650 °C (ocena).
// Grelna spirala je med 0,5 in 3 cm nad dnom; če je voda nižja, je del grelca v zraku.
export const GRELEC = { Un: 12, Pn: 50, tol: 0.05, C: 10, Gw: 2.0, Ga: 0.1, Rnotri: 2.5, Tvar: 250, Tzica: 650, z0: 0.005, z1: 0.03 };
export const R_GRELEC = (GRELEC.Un * GRELEC.Un) / GRELEC.Pn;
// Laboratorijski napajalnik 0–30 V z nastavljivo omejitvijo toka 0,5–10 A (razred napajalnikov 30 V / 10 A, ocena);
// vodniki in sponke 0,04 Ω (ocena), ampermeter na območju 10 A 0,01 Ω (lab-model.js).
export const NAPAJALNIK_T = { max: 30, imin: 0.5, imax: 10 };
export const R_VODI = 0.04;
// Brez mešanja se voda razplasti: termometer ob strani v spodnji polovici kaže manj od povprečja,
// razlika teži k 0,06 K/W · P (ocena: pri 50 W ~3 K) s časovno konstanto 120 s; z mešanjem izgine v ~4 s.
export const PLASTI = { k: 0.06, tau: 120, tauMes: 4 };

export class GrelnikBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.R = idealno ? R_GRELEC : R_GRELEC * (1 + clamp(gauss(r, GRELEC.tol / 2.2, 2.2), -GRELEC.tol, GRELEC.tol));
    this.vm = makeMeter(r);
    this.am = makeMeter(r);
    this.th = makeThermo(r);
    this.teh = makeTehtnica(r);
    this.U0 = 12;
    this.Ilim = 5;
    this.on = false;
    this.potopljen = true;
    this.mesaj = false;
    this.pokvarjen = null; // "varovalka" | "zica"
    this.t = 0; // štoparica: teče od prvega vklopa
    this.tOn = 0; // čas, ko je bil grelec vklopljen
    this.E = 0; // električno delo na grelcu (prava vrednost)
    this.tekla = false;
    this.events = [];
    this.said = new Set();
    this.nalij(200);
  }
  // Učenec natoči približno izbrano maso (±2 %, ocena), tehtnica pokaže pravo.
  nalij(gram) {
    const m = this.idealno ? gram / 1000 : (gram / 1000) * (1 + clamp(gauss(this.r, 0.01, 2), -0.02, 0.02));
    this.voda = new Voda(POSODE.casa400, { m, T: T_PIPA, Tv: T_SOBA, idealno: this.idealno });
    this.Tel = this.potopljen ? T_PIPA : T_SOBA;
    this.plasti = 0;
    this.th.Tp = null;
    this.t = this.tOn = this.E = 0;
    this.tekla = false;
    this.said.clear();
  }
  set pokrov(v) {
    this.voda.pokrov = v;
  }
  get pokrov() {
    return this.voda.pokrov;
  }
  get Rtot() {
    return this.R + R_VODI + AM_RANGES["10"].rsh;
  }
  // Delež grelne spirale pod vodo.
  get potopljenDel() {
    if (!this.potopljen) return 0;
    return clamp((geometrija(POSODE.casa400, this.voda.m).H - GRELEC.z0) / (GRELEC.z1 - GRELEC.z0), 0, 1);
  }
  get state() {
    if (!this.on) return { I: 0, Uh: 0, P: 0, cc: false, Uout: 0 };
    if (this.pokvarjen) return { I: 0, Uh: this.U0, P: 0, cc: false, Uout: this.U0 };
    let I = this.U0 / this.Rtot, cc = false;
    if (I > this.Ilim) (I = this.Ilim), (cc = true);
    return { I, Uh: I * this.R, P: I * I * this.R, cc, Uout: I * this.Rtot };
  }
  ev(type, x = {}) {
    this.events.push({ type, t: this.t, ...x });
  }
  once(type, x) {
    if (!this.said.has(type)) this.said.add(type), this.ev(type, x);
  }
  step(dt) {
    steps(dt, (d) => this.sub(d));
  }
  sub(dt) {
    const st = this.state, w = this.voda;
    if (this.on) this.tekla = true;
    if (this.tekla) this.t += dt;
    if (this.on) (this.tOn += dt), (this.E += st.P * dt);
    let Pw;
    if (this.idealno) Pw = st.P;
    else {
      const f = this.potopljenDel;
      const Gw = GRELEC.Gw * f, Ga = GRELEC.Ga * (1 - f);
      Pw = Gw * (this.Tel - w.T);
      this.Tel += ((st.P - Pw - Ga * (this.Tel - T_SOBA)) * dt) / GRELEC.C;
      const Tz = this.Tel + st.P * GRELEC.Rnotri;
      if (this.on && !this.pokvarjen) {
        if (f < 0.999) this.once(f === 0 ? "suh" : "plitvo");
        if (st.Uh > GRELEC.Un * 1.05) this.once("prenapetost", { U: st.Uh });
        if (this.Tel > 120 && f < 1) this.once("vroc", { T: this.Tel });
        if (Tz > GRELEC.Tzica) (this.pokvarjen = "zica"), this.ev("zica", { P: st.P });
        else if (this.Tel > GRELEC.Tvar) (this.pokvarjen = "varovalka"), this.ev("varovalka", { T: this.Tel });
      }
    }
    w.step(dt, Pw);
    if (w.vre) this.once("vre");
    const target = this.mesaj || this.idealno ? 0 : PLASTI.k * Math.max(0, Pw);
    this.plasti += (target - this.plasti) * (1 - Math.exp(-dt / (this.mesaj ? PLASTI.tauMes : PLASTI.tau)));
    thermoStep(this.th, w.T - this.plasti, dt);
  }
  // Grelec je pokvarjen: nov grelec z novim uporom (±5 %).
  zamenjajGrelec() {
    this.pokvarjen = null;
    this.R = R_GRELEC * (1 + clamp(gauss(this.r, GRELEC.tol / 2.2, 2.2), -GRELEC.tol, GRELEC.tol));
    this.Tel = this.potopljen ? this.voda.T : T_SOBA;
    this.said.delete("vroc"), this.said.delete("suh"), this.said.delete("plitvo"), this.said.delete("prenapetost");
  }
  // Odčitki: multimeter s samodejnim območjem (20 V ali 200 V), ampermeter na 10 A.
  readV() {
    const U = this.state.Uh;
    return meterRead(this.vm, U, VM_RANGES[U < 19.99 ? "20" : "200"], "V");
  }
  readA() {
    return meterRead(this.am, this.state.I, AM_RANGES["10"], "A");
  }
  readT() {
    return thermoRead(this.th);
  }
  readM() {
    return tehtnicaRead(this.teh, this.voda.m * 1000);
  }
}

// Izkoristek iz učenčevih podatkov: Q = m c ΔT, W = U I t, η = Q / W.
export function izkoristek({ m, T1, T2, U, I, t }) {
  const Q = m * VODA.c * (T2 - T1), W = U * I * t;
  return { Q, W, eta: W > 0 ? Q / W : NaN };
}

// ------------------------------------------------------------------ mešanje tople in hladne vode (lab-mesanje)
// Natakanje do oznake brez tehtanja: masa odstopa do ±5 % (ocena). Ko toplo vodo zliješ v hladno, se zmeša le
// deloma: topla ostane zgoraj, termometer pri dnu kaže manj; razlika je sprva 60 % razlike med zmesjo in hladno vodo
// (ocena) in brez mešanja izginja s časovno konstanto 150 s, z mešanjem v ~3 s (ocena).
// Med natakanjem se topla voda ohladi za ~0,3 K (ocena).
export const MESANJE = { natakanje: 0.05, plasti: 0.6, tau: 150, tauMes: 3, padec: 0.3 };
export const T_IDEALNA = (m1, T1, m2, T2) => (m1 * T1 + m2 * T2) / (m1 + m2);

export class MesanjeBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.th = makeThermo(r);
    this.teh = makeTehtnica(r);
    this.posoda = "stiropor";
    this.pokrov = true;
    this.faza = "prazno"; // prazno | hladna | zmes
    this.t = 0;
    this.mesaj = false;
    this.premesano = 0; // koliko sekund je bila zmes mešana
    this.events = [];
  }
  nalivek(gram) {
    return this.idealno ? gram / 1000 : (gram / 1000) * (1 + clamp(gauss(this.r, MESANJE.natakanje / 2.5, 2.5), -MESANJE.natakanje, MESANJE.natakanje));
  }
  // Hladno vodo natočiš v posodo, ki ima sobno temperaturo.
  nalijHladno(gram, T2) {
    const m = this.nalivek(gram);
    this.voda = new Voda(POSODE[this.posoda], { m, T: T2, Tv: this.idealno ? T2 : T_SOBA, pokrov: this.pokrov, idealno: this.idealno });
    this.m2 = m;
    this.faza = "hladna";
    this.t = 0;
    this.plasti = 0;
    this.premesano = 0;
    this.th.Tp = null;
    return m;
  }
  // Toplo vodo z izmerjeno temperaturo T1 zliješ v posodo. Vrne { m1, T1 odčitek, T2 odčitek tik pred mešanjem }.
  zlij(gram, T1) {
    const m1 = this.nalivek(gram), w = this.voda;
    const before = thermoRead(this.th).value;
    // ločeno odčitamo toplo vodo: sonda se v 30 s ustali
    const Tp = this.th.Tp;
    this.th.Tp = T1;
    const T1read = thermoRead(this.th).value;
    this.th.Tp = Tp;
    const T1in = this.idealno ? T1 : T1 - MESANJE.padec;
    const T2 = w.T;
    w.T = (m1 * T1in + w.m * T2) / (m1 + w.m);
    w.m += m1;
    this.m1 = m1;
    this.plasti = this.idealno ? 0 : MESANJE.plasti * (w.T - T2);
    this.faza = "zmes";
    this.t = 0;
    this.premesano = 0;
    return { m1, T1: T1read, T2: before };
  }
  step(dt) {
    if (this.faza === "prazno") return;
    steps(dt, (d) => {
      this.t += d;
      this.voda.pokrov = this.pokrov;
      this.voda.step(d, 0);
      if (this.mesaj && this.faza === "zmes") this.premesano += d;
      this.plasti *= Math.exp(-d / (this.mesaj ? MESANJE.tauMes : MESANJE.tau));
      thermoStep(this.th, this.voda.T - this.plasti, d);
    });
  }
  readT() {
    return thermoRead(this.th);
  }
  readM(kg) {
    return tehtnicaRead(this.teh, kg * 1000);
  }
}

// ------------------------------------------------------------------ taljenje in vrenje (lab-faze)
// Zdrobljen led iz zamrzovalnika (−15 °C, ocena: zamrzovalnik −18 °C, med drobljenjem se malo segreje) v čaši 600 mL
// na električnem kuhalniku. Kuhalnik ima ~1000 W, v vsebino čaše pa preide le del: stopnja 1/2/3 da 80/150/250 W
// (ocena), plošča se segreva in ohlaja s časovno konstanto 90 s oziroma 240 s (ocena).
// Termometer, ki se dotika dna, kaže več: steklo na plošči je toplejše od vode, ocena 0,06 K/W · P (pri 150 W ~9 K).
// Sol se raztaplja s časovno konstanto 40 s (ocena); toplota raztapljanja NaCl (+3,9 kJ/mol) je zanemarjena.
export const KUHALNIK = { moc: { 1: 80, 2: 150, 3: 250 }, tauOn: 90, tauOff: 240, dno: 0.06 };
export const LED_ZACETNA = -15;
export const TAU_SOL = 40;

export class FazeBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.th = makeThermo(r);
    this.stopnja = 2;
    this.kraj = "ljubljana";
    this.polozaj = "sredina"; // sredina | dno
    this.on = false;
    this.events = [];
    this.pripravi(150, 0);
  }
  pripravi(gramLed, gramSol) {
    this.W = gramLed / 1000; // vsa voda (led + tekočina)
    this.ml = 0; // tekoča voda
    this.sol = gramSol / 1000;
    this.S = 0; // raztopljena sol
    this.T = LED_ZACETNA;
    this.Tv = this.idealno ? LED_ZACETNA : T_SOBA;
    this.H = this.Hof(this.T, 0);
    this.Pk = 0;
    this.t = 0;
    this.tekla = false;
    this.izparelo = 0;
    this.th.Tp = null;
    this.said = new Set();
    this.on = false;
    this.stanje = "led";
  }
  get p() {
    return this.tlak ?? tlakNaVisini(KRAJI[this.kraj].h);
  }
  get Tb() {
    return vrelisce(this.p) + zvisanjeVrelisca(this.S, this.W);
  }
  get led() {
    return this.W - this.ml;
  }
  // Entalpija vsebine glede na led pri 0 °C.
  Hof(T, ml) {
    return (this.W - ml) * LED.c * T + ml * (LED.Lt + VODA.c * T) + this.sol * SOL.c * T;
  }
  Tf(ml) {
    return this.S > 0 ? talisceSoli(this.S / (this.S + ml)) : 0;
  }
  // Iz entalpije poišče temperaturo in maso tekoče vode (led in raztopina sta v ravnovesju na krivulji tališča).
  resi() {
    const H = this.H, W = this.W;
    const H0 = this.Hof(this.Tf(0), 0);
    if (H <= H0) return (this.ml = 0), (this.T = H / (W * LED.c + this.sol * SOL.c));
    const Tw = this.Tf(W), H1 = this.Hof(Tw, W);
    if (H >= H1) return (this.ml = W), (this.T = (H - W * LED.Lt) / (W * VODA.c + this.sol * SOL.c));
    let a = 0, b = W;
    for (let i = 0; i < 50; i++) {
      const m = (a + b) / 2;
      if (this.Hof(this.Tf(m), m) < H) a = m;
      else b = m;
    }
    this.ml = (a + b) / 2;
    this.T = this.Tf(this.ml);
  }
  once(type, x = {}) {
    if (!this.said.has(type)) this.said.add(type), this.events.push({ type, t: this.t, ...x });
  }
  step(dt) {
    steps(dt, (d) => this.sub(d));
  }
  sub(dt) {
    if (this.on) this.tekla = true;
    if (this.tekla) this.t += dt;
    const target = this.on ? KUHALNIK.moc[this.stopnja] : 0;
    if (this.idealno) this.Pk = target;
    else this.Pk += (target - this.Pk) * (1 - Math.exp(-dt / (target > this.Pk ? KUHALNIK.tauOn : KUHALNIK.tauOff)));
    this.S += (this.sol - this.S) * (1 - Math.exp(-dt / TAU_SOL));
    let Pin = this.Pk;
    if (!this.idealno) {
      const P = POSODE.casa600;
      const { Gin, Gout } = prevodnosti(P, this.W, this.Tv, { naKuhalniku: true });
      const Pv = Gin * (this.T - this.Tv);
      this.Tv += ((Pv - Gout * (this.Tv - T_SOBA)) * dt) / (P.m * P.c);
      Pin -= Pv;
      if (this.ml > 0.001) {
        const top = izgubeVrh(P, this.T, false);
        Pin -= top.P;
        const dm = Math.min(top.dm * dt, this.ml * 0.5);
        this.H -= dm * (LED.Lt + VODA.c * this.T);
        this.W -= dm, (this.ml -= dm), (this.izparelo += dm);
      } else Pin -= PRENOS.hGladina * ((Math.PI * P.d * P.d) / 4) * (this.T - T_SOBA);
    }
    this.H += Pin * dt;
    this.resi();
    if (this.ml >= this.W && this.T > this.Tb) {
      const C = this.W * VODA.c + this.sol * SOL.c;
      const dm = ((this.T - this.Tb) * C) / Lizp(this.Tb);
      this.W -= dm, (this.ml = this.W), (this.izparelo += dm);
      this.T = this.Tb;
      this.H = this.Hof(this.T, this.W);
    }
    const prej = this.stanje;
    this.stanje = this.ml <= 1e-6 ? "led" : this.ml < this.W - 1e-7 ? "led in voda" : this.T >= this.Tb - 1e-6 ? "voda vre" : "voda";
    if (prej === "led" && this.stanje !== "led") this.once("tali", { T: this.T });
    if (prej === "led in voda" && this.stanje !== "led in voda") this.once("stalilo", { T: this.T });
    if (this.stanje === "voda vre") this.once("vre", { T: this.T });
    if (this.W < 0.02 && this.on) (this.on = false), this.once("suho");
    thermoStep(this.th, this.T + (this.polozaj === "dno" && !this.idealno ? KUHALNIK.dno * this.Pk : 0), dt);
  }
  readT() {
    return thermoRead(this.th);
  }
}

// ------------------------------------------------------------------ ohlajanje čaja (lab-ohlajanje)
// Čaj 200 g pri 90 °C (ocena: voda iz kuhalnika po nekaj minutah namakanja) naliješ v posodo s sobno temperaturo.
export const SKODELICE = {
  porcelan: { posoda: "porcelan", pokrov: false, name: "porcelanska skodelica" },
  porcelanP: { posoda: "porcelan", pokrov: true, name: "porcelanska skodelica s pokrovčkom" },
  kovina: { posoda: "kovina", pokrov: false, name: "emajliran kovinski lonček" },
  stiropor: { posoda: "stiropor", pokrov: true, name: "lonček iz stiropora s pokrovom" },
  termovka: { posoda: "termovka", pokrov: true, name: "termovka z zamaškom" },
  termovkaO: { posoda: "termovka", pokrov: false, name: "termovka brez zamaška" },
};
export const CAJ = { m: 0.2, T: 90 };

export class OhlajanjeBench {
  constructor({ seed = 1, vrste = ["porcelan", "porcelanP", "termovka"] } = {}) {
    const r = (this.r = rng(seed));
    this.th = [0, 1, 2].map(() => makeThermo(r));
    this.vrste = [...vrste];
    this.t = 0;
    this.teče = false;
    this.cups = null;
  }
  nalij() {
    this.cups = this.vrste.map((k) => (k ? new Voda(POSODE[SKODELICE[k].posoda], { m: CAJ.m, T: CAJ.T, Tv: T_SOBA, pokrov: SKODELICE[k].pokrov }) : null));
    this.th.forEach((th) => (th.Tp = null));
    this.t = 0;
    this.teče = true;
  }
  step(dt) {
    if (!this.teče) return;
    steps(dt, (d) => {
      this.t += d;
      this.cups.forEach((c, i) => c && (c.step(d, 0), thermoStep(this.th[i], c.T, d)));
    });
  }
  readT(i) {
    return this.cups?.[i] ? thermoRead(this.th[i]) : null;
  }
}

// ------------------------------------------------------------------ poenostavitve (prikazane v simulaciji)
export const POENOSTAVITVE_TOPLOTA = {
  grelnik: [
    "Specifična toplota vode je stalna, 4182 J/(kg·K) (pri 20 °C; med 0 in 100 °C se spremeni za manj kot 1 %).",
    "Voda ima povsod enako temperaturo, čaša tudi; v resnici je steklo zunaj hladnejše kot znotraj.",
    "Koliko toplote uide skozi steno, dno in gladino ter z izhlapevanjem, smo ocenili, ne izmerili.",
    "Razplastenost vode brez mešanja je ocena: termometer ob strani kaže do ~3 °C manj od povprečja.",
    "Upor grelca je stalen. Pregrevanje grelca, termična varovalka (250 °C) in pregorevanje žice (650 °C) so ocene.",
    "Štoparica se zažene ob prvem vklopu grelca; čas segrevanja šteje samo, ko je grelec vklopljen.",
    "Natakanje je natančno na ±2 %, tehtnica pa pokaže pravo maso (tara s čašo je že narejena).",
  ],
  mesanje: [
    "Obe vodi imata enako specifično toploto (4182 J/(kg·K)); pri 80 °C je v resnici za 0,4 % večja.",
    "Posoda ima povsod enako temperaturo. Na začetku ima sobno temperaturo (20 °C).",
    "Kako se voda po zlivanju razplasti in kako hitro se zmeša, je ocena.",
    "Med natakanjem se topla voda ohladi za ~0,3 °C (ocena). Toplo vodo izmeriš tik pred zlivanjem.",
    "Brez tehtanja natočiš do oznake; masa odstopa do ±5 % (ocena).",
  ],
  faze: [
    "Led in voda sta ves čas dobro premešana, zato je med taljenjem temperatura točno enaka tališču.",
    "Kuhalnik odda v čašo stalno moč (ocena 80/150/250 W), ne glede na to, koliko je v njej.",
    "Zračni tlak je iz standardne atmosfere za izbrano višino; z vremenom se spreminja za ±2 kPa (±0,6 °C pri vrelišču).",
    "Vrelišče pri izbranem tlaku je izračunano po enačbi iz literature; voda zavre točno pri vrelišču, nič višje.",
    "Sol se raztopi v ~1 minuti; toplota raztapljanja soli je zanemarjena. Tališče slane vode je iz tabele (CRC).",
    "Pod −21,1 °C zamrzne tudi slana voda; tega dela ne pokažemo podrobno. V resnici se zmes ledu in soli ohlaja več minut, tu hitreje.",
  ],
  ohlajanje: [
    "Čaj je voda (enaka specifična toplota). Posoda ima na začetku sobno temperaturo.",
    "Koliko toplote uide iz posode ter masa in debelina sten so ocene za običajne skodelice.",
    "Termovka izgubi ~10 °C v 6 urah, če je zaprta (ocena iz navodil proizvajalcev).",
    "Soba ima stalno temperaturo 20 °C in 50 % relativne vlage; ni prepiha.",
  ],
};
