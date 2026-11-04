// Premična okna in mehurček inštruktorja (docs/oblikovanje.md, »Premična okna«).
// - Zavihek iz zgornje vrstice povlečeš navzdol na stran: pogled (<main class="view">) se preseli v
//   okno z naslovno vrstico (premik, velikost, »čez cel zaslon«, zapri). Ob levem ali desnem robu se
//   okno pripne na polovico zaslona. Okna, položaji in velikosti so shranjeni na tej napravi.
// - Telefon in tablica na dotik: okno (iz ukaza inštruktorju ali mehurčka) je spodnji list.
// - Mehurček: ko pogovor z inštruktorjem ni na zaslonu, ostane okrogel gumb, ki ga premakneš,
//   tapneš (odpre klepet v oknu) ali odstraniš (× ali poteg na × spodaj). Nov odgovor pokaže predogled.
import { t } from "./i18n.js";
import { icon } from "./icons.js";
import { makeRowSortable, resetRows } from "./vrstice.js";
import { resetSplits, refreshSplitters } from "./razdelilnik.js";
import { addSample, inMagnet, shouldClose } from "./magnet.js";

const KEY = "evklid.okna";
const ON_KEY = "evklid.windows";
const BUBBLE_KEY = "evklid.mehurcek";
const MIN_W = 320;
const MIN_H = 220;
const EDGE = 28; // px od roba zaslona, kjer se okno pripne
const $ = (s) => document.querySelector(s);

const ls = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
  del(k) {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
};
const readJson = (k, d) => {
  try {
    return JSON.parse(ls.get(k)) || d;
  } catch {
    return d;
  }
};

export const windowsOn = () => ls.get(ON_KEY) !== "0";
/** Telefon in tablica na dotik: okno je spodnji list. */
export const sheetMode = () => matchMedia("(max-width: 760px), (hover: none) and (pointer: coarse)").matches;

let ctx = null;
const wins = new Map(); // ime pogleda → { el, body, view, ph }
let layout = readJson(KEY, {});
layout.geo ||= {};
layout.open ||= [];
// Okni Učbenik in Laboratorij (do 4. 11. 2026) sta zdaj okno »Uči se« (public/uci-se.js): isto mesto in velikost.
for (const old of ["textbook", "lab"]) {
  if (layout.geo[old] && !layout.geo.uci) layout.geo.uci = layout.geo[old];
  delete layout.geo[old];
}
layout.open = [...new Set(layout.open.map((n) => (n === "textbook" || n === "lab" ? "uci" : n)))];
let z = 40;
const saveLayout = () => ls.set(KEY, JSON.stringify(layout));

export const isFloating = (name) => wins.has(name);
export const floatingViews = () => [...wins.keys()];

const tabOf = (name) => document.querySelector(`.topbar .tabs .tab[data-view="${name}"]`);
function canFloat(name) {
  const tab = tabOf(name);
  return !!tab && !tab.hidden && !!document.getElementById(`view-${name}`);
}

// Višina spodnje vrstice za liste (--tabbar-h). Pri branju se vrstica umakne (position: fixed, touch.css) in šteje
// samo, ko je pokazana (body.tb-peek, app.js).
export function syncTabbarH() {
  const bar = $("#tabbar");
  if (!bar) return;
  const cs = getComputedStyle(bar);
  const shown = cs.display !== "none" && (cs.position !== "fixed" || document.body.classList.contains("tb-peek"));
  document.documentElement.style.setProperty("--tabbar-h", `${shown ? bar.offsetHeight : 0}px`);
}

