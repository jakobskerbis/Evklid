// Virtualni laboratorij, »Silomer in uteži«: Hookov zakon (lab-hooke), gostota trdnin in tekočin (lab-gostota),
// vzgon in Arhimedov zakon (lab-vzgon), hidrostatični tlak z manometrom (lab-tlak). Brez DOM (testi: test/laboratorij-sile.test.js).
// Vsaka številka ima vir ali je označena kot ocena. Enote: masa v g, prostornina v cm³ (= mL), dolžina v m, sila v N, tlak v Pa.
import { rng, gauss } from "./lab-model.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const napaka = (r, max, lim = 2.5) => gauss(r, max / lim, lim); // naključna napaka, ki nikoli ne preseže max

// ------------------------------------------------------------------ težni pospešek
// Šolska vrednost 9,81 m/s² (učenec računa z njo). Model računa s pravim g v Ljubljani: mednarodna formula za težni
// pospešek (GRS 80, Moritz 1980) na 46,05° severne širine je 9,8071 m/s², popravek za višino 295 m (−3,086·10⁻⁶ m/s² na meter) da 9,806 m/s².
export const G_SOLA = 9.81;
export const G_LJ = 9.806;

// ------------------------------------------------------------------ tekočine pri 20 °C (g/cm³)
// Voda 0,9982 (CRC Handbook), slana voda s 4 % NaCl 1,0268 (CRC, Concentrative properties of aqueous solutions; morje ~1,025),
// sončnično olje 0,920 (Engineering ToolBox: 0,919–0,925), etanol 0,7893 (CRC).
// hm: višina meniska ob steni valja (vse štiri omočijo steklo, menisk je vbočen); ocena iz kapilarne dolžine
// (voda 2,7 mm, etanol 1,7 mm, olje 1,9 mm), del, ki ga oko vidi kot »vrh« meniska.
export const TEKOCINE = {
  voda: { name: "voda", rho: 0.9982, hm: 0.002 },
  slana: { name: "slana voda (4 % soli)", rho: 1.0268, hm: 0.002 },
  olje: { name: "sončnično olje", rho: 0.92, hm: 0.0015 },
  etanol: { name: "etanol (alkohol)", rho: 0.7893, hm: 0.0013 },
};

// ------------------------------------------------------------------ uteži
// Komplet uteži s kavljem (ocena za šolski komplet): 10, 20, 20, 50, 100 in 200 g, skupaj 400 g.
// Odstopanje mase do največje dopustne napake OIML R111-1 (2004), razred M3: 10 g ±20 mg, 20 g ±25 mg, 50 g ±30 mg, 100 g ±50 mg, 200 g ±100 mg.
export const UTEZI = [10, 20, 20, 50, 100, 200];
export const UTEZI_MPE = { 10: 0.02, 20: 0.025, 50: 0.03, 100: 0.05, 200: 0.1 };

// ------------------------------------------------------------------ vzmeti (lab-hooke)
// Šolske vijačne vzmeti (ocena; podobne kompletom Phywe/Leybold): k ±5 %, meja prožnosti Fy, masa vzmeti m (kg), dolžina navojev L0 (m).
// Nad mejo prožnosti se vzmet trajno raztegne: dvočrtni model (ocena) z naklonom k/2 nad mejo; pri razbremenitvi se skrči s k,
// zato ostane trajni podaljšek (F − Fy)/k, nova meja pa je največja sila, ki je že delovala.
export const VZMETI = {
  mehka: { name: "mehka vzmet", k: 15, Fy: 2.5, m: 0.008, L0: 0.06 },
  srednja: { name: "srednja vzmet", k: 30, Fy: 3.0, m: 0.012, L0: 0.05 },
  trda: { name: "trda vzmet", k: 60, Fy: 8.0, m: 0.02, L0: 0.05 },
};
// tol: toleranca k (ocena), utrj: naklon nad mejo prožnosti glede na k (ocena), tau: dušenje nihanja (amplituda pade na 1/e v 2,5 s, ocena),
// amp: ko utež obesiš z roko, vzmet zaniha z 30 % spremembe podaljška (ocena), umiri: z roko zmanjšaš nihanje na 3 % (ocena).
// Ravnilo: 50 cm, razdelki 1 mm, odčitek na 1 mm. Paralaksa: ravnilo je 5 mm za kazalcem, oko 30 cm stran in 10 cm previsoko ali
// prenizko: zamik 5 mm · 10/30 ≈ 1,7 mm (ocena). Kazalec neobremenjene vzmeti je pri 4–6 cm (kako je ravnilo vpeto, ocena).
export const VZMET = { tol: 0.05, utrj: 0.5, tau: 2.5, amp: 0.3, umiri: 0.03, ravnilo: 0.5, paralaksa: 0.0017, mirna: 0.0005 };

