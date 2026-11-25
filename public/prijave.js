// Prijave napak (server/reports.js): »Prijavi napako« v lekciji, skrbnikova prijava iz klepeta in seznam
// prijav za skrbnika (Račun → Prijave napak). Okvir prijave ima isti videz kot prijava pod odgovorom
// inštruktorja (style.css .report-box).
import { icon, hydrateIcons } from "./icons.js";
import { t } from "./i18n-osnova.js";
import { createRenderer, naloziKnjiznice } from "./rich.js";

// Naprava ob prijavi (kot pri mnenjih, feedback.js): telefon / tablica / računalnik in velikost zaslona.
export function deviceInfo() {
  const w = window.innerWidth;
  const touch = matchMedia("(hover: none) and (pointer: coarse)").matches;
  return { device: `web-${w <= 760 ? "phone" : touch && w <= 1240 ? "tablet" : "desktop"}`, screen: `${w}x${window.innerHeight}` };
}

/** Izrisan HTML sporočila, kot ga vidi učenec (brez gumbov, noge in okvirja prijave), za prijavo napake. */
export function shownHtml(el) {
  const c = el.cloneNode(true);
  // .katex-mathml je skrit (za bralnike zaslona) in polovica velikosti; skrbnik ga ne vidi.
  c.querySelectorAll(".msg-foot, .report-box, button, .cards-note, .katex-mathml").forEach((x) => x.remove());
  const html = c.innerHTML.trim();
  return html.length <= 200000 ? html : undefined;
}

// HTML posnetka pošlje učenec, zato pri skrbniku le oblikovanje besedila in formul: brez slik, povezav,
// obrazcev, <style>, id-jev in slogov, ki bi kaj prekrili ali naložili (position, url()).
const SHOWN_FORBID = ["style", "img", "a", "form", "input", "textarea", "select", "button", "iframe", "video", "audio", "link", "image", "use", "foreignObject"];
export function safeShown(html) {
  const frag = window.DOMPurify.sanitize(html, { FORBID_TAGS: SHOWN_FORBID, FORBID_ATTR: ["id", "name", "href", "xlink:href", "src", "srcset", "action"], RETURN_DOM_FRAGMENT: true });
  for (const el of frag.querySelectorAll("[style]")) if (/position|url\s*\(|@import|expression/i.test(el.getAttribute("style"))) el.removeAttribute("style");
  const box = document.createElement("div");
  box.append(frag);
  return box.innerHTML;
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/**
 * Okvir s prijavo: vprašanje, razlogi (neobvezno), opomba, Pošlji / Prekliči.
 * onSend({ reason, note }) vrne obljubo; ob napaki ostane okvir odprt s sporočilom.
 */
export function reportBox({ ask, reasons = [], notePh, needNote = false, needNoteMsg = null, sendLabel = t("rep.send"), onSend, onClose }) {
  const box = document.createElement("div");
  box.className = "report-box";
  box.setAttribute("role", "group");
  box.setAttribute("aria-label", ask);
  box.innerHTML = `<p></p>${reasons.length ? '<div class="rep-reasons"></div>' : ""}<textarea maxlength="${needNote ? 2000 : 500}" rows="${needNote ? 3 : 2}"></textarea>
    <p class="rep-err" role="alert" hidden></p>
    <div class="rep-actions"><button type="button" class="primary small rep-send"></button><button type="button" class="ghost rep-cancel"></button></div>`;
  box.querySelector("p").textContent = ask;
  const area = box.querySelector("textarea");
  area.placeholder = notePh;
  area.setAttribute("aria-label", notePh);
  const err = box.querySelector(".rep-err");
  const sendBtn = box.querySelector(".rep-send");
  area.addEventListener("input", () => (err.hidden = true));
  let reason = null;
  for (const [key, label] of reasons) {
    const rb = document.createElement("button");
    rb.type = "button";
    rb.className = "secondary small";
    rb.setAttribute("aria-pressed", "false");
    rb.textContent = label;
    rb.addEventListener("click", () => {
      reason = key;
      box.querySelectorAll(".rep-reasons button").forEach((x) => x.setAttribute("aria-pressed", String(x === rb)));
      err.hidden = true;
    });
    box.querySelector(".rep-reasons").append(rb);
  }
  const close = () => {
    box.remove();
    onClose?.();
  };
  sendBtn.textContent = sendLabel;
  box.querySelector(".rep-cancel").textContent = t("rep.cancel");
  box.querySelector(".rep-cancel").addEventListener("click", close);
  box.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  });
  sendBtn.addEventListener("click", async () => {
    const note = area.value.trim();
    if (reasons.length && !reason) {
      err.textContent = t("rep.pick");
      err.hidden = false;
      return;
    }
    if (needNote && !note) {
      err.textContent = needNoteMsg || t("bug.needNote");
      err.hidden = false;
      area.focus();
      return;
    }
    sendBtn.disabled = true;
    try {
      await onSend({ reason, note });
      box.remove();
    } catch (e) {
      err.textContent = e.message;
      err.hidden = false;
      sendBtn.disabled = false;
    }
  });
  box.focusFirst = () => (box.querySelector(".rep-reasons button") || area).focus();
  return box;
}

