// Virtualni laboratorij, »Gibanje«: pospešeno gibanje po klancu (lab-klanec), prosti pad s svetlobnimi vrati (lab-prosti-pad),
// drugi Newtonov zakon z vozičkom, škripcem in utežmi (lab-newton2). Brez DOM (testi: test/laboratorij-gibanje.test.js).
// Vsaka številka ima vir ali je označena kot ocena. Enote SI: m, s, kg, N. Poenostavitve: POENOSTAVITVE_GIBANJE in docs/laboratorij.md.
import { rng, gauss, R_PLIN, M_ZRAK } from "./lab-model.js";
import { G_LJ, G_SOLA, naklonSkoziIzhodisce, premica, UTEZI_MPE } from "./lab-model-sile.js";

export { G_LJ, G_SOLA, naklonSkoziIzhodisce, premica };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const napaka = (r, max, lim = 2.5) => gauss(r, max / lim, lim); // naključna napaka, ki nikoli ne preseže max

// ------------------------------------------------------------------ časovnik za svetlobna vrata
// Digitalni časovnik s štirimi kanali (kot PASCO ME-8930 »Smart Timer« ali PHYWE »Timer 4-4«): ločljivost 0,1 ms
// (navodila PASCO ME-8930: »resolution 0.1 ms«). Točnost ±(0,01 % + 1 digit): ocena za kvarčni oscilator (tipično 50 ppm)
// in zaokroževanje na zadnjo števko. Vsak časovnik ima svojo stalno napako umerjanja (do polovice dopustne) in zaokroži na 0,1 ms.
export const CASOVNIK = { res: 1e-4, rel: 1e-4, max: 999.9999 };
export function makeCasovnik(r, idealno = false) {
  return { cal: idealno ? 0 : (r() - 0.5) * CASOVNIK.rel };
}
export function casovnikRead(c, t) {
  if (t == null || !Number.isFinite(t)) return null;
  const n = Math.round((t * (1 + c.cal)) / CASOVNIK.res);
  return Math.min(CASOVNIK.max, Math.max(0, n / 1e4)); // n desetink milisekunde (deljenje, da ni ostankov 0,941000…01)
}
export const casovnikSpec = (t) => CASOVNIK.rel * t + CASOVNIK.res;

// ------------------------------------------------------------------ svetlobna vrata
// Infrardeči žarek premera ~1 mm (navodila PASCO ME-9498A in Vernier VPG-BTD: »IR beam«, ozek žarek; ocena 1 mm).
// Vrata preklopijo, ko je žarek zastrt približno do polovice; ker prag za vklop in izklop ni povsem enak, je zastirni
// predmet »videti« za ~0,2 mm širši (dEff, ocena). Lega roba ob preklopu niha za σ = 0,05 mm (jitter, ocena).
// Lego vrat odčitaš na merilu proge na 1 mm (vrata postaviš na oznako, odstopanje σ = 0,5 mm, ocena).
export const VRATA = { zarek: 0.001, dEff: 0.0002, jitter: 0.00005, postavitev: 0.0005, max: 1.5 };