export class HookeBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.utezi = UTEZI.map((n) => ({ n, m: idealno ? n : n + napaka(r, UTEZI_MPE[n]) }));
    this.kNom = Object.fromEntries(Object.keys(VZMETI).map((id) => [id, VZMETI[id].k * (idealno ? 1 : 1 + napaka(r, VZMET.tol))]));
    this.vzmeti = {};
    for (const id of Object.keys(VZMETI)) this.novaVzmet(id);
    this.izbrana = "mehka";
    this.obesene = []; // indeksi v this.utezi
    this.p0 = idealno ? 0.05 : 0.04 + 0.02 * r(); // odčitek kazalca neobremenjene vzmeti (m)
    this.osc = { A: 0, t: 0, w: 1 };
    this.t = 0;
  }
  novaVzmet(id) {
    this.vzmeti[id] = { id, k: this.kNom[id], Fy: VZMETI[id].Fy, set: 0 };
    if (this.izbrana === id) this.osc.A = 0;
  }
  get v() {
    return this.vzmeti[this.izbrana];
  }
  get masa() {
    return this.obesene.reduce((s, i) => s + this.utezi[i].m, 0) / 1000; // kg
  }
  get F() {
    return this.masa * G_LJ;
  }
  podaljsek() {
    return this.v.set + this.F / this.v.k;
  }
  get raztegnjena() {
    return this.v.set > 0.0005;
  }
  izberi(id) {
    this.obesene = [];
    this.izbrana = id;
    this.osc.A = 0;
  }
  // Sprememba obremenitve: nad mejo prožnosti trajni podaljšek, nato vzmet zaniha okoli nove lege.
  _nova(staro) {
    const v = this.v, F = this.F;
    if (F > v.Fy) (v.set += ((F - v.Fy) * (1 / VZMET.utrj - 1)) / v.k), (v.Fy = F);
    const d = staro - this.podaljsek();
    this.osc = { A: this.idealno ? 0 : VZMET.amp * d, t: 0, w: Math.sqrt(v.k / (this.masa + VZMETI[v.id].m / 3)) };
  }
  obesi(i) {
    if (this.obesene.includes(i)) return false;
    const x = this.trenutni();
    this.obesene.push(i);
    this._nova(x);
    return true;
  }
  snemi(i) {
    const x = this.trenutni();
    this.obesene = this.obesene.filter((j) => j !== i);
    this._nova(x);
  }
  umiri() {
    this.osc.A *= VZMET.umiri;
  }
  step(dt) {
    this.t += dt;
    this.osc.t += dt;
  }
  nihanje() {
    return Math.abs(this.osc.A) * Math.exp(-this.osc.t / VZMET.tau);
  }
  trenutni() {
    const o = this.osc;
    return this.podaljsek() + o.A * Math.exp(-o.t / VZMET.tau) * Math.cos(o.w * o.t);
  }
  // Lega kazalca na ravnilu (m) in odčitek na 1 mm; oko: 0 v višini kazalca, +1 previsoko (odčitek večji), −1 prenizko.
  polozaj() {
    return this.p0 + this.trenutni();
  }
  odcitek(oko = 0) {
    const x = this.polozaj() + oko * VZMET.paralaksa;
    if (x > VZMET.ravnilo) return { text: "> 50", value: NaN };
    const mm = Math.round(x * 1000);
    return { text: (mm / 10).toFixed(1), value: mm / 1000, mirna: this.nihanje() < VZMET.mirna };
  }
}

