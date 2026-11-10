// »Moji zapiski« (korak 1): do 5 fotografij ali prilepljeno besedilo → učenec preveri prepis → snov z učne poti
// (brez AI) → kviz iz naših nalog (»Preverjeno«) in kartice iz zapiskov (»Preverjeno« ali »Iz tvojih zapiskov –
// nepreverjeno«), ki gredo v Kartice. Modul, besedila in slog se naložijo šele ob odprtju (public/flashcards.js).
// Fotografija gre na strežnik samo za branje (server/zapiski.js) in se nikjer ne shrani, tudi na napravi ne.
import { t as tg, currentLang, srToLatin } from "../i18n.js";
import { uiChain } from "../i18n/languages.js";
import { icon } from "../icons.js";
import { zaznajNujno, izsiljevanje, stevilke, vrstice, klici, telHref, drzavaNaprave, izoliraj, opomba } from "../nujno.js";
import SL from "./sl.js";

const MAX = 5;
let D = null; // { api, renderRich, escapeHtml, toast, getStudent, box, back }
let dicts = [SL];
let loaded = null;
let S = null; // { mode, pages: [{ text, kind }], photos, result, note }

// Besedila v jeziku vmesnika: prevodi zapiskov, nato skupni (i18n.js), nato ključ.
function t(key, vars = {}) {
  for (const d of dicts) {
    if (d[key] !== undefined) return d[key].replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
  }
  return tg(key, vars);
}
function loadDicts() {
  const lang = currentLang();
  const chain = uiChain(lang);
  const want = chain.slice(0, Math.max(0, chain.indexOf("sl")));
  return Promise.all(
    want.map(async (code) => {
      try {
        const res = await fetch(`/zapiski/i18n/${code === "sr-Latn" ? "sr" : code}.json`);
        if (!res.ok) return null;
        const d = await res.json();
        return code === "sr-Latn" ? Object.fromEntries(Object.entries(d).map(([k, v]) => [k, srToLatin(v)])) : d;
      } catch {
        return null;
      }
    }),
  ).then((ds) => (dicts = [...ds.filter(Boolean), SL]));
}
function loadCss() {
  if (document.querySelector('link[data-zapiski]')) return;
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = "/zapiski/zapiski.css";
  l.dataset.zapiski = "";
  document.head.appendChild(l);
}

const esc = (s) => D.escapeHtml(String(s ?? ""));
const sid = () => D.getStudent()?.id;
const base = () => `/api/students/${sid()}/zapiski`;
const v = () => D.box();
const tag = (ok) =>
  ok
    ? `<span class="zap-tag zap-ok">${icon("badge-check")} ${esc(t("scan.verified"))}</span>`
    : `<span class="zap-tag zap-unchecked">${icon("info")} ${esc(t("cards.notesUnchecked"))}</span>`;
const errText = (err) => {
  const c = err?.body?.code;
  if (c === "zapiski_strani") return t("zap.errPages", { date: new Date(err.body.pages?.renews || Date.now()).toLocaleDateString(currentLang(), { day: "numeric", month: "long" }) });
  if (c === "zapiski_neucno") return t("zap.errUnrelated");
  if (c === "zapiski_snov") return t("zap.errSubject");
  if (c === "zapiski_prazno" || c === "zapiski_ai") return t("zap.errEmpty");
  return err?.message || String(err);
};

export async function showZapiski(deps) {
  D = deps;
  loadCss();
  loaded ||= loadDicts();
  await loaded;
  S = { mode: "home", pages: [], photos: 0 };
  renderHome();
}

