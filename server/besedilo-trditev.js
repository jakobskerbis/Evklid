// Lahka pravila za besedilo odgovora (vrstice, ki niso trditev, vaje, kratki TeX), brez odvisnosti od strežnika: uvažata
// jih live-check.js in racun.js, racun.js pa tudi skripte brez npm paketov (lean-prevod v GitHubu).

// Vrstice, kjer napačna vrednost lahko stoji namenoma (učenčeva napaka, vprašanje, »če bi …«).
// Tudi učenčev zapis (»Ti si napisal …«), zavrnjeni kandidati (»$x = 1$ odpade«) in poskusi.
export const SKIP_LINE = /napačn|narobe|ne velja|ni enako|nepravil|ni res|ne drži|ni prav|ni pravil|ne ustreza|ne zadošča|odpade|ni rešitev|kandidat|definicijsk|poskus|tvoj|✗|\?|(?<!\p{L})(če|ali|bi|if|wrong|incorrect|you|napisal[a]?|zapisal[a]?|dobil[a]?|izračunal[a]?|extraneous|reject)(?!\p{L})/iu;

// Računi in končne vrednosti (AUDIT-066): vrstica se preskoči kot na main (SKIP_LINE).
export const notClaimAt = (line) => SKIP_LINE.test(String(line || ""));

// »\frac14«, »\frac12 x«, »\sqrt4« brez oklepajev: texToText jih bere narobe, zato koda o njih ne sodi.
export const TEX_SHORT = /\\(?:d|t)?(?:frac|sqrt)(?![a-zA-Z])\s*[^{\s\\[]/;

export const EXERCISE_RE = /(?:^|\n)[ \t>*_]*(?:dodatna vaja|vaja|za vajo|practice(?: exercise)?)[*_ \t]*[:：]/iu;
export const hasExercise = (answer) => EXERCISE_RE.test(String(answer || ""));
