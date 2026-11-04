// Kotiček zanimanj: novice iz znanosti o temah, ki jih je učenec izbral, pripete novice,
// celozaslonski pogled (časopis ali oglasna deska) in kratek vprašalnik ob prvem zagonu.
// Novice da strežnik (server/corner.js), seznam področij je v public/interests.js.
import { t, locale, currentLang } from "./i18n.js";
import { icon } from "./icons.js";
import { jeOs } from "./stopnja.js";
import { INTERESTS, MAX_INTERESTS } from "./interests.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const $ = (s, root = document) => root.querySelector(s);
const MODE_KEY = "evklid.cornerBoard";

let ctx = null; // { api, getStudent, setStudent, toast, askTutor }
let data = null; // { items, pinned, failed, sources, level }
let filter = "all"; // all | pinned | <id področja> | custom
let loadingFor = null;
let board = null; // odprt celozaslonski pogled

export function initCorner(c) {
  ctx = c;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && board && !document.querySelector(".iq-wrap")) closeBoard();
  });
  document.addEventListener("fullscreenchange", () => {
    // Uporabnik je zaprl celozaslonski način brskalnika (Esc): zapremo tudi oglasno desko.
    if (board?.ownFullscreen && !document.fullscreenElement) closeBoard({ keepFullscreen: true });
  });
}

const student = () => ctx.getStudent();
const interestName = (id) => (id === "custom" ? student().settings.interest_custom || t("corner.custom") : t(`int.${id}`));
const emoji = (id) => (id === "custom" ? "⭐" : INTERESTS.find((i) => i.id === id)?.emoji || "•");
const pinnedIds = () => new Set((data?.pinned || []).map((p) => p.id));
const when = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(locale(), { day: "numeric", month: "short" });
  } catch {
    return "";
  }
};

// ---------------------------------------------------------------------------
// Pogled »Kotiček«

export async function showCorner() {
  const box = $("#corner-content");
  if (!box || !student()) return;
  const id = student().id;
  if (!data || data.studentId !== id) {
    data = null;
    box.innerHTML = `<p class="muted">${t("common.loading")}</p>`;
  } else render();
  await load(id);
}

async function load(id) {
  if (loadingFor === id) return;
  loadingFor = id;
  try {
    const r = await ctx.api(`/api/students/${id}/corner`);
    if (student()?.id !== id) return;
    data = { ...r, studentId: id };
    render();
    if (board) renderBoard();
  } catch (err) {
    const box = $("#corner-content");
    if (box && !data) box.innerHTML = `<div class="card"><p>${esc(err.message)}</p></div>`;
  } finally {
    loadingFor = null;
  }
}

function visibleItems() {
  if (!data) return [];
  if (filter === "pinned") return data.pinned;
  if (filter === "all") return data.items;
  return data.items.filter((it) => it.interest === filter);
}

function chips() {
  const s = student().settings;
  const ids = [...(s.interests || [])];
  if (s.interest_custom) ids.push("custom");
  if (filter !== "all" && filter !== "pinned" && !ids.includes(filter)) filter = "all";
  const btn = (key, label) => `<button type="button" data-filter="${key}" class="${filter === key ? "active" : ""}">${label}</button>`;
  return `<div class="chip-row corner-chips">
    ${btn("all", esc(t("corner.all")))}
    ${btn("pinned", `${icon("pin")}${esc(t("corner.pinned"))}${data?.pinned?.length ? ` <b>${data.pinned.length}</b>` : ""}`)}
    ${ids.map((id) => btn(id, `<span aria-hidden="true">${emoji(id)}</span> ${esc(interestName(id))}`)).join("")}
  </div>`;
}

