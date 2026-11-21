import { icon } from "./icons.js";
import { loadPrograms, programsCache } from "./programs.js";
import { mountLevelPicker, schoolSystemOptions } from "./level-picker.js";
import { systemForCountry } from "./regions.js";
import { currentLang, currentRegion, deviceRegion, locale, t } from "./i18n-osnova.js";
import { dateText } from "./datum.js";
import { openProfileMenu } from "./profile-menu.js";
import { termsField, clearCheckout, watchReturnFromPay, isStoreApp } from "./pay-ui.js";
import { clearPrivate, checkOwner, endedSession, syncOffline } from "./offline.js";
import { landingHtml, priceText } from "./pristajalna.js";
import { currentSource } from "./vir.js";
// Starševski račun: prijava, potrditev e-naslova, otroci s soglasjem, naročnina, priporočila.
// Deluje samo, ko je na strežniku EVKLID_ACCOUNTS=1.

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// Cena v valuti paketa (regijske cene: rupije, naire …); valute brez decimalk imajo cele enote.
const ZERO_DECIMAL = new Set(["VND", "XOF", "XAF", "UGX", "RWF", "JPY", "KRW", "GNF", "MGA"]);
// V jeziku vmesnika (locale(), kot garancija-ui.js, placaj.js), da je zapis enak povsod (npr. arabščina »9.99 €«).
// Evro vedno s centi; druge valute s celim zneskom brez decimalk.
const money = (minor, currency = "EUR") => {
  const major = ZERO_DECIMAL.has(currency) ? minor : minor / 100;
  const digits = currency !== "EUR" && Number.isInteger(major) ? 0 : 2;
  return major.toLocaleString(locale(), { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits });
};
const date = (iso) => (iso ? dateText(iso, locale()) : ""); // »do 23. novembra 2026« (public/datum.js)
const GUEST_INVITE = "evklid_gost";
const INVITE_KEY = "evklid.vabilo"; // koda vabila v pilot (public/vabilo.js KEY)
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
  // Plačilo brez datuma rojstva (star račun, »Pozneje«): prevedeno sporočilo namesto slovenskega s strežnika.
  const msg = data.birth_missing ? t("birth.payMissing") : data.error;
  if (!res.ok) throw Object.assign(new Error(msg || `Napaka ${res.status}`), { data, status: res.status });
  return data;
}

let enabled = false;
let status = null;
let onReadyCb = null;
// Za zavihek Račun (public/racun.js), ki stanje bere prek živih vezav.
const setStatus = (st) => (status = st);

// Zavihek Račun in računi gostov (public/racun.js, ~25 KB stisnjeno z UI plačil, garancije in odstopa) niso del prvega
// odprtja Učne poti: modul se naloži po prvem izrisu (app.js zasloniPozneje → naloziRacun) ali ob prvi uporabi. Ob
// neuspehu (brez povezave, nova različica) nov poskus z drugim naslovom (?r=), kot app.js lenModul.
let racunP = null;
let racunN = 0;
let racunMod = null;
export const naloziRacun = () =>
  (racunP ||= (racunN++ ? import(`./racun.js?r=${racunN}`) : import("./racun.js")).then((m) => (racunMod = m)).catch((err) => {
    racunP = null;
    throw err;
  }));
const loadingNote = (box, key, force = false) => {
  if (box && (force || !box.childElementCount)) box.replaceChildren(Object.assign(document.createElement("p"), { className: "muted", textContent: t(key) }));
};
// Dotik zavihka Račun pred prihodom modula: takoj »Nalagam …«, nato pravi izris.
export function renderAccount() {
  if (!racunMod) loadingNote($("#view-account"), "common.loading");
  return naloziRacun().then(
    (m) => m.renderAccount(),
    () => loadingNote($("#view-account"), "off.noConnection", true),
  );
}
const renderGuestInvite = () => naloziRacun().then((m) => m.renderGuestInvite(), () => toast(t("off.noConnection")));
const renderGuestOff = () => naloziRacun().then((m) => m.renderGuestOff(), () => toast(t("off.noConnection")));

export const accountsOn = () => enabled;
// Zadnje znano stanje računa (/api/account/status), npr. za opomnik za potrditev po prvi nalogi.
export const accountStatus = () => status;
// Svežje stanje istega računa (npr. opomnik je ugotovil, da je e-naslov medtem potrjen v drugem zavihku).
export const noteAccountStatus = (st) => {
  if (st?.logged_in && st.parent?.id === status?.parent?.id) status = st;
};

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

// Račun z enim profilom: »Izberi drug profil« bi odprl meni brez drugega profila in prazno Učno pot,
// zato tedaj okno ponudi »Nadaljuj tukaj« in »Odjava«.
function showTaken(d, rawFetch) {
  if ($("#taken-overlay")) return;
  const single = status?.children === 1;
  const box = document.createElement("div");
  box.id = "taken-overlay";
  box.className = "overlay";
  box.innerHTML = `<div class="card overlay-card" role="dialog" aria-modal="true" aria-labelledby="taken-title" aria-describedby="taken-text">
    <h2 id="taken-title">${esc(t("mob.takenTitle"))}</h2>
    <p id="taken-text">${esc(t("mob.takenText"))}</p>
    <p class="muted">${esc(d.device || t("mob.takenOtherDevice"))}</p>
    <div class="form-actions">
      <button class="primary" id="taken-here" type="button">${esc(t("mob.takenHere"))}</button>
      ${single ? `<button id="taken-logout" type="button">${esc(t("pm.logout"))}</button>` : `<button id="taken-other" type="button">${esc(t("mob.takenOther"))}</button>`}
    </div></div>`;
  document.body.appendChild(box);
  // Okno čez zaslon: fokus gre v okno, Tab in Shift+Tab krožita po njegovih gumbih (ne po strani pod njim).
  const card = box.firstElementChild;
  const onTab = (e) => {
    if (!box.isConnected) return document.removeEventListener("keydown", onTab, true);
    if (e.key !== "Tab") return;
    const b = [...card.querySelectorAll("button")];
    const i = b.indexOf(document.activeElement);
    if (i >= 0 && !(e.shiftKey ? i === 0 : i === b.length - 1)) return;
    e.preventDefault();
    b.at(e.shiftKey ? -1 : 0).focus();
  };
  document.addEventListener("keydown", onTab, true);
  $("#taken-here").focus();
  $("#taken-here").addEventListener("click", async () => {
    await rawFetch(`/api/students/${d.student_id}/claim`, { method: "POST" });
    store.set("studentId", String(d.student_id));
    location.reload();
  });
  $("#taken-other")?.addEventListener("click", () => {
    box.remove();
    openProfileMenu();
  });
  $("#taken-logout")?.addEventListener("click", () => logout());
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
  window.evklidZacetek?.pozabi?.(); // zaklep (tudi med uporabo, 423): posnetek zadnjega zaslona izgine (public/zacetek.js)
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
      await sendQueued();
      await logoutRequest();
      await finishLogout();
    });
  });
}

