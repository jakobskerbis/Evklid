// Kartice za ponavljanje: pomembna dejstva iz razlag inštruktorja (in lastne kartice), razdeljena v sklope po temah
// (public/kartice-sklopi.js). Vaja: ena kartica naenkrat, vse ostalo je skrito. Spredaj je vprašanje, odgovor je na
// hrbtu; tap (ali preslednica) kartico obrne, šele nato se oceni (»Še ne znam« / »Znam«). Strežnik določi, kdaj pride
// kartica znova na vrsto (1, 3, 7, 16, 35, 90 dni). Napačna kartica se v isti vaji vrne še enkrat.
import { icon } from "./icons.js";
import { t, locale } from "./i18n.js";
import { cardSets, sessionCards, OWN, OTHER } from "./kartice-sklopi.js";

let D = null; // { api, renderRich, cardRich, escapeHtml, toast, showView, getStudent, getPath, subjectName, onDue }
const $ = (sel) => document.querySelector(sel);
const box = () => $("#view-cards");
let data = null; // zadnji odgovor strežnika { cards, total, due, next_due }
let cards = new Map(); // id → kartica (sveže po vsaki oceni)
let session = null; // { queue, done, again, total, practice, key, flipped, seen }

export function initFlashcards(deps) {
  D = deps;
  document.addEventListener("keydown", onKey);
}

// SQLite datetime (UTC, »YYYY-MM-DD HH:MM:SS«) → Date.
const sqlDate = (s) => new Date(String(s).replace(" ", "T") + "Z");
const sid = () => D.getStudent()?.id;
// Kartice izbranega predmeta (predmet učne poti); brez poti strežnik vzame predmet iz profila.
const pathQ = () => (D.getPath?.() ? `?path=${encodeURIComponent(D.getPath())}` : "");
const rich = (s) => D.renderRich(s);
// Stran kartice: pomen črk iz teme kartice in druge strani (formula-data.js, kontekst).
const side = (c, back) => (D.cardRich ? D.cardRich(back ? c.back : c.front, c, back ? c.front : c.back) : rich(back ? c.back : c.front));
const esc = (s) => D.escapeHtml(s);
const setName = (s) => (s.kind === "own" ? t("cards.setOwn") : s.kind === "other" ? t("cards.setOther") : s.name);
const keyName = (key) => (key === null ? t("cards.allSets") : key === OWN ? t("cards.setOwn") : key === OTHER ? t("cards.setOther") : key);
const icons = (el) => el.querySelectorAll("i[data-icon]").forEach((i) => (i.outerHTML = icon(i.dataset.icon)));

export async function showFlashcards() {
  if (!sid()) return;
  const v = box();
  session = null;
  v.innerHTML = `<p class="muted">${t("common.loading")}</p>`;
  try {
    data = await D.api(`/api/students/${sid()}/flashcards${pathQ()}`);
  } catch (err) {
    v.innerHTML = `<p class="muted">${esc(err.message)}</p>`;
    return;
  }
  cards = new Map(data.cards.map((c) => [c.id, c]));
  D.onDue?.(data.due);
  renderOverview();
}

