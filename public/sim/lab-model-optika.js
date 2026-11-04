// Virtualni laboratorij, optika: optični disk z laserjem (lab-lom: odboj, lom, popolni odboj) in optična klop z zbiralno lečo
// (lab-leca: slika na zaslonu, 1/a + 1/b = 1/f). Brez DOM (testi: test/laboratorij-optika.test.js).
// Vsaka številka ima vir ali je označena kot ocena. Dolžine so v mm, koti v stopinjah.
import { rng, gauss } from "./lab-model.js";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const RAD = Math.PI / 180;

// ------------------------------------------------------------------ snovi (lomni količnik pri 650 nm, rdeči laser)
// Zrak: n = 1,00028 pri 15 °C in 101,325 kPa (Ciddor 1996, refractiveindex.info).
// Akril (PMMA): n = 1,4881 pri 650 nm (Sultanova in sod. 2009, Sellmeierjeva enačba z refractiveindex.info; pri 587,6 nm 1,4905).
// Steklo BK7: n = 1,5145 pri 650 nm (Schott N-BK7, Sellmeierjeva enačba; n_C = 1,51432 pri 656,3 nm).
// Voda pri 20 °C: n = 1,3314 pri 650 nm (Daimon in Masumura 2007; Hale in Querry 1973).
export const N_ZRAK = 1.00028;
export const SNOVI = {
  pmma: { name: "polvalj iz akrila (PMMA)", kratko: "akril", n: 1.4881 },
  bk7: { name: "polvalj iz stekla (BK7)", kratko: "steklo", n: 1.5145 },
  voda: { name: "voda v polkrožni posodi", kratko: "voda", n: 1.3314 },
  zrcalo: { name: "ravno zrcalo", kratko: "zrcalo", n: null },
};

// Optični disk: skala s 360 razdelki po 1°, polmer skale 120 mm (disk Ø 25 cm, ocena); polvalj s polmerom 50 mm (ocena).
// Laser: rdeča laserska dioda 650 nm, razred 2 (< 1 mW), curek ~1 mm (ocena). Ravno zrcalo odbije ~90 % (aluminij pri 650 nm, ocena).
// Odčitek kota: na pol razdelka (0,5°), z napako očesa ≤ 0,24° (ocena), skupaj ±0,5° (pol najmanjšega razdelka, kot pri kotomeru).
// Nastavitev vpadnega kota (zasuk diska na razdelek): napaka ≤ 0,25° (ocena).
export const DISK = { Rs: 120, R: 50, Rz: 50, zrcalo: 0.9, odcitek: 0.5, oko: 0.12, nastavitev: 0.25, lambda: 650 };

// Snellov zakon n₁ sin α = n₂ sin β. Vrne β v stopinjah ali null (popolni odboj).
export function snell(n1, n2, alfa) {
  const s = (n1 / n2) * Math.sin(alfa * RAD);
  return Math.abs(s) > 1 ? null : Math.asin(s) / RAD;
}
// Mejni kot za prehod iz snovi z n v zrak.
export const mejniKot = (n, n0 = N_ZRAK) => Math.asin(n0 / n) / RAD;
// Fresnelove enačbe: delež odbite svetlobe za nepolarizirano svetlobo (povprečje s- in p-polarizacije).
export function fresnel(n1, n2, alfa) {
  const ci = Math.cos(alfa * RAD), si = Math.sin(alfa * RAD), st = (n1 / n2) * si;
  if (st >= 1) return 1;
  const ct = Math.sqrt(1 - st * st);
  const rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct), rp = (n2 * ci - n1 * ct) / (n2 * ci + n1 * ct);
  return (rs * rs + rp * rp) / 2;
}

// ------------------------------------------------------------------ sledenje žarkom na disku
// Središče diska je v izhodišču, ravna ploskev polvalja (ali zrcalo) leži na osi x, vpadna pravokotnica je os y.
// Polvalj zavzema y ≤ 0, x² + y² ≤ R². Svetloba iz zraka pride od zgoraj, iz snovi pa skozi okroglo ploskev od spodaj.
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
function lomOdboj(u, N, n1, n2) {
  // N je normala proti vpadnemu žarku (dot(u, N) < 0)
  const ci = -dot(u, N), eta = n1 / n2, k = 1 - eta * eta * (1 - ci * ci);
  const r = [u[0] + 2 * ci * N[0], u[1] + 2 * ci * N[1]];
  const alfa = Math.acos(clamp(ci, -1, 1)) / RAD;
  if (k < 0) return { r, R: 1, t: null };
  const a = eta * ci - Math.sqrt(k);
  return { r, R: fresnel(n1, n2, alfa), t: [eta * u[0] + a * N[0], eta * u[1] + a * N[1]] };
}
// Presečišče žarka s krožnico s polmerom R: vrne vse t > eps.
function krog(p, u, R) {
  const b = dot(p, u), c = dot(p, p) - R * R, D = b * b - c;
  if (D < 0) return [];
  const q = Math.sqrt(D);
  return [-b - q, -b + q].filter((t) => t > 1e-7);
}

