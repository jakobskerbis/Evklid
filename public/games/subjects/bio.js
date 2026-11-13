// Pojmi za igre: bio (glej README.md v tej mapi).
export const AREAS = [
  ["bi_cel", { sl: "Celica", en: "The cell" }, "#22c55e"],
  ["bi_ded", { sl: "Delitev celic in dedovanje", en: "Cell division and inheritance" }, "#a855f7"],
  ["bi_dna", { sl: "DNK in beljakovine", en: "DNA and proteins" }, "#6366f1"],
  ["bi_clo", { sl: "Človeško telo", en: "The human body" }, "#ef4444"],
  ["bi_ene", { sl: "Fotosinteza in celično dihanje", en: "Photosynthesis and respiration" }, "#84cc16"],
  ["bi_eko", { sl: "Ekologija", en: "Ecology" }, "#14b8a6"],
  ["bi_raz", { sl: "Raznolikost, evolucija, mikrobi", en: "Diversity, evolution, microbes" }, "#f59e0b"],
];

// ---------- pomožne ----------
const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const SUBS = "₀₁₂₃₄₅₆₇₈₉", SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sub = (s) => String(s).replace(/\d/g, (d) => SUBS[d]);
const sup = (s) => String(s).replace(/\d/g, (d) => SUPS[d]).replace(/\+/g, "⁺").replace(/-/g, "⁻");
// "Ca3(PO4)2" → "Ca₃(PO₄)₂", "SO4^2-" → "SO₄²⁻", "->" → "→"
const F = (s) =>
  s
    .replace(/\^(\d*[+-])/g, (_, c) => sup(c))
    .replace(/([A-Za-z)\]])(\d+)/g, (_, l, d) => l + sub(d))
    .replace(/<=>/g, "⇌")
    .replace(/->/g, "→");