function toast(msg) {
  const t = $("#toast");
  if (!t) return alert(msg);
  t.textContent = msg;
  t.hidden = false;
  t.dataset.at = Date.now(); // app.js hideOldToast: obvestilo tik pred menjavo pogleda ostane
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.hidden = true), 4000);
}

// Pristajalna stran s strežnika (server/pristajalna-takoj.js, public/zacetek.js): renderLanding jo prevzame brez ponovnega
// izrisa; ko aplikacija pokaže kaj drugega (prijava, Učna pot, računi izklopljeni), jo umaknemo.
export function endPrerenderedLanding() {
  const box = $("#view-auth");
  if (box?.hasAttribute("data-vnaprej")) {
    box.removeAttribute("data-vnaprej");
    box.textContent = "";
    if (!document.body.classList.contains("auth-mode")) box.hidden = true;
  }
  document.documentElement.removeAttribute("data-pristajalna");
}

function authMode(on) {
  endPrerenderedLanding();
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
// Stanje računa že ob zagonu, vzporedno z /api/config (app.js): na počasni povezavi en krog manj čakanja
// pred Učno potjo (naloga hitrost, j 6. 11. 2026). Samo branje; initAccount ga porabi enkrat.
let statusEarly = null;
export function prefetchAccountStatus() {
  // Klic je zagon že začel v <head> (public/zacetek.js); neuspel ali star odgovor ne velja, takrat običajni klic.
  statusEarly ||= Promise.resolve(window.evklidZacetek?.vnaprej?.("/api/account/status"))
    .then((early) => early ?? api("/api/account/status"))
    .catch(() => ({ enabled: false }));
}

export async function initAccount({ onReady }) {
  onReadyCb = onReady;
  status = await (statusEarly || api("/api/account/status").catch(() => ({ enabled: false })));
  statusEarly = null;
  enabled = !!status.enabled;
  if (!enabled) return endPrerenderedLanding(), true;
  // Seja je končana (odjava drugje, iztek, »odjavi druge naprave«): osebni podatki prejšnjega lastnika naprave
  // se pobrišejo, preden si zapomnimo ključe iz te povezave (povabilo, koda). Brez povezave sem ne pridemo.
  if (!status.logged_in) await endedSession();
  $("#account-tab").hidden = false;
  watchTakenProfiles();
  lockAccountOnLeave();
  guardLogoOnAuth();
  $("#account-tab").addEventListener("click", renderAccount);
  // Nazaj in Naprej med pristajalno stranjo, prijavo in registracijo (#prijava, #registracija).
  addEventListener("popstate", () => {
    if (status?.logged_in || !document.body.classList.contains("auth-mode")) return;
    const m = hashMode();
    if (m) renderAuthMode(m);
    else renderLanding();
  });

  const q = new URLSearchParams(location.search);
  if (q.get("ref")) store.set("evklid_ref", q.get("ref"));
  if (q.get("koda")) store.set("evklid_koda", q.get("koda"));
  // Povabilo lastnika brez e-naslova (/?gost=…, server/accounts/guest.js GuestInvites): žeton iz naslova umaknemo,
  // da ga ni v zgodovini ali v povezavi, ki bi jo kdo delil naprej.
  if (q.get("gost")) {
    store.set(GUEST_INVITE, q.get("gost").slice(0, 100));
    const u = new URL(location.href);
    u.searchParams.delete("gost");
    history.replaceState(null, "", u.pathname + u.search + u.hash);
  }
  // Povezava s strani za starše (starsi.html): starš ustvari račun, otrokovo ime je že vpisano.
  const parentInvite = q.get("starsi") === "1";
  if (parentInvite) {
    store.set("evklid_invite_name", (q.get("ime") || "").slice(0, 40) || null);
    store.set(AGE_BLOCK, null);
  }
  const reset = q.get("reset");
  const verifyToken = q.get("verify");
  const verified = q.get("verified");
  const billing = q.get("billing");
  const sessionId = q.get("session_id");
  const payFromApp = q.get("app") === "1"; // nakup se je začel v aplikaciji (server/mobile/trgovina.js appMark)
  // Poizvedbo umaknemo iz naslova, sidro pa ostane (#753): /?vir=pilot#registracija odpre registracijo, ne pristajalne strani.
  // Oznako vira je public/vir.js shranil že ob uvozu, preden pridemo sem.
  if (q.toString()) history.replaceState(null, "", location.pathname + location.hash);
  // Vrnitev s Stripa v istem oknu (splet): stanje se osveži spodaj, zapis nakupa ni več potreben (public/pay-ui.js).
  if (billing) clearCheckout();
  watchReturnFromPay({ api, onSynced: refreshAfterPay });
  if (verified === "1") toast("E-naslov je potrjen ✓");
  if (verified === "0") toast("Povezava za potrditev ni veljavna, je potekla ali je že uporabljena. Novo pošlješ v zavihku Račun.");

  if (reset) {
    renderReset(reset);
    return false;
  }
  if (verifyToken) {
    renderVerifyLink(verifyToken);
    return false;
  }
  // Obvestila o plačilu pokažemo šele po preklopu na zavihek Račun (menjava pogleda skrije starejša obvestila).
  const notes = [];
  const billNote = (m) => notes.push(m);
  if (billing && status.logged_in) {
    if (billing === "pass" && sessionId) {
      // Paket pred testom: potrditev plačila ob vrnitvi (deluje tudi brez webhooka).
      const r = await api("/api/billing/pass/confirm", { method: "POST", body: { session_id: sessionId } }).catch(() => null);
      billNote(r?.paid ? t("pass.paid") : t("pass.pending"));
    } else if (billing === "credit" && sessionId) {
      // Dokup porabe AI: potrditev ob vrnitvi s plačilne strani (deluje tudi brez webhooka).
      const r = await api("/api/billing/credit/confirm", { method: "POST", body: { session_id: sessionId } }).catch(() => null);
      billNote(r?.paid ? t("credit.paid") : t("credit.pending"));
    } else if (billing === "gift" && sessionId) {
      // Darilna koda: potrditev ob vrnitvi; koda je potem v zavihku Račun.
      const r = await api("/api/billing/gift/confirm", { method: "POST", body: { session_id: sessionId } }).catch(() => null);
      billNote(r?.paid ? t("gift.paid") : t("pass.pending"));
    } else if (billing === "podari" && sessionId) {
      // »Podari Evklid«: potrditev ob vrnitvi s plačilne strani.
      const r = await api("/api/billing/podari/confirm", { method: "POST", body: { session_id: sessionId } }).catch(() => null);
      billNote(r?.paid ? t("pod.paid") : t("pass.pending"));
    } else if (billing !== "cancel") await api("/api/billing/sync", { method: "POST" }).catch(() => {});
    if (billing === "success") billNote(t("acct.subThanks"));
    status = await api("/api/account/status");
  }
  // Plačilo je uspelo v zavihku brskalnika, kjer obiskovalec ni prijavljen (APK: Stripe se odpre v Custom Tab).
  if (PAID_RETURN.has(billing) && !status.logged_in && !reset && !verifyToken) {
    renderPaidElsewhere(payFromApp);
    return false;
  }
  if (parentInvite) route.firstMode = "register";
  const ready = await route();
  route.firstMode = null;
  if (ready && billing) setTimeout(() => ($("#account-tab").click(), notes.forEach((m) => toast(m))), 0);
  else notes.forEach((m) => toast(m));
  return ready;
}

// Po vrnitvi v aplikacijo s plačila (public/pay-ui.js): novo stanje; zavihek Račun znova samo, ko se je kupljeno
// spremenilo (paket, preostali pogovori, darilne kode, paket pred testom, števec »Podari Evklid«), zahvala ob novi naročnini.
let shownSig = null;
const setShownSig = (v) => (shownSig = v);
const podariSig = (s) => (s ? [s.donated_months, s.evklid_months, s.in_use_months] : null);
export const paySig = (acc, balance) => JSON.stringify([acc?.access?.tier, (acc?.gifts || []).length, (acc?.children || []).map((c) => c.pass?.ends_at || ""), balance || 0, podariSig(acc?.podari)]);
async function refreshAfterPay({ acc, becamePaid }) {
  status = await api("/api/account/status").catch(() => status);
  const view = $("#view-account");
  if (view && !view.hidden && view.getClientRects().length && status?.logged_in) {
    const credit = await api("/api/billing/credit").catch(() => null);
    if (paySig(acc, credit?.balance_conversations) !== shownSig) await renderAccount();
  }
  if (becamePaid) {
    toast(t("acct.subThanks"));
    await onReadyCb?.({ keepView: true });
  }
}

// Plačilo je uspelo, a ta brskalnik ni prijavljen (navadno zavihek brskalnika iz aplikacije): kratko obvestilo,
// ne pristajalna stran. Na računalniku se obiskovalec lahko prijavi.
const PAID_RETURN = new Set(["success", "pass", "credit", "gift", "podari"]);
function renderPaidElsewhere(fromApp) {
  shell(`<h1>${esc(t(fromApp ? "acct.paidBackToApp" : "acct.paidLogin"))}</h1>
    <div class="form-actions"><button type="button" class="secondary" id="paid-login">${esc(t("mob.signIn"))}</button></div>`);
  $("#paid-login")?.addEventListener("click", () => goAuth("login"));
}

// Na zaslonih prijave logotip ne odpira menija »Nadaljuj z učenjem« (brez profila ne deluje).
// Skriti vhod za goste (dotik logotipa) je odstranjen skupaj z uporabo brez računa (j, 2026-10-29).
// Neprijavljen obiskovalec se z logotipom vrne na pristajalno stran.
function guardLogoOnAuth() {
  document.addEventListener(
    "click",
    (e) => {
      if (!e.target.closest(".brand") || !document.body.classList.contains("auth-mode")) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!status?.logged_in) goAuth(null);
    },
    true,
  );
}

