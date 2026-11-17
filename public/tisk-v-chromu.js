// Strani za tisk, ki jih aplikacija odpre v privzetem brskalniku telefona (navadno Chrome; mobile/src/app/web.tsx),
// j 17. 11. 2026: WebView in vgrajeni zavihek brskalnika (Custom Tab) ne znata tiskati, zato »Shrani kot PDF« tam
// ne naredi nič. Lekcija za tisk (/ucbenik/…), povzetek na eni strani (/gradiva/povzetek/…), povezava za tisk
// delovnega lista, poskusa ali projekta (/gradiva/tisk/<žeton>, server/gradiva.js) in vnaprej izdelan PDF
// (/ucbenik-pdf/…), ker ta ob zastarelem PDF-ju preusmeri na tisk v brskalniku (server/app.js).
const POTI = ["/ucbenik/", "/ucbenik-pdf/", "/gradiva/povzetek/", "/gradiva/tisk/"];

export function zaTisk(url, origin) {
  const u = String(url || "");
  const o = String(origin || "").replace(/\/+$/, "");
  if (!o || !u.startsWith(o + "/")) return false;
  const pot = u.slice(o.length).split(/[?#]/)[0];
  return POTI.some((p) => pot.startsWith(p) && pot.length > p.length);
}
