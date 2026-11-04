// Celozaslonski način v brskalniku (privzeto izklopljen, vklop v Nastavitvah, velja za to napravo).
// Privzeto je izklopljen, ker Chrome na Androidu ob vsakem vstopu za nekaj sekund pokaže obvestilo
// »to exit full screen, drag from the top …«, ki ga stran ne more skriti in prekrije spodnji del zaslona.
// Nameščena aplikacija (manifest display: standalone) je že brez naslovne vrstice, zato tam vstopa ne sprožimo.
// Brskalnik ga dovoli šele po dejanju uporabnika, zato se vklopi ob prvem dotiku ali kliku.
// Če ga uporabnik sam zapre (tipka Esc, poteg z roba), ga ne vsiljujemo znova, dokler se ne vrne v aplikacijo.
import { t } from "./i18n.js";
import { isStandalone } from "./install.js";

const KEY = "evklid.fullscreen";
const root = document.documentElement;
const supported = () => !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
const current = () => document.fullscreenElement || document.webkitFullscreenElement || null;

export function fullscreenOn() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

let armed = true;
let ours = false; // zadnjo spremembo smo sprožili mi

function enter() {
  if (!armed || !fullscreenOn() || !supported() || current() || isStandalone()) return;
  armed = false;
  ours = true;
  const req = root.requestFullscreen?.bind(root) || root.webkitRequestFullscreen?.bind(root);
  try {
    const p = req?.({ navigationUI: "hide" });
    p?.catch?.(() => {
      ours = false;
      armed = true; // brskalnik je zavrnil (npr. ni bilo dejanja uporabnika): poskusi ob naslednjem dotiku
    });
  } catch {
    ours = false;
    armed = true;
  }
}

// Ne ob odpiranju izbirnika datoteke ali kamere ali spustnega seznama (vstop bi ga zaprl).
function onGesture(e) {
  const el = e.target?.closest ? e.target : null;
  if (el?.closest('input[type="file"], select') || el?.closest("label")?.querySelector('input[type="file"]')) return;
  enter();
}

function exit() {
  if (!current()) return;
  (document.exitFullscreen || document.webkitExitFullscreen)?.call(document)?.catch?.(() => {});
}

export function initFullscreen() {
  if (!supported()) return;
  document.addEventListener("click", onGesture, true);
  document.addEventListener("keydown", (e) => e.key !== "Escape" && onGesture(e), true);
  const changed = () => {
    if (current()) ours = false;
    // Uporabnik je zaprl celozaslonski način: ostane zaprt, dokler ne zapusti aplikacije.
    else if (!ours) armed = false;
  };
  document.addEventListener("fullscreenchange", changed);
  document.addEventListener("webkitfullscreenchange", changed);
  // Vrnitev v aplikacijo (npr. po kameri ali drugi aplikaciji): ob naslednjem dotiku spet cel zaslon.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") armed = true;
  });
  mountSetting(document.getElementById("fullscreen-card"));
  // Sprememba iz klepeta z inštruktorjem (public/chat-settings.js).
  window.addEventListener("evklid:device-setting", (e) => {
    if (e.detail?.key !== "fullscreen") return;
    const box = document.getElementById("fullscreen-toggle");
    if (box) box.checked = e.detail.value === "on";
    if (e.detail.value === "on") armed = true;
    else exit();
  });
}

// Ne v nameščeni aplikaciji (PWA ali splet v mobilni aplikaciji): tam je že cel zaslon in stikalo ne bi naredilo nič.
function mountSetting(box) {
  if (!box || isStandalone()) return;
  box.hidden = false;
  box.innerHTML = `<label class="check-row"><input type="checkbox" id="fullscreen-toggle"${fullscreenOn() ? " checked" : ""}>
      <span><b>${t("set.fullscreen")}</b><small class="muted">${t("set.fullscreenNote")}</small></span></label>`;
  box.querySelector("input").addEventListener("change", (e) => {
    try {
      localStorage.setItem(KEY, e.target.checked ? "1" : "0");
    } catch {}
    if (e.target.checked) {
      armed = true;
      enter(); // sprememba stikala je dejanje uporabnika, zato lahko vklopimo takoj
    } else exit();
  });
}
