// Pristajalna stran za nove obiskovalce pred prijavo (j 2026-11-04, kartica »Pristajalna stran«).
// Pokaže jo account.js, ko obiskovalec ni prijavljen in na tej napravi še ni bil (glej SEEN v account.js).
// Dnevi preizkusa, starost za lasten račun in garancija pridejo s strežnika (/api/account/prices), da se ne
// razidejo s cenikom; brez odgovora strežnika se ti deli skrijejo, ostalo deluje.
import { icon } from "./icons.js";
import { t } from "./i18n.js";

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

// Eno sporočilo in en gumb (j 2026-11-15): prvi segment so gimnazijci med letom (domača naloga, testi).
// Brez cen, stopenj in trditev, ki jih obiskovalec ne more preveriti; cene so pri izbiri paketa po registraciji.
export function landingHtml({ name, prices = null } = {}) {
  const days = prices?.trial_days;
  const age = prices?.min_age;
  const trial = days ? `<p class="land-trial">${icon("gift")}<span>${esc(t("land.trial", { n: days }))}</span></p>` : "";
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
        <div class="land-actions">
          <a class="btn-primary" href="#registracija" data-land="register">${esc(t("land.start"))}</a>
        </div>
        <p class="land-login">${esc(t("land.haveAccount"))} <a href="#prijava" data-land="login">${esc(t("mob.signIn"))}</a></p>
        ${trial}
        ${ageNote}
      </div>
      <figure class="land-demo" aria-label="${esc(t("land.demoLabel"))}">
        <figcaption><span class="logo" aria-hidden="true">${icon("kristal")}</span><b>${esc(name)}</b><small>${esc(t("nav.chat"))}</small></figcaption>
        <ol>${demo}</ol>
      </figure>
    </section>
    <section class="land-sec" aria-labelledby="land-proof-h">
      <h2 id="land-proof-h">${esc(t("land.proofTitle"))}</h2>
      <ul class="land-grid land-proofs">${proofs}</ul>
    </section>
    <footer class="land-foot">
      <a href="/o-evklidu">${esc(t("land.what"))}</a>
      <a href="/zakaj-evklid">${esc(t("land.why"))}</a>
      <a href="/zasebnost.html">${esc(t("land.privacy"))}</a>
      <a href="/pogoji.html">${esc(t("land.terms"))}</a>
      <a href="/starsi.html">${esc(t("land.par.t"))}</a>
      <a href="/sole.html">${esc(t("land.sch.t"))}</a>
      <a href="/prenesi">${esc(t("land.app.go"))}</a>
    </footer>
  </div>`;
}
