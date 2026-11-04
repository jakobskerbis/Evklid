import { icon } from "./icons.js";
import { loadPrograms, programsCache } from "./programs.js";
import { mountLevelPicker, schoolSystemOptions } from "./level-picker.js";
import { systemForCountry } from "./regions.js";
import { currentLang, currentRegion, deviceRegion, locale, t } from "./i18n.js";
import { openProfileMenu } from "./profile-menu.js";
import { consentFields, consentsOk, consentBody, linkBox, bindLinkBox } from "./pay-ui.js";
import { renderCreditCard } from "./credit-card.js";
import { renderAdminReports } from "./prijave.js";
// Starševski račun: prijava, potrditev e-naslova, otroci s soglasjem, naročnina, priporočila.
// Deluje samo, ko je na strežniku EVKLID_ACCOUNTS=1.

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const eur = (cents) => (cents / 100).toLocaleString("sl-SI", { style: "currency", currency: "EUR" });
// Cena v valuti paketa (regijske cene: rupije, naire …); valute brez decimalk imajo cele enote.
const ZERO_DECIMAL = new Set(["VND", "XOF", "XAF", "UGX", "RWF", "JPY", "KRW", "GNF", "MGA"]);
const money = (minor, currency = "EUR") => {
  if (currency === "EUR") return eur(minor);
  const major = ZERO_DECIMAL.has(currency) ? minor : minor / 100;
  const whole = Number.isInteger(major);
  return major.toLocaleString(currentLang() === "sl" ? "sl-SI" : undefined, { style: "currency", currency, minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 });
};
const date = (iso) => (iso ? new Date(iso).toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" }) : "");
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
};

async function api(url, opts = {}) {
  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `Napaka ${res.status}`), { data, status: res.status });
  return data;
}

let enabled = false;
let status = null;
let onReadyCb = null;

export const accountsOn = () => enabled;

// Profil je lahko hkrati odprt samo na eni napravi. Če ga ima druga naprava,
// strežnik vrne 409 { taken }; ponudimo prevzem.
function watchTakenProfiles() {
  const orig = window.fetch.bind(window);
  window.fetch = async (...args) => {
    let res = await orig(...args);
    // Zaklenjen račun: zavihek Račun in dejanja lastnika zahtevajo geslo računa. Po odklepu zahtevo ponovimo.
    if (res.status === 403) {
      const d = await res.clone().json().catch(() => null);
      if (d?.account_locked && (await askAccountPassword(orig))) res = await orig(...args);
    }
    if (res.status === 409) {
      res.clone().json().then((d) => d?.taken && showTaken(d, orig)).catch(() => {});
    }
    // Profil je bil medtem zaklenjen (novo geslo profila, »Odjavi vse druge naprave« na drugi napravi).
    if (res.status === 423) {
      res.clone().json().then((d) => {
        if (!d?.locked || $("#lock-overlay")) return;
        openProfileLock({ id: d.student_id, name: d.name, locked: true }).then((id) => {
          store.set("studentId", String(id));
          location.reload();
        });
      }).catch(() => {});
    }
    return res;
  };
}

// Okno za geslo računa. Hkratne zahteve počakajo na isti vpis. Vrne true, ko je račun odklenjen.
let accountAsk = null;
function askAccountPassword(rawFetch) {
  if (accountAsk) return accountAsk;
  accountAsk = new Promise((resolve) => {
    const box = document.createElement("div");
    box.id = "account-lock-overlay";
    box.className = "overlay";
    box.innerHTML = `<div class="card overlay-card lock-card" role="dialog" aria-modal="true" aria-labelledby="acc-lock-title">
      <span class="pm-avatar big" aria-hidden="true">${icon("lock")}</span>
      <h2 id="acc-lock-title">Samo za lastnika računa</h2>
      <form class="form" id="acc-lock-form" novalidate>
        <p class="muted">Račun, naročnino in profile ureja lastnik računa. Vpiši geslo računa (tisto, s katerim se prijaviš z e-naslovom).</p>
        <label>Geslo računa <input type="password" name="password" autocomplete="current-password" required></label>
        <p class="form-error" role="alert" hidden></p>
        <div class="form-actions">
          <button class="primary" type="submit">Odkleni</button>
          <button type="button" class="ghost" id="acc-lock-cancel">Prekliči</button>
        </div>
      </form></div>`;
    document.body.appendChild(box);
    const form = $("#acc-lock-form", box);
    form.password.focus();
    const finish = (ok) => {
      box.remove();
      accountAsk = null;
      resolve(ok);
    };
    $("#acc-lock-cancel", box).addEventListener("click", () => finish(false));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const r = await rawFetch("/api/account/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: form.password.value }),
      }).catch(() => null);
      if (r?.ok) return finish(true);
      const d = await r?.json().catch(() => ({}));
      const box2 = $(".form-error", form);
      box2.textContent = d?.error || "Strežnik ni dosegljiv.";
      box2.hidden = false;
      form.password.select();
    });
  });
  return accountAsk;
}

// Ko zapustiš zavihek Račun, se račun na tej napravi takoj zaklene (samo z EVKLID_ACCOUNT_LOCK=1).
function lockAccountOnLeave() {
  const view = $("#view-account");
  if (!view) return;
  let wasOpen = !view.hidden;
  new MutationObserver(() => {
    if (wasOpen && view.hidden && status?.account_lock) {
      view.innerHTML = ""; // podatki računa ne ostanejo na zaslonu za zaklepom
      fetch("/api/account/lock", { method: "POST" }).catch(() => {});
    }
    wasOpen = !view.hidden;
  }).observe(view, { attributes: true, attributeFilter: ["hidden"] });
}

function showTaken(d, rawFetch) {
  if ($("#taken-overlay")) return;
  const box = document.createElement("div");
  box.id = "taken-overlay";
  box.className = "overlay";
  box.innerHTML = `<div class="card overlay-card">
    <h2>Profil je odprt drugje</h2>
    <p>${esc(d.error)}</p>
    <p class="muted">Če nadaljuješ tukaj, se na drugi napravi profil zapre.</p>
    <div class="form-actions">
      <button class="primary" id="taken-here" type="button">Nadaljuj tukaj</button>
      <button id="taken-other" type="button">Izberi drug profil</button>
    </div></div>`;
  document.body.appendChild(box);
  $("#taken-here").addEventListener("click", async () => {
    await rawFetch(`/api/students/${d.student_id}/claim`, { method: "POST" });
    store.set("studentId", String(d.student_id));
    location.reload();
  });
  $("#taken-other").addEventListener("click", () => {
    box.remove();
    openProfileMenu();
  });
}