// "slovensko|english" → izbrani jezik
const L = (ctx, s) => (typeof s === "string" && s.includes("|") ? s.split("|")[ctx.lang === "sl" ? 0 : 1] : s);
// naloga: napačni brez podvajanja in brez pravilnega; najprej ws (tipične napake), nato pool
function mk(q, a, ws, pool = []) {
  const seen = new Set([String(a)]);
  const out = [];
  for (const w of [...ws, ...shuffle(pool)]) {
    if (w == null || w === "") continue;
    const s = String(w);
    if (!seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  if (out.length < 3) throw new Error("premalo napačnih: " + q);
  return { q, a: String(a), w: shuffle(out.slice(0, 3)) };
}
// celoštevilski odgovor; dopolni z bližnjimi nenegativnimi števili
function ints(q, a, ws, min = 0) {
  const near = [1, -1, 2, -2, 3, -3, 4, 5].map((d) => a + d).filter((x) => x >= min);
  return mk(q, String(a), ws.filter((x) => Number.isInteger(x) && x >= min).map(String), near.map(String));
}
// številski odgovor z enoto; napačni so tipične napake (števila), dopolni s faktorji
function numU(ctx, q, a, ws, unit = "") {
  const f = (x) => ctx.num(Math.round(x * 1000) / 1000) + (unit ? " " + unit : "");
  const ok = (x) => Number.isFinite(x) && x > 0 && Math.abs(x - a) > 1e-9 && Math.abs(Math.round(x * 1000) - x * 1000) < 1e-6;
  return mk(q, f(a), ws.filter(ok).map(f), [a * 2, a / 2, a * 10, a / 10, a + 1, a * 3].filter(ok).map(f));
}
// banka: [vprašanje, pravilni, napačni …] v obliki "sl|en"
// element kot seznam (npr. ["CO₂", "CH₄"]) se izbere ob vsakem vprašanju posebej
function bank(ctx, items) {
  const [q, a, ...ws] = pick(items).map((s) => L(ctx, Array.isArray(s) ? pick(s) : s));
  return mk(q, a, shuffle(ws));
}
// "Kateri je X?": pravilni iz yes, napačni iz no
function which(ctx, q, yes, no) {
  return mk(L(ctx, q), L(ctx, pick(yes)), shuffle(no).map((s) => L(ctx, s)));
}

const C = [];
const def = (id, area, year, sl, en, gen) => C.push({ id, area, year, name: { sl, en }, gen });

// banka po stopnjah: stopnja t vzame vse do t (raznolikost), novejše pogosteje
const tiered = (t, ...lists) => lists.slice(0, t).flatMap((l, i) => (i === t - 1 ? [...l, ...l] : l));
const pct = (x) => `${x} %`;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const frac = (p, q) => (p === 0 ? "0" : p === q ? "1" : `${p / gcd(p, q)}/${q / gcd(p, q)}`);

// ===== CELICA =====
const ORG = {
  nuc: "jedro|nucleus", mit: "mitohondrij|mitochondrion", chl: "kloroplast|chloroplast", rib: "ribosom|ribosome",
  mem: "celična membrana|cell membrane", wal: "celična stena|cell wall", vac: "vakuola|vacuole", gol: "Golgijev aparat|Golgi apparatus",
  ser: "gladki ER|smooth ER", lys: "lizosom|lysosome", nuo: "jedrce|nucleolus", cen: "centriol|centriole",
};
// [vprašanje, pravilni ključ, napačni ključi]
const ORGQ1 = [
  ["Organel, v katerem poteka fotosinteza?|Organelle where photosynthesis occurs?", "chl", ["mit", "rib", "nuc", "vac"]],
  ["Organel celičnega dihanja?|Organelle of cellular respiration?", "mit", ["chl", "rib", "gol", "lys"]],
  ["Organel, ki tvori beljakovine?|Organelle that makes proteins?", "rib", ["mit", "lys", "vac", "chl"]],
  ["Uravnava prehod snovi v celico?|Controls what enters the cell?", "mem", ["wal", "nuc", "rib", "vac"]],
  ["Celulozna ovojnica rastlinske celice?|Cellulose layer of a plant cell?", "wal", ["mem", "vac", "chl", "nuc"]],
  ["Hrani celični sok?|Stores cell sap?", "vac", ["nuc", "rib", "mit", "gol"]],
  ["Vsebuje kromosome, vodi celico?|Holds chromosomes, controls the cell?", "nuc", ["mit", "rib", "vac", "lys"]],
  ["Organel z zelenim klorofilom?|Organelle containing green chlorophyll?", "chl", ["mit", "vac", "nuc", "rib"]],
  ["»Elektrarna« celice?|The cell's “power station”?", "mit", ["chl", "nuc", "vac", "rib"]],
  ["Obdaja vsako celico?|Surrounds every cell?", "mem", ["wal", "vac", "chl", "nuc"]],
  ["Daje rastlinski celici trdnost in obliko?|Gives a plant cell its rigid shape?", "wal", ["mem", "rib", "mit", "nuc"]],
  ["Velik mehurček s celičnim sokom?|Large sac filled with cell sap?", "vac", ["nuc", "chl", "rib", "mit"]],
];
const ORGQ2 = [
  ["Pakira in razpošilja beljakovine?|Packages and ships proteins?", "gol", ["lys", "mit", "nuc", "vac"]],
  ["Razgrajuje odslužene dele celice?|Breaks down worn-out cell parts?", "lys", ["rib", "gol", "chl", "nuc"]],
  ["Sintetizira lipide?|Synthesizes lipids?", "ser", ["rib", "lys", "nuc", "vac"]],
  ["V jedru tvori ribosome?|Makes ribosomes inside the nucleus?", "nuo", ["mit", "lys", "gol", "cen"]],
  ["Tvori delitveno vreteno (živalska celica)?|Forms the spindle (animal cell)?", "cen", ["rib", "lys", "vac", "chl"]],
];
const ORGQ3 = [
  ["Ima svojo DNK, ni v živalski celici?|Has own DNA, absent in animal cells?", "chl", ["mit", "rib", "gol", "lys"]],
  ["Poleg jedra ima DNK v živalski celici še?|Besides the nucleus, DNA in animal cells is in?", "mit", ["rib", "lys", "gol", "cen"]],
  ["Notranja membrana mitohondrija tvori?|The inner mitochondrial membrane forms?", "kriste|cristae", ["tilakoide|thylakoids", "grane|grana", "mikrovile|microvilli"]],
  ["Membranski mešički kloroplasta?|Membrane sacs inside a chloroplast?", "tilakoidi|thylakoids", ["kriste|cristae", "lizosomi|lysosomes", "ribosomi|ribosomes"]],
];
const ORGFN = [
  ["mit", "celično dihanje|cell respiration"], ["chl", "fotosinteza|photosynthesis"], ["rib", "sinteza beljakovin|protein synthesis"],
  ["lys", "razgradnja snovi|breakdown of waste"], ["gol", "pakiranje beljakovin|packaging proteins"], ["nuc", "hrani dedni zapis|stores genetic info"],
];
def("b_org", "bi_cel", 9, "Celični organeli", "Cell organelles", (t, ctx) => {
  const O = (k) => L(ctx, ORG[k] || k);
  if (t === 2 && Math.random() < 0.4) {
    const i = R(0, ORGFN.length - 1);
    const nm = O(ORGFN[i][0]);
    return mk(`${nm[0].toUpperCase() + nm.slice(1)}: ${L(ctx, "naloga?|function?")}`, L(ctx, ORGFN[i][1]), shuffle(ORGFN.filter((_, j) => j !== i)).map((x) => L(ctx, x[1])));
  }
  const [q, a, ws] = pick(tiered(t, ORGQ1, ORGQ2, ORGQ3));
  return mk(L(ctx, q), O(a), shuffle(ws).map(O));
});

const CELLB1 = [
  ["Česa živalska celica nima?|What does an animal cell lack?", ["kloroplast|chloroplast", "celična stena|cell wall"], ["jedro|nucleus", "mitohondrij|mitochondrion", "ribosom|ribosome", "celična membrana|cell membrane"]],
  ["Kaj imata rastlinska in živalska celica?|Found in both plant and animal cells?", ["mitohondrij|mitochondrion", "jedro|nucleus", "ribosom|ribosome", "celična membrana|cell membrane"], ["kloroplast|chloroplast", "celična stena|cell wall", "osrednja vakuola|central vacuole"]],
  ["Kaj ima samo rastlinska celica?|Found only in plant cells?", ["kloroplast|chloroplast", "celična stena|cell wall"], ["mitohondrij|mitochondrion", "jedro|nucleus", "ribosom|ribosome", "celična membrana|cell membrane"]],
  ["Kaj ima živalska celica?|What does an animal cell have?", ["jedro|nucleus", "mitohondrij|mitochondrion", "celična membrana|cell membrane", "ribosom|ribosome"], ["kloroplast|chloroplast", "celična stena|cell wall", "osrednja vakuola|central vacuole"]],
  ["Kaj obdaja vsako celico?|What surrounds every cell?", ["celična membrana|cell membrane"], ["celična stena|cell wall", "kloroplast|chloroplast", "jedro|nucleus", "vakuola|vacuole"]],
  ["Organel s klorofilom?|Organelle containing chlorophyll?", ["kloroplast|chloroplast"], ["mitohondrij|mitochondrion", "jedro|nucleus", "vakuola|vacuole", "ribosom|ribosome"]],
  ["Poltekoča vsebina celice?|Jelly-like fluid inside a cell?", ["citoplazma|cytoplasm"], ["jedro|nucleus", "celična stena|cell wall", "kloroplast|chloroplast", "ribosom|ribosome"]],
  ["Najmanjša enota življenja?|Smallest unit of life?", ["celica|cell"], ["atom|atom", "molekula|molecule", "organ|organ", "tkivo|tissue"]],
  ["Skupina podobnih celic je?|A group of similar cells is a?", ["tkivo|tissue"], ["organ|organ", "organel|organelle", "organizem|organism", "organski sistem|organ system"]],
  ["Kateri organizem je enoceličar?|Which organism is single-celled?", ["ameba|amoeba", "bakterija|bacterium", "kvasovka|yeast", "evglena|euglena"], ["deževnik|earthworm", "mah|moss", "hrast|oak", "žaba|frog", "praprot|fern"]],
  ["Kateri organizem je mnogoceličar?|Which organism is multicellular?", ["mah|moss", "hrast|oak", "žaba|frog", "deževnik|earthworm"], ["ameba|amoeba", "bakterija|bacterium", "kvasovka|yeast", "evglena|euglena"]],
  ["Naprava za opazovanje celic?|Instrument for observing cells?", ["mikroskop|microscope"], ["teleskop|telescope", "periskop|periscope", "stetoskop|stethoscope"]],
];
const CELLB2 = [
  ["Česa bakterija nima?|What does a bacterium lack?", ["jedro|nucleus", "mitohondrij|mitochondrion"], ["ribosom|ribosome", "celična membrana|cell membrane", "DNK|DNA", "citoplazma|cytoplasm"]],
  ["Kaj ima bakterija?|What does a bacterium have?", ["ribosom|ribosome", "celična membrana|cell membrane", "DNK|DNA"], ["jedro|nucleus", "mitohondrij|mitochondrion", "kloroplast|chloroplast", "Golgijev aparat|Golgi apparatus"]],
  ["Kateri organizem je prokariont?|Which organism is a prokaryote?", ["bakterija|bacterium", "cianobakterija|cyanobacterium"], ["kvasovka|yeast", "ameba|amoeba", "plesen|mould", "mah|moss"]],
  ["Kateri organizem je evkariont?|Which organism is a eukaryote?", ["kvasovka|yeast", "ameba|amoeba", "mah|moss"], ["bakterija|bacterium", "cianobakterija|cyanobacterium", "virus|virus"]],
];
const CELLB3 = [
  ["Celično steno gliv gradi?|Fungal cell walls are made of?", ["hitin|chitin"], ["celuloza|cellulose", "peptidoglikan|peptidoglycan", "škrob|starch"]],
  ["Celično steno bakterij gradi?|Bacterial cell walls are made of?", ["peptidoglikan|peptidoglycan"], ["celuloza|cellulose", "hitin|chitin", "škrob|starch"]],
  ["Celično steno rastlin gradi?|Plant cell walls are made of?", ["celuloza|cellulose"], ["hitin|chitin", "peptidoglikan|peptidoglycan", "glikogen|glycogen"]],
  ["Ribosomi prokariontov?|Prokaryotic ribosomes?", ["70S"], ["80S", "60S", "40S"]],
  ["Ribosomi v citoplazmi evkariontov?|Eukaryotic cytoplasmic ribosomes?", ["80S"], ["70S", "50S", "30S"]],
  ["Plazmid je?|A plasmid is?", ["krožna DNK|circular DNA"], ["beljakovina|a protein", "ribosom|a ribosome", "celična stena|a cell wall"]],
  ["Bički bakterij služijo za?|Bacterial flagella are for?", ["gibanje|movement"], ["fotosintezo|photosynthesis", "delitev|division", "dihanje|respiration"]],
];
def("b_cell", "bi_cel", 9, "Rastlinska, živalska in bakterijska celica", "Plant, animal and bacterial cells", (t, ctx) => {
  const [q, yes, no] = pick(tiered(t, CELLB1, CELLB2, CELLB3));
  return which(ctx, q, yes, no);
});

def("b_micro", "bi_cel", 9, "Mikroskop in velikost celic", "Microscope and cell size", (t, ctx) => {
  const sl = ctx.lang === "sl";
  if (t === 1) {
    const o = pick([5, 10, 15]), b = pick([4, 10, 40, 100]);
    const x = (n) => `${n}×`;
    return mk(sl ? `Okular ${o}×, objektiv ${b}×: povečava?` : `Eyepiece ${o}×, objective ${b}×: magnification?`, x(o * b), [x(o + b), x(b), x(o * b * 10), x(b / o)].filter((s) => !s.includes(".")));
  }
  if (t === 2) {
    const um = pick([2, 5, 8, 10, 20, 25, 50, 100, 200, 500]);
    if (Math.random() < 0.5) return numU(ctx, `${ctx.num(um / 1000)} mm = ? µm`, um, [um / 10, um * 10, um / 1000, um * 1000], "µm");
    return numU(ctx, `${um} µm = ? mm`, um / 1000, [um / 100, um / 10000, um * 1000, um / 10], "mm");
  }
  for (;;) {
    const img = pick([2, 4, 5, 6, 8, 10, 12, 20, 40]), M = pick([40, 100, 200, 400, 1000]), real = (img * 1000) / M;
    if (!Number.isInteger(real * 10)) continue;
    const q = sl ? `Slika ${img} mm, povečava ${M}×: prava velikost?` : `Image ${img} mm, magnification ${M}×: real size?`;
    return numU(ctx, q, real, [real * 10, real / 10, real * 1000, img * M], "µm");
  }
});

// ===== DELITEV CELIC IN DEDOVANJE =====
const DIV1 = [
  ["Koliko celic nastane pri mitozi?|How many cells does mitosis make?", "2", "4", "1", "8"],
  ["Koliko celic nastane pri mejozi?|How many cells does meiosis make?", "4", "2", "1", "8"],
  ["Celici po mitozi sta?|Cells after mitosis are?", "genetsko enaki|identical copies", "haploidni|haploid", "genetsko različni|genetically unique", "brez jedra|without a nucleus"],
  ["Celice po mejozi so?|Cells after meiosis are?", "haploidne|haploid", "diploidne|diploid", "enake materinski|same as parent", "triploidne|triploid"],
  ["Z mejozo nastanejo?|Meiosis produces?", "spolne celice|gametes", "kožne celice|skin cells", "krvne celice|blood cells", "živčne celice|nerve cells"],
  ["Z mitozo telo?|Mitosis lets the body?", "raste in se obnavlja|grow and repair", "tvori spolne celice|make gametes", "razgrajuje hrano|digest food", "diha|breathe"],
  ["Mejoza poteka v?|Meiosis takes place in the?", "spolnih žlezah|sex organs", "koži|skin", "jetrih|liver", "kosteh|bones"],
  ["Združitev jajčne celice in semenčice?|Fusion of an egg and a sperm cell?", "oploditev|fertilisation", "opraševanje|pollination", "mejoza|meiosis", "mitoza|mitosis"],
  ["Oplojena jajčna celica je?|A fertilised egg cell is a?", "zigota|zygote", "gameta|gamete", "semenčica|sperm cell", "kromosom|chromosome"],
  ["Celica z enim kompletom kromosomov?|Cell with one set of chromosomes?", "haploidna|haploid", "diploidna|diploid", "triploidna|triploid", "tetraploidna|tetraploid"],
  ["Pri mitozi se število kromosomov?|In mitosis the chromosome number?", "ohrani|stays the same", "razpolovi|is halved", "podvoji|is doubled", "potroji|is tripled"],
  ["Pri mejozi se število kromosomov?|In meiosis the chromosome number?", "razpolovi|is halved", "ohrani|stays the same", "podvoji|is doubled", "potroji|is tripled"],
];
const DIV2 = [
  ["Faza: kromosomi v ekvatorialni ravnini?|Phase: chromosomes line up at the equator?", "metafaza|metaphase", "profaza|prophase", "anafaza|anaphase", "telofaza|telophase"],
  ["Faza: sestrski kromatidi se ločita?|Phase: sister chromatids separate?", "anafaza|anaphase", "metafaza|metaphase", "profaza|prophase", "telofaza|telophase"],
  ["Faza: kromosomi se zgostijo?|Phase: chromosomes condense?", "profaza|prophase", "anafaza|anaphase", "telofaza|telophase", "metafaza|metaphase"],
  ["Faza: nastaneta novi jedrni ovojnici?|Phase: two new nuclear envelopes form?", "telofaza|telophase", "profaza|prophase", "metafaza|metaphase", "anafaza|anaphase"],
  ["Faza, v kateri se DNK podvoji?|Phase in which DNA is copied?", "interfaza|interphase", "profaza|prophase", "metafaza|metaphase", "anafaza|anaphase"],
];
const DIV3 = [
  ["Faza prekrižanja (crossing-over)?|Phase of crossing over?", "profaza I|prophase I", "metafaza II|metaphase II", "anafaza II|anaphase II", "telofaza I|telophase I"],
  ["Faza: homologna kromosoma se ločita?|Phase: homologous chromosomes separate?", "anafaza I|anaphase I", "anafaza II|anaphase II", "metafaza I|metaphase I", "profaza II|prophase II"],
  ["Delitev citoplazme se imenuje?|Division of the cytoplasm is called?", "citokineza|cytokinesis", "kariokineza|karyokinesis", "replikacija|replication", "transkripcija|transcription"],
  ["Par homolognih kromosomov v mejozi I?|Paired homologues in meiosis I?", "bivalent (tetrada)|bivalent (tetrad)", "kromatida|chromatid", "centromera|centromere", "gameta|gamete"],
];
def("b_div", "bi_ded", 9, "Mitoza in mejoza", "Mitosis and meiosis", (t, ctx) => bank(ctx, tiered(t, DIV1, DIV2, DIV3)));

// [ime sl|en, 2n]
const KARYO = [["pes|dog", 78], ["mačka|cat", 38], ["konj|horse", 64], ["govedo|cattle", 60], ["prašič|pig", 38], ["vinska mušica|fruit fly", 8], ["koruza|maize", 20], ["grah|pea", 14], ["riž|rice", 24], ["paradižnik|tomato", 24], ["miš|mouse", 40], ["čebula|onion", 16], ["šimpanz|chimpanzee", 48]];
def("b_chrom", "bi_ded", 10, "Število kromosomov", "Chromosome numbers", (t, ctx) => {
  const sl = ctx.lang === "sl";
  if (t === 1) {
    return bank(ctx, [
      ["Kromosomi v človeški telesni celici?|Chromosomes in a human body cell?", "46", "23", "44", "92"],
      ["Kromosomi v človeški spolni celici?|Chromosomes in a human gamete?", "23", "46", "22", "92"],
      ["Pari kromosomov pri človeku?|Pairs of chromosomes in humans?", "23", "46", "22", "44"],
      ["Avtosomi v človeški telesni celici?|Autosomes in a human body cell?", "44", "46", "22", "23"],
      ["Spolna kromosoma moškega?|Sex chromosomes of a male?", "XY", "XX", "YY", "X"],
      ["Spolna kromosoma ženske?|Sex chromosomes of a female?", "XX", "XY", "YY", "Y"],
      ["Spolni kromosom v vsakem jajčecu?|Sex chromosome in every egg cell?", "X", "Y", "XY", "XX"],
      ["Kromosomi v človeški zigoti?|Chromosomes in a human zygote?", "46", "23", "92", "44"],
      ["Kromosomi v človeški semenčici?|Chromosomes in a human sperm cell?", "23", "46", "22", "92"],
      ["Spolni kromosom v človeški semenčici?|Sex chromosome in a human sperm cell?", sl ? "X ali Y" : "X or Y", sl ? "le Y" : "only Y", "XY", "XX"],
      ["Spolni kromosomi v človeški telesni celici?|Sex chromosomes in a human body cell?", "2", "1", "23", "46"],
      ["Avtosomi v človeški spolni celici?|Autosomes in a human gamete?", "22", "23", "44", "11"],
    ]);
  }
  const [nm, n2] = pick(KARYO), n = n2 / 2;
  const who = `${L(ctx, nm)[0].toUpperCase()}${L(ctx, nm).slice(1)} (2n = ${n2})`;
  if (t === 2) {
    return Math.random() < 0.5
      ? ints(sl ? `${who}: kromosomi v spolni celici?` : `${who}: chromosomes in a gamete?`, n, [n2, n2 * 2, n - 1, n + 1], 1)
      : ints(sl ? `${who}: kromosomi v celici po mitozi?` : `${who}: chromosomes per cell after mitosis?`, n2, [n, n2 * 2, n2 - 1], 1);
  }
  const k = R(0, 2);
  if (k === 0) return ints(sl ? `${who}: kromatide v metafazi mitoze?` : `${who}: chromatids in mitotic metaphase?`, n2 * 2, [n2, n, n2 * 4], 1);
  if (k === 1) return ints(sl ? `${who}: bivalenti v profazi I?` : `${who}: bivalents in prophase I?`, n, [n2, n2 * 2, n / 2 === Math.floor(n / 2) ? n / 2 : n + 1], 1);
  return ints(sl ? `${who}: kromosomi po mejozi I?` : `${who}: chromosomes per cell after meiosis I?`, n, [n2, n2 * 2, n - 1], 1);
});

// križanja (kombinacijski kvadrat)
const gametes = (g) => [g[0], g[1]];
const norm = (a, b) => (a === a.toUpperCase() && b !== b.toUpperCase() ? a + b : b === b.toUpperCase() && a !== a.toUpperCase() ? b + a : [a, b].sort().join(""));
function cross1(p1, p2) {
  const out = [];
  for (const a of gametes(p1)) for (const b of gametes(p2)) out.push(norm(a, b));
  return out; // 4 enako verjetni
}
const PCTS = [0, 25, 50, 75, 100];
function pctQ(q, p) {
  const ws = [100 - p, p === 25 ? 75 : 25, p === 50 ? 25 : 50, 0, 100].filter((x) => x !== p);
  return mk(q, pct(p), ws.map(pct), PCTS.filter((x) => x !== p).map(pct));
}
const RATIOS = ["3 : 1", "1 : 1", "1 : 2 : 1", "9 : 3 : 3 : 1", "1 : 3", "2 : 1"];
def("b_punnett", "bi_ded", 9, "Križanja in verjetnosti", "Crosses and probabilities", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const X = pick(["A", "B", "R", "D", "T"]), x = X.toLowerCase();
  const G = [X + X, X + x, x + x];
  if (t === 1) {
    const p1 = pick(G), p2 = pick(G.slice(1));
    const kids = cross1(p1, p2);
    const k = R(0, 2);
    const cnt = (f) => (kids.filter(f).length * 100) / 4;
    if (k === 0) return pctQ(sl ? `${p1} × ${p2}: verjetnost ${x + x}?` : `${p1} × ${p2}: probability of ${x + x}?`, cnt((g) => g === x + x));
    if (k === 1) return pctQ(sl ? `${p1} × ${p2}: verjetnost ${X + x}?` : `${p1} × ${p2}: probability of ${X + x}?`, cnt((g) => g === X + x));
    return pctQ(sl ? `${p1} × ${p2}: verjetnost dominantnega fenotipa?` : `${p1} × ${p2}: probability of dominant phenotype?`, cnt((g) => g.includes(X)));
  }
  if (t === 2) {
    const k = R(0, 3);
    if (k === 0) {
      const [p1, p2, a] = pick([[X + x, X + x, "3 : 1"], [X + x, x + x, "1 : 1"]]);
      return mk(sl ? `${p1} × ${p2}: razmerje fenotipov?` : `${p1} × ${p2}: phenotype ratio?`, a, RATIOS.filter((r) => r !== a));
    }
    if (k === 1) {
      const [p1, p2] = pick([[X + x, X + x], [X + x, x + x], [X + X, X + x], [X + X, x + x]]);
      const kids = cross1(p1, p2), c = G.map((g) => kids.filter((k2) => k2 === g).length);
      const g0 = c.reduce((a, b) => gcd(a, b));
      const r = c.map((v) => v / g0).join(" : ");
      const ws = ["1 : 2 : 1", "1 : 1 : 0", "0 : 1 : 1", "1 : 0 : 1", "0 : 1 : 0", "3 : 0 : 1", "2 : 1 : 1"].filter((s) => s !== r);
      return mk(sl ? `${p1} × ${p2}: ${G.join(" : ")}?` : `${p1} × ${p2}: ${G.join(" : ")}?`, r, shuffle(ws));
    }
    if (k === 2) {
      // nepopolna dominanca: RR rdeča, Rr rožnata, rr bela
      const [p1, p2] = pick([["Rr", "Rr"], ["RR", "rr"], ["Rr", "rr"], ["RR", "Rr"]]);
      const kids = cross1(p1, p2), p = (kids.filter((g) => g === "Rr").length * 100) / 4;
      return pctQ(sl ? `Nepopolna dominanca, ${p1} × ${p2}: delež rožnatih?` : `Incomplete dominance, ${p1} × ${p2}: share pink?`, p);
    }
    return bank(ctx, [
      [`${X + X} × ${x + x}: F1?`, sl ? `vsi ${X + x}` : `all ${X + x}`, sl ? `vsi ${X + X}` : `all ${X + X}`, sl ? `vsi ${x + x}` : `all ${x + x}`, `1 ${X + X} : 1 ${x + x}`],
      [sl ? `Rdeča (RR) × bela (rr), nepopolna dominanca: F1?` : `Red (RR) × white (rr), incomplete dominance: F1?`, sl ? "vsi rožnati" : "all pink", sl ? "vsi rdeči" : "all red", sl ? "vsi beli" : "all white", sl ? "rdeči in beli" : "red and white"],
    ]);
  }
  // dihibridno križanje in na X vezano dedovanje
  const k = R(0, 3);
  if (k === 0) {
    const [p1, p2, a] = pick([["AaBb", "AaBb", "9 : 3 : 3 : 1"], ["AaBb", "aabb", "1 : 1 : 1 : 1"]]);
    return mk(sl ? `${p1} × ${p2}: razmerje fenotipov?` : `${p1} × ${p2}: phenotype ratio?`, a, ["9 : 3 : 3 : 1", "1 : 1 : 1 : 1", "3 : 1", "1 : 2 : 1", "9 : 7"].filter((r) => r !== a));
  }
  if (k === 1) {
    const P = [["AaBb", "AaBb"], ["AaBb", "aabb"], ["AaBb", "Aabb"], ["AABb", "aaBb"], ["Aabb", "aaBb"]];
    const [p1, p2] = pick(P);
    const kidsA = cross1(p1.slice(0, 2), p2.slice(0, 2)), kidsB = cross1(p1.slice(2), p2.slice(2));
    const dom = R(0, 1) === 0;
    const fa = kidsA.filter((g) => (dom ? g.includes("A") : g === "aa")).length, fb = kidsB.filter((g) => (dom ? g.includes("B") : g === "bb")).length;
    const right = frac(fa * fb, 16);
    const q = sl ? `${p1} × ${p2}: delež ${dom ? "A_B_" : "aabb"}?` : `${p1} × ${p2}: share of ${dom ? "A_B_" : "aabb"}?`;
    return mk(q, right, ["9/16", "1/16", "3/16", "1/4", "3/8", "1/2", "3/4", "1/8"].filter((s) => s !== right));
  }
  const H = "ᴴ", h = "ʰ";
  const [m, f] = pick([[H + h, H], [H + h, h], [h + h, H], [H + H, h]]);
  // otroci: hči dobi X od očeta, sin dobi Y
  let ill = 0;
  for (const a of m) for (const b of [f, "Y"]) if (a === h && (b === h || b === "Y")) ill++;
  const p = (ill * 100) / 4;
  const q = sl ? `Hemofilija, X${m[0]}X${m[1]} × X${f}Y: verjetnost bolnega otroka?` : `Haemophilia, X${m[0]}X${m[1]} × X${f}Y: probability of an affected child?`;
  return pctQ(q, p);
});

const BG = { AB: ["IᴬIᴮ"], A: ["IᴬIᴬ", "Iᴬi"], B: ["IᴮIᴮ", "Iᴮi"], O: ["ii"] };
const bgName = (ctx, k) => (k === "O" ? (ctx.lang === "sl" ? "0" : "O") : k);
const bgOf = (g) => (g.includes("ᴬ") && g.includes("ᴮ") ? "AB" : g.includes("ᴬ") ? "A" : g.includes("ᴮ") ? "B" : "O");
def("b_blood", "bi_ded", 9, "Krvne skupine", "Blood groups", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const N = (k) => bgName(ctx, k);
  if (t === 1) {
    return bank(ctx, [
      ["Univerzalni dajalec (sistem AB0)?|Universal donor (ABO)?", N("O"), "AB", "A", "B"],
      ["Univerzalni prejemnik (sistem AB0)?|Universal recipient (ABO)?", "AB", N("O"), "A", "B"],
      ["Skupina z antigenoma A in B?|Group with both A and B antigens?", "AB", N("O"), "A", "B"],
      ["Skupina brez antigenov A in B?|Group with no A or B antigens?", N("O"), "AB", "A", "B"],
      ["Protitelesa anti-A in anti-B ima skupina?|Has both anti-A and anti-B antibodies?", N("O"), "AB", "A", "B"],
      ["Skupina A ima v plazmi protitelesa?|Group A plasma contains?", "anti-B", "anti-A", sl ? "anti-A in anti-B" : "anti-A and anti-B", sl ? "nobenih" : "none"],
      ["Skupina AB ima v plazmi protitelesa?|Group AB plasma contains?", sl ? "nobenih" : "none", "anti-A", "anti-B", sl ? "anti-A in anti-B" : "anti-A and anti-B"],
      ["Skupina B ima v plazmi protitelesa?|Group B plasma contains?", "anti-A", "anti-B", sl ? "anti-A in anti-B" : "anti-A and anti-B", sl ? "nobenih" : "none"],
      [`Skupina ${N("O")} ima v plazmi protitelesa?|Group O plasma contains?`, sl ? "anti-A in anti-B" : "anti-A and anti-B", "anti-A", "anti-B", sl ? "nobenih" : "none"],
      ["Skupina le z antigenom A?|Group with antigen A only?", "A", "AB", "B", N("O")],
      ["Skupina le z antigenom B?|Group with antigen B only?", "B", "AB", "A", N("O")],
      ["Število krvnih skupin sistema AB0?|Number of groups in the ABO system?", "4", "2", "3", "8"],
    ]);
  }
  const pairs = Object.entries(BG).flatMap(([k, gs]) => gs.map((g) => [g, k]));
  if (t === 2) {
    if (Math.random() < 0.6) {
      const [g, k] = pick(pairs);
      return mk(sl ? `Genotip ${g}: krvna skupina?` : `Genotype ${g}: blood group?`, N(k), ["A", "B", "AB", "O"].filter((x) => x !== k).map(N));
    }
    const k = pick(["AB", "O"]);
    return mk(sl ? `Krvna skupina ${N(k)}: genotip?` : `Blood group ${N(k)}: genotype?`, BG[k][0], ["IᴬIᴮ", "ii", "Iᴬi", "Iᴮi", "IᴬIᴬ"].filter((x) => x !== BG[k][0]));
  }
  const [g1] = pick(pairs), [g2] = pick(pairs);
  const al = (g) => g.match(/I[ᴬᴮ]|i/g);
  const kids = [];
  for (const a of al(g1)) for (const b of al(g2)) kids.push(bgOf(a + b));
  const target = pick(["A", "B", "AB", "O"]);
  const p = (kids.filter((k) => k === target).length * 100) / 4;
  return pctQ(sl ? `${g1} × ${g2}: verjetnost skupine ${N(target)}?` : `${g1} × ${g2}: probability of group ${N(target)}?`, p);
});

