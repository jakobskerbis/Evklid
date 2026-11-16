// Spodnja vrstica (»noga«, #tabbar) se povsod po 3 s neuporabe skrije, ob drsenju pa se pojavi nazaj
// (j 2026-11-14; telefon in tablica na dotik; 3 s namesto 5 s: j 2026-11-15).
//  - Zasloni, kjer je vrstica v postavitvi (Učna pot, Uči se, Tekmovanja, Jaz …): po 3 s zdrsne pod rob (body.tb-mir),
//    drsenje (poteg, kolešček) jo pripelje nazaj (body.tb-vraca, 0,22 s, nato spet v postavitvi).
//  - Zasloni za branje (klepet, tema, kartice, kalkulator, lekcija Učbenika, poskus; touch.css) jo že umikajo; pokaže
//    jo drsenje nazaj gor (body.tb-peek, app.js). Pokazano tu po 3 s skrijemo.
//  - Dotik, tipka ali premik miške je uporaba: dokler je vrstica vidna, čas začne teči znova. Skrito vrne le dotik
//    ob spodnjem robu (tam, kjer je bila; klik pogoltnemo), Tab in miška ob spodnjem robu (ozko okno na računalniku).
//  - Ne skriva se, ko je ni (plošča Piši, uvod, računalnik), med vodičem (kaže nanjo) in s fokusom s tipkovnico v njej.
export const MIROVANJE_MS = 3000;
export const VRNITEV_MS = 240; // malo več kot prehod v touch.css (0,22 s)
// Dogodek »scroll« sam ne vrne vrstice: ko se skrije, pogled zraste in brskalnik lahko sam premakne odmik (scroll),
// kar bi jo takoj spet pokazalo. Šteje poteg prsta, kolešček in tipke za drsenje.
const DRSENJE = ["touchmove", "wheel", "keydown"];
// Tab: s tipkovnico (tudi bralnik zaslona s tipkovnico) mora biti vrstica dosegljiva.
const TIPKE = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", "Tab"]);
const ROB_MISKE = 80; // miška v spodnjih 80 px vrne vrstico (ozko okno na računalniku)
const NE_DRSENJE = "input[type=range], canvas, .pad, .graph-slot";
const UPORABA = ["pointerdown", "pointermove", "touchstart", "input", "scroll"];
// Dotik ob robu gre skozi (vrstica ostane skrita), če je odprto okno ali je pod prstom gumb/povezava (j 2026-11-15):
// prej je prvi dotik »Naprej« v anketi ali »Začni trening« ob dnu pogoltnilo, vrstica pa je zdrsnila čez gumb.
const INTERAKTIVNO = "button, a[href], input, select, textarea, label, [role=button], [tabindex]:not([tabindex='-1'])";
const OKNO = ".iq-wrap, [aria-modal=true], [role=dialog]";

