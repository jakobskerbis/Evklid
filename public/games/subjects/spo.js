// Pojmi za igre: spo (glej README.md v tej mapi).
// Spoznavanje okolja, 1.–3. razred OŠ. Kratka vprašanja za začetne bralce, odgovori 1–2 besedi.
// Banke vprašanj (vnos: stopnja, "vprašanje|pravilno|napačno|…" sl in en) in generatorji iz preglednic
// (seznami "slovensko|angleško").

export const SUBJECT = "SPO";

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
const L = (ctx, sl, en) => (ctx.lang === "sl" ? sl : en);
const an = (w) => (/^[aeiou]/i.test(w) ? "an " : "a ") + w; // angleški člen
const tr = (ctx, s) => s.split("|")[ctx.lang === "sl" ? 0 : 1];
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
// Izbira: pravilni iz seznama yes, napačni iz seznama no (vnosi "sl|en").
const choose = (ctx, q, yes, no) => out(q, tr(ctx, pick(yes)), no.map((s) => tr(ctx, s)));
// Banka: stopnja 1 vzame vnose 1; stopnji 2 in 3 večinoma svoje, v 30 % z nižje stopnje.
function bank(items) {
  return (tier, ctx) => {
    let lv = tier;
    if (tier > 1 && Math.random() < 0.3) lv = tier - 1;
    let pool = items.filter((it) => it[0] === lv);
    if (!pool.length) pool = items.filter((it) => it[0] <= tier);
    const it = pick(pool);
    const [q, a, ...ws] = (ctx.lang === "sl" ? it[1] : it[2]).split("|");
    return out(q, a, ws);
  };
}
const defBank = (id, area, year, glyph, sl, en, items) => def(id, area, year, glyph, sl, en, bank(items));

// =====================================================================
// JAZ IN MOJE TELO
// =====================================================================
defBank("s_body", "so_telo", 1, "☻", "Deli telesa", "Body parts", [
  [1, "Kateri del telesa je na glavi?|nos|koleno|peta|komolec|stopalo", "Which body part is on the head?|nose|knee|heel|elbow|foot"],
  [1, "Kateri del telesa je na roki?|dlan|nos|peta|koleno|uho", "Which body part is on the arm?|palm|nose|heel|knee|ear"],
  [1, "Kateri del telesa je na nogi?|peta|uho|nos|dlan|čelo", "Which body part is on the leg?|heel|ear|nose|palm|forehead"],
  [1, "Kaj je med glavo in trupom?|vrat|koleno|komolec|peta", "What is between the head and body?|neck|knee|elbow|heel"],
  [1, "Kaj je na sredini noge?|koleno|komolec|zapestje|vrat", "What is in the middle of the leg?|knee|elbow|wrist|neck"],
  [1, "Kaj je na sredini roke?|komolec|koleno|gleženj|peta", "What is in the middle of the arm?|elbow|knee|ankle|heel"],
  [1, "Koliko prstov je na eni roki?|5|4|10|3", "How many fingers on one hand?|5|4|10|3"],
  [1, "Koliko prstov je na obeh rokah?|10|5|8|20", "How many fingers on both hands?|10|5|8|20"],
  [1, "Koliko oči ima človek?|2|1|3|4", "How many eyes does a person have?|2|1|3|4"],
  [1, "Kaj je na koncu prsta?|noht|koleno|peta|uho", "What is at the tip of a finger?|a nail|a knee|a heel|an ear"],
  [1, "Kaj je v ustih?|jezik|nos|uho|oko", "What is inside the mouth?|tongue|nose|ear|eye"],
  [1, "Kaj je pod nosom?|usta|čelo|oči|lasje", "What is below the nose?|mouth|forehead|eyes|hair"],
  [1, "Kaj je nad očmi?|čelo|usta|brada|vrat", "What is above the eyes?|forehead|mouth|chin|neck"],
  [1, "Kaj je zadaj na stopalu?|peta|prsti|koleno|komolec", "What is at the back of the foot?|heel|toes|knee|elbow"],
  [1, "Kaj je del obraza?|lice|peta|koleno|hrbet", "Which is part of the face?|cheek|heel|knee|back"],
  [2, "Kaj povezuje dlan in roko?|zapestje|gleženj|koleno|vrat", "What joins the hand to the arm?|wrist|ankle|knee|neck"],
  [2, "Kaj povezuje stopalo in nogo?|gleženj|zapestje|komolec|rama", "What joins the foot to the leg?|ankle|wrist|elbow|shoulder"],
  [2, "Kateri del trupa je zadaj?|hrbet|trebuh|prsi|popek", "Which part of the body is at the back?|back|belly|chest|belly button"],
  [2, "Kje je popek?|na trebuhu|na hrbtu|na roki|na glavi", "Where is the belly button?|on the belly|on the back|on the arm|on the head"],
  [2, "Kje so obrvi?|nad očmi|pod nosom|na bradi|za ušesi", "Where are the eyebrows?|above the eyes|under the nose|on the chin|behind the ears"],
  [2, "Kateri del noge je zgoraj?|stegno|stopalo|peta|gleženj", "Which part of the leg is at the top?|thigh|foot|heel|ankle"],
  [2, "Kje se roka pripenja na trup?|rama|zapestje|komolec|koleno", "Where does the arm join the body?|shoulder|wrist|elbow|knee"],
  [2, "Koliko prstov je na rokah in nogah?|20|10|15|25", "Fingers and toes, how many in all?|20|10|15|25"],
  [2, "Kaj varuje oči pred prahom?|trepalnice|nohti|ustnice|komolci", "What keeps dust out of the eyes?|eyelashes|nails|lips|elbows"],
  [2, "Kaj grize in žveči hrano?|zobje|ustnice|nos|lica", "What bites and chews food?|teeth|lips|nose|cheeks"],
  [2, "Kateri prst je najdebelejši?|palec|mezinec|kazalec|prstanec", "Which finger is the thickest?|thumb|little finger|index finger|ring finger"],
  [2, "Kateri prst je najmanjši?|mezinec|palec|sredinec|kazalec", "Which finger is the smallest?|little finger|thumb|middle finger|index finger"],
  [2, "Kateri prst je najdaljši?|sredinec|palec|mezinec|kazalec", "Which finger is the longest?|middle finger|thumb|little finger|index finger"],
  [2, "Kateri prst uporabimo za kazanje?|kazalec|mezinec|palec|prstanec", "Which finger do we point with?|index finger|little finger|thumb|ring finger"],
  [2, "Kje je komolec?|na roki|na nogi|na glavi|na hrbtu", "Where is the elbow?|on the arm|on the leg|on the head|on the back"],
  [2, "Kje je gleženj?|na nogi|na roki|na glavi|na vratu", "Where is the ankle?|on the leg|on the arm|on the head|on the neck"],
  [3, "Kaj bije v prsih?|srce|želodec|pljuča|možgani", "What beats in your chest?|heart|stomach|lungs|brain"],
  [3, "Kateri organ nam pomaga misliti?|možgani|srce|želodec|pljuča", "Which organ do we think with?|brain|heart|stomach|lungs"],
  [3, "Kam gre pogoltnjena hrana?|v želodec|v pljuča|v srce|v možgane", "Where does swallowed food go?|to the stomach|to the lungs|to the heart|to the brain"],
  [3, "Kateri organ nam pomaga dihati?|pljuča|želodec|srce|možgani", "Which organ helps us breathe?|lungs|stomach|heart|brain"],
  [3, "Kaj teče po žilah?|kri|zrak|mleko|sok", "What flows in our blood vessels?|blood|air|milk|juice"],
  [3, "Kaj premika kosti?|mišice|lasje|nohti|koža", "What moves our bones?|muscles|hair|nails|skin"],
  [3, "Kaj ščiti možgane?|lobanja|rebra|zapestje|koleno", "What protects the brain?|skull|ribs|wrist|knee"],
  [3, "Kaj ščiti srce in pljuča?|rebra|lobanja|koleno|zapestje", "What protects the heart and lungs?|ribs|skull|knee|wrist"],
  [3, "Kaj pokriva celo telo?|koža|kosti|mišice|lasje", "What covers the whole body?|skin|bones|muscles|hair"],
  [3, "Kaj drži telo pokonci?|okostje|koža|kri|lasje", "What holds the body up?|skeleton|skin|blood|hair"],
  [3, "Koliko mlečnih zob ima otrok?|20|32|10|50", "How many baby teeth does a child have?|20|32|10|50"],
  [3, "Kaj zraste, ko izpade mlečni zob?|stalni zob|nov mlečni zob|nič več|noht", "What grows after a baby tooth falls out?|adult tooth|new baby tooth|nothing|a nail"],
  [3, "Kje je hrbtenica?|v hrbtu|v trebuhu|v roki|v glavi", "Where is the spine?|in the back|in the belly|in the arm|in the head"],
  [3, "Ko tečemo, srce bije?|hitreje|počasneje|enako hitro|sploh ne", "When we run, the heart beats?|faster|slower|the same|not at all"],
]);

defBank("s_senses", "so_telo", 1, "◉", "Čutila", "The senses", [
  [1, "Katero čutilo zaznava vonj?|nos|oči|ušesa|jezik|koža", "Which sense organ detects smell?|nose|eyes|ears|tongue|skin"],
  [1, "Katero čutilo zaznava zvok?|ušesa|oči|nos|jezik|koža", "Which sense organ detects sound?|ears|eyes|nose|tongue|skin"],
  [1, "Katero čutilo zaznava barve?|oči|ušesa|nos|jezik|koža", "Which sense organ sees colours?|eyes|ears|nose|tongue|skin"],
  [1, "Katero čutilo zaznava okus?|jezik|oči|ušesa|koža", "Which sense organ detects taste?|tongue|eyes|ears|skin"],
  [1, "Katero čutilo zazna mraz?|koža|nos|ušesa|oči", "Which sense organ feels cold?|skin|nose|ears|eyes"],
  [1, "Kaj nam pove, da je med sladek?|jezik|ušesa|oči|koža", "What tells us honey is sweet?|tongue|ears|eyes|skin"],
  [1, "Kaj nam pove, da roža diši?|nos|jezik|ušesa|koža", "What tells us a flower smells nice?|nose|tongue|ears|skin"],
  [1, "Kaj nam pove, da zvoni?|ušesa|nos|jezik|koža", "What tells us a bell is ringing?|ears|nose|tongue|skin"],
  [1, "Kaj nam pove, da je trava zelena?|oči|ušesa|nos|jezik", "What tells us grass is green?|eyes|ears|nose|tongue"],
  [1, "Kaj je kislo?|limona|med|sladkor|čokolada", "Which is sour?|lemon|honey|sugar|chocolate"],
  [1, "Kaj je sladko?|med|limona|sol|kis", "Which is sweet?|honey|lemon|salt|vinegar"],
  [1, "Kaj je zelo glasno?|sirena|šepet|padec peresa|mačji koraki", "Which is very loud?|a siren|a whisper|a falling feather|cat's footsteps"],
  [1, "Kaj je mehko?|blazina|kamen|žebelj|opeka", "Which is soft?|pillow|stone|nail|brick"],
  [1, "Kaj je vroče?|ogenj|led|sneg|sladoled", "Which is hot?|fire|ice|snow|ice cream"],
  [2, "Z jezikom zaznamo?|okus|vonj|barvo|zvok", "The tongue senses?|taste|smell|colour|sound"],
  [2, "Z nosom zaznamo?|vonj|barvo|zvok|svetlobo", "The nose senses?|smell|colour|sound|light"],
  [2, "Z ušesi zaznamo?|zvok|vonj|barvo|okus", "The ears sense?|sound|smell|colour|taste"],
  [2, "Z očmi zaznamo?|barve|zvok|vonj|okus", "The eyes sense?|colours|sounds|smells|tastes"],
  [2, "S kožo zaznamo?|toploto|barve|zvok|vonj", "The skin senses?|warmth|colours|sounds|smells"],
  [2, "Koliko čutil imamo?|5|2|3|10|7", "How many senses do we have?|5|2|3|10|7"],
  [2, "Kateri okus ima limona?|kisel|sladek|slan|grenek", "What does a lemon taste like?|sour|sweet|salty|bitter"],
  [2, "Kateri okus ima med?|sladek|kisel|slan|grenek", "What does honey taste like?|sweet|sour|salty|bitter"],
  [2, "Kateri okus ima sol?|slan|sladek|kisel|grenek", "What does salt taste like?|salty|sweet|sour|bitter"],
  [2, "Kaj varuje oči na soncu?|sončna očala|rokavice|šal|nogavice", "What protects eyes in the sun?|sunglasses|gloves|a scarf|socks"],
  [2, "Kaj škoduje ušesom?|zelo glasna glasba|tiho petje|šepet|ptičje petje", "What harms our ears?|very loud music|quiet singing|a whisper|birdsong"],
  [2, "Kaj škoduje očem?|gledanje v sonce|branje pri luči|spanje|mežikanje", "What harms our eyes?|staring at the sun|reading in light|sleeping|blinking"],
  [2, "Kaj čutimo, ko se urežemo?|bolečino|vonj|okus|barvo", "When we cut ourselves we feel?|pain|a smell|a taste|a colour"],
  [2, "Katero čutilo potrebujemo za branje?|oči|ušesa|nos|jezik", "Which sense organ do we read with?|eyes|ears|nose|tongue"],
  [3, "Kaj pomaga slabovidnim?|očala|slušni aparat|zobna ščetka|rokavice", "What helps people who see badly?|glasses|a hearing aid|a toothbrush|gloves"],
  [3, "Kaj pomaga naglušnim?|slušni aparat|očala|zobna ščetka|rokavice", "What helps people who hear badly?|a hearing aid|glasses|a toothbrush|gloves"],
  [3, "Kako se pogovarjajo gluhi ljudje?|s kretnjami|s piskanjem|z vonjem|z barvami", "How do deaf people talk?|with signs|by whistling|with smells|with colours"],
  [3, "Največje čutilo je?|koža|oko|uho|nos", "The largest sense organ is the?|skin|eye|ear|nose"],
  [3, "Brbončice so na?|jeziku|nosu|ušesu|dlani", "Taste buds are on the?|tongue|nose|ear|palm"],
  [3, "Solze varujejo?|oči|ušesa|nos|jezik", "Tears protect the?|eyes|ears|nose|tongue"],
  [3, "Kaj ujame prah v nosu?|dlačice|zobje|solze|nohti", "What catches dust in the nose?|tiny hairs|teeth|tears|nails"],
  [3, "Ušesno maslo varuje?|uho|oko|nos|zobe", "Earwax protects the?|ear|eye|nose|teeth"],
  [3, "Z zamašenim nosom slabše zaznamo?|vonj|zvok|barve|toploto", "With a blocked nose we sense less?|smell|sound|colour|warmth"],
  [3, "Slepi berejo s pomočjo?|tipa|vonja|okusa|vida", "Blind people read using?|touch|smell|taste|sight"],
  [3, "Pokvarjeno mleko zaznamo po?|vonju|zvoku|teži|toploti", "We notice sour milk by its?|smell|sound|weight|warmth"],
  [3, "S tipom ugotovimo, ali je nekaj?|hrapavo|rdeče|glasno|dišeče", "Touch tells us if something is?|rough|red|loud|smelly"],
]);