// ------------------------------------------------------------------ proga in voziček
// Aluminijasta proga 1,2 m z merilom v cm (npr. PASCO ME-9493 »1.2 m Aluminum Track«). Nogi sta 1,00 m narazen (ocena),
// zato je sin θ = h / 100 cm, ko levo nogo dvigneš za h. Leseni kvadri po 2,0 cm (ocena). Miza ni povsem vodoravna:
// 3–6 mm na meter (ocena za šolsko mizo in povešeno progo); z libelo in vijakoma na nogah jo izravnaš na ±0,3 mm/m
// (ločljivost navadne libele 0,5 mm/m, ocena). u = lega sprednjega roba zastavice na merilu proge (m).
// Začetek: zastavica pri 15,0 cm (voziček se z zadnjim delom dotika držalnega magneta); odbijač ustavi voziček, ko je
// zastavica pri 111 cm; nazaj se ne more premakniti mimo magneta (začetna lega). Odbijač z vzmetjo: koeficient odboja 0,35 (ocena).
export const PROGA = { L: 1.2, noge: 1.0, u0: 0.15, uMax: 1.11, uMin: 0.15, kvader: 0.02, miza: [0.003, 0.006], libela: 0.0003, odboj: 0.35 };
// Voziček (ocena po PASCO PAScar ME-6950: 0,25 kg, dolg ~17 cm): telo od 0,8 do 4,5 cm nad progo, zastavica širine 20,0 mm
// (izmerjena s kljunastim merilom, ±0,1 mm) od 4,5 do 9,0 cm nad progo; sprednji rob zastavice je 6 cm za sprednjim delom
// vozička. Kolesa: štiri, vsako ~5 g, polmer 1,25 cm, približno homogen valj: ΣI/r² = 4 · ½ · 5 g = 10 g (ocena).
// Kotalni upor: koeficient μr 0,0025–0,0045 (ocena; ležaji koles in aluminij, v literaturi 0,002–0,005 za šolske vozičke).
// Dodatne uteži za voziček: palica 250 g (ocena, kot pri šolskih kompletih).
export const VOZICEK = {
  m: 0.25, spredaj: 0.06, zadaj: 0.11, telo: [0.008, 0.045], zastavica: 0.02, zast: [0.045, 0.09], Iw: 0.01,
  mur: [0.0025, 0.0045], palica: 0.25, profil: 0.008,
};
// Spust: držalni elektromagnet na progi (začne meriti časovnik, ko izklopiš tok). Remanentni magnetizem in induktivnost tuljave
// zadržita voziček ali kroglico še nekaj ms (zamik 5 ± 1,5 ms za napravo, ±0,3 ms od spusta do spusta, ocena).
// Klešče s stikalom (sprožilec): 12 ± 4 ms, ±1,5 ms (ocena). Z roko: časovnik zaženeš s tipko »hkrati« s spustom; roki se
// uskladita na σ = 40 ms (ocena). Potisk: začetna hitrost 0,15–0,35 m/s (ocena).
export const SPUST = {
  magnet: { zamik: 0.005, raztros: 0.0015, jitter: 0.0003 },
  klesce: { zamik: 0.012, raztros: 0.004, jitter: 0.0015 },
  roka: { sigma: 0.04, v0: 0.005 },
  potisk: [0.15, 0.35],
};
// Škripec z ležajem (ocena za plastičen škripec Ø 5 cm, npr. PASCO ME-9450): I/r² = 4 g, trenje v ležaju ~0,5 mN.
// Obešalo 10 g z zarezo in šest utežic po 10 g (dopustna napaka OIML R111-1, razred M3: 10 g ±20 mg).
// Škripec je lahko v višini kavlja na vozičku ali 5 cm više/niže (napaka). Laboratorijska miza je visoka 90 cm (ocena);
// spodnji rob obešala je na začetku 82 cm nad tlemi (ocena), zato obešalo pristane na tleh, ko voziček prevozi 82 cm.
export const SKRIPEC = { Ip: 0.004, Fp: 0.0005, dy: 0.05, x: 1.22, obesalo: 0.01, utez: 0.01, n: 6, H0: 0.82, miza: 0.9 };

// ------------------------------------------------------------------ zrak in prosto padanje
// Gostota suhega zraka ρ = pM/(RT), M = 28,96 g/mol (ISO 2533). Ljubljana (295 m): zračni tlak ~98 kPa (ISA), v učilnici 20–24 °C (ocena).
export const gostotaZraka = (T = 22, p = 98000) => (p * M_ZRAK * 1e-3) / (R_PLIN * (T + 273.15));
// Predmeti (Cd = koeficient upora, A = prečni presek, L = dolžina, ki zastre žarek, magnet: ali ga elektromagnet drži).
// - jeklena kroglica Ø 16 mm, jeklo 7,85 g/cm³ → 16,8 g. Cd gladke krogle 0,47 (NASA Glenn, »Shape Effects on Drag«; velja pri Re 10³–10⁵).
// - namiznoteniška žogica: 40 mm, 2,7 g (pravila ITTF 2.3), Cd 0,47 → končna hitrost ~8,6 m/s (meritve v literaturi ~8–9 m/s).
// - papirnati stožec: 2,0 g, premer 10 cm, višina 8 cm, Cd 0,8 (ocena; NASA Glenn navaja 0,5 za stožec s konico naprej,
//   tanek papir z odprto osnovo ima več).
// - papirnati filter za kavo: 1,0 g, premer odprtine 12 cm, višina 4,5 cm, Cd 1,2 (ocena, uglašeno na šolske meritve
//   končne hitrosti enega filtra ~1,1 m/s, npr. Vernier »Air Resistance«).
// - ptičje pero ~0,1 g: učinkovit Cd·A uglašen na končno hitrost ~0,6 m/s (ocena); med padanjem niha levo–desno (amplituda do 2,5 cm, ocena).
// Krogli: upoštevan vzgon zraka in pridružena masa ½ρV (potencialni tok okoli krogle, Lamb, Hydrodynamics §92).
const krogla = (D, rho) => (Math.PI * D ** 3 * rho) / 6;
export const PREDMETI = {
  jeklo: { name: "jeklena kroglica (Ø 16 mm)", m: krogla(0.016, 7850), D: 0.016, Cd: 0.47, L: 0.016, magnet: true, krogla: true },
  pingpong: { name: "namiznoteniška žogica", m: 0.0027, D: 0.04, Cd: 0.47, L: 0.04, magnet: false, krogla: true },
  stozec: { name: "papirnati stožec", m: 0.002, D: 0.1, Cd: 0.8, L: 0.08, magnet: false },
  filter: { name: "filter za kavo", m: 0.001, D: 0.12, Cd: 1.2, L: 0.045, magnet: false },
  pero: { name: "ptičje pero", m: 0.0001, D: 0.0714, Cd: 1.17, L: 0.15, magnet: false, niha: 0.025 },
};
export const presek = (p) => (Math.PI * p.D ** 2) / 4;
export function koncnaHitrost(p, rho = gostotaZraka()) {
  const V = p.krogla ? krogla(p.D, 1) : 0;
  return Math.sqrt((2 * (p.m - rho * V) * G_LJ) / (rho * p.Cd * presek(p)));
}
// Stojalo za prosti pad: spodnji rob predmeta je ob spustu 2,20 m nad tlemi, vrata od 2 do 200 cm pod spodnjim robom predmeta (merilni trak, 1 mm),
// lovilna posoda s peno na tleh. Vrata so na nosilcu lahko zamaknjena levo ali desno od navpičnice (ob postavitvi ±2–6 mm, ocena).
export const PAD = { visina: 2.2, hMin: 0.02, hMax: 2.0, zamik: [0.002, 0.006], h: 0.0005 };

