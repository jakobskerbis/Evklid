// Pojmi za igre: nar2 (glej README.md v tej mapi).
// Dodatni pojmi za naravoslovje 6. in 7. razreda: po en pojem za vsako temo učnega načrta,
// ki v nar.js še nima igre. Banke vprašanj: [stopnja, "vprašanje|pravilno|napačno|…" sl, isto en].
// V odgovoru ali napačnem odgovoru "a~b~c" pomeni: ob vsakem vprašanju se izbere ena možnost.

export const SUBJECT = "NAR";
export const AREAS = [];

// ---------- pomožne ----------
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const alt = (s) => pick(s.split("~"));
const C = [];
const def = (id, area, year, glyph, sl, en, gen) => C.push({ id, area, year, glyph, name: { sl, en }, gen });

// Naloga: 3–4 napačni (premešani), brez podvajanja in brez pravilnega.
function out(q, a, ws) {
  const seen = new Set([a]);
  const w = [];
  for (const s of shuffle(ws)) {
    if (s == null || s === "" || seen.has(s) || w.length >= 4) continue;
    seen.add(s);
    w.push(s);
  }
  return { q, a, w };
}
// Banka: stopnja 1 vzame vnose 1; stopnji 2 in 3 večinoma svoje, v 30 % z nižje stopnje.
function bank(items) {
  return (tier, ctx) => {
    let lv = tier;
    if (tier > 1 && Math.random() < 0.3) lv = tier - 1;
    let pool = items.filter((it) => it[0] === lv);
    if (!pool.length) pool = items.filter((it) => it[0] <= tier);
    const it = pick(pool);
    const [q, a, ...ws] = (ctx.lang === "sl" ? it[1] : it[2]).split("|");
    return out(q, alt(a), ws.map(alt));
  };
}
const defBank = (id, area, year, glyph, sl, en, items) => def(id, area, year, glyph, sl, en, bank(items));

// =====================================================================
// 6. RAZRED
// =====================================================================
defBank("n2_method", "nr_mer", 6, "?→!", "Naravoslovni postopki", "Scientific methods", [
  [1, "Zaznavanje s čutili je?|opazovanje|merjenje|tehtanje|računanje", "Noticing things with our senses is?|observing|measuring|weighing|calculating"],
  [1, "Primerjava z mersko enoto je?|merjenje|opazovanje|ugibanje|risanje", "Comparing with a unit is?|measuring|observing|guessing|drawing"],
  [1, "Napoved, ki jo preverimo s poskusom?|domneva|rezultat|meritev|sklep", "A prediction we test by experiment?|hypothesis|result|measurement|conclusion"],
  [1, "Kam pregledno zapišemo meritve?|v preglednico|v domnevo|v naslov|v sklep", "Where do we neatly record measurements?|in a table|in the hypothesis|in the title|in the conclusion"],
  [1, "Kateri zapis je meritev?|list je dolg 8 cm|list je zelen|list je gladek|list je velik", "Which is a measurement?|leaf is 8 cm long|leaf is green|leaf is smooth|leaf is big"],
  [1, "Kateri zapis NI meritev?|voda je topla|voda ima 40 °C|vode je 2 L|voda tehta 2 kg", "Which is NOT a measurement?|water is warm|water is at 40 °C|we have 2 L of water|water weighs 2 kg"],
  [1, "Meritev ponovimo večkrat, da?|je izid zanesljiv|je poskus krajši|ne rabimo enot|ne pišemo zapisa", "Why repeat a measurement?|more reliable result|shorter experiment|no units needed|no need to record"],
  [1, "Pri poskusu naenkrat spremenimo le?|en pogoj|vse pogoje|dva pogoja|nobenega pogoja", "In an experiment we change only?|one condition|all conditions|two conditions|no condition"],
  [1, "Kaj naredimo takoj po poskusu?|zapišemo rezultate|postavimo domnevo|postavimo vprašanje|načrtujemo poskus", "What do we do right after the experiment?|record the results|make a hypothesis|ask a question|plan the test"],
  [1, "Kaj postavimo pred poskusom?|domnevo|sklep|graf|povprečje", "What do we state before the experiment?|a hypothesis|a conclusion|a graph|an average"],
  [1, "Kaj zapišemo na koncu raziskave?|sklep|domnevo|vprašanje|načrt", "What do we write at the end of an investigation?|a conclusion|a hypothesis|a question|a plan"],
  [1, "Pripomoček za opazovanje drobnih stvari?|lupa|tehtnica|termometer|merilni trak", "Tool for looking at tiny things?|magnifying glass|balance|thermometer|tape measure"],
  [2, "Vsaka meritev je?|nekoliko netočna|popolnoma točna|vedno napačna|nepotrebna", "Every measurement is?|slightly uncertain|perfectly exact|always wrong|unnecessary"],
  [2, "Rezultat, ki se ob ponovitvi ne ponovi, je?|nezanesljiv|zanesljiv|natančen|dokazan", "A result that can't be repeated is?|unreliable|reliable|precise|proven"],
  [2, "Temperatura čez dan: primeren prikaz?|črtni diagram|tortni diagram|slika|zemljevid", "Temperature through a day: best display?|line graph|pie chart|picture|map"],
  [2, "Fižol na svetlobi in v temi: kaj spreminjaš?|svetlobo|količino vode|vrsto prsti|velikost lončka", "Beans in light and in dark: what do you change?|light|amount of water|type of soil|pot size"],
  [2, "Fižol na svetlobi in v temi: kaj meriš?|višino rastline|količino vode|velikost lončka|vrsto prsti", "Beans in light and in dark: what do you measure?|plant height|amount of water|pot size|type of soil"],
  [2, "Sladkor v topli in hladni vodi: kaj spreminjaš?|temperaturo vode|količino sladkorja|količino vode|vrsto kozarca", "Sugar in warm and cold water: what do you change?|water temperature|amount of sugar|amount of water|type of glass"],
  [2, "Sladkor v topli in hladni vodi: kaj meriš?|čas raztapljanja|temperaturo vode|količino sladkorja|količino vode", "Sugar in warm and cold water: what do you measure?|time to dissolve|water temperature|amount of sugar|amount of water"],
  [2, "Perilo na soncu in v senci: kaj meriš?|čas sušenja|velikost perila|vrsto blaga|mesto sušenja", "Washing in sun and shade: what do you measure?|drying time|size of cloth|type of fabric|drying place"],
  [3, "Ravnilo z razdelki po 1 mm meri natančno na?|1 mm|1 cm|1 dm|0,1 mm", "A ruler with 1 mm marks measures to the nearest?|1 mm|1 cm|1 dm|0.1 mm"],
  [3, "Meritve 12, 13, 25, 12 cm: katera je verjetno napačna?|25 cm|12 cm|13 cm|nobena", "Readings 12, 13, 25, 12 cm: which is likely wrong?|25 cm|12 cm|13 cm|none"],
  [3, "Domneva se ni potrdila. Kaj storimo?|postavimo novo|popravimo meritve|ne zapišemo nič|izmislimo rezultat", "The hypothesis was wrong. What next?|make a new one|change the data|record nothing|invent a result"],
  [3, "Gladino v merilnem valju beremo?|v višini oči|od zgoraj|od spodaj|postrani", "Read a measuring cylinder?|at eye level|from above|from below|at an angle"],
  [3, "Zakaj poskus izvedemo na več rastlinah?|zanesljivejši izid|hitrejši poskus|manj dela|lepši graf", "Why test several plants, not one?|more reliable result|faster test|less work|nicer graph"],
  [3, "Poskus lahko domnevo potrdi ali?|ovrže|izmeri|nariše|stehta", "An experiment can support a hypothesis or?|reject it|measure it|draw it|weigh it"],
  [3, "Fižol na svetlobi in v temi: kaj ostane enako?|količina vode|svetloba|višina rastline|barva listov", "Beans in light and dark: what stays the same?|amount of water|light|plant height|leaf colour"],
  [3, "Sladkor v topli in hladni vodi: kaj ostane enako?|količina sladkorja|temperatura vode|čas raztapljanja|hitrost raztapljanja", "Sugar in warm and cold water: what stays the same?|amount of sugar|water temperature|time to dissolve|dissolving speed"],
]);

