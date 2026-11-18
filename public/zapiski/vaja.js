// Vaja iz testa ali domače naloge, faza 1 (server/vaja-iz-lista.js): fotografije (do 5 strani), PDF ali prilepljeno
// besedilo → učenec preveri prepis → seznam nalog z znanjem (veščino) vsake naloge, ki ga lahko izklopi ali zamenja →
// dolžina 6 / 12 / 20 → nove naloge iz Vadnice v običajni seriji nalog (public/app.js startSession, način »list«:
// namigi, rešen zgled, XP) → povzetek po veščinah in »Še ena vaja« brez ponovnega branja.
// Slika gre na strežnik samo za branje (/zapiski/preberi) in se nikjer ne shrani; PDF z besedilom se prebere na napravi
// (pdf.js), brez modela. Besedilo nalog ostane samo na tem zaslonu.
import { icon } from "../icons.js";
import { t, errText, shrink, nujnoHtml, localNujno } from "./zapiski.js";

const MAX = 5;
const LIB = "/vendor/pdfjs/";
let D = null;
let H = null; // { home, quota }
let V = null; // { pages, photos, sheet, tasks, length, nujno, msg }
let lastLength = 12;

const esc = (s) => D.escapeHtml(String(s ?? ""));
const base = () => `/api/students/${D.getStudent()?.id}/zapiski`;
const box = () => D.box();

export function showVaja(deps, home) {
  D = deps;
  H = home;
  // Serija nalog v app.js: naslov, uvod, povzetek po veščinah in »Še ena vaja« (besedila iz tega slovarja).
  D.addSession?.("list", {
    mode: "list",
    endpoint: "zapiski/vaja/zacni",
    icon: "clipboard-check",
    title: esc(t("vaja.title")),
    intro: esc(t("vaja.sessionIntro")),
    back: "zapiski",
    doneHtml,
    wire,
  });
  V = { pages: [], photos: 0, msg: "" };
  renderStart();
}

// --- začetek ---
function renderStart(msg = "", nujno = null) {
  const el = box();
  const p = H.quota;
  el.innerHTML = `
    <button type="button" class="ghost back zap-back">${icon("arrow-left")}<span>${esc(t("cards.notes"))}</span></button>
    ${nujno ? nujnoHtml(nujno) : ""}
    <h1 class="with-icon">${icon("clipboard-check")} ${esc(t("vaja.title"))}</h1>
    <p class="muted">${esc(t("vaja.intro"))}</p>
    <section class="card zap-add">
      <div class="zap-btns">
        <button type="button" class="primary" data-act="shot">${icon("camera")} ${esc(t("zap.shot"))}</button>
        <button type="button" class="secondary" data-act="gallery">${icon("image")} ${esc(t("zap.gallery"))}</button>
        <button type="button" class="secondary" data-act="pdf">${icon("file-text")} ${esc(t("vaja.pdf"))}</button>
        <button type="button" class="secondary" data-act="paste">${icon("file-text")} ${esc(t("zap.paste"))}</button>
      </div>
      <p class="muted zap-note">${esc(t("vaja.privacy"))} ${esc(t("zap.max"))}</p>
      ${p ? `<p class="muted zap-note">${esc(t("zap.pagesLeft", { left: p.left, limit: p.limit }))}</p>` : ""}
      <input type="file" accept="image/*" capture="environment" data-shot hidden>
      <input type="file" accept="image/*" multiple data-file hidden>
      <input type="file" accept="application/pdf,.pdf" data-pdf hidden>
      <p class="zap-msg" role="alert">${esc(msg)}</p>
    </section>`;
  el.querySelector(".zap-back").addEventListener("click", H.home);
  for (const [act, sel] of [["shot", "[data-shot]"], ["gallery", "[data-file]"], ["pdf", "[data-pdf]"]]) el.querySelector(`[data-act="${act}"]`).addEventListener("click", () => el.querySelector(sel).click());
  el.querySelector('[data-act="paste"]').addEventListener("click", () => {
    V = { pages: [{ text: "", kind: "besedilo" }], photos: 0, msg: "" };
    renderCheck();
  });
  el.querySelector("[data-shot]").addEventListener("change", (e) => readImages([...e.target.files].slice(0, MAX)));
  el.querySelector("[data-file]").addEventListener("change", (e) => readImages([...e.target.files].slice(0, MAX)));
  el.querySelector("[data-pdf]").addEventListener("change", (e) => e.target.files[0] && readPdf(e.target.files[0]));
}