// ------------------------------------------------------------------ fizika vozička (proga, po želji vrvica čez škripec)
// Smer + je v desno (navzdol po klancu, proti škripcu). φ = kot vrvice glede na progo (+, ko je škripec više od kavlja).
// Brez vrvice: a = g (sin θ − μr cos θ) / (1 + I/(m r²)). Z vrvico (φ = 0): a = (m_o g − F_p + M g sin θ − μr M g cos θ) / (M + m_o + I_k/r² + I_p/r²).
export function pospesekKlanec({ sin, mur = 0, M = VOZICEK.m, Iw = VOZICEK.Iw, g = G_LJ }) {
  const cos = Math.sqrt(1 - sin * sin);
  return (g * (sin - mur * cos)) / (1 + Iw / M);
}
export function pospesekNewton({ mo, M = VOZICEK.m, sin = 0, mur = 0, Iw = VOZICEK.Iw, Ip = SKRIPEC.Ip, Fp = SKRIPEC.Fp, g = G_LJ }) {
  const cos = Math.sqrt(1 - sin * sin);
  return (mo * g - Fp + M * g * sin - mur * M * g * cos) / (M + mo + Iw + Ip);
}

// Zastiranje žarka: pri kateri višini (nad progo) je kaj, kar ga zastre, in kje vzdolž proge (glede na sprednji rob zastavice).
export function zastira(yb) {
  if (yb < VOZICEK.profil) return { kaj: "proga" };
  if (yb < VOZICEK.telo[1]) return { kaj: "telo", od: -VOZICEK.zadaj, do: VOZICEK.spredaj };
  if (yb <= VOZICEK.zast[1]) return { kaj: "zastavica", od: -VOZICEK.zastavica, do: 0 };
  return { kaj: "nic" };
}

// Iz zapisa poti (vzorci t, x) najde prehode roba čez žarek (linearna interpolacija med koraki).
function sledVrat(xb, od, do_, r, idealno) {
  const j = () => (idealno ? 0 : gauss(r, VRATA.jitter, 3));
  // učinkovita širina: vsak rob se »razširi« za polovico dEff
  const e = idealno ? 0 : VRATA.dEff / 2;
  return { xin: xb - do_ - e + j(), xout: xb - od + e + j(), tin: null, tout: null };
}
function prehod(tr, t0, x0, t1, x1) {
  const f = (xb) => (x0 < xb && x1 >= xb ? t0 + ((xb - x0) / (x1 - x0)) * (t1 - t0) : null);
  if (tr.tin == null) tr.tin = f(tr.xin);
  if (tr.tin != null && tr.tout == null) tr.tout = f(tr.xout);
}

