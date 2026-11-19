// Zaznavanje v meritvi Preizkusa 3 (scripts/meri-preizkus3.mjs), ločeno, da ga preizkusi test brez klica modela.
// Prepuščen del ali vprašanje, ali naj nadaljuje (Preizkus 3: »b) pa lahko nato poskusiš sam«, »Ju rešiva po vrsti?«).
export const PREPUSCENO = /(?:[b-e]\)|naloge? [b-e]\)?|ostal\p{L}*|naslednj\p{L}*)[^.\n]{0,60}(?:poskusi\p{L}* sam|lahko poskusiš)|poskusi\p{L}* sam[^.\n]{0,40}[b-e]\)|ali naj nadaljujem|rešujeva (?:po vrsti|eno za drugo)|ju rešiva po vrsti|nadaljujeva z [b-e]\)/iu;
// Zadnja vrstica »Naslednji korak: poskusi sam (podobno nalogo).« je ponudba Vaje po vseh delih, ne prepuščen del.
const VAJA_NA_KONCU = /^\**Naslednji korak:?\**\s*poskusi sam(?: podobno nalogo)?\.?$/i;
export function prepusceno(vidno) {
  const vrstice = String(vidno).trimEnd().split("\n");
  if (VAJA_NA_KONCU.test(vrstice[vrstice.length - 1].trim())) vrstice.pop();
  return PREPUSCENO.test(vrstice.join("\n"));
}
// Ogrodje (Preizkus 3: za OŠ 1.–4. in »samo rezultat« preveč): Podatki, Iščemo, Načrt, Preverba, Preizkus, Zapomni si, Vaja.
export const OGRODJE = /podatki\s*:|iščemo\s*:|načrt\s*:|preverba|preverimo|preizkus\s*:|zapomni si|\bvaja\s*:|naloga (?:je )?preverja/i;
// Seznam vaj (j 17. in 18. 11.): prvi del pravilno rešen z razlago, naslednji ne (ponujeni učencu). Ogrodje je od 5. razreda
// dovoljeno. Ponudba ni vedno v obliki »poskusi sam« (»Začni z b) …: na katero število …?«), zato je ne zahtevamo (izpiše se
// »brez ponudbe«). Rezultat šteje le za »=« ali v krepkem zapisu, da ponovljeno besedilo naloge (»c) 5/6 + 1/4«) ne šteje
// kot rešen b) (= 5/6).
export function rezultati(t) {
  const s = String(t);
  const kosi = [];
  for (const m of s.matchAll(/=\s*([^=\n]{0,40})/g)) kosi.push(m[1]);
  for (const m of s.matchAll(/\*\*([^*\n]{1,120})\*\*/g)) kosi.push(m[1]);
  return kosi.join("\n");
}
export const seznamOk = (deli, znakov) => Boolean(deli[0]) && !deli.slice(1).some(Boolean) && znakov > 80;
// Vodenje: potrditev napačnega koraka na začetku drugega odgovora (tudi za nagovorom »Ana, prav …«).
export const POTRDIL = /^\s*(?:\*\*)?(?:[A-ZČŠŽ]\p{L}+,\s*)?(?:prav|pravilno|odlično|bravo|tako je|super|drži|dobro|lepo|res je|točno|da\b)/iu;
// Vodenje: vsak odgovor ima vprašanje ali v zadnjem odstavku (brez samostojnih $$…$$) navodilo učencu na začetku stavka
// (»Zapiši …«, »Najprej mi v svojih besedah povej …«); vrne razlog ali "".
const EDNINA = ["zapiši", "povej", "poskusi", "naštej", "izračunaj", "preveri", "razmisli", "pomisli", "napiši", "nariši", "vstavi", "reši", "poglej", "uporabi", "pretvori", "poišči", "primerjaj", "nadaljuj", "oceni", "preberi", "določi"];
// Dvojina in množina (-ita/-ite; pri -j: -jta/-jte).
const OBLIKE = EDNINA.flatMap((g) => (g.endsWith("j") ? [g, `${g}ta`, `${g}te`] : [g, `${g}ta`, `${g}te`, `${g.slice(0, -1)}ita`, `${g.slice(0, -1)}ite`]));
const UVOD = String.raw`(?:[A-ZČŠŽ]\p{L}+,\s*)?(?:(?:najprej|zdaj|sedaj|nato|potem|še|prosim|torej|kar)\s+)*(?:(?:mi|nama|nam)\s+)?(?:(?:v svojih besedah|s svojimi besedami)\s+)?`;
const NALOGA_UCENCU = new RegExp(String.raw`(?:^|[.!:;]\s+|\n\s*)(?:\*\*)?${UVOD}(?:${OBLIKE.join("|")})(?![\p{L}])`, "iu");
export function vodenjeBrezVprasanja(t) {
  const s = String(t).trim();
  if (/\?/.test(s)) return "";
  const odstavki = s.split(/\n\s*\n/).filter((o) => !/^\s*\$\$[\s\S]*\$\$\s*$/.test(o));
  return NALOGA_UCENCU.test(odstavki[odstavki.length - 1] || "") ? "" : "BREZ VPRAŠANJA";
}
