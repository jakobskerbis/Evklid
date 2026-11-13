// Kateri preparat mikroskopa pokaže tkivo iz 3D sveta (j, 12. 11. 2026: »Naj bo mozno vsako tkivo v 3d svetu pogledati
// z mikroskopom«). Atlas telesa: najprej angleško ime strukture (Z-Anatomy), nato material; modeli celic in organov po id
// (pri organih iz GLB tudi po delu). test/mikroskop.test.js preveri, da ima vsaka struktura atlasa in vsaka celica svoj
// preparat. Brez DOM, da jo uporabi tudi test.

// Ime pove tkivo (arterija, kost, mišica …) ali je površinska regija kože: velja material, ne organ v imenu
// (»Renal artery« je arterija, ne ledvica; »Lacrimal bone« kost, ne požiralnik; »Thyroid cartilage« hrustanec).
const TKIVO_V_IMENU = /\b(arter(y|ies)|veins?|bones?|cartilages?|muscles?|(?<!round )ligaments?|nerves?|fascia)\b/i; // okrogla vez maternice: gladke mišice (pravilo spodaj)

// [vzorec imena, preparat]: prvo ujemanje velja.
const IMENA = [
  [/tentorium|falx|dura mater|arachnoid/i, "vezivo"], // možganske ovojnice so gosto vezivo (pred »cerebell«)
  [/iliotibial/i, "kita"],
  [/\bnucleus of\b/i, "skorja"],
  [/\btracts?\b|\bstria\b|fasciculus|lemniscus|commissure/i, "bela-snov"], // proge živčnih vlaken (pred »thalam«)
  [/thalam|grey matter|gray matter|horn of spinal cord/i, "skorja"], // siva snov (pred »spinal cord«)
  [/cerebell|vermis/i, "mali-mozgani"],
  [/choroid plexus/i, "skorja"],
  [/thymus|spleen|tonsil|\bnodes?\b/i, "bezgavka"],
  [/penis|glans|corpus cavernosum|corpus spongiosum|clitoris/i, "vena"],
  [/\b(atrium|auricle of heart|ventricle of heart|myocardium|heart)\b/i, "srcna-misica"],
  [/leaflet|valve|chordae/i, "kita"],
  [/\b(retina|iris|ciliary|choroid|vitreous|eyeball)\b/i, "mreznica"],
  [/\bcornea|anterior chamber/i, "rozenica"],
  [/\blens\b/i, "leca"],
  [/\bsclera\b/i, "kita"],
  [/\b(incisor|canine|premolar|molar|tooth|teeth)\b/i, "zob"],
  [/\b(nail|hairs?\b|eyelash)/i, "koza"],
  [/thyroid|parathyroid/i, "scitnica"],
  [/suprarenal|adrenal/i, "nadledvicna"],
  [/\bovary\b/i, "jajcnik"],
  [/\btestis\b/i, "modo"],
  [/pancrea|parotid|sublingual|submandibular|lacrimal gland|mammary|vestibular gland|prostate|seminal|epididymis|lactiferous/i, "zleza"],
  [/oesophagus|esophagus|pharynx|palate|uvula|gingiva|vagina|labium minus|lacrimal|nasolacrimal/i, "poziralnik"],
  [/stomach/i, "zelodec"],
  [/duodenum|jejunum|ileum|gallbladder/i, "tanko-crevo"],
  [/colon|caecum|cecum|appendix|rectum|anal canal/i, "debelo-crevo"],
  [/liver|bile duct|hepatic duct/i, "jetra"],
  [/kidney|renal/i, "ledvica"],
  [/bladder|ureter|urethra/i, "mehur"],
  [/trachea|bronch|larynx|nasal|epiglottis/i, "sapnik"],
  [/\blung\b|lobe of (right|left) lung/i, "pljuca"],
  [/uterus|uterine|cervix|ductus deferens|ejaculatory|round ligament/i, "gladka-misica"],
  [/tongue|diaphragm/i, "skeletna-misica"],
  [/white matter|corpus callosum|spinal cord|chiasm|optic tract|fornix|capsule of brain|internal capsule/i, "bela-snov"],
  [/ganglion/i, "zivec"],
  [/omentum|mesocolon|mesentery|fat pad|peritoneum/i, "mascevje"],
];

