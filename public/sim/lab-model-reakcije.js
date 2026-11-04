// Virtualni laboratorij, kemijske reakcije: hitrost reakcije (lab-hitrost), energija pri reakcijah (lab-energija),
// plamenska reakcija (lab-plamenska). Brez DOM (testi: test/laboratorij-reakcije.test.js).
// Vsaka številka ima vir ali je označena kot ocena. Temperature so v °C, čas v s, množine v mol, prostornine v mL, mase v g.
// Ponovna uporaba: kinetika magnezija v kislini (KovineBench, KINETIKA, OBLIKE, KOVINE) iz lab-model-elektrokemija.js,
// voda v posodi z izgubami (Voda, POSODE), termometer in parni tlak vode (lab-model-toplota.js), rng/gauss (lab-model.js).
import { rng, gauss, R_PLIN, M, M_ZRAK, CO2_TOPNOST, BUCKA } from "./lab-model.js";
import { VODA, POSODE, Voda, pNas, makeThermo, thermoStep, thermoRead, T_SOBA } from "./lab-model-toplota.js";
import { KovineBench, KOVINE, OBLIKE, KINETIKA, laboratorij, TOPNOST } from "./lab-model-elektrokemija.js";

export { KOVINE, OBLIKE, KINETIKA };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const K0 = 273.15;
// Arrheniusov faktor glede na T0 (°C).
export const arrhenius = (Ea, T, T0 = 20) => Math.exp((-Ea / R_PLIN) * (1 / (T + K0) - 1 / (T0 + K0)));
// Korak integracije 0,1 s (najkrajša časovna konstanta je ~1 s).
const KORAK = 0.1;
// dt ≤ 0 (premor) ne naredi ničesar: sicer bi bila hitrost 0/0.
const korakaj = (dt, fn) => {
  if (!(dt > 0)) return;
  for (let n = Math.max(1, Math.ceil(dt / KORAK - 1e-9)), i = 0; i < n; i++) fn(dt / n);
};

// ================================================================ skupno
// Reakcijski čas človeka na viden dražljaj ~0,25 s (0,2–0,3 s; npr. Kosinski 2008, ocena za šolarje), raztros ±0,04 s.
export const CLOVEK = { reakcija: 0.25, sd: 0.04, min: 0.15, max: 0.4 };
export const reakcijskiCas = (r) => clamp(CLOVEK.reakcija + gauss(r, CLOVEK.sd, 2.5), CLOVEK.min, CLOVEK.max);
// Vodna kopel: ~2 L vode v plastični posodi, brez termostata. Pri 50 °C se v 5 min ohladi za ~3 K (ocena: τ ≈ 40 min).
// Raztopina v bučki v kopeli sledi kopeli s τ ≈ 60 s (ocena; steklo 1–2 mm, voda na obeh straneh).
export const KOPEL = { tau: 2400, tauBucka: 60, min: 20, max: 50 };
// Zrak: povprečna molska masa 28,96 g/mol (lab-model.js); CO₂ 44,009 g/mol.
// Tehtnica 0,01 g (šolska precizna tehtnica do 300 g, npr. KERN EMB 200-2): ponovljivost ±0,01 g; stalni zamik se po tariranju
// odšteje, ostane naklon ≤ 0,05 % (ocena) in nihanje zadnjega mesta ≤ 0,004 g; med burnim penjenjem mehurčki tehtnico tresejo do ±0,02 g (ocena).
export const TEHTNICA_R = { d: 0.01, gain: 0.0005, jit: 0.004, tres: 0.02, max: 300 };
export function tehtnicaR(r) {
  return { gain: clamp(gauss(r, 0.0002, 2.5), -TEHTNICA_R.gain, TEHTNICA_R.gain), r };
}
export function tehtnicaBeri(t, gram, tres = 0) {
  if (gram > TEHTNICA_R.max) return { text: "OL", value: NaN };
  const j = clamp(gauss(t.r, 0.0015, 2.6), -TEHTNICA_R.jit, TEHTNICA_R.jit) + (tres ? clamp(gauss(t.r, tres / 2.5, 2.5), -tres, tres) : 0);
  const v = Math.round((gram * (1 + t.gain) + j) / TEHTNICA_R.d) * TEHTNICA_R.d;
  return { text: v.toFixed(2), value: Math.round(v * 100) / 100 };
}

// ---------------------------------------------------------------- plinska brizga (Mg + HCl, H₂O₂)
// Steklena brizga 100 mL z razdelki po 1 mL (odčitek na 0,5 mL), kalibracija ±0,4 mL, nihanje ≤ 0,3 mL (ocena, kot v lab-kovine).
// Trenje bata: gladka (namazana) brizga se premakne pri nadtlaku ~0,3 kPa, zatikajoča (suha) pri ~4 kPa in nato skoči (ocena);
// drseče trenje je polovica lepenja (ocena). Zamašek, ki pušča: ~0,1 mL/s pri 0,3 kPa nadtlaka (prevodnost 1,4 · 10⁻⁸ mol/(s Pa), ocena).
// Bat izpade pri ~110 mL (konec valja, ocena).
export const BRIZGA = { V: 100, izpade: 110, kal: 0.4, jit: 0.3, trenje: 300, trenjeSuho: 4000, drsenje: 0.5, puscanje: 1.4e-8 };
export class Brizga {
  constructor(r, { Vglava, T, p }) {
    this.r = r;
    this.Vglava = Vglava; // mL plina v bučki nad tekočino in v cevki
    this.p = p;
    this.kal = clamp(gauss(r, 0.15, 2.5), -BRIZGA.kal, BRIZGA.kal);
    this.zatika = false;
    this.pusca = false;
    this.zrak(T);
  }
  // Zrak v bučki ob zaprtju (suh del; vodna para je posebej).
  zrak(T) {
    this.nZrak = ((this.p - pNas(T)) * this.Vglava * 1e-6) / (R_PLIN * (T + K0));
    this.x = 0;
    this.nIzg = 0;
    this.izpadel = false;
    this.dp = 0;
  }
  // nPlin: ves nastali plin, ki ni raztopljen (mol). Bat obstane, dokler nadtlak ne preseže lepenja.
  step(dt, nPlin, T) {
    if (this.izpadel) return;
    const n = Math.max(0, this.nZrak + nPlin - this.nIzg), pw = pNas(T), RT = R_PLIN * (T + K0);
    const pAt = (x) => (n * RT) / ((this.Vglava + x) * 1e-6) + pw;
    const fs = this.zatika ? BRIZGA.trenjeSuho : BRIZGA.trenje, fk = fs * BRIZGA.drsenje;
    let dp = pAt(this.x) - this.p;
    if (dp > fs || dp < -fs) {
      const cilj = dp > 0 ? fk : -fk;
      this.x = Math.max(0, (n * RT) / (this.p + cilj - pw) * 1e6 - this.Vglava);
      dp = pAt(this.x) - this.p;
    }
    if (this.pusca && dp > 0) this.nIzg += BRIZGA.puscanje * dp * dt;
    this.dp = dp;
    if (this.x > BRIZGA.izpade) {
      this.izpadel = true;
      this.x = 0;
    }
  }
  // Prostornina brez trenja in puščanja (za primerjavo in teste).
  idealna(nPlin, T) {
    return Math.max(0, ((this.nZrak + nPlin) * R_PLIN * (T + K0)) / (this.p - pNas(T)) * 1e6 - this.Vglava);
  }
  beri() {
    if (this.izpadel) return { text: "bat je izpadel", value: NaN };
    if (this.x > BRIZGA.V) return { text: "> 100", value: NaN, cez: true };
    const v = Math.max(0, Math.round((this.x + this.kal + clamp(gauss(this.r, 0.12, 2.5), -BRIZGA.jit, BRIZGA.jit)) * 2) / 2);
    return { text: v.toFixed(1), value: v };
  }
}

