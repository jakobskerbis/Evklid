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
// Presledki pred »/« in za njim niso dve zaporedni zvezdici (»\s*(/?)\s*«): dolg niz presledkov za »<« bi bil kvadraten.
const IGN = "\\p{Default_Ignorable_Code_Point}";
const DVOJNIKI = { a: "а", c: "с", e: "е", i: "іı", j: "ј", o: "оο", p: "р", s: "ѕ", k: "к" };
// »č«/»ć« le kot »c« v »račun« (»<preverjen_račun>«, #1018), ne povsod: »<Način dela …>« je navadno besedilo, ne oznaka
// »nacin« (pregled prevzema, 26. 11.).
const dvojnik = (tag, i) => (DVOJNIKI[tag[i]] || "") + (tag.slice(i - 2, i + 3) === "racun" ? "čć" : "");
const LOCILO = "_\\uFF3F\\s\\-\\u2010-\\u2015";
const znak = (c, i, tag) => (c === "_" ? `[${LOCILO}]` : `[${c}${String.fromCodePoint(c.codePointAt(0) + 0xfee0)}${dvojnik(tag, i)}]`);
const ODPRI = "(?:[<\\uFF1C\\uFE64\\u3008\\u27E8\\u2329\\u02C2]|&lt;?|&#0*60;?|&#x0*3c;?)";
const ZAPRI = "(?:[>\\uFF1E\\uFE65\\u3009\\u27E9\\u232A\\u02C3]|&gt;?|&#0*62;?|&#x0*3e;?)";
const vzorec = (t) => [...t].map((c, i) => znak(c, i, t)).join(`${IGN}*`);
const OZNAKA = new RegExp(
  `${ODPRI}[\\s${IGN}]*(?:(/)[\\s${IGN}]*)?(${HIDDEN_TAGS.map(vzorec).join("|")})(?!${IGN}*[\\p{L}\\p{N}_\\uFF3F])([\\s${IGN}]*${ZAPRI})?`,
  "giu",
);
const ime = (m) => {
  const t = [...m.replace(new RegExp(IGN, "gu"), "").normalize("NFKC").toLowerCase()].map((c) => (/[\s\-\u2010-\u2015]/.test(c) ? "_" : c));
  const ujema = (h) => h.length === t.length && [...h].every((c, i) => c === t[i] || dvojnik(h, i).includes(t[i]));
  return HIDDEN_TAGS.find(ujema) || m; // ne ujema se nobena oznaka: besedilo ostane, kot ga je učenec napisal
};
// Bloki, ki jih strežnik bere iz odgovora modela (server/meta.js: META, KARTICA, RACUN/RAČUN, IZBIRE/CHOICES, ODPRI, GRAF,
// SKICA), dobijo ‹‹ … ›› (AUDIT-065, prevzem #1018): učenec jih ne more podtakniti kot strežnikov preverjen račun, kartico
// ali gumbe. Kot pri oznakah tudi s presledki ali nevidnimi znaki med oklepaji in črkami (»< <RACUN«, »<​<RACUN«,
// »<<​META«), polnoširinsko (»＜＜RACUN«), z &lt; ali cirilskimi dvojniki.
// Cirilske velike črke, ki jih ni med malimi dvojniki zgoraj (»<<МЕТА«).
const VELIKI_DVOJNIKI = { M: "М", T: "Т", B: "В", H: "Н" };
// Velika črka (kot jo bere meta.js), njena polnoširinska oblika in cirilski dvojnik; »C« tudi »Č« (RAČUN).
const crka = (c) => `[${c}${String.fromCodePoint(c.codePointAt(0) + 0xfee0)}${(DVOJNIKI[c.toLowerCase()] || "").toUpperCase()}${VELIKI_DVOJNIKI[c] || ""}${c === "C" ? "Č" : ""}]`;
const blokIme = (n) => [...n].map(crka).join(`${IGN}*`);
const S = `[\\s${IGN}]*`;
const BLOKI = (imena) => imena.map(blokIme).join("|");
// Kot »\b« v meta.js: »<<RACUNč« meta.js prebere kot blok RACUN, zato šteje le črka ASCII, števka ali »_« za imenom.
const KONEC = `(?![A-Za-z0-9_])`;
// »<<IME … >>« (do prvega »>>«). Le velike črke, kot jih bere meta.js, in le, če za njim kje stoji »>>« (meta.js brez
// zaključka bloka ne prebere): »<<Graf funkcije>>«, »cout << META << endl;« ostaneta (pregled prevzema 3).
const BLOK2 = new RegExp(`${ODPRI}${S}${ODPRI}${S}(${BLOKI(["META", "KARTICA", "RACUN", "IZBIRE", "CHOICES", "ODPRI", "GRAF", "SKICA"])})${KONEC}(?:([\\s\\S]{0,1000}?)${ZAPRI}${S}${ZAPRI})?`, "gu");
const ZAKLJUCEK = new RegExp(`${ZAPRI}${S}${ZAPRI}`, "gu");
// Z enim »<« le tam, kjer ga meta.js prebere (pregled prevzema 3): META na začetku vrstice s »subject=« (META_LOOSE_RE)
// in IZBIRE/CHOICES pred »[« (CHOICES_JSON_RE, gumbi); »Kaj pomeni <IZBIRE>?«, »<CHOICES> v XML-ju« ostaneta.
// Pogled nazaj šele za »<« in pogled naprej le v vrstici: linearno.
const TELO1 = `(?:([\\s\\S]{0,1000}?)${ZAPRI}(?:${S}${ZAPRI})?)?`;
const BLOK1 = new RegExp(
  `${ODPRI}(?<=^[ \\t\`*_${IGN}]*${ODPRI})${S}(${BLOKI(["META"])})${KONEC}(?=[^\\n]*subject=)${TELO1}` + `|${ODPRI}${S}(${BLOKI(["IZBIRE", "CHOICES"])})${KONEC}(?=${S}\\[)${TELO1}`,
  "gmu",
);
const cisto = (t) => t.replace(new RegExp(IGN, "gu"), "").normalize("NFKC");
function blok2(t) {
  let zadnji = -1;
  for (const m of t.matchAll(ZAKLJUCEK)) zadnji = m.index;
  return t.replace(BLOK2, (all, name, body, at) => (at > zadnji ? all : `‹‹${cisto(name)}${body === undefined ? "" : `${body}››`}`));
}
export const neutralizeHiddenTags = (text) =>
  typeof text === "string"
    ? blok2(text.replace(OZNAKA, (_, sl, tag, close) => `‹${sl || ""}${ime(tag)}${close ? "›" : ""}`)).replace(BLOK1, (_, n1, b1, n2, b2) => `‹${cisto(n1 ?? n2)}${(b1 ?? b2) === undefined ? "" : `${b1 ?? b2}›`}`)
    : text;
