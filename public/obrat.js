// Bralni položaj ostane ob obratu zaslona (UX PR 2, docs/NACRT-UX-UI.md: »izguba stanja pri menjavi orientacije«).
// Ob obratu se besedilo prelomi drugače, zato isti scrollTop pokaže drug odstavek, klepet na dnu pa ni več na dnu
// (zadnje sporočilo skrito pod vrstico za pisanje; 390 × 844 → 844 × 390: 366 px). Brskalnik to na iOS ne popravi sam
// (Safari nima overflow-anchor), zato si za vsak drsni del ob koncu drsenja zapomnimo element na vrhu in ali je bil
// na dnu; po obratu ga vrnemo na isto mesto. Nov modul, ker noben obstoječi ne skrbi za vse drsne dele hkrati
// (app.js drži dno samo za nova sporočila v klepetu, textbook.js samo za lekcijo).
const sledeni = new Map(); // drsni element → { dno, sidro, odmik }
const NA_DNU = 8; // px: »na dnu« (app.js za nova sporočila uporablja 80 px, tu je strožje, da obrat ne premakne bralca)
// Drsni deli z najnovejšim spodaj (klepet): ko gre vsebina cela na zaslon (ne drsi), so tudi »na dnu«.
const DNO_NAJPREJ = "#messages";

// Element na vrhu vidnega dela: med otroki prvi, ki sega pod zgornji rob; v visok vsebnik se spustimo.
function sidroV(sc) {
  const vrh = sc.getBoundingClientRect().top;
  let el = sc;
  for (let globina = 0; globina < 12; globina++) {
    let nasel = null;
    for (const c of el.children) {
      const r = c.getBoundingClientRect();
      if (r.height && r.bottom > vrh + 1) {
        nasel = c;
        break;
      }
    }
    if (!nasel) break;
    el = nasel;
    // Majhen element (odstavek, vrstica) je dobro sidro; velik vsebnik (lekcija, seznam) razdelimo naprej.
    if (el.getBoundingClientRect().height <= sc.clientHeight / 2 || !el.children.length) break;
  }
  return el === sc ? null : el;
}

function zapomni(sc) {
  if (!sc.isConnected || !sc.clientHeight) return sledeni.delete(sc);
  const dno = sc.scrollHeight - sc.clientHeight - sc.scrollTop <= NA_DNU && (sc.scrollTop > 0 || sc.matches(DNO_NAJPREJ));
  const sidro = dno || sc.scrollTop <= 0 ? null : sidroV(sc);
  sledeni.delete(sc); // na konec: pri več kot 12 odpade najdlje nedrsani, ne prvi sledeni
  sledeni.set(sc, { dno, sidro, odmik: sidro ? sidro.getBoundingClientRect().top - sc.getBoundingClientRect().top : 0 });
  if (sledeni.size > 12) sledeni.delete(sledeni.keys().next().value); // samo nedavni drsni deli
}

function obnovi() {
  for (const [sc, s] of sledeni) {
    if (!sc.isConnected || !sc.clientHeight) continue;
    if (s.dno) sc.scrollTop = sc.scrollHeight;
    else if (s.sidro?.isConnected && s.sidro.getClientRects().length) sc.scrollTop += s.sidro.getBoundingClientRect().top - sc.getBoundingClientRect().top - s.odmik;
  }
}

/** Ob zagonu (app.js): sledi drsenju in ob obratu (ali veliki spremembi širine) vrne bralni položaj. */
export function initObrat() {
  const casi = new WeakMap();
  let obracam = false;
  addEventListener(
    "scroll",
    (e) => {
      const sc = e.target === document ? document.scrollingElement : e.target;
      if (!(sc instanceof Element) || obracam) return;
      clearTimeout(casi.get(sc));
      casi.set(sc, setTimeout(() => zapomni(sc), 120));
    },
    { capture: true, passive: true },
  );
  let w = innerWidth;
  let h = innerHeight;
  let t = 0;
  addEventListener("resize", () => {
    const obrat = innerWidth > innerHeight !== w > h || Math.abs(innerWidth - w) > 80;
    w = innerWidth;
    h = innerHeight;
    if (!obrat) return;
    // Kratek pogovor, ki pred obratom ni drsel (scrollTop 0, zato ni sprožil drsenja in ni sleden), je bil cel na
    // zaslonu z zadnjim sporočilom vred: po obratu naj bo zadnje sporočilo spet vidno, ne skrito pod vrstico za pisanje.
    for (const el of document.querySelectorAll(DNO_NAJPREJ))
      if (!sledeni.has(el) && el.scrollTop <= 0 && el.querySelector(".msg")) sledeni.set(el, { dno: true, sidro: null, odmik: 0 });
    if (!sledeni.size) return;
    // Drsenje, ki ga sproži sam obrat (brskalnik obreže scrollTop), ne prepiše zapomnjenega položaja.
    obracam = true;
    requestAnimationFrame(obnovi);
    clearTimeout(t);
    // Še enkrat, ko se po obratu izrišejo pozni deli (KaTeX, slike, plošča za vnos), nato spet sledimo.
    t = setTimeout(() => {
      obnovi();
      obracam = false;
      for (const sc of [...sledeni.keys()]) zapomni(sc); // kopija: zapomni premakne vnos na konec
    }, 300);
  });
}

export const _zaTest = { sledeni, zapomni, obnovi };