const GEN1 = [
  ["Različici istega gena sta?|Versions of the same gene are?", "alela|alleles", "kromosoma|chromosomes", "genotipa|genotypes", "kromatidi|chromatids"],
  ["Genotip AA je?|Genotype AA is?", "homozigoten|homozygous", "heterozigoten|heterozygous", "haploiden|haploid", "recesiven|recessive"],
  ["Genotip Aa je?|Genotype Aa is?", "heterozigoten|heterozygous", "homozigoten|homozygous", "haploiden|haploid", "recesiven|recessive"],
  ["Opazna lastnost organizma?|Observable trait of an organism?", "fenotip|phenotype", "genotip|genotype", "alel|allele", "kromosom|chromosome"],
  ["Alel, ki se izrazi tudi pri Aa?|Allele that shows in Aa?", "dominantni|dominant", "recesivni|recessive", "mutirani|mutant", "spolni|sex-linked"],
  ["Gen je odsek?|A gene is a section of?", "DNK|DNA", "beljakovine|protein", "membrane|membrane", "ribosoma|ribosome"],
  ["Genotip aa je?|Genotype aa is?", "homozigoten|homozygous", "heterozigoten|heterozygous", "haploiden|haploid", "dominanten|dominant"],
  ["Geni so na?|Genes are located on?", "kromosomih|chromosomes", "ribosomih|ribosomes", "membranah|membranes", "vakuolah|vacuoles"],
  ["Dedni zapis je shranjen v?|Genetic information is stored in?", "DNK|DNA", "beljakovinah|proteins", "maščobah|fats", "škrobu|starch"],
  ["Oznaka recesivnega alela?|How is a recessive allele written?", "mala črka|small letter", "velika črka|capital letter", "zvezdica|a star", "številka|a number"],
  ["Oznaka dominantnega alela?|How is a dominant allele written?", "velika črka|capital letter", "mala črka|small letter", "zvezdica|a star", "številka|a number"],
  ["Genotip in okolje skupaj določata?|Genotype and environment determine the?", "fenotip|phenotype", "kariotip|karyotype", "alel|allele", "genom|genome"],
];
const GEN2 = [
  ["Trajna sprememba DNK?|A permanent change in DNA?", "mutacija|mutation", "replikacija|replication", "transkripcija|transcription", "translacija|translation"],
  ["Spol otroka določi?|A child's sex is determined by the?", "semenčica|sperm", "jajčna celica|egg cell", "maternica|uterus", "posteljica|placenta"],
  ["Alel, ki se izrazi le pri aa?|Allele that shows only in aa?", "recesivni|recessive", "dominantni|dominant", "kodominantni|codominant", "letalni|lethal"],
  ["Skupek vseh genov organizma?|All the genes of an organism?", "genom|genome", "fenotip|phenotype", "alel|allele", "kariotip|karyotype"],
];
const GEN3 = [
  ["Trisomija pomeni, da je kromosom?|Trisomy means a chromosome is present?", "trikrat|three times", "dvakrat|twice", "enkrat|once", "štirikrat|four times"],
  ["Na X vezana recesivna bolezen?|An X-linked recessive disease?", "hemofilija|haemophilia", "trisomija 21|trisomy 21", "cistična fibroza|cystic fibrosis", "gripa|flu"],
  ["Dedovanje krvnih skupin A in B v AB?|A and B both shown in group AB is?", "kodominanca|codominance", "nepopolna dominanca|incomplete dominance", "recesivnost|recessiveness", "mutacija|mutation"],
  ["Razporeditev kromosomov po velikosti?|Chromosomes arranged by size?", "kariogram|karyogram", "genom|genome", "fenotip|phenotype", "rodovnik|pedigree"],
];
def("b_gen", "bi_ded", 9, "Genetski pojmi", "Genetics terms", (t, ctx) => bank(ctx, tiered(t, GEN1, GEN2, GEN3)));

