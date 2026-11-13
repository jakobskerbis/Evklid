// Vprašalnik »Katere igre si igral kot otrok?« (j 2026-10-30): učenec izbere zvrsti iger iz otroštva,
// Evklid pa mu v zbirki pokaže svoje izvirne učne igre v tem slogu (lastni liki, risbe in imena; brez
// blagovnih znamk). Zvrst → vrste iger iz engines.js. Shrani se v profil (settings.game_childhood):
// null = vprašalnik še ni bil izpolnjen, [] = preskočen. Isti seznam uporablja strežnik.

export const GENRES = [
  { id: "blocks", emoji: "🧱", engines: ["blocks"] },
  { id: "maze", emoji: "👾", engines: ["maze"] },
  { id: "platform", emoji: "🦘", engines: ["jumper", "castle"] },
  { id: "run", emoji: "🏃", engines: ["runner"] },
  { id: "snake", emoji: "🐍", engines: ["snake"] },
  { id: "paddle", emoji: "🏓", engines: ["bricks"] },
  { id: "space", emoji: "🚀", engines: ["invaders", "meteor"] },
  { id: "crossing", emoji: "🐸", engines: ["frog"] },
  { id: "moles", emoji: "🔨", engines: ["moles"] },
  { id: "flying", emoji: "🐦", engines: ["heli"] },
  { id: "memory", emoji: "🧠", engines: ["pairs"] },
  { id: "cards", emoji: "🃏", engines: ["cards"] },
  { id: "mines", emoji: "💣", engines: ["mines"] },
  { id: "racing", emoji: "🏎️", engines: ["hills"] },
  { id: "bubbles", emoji: "🫧", engines: ["bubbles"] },
  { id: "match", emoji: "💎", engines: ["match"] },
  { id: "sling", emoji: "🎯", engines: ["cannon"] },
  { id: "stack", emoji: "🏗️", engines: ["crane"] },
  { id: "cooking", emoji: "🍔", engines: ["diner"] },
  { id: "pet", emoji: "🐣", engines: ["pet"] },
  { id: "slicing", emoji: "🍉", engines: ["slicer"] },
  { id: "water", emoji: "💧", engines: ["water"] },
  { id: "catch", emoji: "🧺", engines: ["catcher"] },
  { id: "balloons", emoji: "🎈", engines: ["balloons"] },
  { id: "tilt", emoji: "🔮", engines: ["marble"] },
  { id: "lander", emoji: "🌙", engines: ["lander"] },
  { id: "impostor", emoji: "🕵️", engines: ["impostor"] },
];
export const GENRE_IDS = GENRES.map((g) => g.id);

// Veljaven seznam zvrsti (neznane in ponovljene izpusti); null ostane null (vprašalnik še ni izpolnjen).
export function cleanChildhood(list) {
  if (list === null) return null;
  const raw = Array.isArray(list) ? list : String(list ?? "").split(",");
  return [...new Set(raw.map((x) => String(x).trim()).filter((x) => GENRE_IDS.includes(x)))];
}

// Vrste iger za izbrane zvrsti, po vrsti izbire.
export const childhoodEngines = (list) => [...new Set((list || []).flatMap((id) => GENRES.find((g) => g.id === id)?.engines || []))];

