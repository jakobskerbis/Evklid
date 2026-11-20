// Prenos zaslonov, ki jih prijavljen učenec najverjetneje odpre takoj po Učni poti (tema in vadnica, Račun, Kartice,
// Kotiček, kalkulator, Urnik, Laboratorij: 8 KB, poskusi šele ob odprtju), z njihovim delom slovarja
// (/i18n/zasloni-sl.js), da prvi klik ne čaka omrežja.
// Modul nima uvozov in je prvi uvoz v app.js: izvede se, ko so vsi moduli prvega odprtja preneseni, a preden se izvedejo
// (~0,5 s procesorja na telefonu, povezava je ta čas prosta). modulepreload samo prenese, ne izvede.
// Pristajalna stran (obiskovalec brez seje) jih ne prenaša. Prvi obisk: učenca pozna seme seje, ki ga strežnik vstavi
// v stran (zacetek.js ucenec); ponovni obisk: localStorage.
// Vse naenkrat (HTTP/2: ena povezava, manjše datoteke pridejo prej). Valovi bi dodali po en krog (~0,56 s na Slow 4G).
// Podatke zaslona app.js zahteva hkrati z modulom (zModulom in prefetchGet v openTopic, loadCompetition, showFlashcards, showCorner).
const ZASLONI = ["./i18n-zasloni.js", "./i18n/zasloni-sl.js", "./vadnica.js", "./pad.js", "./enote-izbira.js", "./slike-nalog.js", "./povabi.js", "./check-progress.js", "./games/reward.js", "./flashcards.js", "./kartice-sklopi.js", "./corner.js", "./fokus-okna.js", "./interests.js", "./kalkulator-zaslon.js", "./schedule.js", "./pass-offer.js", "./racun.js", "./garancija-ui.js", "./pilot-naloge.js", "./prijave.js", "./odstop-ui.js", "./credit-card.js", "./laboratorij.js"];
const prenesi = (val) =>
  Promise.all(
    val.map((u) => {
      const l = Object.assign(document.createElement("link"), { rel: "modulepreload", href: new URL(u, import.meta.url).href });
      const p = new Promise((ok) => (l.onload = l.onerror = ok));
      document.head.append(l);
      return p;
    }),
  );
let prenos = Promise.resolve();
try {
  if (!document.querySelector('meta[name="evklid-pristajalna"]') && (window.evklidZacetek?.ucenec || localStorage.getItem("studentId")))
    prenos = prenesi(ZASLONI);
} catch {}
// Ko so zasloni preneseni (ali najpozneje po 6 s): app.js šele takrat začne prenose v ozadju (paket nalog brez povezave,
// oznaka AI, glasovni vnos), da si na počasni povezavi ne delijo pasovne širine z zasloni za prvi klik.
export const vnaprejGotovo = Promise.race([prenos, new Promise((ok) => setTimeout(ok, 6000))]).then(() => {});
