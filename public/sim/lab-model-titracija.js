// Virtualni laboratorij: titracija kisline z NaOH ob indikatorju (model brez DOM; testi: test/laboratorij-titracija.test.js).
// Vsaka številka ima vir ali je označena kot ocena. Poenostavitve so v POENOSTAVITVE_TITRACIJA in v docs/laboratorij.md.
import { rng, gauss } from "./lab-model.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ------------------------------------------------------------------ ravnotežja (25 °C)
// Ionski produkt vode Kw = 1,0 · 10⁻¹⁴ pri 25 °C (pKw = 13,995; CRC Handbook, »Ionization constant of water«).
export const KW = 1.0e-14;
// Ocetna kislina: Ka = 1,75 · 10⁻⁵, pKa = 4,756 pri 25 °C (CRC Handbook, »Dissociation constants of organic acids
// in aqueous solution«; Harris, Quantitative Chemical Analysis, dodatek G).
export const KA_OCETNA = 1.75e-5;

// pH raztopine iz bilance nabojev: [H⁺] + [Na⁺] = [OH⁻] + [Cl⁻] + [CH₃COO⁻], [CH₃COO⁻] = c(ocetna) · Ka / (Ka + [H⁺]).
// Množine v mmol in prostornina v mL (mmol/mL = mol/L). Idealna raztopina: aktivnosti so enake koncentracijam.
// Leva stran minus desna narašča z [H⁺], zato je ničla ena sama: bisekcija po log[H⁺] med 10⁻¹⁵ in 10 mol/L.
export function solvePH({ cl = 0, ac = 0, na = 0, V }) {
  const Cl = cl / V, Ac = ac / V, Na = na / V;
  const f = (h) => h + Na - KW / h - Cl - (Ac * KA_OCETNA) / (KA_OCETNA + h);
  let lo = -15, hi = 1;
  for (let i = 0; i < 70; i++) {
    const mid = (lo + hi) / 2;
    if (f(10 ** mid) > 0) hi = mid;
    else lo = mid;
  }
  return -(lo + hi) / 2;
}

// ------------------------------------------------------------------ titrant in vzorci
// Titrant: standardizirana raztopina NaOH 0,1000 mol/L (faktor 1,000). V šoli in v laboratoriju je koncentracija
// titranta znana iz standardizacije; tu je točno 0,1000 mol/L, da je edina neznanka koncentracija vzorca.
export const NAOH_C = 0.1;
// Vzorci (»neznanke«): koncentracija je naključna (ponovljiva s seme), učenec jo določi s titracijo.
// Kis: 4,8–5,7 % ocetne kisline (kis v trgovini, ocena; 5 % = 0,833 mol/L), ki ga je laborant razredčil 1 : 10.
export const VZORCI = {
  hcl: { name: "klorovodikova kislina HCl", short: "HCl", mocna: true, c: [0.08, 0.12] },
  ocetna: { name: "ocetna kislina CH₃COOH", short: "CH₃COOH", mocna: false, c: [0.08, 0.12] },
  kis: { name: "kis, razredčen 1 : 10 (ocetna kislina)", short: "kis 1 : 10", mocna: false, c: [0.08, 0.095] },
};