// ------------------------------------------------------------------ ProgaBench: klanec (lab-klanec) in Newtonov zakon (lab-newton2)
export class ProgaBench {
  constructor({ seed = 1, idealno = false, skripec = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.skripecNa = skripec;
    this.mur = idealno ? 0 : VOZICEK.mur[0] + r() * (VOZICEK.mur[1] - VOZICEK.mur[0]);
    const sgn = r() < 0.5 ? -1 : 1;
    this.beta = idealno ? 0 : sgn * (PROGA.miza[0] + r() * (PROGA.miza[1] - PROGA.miza[0])); // nagib mize (rad, + = levo više)
    this.izravnana = idealno;
    this.cas = makeCasovnik(r, idealno);
    this.magnet = { zamik: idealno ? 0 : SPUST.magnet.zamik + napaka(r, SPUST.magnet.raztros) };
    this.mVoz = VOZICEK.m * (idealno ? 1 : 1 + napaka(r, 0.004)); // tehtano: ±1 g (ocena)
    this.mObes = SKRIPEC.obesalo + (idealno ? 0 : napaka(r, UTEZI_MPE[10] / 1000)); // MPE je v gramih
    this.utezi = Array.from({ length: SKRIPEC.n }, () => SKRIPEC.utez + (idealno ? 0 : napaka(r, UTEZI_MPE[10] / 1000)));
    this.palice = [0, 1].map(() => VOZICEK.palica * (idealno ? 1 : 1 + napaka(r, 0.002)));
    // stanje postavitve
    this.kvadri = 0;
    this.podlozka = 0; // mm pod levo nogo (izravnava trenja)
    this.nPalic = 0;
    this.naObes = 1; // utežic na obešalu (poleg obešala)
    this.naVoz = SKRIPEC.n - 1; // utežic na vozičku
    this.vrvica = skripec;
    this.visinaSkripca = 0; // −1, 0, +1
    this.spust = "magnet"; // magnet | roka | potisk
    this.nacin = "spust"; // spust (od spusta do vrat) | vrata (od vrat 1 do vrat 2)
    this.zarek = 0.07; // višina žarka nad progo (m)
    this.vrata = [];
    this.postaviVrata(0, 0.4);
    this.postaviVrata(1, 0.8);
    this.run = null;
    this.u = PROGA.u0;
  }
  postaviVrata(i, x) {
    this.vrata[i] = { nom: x, x: x + (this.idealno ? 0 : napaka(this.r, 3 * VRATA.postavitev, 3)) };
  }
  izravnaj() {
    this.beta = this.idealno ? 0 : napaka(this.r, PROGA.libela, 2);
    this.izravnana = true;
  }
  get sinTheta() {
    return Math.sin(this.beta + Math.asin((this.kvadri * PROGA.kvader + this.podlozka / 1000) / PROGA.noge));
  }
  // masa vozička z vsem, kar je na njem
  get M() {
    return this.mVoz + this.palice.slice(0, this.nPalic).reduce((s, m) => s + m, 0) + (this.skripecNa ? this.utezi.slice(0, this.naVoz).reduce((s, m) => s + m, 0) : 0);
  }
  get mo() {
    return this.mObes + this.utezi.slice(SKRIPEC.n - this.naObes).reduce((s, m) => s + m, 0);
  }
  // nazivne mase (kot piše na utežeh), za tabelo
  get Mnaz() {
    return VOZICEK.m + this.nPalic * VOZICEK.palica + (this.skripecNa ? this.naVoz * SKRIPEC.utez : 0);
  }
  get moNaz() {
    return SKRIPEC.obesalo + this.naObes * SKRIPEC.utez;
  }
  // višina kavlja nad tlemi in razdalja do škripca
  _vrv(u) {
    const D = SKRIPEC.x - (u + VOZICEK.spredaj), dy = this.visinaSkripca * SKRIPEC.dy;
    return { L: Math.hypot(D, dy), cos: D / Math.hypot(D, dy), sin: dy / Math.hypot(D, dy) };
  }
  // Pospešek (m/s²) pri legi u in hitrosti v; napeta = ali vrvica vleče (obešalo še ni na tleh).
  _acc(u, v, napeta) {
    const g = G_LJ, s = this.sinTheta, c = Math.sqrt(1 - s * s), M = this.M, mur = this.mur;
    if (!napeta) {
      const Fd = M * g * s, Ft = mur * M * g * c;
      const sg = Math.abs(v) > 1e-6 ? Math.sign(v) : Math.abs(Fd) > Ft ? Math.sign(Fd) : 0;
      return sg ? (Fd - sg * Ft) / (M + VOZICEK.Iw) : 0;
    }
    const w = this._vrv(u), mo = this.mo, Ip = SKRIPEC.Ip, Fp = SKRIPEC.Fp;
    const inert = M + VOZICEK.Iw + (mo + Ip) * w.cos * w.cos;
    const Fd = w.cos * mo * g + M * g * s;
    let T = mo * g, sg = Math.sign(v);
    if (Math.abs(v) <= 1e-6) {
      const Ft = mur * (M * g * c - T * w.sin) + Fp * w.cos;
      sg = Math.abs(Fd) > Ft ? Math.sign(Fd) : 0;
      if (!sg) return 0;
    }
    let a = 0;
    for (let k = 0; k < 3; k++) {
      a = (Fd - sg * (Fp * w.cos + mur * (M * g * c - T * w.sin))) / inert;
      T = mo * (g - w.cos * a) - Ip * w.cos * a - sg * Fp;
    }
    return a;
  }
  // Spust: izračuna vso pot vnaprej (korak 0,2 ms), prehode zastavice čez žarka in kaj pokaže časovnik.
  spusti() {
    const r = this.r, id = this.idealno, dt = 2e-4;
    let tm, ts;
    if (this.spust === "magnet") (ts = 0), (tm = this.magnet.zamik + (id ? 0 : gauss(r, SPUST.magnet.jitter / 2.5, 2.5)));
    else (tm = 0.1), (ts = id ? tm : tm + gauss(r, SPUST.roka.sigma, 2.5)); // časovnik zaženeš s tipko
    let v = this.spust === "potisk" ? SPUST.potisk[0] + r() * (SPUST.potisk[1] - SPUST.potisk[0]) : this.spust === "roka" && !id ? Math.abs(gauss(r, SPUST.roka.v0, 2)) : 0;
    let u = PROGA.u0, t = tm;
    const z = zastira(this.zarek);
    const tr = this.vrata.map((g) => (z.kaj === "telo" || z.kaj === "zastavica" ? sledVrat(g.x, z.od, z.do, r, id) : null));
    const napetaOd = this.skripecNa && this.vrvica;
    const L0 = napetaOd ? this._vrv(u).L : 0;
    let napeta = napetaOd, tla = null, udarec = null, mir = 0;
    const pot = [[0, u, 0], [tm, u, 0]]; // [t, u, padec obešala]
    let k = 0, padec = 0;
    while (t < 12) {
      const a1 = this._acc(u, v, napeta);
      let un = u + v * dt + 0.5 * a1 * dt * dt, vn = v + a1 * dt;
      // zavora: kotalni upor hitrost le zmanjša do 0, ne obrne
      if (v !== 0 && Math.sign(vn) !== Math.sign(v) && Math.abs(this._acc(u, 0, napeta)) === 0) (vn = 0), (un = u);
      if (un >= PROGA.uMax) {
        un = PROGA.uMax;
        if (udarec == null) udarec = { t: t + dt, v: vn };
        vn = this.skripecNa && napeta ? 0 : -PROGA.odboj * vn;
        if (Math.abs(vn) < 0.02) vn = 0;
      }
      if (un <= PROGA.uMin) (un = PROGA.uMin), (vn = Math.max(0, vn));
      for (const x of tr) if (x) prehod(x, t, u, t + dt, un);
      if (napeta) {
        padec = L0 - this._vrv(un).L;
        if (padec >= SKRIPEC.H0) (napeta = false), (tla = { t: t + dt, u: un }), (padec = SKRIPEC.H0);
      }
      t += dt;
      u = un;
      v = vn;
      if (++k % 10 === 0) pot.push([t, u, padec]);
      mir = v === 0 ? mir + dt : 0;
      if (mir > 0.3) break;
    }
    pot.push([t, u, padec]);
    this.run = { t: 0, ts, tm, tEnd: t, pot, tr, z, udarec, tla, v0: this.spust === "potisk" ? null : 0, nacin: this.nacin };
    return this.run;
  }
  step(dt) {
    if (this.run) this.run.t += dt;
  }
  get tece() {
    return !!this.run && this.run.t < this.run.tEnd;
  }
  // Čas poteka, ko so vsi kanali časovnika, ki se lahko ustavijo, ustavljeni (meritev je končana, voziček se lahko še odbija).
  get tMeritve() {
    const R = this.run;
    if (!R) return 0;
    const t = R.tr.map((x) => (x ? x.tout : null));
    return t.every((x) => x != null) ? Math.min(R.tEnd, Math.max(...t) + 0.2) : R.tEnd;
  }
  get izmerjeno() {
    return !!this.run && this.run.t >= this.tMeritve;
  }
  // Lega vozička in obešala ob času t poteka (interpolacija zapisa poti).
  lega(t = this.run?.t ?? 0) {
    if (!this.run) return { u: PROGA.u0, padec: 0 };
    const p = this.run.pot;
    if (t >= p[p.length - 1][0]) return { u: p[p.length - 1][1], padec: p[p.length - 1][2] };
    let lo = 0, hi = p.length - 1;
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (p[m][0] <= t) lo = m;
      else hi = m;
    }
    const f = (t - p[lo][0]) / (p[hi][0] - p[lo][0] || 1);
    return { u: p[lo][1] + f * (p[hi][1] - p[lo][1]), padec: p[lo][2] + f * (p[hi][2] - p[lo][2]) };
  }
  // Ali je žarek vrat i zdaj zastrt (za LED na vratih).
  zastrt(i, t = this.run?.t ?? 0) {
    const z = zastira(this.zarek);
    if (z.kaj === "proga") return true;
    if (z.kaj === "nic") return false;
    const u = this.lega(t).u, x = this.vrata[i].x;
    return u + z.do >= x && u + z.od <= x;
  }
  // Kaj kaže časovnik ob času t poteka: kanali t1, t2 (ali t12), Δt1, Δt2. stop: ali je kanal že ustavljen.
  casovnik(t = this.run?.t ?? 0) {
    const R = this.run, c = this.cas;
    if (!R) return { t1: 0, t2: 0, dt1: 0, dt2: 0, stop: [false, false, false, false] };
    const [A, B] = R.tr;
    const kanal = (tStart, tStop) => {
      if (tStart == null || t < tStart) return { v: 0, stop: false, zacel: false };
      if (tStop != null && t >= tStop) return { v: casovnikRead(c, tStop - tStart), stop: true, zacel: true };
      return { v: casovnikRead(c, t - tStart), stop: false, zacel: true };
    };
    let k1, k2;
    if (R.nacin === "spust") (k1 = kanal(R.ts, A?.tin)), (k2 = kanal(R.ts, B?.tin));
    else {
      // vrata 1 začnejo, vrata 2 ustavijo; prehod vrat 2 pred začetkom časovnik prezre
      k1 = kanal(A?.tin, B?.tin != null && A?.tin != null && B.tin > A.tin ? B.tin : null);
      k2 = { v: 0, stop: false, zacel: false };
    }
    const d1 = kanal(A?.tin, A?.tout), d2 = kanal(B?.tin, B?.tout);
    return { t1: k1.v, t2: k2.v, dt1: d1.v, dt2: d2.v, stop: [k1.stop, k2.stop, d1.stop, d2.stop], zacel: [k1.zacel, k2.zacel, d1.zacel, d2.zacel] };
  }
  // Končni odčitki po poteku (null, kjer kanal ni ustavljen).
  meritev() {
    if (!this.run) return null;
    const c = this.casovnik(Infinity);
    const val = (i, x) => (c.stop[i] ? x : null);
    return { nacin: this.run.nacin, t1: val(0, c.t1), t2: val(1, c.t2), t12: this.run.nacin === "vrata" ? val(0, c.t1) : null, dt1: val(2, c.dt1), dt2: val(3, c.dt2) };
  }
  // Prava hitrost zastavice ob času t (za preizkuse).
  hitrost(t) {
    const h = 1e-3;
    return (this.lega(t + h).u - this.lega(t - h).u) / (2 * h);
  }
}

