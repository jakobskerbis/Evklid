// Zavihek Račun (naročnina, paketi, darila, dokup, garancija, odstop, skrbniške kartice) in računi gostov: iz
// public/account.js (naloga hitrost, docs/meritve/prijavljen-mobilno-2026-11-19.md točka 2). Ni del prvega odprtja Učne
// poti: account.js ga naloži po prvem izrisu ali ob prvem odprtju zavihka Račun. Stanje računa (status, shownSig) ostane
// v account.js (žive vezave ES modulov; spremembe prek setStatus, setShownSig); besedila iz jedra in dela za zaslone
// (i18n-zasloni.js, /i18n/zasloni-sl.js), ne cel slovar.
import { t, locale, currentLang, currentRegion, deviceRegion } from "./i18n-zasloni.js";
import { guaranteeLine, guaranteeBox, podariBox, adminCards, bindGuarantee } from "./garancija-ui.js";
import { consentFields, termsField, setTermsVersion, isStoreApp, consentsOk, consentMessage, consentBody, markCheckout, linkBox, bindLinkBox } from "./pay-ui.js";
import { icon } from "./icons.js";
import { renderPilotAdmin, proofHtml, wireProof, proofBody, paintAccountPilot, paintAccountWtp } from "./pilot-naloge.js";
import { renderAdminReports } from "./prijave.js";
import { clearPrivate, deviceData } from "./offline.js";
import { termsBanner, withdrawalLink, withdrawalAdminCard, bindWithdrawal } from "./odstop-ui.js";
import { loadPrograms } from "./programs.js";
import { renderCreditCard } from "./credit-card.js";
import { $, GUEST_INVITE, PROFILE_PW_MIN, STATUS_KEYS, api, bindBirthForm, bindChildForm, birthFormHtml, childForm, continueFlow, date, errorBox, esc, goAuth, localToday, lockError, logout, money, onReadyCb, paySig, renderVerify, route, shell, showError, setShownSig, setStatus, status, store, toast, underAgeHtml } from "./account.js";

const statusText = (st) => (STATUS_KEYS.includes(st) ? t(`acct.st.${st}`) : st);


// Poraba inštruktorja ta mesec kot delež mesečne omejitve (brez zneskov). Naročnik (zajamčeni delež,
// j 2026-11-01): preostale podrobne razlage v obdobju naročnine (od dneva plačila, server/usage.js periodStart); ko so porabljene, inštruktor odgovarja v hitrem načinu.
function aiPill(a) {
  if (!a || a.percent == null) return "";
  // Družina: skupen delež za vse profile (enak preostanek pri vsakem otroku, ai.pool v opisu).
  // Porabljen tudi hitri način (a.tail): do konca obdobja naročnine (aiPeriodEnd) vsak dan kot brezplačni paket (server/usage.js tailToday).
  const outText = a.tail ? t("ai.tail") : a.spread ? `${t("ai.out")} ${t("ai.then")}` : t("ai.out");
  // Na telefonu title ni viden: v repu je besedilo ai.tail vidno v pilu (pregled #821).
  if (a.guaranteed) return `<span class="pill${a.stage === "out" ? " warn" : ""}" title="${esc((a.stage === "out" ? outText : t("ai.left", { n: a.explanations_left })) + (a.pool ? " " + t("ai.pool") : ""))}">${esc(a.tail ? t("ai.tail") : t("ai.left", { n: a.explanations_left }))}</span>`;
  if (a.hard_reached) return `<span class="pill warn" title="${esc(t("acct.aiOutTitle"))}">${esc(t("acct.aiOut"))}</span>`;
  const extra = a.soft_reached ? ` · ${esc(t("acct.aiSoft"))}` : "";
  return `<span class="pill" title="${esc(t("acct.aiPctTitle"))}">${esc(t("acct.aiPct", { pct: a.percent }))}${extra}</span>`;
}

// Ime stopnje (OŠ, SŠ, faks) iz public/stopnja.js za izbiro paketa.
const levelName = (l) => t(l === "FAKS" ? "lp.uni" : l === "SS" ? "lp.ss" : "lp.os");
const planName = (p) => (p.family ? t(p.level === "FAKS" ? "pay.familyStudent" : "pay.family") : levelName(p.level));
// Brez »(2–4 profili)«, kadar je ime že v oklepaju (»18,99 € (Družina)«); »2–4« se ne prelomi.
const shortName = (s) => s.replace(/\s*[（(][^()（）]*[)）]$/, "");
const keepRange = (s) => s.replace(/(\d)([–〜-])(\d)/g, "$1$2\u2060$3");

function planText(acc) {
  const { access, parent } = acc;
  const sub = parent.subscription;
  const plan = sub && acc.plans.find((p) => p.key === sub.plan);
  // Pilot in lastnik (server accountView, pregled #477 B3): poln paket brezplačno, brez ponudb za nakup.
  if (acc.pilot?.kind === "owner") return `<p>${esc(t("acct.owner"))}</p>`;
  if (acc.pilot?.kind === "pilot") return `<p>${esc(t("acct.pilot", { date: date(`${acc.pilot.last_day}T12:00:00Z`), n: acc.pilot.profiles }))}</p>`;
  // Nepotrjen e-naslov (#747): do potrditve velja brezplačni paket (server personalOf), preizkus in kode šele potem.
  if (!parent.verified && !parent.guest) return `<p>${esc(t("acct.free", { n: acc.free_daily_questions }))}</p>`;
  if (access.tier === "paid") {
    const pend = acc.pending_change;
    // Ime paketa iz jezika vmesnika (stopnja ali Družina); regijski paketi in stari paketi brez stopnje z imenom s strežnika.
    const name = plan?.level && !plan.legacy ? shortName(planName(plan)) : plan?.label || sub.plan;
    return `<p><b>${esc(t("mob.subscription"))}</b> · ${esc(name)} (${esc(statusText(sub.status))})</p>
      <p class="muted">${esc(t(sub.cancel_at_period_end ? "acct.endsOn" : "acct.renewsOn", { date: date(sub.period_end) }))}</p>
      ${pend ? `<p class="muted">${esc(t("up.pending", { date: date(pend.effective_at), price: money(pend.amount, pend.currency), name: shortName(planName(acc.plans.find((p) => p.key === pend.plan) || { level: "OS" })) }))}</p>` : ""}
      ${upgradeBox(acc)}`;
  }
  // Dijak ali študent s profilom »Zame« (acc.self_only): brez »za do 2 otroka« (ovire na telefonu 2026-11-18).
  if (access.tier === "trial") return `<p>${esc(t(acc.self_only ? "acct.trialSelf" : "acct.trial", { date: date(access.until) }))}</p>`;
  if (access.tier === "promo") {
    const trial = Date.parse(parent.trial_ends_at || 0) > Date.now();
    return `<p>${esc(t("acct.promo", { date: date(access.until) }))}</p>${
      trial && !acc.self_only ? `<p class="muted">${esc(t("acct.promoTrial", { date: date(parent.trial_ends_at), n: Math.max(1, acc.promo?.seats || 1) }))}</p>` : ""}`;
  }
  if (access.tier === "bonus") return `<p>${esc(t("acct.bonus", { date: date(access.until) }))}</p>`;
  if (access.tier === "gift") return `<p>${esc(t("gift.tier", { date: date(access.until) }))}</p>`;
  return `<p>${esc(t("acct.free", { n: acc.free_daily_questions }))}</p>`;
}

// Nadgradnja na višjo stopnjo med obdobjem (doplačilo razlike, Stripe izračuna sam).
function upgradeBox(acc) {
  const up = acc.upgrade;
  if (!up?.options?.length || acc.parent.minor) return "";
  if (acc.parent.birth_missing) return `<div class="plan-upgrade"><p class="muted">${esc(t("birth.payMissing"))}</p></div>`;
  return `<div class="plan-upgrade"><p><b>${esc(t("up.title"))}</b><br><span class="muted">${esc(t("up.text"))}</span></p>
    <div class="form-actions">${up.options.map((o) => `<button type="button" class="secondary" data-upgrade="${esc(o.key)}">${esc(t("up.btn", { name: planName(o) }))} · ${money(o.amount, o.currency)} ${esc(t(o.interval === "year" ? "mob.perYear" : "mob.perMonth"))}</button>`).join("")}</div></div>`;
}