export function nastaviNogo({
  bar,
  body = document.body,
  win = window,
  doc = document,
  ms = MIROVANJE_MS,
  vidna = () => win.getComputedStyle(bar).display !== "none",
  // Zaslon za branje: vrstica je pritrjena (position: fixed) že brez naših razredov.
  branje = () => win.getComputedStyle(bar).position === "fixed",
  vodic = () => !!doc.querySelector("#tour:not([hidden])"),
  okno = () => [...doc.querySelectorAll(OKNO)].some((el) => !el.hidden && el.getClientRects().length > 0),
  skrijPokukano = () => body.classList.remove("tb-peek"),
  sync = () => {},
  zdaj = () => Date.now(),
} = {}) {
  if (!bar) return null;
  let timer = 0;
  let vraca = 0;
  let zadnjic = 0;
  const cls = body.classList;

  function poMiru() {
    timer = 0;
    if (doc.hidden || !vidna()) return; // naslednja uporaba spet nastavi čas
    const fokus = doc.activeElement;
    if (vodic() || (fokus && bar.contains(fokus) && fokus.matches?.(":focus-visible"))) return straza();
    if (cls.contains("tb-vraca")) koncajVrnitev();
    if (branje()) {
      if (cls.contains("tb-peek")) {
        skrijPokukano();
        sync();
      }
      return;
    }
    if (cls.contains("tb-peek")) skrijPokukano(); // ostanek z zaslona za branje, sicer --tabbar-h ne bi bil 0
    cls.add("tb-mir");
    sync();
  }
  function straza() {
    win.clearTimeout(timer);
    timer = win.setTimeout(poMiru, ms);
  }
  function koncajVrnitev() {
    win.clearTimeout(vraca);
    vraca = 0;
    cls.remove("tb-vraca");
    sync();
  }
  function vrni() {
    cls.remove("tb-mir");
    // Na zaslon za branje smo prišli s skrito vrstico: tam velja njegovo pravilo (isti poteg jo pokaže v app.js).
    if (branje()) return sync();
    cls.add("tb-vraca");
    sync();
    win.clearTimeout(vraca);
    vraca = win.setTimeout(koncajVrnitev, VRNITEV_MS);
  }
  let zacY = null;
  // Poteg prsta šteje kot drsenje šele po 10 px navpično (tresljaj ob dotiku ni drsenje), drsnik ali risba pa ne.
  const poteg = (e) => {
    const y = e.touches?.[0]?.clientY;
    return y != null && zacY != null && Math.abs(y - zacY) >= 10 && !e.target?.closest?.(NE_DRSENJE);
  };
  // Dotik tam, kjer je bila vrstica: jo pokaže, klik pa pogoltnemo, da ne odpre vsebine, ki je zdaj pod robom.
  let pogoltni = 0;
  const obRobu = (e, rob) => e.clientY != null && e.clientY >= win.innerHeight - rob;
  function uporaba(e) {
    if (e.type === "touchstart") zacY = e.touches?.[0]?.clientY ?? null;
    if (cls.contains("tb-mir")) {
      let tap = e.type === "pointerdown" && obRobu(e, bar.offsetHeight || 64);
      if (tap) {
        const cilj = e.target?.closest?.(INTERAKTIVNO);
        if ((cilj && !bar.contains(cilj)) || okno()) return straza(); // dotik velja vsebini, vrstica ostane skrita
      }
      const drsi =
        e.type === "wheel" ||
        tap ||
        (e.type === "touchmove" && poteg(e)) ||
        (e.type === "keydown" && TIPKE.has(e.key)) ||
        (e.type === "pointermove" && e.pointerType === "mouse" && obRobu(e, ROB_MISKE));
      if (!drsi) return; // skrito vrstico vrne drsenje (ali dotik ob spodnjem robu)
      if (tap) pogoltni = zdaj();
      vrni();
    }
    // Premiki in drsenje pridejo v rafalih: čas obnovimo največ 5-krat na sekundo.
    const t = zdaj();
    if (timer && t - zadnjic < 200 && ["pointermove", "touchmove", "wheel", "scroll"].includes(e.type)) return;
    zadnjic = t;
    straza();
  }
  function klik(e) {
    if (!pogoltni) return;
    const svez = zdaj() - pogoltni < 800;
    pogoltni = 0;
    if (!svez) return;
    e.preventDefault();
    e.stopPropagation();
  }
  // Zajemanje na oknu: pred poslušalci v app.js (poteg, kolešček), ki vrstico že vidijo v postavitvi.
  for (const ime of [...DRSENJE, ...UPORABA]) win.addEventListener(ime, uporaba, { capture: true, passive: true });
  win.addEventListener("click", klik, true);
  doc.addEventListener("visibilitychange", () => !doc.hidden && straza());
  straza();
  return {
    poMiru,
    uporaba,
    klik,
    ustavi() {
      win.removeEventListener("click", klik, true);
      win.clearTimeout(timer);
      win.clearTimeout(vraca);
      for (const ime of [...DRSENJE, ...UPORABA]) win.removeEventListener(ime, uporaba, true);
    },
  };
}
