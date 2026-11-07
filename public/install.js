// Evklid kot aplikacija na napravi.
// - Telefon: prava aplikacija (mobile/), ko je na voljo (/api/app-links): Google Play ali App Store odpre
//   trgovino, APK za Android se prenese s koraki za namestitev, iPhone brez trgovine prek TestFlight.
//   Spletna različica (PWA) ostane druga možnost.
// - Računalnik (Chrome, Edge): okno brskalnika za namestitev programa (meni Start, svoje okno, brez povezave).
// - iPhone in iPad brez aplikacije: Safari namestitve ne ponudi sam, zato pokažemo tri korake (Deli → Dodaj na začetni zaslon).
// - Odprto v Instagramu, Messengerju …: najprej odpri v brskalniku.
// Kartica je na Učni poti (dokler je ne skriješ), vrstica v »Jaz« in kartica v Nastavitvah ostaneta.
import { icon } from "./icons.js";
import { t, currentLang } from "./i18n.js";
import { jsonAliNic } from "./odgovor.js";

const KEY = "evklid.install"; // čas, ko je bila kartica na Učni poti skrita
const HIDE_DAYS = 21;
let deferred = null; // beforeinstallprompt
let links = {}; // prava aplikacija: { apk, play, appStore, testflight } s strežnika
let ctx = { toast: () => {}, onSheet: () => {} };
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function get() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function set(v) {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
}

// Nameščena: kot program (PWA) ali spletna stran v mobilni aplikaciji Evklid (WebView, mobile/src/app/web.tsx).
export function isStandalone() {
  if (/ EvklidApp\//.test(navigator.userAgent)) return true;
  return ["standalone", "fullscreen", "minimal-ui", "window-controls-overlay"].some((m) => matchMedia(`(display-mode: ${m})`).matches) || navigator.standalone === true;
}

// Kje teče stran: ios | android | desktop, in ali je to vgrajen brskalnik druge aplikacije.
export function platform(ua = navigator.userAgent, touch = navigator.maxTouchPoints || 0) {
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && touch > 1); // iPad se predstavi kot Mac
  const android = /Android/.test(ua);
  const inApp = /FBAN|FBAV|FB_IAB|Instagram|Messenger|Snapchat|TikTok|musical_ly|Line\/|LinkedInApp|Twitter|GSA\/|; wv\)/.test(ua);
  const safariMac = !ios && /Macintosh/.test(ua) && /Version\/\d+.*Safari/.test(ua);
  return { os: ios ? "ios" : android ? "android" : "desktop", inApp, safariMac, mobile: ios || android };
}

// Prava aplikacija za to napravo: { href, store } (trgovina), { href, kind: "apk" | "testflight" } ali null.
export function nativeApp(p = platform(), l = links) {
  if (p.inApp) return null;
  if (p.os === "android") return l.play ? { href: l.play, store: true } : l.apk ? { href: l.apk, kind: "apk" } : null;
  if (p.os === "ios") return l.appStore ? { href: l.appStore, store: true } : l.testflight ? { href: l.testflight, kind: "testflight" } : null;
  return null;
}
const anyNative = () => !!(links.apk || links.play || links.appStore || links.testflight);

// Ali ponudimo namestitev: ne v že nameščeni aplikaciji; na računalniku samo, ko brskalnik to zna.
export function canOffer(p = platform()) {
  if (isStandalone()) return false;
  if (p.mobile) return true;
  return !!deferred || p.safariMac;
}

function steps(p) {
  if (p.inApp) return { note: t("inst.inApp"), list: [] };
  if (p.os === "ios")
    return {
      list: [
        ["share", t("inst.ios1")],
        ["square-plus", t("inst.ios2")],
        ["check", t("inst.ios3")],
      ],
      note: t("inst.iosNote"),
    };
  if (p.os === "android")
    return {
      list: [
        ["ellipsis-vertical", t("inst.and1")],
        ["smartphone", t("inst.and2")],
      ],
    };
  return { list: [["download", t("inst.desk1")]] };
}

// Gumb: trgovina ali prava aplikacija, sicer okno brskalnika za namestitev, kjer ga ni, pa navodila.
export async function install() {
  const app = nativeApp();
  if (app?.store) {
    window.open(app.href, "_blank", "noopener");
    return;
  }
  if (app) return openSheet(app);
  return installWeb();
}

// Spletna različica (PWA).
async function installWeb() {
  if (deferred) {
    const ev = deferred;
    deferred = null;
    ev.prompt();
    await ev.userChoice.catch(() => null); // isti dogodek se ne da ponoviti; ob zavrnitvi ostanejo navodila
    refresh();
    return;
  }
  openSheet();
}

// Koraki za pravo aplikacijo mimo trgovine (APK, TestFlight).
function nativeSheet(app) {
  const apk = app.kind === "apk";
  const list = apk
    ? [
        ["download", t("inst.apk1")],
        ["folder-open", t("inst.apk2")],
        ["check", t("inst.apk3")],
      ]
    : [];
  return `<a class="btn-primary is-get" href="${esc(app.href)}"${apk ? " download" : ' target="_blank" rel="noopener"'}>${icon(apk ? "download" : "external-link")}<span>${esc(t(apk ? "dl.apk" : "dl.testflight"))}</span></a>
    ${list.length ? `<ol class="is-steps">${list.map(([ic, txt]) => `<li><span class="is-ic">${icon(ic)}</span><span>${esc(txt)}</span></li>`).join("")}</ol>` : `<p class="muted is-note">${esc(t("dl.testflightSteps"))}</p>`}
    <button type="button" class="ghost is-web is-ok">${esc(t("inst.webBtn"))}</button>`;
}

