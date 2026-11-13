// Povratne informacije testerjev: vprašalnik (ocene po področjih + pripombe) ali kratek pogovor
// z inštruktorjem. Na računalniku, kjer teče strežnik, še zbrana mnenja in povzetek.
import { t } from "./i18n.js";
import { icon, hydrateIcons } from "./icons.js";
import { createRenderer } from "./rich.js";
import { renderAdminReports } from "./prijave.js";

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const AREAS = ["path", "tutor", "textbook", "competition", "design", "speed", "league"];
const FACES = ["😞", "🙁", "😐", "🙂", "😄"];
const KEY_HIDDEN = "evklid.feedbackCard"; // "hidden" | "sent"
// Vprašanja pogovora brez AI; »where« je dodatno vprašanje, ko tester opiše težavo.
const SCRIPT = ["used", "liked", "stuck", "where", "change", "use"];
const NOTHING = /^[\s.!-]*(nič|nic|ne vem|nimam|ne|no|none|nothing|nope|-)?[\s.!-]*$/i;

let ctx = null; // { api, getStudent, showView, toast, currentLang }
let cfg = { prompt: false, ai: false, admin: false };
let tab = "form";
let form = { ratings: {}, recommend: null, good: "", bad: "", ideas: "", name: "" };
let chat = null; // { items: [{q, a}], pending: q | null, step, done, sent }

const store = (v) => {
  try {
    if (v === undefined) return localStorage.getItem(KEY_HIDDEN);
    localStorage.setItem(KEY_HIDDEN, v);
  } catch {}
  return null;
};

function device() {
  const w = window.innerWidth;
  const touch = matchMedia("(hover: none) and (pointer: coarse)").matches;
  return { device: w <= 760 ? "phone" : touch && w <= 1240 ? "tablet" : "desktop", screen: `${w}x${window.innerHeight}` };
}

export function initFeedback(opts, config = {}) {
  ctx = opts;
  cfg = { ...cfg, ...(config.feedback || {}) };
  const tabBtn = $("#feedback-tab");
  if (tabBtn) tabBtn.hidden = !(cfg.prompt || cfg.admin);
  renderFeedbackCard();
}

// Kartica na Učni poti: dokler tester ne pošlje mnenja ali je ne skrije.
export function renderFeedbackCard() {
  const box = $("#feedback-card");
  if (!box) return;
  const state = store();
  box.hidden = !cfg.prompt || state === "hidden" || state === "sent";
  if (box.hidden) return;
  box.className = "card fb-card";
  box.innerHTML = `
    <span class="fb-card-ic">${icon("message-square-heart")}</span>
    <div class="fb-card-text"><b>${esc(t("fb.cardTitle"))}</b><p class="muted">${esc(t("fb.cardText"))}</p></div>
    <button type="button" class="ghost icon-only fb-card-x" aria-label="${esc(t("fb.dismiss"))}" title="${esc(t("fb.dismiss"))}">${icon("x")}</button>
    <button type="button" class="primary fb-card-go">${esc(t("fb.cardBtn"))}</button>`;
  box.querySelector(".fb-card-go").onclick = () => ctx.showView("feedback");
  box.querySelector(".fb-card-x").onclick = () => {
    store("hidden");
    box.hidden = true;
  };
}

export function showFeedback() {
  const root = $("#feedback-content");
  if (!root) return;
  if (!form.name) form.name = ctx.getStudent()?.name || "";
  root.innerHTML = `
    <p class="muted fb-intro">${esc(t("fb.intro"))}</p>
    <div class="seg fb-tabs" role="tablist">
      <button type="button" data-tab="form" class="${tab === "form" ? "active" : ""}">${icon("clipboard-check")}${esc(t("fb.tabForm"))}</button>
      <button type="button" data-tab="chat" class="${tab === "chat" ? "active" : ""}">${icon("message-circle")}${esc(t("fb.tabChat"))}</button>
    </div>
    <div class="fb-body"></div>
    <div class="fb-admin"></div>`;
  root.querySelectorAll(".fb-tabs button").forEach((b) =>
    b.addEventListener("click", () => {
      tab = b.dataset.tab;
      showFeedback();
    }),
  );
  const body = root.querySelector(".fb-body");
  if (tab === "form") renderForm(body);
  else renderChat(body);
  if (cfg.admin) renderAdmin(root.querySelector(".fb-admin"));
}

// ---------- vprašalnik ----------