const LESSON_REASONS = ["wrong", "unclear", "broken", "other"];
const lessonReason = (r) => t(r === "other" ? "rep.other" : `lrep.${r}`);

/**
 * Gumb »Prijavi napako« v lekciji. Okvir se odpre pod orodno vrstico lekcije; pošlje lekcijo, korak
 * (pri prikazu po korakih) in napravo.
 */
export function wireLessonReport(btn, { api, studentId, topic, step, toast }) {
  btn.addEventListener("click", () => {
    const host = btn.closest(".tb-tools");
    if (host.nextElementSibling?.classList.contains("report-box")) return host.nextElementSibling.focusFirst();
    btn.setAttribute("aria-expanded", "true");
    const box = reportBox({
      ask: t("rep.ask"),
      reasons: LESSON_REASONS.map((r) => [r, lessonReason(r)]),
      notePh: t("lrep.notePh"),
      onSend: async ({ reason, note }) => {
        await api(`/api/students/${studentId}/lesson-report`, { method: "POST", body: { topic, reason, note, step: step(), ...deviceInfo() } });
        btn.setAttribute("aria-expanded", "false");
        btn.querySelector("span").textContent = t("rep.done");
        btn.disabled = true;
        toast(t("lrep.thanks"), "check");
      },
      onClose: () => {
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      },
    });
    host.after(box);
    box.focusFirst();
  });
}

/**
 * Skrbnik v klepetu: opis napake, zraven gredo zadnja sporočila pogovora. feature: zahteva za novo funkcijo
 * (žarnica v glavi klepeta, samo skrbnik; server/reports.js kind = feature).
 */
export function openAdminBug(anchor, { api, studentId, conversationId, view, toast, onClose, thanks = null, ask = null, feature = false }) {
  const k = feature ? "idea" : "bug";
  const box = reportBox({
    ask: ask || t(`${k}.ask`),
    notePh: t(`${k}.notePh`),
    needNote: true,
    needNoteMsg: t(`${k}.needNote`),
    ...(feature ? { sendLabel: t("chat.send") } : {}),
    onSend: async ({ note }) => {
      await api(`/api/students/${studentId}/bug`, { method: "POST", body: { note, conversation_id: (typeof conversationId === "function" ? conversationId() : conversationId) || undefined, view, ...(feature ? { kind: "feature" } : {}), ...deviceInfo() } });
      toast(thanks || t(`${k}.thanks`), "check");
      onClose?.();
    },
    onClose,
  });
  box.classList.add("bug-box");
  box.dataset.kind = k;
  anchor.after(box);
  box.focusFirst();
  return box;
}

// ---------- seznam prijav za skrbnika ----------

const KIND_ICON = { message: "message-circle", lesson: "book-open", app: "flag", feature: "lightbulb" };

function reportTitle(r) {
  if (r.kind === "message") return `${t("adm.rep.message")} ${r.code}`;
  if (r.kind === "lesson") return `${t("adm.rep.lesson")}: ${r.topic_name || r.topic_id}${r.step ? ` · ${t("adm.rep.step", { n: r.step })}` : ""}`;
  return t(r.kind === "feature" ? "adm.rep.feature" : "adm.rep.app");
}
function reasonText(r) {
  if (r.kind === "app" || r.kind === "feature") return "";
  return r.kind === "lesson" ? lessonReason(r.reason) : t(`rep.${r.reason}`);
}

