// Menjava predmeta v menijih zgoraj (klobuk »Nadaljuj z učenjem« in meni profila), da učenec
// predmeta ne menja le v Nastavitvah (j, 2026-10-30). Brez posebnega gumba: vrstica »Predmet«
// v obstoječem meniju, ki se razpre v seznam predmetov (šola: po predmetniku razreda,
// fakulteta: predmeti letnika in izbirni predmeti).
import { icon } from "./icons.js";
import { t } from "./i18n.js";

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

let D = null; // { choices: async () => [{ label, items: [{ id, label, current }] }], pick: async (item) => void }
let req = 0;

export function initSubjectSwitch(deps) {
  D = deps;
}

// Vrstice, ki jih tipke s puščicami obiščejo v meniju (zaprt seznam predmetov se preskoči).
export const SUBJECT_KEYS = ".subj-sw-btn, .subj-sw-list:not([hidden]) .subj-sw-opt";

// Napolni prazen <div class="subj-sw"> v meniju. onPicked(item) pokliče meni po izbiri (npr. zapre se).
// Z enim samim predmetom vrstica ostane skrita (ni česa menjati).
export async function mountSubjectSwitch(box, { onPicked } = {}) {
  if (!box || !D) return;
  const mine = ++req;
  box.hidden = true;
  const groups = await Promise.resolve(D.choices()).catch(() => []);
  if (mine !== req || !box.isConnected) return;
  const all = groups.flatMap((g) => g.items);
  if (all.length < 2) return;
  const cur = all.find((x) => x.current) || all[0];
  box.innerHTML = `<button type="button" class="subj-sw-btn" role="menuitem" aria-expanded="false">
      <span class="ic" aria-hidden="true">${icon("book-open")}</span>
      <span class="subj-sw-text"><small>${esc(t("set.subject"))}</small><b dir="auto">${esc(cur.label)}</b></span>
      ${icon("chevron-down", "subj-sw-chev")}
    </button>
    <div class="subj-sw-list" role="group" aria-label="${esc(t("set.subject"))}" hidden>
      ${groups
        .map(
          (g) =>
            (g.label && groups.length > 1 ? `<div class="subj-sw-label" role="presentation">${esc(g.label)}</div>` : "") +
            g.items
              .map(
                (x) => `<button type="button" class="subj-sw-opt" role="menuitemradio" aria-checked="${x === cur}" data-id="${esc(x.id)}">
                  <span dir="auto">${esc(x.label)}</span>${x === cur ? icon("check", "subj-sw-check") : ""}</button>`,
              )
              .join(""),
        )
        .join("")}
    </div>`;
  box.hidden = false;
  const btn = box.querySelector(".subj-sw-btn");
  const list = box.querySelector(".subj-sw-list");
  btn.addEventListener("click", () => {
    const open = list.hidden;
    list.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    if (open) {
      const sel = list.querySelector('[aria-checked="true"]');
      sel?.focus({ preventScroll: true });
      sel?.scrollIntoView({ block: "nearest" });
    }
  });
  // Esc pri razprtem seznamu najprej zapre le seznam, ne celega menija.
  box.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || list.hidden) return;
    e.preventDefault();
    e.stopPropagation();
    list.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.focus({ preventScroll: true });
  });
  list.addEventListener("click", async (e) => {
    const b = e.target.closest(".subj-sw-opt");
    if (!b) return;
    const item = all.find((x) => x.id === b.dataset.id);
    if (!item) return;
    if (item === cur) {
      list.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      return btn.focus({ preventScroll: true });
    }
    list.querySelectorAll(".subj-sw-opt").forEach((o) => (o.disabled = true));
    try {
      await D.pick(item);
      onPicked?.(item);
    } finally {
      list.querySelectorAll(".subj-sw-opt").forEach((o) => (o.disabled = false));
      // Onemogočen gumb izgubi fokus: ob napaki ga vrnemo, da tipke (Esc, puščice) spet delujejo v meniju.
      if (b.isConnected && (!document.activeElement || document.activeElement === document.body)) b.focus({ preventScroll: true });
    }
  });
}