// ---------- geslo profila ----------
// Vsak profil ima svoje geslo. Zaklenjen profil (locked) odpre geslo; profil brez gesla (needs_password)
// pred prvo uporabo dobi geslo. Vrne id profila, ki ga odpremo: tega ali drugega, ki ga izbere uporabnik.
const PROFILE_PW_MIN = 4;
// Strežnik ni dosegljiv (računalnik z Evklidom ugasnjen, tunel ne teče): brez odziva ali napaka 5xx.
const unreachable = (err) => !err.status || err.status >= 500;
const lockError = (err) => (unreachable(err) ? t("lock.offline") : err.status === 401 ? t("lock.wrong") : err.status === 429 ? t("lock.tooMany") : err.message);

export function openProfileLock(student, students = []) {
  $("#lock-overlay")?.remove();
  const set = !student.locked;
  const others = students.filter((s) => s.id !== student.id);
  const pw = (name, auto, label) =>
    `<label>${esc(label)} <input type="password" name="${name}" minlength="${PROFILE_PW_MIN}" maxlength="200" autocomplete="${auto}" required></label>`;
  const box = document.createElement("div");
  box.id = "lock-overlay";
  box.className = "overlay";
  box.innerHTML = `<div class="card overlay-card lock-card" role="dialog" aria-modal="true" aria-labelledby="lock-title">
    <span class="pm-avatar big" aria-hidden="true">${esc((student.name || "?").trim().charAt(0).toUpperCase() || "?")}</span>
    <h2 id="lock-title" dir="auto">${esc(student.name)}</h2>
    <form class="form" id="lock-form" novalidate>
      <p class="muted">${esc(set ? t("lock.setText") : t("lock.text"))}</p>
      ${pw("password", set ? "new-password" : "current-password", t("lock.password"))}
      ${set ? `${pw("repeat", "new-password", t("lock.repeat"))}<small class="muted">${esc(t("lock.hint"))}</small>` : ""}
      <p class="form-error" role="alert" hidden></p>
      <button class="primary" type="submit">${esc(set ? t("lock.save") : t("lock.open"))}</button>
    </form>
    ${set ? "" : `<details class="lock-forgot"><summary>${esc(t("lock.forgot"))}</summary>
      <form class="form" id="lock-reset" novalidate>
        <p class="muted">${esc(t("lock.forgotText"))}</p>
        ${pw("auth", "current-password", t("lock.accountPw"))}
        ${pw("password", "new-password", t("lock.newPw"))}
        <p class="form-error" role="alert" hidden></p>
        <button type="submit">${esc(t("lock.save"))}</button>
      </form></details>`}
    ${others.length ? `<p class="muted lock-others-title">${esc(t("lock.other"))}</p>
      <div class="lock-others">${others.map((o) => `<button type="button" data-id="${o.id}" dir="auto">${esc(o.name)}</button>`).join("")}</div>` : ""}
    <form method="post" action="/api/auth/logout" class="lock-logout"><p class="form-error" role="alert" hidden></p><button type="submit" class="ghost" id="lock-logout">${esc(t("pm.logout"))}</button></form>
  </div>`;
  document.body.appendChild(box);
  // Aplikacija za zaslonom ni dosegljiva s tipko Tab ali bralnikom zaslona, dokler je profil zaklenjen.
  const behind = [...document.body.children].filter((el) => el !== box);
  behind.forEach((el) => (el.inert = true));
  const f = $("#lock-form", box);
  f.password.focus();
  const fail = (form, msg) => {
    const e = $(".form-error", form);
    e.textContent = msg;
    e.hidden = false;
  };
  const checkNew = (form, a, b) => {
    if (a.length < PROFILE_PW_MIN) return fail(form, t("lock.short")), false;
    if (b !== undefined && a !== b) return fail(form, t("lock.mismatch")), false;
    return true;
  };
  return new Promise((resolve) => {
    const done = (id) => {
      behind.forEach((el) => (el.inert = false));
      box.remove();
      resolve(id);
    };
    let busy = false;
    const submit = (form, run) =>
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (busy) return;
        busy = true;
        const btn = $('button[type="submit"]', form);
        btn.disabled = true;
        try {
          await run();
        } catch (err) {
          fail(form, lockError(err));
        } finally {
          busy = false;
          btn.disabled = false;
        }
      });
    submit(f, async () => {
      const v = f.password.value;
      if (set && !checkNew(f, v, f.repeat.value)) return;
      if (!v) return fail(f, t("lock.wrong"));
      await api(`/api/students/${student.id}/unlock`, { method: "POST", body: set ? { password: v, set: true } : { password: v } });
      done(student.id);
    });
    const r = $("#lock-reset", box);
    if (r) {
      submit(r, async () => {
        if (!checkNew(r, r.password.value)) return;
        await api("/api/account/profile-password", { method: "POST", body: { student_id: student.id, auth: r.auth.value, password: r.password.value } });
        await api(`/api/students/${student.id}/unlock`, { method: "POST", body: { password: r.password.value } });
        toast(t("lock.saved"));
        done(student.id);
      });
    }
    box.querySelectorAll(".lock-others [data-id]").forEach((b) => b.addEventListener("click", () => done(Number(b.dataset.id))));
    // Odjava je navaden obrazec (deluje tudi brez skripta); s skriptom pokažemo napako, ko strežnik ni dosegljiv
    // (sicer bi aplikacija iz shranjene kopije spet pokazala isto okno in gumb bi bil videti mrtev).
    const out = $(".lock-logout", box);
    submit(out, async () => {
      await logoutRequest();
      store.set("studentId", null);
      location.replace("/?odjava=1");
    });
  });
}

function toast(msg) {
  const t = $("#toast");
  if (!t) return alert(msg);
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.hidden = true), 4000);
}

function authMode(on) {
  document.body.classList.toggle("auth-mode", on);
  $("#view-auth").hidden = !on;
  if (on) document.querySelectorAll(".view").forEach((v) => (v.hidden = v.id !== "view-auth"));
}

const errorBox = (form) => $(".form-error", form);
function showError(form, err) {
  const box = errorBox(form);
  box.textContent = err.message;
  box.hidden = false;
}

// ---------- zagon ----------