// Raztapljanje nastalega plina v tekočini: dokler plin nastaja, se tekočina nasiti (τ 30 s, ocena), potem plin počasi uhaja
// (τ 300 s, ocena kot pri lab-co2). Topnost pri 1 atm in 20 °C: CO₂ 0,038 mol/L (Sander 2015, lab-model.js), O₂ 1,3 · 10⁻³ mol/L
// (TOPNOST v lab-model-elektrokemija.js); s temperaturo pada (van 't Hoff, CO₂ 2400 K, O₂ 1700 K; Sander 2015).
const VANTHOFF = { CO2: 2400, O2: 1700 };
export const topnost = (plin, T) => (plin === "CO2" ? CO2_TOPNOST : TOPNOST.O2) * Math.exp(VANTHOFF[plin] * (1 / (T + K0) - 1 / 293.15));
function raztapljaj(st, plin, dt, { nastaja, Vtek, T, x = 1 }) {
  const sat = topnost(plin, T) * x * (Vtek / 1000);
  const tau = nastaja && st.nRaz < sat ? 30 : 300;
  const d = ((sat - st.nRaz) * (1 - Math.exp(-dt / tau)));
  st.nRaz = Math.max(0, Math.min(st.nRaz + d, st.nRaz + Math.max(0, st.nProst)));
  return d;
}

// ================================================================ 1. hitrost reakcije
// Osnova vseh štirih poskusov: zaščitna očala, vodna kopel, štoparica z reakcijskim časom.
class Osnova {
  constructor({ seed = 1, idealno = false, T } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    const L = laboratorij(r);
    this.lab = { T: T ?? L.T, p: L.p };
    this.ocala = false;
    this.TkopSet = this.lab.T;
    this.Tkop = this.lab.T;
    this.t = 0;
    this.ura = null; // { t0 } čas na štoparici = t − t0
    this.uraStop = null;
    this.events = [];
  }
  kopel(T) {
    this.TkopSet = clamp(T, KOPEL.min, KOPEL.max);
    this.Tkop = Math.max(this.TkopSet, this.lab.T - 0.01);
  }
  _kopel(dt) {
    if (!this.idealno && this.Tkop > this.lab.T) this.Tkop += (this.lab.T - this.Tkop) * (1 - Math.exp(-dt / KOPEL.tau));
  }
  // Štoparica: zamik je reakcijski čas (ali pozen začetek).
  zazeni(zamik = this.idealno ? 0 : reakcijskiCas(this.r)) {
    this.ura = { t0: this.t + zamik };
    this.uraStop = null;
  }
  ustavi(zamik = this.idealno ? 0 : reakcijskiCas(this.r)) {
    if (!this.ura || this.uraStop != null) return this.uraStop;
    this.uraStop = Math.max(0, this.t + zamik - this.ura.t0);
    return this.uraStop;
  }
  cas() {
    if (!this.ura) return 0;
    return this.uraStop ?? Math.max(0, this.t - this.ura.t0);
  }
}

// ---------------------------------------------------------------- (a) marmor in klorovodikova kislina, izguba mase
// CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. Kalcit ρ = 2,71 g/cm³ (CRC). ΔH = ΔfH(Ca²⁺) + ΔfH(CO₂, g) + ΔfH(H₂O) − ΔfH(CaCO₃)
// = −542,83 − 393,51 − 285,83 + 1207,6 = −14,6 kJ/mol (NBS, Wagman 1982).
// Hitrost: r = k · A · [H⁺] · e^(−Ea/R (1/T − 1/T₀)). Plummer, Wigley in Parkhurst (1978): pri pH < 3,5 je hitrost raztapljanja
// kalcita sorazmerna z aktivnostjo H⁺ in omejena z difuzijo (k₁ = 10^(0,198 − 444/T) mmol/(cm² s), Ea ≈ 8,5 kJ/mol, mešano).
// V nemešani šolski bučki z mehurčki je efektivno k = 5 · 10⁻⁶ mol/(s cm² · mol/L) (ocena: 5 g srednjih koščkov v 40 mL 2 M HCl
// izgubi ~1,5 g CO₂ v ~7 min, kot v RSC »Rates of reaction: marble chips and acid«); Ea = 15 kJ/mol (ocena: difuzija H⁺ ~ +2 %/K).
// Koščki: nepravilne kocke z robom 3 / 6 / 12 mm, hrapavost ×1,5 (ocena); prah ~50 µm, a se sprime in plava, zato kislina moči le
// ~10 % površine (ocena). Površina se manjša kot (m/m₀)^(2/3).
export const MARMOR = { rho: 2.71, k: 5e-6, Ea: 15000, dH: -14.6, Vkis: 40 };
export const MARMOR_OBLIKE = {
  veliki: { name: "veliki koščki (~12 mm)", a: (6 * 1.5) / (1.2 * 2.71) },
  srednji: { name: "srednji koščki (~6 mm)", a: (6 * 1.5) / (0.6 * 2.71) },
  mali: { name: "mali koščki (~3 mm)", a: (6 * 1.5) / (0.3 * 2.71) },
  prah: { name: "prah", a: (6 * 0.1) / (0.005 * 2.71) },
};
export const MARMOR_MASE = [1, 2, 5];
export const KONC_HCL = [0.5, 1, 2];
// Bučka 100 mL (do vratu ~130 mL, masa 75 g; BUCKA v lab-model.js), vata ~0,5 g. HCl: ρ ≈ 1 + 0,0165 c g/mL (CRC, 20 °C).
// Izhlapevanje skozi vato (difuzija vodne pare skozi ~3 cm vate v vratu Ø 2,2 cm): ~0,16 mg/min pri 20 °C; brez vate ~0,5 mg/min (ocena).
// Brez vate mehurčki razpršijo kapljice kisline: ~5 % mase sproščenega CO₂, kadar plin nastaja hitreje kot ~3 mL/s (ocena).
// CO₂ je težji od zraka: dokler se plin razvija, ga je v bučki vse več (dobro premešano), potem počasi difundira ven skozi vato
// (τ 600 s; brez vate 200 s; ocena). Pena: 1,2 mL na mL plina v sekundi, razpade s τ = 3 s; čez rob gre, ko tekočina in pena
// presežeta 130 mL (kot lab-kovine); pri tem izgubiš ~2 g tekočine (ocena).
export const BUCKA_R = { V: 130, masa: BUCKA.masa, vata: 0.5, izhlap: 0.16 / 60 / 1000, izhlapOdprto: 0.5 / 60 / 1000, razprsi: 0.05, razprsiPrag: 3, tauVata: 600, tauOdprto: 200, pena: 1.2, tauPena: 3, prelij: 2 };
export const gostotaHCl = (c) => 1 + 0.0165 * c;
export class MarmorBench extends Osnova {
  constructor(o = {}) {
    super(o);
    this.teh = tehtnicaR(this.r);
    this.vata = true;
    this.reset();
  }
  reset() {
    this.c = null;
    this.kos = null;
    this.nH = 0;
    this.nCO2 = 0;
    this.st = { nRaz: 0, nProst: 0 };
    this.x = 0; // delež CO₂ v plinu v bučki
    this.izgubaTek = 0; // g kapljic, izhlapele vode in prelite pene
    this.pena = 0;
    this.prelito = false;
    this.rate = 0;
    this.T = this.Tkop;
  }
  // Nalij 40 mL kisline v bučko na tehtnici.
  nalij(c) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    this.reset();
    this.c = c;
    this.nH = (c * MARMOR.Vkis) / 1000;
    this.T = this.Tkop;
    return { ok: true };
  }
  dodaj(oblika, m) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    if (this.c == null) return { ok: false, why: "kislina" };
    if (this.kos) return { ok: false, why: "ze" };
    const mm = this.idealno ? m : m * (1 + clamp(gauss(this.r, 0.004, 2.5), -0.01, 0.01));
    this.kos = { oblika, m0: mm, m: mm };
    this.t = 0;
    return { ok: true, m: mm };
  }
  povrsina() {
    const k = this.kos;
    return k && k.m > 0 ? MARMOR_OBLIKE[k.oblika].a * k.m0 * (k.m / k.m0) ** (2 / 3) : 0;
  }
  // Stehiometrijska množina CO₂ (omejitveni reaktant).
  nCO2Stehiometrija() {
    return this.kos ? Math.min(this.kos.m0 / M.CaCO3, ((this.c ?? 0) * MARMOR.Vkis) / 1000 / 2) : 0;
  }
  step(dt) {
    korakaj(dt, (d) => this._step(d));
  }
  _step(dt) {
    this._kopel(dt);
    this.rate = 0;
    const V = MARMOR.Vkis / 1000;
    if (this.kos && this.kos.m > 1e-9 && this.nH > 1e-12) {
      let r = MARMOR.k * this.povrsina() * (this.nH / V) * arrhenius(MARMOR.Ea, this.T);
      r = Math.min(r, this.kos.m / M.CaCO3 / dt, this.nH / 2 / dt);
      this.kos.m = Math.max(0, this.kos.m - r * dt * M.CaCO3);
      this.nH -= 2 * r * dt;
      this.nCO2 += r * dt;
      this.st.nProst += r * dt;
      this.rate = r;
      this.T += (-MARMOR.dH * 1000 * r * dt) / (MARMOR.Vkis * VODA.c / 1000 + 0.5 * BUCKA_R.masa * 0.84);
    }
    if (this.c != null) {
      // kislina je segreta v kopeli, bučka pa stoji na tehtnici in se ohlaja proti sobi s τ ~ 15 min (ocena)
      this.T += (this.lab.T - this.T) * (1 - Math.exp(-dt / 900));
      const vRate = this.hitrostPlina();
      const raz = raztapljaj(this.st, "CO2", dt, { nastaja: this.rate > 1e-7, Vtek: MARMOR.Vkis, T: this.T, x: this.x });
      this.st.nProst -= raz;
      const Vh = BUCKA_R.V - MARMOR.Vkis;
      this.x += (vRate * dt * (1 - this.x)) / Vh - (this.x * (1 - Math.exp(-dt / (this.vata ? BUCKA_R.tauVata : BUCKA_R.tauOdprto))));
      this.x = clamp(this.x, 0, 1);
      const ev = (this.vata ? BUCKA_R.izhlap : BUCKA_R.izhlapOdprto) * pNas(this.T) / pNas(20);
      this.izgubaTek += ev * dt;
      if (!this.vata && vRate > BUCKA_R.razprsiPrag) this.izgubaTek += BUCKA_R.razprsi * this.rate * dt * M.CO2 * Math.min(1, (vRate - BUCKA_R.razprsiPrag) / BUCKA_R.razprsiPrag);
      this.pena += dt * (BUCKA_R.pena * vRate - this.pena / BUCKA_R.tauPena);
      if (!this.prelito && MARMOR.Vkis + this.pena > BUCKA_R.V) {
        this.prelito = true;
        this.izgubaTek += BUCKA_R.prelij;
        this.events.push({ type: "pena" });
      }
    }
    this.t += dt;
  }
  hitrostPlina() {
    return (this.rate * R_PLIN * (this.T + K0)) / this.lab.p * 1e6; // mL/s
  }
  // Masa CO₂, ki je že zapustila bučko (g): nastali minus raztopljeni minus presežek CO₂ v plinu nad tekočino.
  izgubaCO2() {
    const Vh = (BUCKA_R.V - MARMOR.Vkis) * 1e-6;
    const presezek = (this.x * Vh * this.lab.p * (M.CO2 - M_ZRAK)) / (R_PLIN * (this.T + K0));
    return (this.nCO2 - this.st.nRaz) * M.CO2 - presezek;
  }
  // Masa bučke na tehtnici (g).
  masa() {
    if (this.c == null) return 0;
    return BUCKA_R.masa + (this.vata ? BUCKA_R.vata : 0) + MARMOR.Vkis * gostotaHCl(this.c) + (this.kos ? this.kos.m0 : 0) - this.izgubaCO2() - this.izgubaTek;
  }
  beriMaso() {
    return tehtnicaBeri(this.teh, this.masa(), this.idealno ? 0 : this.hitrostPlina() > 3 ? TEHTNICA_R.tres : 0);
  }
  mehurcki() {
    const v = this.hitrostPlina();
    return v < 0.005 ? 0 : v < 0.08 ? 1 : v < 0.8 ? 2 : v < 5 ? 3 : 4;
  }
}