// Sledi laserskemu žarku po disku. Vrne odseke { p0, p1, I } in zadetke na skali { path, I, kot (od pravokotnice), zgoraj, x }.
export function sledi({ snov = "pmma", smer = "zrak", alfa = 30, zamik = 0 }) {
  const S = SNOVI[snov], Rs = DISK.Rs, R = S.n ? DISK.R : DISK.Rz;
  const a = alfa * RAD, zgoraj = smer === "zrak" || !S.n;
  // laser je na robu diska pri kotu α od pravokotnice (levo), usmerjen v središče; zamik ga premakne vzporedno
  const u = zgoraj ? [Math.sin(a), -Math.cos(a)] : [Math.sin(a), Math.cos(a)];
  const perp = [u[1], -u[0]];
  const p0 = [-u[0] * Rs + perp[0] * zamik, -u[1] * Rs + perp[1] * zamik];
  const odseki = [], zadetki = [];
  const vrsta = [{ p: p0, u, I: 1, notri: false, path: [] }];
  for (let g = 0; vrsta.length && g < 40; g++) {
    const z = vrsta.shift();
    const { p, u: d, I, notri, path } = z;
    let best = null;
    // ravna ploskev ali zrcalo (y = 0, |x| ≤ R)
    if (Math.abs(d[1]) > 1e-12) {
      const t = -p[1] / d[1];
      if (t > 1e-7 && Math.abs(p[0] + t * d[0]) <= R) best = { t, kje: "f" };
    }
    // okrogla ploskev polvalja (le spodnja polovica krožnice, y < 0): najbližji veljavni zadetek
    if (S.n) {
      const ta = krog(p, d, R).find((t) => p[1] + t * d[1] < -1e-9);
      if (ta != null && (!best || ta < best.t)) best = { t: ta, kje: "a" };
    }
    if (!best) {
      // do skale
      const t = Math.max(...krog(p, d, Rs), 0);
      const q = [p[0] + t * d[0], p[1] + t * d[1]];
      odseki.push({ p0: p, p1: q, I, notri });
      zadetki.push({ path, I, kot: Math.atan2(Math.abs(q[0]), Math.abs(q[1])) / RAD, zgoraj: q[1] > 0, x: q[0], y: q[1] });
      continue;
    }
    const q = [p[0] + best.t * d[0], p[1] + best.t * d[1]];
    odseki.push({ p0: p, p1: q, I, notri });
    if (path.length >= 6) continue;
    if (!S.n) {
      // zrcalo: odbija le sprednja (zgornja) stran, zadnja stran je pobarvana
      if (d[1] < 0) vrsta.push({ p: q, u: [d[0], -d[1]], I: I * DISK.zrcalo, notri: false, path: [...path, "fR"] });
      continue;
    }
    const Nout = best.kje === "f" ? [0, 1] : [q[0] / R, q[1] / R]; // navzven iz polvalja
    const N = dot(d, Nout) < 0 ? Nout : [-Nout[0], -Nout[1]];
    const n1 = notri ? S.n : N_ZRAK, n2 = notri ? N_ZRAK : S.n;
    const L = lomOdboj(d, N, n1, n2);
    if (I * L.R > 0.002) vrsta.push({ p: q, u: L.r, I: I * L.R, notri, path: [...path, best.kje + "R"] });
    if (L.t && I * (1 - L.R) > 0.002) vrsta.push({ p: q, u: L.t, I: I * (1 - L.R), notri: !notri, path: [...path, best.kje + "T"] });
  }
  // lomljeni žarek: povsod prepuščen, enkrat skozi ravno ploskev; odbiti: enkrat odbit na ravni ploskvi, drugod prepuščen
  const lom = zadetki.filter((z) => z.path.includes("fT") && z.path.every((s) => s.endsWith("T"))).sort((x, y) => y.I - x.I)[0] || null;
  const odboj = zadetki.filter((z) => z.path.filter((s) => s === "fR").length === 1 && z.path.every((s) => s === "fR" || s.endsWith("T"))).sort((x, y) => y.I - x.I)[0] || null;
  return { odseki, zadetki, lom, odboj, p0, u };
}