// Vrne true, ko lahko aplikacija naloži učence. Sicer prikaže prijavo in pozneje pokliče onReady.
export async function initAccount({ onReady }) {
  onReadyCb = onReady;
  status = await api("/api/account/status").catch(() => ({ enabled: false }));
  enabled = !!status.enabled;
  if (!enabled) return true;
  $("#account-tab").hidden = false;
  watchTakenProfiles();
  lockAccountOnLeave();
  guardLogoOnAuth();
  $("#account-tab").addEventListener("click", renderAccount);

  const q = new URLSearchParams(location.search);
  if (q.get("ref")) store.set("evklid_ref", q.get("ref"));
  if (q.get("koda")) store.set("evklid_koda", q.get("koda"));
  // Povezava s strani za starše (starsi.html): starš ustvari račun, otrokovo ime je že vpisano.
  const parentInvite = q.get("starsi") === "1";
  if (parentInvite) {
    store.set("evklid_invite_name", (q.get("ime") || "").slice(0, 40) || null);
    store.set(AGE_BLOCK, null);
  }
  const reset = q.get("reset");
  const verified = q.get("verified");
  const billing = q.get("billing");
  const sessionId = q.get("session_id");
  if (q.toString()) history.replaceState(null, "", location.pathname);
  if (verified === "1") toast("E-naslov je potrjen ✓");
  if (verified === "0") toast("Povezava za potrditev ni veljavna ali je že uporabljena.");

  if (reset) {
    renderReset(reset);
    return false;
  }
  if (billing && status.logged_in) {
    if (billing === "pass" && sessionId) {
      // Paket pred testom: potrditev plačila ob vrnitvi (deluje tudi brez webhooka).
      const r = await api("/api/billing/pass/confirm", { method: "POST", body: { session_id: sessionId } }).catch(() => null);
      toast(r?.paid ? t("pass.paid") : t("pass.pending"));
    } else if (billing === "credit" && sessionId) {
      // Dokup porabe AI: potrditev ob vrnitvi s plačilne strani (deluje tudi brez webhooka).
      const r = await api("/api/billing/credit/confirm", { method: "POST", body: { session_id: sessionId } }).catch(() => null);
      toast(r?.paid ? t("credit.paid") : t("credit.pending"));
    } else if (billing === "gift" && sessionId) {
      // Darilna koda: potrditev ob vrnitvi; koda je potem v zavihku Račun.
      const r = await api("/api/billing/gift/confirm", { method: "POST", body: { session_id: sessionId } }).catch(() => null);
      toast(r?.paid ? t("gift.paid") : t("pass.pending"));
    } else if (billing !== "cancel") await api("/api/billing/sync", { method: "POST" }).catch(() => {});
    if (billing === "success") toast("Hvala! Naročnina je aktivna.");
    status = await api("/api/account/status");
  }
  if (parentInvite) route.firstMode = "register";
  const ready = await route();
  route.firstMode = null;
  if (ready && billing) setTimeout(() => $("#account-tab").click(), 0);
  return ready;
}

// Na zaslonih prijave logotip ne odpira menija »Nadaljuj z učenjem« (brez profila ne deluje).
// Skriti vhod za goste (dotik logotipa) je odstranjen skupaj z uporabo brez računa (j, 2026-10-29).
function guardLogoOnAuth() {
  document.addEventListener(
    "click",
    (e) => {
      if (!e.target.closest(".brand") || !document.body.classList.contains("auth-mode")) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    },
    true,
  );
}

async function route() {
  if (!status.logged_in) return renderLogin(route.firstMode || "login"), false;
  // Uporaba brez računa je izklopljena: gost lahko samo ustvari račun in obdrži napredek.
  if (status.parent.guest && !status.guest_mode) return renderGuestOff(), false;
  if (!status.parent.verified && !status.parent.guest) return renderVerify(), false;
  if (!status.children) return renderAddChild(), false;
  authMode(false);
  adjustAppForAccounts();
  return true;
}

async function continueFlow() {
  status = await api("/api/account/status");
  if (await route()) await onReadyCb?.();
}

// Učenca dodaja starš s soglasjem v zavihku Račun (porabo AI skrije strežnik vsem razen skrbniku).
function adjustAppForAccounts() {
  const card = $("#new-student-card");
  if (card) card.hidden = true;
}

// Ko starš izbriše zadnjega otroka.
export function openAddChild() {
  renderAddChild();
}

// ---------- prijava in registracija ----------

function shell(inner) {
  authMode(true);
  $("#view-auth").innerHTML = `<div class="auth-box">${inner}</div>`;
}

// Po zavrnjeni registraciji zaradi starosti naprava 24 ur kaže stran s povezavo za starše.
const AGE_BLOCK = "evklid_age_block";
const ageBlocked = () => Date.now() - Number(store.get(AGE_BLOCK) || 0) < 86400000;

