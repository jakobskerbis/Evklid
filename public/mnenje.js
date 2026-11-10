// Mnenje člana pilota (server/pilot-mnenja.js): ocena 1–5 zvezdic, »Kaj ti je najbolj všeč?«, »Kaj te najbolj moti?«
// in ločeno stikalo za objavo brez imena (privzeto izklopljeno; mlajšim od 15 let ga strežnik ne ponudi).
// Aplikacija vpraša sama največ enkrat na teden in samo na Učni poti ali v zavihku Jaz, ko ni odprto nobeno okno
// (nikoli med nalogo, preizkusom ali testom s časom). Vedno dostopno: Jaz → »Povej mnenje«.
import { t, currentLang } from "./i18n.js";
import { icon } from "./icons.js";

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const TEXT_MAX = 600;

let D = null; // { api, getStudent, toast }
let st = null; // stanje s strežnika za profil `owner`
let owner = null;
let seq = 0;
let asked = false; // največ eno samodejno vprašanje na nalaganje strani
let timer = null;

export function initOpinion(deps) {
  D = deps;
  $("#me-mnenje")?.addEventListener("click", () => openOpinion());
}

// Samodejno vprašanje samo na mirnem zaslonu: Učna pot ali Jaz, brez odprtega okna, kalkulatorja, vodiča ali uvodnih
// vprašanj in ne med tipkanjem v katero koli polje.
const typing = () => {
  const el = document.activeElement;
  return !!el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable || !!el.closest?.("math-field, .mq-editable-field"));
};
const calm = () =>
  (!$("#view-path")?.hidden || !$("#view-me")?.hidden) &&
  $("#graph-overlay")?.hidden !== false &&
  !typing() &&
  !document.body.classList.contains("onboarding") &&
  $("#tour")?.hidden !== false &&
  !document.querySelector("dialog[open]") &&
  !document.querySelector(".lock-card, .iq, .xp-cele-card");

/** Naloži stanje za trenutni profil (vrstica v Jaz) in po potrebi vpraša za mnenje. */
export async function loadOpinion({ ask = true } = {}) {
  const s = D?.getStudent();
  const my = ++seq;
  if (!s) return;
  if (owner !== s.id) st = null;
  owner = s.id;
  try {
    const r = await D.api(`/api/students/${s.id}/pilot/mnenje`);
    if (my !== seq) return;
    st = r;
  } catch {
    if (my !== seq) return;
    st = st || { member: false };
  }
  paintRow();
  if (ask && st.member && st.due && !asked) {
    clearTimeout(timer);
    timer = setTimeout(() => maybeAsk(s.id), 4000);
  }
}

function paintRow() {
  const card = $("#me-mnenje-card");
  // Bivši član pilota vrstico vidi, dokler ima dano dovoljenje za objavo (da ga lahko prekliče).
  if (card) card.hidden = !st?.member && !st?.published;
}

function maybeAsk(studentId, tries = 0) {
  clearTimeout(timer);
  if (asked || D.getStudent()?.id !== studentId || owner !== studentId || !st?.member || !st.due) return;
  if (!calm()) {
    // Počakamo na miren trenutek (največ nekaj minut), potem šele ob naslednjem odprtju aplikacije.
    if (tries < 30) timer = setTimeout(() => maybeAsk(studentId, tries + 1), 6000);
    return;
  }
  asked = true;
  st.due = false;
  D.api(`/api/students/${studentId}/pilot/mnenje/vprasano`, { method: "POST" }).catch(() => {});
  openOpinion();
}