// ===== DNK IN BELJAKOVINE =====
const DNA_C = { A: "T", T: "A", G: "C", C: "G" };
const RNA_C = { A: "U", T: "A", G: "C", C: "G", U: "A" };
const WRONG = { A: "G", G: "A", T: "C", C: "T", U: "C" }; // zamenjani pari
const mapS = (s, m) => [...s].map((c) => m[c]).join("");
function seq(n, alphabet = "ATGC", need = "A") {
  for (;;) {
    const s = Array.from({ length: n }, () => pick([...alphabet])).join("");
    if (s.includes(need)) return s;
  }
}
const PAIRB = [
  ["Komplementarni bazi povezujejo?|Paired bases are held together by?", "vodikove vezi|hydrogen bonds", "ionske vezi|ionic bonds", "peptidne vezi|peptide bonds", "kovinske vezi|metallic bonds"],
  ["Oblika molekule DNK?|Shape of a DNA molecule?", "dvojna vijačnica|double helix", "enojna veriga|single strand", "trojna vijačnica|triple helix", "ravna ploskev|flat sheet"],
  ["Gradnik DNK?|Building block of DNA?", "nukleotid|nucleotide", "aminokislina|amino acid", "glukoza|glucose", "maščobna kislina|fatty acid"],
  ["Število različnih baz v DNK?|Number of different bases in DNA?", "4", "2", "3", "20"],
  ["Baza, ki je ni v DNK?|Base not found in DNA?", "uracil|uracil", "timin|thymine", "adenin|adenine", "gvanin|guanine"],
];
def("b_pair", "bi_dna", 9, "Komplementarne baze DNK", "Complementary DNA bases", (t, ctx) => {
  const sl = ctx.lang === "sl";
  if (t === 1) {
    if (Math.random() < 0.4) return bank(ctx, PAIRB);
    const b = pick(["A", "T", "G", "C"]);
    return mk(sl ? `Komplementarna baza k ${b} v DNK?` : `Base pairing with ${b} in DNA?`, DNA_C[b], ["A", "T", "G", "C", "U"].filter((x) => x !== DNA_C[b]));
  }
  if (t === 2) {
    const s = seq(R(5, 6)), a = mapS(s, DNA_C);
    return mk(`${sl ? "DNK" : "DNA"} 5′-${s}-3′ → 3′-?-5′`, a, [a.replace(/T/g, "U"), mapS(s, WRONG), s, mapS(s, { A: "U", T: "A", G: "C", C: "G" })]);
  }
  const A = pick([10, 15, 20, 22, 24, 26, 28, 30, 32, 35, 40]), G = 50 - A;
  const k = R(0, 2);
  const q = (x) => (sl ? `DNK: ${A} % A → delež ${x}?` : `DNA: ${A} % A → share of ${x}?`);
  if (k === 0) return mk(q("T"), pct(A), [pct(G), pct(100 - A), pct(2 * A), pct(100 - 2 * A)]);
  if (k === 1) return mk(q("G"), pct(G), [pct(A), pct(100 - A), pct(100 - 2 * A), pct(2 * A)]);
  return mk(q("G + C"), pct(100 - 2 * A), [pct(G), pct(A), pct(100 - A), pct(2 * A)]);
});

const MRNA1 = [
  ["Mesto transkripcije pri evkariontih?|Site of transcription in eukaryotes?", "jedro|nucleus", "ribosom|ribosome", "Golgijev aparat|Golgi apparatus", "lizosom|lysosome"],
  ["Mesto translacije?|Site of translation?", "ribosom|ribosome", "jedro|nucleus", "lizosom|lysosome", "vakuola|vacuole"],
  ["Sladkor v RNK?|Sugar in RNA?", "riboza|ribose", "deoksiriboza|deoxyribose", "glukoza|glucose", "fruktoza|fructose"],
  ["Sladkor v DNK?|Sugar in DNA?", "deoksiriboza|deoxyribose", "riboza|ribose", "glukoza|glucose", "saharoza|sucrose"],
  ["Baza, ki je le v RNK?|Base found only in RNA?", "uracil|uracil", "timin|thymine", "adenin|adenine", "gvanin|guanine"],
  ["Baza, ki je le v DNK?|Base found only in DNA?", "timin|thymine", "uracil|uracil", "adenin|adenine", "citozin|cytosine"],
  ["Prepis DNK v mRNK je?|Copying DNA into mRNA is?", "transkripcija|transcription", "translacija|translation", "replikacija|replication", "mutacija|mutation"],
  ["Sinteza beljakovine po mRNK je?|Making a protein from mRNA is?", "translacija|translation", "transkripcija|transcription", "replikacija|replication", "mejoza|meiosis"],
  ["Podvajanje DNK je?|Copying of DNA before division is?", "replikacija|replication", "transkripcija|transcription", "translacija|translation", "mutacija|mutation"],
  ["Kodoni so zapisani na?|Codons are carried by the?", "mRNK|mRNA", "tRNK|tRNA", "beljakovini|protein", "lipidu|lipid"],
  ["Antikodon je na?|An anticodon is on the?", "tRNK|tRNA", "mRNK|mRNA", "DNK|DNA", "beljakovini|protein"],
  ["Število verig v molekuli DNK?|Strands in a DNA molecule?", "2", "1", "3", "4"],
  ["Število verig v molekuli mRNK?|Strands in an mRNA molecule?", "1", "2", "3", "4"],
];
def("b_mrna", "bi_dna", 12, "Transkripcija (DNK → mRNK)", "Transcription (DNA → mRNA)", (t, ctx) => {
  const sl = ctx.lang === "sl";
  if (t === 1) {
    if (Math.random() < 0.6) return bank(ctx, MRNA1);
    const b = pick(["A", "T", "G", "C"]);
    return mk(sl ? `Baza v mRNK nasproti ${b} v DNK?` : `mRNA base opposite DNA ${b}?`, RNA_C[b], ["A", "U", "G", "C", "T"].filter((x) => x !== RNA_C[b]));
  }
  const s = seq(6);
  if (t === 2) {
    const a = mapS(s, RNA_C);
    return mk(sl ? `Matrična DNK 3′-${s}-5′ → mRNK?` : `Template DNA 3′-${s}-5′ → mRNA?`, a, [mapS(s, DNA_C), s, s.replace(/T/g, "U"), mapS(s, WRONG)]);
  }
  const c = seq(6, "ATGC", "T"), a = c.replace(/T/g, "U");
  return mk(sl ? `Kodirajoča DNK 5′-${c}-3′ → mRNK?` : `Coding DNA 5′-${c}-3′ → mRNA?`, a, [mapS(c, RNA_C), mapS(c, DNA_C), c, mapS(a, WRONG)]);
});

// [kodon, aminokislina] – standardni genski kod
const CODONS = [["AUG", "Met"], ["UUU", "Phe"], ["UUC", "Phe"], ["GGC", "Gly"], ["GGG", "Gly"], ["GCU", "Ala"], ["UGG", "Trp"], ["AAA", "Lys"], ["GAA", "Glu"], ["CAU", "His"], ["UGU", "Cys"], ["AGU", "Ser"], ["UCU", "Ser"], ["CCC", "Pro"], ["GUU", "Val"], ["UAU", "Tyr"], ["CUG", "Leu"], ["ACU", "Thr"], ["AAU", "Asn"], ["GAU", "Asp"], ["CAA", "Gln"], ["AGA", "Arg"], ["AUU", "Ile"], ["UAC", "Tyr"]];
const AAS = [...new Set(CODONS.map((c) => c[1]))];
const aaOf = (c) => CODONS.find((x) => x[0] === c)?.[1];
const RC = { A: "U", U: "A", G: "C", C: "G" };
def("b_codon", "bi_dna", 12, "Genski kod", "The genetic code", (t, ctx) => {
  const sl = ctx.lang === "sl";
  if (t === 1) {
    return bank(ctx, [
      ["Start kodon?|Start codon?", "AUG", "UAA", "UGA", "AUC"],
      ["Kateri je stop kodon?|Which is a stop codon?", ["UAA", "UAG", "UGA"], "AUG", "UUU", "GGC"],
      ["Koliko baz ima kodon?|Bases in one codon?", "3", "2", "4", "1"],
      ["Število različnih kodonov?|Number of different codons?", "64", "20", "61", "4"],
      ["Število aminokislin v genskem kodu?|Amino acids in the genetic code?", "20", "64", "4", "61"],
      ["Start kodon AUG kodira?|Start codon AUG codes for?", "Met", "Phe", "Gly", "Trp"],
      ["Aminokisline na ribosom prinaša?|Amino acids are brought by?", "tRNK|tRNA", "mRNK|mRNA", "rRNK|rRNA", "DNK|DNA"],
      ["Število stop kodonov?|Number of stop codons?", "3", "1", "2", "4"],
      ["Kodoni, ki določajo aminokisline?|Codons that code for amino acids?", "61", "64", "20", "3"],
      ["Trije nukleotidi tRNK ob kodonu?|Three tRNA bases that pair with a codon?", sl ? "antikodon" : "anticodon", sl ? "kodon" : "codon", sl ? "gen" : "gene", sl ? "intron" : "intron"],
      ["Genski kod je pri skoraj vseh organizmih?|The genetic code in nearly all organisms is?", sl ? "enak" : "the same", sl ? "različen" : "different", sl ? "naključen" : "random", sl ? "obrnjen" : "reversed"],
    ]);
  }
  if (t === 2) {
    const [c, aa] = pick(CODONS);
    const comp = aaOf(mapS(c, RC));
    return mk(sl ? `Kodon ${c} → aminokislina?` : `Codon ${c} → amino acid?`, aa, [comp, ...shuffle(AAS)].filter((x) => x && x !== aa));
  }
  const k = R(0, 2);
  if (k === 0) {
    const [c, aa] = pick(CODONS);
    const anti = mapS(c, RC);
    return mk(sl ? `Antikodon 3′-${anti}-5′ → aminokislina?` : `Anticodon 3′-${anti}-5′ → amino acid?`, aa, [aaOf(anti), ...shuffle(AAS)].filter((x) => x && x !== aa));
  }
  const n = R(5, 60) * 10;
  if (k === 1) return ints(sl ? `mRNK: ${n * 3} nukleotidov (brez stop) → aminokislin?` : `mRNA, ${n * 3} nucleotides (no stop): amino acids?`, n, [n * 3, n * 9, n / 2 === Math.floor(n / 2) ? n / 2 : n + 1, n * 3 - 3], 1);
  return ints(sl ? `${n} aminokislin: nukleotidov v mRNK (brez stop)?` : `${n} amino acids: mRNA nucleotides (no stop)?`, n * 3, [n, n * 2, n / 3 === Math.floor(n / 3) ? n / 3 : n * 6, n * 3 + 3], 1);
});

// ===== ČLOVEŠKO TELO =====
const OR1 = [
  ["Črpa kri po telesu?|Pumps blood around the body?", "srce|heart", "pljuča|lungs", "jetra|liver", "ledvice|kidneys"],
  ["Izmenjava plinov z zrakom?|Exchanges gases with the air?", "pljuča|lungs", "srce|heart", "jetra|liver", "želodec|stomach"],
  ["Čisti kri in tvori seč?|Filters blood and makes urine?", "ledvice|kidneys", "jetra|liver", "sečni mehur|bladder", "vranica|spleen"],
  ["Shranjuje seč?|Stores urine?", "sečni mehur|bladder", "ledvice|kidneys", "žolčnik|gallbladder", "želodec|stomach"],
  ["Tvori žolč?|Produces bile?", "jetra|liver", "žolčnik|gallbladder", "trebušna slinavka|pancreas", "želodec|stomach"],
  ["Največ vsrkavanja hranil?|Absorbs most nutrients?", "tanko črevo|small intestine", "debelo črevo|large intestine", "želodec|stomach", "požiralnik|oesophagus"],
  ["Nadzira delovanje telesa?|Controls the body?", "možgani|brain", "srce|heart", "jetra|liver", "pljuča|lungs"],
  ["Največji organ človeka?|Largest organ of the body?", "koža|skin", "jetra|liver", "pljuča|lungs", "možgani|brain"],
  ["Prebava beljakovin se začne v?|Protein digestion begins in the?", "želodcu|stomach", "ustih|mouth", "tankem črevesu|small intestine", "požiralniku|oesophagus"],
  ["Prebava škroba se začne v?|Starch digestion begins in the?", "ustih|mouth", "želodcu|stomach", "tankem črevesu|small intestine", "jetrih|liver"],
  ["Vodi hrano iz ust v želodec?|Carries food from mouth to stomach?", "požiralnik|oesophagus", "sapnik|trachea", "grlo|larynx", "tanko črevo|small intestine"],
  ["Vodi zrak proti pljučem?|Carries air towards the lungs?", "sapnik|trachea", "požiralnik|oesophagus", "aorta|aorta", "sečevod|ureter"],
];
const OR2 = [
  ["Shranjuje žolč?|Stores bile?", "žolčnik|gallbladder", "jetra|liver", "sečni mehur|bladder", "želodec|stomach"],
  ["Izloča inzulin?|Secretes insulin?", "trebušna slinavka|pancreas", "jetra|liver", "ščitnica|thyroid", "nadledvičnica|adrenal gland"],
  ["Tvori blato, vsrkava vodo?|Forms faeces, absorbs water?", "debelo črevo|large intestine", "tanko črevo|small intestine", "želodec|stomach", "požiralnik|oesophagus"],
  ["Ravnotežje in usklajevanje gibov?|Balance and coordination?", "mali možgani|cerebellum", "veliki možgani|cerebrum", "hipofiza|pituitary gland", "hrbtenjača|spinal cord"],
  ["Tvori rdeče krvničke?|Makes red blood cells?", "rdeči kostni mozeg|red bone marrow", "vranica|spleen", "srce|heart", "ledvice|kidneys"],
  ["Tvori semenčice?|Produces sperm?", "moda|testes", "prostata|prostate", "jajčnik|ovary", "sečni mehur|bladder"],
  ["Tvori jajčne celice?|Produces egg cells?", "jajčnik|ovary", "maternica|uterus", "jajcevod|oviduct", "moda|testes"],
  ["V njej se razvija zarodek?|Where the embryo develops?", "maternica|uterus", "jajčnik|ovary", "jajcevod|oviduct", "nožnica|vagina"],
];
const OR3 = [
  ["Uravnava dihanje in srčni utrip?|Controls breathing and heart rate?", "možgansko deblo|brainstem", "mali možgani|cerebellum", "veliki možgani|cerebrum", "hipofiza|pituitary gland"],
  ["Kje navadno pride do oploditve?|Where fertilisation usually occurs?", "jajcevod|oviduct", "maternica|uterus", "jajčnik|ovary", "nožnica|vagina"],
  ["Razgrajuje stare rdeče krvničke?|Breaks down old red blood cells?", "vranica|spleen", "srce|heart", "ledvice|kidneys", "pljuča|lungs"],
  ["Pljučni mešički, kjer poteka izmenjava plinov?|Air sacs where gas exchange occurs?", "alveole|alveoli", "bronhiji|bronchi", "sapnik|trachea", "grlo|larynx"],
  ["Osnovna enota ledvice?|Functional unit of the kidney?", "nefron|nephron", "nevron|neuron", "alveola|alveolus", "resica|villus"],
  ["Povečajo površino tankega črevesa?|Increase the small intestine's surface?", "resice|villi", "alveole|alveoli", "nefroni|nephrons", "kapilare|capillaries"],
];
def("b_organ", "bi_clo", 8, "Organi in njihove naloge", "Organs and their jobs", (t, ctx) => bank(ctx, tiered(t, OR1, OR2, OR3)));

