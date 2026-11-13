// Ločnice med deli strani (docs/oblikovanje.md, »Spreminjanje velikosti delov«).
// Ločnica stoji med stolpcema mreže (seznam pogovorov in klepet, Učna pot, naloga in razlaga, lekcija in
// simulacije, kalkulatorja). Poteg, tipkovnica (puščice ±16 px, Home/End) ali dvoklik (privzeta velikost)
// spremeni spremenljivko CSS na vsebniku (npr. --split-chat), ki jo uporablja grid-template-columns, zato
// postavitev ostane v CSS. Velikosti so shranjene na tej napravi (evklid.razdelilnik) in se ob ožjem
// vsebniku (zaslon ali premično okno) stisnejo, a shranjena vrednost ostane. Ločnica je samo, ko ima mreža
// dva stolpca (ne na telefonu in ne v ozkem oknu) in je vključena nastavitev »Premična okna«.
// Položaj ločnice je izračunan v zaslonskih koordinatah (left/top), zato v RTL sledi vidni strani.

const KEY = "evklid.razdelilnik";
const ON_KEY = "evklid.windows";
const STEP = 16;
const COLLAPSE_AT = 48; // px pod najmanjšo velikostjo: stranski seznam se skrije
const all = new Set();

function readAll() {
  try {
    const o = JSON.parse(localStorage.getItem(KEY));
    return o && typeof o === "object" && !Array.isArray(o) ? o : {};
  } catch {
    return {};
  }
}
function writeAll(o) {
  try {
    if (Object.keys(o).length) localStorage.setItem(KEY, JSON.stringify(o));
    else localStorage.removeItem(KEY);
  } catch {}
}

/** Shranjena velikost (px) ali null; 0 pomeni skrit stranski seznam. */
export function readSize(key) {
  const v = readAll()[key];
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null;
}
/** Shrani velikost (null pozabi in vrne privzeto). */
export function saveSize(key, v) {
  const o = readAll();
  if (v == null) delete o[key];
  else o[key] = Math.round(v);
  writeAll(o);
}
export const clampSize = (v, min, max) => Math.round(Math.min(Math.max(v, min), Math.max(min, max)));
/** Meje za razpoložljiv prostor avail (oba dela skupaj, brez razmika): drugi del ima vsaj otherMin. */
export function limits(avail, o) {
  const cap = typeof o.max === "function" ? o.max(avail) : (o.max ?? Infinity);
  return { min: o.min, max: Math.max(o.min, Math.floor(Math.min(cap, avail - (o.otherMin ?? 0)))) };
}
/** Velikost, ki jo uporabimo: shranjena, stisnjena v meje (0 ostane 0, če se seznam sme skriti). */
export function sizeFor(stored, lim, collapse = false) {
  if (stored == null) return null;
  if (stored === 0 && collapse) return 0;
  return clampSize(stored, lim.min, lim.max);
}
export function splitsOn() {
  try {
    return localStorage.getItem(ON_KEY) !== "0";
  } catch {
    return true;
  }
}
/** Ponastavi postavitev: vse ločnice na privzeto velikost. */
export function resetSplits() {
  writeAll({});
  refreshSplitters();
}
/** Po spremembi nastavitve »Premična okna«. */
export function refreshSplitters() {
  for (const s of all) s.refresh();
}

const PHONE = "(max-width: 760px), (max-height: 500px) and (pointer: coarse)";
const px = (v) => parseFloat(v) || 0;
const tracksOf = (v) =>
  String(v || "")
    .trim()
    .split(/\s+/)
    .map(Number.parseFloat);

/**
 * Ločnica med dvema deloma mreže. host: trajni element, ki dobi spremenljivko in ločnico (position: relative).
 * o: { key, varName, axis: "x"|"y", side: "start"|"end" (kateri del meri velikost), min, max (px ali f(avail)),
 *      otherMin, grid: () => element z mrežo (privzeto host), label, hint, collapse, onCollapse(bool) }
 */
