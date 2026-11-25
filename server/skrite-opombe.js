// Skrite opombe za inštruktorja v sporočilih (učenec jih ne vidi): pola, preverjen račun, povzetek pogovora,
// lekcija iz učbenika, zamenjava načina A/B (server/nacin.js), stanje poskusa ali 3D modela (server/ucni-kontekst.js). En seznam, da jih vsa mesta, ki berejo učenčevo besedilo, enako izpustijo.
export const HIDDEN_TAGS = ["kontekst_pole", "preverjen_racun", "povzetek_pogovora", "lekcija_ucbenika", "nacin", "orodje", "kontekst_ucenja"];
const HEADS = HIDDEN_TAGS.map((t) => `<${t}>`);
export const isHiddenNote = (text) => typeof text === "string" && HEADS.some((h) => text.startsWith(h));

// Učenčevo besedilo v klepetu (vpisano ali prilepljeno, tudi tapnjena izbira) ne sme nositi oznak skritih opomb: model bi
// ponarejeno »<preverjen_racun>…« imel za zaupanja vredno opombo aplikacije, vmesnik pa bi sporočilo skril (IN-12).
// Oznako spremenimo v »‹preverjen_racun›«: učenec še vidi, kaj je napisal, model pa ne dobi oznake. Ujame tudi
// zapise z velikimi črkami, presledki, polnoširinskimi znaki, cirilskimi dvojniki črk, podobnimi oklepaji (〈 ⟨ ˂,
// &lt;), presledkom ali pomišljajem namesto »_« ter nevidne znake (ZWSP, U+2063, izbirniki različic …) med znaki
// oznake. Nevidni znaki drugje ostanejo (ZWJ v emojijih, npr. 👨‍👩‍👧).
const IGN = "\\p{Default_Ignorable_Code_Point}";
const DVOJNIKI = { a: "а", c: "с", e: "е", i: "іı", j: "ј", o: "оο", p: "р", s: "ѕ", k: "к" };
const LOCILO = "_\\uFF3F\\s\\-\\u2010-\\u2015";
const znak = (c) => (c === "_" ? `[${LOCILO}]` : `[${c}${String.fromCodePoint(c.codePointAt(0) + 0xfee0)}${DVOJNIKI[c] || ""}]`);
const ODPRI = "(?:[<\\uFF1C\\uFE64\\u3008\\u27E8\\u2329\\u02C2]|&lt;?|&#0*60;?|&#x0*3c;?)";
const ZAPRI = "(?:[>\\uFF1E\\uFE65\\u3009\\u27E9\\u232A\\u02C3]|&gt;?|&#0*62;?|&#x0*3e;?)";
const vzorec = (t) => [...t].map(znak).join(`${IGN}*`);
const OZNAKA = new RegExp(
  `${ODPRI}[\\s${IGN}]*(/?)[\\s${IGN}]*(${HIDDEN_TAGS.map(vzorec).join("|")})(?!${IGN}*[\\p{L}\\p{N}_\\uFF3F])([\\s${IGN}]*${ZAPRI})?`,
  "giu",
);
const ime = (m) => {
  const t = [...m.replace(new RegExp(IGN, "gu"), "").normalize("NFKC").toLowerCase()].map((c) => (/[\s\-\u2010-\u2015]/.test(c) ? "_" : c));
  const ujema = (h) => h.length === t.length && [...h].every((c, i) => c === t[i] || (DVOJNIKI[c] || "").includes(t[i]));
  return HIDDEN_TAGS.find(ujema) || t.join("");
};
export const neutralizeHiddenTags = (text) =>
  typeof text === "string" ? text.replace(OZNAKA, (_, sl, tag, close) => `‹${sl}${ime(tag)}${close ? "›" : ""}`) : text;
