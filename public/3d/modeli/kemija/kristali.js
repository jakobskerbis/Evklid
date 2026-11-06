// Kristalne mreže: NaCl, CsCl, diamant, grafit, kovine (bcc, fcc, hcp) in led Ih.
// Položaji delcev so izračunani iz osnovne celice (mrežne konstante pri sobni temperaturi, led pri okoli −20 °C)
// in ponovljeni n-krat v vsaki smeri; sosede, koordinacijska števila in zapolnjenost so izračunani iz teh položajev.
// Polmeri za kaloto: ionski polmeri po Shannonu (1976) za ustrezno koordinacijsko število, za kovine in ogljik
// polovica razdalje med najbližjima atomoma, za led van der Waalsova polmera O in H (Bondi 1964).
// Vodiki v ledu so razporejeni po pravilih led (Bernal–Fowler): vsak kisik ima dva bližnja vodika, na vsaki zvezi O···O
// je natanko en vodik. V pravem ledu je ta razporeditev neurejena, tu je ena od dovoljenih.

export const info = {
  id: "kristali",
  naslov: "Kristalne mreže",
  podrocje: "kemija",
  predmet: "KEM",
  opis: "Ionski, kovalentni, kovinski in molekulski kristali: NaCl, CsCl, diamant, grafit, železo, baker, magnezij in led. Razdalje so v pravem razmerju; pokaži osnovno celico, kaloto ali koordinacijo izbranega delca.",
  merilo: { m: 1.2e-9, oznaka: "1,2 nm" },
  poskusi: "Vklopi koordinacijo in preštej najbližje sosede; primerjaj NaCl, CsCl in kovine.",
};

const S3 = Math.sqrt(3);
const FCC = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]];
const premakni = (baza, d) => baza.map((p) => p.map((x, i) => (x + d[i]) % 1));
const vrsta = (ime, kratko, barva, r, rk, opis) => ({ ime, kratko, barva, r, rk, opis });

