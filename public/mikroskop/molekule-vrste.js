// Prave molekule na ravni molekul in atomov (j, 13. 11. 2026: »naj se na nivoju molekul dejansko prikažejo molekule,
// ki jih najbolj pogosto opazimo v izbrani vrsti«, »z poimenovanji«). Sonda (pogled.js) izmeri snov na obeh straneh
// najbližje membrane, tu iz snovi, vrste celice in preparata izberemo prizor (katere molekule so tam) in vrsto
// membrane. molekule.js riše v režah: 0–5 strana A, 6–11 strana B, 12–15 membrana; vrstni red molekul v PRIZORI se
// mora ujemati s komentarjem ob istem prizoru v senčilniku. Barve so v slogu ilustracij D. Goodsella, gostota je
// sivina za TEM (0 svetlo, 1 temno), »at« je vrsta atomov (A), imena in vloge so v i18n (mk.mol.<id>, mk.molv.<id>).

// vrste atomov (A_* v molekule.js)
export const A = { voda: 0, belj: 1, dnk: 2, rnk: 3, lipid: 4, apatit: 5, celuloza: 6, kolagen: 7, sladkor: 8, hem: 9, ion: 10, smola: 11, zn: 12, tg: 13 };

// elementi v barvah CPK (barvaEl v molekule.js) in kateri elementi so v kateri vrsti atomov (za legendo)
export const ELEMENTI = { H: "#ededed", C: "#858c94", N: "#304ff7", O: "#f21f1a", P: "#ff8000", S: "#f2e633", Ca: "#3dd926", Fe: "#e06633", Na: "#ab5cf2", K: "#8f40d4", Cl: "#1ff01f", Zn: "#7d80b0" };
const EL = {
  [A.voda]: ["O", "H"], [A.belj]: ["H", "C", "N", "O", "S"], [A.dnk]: ["H", "C", "N", "O", "P"], [A.rnk]: ["H", "C", "N", "O", "P"],
  [A.lipid]: ["H", "C", "N", "O", "P"], [A.apatit]: ["Ca", "P", "O", "H"], [A.celuloza]: ["H", "C", "O"], [A.kolagen]: ["H", "C", "N", "O"],
  [A.sladkor]: ["H", "C", "O"], [A.hem]: ["Fe", "N", "C"], [A.ion]: ["Na", "K", "Cl"], [A.smola]: ["H", "C", "O"], [A.zn]: ["Zn"], [A.tg]: ["H", "C"],
};
export const elementiMolekule = (id) => EL[MOL[id]?.at] || [];

