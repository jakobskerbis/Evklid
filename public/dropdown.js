// Spustni meniji v slogu aplikacije (zaobljen seznam namesto sistemskega).
// Pravi <select> ostane skrit v strani: drži vrednost, deluje v obrazcih in sproži »change«,
// zato ostala koda ne ve, da je meni zamenjan. Vsak <select>, ki se pojavi v strani, se zamenja sam.
// Izjema: <select data-native> ostane sistemski.
// Dolg seznam (z iskalnikom) se odpre čez gumb: izbrana možnost je v iskalnem okencu na vrhu,
// seznam pod njim pa se začne za njo (j, 31. 10.).
// Iskalnik piše z Evklidovo tipkovnico (j, 1. 11.: telefonova le za prijavne podatke).
import { t } from "./i18n.js";
import { hideKeyboard, keyboardOpenFor } from "./tipkovnica.js";

const CHEVRON = '<svg class="dd-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const CHECK = '<svg class="dd-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const proto = HTMLSelectElement.prototype;
const valueProp = Object.getOwnPropertyDescriptor(proto, "value");
const indexProp = Object.getOwnPropertyDescriptor(proto, "selectedIndex");
const done = new WeakSet();
// Od toliko možnosti naprej se seznam pomika, zato dobi iskalnik in izbrano možnost na vrhu.
export const SEARCH_FROM = 9;
let openMenu = null; // { sel, btn, list, items, active, close }
let uid = 0;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Besedilo oznake brez gnezdenih polj: <label>Jezik <select>…</select></label> ima v textContent tudi vse možnosti
// (bralnik zaslona bi prebral ~100 imen jezikov kot ime gumba).
function labelText(l) {
  if (!l) return "";
  const c = l.cloneNode(true);
  for (const el of c.querySelectorAll("select, input, textarea, button, .dd")) el.remove();
  return c.textContent.replace(/\s+/g, " ").trim();
}

export function enhanceSelect(sel) {
  if (done.has(sel) || sel.multiple || sel.size > 1 || sel.hasAttribute("data-native") || !sel.isConnected) return;
  done.add(sel);
  const wrap = document.createElement("span");
  wrap.className = "dd";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "dd-btn";
  btn.setAttribute("aria-haspopup", "listbox");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = `<span class="dd-label" dir="auto"></span>${CHEVRON}`;
  const label = sel.getAttribute("aria-label") || labelText(sel.labels?.[0]);
  if (label) btn.setAttribute("aria-label", label);
  sel.before(wrap);
  wrap.append(btn, sel); // gumb pred menijem: klik na <label> odpre gumb
  sel.tabIndex = -1;
  sel.setAttribute("aria-hidden", "true");
  sel.focus = () => btn.focus();
  for (const l of sel.labels || []) {
    if (l.htmlFor) l.addEventListener("click", (e) => { e.preventDefault(); btn.focus(); });
  }

  const sync = () => {
    const opt = sel.options[indexProp.get.call(sel)];
    btn.querySelector(".dd-label").textContent = opt ? opt.textContent : "";
    btn.classList.toggle("placeholder", !opt || opt.value === "");
    btn.disabled = sel.disabled;
    wrap.hidden = sel.hidden;
  };
  // Koda pogosto nastavi vrednost neposredno (sel.value = …), kar ne sproži dogodka.
  Object.defineProperty(sel, "value", { configurable: true, get() { return valueProp.get.call(this); }, set(v) { valueProp.set.call(this, v); sync(); } });
  Object.defineProperty(sel, "selectedIndex", { configurable: true, get() { return indexProp.get.call(this); }, set(v) { indexProp.set.call(this, v); sync(); } });
  new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["disabled", "hidden", "selected", "label"] });
  sel.addEventListener("change", sync);
  sel.form?.addEventListener("reset", () => setTimeout(sync));
  sync();

  btn.addEventListener("click", () => (openMenu?.sel === sel ? closeMenu() : open(sel, btn)));
  btn.addEventListener("keydown", (e) => {
    if (openMenu?.sel === sel) return;
    if (["ArrowDown", "ArrowUp"].includes(e.key) || (e.altKey && e.key === "ArrowDown")) {
      e.preventDefault();
      open(sel, btn);
    }
  });
}

