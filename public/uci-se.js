// Uči se (j, 4. 11. 2026): en gumb v zgornji in spodnji vrstici, v njem trije zavihki Učbenik | Laboratorij | 3D svet.
// Vsebina zavihkov so obstoječi pogledi: #view-textbook (textbook.js), #view-lab (laboratorij.js) in #view-3d
// (kartice strani /3d, spodaj). Gumb odpre zadnji uporabljeni zavihek (shranjen na napravi). Stare poti
// (showView("textbook"), ?pogled=lab, ukaz inštruktorju »odpri laboratorij«) izberejo pravi zavihek v app.js.
// Atlas ali model iz 3D sveta se odpre čez cel zaslon: stran /3d v okvirju (isti izvor), Nazaj ali Esc ga zapreta.
import { t } from "./i18n.js";
import { icon } from "./icons.js";
import { makeRowSortable } from "./vrstice.js";

export const UCI_TABS = ["textbook", "lab", "3d"];
const KEY = "evklid.uciZavihek";
const PREDMETI = ["BIO", "KEM", "FIZ", "MAT", "NAR"];

let D = null; // { escapeHtml, getStudent, showTextbook, showLab, stopReading, askTutor, onOverlay(open) }
let tab = read();
let hub = null; // { key, html } narisan 3D svet (predmet in jezik)
let full = null; // { el, frame } odprt atlas ali model čez cel zaslon
let fromLesson = false; // poskus je odprla povezava v lekciji: tipka Nazaj vrne v lekcijo

function read() {
  try {
    const v = localStorage.getItem(KEY);
    return UCI_TABS.includes(v) ? v : "textbook";
  } catch {
    return "textbook";
  }
}
function save(v) {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
}
const $ = (s) => document.querySelector(s);
const esc = (s) => D.escapeHtml(String(s ?? ""));
const paneOf = (name) => document.getElementById(`view-${name}`);
const tr = (k, fallback) => {
  const s = t(k);
  return s === k ? fallback : s;
};

/** Zavihek, ki ga »Uči se« pokaže (zadnji uporabljeni). */
export const uciTab = () => tab;

/** Izbere zavihek (brez izrisa vsebine): oznaka v preklopniku, vidni del, zapis na napravi. */
export function setUciTab(name) {
  if (!UCI_TABS.includes(name)) return;
  if (name !== "textbook" && tab === "textbook") D?.stopReading?.(); // branje lekcije na glas ne teče naprej skrito
  if (name !== "lab") fromLesson = false;
  tab = name;
  save(name);
  for (const b of document.querySelectorAll("[data-uci-tab]")) {
    const on = b.dataset.uciTab === name;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", String(on));
    b.tabIndex = on ? 0 : -1;
  }
  for (const v of UCI_TABS) {
    const p = paneOf(v);
    if (p) p.hidden = v !== name;
  }
}

/** Izris vidnega zavihka (ob prikazu pogleda »Uči se« v glavnem delu ali v premičnem oknu). */
export function showUci() {
  setUciTab(tab);
  if (tab === "textbook") return D?.showTextbook();
  if (tab === "lab") return D?.showLab();
  return show3d();
}