const b = (barva, g, at) => ({ barva, g, at });
export const MOL = {
  voda: b("#f6f1e4", 0.08, A.voda),
  ioni: b("#b9a8e8", 0.3, A.ion),
  hemoglobin: b("#e0605a", 0.55, A.belj),
  hem: b("#9c1c22", 0.8, A.hem),
  karboanhidraza: b("#e8a07a", 0.5, A.belj),
  albumin: b("#f2c46c", 0.5, A.belj),
  igg: b("#8fb4e8", 0.5, A.belj),
  fibrinogen: b("#c9d77a", 0.5, A.belj),
  ribosom: b("#d877c0", 0.75, A.rnk),
  aktin: b("#7fb2e6", 0.55, A.belj),
  mikrotubul: b("#8fd0a8", 0.5, A.belj),
  encimi: b("#9aa4e6", 0.5, A.belj),
  mioglobin: b("#d9636b", 0.55, A.belj),
  nevrofilament: b("#e3b56a", 0.5, A.belj),
  keratin: b("#e6c08c", 0.55, A.belj),
  dezmin: b("#d8a878", 0.55, A.belj),
  vilin: b("#9cc8a0", 0.55, A.belj),
  nukleosom: b("#6f88d8", 0.6, A.belj),
  dnk: b("#f0b33c", 0.7, A.dnk),
  rnapol: b("#b48ee0", 0.55, A.belj),
  rrnk: b("#e07ab8", 0.65, A.rnk),
  preribosom: b("#d690c8", 0.65, A.rnk),
  fibrilarin: b("#a99be0", 0.5, A.belj),
  kolagen: b("#e09a80", 0.45, A.kolagen),
  dekorin: b("#b7d48a", 0.4, A.belj),
  hidroksiapatit: b("#b9c8e0", 0.85, A.apatit),
  miozin: b("#e07068", 0.6, A.belj),
  titin: b("#c0a0e0", 0.4, A.belj),
  aktinin: b("#8a80c8", 0.6, A.belj),
  tropomiozin: b("#3f7fc8", 0.55, A.belj),
  triglicerid: b("#f5e08a", 0.35, A.tg),
  celuloza: b("#8cc46c", 0.45, A.celuloza),
  hemiceluloza: b("#c8dc82", 0.3, A.sladkor),
  pektin: b("#e8d6a0", 0.25, A.sladkor),
  peptidoglikan: b("#c6a0d8", 0.5, A.sladkor),
  glukan: b("#d8c48c", 0.45, A.sladkor),
  manoprotein: b("#9ab8e0", 0.45, A.belj),
  agrekan: b("#8fb8e6", 0.35, A.sladkor),
  proteoglikan: b("#8fb8e6", 0.35, A.sladkor),
  hialuronan: b("#c4e0f0", 0.25, A.sladkor),
  kolagen2: b("#e0a88e", 0.45, A.kolagen),
  mucin: b("#a8d4e8", 0.3, A.sladkor),
  elastin: b("#f0c878", 0.5, A.belj),
  fibrilin: b("#c8a070", 0.5, A.belj),
  mrnk: b("#f08a8a", 0.6, A.rnk),
  glikogen: b("#f5d65a", 0.8, A.sladkor),
  krebs: b("#8fd08a", 0.5, A.belj),
  mtdnk: b("#f0b33c", 0.7, A.dnk),
  rubisko: b("#6fbf5a", 0.55, A.belj),
  fotosistem: b("#3f9a4a", 0.6, A.belj),
  tiroglobulin: b("#9bd68a", 0.5, A.belj),
  kristalin: b("#c8e4f4", 0.45, A.belj),
  melanin: b("#5a3a28", 1.0, A.belj),
  zimogen: b("#e8a060", 0.7, A.belj),
  sekret: b("#e8b080", 0.65, A.belj),
  bip: b("#f0b070", 0.45, A.belj),
  novo: b("#f0d090", 0.35, A.belj),
  fosfolipid: b("#9ccc5a", 0.6, A.lipid),
  holesterol: b("#f2d36b", 0.45, A.smola),
  mbp: b("#e88a60", 0.5, A.belj),
  membelj: b("#f0a050", 0.55, A.belj),
  atpsintaza: b("#f0a050", 0.55, A.belj),
  porin: b("#e8a868", 0.55, A.belj),
  pas3: b("#f0a050", 0.55, A.belj),
  crpalka: b("#f0a050", 0.55, A.belj),
  smola: b("#ece7da", 0.05, A.smola),
  gp23: b("#c86a8c", 0.7, A.belj),
  hoc: b("#e8a0c0", 0.6, A.belj),
  gp18: b("#6aa0d8", 0.65, A.belj),
  gp19: b("#a0c8e8", 0.6, A.belj),
  gp37: b("#e0c070", 0.5, A.belj),
  nprot: b("#e09060", 0.6, A.belj),
  rnkvir: b("#f08a8a", 0.6, A.rnk),
  spike: b("#e05a4a", 0.6, A.belj),
  mprot: b("#a080d0", 0.55, A.belj),
  env: b("#e05a4a", 0.6, A.belj),
  p24: b("#d880a0", 0.65, A.belj),
  ma: b("#c890d8", 0.6, A.belj),
  rt: b("#8fc0e8", 0.55, A.belj),
  virbelj: b("#d88aa0", 0.65, A.belj),
};