// Premica skozi izhodišče po metodi najmanjših kvadratov (k = Σxy/Σx²) in splošna premica y = a x + b.
export const naklonSkoziIzhodisce = (pts) => pts.reduce((s, [x, y]) => s + x * y, 0) / pts.reduce((s, [x]) => s + x * x, 0);
export function premica(pts) {
  const n = pts.length, sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[1], 0);
  const sxx = pts.reduce((s, p) => s + p[0] * p[0], 0), sxy = pts.reduce((s, p) => s + p[0] * p[1], 0);
  const a = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { a, b: (sy - a * sx) / n };
}

// ------------------------------------------------------------------ tehtnica in merilni valj (lab-gostota)
// Šolska tehtnica do 600 g, ločljivost 0,1 g, natančnost ±0,1 g (podatek proizvajalca, razred kot Kern EMB 600-1 ali Ohaus CS 200).
// Zamik do ±0,035 g, naklon do ±0,0025 % (pri 600 g 0,015 g), zaokrožanje 0,05 g: skupaj ≤ 0,1 g.
export const TEHTNICA = { tol: 0.1, max: 600, off: 0.035, gain: 2.5e-5 };
export function makeTehtnica(r) {
  return { off: napaka(r, TEHTNICA.off), gain: napaka(r, TEHTNICA.gain) };
}
export function tehtnicaRead(t, g) {
  if (g > TEHTNICA.max) return { text: "OL", value: NaN };
  const v = Math.round((g * (1 + t.gain) + t.off) * 10) / 10;
  return { text: v.toFixed(1), value: v };
}
// Steklen merilni valj 100 mL, razdelki 1 mL, razred B po ISO 4788 (±1,0 mL; razred A ±0,5 mL). Napaka skale e(V) = a·V/100 + b,
// |a| ≤ 0,6 mL, |b| ≤ 0,3 mL (skupaj ≤ 0,9 mL), zato je razlika dveh odčitkov točnejša od enega. Skala je dolga 18 cm (ocena: prerez
// 5,56 cm², notranji premer 2,66 cm), nad oznako 100 mL je še ~8 mL prostora (ocena). Odčitek na pol razdelka (0,5 mL).
// Prazen valj s podstavkom ima ~125 g (ocena, 110–140 g).
export const VALJ = { V: 100, tol: 1.0, a: 0.6, b: 0.3, visina: 0.18, rob: 8, korak: 0.5, mMin: 110, mMax: 140, Vmin: 10 };
export const VALJ_PREREZ = VALJ.V / (VALJ.visina * 100); // cm²
// Vzorci so valjčki s premerom 2,0 cm (prerez 3,14 cm²); kamen je nepravilne oblike (prostornina ±10 %, ocena), drugi so
// izdelani na ±1 % (ocena). Gostote pri 20 °C (g/cm³): aluminij 2,70 (CRC), jeklo 7,85 (Engineering ToolBox, konstrukcijsko jeklo),
// medenina 8,47 (CuZn37; Engineering ToolBox 8,4–8,73), baker 8,96 (CRC), smrekov les 0,45 (Engineering ToolBox 0,40–0,50, suh les; ocena),
// PVC 1,38 (Engineering ToolBox 1,30–1,45), granit 2,65 (Engineering ToolBox 2,6–2,8).
export const VZORCI = {
  aluminij: { name: "aluminij", rho: 2.7, V: [10, 20, 30] },
  jeklo: { name: "jeklo", rho: 7.85, V: [5, 10, 15] },
  medenina: { name: "medenina", rho: 8.47, V: [5, 10, 15] },
  baker: { name: "baker", rho: 8.96, V: [5, 10, 15] },
  les: { name: "les (smreka)", rho: 0.45, V: [10, 20, 30] },
  plastika: { name: "plastika (PVC)", rho: 1.38, V: [10, 20, 30] },
  kamen: { name: "kamen (granit)", rho: 2.65, V: [10, 20, 30], oblika: 0.1 },
};
export const VZOREC_PREREZ = Math.PI; // cm² (premer 2,0 cm)
// Zračni mehurček pod vzorcem, ki ga spustiš v valj: 0,4–1,0 mL (ocena). Tanka žica (premer 1 mm, ~6 cm pod vodo): 0,05 mL (ocena).
// Natakanje tekočine v valj »do oznake« z ±2 mL (ocena).
export const GOSTOTA = { mehMin: 0.4, mehMax: 1.0, zica: 0.05, natakanje: 2 };

