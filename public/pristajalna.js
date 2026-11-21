// Pristajalna stran za nove obiskovalce pred prijavo (j 2026-11-04, kartica »Pristajalna stran«).
// Pokaže jo account.js, ko obiskovalec ni prijavljen in na tej napravi še ni bil (glej SEEN v account.js).
// Dnevi preizkusa, starost za lasten račun in garancija pridejo s strežnika (/api/account/prices), da se ne
// razidejo s cenikom; brez odgovora strežnika se ti deli skrijejo, ostalo deluje.
// Brez odvisnosti od public/i18n.js: prevajalnik t dobi izris kot argument (account.js da t iz i18n.js). Tako isti izris
// uporabi tudi strežnik, ki stran pošlje že izrisano v jeziku obiskovalca (server/pristajalna-takoj.js, naloga hitrost
// prvega nalaganja, j 19. 11. 2026); account.js jo potem prevzame brez ponovnega izrisa.
import { icon } from "./icons.js";

// Kdo stoji za aplikacijo (pregled »kupca« 16. 11. 2026: starši na vstopni strani niso našli ponudnika in kontakta).
// Isto kot v public/zasebnost.html, točka 1 »Upravljavec«, in v public/pogoji.html, točka 1 (»Evklid trenutno upravlja …«);
// test/pristajalna.test.js preveri, da se ne razidejo.
export const PROVIDER = Object.freeze({ name: "Jakob Skerbiš", email: "zasebnost@evklid.app" });

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Trije dokazi (j 2026-11-15): vsak je nekaj, kar obiskovalec preveri v aplikaciji takoj po registraciji.
// p1 inštruktor z namigi (prompts/system_prompt.md »Lestvica pomoči«), p2 test v urniku → Priprava na test
// (public/schedule.js, docs/urnik.md), p3 fotografija naloge (gumb s kamero v klepetu, public/scan/).
const PROOFS = [
  ["message-circle", "p1"],
  ["calendar", "p2"],
  ["camera", "p3"],
];
const DEMO = [
  ["q", "q1"],
  ["a", "a1"],
  ["q", "q2"],
  ["a", "a2"],
  ["q", "q3"],
  ["a", "a3"],
];

// Cena v valuti paketa, enako na strežniku in v brskalniku (stran s strežnika ostane, ko je izris enak, account.js
// sameMarkup): evro v slovenskem zapisu (»12,34 €«), druge valute v angleškem, valute brez decimalk s celimi enotami.
const ZERO_DECIMAL = new Set(["VND", "XOF", "XAF", "UGX", "RWF", "JPY", "KRW", "GNF", "MGA"]);
const money = (minor, currency) => {
  const major = ZERO_DECIMAL.has(currency) ? minor : minor / 100;
  const digits = currency !== "EUR" && Number.isInteger(major) ? 0 : 2;
  return major.toLocaleString(currency === "EUR" ? "sl-SI" : "en", { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits });
};

// Vrstica s ceno iz /api/account/prices (pregled javnih strani 21. 11. 2026, P2 in P9): najnižja mesečna cena za en
// profil, pri cenah po stopnjah še srednja šola (maturant plača ceno SŠ, ne najnižje). Regijske cene so ene za vse
// stopnje. Brez cen (strežnik ni odgovoril) prazen niz. Številk ni v kodi strani: spremembo cenika pokaže sama.
export function priceText(t, prices) {
  const month = (prices?.plans || []).filter((p) => p.interval === "month" && p.seats === 1 && !p.family && p.amount > 0);
  if (!month.length) return "";
  const cur = month[0].currency || prices.currency || "EUR";
  const min = Math.min(...month.map((p) => p.amount));
  const ss = month.find((p) => p.level === "SS");
  return ss && ss.amount !== min ? t("price.levels", { price: money(min, cur), ss: money(ss.amount, cur) }) : t("price.one", { price: money(min, cur) });
}