// Vsebinski del zaslona: pod zgornjo vrstico, nad spodnjo vrstico zavihkov.
function area() {
  const top = Math.max(0, $(".topbar")?.getBoundingClientRect().bottom || 0);
  const bar = $("#tabbar");
  const bottom = bar && bar.offsetParent ? bar.getBoundingClientRect().top : window.innerHeight;
  return { top, bottom, left: 0, right: window.innerWidth, w: window.innerWidth, h: Math.max(200, bottom - top) };
}
function snapRect(side) {
  const a = area();
  const w = Math.round(a.w / 2);
  return { x: side === "right" ? a.w - w : 0, y: a.top, w, h: a.h };
}
function defaultGeo(side = "right") {
  const a = area();
  const w = Math.min(560, Math.max(MIN_W, Math.round(a.w * 0.4)));
  const h = Math.max(MIN_H, a.h - 32);
  return { x: side === "left" ? 16 : a.w - w - 16, y: a.top + 16, w, h, snap: null };
}
// Okno ostane na zaslonu: naslovna vrstica je vedno dosegljiva.
function clampGeo(g) {
  const a = area();
  if (g.snap) return { ...g, ...snapRect(g.snap) };
  const w = Math.min(Math.max(MIN_W, g.w), a.w);
  const h = Math.min(Math.max(MIN_H, g.h), a.h);
  const x = Math.min(Math.max(g.x, 120 - w), a.w - 120);
  const y = Math.min(Math.max(g.y, a.top), a.bottom - 44);
  return { ...g, x, y, w, h };
}
function place(win, g) {
  g = clampGeo(g);
  layout.geo[win.name] = g;
  Object.assign(win.el.style, { left: `${g.x}px`, top: `${g.y}px`, width: `${g.w}px`, height: `${g.h}px` });
  win.el.classList.toggle("snapped", !!g.snap);
  win.el.classList.toggle("okno-narrow", g.w < 640);
  syncDock();
  if (bubble && !bubble.hidden) placeBubble(); // mehurček se umakne z okna
}
// Pripeto okno (polovica zaslona) odmakne glavni pogled, da ga ne prekrije (kot na skici: učbenik levo, kalkulator desno).
function syncDock() {
  let l = 0;
  let r = 0;
  for (const w of wins.values()) {
    const g = layout.geo[w.name];
    if (w.el.classList.contains("okno-sheet") || !g?.snap) continue;
    if (g.snap === "left") l = Math.max(l, g.w);
    else r = Math.max(r, g.w);
  }
  const b = document.body;
  b.style.setProperty("--dock-l", `${l}px`);
  b.style.setProperty("--dock-r", `${r}px`);
  b.classList.toggle("docked", !!(l || r));
}

let preview = null;
function showPreview(side) {
  if (!side) {
    if (preview) preview.hidden = true;
    return;
  }
  if (!preview) {
    preview = document.createElement("div");
    preview.className = "okno-snap";
    document.body.append(preview);
  }
  const r = snapRect(side);
  Object.assign(preview.style, { left: `${r.x + 6}px`, top: `${r.y + 6}px`, width: `${r.w - 12}px`, height: `${r.h - 12}px` });
  preview.hidden = false;
}
const sideAt = (x) => (x <= EDGE ? "left" : x >= window.innerWidth - EDGE ? "right" : null);

function syncTabs() {
  document.querySelectorAll(".tabs .tab, #tabbar .tab").forEach((b) => b.classList.toggle("floating", wins.has(b.dataset.view)));
  document.body.classList.toggle("has-okna", wins.size > 0);
  syncDock();
  layout.open = [...wins.values()].sort((a, b) => (a.el.style.zIndex | 0) - (b.el.style.zIndex | 0)).map((w) => w.name);
  if (!sheetMode()) saveLayout();
  refreshBubble();
}

export function focusWindow(name) {
  const w = wins.get(name);
  if (!w) return false;
  if (!w.el.classList.contains("front")) document.querySelectorAll(".okno.front").forEach((o) => o.classList.remove("front"));
  w.el.classList.add("front");
  // Okna ostanejo v pasu 40 + n (pod pojavnimi okni, kalkulatorjem čez cel zaslon in obvestili).
  w.el.style.zIndex = String(++z);
  [...wins.values()]
    .sort((a, b) => (a.el.style.zIndex | 0) - (b.el.style.zIndex | 0))
    .forEach((o, i) => (o.el.style.zIndex = String(40 + i)));
  z = 40 + wins.size;
  return true;
}

/**
 * Odpre pogled v oknu. opts: { x, y } (točka spusta, naslovna vrstica pod kazalcem), snap ("left"/"right"),
 * side (privzeta stran novega okna), restore (ob zagonu).
 */