// Odgovor, kot ga je videl učenec: izrisan HTML s spleta (očiščen) ali, pri prijavah iz aplikacije in starejših
// prijavah, besedilo znova izrisano z istim izrisovalnikom kot v klepetu.
let rich = null;
let annotateTex = null; // formula-info.js: naloži renderAdminReports (ni del prvega izrisa)
function shownBlock(r) {
  if (r.kind !== "message" || !(r.shown || r.answer)) return "";
  let html = "";
  let label = t("adm.rep.shown");
  try {
    if (r.shown) html = safeShown(r.shown);
    else {
      rich ||= createRenderer({ annotate: (tex, o) => (annotateTex ? annotateTex(tex, undefined, o) : tex) });
      html = rich.renderRich(r.answer);
      label = t("adm.rep.rerendered");
    }
  } catch {
    return "";
  }
  // Širina kot pri učencu (zaslon iz naprave, manj robov), da se prelomi in odrezane formule ponovijo.
  const w = Number(/(\d+)x\d+/.exec(r.device || "")?.[1]);
  const width = w >= 240 && w < 760 ? ` style="max-width: min(100%, ${w - 48}px)"` : "";
  return `<div class="adm-rep-shown"><small class="muted">${esc(label)}</small><div class="msg assistant"${width}>${html}</div></div>`;
}

/** Izriše prijave v box (Račun skrbnika ali stran z mnenji na računalniku s strežnikom). */
export async function renderAdminReports(box, { api, toast, showAll = false }) {
  let data;
  try {
    // Knjižnice in oznake formul (rich.js, formula-info.js) za izris odgovorov niso del prvega izrisa aplikacije.
    const [fx] = await Promise.all([import("./formula-info.js"), naloziKnjiznice()]);
    annotateTex = fx.annotateTex;
    data = await api(`/api/admin/reports${showAll ? "?status=all" : ""}`);
  } catch (e) {
    box.innerHTML = `<p class="muted">${esc(e.message)}</p>`;
    return;
  }
  const items = data.reports
    .map(
      (r) => `<li class="adm-rep${r.status === "fixed" ? " fixed" : ""}" data-kind="${esc(r.kind)}" data-id="${esc(r.id)}">
        <div class="adm-rep-head">${icon(KIND_ICON[r.kind] || "flag")}<b>${esc(reportTitle(r))}</b>${reasonText(r) ? `<span class="pill">${esc(reasonText(r))}</span>` : ""}</div>
        <small class="muted" dir="auto">${esc(r.created_at)} UTC${r.device ? ` · ${esc(r.device)}` : ""}</small>
        ${r.status === "in_review" && r.pr_url ? `<a class="adm-rep-pr" href="${esc(r.pr_url)}" target="_blank" rel="noopener">${icon("clipboard-check")}<span>${esc(t("adm.rep.inReview", { n: r.pr }))}</span></a>` : ""}
        ${r.note ? `<p class="adm-rep-note" dir="auto">${esc(r.note)}</p>` : ""}
        ${shownBlock(r)}
        ${r.question || r.raw || r.answer || r.context ? `<details><summary>${esc(t("adm.rep.more"))}</summary>${r.question ? `<p dir="auto"><b>${esc(t("adm.rep.question"))}</b> ${esc(r.question)}</p>` : ""}${r.raw || r.answer ? `<p><b>${esc(t("adm.rep.raw"))}</b></p><pre dir="auto">${esc(r.raw || r.answer)}</pre>` : ""}${r.context ? `<pre dir="auto">${esc(r.context)}</pre>` : ""}</details>` : ""}
        <button type="button" class="secondary small" data-rep-status="${r.status === "fixed" ? "open" : "fixed"}">${icon(r.status === "fixed" ? "rotate-ccw" : "check")}<span>${esc(t(r.status === "fixed" ? "adm.rep.reopen" : "adm.rep.fixed"))}</span></button>
      </li>`,
    )
    .join("");
  box.innerHTML = `<p class="muted">${esc(t("adm.rep.intro", { n: data.open }))}</p>
    ${items ? `<ul class="adm-rep-list">${items}</ul>` : `<p class="muted">${esc(t("adm.rep.none"))}</p>`}
    <div class="actions">
      <a class="btn-secondary" href="/api/admin/reports/export" download>${icon("download")}<span>${esc(t("adm.rep.download"))}</span></a>
      <button type="button" class="ghost" data-rep-all>${esc(t(showAll ? "adm.rep.onlyOpen" : "adm.rep.showAll"))}</button>
    </div>`;
  hydrateIcons(box);
  box.querySelector(":scope > .actions > [data-rep-all]").addEventListener("click", () => renderAdminReports(box, { api, toast, showAll: !showAll }));
  box.querySelectorAll(".adm-rep > button[data-rep-status]").forEach((b) =>
    b.addEventListener("click", async () => {
      const li = b.closest("li");
      b.disabled = true;
      try {
        await api(`/api/admin/reports/${li.dataset.kind}/${li.dataset.id}`, { method: "POST", body: { status: b.dataset.repStatus } });
        renderAdminReports(box, { api, toast, showAll });
      } catch (e) {
        b.disabled = false;
        toast?.(e.message, "circle-x");
      }
    }),
  );
}