// --- začetek: dodaj zapiske, seznam shranjenih ---
async function renderHome(msg = "") {
  const el = v();
  el.innerHTML = `<p class="muted">${esc(t("common.loading"))}</p>`;
  let data = { notes: [], pages: null };
  try {
    data = await D.api(base());
  } catch (err) {
    msg ||= errText(err);
  }
  const p = data.pages;
  el.innerHTML = `
    <button type="button" class="ghost back zap-back">${icon("arrow-left")}<span>${esc(t("zap.back"))}</span></button>
    <h1 class="with-icon">${icon("notebook-pen")} ${esc(t("cards.notes"))}</h1>
    <p class="muted">${esc(t("zap.intro"))}</p>
    <section class="card zap-add">
      <div class="zap-btns">
        <button type="button" class="primary" data-act="shot">${icon("camera")} ${esc(t("zap.shot"))}</button>
        <button type="button" class="secondary" data-act="gallery">${icon("image")} ${esc(t("zap.gallery"))}</button>
        <button type="button" class="secondary" data-act="paste">${icon("file-text")} ${esc(t("zap.paste"))}</button>
      </div>
      <p class="muted zap-note">${esc(t("zap.privacy"))} ${esc(t("zap.max"))}</p>
      ${p ? `<p class="muted zap-note">${esc(t("zap.pagesLeft", { left: p.left, limit: p.limit }))}</p>` : ""}
      <input type="file" accept="image/*" capture="environment" data-shot hidden>
      <input type="file" accept="image/*" multiple data-file hidden>
      <p class="zap-msg" role="alert">${esc(msg)}</p>
    </section>
    <section class="zap-list">
      <h2>${esc(t("zap.list"))}</h2>
      ${data.notes.length ? `<ul>${data.notes.map(noteRow).join("")}</ul>` : `<p class="muted">${esc(t("zap.empty"))}</p>`}
    </section>`;
  el.querySelector(".zap-back").addEventListener("click", D.back);
  el.querySelector('[data-act="shot"]').addEventListener("click", () => el.querySelector("[data-shot]").click());
  el.querySelector('[data-act="gallery"]').addEventListener("click", () => el.querySelector("[data-file]").click());
  el.querySelector('[data-act="paste"]').addEventListener("click", () => {
    S = { mode: "check", pages: [{ text: "", kind: "besedilo" }], photos: 0 };
    renderCheck();
  });
  for (const inp of el.querySelectorAll("input[type=file]")) inp.addEventListener("change", () => readPhotos([...inp.files].slice(0, MAX)));
  el.querySelector(".zap-list").addEventListener("click", onListClick);
}

function noteRow(n) {
  const topics = n.topics.map((x) => x.name).join(", ");
  return `<li class="card zap-row" data-id="${n.id}">
    <div class="zap-row-text"><b dir="auto">${esc(n.title)}</b>
      ${topics ? `<span class="muted" dir="auto">${esc(topics)}</span>` : ""}
      <span class="muted">${esc(t("zap.cards"))}: ${n.cards}</span></div>
    <div class="zap-row-btns">
      <button type="button" class="secondary" data-act="open">${esc(t("zap.open"))}</button>
      <button type="button" class="ghost icon-only" data-act="del" title="${esc(t("zap.delete"))}" aria-label="${esc(t("zap.delete"))}: ${esc(n.title)}">${icon("trash-2")}</button>
    </div></li>`;
}

async function onListClick(e) {
  const b = e.target.closest("[data-act]");
  const row = b?.closest("[data-id]");
  if (!row) return;
  const id = row.dataset.id;
  if (b.dataset.act === "del") {
    const title = row.querySelector("b")?.textContent || "";
    if (!confirm(t("zap.deleteAsk", { title }))) return;
    try {
      await D.api(`${base()}/${id}`, { method: "DELETE" });
      D.toast?.(t("zap.deleted"));
      renderHome();
    } catch (err) {
      D.toast?.(errText(err));
    }
  }
  if (b.dataset.act === "open") {
    try {
      const r = await D.api(`${base()}/${id}`);
      S = { mode: "result", result: { note: r.note, quiz: r.quiz, cards: null } };
      renderResult();
    } catch (err) {
      D.toast?.(errText(err));
    }
  }
}

// --- branje fotografij: ena za drugo, slika se po branju zavrže ---
function shrink(file) {
  return new Promise((ok, fail) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 2000 / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(img.naturalWidth * k));
      c.height = Math.max(1, Math.round(img.naturalHeight * k));
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      ok(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => (URL.revokeObjectURL(url), fail(new Error(t("zap.errRead"))));
    img.src = url;
  });
}

async function readPhotos(files) {
  if (!files.length) return;
  const pages = [];
  let msg = "";
  for (let i = 0; i < files.length; i++) {
    v().innerHTML = `<div class="card zap-wait" aria-live="polite"><p>${icon("scan-text")} ${esc(t("zap.reading", { i: i + 1, n: files.length }))}</p></div>`;
    try {
      let image = await shrink(files[i]);
      const r = await D.api(`${base()}/preberi`, { method: "POST", body: { image } });
      image = null; // slika ostane samo v tem klicu
      if (r.mock) {
        msg = t("zap.errNoPhoto");
        break;
      }
      if (r.text) pages.push({ text: r.text, kind: r.kind });
      else msg = t("zap.errRead");
    } catch (err) {
      msg = errText(err);
      if (err?.body?.code === "zapiski_strani" || err?.status === 429) break;
    }
  }
  if (!pages.length) return renderHome(msg);
  S = { mode: "check", pages, photos: pages.length, msg };
  renderCheck();
}

