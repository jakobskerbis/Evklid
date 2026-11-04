// Periodni sistem v 3D: vseh 118 elementov v standardni razporeditvi z 18 stolpci (lantanoidi in aktinoidi spodaj),
// višina ploščic prikaže izbrano lastnost (3D stolpčni diagram), nad izbranim elementom lebdi njegov Bohrov model.
//
// Viri podatkov:
// - relativne atomske mase: IUPAC/CIAAW, skrajšane standardne atomske mase (Abridged standard atomic weights, 2021);
//   za elemente brez obstojnih izotopov masno število najobstojnejšega izotopa v oglatem oklepaju;
// - elektronegativnost (Paulingova lestvica): CRC Handbook of Chemistry and Physics, 97. izd. (2016), za Pb vrednost 1,87;
// - prva ionizacijska energija: NIST Atomic Spectra Database (ionizacijske energije v eV, pretvorjene s 96,485 kJ/mol na eV);
// - atomski polmer: kovalentni polmeri iz enega vira, B. Cordero in sod., Dalton Trans. 2008, 2832–2838 (Mn, Fe, Co nizkospinski);
// - gostota: CRC Handbook (trdne snovi in kapljevine pri sobni temperaturi, plini pri 0 °C in 101,325 kPa);
// - agregatno stanje pri 25 °C in 101,325 kPa; za Z ≥ 100 ni znano (pripravili so le posamezne atome).
// Elektronske konfiguracije: Madelungovo pravilo z znanimi izjemami osnovnega stanja (NIST).

export const info = {
  id: "periodni-sistem",
  naslov: "Periodni sistem v 3D",
  podrocje: "kemija",
  predmet: "KEM",
  opis: "Vseh 118 elementov v periodnem sistemu, kjer višina ploščice pokaže izbrano lastnost: maso, elektronegativnost, polmer, ionizacijsko energijo ali gostoto. Nad izbranim elementom lebdi poenostavljen Bohrov model z razporeditvijo elektronov po lupinah.",
  merilo: { m: 1, oznaka: "ni v merilu (diagram)" },
};

const SIMBOLI = ("H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr " +
  "Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re " +
  "Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh " +
  "Fl Mc Lv Ts Og").split(" ");
const IMENA = ("Vodik,Helij,Litij,Berilij,Bor,Ogljik,Dušik,Kisik,Fluor,Neon,Natrij,Magnezij,Aluminij,Silicij,Fosfor,Žveplo," +
  "Klor,Argon,Kalij,Kalcij,Skandij,Titan,Vanadij,Krom,Mangan,Železo,Kobalt,Nikelj,Baker,Cink,Galij,Germanij,Arzen,Selen," +
  "Brom,Kripton,Rubidij,Stroncij,Itrij,Cirkonij,Niobij,Molibden,Tehnecij,Rutenij,Rodij,Paladij,Srebro,Kadmij,Indij," +
  "Kositer,Antimon,Telur,Jod,Ksenon,Cezij,Barij,Lantan,Cerij,Prazeodim,Neodim,Prometij,Samarij,Evropij,Gadolinij,Terbij," +
  "Disprozij,Holmij,Erbij,Tulij,Iterbij,Lutecij,Hafnij,Tantal,Volfram,Renij,Osmij,Iridij,Platina,Zlato,Živo srebro,Talij," +
  "Svinec,Bizmut,Polonij,Astat,Radon,Francij,Radij,Aktinij,Torij,Protaktinij,Uran,Neptunij,Plutonij,Americij,Kirij," +
  "Berkelij,Kalifornij,Ajnštajnij,Fermij,Mendelevij,Nobelij,Lavrencij,Raderfordij,Dubnij,Siborgij,Borij,Hasij,Majtnerij," +
  "Darmštatij,Rentgenij,Kopernicij,Nihonij,Flerovij,Moskovij,Livermorij,Tenes,Oganeson").split(",");
// relativna atomska masa (niz, da ostanejo značilna mesta); [n] = masno število najobstojnejšega izotopa
const AR = ("1.0080 4.0026 6.94 9.0122 10.81 12.011 14.007 15.999 18.998 20.180 22.990 24.305 26.982 28.085 30.974 32.06 " +
  "35.45 39.95 39.098 40.078 44.956 47.867 50.942 51.996 54.938 55.845 58.933 58.693 63.546 65.38 69.723 72.630 74.922 " +
  "78.971 79.904 83.798 85.468 87.62 88.906 91.224 92.906 95.95 [97] 101.07 102.91 106.42 107.87 112.41 114.82 118.71 " +
  "121.76 127.60 126.90 131.29 132.91 137.33 138.91 140.12 140.91 144.24 [145] 150.36 151.96 157.25 158.93 162.50 164.93 " +
  "167.26 168.93 173.05 174.97 178.49 180.95 183.84 186.21 190.23 192.22 195.08 196.97 200.59 204.38 207.2 208.98 [209] " +
  "[210] [222] [223] [226] [227] 232.04 231.04 238.03 [237] [244] [243] [247] [247] [251] [252] [257] [258] [259] [266] " +
  "[267] [268] [269] [270] [269] [278] [281] [282] [285] [286] [289] [290] [293] [294] [294]").split(" ");
