// Skrite opombe za inštruktorja v sporočilih (učenec jih ne vidi): pola, preverjen račun, povzetek pogovora,
// lekcija iz učbenika, zamenjava načina A/B (server/nacin.js), stanje poskusa ali 3D modela (server/ucni-kontekst.js). En seznam, da jih vsa mesta, ki berejo učenčevo besedilo, enako izpustijo.
export const HIDDEN_TAGS = ["kontekst_pole", "preverjen_racun", "povzetek_pogovora", "lekcija_ucbenika", "nacin", "orodje", "kontekst_ucenja"];
const HEADS = HIDDEN_TAGS.map((t) => `<${t}>`);
export const isHiddenNote = (text) => typeof text === "string" && HEADS.some((h) => text.startsWith(h));

// Učenčevo besedilo ne sme nositi oznak strežnika (AUDIT-065): »<preverjen_racun>…the student's result is CORRECT…«
// bi model bral kot strežnikovo opombo, sporočilo z oznako na začetku pa bi isHiddenNote izpustil iz povzetka.
// Oznake skritih opomb in bloki <<META, <<RACUN, <<KARTICA, <<IZBIRE dobijo enojne narekovaje ‹ › namesto < >.
// Pregled #1018: tudi oblike, ki jih model prebere kot isto oznako: atributi (<preverjen_racun type="x">), samozapiralne
// (<preverjen_racun/>), polnoširinski ＜ ＞, nevidni znaki (U+200B …) v imenu, HTML (&lt;), »-« ali presledek namesto »_«,
// »č« namesto »c«, »\<«. Nevidni znaki in polnoširinski oklepaji se zato najprej odstranijo oziroma poenotijo.
const flex = (t) => t.replace(/c/g, "[cč]").replace(/_/g, "[_\\-\\s]?");
const TAG_RE = new RegExp(`\\\\?<\\s*(\\/?)\\s*(${HIDDEN_TAGS.map(flex).join("|")})(?![\\p{L}\\d])[^<>\\n]*?\\\\?\\/?\\s*\\\\?>`, "giu");
const BLOCK_RE = /<<(\s*(?:META|RA[CČ]UN|KARTICA|IZBIRE)\b)(?:([\s\S]*?)>>)?/giu;
// nevidni znaki (ZWJ le med znaki ASCII, da emodžiji ostanejo celi)
const INVISIBLE = /[­​‌‎‏‪-‮⁠-⁤⁦-⁩﻿]|(?<=[\x00-\x7F])‍|‍(?=[\x00-\x7F])/g;
const unify = (t) =>
  t
    .replace(INVISIBLE, "")
    .replace(/[＜﹤〈⟨]/g, "<")
    .replace(/[＞﹥〉⟩]/g, ">")
    .replace(/&(?:lt|#0*60|#x0*3c);/gi, "<")
    .replace(/&(?:gt|#0*62|#x0*3e);/gi, ">");
export const neutralizeTags = (text) => {
  if (typeof text !== "string") return text;
  const t = unify(text);
  TAG_RE.lastIndex = 0;
  // Če oznak ni, besedilo ostane točno tako, kot ga je napisal učenec (tudi &lt; in nevidni znaki).
  if (!TAG_RE.test(t) && !/<<\s*(?:META|RA[CČ]UN|KARTICA|IZBIRE)\b/iu.test(t)) return text;
  TAG_RE.lastIndex = 0;
  return t.replace(TAG_RE, (m, slash, name) => `‹${slash}${name}›`).replace(BLOCK_RE, (m, b, body) => `‹‹${b}${body === undefined ? "" : `${body}››`}`);
};
