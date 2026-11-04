// Kartice za ponavljanje: pomembna dejstva iz razlag inštruktorja (in lastne kartice).
// Ponavljanje: najprej se spomni, nato preveri (»Še ne znam« / »Znam«); strežnik določi,
// kdaj pride kartica znova na vrsto (1, 3, 7, 16, 35, 90 dni). Napačna kartica se v isti seji vrne še enkrat.
import { icon } from "./icons.js";
import { t, locale } from "./i18n.js";

let D = null; // { api, renderRich, escapeHtml, toast, showView, getStudent, getPath, onDue }
const $ = (sel) => document.querySelector(sel);
const box = () => $("#view-cards");
let session = null; // { queue, done, shown, total }

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

export async function showFlashcards() {
  if (!sid()) return;
  const v = box();
  v.innerHTML = `<p class="muted">${t("common.loading")}</p>`;
  let data;
  try {
    data = await D.api(`/api/students/${sid()}/flashcards${pathQ()}`);
  } catch (err) {
    v.innerHTML = `<p class="muted">${D.escapeHtml(err.message)}</p>`;
    return;
  }
  D.onDue?.(data.due);
  const due = data.cards.filter((c) => c.is_due);
  session = { queue: due.map((c) => c.id), cards: new Map(data.cards.map((c) => [c.id, c])), done: 0, again: new Set(), shown: false, total: due.length };
  v.innerHTML = `
    <button type="button" class="ghost back fc-back"><i data-icon="arrow-left"></i><span>${t("topic.backPath")}</span></button>
    <h1 class="with-icon">${icon("layers")} ${t("cards.title")}</h1>
    <p class="muted">${t("cards.intro")}</p>
    <section id="fc-review" class="fc-review" aria-live="polite"></section>
    <details class="card fc-list"${data.total && data.total <= 12 ? " open" : ""}${data.total ? "" : " hidden"}>
      <summary><b>${t("cards.all", { n: data.total })}</b></summary>
      <ul>${data.cards.map(rowHtml).join("")}</ul>
    </details>
    <form id="fc-add" class="card fc-form">
      <h2>${icon("plus")} ${t("cards.addTitle")}</h2>
      <label>${t("cards.front")}<textarea name="front" rows="2" maxlength="300" required></textarea></label>
      <label>${t("cards.back")}<textarea name="back" rows="2" maxlength="600" required></textarea></label>
      <div class="actions"><button class="primary">${t("common.add")}</button></div>
      <p class="muted fc-err" role="alert"></p>
    </form>`;
  v.querySelectorAll("i[data-icon]").forEach((el) => (el.outerHTML = icon(el.dataset.icon)));
  v.querySelector(".fc-back").addEventListener("click", () => D.showView("path"));
  v.querySelector("#fc-add").addEventListener("submit", addOwn);
  v.querySelector(".fc-list ul").addEventListener("click", onListClick);
  renderReview(data);
}

function rowHtml(c) {
  const meta = [c.topic, c.source === "own" ? t("cards.own") : ""].filter(Boolean).map(D.escapeHtml).join(" · ");
  return `<li data-id="${c.id}">
    <div class="fc-row-text"><div class="fc-q" dir="auto">${rich(c.front)}</div><div class="fc-a muted" dir="auto">${rich(c.back)}</div>${meta ? `<small class="muted">${meta}</small>` : ""}</div>
    <div class="fc-row-btns">
      <button type="button" class="ghost icon-only" data-act="edit" title="${t("cards.edit")}" aria-label="${t("cards.edit")}">${icon("pencil")}</button>
      <button type="button" class="ghost icon-only" data-act="del" title="${t("cards.delete")}" aria-label="${t("cards.delete")}">${icon("trash-2")}</button>
    </div></li>`;
}