defBank("s_hygiene", "so_telo", 2, "+", "Zdravje in higiena", "Health and hygiene", [
  [1, "Kdaj si umijemo roke?|pred jedjo|samo ob nedeljah|nikoli|samo poleti", "When do we wash our hands?|before eating|only on Sundays|never|only in summer"],
  [1, "Kolikokrat na dan umijemo zobe?|vsaj dvakrat|enkrat na teden|nikoli|enkrat na mesec", "How often do we brush our teeth?|twice a day|once a week|never|once a month"],
  [1, "Kaj potrebujemo za umivanje zob?|zobno ščetko|glavnik|nogavice|škarje", "What do we brush teeth with?|a toothbrush|a comb|socks|scissors"],
  [1, "Roke si umijemo z vodo in?|milom|peskom|sokom|blatom", "We wash hands with water and?|soap|sand|juice|mud"],
  [1, "Kaj je zdrava malica?|jabolko|čips|bonboni|lizika", "Which is a healthy snack?|an apple|crisps|sweets|a lollipop"],
  [1, "Kaj je najboljše za žejo?|voda|sladek sok|gazirana pijača|energijska pijača", "What is best when thirsty?|water|sweet juice|fizzy drink|energy drink"],
  [1, "Koliko ur spanja potrebuje otrok?|približno 10|približno 2|približno 20|približno 4", "How many hours should a child sleep?|about 10|about 2|about 20|about 4"],
  [1, "Ko kihamo, si pokrijemo?|usta in nos|oči|ušesa|kolena", "When sneezing, we cover our?|mouth and nose|eyes|ears|knees"],
  [1, "Kaj je dobro za zdravje?|gibanje|dolgo pred zaslonom|malo spanja|veliko sladkarij", "What is good for health?|exercise|hours at a screen|little sleep|lots of sweets"],
  [1, "Kaj potrebujemo za česanje?|glavnik|zobno ščetko|milo|brisačo", "What do we use to comb hair?|a comb|a toothbrush|soap|a towel"],
  [1, "Kaj uporabimo za brisanje po kopanju?|brisačo|glavnik|zobno ščetko|škarje", "What do we dry off with after a bath?|a towel|a comb|a toothbrush|scissors"],
  [1, "Ko smo bolni, nas pregleda?|zdravnik|pek|frizer|poštar", "When we're ill, who examines us?|a doctor|a baker|a hairdresser|a postman"],
  [1, "Kdo nam pregleda zobe?|zobozdravnik|frizer|pek|kuhar", "Who checks our teeth?|a dentist|a hairdresser|a baker|a cook"],
  [2, "Kaj zdravju škodi?|preveč sladkarij|sadje|voda|gibanje", "What is bad for health?|too many sweets|fruit|water|exercise"],
  [2, "Kako se znebimo bacilov na rokah?|z umivanjem|s pihanjem|z mahanjem|s ploskanjem", "How do we get rid of germs on hands?|by washing|by blowing|by waving|by clapping"],
  [2, "Koliko časa umivamo zobe?|približno 2 minuti|5 sekund|1 uro|pol dneva", "How long do we brush our teeth?|about 2 minutes|5 seconds|1 hour|half a day"],
  [2, "Zobe umijemo zjutraj in?|zvečer|nikoli|samo ob sobotah|samo poleti", "We brush teeth in the morning and?|at night|never|only on Saturdays|only in summer"],
  [2, "Kaj storimo po uporabi stranišča?|umijemo roke|pojemo kosilo|zaspimo|tečemo ven", "What do we do after using the toilet?|wash our hands|eat lunch|go to sleep|run outside"],
  [2, "Kateri obrok je zjutraj?|zajtrk|kosilo|večerja|popoldanska malica", "Which meal is in the morning?|breakfast|lunch|dinner|afternoon snack"],
  [2, "Kateri obrok je zvečer?|večerja|zajtrk|kosilo|dopoldanska malica", "Which meal is in the evening?|dinner|breakfast|lunch|morning snack"],
  [2, "Kdaj jemo kosilo?|sredi dneva|zgodaj zjutraj|ponoči|ob polnoči", "When do we eat lunch?|at midday|early morning|at night|at midnight"],
  [2, "Kaj varuje kožo pred soncem?|krema za sončenje|milo|zobna pasta|šampon", "What protects skin from the sun?|sunscreen|soap|toothpaste|shampoo"],
  [2, "Kaj nas pozimi varuje pred mrazom?|topla oblačila|kopalke|sandali|sončna očala", "What keeps us warm in winter?|warm clothes|a swimsuit|sandals|sunglasses"],
  [2, "Koliko časa na dan naj se gibljemo?|vsaj 1 uro|1 minuto|nič|5 minut", "How long should we be active each day?|at least 1 hour|1 minute|not at all|5 minutes"],
  [2, "Česa ne delimo z drugimi?|zobne ščetke|knjige|igrače|žoge", "What should we never share?|a toothbrush|a book|a toy|a ball"],
  [2, "Umazana oblačila?|operemo|pojemo|zakopljemo|posadimo", "Dirty clothes are?|washed|eaten|buried|planted"],
  [3, "Luknje v zobeh povzroča predvsem?|sladkor|voda|korenje|sir", "Holes in teeth are mostly caused by?|sugar|water|carrots|cheese"],
  [3, "Kaj krepi kosti?|mleko in sir|sladkarije|čips|sladke pijače", "What helps build strong bones?|milk and cheese|sweets|crisps|fizzy drinks"],
  [3, "Kako se širi prehlad?|s kihanjem|z umivanjem rok|s spanjem|s pitjem vode", "How does a cold spread?|by sneezing|by washing hands|by sleeping|by drinking water"],
  [3, "Ko imamo vročino, je telesna temperatura?|višja|nižja|enaka|0 °C", "With a fever, body temperature is?|higher|lower|the same|0 °C"],
  [3, "Temperatura zdravega otroka je približno?|36–37 °C|20 °C|42 °C|10 °C", "A healthy child's temperature is about?|36–37 °C|20 °C|42 °C|10 °C"],
  [3, "Česa ne smemo vzeti brez odrasle osebe?|zdravil|sadja|vode|kruha", "What must we never take without an adult?|medicine|fruit|water|bread"],
  [3, "Ko je vroče, je dobro?|piti veliko vode|sedeti na soncu|nositi bundo|jesti sladkarije", "When it's hot, we should?|drink lots of water|sit in the sun|wear a coat|eat sweets"],
  [3, "Zakaj si umivamo roke?|da odstranimo bacile|da so težje|da zrastejo|da so hladne", "Why do we wash our hands?|to remove germs|to make them heavy|to make them grow|to make them cold"],
  [3, "Med spanjem telo?|počiva in raste|teče|pleše|bere", "While we sleep, the body?|rests and grows|runs|dances|reads"],
  [3, "Kaj pomaga pri prehladu?|počitek|tek v dežju|veliko sladkarij|bosi po snegu", "What helps when we have a cold?|rest|running in rain|lots of sweets|barefoot in snow"],
  [3, "Ko krvavimo iz nosu, glavo nagnemo?|naprej|nazaj|v levo|v desno", "With a nosebleed, lean your head?|forward|back|to the left|to the right"],
  [3, "Opeklino najprej?|hladimo z vodo|namažemo z maslom|pokrijemo z volno|segrejemo", "First, a burn should be?|cooled with water|covered in butter|wrapped in wool|warmed up"],
  [3, "Na koži najdemo klopa. Kaj storimo?|povemo odraslemu|ga pustimo|ga popraskamo|ga namažemo z oljem", "We find a tick on our skin. We?|tell an adult|leave it|scratch it|put oil on it"],
]);

const FOOD = {
  fruit: ["jabolko|apple", "hruška|pear", "banana|banana", "jagoda|strawberry", "češnja|cherry", "pomaranča|orange", "grozdje|grapes", "sliva|plum", "marelica|apricot", "kivi|kiwi"],
  veg: ["korenje|carrot", "solata|lettuce", "zelje|cabbage", "brokoli|broccoli", "špinača|spinach", "čebula|onion", "por|leek", "cvetača|cauliflower", "redkev|radish"],
  grain: ["kruh|bread", "testenine|pasta", "koruzni kosmiči|cornflakes", "ovseni kosmiči|porridge oats", "žemlja|bread roll"],
  milk: ["mleko|milk", "jogurt|yoghurt", "sir|cheese", "skuta|cottage cheese", "kefir|kefir"],
  sweet: ["bonboni|sweets", "lizika|lollipop", "torta|cake", "čokolada|chocolate"],
};
const FOOD_Q = [
  ["fruit", "Kaj je sadje?|Which is a fruit?"],
  ["veg", "Kaj je zelenjava?|Which is a vegetable?"],
  ["grain", "Kaj je narejeno iz žita?|Which is made from grain?"],
  ["milk", "Kaj je mlečni izdelek?|Which is a dairy food?"],
  ["sweet", "Kaj je sladkarija?|Which is a sweet treat?"],
];
const FOOD_BANK = bank([
  [1, "Iz česa je kruh?|iz moke|iz mleka|iz mesa|iz sadja", "What is bread made from?|flour|milk|meat|fruit"],
  [1, "Iz česa je jogurt?|iz mleka|iz moke|iz jabolk|iz mesa", "What is yoghurt made from?|milk|flour|apples|meat"],
  [1, "Iz česa je marmelada?|iz sadja|iz mleka|iz moke|iz mesa", "What is jam made from?|fruit|milk|flour|meat"],
  [1, "Iz česa je pomfri?|iz krompirja|iz jabolk|iz mleka|iz riža", "What are chips (fries) made from?|potatoes|apples|milk|rice"],
  [1, "Česa naj jemo najmanj?|sladkarij|zelenjave|sadja|kruha", "What should we eat least of?|sweets|vegetables|fruit|bread"],
  [1, "Iz česa je sadni sok?|iz sadja|iz kamna|iz mesa|iz moke", "What is fruit juice made from?|fruit|stone|meat|flour"],
  [1, "Kaj ni zdravo za malico?|čips|jabolko|jogurt|korenje", "Which is NOT a healthy snack?|crisps|an apple|yoghurt|a carrot"],
  [2, "Iz česa je moka?|iz žita|iz mleka|iz sadja|iz mesa", "What is flour made from?|grain|milk|fruit|meat"],
  [2, "Iz česa je sir?|iz mleka|iz moke|iz jajc|iz sadja", "What is cheese made from?|milk|flour|eggs|fruit"],
  [2, "Iz česa so testenine?|iz moke|iz mleka|iz mesa|iz jabolk", "What is pasta made from?|flour|milk|meat|apples"],
  [2, "Iz česa je maslo?|iz mleka|iz moke|iz sadja|iz riža", "What is butter made from?|milk|flour|fruit|rice"],
  [2, "Iz česa je pokovka?|iz koruze|iz riža|iz krompirja|iz mleka", "What is popcorn made from?|corn|rice|potatoes|milk"],
  [2, "Iz česa je kečap?|iz paradižnika|iz jagod|iz korenja|iz mleka", "What is ketchup made from?|tomatoes|strawberries|carrots|milk"],
  [2, "Kaj nam dajo čebele?|med|mleko|jajca|volno", "What do bees give us?|honey|milk|eggs|wool"],
  [3, "Kaj je živalskega izvora?|jajce|jabolko|riž|korenje", "Which food comes from an animal?|an egg|an apple|rice|a carrot"],
  [3, "Kaj je rastlinskega izvora?|riž|jajce|mleko|med", "Which food comes from a plant?|rice|an egg|milk|honey"],
  [3, "Iz česa pridobivajo sladkor?|iz sladkorne pese|iz krompirja|iz riža|iz mleka", "Sugar is made from?|sugar beet|potatoes|rice|milk"],
  [3, "Iz česa je čips?|iz krompirja|iz jabolk|iz riža|iz moke", "What are crisps made from?|potatoes|apples|rice|flour"],
  [3, "Kaj je polnozrnati kruh?|kruh iz celega zrna|kruh s sladkorjem|sladica|mlečni izdelek", "What is wholemeal bread?|whole-grain bread|sweet bread|a dessert|a dairy food"],
  [3, "Kaj je najbolj zdrava pijača?|voda|sladek čaj|sok s sladkorjem|gazirana pijača", "Which drink is the healthiest?|water|sweet tea|sugary juice|fizzy drink"],
  [3, "Koliko obrokov na dan naj jemo?|5|1|10|20", "How many meals a day should we eat?|5|1|10|20"],
  [3, "Kaj je dobro za zdrave zobe?|surovo korenje|bonboni|lizike|sladke pijače", "What is good for healthy teeth?|raw carrots|sweets|lollipops|fizzy drinks"],
  [3, "Kaj pijemo, ko se veliko gibljemo?|vodo|kavo|sirup|energijsko pijačo", "What do we drink after lots of exercise?|water|coffee|syrup|energy drink"],
]);
def("s_food", "so_telo", 3, "Ψ", "Zdrava prehrana", "Healthy eating", (t, ctx) => {
  if (Math.random() < (t === 1 ? 0.6 : t === 2 ? 0.4 : 0.25)) {
    const [g, q] = pick(FOOD_Q);
    const no = Object.keys(FOOD).filter((k) => k !== g).flatMap((k) => FOOD[k]);
    return choose(ctx, tr(ctx, q), FOOD[g], no);
  }
  return FOOD_BANK(t, ctx);
});

// =====================================================================
// ŽIVA BITJA
// =====================================================================
const LIVING = ["pes|dog", "mačka|cat", "drevo|tree", "roža|flower", "zajec|rabbit", "riba|fish", "ptica|bird", "človek|person", "čebela|bee", "trava|grass", "polž|snail", "metulj|butterfly", "žaba|frog", "krava|cow", "deževnik|earthworm", "regrat|dandelion"];
const NONLIVING = ["kamen|stone", "avto|car", "žoga|ball", "miza|table", "stol|chair", "svinčnik|pencil", "robot|robot", "lutka|doll", "plišasti medvedek|teddy bear", "ura|clock", "kolo|bicycle", "skodelica|cup"];
const PLANTS_L = ["drevo|tree", "roža|flower", "trava|grass", "regrat|dandelion", "grm|bush", "solata|lettuce", "mah|moss"];
const ANIMALS_L = ["pes|dog", "mačka|cat", "zajec|rabbit", "riba|fish", "ptica|bird", "čebela|bee", "polž|snail", "metulj|butterfly", "žaba|frog", "krava|cow", "deževnik|earthworm"];
const ONCE_LIVING = ["suh list|dry leaf", "suha veja|dead branch", "storž|pine cone", "lubje|tree bark", "ptičje pero|bird's feather"];
const NEVER_LIVING = ["kamen|stone", "steklo|glass", "kovanec|coin", "žebelj|nail", "pesek|sand", "plastična žlica|plastic spoon"];
const LIVING_BANK = bank([
  [1, "Kaj potrebuje vsako živo bitje?|hrano|igrače|televizijo|kolo", "What does every living thing need?|food|toys|a TV|a bike"],
  [1, "Kaj diha?|mačka|kamen|stol|žoga", "Which one breathes?|a cat|a stone|a chair|a ball"],
  [1, "Kaj jé?|zajec|kamen|ura|stol", "Which one eats?|a rabbit|a stone|a clock|a chair"],
  [1, "Kaj se rodi?|tele|avto|stol|kamen", "Which one is born?|a calf|a car|a chair|a stone"],
  [1, "Kaj umre, če nima vode?|roža|kamen|žoga|ura", "What dies without water?|a flower|a stone|a ball|a clock"],
  [2, "Kaj počne vsako živo bitje?|raste|leti|plava|govori", "What does every living thing do?|grows|flies|swims|talks"],
  [2, "Česa živa bitja ne potrebujejo?|igrač|vode|hrane|zraka", "What do living things NOT need?|toys|water|food|air"],
  [2, "Kaj potrebujejo vsa živa bitja?|vodo|igrače|denar|obleke", "What do all living things need?|water|toys|money|clothes"],
  [2, "Kaj je neživo?|oblak|drevo|gliva|mravlja", "Which is not living?|a cloud|a tree|a fungus|an ant"],
  [3, "Živa bitja imajo?|potomce|kolesa|baterije|gumbe", "Living things have?|young|wheels|batteries|buttons"],
  [3, "Rastlina dobi hrano?|sama v listih|iz trgovine|od mame|iz baterije", "A plant gets its food?|by making it|from a shop|from its mum|from a battery"],
  [3, "Kaj od tega diha?|pes|kamen|avto|ura", "Which of these breathes?|a dog|a stone|a car|a clock"],
  [3, "Kaj se premika, a ni živo?|avto|pes|ptica|riba", "What moves but is NOT alive?|a car|a dog|a bird|a fish"],
  [3, "Kaj je živo, a se ne premika z mesta?|drevo|kamen|avto|ura", "What is alive but stays in one place?|a tree|a stone|a car|a clock"],
  [3, "Ko živo bitje umre, se?|razkroji|napolni|popravi|prižge", "When a living thing dies, it?|rots away|recharges|gets fixed|switches on"],
]);
def("s_living", "so_ziv", 1, "✿", "Živo in neživo", "Living and non-living", (t, ctx) => {
  const r = Math.random();
  if (t === 1) {
    if (r < 0.2) return LIVING_BANK(1, ctx);
    if (r < 0.55) return choose(ctx, L(ctx, "Kaj je živo?", "Which is alive?"), LIVING, NONLIVING);
    if (r < 0.82) return choose(ctx, L(ctx, "Kaj ni živo?", "Which is NOT alive?"), NONLIVING, LIVING);
    return choose(ctx, L(ctx, "Kaj raste?", "Which one grows?"), LIVING, NONLIVING);
  }
  if (t === 2) {
    if (r < 0.3) return choose(ctx, L(ctx, "Kaj je rastlina?", "Which is a plant?"), PLANTS_L, [...ANIMALS_L, ...NONLIVING]);
    if (r < 0.6) return choose(ctx, L(ctx, "Kaj je žival?", "Which is an animal?"), ANIMALS_L, [...PLANTS_L, ...NONLIVING]);
    return LIVING_BANK(2, ctx);
  }
  if (r < 0.35) return choose(ctx, L(ctx, "Kaj je bilo nekoč del živega bitja?", "What was once part of a living thing?"), ONCE_LIVING, NEVER_LIVING);
  return LIVING_BANK(3, ctx);
});