// --- pregled: začni ponavljanje, sklopi, seznam (odgovori skriti), nova kartica ---
function renderOverview() {
  const v = box();
  const list = [...cards.values()];
  const sets = cardSets(list, new Intl.Collator(locale()));
  const due = list.filter((c) => c.is_due).length;
  const next = data?.next_due ? sqlDate(data.next_due).toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" }) : null;
  const start = due
    ? `<p class="fc-start-n"><b>${t("cards.dueN", { n: due })}</b></p>
       <div class="actions"><button type="button" class="primary" data-start>${icon("play")} ${t("cards.start")}</button></div>`
    : `<p>${list.length ? t("cards.noneDue") : t("cards.empty")}</p>${next ? `<p class="muted">${t("cards.next", { date: esc(next) })}</p>` : ""}
       ${list.length ? `<div class="actions"><button type="button" class="secondary" data-practice>${icon("repeat")} ${t("cards.practiceAll")}</button></div>` : ""}`;
  v.innerHTML = `
    <button type="button" class="ghost back fc-back"><i data-icon="arrow-left"></i><span>${t("topic.backPath")}</span></button>
    ${D.subjectName?.() ? `<div class="eyebrow fc-subject">${esc(D.subjectName())}</div>` : ""}
    <h1 class="with-icon">${icon("layers")} ${t("cards.title")}</h1>
    <p class="muted">${t("cards.intro")}</p>
    <section class="card fc-start">${start}</section>
    <div class="actions" style="margin-block:12px"><button type="button" class="secondary" data-notes>${icon("notebook-pen")} ${t("cards.notes")}</button></div>
    ${sets.length > 1 ? `<section class="fc-sets"><h2>${t("cards.sets")}</h2><p class="muted">${t("cards.setsHint")}</p>
      <div class="fc-set-grid">${sets.map(setTile).join("")}</div></section>` : ""}
    <details class="card fc-list"${list.length && list.length <= 12 ? " open" : ""}${list.length ? "" : " hidden"}>
      <summary><b>${t("cards.all", { n: list.length })}</b></summary>
      ${sets.map((s) => `${sets.length > 1 ? `<h3 class="fc-group">${esc(setName(s))} <small class="muted">${t("cards.count", { n: s.total })}</small></h3>` : ""}
        <ul>${s.ids.map((id) => rowHtml(cards.get(id))).join("")}</ul>`).join("")}
    </details>
    <form id="fc-add" class="card fc-form">
      <h2>${icon("plus")} ${t("cards.addTitle")}</h2>
      <label>${t("cards.front")}<textarea name="front" rows="2" maxlength="300" required></textarea></label>
      <label>${t("cards.back")}<textarea name="back" rows="2" maxlength="600" required></textarea></label>
      <div class="actions"><button class="primary">${t("common.add")}</button></div>
      <p class="muted fc-err" role="alert"></p>
    </form>`;
  icons(v);
  v.querySelector(".fc-back").addEventListener("click", () => D.showView("path"));
  v.querySelector("[data-start]")?.addEventListener("click", () => startSession(null));
  v.querySelector("[data-practice]")?.addEventListener("click", () => startSession(null, true));
  v.querySelectorAll(".fc-set").forEach((b) => b.addEventListener("click", () => startSession(sets[Number(b.dataset.i)].key)));
  v.querySelector("#fc-add").addEventListener("submit", addOwn);
  // Moji zapiski (public/zapiski/): modul, besedila in slog se naložijo šele zdaj.
  v.querySelector("[data-notes]").addEventListener("click", async () => (await import("./zapiski/zapiski.js")).showZapiski({ ...D, box, back: showFlashcards }));
  v.querySelector(".fc-list").addEventListener("click", onListClick);
}

function setTile(s, i) {
  return `<button type="button" class="fc-set" data-i="${i}">
      <span class="fc-set-name" dir="auto">${esc(setName(s))}</span>
      <span class="fc-set-meta muted">${t("cards.count", { n: s.total })}</span>
      ${s.due ? `<span class="fc-set-due">${t("cards.setDue", { n: s.due })}</span>` : ""}
    </button>`;
}

function rowHtml(c) {
  return `<li data-id="${c.id}">
    <div class="fc-row-text">
      <div class="fc-q" dir="auto">${side(c, false)}</div>
      <button type="button" class="text-btn fc-peek" data-act="peek" aria-expanded="false">${icon("eye")} <span>${t("cards.show")}</span></button>
      <div class="fc-a muted" dir="auto" hidden>${side(c, true)}</div>
    </div>
    <div class="fc-row-btns">
      <button type="button" class="ghost icon-only" data-act="edit" title="${t("cards.edit")}" aria-label="${t("cards.edit")}">${icon("pencil")}</button>
      <button type="button" class="ghost icon-only" data-act="del" title="${t("cards.delete")}" aria-label="${t("cards.delete")}">${icon("trash-2")}</button>
    </div></li>`;
}

// --- vaja: ena kartica, ki se obrne; vse ostalo skrito ---
function startSession(key, practice = false) {
  const list = [...cards.values()];
  let s = sessionCards(list, key, { practice });
  // V sklopu brez kartic na vrsti: vaja vseh kartic sklopa (razpored ostane).
  if (!s.ids.length && !practice) s = sessionCards(list, key, { practice: true });
  if (!s.ids.length) return;
  session = { queue: s.ids, done: 0, again: new Set(), total: s.ids.length, practice: s.practice, key, flipped: false, seen: false };
  renderPractice();
  window.scrollTo?.({ top: 0 });
}

