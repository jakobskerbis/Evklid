// Virtualni laboratorij, »Elektromagnetizem«: elektromagnet (lab-elektromagnet), sila na vodnik v magnetnem polju
// (lab-sila-vodnik), elektromagnetna indukcija (lab-indukcija). Brez DOM (testi: test/laboratorij-magnetizem.test.js).
// Vsaka številka ima vir ali je označena kot ocena. Enote SI: m, s, A, T, kg. Poenostavitve: POENOSTAVITVE_MAGNETIZEM
// in docs/laboratorij.md.
import { rng, gauss, AM_RANGES, makeMeter, meterRead, meterSpec, fuseRate } from "./lab-model.js";
import { G_LJ, G_SOLA, naklonSkoziIzhodisce, premica } from "./lab-model-sile.js";

export { G_LJ, G_SOLA, naklonSkoziIzhodisce, premica, AM_RANGES, meterSpec };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const napaka = (r, max, lim = 2.5) => gauss(r, max / lim, lim); // naključna napaka, ki nikoli ne preseže max

// ------------------------------------------------------------------ konstante
// Permeabilnost vakuuma μ0 = 1,25663706212·10⁻⁶ T m/A (CODATA 2018).
export const MU0 = 1.25663706212e-6;
// Zemeljsko magnetno polje v Ljubljani (model WMM2025, NOAA NCEI, za leto 2026, zaokroženo; ocena): gostota 48 µT, inklinacija 63°
// (polje kaže poševno navzdol), deklinacija ~4,5° proti vzhodu. Navpična komponenta 42,8 µT, vodoravna 21,8 µT.
export const ZEMLJA = { B: 48e-6, inkl: (63 * Math.PI) / 180, dekl: (4.5 * Math.PI) / 180 };
export const ZEMLJA_NAVP = ZEMLJA.B * Math.sin(ZEMLJA.inkl);
export const ZEMLJA_VOD = ZEMLJA.B * Math.cos(ZEMLJA.inkl);
// Baker: specifična upornost 1,72·10⁻⁸ Ω m pri 20 °C, temperaturni koeficient α = 0,0039 /K (CRC Handbook), specifična toplota 385 J/(kg K).
export const BAKER = { rho: 1.72e-8, alfa: 0.0039, c: 385, gostota: 8960 };

// ------------------------------------------------------------------ tuljave (enake v lab-elektromagnet in lab-indukcija)
// Šolske razstavljive tuljave za U-jedro (po katalogu LD Didactic 562 13, 562 14, 562 15): 250 ovojev, največ 5 A, 0,6 Ω, 2,2 mH;
// 500 ovojev, 2,5 A, 2,5 Ω, 9 mH; 1000 ovojev, 1,25 A, 9,5 Ω, 36 mH. Vse tri imajo enako tuljavnico in približno enako
// prostornino bakra (R ∝ N²), zato pri največjem toku vse grejejo s ~15 W.
// Navitje (ocena po merah tuljavnice za jedro 40 mm × 40 mm): dolžina 6,0 cm, notranji polmer 2,4 cm (kvadratna odprtina 41 mm
// ima enako ploščino kot krog s polmerom 2,3 cm, navitje se začne na tuljavnici), zunanji 3,4 cm. Povprečni ovoj je dolg 18 cm.
export const NAVITJE = { L: 0.06, r1: 0.024, r2: 0.034 };
export const TULJAVE = {
  t250: { N: 250, R: 0.6, Imax: 5, L: 2.2e-3, name: "250 ovojev" },
  t500: { N: 500, R: 2.5, Imax: 2.5, L: 9e-3, name: "500 ovojev" },
  t1000: { N: 1000, R: 9.5, Imax: 1.25, L: 36e-3, name: "1000 ovojev" },
};
// Segrevanje navitja (ocena): toplotna kapaciteta ~250 J/K (~0,5 kg bakra + tuljavnica), toplotna upornost do zraka 3,5 K/W,
// da se pri največjem dovoljenem toku navitje segreje za ~70 K (lak razreda B zdrži 130 °C). Časovna konstanta ~15 min.
// Termično varovalo (bimetalno stikalo v tuljavnici, ocena) prekine tok pri 120 °C in ga spet sklene pod 90 °C.
// Lak začne dišati nad ~105 °C (ocena).
export const GRETJE = { C: 250, Rth: 3.5, izklop: 120, vklop: 90, vonj: 105, vroca: 60 };

// ------------------------------------------------------------------ magnetno polje tuljave na osi
// Debela tuljava (enakomerna gostota toka med r1 in r2, dolžina L), polje na osi v razdalji z od središča (z vzdolž osi):
// B = μ0 N I / (2 L (r2 − r1)) · [ζ1 ln((r2 + √(r2² + ζ1²))/(r1 + √(r1² + ζ1²))) − ζ2 ln(…ζ2…)], ζ1 = z + L/2, ζ2 = z − L/2
// (integral polja tanke tuljave po polmeru; npr. Montgomery, »Solenoid Magnet Design«, 1969).
export function bTuljavaOs({ N, I, L = NAVITJE.L, r1 = NAVITJE.r1, r2 = NAVITJE.r2, z = 0 }) {
  if (r2 - r1 < 1e-9) return bSolenoid({ N, I, L, R: r1, z });
  const f = (q) => q * Math.log((r2 + Math.hypot(r2, q)) / (r1 + Math.hypot(r1, q)));
  return ((MU0 * N * I) / (2 * L * (r2 - r1))) * (f(z + L / 2) - f(z - L / 2));
}
// Tanka tuljava (en sloj s polmerom R): B = μ0 N I / (2L) · [ζ1/√(R² + ζ1²) − ζ2/√(R² + ζ2²)].
export function bSolenoid({ N, I, L, R, z = 0 }) {
  const f = (q) => q / Math.hypot(R, q);
  return ((MU0 * N * I) / (2 * L)) * (f(z + L / 2) - f(z - L / 2));
}
// Biot–Savartov zakon numerično: vijačnica z N ovoji (polmer R, dolžina L), polje na osi v točki z (za preizkus formule).
export function bBiotSavart({ N, I, L, R, z = 0, korakov = 400 }) {
  const n = Math.round(N * korakov), dphi = (2 * Math.PI * N) / n, dz = L / n;
  let Bz = 0;
  for (let k = 0; k < n; k++) {
    const phi = (k + 0.5) * dphi, zk = -L / 2 + (k + 0.5) * dz;
    // dl = (−R sin φ dφ, R cos φ dφ, dz), r = točka − izvor = (−R cos φ, −R sin φ, z − zk)
    const dlx = -R * Math.sin(phi) * dphi, dly = R * Math.cos(phi) * dphi;
    const rx = -R * Math.cos(phi), ry = -R * Math.sin(phi), rz = z - zk;
    const r3 = Math.hypot(rx, ry, rz) ** 3;
    Bz += (dlx * ry - dly * rx) / r3; // z-komponenta dl × r
  }
  return (MU0 * I * Bz) / (4 * Math.PI);
}
// Enakomerno magnetiziran valj (magnetizacija M vzdolž osi, dolžina L, polmer R): polje na osi je enako polju tuljave
// s površinskim tokom M (velja znotraj in zunaj valja): B = μ0 M / 2 · [ζ1/√(R² + ζ1²) − ζ2/√(R² + ζ2²)].
export function bValj({ M, L, R, z = 0 }) {
  const f = (q) => q / Math.hypot(R, q);
  return ((MU0 * M) / 2) * (f(z + L / 2) - f(z - L / 2));
}
// Razmagnetilni faktor podolgovatega rotacijskega elipsoida z razmerjem m = dolžina/premer (Osborn, Phys. Rev. 67, 1945).
// Za valj je to približek (ocena), dovolj dober za m > 3.
export function razmagnetilni(m) {
  if (m <= 1) return 1 / 3;
  const s = Math.sqrt(m * m - 1);
  return ((m / s) * Math.log(m + s) - 1) / (m * m - 1);
}