export function openWindow(name, opts = {}) {
  if (!ctx || !windowsOn() || !canFloat(name)) return false;
  if (wins.has(name)) {
    focusWindow(name);
    return true;
  }
  const view = document.getElementById(`view-${name}`);
  const sheet = sheetMode();
  if (sheet) for (const other of [...wins.keys()]) closeWindow(other);
  const tab = tabOf(name);
  const title = tab?.querySelector("span")?.textContent.trim() || name;
  const el = document.createElement("section");
  el.className = `okno${sheet ? " okno-sheet" : ""}`;
  el.dataset.view = name;
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", title);
  el.tabIndex = -1; // Esc zapre okno tudi po kliku na naslovno vrstico
  el.innerHTML = `${sheet ? `<div class="okno-grip" aria-hidden="true"><span></span></div>` : ""}
    <header class="okno-head">
      <span class="okno-ic">${tab?.querySelector("svg")?.outerHTML || ""}</span>
      <b class="okno-title" dir="auto"></b>
      <button type="button" class="okno-btn okno-max" title="${t("win.max")}" aria-label="${t("win.max")}">${icon("maximize-2")}</button>
      <button type="button" class="okno-btn okno-x" title="${t("win.close")}" aria-label="${t("win.close")}">${icon("x")}</button>
    </header>
    <div class="okno-body"></div>
    ${sheet ? "" : ["e", "w", "s", "se", "sw"].map((d) => `<div class="okno-rs okno-rs-${d}" data-rs="${d}" aria-hidden="true"></div>`).join("")}`;
  el.querySelector(".okno-title").textContent = title;
  const body = el.querySelector(".okno-body");
  const ph = document.createComment(`okno:${name}`);
  view.before(ph);
  const wasMain = ctx.mainView() === name;
  body.append(view);
  view.classList.add("in-okno");
  view.hidden = false;
  const win = { name, el, body, view, ph };
  wins.set(name, win);
  ($("#okna") || document.body).append(el);
  if (sheet) {
    // Kalkulator potrebuje zaslon in vse vrstice tipk: list skoraj čez cel zaslon (CSS ga omeji nad spodnjo vrstico).
    el.style.setProperty("--sheet-h", `${Math.round(window.innerHeight * (name === "graph" ? 0.92 : 0.6))}px`);
    wireSheet(win);
  } else {
    let g = layout.geo[name] ? { ...layout.geo[name] } : defaultGeo(opts.side);
    if (opts.snap) g = { ...g, snap: opts.snap, free: g.snap ? g.free : { w: g.w, h: g.h } };
    else if (opts.x !== undefined) {
      const w = g.snap ? g.free?.w || defaultGeo().w : g.w;
      const h = g.snap ? g.free?.h || defaultGeo().h : g.h;
      // Okno gre do spodnjega roba (ročaj za velikost ostane na zaslonu); če ni prostora, se dvigne.
      const a = area();
      const y = opts.y - 18;
      const fit = Math.max(MIN_H, Math.min(h, a.bottom - y));
      g = { x: opts.x - Math.min(140, w / 2), y: Math.max(a.top, Math.min(y, a.bottom - fit)), w, h: fit, snap: null };
    }
    place(win, g);
    wireWindow(win);
  }
  el.querySelector(".okno-x").addEventListener("click", () => closeWindow(name));
  el.querySelector(".okno-max").addEventListener("click", () => dockWindow(name));
  el.addEventListener("pointerdown", (e) => {
    focusWindow(name);
    if (e.target.closest(".okno-head, .okno-grip") && !el.contains(document.activeElement)) el.focus({ preventScroll: true });
  }, true);
  el.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || e.defaultPrevented) return;
    const a = document.activeElement;
    if (a && a !== el && a.matches("input, textarea, select, [contenteditable]")) return;
    e.preventDefault();
    closeWindow(name);
  });
  focusWindow(name);
  // Pogled, ki je bil glavni, se umakne: glavni del pokaže drug zavihek.
  // Pogled, ki je že bil na zaslonu, ostane, kot je bil (odprta lekcija, vnos); sicer se pripravi.
  if (wasMain) {
    ctx.leaveMain(name);
    ctx.onResize?.(name);
  } else ctx.initView(name);
  syncTabs();
  return true;
}