const SYS = ["obtočila|circulatory system", "dihala|respiratory system", "prebavila|digestive system", "izločala|excretory system", "živčevje|nervous system", "hormonski sistem|endocrine system", "okostje|skeletal system", "razmnoževala|reproductive system"];
// [organ, indeks sistema]
const SYSO1 = [["srce|heart", 0], ["arterija|artery", 0], ["pljuča|lungs", 1], ["sapnik|trachea", 1], ["želodec|stomach", 2], ["požiralnik|oesophagus", 2], ["tanko črevo|small intestine", 2], ["ledvice|kidneys", 3], ["sečni mehur|bladder", 3], ["možgani|brain", 4], ["hrbtenjača|spinal cord", 4], ["lobanja|skull", 6], ["stegnenica|femur", 6], ["maternica|uterus", 7]];
const SYSO2 = [["vena|vein", 0], ["kapilara|capillary", 0], ["grlo|larynx", 1], ["bronhij|bronchus", 1], ["jetra|liver", 2], ["debelo črevo|large intestine", 2], ["sečevod|ureter", 3], ["živec|nerve", 4], ["ščitnica|thyroid", 5], ["hipofiza|pituitary gland", 5], ["nadledvičnica|adrenal gland", 5], ["hrbtenica|spine", 6], ["jajcevod|oviduct", 7], ["semenovod|sperm duct", 7]];
const SYSO3 = [["nefron|nephron", 3], ["alveola|alveolus", 1], ["nevron|neuron", 4], ["črevesna resica|intestinal villus", 2], ["aorta|aorta", 0], ["rebro|rib", 6], ["ledvični meh|renal pelvis", 3]];
def("b_sys", "bi_clo", 8, "Organski sistemi", "Organ systems", (t, ctx) => {
  const [o, k] = pick(tiered(t, SYSO1, SYSO2, SYSO3));
  const name = L(ctx, o);
  return mk(`${name[0].toUpperCase() + name.slice(1)}: ${L(ctx, "organski sistem?|organ system?")}`, L(ctx, SYS[k]), shuffle(SYS.filter((_, i) => i !== k)).map((s) => L(ctx, s)));
});

const CIRC1 = [
  ["Prenašajo kisik?|Carry oxygen?", "rdeče krvničke|red blood cells", "bele krvničke|white blood cells", "krvne ploščice|platelets", "krvna plazma|plasma"],
  ["Branijo pred okužbami?|Fight infections?", "bele krvničke|white blood cells", "rdeče krvničke|red blood cells", "krvne ploščice|platelets", "krvna plazma|plasma"],
  ["Sodelujejo pri strjevanju krvi?|Help blood to clot?", "krvne ploščice|platelets", "rdeče krvničke|red blood cells", "bele krvničke|white blood cells", "hemoglobin|haemoglobin"],
  ["Tekoči del krvi?|Liquid part of blood?", "krvna plazma|plasma", "limfa|lymph", "hemoglobin|haemoglobin", "bele krvničke|white blood cells"],
  ["Beljakovina, ki veže kisik?|Protein that binds oxygen?", "hemoglobin|haemoglobin", "inzulin|insulin", "keratin|keratin", "fibrinogen|fibrinogen"],
  ["Žile, ki vodijo kri od srca?|Vessels carrying blood away from the heart?", "arterije|arteries", "vene|veins", "kapilare|capillaries", "limfne žile|lymph vessels"],
  ["Žile, ki vodijo kri k srcu?|Vessels carrying blood to the heart?", "vene|veins", "arterije|arteries", "kapilare|capillaries", "aorta|aorta"],
  ["Najtanjše žile (izmenjava snovi)?|Thinnest vessels (exchange)?", "kapilare|capillaries", "arterije|arteries", "vene|veins", "aorta|aorta"],
  ["Rdečo barvo krvi daje?|Blood gets its red colour from?", "hemoglobin|haemoglobin", "klorofil|chlorophyll", "melanin|melanin", "inzulin|insulin"],
  ["Krvne celice nastajajo v?|Blood cells are made in the?", "kostnem mozgu|bone marrow", "srcu|heart", "pljučih|lungs", "želodcu|stomach"],
  ["Žile z najdebelejšo steno?|Vessels with the thickest walls?", "arterije|arteries", "vene|veins", "kapilare|capillaries", "limfne žile|lymph vessels"],
  ["Obtok skozi pljuča je?|Circulation through the lungs is the?", "mali krvni obtok|pulmonary circuit", "veliki krvni obtok|systemic circuit", "limfni obtok|lymph circulation", "prebavni obtok|digestive circuit"],
];
const CIRC2 = [
  ["Število prekatov v srcu?|Number of ventricles in the heart?", "2", "1", "3", "4"],
  ["Število votlin srca?|Number of heart chambers?", "4", "2", "3", "6"],
  ["Kri iz pljuč priteče v?|Blood from the lungs enters the?", "levi preddvor|left atrium", "desni preddvor|right atrium", "levi prekat|left ventricle", "desni prekat|right ventricle"],
  ["Kri v aorto črpa?|Pumps blood into the aorta?", "levi prekat|left ventricle", "desni prekat|right ventricle", "levi preddvor|left atrium", "desni preddvor|right atrium"],
  ["Kri v pljuča črpa?|Pumps blood to the lungs?", "desni prekat|right ventricle", "levi prekat|left ventricle", "desni preddvor|right atrium", "levi preddvor|left atrium"],
  ["Največja arterija?|Largest artery?", "aorta|aorta", "pljučna vena|pulmonary vein", "votla vena|vena cava", "kapilara|capillary"],
];
const CIRC3 = [
  ["Pljučna arterija vodi kri?|The pulmonary artery carries blood?", "revno s kisikom|low in oxygen", "bogato s kisikom|rich in oxygen", "k srcu|to the heart", "v jetra|to the liver"],
  ["Pljučna vena vodi kri?|The pulmonary vein carries blood?", "bogato s kisikom|rich in oxygen", "revno s kisikom|low in oxygen", "v pljuča|to the lungs", "v ledvice|to the kidneys"],
  ["Zaklopke v srcu preprečujejo?|Heart valves prevent?", "povratni tok krvi|backflow of blood", "strjevanje krvi|clotting", "okužbe|infections", "visok tlak|high pressure"],
  ["Rdeče krvničke človeka nimajo?|Human red blood cells lack a?", "jedra|nucleus", "membrane|membrane", "hemoglobina|haemoglobin", "citoplazme|cytoplasm"],
];
def("b_circ", "bi_clo", 8, "Kri in srce", "Blood and the heart", (t, ctx) => {
  const sl = ctx.lang === "sl";
  if (t >= 2 && Math.random() < 0.3) {
    if (t === 2) {
      const s = pick([10, 15, 20, 30]), bpm = pick([60, 64, 68, 72, 76, 80, 84, 88, 90]);
      const n = (bpm * s) / 60;
      if (!Number.isInteger(n)) return bank(ctx, CIRC2);
      return ints(sl ? `${n} utripov v ${s} s: utripov na minuto?` : `${n} beats in ${s} s: beats per minute?`, bpm, [n * s, (n * 60) / 10, n + 60, bpm + 10], 1);
    }
    const sv = pick([60, 70, 80]), hr = pick([60, 70, 75, 80]);
    const co = (sv * hr) / 1000;
    return numU(ctx, sl ? `Utripni volumen ${sv} mL, ${hr}/min: minutni volumen?` : `Stroke volume ${sv} mL, ${hr}/min: cardiac output?`, co, [co * 1000, co * 10, (sv + hr) / 10, co / 10], "L/min");
  }
  return bank(ctx, tiered(t, CIRC1, CIRC2, CIRC3));
});

const DIG1 = [
  ["Amilaza razgrajuje?|Amylase breaks down?", "škrob|starch", "beljakovine|proteins", "maščobe|fats", "DNK|DNA"],
  ["Pepsin razgrajuje?|Pepsin breaks down?", "beljakovine|proteins", "škrob|starch", "maščobe|fats", "laktozo|lactose"],
  ["Lipaza razgrajuje?|Lipase breaks down?", "maščobe|fats", "beljakovine|proteins", "škrob|starch", "celulozo|cellulose"],
  ["Tripsin razgrajuje?|Trypsin breaks down?", "beljakovine|proteins", "škrob|starch", "maščobe|fats", "celulozo|cellulose"],
  ["Glavni vir energije v hrani?|Main energy source in food?", "ogljikovi hidrati|carbohydrates", "vitamini|vitamins", "minerali|minerals", "voda|water"],
  ["Hranilo za rast in gradnjo telesa?|Nutrient for growth and repair?", "beljakovine|proteins", "vitamini|vitamins", "vlaknine|fibre", "voda|water"],
  ["Prebava hrane se začne v?|Digestion begins in the?", "ustih|mouth", "želodcu|stomach", "tankem črevesu|small intestine", "požiralniku|oesophagus"],
  ["Encim v slini?|Enzyme in saliva?", "amilaza|amylase", "pepsin|pepsin", "tripsin|trypsin", "inzulin|insulin"],
  ["Največ energije na gram ima?|Most energy per gram comes from?", "maščoba|fat", "beljakovina|protein", "sladkor|sugar", "vitamin|a vitamin"],
  ["Hranila iz tankega črevesa preidejo v?|Nutrients from the small intestine pass into the?", "kri|blood", "pljuča|lungs", "seč|urine", "želodec|stomach"],
  ["Mineral za trdne kosti in zobe?|Mineral for strong bones and teeth?", "kalcij|calcium", "železo|iron", "jod|iodine", "natrij|sodium"],
  ["Vitamin, ki nastaja v koži na soncu?|Vitamin made in the skin in sunlight?", "vitamin D", "vitamin C", "vitamin A", "vitamin K"],
];
const DIG2 = [
  ["Škrob se razgradi do?|Starch is broken down to?", "glukoze|glucose", "aminokislin|amino acids", "glicerola|glycerol", "nukleotidov|nucleotides"],
  ["Beljakovine se razgradijo do?|Proteins are broken down to?", "aminokislin|amino acids", "glukoze|glucose", "maščobnih kislin|fatty acids", "nukleotidov|nucleotides"],
  ["Iz lipidov pri prebavi nastanejo glicerol in?|Lipid digestion gives glycerol and?", "maščobne kisline|fatty acids", "aminokisline|amino acids", "glukoza|glucose", "nukleotidi|nucleotides"],
  ["Žolč emulgira?|Bile emulsifies?", "maščobe|fats", "beljakovine|proteins", "škrob|starch", "vitamine|vitamins"],
  ["Pepsin deluje v?|Pepsin works in the?", "želodcu|stomach", "ustih|mouth", "tankem črevesu|small intestine", "debelem črevesu|large intestine"],
  ["Želodčni sok je?|Gastric juice is?", "kisel|acidic", "bazičen|basic", "nevtralen|neutral", "brez encimov|enzyme-free"],
];
const DIG3 = [
  ["Encimi so po zgradbi večinoma?|Most enzymes are?", "beljakovine|proteins", "maščobe|fats", "ogljikovi hidrati|carbohydrates", "minerali|minerals"],
  ["Visoka temperatura encime?|High temperature does to enzymes?", "denaturira|denatures them", "pospeši za vedno|speeds up forever", "ne spremeni|has no effect", "razmnoži|multiplies them"],
  ["Optimalna temperatura človeških encimov?|Optimum temperature of human enzymes?", "37 °C", "20 °C", "60 °C", "100 °C"],
  ["Pomanjkanje vitamina C povzroča?|Lack of vitamin C causes?", "skorbut|scurvy", "rahitis|rickets", "nočno slepoto|night blindness", "anemijo|anaemia"],
  ["Pomanjkanje vitamina D povzroča?|Lack of vitamin D causes?", "rahitis|rickets", "skorbut|scurvy", "nočno slepoto|night blindness", "golšo|goitre"],
  ["Pomanjkanje železa povzroča?|Lack of iron causes?", "anemijo|anaemia", "skorbut|scurvy", "rahitis|rickets", "golšo|goitre"],
  ["Pomanjkanje joda povzroča?|Lack of iodine causes?", "golšo|goitre", "rahitis|rickets", "skorbut|scurvy", "anemijo|anaemia"],
];
def("b_digest", "bi_clo", 8, "Prehrana in prebava", "Nutrition and digestion", (t, ctx) => bank(ctx, tiered(t, DIG1, DIG2, DIG3)));