// ------------------------------------------------------------------ železo
// Krivulja B–H mehkega železa (ocena, oblika arctan): J = Js · (2/π) · atan(π χ μ0 H / (2 Js)), B = μ0 H + J.
// Js = 1,85 T (mehko železo in transformatorska pločevina se nasičita pri 1,5–2 T; čisto železo 2,15 T, CRC), začetna
// susceptibilnost χ ≈ 2500 (μr največ nekaj tisoč). Pri H = 1 kA/m da 1,43 T, pri 10 kA/m 1,82 T (podobno izmerjenim krivuljam
// mehkega jekla). Koercitivnost: mehko železo ~80 A/m, kaljeno ogljikovo jeklo (žebelj) ~1,5 kA/m (ocene).
export const ZELEZO = { Js: 1.85, chi: 2500, Hc: 80 };
export const JEKLO = { Js: 1.6, chi: 400, Hc: 1500 };
export const polarizacija = (H, mat = ZELEZO) => mat.Js * (2 / Math.PI) * Math.atan((Math.PI * mat.chi * MU0 * H) / (2 * mat.Js));
export const bZelezo = (H, mat = ZELEZO) => MU0 * H + polarizacija(H, mat);
// H, pri katerem ima železo gostoto B (obrat krivulje z bisekcijo).
export function hZelezo(B, mat = ZELEZO) {
  const s = Math.sign(B) || 1, b = Math.abs(B);
  let lo = 0, hi = 1e8;
  for (let k = 0; k < 100; k++) {
    const m = (lo + hi) / 2;
    if (bZelezo(m, mat) < b) lo = m;
    else hi = m;
  }
  return (s * (lo + hi)) / 2;
}
// Odprto jedro (palica, žebelj) v zunanjem polju Ha: M = J(Ha − Nd M)/μ0 (bisekcija). Vrne magnetizacijo M (A/m).
export function magnetizacijaPalice(Ha, Nd, mat = ZELEZO) {
  const s = Math.sign(Ha) || 1, h = Math.abs(Ha);
  if (h === 0) return 0;
  let lo = 0, hi = Math.min(h / Nd, mat.Js / MU0);
  for (let k = 0; k < 80; k++) {
    const m = (lo + hi) / 2;
    if (m < polarizacija(h - Nd * m, mat) / MU0) lo = m;
    else hi = m;
  }
  return (s * (lo + hi)) / 2;
}

// Jedra (ocene za šolsko opremo):
// - palica iz mehkega železa Ø 20 mm, dolga 12 cm, sredina v sredini tuljave (štrli 3 cm na vsako stran);
// - kaljen jeklen žebelj Ø 5 mm, dolg 10 cm (z glavo): ostane nekoliko magneten (remanenca);
// - lamelirano U-jedro 40 mm × 40 mm z jarmom (razstavljiv transformator, npr. LD Didactic 562 11/562 12): srednja dolžina
//   magnetne poti 48 cm, presek 16 cm²; stik med krakom in jarmom ima režo ~0,03 mm (ocena za brušene lamele), med kraka in
//   jarem lahko vložiš plastični ploščici 0,5 mm, 1 mm ali 2 mm. Rob reže polje razširi: gostota v reži je manjša za razmerje ploščin
//   (a/(a + g))² (ocena za stresano polje).
export const JEDRA = {
  zrak: { name: "brez jedra" },
  palica: { name: "palica iz mehkega železa", L: 0.12, R: 0.01, mat: ZELEZO },
  zebelj: { name: "jeklen žebelj", L: 0.1, R: 0.0025, mat: JEKLO },
  u: { name: "U-jedro z jarmom", a: 0.04, l: 0.48, A: 0.0016, g0: 0.03e-3, mat: ZELEZO },
};
for (const k of ["palica", "zebelj"]) JEDRA[k].Nd = razmagnetilni(JEDRA[k].L / (2 * JEDRA[k].R));
// Remanenca odprtega jedra po izklopu toka: M_r = najmanj (0,6 · največji dosežen M, Hc/Nd_ef). Nd_ef = 0,007 za žebelj (ocena, uglašeno, da kaljen žebelj po izklopu obdrži 1 sponko:
// magnetizacija ob koncih ni enakomerna, zato se razmagneti bolj kot elipsoid); pri mehkem železu je M_r zanemarljiv.
// Tresljaji in magnetna viskoznost zmanjšajo remanenco žeblja za ~35 % v nekaj sekundah (τ = 4 s, ocena), zato sponka visi le še hip.
export const REMANENCA = { delez: 0.6, NdEf: { palica: JEDRA.palica.Nd, zebelj: 0.007 }, padec: 0.35, tau: 4 };

// ------------------------------------------------------------------ sponke in kompas
// Pisarniška sponka 32 mm iz jeklene žice Ø 0,9 mm: 0,5 g (ocena). Sila na sponke ob polu: F = V_ef · M_s(B) · |dB/dz|,
// M_s = najmanj (χ_s B/μ0, Js/μ0): χ_s = 12 (upognjena žica, ocena), Js = 1,6 T. V_ef = ploščina pola × 12,5 µm (ocena:
// koliko sponk je v območju strmega polja ob polu; uglašeno, da palica pri največjem toku dvigne ~20–30 sponk, kot v šoli).
// Sponke se zapletejo: vsakič jih dvigneš 85–100 % toliko, kot jih sila zdrži (ocena). V škatlici je 60 sponk.
export const SPONKA = { m: 0.5e-3, chi: 12, Js: 1.6, debelina: 12.5e-6, zaplet: [0.85, 1], max: 60 };
// Kompas leži na kladi 11 cm desno od osi in 2 cm pod spodnjim koncem tuljave ali jedra; os tuljave je navpična (ocena).
export const KOMPAS = { x: 0.11, dz: -0.02 };