function open(sel, btn) {
  closeMenu();
  const list = document.createElement("div");
  list.className = "dd-list";
  list.id = `dd-list-${++uid}`;
  list.setAttribute("role", "listbox");
  list.tabIndex = -1;
  const items = [];
  const current = indexProp.get.call(sel);
  let html = "";
  for (const child of sel.children) {
    if (child.tagName === "OPTGROUP") {
      html += `<div class="dd-group" role="presentation">${esc(child.label)}</div>`;
      for (const o of child.children) html += optHtml(o);
    } else if (child.tagName === "OPTION") html += optHtml(child);
  }
  function optHtml(o) {
    if (o.hidden) return "";
    const i = o.index;
    return `<div class="dd-opt" role="option" data-i="${i}" aria-selected="${i === current}"${o.disabled ? ' aria-disabled="true"' : ""}><span dir="auto">${esc(o.textContent)}</span>${CHECK}</div>`;
  }
  // Dolg seznam (npr. jeziki ali vsak z vsaj SEARCH_FROM možnostmi) ima na vrhu iskalnik,
  // v katerem piše izbrana možnost: <select data-search data-search-ph="Išči …">.
  const searchable = isSearchable(sel);
  const ph = sel.dataset.searchPh || tr("common.search", "Išči …");
  const chosen = sel.options[current];
  const shown = chosen && chosen.value !== "" ? chosen.textContent : "";
  const empty = `<div class="dd-group dd-empty"${html ? " hidden" : ""}>${esc(sel.dataset.emptyText || tr("common.noOptions", "Ni možnosti"))}</div>`;
  const search = `<div class="dd-search${shown ? " has-value" : ""}"><input type="search" autocomplete="off" enterkeyhint="search" placeholder="${esc(shown || ph)}" aria-label="${esc(shown ? `${shown}. ${ph}` : ph)}">${shown ? CHECK : ""}</div>`;
  list.innerHTML = (searchable ? search : "") + html + empty;
  list.querySelectorAll(".dd-opt").forEach((el) => items.push(el));
  if (searchable) list.classList.add("dd-searchable");
  document.body.append(list);
  btn.setAttribute("aria-expanded", "true");
  btn.setAttribute("aria-controls", list.id);
  btn.closest(".dd").classList.add("open");
  const state = { sel, btn, list, items, active: -1, search: list.querySelector(".dd-search input") };
  const chosenEl = items.find((el) => Number(el.dataset.i) === current);
  // Izbrana možnost je že v okencu, zato je v seznamu ni, dokler nič ne iščeš.
  if (state.search && shown && chosenEl) {
    chosenEl.hidden = true;
    hideEmptyGroups(list);
  }
  place(btn, list, !!state.search);
  openMenu = state;
  if (state.search && chosenEl) {
    // Seznam se začne za izbrano možnostjo (pri jezikih je ta prva, zato se začne na vrhu).
    const k = items.indexOf(chosenEl);
    const next = items.findIndex((el, j) => j > k && !el.hidden);
    const at = next >= 0 ? next : items.findIndex((el) => !el.hidden);
    // Enter brez iskanja pusti izbiro (tudi prazno »— izberi —«), puščica dol gre na naslednjo možnost.
    setActive(state, k);
    if (at >= 0) {
      const head = list.querySelector(".dd-search");
      const el = items[at];
      const grp = el.previousElementSibling?.classList.contains("dd-group") && !el.previousElementSibling.hidden ? el.previousElementSibling : el;
      const want = Math.max(0, grp.offsetTop - head.offsetHeight);
      // Blizu konca seznama se ne da pomakniti dovolj: seznam raje skrajšamo, da ni odrezane vrstice.
      const short = want - (list.scrollHeight - list.clientHeight);
      if (short > 0) list.style.maxHeight = `${list.offsetHeight - short}px`;
      list.scrollTop = want;
    }
  } else setActive(state, Math.max(0, items.findIndex((el) => Number(el.dataset.i) === current)), true);
  if (state.search) {
    const fold = (x) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    state.search.addEventListener("input", () => {
      const q = fold(state.search.value.trim());
      let first = -1;
      items.forEach((el, k) => {
        el.hidden = q ? !fold(el.textContent).includes(q) : el === chosenEl && !!shown;
        if (!el.hidden && first < 0) first = k;
      });
      hideEmptyGroups(list);
      list.querySelector(".dd-empty").hidden = first >= 0 || !q;
      if (!q && shown && chosenEl) setActive(state, items.indexOf(chosenEl));
      else if (first >= 0) setActive(state, first);
    });
    state.search.addEventListener("keydown", (e) => onKey(state, e, true));
    // Le na telefonu (tipkovnica premakne zaslon) seznam med iskanjem ostane odprt ob pomikanju.
    state.search.addEventListener("focus", () => (state.searching = matchMedia("(pointer: coarse)").matches));
    // Na zaslonu na dotik tipkovnica ne skoči gor sama; iskalnik odpre dotik.
    if (!matchMedia("(pointer: coarse)").matches) state.search.focus({ preventScroll: true });
  }

  list.addEventListener("click", (e) => {
    const el = e.target.closest(".dd-opt");
    if (el && el.getAttribute("aria-disabled") !== "true") choose(state, Number(el.dataset.i));
  });
  list.addEventListener("pointermove", (e) => {
    const el = e.target.closest(".dd-opt");
    if (el) setActive(state, items.indexOf(el));
  });
  if (!state.search || matchMedia("(pointer: coarse)").matches) list.focus({ preventScroll: true });
  list.addEventListener("keydown", (e) => e.target === state.search || onKey(state, e));
}

