// Vodoravna tabela: oznaka v prvem stolpcu, ena vrstica vrednosti in vsaj 6 stolpcev (relativne atomske mase,
// gostote snovi, predpone, vrednosti x | 1 | 2 | …). Na telefonu bi se pomikala vstran (KEM-SS: 934 px pri 360 px),
// zato jo izrišemo kot stolpce, ki se prelomijo v več vrstic; na širokem zaslonu je videti kot tabela (j: nič se ne
// pomika vstran, nikjer). Uporabljata jo aplikacija (public/rich.js) in tisk (server/textbook-print.js).
// inner: notranjost <table> z že izrisanimi formulami. Vrne HTML ali null, če tabela ni vodoravna.
const VRSTICA = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
const CELICA = /<(td|th)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g;
// Ulomek ali koren v vrstici: vse celice te vrstice dobijo višino zanj, da so vrstice stolpcev poravnane.
// Le ena vrstica vrednosti: pri več vrsticah bi stolpci, prelomljeni v novo vrsto, ostali brez imen vrstic
// (taka tabela se na ozkem zaslonu obrne, obrnjenaTabela spodaj).
const VISOKA = /class="[^"]*\b(?:mfrac|sqrt)\b/;

export const MIN_STOLPCEV = 6;

// Celice prestavimo z regularnimi izrazi po čiščenju (DOMPurify): atribut z »<« ali »>« (starejši brskalniki ga ne
// ubežijo) bi lahko vseboval »</td><td>« in premaknil oznake iz atributa v stran; taka tabela ostane tabela.
export const varnaZaPrelom = (html) => !/=\s*"[^"]*[<>]/.test(html);

// Celice vodoravne tabele z 1 do 3 vrsticami vrednosti (prva je glava) ali null.
function celice(inner) {
  if (!/<thead/.test(inner) || !varnaZaPrelom(inner)) return null;
  const vrstice = [...inner.matchAll(VRSTICA)].map((m) => [...m[1].matchAll(CELICA)].map((c) => c[2].trim()));
  if (vrstice.length < 2 || vrstice.length > 4) return null;
  const n = vrstice[0].length;
  return n < MIN_STOLPCEV || vrstice.some((v) => v.length !== n) || !vrstice[0][0] ? null : vrstice;
}

export function vodoravnaTabela(inner) {
  const vrstice = celice(inner);
  if (vrstice?.length !== 2) return null;
  const visoke = vrstice.map((v) => v.some((c) => VISOKA.test(c)));
  const stolpci = vrstice[0].map(
    (_, s) =>
      `<div class="md-vod-st${s ? "" : " md-vod-leg"}">${vrstice
        .map((v, i) => `<div class="md-vod-c${i ? "" : " md-vod-h"}${visoke[i] ? " md-vod-v" : ""}"><span>${v[s]}</span></div>`)
        .join("")}</div>`,
  );
  return `<div class="md-vod">${stolpci.join("")}</div>`;
}

// Vodoravna tabela z dvema ali tremi vrsticami vrednosti (x | 0 | π/6 | … s sin x, cos x, tan x): na ozkem zaslonu
// jo pokažemo obrnjeno (stolpci postanejo vrstice), na širokem ostane, kot je (ovoj .md-obrni, slog v style.css in
// v tisku). Vrne notranjost obrnjene tabele ali null.
export function obrnjenaTabela(inner) {
  const vrstice = celice(inner);
  if (!vrstice || vrstice.length < 3) return null;
  const vrsta = (s, tag) => `<tr>${vrstice.map((v, i) => `<${tag}${i ? ' align="center"' : ""}>${v[s]}</${tag}>`).join("")}</tr>`;
  return `<thead>${vrsta(0, "th")}</thead><tbody>${vrstice[0].slice(1).map((_, s) => vrsta(s + 1, "td")).join("")}</tbody>`;
}

// Tabela s tremi ali več stolpci (Telo | Površina | Prostornina, Skupina | Formula | Končnica | Primer): vsaka celica
// dobi ime svojega stolpca (data-label), da se na telefonu vrstica zloži v kartico »ime stolpca nad vrednostjo«
// (list formul: public/graph.css, tisk: server/textbook-print.js). Vrne novo notranjost ali null.
// Besedilo celice je že HTML (& in < sta ubežana); v atributu ubežimo še narekovaj. Ostanek oznake po odstranjevanju
// (npr. »<scr<b>ipt«) ne sme ostati: vsak preostali < ali > ubežimo.
const ATRIBUT = (s) => s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const besedilo = (html) => html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

export function oznaciStolpce(inner) {
  const glava = inner.match(/<thead[^>]*>[\s\S]*?<\/thead>/)?.[0];
  if (!glava) return null;
  // Ime z formulo (KaTeX) bi bilo v atributu nečitljivo: tak stolpec ostane brez imena.
  const imena = [...glava.matchAll(CELICA)].map((c) => (/katex/.test(c[2]) ? "" : besedilo(c[2])));
  if (imena.length < 3 || !imena.some(Boolean)) return null;
  return inner.replace(/<tbody[^>]*>[\s\S]*?<\/tbody>/, (telo) =>
    telo.replace(VRSTICA, (vrstica) => {
      let i = 0;
      return vrstica.replace(/<td(\s[^>]*)?>/g, (m, atr = "") => {
        const ime = imena[i++];
        return ime ? `<td${atr} data-label="${ATRIBUT(ime)}">` : m;
      });
    }),
  );
}