// ------------------------------------------------------------------ teslameter s Hallovo sondo
// Šolski teslameter (ocena po PHYWE 13610-93 in LD Didactic 524 0381): območja 20 mT (0,01 mT), 200 mT (0,1 mT), 2000 mT (1 mT),
// točnost ±(2 % + 1 digit). Hallov element ima pred nastavitvijo ničle svoj odmik do ±0,03 mT (ocena), poleg tega sonda meri
// zemeljsko polje vzdolž svoje osi (navpična os: 42,8 µT). Sonda, zasukana za 90°, meri prečno komponento: na osi tuljave je nič,
// ostane ~1,5° nagiba (ocena) in vodoravna komponenta zemeljskega polja. Ploščata (prečna) sonda za režo je debela 0,5 mm (ocena).
export const TESLA_RANGES = {
  "20": { max: 0.02, dec: 2, k: 1e3, unit: "mT" },
  "200": { max: 0.2, dec: 1, k: 1e3, unit: "mT" },
  "2000": { max: 2, dec: 0, k: 1e3, unit: "mT" },
};
export const HALL = { rel: 0.02, digits: 1, odmik: 0.03e-3, nagib: (1.5 * Math.PI) / 180, debelina: 0.5 };
export function teslaRead(m, B, range) {
  const R = TESLA_RANGES[range], step = 10 ** -R.dec;
  if (Math.abs(B) > R.max * 0.99995) return { text: "OL", value: NaN, over: true };
  const gain = clamp(m.gain, -0.8, 0.8) * HALL.rel;
  const jit = gauss(m.r, 0.25, 2.4);
  const counts = Math.round((B * R.k * (1 + gain)) / step + jit);
  const value = counts * step;
  return { text: value.toFixed(R.dec), value, over: false };
}
export const teslaSpec = (B, range) => Math.abs(B * 1e3) * HALL.rel + HALL.digits * 10 ** -TESLA_RANGES[range].dec;

// Napajalnik 0–12 V z omejitvijo toka 3 A (CC), notranji upor 0,05 Ω; vodniki s krokodilčki 2 × 0,02 Ω (ocena).
export const NAPAJALNIK_EM = { max: 12, ilim: 3, rs: 0.05, vodniki: 0.04 };