// Prvi segment so gimnazijci med letom in maturanti (j 2026-11-15; matura v uvodu, P1 21. 11. 2026). Glavni gumb na vrhu,
// pod tremi dokazi še enkrat (P2), da se obiskovalcu ni treba vračati na vrh. Pod uvodom vrstica s ceno iz cenika in pas
// zaupanja kot na /o-evklidu, /zakaj-evklid in /starsi.html (P2: starš najprej vpraša, koliko stane in kam gredo podatki).
// store: aplikacija iz trgovine (public/pay-ui.js isStoreApp) brez cene in povezave na cenik (nakup mimo trgovine).
// noscript: stran za brskalnike brez JavaScripta in bralnike besedila (iskalniki, predogledi, orodja AI), ki jo
// scripts/pristajalna-noscript.js zapiše v <noscript> v public/index.html. Namesto gumbov za registracijo in povezave
// za prijavo (delujejo le z JavaScriptom) je opomba.
export function landingHtml(t, { name, prices = null, noscript = false, store = false } = {}) {
  const days = prices?.trial_days;
  const age = prices?.min_age;
  const trial = days ? `<p class="land-trial">${icon("gift")}<span>${esc(t("land.trial", { n: days }))}</span></p>` : "";
  const price = store ? "" : priceText(t, prices);
  const priceLine = price ? `<p class="land-price">${esc(price)} <a href="/o-evklidu#cene">${esc(t("land.prices"))}</a></p>` : "";
  const trust = `<ul class="mkt-trust land-trust" aria-label="${esc(t("land.trustLabel"))}">
      <li>${esc(t("land.trust.eu"))}</li>
      <li>${esc(t("land.trust.ads"))}</li>
      <li>${esc(t("land.trust.ai"))}</li>
      <li><a href="/zasebnost.html">${esc(t("land.trust.more"))}</a></li>
    </ul>`;
  const again = noscript
    ? ""
    : `<section class="land-cta">
      <div class="land-actions"><a class="btn-primary" href="#registracija" data-land="register">${esc(t("land.start"))}</a></div>
      ${trial}
    </section>`;
  const ageNote = age ? `<p class="land-age">${esc(t("land.s1.age", { age }))}</p>` : "";
  const demo = DEMO.map(([who, k], i) => `<li class="land-msg ${who === "q" ? "me" : "tutor"}" style="--i:${i}">${esc(t(`land.demo.${k}`))}</li>`).join("");
  const proofs = PROOFS.map(
    ([ic, k]) => `<li class="card land-proof"><span class="land-ic" aria-hidden="true">${icon(ic)}</span><h3>${esc(t(`land.${k}.t`))}</h3><p>${esc(t(`land.${k}.d`))}</p></li>`,
  ).join("");
  // Pas pri vrhu (j 2026-11-10): garancija samo, ko jo strežnik oglašuje (prices.guarantee; stikalo in živa plačila,
  // server/placila/garancija.js guaranteeAdvertised). Pogoji v vrstici so isti kot pri izbiri paketa.
  const gar = prices?.guarantee
    ? `<section class="land-top"><p class="land-gar"><span class="land-gar-ic" aria-hidden="true">${icon("award")}</span><span class="land-gar-text"><b>${esc(t("gar.title"))}</b> <span>${esc(t("gar.short"))}</span> <a href="/garancija.html">${esc(t("gar.terms"))}</a></span></p></section>`
    : "";
  return `<div class="land">
    ${gar}
    <section class="land-hero">
      <div class="land-hero-text">
        <p class="land-eyebrow">${esc(t("land.subjects"))}</p>
        <h1>${esc(t("land.title"))}</h1>
        <p class="land-lead">${esc(t("land.lead"))}</p>
        ${noscript ? `<p class="land-nojs">${esc(t("land.noJs"))}</p>` : `<div class="land-actions">
          <a class="btn-primary" href="#registracija" data-land="register">${esc(t("land.start"))}</a>
        </div>
        <p class="land-login">${esc(t("land.haveAccount"))} <a href="#prijava" data-land="login">${esc(t("mob.signIn"))}</a></p>`}
        ${trial}
        ${priceLine}
        ${ageNote}
      </div>
      <figure class="land-demo" aria-label="${esc(t("land.demoLabel"))}">
        <figcaption><span class="logo" aria-hidden="true">${icon("kristal")}</span><b>${esc(name)}</b><small>${esc(t("nav.chat"))}</small></figcaption>
        <ol>${demo}</ol>
      </figure>
    </section>
    ${trust}
    <section class="land-sec" aria-labelledby="land-proof-h">
      <h2 id="land-proof-h">${esc(t("land.proofTitle"))}</h2>
      <ul class="land-grid land-proofs">${proofs}</ul>
    </section>
    ${again}
    <footer class="land-foot">
      <a href="/o-evklidu">${esc(t("land.what"))}</a>
      <a href="/zakaj-evklid">${esc(t("land.why"))}</a>
      ${store ? "" : `<a href="/o-evklidu#cene">${esc(t("land.prices"))}</a>`}
      <a href="/zasebnost.html">${esc(t("land.privacy"))}</a>
      <a href="/pogoji.html">${esc(t("land.terms"))}</a>
      <a href="/odstop.html">${esc(t("land.withdraw"))}</a>
      <a href="/starsi.html">${esc(t("land.par.t"))}</a>
      <a href="/sole">${esc(t("land.sch.t"))}</a>
      <a href="/prenesi">${esc(t("land.app.go"))}</a>
      <p class="land-provider">${esc(t("land.provider", { app: name, name: PROVIDER.name }))} · <span class="land-contact">${esc(t("land.contact"))}: <a href="mailto:${PROVIDER.email}">${PROVIDER.email}</a></span></p>
    </footer>
  </div>`;
}
