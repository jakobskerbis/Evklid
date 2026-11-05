// Geometrijska telesa: mere, mreža, ki se razpre, in prerez z ravnino (pogodba v docs/3d.md).
// Notranje enote so centimetri (skupina »telo«), skupina »group« je v enotah prizora (krogla s polmerom 1).
export const info = {
  id: "telesa",
  naslov: "Geometrijska telesa",
  podrocje: "matematika",
  predmet: "MAT",
  opis: "Prizme, piramide, valj, stožec, krogla, prisekani telesi, poševni paralelepiped in vseh 5 pravilnih (Platonovih) teles iz Evklidovih Elementov: spreminjaj mere, razpri mrežo in prereži telo z ravnino. Prostornina in površina se sproti izračunata.",
  merilo: { m: 0.1, oznaka: "10 cm" },
  poskusi: "izberi valj in povleci »Razpri mrežo« do konca: kakšen lik je plašč? Nato mrežo spet zloži, vklopi »Prerez z ravnino« in spreminjaj »Nagib ravnine«: kdaj je prerez elipsa?",
};

const MOZNOSTI = [
  ["kocka", "Kocka"], ["kvader", "Kvader"], ["prizma3", "Tristrana prizma"], ["prizma6", "Šeststrana prizma"],
  ["piramida3", "Tristrana piramida"], ["piramida4", "Štiristrana piramida"], ["valj", "Valj"], ["stozec", "Stožec"],
  ["krogla", "Krogla"], ["prisekana", "Prisekana piramida"], ["prisekan", "Prisekan stožec"], ["paralelepiped", "Poševni paralelepiped"],
];
// skupina »Pravilna telesa (Platonova)« (j, 5. 11.): kocka je v obeh skupinah
const PLATON_MOZ = [["tetraeder", "Tetraeder"], ["kocka", "Kocka"], ["oktaeder", "Oktaeder"], ["dodekaeder", "Dodekaeder"], ["ikozaeder", "Ikozaeder"]];
const SKUPINE = [["osnovna", "Osnovna telesa"], ["platonova", "Pravilna telesa (Platonova)"]];
const NOVA = new Set(["tetraeder", "oktaeder", "dodekaeder", "ikozaeder"]); // pravilna telesa razen kocke (kocka ostane kot prej)
const POLIEDRI = new Set([...NOVA, "paralelepiped"]); // gradijo se iz oglišč in ploskev
const LEPA = [2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250];
const NB = " ";

// Slovenski zapis števila: decimalna vejica, minus, skupine po tri pri velikih številih.
function st(x, d = 1) {
  if (Math.abs(x) < 0.5 * 10 ** -d) x = 0;
  let [c, dec] = Math.abs(x).toFixed(d).split(".");
  if (c.length > 4) c = c.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (x < 0 ? "−" : "") + c + (dec ? "," + dec : "");
}
const cm = (x) => st(x) + NB + "cm";
const cm2 = (x) => st(x) + NB + "cm²";
const cm3 = (x) => st(x) + NB + "cm³";
const kratko = (x) => st(x, 1).replace(/,0$/, "");

// ---------- Evklidovi Elementi (preverjeno na D. E. Joyce, Clark University, Euclid's Elements) ----------
// Vrstica »v kateri knjigi Elementov« za vsako telo. Knjiga XI: definicije teles in paralelepipedi (24–34),
// knjiga XII: prostornine (piramida, stožec, krogla), knjiga XIII: pet pravilnih teles, včrtanih v kroglo (13–17).
export const ELEMENTI = {
  kocka: "XI. knjiga, definicija 25; XIII. knjiga, trditev 15 (kocka, včrtana v kroglo)",
  kvader: "XI. knjiga, trditve 24–34 (paralelepipedi; kvader je pravokotni paralelepiped)",
  paralelepiped: "XI. knjiga, trditve 24–34; po trditvi 31 imata paralelepipeda z enako ploščino osnovne ploskve in enako višino enako prostornino",
  prizma3: "XI. knjiga, definicija 13; XII. knjiga, trditev 7 (prizmo razrežemo na 3 enake piramide)",
  prizma6: "XI. knjiga, definicija 13; XII. knjiga, trditev 7 (prizmo razrežemo na 3 enake piramide)",
  piramida3: "XI. knjiga, definicija 12; XII. knjiga, trditev 7 s posledico (piramida je tretjina prizme z enako osnovno ploskvijo in višino)",
  piramida4: "XI. knjiga, definicija 12; XII. knjiga, trditev 7 s posledico (piramida je tretjina prizme z enako osnovno ploskvijo in višino)",
  valj: "XI. knjiga, definicija 21 (pravokotnik se zavrti okoli stranice); XII. knjiga, trditve 10–15",
  stozec: "XI. knjiga, definicija 18 (pravokotni trikotnik se zavrti okoli katete); XII. knjiga, trditev 10 (stožec je tretjina valja)",
  krogla: "XI. knjiga, definicija 14 (polkrog se zavrti okoli premera); XII. knjiga, trditev 18 (prostornini krogel sta v razmerju kubov premerov)",
  prisekana: "v Elementih ni posebej obravnavana; je razlika dveh podobnih piramid (XII. knjiga, trditev 8)",
  prisekan: "v Elementih ni posebej obravnavan; je razlika dveh podobnih stožcev (XII. knjiga, trditev 12)",
  tetraeder: "XIII. knjiga, trditev 13 (tetraeder, včrtan v kroglo; Evklid ga imenuje piramida)",
  oktaeder: "XI. knjiga, definicija 26; XIII. knjiga, trditev 14 (oktaeder, včrtan v kroglo)",
  dodekaeder: "XI. knjiga, definicija 28; XIII. knjiga, trditev 17 (dodekaeder, včrtan v kroglo)",
  ikozaeder: "XI. knjiga, definicija 27; XIII. knjiga, trditev 16 (ikozaeder, včrtan v kroglo)",
};

// ---------- pravilna (Platonova) telesa in paralelepiped: čista geometrija brez THREE (izvoženo za teste) ----------
const FI = (1 + Math.sqrt(5)) / 2;
const SUROVA = {
  tetraeder: () => [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
  kocka: () => { const t = []; for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) t.push([x, y, z]); return t; },
  oktaeder: () => [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
  ikozaeder: () => { const t = []; for (const p of [-1, 1]) for (const q of [-1, 1]) t.push([0, p, q * FI], [p, q * FI, 0], [q * FI, 0, p]); return t; },
  dodekaeder: () => {
    const t = SUROVA.kocka();
    for (const p of [-1, 1]) for (const q of [-1, 1]) t.push([0, p / FI, q * FI], [p / FI, q * FI, 0], [q * FI, 0, p / FI]);
    return t;
  },
};
const vRaz = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const vSkal = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const vVek = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vDol = (a) => Math.hypot(a[0], a[1], a[2]);
const vSred = (t) => { const c = [0, 0, 0]; for (const p of t) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; } return c.map((x) => x / t.length); };
// zasuk okoli enotske osi k za kot f (Rodriguesova formula)
const vZasuk = (p, k, f) => {
  const c = Math.cos(f), s = Math.sin(f), kp = vVek(k, p), kd = vSkal(k, p);
  return [0, 1, 2].map((i) => p[i] * c + kp[i] * s + k[i] * kd * (1 - c));
};

// Ploskve konveksne lupine: vsaka ploskev je seznam indeksov oglišč, urejenih v krogu.
function lupina(t) {
  const n = t.length, eps = 1e-9 * Math.max(...t.map(vDol)), ploskve = [], videne = new Set();
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) {
    let nr = vVek(vRaz(t[j], t[i]), vRaz(t[k], t[i])); const L = vDol(nr); if (L < eps) continue;
    nr = nr.map((x) => x / L); const d = vSkal(nr, t[i]);
    let pod = 0, nad = 0; for (const p of t) { const o = vSkal(nr, p) - d; if (o > eps) nad++; else if (o < -eps) pod++; }
    if (pod && nad) continue;
    const idx = []; for (let m = 0; m < n; m++) if (Math.abs(vSkal(nr, t[m]) - d) <= eps) idx.push(m);
    const kljuc = idx.join(); if (videne.has(kljuc)) continue; videne.add(kljuc);
    const c = vSred(idx.map((m) => t[m])), e1 = vRaz(t[idx[0]], c), e2 = vVek(nr, e1);
    idx.sort((p, q) => Math.atan2(vSkal(vRaz(t[p], c), e2), vSkal(vRaz(t[p], c), e1)) - Math.atan2(vSkal(vRaz(t[q], c), e2), vSkal(vRaz(t[q], c), e1)));
    ploskve.push(idx);
  }
  return ploskve;
}

// Pravilno telo z robom a, ki leži na ploskvi: ploskve[0] je spodnja (y = 0, središče v izhodišču), en njen rob
// (pri tetraedru oglišče) gleda proti gledalcu (+z), y kaže navzgor. Vrne { tocke: [[x, y, z]], ploskve: [[indeksi]] }.
export function pravilnoTelo(ime, a = 1) {
  let t = SUROVA[ime]();
  const ploskve = lupina(t);
  // spodnja ploskev: zasukamo jo tako, da njena zunanja normala kaže navzdol (−y)
  const F0 = ploskve[0], c0 = vSred(F0.map((i) => t[i]));
  let nr = vVek(vRaz(t[F0[1]], t[F0[0]]), vRaz(t[F0[2]], t[F0[0]])); nr = nr.map((x) => x / vDol(nr));
  if (vSkal(nr, c0) < 0) nr = nr.map((x) => -x);
  const dol = [0, -1, 0], os = vVek(nr, dol), so = vDol(os);
  if (so > 1e-12) { const k = os.map((x) => x / so), f = Math.acos(Math.max(-1, Math.min(1, vSkal(nr, dol)))); t = t.map((p) => vZasuk(p, k, f)); }
  else if (vSkal(nr, dol) < 0) t = t.map(([x, y, z]) => [x, -y, -z]);
  // en rob spodnje ploskve naj gleda proti +z
  const c1 = vSred(F0.map((i) => t[i])), m = vSred([t[F0[0]], t[F0[1]]]);
  // tetraeder: proti gledalcu raje oglišče, sicer sprednja ploskev gleda naravnost vanj in je videti kot ploščat trikotnik
  const f = Math.atan2(m[0] - c1[0], m[2] - c1[2]) + (ime === "tetraeder" ? Math.PI : 0);
  t = t.map((p) => vZasuk(p, [0, 1, 0], -f));
  // merilo (rob a) in lega (spodnja ploskev na y = 0, njeno središče v izhodišču)
  const rob = vDol(vRaz(t[F0[0]], t[F0[1]])), k = a / rob, c2 = vSred(F0.map((i) => t[i]));
  const cist = (x) => (Math.abs(x) < 1e-12 * a ? 0 : x);
  t = t.map((p) => [cist((p[0] - c2[0]) * k), cist((p[1] - c2[1]) * k), cist((p[2] - c2[2]) * k)]);
  return { tocke: t, ploskve };
}

// Poševni paralelepiped: osnovna ploskev je paralelogram z robovoma a (v desno) in b (nazaj) ter kotom α med njima,
// stranski rob c je nagnjen v desno in z osnovno ploskvijo oklepa kot φ. Središče osnovne ploskve je v izhodišču.
export function paralelepipedTelo(a, b, c, alfa, fi) {
  const al = (alfa * Math.PI) / 180, f = (fi * Math.PI) / 180;
  const u = [a, 0, 0], w = [b * Math.cos(al), 0, -b * Math.sin(al)], k = [c * Math.cos(f), c * Math.sin(f), 0];
  const O = [-(u[0] + w[0]) / 2, 0, -(u[2] + w[2]) / 2], t = [];
  for (let l = 0; l < 2; l++) for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) t.push([0, 1, 2].map((d) => O[d] + i * u[d] + j * w[d] + l * k[d]));
  // indeks = i + 2j + 4l; spodnja, zgornja, sprednja, zadnja, leva, desna
  const ploskve = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
  return { tocke: t, ploskve, vrste: ["osn", "osn", "pl", "pl", "pl", "pl"] };
}

// Natančne formule za pravilna telesa z robom a (vse preverjene v test/3d-telesa-elementi.test.js z geometrijo).
const K2 = Math.SQRT2, K3 = Math.sqrt(3), K5 = Math.sqrt(5), K6 = Math.sqrt(6);
export const PRAVILNA = {
  tetraeder: {
    naslov: "Pravilni tetraeder", lik: "enakostranični trikotnik", n: 3, k: 3, o: 4, r: 6, p: 4,
    V: ["a³√2/12", (a) => (a ** 3 * K2) / 12], P: ["a²√3", (a) => a * a * K3],
    Rv: ["a√6/12", (a) => (a * K6) / 12], Ro: ["a√6/4", (a) => (a * K6) / 4],
    ploskve: "4 skladni enakostranični trikotniki", vozel: "3 trikotniki: 3 · 60° = 180°",
    mreza: "4 enakostranični trikotniki: spodnji in trije okoli njega (velik enakostranični trikotnik)",
  },
  kocka: {
    naslov: "Kocka", lik: "kvadrat", n: 4, k: 3, o: 8, r: 12, p: 6,
    V: ["a³", (a) => a ** 3], P: ["6a²", (a) => 6 * a * a],
    Rv: ["a/2", (a) => a / 2], Ro: ["a√3/2", (a) => (a * K3) / 2],
    ploskve: "6 skladnih kvadratov", vozel: "3 kvadrati: 3 · 90° = 270°", mreza: "6 skladnih kvadratov",
  },
  oktaeder: {
    naslov: "Pravilni oktaeder", lik: "enakostranični trikotnik", n: 3, k: 4, o: 6, r: 12, p: 8,
    V: ["a³√2/3", (a) => (a ** 3 * K2) / 3], P: ["2a²√3", (a) => 2 * a * a * K3],
    Rv: ["a√6/6", (a) => (a * K6) / 6], Ro: ["a√2/2", (a) => (a * K2) / 2],
    ploskve: "8 skladnih enakostraničnih trikotnikov", vozel: "4 trikotniki: 4 · 60° = 240°",
    mreza: "8 enakostraničnih trikotnikov: trak iz 6 trikotnikov in po en trikotnik na vsaki strani traku",
  },
  dodekaeder: {
    naslov: "Pravilni dodekaeder", lik: "pravilni petkotnik", n: 5, k: 3, o: 20, r: 30, p: 12,
    V: ["(15 + 7√5)a³/4", (a) => ((15 + 7 * K5) * a ** 3) / 4], P: ["3a²√(25 + 10√5)", (a) => 3 * a * a * Math.sqrt(25 + 10 * K5)],
    Rv: ["(a/2)√((25 + 11√5)/10)", (a) => (a / 2) * Math.sqrt((25 + 11 * K5) / 10)], Ro: ["a√3(1 + √5)/4", (a) => (a * K3 * (1 + K5)) / 4],
    ploskve: "12 skladnih pravilnih petkotnikov", vozel: "3 petkotniki: 3 · 108° = 324°",
    mreza: "12 pravilnih petkotnikov: dva »cveta« (petkotnik in 5 petkotnikov okoli njega), povezana z enim robom",
  },
  ikozaeder: {
    naslov: "Pravilni ikozaeder", lik: "enakostranični trikotnik", n: 3, k: 5, o: 12, r: 30, p: 20,
    V: ["5(3 + √5)a³/12", (a) => (5 * (3 + K5) * a ** 3) / 12], P: ["5a²√3", (a) => 5 * a * a * K3],
    Rv: ["a√3(3 + √5)/12", (a) => (a * K3 * (3 + K5)) / 12], Ro: ["(a/4)√(10 + 2√5)", (a) => (a / 4) * Math.sqrt(10 + 2 * K5)],
    ploskve: "20 skladnih enakostraničnih trikotnikov", vozel: "5 trikotnikov: 5 · 60° = 300°",
    mreza: "20 enakostraničnih trikotnikov: trak iz 10 trikotnikov ter po 5 trikotnikov nad njim in pod njim",
  },
};
// število oglišč, robov in ploskev mnogoterih teles (za Eulerjevo formulo o − r + p = 2)
const ORP = {
  kocka: [8, 12, 6], kvader: [8, 12, 6], paralelepiped: [8, 12, 6], prizma3: [6, 9, 5], prizma6: [12, 18, 8],
  piramida3: [4, 6, 4], piramida4: [5, 8, 5], prisekana: [8, 12, 6],
  tetraeder: [4, 6, 4], oktaeder: [6, 12, 8], dodekaeder: [20, 30, 12], ikozaeder: [12, 30, 20],
};
const sklon = (n, oblike) => `${n} ${oblike[n % 100 === 1 ? 0 : n % 100 === 2 ? 1 : n % 100 === 3 || n % 100 === 4 ? 2 : 3]}`;
export function euler(vr) {
  const x = ORP[vr]; if (!x) return "";
  const [o, r, p] = x;
  return `${sklon(o, ["oglišče", "oglišči", "oglišča", "oglišč"])}, ${sklon(r, ["rob", "robova", "robovi", "robov"])}, ${sklon(p, ["ploskev", "ploskvi", "ploskve", "ploskev"])}: ${o} − ${r} + ${p} = ${o - r + p}`;
}
// Paralelepiped: β je kot med robovoma b in c (cos β = cos α · cos φ).
export function paralelepipedKolicine(a, b, c, alfa, fi) {
  const al = (alfa * Math.PI) / 180, f = (fi * Math.PI) / 180, cb = Math.cos(al) * Math.cos(f), sb = Math.sqrt(Math.max(0, 1 - cb * cb));
  const O = a * b * Math.sin(al), v = c * Math.sin(f), Sac = a * c * Math.sin(f), Sbc = b * c * sb;
  return { O, v, V: O * v, Sac, Sbc, P: 2 * (O + Sac + Sbc), beta: (Math.acos(cb) * 180) / Math.PI };
}
const ZAKAJ_PET = "V vsakem oglišču se stikajo vsaj 3 ploskve, vsota njihovih kotov pa mora biti manjša od 360°. Pri 360° bi ploskve ležale ravno, pri več se ne bi prilegale. Trikotniki (60°): ob oglišču so lahko 3, 4 ali 5. Kvadrati (90°): samo 3. Pravilni petkotniki (108°): samo 3. Šestkotniki imajo kote po 120° in že 3 dajo 360°. Zato je pravilnih teles samo 5 (Evklid to pove na koncu XIII. knjige Elementov).";