defBank("n2_water", "nr_ziv", 6, "↑", "Pot vode skozi rastlino", "Water transport in plants", [
  [1, "Voda vstopi v rastlino skozi?|korenine|liste|cvetove|plodove", "Water enters a plant through the?|roots|leaves|flowers|fruits"],
  [1, "Voda gre od korenin do listov po?|steblu|cvetu|plodu|semenu", "Water travels from roots to leaves through the?|stem|flower|fruit|seed"],
  [1, "Odprtine, skozi katere list izhlapeva vodo?|listne reže|koreninski laski|žile|prašniki", "Openings through which leaves lose water?|stomata|root hairs|veins|stamens"],
  [1, "Transpiracija je?|izhlapevanje vode|vsrkavanje vode|tvorba sladkorja|opraševanje", "Transpiration is?|loss of water vapour|taking up water|making sugar|pollination"],
  [1, "Rastlina oveni, ko ji primanjkuje?|vode|klorofila|cvetov|plodov", "A plant wilts when it lacks?|water|chlorophyll|flowers|fruits"],
  [1, "Bel nagelj v modro obarvani vodi čez dan?|pomodri|ostane bel|pordeči|pozeleni", "White carnation in blue water after a day?|turns blue|stays white|turns red|turns green"],
  [1, "Po steblu vodo prevajajo?|žile|listne reže|cvetni listi|semena", "Water moves up the stem in the?|vessels|stomata|petals|seeds"],
  [1, "Z vodo rastlina iz tal sprejme tudi?|rudninske snovi|sladkor|škrob|klorofil", "Along with water, roots take up?|minerals|sugar|starch|chlorophyll"],
  [1, "Korenina → steblo → ? → zrak|list|seme|prst|cvetni prah", "Root → stem → ? → air|leaf|seed|soil|pollen"],
  [1, "Skozi listne reže iz lista uhaja?|vodna para|sok|cvetni prah|škrob", "What escapes through the stomata?|water vapour|sap|pollen|starch"],
  [1, "Kateri del rastline vsrkava vodo?|korenina|list|cvet|plod", "Which part of a plant absorbs water?|root|leaf|flower|fruit"],
  [1, "Kam gre večina vode, ki jo vsrka rastlina?|izhlapi v zrak|ostane v koreninah|shrani se v semenih|shrani se v cvetovih", "Where does most water taken up by a plant go?|into the air|stays in roots|into seeds|into flowers"],
  [2, "Kateri del korenine vsrka največ vode?|koreninski laski|koreninska čepica|lubje|listne reže", "Which part of a root absorbs most water?|root hairs|root cap|bark|stomata"],
  [2, "Listno režo oblikujeta dve?|celici zapiralki|žili|vakuoli|koreninska laska", "A stoma is formed by two?|guard cells|veins|vacuoles|root hairs"],
  [2, "Ob suši se listne reže?|zaprejo|odprejo|povečajo|namnožijo", "In a drought, stomata?|close|open|get bigger|multiply"],
  [2, "Koreninski laski povečajo?|površino korenine|težo korenine|število listov|število cvetov", "Root hairs increase the root's?|surface area|weight|number of leaves|number of flowers"],
  [2, "Transpiracija je največja, ko je?|vroče in vetrovno|hladno in mirno|vlažno in mirno|oblačno", "Transpiration is fastest when it is?|hot and windy|cold and still|humid and still|cloudy"],
  [2, "Prozorna vrečka čez list na soncu se?|orosi|pobarva|raztopi|razpoči", "A clear bag over a leaf in the sun?|mists up|changes colour|dissolves|bursts"],
  [2, "Kaktus ima malo listnih rež, da?|izgubi manj vode|hitreje raste|lažje cveti|več diha", "A cactus has few stomata so that it?|loses less water|grows faster|flowers sooner|breathes more"],
  [2, "Listne reže so večinoma ponoči?|zaprte|odprte|razpokane|zaraščene", "At night most stomata are?|closed|open|cracked|overgrown"],
  [3, "Kaj vleče vodo po steblu navzgor?|izhlapevanje listov|teža vode|veter|cvetovi", "What mainly pulls water up the stem?|leaf evaporation|weight of water|wind|flowers"],
  [3, "Rez obarvanega stebla: obarvane so?|žile|vse celice enako|samo listne reže|samo skorja", "Cut stem from dyed water: what is coloured?|the vessels|all cells equally|only stomata|only the bark"],
  [3, "Manj vode izhlapi list, ki je?|majhen in voščen|velik in tanek|širok in mehek|velik in nežen", "Which leaf loses less water?|small and waxy|large and thin|broad and soft|large and delicate"],
  [3, "Rastlina, presajena brez koreninskih laskov?|oveni|hitreje raste|zacveti|ozeleni", "A plant moved without its root hairs?|wilts|grows faster|flowers|turns greener"],
  [3, "Odrezan list brez vode na soncu?|oveni|nabrekne|zraste|pozeleni", "A cut leaf left in the sun without water?|wilts|swells|grows|turns greener"],
  [3, "Kje rastlina izhlapi največ vode?|v listih|v koreninah|v semenih|v plodovih", "Where does a plant lose most water?|in its leaves|in its roots|in its seeds|in its fruits"],
  [3, "Koreninski laski vsrkavajo vodo iz?|prsti|zraka|stebla|listov", "Root hairs take up water from the?|soil|air|stem|leaves"],
  [3, "Kaj se zgodi, če liste namažemo z vazelinom?|izhlapi manj vode|izhlapi več vode|list hitreje raste|list pordeči", "Leaves coated in petroleum jelly?|lose less water|lose more water|grow faster|turn red"],
]);

defBank("n2_pclass", "nr_ziv", 6, "✿", "Razvrščanje rastlin", "Classifying plants", [
  [1, "Golosemenka je?|smreka~bor~jelka~macesen|lipa~hrast~jablana|tulipan~regrat~mak|praprot~preslica|šotni mah", "Which is a gymnosperm?|spruce~pine~fir~larch|lime tree~oak~apple tree|tulip~dandelion~poppy|fern~horsetail|peat moss"],
  [1, "Kritosemenka je?|lipa~hrast~tulipan~regrat~jablana|smreka~bor~jelka|praprot~preslica|šotni mah", "Which is an angiosperm?|lime tree~oak~tulip~dandelion~apple tree|spruce~pine~fir|fern~horsetail|peat moss"],
  [1, "Rastline s semeni so?|semenke|mahovi|praprotnice|alge", "Plants with seeds are?|seed plants|mosses|ferns|algae"],
  [1, "Kaj imajo le kritosemenke?|plodove|semena|liste|korenine", "What do only angiosperms have?|fruits|seeds|leaves|roots"],
  [1, "Česa praprot nima?|cvetov|korenin|listov|stebla", "What does a fern lack?|flowers|roots|leaves|a stem"],
  [1, "Česa mah nima?|pravih korenin|lističev|steblca|trosovnikov", "What does a moss lack?|true roots|tiny leaves|a stem|spore capsules"],
  [1, "Določevalni ključ služi za?|določanje vrst|merjenje rasti|štetje celic|risanje grafov", "An identification key is used for?|naming species|measuring growth|counting cells|drawing graphs"],
  [1, "Določevalni ključ ponudi na vsakem koraku?|dve možnosti|eno možnost|deset možnosti|vse vrste", "At each step an identification key offers?|two choices|one choice|ten choices|every species"],
  [1, "Najpreprostejše kopenske rastline so?|mahovi|kritosemenke|golosemenke|praprotnice", "The simplest land plants are?|mosses|angiosperms|gymnosperms|ferns"],
  [1, "Šotni mah je?|mah|praprotnica|golosemenka|kritosemenka", "Peat moss is a?|moss|fern|gymnosperm|angiosperm"],
  [1, "Kam sodi orlova praprot?|praprotnice|mahovi|golosemenke|kritosemenke", "Where does bracken belong?|ferns|mosses|gymnosperms|angiosperms"],
  [1, "Trobentica in zvonček sta?|kritosemenki|golosemenki|praprotnici|mahova", "Cowslip and snowdrop are?|angiosperms|gymnosperms|ferns|mosses"],
  [2, "Preslica je?|praprotnica|mah|golosemenka|kritosemenka", "A horsetail belongs with the?|ferns|mosses|gymnosperms|angiosperms"],
  [2, "Kje so semena bora?|na luskah storža|v plodu|v trosovnikih|v cvetnem listu", "Where are a pine's seeds?|on cone scales|inside a fruit|in spore cases|in a petal"],
  [2, "Trosovniki praproti so na?|spodnji strani lista|vrhu stebla|koreninah|cvetovih", "A fern's spore cases are on the?|underside of leaves|top of the stem|roots|flowers"],
  [2, "Semena brez plodu → skupina?|golosemenke|kritosemenke|praprotnice|mahovi", "Seeds not inside a fruit → group?|gymnosperms|angiosperms|ferns|mosses"],
  [2, "Korenine: da; semena: ne → skupina?|praprotnice|mahovi|golosemenke|kritosemenke", "Roots: yes; seeds: no → group?|ferns|mosses|gymnosperms|angiosperms"],
  [2, "Prave korenine: ne; semena: ne → skupina?|mahovi|praprotnice|golosemenke|kritosemenke", "True roots: no; seeds: no → group?|mosses|ferns|gymnosperms|angiosperms"],
  [2, "Semena v plodu → skupina?|kritosemenke|golosemenke|praprotnice|mahovi", "Seeds inside a fruit → group?|angiosperms|gymnosperms|ferns|mosses"],
  [2, "Mah pritrjujejo v podlago?|rizoidi|prave korenine|gomolji|čebulice", "Mosses are anchored by?|rhizoids|true roots|tubers|bulbs"],
  [3, "Mahovi in praproti za oploditev potrebujejo?|vodo|veter|žuželke|ptice", "Mosses and ferns need for fertilisation?|water|wind|insects|birds"],
  [3, "Kritosemenke delimo na enokaličnice in?|dvokaličnice|golosemenke|praprotnice|mahove", "Angiosperms split into monocots and?|dicots|gymnosperms|ferns|mosses"],
  [3, "Žita in trave so?|enokaličnice|dvokaličnice|golosemenke|praprotnice", "Cereals and grasses are?|monocots|dicots|gymnosperms|ferns"],
  [3, "Listi z vzporednimi žilami so značilni za?|enokaličnice|dvokaličnice|golosemenke|mahove", "Leaves with parallel veins are typical of?|monocots|dicots|gymnosperms|mosses"],
  [3, "Fižol in hrast sta?|dvokaličnici|enokaličnici|golosemenki|praprotnici", "Bean and oak are?|dicots|monocots|gymnosperms|ferns"],
  [3, "Tisa ima rdeč mesnat ovoj semena, a je?|golosemenka|kritosemenka|praprotnica|mah", "Yew has a red fleshy seed cup but is a?|gymnosperm|angiosperm|fern|moss"],
  [3, "Kateri skupini se razmnožujeta s trosi?|mahovi in praproti|semenke in mahovi|semenke in praproti|samo kritosemenke", "Which two groups reproduce by spores?|mosses and ferns|conifers and mosses|conifers and ferns|only angiosperms"],
  [3, "Ključ: ima iglice in storže → ?|golosemenka|kritosemenka|praprotnica|mah", "Key: has needles and cones → ?|gymnosperm|angiosperm|fern|moss"],
]);

