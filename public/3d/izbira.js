// Skupna logika izbire dela (j, 6. 11.) za vse pregledovalnike (pregledovalnik.js: organi, celice, telesa, kristali …;
// atlas.js). Dve stvari:
//
// 1. Isti del ob menjavi modela ali stanja: najdiIstiDel v public/3d/isti-del.js (skupna z vejo claude/kristali-opis).
// 2. zgodovinaIzbire: sistemski »nazaj« (telefon, brskalnik) najprej zapre izbiro, šele naslednji zapusti pregledovalnik.
//    Ob izbiri doda en vnos v zgodovino (isti naslov, stanje k3Izbira); ko se izbira zapre drugače (×, Esc, tap v
//    prazno, ponoven tap), ta vnos sam vzame nazaj. Preklop med deli ne dodaja vnosov.

/**
 * zapri(): zapre izbiro brez dotika zgodovine (klic ob »nazaj«). vklop: false = brez zgodovine (lekcije).
 * Vrne { odprta(), zaprta(), unici() }: odprta/zaprta pokliče pregledovalnik ob prehodu brez izbire ↔ z izbiro.
 */
export function zgodovinaIzbire({ zapri, vklop = true, okno = globalThis.window } = {}) {
  const prazno = { odprta() {}, zaprta() {}, unici() {}, get vnos() { return false; } };
  if (!vklop || !okno?.history) return prazno;
  const h = okno.history;
  let vnos = false; // naš vnos je na vrhu zgodovine
  let cakam = false; // history.back() poslan, popstate še ni prišel
  let zelim = false; // med čakanjem je bila izbrana nova stvar: vnos dodamo po popstate
  const dodaj = () => {
    try {
      h.pushState({ ...(h.state || {}), k3Izbira: true }, "");
      vnos = true;
    } catch {}
  };
  const naPop = () => {
    if (cakam) {
      cakam = false;
      if (zelim) (zelim = false), dodaj();
      return;
    }
    if (!vnos || h.state?.k3Izbira) return;
    vnos = false;
    zapri();
  };
  okno.addEventListener("popstate", naPop);
  return {
    odprta() {
      if (vnos) return;
      if (cakam) zelim = true;
      else dodaj();
    },
    zaprta() {
      zelim = false;
      if (!vnos) return;
      vnos = false;
      if (h.state?.k3Izbira) {
        cakam = true;
        h.back();
      }
    },
    unici() {
      okno.removeEventListener("popstate", naPop);
    },
    get vnos() {
      return vnos;
    },
  };
}