export const MREZE = [
  {
    id: "nacl", ime: "Natrijev klorid", formula: "NaCl", sistem: "kub", a: 564.0,
    mreza: "ploskovno centrirana kubična (prepleteni mreži ionov Na⁺ in Cl⁻)", vez: "ionska vez (privlak med ioni Na⁺ in Cl⁻)",
    vrste: {
      na: vrsta("Natrijevi ioni Na⁺", "Na⁺", "#ab5cf2", 102, 50, "Pozitivni ioni, ki nastanejo, ko atom natrija odda en elektron; vsakega obdaja šest kloridnih ionov."),
      cl: vrsta("Kloridni ioni Cl⁻", "Cl⁻", "#4fd06a", 181, 78, "Negativni ioni, ki nastanejo, ko atom klora sprejme en elektron; so skoraj dvakrat večji od natrijevih."),
    },
    baza: [...FCC.map((p) => ["na", ...p]), ...premakni(FCC, [0.5, 0, 0]).map((p) => ["cl", ...p])],
    vezi: [["na", "cl"]], koord: { sredina: "na", sosedi: "cl", polieder: "oktaeder" }, enote: (n) => `${n} formulske enote NaCl`,
    vCelici: "so 4 ioni Na⁺ in 4 ioni Cl⁻ (4 formulske enote NaCl)",
    vezOpis: "Palčke kažejo najbližje sosede; ionska vez ni usmerjena, vsak ion privlači vse nasprotno nabite ione okoli sebe.",
  },
  {
    id: "cscl", ime: "Cezijev klorid", formula: "CsCl", sistem: "kub", a: 412.3,
    mreza: "enostavna kubična z ionom v središču (Cl⁻ v ogliščih, Cs⁺ v središču kocke)", vez: "ionska vez (privlak med ioni Cs⁺ in Cl⁻)",
    vrste: {
      cs: vrsta("Cezijevi ioni Cs⁺", "Cs⁺", "#8a55d0", 174, 82, "Veliki pozitivni ioni cezija; ker so veliki, okoli sebe sprejmejo kar osem kloridnih ionov."),
      cl: vrsta("Kloridni ioni Cl⁻", "Cl⁻", "#4fd06a", 181, 82, "Negativni ioni klora, ki so v ogliščih kocke; tudi vsakega obdaja osem cezijevih ionov."),
    },
    baza: [["cl", 0, 0, 0], ["cs", 0.5, 0.5, 0.5]],
    vezi: [["cs", "cl"]], koord: { sredina: "cs", sosedi: "cl", polieder: "kocka" }, enote: (n) => `${n} formulska enota CsCl`,
    vCelici: "sta en ion Cs⁺ in en ion Cl⁻ (1 formulska enota CsCl)",
    vezOpis: "Palčke kažejo najbližje sosede; vsak ion ima osem nasprotno nabitih sosedov v ogliščih kocke.",
  },
  {
    id: "diamant", ime: "Diamant", formula: "C", sistem: "kub", a: 356.7,
    mreza: "diamantna mreža (ploskovno centrirana kubična s štirimi dodatnimi atomi v notranjosti)", vez: "kovalentna vez (vsak atom C tvori štiri enake vezi)",
    vrste: { c: vrsta("Ogljikovi atomi", "C", "#a0a7b4", 77, 34, "Vsak atom ogljika je s kovalentnimi vezmi povezan s štirimi sosedi, zato je diamant najtrša naravna snov.") },
    baza: [...FCC, ...premakni(FCC, [0.25, 0.25, 0.25])].map((p) => ["c", ...p]),
    vezi: [["c", "c"]], koord: { sredina: "c", sosedi: "c", polieder: "tetraeder" }, enote: (n) => `${n} atomov C`,
    vCelici: "je 8 atomov C",
    vezOpis: "Kovalentne vezi C–C dolžine 154 pm kažejo v oglišča tetraedra (kot 109,5°) in povezujejo cel kristal v eno samo molekulo.",
  },
  {
    id: "grafit", ime: "Grafit", formula: "C", sistem: "hex", a: 246.1, c: 670.8,
    mreza: "heksagonalna; plasti iz šestkotnikov, zložene v zaporedju ABAB", vez: "kovalentna vez v plasteh, med plastmi šibke van der Waalsove sile",
    vrste: { c: vrsta("Ogljikovi atomi", "C", "#a0a7b4", 71, 30, "Vsak atom ogljika je povezan s tremi sosedi v isti plasti; četrti elektron je prost, zato grafit prevaja elektriko.") },
    baza: [[0, 0, 0.25], [0, 0, 0.75], [1 / 3, 2 / 3, 0.25], [2 / 3, 1 / 3, 0.75]].map((p) => ["c", ...p]),
    vezi: [["c", "c"]], koord: { sredina: "c", sosedi: "c", polieder: "trikotnik" }, enote: (n) => `${n} atomi C`,
    vCelici: "so 4 atomi C",
    vezOpis: "Kovalentne vezi C–C (142 pm) povezujejo atome le znotraj plasti; plasti so 335 pm narazen in drsijo ena po drugi.",
  },
  {
    id: "bcc", ime: "Železo α", formula: "Fe", sistem: "kub", a: 286.65, kovina: true,
    mreza: "telesno centrirana kubična", vez: "kovinska vez (kovinski ioni v morju prostih elektronov)",
    vrste: { fe: vrsta("Železovi atomi", "Fe", "#e06633", 124, 50, "Atomi železa v ogliščih in v središču kocke; zunanje elektrone si delijo vsi atomi kristala.") },
    baza: [["fe", 0, 0, 0], ["fe", 0.5, 0.5, 0.5]],
    vezi: [["fe", "fe"]], koord: { sredina: "fe", sosedi: "fe", polieder: "kocka" }, enote: (n) => `${n} atoma Fe`,
    vCelici: "sta 2 atoma Fe",
    vezOpis: "Palčke kažejo najbližje sosede; kovinska vez ni med parom atomov, ampak jo tvorijo prosti elektroni med vsemi ioni.",
  },
  {
    id: "fcc", ime: "Baker", formula: "Cu", sistem: "kub", a: 361.5, kovina: true,
    mreza: "ploskovno centrirana kubična (kubični gosti sklad, zlaganje ABC)", vez: "kovinska vez (kovinski ioni v morju prostih elektronov)",
    vrste: { cu: vrsta("Bakrovi atomi", "Cu", "#c88033", 128, 52, "Atomi bakra v ogliščih in na sredini ploskev kocke; zloženi so tako gosto, kot je le mogoče.") },
    baza: FCC.map((p) => ["cu", ...p]),
    vezi: [["cu", "cu"]], koord: { sredina: "cu", sosedi: "cu", polieder: "kubooktaeder" }, enote: (n) => `${n} atomi Cu`,
    vCelici: "so 4 atomi Cu",
    vezOpis: "Palčke kažejo najbližje sosede; kovinska vez ni med parom atomov, ampak jo tvorijo prosti elektroni med vsemi ioni.",
  },
  {
    id: "hcp", ime: "Magnezij", formula: "Mg", sistem: "hex", a: 320.9, c: 521.0, kovina: true,
    mreza: "heksagonalna gosto zložena (zlaganje ABAB)", vez: "kovinska vez (kovinski ioni v morju prostih elektronov)",
    vrste: { mg: vrsta("Magnezijevi atomi", "Mg", "#8ad44a", 160, 62, "Atomi magnezija v plasteh, kjer vsak leži v vdolbini med tremi atomi plasti pod njim.") },
    baza: [[1 / 3, 2 / 3, 0.25], [2 / 3, 1 / 3, 0.75]].map((p) => ["mg", ...p]),
    vezi: [["mg", "mg"]], koord: { sredina: "mg", sosedi: "mg", polieder: "antikubooktaeder" }, enote: (n) => `${n} atoma Mg`,
    vCelici: "sta 2 atoma Mg; to je primitivna celica, v šeststrani prizmi, ki jo sestavljajo tri take celice, pa je 6 atomov Mg",
    vezOpis: "Palčke kažejo najbližje sosede; kovinska vez ni med parom atomov, ampak jo tvorijo prosti elektroni med vsemi ioni.",
  },
  {
    id: "led", ime: "Led Ih", formula: "H₂O", sistem: "hex", a: 452, c: 737, led: true,
    mreza: "heksagonalna; kisikovi atomi tetraedrično, med molekulami vodikove vezi", vez: "kovalentne vezi O–H v molekulah, med molekulami vodikove vezi",
    vrste: {
      o: vrsta("Kisikovi atomi", "O", "#e8453c", 152, 38, "Vsak kisik ima dva svoja vodika in prek vodikovih vezi še dva vodika sosednjih molekul, skupaj štiri v tetraedru."),
      h: vrsta("Vodikovi atomi", "H", "#f2f4f7", 120, 22, "Vsak vodik je s kovalentno vezjo vezan na svoj kisik in z vodikovo vezjo na kisik sosednje molekule."),
    },
    baza: [[1 / 3, 2 / 3, 1 / 16], [2 / 3, 1 / 3, 9 / 16], [2 / 3, 1 / 3, 15 / 16], [1 / 3, 2 / 3, 7 / 16]].map((p) => ["o", ...p]),
    vezi: [], koord: { sredina: "o", sosedi: "o", polieder: "tetraeder" }, enote: (n) => `${n} molekule H₂O`,
    vCelici: "so 4 molekule H₂O",
    vezOpis: "Kovalentne vezi O–H (100 pm) držijo skupaj atome v molekuli vode.",
  },
];
const OH = 100; // dolžina vezi O–H v pm