// Prijava s strani »Odstop od pogodbe«: po prijavi ali registraciji (tudi Apple v mobilni aplikaciji prek iste
// seje) nazaj na /odstop.html (continueFlow: vse poti prijave). Samo ta pot (ni odprte preusmeritve).
function backToWithdrawal() {
  try {
    if (sessionStorage.getItem("evklid.poPrijavi") !== "/odstop.html") return false;
    sessionStorage.removeItem("evklid.poPrijavi");
  } catch {
    return false;
  }
  location.href = "/odstop.html";
  return true;
}

// Naprava, na kateri je bil kdo že prijavljen: neprijavljen obiskovalec dobi takoj prijavo, ne pristajalne strani.
const SEEN = "evklid.racun";
const AUTH_HASH = { "#prijava": "login", "#registracija": "register", "#pozabljeno-geslo": "forgot" };
const hashMode = () => AUTH_HASH[location.hash] || null;
const hashOf = (mode) => Object.keys(AUTH_HASH).find((h) => AUTH_HASH[h] === mode) || "";
const renderAuthMode = (mode) => (mode === "forgot" ? renderForgot() : renderLogin(mode));

// Pristajalna stran ↔ prijava ↔ registracija, z zapisom v zgodovini (#prijava, #registracija), da Nazaj deluje.
function goAuth(mode) {
  const hash = hashOf(mode);
  if (location.hash !== hash) history.pushState(null, "", hash || location.pathname + location.search);
  const shown = mode ? renderAuthMode(mode) : renderLanding();
  scrollTo(0, 0);
  // Fokus na naslov novega zaslona (tipkovnica, bralnik zaslona); brez odpiranja tipkovnice na telefonu.
  Promise.resolve(shown).then(() => {
    const h = $("#view-auth h1");
    if (!h) return;
    h.tabIndex = -1;
    h.focus({ preventScroll: true });
  });
}

// Preizkus, starost in garancija za pristajalno stran (isti podatki kot na strani za starše); največ 1,5 s čakanja.
// landingKnown: že prejete cene (obrazec za registracijo jih pokaže takoj, brez čakanja; P9).
let landingPrices, landingReq, landingKnown = null;
function loadLandingPrices() {
  if (landingReq) return landingPrices;
  const region = deviceRegion();
  landingReq = api(`/api/account/prices${region ? `?country=${region}` : ""}`).catch(() => null);
  landingPrices = Promise.race([landingReq, new Promise((r) => setTimeout(() => r(null), 1500))]);
  landingReq.then((p) => p && ((landingKnown = p), (landingPrices = Promise.resolve(p))));
  return landingPrices;
}

const landLinks = new WeakSet();
function sameMarkup(box, html) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  return tpl.innerHTML === box.innerHTML;
}