const tr = (key, fallback) => {
  const s = t(key);
  return s && s !== key ? s : fallback;
};

export function isSearchable(sel) {
  if (sel.hasAttribute("data-search")) return true;
  if (sel.hasAttribute("data-no-search")) return false;
  let n = 0;
  for (const o of sel.options) if (!o.hidden) n++;
  return n >= SEARCH_FROM;
}

// Skupine brez vidnih možnosti skrijemo.
function hideEmptyGroups(list) {
  list.querySelectorAll(".dd-group:not(.dd-empty)").forEach((g) => {
    let n = g.nextElementSibling, any = false;
    while (n && !n.classList.contains("dd-group")) { if (!n.hidden) any = true; n = n.nextElementSibling; }
    g.hidden = !any;
  });
}

// Seznam pod gumbom (ali nad njim, če spodaj ni prostora), nikoli čez rob zaslona.
// Seznam z iskalnikom pa leži čez gumb: iskalno okence je točno tam, kjer je bil gumb.
// Odprta Evklidova tipkovnica zaseda spodnji del zaslona: seznam je nad njo.
function viewBottom() {
  const vh = window.visualViewport?.height || window.innerHeight;
  const kb = document.getElementById("tipkovnica");
  if (!kb || kb.hidden) return vh;
  // po višini, ne po legi: tipkovnica ob odpiranju še drsi navzgor
  const vv = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tk-vv")) || 0;
  return Math.min(vh, window.innerHeight - vv - kb.offsetHeight);
}

function place(btn, list, overGap = false) {
  const r = btn.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = viewBottom();
  const gap = 6, margin = 12;
  if (overGap) {
    const pad = 7; // rob seznama (1 px) + odmik okenca (6 px)
    const edge = 4;
    const width = Math.min(Math.max(r.width + 2 * pad, 220), vw - 2 * edge);
    const left = Math.min(Math.max(edge, r.left - pad), vw - edge - width);
    list.style.width = `${width}px`;
    list.style.left = `${left}px`;
    // Okence točno nad gumbom, tudi ko seznam ob robu zaslona ne more biti simetričen.
    list.style.setProperty("--dd-pad-s", `${Math.max(4, r.left - left - 1)}px`);
    list.style.setProperty("--dd-pad-e", `${Math.max(4, left + width - r.right - 1)}px`);
    list.style.setProperty("--dd-field-h", `${Math.max(40, r.height)}px`);
    const natural = Math.min(list.scrollHeight + 2, 420);
    const need = Math.min(natural, 260, vh - 2 * margin);
    // Okence leži na gumbu. Le če pod njim ni prostora za nekaj vrstic, se seznam dvigne
    // (okence ostane na vrhu seznama).
    let top = r.top - pad;
    if (vh - margin - top < need) top = vh - margin - need;
    top = Math.max(margin, top);
    list.style.top = `${top}px`;
    list.style.maxHeight = `${Math.max(160, vh - margin - top)}px`;
    list.classList.remove("up");
    list.classList.add("over");
    return;
  }
  const width = Math.min(Math.max(r.width, 220), vw - 2 * margin);
  const left = Math.min(Math.max(margin, r.left), vw - margin - width);
  list.style.width = `${width}px`;
  list.style.left = `${left}px`;
  const below = vh - r.bottom - gap - margin;
  const above = r.top - gap - margin;
  const natural = Math.min(list.scrollHeight + 2, 360);
  if (below >= Math.min(natural, 220) || below >= above) {
    list.style.top = `${r.bottom + gap}px`;
    list.style.maxHeight = `${Math.max(120, below)}px`;
    list.classList.remove("up");
  } else {
    const h = Math.min(natural, above);
    list.style.top = `${r.top - gap - h}px`;
    list.style.maxHeight = `${h}px`;
    list.classList.add("up");
  }
}