// Drevesa mreže (kateri ploskvi sta zlepljeni): starsi[i] je ploskev, na katero je pripeta ploskev i (−1 = spodnja).
// Za vsako telo vrnemo nekaj kandidatov klasične oblike; gradnik izbere tistega, pri katerem se mreža ne prekriva
// in je najmanjša.
function sosedi(ploskve) {
  const rob = new Map(), S = ploskve.map(() => []);
  ploskve.forEach((F, i) => F.forEach((a, k) => { const b = F[(k + 1) % F.length], kl = Math.min(a, b) + "-" + Math.max(a, b); if (rob.has(kl)) { const j = rob.get(kl); S[i].push(j); S[j].push(i); } else rob.set(kl, i); }));
  return S;
}
export function drevesaMreze(ime, g) {
  const { tocke: t, ploskve } = g, n = ploskve.length, S = sosedi(ploskve), sred = ploskve.map((F) => vSred(F.map((i) => t[i])));
  const nov = () => new Array(n).fill(-1);
  const vrh = sred.reduce((b, c, i) => (c[1] > sred[b][1] ? i : b), 0);
  const kot = (i) => Math.atan2(sred[i][0], sred[i][2]);
  const out = [];
  if (ime === "tetraeder") { const p = nov(); for (let i = 1; i < n; i++) p[i] = 0; out.push(p); }
  else if (ime === "oktaeder") {
    const pas = [...Array(n).keys()].filter((i) => i !== 0 && i !== vrh).sort((x, y) => kot(x) - kot(y));
    for (let z = 0; z < 6; z++) {
      if (!S[0].includes(pas[z])) continue;
      const c = [0, 1, 2, 3, 4, 5].map((k) => pas[(z + k) % 6]);
      for (const tz of c) {
        if (!S[vrh].includes(tz)) continue;
        const p = nov(); p[c[0]] = 0; p[c[1]] = c[0]; p[c[2]] = c[1]; p[c[3]] = c[2]; p[c[5]] = c[0]; p[c[4]] = c[5]; p[vrh] = tz;
        out.push(p);
      }
    }
  } else if (ime === "ikozaeder") {
    const vSp = new Set([...ploskve[0], ...ploskve[vrh]]);
    for (let N = 0; N < t.length; N++) {
      if (vSp.has(N)) continue;
      const J = t.reduce((b, q, i) => (vDol(vRaz(q, t[N])) > vDol(vRaz(t[b], t[N])) ? i : b), 0); // nasprotno oglišče
      const pas = new Set([...Array(n).keys()].filter((i) => !ploskve[i].includes(N) && !ploskve[i].includes(J)));
      for (const smer of [0, 1]) {
        const cikel = [0]; let prej = -1;
        while (cikel.length < 10) { const zdaj = cikel[cikel.length - 1], nasl = S[zdaj].filter((j) => pas.has(j) && j !== prej); prej = zdaj; cikel.push(nasl[cikel.length === 1 ? smer : 0]); }
        const p = nov();
        for (let k = 1; k <= 5; k++) p[cikel[k]] = cikel[k - 1];
        p[cikel[9]] = 0; for (let k = 8; k >= 6; k--) p[cikel[k]] = cikel[k + 1];
        for (let i = 0; i < n; i++) if (!pas.has(i)) p[i] = S[i].find((j) => pas.has(j));
        out.push(p);
      }
    }
  } else if (ime === "dodekaeder") {
    for (const L0 of S[0]) for (const U0 of S[L0]) {
      if (U0 === 0 || !S[vrh].includes(U0)) continue;
      const p = nov(); for (const L of S[0]) p[L] = 0; p[U0] = L0; p[vrh] = U0; for (const U of S[vrh]) if (U !== U0) p[U] = vrh;
      out.push(p);
    }
  } else if (ime === "paralelepiped") {
    // ploskve: 0 spodnja, 1 zgornja, 2 sprednja, 3 zadnja, 4 leva, 5 desna; stranske v krogu 2, 5, 3, 4
    const kr = [2, 5, 3, 4];
    for (const zg of kr) { const p = nov(); for (const s of kr) p[s] = 0; p[1] = zg; out.push(p); } // križ
    for (let z = 0; z < 4; z++) for (let rez = 0; rez < 4; rez++) for (const zg of kr) { // trak stranskih ploskev
      const p = nov(), s0 = kr[z]; p[s0] = 0;
      // trak: ploskve od s0 naprej v obe smeri, prerezan med kr[rez] in kr[rez + 1]
      for (let k = 1; k < 4; k++) { const i = (z + k) % 4; if ((z + k - 1) % 4 === rez) break; p[kr[i]] = kr[(i + 3) % 4]; }
      for (let k = 1; k < 4; k++) { const i = (z - k + 8) % 4; if (i === rez) break; if (p[kr[i]] !== -1) break; p[kr[i]] = kr[(i + 1) % 4]; }
      if (kr.some((s) => p[s] === -1)) continue;
      p[1] = zg; out.push(p);
    }
  }
  return out;
}