export function initUci(deps) {
  D = deps;
  const row = $(".uci-tabs");
  if (!row) return;
  row.addEventListener("click", (e) => {
    const b = e.target.closest("[data-uci-tab]");
    if (!b || b.dataset.uciTab === tab) return;
    fromLesson = false;
    setUciTab(b.dataset.uciTab);
    showUci();
  });
  // Puščice levo/desno med zavihki (vzorec ARIA tablist); Alt+Shift+puščica ostane preurejanju vrstice.
  row.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key) || e.altKey || e.shiftKey) return;
    const items = [...row.querySelectorAll("[data-uci-tab]")];
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const rtl = getComputedStyle(row).direction === "rtl";
    const step = (e.key === "ArrowRight") !== rtl ? 1 : -1;
    const next = e.key === "Home" ? items[0] : e.key === "End" ? items.at(-1) : items[(i + step + items.length) % items.length];
    next.focus();
    next.click();
  });
  makeRowSortable(row, "uci", { item: "[data-uci-tab]", idOf: (el) => el.dataset.uciTab });
  setUciTab(tab);
  // Okvir s stranjo /3d: »Nazaj« na prvem zaslonu zapre, »Vprašaj inštruktorja« v atlasu odpre klepet z vprašanjem.
  window.addEventListener("message", (e) => {
    if (!full || e.origin !== location.origin || e.source !== full.frame.contentWindow) return;
    const msg = e.data || {};
    if (msg.tip === "zapri3d") close3d();
    if (msg.tip === "vprasaj" && typeof msg.besedilo === "string" && msg.besedilo.trim()) {
      close3d();
      D.askTutor(msg.besedilo.slice(0, 2000));
    }
  });
  document.addEventListener("keydown", (e) => {
    if (full && e.key === "Escape" && !e.defaultPrevented) {
      e.preventDefault();
      close3d();
    }
  });
}

/** Tipka Nazaj v »Uči se«: zapre atlas ali model, sicer lekcijo ali poskus. Vrne true, če je kaj zaprla. */
export function uciBack({ textbookBack, labBack }) {
  if (close3d()) return true;
  if (tab === "textbook") return textbookBack();
  if (tab === "lab") {
    const closed = labBack();
    if (!fromLesson) return closed;
    // Poskus iz lekcije (»Poskus v laboratoriju«): Nazaj vrne v lekcijo, ne na seznam poskusov.
    fromLesson = false;
    setUciTab("textbook");
    showUci();
    return true;
  }
  return false;
}

/** Povezava v lekciji je odprla poskus v zavihku Laboratorij (app.js, initTextbook → openLab). */
export function labFromLesson() {
  fromLesson = true;
}

/** Pogled »Uči se« je zaprt (premično okno ali drug pogled): okvir 3D se zapre, da ne porablja grafične kartice. */
export function leaveUci() {
  fromLesson = false;
  close3d();
}

// ---------- 3D svet: kartice strani /3d (atlas telesa in modeli iz kode, docs/3d.md) ----------

const predmetIme = (p) => tr(`subj.${p}`, p);