// Lastni naslovi iger (j 2026-10-30: »možnost za pisanje lastnih naslovov iger«): učenec napiše ime
// igre iz otroštva, Evklid ga poveže z zvrstjo (dodano v game_childhood) ali, če zvrsti še ni, z željo
// za novo igro (wishes.js, tedenski pregled za j-ja). Ključne besede so samo za prepoznavo vnosa;
// naše igre imen tujih iger nikoli ne prikažejo. Shrani se v settings.game_titles (največ 5 × 40 znakov).
const TITLE_HINTS = [
  ["impostor", /among ?us|impost|slepar|\bsus\b|mafij|mafia|werewolf|volkodlak|town of salem|cluedo|detektiv|vohun/],
  ["blocks", /tetri|tetro|tetirs|tertis|padajo|block ?blast|blocks?\b|kock/],
  ["maze", /pac.?man|labirint|maze|duh/],
  ["platform", /mario(?! ?kart)|sonic(?! dash)|doodle|platform|skak|jump|kangur|crash band|rayman|celeste/],
  ["run", /subway|temple run|runner|\btek\b|tekač|sonic dash|minion rush|chrome dino|google dino|dino (game|run)|stumble guys|fall guys/],
  ["snake", /snake|\bkač|slither|agar\.?io|worm(?!s)/],
  ["paddle", /pong|breakout|arkanoid|opek|brick|ping.?pong|tenis|tennis|badminton/],
  ["space", /invader|galag|galaxian|asteroid|space|vesolj|star ?wars|vojna zvezd/],
  ["crossing", /frogger|crossy|žab|cesta|road/],
  ["moles", /krt|whack|mole/],
  ["sling", /angry|jezni ptič|frač|sling|\bworms\b/], // pred »flying«: Angry Bird(s), Jezni ptiči
  ["flying", /flappy|helikopter|heli|letal|ptič|bird(?!s)|jetpack|tiny wings/],
  ["memory", /memory|spomin|pexeso|pari\b|pairs/],
  ["cards", /solitaire|pasjans|\buno\b|\benka\b|karte|kartanj|card|poker|\bremi\b|tarok|šnops|črni peter|^vojna$/],
  ["mines", /\bmine|\bmin\b|minolov/],
  ["racing", /hill climb|racing|dirk|avto|\bcar\b|karting|go.?kart|mario kart|need for speed|f1|formula|asphalt|traffic|\bcars\b|hot wheels/],
  ["bubbles", /bubble|mehurč|puzzle bobble|zuma/],
  ["match", /candy|bejewel|crush|match.?3|royal match|scapes\b|dragulj|trojk|gems?\b/],
  ["stack", /stack|zlag|tower bloxx|stolp/],
  ["cooking", /papa'?s\b|papa louie|cook(?!ie)|kuh|restavr|burger|pizz|overcooked/],
  ["pet", /\bpou\b|tamagotchi|talking|adopt me|ljubljenč|\bpets?\b|nintendogs/],
  ["slicing", /fruit ninja|ninja(?!go)|rezanj|sadj/],
  ["water", /where'?s my water|swampy|\bvod|water|\bcev|pipe/],
  ["catch", /catch|lovi|košar/],
  ["balloons", /balon|balloon/],
  ["tilt", /marble|krogl|labyrinth|nagib/],
  ["lander", /lander|pristaj|raket/],
];
const WISH_HINTS = [
  ["tower", /plants vs|bloons|kingdom rush|tower defen|obramb/],
  ["pinball", /pinball|fliper/],
  ["merge", /2048|merge|združev/],
  ["golf", /golf/],
  ["bowling", /bowling|keglj/],
  ["darts", /dart(?!h)|pikad/],
  ["fishing", /fish|ribi|ribolov/],
  ["rhythm", /guitar hero|rhythm|ritem|piano tiles|beat saber|\bosu\b|geometry dash|bobn/],
  ["puzzle", /jigsaw|sestavljank|puzzle(?! ?bobble)/],
  ["connect", /connect ?4|connect four|štiri v vrsto|4 v vrsto|tri v vrsto|križci|tic.?tac/],
  ["words", /wordle|hangman|vislic|scrabble|besed|crossword|\bwords?\b/],
  ["farm", /farm|hay day|kmetij|stardew|township/],
  ["city", /sim ?city|minecraft|majn ?kraft|majn ?craft|craft\b|cities|mesto|gradnj|roblox|lego/],
  ["spot", /razlik|spot the|spot it|dobble|difference|where'?s wally|waldo|skrit/],
  ["hoops", /basket|košark|hoops/],
  ["penalty", /fifa|football|nogomet|penal|soccer|enajstmetr/],
];
const norm = (s) => String(s ?? "").toLowerCase().normalize("NFC").trim();
// → { genre } (igra že obstaja), { wish } (predlog za novo igro) ali {} (Evklid še ne ve: v pregled j-ju)
export function matchTitle(title) {
  const t = norm(title);
  if (!t) return {};
  // želja, ki je medtem postala igra (wishes.js → GENRES), velja kot zvrst
  for (const [wish, re] of WISH_HINTS) if (re.test(t)) return GENRE_IDS.includes(wish) ? { genre: wish } : { wish };
  for (const [genre, re] of TITLE_HINTS) if (re.test(t)) return { genre };
  return {};
}
export const MAX_TITLES = 5;
export function cleanTitles(list) {
  const raw = Array.isArray(list) ? list : [];
  const out = [];
  for (const x of raw) {
    const v = String(x ?? "").replace(/[\r\n\t<>]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, 40);
    if (v && !out.some((o) => norm(o) === norm(v))) out.push(v);
  }
  return out.slice(0, MAX_TITLES);
}