// Domače živali: [žival, oglašanje (kdo …?), mladič, dom, množina, rodilnik]
const FARM = [
  ["krava|cow", "muka|moos", "tele|calf", "v hlevu|in a cowshed", "krave|cows", "krave"],
  ["konj|horse", "rezgeta|neighs", "žrebe|foal", null, null, "konja"],
  ["ovca|sheep", "bleja|baas", "jagnje|lamb", null, null, "ovce"],
  ["koza|goat", "meketa|bleats", "kozliček|kid", null, null, "koze"],
  ["prašič|pig", "kruli|oinks", "pujsek|piglet", "v svinjaku|in a pigsty", "prašiči|pigs", "prašiča"],
  ["kokoš|hen", "kokodaka|clucks", "piščanec|chick", "v kurniku|in a henhouse", "kokoši|hens", "kokoši"],
  ["petelin|rooster", "kikirika|crows", null, null, null],
  ["raca|duck", null, "raček|duckling", null, null, "race"],
  ["pes|dog", "laja|barks", null, "v pasji uti|in a kennel", "psi|dogs"],
  ["mačka|cat", "mijavka|meows", "mucek|kitten", null, null, "mačke"],
  ["osel|donkey", "riga|brays", null, null, null],
  ["čebela|bee", "brenči|buzzes", null, "v panju|in a hive", "čebele|bees"],
];
const FARM_BANK = bank([
  [1, "Katera žival nam daje jajca?|kokoš|krava|ovca|prašič", "Which animal gives us eggs?|hen|cow|sheep|pig"],
  [1, "Katera žival nam daje volno?|ovca|kokoš|prašič|konj", "Which animal gives us wool?|sheep|hen|pig|horse"],
  [1, "Katera žival nam daje med?|čebela|krava|kokoš|ovca", "Which animal gives us honey?|bee|cow|hen|sheep"],
  [1, "Katera žival nam daje mleko?|krava|kokoš|prašič|čebela", "Which animal gives us milk?|cow|hen|pig|bee"],
  [2, "Kaj jedo krave?|travo in seno|meso|ribe|kosti", "What do cows eat?|grass and hay|meat|fish|bones"],
  [2, "Kaj kokoši rade kljujejo?|zrnje|seno|les|steklo", "What do hens like to peck?|grain|hay|wood|glass"],
  [2, "Kdo ima grivo?|konj|krava|ovca|prašič", "Which animal has a mane?|horse|cow|sheep|pig"],
  [2, "Kdo ima rilec?|prašič|konj|ovca|kokoš", "Which animal has a snout?|pig|horse|sheep|hen"],
  [3, "Kaj naredimo iz ovčje volne?|pulover|mleko|jajce|med", "What can be made from sheep's wool?|a jumper|milk|an egg|honey"],
  [3, "Kdo skrbi za domače živali?|kmet|pilot|zobozdravnik|frizer", "Who looks after farm animals?|a farmer|a pilot|a dentist|a hairdresser"],
  [3, "Kdo zdravi bolne živali?|veterinar|zobozdravnik|kuhar|pek", "Who treats sick animals?|a vet|a dentist|a cook|a baker"],
  [3, "Kdo ima kopita?|konj|kokoš|mačka|pes", "Which animal has hooves?|horse|hen|cat|dog"],
]);
def("s_farm", "so_ziv", 1, "mu", "Domače živali", "Farm animals", (t, ctx) => {
  const r = Math.random();
  const names = FARM.map((f) => f[0]);
  if (t === 1 && r < 0.7) {
    const f = pick(FARM.filter((x) => x[1]));
    return out(L(ctx, `Kdo ${tr(ctx, f[1])}?`, `Which animal ${tr(ctx, f[1])}?`), tr(ctx, f[0]), names.filter((n) => n !== f[0] && FARM.find((x) => x[0] === n)[1] && !(/kokoš|petelin/.test(n) && /kokoš|petelin/.test(f[0]))).map((n) => tr(ctx, n)));
  }
  if (t === 2 && r < 0.65) {
    const f = pick(FARM.filter((x) => x[2]));
    return out(L(ctx, `Mladič ${f[5]} je?`, `What is a baby ${tr(ctx, f[0])} called?`), tr(ctx, f[2]), FARM.filter((x) => x[2] && x !== f).map((x) => tr(ctx, x[2])));
  }
  if (t === 3 && r < 0.55) {
    const f = pick(FARM.filter((x) => x[3]));
    // le nedvoumni domovi; prašič je lahko tudi v hlevu, zato hlev pri njem ni napačen
    const ws = FARM.filter((x) => x[3] && x !== f && !(/prašič/.test(f[0]) && /hlev/.test(x[3]))).map((x) => tr(ctx, x[3]));
    return out(L(ctx, `Kje na kmetiji živijo ${tr(ctx, f[4])}?`, `Where do ${tr(ctx, f[4])} live on a farm?`), tr(ctx, f[3]), ws);
  }
  return FARM_BANK(t, ctx);
});

defBank("s_wild", "so_ziv", 2, "∴", "Živali v naravi", "Wild animals", [
  [1, "Kaj splete pajek?|mrežo|gnezdo|rov|panj", "What does a spider spin?|a web|a nest|a tunnel|a hive"],
  [1, "Kje ptica vali jajca?|v gnezdu|v rovu|v mreži|v panju", "Where does a bird keep its eggs warm?|in a nest|in a tunnel|in a web|in a hive"],
  [1, "Kje živi krt?|pod zemljo|na drevesu|v vodi|v gnezdu", "Where does a mole live?|underground|in a tree|in water|in a nest"],
  [1, "Kje živi riba?|v vodi|na drevesu|pod zemljo|v gnezdu", "Where does a fish live?|in water|in a tree|underground|in a nest"],
  [1, "Kje živi veverica?|na drevesu|pod zemljo|v vodi|v mravljišču", "Where does a squirrel live?|in a tree|underground|in water|in an anthill"],
  [1, "Kdo živi v mravljišču?|mravlje|ribe|krti|polži", "Who lives in an anthill?|ants|fish|moles|snails"],
  [1, "Kdo nosi hišico na hrbtu?|polž|zajec|krt|lisica", "Who carries its house on its back?|snail|hare|mole|fox"],
  [1, "Kdo ima bodice?|jež|zajec|polž|lisica", "Who has spines?|hedgehog|hare|snail|fox"],
  [1, "Katera žival leže jajca?|ptica|lisica|srna|zajec", "Which animal lays eggs?|bird|fox|deer|hare"],
  [1, "Kdo skače po drevju?|veverica|krt|polž|riba", "Who jumps about in the trees?|squirrel|mole|snail|fish"],
  [1, "Kdo ima dolga ušesa in skače?|zajec|polž|riba|krt", "Who has long ears and hops?|hare|snail|fish|mole"],
  [1, "Kdo ponoči skovika?|sova|kokoš|vrabec|golob", "Who hoots at night?|owl|hen|sparrow|pigeon"],
  [1, "Kdo ima rogovje?|jelen|lisica|zajec|jež", "Who has antlers?|stag|fox|hare|hedgehog"],
  [1, "Kdo trka po deblu?|žolna|lastovka|sova|vrabec", "Who drums on tree trunks?|woodpecker|swallow|owl|sparrow"],
  [2, "Kdo pozimi spi v brlogu?|medved|srna|vrana|zajec", "Who sleeps in a den in winter?|bear|deer|crow|hare"],
  [2, "Kdo prespi zimo?|jež|lisica|srna|vrana", "Who sleeps through the winter?|hedgehog|fox|deer|crow"],
  [2, "Polh pozimi?|spi|odleti na jug|plava|lovi miši", "In winter a dormouse?|sleeps|flies south|swims|hunts mice"],
  [2, "Katera ptica jeseni odleti na jug?|lastovka|vrabec|sinica|vrana", "Which bird flies south in autumn?|swallow|sparrow|tit|crow"],
  [2, "Kaj jeseni naredi štorklja?|odleti na jug|zaspi|se skrije v rov|zgradi brlog", "What does a stork do in autumn?|flies south|falls asleep|hides in a tunnel|builds a den"],
  [2, "Kaj jé veverica?|orehe|ribe|miši|travo", "What does a squirrel like to eat?|nuts|fish|mice|grass"],
  [2, "Kaj lovi lisica?|miši|medvede|krave|volkove", "What does a fox hunt?|mice|bears|cows|wolves"],
  [2, "Kaj jé srna?|travo in liste|miši|ribe|meso", "What does a deer eat?|grass and leaves|mice|fish|meat"],
  [2, "Kaj lovi sova?|miši|krave|lisice|srne", "What does an owl hunt?|mice|cows|foxes|deer"],
  [2, "Kaj jé zajec?|rastline|miši|ribe|meso", "What does a hare eat?|plants|mice|fish|meat"],
  [2, "Kaj pozimi damo ptičem v krmilnico?|semena|čokolado|bonbone|sol", "What goes in a winter bird feeder?|seeds|chocolate|sweets|salt"],
  [2, "Kaj jé jež?|polže in žuželke|travo|seno|orehe", "What does a hedgehog eat?|slugs and insects|grass|hay|nuts"],
  [3, "Največja zver v Sloveniji je?|rjavi medved|volk|ris|lisica", "Largest wild carnivore in Slovenia?|brown bear|wolf|lynx|fox"],
  [3, "Kje živi kozorog?|v gorah|v morju|v jami|v mestu", "Where does an ibex live?|in the mountains|in the sea|in a cave|in a town"],
  [3, "Kje živi človeška ribica?|v jamskih vodah|v morju|na drevesu|v gnezdu", "Where does the olm live?|in cave waters|in the sea|in a tree|in a nest"],
  [3, "Netopir podnevi?|spi|lovi|odleti na jug|plava", "By day a bat?|sleeps|hunts|flies south|swims"],
  [3, "Kdo je nočna žival?|sova|vrabec|lastovka|veverica", "Which animal is active at night?|owl|sparrow|swallow|squirrel"],
  [3, "Kdo ima pozimi bel kožuh?|planinski zajec|lisica|medved|jež", "Who has a white coat in winter?|mountain hare|fox|bear|hedgehog"],
  [3, "Paglavec je mladič?|žabe|ribe|ptice|polža", "Which animal's young is a tadpole?|frog|fish|bird|snail"],
  [3, "Kako se brani jež?|se zvije v kroglo|zbeži na drevo|odplava|zakriči", "How does a hedgehog defend itself?|rolls into a ball|climbs a tree|swims away|screams"],
  [3, "Kaj naredi kača, ko raste?|se levi|dobi perje|odleti|dobi krila", "What does a snake do as it grows?|sheds its skin|grows feathers|flies away|grows wings"],
  [3, "Kdo lovi muhe v pajčevino?|pajek|krt|polž|jež", "Who catches flies in a web?|spider|mole|snail|hedgehog"],
  [3, "Kdo gradi jezove na rekah?|bober|krt|lisica|jež", "Who builds dams on rivers?|beaver|mole|fox|hedgehog"],
  [3, "Kdo lahko obrne glavo skoraj nazaj?|sova|zajec|riba|polž", "Who can turn its head almost all the way round?|owl|hare|fish|snail"],
]);

defBank("s_plants", "so_ziv", 2, "❦", "Rastline", "Plants", [
  [1, "Kateri del rastline je v zemlji?|korenina|cvet|list|plod", "Which plant part is in the soil?|root|flower|leaf|fruit"],
  [1, "Kaj rastlina potrebuje za rast?|vodo|sladkor|mleko|sol", "What does a plant need to grow?|water|sugar|milk|salt"],
  [1, "Iz česa zraste nova rastlina?|iz semena|iz kamna|iz peska|iz stekla", "What does a new plant grow from?|a seed|a stone|sand|glass"],
  [1, "Kateri del rastline obiskujejo čebele?|cvet|korenino|steblo|seme", "Which plant part do bees visit?|flower|root|stem|seed"],
  [1, "Kaj drži rastlino v zemlji?|korenina|cvet|list|plod", "What holds a plant in the ground?|root|flower|leaf|fruit"],
  [1, "Kaj nosi liste in cvetove?|steblo|korenina|seme|plod", "What holds up leaves and flowers?|stem|root|seed|fruit"],
  [1, "Kateri del jablane je jabolko?|plod|korenina|list|steblo", "Which part of an apple tree is an apple?|fruit|root|leaf|stem"],
  [1, "Kaj ima deblo?|drevo|trava|regrat|solata", "Which plant has a trunk?|tree|grass|dandelion|lettuce"],
  [1, "Kaj jeseni naredi listje mnogih dreves?|odpade|zraste na novo|zacveti|pomodri", "In autumn, leaves of many trees?|fall off|grow again|bloom|turn blue"],
  [1, "Kateri del korenja jemo?|korenino|cvet|list|seme", "Which part of a carrot do we eat?|root|flower|leaf|seed"],
  [1, "Kateri del solate jemo?|liste|korenine|cvetove|semena", "Which part of lettuce do we eat?|leaves|roots|flowers|seeds"],
  [1, "Kateri del češnje jemo?|plod|korenino|list|steblo", "Which part of a cherry tree do we eat?|fruit|root|leaf|stem"],
  [1, "Kaj iz zemlje vsrkava vodo?|korenina|cvet|plod|list", "What takes in water from the soil?|root|flower|fruit|leaf"],
  [2, "Kaj rastlina potrebuje poleg vode?|svetlobo|temo|sol|sladkor", "Besides water, a plant needs?|light|darkness|salt|sugar"],
  [2, "Rastlina v temi?|porumeni|bolj ozeleni|dobi več listov|bolj zacveti", "A plant kept in the dark?|turns yellow|gets greener|grows more leaves|blooms more"],
  [2, "Rastlina brez vode?|oveni|zraste|zacveti|ozeleni", "A plant without water?|wilts|grows|blooms|turns greener"],
  [2, "Seme vzklije, ko ima vodo in?|toploto|mraz|sol|sladkor", "A seed sprouts when it has water and?|warmth|frost|salt|sugar"],
  [2, "Iz katerega dela rastline nastane plod?|iz cveta|iz korenine|iz lista|iz stebla", "Which part turns into the fruit?|flower|root|leaf|stem"],
  [2, "Kaj imajo iglavci namesto listov?|iglice|cvetove|plodove|korenine", "What do conifers have instead of leaves?|needles|flowers|fruits|roots"],
  [2, "Katero drevo je iglavec?|smreka|hrast|bukev|lipa", "Which tree is a conifer?|spruce|oak|beech|lime"],
  [2, "Katero drevo je listavec?|bukev|smreka|jelka|bor", "Which tree is broadleaved?|beech|spruce|fir|pine"],
  [2, "Katero drevo pozimi ostane zeleno?|smreka|bukev|hrast|lipa", "Which tree stays green in winter?|spruce|beech|oak|lime"],
  [2, "Katero drevo ima želod?|hrast|bukev|smreka|lipa", "Which tree has acorns?|oak|beech|spruce|lime"],
  [2, "Katero drevo ima storže?|smreka|hrast|lipa|bukev", "Which tree has cones?|spruce|oak|lime|beech"],
  [2, "Kdaj cvetijo češnje?|spomladi|pozimi|jeseni|nikoli", "When do cherry trees blossom?|in spring|in winter|in autumn|never"],
  [2, "Iz semena najprej zraste?|kalček|cvet|plod|drevo", "What grows first from a seed?|a seedling|a flower|a fruit|a tree"],
  [3, "Kaj prenašajo čebele s cveta na cvet?|cvetni prah|liste|semena|vodo", "What do bees carry flower to flower?|pollen|leaves|seeds|water"],
  [3, "Kako se širijo semena regrata?|z vetrom|s polži|s krti|z ribami", "How do dandelion seeds spread?|by wind|by snails|by moles|by fish"],
  [3, "Kaj rastline dajejo zraku?|kisik|dim|prah|sol", "What do plants give to the air?|oxygen|smoke|dust|salt"],
  [3, "Kateri del krompirja jemo?|gomolj|cvet|list|plod", "Which part of a potato plant do we eat?|tuber|flower|leaf|fruit"],
  [3, "Kateri del cvetače jemo?|cvet|korenino|seme|steblo", "Which part of a cauliflower do we eat?|flower|root|seed|stem"],
  [3, "Kateri del graha jemo?|semena|korenine|cvetove|liste", "Which part of a pea plant do we eat?|seeds|roots|flowers|leaves"],
  [3, "Kateri del špinače jemo?|liste|korenine|cvetove|semena", "Which part of spinach do we eat?|leaves|roots|flowers|seeds"],
  [3, "Kaj je v jabolku?|semena|korenine|listi|cvetovi", "What is inside an apple?|seeds|roots|leaves|flowers"],
  [3, "Kje rad raste mah?|v vlažni senci|na vročem soncu|v suhem pesku|na snegu", "Where does moss like to grow?|damp and shady|in hot sun|in dry sand|on snow"],
  [3, "Rastlina na oknu se obrne proti?|svetlobi|steni|tlom|stropu", "A plant on a windowsill turns towards?|the light|the wall|the floor|the ceiling"],
  [3, "Kaj zraste iz želoda?|hrast|smreka|bukev|lipa", "What grows from an acorn?|oak|spruce|beech|lime"],
  [3, "Kaj storimo z neznanimi jagodami?|pustimo jih|pojemo jih|damo jih prijatelju|nesemo jih domov", "What do we do with unknown berries?|leave them|eat them|share them|take them home"],
]);

