// Vrstica napredka med preverjanjem odgovora (j, 2. 11. 2026): pokaže se šele, ko preverjanje traja več
// kot 2 s, in pove, koliko časa je še približno do izida. Ocena je povprečje zadnjih preverjanj na tej
// napravi. Čista logika brez DOM: uporabljata jo splet (app.js) in aplikacija (mobile practice.tsx).

export const SHOW_AFTER = 2000; // ms: krajše preverjanje ostane brez vrstice (samo »Preverjam …«)
const DEFAULT_MS = 6000; // prva ocena, dokler ni izmerjenih preverjanj
const KEEP = 8; // koliko zadnjih trajanj šteje v povprečje

// Pričakovano trajanje iz zadnjih meritev (samo tista nad 2 s, kratka ne kažejo vrstice).
export function expectedMs(history = []) {
  const slow = history.filter((ms) => Number.isFinite(ms) && ms > SHOW_AFTER).slice(-KEEP);
  if (!slow.length) return DEFAULT_MS;
  return Math.round(slow.reduce((a, b) => a + b, 0) / slow.length);
}

// Stanje vrstice ob času elapsed: null = še ne kaži; sicer delež (0–0,95) in sekunde do izida (0 = »še malo«).
// Delež raste enakomerno do pričakovanega časa (90 %), potem se le še počasi bliža 95 %, nikoli 100 %.
export function progressAt(elapsed, expected = DEFAULT_MS) {
  if (elapsed < SHOW_AFTER) return null;
  const exp = Math.max(expected, SHOW_AFTER + 1000);
  const pct = elapsed <= exp ? (0.9 * elapsed) / exp : 0.95 - 0.05 * Math.exp(-(elapsed - exp) / exp);
  const left = Math.ceil((exp - elapsed) / 1000);
  return { pct: Math.min(0.95, pct), left: left > 0 ? left : 0 };
}

// Novo zgodovino po končanem preverjanju (shrani jo klicatelj: localStorage ali pomnilnik aplikacije).
export const addDuration = (history = [], ms) => [...history, Math.round(ms)].slice(-KEEP * 2);
