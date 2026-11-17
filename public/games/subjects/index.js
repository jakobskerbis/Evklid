// Pojmi za igre iz drugih predmetov (fizika, kemija …). Vsak predmet ima svojo datoteko;
// dodatni paketi (mat15, mat2, fiz2 …) z izvozom SUBJECT dopolnijo obstoječi predmet.
// Paketi skupaj merijo ~1,5 MB, zato jih ../topics.js ne uvozi statično (lahek zagon, j 17. 11. 2026): seznam
// pojmov brez generatorjev nalog je v meta.js (scripts/igre-pojmi.js), generatorji predmeta pa se naložijo z
// import() šele, ko jih učenec potrebuje (loadSubjects v ../topics.js). Vrstni red je vrstni red pojmov v igrah.
export const PACK_FILES = {
  MAT15: "mat15",
  MAT2: "mat2",
  FIZ2: "fiz2",
  KEM2: "kem2",
  BIO2: "bio2",
  NAR2: "nar2",
  SPO: "spo",
  NIT: "nit",
  NAR: "nar",
  FIZ: "fiz",
  KEM: "kem",
  BIO: "bio",
  GEO: "geo",
  RAC: "rac",
  EKO: "eko",
};

// Brskalnik si neuspel modul zapomni do ponovnega nalaganja strani: nov poskus (npr. po izpadu povezave)
// zato z drugim naslovom (?r=), kot igre v public/app.js.
export const importPack = (key, retry = 0) => import(`./${PACK_FILES[key]}.js${retry ? `?r=${retry}` : ""}`);