/** Zapre okno; pogled se vrne na svoje mesto (skrit). keep: pogled ostane živ (prestavljen v glavni del). */
export function closeWindow(name, { keep = false } = {}) {
  const w = wins.get(name);
  if (!w) return;
  wins.delete(name);
  w.view.classList.remove("in-okno");
  w.view.hidden = !keep;
  w.ph.replaceWith(w.view);
  w.el.remove();
  if (!keep) ctx.leaveView(name);
  syncTabs();
}

/** »Odpri čez cel zaslon«: pogled iz okna postane glavni pogled. */
export function dockWindow(name) {
  if (!wins.has(name)) return;
  closeWindow(name, { keep: true });
  ctx.showView(name);
}

function wireWindow(win) {
  const { el, name } = win;
  const head = el.querySelector(".okno-head");
  head.addEventListener("dblclick", (e) => {
    if (e.target.closest("button")) return;
    const g = layout.geo[name];
    place(win, g.snap ? { ...g, ...defaultGeo(g.snap), ...(g.free || {}), snap: null } : { ...g, snap: g.x + g.w / 2 < window.innerWidth / 2 ? "left" : "right", free: { w: g.w, h: g.h } });
    saveLayout();
  });
  head.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0 || ev.target.closest("button")) return;
    ev.preventDefault();
    const start = { ...layout.geo[name] };
    const p0 = { x: ev.clientX, y: ev.clientY };
    let moved = false;
    let side = null;
    head.setPointerCapture(ev.pointerId);
    const move = (e) => {
      const dx = e.clientX - p0.x;
      const dy = e.clientY - p0.y;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      if (!moved) {
        moved = true;
        el.classList.add("moving");
        // Pripeto okno se ob premiku vrne na prejšnjo velikost, kazalec ostane na naslovni vrstici.
        if (start.snap) {
          const free = { ...defaultGeo(), ...(start.free || {}) };
          const fx = (p0.x - start.x) / start.w;
          Object.assign(start, { snap: null, w: free.w, h: free.h, x: p0.x - free.w * fx });
        }
      }
      place(win, { ...start, x: start.x + dx, y: start.y + dy, snap: null, free: undefined });
      side = sideAt(e.clientX);
      showPreview(side);
    };
    const up = () => {
      head.removeEventListener("pointermove", move);
      head.removeEventListener("pointerup", up);
      head.removeEventListener("pointercancel", up);
      el.classList.remove("moving");
      showPreview(null);
      if (!moved) return;
      const g = layout.geo[name];
      if (side) place(win, { ...g, snap: side, free: { w: g.w, h: g.h } });
      saveLayout();
      ctx.onResize?.(name);
    };
    head.addEventListener("pointermove", move);
    head.addEventListener("pointerup", up);
    head.addEventListener("pointercancel", up);
  });
  el.querySelectorAll(".okno-rs").forEach((h) =>
    h.addEventListener("pointerdown", (ev) => {
      if (ev.button !== 0) return;
      ev.preventDefault();
      const d = h.dataset.rs;
      const s = { ...layout.geo[name], snap: null };
      const p0 = { x: ev.clientX, y: ev.clientY };
      h.setPointerCapture(ev.pointerId);
      el.classList.add("moving");
      const move = (e) => {
        const dx = e.clientX - p0.x;
        const dy = e.clientY - p0.y;
        const g = { ...s };
        if (d.includes("e")) g.w = Math.max(MIN_W, s.w + dx);
        if (d.includes("w")) {
          g.w = Math.max(MIN_W, s.w - dx);
          g.x = s.x + s.w - g.w;
        }
        if (d.includes("s")) g.h = Math.max(MIN_H, s.h + dy);
        place(win, g);
      };
      const up = () => {
        h.removeEventListener("pointermove", move);
        h.removeEventListener("pointerup", up);
        h.removeEventListener("pointercancel", up);
        el.classList.remove("moving");
        saveLayout();
        ctx.onResize?.(name);
      };
      h.addEventListener("pointermove", move);
      h.addEventListener("pointerup", up);
      h.addEventListener("pointercancel", up);
    }),
  );
}