function renderLogin(mode = "login") {
  if (mode === "register" && ageBlocked()) return renderAskParent();
  const invited = mode === "register" && store.get("evklid_invite_name");
  const ref = store.get("evklid_ref") || "";
  const koda = store.get("evklid_koda") || "";
  shell(`
    <h1>${mode === "login" ? "Prijava" : "Nov račun"}</h1>
    <p class="muted">${mode === "login" ? "Za starše (otrokov profil) in za dijake ter študente (lasten profil)." : `Evklid je 7 dni brezplačen, brez kartice. Nato ${eur(999)} na mesec ali brezplačni paket z omejenim številom vprašanj.`}</p>
    ${invited ? `<p class="card">Ustvari svoj račun starša. Nato dodaš otrokov profil (<b>${esc(invited)}</b>) in s tem daš soglasje.</p>` : ""}
    <form id="auth-form" class="card form">
      ${mode === "register" ? `<label>Tvoje ime (neobvezno) <input name="name" maxlength="60" autocomplete="name"></label>` : ""}
      <label>E-naslov <input name="email" type="email" required autocomplete="email"></label>
      <label>Geslo <input name="password" type="password" required minlength="8" autocomplete="${mode === "login" ? "current-password" : "new-password"}"></label>
      ${mode === "register" ? `
        <label>Tvoj datum rojstva <input name="birth_date" type="date" required min="1900-01-01" max="${new Date().toISOString().slice(0, 10)}" autocomplete="bday"></label>
        <label>Aktivacijska koda (neobvezno) <input name="promo_code" maxlength="40" autocapitalize="characters" value="${esc(koda)}"></label>
        <label>Koda priporočila (neobvezno) <input name="referral_code" maxlength="12" value="${esc(ref)}"></label>
        <label class="check"><input type="checkbox" name="accept_privacy" required>
          <span>Prebral(a) sem <a href="/zasebnost.html" target="_blank">obvestilo o varstvu osebnih podatkov</a>. Račun ustvarjam zase (dijak ali študent) ali kot starš ali zakoniti zastopnik.</span></label>` : ""}
      <p class="form-error" hidden></p>
      <button class="primary" type="submit">${mode === "login" ? "Prijava" : "Ustvari račun"}</button>
    </form>
    <p class="auth-links">
      ${mode === "login"
        ? `Še nimaš računa? <a href="#" data-go="register">Registracija</a> · <a href="#" data-go="forgot">Pozabljeno geslo</a>`
        : `Že imaš račun? <a href="#" data-go="login">Prijava</a>`}
    </p>`);
  bindLinks();
  $("#auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    try {
      if (mode === "login") {
        await api("/api/auth/login", { method: "POST", body: { email: f.email.value, password: f.password.value } });
      } else {
        const r = await api("/api/auth/register", {
          method: "POST",
          body: { name: f.name.value, email: f.email.value, password: f.password.value, referral_code: f.referral_code.value, promo_code: f.promo_code.value, accept_privacy: f.accept_privacy.checked, birth_date: f.birth_date.value, country: deviceRegion() },
        });
        store.set("evklid_ref", null);
        store.set("evklid_koda", null);
        if (r.promo_until) toast(`Aktivacijska koda velja ✓ Poln dostop do ${date(r.promo_until)}.`);
        if (r.promo_error) toast(`Račun je ustvarjen, koda pa ni bila sprejeta: ${r.promo_error}`);
        if (r.dev_verify_url) store.set("evklid_dev_verify", r.dev_verify_url);
      }
      await continueFlow();
    } catch (err) {
      if (err.data?.under_age) {
        store.set(AGE_BLOCK, String(Date.now()));
        return renderAskParent(err.data.min_age);
      }
      showError(f, err);
    }
  });
}

// Premlad za lasten račun: povezava za starše s vsemi podatki (kaj je Evklid, podatki, cena, soglasje).
function renderAskParent(minAge) {
  const linkFor = (name) => `${location.origin}/starsi.html${name ? `?ime=${encodeURIComponent(name)}` : ""}`;
  shell(`
    <h1>Vprašaj starše</h1>
    <p class="muted">${minAge ? `Za mlajše od ${minAge} let` : "Za mlajše učence"} račun ustvari starš ali skrbnik. Pošlji jim to povezavo: tam piše, kaj je Evklid, katere podatke hranimo in koliko stane. Ko starš ustvari račun in doda tvoj profil, se lahko začneš učiti.</p>
    <form id="ask-parent" class="card form">
      <label>Tvoje ime ali vzdevek (neobvezno) <input name="name" maxlength="40" placeholder="npr. Miha"></label>
      <label>E-naslov starša <input name="parent_email" type="email" autocomplete="off" inputmode="email" placeholder="npr. mama@primer.si"></label>
      <div class="form-actions">
        <button class="primary" type="button" data-act="send">Pošlji staršu</button>
      </div>
      <p class="muted" data-sent hidden></p>
      <label>Ali pošlji povezavo sam(a) <input name="link" readonly value="${esc(linkFor(""))}"></label>
      <div class="form-actions">
        <button type="button" data-act="share">Deli (Viber, WhatsApp, SMS …)</button>
        <button type="button" data-act="copy">Kopiraj povezavo</button>
      </div>
    </form>
    <p class="auth-links">Si starš? <a href="/starsi.html">Preberi več in ustvari račun</a> · <a href="#" data-go="login">Prijava</a></p>`);
  bindLinks();
  const f = $("#ask-parent");
  const link = () => linkFor(f.name.value.trim());
  const text = () => {
    const n = f.name.value.trim();
    return `${n ? `${n} bi rad(a)` : "Rad(a) bi"} uporabljal(a) Evklid, AI inštruktorja za matematiko, fiziko in kemijo. Za to potrebujem tvoje dovoljenje:`;
  };
  const mail = () => (location.href = `mailto:?subject=${encodeURIComponent("Evklid – prosim za dovoljenje")}&body=${encodeURIComponent(`${text()}\n${link()}`)}`);
  f.name.addEventListener("input", () => (f.link.value = link()));
  // Evklid pošlje staršu e-pošto s povezavo (naslova ne shrani); otrok ne potrebuje svoje e-pošte.
  f.querySelector('[data-act="send"]').addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    const sent = f.querySelector("[data-sent]");
    btn.disabled = true;
    try {
      await api("/api/auth/ask-parent", { method: "POST", body: { email: f.parent_email.value, name: f.name.value } });
      sent.textContent = `Poslano na ${f.parent_email.value.trim()}. Naj starš pogleda tudi med vsiljeno pošto. Ko ustvari račun in doda tvoj profil, se lahko začneš učiti.`;
      sent.hidden = false;
      errorBox(f).hidden = true;
      f.parent_email.value = "";
    } catch (err) {
      showError(f, err);
    } finally {
      btn.disabled = false;
    }
  });
  f.querySelector('[data-act="copy"]').addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(link());
      toast("Povezava je kopirana.");
    } catch {
      f.link.select();
    }
  });
  f.querySelector('[data-act="share"]').addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Evklid", text: text(), url: link() });
      } catch {}
    } else mail();
  });
}

function bindLinks() {
  document.querySelectorAll("[data-go]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const go = a.dataset.go;
      if (go === "forgot") renderForgot();
      else renderLogin(go);
    }),
  );
}

function renderForgot() {
  shell(`
    <h1>Pozabljeno geslo</h1>
    <form id="auth-form" class="card form">
      <label>E-naslov <input name="email" type="email" required autocomplete="username"></label>
      <p class="form-error" hidden></p>
      <button class="primary" type="submit">Pošlji povezavo</button>
    </form>
    <p class="auth-links"><a href="#" data-go="login">Nazaj na prijavo</a></p>`);
  bindLinks();
  $("#auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const r = await api("/api/auth/forgot", { method: "POST", body: { email: e.target.email.value } });
      e.target.outerHTML = `<div class="card"><p>Če račun s tem e-naslovom obstaja, smo ti poslali povezavo za novo geslo.</p>${
        r.dev_reset_url ? `<p class="muted">Razvojni način (e-pošta ni nastavljena): <a href="${esc(r.dev_reset_url)}">nastavi geslo</a></p>` : ""
      }</div>`;
    } catch (err) {
      showError(e.target, err);
    }
  });
}