async function renderLanding() {
  const prices = await loadLandingPrices();
  // Med čakanjem na cene je obiskovalec morda že odšel na prijavo ali registracijo.
  if (status?.logged_in || hashMode()) return;
  const name = document.querySelector(".topbar .brand-name")?.textContent || "";
  const html = landingHtml(t, { name, prices, store: isStoreApp(), loc: locale() }); // aplikacija iz trgovine: brez cene (P2)
  const box = $("#view-auth");
  // Stran s strežnika ostane, ko je enaka (sicer bi se pogovor v primeru znova animiral); brez cen (počasna povezava)
  // ostane tudi, ker ima cene s strežnika. Enak izris: brez utripa in brez ponovne animacije, ko cene pridejo pozneje.
  const pre = box.hasAttribute("data-vnaprej");
  box.removeAttribute("data-vnaprej");
  document.body.classList.add("land-mode");
  authMode(true);
  if (!(pre && !prices) && !sameMarkup(box, html)) box.innerHTML = html;
  box.querySelectorAll("[data-land]").forEach((a) => {
    if (landLinks.has(a)) return;
    landLinks.add(a);
    a.addEventListener("click", (e) => {
      e.preventDefault();
      goAuth(a.dataset.land);
    });
  });
  // Podatki s strežnika so prišli po izrisu (počasna povezava): preizkus in garancijo dopolnimo, ko pridejo.
  if (!prices) landingReq.then((p) => p && document.body.classList.contains("land-mode") && renderLanding());
}

async function route() {
  // Prijava v drug račun na tej napravi: osebni podatki prejšnjega se pobrišejo (public/offline.js, P7).
  if (status.logged_in) await checkOwner(status.parent?.id ?? null);
  else await endedSession(); // vsi načini konca seje (tudi med uporabo)
  if (!status.logged_in) {
    if (store.get(GUEST_INVITE) && !route.firstMode && !hashMode()) return renderGuestInvite(), false;
    const mode = route.firstMode || hashMode() || (store.get(SEEN) ? "login" : null);
    // Prijava dobi svoj zapis (#prijava), da »Kaj je Evklid?« in nato Nazaj vrneta na prijavo.
    if (mode && !hashMode()) history.replaceState(null, "", location.pathname + location.search + hashOf(mode));
    return (mode ? renderAuthMode(mode) : await renderLanding()), false;
  }
  store.set(SEEN, "1");
  if (hashMode()) history.replaceState(null, "", location.pathname + location.search);
  // Uporaba brez računa je izklopljena: gost lahko samo ustvari račun in obdrži napredek.
  if (status.parent.guest && !status.guest_mode) return renderGuestOff(), false;
  // Nepotrjen e-naslov ni več zid pred prvo nalogo (#747): lasten profil in učenje takoj, potrditev po prvi rešeni
  // nalogi (public/potrditev-po-nalogi.js) ali ko jo zahteva varnostno pomembno dejanje (odgovor 403 { verify }).
  // Star račun brez datuma rojstva: ob prijavi ga enkrat vprašamo (z razlago in »Pozneje«), nikoli ne zaklenemo.
  // Samo na odklenjeni napravi: na zaklenjeni (otrok na starševi napravi) zaslon preskočimo, vprašanje ostane za pozneje.
  if (status.parent.need_birth && status.account_unlocked) return renderBirth(), false;
  if (!status.children) return renderAddChild(), false;
  authMode(false);
  adjustAppForAccounts();
  return true;
}

async function continueFlow() {
  if (backToWithdrawal()) return; // prijava ali registracija s strani za odstop od pogodbe
  status = await api("/api/account/status");
  if (await route()) await onReadyCb?.();
}

// Učenca dodaja starš s soglasjem v zavihku Račun (porabo AI skrije strežnik vsem razen skrbniku).
function adjustAppForAccounts() {
  const card = $("#new-student-card");
  if (card) card.hidden = true;
  // Račun »Zame« (dijak ali študent sam, status.self_only): »Naročnina in profil« namesto »Naročnina in otroci«
  // v vrstici Račun na strani Jaz (UX maturanta 10). data-i18n, da ostane tudi ob menjavi jezika.
  document.querySelectorAll('[data-i18n="me.accountSub"], [data-i18n="me.accountSubSelf"]').forEach((el) => {
    el.dataset.i18n = status?.self_only ? "me.accountSubSelf" : "me.accountSub";
    el.textContent = t(el.dataset.i18n);
  });
}

// Ko starš izbriše zadnjega otroka.
export function openAddChild() {
  renderAddChild();
}

// ---------- prijava in registracija ----------

// Na širokem zaslonu je levo od obrazca znak aplikacije s kratkim opisom (j 2026-11-04: brez praznih robov);
// ime vzamemo iz zgornje vrstice (brand.json → scripts/preimenuj.js), da ga ni treba popravljati na dveh mestih.
function shell(inner) {
  authMode(true);
  document.body.classList.remove("land-mode");
  const name = document.querySelector(".topbar .brand-name")?.innerHTML || "";
  $("#view-auth").innerHTML = `<div class="auth-wrap"><div class="auth-brand"><span class="logo" aria-hidden="true">${icon("kristal")}</span><b class="brand-name">${name}</b><p>${esc(t("mob.tagline"))}</p></div><div class="auth-box">${inner}</div></div>`;
}

// Po zavrnjeni registraciji zaradi starosti naprava 24 ur kaže stran s povezavo za starše.
const AGE_BLOCK = "evklid_age_block";
const ageBlocked = () => Date.now() - Number(store.get(AGE_BLOCK) || 0) < 86400000;

// Uvod obrazca za registracijo: preizkus in cena iz /api/account/prices (P9). Brez cen (še niso prišle ali strežnik ni
// odgovoril) samo splošen stavek; v aplikaciji iz trgovine brez zneska (nakup mimo trgovine, public/pay-ui.js).
function registerIntroText(prices) {
  const trial = prices?.trial_days ? `${t("land.trial", { n: prices.trial_days })} ` : "";
  return `${trial}${(!isStoreApp() && priceText(t, prices, locale())) || t("price.none")}`;
}
const registerIntro = (prices) => esc(registerIntroText(prices));

// Gumb »Pokaži geslo« (P9): na telefonu je napačno vtipkano geslo pogost razlog za ponastavitev že prvi dan.
function bindPasswordToggle(root) {
  root?.querySelectorAll(".pw-toggle").forEach((btn) => {
    const input = root.querySelector(`#${btn.getAttribute("aria-controls")}`);
    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      // Oznaka ostane »Pokaži geslo«, stanje pove aria-pressed (pregled 3, N2: brez dvojnega »Skrij geslo, pritisnjeno«).
      btn.setAttribute("aria-pressed", String(show));
      btn.innerHTML = icon(show ? "eye-off" : "eye");
    });
  });
}