// Živali: [ime, skupina, pokrov telesa, število nog (null = ne sprašujemo)]
const GROUPS = { sesalec: "sesalec|mammal", ptica: "ptica|bird", riba: "riba|fish", zuz: "žuželka|insect", plaz: "plazilec|reptile", dvoz: "dvoživka|amphibian" };
const ANIM = [
  ["pes|dog", "sesalec", 4], ["krava|cow", "sesalec", 4], ["mačka|cat", "sesalec", 4], ["konj|horse", "sesalec", 4], ["zajec|hare", "sesalec", 4], ["srna|deer", "sesalec", 4],
  ["kokoš|hen", "ptica", 2], ["sinica|tit", "ptica", 2], ["vrabec|sparrow", "ptica", 2], ["sova|owl", "ptica", 2], ["raca|duck", "ptica", 2],
  ["postrv|trout", "riba", 0], ["krap|carp", "riba", 0], ["ščuka|pike", "riba", 0],
  ["mravlja|ant", "zuz", 6], ["čebela|bee", "zuz", 6], ["metulj|butterfly", "zuz", 6], ["muha|fly", "zuz", 6], ["kobilica|grasshopper", "zuz", 6], ["pikapolonica|ladybird", "zuz", 6],
  ["kuščar|lizard", "plaz", 4], ["kača|snake", "plaz", 0], ["želva|tortoise", "plaz", 4],
  ["žaba|frog", "dvoz", 4], ["močerad|salamander", "dvoz", 4],
  ["pajek|spider", null, 8],
];
const COVER = [
  ["sesalec", "Katera žival ima dlako?|Which animal has fur?"],
  ["ptica", "Katera žival ima perje?|Which animal has feathers?"],
  ["riba", "Katera žival ima plavuti?|Which animal has fins?"],
];
const GROUP_BANK = bank([
  [2, "Kdo mladiče hrani z mlekom?|krava|kokoš|žaba|riba", "Which animal feeds its young on milk?|cow|hen|frog|fish"],
  [2, "Kdo ima krila in perje?|ptica|riba|polž|mačka", "Who has wings and feathers?|bird|fish|snail|cat"],
  [2, "Kdo diha s škrgami?|riba|pes|kokoš|kača", "Which animal has gills?|fish|dog|hen|snake"],
  [2, "Kdo ima luske in plavuti?|riba|pes|kokoš|žaba", "Who has scales and fins?|fish|dog|hen|frog"],
  [3, "Katera žival ni žuželka?|pajek|mravlja|čebela|metulj", "Which animal is NOT an insect?|spider|ant|bee|butterfly"],
  [3, "Kaj je kit?|sesalec|riba|ptica|dvoživka", "What kind of animal is a whale?|mammal|fish|bird|amphibian"],
  [3, "Kaj je delfin?|sesalec|riba|plazilec|dvoživka", "What kind of animal is a dolphin?|mammal|fish|reptile|amphibian"],
  [3, "Kaj je netopir?|sesalec|ptica|žuželka|plazilec", "What kind of animal is a bat?|mammal|bird|insect|reptile"],
  [3, "Kaj je pingvin?|ptica|sesalec|riba|plazilec", "What kind of animal is a penguin?|bird|mammal|fish|reptile"],
  [3, "Kdo ima suho kožo z luskami?|kuščar|žaba|polž|mačka", "Who has dry, scaly skin?|lizard|frog|snail|cat"],
  [3, "Kdo ima golo, vlažno kožo?|žaba|kuščar|kokoš|mačka", "Who has bare, moist skin?|frog|lizard|hen|cat"],
  [3, "Kdo živi najprej v vodi, nato na kopnem?|žaba|riba|kokoš|krava", "Who lives first in water, then on land?|frog|fish|hen|cow"],
]);
def("s_groups", "so_ziv", 3, "{ }", "Skupine živali", "Animal groups", (t, ctx) => {
  const r = Math.random();
  if (t === 1) {
    if (r < 0.5) {
      const [g, q] = pick(COVER);
      return choose(ctx, tr(ctx, q), ANIM.filter((a) => a[1] === g).map((a) => a[0]), ANIM.filter((a) => a[1] && a[1] !== g && !(g === "sesalec" && a[1] === "zuz")).map((a) => a[0])); // žuželke so lahko dlakave
    }
    const a = pick(ANIM.filter((x) => [0, 2, 4, 6, 8].includes(x[2])));
    const nm = tr(ctx, a[0]);
    return out(L(ctx, `Koliko nog ima ${a[0].split("|")[0]}?`, `How many legs does ${an(nm)} have?`), String(a[2]), ["0", "2", "4", "6", "8"]);
  }
  if (t === 2 && r < 0.6) {
    const a = pick(ANIM.filter((x) => ["sesalec", "ptica", "riba", "zuz"].includes(x[1])));
    return out(L(ctx, `Kaj je ${a[0].split("|")[0]}?`, `What kind of animal is ${an(tr(ctx, a[0]))}?`), tr(ctx, GROUPS[a[1]]), ["sesalec", "ptica", "riba", "zuz"].map((k) => tr(ctx, GROUPS[k])));
  }
  if (t === 3 && r < 0.4) {
    const a = pick(ANIM.filter((x) => ["plaz", "dvoz"].includes(x[1])));
    return out(L(ctx, `Kaj je ${a[0].split("|")[0]}?`, `What kind of animal is ${an(tr(ctx, a[0]))}?`), tr(ctx, GROUPS[a[1]]), Object.keys(GROUPS).map((k) => tr(ctx, GROUPS[k])));
  }
  return GROUP_BANK(t, ctx);
});

// Razvojni krogi: [sl, en]
const CYCLES = [
  [["jajčece", "paglavec", "žabica", "žaba"], ["frogspawn", "tadpole", "froglet", "frog"]],
  [["jajčece", "gosenica", "buba", "metulj"], ["egg", "caterpillar", "pupa", "butterfly"]],
  [["jajce", "piščanec", "kokoš"], ["egg", "chick", "hen"]],
  [["seme", "kalček", "rastlina", "cvet", "plod"], ["seed", "seedling", "plant", "flower", "fruit"]],
  [["dojenček", "otrok", "najstnik", "odrasli"], ["baby", "child", "teenager", "adult"]],
  [["jajčece", "ličinka", "buba", "pikapolonica"], ["egg", "larva", "pupa", "ladybird"]],
  [["želod", "kalček", "mlado drevo", "hrast"], ["acorn", "seedling", "sapling", "oak"]],
  [["jajce", "raček", "raca"], ["egg", "duckling", "duck"]],
];
const PLANT_CYC = new Set([CYCLES[3], CYCLES[6]]); // želod je seme: rastlinska kroga se ne mešata
const CYCLE_BANK = bank([
  [1, "Mladič žabe je?|paglavec|gosenica|piščanec|buba", "What is a young frog called?|tadpole|caterpillar|chick|pupa"],
  [1, "Iz jajca metulja se izleže?|gosenica|paglavec|piščanec|kalček", "What hatches from a butterfly's egg?|caterpillar|tadpole|chick|seedling"],
  [1, "Mlada rastlina je?|kalček|paglavec|gosenica|buba", "What is a young plant called?|seedling|tadpole|caterpillar|pupa"],
  [1, "Kdo se izvali iz jajca?|piščanec|tele|mucek|žrebe", "Who hatches from an egg?|chick|calf|kitten|foal"],
  [1, "Pravkar rojen otrok je?|dojenček|najstnik|odrasli|starček", "What do we call a newborn person?|baby|teenager|grown-up|grandad"],
  [2, "Kdo se razvije iz bube?|metulj|žaba|piščanec|polž", "What comes out of a pupa?|butterfly|frog|chick|snail"],
  [2, "Kdo ne leže jajc?|krava|kokoš|žaba|metulj", "Who does NOT lay eggs?|cow|hen|frog|butterfly"],
  [2, "Kje živi paglavec?|v vodi|na drevesu|pod zemljo|v gnezdu", "Where does a tadpole live?|in water|in a tree|underground|in a nest"],
  [3, "Kaj paglavcu zraste najprej?|zadnje noge|krila|perje|sprednje noge", "What does a tadpole grow first?|back legs|wings|feathers|front legs"],
  [3, "Kaj paglavcu izgine?|rep|glava|oči|usta", "What does a tadpole lose?|its tail|its head|its eyes|its mouth"],
  [3, "Kaj počne buba?|miruje|veliko jé|leti|plava", "What does a pupa do?|keeps still|eats a lot|flies|swims"],
  [3, "Kaj gosenica počne največ?|jé|leti|plava|skače", "What does a caterpillar do most?|eats|flies|swims|jumps"],
  [3, "Kokoš vali jajca približno?|3 tedne|3 dni|3 mesece|3 leta", "A hen sits on eggs for about?|3 weeks|3 days|3 months|3 years"],
  [3, "Okoli 6. leta otrokom izpadajo?|mlečni zobje|nohti|obrvi|trepalnice", "Around age 6, children lose their?|baby teeth|nails|eyebrows|eyelashes"],
]);
def("s_cycle", "so_ziv", 3, "↻", "Rast in razvoj", "Growth and life cycles", (t, ctx) => {
  if (Math.random() < 0.55) {
    const c = pick(CYCLES), ch = ctx.lang === "sl" ? c[0] : c[1];
    const egg = /jaj|egg|spawn/;
    let others = CYCLES.filter((x) => x !== c && !(PLANT_CYC.has(x) && PLANT_CYC.has(c))).flatMap((x) => (ctx.lang === "sl" ? x[0] : x[1]));
    // stopnja 1: manjka zadnji člen; 2: manjka vmesni; 3: katerega manjka kjerkoli (tudi prvi)
    const i = t === 1 ? ch.length - 1 : t === 2 ? R(1, ch.length - 2) : R(0, ch.length - 1);
    if (egg.test(ch[i])) others = others.filter((x) => !egg.test(x));
    // gosenica in paglavec sta tudi ličinki
    others = others.filter((x) => !/ličinka|larva/.test(x));
    const shown = ch.map((x, j) => (j === i ? "?" : x)).join(" → ");
    // krog se sklene (cvet → seme), zato prvi člen ni napačen za zadnjega
    if (shown.length <= 60) return out(shown, ch[i], [...ch.filter((_, j) => j !== i && !(j === 0 && i === ch.length - 1)), ...shuffle(others).slice(0, 5)]);
  }
  return CYCLE_BANK(t, ctx);
});

// =====================================================================
// ČAS IN VREME
// =====================================================================
const DAYS = ["ponedeljek|Monday", "torek|Tuesday", "sreda|Wednesday", "četrtek|Thursday", "petek|Friday", "sobota|Saturday", "nedelja|Sunday"];
const DAYS_ACC = ["v ponedeljek|on Monday", "v torek|on Tuesday", "v sredo|on Wednesday", "v četrtek|on Thursday", "v petek|on Friday", "v soboto|on Saturday", "v nedeljo|on Sunday"];
const WEEK_BANK = bank([
  [1, "Koliko dni ima teden?|7|5|10|12", "How many days are in a week?|7|5|10|12"],
  [1, "Kateri je prvi dan v tednu?|ponedeljek|nedelja|sreda|petek", "Which day starts the school week?|Monday|Sunday|Wednesday|Friday"],
  [1, "Kdaj zajtrkujemo?|zjutraj|zvečer|ponoči|popoldne", "When do we have breakfast?|in the morning|in the evening|at night|in the afternoon"],
  [1, "Kdaj spimo?|ponoči|opoldne|dopoldne|popoldne", "When do we sleep?|at night|at noon|in the morning|in the afternoon"],
  [1, "Kdaj večerjamo?|zvečer|zjutraj|dopoldne|opoldne", "When do we have dinner?|in the evening|in the morning|before noon|at noon"],
  [1, "Kdaj sonce vzide?|zjutraj|zvečer|opoldne|ponoči", "When does the Sun rise?|in the morning|in the evening|at noon|at night"],
  [2, "Kdaj sonce zaide?|zvečer|zjutraj|opoldne|dopoldne", "When does the Sun set?|in the evening|in the morning|at noon|before noon"],
  [2, "Kateri dan je sredi tedna?|sreda|ponedeljek|sobota|nedelja", "Which day is in the middle of the week?|Wednesday|Monday|Saturday|Sunday"],
  [2, "Kateri je zadnji dan v tednu?|nedelja|ponedeljek|petek|sreda", "Which day ends the weekend?|Sunday|Monday|Friday|Wednesday"],
  [2, "Koliko dni v tednu gremo v šolo?|5|7|2|3", "How many days a week do we go to school?|5|7|2|3"],
  [3, "Kdaj je sonce najvišje na nebu?|opoldne|zjutraj|zvečer|ponoči", "When is the Sun highest in the sky?|at noon|in the morning|in the evening|at night"],
  [3, "Koliko dni ima vikend?|2|1|3|5", "How many days are in a weekend?|2|1|3|5"],
]);
def("s_week", "so_cas", 1, "7", "Dnevi v tednu", "Days of the week", (t, ctx) => {
  if (Math.random() < 0.25) return WEEK_BANK(t, ctx);
  const d = R(0, 6), D = (k) => tr(ctx, DAYS[(((d + k) % 7) + 7) % 7]);
  const today = L(ctx, `Danes je ${D(0)}.`, `Today is ${D(0)}.`);
  if (t === 1) {
    if (Math.random() < 0.3) {
      const k = pick([5, 6]);
      return out(L(ctx, "Kdaj ne gremo v šolo?", "When is there no school?"), tr(ctx, DAYS_ACC[k]), DAYS_ACC.slice(0, 5).map((x) => tr(ctx, x)));
    }
    return out(`${today} ${L(ctx, "Kateri dan bo jutri?", "What day is tomorrow?")}`, D(1), [D(-1), D(2), D(0), D(3)]);
  }
  if (t === 2) return out(`${today} ${L(ctx, "Kateri dan je bil včeraj?", "What day was yesterday?")}`, D(-1), [D(1), D(-2), D(0), D(2)]);
  const k = pick([2, -2, 7, 3]);
  const q = { 2: L(ctx, "Kateri dan bo pojutrišnjem?", "What day is the day after tomorrow?"), [-2]: L(ctx, "Kateri dan je bil predvčerajšnjim?", "What day was the day before yesterday?"), 7: L(ctx, "Kateri dan bo čez en teden?", "What day is it in one week?"), 3: L(ctx, "Kateri dan bo čez 3 dni?", "What day is it in 3 days?") }[k];
  return out(`${today} ${q}`, D(k), [D(k + 1), D(k - 1), D(-k), D(k + 2), D(k - 2), D(1)]);
});

