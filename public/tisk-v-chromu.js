// Strani za tisk, ki jih aplikacija za Android odpre v Chromu (mobile/src/app/web.tsx), j 17. 11. 2026: WebView in
// vgrajeni zavihek brskalnika (Custom Tab) ne znata tiskati, zato »Shrani kot PDF« tam ne naredi nič. Chrome zna.
// Lekcija za tisk (/ucbenik/…), povzetek na eni strani (/gradiva/povzetek/…) in povezava za tisk delovnega lista,
// poskusa ali projekta (/gradiva/tisk/<žeton>, server/gradiva.js). Vnaprej izdelan PDF (/ucbenik-pdf/…) ne: tega
// vgrajeni zavihek prenese.
const POTI = ["/ucbenik/", "/gradiva/povzetek/", "/gradiva/tisk/"];

export function zaTisk(url, origin) {
  const u = String(url || "");
  const o = String(origin || "").replace(/\/+$/, "");
  if (!o || !u.startsWith(o + "/")) return false;
  const pot = u.slice(o.length).split(/[?#]/)[0];
  return POTI.some((p) => pot.startsWith(p) && pot.length > p.length);
}