// ---------------------------------------------------------------- (b) magnezijev trak in HCl, plinska brizga
// Kinetika, toplota in pena: KovineBench (lab-model-elektrokemija.js: r = k · A · [H⁺] · Arrhenius, k(Mg) = 1,0 · 10⁻⁵, Ea 40 kJ/mol,
// trak 0,2 mm, 50 mL kisline v erlenmajerici 100 mL). Magnezijev trak 3 mm × 0,2 mm: 1 cm ≈ 0,0104 g (ρ 1,738 g/cm³; ocena za šolski trak).
// Tu le brizga s trenjem in puščanjem ter kopel.
export const MG_TRAK = { gNaCm: 0.3 * 0.02 * 1.738, dolzine: [3, 5, 8, 12] };
export class MagnezijBench extends Osnova {
  constructor(o = {}) {
    super(o);
    this.K = new KovineBench({ seed: (o.seed ?? 1) + 7, T: this.lab.T, p: this.lab.p });
    this.K.brizga = false; // brizga je tu posebej (trenje, puščanje)
    this.brizga = new Brizga(this.r, { Vglava: 130 - 50 + 3, T: this.lab.T, p: this.lab.p });
    this.zatika = false;
    this.pusca = false;
    this.c = null;
  }
  nalij(c) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    this.K.ocala = true;
    this.K.lab.T = this.Tkop;
    this.K.nalij("HCl", c);
    this.c = c;
    this.brizga.zrak(this.Tkop);
    return { ok: true };
  }
  dodaj(cm) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    if (this.c == null) return { ok: false, why: "kislina" };
    if (this.K.kos) return { ok: false, why: "ze" };
    const m = cm * MG_TRAK.gNaCm * (this.idealno ? 1 : 1 + clamp(gauss(this.r, 0.02, 2.5), -0.05, 0.05));
    this.K.dodaj("Mg", "trak", m);
    this.brizga.zrak(this.K.T);
    this.t = 0;
    return { ok: true, m };
  }
  step(dt) {
    korakaj(dt, (d) => {
      this._kopel(d);
      this.K.lab.T = this.Tkop;
      this.K.step(d);
      if (this.Tkop > this.lab.T + 0.5) this.K.T += (this.Tkop - this.K.T) * (1 - Math.exp(-d / KOPEL.tauBucka));
      this.brizga.zatika = this.zatika;
      this.brizga.pusca = this.pusca;
      if (this.c != null) this.brizga.step(d, this.K.nH2 - this.raztopljeno(), this.K.T);
      this.t += d;
    });
    if (this.brizga.izpadel && !this._izp) (this._izp = true), this.events.push({ type: "bat" });
  }
  // H₂ je slabo topen (7,8 · 10⁻⁴ mol/L, TOPNOST): v 50 mL ostane ~0,04 mmol (~1 mL).
  raztopljeno() {
    return Math.min(this.K.nH2, TOPNOST.H2 * 0.05);
  }
  hitrost() {
    return this.K.rateH2; // mol/s
  }
  hitrostPlina() {
    return this.K.hitrostPlina();
  }
  get T() {
    return this.K.T;
  }
  mehurcki() {
    return this.K.mehurcki();
  }
}