// Material (brez številke na koncu: Bone-3 → Bone) → preparat.
const MATERIALI = {
  Bone: "kost",
  Suture: "kost",
  "": "kost", // celice sitke (kost)
  Teeth: "zob",
  "Teeth-roots": "zob",
  Cartilage: "hrustanec",
  Nail: "koza",
  Ligament: "kita",
  Tendon: "kita",
  "Articular capsule": "kita",
  Bursa: "vezivo",
  Fascia: "vezivo",
  Fat: "mascevje",
  Artery: "arterija",
  Vein: "vena",
  "Pulmonary artery": "arterija",
  "Pulmonary vein": "vena",
  Lymph: "bezgavka",
  Nerve: "zivec",
  Nucleus: "skorja",
  "Nucleus (afferent fibers)": "skorja",
  "Nucleus (efferent fibers)": "skorja",
  Brain: "skorja",
  "Brain-Inner": "skorja",
  "Frontal lobe": "skorja",
  "Parietal lobe": "skorja",
  "Temporal lobe": "skorja",
  "Occipital lobe": "skorja",
  "Interlobar sulci": "skorja",
  LCR: "skorja",
  "White matter": "bela-snov",
  Cerebellum: "mali-mozgani",
  Cornea: "rozenica",
  Iris: "mreznica",
  Eye: "mreznica",
  Gland: "zleza",
  Mucosa: "poziralnik",
  "Mucosa of stomach": "zelodec",
  Intestine: "tanko-crevo",
  Gallbladder: "tanko-crevo",
  Ductus: "mehur",
  Peritoneum: "mascevje",
  Lung: "pljuca",
  Bronchi: "sapnik",
  Organ: "jetra",
  Skin: "koza",
  "Skin-in": "koza",
  Black: "koza",
};
// Materiali mišic (skupine po gibu, atlas tkiva.js MISICE) → skeletna mišica.
const MISICE = new Set([
  "Abductor", "Adductor", "Biarticular", "Depressor", "Diaphragm", "Extension", "Extension hand/foot", "Extensor extremities",
  "External rotation", "Flexion", "Flexion fingers", "Flexion hand/foot", "Ingestion", "Internal rotator", "Levator", "Masticator",
  "Orbicularis/Constrictor", "Phonation", "Superficial", "Trapezius",
]);