export function zgradi(THREE, ctx) {
  const { Vector3, Matrix4, Quaternion } = THREE;
  const visoka = ctx.kakovost !== "nizka";
  const NK = visoka ? 128 : 64; // delitev krožnic
  const NG = visoka ? 12 : 6; // vrstice vzdolž stranic stožca
  const NS = visoka ? 192 : 96; // točke roba prereza okroglih teles
  const zac = ctx.zacetek || {};
  const stevilo = (k, lo, hi, def) => { const x = Number(zac[k]); return zac[k] != null && Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : def; };
  const S = {
    telo: [...MOZNOSTI, ...PLATON_MOZ].some(([v]) => v === zac.telo) ? zac.telo : "kocka",
    a: stevilo("a", 1, 10, 4), b: stevilo("b", 1, 10, 3), c: stevilo("c", 1, 10, 6), v: stevilo("v", 1, 10, 6), r: stevilo("r", 1, 10, 4),
    a1: stevilo("a1", 1, 10, 4), a2: stevilo("a2", 1, 10, 2), r1: stevilo("r1", 1, 10, 4), r2: stevilo("r2", 1, 10, 2),
    razpri: stevilo("razpri", 0, 1, 0),
    prerez: zac.prerez === true || zac.prerez === "1" || zac.prerez === "true",
    lega: stevilo("lega", 0, 1, 0.5), nagib: stevilo("nagib", 0, 90, 30), zasuk: stevilo("zasuk", 0, 90, 0),
    prosojno: zac.prosojno === true || zac.prosojno === "1" || zac.prosojno === "true",
    alfa: stevilo("alfa", 30, 90, 60), fi: stevilo("fi", 30, 90, 70),
    krogli: zac.krogli === true || zac.krogli === "1" || zac.krogli === "true",
  };
  S.skupina = NOVA.has(S.telo) || (S.telo === "kocka" && zac.skupina === "platonova") ? "platonova" : "osnovna";
  // zadnja izbira v vsaki skupini (gradnika izbire ostaneta vsak pri svojem seznamu)
  let osnovno = MOZNOSTI.some(([v]) => v === S.telo) ? S.telo : "kocka", platonsko = PLATON_MOZ.some(([v]) => v === S.telo) ? S.telo : "tetraeder";
  const pravilno = () => !!PRAVILNA[S.telo] && (S.telo !== "kocka" || S.skupina === "platonova");

  // m1 = osnovna mera (a, r, a₁, r₁), m2 = višina (pri kvadru c), m3 = tretja mera (b pri kvadru, a₂ / r₂ pri prisekanih)
  const OSN = { kocka: "a", kvader: "a", prizma3: "a", prizma6: "a", piramida3: "a", piramida4: "a", valj: "r", stozec: "r", krogla: "r", prisekana: "a1", prisekan: "r1", paralelepiped: "a", tetraeder: "a", oktaeder: "a", dodekaeder: "a", ikozaeder: "a" };
  Object.defineProperties(S, {
    m1: { get: () => S[OSN[S.telo]] },
    m2: { get: () => (S.telo === "kvader" ? S.c : S.telo === "kocka" ? S.a : S.telo === "krogla" ? S.r : S.v) },
    m3: { get: () => (S.telo === "kvader" ? S.b : S.telo === "prisekana" ? S.a2 : S.telo === "prisekan" ? S.r2 : 1) },
  });
  const rabi = (k) => () => ({
    a: ["kocka", "kvader", "prizma3", "prizma6", "piramida3", "piramida4", "paralelepiped", ...NOVA], b: ["kvader", "paralelepiped"], c: ["kvader", "paralelepiped"],
    alfa: ["paralelepiped"], fi: ["paralelepiped"],
    v: ["prizma3", "prizma6", "piramida3", "piramida4", "valj", "stozec", "prisekana", "prisekan"], r: ["valj", "stozec", "krogla"],
    a1: ["prisekana"], a2: ["prisekana"], r1: ["prisekan"], r2: ["prisekan"],
  }[k].includes(S.telo));

  // ---------- prizor ----------
  const group = new THREE.Group(); group.name = "telesa";
  const telo = new THREE.Group(); group.add(telo); // centimetri
  const oznakeG = new THREE.Group(); group.add(oznakeG);
  const lokKlip = new THREE.Plane(), lokDuh = new THREE.Plane();
  const klip = new THREE.Plane(), duh = new THREE.Plane();
  const klipi = [klip], duhKlipi = [duh];
  const posodobiKlip = () => { klip.copy(lokKlip).applyMatrix4(telo.matrixWorld); duh.copy(lokDuh).applyMatrix4(telo.matrixWorld); };

  // Ploskve: neprosojne so rahlo lakirane in ob robovih nežno potemnjene (razdalja do roba je v atributih robA/robB,
  // glej robVrednosti); prosojne so svetlo obarvano steklo: skoraj prozorne, ob robovih in pod poševnim kotom svetlejše.
  const BIG = 1e4; // »ni roba«
  const RJ = { uSteklo: { value: 0 }, uAOw: { value: 1 }, uAO: { value: 0.24 }, uOdt: { value: 0 } };
  function obPrevajanju(sh) {
    Object.assign(sh.uniforms, RJ, { uZadaj: { value: this.side === THREE.BackSide ? 1 : 0 } });
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nattribute vec4 robA;\nattribute vec4 robB;\nvarying vec4 vRobA;\nvarying vec4 vRobB;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRobA = robA; vRobB = robB;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uSteklo, uAOw, uAO, uOdt, uZadaj;\nvarying vec4 vRobA;\nvarying vec4 vRobB;")
      .replace("#include <color_fragment>", `#include <color_fragment>
        float dRob = vRobB.w < 0.0 ? -vRobB.w - length(vRobA.xy) : min(min(min(vRobA.x, vRobA.y), min(vRobA.z, vRobA.w)), min(vRobB.x, vRobB.y));
        float kRob = 1.0 - smoothstep(0.0, uAOw, max(dRob, 0.0));
        diffuseColor.rgb *= (1.0 - uAO * kRob * (1.0 - uSteklo)) * (1.0 + uOdt * vRobB.z);`)
      .replace("#include <premultiplied_alpha_fragment>", `#include <premultiplied_alpha_fragment>
        if (uSteklo > 0.5) {
          float nv = clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0);
          float fr = pow(1.0 - nv, 3.0), rb = kRob * (1.0 - uZadaj);
          float a = clamp(mix(0.1, 0.07, uZadaj) + 0.4 * fr + 0.3 * rb, 0.0, 0.85);
          vec3 svetlo = mix(vec3(0.82, 0.88, 1.0), diffuseColor.rgb, 0.35); // hladen odsev neba, rahlo obarvan
          vec3 sij = svetlo * (0.15 + 0.45 * fr) * (1.0 - 0.55 * uZadaj) + diffuseColor.rgb * 0.45 * rb;
          gl_FragColor = vec4(gl_FragColor.rgb * a * 0.4 + sij, a);
        }`);
  }
  const ploskevMat = (barva, side) => {
    const m = new THREE.MeshPhysicalMaterial({
      color: barva, roughness: 0.4, metalness: 0, specularIntensity: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.25, side, transparent: true, opacity: 1, premultipliedAlpha: true,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
    });
    m.onBeforeCompile = obPrevajanju; return m;
  };
  const mOsnF = ploskevMat("#5C8BF2", THREE.FrontSide), mOsnB = ploskevMat("#3E5DA6", THREE.BackSide);
  const mPlF = ploskevMat("#E8973A", THREE.FrontSide), mPlB = ploskevMat("#9A6428", THREE.BackSide);
  // [material, barva neprosojno, barva steklo]
  const BARVE = [[mOsnF, "#5C8BF2", "#A9C6FF"], [mOsnB, "#3E5DA6", "#5D7BC0"], [mPlF, "#E8973A", "#FFD39A"], [mPlB, "#9A6428", "#B58955"]];
  const mDuh = new THREE.MeshBasicMaterial({ color: "#AFC4FF", transparent: true, opacity: 0.1, depthWrite: false, side: THREE.FrontSide, clippingPlanes: duhKlipi });
  const mRob = new THREE.MeshStandardMaterial({ color: "#F1F4FF", roughness: 0.35, metalness: 0.05, transparent: true, opacity: 1 });
  // skrite robove rišemo črtkano (črtice sestavimo sami, neodvisno od gonilnika)
  const mSkrit = new THREE.LineBasicMaterial({ color: "#DCE4F7", transparent: true, opacity: 0.8, depthWrite: false, depthFunc: THREE.GreaterDepth });
  const mKonV = new THREE.MeshStandardMaterial({ color: "#7CE0B5", roughness: 0.4, transparent: true, opacity: 1 });
  const mKonS = new THREE.LineBasicMaterial({ color: "#7CE0B5", transparent: true, opacity: 0.9, depthWrite: false, depthFunc: THREE.GreaterDepth });
  const mNevidno = new THREE.MeshBasicMaterial({ visible: false });
  // šrafura prereza (kot v učbeniku): poševne črte, izračunane v senčilniku (ostre in brez valovanja pri vsaki velikosti)
  const mPrerez = new THREE.ShaderMaterial({
    uniforms: { uBarva: { value: new THREE.Color("#D94A72") }, uCrta: { value: new THREE.Color("#F7B9CB") } },
    vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: `uniform vec3 uBarva, uCrta; varying vec2 vUv;
      void main() {
        float t = vUv.x + vUv.y, w = max(fwidth(t), 1e-4), f = abs(fract(t) - 0.5);
        float crta = smoothstep(0.5 - 0.13 - w, 0.5 - 0.13 + w, f);
        gl_FragColor = vec4(mix(uBarva, uCrta, crta), 1.0);
        #include <colorspace_fragment>
      }`,
    side: THREE.DoubleSide, transparent: true,
  });
  const mPrerezRob = new THREE.MeshStandardMaterial({ color: "#FFD3DF", roughness: 0.4, transparent: true, opacity: 1 });
  const mRavnina = new THREE.MeshBasicMaterial({ color: "#9FB6FF", transparent: true, opacity: 0.13, side: THREE.DoubleSide, depthWrite: false, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 8 });
  const mRavninaRob = new THREE.LineBasicMaterial({ color: "#B8C9FF", transparent: true, opacity: 0.7 });

  const praznaGeo = () => new THREE.BufferGeometry();
  const mesh = (geo, mat, ro) => { const m = new THREE.Mesh(geo, mat); m.renderOrder = ro; m.frustumCulled = false; return m; };
  const osnB = mesh(praznaGeo(), mOsnB, 0), osnF = mesh(osnB.geometry, mOsnF, 1), osnD = mesh(osnB.geometry, mDuh, 7);
  const plB = mesh(praznaGeo(), mPlB, 0), plF = mesh(plB.geometry, mPlF, 1), plD = mesh(plB.geometry, mDuh, 7);
  telo.add(osnB, osnF, plB, plF, osnD, plD);
  const klipani = [osnB, osnF, plB, plF];
  for (const m of [osnB, osnF, plB, plF, osnD, plD]) m.onBeforeRender = posodobiKlip;

  const CAP = 4 * NK + 64;
  const cevGeo = new THREE.CylinderGeometry(1, 1, 1, visoka ? 8 : 6, 1, true);
  const robovi = new THREE.InstancedMesh(cevGeo, mRob, CAP); robovi.renderOrder = 3; robovi.frustumCulled = false; robovi.count = 0;
  const kroglicaGeo = new THREE.SphereGeometry(1, visoka ? 14 : 10, visoka ? 10 : 7);
  const oglisca = new THREE.InstancedMesh(kroglicaGeo, mRob, 64); oglisca.renderOrder = 3; oglisca.frustumCulled = false; oglisca.count = 0;
  const crtGeo = (n) => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 6), 3)); g.setDrawRange(0, 0); return g; };
  const skritGeo = crtGeo(9000);
  const skrite = new THREE.LineSegments(skritGeo, mSkrit); skrite.renderOrder = 2; skrite.frustumCulled = false;
  const konSGeo = crtGeo(1200);
  const konV = new THREE.InstancedMesh(cevGeo, mKonV, 16), konS = new THREE.LineSegments(konSGeo, mKonS); konV.count = 0;
  konV.renderOrder = 3; konS.renderOrder = 2; konV.frustumCulled = konS.frustumCulled = false;
  telo.add(robovi, oglisca, skrite, konV, konS);
  for (const m of [robovi, oglisca, skrite, konV, konS]) m.onBeforeRender = posodobiKlip;

  const capGeo = new THREE.BufferGeometry();
  capGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array((NS + 16) * 9), 3));
  capGeo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array((NS + 16) * 9), 3));
  capGeo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array((NS + 16) * 6), 2));
  const prerezM = mesh(capGeo, mPrerez, 1);
  const prerezRob = new THREE.InstancedMesh(cevGeo, mPrerezRob, NS + 16); prerezRob.renderOrder = 4; prerezRob.frustumCulled = false; prerezRob.count = 0;
  const ravnina = mesh(new THREE.PlaneGeometry(2, 2), mRavnina, 6);
  const rgeo = new THREE.BufferGeometry().setFromPoints([new Vector3(-1, -1, 0), new Vector3(1, -1, 0), new Vector3(1, 1, 0), new Vector3(-1, 1, 0)]);
  const ravninaRob = new THREE.LineLoop(rgeo, mRavninaRob); ravninaRob.renderOrder = 6; ravnina.add(ravninaRob);
  telo.add(prerezM, prerezRob, ravnina);

  // včrtana in očrtana krogla pravilnih teles (Elementi, XIII. knjiga: telo, včrtano v kroglo)
  const kroglaGeo = new THREE.SphereGeometry(1, visoka ? 64 : 40, visoka ? 40 : 24);
  const mVcrt = new THREE.MeshPhysicalMaterial({ color: "#7CE0B5", roughness: 0.35, clearcoat: 0.4, transparent: true, opacity: 0.55, depthWrite: false });
  const mOcrt = new THREE.MeshPhysicalMaterial({ color: "#9FB6FF", roughness: 0.2, transparent: true, opacity: 0.13, depthWrite: false });
  const vcrtana = mesh(kroglaGeo, mVcrt, -1), ocrtana = mesh(kroglaGeo, mOcrt, 8);
  vcrtana.name = "vcrtana-krogla"; ocrtana.name = "ocrtana-krogla"; vcrtana.visible = ocrtana.visible = false;
  telo.add(vcrtana, ocrtana);
  for (const m of [vcrtana, ocrtana]) m.onBeforeRender = posodobiKlip;
  const kroglePrikazane = (T, e) => S.krogli && pravilno() && e < 1e-4;
  const kroglaSredisce = (T) => (T.jedro ? T.jedro.clone() : V(0, T.H / 2, 0));

  // podlaga: kvadratki po 1 cm (pri velikih mrežah po 5 cm) in mehka senca pod telesom, da lažje oceniš velikost
  const TS = 256;
  const sencaPlatno = document.createElement("canvas"); sencaPlatno.width = sencaPlatno.height = TS;
  const obrisPlatno = document.createElement("canvas"); obrisPlatno.width = obrisPlatno.height = TS;
  const sencaTex = new THREE.CanvasTexture(sencaPlatno); sencaTex.flipY = false; // vrstica platna = z
  const mTla = new THREE.ShaderMaterial({
    uniforms: { uSenca: { value: sencaTex }, uC: { value: new THREE.Vector2() }, uR: { value: 1 }, uKorak: { value: 1 }, uVelik: { value: 5 }, uMoc: { value: 1 }, uBarva: { value: new THREE.Color("#A9BCE8") } },
    vertexShader: "uniform vec2 uC; uniform float uR; varying vec2 vP; void main() { vP = uC + position.xz * uR; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: `uniform sampler2D uSenca; uniform vec2 uC; uniform float uR, uKorak, uVelik, uMoc; uniform vec3 uBarva; varying vec2 vP;
      float mreza(float k, float deb) {
        vec2 q = vP / k, w = max(fwidth(q), vec2(1e-5)), g = abs(fract(q - 0.5) - 0.5) / w;
        return (1.0 - min(min(g.x, g.y) / deb, 1.0)) * (1.0 - smoothstep(0.18, 0.4, max(w.x, w.y)));
      }
      void main() {
        vec2 d = vP - uC; float r = length(d) / uR;
        float rob = 1.0 - smoothstep(0.72, 1.0, r);
        float a = rob * (0.05 + 0.16 * mreza(uKorak, 1.0) + 0.2 * mreza(uVelik, 1.4));
        float sh = texture2D(uSenca, d / (2.0 * uR) + 0.5).a * uMoc * (1.0 - smoothstep(0.85, 1.0, r));
        float A = a + sh * (1.0 - a);
        gl_FragColor = vec4(uBarva * a * (1.0 - sh) / max(A, 1e-4), A);
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false,
  });
  const tlaGeo = new THREE.CircleGeometry(1, visoka ? 96 : 48); tlaGeo.rotateX(-Math.PI / 2);
  const tla = mesh(tlaGeo, mTla, -2); telo.add(tla);
  let korakTal = 1;

  // Obris začetne velikosti: robovi telesa, kot je bilo izbrano. Ko spreminjaš mere, ostane na mestu (v cm, na isti
  // podlagi), zato vidiš, koliko je telo zraslo ali se skrčilo, tudi ko se merilo prilagodi.
  const mObris = new THREE.LineBasicMaterial({ color: 0xdfe8ff, transparent: true, opacity: 0.65, depthTest: false, depthWrite: false });
  // prazna lega že na začetku: ob začetku z razprto mrežo (?razpri=1) obrisa še ni, žarek za točke pa ga vseeno preveri
  const obrisZac = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([], 3)), mObris); obrisZac.name = "obris-zacetka"; obrisZac.renderOrder = 7; obrisZac.visible = false; obrisZac.frustumCulled = false;
  telo.add(obrisZac);
  let zacetek = null; // { telo, mere, tocke }

  // Koordinatni sistem na podlagi (j, 4. 11.): izhodišče v zadnjem levem spodnjem kotu telesa (pri okroglih in
  // trikotnih/šestkotnih osnovnih ploskvah v središču osnovne ploskve), x proti gledalcu,
  // y v desno, z navzgor (desnosučni sistem kot v učbeniku), telo leži v prvem oktantu. Številke so v cm, na koncih
  // telesa so poudarjene črtice z mero (npr. 4 na osi x), zato se ob drsnikih spreminjajo skupaj s telesom.
  const OS_BARVE = [new THREE.Color("#FF8A7A"), new THREE.Color("#7CE0B5"), new THREE.Color("#7FA8FF")]; // x, y, z
  const OS_HEX = ["#FF8A7A", "#7CE0B5", "#7FA8FF"];
  const mOs = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, transparent: true, opacity: 0.95 });
  const osiCev = new THREE.InstancedMesh(cevGeo, mOs, 96); osiCev.count = 0; osiCev.frustumCulled = false; osiCev.renderOrder = 2; osiCev.name = "koordinatne-osi";
  const osiKonGeo = new THREE.ConeGeometry(1, 1, visoka ? 14 : 10);
  const osiKon = new THREE.InstancedMesh(osiKonGeo, mOs, 3); osiKon.count = 0; osiKon.frustumCulled = false; osiKon.renderOrder = 2;
  telo.add(osiCev, osiKon);
  const osNapisi = []; // bazen spritov za številke in imena osi
  const osTeksture = new Map(); // besedilo|barva -> SpriteMaterial
  // skozi: napis je viden tudi za neprosojnim telesom
  function osMaterial(besedilo, barva, ime, skozi) {
    const kljuc = besedilo + "|" + barva + "|" + (ime ? 1 : 0) + (skozi ? 1 : 0);
    if (osTeksture.has(kljuc)) return osTeksture.get(kljuc);
    const c = document.createElement("canvas"), g = c.getContext("2d");
    const fs = ime ? 48 : 40, h = 58, pad = 8;
    let w = 40;
    if (g) { g.font = `${ime ? "italic 700" : "700"} ${fs}px ${PISAVA}`; w = Math.max(h * 0.8, Math.ceil(g.measureText(besedilo).width + 2 * pad)); }
    c.width = w; c.height = h;
    if (g) {
      g.font = `${ime ? "italic 700" : "700"} ${fs}px ${PISAVA}`; g.textAlign = "center"; g.textBaseline = "middle";
      g.lineJoin = "round"; g.lineWidth = 8; g.strokeStyle = "rgba(11,15,22,0.9)"; g.strokeText(besedilo, w / 2, h / 2 + 2);
      g.fillStyle = barva; g.fillText(besedilo, w / 2, h / 2 + 2);
    }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const mat = new THREE.SpriteMaterial({ map: tex, depthTest: !skozi, depthWrite: false, transparent: true });
    mat.userData.razmerje = w / h;
    osTeksture.set(kljuc, mat);
    return mat;
  }

  // nevidni »ročaji« za tanke dele (višina, polmer ...), da jih lahko tapneš
  const proxyCev = {}, proxyKr = {};
  for (const k of ["visina", "polmer", "stranska", "polmer2"]) { proxyCev[k] = mesh(cevGeo, mNevidno, 0); telo.add(proxyCev[k]); }
  for (const k of ["vrh", "sredisce"]) { proxyKr[k] = mesh(kroglicaGeo, mNevidno, 0); telo.add(proxyKr[k]); }

  // ---------- napisi (sprite) ----------
  const napisi = new Map();
  const PISAVA = '"Instrument Sans", system-ui, sans-serif';
  function napis(glavno, pod = "", barva = "#FFFFFF", poudarek = "#6E9BFF", st = 0) {
    const kljuc = glavno + "|" + pod + "|" + barva + "|" + st;
    if (napisi.has(kljuc)) return napisi.get(kljuc);
    const c = document.createElement("canvas"), g = c.getContext("2d");
    const fs = 44, fp = 30, pad = 18, h = 72;
    let w = 80;
    if (g) {
      g.font = `italic 600 ${fs}px ${PISAVA}`; const w1 = g.measureText(glavno).width;
      g.font = `italic 600 ${fp}px ${PISAVA}`; const w2 = pod ? g.measureText(pod).width + 2 : 0;
      w = Math.max(h, Math.ceil(w1 + w2 + 2 * pad));
    }
    c.width = w; c.height = h;
    if (g) {
      g.fillStyle = "rgba(11,15,22,0.80)"; g.strokeStyle = poudarek; g.lineWidth = 3;
      const r = 22; g.beginPath(); g.moveTo(r, 2); g.lineTo(w - r, 2); g.quadraticCurveTo(w - 2, 2, w - 2, r); g.lineTo(w - 2, h - r); g.quadraticCurveTo(w - 2, h - 2, w - r, h - 2);
      g.lineTo(r, h - 2); g.quadraticCurveTo(2, h - 2, 2, h - r); g.lineTo(2, r); g.quadraticCurveTo(2, 2, r, 2); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = barva; g.textBaseline = "alphabetic";
      g.font = `italic 600 ${fs}px ${PISAVA}`; const w1 = g.measureText(glavno).width;
      g.font = `italic 600 ${fp}px ${PISAVA}`; const w2 = pod ? g.measureText(pod).width + 2 : 0;
      const x0 = (w - w1 - w2) / 2;
      g.font = `italic 600 ${fs}px ${PISAVA}`; g.fillText(glavno, x0, 50);
      if (pod) { g.font = `italic 600 ${fp}px ${PISAVA}`; g.fillText(pod, x0 + w1 + 2, 60); }
    }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true });
    const sp = new THREE.Sprite(mat); sp.renderOrder = 10; sp.visible = false;
    const vis = 0.12; sp.scale.set(vis * w / h, vis, 1);
    sp.userData.tex = tex; oznakeG.add(sp); napisi.set(kljuc, sp);
    return sp;
  }
  // pika za središče krogle (vidna tudi skozi ploskev)
  const pikaPlatno = document.createElement("canvas"); pikaPlatno.width = pikaPlatno.height = 32;
  { const g = pikaPlatno.getContext("2d"); if (g) { g.fillStyle = "#7CE0B5"; g.beginPath(); g.arc(16, 16, 11, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#0B0F16"; g.lineWidth = 3; g.stroke(); } }
  const pikaTex = new THREE.CanvasTexture(pikaPlatno); pikaTex.colorSpace = THREE.SRGBColorSpace;
  const pika = new THREE.Sprite(new THREE.SpriteMaterial({ map: pikaTex, depthTest: false, depthWrite: false, transparent: true }));
  pika.renderOrder = 10; pika.scale.set(0.032, 0.032, 1); pika.visible = false; oznakeG.add(pika);

  // ---------- pomožne ----------
  const _a = new Vector3(), _b = new Vector3(), _c = new Vector3(), _d = new Vector3(), _q = new Quaternion(), _m = new Matrix4(), _m2 = new Matrix4();
  const Y = new Vector3(0, 1, 0), _sk = new Vector3();
  const V = (x, y, z) => new Vector3(x, y, z);
  function newell(p, out) {
    out.set(0, 0, 0);
    for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; out.x += (a.y - b.y) * (a.z + b.z); out.y += (a.z - b.z) * (a.x + b.x); out.z += (a.x - b.x) * (a.y + b.y); }
    return out.normalize();
  }
  function sredisce(p, out) { out.set(0, 0, 0); for (const q of p) out.add(q); return out.multiplyScalar(1 / p.length); }
  function ploskev(p, vrsta, jedro) {
    const n = newell(p, new Vector3());
    if (n.dot(sredisce(p, _a).sub(jedro)) < 0) { p.reverse(); n.negate(); }
    return { p, vrsta, n, stars: -1, M: new Matrix4(), A: null, os: null, kot: 0 };
  }
  function pripni(F, P, iP) {
    for (let i = 0; i < F.p.length; i++) {
      const a = F.p[i], b = F.p[(i + 1) % F.p.length];
      if (P.p.some((q) => q.distanceToSquared(a) < 1e-12) && P.p.some((q) => q.distanceToSquared(b) < 1e-12)) {
        F.stars = iP; F.A = a.clone();
        F.os = new Vector3().crossVectors(F.n, P.n).normalize();
        F.kot = Math.acos(Math.max(-1, Math.min(1, F.n.dot(P.n))));
        return;
      }
    }
    throw new Error("ploskvi nimata skupnega roba");
  }
  const vrtiX = (py, pz, kot, out) => { // vrtenje okoli premice, vzporedne z osjo x, skozi (·, py, pz)
    out.makeRotationX(kot); const c = Math.cos(kot), s = Math.sin(kot);
    out.setPosition(0, py - (py * c - pz * s), pz - (py * s + pz * c)); return out;
  };
  function pravilni(n, a) { // ogljišča pravilnega n-kotnika z robom a; en rob gleda proti +z
    const R = a / (2 * Math.sin(Math.PI / n)), t = [];
    for (let i = 0; i < n; i++) { const f = Math.PI / 2 - Math.PI / n + (2 * Math.PI * i) / n; t.push([R * Math.cos(f), R * Math.sin(f)]); }
    return t;
  }

  // ---------- sestava telesa ----------
  // Vrne opis: ploskve (mnogokotniki s tečaji za mrežo), plašč okroglih teles, napise, pomožne črte, formule.
  function prizmaPl(baza, v, jedro) {
    const n = baza.length, B = baza.map(([x, z]) => V(x, 0, z)), T = baza.map(([x, z]) => V(x, v, z));
    const F = [ploskev(B.map((p) => p.clone()), "osn", jedro)];
    let k0 = 0; for (let i = 1; i < n; i++) if (B[i].z + B[(i + 1) % n].z > B[k0].z + B[(k0 + 1) % n].z + 1e-9) k0 = i;
    const stran = (i) => ploskev([B[i].clone(), B[(i + 1) % n].clone(), T[(i + 1) % n].clone(), T[i].clone()], "pl", jedro);
    const nD = Math.ceil((n - 1) / 2), nL = n - 1 - nD;
    F.push(stran(k0)); pripni(F[1], F[0], 0);
    let prej = 1; for (let j = 1; j <= nD; j++) { F.push(stran((k0 + j) % n)); pripni(F[F.length - 1], F[prej], prej); prej = F.length - 1; }
    prej = 1; for (let j = 1; j <= nL; j++) { F.push(stran((k0 - j + n) % n)); pripni(F[F.length - 1], F[prej], prej); prej = F.length - 1; }
    F.push(ploskev(T.map((p) => p.clone()), "osn", jedro)); pripni(F[F.length - 1], F[1], 1);
    return { F, B, T, k0, iSpr: 1, iZg: F.length - 1 };
  }
  function piramidaPl(baza, v, jedro) {
    const n = baza.length, B = baza.map(([x, z]) => V(x, 0, z)), vrh = V(0, v, 0);
    const F = [ploskev(B.map((p) => p.clone()), "osn", jedro)];
    let k0 = 0; for (let i = 1; i < n; i++) if (B[i].z + B[(i + 1) % n].z > B[k0].z + B[(k0 + 1) % n].z + 1e-9) k0 = i;
    for (let j = 0; j < n; j++) { const i = (k0 + j) % n; F.push(ploskev([B[i].clone(), B[(i + 1) % n].clone(), vrh.clone()], "pl", jedro)); pripni(F[F.length - 1], F[0], 0); }
    return { F, B, vrh, k0, iSpr: 1 };
  }
  function prisekanaPl(b1, b2, v, jedro) {
    const n = b1.length, B = b1.map(([x, z]) => V(x, 0, z)), T = b2.map(([x, z]) => V(x, v, z));
    const F = [ploskev(B.map((p) => p.clone()), "osn", jedro)];
    let k0 = 0; for (let i = 1; i < n; i++) if (B[i].z + B[(i + 1) % n].z > B[k0].z + B[(k0 + 1) % n].z + 1e-9) k0 = i;
    for (let j = 0; j < n; j++) { const i = (k0 + j) % n; F.push(ploskev([B[i].clone(), B[(i + 1) % n].clone(), T[(i + 1) % n].clone(), T[i].clone()], "pl", jedro)); pripni(F[F.length - 1], F[0], 0); }
    F.push(ploskev(T.map((p) => p.clone()), "osn", jedro)); pripni(F[F.length - 1], F[1], 1);
    return { F, B, T, k0, iSpr: 1, iZg: F.length - 1 };
  }
  // Ali se ploskvi razprte mreže prekrivata (vse ležijo na podlagi; ploskve so konveksne, zato zadošča ločilna os).
  function prekriva(L, tol) {
    const meja = L.map((P) => { let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity; for (const [x, z] of P) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); } return [x0, x1, z0, z1]; });
    const loci = (A, B) => {
      for (const P of [A, B]) for (let i = 0; i < P.length; i++) {
        const [x1, z1] = P[i], [x2, z2] = P[(i + 1) % P.length], L0 = Math.hypot(x2 - x1, z2 - z1); if (L0 < 1e-12) continue;
        const nx = (z1 - z2) / L0, nz = (x2 - x1) / L0;
        let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
        for (const [x, z] of A) { const d = x * nx + z * nz; a0 = Math.min(a0, d); a1 = Math.max(a1, d); }
        for (const [x, z] of B) { const d = x * nx + z * nz; b0 = Math.min(b0, d); b1 = Math.max(b1, d); }
        if (a1 <= b0 + tol || b1 <= a0 + tol) return true;
      }
      return false;
    };
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
      const a = meja[i], b = meja[j];
      if (a[1] <= b[0] + tol || b[1] <= a[0] + tol || a[3] <= b[2] + tol || b[3] <= a[2] + tol) continue;
      if (!loci(L[i], L[j])) return true;
    }
    return false;
  }
  // Mnogoterno telo iz oglišč in ploskev (pravilna telesa, paralelepiped). Med kandidati za mrežo izbere najmanjšo,
  // ki se ne prekriva (pri paralelepipedu je to odvisno od kotov, zato izbiro shranimo za vsake mere posebej).
  const izbranoDrevo = new Map();
  function poliederPl(vr) {
    const g = vr === "paralelepiped" ? paralelepipedTelo(S.a, S.b, S.c, S.alfa, S.fi) : pravilnoTelo(vr, S.a);
    const tockeV = g.tocke.map(([x, y, z]) => V(x, y, z)), jedro = sredisce(tockeV, new Vector3());
    const kand = drevesaMreze(vr, g);
    const sestaviDrevo = (starsi) => { // starš je pred otrokom (iskanje v širino od spodnje ploskve)
      const red = [0], kje = new Map([[0, 0]]);
      for (let k = 0; k < red.length; k++) for (let i = 0; i < starsi.length; i++) if (starsi[i] === red[k] && !kje.has(i)) { kje.set(i, red.length); red.push(i); }
      const F = red.map((i) => ploskev(g.ploskve[i].map((j) => tockeV[j].clone()), g.vrste ? g.vrste[i] : "pl", jedro));
      red.forEach((i, k) => { if (k) pripni(F[k], F[kje.get(starsi[i])], kje.get(starsi[i])); });
      return { F, red };
    };
    const kljuc = vr === "paralelepiped" ? [vr, S.a, S.b, S.c, S.alfa, S.fi].join() : vr;
    let izb = izbranoDrevo.get(kljuc);
    if (izb === undefined) {
      let best = Infinity; izb = 0;
      kand.forEach((starsi, ix) => {
        const P = sestaviDrevo(starsi);
        izracunajMatrike(P, 1);
        const L = P.F.map((F) => F.p.map((p) => { _a.copy(p).applyMatrix4(F.M); return [_a.x, _a.z]; }));
        if (prekriva(L, 1e-6 * S.a)) return;
        let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
        for (const P2 of L) for (const [x, z] of P2) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
        const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2; let R = 0;
        for (const P2 of L) for (const [x, z] of P2) R = Math.max(R, Math.hypot(x - cx, z - cz));
        if (R < best - 1e-9) { best = R; izb = ix; }
      });
      if (izbranoDrevo.size > 300) izbranoDrevo.clear();
      izbranoDrevo.set(kljuc, izb);
    }
    const { F, red } = sestaviDrevo(kand[izb]);
    return { F, red, obseg: tockeV, jedro, H: Math.max(...tockeV.map((p) => p.y)), poli: g };
  }
  const krog = (r, y) => { const t = []; for (let i = 0; i < NK; i++) { const f = (2 * Math.PI * i) / NK; t.push(V(r * Math.sin(f), y, r * Math.cos(f))); } return t; };

  function sestavi() {
    const vr = S.telo, m1 = S.m1, m2 = S.m2;
    const T = { vrsta: vr, F: [], plasc: null, krogla: 0, H: 0, napisi: [], crte: [], proxy: {}, oglisca: true, zgOmejen: false };
    const top = Math.min(S.m3, m1 - 0.5); T.zgOmejen = S.m3 > m1 - 0.5;
    if (POLIEDRI.has(vr)) Object.assign(T, poliederPl(vr));
    else if (vr === "kocka" || vr === "kvader" || vr === "prizma3" || vr === "prizma6") {
      let baza, v;
      if (vr === "kocka") { baza = [[m1 / 2, m1 / 2], [m1 / 2, -m1 / 2], [-m1 / 2, -m1 / 2], [-m1 / 2, m1 / 2]]; v = m1; }
      else if (vr === "kvader") { const a = m1, b = S.m3; baza = [[a / 2, b / 2], [a / 2, -b / 2], [-a / 2, -b / 2], [-a / 2, b / 2]]; v = m2; }
      else { baza = pravilni(vr === "prizma3" ? 3 : 6, m1); v = m2; }
      if (vr === "prizma3") { const c = (baza[0][1] + baza[1][1] + baza[2][1]) / 3; baza = baza.map(([x, z]) => [x, z - c]); }
      const P = prizmaPl(baza, v, V(0, v / 2, 0)); Object.assign(T, P); T.H = v;
    } else if (vr === "piramida3" || vr === "piramida4") {
      const P = piramidaPl(pravilni(vr === "piramida3" ? 3 : 4, m1), m2, V(0, m2 / 4, 0)); Object.assign(T, P); T.H = m2;
    } else if (vr === "prisekana") {
      const P = prisekanaPl(pravilni(4, m1), pravilni(4, top), m2, V(0, m2 / 2, 0)); Object.assign(T, P); T.H = m2; T.a2 = top;
    } else if (vr === "valj" || vr === "stozec" || vr === "prisekan") {
      const r1 = m1, v = m2, r2 = vr === "valj" ? r1 : vr === "stozec" ? 0 : top;
      T.r1 = r1; T.r2 = r2; T.H = v;
      const jedro = V(0, v / 2, 0);
      T.F.push(ploskev(krog(r1, 0), "osn", jedro));
      if (r2 > 0) { const Fz = ploskev(krog(r2, v), "osn", jedro); T.F.push(Fz); }
      const pl = { tip: vr, r1, r2, v };
      if (vr === "valj") { pl.Nw = 1; }
      else {
        pl.Hv = (v * r1) / (r1 - r2); // višina celega stožca
        pl.Sc = Math.hypot(r1, pl.Hv); pl.s1 = (pl.Sc * r2) / r1; pl.Nw = vr === "stozec" ? NG : Math.max(2, NG >> 1);
        pl.g = V(0, pl.Hv, -r1).divideScalar(pl.Sc); pl.nn = V(0, -r1, -pl.Hv).divideScalar(pl.Sc);
        pl.fi = (2 * Math.PI * r1) / pl.Sc; pl.Theta = Math.PI - Math.atan2(pl.Hv, r1);
        pl.vrh = V(0, pl.Hv, 0);
      }
      T.plasc = pl;
    } else if (vr === "krogla") {
      T.krogla = m1; T.H = 2 * m1;
    }
    return T;
  }

  // Lega točke plašča (u ∈ [−1, 1] okoli, w ∈ [0, 1] od spodaj navzgor) pri razprtju e.
  function plascTocka(pl, u, w, e, out) {
    if (pl.tip === "valj") {
      const r = pl.r1, uc = u * Math.PI * r, k = (1 - e) / r;
      let f, g;
      if (k < 1e-7) { f = uc; g = 0; } else { f = Math.sin(k * uc) / k; g = (1 - Math.cos(k * uc)) / k; }
      // P0 = (0,0,r), T = +x, N = −z, W = +y; nato tečaj okoli roba skozi P0 (vzporedno z x) za e·90°
      const x = f, y = w * pl.v, z = r - g, kot = e * Math.PI / 2, c = Math.cos(kot), s = Math.sin(kot);
      return out.set(x, y * c - (z - r) * s, r + y * s + (z - r) * c);
    }
    const sg = pl.r1 / pl.Sc, sb = sg + (1 - sg) * e, cb = Math.sqrt(Math.max(0, 1 - sb * sb));
    const rho = pl.Sc - w * (pl.Sc - pl.s1), om = (u * pl.fi / 2) / sb;
    const g = pl.g, n = pl.nn;
    // a = −cosβ g + sinβ n ; e1 = −sinβ g − cosβ n ; e2 = +x
    const co = Math.cos(om), so = Math.sin(om);
    const ay = -cb * g.y + sb * n.y, az = -cb * g.z + sb * n.z, e1y = -sb * g.y - cb * n.y, e1z = -sb * g.z - cb * n.z;
    const px = rho * sb * so, py = pl.Hv + rho * (cb * ay + sb * co * e1y), pz = rho * (cb * az + sb * co * e1z);
    const kot = e * pl.Theta, c = Math.cos(kot), s = Math.sin(kot), r = pl.r1;
    return out.set(px, py * c - (pz - r) * s, r + py * s + (pz - r) * c);
  }

  function izracunajMatrike(T, e) {
    for (let i = 0; i < T.F.length; i++) {
      const F = T.F[i];
      if (T.plasc && i === 1) { // zgornja osnovna ploskev valja ali prisekanega stožca
        const pl = T.plasc;
        const kotZg = pl.tip === "valj" ? Math.PI / 2 : Math.atan2(pl.Hv, pl.r1);
        const kotPl = pl.tip === "valj" ? Math.PI / 2 : pl.Theta;
        vrtiX(pl.v, pl.r2, e * kotZg, _m2); vrtiX(0, pl.r1, e * kotPl, F.M); F.M.multiply(_m2);
        continue;
      }
      if (F.stars < 0) { F.M.identity(); continue; }
      _m.makeRotationAxis(F.os, e * F.kot);
      _a.copy(F.A).applyMatrix4(_m); _m.setPosition(F.A.x - _a.x, F.A.y - _a.y, F.A.z - _a.z);
      F.M.multiplyMatrices(T.F[F.stars].M, _m);
    }
  }

  // ---------- geometrija ----------
  let osnVel = -1, plVel = -1, plIndeks = null, enotaKrogla = null;
  function geoMnogokotniki(geo, ploskve) {
    let n = 0; for (const F of ploskve) n += (F.p.length - 2) * 3;
    return n;
  }
  function zagotovi(mesh3, n, staro) { // nova geometrija, če se število oglišč spremeni
    if (n === staro) return false;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(Math.max(3, n) * 3), 3));
    g.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(Math.max(3, n) * 3), 3));
    g.setAttribute("robA", new THREE.BufferAttribute(new Float32Array(Math.max(3, n) * 4), 4));
    g.setAttribute("robB", new THREE.BufferAttribute(new Float32Array(Math.max(3, n) * 4), 4));
    const st0 = mesh3[0].geometry; for (const m of mesh3) m.geometry = g; st0.dispose();
    return true;
  }
  // Razdalje oglišča ploskve do premic njenih robov (največ 6 robov; razdalja do premice je afina, zato je
  // linearna interpolacija v trikotniku natančna). Krog (več kot 6 oglišč): lokalni koordinati glede na središče in −R.
  const _e = new Vector3(), _f = new Vector3(), rv = new Float32Array(8);
  function robVrednosti(F, j, odt) {
    const p = F.p, n = p.length, q = p[j];
    if (n > 6) {
      if (!F.kc) { F.kc = sredisce(p, new Vector3()); F.kR = F.kc.distanceTo(p[0]); F.k1 = p[0].clone().sub(F.kc).normalize(); F.k2 = new Vector3().crossVectors(F.n, F.k1); }
      _e.subVectors(q, F.kc); rv[0] = _e.dot(F.k1); rv[1] = _e.dot(F.k2); rv[2] = rv[3] = rv[4] = rv[5] = BIG; rv[6] = odt; rv[7] = -F.kR; return rv;
    }
    for (let k = 0; k < 6; k++) {
      if (k >= n) { rv[k] = BIG; continue; }
      const a = p[k], b = p[(k + 1) % n]; _e.subVectors(b, a); const L = _e.length();
      rv[k] = L > 1e-12 ? _f.subVectors(q, a).cross(_e).length() / L : BIG;
    }
    rv[6] = odt; rv[7] = 1; return rv;
  }
  // odtenki ploskev v mreži (ista barva, malo svetlejša ali temnejša ploskev)
  const ODT = [0, 0.1, -0.07, 0.05, -0.1, 0.03, 0.08, -0.04];
  function napolniMnogokotnike(geo, ploskve, odt0 = 0) {
    const P = geo.attributes.position.array, N = geo.attributes.normal.array, RA = geo.attributes.robA.array, RB = geo.attributes.robB.array; let k = 0, kr = 0, fi = odt0;
    for (const F of ploskve) {
      _d.copy(F.n).transformDirection(F.M);
      const p0 = _a.copy(F.p[0]).applyMatrix4(F.M), odt = ODT[fi++ % ODT.length];
      for (let i = 1; i < F.p.length - 1; i++) {
        _b.copy(F.p[i]).applyMatrix4(F.M); _c.copy(F.p[i + 1]).applyMatrix4(F.M);
        for (const q of [p0, _b, _c]) { P[k] = q.x; P[k + 1] = q.y; P[k + 2] = q.z; N[k] = _d.x; N[k + 1] = _d.y; N[k + 2] = _d.z; k += 3; }
        for (const j of [0, i, i + 1]) { const r = robVrednosti(F, j, odt); RA.set(r.subarray(0, 4), kr); RB.set(r.subarray(4, 8), kr); kr += 4; }
      }
    }
    geo.setDrawRange(0, k / 3);
    geo.attributes.position.needsUpdate = true; geo.attributes.normal.needsUpdate = true; geo.attributes.robA.needsUpdate = geo.attributes.robB.needsUpdate = true;
    geo.computeBoundingSphere();
  }

  // ---------- stanje ----------
  let T = null, s = 1, D = 10, sred = new Vector3(), prerezInfo = null, deliSeznam = [];
  // Merilo pri spreminjanju mer ostane, dokler telo ne preraste prizora ali se ne skrči pod 45 %: tako telo vidno
  // zraste ali se skrči (prej se je vsakič samo prilagodilo zaslonu in se je spremenilo le merilo).
  const MERE = ["a", "b", "c", "r", "a1", "a2", "r1", "r2", "v", "alfa", "fi"];
  let Dfiks = 0, zadnja = "";
  const OHRANI = ["prosojno", "prerez", "lega", "nagib", "zasuk", "razpri", "krogli"];
  const kljucMer = () => MERE.filter((k) => rabi(k)()).map((k) => S[k]).join(); // le mere izbranega telesa
  const robSeg = []; // [x1,y1,z1,x2,y2,z2] ...
  const tocke = []; // oglišča (v cm, trenutno)
  const lokTocke = []; // za meje
  function dodajRob(p, q) { robSeg.push(p.x, p.y, p.z, q.x, q.y, q.z); }

  function lepD(R, f) { const potreba = (2 * R) / f; for (const x of LEPA) if (x >= potreba - 1e-9) return x; return potreba; }
  function meje(pts, out) { // središče škatle in polmer
    const mn = _b.set(Infinity, Infinity, Infinity), mx = _c.set(-Infinity, -Infinity, -Infinity);
    for (const p of pts) { mn.min(p); mx.max(p); }
    out.addVectors(mn, mx).multiplyScalar(0.5);
    let R = 0; for (const p of pts) R = Math.max(R, p.distanceTo(out));
    return R;
  }

  function obnovi() {
    T = sestavi();
    const e = T.krogla ? 0 : S.razpri;
    izracunajMatrike(T, e);
    // ----- ploskve -----
    const osnovne = T.F.filter((F) => F.vrsta === "osn"), stranske = T.F.filter((F) => F.vrsta === "pl");
    const nOsn = geoMnogokotniki(null, osnovne);
    if (zagotovi([osnB, osnF, osnD], nOsn, osnVel)) osnVel = nOsn;
    napolniMnogokotnike(osnB.geometry, osnovne, 6);
    osnB.visible = osnF.visible = nOsn > 0;
    lokTocke.length = 0;
    for (const F of T.F) for (const p of F.p) lokTocke.push(p.clone().applyMatrix4(F.M));
    if (T.plasc) {
      const pl = T.plasc, Nu = NK, Nw = pl.Nw, n = (Nu + 1) * (Nw + 1);
      const kljuc = n * 10 + (pl.tip === "valj" ? 1 : 2);
      if (zagotovi([plB, plF, plD], n, plVel)) {
        plVel = n; plIndeks = kljuc;
        const idx = [];
        for (let j = 0; j < Nw; j++) for (let i = 0; i < Nu; i++) { const a = j * (Nu + 1) + i, b = a + 1, c = a + Nu + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
        plB.geometry.setIndex(idx);
      }
      const g = plB.geometry, P = g.attributes.position.array;
      // smer navijanja preverimo pri zloženem plašču: normala mora kazati ven
      for (let j = 0; j <= Nw; j++) for (let i = 0; i <= Nu; i++) {
        plascTocka(pl, -1 + (2 * i) / Nu, j / Nw, e, _a); const k = (j * (Nu + 1) + i) * 3; P[k] = _a.x; P[k + 1] = _a.y; P[k + 2] = _a.z;
      }
      g.setDrawRange(0, Infinity);
      g.attributes.position.needsUpdate = true; g.computeVertexNormals();
      { // smer navijanja: normala prvega trikotnika zloženega plašča mora kazati ven
        const ix = g.index.array, kos = (q, out) => plascTocka(pl, -1 + (2 * (q % (Nu + 1))) / Nu, Math.floor(q / (Nu + 1)) / Nw, 0, out);
        kos(ix[0], _a); kos(ix[1], _b); kos(ix[2], _c);
        _d.subVectors(_b, _a).cross(_sk.subVectors(_c, _a)); _sk.set(_a.x, 0, _a.z);
        if (_d.dot(_sk) < 0) { for (let k = 0; k < ix.length; k += 3) { const t = ix[k + 1]; ix[k + 1] = ix[k + 2]; ix[k + 2] = t; } g.index.needsUpdate = true; g.computeVertexNormals(); }
      }
      { // razdalje do robov plašča (vzdolž plašča): spodnja in zgornja krožnica, v mreži še oba stranska robova
        const RA = g.attributes.robA.array, RB = g.attributes.robB.array, poln = pl.tip === "valj" ? pl.v : pl.Sc - pl.s1;
        for (let j = 0; j <= Nw; j++) for (let i = 0; i <= Nu; i++) {
          const w = j / Nw, u = -1 + (2 * i) / Nu, k = (j * (Nu + 1) + i) * 4;
          const pol = pl.tip === "valj" ? Math.PI * pl.r1 : ((pl.Sc - w * (pl.Sc - pl.s1)) * pl.fi) / 2;
          RA[k] = w * poln; RA[k + 1] = pl.r2 > 0 ? (1 - w) * poln : BIG; RA[k + 2] = e > 1e-4 ? (1 - Math.abs(u)) * pol : BIG; RA[k + 3] = BIG;
          RB[k] = RB[k + 1] = BIG; RB[k + 2] = 0; RB[k + 3] = 1;
        }
        g.attributes.robA.needsUpdate = g.attributes.robB.needsUpdate = true;
      }
      g.computeBoundingSphere();
      for (let i = 0; i <= 16; i++) { lokTocke.push(plascTocka(pl, -1 + i / 8, 0, e, new Vector3())); lokTocke.push(plascTocka(pl, -1 + i / 8, 1, e, new Vector3())); }
    } else if (T.krogla) {
      if (!enotaKrogla) enotaKrogla = new THREE.SphereGeometry(1, visoka ? 96 : 56, visoka ? 64 : 36);
      const n = enotaKrogla.attributes.position.count;
      if (zagotovi([plB, plF, plD], n, plVel)) { plVel = n; plB.geometry.setIndex(enotaKrogla.index.clone()); plIndeks = -1; }
      const g = plB.geometry, P = g.attributes.position.array, Nn = g.attributes.normal.array, U = enotaKrogla.attributes.position.array;
      for (let k = 0; k < n * 3; k += 3) { P[k] = U[k] * T.krogla; P[k + 1] = U[k + 1] * T.krogla + T.krogla; P[k + 2] = U[k + 2] * T.krogla; Nn[k] = U[k]; Nn[k + 1] = U[k + 1]; Nn[k + 2] = U[k + 2]; }
      { const RA = g.attributes.robA.array, RB = g.attributes.robB.array; RA.fill(BIG); for (let k = 0; k < RB.length; k += 4) { RB[k] = RB[k + 1] = BIG; RB[k + 2] = 0; RB[k + 3] = 1; } g.attributes.robA.needsUpdate = g.attributes.robB.needsUpdate = true; }
      g.setDrawRange(0, Infinity); g.attributes.position.needsUpdate = true; g.attributes.normal.needsUpdate = true; g.computeBoundingSphere();
      lokTocke.push(V(T.krogla, T.krogla, 0), V(-T.krogla, T.krogla, 0), V(0, 0, 0), V(0, 2 * T.krogla, 0), V(0, T.krogla, T.krogla), V(0, T.krogla, -T.krogla));
    } else {
      const nPl = geoMnogokotniki(null, stranske);
      if (zagotovi([plB, plF, plD], nPl, plVel) || plIndeks !== 0) { plVel = nPl; plIndeks = 0; plB.geometry.setIndex(null); }
      napolniMnogokotnike(plB.geometry, stranske);
    }

    { // včrtana in očrtana krogla (očrtana določa tudi merilo prizora)
      const kv = kroglePrikazane(T, e);
      vcrtana.visible = ocrtana.visible = kv;
      if (kv) {
        const C = kroglaSredisce(T), P = PRAVILNA[T.vrsta], Ro = P.Ro[1](S.a);
        vcrtana.position.copy(C); vcrtana.scale.setScalar(P.Rv[1](S.a)); ocrtana.position.copy(C); ocrtana.scale.setScalar(Ro);
        for (const d of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) lokTocke.push(C.clone().add(V(d[0] * Ro, d[1] * Ro, d[2] * Ro)));
      }
    }
    // ----- merilo in središčenje -----
    if (zacetek?.telo !== S.telo) zacetek = null;
    // obris začetne velikosti (»hologram«) ostane v prizoru, tudi ko je večji od telesa (j, 4. 11.)
    const obrisViden = !!zacetek && e <= 1e-4 && zacetek.mere !== kljucMer();
    if (obrisViden) for (const p of zacetek.tocke) lokTocke.push(p);
    const R = meje(lokTocke, sred);
    let D0;
    { // zloženo telo: lepa (okrogla) dolžina merila
      const T0 = e > 0 ? (() => { izracunajMatrike(T, 0); const t0 = []; for (const F of T.F) for (const p of F.p) t0.push(p.clone().applyMatrix4(F.M)); if (T.plasc) for (let i = 0; i <= 16; i++) { t0.push(plascTocka(T.plasc, -1 + i / 8, 0, 0, new Vector3()), plascTocka(T.plasc, -1 + i / 8, 1, 0, new Vector3())); } izracunajMatrike(T, e); return t0; })() : lokTocke;
      D0 = lepD(meje(T0, _d), 0.9);
      if (e > 0 && Dfiks > 0) D0 = Dfiks; // razpiranje začne pri trenutnem merilu (brez skoka)
      if (e > 0) {
        izracunajMatrike(T, 1);
        const t1 = []; for (const F of T.F) for (const p of F.p) t1.push(p.clone().applyMatrix4(F.M));
        if (T.plasc) for (let i = 0; i <= 16; i++) { t1.push(plascTocka(T.plasc, -1 + i / 8, 0, 1, new Vector3()), plascTocka(T.plasc, -1 + i / 8, 1, 1, new Vector3())); }
        const D1 = lepD(meje(t1, _d), 0.92);
        izracunajMatrike(T, e);
        const k = e * e * (3 - 2 * e);
        D = Math.max(D0 + (D1 - D0) * k, (2 * R) / 0.95);
      } else D = D0;
    }
    if (e <= 1e-4) {
      // merilo ostane ob stikalih, ravnini in zložitvi mreže. Ob spremembi mer ali novem telesu (j, 4. 11.) pa telo
      // na zaslonu obdrži velikost, spremeni se »hologram«: podlaga s kvadratki in osi se zvezno povečata ali
      // skrčita skupaj s pogledom, številke na oseh pa vedno kažejo prave mere iz drsnikov.
      const Dt = (2 * R) / 0.9;
      Dfiks = OHRANI.includes(zadnja) && Dfiks > 0 ? Math.max(Dfiks, Dt) : Dt;
      D = Dfiks;
    }
    // Iluzija rasti (j, 4. 11.): ob spremembi mer prizor najprej obdrži staro merilo, zato telo vidno zraste ali se
    // skrči (»se približa ali oddalji«), nato se kamera mehko umakne ali približa na novo merilo (korak).
    const sPrej = s * group.scale.x;
    s = 2 / D;
    // med prehodom tudi druge spremembe (prosojno, prerez, razpri) nadaljujejo prehod brez skoka; novo telo začne pri 1
    const zvezno = MERE.includes(zadnja) || (zadnja !== "telo" && group.scale.x !== 1);
    if (ctx.gibanje !== false && zvezno && sPrej > 0) group.scale.setScalar(Math.min(1.6, Math.max(0.6, sPrej / s)));
    else group.scale.setScalar(1);
    telo.scale.setScalar(s); telo.position.copy(sred).multiplyScalar(-s);
    telo.updateMatrix();
    const debRob = (visoka ? 0.0062 : 0.0075) / s;

    // ----- robovi -----
    robSeg.length = 0; tocke.length = 0;
    if (!T.plasc && !T.krogla) {
      for (const F of T.F) {
        for (let i = 0; i < F.p.length; i++) { _a.copy(F.p[i]).applyMatrix4(F.M); _b.copy(F.p[(i + 1) % F.p.length]).applyMatrix4(F.M); dodajRob(_a, _b); tocke.push(_a.clone()); }
      }
    } else if (T.plasc) {
      const pl = T.plasc;
      for (const F of T.F) for (let i = 0; i < F.p.length; i++) { _a.copy(F.p[i]).applyMatrix4(F.M); _b.copy(F.p[(i + 1) % F.p.length]).applyMatrix4(F.M); dodajRob(_a, _b); }
      if (e > 1e-4) {
        for (let i = 0; i < NK; i++) {
          plascTocka(pl, -1 + (2 * i) / NK, 0, e, _a); plascTocka(pl, -1 + (2 * (i + 1)) / NK, 0, e, _b); dodajRob(_a, _b);
          if (pl.r2 > 0) { plascTocka(pl, -1 + (2 * i) / NK, 1, e, _a); plascTocka(pl, -1 + (2 * (i + 1)) / NK, 1, e, _b); dodajRob(_a, _b); }
        }
        for (const u of [-1, 1]) { plascTocka(pl, u, 0, e, _a); plascTocka(pl, u, 1, e, _b); dodajRob(_a, _b); }
      }
      if (pl.tip === "stozec") tocke.push(plascTocka(pl, 0, 1, e, new Vector3()));
    } else {
      const r = T.krogla; // glavni krog (ekvator)
      for (let i = 0; i < NK; i++) { const f1 = (2 * Math.PI * i) / NK, f2 = (2 * Math.PI * (i + 1)) / NK; _a.set(r * Math.sin(f1), r, r * Math.cos(f1)); _b.set(r * Math.sin(f2), r, r * Math.cos(f2)); dodajRob(_a, _b); }
    }
    const nSeg = Math.min(CAP, robSeg.length / 6);
    for (let i = 0; i < nSeg; i++) {
      const o = i * 6; _a.set(robSeg[o], robSeg[o + 1], robSeg[o + 2]); _b.set(robSeg[o + 3], robSeg[o + 4], robSeg[o + 5]);
      postaviCev(robovi, i, _a, _b, debRob);
    }
    robovi.count = nSeg; robovi.instanceMatrix.needsUpdate = true; robovi.computeBoundingSphere?.();
    crtkaj(robSeg, nSeg, skritGeo, 0.036 / s, 0.6);
    // obris začetne velikosti (posnetek zloženega telesa ob izbiri; krogli dodamo še poldnevnik)
    if (!zacetek && e <= 1e-4) {
      const seg = robSeg.slice(0, nSeg * 6);
      if (T.plasc) for (const u of [-0.5, 0.5]) { plascTocka(T.plasc, u, 0, 0, _a); plascTocka(T.plasc, u, 1, 0, _b); seg.push(_a.x, _a.y, _a.z, _b.x, _b.y, _b.z); } // zloženo telo ima na robovih le osnovna kroga: dodaj obe stranici
      if (T.krogla) { const r = T.krogla; for (let i = 0; i < NK; i++) { const f1 = (2 * Math.PI * i) / NK, f2 = (2 * Math.PI * (i + 1)) / NK; seg.push(r * Math.sin(f1), r - r * Math.cos(f1), 0, r * Math.sin(f2), r - r * Math.cos(f2), 0); } }
      obrisZac.geometry.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
      obrisZac.geometry.computeBoundingSphere();
      const tocke = [];
      for (let i = 0; i < seg.length; i += 3) tocke.push(new Vector3(seg[i], seg[i + 1], seg[i + 2]));
      zacetek = { telo: S.telo, mere: kljucMer(), tocke };
    }
    obrisZac.visible = obrisViden;
    // oglišča
    const rOgl = (visoka ? 0.0135 : 0.015) / s;
    let no = 0;
    for (const p of tocke) { if (no >= 64) break; _m.compose(p, _q.identity(), _sk.setScalar(rOgl)); oglisca.setMatrixAt(no++, _m); }
    oglisca.count = no; oglisca.instanceMatrix.needsUpdate = true; oglisca.computeBoundingSphere?.();

    // ----- napisi, pomožne črte -----
    sestaviNapise(T, e);
    // ----- prerez -----
    prerez(T, e);
    // ----- podlaga in senca -----
    podlaga(T, e);
    osi(T);
    // ----- prosojnost -----
    // izklopljeno: neprosojno telo, skriti robovi črtkano (kot v učbeniku);
    // vklopljeno: prosojne ploskve, vsi robovi vidni (robove rišemo prej, ploskve jih le obarvajo)
    const pro = S.prosojno;
    RJ.uSteklo.value = pro ? 1 : 0; RJ.uAOw.value = 0.07 / s; RJ.uOdt.value = Math.min(1, e * 4);
    for (const [m, neprosojna, steklo] of BARVE) { m.color.set(pro ? steklo : neprosojna); m.depthWrite = !pro; m.roughness = pro ? 0.15 : 0.4; m.clearcoat = pro ? 0.8 : 0.3; }
    mTla.uniforms.uMoc.value = pro ? 0.45 : 1;
    robovi.renderOrder = oglisca.renderOrder = konV.renderOrder = pro ? -1 : 3;
    skrite.visible = !pro; konS.visible = !pro && konN > 0;
    // ----- deli -----
    deliSeznam = sestaviDele(T, e);
    api.deli = deliSeznam;
  }

  // razreže daljice (zaporedne se lahko nadaljujejo) na črtice dolžine delez·perioda
  function crtkaj(seg, n, geo, perioda, delez) {
    const P = geo.attributes.position.array, max = P.length / 6, crt = perioda * delez;
    let k = 0, f = 0, px = NaN, py = 0, pz = 0; // f: lega v periodi [0, perioda)
    for (let i = 0; i < n && k < max; i++) {
      const o = i * 6, ax = seg[o], ay = seg[o + 1], az = seg[o + 2], bx = seg[o + 3], by = seg[o + 4], bz = seg[o + 5];
      if (!(Math.abs(ax - px) + Math.abs(ay - py) + Math.abs(az - pz) < 1e-9)) f = 0;
      px = bx; py = by; pz = bz;
      const L = Math.hypot(bx - ax, by - ay, bz - az); if (!(L > 1e-12) || !(perioda > 0)) continue;
      let t = 0;
      for (let varn = 0; t < L && k < max && varn < 100000; varn++) {
        const crta = f < crt, meja = crta ? crt : perioda;
        const t2 = Math.min(L, t + Math.max(0, meja - f));
        if (crta && t2 > t) { const u = t / L, w = t2 / L; P[k * 6] = ax + (bx - ax) * u; P[k * 6 + 1] = ay + (by - ay) * u; P[k * 6 + 2] = az + (bz - az) * u; P[k * 6 + 3] = ax + (bx - ax) * w; P[k * 6 + 4] = ay + (by - ay) * w; P[k * 6 + 5] = az + (bz - az) * w; k++; }
        f += t2 - t;
        if (t2 >= L) break;
        t = t2; f = crta ? crt : 0; // dosegli smo mejo črtice ali periode
      }
    }
    geo.setDrawRange(0, k * 2); geo.attributes.position.needsUpdate = true; geo.computeBoundingSphere();
  }
  function postaviCev(im, i, a, b, r) {
    _d.subVectors(b, a); const L = _d.length();
    if (L < 1e-9) { _m.makeScale(0, 0, 0); im.setMatrixAt(i, _m); return; }
    _q.setFromUnitVectors(Y, _d.divideScalar(L));
    _c.addVectors(a, b).multiplyScalar(0.5);
    _m.compose(_c, _q, _sk.set(r, L, r)); im.setMatrixAt(i, _m);
  }
  function postaviProxy(m, a, b, r) {
    if (!a) { m.visible = false; return; }
    m.visible = true; _d.subVectors(b, a); const L = Math.max(1e-6, _d.length());
    m.quaternion.setFromUnitVectors(Y, _d.divideScalar(L)); m.position.addVectors(a, b).multiplyScalar(0.5); m.scale.set(r, L, r);
  }

  // svet (enote prizora) iz cm
  const vSvet = (p, out) => out.copy(p).sub(sred).multiplyScalar(s);
  const tockaSvet = (p) => { const q = vSvet(p, new Vector3()); return [q.x, q.y, q.z]; };

  let konN = 0;
  const kon = [];
  function sestaviNapise(T, e) {
    for (const sp of napisi.values()) sp.visible = false;
    pika.visible = false;
    kon.length = 0; T.napisi = [];
    const nap = (glavno, pod, p, smer, alfa = 1, barva) => T.napisi.push({ glavno, pod, p: p.clone(), smer: smer ? smer.clone().normalize() : null, alfa, barva });
    const naF = (i, p) => p.clone().applyMatrix4(T.F[i].M);
    const smerF = (i, d) => d.clone().transformDirection(T.F[i].M);
    const prx = T.proxy = {};
    const vr = T.vrsta;
    if (POLIEDRI.has(vr)) {
      const bot = T.F[0].p, nb = bot.length; // spodnja ploskev je koren mreže in se ne premika
      let ib = 0; for (let i = 1; i < nb; i++) if (bot[i].z + bot[(i + 1) % nb].z > bot[ib].z + bot[(ib + 1) % nb].z + 1e-9) ib = i;
      const sr = bot[ib].clone().add(bot[(ib + 1) % nb]).multiplyScalar(0.5);
      nap("a", "", sr, V(sr.x, 0, sr.z).normalize().add(V(0, -0.35, 0)));
      const t = T.obseg, kjePl = (orig) => T.red.indexOf(orig);
      if (vr === "paralelepiped") {
        nap("b", "", t[1].clone().add(t[3]).multiplyScalar(0.5), V(1, -0.35, 0));
        const kc = kjePl(5); // desna stranska ploskev
        nap("c", "", naF(kc, t[1].clone().add(t[5]).multiplyScalar(0.5)), smerF(kc, V(1, 0, 0.4)));
        if (e < 0.04) { const c1 = t[4].clone(), c0 = V(c1.x, 0, c1.z); kon.push([c0, c1]); prx.visina = [c0, c1]; nap("v", "", c0.clone().lerp(c1, 0.55), V(-1, 0, 0.3), 1 - e * 25); }
      }
    } else if (!T.plasc && !T.krogla) {
      const n = T.B.length, B0 = T.B[T.k0], B1 = T.B[(T.k0 + 1) % n];
      const sr = B0.clone().add(B1).multiplyScalar(0.5);
      const ven = V(sr.x, 0, sr.z).normalize().add(V(0, -0.35, 0));
      const imeA = vr === "prisekana" ? ["a", "1"] : ["a", ""];
      nap(imeA[0], imeA[1], sr, ven);
      if (vr === "kvader") { // rob b: osnovni rob ob desni strani (vzdolž z)
        let ib = 0; for (let i = 0; i < n; i++) { const c = T.B[i].x + T.B[(i + 1) % n].x; if (c > T.B[ib].x + T.B[(ib + 1) % n].x) ib = i; }
        const q = T.B[ib].clone().add(T.B[(ib + 1) % n]).multiplyScalar(0.5); nap("b", "", q, V(1, -0.35, 0));
      }
      if (T.T) { // prizme in prisekana piramida: stranski rob / zgornji rob na sprednji ploskvi
        const Fs = T.F[T.iSpr]; // [B0, B1, T1, T0] po usmerjanju morda obrnjeno
        const pts = Fs.p; let iv = -1, best = -Infinity;
        for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if (Math.abs(a.y - b.y) > 1e-9) { const x = a.x + b.x; if (x > best) { best = x; iv = i; } } }
        const a = pts[iv], b = pts[(iv + 1) % pts.length];
        const sre = a.clone().add(b).multiplyScalar(0.5);
        if (vr !== "prisekana") {
          nap(vr === "kvader" ? "c" : vr === "kocka" ? "a" : "v", "", naF(T.iSpr, sre), smerF(T.iSpr, V(1, 0, 0.3)));
          prx.visina = [naF(T.iSpr, a), naF(T.iSpr, b)];
        } else {
          const T0 = T.T[T.k0], T1 = T.T[(T.k0 + 1) % n], zg = T0.clone().add(T1).multiplyScalar(0.5);
          nap("a", "2", naF(T.iSpr, zg), smerF(T.iSpr, V(0, 0.6, 1)));
          const vsA = naF(T.iSpr, sr), vsB = naF(T.iSpr, zg);
          kon.push([vsA, vsB]); prx.stranska = [vsA, vsB];
          nap("v", "s", vsA.clone().lerp(vsB, 0.4), smerF(T.iSpr, B1.clone().sub(B0)));
          if (e < 0.04) { const c0 = V(0, 0, 0), c1 = V(0, T.H, 0); kon.push([c0, c1]); prx.visina = [c0, c1]; nap("v", "", V(0, T.H * 0.62, 0), V(-1, 0, -0.7), 1 - e * 25); }
        }
      } else { // piramide
        const vrh = naF(T.iSpr, T.vrh);
        const vsA = naF(T.iSpr, sr);
        kon.push([vsA, vrh.clone()]); prx.stranska = [vsA, vrh.clone()];
        nap("v", "s", vsA.clone().lerp(vrh, 0.38), smerF(T.iSpr, B1.clone().sub(B0)));
        if (e < 0.04) { const c0 = V(0, 0, 0), c1 = T.vrh.clone(); kon.push([c0, c1]); prx.visina = [c0, c1]; nap("v", "", V(0, T.H * 0.62, 0), V(-1, 0, -0.7), 1 - e * 25); prx.vrh = c1; }
      }
    } else if (T.plasc) {
      const pl = T.plasc;
      const f = Math.PI / 4, rp = V(pl.r1 * Math.sin(f), 0, pl.r1 * Math.cos(f));
      kon.push([V(0, 0, 0), rp.clone()]); prx.polmer = [V(0, 0, 0), rp.clone()];
      nap("r", vr === "prisekan" ? "1" : "", rp.clone().multiplyScalar(0.5), V(Math.sin(f + Math.PI / 2), -0.5, Math.cos(f + Math.PI / 2)));
      const g0 = plascTocka(pl, 0.5, 0, e, new Vector3()), g1 = plascTocka(pl, 0.5, 1, e, new Vector3());
      kon.push([g0, g1]);
      if (vr === "valj") { prx.visina = [g0, g1]; nap("v", "", g0.clone().lerp(g1, 0.5), V(1, 0, 0.25)); }
      else {
        prx.stranska = [g0, g1]; nap("s", "", g0.clone().lerp(g1, 0.5), V(1, 0.3, 0.2));
        if (e < 0.04) { const c1 = V(0, pl.v, 0); kon.push([V(0, 0, 0), c1]); prx.visina = [V(0, 0, 0), c1]; nap("v", "", V(0, pl.v * 0.62, 0), V(-1, 0, -0.7), 1 - e * 25); }
        if (vr === "stozec") prx.vrh = plascTocka(pl, 0, 1, e, new Vector3());
      }
      if (vr === "prisekan") {
        const a = naF(1, V(0, pl.v, 0)), b = naF(1, V(pl.r2 * Math.sin(-f), pl.v, pl.r2 * Math.cos(-f)));
        kon.push([a, b]); prx.polmer2 = [a, b]; nap("r", "2", a.clone().lerp(b, 0.5), smerF(1, V(-Math.cos(f), 0.8, Math.sin(f))));
      }
      if (vr === "valj" && e > 0.35) { // dolžina pravokotnika v mreži
        const p = plascTocka(pl, -0.5, 0, e, new Vector3());
        nap("2πr", "", p, V(0, 0.3, 1), Math.min(1, (e - 0.35) * 4));
      }
    } else {
      const r = T.krogla, C = V(0, r, 0), f = Math.PI / 4, rp = V(r * Math.sin(f), r, r * Math.cos(f));
      kon.push([C.clone(), rp.clone()]); prx.polmer = [C.clone(), rp.clone()]; prx.sredisce = C.clone();
      nap("r", "", C.clone().lerp(rp, 0.5), V(Math.sin(f + Math.PI / 2), 0.6, Math.cos(f + Math.PI / 2)));
      nap("S", "", C.clone(), V(-1, 0.4, 0), 1, "#7CE0B5");
      vSvet(C, pika.position); pika.visible = true;
    }
    if (kroglePrikazane(T, e)) { // včrtana in očrtana krogla pravilnega telesa: polmera r in R
      const C = kroglaSredisce(T), t = T.F.flatMap((F) => F.p);
      let iv = 0; for (let i = 1; i < t.length; i++) if (t[i].z - t[i].y * 0.2 > t[iv].z - t[iv].y * 0.2) iv = i;
      const ogl = t[iv].clone(), dotik = V(0, 0, 0);
      kon.push([C.clone(), ogl.clone()], [C.clone(), dotik.clone()]); prx.polmer = [C.clone(), ogl]; prx.polmer2 = [C.clone(), dotik]; prx.sredisce = C.clone();
      nap("R", "", C.clone().lerp(ogl, 0.55), V(0.3, 0.5, 1));
      nap("r", "", C.clone().lerp(dotik, 0.5), V(-1, 0, 0.6), 1, "#7CE0B5");
      nap("S", "", C.clone(), V(-1, 0.4, 0), 1, "#7CE0B5");
      vSvet(C, pika.position); pika.visible = true;
    }
    // pomožne črte (dve podobi: vidna polna, skrita črtkana)
    konN = Math.min(16, kon.length);
    const ks = [], debKon = (visoka ? 0.0034 : 0.0042) / s;
    for (let i = 0; i < konN; i++) { const [a, b] = kon[i]; ks.push(a.x, a.y, a.z, b.x, b.y, b.z); postaviCev(konV, i, a, b, debKon); }
    konV.count = konN; konV.instanceMatrix.needsUpdate = true; konV.computeBoundingSphere?.();
    crtkaj(ks, konN, konSGeo, 0.03 / s, 0.55);
    konV.visible = konS.visible = konN > 0;
    // sprite
    const stej = new Map();
    for (const o of T.napisi) {
      const kl = o.glavno + o.pod, n = stej.get(kl) || 0; stej.set(kl, n + 1);
      const sp = napis(o.glavno, o.pod, o.barva || "#FFFFFF", o.barva || "#6E9BFF", n);
      sp.visible = o.alfa > 0.02; sp.material.opacity = Math.max(0, Math.min(1, o.alfa));
      vSvet(o.p, sp.position);
      if (o.smer) sp.position.addScaledVector(o.smer, 0.095);
    }
    // ročaji
    const rp = 0.035 / s;
    for (const k of Object.keys(proxyCev)) { const v = prx[k]; postaviProxy(proxyCev[k], v && v[0], v && v[1], rp); }
    for (const k of Object.keys(proxyKr)) { const v = prx[k]; proxyKr[k].visible = !!v; if (v) { proxyKr[k].position.copy(v); proxyKr[k].scale.setScalar(0.05 / s); } }
  }

  // ---------- podlaga ----------
  // Krog na ravnini y = 0 (spodnja ploskev telesa), ki ostane v krogli s polmerom 1. Senca je navpična projekcija
  // vseh ploskev (mehko zamegljena) in ostrejši stik tam, kjer telo leži na podlagi.
  function podlaga(T, e) {
    const yb = -sred.y * s, rs = Math.min(0.95, Math.sqrt(Math.max(0.04, 0.97 * 0.97 - yb * yb))), R = rs / s;
    tla.position.set(sred.x, -0.0015 / s, sred.z); tla.scale.set(R, 1, R);
    const u = mTla.uniforms; u.uC.value.set(sred.x, sred.z); u.uR.value = R;
    korakTal = s >= 0.04 ? 1 : 5; u.uKorak.value = korakTal; u.uVelik.value = korakTal === 1 ? 5 : 10;
    const g = obrisPlatno.getContext("2d"), h = sencaPlatno.getContext("2d");
    if (!g || !h) { sencaTex.needsUpdate = true; return; }
    const px = (x) => ((x - sred.x) / (2 * R) + 0.5) * TS, pz = (z) => ((z - sred.z) / (2 * R) + 0.5) * TS;
    const obris = (samoStik) => {
      g.clearRect(0, 0, TS, TS); g.fillStyle = "#000";
      if (T.krogla) { if (!samoStik) { g.beginPath(); g.arc(px(0), pz(0), (0.75 * T.krogla) / (2 * R) * TS, 0, 2 * Math.PI); g.fill(); } return; }
      for (const F of T.F) {
        let stik = true; g.beginPath();
        F.p.forEach((q, i) => { _a.copy(q).applyMatrix4(F.M); if (Math.abs(_a.y) > 1e-3 * D) stik = false; i ? g.lineTo(px(_a.x), pz(_a.z)) : g.moveTo(px(_a.x), pz(_a.z)); });
        if (!samoStik || stik) g.fill();
      }
      if (T.plasc && !samoStik) {
        const pl = T.plasc, Nu = 64, Nw = Math.max(1, pl.Nw >> 1);
        for (let j = 0; j < Nw; j++) for (let i = 0; i < Nu; i++) {
          g.beginPath();
          for (const [di, dj] of [[0, 0], [1, 0], [1, 1], [0, 1]]) { plascTocka(pl, -1 + (2 * (i + di)) / Nu, (j + dj) / Nw, e, _a); di + dj ? g.lineTo(px(_a.x), pz(_a.z)) : g.moveTo(px(_a.x), pz(_a.z)); }
          g.closePath(); g.fill(); g.stroke();
        }
      }
    };
    h.clearRect(0, 0, TS, TS);
    const OD = TS * 4; // senco narišemo z zamikom, obris pa izven platna (shadowBlur deluje v vseh brskalnikih)
    for (const [samoStik, blur, alfa] of [[false, 22, 0.42], [true, 6, 0.38]]) {
      obris(samoStik);
      h.save(); h.shadowColor = `rgba(0,0,0,${alfa})`; h.shadowBlur = blur; h.shadowOffsetX = OD; h.drawImage(obrisPlatno, -OD, 0); h.restore();
    }
    sencaTex.needsUpdate = true;
  }

  // ---------- koordinatni sistem ----------
  let osInfo = null; // { mere: [x, y, z], korak }
  const osiTocka = new Vector3();
  function osi(T) {
    // tloris zloženega telesa (mreža se razpira po podlagi, sistem ostane, kjer je)
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    if (T.krogla || T.plasc || !(T.obseg || T.B)) { const r = T.krogla || T.r1; x0 = z0 = -r; x1 = z1 = r; }
    else for (const p of T.obseg || T.B) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z); }
    // pravokotna osnovna ploskev: izhodišče v kotu (oglišče telesa); sicer v središču osnovne ploskve
    const kot = ["kocka", "kvader", "piramida4", "prisekana"].includes(T.vrsta);
    const O = kot ? V(x0, 0, z0) : V(0, 0, 0), smeri = [V(0, 0, 1), V(1, 0, 0), Y];
    const mere = [z1 - O.z, x1 - O.x, T.H]; // do kod seže telo po x (proti gledalcu), y (v desno) in z (navzgor)
    // osi na podlagi segajo do roba kroga (polmer R okrog središča sred)
    const R = tla.scale.x, cx = sred.x - O.x, cz = sred.z - O.z;
    const tetiva = (d, r) => { const b = d.x * cx + d.z * cz, q = b * b - (cx * cx + cz * cz) + r * r; return q < 0 ? null : [b - Math.sqrt(q), b + Math.sqrt(q)]; };
    const u = 1 / s; // ena enota prizora v cm
    // vrh osi z: nad telesom, a v krogli prizora (polmer 1)
    const zMeja = sred.y + Math.sqrt(Math.max(0, (1.0 * u) ** 2 - (O.x - sred.x) ** 2 - (O.z - sred.z) ** 2));
    const konci = [0, 1].map((i) => {
      const t = tetiva(smeri[i], 0.88 * R), t2 = tetiva(smeri[i], 0.97 * R);
      if (!t) return [0, mere[i] + 0.16 * u];
      return [Math.min(-0.04 * u, t[0]), Math.min(t2 ? t2[1] : t[1], Math.max(t[1], mere[i] + 0.16 * u))];
    });
    konci.push([0, Math.min(zMeja, Math.max(T.H + 0.2 * u, T.H * 1.12))]);
    // korak številk: ~4–5 številk na najdaljši osi, večkratnik kvadratka podlage
    const dolg = Math.max(...konci.map((k) => k[1]));
    const korak = [1, 2, 5, 10, 20, 50, 100].find((k) => k % korakTal === 0 && dolg / k <= 5.5) ?? 100;
    osInfo = { mere, korak, kot }; osiTocka.copy(O).addScaledVector(Y, Math.min(konci[2][1] * 0.8, T.H + 0.08 * u));

    const rOs = (visoka ? 0.0032 : 0.0042) * u, lKon = 0.055 * u, rKon = 0.016 * u;
    let nc = 0, nn = 0;
    const cev = (a, b, r, barva) => {
      if (nc >= osiCev.instanceMatrix.count) return;
      _d.subVectors(b, a); const L = Math.max(1e-6, _d.length());
      _q.setFromUnitVectors(Y, _d.divideScalar(L));
      _m.compose(_c.addVectors(a, b).multiplyScalar(0.5), _q, _sk.set(r, L, r));
      osiCev.setMatrixAt(nc, _m); osiCev.setColorAt(nc, barva); nc++;
    };
    // pri izhodišču v kotu osi tečejo po robovih telesa, zato so številke vidne skozi (kot skriti robovi v učbeniku);
    // pri izhodišču v središču bi tekle čez telo, zato jih telo zakrije
    const napisOs = (besedilo, barva, p, vis, ime = false, skozi = ime || kot) => {
      let sp = osNapisi[nn];
      if (!sp) { sp = new THREE.Sprite(); sp.renderOrder = 9; telo.add(sp); osNapisi.push(sp); }
      sp.material = osMaterial(besedilo, barva, ime, skozi); sp.visible = true;
      const h = vis * u; sp.scale.set(h * sp.material.userData.razmerje, h, 1); sp.position.copy(p); nn++;
    };
    // odmik številk od osi: x levo od osi, y za osjo, z levo od osi
    const odmik = [V(-1, 0, 0), V(0, 0, -1), V(-0.7, 0, -0.7)].map((v) => v.multiplyScalar(0.085 * u));
    const SV = "#E8EEFF";
    for (let i = 0; i < 3; i++) {
      const d = smeri[i], [ta, tb] = konci[i], barva = OS_BARVE[i];
      const A = O.clone().addScaledVector(d, ta), B = O.clone().addScaledVector(d, tb - lKon * 0.6);
      cev(A, B, rOs, barva);
      _m.compose(_c.copy(O).addScaledVector(d, tb - lKon / 2), _q.setFromUnitVectors(Y, d), _sk.set(rKon, lKon, rKon));
      osiKon.setMatrixAt(i, _m); osiKon.setColorAt(i, barva);
      // ime osi za puščico; če bi tam segalo iz krogle prizora (kamera jo zajame, npr. z pri krogli), na drugi strani puščice
      let pIme = O.clone().addScaledVector(d, tb + 0.09 * u).add(i === 2 ? V(0, 0.02 * u, 0) : V(0, 0.03 * u, 0));
      if (pIme.distanceTo(sred) * s > 0.92) pIme = O.clone().addScaledVector(d, tb - lKon / 2).add(odmik[i].clone().multiplyScalar(-1.3)); // nasproti številk
      napisOs(["x", "y", "z"][i], OS_HEX[i], pIme, 0.13, true);
      // črtica pravokotno na os (na podlagi v ravnini podlage, na osi z vodoravno)
      const pr = i === 0 ? V(1, 0, 0) : i === 1 ? V(0, 0, 1) : V(1, 0, 0);
      const crtica = (t, dl, b) => { const p = O.clone().addScaledVector(d, t); cev(p.clone().addScaledVector(pr, -dl), p.clone().addScaledVector(pr, dl), rOs * 0.9, b); };
      const m = mere[i], blizu = (t) => Math.abs(t - m) < 0.6 * korak;
      for (let t = korak; t < tb - lKon * 1.2; t += korak) {
        if (blizu(t) && m <= tb - 0.5 * lKon) continue;
        crtica(t, 0.016 * u, barva);
        napisOs(st(t, 0), SV, O.clone().addScaledVector(d, t).add(odmik[i]).add(V(0, 0.012 * u, 0)), 0.1);
      }
      // konec telesa: poudarjena črtica in mera (če je še na osi; npr. krogla sega čez majhno podlago)
      if (m > tb - 0.5 * lKon) continue;
      crtica(m, 0.03 * u, barva);
      napisOs(st(m, Number.isInteger(Math.round(m * 10) / 10) ? 0 : 1), OS_HEX[i], O.clone().addScaledVector(d, m).add(odmik[i].clone().multiplyScalar(1.15)).add(V(0, 0.012 * u, 0)), 0.115, false, true);
    }
    napisOs("0", SV, O.clone().add(V(-0.055 * u, 0.012 * u, -0.055 * u)), 0.1);
    osiCev.count = nc; osiCev.instanceMatrix.needsUpdate = true; if (osiCev.instanceColor) osiCev.instanceColor.needsUpdate = true;
    osiKon.count = 3; osiKon.instanceMatrix.needsUpdate = true; if (osiKon.instanceColor) osiKon.instanceColor.needsUpdate = true;
    for (const m of [osiCev, osiKon]) { m.computeBoundingSphere?.(); m.computeBoundingBox?.(); }
    for (let i = nn; i < osNapisi.length; i++) osNapisi[i].visible = false;
  }

  // ---------- prerez z ravnino ----------
  function ravninaZdaj(T, n, tocka) {
    const al = (S.nagib * Math.PI) / 180, ze = (S.zasuk * Math.PI) / 180;
    n.set(Math.sin(al) * Math.sin(ze), Math.cos(al), Math.sin(al) * Math.cos(ze)).normalize();
    const eps = 0.01; tocka.set(0, T.H * (eps + S.lega * (1 - 2 * eps)), 0);
  }
  function znotraj(T, p) {
    const y = p.y, rr = Math.hypot(p.x, p.z), t = 1e-9;
    if (T.krogla) return p.x * p.x + (y - T.krogla) ** 2 + p.z * p.z <= T.krogla * T.krogla + t;
    if (y < -t || y > T.H + t) return false;
    const pl = T.plasc; return rr <= pl.r1 + (pl.r2 - pl.r1) * (y / pl.v) + t;
  }
  function imeMnogokotnika(pt, e1, e2) {
    const n = pt.length, Lst = [], kot = [];
    for (let i = 0; i < n; i++) Lst.push(pt[i].distanceTo(pt[(i + 1) % n]));
    const L0 = Math.max(...Lst), enako = (a, b) => Math.abs(a - b) < 1e-6 * L0;
    const vek = (i) => _a.subVectors(pt[(i + 1) % n], pt[i]).normalize().clone();
    const ds = pt.map((_, i) => vek(i));
    for (let i = 0; i < n; i++) kot.push(-ds[(i + n - 1) % n].dot(ds[i]));
    const vzpor = (i, j) => Math.abs(Math.abs(ds[i].dot(ds[j])) - 1) < 1e-7;
    if (n === 3) {
      if (enako(Lst[0], Lst[1]) && enako(Lst[1], Lst[2])) return "enakostranični trikotnik";
      if (kot.some((c) => Math.abs(c) < 1e-7)) return enako(Lst[0], Lst[1]) || enako(Lst[1], Lst[2]) || enako(Lst[0], Lst[2]) ? "enakokraki pravokotni trikotnik" : "pravokotni trikotnik";
      if (enako(Lst[0], Lst[1]) || enako(Lst[1], Lst[2]) || enako(Lst[0], Lst[2])) return "enakokraki trikotnik";
      return "trikotnik";
    }
    if (n === 4) {
      const pravi = kot.every((c) => Math.abs(c) < 1e-7), vsiE = Lst.every((x) => enako(x, Lst[0]));
      const p1 = vzpor(0, 2), p2 = vzpor(1, 3);
      if (pravi && vsiE) return "kvadrat";
      if (pravi) return "pravokotnik";
      if (vsiE) return "romb";
      if (p1 && p2) return "paralelogram";
      if (p1) return enako(Lst[1], Lst[3]) ? "enakokraki trapez" : "trapez";
      if (p2) return enako(Lst[0], Lst[2]) ? "enakokraki trapez" : "trapez";
      return "štirikotnik";
    }
    const imena = { 5: "petkotnik", 6: "šestkotnik", 7: "sedemkotnik", 8: "osemkotnik", 9: "devetkotnik", 10: "desetkotnik" };
    if (imena[n] && Lst.every((x) => enako(x, Lst[0])) && kot.every((c) => Math.abs(c - kot[0]) < 1e-7)) return "pravilni " + imena[n];
    return imena[n] || "mnogokotnik";
  }
  const nP = new Vector3(), pP = new Vector3();
  function prerez(T, e) {
    const vkl = S.prerez && e < 1e-4;
    prerezInfo = null;
    for (const m of klipani) m.material.clippingPlanes = null;
    for (const m of [robovi, oglisca, skrite, konV, konS]) m.material.clippingPlanes = null;
    mVcrt.clippingPlanes = mOcrt.clippingPlanes = null;
    prerezM.visible = ravnina.visible = osnD.visible = plD.visible = false; prerezRob.count = 0;
    if (!vkl) return;
    ravninaZdaj(T, nP, pP);
    const d = nP.dot(pP);
    lokKlip.set(_a.copy(nP).negate(), d); lokDuh.set(nP, -d);
    for (const mat of [mOsnF, mOsnB, mPlF, mPlB, mRob, mSkrit, mKonV, mKonS, mVcrt, mOcrt]) mat.clippingPlanes = klipi;
    osnD.visible = osnB.visible; plD.visible = true;
    // baza ravnine
    const e1 = new Vector3(), e2 = new Vector3();
    e1.copy(Math.abs(nP.y) < 0.99 ? Y : V(1, 0, 0)).cross(nP).normalize(); e2.crossVectors(nP, e1);
    let pts = [], ime = "", plos = 0;
    if (!T.plasc && !T.krogla) {
      const robs = []; for (const F of T.F) for (let i = 0; i < F.p.length; i++) robs.push([F.p[i], F.p[(i + 1) % F.p.length]]);
      for (const [a, b] of robs) {
        const da = nP.dot(a) - d, db = nP.dot(b) - d;
        if (Math.abs(da) < 1e-9) pts.push(a.clone());
        if (Math.abs(db) < 1e-9) pts.push(b.clone());
        if (da * db < 0 && Math.abs(da) > 1e-9 && Math.abs(db) > 1e-9) pts.push(a.clone().lerp(b, da / (da - db)));
      }
      const u = []; for (const p of pts) if (!u.some((q) => q.distanceToSquared(p) < 1e-14)) u.push(p);
      pts = u;
    } else if (T.krogla) {
      const C = V(0, T.krogla, 0), dist = nP.dot(C) - d, rho = Math.sqrt(Math.max(0, T.krogla ** 2 - dist * dist));
      const c = C.clone().addScaledVector(nP, -dist);
      for (let i = 0; i < NS; i++) { const f = (2 * Math.PI * i) / NS; pts.push(c.clone().addScaledVector(e1, rho * Math.cos(f)).addScaledVector(e2, rho * Math.sin(f))); }
      ime = Math.abs(dist) < 1e-9 ? "krog (glavni krog)" : "krog"; plos = Math.PI * rho * rho; T.rhoPrereza = rho;
    } else {
      const pl = T.plasc, Rmax = 4 * (pl.r1 + pl.v);
      for (let i = 0; i < NS; i++) {
        const f = (2 * Math.PI * i) / NS; _d.copy(e1).multiplyScalar(Math.cos(f)).addScaledVector(e2, Math.sin(f));
        let lo = 0, hi = Rmax;
        for (let k = 0; k < 42; k++) { const mid = (lo + hi) / 2; if (znotraj(T, _c.copy(pP).addScaledVector(_d, mid))) lo = mid; else hi = mid; }
        pts.push(pP.clone().addScaledVector(_d, lo));
      }
      // natančni vogali: presečišča ravnine z robnima krožnicama in vrh
      for (const [yb, rb] of [[0, pl.r1], [pl.v, pl.r2]]) {
        if (rb <= 0) continue;
        const q = d - nP.y * yb, m = Math.hypot(nP.x, nP.z);
        if (m < 1e-9 || Math.abs(q) / m > rb) continue;
        const fx = (nP.x * q) / (m * m), fz = (nP.z * q) / (m * m), h = Math.sqrt(Math.max(0, rb * rb - (q * q) / (m * m)));
        pts.push(V(fx - (nP.z / m) * h, yb, fz + (nP.x / m) * h), V(fx + (nP.z / m) * h, yb, fz - (nP.x / m) * h));
      }
      if (pl.tip === "stozec" && Math.abs(nP.dot(pl.vrh) - d) < 1e-9) pts.push(pl.vrh.clone());
    }
    if (pts.length < 3) return;
    // uredi po kotu okoli težišča
    const c = sredisce(pts, new Vector3());
    pts.sort((p, q) => Math.atan2(_a.subVectors(p, c).dot(e2), _a.dot(e1)) - Math.atan2(_b.subVectors(q, c).dot(e2), _b.dot(e1)));
    { const u = [pts[0]]; for (let i = 1; i < pts.length; i++) if (pts[i].distanceToSquared(u[u.length - 1]) > 1e-14) u.push(pts[i]); if (u.length > 2 && u[0].distanceToSquared(u[u.length - 1]) < 1e-14) u.pop(); pts = u; }
    if (pts.length < 3) return;
    let A2 = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; A2 += _a.subVectors(p, c).dot(e1) * _b.subVectors(q, c).dot(e2) - _a.dot(e2) * _b.dot(e1); }
    if (!plos) plos = Math.abs(A2) / 2;
    if (!T.plasc && !T.krogla) ime = imeMnogokotnika(pts, e1, e2);
    else if (T.plasc) {
      const pl = T.plasc, al = S.nagib, ymin = Math.min(...pts.map((p) => p.y)), ymax = Math.max(...pts.map((p) => p.y));
      const naDnu = ymin < 1e-6, naVrhu = ymax > pl.v - 1e-6 && pl.r2 > 0;
      const gama = pl.tip === "valj" ? 90 : (Math.atan2(pl.Hv, pl.r1) * 180) / Math.PI;
      if (al === 0) { ime = "krog"; const rr = pl.r1 + (pl.r2 - pl.r1) * (pP.y / pl.v); plos = Math.PI * rr * rr; }
      else if (al === 90) ime = pl.tip === "valj" ? "pravokotnik (osni presek)" : pl.tip === "stozec" ? "enakokraki trikotnik (osni presek)" : "enakokraki trapez (osni presek)";
      else if (pl.tip !== "valj" && Math.abs(al - gama) < 0.5) { // drsnik ima korak 1°, zato tudi skoraj vzporedno ravnino imenujemo parabola, a povemo
        const prib = Math.abs(al - gama) > 1e-6 ? " (približno: ravnina je skoraj vzporedna s stranico)" : "";
        ime = (pl.tip === "stozec" ? "odsek parabole" : "lik, omejen z lokom parabole") + prib;
      }
      else if (al > gama) ime = pl.tip === "stozec" ? "odsek hiperbole" : "lik, omejen z lokom hiperbole";
      else if (naDnu || naVrhu) ime = "del elipse";
      else {
        ime = "elipsa";
        if (pl.tip === "valj") plos = (Math.PI * pl.r1 * pl.r1) / Math.cos((al * Math.PI) / 180);
      }
    }
    prerezInfo = { ime, S: plos };
    // trikotniki (pahljača iz težišča), uv za šrafuro (stalna gostota na zaslonu)
    const P = capGeo.attributes.position.array, N = capGeo.attributes.normal.array, UV = capGeo.attributes.uv.array;
    const gost = s / 0.085; let k = 0, ku = 0; // ena črta na 0,06 enote prizora (≈ 10 px pri 360 px širine)
    const np = Math.min(pts.length, NS + 15);
    for (let i = 0; i < np; i++) {
      const a = pts[i], b = pts[(i + 1) % np];
      for (const p of [c, a, b]) { P[k] = p.x; P[k + 1] = p.y; P[k + 2] = p.z; N[k] = nP.x; N[k + 1] = nP.y; N[k + 2] = nP.z; k += 3; UV[ku++] = p.dot(e1) * gost; UV[ku++] = p.dot(e2) * gost; }
    }
    capGeo.setDrawRange(0, k / 3); capGeo.attributes.position.needsUpdate = capGeo.attributes.normal.needsUpdate = capGeo.attributes.uv.needsUpdate = true; capGeo.computeBoundingSphere();
    prerezM.visible = true;
    const deb = (visoka ? 0.005 : 0.006) / s;
    for (let i = 0; i < np; i++) postaviCev(prerezRob, i, pts[i], pts[(i + 1) % np], deb);
    prerezRob.count = np; prerezRob.instanceMatrix.needsUpdate = true; prerezRob.computeBoundingSphere?.();
    T.prerezSred = c.clone();
    // prikaz ravnine: kvadrat, ki ostane v krogli s polmerom 1
    const cw = vSvet(pP, new Vector3());
    const blizu = nP.clone().multiplyScalar(cw.dot(nP)); // točka ravnine, najbližja središču prizora
    const hw = Math.sqrt(Math.max(0.01, (0.97 * 0.97 - blizu.lengthSq()) / 2));
    const hcm = Math.min(hw, 0.78) / s;
    ravnina.position.copy(blizu).divideScalar(s).add(sred);
    ravnina.quaternion.setFromUnitVectors(V(0, 0, 1), nP);
    ravnina.scale.setScalar(hcm); ravnina.visible = true;
  }

  // ---------- besedila ----------
  function mere() {
    const vr = S.telo, a = S.m1, v = S.m2, top = Math.min(S.m3, S.m1 - 0.5);
    const zg = T && T.zgOmejen ? " (zgornji mora biti manjši od spodnjega, zato je skrajšan)" : "";
    switch (vr) {
      case "kocka": return `a = ${cm(a)}`;
      case "kvader": return `a = ${cm(a)}, b = ${cm(S.m3)}, c = ${cm(v)}`;
      case "prizma3": case "prizma6": return `a = ${cm(a)}, v = ${cm(v)}`;
      case "piramida3": return `a = ${cm(a)}, v = ${cm(v)}, vₛ = ${cm(Math.hypot(v, (a * Math.sqrt(3)) / 6))}`;
      case "piramida4": return `a = ${cm(a)}, v = ${cm(v)}, vₛ = ${cm(Math.hypot(v, a / 2))}`;
      case "valj": return `r = ${cm(a)}, v = ${cm(v)}`;
      case "stozec": return `r = ${cm(a)}, v = ${cm(v)}, s = ${cm(Math.hypot(a, v))}`;
      case "krogla": return `r = ${cm(a)}, premer d = ${cm(2 * a)}`;
      case "prisekana": return `a₁ = ${cm(a)}, a₂ = ${cm(top)}, v = ${cm(v)}, vₛ = ${cm(Math.hypot(v, (a - top) / 2))}${zg}`;
      case "prisekan": return `r₁ = ${cm(a)}, r₂ = ${cm(top)}, v = ${cm(v)}, s = ${cm(Math.hypot(v, a - top))}${zg}`;
      case "paralelepiped": { const k = paralelepipedKolicine(S.a, S.b, S.c, S.alfa, S.fi); return `a = ${cm(S.a)}, b = ${cm(S.b)}, c = ${cm(S.c)}, α = ${S.alfa}°, φ = ${S.fi}°; višina v = c · sin φ = ${cm(k.v)}`; }
    }
    if (PRAVILNA[vr]) return `a = ${cm(a)}; vsi robovi so enako dolgi`;
    return "";
  }
  function kolicine() {
    const vr = S.telo, a = S.m1, v = S.m2, top = Math.min(S.m3, S.m1 - 0.5), PI = Math.PI, k3 = Math.sqrt(3);
    switch (vr) {
      case "kocka": return { V: ["a³", a ** 3], P: ["6a²", 6 * a * a], O: ["a²", a * a], pl: ["4a²", 4 * a * a] };
      case "kvader": { const b = S.m3, c = v; return { V: ["a · b · c", a * b * c], P: ["2(ab + ac + bc)", 2 * (a * b + a * c + b * c)], O: ["a · b", a * b], pl: ["2(a + b) · c", 2 * (a + b) * c] }; }
      case "prizma3": { const O = (a * a * k3) / 4, pl = 3 * a * v; return { V: ["O · v", O * v], P: ["2O + pl", 2 * O + pl], O: ["a²√3/4", O], pl: ["3a · v", pl] }; }
      case "prizma6": { const O = (3 * a * a * k3) / 2, pl = 6 * a * v; return { V: ["O · v", O * v], P: ["2O + pl", 2 * O + pl], O: ["3a²√3/2", O], pl: ["6a · v", pl] }; }
      case "piramida3": { const O = (a * a * k3) / 4, vs = Math.hypot(v, (a * k3) / 6), pl = (3 * a * vs) / 2; return { V: ["O · v/3", (O * v) / 3], P: ["O + pl", O + pl], O: ["a²√3/4", O], pl: ["3 · a · vₛ/2", pl] }; }
      case "piramida4": { const O = a * a, vs = Math.hypot(v, a / 2), pl = 2 * a * vs; return { V: ["a² · v/3", (O * v) / 3], P: ["a² + 2a · vₛ", O + pl], O: ["a²", O], pl: ["4 · a · vₛ/2", pl] }; }
      case "valj": return { V: ["πr² · v", PI * a * a * v], P: ["2πr² + 2πrv", 2 * PI * a * a + 2 * PI * a * v], O: ["πr²", PI * a * a], pl: ["2πr · v", 2 * PI * a * v] };
      case "stozec": { const s = Math.hypot(a, v); return { V: ["πr² · v/3", (PI * a * a * v) / 3], P: ["πr² + πrs", PI * a * a + PI * a * s], O: ["πr²", PI * a * a], pl: ["πrs", PI * a * s] }; }
      case "krogla": return { V: ["4πr³/3", (4 * PI * a ** 3) / 3], P: ["4πr²", 4 * PI * a * a] };
      case "prisekana": { const O1 = a * a, O2 = top * top, vs = Math.hypot(v, (a - top) / 2), pl = 2 * (a + top) * vs; return { V: ["v(O₁ + √(O₁O₂) + O₂)/3", (v * (O1 + Math.sqrt(O1 * O2) + O2)) / 3], P: ["O₁ + O₂ + pl", O1 + O2 + pl], O: ["a₁²", O1], O2: ["a₂²", O2], pl: ["2(a₁ + a₂) · vₛ", pl] }; }
      case "prisekan": { const s = Math.hypot(v, a - top), O1 = PI * a * a, O2 = PI * top * top, pl = PI * s * (a + top); return { V: ["πv(r₁² + r₁r₂ + r₂²)/3", (PI * v * (a * a + a * top + top * top)) / 3], P: ["O₁ + O₂ + pl", O1 + O2 + pl], O: ["πr₁²", O1], O2: ["πr₂²", O2], pl: ["πs(r₁ + r₂)", pl] }; }
      case "paralelepiped": { const k = paralelepipedKolicine(S.a, S.b, S.c, S.alfa, S.fi); return { V: ["O · v", k.V], P: ["2(ab · sin α + ac · sin φ + bc · sin β)", k.P], O: ["ab · sin α", k.O], pl: ["2(ac · sin φ + bc · sin β)", 2 * (k.Sac + k.Sbc)], beta: k.beta }; }
    }
    if (PRAVILNA[vr]) { const P = PRAVILNA[vr]; return { V: [P.V[0], P.V[1](a)], P: [P.P[0], P.P[1](a)] }; }
    return {};
  }
  function mrezaBesedilo() {
    const vr = S.telo, a = S.m1, v = S.m2, top = Math.min(S.m3, S.m1 - 0.5);
    switch (vr) {
      case "kocka": return "6 skladnih kvadratov";
      case "kvader": return "6 pravokotnikov, po dva in dva skladna";
      case "prizma3": return `2 enakostranična trikotnika in pravokotnik o × v = ${cm(3 * a)} × ${cm(v)}`;
      case "prizma6": return `2 pravilna šestkotnika in pravokotnik o × v = ${cm(6 * a)} × ${cm(v)}`;
      case "piramida3": return "enakostranični trikotnik in 3 skladni enakokraki trikotniki";
      case "piramida4": return "kvadrat in 4 skladni enakokraki trikotniki";
      case "valj": return `2 kroga in pravokotnik 2πr × v = ${cm(2 * Math.PI * a)} × ${cm(v)}`;
      case "stozec": { const s = Math.hypot(a, v); return `krog in krožni izsek s polmerom s = ${cm(s)} in središčnim kotom ${st((360 * a) / s)}°`; }
      case "krogla": return "krogla nima mreže: krogelne ploskve ne moremo razgrniti v ravnino, ne da bi jo raztegnili ali raztrgali";
      case "prisekana": return "2 kvadrata in 4 skladni enakokraki trapezi";
      case "prisekan": { const s = Math.hypot(v, a - top), Sc = (s * a) / (a - top); return `2 kroga in izsek krožnega kolobarja (polmera ${cm(Sc)} in ${cm(Sc - s)}, kot ${st((360 * a) / Sc)}°)`; }
      case "paralelepiped": return "6 paralelogramov, po dva in dva skladna (nasprotni ploskvi sta skladni)";
    }
    if (PRAVILNA[vr]) return PRAVILNA[vr].mreza;
    return "";
  }

  // ---------- deli ----------
  function sestaviDele(T, e) {
    const vr = T.vrsta, d = [];
    const tk = (p) => tockaSvet(p);
    const sredF = (F) => sredisce(F.p.map((p) => p.clone().applyMatrix4(F.M)), new Vector3());
    const okroglo = !!T.plasc, prizma = ["kocka", "kvader", "prizma3", "prizma6"].includes(vr);
    if (T.krogla) {
      const r = T.krogla;
      d.push({ id: "povrsje", ime: "Krogelna ploskev", opis: "Površje krogle: vse njene točke so od središča oddaljene za polmer r; njena ploščina je P = 4πr².", barva: "#F2B35E", meshes: [plF, plB], tocka: tk(V(r * 0.5, r * 1.75, r * 0.45)) });
      d.push({ id: "sredisce", ime: "Središče S", opis: "Točka v notranjosti krogle, ki je enako oddaljena od vseh točk krogelne ploskve.", barva: "#7CE0B5", meshes: [proxyKr.sredisce], tocka: tk(V(0, r, 0)) });
      d.push({ id: "polmer", ime: "Polmer r", opis: "Daljica od središča do krogelne ploskve; vsi polmeri krogle so enako dolgi.", barva: "#7CE0B5", meshes: [proxyCev.polmer], tocka: tk(V(r * 0.35, r, r * 0.35)) });
      d.push({ id: "glavni-krog", ime: "Glavna krožnica", opis: "Največja krožnica na krogli; njeno središče je kar središče krogle (kot ekvator na Zemlji).", barva: "#F1F4FF", meshes: [robovi], tocka: tk(V(-r, r, 0)) });
    } else if (POLIEDRI.has(vr)) {
      const P = PRAVILNA[vr], [nO, nR] = ORP[vr];
      let ip = 1; for (let k = 2; k < T.F.length; k++) if (sredF(T.F[k]).z > sredF(T.F[ip]).z) ip = k; // ploskev spredaj
      if (vr === "paralelepiped") {
        d.push({ id: "osnovna", ime: "Osnovni ploskvi", opis: "Spodnji in zgornji paralelogram s stranicama a in b ter kotom α med njima. Ležita v vzporednih ravninah; ploščina ene je O = ab · sin α.", barva: "#7FA6FF", meshes: [osnF, osnB], tocka: tk(sredF(T.F[0])) });
        d.push({ id: "plasc", ime: "Plašč", opis: "Štirje paralelogrami ob straneh; nasprotna sta skladna. Ker je rob c nagnjen, stranske ploskve niso pravokotniki.", barva: "#F2B35E", meshes: [plF, plB], tocka: tk(sredF(T.F[T.red.indexOf(2)])) });
      } else {
        d.push({ id: "ploskve", ime: "Ploskve", opis: `${P.ploskve}. Vse ploskve so enake, zato telo nima posebne osnovne ploskve: lahko ga postaviš na katerokoli.`, barva: "#F2B35E", meshes: [plF, plB], tocka: tk(sredF(T.F[ip])) });
      }
      const bot = T.F[0].p;
      d.push({ id: "robovi", ime: "Robovi", opis: `Daljice, v katerih se stikata po dve ploskvi; to telo ima ${nR} robov${P ? ", vsi so dolgi a" : ""}. Skrite robove rišemo črtkano.`, barva: "#F1F4FF", meshes: [robovi], tocka: tk(bot[0].clone().lerp(bot[1], 0.5)) });
      d.push({ id: "oglisca", ime: "Oglišča", opis: `Točke, v katerih se stikajo robovi; to telo ima ${sklon(nO, ["oglišče", "oglišči", "oglišča", "oglišč"])}.${P ? ` Ob vsakem oglišču so ${P.vozel}, kar je manj od 360°.` : ""}`, barva: "#F1F4FF", meshes: [oglisca], tocka: tk(bot[1].clone()) });
      if (T.proxy.visina) d.push({ id: "visina", ime: "Višina v", opis: "Razdalja med osnovnima ploskvama, merjena pravokotno nanju. Ker je rob c nagnjen, je višina v = c · sin φ krajša od c.", barva: "#7CE0B5", meshes: [proxyCev.visina], tocka: tk(T.proxy.visina[0].clone().lerp(T.proxy.visina[1], 0.5)) });
    } else {
      const osn = T.F.filter((F) => F.vrsta === "osn"), stevilo = osn.length;
      const osnIme = stevilo > 1 ? "Osnovni ploskvi" : "Osnovna ploskev";
      const osnOpis = vr === "kocka" ? "Spodnji in zgornji kvadrat; pri kocki so vse ploskve skladni kvadrati, zato je katerikoli par nasprotnih ploskev lahko osnovni."
        : prizma ? "Spodnja in zgornja ploskev prizme sta skladna mnogokotnika v vzporednih ravninah; ploščina ene je O."
        : vr.startsWith("piramida") ? "Mnogokotnik, na katerem piramida stoji; ploščina osnovne ploskve je O."
        : vr === "valj" ? "Valj ima dva skladna kroga s polmerom r, ki ležita v vzporednih ravninah; ploščina enega je O = πr²."
        : vr === "stozec" ? "Krog s polmerom r, na katerem stožec stoji; njegova ploščina je O = πr²."
        : vr === "prisekana" ? "Večji spodnji in manjši zgornji kvadrat v vzporednih ravninah; njuni ploščini sta O₁ in O₂."
        : "Večji spodnji in manjši zgornji krog v vzporednih ravninah; njuni ploščini sta O₁ in O₂.";
      d.push({ id: "osnovna", ime: osnIme, opis: osnOpis, barva: "#7FA6FF", meshes: [osnF, osnB], tocka: tk(sredF(T.F[0])) });
      const plOpis = prizma ? "Vse stranske ploskve skupaj; pri pokončni prizmi so to pravokotniki s skupno ploščino pl = o · v (o je obseg osnovne ploskve)."
        : vr.startsWith("piramida") ? "Vse stranske ploskve skupaj; pri pravilni piramidi so to skladni enakokraki trikotniki z višino vₛ."
        : vr === "valj" ? "Ukrivljena ploskev valja; ko jo razgrneš, dobiš pravokotnik z dolžino 2πr in višino v."
        : vr === "stozec" ? "Ukrivljena ploskev stožca; ko jo razgrneš, dobiš krožni izsek s polmerom s."
        : vr === "prisekana" ? "Štiri skladni enakokraki trapezi, ki povezujejo spodnji in zgornji kvadrat."
        : "Ukrivljena ploskev med krogoma; razgrnjena je del krožnega kolobarja.";
      let plT;
      if (okroglo) plT = plascTocka(T.plasc, 0.12, 0.45, e, new Vector3()); else plT = sredF(T.F[T.iSpr]);
      d.push({ id: "plasc", ime: "Plašč", opis: plOpis, barva: "#F2B35E", meshes: [plF, plB], tocka: tk(plT) });
      if (!okroglo) {
        const robovN = { kocka: 12, kvader: 12, prizma3: 9, prizma6: 18, piramida3: 6, piramida4: 8, prisekana: 12 }[vr];
        const oglN = { kocka: 8, kvader: 8, prizma3: 6, prizma6: 12, piramida3: 4, piramida4: 5, prisekana: 8 }[vr];
        const pB = T.B[(T.k0 + 1) % T.B.length], pR = T.B[(T.k0 + 2) % T.B.length];
        d.push({ id: "robovi", ime: "Robovi", opis: `Daljice, v katerih se stikata po dve ploskvi; to telo ima ${robovN} robov. Skrite robove rišemo črtkano.`, barva: "#F1F4FF", meshes: [robovi], tocka: tk(pB.clone().lerp(pR, 0.5)) });
        d.push({ id: "oglisca", ime: "Oglišča", opis: `Točke, v katerih se stikajo robovi; to telo ima ${oglN} ${oglN < 5 ? "oglišča" : "oglišč"}.`, barva: "#F1F4FF", meshes: [oglisca], tocka: tk(pB.clone()) });
      } else {
        const dva = T.F.length > 1;
        d.push({ id: "kroznice", ime: dva ? "Osnovni krožnici" : "Osnovna krožnica", opis: dva ? "Krožnici, ki omejujeta osnovni ploskvi; v njiju se plašč stika z osnovnima ploskvama." : "Krožnica, ki omejuje osnovno ploskev; v njej se plašč stika z osnovno ploskvijo.", barva: "#F1F4FF", meshes: [robovi], tocka: tk(V(-T.r1, 0, 0)) });
      }
      const pr = T.proxy;
      if (pr.visina) {
        const opis = prizma ? "Razdalja med osnovnima ploskvama; pri pokončni prizmi je enaka dolžini stranskega roba."
          : vr === "valj" ? "Razdalja med osnovnima ploskvama; enako dolga je vsaka daljica na plašču, ki je pravokotna na osnovni ploskvi."
          : vr.startsWith("prisek") ? "Razdalja med osnovnima ploskvama, merjena pravokotno nanju."
          : "Razdalja od vrha do osnovne ploskve, merjena pravokotno nanjo (skozi središče osnovne ploskve).";
        d.push({ id: "visina", ime: "Višina v", opis, barva: "#7CE0B5", meshes: [proxyCev.visina], tocka: tk(pr.visina[0].clone().lerp(pr.visina[1], 0.5)) });
      }
      if (pr.stranska) {
        const jeS = okroglo;
        d.push({ id: "stranska", ime: jeS ? "Stranica s" : "Višina stranske ploskve vₛ", opis: jeS ? (vr === "stozec" ? "Daljica od vrha do osnovne krožnice; po Pitagorovem izreku je s² = r² + v²." : "Daljica na plašču med osnovnima krožnicama; po Pitagorovem izreku je s² = v² + (r₁ − r₂)².") : (vr === "prisekana" ? "Višina trapeza na plašču; po Pitagorovem izreku je vₛ² = v² + ((a₁ − a₂)/2)²." : "Višina stranskega trikotnika na osnovni rob; vedno je daljša od višine piramide."), barva: "#7CE0B5", meshes: [proxyCev.stranska], tocka: tk(pr.stranska[0].clone().lerp(pr.stranska[1], 0.5)) });
      }
      if (pr.polmer) d.push({ id: "polmer", ime: vr === "prisekan" ? "Polmer r₁" : "Polmer r", opis: vr === "prisekan" ? "Polmer spodnje (večje) osnovne ploskve." : "Razdalja od središča osnovne ploskve do osnovne krožnice.", barva: "#7CE0B5", meshes: [proxyCev.polmer], tocka: tk(pr.polmer[0].clone().lerp(pr.polmer[1], 0.5)) });
      if (pr.polmer2) d.push({ id: "polmer2", ime: "Polmer r₂", opis: "Polmer zgornje (manjše) osnovne ploskve.", barva: "#7CE0B5", meshes: [proxyCev.polmer2], tocka: tk(pr.polmer2[0].clone().lerp(pr.polmer2[1], 0.5)) });
      if (pr.vrh) d.push({ id: "vrh", ime: "Vrh", opis: vr === "stozec" ? "Točka, v kateri se stečejo vse stranice stožca." : "Skupno oglišče vseh stranskih ploskev piramide.", barva: "#F1F4FF", meshes: [proxyKr.vrh], tocka: tk(pr.vrh) });
    }
    if (kroglePrikazane(T, e)) {
      const C = kroglaSredisce(T), P = PRAVILNA[vr], Rv = P.Rv[1](S.a), Ro = P.Ro[1](S.a), sm = V(-1, 0.45, 0.6).normalize();
      d.push({ id: "vcrtana", ime: "Včrtana krogla", opis: `Krogla, ki se dotika vseh ploskev telesa, vsake v njenem središču. Njen polmer je r = ${P.Rv[0]}.`, barva: "#7CE0B5", meshes: [vcrtana, proxyCev.polmer2], tocka: tk(C.clone().addScaledVector(V(0, -1, 0), Rv * 0.5)) });
      d.push({ id: "ocrtana", ime: "Očrtana krogla", opis: `Krogla, na kateri ležijo vsa oglišča telesa. Njen polmer je R = ${P.Ro[0]}. Evklid v XIII. knjigi vsako pravilno telo včrta v tako kroglo.`, barva: "#9FB6FF", meshes: [ocrtana, proxyCev.polmer], tocka: tk(C.clone().addScaledVector(sm, Ro)) });
    }
    {
      const R = tla.scale.x, k = korakTal, K = k === 1 ? 5 : 10;
      d.push({ id: "podlaga", ime: "Karirasta podlaga", opis: `Podlaga je razdeljena na kvadratke s stranico ${k} cm (debelejše črte so na vsakih ${K} cm) kot v karirastem zvezku; z njimi oceniš velikost telesa in njegove mreže.`, barva: "#A9BCE8", meshes: [tla], tocka: tk(V(sred.x - 0.6 * R, 0, sred.z + 0.6 * R)) });
      if (osInfo) {
        const [mx, my, mz] = osInfo.mere.map((m) => cm(m));
        d.push({ id: "osi", ime: "Koordinatni sistem", opis: `Osi x (proti tebi), y (v desno) in z (navzgor) imajo izhodišče 0 ${osInfo.kot ? "v zadnjem levem spodnjem kotu telesa" : NOVA.has(vr) ? "v središču ploskve, na kateri telo leži" : "v središču osnovne ploskve"}; številke so v cm na vsakih ${osInfo.korak} cm. Telo sega do x = ${mx}, y = ${my} in z = ${mz} (poudarjene črtice). Ko spreminjaš mere, se podlaga in osi prilagodijo, številke pa vedno kažejo prave mere; tanek obris kaže začetno velikost.`, barva: "#7FA8FF", meshes: [osiCev, osiKon], tocka: tk(osiTocka) });
      }
    }
    if (prerezInfo) {
      d.push({ id: "prerez", ime: "Prerez", opis: `Presek telesa z ravnino: ${prerezInfo.ime}. Odrezani del je prikazan prosojno.`, barva: "#E4577F", meshes: [prerezM], tocka: tk(T.prerezSred) });
      d.push({ id: "ravnina", ime: "Ravnina", opis: "Ravnina, ki seka telo; premikaš jo z drsniki za lego, nagib in zasuk.", barva: "#9FB6FF", meshes: [ravnina], tocka: tockaSvet(_a.copy(ravnina.position).addScaledVector(_b.set(1, 0, 0).applyQuaternion(ravnina.quaternion), ravnina.scale.x * 0.85)) });
    }
    return d;
  }

  // ---------- nadzor ----------
  const ob = (k) => (v) => { S[k] = v; zadnja = k; if (k === "telo") Dfiks = 0; obnovi(); zadnja = ""; };
  // drsniki ravnine delujejo le, ko je mreža zložena (krogla nima mreže)
  const ravninaDela = () => S.prerez && (S.razpri <= 1e-4 || S.telo === "krogla");
  // skupini teles (j, 5. 11.): vsaka ima svoj seznam, kocka je v obeh
  const izbiraSk = { tip: "izbira", id: "skupina", oznaka: "Skupina teles", moznosti: SKUPINE, vrednost: S.skupina, ob: (v) => { S.skupina = izbiraSk.vrednost = v; ob("telo")(v === "platonova" ? platonsko : osnovno); } };
  const izbiraTelo = { tip: "izbira", id: "telo", oznaka: "Telo", moznosti: MOZNOSTI, vrednost: osnovno, vidno: () => S.skupina === "osnovna",
    ob: (v) => {
      // Pregledovalnik ob začetnih vrednostih (/3d#telesa?telo=ikozaeder) temu seznamu, ki ikozaedra nima, pošlje
      // njegovo trenutno vrednost: to ni izbira, zato pravilno telo ostane.
      if (S.skupina === "platonova" && v === izbiraTelo.vrednost && PLATON_MOZ.some(([k]) => k === S.telo)) return;
      osnovno = izbiraTelo.vrednost = v; S.skupina = izbiraSk.vrednost = "osnovna"; ob("telo")(v);
    } };
  const izbiraPl = { tip: "izbira", id: "platon", oznaka: "Pravilno telo", moznosti: PLATON_MOZ, vrednost: platonsko, vidno: () => S.skupina === "platonova",
    ob: (v) => { platonsko = izbiraPl.vrednost = v; S.skupina = izbiraSk.vrednost = "platonova"; ob("telo")(v); } };
  const stikaloPro = { tip: "stikalo", id: "prosojno", oznaka: "Prosojne ploskve", vrednost: S.prosojno, ob: ob("prosojno") };
  // včrtana krogla je znotraj telesa, zato ob vklopu ploskve postanejo prosojne
  const stikaloKr = { tip: "stikalo", id: "krogli", oznaka: "Včrtana in očrtana krogla", vrednost: S.krogli, vidno: () => pravilno(),
    ob: (v) => { if (v && !S.prosojno) S.prosojno = stikaloPro.vrednost = true; stikaloKr.vrednost = v; ob("krogli")(v); } };
  const api = {
    group,
    deli: [],
    nadzor: [
      izbiraSk, izbiraTelo, izbiraPl,
      { tip: "drsnik", id: "a", oznaka: "Rob a (cm)", min: 1, max: 10, korak: 0.5, vrednost: S.a, ob: ob("a"), vidno: rabi("a") },
      { tip: "drsnik", id: "b", oznaka: "Rob b (cm)", min: 1, max: 10, korak: 0.5, vrednost: S.b, ob: ob("b"), vidno: rabi("b") },
      { tip: "drsnik", id: "c", oznaka: "Rob c (cm)", min: 1, max: 10, korak: 0.5, vrednost: S.c, ob: ob("c"), vidno: rabi("c") },
      { tip: "drsnik", id: "alfa", oznaka: "Kot α med a in b (°)", min: 30, max: 90, korak: 1, vrednost: S.alfa, ob: ob("alfa"), vidno: rabi("alfa") },
      { tip: "drsnik", id: "fi", oznaka: "Nagib φ roba c (°)", min: 30, max: 90, korak: 1, vrednost: S.fi, ob: ob("fi"), vidno: rabi("fi") },
      { tip: "drsnik", id: "r", oznaka: "Polmer r (cm)", min: 1, max: 10, korak: 0.5, vrednost: S.r, ob: ob("r"), vidno: rabi("r") },
      { tip: "drsnik", id: "a1", oznaka: "Spodnji rob a₁ (cm)", min: 1, max: 10, korak: 0.5, vrednost: S.a1, ob: ob("a1"), vidno: rabi("a1") },
      { tip: "drsnik", id: "a2", oznaka: "Zgornji rob a₂ (cm)", min: 1, max: 10, korak: 0.5, vrednost: S.a2, ob: ob("a2"), vidno: rabi("a2") },
      { tip: "drsnik", id: "r1", oznaka: "Spodnji polmer r₁ (cm)", min: 1, max: 10, korak: 0.5, vrednost: S.r1, ob: ob("r1"), vidno: rabi("r1") },
      { tip: "drsnik", id: "r2", oznaka: "Zgornji polmer r₂ (cm)", min: 1, max: 10, korak: 0.5, vrednost: S.r2, ob: ob("r2"), vidno: rabi("r2") },
      { tip: "drsnik", id: "v", oznaka: "Višina v (cm)", min: 1, max: 10, korak: 0.5, vrednost: S.v, ob: ob("v"), vidno: rabi("v") },
      { tip: "izpis", id: "mere", oznaka: "Mere", vrednost: () => mere() },
      { tip: "izpis", id: "V", oznaka: "Prostornina", vrednost: () => { const k = kolicine(); return `V = ${k.V[0]} = ${cm3(k.V[1])}`; } },
      { tip: "izpis", id: "P", oznaka: "Površina", vrednost: () => { const k = kolicine(); return `P = ${k.P[0]} = ${cm2(k.P[1])}`; } },
      { tip: "izpis", id: "Opl", oznaka: "Osnovna ploskev in plašč", vidno: () => !NOVA.has(S.telo), vrednost: () => {
        const k = kolicine();
        if (!k.O && PRAVILNA[S.telo]) return `vseh ${PRAVILNA[S.telo].p} ploskev je enakih: P = ${PRAVILNA[S.telo].p} · ploščina ene ploskve`;
        if (!k.O) return "krogla nima ne osnovne ploskve ne plašča";
        if (k.beta != null) return `O = ${k.O[0]} = ${cm2(k.O[1])}; pl = ${k.pl[0]} = ${cm2(k.pl[1])} (β = ${st(k.beta)}° je kot med b in c)`;
        if (k.O2) return `O₁ = ${k.O[0]} = ${cm2(k.O[1])}; O₂ = ${k.O2[0]} = ${cm2(k.O2[1])}; pl = ${k.pl[0]} = ${cm2(k.pl[1])}`;
        return `O = ${k.O[0]} = ${cm2(k.O[1])}; pl = ${k.pl[0]} = ${cm2(k.pl[1])}`;
      } },
      { tip: "izpis", id: "polmera", oznaka: "Včrtana in očrtana krogla", vidno: () => pravilno(), vrednost: () => {
        const P = PRAVILNA[S.telo];
        if (!P) return "samo pri pravilnih telesih";
        return `r = ${P.Rv[0]} = ${cm(P.Rv[1](S.a))}; R = ${P.Ro[0]} = ${cm(P.Ro[1](S.a))}`;
      } },
      { tip: "izpis", id: "euler", oznaka: "Oglišča, robovi, ploskve", vidno: () => !!ORP[S.telo], vrednost: () => euler(S.telo) || "Eulerjeva formula velja za telesa z ravnimi ploskvami" },
      { tip: "izpis", id: "elementi", oznaka: "Evklidovi Elementi", vrednost: () => { const t = ELEMENTI[S.telo]; return t.startsWith("v ") ? "V" + t.slice(1) : "Evklid, Elementi, " + t; } },
      { tip: "izpis", id: "zakaj5", oznaka: "Zakaj je pravilnih teles samo 5?", vidno: () => S.skupina === "platonova", vrednost: () => ZAKAJ_PET },
      { tip: "drsnik", id: "razpri", oznaka: "Razpri mrežo", min: 0, max: 1, korak: 0.01, vrednost: S.razpri, ob: ob("razpri"), vidno: () => S.telo !== "krogla" },
      { tip: "izpis", id: "mreza", oznaka: "Mreža", vrednost: () => mrezaBesedilo() },
      stikaloPro, stikaloKr,
      { tip: "stikalo", id: "prerez", oznaka: "Prerez z ravnino", vrednost: S.prerez, ob: ob("prerez") },
      { tip: "drsnik", id: "lega", oznaka: "Lega ravnine", min: 0, max: 1, korak: 0.01, vrednost: S.lega, ob: ob("lega"), vidno: () => ravninaDela() },
      { tip: "drsnik", id: "nagib", oznaka: "Nagib ravnine (°)", min: 0, max: 90, korak: 1, vrednost: S.nagib, ob: ob("nagib"), vidno: () => ravninaDela() },
      { tip: "drsnik", id: "zasuk", oznaka: "Zasuk ravnine (°)", min: 0, max: 90, korak: 1, vrednost: S.zasuk, ob: ob("zasuk"), vidno: () => ravninaDela() && S.nagib > 0 },
      { tip: "izpis", id: "prerezIzpis", oznaka: "Prerez", vidno: () => S.prerez, vrednost: () => {
        if (!S.prerez) return "vklopi »Prerez z ravnino«";
        if (S.razpri > 1e-4 && !T.krogla) return "prerez je prikazan, ko je mreža zložena (Razpri mrežo = 0)";
        if (!prerezInfo) return "ravnina ne seka telesa";
        return `${prerezInfo.ime}, S = ${cm2(prerezInfo.S)}`;
      } },
    ],
    merilo: () => ({ m: D / 100 / group.scale.x, oznaka: kratko(D) + NB + "cm" }), // med prehodom je prizor povečan za group.scale
    // mehak prehod merila po spremembi mer (glej obnovi); false, ko miruje
    korakBrezGumba: true,
    korak(t, dt) {
      const k = group.scale.x;
      if (Math.abs(k - 1) < 1e-3) { if (k !== 1) group.scale.setScalar(1); return false; }
      group.scale.setScalar(1 + (k - 1) * Math.exp(-Math.min(dt, 0.1) * 4));
      return true;
    },
    // prostornina in površina na odru, vidni tudi med vlečenjem drsnika (j, 4. 11.)
    povzetek: () => { const k = kolicine(); return `V = ${cm3(k.V[1])}\nP = ${cm2(k.P[1])}`; },
    // za teste: ploskve, kot so trenutno postavljene (zloženo telo ali razprta mreža), v cm
    ploskveMreze: () => T.F.map((F) => F.p.map((p) => { const q = p.clone().applyMatrix4(F.M); return [q.x, q.y, q.z]; })),
    dispose() {
      const geos = new Set(), mats = new Set();
      group.traverse((o) => { if (o.geometry) geos.add(o.geometry); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => mats.add(x)); });
      geos.add(cevGeo); geos.add(kroglicaGeo); geos.add(osiKonGeo); if (enotaKrogla) geos.add(enotaKrogla);
      for (const m of osTeksture.values()) mats.add(m);
      for (const g of geos) g.dispose();
      for (const m of mats) { if (m.map) m.map.dispose(); m.dispose(); }
      pikaTex.dispose(); sencaTex.dispose();
      for (const sp of napisi.values()) sp.userData.tex.dispose();
    },
  };
  obnovi();
  return api;
}
