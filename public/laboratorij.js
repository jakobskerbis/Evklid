// Laboratorij (zavihek v »Uči se«, public/uci-se.js): vsi virtualni poskusi na enem mestu, po predmetih,
// najprej učenčev predmet in razred. Klik na poskus ga odpre čez celo širino; »← Laboratorij«, Esc ali
// tipka Nazaj (labBack v app.js) vrnejo na seznam. Strežnik: server/laboratorij.js (zaklep kot v učbeniku).
import { t } from "./i18n.js";
import { icon } from "./icons.js";
import { mountSim } from "./sim/index.js";

let D = null; // { api, escapeHtml, getStudent, openLesson }
let data = null; // { sid, myPath, experiments, offers }
let openKey = null; // odprt poskus
let shownKey = null; // poskus, ki je zdaj narisan

const view = () => document.getElementById("view-lab");
// Zavihek je skrit tudi, ko je skrit pogled »Uči se« okoli njega.
const hidden = () => !view() || !!view().closest("[hidden]");
const box = () => document.getElementById("lab-content");
const esc = (s) => D.escapeHtml(String(s ?? ""));
const find = (key) => data?.experiments.find((x) => x.key === key);

export function initLab(deps) {
  D = deps;
  const root = view();
  if (!root) return;
  root.addEventListener("click", (e) => {
    const go = e.target.closest("[data-lab-open]");
    if (go) return openExperiment(go.dataset.labOpen);
    const topic = e.target.closest("[data-lab-topic]");
    if (topic) return D.openLesson(topic.dataset.labTopic);
    if (e.target.closest("[data-lab-back]")) return labBack();
    if (e.target.closest("[data-lab-upgrade]")) document.querySelector("#account-tab")?.click();
  });
  // Esc v odprtem poskusu: nazaj na seznam (ne, ko je odprt meni ali okno, ki Esc porabi samo).
  // Tudi na pogledu samem, da v premičnem oknu (public/okna.js) Esc najprej vrne na seznam, šele nato zapre okno.
  const onEsc = (e) => {
    if (e.key !== "Escape" || e.defaultPrevented || !openKey || hidden()) return;
    const shown = (el) => !el.closest("[hidden]") && el.getClientRects().length > 0;
    if ([...document.querySelectorAll('[aria-modal="true"], [role="listbox"], [role="menu"]')].some(shown)) return;
    const at = e.target;
    if (at !== document.body && !root.contains(at)) return;
    if (at.matches?.("textarea, select, input:not([type=range], [type=checkbox], [type=radio], [type=button])")) return;
    if (labBack()) e.preventDefault();
  };
  root.addEventListener("keydown", onEsc);
  document.addEventListener("keydown", onEsc);
}

// Prikaz pogleda: seznam ali že odprt poskus (ostane, kot je bil, npr. po skoku v kalkulator).
export async function showLab() {
  const s = D?.getStudent();
  if (!s || !box()) return;
  if (data && data.sid !== s.id) openKey = null; // drug profil: seznam znova
  if (openKey && shownKey === openKey && box().querySelector(".lab-stage") && !find(openKey)?.locked) return; // zaklenjen: znova (morda je zdaj odklenjen)
  if (!data || data.sid !== s.id) box().innerHTML = `<p class="muted">${esc(t("common.loading"))}</p>`;
  try {
    const r = await D.api(`/api/students/${s.id}/lab`);
    if (D.getStudent()?.id !== s.id) return; // med nalaganjem zamenjan profil: velja novejši klic
    data = { ...r, sid: s.id };
  } catch {
    if (D.getStudent()?.id !== s.id) return;
    box().innerHTML = `<p class="muted">${esc(t("lab.error"))}</p>`;
    return;
  }
  if (openKey && find(openKey)) return renderExperiment();
  openKey = null;
  renderList();
}

// Iz lekcije (»Poskus v laboratoriju«): ta poskus se odpre, ko se pokaže zavihek Laboratorij (showLab).
export function openLabExperiment(key) {
  openKey = key || null;
}

// Tipka Nazaj ali Esc: iz poskusa na seznam. Vrne true, če je bil poskus odprt.
export function labBack() {
  if (!openKey || hidden()) return false;
  const key = openKey;
  openKey = null;
  renderList();
  view().classList.remove("lab-open");
  const card = box().querySelector(`[data-lab-card="${CSS.escape(key)}"] [data-lab-open]`);
  card?.focus({ preventScroll: true });
  card?.closest(".lab-card")?.scrollIntoView({ block: "center" });
  return true;
}