defBank("n2_life", "nr_ziv", 6, "◎", "Raznolikost živih bitij", "Diversity of living things", [
  [1, "Kaj ni živo bitje?|kamen~kristal soli~oblak~ogenj|goba|mah|bakterija", "Which is not alive?|a stone~a salt crystal~a cloud~a fire|a mushroom|moss|a bacterium"],
  [1, "Značilnost vseh živih bitij?|rastejo~se razmnožujejo~dihajo|imajo liste|imajo kosti|imajo pljuča", "A feature of all living things?|they grow~they reproduce~they respire|they have leaves|they have bones|they have lungs"],
  [1, "Goba sodi med?|glive|rastline|živali|bakterije", "Mushrooms belong to the?|fungi|plants|animals|bacteria"],
  [1, "Plesen na kruhu je?|gliva|rastlina|žival|bakterija", "Mould on bread is a?|fungus|plant|animal|bacterium"],
  [1, "Ali imajo glive klorofil?|ne|da|le gobe|le plesni", "Do fungi have chlorophyll?|no|yes|only mushrooms|only moulds"],
  [1, "Drobna bitja, vidna le z mikroskopom?|mikroorganizmi|členonožci|mahovi|semenke", "Tiny living things seen only by microscope?|microorganisms|arthropods|mosses|seed plants"],
  [1, "Vloga gliv v gozdu?|razkrojevalci|proizvajalci|plenilci|opraševalci", "Role of fungi in a forest?|decomposers|producers|predators|pollinators"],
  [1, "Ameba je?|enoceličar|večceličar|gliva|rastlina", "An amoeba is?|single-celled|multicellular|a fungus|a plant"],
  [1, "Kateri organizem je večceličar?|goba|bakterija|ameba|kvasovka", "Which is multicellular?|a mushroom|a bacterium|an amoeba|a yeast"],
  [1, "Rastline se od živali razlikujejo, ker?|izdelajo hrano|dihajo|rastejo|se razmnožujejo", "Plants differ from animals because they?|make their own food|respire|grow|reproduce"],
  [1, "Kraljestvo, kamor sodi človek?|živali|rastline|glive|bakterije", "Kingdom that humans belong to?|animals|plants|fungi|bacteria"],
  [1, "Rastlina se obrača k svetlobi. To je?|odziv na dražljaj|razmnoževanje|prehranjevanje|izločanje", "A plant turns towards light. This is?|responsiveness|reproduction|feeding|excretion"],
  [2, "Del glive, ki ga imenujemo goba?|trosnjak|podgobje|korenina|list", "The part of a fungus we call a mushroom?|fruiting body|mycelium|root|leaf"],
  [2, "Nitke glive v tleh so?|podgobje|trosnjak|korenine|listi", "The threads of a fungus in soil are the?|mycelium|fruiting body|roots|leaves"],
  [2, "Glive se razmnožujejo predvsem?|s trosi|s semeni|z jajčeci|s plodovi", "Fungi mainly reproduce by?|spores|seeds|eggs|fruits"],
  [2, "Bakterije v jogurtu so?|koristne|strupene|vedno škodljive|zelo velike", "Bacteria in yoghurt are?|useful|poisonous|always harmful|visible to the eye"],
  [2, "Kje živijo bakterije?|skoraj povsod|le v vodi|le v zemlji|le v ljudeh", "Where do bacteria live?|almost everywhere|only in water|only in soil|only in people"],
  [2, "Kako se hranijo glive?|vsrkavajo hrano|s fotosintezo|lovijo plen|pijejo kri", "How do fungi feed?|absorb food|by photosynthesis|catch prey|drink blood"],
  [2, "Kaj za prehrano ne potrebuje svetlobe?|goba|mah|praprot|trava", "Which needs no light to get food?|a mushroom|moss|a fern|grass"],
  [2, "Rdeča mušnica je?|strupena|užitna|zdravilna|rastlina", "The fly agaric is?|poisonous|edible|medicinal|a plant"],
  [3, "Ogenj raste in se širi, a nima?|celic|toplote|svetlobe|gibanja", "Fire grows and spreads but has no?|cells|heat|light|movement"],
  [3, "Goba in drevo si izmenjujeta snovi. To je?|sožitje|zajedavstvo|plenilstvo|tekmovanje", "A fungus and a tree swap nutrients. This is?|symbiosis|parasitism|predation|competition"],
  [3, "Bakterije v črevesju človeka so?|večinoma koristne|vse škodljive|vse strupene|nežive", "Bacteria in the human gut are?|mostly helpful|all harmful|all poisonous|non-living"],
  [3, "Kateri organizem izdeluje hrano s fotosintezo?|alga|goba|kvasovka|plesen", "Which organism makes food by photosynthesis?|alga|mushroom|yeast|mould"],
  [3, "Kako se razmnožujejo bakterije?|z delitvijo|s semeni|z jajčeci|s cvetovi", "How do bacteria reproduce?|by splitting|by seeds|by eggs|by flowers"],
  [3, "Kaj imajo skupnega vsa živa bitja?|zgrajena so iz celic|imajo jedro|imajo klorofil|se gibljejo", "What do all living things share?|made of cells|have a nucleus|have chlorophyll|move about"],
  [3, "Glive so drugačne od rastlin, ker?|nimajo klorofila|nimajo celic|niso žive|imajo kosti", "Fungi differ from plants because they?|lack chlorophyll|lack cells|are not alive|have bones"],
  [3, "Kvasovke pri vzhajanju testa sproščajo?|ogljikov dioksid|kisik|dušik|vodik", "Rising dough: yeast gives off?|carbon dioxide|oxygen|nitrogen|hydrogen"],
]);

defBank("n2_padapt", "nr_ziv", 6, "⋔", "Rastline in okolje", "Plants and their environment", [
  [1, "Kaktus vodo shranjuje v?|steblu|cvetovih|trnih|semenih", "A cactus stores water in its?|stem|flowers|spines|seeds"],
  [1, "Kaktusovi listi so preobraženi v?|trne|korenine|cvetove|gomolje", "A cactus's leaves have become?|spines|roots|flowers|tubers"],
  [1, "Rastline živalim dajejo hrano in?|kisik|ogljikov dioksid|metan|dim", "Plants give animals food and?|oxygen|carbon dioxide|methane|smoke"],
  [1, "Zakaj bukev jeseni odvrže liste?|da izgubi manj vode|da lažje cveti|da hitreje raste|da privabi ptice", "Why does a beech drop its leaves in autumn?|to lose less water|to flower sooner|to grow faster|to attract birds"],
  [1, "Listi lokvanja?|plavajo na vodi|so pod zemljo|so trni|so iglice", "Water-lily leaves?|float on water|are underground|are spines|are needles"],
  [1, "Zakaj se bršljan vzpenja po drevesih?|do svetlobe|do vode|do vetra|do ptic", "Why does ivy climb trees?|to reach light|to find water|to catch wind|to meet birds"],
  [1, "Kaj nam dajejo rastline?|hrano~les~zdravila|železo|kamen|sol", "What do plants give us?|food~wood~medicines|iron|stone|salt"],
  [1, "Puščavske rastline imajo pogosto?|globoke korenine|velike tanke liste|plavajoče liste|veliko listnih rež", "Desert plants often have?|deep roots|large thin leaves|floating leaves|many stomata"],
  [1, "Seme regrata raznaša?|veter|voda|krt|polž", "Dandelion seeds are spread by?|wind|water|moles|snails"],
  [1, "Plodove češnje raznašajo?|ptice|veter|krti|polži", "Cherries are spread by?|birds|wind|moles|snails"],
  [1, "Senčni listi so večji, da?|ujamejo več svetlobe|izgubijo več vode|so težji|odženejo žuželke", "Shade leaves are larger to?|catch more light|lose more water|be heavier|repel insects"],
  [1, "Obramba koprive pred rastlinojedci?|žgalni laski|trni|lepljiva smola|debelo lubje", "A nettle's defence against grazers?|stinging hairs|thorns|sticky resin|thick bark"],
  [2, "Rastline s sočnimi listi, ki hranijo vodo?|sočnice|praproti|mahovi|plezalke", "Plants with fleshy water-storing leaves?|succulents|ferns|mosses|climbers"],
  [2, "Rosika lovi žuželke zaradi pomanjkanja?|rudninskih snovi|svetlobe|vode|toplote", "A sundew catches insects for lack of?|minerals|light|water|warmth"],
  [2, "Planinske rastline so nizke zaradi?|vetra in mraza|sence|vlage|preveč hrane", "Alpine plants grow low because of?|wind and cold|shade|damp|too much food"],
  [2, "Zakaj podrast cveti zgodaj spomladi?|več svetlobe|več toplote|manj vetra|manj žuželk", "Why do woodland flowers bloom in early spring?|more light|more warmth|less wind|fewer insects"],
  [2, "Kaj na pobočju preprečujejo korenine?|odnašanje prsti|dež|veter|sneg", "On slopes, roots prevent?|soil washing away|rain|wind|snow"],
  [2, "Mahovi v gozdu zadržujejo?|vodo|veter|svetlobo|sneg", "Mosses in a forest hold?|water|wind|light|snow"],
  [2, "Plodove s kaveljčki raznašajo?|živali s kožuhom|veter|voda|ptice pevke", "Hooked fruits are spread by?|furry animals|wind|water|songbirds"],
  [2, "Kaj je prilagoditev na sušo?|voščena povrhnjica|veliki tanki listi|plavajoči listi|plitve korenine", "Which is an adaptation to drought?|waxy cuticle|large thin leaves|floating leaves|shallow roots"],
  [3, "Vodne rastline imajo v steblih?|zračne prostore|trne|debelo lubje|les", "Water plants have in their stems?|air spaces|spines|thick bark|wood"],
  [3, "Zakaj so listi kaktusa trni? Da?|izgubi manj vode|hitreje raste|lovi žuželke|dela več sladkorja", "Why are cactus leaves spines? To?|lose less water|grow faster|catch insects|make more sugar"],
  [3, "Rastline v ekosistemu proizvajajo?|kisik in hrano|ogljikov dioksid|dušik|metan", "Plants in an ecosystem produce?|oxygen and food|carbon dioxide|nitrogen|methane"],
  [3, "Mesojede rastline rastejo na tleh, ki so?|revna z dušikom|zelo rodovitna|suha in peščena|slana", "Carnivorous plants grow in soil that is?|poor in nitrogen|very fertile|dry and sandy|salty"],
  [3, "Iglavci imajo ozke voščene iglice za?|varčevanje z vodo|lovljenje žuželk|plavanje|privabljanje ptic", "Conifers' narrow waxy needles help?|save water|catch insects|float|attract birds"],
  [3, "Zakaj ima planika gost bel puh?|proti soncu in mrazu|privabljanje ptic|plavanje|lovljenje žuželk", "Why is edelweiss covered in white fuzz?|against sun and cold|attracts birds|helps it float|catches insects"],
  [3, "Gozd v mestu poleti zrak?|ohlaja|segreva|suši|onesnažuje", "A city forest in summer makes the air?|cooler|hotter|drier|dirtier"],
  [3, "Razširjanje semen daleč od matične rastline?|manj tekmovanja|več sence|manj svetlobe|več bolezni", "Spreading seeds far from the parent means?|less competition|more shade|less light|more disease"],
]);