function newsCard(it, pins, cls = "") {
  const pinned = pins.has(it.id);
  const lang = it.lang && it.lang !== currentLang() ? `<span class="news-lang" title="${esc(it.lang)}">${esc(it.lang.toUpperCase())}</span>` : "";
  return `<article class="news-card ${cls} ${pinned ? "is-pinned" : ""}" data-id="${esc(it.id)}">
    <div class="news-meta"><span class="news-int"><span aria-hidden="true">${emoji(it.interest)}</span> ${esc(interestName(it.interest))}</span><span class="news-src">${esc(it.source)}${it.date ? ` · ${esc(when(it.date))}` : ""}</span>${lang}</div>
    <h3><a href="${esc(it.link)}" target="_blank" rel="noopener noreferrer">${esc(it.title)}</a></h3>
    ${it.summary ? `<p class="news-sum">${esc(it.summary)}</p>` : ""}
    <div class="news-actions">
      <button type="button" class="${pinned ? "primary" : "secondary"} small" data-pin="${esc(it.id)}" aria-pressed="${pinned}">${icon(pinned ? "pin-off" : "pin")}${esc(t(pinned ? "corner.unpin" : "corner.pin"))}</button>
      <button type="button" class="ghost small" data-explain="${esc(it.id)}">${icon("message-circle")}${esc(t("corner.explain"))}</button>
      <a class="text-btn small" href="${esc(it.link)}" target="_blank" rel="noopener noreferrer">${esc(t("corner.read"))} ${icon("external-link")}</a>
    </div>
  </article>`;
}

function emptyText() {
  if (filter === "pinned") return t("corner.noPins");
  return t("corner.none");
}

// Ko ni novic (ali še ni izbranih področij): področja, ki jih učenec še nima, kot ploščice; klik ga doda
// (j, 4. 11. 2026: prazen prostor strani naj bo izkoriščen z nečim uporabnim).
function moreHtml(s) {
  const have = new Set(s.interests || []);
  const rest = INTERESTS.filter((i) => !have.has(i.id));
  if (!rest.length || have.size >= MAX_INTERESTS) return "";
  return `<section class="corner-more"><h2>${esc(t("corner.more"))}</h2><div class="corner-tiles">${rest
    .map((i) => `<button type="button" class="card corner-tile" data-add-int="${esc(i.id)}"><span class="ct-emoji" aria-hidden="true">${i.emoji}</span><span>${esc(t(`int.${i.id}`))}</span>${icon("plus")}</button>`)
    .join("")}</div></section>`;
}

async function addInterest(id) {
  const s = student().settings;
  const interests = [...new Set([...(s.interests || []), id])].slice(0, MAX_INTERESTS);
  try {
    const updated = await ctx.api(`/api/students/${student().id}`, { method: "PUT", body: { settings: { interests } } });
    ctx.setStudent(updated);
    ctx.toast?.(t("iq.saved"));
    filter = id;
    showCorner();
  } catch (err) {
    ctx.toast?.(err.message);
  }
}

function render() {
  const box = $("#corner-content");
  if (!box || !data) return;
  const s = student().settings;
  const chosen = (s.interests || []).length || s.interest_custom;
  const head = `<div class="corner-head">
      <div><h1>${esc(t("corner.title"))}</h1><p class="muted">${esc(t("corner.intro"))}</p></div>
      <div class="corner-tools">
        ${chosen ? `<button type="button" class="primary" data-board>${icon("maximize")}${esc(t("corner.board"))}</button>` : ""}
        <button type="button" class="secondary" data-edit>${icon("pencil")}${esc(t("corner.edit"))}</button>
      </div>
    </div>`;
  if (!chosen) {
    box.innerHTML = `${head}<div class="card corner-empty"><div class="corner-empty-art" aria-hidden="true">🔭🧪🦕🚀</div><p>${esc(t("corner.empty"))}</p><button type="button" class="primary" data-edit>${icon("sparkles")}${esc(t("corner.choose"))}</button></div>${moreHtml(s)}`;
    return;
  }
  const items = visibleItems();
  const pins = pinnedIds();
  const sources = [...new Set(data.items.map((i) => i.source))];
  box.innerHTML = `${head}${chips()}
    ${data.failed && !items.length ? `<p class="corner-note">${icon("wifi-off")}${esc(t("corner.offline"))}</p>` : ""}
    ${items.length ? `<div class="corner-list">${items.map((it) => newsCard(it, pins, "card")).join("")}</div>` : `<div class="card corner-empty"><p>${esc(emptyText())}</p></div>${filter === "pinned" ? "" : moreHtml(s)}`}
    ${sources.length ? `<p class="muted small corner-sources">${esc(t("corner.sources", { list: sources.join(", ") }))}</p>` : ""}`;
}