export class GostotaBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.teh = idealno ? { off: 0, gain: 0 } : makeTehtnica(r);
    this.skala = idealno ? { a: 0, b: 0 } : { a: napaka(r, VALJ.a), b: napaka(r, VALJ.b) };
    this.mValj = idealno ? 125 : VALJ.mMin + (VALJ.mMax - VALJ.mMin) * r();
    this.vzorci = {};
    for (const [id, Z] of Object.entries(VZORCI))
      this.vzorci[id] = Z.V.map((V) => {
        const Vt = idealno ? V : V * (1 + napaka(r, Z.oblika ?? 0.01));
        return { V: Vt, m: Z.rho * Vt, H: Vt / VZOREC_PREREZ };
      });
    this.tek = null; // { id, V } tekočina v valju
    this.vzorec = null; // { id, i, Vizp, meh, zica, plava, potopljen }
    this.prelito = false;
  }
  // Natoči tekočino do oznake V (mL) v prazen valj; vrne pravo prostornino.
  nalij(id, V) {
    const Vt = this.idealno ? V : V + napaka(this.r, GOSTOTA.natakanje);
    this.tek = { id, V: Vt };
    this.vzorec = null;
    this.prelito = false;
    return Vt;
  }
  izprazni() {
    this.tek = null;
    this.vzorec = null;
    this.prelito = false;
  }
  // Vzorec v valj. nacin: "zdrsni" (nagnjen valj, vzorec počasi zdrsne ob steni) ali "spusti" (pade v vodo: ujame se mehurček).
  // zica: plavajoč vzorec potisneš pod gladino s tanko žico.
  potopi(id, i, { nacin = "zdrsni", zica = false } = {}) {
    if (!this.tek) return null;
    const z = this.vzorci[id][i], rhoT = TEKOCINE[this.tek.id].rho, A = VALJ_PREREZ, a = VZOREC_PREREZ;
    // plava, če ima manjšo gostoto in je dovolj tekočine, da ga dvigne (sicer obleži na dnu)
    const plava = VZORCI[id].rho < rhoT && !zica && (this.tek.V + z.m / rhoT) / A >= z.m / rhoT / a;
    let Vizp;
    if (plava) Vizp = z.m / rhoT; // izpodrine toliko tekočine, kolikor tehta
    else if (zica) Vizp = z.V + GOSTOTA.zica;
    else {
      // stoji na dnu: gladina se dvigne na (V + Vz)/A, če ga prekrije, sicer na V/(A − a)
      const hPoln = (this.tek.V + z.V) / A;
      Vizp = hPoln >= z.H ? z.V : a * (this.tek.V / (A - a));
    }
    const meh = nacin === "spusti" && !plava && !this.idealno ? GOSTOTA.mehMin + (GOSTOTA.mehMax - GOSTOTA.mehMin) * this.r() : 0;
    this.vzorec = { id, i, Vizp, meh, zica, plava, potopljen: plava ? false : zica || Vizp >= z.V - 1e-9, nacin };
    this.prelito = this.tek.V + Vizp + meh > VALJ.V + VALJ.rob;
    return this.vzorec;
  }
  vzemi() {
    this.vzorec = null;
  }
  // Prava prostornina do dna meniska (mL).
  gladina() {
    if (!this.tek) return 0;
    const v = this.vzorec;
    return Math.min(VALJ.V + VALJ.rob, this.tek.V + (v ? v.Vizp + v.meh : 0));
  }
  // Odčitek skale na pol mL. menisk: "dno" (prav) ali "vrh" (napaka: vrh meniska ob steni).
  odcitekV(menisk = "dno") {
    if (!this.tek) return { text: "–", value: NaN };
    let V = this.gladina();
    if (menisk === "vrh") V += TEKOCINE[this.tek.id].hm * 100 * VALJ_PREREZ;
    V += (this.skala.a * V) / 100 + this.skala.b;
    if (V > VALJ.V + 0.25) return { text: "> 100", value: NaN };
    if (V < VALJ.Vmin) return { text: "< 10", value: NaN };
    const v = Math.round(V / VALJ.korak) * VALJ.korak;
    return { text: v.toFixed(1), value: v };
  }
  tehtajVzorec(id, i) {
    return tehtnicaRead(this.teh, this.vzorci[id][i].m);
  }
  // Valj na tehtnici: prazen ali s tekočino (vzorec je zunaj).
  tehtajValj() {
    const m = this.mValj + (this.tek ? this.tek.V * TEKOCINE[this.tek.id].rho : 0);
    return tehtnicaRead(this.teh, m);
  }
}

