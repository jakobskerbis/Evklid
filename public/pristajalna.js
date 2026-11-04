// Pristajalna stran za nove obiskovalce pred prijavo (j 2026-11-04, kartica »Pristajalna stran«).
// Pokaže jo account.js, ko obiskovalec ni prijavljen in na tej napravi še ni bil (glej SEEN v account.js).
// Cene, dnevi preizkusa in starost za lasten račun pridejo s strežnika (/api/account/prices), da se ne
// razidejo s cenikom; brez odgovora strežnika se ti deli skrijejo, ostalo deluje.
import { icon } from "./icons.js";
import { t } from "./i18n.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const FEATURES = [
  ["message-circle", "f1"],
  ["badge-check", "f2"],
  ["compass", "f3"],
  ["infinity", "f4"],
  ["camera", "f5"],
  ["book-open", "f6"],
  ["clipboard-check", "f7"],
  ["gamepad-2", "f8"],
];
const LEVELS = [
  ["OS", "os", "pencil"],
  ["SS", "ss", "notebook-pen"],
  ["FAKS", "faks", "graduation-cap"],
];
const DEMO = [
  ["q", "q1"],
  ["a", "a1"],
  ["q", "q2"],
  ["a", "a2"],
  ["q", "q3"],
  ["a", "a3"],
];

// Cene po stopnjah iz /api/account/prices. Regijske cene (druga valuta) nimajo stopnje: ena cena za vse.
export function levelPrices(prices, money) {
  const plans = prices?.plans || [];
  const pick = (level, family, interval) =>
    plans.find((p) => (level ? p.level === level : true) && !!p.family === family && p.interval === interval && (level || p.seats === 1));
  const leveled = plans.some((p) => p.level);
  const out = {};
  for (const [level] of LEVELS) {
    const m = pick(leveled ? level : null, false, "month");
    const y = pick(leveled ? level : null, false, "year");
    out[level] = m ? { month: money(m.amount, prices.currency), year: y ? money(y.amount, prices.currency) : "" } : null;
  }
  const fam = leveled ? pick("SS", true, "month") : null;
  out.family = fam ? money(fam.amount, prices.currency) : "";
  return out;
}

export function landingHtml({ name, prices = null, money = (x) => String(x) } = {}) {
  const days = prices?.trial_days;
  const age = prices?.min_age;
  const lp = prices ? levelPrices(prices, money) : {};
  const trial = days ? `<p class="land-trial">${icon("gift")}<span>${esc(t("land.trial", { n: days }))}</span></p>` : "";
  const actions = (where) => `<div class="land-actions">
      <a class="btn-primary" href="#registracija" data-land="register" data-where="${where}">${esc(t("land.start"))}</a>
      <a class="btn-secondary" href="#prijava" data-land="login">${esc(t("mob.signIn"))}</a>
    </div>`;
  const demo = DEMO.map(([who, k], i) => `<li class="land-msg ${who === "q" ? "me" : "tutor"}" style="--i:${i}">${esc(t(`land.demo.${k}`))}</li>`).join("");
  const features = FEATURES.map(
    ([ic, k]) => `<li class="card land-feat"><span class="land-ic" aria-hidden="true">${icon(ic)}</span><h3>${esc(t(`land.${k}.t`))}</h3><p>${esc(t(`land.${k}.d`))}</p></li>`,
  ).join("");
  const levels = LEVELS.map(([level, k, ic]) => {
    const p = lp[level];
    const price = p ? `<p class="land-price"><b>${esc(t("land.perMonth", { price: p.month }))}</b>${p.year ? `<span>${esc(t("land.perYear", { price: p.year }))}</span>` : ""}</p>` : "";
    return `<li class="card land-level"><span class="land-ic" aria-hidden="true">${icon(ic)}</span><h3>${esc(t(`land.lv.${k}`))}</h3><p>${esc(t(`land.lv.${k}D`))}</p>${price}</li>`;
  }).join("");
  const steps = [1, 2, 3]
    .map((n) => {
      const d = t(`land.s${n}.d`) + (n === 1 && age ? ` ${t("land.s1.age", { age })}` : "");
      return `<li class="card land-step"><span class="land-num" aria-hidden="true">${n}</span><div><h3>${esc(t(`land.s${n}.t`))}</h3><p>${esc(d)}</p></div></li>`;
    })
    .join("");
  const more = [
    ["heart", "par", "/starsi.html"],
    ["users", "sch", "/sole.html"],
    ["smartphone", "app", "/prenesi"],
  ]
    .map(
      ([ic, k, href]) =>
        `<li class="card land-more"><span class="land-ic" aria-hidden="true">${icon(ic)}</span><h3>${esc(t(`land.${k}.t`))}</h3><p>${esc(t(`land.${k}.d`))}</p><a href="${href}">${esc(t(`land.${k}.go`))} ${icon("chevron-right")}</a></li>`,
    )
    .join("");
  return `<div class="land">
    <section class="land-hero">
      <div class="land-hero-text">
        <p class="land-eyebrow">${esc(t("land.subjects"))}</p>
        <h1>${esc(t("land.title"))}</h1>
        <p class="land-lead">${esc(t("land.lead"))}</p>
        ${actions("hero")}
        ${trial}
      </div>
      <figure class="land-demo" aria-label="${esc(t("land.demoLabel"))}">
        <figcaption><span class="logo" aria-hidden="true">${icon("kristal")}</span><b>${esc(name)}</b><small>${esc(t("nav.chat"))}</small></figcaption>
        <ol>${demo}</ol>
      </figure>
    </section>
    <section class="land-sec" aria-labelledby="land-feat-h">
      <h2 id="land-feat-h">${esc(t("land.featTitle"))}</h2>
      <ul class="land-grid land-feats">${features}</ul>
    </section>
    <section class="land-sec" aria-labelledby="land-lv-h">
      <h2 id="land-lv-h">${esc(t("land.lvTitle"))}</h2>
      <ul class="land-grid land-levels">${levels}</ul>
      ${lp.family ? `<p class="land-note">${esc(t("land.family", { price: lp.family }))}</p>` : ""}
      <p class="land-note">${days ? `${esc(t("land.trial", { n: days }))} ` : ""}${esc(t("land.freeAfter"))}</p>
    </section>
    <section class="land-sec" aria-labelledby="land-how-h">
      <h2 id="land-how-h">${esc(t("land.howTitle"))}</h2>
      <ol class="land-grid land-steps">${steps}</ol>
    </section>
    <section class="land-sec">
      <ul class="land-grid land-mores">${more}</ul>
    </section>
    <section class="land-cta">
      <h2>${esc(t("land.ctaTitle"))}</h2>
      ${actions("end")}
      ${trial}
    </section>
    <footer class="land-foot">
      <a href="/zasebnost.html">${esc(t("land.privacy"))}</a>
      <a href="/starsi.html">${esc(t("land.par.t"))}</a>
      <a href="/sole.html">${esc(t("land.sch.t"))}</a>
      <a href="/prenesi">${esc(t("land.app.go"))}</a>
    </footer>
  </div>`;
}