function renderForm(body) {
  if (form.sent) return renderThanks(body, () => {
    form = { ratings: {}, recommend: null, good: "", bad: "", ideas: "", name: form.name };
  });
  const rows = AREAS.map(
    (a) => `<div class="fb-row" data-area="${a}">
      <span class="fb-area">${esc(t(`fb.area.${a}`))}</span>
      <span class="fb-faces">${FACES.map((f, i) => `<button type="button" data-r="${i + 1}" class="${form.ratings[a] === i + 1 ? "on" : ""}" aria-label="${i + 1}/5" aria-pressed="${form.ratings[a] === i + 1}">${f}</button>`).join("")}</span>
    </div>`,
  ).join("");
  const rec = ["yes", "maybe", "no"].map((v) => `<button type="button" data-rec="${v}" class="${form.recommend === v ? "active" : ""}">${esc(t(`fb.${v}`))}</button>`).join("");
  body.innerHTML = `
    <form class="card form fb-form">
      <h2>${esc(t("fb.ratingsTitle"))}</h2>
      <p class="muted fb-hint">${esc(t("fb.ratingsHint"))}</p>
      <div class="fb-table">${rows}</div>
      <label>${esc(t("fb.good"))}<textarea name="good" rows="2">${esc(form.good)}</textarea></label>
      <label>${esc(t("fb.bad"))}<textarea name="bad" rows="3" placeholder="${esc(t("fb.badPh"))}">${esc(form.bad)}</textarea></label>
      <label>${esc(t("fb.ideas"))}<textarea name="ideas" rows="2">${esc(form.ideas)}</textarea></label>
      <div class="fb-rec"><span class="field-label">${esc(t("fb.recommend"))}</span><div class="seg">${rec}</div></div>
      <label>${esc(t("fb.name"))}<input name="name" maxlength="40" value="${esc(form.name)}"></label>
      <p class="form-error" hidden></p>
      <div class="actions"><button type="submit" class="primary">${icon("send")}<span>${esc(t("fb.send"))}</span></button></div>
    </form>`;
  const f = body.querySelector("form");
  f.querySelectorAll(".fb-row").forEach((row) =>
    row.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        const a = row.dataset.area;
        const r = Number(b.dataset.r);
        form.ratings[a] = form.ratings[a] === r ? undefined : r; // ponoven klik izbriše oceno
        row.querySelectorAll("button").forEach((x) => {
          const on = Number(x.dataset.r) === form.ratings[a];
          x.classList.toggle("on", on);
          x.setAttribute("aria-pressed", String(on));
        });
      }),
    ),
  );
  f.querySelectorAll(".fb-rec button").forEach((b) =>
    b.addEventListener("click", () => {
      form.recommend = form.recommend === b.dataset.rec ? null : b.dataset.rec;
      f.querySelectorAll(".fb-rec button").forEach((x) => x.classList.toggle("active", x.dataset.rec === form.recommend));
    }),
  );
  f.addEventListener("input", (e) => {
    if (e.target.name in form) form[e.target.name] = e.target.value;
  });
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = f.querySelector(".form-error");
    const btn = f.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      await send({ kind: "form", ratings: form.ratings, recommend: form.recommend, good: form.good, bad: form.bad, ideas: form.ideas, name: form.name });
      form.sent = true;
      showFeedback();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
      btn.disabled = false;
    }
  });
}

async function send(data) {
  const s = ctx.getStudent();
  await ctx.api(`/api/students/${s.id}/feedback`, { method: "POST", body: { ...data, lang: ctx.currentLang(), ...device() } });
  store("sent");
  renderFeedbackCard();
}

function renderThanks(body, reset) {
  body.innerHTML = `
    <div class="card fb-thanks">
      <span class="fb-thanks-ic">${icon("party-popper")}</span>
      <h2>${esc(t("fb.thanks"))}</h2>
      <p class="muted">${esc(t("fb.thanksText"))}</p>
      <button type="button" class="secondary">${icon("plus")}<span>${esc(t("fb.again"))}</span></button>
    </div>`;
  body.querySelector("button").onclick = () => {
    reset();
    showFeedback();
  };
}

// ---------- pogovor ----------

function newChat() {
  return { items: [], pending: t("fb.q.used"), key: "used", step: 0, done: false, sent: false, busy: false };
}

// Naslednje vprašanje brez AI: »where« samo, če je tester pri »stuck« opisal težavo.
function scriptedNext(c, lastAnswer) {
  let step = c.step + 1;
  if (SCRIPT[step] === "where" && NOTHING.test(lastAnswer)) step++;
  c.step = step;
  c.key = SCRIPT[step] || null;
  return step < SCRIPT.length ? t(`fb.q.${SCRIPT[step]}`) : null;
}

async function nextQuestion(c, lastAnswer) {
  if (cfg.ai) {
    try {
      const s = ctx.getStudent();
      const r = await ctx.api(`/api/students/${s.id}/feedback/interview`, { method: "POST", body: { answers: c.items, lang: ctx.currentLang() } });
      c.step++;
      c.key = null;
      return r.done ? null : r.question;
    } catch {
      cfg.ai = false; // brez povezave z AI nadaljujemo s pripravljenimi vprašanji
    }
  }
  return scriptedNext(c, lastAnswer);
}