function openSheet(app = null) {
  let dlg = $("#install-sheet");
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.id = "install-sheet";
    dlg.className = "install-sheet";
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest(".is-close")) closeInstallSheet();
      else if (e.target.closest(".is-web")) {
        if (deferred) {
          closeInstallSheet();
          installWeb();
        } else openSheet();
      }
    });
    dlg.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeInstallSheet();
    });
    document.body.append(dlg);
  }
  const p = platform();
  const { list, note } = steps(p);
  // Na računalniku še pot do aplikacije za telefon.
  const phone = !p.mobile && anyNative() ? `<p class="muted is-note">${esc(t("inst.phone", { url: `${location.host}/prenesi` }))}</p>` : "";
  const body = app
    ? nativeSheet(app)
    : `${list.length ? `<ol class="is-steps">${list.map(([ic, txt]) => `<li><span class="is-ic">${icon(ic)}</span><span>${esc(txt)}</span></li>`).join("")}</ol>` : ""}
    ${note ? `<p class="muted is-note">${esc(note)}</p>` : ""}${phone}`;
  dlg.innerHTML = `<div class="is-box" role="document">
    <div class="is-head"><img src="/icons/icon-192.png" alt="" width="48" height="48"><h2>${esc(t(app || !p.mobile ? "inst.title" : "inst.sheetTitle"))}</h2>
      <button type="button" class="ghost icon-only is-close" aria-label="${esc(t("nav.back"))}" title="${esc(t("nav.back"))}">${icon("x")}</button></div>
    ${body}
    <button type="button" class="${app ? "secondary " : "primary "}is-close is-ok">${esc(t("common.done"))}</button>
  </div>`;
  dlg.classList.toggle("is-top", p.os === "ios" && /iPad|Macintosh/.test(navigator.userAgent)); // na iPadu je »Deli« zgoraj
  if (!dlg.open) {
    dlg.showModal();
    ctx.onSheet(true);
  }
}

export const installSheetOpen = () => !!$("#install-sheet")?.open;
export function closeInstallSheet({ fromBack = false } = {}) {
  const dlg = $("#install-sheet");
  if (!dlg?.open) return;
  dlg.close();
  if (!fromBack) ctx.onSheet(false);
}

function cardHtml(p) {
  const app = nativeApp(p);
  const text = app ? t("inst.textNative") : p.mobile ? t("inst.text") : t("inst.textDesk");
  const direct = deferred || app;
  return `<span class="fb-card-ic">${icon(p.mobile ? "smartphone" : "download")}</span>
    <div class="fb-card-text"><b>${esc(t("inst.title"))}</b><p class="muted">${esc(text)}</p></div>
    <span></span>
    <button type="button" class="primary fb-card-go inst-go">${icon(direct ? "download" : "info")}<span>${esc(direct ? t("inst.btn") : t("inst.how"))}</span></button>`;
}

function hiddenOnPath() {
  const at = Number(get());
  return at > 0 && Date.now() - at < HIDE_DAYS * 864e5;
}

// Osveži vse tri mesta (Učna pot, Jaz, Nastavitve).
export function refresh() {
  const p = platform();
  const offer = canOffer(p);
  const card = $("#install-card");
  if (card) {
    card.hidden = !offer || hiddenOnPath();
    if (!card.hidden) {
      // Na Učni poti majhna vrstica (ne odrine vaj navzdol); dotik kjer koli odpre namestitev.
      card.className = "card list-card install-mini";
      card.innerHTML = `<button type="button" class="list-row inst-go"><span class="ic">${icon(p.mobile ? "smartphone" : "download")}</span><span class="lr-text"><b>${esc(t("inst.title"))}</b><small>${esc(p.mobile ? t("inst.meSub") : t("inst.textDesk"))}</small></span>${icon("chevron-right")}</button>
        <button type="button" class="ghost icon-only fb-card-x" aria-label="${esc(t("inst.dismiss"))}" title="${esc(t("inst.dismiss"))}">${icon("x")}</button>`;
      card.querySelector(".inst-go").onclick = install;
      card.querySelector(".fb-card-x").onclick = () => {
        set(String(Date.now()));
        card.hidden = true;
      };
    }
  }
  const box = $("#install-settings");
  if (box) {
    box.hidden = !offer;
    if (offer) {
      box.className = "card fb-card install-card";
      box.innerHTML = cardHtml(p);
      box.querySelector(".inst-go").onclick = install;
    }
  }
  const row = $("#me-install");
  if (row) row.hidden = !offer;
}

export function initInstall(opts = {}) {
  ctx = { ...ctx, ...opts };
  // Manifest v jeziku vmesnika (ime bližnjic ob dolgem pritisku na ikono).
  const link = $('link[rel="manifest"]');
  if (link) {
    // Samo jezik; barvi (?barva=, ?ozadje=) doda theme.js.
    const u = new URL(link.getAttribute("href") || "/manifest.webmanifest", location.href);
    u.searchParams.set("lang", currentLang());
    link.setAttribute("href", u.pathname + u.search);
  }
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // namesto pasice brskalnika ponudimo svoj gumb
    deferred = e;
    refresh();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    closeInstallSheet();
    ctx.toast(t(platform().mobile ? "inst.done" : "inst.doneDesk"), "circle-check");
    refresh();
  });
  $("#me-install")?.addEventListener("click", install);
  matchMedia("(display-mode: standalone)").addEventListener?.("change", refresh);
  refresh();
  // Ali je za telefon na voljo prava aplikacija (APK, trgovini, TestFlight).
  fetch("/api/app-links", { credentials: "same-origin" })
    .then((r) => jsonAliNic(r, {}))
    .then((l) => {
      links = l && typeof l === "object" ? l : {};
      refresh();
    })
    .catch(() => {});
}
