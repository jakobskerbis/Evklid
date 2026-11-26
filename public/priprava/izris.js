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
  // $$…$$ (izpostavljena formula) pred $…$, da dolarja ne ostaneta kot besedilo.
  const deli = src.split(/(\$\$[^$]+\$\$|\$[^$\n]+\$)/);
  return deli
    .map((d, i) => {
      if (i % 2 === 0) return oznaciNegotovo(esc(d));
      const tex = d.startsWith("$$") ? d.slice(2, -2) : d.slice(1, -1);
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

// Današnji datum YYYY-MM-DD po uri naprave (ne UTC: med polnočjo in 1.00/2.00 v Sloveniji bi bil še včerajšnji).
export function danesLokalno(d = new Date()) {
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Teme, ki jim načrt da največ časa, za kartico po kvizu: najprej najšibkejše po napredku (nova, delno, samo
// zapiski), nato po vrstnem redu načrta; obvladane na koncu. Največ tri imena.
const RANG_STANJA = { nova: 0, ucim: 1, zapiski: 2, ponovitev: 3, obvladana: 4 };
export function fokusTeme(nacrt, teme = []) {
  const stanje = new Map((teme || []).map((x) => [x.id, x.stanje]));
  const vNacrtu = [];
  for (const u of (nacrt?.dnevi || []).flatMap((d) => d.naloge)) {
    if (u.tema && u.vrsta !== "ponovitev" && !vNacrtu.some((x) => x.id === u.tema.id)) vNacrtu.push(u.tema);
  }
  return vNacrtu
    .map((tm, i) => ({ tm, i, r: RANG_STANJA[stanje.get(tm.id)] ?? 1 }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .slice(0, 3)
    .map((x) => x.tm.ime);
}
