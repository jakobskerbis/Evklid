// Točka B3 (pilot, j 14. 11.): kratka anketa s tremi vprašanji 7 dni po prvi uporabi (server/anketa-teden.js).
// Pokaže se samo na Učni poti (ne v ligi ali med preizkusom), največ enkrat na nalaganje strani in ne čez drugo okno.
// Ali je anketa odprta in kdaj sme biti prikazana (pouk po Urniku, šolski čas), odloči strežnik. Brez cene in brez XP.
import { t } from "./i18n.js";
import { icon } from "./icons.js";

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const VPRASANJA = { pomaga: ["zelo", "malo", "ne"], naprej: ["da", "mogoce", "ne"], tretje: ["da", "mogoce", "ne"] };
// Oznake odgovorov: Da / Mogoče / Ne so že v slovarju (fb.*), Zelo in Malo sta nova.
const OZNAKA = { zelo: "ank.a.zelo", malo: "ank.a.malo", da: "fb.yes", mogoce: "fb.maybe", ne: "fb.no" };

let D = null;
// Zadnje preverjanje po profilu: zaprta anketa (ali prikazana) se na tem nalaganju ne preverja več, »ne zdaj« (npr. med
// poukom) pa šele po PONOVNO ms, da dolgo odprta aplikacija vpraša znova zvečer.
const PONOVNO = 30 * 60000;
const preverjeno = new Map(); // id profila → čas (Infinity = ne več na tem nalaganju)
let casovnik = null;

export function initAnketa(deps) {
  D = deps;
}

// Drugo okno, uvodni ogled ali vprašalnik: anketa počaka do naslednjega nalaganja (ne sili čez).
// Liga, izpit ali tekmovanje v premičnem oknu (public/okna.js) šteje kot zasedeno: ne med ligo ali preizkusom.
const MED_PREIZKUSOM = ["league", "exams", "competition"];
const zasedeno = () =>
  document.body.classList.contains("onboarding") ||
  !$("#tour")?.hidden ||
  !!document.querySelector("dialog[open]") ||
  !!document.querySelector(".lock-card, .iq, .xp-cele-card") ||
  (D.floatingViews?.() || []).some((v) => MED_PREIZKUSOM.includes(v));

/** Klic ob prikazu Učne poti: po kratkem zamiku vpraša strežnik, ali je anketa odprta. Če je odprto drugo okno
 * (npr. vprašalnik zanimanj), počaka in poskusi znova (največ nekaj minut). */
export function preveriAnketo(poskus = 0) {
  if (!D) return;
  const s0 = D.getStudent();
  if (!s0 || Date.now() - (preverjeno.get(s0.id) ?? -Infinity) < PONOVNO) return;
  clearTimeout(casovnik);
  casovnik = setTimeout(async () => {
    const s = D.getStudent();
    if (!s || D.currentView() !== "path" || Date.now() - (preverjeno.get(s.id) ?? -Infinity) < PONOVNO) return;
    if (zasedeno()) return poskus < 40 && preveriAnketo(poskus + 1);
    let st;
    try {
      st = await D.api(`/api/students/${s.id}/anketa-teden`);
    } catch {
      return;
    }
    if (D.getStudent()?.id !== s.id) return;
    if (!st?.pokazi) return preverjeno.set(s.id, Date.now());
    // Med čakanjem se je odprlo drugo okno ali pogled: poskusi ob naslednjem prikazu Učne poti.
    if (D.currentView() !== "path" || zasedeno()) return;
    preverjeno.set(s.id, Infinity);
    pokazi(s.id, st);
  }, poskus ? 4000 : 2500);
}

function pokazi(id, st) {
  const izbira = {};
  const dlg = document.createElement("dialog");
  dlg.id = "anketa-teden";
  dlg.className = "install-sheet pn-notice";
  dlg.setAttribute("aria-labelledby", "anketa-naslov");
  const besedilo = { pomaga: "ank.q.pomaga", naprej: "ank.q.naprej", tretje: st.vprasanje3 === "placal" ? "ank.q.placal" : "ank.q.priporocil" };
  dlg.innerHTML = `<div class="is-box" role="document">
    <div class="is-head"><span class="pn-notice-ic">${icon("clipboard-check")}</span><h2 id="anketa-naslov">${esc(t("ank.title"))}</h2></div>
    ${Object.entries(VPRASANJA)
      .map(
        ([q, moznosti]) => `<fieldset class="pn-q"><legend>${esc(t(besedilo[q]))}</legend><div class="pn-choices">${moznosti
          .map((v) => `<button type="button" data-ank-q="${q}" data-v="${v}" aria-pressed="false">${esc(t(OZNAKA[v]))}</button>`)
          .join("")}</div></fieldset>`,
      )
      .join("")}
    <p class="pn-err" role="alert" hidden></p>
    <div class="pn-notice-actions">
      <button type="button" class="secondary" data-ank="pozneje">${esc(t(st.zadnjic ? "ank.no" : "pn.later"))}</button>
      <button type="button" class="primary" data-ank="poslji">${esc(t("pn.send"))}</button>
    </div>
  </div>`;
  document.body.append(dlg);
  const zapri = () => {
    dlg.close();
    dlg.remove();
  };
  const pozneje = () => {
    zapri();
    D.api(`/api/students/${id}/anketa-teden/pozneje`, { method: "POST", body: {} }).catch(() => {});
  };
  dlg.addEventListener("cancel", (e) => {
    e.preventDefault();
    pozneje();
  });
  dlg.addEventListener("click", async (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.ankQ) {
      izbira[b.dataset.ankQ] = b.dataset.v;
      for (const o of dlg.querySelectorAll(`[data-ank-q="${b.dataset.ankQ}"]`)) o.setAttribute("aria-pressed", String(o === b));
      return;
    }
    if (b.dataset.ank === "pozneje") return pozneje();
    if (b.dataset.ank !== "poslji") return;
    const err = $(".pn-err", dlg);
    if (Object.keys(VPRASANJA).some((q) => !izbira[q])) {
      err.textContent = t("ank.all");
      err.hidden = false;
      return;
    }
    b.disabled = true;
    try {
      await D.api(`/api/students/${id}/anketa-teden`, { method: "POST", body: { ...izbira, vprasanje3: st.vprasanje3 } });
      zapri();
      D.toast(t("mob.thanks"));
    } catch (ex) {
      if (ex.status === 409) return zapri(); // že oddana (npr. v drugem zavihku) ali ni več odprta
      b.disabled = false;
      err.textContent = ex.message;
      err.hidden = false;
    }
  });
  dlg.showModal();
  $("[data-ank-q]", dlg).focus();
}