async function show3d() {
  const box = document.getElementById("uci-3d-content");
  if (!box) return;
  const mine = D.getStudent()?.settings?.subject || "";
  const key = `${mine}|${document.documentElement.lang}`;
  if (hub?.key === key && box.querySelector(".uci-3d-card, .uci-3d-atlas")) return;
  let modeli = [];
  try {
    const { seznamModelov } = await import("./3d/modeli.js");
    modeli = await seznamModelov();
  } catch {
    box.innerHTML = `<p class="muted">${esc(t("a3.loadError"))}</p>`;
    return;
  }
  // Področja po vrstnem redu strani /3d, a najprej tista z modeli učenčevega predmeta (in v njih najprej ti modeli).
  const podrocja = new Map();
  for (const m of modeli) {
    if (!podrocja.has(m.podrocje)) podrocja.set(m.podrocje, []);
    podrocja.get(m.podrocje).push(m);
  }
  const moj = (m) => (m.predmet === mine ? 0 : 1);
  const skupine = [...podrocja.entries()]
    .map(([p, list]) => ({ p, list: [...list].sort((a, b) => moj(a) - moj(b)), mine: list.some((m) => m.predmet === mine) }))
    .sort((a, b) => Number(b.mine) - Number(a.mine));
  // Atlas telesa je biologija: na vrhu za biologijo in naravoslovje (ali če učenčev predmet nima modelov), sicer za njegovimi področji.
  const atlasFirst = ["BIO", "NAR"].includes(mine) || !PREDMETI.includes(mine) || !skupine.some((g) => g.mine);
  const atlas = `<a class="card uci-3d-atlas" href="/3d#atlas" data-k3="atlas" data-k3-title="${esc(t("a3.title"))}">
      <span class="uci-3d-atlas-ic">${icon("bone") || icon("box")}</span>
      <span class="uci-3d-atlas-txt"><small class="eyebrow">${esc(t("a3.eyebrow"))}</small><b>${esc(t("a3.title"))}</b><span>${esc(t("a3.hubAtlas"))}</span></span>
      <span class="uci-3d-open">${icon("box")}<span>${esc(t("a3.open"))}</span></span>
    </a>`;
  const area = (g) => `<section class="uci-3d-area">
      <h2>${esc(tr(`a3.area.${g.p}`, g.p))}</h2>
      <div class="uci-3d-grid">${g.list
        .map(
          (m) => `<a class="card uci-3d-card${m.predmet === mine ? " mine" : ""}" href="/3d#${encodeURIComponent(m.id)}" data-k3="${esc(m.id)}" data-k3-title="${esc(m.naslov)}">
          <small class="uci-3d-subj">${esc(predmetIme(m.predmet))}</small><b dir="auto">${esc(m.naslov)}</b>${m.opis ? `<small dir="auto">${esc(m.opis)}</small>` : ""}
        </a>`,
        )
        .join("")}</div>
    </section>`;
  const nMine = skupine.filter((g) => g.mine).length;
  const parts = skupine.map(area);
  if (atlasFirst) parts.unshift(atlas);
  else parts.splice(nMine, 0, atlas);
  box.innerHTML = `<p class="muted uci-3d-sub">${esc(t("a3.hubSub"))}</p>${parts.join("")}`;
  hub = { key };
  box.querySelectorAll("[data-k3]").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // nov zavihek ostane navaden
      e.preventDefault();
      open3d(a.dataset.k3, a.dataset.k3Title || "");
    }),
  );
}

/** Odpre atlas (»atlas«) ali model z id-jem čez cel zaslon; param npr. { izberi } (atlas) ali { del } (model). */
export function open3d(id, title = "", param = null) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id || "")) return;
  const q = param ? new URLSearchParams(Object.entries(param).filter(([, v]) => v)).toString() : "";
  close3d();
  const el = document.createElement("div");
  el.className = "uci-3d-full";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", title || t("a3.hubTitle"));
  const frame = document.createElement("iframe");
  frame.title = title || t("a3.hubTitle");
  frame.allow = "fullscreen";
  frame.src = `/3d?vgrajeno=1#${encodeURIComponent(id)}${q ? `?${q}` : ""}`;
  el.append(frame);
  document.body.append(el);
  document.body.classList.add("uci-3d-odprto");
  // Okvir je velik kot vidni del zaslona: če je stran aplikacije kje širša od zaslona, Android razširi postavitev (in
  // z njo višino) in okvir s `inset: 0` bi segal čez desni in spodnji rob (drsenje, odrezana glava ali spodnja vrstica).
  const vv = window.visualViewport;
  const prilagodi = () => {
    if (!vv) return;
    const k = Math.max(1, vv.scale);
    Object.assign(el.style, { width: `${Math.round(vv.width * k)}px`, height: `${Math.round(vv.height * k)}px`, left: "0", right: "auto", top: "0", bottom: "auto" });
  };
  prilagodi();
  vv?.addEventListener("resize", prilagodi);
  full = { el, frame, from: document.activeElement, odjavi: () => vv?.removeEventListener("resize", prilagodi) };
  D?.onOverlay?.(true);
  frame.focus();
}

function close3d() {
  if (!full) return false;
  const { el, from, odjavi } = full;
  full = null;
  odjavi();
  el.remove(); // okvir se uniči skupaj s prizorom (pomnilnik grafične kartice)
  document.body.classList.remove("uci-3d-odprto");
  D?.onOverlay?.(false);
  if (from?.isConnected) from.focus({ preventScroll: true });
  return true;
}
export const isOpen3d = () => !!full;