function setActive(state, i, center = false) {
  if (i < 0 || i >= state.items.length) return;
  state.items[state.active]?.classList.remove("active");
  state.active = i;
  const el = state.items[i];
  el.classList.add("active");
  // Skrita izbrana možnost (je v iskalnem okencu) ni »trenutna« za bralnik zaslona.
  if (el.hidden) state.list.removeAttribute("aria-activedescendant");
  else state.list.setAttribute("aria-activedescendant", (el.id ||= `${state.list.id}-${i}`));
  if (center) state.list.scrollTop = el.offsetTop - state.list.clientHeight / 2 + el.offsetHeight / 2;
  else el.scrollIntoView({ block: "nearest" });
}

function step(state, dir) {
  let i = state.active;
  do i += dir; while (i >= 0 && i < state.items.length && (state.items[i].hidden || state.items[i].getAttribute("aria-disabled") === "true"));
  setActive(state, i);
}

let typed = "", typedAt = 0;
function onKey(state, e, inSearch = false) {
  if (e.key === "ArrowDown") { e.preventDefault(); step(state, 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); step(state, -1); }
  else if (!inSearch && e.key === "Home") { e.preventDefault(); setActive(state, 0); }
  else if (!inSearch && e.key === "End") { e.preventDefault(); setActive(state, state.items.length - 1); }
  else if (e.key === "Enter" || (!inSearch && e.key === " ")) {
    e.preventDefault();
    const el = state.items[state.active];
    if (el && el.getAttribute("aria-disabled") !== "true") choose(state, Number(el.dataset.i));
  } else if (e.key === "Escape") { e.preventDefault(); closeMenu(true); }
  else if (e.key === "Tab") closeMenu(true);
  else if (!inSearch && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    typed = Date.now() - typedAt > 700 ? e.key.toLowerCase() : typed + e.key.toLowerCase();
    typedAt = Date.now();
    const i = state.items.findIndex((el) => el.textContent.replace(/[\u2066-\u2069]/g, "").trim().toLowerCase().startsWith(typed));
    if (i >= 0) setActive(state, i);
  }
}

function choose(state, i) {
  const { sel } = state;
  const changed = indexProp.get.call(sel) !== i;
  sel.selectedIndex = i;
  closeMenu(true);
  if (changed) {
    sel.dispatchEvent(new Event("input", { bubbles: true }));
    sel.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export function closeMenu(refocus = false) {
  if (!openMenu) return;
  const { btn, list, search } = openMenu;
  openMenu = null;
  if (search && keyboardOpenFor(search)) hideKeyboard();
  list.remove();
  btn.setAttribute("aria-expanded", "false");
  btn.removeAttribute("aria-controls");
  btn.closest(".dd")?.classList.remove("open");
  if (refocus) btn.focus({ preventScroll: true });
}

document.addEventListener("pointerdown", (e) => {
  if (!openMenu || openMenu.list.contains(e.target) || openMenu.btn.contains(e.target)) return;
  if (e.target.closest?.("#tipkovnica")) return; // tipka Evklidove tipkovnice piše v iskalnik
  closeMenu();
}, true);
// Tipkovnica se odpre ali zapre: seznam z iskalnikom se postavi na novo, da ga ne prekrije.
window.addEventListener("evklid:tipkovnica", () => {
  if (openMenu?.search) place(openMenu.btn, openMenu.list, true);
});
// Med iskanjem (tipkovnica na telefonu premakne ali pomanjša zaslon) seznam ostane odprt.
document.addEventListener("scroll", (e) => {
  if (openMenu && !openMenu.searching && !openMenu.list.contains(e.target)) closeMenu();
}, true);
window.addEventListener("resize", () => openMenu?.searching || closeMenu());

export function enhanceAll(root = document) {
  if (root.tagName === "SELECT") enhanceSelect(root);
  else root.querySelectorAll?.("select").forEach(enhanceSelect);
}

enhanceAll();
new MutationObserver((records) => {
  for (const r of records) for (const n of r.addedNodes) if (n.nodeType === 1) enhanceAll(n);
}).observe(document.documentElement, { childList: true, subtree: true });
