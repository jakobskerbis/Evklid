// Virtualni laboratorij: fizikalni in kemijski modeli (brez DOM; uvozijo jih tudi testi v test/laboratorij.test.js).
// Vsaka številka ima vir ali je označena kot ocena. Poenostavitve so naštete v POENOSTAVITVE in v docs/laboratorij.md.

// ------------------------------------------------------------------ naključje in šum
// Ponovljivo naključje (mulberry32), da so testi določeni.
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Normalna porazdelitev (Box–Muller), odrezana pri ±lim standardnih odklonih.
export function gauss(r, sd = 1, lim = 3) {
  const u = Math.max(r(), 1e-12), v = r();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return sd * Math.max(-lim, Math.min(lim, z));
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ------------------------------------------------------------------ fizikalne konstante
export const R_PLIN = 8.314462618; // J/(mol·K), CODATA 2018
export const T_SOBA = 293.15; // K (20 °C)
export const P_ATM = 101325; // Pa
// Molska prostornina idealnega plina pri 20 °C in 101,325 kPa: V = RT/p = 24,055 L/mol.
export const VM_SOBA = (R_PLIN * T_SOBA) / P_ATM; // m³/mol

// ------------------------------------------------------------------ merilni instrumenti
// Digitalni multimeter s 3½ mesta (2000 točk). Natančnost kot v navodilih šolskih multimetrov
// (npr. UNI-T UT33, Voltcraft VC130): DC napetost ±(0,5 % + 2 digita), DC tok mA ±(1,0 % + 2 digita),
// DC tok 10 A ±(2,0 % + 5 digitov). Notranji upor voltmetra 10 MΩ. Padec na ampermetru (ocena za
// tovrstne merilnike): območje 20 mA 10 Ω, 200 mA 1 Ω, 10 A 0,01 Ω. Varovalki: vhod mA F 200 mA, vhod 10 A F 10 A.
export const VM_RANGES = {
  "2": { max: 2, dec: 3, unit: "V", k: 1 },
  "20": { max: 20, dec: 2, unit: "V", k: 1 },
  "200": { max: 200, dec: 1, unit: "V", k: 1 },
};
export const AM_RANGES = {
  "20m": { max: 0.02, dec: 2, unit: "mA", k: 1e3, rsh: 10, fuse: 0.2 },
  "200m": { max: 0.2, dec: 1, unit: "mA", k: 1e3, rsh: 1, fuse: 0.2 },
  "10": { max: 10, dec: 2, unit: "A", k: 1, rsh: 0.01, fuse: 10 },
};
export const R_VOLTMETER = 10e6;
const SPEC = { V: [0.005, 2], A: [0.01, 2], A10: [0.02, 5] };

// Merilnik ima svojo stalno napako (umeritev), ki je manjša od specifikacije, in majhno nihanje zadnjega mesta.
export function makeMeter(r) {
  return { gain: gauss(r, 1 / 3, 2.4), off: gauss(r, 0.4, 2), r };
}
// Odčitek: vrne { text, value, over } v enotah zaslona. value je število, ki ga učenec vidi.
export function meterRead(m, trueValue, range, kind) {
  const [pct, digits] = kind === "V" ? SPEC.V : range.unit === "A" ? SPEC.A10 : SPEC.A;
  const shown = trueValue * range.k;
  const step = 10 ** -range.dec;
  if (Math.abs(trueValue) > range.max * 0.99995) return { text: "OL", value: NaN, over: true };
  // stalna napaka: do 0,8 specifikacije v %, do 0,8 digita zamika; nihanje do 0,6 digita
  const gain = clamp(m.gain, -0.8, 0.8) * pct;
  const off = clamp(m.off, -0.8, 0.8) * Math.min(1, digits / 2);
  const jit = gauss(m.r, 0.25, 2.4);
  const counts = Math.round((shown * (1 + gain)) / step + off + jit);
  const value = counts * step;
  return { text: value.toFixed(range.dec), value, over: false };
}
// Dovoljeno odstopanje po specifikaciji (za teste in za razlago učencu).
export function meterSpec(trueValue, range, kind) {
  const [pct, digits] = kind === "V" ? SPEC.V : range.unit === "A" ? SPEC.A10 : SPEC.A;
  return Math.abs(trueValue * range.k) * pct + digits * 10 ** -range.dec;
}

// Talilna varovalka, hitra (F), po IEC 60127-2 (standardni list 1): pri 1,5 × In zdrži vsaj 1 h, pri 2,1 × In
// pregori v 30 min, pri 2,75 × In v 10 ms–2 s, pri 4 × In v 3 ms–0,3 s, pri 10 × In v manj kot 20 ms.
// Model: segrevanje Q raste kot 0,55 · (x² − 1,5²) za x = I/In > 1,5 in varovalka pregori pri Q = 1
// (čas t = 1 / (0,55 · (x² − 2,25))); pod 1,5 × In ne pregori.
export function fuseRate(I, In) {
  const x = Math.abs(I) / In;
  return x > 1.5 ? 0.55 * (x * x - 2.25) : 0;
}

// ------------------------------------------------------------------ Ohmov zakon: deli
// Kovinsko-plastni upori (E12, toleranca ±5 %, nazivna moč 0,5 W, temperaturni koeficient 50 ppm/K).
// Toplotna upornost 0,5 W upora ~170 K/W (0,5 W pri 70 °C okolice do 155 °C), časovna konstanta ~8 s (ocena).
// Upor zgori (ožgana prevleka, dim), ko se segreje nad ~350 °C (ocena).
export const UPOR = { P: 0.5, tol: 0.05, alfa: 50e-6, rth: 170, tau: 8, tZgori: 350 };
// Žarnica z volframovo nitko 6 V / 0,1 A. Pravila za žarnice (npr. IES Lighting Handbook):
// moč ∝ U^1,6 (torej tok ∝ U^0,6), svetlobni tok ∝ U^3,4. Hladna nitka ima ~10-krat manjši upor od vroče.
// Življenjska doba ∝ U^−13 (isti vir), nazivna 1000 h (ocena za majhne žarnice): pri 9 V bi zdržala ~5 h.
// Nad 1,8-kratno nazivno napetostjo nitka po kratkem močnem bliskanju (0,6 s) pregori (ocena).
export const ZARNICA = { Ur: 6, Ir: 0.1, eksp: 0.6, svet: 3.4, hladna: 0.1, zivljenje: 1000 * 3600, zivEksp: 13 };
export const LOADS = {
  R47: { type: "R", nom: 47, name: "upornik 47 Ω" },
  R100: { type: "R", nom: 100, name: "upornik 100 Ω" },
  R220: { type: "R", nom: 220, name: "upornik 220 Ω" },
  R470: { type: "R", nom: 470, name: "upornik 470 Ω" },
  L6: { type: "L", name: "žarnica 6 V / 0,1 A" },
};
// Šolski laboratorijski napajalnik 0–12 V z omejitvijo toka 1 A (način CC), notranji upor 0,05 Ω.
export const NAPAJALNIK = { max: 12, ilim: 1, rs: 0.05 };

export function lampR(U) {
  const { Ur, Ir, eksp, hladna } = ZARNICA;
  const Rh = Ur / Ir;
  return Math.max(Rh * hladna, Rh * Math.pow(Math.abs(U) / Ur, 1 - eksp));
}

// Linearni sistem G·v = i (Gaussova eliminacija z izbiro pivota).
export function solveLinear(G, b) {
  const n = b.length;
  const A = G.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    const d = A[c][c] || 1e-300;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = A[r][c] / d;
      if (f) for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k];
    }
  }
  return A.map((row, i) => row[n] / (row[i] || 1e-300));
}