// ------------------------------------------------------------------ silomer in vzgon (lab-vzgon)
// Silomer 0–5 N z razdelki po 0,05 N, skala dolga 10 cm (vzmet 50 N/m; ocena za šolske silomere, npr. Leybold 314 04).
// Natančnost ±0,05 N (en razdelek, ocena): naklon do ±0,5 % (pri 5 N 0,025 N), odčitek na pol razdelka (0,025 N, napaka ≤ 0,0125 N).
// Če ničle pred meritvijo ne naravnaš, kaže silomer brez bremena 0,08–0,20 N (ocena: vzmet se usede, silomer je bil obrnjen).
export const SILOMER = { max: 5, del: 0.05, branje: 0.025, k: 50, gain: 0.005, tol: 0.05, n0: 0.08, n1: 0.2 };
// Valja s kavljem: aluminij 100 cm³ (premer 4,0 cm, višina 7,96 cm), jeklo 50 cm³ (premer 3,0 cm, višina 7,07 cm); ±0,5 % (ocena).
// Posoda: visoka čaša 1000 mL, notranji premer 9,5 cm (ocena), 800 mL tekočine (globina 11,3 cm).
export const VALJI = {
  aluminij: { name: "aluminijast valj 100 cm³", rho: 2.7, V: 100, d: 0.04 },
  jeklo: { name: "jeklen valj 50 cm³", rho: 7.85, V: 50, d: 0.03 },
};
export const CASA_VZGON = { d: 0.095, V: 800 };
export const vzgon = (rho, Vcm3, g = G_LJ) => rho * 1000 * g * Vcm3 * 1e-6; // ρ v g/cm³, V v cm³, sila v N