// --- preveri branje ---
function renderCheck() {
  const el = v();
  const paste = S.pages.length === 1 && S.pages[0].kind === "besedilo" && !S.photos;
  el.innerHTML = `
    <button type="button" class="ghost back zap-back">${icon("arrow-left")}<span>${esc(t("cards.notes"))}</span></button>
    <h1 class="with-icon">${icon("notebook-pen")} ${esc(paste ? t("zap.paste") : t("zap.check"))}</h1>
    ${S.msg ? `<p class="zap-msg" role="alert">${esc(S.msg)}</p>` : ""}
    <form class="zap-check">
      ${S.pages
        .map(
          (p, i) => `<label class="zap-page">${paste ? "" : `<span>${esc(t("zap.page", { i: i + 1 }))}</span>`}
        <textarea name="p${i}" rows="${paste ? 12 : 8}" maxlength="6000" dir="auto" ${paste ? `placeholder="${esc(t("zap.pastePh"))}"` : ""}>${esc(p.text)}</textarea></label>`,
        )
        .join("")}
      <div class="nujno-slot"></div>
      <p class="zap-msg" role="alert"></p>
      <div class="actions zap-actions">
        <button type="button" class="secondary" data-cancel>${esc(t("zap.cancel"))}</button>
        <button class="primary">${esc(t("zap.next"))} ${icon("arrow-right")}</button>
      </div>
    </form>`;
  el.querySelector(".zap-back").addEventListener("click", () => renderHome());
  el.querySelector("[data-cancel]").addEventListener("click", () => renderHome());
  el.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    S.pages = S.pages.map((p, i) => ({ ...p, text: el.querySelector(`[name=p${i}]`).value })).filter((p) => p.text.trim());
    if (S.pages.length) save();
  });
  if (paste) el.querySelector("textarea").focus();
}

// Okno z nujno pomočjo (isti zaznavalnik in iste številke kot v klepetu, public/nujno.js; strošek 0).
function nujnoHtml(n) {
  const st = stevilke(D.getStudent()?.settings, drzavaNaprave());
  const tr = ([k, p]) => t(k, Object.fromEntries(Object.entries(izoliraj(p)).map(([a, x]) => [a, Array.isArray(x) ? t(x[0], x[1]) : x ?? ""])));
  const [head, ...rest] = vrstice(n.vrsta, st, { izsiljevanje: !!n.izs });
  const calls = klici(n.vrsta, st).filter(Boolean);
  return `<section class="msg nujno-card nujno-${n.vrsta}" role="alert">
    <h3>${esc(tr(head))}</h3>${rest.map((x) => `<p>${esc(tr(x))}</p>`).join("")}
    <div class="nujno-klici">${calls.map((c) => `<a class="nujno-klic" href="${telHref(c)}">${icon("phone")} ${esc(t("nujno.klic", izoliraj({ n: c })))}</a>`).join("")}</div>
    <p class="nujno-opomba">${esc(t(opomba(st, false)))}</p></section>`;
}
function localNujno(text) {
  const vrsta = zaznajNujno(text);
  return vrsta ? { vrsta: vrsta === "pogovor" ? "pogovor" : vrsta, izs: izsiljevanje(text) } : null;
}

async function save() {
  const all = S.pages.map((p) => p.text).join("\n\n");
  const nujno = localNujno(all);
  const el = v();
  el.innerHTML = `${nujno && nujno.vrsta !== "pogovor" ? nujnoHtml(nujno) : ""}<div class="card zap-wait" aria-live="polite"><p>${icon("sparkles")} ${esc(t("zap.making"))}</p></div>`;
  try {
    const r = await D.api(base(), { method: "POST", body: { pages: S.pages, photos: S.photos } });
    S = { mode: "result", result: r, nujno: r.nujno || (nujno?.vrsta !== "pogovor" ? nujno : null) };
    renderResult();
  } catch (err) {
    const n = err?.body?.nujno || (nujno?.vrsta !== "pogovor" ? nujno : null);
    S.msg = errText(err);
    renderCheck();
    if (n) v().querySelector(".nujno-slot").innerHTML = nujnoHtml(n);
  }
}