// Klik kjerkoli v kotičku ali na oglasni deski.
document.addEventListener("click", async (e) => {
  const root = e.target.closest("#view-corner, #corner-board");
  if (!root) return;
  const f = e.target.closest("[data-filter]");
  if (f) {
    filter = f.dataset.filter;
    render();
    if (board) renderBoard();
    return;
  }
  if (e.target.closest("[data-edit]")) {
    if (board) closeBoard();
    if (await askInterests()) showCorner();
    return;
  }
  const add = e.target.closest("[data-add-int]");
  if (add) return addInterest(add.dataset.addInt);
  if (e.target.closest("[data-board]")) return openBoard();
  if (e.target.closest("[data-board-close]")) return closeBoard();
  const mode = e.target.closest("[data-mode]");
  if (mode) {
    try {
      localStorage.setItem(MODE_KEY, mode.dataset.mode);
    } catch {}
    return renderBoard();
  }
  const pin = e.target.closest("[data-pin]");
  if (pin) return togglePin(pin.dataset.pin, pin);
  const ex = e.target.closest("[data-explain]");
  if (ex) {
    const it = [...(data?.items || []), ...(data?.pinned || [])].find((x) => x.id === ex.dataset.explain);
    if (!it) return;
    if (board) closeBoard();
    ctx.askTutor(t("corner.askText", { title: it.title, source: it.source, summary: it.summary || "" }).trim());
  }
});

async function togglePin(id, btn) {
  const s = student();
  const on = pinnedIds().has(id);
  btn.disabled = true;
  try {
    const r = on
      ? await ctx.api(`/api/students/${s.id}/corner/pins/${encodeURIComponent(id)}`, { method: "DELETE" })
      : await ctx.api(`/api/students/${s.id}/corner/pins`, { method: "POST", body: { id } });
    data.pinned = r.pinned;
    if (!on) ctx.toast?.(t("corner.pinnedToast"));
    render();
    if (board) renderBoard();
  } catch (err) {
    ctx.toast?.(err.message);
    btn.disabled = false;
  }
}

// ---------------------------------------------------------------------------
// Celozaslonski pogled: časopis ali oglasna deska čez cel zaslon.

const boardMode = () => {
  try {
    return localStorage.getItem(MODE_KEY) === "board" ? "board" : "paper";
  } catch {
    return "paper";
  }
};

export function openBoard() {
  if (board) return;
  const el = document.createElement("div");
  el.id = "corner-board";
  el.className = "corner-board";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", t("corner.board"));
  document.body.appendChild(el);
  document.body.classList.add("corner-board-open");
  board = { el, ownFullscreen: false, prevFocus: document.activeElement };
  // Celozaslonski način brskalnika (če ga aplikacija še nima): skrije tudi vrstico brskalnika.
  const root = document.documentElement;
  if (!document.fullscreenElement && root.requestFullscreen) {
    root.requestFullscreen({ navigationUI: "hide" }).then(() => board && (board.ownFullscreen = true)).catch(() => {});
  }
  renderBoard();
  $("[data-board-close]", el)?.focus();
}

