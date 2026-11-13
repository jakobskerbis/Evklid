// Periodni sistem elementov. Vrstica: [simbol, slovensko ime, angleško ime, Ar, masno število A].
// Ar: standardna relativna atomska masa (IUPAC/CIAAW, zaokrožena kot v šolskih tabelah).
// Za elemente brez stabilnih izotopov je Ar = null, A pa masno število najstabilnejšega izotopa
// (v tabeli v oglatem oklepaju). Pri ostalih je A masno število najpogostejšega izotopa.
import { EXTRA } from "./pse-extra.js";

const RAW = `H vodik Hydrogen 1.008 1
He helij Helium 4.0026 4
Li litij Lithium 6.94 7
Be berilij Beryllium 9.0122 9
B bor Boron 10.81 11
C ogljik Carbon 12.011 12
N dušik Nitrogen 14.007 14
O kisik Oxygen 15.999 16
F fluor Fluorine 18.998 19
Ne neon Neon 20.180 20
Na natrij Sodium 22.990 23
Mg magnezij Magnesium 24.305 24
Al aluminij Aluminium 26.982 27
Si silicij Silicon 28.085 28
P fosfor Phosphorus 30.974 31
S žveplo Sulfur 32.06 32
Cl klor Chlorine 35.45 35
Ar argon Argon 39.95 40
K kalij Potassium 39.098 39
Ca kalcij Calcium 40.078 40
Sc skandij Scandium 44.956 45
Ti titan Titanium 47.867 48
V vanadij Vanadium 50.942 51
Cr krom Chromium 51.996 52
Mn mangan Manganese 54.938 55
Fe železo Iron 55.845 56
Co kobalt Cobalt 58.933 59
Ni nikelj Nickel 58.693 58
Cu baker Copper 63.546 63
Zn cink Zinc 65.38 64
Ga galij Gallium 69.723 69
Ge germanij Germanium 72.630 74
As arzen Arsenic 74.922 75
Se selen Selenium 78.971 80
Br brom Bromine 79.904 79
Kr kripton Krypton 83.798 84
Rb rubidij Rubidium 85.468 85
Sr stroncij Strontium 87.62 88
Y itrij Yttrium 88.906 89
Zr cirkonij Zirconium 91.224 90
Nb niobij Niobium 92.906 93
Mo molibden Molybdenum 95.95 98
Tc tehnecij Technetium - 98
Ru rutenij Ruthenium 101.07 102
Rh rodij Rhodium 102.91 103
Pd paladij Palladium 106.42 106
Ag srebro Silver 107.87 107
Cd kadmij Cadmium 112.41 114
In indij Indium 114.82 115
Sn kositer Tin 118.71 120
Sb antimon Antimony 121.76 121
Te telur Tellurium 127.60 130
I jod Iodine 126.90 127
Xe ksenon Xenon 131.29 132
Cs cezij Caesium 132.91 133
Ba barij Barium 137.33 138
La lantan Lanthanum 138.91 139
Ce cerij Cerium 140.12 140
Pr prazeodim Praseodymium 140.91 141
Nd neodim Neodymium 144.24 142
Pm prometij Promethium - 145
Sm samarij Samarium 150.36 152
Eu evropij Europium 151.96 153
Gd gadolinij Gadolinium 157.25 158
Tb terbij Terbium 158.93 159
Dy disprozij Dysprosium 162.50 164
Ho holmij Holmium 164.93 165
Er erbij Erbium 167.26 166
Tm tulij Thulium 168.93 169
Yb iterbij Ytterbium 173.05 174
Lu lutecij Lutetium 174.97 175
Hf hafnij Hafnium 178.49 180
Ta tantal Tantalum 180.95 181
W volfram Tungsten 183.84 184
Re renij Rhenium 186.21 187
Os osmij Osmium 190.23 192
Ir iridij Iridium 192.22 193
Pt platina Platinum 195.08 195
Au zlato Gold 196.97 197
Hg živo_srebro Mercury 200.59 202
Tl talij Thallium 204.38 205
Pb svinec Lead 207.2 208
Bi bizmut Bismuth 208.98 209
Po polonij Polonium - 209
At astat Astatine - 210
Rn radon Radon - 222
Fr francij Francium - 223
Ra radij Radium - 226
Ac aktinij Actinium - 227
Th torij Thorium 232.04 232
Pa protaktinij Protactinium 231.04 231
U uran Uranium 238.03 238
Np neptunij Neptunium - 237
Pu plutonij Plutonium - 244
Am americij Americium - 243
Cm kurij Curium - 247
Bk berkelij Berkelium - 247
Cf kalifornij Californium - 251
Es einsteinij Einsteinium - 252
Fm fermij Fermium - 257
Md mendelevij Mendelevium - 258
No nobelij Nobelium - 259
Lr lavrencij Lawrencium - 262
Rf rutherfordij Rutherfordium - 267
Db dubnij Dubnium - 268
Sg seaborgij Seaborgium - 269
Bh bohrij Bohrium - 270
Hs hassij Hassium - 269
Mt meitnerij Meitnerium - 278
Ds darmstadtij Darmstadtium - 281
Rg rentgenij Roentgenium - 282
Cn kopernicij Copernicium - 285
Nh nihonij Nihonium - 286
Fl flerovij Flerovium - 289
Mc moskovij Moscovium - 290
Lv livermorij Livermorium - 293
Ts tenes Tennessine - 294
Og oganeson Oganesson - 294`;