function plansPicker(acc) {
  // Paket v evrih ima stopnjo (j 2026-11-01): 1 profil po stopnji profila, Družina pri vsaj 2 profilih.
  const levels = acc.plans.some((p) => p.level);
  const find = (seats, interval) =>
    levels
      ? acc.plans.find((x) => (seats >= 2 ? x.family && x.level === (acc.children.some((c) => c.level === "FAKS") ? "FAKS" : "SS") : !x.family && x.level === acc.plan_level) && x.interval === interval)
      : acc.plans.find((x) => x.seats === seats && x.interval === interval);
  const cell = (seats, interval) => {
    const p = find(seats, interval);
    if (!p) return "";
    const cur = p.currency || "EUR";
    const perMonth = interval === "year" ? `<span class="muted">${esc(t("pay.yearPerMonth", { price: money(Math.round(p.amount / 10), cur) }))}</span>` : "";
    // Letni paket je prvi in privzet (j 2026-11-04): prihranek glede na 12 mesečnih plačil.
    const m = interval === "year" ? find(seats, "month") : null;
    const pct = m && m.amount > 0 && p.amount > 0 && (m.currency || "EUR") === cur ? Math.floor((1 - p.amount / (12 * m.amount)) * 100) : 0;
    const save = pct > 0 ? ` <span class="pill ok">${esc(t("pay.save", { pct }))}</span>` : "";
    return `<label class="plan"><input type="radio" name="plan" value="${seats}-${interval}">
      <span><b>${money(p.amount, cur)}</b> / ${esc(t(interval === "year" ? (p.level === "FAKS" && !p.family ? "pay.perStudyYear" : "school.perYear") : "school.perMonth"))}${save}<br>${perMonth}</span></label>`;
  };
  // Najprej izbira, za koliko otrok; šele nato cene samo za to izbiro (j 2026-10-30: prej je bilo prenatrpano).
  const familyLabel = acc.children.some((c) => c.level === "FAKS") ? t("pay.familyStudent") : t("pay.family");
  const who = levels
    ? [["1", t("pay.seats1Level", { level: levelName(acc.plan_level) })], ...(acc.family_ok ? [["2", familyLabel]] : []), ...(acc.school_plans?.length ? [["s", t("school.planHead")]] : [])]
    : [["1", t("pay.seats1")], ["2", t("pay.seats2")], ...(acc.school_plans?.length ? [["s", t("school.planHead")]] : [])];
  return `
    <form id="plan-form" class="plans" novalidate>
      <fieldset class="plan-who"><legend>${esc(t("pay.howMany"))}</legend>
        <div class="plan-who-opts">${who.map(([v, label]) => `<label class="plan"><input type="radio" name="who" value="${v}"> <span><b>${esc(keepRange(label))}</b></span></label>`).join("")}</div>
      </fieldset>
      <div class="plan-row" data-who="1" hidden>${cell(1, "year")}${cell(1, "month")}</div>
      ${!levels || acc.family_ok ? `<div class="plan-row" data-who="2" hidden>${cell(2, "year")}${cell(2, "month")}</div>` : ""}
      ${schoolRow(acc)}
      <div id="plan-rest" class="plans" hidden>
      <p class="form-error" role="alert" hidden></p>
      ${acc.guarantee?.offered ? guaranteeLine() : ""}
      ${acc.prices_draft ? `<p class="muted">${esc(t("pay.pricesDraft"))}</p>` : ""}
      ${acc.parent.minor
        ? `<p class="muted">${esc(t("pay.minorNote"))}</p>
           <button class="secondary" type="button" id="plan-link">${esc(t("pay.askParent"))}</button><div id="plan-link-out"></div>`
        : acc.parent.birth_missing
          ? `<p class="muted">${esc(t("birth.payMissing"))}</p>`
          : `${consentFields()}
           <button class="primary" type="submit">${esc(t("pay.continue"))}</button>`}
      ${acc.parent.minor || acc.parent.birth_missing ? "" : `<p class="muted">${esc(t("pay.secureCancel"))}${acc.access.tier === "trial" ? ` ${esc(t("pay.trialKept"))}` : ""}</p>`}
      </div>
    </form>`;
}

// Osebno ob šolski licenci (5,99 € / 49 €): samo, ko ima vsaj en otrok šolsko licenco.
function schoolRow(acc) {
  if (!acc.school_plans?.length) return "";
  const month = acc.school_plans.find((p) => p.interval === "month");
  const save = (p) => {
    const pct = p.interval === "year" && p.amount > 0 && month?.amount > 0 ? Math.floor((1 - p.amount / (12 * month.amount)) * 100) : 0;
    return pct > 0 ? ` <span class="pill ok">${esc(t("pay.save", { pct }))}</span>` : "";
  };
  const cell = (p) => `<label class="plan"><input type="radio" name="plan" value="s-${p.interval}">
      <span><b>${money(p.amount, "EUR")}</b> / ${esc(t(p.interval === "year" ? "school.perYear" : "school.perMonth"))}${save(p)}</span></label>`;
  // Letni paket prvi (j 2026-11-04).
  const sorted = [...acc.school_plans].sort((a, b) => (b.interval === "year") - (a.interval === "year"));
  return `<div class="plan-row" data-who="s" hidden>${sorted.map(cell).join("")}<p class="muted plan-note">${esc(t("school.planNote"))}</p></div>`;
}
// Vrednost izbire paketa: »1-month« (otroci-obdobje) ali »s-year« (Osebno ob šolski licenci).
const planBody = (v) => {
  const [a, interval] = String(v).split("-");
  return a === "s" ? { school: true, interval } : { seats: Number(a), interval };
};

// Darilna koda: polnoletna oseba kupi eno leto za en profil izbrane stopnje (letna cena stopnje: 99 / 99 / 199 €).
function giftBox(acc) {
  if (!acc.billing || acc.parent.minor || acc.parent.guest || acc.parent.birth_missing) return "";
  const list = (acc.gifts || [])
    .map((g) => `<li>${g.code ? `<b dir="ltr">${esc(g.code)}</b> <button type="button" data-gift-copy="${esc(g.code)}" aria-label="${esc(t("gift.copy"))} ${esc(g.code)}">${esc(t("gift.copy"))}</button>` : ""} <span class="pill${g.redeemed ? " ok" : ""}">${esc(t(g.status !== "paid" ? "gift.refunded" : g.redeemed ? "gift.used" : "gift.unused"))}</span></li>`)
    .join("");
  // Cena v obliki jezika vmesnika (sl: 49,00 €, en: €49.00), ker je kartica v celoti prevedena.
  const fmt = (c) => (c / 100).toLocaleString(locale(), { style: "currency", currency: "EUR" });
  // V pilotu brez nakupa (j 2026-11-10): samo že kupljene kode, če obstajajo.
  if (acc.gift_buy === false) return list ? `<div class="card gift-card"><h2>${icon("gift")} ${esc(t("gift.title"))}</h2><ul class="gift-list">${list}</ul></div>` : "";
  const prices = acc.gift_prices || { OS: acc.gift_price || 9900 };
  const vals = Object.values(prices);
  const price = vals.length > 1 ? `${fmt(Math.min(...vals))} – ${fmt(Math.max(...vals))}` : fmt(vals[0]);
  const levelSel = Object.keys(prices).length > 1
    ? `<label>${esc(t("gift.level"))} <select name="level">${Object.entries(prices).map(([l, c]) => `<option value="${esc(l)}">${esc(levelName(l))} · ${esc(fmt(c))}</option>`).join("")}</select></label>`
    : "";
  return `<div class="card gift-card">
      <h2>${icon("gift")} ${esc(t("gift.title"))}</h2>
      <p>${esc(t("gift.text", { price }))}</p>
      ${list ? `<ul class="gift-list">${list}</ul>` : ""}
      <details><summary>${esc(t("gift.buy"))}</summary>
        <form id="gift-form" class="form" novalidate>
          ${levelSel}
          ${consentFields("gift")}
          <p class="form-error" role="alert" hidden></p>
          <button class="primary" type="submit">${esc(t("pay.continue"))}</button>
        </form></details>
    </div>`;
}

// Vnos aktivacijske kode; skrbnik vidi še porabo in povezavo za deljenje.
function promoBox(acc, paid) {
  const pr = acc.promo || {};
  const a = pr.admin;
  const admin = a
    ? `<div class="promo-admin"><p><b>Aktivacijska koda ${esc(a.code)}:</b> porabljenih ${a.used} od ${a.limit} · vsak dobi ${a.days} dni polnega dostopa.</p>
        <div class="inline"><input id="promo-url" readonly value="${esc(a.url)}"><button id="promo-copy" type="button">Kopiraj</button></div></div>`
    : "";
  // Darilne kode (DAR-…) se vpišejo v isto polje, zato je polje tudi, ko aktivacijskih kod ni.
  if (paid) return admin;
  return `<details class="promo-code"${store.get("evklid_koda") ? " open" : ""}><summary>${esc(t("gift.codeSummary"))}</summary>
      <form id="promo-form" class="inline form">
        <input name="code" maxlength="40" required autocapitalize="characters" aria-label="${esc(t("gift.codeSummary"))}" placeholder="${esc(t("acct.codeExample", { code: "KODA-2026" }))}" value="${esc(store.get("evklid_koda") || "")}">
        <button class="primary" type="submit">${esc(t("acct.activate"))}</button>
        <p class="form-error" hidden></p>
      </form></details>${admin}`;
}