// ---------------------------------------------------------------- (c) natrijev tiosulfat in HCl: »izginjajoči križ«
// Na₂S₂O₃ + 2HCl → 2NaCl + SO₂ + S + H₂O. Hitrost r = k · [S₂O₃²⁻] (1. red glede na tiosulfat, pri presežku kisline skoraj
// neodvisna od [H⁺]; šolske meritve, npr. RSC »The effect of concentration on the rate of reaction«, in J. Chem. Educ. 1990, 67, 802).
// Križ izgine, ko je nastalo toliko koloidnega žvepla, da je motnost dovolj velika: [S] ≈ 1 · 10⁻³ mol/L (~32 mg/L, ocena).
// Umeritev: 50 mL raztopine 40 g/L Na₂S₂O₃·5H₂O (0,161 mol/L) in 5 mL 2 M HCl pri 20 °C: križ izgine v ~45 s (ocena po RSC).
// Ea = 52 kJ/mol (ocena; literatura in šolske meritve 45–60 kJ/mol), kar da Q10 = 2,0 med 20 in 30 °C.
// Raztopini sta segreti v kopeli; bučka nato stoji na listu s križem in se ohlaja proti sobi s τ ≈ 1000 s (ocena).
// Kdaj križ izgine, presodi učenec; ljudje se razlikujejo za ~±3 % (ocena), k temu reakcijski čas pri zagonu in ustavitvi štoparice.
export const TIO = { M: 248.18, zaloga: 40, Sk: 1e-3, t0: 45, c0: (40 / 248.18) * 1, Ea: 52000, tau: 1000, presoja: 0.015, Vkis: 5 };
TIO.k20 = TIO.Sk / (((TIO.c0 * 50) / 55) * TIO.t0); // 1/s pri 20 °C
export const TIO_VOLUMNI = [10, 20, 30, 40, 50]; // mL zaloge, dopolnjeno z vodo do 50 mL
export const ktio = (T) => TIO.k20 * arrhenius(TIO.Ea, T);
// Čas, ko križ izgine (model, brez človeka), pri stalni temperaturi.
export const casKriza = (c, T) => -Math.log(1 - TIO.Sk / c) / ktio(T);
export class TiosulfatBench extends Osnova {
  constructor(o = {}) {
    super(o);
    this.reset();
  }
  reset() {
    this.c = null; // mol/L tiosulfata v 55 mL
    this.S = 0; // mol/L koloidnega žvepla
    this.zmes = false;
    this.T = this.Tkop;
    this.Vz = 50;
    this.presoja = this.idealno ? 0 : clamp(gauss(this.r, TIO.presoja, 2.5), -0.04, 0.04);
    this.kriz = null; // pravi čas izginotja
    this.pripravljeno = false;
  }
  // Pripravi 50 mL raztopine iz V mL zaloge (40 g/L) in vode.
  pripravi(Vz) {
    this.reset();
    this.Vz = Vz;
    this.pripravljeno = true;
    return { ok: true };
  }
  // Prilij 5 mL kisline (2 mol/L) in premešaj.
  zlij(cHCl = 2) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    if (!this.pripravljeno) return { ok: false, why: "tiosulfat" };
    if (this.zmes) return { ok: false, why: "ze" };
    this.c = (TIO.c0 * this.Vz) / 50 * (50 / 55);
    this.cHCl = cHCl;
    this.T = this.Tkop;
    this.zmes = true;
    this.t = 0;
    return { ok: true };
  }
  step(dt) {
    korakaj(dt, (d) => {
      this._kopel(d);
      if (this.zmes) {
        // tudi kislina se porablja; ko je zmanjka, reakcija obstane
        this.S += ktio(this.T) * Math.max(0, this.c - this.S) * d * (this.cHCl * 5 / 55 > 2 * this.S ? 1 : 0);
        this.T += (this.lab.T - this.T) * (1 - Math.exp(-d / (this.idealno ? Infinity : TIO.tau)));
        if (this.kriz == null && this.S >= TIO.Sk * (1 + this.presoja)) this.kriz = this.t + d;
      }
      this.t += d;
    });
  }
  // Prosojnost: koliko se križ še vidi (1 jasno, 0 nič). Kontrast pade na 2 % pri [S] = Sk (ocena, Beer–Lambert za sipanje).
  vidnost() {
    return Math.exp(-3.9 * (this.S / TIO.Sk));
  }
}

// ---------------------------------------------------------------- (d) razkroj vodikovega peroksida s katalizatorji
// 2H₂O₂ → 2H₂O + O₂. 3 % H₂O₂ = 30 g/L = 0,882 mol/L (M = 34,01 g/mol); 5 / 10 / 20 mL in voda do 25 mL v erlenmajerici 100 mL.
// 1. red glede na H₂O₂: −d[H₂O₂]/dt = k · [H₂O₂]. Brez katalizatorja k ≈ 1 · 10⁻⁷ /s (v nekaj minutah ni plina; ocena),
// Ea = 75 kJ/mol (učbeniška vrednost za nekatalizirani razkroj; ocena).
// MnO₂ (prah): k = 0,12 /s na gram (ocena: 0,5 g sprosti ~40 mL O₂ v ~30 s), Ea 30 kJ/mol (ocena).
// KI (~0,5 g trdnega, [I⁻] = 0,12 mol/L): H₂O₂ + I⁻ → H₂O + IO⁻ (počasna stopnja), IO⁻ + H₂O₂ → H₂O + O₂ + I⁻;
// k = 0,0115 L/(mol s) pri 25 °C, Ea = 56 kJ/mol (Liebhafsky in Mohammad, JACS 1933; ocena ±20 %); −d[H₂O₂]/dt = 2k[I⁻][H₂O₂].
// Katalaza: surov krompir 5 g v kockah k = 0,006 /s, nariban 0,02 /s, surova jetra 1 g 0,08 /s (ocena po šolskih poskusih:
// jetra se burno penijo, krompir zmerno). Ea 15 kJ/mol, nad ~50 °C encim razpade: faktor 1/(1 + e^((T − 52)/3)) (ocena).
// Kuhan krompir ali jetra: katalaza je denaturirana, k ≈ 0.
// Tleča trska vzplamti nad ~50 % O₂ (ocena, kot pri lab-elektroliza) ali v vratu, kjer kisik hitro izhaja (> 0,3 mL/s, ocena).
// MnO₂ se ne porabi: po filtriranju in sušenju ostane enaka masa (na filtrirnem papirju ostane ~3 mg, ocena).
export const PEROKSID = { c: 30 / 34.01, Vskupaj: 25, k0: 1e-7, Vh: 130 - 25 + 3 };
export const KATALIZATORJI = {
  brez: { name: "brez katalizatorja" },
  mno2_01: { name: "MnO₂ (prah), 0,1 g", tip: "mno2", m: 0.1 },
  mno2_05: { name: "MnO₂ (prah), 0,5 g", tip: "mno2", m: 0.5 },
  ki: { name: "KI (trden), ~0,5 g", tip: "ki", m: 0.5 },
  krompir: { name: "surov krompir, kocke 5 g", tip: "katalaza", k: 0.006 },
  krompirNariban: { name: "surov krompir, nariban 5 g", tip: "katalaza", k: 0.02 },
  krompirKuhan: { name: "kuhan krompir, kocke 5 g", tip: "katalaza", k: 0, kuhan: true },
  jetra: { name: "surova jetra, 1 g", tip: "katalaza", k: 0.08 },
  jetraKuhana: { name: "kuhana jetra, 1 g", tip: "katalaza", k: 0, kuhan: true },
};
export const PEROKSID_V = [5, 10, 20];
export function kPeroksid(kat, T) {
  const K = KATALIZATORJI[kat];
  let k = PEROKSID.k0 * arrhenius(75000, T);
  if (K.tip === "mno2") k += 0.12 * K.m * arrhenius(30000, T);
  if (K.tip === "ki") k += 2 * 0.0115 * arrhenius(56000, T, 25) * (K.m / 166.0 / (PEROKSID.Vskupaj / 1000));
  if (K.tip === "katalaza") k += K.k * arrhenius(15000, T) / (1 + Math.exp((T - 52) / 3));
  return k;
}
export class PeroksidBench extends Osnova {
  constructor(o = {}) {
    super(o);
    this.teh = tehtnicaR(this.r);
    this.zatika = false;
    this.pusca = false;
    this.reset();
  }
  reset() {
    this.V = null;
    this.nH2O2 = 0;
    this.nO2 = 0;
    this.kat = null;
    this.st = { nRaz: 0, nProst: 0 };
    this.T = this.Tkop;
    this.rate = 0;
    this.brizga = new Brizga(this.r, { Vglava: PEROKSID.Vh, T: this.T, p: this.lab.p });
    this._izp = false;
  }
  nalij(V) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    this.reset();
    this.V = V;
    this.nH2O2 = (PEROKSID.c * V) / 1000 * (this.idealno ? 1 : 1 + clamp(gauss(this.r, 0.01, 2.5), -0.03, 0.03)); // 3 % ±3 % (ocena)
    this.n0 = this.nH2O2;
    return { ok: true };
  }
  dodaj(kat) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    if (this.V == null) return { ok: false, why: "peroksid" };
    if (this.kat) return { ok: false, why: "ze" };
    this.kat = kat;
    this.brizga.zrak(this.T);
    this.t = 0;
    return { ok: true };
  }
  nO2Stehiometrija() {
    return (this.n0 ?? 0) / 2;
  }
  step(dt) {
    korakaj(dt, (d) => {
      this._kopel(d);
      this.rate = 0;
      if (this.V != null) {
        if (this.kat) {
          const k = kPeroksid(this.kat, this.T);
          const dn = this.nH2O2 * (1 - Math.exp(-k * d));
          this.nH2O2 -= dn;
          this.nO2 += dn / 2;
          this.st.nProst += dn / 2;
          this.rate = dn / 2 / d;
          // ΔH = −285,83 + 191,17 = −94,7 kJ/mol H₂O₂ (NBS: ΔfH H₂O₂(aq) −191,17, H₂O(l) −285,83)
          this.T += (94660 * dn) / (PEROKSID.Vskupaj * VODA.c / 1000 + 0.5 * BUCKA_R.masa * 0.84);
        }
        this.T += (this.Tkop - this.T) * (1 - Math.exp(-d / (this.Tkop > this.lab.T + 0.5 ? KOPEL.tauBucka : 900)));
        const raz = raztapljaj(this.st, "O2", d, { nastaja: this.rate > 1e-8, Vtek: PEROKSID.Vskupaj, T: this.T });
        this.st.nProst -= raz;
        this.brizga.zatika = this.zatika;
        this.brizga.pusca = this.pusca;
        if (this.kat) this.brizga.step(d, this.nO2 - this.st.nRaz, this.T);
      }
      this.t += d;
    });
    if (this.brizga.izpadel && !this._izp) (this._izp = true), this.events.push({ type: "bat" });
  }
  hitrostPlina() {
    return (this.rate * R_PLIN * (this.T + K0)) / this.lab.p * 1e6;
  }
  mehurcki() {
    const v = this.hitrostPlina();
    return v < 0.003 ? 0 : v < 0.05 ? 1 : v < 0.5 ? 2 : v < 3 ? 3 : 4;
  }
  // Delež kisika v plinu nad tekočino (zrak 20,95 %).
  delezO2() {
    const nz = this.brizga.nZrak, no = Math.max(0, this.nO2 - this.st.nRaz - this.brizga.nIzg);
    return (BUCKA.o2zrak * nz + no) / Math.max(1e-12, nz + no);
  }
  // Tleča trska v vratu bučke: »vzplamti«, »zažari« (malo več kisika) ali »ugasne«.
  trska() {
    const x = this.delezO2(), v = this.hitrostPlina();
    if (x > 0.5 || v > 0.3) return "vzplamti";
    if (x > 0.25 || v > 0.05) return "zazari";
    return "ugasne";
  }
  // Filtriranje: MnO₂ se ne porabi.
  filtriraj() {
    const K = KATALIZATORJI[this.kat];
    if (!K || K.tip !== "mno2") return null;
    const m = K.m - (this.idealno ? 0 : 0.003);
    return { m0: K.m, ...tehtnicaBeri(this.teh, m) };
  }
}