// prizori: koda (P_* v molekule.js) in molekule po režah (null = reža prazna)
export const PRIZORI = {
  voda: [1, "voda", "ioni"],
  kri: [2, "voda", "hemoglobin", "hem", "karboanhidraza"],
  plazma: [3, "voda", "albumin", "igg", "fibrinogen", "ioni"],
  cito: [4, "voda", "ribosom", "aktin", "mikrotubul", "encimi", null],
  bakterija: [5, "voda", "ribosom", "encimi", "dnk"],
  jedro: [6, "voda", "nukleosom", "dnk", "rnapol"],
  kromatin: [7, "voda", "nukleosom", "dnk", "rnapol"],
  jedrce: [8, "voda", "rrnk", "preribosom", "fibrilarin"],
  kolagen: [9, "voda", "kolagen", "dekorin"],
  kost: [10, "hidroksiapatit", "kolagen"],
  sklenina: [11, "hidroksiapatit", "voda"],
  miofibrila: [12, "voda", "miozin", "aktin", "aktinin", "titin", "tropomiozin"],
  lipid: [13, "triglicerid"],
  stenaR: [14, "voda", "celuloza", "hemiceluloza", "pektin"],
  stenaB: [15, "voda", "peptidoglikan"],
  stenaK: [16, "voda", "glukan", "manoprotein"],
  matriks: [17, "voda", "proteoglikan", "hialuronan", "kolagen"],
  sluz: [18, "voda", "mucin", "ioni"],
  elastin: [19, "voda", "elastin", "fibrilin"],
  keratin: [20, "voda", "keratin"],
  ribosom: [21, "voda", "ribosom", "mrnk"],
  glikogen: [22, "voda", "glikogen"],
  mito: [23, "voda", "krebs", "mtdnk"],
  kloroplast: [24, "voda", "rubisko", "fotosistem"],
  koloid: [25, "voda", "tiroglobulin"],
  granula: [26, "voda", "sekret"],
  er: [27, "voda", "bip", "novo"],
  golgi: [27, "voda", "sekret", "novo"],
  mielin: [28, "voda", "fosfolipid", "holesterol", "mbp"],
  smola: [29, "smola"],
  t4dnk: [30, "voda", "dnk"],
  t4rep: [31, "voda", "gp18", "gp19"],
  t4vlakno: [32, "voda", "gp37"],
  sarsRnp: [33, "voda", "nprot", "rnkvir"],
  hivJedro: [34, "voda", "rnkvir", "rt"],
  hivMatriks: [35, "voda", "p24"],
  virus: [36, "voda", "virbelj"],
  mikrovil: [37, "voda", null, "aktin", null, "vilin", null],
};
// membrane: koda (uMemVrsta) in molekule v režah 12–15
export const MEMBRANE = {
  dvosloj: [0, "fosfolipid", "holesterol", "membelj"],
  t4: [1, "gp23", "hoc"],
  ovojnica: [2, "fosfolipid", "spike", "mprot"],
  p24: [3, "p24"],
  rob: [4],
};

// snovi (S_* v glsl.js) in vrste celic (C_*)
export const S = {
  PRAZNO: 0, CITO: 1, JEDRO: 2, KOLAGEN: 3, MINERAL: 4, ERITROCIT: 5, LIPID: 6, MIOFIBRILA: 7, MIELIN: 8, MATRIKS: 9,
  KERATIN: 10, STENA: 11, VAKUOLA: 12, KOLOID: 13, PLAZMA: 14, ELASTIN: 15, SLUZ: 16, VIRUS: 17, SKLENINA: 18, MITO: 20,
  ER: 21, RIBOSOM: 22, GLIKOGEN: 23, MEMBRANA: 24, KLOROPLAST: 25, GRANULA: 26, KROMATIN: 27, JEDRCE: 28, GOLGI: 29,
  MIKROVIL: 30, GENOM: 31,
};
const C = { GLADKA: 13, NEVRON: 4, RASTLINSKA: 6, BAKTERIJA: 7, KERATINOCIT: 9, KVASOVKA: 11, MISICA: 16, NEVRIT: 17 };