function renderReset(token) {
  shell(`
    <h1>Novo geslo</h1>
    <form id="auth-form" class="card form">
      <label>Novo geslo <input name="password" type="password" required minlength="8" autocomplete="new-password"></label>
      <p class="form-error" hidden></p>
      <button class="primary" type="submit">Shrani geslo</button>
    </form>`);
  $("#auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await api("/api/auth/reset", { method: "POST", body: { token, password: e.target.password.value } });
      toast("Geslo je spremenjeno ✓");
      await continueFlow();
    } catch (err) {
      showError(e.target, err);
    }
  });
}

function renderVerify() {
  const dev = store.get("evklid_dev_verify");
  shell(`
    <h1>Potrdi e-naslov</h1>
    <div class="card">
      <p>Na <b>${esc(status.parent.email)}</b> smo poslali povezavo. Klikni jo, nato se vrni sem.</p>
      <p class="muted">S potrditvijo tudi izjaviš, da si starš ali zakoniti zastopnik otroka. To zahteva zakon o varstvu podatkov za otroke, mlajše od 15 let.</p>
      ${dev && !status.email ? `<p class="muted">Razvojni način (e-pošta ni nastavljena): <a href="${esc(dev)}">potrdi e-naslov</a></p>` : ""}
      ${!dev && !status.email ? `<p class="warn">Pošiljanje e-pošte še ni nastavljeno, zato povezava ni prišla. Na računalniku, kjer teče Evklid, se prijavi v ta račun in klikni »Pošlji znova«.</p>` : ""}
      <div class="form-actions">
        <button class="primary" id="verify-done" type="button">Sem potrdil(a)</button>
        <button id="verify-resend" type="button">Pošlji znova</button>
        <button id="verify-logout" type="button">Odjava</button>
      </div>
    </div>`);
  $("#verify-done").addEventListener("click", continueFlow);
  $("#verify-resend").addEventListener("click", async () => {
    const r = await api("/api/auth/resend-verification", { method: "POST" });
    if (r.dev_verify_url) store.set("evklid_dev_verify", r.dev_verify_url);
    toast("Povezava je poslana znova.");
    if (r.dev_verify_url) renderVerify();
  });
  $("#verify-logout").addEventListener("click", logout);
}

// ---------- otroci ----------

// password: geslo profila samo za drugi in nadaljnje profile (en profil ga ne potrebuje, j 2026-10-30);
// others: obstoječi profili brez gesla, ki ga z drugim profilom dobijo tudi sami.
function childForm(consentText, programs = [], password = true, others = []) {
  const y = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => y - 6 - i);
  // Mladoletni imetnik računa ustvari samo svoj profil (letnica iz datuma rojstva ob registraciji).
  const self = !!status?.parent?.minor;
  const invited = store.get("evklid_invite_name") || "";
  // Polnoletni imetnik izbere: profil za otroka (soglasje starša) ali zase (dijak/študent, dovolj star za lastno soglasje).
  const choice = self ? "" : `
      <fieldset class="whose-field">
        <legend>Za koga je profil?</legend>
        <label class="check"><input type="radio" name="whose" value="child"${invited ? " checked" : ""} required> <span>Za mojega otroka (dam soglasje kot starš)</span></label>
        <label class="check"><input type="radio" name="whose" value="self"> <span>Zame: sem dijak ali študent, star vsaj 15 let, in soglašam sam</span></label>
      </fieldset>`;
  return `
    <form id="child-form" class="card form${self ? " self-profile" : ""}">${choice}
      <label>${self ? "Tvoje ime ali vzdevek" : "Ime ali vzdevek"} <input name="name" maxlength="40" required placeholder="npr. Miha" value="${esc(invited)}"></label>
      <fieldset class="level-field">
        <legend>Šola in letnik</legend>
        <label class="system-field"><span>Država in šolski sistem</span>
          <select name="school_system">${schoolSystemOptions(systemForCountry(deviceRegion()))}</select>
        </label>
        <div class="level-picker child-level"></div>
        <small class="muted">Vsebina se prilagodi izbiri; pri fakulteti sledi javnemu predmetniku programa. Izbiro lahko kadar koli spremeniš v profilu.</small>
        <input type="hidden" name="educational_track">
        <input type="hidden" name="study_program">
        <input type="hidden" name="curriculum_level">
      </fieldset>
      <label class="year-field"${self ? " hidden" : ""}>Letnica rojstva
        <select name="birth_year"${self ? "" : " required"}><option value="">Izberi …</option>${years.map((v) => `<option>${v}</option>`).join("")}</select>
      </label>
      ${status?.parent?.guest || !password ? "" : `<label>${esc(t("lock.password"))} <input type="password" name="profile_password" minlength="${PROFILE_PW_MIN}" maxlength="200" autocomplete="new-password" required></label>
      ${others.map((o) => `<label>${esc(t("lock.passwordFor", { name: o.name }))} <input type="password" name="other_pw_${o.id}" data-other="${o.id}" minlength="${PROFILE_PW_MIN}" maxlength="200" autocomplete="new-password" required></label>`).join("")}
      <small class="muted">${esc(t("lock.hint"))}</small>`}
      <label class="check"><input type="checkbox" name="consent" required>
        <span class="consent-self"${self ? "" : " hidden"}>Profil je moj. Prebral(a) sem <a href="/zasebnost.html" target="_blank">obvestilo o varstvu podatkov</a> in soglašam z obdelavo svojih podatkov (ime ali vzdevek, letnica rojstva, nastavitve, pogovori z AI inštruktorjem, fotografije nalog in napredek) za namen učenja.</span>
        <span class="consent-child"${self ? " hidden" : ""}>${esc(consentText)} <a href="/zasebnost.html" target="_blank">Obvestilo o varstvu podatkov</a>.</span>
</label>
      <p class="form-error" hidden></p>
      <button class="primary" type="submit">Ustvari profil</button>
    </form>`;
}

// Nastavitve profila iz obrazca: šola, program in letnik.
function childSettings(f) {
  const track = f.educational_track.value;
  const base = { school_system: f.school_system.value, educational_track: track, study_program: f.study_program.value, curriculum_level: f.curriculum_level.value, language: currentLang(), region: currentRegion() };
  if (track === "UNIVERZA") return { ...base, subject: programsCache().find((p) => p.id === f.study_program.value)?.mainSubject || "MAT" };
  return base;
}