const HOR1 = [
  ["Znižuje krvni sladkor?|Lowers blood sugar?", "inzulin|insulin", "glukagon|glucagon", "adrenalin|adrenaline", "tiroksin|thyroxine"],
  ["Hormon »boj ali beg«?|“Fight or flight” hormone?", "adrenalin|adrenaline", "inzulin|insulin", "tiroksin|thyroxine", "melatonin|melatonin"],
  ["Osnovna celica živčevja?|Basic cell of the nervous system?", "nevron|neuron", "nefron|nephron", "eritrocit|erythrocyte", "alveola|alveolus"],
  ["Osrednje živčevje sestavljata?|The CNS is made of?", "možgani, hrbtenjača|brain, spinal cord", "možgani, živci|brain, nerves", "hrbtenjača, živci|spinal cord, nerves", "srce, možgani|heart, brain"],
  ["Čutnice za barve v očesu?|Colour receptors in the eye?", "čepki|cones", "paličice|rods", "leča|lens", "zenica|pupil"],
  ["Odprtina, skozi katero vstopa svetloba?|Opening that lets light into the eye?", "zenica|pupil", "šarenica|iris", "leča|lens", "mrežnica|retina"],
  ["Čutilo za sluh?|Sense organ for hearing?", "uho|ear", "oko|eye", "nos|nose", "jezik|tongue"],
  ["Čutnice za svetlobo so v?|Light receptors are in the?", "mrežnici|retina", "leči|lens", "zenici|pupil", "roženici|cornea"],
  ["Čutnice za vid v mraku?|Receptors for seeing in dim light?", "paličice|rods", "čepki|cones", "leča|lens", "zenica|pupil"],
  ["Hiter, nehoten odziv na dražljaj?|Fast, automatic response to a stimulus?", "refleks|reflex", "hormon|hormone", "sinapsa|synapse", "spomin|memory"],
  ["Inzulin izloča?|Insulin is secreted by the?", "trebušna slinavka|pancreas", "ščitnica|thyroid", "hipofiza|pituitary gland", "jetra|liver"],
  ["Hormone po telesu prenaša?|Hormones are carried around by the?", "kri|blood", "seč|urine", "žolč|bile", "slina|saliva"],
];
const HOR2 = [
  ["Hormon ščitnice?|Thyroid hormone?", "tiroksin|thyroxine", "inzulin|insulin", "adrenalin|adrenaline", "testosteron|testosterone"],
  ["Zvišuje krvni sladkor (trebušna slinavka)?|Raises blood sugar (pancreas)?", "glukagon|glucagon", "inzulin|insulin", "tiroksin|thyroxine", "melatonin|melatonin"],
  ["Žleza, ki uravnava druge žleze?|Gland that controls other glands?", "hipofiza|pituitary gland", "ščitnica|thyroid", "nadledvičnica|adrenal gland", "trebušna slinavka|pancreas"],
  ["Moški spolni hormon?|Male sex hormone?", "testosteron|testosterone", "estrogen|oestrogen", "inzulin|insulin", "tiroksin|thyroxine"],
  ["Stik med nevronoma?|Junction between two neurons?", "sinapsa|synapse", "akson|axon", "dendrit|dendrite", "nefron|nephron"],
  ["Čutilo za ravnotežje je v?|The balance organ is in the?", "notranjem ušesu|inner ear", "srednjem ušesu|middle ear", "očesu|eye", "nosu|nose"],
];
const HOR3 = [
  ["Hormon, ki uravnava spanje?|Hormone that regulates sleep?", "melatonin|melatonin", "adrenalin|adrenaline", "inzulin|insulin", "glukagon|glucagon"],
  ["Izrastek, ki vodi signal od telesa nevrona?|Carries the signal away from the cell body?", "akson|axon", "dendrit|dendrite", "sinapsa|synapse", "jedro|nucleus"],
  ["Spremeni obliko pri ostrenju slike?|Changes shape to focus the image?", "leča|lens", "roženica|cornea", "zenica|pupil", "mrežnica|retina"],
  ["Prenašalec živčnega signala v sinapsi?|Carries the signal across a synapse?", "nevrotransmiter|neurotransmitter", "hormon|hormone", "protitelo|antibody", "encim|enzyme"],
  ["Rastni hormon izloča?|Growth hormone is secreted by the?", "hipofiza|pituitary gland", "ščitnica|thyroid", "jetra|liver", "nadledvičnica|adrenal gland"],
];
def("b_hormone", "bi_clo", 8, "Hormoni, živčevje in čutila", "Hormones, nerves and senses", (t, ctx) => bank(ctx, tiered(t, HOR1, HOR2, HOR3)));

// ===== FOTOSINTEZA IN CELIČNO DIHANJE =====
const PH1 = [
  ["Plin, ki ga rastlina porabi pri fotosintezi?|Gas used up in photosynthesis?", "CO₂", "O₂", "N₂", "H₂"],
  ["Plin, ki nastane pri fotosintezi?|Gas released in photosynthesis?", "O₂", "CO₂", "N₂", "CH₄"],
  ["Sladkor, ki nastane pri fotosintezi?|Sugar made in photosynthesis?", "glukoza|glucose", "laktoza|lactose", "glikogen|glycogen", "hitin|chitin"],
  ["Zeleno barvilo za fotosintezo?|Green pigment for photosynthesis?", "klorofil|chlorophyll", "hemoglobin|haemoglobin", "karoten|carotene", "melanin|melanin"],
  ["Vir energije za fotosintezo?|Energy source for photosynthesis?", "svetloba|light", "toplota|heat", "glukoza|glucose", "kisik|oxygen"],
  ["Poleg CO₂ fotosinteza potrebuje?|Besides CO₂, photosynthesis needs?", "vodo|water", "kisik|oxygen", "glukozo|glucose", "dušik|nitrogen"],
  ["Organizmi, ki sami tvorijo hrano?|Organisms that make their own food?", "avtotrofi|autotrophs", "heterotrofi|heterotrophs", "razkrojevalci|decomposers", "plenilci|predators"],
  ["Organizmi, ki hrano dobijo od drugih?|Organisms that get food from others?", "heterotrofi|heterotrophs", "avtotrofi|autotrophs", "proizvajalci|producers", "rastline|plants"],
  ["Fotosinteza poteka v?|Photosynthesis takes place in?", "kloroplastih|chloroplasts", "mitohondrijih|mitochondria", "ribosomih|ribosomes", "jedru|the nucleus"],
  ["Svetlobna energija se pretvori v?|Light energy is turned into?", "kemijsko energijo|chemical energy", "toplotno energijo|heat", "jedrsko energijo|nuclear energy", "zvok|sound"],
  ["Pri fotosintezi se energija?|In photosynthesis energy is?", "shrani v glukozi|stored in glucose", "sprosti iz glukoze|freed from glucose", "izgubi|lost", "ne spremeni|unchanged"],
  ["Rastline so v prehranjevalni verigi?|In a food chain plants are?", "proizvajalci|producers", "potrošniki|consumers", "razkrojevalci|decomposers", "plenilci|predators"],
];
const PH2 = [
  ["Odprtine za izmenjavo plinov v listu?|Leaf pores for gas exchange?", "listne reže|stomata", "žile|veins", "kutikula|cuticle", "koreninski laski|root hairs"],
  ["Zaloga glukoze v rastlini?|Storage form of glucose in plants?", "škrob|starch", "glikogen|glycogen", "celuloza|cellulose", "hitin|chitin"],
  ["Več svetlobe (do meje): fotosinteza?|More light (up to a limit): photosynthesis?", "hitrejša|faster", "počasnejša|slower", "enako hitra|unchanged", "se ustavi|stops"],
  ["Ponoči rastline?|At night plants?", "le dihajo|only respire", "le fotosintetizirajo|only photosynthesise", "ne dihajo|do not respire", "oddajajo le O₂|release only O₂"],
];
const PH3 = [
  ["Mesto svetlobnih reakcij?|Site of the light reactions?", "tilakoidi|thylakoids", "stroma|stroma", "kriste|cristae", "citoplazma|cytoplasm"],
  ["Mesto vezave CO₂ v kloroplastu?|Where is CO₂ fixed in a chloroplast?", "stroma|stroma", "tilakoidi|thylakoids", "zunanja membrana|outer membrane", "ribosomi|ribosomes"],
  ["Svetlobne reakcije dajo temotnim?|Light reactions supply?", "ATP in NADPH|ATP and NADPH", "glukozo in O₂|glucose and O₂", "CO₂ in H₂O|CO₂ and H₂O", "ADP in NADP⁺|ADP and NADP⁺"],
  ["Kisik pri fotosintezi izvira iz?|O₂ from photosynthesis comes from?", "vode|water", "CO₂|CO₂", "glukoze|glucose", "klorofila|chlorophyll"],
  ["Encim, ki veže CO₂?|Enzyme that fixes CO₂?", "rubisko|RuBisCO", "amilaza|amylase", "ATP-sintaza|ATP synthase", "pepsin|pepsin"],
];
// 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂ (M: glukoza 180, CO₂ 44, O₂ 32, H₂O 18 g/mol)
const MG = { "CO₂": 44, "O₂": 32, "H₂O": 18 };
function glucoseCalc(ctx, photo, t) {
  const sl = ctx.lang === "sl";
  const other = pick(["CO₂", "O₂", "H₂O"]);
  if (t === 2) {
    const k = pick([1, 2, 3, 4, 5, 10]);
    const q = photo ? (sl ? `Fotosinteza, ${k} × C₆H₁₂O₆: koliko ${other}?` : `Photosynthesis, ${k} × C₆H₁₂O₆: how many ${other}?`) : sl ? `Dihanje, ${k} × C₆H₁₂O₆: koliko ${other}?` : `Respiration, ${k} × C₆H₁₂O₆: how many ${other}?`;
    return ints(q, 6 * k, [k, 12 * k, 3 * k, 6 * k + 6], 1);
  }
  const n = pick([0.1, 0.2, 0.5, 1, 2]), m = 180 * n, mx = 6 * n * MG[other];
  const q = photo ? (sl ? `Fotosinteza, ${ctx.num(m)} g glukoze: m(${other})?` : `Photosynthesis, ${ctx.num(m)} g glucose: m(${other})?`) : sl ? `Dihanje, ${ctx.num(m)} g glukoze: m(${other})?` : `Respiration, ${ctx.num(m)} g glucose: m(${other})?`;
  return numU(ctx, q, mx, [n * MG[other], m, mx * 2, 6 * MG[other]], "g");
}
def("b_photo", "bi_ene", 9, "Fotosinteza", "Photosynthesis", (t, ctx) => {
  if (t > 1 && Math.random() < 0.3) return glucoseCalc(ctx, true, t);
  return bank(ctx, tiered(t, PH1, PH2, PH3));
});