function renderChat(body) {
  if (!chat) chat = newChat();
  if (chat.sent) return renderThanks(body, () => (chat = newChat()));
  const bubbles = chat.items.map((x) => `<div class="msg assistant">${esc(x.q)}</div><div class="msg user">${esc(x.a)}</div>`).join("");
  const pending = chat.pending ? `<div class="msg assistant">${esc(chat.pending)}</div>` : "";
  const typing = chat.busy ? `<div class="msg assistant fb-typing"><span></span><span></span><span></span></div>` : "";
  body.innerHTML = `
    <div class="card fb-chat-card">
      <p class="muted fb-hint">${esc(t("fb.chatIntro"))}</p>
      <div class="fb-chat" aria-live="polite">${bubbles}${pending}${typing}</div>
      ${
        chat.done
          ? `<div class="msg assistant fb-done">${esc(t("fb.q.done"))}</div>`
          : `<form class="fb-chat-form">
              <textarea rows="2" placeholder="${esc(t("fb.chatPh"))}" ${chat.busy ? "disabled" : ""}></textarea>
              <button type="submit" class="primary send" aria-label="${esc(t("fb.send"))}" ${chat.busy ? "disabled" : ""}>${icon("send")}</button>
            </form>`
      }
      <p class="form-error" hidden></p>
      <div class="actions">${chat.items.length ? `<button type="button" class="${chat.done ? "primary" : "secondary"} fb-finish">${icon("check")}<span>${esc(t("fb.finish"))}</span></button>` : ""}</div>
    </div>`;
  const list = body.querySelector(".fb-chat");
  list.scrollTop = list.scrollHeight;
  const field = body.querySelector("textarea");
  const formEl = body.querySelector(".fb-chat-form");
  if (field && !chat.busy && chat.items.length) field.focus({ preventScroll: true });
  field?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formEl.requestSubmit();
    }
  });
  formEl?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const a = field.value.trim();
    if (!a || chat.busy) return;
    chat.items.push({ q: chat.pending, a, ...(chat.key ? { k: chat.key } : {}) });
    chat.pending = null;
    chat.busy = true;
    renderChat(body);
    const q = await nextQuestion(chat, a);
    chat.busy = false;
    if (q) chat.pending = q;
    else chat.done = true;
    renderChat(body);
    if (chat.done) finishChat(body);
  });
  body.querySelector(".fb-finish")?.addEventListener("click", () => finishChat(body));
}

async function finishChat(body) {
  if (chat.sent || chat.saving || !chat.items.length) return;
  chat.saving = true;
  try {
    await send({ kind: "interview", interview: chat.items, name: form.name || ctx.getStudent()?.name });
    chat.sent = true;
    renderChat(body);
  } catch (ex) {
    const err = body.querySelector(".form-error");
    if (err) {
      err.textContent = ex.message;
      err.hidden = false;
    }
  } finally {
    chat.saving = false;
  }
}

// ---------- zbrana mnenja (samo na računalniku s strežnikom) ----------

async function renderAdmin(box) {
  let data;
  try {
    data = await ctx.api("/api/feedback");
  } catch {
    return;
  }
  box.innerHTML = `
    <div class="card fb-admin-card">
      <h2>${icon("users")} ${esc(t("fb.adminTitle"))}</h2>
      <p class="muted">${esc(t("fb.adminNote"))} ${esc(t("fb.adminCount", { n: data.count }))}</p>
      ${data.file ? `<p class="muted fb-file"><code>${esc(data.file)}</code></p>` : ""}
      <div class="actions">
        <a class="btn-secondary" href="/api/feedback/export?format=md" download>${icon("download")}<span>${esc(t("fb.downloadSummary"))}</span></a>
        <a class="btn-secondary" href="/api/feedback/export?format=json" download>${icon("download")}<span>${esc(t("fb.download"))}</span></a>
      </div>
      ${data.count || data.wishes ? `<div class="fb-summary">${window.DOMPurify && window.marked ? createRenderer().renderRich(data.summary) : `<pre>${esc(data.summary)}</pre>`}</div>` : ""}
    </div>
    <div class="card"><h2>${icon("flag")} ${esc(t("adm.rep.title"))}</h2><div class="fb-reports"></div></div>`;
  hydrateIcons(box);
  // Prijave napak (lekcije, odgovori inštruktorja, skrbnik) tudi na računalniku s strežnikom brez računov.
  renderAdminReports(box.querySelector(".fb-reports"), { api: ctx.api, toast: ctx.toast });
}
