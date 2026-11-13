// Gradniki podatkov o izpitih (exam-data.js in exam-data-*.js): teme iz banke in skupine
// vprašanj poskusnega izpita. Nov izpit je samo podatek: teme, format, poskusni izpit, jezik.
export const B = (subject, slug) => `${subject}-EXB/${slug}`;
export const M = (slug) => B("MAT", slug);
export const F = (slug) => B("FIZ", slug);
export const K = (slug) => B("KEM", slug);
export const Bi = (slug) => B("BIO", slug);

// Poskusni izpit: skupine vprašanj { n, format: "choice" | "numeric", level, points, penalty }.
// scale: [min, max, korak] lestvica izpita; grades: [[najmanj %, ocena], …] od najboljše navzdol.
// options: število možnosti pri izbirnih (privzeto 4, ENEM 5).
export const group = (n, format, level, points, penalty = 0, options = 0) => ({ n, format, level, points, penalty, ...(options ? { options } : {}) });
