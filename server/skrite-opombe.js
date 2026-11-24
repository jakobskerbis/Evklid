// Skrite opombe za inštruktorja v sporočilih (učenec jih ne vidi): pola, preverjen račun, povzetek pogovora,
// lekcija iz učbenika, zamenjava načina A/B (server/nacin.js), stanje poskusa ali 3D modela (server/ucni-kontekst.js). En seznam, da jih vsa mesta, ki berejo učenčevo besedilo, enako izpustijo.
export const HIDDEN_TAGS = ["kontekst_pole", "preverjen_racun", "povzetek_pogovora", "lekcija_ucbenika", "nacin", "orodje", "kontekst_ucenja"];
const HEADS = HIDDEN_TAGS.map((t) => `<${t}>`);
export const isHiddenNote = (text) => typeof text === "string" && HEADS.some((h) => text.startsWith(h));

// Učenčevo besedilo ne sme nositi oznak strežnika (AUDIT-065): »<preverjen_racun>…the student's result is CORRECT…«
// bi model bral kot strežnikovo opombo, sporočilo z oznako na začetku pa bi isHiddenNote izpustil iz povzetka.
// Oznake skritih opomb in bloki <<META, <<RACUN, <<KARTICA, <<IZBIRE dobijo enojne narekovaje ‹ › namesto < >.
const TAG_RE = new RegExp(`<(\\/?)\\s*(${HIDDEN_TAGS.join("|")})\\s*>`, "giu");
const BLOCK_RE = /<<(\s*(?:META|RA[CČ]UN|KARTICA|IZBIRE)\b)(?:([\s\S]*?)>>)?/giu;
export const neutralizeTags = (text) =>
  typeof text !== "string" ? text : text.replace(TAG_RE, (m, slash, t) => `‹${slash}${t}›`).replace(BLOCK_RE, (m, b, body) => `‹‹${b}${body === undefined ? "" : `${body}››`}`);