const wait = (text) => (box().innerHTML = `<div class="card zap-wait" aria-live="polite"><p>${icon("scan-text")} ${esc(text)}</p></div>`);

// Fotografije: ena za drugo prek /zapiski/preberi (stran iz meje strani), slika se po branju zavrže.
async function readImages(images, pre = []) {
  if (!images.length && !pre.length) return;
  const pages = [...pre];
  let msg = "";
  let nujno = null;
  for (let i = 0; i < images.length; i++) {
    wait(t("zap.reading", { i: i + 1, n: images.length }));
    try {
      let image = images[i] instanceof Blob ? await shrink(images[i]) : images[i];
      const r = await D.api(`${base()}/preberi`, { method: "POST", body: { image } });
      image = null;
      nujno ||= r.nujno || null;
      if (r.pages) H.quota = r.pages;
      if (r.mock) {
        msg = t("zap.errNoPhoto");
        break;
      }
      if (r.text) pages.push({ text: r.text, kind: "test", photo: true });
      else msg = t("zap.errRead");
    } catch (err) {
      msg = errText(err);
      nujno ||= err?.body?.nujno || null;
      if (err?.body?.code === "zapiski_strani" || err?.status === 429) break;
    }
  }
  if (!pages.length) return renderStart(msg, nujno);
  V = { pages, photos: pages.filter((p) => p.photo).length, msg, nujno };
  renderCheck();
}

// PDF: stran z besedilom se prebere na napravi (brez modela); skenirana stran gre v branje kot fotografija.
async function readPdf(file) {
  wait(t("zap.reading", { i: 1, n: 1 }));
  let doc = null;
  try {
    const lib = await import(`${LIB}legacy/build/pdf.min.mjs`);
    lib.GlobalWorkerOptions.workerSrc = `${LIB}legacy/build/pdf.worker.min.mjs`;
    const data = new Uint8Array(await file.arrayBuffer());
    if (String.fromCharCode(...data.slice(0, 5)) !== "%PDF-") throw new Error("pdf");
    doc = await lib.getDocument({ data, isEvalSupported: false, cMapUrl: `${LIB}cmaps/`, cMapPacked: true, standardFontDataUrl: `${LIB}standard_fonts/`, useWasm: false, wasmUrl: `${LIB}wasm/`, iccUrl: `${LIB}iccs/` }).promise;
    const texts = [];
    const images = [];
    for (let n = 1; n <= Math.min(MAX, doc.numPages); n++) {
      const page = await doc.getPage(n);
      const tc = await page.getTextContent();
      const text = tc.items.map((it) => (it.str || "") + (it.hasEOL ? "\n" : " ")).join("").replace(/[ \t]+\n/g, "\n").trim();
      if (text.replace(/\s+/g, "").length >= 40) {
        texts.push({ text: text.slice(0, 6000), kind: "besedilo" });
        continue;
      }
      const vp = page.getViewport({ scale: 1 });
      const k = Math.min(2, 2000 / Math.max(vp.width, vp.height));
      const c = document.createElement("canvas");
      const v2 = page.getViewport({ scale: k });
      c.width = Math.round(v2.width);
      c.height = Math.round(v2.height);
      await page.render({ canvasContext: c.getContext("2d"), viewport: v2 }).promise;
      images.push(c.toDataURL("image/jpeg", 0.85));
    }
    await doc.destroy();
    await readImages(images, texts);
  } catch {
    doc?.destroy?.();
    renderStart(t("vaja.pdfFail"));
  }
}