export function closeBoard({ keepFullscreen = false } = {}) {
  if (!board) return;
  const { el, ownFullscreen, prevFocus } = board;
  board = null;
  el.remove();
  document.body.classList.remove("corner-board-open");
  if (ownFullscreen && !keepFullscreen && document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  prevFocus?.focus?.();
}

export const boardOpen = () => !!board;
// Tipka Nazaj: najprej zapre oglasno desko.
export function cornerBack() {
  if (!board) return false;
  closeBoard();
  return true;
}

function renderBoard() {
  if (!board) return;
  const mode = boardMode();
  const items = visibleItems();
  const pins = pinnedIds();
  // Na oglasni deski so pripete novice na vrhu.
  const list = mode === "board" && filter !== "pinned" ? [...items.filter((i) => pins.has(i.id)), ...items.filter((i) => !pins.has(i.id))] : items;
  const d = new Date().toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const today = d.charAt(0).toLocaleUpperCase(locale()) + d.slice(1);
  board.el.className = `corner-board mode-${mode}`;
  board.el.innerHTML = `
    <header class="cb-top">
      <div class="cb-mast"><b>${esc(t("corner.masthead"))}</b><small>${esc(today)}</small></div>
      <div class="seg cb-modes" role="group">
        <button type="button" data-mode="paper" class="${mode === "paper" ? "active" : ""}">${icon("newspaper")}${esc(t("corner.paper"))}</button>
        <button type="button" data-mode="board" class="${mode === "board" ? "active" : ""}">${icon("pin")}${esc(t("corner.board"))}</button>
      </div>
      <button type="button" class="ghost cb-close" data-board-close aria-label="${esc(t("corner.close"))}">${icon("x")}<span>${esc(t("corner.close"))}</span></button>
    </header>
    <div class="cb-chips">${chips()}</div>
    <div class="cb-scroll">
      ${list.length ? `<div class="cb-grid">${list.map((it, i) => newsCard(it, pins, i === 0 && mode === "paper" ? "lead" : "")).join("")}</div>` : `<p class="cb-empty">${esc(emptyText())}</p>`}
    </div>`;
  // Listki na deski so rahlo nagnjeni (vedno enako za isto novico).
  board.el.querySelectorAll(".mode-board .news-card").forEach((c) => {
    const h = [...c.dataset.id].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) % 997, 7);
    c.style.setProperty("--tilt", `${((h % 5) - 2) * 0.6}deg`);
  });
}

// ---------------------------------------------------------------------------
// Vprašalnik: kaj te zanima, kako podrobne novice, lastna tema (in angleščina).
// Vrne true, če je učenec shranil izbiro.