// =====================================================================
// 7. RAZRED
// =====================================================================
defBank("n2_particles", "nr_snov", 7, "∘∘", "Delci in difuzija", "Particles and diffusion", [
  [1, "Iz česa so vse snovi?|iz drobnih delcev|iz vode|iz zraka|iz svetlobe", "What is all matter made of?|tiny particles|water|air|light"],
  [1, "Ali posamezne delce vidimo s prostim očesom?|ne|da|le v vodi|le v kamnu", "Can we see single particles with the naked eye?|no|yes|only in water|only in rock"],
  [1, "Vonj parfuma se razširi po sobi zaradi?|gibanja delcev|svetlobe|zvoka|teže zraka", "Perfume spreads through a room because of?|moving particles|light|sound|the weight of air"],
  [1, "Delci v trdni snovi?|nihajo na mestu|prosto letijo|popolnoma mirujejo|se ne dotikajo", "Particles in a solid?|vibrate in place|fly freely|are totally still|never touch"],
  [1, "Kje so delci blizu, a se prosto premikajo?|v tekočini|v trdni snovi|v plinu|v kristalu", "Where are particles close but free to move?|in a liquid|in a solid|in a gas|in a crystal"],
  [1, "Kje so delci najbolj narazen?|v plinu|v tekočini|v trdni snovi|v ledu", "Where are particles farthest apart?|in a gas|in a liquid|in a solid|in ice"],
  [1, "Kapljica črnila se v vodi razširi zaradi?|difuzije|filtracije|izhlapevanja|taljenja", "An ink drop spreads in water by?|diffusion|filtration|evaporation|melting"],
  [1, "S segrevanjem se delci gibljejo?|hitreje|počasneje|enako|sploh ne", "When heated, particles move?|faster|slower|the same|not at all"],
  [1, "Ko snov ohlajamo, se delci?|upočasnijo|pospešijo|povečajo|izginejo", "When a substance cools, its particles?|slow down|speed up|get bigger|disappear"],
  [1, "Vonj iz kuhinje zaznamo v sobi, ker se delci?|gibljejo|ne gibljejo|povečajo|stalijo", "We smell cooking in another room because particles?|move|stay still|grow|melt"],
  [1, "Kroglice v modelu snovi predstavljajo?|delce|celice|kapljice|zrnca peska", "Balls in a particle model stand for?|particles|cells|droplets|sand grains"],
  [1, "Delci v plinu se gibljejo?|hitro in naključno|le navzgor|le navzdol|sploh ne", "Particles in a gas move?|fast and randomly|only upwards|only downwards|not at all"],
  [2, "Ko se snov segreje in razširi, se delci?|razmaknejo|povečajo|razdelijo|stalijo", "When a substance warms and expands, particles?|move apart|get bigger|split up|melt"],
  [2, "Kaj je med delci plina?|prazen prostor|zrak|voda|prah", "What is between gas particles?|empty space|air|water|dust"],
  [2, "Difuzija je najhitrejša v?|plinih|tekočinah|trdnih snoveh|ledu", "Diffusion is fastest in?|gases|liquids|solids|ice"],
  [2, "Vonj se v toplem prostoru širi?|hitreje|počasneje|enako|sploh ne", "A smell spreads in a warm room?|faster|slower|the same|not at all"],
  [2, "Sladkor se raztopi. Kaj je z njegovimi delci?|pomešajo se z vodo|izginejo|zgorijo|odletijo", "Sugar dissolves. What happens to its particles?|they mix with water|they vanish|they burn|they fly off"],
  [2, "Difuzija poteka tja, kjer je delcev?|manj|več|enako|nič", "Diffusion goes towards where particles are?|fewer|more|equal|absent"],
  [2, "Delci snovi so v stalnem?|gibanju|mirovanju|gorenju|raztapljanju", "Particles of matter are always?|moving|at rest|burning|dissolving"],
  [2, "Ali se delci pri taljenju ledu spremenijo?|ne, le razporeditev|da, postanejo voda|da, se povečajo|da, izginejo", "Do particles change when ice melts?|no, only arrangement|yes, they turn soft|yes, they grow|yes, they vanish"],
  [3, "Difuzija v trdnih snoveh poteka?|zelo počasi|najhitreje|hitreje kot v plinu|enako kot v plinu", "Diffusion in solids happens?|very slowly|fastest|faster than in gas|same as in gas"],
  [3, "Voda + alkohol: skupaj manj kot vsota. Zakaj?|delci zapolnijo reže|alkohol izgine|voda zmrzne|delci se skrčijo", "Water + alcohol: less than the sum. Why?|particles fill gaps|alcohol vanishes|water freezes|particles shrink"],
  [3, "Zakaj se balon s helijem čez dni izprazni?|delci uidejo skozi|helij se stali|helij zmrzne|balon zraste", "Why does a helium balloon go flat in days?|particles escape|helium melts|helium freezes|the balloon grows"],
  [3, "Pri taljenju se delci?|gibljejo bolj prosto|ustavijo|povečajo|razpolovijo", "When a solid melts, particles?|move more freely|stop moving|get bigger|split in half"],
  [3, "Pri izhlapevanju delci?|uidejo iz tekočine|se ustavijo|se povečajo|se zlepijo", "During evaporation particles?|escape the liquid|stop|grow|stick together"],
  [3, "Zakaj se tekočina ne da skoraj nič stisniti?|delci so blizu|delci so daleč|delci mirujejo|delcev ni", "Why can't a liquid be squeezed much?|particles are close|particles far apart|particles are still|there are none"],
  [3, "Čaj se v vroči vodi obarva hitreje, ker so delci?|hitrejši|večji|težji|manjši", "Tea colours hot water faster because particles are?|faster|bigger|heavier|smaller"],
  [3, "Model z delci je?|poenostavljen prikaz|fotografija atomov|natančna slika|risba celic", "A particle model is?|a simplified picture|a photo of atoms|an exact image|a drawing of cells"],
]);