function bindChildForm(after) {
  const f = $("#child-form");
  const fixedSelf = f.classList.contains("self-profile");
  const isSelf = () => fixedSelf || f.whose?.value === "self";
  // Lasten profil: soglasje dijaka/študenta; letnica iz datuma rojstva ob registraciji, če ga imamo.
  const sync = () => {
    const own = isSelf();
    f.querySelector(".consent-self").hidden = !own;
    f.querySelector(".consent-child").hidden = own;
    const knownYear = own && status?.parent?.birth_year;
    f.querySelector(".year-field").hidden = fixedSelf || !!knownYear;
    f.birth_year.required = !(fixedSelf || knownYear);
  };
  f.querySelectorAll('input[name="whose"]').forEach((r) => r.addEventListener("change", sync));
  // Pri fakulteti je profil najpogosteje študentov lasten.
  const toggle = (_, track) => {
    if (fixedSelf || !f.whose) return;
    if (track === "UNIVERZA" && !f.whose.value) f.querySelector('input[name="whose"][value="self"]').checked = true;
    sync();
  };
  const picker = mountLevelPicker(f.querySelector(".child-level"), f, { programs: programsCache(), settings: { school_system: f.school_system.value }, onChange: toggle });
  f.school_system.addEventListener("change", () => picker.setSystem(f.school_system.value));
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!picker.complete()) return showError(f, new Error("Izberi šolo in letnik do konca."));
    const profilePw = f.profile_password?.value;
    if (f.profile_password && profilePw.length < PROFILE_PW_MIN) return showError(f, new Error(t("lock.short")));
    const otherPasswords = {};
    for (const el of f.querySelectorAll("[data-other]")) {
      if (el.value.length < PROFILE_PW_MIN) return showError(f, new Error(t("lock.short")));
      otherPasswords[el.dataset.other] = el.value;
    }
    try {
      const s = await api("/api/students", {
        method: "POST",
        body: { name: f.name.value, birth_year: Number(f.birth_year.value), self: isSelf(), consent: f.consent.checked, settings: childSettings(f), ...(profilePw ? { profile_password: profilePw } : {}), ...(Object.keys(otherPasswords).length ? { other_passwords: otherPasswords } : {}) },
      });
      store.set("studentId", String(s.id));
      store.set("evklid_invite_name", null);
      await after(s);
    } catch (err) {
      showError(f, err);
    }
  });
}

async function renderAddChild() {
  const [acc, programs] = await Promise.all([api("/api/account"), loadPrograms(api)]);
  shell(`
    <h1>Ustvari profil</h1>
    <p class="muted">Vsak učenec, dijak ali študent ima svoj profil z učno potjo in napredkom. Za otroke, mlajše od 15 let, je potrebno soglasje starša.</p>
    ${childForm(acc.consent_text, programs, acc.children?.length > 0)}
    <p class="auth-links"><a href="#" id="add-child-logout">Odjava</a></p>`);
  $("#add-child-logout").addEventListener("click", (e) => (e.preventDefault(), logout()));
  bindChildForm(continueFlow);
}

// ---------- zavihek Račun ----------

const STATUS_TEXT = {
  active: "aktivna",
  trialing: "brezplačni preizkus",
  past_due: "plačilo ni uspelo – posodobi kartico",
  canceled: "preklicana",
  unpaid: "neplačana",
  incomplete: "nedokončana",
  incomplete_expired: "potekla",
  paused: "zaustavljena",
};


// Poraba inštruktorja ta mesec kot delež mesečne omejitve (brez zneskov).
function aiPill(a) {
  if (!a || a.percent == null) return "";
  if (a.hard_reached) return `<span class="pill warn" title="Inštruktor bo spet na voljo 1. v mesecu. Vadnica deluje naprej.">inštruktor ta mesec porabljen</span>`;
  const extra = a.soft_reached ? " · razlage so do konca meseca manj podrobne" : "";
  return `<span class="pill" title="Delež mesečne omejitve za inštruktorja AI">inštruktor ta mesec ${a.percent} %${extra}</span>`;
}

function planText(acc) {
  const { access, parent } = acc;
  const sub = parent.subscription;
  const plan = sub && acc.plans.find((p) => p.key === sub.plan);
  if (access.tier === "paid") {
    return `<p><b>Naročnina:</b> ${esc(plan?.label || sub.plan)} (${STATUS_TEXT[sub.status] || sub.status})</p>
      <p class="muted">${sub.cancel_at_period_end ? `Naročnina se konča ${date(sub.period_end)}.` : `Naslednje obdobje se začne ${date(sub.period_end)}.`}</p>`;
  }
  if (access.tier === "trial") return `<p><b>Brezplačni preizkus</b> do ${date(access.until)}: vse funkcije za do 2 otroka.</p>`;
  if (access.tier === "promo") {
    const trial = Date.parse(parent.trial_ends_at || 0) > Date.now();
    return `<p><b>Poln dostop z aktivacijsko kodo</b> do ${date(access.until)}.</p>${
      trial ? `<p class="muted">Do ${date(parent.trial_ends_at)} (preizkus) lahko uporabljata 2 otroka, nato velja koda za ${acc.promo?.seats > 1 ? `${acc.promo.seats} otroke` : "1 otroka"}.</p>` : ""}`;
  }
  if (access.tier === "bonus") return `<p><b>Brezplačni mesec</b> iz priporočila do ${date(access.until)}.</p>`;
  if (access.tier === "gift") return `<p>${esc(t("gift.tier", { date: date(access.until) }))}</p>`;
  return `<p><b>Brezplačni paket:</b> vadnica brez omejitev in ${acc.free_daily_questions} vprašanj inštruktorju na dan.</p>`;
}