function renderLogin(mode = "login") {
  if (mode === "register" && ageBlocked()) return renderAskParent();
  const invited = mode === "register" && store.get("evklid_invite_name");
  const ref = store.get("evklid_ref") || "";
  const koda = store.get("evklid_koda") || "";
  const invite = store.get(INVITE_KEY) || "";
  // Ena vrstica »Imam kodo« namesto treh polj (ovire na telefonu 2026-11-18): koda iz povezave je že vpisana.
  const code = koda || invite || ref;
  // Besedila prek t() (P9, 21. 11. 2026): prej v kodi, v drugih jezikih je bil obrazec napol slovenski.
  const landingNow = landingKnown;
  const [privBefore, privAfter = ""] = t("auth.privacy").split("{link}");
  const [invBefore, invAfter = ""] = t("auth.invited").split("{name}");
  shell(`
    <h1>${esc(t(mode === "login" ? "mob.signIn" : "auth.registerTitle"))}</h1>
    <p class="muted" id="auth-intro">${mode === "login" ? esc(t("auth.loginIntro")) : registerIntro(landingNow)}</p>
    ${invited ? `<p class="card">${esc(invBefore)}<b>${esc(invited)}</b>${esc(invAfter)}</p>` : ""}
    <form id="auth-form" class="card form">
      ${mode === "register" ? `<label>${esc(t("guest.name"))} <input name="name" maxlength="60" autocomplete="name"></label>` : ""}
      <label>${esc(t("mob.email"))} <input name="email" type="email" required autocomplete="email"></label>
      <div class="pw-field">
        <label for="auth-password">${esc(t("mob.password"))}</label>
        <div class="pw-row">
          <input id="auth-password" name="password" type="password" required minlength="8" autocomplete="${mode === "login" ? "current-password" : "new-password"}"${mode === "register" ? ' aria-describedby="auth-password-hint"' : ""}>
          <button type="button" class="pw-toggle" aria-controls="auth-password" aria-pressed="false" aria-label="${esc(t("auth.showPassword"))}" title="${esc(t("auth.showPassword"))}">${icon("eye")}</button>
        </div>
        ${mode === "register" ? `<p class="muted small" id="auth-password-hint">${esc(t("mob.passwordShort"))}</p>` : ""}
      </div>
      ${mode === "register" ? `
        <label>${esc(t("auth.birth"))} <input name="birth_date" type="date" required min="1900-01-01" max="${localToday()}" autocomplete="bday"></label>
        <details class="reg-code"${code ? " open" : ""}><summary>${esc(t("code.have"))}</summary>
          <label>${esc(t("code.label"))} <input name="code" maxlength="64" autocapitalize="characters" autocomplete="off" spellcheck="false" aria-describedby="code-hint" value="${esc(code)}"></label>
          <p class="muted small" id="code-hint">${esc(t("code.hint"))}</p>
        </details>
        <label class="check"><input type="checkbox" name="accept_privacy" required>
          <span>${esc(privBefore)}<a href="/zasebnost.html" target="_blank">${esc(t("auth.privacyLink"))}</a>${esc(privAfter)}</span></label>
        ${termsField("accept_terms")}` : ""}
      <p class="form-error" hidden></p>
      <button class="primary" type="submit">${esc(t(mode === "login" ? "mob.signIn" : "mob.register"))}</button>
    </form>
    <p class="auth-links">
      ${mode === "login"
        ? `${esc(t("mob.noAccount"))} <a href="#" data-go="register">${esc(t("auth.registerLink"))}</a> · <a href="#" data-go="forgot">${esc(t("mob.forgot"))}</a>`
        : `${esc(t("land.haveAccount"))} <a href="#" data-go="login">${esc(t("mob.signIn"))}</a>`}
    </p>
    <p class="auth-links"><a href="#" data-go="landing">${esc(t("land.what"))}</a></p>`);
  bindPasswordToggle($("#auth-form"));
  // Cena iz cenika (P9): če ob izrisu še ni prišla, jo dopolnimo, ko pride (isti klic kot pristajalna stran).
  if (mode === "register" && !landingNow) {
    loadLandingPrices().then((p) => {
      const intro = $("#auth-intro");
      if (p && intro && $("#auth-form")) intro.textContent = registerIntroText(p);
    });
  }
  bindLinks();
  $("#auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    try {
      if (mode === "login") {
        await api("/api/auth/login", { method: "POST", body: { email: f.email.value, password: f.password.value } });
      } else {
        // Vrsto kode določi strežnik (signupCodeKind). Koda vabila s strani /vabilo (že preverjena) gre vedno v polje
        // invite kot v #819, tudi če je v vrstici aktivacijska koda iz ?koda= ali jo je uporabnik spremenil (pregled #834);
        // vpisana koda vabila (code_kind "invite") ima prednost. Priporočilo iz povezave (?ref=) velja tudi ob drugi kodi.
        const typed = f.code.value.trim();
        const storedInvite = invite.trim();
        const isInvite = !!typed && typed.toLowerCase() === storedInvite.toLowerCase();
        const fromRef = !!typed && !!ref && typed.toUpperCase() === ref.toUpperCase();
        const r = await api("/api/auth/register", {
          method: "POST",
          body: {
            name: f.name.value, email: f.email.value, password: f.password.value,
            referral_code: ref && ref.toUpperCase() !== typed.toUpperCase() ? ref : "",
            ...(storedInvite ? { invite: storedInvite } : {}),
            ...(typed && !isInvite ? { code: typed } : {}),
            accept_privacy: f.accept_privacy.checked, accept_terms: f.accept_terms.checked, birth_date: f.birth_date.value, country: deviceRegion(),
          },
        });
        store.set("evklid_ref", null);
        // Darilna koda velja šele v Računu po potrditvi e-naslova: ostane shranjena, polje tam je že izpolnjeno.
        store.set("evklid_koda", r.code_kind === "gift" ? typed.toUpperCase() : null);
        if (r.code_kind === "gift") toast(t("code.giftLater"));
        // Priporočilo iz povezave, ki ga ni več, ostane tiho kot prej (pregled #834); »te kode ne poznamo« le za vpisano kodo.
        if (r.code_kind === "unknown" && !fromRef) toast(t("code.unknown"));
        if (r.code_kind === "referral") toast(t("code.refOk"));
        store.set(INVITE_KEY, null);
        // Koda vabila v pilot (#819): vpisana v vrstico ali s strani /vabilo; po potrditvi e-naslova račun samodejno v pilotu (#751).
        if (r.invite) toast(t({ pending: "vab.regPending", ended: "vab.regEnded" }[r.invite] || "vab.regBad"));
        if (r.promo_until) toast(`Aktivacijska koda velja ✓ Poln dostop do ${date(r.promo_until)}.`);
        if (r.promo_pending) toast(t("acct.promoAfterVerify"));
        if (r.promo_error) toast(`Račun je ustvarjen, koda pa ni bila sprejeta: ${r.promo_error}`);
        if (r.dev_verify_url) store.set("evklid_dev_verify", r.dev_verify_url);
      }
      await continueFlow();
    } catch (err) {
      if (err.data?.under_age) {
        store.set(AGE_BLOCK, String(Date.now()));
        return renderAskParent(err.data.min_age);
      }
      if (err.data?.birth_date) err = { message: t("birth.missing") };
      showError(f, err);
    }
  });
}