defBank("n2_feed", "nr_ziv", 7, "⊃", "Prehranjevanje živali", "How animals feed", [
  [1, "Kako se hrani usati kit?|preceja vodo|grize plen|sesa kri|žveči trave", "How does a baleen whale feed?|filters water|bites prey|sucks blood|chews grass"],
  [1, "Kako se hrani samica komarja?|sesa kri|preceja vodo|grize liste|zbira seme", "How does a female mosquito feed?|sucks blood|filters water|chews leaves|gathers seeds"],
  [1, "Kako se hrani odrasel metulj?|srka nektar|grize liste|preceja vodo|lovi muhe", "How does an adult butterfly feed?|sips nectar|chews leaves|filters water|catches flies"],
  [1, "Kateri je plenilec?|ris~sova~ščuka|srna|zajec|krava", "Which is a predator?|lynx~owl~pike|roe deer|rabbit|cow"],
  [1, "Rastlinojedci imajo za mletje hrane?|široke kočnike|ostre podočnike|kremplje|kljun", "Herbivores grind food with?|broad molars|sharp canines|claws|a beak"],
  [1, "Usta → požiralnik → ?|želodec|tanko črevo|debelo črevo|jetra", "Mouth → oesophagus → ?|stomach|small intestine|large intestine|liver"],
  [1, "Kdo se hrani s krvjo gostitelja?|klop|deževnik|polž|čebela", "Which feeds on a host's blood?|tick|earthworm|snail|bee"],
  [1, "Prebava je?|razgradnja hrane|vdihovanje zraka|izločanje seča|kroženje krvi", "Digestion is?|breaking down food|breathing in|getting rid of urine|blood flow"],
  [1, "Človek je glede prehrane?|vsejed|rastlinojedec|mesojedec|precejevalec", "In terms of diet, humans are?|omnivores|herbivores|carnivores|filter feeders"],
  [1, "Deževnik se prehranjuje?|z ostanki rastlin|z živimi žuželkami|s krvjo|z nektarjem", "Earthworms feed on?|dead plant matter|live insects|blood|nectar"],
  [1, "Ostanke hrane telo izloči skozi?|zadnjično odprtino|usta|nos|kožo", "Undigested food leaves through the?|anus|mouth|nose|skin"],
  [1, "Gosenica se hrani tako, da?|grize liste|srka nektar|sesa kri|preceja vodo", "A caterpillar feeds by?|chewing leaves|sipping nectar|sucking blood|filtering water"],
  [2, "Prežvekovalec je?|krava~ovca~koza~srna|konj|zajec|prašič", "Which is a ruminant?|cow~sheep~goat~deer|horse|rabbit|pig"],
  [2, "Koliko delov ima želodec krave?|4|1|2|3", "How many chambers has a cow's stomach?|4|1|2|3"],
  [2, "Oči plenilcev so večinoma usmerjene?|naprej|vstran|nazaj|navzgor", "Predators' eyes mostly face?|forwards|sideways|backwards|upwards"],
  [2, "V želodcu hrano prebavlja?|želodčni sok|žolč|slina|seč", "In the stomach food is digested by?|gastric juice|bile|saliva|urine"],
  [2, "Slino izločajo?|slinavke|jetra|ledvice|pljuča", "Saliva comes from the?|salivary glands|liver|kidneys|lungs"],
  [2, "Školjka se hrani tako, da?|preceja vodo|lovi ribe|grize alge|sesa kri", "A mussel feeds by?|filtering water|catching fish|biting algae|sucking blood"],
  [2, "Volk ima za trganje mesa?|ostre podočnike|široke kočnike|kljun|rilček", "A wolf tears meat with?|sharp canines|broad molars|a beak|a proboscis"],
  [2, "Ptič, ki lovi ribe, ima kljun?|dolg in oster|kratek in debel|zakrivljen navzgor|ploščat in mehak", "A fish-catching bird has a beak that is?|long and sharp|short and thick|curved upwards|flat and soft"],
  [3, "Ptiči nimajo zob; hrano zmeljejo v?|mišičnem želodcu|kljunu|golši|požiralniku", "Birds have no teeth; food is ground in the?|gizzard|beak|crop|oesophagus"],
  [3, "Zakaj ima zajec oči ob straneh glave?|da vidi naokrog|da bolje voha|da bolje sliši|da laže je", "Why are a rabbit's eyes on the sides?|to see all around|to smell better|to hear better|to eat easily"],
  [3, "V debelem črevesu se vsrka predvsem?|voda|beljakovine|škrob|maščobe", "The large intestine mainly absorbs?|water|proteins|starch|fats"],
  [3, "Rastlinojedci imajo daljše črevo, ker so rastline?|težko prebavljive|lahko prebavljive|strupene|slane", "Herbivores have longer guts because plants are?|hard to digest|easy to digest|poisonous|salty"],
  [3, "Krava prežvekuje, da?|hrano bolje zmelje|hitreje pije|bolje vidi|ohladi telo", "A cow chews the cud to?|grind food better|drink faster|see better|cool down"],
  [3, "Kaj pri kravi razgrajuje celulozo?|mikroorganizmi|slina|žolč|zobje", "What breaks down cellulose in a cow?|microorganisms|saliva|bile|teeth"],
  [3, "Kače plen?|pogoltnejo celega|zmeljejo s kočniki|precedijo|izsesajo", "Snakes eat their prey by?|swallowing it whole|grinding it|filtering it|sucking it"],
  [3, "Kje se hranila vsrkajo v kri?|tanko črevo|želodec|požiralnik|usta", "Where are nutrients absorbed into blood?|small intestine|stomach|oesophagus|mouth"],
]);

defBank("n2_breath", "nr_ziv", 7, "O₂", "Dihanje in kri živali", "Breathing and blood in animals", [
  [1, "Ribe dihajo kisik, raztopljen v?|vodi|zraku|hrani|pesku", "Fish breathe oxygen dissolved in?|water|air|food|sand"],
  [1, "Kdo diha s pljuči?|delfin~kuščar~sinica|krap|rak|školjka", "Which breathes with lungs?|dolphin~lizard~tit|carp|crab|mussel"],
  [1, "Kdo diha s škrgami?|postrv~ščuka~krap|delfin|želva|kit", "Which breathes with gills?|trout~pike~carp|dolphin|turtle|whale"],
  [1, "Kateri plin telo potrebuje iz zraka?|kisik|ogljikov dioksid|helij|vodik", "Which gas does the body need from air?|oxygen|carbon dioxide|helium|hydrogen"],
  [1, "Kri prenaša po telesu?|kisik in hranila|samo vodo|samo toploto|le odpadke", "Blood carries around the body?|oxygen and nutrients|only water|only heat|only waste"],
  [1, "Deževnik diha skozi?|kožo|škrge|pljuča|usta", "An earthworm breathes through its?|skin|gills|lungs|mouth"],
  [1, "Kit mora po zrak?|na površje|na dno|v jamo|na kopno", "To breathe, a whale must go?|to the surface|to the bottom|into a cave|onto land"],
  [1, "Srce poganja kri po?|žilah|živcih|kosteh|mišicah", "The heart pumps blood through?|blood vessels|nerves|bones|muscles"],
  [1, "Utrip srca otipamo na?|zapestju|nohtu|laseh|zobeh", "You can feel your pulse at your?|wrist|fingernail|hair|teeth"],
  [1, "Pri teku srce bije?|hitreje|počasneje|enako|nepravilno", "When you run, your heart beats?|faster|slower|the same|irregularly"],
  [1, "Kisik v zraku nastaja predvsem pri?|fotosintezi|dihanju|gorenju|gnitju", "Oxygen in air comes mainly from?|photosynthesis|respiration|burning|rotting"],
  [1, "S čim dihajo sesalci?|s pljuči|s škrgami|s kožo|s trahejami", "What do mammals breathe with?|lungs|gills|skin|tracheae"],
  [2, "Odrasla žaba diha s pljuči in skozi?|kožo|škrge|plavuti|traheje", "An adult frog breathes with lungs and through its?|skin|gills|fins|tracheae"],
  [2, "Kri, bogata s kisikom, je?|svetlo rdeča|temno rdeča|modra|zelena", "Blood rich in oxygen is?|bright red|dark red|blue|green"],
  [2, "Škrge so rdeče, ker so polne?|krvi|vode|sluzi|kisika", "Gills are red because they are full of?|blood|water|mucus|oxygen"],
  [2, "Pri teku dihamo hitreje, ker mišice rabijo več?|kisika|ogljikovega dioksida|vode|dušika", "We breathe faster when running because muscles need more?|oxygen|carbon dioxide|water|nitrogen"],
  [2, "V pljučih kri sprejme?|kisik|ogljikov dioksid|hranila|dušik", "In the lungs blood picks up?|oxygen|carbon dioxide|nutrients|nitrogen"],
  [2, "V tkivih kri odda?|kisik|ogljikov dioksid|dušik|vodik", "In body tissues blood gives up?|oxygen|carbon dioxide|nitrogen|hydrogen"],
  [2, "Kri sestavljata krvna plazma in?|krvne celice|škrge|kosti|živci", "Blood is plasma plus?|blood cells|gills|bones|nerves"],
  [2, "Izmenjava plinov v pljučih poteka v?|pljučnih mešičkih|sapniku|grlu|nosu", "Gas exchange in lungs takes place in the?|alveoli|windpipe|larynx|nose"],
  [3, "Pri žuželkah kisik do celic pride po?|trahejah|krvi|črevesu|živcih", "In insects oxygen reaches cells through?|tracheae|blood|the gut|nerves"],
  [3, "Zakaj riba na kopnem ne more dihati?|škrge se zlepijo|zrak nima kisika|pljuča se napihnejo|kri zmrzne", "Why can't a fish breathe on land?|gills collapse|air lacks oxygen|its lungs swell|its blood freezes"],
  [3, "Ptiči imajo poleg pljuč še?|zračne vreče|škrge|traheje|plavalni mehur", "Besides lungs, birds have?|air sacs|gills|tracheae|a swim bladder"],
  [3, "Paglavec diha s škrgami, odrasla žaba?|s pljuči in kožo|le s škrgami|s trahejami|le s kožo", "Tadpoles use gills, adult frogs use?|lungs and skin|only gills|tracheae|only skin"],
  [3, "Kje so v telesu najtanjše žile?|med celicami tkiv|v srcu|v kosteh|v laseh", "Where are the thinnest blood vessels?|among tissue cells|in the heart|in bones|in hair"],
  [3, "Žival z velikimi škrgami živi verjetno v vodi?|z malo kisika|z veliko kisika|brez kisika|slani", "An animal with large gills likely lives in water with?|little oxygen|lots of oxygen|no oxygen|salt only"],
  [3, "Zakaj je hladna voda boljša za ribe?|vsebuje več kisika|je bolj slana|je bolj čista|je bolj gosta", "Why is cold water better for fish?|holds more oxygen|is saltier|is cleaner|is denser"],
  [3, "Snovi med krvjo in celicami prehajajo skozi?|stene kapilar|stene arterij|srčne zaklopke|kosti", "Substances pass between blood and cells through?|capillary walls|artery walls|heart valves|bones"],
]);