// Spodnji list: ročaj ali naslovna vrstica spremeni višino, poteg skoraj do dna list zapre.
function wireSheet(win) {
  const { el, name } = win;
  for (const handle of [el.querySelector(".okno-grip"), el.querySelector(".okno-head")])
    handle.addEventListener("pointerdown", (ev) => {
      if (ev.target.closest("button")) return;
      ev.preventDefault();
      handle.setPointerCapture(ev.pointerId);
      const h0 = el.getBoundingClientRect().height;
      const y0 = ev.clientY;
      el.classList.add("moving");
      const move = (e) => el.style.setProperty("--sheet-h", `${Math.min(window.innerHeight, Math.max(80, h0 - (e.clientY - y0)))}px`);
      const up = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        handle.removeEventListener("pointercancel", up);
        el.classList.remove("moving");
        const h = el.getBoundingClientRect().height;
        if (h < window.innerHeight * 0.25) return closeWindow(name);
        if (h > window.innerHeight * 0.9) el.style.setProperty("--sheet-h", `${window.innerHeight}px`);
        ctx.onResize?.(name);
        if (bubble && !bubble.hidden) placeBubble();
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
      handle.addEventListener("pointercancel", up);
    });
}

// ---------- zavihek iz zgornje vrstice na stran ----------

let dropAt = null;
const tabOut = {
  allowed: (el) => windowsOn() && !sheetMode() && canFloat(el.dataset.view),
  isOut: (ev, rr) => ev.clientY > rr.bottom + 28,
  move: (el, ev) => {
    dropAt = sideAt(ev.clientX);
    showPreview(dropAt);
  },
  drop: (el, ev) => {
    showPreview(null);
    const name = el.dataset.view;
    if (wins.has(name)) {
      const w = wins.get(name);
      const g = layout.geo[name];
      place(w, dropAt ? { ...g, snap: dropAt, free: g.snap ? g.free : { w: g.w, h: g.h } } : { ...g, snap: null, x: ev.clientX - 140, y: ev.clientY - 18, ...(g.snap ? g.free || {} : {}) });
      saveLayout();
      focusWindow(name);
    } else openWindow(name, dropAt ? { snap: dropAt } : { x: ev.clientX, y: ev.clientY });
    dropAt = null;
  },
  cancel: () => {
    dropAt = null;
    showPreview(null);
  },
};

/** Opis za lebdenje nad zavihkom (dodatek k imenu zavihka). */
export function tabHint(tab) {
  return windowsOn() && !sheetMode() && tab.closest(".topbar .tabs") ? t("win.dragHint") : "";
}

// ---------- mehurček inštruktorja ----------

let bubble = null;
let drop = null;
let unread = 0;
let previewTimer = 0;
let bstate = readJson(BUBBLE_KEY, {});

