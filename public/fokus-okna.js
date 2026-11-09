// Okno čez zaslon (role="dialog", aria-modal="true"): fokus gre v okno, Tab in Shift+Tab krožita samo po njem
// (ne po skriti strani pod njim), ob zaprtju se vrne tja, od koder je bil. Več odprtih oken: velja zadnje odprto.
// Okna, ki niso v skladu (oznaka formule #fx-pop, zaklep profila, »Profil je odprt drugje«, geslo računa), imajo
// svoj fokus: vanje ne posegamo.
const SEL = 'a[href], button, input, select, textarea, iframe, canvas[tabindex], [tabindex], [contenteditable]:not([contenteditable="false"]), details > summary:first-of-type, audio[controls], video[controls]';
const DRUGO_OKNO = '[role="dialog"], [role="alertdialog"], [aria-modal="true"], dialog[open], .overlay';
const odprta = [];

export const fokusabilni = (okno) =>
  [...okno.querySelectorAll(SEL)].filter(
    (e) => !e.disabled && e.tabIndex >= 0 && e.getClientRects().length && !e.closest("[hidden], [inert]") && getComputedStyle(e).visibility !== "hidden",
  );

function naTipko(e) {
  const top = odprta.at(-1);
  if (e.key !== "Tab" || !top || !top.okno.isConnected || top.okno.hidden || top.okno.closest("[inert]")) return;
  const a = document.activeElement;
  const notri = !!a && top.okno.contains(a);
  // Fokus je v drugem oknu nad našim (ni v skladu): tisto okno ureja svoj Tab.
  const drugo = !notri && a && a !== document.body ? a.closest(DRUGO_OKNO) : null;
  if (drugo && !odprta.some((v) => v.okno === drugo)) return;
  const f = fokusabilni(top.okno);
  const i = f.indexOf(a);
  if (i >= 0 && !(e.shiftKey ? i === 0 : i === f.length - 1)) return; // znotraj okna, ne na robu: brskalnik
  e.preventDefault();
  if (!f.length) return top.okno.focus({ preventScroll: true });
  let cilj = f.at(e.shiftKey ? -1 : 0); // z roba ali od zunaj: na drugi konec
  // Fokus na elementu okna, ki ni v vrsti (tabindex="-1", npr. razlaga): naslednji oz. prejšnji po položaju v DOM.
  if (notri && i < 0 && a !== top.okno) {
    const za = (x) => a.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING;
    cilj = (e.shiftKey ? f.filter((x) => !za(x)).at(-1) : f.find(za)) || cilj;
  }
  cilj.focus({ preventScroll: true });
}

const fokusabilen = (x) => !!x?.isConnected && !x.disabled && !!x.getClientRects?.().length && !x.closest("[hidden], [inert]");

/** Zadrži fokus v oknu; vrne sprosti({ vrni = true }), ki odstrani zadrževanje in vrne fokus. */
export function zadrziFokus(okno, { zacetni = null, prej = document.activeElement } = {}) {
  const vnos = { okno, prej };
  odprta.push(vnos);
  if (odprta.length === 1) document.addEventListener("keydown", naTipko, true);
  if (!okno.contains(document.activeElement)) {
    if (!zacetni && !okno.hasAttribute("tabindex")) okno.tabIndex = -1;
    (zacetni || fokusabilni(okno)[0] || okno).focus({ preventScroll: true });
  }
  return ({ vrni = true } = {}) => {
    const i = odprta.indexOf(vnos);
    if (i < 0) return;
    odprta.splice(i, 1);
    // Okno pod drugim se zapre prej: zgornje okno ob zaprtju vrne fokus tja, kamor bi ga to okno.
    const nad = odprta[i];
    if (nad && (!nad.prej || okno.contains(nad.prej))) nad.prej = vnos.prej;
    if (!odprta.length) document.removeEventListener("keydown", naTipko, true);
    const a = document.activeElement; // učenec je fokus sam prestavil drugam: tam ostane
    if (vrni && fokusabilen(vnos.prej) && (!a || a === document.body || okno.contains(a) || !a.isConnected)) vnos.prej.focus?.({ preventScroll: true });
  };
}
