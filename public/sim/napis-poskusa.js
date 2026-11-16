// Napis pred besedilom »try« pod simulacijo, 3D modelom ali demom (docs/kakovost.md §3; j, 12. 11. 2026).
// Prej je bil povsod »Poskusi:«, ki se bere tudi kot samostalnik (poskusi = eksperimenti). Zdaj sta dva napisa;
// odločitev je zapisana v podatkih, ne uganjena iz besed:
// - niz "…"                → »Preizkusi:« (učenec nekaj naredi v simulaciji/modelu: nastavi, premakni, klikni,
//                             izmeri, poišči, napovej in preveri; tudi vprašanje, na katero odgovori z upravljanjem simulacije);
// - { razmisli: "…" }      → »Razmisli:« (le vprašanje za razmislek, odgovor ni v simulaciji).
// V naborih za razvrščanje (nar-data.js, bio-data.js) je to polje `razmisli` namesto `try`.
// Ključa i18n: sc.try (»Preizkusi:«) in sc.think (»Razmisli:«).
export const NAPISA = { preizkusi: "Preizkusi:", razmisli: "Razmisli:" };

// Vrne { vrsta: "preizkusi" | "razmisli", kljuc, napis, besedilo } ali null, če besedila ni.
export function napisPoskusa(x) {
  if (typeof x === "string") return x.trim() ? { vrsta: "preizkusi", kljuc: "sc.try", napis: NAPISA.preizkusi, besedilo: x } : null;
  if (x && typeof x.razmisli === "string" && x.razmisli.trim()) return { vrsta: "razmisli", kljuc: "sc.think", napis: NAPISA.razmisli, besedilo: x.razmisli };
  return null;
}