function plansPicker(acc) {
  const cell = (seats, interval) => {
    const p = acc.plans.find((x) => x.seats === seats && x.interval === interval);
    const cur = p.currency || "EUR";
    const perMonth = interval === "year" ? `<span class="muted">≈ ${money(Math.round(p.amount / 10), cur)} / mesec (10 mesecev)</span>` : "";
    return `<label class="plan"><input type="radio" name="plan" value="${seats}-${interval}">
      <span><b>${money(p.amount, cur)}</b> / ${interval === "year" ? "šolsko leto" : "mesec"}<br>${perMonth}</span></label>`;
  };
  // Najprej izbira, za koliko otrok; šele nato cene samo za to izbiro (j 2026-10-30: prej je bilo prenatrpano).
  const who = [["1", t("pay.seats1")], ["2", t("pay.seats2")], ...(acc.school_plans?.length ? [["s", t("school.planHead")]] : [])];
  return `
    <form id="plan-form" class="plans" novalidate>
      <fieldset class="plan-who"><legend>${esc(t("pay.howMany"))}</legend>
        <div class="plan-who-opts">${who.map(([v, label]) => `<label class="plan"><input type="radio" name="who" value="${v}"> <span><b>${esc(label)}</b></span></label>`).join("")}</div>
      </fieldset>
      <div class="plan-row" data-who="1" hidden>${cell(1, "month")}${cell(1, "year")}</div>
      <div class="plan-row" data-who="2" hidden>${cell(2, "month")}${cell(2, "year")}</div>
      ${schoolRow(acc)}
      <div id="plan-rest" class="plans" hidden>
      <p class="form-error" role="alert" hidden></p>
      ${acc.prices_draft ? `<p class="muted">Cene v lokalni valuti so predlog (razvojna različica).</p>` : ""}
      ${acc.parent.minor
        ? `<p class="muted">${esc(t("pay.minorNote"))}</p>
           <button class="secondary" type="button" id="plan-link">${esc(t("pay.askParent"))}</button><div id="plan-link-out"></div>`
        : `${consentFields()}
           <button class="primary" type="submit">${esc(t("pay.continue"))}</button>`}
      ${acc.parent.minor ? "" : `<p class="muted">Plačilo poteka varno prek Stripe. Naročnino lahko kadar koli prekličeš.${
        acc.access.tier === "trial" ? " Preostanek preizkusa se ohrani: prvo plačilo bo šele po njegovem koncu." : ""
      }</p>`}
      </div>
    </form>`;
}

// Osebno ob šolski licenci (5,99 € / 49 €): samo, ko ima vsaj en otrok šolsko licenco.
function schoolRow(acc) {
  if (!acc.school_plans?.length) return "";
  const cell = (p) => `<label class="plan"><input type="radio" name="plan" value="s-${p.interval}">
      <span><b>${money(p.amount, "EUR")}</b> / ${esc(t(p.interval === "year" ? "school.perYear" : "school.perMonth"))}</span></label>`;
  return `<div class="plan-row" data-who="s" hidden>${acc.school_plans.map(cell).join("")}<p class="muted plan-note">${esc(t("school.planNote"))}</p></div>`;
}
// Vrednost izbire paketa: »1-month« (otroci-obdobje) ali »s-year« (Osebno ob šolski licenci).
const planBody = (v) => {
  const [a, interval] = String(v).split("-");
  return a === "s" ? { school: true, interval } : { seats: Number(a), interval };
};

// Darilna koda: polnoletna oseba kupi eno leto Osebno za en profil (49 €) in kodo podari.
function giftBox(acc) {
  if (!acc.billing || acc.parent.minor || acc.parent.guest) return "";
  const list = (acc.gifts || [])
    .map((g) => `<li>${g.code ? `<b dir="ltr">${esc(g.code)}</b> <button type="button" data-gift-copy="${esc(g.code)}" aria-label="${esc(t("gift.copy"))} ${esc(g.code)}">${esc(t("gift.copy"))}</button>` : ""} <span class="pill${g.redeemed ? " ok" : ""}">${esc(t(g.status !== "paid" ? "gift.refunded" : g.redeemed ? "gift.used" : "gift.unused"))}</span></li>`)
    .join("");
  // Cena v obliki jezika vmesnika (sl: 49,00 €, en: €49.00), ker je kartica v celoti prevedena.
  const price = ((acc.gift_price || 4900) / 100).toLocaleString(locale(), { style: "currency", currency: "EUR" });
  return `<div class="card gift-card">
      <h2>${icon("gift")} ${esc(t("gift.title"))}</h2>
      <p>${esc(t("gift.text", { price }))}</p>
      ${list ? `<ul class="gift-list">${list}</ul>` : ""}
      <details><summary>${esc(t("gift.buy"))}</summary>
        <form id="gift-form" class="form" novalidate>
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
        <input name="code" maxlength="40" required autocapitalize="characters" placeholder="npr. EVKLID3X" value="${esc(store.get("evklid_koda") || "")}">
        <button class="primary" type="submit">Aktiviraj</button>
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
  let r;
  try {
    r = await api(`/api/admin/pilot?days=${days}${school ? `&school=${school}` : ""}`);
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
    <p class="muted small">${esc(t("pilot.note"))}</p>`;
  // Kartica se izriše znova: fokus ostane na izbiri, ki jo je uporabnik spremenil (tipkovnica).
  if (focusId) setTimeout(() => $(`#${focusId}`)?.focus());
  const reload = (e) => loadPilot($("#pilot-days").value, $("#pilot-school")?.value || "", e.target.id);
  $("#pilot-days").addEventListener("change", reload);
  $("#pilot-school")?.addEventListener("change", reload);
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
    }
  };
  out.querySelectorAll("[data-order]").forEach((li) => {
    $("[data-order-status]", li).addEventListener("change", (e) => save(li, { status: e.target.value }));
    $("[data-order-note]", li).addEventListener("change", (e) => save(li, { note: e.target.value }));
  });
}

function bindAdminCodes(acc) {
  if (!acc.promo?.codes) return;
  loadPilot();
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
      <label>${esc(t("guest.birth"))} <input name="birth_date" type="date" required min="1900-01-01" max="${new Date().toISOString().slice(0, 10)}" autocomplete="bday"></label>
      <label class="check"><input type="checkbox" name="accept_privacy" required>
        <span>${esc(t("guest.accept"))} <a href="/zasebnost.html" target="_blank">${esc(t("guest.privacy"))}</a></span></label>
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
        body: { name: f.name.value, email: f.email.value, password: f.password.value, birth_date: f.birth_date.value, accept_privacy: f.accept_privacy.checked, country: deviceRegion() },
      });
      if (r.dev_verify_url) store.set("evklid_dev_verify", r.dev_verify_url);
      toast(t("guest.created"));
      await after();
    } catch (err) {
      btn.disabled = false;
      showError(f, err);
      if (err.data?.under_age) {
        errorBox(f).append(" ", t("guest.parentHint"), " ", Object.assign(document.createElement("a"), { href: "/starsi.html", target: "_blank", textContent: t("guest.parentLink") }));
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
    <button type="button" class="ghost back me-back">${icon("arrow-left")}Jaz</button>
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
    status = await api("/api/account/status");
    if (await route()) await onReadyCb?.({ keepView: true });
  });
  $("#delete-account").addEventListener("click", async () => {
    if (!confirm(t("guest.deleteConfirm"))) return;
    try {
      await api("/api/account", { method: "DELETE", body: {} });
      store.set("studentId", null);
      location.replace("/");
    } catch (err) {
      toast(err.message);
    }
  });
}

