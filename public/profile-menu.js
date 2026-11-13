// Meni profila zgoraj desno (klik na ime): kdo uči, menjava profila, nov profil, zbirke, mnenje, nastavitve,
// račun in odjava. Skriti <select id="student-select"> še vedno hrani izbranega učenca
// (ostala koda bere in nastavlja njega), ta meni je le njegov obraz.
import { icon } from "./icons.js";
import { t } from "./i18n.js";
import { mountSubjectSwitch, SUBJECT_KEYS } from "./subject-switch.js";

const $ = (sel) => document.querySelector(sel);
let D = null; // { getState, showView, escapeHtml, accountsOn, logout, describe }

const initial = (name) => (String(name || "?").trim().charAt(0) || "?").toUpperCase();

export function initProfileMenu(deps) {
  D = deps;
  const btn = $("#profile-btn");
  if (!btn) return;
  btn.addEventListener("click", () => (isOpen() ? close() : open()));
  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" && !isOpen()) {
      e.preventDefault();
      open();
    }
  });
  const pop = $("#profile-pop");
  pop.addEventListener("click", onPick);
  pop.addEventListener("keydown", onKey);
  document.addEventListener("pointerdown", (e) => {
    if (isOpen() && !pop.contains(e.target) && !btn.contains(e.target)) close();
  });
  window.addEventListener("resize", () => close());
}

// Ime in začetnica na gumbu (ob zagonu, menjavi profila in spremembi imena).
export function refreshProfileButton() {
  const s = D?.getState().student;
  const btn = $("#profile-btn");
  if (!s || !btn) return;
  btn.querySelector(".pm-avatar").textContent = initial(s.name);
  btn.querySelector(".pm-name").textContent = s.name;
  btn.title = `${s.name} · ${t("pm.menu")}`;
  if (isOpen()) render();
}

// Odpre meni (npr. »Izberi drug profil«, ko je profil odprt na drugi napravi).
export function openProfileMenu() {
  if (!isOpen()) open();
}

const isOpen = () => !$("#profile-pop").hidden;

// Tipka Nazaj najprej zapre odprt meni (vrne true, če je bil odprt).
export function closeProfileMenu() {
  if (!isOpen()) return false;
  close();
  return true;
}

function open() {
  const btn = $("#profile-btn");
  const usage = $("#usage-pop");
  if (usage) usage.hidden = true;
  render();
  const pop = $("#profile-pop");
  const r = btn.getBoundingClientRect();
  pop.style.top = `${Math.round(r.bottom + 8)}px`;
  // Ob gumbu profila; v RTL je gumb levo, zato meni poravnamo z levim robom.
  const rtl = document.documentElement.dir === "rtl";
  pop.style.left = pop.style.right = "";
  pop.style[rtl ? "left" : "right"] = `${Math.max(8, Math.round(rtl ? r.left : window.innerWidth - r.right))}px`;
  pop.hidden = false;
  btn.setAttribute("aria-expanded", "true");
  (pop.querySelector('[aria-checked="false"]') || pop.querySelector(".pm-item"))?.focus({ preventScroll: true });
}

function close(refocus = false) {
  const pop = $("#profile-pop");
  if (pop.hidden) return;
  pop.hidden = true;
  $("#profile-btn").setAttribute("aria-expanded", "false");
  if (refocus) $("#profile-btn").focus({ preventScroll: true });
}

function render() {
  const { students = [], student } = D.getState();
  if (!student) return;
  const esc = D.escapeHtml;
  const accounts = D.accountsOn();
  const item = (act, ic, label) => `<button type="button" class="pm-item" role="menuitem" data-act="${act}">${icon(ic)}<span>${esc(label)}</span></button>`;
  const others =
    students.length > 1
      ? `<div class="pm-label" role="presentation">${esc(t("pm.switch"))}</div>
        ${students
          .map(
            (s) => `<button type="button" class="pm-item pm-student" role="menuitemradio" aria-checked="${s.id === student.id}" data-id="${s.id}">
              <span class="pm-avatar sm" aria-hidden="true">${esc(initial(s.name))}</span><span dir="auto">${esc(s.name)}</span>${s.id === student.id ? icon("check", "pm-check") : ""}
            </button>`,
          )
          .join("")}
        <div class="pm-sep" role="separator"></div>`
      : "";
  $("#profile-pop").innerHTML = `
    <div class="pm-head">
      <span class="pm-avatar big" aria-hidden="true">${esc(initial(student.name))}</span>
      <span class="pm-who"><b dir="auto">${esc(student.name)}</b><small class="muted">${esc(D.describe(student))}</small></span>
    </div>
    <div class="pm-sep" role="separator"></div>
    <div class="subj-sw" hidden></div>
    ${others}
    ${item("add", "user-plus", t("pm.add"))}
    ${item("zbirke", "award", t("zb.title"))}
    ${accounts ? item("account", "user", t("nav.account")) : ""}
    ${accounts ? `<div class="pm-sep" role="separator"></div>${item("logout", "log-out", t("pm.logout"))}` : ""}`;
  mountSubjectSwitch($("#profile-pop .subj-sw"), { onPicked: () => close(true) });
}

function onPick(e) {
  const b = e.target.closest(".pm-item");
  if (!b) return;
  if (b.dataset.id) {
    close(true);
    const sel = $("#student-select");
    if (sel.value === b.dataset.id) return;
    sel.value = b.dataset.id;
    sel.dispatchEvent(new Event("change", { bubbles: true }));
    return;
  }
  close();
  const act = b.dataset.act;
  // Zbirke so na računalniku dosegljive samo tu (na telefonu tudi pod »Jaz«). Nastavitve in Povratne informacije
  // so zavihka (telefon: »Jaz«), zato jih meni ne ponavlja (j, 12. 11.).
  if (act === "zbirke") return D.showView(act);
  if (act === "account") return $("#account-tab")?.click();
  if (act === "logout") return D.logout();
  if (act === "add") {
    // Z računi otroka doda starš s soglasjem v zavihku Račun, sicer obrazec »Nov učenec« v Nastavitvah.
    if (D.accountsOn()) return $("#account-tab")?.click();
    D.showView("settings");
    const input = $("#new-student-form input[name=name]");
    requestAnimationFrame(() => {
      input?.closest(".card")?.scrollIntoView({ behavior: "smooth", block: "center" });
      input?.focus({ preventScroll: true });
    });
  }
}

function onKey(e) {
  const items = [...$("#profile-pop").querySelectorAll(`.pm-item, ${SUBJECT_KEYS}`)];
  const i = items.indexOf(document.activeElement);
  if (e.key === "Escape" || e.key === "Tab") {
    if (e.key === "Escape") e.preventDefault();
    return close(e.key === "Escape");
  }
  const go = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key];
  if (go === undefined) return;
  e.preventDefault();
  items[(go + items.length) % items.length]?.focus();
}
