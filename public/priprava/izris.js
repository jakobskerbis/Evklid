// Čisti pomočniki vmesnika priprave (public/priprava/priprava.js), brez DOM, da jih preveri tudi node --test
// (test/priprava-vmesnik.test.js).
//
// Besedilo iz zapiskov in razlage se izriše kot besedilo, ne kot HTML ali Markdown: vsak znak ostane, kot je
// (Markdown bi iz *x* naredil ležeče in zvezdici skril, iz x_1_ podpisano). Negotovo branje [?] je vedno vidno
// označeno; nič se ne dopolni ali popravi (docs/priprava.md, »Negotovo branje«).

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

// [?] v že ubežanem besedilu → vidna oznaka (isti znaki, samo poudarjeni).
export const NEGOTOVO_HTML = '<mark class="pr-neg">[?]</mark>';
export const oznaciNegotovo = (html) => String(html).split("[?]").join(NEGOTOVO_HTML);

// Besedilo s formulami ($…$): besedilo ubežano, formule z izrisom (renderMath(tex) → HTML) ali, če izrisa ni, kot
// ubežan izvirnik z dolarji. Formula z [?] se ne izriše (KaTeX bi oznako pokvaril), ampak ostane izvirnik z oznako.
// Brez Markdowna in brez HTML iz vira.
export function besediloZFormulami(s, renderMath = null) {
  const src = String(s ?? "");
  const deli = src.split(/(\$[^$\n]+\$)/);
  return deli
    .map((d, i) => {
      if (i % 2 === 0) return oznaciNegotovo(esc(d));
      const tex = d.slice(1, -1);
      if (!renderMath || tex.includes("[?]")) return oznaciNegotovo(esc(d));
      try {
        return `<span class="pr-f">${renderMath(tex)}</span>`;
      } catch {
        return esc(d);
      }
    })
    .join("");
}

// Dnevi med dvema datumoma YYYY-MM-DD (b − a), po koledarju, ne po urah.
export function dniMed(a, b) {
  if (!a || !b) return null;
  const x = Date.parse(`${a}T00:00:00Z`);
  const y = Date.parse(`${b}T00:00:00Z`);
  return Number.isFinite(x) && Number.isFinite(y) ? Math.round((y - x) / 86400000) : null;
}

// Število mest [?] v izsekih vira (izsek.negotovo je seznam negotovih branj).
export function negotovihPoViru(izseki) {
  const m = new Map();
  for (const i of izseki || []) {
    const n = Array.isArray(i.negotovo) ? i.negotovo.length : 0;
    if (n) m.set(i.vir_id, (m.get(i.vir_id) || 0) + n);
  }
  return m;
}

// Stanje teme v napredku (server/priprava/poti.js stanjeOcene) → razred oznake v vmesniku.
export const RAZRED_STANJA = { obvladana: "ok", ponovitev: "ok", ucim: "delno", nova: "ne", zapiski: "siv" };

// Enota »Danes«, ki jo gumb »Nadaljuj« odpre: naslednja iz načrta (nacrt.naslednja), sicer poskusni test danes.
export function naslednjaEnota(nacrt) {
  if (nacrt?.naslednja) return nacrt.naslednja;
  const danes = nacrt?.dnevi?.[0];
  return danes && danes.datum === nacrt.danes ? danes.naloge.find((n) => n.vrsta === "poskusni_test") || null : null;
}