/** Vektorji osnovne celice v pm (kristalne osi; z je os c). */
export function vektorji(M) {
  return M.sistem === "kub" ? [[M.a, 0, 0], [0, M.a, 0], [0, 0, M.a]] : [[M.a, 0, 0], [-M.a / 2, (M.a * S3) / 2, 0], [0, 0, M.c]];
}
export const prostornina = (M) => (M.sistem === "kub" ? M.a ** 3 : ((M.a * M.a * S3) / 2) * M.c);
const kart = (V, f) => [0, 1, 2].map((i) => f[0] * V[0][i] + f[1] * V[1][i] + f[2] * V[2][i]);
const razd = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
const EPS = 1e-6;

/** Vsi delci osnovnega motiva z ulomljenimi koordinatami v [lo, hi] (meje vključene). */
export function delci(M, lo, hi) {
  const V = vektorji(M), out = [], H = Array.isArray(hi) ? hi : [hi, hi, hi];
  for (let i = Math.floor(lo) - 1; i <= Math.ceil(H[0]); i++) for (let j = Math.floor(lo) - 1; j <= Math.ceil(H[1]); j++) for (let k = Math.floor(lo) - 1; k <= Math.ceil(H[2]); k++) {
    for (const [v, x, y, z] of M.baza) {
      const f = [x + i, y + j, z + k];
      if (f.every((q, a) => q >= lo - EPS && q <= H[a] + EPS)) out.push({ v, f, p: kart(V, f) });
    }
  }
  return out;
}

/** Prispevki delcev k eni osnovni celici: oglišča ⅛, robovi ¼, ploskve ½, notranjost 1. */
export function stetjeVCelici(M) {
  const po = {};
  for (const d of delci(M, 0, 1)) {
    const k = d.f.filter((q) => Math.abs(q) < EPS || Math.abs(q - 1) < EPS).length;
    ((po[d.v] ||= {})[k] ||= 0);
    po[d.v][k]++;
  }
  const UL = { 3: "⅛", 2: "¼", 1: "½", 0: "1" };
  return Object.entries(po).map(([v, s]) => {
    const deli = Object.keys(s).sort((a, b) => b - a).map((k) => ({ k: +k, st: s[k] }));
    const vsota = deli.reduce((x, d) => x + d.st / 2 ** d.k, 0);
    return { v, vsota, zapis: deli.map((d) => (d.k === 0 ? `${d.st}` : `${d.st}·${UL[d.k]}`)).join(" + ") + ` = ${Math.round(vsota * 100) / 100}` };
  });
}

/** Število formulskih enot (pri ionskih kristalih) ali atomov oz. molekul v osnovni celici. */
export function enoteVCelici(M) {
  const st = stetjeVCelici(M);
  return M.id === "nacl" || M.id === "cscl" ? st.find((x) => x.v === Object.keys(M.vrste)[0]).vsota : st.reduce((a, x) => a + x.vsota, 0);
}
/** Najkrajša razdalja med delcema vrst va in vb (pm). */
export function najblizja(M, va, vb) {
  const vsi = delci(M, -1, 2), V = vektorji(M);
  let d = Infinity;
  for (const [v, x, y, z] of M.baza) {
    if (v !== va) continue;
    const p = kart(V, [x, y, z]);
    for (const q of vsi) if (q.v === vb) { const r = razd(p, q.p); if (r > 1 && r < d) d = r; }
  }
  return d;
}
/** Sosedi delca p vrste vb v razdalji d (±5 %) iz neskončne mreže. */
export function sosedi(M, p, vb, d, okolica) {
  return okolica.filter((q) => q.v === vb && Math.abs(razd(p, q.p) - d) < 0.05 * d);
}
/** Zapolnjenost prostora pri kovinah: delež prostornine celice, ki ga zavzemajo krogle s polmerom pol razdalje do soseda. */
export function zapolnjenost(M) {
  const v = Object.keys(M.vrste)[0], r = najblizja(M, v, v) / 2;
  const n = stetjeVCelici(M).reduce((s, x) => s + x.vsota, 0);
  return (n * (4 / 3) * Math.PI * r ** 3) / prostornina(M);
}