const SEASONS = ["pomlad|spring", "poletje|summer", "jesen|autumn", "zima|winter"];
const SEASON_DAT = ["pomladi", "poletju", "jeseni", "zimi"]; // sledi komu?
const SEASON_INS = ["pomladjo", "poletjem", "jesenjo", "zimo"]; // pred čim?
const SEASON_BANK = bank([
  [1, "Kdaj se sankamo?|pozimi|poleti|spomladi|jeseni", "When do we go sledging?|in winter|in summer|in spring|in autumn"],
  [1, "Kdaj gradimo sneženega moža?|pozimi|poleti|spomladi|jeseni", "When do we build a snowman?|in winter|in summer|in spring|in autumn"],
  [1, "Kdaj se kopamo v morju?|poleti|pozimi|jeseni|spomladi", "When do we swim in the sea?|in summer|in winter|in autumn|in spring"],
  [1, "Kdaj z dreves odpada listje?|jeseni|spomladi|poleti|pozimi", "When do leaves fall from trees?|in autumn|in spring|in summer|in winter"],
  [1, "Kdaj cvetijo češnje?|spomladi|pozimi|jeseni|poleti", "When do cherry trees blossom?|in spring|in winter|in autumn|in summer"],
  [1, "Kdaj trgamo grozdje?|jeseni|spomladi|pozimi|poleti", "When are grapes picked?|in autumn|in spring|in winter|in summer"],
  [1, "Kdaj se vrnejo lastovke?|spomladi|jeseni|pozimi|poleti", "When do swallows come back?|in spring|in autumn|in winter|in summer"],
  [1, "Kdaj je najbolj vroče?|poleti|pozimi|spomladi|jeseni", "When is it hottest?|in summer|in winter|in spring|in autumn"],
  [1, "Kdaj je najbolj mrzlo?|pozimi|poleti|spomladi|jeseni", "When is it coldest?|in winter|in summer|in spring|in autumn"],
  [1, "Kdaj je božič?|pozimi|poleti|spomladi|jeseni", "When is Christmas?|in winter|in summer|in spring|in autumn"],
  [1, "Kdaj nabiramo kostanj?|jeseni|spomladi|poleti|pozimi", "When do we gather chestnuts?|in autumn|in spring|in summer|in winter"],
  [1, "Kdaj drevesa dobijo nove liste?|spomladi|jeseni|pozimi|poleti", "When do trees get new leaves?|in spring|in autumn|in winter|in summer"],
  [2, "Koliko letnih časov ima leto?|4|2|3|12", "How many seasons are in a year?|4|2|3|12"],
  [2, "Kdaj nosimo kapo in rokavice?|pozimi|poleti|vedno|nikoli", "When do we wear a hat and gloves?|in winter|in summer|always|never"],
  [2, "Kdaj so dnevi najdaljši?|poleti|pozimi|spomladi|jeseni", "When are the days longest?|in summer|in winter|in spring|in autumn"],
  [2, "Kdaj so dnevi najkrajši?|pozimi|poleti|spomladi|jeseni", "When are the days shortest?|in winter|in summer|in spring|in autumn"],
  [2, "Kdaj na vrtu začnemo sejati?|spomladi|pozimi|ko sneži|nikoli", "When do we start sowing in the garden?|in spring|in winter|when it snows|never"],
  [2, "Kdaj žanjejo pšenico?|poleti|pozimi|spomladi|nikoli", "When is wheat harvested?|in summer|in winter|in spring|never"],
  [3, "V katerem mesecu se začne pomlad?|marec|junij|september|december", "In which month does spring begin?|March|June|September|December"],
  [3, "V katerem mesecu se začne poletje?|junij|marec|september|december", "In which month does summer begin?|June|March|September|December"],
  [3, "V katerem mesecu se začne jesen?|september|marec|junij|december", "In which month does autumn begin?|September|March|June|December"],
  [3, "V katerem mesecu se začne zima?|december|marec|junij|september", "In which month does winter begin?|December|March|June|September"],
  [3, "Kaj se jeseni dogaja z dnevi?|krajšajo se|daljšajo se|ostanejo enaki|izginejo", "What happens to days in autumn?|they get shorter|they get longer|they stay the same|they vanish"],
  [3, "Kaj se spomladi dogaja z dnevi?|daljšajo se|krajšajo se|ostanejo enaki|izginejo", "What happens to days in spring?|they get longer|they get shorter|they stay the same|they vanish"],
  [3, "Kdaj sta dan in noč enako dolga?|ob začetku pomladi|ob začetku poletja|ob začetku zime|nikoli", "When are day and night equally long?|start of spring|start of summer|start of winter|never"],
  [3, "Kdaj ptice selivke odletijo?|jeseni|spomladi|poleti|nikoli", "When do migrating birds fly away?|in autumn|in spring|in summer|never"],
]);
def("s_seasons", "so_cas", 1, "◐", "Letni časi", "Seasons", (t, ctx) => {
  if (t > 1 && Math.random() < 0.4) {
    const i = R(0, 3), next = Math.random() < 0.5;
    const S = (k) => tr(ctx, SEASONS[(k + 4) % 4]);
    const q = next
      ? L(ctx, `Kateri letni čas sledi ${SEASON_DAT[i]}?`, `Which season comes after ${S(i)}?`)
      : L(ctx, `Kateri letni čas je pred ${SEASON_INS[i]}?`, `Which season comes before ${S(i)}?`);
    return out(q, S(next ? i + 1 : i - 1), SEASONS.map((x) => tr(ctx, x)));
  }
  return SEASON_BANK(t, ctx);
});