// ================================================================ 2. energija pri reakcijah (kalorimeter)
// Kalorimeter: lonček iz stiropora (POSODE.stiropor) s pokrovom ali steklena čaša 400 mL (POSODE.casa400), mešalo, termometer.
// Voda v posodi z izgubami skozi steno, dno in vrh: Voda (lab-model-toplota.js). Prostor 20 °C (T_SOBA).
// Termometer: digitalni (±0,5 °C, 0,1 °C, τ 4 s; TERMOMETER) ali stekleni z razdelki po 0,5 °C (odčitek na 0,5 °C, napaka ±0,3 °C,
// τ 10 s; ocena). Toplotna kapaciteta: sonda ~1,5 J/K, stekleni termometer ~4 J/K (ocena).
// Entalpije (25 °C, 1 bar): nevtralizacija močne kisline z močno bazo −57,1 kJ/mol pri ~1 mol/L (Atkins, Physical Chemistry;
// pri neskončni razredčitvi −55,8 kJ/mol iz ΔfH NBS); ocetna kislina z NaOH −56,1 kJ/mol (ocena: del energije porabi ionizacija, literatura
// −55,2 … −56,1); raztapljanje (CRC »Enthalpy of solution of electrolytes«, neskončna razredčitev): NH₄NO₃ +25,69, NaOH −44,51,
// CaCl₂ −81,33 kJ/mol; Mg + 2H⁺ → Mg²⁺ + H₂: ΔfH(Mg²⁺) = −466,85 kJ/mol (NBS).
// Mešanje: zlita raztopina se pomeša v ~2 s z mešanjem, ~8 s brez (ocena); brez mešanja termometer kaže 30 % razlike manj
// (topla/hladna plast), razlika izginja s τ 90 s brez mešanja in 3 s z mešanjem (ocena, kot lab-mesanje).
// Raztapljanje trdne snovi: τ 25 s (NH₄NO₃), 60 s (NaOH, peleti), 30 s (CaCl₂) z mešanjem, brez mešanja 4× počasneje (ocena).
export const DH = { nevtr: -57.1, ocetna: -56.1, NH4NO3: 25.69, NaOH: -44.51, CaCl2: -81.33, Mg: -466.85 };
export const TRDNE = {
  NH4NO3: { name: "amonijev nitrat", formula: "NH₄NO₃", M: 80.043, dH: DH.NH4NO3, tau: 25 },
  NaOH: { name: "natrijev hidroksid (peleti)", formula: "NaOH", M: 39.997, dH: DH.NaOH, tau: 60, jedko: true },
  CaCl2: { name: "kalcijev klorid (brezvodni)", formula: "CaCl₂", M: 110.98, dH: DH.CaCl2, tau: 30 },
};
export const TERMOMETRI = {
  digitalni: { name: "digitalni termometer (0,1 °C)", C: 1.5 },
  stekleni: { name: "stekleni termometer (razdelki po 0,5 °C)", C: 4, tau: 10, d: 0.5, tol: 0.3 },
};
export const KALORIMETRI = { stiropor: POSODE.stiropor, casa: POSODE.casa400 };
export const MESANJE_K = { tauMes: 2, tauNe: 8, plasti: 0.3, tauPl: 90, tauPlMes: 3, pocasi: 4 };
// Mg v kalorimetru: kinetika kot v lab-kovine (KINETIKA, OBLIKE) s 50 mL kisline.
export class KalorimeterBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.ocala = false;
    this.posoda = "stiropor";
    this.pokrov = true;
    this.mesaj = true;
    this.termometer = "digitalni";
    this.th = makeThermo(r);
    this.stKal = clamp(gauss(r, 0.1, 2.5), -0.3, 0.3); // stekleni termometer: stalni zamik
    this.reset();
  }
  reset() {
    this.w = null; // Voda
    this.t = 0;
    this.tMix = null;
    this.reak = null; // { tip, n (preostalo mol), dH (kJ/mol), tau } ali Mg
    this.plasti = 0;
    this.nNastalo = 0;
    this.events = [];
    this.th.Tp = null;
    this.Tp2 = null;
    this.titr = null;
  }
  _Tzac() {
    return T_SOBA + (this.idealno ? 0 : clamp(gauss(this.r, 0.2, 2.5), -0.5, 0.5));
  }
  _voda(mL, T) {
    const P = KALORIMETRI[this.posoda];
    this.w = new Voda(P, { m: mL / 1000, T, Tv: T_SOBA, pokrov: this.pokrov, idealno: false });
    this.w.Cdod = TERMOMETRI[this.termometer].C; // termometer in mešalo
  }
  // Prvo raztopino (ali vodo) nalij v kalorimeter. vrsta: "HCl" | "CH3COOH" | "voda"; c v mol/L.
  nalij(vrsta, c, mL) {
    if (!this.ocala && vrsta !== "voda") return { ok: false, why: "ocala" };
    this.reset();
    this.prva = { vrsta, c, mL, n: vrsta === "voda" ? 0 : (c * mL) / 1000 };
    this._voda(mL, this._Tzac());
    return { ok: true, jedko: c >= 3 };
  }
  // Odčitek temperature druge raztopine pred zlivanjem (stoji v sobi).
  pripravi2(c, mL) {
    this.druga = { c, mL, T: this._Tzac() };
    return this.druga;
  }
  // Zlij drugo raztopino (NaOH) v kalorimeter.
  zlij() {
    if (!this.ocala) return { ok: false, why: "ocala" };
    if (!this.w || !this.druga || this.reak) return { ok: false, why: "ni" };
    const d = this.druga, w = this.w;
    const m2 = d.mL / 1000;
    w.T = (w.m * w.T + m2 * d.T) / (w.m + m2);
    w.m += m2;
    const nB = (d.c * d.mL) / 1000, nA = this.prva.n;
    const dH = this.prva.vrsta === "CH3COOH" ? DH.ocetna : DH.nevtr;
    this.reak = { tip: "mesanje", n: Math.min(nA, nB), dH, tau: this.mesaj ? MESANJE_K.tauMes : MESANJE_K.tauNe };
    this.nRea = Math.min(nA, nB);
    this.tMix = this.t;
    this._plasti = true;
    return { ok: true, jedko: d.c >= 3 };
  }
  // Trdno snov (NH₄NO₃, NaOH, CaCl₂) stresi v vodo.
  stresi(snov, g) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    if (!this.w || this.reak) return { ok: false, why: "ni" };
    const S = TRDNE[snov];
    const n = g / S.M;
    this.reak = { tip: "trdna", snov, n, dH: S.dH, tau: S.tau };
    this.nRea = n;
    this.tMix = this.t;
    this._plasti = true;
    return { ok: true, jedko: !!S.jedko };
  }
  // Magnezij (prah ali trak) v kislino (prva raztopina mora biti HCl, 50 mL).
  dodajMg(oblika, g) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    if (!this.w || this.reak || this.prva?.vrsta !== "HCl") return { ok: false, why: "ni" };
    this.reak = { tip: "mg", oblika, m0: g, m: g, nH: this.prva.n, dH: DH.Mg };
    this.nRea = Math.min(g / KOVINE.Mg.M, this.prva.n / 2);
    this.tMix = this.t;
    this._plasti = true;
    return { ok: true };
  }
  // Termometrijska titracija: v kalorimetru je kislina; z bireto dodajaš NaOH (c) po dV mL; NaOH ima sobno temperaturo.
  titriraj(dV, c) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    if (!this.w || this.prva?.vrsta === "voda") return { ok: false, why: "ni" };
    if (!this.titr) this.titr = { V: 0, nA: this.prva.n, c, T: this._Tzac(), tSt: this.t };
    const T = this.titr, w = this.w, m2 = dV / 1000;
    w.T = (w.m * w.T + m2 * T.T) / (w.m + m2);
    w.m += m2;
    const nB = (c * dV) / 1000, n = Math.min(nB, T.nA);
    T.nA -= n;
    T.V += dV;
    const dH = this.prva.vrsta === "CH3COOH" ? DH.ocetna : DH.nevtr;
    this.reak = { tip: "mesanje", n: (this.reak?.n ?? 0) + n, dH, tau: this.mesaj ? MESANJE_K.tauMes : MESANJE_K.tauNe };
    this._plasti = true;
    return { ok: true, V: T.V };
  }
  step(dt) {
    if (!this.w) return;
    const w = this.w;
    korakaj(dt, (d) => {
      let P = 0;
      const R = this.reak;
      if (R && R.tip === "mg" && R.m > 1e-9 && R.nH > 1e-12) {
        const K = KOVINE.Mg, O = OBLIKE[R.oblika], A = O.a(K) * R.m0 * (R.m / R.m0) ** O.p, V = w.m;
        let r = KINETIKA.k.Mg * A * (R.nH / V) * arrhenius(KINETIKA.Ea, w.T) * (this.mesaj ? 1.3 : 1);
        r = Math.min(r, R.m / K.M / d, R.nH / 2 / d);
        R.m -= r * d * K.M;
        R.nH -= 2 * r * d;
        this.nNastalo += r * d;
        P = -R.dH * 1000 * r;
      } else if (R && R.n > 0) {
        const tau = R.tip === "trdna" ? R.tau * (this.mesaj ? 1 : MESANJE_K.pocasi) : this.mesaj ? MESANJE_K.tauMes : MESANJE_K.tauNe;
        const dn = R.n * (1 - Math.exp(-d / tau));
        R.n -= dn;
        this.nNastalo += dn;
        P = (-R.dH * 1000 * dn) / d;
      }
      // toplotna kapaciteta termometra in mešala: del vode, ki ga dodamo v Voda.m le za korak
      const C0 = w.m * VODA.c, Cd = w.Cdod;
      w.pokrov = this.pokrov;
      const T0 = w.T;
      w.step(d, (P * C0) / (C0 + Cd));
      // (P · C0/(C0 + Cd)): termometer pobere svoj delež toplote
      if (this._plasti) {
        this.plasti += (w.T - T0) * MESANJE_K.plasti * (this.mesaj ? 0.1 : 1) * (R?.tip === "trdna" ? 1.5 : 1);
      }
      this.plasti *= Math.exp(-d / (this.mesaj ? MESANJE_K.tauPlMes : MESANJE_K.tauPl));
      const Ts = w.T - this.plasti;
      if (this.termometer === "digitalni") thermoStep(this.th, Ts, d);
      else this.Tp2 = this.Tp2 == null ? Ts : this.Tp2 + (Ts - this.Tp2) * (1 - Math.exp(-d / TERMOMETRI.stekleni.tau));
      this.t += d;
    });
  }
  readT() {
    if (!this.w) return { text: "–", value: NaN };
    if (this.termometer === "digitalni") {
      if (this.th.Tp == null) thermoStep(this.th, this.w.T, 0);
      return thermoRead(this.th);
    }
    const Tp = this.Tp2 ?? this.w.T;
    const v = Math.round((Tp + this.stKal + (this.idealno ? 0 : clamp(gauss(this.r, 0.05, 2), -0.1, 0.1))) / 0.5) * 0.5;
    return { text: v.toFixed(1), value: v };
  }
  // Prava temperatura (povprečna) za teste.
  get T() {
    return this.w ? this.w.T : NaN;
  }
  // Množina snovi, ki zreagira (omejitveni reaktant), za ΔH = −m c ΔT / n.
  nReakcija() {
    return this.nRea ?? 0;
  }
  masaRaztopine() {
    return this.w ? this.w.m * 1000 : 0;
  }
}
// Ekstrapolacija: premica skozi točke ohlajanja (ali segrevanja) po skrajni temperaturi, vrednost ob času mešanja.
// pts = [[t, T]] po mešanju; endo = true za najnižjo temperaturo. Vrne { T, k, n } ali null (premalo točk).
export function ekstrapolacija(pts, tMix, { endo = false, najmanj = 3 } = {}) {
  const p = pts.filter((q) => q[0] >= tMix && Number.isFinite(q[1])).sort((a, b) => a[0] - b[0]);
  if (p.length < najmanj + 1) return null;
  let iEx = 0;
  p.forEach((q, i) => ((endo ? q[1] < p[iEx][1] : q[1] > p[iEx][1]) ? (iEx = i) : 0));
  // točke po vrhu, ko se temperatura že spreminja enakomerno (izpustimo prvi dve po vrhu, če jih je dovolj)
  let tail = p.slice(iEx + 1);
  if (tail.length >= najmanj + 2) tail = tail.slice(1);
  if (tail.length < najmanj) return null;
  const n = tail.length, mx = tail.reduce((s, q) => s + q[0], 0) / n, my = tail.reduce((s, q) => s + q[1], 0) / n;
  const sxx = tail.reduce((s, q) => s + (q[0] - mx) ** 2, 0), sxy = tail.reduce((s, q) => s + (q[0] - mx) * (q[1] - my), 0);
  const k = sxx > 0 ? sxy / sxx : 0;
  return { T: my + k * (tMix - mx), k, n, tail, vrh: p[iEx] };
}
// Reakcijska entalpija iz meritev: ΔH = −m c ΔT / n (kJ/mol); m v g, c v J/(g K).
export const entalpija = ({ m, dT, n, c = 4.18 }) => (n > 0 ? (-m * c * dT) / n / 1000 : NaN);

