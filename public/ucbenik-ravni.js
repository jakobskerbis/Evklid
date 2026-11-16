// Učbenik, filtri predmet / raven (j 2026-11-14): vrstica predmetov pokaže le predmete, ki imajo učbenik na ravni
// izbranega učbenika. Naravoslovje je predmet OŠ (6. in 7. razred), zato ga pri srednji šoli in tekmovanjih ni;
// Biologija nima tekmovalnega učbenika. Velja samo za slovenske ravni; študijski program (PROG) in regijski učbeniki
// (ena raven na predmet) ostanejo kot prej.
const RAVNI = ["OS", "SS", "TEK"];

// subjects: [[ključ, ime], …] vseh učbenikov; books: seznam učbenikov; book: izbrani učbenik.
export function predmetiNaRavni(subjects, books, book) {
  const raven = book?.school;
  if (!RAVNI.includes(raven)) return subjects;
  return subjects.filter(([k]) => k === "PROG" || k === book.subject || books.some((b) => b.subject === k && b.school === raven));
}

// Ob menjavi predmeta ostane izbrana raven, če jo novi predmet ima (sicer null: privzeta izbira).
export function knjigaNaRavni(books, subject, raven) {
  return (raven && books.find((b) => b.subject === subject && b.school === raven)?.key) || null;
}
