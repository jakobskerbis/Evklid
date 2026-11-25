// Skrite opombe za inštruktorja v sporočilih (učenec jih ne vidi): pola, preverjen račun, povzetek pogovora,
// lekcija iz učbenika, zamenjava načina A/B (server/nacin.js), stanje poskusa ali 3D modela (server/ucni-kontekst.js). En seznam, da jih vsa mesta, ki berejo učenčevo besedilo, enako izpustijo.
export const HIDDEN_TAGS = ["kontekst_pole", "preverjen_racun", "povzetek_pogovora", "lekcija_ucbenika", "nacin", "orodje", "kontekst_ucenja"];
const HEADS = HIDDEN_TAGS.map((t) => `<${t}>`);
export const isHiddenNote = (text) => typeof text === "string" && HEADS.some((h) => text.startsWith(h));

// Učenčevo besedilo (vpisano, potrjen prepis rokopisa, tapnjena izbira) ne sme nositi oznak skritih opomb: model bi
// ponarejeno »<preverjen_racun>…« imel za zaupanja vredno opombo aplikacije, vmesnik pa bi sporočilo skril (IN-12).
// Oznako spremenimo v »‹preverjen_racun›«: učenec še vidi, kaj je napisal, model pa ne dobi oznake. Ujame tudi
// zapise z velikimi črkami, presledki in polnoširinskimi oklepaji; nevidni znaki se prej odstranijo.
const NEVIDNI = /[\u200B-\u200D\u2060\uFEFF\u00AD]/g;
const OZNAKA = new RegExp(`[<\uFF1C\uFE64]\\s*(/?)\\s*(${HIDDEN_TAGS.join("|")})\\b(\\s*[>\uFF1E\uFE65])?`, "gi");
export const neutralizeHiddenTags = (text) =>
  typeof text === "string" ? text.replace(NEVIDNI, "").replace(OZNAKA, (_, sl, tag, close) => `‹${sl}${tag.toLowerCase()}${close ? "›" : ""}`) : text;
