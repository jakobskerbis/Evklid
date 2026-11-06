// Skupine delov 3D modelov (j, 6. 11. 14:50): ime skupine (»zaklopke«, »venčne žile«, »organeli« …) izbere vse njene
// dele hkrati; pregledovalnik jih osvetli in skrije ovoje okoli njih (skrijObdajajoce), da so vidni. Isti podatki
// služijo strežniku (server/odpri.js: <<ODPRI 3d="srce" del="zaklopke">> → id skupine). Imena v vseh jezikih so
// ključi a3.grp.<id> (public/i18n), sinonimi tu so slovenski (iskanje po besedah, sklanjatve ujame mehko ujemanje).
// Samo podatki (brez uvozov): uvozi jih tudi Node.
export const SKUPINE = {
  "organ-srce": [
    { id: "zaklopke", deli: ["av-zaklopki", "aortna-zaklopka", "pljucna-zaklopka"], sinonimi: ["srčne zaklopke", "zaklopke srca", "valvule", "jadrasti in žepasti zaklopki"] },
    { id: "preddvora", deli: ["desni-preddvor", "levi-preddvor"], sinonimi: ["preddvori", "atrija", "atriji", "oba preddvora"] },
    { id: "prekata", deli: ["desni-prekat", "levi-prekat"], sinonimi: ["prekati", "ventrikla", "ventrikli", "oba prekata"] },
    { id: "velike-zile", deli: ["aorta", "pljucno-deblo", "votli-veni", "pljucne-vene"], sinonimi: ["glavne žile", "žile ob srcu", "velike krvne žile"] },
    { id: "vencne-zile", deli: ["vencne-arterije", "vencne-vene"], sinonimi: ["koronarne žile", "koronarke", "žile srca"] },
    { id: "pretina", deli: ["medprekatni-pretin", "ovalna-kotanja"], sinonimi: ["srčna pretina", "septuma", "pretin srca"] },
  ],
  "organ-mozgani": [
    { id: "reznji", deli: ["celni", "temenski", "senceni", "zatilni", "otok", "limbicni"], sinonimi: ["režnji možganov", "možganski režnji", "lobusi"] },
    { id: "medmozgani", deli: ["talamus", "hipotalamus"], sinonimi: ["diencefalon", "vmesni možgani"] },
  ],
  "organ-oko": [
    { id: "lomni-deli", deli: ["rozenica", "leca", "steklovina"], sinonimi: ["optični deli", "deli, ki lomijo svetlobo"] },
    { id: "ovojnice-zrkla", deli: ["belocnica", "rozenica", "zilnica", "sarenica", "mreznica"], sinonimi: ["plasti zrkla", "očesne ovojnice", "stena zrkla"] },
  ],
  "organ-pljuca": [
    { id: "reznji", deli: ["desni-zgornji", "desni-srednji", "desni-spodnji", "levi-zgornji", "levi-spodnji"], sinonimi: ["pljučni režnji", "lobusi"] },
    { id: "dihalne-poti", deli: ["sapnik", "bronhiji"], sinonimi: ["dihalne cevi", "sapnik in bronhiji"] },
    { id: "pljucne-zile", deli: ["pljucne-arterije", "pljucne-vene"], sinonimi: ["žile pljuč", "krvne žile pljuč"] },
  ],
  "organ-ledvica": [
    { id: "ledvicne-zile", deli: ["ledvicna-arterija", "ledvicna-vena"], sinonimi: ["žile ledvice", "krvne žile ledvice"] },
    { id: "odvodne-poti", deli: ["papile", "meh", "secevod"], sinonimi: ["sečne poti", "votli sistem ledvice", "ledvični meh in sečevod"] },
  ],
  "organ-jetra": [
    { id: "reznji", deli: ["desni-rezenj", "levi-rezenj", "kvadratni-rezenj", "repasti-rezenj"], sinonimi: ["jetrni režnji", "lobusi"] },
    { id: "zolcne-poti", deli: ["zolcnik", "zolcevod"], sinonimi: ["žolčevodi", "žolčnik in žolčevod"] },
    { id: "jetrne-zile", deli: ["portalna-vena", "jetrna-arterija", "jetrne-vene"], sinonimi: ["žile jeter", "krvne žile jeter"] },
  ],
  "celica-zivalska": [
    { id: "organeli", deli: ["mitohondrij", "golgi", "zrnati-er", "gladki-er", "lizosom", "peroksisom", "centrosom", "ribosomi", "mesicki"], sinonimi: ["celični organeli", "organele"] },
    { id: "membrane", deli: ["membrana", "jedrna-ovojnica"], sinonimi: ["ovojnice", "celične membrane"] },
    { id: "jedro-celice", deli: ["jedro", "jedrce", "kromatin", "nukleoplazma", "jedrna-ovojnica"], sinonimi: ["celično jedro z deli", "deli jedra"] },
  ],
  "celica-rastlinska": [
    { id: "organeli", deli: ["mitohondrij", "golgi", "er", "kloroplast", "ribosomi", "vakuola"], sinonimi: ["celični organeli", "organele"] },
    { id: "membrane", deli: ["membrana", "tonoplast"], sinonimi: ["ovojnice", "celične membrane"] },
    { id: "jedro-celice", deli: ["jedro", "jedrce", "kromatin"], sinonimi: ["celično jedro z deli", "deli jedra"] },
    { id: "ovoj-celice", deli: ["celicna-stena", "membrana"], sinonimi: ["celični ovoj", "stena in membrana", "ovojnica celice"] },
  ],
  "celica-bakterijska": [
    { id: "ovoj-celice", deli: ["kapsula", "celicna-stena", "membrana"], sinonimi: ["celični ovoj", "stena in membrana", "ovojnica celice"] },
    { id: "dedni-zapis", deli: ["nukleoid", "plazmidi"], sinonimi: ["dedna snov", "genom", "DNK in RNK", "genski material"] },
    { id: "gibala", deli: ["bicki", "bazalno-telo"], sinonimi: ["gibanje", "za gibanje", "deli za premikanje"] },
  ],
  "celica-ameba": [
    { id: "mehurcki", deli: ["krcljivi-mehurcek", "prebavni-mehurcki"], sinonimi: ["vakuole", "krčljivi in prebavni mehurčki"] },
  ],
  "celica-paramecij": [
    { id: "mehurcki", deli: ["krcljivi-mehurcek", "prebavni-mehurcki"], sinonimi: ["vakuole", "krčljivi in prebavni mehurčki"] },
    { id: "jedro-celice", deli: ["makronukleus", "makronukleus-notranjost", "mikronukleus"], sinonimi: ["celično jedro z deli", "deli jedra"] },
  ],
  "celica-evglena": [
    { id: "organeli", deli: ["kloroplasti", "krcljivi-mehurcek", "ocesna-pega", "svetlobno-cutilo"], sinonimi: ["celični organeli", "organele"] },
    { id: "jedro-celice", deli: ["jedro", "jedrce"], sinonimi: ["celično jedro z deli", "deli jedra"] },
  ],
  "celica-casasta": [
    { id: "organeli", deli: ["zrnati-er", "ribosomi", "golgi", "mitohondrij", "zrnca-sluzi"], sinonimi: ["celični organeli", "organele"] },
  ],
  "celica-epitelna": [
    { id: "organeli", deli: ["mitohondrij", "zrnati-er", "ribosomi", "golgi"], sinonimi: ["celični organeli", "organele"] },
    { id: "stiki-celic", deli: ["tesni-stiki", "dezmosomi"], sinonimi: ["medcelični stiki", "stiki med celicami"] },
  ],
  "celica-koreninski-lasek": [
    { id: "organeli", deli: ["vakuola", "mitohondrij", "mesicki"], sinonimi: ["celični organeli", "organele"] },
    { id: "ovoj-celice", deli: ["stena", "membrana"], sinonimi: ["celični ovoj", "stena in membrana", "ovojnica celice"] },
    { id: "jedro-celice", deli: ["jedro", "jedrce"], sinonimi: ["celično jedro z deli", "deli jedra"] },
  ],
  "celica-kvasovka": [
    { id: "organeli", deli: ["vakuola", "mitohondriji", "er", "ribosomi", "lipidne-kapljice"], sinonimi: ["celični organeli", "organele"] },
    { id: "ovoj-celice", deli: ["celicna-stena", "membrana"], sinonimi: ["celični ovoj", "stena in membrana", "ovojnica celice"] },
    { id: "jedro-celice", deli: ["jedro", "jedrce"], sinonimi: ["celično jedro z deli", "deli jedra"] },
  ],
  "celica-nevron": [
    { id: "organeli", deli: ["nisslova-telesca", "mitohondriji"], sinonimi: ["celični organeli", "organele"] },
    { id: "jedro-celice", deli: ["jedro", "nukleoplazma", "jedrce"], sinonimi: ["celično jedro z deli", "deli jedra"] },
    { id: "izrastki", deli: ["dendriti", "akson", "koncne-razvejitve", "sinapticni-koncici"], sinonimi: ["nevriti", "dendriti in akson", "živčni izrastki"] },
    { id: "ovoj-aksona", deli: ["mielinska-ovojnica", "schwannova-celica", "ranvierjev-zazemek"], sinonimi: ["mielin", "mielinski ovoj", "ovojnica aksona"] },
  ],
  "celica-palicica-cepek": [
    { id: "zunanji-clenki", deli: ["zunanji-clenek-palicice", "diski-rodopsin", "zunanji-clenek-cepka", "gube-jodopsin"], sinonimi: ["vidni pigmenti", "rodopsin in jodopsin", "zunanji del čutnic"] },
    { id: "jedro-celice", deli: ["jedro", "nukleoplazma"], sinonimi: ["celično jedro z deli", "deli jedra"] },
  ],
  "celica-palisadna": [
    { id: "organeli", deli: ["kloroplast", "mitohondrij", "vakuola"], sinonimi: ["celični organeli", "organele"] },
    { id: "ovoj-celice", deli: ["stena", "membrana"], sinonimi: ["celični ovoj", "stena in membrana", "ovojnica celice"] },
    { id: "jedro-celice", deli: ["jedro", "jedrce"], sinonimi: ["celično jedro z deli", "deli jedra"] },
  ],
  "celica-skeletno-misicno-vlakno": [
    { id: "sarkomera", deli: ["z-linija", "aktin", "miozin", "miozinske-glavice", "m-linija", "titin", "pas-a", "pas-i", "cona-h"], sinonimi: ["sarkomere", "deli sarkomere", "aktin in miozin", "progavost"] },
    { id: "organeli", deli: ["mitohondriji", "sarkoplazemski-retikulum", "t-cevke"], sinonimi: ["celični organeli", "organele"] },
  ],
  "celica-srcna-misicna": [
    { id: "jedro-celice", deli: ["jedro", "nukleoplazma"], sinonimi: ["celično jedro z deli", "deli jedra"] },
    { id: "organeli", deli: ["mitohondriji", "miofibrile"], sinonimi: ["celični organeli", "organele"] },
  ],
  "celica-trombocit": [
    { id: "zrnca", deli: ["alfa-zrnca", "gosta-zrnca"], sinonimi: ["granule", "zrnca trombocita"] },
    { id: "organeli", deli: ["alfa-zrnca", "gosta-zrnca", "mitohondrij", "ocs"], sinonimi: ["celični organeli", "organele"] },
  ],
  "celica-zapiralka": [
    { id: "organeli", deli: ["kloroplasti", "vakuola"], sinonimi: ["celični organeli", "organele"] },
  ],
  "virus-hiv": [
    { id: "beljakovine-ovojnice", deli: ["gp120", "gp41"], sinonimi: ["glikoproteini", "beljakovine na površini", "konice"] },
    { id: "encimi", deli: ["reverzna-transkriptaza", "integraza"], sinonimi: ["virusni encimi"] },
    { id: "ovoji-virusa", deli: ["ovojnica", "matriks", "kapsida"], sinonimi: ["plasti virusa", "ovojnica in kapsida"] },
  ],
  "virus-sars-cov-2": [
    { id: "beljakovine-ovojnice", deli: ["beljakovina-s", "beljakovina-m", "beljakovina-e"], sinonimi: ["beljakovine na površini", "konice", "strukturne beljakovine"] },
    { id: "dedni-zapis", deli: ["rnk", "nukleokapsida"], sinonimi: ["dedna snov", "genom", "DNK in RNK", "genski material"] },
  ],
  "virus-bakteriofag-t4": [
    { id: "rep", deli: ["vrat", "plasc", "cevka", "bazalna-plosca", "dolga-vlakna", "kratka-vlakna"], sinonimi: ["rep faga", "repna vlakna", "deli repa"] },
    { id: "gostitelj", deli: ["stena-bakterije", "membrana-bakterije"], sinonimi: ["bakterija", "gostiteljska celica"] },
  ],
};