// Skrbnik: aktivacijske kode (seznam, nova koda, vklop/izklop) in zadnji dogodki plačil.
function adminCodes(acc) {
  const rows = acc.promo.codes
    .map(
      (c) => `<li class="code-row"><div><b>${esc(c.code)}</b>${c.from_env ? ` <span class="pill">${esc(t("admin.fromEnv"))}</span>` : ""} <span class="pill ${c.active ? "ok" : ""}">${esc(t(c.active ? "admin.on" : "admin.off"))}</span>
        <br><small class="muted">${esc(t("admin.usage", { used: c.used, max: c.max_uses, days: c.days, seats: c.seats }))} · ${esc(c.max_model === "sonnet" ? t("admin.modelSonnet") : t("admin.modelAny"))}${c.valid_until ? ` · ${esc(t("admin.untilShort", { date: date(c.valid_until) }))}` : ""}${c.note ? ` · ${esc(c.note)}` : ""}</small></div>
        <div class="code-actions"><button type="button" data-code-copy="${esc(c.code)}">${esc(t("admin.copyLink"))}</button>
        <button type="button" data-code-toggle="${esc(c.code)}" data-active="${c.active ? 1 : 0}">${esc(t(c.active ? "admin.disable" : "admin.enable"))}</button></div></li>`,
    )
    .join("");
  const events = (acc.billing_events || [])
    .map((e) => `<li><code>${esc(e.type)}</code> <small class="muted">${esc(e.received_at)}${e.error ? ` · ${esc(t("admin.eventError"))}: ${esc(e.error)}` : e.processed_at ? "" : " · …"}</small></li>`)
    .join("");
  return `
    <div class="card admin-codes">
      <h2>${esc(t("admin.codes"))}</h2>
      <ul class="code-list">${rows}</ul>
      <details class="code-new"><summary>${esc(t("admin.create"))}</summary>
        <form id="code-form" class="form" novalidate>
          <label>${esc(t("admin.code"))} <input name="code" required maxlength="30" autocapitalize="characters" pattern="[A-Za-z0-9-]{4,30}"></label>
          <label>${esc(t("admin.days"))} <input name="days" type="number" min="1" max="730" value="30" required></label>
          <label>${esc(t("admin.uses"))} <input name="max_uses" type="number" min="1" max="100000" value="100" required></label>
          <label>${esc(t("admin.seats"))} <select name="seats"><option value="1">1</option><option value="2">2</option></select></label>
          <label>${esc(t("admin.model"))} <select name="max_model"><option value="sonnet">${esc(t("admin.modelSonnet"))}</option><option value="">${esc(t("admin.modelAny"))}</option></select></label>
          <label>${esc(t("admin.until"))} <input name="valid_until" type="date"></label>
          <label>${esc(t("admin.note"))} <input name="note" maxlength="120"></label>
          <p class="form-error" role="alert" hidden></p>
          <button class="primary" type="submit">${esc(t("admin.create"))}</button>
        </form></details>
      <h3>${esc(t("admin.events"))}</h3>
      ${events ? `<ul class="event-list">${events}</ul>` : `<p class="muted">${esc(t("admin.noEvents"))}</p>`}
      <h3>${esc(t("admin.apk"))}</h3>
      <p class="muted small">${esc(t("admin.apkHelp"))}</p>
      <p id="apk-status" aria-live="polite"></p>
      <form id="apk-form" class="form" novalidate>
        <label>${esc(t("admin.apkUrl"))} <input name="url" type="url" required placeholder="https://expo.dev/artifacts/eas/….apk" inputmode="url" autocomplete="off"></label>
        <p class="form-error" role="alert" hidden></p>
        <button class="primary" type="submit">${esc(t("admin.apkSave"))}</button>
      </form>
    </div>`;
}

// Skrbnik: APK za Android na strežniku (server/mobile/download.js), ponujen na /prenesi in ob »Namesti aplikacijo«.
function apkText(r) {
  if (r.url) return t("admin.apkLink");
  if (!r.file) return t("admin.apkNone");
  return t("admin.apkHave", { date: date(r.file.at), mb: (r.file.bytes / 1048576).toLocaleString(currentLang(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }) });
}
async function loadApk() {
  const out = $("#apk-status");
  if (!out) return;
  try {
    out.textContent = apkText(await api("/api/admin/apk"));
  } catch {
    out.textContent = "";
  }
}
function bindApk() {
  loadApk();
  $("#apk-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const btn = $("button[type=submit]", f);
    $(".form-error", f).hidden = true;
    btn.disabled = true;
    btn.setAttribute("aria-busy", "true");
    try {
      const r = await api("/api/admin/apk", { method: "POST", body: { url: f.url.value } });
      $("#apk-status").textContent = apkText(r);
      toast(apkText(r));
      f.reset();
    } catch (err) {
      showError(f, err);
    } finally {
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
    }
  });
}