const MONTHS = ["januar|January", "februar|February", "marec|March", "april|April", "maj|May", "junij|June", "julij|July", "avgust|August", "september|September", "oktober|October", "november|November", "december|December"];
const M_DAT = ["januarju", "februarju", "marcu", "aprilu", "maju", "juniju", "juliju", "avgustu", "septembru", "oktobru", "novembru", "decembru"];
const M_INS = ["januarjem", "februarjem", "marcem", "aprilom", "majem", "junijem", "julijem", "avgustom", "septembrom", "oktobrom", "novembrom", "decembrom"];
const M_GEN = ["januarja", "februarja", "marca", "aprila", "maja", "junija", "julija", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
const M_DAYS = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const M_SEASON = { 0: 3, 1: 3, 3: 0, 4: 0, 6: 1, 7: 1, 9: 2, 10: 2 }; // samo nedvoumni meseci
const MONTH_BANK = bank([
  [1, "Koliko mesecev ima leto?|12|10|7|24", "How many months are in a year?|12|10|7|24"],
  [1, "Kateri je prvi mesec v letu?|januar|december|marec|september", "Which is the first month of the year?|January|December|March|September"],
  [1, "Kateri je zadnji mesec v letu?|december|januar|november|junij", "Which is the last month of the year?|December|January|November|June"],
  [2, "Kateri mesec je najkrajši?|februar|januar|avgust|december", "Which month is the shortest?|February|January|August|December"],
  [2, "Kdaj je novo leto?|1. januarja|31. januarja|1. junija|25. decembra", "When is New Year's Day?|1 January|31 January|1 June|25 December"],
  [2, "Kdaj je božič?|25. decembra|1. januarja|25. junija|1. decembra", "When is Christmas Day?|25 December|1 January|25 June|1 December"],
  [3, "Kateri mesec ima 28 ali 29 dni?|februar|januar|april|december", "Which month has 28 or 29 days?|February|January|April|December"],
  [3, "Koliko dni ima prestopno leto?|366|365|360|300", "How many days in a leap year?|366|365|360|300"],
]);
def("s_months", "so_cas", 2, "12", "Meseci", "Months", (t, ctx) => {
  if (Math.random() < 0.2) return MONTH_BANK(t, ctx);
  const m = R(0, 11), M = (k) => tr(ctx, MONTHS[(((m + k) % 12) + 12) % 12]);
  if (t === 1) return out(L(ctx, `Kateri mesec sledi ${M_DAT[m]}?`, `Which month comes after ${M(0)}?`), M(1), [M(-1), M(2), M(0), M(3)]);
  if (t === 2) {
    if (Math.random() < 0.4) {
      const k = +pick(Object.keys(M_SEASON));
      return out(L(ctx, `Kateri letni čas je ${M_GEN[k]}?`, `Which season is ${tr(ctx, MONTHS[k])} in?`), tr(ctx, SEASONS[M_SEASON[k]]), SEASONS.map((x) => tr(ctx, x)));
    }
    return out(L(ctx, `Kateri mesec je pred ${M_INS[m]}?`, `Which month comes before ${M(0)}?`), M(-1), [M(1), M(-2), M(0), M(2)]);
  }
  if (Math.random() < 0.4) {
    const k = pick([0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    return out(L(ctx, `Koliko dni ima ${MONTHS[k].split("|")[0]}?`, `How many days are in ${tr(ctx, MONTHS[k])}?`), String(M_DAYS[k]), ["28", "29", "30", "31", "32"].filter((x) => x !== String(M_DAYS[k])));
  }
  const k = pick([2, 3, 4, 5, 6]);
  const unit = { 2: "meseca", 3: "mesece", 4: "mesece", 5: "mesecev", 6: "mesecev" }[k];
  return out(L(ctx, `Zdaj je ${M(0)}. Kateri mesec bo čez ${k} ${unit}?`, `It is ${M(0)}. Which month is it in ${k} months?`), M(k), [M(k + 1), M(k - 1), M(-k), M(k + 2)]);
});

defBank("s_weather", "so_cas", 2, "°C", "Vreme", "Weather", [
  [1, "Kaj pada iz oblakov?|dež|listje|pesek|kamenje", "What falls from the clouds?|rain|leaves|sand|stones"],
  [1, "Kaj pozimi pada iz oblakov?|sneg|listje|cvetje|pesek", "What falls from clouds in winter?|snow|leaves|flowers|sand"],
  [1, "Kaj vzamemo s seboj, ko dežuje?|dežnik|sončna očala|kopalke|sanke", "What do we take when it rains?|an umbrella|sunglasses|a swimsuit|a sledge"],
  [1, "Dež in sonce hkrati. Kaj vidimo?|mavrico|sneg|meglo|točo", "Rain and sun together. What do we see?|a rainbow|snow|fog|hail"],
  [1, "Kaj vidimo med nevihto?|blisk|sneg|zvezde|slano", "What do we see in a thunderstorm?|lightning|snow|stars|frost"],
  [1, "Kaj slišimo med nevihto?|grom|šepet|zvonjenje|mijavkanje", "What do we hear in a thunderstorm?|thunder|a whisper|bells|meowing"],
  [1, "Kaj kaže termometer?|temperaturo|uro|veter|dež", "What does a thermometer show?|temperature|the time|the wind|the rain"],
  [1, "Kaj premika liste na drevju?|veter|sneg|sonce|megla", "What moves the leaves on trees?|wind|snow|sun|fog"],
  [1, "Kaj nas podnevi ogreva?|sonce|luna|oblak|veter", "What warms us in the daytime?|the Sun|the Moon|a cloud|the wind"],
  [1, "Ko je zelo mraz, voda?|zmrzne|zavre|izgine|se segreje", "When it's very cold, water?|freezes|boils|disappears|warms up"],
  [1, "Kakšno je vreme, ko ni oblakov?|jasno|oblačno|deževno|megleno", "What's the weather with no clouds?|clear|cloudy|rainy|foggy"],
  [1, "Kaj oblečemo, ko je mraz?|bundo|kopalke|kratke hlače|sandale", "What do we wear when it's cold?|a warm coat|a swimsuit|shorts|sandals"],
  [1, "Kaj oblečemo, ko dežuje?|dežni plašč|kopalke|sandale|slamnik", "What do we wear when it rains?|a raincoat|a swimsuit|sandals|a straw hat"],
  [2, "Iz česa je toča?|iz ledu|iz peska|iz kamna|iz lesa", "What is hail made of?|ice|sand|stone|wood"],
  [2, "Kaj je megla?|oblak pri tleh|dim|sneg|dež", "What is fog?|a low cloud|smoke|snow|rain"],
  [2, "Kaj kaže smer vetra?|vetrokaz|termometer|ura|tehtnica", "What shows the wind's direction?|a weather vane|a thermometer|a clock|scales"],
  [2, "Kaj je jutranja rosa na travi?|kapljice vode|sneg|led|mleko", "What is morning dew on grass?|water drops|snow|ice|milk"],
  [2, "Bela plast ledu na travi pozimi je?|slana|rosa|megla|toča", "A white layer of ice on winter grass?|frost|dew|fog|hail"],
  [2, "Snežak na soncu?|se stopi|zmrzne|zraste|potemni", "A snowman in the sun?|melts|freezes|grows|turns dark"],
  [2, "Kdaj je nevarno stati pod drevesom?|med nevihto|ko sije sonce|ko sneži|ko je megla", "When is it dangerous to stand under a tree?|in a thunderstorm|when sunny|when snowing|when foggy"],
  [2, "Znak: oblak s kapljicami pomeni?|dež|sonce|sneg|veter", "Symbol: cloud with drops means?|rain|sun|snow|wind"],
  [2, "Znak: oblak s snežinkami pomeni?|sneg|dež|sonce|veter", "Symbol: cloud with snowflakes means?|snow|rain|sun|wind"],
  [2, "Znak: sonce za oblakom pomeni?|delno oblačno|jasno|dež|sneg", "Symbol: sun behind a cloud means?|partly cloudy|clear|rain|snow"],
  [2, "Termometer kaže 30 °C. Kakšno je vreme?|vroče|mrzlo|ledeno|zmrzuje", "The thermometer shows 30 °C. It is?|hot|cold|icy|freezing"],
  [2, "Termometer kaže −5 °C. Kakšno je vreme?|mrzlo|vroče|toplo|za kopanje", "The thermometer shows −5 °C. It is?|cold|hot|warm|swimming weather"],
  [3, "Iz česa so oblaki?|iz vodnih kapljic|iz dima|iz vate|iz peska", "What are clouds made of?|water droplets|smoke|cotton wool|sand"],
  [3, "Zakaj štejemo od bliska do groma?|za razdaljo nevihte|za uro|za temperaturo|za veter", "Why count from lightning to thunder?|how far the storm is|to tell the time|for temperature|for the wind"],
  [3, "Kaj meri dežemer?|količino dežja|veter|temperaturo|oblake", "What does a rain gauge measure?|rainfall|wind|temperature|clouds"],
  [3, "Kdaj so pri nas nevihte najpogostejše?|poleti|pozimi|jeseni|spomladi", "When are thunderstorms most common here?|in summer|in winter|in autumn|in spring"],
  [3, "Kam se med nevihto ne skrijemo?|pod visoko drevo|v hišo|v avto|v šolo", "Where should we NOT shelter in a storm?|under a tall tree|in a house|in a car|in a school"],
  [3, "Zelo močan veter je?|vihar|rosa|slana|megla", "What is a very strong wind called?|a gale|dew|frost|fog"],
  [3, "Kje v Sloveniji piha burja?|na Primorskem|v Prekmurju|na Koroškem|na Dolenjskem", "Where does the bora wind blow?|Primorska|Prekmurje|Koroška|Dolenjska"],
  [3, "Kdo pripravlja vremensko napoved?|meteorologi|zdravniki|kuharji|piloti", "Who makes weather forecasts?|meteorologists|doctors|cooks|pilots"],
  [3, "Kje se perilo najhitreje posuši?|na soncu in vetru|v temni kleti|v hladilniku|v vrečki", "Where does washing dry fastest?|in sun and wind|in a dark cellar|in a fridge|in a bag"],
  [3, "Kaj pomeni −10 °C?|10 °C pod ničlo|10 °C nad ničlo|0 °C|100 °C", "What does −10 °C mean?|10 °C below zero|10 °C above zero|0 °C|100 °C"],
]);

const TIME_BANK = bank([
  [1, "Koliko dni ima teden?|7|5|10|12", "How many days are in a week?|7|5|10|12"],
  [1, "Koliko ur ima dan?|24|12|10|60", "How many hours are in a day?|24|12|10|60"],
  [1, "Koliko mesecev ima leto?|12|10|24|7", "How many months are in a year?|12|10|24|7"],
  [1, "Koliko minut ima ura?|60|100|24|30", "How many minutes are in an hour?|60|100|24|30"],
  [1, "Koliko sekund ima minuta?|60|100|10|30", "How many seconds are in a minute?|60|100|10|30"],
  [1, "Koliko dni ima leto?|365|100|12|52", "How many days are in a year?|365|100|12|52"],
  [1, "Katera naprava meri čas?|ura|termometer|tehtnica|ravnilo", "Which device measures time?|a clock|a thermometer|scales|a ruler"],
  [1, "Kaj meri čas teka?|štoparica|termometer|tehtnica|meter", "What times a race?|a stopwatch|a thermometer|scales|a tape measure"],
  [1, "Kaj pokaže dneve in mesece v letu?|koledar|ura|termometer|kompas", "What shows the days and months?|a calendar|a clock|a thermometer|a compass"],
  [1, "Kaj traja najdlje?|leto|mesec|teden|dan", "Which lasts the longest?|a year|a month|a week|a day"],
  [1, "Kaj traja najmanj časa?|sekunda|minuta|ura|dan", "Which is the shortest time?|a second|a minute|an hour|a day"],
  [1, "Kaj traja dlje kot minuta?|ura|sekunda|trenutek|pol minute", "Which lasts longer than a minute?|an hour|a second|a moment|half a minute"],
  [2, "Koliko minut je pol ure?|30|50|15|60", "How many minutes in half an hour?|30|50|15|60"],
  [2, "Koliko minut je četrt ure?|15|25|10|45", "How many minutes in a quarter of an hour?|15|25|10|45"],
  [2, "Koliko minut so tri četrt ure?|45|30|75|40", "How many minutes in three quarters of an hour?|45|30|75|40"],
  [2, "Koliko dni imata 2 tedna?|14|7|12|20", "How many days are in 2 weeks?|14|7|12|20"],
  [2, "Koliko dni imajo 3 tedni?|21|14|30|10", "How many days are in 3 weeks?|21|14|30|10"],
  [2, "Koliko ur imata 2 dneva?|48|24|12|36", "How many hours are in 2 days?|48|24|12|36"],
  [2, "Koliko mesecev je pol leta?|6|5|12|3", "How many months is half a year?|6|5|12|3"],
  [2, "Odmor med šolskima urama traja približno?|5 minut|5 ur|5 dni|5 sekund", "A short break between lessons lasts about?|5 minutes|5 hours|5 days|5 seconds"],
  [2, "Nočno spanje otroka traja približno?|10 ur|10 minut|10 dni|10 sekund", "A child's night sleep lasts about?|10 hours|10 minutes|10 days|10 seconds"],
  [2, "Umivanje zob traja približno?|2 minuti|2 uri|2 dneva|2 sekundi", "Brushing teeth takes about?|2 minutes|2 hours|2 days|2 seconds"],
  [2, "Poletne počitnice trajajo približno?|2 meseca|2 dneva|2 uri|2 minuti", "Summer holidays last about?|2 months|2 days|2 hours|2 minutes"],
  [2, "Kar je bilo včeraj, je?|preteklost|prihodnost|sedanjost|nikoli", "What happened yesterday is the?|past|future|present|never"],
  [2, "Kar bo jutri, je?|prihodnost|preteklost|sedanjost|nikoli", "What will happen tomorrow is the?|future|past|present|never"],
  [3, "Koliko tednov ima leto?|52|12|365|100", "How many weeks are in a year?|52|12|365|100"],
  [3, "Koliko let je desetletje?|10|100|12|1000", "How many years in a decade?|10|100|12|1000"],
  [3, "Koliko let je stoletje?|100|10|1000|50", "How many years in a century?|100|10|1000|50"],
  [3, "Pojutrišnjem je čez koliko dni?|2|1|3|7", "The day after tomorrow is in how many days?|2|1|3|7"],
  [3, "Predvčerajšnjim je bilo pred koliko dnevi?|2|1|3|7", "The day before yesterday was how many days ago?|2|1|3|7"],
  [3, "Kar se dogaja zdaj, je?|sedanjost|preteklost|prihodnost|nikoli", "What is happening now is the?|present|past|future|never"],
]);
def("s_timeunits", "so_cas", 3, "◷", "Merjenje časa", "Measuring time", (t, ctx) => {
  if (t === 3 && Math.random() < 0.5) {
    if (Math.random() < 0.5) {
      const h = R(7, 16), d = R(2, 4), u = { 2: "uri", 3: "ure", 4: "ure" }[d];
      return out(L(ctx, `Ura je ${h}.00. Koliko bo ura čez ${d} ${u}?`, `It is ${h}:00. What time is it in ${d} hours?`), L(ctx, `${h + d}.00`, `${h + d}:00`),
        [h + d + 1, h + d - 1, h - d, h + d * 2].filter((x) => x > 0 && x < 24).map((x) => L(ctx, `${x}.00`, `${x}:00`)));
    }
    const h = R(7, 16);
    return out(L(ctx, `Ura je ${h}.30. Koliko bo ura čez pol ure?`, `It is ${h}:30. What time is it in half an hour?`), L(ctx, `${h + 1}.00`, `${h + 1}:00`),
      [`${h}.00`, `${h}.60`, `${h + 1}.30`, `${h}.45`].map((x) => (ctx.lang === "sl" ? x : x.replace(".", ":"))));
  }
  return TIME_BANK(t, ctx);
});

// =====================================================================
// SNOVI IN POJAVI
// =====================================================================
// Predmeti po teži: razredi se razlikujejo za velikostni red, zato je primerjava nedvoumna.
const WEIGHT = [
  ["pero|feather", "suh list|dry leaf"],
  ["jabolko|apple", "pomaranča|orange"],
  ["opeka|brick", "polna šolska torba|full school bag"],
  ["pralni stroj|washing machine"],
  ["avto|car", "konj|horse"],
  ["slon|elephant", "tovornjak|lorry"],
];
const MATERIAL_BANK = bank([
  [1, "Kaj je prozorno?|steklo|les|kamen|karton|opeka", "Which is see-through?|glass|wood|stone|cardboard|brick"],
  [1, "Kaj je mehko?|blazina|kamen|žebelj|opeka|kozarec", "Which is soft?|a pillow|a stone|a nail|a brick|a glass"],
  [1, "Kaj je trdo?|kamen|blazina|vata|volna|perje", "Which is hard?|a stone|a pillow|cotton wool|wool|feathers"],
  [1, "Kaj se lahko raztegne?|elastika|kamen|steklo|svinčnik", "Which can stretch?|a rubber band|a stone|glass|a pencil"],
  [1, "Kaj se razbije, če pade?|kozarec|žoga|plišasti medvedek|nogavica", "What breaks if it falls?|a glass|a ball|a teddy bear|a sock"],
  [1, "Kaj je gladko na dotik?|ogledalo|brusni papir|lubje|krtača", "Which feels smooth?|a mirror|sandpaper|tree bark|a brush"],
  [1, "Kaj je hrapavo?|brusni papir|ogledalo|okno|svila", "Which feels rough?|sandpaper|a mirror|a window|silk"],
  [1, "Kaj je tekoče?|mleko|kamen|les|kruh", "Which is a liquid?|milk|a stone|wood|bread"],
  [1, "Kaj je narejeno iz lesa?|deska|kozarec|ključ|kovanec", "Which is made of wood?|a plank|a glass|a key|a coin"],
  [1, "Kaj je narejeno iz papirja?|zvezek|žebelj|kozarec|nogavica", "Which is made of paper?|a notebook|a nail|a glass|a sock"],
  [1, "Kaj je narejeno iz kovine?|ključ|zvezek|nogavica|deska", "Which is made of metal?|a key|a notebook|a sock|a plank"],
  [1, "Kaj je narejeno iz blaga?|majica|žlica|kozarec|ključ", "Which is made of fabric?|a T-shirt|a spoon|a glass|a key"],
  [2, "Kaj se stopi na soncu?|sladoled|kamen|ključ|les", "What melts in the sun?|ice cream|a stone|a key|wood"],
  [2, "Kaj zgori v ognju?|papir|kamen|steklo|pesek", "What burns in a fire?|paper|stone|glass|sand"],
  [2, "Kaj vpija vodo?|brisača|plastična vrečka|steklo|ključ", "What soaks up water?|a towel|a plastic bag|glass|a key"],
  [2, "Kaj ne prepušča vode?|dežnik|brisača|nogavica|papir", "What keeps water out?|an umbrella|a towel|a sock|paper"],
  [2, "Kaj odskoči od tal?|gumijasta žoga|kamen|opeka|jajce", "What bounces off the floor?|a rubber ball|a stone|a brick|an egg"],
  [2, "Kaj zarjavi?|železo|plastika|steklo|les", "What goes rusty?|iron|plastic|glass|wood"],
  [2, "Kaj se upogne in ne zlomi?|guma|steklo|kreda|piškot", "What bends without breaking?|rubber|glass|chalk|a biscuit"],
  [2, "Kaj je najbolj prožno?|elastika|kamen|kovanec|kocka sladkorja", "Which is the most stretchy?|a rubber band|a stone|a coin|a sugar cube"],
  [3, "Iz česa je papir?|iz lesa|iz kamna|iz mleka|iz stekla", "What is paper made from?|wood|stone|milk|glass"],
  [3, "Iz česa je steklo?|iz peska|iz lesa|iz volne|iz papirja", "What is glass made from?|sand|wood|wool|paper"],
  [3, "Od katere živali je volna?|od ovce|od krave|od kokoši|od čebele", "Which animal gives us wool?|sheep|cow|hen|bee"],
  [3, "Iz česa je usnje?|iz živalske kože|iz lesa|iz peska|iz nafte", "What is leather made from?|animal skin|wood|sand|oil"],
  [3, "Iz česa je plastika?|iz nafte|iz lesa|iz peska|iz volne", "What is plastic made from?|oil|wood|sand|wool"],
  [3, "Iz česa je bombaž?|iz rastline|iz ovce|iz nafte|iz kamna", "Where does cotton come from?|a plant|a sheep|oil|a rock"],
  [3, "Iz česa je opeka?|iz gline|iz lesa|iz papirja|iz volne", "What is a brick made from?|clay|wood|paper|wool"],
  [3, "Kdo naredi svilo za blago?|sviloprejka|ovca|krava|kokoš", "Who makes silk for cloth?|silkworm|sheep|cow|hen"],
  [3, "Kaj odvržemo med papir?|časopis|plastenko|olupek|konzervo", "What goes in the paper bin?|a newspaper|a plastic bottle|a peel|a tin can"],
  [3, "Kaj odvržemo med embalažo?|plastenko|časopis|olupek|kost", "What goes in the packaging bin?|a plastic bottle|a newspaper|a peel|a bone"],
  [3, "Kam gre bananin olupek?|med biološke odpadke|med papir|med steklo|med embalažo", "Where does a banana peel go?|food waste bin|paper bin|glass bin|packaging bin"],
]);
def("s_material", "so_snov", 1, "◧", "Lastnosti snovi", "Properties of materials", (t, ctx) => {
  if (t === 1 && Math.random() < 0.35) {
    const cls = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 4).sort((a, b) => a - b);
    const items = cls.map((c) => tr(ctx, pick(WEIGHT[c])));
    const heavy = Math.random() < 0.5;
    return out(heavy ? L(ctx, "Kaj je najtežje?", "Which is the heaviest?") : L(ctx, "Kaj je najlažje?", "Which is the lightest?"), heavy ? items[3] : items[0], heavy ? items.slice(0, 3) : items.slice(1));
  }
  return MATERIAL_BANK(t, ctx);
});

const FLOATS = ["plutovinast zamašek|cork", "suh list|dry leaf", "kos lesa|piece of wood", "pero|feather", "napihnjena žoga|blown-up ball", "plastična raca|rubber duck", "stiropor|polystyrene", "jabolko|apple", "kocka ledu|ice cube", "prazna plastenka|empty bottle"];
const SINKS = ["kamen|stone", "žebelj|nail", "ključ|key", "kovanec|coin", "frnikola|marble", "sponka|paper clip", "kovinska žlica|metal spoon"];
const DISSOLVES = ["sladkor|sugar", "sol|salt", "kocka sladkorja|sugar cube"];
const NOT_DISSOLVES = ["pesek|sand", "kamenček|pebble", "olje|oil", "riž|rice", "žebelj|nail", "plastelin|plasticine"];
const FLOAT_BANK = bank([
  [3, "Plastelin v kepi potone. Kot čolniček?|plava|potone|se stopi|zgori", "A plasticine ball sinks. Shaped as a boat?|floats|sinks|melts|burns"],
  [3, "Zamašek potisnemo pod vodo in spustimo. Kaj naredi?|priplava gor|ostane spodaj|se raztopi|se razbije", "We push a cork under and let go. It?|pops back up|stays down|dissolves|breaks"],
  [3, "Sveže jajce v navadni vodi?|potone|plava|se raztopi|poči", "A fresh egg in tap water?|sinks|floats|dissolves|cracks"],
  [3, "Jajce v zelo slani vodi?|plava|potone|se skuha|poči", "An egg in very salty water?|floats|sinks|boils|cracks"],
  [1, "Kaj nam pomaga plavati v bazenu?|rokavčki|kamen|težka torba|škornji", "What helps us float in a pool?|armbands|a stone|a heavy bag|boots"],
  [1, "Kaj se zgodi z zamaškom v vodi?|plava|potone|se raztopi|zgori", "What happens to a cork in water?|it floats|it sinks|it dissolves|it burns"],
  [1, "Kaj se zgodi s kovancem v vodi?|potone|plava|se raztopi|zgori", "What happens to a coin in water?|it sinks|it floats|it dissolves|it burns"],
  [3, "V kateri vodi se sladkor hitreje raztopi?|v topli|v hladni|v ledeni|v zmrznjeni", "Sugar dissolves faster in which water?|warm|cold|icy|frozen"],
  [3, "Kako hitreje raztopimo sladkor?|z mešanjem|s pihanjem|z zamrzovanjem|v hladilniku", "How do we dissolve sugar faster?|by stirring|by blowing|by freezing|in the fridge"],
  [3, "Sladkor v vodi?|se raztopi|zraste|zgori|zmrzne", "Sugar in water?|dissolves|grows|burns|freezes"],
  [3, "Olje v kozarcu vode?|plava na vrhu|potone na dno|se raztopi|zmrzne", "Oil in a glass of water?|floats on top|sinks|dissolves|freezes"],
  [3, "Velika železna ladja?|plava|potone|se raztopi|zgori", "A big iron ship?|floats|sinks|dissolves|burns"],
  [1, "Kamen ali list: kaj potone?|kamen|list|oba|nobeden", "Stone or leaf: which sinks?|the stone|the leaf|both|neither"],
  [1, "Les ali kovanec: kaj plava?|les|kovanec|oba|nobeden", "Wood or a coin: which floats?|the wood|the coin|both|neither"],
]);
def("s_floatsink", "so_snov", 2, "≈", "Plava ali potone?", "Float or sink?", (t, ctx) => {
  const r = Math.random();
  if (t === 1 && r < 0.2) return FLOAT_BANK(1, ctx);
  if (t === 1) return r < 0.6 ? choose(ctx, L(ctx, "Kaj plava na vodi?", "What floats on water?"), FLOATS, SINKS) : choose(ctx, L(ctx, "Kaj potone v vodi?", "What sinks in water?"), SINKS, FLOATS);
  if (t === 2 && r < 0.75) {
    const k = R(0, 3);
    if (k === 0) return choose(ctx, L(ctx, "Kaj se raztopi v vodi?", "What dissolves in water?"), DISSOLVES, NOT_DISSOLVES);
    if (k === 1) return choose(ctx, L(ctx, "Kaj se ne raztopi v vodi?", "What does NOT dissolve in water?"), NOT_DISSOLVES, DISSOLVES);
    const fl = k === 2, it = pick(fl ? FLOATS.filter((x) => !/ledu/.test(x)) : SINKS); // led se v vodi tudi tali
    return out(L(ctx, `${tr(ctx, it)[0].toUpperCase() + tr(ctx, it).slice(1)} v vodi?`, `${tr(ctx, it)[0].toUpperCase() + tr(ctx, it).slice(1)} in water?`), L(ctx, fl ? "plava" : "potone", fl ? "floats" : "sinks"), L(ctx, "plava|potone|se raztopi|zgori", "floats|sinks|dissolves|burns").split("|"));
  }
  return FLOAT_BANK(3, ctx);
});

defBank("s_water", "so_snov", 2, "~", "Voda in led", "Water and ice", [
  [1, "Kaj je zamrznjena voda?|led|para|dež|mleko", "What is frozen water?|ice|steam|rain|milk"],
  [1, "Led na toplem?|se stopi|zraste|zmrzne|zgori", "Ice in a warm place?|melts|grows|freezes|burns"],
  [1, "Voda v zamrzovalniku?|zmrzne|zavre|izhlapi|zgori", "Water in the freezer?|freezes|boils|evaporates|burns"],
  [1, "Kaj se dviga iz vrele vode?|para|led|sneg|pesek", "What rises from boiling water?|steam|ice|snow|sand"],
  [1, "Luža na soncu?|se posuši|zmrzne|zraste|zgori", "A puddle in the sun?|dries up|freezes|grows|burns"],
  [1, "Kaj je trdno?|led|voda|para|sok", "Which is solid?|ice|water|steam|juice"],
  [1, "Kaj je tekoče?|voda|led|sneg|para", "Which is a liquid?|water|ice|snow|steam"],
  [1, "Kaj je sneg?|zmrznjena voda|pesek|sladkor|vata", "What is snow?|frozen water|sand|sugar|cotton wool"],
  [1, "Kje je voda slana?|v morju|v reki|v potoku|v pipi", "Where is water salty?|in the sea|in a river|in a stream|from the tap"],
  [1, "Kdo potrebuje vodo?|vsa živa bitja|samo ribe|samo ljudje|nihče", "Who needs water?|all living things|only fish|only people|nobody"],
  [1, "Kaj naredimo, ko smo žejni?|pijemo vodo|jemo sol|tečemo|spimo", "What do we do when thirsty?|drink water|eat salt|run|sleep"],
  [1, "Voda v loncu na štedilniku?|zavre|zmrzne|postane led|se strdi", "Water in a pot on the stove?|boils|freezes|turns to ice|hardens"],
  [2, "Pri kateri temperaturi voda zmrzne?|0 °C|100 °C|10 °C|50 °C", "At what temperature does water freeze?|0 °C|100 °C|10 °C|50 °C"],
  [2, "Pri kateri temperaturi voda zavre?|100 °C|0 °C|50 °C|37 °C", "At what temperature does water boil?|100 °C|0 °C|50 °C|37 °C"],
  [2, "Kaj nastane, ko se para ohladi?|kapljice vode|pesek|dim|sladkor", "What forms when steam cools?|water drops|sand|smoke|sugar"],
  [2, "Voda ima obliko?|posode|kocke|krogle|zvezde", "Water takes the shape of its?|container|cube|ball|star"],
  [2, "Katera luža se prej posuši?|na soncu|v senci|v kleti|v hladilniku", "Which puddle dries first?|in the sun|in the shade|in a cellar|in a fridge"],
  [2, "Snežak spomladi?|se stopi|zraste|zmrzne|zaspi", "A snowman in spring?|melts|grows|freezes|falls asleep"],
  [2, "Kaj potrebujemo, da se led hitro stopi?|toploto|mraz|temo|senco", "What makes ice melt quickly?|heat|cold|darkness|shade"],
  [2, "Kje je na Zemlji največ vode?|v morjih|v rekah|v jezerih|v oblakih", "Where is most of Earth's water?|in the seas|in rivers|in lakes|in clouds"],
  [2, "Kje doma dobimo pitno vodo?|iz pipe|iz luže|iz morja|iz akvarija", "Where do we get drinking water at home?|from the tap|from a puddle|from the sea|from a fish tank"],
  [2, "Med umivanjem zob pipo?|zapremo|pustimo teči|odpremo bolj|zlomimo", "While brushing teeth, the tap?|is turned off|is left running|is opened wider|is broken"],
  [2, "Kaj onesnaži vodo?|smeti v reki|ribe|kamni|dež", "What pollutes water?|litter in rivers|fish|stones|rain"],
  [2, "Kaj potrebujemo, da voda zavre?|toploto|led|sol|mraz", "What do we need to boil water?|heat|ice|salt|cold"],
  [3, "Voda se spremeni v paro. Kako rečemo?|izhlapevanje|zmrzovanje|taljenje|vrtenje", "Water turns into vapour. This is?|evaporation|freezing|melting|spinning"],
  [3, "Kako rečemo, ko se led stopi?|taljenje|zmrzovanje|vrenje|izhlapevanje", "What do we call ice turning to water?|melting|freezing|boiling|evaporation"],
  [3, "Morje → para → oblak → ?|dež|led|sonce|pesek", "sea → vapour → cloud → ?|rain|ice|the Sun|sand"],
  [3, "Voda v steklenici v zamrzovalniku?|se razširi|se skrči|izgine|zavre", "Water in a bottle in the freezer?|expands|shrinks|disappears|boils"],
  [3, "Vroča para?|lahko opeče|je hladna|je trdna|ni nevarna", "Hot steam?|can burn you|is cold|is solid|is harmless"],
  [3, "Morska voda za pitje je?|neprimerna|najboljša|sladka|čista", "Sea water for drinking is?|unsuitable|the best|fresh|pure"],
  [3, "Kaj je ledenik?|velika gmota ledu|reka|jezero|oblak", "What is a glacier?|a huge mass of ice|a river|a lake|a cloud"],
  [3, "Kocke ledu v toplem soku?|se stopijo|zrastejo|potonejo|zgorijo", "Ice cubes in warm juice?|melt|grow|sink|burn"],
  [3, "Zakaj pozimi ceste solijo?|da se led stopi|da so slane|da se sneg strdi|za okus", "Why are roads salted in winter?|to melt the ice|to make them salty|to harden snow|for taste"],
  [3, "Kdaj na travi vidimo roso?|zgodaj zjutraj|opoldne|v vročem popoldnevu|ob nevihti", "When do we see dew on grass?|early morning|at noon|in afternoon heat|in a storm"],
  [3, "Vodna para je?|plin|trdna snov|tekočina|kovina", "Water vapour is a?|gas|solid|liquid|metal"],
]);

const MAG_YES = ["žebelj|iron nail", "šivanka|sewing needle", "sponka za papir|paper clip", "železni opilki|iron filings", "varnostna zaponka|safety pin", "železen vijak|iron screw"];
const MAG_NO = ["lesena kocka|wooden block", "papir|paper", "plastična žlica|plastic spoon", "steklen kozarec|glass jar", "radirka|rubber", "aluminijasta folija|aluminium foil", "svinčnik|pencil", "zlat prstan|gold ring", "volna|wool"];
const MAG_BANK = bank([
  [1, "Magnet privlači predmete iz?|železa|lesa|papirja|plastike", "A magnet attracts things made of?|iron|wood|paper|plastic"],
  [1, "Ali magnet privlači les?|ne|da|samo mokrega|samo ponoči", "Does a magnet attract wood?|no|yes|only when wet|only at night"],
  [1, "Ali magnet deluje skozi papir?|da|ne|samo skozi moker|samo ponoči", "Does a magnet work through paper?|yes|no|only wet paper|only at night"],
  [1, "Ali magnet privlači papir?|ne|da|samo belega|samo mokrega", "Does a magnet attract paper?|no|yes|only white paper|only wet paper"],
  [1, "Ali magnet privlači železen žebelj?|da|ne|samo mokrega|samo ponoči", "Does a magnet attract an iron nail?|yes|no|only when wet|only at night"],
  [1, "Ali magnet privlači stekleni kozarec?|ne|da|samo polnega|samo praznega", "Does a magnet attract a glass?|no|yes|only when full|only when empty"],
  [1, "Ali magnet privlači plastiko?|ne|da|samo rdečo|samo mokro", "Does a magnet attract plastic?|no|yes|only red plastic|only wet plastic"],
  [1, "Kaj se prime vrat hladilnika?|magnet|kamen|les|papir", "What sticks to a fridge door?|a magnet|a stone|wood|paper"],
  [2, "Kje je magnet najmočnejši?|na polih|na sredini|nikjer|povsod enako", "Where is a magnet strongest?|at the poles|in the middle|nowhere|equally everywhere"],
  [2, "Koliko polov ima magnet?|2|1|3|4", "How many poles does a magnet have?|2|1|3|4"],
  [2, "Pola magneta sta?|severni in južni|levi in desni|zgornji in spodnji|vroči in hladni", "A magnet's poles are?|north and south|left and right|top and bottom|hot and cold"],
  [2, "Kaj pomaga najti sever?|kompas|termometer|tehtnica|ura", "What helps us find north?|a compass|a thermometer|scales|a clock"],
  [2, "Magnet privlači žebelj?|tudi na daljavo|samo z dotikom|samo ponoči|nikoli", "A magnet pulls a nail?|even from a distance|only when touching|only at night|never"],
  [3, "Enaka pola dveh magnetov se?|odbijata|privlačita|zlepita|stopita", "Two like poles?|push apart|pull together|glue together|melt"],
  [3, "Različna pola dveh magnetov se?|privlačita|odbijata|stopita|ugasneta", "Two unlike poles?|pull together|push apart|melt|switch off"],
  [3, "Zakaj magnet drži na hladilniku?|vrata so iz jekla|vrata so mrzla|magnet je lepljiv|hladilnik brni", "Why does a magnet stick to a fridge?|the door is steel|the door is cold|magnets are sticky|the fridge hums"],
  [3, "Kaj dobimo, ko magnet prelomimo?|dva magneta|nič magnetnega|en sam pol|zlato", "What do we get if we break a magnet?|two magnets|nothing magnetic|a single pole|gold"],
  [3, "Ali magnet deluje skozi vodo?|da|ne|samo skozi slano|samo skozi toplo", "Does a magnet work through water?|yes|no|only salty water|only warm water"],
  [3, "Igla kompasa je?|majhen magnet|kos lesa|kos stekla|plastična palčka", "What is a compass needle?|a small magnet|a bit of wood|a piece of glass|a plastic stick"],
  [3, "Šivanka, podrgnjena z magnetom, postane?|magnetna|mokra|vroča|lesena", "A needle rubbed with a magnet becomes?|magnetic|wet|hot|wooden"],
  [3, "Kam kaže igla kompasa?|sever in jug|vzhod in zahod|samo navzgor|kamorkoli", "Which way does a compass needle point?|north and south|east and west|only up|anywhere"],
]);
def("s_magnet", "so_snov", 3, "∩", "Magnet", "Magnets", (t, ctx) => {
  const r = Math.random();
  if (t === 1 && r < 0.6) return r < 0.35 ? choose(ctx, L(ctx, "Kaj magnet privlači?", "What does a magnet attract?"), MAG_YES, MAG_NO) : choose(ctx, L(ctx, "Česa magnet ne privlači?", "What does a magnet NOT attract?"), MAG_NO, MAG_YES);
  if (t === 2 && r < 0.3) return choose(ctx, L(ctx, "Kaj magnet privlači?", "What does a magnet attract?"), MAG_YES, MAG_NO);
  return MAG_BANK(t, ctx);
});

const LIGHT_YES = ["Sonce|the Sun", "sveča|a candle", "žepna svetilka|a torch", "ogenj|a fire", "prižgana žarnica|a lit bulb", "kresnica|a firefly", "zvezda|a star", "blisk|lightning"];
const LIGHT_NO = ["Luna|the Moon", "ogledalo|a mirror", "okno|a window", "odsevnik|a reflector", "sneg|snow", "kovanec|a coin", "steklo|glass"];
const LIGHT_BANK = bank([
  [1, "Kdaj vidimo svojo senco?|ko sije sonce|v popolni temi|ko spimo|ko je oblačna noč", "When can we see our shadow?|when the sun shines|in total darkness|when we sleep|on a cloudy night"],
  [1, "Senca nastane, ko predmet?|zastre svetlobo|odda svetlobo|zazveni|se segreje", "A shadow forms when an object?|blocks light|gives off light|makes a sound|warms up"],
  [1, "Kaj potrebujemo, da vidimo?|svetlobo|temo|veter|vodo", "What do we need in order to see?|light|darkness|wind|water"],
  [1, "Kaj vidimo v popolni temi?|nič|vse barve|le rdečo|le sence", "What can we see in total darkness?|nothing|all colours|only red|only shadows"],
  [1, "Kdaj je zunaj temno?|ponoči|opoldne|dopoldne|ob kosilu", "When is it dark outside?|at night|at noon|in the morning|at lunchtime"],
  [1, "Kje je senca drevesa?|stran od sonca|proti soncu|na vrhu drevesa|na nebu", "Where is a tree's shadow?|away from the Sun|towards the Sun|on top of the tree|in the sky"],
  [1, "S čim si posvetimo v temi?|z žepno svetilko|z ogledalom|s kamnom|z odejo", "What do we light our way with?|a torch|a mirror|a stone|a blanket"],
  [1, "Kaj vidimo ponoči na jasnem nebu?|Luno in zvezde|Sonce|mavrico|točo", "What do we see in a clear night sky?|the Moon and stars|the Sun|a rainbow|hail"],
  [2, "Sonce je pred nami. Kje je naša senca?|za nami|pred nami|nad nami|v nas", "The Sun is in front of us. Our shadow is?|behind us|in front of us|above us|inside us"],
  [2, "Kdaj je senca najkrajša?|opoldne|zjutraj|zvečer|ob sončnem zahodu", "When is a shadow shortest?|at noon|in the morning|in the evening|at sunset"],
  [2, "Kdaj je senca najdaljša?|zjutraj ali zvečer|opoldne|nikoli|vedno enako", "When is a shadow longest?|morning or evening|at noon|never|always the same"],
  [2, "Svetilko približamo predmetu. Senca?|se poveča|se zmanjša|izgine|ostane enaka", "We move a torch closer to an object. Its shadow?|gets bigger|gets smaller|vanishes|stays the same"],
  [2, "Kaj prepušča svetlobo?|steklo|les|karton|kamen", "What lets light through?|glass|wood|cardboard|stone"],
  [2, "Kaj ne prepušča svetlobe?|karton|steklo|voda|zrak", "What does NOT let light through?|cardboard|glass|water|air"],
  [2, "Od kod dobi Luna svetlobo?|od Sonca|od uličnih luči|od kresnic|od sveč", "Where does moonlight come from?|the Sun|street lamps|fireflies|candles"],
  [2, "Odsevnik ponoči?|odbija svetlobo|sam sveti|greje|piska", "At night a reflector?|reflects light|glows by itself|gives heat|beeps"],
  [2, "Zakaj nosimo kresničko?|da smo vidni|da nas greje|da sveti sama|za okras", "Why do we wear a reflector badge?|to be seen|to keep warm|it glows itself|for decoration"],
  [3, "Kako potuje svetloba?|naravnost|v krogih|cik-cak|samo navzgor", "How does light travel?|in straight lines|in circles|zigzag|only upwards"],
  [3, "Za mavrico potrebujemo sonce in?|dežne kapljice|sneg|veter|temo", "A rainbow needs sunshine and?|raindrops|snow|wind|darkness"],
  [3, "Koliko barv štejemo v mavrici?|7|3|5|10", "How many colours do we count in a rainbow?|7|3|5|10"],
  [3, "Kje je sonce, ko vidimo mavrico?|za nami|pred nami|pod nami|ob mavrici", "Where is the Sun when we see a rainbow?|behind us|in front of us|below us|next to the rainbow"],
  [3, "Ogledalo svetlobo?|odbije|pogoltne|ustvari|zamrzne", "What does a mirror do to light?|reflects it|swallows it|makes it|freezes it"],
  [3, "Gledanje v Sonce?|škoduje očem|je zdravo|izboljša vid|ne vpliva", "Looking straight at the Sun?|harms the eyes|is healthy|improves sight|does nothing"],
  [3, "Opoldne naša senca pri nas kaže proti?|severu|jugu|vzhodu|zahodu", "At noon in Slovenia our shadow points?|north|south|east|west"],
  [3, "Sončna ura kaže čas s pomočjo?|sence|zvoka|vode|vetra", "A sundial tells time using?|a shadow|sound|water|wind"],
]);
def("s_light", "so_snov", 3, "☼", "Svetloba in senca", "Light and shadow", (t, ctx) => {
  const r = Math.random();
  if (t === 1 && r < 0.5) return r < 0.3 ? choose(ctx, L(ctx, "Kaj oddaja svetlobo?", "What gives off its own light?"), LIGHT_YES, LIGHT_NO) : choose(ctx, L(ctx, "Kaj ne sveti samo od sebe?", "What does NOT shine by itself?"), LIGHT_NO, LIGHT_YES);
  if (t === 2 && r < 0.25) return choose(ctx, L(ctx, "Kaj je vir svetlobe?", "Which is a light source?"), LIGHT_YES, LIGHT_NO);
  return LIGHT_BANK(t, ctx);
});

// =====================================================================
// PROMET IN PROSTOR
// =====================================================================
// [beseda, nasprotje, skupina]: napačni odgovori le iz drugih skupin (»pod« ni napačno nasprotje od »zgoraj«).
const OPPOSITES = [["levo|left", "desno|right", 0], ["zgoraj|up", "spodaj|down", 1], ["spredaj|in front", "zadaj|behind", 2], ["notri|inside", "zunaj|outside", 3], ["blizu|near", "daleč|far", 4], ["visoko|high", "nizko|low", 1], ["naprej|forwards", "nazaj|backwards", 2], ["nad|above", "pod|below", 1]];
const ARROWS = ["↑", "→", "↓", "←"];
const LR_BANK = bank([
  [2, "Ptica je nad hišo. Hiša je?|pod ptico|nad ptico|v ptici|za ptico", "A bird is above the house. The house is?|below the bird|above the bird|inside the bird|behind the bird"],
  [2, "Mačka je pod mizo. Miza je?|nad mačko|pod mačko|v mački|za mačko", "A cat is under the table. The table is?|above the cat|under the cat|inside the cat|behind the cat"],
  [2, "Ana stoji pred Tinetom. Tine stoji?|za Ano|pred Ano|nad Ano|pod Ano", "Ana stands in front of Tine. Tine stands?|behind Ana|in front of Ana|above Ana|under Ana"],
  [2, "Knjiga je na mizi. Kaj je spodaj?|miza|knjiga|obe|nobena", "A book is on a table. Which is underneath?|the table|the book|both|neither"],
  [2, "Avto je levo od hiše. Hiša je?|desno od avta|levo od avta|nad avtom|pod avtom", "A car is left of the house. The house is?|right of the car|left of the car|above the car|under the car"],
  [2, "Obrnemo se nazaj. Kar je bilo zadaj, je zdaj?|spredaj|zadaj|zgoraj|spodaj", "We turn round. What was behind is now?|in front|behind|above|below"],
  [3, "Prijatelj te gleda in dvigne desno roko. Kje je zate?|na levi|na desni|zgoraj|zadaj", "Facing you, a friend lifts their right hand. It's on your?|left|right|top side|back"],
  [3, "Dvakrat se obrneš na desno. Kam gledaš?|nazaj|naprej|levo|desno", "You turn right twice. Which way do you face?|backwards|forwards|left|right"],
  [3, "Obrneš se na desno, nato na levo. Kam gledaš?|naprej|nazaj|levo|desno", "You turn right, then left. Which way do you face?|forwards|backwards|left|right"],
  [3, "Na kateri strani ceste vozijo pri nas avtomobili?|na desni|na levi|na sredini|kjerkoli", "In Slovenia, cars drive on the?|right|left|middle|either side"],
]);
def("s_lr", "so_pro", 1, "←→", "Levo, desno, zgoraj, spodaj", "Left, right, up, down", (t, ctx) => {
  const r = Math.random();
  if (t === 1) {
    if (r < 0.65) {
      const p = pick(OPPOSITES), k = R(0, 1);
      return out(L(ctx, `Nasprotje besede ${tr(ctx, p[k])}?`, `The opposite of ${tr(ctx, p[k])}?`), tr(ctx, p[1 - k]), OPPOSITES.filter((o) => o[2] !== p[2]).flatMap((o) => [o[0], o[1]]).map((x) => tr(ctx, x)));
    }
    const i = R(0, 3), dirs = L(ctx, "gor|desno|dol|levo", "up|right|down|left").split("|");
    return out(L(ctx, `Kam kaže puščica ${ARROWS[i]}?`, `Which way does ${ARROWS[i]} point?`), dirs[i], dirs);
  }
  if (t === 3 && r < 0.5) {
    const i = R(0, 3), k = pick([1, -1, 2, 3, -3]);
    const turn = { 1: L(ctx, "se obrne na desno", "turns right"), [-1]: L(ctx, "se obrne na levo", "turns left"), 2: L(ctx, "se obrne nazaj", "turns round"), 3: L(ctx, "se trikrat obrne na desno", "turns right 3 times"), [-3]: L(ctx, "se trikrat obrne na levo", "turns left 3 times") }[k];
    return out(L(ctx, `Puščica ${ARROWS[i]} ${turn}. Kam kaže?`, `Arrow ${ARROWS[i]} ${turn}. Now it points?`), ARROWS[(((i + k) % 4) + 4) % 4], ARROWS);
  }
  if (t === 2 && r < 0.3) {
    const i = R(0, 3), k = pick([1, -1]);
    return out(L(ctx, `Puščica ${ARROWS[i]} se obrne na ${k > 0 ? "desno" : "levo"}. Kam kaže?`, `Arrow ${ARROWS[i]} turns ${k > 0 ? "right" : "left"}. Now it points?`), ARROWS[(i + k + 4) % 4], ARROWS);
  }
  return LR_BANK(t, ctx);
});

defBank("s_traffic", "so_pro", 2, "STOP", "Varno v prometu", "Road safety", [
  [1, "Pri rdeči luči na semaforju?|stojimo|gremo|tečemo|skačemo", "At a red traffic light we?|stop|go|run|jump"],
  [1, "Ko za pešce zasveti zelena luč?|smemo čez cesto|moramo stati|se uležemo|gremo nazaj", "When the green walking light shows?|we may cross|we must wait|we lie down|we go back"],
  [1, "Kje prečkamo cesto?|na prehodu za pešce|sredi ovinka|za parkiranim avtom|med avtomobili", "Where do we cross the road?|at a crossing|on a bend|behind a parked car|between cars"],
  [1, "Preden prečkamo cesto, pogledamo?|levo, desno, levo|samo naprej|v nebo|nazaj", "Before crossing, we look?|left, right, left|only ahead|at the sky|behind us"],
  [1, "Koliko luči ima semafor za avte?|3|2|4|5", "How many lights on a traffic light for cars?|3|2|4|5"],
  [1, "Katera luč je na semaforju zgoraj?|rdeča|zelena|rumena|modra", "Which traffic light colour is at the top?|red|green|amber|blue"],
  [1, "Kaj nosimo ponoči na oblačilih?|odsevnik|črno kapo|sončna očala|copate", "What do we wear on clothes at night?|a reflector|a black hat|sunglasses|slippers"],
  [1, "Kaj nosimo na glavi, ko kolesarimo?|čelado|krono|klobuk|očala", "What do we wear on our head to cycle?|a helmet|a crown|a straw hat|glasses"],
  [1, "V avtu je otrok vedno?|pripet|stoječ|na strehi|odpet", "In a car a child is always?|buckled up|standing|on the roof|unbuckled"],
  [1, "Kje se igramo z žogo?|na igrišču|na cesti|na parkirišču|na prehodu", "Where do we play ball?|in a playground|on the road|in a car park|on a crossing"],
  [1, "Kdo nam pred šolo pomaga čez cesto?|prometnik|kuhar|frizer|pek", "Who helps us cross near school?|a crossing guard|a cook|a hairdresser|a baker"],
  [1, "Kako prečkamo cesto?|hodimo|tečemo|skačemo|se lovimo", "How do we cross the road?|walk|run|jump|play tag"],
  [2, "Kje hodimo, kjer ni pločnika?|ob levem robu ceste|ob desnem robu|po sredini ceste|kjer želimo", "Where do we walk if there's no pavement?|on the left edge|on the right edge|in the middle|anywhere"],
  [2, "Rdeče obrobljen trikotnik pomeni?|nevarnost|prepoved|obvestilo|parkirišče", "A red-edged triangle sign means?|danger|a ban|information|parking"],
  [2, "Okrogel znak z rdečim robom pomeni?|prepoved|nevarnost|obvestilo|parkirišče", "A round sign with a red edge means?|a ban|danger|information|parking"],
  [2, "Znak STOP ima obliko?|osmerokotnika|kroga|trikotnika|kvadrata", "What shape is a STOP sign?|octagon|circle|triangle|square"],
  [2, "Rumena luč na semaforju pomeni?|pozor|pojdi|teci|parkiraj", "An amber traffic light means?|get ready to stop|go|run|park"],
  [2, "Znak z otrokoma pomeni?|pozor, otroci|parkirišče|bolnišnica|bencinska črpalka", "A sign showing two children means?|watch for children|parking|hospital|petrol station"],
  [2, "Moder znak s črko P pomeni?|parkirišče|pošto|policijo|bencinsko črpalko", "A blue sign with a P means?|parking|post office|police|petrol station"],
  [2, "Otrok v avtu sedi?|v otroškem sedežu|na kolenih staršev|na tleh|v prtljažniku", "In a car a child sits?|in a child seat|on a parent's lap|on the floor|in the boot"],
  [2, "Izstopimo iz avtobusa. Cesto prečkamo?|ko avtobus odpelje|pred avtobusom|za avtobusom|tekoč", "We get off a bus. We cross?|after the bus leaves|in front of the bus|behind the bus|running"],
  [2, "Ponoči smo bolj vidni v?|svetlih oblačilih|temnih oblačilih|črni bundi|sivi kapi", "At night we are easier to see in?|light clothes|dark clothes|a black coat|a grey hood"],
  [2, "Kdo lahko usmerja promet?|policist|zdravnik|učitelj|pek", "Who may direct traffic?|a police officer|a doctor|a teacher|a baker"],
  [2, "Kaj ponoči na kolesu prižgemo?|luči|radio|zvonec|zavore", "What do we switch on on a bike at night?|lights|a radio|the bell|the brakes"],
  [3, "Koliko luči ima semafor za pešce?|2|3|1|4", "How many lights on a pedestrian signal?|2|3|1|4"],
  [3, "Zakaj ne prečkamo za parkiranim avtom?|ker nas ne vidijo|ker je avto umazan|ker je tam senca|ker je dolgočasno", "Why not cross behind a parked car?|drivers can't see us|the car is dirty|it's shady|it's boring"],
  [3, "Znaki za nevarnost imajo obliko?|trikotnika|kroga|osmerokotnika|srca", "What shape are danger signs?|triangle|circle|octagon|heart"],
  [3, "Znaki za obvestila imajo obliko?|pravokotnika|trikotnika|kroga|osmerokotnika", "What shape are information signs?|rectangle|triangle|circle|octagon"],
  [3, "Okrogel moder znak pomeni?|obveznost|prepoved|nevarnost|parkirišče", "A round blue sign means?|you must do it|it's banned|danger|parking"],
  [3, "V avtobusu med vožnjo?|sedimo ali se držimo|skačemo|tečemo po avtobusu|odpremo vrata", "On a moving bus we?|sit or hold on|jump|run up and down|open the door"],
  [3, "Kje čakamo avtobus?|na postajališču|na cesti|na prehodu|v križišču", "Where do we wait for the bus?|at the bus stop|on the road|on a crossing|at a junction"],
  [3, "Vozila z modro lučjo in sireno?|imajo prednost|nimajo prednosti|morajo stati|vozijo počasi", "Vehicles with blue lights and a siren?|have priority|have no priority|must stop|drive slowly"],
  [3, "Rumena utripajoča luč pomeni?|previdno|stoj|hitro pojdi|semafor je nov", "A flashing amber light means?|take care|stop|hurry|new traffic light"],
  [3, "Znak ob šoli opozarja voznike na?|otroke|krave|smučarje|vlake", "A sign near a school warns drivers of?|children|cows|skiers|trains"],
  [3, "Rdeča luč na železniškem prehodu?|počakamo|hitro stečemo|gremo čez|se igramo", "A red light at a railway crossing?|we wait|we run across|we walk across|we play"],
]);

const DIRS = ["sever|north", "vzhod|east", "jug|south", "zahod|west"];
const DIRS_DAT = ["severu", "vzhodu", "jugu", "zahodu"];
const MAP_BANK = bank([
  [1, "Koliko glavnih strani neba poznamo?|4|2|3|8", "How many main compass points are there?|4|2|3|8"],
  [1, "Kje sonce vzide?|na vzhodu|na zahodu|na severu|na jugu", "Where does the Sun rise?|in the east|in the west|in the north|in the south"],
  [1, "Kje sonce zaide?|na zahodu|na vzhodu|na severu|na jugu", "Where does the Sun set?|in the west|in the east|in the north|in the south"],
  [1, "Kje je sonce opoldne?|na jugu|na severu|na vzhodu|na zahodu", "Where is the Sun at noon?|in the south|in the north|in the east|in the west"],
  [1, "Na zemljevidu je sever?|zgoraj|spodaj|levo|desno", "On a map, north is at the?|top|bottom|left|right"],
  [1, "Na zemljevidu je jug?|spodaj|zgoraj|levo|desno", "On a map, south is at the?|bottom|top|left|right"],
  [1, "Na zemljevidu je vzhod?|desno|levo|zgoraj|spodaj", "On a map, east is on the?|right|left|top|bottom"],
  [1, "Na zemljevidu je zahod?|levo|desno|zgoraj|spodaj", "On a map, west is on the?|left|right|top|bottom"],
  [1, "Kaj kaže, kje je sever?|kompas|termometer|ura|tehtnica", "What shows us where north is?|a compass|a thermometer|a clock|scales"],
  [1, "Kratica za sever je?|S|J|V|Z", "The letter for north is?|N|S|E|W"],
  [1, "Kratica za vzhod je?|V|S|J|Z", "The letter for east is?|E|N|S|W"],
  [2, "Na načrtu prostor vidimo?|od zgoraj|od spodaj|od strani|od znotraj", "A plan shows a place seen from?|above|below|the side|inside"],
  [2, "Kaj na zemljevidu pomeni modra barva?|vodo|gozd|ceste|hiše", "On a map, blue shows?|water|forest|roads|houses"],
  [2, "Kaj je legenda na zemljevidu?|razlaga znakov|naslov|okvir|pravljica", "What is a map key?|it explains symbols|the title|the frame|a fairy tale"],
  [2, "Zemljevid je v primerjavi s pokrajino?|manjši|večji|enako velik|težji", "Compared with the real land, a map is?|smaller|bigger|the same size|heavier"],
  [3, "Med severom in vzhodom je?|severovzhod|jugozahod|jugovzhod|severozahod", "Between north and east is?|north-east|south-west|south-east|north-west"],
  [3, "Med jugom in zahodom je?|jugozahod|severovzhod|jugovzhod|severozahod", "Between south and west is?|south-west|north-east|south-east|north-west"],
  [3, "Zjutraj gledaš proti soncu. Kje je sever?|na levi|na desni|za tabo|pred tabo", "In the morning you face the Sun. North is?|on your left|on your right|behind you|in front"],
  [3, "Kaj na zemljevidu pomeni rjava barva?|gore|morje|reke|jezera", "On a relief map, brown shows?|mountains|sea|rivers|lakes"],
  [3, "Kratica za jugozahod je?|JZ|SV|JV|SZ", "The letters for south-west are?|SW|NE|SE|NW"],
]);
def("s_map", "so_pro", 3, "S↑", "Strani neba in zemljevid", "Compass points and maps", (t, ctx) => {
  const r = Math.random();
  if (t > 1 && r < 0.5) {
    const d = t === 2 ? pick([0, 0, 1, 2, 3]) : R(0, 3), k = t === 2 ? pick([2, 2, 1, 3]) : pick([1, 2, 3]);
    const where = { 1: L(ctx, "Kaj je desno?", "What is on your right?"), 2: L(ctx, "Kaj je za tabo?", "What is behind you?"), 3: L(ctx, "Kaj je levo?", "What is on your left?") }[k];
    return out(L(ctx, `Gledaš proti ${DIRS_DAT[d]}. ${where}`, `You face ${tr(ctx, DIRS[d])}. ${where}`), tr(ctx, DIRS[(d + k) % 4]), DIRS.map((x) => tr(ctx, x)));
  }
  if (t === 1 && r < 0.3) {
    const d = R(0, 3);
    return out(L(ctx, `Katera stran neba je nasproti ${DIRS_DAT[d]}?`, `What is opposite ${tr(ctx, DIRS[d])}?`), tr(ctx, DIRS[(d + 2) % 4]), DIRS.map((x) => tr(ctx, x)));
  }
  return MAP_BANK(t, ctx);
});

export const AREAS = [
  ["so_telo", { sl: "Jaz in moje telo", en: "Me and my body" }, "#ec4899"],
  ["so_ziv", { sl: "Živa bitja", en: "Living things" }, "#22c55e"],
  ["so_cas", { sl: "Čas in vreme", en: "Time and weather" }, "#0ea5e9"],
  ["so_snov", { sl: "Snovi in pojavi", en: "Materials and phenomena" }, "#f59e0b"],
  ["so_pro", { sl: "Promet in prostor", en: "Traffic and space" }, "#ef4444"],
];
export const CONCEPTS = C;