// ------------------------------------------------------------------ indikatorji
// Prehodna območja in barve: CRC Handbook, »Acid–base indicators«; pKIn: Harris, Quantitative Chemical Analysis
// (metiloranž 3,46; bromtimol modro 7,1) in fenolftalein ~9,4 (sredina prehoda, ocena po območju 8,2–10,0).
// Barva sledi deležu bazične oblike In⁻ po Henderson–Hasselbalchu: x = 1 / (1 + 10^(pKIn − pH)).
// Barvo raztopine računamo kot svetlobo skozi raztopino: prepustnost T = 10^(−A) za rdečo, zeleno in modro, A je
// vsota absorbanc kisle in bazične oblike (oceni za 2 kapljici indikatorja v ~50 mL, izbrani tako, da so barve kot v šoli).
// konec: pH, pri katerem učenec vidi končno barvo. Dvobarvna indikatorja: ko je prehod končan (zgornji rob območja,
// metiloranž rumen, bromtimol moder). Enobarvni fenolftalein: prva obstojna bledo rožnata barva (spodnji rob 8,2).
export const INDIKATORJI = {
  brez: { name: "brez indikatorja", pKIn: null, obmocje: null, konec: Infinity, kisla: "brezbarvna", bazicna: "brezbarvna", A0: [0, 0, 0], A1: [0, 0, 0] },
  fenolftalein: { name: "fenolftalein", pKIn: 9.4, obmocje: [8.2, 10.0], konec: 8.2, kisla: "brezbarvna", bazicna: "rožnata", A0: [0, 0, 0], A1: [0.02, 0.9, 0.3] },
  // metiloranž: absorbanci izbrani tako, da je kisla oblika rdeča (~#d7301f), bazična rumeno oranžna (~#f5b924, λmax 464 nm), vmes oranžna (ocena).
  metiloranz: { name: "metiloranž", pKIn: 3.46, obmocje: [3.1, 4.4], konec: 4.4, kisla: "rdeča", bazicna: "rumena", A0: [0.064, 0.715, 0.905], A1: [0.007, 0.13, 0.84] },
  bromtimol: { name: "bromtimol modro", pKIn: 7.1, obmocje: [6.0, 7.6], konec: 7.6, kisla: "rumena", bazicna: "modra", A0: [0, 0.08, 0.75], A1: [0.95, 0.35, 0.06] },
};
export const inFraction = (ind, pH) => (ind.pKIn == null ? 0 : 1 / (1 + 10 ** (ind.pKIn - pH)));
// Barva raztopine [r, g, b] (0–255) pri pH; voda je rahlo modrikasta (prazna absorbanca 0,01).
export function indicatorColor(ind, pH) {
  const x = inFraction(ind, pH);
  return [0, 1, 2].map((i) => Math.round(255 * 10 ** -(0.01 + (1 - x) * ind.A0[i] + x * ind.A1[i])));
}
// Kakšno barvo učenec vidi (besedilo za dnevnik in bralnik zaslona).
export function colourName(ind, pH) {
  if (ind.pKIn == null) return "brezbarvna";
  if (ind === INDIKATORJI.fenolftalein) return pH >= 10.5 ? "močno rožnata" : pH >= 9.5 ? "rožnata" : pH >= ind.konec ? "bledo rožnata" : "brezbarvna";
  if (pH >= ind.konec) return ind.bazicna;
  if (pH <= ind.obmocje[0]) return ind.kisla;
  // metiloranž: ime sledi narisani barvi (rdeča do 3,2, oranžna, tik pred koncem prehoda oranžno rumena)
  if (ind === INDIKATORJI.metiloranz) return pH > 4.1 ? "oranžno rumena" : pH > 3.2 ? "oranžna" : ind.kisla;
  return "zelena";
}

