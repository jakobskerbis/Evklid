// Povezave v besedilu, ki ga izriše RichText (odgovori inštruktorja v naravnem klepetu, lekcije).
// Čiste funkcije brez React Native: uporabljata jih src/lib/rich.ts in src/components/RichText.tsx,
// preizkus test/mobile-rich-povezave.test.js.
// - Povezava (<a href>) nastane samo za http(s), mailto in tel. Vse drugo (tudi autolink <…:…>) ostane besedilo.
// - Shema se preveri na naslovu po dekodiranju znakovnih referenc in brez nevidnih znakov. V href gre naslov
//   z dekodiranimi le pravimi referencami (s podpičjem, kot jih bere brskalnik) in brez tabulatorjev, novih vrstic
//   ter presledkov na robovih (kot jih odstrani brskalnik), & in " so ubežani. Shema, ki jo brskalnik razbere iz
//   href, je zato ista kot preverjena (ali je ni in je naslov relativen). Parametri kot »&tab=2« ostanejo celi.

const DOVOLJENO = /^(https?:|mailto:|tel:)/i;
const ATR = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const atr = (s) => String(s).replace(/[&<>"']/g, (c) => ATR[c]);

// Pogoste znakovne reference v naslovu (&#106;, &#x09;, &amp;, &colon; …). Nedekodirane ostanejo dobesedno
// (& se ob izpisu ubeži), zato tudi neznana referenca ne more spremeniti sheme.
const IMENA = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", colon: ":", tab: "\t", newline: "\n", nbsp: "\u00a0" };
const dekodiraj = (s, strogo = false) =>
  s.replace(strogo ? /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi : /&(#x[0-9a-f]+|#\d+|[a-z]+);?/gi, (m, r) => {
    if (r[0] === "#") {
      const n = r[1] === "x" || r[1] === "X" ? parseInt(r.slice(2), 16) : parseInt(r.slice(1), 10);
      return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
    }
    const v = IMENA[r.toLowerCase()];
    return v === undefined ? m : v;
  });

// Presledki, kontrolni znaki (C0, DEL, C1) in nevidni znaki (ničelne širine, smer besedila, BOM) kjer koli.
const NEVIDNI = /[\u0000-\u0020\u007f-\u00a0\u00ad\u1680\u180e\u2000-\u200f\u2028-\u202f\u205f-\u206f\u3000\ufeff]/g;

// Naslov za href, če je dovoljen (http, https, mailto, tel), sicer null.
export function varnaPovezava(href) {
  if (typeof href !== "string") return null;
  let s = href;
  // Preverjanje: dvakrat (&amp;#106; → &#106; → j), tudi reference brez podpičja, brez vseh nevidnih znakov.
  for (let i = 0; i < 2; i++) s = dekodiraj(s);
  if (!DOVOLJENO.test(s.replace(NEVIDNI, ""))) return null;
  const out = dekodiraj(href, true).replace(/[\t\n\r]/g, "").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g, "");
  return DOVOLJENO.test(out) ? out : null;
}

// Kam gre dotaknjeni naslov v WebView besedila: "splet" (vgrajeni brskalnik), "sistem" (mailto, tel → Linking)
// ali null (ne odpre se nič).
export function vrstaPovezave(url) {
  const s = varnaPovezava(url);
  if (!s) return null;
  return /^https?:/i.test(s) ? "splet" : "sistem";
}

// Izris povezave za marked (renderer.link): <a> samo za dovoljen naslov, sicer le besedilo povezave.
// this.parser je razčlenjevalnik marked (marked ≥ 13: izrisovalnik dobi žeton).
export function izrisPovezave(token) {
  const text = this.parser.parseInline(token.tokens || []);
  const href = varnaPovezava(token.href);
  if (!href) return text;
  const title = token.title ? ` title="${atr(token.title)}"` : "";
  return `<a href="${atr(href)}"${title}>${text}</a>`;
}