const RS1 = [
  ["Produkta aerobnega dihanja?|Products of aerobic respiration?", "CO₂ in H₂O|CO₂ and H₂O", "glukoza in O₂|glucose and O₂", "mlečna kislina|lactic acid", "etanol in CO₂|ethanol and CO₂"],
  ["Reaktanta celičnega dihanja?|Reactants of cellular respiration?", "glukoza in O₂|glucose and O₂", "CO₂ in H₂O|CO₂ and H₂O", "škrob in CO₂|starch and CO₂", "ATP in H₂O|ATP and H₂O"],
  ["Molekula za prenos energije v celici?|Energy-carrying molecule in cells?", "ATP", "DNK|DNA", "RNK|RNA", "NaCl"],
  ["Kje poteka celično dihanje?|Where does cellular respiration happen?", "v vseh živih celicah|in all living cells", "le v rastlinah|in plants only", "le v živalih|in animals only", "le v pljučih|in the lungs only"],
  ["Aerobno dihanje poteka večinoma v?|Aerobic respiration mostly occurs in?", "mitohondrijih|mitochondria", "kloroplastih|chloroplasts", "ribosomih|ribosomes", "jedru|the nucleus"],
  ["Celično dihanje sprošča?|Cellular respiration releases?", "energijo|energy", "kisik|oxygen", "glukozo|glucose", "svetlobo|light"],
  ["Plin, ki ga celice porabijo pri dihanju?|Gas used up by cells in respiration?", "O₂", "CO₂", "N₂", "H₂"],
  ["Plin, ki nastane pri celičnem dihanju?|Gas produced in cellular respiration?", "CO₂", "O₂", "N₂", "H₂"],
  ["Kdaj dihajo rastline?|When do plants respire?", "ves čas|all the time", "le podnevi|only by day", "le ponoči|only at night", "nikoli|never"],
  ["Katero dihanje da več ATP?|Which respiration gives more ATP?", "aerobno|aerobic", "anaerobno|anaerobic", "obe enako|both the same", "nobeno|neither"],
  ["Med naporom mišice porabijo več?|During exercise muscles use more?", "kisika|oxygen", "dušika|nitrogen", "helija|helium", "vitamina C|vitamin C"],
];
const RS2 = [
  ["Prva stopnja dihanja (v citoplazmi)?|First stage of respiration (cytoplasm)?", "glikoliza|glycolysis", "citratni cikel|citric acid cycle", "dihalna veriga|electron transport", "fotoliza|photolysis"],
  ["Mišice brez kisika tvorijo?|Muscles without oxygen make?", "mlečno kislino|lactic acid", "etanol|ethanol", "ocetno kislino|acetic acid", "glukozo|glucose"],
  ["Kvasovke brez kisika tvorijo?|Yeast without oxygen makes?", "etanol in CO₂|ethanol and CO₂", "mlečno kislino|lactic acid", "CO₂ in H₂O|CO₂ and H₂O", "glukozo in O₂|glucose and O₂"],
  ["Dihanje brez kisika je?|Respiration without oxygen is?", "anaerobno|anaerobic", "aerobno|aerobic", "fotosinteza|photosynthesis", "transpiracija|transpiration"],
  ["Neto ATP iz glikolize (na glukozo)?|Net ATP from glycolysis per glucose?", "2", "4", "36", "1"],
];
const RS3 = [
  ["Končni prejemnik elektronov pri dihanju?|Final electron acceptor in respiration?", "kisik|oxygen", "glukoza|glucose", "CO₂", "NAD⁺"],
  ["Mesto citratnega cikla?|Site of the citric acid cycle?", "matriks mitohondrija|mitochondrial matrix", "citoplazma|cytoplasm", "stroma|stroma", "jedro|nucleus"],
  ["Dihalna veriga je v mitohondriju na?|In mitochondria, the ETC is on the?", "notranji membrani|inner membrane", "zunanji membrani|outer membrane", "ribosomih|ribosomes", "DNK|DNA"],
  ["Glikoliza razgradi glukozo do?|Glycolysis splits glucose into?", "piruvata|pyruvate", "CO₂ in H₂O|CO₂ and H₂O", "etanola|ethanol", "škroba|starch"],
];
def("b_resp", "bi_ene", 10, "Celično dihanje", "Cellular respiration", (t, ctx) => {
  if (t > 1 && Math.random() < 0.3) return glucoseCalc(ctx, false, t);
  return bank(ctx, tiered(t, RS1, RS2, RS3));
});

// ===== EKOLOGIJA =====
const CH3 = [["trava|grass", "zajec|rabbit", "lisica|fox"], ["hrast|oak", "miš|mouse", "sova|owl"], ["solata|lettuce", "polž|snail", "jež|hedgehog"], ["alge|algae", "vodna bolha|water flea", "ribica|small fish"], ["žito|grain", "miš|mouse", "kača|snake"], ["trava|grass", "krava|cow", "človek|human"]];
const CH4 = [["trava|grass", "kobilica|grasshopper", "žaba|frog", "kača|snake"], ["alge|algae", "vodna bolha|water flea", "ostriž|perch", "ščuka|pike"], ["vrtnica|rose", "uš|aphid", "pikapolonica|ladybird", "sinica|tit"], ["solata|lettuce", "polž|snail", "drozg|thrush", "skobec|sparrowhawk"], ["alge|algae", "zooplankton|zooplankton", "sled|herring", "tjulenj|seal"], ["žito|grain", "miš|mouse", "kača|snake", "kanja|buzzard"]];
const ROLE = ["proizvajalec|producer", "potrošnik 1. reda|primary consumer", "potrošnik 2. reda|secondary consumer", "potrošnik 3. reda|tertiary consumer"];
def("b_chain", "bi_eko", 9, "Prehranjevalne verige", "Food chains", (t, ctx) => {
  for (;;) {
    const ch = pick(t === 1 ? CH3 : CH4).map((s) => L(ctx, s));
    const chain = ch.join(" → ");
    if (t === 3 && Math.random() < 0.5) {
      const i = R(0, ch.length - 1);
      const q = `${chain}: ${ch[i]} – ${L(ctx, "trofična raven?|trophic level?")}`;
      if (q.length > 60) continue;
      return ints(q, i + 1, [i, i + 2, ch.length - i, 5].filter((x) => x !== i + 1), 1);
    }
    const i = R(0, ch.length - 1);
    const q = `${chain}: ${L(ctx, ROLE[i])}?`;
    if (q.length > 60) continue;
    return mk(q, ch[i], ch.filter((_, j) => j !== i), [L(ctx, "glive|fungi"), L(ctx, "bakterije|bacteria")]);
  }
});

const LEV = ["proizvajalci|producers", "potrošniki 1. reda|primary consumers", "potrošniki 2. reda|secondary consumers", "potrošniki 3. reda|tertiary consumers"];
def("b_energy", "bi_eko", 9, "Prenos energije (pravilo 10 %)", "Energy transfer (10 % rule)", (t, ctx) => {
  const sl = ctx.lang === "sl";
  const E = pick([5000, 8000, 10000, 20000, 30000, 40000, 50000, 60000]);
  if (t < 3) {
    const k = t === 1 ? 1 : pick([2, 3]);
    const a = E / 10 ** k;
    const q = sl ? `Proizvajalci ${E} kJ → ${L(ctx, LEV[k])} (10 %)?` : `Producers ${E} kJ → ${L(ctx, LEV[k])} (10 %)?`;
    return numU(ctx, q, a, [a * 10, a / 10, E - a, a * 2], "kJ");
  }
  if (Math.random() < 0.5) {
    const top = pick([5, 8, 10, 20, 30, 50]), k = pick([2, 3]);
    const q = sl ? `${L(ctx, LEV[k])[0].toUpperCase() + L(ctx, LEV[k]).slice(1)} ${top} kJ: proizvajalci (10 %)?` : `${L(ctx, LEV[k])[0].toUpperCase() + L(ctx, LEV[k]).slice(1)} ${top} kJ: producers (10 %)?`;
    return numU(ctx, q, top * 10 ** k, [top * 10 ** (k - 1), top * 10 ** (k + 1), top * 10 * k], "kJ");
  }
  const p = pick([5, 8, 10, 12, 15, 20]), E2 = (E * p) / 100;
  const q = sl ? `Trava ${E} kJ, zajci dobijo ${ctx.num(E2)} kJ: izkoristek?` : `Grass ${E} kJ, rabbits get ${ctx.num(E2)} kJ: efficiency?`;
  const P = (x) => `${ctx.num(x)} %`;
  return mk(q, P(p), [P(100 - p), P(p * 10), P(p / 10), P(10), P(p * 2)]);
});

const ECO1 = [
  ["Osebki ene vrste na enem območju?|Individuals of one species in an area?", "populacija|population", "združba|community", "ekosistem|ecosystem", "biosfera|biosphere"],
  ["Vse populacije na enem območju?|All populations in one area?", "združba|community", "populacija|population", "vrsta|species", "biosfera|biosphere"],
  ["Združba in neživo okolje skupaj?|Community plus non-living surroundings?", "ekosistem|ecosystem", "populacija|population", "združba|community", "vrsta|species"],
  ["Razkrojevalci so?|Decomposers are?", "glive in bakterije|fungi and bacteria", "rastline|plants", "rastlinojedci|herbivores", "plenilci|predators"],
  ["Neživi dejavnik okolja?|An abiotic factor?", "temperatura|temperature", "plenilec|predator", "zajedavec|parasite", "tekmec|competitor"],
  ["Živi dejavnik okolja?|A biotic factor?", "plenilec|predator", "temperatura|temperature", "svetloba|light", "vlaga|humidity"],
  ["Živali, ki jedo le rastline?|Animals that eat only plants?", "rastlinojedci|herbivores", "mesojedci|carnivores", "vsejedci|omnivores", "razkrojevalci|decomposers"],
  ["Živali, ki jedo rastline in živali?|Animals that eat plants and animals?", "vsejedci|omnivores", "rastlinojedci|herbivores", "mesojedci|carnivores", "proizvajalci|producers"],
  ["Kdo v ekosistemu tvori hrano iz CO₂?|Who makes food from CO₂ in an ecosystem?", "proizvajalci|producers", "potrošniki|consumers", "razkrojevalci|decomposers", "plenilci|predators"],
  ["Žival, ki lovi druge živali?|An animal that hunts other animals?", "plenilec|predator", "plen|prey", "zajedavec|parasite", "rastlinojedec|herbivore"],
  ["Vsi ekosistemi Zemlje skupaj?|All of Earth's ecosystems together?", "biosfera|biosphere", "združba|community", "populacija|population", "atmosfera|atmosphere"],
  ["Mrtve organizme razgrajujejo?|Dead organisms are broken down by?", "razkrojevalci|decomposers", "proizvajalci|producers", "rastlinojedci|herbivores", "plenilci|predators"],
];
const ECO2 = [
  ["Odnos: koristi imata obe vrsti?|Relationship: both species benefit?", "mutualizem|mutualism", "zajedavstvo|parasitism", "komenzalizem|commensalism", "plenilstvo|predation"],
  ["Odnos: ena korist, gostitelj škodo?|One benefits, the host is harmed?", "zajedavstvo|parasitism", "mutualizem|mutualism", "komenzalizem|commensalism", "tekmovanje|competition"],
  ["Odnos: ena korist, druga brez vpliva?|One benefits, the other unaffected?", "komenzalizem|commensalism", "mutualizem|mutualism", "zajedavstvo|parasitism", "plenilstvo|predation"],
  ["Lišaj: gliva + ?|Lichen: fungus + ?", "alga|alga", "mah|moss", "praprot|fern", "kvasovka|yeast"],
  ["Dušik iz zraka vežejo?|Nitrogen from the air is fixed by?", "bakterije|bacteria", "rastline|plants", "živali|animals", "glive|fungi"],
  ["Ogljik iz zraka (CO₂) vežejo?|Carbon from the air (CO₂) is fixed by?", "rastline|plants", "živali|animals", "glive|fungi", "razkrojevalci|decomposers"],
];
const ECO3 = [
  ["Toplogredni plin?|A greenhouse gas?", ["CO₂", "CH₄"], "O₂", "N₂", "Ar"],
  ["Gnojila v jezeru povzročijo?|Fertiliser runoff into a lake causes?", "evtrofikacijo|eutrophication", "erozijo|erosion", "fotosintezo|photosynthesis", "sušo|drought"],
  ["Kisli dež povzročata predvsem?|Acid rain is mainly caused by?", "SO₂ in NOₓ|SO₂ and NOₓ", "CO in H₂O|CO and H₂O", "N₂ in O₂|N₂ and O₂", "CH₄ in He|CH₄ and He"],
  ["Ozonska plast nas varuje pred?|The ozone layer protects us from?", "UV-sevanjem|UV radiation", "IR-sevanjem|IR radiation", "radijskimi valovi|radio waves", "vidno svetlobo|visible light"],
  ["Prinesena vrsta, ki se nenadzorovano širi?|An introduced species that spreads?", "invazivna vrsta|invasive species", "endemit|endemic species", "ogrožena vrsta|endangered species", "avtohtona vrsta|native species"],
  ["Vrsta, ki živi le na enem območju?|Species living only in one area?", "endemit|endemic species", "invazivna vrsta|invasive species", "kozmopolit|cosmopolitan", "selivka|migrant"],
  ["Človeška ribica (Dinarski kras) je?|The olm (Dinaric karst) is?", "endemit|endemic species", "invazivna vrsta|invasive species", "kozmopolit|cosmopolitan", "riba|a fish"],
];
def("b_eco", "bi_eko", 9, "Ekosistemi in odnosi", "Ecosystems and relationships", (t, ctx) => bank(ctx, tiered(t, ECO1, ECO2, ECO3)));