export class VzgonBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.gain = idealno ? 0 : napaka(r, SILOMER.gain);
    this.nic0 = idealno ? 0 : SILOMER.n0 + (SILOMER.n1 - SILOMER.n0) * r();
    this.nicla = false; // je ničla naravnana?
    this.Vf = Object.fromEntries(Object.keys(VALJI).map((id) => [id, idealno ? 1 : 1 + napaka(r, 0.005)]));
    this.valj = "aluminij";
    this.tek = "voda";
    this.s = 0; // kako globoko pod prvotno gladino je dno valja (m); ≤ 0 nad gladino
    this.obesen = true;
  }
  get V() {
    return VALJI[this.valj].V * this.Vf[this.valj]; // cm³
  }
  get m() {
    return VALJI[this.valj].rho * this.V; // g
  }
  get a() {
    return (Math.PI * VALJI[this.valj].d ** 2) / 4; // m²
  }
  get H() {
    return (this.V * 1e-6) / this.a;
  }
  get A() {
    return (Math.PI * CASA_VZGON.d ** 2) / 4;
  }
  get h0() {
    return (CASA_VZGON.V * 1e-6) / this.A; // globina tekočine brez valja
  }
  // Globina potopljenega dela (m): gladina se dvigne, ko valj izpodriva tekočino.
  globina() {
    if (!this.tek || this.s <= 0) return 0;
    return Math.min(this.H, (Math.min(this.s, this.h0) * this.A) / (this.A - this.a));
  }
  Vizp() {
    return this.globina() * this.a * 1e6; // cm³
  }
  dno() {
    return this.tek != null && this.s > this.h0 + 1e-9;
  }
  // Prava sila na kavelj silomera (N): teža − vzgon − sila podlage, ko valj stoji na dnu in silomer spustiš še niže.
  sila() {
    if (!this.obesen) return 0;
    const W = (this.m / 1000) * G_LJ, Fv = this.tek ? vzgon(TEKOCINE[this.tek].rho, this.Vizp()) : 0;
    const N = this.dno() ? SILOMER.k * (this.s - this.h0) : 0;
    return Math.max(0, W - Fv - N);
  }
  odcitek() {
    const F = this.sila() * (1 + this.gain) + (this.nicla ? 0 : this.nic0);
    if (F > SILOMER.max + 0.1) return { text: "> 5", value: NaN };
    const v = Math.round(F / SILOMER.branje) * SILOMER.branje;
    return { text: fmtSila(v), value: v };
  }
}
// 2,625 → »2.625«, 2,650 → »2.65« (pol razdelka ima tri decimalke)
export const fmtSila = (v) => (Math.round(v * 1000) % 10 === 0 ? v.toFixed(2) : v.toFixed(3));

// ------------------------------------------------------------------ hidrostatični tlak in manometer (lab-tlak)
// p = ρ g h. Sonda: lijak z gumijasto opno, cevka do manometra (cevi oblike U z vodo, skala v mm, kraka ±15 cm od ničle).
// Opna nekaj tlaka »porabi« sama: manometer kaže 99 % tlaka ob opni (ocena za tanko mehko opno). Voda v manometru se ustali s
// časovno konstanto 0,8 s (ocena). Pri puščanju (slab spoj cevke) zrak uhaja in razlika višin pade na 1/e v 15 s (ocena).
// Kraka sta enako široka: en krak se spusti za Δh/2, drugi dvigne za Δh/2. Odčitek vsakega kraka na 1 mm.
// Posoda: visok steklen valj, 32 cm tekočine (ocena); sonda se spusti do 30 cm.
export const MANOMETER = { krak: 0.15, opna: 0.99, tau: 0.8, puscanje: 15, mm: 0.001, rho: TEKOCINE.voda.rho, hMax: 0.3, globina: 0.32 };
export const hidroTlak = (rho, h, g = G_LJ) => rho * 1000 * g * h; // Pa