export function makeSplitter(host, o) {
  const x = (o.axis || "x") === "x";
  const gridOf = o.grid || (() => host);
  const h = document.createElement("div");
  h.className = `split-handle split-${x ? "x" : "y"}`;
  h.setAttribute("role", "separator");
  h.setAttribute("aria-orientation", x ? "vertical" : "horizontal");
  if (o.label) h.setAttribute("aria-label", o.label);
  if (o.hint) h.title = o.hint;
  // Ob menjavi jezika napisa prevede i18n.js (data-i18n-aria, data-i18n-title).
  if (o.labelKey) h.dataset.i18nAria = o.labelKey;
  if (o.hintKey) h.dataset.i18nTitle = o.hintKey;
  h.tabIndex = 0;
  h.hidden = true;
  h.innerHTML = '<span class="split-grip" aria-hidden="true"></span>';
  host.classList.add("split-host");
  host.append(h);

  let lim = { min: o.min, max: o.min };
  let known = false; // lim je izmerjen
  let applied; // px, 0 ali null (privzeto)
  let collapsed = false;
  let drag = null;
  let lastOpen = null; // zadnja velikost pred skritjem seznama
  let watched = [];

  // Mreža in njeni stolpci (ali vrstice) ali null, ko ločnice ni.
  function measure() {
    const g = gridOf();
    if (!g || !g.isConnected || !g.getClientRects().length || !splitsOn() || matchMedia(PHONE).matches) return null;
    const cs = getComputedStyle(g);
    if (!/grid/.test(cs.display)) return null;
    const tracks = tracksOf(x ? cs.gridTemplateColumns : cs.gridTemplateRows);
    if (tracks.length < 2 || tracks.some((v) => !Number.isFinite(v))) return null;
    const gap = px(x ? cs.columnGap : cs.rowGap);
    const rtl = x && cs.direction === "rtl";
    const b = o.side === "end" ? tracks.length - 2 : 0; // ločnica za tem stolpcem
    let at = gap * b + gap / 2;
    for (let i = 0; i <= b; i++) at += tracks[i];
    const size = tracks[o.side === "end" ? tracks.length - 1 : 0];
    const pS = px(x ? cs.paddingLeft : cs.paddingTop);
    const pE = px(x ? cs.paddingRight : cs.paddingBottom);
    const inner = (x ? g.clientWidth : g.clientHeight) - pS - pE;
    // Prečna smer: od začetka do konca vsebine mreže.
    const cross = tracksOf(x ? cs.gridTemplateRows : cs.gridTemplateColumns);
    const cGap = px(x ? cs.rowGap : cs.columnGap);
    let len = cross.every(Number.isFinite) ? cross.reduce((a, v) => a + v, 0) + cGap * (cross.length - 1) : NaN;
    const cpS = px(x ? cs.paddingTop : cs.paddingLeft);
    if (!Number.isFinite(len)) len = (x ? g.clientHeight : g.clientWidth) - cpS - px(x ? cs.paddingBottom : cs.paddingRight);
    // Izhodišče: zgornji levi rob notranjosti host (absolutno postavljena ločnica se premika z vsebino).
    let ox = 0;
    let oy = 0;
    if (g !== host) {
      const gr = g.getBoundingClientRect();
      const hr = host.getBoundingClientRect();
      ox = gr.left - hr.left - host.clientLeft + host.scrollLeft + g.clientLeft;
      oy = gr.top - hr.top - host.clientTop + host.scrollTop + g.clientTop;
    }
    const pos = x ? (rtl ? ox + g.clientWidth - pE - at : ox + pS + at) : oy + pS + at;
    const start = x ? oy + cpS : ox + cpS;
    // dir: koliko se del poveča, ko se ločnica premakne za 1 px desno (dol).
    const visualFirst = o.side === "end" ? rtl : !rtl;
    return { pos, start, len, size, avail: inner - gap * (tracks.length - 1), dir: visualFirst ? 1 : -1 };
  }

  function setSize(v) {
    if (v === applied) return false;
    applied = v;
    if (v == null) host.style.removeProperty(o.varName);
    else host.style.setProperty(o.varName, `${v}px`);
    const c = v === 0;
    if (c !== collapsed) {
      collapsed = c;
      host.classList.toggle("split-collapsed", c);
      o.onCollapse?.(c);
    }
    return true;
  }

  function watch(g) {
    const els = g ? [g, ...g.children].filter((el) => el !== h && el !== host) : []; // host je opazovan vedno
    if (els.length === watched.length && els.every((el, i) => el === watched[i])) return;
    for (const el of watched) ro?.unobserve(el);
    for (const el of els) ro?.observe(el);
    watched = els;
  }

  function refresh() {
    if (h.parentNode !== host) host.append(h);
    const g = gridOf();
    if (!g || !g.isConnected || !g.getClientRects().length) {
      // Del ni prikazan (drug pogled, nova vsebina): velikost ostane, da je ob ponovnem prikazu prava že v prvi sliki.
      if (!g?.isConnected) watch(null);
      h.hidden = true;
      if (!splitsOn() || matchMedia(PHONE).matches) setSize(null);
      else setSize(sizeFor(readSize(o.key), known ? lim : { min: o.min, max: typeof o.max === "number" ? o.max : Infinity }, o.collapse));
      return;
    }
    let m = measure();
    watch(m ? gridOf() : null);
    if (!m) {
      h.hidden = true;
      setSize(null);
      return;
    }
    lim = limits(m.avail, o);
    known = true;
    const want = drag ? drag.v : readSize(o.key);
    if (setSize(sizeFor(want, lim, o.collapse))) m = measure() || m;
    h.hidden = false;
    h.style.left = `${x ? m.pos : m.start}px`;
    h.style.top = `${x ? m.start : m.pos}px`;
    h.style[x ? "height" : "width"] = `${Math.max(0, m.len)}px`;
    h.setAttribute("aria-valuemin", String(o.collapse ? 0 : lim.min));
    h.setAttribute("aria-valuemax", String(lim.max));
    h.setAttribute("aria-valuenow", String(Math.round(collapsed ? 0 : m.size)));
  }

  let raf = 0;
  const schedule = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(refresh);
  };
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(schedule) : null;
  ro?.observe(host);
  new MutationObserver(schedule).observe(host, { childList: true });

  const commit = (v) => {
    if (v > 0) lastOpen = v;
    saveSize(o.key, v);
    refresh();
  };
  const next = (v) => (o.collapse && v < lim.min - COLLAPSE_AT ? 0 : clampSize(v, lim.min, lim.max));

  h.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const m = measure();
    if (!m) return;
    e.preventDefault();
    h.setPointerCapture?.(e.pointerId);
    drag = { p: x ? e.clientX : e.clientY, s: collapsed ? 0 : m.size, dir: m.dir, v: collapsed ? 0 : Math.round(m.size), id: e.pointerId };
    h.classList.add("dragging");
    document.body.classList.add("splitting", x ? "splitting-x" : "splitting-y");
  });
  h.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.v = next(drag.s + ((x ? e.clientX : e.clientY) - drag.p) * drag.dir);
    schedule();
  });
  const end = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const v = drag.v;
    const moved = v !== Math.round(drag.s);
    drag = null;
    h.classList.remove("dragging");
    document.body.classList.remove("splitting", "splitting-x", "splitting-y");
    if (moved) commit(v);
    else refresh();
  };
  h.addEventListener("pointerup", end);
  h.addEventListener("pointercancel", end);
  h.addEventListener("lostpointercapture", end);
  h.addEventListener("dblclick", () => {
    lastOpen = null;
    commit(null);
  });
  h.addEventListener("keydown", (e) => {
    const m = measure();
    if (!m) return;
    const cur = collapsed ? 0 : m.size;
    const fwd = x ? "ArrowRight" : "ArrowDown";
    const back = x ? "ArrowLeft" : "ArrowUp";
    let v;
    if (e.key === fwd || e.key === back) {
      // Skriti seznam odpre samo puščica v smeri, ki ga poveča.
      if (collapsed && (e.key === fwd ? 1 : -1) * m.dir < 0) return e.preventDefault();
      v = collapsed ? lim.min : clampSize(cur + (e.key === fwd ? STEP : -STEP) * m.dir, lim.min, lim.max);
    } else if (e.key === "Home") v = lim.min;
    else if (e.key === "End") v = lim.max;
    else if (e.key === "Enter" && o.collapse) v = collapsed ? (lastOpen ?? null) : 0;
    else return;
    e.preventDefault();
    if (!collapsed && cur > 0 && v === 0) lastOpen = Math.round(cur);
    commit(v);
  });

  const api = {
    el: h,
    refresh,
    /** Pokaže skriti stranski seznam (zadnja velikost ali privzeta). */
    expand() {
      if (collapsed) commit(lastOpen);
    },
    get collapsed() {
      return collapsed;
    },
  };
  all.add(api);
  schedule();
  return api;
}