const EN = ("2.20 - 0.98 1.57 2.04 2.55 3.04 3.44 3.98 - 0.93 1.31 1.61 1.90 2.19 2.58 3.16 - 0.82 1.00 1.36 1.54 1.63 1.66 " +
  "1.55 1.83 1.88 1.91 1.90 1.65 1.81 2.01 2.18 2.55 2.96 3.00 0.82 0.95 1.22 1.33 1.6 2.16 1.9 2.2 2.28 2.20 1.93 1.69 " +
  "1.78 1.96 2.05 2.1 2.66 2.60 0.79 0.89 1.10 1.12 1.13 1.14 1.13 1.17 1.2 1.2 1.1 1.22 1.23 1.24 1.25 1.1 1.27 1.3 1.5 " +
  "2.36 1.9 2.2 2.20 2.28 2.54 2.00 1.62 1.87 2.02 2.0 2.2 2.2 0.7 0.9 1.1 1.3 1.5 1.38 1.36 1.28 1.13 1.28 1.3 1.3 1.3 " +
  "1.3 1.3 1.3").split(" ");
// prva ionizacijska energija v eV (NIST ASD)
const IE_EV = ("13.59844 24.58739 5.39172 9.32270 8.29803 11.26030 14.53414 13.61806 17.42282 21.56454 5.13908 7.64624 " +
  "5.98577 8.15168 10.48669 10.36001 12.96764 15.75961 4.34066 6.11316 6.56149 6.82812 6.74619 6.76651 7.43402 7.90240 " +
  "7.88101 7.63988 7.72638 9.39420 5.99930 7.89943 9.78855 9.75239 11.81381 13.99961 4.17713 5.69485 6.21726 6.63413 " +
  "6.75885 7.09243 7.11938 7.36050 7.45890 8.33686 7.57623 8.99382 5.78636 7.34392 8.60839 9.00981 10.45126 12.12984 " +
  "3.89391 5.21166 5.57690 5.53860 5.47020 5.52500 5.57700 5.64370 5.67040 6.14980 5.86380 5.93910 6.02150 6.10770 " +
  "6.18430 6.25420 5.42590 6.82507 7.54957 7.86403 7.83352 8.43823 8.96702 8.95883 9.22553 10.43750 6.10829 7.41666 " +
  "7.28552 8.41400 9.31751 10.74850 4.07274 5.27841 5.38020 6.30670 5.89000 6.19405 6.26550 6.02580 5.97380 5.99140 " +
  "6.19785 6.28166 6.36758 6.50 6.58 6.62621 4.96").split(" ");
export const EV_V_KJ = 96.4853;
// kovalentni polmer v pm (Cordero 2008), Z = 1–96
const POLMER = ("31 28 128 96 84 76 71 66 57 58 166 141 121 111 107 105 102 106 203 176 170 160 153 139 139 132 126 124 132 " +
  "122 122 120 119 120 120 116 220 195 190 175 164 154 147 146 142 139 145 144 142 139 139 138 139 140 244 215 207 204 203 " +
  "201 199 198 198 196 194 192 192 189 190 187 187 175 170 162 151 144 141 136 136 132 145 146 148 140 150 150 260 221 215 " +
  "206 200 196 190 187 180 169").split(" ");
// gostota v g/cm³ (plini pri 0 °C)
const GOSTOTA = ("0.00008988 0.0001786 0.534 1.85 2.34 2.267 0.0012506 0.001429 0.001696 0.0009002 0.968 1.738 2.70 2.329 " +
  "1.823 2.07 0.0032 0.001784 0.862 1.55 2.985 4.506 6.0 7.19 7.21 7.874 8.90 8.908 8.96 7.14 5.91 5.323 5.727 4.81 3.1028 " +
  "0.003749 1.532 2.64 4.472 6.52 8.57 10.28 11 12.45 12.41 12.023 10.49 8.65 7.31 7.265 6.697 6.24 4.933 0.005894 1.93 " +
  "3.51 6.162 6.770 6.77 7.01 7.26 7.52 5.264 7.90 8.23 8.540 8.79 9.066 9.32 6.90 9.841 13.31 16.69 19.25 21.02 22.59 " +
  "22.56 21.45 19.3 13.534 11.85 11.34 9.78 9.196 - 0.00973 - 5.5 10.07 11.7 15.37 19.1 20.45 19.85 12 13.51 14.78 15.1 " +
  "8.84").split(" ");
const PLINI = new Set([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86]), KAPLJEVINE = new Set([35, 80]);
const stevilo = (s) => (s === undefined || s === "-" ? null : Number(s));