// ===== RAZNOLIKOST, EVOLUCIJA, MIKROBI =====
const VERT = [
  ["ribe|fish", ["krap|carp", "postrv|trout", "morski pes|shark", "sled|herring"]],
  ["dvoživke|amphibians", ["žaba|frog", "močerad|fire salamander", "pupek|newt", "človeška ribica|olm"]],
  ["plazilci|reptiles", ["kača|snake", "kuščar|lizard", "želva|tortoise", "krokodil|crocodile"]],
  ["ptiči|birds", ["pingvin|penguin", "noj|ostrich", "kos|blackbird", "sova|owl"]],
  ["sesalci|mammals", ["kit|whale", "netopir|bat", "delfin|dolphin", "kljunaš|platypus"]],
];
const KING = [
  ["glive|fungi", ["kvasovka|yeast", "plesen|mould", "šampinjon|button mushroom"]],
  ["rastline|plants", ["mah|moss", "praprot|fern", "smreka|spruce", "regrat|dandelion"]],
  ["živali|animals", ["spužva|sponge", "korala|coral", "meduza|jellyfish", "deževnik|earthworm"]],
  ["protisti|protists", ["ameba|amoeba", "paramecij|paramecium", "evglena|euglena"]],
  ["bakterije|bacteria", ["cianobakterija|cyanobacterium", "salmonela|Salmonella"]],
];
const INV = [
  ["žuželke|insects", ["mravlja|ant", "čebela|bee", "metulj|butterfly", "kobilica|grasshopper"]],
  ["pajkovci|arachnids", ["pajek|spider", "klop|tick", "škorpijon|scorpion", "pršica|mite"]],
  ["raki|crustaceans", ["rakovica|crab", "jastog|lobster", "vodna bolha|water flea", "mokrica|woodlouse"]],
  ["mehkužci|molluscs", ["polž|snail", "školjka|mussel", "hobotnica|octopus"]],
  ["kolobarniki|annelids", ["deževnik|earthworm", "pijavka|leech"]],
];
def("b_class", "bi_raz", 9, "Razvrščanje organizmov", "Classifying organisms", (t, ctx) => {
  const [set, label] = [[VERT, "skupina vretenčarjev?|vertebrate class?"], [KING, "kraljestvo?|kingdom?"], [INV, "skupina?|group?"]][t - 1];
  const i = R(0, set.length - 1), name = L(ctx, pick(set[i][1]));
  return mk(`${name[0].toUpperCase() + name.slice(1)}: ${L(ctx, label)}`, L(ctx, set[i][0]), shuffle(set.filter((_, j) => j !== i)).map((x) => L(ctx, x[0])));
});

const PL1 = [
  ["Prevaja vodo od korenin navzgor?|Carries water up from the roots?", "ksilem|xylem", "floem|phloem", "listne reže|stomata", "kambij|cambium"],
  ["Prevaja sladkorje po rastlini?|Carries sugars around the plant?", "floem|phloem", "ksilem|xylem", "listne reže|stomata", "korenina|root"],
  ["Sprejema vodo in rudninske snovi?|Takes up water and minerals?", "korenina|root", "list|leaf", "steblo|stem", "cvet|flower"],
  ["Glavni organ fotosinteze?|Main organ of photosynthesis?", "list|leaf", "korenina|root", "cvet|flower", "plod|fruit"],
  ["Organ za spolno razmnoževanje kritosemenk?|Reproductive organ of flowering plants?", "cvet|flower", "list|leaf", "korenina|root", "steblo|stem"],
  ["Iz plodnice nastane?|The ovary develops into the?", "plod|fruit", "seme|seed", "cvet|flower", "list|leaf"],
  ["Pritrdi rastlino v tla?|Anchors the plant in the soil?", "korenina|root", "steblo|stem", "list|leaf", "cvet|flower"],
  ["Nosi liste in cvetove?|Holds up leaves and flowers?", "steblo|stem", "korenina|root", "plod|fruit", "seme|seed"],
  ["Barvit del cveta, ki privablja žuželke?|Colourful flower part attracting insects?", "venčni list|petal", "čašni list|sepal", "korenina|root", "steblo|stem"],
  ["Zrnca, ki jih čebele nosijo s cveta na cvet?|Grains bees carry from flower to flower?", "pelod|pollen", "semena|seeds", "trosi|spores", "škrob|starch"],
  ["V semenu je?|Inside a seed is the?", "kalček|embryo", "cvet|flower", "pelod|pollen", "plodnica|ovary"],
  ["Listne reže so večinoma na?|Stomata are mostly on the?", "spodnji strani lista|underside of leaves", "koreninah|roots", "cvetovih|flowers", "plodovih|fruits"],
];
const PL2 = [
  ["Iz semenske zasnove nastane?|The ovule develops into the?", "seme|seed", "plod|fruit", "cvet|flower", "prašnik|stamen"],
  ["Moški del cveta?|Male part of a flower?", "prašnik|stamen", "pestič|pistil", "venčni list|petal", "čašni list|sepal"],
  ["Ženski del cveta?|Female part of a flower?", "pestič|pistil", "prašnik|stamen", "venčni list|petal", "čašni list|sepal"],
  ["Prenos peloda na brazdo?|Transfer of pollen to the stigma?", "opraševanje|pollination", "oploditev|fertilisation", "kalitev|germination", "transpiracija|transpiration"],
  ["Izhlapevanje vode iz listov?|Loss of water vapour from leaves?", "transpiracija|transpiration", "fotosinteza|photosynthesis", "dihanje|respiration", "kalitev|germination"],
  ["Razvoj semena v rastlino?|A seed growing into a plant?", "kalitev|germination", "opraševanje|pollination", "transpiracija|transpiration", "oploditev|fertilisation"],
];
const PL3 = [
  ["Golosemenka?|A gymnosperm?", ["smreka|spruce", "bor|pine", "jelka|fir"], "hrast|oak", "tulipan|tulip", "mah|moss"],
  ["Kritosemenka?|An angiosperm?", ["hrast|oak", "tulipan|tulip", "regrat|dandelion"], "smreka|spruce", "bor|pine", "praprot|fern"],
  ["Rastlina, ki se razmnožuje s trosi?|A plant that reproduces by spores?", ["praprot|fern", "mah|moss"], "bor|pine", "hrast|oak", "tulipan|tulip"],
  ["Enokaličnica?|A monocot?", ["pšenica|wheat", "koruza|maize", "tulipan|tulip"], "fižol|bean", "hrast|oak", "sončnica|sunflower"],
  ["Vodo v steblu navzgor vleče predvsem?|Water is pulled up the stem mainly by?", "transpiracija|transpiration", "fotosinteza|photosynthesis", "floem|phloem", "dihanje|respiration"],
];
def("b_plant", "bi_raz", 9, "Zgradba in delovanje rastlin", "Plant structure and function", (t, ctx) => bank(ctx, tiered(t, PL1, PL2, PL3)));

const EV1 = [
  ["Preživijo in se razmnožujejo bolje prilagojeni?|Better adapted survive and reproduce?", "naravni izbor|natural selection", "umetni izbor|artificial selection", "mutacija|mutation", "genski zdrs|genetic drift"],
  ["Žlahtnjenje (izbira človeka) je?|Selective breeding by humans is?", "umetni izbor|artificial selection", "naravni izbor|natural selection", "genski zdrs|genetic drift", "mutacija|mutation"],
  ["Ostanki organizmov v kamninah?|Remains of organisms in rock?", "fosili|fossils", "minerali|minerals", "kristali|crystals", "sedimenti|sediments"],
  ["Starost Zemlje (približno)?|Age of the Earth (approx.)?", "4,6 milijarde let|4.6 billion years", "6000 let|6000 years", "46 milijonov let|46 million years", "460 milijard let|460 billion years"],
  ["Človek in šimpanz imata?|Humans and chimpanzees have?", "skupnega prednika|a common ancestor", "isto vrsto|the same species", "enako DNK|identical DNA", "nič skupnega|nothing in common"],
  ["Vrsta, ki je ni več nikjer, je?|A species that no longer exists is?", "izumrla|extinct", "ogrožena|endangered", "endemična|endemic", "invazivna|invasive"],
  ["Fosili so najpogosteje v?|Fossils are most often found in?", "sedimentnih kamninah|sedimentary rock", "magmatskih kamninah|igneous rock", "lavi|lava", "ledu|ice"],
  ["Fosili v globljih plasteh so?|Fossils in deeper rock layers are?", "starejši|older", "mlajši|younger", "enako stari|the same age", "vedno večji|always larger"],
  ["Enota, katere osebki imajo plodne potomce?|Group whose members have fertile offspring?", "vrsta|species", "družina|family", "red|order", "razred|class"],
  ["Zakrneli organ človeka?|A vestigial structure in humans?", "trtica|tailbone", "srce|heart", "jetra|liver", "pljuča|lungs"],
  ["Ptiči so se razvili iz?|Birds evolved from?", "dinozavrov|dinosaurs", "sesalcev|mammals", "žuželk|insects", "netopirjev|bats"],
  ["Človek je po razvrstitvi?|Humans are classified as?", "sesalec|mammals", "plazilec|reptiles", "dvoživka|amphibians", "ptič|birds"],
];
const EV2 = [
  ["Vir nove genske variabilnosti?|Source of new genetic variation?", "mutacije|mutations", "naravni izbor|natural selection", "umetni izbor|artificial selection", "izumrtje|extinction"],
  ["Roka človeka in krilo netopirja sta?|A human arm and a bat wing are?", "homologna organa|homologous", "analogna organa|analogous", "zakrnela organa|vestigial", "mutirana organa|mutated"],
  ["Krilo ptiča in krilo metulja sta?|A bird wing and a butterfly wing are?", "analogna organa|analogous", "homologna organa|homologous", "zakrnela organa|vestigial", "mutirana organa|mutated"],
  ["Nastanek nove vrste?|Formation of a new species?", "speciacija|speciation", "mutacija|mutation", "izumrtje|extinction", "oploditev|fertilisation"],
  ["Odpornost bakterij na antibiotike je posledica?|Antibiotic resistance in bacteria results from?", "naravnega izbora|natural selection", "umetnega izbora|artificial selection", "cepljenja|vaccination", "fotosinteze|photosynthesis"],
];
const EV3 = [
  ["Naključno spreminjanje frekvenc alelov v majhni populaciji?|Random allele frequency change in a small population?", "genski zdrs|genetic drift", "naravni izbor|natural selection", "mutacija|mutation", "umetni izbor|artificial selection"],
  ["Prvi organizmi na Zemlji so bili?|The first organisms on Earth were?", "prokarionti|prokaryotes", "sesalci|mammals", "rastline|plants", "glive|fungi"],
  ["Kisik v ozračje so prve sproščale?|The first to release O₂ into the air were?", "cianobakterije|cyanobacteria", "živali|animals", "glive|fungi", "plazilci|reptiles"],
  ["Prenos genov med populacijama?|Movement of genes between populations?", "pretok genov|gene flow", "genski zdrs|genetic drift", "speciacija|speciation", "mutacija|mutation"],
];
def("b_evo", "bi_raz", 12, "Evolucija", "Evolution", (t, ctx) => bank(ctx, tiered(t, EV1, EV2, EV3)));

const VIR = ["gripa|flu", "ošpice|measles", "norice|chickenpox", "prehlad|common cold", "steklina|rabies", "mumps|mumps", "rdečke|rubella", "otroška paraliza|polio"];
const BAK = ["tuberkuloza|tuberculosis", "tetanus|tetanus", "salmoneloza|salmonellosis", "kolera|cholera", "borelioza|Lyme disease", "davica|diphtheria", "oslovski kašelj|whooping cough", "škrlatinka|scarlet fever"];
const IM2 = [
  ["Antibiotiki delujejo proti?|Antibiotics work against?", "bakterijam|bacteria", "virusom|viruses", "alergijam|allergies", "gripi|flu"],
  ["Cepivo vsebuje?|A vaccine contains?", "antigene|antigens", "protitelesa|antibodies", "antibiotike|antibiotics", "bele krvničke|white blood cells"],
  ["Virus se razmnožuje le?|A virus can multiply only?", "v živi celici|in a host cell", "v vodi|in water", "z delitvijo|by dividing", "v zraku|in the air"],
  ["Nima celične zgradbe?|Not made of cells?", "virus|virus", "bakterija|bacterium", "kvasovka|yeast", "ameba|amoeba"],
  ["Za peko kruha uporabljamo?|Bread is made using?", "kvasovke|yeast", "bakterije|bacteria", "viruse|viruses", "alge|algae"],
  ["Penicilin pridobivamo iz?|Penicillin comes from a?", "plesni|mould", "bakterije|bacterium", "virusa|virus", "alge|alga"],
];
const IM3 = [
  ["Protitelesa tvorijo?|Antibodies are made by?", "limfociti B|B cells", "limfociti T|T cells", "rdeče krvničke|red blood cells", "krvne ploščice|platelets"],
  ["Celice, ki požirajo mikrobe?|Cells that engulf microbes?", "fagociti|phagocytes", "limfociti B|B cells", "rdeče krvničke|red blood cells", "krvne ploščice|platelets"],
  ["Imunost po cepljenju je?|Immunity after vaccination is?", "aktivna|active", "pasivna|passive", "prirojena|innate", "nespecifična|non-specific"],
  ["Protitelesa iz materinega mleka dajejo?|Antibodies in breast milk give?", "pasivno imunost|passive immunity", "aktivno imunost|active immunity", "alergijo|an allergy", "cepljenje|vaccination"],
  ["Virus HIV napada?|HIV attacks?", "limfocite T|T cells", "rdeče krvničke|red blood cells", "jetrne celice|liver cells", "nevrone|neurons"],
  ["Bakterija je?|A bacterium is a?", "prokariont|prokaryote", "evkariont|eukaryote", "virus|virus", "gliva|fungus"],
];
def("b_immu", "bi_raz", 10, "Mikroorganizmi in imunost", "Microbes and immunity", (t, ctx) => {
  if (t === 1 || Math.random() < 0.25) {
    return Math.random() < 0.5
      ? which(ctx, "Bolezen, ki jo povzroča virus?|Disease caused by a virus?", VIR, BAK)
      : which(ctx, "Bolezen, ki jo povzroča bakterija?|Disease caused by bacteria?", BAK, VIR);
  }
  return bank(ctx, t === 2 ? IM2 : [...IM2, ...IM3, ...IM3]);
});

export const CONCEPTS = C;