// Skrbnik: merjenje v pilotu (server/pilot.js): vprašanja na dan, strošek AI na učenca, obiski strani za starše.
let pilotSeq = 0; // hitre spremembe filtrov: prikaže se samo zadnji odgovor
async function loadPilot(days = 30, school = "", focusId = "") {
  const seq = ++pilotSeq;
  const out = $("#pilot-out");
  if (!out) return;
  let r, g, o, k;
  try {
    const qs = `days=${days}${school ? `&school=${school}` : ""}`;
    // Rast in vračanje (server/rast.js) je dodatek: če ne uspe, kartica pokaže vsaj merjenje v pilotu.
    // B2: odpiranje delov aplikacije (server/odpiranje-delov.js) in B3: anketa po 7 dneh (server/anketa-teden.js, vsi
    // odgovori ne glede na obdobje) sta prav tako dodatka.
    [r, g, o, k] = await Promise.all([
      api(`/api/admin/pilot?${qs}`),
      api(`/api/admin/rast?${qs}`).catch(() => null),
      api(`/api/admin/deli?${qs}`).catch(() => null),
      api("/api/admin/anketa-teden").catch(() => null),
    ]);
    if (seq !== pilotSeq) return;
  } catch (err) {
    out.innerHTML = `<p class="muted">${esc(err.message)}</p>`;
    return;
  }
  const loc = currentRegion() ? `${currentLang()}-${currentRegion()}` : currentLang();
  const nf = (x, d = 2) => Number(x).toLocaleString(loc, { maximumFractionDigits: d });
  const eur = (x, d = 2) => Number(x).toLocaleString(loc, { style: "currency", currency: "EUR", minimumFractionDigits: d, maximumFractionDigits: d });
  const day = (s) => new Date(`${s}T12:00:00`).toLocaleDateString(loc, { weekday: "short", day: "numeric", month: "numeric" });
  const T = r.totals;
  const rate = r.rows.length ? T.aiEur / Math.max(T.aiUsd, 1e-9) : 0;
  out.innerHTML = `
    <div class="pilot-filters">
      <label>${esc(t("pilot.period"))} <select id="pilot-days">${[7, 30, 90].map((d) => `<option value="${d}" ${d === r.days ? "selected" : ""}>${esc(t("pilot.days", { n: d }))}</option>`).join("")}</select></label>
      ${r.schools.length ? `<label>${esc(t("pilot.school"))} <select id="pilot-school"><option value="">${esc(t("pilot.allSchools"))}</option>${r.schools.map((s) => `<option value="${s.id}" ${s.id === r.schoolId ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></label>` : ""}
    </div>
    <ul class="pilot-sum">
      <li><b>${nf(T.questionsPerDay, 1)}</b> ${esc(t("pilot.qPerDay"))}</li>
      <li><b>${nf(T.questionsPerAskerDay, 1)}</b> ${esc(t("pilot.qPerStudent"))}</li>
      <li><b>${eur(T.aiEurPerStudentMonth, 3)}</b> ${esc(t("pilot.aiPerStudent", { n: T.aiUsers }))}</li>
      <li><b>${eur(T.aiEur)}</b> ${esc(t("pilot.aiTotal"))}</li>
      <li><b>${nf(T.visits.starsi)}</b> ${esc(t("pilot.visitsParents", { n: T.visits.starsi }))} · <b>${nf(T.visits.placaj)}</b> ${esc(t("pilot.visitsPay", { n: T.visits.placaj }))}</li>
    </ul>
    ${r.students != null ? `<p class="muted">${esc(t("pilot.schoolStudents", { n: r.students }))}</p>` : ""}
    <div class="pilot-scroll"><table class="table pilot-table"><thead><tr><th scope="col">${esc(t("pilot.day"))}</th><th scope="col">${esc(t("pilot.questions"))}</th><th scope="col">${esc(t("pilot.askers"))}</th><th scope="col">${esc(t("pilot.ai"))}</th><th scope="col">${esc(t("pilot.parents"))}</th></tr></thead>
      <tbody>${[...r.rows].reverse().map((d) => `<tr><td>${esc(day(d.day))}</td><td>${nf(d.questions)}</td><td>${nf(d.askers)}</td><td>${eur(d.aiUsd * rate, 3)}</td><td>${nf(d.visits.starsi + d.visits.placaj)}</td></tr>`).join("")}</tbody></table></div>
    <p class="muted small">${esc(t("pilot.note"))}</p>
    ${g ? growthHtml(g, loc) : ""}
    ${o ? deliHtml(o, loc) : ""}
    ${k ? anketaHtml(k, loc) : ""}`;
  // Kartica se izriše znova: fokus ostane na izbiri, ki jo je uporabnik spremenil (tipkovnica).
  if (focusId) setTimeout(() => $(`#${focusId}`)?.focus());
  const reload = (e) => loadPilot($("#pilot-days").value, $("#pilot-school")?.value || "", e.target.id);
  $("#pilot-days").addEventListener("change", reload);
  $("#pilot-school")?.addEventListener("change", reload);
}

// Skrbnik, točka B2: kateri deli aplikacije se odpirajo in ali se isti učenec vrača (server/odpiranje-delov.js).
const IME_DELA = { lekcije: "nav.textbook", vadnica: "pn.i.practice", instruktor: "nav.chat", svet3d: "a3.hubTitle", laboratorij: "nav.lab", igre: "nav.games" };
function deliHtml(o, loc) {
  const nf = (x) => Number(x).toLocaleString(loc);
  const pc = (x) => (x == null ? "–" : Number(x).toLocaleString(loc, { style: "percent", maximumFractionDigits: 0 }));
  const th = (k) => `<th scope="col">${esc(t(k))}</th>`;
  return `<h4>${esc(t("deli.title"))}</h4>
    ${o.ucenci != null ? `<ul class="pilot-sum"><li><b>${nf(o.ucenci)}</b> ${esc(t("deli.students"))}</li></ul>` : ""}
    <div class="pilot-scroll"><table class="table pilot-table"><thead><tr>${th("deli.part")}${th("deli.opened")}${th("deli.returned")}</tr></thead>
      <tbody>${o.deli.map((d) => `<tr><td>${esc(Object.hasOwn(IME_DELA, d.del) ? t(IME_DELA[d.del]) : d.del)}</td><td>${d.odprli != null ? `${nf(d.odprli)} (${pc(d.delez)})` : "–"}</td><td>${d.odprli != null ? `${nf(d.vrnili)} (${pc(d.delezVrnili)})` : "–"}</td></tr>`).join("")}</tbody></table></div>
    <p class="muted small">${esc(t("deli.note"))} ${esc(t("deli.few", { n: o.minStudents }))}</p>`;
}

// Skrbnik, točka B3: anketa po 7 dneh (server/anketa-teden.js); vsote šele od k.min odgovorov naprej.
function anketaHtml(k, loc) {
  const nf = (x) => Number(x).toLocaleString(loc);
  const OZNAKA = { zelo: "ank.a.zelo", malo: "ank.a.malo", da: "fb.yes", mogoce: "fb.maybe", ne: "fb.no" };
  const vrstica = (q, v) => `<tr><th scope="row">${esc(t(q))}</th><td>${v ? Object.entries(v).map(([m, n]) => `${esc(t(OZNAKA[m]))} <b>${nf(n)}</b>`).join(" · ") : "–"}</td></tr>`;
  return `<h4>${esc(t("ank.adm.title"))}</h4>
    <ul class="pilot-sum"><li><b>${esc(typeof k.n === "number" ? nf(k.n) : k.n)}</b> ${esc(t("ank.adm.n"))}</li><li><b>${esc(typeof k.zavrnili === "number" ? nf(k.zavrnili) : k.zavrnili)}</b> ${esc(t("ank.adm.declined"))}</li></ul>
    ${k.pomaga ? `<div class="pilot-scroll"><table class="table pilot-table"><tbody>${vrstica("ank.q.pomaga", k.pomaga)}${vrstica("ank.q.naprej", k.naprej)}${vrstica("ank.q.placal", k.placal)}${vrstica("ank.q.priporocil", k.priporocil)}</tbody></table></div>` : ""}
    <p class="muted small">${esc(t("ank.adm.few", { min: k.min }))}</p>`;
}

// Skrbnik: rast in vračanje (server/rast.js): prva naloga v 24 urah, vrnitev naslednji dan in po 7 dneh, viri, tedni.
function growthHtml(g, loc) {
  const nf = (x) => Number(x).toLocaleString(loc);
  const pc = (x) => Number(x).toLocaleString(loc, { style: "percent", maximumFractionDigits: 0 });
  const pct = (s) => (s.pct == null ? "–" : pc(s.pct));
  const of = (s) => ({ a: nf(s.returned), b: nf(s.eligible) });
  const dm = (s) => new Date(`${s}T12:00:00`).toLocaleDateString(loc, { day: "numeric", month: "numeric" });
  const SRC = { "": "rast.src.none", priporocilo: "rast.src.ref", razred: "rast.src.class", drugo: "rast.src.other" };
  const src = (v) => (Object.hasOwn(SRC, v) ? t(SRC[v]) : v);
  const th = (k) => `<th scope="col">${esc(t(k))}</th>`;
  const eurOf = (x) => Number(x).toLocaleString(loc, { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 3 });
  // Povezava v opombi je v \u2066 … \u2069 (LRI … PDI), da je v arabščini in perzijščini ne premeša smer besedila.
  return `<h3 class="rast-title">${esc(t("rast.title"))}</h3>
    <ul class="pilot-sum">
      <li><b>${nf(g.newProfiles)}</b> ${esc(t("rast.newProfiles"))}</li>
      <li><b>${pct(g.activation)}</b> ${esc(t("rast.activated", of(g.activation)))}</li>
      <li><b>${pct(g.d1)}</b> ${esc(t("rast.d1", of(g.d1)))}</li>
      <li><b>${pct(g.d7)}</b> ${esc(t("rast.d7", of(g.d7)))} · ${esc(t("rast.goal", { pct: pc(g.goal.target) }))} <b>${esc(t(`rast.goal.${g.goal.status}`))}</b></li>
      <li><b>${nf(g.weeklyActive)}</b> ${esc(t("rast.wau"))}</li>
      ${g.activeProfiles != null ? `<li><b>${nf(g.activeProfiles)}</b> ${esc(t("rast.activeProfiles"))}</li>` : ""}
    </ul>
    <div class="pilot-scroll"><table class="table pilot-table"><thead><tr>${th("rast.week")}${th("rast.new")}${th("rast.active")}</tr></thead>
      <tbody>${[...g.weeks].reverse().map((w) => `<tr><td>${esc(`${dm(w.start)} – ${dm(w.end)}`)}</td><td>${nf(w.newProfiles)}</td><td>${nf(w.active)}</td></tr>`).join("")}</tbody></table></div>
    ${g.sources.length ? `<div class="pilot-scroll"><table class="table pilot-table"><thead><tr>${th("rast.source")}${th("rast.visits")}${th("rast.profiles")}${th("rast.firstTask")}${th("rast.returned")}</tr></thead>
      <tbody>${g.sources.map((s) => `<tr><td>${esc(src(s.vir))}</td><td>${nf(s.visits)}</td><td>${nf(s.profiles)}</td><td>${nf(s.firstTask)}</td><td>${s.d7Eligible ? `${nf(s.d7Returned)} / ${nf(s.d7Eligible)}` : "–"}</td></tr>`).join("")}</tbody></table></div>` : ""}
    ${g.usageBySource?.length ? `<h4>${esc(t("rast.byUse"))}</h4><div class="pilot-scroll"><table class="table pilot-table"><thead><tr>${th("rast.source")}${th("rast.active")}${th("rast.d1Col")}${th("rast.qCol")}${th("rast.aiCol")}</tr></thead>
      <tbody>${g.usageBySource.map((u) => `<tr><td>${esc(src(u.vir))}</td><td>${nf(u.active)}</td><td>${u.d1Eligible ? `${nf(u.d1Returned)} / ${nf(u.d1Eligible)}` : "–"}</td><td>${u.askerDays ? nf(u.questionsPerAskerDay) : "–"}</td><td>${u.aiUsers ? eurOf(u.aiEurPerUserMonth) : "–"}</td></tr>`).join("")}</tbody></table></div>` : ""}
    ${vedenjeHtml(g.vedenje, nf, pc)}
    ${funnelHtml(g.funnel, nf, pct, of)}
    <p class="muted small">${esc(t("rast.note", { link: `\u2066${location.origin}/?vir=facebook\u2069` }))}</p>`;
}

// Merjenje vedenja (server/rast.js vedenjeReport, točka 8): dnevi z rešeno nalogo, aktivnost pred testom.
function vedenjeHtml(v, nf, pc) {
  if (!v) return "";
  const li = (k, a, b, p, x = {}) => `<li><b>${b ? pc(p) : "–"}</b> ${esc(t(`rast.vedenje.${k}`, { a: nf(a), b: nf(b), ...x }))}</li>`;
  return `<h4>${esc(t("rast.vedenje.title"))}</h4>
    <ul class="pilot-sum">${li("solved", v.solvedDays, v.activeDays, v.solvedPct)}${li("beforeTest", v.beforeTest, v.tests, v.beforeTestPct, { n: v.days })}</ul>`;
}

// Lijak računov (server/rast.js accountFunnel): registracija → e-naslov → prva naloga → 3. in 7. dan → plačilo.
function funnelHtml(f, nf, pct, of) {
  if (!f) return "";
  const li = (k, s) => `<li><b>${pct(s)}</b> ${esc(t(`rast.funnel.${k}`, of(s)))}</li>`;
  return `<h4>${esc(t("rast.funnel.title"))}</h4>
    <ul class="pilot-sum">
      <li><b>${nf(f.registered)}</b> ${esc(t("rast.funnel.registered"))}</li>
      ${li("verified", f.verified)}${li("task24", f.task24)}${li("task7", f.task7)}${li("d3", f.d3)}${li("d7", f.d7)}${li("paid", f.paid)}
    </ul>
    <p class="muted small">${esc(t("rast.funnel.note"))}</p>`;
}

// Skrbnik: naročila šol s strani /sole (server/sole.js): stanje, opomba, predračun za tisk.
async function loadSchoolOrders() {
  const out = $("#orders-out");
  if (!out) return;
  let r;
  try {
    r = await api("/api/admin/school-orders");
  } catch (err) {
    out.innerHTML = `<p class="muted">${esc(err.message)}</p>`;
    return;
  }
  const loc = currentRegion() ? `${currentLang()}-${currentRegion()}` : currentLang();
  const eur = (x) => Number(x).toLocaleString(loc, { style: "currency", currency: "EUR" });
  const day = (s) => new Date(`${s}T12:00:00`).toLocaleDateString(loc);
  const rows = r.orders
    .map(
      (o) => `<li class="order-row" data-order="${o.id}">
        <div><b>${esc(o.number)}</b> · ${esc(o.school_name)}</div>
        <div class="muted small">${esc(t(`orders.plan.${o.plan}`))} · ${esc(t("orders.students", { n: o.students }))} · ${esc(eur(o.total))} · ${esc(t("orders.start", { date: day(o.start_date) }))}</div>
        <div class="muted small">${esc(o.contact_name)} · <a href="mailto:${esc(o.email)}">${esc(o.email)}</a>${o.phone ? ` · ${esc(o.phone)}` : ""}</div>
        ${o.note ? `<p class="small order-note">${esc(o.note)}</p>` : ""}
        <div class="order-ctl">
          <label>${esc(t("orders.status"))} <select data-order-status>${r.statuses.map((st) => `<option value="${st}" ${st === o.status ? "selected" : ""}>${esc(t(`orders.st.${st}`))}</option>`).join("")}</select></label>
          <label>${esc(t("orders.note"))} <input data-order-note maxlength="1000" value="${esc(o.admin_note)}"></label>
          <a href="/api/admin/school-orders/${o.id}/predracun" target="_blank" rel="noopener">${esc(t("orders.proforma"))}</a>
        </div>
      </li>`,
    )
    .join("");
  out.innerHTML = `${rows ? `<ul class="order-list">${rows}</ul>` : `<p class="muted">${esc(t("orders.empty"))}</p>`}
    <p class="muted small">${esc(t("orders.hint"))} <a href="/sole" target="_blank" rel="noopener">/sole</a></p>`;
  const save = async (li, body) => {
    try {
      await api(`/api/admin/school-orders/${li.dataset.order}`, { method: "PUT", body });
      toast(t("common.saved"));
    } catch (err) {
      toast(err.message);
      loadSchoolOrders(); // npr. pilotno mesto je zasedeno: izbira stanja se vrne na shranjeno
    }
  };
  out.querySelectorAll("[data-order]").forEach((li) => {
    $("[data-order-status]", li).addEventListener("change", (e) => save(li, { status: e.target.value }));
    $("[data-order-note]", li).addEventListener("change", (e) => save(li, { note: e.target.value }));
  });
}

function bindAdminCodes(acc) {
  bindSkrbnik();
  bindGuestInvite();
  if (!acc.promo?.codes) return;
  loadPilot();
  renderPilotAdmin($("#pilot-tasks-out"), { api, toast }); // naloge članov pilota: vsote brez imen
  import("./mnenje.js").then((m) => m.renderOpinionsAdmin($("#pilot-mnenja-out"), { api })).catch(() => {}); // mnenja članov pilota: seznam brez imen
  renderAdminReports($("#reports-out"), { api, toast });
  bindApk();
  loadSchoolOrders();
  $("#code-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    $(".form-error", f).hidden = true;
    try {
      await api("/api/admin/promo-codes", {
        method: "POST",
        body: { code: f.code.value, days: Number(f.days.value), max_uses: Number(f.max_uses.value), seats: Number(f.seats.value), max_model: f.max_model.value, valid_until: f.valid_until.value || null, note: f.note.value },
      });
      toast(t("admin.created"));
      renderAccount();
    } catch (err) {
      showError(f, err);
    }
  });
  document.querySelectorAll("[data-code-toggle]").forEach((b) =>
    b.addEventListener("click", async () => {
      try {
        await api(`/api/admin/promo-codes/${encodeURIComponent(b.dataset.codeToggle)}/active`, { method: "POST", body: { active: b.dataset.active !== "1" } });
        renderAccount();
      } catch (err) {
        toast(err.message);
      }
    }),
  );
  document.querySelectorAll("[data-code-copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      const url = acc.promo.base_url + encodeURIComponent(b.dataset.codeCopy);
      try {
        await navigator.clipboard.writeText(url);
        toast(t("pay.copied"));
      } catch {
        prompt(t("admin.copyLink"), url);
      }
    }),
  );
}

