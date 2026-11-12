// Skupine delov 3D modelov (j, 6. 11. 14:50): ime skupine (»zaklopke«, »venčne žile«, »organeli« …) izbere vse njene
// dele hkrati; pregledovalnik jih osvetli in skrije ovoje okoli njih (skrijObdajajoce), da so vidni. Isti podatki
// služijo strežniku (server/odpri.js: <<ODPRI 3d="srce" del="zaklopke">> → id skupine). Imena v vseh jezikih so
// ključi a3.grp.<id> (public/i18n), sinonimi tu so slovenski (iskanje po besedah, sklanjatve ujame mehko ujemanje).
// opisOs/opis/opisStudij: razlaga skupine po ravni (raven.js); smer: smer kamere ob izbiri skupine (npr. zaklopke od zgoraj).
// Samo podatki (brez uvozov): uvozi jih tudi Node.
export const SKUPINE = {
  "organ-srce": [
    { id: "zaklopke", deli: ["av-zaklopki", "aortna-zaklopka", "pljucna-zaklopka", "papilarne-misice"], // n10: tetive vidno pripete na papilarne mišice
      smer: [0.12, 0.82, 0.56], // od zgoraj spredaj: vse štiri zaklopke (osnova srca)
      sinonimi: ["srčne zaklopke", "zaklopke srca", "valvule", "jadrasti in žepasti zaklopki"],
      opisOs: "Štiri zaklopke so kot vratca: kri spustijo samo naprej, nazaj ne.",
      opis: "Jadrasti zaklopki (mitralna in trikuspidalna) ločita preddvora od prekatov, žepasti (aortna in pljučna) sta na izhodu v aorto in pljučno deblo. Zapiranje zaklopk slišimo kot srčna tona.",
      opisStudij: "Fibrozni skelet srca nosi vse štiri obroče skoraj v isti ravnini. 1. ton = zapiranje AV-zaklopk na začetku sistole, 2. ton = zapiranje semilunarnih (ob vdihu fiziološki razcep A2–P2). Mitralna ima dva lističa, trikuspidalna tri, semilunarni po tri žepke." },
    { id: "preddvora", deli: ["desni-preddvor", "levi-preddvor"], sinonimi: ["preddvori", "atrija", "atriji", "oba preddvora"],
      opisOs: "Zgornja prostora srca: sprejmeta kri iz telesa in iz pljuč.",
      opis: "Desni preddvor sprejema kri iz votlih ven in venčnega sinusa, levi s kisikom bogato kri iz štirih pljučnih ven; v prekata jo potisneta skozi jadrasti zaklopki.",
      opisStudij: "Stena ≈ 2 mm; desni ima glavničaste mišice, mejni greben in ovalno kotanjo, levi je pretežno gladek (mišice le v ušesu). Krčenje preddvorov prispeva ≈ 20 % polnjenja prekatov (val a)." },
    { id: "prekata", deli: ["desni-prekat", "levi-prekat"], sinonimi: ["prekati", "ventrikla", "ventrikli", "oba prekata"],
      opisOs: "Spodnja prostora srca: z močnim stiskom potisneta kri iz srca.",
      opis: "Desni prekat poganja kri v pljuča, levi v vse telo, zato ima levi približno trikrat debelejšo steno (10–15 mm proti 3–5 mm).",
      opisStudij: "Sistolni tlak LV ≈ 120 mmHg, RV ≈ 25 mmHg; utripni volumen ≈ 70 ml, iztisni delež 55–70 %. Notranjost prepredajo mesnate trabekule, papilarne mišice prek tetiv držijo lističe." },
    { id: "velike-zile", deli: ["aorta", "pljucno-deblo", "votli-veni", "pljucne-vene"], sinonimi: ["glavne žile", "žile ob srcu", "velike krvne žile"],
      opisOs: "Glavne žile, ki kri pripeljejo v srce in jo odpeljejo iz njega.",
      opis: "Votli veni pripeljeta kri iz telesa, pljučne vene iz pljuč; aorta odvaja kri v telo, pljučno deblo v pljuča.",
      opisStudij: "Koren aorte meri ≈ 3 cm, pljučno deblo ≈ 2,5 cm; arterijska vez je ostanek ductus arteriosus. Pljučne arterije nosijo kri z malo kisika, pljučne vene s kisikom bogato kri." },
    { id: "vencne-zile", deli: ["vencne-arterije", "vencne-vene"], sinonimi: ["koronarne žile", "koronarke", "žile srca"],
      opisOs: "Žile, ki hranijo srčno mišico.",
      opis: "Venčne arterije izhajajo iz korena aorte tik nad aortno zaklopko; venčne vene se zbirajo v venčni sinus, ki se izliva v desni preddvor.",
      opisStudij: "Levo venčno deblo se razcepi v sprednjo medprekatno in obkrožno vejo; desna venčna arterija pri ≈ 70–80 % ljudi daje zadnjo medprekatno arterijo (desna dominanca). Levi prekat dobi kri večinoma v diastoli; zapora veje povzroči srčni infarkt." },
    { id: "pretina", deli: ["medprekatni-pretin", "ovalna-kotanja"], sinonimi: ["srčna pretina", "septuma", "pretin srca"],
      opisOs: "Steni, ki ločita levo in desno polovico srca.",
      opis: "Medprekatni pretin loči prekata, medpreddvorni preddvora, zato se kri obeh polovic ne meša. Od medpreddvornega pretina je prikazana ovalna kotanja – njegov tanki del.",
      opisStudij: "Medprekatni pretin je večinoma mišičen (≈ 1 cm), zgoraj pod aortno zaklopko je tanek membranski del (najpogostejše mesto VSD). Ovalna kotanja je ostanek foramen ovale; pri ≈ 25 % ljudi ostane odprta (PFO)." },
  ],
  "organ-mozgani": [
    { id: "reznji", deli: ["celni", "temenski", "senceni", "zatilni", "otok", "limbicni"], sinonimi: ["režnji možganov", "možganski režnji", "lobusi"],
      opisOs: "Veliki deli možganske skorje; vsak ima svoje naloge.",
      opis: "Čelni (gibanje, načrtovanje, govor), temenski (tip, prostor), senčni (sluh, spomin) in zatilni (vid); otok in limbični reženj sta v globini (okus, čustva, spomin).",
      opisStudij: "Meje: osrednja brazda (čelni/temenski), stranska brazda (senčni), temensko-zatilna brazda. Primarne skorje: motorična (Brodmann 4), somatosenzorična (3-1-2), slušna (41), vidna (17)." },
    { id: "medmozgani", deli: ["talamus", "hipotalamus"], sinonimi: ["diencefalon", "vmesni možgani"],
      opisOs: "Del sredi možganov, ki prenaša sporočila in uravnava telo.",
      opis: "Talamus je postaja za skoraj vse čutne poti do skorje, hipotalamus uravnava telesno temperaturo, lakoto, žejo in hormone (prek hipofize).",
      opisStudij: "Diencephalon obdaja tretji ventrikel; talamus ima jedrne skupine (VPL/VPM za tip, LGN za vid, MGN za sluh), hipotalamus je s hipofizo povezan prek infundibula (oksitocin, ADH, sproščujoči hormoni)." },
  ],
  "organ-oko": [
    { id: "lomni-deli", deli: ["rozenica", "leca", "steklovina"], sinonimi: ["optični deli", "deli, ki lomijo svetlobo"],
      opisOs: "Deli očesa, ki svetlobo zberejo na mrežnico.",
      opis: "Roženica, leča in steklovina lomijo svetlobo; leča spreminja obliko in s tem ostrino (akomodacija).",
      opisStudij: "Lomnost: roženica ≈ 43 D, leča ≈ 15–20 D (pri akomodaciji več), skupaj ≈ 60 D. Prekatna vodka in steklovina imata lomni količnik ≈ 1,336." },
    { id: "ovojnice-zrkla", deli: ["belocnica", "rozenica", "zilnica", "sarenica", "mreznica"], sinonimi: ["plasti zrkla", "očesne ovojnice", "stena zrkla"],
      opisOs: "Plasti, ki sestavljajo steno zrkla.",
      opis: "Zunanja plast (beločnica in roženica) varuje oko, srednja (žilnica in šarenica) ga hrani in uravnava svetlobo, notranja (mrežnica) zaznava svetlobo.",
      opisStudij: "Tunica fibrosa, tunica vasculosa (uvea: žilnica, ciliarnik, šarenica) in tunica interna (retina); svetloba gre skozi vse plasti mrežnice do paličnic in čepnic." },
  ],
  "organ-pljuca": [
    { id: "reznji", deli: ["desni-zgornji", "desni-srednji", "desni-spodnji", "levi-zgornji", "levi-spodnji"], sinonimi: ["pljučni režnji", "lobusi"],
      opisOs: "Pljuča so razdeljena na režnje: desna na tri, leva na dva.",
      opis: "Desna pljuča imajo zgornji, srednji in spodnji reženj (poševna in vodoravna špranja), leva zgornji in spodnji; na levi je prostor za srce.",
      opisStudij: "Vsak reženj ima segmente s svojim segmentnim bronhijem in vejo pljučne arterije (desno 10, levo 8–10); segment je kirurška enota." },
    { id: "dihalne-poti", deli: ["sapnik", "bronhiji"], sinonimi: ["dihalne cevi", "sapnik in bronhiji"],
      opisOs: "Cevi, po katerih zrak potuje v pljuča.",
      opis: "Sapnik se v višini T4–T5 razcepi v levi in desni glavni bronhij, ta pa naprej v vedno manjše bronhije.",
      opisStudij: "Sapnik meri ≈ 10–12 cm in ima 16–20 hrustančnih obročev v obliki črke C; desni glavni bronhij je krajši, širši in bolj navpičen (tujki pogosteje zaidejo desno)." },
    { id: "pljucne-zile", deli: ["pljucne-arterije", "pljucne-vene"], sinonimi: ["žile pljuč", "krvne žile pljuč"],
      opisOs: "Žile, ki pripeljejo kri v pljuča in jo odpeljejo nazaj v srce.",
      opis: "Pljučne arterije nosijo kri z malo kisika iz desnega prekata, pljučne vene s kisikom bogato kri v levi preddvor.",
      opisStudij: "Nizkotlačni obtok (≈ 25/10 mmHg); arterije sledijo bronhijem, vene tečejo med segmenti. Pri pomanjkanju kisika se pljučne arterije skrčijo (Euler-Liljestrand)." },
  ],
  "organ-ledvica": [
    { id: "ledvicne-zile", deli: ["ledvicna-arterija", "ledvicna-vena"], sinonimi: ["žile ledvice", "krvne žile ledvice"],
      opisOs: "Žili, ki pripeljeta kri v ledvico in jo odvajata.",
      opis: "Ledvična arterija iz aorte pripelje skupaj z drugo ledvico ≈ 20 % srčnega iztisa; ledvična vena vodi kri v spodnjo votlo veno.",
      opisStudij: "Leva ledvična vena je daljša in teče med aorto in a. mesenterica superior; arterija se v hilusu deli v segmentne arterije, ki so končne (brez povezav med seboj)." },
    { id: "odvodne-poti", deli: ["meh", "secevod"], sinonimi: ["sečne poti", "votli sistem ledvice", "ledvični meh in sečevod"],
      opisOs: "Poti, po katerih seč odteka iz ledvice.",
      opis: "Seč s papil kaplja v male in velike čašice, ti se zlijejo v ledvični meh, iz njega gre seč po sečevodu v sečni mehur.",
      opisStudij: "7–14 malih čašic se zlije v 2–3 velike in v meh; sečevod meri ≈ 25–30 cm in ima tri zožitve (ob mehu, ob prehodu čez črevnične žile, ob vstopu v mehur), kjer se zagozdijo kamni." },
  ],
  "organ-jetra": [
    { id: "reznji", deli: ["desni-rezenj", "levi-rezenj", "kvadratni-rezenj", "repasti-rezenj"], sinonimi: ["jetrni režnji", "lobusi"],
      opisOs: "Jetra so razdeljena na večje dele – režnje.",
      opis: "Desni reženj je največji; od levega ga spredaj loči srpasta vez, spodaj sta še kvadratni in repasti reženj.",
      opisStudij: "Funkcionalno so jetra razdeljena v osem Couinaudovih segmentov po vejah portalne vene, jetrne arterije in žolčevoda; meja desnih in levih jeter je Cantliejeva ravnina (od žolčnika do spodnje votle vene)." },
    { id: "zolcne-poti", deli: ["zolcnik", "zolcevod"], sinonimi: ["žolčevodi", "žolčnik in žolčevod"],
      opisOs: "Poti, po katerih žolč teče iz jeter v črevo.",
      opis: "Žolč nastaja v jetrih, v žolčniku se shranjuje in zgosti, po žolčevodu pa teče v dvanajstnik in pomaga prebaviti maščobe.",
      opisStudij: "Ductus hepaticus communis in ductus cysticus se združita v ductus choledochus (≈ 7 cm), ki se z vodom trebušne slinavke izliva na papili Vateri; žolčnik se izprazni ob holecistokininu." },
    { id: "jetrne-zile", deli: ["portalna-vena", "jetrna-arterija", "jetrne-vene"], sinonimi: ["žile jeter", "krvne žile jeter"],
      opisOs: "Žile, ki kri pripeljejo v jetra in jo odvajajo.",
      opis: "Portalna vena prinese kri iz prebavil (≈ 75 % pretoka), jetrna arterija s kisikom bogato kri (≈ 25 %); jetrne vene odvajajo kri v spodnjo votlo veno.",
      opisStudij: "Portalna vena nastane za vratom trebušne slinavke iz v. mesenterica superior in v. lienalis; kri teče skozi sinusoide v centralne vene lobulusov in v tri jetrne vene." },
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
    { id: "organeli", deli: ["alfa-zrnca", "gosta-zrnca", "mitohondrij"], sinonimi: ["celični organeli", "organele"] },
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

// Osnova besede za imena delov: brez končnih samoglasnikov, največ 5 črk (»vena« ~ »vene«, »venčna« ~ »venčne«,
// »arterija« ~ »arterije«; kratke besede ostanejo cele).
const koren = (x) => {
  const b = x.replace(/[aeiou]+$/, "");
  return (b.length >= 3 ? b : x).slice(0, 5);
};
const imenaDela = (d) => [d.ime, d.la, ...(d.sinonimi || [])].filter(Boolean);
const brezOklepaja = (x) => fold(String(x || "").replace(/\([^)]*\)/g, " "));

/**
 * Del po imenu (ima prednost pred skupino); deli = [{ id, ime, la, sinonimi? }]; vrne id ali null.
 * 1. enak id, ime, latinsko ime ali sinonim (tudi brez oklepaja: »Akson (nevrit)«);
 * 2. vse osnove besed enake (»venčna arterija« ~ »Venčne arterije«, »pljučna vena« ~ »Pljučne vene«), en sam del;
 * 3. ena beseda: šteje zadetke čez VSA imena; del vrne samo, če ga ima en sam del v imenu z največ dvema besedama
 *    (»membrana« → Celična membrana; »vena« ali »preddvora« nič: več delov ali dolgo ime).
 * Pridevnik »celični« spredaj ne šteje (»celično jedro« → Jedro, ne skupina »Jedro z deli«).
 */
export function delPoImenu(deli, q) {
  const a = fold(q);
  if (!a || !Array.isArray(deli)) return null;
  const tocno = deli.find((d) => d.id === q || [d.id, ...imenaDela(d)].some((x) => fold(x) === a || brezOklepaja(x) === a));
  if (tocno) return tocno.id;
  const A = a.split(" ").map(koren).join(" ");
  const poOsnovi = deli.filter((d) => imenaDela(d).some((x) => brezOklepaja(x).split(" ").map(koren).join(" ") === A));
  if (poOsnovi.length === 1) return poOsnovi[0].id;
  if (!a.includes(" ")) {
    const zadeti = deli.filter((d) => imenaDela(d).some((x) => brezOklepaja(x).split(" ").includes(a)));
    if (zadeti.length === 1 && imenaDela(zadeti[0]).some((x) => brezOklepaja(x).split(" ").includes(a) && brezOklepaja(x).split(" ").length <= 2)) return zadeti[0].id;
  }
  const brez = a.replace(/^celicn\w* /, "");
  return brez !== a ? delPoImenu(deli, brez) : null;
}

/**
 * Kaj izbrati ob odprtju modela z delom iz naslova (»#organ-srce?del=levi prekat«, gumb inštruktorja): id dela,
 * »skupina-<id>« ali null. Del ima prednost (id, ime, delPoImenu, nato začetek imena), sicer skupina (id s strežnika
 * »skupina-…« ali besede; imena = { id skupine: [ime v jeziku vmesnika] }).
 */
export function zacetnaIzbira(modelId, deli, q, imena = {}) {
  if (!q) return null;
  const PRED = "skupina-";
  const want = fold(q);
  const vsi = Array.isArray(deli) ? deli : [];
  const poImenu = delPoImenu(vsi, q);
  const d = vsi.find((x) => x.id === q || fold(x.ime) === want) || vsi.find((x) => x.id === poImenu) || vsi.find((x) => fold(x.ime) && (fold(x.ime).startsWith(want) || want.startsWith(fold(x.ime))));
  if (d) return d.id;
  if (String(q).startsWith(PRED)) return q;
  const g = najdiSkupino(modelId, q, imena);
  return g ? PRED + g : null;
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