// ================================================================== ElektromagnetBench (lab-elektromagnet)
// z je koordinata vzdolž navpične osi tuljave (navzgor +, 0 = sredina navitja). b(z) je komponenta polja navzdol (v smeri sonde,
// ki pride od zgoraj). Smer +1: polje v tuljavi kaže navzdol, spodnji konec je severni pol.
export class ElektromagnetBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.Tlab = idealno ? 20 : 22 + napaka(r, 1.5);
    this.tuljava = "t500";
    this.jedro = "zrak";
    this.razmik = 1; // mm plastičnih ploščic pod jarmom
    this.U = 0;
    this.vklop = false;
    this.prikljuceno = true;
    this.smer = 1;
    this.amPos = "zaporedno"; // zaporedno | vzporedno
    this.amRange = "10";
    this.am = makeMeter(r);
    if (idealno) (this.am.gain = 0), (this.am.off = 0);
    this.fuse = { mA: { Q: 0, blown: false }, A10: { Q: 0, blown: false } };
    this.temp = Object.fromEntries(Object.keys(TULJAVE).map((k) => [k, this.Tlab]));
    this.odprto = false; // termično varovalo
    this.hall = makeMeter(r);
    this.hall.odmik = idealno ? 0 : napaka(r, HALL.odmik);
    if (idealno) this.hall.gain = 0;
    this.sonda = { z: 0.1, orient: "os", range: "20", nic: 0, nicSet: false };
    this.Mmax = 0; // največja magnetizacija odprtega jedra od zadnjega vklopa
    this.Mrem = 0;
    this.remT = 0; // čas od izklopa (remanenca žeblja pojema)
    this.sponke = 0;
    this.t = 0;
    this.events = [];
    this.said = {};
    this.solve();
  }
  get coil() {
    return TULJAVE[this.tuljava];
  }
  get T() {
    return this.temp[this.tuljava];
  }
  set T(v) {
    this.temp[this.tuljava] = v;
  }
  Rcoil(T = this.T) {
    return this.coil.R * (1 + BAKER.alfa * (T - 20));
  }
  fuseOf(range = this.amRange) {
    return AM_RANGES[range].unit === "A" ? this.fuse.A10 : this.fuse.mA;
  }
  // Električni krog: napajalnik (CV, pri 3 A CC) → vodniki → ampermeter zaporedno s tuljavo ali vzporedno z njo.
  solve() {
    const P = NAPAJALNIK_EM, Ram = this.fuseOf().blown ? Infinity : AM_RANGES[this.amRange].rsh;
    const Rc = this.odprto || !this.prikljuceno ? Infinity : this.Rcoil();
    const U0 = this.vklop ? this.U : 0;
    let Rtot, split;
    if (this.amPos === "zaporedno") (Rtot = Rc + Ram + P.vodniki + P.rs), (split = () => [1, 1]);
    else {
      const Rp = Number.isFinite(Rc) && Number.isFinite(Ram) ? (Rc * Ram) / (Rc + Ram) : Number.isFinite(Rc) ? Rc : Ram;
      Rtot = Rp + P.vodniki + P.rs;
      split = () => (Number.isFinite(Rc) && Number.isFinite(Ram) ? [Ram / (Rc + Ram), Rc / (Rc + Ram)] : Number.isFinite(Rc) ? [1, 0] : [0, 1]);
    }
    let I = Number.isFinite(Rtot) ? U0 / Rtot : 0;
    const cc = I > P.ilim;
    if (cc) I = P.ilim;
    const [fc, fa] = split();
    const Icoil = this.smer * I * fc, Iam = this.amPos === "zaporedno" ? (Number.isFinite(Ram) ? this.smer * I : 0) : this.smer * I * fa;
    return (this.st = { I, Icoil, Iam, cc, Usup: Math.max(0, U0 - I * P.rs), Isup: I });
  }
  // Magnetizacija odprtega jedra (A/m, navzdol +) pri trenutnem toku; po izklopu remanenca.
  _Ha() {
    // povprečno polje tuljave vzdolž jedra
    const J = JEDRA[this.jedro], n = 24, N = this.coil.N, I = this.st.Icoil;
    let s = 0;
    for (let i = 0; i < n; i++) s += bTuljavaOs({ N, I, z: -J.L / 2 + ((i + 0.5) * J.L) / n });
    return s / n / MU0;
  }
  M() {
    const J = JEDRA[this.jedro];
    if (!J.L) return 0;
    const Ha = this._Ha();
    if (Math.abs(Ha) < 1) return this.Mrem;
    return magnetizacijaPalice(Ha, J.Nd, J.mat);
  }
  // Gostota v U-jedru (T, smer kot tok): N I = H_Fe(B) l + B g/μ0, g = 2 (g0 + razmik).
  bJedro(NI = this.coil.N * this.st.Icoil) {
    const J = JEDRA.u, g = 2 * (J.g0 + this.razmik / 1000), s = Math.sign(NI) || 1, ni = Math.abs(NI);
    if (!ni) return 0;
    let lo = 0, hi = J.mat.Js + (MU0 * ni) / g;
    for (let k = 0; k < 80; k++) {
      const B = (lo + hi) / 2;
      if (hZelezo(B, J.mat) * J.l + (B * g) / MU0 < ni) lo = B;
      else hi = B;
    }
    return (s * (lo + hi)) / 2;
  }
  bReza() {
    const J = JEDRA.u, g = J.g0 + this.razmik / 1000;
    return this.bJedro() * (J.a / (J.a + g)) ** 2;
  }
  // Polje na osi (T, komponenta navzdol). Pri U-jedru polje zunaj jedra zanemarimo (zaprta magnetna pot).
  b(z) {
    const I = this.st.Icoil, N = this.coil.N;
    if (this.jedro === "u") return 0;
    let B = bTuljavaOs({ N, I, z });
    const J = JEDRA[this.jedro];
    if (J.L) B += bValj({ M: this.M(), L: J.L, R: J.R, z });
    return B;
  }
  // Kam lahko gre sonda (od zgoraj po osi): nad jedrom ali skozi tuljavo brez jedra; pri U-jedru le v režo.
  get zMin() {
    const J = JEDRA[this.jedro];
    return J.L ? J.L / 2 + 0.002 : -0.1;
  }
  get vReziMogoce() {
    return this.razmik >= HALL.debelina;
  }
  // Kaj meri Hallov element: komponenta vzdolž sonde + zemeljsko polje + odmik (pred nastavitvijo ničle).
  bSonda() {
    const o = this.sonda.orient === "os";
    let B;
    if (this.jedro === "u") B = this.vReziMogoce ? this.bReza() : 0;
    else B = this.b(Math.max(this.zMin, this.sonda.z));
    const zem = this.jedro === "u" ? ZEMLJA_VOD * 0.3 : ZEMLJA_NAVP; // v reži je sonda vodoravna
    const along = o ? B + zem : B * Math.sin(HALL.nagib) + ZEMLJA_VOD * 0.6;
    return along + this.hall.odmik;
  }
  nicli() {
    this.sonda.nic = this.bSonda();
    this.sonda.nicSet = true;
  }
  readT() {
    return teslaRead(this.hall, this.bSonda() - this.sonda.nic, this.sonda.range);
  }
  readA() {
    const st = this.st;
    if (this.fuseOf().blown) return { text: "0.00".slice(0, AM_RANGES[this.amRange].dec + 2), value: 0, over: false };
    return meterRead(this.am, st.Iam, AM_RANGES[this.amRange], "A");
  }
  // Pol in polje ob njem za sponke: ploskev pola (spodnji konec), polmer, polje in strmina (numerično, 1 mm pod polom).
  pol() {
    const J = JEDRA[this.jedro];
    if (this.jedro === "u") {
      // zaprto jedro: zunaj ostane le stresano polje (~1 % polja v jedru, ocena) na spodnji ploskvi jarma
      const B = 0.01 * this.bJedro();
      return { z: null, R: 0.02, B, dBdz: B / 0.02 };
    }
    const z0 = J.L ? -J.L / 2 : -NAVITJE.L / 2, R = J.L ? J.R : NAVITJE.r1, d = 0.001, h = 2e-4;
    const B = this.b(z0 - d), dBdz = (this.b(z0 - d + h) - this.b(z0 - d - h)) / (2 * h);
    return { z: z0, R, B, dBdz };
  }
  silaSponke() {
    const p = this.pol(), Ms = Math.min((SPONKA.chi * Math.abs(p.B)) / MU0, SPONKA.Js / MU0);
    return Math.PI * p.R * p.R * SPONKA.debelina * Ms * Math.abs(p.dBdz);
  }
  kolikoSponk(F = this.silaSponke(), zaplet = 1) {
    return Math.min(SPONKA.max, Math.floor((F / (SPONKA.m * G_LJ)) * zaplet + 1e-9));
  }
  dvigniSponke() {
    const z = this.idealno ? 1 : SPONKA.zaplet[0] + this.r() * (SPONKA.zaplet[1] - SPONKA.zaplet[0]);
    this.zaplet = z;
    return (this.sponke = this.kolikoSponk(this.silaSponke(), z));
  }
  // Nosilnost zaprtega U-jedra: F = B² A / μ0 (dve ploskvi, Maxwellov napetostni tenzor).
  nosilnostJarma() {
    return (this.bReza() ** 2 * JEDRA.u.A) / MU0;
  }
  // Magnetni moment in pola za polje ob kompasu (model dveh polov na koncih tuljave ali jedra).
  kompas() {
    const J = JEDRA[this.jedro], I = this.st.Icoil, N = this.coil.N, { r1, r2, L } = NAVITJE;
    let m = 0, ell = L;
    if (this.jedro !== "u") {
      m = (N * I * Math.PI * (r1 * r1 + r1 * r2 + r2 * r2)) / 3;
      if (J.L) (m += this.M() * Math.PI * J.R * J.R * J.L), (ell = J.L);
    }
    const q = m / ell, zb = -ell / 2, x = KOMPAS.x, zk = zb + KOMPAS.dz;
    // pozitiven pol (izvor polja) je spodaj, ko m > 0 (polje v tuljavi navzdol)
    const pole = (qq, zp) => {
      const dx = x, dz = zk - zp, r3 = Math.hypot(dx, dz) ** 3;
      return (MU0 * qq * dx) / (4 * Math.PI * r3);
    };
    const Bx = pole(q, zb) + pole(-q, -zb);
    return { Bx, kot: (Math.atan2(Bx, ZEMLJA_VOD) * 180) / Math.PI };
  }
  // Čas: segrevanje navitja, varovalka ampermetra, termično varovalo, remanenca in sponke.
  step(dt) {
    for (let left = dt; left > 1e-9; left -= 0.05) {
      const h = Math.min(0.05, left);
      const st = this.solve(), J = JEDRA[this.jedro];
      // remanenca odprtega jedra
      if (J.L) {
        const on = Math.abs(st.Icoil) > 1e-4;
        if (on) {
          const M = this.M();
          if (Math.abs(M) > Math.abs(this.Mmax)) this.Mmax = M;
          this.Mrem = 0;
          this.remT = 0;
          this.bilVklop = true;
        } else if (this.bilVklop) {
          this.bilVklop = false;
          const Hc = J.mat.Hc, lim = Hc / REMANENCA.NdEf[this.jedro];
          this.Mrem0 = Math.sign(this.Mmax) * Math.min(REMANENCA.delez * Math.abs(this.Mmax), lim);
          this.Mmax = 0;
          this.remT = 0;
        }
        if (!on && this.Mrem0) {
          this.remT += h;
          const f = this.jedro === "zebelj" ? 1 - REMANENCA.padec * (1 - Math.exp(-this.remT / REMANENCA.tau)) : 1;
          this.Mrem = this.Mrem0 * f;
        }
      }
      // gretje navitja
      const P = st.Icoil * st.Icoil * (Number.isFinite(this.Rcoil()) ? this.Rcoil() : 0);
      for (const k of Object.keys(this.temp)) {
        const Pk = k === this.tuljava ? P : 0;
        this.temp[k] += (h * (Pk - (this.temp[k] - this.Tlab) / GRETJE.Rth)) / GRETJE.C;
      }
      if (!this.odprto && this.T >= GRETJE.izklop) (this.odprto = true), this.events.push({ t: this.t, type: "izklop", T: this.T });
      else if (this.odprto && this.T <= GRETJE.vklop) (this.odprto = false), this.events.push({ t: this.t, type: "vklop", T: this.T });
      if (Math.abs(st.Icoil) > this.coil.Imax * 1.05 && !this.said.prevec) (this.said.prevec = true), this.events.push({ t: this.t, type: "prevec", I: st.Icoil });
      if (Math.abs(st.Icoil) <= this.coil.Imax) this.said.prevec = false;
      if (this.T > GRETJE.vonj && !this.said.vonj) (this.said.vonj = true), this.events.push({ t: this.t, type: "vonj", T: this.T });
      if (this.T < GRETJE.vonj - 10) this.said.vonj = false;
      // varovalka ampermetra
      const f = this.fuseOf();
      if (!f.blown && st.Iam) {
        f.Q += h * fuseRate(st.Iam, AM_RANGES[this.amRange].fuse);
        if (f.Q >= 1) (f.blown = true), this.events.push({ t: this.t, type: "varovalka", I: Math.abs(st.Iam) });
      }
      if (st.cc && !this.said.cc) (this.said.cc = true), this.events.push({ t: this.t, type: "cc" });
      if (!st.cc) this.said.cc = false;
      // sponke odpadejo, ko sila popusti
      if (this.sponke > 0) {
        const n = this.kolikoSponk(this.silaSponke(), this.zaplet ?? 1);
        if (n < this.sponke) this.events.push({ t: this.t, type: "sponke", od: this.sponke, na: n }), (this.sponke = n);
      }
      this.t += h;
    }
    return this.solve();
  }
  replaceFuse() {
    this.fuseOf().blown = false;
    this.fuseOf().Q = 0;
  }
}