function renderReview(data) {
  const el = $("#fc-review");
  if (!el || !session) return;
  const id = session.queue[0];
  if (id === undefined) {
    if (session.done) {
      el.innerHTML = `<div class="card fc-done"><h2>${icon("party-popper")} ${t("cards.doneTitle")}</h2><p>${t("cards.doneText", { n: session.done })}</p>
        <div class="actions"><button type="button" class="primary" data-go="path">${t("topic.backPath")}</button></div></div>`;
      el.querySelector("[data-go]").addEventListener("click", () => D.showView("path"));
      return;
    }
    const next = data?.next_due ? sqlDate(data.next_due).toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" }) : null;
    el.innerHTML = `<div class="card fc-empty"><p>${data?.total ? t("cards.noneDue") : t("cards.empty")}</p>${next ? `<p class="muted">${t("cards.next", { date: D.escapeHtml(next) })}</p>` : ""}</div>`;
    return;
  }
  const c = session.cards.get(id);
  const pos = session.done + 1;
  const total = Math.max(session.total, pos);
  el.innerHTML = `<div class="card fc-card">
      <div class="fc-head muted"><span>${t("cards.progress", { i: pos, n: total })}</span>${c.topic ? `<span>${D.escapeHtml(c.topic)}</span>` : ""}</div>
      <div class="fc-front" dir="auto">${rich(c.front)}</div>
      <div class="fc-backside" dir="auto" hidden>${rich(c.back)}</div>
      <div class="actions fc-show"><button type="button" class="primary" data-act="show">${icon("eye")} ${t("cards.show")}</button></div>
      <div class="actions fc-grade" hidden>
        <button type="button" class="secondary" data-act="again">${icon("rotate-ccw")} ${t("cards.again")}</button>
        <button type="button" class="primary" data-act="know">${icon("check")} ${t("cards.know")}</button>
      </div>
      <p class="muted fc-keys">${t("cards.keys")}</p>
    </div>`;
  session.shown = false;
  el.querySelector(".fc-card").addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "show") reveal();
    else if (act === "again" || act === "know") grade(act === "know");
  });
}

function reveal() {
  const el = $("#fc-review");
  if (!el || !session || session.shown) return;
  session.shown = true;
  el.querySelector(".fc-backside").hidden = false;
  el.querySelector(".fc-show").hidden = true;
  el.querySelector(".fc-grade").hidden = false;
  el.querySelector('[data-act="know"]').focus();
}

async function grade(ok) {
  if (!session?.shown) return;
  const id = session.queue.shift();
  session.shown = false;
  try {
    const r = await D.api(`/api/students/${sid()}/flashcards/${id}/review`, { method: "POST", body: { ok, path: D.getPath?.() || undefined } });
    session.cards.set(id, r.card);
    D.onDue?.(r.due);
  } catch (err) {
    D.toast(err.message);
  }
  // Pozabljena kartica pride v isti seji še enkrat na konec (le enkrat).
  if (!ok && !session.again.has(id)) {
    session.again.add(id);
    session.queue.push(id);
    session.total++;
  }
  session.done++;
  renderReview(null);
}

// Tipke (računalnik): preslednica ali Enter pokaže odgovor, 1 = še ne znam, 2 = znam.
function onKey(e) {
  if (box()?.hidden || !session || !$("#fc-review .fc-card")) return;
  if (e.target.closest?.("textarea, input, select, [contenteditable]")) return;
  if (!session.shown && (e.key === " " || e.key === "Enter") && !e.target.closest?.("button, summary")) {
    e.preventDefault();
    reveal();
  } else if (session.shown && (e.key === "1" || e.key === "2")) {
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
  if (b.dataset.act === "del") {
    if (!confirm(t("cards.deleteConfirm"))) return;
    await D.api(`/api/students/${sid()}/flashcards/${id}`, { method: "DELETE" }).catch((x) => D.toast(x.message));
    return showFlashcards();
  }
  if (b.dataset.act === "edit") {
    const c = session?.cards.get(id);
    if (!c) return;
    li.innerHTML = `<form class="fc-form fc-edit">
      <label>${t("cards.front")}<textarea name="front" rows="2" maxlength="300" required>${D.escapeHtml(c.front)}</textarea></label>
      <label>${t("cards.back")}<textarea name="back" rows="2" maxlength="600" required>${D.escapeHtml(c.back)}</textarea></label>
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
    <ul>${data.cards.map((c) => `<li>${rich(c.front)}</li>`).join("")}</ul>
    <button type="button" class="text-btn">${t("cards.open")} ${icon("chevron-right")}</button>`;
  el.querySelector("button").addEventListener("click", () => D.showView("cards"));
  bubble.appendChild(el);
  D.onDue?.(data.due);
}