// Uporaba brez računa je bila izklopljena: gost ustvari račun ali se prijavi, napredek ostane.
function renderGuestOff() {
  shell(`
    <h1>${esc(t("guest.upgradeTitle"))}</h1>
    <p class="muted">${esc(t("guest.off"))}</p>
    <div class="card">${upgradeForm()}${guestLoginForm()}</div>`);
  bindGuestForms(continueFlow);
}

export async function renderAccount() {
  const view = $("#view-account");
  let acc;
  try {
    acc = await api("/api/account");
  } catch (err) {
    if (err.data?.guest_off) {
      status = await api("/api/account/status");
      return route();
    }
    if (err.status === 401) return logout();
    view.innerHTML = `<p class="form-error">${esc(err.message)}</p>`;
    return;
  }
  if (acc.parent.guest) return renderGuestAccount(view, acc);
  const paid = acc.access.tier === "paid";
  view.innerHTML = `
    <button type="button" class="ghost back me-back">${icon("arrow-left")}Jaz</button>
    <h1>Račun</h1>
    <div class="card">
      <h2>Naročnina</h2>
      ${planText(acc)}
      ${!acc.billing ? `<p class="muted">Plačila trenutno niso na voljo.</p>` : paid ? "" : plansPicker(acc)}
      ${acc.billing && acc.parent.has_customer ? `<button id="portal-btn" type="button">Upravljaj naročnino in račune</button>` : ""}
      ${promoBox(acc, paid)}
    </div>
    ${acc.promo?.codes ? adminCodes(acc) : ""}
    ${giftBox(acc)}
    ${acc.promo?.codes ? `<div class="card" id="pilot-card"><h2>${esc(t("pilot.title"))}</h2><div id="pilot-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>` : ""}
    ${acc.promo?.codes ? `<div class="card" id="reports-card"><h2>${esc(t("adm.rep.title"))}</h2><div id="reports-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>` : ""}
    ${acc.promo?.codes ? `<div class="card" id="orders-card"><h2>${esc(t("orders.title"))}</h2><div id="orders-out"><p class="muted">${esc(t("common.loading"))}</p></div></div>` : ""}

    <div class="card">
      <h2>Otroci</h2>
      <ul class="child-list">${acc.children
        .map((c) => `<li><b>${esc(c.name)}</b> <span class="muted">(${c.birth_year || "–"})</span> ${
          c.premium ? `<span class="pill ok">poln dostop</span>` : `<span class="pill">brezplačni paket · danes ${c.questions_today}/${acc.free_daily_questions}</span>`
        }${c.pass ? ` <span class="pill">${esc(t("acct.passPill", { date: date(c.pass.ends_at) }))}</span>` : ""} ${aiPill(c.ai_month)}${c.has_password || acc.children.length < 2 ? "" : ` <span class="pill">${esc(t("lock.none"))}</span>`}</li>`)
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
          : `<p class="muted">Tvoj paket ima ${acc.max_children === 1 ? "1 profil" : `${acc.max_children} profila`}.${acc.max_children === 1 ? " Za drugega otroka izberi paket za 2 otroka." : ""}</p>`}
      <p class="muted">Vsak profil je lahko hkrati odprt samo na eni napravi. Profil zamenjaš (izbrišeš v zavihku Nastavitve in dodaš novega) največ enkrat na 30 dni.</p>
    </div>
    <div id="credit-card"></div>

    <div class="card">
      <h2>${icon("award")} Povabi prijatelje</h2>
      <p>Ko se družina, ki jo povabiš, naroči in prvič plača, <b>obe družini dobita en mesec brezplačno</b>.</p>
      <div class="inline"><input id="ref-url" readonly value="${esc(acc.referral.url)}"><button id="ref-copy" type="button">Kopiraj</button></div>
      <p class="muted">Tvoja koda: <b>${esc(acc.referral.code)}</b>${acc.referral.rewards ? ` · prisluženi meseci: ${acc.referral.rewards}` : ""}</p>
    </div>

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
    </div>`;

  // Izbira števila otrok pokaže samo cene za to izbiro (mesečno je izbrano) in nato soglasja ter gumb.
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
      if (!consentsOk(e.target)) throw new Error(t("payp.consentMissing"));
      const r = await api("/api/billing/checkout", { method: "POST", body: { ...planBody(e.target.plan.value), ...consentBody() } });
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
  renderCreditCard($("#credit-card"), { api });
  $("#gift-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("button[type=submit]", e.target);
    btn.disabled = true;
    try {
      if (!consentsOk(e.target)) throw new Error(t("payp.consentMissing"));
      const r = await api("/api/billing/gift", { method: "POST", body: consentBody() });
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
  $("#export-btn").addEventListener("click", async () => {
    const password = prompt("Za prenos vseh podatkov (tudi pogovorov vseh profilov) vpiši geslo računa.");
    if (!password) return;
    try {
      const data = await api("/api/account/export", { method: "POST", body: { password } });
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
    const password = prompt("Za izbris računa, vseh otrokovih profilov in pogovorov vpiši geslo. Tega ni mogoče razveljaviti.");
    if (!password) return;
    try {
      await api("/api/account", { method: "DELETE", body: { password } });
      store.set("studentId", null);
      location.reload();
    } catch (err) {
      toast(err.message);
    }
  });
}

// Odjava na strežniku; ob počasni povezavi največ 6 s, nato napaka (status 0 = ni odziva).
async function logoutRequest() {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error("timeout"), { status: 0 })), 6000));
  await Promise.race([api("/api/auth/logout", { method: "POST" }), timeout]);
}

export async function logout() {
  if (status?.parent?.guest && !confirm(t("guest.logoutConfirm"))) return;
  try {
    await logoutRequest();
  } catch (err) {
    if (unreachable(err)) return toast(t("lock.offline")); // brez strežnika odjava ni mogoča
  }
  store.set("studentId", null);
  location.replace("/?odjava=1");
}
