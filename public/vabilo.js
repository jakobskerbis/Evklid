// Stran /vabilo (j 2026-11-15, 4. korak načrta pilota): koda iz povezave (?koda=…) ali vpisana, preverjanje
// POST /api/vabilo (server/vabila.js). Veljavna koda: dobrodošlica pilota in en gumb »Ustvari račun« (registracija
// z virom pilot, public/vir.js → students.vir). Koda ostane samo v tem brskalniku (localStorage evklid.vabilo), za
// samodejno članstvo, ko ga doda drugi profil (GitHub issue #751); na strežniku se ne shrani nič.
import { t, locale } from "./i18n.js";

export const KEY = "evklid.vabilo";
// Hash #registracija odpre obrazec za nov račun (public/account.js AUTH_HASH). Brez poizvedbe: account.js ob
// poizvedbi naslov počisti skupaj s hashem, ?koda= pa bi bila koda razreda. Vir »pilot« zato zapišemo tukaj.
export const REGISTER = "/#registracija";
export const SOURCE = "pilot";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const form = $("#vab-form");
const input = $("#vab-koda");
const out = $("#vab-out");
const btn = form.querySelector("button");

document.title = t("vab.docTitle");
if (document.documentElement.dir === "rtl") $("#vab-home").textContent = "→ Evklid";

const fmtDay = (d) => new Date(`${d}T12:00:00`).toLocaleDateString(locale(), { day: "numeric", month: "numeric", year: "numeric" });
const remember = (code) => {
  try {
    localStorage.setItem(KEY, code);
  } catch {}
};

// Vir za analitiko rasti (public/vir.js, prvi vir velja). Modul se naloži šele zdaj, ko ?koda= ni več v naslovu,
// sicer bi ga ob uvozu zapisal kot »razred«.
const markSource = () => import("./vir.js").then((m) => m.captureSource(`?vir=${SOURCE}`)).catch(() => {});

function showOk(day) {
  markSource();
  form.hidden = true;
  out.innerHTML = `<div class="card vab-ok">
    <h2>${esc(t("vab.okTitle"))}</h2>
    <h3>${esc(t("vab.getTitle"))}</h3>
    <ul><li>${esc(t("vab.get1", { date: fmtDay(day) }))}</li><li>${esc(t("vab.get2"))}</li></ul>
    <h3>${esc(t("vab.askTitle"))}</h3>
    <ul><li>${esc(t("vab.ask1"))}</li><li>${esc(t("vab.ask2", { tab: t("nav.me"), btn: t("fb.cardBtn") }))}</li></ul>
    <a class="btn-primary" id="vab-create" href="${REGISTER}">${esc(t("vab.create"))}</a>
    <p class="muted small">${esc(t("vab.confirm"))}</p>
  </div>`;
  $("#vab-create").focus({ preventScroll: true });
}

function showBad(key) {
  out.innerHTML = `<div class="card vab-bad" role="alert">
    <h2>${esc(t(key === "vab.badText" ? "vab.badTitle" : "vab.errTitle"))}</h2>
    <p>${esc(t(key))}</p>
    ${key === "vab.badText" ? `<p><a href="/#registracija">${esc(t("vab.register"))}</a></p>` : ""}
  </div>`;
}

async function check(code) {
  code = String(code || "").trim();
  if (!code) {
    out.innerHTML = `<p class="vab-hint">${esc(t("vab.enter"))}</p>`;
    return input.focus();
  }
  btn.disabled = true;
  btn.textContent = t("vab.checking");
  try {
    const res = await fetch("/api/vabilo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ koda: code }) });
    const r = await res.json().catch(() => ({}));
    if (res.status === 429) return showBad("vab.tooMany");
    if (!res.ok) return showBad("vab.error");
    if (!r.ok) return showBad("vab.badText");
    remember(code.toLowerCase());
    showOk(r.do);
  } catch {
    showBad("vab.error");
  } finally {
    btn.disabled = false;
    btn.textContent = t("vab.check");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  check(input.value);
});

// Koda iz povezave: v polje, iz naslova ven (ni je v zgodovini ali v povezavi, ki bi jo kdo delil naprej), preveri.
const q = new URLSearchParams(location.search);
const fromLink = (q.get("koda") || "").slice(0, 64);
if (fromLink) {
  q.delete("koda");
  history.replaceState(null, "", location.pathname + (q.size ? `?${q}` : "") + location.hash);
  input.value = fromLink;
  check(fromLink);
}