// Premlad za lasten račun: povezava za starše s vsemi podatki (kaj je Evklid, podatki, cena, soglasje).
function renderAskParent(minAge) {
  const linkFor = (name) => `${location.origin}/starsi.html?${name ? `ime=${encodeURIComponent(name)}&` : ""}prosnja=1`; // prosnja: starsi.js pokaže obvestilo
  shell(`
    <h1>Vprašaj starše</h1>
    <p class="muted">${minAge ? `Za mlajše od ${minAge} let` : "Za mlajše učence"} račun ustvari starš ali skrbnik. Vpiši e-naslov starša in Evklid mu pošlje povezavo, ali pa mu jo pošlji sam(a). Tam piše, kaj je Evklid, katere podatke hranimo in koliko stane. Ko starš ustvari račun in doda tvoj profil, se lahko začneš učiti.</p>
    <form id="ask-parent" class="card form">
      <label>Tvoje ime ali vzdevek (neobvezno) <input name="name" maxlength="40" placeholder="npr. Miha"></label>
      <label>E-naslov starša <input name="parent_email" type="email" autocomplete="off" inputmode="email" placeholder="npr. mama@primer.si"></label>
      <div class="form-actions">
        <button class="primary" type="button" data-act="send">Pošlji staršu</button>
      </div>
      <p class="form-error" role="alert" hidden></p>
      <p class="muted" data-sent role="status" hidden style="overflow-wrap:anywhere"></p>
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
    return `${n ? `${n} bi rad(a)` : "Rad(a) bi"} uporabljal(a) Evklid, AI inštruktorja za matematiko, fiziko, kemijo, biologijo in naravoslovje. Za to potrebujem tvoje dovoljenje:`;
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
      const box = errorBox(f);
      if (box) box.hidden = true;
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
      goAuth(go === "landing" ? null : go);
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

// Povezava za potrditev e-naslova, odprta brez seje tega računa (drug brskalnik, Safari po registraciji v aplikaciji):
// strežnik ničesar ne spremeni, dokler lastnik ne vpiše gesla ali pove, da računa ni ustvaril (pregled #492 B).
function renderVerifyLink(token) {
  // Žeton ne ostane v naslovni vrstici in zgodovini, ko je porabljen (pregled #492/#500 A P3-2).
  const forget = () => history.replaceState(null, "", "/");
  // Mirno besedilo za novinca (pregled uvoda 15. 11. 2026, ovira 1): povezava v drugem brskalniku je običajna;
  // »Računa nisem ustvaril jaz« je skrit pod »Težave?«, da novinec najprej ne vidi rdečega gumba. Dejanje je enako.
  shell(`
    <h1>Potrdi e-naslov</h1>
    <form id="auth-form" class="card form">
      <div><p>${esc(t("verify.otherBrowser"))}</p><p>${esc(t("verify.otherBrowserPw"))}</p></div>
      <label>Geslo <input name="password" type="password" required autocomplete="current-password"></label>
      <p class="form-error" role="alert" hidden></p>
      <button class="primary" type="submit">Potrdi e-naslov</button>
    </form>
    <p class="verify-trouble"><button id="verify-trouble" class="ghost" type="button" aria-expanded="false" aria-controls="verify-trouble-box">${esc(t("verify.trouble"))}</button></p>
    <div class="card" id="verify-trouble-box" hidden>
      <p>Računa nisi ustvaril ti ali ne poznaš gesla? Račun zaščitimo: dosedanje geslo in prijave na vseh napravah ne bodo več veljale. Na e-naslov računa ti pošljemo povezavo za novo geslo.</p>
      <button id="verify-not-mine" class="danger" type="button">Računa nisem ustvaril jaz / ne poznam gesla</button>
    </div>`);
  $("#verify-trouble").addEventListener("click", (e) => {
    const open = e.currentTarget.getAttribute("aria-expanded") !== "true";
    e.currentTarget.setAttribute("aria-expanded", String(open));
    $("#verify-trouble-box").hidden = !open;
    // Na telefonu je odprta kartica pod robom zaslona: pokaži jo (pregled 3, #745).
    if (open) $("#verify-trouble-box").scrollIntoView({ block: "nearest" });
  });
  $("#auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await api("/api/auth/verify", { method: "POST", body: { token, password: e.target.password.value } });
      forget();
      toast("E-naslov je potrjen ✓");
      await continueFlow();
    } catch (err) {
      showError(e.target, err);
    }
  });
  $("#verify-not-mine").addEventListener("click", async (e) => {
    if (!confirm("Dosedanje geslo ne bo več veljalo in vse naprave (tudi otrokove) bodo odjavljene. Novo geslo nastaviš s povezavo, ki ti jo pošljemo po e-pošti. Nadaljujem?")) return;
    e.target.disabled = true;
    try {
      const r = await api("/api/auth/verify", { method: "POST", body: { token, not_mine: true } });
      forget();
      shell(`
        <h1>Račun je zaščiten</h1>
        <div class="card">
          <p>Dosedanje geslo ne velja več in vse naprave smo odjavili.</p>
          <p>${
            r.mail === false
              ? "Sporočila ni bilo mogoče poslati. Novo geslo nastaviš s »Pozabljeno geslo« na strani za prijavo."
              : "Na e-naslov računa smo poslali povezavo za novo geslo. Nastaviš ga lahko v 1 uri."
          }</p>
          ${r.dev_reset_url ? `<p><a href="${esc(r.dev_reset_url)}">Nastavi novo geslo (razvoj)</a></p>` : ""}
        </div>`);
    } catch (err) {
      e.target.disabled = false;
      showError($("#auth-form"), err);
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

// ---------- datum rojstva (stari računi) ----------

// Današnji datum v lokalnem času naprave (LLLL-MM-DD); toISOString bi okoli polnoči dal včerajšnji dan (UTC).
function localToday(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Dopolnjena leta za datum LLLL-MM-DD (za potrditev pred shranjevanjem; strežnik računa sam).
function yearsSince(ymd, d = new Date()) {
  const [y, m, day] = String(ymd).split("-").map(Number);
  return d.getFullYear() - y - (d.getMonth() + 1 < m || (d.getMonth() + 1 === m && d.getDate() < day) ? 1 : 0);
}

// Obrazec za datum rojstva imetnika računa: zaslon ob prijavi (later = gumb »Pozneje«) in kartica v zavihku Račun.
function birthFormHtml(later) {
  const max = localToday();
  return `<form class="birth-form form" novalidate>
      <label>${esc(t("birth.label"))} <input name="birth_date" type="date" required min="1900-01-01" max="${max}" autocomplete="bday"></label>
      <p class="muted">${esc(t("birth.whose"))}</p>
      <p class="form-error" role="alert" hidden></p>
      <div class="form-actions" data-step="enter">
        <button class="primary" type="submit">${esc(t("birth.save"))}</button>
        ${later ? `<button type="button" data-later>${esc(t("birth.later"))}</button>` : ""}
      </div>
      <div class="birth-confirm" data-step="confirm" hidden>
        <p role="status" data-confirm-text></p>
        <div class="form-actions">
          <button class="primary" type="button" data-confirm>${esc(t("birth.confirmYes"))}</button>
          <button type="button" data-back>${esc(t("birth.confirmNo"))}</button>
        </div>
      </div>
    </form>`;
}

// onDone(r): r je odgovor strežnika ({ parent, under_age?, min_age? }). Pred shranjevanjem potrditev z izračunano
// starostjo (napačnega datuma uporabnik ne more popraviti sam). 409 (datum je medtem vpisan v drugi seji): tok gre naprej.
function bindBirthForm(form, onDone) {
  const enter = form.querySelector('[data-step="enter"]');
  const confirm = form.querySelector('[data-step="confirm"]');
  const step = (c) => {
    enter.hidden = c;
    confirm.hidden = !c;
    form.birth_date.disabled = c;
  };
  const send = async (body, btn) => {
    btn.disabled = true;
    try {
      onDone(await api("/api/account/birth-date", { method: "POST", body }));
    } catch (err) {
      if (err.status === 409 && err.data?.parent) return onDone({ parent: err.data.parent, taken: true });
      step(false);
      showError(form, err.data?.birth_date ? { message: t("birth.enter") } : err);
    } finally {
      btn.disabled = false;
    }
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = form.birth_date.value;
    const age = v ? yearsSince(v) : NaN;
    if (!v || !(age >= 5 && age <= 120)) return showError(form, { message: t("birth.enter") });
    errorBox(form).hidden = true;
    form.querySelector("[data-confirm-text]").textContent = t("birth.confirm", { age });
    step(true);
    form.querySelector("[data-confirm]").focus();
  });
  form.querySelector("[data-confirm]").addEventListener("click", (e) => send({ birth_date: form.birth_date.value }, e.currentTarget));
  form.querySelector("[data-back]").addEventListener("click", () => {
    step(false);
    form.birth_date.focus();
  });
  form.querySelector("[data-later]")?.addEventListener("click", (e) => send({ later: true }, e.currentTarget));
}

// Mlajši od starosti digitalne privolitve: datum je shranjen, za soglasje pa velja pot prek staršev kot pri registraciji.
const underAgeHtml = (minAge) => `<div class="birth-under" role="status">
      <p>${esc(t("birth.underAge", { age: minAge }))}</p>
      <p><a href="/starsi.html?prosnja=1" target="_blank">${esc(t("birth.parents"))}</a></p>
    </div>`;

function renderBirth() {
  shell(`
    <h1>${esc(t("birth.title"))}</h1>
    <p class="muted">${esc(t("birth.why"))}</p>
    <div class="card">${birthFormHtml(true)}</div>
    <p class="muted">${esc(t("birth.laterNote"))}</p>`);
  bindBirthForm($("#view-auth .birth-form"), (r) => {
    status.parent = r.parent;
    if (!r.under_age) return continueFlow();
    shell(`
      <h1>${esc(t("birth.title"))}</h1>
      <div class="card">${underAgeHtml(r.min_age)}</div>
      <div class="form-actions"><button class="primary" type="button" id="birth-next">${esc(t("birth.next"))}</button></div>`);
    $("#birth-next").addEventListener("click", continueFlow);
  });
}

// Ponovno pošiljanje: gumb je 60 s po pošiljanju zaklenjen in pove, čez koliko časa bo spet na voljo (ostane
// zaklenjen tudi ob ponovnem izrisu zaslona). Nova povezava zamenja prejšnjo (strežnik shrani nov žeton).
const RESEND_WAIT = 60000;
let resendAt = 0;

function renderVerify(forChild = false) {
  const dev = store.get("evklid_dev_verify");
  // Mladoletni imetnik (15–17 let, račun zase) ne izjavlja, da je starš (pregled uvoda, ovira 4). Račun brez
  // datuma rojstva (star račun) dobi pogojni stavek: izjava velja le, če ustvari profil za otroka (j 2026-11-15,
  // polnoletni dijak zase ni starš; končno besedilo pregleda pravnik). Polnoleten dijak s profilom »Zame«
  // (status.self_only) dobi besedilo za učenca, razen ko je zaslon odprl poskus profila za otroka (forChild).
  const parentLike = !status.parent.minor && (forChild || !status.self_only);
  const note = esc(t(parentLike ? "verify.parentNote" : "verify.selfNote"));
  // Kot na zaslonu »Ustvari profil« (#820): stavek o otrokovem profilu samo za starše.
  const later = `${esc(t("verify.laterNote"))}${parentLike ? ` ${esc(t("verify.laterNoteChild"))}` : ""}`;
  shell(`
    <h1>Potrdi e-naslov</h1>
    <div class="card">
      <p>Na <b>${esc(status.parent.email)}</b> smo poslali povezavo. Klikni jo, nato se vrni sem.</p>
      <p class="muted verify-note">${note}</p>
      <p class="muted verify-later">${later}</p>
      ${dev && !status.email ? `<p class="muted">Razvojni način (e-pošta ni nastavljena): <a href="${esc(dev)}">potrdi e-naslov</a></p>` : ""}
      ${!dev && !status.email ? `<p class="warn">Pošiljanje e-pošte še ni nastavljeno, zato povezava ni prišla. Na računalniku, kjer teče Evklid, se prijavi v ta račun in klikni »Pošlji znova«.</p>` : ""}
      <div role="status" aria-live="polite"><p id="verify-state" class="warn" hidden></p></div>
      <div class="form-actions">
        <button class="primary" id="verify-done" type="button">Sem potrdil(a)</button>
        <button id="verify-resend" type="button" aria-describedby="verify-resend-hint">Pošlji znova</button>
        <button id="verify-back" type="button">${esc(t("verify.back"))}</button>
        <button id="verify-logout" type="button">Odjava</button>
      </div>
      <p class="muted" id="verify-resend-hint">${esc(t("verify.resendHint"))}</p>
    </div>`);
  const state = $("#verify-state");
  // Isto besedilo ob drugem dotiku: najprej izpraznimo, da ga bralnik zaslona prebere znova in je sprememba vidna.
  const say = (msg) => {
    state.hidden = true;
    state.textContent = "";
    setTimeout(() => {
      state.textContent = msg;
      state.hidden = false;
    }, 60);
  };
  $("#verify-done").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    try {
      status = await api("/api/account/status");
      if (status.logged_in && !status.parent.verified && !status.parent.guest) return say(t("verify.notYet"));
      if (await route()) await onReadyCb?.();
    } catch (err) {
      say(err instanceof TypeError ? t("lock.offline") : err.message);
    } finally {
      btn.disabled = false;
    }
  });
  const resend = $("#verify-resend");
  const hint = $("#verify-resend-hint");
  const tick = () => {
    if (!resend.isConnected) return;
    const left = Math.ceil((resendAt + RESEND_WAIT - Date.now()) / 1000);
    resend.disabled = left > 0;
    hint.textContent = left > 0 ? t("verify.resendWait", { s: left }) : t("verify.resendHint");
    if (left > 0) setTimeout(tick, 1000);
  };
  tick();
  resend.addEventListener("click", async () => {
    resend.disabled = true;
    try {
      const r = await api("/api/auth/resend-verification", { method: "POST" });
      if (r.verified) return continueFlow();
      resendAt = Date.now();
      if (r.dev_verify_url) store.set("evklid_dev_verify", r.dev_verify_url);
      toast("Povezava je poslana znova.");
      if (r.dev_verify_url) return renderVerify();
      tick();
    } catch (err) {
      resend.disabled = false;
      const min = Math.max(1, Math.ceil((Number(err.data?.retry_after) || 900) / 60));
      say(err instanceof TypeError ? t("lock.offline") : err.data?.net ? t("verify.tooManyNet", { min }) : err.data?.retry_after ? t("verify.tooMany", { min }) : err.message);
    }
  });
  $("#verify-logout").addEventListener("click", logout);
  // Nazaj na učenje brez potrditve (#747): profil ali obrazec za lasten profil.
  $("#verify-back").addEventListener("click", continueFlow);
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
    fillName(own);
  };
  // Lasten profil: ime iz registracije se vpiše samo (dijak ga ne tipka dvakrat). Pri profilu za otroka
  // ostane prazno (ime imetnika je ime starša); samodejno vpisano ime se ob preklopu pobriše, ročno vpisano ne.
  const ownName = String(status?.parent?.name || "").trim().slice(0, 40);
  const fillName = (own) => {
    if (own && ownName && !f.name.value.trim()) (f.name.value = ownName), (f.name.dataset.auto = "1");
    else if (!own && f.name.dataset.auto) (f.name.value = ""), delete f.name.dataset.auto;
  };
  f.name.addEventListener("input", () => delete f.name.dataset.auto);
  fillName(isSelf());
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
        body: { name: f.name.value, birth_year: Number(f.birth_year.value), self: isSelf(), consent: f.consent.checked, settings: childSettings(f), vir: currentSource(), ...(profilePw ? { profile_password: profilePw } : {}), ...(Object.keys(otherPasswords).length ? { other_passwords: otherPasswords } : {}) },
      });
      store.set("studentId", String(s.id));
      store.set("evklid_invite_name", null);
      await after(s);
    } catch (err) {
      // Profil za otroka ali drugi profil pred potrditvijo e-naslova (#747): zaslon za potrditev.
      if (err.data?.verify && status?.logged_in && !status.parent?.verified) return renderVerify(!isSelf());
      showError(f, err);
    }
  });
}

async function renderAddChild() {
  const [acc, programs] = await Promise.all([api("/api/account"), loadPrograms(api)]);
  shell(`
    <h1>Ustvari profil</h1>
    <p class="muted">Vsak učenec, dijak ali študent ima svoj profil z učno potjo in napredkom. Za otroke, mlajše od 15 let, je potrebno soglasje starša.</p>
    ${status?.parent && !status.parent.verified && !status.parent.guest ? `<p class="muted">${esc(t("verify.laterNote"))}${status.parent.minor ? "" : ` ${esc(t("verify.laterNoteChild"))}`}</p>` : ""}
    ${childForm(acc.consent_text, programs, acc.children?.length > 0)}
    <p class="auth-links"><a href="#" id="add-child-logout">Odjava</a></p>`);
  $("#add-child-logout").addEventListener("click", (e) => (e.preventDefault(), logout()));
  bindChildForm(continueFlow);
}

// ---------- zavihek Račun ----------

// Stanje naročnine v Stripu → ključ besedila (acct.st.*); neznano stanje se pokaže, kot je.
const STATUS_KEYS = ["active", "trialing", "past_due", "canceled", "unpaid", "incomplete", "incomplete_expired", "paused"];
async function logoutRequest() {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error("timeout"), { status: 0 })), 6000));
  await Promise.race([api("/api/auth/logout", { method: "POST" }), timeout]);
}

// Pošlje neposlane odgovore vaj brez povezave vseh profilov na tej napravi (napaka ne ustavi odjave).
// Največ 6 s (kot logoutRequest), da odjava ob počasni povezavi ne obvisi.
async function sendQueued() {
  const ids = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const m = /^evklid\.offline\.queue\.(\d+)$/.exec(localStorage.key(i));
      if (m) ids.push(Number(m[1]));
    }
  } catch {}
  if (!ids.length) return;
  const send = (async () => {
    for (const id of ids) await syncOffline(api, id).catch(() => null);
  })();
  await Promise.race([send, new Promise((r) => setTimeout(r, 6000))]);
}

// Po odjavi na strežniku: naprava se pobriše (P7) in stran se odpre na začetku.
async function finishLogout() {
  await clearPrivate(); // predpomnilnik API, paketi vaj, seznam profilov, zgodovina skenerja …
  store.set("studentId", null);
  location.replace("/?odjava=1");
}

export async function logout() {
  if (status?.parent?.guest && !confirm(t("guest.logoutConfirm"))) return;
  // Neposlani odgovori vaj brez povezave gredo pred odjavo na strežnik (nato se pobrišejo z napravo).
  await sendQueued();
  try {
    await logoutRequest();
  } catch (err) {
    if (unreachable(err)) return toast(t("lock.offline")); // brez strežnika odjava ni mogoča
  }
  await finishLogout();
}

// Za zavihek Račun (public/racun.js): stanje in pomožne funkcije tega modula (žive vezave).
export { $, GUEST_INVITE, PROFILE_PW_MIN, STATUS_KEYS, api, bindBirthForm, bindChildForm, birthFormHtml, childForm, continueFlow, date, errorBox, esc, goAuth, localToday, lockError, money, onReadyCb, renderVerify, route, setShownSig, setStatus, shell, showError, shownSig, status, store, toast, underAgeHtml };