// ================================================================== TehtnicaBench (lab-sila-vodnik): »tokovna tehtnica«
// Trajni magnet v jeklenem nosilcu (U-profil) stoji na digitalni tehtnici; nad njim je pritrjena tiskanina z bakreno vezjo,
// katere vodoravni del dolžine L gre skozi režo med poloma. Sila na vodnik F = I L × B; po tretjem Newtonovem zakonu deluje
// nasprotno enaka sila na magnet, zato tehtnica pokaže spremembo Δm = F/g.
// Magneti (ocena po šolskih kompletih, npr. PASCO SF-8607 »Basic Current Balance«): feritni magneti širine 1,4 cm, v reži jeklenega
// nosilca (reža ~6 mm) je gostota ~0,09 T (±8 % od magneta do magneta), polje ob robu magneta pade na razdalji ~1,5 mm (četrt reže).
// Nad režo (1 cm nad magnetom) je le ~8 % polja, na zgornjem robu reže ~60 % (ocena). Nosilec s 6 magneti tehta ~174 g.
export const MAGNETI = { B0: 0.09, raztros: 0.08, w: 0.014, rob: 0.0015, n: 6, nosilec: 0.12, magnet: 0.009 };
export const VISINE = { reza: 1, rob: 0.6, nad: 0.08 };
// Tiskanine z bakreno vezjo: vodoravni del dolg 1, 2, 4 ali 8 cm (kot v šolskih kompletih), upor ~0,03 Ω (ocena).
export const VODNIKI = [0.01, 0.02, 0.04, 0.08];
// Digitalna tehtnica: do 300 g, berljivost 0,01 g, ponovljivost ±0,01 g (npr. KERN EMB 200-2: 0,01 g); stalna napaka umerjanja
// do 0,05 % (ocena); ničla po tariranju počasi leze za do 0,01 g v nekaj minutah (ocena).
export const TEHTNICA = { max: 300, d: 0.01, umeritev: 0.0005, lezenje: 0.01, tauLez: 120 };
// Napajalnik za tokovno tehtnico: 0–12 V, nastavljiva omejitev toka 0–5 A; krog (tiskanina, vodniki, ampermeter 10 A) ima ~0,08 Ω,
// zato napajalnik dela v načinu CC in tok nastaviš z gumbom za tok (ocena).
export const NAPAJALNIK_TT = { max: 12, imax: 5, rs: 0.05, krog: 0.08 };
// Segrevanje tiskanine pri 5 A: P = I²R ≈ 0,75 W, toplotna upornost ~40 K/W, τ ≈ 60 s (ocena). Sila se zaradi tega ne spremeni.
export const TISKANINA = { R: 0.03, Rth: 40, tau: 60 };

// Polje vzdolž reže (x od sredine nosilca) za magnete med x1 in x2, vsak z gostoto Bk: vsota »gladkih stopnic«
// B(x) = Bk/2 · [tanh((x − x1)/λ) − tanh((x − x2)/λ)] (oblika roba je ocena; pade eksponentno, kot polje ob robu reže).
// Sosednja magneta se stikata, zato je polje v sredini enakomerno.
const LNCOSH = (y) => Math.abs(y) + Math.log1p(Math.exp(-2 * Math.abs(y))) - Math.LN2;
const F_TANH = (u, lam) => lam * LNCOSH(u / lam); // ∫ tanh(u/λ) du
export const poljeReze = (magneti, x, lam = MAGNETI.rob) => magneti.reduce((s, m) => s + (m.B / 2) * (Math.tanh((x - m.x1) / lam) - Math.tanh((x - m.x2) / lam)), 0);
export function integralPolja(magneti, a, b, lam = MAGNETI.rob) {
  let s = 0;
  for (const { x1, x2, B } of magneti) s += (B / 2) * (F_TANH(b - x1, lam) - F_TANH(a - x1, lam) - F_TANH(b - x2, lam) + F_TANH(a - x2, lam));
  return s;
}
export const silaNaVodnik = ({ B, I, L, sinKot = 1 }) => B * I * L * sinKot;