function renderPractice() {
  const v = box();
  const id = session.queue[0];
  const head = `<div class="fc-bar">
      <button type="button" class="ghost fc-exit">${icon("x")} <span>${t("cards.exit")}</span></button>
      <div class="fc-progress" aria-hidden="true"><span style="width:${Math.round((100 * session.done) / Math.max(session.total, 1))}%"></span></div>
      <span class="fc-count muted" dir="ltr">${Math.min(session.done + (id === undefined ? 0 : 1), session.total)} / ${session.total}</span>
    </div>
    <div class="eyebrow fc-sub" dir="auto">${esc(keyName(session.key))}${session.practice ? ` · ${t("cards.practiceTag")}` : ""}</div>`;
  if (id === undefined) {
    v.innerHTML = `<div class="fc-practice">${head}
      <div class="card fc-done"><h2>${icon("party-popper")} ${t(session.key === null && !session.practice ? "cards.doneTitle" : "cards.doneSetTitle")}</h2>
        <p>${t("cards.doneText", { n: session.done })}</p>
        <div class="actions"><button type="button" class="primary" data-back>${t("cards.backToCards")}</button></div></div></div>`;
    v.querySelector("[data-back]").addEventListener("click", showFlashcards);
    v.querySelector(".fc-exit").addEventListener("click", showFlashcards);
    v.querySelector("[data-back]").focus({ preventScroll: true });
    return;
  }
  const c = cards.get(id);
  session.flipped = false;
  session.seen = false;
  const topic = (session.key === null && c.source !== "own" && c.topic ? `<span class="fc-topic" dir="auto">${esc(c.topic)}</span>` : "") +
    (c.source === "zapiski" && !c.checked ? `<span class="muted">${esc(t("cards.notesUnchecked"))}</span>` : "");
  v.innerHTML = `<div class="fc-practice">${head}
    <div class="fc-flip" role="button" tabindex="0" aria-pressed="false">
      <div class="fc-inner">
        <div class="fc-face fc-face-front">
          <div class="fc-face-top"><span class="fc-side">${t("cards.front")}</span>${topic}</div>
          <div class="fc-front" dir="auto">${side(c, false)}</div>
          <div class="fc-hint muted">${icon("refresh-cw")} ${t("cards.flipHint")}</div>
        </div>
        <div class="fc-face fc-face-back" aria-hidden="true">
          <div class="fc-face-top"><span class="fc-side">${t("cards.back")}</span>${topic}</div>
          <div class="fc-backside" dir="auto">${side(c, true)}</div>
          <div class="fc-hint muted">${icon("refresh-cw")} ${t("cards.flipBackHint")}</div>
        </div>
      </div>
    </div>
    <div class="sr-only fc-live" aria-live="polite"></div>
    <div class="actions fc-grade fc-wait" inert>
      <button type="button" class="secondary" data-act="again">${icon("rotate-ccw")} ${t("cards.again")}</button>
      <button type="button" class="primary" data-act="know">${icon("check")} ${t("cards.know")}</button>
    </div>
    <p class="muted fc-keys">${t("cards.keys")}</p>
    ${session.practice ? `<p class="muted fc-note">${t("cards.practiceNote")}</p>` : ""}
  </div>`;
  v.querySelector(".fc-exit").addEventListener("click", showFlashcards);
  const card = v.querySelector(".fc-flip");
  card.addEventListener("click", flip);
  v.querySelector(".fc-grade").addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act) grade(act === "know");
  });
  card.focus({ preventScroll: true });
}

function flip() {
  const v = box();
  const card = v?.querySelector(".fc-flip");
  if (!card || !session || session.busy) return;
  session.flipped = !session.flipped;
  card.classList.toggle("flipped", session.flipped);
  card.setAttribute("aria-pressed", String(session.flipped));
  card.querySelector(".fc-face-front").setAttribute("aria-hidden", String(session.flipped));
  card.querySelector(".fc-face-back").setAttribute("aria-hidden", String(!session.flipped));
  // Bralnik zaslona: po obratu prebere vidno stran (ime gumba se sicer ne prebere znova).
  const live = v.querySelector(".fc-live");
  if (live) {
    const face = card.querySelector(session.flipped ? ".fc-face-back" : ".fc-face-front").cloneNode(true);
    face.querySelectorAll('[aria-hidden="true"], annotation').forEach((n) => n.remove()); // KaTeX: brez slike in izvorne kode
    live.textContent = face.textContent.replace(/\s+/g, " ").trim();
  }
  if (session.flipped && !session.seen) {
    session.seen = true;
    const g = v.querySelector(".fc-grade");
    g.classList.remove("fc-wait");
    g.removeAttribute("inert");
  }
}