// Obrazec »Prijavi napako« pod odgovorom inštruktorja (iz public/app.js addMsgFoot; server/reports.js).
export function openMsgReport(el, foot, btn, id, done, { convId, api, toast }) {
  if (el.querySelector(".report-box")) return;
  btn.setAttribute("aria-expanded", "true");
  const box = document.createElement("div");
  box.className = "report-box";
  box.setAttribute("role", "group");
  box.innerHTML = `<p></p><div class="rep-reasons"></div><textarea maxlength="500" rows="2"></textarea>
    <p class="rep-err" role="alert" hidden></p>
    <div class="rep-actions"><button type="button" class="primary small rep-send"></button><button type="button" class="ghost rep-cancel"></button></div>
    <p class="rep-code muted" hidden><span></span> <span class="msg-code"></span></p>`;
  box.querySelector("p").textContent = t("rep.ask");
  if (foot.dataset.code) {
    const c = box.querySelector(".rep-code");
    c.hidden = false;
    c.firstElementChild.textContent = `${t("rep.code")}:`;
    // Črka O z malo (j, 17. 11. 2026): v pisavi telefona sta »O« in »0« enaka (#000O je bil videti kot #0000).
    // Iskanje kode (server/reports.js parseMessageCode) ne loči velikih in malih črk.
    c.lastElementChild.textContent = foot.dataset.code.replace(/O/g, "o");
  }
  box.setAttribute("aria-label", t("rep.ask"));
  const area = box.querySelector("textarea");
  area.placeholder = t("rep.notePh");
  area.setAttribute("aria-label", t("rep.notePh"));
  let reason = null;
  for (const r of ["wrong", "unsafe", "other"]) {
    const rb = document.createElement("button");
    rb.type = "button";
    rb.className = "secondary small";
    rb.setAttribute("aria-pressed", "false");
    rb.textContent = t(`rep.${r}`);
    rb.addEventListener("click", () => {
      reason = r;
      box.querySelectorAll(".rep-reasons button").forEach((x) => x.setAttribute("aria-pressed", String(x === rb)));
      err.hidden = true;
    });
    box.querySelector(".rep-reasons").append(rb);
  }
  const err = box.querySelector(".rep-err");
  const sendBtn = box.querySelector(".rep-send");
  const close = () => {
    box.remove();
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  };
  sendBtn.textContent = t("rep.send");
  box.querySelector(".rep-cancel").textContent = t("rep.cancel");
  box.querySelector(".rep-cancel").addEventListener("click", close);
  box.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  });
  sendBtn.addEventListener("click", async () => {
    if (!reason) {
      err.textContent = t("rep.pick");
      err.hidden = false;
      return;
    }
    sendBtn.disabled = true;
    try {
      // Zraven gre, kar je učenec videl: izrisan HTML sporočila in naprava (napaka v izpisu formule).
      await api(`/api/conversations/${convId}/messages/${id}/report`, { method: "POST", body: { reason, note: area.value, shown: shownHtml(el), ...deviceInfo() } });
      box.remove();
      done();
      toast(t("rep.thanks"), "check");
    } catch (e) {
      err.textContent = e.message;
      err.hidden = false;
      sendBtn.disabled = false;
    }
  });
  foot.after(box);
  box.querySelector(".rep-reasons button").focus();
}