export const KATEGORIJE = [
  { id: "alkalijske", ime: "Alkalijske kovine", barva: "#d9644f", opis: "Mehke, zelo reaktivne kovine 1. skupine z enim valenčnim elektronom; z vodo burno reagirajo." },
  { id: "zemeljskoalkalijske", ime: "Zemeljskoalkalijske kovine", barva: "#e0a03a", opis: "Kovine 2. skupine z dvema valenčnima elektronoma; reaktivne, a manj kot alkalijske kovine." },
  { id: "prehodne", ime: "Prehodne kovine", barva: "#5585d6", opis: "Kovine od 3. do 12. skupine, kjer se polni podlupina d; mednje sodijo železo, baker, srebro in zlato." },
  { id: "lantanoidi", ime: "Lantanoidi", barva: "#4fb0c6", opis: "Petnajst kovin od lantana do lutecija, kjer se polni podlupina 4f; uporabljamo jih v magnetih in zaslonih." },
  { id: "aktinoidi", ime: "Aktinoidi", barva: "#3d9a8c", opis: "Petnajst radioaktivnih kovin od aktinija do lavrencija, kjer se polni podlupina 5f; mednje sodita uran in plutonij." },
  { id: "ostale-kovine", ime: "Ostale kovine", barva: "#8a92a6", opis: "Kovine p-bloka, kot so aluminij, kositer in svinec; so mehkejše in se talijo pri nižji temperaturi kot prehodne kovine." },
  { id: "polkovine", ime: "Polkovine", barva: "#a8a14a", opis: "Elementi na meji med kovinami in nekovinami, na primer silicij; nekatere lastnosti imajo kovinske, druge nekovinske." },
  { id: "nekovine", ime: "Nekovine", barva: "#5cb85c", opis: "Elementi, ki večinoma slabo prevajajo toploto in elektriko (izjema je grafit), na primer ogljik, kisik in žveplo; med seboj tvorijo kovalentne vezi." },
  { id: "halogeni", ime: "Halogeni", barva: "#b77fdb", opis: "Nekovine 17. skupine s sedmimi valenčnimi elektroni; s kovinami tvorijo soli (halogen pomeni »tvorec soli«)." },
  { id: "zlahtni-plini", ime: "Žlahtni plini", barva: "#d672a8", opis: "Elementi 18. skupine z zapolnjeno zunanjo lupino, zato se skoraj ne vežejo z drugimi elementi." },
];
// skupine ploščic pri barvanju po bloku in po agregatnem stanju (deli sledijo izbranemu barvanju)
export const BLOKI = [
  { id: "s-blok", kljuc: "s", ime: "s-blok", barva: "#e0705a", opis: "Elementi 1. in 2. skupine ter helij: zadnji elektroni zasedejo podlupino s zunanje lupine." },
  { id: "p-blok", kljuc: "p", ime: "p-blok", barva: "#e8b84a", opis: "Elementi od 13. do 18. skupine (brez helija): zadnji elektroni zasedajo podlupino p zunanje lupine." },
  { id: "d-blok", kljuc: "d", ime: "d-blok", barva: "#5b8fd9", opis: "Prehodne kovine od 3. do 12. skupine: polni se podlupina d predzadnje lupine." },
  { id: "f-blok", kljuc: "f", ime: "f-blok", barva: "#4fb39a", opis: "Lantanoidi in aktinoidi: polni se podlupina f, ki je dve lupini pod zunanjo." },
];
export const STANJA = [
  { id: "trdne", kljuc: "trdno", ime: "Trdne snovi", barva: "#5d6982", opis: "Elementi, ki so pri 25 °C trdni: skoraj vse kovine in nekatere nekovine, na primer ogljik, žveplo in jod." },
  { id: "kapljevine", kljuc: "tekoce", ime: "Kapljevine", barva: "#3fa0e6", opis: "Pri 25 °C sta tekoča le dva elementa: kovina živo srebro in nekovina brom." },
  { id: "plini", kljuc: "plinasto", ime: "Plini", barva: "#e9b949", opis: "Enajst elementov je pri 25 °C plinastih: vodik, dušik, kisik, fluor, klor in žlahtni plini od helija do radona." },
  { id: "neznano-stanje", kljuc: "neznano", ime: "Neznano stanje", barva: "#4a5160", opis: "Elementi od Z = 100 naprej: naredili so jih le po nekaj atomov naenkrat, zato ne vemo, ali bi bili trdni, tekoči ali plinasti." },
];
const POLKOVINE = new Set([5, 14, 32, 33, 51, 52]), NEKOVINE = new Set([1, 6, 7, 8, 15, 16, 34]);

/** Perioda, skupina (null za lantanoide in aktinoide) in mesto v razporeditvi (stolpec 1–18, vrstica; f-vrstici sta 8,5 in 9,5). */
export function polozaj(Z) {
  const meje = [0, 2, 10, 18, 36, 54, 86, 118];
  const p = meje.findIndex((x) => Z <= x);
  const i = Z - meje[p - 1] - 1;
  let g, f = false;
  if (p === 1) g = Z === 1 ? 1 : 18;
  else if (p <= 3) g = i < 2 ? i + 1 : i + 11;
  else if (p <= 5) g = i + 1;
  else if (i < 2) g = i + 1;
  else if (i <= 16) { g = null; f = true; }
  else g = i - 13;
  return { perioda: p, skupina: g, stolpec: f ? i + 1 : g, vrstica: f ? p + 2.6 : p, f };
}
function kategorija(Z, s, p) {
  if (s === 1 && Z > 1) return "alkalijske";
  if (s === 2) return "zemeljskoalkalijske";
  if (s === null) return p === 6 ? "lantanoidi" : "aktinoidi";
  if (s >= 3 && s <= 12) return "prehodne";
  if (s === 18) return "zlahtni-plini";
  if (s === 17) return "halogeni";
  if (POLKOVINE.has(Z)) return "polkovine";
  if (NEKOVINE.has(Z)) return "nekovine";
  return "ostale-kovine";
}