// Električni krog: napajalnik, porabnik in merilnika, ki ju učenec priključi zaporedno, vzporedno s
// porabnikom ali ju ne priključi. Rešimo ga z metodo vozlišč (napajalnik kot Nortonov vir).
export class OhmBench {
  constructor({ seed = 1 } = {}) {
    const r = (this.r = rng(seed));
    this.U0 = 0;
    this.load = "R100";
    this.amPos = "zaporedno";
    this.vmPos = "vzporedno";
    this.amRange = "200m";
    this.vmRange = "20";
    this.fuse = { mA: { Q: 0, blown: false }, A10: { Q: 0, blown: false } };
    this.am = makeMeter(r);
    this.vm = makeMeter(r);
    this.parts = {};
    for (const [id, L] of Object.entries(LOADS))
      this.parts[id] = L.type === "R" ? { R: L.nom * (1 + clamp(gauss(r, UPOR.tol / 2.2, 2.2), -UPOR.tol, UPOR.tol)), T: 20, burnt: false, hotSaid: false } : { over: 0, burnt: false };
    this.t = 0;
    this.events = [];
    this.solve();
  }
  get part() {
    return this.parts[this.load];
  }
  fuseOf(range = this.amRange) {
    return AM_RANGES[range].unit === "A" ? this.fuse.A10 : this.fuse.mA;
  }
  loadR(U) {
    const L = LOADS[this.load], p = this.part;
    if (p.burnt) return 1e12;
    if (L.type === "R") return p.R * (1 + UPOR.alfa * (p.T - 20));
    return lampR(U);
  }
  // Sestavi vezje in izračuna napetosti in tokove.
  solve() {
    const els = [];
    let n = 2; // 0 = minus, 1 = plus napajalnika
    let a = 1;
    const amR = () => (this.fuseOf().blown ? 1e12 : AM_RANGES[this.amRange].rsh);
    for (const [kind, pos] of [["A", this.amPos], ["V", this.vmPos]])
      if (pos === "zaporedno") els.push({ kind, a, b: n }), (a = n++);
    els.push({ kind: "load", a, b: 0 });
    if (this.amPos === "vzporedno") els.push({ kind: "A", a, b: 0 });
    if (this.vmPos === "vzporedno") els.push({ kind: "V", a, b: 0 });
    const N = n - 1; // neznanke: vozlišča 1..n-1
    let Rl = this.loadR(this.lastUl ?? ZARNICA.Ur);
    let cc = false, v = [];
    // Napajalnik: najprej kot vir napetosti (CV); če bi tok presegel omejitev, kot vir toka (CC).
    // Način določimo pri vsakem koraku iteracije znova, ker se upor žarnice spreminja (v CC je napetost vedno pod nastavljeno).
    const nodal = (ccMode) => {
      const G = Array.from({ length: N }, () => new Array(N).fill(0));
      const I = new Array(N).fill(0);
      const add = (i, j, g) => {
        if (i > 0) G[i - 1][i - 1] += g;
        if (j > 0) G[j - 1][j - 1] += g;
        if (i > 0 && j > 0) (G[i - 1][j - 1] -= g), (G[j - 1][i - 1] -= g);
      };
      for (const e of els) add(e.a, e.b, 1 / e.R);
      if (ccMode) I[0] += NAPAJALNIK.ilim;
      else add(1, 0, 1 / NAPAJALNIK.rs), (I[0] += this.U0 / NAPAJALNIK.rs);
      return [0, ...solveLinear(G, I)];
    };
    for (let it = 0; it < 80; it++) {
      for (const e of els) e.R = e.kind === "A" ? amR() : e.kind === "V" ? R_VOLTMETER : Rl;
      v = nodal(false);
      cc = (this.U0 - v[1]) / NAPAJALNIK.rs > NAPAJALNIK.ilim;
      if (cc) v = nodal(true);
      const load = els.find((e) => e.kind === "load");
      const Ul = v[load.a] - v[load.b];
      const Rn = this.loadR(Ul);
      if (Math.abs(Rn - Rl) / Rl < 1e-7) break;
      Rl = Math.sqrt(Rl * Rn);
    }
    const res = { cc, Usup: v[1], Isup: cc ? NAPAJALNIK.ilim : (this.U0 - v[1]) / NAPAJALNIK.rs };
    for (const e of els) {
      const U = v[e.a] - v[e.b], I = U / e.R;
      if (e.kind === "load") (res.Uload = U), (res.Iload = I), (res.Rload = e.R), (this.lastUl = U);
      if (e.kind === "A") res.Iam = I;
      if (e.kind === "V") res.Uvm = U;
    }
    res.Iam ??= null;
    res.Uvm ??= null;
    return (this.state = res);
  }
  // Čas teče v korakih po 10 ms: segrevanje upora, nitka žarnice, varovalka v ampermetru.
  step(dt) {
    for (let left = dt; left > 1e-9; left -= 0.01) {
      const h = Math.min(0.01, left);
      const st = this.solve();
      const L = LOADS[this.load], p = this.part;
      if (!p.burnt && L.type === "R") {
        const P = st.Uload * st.Iload;
        p.T += (h * (20 + P * UPOR.rth - p.T)) / UPOR.tau;
        if (P > UPOR.P * 1.05 && !p.hotSaid) (p.hotSaid = true), this.events.push({ t: this.t, type: "vroc", P });
        if (p.T > UPOR.tZgori) (p.burnt = true), this.events.push({ t: this.t, type: "zgorel", P });
      } else if (!p.burnt) {
        const u = Math.abs(st.Uload) / ZARNICA.Ur;
        p.over = u > 1.8 ? p.over + h : 0;
        p.wear = (p.wear || 0) + (h * u ** ZARNICA.zivEksp) / ZARNICA.zivljenje;
        if (p.over > 0.6 || p.wear >= 1) (p.burnt = true), this.events.push({ t: this.t, type: "nitka" });
      }
      if (st.Iam != null) {
        const f = this.fuseOf();
        if (!f.blown) {
          f.Q += h * fuseRate(st.Iam, AM_RANGES[this.amRange].fuse);
          if (f.Q >= 1) (f.blown = true), this.events.push({ t: this.t, type: "varovalka", I: st.Iam });
        }
      }
      if (st.cc && !this.ccSaid) (this.ccSaid = true), this.events.push({ t: this.t, type: "cc" });
      if (!st.cc) this.ccSaid = false;
      this.t += h;
    }
    return this.solve();
  }
  // Ohladitev po izklopu ni potrebna za merjenje; upor se ohladi sam med koraki.
  readA() {
    const st = this.state;
    if (st.Iam == null) return null;
    return meterRead(this.am, st.Iam, AM_RANGES[this.amRange], "A");
  }
  readV() {
    const st = this.state;
    if (st.Uvm == null) return null;
    return meterRead(this.vm, st.Uvm, VM_RANGES[this.vmRange], "V");
  }
  brightness() {
    const L = LOADS[this.load];
    if (L.type !== "L" || this.part.burnt) return 0;
    return Math.min(1.6, Math.pow(Math.abs(this.state.Uload) / ZARNICA.Ur, ZARNICA.svet));
  }
  replaceFuse() {
    this.fuseOf().blown = false;
    this.fuseOf().Q = 0;
  }
  replacePart() {
    const L = LOADS[this.load];
    this.parts[this.load] = L.type === "R" ? { R: L.nom * (1 + clamp(gauss(this.r, UPOR.tol / 2.2, 2.2), -UPOR.tol, UPOR.tol)), T: 20, burnt: false, hotSaid: false } : { over: 0, burnt: false };
  }
}