defBank("n2_move", "nr_ziv", 7, "⟿", "Opora in gibanje živali", "Support and movement", [
  [1, "Notranje ogrodje imajo?|vretenčarji|žuželke|polži|deževniki", "Which animals have an internal skeleton?|vertebrates|insects|snails|earthworms"],
  [1, "Katera žival ima zunanje ogrodje?|hrošč~rak~pajek|riba|žaba|mačka", "Which animal has an external skeleton?|beetle~crab~spider|fish|frog|cat"],
  [1, "Hrbtenica je zgrajena iz?|vretenc|reber|lobanje|sklepov", "The spine is made of?|vertebrae|ribs|the skull|joints"],
  [1, "Kosti ptic so?|votle in lahke|polne in težke|mehke|iz hitina", "Bird bones are?|hollow and light|solid and heavy|soft|made of chitin"],
  [1, "Gibljiv stik dveh kosti je?|sklep|kita|vretence|lobanja", "A movable meeting of two bones is a?|joint|tendon|vertebra|skull"],
  [1, "Koža med prsti race je?|plavalna kožica|krilo|luska|plavut", "The skin between a duck's toes is?|webbing|a wing|a scale|a fin"],
  [1, "Krt ima sprednje noge prilagojene za?|kopanje|plavanje|letenje|plezanje", "A mole's front feet are adapted for?|digging|swimming|flying|climbing"],
  [1, "Kako se premika kenguru?|skače|plazi se|leti|vijuga", "How does a kangaroo move?|hops|crawls|flies|slithers"],
  [1, "Kako se premika kača?|vijuga s telesom|skače|leti|hodi po nogah", "How does a snake move?|wriggles its body|hops|flies|walks on legs"],
  [1, "Kaj ščiti možgane?|lobanja|rebra|hrbtenica|medenica", "What protects the brain?|skull|ribs|spine|pelvis"],
  [1, "Kaj ščiti srce in pljuča?|rebra|lobanja|medenica|lopatica", "What protects the heart and lungs?|ribs|skull|pelvis|shoulder blade"],
  [1, "Mišice se pri gibanju?|krčijo in sproščajo|lomijo|tanjšajo|raztapljajo", "During movement, muscles?|contract and relax|break|get thinner|dissolve"],
  [2, "Ribo naprej poganja predvsem?|repna plavut|prsna plavut|škrge|luske", "What mainly drives a fish forward?|tail fin|pectoral fin|gills|scales"],
  [2, "Krila ptic so preobražene?|sprednje okončine|zadnje okončine|rebra|luske", "Bird wings are modified?|front limbs|hind limbs|ribs|scales"],
  [2, "Kako se premika polž?|z mišičnim stopalom|s šestimi nogami|s plavutmi|s krili", "How does a snail move?|on a muscular foot|on six legs|with fins|with wings"],
  [2, "Oblika ribjega telesa za manjši upor vode?|vretenasta|kockasta|kroglasta|zvezdasta", "Fish body shape that cuts water drag?|streamlined|cube-shaped|round|star-shaped"],
  [2, "Krilo netopirja je?|kožna opna|iz peres|iz hitina|iz lusk", "A bat's wing is?|a skin membrane|made of feathers|made of chitin|made of scales"],
  [2, "Upogibalka in iztegovalka sta?|nasprotni mišici|ista mišica|kiti|kosti", "Flexor and extensor are?|opposing muscles|the same muscle|tendons|bones"],
  [2, "Žival z zunanjim ogrodjem pri rasti?|se levi|ne raste več|ogrodje raztegne|ogrodje stali", "An animal with an exoskeleton, to grow?|moults|stops growing|stretches it|melts it"],
  [2, "S čim so mišice povezane s kostmi?|s kitami|z živci|z žilami|s sklepi", "Muscles are joined to bones by?|tendons|nerves|blood vessels|joints"],
  [3, "Mišica lahko kost le?|vleče|potiska|vrti sama|lomi", "A muscle can only do this to a bone?|pull|push|spin|break"],
  [3, "Pri upogibu roke v komolcu se skrči?|dvoglava mišica|troglava mišica|stegenska mišica|srčna mišica", "Bending the elbow contracts the?|biceps|triceps|thigh muscle|heart muscle"],
  [3, "Deževnik nima kosti; oporo mu daje?|tekočina v telesu|zunanji oklep|hrbtenica|lupina", "An earthworm has no bones; it is supported by?|fluid in its body|an outer shell|a spine|a hard case"],
  [3, "Ribe se dvigajo in spuščajo s pomočjo?|plavalnega mehurja|škrg|lusk|bočne linije", "Fish rise and sink using their?|swim bladder|gills|scales|lateral line"],
  [3, "Zakaj so kosti ptic votle?|lažji let|hitrejša rast|več krvi|boljši sluh", "Why are bird bones hollow?|easier flight|faster growth|more blood|better hearing"],
  [3, "Koliko nog ima žuželka?|6|8|4|10", "How many legs does an insect have?|6|8|4|10"],
  [3, "Gibljivo povezan zunanji oklep imajo?|členonožci|mehkužci|vretenčarji|kolobarniki", "A jointed outer skeleton is found in?|arthropods|molluscs|vertebrates|annelids"],
  [3, "Rak ima trd oklep, ker vsebuje?|apnenec in hitin|les|kost|keratin", "A crab's shell is hard because it contains?|lime and chitin|wood|bone|keratin"],
]);

defBank("n2_sense", "nr_ziv", 7, "◉", "Čutila in odzivi", "Senses and responses", [
  [1, "Dražljaj za oko je?|svetloba|zvok|vonj|toplota", "The stimulus for the eye is?|light|sound|smell|heat"],
  [1, "Dražljaj za uho je?|zvok|svetloba|vonj|okus", "The stimulus for the ear is?|sound|light|smell|taste"],
  [1, "Kateri organ zaznava vonj?|nos|uho|oko|koža", "Which organ senses smell?|nose|ear|eye|skin"],
  [1, "Koža zaznava?|dotik~toploto~bolečino~mraz|svetlobo|barve|vonj", "The skin senses?|touch~heat~pain~cold|light|colours|smell"],
  [1, "Kaj prenaša sporočila od čutil do možganov?|živci|žile|kite|mišice", "What carries messages from senses to the brain?|nerves|blood vessels|tendons|muscles"],
  [1, "Lovski pes ima posebej dober?|voh|vid|okus|tip", "A hunting dog has a very good sense of?|smell|sight|taste|touch"],
  [1, "Orel ima izjemno dober?|vid|voh|okus|tip", "An eagle has excellent?|eyesight|smell|taste|touch"],
  [1, "Živčevje sestavljajo možgani, hrbtenjača in?|živci|žile|mišice|kosti", "The nervous system is brain, spinal cord and?|nerves|blood vessels|muscles|bones"],
  [1, "Brbončice so na?|jeziku|nosu|zobeh|ušesih", "Taste buds are on the?|tongue|nose|teeth|ears"],
  [1, "Čutila sprejemajo?|dražljaje|hrano|kisik|kri", "Sense organs receive?|stimuli|food|oxygen|blood"],
  [1, "Kaj obdeluje informacije iz čutil?|možgani|srce|pljuča|želodec", "What processes information from the senses?|brain|heart|lungs|stomach"],
  [1, "Uhelj zbira?|zvok|svetlobo|vonj|toploto", "The outer ear collects?|sound|light|smell|heat"],
  [2, "Kača voha s pomočjo?|jezika|ušes|oči|repa", "A snake smells using its?|tongue|ears|eyes|tail"],
  [2, "Tipalnice polža nosijo?|oči|ušesa|zobe|škrge", "A snail's tentacles carry its?|eyes|ears|teeth|gills"],
  [2, "Sestavljene oči imajo?|žuželke|sesalci|ribe|ptiči", "Compound eyes are found in?|insects|mammals|fish|birds"],
  [2, "Kaj izvede odziv, npr. umik roke?|mišice|čutila|kosti|ušesa", "What carries out a response, e.g. pulling a hand away?|muscles|sense organs|bones|ears"],
  [2, "Roko hitro umaknemo z vroče plošče. To je?|refleks|učenje|navada|odločitev", "We pull a hand off a hot plate. This is?|a reflex|learning|a habit|a decision"],
  [2, "Zenica se na močni svetlobi?|zoži|razširi|ne spremeni|zapre", "In bright light the pupil?|gets smaller|gets bigger|stays the same|closes"],
  [2, "Mačji brki so čutila za?|tip|okus|vonj|sluh", "A cat's whiskers sense?|touch|taste|smell|sound"],
  [2, "Žival, ki slabo vidi, a odlično tipa in voha?|krt|orel|mačka|sova", "Which animal sees poorly but feels and smells well?|mole|eagle|cat|owl"],
  [3, "Bočna linija rib zaznava?|gibanje vode|svetlobo|okus|barve", "A fish's lateral line senses?|water movement|light|taste|colours"],
  [3, "Dražljaj → čutilo → živec → ? → mišica|možgani|kost|kri|uho", "Stimulus → sense → nerve → ? → muscle|brain|bone|blood|ear"],
  [3, "Ko dolgo vonjamo isti vonj, ga?|nehamo zaznavati|zaznamo močneje|začnemo videti|okušamo", "After smelling the same smell for long, we?|stop noticing it|smell it stronger|start seeing it|taste it"],
  [3, "Svetloba, ki jo vidijo čebele, mi pa ne?|ultravijolična|rdeča|zelena|rumena", "Light bees can see but we cannot?|ultraviolet|red|green|yellow"],
  [3, "Kaj je dražljaj?|sprememba v okolju|odziv mišice|živec|čutilo", "What is a stimulus?|a change around us|a muscle response|a nerve|a sense organ"],
  [3, "Bobnič ob zvoku?|zaniha|se zapre|zasveti|se segreje", "When sound arrives, the eardrum?|vibrates|closes|glows|heats up"],
  [3, "Sova ponoči plen najde predvsem?|s sluhom|z vohom|z okusom|s tipom", "At night an owl finds prey mainly by?|hearing|smell|taste|touch"],
  [3, "Čutnice za svetlobo so v očesu na?|mrežnici|leči|roženici|zenici", "Light-sensitive cells in the eye are in the?|retina|lens|cornea|pupil"],
]);