// --- preveri prepis ---
function renderCheck() {
  const el = box();
  const paste = V.pages.length === 1 && V.pages[0].kind === "besedilo" && !V.photos && !V.pages[0].text;
  el.innerHTML = `
    <button type="button" class="ghost back zap-back">${icon("arrow-left")}<span>${esc(t("vaja.title"))}</span></button>
    <h1 class="with-icon">${icon("clipboard-check")} ${esc(paste ? t("zap.paste") : t("zap.check"))}</h1>
    ${V.msg ? `<p class="zap-msg" role="alert">${esc(V.msg)}</p>` : ""}
    <form class="zap-check">
      ${V.pages
        .map(
          (p, i) => `<label class="zap-page">${V.pages.length > 1 || !paste ? `<span>${esc(t("zap.page", { i: i + 1 }))}</span>` : ""}
        <textarea name="p${i}" rows="${paste ? 12 : 8}" maxlength="6000" dir="auto" ${paste ? `placeholder="${esc(t("vaja.pastePh"))}"` : ""}>${esc(p.text)}</textarea></label>`,
        )
        .join("")}
      <div class="nujno-slot">${V.nujno ? nujnoHtml(V.nujno) : ""}</div>
      <p class="muted zap-note">${esc(t("vaja.privacy"))}</p>
      <p class="zap-msg" role="alert"></p>
      <div class="actions zap-actions">
        <button type="button" class="secondary" data-cancel>${esc(t("zap.cancel"))}</button>
        <button class="primary">${esc(t("vaja.find"))} ${icon("arrow-right")}</button>
      </div>
    </form>`;
  el.querySelector(".zap-back").addEventListener("click", () => renderStart());
  el.querySelector("[data-cancel]").addEventListener("click", () => renderStart());
  el.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    V.pages = V.pages.map((p, i) => ({ ...p, text: el.querySelector(`[name=p${i}]`).value })).filter((p) => p.text.trim());
    if (V.pages.length) findSkills();
  });
  if (paste) el.querySelector("textarea").focus();
}

async function findSkills() {
  const local = localNujno(V.pages.map((p) => p.text).join("\n\n"));
  const nujno = V.nujno || (local?.vrsta !== "pogovor" ? local : null);
  box().innerHTML = `${nujno ? nujnoHtml(nujno) : ""}<div class="card zap-wait" aria-live="polite"><p>${icon("sparkles")} ${esc(t("vaja.finding"))}</p></div>`;
  try {
    // Fotografije so že plačane z branjem (photos), prilepljeno besedilo in PDF z besedilom štejeta po eno stran.
    const r = await D.api(`${base()}/vaja/naloge`, { method: "POST", body: { pages: V.pages.map(({ text, kind }) => ({ text, kind })), photos: V.photos } });
    if (r.pages) H.quota = r.pages;
    V = { ...V, sheet: r.sheet, nujno: r.nujno || nujno, lengths: r.lengths || [6, 12, 20], tasks: r.tasks.map((x) => ({ ...x, on: !!x.skill, pick: x.skill?.id || "" })) };
    renderList();
  } catch (err) {
    V.nujno = err?.body?.nujno || nujno;
    V.msg = err?.body?.code === "vaja_prazno" ? t("vaja.errEmpty") : errText(err);
    renderCheck();
  }
}

// --- seznam nalog z znanjem ---
function taskRow(x) {
  const id = `vaja-t${x.i}`;
  // Številka naloge z lista (»3.«, »3)«) gre v naslov, sicer bi jo prikaz besedila naredil za oštevilčen seznam.
  const m = /^\s*(\d{1,2})\s*[.)]\s*/.exec(x.text);
  const body = m ? x.text.slice(m[0].length) : x.text;
  const preview = body.length > 220 ? `${body.slice(0, 220)} …` : body;
  const none = !x.options.length;
  return `<li class="card vaja-task${x.on ? "" : " off"}" data-i="${x.i}">
    <div class="vaja-task-head">
      <b>${esc(t("vaja.task", { i: m ? Number(m[1]) : x.i + 1 }))}</b>
      ${none ? "" : `<label class="zap-keep vaja-on"><input type="checkbox" data-on${x.on ? " checked" : ""}${x.pick ? "" : " disabled"}> <span>${esc(t("vaja.use"))}</span></label>`}
    </div>
    <div class="vaja-text muted" dir="auto">${D.renderRich(preview)}</div>
    ${
      none
        ? `<p class="vaja-none">${icon("info")} <span>${esc(t("vaja.none"))}</span></p>`
        : `<label class="vaja-skill" for="${id}"><span>${esc(t("vaja.skill"))}</span>
      <select id="${id}" data-skill dir="auto">${x.pick ? "" : `<option value="">${esc(t("vaja.pick"))}</option>`}${x.options.map((o) => `<option value="${esc(o.id)}"${o.id === x.pick ? " selected" : ""}>${esc(o.name)}${o.year ? ` (${esc(o.year)})` : ""}</option>`).join("")}</select></label>
      ${!x.skill ? `<p class="vaja-none">${icon("info")} <span>${esc(t("vaja.none"))}</span></p>` : !x.sure ? `<p class="vaja-unsure">${icon("circle-help")} <span>${esc(t("vaja.unsure"))}</span></p>` : ""}`
    }
  </li>`;
}