// --- elektronske konfiguracije ---
const MADELUNG = [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [3, 2], [4, 1], [5, 0], [4, 2], [5, 1], [6, 0], [4, 3], [5, 2], [6, 1], [7, 0], [5, 3], [6, 2], [7, 1]];
// izjeme osnovnega stanja: spremembe števila elektronov glede na Madelungovo pravilo
const IZJEME = {
  24: { "4s": -1, "3d": 1 }, 29: { "4s": -1, "3d": 1 }, 41: { "5s": -1, "4d": 1 }, 42: { "5s": -1, "4d": 1 },
  44: { "5s": -1, "4d": 1 }, 45: { "5s": -1, "4d": 1 }, 46: { "5s": -2, "4d": 2 }, 47: { "5s": -1, "4d": 1 },
  57: { "4f": -1, "5d": 1 }, 58: { "4f": -1, "5d": 1 }, 64: { "4f": -1, "5d": 1 }, 78: { "6s": -1, "5d": 1 },
  79: { "6s": -1, "5d": 1 }, 89: { "5f": -1, "6d": 1 }, 90: { "5f": -2, "6d": 2 }, 91: { "5f": -1, "6d": 1 },
  92: { "5f": -1, "6d": 1 }, 93: { "5f": -1, "6d": 1 }, 96: { "5f": -1, "6d": 1 }, 103: { "6d": -1, "7p": 1 },
};
const CRKE = "spdf";
/** Elektronska konfiguracija osnovnega stanja: [{n, l, e}] urejeno po n in l. */
export function konfiguracija(Z) {
  const k = new Map();
  let ost = Z;
  for (const [n, l] of MADELUNG) { if (ost <= 0) break; const e = Math.min(ost, 2 * (2 * l + 1)); k.set(`${n}${CRKE[l]}`, { n, l, e }); ost -= e; }
  for (const [kl, d] of Object.entries(IZJEME[Z] || {})) {
    if (!k.has(kl)) k.set(kl, { n: +kl[0], l: CRKE.indexOf(kl[1]), e: 0 });
    k.get(kl).e += d;
  }
  return [...k.values()].filter((x) => x.e > 0).sort((a, b) => a.n - b.n || a.l - b.l);
}
/** Število elektronov po lupinah K, L, M … */
export function lupine(Z) {
  const s = [];
  for (const x of konfiguracija(Z)) s[x.n - 1] = (s[x.n - 1] || 0) + x.e;
  return Array.from(s, (v) => v || 0);
}
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const nad = (x) => String(x).split("").map((c) => SUP[+c]).join("");
const zapisK = (k) => k.map((x) => `${x.n}${CRKE[x.l]}${nad(x.e)}`).join(" ");
/** Skrajšan zapis z jedrom žlahtnega plina, npr. [Ar] 3d⁶ 4s². */
export function skrajsano(Z) {
  const zp = [[86, "Rn"], [54, "Xe"], [36, "Kr"], [18, "Ar"], [10, "Ne"], [2, "He"]].find(([z]) => z < Z);
  if (!zp) return zapisK(konfiguracija(Z));
  const jedro = new Map(konfiguracija(zp[0]).map((x) => [`${x.n}${x.l}`, x.e]));
  return `[${zp[1]}] ` + zapisK(konfiguracija(Z).map((x) => ({ ...x, e: x.e - (jedro.get(`${x.n}${x.l}`) || 0) })).filter((x) => x.e > 0));
}

export const ELEMENTI = SIMBOLI.map((simbol, i) => {
  const Z = i + 1, poz = polozaj(Z), ar = AR[i], radioaktiven = ar.startsWith("[");
  return {
    Z, simbol, ime: IMENA[i], ar, masa: Number(ar.replace(/[[\]]/g, "")), radioaktiven,
    en: stevilo(EN[i]), ie: IE_EV[i] ? Math.round(Number(IE_EV[i]) * EV_V_KJ) : null, polmer: stevilo(POLMER[i]),
    gostota: stevilo(GOSTOTA[i]), stanje: Z >= 100 ? "neznano" : PLINI.has(Z) ? "plinasto" : KAPLJEVINE.has(Z) ? "tekoce" : "trdno",
    ...poz, blok: Z === 2 ? "s" : poz.f ? "f" : poz.skupina <= 2 ? "s" : poz.skupina >= 13 ? "p" : "d",
    kategorija: kategorija(Z, poz.skupina, poz.perioda),
  };
});

const vej = (x, d) => x.toFixed(d).replace(".", ",");
const RIMSKE = { 1: "I. A", 2: "II. A", 13: "III. A", 14: "IV. A", 15: "V. A", 16: "VI. A", 17: "VII. A", 18: "VIII. A" };
export const LASTNOSTI = [
  { id: "brez", ime: "Brez (ravno)", v: () => null },
  { id: "masa", ime: "Relativna atomska masa", v: (e) => e.masa, z: (e) => e.ar.replace(".", ",") },
  { id: "elektronegativnost", ime: "Elektronegativnost (Pauling)", v: (e) => e.en, z: (e) => String(e.en).replace(".", ",") },
  { id: "polmer", ime: "Atomski (kovalentni) polmer", v: (e) => e.polmer, z: (e) => `${e.polmer} pm` },
  { id: "ionizacijska", ime: "Prva ionizacijska energija", v: (e) => e.ie, z: (e) => `${e.ie} kJ/mol` },
  { id: "gostota", ime: "Gostota", v: (e) => e.gostota,
    z: (e) => (e.stanje === "plinasto" ? `${(e.gostota * 1000).toPrecision(3).replace(".", ",")} g/L (plin pri 0 °C)` : `${String(e.gostota).replace(".", ",")} g/cm³`) },
];
const BARVE_BLOK = Object.fromEntries(BLOKI.map((b) => [b.kljuc, b.barva]));
const BARVE_STANJE = Object.fromEntries(STANJA.map((b) => [b.kljuc, b.barva]));
const IME_STANJE = { trdno: "trdno", tekoce: "tekoče", plinasto: "plinasto", neznano: "ni znano" };
const SIVA = "#454c5a";
const BARVA_LUP = ["#cfe0ff", "#5fcfd0", "#8fd46a", "#f5996c", "#e7c25a", "#c58cf0", "#f07fa8"];