const NOBLE = [2, 10, 18, 36, 54, 86, 118];
const ENDS = [0, 2, 10, 18, 36, 54, 86, 118];

/** Skupina (1–18) in perioda; lantanoidi in aktinoidi dobijo skupino 3 in »f«. */
function place(z) {
  const period = ENDS.findIndex((e) => z <= e);
  const start = ENDS[period - 1] + 1;
  const i = z - start; // položaj v periodi
  let group;
  let f = false;
  if (period === 1) group = z === 1 ? 1 : 18;
  else if (period <= 3) group = i < 2 ? i + 1 : i + 11;
  else if (period <= 5) group = i + 1;
  else if (i < 2) group = i + 1;
  else if (i < 17) {
    group = 3;
    f = true; // La–Lu, Ac–Lr
  } else group = i - 13;
  return { period, group, f };
}

function category(z, g, f) {
  if (f) return z < 89 ? "lanthanide" : "actinide";
  if (NOBLE.includes(z)) return "noble";
  if (g === 17) return "halogen";
  if (z === 1 || [6, 7, 8, 15, 16, 34].includes(z)) return "nonmetal";
  if (g === 1) return "alkali";
  if (g === 2) return "alkaline";
  if ([5, 14, 32, 33, 51, 52].includes(z)) return "metalloid";
  if (g >= 3 && g <= 12) return "transition";
  return "post";
}

export const ELEMENTS = RAW.split("\n").map((line, idx) => {
  const [sym, sl, en, ar, a] = line.trim().split(/\s+/);
  const z = idx + 1;
  const { period, group, f } = place(z);
  return { z, sym, sl: sl.replace(/_/g, " "), en, ar: ar === "-" ? null : Number(ar), a: Number(a), period, group, f, cat: category(z, group, f) };
});

export const CATEGORIES = ["alkali", "alkaline", "transition", "post", "metalloid", "nonmetal", "halogen", "noble", "lanthanide", "actinide"];

/** Relativne atomske mase za molsko maso (za radioaktivne masno število najstabilnejšega izotopa). */
export const MASSES = Object.fromEntries(ELEMENTS.map((e) => [e.sym, e.ar ?? e.a]));

/** Elektroni po lupinah (iz elektronske konfiguracije; za prvih 20 velja šolsko pravilo 2, 8, 8, 2). */
export function shells(z) {
  const e = EXTRA[z - 1];
  if (!e) return null;
  return shellsOf(fullConfig(z));
}

/** Celotna konfiguracija brez jedra žlahtnega plina, npr. »1s2 2s2 2p6 3s1«. */
export function fullConfig(z) {
  const e = EXTRA[z - 1];
  if (!e) return "";
  const m = /^\[(\w+)\]\s*(.*)$/.exec(e.conf);
  if (!m) return e.conf;
  const core = ELEMENTS.find((x) => x.sym === m[1]);
  return `${fullConfig(core.z)} ${m[2]}`.trim();
}

function shellsOf(conf) {
  const out = [];
  for (const [, n, k] of conf.matchAll(/(\d)[spdf](\d+)/g)) out[n - 1] = (out[n - 1] || 0) + Number(k);
  return out.map((v) => v || 0);
}

export { EXTRA };