// ------------------------------------------------------------------ PadBench: prosti pad (lab-prosti-pad)
export class PadBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    this.T = idealno ? 20 : 22 + napaka(r, 2); // °C (ocena za učilnico)
    this.p = idealno ? 98000 : 98000 + napaka(r, 900); // Pa
    this.rho = gostotaZraka(this.T, this.p);
    this.cas = makeCasovnik(r, idealno);
    this.zamikSpust = { magnet: idealno ? 0 : SPUST.magnet.zamik + napaka(r, SPUST.magnet.raztros), klesce: idealno ? 0 : SPUST.klesce.zamik + napaka(r, SPUST.klesce.raztros) };
    const zs = r() < 0.5 ? -1 : 1;
    this.zamikVrat = idealno ? 0 : zs * (PAD.zamik[0] + r() * (PAD.zamik[1] - PAD.zamik[0])); // napaka postavitve nosilca (m)
    this.premik = 0; // učenčev premik vrat levo–desno (m)
    this.predmet = "jeklo";
    this.spust = "magnet";
    this.postavi(1.0);
    this.run = null;
  }
  get odmik() {
    return this.zamikVrat + this.premik; // vodoravna razdalja žarka od navpičnice skozi središče predmeta (m)
  }
  postavi(h) {
    this.hNom = h;
    this.h = h + (this.idealno ? 0 : napaka(this.r, 3 * PAD.h, 3));
  }
  // Ali izbrani spust drži predmet.
  drzi() {
    return this.spust === "klesce" || PREDMETI[this.predmet].magnet;
  }
  // Pospešek pri hitrosti v (navzdol +): teža − vzgon − upor, deljeno z maso + pridruženo maso.
  _acc(v) {
    const P = PREDMETI[this.predmet], rho = this.rho, V = P.krogla ? krogla(P.D, 1) : 0;
    return ((P.m - rho * V) * G_LJ - 0.5 * rho * P.Cd * presek(P) * v * Math.abs(v)) / (P.m + 0.5 * rho * V);
  }
  spusti() {
    if (!this.drzi()) return (this.run = null);
    const r = this.r, id = this.idealno, P = PREDMETI[this.predmet], S = SPUST[this.spust];
    const tm = this.zamikSpust[this.spust] + (id ? 0 : gauss(r, S.jitter / 2.5, 2.5));
    const dt = 2.5e-4, pot = [[0, 0, 0, 0], [tm, 0, 0, 0]]; // [t, y (pot spodnjega roba), v, x (vodoravni odmik)]
    const A = P.niha ? (id ? 0 : P.niha * (0.4 + 0.6 * r())) : 0, w = 2 * Math.PI * (0.8 + 0.6 * r()), f0 = r() * 2 * Math.PI;
    const xOf = (t) => (A ? A * (Math.sin(w * (t - tm) + f0) - Math.sin(f0)) : 0); // odmik peresa
    let y = 0, v = 0, t = tm, k = 0, tin = null, tout = null;
    const yMax = PAD.visina - 0.03; // dno lovilne posode s peno (3 cm visoka)
    const hb = this.h, R = P.L / 2;
    const tetiva = (x) => {
      const dx = this.odmik - x;
      if (P.krogla) return Math.abs(dx) < P.D / 2 ? Math.sqrt((P.D / 2) ** 2 - dx * dx) : 0; // pol tetive
      return Math.abs(dx) < P.D / 2 ? R : 0;
    };
    const j = () => (id ? 0 : gauss(r, VRATA.jitter, 3));
    const ein = j(), eout = j(), e = id ? 0 : VRATA.dEff / 2;
    while (y < yMax && t < 8) {
      // RK4 za hitrost in pot
      const k1v = this._acc(v), k1y = v;
      const k2v = this._acc(v + 0.5 * dt * k1v), k2y = v + 0.5 * dt * k1v;
      const k3v = this._acc(v + 0.5 * dt * k2v), k3y = v + 0.5 * dt * k2v;
      const k4v = this._acc(v + dt * k3v), k4y = v + dt * k3v;
      const yn = y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y), vn = v + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
      // središče predmeta je R nad spodnjim robom; zastre od (središče + pol tetive) do (središče − pol tetive)
      const x0 = xOf(t), x1 = xOf(t + dt), c0 = tetiva(x0), c1 = tetiva(x1);
      if (tin == null && c1 > 0) {
        const a0 = y - R + c0 + e + ein, a1 = yn - R + c1 + e + ein;
        if (a0 < hb && a1 >= hb) tin = t + ((hb - a0) / (a1 - a0 || 1)) * dt;
      }
      if (tin != null && tout == null) {
        const b0 = y - R - c0 - e + eout, b1 = yn - R - c1 - e + eout;
        if (b1 >= hb || c1 === 0) tout = c1 === 0 ? t + dt : t + ((hb - b0) / (b1 - b0 || 1)) * dt;
      }
      t += dt;
      y = yn;
      v = vn;
      if (++k % 8 === 0) pot.push([t, y, v, x1]);
    }
    pot.push([t, Math.min(y, yMax), v, xOf(t)]);
    this.run = { t: 0, tm, tEnd: t, pot, tin, tout, v: null };
    return this.run;
  }
  step(dt) {
    if (this.run) this.run.t += dt;
  }
  get tece() {
    return !!this.run && this.run.t < this.run.tEnd;
  }
  lega(t = this.run?.t ?? 0) {
    if (!this.run) return { y: 0, v: 0, x: 0 };
    const p = this.run.pot;
    if (t >= p[p.length - 1][0]) return { y: p[p.length - 1][1], v: 0, x: p[p.length - 1][3] };
    let lo = 0, hi = p.length - 1;
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (p[m][0] <= t) lo = m;
      else hi = m;
    }
    const f = (t - p[lo][0]) / (p[hi][0] - p[lo][0] || 1), L = (i) => p[lo][i] + f * (p[hi][i] - p[lo][i]);
    return { y: L(1), v: L(2), x: L(3) };
  }
  // Prava hitrost v trenutku, ko spodnji rob doseže pot y (za preizkuse).
  hitrostPri(y) {
    const p = this.run.pot;
    for (let i = 1; i < p.length; i++) if (p[i][1] >= y) return p[i - 1][2] + ((y - p[i - 1][1]) / (p[i][1] - p[i - 1][1] || 1)) * (p[i][2] - p[i - 1][2]);
    return p[p.length - 1][2];
  }
  zastrt(t = this.run?.t ?? 0) {
    const R = this.run;
    return !!R && R.tin != null && t >= R.tin && (R.tout == null || t < R.tout);
  }
  casovnik(t = this.run?.t ?? 0) {
    const R = this.run, c = this.cas;
    if (!R) return { t: 0, dt: 0, stop: [false, false] };
    const k = t >= (R.tin ?? Infinity) ? { v: casovnikRead(c, R.tin), s: true } : { v: casovnikRead(c, t), s: false };
    const d = R.tin == null || t < R.tin ? { v: 0, s: false } : R.tout != null && t >= R.tout ? { v: casovnikRead(c, R.tout - R.tin), s: true } : { v: casovnikRead(c, t - R.tin), s: false };
    return { t: k.v, dt: d.v, stop: [k.s, d.s] };
  }
  meritev() {
    if (!this.run) return null;
    const c = this.casovnik(Infinity);
    return { t: c.stop[0] ? c.t : null, dt: c.stop[1] ? c.dt : null };
  }
}

