// Zagon strani: najprej prevodi, nato moduli strani (v vrstnem redu iz data-moduli).
// <script type="module" src="zagon.js" data-moduli="dropdown.js appearance.js app.js"></script>
// Zakaj: i18n.js je prej čakal na prevode z »top-level await«. Safari (iPad, iPhone) ima napako
// (WebKit 242740): ko več modulov hkrati uvaža modul s top-level await, nekateri stečejo prezgodaj ali
// sploh ne. V slovenščini ni bilo kaj čakati, v drugih jezikih pa se je aplikacija ustavila na pol
// (prevedena besedila brez ikon, seznamov in vsebine). Zato čaka samo ta modul, ki ga nihče ne uvaža.
const tag = document.querySelector("script[data-moduli]");
const mods = (tag?.dataset.moduli || "").split(/\s+/).filter(Boolean).map((m) => new URL(m, document.baseURI).href);
// Najprej prenos modulov strani (brez izvajanja), hkrati s prevodi: brez čakanja v vrsti.
for (const href of mods) {
  const l = document.createElement("link");
  l.rel = "modulepreload";
  l.href = href;
  document.head.append(l);
}
// Neuspel modul ne ustavi ostalih (prej je vsak <script> tekel zase); napaka gre še v window.onerror.
const run = (href) =>
  import(href).catch((e) => {
    console.error("zagon:", href, e);
    setTimeout(() => {
      throw e;
    });
  });
import("./i18n.js")
  .then((m) => m.ready)
  .catch(() => null)
  .then(() => mods.reduce((p, href) => p.then(() => run(href)), Promise.resolve()));