function renderList() {
  const el = box();
  const len = V.lengths.includes(lastLength) ? lastLength : V.lengths[Math.min(1, V.lengths.length - 1)];
  el.innerHTML = `
    <button type="button" class="ghost back zap-back">${icon("arrow-left")}<span>${esc(t("vaja.title"))}</span></button>
    ${V.nujno ? nujnoHtml(V.nujno) : ""}
    <h1 class="with-icon">${icon("list-checks")} ${esc(t("vaja.listTitle"))}</h1>
    <p class="muted">${esc(t("vaja.listHint"))}</p>
    <ol class="vaja-tasks">${V.tasks.map(taskRow).join("")}</ol>
    <fieldset class="card vaja-len"><legend>${esc(t("vaja.length"))}</legend>
      <div class="vaja-len-opts">${V.lengths.map((n) => `<label class="vaja-len-opt"><input type="radio" name="len" value="${n}"${n === len ? " checked" : ""}> <span>${esc(t("vaja.tasks", { n }))}</span></label>`).join("")}</div>
      <p class="muted zap-note">${icon("badge-check")} ${esc(t("vaja.ourTasks"))}</p>
    </fieldset>
    <p class="zap-msg" role="alert"></p>
    <div class="actions zap-actions">
      <button type="button" class="secondary" data-cancel>${esc(t("zap.cancel"))}</button>
      <button type="button" class="primary" data-start>${icon("play")} ${esc(t("vaja.start"))}</button>
    </div>`;
  el.querySelector(".zap-back").addEventListener("click", () => renderStart());
  el.querySelector("[data-cancel]").addEventListener("click", H.home);
  el.querySelector(".vaja-tasks").addEventListener("change", (e) => {
    const li = e.target.closest("[data-i]");
    const x = li && V.tasks.find((y) => y.i === Number(li.dataset.i));
    if (!x) return;
    if (e.target.matches("[data-skill]")) {
      x.pick = e.target.value;
      x.on = !!x.pick;
      const cb = li.querySelector("[data-on]");
      if (cb) (cb.disabled = !x.pick), (cb.checked = x.on);
    }
    if (e.target.matches("[data-on]")) x.on = e.target.checked;
    li.classList.toggle("off", !x.on);
  });
  el.querySelector("[data-start]").addEventListener("click", () => {
    const tasks = V.tasks.filter((x) => x.on && x.pick).map((x) => ({ i: x.i, skill: x.pick }));
    if (!tasks.length) {
      el.querySelector(".zap-msg").textContent = t("vaja.noneOn");
      return;
    }
    lastLength = Number(el.querySelector("[name=len]:checked")?.value) || len;
    D.startSession("list", { sheet: V.sheet, tasks, length: lastLength });
  });
}

// --- povzetek po veščinah (konec serije v app.js) ---
function doneHtml(n) {
  const list = n.list || [];
  const ok = list.filter((k) => k.ok);
  const more = list.filter((k) => !k.ok);
  const group = (items, cls, ic, title) =>
    items.length
      ? `<h3 class="with-icon vaja-sum-h">${icon(ic)} ${esc(title)}</h3><ul class="vaja-sum ${cls}">${items.map((k) => `<li dir="auto">${icon(ic)} <span>${esc(k.name)}</span> <small class="muted">${k.correct}/${k.total}</small></li>`).join("")}</ul>`
      : "";
  const gained = n.listXp;
  return `<div class="card result celebrate vaja-done"><div class="result-icon">${icon("trophy")}</div><h2>${esc(t("vaja.done"))}</h2>
    <p>${esc(t("vaja.score", { correct: n.correct, total: n.total }))}${gained ? ` · <bdi dir="ltr">+${gained} XP</bdi>` : ""}</p>
    ${group(ok, "vaja-ok", "circle-check", t("vaja.ok"))}
    ${group(more, "vaja-more", "repeat", t("vaja.more"))}
    ${more.length ? `<p class="muted">${esc(t("vaja.moreNote"))}</p>` : ""}
    <div class="actions zap-actions">
      <button type="button" class="primary" data-vaja-again>${icon("refresh-cw")} ${esc(t("vaja.again"))}</button>
      <button type="button" class="secondary" id="fb-back">${icon("notebook-pen")} ${esc(t("cards.notes"))}</button>
    </div></div>`;
}
function wire(el, n) {
  el.querySelector("[data-vaja-again]")?.addEventListener("click", () => D.startSession("list", { again: n.sessionId, length: lastLength }));
}