/** Vodiki v ledu po pravilih led: periodična mreža n×n×n, usmeritev zvez O···O po zaprtih poteh (vsak O ima 2 izhodni zvezi). */
export function vodikiLedu(M, N, kisiki) {
  const [nx, ny, nz] = Array.isArray(N) ? N : [N, N, N];
  const V = vektorji(M), dOO = najblizja(M, "o", "o"), zveze = [], sos = kisiki.map(() => []);
  for (let i = 0; i < kisiki.length; i++) for (let j = i + 1; j < kisiki.length; j++) {
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
      const q = kart(V, [kisiki[j].f[0] + a * nx, kisiki[j].f[1] + b * ny, kisiki[j].f[2] + c * nz]);
      if (Math.abs(razd(kisiki[i].p, q) - dOO) < 5) {
        const e = { i, j, q, pi: kart(V, [kisiki[i].f[0] - a * nx, kisiki[i].f[1] - b * ny, kisiki[i].f[2] - c * nz]), znotraj: !a && !b && !c, smer: null };
        sos[i].push(zveze.length); sos[j].push(zveze.length); zveze.push(e);
      }
    }
  }
  // zaprte poti: vsak kisik ima 4 zveze (sodo), zato se pot vedno konča v začetnem kisiku
  for (let s = 0; s < kisiki.length; s++) {
    for (;;) {
      let v = s, korakov = 0;
      if (!sos[v].some((e) => zveze[e].smer === null)) break;
      do {
        const e = sos[v].find((x) => zveze[x].smer === null);
        if (e === undefined) break;
        const z = zveze[e];
        z.smer = z.i === v ? 1 : -1; // 1: vodik na kisiku i (dajalec i), −1: na kisiku j
        v = z.i === v ? z.j : z.i;
      } while (v !== s && ++korakov < 10000);
    }
  }
  return zveze.map((z) => {
    const dajalec = z.smer === 1 ? kisiki[z.i].p : kisiki[z.j].p, prejemnik = z.smer === 1 ? z.q : z.pi;
    const d = razd(dajalec, prejemnik), h = dajalec.map((x, k) => x + ((prejemnik[k] - x) * OH) / d);
    return { h, dajalec, prejemnik, dajalecI: z.smer === 1 ? z.i : z.j, prejemnikI: z.smer === 1 ? z.j : z.i, znotraj: z.znotraj };
  });
}

/** Konveksna ovojnica majhnega števila točk: seznam mnogokotnikov (indeksi točk, urejeni po obodu). */
function ovojnica(T) {
  const n = T.length, ploskve = [], kljuci = new Set();
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const krat = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const skal = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const vel = Math.max(...T.map((p) => Math.hypot(...p)), 1e-9);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
    let nn = krat(sub(T[j], T[i]), sub(T[k], T[i]));
    const l = Math.hypot(...nn);
    if (l < 1e-6 * vel * vel) continue;
    nn = nn.map((x) => x / l);
    const d0 = skal(nn, T[i]);
    let poz = 0, neg = 0;
    for (const p of T) { const s = skal(nn, p) - d0; if (s > 1e-4 * vel) poz++; else if (s < -1e-4 * vel) neg++; }
    if (poz && neg) continue;
    if (poz) { nn = nn.map((x) => -x); }
    const na = T.map((p, q) => q).filter((q) => Math.abs(skal(nn, T[q]) - skal(nn, T[i])) < 1e-4 * vel);
    const kl = na.join(",");
    if (kljuci.has(kl)) continue;
    kljuci.add(kl);
    const c = na.reduce((s, q) => s.map((x, m) => x + T[q][m] / na.length), [0, 0, 0]);
    const u = sub(T[na[0]], c), w = krat(nn, u);
    na.sort((a, b) => Math.atan2(skal(sub(T[a], c), w), skal(sub(T[a], c), u)) - Math.atan2(skal(sub(T[b], c), w), skal(sub(T[b], c), u)));
    ploskve.push(na);
  }
  if (!ploskve.length && n >= 3) { // vse točke v ravnini (npr. trikotnik pri grafitu)
    const c = T.reduce((s, p) => s.map((x, m) => x + p[m] / n), [0, 0, 0]);
    const u = sub(T[0], c), nn = krat(sub(T[1], T[0]), sub(T[2], T[0])), w = krat(nn, u);
    const na = T.map((p, q) => q).sort((a, b) => Math.atan2(skal(sub(T[a], c), w), skal(sub(T[a], c), u)) - Math.atan2(skal(sub(T[b], c), w), skal(sub(T[b], c), u)));
    ploskve.push(na);
  }
  return ploskve;
}