// ================================================================ 3. plamenska reakcija
// Emisijske črte atomov (zrak, nm; NIST Atomic Spectra Database, 2024): Li I 670,78 (dublet 670,776/670,791), 610,36, 460,29;
// Na I 588,995 in 589,592 (D2, D1); K I 766,490, 769,896, 404,414, 404,721; Ca I 422,673; Sr I 460,733; Ba I 553,548;
// Cu I 510,554, 515,324, 521,820. Relativne jakosti v plamenu so ocena (Na izrazito najmočnejši).
// Molekulski pasovi (vrh in širina v nm, ocena po Pearse & Gaydon, The Identification of Molecular Spectra): CaOH 554 in 622,
// SrOH 606 in 682 (SrCl 646), BaOH/BaCl 513, 524, 532 (zelena), CuCl 435, 444, 488, 498 (modra in zelena).
export const CRTE = {
  Li: [[670.78, 1], [610.36, 0.04], [460.29, 0.005]],
  Na: [[588.995, 1], [589.592, 0.5]],
  K: [[766.49, 1], [769.9, 0.5], [404.414, 0.05], [404.721, 0.025]],
  Ca: [[422.673, 0.1]],
  Sr: [[460.733, 0.012]],
  Ba: [[553.548, 0.6]],
  Cu: [[510.554, 0.12], [515.324, 0.18], [521.82, 0.22]],
};
export const PASOVI = {
  Ca: [[554, 9, 0.25], [622, 14, 1]],
  Sr: [[606, 9, 0.15], [646, 8, 0.5], [682, 12, 1]],
  Ba: [[513, 6, 0.4], [524, 7, 0.55], [532, 7, 0.45]],
  Cu: [[435, 7, 0.25], [444, 6, 0.2], [488, 7, 0.35], [498, 7, 0.4]],
};
// Sevanje na enoto snovi na zanki (ocena; natrijeva svetloba je za oko ~100-krat svetlejša od litijeve, zato že sled natrija prekrije
// druge barve; kalij seva močno, a pri 766 in 770 nm, kjer je oko ~1000-krat manj občutljivo, zato je njegov plamen bled).
export const SVETLOST = { Li: 3, Na: 10, K: 100, Ca: 2.5, Sr: 3, Ba: 1.8, Cu: 2 };
// Kako hitro sol izhlapi iz zanke (τ, s; ocena: KCl in LiCl hitro, NaCl dlje; Ca, Sr, Ba kloridi se spremenijo v okside in svetijo dlje).
export const IZHLAPI = { Li: 5, Na: 9, K: 3, Ca: 7, Sr: 7, Ba: 7, Cu: 4 };
export const IONI = {
  Li: { name: "litij", ion: "Li⁺", barva: "karminasto rdeča", sol: "LiCl" },
  Na: { name: "natrij", ion: "Na⁺", barva: "rumena", sol: "NaCl" },
  K: { name: "kalij", ion: "K⁺", barva: "bledo vijolična", sol: "KCl" },
  Ca: { name: "kalcij", ion: "Ca²⁺", barva: "opečnato rdeča", sol: "CaCl₂" },
  Sr: { name: "stroncij", ion: "Sr²⁺", barva: "rdeča", sol: "SrCl₂" },
  Ba: { name: "barij", ion: "Ba²⁺", barva: "bledo zelena", sol: "BaCl₂" },
  Cu: { name: "baker", ion: "Cu²⁺", barva: "modro zelena", sol: "CuCl₂" },
};
export const BARVE_PLAMENA = ["rumena", "karminasto rdeča", "bledo vijolična", "opečnato rdeča", "rdeča", "bledo zelena", "modro zelena"];
// CIE 1931 2° funkcije barvnega ujemanja, analitični približek (Wyman, Sloan in Shirley, JCGT 2013, »multi-lobe«).
const g3 = (x, m, s1, s2) => {
  const t = (x - m) / (x < m ? s1 : s2);
  return Math.exp(-0.5 * t * t);
};
// Nad 680 nm je približek prenizek (pri 766 nm 6-krat), zato tam eksponentni rep, umerjen na tabelo CIE 1931 (x̄ 0,04677, ȳ 0,0170
// pri 680 nm, pada za e na 14,1 nm; pri 760 nm ȳ = 5,9 · 10⁻⁵, tabela 4,8 · 10⁻⁵). Kalijeve črte (766, 770 nm) zato komaj vidimo.
export function cmf(l) {
  if (l >= 680) {
    const e = Math.exp(-(l - 680) / 14.1);
    return [0.04677 * e, 0.017 * e, 0];
  }
  return [
    1.056 * g3(l, 599.8, 37.9, 31.0) + 0.362 * g3(l, 442.0, 16.0, 26.7) - 0.065 * g3(l, 501.1, 20.4, 26.2),
    0.821 * g3(l, 568.8, 46.9, 40.5) + 0.286 * g3(l, 530.9, 16.3, 31.1),
    1.217 * g3(l, 437.0, 11.8, 36.0) + 0.681 * g3(l, 459.0, 26.0, 13.8),
  ];
}
// XYZ → sRGB (IEC 61966-2-1): matrika, zunaj barvnega prostora dodamo belo (razbarvanje), nato gama.
const gama = (u) => (u <= 0.0031308 ? 12.92 * u : 1.055 * u ** (1 / 2.4) - 0.055);
export function xyzRgb([X, Y, Z]) {
  let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, b = 0.0557 * X - 0.204 * Y + 1.057 * Z;
  const mn = Math.min(r, g, b);
  if (mn < 0) (r -= mn), (g -= mn), (b -= mn);
  const mx = Math.max(r, g, b, 1e-12);
  return [r / mx, g / mx, b / mx].map((u) => Math.round(255 * gama(clamp(u, 0, 1))));
}
// Barva ene valovne dolžine (za spektroskop): čista spektralna barva, kolikor jo zmore zaslon.
export const valovRgb = (l) => xyzRgb(cmf(l));
// Kobaltovo modro steklo: prepušča modro (400–480 nm) in temno rdečo (nad ~690 nm), rumeno (589 nm) skoraj popolnoma zadrži
// (prepustnost ~0,1 %; ocena po prepustnostnih krivuljah kobaltovega stekla).
export function kobalt(l) {
  if (l < 400) return 0.4;
  if (l < 480) return 0.65 - ((l - 400) / 80) * 0.1;
  if (l < 540) return 0.55 * Math.exp(-(l - 480) / 12);
  if (l < 660) return 0.001;
  if (l < 720) return 0.001 + ((l - 660) / 60) * 0.6;
  return 0.75;
}
// Plamen plinskega gorilnika brez soli: nesvetel (moder; CH 431 nm, C₂ 516 in 473 nm, ocena jakosti) ali svetel (saje, ~1500 K).
const planck = (l, T) => 1 / (l ** 5 * (Math.exp(1.4388e7 / (l * T)) - 1));
export function spekterPlamena(zrak) {
  const out = [];
  const modri = 0.02 * zrak, saje = 1 - zrak;
  for (const [l, a] of [[431.4, 1], [516.5, 0.15], [473.7, 0.2]]) out.push({ l, I: modri * a, w: 3, vir: "plamen" });
  if (saje > 0.05) for (let l = 420; l <= 760; l += 10) out.push({ l, I: (saje * 60 * planck(l, 1500)) / planck(700, 1500) * 0.6, w: 10, vir: "saje" });
  return out;
}
// Spekter soli na zanki: črte in pasovi z jakostjo (količina × svetlost × relativna jakost).
export function spekterSoli(kol) {
  const out = [];
  for (const [el, n] of Object.entries(kol)) {
    if (!(n > 0)) continue;
    for (const [l, a] of CRTE[el] ?? []) out.push({ l, I: n * SVETLOST[el] * a, w: 0, el, crta: true });
    for (const [l, w, a] of PASOVI[el] ?? []) out.push({ l, I: n * SVETLOST[el] * a, w, el });
  }
  return out;
}
// Barva in svetlost, kot ju vidi oko (z modrim steklom ali brez). Pasove razdelimo na 2-nm korake.
export function barvaSpektra(sp, { steklo = false } = {}) {
  let X = 0, Y = 0, Z = 0;
  const add = (l, I) => {
    const f = steklo ? kobalt(l) : 1, [x, y, z] = cmf(l);
    X += I * f * x;
    Y += I * f * y;
    Z += I * f * z;
  };
  for (const q of sp) {
    if (!q.w) add(q.l, q.I);
    else {
      const s = q.w / 2.355;
      let norm = 0;
      const pts = [];
      for (let d = -2 * q.w; d <= 2 * q.w; d += 2) pts.push([q.l + d, Math.exp(-0.5 * (d / s) ** 2)]), (norm += pts.at(-1)[1]);
      for (const [l, a] of pts) add(l, (q.I * a) / norm);
    }
  }
  return { rgb: Y > 0 || X > 0 || Z > 0 ? xyzRgb([X, Y, Z]) : [0, 0, 0], Y };
}
// Delež svetlosti (Y), ki ga prispeva posamezen element.
export function delezSvetlosti(sp, el, o = {}) {
  const vse = barvaSpektra(sp, o).Y;
  const del = barvaSpektra(sp.filter((q) => q.el === el), o).Y;
  return vse > 0 ? del / vse : 0;
}
// Vzorci na urnih steklih: kloridi in štirje neznani (eden je zmes NaCl in KCl).
export const VZORCI = Object.fromEntries(Object.entries(IONI).map(([k, v]) => [k, { name: v.sol, sestava: { [k]: 1 } }]));
export function neznani(r) {
  const pool = ["Li", "Ca", "Sr", "Ba", "Cu", "K"];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const list = [{ Na: 0.3, K: 1 }, { [pool[0]]: 1 }, { [pool[1]]: 1 }, { [pool[2]]: 1 }];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return Object.fromEntries(list.map((s, i) => [`X${i + 1}`, { name: `neznani vzorec ${i + 1}`, sestava: s, neznan: true }]));
}
// Zanka iz nikroma: čista (po HCl in žarenju), umazana od prstov in prejšnjih vzorcev (natrij). Čiščenje: pomoči v koncentrirano HCl
// in žari, dokler plamen ni brezbarven; vsak krog odstrani ~85 % ostankov (ocena). Brez HCl se sol slabo prime: ~15 % (ocena).
export const ZANKA = { umazana: 0.3, ocisti: 0.15, brezHCl: 0.15, prenos: 0.3, cista: 0.003 };
export class PlamenBench {
  constructor({ seed = 1 } = {}) {
    const r = (this.r = rng(seed));
    this.ocala = false;
    this.zrak = 0; // odprtost zračne odprtine 0–1
    this.prizgan = false;
    this.steklo = false;
    this.vzorci = { ...VZORCI, ...neznani(r) };
    this.zanka = { Na: ZANKA.umazana, K: 0.02 }; // umazana od prstov
    this.namocena = false;
    this.vPlamenu = false;
    this.zadnji = null;
    this.t = 0;
    this.events = [];
    this.cistil = 0;
  }
  ocisti() {
    for (const k of Object.keys(this.zanka)) this.zanka[k] *= ZANKA.ocisti;
    this.namocena = true;
    this.cistil++;
    return this.ostanek();
  }
  ostanek() {
    return Object.values(this.zanka).reduce((s, x) => s + x, 0);
  }
  namoci() {
    this.namocena = true;
  }
  zajemi(id) {
    if (!this.ocala) return { ok: false, why: "ocala" };
    const V = this.vzorci[id];
    const f = this.namocena ? 1 : ZANKA.brezHCl;
    for (const [el, n] of Object.entries(V.sestava)) this.zanka[el] = (this.zanka[el] ?? 0) + n * f;
    this.namocena = false;
    this.zadnji = id;
    return { ok: true, slabo: f < 1 };
  }
  step(dt) {
    if (this.vPlamenu && this.prizgan) for (const k of Object.keys(this.zanka)) this.zanka[k] *= Math.exp(-dt / IZHLAPI[k] * (0.4 + 0.6 * this.zrak));
    this.t += dt;
  }
  spekter() {
    const s = this.prizgan ? spekterPlamena(this.zrak) : [];
    if (this.prizgan && this.vPlamenu) s.push(...spekterSoli(this.zanka));
    return s;
  }
  barva() {
    return barvaSpektra(this.spekter(), { steklo: this.steklo });
  }
  // Ali se barva soli vidi: delež svetlosti soli glede na plamen (svetel plamen s sajami jo prekrije).
  vidnostSoli() {
    const sp = this.spekter();
    const vse = barvaSpektra(sp, { steklo: this.steklo }).Y;
    const sol = barvaSpektra(sp.filter((q) => q.el), { steklo: this.steklo }).Y;
    return vse > 0 ? sol / vse : 0;
  }
  // Črte v ročnem spektroskopu (400–780 nm), ki jih oko še vidi; učenec jih odčita na lestvici na ±1 nm.
  odcitajCrte({ meja = 0.04 } = {}) {
    const sp = this.spekter().filter((q) => q.el);
    const vis = sp.map((q) => ({ ...q, v: q.I * Math.max(cmf(q.l)[1], 0.004) * (this.steklo ? kobalt(q.l) : 1) }));
    const max = Math.max(1e-12, ...vis.map((q) => q.v));
    return vis.filter((q) => q.v / max > meja && q.l >= 400 && q.l <= 780).sort((a, b) => b.v - a.v)
      .map((q) => ({ l: q.l, el: q.el, crta: !!q.crta, w: q.w, odcitek: Math.round(q.l + clamp(gauss(this.r, 0.7, 2), -1.5, 1.5)), rel: q.v / max }));
  }
}
// Energija fotona E = hc/λ (h = 6,62607015 · 10⁻³⁴ J s, c = 299 792 458 m/s, SI 2019), v eV (e = 1,602176634 · 10⁻¹⁹ C).
export const H_PLANCK = 6.62607015e-34, C_SV = 299792458, E_NAB = 1.602176634e-19;
export const energijaFotona = (nm) => (H_PLANCK * C_SV) / (nm * 1e-9);

