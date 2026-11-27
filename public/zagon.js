// Zagon strani: najprej prevodi, nato moduli strani (v vrstnem redu iz data-moduli).
// <script type="module" src="zagon.js" data-moduli="dropdown.js appearance.js app.js"></script>
// Zakaj: i18n.js je prej čakal na prevode z »top-level await«. Safari (iPad, iPhone) ima napako
// (WebKit 242740): ko več modulov hkrati uvaža modul s top-level await, nekateri stečejo prezgodaj ali
// sploh ne. V slovenščini ni bilo kaj čakati, v drugih jezikih pa se je aplikacija ustavila na pol
// (prevedena besedila brez ikon, seznamov in vsebine). Zato čaka samo ta modul, ki ga nihče ne uvaža.
import "./dotik.js"; // pridržana povezava: brez oblačka in menija (public/dotik.js)

const tag = document.querySelector("script[data-moduli]");
const mods = (tag?.dataset.moduli || "").split(/\s+/).filter(Boolean).map((m) => new URL(m, document.baseURI).href);
// Pristajalna stran s strežnika (public/zacetek.js): moduli se začnejo prenašati šele po njenem prvem izrisu, da na
// počasni povezavi ne jemljejo pasovne širine slogom in pisavam. Sicer takoj. (Brez top-level await, glej zgoraj.)
const zacni = () => {
  // Če zacetek.js ni tekel: slogi za druge zaslone in moduli iz <template> (server/vstopna-stran.js withLanding). Sicer
  // slogov tu ne vstavimo: zacetek.js jih vstavi sam (konec zagona Učne poti), da ne jemljejo pasovne širine prvemu izrisu.
  if (!window.evklidZacetek) for (const t of document.querySelectorAll("template[data-evklid-slogi]")) t.replaceWith(t.content);
  const tpl = document.getElementById("evklid-moduli");
  if (tpl) {
    tpl.remove();
    document.head.append(tpl.content);
  }
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
  return import("./i18n-osnova.js")
    .then((m) => m.ready)
    .catch(() => null)
    .then(() => {
      // Obiskovalec na /#registracija, #prijava ali #pozabljeno-geslo (public/zacetek.js obrazec): obrazec izriše account.js,
      // ko so preneseni njegovi moduli (strežnik jih da na začetek seznama), ne šele za celo aplikacijo; app.js ga prevzame.
      if (window.evklidZacetek?.obrazec) import("./account.js").then((m) => m.obrazecVnaprej()).catch(() => {});
      else if (document.documentElement.hasAttribute("data-pristajalna")) {
        obrazecSPristajalne();
        // Slogi za druge zaslone šele, ko so moduli obrazca tu (public/zacetek.js slogi, sicer najkasneje 3 s po izrisu): prej so
        // jim na počasni povezavi vzeli ~0,7 s, pristajalna stran in obrazec pa jih ne uporabljata (test/pristajalna-takoj.test.js).
        import("./account.js").catch(() => {}).then(() => window.evklidZacetek?.slogi?.());
      }
      return mods.reduce((p, href) => p.then(() => run(href)), Promise.resolve());
    });
};
// Pristajalna stran s strežnika (public/zacetek.js): dotik »Začni brezplačno« ali »Prijava« pred zagonom aplikacije odpre
// obrazec, ko je prenesen account.js (moduli obrazca so prvi na seznamu, server/vstopna-stran.js), kot na /#registracija, ne
// šele po app.js in ~60 modulih (meritev 27. 11. 2026, telefon, počasen 4G: obrazec ~4,2 s po odprtju strani). Povezavi sta
// navadni sidri (#registracija, #prijava): sidro se spremeni tudi pred skriptom. Ko aplikacija stran prevzame (account.js
// renderLanding ali drug zaslon umakne stran in z njo data-pristajalna, endPrerenderedLanding), gumbe ureja account.js.
const OBRAZCI = ["#registracija", "#prijava", "#pozabljeno-geslo"];
function obrazecSPristajalne() {
  const z = window.evklidZacetek;
  if (!z) return;
  const odpri = () => {
    if (!OBRAZCI.includes(location.hash) || !document.documentElement.hasAttribute("data-pristajalna")) return;
    removeEventListener("hashchange", odpri);
    z.obrazec ||= () => {}; // pasici sta na pristajalni strani že pokazani (zacetek.js pasovi)
    import("./account.js").then((m) => m.obrazecVnaprej()).catch(() => {});
  };
  addEventListener("hashchange", odpri);
  odpri();
}
const izris = window.evklidZacetek?.poIzrisu;
if (izris) izris.then(zacni, zacni);
else zacni();