defBank("n2_repro", "nr_ziv", 7, "↻", "Razmnoževanje in razvoj", "Reproduction and development", [
  [1, "S čim se pri oploditvi združi jajčna celica?|s semenčico|z ličinko|z bubo|z zigoto", "At fertilisation an egg cell joins a?|sperm cell|larva|pupa|zygote"],
  [1, "Gosenica je?|ličinka metulja|odrasel metulj|buba|jajčece", "A caterpillar is a?|butterfly larva|adult butterfly|pupa|egg"],
  [1, "Jajčece → ličinka → ? → odrasel metulj|buba|paglavec|zarodek|mladič", "Egg → larva → ? → adult butterfly|pupa|tadpole|embryo|cub"],
  [1, "Paglavec je ličinka?|žabe|ribe|metulja|kače", "A tadpole is the larva of a?|frog|fish|butterfly|snake"],
  [1, "Brez preobrazbe se razvija?|mačka~kokoš~kuščar|metulj|žaba|komar", "Which develops without metamorphosis?|cat~chicken~lizard|butterfly|frog|mosquito"],
  [1, "Kdo odloži jajčeca v vodo?|žaba~krap|kokoš|kuščar|želva", "Which lays its eggs in water?|frog~carp|hen|lizard|tortoise"],
  [1, "Iz bube se izleže?|odrasla žuželka|gosenica|jajčece|paglavec", "What comes out of a pupa?|adult insect|caterpillar|egg|tadpole"],
  [1, "Potomec spolnega razmnoževanja dobi lastnosti?|obeh staršev|le matere|le očeta|nobenega", "A sexually produced young gets features from?|both parents|mother only|father only|neither"],
  [1, "Jajčeca → ? → žabica|paglavec|buba|gosenica|ogrc", "Eggs → ? → froglet|tadpole|pupa|caterpillar|grub"],
  [1, "Kdo znese jajca z lupino?|ptiči~plazilci|ribe|dvoživke|meduze", "Which lay eggs with shells?|birds~reptiles|fish|amphibians|jellyfish"],
  [1, "Mladiči kenguruja dorastejo v?|vrečki|jajcu|gnezdu|vodi", "A baby kangaroo grows up in a?|pouch|egg|nest|pond"],
  [1, "Ličinke komarja živijo v?|vodi|zemlji|lesu|zraku", "Mosquito larvae live in?|water|soil|wood|the air"],
  [2, "Nepopolno preobrazbo (brez bube) ima?|kobilica|metulj|muha|hrošč", "Incomplete metamorphosis (no pupa) is seen in a?|grasshopper|butterfly|fly|beetle"],
  [2, "Zunanja oploditev v vodi je pri?|žabah|ptičih|sesalcih|plazilcih", "External fertilisation in water occurs in?|frogs|birds|mammals|reptiles"],
  [2, "Notranja oploditev je pri?|ptičih~sesalcih~plazilcih|žabah|krapih|postrvih", "Internal fertilisation occurs in?|birds~mammals~reptiles|frogs|carp|trout"],
  [2, "Potomci nespolnega razmnoževanja so staršu?|genetsko enaki|zelo različni|polovično enaki|naključni", "Offspring from asexual reproduction are?|identical to parent|very different|half the same|random"],
  [2, "Nespolno razmnoževanje hidre je?|brstenje|oploditev|parjenje|opraševanje", "Hydra reproduces asexually by?|budding|fertilisation|mating|pollination"],
  [2, "Glavna zaloga hrane v ptičjem jajcu?|rumenjak|lupina|zračni mehurček|lupinska kožica", "Main food store in a bird's egg?|yolk|shell|air sac|shell membrane"],
  [2, "Nepopolna preobrazba: jajčece → ? → odrasla|ličinka|buba|paglavec|gosenica", "Incomplete metamorphosis: egg → ? → adult|nymph|pupa|tadpole|caterpillar"],
  [2, "Pri preobrazbi paglavca rep?|izgine|zraste|postane noga|postane škrga", "During metamorphosis a tadpole's tail?|disappears|grows|becomes a leg|becomes a gill"],
  [3, "Pišče kmalu po izvalitvi hodi. Je?|begavec|gnezdomec|ličinka|buba", "A chick walks soon after hatching. It is?|precocial|altricial|a larva|a pupa"],
  [3, "Kos se izvali gol in slep. Je?|gnezdomec|begavec|ličinka|paglavec", "A blackbird hatches naked and blind. It is?|altricial|precocial|a larva|a tadpole"],
  [3, "Hrošč ima preobrazbo?|popolno|nepopolno|nobene|obratno", "A beetle's metamorphosis is?|complete|incomplete|absent|reversed"],
  [3, "Katere stopnje kobilica nima?|bube|jajčeca|ličinke|odrasle živali", "Which stage does a grasshopper lack?|pupa|egg|larva|adult"],
  [3, "Zakaj žabe izležejo zelo veliko jajčec?|veliko jih pogine|ker so majhne|ker je voda topla|ker skrbijo zanje", "Why do frogs lay so many eggs?|most die|they're small|the water is warm|they guard them"],
  [3, "Gosenica in metulj se hranita?|različno|enako|nič|z ličinkami", "Caterpillar and butterfly feed?|differently|the same way|not at all|on larvae"],
  [3, "Zarodek sesalca dobiva hrano prek?|posteljice|rumenjaka|lupine|škrg", "A mammal embryo gets food through the?|placenta|yolk|shell|gills"],
  [3, "Prednost spolnega razmnoževanja?|raznoliki potomci|en sam starš|enaki potomci|ni oploditve", "An advantage of sexual reproduction?|varied offspring|one parent only|identical offspring|no fertilisation"],
]);