export function askInterests({ first = false } = {}) {
  const s = student().settings;
  const pick = new Set(s.interests || []);
  let level = s.news_level === "simple" || s.news_level === "all" ? s.news_level : jeOs(s) ? "simple" : "all";
  let custom = s.interest_custom || "";
  let english = s.news_lang !== "mine";
  const askEnglish = !currentLang().startsWith("en");
  let step = 0;
  const total = 3;

  const dlg = document.createElement("div");
  dlg.className = "iq-wrap";
  dlg.innerHTML = `<div class="iq card" role="dialog" aria-modal="true" aria-labelledby="iq-title"></div>`;
  document.body.appendChild(dlg);
  const box = $(".iq", dlg);

  return new Promise((resolve) => {
    const finish = async (save) => {
      const settings = save
        ? { interests: [...pick], interest_custom: custom.trim(), news_level: level, news_lang: english ? "all" : "mine" }
        : { interests: s.interests || [] }; // preskoči: vprašalnika ne kažemo znova (v kotičku in Nastavitvah ga lahko odpre)
      try {
        const updated = await ctx.api(`/api/students/${student().id}`, { method: "PUT", body: { settings } });
        ctx.setStudent(updated);
        if (save) ctx.toast?.(t("iq.saved"));
      } catch (err) {
        if (save) {
          ctx.toast?.(err.message);
          return;
        }
      }
      dlg.remove();
      data = null;
      resolve(save);
    };

    const draw = () => {
      const dots = `<p class="iq-step muted">${esc(t("iq.step", { n: step + 1, total }))}</p>`;
      let body = "";
      if (step === 0) {
        body = `<h2 id="iq-title">${esc(t("iq.q1"))}</h2>
          <p class="muted">${esc(t("iq.q1sub", { n: MAX_INTERESTS }))}</p>
          <div class="iq-grid">${INTERESTS.map(
            (i) => `<button type="button" class="iq-opt ${pick.has(i.id) ? "on" : ""}" data-int="${i.id}" aria-pressed="${pick.has(i.id)}"><span class="iq-emoji" aria-hidden="true">${i.emoji}</span><span>${esc(t(`int.${i.id}`))}</span></button>`,
          ).join("")}</div>
          <p class="form-error iq-max" hidden>${esc(t("iq.max", { n: MAX_INTERESTS }))}</p>`;
      } else if (step === 1) {
        const opt = (v, ic, title, sub) =>
          `<button type="button" class="iq-level ${level === v ? "on" : ""}" data-level="${v}" aria-pressed="${level === v}"><span class="iq-emoji" aria-hidden="true">${ic}</span><span><b>${esc(t(title))}</b><small>${esc(t(sub))}</small></span></button>`;
        body = `<h2 id="iq-title">${esc(t("iq.q2"))}</h2>
          <div class="iq-levels">${opt("simple", "🔍", "iq.simple", "iq.simpleSub")}${opt("all", "🔬", "iq.deep", "iq.deepSub")}</div>`;
      } else {
        body = `<h2 id="iq-title">${esc(t("iq.q3"))}</h2>
          <label class="iq-custom"><input type="text" maxlength="40" value="${esc(custom)}" placeholder="${esc(t("iq.customPh"))}"></label>
          <p class="muted small">${esc(t("iq.customHint"))}</p>
          ${askEnglish ? `<label class="check"><input type="checkbox" class="iq-en" ${english ? "checked" : ""}> <span>${esc(t("iq.english"))}</span></label>` : ""}`;
      }
      const left = step === 0 ? (first ? `<button type="button" class="ghost" data-iq="skip">${esc(t("iq.skip"))}</button>` : `<button type="button" class="ghost" data-iq="cancel">${esc(t("corner.close"))}</button>`) : `<button type="button" class="ghost" data-iq="back">${icon("arrow-left")}${esc(t("iq.back"))}</button>`;
      const right = step < total - 1 ? `<button type="button" class="primary" data-iq="next">${esc(t("iq.next"))}${icon("arrow-right")}</button>` : `<button type="button" class="primary" data-iq="save">${icon("check")}${esc(t("common.save"))}</button>`;
      box.innerHTML = `${dots}${body}<div class="iq-actions">${left}${right}</div>`;
      $(".iq-custom input", box)?.addEventListener("input", (e) => (custom = e.target.value));
      $(".iq-en", box)?.addEventListener("change", (e) => (english = e.target.checked));
      ($(".iq-custom input", box) || $("[data-iq=next], [data-iq=save]", box))?.focus({ preventScroll: true });
    };

    box.addEventListener("click", (e) => {
      const o = e.target.closest("[data-int]");
      if (o) {
        const id = o.dataset.int;
        if (pick.has(id)) pick.delete(id);
        else if (pick.size >= MAX_INTERESTS) return void ($(".iq-max", box).hidden = false);
        else pick.add(id);
        o.classList.toggle("on", pick.has(id));
        o.setAttribute("aria-pressed", pick.has(id));
        $(".iq-max", box).hidden = true;
        return;
      }
      const l = e.target.closest("[data-level]");
      if (l) {
        level = l.dataset.level;
        return draw();
      }
      const a = e.target.closest("[data-iq]")?.dataset.iq;
      if (a === "next") (step++, draw());
      else if (a === "back") (step--, draw());
      else if (a === "save") finish(true);
      else if (a === "skip") finish(false);
      else if (a === "cancel") (dlg.remove(), resolve(false));
    });
    dlg.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !first) (dlg.remove(), resolve(false));
      if (e.key === "Enter" && e.target.matches(".iq-custom input")) finish(true);
    });
    draw();
  });
}

// Ob zagonu: profil, ki vprašalnika še ni videl (zanimanja null), ga dobi enkrat.
export function maybeAskInterests() {
  const s = student();
  if (!s || s.settings.interests !== null || document.querySelector(".iq-wrap")) return Promise.resolve(false);
  return askInterests({ first: true });
}

// Kratek opis za Nastavitve.
export function interestsSummary(settings) {
  const names = (settings.interests || []).map((id) => `${emoji(id)} ${t(`int.${id}`)}`);
  if (settings.interest_custom) names.push(`⭐ ${settings.interest_custom}`);
  return names.join(" · ");
}
