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
// Seznam vaj (j 17. in 18. 11.): prvi del pravilno rešen, naslednji ne (ponujeni učencu). Ogrodje je od 5. razreda dovoljeno.
// Ponudba ni vedno v obliki »poskusi sam« (»Začni z b) …: na katero število …?«), zato je ne zahtevamo.
export const seznamOk = (deli) => Boolean(deli[0]) && !deli.slice(1).some(Boolean);
// Vodenje: vsak odgovor ima vprašanje ali v zadnjem odstavku nalogo za učenca (»Zapiši …«, »povej …«); vrne razlog ali "".
const NALOGA_UCENCU = /(?<![\p{L}])(?:zapiši|povej|poskusi|naštej|izračunaj|preveri|razmisli|pomisli|napiši|določi|nariši)(?![\p{L}])/iu;
export function vodenjeBrezVprasanja(t) {
  const s = String(t).trim();
  const zadnji = s.split(/\n\s*\n/).pop();
  return /\?/.test(s) || NALOGA_UCENCU.test(zadnji) ? "" : "BREZ VPRAŠANJA";
}
