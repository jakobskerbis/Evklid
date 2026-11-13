// Virtualni laboratorij, elektrika: zaporedna in vzporedna vezava (lab-vezava) ter prevodnost snovi (lab-prevodnost).
// Brez DOM (testi: test/laboratorij-elektrika.test.js). Vsaka številka ima vir ali je označena kot ocena.
// Merilniki, varovalka, upori, žarnica 6 V in napajalnik so isti kot pri Ohmovem zakonu (lab-model.js).
import { rng, gauss, makeMeter, meterRead, fuseRate, solveLinear, lampR, AM_RANGES, VM_RANGES, R_VOLTMETER, UPOR, ZARNICA, LOADS, NAPAJALNIK } from "./lab-model.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ODPRTO = 1e12; // Ω: prazno podnožje, zgorel upor, pregorela nitka

// ------------------------------------------------------------------ vezava
// Deli: upori in žarnica 6 V / 0,1 A iz lab-ohm, žica (kratek stik) in prazno podnožje (odvita žarnica, odstranjen upor).
// Žica s sponkama ima ~0,02 Ω (ocena: 20 cm bakrene žice 0,5 mm², ρ = 1,68 · 10⁻⁸ Ω m, plus sponki).
export const R_ZICA = 0.02;
export const ZARNICA_TOL = 0.05;
export const VEZ_DELI = {
  ...LOADS,
  zica: { type: "W", name: "žica (kratek stik)" },
  prazno: { type: "O", name: "prazno podnožje" },
};
export const VEZAVE = { zaporedno: "zaporedna", vzporedno: "vzporedna", mesano: "mešana: 1 zaporedno z (2 ∥ 3)" };

// Upornost iz nazivnih vrednosti (kar izračuna učenec): zaporedno R₁ + R₂ + …, vzporedno 1/R = 1/R₁ + 1/R₂ + …
export function rSkupni(vez, R) {
  const vz = (xs) => 1 / xs.reduce((s, x) => s + 1 / x, 0);
  if (vez === "zaporedno") return R.reduce((s, x) => s + x, 0);
  if (vez === "vzporedno") return vz(R);
  return R[0] + vz(R.slice(1, 3));
}

