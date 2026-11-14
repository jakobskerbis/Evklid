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
  D?.odprto?.(tab === "textbook" ? "lekcije" : tab === "lab" ? "laboratorij" : "svet3d"); // B2: odprtje dela (public/app.js)
  if (tab === "textbook") return D?.showTextbook();
  if (tab === "lab") return D?.showLab();
  return show3d();
}

export function initUci(deps) {
  D = deps;
  globalThis.addEventListener?.("evklid:era", obSlogu);
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

// ---------- 3D svet: drevo (public/3d/drevo.js, enako kot zbirka strani /3d, docs/3d.md) ----------
// Štirje predmeti, tap na vejo pokaže podveje, zadnja veja modele; atlas, model in mikroskop se odprejo čez cel zaslon.
// Ikone vej so izrisi v slogu aplikacije (data-style; Igriv = Čist). Odprta veja ostane v seji (sessionStorage).

const predmetIme = (p) => tr(`subj.${p}`, p);
const VEJA = "evklid.3d.veja";
let drevoMod = null; // public/3d/drevo.js (naloži se ob prvem prikazu)
let pot = (() => {
  try {
    return String(sessionStorage.getItem(VEJA) || "");
  } catch {
    return "";
  }
})();
function nastaviPot(v) {
  pot = v;
  try {
    sessionStorage.setItem(VEJA, v);
  } catch {}
  hub = null;
  show3d().then(() => document.querySelector("#uci-3d-content .uci-3d-pot [aria-current], #uci-3d-content .uci-3d-veja")?.focus({ preventScroll: true }));
  paneOf("3d")?.scrollTo?.({ top: 0 });
}

async function show3d() {
  const box = document.getElementById("uci-3d-content");
  if (!box) return;
  const slog = document.documentElement.dataset.style || "";
  const key = `${document.documentElement.lang}|${slog}|${pot}`;
  if (hub?.key === key && box.querySelector(".uci-3d-veja, .uci-3d-card")) return;
  let modeli = [];
  try {
    const [{ seznamModelov }, d] = await Promise.all([import("./3d/modeli.js"), drevoMod || import("./3d/drevo.js")]);
    drevoMod = d;
    modeli = await seznamModelov();
  } catch {
    box.innerHTML = `<p class="muted">${esc(t("a3.loadError"))}</p>`;
    return;
  }
  const { DREVO, BARVE, poPoti, modeliVeje, vsiModeliDrevesa, ikonaVeje } = drevoMod;
  const poId = new Map(modeli.map((m) => [m.id, m]));
  const obstaja = new Set([...poId.keys(), "atlas"]);
  const veje = poPoti(pot);
  while (veje.length && !modeliVeje(veje[veje.length - 1], obstaja).length) veje.pop();
  const potId = veje.map((v) => v.id).join("/");
  const skupina = veje[0]?.sk;
  const ime = (id) => tr(`a3.tree.${id}`, id);
  const zdaj = veje[veje.length - 1];

  // Pot: »3D svet › Biologija › …«, prejšnji koraki so gumbi.
  let potHtml = "";
  if (veje.length) {
    const korak = (besedilo, v) => `<span><button type="button" class="uci-3d-korak" data-pot="${esc(v)}">${esc(besedilo)}</button><span class="uci-3d-loc" aria-hidden="true">›</span></span>`;
    potHtml = `<nav class="uci-3d-pot" aria-label="${esc(t("a3.treePath"))}">${korak(t("a3.hubTitle"), "")}${veje
      .slice(0, -1)
      .map((v, i) => korak(ime(v.id), veje.slice(0, i + 1).map((x) => x.id).join("/")))
      .join("")}<b aria-current="page" tabindex="-1">${esc(ime(zdaj.id))}</b></nav>`;
  }
  const kartica = (m) => `<a class="card uci-3d-card" href="/3d#${encodeURIComponent(m.id)}" data-k3="${esc(m.id)}" data-k3-title="${esc(m.naslov)}">
          <small class="uci-3d-subj">${esc(predmetIme(m.predmet))}</small><b dir="auto">${esc(m.naslov)}</b>${m.opis ? `<small dir="auto">${esc(m.opis)}</small>` : ""}
        </a>`;
  const veja = (v) => {
    const n = modeliVeje(v, obstaja).length;
    const barva = BARVE[v.sk || skupina] || BARVE.fiz;
    const vsebina = `<span class="uci-3d-veja-ikona" aria-hidden="true"><img src="${esc(ikonaVeje(v.id, slog))}" alt="" width="256" height="256" decoding="async">${v.povezava || !n ? "" : `<span class="uci-3d-veja-n">${n}</span>`}</span><span class="uci-3d-veja-ime">${esc(ime(v.id))}</span>`;
    return v.povezava
      ? `<a class="uci-3d-veja" style="--veja:${barva}" href="/3d#${esc(v.povezava)}" data-k3="${esc(v.povezava)}" data-k3-title="${esc(t("a3.title"))}">${vsebina}</a>`
      : `<button type="button" class="uci-3d-veja" style="--veja:${barva}" data-pot="${esc([potId, v.id].filter(Boolean).join("/"))}">${vsebina}</button>`;
  };
  let telo;
  if (zdaj?.modeli) telo = `<div class="uci-3d-grid">${zdaj.modeli.map((id) => poId.get(id)).filter(Boolean).map(kartica).join("")}</div>`;
  else {
    telo = `<div class="uci-3d-drevo">${(zdaj ? zdaj.otroci : DREVO).filter((v) => modeliVeje(v, obstaja).length).map(veja).join("")}</div>`;
    if (!zdaj) {
      telo += `<a class="uci-3d-mikroskop" href="/3d#mikroskop" data-k3="mikroskop" data-k3-title="${esc(t("mk.title"))}">${icon("microscope") || ""}<span>${esc(t("mk.start"))}</span></a>`;
      const vDrevesu = vsiModeliDrevesa();
      const drugi = modeli.filter((m) => !vDrevesu.has(m.id));
      if (drugi.length) telo += `<section class="uci-3d-area"><h2>${esc(t("a3.treeMore"))}</h2><div class="uci-3d-grid">${drugi.map(kartica).join("")}</div></section>`;
    }
  }
  box.innerHTML = `${veje.length ? "" : `<p class="muted uci-3d-sub">${esc(t("a3.hubSub"))}</p>`}${potHtml}${telo}`;
  hub = { key };
  box.querySelectorAll("[data-pot]").forEach((b) => b.addEventListener("click", () => nastaviPot(b.dataset.pot)));
  box.querySelectorAll(".uci-3d-veja img").forEach((img) =>
    img.addEventListener("error", () => img.remove()), // brez povezave: ostane ploščica z imenom
  );
  box.querySelectorAll("[data-k3]").forEach((a) =>
    a.addEventListener("click", (e) => {
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // nov zavihek ostane navaden
      e.preventDefault();
      open3d(a.dataset.k3, a.dataset.k3Title || "");
    }),
  );
}
// Menjava sloga (theme.js): ikone vej v novem slogu, če je 3D svet odprt (prijavi initUci).
function obSlogu() {
  hub = null;
  if (tab === "3d" && !paneOf("3d")?.hidden) show3d();
}

/** Odpre atlas (»atlas«) ali model z id-jem čez cel zaslon; param npr. { izberi } (atlas) ali { del } (model). */
export function open3d(id, title = "", param = null) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id || "")) return;
  const q = param ? new URLSearchParams(Object.entries(param).filter(([, v]) => v)).toString() : "";
  D?.odprto?.("svet3d"); // B2: atlas ali model iz lekcije ali zbirke
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
    Object.assign(el.style, { width: `${Math.round(vv.width * k)}px`, height: `${Math.round(vv.height * k)}px`, left: "0", right: "auto", top: `${k > 1 ? 0 : Math.round(vv.offsetTop)}px`, bottom: "auto" });
  };
  prilagodi();
  vv?.addEventListener("resize", prilagodi);
  vv?.addEventListener("scroll", prilagodi); // iOS premakne vidni del (tipkovnica): okvir mu sledi
  full = { el, frame, from: document.activeElement, odjavi: () => (vv?.removeEventListener("resize", prilagodi), vv?.removeEventListener("scroll", prilagodi)) };
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