// --- rezultat: snov, kviz, kartice ---
function renderResult() {
  const { note, quiz = [], cards, printed, ai_off: aiOff } = S.result;
  const el = v();
  const rich = (s) => D.renderRich(s);
  const opt = (o, tex) => (tex ? rich(`$${o}$`) : rich(o));
  el.innerHTML = `
    <button type="button" class="ghost back zap-back">${icon("arrow-left")}<span>${esc(t("cards.notes"))}</span></button>
    ${S.nujno ? nujnoHtml(S.nujno) : ""}
    <h1 class="with-icon" dir="auto">${icon("notebook-pen")} ${esc(note.title)}</h1>
    ${note.topics.length ? `<p>${esc(t("zap.topics"))}</p><ul class="zap-topics">${note.topics.map((x) => `<li dir="auto">${icon("book-open")} ${esc(x.name)}</li>`).join("")}</ul>` : `<p class="muted">${esc(t("zap.noTopics"))}</p>`}
    ${printed ? `<p class="muted zap-note">${esc(t("zap.printed"))}</p>` : ""}
    ${quiz.length ? `<section class="zap-quiz"><h2>${icon("list-checks")} ${esc(t("zap.quiz"))} <small class="muted">${quiz.length}</small></h2><p class="muted">${esc(t("zap.quizHint"))}</p>
      <ol>${quiz
        .map(
          (q, i) => `<li class="card zap-q" data-i="${i}"><div class="zap-q-top">${tag(true)}<span class="muted" dir="auto">${esc(q.topic)}</span></div>
          <div class="zap-q-text" dir="auto">${rich(q.text)}</div>
          <div class="zap-opts">${q.options.map((o, j) => `<button type="button" class="secondary zap-opt" data-j="${j}" dir="auto">${opt(o, q.optionsTex)}</button>`).join("")}</div>
          <p class="zap-fb" aria-live="polite"></p></li>`,
        )
        .join("")}</ol><p class="zap-score" aria-live="polite"></p>
      <div class="actions"><button type="button" class="ghost" data-again>${icon("refresh-cw")} ${esc(t("zap.again"))}</button></div></section>` : ""}
    <section class="zap-cards"><h2>${icon("layers")} ${esc(t("zap.cards"))}</h2>${cardsHtml(cards, note, aiOff)}</section>
    ${note.text ? `<details class="card zap-text"><summary>${esc(t("zap.text"))}</summary><div dir="auto">${esc(note.text).replace(/\n/g, "<br>")}</div></details>` : ""}
    <div class="actions zap-actions">
      ${note.cards ? `<button type="button" class="primary" data-practice>${icon("play")} ${esc(t("zap.practice"))}</button>` : ""}
      <button type="button" class="ghost" data-del>${icon("trash-2")} ${esc(t("zap.delete"))}</button>
    </div>`;
  el.querySelector(".zap-back").addEventListener("click", () => renderHome());
  el.querySelector("[data-practice]")?.addEventListener("click", D.back);
  el.querySelector("[data-again]")?.addEventListener("click", async () => {
    try {
      const r = await D.api(`${base()}/${note.id}`);
      S.result = { ...S.result, quiz: r.quiz };
      renderResult();
    } catch (err) {
      D.toast?.(errText(err));
    }
  });
  el.querySelector("[data-del]").addEventListener("click", async () => {
    if (!confirm(t("zap.deleteAsk", { title: note.title }))) return;
    try {
      await D.api(`${base()}/${note.id}`, { method: "DELETE" });
      D.toast?.(t("zap.deleted"));
      renderHome();
    } catch (err) {
      D.toast?.(errText(err));
    }
  });
  const score = { ok: 0, done: 0 };
  el.querySelector(".zap-quiz")?.addEventListener("click", async (e) => {
    const b = e.target.closest(".zap-opt");
    const li = b?.closest(".zap-q");
    if (!li || li.dataset.done) return;
    li.dataset.done = "1";
    const q = quiz[Number(li.dataset.i)];
    const btns = [...li.querySelectorAll(".zap-opt")];
    btns.forEach((x) => (x.disabled = true));
    try {
      const r = await D.api(`${base()}/kviz`, { method: "POST", body: { task: q.id, choice: Number(b.dataset.j) } });
      btns[r.correct]?.classList.add("zap-right");
      if (!r.ok) b.classList.add("zap-bad");
      li.querySelector(".zap-fb").textContent = r.ok ? t("zap.right") : t("zap.wrong");
      score.done++;
      if (r.ok) score.ok++;
      if (score.done === quiz.length) el.querySelector(".zap-score").textContent = t("zap.quizDone", { ok: score.ok, n: quiz.length });
    } catch (err) {
      delete li.dataset.done;
      btns.forEach((x) => (x.disabled = false));
      li.querySelector(".zap-fb").textContent = errText(err);
    }
  });
}

function cardsHtml(cards, note, aiOff) {
  if (aiOff) return `<p class="muted">${esc(t("zap.aiOff"))}</p>`;
  if (cards && !cards.length) return `<p class="muted">${esc(t("zap.noCards"))}</p>`;
  if (!cards) return note.cards ? `<p class="muted">${esc(t("zap.cardsAdded", { title: note.title }))}</p>` : `<p class="muted">${esc(t("zap.noCards"))}</p>`;
  return `<p class="muted">${esc(t("zap.cardsAdded", { title: note.title }))}</p>
    <ul class="zap-card-list">${cards
      .map((c) => `<li class="card"><div class="zap-q-top">${tag(c.checked)}</div><div class="zap-front" dir="auto">${D.renderRich(c.front)}</div><div class="muted" dir="auto">${D.renderRich(c.back)}</div></li>`)
      .join("")}</ul>`;
}