const fold = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
// Mehko ujemanje: enake besede ali skupna osnova (prvih 5 črk: »zaklopke« ~ »zaklopk«, »preddvora« ~ »preddvori«).
const osnova = (w) => w.slice(0, Math.max(4, Math.min(5, w.length - 1)));
function ujemanje(q, ime) {
  const a = fold(q), b = fold(ime);
  if (!a || !b) return 0;
  if (a === b) return 3;
  const A = a.split(" ").map(osnova), B = b.split(" ").map(osnova);
  const skupne = A.filter((w) => B.includes(w)).length;
  return skupne === A.length && skupne === B.length ? 2 : skupne === A.length ? 1 : 0; // vse besede vprašanja v imenu
}

/**
 * Skupina modela po besedah (id, sinonimi ali imena v jezikih: imena = { id: [ime, …] }); vrne id ali null.
 */
export function najdiSkupino(modelId, q, imena = {}) {
  let naj = null;
  for (const g of SKUPINE[modelId] || []) {
    for (const ime of [g.id.replace(/-/g, " "), ...(g.sinonimi || []), ...(imena[g.id] || [])]) {
      const s = ujemanje(q, ime);
      if (s && (!naj || s > naj.s)) naj = { s, id: g.id };
    }
  }
  return naj && naj.s >= 1 ? naj.id : null;
}