// Premica skozi izhodišče po metodi najmanjših kvadratov: y = k·x.
export function fitOrigin(pts) {
  let sxy = 0, sxx = 0;
  for (const [x, y] of pts) (sxy += x * y), (sxx += x * x);
  return sxx ? sxy / sxx : NaN;
}

// ------------------------------------------------------------------ CO₂ iz sode bikarbone in kisline
// NaHCO₃ + H⁺ → Na⁺ + H₂O + CO₂. M(NaHCO₃) = 84,007 g/mol, M(CO₂) = 44,009 g/mol, M(CaCO₃) = 100,086 g/mol
// (IUPAC 2021, standardne atomske mase).
export const M = { NaHCO3: 84.007, CO2: 44.009, CaCO3: 100.086, citronska: 192.12 };
// Povprečna molska masa suhega zraka 28,96 g/mol (ISO 2533, standardna atmosfera).
export const M_ZRAK = 28.96;
// Kisline: koncentracija kislih protonov, ki reagirajo s hidrogenkarbonatom, gostota pri 20 °C.
// - limonin sok: 46,7 g/L citronske kisline (Penniston in sod., J Endourol 2008: 1,38 g na unčo) = 0,243 mol/L,
//   triprotonska; ker CO₂ uhaja, reagirajo vsi trije protoni (3 NaHCO₃ + C₆H₈O₇ → Na₃C₆H₅O₇ + 3 H₂O + 3 CO₂);
//   gostota ~1,03 g/mL (ocena).
// - kis: 5 % ocetna kislina (50 g/L, M = 60,05 g/mol) = 0,833 mol/L, gostota 1,006 g/mL.
// - klorovodikova kislina 1 mol/L, gostota 1,016 g/mL (CRC Handbook).
// tau = čas, v katerem se pri presežku kisline porabi ~63 % sode v prahu (ocena po trajanju penjenja v šoli),
// pena = koliko sekund mehurček v povprečju ostane v peni (ocena; limonin sok se peni bolj).
export const ACIDS = {
  limona: { name: "limonin sok", cH: 0.243 * 3, rho: 1.03, tau: 6, pena: 1.5 },
  kis: { name: "kis (5 % ocetna kislina)", cH: 0.833, rho: 1.006, tau: 6, pena: 1.5 },
  hcl: { name: "klorovodikova kislina, 1 mol/L", cH: 1.0, rho: 1.016, tau: 2, pena: 0.5, nevarno: true },
  voda: { name: "voda", cH: 0, rho: 0.998, tau: Infinity, pena: 0 },
};
// Topnost CO₂ v vodi pri 20 °C in tlaku CO₂ 1 atm: 0,038 mol/L (Sander, Atmos. Chem. Phys. 2015:
// kH(25 °C) = 0,033 mol/(L·atm), temperaturna odvisnost 2400 K). Raztopljeni CO₂ uhaja počasi (tau ~300 s, ocena).
export const CO2_TOPNOST = 0.038;
// Apnica: nasičena raztopina Ca(OH)₂, topnost 1,73 g/L pri 20 °C (CRC) = 0,0233 mol/L; v epruveti 10 mL.
// Mehurček skozi ~6 cm apnice odda ~15 % CO₂ (ocena); ko je Ca(OH)₂ porabljen, CaCO₃ s CO₂ in vodo
// počasi preide v topen Ca(HCO₃)₂ (~3 % CO₂ iz mehurčka, ocena), zato se apnica ob dolgem uvajanju zbistri.
// Motnost: 0,15 g/L CaCO₃ zakrije ~63 % prosojnosti (ocena).
export const APNICA = { c: 0.0233, V: 0.01, f1: 0.15, f2: 0.03, motnost: 0.15 };
// Erlenmajerica 100 mL: do vratu drži ~130 mL (ocena po merah ISO 1773), masa ~75 g (borosilikatno steklo).
// Gumijasti zamašek brez cevke izleti pri nadtlaku ~20 kPa (ocena). Trska ugasne, ko je kisika manj kot 15 %
// (ocena; za sveče se navaja meja 15–16 % O₂). Zrak ima 20,95 % O₂ (suh zrak).
export const BUCKA = { V: 0.13, masa: 75, zamasek: 20000, o2zrak: 0.2095, o2meja: 0.15 };
// Tehtnica: berljivost 0,01 g, ponovljivost ±0,01 g; med burnim penjenjem zaradi tresljajev do ±0,03 g.

