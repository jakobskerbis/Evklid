// Kateri preparat mikroskopa pokaže tkivo iz 3D sveta (j, 12. 11. 2026: »Naj bo mozno vsako tkivo v 3d svetu pogledati
// z mikroskopom«). Atlas telesa: najprej angleško ime strukture (Z-Anatomy), nato material; modeli celic in organov po id
// (pri organih iz GLB tudi po delu). test/mikroskop.test.js preveri, da ima vsaka struktura atlasa in vsaka celica svoj
// preparat. Brez DOM, da jo uporabi tudi test.

// [vzorec imena, preparat]: prvo ujemanje velja.
const IMENA = [
  [/cerebell/i, "mali-mozgani"],
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
  for (const [re, p] of IMENA) if (re.test(ime)) return p;
  const m = osnova(r?.material);
  if (MISICE.has(m)) return "skeletna-misica";
  return MATERIALI[m] ?? null;
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
  "organ-ledvica": { ovojnica: "kita", secevod: "mehur", "ledvicna-arterija": "arterija", "ledvicna-vena": "vena", nadledvicna: "nadledvicna" },
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