export class TehtnicaBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.Bm = Array.from({ length: MAGNETI.n }, () => MAGNETI.B0 * (idealno ? 1 : 1 + napaka(r, MAGNETI.raztros)));
    this.mm = Array.from({ length: MAGNETI.n }, () => MAGNETI.magnet * (idealno ? 1 : 1 + napaka(r, 0.03)));
    this.mNos = MAGNETI.nosilec * (idealno ? 1 : 1 + napaka(r, 0.02));
    this.nMag = 6;
    this.L = 0.04;
    this.visina = "reza";
    this.kot = "precno"; // precno | vzporedno
    this.polaritetaMag = 1; // +1: severni pol spredaj (polje v reži kaže nazaj)
    this.smer = 1; // +1: tok od leve proti desni
    this.U = 6;
    this.Ilim = 0;
    this.vklop = false;
    this.amRange = "10";
    this.am = makeMeter(r);
    if (idealno) (this.am.gain = 0), (this.am.off = 0);
    this.fuse = { mA: { Q: 0, blown: false }, A10: { Q: 0, blown: false } };
    this.cal = idealno ? 0 : napaka(r, TEHTNICA.umeritev);
    this.tara = 0;
    this.lez = 0; // lezenje ničle (g)
    this.lezCilj = 0;
    this.Tplosca = 22;
    this.t = 0;
    this.events = [];
    this.said = {};
    this.solve();
  }
  // Magneti se v jeklenem nosilcu primejo kjerkoli: n magnetov stoji drug ob drugem, skupaj na sredini (pod sredino vodnika).
  get magneti() {
    const w = MAGNETI.w, n = this.nMag;
    return Array.from({ length: n }, (_, i) => ({ i, x1: (i - n / 2) * w, x2: (i + 1 - n / 2) * w, B: this.Bm[i] * this.polaritetaMag }));
  }
  get masaNaTehtnici() {
    return (this.mNos + this.magneti.reduce((s, m) => s + this.mm[m.i], 0)) * 1000; // g
  }
  fuseOf(range = this.amRange) {
    return AM_RANGES[range].unit === "A" ? this.fuse.A10 : this.fuse.mA;
  }
  solve() {
    const P = NAPAJALNIK_TT, Ram = this.fuseOf().blown ? Infinity : AM_RANGES[this.amRange].rsh;
    const R = P.krog - AM_RANGES["10"].rsh + Ram + P.rs; // krog že vsebuje ampermeter na območju 10 A
    let I = this.vklop && Number.isFinite(R) ? this.U / R : 0;
    const cc = I > this.Ilim;
    if (cc) I = this.Ilim;
    return (this.st = { I: this.smer * I, cc, Usup: this.vklop ? (Number.isFinite(R) ? Math.min(this.U, I * R) : this.U) : 0, Isup: I });
  }
  // ∫B dl vzdolž vodoravnega dela vodnika (T m), z višino in kotom.
  get integral() {
    const sin = this.kot === "precno" ? 1 : Math.sin((1 * Math.PI) / 180); // 1° nagiba ostane (ocena)
    return integralPolja(this.magneti, -this.L / 2, this.L / 2) * VISINE[this.visina] * sin;
  }
  // Sila na vodnik navzgor (N). Osi: x v desno, y nazaj, z navzgor. Tok v desno (+x), severni pol spredaj, polje nazaj (+y):
  // F = I L × B = I L B (x × y) = +z, vodnik potisne navzgor. Obrnjen tok ali pola obrneta silo.
  get sila() {
    return this.st.I * this.integral;
  }
  // Prava sprememba odčitka (g): na magnet deluje −F, tehtnica pokaže +F/g, ko je sila na vodnik navzgor.
  get dmPravi() {
    return (this.sila / G_LJ) * 1000;
  }
  tariraj() {
    // tehtnica odšteje to, kar pokaže (z napako umerjanja), zato je po tariranju ničla res nič
    this.tara = (this.masaNaTehtnici + this.dmPravi) * (1 + this.cal) + this.lez;
    this.lez = 0;
    this.lezCilj = this.idealno ? 0 : napaka(this.r, TEHTNICA.lezenje, 2);
    this.tarirano = true;
  }
  read() {
    const m = (this.masaNaTehtnici + this.dmPravi) * (1 + this.cal) + this.lez - this.tara;
    if (m > TEHTNICA.max) return { text: "Err", value: NaN, over: true };
    const jit = this.idealno ? 0 : clamp(gauss(this.r, 0.22, 2.3), -0.5, 0.5);
    const counts = Math.round(m / TEHTNICA.d + jit);
    const value = counts * TEHTNICA.d;
    return { text: value.toFixed(2), value, over: false };
  }
  readA() {
    if (this.fuseOf().blown) return { text: "0.00", value: 0, over: false };
    return meterRead(this.am, this.st.I, AM_RANGES[this.amRange], "A");
  }
  step(dt) {
    for (let left = dt; left > 1e-9; left -= 0.05) {
      const h = Math.min(0.05, left), st = this.solve();
      this.lez += ((this.lezCilj - this.lez) * h) / TEHTNICA.tauLez;
      const P = st.I * st.I * TISKANINA.R;
      this.Tplosca += (h * (22 + P * TISKANINA.Rth - this.Tplosca)) / TISKANINA.tau;
      const f = this.fuseOf();
      if (!f.blown && st.I) {
        f.Q += h * fuseRate(st.I, AM_RANGES[this.amRange].fuse);
        if (f.Q >= 1) (f.blown = true), this.events.push({ t: this.t, type: "varovalka", I: Math.abs(st.I) });
      }
      if (this.Tplosca > 40 && !this.said.toplo) (this.said.toplo = true), this.events.push({ t: this.t, type: "toplo", T: this.Tplosca });
      this.t += h;
    }
    return this.solve();
  }
  replaceFuse() {
    this.fuseOf().blown = false;
    this.fuseOf().Q = 0;
  }
}

// ================================================================== IndukcijaBench (lab-indukcija)
// Valjast magnet NdFeB Ø 12 mm × 20 mm, remanenca Br = 1,25 T (razred N38–N42: 1,22–1,32 T, ocena), masa 17 g (gostota 7,5 g/cm³).
// Magnetni moment m = Br V / μ0 ≈ 2,25 A m². Pada po navpični akrilni cevi (notranji premer 14 mm) skozi tuljavo iz kompleta
// (navitje kot NAVITJE); zračni upor v cevi zanemarimo (pri 3 m/s je ~1 % teže, ocena), trenja ob steno ni.
// Ozka cev (notranji premer 12,0 mm) je za magnet s prevleko pretesna: magnet se zatakne (napaka).
export const MAGNET_IND = { D: 0.012, L: 0.02, Br: 1.25, gostota: 7500 };
MAGNET_IND.V = Math.PI * (MAGNET_IND.D / 2) ** 2 * MAGNET_IND.L;
MAGNET_IND.m = (MAGNET_IND.Br * MAGNET_IND.V) / MU0;
// Akrilna cev 60 cm stoji na penasti blazinici (1 cm). Magnet spustiš iz prstov na vrhu cevi (središče 1,5 cm pod robom); tuljavo
// premikaš po cevi, zato je h (od središča magneta do sredine tuljave) 10–35 cm (ocena za šolsko postavitev).
export const CEV = { L: 0.6, vrh: 0.015, pena: 0.01, hMin: 0.1, hMax: 0.35, notranji: 0.014, ozka: 0.012 };
// Senzor napetosti v zbiralniku podatkov (ocena po šolskih senzorjih, npr. PASCO PS-2115, Vernier DVP-BTA): območji ±10 V in ±1 V,
// 12 bitov (najmanjši korak 4,9 mV oz. 0,49 mV), šum σ ≈ 0,5 koraka, točnost ±1 %, vhodni upor 1 MΩ. Frekvence vzorčenja 100 Hz,
// 1 kHz, 10 kHz. Nepriključen (odprt) vhod pobira omrežni brum 50 Hz z amplitudo ~20 mV in naključen odmik (ocena).
export const SENZOR = { ranges: { "10": 10, "1": 1 }, bitov: 12, sum: 0.5, rel: 0.01, Rin: 1e6, fs: [100, 1000, 10000], brum: 0.02 };
// Demonstracijski galvanometer z ničlo na sredini (ocena): ±1 mA na polni odklon, notranji upor 100 Ω, lastni nihajni čas 1,6 s,
// dušenje 0,3 kritičnega. Kratek sunek toka ga »brcne« sorazmerno z nabojem (balistični galvanometer).
export const GALVANOMETER = { Ifs: 1e-3, R: 100, T0: 1.6, zeta: 0.3, kon: 1.15 };