defBank("n2_cycle", "nr_ziv", 7, "C↻", "Kroženje snovi in energija", "Cycles of matter and energy", [
  [1, "Rastline ogljik dobijo iz?|zraka|tal|vode|kamnin", "Plants get their carbon from the?|air|soil|water|rocks"],
  [1, "Živali pri dihanju v zrak vračajo?|ogljikov dioksid|kisik|dušik|vodik", "When animals breathe out they return?|carbon dioxide|oxygen|nitrogen|hydrogen"],
  [1, "Pri gorenju lesa se v zrak sprošča?|ogljikov dioksid|kisik|vodik|helij", "Burning wood releases into the air?|carbon dioxide|oxygen|hydrogen|helium"],
  [1, "Kateri proces jemlje CO₂ iz zraka?|fotosinteza|dihanje|gorenje|gnitje", "Which process takes CO₂ from the air?|photosynthesis|respiration|burning|rotting"],
  [1, "Kateri proces vrača CO₂ v zrak?|dihanje~gorenje~gnitje|fotosinteza|izhlapevanje|kondenzacija", "Which process returns CO₂ to the air?|respiration~burning~rotting|photosynthesis|evaporation|condensation"],
  [1, "Sončno energijo v ekosistem vnesejo?|rastline|razkrojevalci|plenilci|rastlinojedci", "Sunlight's energy enters an ecosystem through?|plants|decomposers|predators|herbivores"],
  [1, "Energija v mesu volka izvira iz?|Sonca|Lune|zemlje|vode", "The energy in a wolf's meat came from the?|Sun|Moon|soil|water"],
  [1, "Iz CO₂ in vode rastline izdelajo?|sladkor|sol|kovino|plastiko", "From CO₂ and water plants make?|sugar|salt|metal|plastic"],
  [1, "Kaj zmanjšuje količino CO₂ v zraku?|sajenje dreves|kurjenje premoga|vožnja z avtom|sekanje gozdov", "What lowers the amount of CO₂ in air?|planting trees|burning coal|driving cars|cutting forests"],
  [1, "Kako rastline vodo iz tal vrnejo v zrak?|z izhlapevanjem|z gorenjem|z gnitjem|z zmrzovanjem", "Plants return soil water to the air by?|transpiration|burning|rotting|freezing"],
  [1, "Kaj poganja kroženje vode?|Sonce|Luna|veter|rastline", "What drives the water cycle?|the Sun|the Moon|wind|plants"],
  [1, "Odmrle rastline in živali razgradijo?|razkrojevalci|proizvajalci|plenilci|rastlinojedci", "Dead plants and animals are broken down by?|decomposers|producers|predators|herbivores"],
  [2, "Premog in nafta sta nastala iz?|davnih organizmov|vulkanske lave|morske soli|ledu", "Coal and oil formed from?|ancient organisms|volcanic lava|sea salt|ice"],
  [2, "Razkrojevalci iz odmrlih snovi sproščajo?|ogljikov dioksid|kisik|klorofil|svetlobo", "Decomposers break down dead matter and release?|carbon dioxide|oxygen|chlorophyll|light"],
  [2, "Ogljik je v živih bitjih predvsem v?|organskih snoveh|soli|kovinah|kamnih", "Carbon in living things is mainly in?|organic substances|salt|metals|rocks"],
  [2, "Snovi v ekosistemu krožijo, energija pa?|teče skozi|tudi kroži|nastaja iz nič|se kopiči", "Matter cycles in an ecosystem, but energy?|flows through|also cycles|appears from nothing|piles up"],
  [2, "Transpiracija je del?|kroženja vode|kroženja ogljika|razkroja|fotosinteze", "Transpiration is part of the?|water cycle|carbon cycle|food chain|photosynthesis"],
  [2, "Rastlinojedec ogljik dobi iz?|rastlin|zraka|tal|vode", "A herbivore gets its carbon from?|plants|the air|the soil|water"],
  [2, "Kurjenje fosilnih goriv v zraku poveča?|ogljikov dioksid|kisik|dušik|ozon", "Burning fossil fuels raises the air's?|carbon dioxide|oxygen|nitrogen|ozone"],
  [2, "Kje so shranjeni ogljik in energija v hrani?|v organskih snoveh|v vodi|v soli|v kisiku", "Where are the carbon and energy in food stored?|organic substances|water|salt|oxygen"],
  [3, "Večina energije v hrani živali se spremeni v?|toploto|maščobo|kosti|perje", "Most energy in an animal's food ends up as?|heat|fat|bones|feathers"],
  [3, "Zakaj je v verigi malo plenilcev na vrhu?|ostane malo energije|preveč je hrane|so prehitri|ne dihajo", "Why are there few top predators?|too little energy|too much food|they are too fast|they don't respire"],
  [3, "Velik del CO₂ iz zraka vsrka?|morje|puščava|gora|ledenik", "Much of the CO₂ from air is absorbed by the?|ocean|desert|mountains|glaciers"],
  [3, "Šota in premog sta zaloga?|ogljika|železa|soli|kisika", "Peat and coal are stores of?|carbon|iron|salt|oxygen"],
  [3, "Brez razkrojevalcev bi se v ekosistemu?|kopičili ostanki|povečala svetloba|izgubila voda|ustavila plima", "Without decomposers an ecosystem would?|pile up dead remains|get more light|lose water|stop tides"],
  [3, "Kje v verigi je največ energije?|pri proizvajalcih|pri plenilcih|pri razkrojevalcih|pri vrhu verige", "Where in a food chain is most energy?|producers|predators|decomposers|top predators"],
  [3, "Ogljik se iz zraka v rastline in nazaj?|kroži|izgubi|ustvarja|uniči", "Carbon passing from air to plants and back?|cycles|is lost|is created|is destroyed"],
  [3, "Energija, ki jo rastlina porabi za dihanje?|odide kot toplota|preide v plenilca|se vrne v Sonce|ostane v tleh", "Energy a plant uses for respiration?|is lost as heat|passes to predators|returns to the Sun|stays in soil"],
]);

defBank("n2_eco", "nr_ziv", 7, "≈", "Kopenski in vodni ekosistemi", "Land and water ecosystems", [
  [1, "Kje živi krap?|v ribniku|na travniku|v gozdu|v puščavi", "Where does a carp live?|in a pond|in a meadow|in a forest|in a desert"],
  [1, "Kje živi hobotnica?|v morju|v ribniku|v potoku|na travniku", "Where does an octopus live?|in the sea|in a pond|in a stream|in a meadow"],
  [1, "Kje živi žolna?|v gozdu|v morju|v ribniku|v puščavi", "Where does a woodpecker live?|in a forest|in the sea|in a pond|in a desert"],
  [1, "Najvišja plast gozda?|drevesna|grmovna|zeliščna|mahovna", "Top layer of a forest?|tree layer|shrub layer|herb layer|moss layer"],
  [1, "Proizvajalec v ribniku je?|alga~lokvanj~trst|krap|žaba|ličinka komarja", "A producer in a pond is?|alga~water lily~reed|carp|frog|mosquito larva"],
  [1, "Proizvajalec na travniku je?|trava~regrat~detelja|kobilica|krt|zajec", "A producer in a meadow is?|grass~dandelion~clover|grasshopper|mole|rabbit"],
  [1, "Značilen prebivalec travnika?|kobilica~regrat~krt|ščuka|lokvanj|hobotnica", "Typical meadow organism?|grasshopper~dandelion~mole|pike|water lily|octopus"],
  [1, "Značilen prebivalec morja?|morski ježek~meduza~hobotnica|krap|lokvanj|kobilica", "Typical sea organism?|sea urchin~jellyfish~octopus|carp|water lily|grasshopper"],
  [1, "Kdo na travniku opraši cvetove?|čebela~čmrlj~metulj|krt|deževnik|polž", "Who pollinates meadow flowers?|bee~bumblebee~butterfly|mole|earthworm|snail"],
  [1, "Lisica v gozdu je?|plenilec|proizvajalec|razkrojevalec|zajedavec", "A fox in a forest is a?|predator|producer|decomposer|parasite"],
  [1, "Kje je voda slana?|v morju|v ribniku|v potoku|v jezeru", "Where is the water salty?|in the sea|in a pond|in a stream|in a lake"],
  [1, "Prilagoditev rib na življenje v vodi?|škrge~plavuti|perje|krila|dlaka", "A fish's adaptation to water?|gills~fins|feathers|wings|fur"],
  [2, "Plast gozda tik ob tleh?|mahovna|drevesna|grmovna|zeliščna", "Forest layer right at the ground?|moss layer|tree layer|shrub layer|herb layer"],
  [2, "Glavni proizvajalci v morju?|alge|ribe|morski psi|delfini", "The main producers in the sea?|algae|fish|sharks|dolphins"],
  [2, "Travnik, ki ga ne kosimo, se počasi spremeni v?|gozd|morje|puščavo|ribnik", "An uncut meadow slowly turns into?|forest|sea|desert|pond"],
  [2, "Ribnik pozimi zamrzne?|le na vrhu|do dna|le ob dnu|nikoli", "In winter a pond freezes?|only on top|to the bottom|only at the bottom|never"],
  [2, "Zakaj podrast v poletnem gozdu dobi malo svetlobe?|zaradi krošenj|zaradi mahu|zaradi gliv|zaradi vetra", "Why does summer forest floor get little light?|tree crowns|moss|fungi|wind"],
  [2, "Kaj v ribnik prinaša kisik?|vodne rastline|ribe|polži|ličinke", "What adds oxygen to a pond?|water plants|fish|snails|larvae"],
  [2, "Klop v gozdu je?|zajedavec|proizvajalec|razkrojevalec|rastlinojedec", "A tick in a forest is a?|parasite|producer|decomposer|herbivore"],
  [2, "Bel zimski kožuh planinskega zajca služi za?|prikrivanje|letenje|privabljanje|plavanje", "The mountain hare's white winter coat is for?|camouflage|flying|attracting mates|swimming"],
  [3, "Ribnik se zarašča in počasi postane?|močvirje|morje|puščava|reka", "A pond filling with plants slowly becomes a?|marsh|sea|desert|river"],
  [3, "Vodni drsalec se premika po?|gladini vode|dnu ribnika|trstiki|blatu", "A pond skater moves on the?|water surface|pond bottom|reeds|mud"],
  [3, "Pozejdonka v Jadranu je?|cvetnica|alga|žival|gliva", "Neptune grass in the Adriatic is a?|flowering plant|alga|animal|fungus"],
  [3, "Zakaj v globokem morju ni rastlin?|ni svetlobe|ni vode|ni soli|je pretoplo", "Why are there no plants in the deep sea?|no light|no water|no salt|too warm"],
  [3, "Kje je v ribniku največ rastlin?|ob bregu|v globini|v blatu na dnu|v ledu", "Where are most plants in a pond?|near the shore|in deep water|in bottom mud|in the ice"],
  [3, "Ličinke kačjega pastirja v ribniku so?|plenilci|proizvajalci|razkrojevalci|opraševalci", "Dragonfly larvae in a pond are?|predators|producers|decomposers|pollinators"],
  [3, "Kaj v gozdu razgradi odpadlo listje?|glive in bakterije|ptice|srne|veter", "What breaks down fallen leaves in a forest?|fungi and bacteria|birds|deer|wind"],
  [3, "Zakaj ima veliko morskih živali oklep ali bodice?|zaradi plenilcev|zaradi slane vode|za lažje plavanje|za dihanje", "Why do many sea animals have shells or spines?|to deter predators|salty water|easier swimming|breathing"],
]);

export const CONCEPTS = C;