export class Co2Bench {
  constructor({ seed = 1 } = {}) {
    this.r = rng(seed);
    this.flaskMass = BUCKA.masa + gauss(this.r, 1.2, 2);
    this.acid = null; // { id, V, nH0, nH }
    this.soda = 0; // mol trdne sode v bučki
    this.sodaAdded = 0; // g
    this.dissolved = 0; // mol raztopljenega CO₂
    this.escaped = 0; // mol CO₂, ki je ušel iz bučke
    this.spilled = 0; // g razlite tekočine
    this.liquidMass = 0; // g nalite tekočine
    this.x = 0; // delež CO₂ v zraku nad tekočino
    this.dp = 0; // nadtlak pod zamaškom
    this.zamasek = "brez"; // brez | cevka | zaprto
    this.epruveta = "apnica"; // apnica | voda
    this.ca = { free: APNICA.c * APNICA.V, caco3: 0, hco3: 0 };
    this.rate = 0; // mol/s nastajanja plina
    this.foam = 0; // L pene
    this.t = 0;
    this.t0 = null; // čas prvega stika sode in kisline
    this.events = [];
    this.flame = null;
  }
  get Vliq() {
    return this.acid ? this.acid.V : 0;
  }
  // Nalij kislino (mL). Merilni valj 100 mL z razdelki po 1 mL: odčitamo na ±0,5 mL.
  pour(id, mL) {
    const A = ACIDS[id];
    const V = Math.max(0, mL + gauss(this.r, 0.25, 2)) / 1000;
    if (!this.acid) this.acid = { id, V: 0, nH0: 0, nH: 0 };
    else if (this.acid.id !== id) this.acid.id = "mesanica";
    this.acid.V += V;
    this.acid.nH += A.cH * V;
    this.acid.nH0 = Math.max(this.acid.nH0, this.acid.nH);
    // voda kislino le razredči: hitrost ostane od kisline (prej je dolivanje vode reakcijo ustavilo)
    this.acid.tau = A.cH > 0 ? Math.min(this.acid.tau ?? Infinity, A.tau) : this.acid.tau ?? Infinity;
    this.acid.pena = Math.max(this.acid.pena || 0, A.pena);
    this.liquidMass += V * 1000 * A.rho;
    if (this.soda > 0 && A.cH > 0 && this.t0 == null) this.t0 = this.t;
  }
  addSoda(g) {
    const m = Math.max(0, g + gauss(this.r, 0.004, 2));
    this.soda += m / M.NaHCO3;
    this.sodaAdded += m;
    if (this.acid?.nH > 0 && this.t0 == null) this.t0 = this.t;
    return m;
  }
  // Masa na tehtnici (prava vrednost). Plin v bučki: zrak v njej tehtnica ne čuti (izravna ga vzgon), CO₂ pa je
  // težji od zraka, zato je bučka s CO₂ nad tekočino težja za x · n · (M(CO₂) − M(zrak)), pri 80 mL plina do ~0,05 g.
  massTrue() {
    return this.flaskMass + this.liquidMass + this.sodaAdded - this.escaped * M.CO2 - this.spilled + this.headspaceMass();
  }
  headspaceMass() {
    const n = Math.max(BUCKA.V - this.Vliq, 0) / (VM_SOBA * 1000); // mol plina nad tekočino
    return this.x * n * (M.CO2 - M_ZRAK);
  }
  // Odčitek tehtnice z berljivostjo 0,01 g.
  readMass() {
    const shake = 0.004 + Math.min(0.008, this.rate * 2); // σ do 0,012 g, odrezano pri 2,5 σ: do ±0,03 g
    return Math.round((this.massTrue() + gauss(this.r, shake, 2.5)) * 100) / 100;
  }
  // Koliko CO₂ (mol) lahko še nastane plus kar je že nastalo: omejitveni reaktant.
  co2Theory() {
    return this.reacted() + Math.min(this.soda, this.acid?.nH ?? 0);
  }
  reacted() {
    return this.sodaAdded / M.NaHCO3 - this.soda;
  }
  // Korak časa po 10 ms.
  step(dt) {
    for (let left = dt; left > 1e-9; left -= 0.01) this._step(Math.min(0.01, left));
  }
  _step(h) {
    const a = this.acid;
    let gas = 0; // mol plina, ki v tem koraku zapusti tekočino
    this.rate = 0;
    if (a && a.nH > 0 && this.soda > 0 && Number.isFinite(a.tau)) {
      const r = (this.soda / a.tau) * (a.nH / a.nH0);
      const d = Math.min(this.soda, a.nH, r * h);
      this.soda -= d;
      a.nH -= d;
      // CO₂ najprej nasiti raztopino, presežek se sprosti kot plin
      const cap = CO2_TOPNOST * a.V;
      this.dissolved += d;
      if (this.dissolved > cap) (gas += this.dissolved - cap), (this.dissolved = cap);
    }
    // počasno uhajanje raztopljenega CO₂
    const deg = (this.dissolved * h) / 300;
    this.dissolved -= deg;
    gas += deg;
    this.rate = gas / h; // mol/s
    const q = this.rate * VM_SOBA; // m³/s
    const VhM3 = Math.max(BUCKA.V - this.Vliq, 1e-5) / 1000; // prostor nad tekočino v m³
    // pena in prelivanje: pena je ~85 % plina, zato steče čez rob le ~15 % njene prostornine tekočine
    this.foam = q * 1000 * (a?.pena || 0); // L
    if (a && this.Vliq + this.foam > BUCKA.V) {
      const over = this.Vliq + this.foam - BUCKA.V;
      this.spill(Math.min(0.5, (over * 0.15 * h) / a.V));
      if (!this.spillSaid) (this.spillSaid = true), this.events.push({ t: this.t, type: "prelito", where: this.zamasek === "cevka" ? "cevka" : "miza" });
    }
    // plin nad tekočino
    if (this.zamasek === "zaprto") {
      this.trapped = (this.trapped || 0) + gas;
      this.dp += (gas * R_PLIN * T_SOBA) / VhM3;
      if (this.dp > BUCKA.zamasek) {
        // zamašek izleti: ujeti plin uide, del tekočine brizgne iz bučke
        this.events.push({ t: this.t, type: "zamasek" });
        this.zamasek = "brez";
        this.release();
        this.spill(0.15);
      }
    } else {
      const xOut = this.x; // kar odteče, ima sestavo zraka nad tekočino
      this.x += clamp((q * h) / VhM3, 0, 1) * (1 - this.x);
      this.escaped += gas;
      if (this.zamasek === "brez") this.x -= (this.x * h) / 90; // težji CO₂ počasi odteče iz odprte bučke (ocena)
      else this.bubbleInto(gas, xOut);
    }
    if (this.flame && this.t >= this.flame.until) this.flame = null;
    this.t += h;
  }
  // Del f tekočine odteče iz bučke (z raztopljenimi snovmi).
  spill(f) {
    const a = this.acid;
    if (!a || f <= 0) return;
    this.spilled += f * (this.massTrue() - this.headspaceMass() - this.flaskMass - this.soda * M.NaHCO3);
    a.nH *= 1 - f;
    a.V *= 1 - f;
    this.dissolved *= 1 - f;
  }
  // Plin skozi cevko v epruveto: vanjo pride toliko plina, kolikor ga nastane, s sestavo zraka v bučki.
  bubbleInto(gasMol, x) {
    this.bubbles = gasMol;
    if (this.epruveta !== "apnica" || gasMol <= 0) return;
    const co2 = gasMol * x;
    const c = this.ca;
    if (c.free > 0) {
      const d = Math.min(c.free, co2 * APNICA.f1);
      c.free -= d;
      c.caco3 += d;
    } else if (c.caco3 > 0) {
      const d = Math.min(c.caco3, co2 * APNICA.f2);
      c.caco3 -= d;
      c.hco3 += d;
    }
    const was = this.milkySaid;
    if (!was && this.milky() > 0.3) (this.milkySaid = true), this.events.push({ t: this.t, type: "motna" });
    if (this.milkySaid && !this.clearSaid && c.free <= 0 && this.milky() < 0.3) (this.clearSaid = true), this.events.push({ t: this.t, type: "bistra" });
  }
  // Motnost apnice 0–1 iz koncentracije CaCO₃ v g/L.
  milky() {
    const g = (this.ca.caco3 * M.CaCO3) / APNICA.V;
    return 1 - Math.exp(-g / APNICA.motnost);
  }
  o2() {
    return BUCKA.o2zrak * (1 - this.x);
  }
  // Prižgano trsko podržimo v vratu bučke.
  splint() {
    if (this.zamasek !== "brez") return { ok: false, why: "zamasek" };
    const out = this.o2() < BUCKA.o2meja;
    this.flame = { out, until: this.t + 3 };
    this.events.push({ t: this.t, type: out ? "trska-ugasne" : "trska-gori", o2: this.o2() });
    return { ok: true, out };
  }
  // Odprta zaprta bučka: presežek plina uide, v bučki ostane plin pri zunanjem tlaku s premešano sestavo
  // (delež CO₂ = (x · n + ujeti CO₂) / (n + ujeti CO₂), n = mol plina nad tekočino pri 1 atm).
  release() {
    const tr = this.trapped || 0;
    if (tr > 0) {
      const n = Math.max(BUCKA.V - this.Vliq, 1e-5) / (VM_SOBA * 1000);
      this.x = (this.x * n + tr) / (n + tr);
      this.escaped += tr;
    }
    this.trapped = 0;
    this.dp = 0;
  }
  setStopper(z) {
    if (z === this.zamasek) return;
    if (this.zamasek === "zaprto") this.release();
    this.zamasek = z;
  }
}

// Poenostavitve, ki jih simulacija pokaže učencu (»Kaj je poenostavljeno?«).
export const POENOSTAVITVE = {
  ohm: [
    "Žice imajo zanemarljiv upor; napajalnik ima notranji upor 0,05 Ω in omejitev toka 1 A.",
    "Žarnica takoj doseže končno temperaturo (prava nitka se segreje v desetinkah sekunde).",
    "Merilnika imata stalno napako in nihanje zadnjega mesta v mejah natančnosti iz navodil šolskega multimetra.",
  ],
  co2: [
    "Hitrost reakcije in penjenje sta ocenjena po trajanju penjenja v šolskem poskusu, ne izračunana iz kemijske kinetike.",
    "Temperatura je ves čas 20 °C (reakcija sode s kislino raztopino v resnici malo ohladi).",
    "Izhlapevanje vode ni upoštevano (v nekaj minutah je manjše od 0,01 g). Upoštevano je, da je CO₂ v bučki težji od zraka, ki ga je izpodrinil.",
    "Zrak v bučki je dobro premešan; v resnici se težji CO₂ nabira pri dnu.",
  ],
};