// Magnetni pretok skozi en ovoj (polmer a), ko je središče magneta v razdalji z od ravnine ovoja (navzgor +), severni pol zgoraj (s = +1).
// Iz recipročnosti: Φ = M ∫ b_ovoj dV po magnetu; polje ovoja na osi b0 = μ0 a²/(2 (a² + ζ²)^{3/2}) na enoto toka, blizu osi
// b ≈ b0 − ρ²/4 · b0''. Po preseku magneta (⟨ρ²⟩ = R²/2) in dolžini: Φ = μ0 M A/2 · [g(ζ)]_{zS}^{zN} − M A R²/8 · [b0'(ζ)]_{zS}^{zN},
// g(ζ) = ζ/√(a² + ζ²), b0' = −3 μ0 a² ζ/(2 (a² + ζ²)^{5/2}).
export function pretokOvoj(z, a, s = 1, mag = MAGNET_IND) {
  const M = mag.Br / MU0, R = mag.D / 2, A = Math.PI * R * R, zN = z + (s * mag.L) / 2, zS = z - (s * mag.L) / 2;
  const g = (q) => q / Math.hypot(a, q), d1 = (q) => (-3 * MU0 * a * a * q) / (2 * Math.hypot(a, q) ** 5);
  return ((MU0 * M * A) / 2) * (g(zN) - g(zS)) - ((M * A * R * R) / 8) * (d1(zN) - d1(zS));
}
// Skupni pretok skozi vse ovoje tuljave (vsota po plasteh in rezinah navitja): Λ = N Φ̄. z = središče magneta glede na sredino tuljave.
const MREZA = { nr: 6, nz: 24 };
export function pretokTuljava(z, N, s = 1, nav = NAVITJE) {
  let sum = 0;
  for (let i = 0; i < MREZA.nr; i++) {
    const a = nav.r1 + ((i + 0.5) * (nav.r2 - nav.r1)) / MREZA.nr;
    for (let j = 0; j < MREZA.nz; j++) sum += pretokOvoj(z - (-nav.L / 2 + ((j + 0.5) * nav.L) / MREZA.nz), a, s);
  }
  return (N * sum) / (MREZA.nr * MREZA.nz);
}
// dΛ/dz numerično (osrednja razlika, 0,05 mm).
export const dPretok = (z, N, s = 1) => (pretokTuljava(z + 5e-5, N, s) - pretokTuljava(z - 5e-5, N, s)) / 1e-4;

export class IndukcijaBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.tuljava = "t500";
    this.pol = 1; // +1: severni pol spodaj (gre prvi v tuljavo)
    this.nacin = "spust"; // spust | roka
    this.h = 0.3;
    this.vRoka = 0.3;
    this.cev = "siroka";
    this.merilnik = "senzor"; // senzor | galvanometer
    this.prikljuceno = true;
    this.range = "10";
    this.fs = 1000;
    this.cal = idealno ? 0 : napaka(r, SENZOR.rel);
    this.run = null;
  }
  get coil() {
    return TULJAVE[this.tuljava];
  }
  get lsb() {
    return (2 * SENZOR.ranges[this.range]) / 2 ** SENZOR.bitov;
  }
  // Lega središča magneta z(t) in hitrost (navzdol +) za izbrani način. Vrne funkcijo t → { z, v } in čas konca.
  gibanje() {
    if (this.cev === "ozka") return { pot: () => ({ z: this.h, v: 0 }), tEnd: 1.2, zataknjen: true };
    if (this.nacin === "spust") {
      const h = this.h, zDno = h - (CEV.L - CEV.vrh - MAGNET_IND.L / 2 - CEV.pena); // magnet obleži na blazinici
      const tDno = Math.sqrt((2 * (h - zDno)) / G_LJ);
      return { pot: (t) => (t < tDno ? { z: h - 0.5 * G_LJ * t * t, v: G_LJ * t } : { z: zDno, v: 0 }), tEnd: tDno + 0.15, tDno };
    }
    // z roko: z 20 cm nad sredino tuljave do sredine, 0,5 s mirovanja in nazaj; pospeševanje in zaviranje 3 m/s² (ocena)
    const v = this.vRoka, a = 3, z0 = 0.2, tA = v / a, sA = 0.5 * a * tA * tA, tC = (z0 - 2 * sA) / v, T1 = 2 * tA + tC, tP = 0.5;
    const enPot = (t) => {
      if (t < tA) return { s: 0.5 * a * t * t, v: a * t };
      if (t < tA + tC) return { s: sA + v * (t - tA), v };
      if (t < T1) {
        const q = T1 - t;
        return { s: z0 - 0.5 * a * q * q, v: a * q };
      }
      return { s: z0, v: 0 };
    };
    const pot = (t) => {
      const t0 = 0.1;
      if (t < t0) return { z: z0, v: 0 };
      if (t < t0 + T1) {
        const p = enPot(t - t0);
        return { z: z0 - p.s, v: p.v };
      }
      if (t < t0 + T1 + tP) return { z: 0, v: 0 };
      if (t < t0 + 2 * T1 + tP) {
        const p = enPot(t - t0 - T1 - tP);
        return { z: p.s, v: -p.v };
      }
      return { z: z0, v: 0 };
    };
    return { pot, tEnd: 0.1 + 2 * T1 + tP + 0.15, T1 };
  }
  // Inducirana napetost na sponkah tuljave (V) ob času t: U = −dΛ/dt = −dΛ/dz · dz/dt (dz/dt = −v).
  napetost(t, G = this._g) {
    const { z, v } = G.pot(t);
    return dPretok(z, this.coil.N, this.pol) * v; // −dΛ/dz · (−v)
  }
  // Izvede poskus: izračuna vzorce senzorja (ali odklon galvanometra) od spusta do konca.
  spusti() {
    const r = this.r, G = (this._g = this.gibanje()), N = this.coil.N;
    const fs = this.fs, rng_ = SENZOR.ranges[this.range], lsb = this.lsb;
    const faza = r() / fs, out = [];
    const brum = this.prikljuceno ? 0 : SENZOR.brum * (0.6 + 0.8 * r()), odmik = this.prikljuceno ? 0 : napaka(r, 0.01), fb = r() * 2 * Math.PI;
    let clipped = false;
    if (this.merilnik === "senzor") {
      for (let t = faza; t <= G.tEnd; t += 1 / fs) {
        let U = this.prikljuceno ? this.napetost(t, G) * (1 + this.cal) : brum * Math.sin(2 * Math.PI * 50 * t + fb) + odmik;
        U += this.idealno ? 0 : gauss(r, SENZOR.sum * lsb, 3);
        if (Math.abs(U) > rng_) (U = Math.sign(U) * rng_), (clipped = true);
        out.push([t, Math.round(U / lsb) * lsb]);
      }
    } else {
      // galvanometer: θ'' + 2ζω θ' + ω² θ = ω² · I/I_fs (θ v deležih polnega odklona), korak 0,2 ms
      const g = GALVANOMETER, w = (2 * Math.PI) / g.T0, Rt = N ? this.coil.R + g.R : Infinity;
      let th = 0, om = 0, maxTh = 0;
      const dt = 2e-4, tEnd = Math.max(G.tEnd, 3);
      for (let t = 0, k = 0; t <= tEnd; t += dt, k++) {
        const I = this.prikljuceno && t < G.tEnd ? this.napetost(t, G) / Rt : 0;
        const a = w * w * (I / g.Ifs - th) - 2 * g.zeta * w * om;
        om += a * dt;
        th += om * dt;
        if (Math.abs(th) > g.kon) (th = Math.sign(th) * g.kon), (om = 0), (clipped = true);
        if (Math.abs(th) > Math.abs(maxTh)) maxTh = th;
        if (k % 25 === 0) out.push([t, th]);
      }
      this.run = { t: 0, tEnd, vzorci: out, clipped, G, maxTh, galv: true };
      return this.run;
    }
    this.run = { t: 0, tEnd: G.tEnd, vzorci: out, clipped, G, galv: false };
    return this.run;
  }
  step(dt) {
    if (this.run) this.run.t += dt;
  }
  get tece() {
    return !!this.run && this.run.t < this.run.tEnd;
  }
  lega(t = this.run?.t ?? 0) {
    if (!this.run) return { z: this.nacin === "spust" ? this.h : 0.2, v: 0 };
    return this.run.G.pot(Math.min(t, this.run.G.tEnd));
  }
  // Analiza zapisa (kot orodje v programu zbiralnika): največja in najmanjša napetost ter ploščini pod obema vrhovoma.
  // Vrhova ločimo pri prehodu skozi nič med njima (lega magneta v sredini tuljave).
  analiza(vz = this.run?.vzorci) {
    if (!vz || vz.length < 3 || this.run?.galv) return null;
    let iMax = 0, iMin = 0;
    vz.forEach((p, i) => {
      if (p[1] > vz[iMax][1]) iMax = i;
      if (p[1] < vz[iMin][1]) iMin = i;
    });
    const [a, b] = iMax < iMin ? [iMax, iMin] : [iMin, iMax];
    let ic = a;
    for (let i = a; i <= b; i++) if (Math.abs(vz[i][1]) < Math.abs(vz[ic][1])) ic = i;
    const trap = (i0, i1) => {
      let s = 0;
      for (let i = i0; i < i1; i++) s += 0.5 * (vz[i][1] + vz[i + 1][1]) * (vz[i + 1][0] - vz[i][0]);
      return s;
    };
    const p1 = trap(0, ic), p2 = trap(ic, vz.length - 1);
    const prvi = iMax < iMin ? vz[iMax][1] : vz[iMin][1], drugi = iMax < iMin ? vz[iMin][1] : vz[iMax][1];
    return { U1: prvi, U2: drugi, t1: vz[a][0], t2: vz[b][0], P1: p1, P2: p2 };
  }
  // Prava največja napetost obeh vrhov in hitrost magneta ob njih (za preizkuse): grobo po 0,5 ms, nato okoli vrha po 5 µs.
  vrhoviPravi() {
    const G = this._g ?? this.gibanje();
    const best = [{ U: 0 }, { U: 0 }];
    const poglej = (t) => {
      const U = this.napetost(t, G), { z, v } = G.pot(t), k = z > 0 ? 0 : 1;
      if (Math.abs(U) > Math.abs(best[k].U)) best[k] = { U, t, z, v };
    };
    for (let t = 0; t <= G.tEnd; t += 5e-4) poglej(t);
    for (const b of [...best]) if (b.t != null) for (let t = b.t - 5e-4; t <= b.t + 5e-4; t += 5e-6) poglej(t);
    return best;
  }
  // Galvanometer: največji odklon v deležih polnega odklona.
  get galvOdklon() {
    return this.run?.galv ? this.run.maxTh : null;
  }
}

