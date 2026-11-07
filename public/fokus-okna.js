// Okno čez zaslon (role="dialog", aria-modal="true"): fokus gre v okno, Tab in Shift+Tab krožita samo po njem
// (ne po skriti strani pod njim), ob zaprtju se vrne tja, od koder je bil. Več odprtih oken: velja zadnje odprto.
const SEL = 'a[href], button, input, select, textarea, iframe, canvas[tabindex], [tabindex], [contenteditable="true"]';
const odprta = [];

export const fokusabilni = (okno) =>
  [...okno.querySelectorAll(SEL)].filter((e) => !e.disabled && e.tabIndex >= 0 && e.getClientRects().length && !e.closest("[hidden], [inert]"));

function naTipko(e) {
  const top = odprta.at(-1);
  if (e.key !== "Tab" || !top || !top.okno.isConnected || top.okno.hidden) return;
  const f = fokusabilni(top.okno);
  const i = f.indexOf(document.activeElement);
  if (i >= 0 && !(e.shiftKey ? i === 0 : i === f.length - 1)) return; // znotraj okna, ne na robu: brskalnik
  const a = document.activeElement;
  if (i < 0 && a !== top.okno && top.okno.contains(a)) return; // gradnik z lastnim fokusom (tabindex="-1")
  e.preventDefault();
  (f.at(e.shiftKey ? -1 : 0) || top.okno).focus({ preventScroll: true });
}

/** Zadrži fokus v oknu; vrne sprosti({ vrni = true }), ki odstrani zadrževanje in vrne fokus. */
export function zadrziFokus(okno, { zacetni = null, prej = document.activeElement } = {}) {
  const vnos = { okno };
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
    if (!odprta.length) document.removeEventListener("keydown", naTipko, true);
    const a = document.activeElement; // učenec je fokus sam prestavil drugam: tam ostane
    if (vrni && prej?.isConnected && (!a || a === document.body || okno.contains(a) || !a.isConnected)) prej.focus?.({ preventScroll: true });
  };
}