// ------------------------------------------------------------------ pripomočki
// Bireta 50 mL, razred A: dovoljena napaka ±0,05 mL (ISO 385), razdelki po 0,1 mL, odčitamo na 0,05 mL.
// Notranji premer ~11 mm, zato je 0,1 mL dolg ~1,05 mm (ocena po merah birete). Umeritvena napaka je gladka funkcija
// odčitka e(R) = a · sin(πR/50) + b · R/50 z |a|, |b| ≤ 0,02 mL: razlika dveh odčitkov odstopa največ za 0,04 mL.
// Kapljica iz birete ~0,05 mL (Harris: »a drop from a 50-mL buret is about 0,05 mL«; v literaturi 0,03–0,05 mL),
// posamezna kapljica ±10 % (ocena). Pretok: pipa malo odprta ~2 kapljici na sekundo (0,1 mL/s, ocena);
// pipa povsem odprta ~1 mL/s (ocena; ISO 385 predpisuje iztočni čas polne birete v desetinah sekund).
// Mrtva prostornina pod oznako 50 mL (pipa in konica) ~2 mL (ocena). Voda, ki ostane v sprani bireti: ~0,8 mL
// (ocena: film ~40 μm na ~190 cm² stene in kapljice v konici). Zračni mehurček v konici po polnjenju prazne birete
// 0,2–0,5 mL (ocena); curek ga izrine po 0,3–1,5 mL iztoka (ocena), počasne kapljice ga ne premaknejo.
export const BIRETA = { V: 50, napaka: 0.05, razdelek: 0.1, odcitek: 0.05, mmNaML: 10.5, kapljica: 0.05, kapljice: 0.1, curek: 1.0, mrtva: 2, voda: 0.8, mehur: [0.2, 0.5], izrine: [0.3, 1.5] };
// Polnilna pipeta 25 mL, razred A: ±0,03 mL (ISO 648). Stalna napaka pipete do ±0,02 mL in ponovljivost do ±0,01 mL.
// Pipeta, mokra od pomivanja (ni splaknjena z vzorcem): ~0,2 mL vode (ocena: film ~25 μm na ~80 cm² stene pod oznako),
// ki razredči vzorec: kisline je ~0,8 % premalo.
export const PIPETA = { V: 25, napaka: 0.03, voda: 0.2 };
// Erlenmajerica po spiranju: ~0,5 mL tekočine na steni (ocena: film ~30 μm na ~150 cm²). Destilirana voda ne spremeni
// množine kisline; ostanek vzorca (splaknjena z vzorcem) jo poveča za ~2 %.
export const ERLENMAJERICA = { ostanek: 0.5 };
// pH-meter po umerjanju z dvema pufroma: natančnost ±0,02 pH, ločljivost 0,01 pH (ocena za laboratorijski pH-meter).
export const PH_METER = { napaka: 0.02, dec: 2 };

// Lokalna barva ob kapljici: v vrtinčeni raztopini izgine v ~0,3 s, blizu končne točke v do ~2,5 s (ocena).
const flashTau = (left, n0) => 0.3 + 2.2 * Math.exp(-Math.max(0, left) / Math.max(1e-9, 0.02 * n0));