// ---------- uporaba brez računa (gost) ----------

function upgradeForm() {
  return `
    <form id="upgrade-form" class="form">
      <label>${esc(t("guest.name"))} <input name="name" maxlength="60" autocomplete="name"></label>
      <label>${esc(t("guest.email"))} <input name="email" type="email" required autocomplete="email"></label>
      <label>${esc(t("guest.password"))} <input name="password" type="password" required minlength="8" autocomplete="new-password"></label>
      <label>${esc(t("guest.birth"))} <input name="birth_date" type="date" required min="1900-01-01" max="${localToday()}" autocomplete="bday"></label>
      <label class="check"><input type="checkbox" name="accept_privacy" required>
        <span>${esc(t("guest.accept"))} <a href="/zasebnost.html" target="_blank">${esc(t("guest.privacy"))}</a></span></label>
      ${termsField("accept_terms")}
      <p class="form-error" hidden></p>
      <button class="primary" type="submit">${esc(t("guest.upgradeBtn"))}</button>
    </form>`;
}

function guestLoginForm() {
  return `
    <details class="guest-login"><summary>${esc(t("guest.haveAccount"))}</summary>
      <form id="guest-login-form" class="form">
        <p class="muted">${esc(t("guest.loginNote"))}</p>
        <label>${esc(t("guest.email"))} <input name="email" type="email" required autocomplete="email"></label>
        <label>${esc(t("guest.loginPassword"))} <input name="password" type="password" required autocomplete="current-password"></label>
        <p class="form-error" hidden></p>
        <button type="submit">${esc(t("guest.loginBtn"))}</button>
      </form>
    </details>`;
}

function bindGuestForms(after) {
  $("#upgrade-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const btn = $("button[type=submit]", f);
    btn.disabled = true;
    try {
      const r = await api("/api/auth/upgrade", {
        method: "POST",
        body: { name: f.name.value, email: f.email.value, password: f.password.value, birth_date: f.birth_date.value, accept_privacy: f.accept_privacy.checked, accept_terms: f.accept_terms.checked, country: deviceRegion() },
      });
      if (r.dev_verify_url) store.set("evklid_dev_verify", r.dev_verify_url);
      toast(t("guest.created"));
      await after();
    } catch (err) {
      btn.disabled = false;
      showError(f, err);
      if (err.data?.under_age) {
        errorBox(f).append(" ", t("guest.parentHint"), " ", Object.assign(document.createElement("a"), { href: "/starsi.html?prosnja=1", target: "_blank", textContent: t("guest.parentLink") }));
      }
      if (err.data?.exists) {
        const login = $("#guest-login-form");
        login.closest("details").open = true;
        login.email.value = f.email.value;
        login.password.focus();
      }
    }
  });
  $("#guest-login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const btn = $("button[type=submit]", f);
    btn.disabled = true;
    try {
      await api("/api/auth/login", { method: "POST", body: { email: f.email.value, password: f.password.value } });
      store.set("studentId", null);
      toast(t("guest.moved"));
      setTimeout(() => location.replace("/"), 1200);
    } catch (err) {
      btn.disabled = false;
      showError(f, err);
    }
  });
}