export function openOpinion() {
  const s = D?.getStudent();
  if (!s || (!st?.member && !st?.published) || owner !== s.id) return;
  let dlg = $("#mnenje-okno");
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.id = "mnenje-okno";
    dlg.className = "install-sheet pn-notice mn-okno";
    dlg.setAttribute("aria-labelledby", "mn-title");
    document.body.append(dlg);
    dlg.addEventListener("click", (e) => {
      // Dotik ob okvirju zapre samo prazno okno: izbrane ocene ali napisanega besedila ne zavrže.
      if (e.target === dlg && !dlg.dataset.dirty) dlg.close();
    });
    dlg.addEventListener("input", () => (dlg.dataset.dirty = "1"));
  }
  delete dlg.dataset.dirty;
  const withdrawRow = st.published ? `<p class="mn-allowed muted small"><span>${esc(t("mn.allowed"))}</span> <button type="button" class="ghost" data-mn="withdraw">${esc(t("mn.withdraw"))}</button></p>` : "";
  const wireCommon = () => {
    dlg.querySelectorAll('[data-mn="x"]').forEach((b) => b.addEventListener("click", () => dlg.close()));
    $('[data-mn="withdraw"]', dlg)?.addEventListener("click", async (e) => {
      try {
        st = await D.api(`/api/students/${s.id}/pilot/mnenje/objava`, { method: "POST", body: { publish: false } });
        e.target.closest(".mn-allowed").textContent = t("mn.withdrawn");
        paintRow();
      } catch (ex) {
        D.toast(ex?.message || t("off.noConnection"));
      }
    });
  };
  if (!st.member) {
    // Bivši član pilota: samo preklic dovoljenja.
    dlg.innerHTML = `<div class="is-box" role="document">
      <div class="is-head"><span class="pn-notice-ic">${icon("message-square-heart")}</span><h2 id="mn-title">${esc(t("fb.cardBtn"))}</h2>
        <button type="button" class="ghost icon-only" data-mn="x" aria-label="${esc(t("full.close"))}" title="${esc(t("full.close"))}">${icon("x")}</button></div>
      ${withdrawRow}
    </div>`;
    wireCommon();
    dlg.showModal();
    $('[data-mn="withdraw"]', dlg)?.focus();
    return;
  }
  const form = { stars: 0, publish: false };
  const stars = [1, 2, 3, 4, 5]
    .map((n) => `<button type="button" role="radio" aria-checked="false" tabindex="${n === 1 ? 0 : -1}" data-star="${n}" aria-label="${esc(t("mn.star", { n }))}" title="${esc(t("mn.star", { n }))}">${icon("star")}</button>`)
    .join("");
  dlg.innerHTML = `<form class="is-box" method="dialog" novalidate>
    <div class="is-head"><span class="pn-notice-ic">${icon("message-square-heart")}</span><h2 id="mn-title">${esc(t("fb.cardTitle"))}</h2>
      <button type="button" class="ghost icon-only" data-mn="x" aria-label="${esc(t("pn.later"))}" title="${esc(t("pn.later"))}">${icon("x")}</button></div>
    <p>${esc(t("mn.intro"))}</p>
    <div class="mn-stars" role="radiogroup" aria-label="${esc(t("mn.stars"))}">${stars}</div>
    <p class="mn-err" role="alert" hidden>${esc(t("mn.needStars"))}</p>
    ${
      st.canText
        ? `<label for="mn-liked">${esc(t("mn.liked"))}</label>
    <textarea id="mn-liked" rows="2" maxlength="${TEXT_MAX}" placeholder="${esc(t("mn.optional"))}"></textarea>
    <label for="mn-bothers">${esc(t("mn.bothers"))}</label>
    <textarea id="mn-bothers" rows="2" maxlength="${TEXT_MAX}" placeholder="${esc(t("mn.optional"))}"></textarea>`
        : ""
    }
    ${
      st.canPublish
        ? `<div class="mn-publish"><button type="button" class="switch" role="switch" aria-checked="false" id="mn-publish" aria-labelledby="mn-publish-text"></button><span id="mn-publish-text">${esc(t("mn.publish"))}</span></div>
    <p class="muted small">${esc(t("mn.publishHint"))}</p>`
        : ""
    }
    ${withdrawRow}
    <div class="pn-notice-actions">
      <button type="button" class="secondary" data-mn="x">${esc(t("pn.later"))}</button>
      <button type="submit" class="primary">${esc(t("mn.send"))}</button>
    </div>
  </form>`;
  const group = $(".mn-stars", dlg);
  const err = $(".mn-err", dlg);
  const setStars = (n, focus = false) => {
    form.stars = n;
    dlg.dataset.dirty = "1";
    err.hidden = true;
    group.querySelectorAll("[data-star]").forEach((b) => {
      const v = Number(b.dataset.star);
      b.setAttribute("aria-checked", String(v === n));
      b.classList.toggle("on", v <= n);
      b.tabIndex = v === (n || 1) ? 0 : -1;
      if (focus && v === n) b.focus();
    });
  };
  group.addEventListener("click", (e) => {
    const b = e.target.closest("[data-star]");
    if (b) setStars(Number(b.dataset.star));
  });
  group.addEventListener("keydown", (e) => {
    const rtl = getComputedStyle(group).direction === "rtl";
    const step = { ArrowRight: rtl ? -1 : 1, ArrowUp: 1, ArrowLeft: rtl ? 1 : -1, ArrowDown: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    setStars(Math.min(5, Math.max(1, (form.stars || (step > 0 ? 0 : 2)) + step)), true);
  });
  $("#mn-publish", dlg)?.addEventListener("click", (e) => {
    form.publish = !form.publish;
    dlg.dataset.dirty = "1";
    e.currentTarget.setAttribute("aria-checked", String(form.publish));
  });
  wireCommon();
  const formEl = $("form", dlg);
  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.stars) {
      err.hidden = false;
      group.querySelector('[tabindex="0"]')?.focus();
      return;
    }
    const btn = $('button[type="submit"]', dlg);
    btn.disabled = true;
    try {
      st = await D.api(`/api/students/${s.id}/pilot/mnenje`, {
        method: "POST",
        body: {
          stars: form.stars,
          liked: $("#mn-liked", dlg)?.value || "",
          bothers: $("#mn-bothers", dlg)?.value || "",
          publish: form.publish === true,
          // Besedilo, ki ga je učenec videl ob stikalu (strežnik ga shrani kot dokaz dovoljenja).
          consent_text: form.publish ? t("mn.publish") : "",
          lang: currentLang(),
        },
      });
      dlg.close();
      paintRow();
      D.toast(t("fb.thanks"), "check");
    } catch (ex) {
      btn.disabled = false;
      D.toast(ex?.message || t("off.noConnection"));
    }
  });
  dlg.showModal();
  $("[data-star]", dlg)?.focus();
}

