// Negotovo branje skenerja (P3-5, načrt »Kakovost pred obsegom«): znak, ki ga model na fotografiji ne prebere zanesljivo,
// ni ugibanje, ampak oznaka [?] v zapisu naloge. Učenec ga popravi (ali izbere eno od možnosti), preden gre naloga v
// reševanje; tako se napačno branje ne pokaže kot matematična napaka. Uporabljata ga strežnik (server/scan.js
// cleanProblems, /scan/solve) in zaslon Skeniraj (public/scan/scan.js).

export const NEJASNO = "[?]";
const MAX_MOZNOSTI = 3;
const MAX_DOLZINA = 12;

export const unclearCount = (s) => String(s ?? "").split(NEJASNO).length - 1;
export const hasUnclear = (s) => String(s ?? "").includes(NEJASNO);

// Možnosti za vsako oznako v besedilu (po vrsti), poravnane na število oznak; nesmiselne vnose zavrže.
export function cleanUnclear(list, n) {
  if (!n) return [];
  const src = Array.isArray(list) ? list : [];
  return Array.from({ length: n }, (_, i) => {
    const opts = Array.isArray(src[i]) ? src[i] : [];
    const out = [];
    for (const o of opts) {
      if (typeof o !== "string") continue;
      const v = o.trim();
      if (!v || v.length > MAX_DOLZINA || hasUnclear(v) || out.includes(v)) continue;
      out.push(v);
      if (out.length === MAX_MOZNOSTI) break;
    }
    return out;
  });
}

// Zamenja i-to oznako [?] (od 0) z vrednostjo; ostalih ne spremeni.
export function fillUnclear(text, i, value) {
  const parts = String(text ?? "").split(NEJASNO);
  if (!Number.isInteger(i) || i < 0 || i >= parts.length - 1) return String(text ?? "");
  return parts.slice(0, i + 1).join(NEJASNO) + value + parts.slice(i + 1).join(NEJASNO);
}

// Položaj prve oznake (za izbiro v polju za vnos), -1 če je ni.
export const firstUnclear = (text) => String(text ?? "").indexOf(NEJASNO);

// HTML zapisa z vidno označenimi mesti (esc: funkcija za ubežne znake HTML).
export const markUnclear = (text, esc) =>
  String(text ?? "")
    .split(NEJASNO)
    .map(esc)
    .join('<mark class="scan-unclear-mark">?</mark>');