// Zavihek Račun za gosta: ustvari račun (isti profil in napredek) ali se prijavi v obstoječega.
function renderGuestAccount(view, acc) {
  view.innerHTML = `
    <button type="button" class="ghost back me-back">${icon("arrow-left")}${esc(t("nav.me"))}</button>
    <h1>${esc(t("guest.title"))}</h1>
    <div class="card">
      <p>${esc(t("guest.intro"))}</p>
      <p class="muted">${esc(t("guest.limits", { n: acc.free_daily_questions }))}</p>
    </div>
    <div class="card">
      <h2>${esc(t("guest.upgradeTitle"))}</h2>
      ${upgradeForm()}
      ${guestLoginForm()}
    </div>
    <div class="card">
      <p class="muted"><a href="/zasebnost.html" target="_blank">${esc(t("guest.privacy"))}</a></p>
      <button id="delete-account" class="danger" type="button">${esc(t("guest.delete"))}</button>
    </div>`;
  bindGuestForms(async () => {
    setStatus(await api("/api/account/status"));
    if (await route()) await onReadyCb?.({ keepView: true });
  });
  $("#delete-account").addEventListener("click", async () => {
    if (!confirm(t("guest.deleteConfirm"))) return;
    try {
      await api("/api/account", { method: "DELETE", body: {} });
      await clearPrivate();
      store.set("studentId", null);
      location.replace("/");
    } catch (err) {
      toast(err.message);
    }
  });
}

// Uporaba brez računa je bila izklopljena: gost ustvari račun ali se prijavi, napredek ostane.
// Povabilo brez e-naslova: prijatelj z lastnikovo povezavo začne kot gost (brezplačni paket, brez osebnih podatkov).
function renderGuestInvite() {
  shell(`
    <h1>${esc(t("ginv.joinTitle"))}</h1>
    <p>${esc(t("ginv.joinIntro"))}</p>
    <form id="guest-invite-form" class="form">
      <label class="check"><input type="checkbox" name="accept_privacy" required>
        <span>${esc(t("guest.accept"))} <a href="/zasebnost.html" target="_blank">${esc(t("guest.privacy"))}</a></span></label>
      <p class="form-error" role="alert" hidden></p>
      <button class="primary" type="submit">${esc(t("ginv.start"))}</button>
    </form>
    <p class="muted"><a href="#" id="guest-invite-login">${esc(t("guest.haveAccount"))}</a></p>`);
  $("#guest-invite-login").addEventListener("click", (e) => {
    e.preventDefault();
    store.set(GUEST_INVITE, null);
    goAuth("login");
  });
  $("#guest-invite-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const btn = $("button[type=submit]", f);
    btn.disabled = true;
    try {
      await api("/api/auth/guest", { method: "POST", body: { accept_privacy: f.accept_privacy.checked, invite: store.get(GUEST_INVITE), country: deviceRegion() } });
      store.set(GUEST_INVITE, null);
      await continueFlow();
    } catch (err) {
      if (err.data?.invite_invalid) {
        store.set(GUEST_INVITE, null);
        err.message = t("ginv.invalid");
      }
      showError(f, err);
      btn.disabled = false;
    }
  });
}

// Točka A9: skrbnik to sejo potrdi s kodo na e-pošto, šele nato dobi skrbniške strani (12 ur). Samo za skrbnika,
// zato v slovenščini (kot skrbniški del promoBox).
function skrbnikBox() {
  return `
    <div class="card" id="skrbnik-card">
      <h2>Skrbniški dostop</h2>
      <p class="muted">Skrbniške strani se odprejo s kodo, ki jo dobiš na e-pošto. Potrditev velja 12 ur na tej napravi.</p>
      <button id="skrbnik-poslji" type="button">${icon("send")}<span>Pošlji kodo</span></button>
      <form id="skrbnik-form" class="inline form">
        <input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required aria-label="Koda iz e-pošte" placeholder="123456">
        <button class="primary" type="submit">Potrdi</button>
      </form>
      <p class="form-error" role="alert" hidden></p>
    </div>`;
}
function bindSkrbnik() {
  const card = $("#skrbnik-card");
  if (!card) return;
  const err = card.querySelector(".form-error");
  const show = (msg) => {
    err.textContent = msg || "";
    err.hidden = !msg;
  };
  $("#skrbnik-poslji").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    show("");
    try {
      await api("/api/account/skrbnik/koda", { method: "POST" });
      toast("Koda je poslana. Velja 10 minut.");
      card.querySelector("input[name=code]").focus();
    } catch (ex) {
      show(ex.message);
    } finally {
      btn.disabled = false;
    }
  });
  $("#skrbnik-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    show("");
    try {
      await api("/api/account/skrbnik/potrdi", { method: "POST", body: { code: e.currentTarget.code.value } });
      location.reload(); // skrbniški deli (nastavitve, zavihki) se naložijo na novo
    } catch (ex) {
      show(ex.message);
    }
  });
}

// Lastnik: povezava za nekaj prijateljev brez e-naslova (POST /api/admin/guest-invite); prikazana je samo enkrat.
function guestInviteCard() {
  return `
    <div class="card" id="guest-invite-card">
      <h2>${esc(t("ginv.title"))}</h2>
      <p class="muted">${esc(t("ginv.help", { n: 10, days: 14 }))}</p>
      <div id="ginv-out" aria-live="polite"></div>
      <button id="ginv-create" type="button">${esc(t("ginv.create"))}</button>
    </div>`;
}
function bindGuestInvite() {
  $("#ginv-create")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    try {
      const r = await api("/api/admin/guest-invite", { method: "POST" });
      $("#ginv-out").innerHTML = `<p>${esc(t("ginv.once"))} ${esc(t("ginv.until", { date: date(r.expires_at) }))}</p>
        <div class="inline"><input id="ginv-url" readonly value="${esc(r.url)}" aria-label="${esc(t("ginv.title"))}"><button id="ginv-copy" type="button">${esc(t("ginv.copy"))}</button></div>`;
      $("#ginv-copy").addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText($("#ginv-url").value);
          toast(t("pay.copied"));
        } catch {
          $("#ginv-url").select();
        }
      });
    } catch (err) {
      toast(err.message);
    } finally {
      btn.disabled = false;
    }
  });
}

function renderGuestOff() {
  shell(`
    <h1>${esc(t("guest.upgradeTitle"))}</h1>
    <p class="muted">${esc(t("guest.off"))}</p>
    <div class="card">${upgradeForm()}${guestLoginForm()}</div>`);
  bindGuestForms(continueFlow);
}

// Politika zasebnosti se je spremenila po registraciji: pasica v zavihku Račun, dokler je imetnik ne skrije z geslom
// računa (zaklep računa je privzeto izklopljen, zato je ne sme skriti otrok na starševi napravi; pregled B3).
function privacyBanner(acc) {
  if (!acc.parent.privacy_notice) return "";
  return `<div class="card priv-banner" id="priv-banner" role="region" aria-labelledby="priv-title">
    <h2 id="priv-title" class="with-icon">${icon("lock")}${esc(t("starsi.privTitle"))}</h2>
    <p>${esc(t("starsi.privText"))}</p>
    <p><a class="btn-secondary" href="/zasebnost.html" target="_blank" rel="noopener">${icon("external-link")}<span>${esc(t("starsi.privRead"))}</span></a></p>
    <form class="form priv-form" novalidate>
      ${acc.parent.has_password !== false ? `<p class="muted small">${esc(t("starsi.privPwNote"))}</p>` : ""}
      ${proofHtml("priv-pw", acc.parent.has_password !== false)}
      <p class="form-error" role="alert" hidden></p>
      <button type="submit" class="secondary">${esc(t("starsi.privHide"))}</button>
    </form>
  </div>`;
}

function wirePrivacyBanner(hasPassword = true) {
  const box = $("#priv-banner");
  const form = box?.querySelector(".priv-form");
  if (!form) return;
  wireProof(box, { api, toast });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = form.querySelector(".form-error");
    const btn = form.querySelector("button");
    btn.disabled = true;
    try {
      await api("/api/account/privacy-seen", { method: "POST", body: proofBody(form, "priv-pw", hasPassword) });
      if (status?.parent) status.parent.privacy_notice = null;
      box.remove();
      toast(t("starsi.privHidden"), "check");
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
      btn.disabled = false;
      $("#priv-pw").focus();
    }
  });
}