export class TitrBench {
  constructor({ seed = 1 } = {}) {
    const r = (this.r = rng(seed));
    this.c = {};
    for (const [k, v] of Object.entries(VZORCI)) this.c[k] = Math.round((v.c[0] + (v.c[1] - v.c[0]) * r()) * 1e4) / 1e4;
    this.cNaOH = NAOH_C;
    this.pipErr = clamp(gauss(r, 0.008, 2.5), -0.02, 0.02);
    this.cal = { a: clamp(gauss(r, 0.008, 2.5), -0.02, 0.02), b: clamp(gauss(r, 0.008, 2.5), -0.02, 0.02) };
    const m = (this.meter = { off: clamp(gauss(r, 0.006, 2), -0.012, 0.012) });
    m.jit = () => clamp(gauss(r, 0.0015, 2), -0.003, 0.003);
    // bireta: u = prava prostornina pod oznako 0 (mL), c = koncentracija v bireti, vol = tekočina v bireti
    this.bur = { u: BIRETA.V + BIRETA.mrtva, vol: 0, c: 0, mokra: true, sprana: false, mehur: 0, izrine: 0, teklo: 0 };
    this.goggles = false;
    this.tap = "zaprta"; // zaprta | kapljice | curek
    this.flask = null;
    this.trial = 0; // števec erlenmajeric
    this.t = 0;
    this.dropT = 0;
    this.flash = 0;
    this.waste = 0; // mL titranta v čaši za odpadke
    this.events = [];
  }
  // ---------------------------------------------------------- bireta
  // Odčitek skale pri pravi prostornini u (spodnji rob meniska): R = u − e(u).
  calErr(R) {
    return this.cal.a * Math.sin((Math.PI * R) / BIRETA.V) + (this.cal.b * R) / BIRETA.V;
  }
  reading() {
    return this.bur.u - this.calErr(this.bur.u);
  }
  get filled() {
    return this.bur.vol > 0.01;
  }
  rinse() {
    if (!this.goggles) return { ok: false, why: "ocala" };
    this.waste += 15 + this.bur.vol;
    Object.assign(this.bur, { vol: 0, u: BIRETA.V + BIRETA.mrtva, mokra: false, sprana: true, mehur: 0, teklo: 0, c: 0 });
    return { ok: true };
  }
  // Napolni z lijakom nekoliko pod ničlo (odčitek 0,2–1,2 mL). Prazna bireta: v konici ostane zračni mehurček,
  // neoprana (mokra) bireta titrant razredči z vodo, ki je ostala v njej.
  fill() {
    if (!this.goggles) return { ok: false, why: "ocala" };
    const b = this.bur, r = this.r;
    const target = 0.2 + r() * 1.0;
    if (!this.filled) {
      const water = b.mokra ? BIRETA.voda : 0;
      b.mehur = BIRETA.mehur[0] + (BIRETA.mehur[1] - BIRETA.mehur[0]) * r();
      b.izrine = BIRETA.izrine[0] + (BIRETA.izrine[1] - BIRETA.izrine[0]) * r();
      b.teklo = 0;
      b.vol = BIRETA.V + BIRETA.mrtva - target - b.mehur;
      b.c = (this.cNaOH * (b.vol - water)) / b.vol;
      b.u = target;
      b.mokra = false;
      return { ok: true, water, mehur: b.mehur };
    }
    // dolivaš le, če je gladina pod ciljem; če je že nad njim, ostane, kjer je
    const add = Math.max(0, b.u - target);
    b.c = (b.c * b.vol + this.cNaOH * add) / (b.vol + add);
    b.vol += add;
    b.u -= add;
    return { ok: true, water: 0, mehur: b.mehur };
  }
  // Pipo za trenutek povsem odpreš nad čašo za odpadke: zrak iz konice odide, izteče ~1 mL.
  purge() {
    const b = this.bur;
    if (!this.goggles) return { ok: false, why: "ocala" };
    if (!this.filled) return { ok: false, why: "prazna" };
    // gladina ne pade pod oznako 50 mL (pod njo ni skale)
    const out = Math.max(0, Math.min(1 + 0.3 * this.r(), b.vol - 0.5, BIRETA.V - b.u - b.mehur));
    const had = b.mehur;
    b.u += out + b.mehur;
    b.vol -= out;
    b.mehur = 0;
    this.waste += out;
    return { ok: true, mehur: had };
  }
  // Iztok dV (mL) iz konice v erlenmajerico (ali v čašo, če je ni).
  flow(dV) {
    const b = this.bur;
    if (dV <= 0 || !this.filled) return 0;
    dV = Math.min(dV, Math.max(0, BIRETA.V - b.u), b.vol);
    if (dV <= 0) return 0;
    b.u += dV;
    b.vol -= dV;
    b.teklo += dV;
    if (this.flask) {
      const f = this.flask;
      f.na += b.c * dV;
      f.V += dV;
      f.added += dV;
      const n0 = f.cl + f.ac;
      this.flash = Math.min(1, this.flash + dV / BIRETA.kapljica);
      this.flashTau = flashTau(n0 - f.na, n0);
    } else this.waste += dV;
    return dV;
  }
  drop() {
    if (!this.filled || this.bur.u >= BIRETA.V) return 0;
    return this.flow(BIRETA.kapljica * (1 + clamp(gauss(this.r, 0.05, 2), -0.1, 0.1)));
  }
  // ---------------------------------------------------------- erlenmajerica
  // pipeta: "vzorec" (pravilno: splaknjena z vzorcem) | "mokra" (mokra od pomivanja, voda razredči vzorec).
  // erlenmajerica: "voda" (pravilno: splaknjena z destilirano vodo; voda ne spremeni množine kisline) | "suha" | "vzorec"
  // (splaknjena z vzorcem: ostanek vzorca doda kislino).
  pipette(id, { pipeta = "vzorec", erlenmajerica = "voda" } = {}) {
    if (!this.goggles) return { ok: false, why: "ocala" };
    const Vs = PIPETA.V + this.pipErr + clamp(gauss(this.r, 0.004, 2.5), -0.01, 0.01);
    const wet = PIPETA.voda;
    const n = this.c[id] * ((pipeta === "mokra" ? Vs - wet : Vs) + (erlenmajerica === "vzorec" ? ERLENMAJERICA.ostanek : 0));
    const V = Vs + (erlenmajerica === "suha" ? 0 : ERLENMAJERICA.ostanek);
    this.trial++;
    this.flask = { id, Vs, V, cl: VZORCI[id].mocna ? n : 0, ac: VZORCI[id].mocna ? 0 : n, na: 0, ind: "brez", added: 0, trial: this.trial, pipeta, erlenmajerica };
    this.flash = 0;
    return { ok: true, Vs };
  }
  addIndicator(id) {
    if (!this.flask) return { ok: false, why: "ni-vzorca" };
    if (this.flask.ind !== "brez") return { ok: false, why: "ze" };
    this.flask.ind = id;
    return { ok: true };
  }
  pH() {
    const f = this.flask;
    return f ? solvePH({ cl: f.cl, ac: f.ac, na: f.na, V: f.V }) : 7;
  }
  colour() {
    return indicatorColor(INDIKATORJI[this.flask?.ind || "brez"], this.pH());
  }
  // Ali učenec vidi končno barvo (obstojno).
  endSeen() {
    const f = this.flask;
    return !!f && f.ind !== "brez" && this.pH() >= INDIKATORJI[f.ind].konec;
  }
  // Odčitek pH-metra: stalna napaka umeritve do ±0,012, nihanje do ±0,003, zaokroženo na 0,01: skupaj največ ±0,02.
  readPH() {
    return Math.round((this.pH() + this.meter.off + this.meter.jit()) * 100) / 100;
  }
  rate() {
    return this.tap === "curek" ? BIRETA.curek : this.tap === "kapljice" ? BIRETA.kapljice : 0;
  }
  step(dt) {
    this.t += dt;
    const b = this.bur;
    if (this.tap === "curek") {
      this.flow(BIRETA.curek * dt);
      // curek izrine zračni mehurček: gladina pade za njegovo prostornino, v erlenmajerico ne priteče nič več
      if (b.mehur > 0 && b.teklo >= b.izrine) {
        this.events.push({ type: "mehurcek", V: b.mehur });
        b.u += b.mehur;
        b.mehur = 0;
      }
    } else if (this.tap === "kapljice") {
      this.dropT += dt;
      while (this.dropT >= BIRETA.kapljica / BIRETA.kapljice) (this.dropT -= BIRETA.kapljica / BIRETA.kapljice), this.drop();
    }
    if (this.tap !== "zaprta" && (!this.filled || b.u >= BIRETA.V - 1e-9)) {
      this.tap = "zaprta";
      this.events.push({ type: "prazna" });
    }
    this.flash *= Math.exp(-dt / (this.flashTau || 0.3));
  }
}

