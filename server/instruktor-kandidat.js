// Popravki inštruktorja (j 21. 11. 2026, kartici z odločitvijo): meritev pedagoških mer 19. 11.
// (scripts/meri-pedagogika.mjs) je pokazala slovnične napake (»s osnovo«) in notranje oznake v odgovorih
// (»Najprej priklic:«). Spodnja popravka besedila, ki ga vidi učenec, sta vklopljena za vse (server/meta.js
// createStreamFilter in replyText, server/app.js); prompt kandidata je po dveh slepih primerjavah prej/potem postal
// prompts/system_prompt.md. EVKLID_INSTRUKTOR_KANDIDAT=1 še vedno izbere prompts/system_prompt-kandidat.md (server/prompt.js)
// za meritev naslednjega kandidata (scripts/meri-pedagogika.mjs --kandidat, scripts/meri-astra.mjs --kandidat).
// Oba popravka sta namenoma previdna: napačen popravek je slabši od nobenega.

export const kandidatOn = (env = process.env) => env.EVKLID_INSTRUKTOR_KANDIDAT === "1";

// Zapisi, ki niso slovensko besedilo (LaTeX, koda, povezave, strojni bloki, oznaka imena): znaki v njih se zamenjajo
// z \0, dolžina ostane enaka (položaji v izvirniku veljajo). Odprt zapis brez konca sega do konca besedila, zato je
// odločitev za vsak znak odvisna samo od besedila pred njim (pomembno pri pretakanju).
const OPEN = [
  ["```", "```"],
  ["$$", "$$"],
  ["\\(", "\\)"],
  ["\\[", "\\]"],
  ["<<", ">>"],
  ["{{", "}}"],
  ["`", "`"],
  ["$", "$"],
];
const URL_START = /^(?:https?:\/\/|www\.)/i;