async function grade(ok) {
  if (!session?.seen) return;
  const s = session;
  const id = s.queue.shift();
  s.seen = false;
  if (!s.practice) {
    s.busy = true; // do odgovora strežnika se kartica ne obrne (sicer bi ocena šla naslednji, neodkriti kartici)
    try {
      const r = await D.api(`/api/students/${sid()}/flashcards/${id}/review`, { method: "POST", body: { ok, path: D.getPath?.() || undefined } });
      cards.set(id, r.card);
      D.onDue?.(r.due);
    } catch (err) {
      D.toast(err.message);
    }
    s.busy = false;
  }
  if (session !== s) return; // učenec je medtem zapustil vajo (ali začel novo)
  // Pozabljena kartica pride v isti vaji še enkrat na konec (le enkrat).
  if (!ok && !session.again.has(id)) {
    session.again.add(id);
    session.queue.push(id);
    session.total++;
  }
  session.done++;
  renderPractice();
}

// Tipke (računalnik): preslednica ali Enter obrne kartico, 1 = še ne znam, 2 = znam.
function onKey(e) {
  if (box()?.hidden || !session || !$("#view-cards .fc-flip")) return;
  if (e.target.closest?.("textarea, input, select, [contenteditable]")) return;
  if ((e.key === " " || e.key === "Enter") && !e.target.closest?.("button, summary, a")) {
    e.preventDefault();
    flip();
  } else if (session.seen && (e.key === "1" || e.key === "2")) {
    e.preventDefault();
    grade(e.key === "2");
  }
}

async function addOwn(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const err = e.target.querySelector(".fc-err");
  try {
    await D.api(`/api/students/${sid()}/flashcards`, { method: "POST", body: { front: f.get("front"), back: f.get("back"), path: D.getPath?.() || undefined } });
    D.toast(t("common.saved"), "check");
    showFlashcards();
  } catch (x) {
    err.textContent = x.message;
  }
}

async function onListClick(e) {
  const b = e.target.closest("[data-act]");
  const li = e.target.closest("li[data-id]");
  if (!b || !li) return;
  const id = Number(li.dataset.id);
  if (b.dataset.act === "peek") {
    const a = li.querySelector(".fc-a");
    a.hidden = !a.hidden;
    b.setAttribute("aria-expanded", String(!a.hidden));
    b.innerHTML = `${icon(a.hidden ? "eye" : "eye-off")} <span>${t(a.hidden ? "cards.show" : "cards.hide")}</span>`;
    return;
  }
  if (b.dataset.act === "del") {
    if (!confirm(t("cards.deleteConfirm"))) return;
    await D.api(`/api/students/${sid()}/flashcards/${id}`, { method: "DELETE" }).catch((x) => D.toast(x.message));
    return showFlashcards();
  }
  if (b.dataset.act === "edit") {
    const c = cards.get(id);
    if (!c) return;
    li.innerHTML = `<form class="fc-form fc-edit">
      <label>${t("cards.front")}<textarea name="front" rows="2" maxlength="300" required>${esc(c.front)}</textarea></label>
      <label>${t("cards.back")}<textarea name="back" rows="2" maxlength="600" required>${esc(c.back)}</textarea></label>
      <div class="actions"><button class="primary">${t("common.save")}</button><button type="button" data-cancel>${t("cards.cancel")}</button></div>
      <p class="muted fc-err" role="alert"></p></form>`;
    const form = li.querySelector("form");
    form.querySelector("[data-cancel]").addEventListener("click", () => showFlashcards());
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const f = new FormData(form);
      try {
        await D.api(`/api/students/${sid()}/flashcards/${id}`, { method: "PUT", body: { front: f.get("front"), back: f.get("back") } });
        showFlashcards();
      } catch (x) {
        form.querySelector(".fc-err").textContent = x.message;
      }
    });
  }
}

// Pod odgovorom inštruktorja: katera dejstva so bila dodana na kartice.
export function addCardsNote(bubble, data) {
  if (!bubble || !data?.cards?.length) return;
  const el = document.createElement("div");
  el.className = "cards-note";
  el.innerHTML = `<div class="cn-head">${icon("layers")} <b>${t("cards.added")}</b></div>
    <ul>${data.cards.map((c) => `<li>${side(c, false)}</li>`).join("")}</ul>
    <button type="button" class="text-btn">${t("cards.open")} ${icon("chevron-right")}</button>`;
  el.querySelector("button").addEventListener("click", () => D.showView("cards"));
  bubble.appendChild(el);
  D.onDue?.(data.due);
}