// Značilna snov preparata (TEM, sonda): ob prehodu na elektronski mikroskop gre pogled na najbližjo tako točko,
// da so na ravni molekul vidne molekule, po katerih je preparat znan (mikroskop.js kTkivu). Ni ga, kjer je sredina že značilna.
export const ZNACILNO = {
  kri: [S.ERITROCIT], "skeletna-misica": [S.MIOFIBRILA], "srcna-misica": [S.MIOFIBRILA], "gladka-misica": [S.CITO],
  "virus-t4": [S.GENOM], "virus-sars": [S.GENOM], "virus-hiv": [S.GENOM], bakterije: [S.CITO], kvasovke: [S.CITO],
  ustne: [S.CITO], list: [S.KLOROPLAST], steblo: [S.CITO, S.KLOROPLAST], koren: [S.KROMATIN, S.JEDRO], reza: [S.CITO, S.STENA],
  jetra: [S.GLIKOGEN, S.CITO], bezgavka: [S.KROMATIN, S.JEDRO], jajcnik: [S.CITO], modo: [S.KROMATIN, S.JEDRO],
  zleza: [S.GRANULA], scitnica: [S.KOLOID], koza: [S.KERATIN], zivec: [S.MIELIN], "bela-snov": [S.MIELIN],
  "mali-mozgani": [S.CITO], pljuca: [S.CITO], sapnik: [S.SLUZ, S.CITO], zelodec: [S.SLUZ, S.CITO], "tanko-crevo": [S.CITO],
  "debelo-crevo": [S.SLUZ, S.CITO], mehur: [S.CITO], arterija: [S.ELASTIN], vena: [S.KOLAGEN, S.CITO], zob: [S.SKLENINA],
};
// Točka (µm) blizu začetne sredine, kjer je značilna snov vsaj ~1 µm od roba (pri virusih ~20 nm), da je na ravni molekul
// vidna le ona. Izračunano z mrežo sond (docs/mikroskop.md »Molekule«); ob spremembi oblike preparata jo preračunaj.
export const ZNACILNA_TOCKA = {
  kri: [400.9, 0.9], "skeletna-misica": [-0.1, -1.1], "srcna-misica": [-0.1, 0.4], "gladka-misica": [-2.4, 59.9],
  "virus-t4": [-0.094, 0.554], "virus-sars": [0.046, -0.118], "virus-hiv": [1.95, 2.434], bakterije: [18.9, -4.4],
  kvasovke: [3.9, 24.6], ustne: [3.4, 6.6], list: [-17.9, 21.1], steblo: [-10.1, -11.9], koren: [-3.1, -799.9],
  reza: [0.6, -4.4], jetra: [-4.9, -4.4], bezgavka: [3.6, 2.1], jajcnik: [12.1, -1.9], modo: [-5.6, 5.6],
  zleza: [-31.9, -31.9], scitnica: [-1.1, 2.6], koza: [30.9, 285.1], zivec: [-8.1, -946.4],
  "bela-snov": [-30.4, -31.9], "mali-mozgani": [2.4, 7.6], pljuca: [7.4, -16.6], sapnik: [-9.6, 1123.6],
  zelodec: [7.9, 900.4], "tanko-crevo": [-5.6, 398.9], "debelo-crevo": [6.1, 796.1], mehur: [-11.6, 1181.6],
  arterija: [-740.3, 508.8], vena: [1132.3, 554.3], zob: [-13.6, 346.6],
};
// virusi (r1 v celice.js): 1 SARS-CoV-2, 2 HIV, 3 T4 (3,0 glava, 3,1 rep, 3,2 vlakna)
const virus = (r1) => Math.round(r1 * 10) / 10;

const SNOV_PRIZOR = {
  [S.PRAZNO]: "smola", [S.CITO]: "cito", [S.JEDRO]: "jedro", [S.KOLAGEN]: "kolagen", [S.MINERAL]: "kost", [S.ERITROCIT]: "kri",
  [S.LIPID]: "lipid", [S.MIOFIBRILA]: "miofibrila", [S.MIELIN]: "mielin", [S.MATRIKS]: "matriks", [S.KERATIN]: "keratin",
  [S.STENA]: "stenaR", [S.VAKUOLA]: "voda", [S.KOLOID]: "koloid", [S.PLAZMA]: "plazma", [S.ELASTIN]: "elastin",
  [S.SLUZ]: "sluz", [S.VIRUS]: "virus", [S.SKLENINA]: "sklenina", [S.MITO]: "mito", [S.ER]: "er", [S.GOLGI]: "golgi",
  [S.RIBOSOM]: "ribosom", [S.GLIKOGEN]: "glikogen", [S.MEMBRANA]: "cito", [S.KLOROPLAST]: "kloroplast",
  [S.GRANULA]: "granula", [S.KROMATIN]: "kromatin", [S.JEDRCE]: "jedrce", [S.MIKROVIL]: "mikrovil", [S.GENOM]: "t4dnk",
};