export function maskNonText(text) {
  const s = String(text);
  let out = "";
  let i = 0;
  while (i < s.length) {
    if (s[i] === "\\" && s[i + 1] === "$") {
      out += "\0\0"; // ubežni znak za dolar: ni začetek formule, a tudi ni beseda
      i += 2;
      continue;
    }
    const pair = OPEN.find(([o]) => s.startsWith(o, i));
    if (pair) {
      const end = s.indexOf(pair[1], i + pair[0].length);
      const stop = end === -1 ? s.length : end + pair[1].length;
      out += "\0".repeat(stop - i);
      i = stop;
      continue;
    }
    if (URL_START.test(s.slice(i, i + 8)) && (i === 0 || /[\s(<«"„]/.test(s[i - 1]))) {
      const m = /^\S+/.exec(s.slice(i));
      out += "\0".repeat(m[0].length);
      i += m[0].length;
      continue;
    }
    out += s[i];
    i++;
  }
  return out;
}

// Predlog s/z in k/h po prvem glasu naslednje besede: »s« pred nezvenečimi (p, f, t, c, č, k, h, s, š), sicer »z«;
// »h« pred g in k, sicer »k«. Samo samostojen predlog z enim presledkom pred besedo iz vsaj dveh črk, ki je videti kot
// samostalnik ali pridevnik v orodniku ali dajalniku (končnica), nikoli pred številko, formulo, kratico ali glagolom
// (»s je pot«, »h zapiši«: črka je tam količina). Velika začetnica le na začetku stavka (sicer je verjetno oznaka,
// npr. točka S).
const VOICELESS = new Set([..."pftcčkhsš"]);
const STOP = new Set(
  "je so sta ste smo bo bi ni ima imata imajo pri ki ali in pa da ko naj se si mi ti jo jih mu ga kot nato zato tako tudi lahko torej potem sledi pomeni velja dobi meri leži kaže znaša reši preveri vstavi uporabi to ta te tu proti zelo dovolj malo manj več skoraj".split(" "),
);
// Prislovi in pridevniki srednjega spola na -no (»h pozitivno«, »z poljubno«, »z čisto«): tam je črka skoraj vedno
// količina (»naj bo h pozitivno število«), zato raje brez popravka.
const ADVERB_NO = /no$/;
// Pred temi besedami je črka spremenljivka (»ko gre h proti 0«, »naj bo z …«, »če je s …«, »označimo h višino«).
const VAR_BEFORE = /(?:^|[^\p{L}])(?:gre|gredo|bo|bodo|naj|ko|če|je|označimo|označi|izberimo|vzemimo|imenujmo|za)[ \t]+$/iu;
const CASE_END = /(?:o|m|i|u|ej|oj|ma)$/;
// Črka kot ime (»v s orbitali«, »z koordinato«, »x, y in z komponento«): beseda, ki jo črka označi, ali črka v naštevanju
// črk. Tam bi popravek spremenil pomen (pregled #915).
const LETTER_NOUN = /^(?:orbital|komponent|koordinat|podlupin|osjo$|osi$|os$)/;
const LETTER_LIST = /(?:^|[^\p{L}])\p{L}(?:,|[ \t]+(?:in|ali|ter))[ \t]+$/u;
// Hrvaščina ali srbščina pri nastavitvi »sl«: inštruktor odgovori v jeziku učenca, tam je »s brojem« pravilno. Jezik odgovora
// se odloči enkrat, iz učenčevega sporočila (server/app.js), da se med pretakanjem ne spremeni (pregled #915).
const HR_WORDS = new Set(
  "koji koja koje kojeg kojem što šta nije ili ovaj ova ovo ovdje gdje jer sada ću će brojem trebaš molim zadatak zadatku riješi riješiti rješenje rješenja pomozi jednadžbu jednadžba razumijem objasni".split(" "),
);
export const jezikOdgovora = (setting, userText = "") => {
  const l = setting || "sl";
  if (l !== "sl") return l;
  return (String(userText).toLowerCase().match(/\p{L}+/gu) || []).some((w) => HR_WORDS.has(w)) ? "hr" : "sl";
};
const NOT_CASE = /(?:mo|[šžč]i)$/;
const PREP_RE = /(?<![\p{L}\p{N}_\\/.\-'’^=+*<>|~\0])(?<![\p{N}\0=+*/^<>|)\]°%][ \t]+)([sSzZkKhH]) (\p{L}{2,})(?=$|[\s.,;:!?)\]»«"“”'’…–—-])/gu;
const SENTENCE_START = /(?:^|\n[ \t]*(?:[-*>][ \t]+|\d+[.)][ \t]+)?|[.!?…:][ \t]+|[«»"„“(][ \t]*)$/;

export function fixPrepositions(text) {
  const s = String(text);
  if (!/(?:^|[^\p{L}])[szkh] /iu.test(s)) return s;
  const plain = maskNonText(s);
  let out = s;
  for (const m of plain.matchAll(PREP_RE)) {
    const [, prep, word] = m;
    const at = m.index;
    const lower = word.toLowerCase();
    if (STOP.has(lower) || NOT_CASE.test(lower) || ADVERB_NO.test(lower) || !CASE_END.test(lower)) continue;
    if (VAR_BEFORE.test(plain.slice(Math.max(0, at - 16), at)) || LETTER_LIST.test(plain.slice(Math.max(0, at - 12), at)) || LETTER_NOUN.test(lower)) continue;
    if ((word.match(/\p{Lu}/gu) || []).length > 1) continue; // kratica (DNA, ATP): izgovorjava po črkah
    const upper = prep === prep.toUpperCase();
    if (upper && !SENTENCE_START.test(plain.slice(Math.max(0, at - 12), at))) continue;
    const first = lower[0];
    const p = prep.toLowerCase();
    const want = p === "s" || p === "z" ? (VOICELESS.has(first) ? "s" : "z") : first === "g" || first === "k" ? "h" : "k";
    if (want === p) continue;
    out = out.slice(0, at) + (upper ? want.toUpperCase() : want) + out.slice(at + 1);
  }
  return out;
}

// Notranje oznake iz navodil (»Najprej priklic:«, »Najprej preveri predznanje:«), ki jih je model izpisal učencu kot
// naslov ali predpono. Samo ti znani zapisi in samo na začetku vrstice ali stavka; vprašanje za oznako ostane
// (z veliko začetnico).
// Gola »Priklic« ne: v BIO, psihologiji in RAC je to pojem (»Priklic: dostop do shranjene informacije«, pregled #915).
const LABELS = ["Najprej priklic predznanja", "Najprej priklic", "Najprej preverimo predznanje", "Najprej preveri predznanje", "Priklic predznanja"];
const LABEL_ALT = LABELS.join("|");
const MD = "(?:\\*\\*|__)?";
// Oznaka v svoji vrstici (tudi kot naslov ali krepko): vrstica izgine.
const LABEL_LINE_RE = new RegExp(`(^|\\n)[ \\t]*(?:#{1,6}[ \\t]+)?${MD}(?:${LABEL_ALT})${MD}[ \\t]*[:.]?${MD}[ \\t]*(?:\\n(?:[ \\t]*\\n)*[ \\t]*(?=\\S)|$)`, "g");
// Oznaka z dvopičjem pred besedilom: izgine oznaka, prva črka besedila postane velika.
const LABEL_INLINE_RE = new RegExp(`(^|\\n[ \\t]*(?:[-*>][ \\t]+)?|[.!?…][ \\t]+)${MD}(?:${LABEL_ALT})${MD}[ \\t]*:${MD}[ \\t]*(\\p{Ll})?`, "gu");

export function stripLabels(text) {
  const s = String(text);
  if (!/Najprej p|Priklic predznanja/.test(s)) return s;
  return s.replace(LABEL_LINE_RE, "$1").replace(LABEL_INLINE_RE, (_, before, ch) => before + (ch ? ch.toUpperCase() : ""));
}

// Oba popravka; predlogi le, ko je jezik pogovora slovenščina (v hrvaščini je »s osnovom« pravilno).
export function polishReply(text, { language = "sl" } = {}) {
  const t = stripLabels(text);
  return !language || language === "sl" ? fixPrepositions(t) : t;
}

// Pri pretakanju: koliko znakov na koncu zadržati, ker se odločitev zanje še lahko spremeni (predlog, za katerim
// beseda še ni končana, ali začetek oznake). Zadržani del gre naprej z naslednjim kosom ali na koncu odgovora.
const PREP_TAIL_RE = /(?<![\p{L}\p{N}_\\/.\-'’^=+*<>|~])[sSzZkKhH](?: \p{L}*)?$/u;
const LABEL_MAX = Math.max(...LABELS.map((l) => l.length)) + 8;
const LABEL_DONE_RE = /^(?:\*{1,2}|_{1,2})?[:.]?(?:\*{1,2}|_{1,2})?[ \t]*$/;

export function polishHold(text) {
  const s = String(text);
  let hold = 0;
  const p = PREP_TAIL_RE.exec(s);
  if (p) hold = s.length - p.index;
  for (let k = Math.min(LABEL_MAX, s.length); k > hold; k--) {
    const start = s.length - k;
    if (start > 0 && !/[\s*_#>.!?…-]/.test(s[start - 1])) continue;
    const tail = s.slice(start).replace(/^[*_#> \t-]+/, "");
    if (!tail) continue; // sama predpona markdown: spodaj
    if (LABELS.some((l) => `${l}:`.startsWith(tail) || (tail.startsWith(l) && LABEL_DONE_RE.test(tail.slice(l.length))))) {
      hold = k;
      break;
    }
  }
  // Predpona markdown na začetku vrstice (»**«, »### «, »> **«), ki ji lahko sledi oznaka: počaka na naslednjo besedo,
  // sicer bi šla naprej, oznaka pa bi jo nato odnesla s seboj (pretočeno besedilo ≠ končno).
  const md = MD_PREFIX_RE.exec(s);
  if (md && md[2].length > hold) hold = md[2].length;
  return hold;
}
const MD_PREFIX_RE = /(^|\n)([ \t]*(?:#{1,6}[ \t]*)?(?:[->][ \t]*)?(?:\*{1,2}|_{1,2})?)$/;