const osnova = (m) => String(m || "").replace(/-\d+'?$/, "");

// Struktura atlasa ({ ime, material }) → id preparata ali null.
export function preparatAtlasa(r) {
  const ime = String(r?.ime || "");
  const m = osnova(r?.material);
  const izMateriala = MISICE.has(m) ? "skeletna-misica" : (MATERIALI[m] ?? null);
  if (izMateriala && (TKIVO_V_IMENU.test(ime) || m === "Skin" || m === "Skin-in")) return izMateriala;
  for (const [re, p] of IMENA) if (re.test(ime)) return p;
  return izMateriala;
}

// Modeli celic in organov (public/3d/modeli) → preparat; pri organih iz GLB lahko del izbere drugega.
const MODELI = {
  "celica-zivalska": "ustne",
  "celica-rastlinska": "list",
  "celice-primerjava": "cebula",
  "celica-bakterijska": "bakterije",
  "celica-kvasovka": "kvasovke",
  "virus-bakteriofag-t4": "virus-t4",
  "virus-sars-cov-2": "virus-sars",
  "virus-hiv": "virus-hiv",
  "celica-nevron": "skorja",
  "celica-gladka-misicna": "gladka-misica",
  "celica-skeletno-misicno-vlakno": "skeletna-misica",
  "celica-srcna-misicna": "srcna-misica",
  "celica-eritrocit": "kri",
  "celica-levkociti": "kri",
  "celica-trombocit": "kri",
  "celica-epitelna": "tanko-crevo",
  "celica-casasta": "tanko-crevo",
  "celica-osteocit": "kost",
  "celica-mascobna": "mascevje",
  "celica-spermij": "modo",
  "celica-jajcece": "jajcnik",
  "celica-palicica-cepek": "mreznica",
  "celica-palisadna": "list",
  "celica-zapiralka": "reza",
  "celica-koreninski-lasek": "koren",
  "celica-ksilem-floem": "steblo",
  "celica-ameba": "kapljica",
  "celica-paramecij": "kapljica",
  "celica-evglena": "kapljica",
  "organ-mozgani": "skorja",
  "organ-srce": "srcna-misica",
  "organ-oko": "mreznica",
  "organ-pljuca": "pljuca",
  "organ-ledvica": "ledvica",
  "organ-jetra": "jetra",
  "organ-mreznica": "mreznica",
  "organ-mesicki": "pljuca",
  "organ-nefron": "ledvica",
  "organ-jetrni-reznjic": "jetra",
  mitoza: "koren",
  mejoza: "modo",
  fotosinteza: "list",
  "sinteza-beljakovin": "zleza",
};
const DELI = {
  "organ-jetra": { zolcnik: "tanko-crevo", "portalna-vena": "vena", "jetrna-arterija": "arterija", "jetrne-vene": "vena" },
  "organ-ledvica": { ovojnica: "kita", meh: "mehur", secevod: "mehur", "ledvicna-arterija": "arterija", "ledvicna-vena": "vena", nadledvicna: "nadledvicna" },
  "organ-mozgani": { mali: "mali-mozgani", deblo: "bela-snov", zuljevo: "bela-snov", krizisce: "bela-snov" },
  "organ-oko": { belocnica: "kita", rozenica: "rozenica", leca: "leca", "vidni-zivec": "zivec", misice: "skeletna-misica" },
  "organ-pljuca": { sapnik: "sapnik", bronhiji: "sapnik", "pljucne-arterije": "arterija", "pljucne-vene": "vena" },
  "organ-srce": {
    aorta: "arterija", "pljucno-deblo": "arterija", "vencne-arterije": "arterija", "votli-veni": "vena", "pljucne-vene": "vena",
    "vencne-vene": "vena", "av-zaklopki": "kita", "aortna-zaklopka": "kita", "pljucna-zaklopka": "kita",
  },
};

export function preparatModela(modelId, delId = null) {
  return (delId && DELI[modelId]?.[delId]) || MODELI[modelId] || null;
}
export const MODELI_Z_MIKROSKOPOM = Object.keys(MODELI);

// Pogled za »Poglej z mikroskopom« pri delu celice (j, 13. 11. 2026: »Naj bo prilagojeno vsakemu posameznemu
// organelu«): preparat, povečava in snov, na katero kaže kazalec (mikroskop.js poišče najbližje tako mesto). Snovi so
// kode S_* iz glsl.js; pri povečavi nad 1000× (TEM) velja snov ultrastrukture, pod njo snov tkiva.
const S = {
  PRAZNO: 0, CITO: 1, JEDRO: 2, KOLAGEN: 3, MINERAL: 4, ERITROCIT: 5, LIPID: 6, MIOFIBRILA: 7, MIELIN: 8, MATRIKS: 9,
  KERATIN: 10, STENA: 11, VAKUOLA: 12, PLAZMA: 14, ELASTIN: 15, SLUZ: 16, VIRUS: 17, MITO: 20, ER: 21, RIBOSOM: 22,
  GLIKOGEN: 23, MEMBRANA: 24, KLOROPLAST: 25, GRANULA: 26, KROMATIN: 27, JEDRCE: 28, GOLGI: 29, MIKROVIL: 30, GENOM: 31, GER: 32,
};
const RASTLINSKE = new Set(["celica-rastlinska", "celice-primerjava", "celica-palisadna", "celica-zapiralka", "celica-koreninski-lasek", "celica-ksilem-floem"]);
const VIRUSI = new Set(["virus-bakteriofag-t4", "virus-sars-cov-2", "virus-hiv"]);
// [vzorec id dela, (model, osnovni preparat) → { p?, m, snov }]: prvo ujemanje velja
const ORGANELI = [
  // ---- fotosinteza: vsi deli kloroplasta (ovojnica, tilakoidi, beljakovine) so v kloroplastu lista
  [/^(zunanja-membrana|notranja-membrana|tilakoidna-membrana|lumen|lamele|plastoglobuli|dnk|fotosistem-ii?|plastokinon|citokrom-b6f|plastocianin|feredoksin|fnr|atp-sintaza|rubisco)$/, (id) => (id === "fotosinteza" ? { p: "list", m: 20000, snov: [S.KLOROPLAST] } : null)],
  // ---- virusi: na ravni molekul (TEM), dedni zapis posebej
  [/^(dnk|rnk|nukleokapsida|nukleokapsidni-protein|integraza|reverzna-transkriptaza|proteaza)$/, (id) => (VIRUSI.has(id) ? { m: 3e6, snov: [S.GENOM] } : null)],
  [/./, (id) => (VIRUSI.has(id) ? { m: 1.5e6, snov: [S.VIRUS, S.GENOM] } : null)],
  // ---- krvne celice in mišična vlakna: deli, ki bi sicer odprli napačno tkivo (preverjeno za vse dele, 13. 11. 2026)
  // zrnca levkocitov in trombocitov se vidijo v razmazu krvi (svetlobni mikroskop), ne v drugem tkivu
  [/^(zrnca|azurofilna-zrnca|alfa-zrnca|gosta-zrnca|fagosom)$/, (id) => (id === "celica-levkociti" || id === "celica-trombocit" ? { p: "kri", m: 1000, snov: [S.CITO, S.JEDRO] } : null)],
  // eritrocit: citoplazma je hemoglobin, mreža spektrina je tik pod membrano
  [/^citoplazma$/, (id) => (id === "celica-eritrocit" ? { p: "kri", m: 1000, snov: [S.ERITROCIT] } : null)],
  [/^citoskelet$/, (id) => (id === "celica-eritrocit" ? { p: "kri", m: 60000, snov: [S.MEMBRANA] } : null)],
  // T-cevke in odprt kanalikularni sistem trombocita sta uvihana celična membrana; gost cevast sistem je gladki ER
  [/^(t-cevke|ocs)$/, () => ({ m: 60000, snov: [S.MEMBRANA] })],
  [/^gost-cevast-sistem$/, () => ({ m: 30000, snov: [S.GER] })],
  // Schwannove celice so v perifernem živcu
  [/^schwannova-celica$/, () => ({ p: "zivec", m: 1000, snov: [S.JEDRO] })],
  // ---- jedro in dedni zapis
  [/^jedrce$/, () => ({ m: 6000, snov: [S.JEDRCE] })],
  // kromosomi pri delitvi: šolski poskus je vršiček korena (mitoza) oziroma modo (mejoza) pod svetlobnim mikroskopom
  [/^(kromatin|kromosomi|centromera|kinetohor|bivalent|hiazma)$/, (id) => (id === "celica-koreninski-lasek" || id === "mitoza" ? { p: "koren", m: 1000, snov: [S.KROMATIN] } : id === "mejoza" ? { p: "modo", m: 1000, snov: [S.KROMATIN, S.JEDRO] } : { m: 8000, snov: [S.KROMATIN, S.JEDRO] })],
  [/^(jedrna-ovojnica|nukleoplazma)$/, () => ({ m: 15000, snov: [S.JEDRO, S.KROMATIN] })],
  [/^(jedro|jedra|makronukleus|makronukleus-notranjost|mikronukleus|osteocit)$/, (id) => (RASTLINSKE.has(id) ? { p: "cebula", m: 400, snov: [S.JEDRO] } : { m: 1000, snov: [S.JEDRO] })],
  [/^(nukleoid|plazmidi)$/, () => ({ m: 1000, snov: [S.CITO] })],
  // ---- organeli, vidni le s TEM
  [/mitohondrij/, () => ({ m: 12000, snov: [S.MITO] })],
  // Nisslova telesca so klasičen prikaz s svetlobnim mikroskopom (bazofilna zrnca v telesu nevrona)
  [/^nisslova-telesca$/, () => ({ p: "skorja", m: 1000, snov: [S.CITO, S.JEDRO] })],
  [/^(golgi|golgijev-aparat)$/, () => ({ m: 20000, snov: [S.GOLGI] })],
  // gladki ER (mreža cevk brez ribosomov) je drug organel kot zrnati (j, 13. 11. 2026: gumb je odprl zrnati ER ustne
  // sluznice); splošna živalska celica ga pokaže v hepatocitu, kjer ga je največ. Sarkoplazemski retikulum je gladki ER.
  [/^(gladki-er|sarkoplazemski-retikulum)$/, (id) => (id === "celica-zivalska" ? { p: "jetra", m: 30000, snov: [S.GER] } : { m: 30000, snov: [S.GER] })],
  [/^(er|zrnati-er)$/, () => ({ m: 20000, snov: [S.ER] })],
  [/^(ribosomi|mrnk)$/, () => ({ m: 60000, snov: [S.RIBOSOM] })],
  [/^glikogen$/, () => ({ p: "jetra", m: 30000, snov: [S.GLIKOGEN] })],
  [/^(lizosomi?|peroksisomi?|mesicki|sinapticni-mesicki|zrnca|alfa-zrnca|gosta-zrnca|azurofilna-zrnca|kortikalna-zrnca|zaloge|paramilon|rumenjak|lipidne-kapljice|fagosom|prebavni-mehurcki|gosta-telesca|akrosom)$/, () => ({ m: 15000, snov: [S.GRANULA, S.LIPID] })],
  [/^(mikrovili|aktin-mikrovilov|terminalna-mreza)$/, () => ({ p: "tanko-crevo", m: 10000, snov: [S.CITO] })],
  [/^(membrana|sarkolema|kaveole|pelikula|zunanja-membrana|periplazma|glikokaliks|glikoforin|pas-3|receptorji|tesni-stiki|pasasti-stik|dezmosomi|presledkovni-stiki|bazalna-membrana|kanalcki|ovojnica)$/, () => ({ m: 60000, snov: [S.MEMBRANA] })],
  // v progastih mišičnih celicah sta aktin in miozin del miofibril (proge vidne s svetlobnim mikroskopom); gladka mišica
  // nima prog, njena krčljiva vlakna so v citoplazmi
  [/^(aktin|miozin|titin)$/, (id) => (id === "celica-gladka-misicna" ? { m: 1000, snov: [S.CITO] } : /misic|vlakno/.test(id) ? { m: 1000, snov: [S.MIOFIBRILA] } : null)],
  [/^(citoskelet|aktin|aktinski-filamenti|mikrotubuli|keratin|vmesni-filamenti|miozin|obroc|centrosom|centriola|aksonema|dinein|oporna-vlakna|vlaknati-plasc|anulus|vezni-del|vreteno)$/, () => ({ m: 40000, snov: [S.CITO] })],
  // ---- rastlinska celica (svetlobni mikroskop: povrhnjica čebule in list)
  [/^(vakuola|tonoplast|krcljivi-mehurcek)$/, (id) => (RASTLINSKE.has(id) ? { p: id === "celica-zapiralka" ? "reza" : "cebula", m: 400, snov: [S.VAKUOLA] } : { m: 1000, snov: [S.VAKUOLA, S.GRANULA] })],
  [/^(celicna-stena|stena|notranja-stena|mikrofibrile|odebelitve|piknje|kutikula)$/, (id) => (id === "celica-bakterijska" || id === "celica-kvasovka" ? { m: 60000, snov: [S.STENA] } : { p: RASTLINSKE.has(id) && id !== "celica-ksilem-floem" && id !== "celica-zapiralka" ? "cebula" : undefined, m: 400, snov: [S.STENA] })],
  [/^(srednja-lamela|plazmodezme)$/, () => ({ m: 15000, snov: [S.STENA] })],
  [/^(kloroplasti?|ocesna-pega)$/, (id) => (id === "celica-rastlinska" || id === "celice-primerjava" ? { p: "list", m: 1000, snov: [S.KLOROPLAST] } : { m: 1000, snov: [S.KLOROPLAST, S.CITO] })],
  [/^(tilakoidi?|tilakoide|granum|grana|stroma|skrob|skrobna-zrna|plastidi)$/, () => ({ p: "list", m: 20000, snov: [S.KLOROPLAST] })],
  // ---- citoplazma
  [/^(citoplazma|sarkoplazma|endoplazma|ektoplazma|celicno-telo|notranji-clenek)$/, (id) => (RASTLINSKE.has(id) ? { p: "cebula", m: 400, snov: [S.CITO] } : { m: 1000, snov: [S.CITO, S.MIOFIBRILA] })],
  // ---- tkiva in snovi okoli celic
  [/^(miofibrile|sarkomera|z-linija|m-linija|pas-a|pas-i|cona-h|titin|interkalarni-disk|motoricna-ploscica)$/, () => ({ m: 1000, snov: [S.MIOFIBRILA] })],
  [/^(mielinska-ovojnica|ranvierjev-zazemek)$/, () => ({ p: "zivec", m: 1000, snov: [S.MIELIN] })],
  [/^(akson|koncne-razvejitve|aksonski-gric)$/, () => ({ p: "zivec", m: 400, snov: [S.CITO, S.MIELIN] })],
  [/^(eritrociti?|hemoglobin|vdolbina)$/, () => ({ p: "kri", m: 1000, snov: [S.ERITROCIT] })],
  [/^(kapljica|drobne-kapljice)$/, () => ({ p: "mascevje", m: 400, snov: [S.LIPID] })],
  [/^vlakna$/, () => ({ p: "mascevje", m: 400, snov: [S.KOLAGEN] })],
  [/^kapilara$/, () => ({ p: "mascevje", m: 400, snov: [S.ERITROCIT] })],
  [/^(medcelicnina|lakuna|kanalikuli|sosednji-osteociti)$/, () => ({ m: 400, snov: [S.MINERAL] })],
  [/^(sluz|zrnca-sluzi)$/, () => ({ m: 400, snov: [S.SLUZ] })],
  [/^(zona|korona|perivitelinski-prostor)$/, () => ({ m: 400, snov: [S.MATRIKS, S.CITO] })],
];
// Snovi ultrastrukture, ki jih TEM nariše le v nekaterih preparatih (preverjeno s sondo mikroskopa, 13. 11. 2026);
// če osnovni preparat snovi nima, pokaže isti organel preparat s spodnjega seznama (rastlinam najprej čebula).
const TEM_VSEBUJE = {
  [S.MITO]: "ustne cebula kvasovke skorja gladka-misica tanko-crevo kost mascevje modo jajcnik mreznica kapljica",
  [S.ER]: "ustne cebula tanko-crevo jajcnik",
  [S.GER]: "jetra mascevje gladka-misica ledvica zelodec mreznica tanko-crevo zleza nadledvicna koren kvasovke",
  [S.RIBOSOM]: "ustne cebula bakterije kvasovke skorja gladka-misica tanko-crevo kapljica",
  [S.MEMBRANA]: "cebula kvasovke gladka-misica srcna-misica kri tanko-crevo kost",
  [S.GRANULA]: "ustne cebula kvasovke skorja gladka-misica tanko-crevo modo jajcnik mreznica kapljica",
  [S.JEDRCE]: "ustne cebula skorja tanko-crevo mreznica",
  [S.GOLGI]: "cebula kvasovke skorja gladka-misica tanko-crevo kapljica",
  [S.STENA]: "cebula bakterije kvasovke",
};
// Nadomestni preparat ostane v isti skupini živih bitij: rastline → čebula, nato vršiček korena; živali → mišica (pri mišičnih celicah), črevo,
// ustna sluznica, možganska skorja, jajčnik (modu najprej jajčnik, gladkemu ER najprej jetra); bakterije, kvasovke in praživali ostanejo na svojem preparatu (človeško
// tkivo bi učenca zavedlo), kazalec pa pokaže najbližjo snov, ki jo preparat ima (NADOMESTNA_SNOV).
const RASTLINSKI_PREPARATI = new Set(["cebula", "list", "reza", "koren", "steblo"]);
const MIKROBNI_PREPARATI = new Set(["bakterije", "kvasovke", "kapljica"]);
const ZIVALSKI_NADOMESTNI = ["tanko-crevo", "ustne", "skorja", "jajcnik"];
const NADOMESTNA_SNOV = {
  [S.JEDRCE]: [S.JEDRO, S.KROMATIN],
  [S.MEMBRANA]: [S.STENA, S.CITO],
  [S.ER]: [S.CITO],
  [S.GER]: [S.ER, S.CITO],
  [S.GOLGI]: [S.CITO],
  [S.RIBOSOM]: [S.CITO],
  [S.GRANULA]: [S.CITO],
  [S.MITO]: [S.CITO],
};
function nadomesti(p, v, misica) {
  const ima = v.m > 1000 && TEM_VSEBUJE[v.snov?.[0]]?.split(" ");
  if (!ima || ima.includes(p)) return { p, snov: v.snov };
  const blizje = misica ? ["gladka-misica"] : p === "modo" ? ["jajcnik"] : []; // najprej soroden preparat
  const prednost = v.snov[0] === S.GER ? ["jetra"] : []; // gladki ER: najprej hepatocit
  const kandidati = RASTLINSKI_PREPARATI.has(p) ? ["cebula", "koren"] : MIKROBNI_PREPARATI.has(p) ? [] : [...blizje, ...prednost, ...ZIVALSKI_NADOMESTNI];
  const q = kandidati.find((x) => ima.includes(x));
  return q ? { p: q, snov: v.snov } : { p, snov: [...v.snov, ...(NADOMESTNA_SNOV[v.snov[0]] || [S.CITO])] };
}
// Deli brez posebne snovi (bički, sosednje celice, prevajalne cevi …): preparat celice pri 400× (bakterije, kvasovke in
// praživali 1000×), kazalec na celici. Ksilem in floem: prevajalni snopič stebla.
const OSTALO = (modelId, p) => {
  if (modelId === "celica-ksilem-floem") return { m: 400, snov: [S.STENA] };
  if (/bakterijska|kvasovka|ameba|paramecij|evglena|palicica/.test(modelId)) return { m: 1000, snov: [S.CITO, S.JEDRO, S.KLOROPLAST] };
  return { m: 400, snov: [S.CITO, S.JEDRO, S.STENA, S.KLOROPLAST, S.VAKUOLA, S.MIOFIBRILA] };
};
const POGLEDI = new Map(); // izračunani pogledi (model|del)

export function pogledDela(modelId, delId = null) {
  const p = preparatModela(modelId, delId);
  if (!p) return null;
  if (!delId || DELI[modelId]?.[delId]) return { p };
  const kljuc = `${modelId}|${delId}`;
  if (!POGLEDI.has(kljuc)) {
    // deli organov (pljučni mešički, nefron …) so tkivo, ne organeli: pokaže jih preparat organa
    if (modelId.startsWith("organ-")) {
      POGLEDI.set(kljuc, { p });
      return POGLEDI.get(kljuc);
    }
    let v = null;
    for (const [re, f] of ORGANELI) if (re.test(delId) && (v = f(modelId))) break;
    // rastlinske celice in procesi (mitoza, fotosinteza): organele, vidne s TEM, pokaže povrhnjica čebule
    const rastlina = RASTLINSKE.has(modelId) || RASTLINSKI_PREPARATI.has(p);
    if (!v) v = OSTALO(modelId, p);
    const osnova = rastlina && v.m > 1000 && !v.p ? "cebula" : v.p || p;
    const n = nadomesti(osnova, v, /misic|vlakno/.test(modelId));
    POGLEDI.set(kljuc, { p: n.p, m: v.m, snov: n.snov });
  }
  return POGLEDI.get(kljuc);
}