export class VezBench {
  constructor({ seed = 1 } = {}) {
    const r = (this.r = rng(seed));
    this.U0 = 0;
    this.vez = "zaporedno";
    this.n = 2; // pri zaporedni in vzporedni 2 ali 3 elementi; mešana ima vedno 3
    this.kinds = ["R100", "R220", "R470"];
    this.parts = this.kinds.map((k) => this.newPart(k));
    this.am = { pos: "zaporedno", at: "glavni" }; // pos: zaporedno | vzporedno | brez; at: glavni | 1 | 2 | 3
    this.vm = { pos: "vzporedno", at: "1" };
    this.amRange = "200m";
    this.vmRange = "20";
    this.fuse = { mA: { Q: 0, blown: false }, A10: { Q: 0, blown: false } };
    this.amM = makeMeter(r);
    this.vmM = makeMeter(r);
    this.lastU = [ZARNICA.Ur, ZARNICA.Ur, ZARNICA.Ur];
    this.t = 0;
    this.events = [];
    this.solve();
  }
  newPart(k) {
    const L = VEZ_DELI[k];
    if (L.type === "R") return { R: L.nom * (1 + clamp(gauss(this.r, UPOR.tol / 2.2, 2.2), -UPOR.tol, UPOR.tol)), T: 20, burnt: false, hotSaid: false };
    // Žarnice niso enake: upor nitke (in tok) posamezne žarnice odstopa do ±5 % (ocena; podatkovni listi miniaturnih
    // žarnic dopuščajo do ±10 % toka), zato vzporedni žarnici ne kažeta čisto enakega toka.
    if (L.type === "L") return { k: 1 + clamp(gauss(this.r, ZARNICA_TOL / 2.2, 2.2), -ZARNICA_TOL, ZARNICA_TOL), over: 0, wear: 0, burnt: false };
    return {};
  }
  setKind(i, k) {
    this.kinds[i] = k;
    this.parts[i] = this.newPart(k);
  }
  get count() {
    return this.vez === "mesano" ? 3 : this.n;
  }
  fuseOf(range = this.amRange) {
    return AM_RANGES[range].unit === "A" ? this.fuse.A10 : this.fuse.mA;
  }
  elR(i, U = this.lastU[i]) {
    const L = VEZ_DELI[this.kinds[i]], p = this.parts[i];
    if (L.type === "O" || p.burnt) return ODPRTO;
    if (L.type === "W") return R_ZICA;
    if (L.type === "R") return p.R * (1 + UPOR.alfa * (p.T - 20));
    return lampR(U) * (p.k ?? 1);
  }
  // Vezje kot seznam dvopolov med vozlišči (0 = minus, 1 = plus napajalnika). Merilnik »glavni« zaporedno je v glavnem
  // vodu, vzporedno pa na sponkah napajalnika; merilnik »i« zaporedno je v veji elementa i, vzporedno pa na elementu i.
  netlist() {
    const els = [];
    let n = 2, a = 1;
    const c = this.count;
    const meters = [["A", this.am], ["V", this.vm]].filter(([, m]) => m.pos !== "brez" && (m.at === "glavni" || +m.at <= c));
    for (const [k, m] of meters) if (m.at === "glavni" && m.pos === "zaporedno") els.push({ kind: k, a, b: n }), (a = n++);
    for (const [k, m] of meters) if (m.at === "glavni" && m.pos === "vzporedno") els.push({ kind: k, a: 1, b: 0 });
    const branch = (i, p, q) => {
      for (const [k, m] of meters) if (m.at === String(i + 1) && m.pos === "zaporedno") els.push({ kind: k, a: p, b: n }), (p = n++);
      els.push({ kind: "E", i, a: p, b: q });
      for (const [k, m] of meters) if (m.at === String(i + 1) && m.pos === "vzporedno") els.push({ kind: k, a: p, b: q });
    };
    if (this.vez === "zaporedno")
      for (let i = 0, p = a; i < c; i++) {
        const q = i === c - 1 ? 0 : n++;
        branch(i, p, q);
        p = q;
      }
    else if (this.vez === "vzporedno") for (let i = 0; i < c; i++) branch(i, a, 0);
    else {
      const m = n++;
      branch(0, a, m), branch(1, m, 0), branch(2, m, 0);
    }
    return { els, N: n - 1 };
  }
  // Metoda vozlišč kot v OhmBench; žarnice so nelinearne, zato iteriramo (geometrijska sredina starega in novega upora).
  solve() {
    const { els, N } = this.netlist();
    const amR = this.fuseOf().blown ? ODPRTO : AM_RANGES[this.amRange].rsh;
    const Rl = [0, 1, 2].map((i) => (i < this.count ? this.elR(i) : ODPRTO));
    const nodal = (cc) => {
      const G = Array.from({ length: N }, () => new Array(N).fill(0));
      const I = new Array(N).fill(0);
      const add = (i, j, g) => {
        if (i > 0) G[i - 1][i - 1] += g;
        if (j > 0) G[j - 1][j - 1] += g;
        if (i > 0 && j > 0) (G[i - 1][j - 1] -= g), (G[j - 1][i - 1] -= g);
      };
      for (const e of els) add(e.a, e.b, 1 / e.R);
      for (let k = 1; k <= N; k++) G[k - 1][k - 1] += 1e-12; // puščanje izolacije: plavajoča vozlišča ostanejo določena
      if (cc) I[0] += NAPAJALNIK.ilim;
      else add(1, 0, 1 / NAPAJALNIK.rs), (I[0] += this.U0 / NAPAJALNIK.rs);
      return [0, ...solveLinear(G, I)];
    };
    let v = [], cc = false;
    for (let it = 0; it < 120; it++) {
      for (const e of els) e.R = e.kind === "A" ? amR : e.kind === "V" ? R_VOLTMETER : Rl[e.i];
      v = nodal(false);
      cc = (this.U0 - v[1]) / NAPAJALNIK.rs > NAPAJALNIK.ilim;
      if (cc) v = nodal(true);
      let ch = 0;
      for (const e of els)
        if (e.kind === "E") {
          const Rn = this.elR(e.i, v[e.a] - v[e.b]);
          ch = Math.max(ch, Math.abs(Rn - Rl[e.i]) / Rl[e.i]);
          Rl[e.i] = Math.sqrt(Rl[e.i] * Rn);
        }
      if (ch < 1e-9) break;
    }
    const res = { cc, Usup: v[1], Isup: cc ? NAPAJALNIK.ilim : (this.U0 - v[1]) / NAPAJALNIK.rs, el: [], Iam: null, Uvm: null };
    for (const e of els) {
      const U = v[e.a] - v[e.b], I = U / e.R;
      if (e.kind === "E") (res.el[e.i] = { U, I, R: e.R }), (this.lastU[e.i] = U);
      if (e.kind === "A") res.Iam = I;
      if (e.kind === "V") res.Uvm = U;
    }
    return (this.state = res);
  }
  // Čas v korakih po 10 ms: segrevanje uporov, nitke žarnic, varovalka v ampermetru, omejitev toka.
  step(dt) {
    for (let left = dt; left > 1e-9; left -= 0.01) {
      const h = Math.min(0.01, left);
      const st = this.solve();
      for (let i = 0; i < this.count; i++) {
        const L = VEZ_DELI[this.kinds[i]], p = this.parts[i], e = st.el[i];
        if (p.burnt || !e) continue;
        if (L.type === "R") {
          const P = e.U * e.I;
          p.T += (h * (20 + P * UPOR.rth - p.T)) / UPOR.tau;
          if (P > UPOR.P * 1.05 && !p.hotSaid) (p.hotSaid = true), this.events.push({ t: this.t, type: "vroc", i, P });
          if (p.T > UPOR.tZgori) (p.burnt = true), this.events.push({ t: this.t, type: "zgorel", i, P });
        } else if (L.type === "L") {
          const u = Math.abs(e.U) / ZARNICA.Ur;
          p.over = u > 1.8 ? p.over + h : 0;
          p.wear += (h * u ** ZARNICA.zivEksp) / ZARNICA.zivljenje;
          if (p.over > 0.6 || p.wear >= 1) (p.burnt = true), this.events.push({ t: this.t, type: "nitka", i });
        }
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
  readA() {
    return this.state.Iam == null ? null : meterRead(this.amM, this.state.Iam, AM_RANGES[this.amRange], "A");
  }
  readV() {
    return this.state.Uvm == null ? null : meterRead(this.vmM, this.state.Uvm, VM_RANGES[this.vmRange], "V");
  }
  // Svetlost žarnice i (1 = nazivna): svetlobni tok ∝ U^3,4 in moč ∝ U^1,6 (lab-model.js, ZARNICA), torej svetloba
  // ∝ P^(3,4/1,6); za nazivno žarnico je to isto kot (U/Ur)^3,4, žarnica z manjšim uporom pa pri isti napetosti sveti močneje.
  brightness(i) {
    const e = this.state.el[i];
    if (VEZ_DELI[this.kinds[i]].type !== "L" || this.parts[i].burnt || !e) return 0;
    const P = Math.abs(e.U * e.I) / (ZARNICA.Ur * ZARNICA.Ir);
    return Math.min(1.6, Math.pow(P, ZARNICA.svet / (1 + ZARNICA.eksp)));
  }
  // Skupna upornost iz nazivnih vrednosti; NaN, če v vezju ni samo uporov.
  nominalTotal() {
    const ks = this.kinds.slice(0, this.count);
    return ks.every((k) => VEZ_DELI[k].type === "R") ? rSkupni(this.vez, ks.map((k) => VEZ_DELI[k].nom)) : NaN;
  }
  replaceFuse() {
    Object.assign(this.fuseOf(), { Q: 0, blown: false });
  }
  replaceBurnt() {
    this.parts = this.parts.map((p, i) => (p.burnt ? this.newPart(this.kinds[i]) : p));
  }
}

// ------------------------------------------------------------------ prevodnost snovi (preizkuševalnik)
// Ploščata baterija 4,5 V (3R12), notranji upor ~1,5 Ω (ocena za cink-ogljikovo baterijo pod obremenitvijo).
// Žarnica E10 3,8 V / 0,3 A (ista pravila kot ZARNICA: P ∝ U^1,6, svetloba ∝ U^3,4, hladna nitka R/10).
// LED (rdeča): prevodna napetost ~1,8 V, zaporedni upor 150 Ω, nazivni tok 20 mA (podatkovni listi rdečih LED 5 mm);
// v temnejšem prostoru opazimo svetenje že pri ~0,05 mA (ocena).
// Raztopine: dve bakreni ploščici 3 cm narazen, v vodi 2 cm × 3 cm, konstanta celice K = d/A = 50 m⁻¹ (ocena za
// šolski poskus). Ko tok teče skozi slano vodo, poteka elektroliza (mehurčki): razkrojna napetost ~2,1 V
// (ocena: 1,36 V za Cl₂ + 0,41 V za H₂ pri pH 7 + prenapetost; bakrena anoda se deloma raztaplja, kar
// napetost nekoliko zniža, zato je 2,1 V zgornja ocena), zato za tok ostane le 4,5 V − 2,1 V.
export const TESTER = { U: 4.5, ri: 1.5, K: 50, Udec: 2.1 };
export const ZARNICA_T = { Ur: 3.8, Ir: 0.3, eksp: 0.6, svet: 3.4, hladna: 0.1 };
export const LED = { Vf: 1.8, Rs: 150, Inom: 0.02, Imin: 5e-5 };
// Kos snovi med sponkama je dolg 6 cm. Kovine: žica Ø 1 mm (pri aluminiju trak folije, enak presek);
// grafit: mina tehničnega svinčnika Ø 0,5 mm; nekovine in spojine: palčka ali ploščica s presekom ~1 cm² (ocena).
// Specifične upornosti pri 20 °C: Cu 1,68 · 10⁻⁸, Al 2,65 · 10⁻⁸, Fe 9,7 · 10⁻⁸ Ω m (CRC Handbook, Electrical
// resistivity of pure metals); žveplo 2 · 10¹⁵ Ω m (CRC); grafitna mina ~3 · 10⁻⁵ Ω m (ocena: mina HB 0,5 mm ima ~1,5 Ω/cm,
// v njej je grafit z glino); steklo ~10¹², plastika (PVC) ~10¹⁴, suh les ~10¹¹, guma ~10¹³, papir ~10¹⁰,
// kristal NaCl ~10¹³ Ω m (velikostni redi iz CRC in priročnikov o izolatorjih, ocena za razred).
// Prevodnost raztopin NaCl pri 20 °C: 1 % 1,6 S/m, 5 % 7,0 S/m, 20 % 19,6 S/m (CRC Handbook, Concentrative properties
// of aqueous solutions). Vodovodna voda ~0,05 S/m (500 µS/cm, ocena za trdo vodo), destilirana voda na zraku ~1 · 10⁻⁴ S/m
// (raztopljen CO₂; CRC navaja 5,5 · 10⁻⁶ S/m za čisto vodo), sladkorna raztopina ~2 · 10⁻⁴ S/m (ocena; sladkor ne razpade na ione).
const ZICA = (rho) => (rho * 0.06) / (Math.PI * 0.0005 ** 2);
const PALCKA = (rho) => (rho * 0.06) / 1e-4;
export const MATERIALI = {
  baker: { name: "baker (žica)", R: ZICA(1.68e-8), vrsta: "kovina", magnet: false, sijaj: true, upogib: "upogne se" },
  aluminij: { name: "aluminij (folija)", R: ZICA(2.65e-8), vrsta: "kovina", magnet: false, sijaj: true, upogib: "upogne se" },
  zelezo: { name: "železo (žebelj)", R: ZICA(9.7e-8), vrsta: "kovina", magnet: true, sijaj: true, upogib: "upogne se (težko)" },
  grafit: { name: "grafit (mina svinčnika)", R: (3e-5 * 0.06) / (Math.PI * 0.00025 ** 2), vrsta: "nekovina", magnet: false, sijaj: "malo", upogib: "se zlomi" },
  zveplo: { name: "žveplo (kos)", R: PALCKA(2e15), vrsta: "nekovina", magnet: false, sijaj: false, upogib: "se zdrobi" },
  steklo: { name: "steklo (palčka)", R: PALCKA(1e12), vrsta: "drugo", magnet: false, sijaj: false, upogib: "se zlomi" },
  plastika: { name: "plastika (ravnilo)", R: PALCKA(1e14), vrsta: "drugo", magnet: false, sijaj: false, upogib: "se upogne in vrne" },
  les: { name: "les (palčka)", R: PALCKA(1e11), vrsta: "drugo", magnet: false, sijaj: false, upogib: "se zlomi" },
  guma: { name: "guma (radirka)", R: PALCKA(1e13), vrsta: "drugo", magnet: false, sijaj: false, upogib: "se upogne in vrne" },
  papir: { name: "papir", R: PALCKA(1e10), vrsta: "drugo", magnet: false, sijaj: false, upogib: "se upogne" },
  sol: { name: "kuhinjska sol (kristali)", R: PALCKA(1e13), vrsta: "drugo", magnet: false, sijaj: false, upogib: "se zdrobi" },
  slana1: { name: "slana voda 1 %", kappa: 1.6, conc: 1, vrsta: "drugo", tekocina: true, ioni: true },
  slana5: { name: "slana voda 5 %", kappa: 7.0, conc: 5, vrsta: "drugo", tekocina: true, ioni: true },
  slana20: { name: "slana voda 20 %", kappa: 19.6, conc: 20, vrsta: "drugo", tekocina: true, ioni: true },
  vodovodna: { name: "vodovodna voda", kappa: 0.05, vrsta: "drugo", tekocina: true, ioni: true },
  destilirana: { name: "destilirana voda", kappa: 1e-4, conc: 0, vrsta: "drugo", tekocina: true },
  sladkorna: { name: "sladkorna raztopina", kappa: 2e-4, vrsta: "drugo", tekocina: true },
};
export const matR = (m) => m.R ?? TESTER.K / m.kappa;

// Tok in svetlost v preizkuševalniku. ind: "zarnica" | "led"; Ram: upor ampermetra (0, če ga ni).
// Vrne { I, U (na žarnici ali LED), b (svetlost, 1 = nazivna), stanje: sveti | sibko | ne, mehurcki }.
export function tester(id, ind = "zarnica", Ram = 0) {
  const m = MATERIALI[id];
  const Rs = matR(m) + TESTER.ri + Ram;
  const drive = TESTER.U - (m.ioni ? TESTER.Udec : 0);
  let I = 0, U = 0, b = 0;
  if (ind === "led") {
    I = Math.max(0, drive - LED.Vf) / (Rs + LED.Rs);
    U = I > 0 ? LED.Vf : drive;
    b = I < LED.Imin ? 0 : Math.min(1.5, I / LED.Inom);
  } else {
    const { Ur, Ir, eksp, hladna, svet } = ZARNICA_T, Rh = Ur / Ir;
    const Il = (u) => u / Math.max(Rh * hladna, Rh * Math.pow(u / Ur, 1 - eksp));
    let lo = 0, hi = drive;
    for (let k = 0; k < 80; k++) {
      const u = (lo + hi) / 2;
      u + Il(u) * Rs > drive ? (hi = u) : (lo = u);
    }
    U = lo;
    I = Il(U);
    b = Math.min(1.6, Math.pow(U / Ur, svet));
  }
  // Meji vidnosti (ocena): nitka v dnevni svetlobi opazno žari pri ~3 % nazivne svetlobe, LED pri ~0,25 % nazivnega toka.
  const vid = ind === "led" ? 0.0025 : 0.03;
  return { I, U, b, stanje: b >= 0.4 ? "sveti" : b >= vid ? "sibko" : "ne", mehurcki: !!m.ioni && I > 1e-3 };
}

export const POENOSTAVITVE_ELEKTRIKA = {
  vezava: [
    "Žice in sponke imajo zanemarljiv upor; napajalnik ima notranji upor 0,05 Ω in omejitev toka 1 A.",
    "Žarnice takoj dosežejo končno temperaturo (prava nitka se segreje v desetinkah sekunde).",
    "Merilnika imata stalno napako in nihanje zadnjega mesta v mejah natančnosti iz navodil šolskega multimetra; ampermeter ima majhen upor, voltmeter 10 MΩ.",
  ],
  prevodnost: [
    "Vsak kos snovi je dolg 6 cm; žice imajo premer 1 mm, mina 0,5 mm, ostale snovi presek 1 cm². Daljši ali tanjši kos ima večji upor.",
    "Baterija ima stalno napetost 4,5 V in notranji upor 1,5 Ω; prava baterija se med uporabo počasi prazni.",
    "Pri slani vodi del napetosti (~2,1 V) porabi elektroliza na ploščicah (mehurčki); upor raztopine je izračunan iz prevodnosti pri 20 °C.",
    "Izolatorji (steklo, plastika, les, guma, papir, žveplo, trdna sol) imajo zelo velik upor: tok je tako majhen, da ga šolski merilnik ne pokaže.",
  ],
};