export class TlakBench {
  constructor({ seed = 1, idealno = false } = {}) {
    this.r = rng(seed);
    this.idealno = idealno;
    this.tek = "voda";
    this.h = 0; // globina sredine opne (m)
    this.smer = "dol"; // kam gleda opna: dol | gor | stran
    this.pusca = false;
    this.pZrak = 0; // nadtlak zraka v cevki (Pa)
    this.pPrej = 0;
    this.dh = 0; // razlika višin v manometru (m)
    this.prelito = false;
    this.t = 0;
  }
  tlak() {
    return hidroTlak(TEKOCINE[this.tek].rho, this.h);
  }
  // Ko se tlak ob opni spremeni, se zrak v cevki stisne; smer opne ni pomembna (tlak deluje v vse smeri enako).
  step(dt) {
    this.t += dt;
    const p = this.tlak(), f = this.idealno ? 1 : MANOMETER.opna;
    this.pZrak += f * (p - this.pPrej);
    this.pPrej = p;
    if (this.pusca) this.pZrak *= Math.exp(-dt / MANOMETER.puscanje);
    if (this.prelito) return;
    const cilj = this.pZrak / (MANOMETER.rho * 1000 * G_LJ);
    this.dh = this.idealno ? cilj : this.dh + (cilj - this.dh) * (1 - Math.exp(-dt / MANOMETER.tau));
    if (this.dh / 2 > MANOMETER.krak) this.prelito = true;
  }
  // Ustaljeno stanje (za teste in »počakaj«).
  ustali() {
    for (let i = 0; i < 100; i++) this.step(0.1);
  }
  napolni() {
    this.prelito = false;
    this.pZrak = 0;
    this.pPrej = this.tlak();
    this.dh = 0;
  }
  // Odčitek krakov od ničle v mm: levi (proti sondi) se spusti, desni dvigne.
  odcitek() {
    if (this.prelito) return { levi: NaN, desni: NaN, dh: NaN };
    const L = Math.round((-this.dh / 2) * 1000), D = Math.round((this.dh / 2) * 1000);
    return { levi: L, desni: D, dh: D - L };
  }
}

// ------------------------------------------------------------------ poenostavitve (prikazane v simulaciji)
export const POENOSTAVITVE_SILE = {
  hooke: [
    "Vzmet in uteži so ves čas pri sobni temperaturi; vzmet se s časom ne »utrudi«.",
    "Prožnostni koeficient k pove, koliko sile potrebuješ, da vzmet podaljšaš za 1 m (ali za 1 cm). Pri teh vzmeteh smo ga ocenili, vsaka vzmet odstopa za do 5 %.",
    "Meja prožnosti je največja sila, po kateri se vzmet še vrne na prvotno dolžino. Tu je nastavljena (ocena); prava vzmet se raztegne malo drugače.",
    "Masa uteži je skoraj točno taka, kot piše na njih: 100-gramska utež odstopa največ za 0,05 g (šolske uteži, razred M3).",
    "Teža uteži je izračunana s težnim pospeškom v Ljubljani (9,806 m/s²), ti pa računaš z 9,81 m/s². Razlika je manj kot 0,1 %.",
    "Kako močno vzmet zaniha in kako hitro se umiri, je ocena.",
  ],
  gostota: [
    "Vse snovi imajo 20 °C. Gostote so iz tabel; pravi kos kovine ali lesa ima lahko malo drugačno gostoto.",
    "Kamen je nepravilne oblike, drugi vzorci so valjčki s premerom 2 cm.",
    "Merilni valj ima napako do 1 mL (razred B). Ker odšteješ dva odčitka, se večji del te napake odšteje.",
    "Višina meniska (ukrivljene gladine ob steni) in velikost zračnega mehurčka sta oceni.",
    "Ko vzorec vzameš iz valja, nanj ne ostanejo kapljice; tekočina ne izhlapeva.",
  ],
  vzgon: [
    "Silomer je točen na ±0,05 N (en razdelek); odčitaš ga na pol razdelka.",
    "Valj visi mirno in naravnost; ne niha in se ne dotika stene posode.",
    "Ko valj potopiš, se gladina v čaši dvigne; to je upoštevano, zato je potopljeni del malo daljši, kot si ga spustil.",
    "Sila na dno, ko valj stoji na njem, je izračunana iz vzmeti silomera (5 N na 10 cm).",
    "Vse tekočine imajo 20 °C in se med seboj ne mešajo.",
  ],
  tlak: [
    "Tlak zraka nad tekočino in nad manometrom je enak, zato manometer kaže le tlak tekočine.",
    "Gumijasta opna malo tlaka »porabi« sama (ocena 1 %); pri pravi sondi je to lahko več.",
    "Voda v manometru se umiri v nekaj sekundah, ne niha.",
    "Ko spustiš sondo, se gladina v posodi ne dvigne (posoda je široka).",
    "Kako hitro zrak uhaja iz cevke, ki pušča, je ocena.",
  ],
};
