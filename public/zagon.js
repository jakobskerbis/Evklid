// Zagon strani: najprej prevodi, nato moduli strani (v vrstnem redu iz data-moduli).
// <script type="module" src="zagon.js" data-moduli="dropdown.js appearance.js app.js"></script>
// Zakaj: i18n.js je prej čakal na prevode z »top-level await«. Safari (iPad, iPhone) ima napako
// (WebKit 242740): ko več modulov hkrati uvaža modul s top-level await, nekateri stečejo prezgodaj ali
// sploh ne. V slovenščini ni bilo kaj čakati, v drugih jezikih pa se je aplikacija ustavila na pol
// (prevedena besedila brez ikon, seznamov in vsebine). Zato čaka samo ta modul, ki ga nihče ne uvaža.
import { ready } from "./i18n.js";

const tag = document.querySelector("script[data-moduli]");
const mods = (tag?.dataset.moduli || "").split(/\s+/).filter(Boolean).map((m) => new URL(m, document.baseURI).href);
// Moduli se prenašajo hkrati s prevodi, izvedejo pa se šele, ko so prevodi naloženi.
for (const href of mods) {
  const l = document.createElement("link");
  l.rel = "modulepreload";
  l.href = href;
  document.head.append(l);
}
mods
  .reduce((p, href) => p.then(() => import(href)), ready.catch(() => null))
  .catch((e) => console.error("zagon:", e));