async function renderAccount() {
  const view = $("#view-account");
  let acc;
  try {
    acc = await api("/api/account");
  } catch (err) {
    if (err.data?.guest_off) {
      setStatus(await api("/api/account/status"));
      return route();
    }
    if (err.status === 401) return logout();
    view.innerHTML = `<p class="form-error">${esc(err.message)}</p>`;
    return;
  }
  if (acc.parent.guest) return renderGuestAccount(view, acc);
  setTermsVersion(acc.terms_version); // različica ob potrditvi pogojev pred plačilom (public/pay-ui.js)
  const paid = acc.access.tier === "paid";
  // Aplikacija iz trgovine: brez nakupa s kartico (naročnina, nadgradnja, darilo, Podari, dokup; public/pay-ui.js).
  // Kupljeno ostane vidno (stanje naročnine, darilne kode, preostali pogovori).
  const storeApp = isStoreApp();
  const shown = storeApp ? { ...acc, upgrade: null, gift_buy: false } : acc;
  view.innerHTML = `
    <button type="button" class="ghost back me-back">${icon("arrow-left")}${esc(t("nav.me"))}</button>
    <h1>${esc(t("nav.account"))}</h1>
    ${privacyBanner(acc)}
    ${termsBanner(acc)}
    ${withdrawalLink(acc)}
    ${acc.parent.verified ? "" : `<div class="card" id="verify-card">
      <h2>${esc(t("verify.nudgeTitle"))}</h2>
      <p>${esc(t("verify.nudgeText", { email: acc.parent.email }))}</p>
      <button class="primary" id="verify-open" type="button">${esc(t("verify.open"))}</button>
    </div>`}
    <div class="kolone">
    <div class="card">
      <h2>${esc(t("mob.subscription"))}</h2>
      ${planText(shown)}
      ${!acc.billing ? `<p class="muted">${esc(t("credit.off"))}</p>` : paid || acc.pilot || storeApp ? "" : plansPicker(acc)}
      ${storeApp
        ? paid && acc.parent.has_customer ? `<p class="muted">${esc(t("mob.subElsewhere"))}</p>` : ""
        : acc.billing && acc.parent.has_customer ? `<button id="portal-btn" type="button">${esc(t("acct.portal"))}</button>` : ""}
      ${promoBox(acc, paid || storeApp)}
    </div>
    <div class="card" id="pn-wtp" hidden></div>
    ${acc.skrbnik_potrditev ? skrbnikBox() : ""}
    ${acc.promo?.codes ? adminCodes(acc) : ""}
    ${acc.guest_invite ? guestInviteCard() : ""}
    ${guaranteeBox(acc)}
    ${giftBox(shown)}
    ${storeApp || acc.self_only ? "" : podariBox(acc)}
    ${adminCards(acc)}
    ${withdrawalAdminCard(acc)}
    ${acc.promo?.codes ? `<div class="card" id="pilot-card"><h2>${esc(t("pilot.title"))}</h2><div id="pilot-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>` : ""}
    ${acc.promo?.codes ? `<div class="card" id="pilot-tasks-card"><h2>${esc(t("pilot.n.title"))}</h2><div id="pilot-tasks-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>` : ""}
    ${acc.promo?.codes ? `<div class="card" id="pilot-mnenja-card"><h2>${esc(t("pilot.mn.title"))}</h2><div id="pilot-mnenja-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>` : ""}
    ${acc.promo?.codes ? `<div class="card" id="reports-card"><h2>${esc(t("adm.rep.title"))}</h2><div id="reports-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>` : ""}
    ${acc.promo?.codes ? `<div class="card" id="orders-card"><h2>${esc(t("orders.title"))}</h2><div id="orders-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>` : ""}

    <div class="card">
      <h2>${acc.self_only ? esc(t("mob.profiles")) : "Otroci"}</h2>
      <ul class="child-list">${acc.children
        .map((c) => `<li><b>${esc(c.name)}</b> <span class="muted">(${c.birth_year || "–"})</span> ${
          c.premium ? `<span class="pill ok">${esc(t("acct.fullAccess"))}</span>` : `<span class="pill">${esc(t("acct.freeToday", { used: c.questions_today, max: acc.free_daily_questions }))}</span>`
        }${c.pass ? ` <span class="pill">${esc(t("acct.passPill", { date: date(c.pass.ends_at) }))}</span>` : ""}${c.level_locked ? ` <span class="pill warn">${esc(levelName(c.level))}: ${esc(t("up.locked"))}</span>` : ""} ${aiPill(c.ai_month)}${c.has_password || acc.children.length < 2 ? "" : ` <span class="pill">${esc(t("lock.none"))}</span>`}<div class="pn-acc" data-pn-acc="${c.id}" hidden></div></li>`)
        .join("")}</ul>
      ${acc.children.length ? `<details class="profile-pw"><summary>${esc(t("lock.change"))}</summary>
        <form id="profile-pw-form" class="form" novalidate>
          <label>${esc(t("meter.profile"))} <select name="student_id">${acc.children.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label>
          <label>${esc(t("lock.auth"))} <input type="password" name="auth" autocomplete="current-password" required></label>
          <label>${esc(t("lock.newPw"))} <input type="password" name="password" minlength="${PROFILE_PW_MIN}" maxlength="200" autocomplete="new-password" required></label>
          <p class="form-error" role="alert" hidden></p>
          <button class="primary" type="submit">${esc(t("lock.save"))}</button>
        </form></details>` : ""}
      ${acc.children
        .filter((c) => c.devices.length > acc.device_warn_limit)
        .map((c) => `<p class="warn">${icon("info")} Profil <b>${esc(c.name)}</b> je bil v zadnjih 30 dneh odprt na ${c.devices.length} različnih napravah (${c.devices.map((d) => esc(d.label)).join(", ")}). Če teh naprav ne poznaš, klikni »Odjavi vse druge naprave« in spremeni geslo.</p>`)
        .join("")}
      ${acc.swap_blocked_until
        ? `<p class="muted">Profil lahko zamenjaš enkrat na 30 dni. Nov profil lahko dodaš ${date(acc.swap_blocked_until)}.</p>`
        : acc.children.length < acc.max_children
          ? `<details><summary>Dodaj profil</summary>${childForm(acc.consent_text, await loadPrograms(api), acc.children.length > 0, acc.children.filter((c) => !c.has_password))}</details>`
          : `<p class="muted">${esc(t("acct.profiles", { n: acc.max_children }))}${acc.max_children === 1 && !acc.self_only ? ` ${esc(t("acct.secondChild"))}` : ""}</p>`}
      <p class="muted">Vsak profil je lahko hkrati odprt samo na eni napravi. Profil zamenjaš (izbrišeš v zavihku Nastavitve in dodaš novega) največ enkrat na 30 dni.</p>
    </div>
    ${acc.parent.birth_missing ? `<div class="card" id="birth-card">
      <h2>${esc(t("birth.label"))}</h2>
      <p>${esc(t("birth.accountRow"))}</p>
      ${birthFormHtml(false)}
    </div>` : ""}
    <div id="credit-card"></div>
    <div id="ustno-starsi"></div>

    <div class="card">
      <h2>${icon("award")} Povabi prijatelje</h2>
      ${storeApp ? `<p>Pošlji povezavo prijatelju, ki bi mu Evklid pomagal.</p>` : acc.self_only ? `<p>Ko se prijatelj, ki ga povabiš, naroči in prvič plača na spletu, <b>oba dobita en mesec brezplačno</b>.</p>` : `<p>Ko se družina, ki jo povabiš, naroči in prvič plača na spletu, <b>obe družini dobita en mesec brezplačno</b>.</p>`}
      <div class="inline"><input id="ref-url" readonly value="${esc(acc.referral.url)}"><button id="ref-copy" type="button">Kopiraj</button></div>
      <p class="muted">Tvoja koda: <b>${esc(acc.referral.code)}</b>${acc.referral.rewards ? ` · prisluženi meseci: ${acc.referral.rewards}` : ""}</p>
    </div>
    ${storeApp || !acc.self_only ? "" : podariBox(acc)}

    <div class="card">
      <h2>Tedensko poročilo</h2>
      <label class="check"><input type="checkbox" id="weekly-toggle" ${acc.parent.weekly_email ? "checked" : ""}>
        <span>Vsako nedeljo zvečer mi pošlji kratko poročilo o napredku na ${esc(acc.parent.email)}</span></label>
      <div class="form-actions">
        <a href="/api/account/weekly-report/preview" target="_blank">Predogled</a>
        <button id="weekly-send" type="button">Pošlji mi ga zdaj</button>
      </div>
    </div>

    <div class="card">
      <h2>Podatki in zasebnost</h2>
      <p class="muted"><a href="/zasebnost.html" target="_blank">Obvestilo o varstvu osebnih podatkov</a></p>
      <div class="form-actions">
        <button id="export-btn" type="button">Prenesi vse moje podatke</button>
        <button id="logout-btn" type="button">Odjava</button>
        <button id="logout-others" type="button">Odjavi vse druge naprave</button>
      </div>
      <button id="delete-account" class="danger" type="button">Izbriši račun in vse podatke</button>
    </div>
    </div>`;

  // Izbira števila otrok pokaže samo cene za to izbiro (letno je prvo in izbrano, j 2026-11-04) in nato soglasja ter gumb.
  $("#plan-form")?.addEventListener("change", (e) => {
    if (e.target.name !== "who") return;
    const f = e.currentTarget;
    for (const row of f.querySelectorAll(".plan-row")) row.hidden = row.dataset.who !== e.target.value;
    const first = f.querySelector(`.plan-row[data-who="${e.target.value}"] input[name=plan]`);
    if (first) first.checked = true;
    $("#plan-rest", f).hidden = false;
  });
  $("#plan-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("button[type=submit]", e.target);
    btn.disabled = true;
    try {
      if (!consentsOk(e.target)) throw new Error(consentMessage(e.target, "payp.consentMissing"));
      const r = await api("/api/billing/checkout", { method: "POST", body: { ...planBody(e.target.plan.value), ...consentBody() } });
      markCheckout("sub"); // vrnitev v aplikacijo osveži stanje (public/pay-ui.js)
      location.href = r.url;
    } catch (err) {
      btn.disabled = false;
      showError(e.target, err);
    }
  });
  // Mladoletni imetnik: povezava, s katero plača starš.
  $("#plan-link")?.addEventListener("click", async (e) => {
    const f = $("#plan-form");
    e.target.disabled = true;
    try {
      const r = await api("/api/billing/pay-link", { method: "POST", body: { kind: "sub", ...planBody(f.plan.value) } });
      const out = $("#plan-link-out");
      out.innerHTML = linkBox(r.url);
      bindLinkBox(out, r.url, toast);
    } catch (err) {
      showError(f, err);
    } finally {
      e.target.disabled = false;
    }
  });
  bindAdminCodes(acc);
  const hasPassword = acc.parent.has_password !== false;
  paintAccountPilot($(".child-list"), acc.children, { api, toast, hasPassword });
  paintAccountWtp($("#pn-wtp"), acc.pilot_wtp, { api, toast, hasPassword }); // pilot: »Ali bi za Evklid plačali?« (enkrat)
  wirePrivacyBanner(hasPassword); // starš vidi, ali je profil v pilotu in koliko fotografij je shranjenih
  bindGuarantee(acc, { api, toast, showError, refresh: renderAccount });
  bindWithdrawal(acc, { api, toast, refresh: renderAccount });
  // Kaj je izrisano (refreshAfterPay izriše znova le ob spremembi, da ne pobriše napol izpolnjenih obrazcev).
  setShownSig(null);
  renderCreditCard($("#credit-card"), { api, buy: !storeApp }).then((balance) => setShownSig(paySig(acc, balance)));
  import("./ustno/starsi.js").then((m) => m.karticaStarsev($("#ustno-starsi"), api, { zame: !!acc.self_only })).catch(() => {}); // glas pri ustnem (ob odprtju)
  $("#gift-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("button[type=submit]", e.target);
    btn.disabled = true;
    try {
      if (!consentsOk(e.target)) throw new Error(consentMessage(e.target, "payp.consentMissing"));
      const r = await api("/api/billing/gift", { method: "POST", body: { ...consentBody(), ...(e.target.level ? { level: e.target.level.value } : {}) } });
      markCheckout("gift");
      location.href = r.url;
    } catch (err) {
      btn.disabled = false;
      showError(e.target, err);
    }
  });
  document.querySelectorAll("[data-gift-copy]").forEach((b) =>
    b.addEventListener("click", async () => {
      await navigator.clipboard?.writeText(b.dataset.giftCopy).catch(() => {});
      toast(t("gift.copied"));
    }),
  );
  $("#promo-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("button[type=submit]", e.target);
    btn.disabled = true;
    try {
      const r = await api("/api/account/promo", { method: "POST", body: { code: e.target.code.value } });
      store.set("evklid_koda", null);
      toast(r.gift_until ? t("gift.redeemed", { date: date(r.gift_until) }) : `Aktivacijska koda velja ✓ Poln dostop do ${date(r.access.until)}.`);
      await onReadyCb?.({ keepView: true });
      renderAccount();
    } catch (err) {
      btn.disabled = false;
      showError(e.target, err);
    }
  });
  $("#promo-copy")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("#promo-url").value);
      toast("Povezava je kopirana.");
    } catch {
      $("#promo-url").select();
    }
  });
  // Nadgradnja: Stripe zaračuna razliko za preostanek obdobja, višja stopnja je odprta takoj.
  document.querySelectorAll("[data-upgrade]").forEach((b) =>
    b.addEventListener("click", async () => {
      b.disabled = true;
      try {
        await api("/api/billing/upgrade", { method: "POST", body: { plan: b.dataset.upgrade } });
        toast(t("up.done"));
        await onReadyCb?.({ keepView: true });
        renderAccount();
      } catch (err) {
        b.disabled = false;
        toast(err.message);
      }
    }),
  );
  // Nepotrjen e-naslov (#747): zaslon »Potrdi e-naslov« (Pošlji znova, Sem potrdil(a), Nazaj na učenje).
  $("#verify-open")?.addEventListener("click", async () => {
    setStatus(await api("/api/account/status"));
    if (status.parent?.verified) return renderAccount();
    renderVerify();
  });
  $("#portal-btn")?.addEventListener("click", async () => {
    try {
      location.href = (await api("/api/billing/portal", { method: "POST" })).url;
    } catch (err) {
      toast(err.message);
    }
  });
  if ($("#child-form")) {
    bindChildForm(async () => {
      toast("Otrok je dodan ✓");
      await onReadyCb?.({ keepView: true });
      renderAccount();
    });
  }
  $("#ref-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(acc.referral.url);
      toast("Povezava je kopirana.");
    } catch {
      $("#ref-url").select();
    }
  });
  const ppw = $("#profile-pw-form");
  ppw?.addEventListener("submit", async (e) => {
    e.preventDefault();
    $(".form-error", ppw).hidden = true;
    if (ppw.password.value.length < PROFILE_PW_MIN) return showError(ppw, new Error(t("lock.short")));
    try {
      const id = Number(ppw.student_id.value);
      const password = ppw.password.value;
      await api("/api/account/profile-password", { method: "POST", body: { student_id: id, auth: ppw.auth.value, password } });
      // Novo geslo zaklene profil na vseh napravah; odprt profil na tej napravi ostane odprt.
      if (id === Number(store.get("studentId"))) await api(`/api/students/${id}/unlock`, { method: "POST", body: { password } });
      toast(t("lock.saved"));
      renderAccount();
    } catch (err) {
      showError(ppw, new Error(lockError(err)));
    }
  });
  $("#weekly-toggle").addEventListener("change", (e) => api("/api/account", { method: "PUT", body: { weekly_email: e.target.checked } }));
  const birthCard = $("#birth-card");
  if (birthCard)
    bindBirthForm(birthCard.querySelector(".birth-form"), (r) => {
      status.parent = r.parent;
      if (r.under_age) birthCard.innerHTML = `<h2>${esc(t("birth.label"))}</h2>${underAgeHtml(r.min_age)}`;
      else {
        if (!r.taken) toast(t("birth.saved"));
        renderAccount();
      }
    });
  $("#weekly-send").addEventListener("click", async () => {
    try {
      const r = await api("/api/account/weekly-report/send", { method: "POST" });
      toast(r.dev ? "E-pošta ni nastavljena: poročilo je izpisano v dnevniku strežnika." : "Poročilo je poslano.");
    } catch (err) {
      toast(err.message);
    }
  });
  $("#logout-btn").addEventListener("click", logout);
  $("#logout-others").addEventListener("click", async () => {
    await api("/api/account/logout-others", { method: "POST" });
    toast("Vse druge naprave so odjavljene.");
  });
  // Račun brez gesla (prijava z Apple): namesto vpisa gesla ponudi povezavo za nastavitev gesla na naslov računa.
  const noPassword = async (what) => {
    if (acc.parent.has_password !== false) return false;
    if (!confirm(`Tvoj račun nima gesla (prijavljaš se z Apple). Za ${what} potrebuješ geslo. Pošljemo povezavo za nastavitev gesla na ${acc.parent.email}? Ko geslo nastaviš, bodo vse naprave (tudi otrokove) odjavljene.`)) return true;
    try {
      await api("/api/auth/forgot", { method: "POST", body: { email: acc.parent.email } });
      toast(`Povezavo smo poslali na ${acc.parent.email}. Ko nastaviš geslo, poskusi znova.`);
    } catch (err) {
      toast(err.message);
    }
    return true;
  };
  $("#export-btn").addEventListener("click", async () => {
    if (await noPassword("prenos podatkov")) return;
    const password = prompt("Za prenos vseh podatkov (tudi pogovorov vseh profilov) vpiši geslo računa.");
    if (!password) return;
    try {
      const data = await api("/api/account/export", { method: "POST", body: { password } });
      // Podatki, ki so samo na tej napravi (zgodovina skenerja, neposlani odgovori vaj brez povezave).
      data.device = deviceData((data.children || []).map((c) => c.id));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      a.download = "evklid-podatki.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch (err) {
      toast(err.message);
    }
  });
  $("#delete-account").addEventListener("click", async () => {
    if (await noPassword("izbris računa na spletu")) return;
    const password = prompt("Za izbris računa, vseh otrokovih profilov in pogovorov vpiši geslo. Tega ni mogoče razveljaviti.");
    if (!password) return;
    try {
      await api("/api/account", { method: "DELETE", body: { password } });
      await clearPrivate();
      store.set("studentId", null);
      location.reload();
    } catch (err) {
      toast(err.message);
    }
  });
}

// Odjava na strežniku; ob počasni povezavi največ 6 s, nato napaka (status 0 = ni odziva).

export { renderAccount, renderGuestInvite, renderGuestOff };