function bubbleEl() {
  if (bubble) return bubble;
  bubble = document.createElement("div");
  bubble.id = "chat-bubble";
  bubble.className = "chat-bubble";
  bubble.hidden = true;
  bubble.innerHTML = `<button type="button" class="cb-main" aria-label="${t("win.bubble")}" title="${t("win.bubble")}">${icon("message-circle")}<b class="cb-badge" hidden></b></button>
    <button type="button" class="cb-x" aria-label="${t("win.bubbleHide")}" title="${t("win.bubbleHide")}">${icon("x")}</button>
    <button type="button" class="cb-preview" hidden><b>${t("nav.chat")}</b><span dir="auto"></span></button>`;
  drop = document.createElement("div");
  drop.className = "cb-drop";
  drop.hidden = true;
  drop.innerHTML = `${icon("x")}<span class="sr-only">${t("win.bubbleHide")}</span>`;
  document.body.append(bubble, drop);
  const main = bubble.querySelector(".cb-main");
  bubble.querySelector(".cb-x").addEventListener("click", dismissBubble);
  bubble.querySelector(".cb-preview").addEventListener("click", openChat);
  let p = null;
  main.addEventListener("pointerdown", (ev) => {
    if (ev.pointerType === "mouse" && ev.button !== 0) return;
    const r = bubble.getBoundingClientRect();
    p = { x: ev.clientX, y: ev.clientY, dx: ev.clientX - r.left, dy: ev.clientY - r.top, moved: false, id: ev.pointerId, samples: [] };
    addSample(p.samples, ev.clientX, ev.clientY, ev.timeStamp);
    main.setPointerCapture(ev.pointerId);
    if (ev.pointerType !== "mouse") p.timer = setTimeout(() => p && !p.moved && bubble.classList.add("show-x"), 500);
  });
  main.addEventListener("pointermove", (ev) => {
    if (!p || ev.pointerId !== p.id) return;
    addSample(p.samples, ev.clientX, ev.clientY, ev.timeStamp);
    if (!p.moved && Math.hypot(ev.clientX - p.x, ev.clientY - p.y) < 6) return;
    if (!p.moved) {
      p.moved = true;
      clearTimeout(p.timer);
      bubble.classList.add("dragging");
      hidePreview();
      drop.hidden = false;
    }
    // Blizu X-a se mehurček prilepi nanj (magnet), sicer sledi prstu.
    const c = dropCenter();
    const hot = inMagnet({ x: ev.clientX, y: ev.clientY }, c);
    if (hot && !drop.classList.contains("hot")) navigator.vibrate?.(8);
    drop.classList.toggle("hot", hot);
    bubble.classList.toggle("magnet", hot);
    bubble.style.left = `${hot ? c.x - 28 : ev.clientX - p.dx}px`;
    bubble.style.top = `${hot ? c.y - 28 : ev.clientY - p.dy}px`;
  });
  const up = (ev, cancel) => {
    if (!p || ev.pointerId !== p.id) return;
    clearTimeout(p.timer);
    // Vzorec ob spustu: kdor se ustavi in šele nato spusti, nima več hitrosti (ni flik).
    addSample(p.samples, ev.clientX, ev.clientY, ev.timeStamp);
    const { moved, samples } = p;
    p = null;
    // Prej je bil X ob spustu že skrit (getBoundingClientRect = 0), zato poteg nanj ni zaprl mehurčka.
    const close = moved && !cancel && shouldClose({ x: ev.clientX, y: ev.clientY }, samples, dropCenter());
    bubble.classList.remove("dragging", "magnet");
    if (close) return flyToDrop();
    drop.hidden = true;
    drop.classList.remove("hot");
    if (!moved) {
      if (!cancel && !bubble.classList.contains("show-x")) openChat();
      return;
    }
    bstate.side = ev.clientX < window.innerWidth / 2 ? "left" : "right";
    bstate.y = Math.min(0.92, Math.max(0.08, ev.clientY / window.innerHeight));
    ls.set(BUBBLE_KEY, JSON.stringify(bstate));
    placeBubble();
  };
  main.addEventListener("pointerup", (ev) => up(ev, false));
  main.addEventListener("pointercancel", (ev) => up(ev, true));
  main.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("pointerdown", (e) => {
    if (!bubble.contains(e.target)) {
      hidePreview();
      bubble.classList.remove("show-x");
    }
  });
  return bubble;
}
function dropCenter() {
  const r = drop.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
// Flik ali spust na X: mehurček odleti v X, se skrči in izgine.
function flyToDrop() {
  const c = dropCenter();
  drop.classList.add("hot");
  bubble.classList.add("closing");
  bubble.style.left = `${c.x - 28}px`;
  bubble.style.top = `${c.y - 28}px`;
  navigator.vibrate?.(12);
  setTimeout(() => {
    bubble.classList.remove("closing");
    drop.hidden = true;
    drop.classList.remove("hot");
    dismissBubble();
  }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220);
}
// Mehurček ne prekrije okna (npr. tipk kalkulatorja spodaj desno): najbližje prosto mesto ob robu,
// najprej na izbrani strani, nato na drugi.
function placeBubble() {
  const size = 56;
  const a = area();
  const pref = bstate.side === "left" ? "left" : "right";
  const lo = a.top + 8;
  let hi = Math.max(lo, a.bottom - size - 8);
  // Lekcija po korakih: krogi Nazaj · 1/12 · Naprej plavajo na dnu glavnega pogleda, mehurček ostane nad njimi.
  const st = document.querySelector("body > main.view:not([hidden]):not(.in-okno) .tb-stepper");
  if (st && st.offsetParent) hi = Math.max(lo, Math.min(hi, a.bottom - st.offsetHeight - size));
  const y0 = Math.min(Math.max(Math.round((bstate.y ?? 0.72) * window.innerHeight - size / 2), lo), hi);
  const xOf = (side) => (side === "left" ? 12 : window.innerWidth - size - 12);
  const rects = [...wins.values()].map((w) => w.el.getBoundingClientRect());
  const free = (x, y) => !rects.some((r) => x < r.right + 4 && x + size > r.left - 4 && y < r.bottom + 4 && y + size > r.top - 4);
  let spot = null;
  for (const side of [pref, pref === "left" ? "right" : "left"]) {
    const x = xOf(side);
    for (let d = 0; d <= hi - lo && !spot; d += 16) {
      if (y0 - d >= lo && free(x, y0 - d)) spot = { side, y: y0 - d };
      else if (y0 + d <= hi && free(x, y0 + d)) spot = { side, y: y0 + d };
    }
    if (spot) break;
  }
  // Ni prostega mesta: mehurček ne gre na tipke kalkulatorja, raje na drugo okno.
  if (!spot) {
    const calc = wins.get("graph")?.el.getBoundingClientRect();
    const onCalc = (side) => calc && xOf(side) < calc.right && xOf(side) + size > calc.left && y0 < calc.bottom && y0 + size > calc.top;
    spot = { side: onCalc(pref) ? (pref === "left" ? "right" : "left") : pref, y: y0 };
  }
  bubble.dataset.side = spot.side;
  bubble.style.left = `${xOf(spot.side)}px`;
  bubble.style.top = `${spot.y}px`;
}
function hidePreview() {
  clearTimeout(previewTimer);
  if (bubble) bubble.querySelector(".cb-preview").hidden = true;
}
function dismissBubble() {
  bstate.dismissed = ctx.chatInfo().key;
  ls.set(BUBBLE_KEY, JSON.stringify(bstate));
  unread = 0;
  refreshBubble();
}
function openChat() {
  unread = 0;
  hidePreview();
  if (!openWindow("chat")) ctx.showView("chat");
  refreshBubble();
}

/** Pokaže ali skrije mehurček glede na stanje klepeta (kliče app.js ob spremembi pogleda in pogovora). */
export function refreshBubble() {
  if (!ctx) return;
  // Zavihek je za ta profil skrit (npr. NPZ in matura po menjavi profila): njegovo okno se zapre.
  for (const name of [...wins.keys()]) if (!canFloat(name)) closeWindow(name);
  const info = ctx.chatInfo();
  const show = windowsOn() && !!info.key && !info.visible && !info.blocked && bstate.dismissed !== info.key;
  if (!show && !bubble) return;
  const b = bubbleEl();
  b.hidden = !show;
  if (!show) {
    unread = 0;
    hidePreview();
    b.classList.remove("show-x");
  } else placeBubble();
  const badge = b.querySelector(".cb-badge");
  badge.hidden = !unread;
  badge.textContent = unread > 9 ? "9+" : String(unread);
}

const plain = (s) =>
  String(s || "")
    .replace(/\$\$?([^$]*)\$\$?/g, "$1")
    .replace(/\\(?:frac|dfrac)\{([^}]*)\}\{([^}]*)\}/g, "$1/$2")
    .replace(/\\(?:cdot|times)/g, "·")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[*_#>`{}|]/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

/** Nov odgovor inštruktorja: če klepet ni na zaslonu, mehurček dobi značko in predogled (kot SMS). */
export function chatReply(text) {
  if (!ctx) return;
  const info = ctx.chatInfo();
  if (info.visible || !windowsOn()) return;
  unread++;
  refreshBubble();
  if (!bubble || bubble.hidden) return;
  const prev = bubble.querySelector(".cb-preview");
  const p = plain(text);
  prev.querySelector("span").textContent = p.length > 80 ? `${p.slice(0, 79).trimEnd()}…` : p;
  prev.hidden = !p;
  clearTimeout(previewTimer);
  previewTimer = setTimeout(hidePreview, 6000);
}

// ---------- nastavitev in ponastavitev ----------

function closeAll() {
  for (const name of [...wins.keys()]) closeWindow(name);
}

/** Ponastavi postavitev: vrstni red zavihkov, okna, mehurček in ločnice med deli strani. */
export function resetLayout() {
  closeAll();
  resetRows();
  resetSplits();
  layout = { geo: {}, open: [] };
  ls.del(KEY);
  bstate = {};
  ls.del(BUBBLE_KEY);
  refreshBubble();
}

function setOn(on) {
  ls.set(ON_KEY, on ? "1" : "0");
  if (!on) {
    const keep = layout.open;
    closeAll();
    layout.open = keep; // ob ponovnem vklopu se okna vrnejo
    saveLayout();
  }
  else restoreWindows(); // okna, ki so bila odprta ob izklopu
  const box = document.getElementById("okna-toggle");
  if (box) box.checked = on;
  refreshSplitters(); // ločnice med deli strani so pod isto nastavitvijo
  refreshBubble();
}

function mountSetting(box) {
  if (!box) return;
  box.hidden = false;
  box.innerHTML = `<label class="check-row"><input type="checkbox" id="okna-toggle"${windowsOn() ? " checked" : ""}>
      <span><b>${t("win.setting")}</b><small class="muted">${t("win.settingNote")} ${t("split.settingNote")}</small></span></label>
    <button type="button" class="secondary small okna-reset">${icon("rotate-ccw")}<span>${t("win.reset")}</span></button>`;
  box.querySelector("input").addEventListener("change", (e) => setOn(e.target.checked));
  box.querySelector(".okna-reset").addEventListener("click", () => {
    resetLayout();
    ctx.toast?.(t("win.resetDone"));
  });
}

/** Ob zagonu: okna, ki so bila odprta (samo na računalniku). */
export function restoreWindows() {
  if (!windowsOn() || sheetMode()) return;
  for (const name of [...layout.open]) openWindow(name, { restore: true });
}

/**
 * ctx: { showView(name), initView(name), leaveView(name), leaveMain(name), mainView(),
 *        chatInfo() → { key, visible, blocked }, onResize(name), toast(msg) }
 */
export function initOkna(opts) {
  ctx = opts;
  const layer = document.createElement("div");
  layer.id = "okna";
  layer.className = "okna";
  document.body.append(layer);
  const tabs = $(".topbar .tabs");
  makeRowSortable(tabs, "tabs", { item: ".tab", out: tabOut });
  // Četrto mesto spodnje vrstice menja pogled (Laboratorij, NPZ/matura); id mesta ostane »competition«, kot v shranjenih redih.
  makeRowSortable($("#tabbar"), "tabbar", { item: ".tab", idOf: (el) => (el.id === "competition-tab-m" ? "competition" : el.dataset.view) });
  // Spodnji list stoji nad spodnjo vrstico zavihkov, da navigacija ostane uporabna (okna.css, --tabbar-h).
  const tabbar = $("#tabbar");
  if (tabbar && "ResizeObserver" in window) new ResizeObserver(syncTabbarH).observe(tabbar);
  makeRowSortable($("#modebar"), "modebar", { item: "button" });
  document.querySelectorAll(".calc-modes").forEach((row) => makeRowSortable(row, "calc-modes", { item: "button" }));
  mountSetting(document.getElementById("okna-card"));
  window.addEventListener("evklid:device-setting", (e) => {
    if (e.detail?.key === "windows") setOn(e.detail.value !== "off");
  });
  let raf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      for (const w of wins.values()) if (!w.el.classList.contains("okno-sheet")) place(w, layout.geo[w.name] || defaultGeo());
      if (bubble && !bubble.hidden) placeBubble();
    });
  });
  window.addEventListener("evklid:stepper", () => bubble && !bubble.hidden && placeBubble());
  // Uvod, prijava in tekmovalna ura skrijejo mehurček (razredi na <body>).
  new MutationObserver(() => refreshBubble()).observe(document.body, { attributes: true, attributeFilter: ["class"] });
}