// Prostornina titranta do točke, kjer pH doseže pHend (bisekcija po V; za teste in razlago).
export function volumeAtPH({ id, c, Vs = PIPETA.V, cNaOH = NAOH_C }, pHend) {
  const n = c * Vs, strong = VZORCI[id]?.mocna ?? id === "hcl";
  const pHat = (V) => solvePH({ cl: strong ? n : 0, ac: strong ? 0 : n, na: cNaOH * V, V: Vs + V });
  let lo = 0, hi = (2 * n) / cNaOH;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (pHat(mid) >= pHend) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

export const POENOSTAVITVE_TITRACIJA = [
  "Raztopine so idealne: pH je izračunan s koncentracijami namesto z aktivnostmi. Pravi pH-meter v 0,1 mol/L HCl pokaže okoli 1,1 namesto 1,00.",
  "Temperatura je ves čas 25 °C; toplota nevtralizacije razredčene raztopine segreje za manj kot 1 °C.",
  "Indikator (2 kapljici) ne spremeni pH raztopine in ne prostornine. Barva je izračunana iz deleža obeh oblik indikatorja z ocenjenimi absorbancami.",
  "Titrant NaOH ima točno 0,1000 mol/L in ne vpija CO₂ iz zraka (pravo raztopino NaOH je treba standardizirati).",
  "Raztopino v erlenmajerici ves čas vrtinčiš, zato je takoj premešana; lokalna barva ob kapljici izgine v ocenjenem času.",
  "Voda v neoprani bireti se takoj enakomerno premeša s titrantom. Velikost zračnega mehurčka, kapljice in pretok so ocene.",
  "Pipetiranje (v resnici ~30 s iztoka in 15 s čakanja) je skrajšano na nekaj sekund. pH-meter se odzove takoj.",
];