export class LomBench {
  constructor({ seed = 1, idealno = false } = {}) {
    this.r = rng(seed);
    this.idealno = idealno;
    this.snov = "pmma";
    this.smer = "zrak";
    this.zamik = 0;
    this.laser = false;
    this.nastavi(30);
  }
  // Disk zasukaš na razdelek α; pravi kot se od oznake razlikuje do 0,25° (ocena).
  nastavi(alfa) {
    this.alfa = alfa;
    this.napaka = this.idealno ? 0 : clamp(gauss(this.r, DISK.nastavitev / 2.4, 2.4), -DISK.nastavitev, DISK.nastavitev);
  }
  get alfaPravi() {
    return this.alfa + this.napaka;
  }
  sledi() {
    return sledi({ snov: this.snov, smer: SNOVI[this.snov].n ? this.smer : "zrak", alfa: this.alfaPravi, zamik: this.zamik });
  }
  // Odčitek na skali: na pol razdelka, z napako očesa. odPloskve: napačno, kot od ploskve (90° − kot).
  beri(kot) {
    if (kot == null) return null;
    const e = this.idealno ? 0 : gauss(this.r, DISK.oko, 2);
    return Math.round((kot + e) / DISK.odcitek) * DISK.odcitek;
  }
  odcitaj({ odPloskve = false } = {}) {
    const T = this.sledi();
    const f = (z) => (z ? (odPloskve ? 90 - this.beri(z.kot) : this.beri(z.kot)) : null);
    return {
      alfa: odPloskve ? 90 - this.alfa : this.alfa,
      odboj: f(T.odboj), lom: f(T.lom),
      popolni: !!SNOVI[this.snov].n && !T.lom,
      Iodboj: T.odboj?.I ?? 0, Ilom: T.lom?.I ?? 0,
    };
  }
}

// Naklon premice skozi izhodišče (sin β od sin α): k = Σxy / Σx².
export const naklon = (pts) => {
  const sxy = pts.reduce((s, [x, y]) => s + x * y, 0), sxx = pts.reduce((s, [x]) => s + x * x, 0);
  return sxx > 0 ? sxy / sxx : NaN;
};

// ------------------------------------------------------------------ optična klop in zbiralna leča (lab-leca)
// Tračnica 1 m z mm skalo. Predmet: svetleča puščica iz LED, visoka 20 mm. Leče: zbiralne f = 50, 100, 150 mm, odstopanje
// do ±2 % od napisane vrednosti (ocena). Odprtina leče v držalu D = 30 mm (ocena). Sredina leče je od oznake na jahaču
// zamaknjena do ±1 mm (ocena), puščica prav tako. Jahača ne moreta biti bližje kot 15 mm (širina držal, ocena).
// Ostrina: krog nejasnosti na zaslonu c = D·|1 − s/b| (s je razdalja leča–zaslon, b razdalja slike); sliko vidimo
// ostro, dokler je c ≤ 0,5 mm (ocena za oko na ~40 cm od belega zaslona; za posameznega učenca 0,35–0,65 mm).
// Velikost slike na zaslonu odčitaš z ravnilom na 0,5 mm (z napako očesa ≤ 0,2 mm, ocena; skupaj ≤ 0,45 mm).
export const KLOP = { L: 1000, h: 20, D: 30, cOstro: 0.5, oko: 0.2, toleranca: 0.02, oznaka: 1, jahac: 15, ravnilo: 0.5 };
export const LECE = [50, 100, 150];

// Enačba tanke leče 1/a + 1/b = 1/f. b < 0: navidezna slika (na strani predmeta). M = −b/a (negativno: obrnjena).
export function slika(a, f) {
  if (Math.abs(a - f) < 1e-9) return { b: Infinity, M: -Infinity, realna: false };
  const b = (a * f) / (a - f);
  return { b, M: -b / a, realna: b > 0 };
}
// Krog nejasnosti na zaslonu na razdalji s za lečo (deluje tudi za a ≤ f): c = D·|1 − s (1/f − 1/a)|.
export const nejasnost = (a, s, f, D = KLOP.D) => D * Math.abs(1 - s * (1 / f - 1 / a));

