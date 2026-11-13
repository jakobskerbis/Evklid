// Kartica zgodovinskih dejstev (docs/oblikovanje.md → »Pridih stare Grčije«, »Zgodovinski slogi«).
// Kartica .gr-fact v praznem klepetu z inštruktorjem in na dnu Učne poti; dejstvo je naključno, gumb pokaže drugo.
// Nabor dejstev: v zgodovinskem slogu njegov (theme.js → ERAS[slog].facts, npr. era.renesansa.f1 …), sicer
// Grški matematiki (greek.f1 … greek.f11). »Evklid« je tu matematik, ne ime aplikacije.
import { icon } from "./icons.js";
import { t } from "./i18n.js";

const GREEK = ["greek", 11];
// [predpona, število] za trenutni slog.
function factSet() {
  const T = window.STEMTheme;
  const era = T?.ERAS?.[T.load().style];
  return era ? era.facts : GREEK;
}
const keyOf = ([prefix], i) => `${prefix}.f${i + 1}`;
let last = -1;
let lastSet = "";

// Naključno dejstvo iz nabora, različno od not (enakomerno med ostalimi); privzeto od zadnjega izbranega.
function pick(set, not) {
  if (not === undefined) not = lastSet === set[0] ? last : -1;
  const n = set[1];
  const skip = not >= 0 && not < n && n > 1;
  let i = Math.floor(Math.random() * (n - (skip ? 1 : 0)));
  if (skip && i >= not) i++;
  last = i;
  lastSet = set[0];
  return i;
}

export function greekFactHtml(cls = "") {
  const set = factSet();
  const i = pick(set);
  const title = t(`${set[0]}.title`);
  return `<aside class="gr-fact ${cls}" aria-label="${title}" data-set="${set[0]}">
    <div class="gr-body"><span class="eyebrow">${title}</span><p class="gr-text" aria-live="polite" data-fact="${i}">${t(keyOf(set, i))}</p></div>
    <button type="button" class="ghost icon-only gr-next" title="${t("greek.next")}" aria-label="${t("greek.next")}">${icon("refresh-cw")}</button>
  </aside>`;
}

// Pokaže dejstvo iz trenutnega nabora; ob menjavi sloga zamenja tudi naslov.
function show(box, not) {
  const set = factSet();
  const p = box.querySelector(".gr-text");
  if (box.dataset.set !== set[0]) {
    box.dataset.set = set[0];
    not = -1;
    const title = t(`${set[0]}.title`);
    box.querySelector(".eyebrow").textContent = title;
    box.setAttribute("aria-label", title);
  }
  const i = pick(set, not);
  p.dataset.fact = i;
  p.textContent = t(keyOf(set, i));
}

// Gumb »Drugo dejstvo« v vseh karticah znotraj root (enkrat na element).
export function wireGreekFacts(root = document) {
  root.querySelectorAll(".gr-fact:not([data-wired])").forEach((box) => {
    box.dataset.wired = "1";
    // Drugačno od dejstva v tej kartici (druga kartica, npr. na Učni poti, ima svoje).
    box.querySelector(".gr-next")?.addEventListener("click", () => show(box, Number(box.querySelector(".gr-text").dataset.fact)));
  });
}

// Menjava sloga (Nastavitve → Videz ali inštruktor): odprte kartice preklopijo na nabor novega sloga.
window.addEventListener("evklid:theme", () => {
  document.querySelectorAll(".gr-fact").forEach((box) => {
    if (box.dataset.set !== factSet()[0]) show(box);
  });
});