// mere razporeditve (enote scene)
const SK = 0.86; // pomanjšava celotne vsebine (tabela s podlago in lebdečim atomom v krogli s polmerom 1)
const KORAK = 0.1, PLOSCICA = 0.088, ZAOBL = 0.014, H_MIN = 0.022, H_MAX = 0.42, DVIG = 0.07;

export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const gibanje = ctx.gibanje !== false;
  const zac = ctx.zacetek || {};
  let lastnost = LASTNOSTI.some((l) => l.id === zac.lastnost) ? zac.lastnost : "elektronegativnost";
  let barve = ["skupine", "blok", "stanje"].includes(zac.barve) ? zac.barve : "skupine";
  let izbran = Math.min(118, Math.max(1, Math.round(Number(zac.element) || 8)));

  const group = new THREE.Group();
  group.name = "periodni-sistem";
  const svet = new THREE.Group(); // vsa vsebina, pomanjšana tako, da ostane v krogli s polmerom 1
  svet.scale.setScalar(SK);
  group.add(svet);
  const odvrzi = [];
  const xy = (e) => [(e.stolpec - 9.5) * KORAK, -(e.vrstica - 5.3) * KORAK];

  // podlaga
  const oblika = (w, h, r) => {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  };
  const gPodlaga = new THREE.ShapeGeometry(oblika(18 * KORAK + 0.06, 10.3 * KORAK + 0.06, 0.05), 6);
  gPodlaga.translate(0, 0.028, -0.004);
  const matPodlaga = new THREE.MeshPhysicalMaterial({ color: "#151c29", roughness: 0.75, metalness: 0 });
  const podlaga = new THREE.Mesh(gPodlaga, matPodlaga);
  svet.add(podlaga);
  odvrzi.push(gPodlaga, matPodlaga);

  // ploščice: zaobljen pravokotnik, iztisnjen za 1 (višino nastavi merilo z instance)
  const gPlosc = new THREE.ExtrudeGeometry(oblika(PLOSCICA, PLOSCICA, ZAOBL), { depth: 1, bevelEnabled: false, curveSegments: visoka ? 4 : 2 });
  odvrzi.push(gPlosc);
  const matPlosc = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.42, metalness: 0.05, clearcoat: 0.35, clearcoatRoughness: 0.35 });
  odvrzi.push(matPlosc);
  // ena InstancedMesh na skupino trenutnega barvanja (kategorija, blok ali stanje), da tap in deli sledijo barvam
  let skupine = [], poKat = new Map(), mreze = new Map();
  const skupineZa = (b) => (b === "blok" ? BLOKI.map((x) => ({ ...x, els: ELEMENTI.filter((e) => e.blok === x.kljuc) }))
    : b === "stanje" ? STANJA.map((x) => ({ ...x, els: ELEMENTI.filter((e) => e.stanje === x.kljuc) }))
    : KATEGORIJE.map((x) => ({ ...x, els: ELEMENTI.filter((e) => e.kategorija === x.id) })));
  function zgradiPloscice() {
    for (const im of mreze.values()) { svet.remove(im); im.dispose(); }
    skupine = skupineZa(barve); poKat = new Map(skupine.map((k) => [k.id, k.els])); mreze = new Map();
    for (const k of skupine) {
      const im = new THREE.InstancedMesh(gPlosc, matPlosc, k.els.length);
      im.name = k.id;
      im.userData.zji = k.els.map((e) => e.Z); // instanceId → Z (za izbiro s tapom)
      im.setColorAt(0, new THREE.Color());
      svet.add(im);
      mreze.set(k.id, im);
    }
  }
  zgradiPloscice();

  // izbrana ploščica (dvignjena, sveti) in sij za njo
  const matIzbr = new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.3, clearcoat: 0.6, emissive: "#ffffff", emissiveIntensity: 0.55 });
  const izbrPlosc = new THREE.Mesh(gPlosc, matIzbr);
  const okvir = oblika(PLOSCICA * 1.3, PLOSCICA * 1.3, 0.024);
  okvir.holes.push(oblika(PLOSCICA * 1.06, PLOSCICA * 1.06, 0.016));
  const gSij = new THREE.ShapeGeometry(okvir, 4);
  const matSij = new THREE.MeshBasicMaterial({ color: "#8fb2ff", transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false });
  const sij = new THREE.Mesh(gSij, matSij);
  svet.add(izbrPlosc, sij);
  odvrzi.push(matIzbr, gSij, matSij);

  // napisi: ena tekstura (atlas) za vse simbole in številke skupin/period, vsi napisi v eni geometriji
  let napisi = null, gNapis = null;
  const STO = 16, CEL = 128, VRST = 10;
  if (typeof document !== "undefined") {
    const cv = document.createElement("canvas"); cv.width = STO * CEL; cv.height = VRST * CEL;
    const g = cv.getContext("2d");
    if (g) {
      g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
      const pisi = (i, glavno, malo, velikost = 62) => {
        const x = (i % STO) * CEL, y = Math.floor(i / STO) * CEL;
        g.font = `700 ${velikost}px 'Instrument Sans', system-ui, sans-serif`;
        g.lineWidth = 7; g.strokeStyle = "rgba(8,11,18,0.55)"; g.fillStyle = "#f6f8fc";
        g.strokeText(glavno, x + CEL / 2, y + CEL * (malo ? 0.6 : 0.5)); g.fillText(glavno, x + CEL / 2, y + CEL * (malo ? 0.6 : 0.5));
        if (malo) {
          g.font = "600 27px 'Instrument Sans', system-ui, sans-serif"; g.lineWidth = 5;
          g.strokeText(malo, x + CEL / 2, y + 24); g.fillText(malo, x + CEL / 2, y + 24);
        }
      };
      ELEMENTI.forEach((e, i) => pisi(i, e.simbol, String(e.Z), e.simbol.length > 1 ? 58 : 64));
      for (let s = 1; s <= 18; s++) pisi(118 + s - 1, String(s), null, 50);
      for (let p = 1; p <= 7; p++) pisi(136 + p - 1, String(p), null, 50);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; tex.generateMipmaps = true;
      gNapis = new THREE.BufferGeometry();
      const N = 118 + 18 + 7;
      const uv = new Float32Array(N * 8), idx = [];
      for (let i = 0; i < N; i++) {
        const u0 = (i % STO) / STO, v1 = 1 - Math.floor(i / STO) / VRST, u1 = u0 + 1 / STO, v0 = v1 - 1 / VRST;
        uv.set([u0, v0, u1, v0, u1, v1, u0, v1], i * 8);
        idx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3);
      }
      gNapis.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 12), 3));
      gNapis.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      gNapis.setIndex(idx);
      const matNapis = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 });
      napisi = new THREE.Mesh(gNapis, matNapis);
      napisi.renderOrder = 2;
      svet.add(napisi);
      odvrzi.push(tex, gNapis, matNapis);
    }
  }
  const postaviNapis = (i, cx, cy, z, vel) => {
    const p = gNapis.attributes.position.array, h = vel / 2;
    p.set([cx - h, cy - h, z, cx + h, cy - h, z, cx + h, cy + h, z, cx - h, cy + h, z], i * 12);
  };
  if (gNapis) {
    for (let s = 1; s <= 18; s++) postaviNapis(118 + s - 1, (s - 9.5) * KORAK, -(0.32 - 5.3) * KORAK, 0.001, 0.05);
    for (let p = 1; p <= 7; p++) postaviNapis(136 + p - 1, (0.38 - 9.5) * KORAK, -(p - 5.3) * KORAK, 0.001, 0.05);
  }

  // Bohrov model izbranega elementa
  const atom = new THREE.Group();
  svet.add(atom);
  const vrtljiv = new THREE.Group();
  atom.add(vrtljiv);
  const gJedro = new THREE.SphereGeometry(1, visoka ? 28 : 14, visoka ? 18 : 10);
  const matJedro = new THREE.MeshPhysicalMaterial({ color: "#e8574a", emissive: "#7a1d14", emissiveIntensity: 0.6, roughness: 0.3, clearcoat: 0.5 });
  const jedro = new THREE.Mesh(gJedro, matJedro);
  const gElektron = new THREE.SphereGeometry(0.0075, visoka ? 12 : 8, visoka ? 8 : 6);
  const matElektron = new THREE.MeshPhysicalMaterial({ color: "#5b8ff5", emissive: "#1d3a8a", roughness: 0.28, clearcoat: 0.6 });
  const matValenca = new THREE.MeshPhysicalMaterial({ color: "#ffd166", emissive: "#7a5a10", roughness: 0.25, clearcoat: 0.6 });
  const elNotr = new THREE.InstancedMesh(gElektron, matElektron, 118), elZun = new THREE.InstancedMesh(gElektron, matValenca, 32);
  const gOzadje = new THREE.CircleGeometry(1, visoka ? 64 : 32);
  const matOzadje = new THREE.MeshBasicMaterial({ color: "#0b0f16", transparent: true, opacity: 0.78, depthWrite: false });
  const ozadje = new THREE.Mesh(gOzadje, matOzadje);
  ozadje.renderOrder = 3;
  const matObroc = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.6, depthWrite: false });
  const obroci = new THREE.Mesh(new THREE.BufferGeometry(), matObroc);
  obroci.renderOrder = 4;
  const gPecelj = new THREE.CylinderGeometry(0.0025, 0.0025, 1, 8, 1, true);
  gPecelj.rotateX(Math.PI / 2); gPecelj.translate(0, 0, 0.5);
  const matPecelj = new THREE.MeshBasicMaterial({ color: "#6e9bff", transparent: true, opacity: 0.55, depthWrite: false });
  const pecelj = new THREE.Mesh(gPecelj, matPecelj);
  svet.add(pecelj);
  vrtljiv.add(ozadje, obroci, jedro, elNotr, elZun);
  odvrzi.push(gJedro, matJedro, gElektron, matElektron, matValenca, elNotr, elZun, gOzadje, matOzadje, matObroc, gPecelj, matPecelj);
  let kroznice = []; // {r, e, w, f0, im, od}

  function zgradiAtom(Z) {
    const lup = lupine(Z), n = lup.length, R = 0.075 + 0.014 * n;
    const rJ = 0.018 + 0.012 * Math.cbrt(ELEMENTI[Z - 1].masa / 300);
    jedro.scale.setScalar(rJ);
    ozadje.scale.setScalar(R + 0.03);
    ozadje.position.z = -0.012;
    // obroči lupin: vsi v eni geometriji z barvami ogljišč
    const pos = [], nor = [], col = [], idx = [];
    kroznice = [];
    let iN = 0;
    lup.forEach((e, k) => {
      const r = rJ + 0.022 + (R - rJ - 0.022) * (n === 1 ? 1 : (k + 1) / n);
      const t = new THREE.TorusGeometry(r, 0.0016, 5, visoka ? 96 : 56), c = new THREE.Color(BARVA_LUP[k]), o = pos.length / 3;
      pos.push(...t.attributes.position.array); nor.push(...t.attributes.normal.array);
      for (let q = 0; q < t.attributes.position.count; q++) col.push(c.r, c.g, c.b);
      for (const q of t.index.array) idx.push(q + o);
      t.dispose();
      const zun = k === n - 1;
      kroznice.push({ r, e, w: 0.6 / (k + 1), f0: 0.7 * k, im: zun ? elZun : elNotr, od: zun ? 0 : iN });
      if (!zun) iN += e;
    });
    obroci.geometry.dispose();
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    obroci.geometry = g;
    elNotr.count = iN; elZun.count = lup[n - 1];
    const bs = new THREE.Sphere(new THREE.Vector3(), R + 0.01);
    for (const im of [elNotr, elZun]) { im.boundingSphere = bs.clone(); im.boundingBox = new THREE.Box3(new THREE.Vector3(-R, -R, -0.01), new THREE.Vector3(R, R, 0.01)); }
    return R;
  }
  const _M = new THREE.Matrix4();
  function korak(t = 0) {
    const tt = gibanje ? t : 0;
    for (const { r, e, w, f0, im, od } of kroznice) {
      for (let i = 0; i < e; i++) {
        const f = f0 + w * tt + (2 * Math.PI * i) / e;
        im.setMatrixAt(od + i, _M.makeTranslation(r * Math.cos(f), r * Math.sin(f), 0));
      }
      im.instanceMatrix.needsUpdate = true;
    }
    vrtljiv.rotation.y = gibanje ? 0.28 * Math.sin(0.35 * tt) : 0;
    vrtljiv.rotation.x = gibanje ? 0.12 * Math.sin(0.27 * tt + 1) : 0;
  }

  // višine in barve
  const lastn = () => LASTNOSTI.find((l) => l.id === lastnost);
  const visine = new Float32Array(119);
  function izracunajVisine() {
    const L = lastn();
    const vals = ELEMENTI.map((e) => L.v(e));
    const max = Math.max(...vals.filter((v) => v !== null && v !== undefined), 1e-9);
    ELEMENTI.forEach((e, i) => { const v = vals[i]; visine[e.Z] = L.id === "brez" || v === null ? H_MIN : H_MIN + (H_MAX - H_MIN) * (v / max); });
  }
  const barvaEl = (e) => {
    if (lastnost !== "brez" && lastn().v(e) === null) return SIVA;
    if (barve === "blok") return BARVE_BLOK[e.blok];
    if (barve === "stanje") return BARVE_STANJE[e.stanje];
    return KATEGORIJE.find((k) => k.id === e.kategorija).barva;
  };
  const _C = new THREE.Color(), _S = new THREE.Vector3(), _P = new THREE.Vector3(), _Q = new THREE.Quaternion();
  function posodobi() {
    izracunajVisine();
    for (const k of skupine) {
      const im = mreze.get(k.id);
      poKat.get(k.id).forEach((e, i) => {
        const [x, y] = xy(e), h = visine[e.Z];
        if (e.Z === izbran) _S.set(1e-4, 1e-4, 1e-4); else _S.set(1, 1, h);
        im.setMatrixAt(i, _M.compose(_P.set(x, y, 0), _Q, _S));
        im.setColorAt(i, _C.set(barvaEl(e)));
      });
      im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true;
      im.computeBoundingSphere(); im.computeBoundingBox();
    }
    const e = ELEMENTI[izbran - 1], [x, y] = xy(e), h = visine[izbran];
    izbrPlosc.position.set(x, y, DVIG); izbrPlosc.scale.set(1, 1, h);
    matIzbr.color.set(barvaEl(e)).lerp(_C.set("#ffffff"), 0.2); matIzbr.emissive.set(barvaEl(e));
    sij.position.set(x, y, DVIG + h + 0.002);
    const R = zgradiAtom(izbran);
    // atom lebdi pred ploščico in nekoliko nad njo, da ploščica ostane vidna; pecelj ju poveže
    // ob robovih tabele atom pomaknemo proti sredini, da ostane v krogli s polmerom 1
    const zA = DVIG + h + 0.1, yA = Math.min(y + R + 0.085, 0.62 - R), xA = Math.max(-0.66, Math.min(0.66, x));
    atom.position.set(xA, yA, zA);
    const zac = new THREE.Vector3(x, y + PLOSCICA * 0.3, DVIG + h), kon = new THREE.Vector3(xA, yA - R - 0.03, zA - 0.012);
    const smer = kon.clone().sub(zac);
    pecelj.position.copy(zac); pecelj.scale.set(1, 1, smer.length());
    pecelj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), smer.normalize());
    if (gNapis) {
      for (const el of ELEMENTI) { const [ex, ey] = xy(el); postaviNapis(el.Z - 1, ex, ey, (el.Z === izbran ? DVIG : 0) + visine[el.Z] + 0.0015, PLOSCICA * 0.98); }
      gNapis.attributes.position.needsUpdate = true; gNapis.computeBoundingSphere(); gNapis.computeBoundingBox();
    }
    korak(cas);
    // deli
    for (const d of m.deli) {
      if (d.id === "izbrani") {
        d.ime = e.ime; d.tocka = [xA * SK, (yA + R + 0.02) * SK, zA * SK];
        d.opis = opisElementa(e); d.barva = barvaEl(e);
        continue;
      }
      const els = poKat.get(d.id), sr = els[Math.floor((els.length - 1) / 2)], [sx, sy] = xy(sr);
      d.tocka = [sx * SK, sy * SK, ((sr.Z === izbran ? DVIG : 0) + visine[sr.Z] + 0.01) * SK];
    }
  }
  const imeKat = (e) => KATEGORIJE.find((k) => k.id === e.kategorija).ime.toLowerCase();
  const TOZ = { lantanoidi: "lantanoide", aktinoidi: "aktinoide", halogeni: "halogene", "zlahtni-plini": "žlahtne pline" }; // »spada med …«
  function opisElementa(e) {
    const l = lupine(e.Z);
    return `${e.ime} (${e.simbol}) ima ${e.Z} ${e.Z === 1 ? "proton" : e.Z === 2 ? "protona" : e.Z <= 4 ? "protone" : "protonov"} v jedru in elektrone po lupinah ${l.join(", ")}; spada med ${TOZ[e.kategorija] || imeKat(e)}.`;
  }

  let cas = 0;
  const delSkupine = (k) => ({ id: k.id, ime: k.ime, opis: k.opis, barva: k.barva, meshes: [mreze.get(k.id)], tocka: [0, 0, 0] });
  const m = {
    group, merilo: null,
    deli: [
      ...skupine.map(delSkupine),
      { id: "izbrani", ime: "Izbrani element", opis: "Izbrani element.", meshes: [izbrPlosc, jedro, obroci, elNotr, elZun], tocka: [0, 0, 0] },
    ],
    korak: (t) => { cas = t || 0; korak(cas); },
    izberi, dispose,
  };

  /** Izbira dela. Ob tapu na ploščico naj kit poda zadetek žarka ({object, instanceId}); takrat izberemo ta element. */
  function izberi(delId, zadetek) {
    let Z = null;
    const zji = zadetek && zadetek.object && zadetek.object.userData && zadetek.object.userData.zji;
    if (zji && Number.isInteger(zadetek.instanceId)) Z = zji[zadetek.instanceId];
    else if (typeof delId === "string") {
      const mt = /^(?:el-|z-)?(\d{1,3})$/i.exec(delId);
      if (mt) Z = +mt[1];
      else { const e = ELEMENTI.find((x) => x.simbol.toLowerCase() === delId.toLowerCase()); if (e) Z = e.Z; }
    }
    if (Z >= 1 && Z <= 118) { nastaviZ(Z); return "izbrani"; }
    return delId;
  }
  function nastaviZ(Z) {
    izbran = Z;
    const n = m.nadzor.find((x) => x.id === "element");
    if (n) n.vrednost = Z;
    posodobi();
  }

  const izpisLastnosti = () => {
    const L = lastn(), e = ELEMENTI[izbran - 1];
    if (L.id === "brez") return "Izberi lastnost, da postane višina ploščic stolpčni diagram.";
    const brez = ELEMENTI.filter((x) => L.v(x) === null).length;
    const op = brez ? ` · sivo: ni podatka (${brez} elementov)` : "";
    return (L.v(e) === null ? `${L.ime}: ni podatka` : `${L.ime}: ${L.z(e)}`) + op;
  };
  m.nadzor = [
    { tip: "izbira", id: "lastnost", oznaka: "Višina ploščic", moznosti: LASTNOSTI.map((l) => [l.id, l.ime]), vrednost: lastnost,
      ob: (v) => { lastnost = LASTNOSTI.some((l) => l.id === v) ? v : "brez"; posodobi(); } },
    { tip: "izbira", id: "barve", oznaka: "Barve", moznosti: [["skupine", "Skupine elementov"], ["blok", "Blok (s, p, d, f)"], ["stanje", "Agregatno stanje pri 25 °C"]],
      vrednost: barve, ob: (v) => { barve = ["skupine", "blok", "stanje"].includes(v) ? v : "skupine"; zgradiPloscice(); m.deli = [...skupine.map(delSkupine), m.deli.find((d) => d.id === "izbrani")]; posodobi(); } }, // deli sledijo barvanju
    { tip: "drsnik", id: "element", oznaka: "Element (vrstno število Z)", min: 1, max: 118, korak: 1, vrednost: izbran,
      ob: (v) => nastaviZ(Math.min(118, Math.max(1, Math.round(Number(v) || 1)))) },
    { tip: "izpis", id: "ime", oznaka: "Element", vrednost: () => { const e = ELEMENTI[izbran - 1]; return `${e.ime} (${e.simbol}), Z = ${e.Z}, relativna atomska masa ${e.ar.replace(".", ",")}`; } },
    { tip: "izpis", id: "mesto", oznaka: "Mesto v periodnem sistemu", vrednost: () => {
      const e = ELEMENTI[izbran - 1];
      const s = e.skupina ? `${e.skupina}. skupina${RIMSKE[e.skupina] ? ` (${RIMSKE[e.skupina]})` : ""}` : `${e.perioda === 6 ? "lantanoid" : "aktinoid"} (brez številke skupine)`;
      return `${s} · ${e.perioda}. perioda · blok ${e.blok} · ${imeKat(e)} · ${IME_STANJE[e.stanje]}`;
    } },
    { tip: "izpis", id: "lupine", oznaka: "Elektroni po lupinah", vrednost: () => `${lupine(izbran).join(", ")} · ${skrajsano(izbran)}` },
    { tip: "izpis", id: "vrednost", oznaka: "Lastnost", vrednost: izpisLastnosti },
  ];

  function dispose() {
    obroci.geometry.dispose();
    for (const im of mreze.values()) im.dispose();
    for (const x of odvrzi) x.dispose && x.dispose();
  }
  posodobi();
  return m;
}
