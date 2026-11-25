// Ikone v <head> strani, ki jih izdela strežnik (tisk, gradiva, predračun ...), enake kot v public/index.html.
// Brez njih Chrome (zlasti na Androidu) pokaže star /favicon.ico iz svojega predpomnilnika (akademski klobuček).
// Ob novem logotipu zamenjaj IKONE_VERZIJA tukaj in ?v=… v public/*.html (test/logotip.test.js preveri ujemanje).
export const IKONE_VERZIJA = "kristal";
const v = `?v=${IKONE_VERZIJA}`;
export const IKONA_PNG = `/icons/icon-192.png${v}`;
export const IKONE_HEAD =
  `<link rel="icon" type="image/svg+xml" href="/icons/favicon.svg${v}">` +
  `<link rel="icon" type="image/png" href="${IKONA_PNG}">` +
  `<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png${v}">`;