// Prizor za snov na eni strani: { ime, koda, mol: [id | null] }. o = { snov, tip, r1 } iz sonde, prep = id preparata.
export function prizor(o, prep) {
  const { snov, tip, r1 } = o;
  let ime = SNOV_PRIZOR[snov] || "cito";
  const v = virus(r1);
  if (snov === S.GENOM) ime = v === 1 ? "sarsRnp" : v === 2 ? "hivJedro" : "t4dnk";
  if (snov === S.VIRUS) ime = v === 2 ? "hivMatriks" : v === 3.1 ? "t4rep" : v === 3.2 ? "t4vlakno" : "virus";
  if ((snov === S.CITO || snov === S.MEMBRANA) && (tip === C.BAKTERIJA)) ime = "bakterija";
  if (snov === S.PLAZMA && (prep === "virus-sars" || prep === "virus-hiv")) ime = "voda"; // gojišče celične kulture, ne krvna plazma
  if (snov === S.STENA) ime = tip === C.BAKTERIJA ? "stenaB" : tip === C.KVASOVKA ? "stenaK" : "stenaR";
  const [koda, ...mol] = PRIZORI[ime];
  if (ime === "cito" || ime === "mikrovil") {
    if (tip === C.NEVRON || tip === C.NEVRIT) mol[5] = "nevrofilament";
    if (tip === C.KERATINOCIT) mol[5] = "keratin";
    if (tip === C.GLADKA) mol[5] = "dezmin";
    if (tip === C.MISICA || prep === "srcna-misica" || prep === "skeletna-misica") mol[4] = "mioglobin";
  }
  if (ime === "matriks" && prep === "hrustanec") mol.splice(1, 3, "agrekan", "hialuronan", "kolagen2");
  if (ime === "koloid" && prep === "leca") mol[1] = "kristalin";
  if (ime === "granula") mol[1] = prep === "mreznica" ? "melanin" : prep === "zleza" ? "zimogen" : "sekret";
  return { ime, koda, mol };
}

// Membrana med stranema a in b: { ime, koda, mol, zun (+1 zunanjost na strani A), bodice (razmik nm) }
export function membrana(a, b, prep) {
  const notri = (o) => o.snov === S.GENOM || o.snov === S.VIRUS;
  const va = virus(a.r1), vb = virus(b.r1);
  const zun = notri(a) && !notri(b) ? -1 : 1;
  const kaj = (ime, mol) => ({ ime, koda: MEMBRANE[ime][0], mol: mol || MEMBRANE[ime].slice(1), zun, bodice: 16 });
  if (notri(a) && notri(b) && va >= 3 && vb >= 3) return kaj("rob"); // glava ob repu: gumbi Hoc niso med DNK
  if ((a.snov === S.GENOM && va >= 3 && va < 3.05) || (b.snov === S.GENOM && vb >= 3 && vb < 3.05)) return kaj("t4");
  if ((a.snov === S.VIRUS && va > 3.05) || (b.snov === S.VIRUS && vb > 3.05)) return kaj("rob");
  if (notri(a) && notri(b)) return kaj(va === 2 || vb === 2 ? "p24" : "rob");
  if (notri(a) || notri(b)) {
    const hiv = (notri(a) ? va : vb) === 2;
    return { ...kaj("ovojnica", hiv ? ["fosfolipid", "env", "ma"] : ["fosfolipid", "spike", "mprot"]), bodice: hiv ? 60 : 16 };
  }
  const ob = (s) => a.snov === s || b.snov === s;
  // ATP-sintaza le v notranji membrani mitohondrija (na obeh straneh matriks), fotosistem le v tilakoidi; zunanja membrana in
  // ovojnica kloroplasta mejita na citoplazmo
  const obe = (s) => a.snov === s && b.snov === s;
  const bel = obe(S.MITO) ? "atpsintaza" : ob(S.MITO) ? "porin" : obe(S.KLOROPLAST) ? "fotosistem" : ob(S.ERITROCIT) ? "pas3"
    : [C.NEVRON, C.NEVRIT].includes(a.tip) || [C.NEVRON, C.NEVRIT].includes(b.tip) ? "crpalka" : "membelj";
  return kaj("dvosloj", ["fosfolipid", "holesterol", bel]);
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

// Uniforme za molekule.js in seznam rež (id molekule ali null) za oznake.
export function uniformeMolekul(a, b, mem, prep) {
  const pa = prizor(a, prep);
  const pb = prizor(b, prep);
  const m = mem ? membrana(a, b, prep) : { koda: 4, mol: [], zun: 1, bodice: 16 };
  const reze = new Array(16).fill(null);
  pa.mol.slice(0, 6).forEach((id, i) => (reze[i] = id));
  if (mem) pb.mol.slice(0, 6).forEach((id, i) => (reze[6 + i] = id));
  m.mol.slice(0, 4).forEach((id, i) => (reze[12 + i] = id));
  const barve = new Float32Array(48), gost = new Float32Array(16), at = new Float32Array(16);
  reze.forEach((id, i) => {
    const d = id && MOL[id];
    barve.set(d ? hex(d.barva) : [1, 1, 1], i * 3);
    gost[i] = d ? d.g : -1;
    at[i] = d ? d.at : 0;
  });
  return { pA: pa.koda, pB: pb.koda, memVrsta: m.koda, zun: m.zun, bodice: m.bodice, barve3: barve, gost, at, reze };
}