// Skrbnik (Račun): seznam mnenj brez imen (server/pilot-mnenja.js opinionsReport).
export async function renderOpinionsAdmin(box, { api }) {
  if (!box) return;
  let r;
  try {
    r = await api("/api/admin/pilot-mnenja");
  } catch (err) {
    box.innerHTML = `<p class="muted">${esc(err.message)}</p>`;
    return;
  }
  const ended = r.ended || [];
  if (!r.n && !ended.length) {
    box.innerHTML = `<p class="muted">${esc(t("pilot.mn.none"))}</p>`;
    return;
  }
  // Opozorila o dovoljenju vidi samo skrbnik (j), zato so v slovenščini (kot skrbniški kartici v garancija-ui.js).
  const row = (label, text) => (text ? `<p><small class="muted">${esc(label)}</small><br>${esc(text)}</p>` : "");
  const consent = (o) =>
    o.consent === "withdrawn"
      ? `<p class="mn-warn">${icon("info")}<span>Dovoljenje preklicano ${esc(o.withdrawn_day)}: umakni objavo.</span></p>`
      : o.publish && o.consent_old
        ? `<p class="mn-warn">${icon("info")}<span>Dovoljenje v${esc(o.consent_v ?? "?")}: staro besedilo – ne objavljaj.</span></p>`
        : "";
  const endedHtml = ended.length
    ? `<ul class="mn-admin">${ended.map((e) => `<li><p class="mn-warn">${icon("info")}<span>Oznaka <b>${esc(e.label)}</b>: dovoljenje prenehalo (izbris, ${esc(e.day)}). Umakni objavo.</span></p></li>`).join("")}</ul>`
    : "";
  box.innerHTML = `${endedHtml}<ul class="mn-admin">${r.opinions
    .map(
      (o) => `<li><b>${"★".repeat(o.stars)}${"☆".repeat(5 - o.stars)}</b> <small class="muted">${esc([o.label, `${o.stars}/5`, o.grade, o.month, t(o.publish ? "pilot.mn.pub" : "pilot.mn.team"), o.consent_v ? `dovoljenje v${o.consent_v}` : ""].filter(Boolean).join(" · "))}</small>
        ${consent(o)}${row(t("mn.liked"), o.liked)}${row(t("mn.bothers"), o.bothers)}</li>`,
    )
    .join("")}</ul>`;
}