// ------------------------------------------------------------------ poenostavitve
export const POENOSTAVITVE_MAGNETIZEM = {
  elektromagnet: [
    "Polje tuljave računamo na osi za debelo tuljavo z enakomerno navitimi ovoji (6 cm dolgo, polmer navitja 2,4–3,4 cm); kvadratno tuljavnico nadomestimo z okroglo.",
    "Železno palico in žebelj obravnavamo, kot da sta enakomerno magnetizirana; razmagnetilni faktor je kot pri podolgovatem elipsoidu. Zato palica polje okrepi le ~20-krat, čeprav je μr železa več tisoč.",
    "Krivulja B–H železa je gladka krivulja z nasičenjem pri ~1,85 T (ocena); histerezo upoštevamo le kot remanenco po izklopu toka.",
    "Pri U-jedru z jarmom računamo z magnetnim krogom (železo + reži), stresano polje ob reži je ocena; zunaj zaprtega jedra je polja zelo malo.",
    "Koliko sponk se prime, je ocena iz sile na sponke ob polu (strmina polja); prave sponke se zapletajo, zato število niha.",
    "Samoindukcijo ob vklopu zanemarimo: tok se ustali v manj kot sekundi.",
    "Segrevanje navitja je en sam toplotni »blok« (ocena); upor bakra raste z α = 0,0039 /K.",
  ],
  sila: [
    "Polje v reži je med magnetoma enakomerno in ob robu magneta gladko pade (ocena oblike); 1° nagiba magneta ostane, zato tudi »vzporedno« ni čisto nič.",
    "Navpična dela vezja nosita nasprotna tokova: sili nanju sta vodoravni in se izničita, tehtnica ju ne čuti.",
    "Magnetno polje vodnika in zemeljsko polje zanemarimo; segrevanje tiskanine sile ne spremeni.",
    "Tehtnica zaokroži na 0,01 g; po tariranju ničla počasi leze (do 0,01 g v nekaj minutah, ocena).",
    "Gostota polja posameznih magnetov se razlikuje do 8 % (ocena), zato sila ni čisto sorazmerna s številom magnetov.",
  ],
  indukcija: [
    "Magnet je enakomerno magnetiziran valj (Br = 1,25 T, ocena za NdFeB); pretok skozi ovoje računamo iz recipročnosti z drugim redom odmika od osi.",
    "Zračni upor in trenje v cevi zanemarimo; magnet pada prosto z g = 9,806 m/s².",
    "Tok v tuljavi skozi senzor (1 MΩ) je zanemarljiv, zato tuljava magneta ne zavira. V bakreni cevi bi vrtinčni tokovi magnet močno zavrli.",
    "Senzor ima 12 bitov, šum ~0,5 koraka in napako umerjanja do 1 % (ocena); pri vzorčenju 100 Hz vzorci zgrešijo vrh.",
    "Galvanometer je dušeno nihalo (ocena za demonstracijski instrument); pri kratkem sunku toka je odklon sorazmeren z nabojem.",
  ],
};