// ------------------------------------------------------------------ poenostavitve
export const POENOSTAVITVE_GIBANJE = {
  klanec: [
    "Proga je ravna in toga; v resnici se 1,2 m dolga proga na nogah malo povesi.",
    "Kotalni upor (ležaji koles, kotaljenje po aluminiju) je majhna stalna sila, μr ≈ 0,003 (ocena); zračni upor vozička zanemarimo, pri teh hitrostih je manjši od 1 mN.",
    "Kolesa se vrtijo, zato del energije gre v vrtenje: pospešek je za ~4 % manjši, kot bi bil za drsečo klado brez trenja (ocena za lahka plastična kolesa).",
    "Nogi proge sta točno 100 cm narazen, kvadri so visoki točno 2,0 cm; miza je nagnjena za 3–6 mm na meter, dokler je ne izravnaš z libelo.",
    "Časovnik zaokroži na 0,1 ms in ima napako do 0,01 %; vrata preklopijo, ko je žarek približno napol zastrt, zato je zastavica »videti« za ~0,2 mm širša.",
    "Odbijač na koncu proge vrne voziček s tretjino hitrosti (ocena).",
  ],
  pad: [
    "Zračni upor je F = ½ ρ c A v² s stalnim koeficientom upora c (krogla 0,47; stožec, filter in pero: ocene). Pri majhnih hitrostih bi bil upor bolj sorazmeren s hitrostjo.",
    "Gostota zraka je izračunana iz tlaka in temperature za suh zrak; vlaga jo spremeni za manj kot 1 %.",
    "Pri kroglah upoštevamo vzgon zraka in zrak, ki se giblje s kroglo (pridružena masa); pri papirju in peresu ju zanemarimo.",
    "Elektromagnet kroglico spusti s ~5 ms zamikom (remanentni magnetizem, ocena), klešče s ~12 ms (ocena); časovnik začne meriti že ob izklopu.",
    "Težni pospešek je ljubljanski 9,806 m/s² (formula GRS 80 za 46° širine in 295 m višine); ti računaš z 9,81 m/s².",
    "Pero niha levo in desno po preprosti sinusni poti (ocena); pravo pero se tudi vrti.",
  ],
  newton: [
    "Vrvica je lahka in se ne razteza; škripec ima majhno vztrajnost (kot 4 g dodatne mase) in malo trenja v ležaju (ocene).",
    "Kotalni upor vozička je sorazmeren s pritisno silo (μr ≈ 0,003, ocena); izravnaš ga tako, da progo malo nagneš.",
    "Kolesa vozička se vrtijo: delujejo, kot bi imel voziček 10 g več mase (ocena).",
    "Ko obešalo pristane na tleh, vrvica popusti in voziček se naprej giblje le še zaradi nagiba in upora.",
    "Ko voziček zadene odbijač, se ustavi (obešalo ga drži ob odbijaču); odboj ne vpliva na meritve pred njim.",
    "Uteži so v mejah razreda M3 (10 g ±20 mg); težni pospešek 9,806 m/s², ti računaš z 9,81 m/s².",
  ],
};