const POLIEDRI = { oktaeder: "oktaeder", kocka: "kocka", tetraeder: "tetraeder", trikotnik: "trikotnik", kubooktaeder: "kubooktaeder", antikubooktaeder: "trikotna ortobikupola" };
const POLIEDRI_TOZ = { kocka: "kocko", antikubooktaeder: "trikotno ortobikupolo" }; // tožilnik (»tvorijo kocko«)
const vej = (x, d = 0) => x.toFixed(d).replace(".", ",");

export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const zac = ctx.zacetek || {};
  const st = {
    mreza: MREZE.some((x) => x.id === zac.mreza) ? zac.mreza : "nacl",
    prikaz: ["kroglice", "kalota", "celica"].includes(zac.prikaz) ? zac.prikaz : "kroglice",
    n: Math.min(3, Math.max(1, Math.round(Number(zac.celice) || 2))),
    celica: zac.celica !== undefined ? !!zac.celica && zac.celica !== "0" : true,
    koord: zac.koordinacija !== undefined ? !!zac.koordinacija && zac.koordinacija !== "0" : false,
  };

  const group = new THREE.Group();
  group.name = "kristali";
  const vsebina = new THREE.Group();
  group.add(vsebina);
  const odvrzi = [];
  // skupni videz atomov (enako v modelih molekule, atom, periodni sistem): sijoč lak in mehak rob (sheen)
  const fiz = (barva, o = {}) => new THREE.MeshPhysicalMaterial({ color: barva, roughness: 0.32, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.14, sheen: 0.35, sheenRoughness: 0.45, sheenColor: "#dfe7ff", ...o });
  const matVez = fiz("#c3cad6", { roughness: 0.42, clearcoat: 0.4, sheen: 0.15 });
  const matVodVez = new THREE.MeshPhysicalMaterial({ color: "#8fb2ff", roughness: 0.5, emissive: "#2a4fa8", emissiveIntensity: 0.4 });
  const matCelica = new THREE.MeshPhysicalMaterial({ color: "#5d8cff", roughness: 0.35, emissive: "#2b56d6", emissiveIntensity: 0.6 });
  const matPoli = new THREE.MeshPhysicalMaterial({ color: "#ffd166", roughness: 0.4, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false, emissive: "#7a5a10", emissiveIntensity: 0.4 });
  const matPoliRob = new THREE.MeshPhysicalMaterial({ color: "#ffd166", roughness: 0.35, emissive: "#a07a1a", emissiveIntensity: 0.6 });
  const matPlast = new THREE.MeshBasicMaterial({ color: "#8a97b3", transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false });
  const matAtom = {};
  const atomMat = (barva, prosojen) => {
    const k = barva + (prosojen ? "p" : "");
    return (matAtom[k] ||= fiz(barva, prosojen ? { transparent: true, opacity: 0.2, depthWrite: false } : {}));
  };
  const matKoordSredina = fiz("#ffffff", { emissive: "#ffd166", emissiveIntensity: 0.45 });
  const skupniMat = [matVez, matVodVez, matCelica, matPoli, matPoliRob, matPlast, matKoordSredina];
  const gValj = new THREE.CylinderGeometry(1, 1, 1, visoka ? 12 : 6, 1, true);
  const gValjTanek = new THREE.CylinderGeometry(1, 1, 1, visoka ? 8 : 5, 1, true);
  const gCrtka = (() => { // črtkan valj iz štirih kosov (vodikova vez)
    const kosi = [0, 1, 2, 3].map((k) => { const g = new THREE.CylinderGeometry(1, 1, 0.14, visoka ? 8 : 5, 1, true); g.translate(0, -0.5 + 0.07 + k * 0.287, 0); return g; });
    const pos = [], nor = [], idx = [];
    for (const g of kosi) { const o = pos.length / 3; pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array); for (const q of g.index.array) idx.push(q + o); g.dispose(); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3)); g.setIndex(idx);
    return g;
  })();
  const skupneGeo = [gValj, gValjTanek, gCrtka];

  const m = { group, deli: [], nadzor: [], merilo: null, dispose };
  const _M = new THREE.Matrix4(), _Q = new THREE.Quaternion(), _S = new THREE.Vector3(), _P = new THREE.Vector3(), _Y = new THREE.Vector3(0, 1, 0), _D = new THREE.Vector3();
  const POGLED = new THREE.Vector3(0.45, 0.34, 0.82).normalize();
  let stanjeIzpis = {};

  function pocisti() {
    for (const o of [...vsebina.children]) vsebina.remove(o);
    for (const x of odvrzi) x.dispose();
    odvrzi.length = 0;
  }
  /** Instance valjev med pari točk (v enotah scene). */
  function valji(geo, mat, pari, r) {
    const im = new THREE.InstancedMesh(geo, mat, Math.max(1, pari.length));
    im.count = pari.length;
    pari.forEach(([a, b], i) => {
      _D.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      const l = _D.length();
      _Q.setFromUnitVectors(_Y, _D.normalize());
      _M.compose(_P.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2), _Q, _S.set(r, l, r));
      im.setMatrixAt(i, _M);
    });
    im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.computeBoundingBox();
    odvrzi.push(im); vsebina.add(im);
    return im;
  }
  function krogle(geo, mat, tocke, r) {
    const im = new THREE.InstancedMesh(geo, mat, Math.max(1, tocke.length));
    im.count = tocke.length;
    tocke.forEach((p, i) => im.setMatrixAt(i, _M.compose(_P.set(...p), _Q.identity(), _S.set(r, r, r))));
    im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.computeBoundingBox();
    odvrzi.push(im); vsebina.add(im);
    return im;
  }
  const spredaj = (tocke) => tocke.reduce((b, p) => (_P.set(...p).dot(POGLED) > _D.set(...b).dot(POGLED) ? p : b), tocke[0]);
  const sredina = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

  function zgradiVsebino() {
    pocisti();
    const M = MREZE.find((x) => x.id === st.mreza);
    const kalota = st.prikaz === "kalota", samoCelica = st.prikaz === "celica";
    const n = samoCelica ? 1 : st.n;
    // pri heksagonalnih kristalih je celica visoka in ozka, zato v ravnini plasti pokažemo nekaj celic več
    const nab = M.id === "grafit" ? n + 1 : M.id === "led" ? Math.min(3, n + 1) : M.sistem === "hex" ? n + 1 : n;
    // grafit: n = 1, 2, 3 da 2, 3 in 4 plasti (pri treh plasteh se lepo vidi zaporedje ABA)
    const N = samoCelica ? [1, 1, 1] : [nab, nab, M.id === "grafit" ? 0.5 * n + 0.5 : n];
    const pol = N.map((x) => x / 2);
    const V = vektorji(M);
    // delci v bloku n×n×n (meje vključene; pri ledu so kisiki vedno v notranjosti)
    let atomi = delci(M, 0, N);
    let led = null;
    if (M.led) {
      led = vodikiLedu(M, N, atomi);
      atomi = atomi.concat(led.map((x) => ({ v: "h", p: x.h })));
    }
    // središče in merilo
    const sr = kart(V, pol);
    const rMax = Math.max(...Object.values(M.vrste).map((x) => (kalota ? x.r : x.rk)));
    const ogliscaBloka = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => kart(V, [N[0] * (i & 1), N[1] * ((i >> 1) & 1), N[2] * ((i >> 2) & 1)]));

    const deli = [];
    // koordinacija: delec v sredini bloka in njegovi sosedi iz neskončne mreže
    let K = null;
    const dnnKoord = najblizja(M, M.koord.sredina, M.koord.sosedi);
    if (st.koord) {
      const kand = atomi.filter((a) => a.v === M.koord.sredina);
      const c = kart(V, pol);
      const sred = kand.reduce((b, a) => (razd(a.p, c) < razd(b.p, c) - 1e-6 ? a : b), kand[0]);
      const okolica = delci(M, -1, N.map((x) => x + 1));
      K = { sred, sos: sosedi(M, sred.p, M.koord.sosedi, dnnKoord, okolica) };
    }
    // merilo: blok in (pri koordinaciji) sosedi iz neskončne mreže, ki lahko segajo čez blok
    const R = Math.max(...atomi.map((a) => razd(a.p, sr) + rMax), ...ogliscaBloka.map((p) => razd(p, sr)),
      ...(K ? K.sos.map((a) => razd(a.p, sr) + 1.05 * Math.max(rMax, M.vrste[a.v].rk)) : []));
    const s = 0.95 / R; // enote scene na pm
    const sc = (p) => [(p[0] - sr[0]) * s, (p[2] - sr[2]) * s, -(p[1] - sr[1]) * s]; // os c kristala gor
    m.merilo = { m: (2 / s) * 1e-12, oznaka: `${vej((2 / s) / 1000, 2)} nm` };
    const vKoord = (p) => K && (razd(p, K.sred.p) < 1 || K.sos.some((q) => razd(p, q.p) < 1));

    // krogle po vrstah
    const Nkrog = atomi.length + (K ? K.sos.length + 1 : 0);
    const B = (visoka ? 95000 : 38000) / Nkrog;
    const w = Math.max(8, Math.min(32, Math.round(Math.sqrt(B / 1.33)))), h = Math.max(6, Math.round(w * 0.66));
    const gKrogla = new THREE.SphereGeometry(1, w, h);
    odvrzi.push(gKrogla);
    for (const [vid, vr] of Object.entries(M.vrste)) {
      const tocke = atomi.filter((a) => a.v === vid && !vKoord(a.p)).map((a) => sc(a.p));
      if (!tocke.length && !K) continue;
      const r = (kalota ? vr.r : vr.rk) * s;
      const im = krogle(gKrogla, atomMat(vr.barva, !!K), tocke, r);
      const meshes = [im];
      let tocka = tocke.length ? spredaj(tocke) : [0, 0, 0], rT = (kalota ? vr.r : vr.rk) * s;
      if (K) {
        const kt = [K.sred, ...K.sos].filter((a) => a.v === vid);
        if (kt.length) {
          const ki = krogle(gKrogla, atomMat(vr.barva, false), kt.map((a) => sc(a.p)), vr.rk * s * 1.05);
          meshes.push(ki);
          tocka = spredaj(kt.map((a) => sc(a.p))); rT = vr.rk * s * 1.05;
        }
      }
      if (!tocke.length && meshes.length === 1) continue;
      deli.push({ id: vid, ime: vr.ime, opis: vr.opis, barva: vr.barva, meshes, tocka: tocka.map((x, i) => x + (i === 1 ? rT : 0)) });
    }

    // vezi (ne pri kaloti)
    const dnnVez = M.vezi.length ? najblizja(M, M.vezi[0][0], M.vezi[0][1]) : OH;
    if (!kalota) {
      let pari = [];
      if (M.led) pari = led.map((x) => [sc(x.dajalec), sc(x.h)]);
      else {
        for (let i = 0; i < atomi.length; i++) for (let j = i + 1; j < atomi.length; j++) {
          const a = atomi[i], b = atomi[j];
          if (!M.vezi.some(([x, y]) => (a.v === x && b.v === y) || (a.v === y && b.v === x))) continue;
          if (Math.abs(razd(a.p, b.p) - dnnVez) < 0.05 * dnnVez) pari.push([sc(a.p), sc(b.p)]);
        }
      }
      if (pari.length) {
        const rv = (M.led ? 9 : M.id === "grafit" || M.id === "diamant" ? 11 : 7) * s;
        const vz = valji(gValj, K ? atomMat("#c3cad6", true) : matVez, pari, rv);
        const p = spredaj(pari.map(([a, b]) => sredina(a, b)));
        deli.push({ id: "vezi", ime: M.led ? "Kovalentne vezi O–H" : M.kovina ? "Najbližji sosedi" : "Vezi", opis: M.vezOpis, barva: "#c3cad6", meshes: [vz], tocka: p });
      }
      if (M.led) {
        const hv = led.filter((x) => x.znotraj).map((x) => [sc(x.h), sc(x.prejemnik)]);
        if (hv.length) {
          const vv = valji(gCrtka, matVodVez, hv, 7 * s);
          deli.push({ id: "vodikove-vezi", ime: "Vodikove vezi", barva: "#8fb2ff", meshes: [vv], tocka: spredaj(hv.map(([a, b]) => sredina(a, b))),
            opis: "Šibke vezi med vodikom ene molekule in kisikom sosednje; zaradi njih je led rahel in plava na vodi." });
        }
      }
    }

    // plasti grafita
    if (M.id === "grafit") {
      const zji = [...new Set(atomi.map((a) => Math.round(a.f[2] * 1000)))].sort((a, b) => a - b);
      const pos = [], idx = [];
      for (const z of zji) {
        const f = z / 1000, o = pos.length / 3, d = 0.08;
        for (const [u, v] of [[-d, -d], [N[0] + d, -d], [N[0] + d, N[1] + d], [-d, N[1] + d]]) pos.push(...sc(kart(V, [u, v, f])));
        idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      odvrzi.push(g);
      const pl = new THREE.Mesh(g, matPlast);
      pl.renderOrder = 1;
      vsebina.add(pl);
      const zt = zji[zji.length - 1] / 1000;
      deli.push({ id: "plast", ime: "Plast", barva: "#7f8ba3", meshes: [pl], tocka: sc(kart(V, [N[0] * 0.15, N[1] * 0.85, zt])),
        opis: "Ena plast grafita (grafen): šestkotniki iz ogljikovih atomov. Plasti so 335 pm narazen in jih vežejo le šibke van der Waalsove sile, zato se lahko luščijo." });
    }

    // osnovna celica
    if (st.celica || samoCelica) {
      const o = N.map((x) => (x - 1) >> 1), ogl = [];
      for (let i = 0; i < 8; i++) ogl.push(sc(kart(V, [o[0] + (i & 1), o[1] + ((i >> 1) & 1), o[2] + ((i >> 2) & 1)])));
      const robovi = [];
      for (let i = 0; i < 8; i++) for (const b of [1, 2, 4]) if (!(i & b)) robovi.push([ogl[i], ogl[i | b]]);
      const cel = valji(gValjTanek, matCelica, robovi, Math.min(0.011, Math.max(0.005, 13 * s)));
      // opis velja za izbrani kristal (pregledovalnik ob menjavi kristala pokaže ta, novi opis)
      deli.push({ id: "celica", ime: "Osnovna celica", barva: "#6e9bff", meshes: [cel], tocka: spredaj(ogl),
        opis: `Osnovna celica se ponavlja v vse smeri: z vzporednim premikanjem sestavi cel kristal. V njej ${M.vCelici}.` });
    }

    // koordinacijski polieder
    if (K) {
      const c = sc(K.sred.p), T = K.sos.map((a) => sc(a.p));
      const vz = valji(gValj, matPoliRob, T.map((p) => [c, p]), 10 * s);
      const pl = ovojnica(T.map((p) => p.map((x, i) => x - c[i])));
      const pos = [], idx = [], robovi = new Map();
      for (const f of pl) {
        const o = pos.length / 3;
        for (const q of f) pos.push(...T[q]);
        for (let k = 1; k + 1 < f.length; k++) idx.push(o, o + k, o + k + 1);
        f.forEach((q, k) => { const r = f[(k + 1) % f.length], kl = Math.min(q, r) + "-" + Math.max(q, r); robovi.set(kl, [T[q], T[r]]); });
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      odvrzi.push(g);
      const poli = new THREE.Mesh(g, matPoli);
      poli.renderOrder = 2;
      vsebina.add(poli);
      const rb = valji(gValjTanek, matPoliRob, [...robovi.values()], 4 * s);
      const sv = M.vrste[K.sred.v], so = M.vrste[M.koord.sosedi];
      deli.push({ id: "koordinacija", ime: "Koordinacija", barva: "#ffd166", meshes: [vz, poli, rb], tocka: spredaj(T),
        opis: `Izbrani delec (${sv.kratko}) ima ${K.sos.length} ${K.sos.length === 3 || K.sos.length === 4 ? "najbližje sosede" : "najbližjih sosedov"} (${so.kratko}) na razdalji ${vej(dnnKoord)} pm; skupaj tvorijo ${POLIEDRI_TOZ[M.koord.polieder] || POLIEDRI[M.koord.polieder]}.` });
    }

    // kontrola: noben del brez mrež
    m.deli = deli.filter((d) => d.meshes.length && d.meshes.every(Boolean));
    stanjeIzpis = { M, K, dnnKoord, n };
  }

  const izpisCelica = () => {
    const { M } = stanjeIzpis;
    const st2 = stetjeVCelici(M);
    const fe = enoteVCelici(M);
    return st2.map((x) => `${M.vrste[x.v].kratko}: ${x.zapis.replace(/\./g, ",")}`).join(" · ") + ` → ${M.enote(fe)}` + (M.led ? " (vodiki niso šteti)" : "") + (M.id === "hcp" ? " (primitivna celica; v šeststrani prizmi 6 atomov)" : "");
  };
  m.nadzor = [
    { tip: "izbira", id: "mreza", oznaka: "Kristal", vrednost: st.mreza,
      moznosti: [["nacl", "NaCl"], ["cscl", "CsCl"], ["diamant", "Diamant"], ["grafit", "Grafit"], ["bcc", "Kovina bcc (Fe)"], ["fcc", "Kovina fcc (Cu)"], ["hcp", "Kovina hcp (Mg)"], ["led", "Led Ih"]],
      ob: (v) => { st.mreza = MREZE.some((x) => x.id === v) ? v : "nacl"; zgradiVsebino(); } },
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", vrednost: st.prikaz,
      moznosti: [["kroglice", "Kroglice in palčke"], ["kalota", "Kalota"], ["celica", "Samo osnovna celica"]],
      ob: (v) => { st.prikaz = ["kroglice", "kalota", "celica"].includes(v) ? v : "kroglice"; zgradiVsebino(); } },
    { tip: "drsnik", id: "celice", oznaka: "Velikost izreza (celic na rob)", min: 1, max: 3, korak: 1, vrednost: st.n, vidno: () => st.prikaz !== "celica",
      ob: (v) => { st.n = Math.min(3, Math.max(1, Math.round(Number(v) || 1))); zgradiVsebino(); } },
    { tip: "stikalo", id: "celica", oznaka: "Pokaži osnovno celico", vrednost: st.celica, vidno: () => st.prikaz !== "celica", ob: (v) => { st.celica = !!v; zgradiVsebino(); } },
    { tip: "stikalo", id: "koordinacija", oznaka: "Pokaži koordinacijo", vrednost: st.koord, ob: (v) => { st.koord = !!v; zgradiVsebino(); } },
    { tip: "izpis", id: "snov", oznaka: "Snov", vrednost: () => `${stanjeIzpis.M.ime}, ${stanjeIzpis.M.formula} · ${stanjeIzpis.M.vez}` },
    { tip: "izpis", id: "mreza-opis", oznaka: "Mreža", vrednost: () => {
      const M = stanjeIzpis.M;
      const konst = M.sistem === "kub" ? `a = ${vej(M.a)} pm` : `a = ${vej(M.a)} pm, c = ${vej(M.c)} pm`;
      return `${M.mreza} · ${konst}` + (M.kovina ? ` · zapolnjenost prostora ${vej(zapolnjenost(M) * 100)} %` : "");
    } },
    { tip: "izpis", id: "v-celici", oznaka: "V osnovni celici", vrednost: izpisCelica },
    { tip: "izpis", id: "koordinacijsko", oznaka: "Koordinacijsko število", vrednost: () => {
      const { M, dnnKoord } = stanjeIzpis;
      const cn = sosedi(M, kart(vektorji(M), M.baza.find((b) => b[0] === M.koord.sredina).slice(1)), M.koord.sosedi, dnnKoord, delci(M, -1, 2)).length;
      return `${cn} (${POLIEDRI[M.koord.polieder]}) · najbližja razdalja ${M.vrste[M.koord.sredina].kratko}–${M.vrste[M.koord.sosedi].kratko} ${vej(dnnKoord)} pm`;
    } },
  ];

  function dispose() {
    pocisti();
    for (const x of [...skupniMat, ...Object.values(matAtom), ...skupneGeo]) x.dispose();
  }
  zgradiVsebino();
  return m;
}