export const POENOSTAVITVE_REAKCIJE = {
  hitrost: [
    "Hitrost raztapljanja marmorja je sorazmerna s površino koščkov in koncentracijo ionov H⁺; konstanta je ocenjena po šolskih meritvah. Koščki so enako veliki in se enakomerno manjšajo.",
    "Raztopina v bučki je dobro premešana; raztopljeni CO₂ in CO₂ v plinu nad tekočino (težji od zraka) sta upoštevana poenostavljeno, z ocenjenimi časovnimi konstantami.",
    "Magnezij v kislini: kinetika iz laboratorija »Kovine v kislinah« (hitrost ∝ površina × [H⁺]); plast oksida na traku in nečistoče niso upoštevane.",
    "Pri tiosulfatu je hitrost sorazmerna s koncentracijo tiosulfata in neodvisna od kisline (presežek kisline); križ izgine pri ocenjeni koncentraciji žvepla. Ea je ocena iz literature.",
    "Razkroj H₂O₂ je reakcija 1. reda; hitrostne konstante katalizatorjev (MnO₂, KI, katalaza v krompirju in jetrih) so ocenjene. Encim v resnici sledi Michaelis–Mentenini kinetiki in ga visoka koncentracija H₂O₂ počasi zavira.",
    "Kopel nima termostata in se počasi ohlaja; raztopini v kopeli imata takoj njeno temperaturo.",
  ],
  energija: [
    "Raztopine imajo specifično toploto in gostoto vode (4,18 J/(g K), 1 g/mL); v resnici imajo 1-molarne raztopine soli ~2–3 % manjšo toplotno kapaciteto.",
    "Izgube toplote skozi lonček, pokrov in gladino računamo kot pri laboratoriju »Mešanje vode«; lonček iz stiropora pobere zelo malo toplote, steklena čaša pa veliko.",
    "Plasti tople in hladne raztopine brez mešanja so opisane z eno ocenjeno časovno konstanto.",
    "Entalpije raztapljanja veljajo za neskončno razredčitev; pri nekaj gramih v 50–100 mL vode je razlika nekaj odstotkov.",
    "Nevtralizacija ocetne kisline: del energije porabi ionizacija šibke kisline, zato je sproščena toplota malo manjša (ocena −56,1 kJ/mol).",
  ],
  plamenska: [
    "Barvo plamena izračunamo iz emisijskih črt (NIST) in molekulskih pasov ter občutljivosti očesa (CIE 1931); jakosti črt in pasov so ocenjene.",
    "Natrij sveti veliko močneje od drugih elementov, zato že sled natrija na zanki prekrije druge barve.",
    "Sol izhlapeva iz zanke enakomerno (ena časovna konstanta za vsak element); v resnici se kloridi kalcija, stroncija in barija najprej spremenijo v okside.",
    "Spektroskop je idealen: črte so ostre, lestvica je točna, odčitamo jo na ±1 nm.",
  ],
};
