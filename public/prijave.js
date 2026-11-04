// Prijave napak (server/reports.js): »Prijavi napako« v lekciji, skrbnikova prijava iz klepeta in seznam
// prijav za skrbnika (Račun → Prijave napak). Okvir prijave ima isti videz kot prijava pod odgovorom
// inštruktorja (style.css .report-box).
import { icon, hydrateIcons } from "./icons.js";
import { t } from "./i18n.js";

// Naprava ob prijavi (kot pri mnenjih, feedback.js): telefon / tablica / računalnik in velikost zaslona.
function deviceInfo() {
  const w = window.innerWidth;
  const touch = matchMedia("(hover: none) and (pointer: coarse)").matches;
  return { device: w <= 760 ? "phone" : touch && w <= 1240 ? "tablet" : "desktop", screen: `${w}x${window.innerHeight}` };
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/**
 * Okvir s prijavo: vprašanje, razlogi (neobvezno), opomba, Pošlji / Prekliči.
 * onSend({ reason, note }) vrne obljubo; ob napaki ostane okvir odprt s sporočilom.
 */
export function reportBox({ ask, reasons = [], notePh, needNote = false, sendLabel = t("rep.send"), onSend, onClose }) {
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
      err.textContent = t("bug.needNote");
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

/** Skrbnik v klepetu: opis napake, zraven gredo zadnja sporočila pogovora. */
export function openAdminBug(anchor, { api, studentId, conversationId, view, toast, onClose }) {
  const box = reportBox({
    ask: t("bug.ask"),
    notePh: t("bug.notePh"),
    needNote: true,
    onSend: async ({ note }) => {
      await api(`/api/students/${studentId}/bug`, { method: "POST", body: { note, conversation_id: conversationId || undefined, view, ...deviceInfo() } });
      toast(t("bug.thanks"), "check");
      onClose?.();
    },
    onClose,
  });
  box.classList.add("bug-box");
  anchor.after(box);
  box.focusFirst();
  return box;
}

// ---------- seznam prijav za skrbnika ----------

const KIND_ICON = { message: "message-circle", lesson: "book-open", app: "flag" };

function reportTitle(r) {
  if (r.kind === "message") return `${t("adm.rep.message")} ${r.code}`;
  if (r.kind === "lesson") return `${t("adm.rep.lesson")}: ${r.topic_name || r.topic_id}${r.step ? ` · ${t("adm.rep.step", { n: r.step })}` : ""}`;
  return t("adm.rep.app");
}
function reasonText(r) {
  if (r.kind === "app") return "";
  return r.kind === "lesson" ? lessonReason(r.reason) : t(`rep.${r.reason}`);
}

/** Izriše prijave v box (Račun skrbnika ali stran z mnenji na računalniku s strežnikom). */
export async function renderAdminReports(box, { api, toast, showAll = false }) {
  let data;
  try {
    data = await api(`/api/admin/reports${showAll ? "?status=all" : ""}`);
  } catch (e) {
    box.innerHTML = `<p class="muted">${esc(e.message)}</p>`;
    return;
  }
  const items = data.reports
    .map(
      (r) => `<li class="adm-rep${r.status === "fixed" ? " fixed" : ""}" data-kind="${esc(r.kind)}" data-id="${esc(r.id)}">
        <div class="adm-rep-head">${icon(KIND_ICON[r.kind] || "flag")}<b>${esc(reportTitle(r))}</b>${reasonText(r) ? `<span class="pill">${esc(reasonText(r))}</span>` : ""}</div>
        <small class="muted">${esc(r.created_at)} UTC${r.device ? ` · ${esc(r.device)}` : ""}</small>
        ${r.note ? `<p class="adm-rep-note" dir="auto">${esc(r.note)}</p>` : ""}
        ${r.question || r.answer || r.context ? `<details><summary>${esc(t("adm.rep.more"))}</summary>${r.question ? `<p dir="auto"><b>${esc(t("adm.rep.question"))}</b> ${esc(r.question)}</p>` : ""}${r.answer ? `<p dir="auto"><b>${esc(t("adm.rep.answer"))}</b> ${esc(r.answer)}</p>` : ""}${r.context ? `<pre dir="auto">${esc(r.context)}</pre>` : ""}</details>` : ""}
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
  box.querySelector("[data-rep-all]").addEventListener("click", () => renderAdminReports(box, { api, toast, showAll: !showAll }));
  box.querySelectorAll("[data-rep-status]").forEach((b) =>
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