export class LecaBench {
  constructor({ seed = 1, idealno = false } = {}) {
    const r = (this.r = rng(seed));
    this.idealno = idealno;
    const g = (sd, lim) => (idealno ? 0 : gauss(r, sd, lim));
    this.fPravi = Object.fromEntries(LECE.map((f) => [f, f * (1 + clamp(g(KLOP.toleranca / 2.5, 2.5), -KLOP.toleranca, KLOP.toleranca))]));
    this.dL = clamp(g(KLOP.oznaka / 2.5, 2.5), -KLOP.oznaka, KLOP.oznaka);
    this.dP = clamp(g(KLOP.oznaka / 2.5, 2.5), -KLOP.oznaka, KLOP.oznaka);
    this.cMeja = KLOP.cOstro * (1 + clamp(g(0.15, 2), -0.3, 0.3));
    this.f = 100;
    this.xP = 50;
    this.xL = 300;
    this.xZ = 600;
  }
  // Premakne jahač (predmet, leča, zaslon) na mm, pazi na vrstni red in širino držal.
  premakni(kaj, x) {
    const j = KLOP.jahac;
    x = Math.round(x);
    if (kaj === "P") this.xP = clamp(x, 0, this.xL - j);
    if (kaj === "L") this.xL = clamp(x, this.xP + j, this.xZ - j);
    if (kaj === "Z") this.xZ = clamp(x, this.xL + j, KLOP.L);
    return this[`x${kaj}`];
  }
  stanje() {
    const f = this.fPravi[this.f], a = this.xL + this.dL - (this.xP + this.dP), s = this.xZ - (this.xL + this.dL);
    const sl = slika(a, f), c = nejasnost(a, s, f);
    return { f, a, s, ...sl, c, ostro: c <= this.cMeja, y: (-KLOP.h * s) / a, L: this.xZ - this.xP, viden: a > f };
  }
  // Pri trenutni razdalji predmeta: kje med s1 in s2 je slika še videti ostra (globinska ostrina): D·|1 − s/b| ≤ cMeja.
  ostroObmocje() {
    const { b, realna } = this.stanje(), k = this.cMeja / KLOP.D;
    return realna ? [b * (1 - k), b * (1 + k)] : null;
  }
  // Odčitek: lege jahačev na mm in velikost slike na zaslonu (z ravnilom). od: "leca" (prav) | "konec" (od konca tračnice).
  odcitaj({ od = "leca" } = {}) {
    const S = this.stanje();
    const e = this.idealno ? 0 : gauss(this.r, KLOP.oko / 2, 2);
    const y = Math.round((Math.abs(S.y) + e) / KLOP.ravnilo) * KLOP.ravnilo;
    const a = od === "konec" ? this.xL : this.xL - this.xP, b = od === "konec" ? this.xZ : this.xZ - this.xL;
    return { xP: this.xP, xL: this.xL, xZ: this.xZ, a, b, y, ostro: S.ostro, obrnjena: S.y < 0, c: S.c };
  }
}

// Goriščna razdalja iz meritev: povprečje a·b/(a + b).
export const fIzMeritev = (rows) => rows.reduce((s, r) => s + (r.a * r.b) / (r.a + r.b), 0) / rows.length;

// ------------------------------------------------------------------ poenostavitve (za učence 12–14 let)
export const POENOSTAVITVE_OPTIKA = {
  lom: [
    "Laserski žarek je tanka črta (v resnici je širok približno 1 mm). Svetloba je nepolarizirana; laserska dioda je v resnici delno polarizirana, zato se odbije malo drugačen delež.",
    "Lomni količniki veljajo za rdečo svetlobo 650 nm: akril 1,488, steklo BK7 1,515, voda 1,331 (pri 20 °C), zrak 1,0003. Za modro svetlobo so malo večji.",
    "Tanko steno plastične posode za vodo smo zanemarili. Polvalj nič svetlobe ne vpije.",
    "Kot odčitaš na pol stopinje natančno (±0,5°). Ko zasučeš disk na razdelek, je pravi kot lahko do 0,25° drugačen.",
    "Koliko svetlobe se odbije, izračunamo s Fresnelovimi enačbami. Zrcalo odbije 90 % (ocena), drugo vpije.",
  ],
  leca: [
    "Leča je tanka: a in b merimo od njene sredine. Prave leče so debele nekaj milimetrov in sliko na robu malo popačijo; tega ni.",
    "Napisana goriščna razdalja je lahko do 2 % napačna (ocena); prava je skrita in jo izmeriš.",
    "Kdaj je slika »ostra«, je ocena: slika se zdi ostra, dokler je zamegljen rob ožji od približno pol milimetra. Zato je ostra slika v majhnem območju leg zaslona, ne le v eni točki.",
    "Sredina leče in puščice je lahko do 1 mm stran od oznake na jahaču (ocena).",
    "Slika na zaslonu je enako svetla, ne glede na to, kako velika je; v resnici je večja slika temnejša.",
  ],
};