function openExperiment(key) {
  if (!find(key)) return;
  openKey = key;
  renderExperiment();
  window.scrollTo(0, 0);
  view().scrollTop = 0;
}

const subjectName = (s) => {
  const name = t(`subj.${s}`);
  return name === `subj.${s}` ? s : name;
};

function topicsHtml(x) {
  return `<p class="lab-topics-label">${icon("book-open")}<span>${esc(t("lab.inTextbook"))}</span></p>
    <div class="lab-topics">${x.topics
      .map((tp) => {
        const lvl = tp.subject === x.subject ? tp.level : `${subjectName(tp.subject)}, ${tp.level}`;
        const mine = tp.path === data.myPath ? " mine" : "";
        return `<button type="button" class="lab-topic${mine}" data-lab-topic="${esc(tp.id)}" aria-label="${esc(`${t("lab.inTextbook")}: ${tp.name} (${lvl})`)}"><small dir="auto">${esc(lvl)}</small><span dir="auto">${esc(tp.name)}</span></button>`;
      })
      .join("")}</div>`;
}

function renderList() {
  shownKey = null;
  view()?.classList.remove("lab-open");
  const list = data?.experiments || [];
  if (!list.length) {
    box().innerHTML = `<p class="muted">${esc(t("lab.empty"))}</p>`;
    return;
  }
  const groups = [];
  for (const x of list) {
    let g = groups.find((y) => y.subject === x.subject);
    if (!g) groups.push((g = { subject: x.subject, items: [] }));
    g.items.push(x);
  }
  box().innerHTML =
    `<p class="muted lab-intro">${esc(t("lab.intro"))}</p><div class="lab-groups">` +
    groups
      .map(
        (g) => `<section class="lab-group${g.items.length > 1 ? " many" : ""}">
      <h2>${esc(subjectName(g.subject))}</h2>
      <div class="lab-grid">${g.items
        .map(
          (x) => `<article class="card lab-card${x.locked ? " locked" : ""}" data-lab-card="${esc(x.key)}">
          <div class="lab-card-head"><span class="ic">${icon("flask-conical")}</span><h3 dir="auto">${esc(x.title)}</h3>${x.locked ? `<span class="lab-lock" role="img" aria-label="${esc(t("lab.locked"))}" title="${esc(t("lab.locked"))}">${icon("lock")}</span>` : ""}</div>
          <p class="lab-desc" dir="auto">${esc(x.desc)}</p>
          ${topicsHtml(x)}
          <button type="button" class="${x.locked ? "secondary" : "primary"} lab-start" data-lab-open="${esc(x.key)}">${icon(x.locked ? "lock" : "play")}<span>${esc(t("lab.start"))}</span></button>
        </article>`,
        )
        .join("")}</div>
    </section>`,
      )
      .join("") +
    "</div>";
}

function renderExperiment() {
  const x = find(openKey);
  if (!x) return renderList();
  shownKey = openKey;
  view().classList.add("lab-open");
  const offers = data.offers;
  const showOffer = !offers || (offers.show && offers.prices);
  box().innerHTML = `<div class="lab-stage">
    <button type="button" class="ghost back lab-back" data-lab-back>${icon("arrow-left")}<span>${esc(t("nav.lab"))}</span></button>
    <h2 class="lab-title" dir="auto">${icon("flask-conical")}<span>${esc(x.title)}</span></h2>
    <p class="lab-desc" dir="auto">${esc(x.desc)}</p>
    ${
      x.locked
        ? `<section class="card tb-locked lab-locked"><h2>${icon("lock")}<span>${esc(t("lab.lockedTitle", { title: x.title }))}</span></h2>
        <p>${esc(t("lab.lockedText"))}</p>
        ${showOffer ? `<button type="button" class="primary" data-lab-upgrade>${icon("sparkles")}<span>${esc(t("lab.packages"))}</span></button>` : ""}</section>`
        : `<section class="card lab-bench"><div class="lab-mount"></div></section>`
    }
    <div class="lab-foot">${topicsHtml(x)}</div>
  </div>`;
  const m = box().querySelector(".lab-mount");
  if (m) mountSim(x.id, m, x.opts);
  box().querySelector("[data-lab-back]")?.focus({ preventScroll: true });
}
