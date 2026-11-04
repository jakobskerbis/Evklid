// Vrstice zavihkov in načinov, ki jih učenec preuredi s potegom (docs/oblikovanje.md, »Premična okna«).
// Miška: poteg po vrstici za vsaj 6 px. Dotik: dolg pritisk (0,4 s), nato poteg. Tipkovnica: Alt+Shift+puščica.
// Vrstni red je shranjen na tej napravi (localStorage evklid.vrsta.<ime>); nove ali skrite postavke
// ostanejo na svojem privzetem mestu. Zgornja vrstica zavihkov ima še »out«: poteg navzdol iz vrstice
// odpre pogled v oknu (public/okna.js).

const PREFIX = "evklid.vrsta.";
const LONG_PRESS = 400;
const rows = new Map(); // ime → [{ row, opts, def }]

// Učbenik in Laboratorij sta od 4. 11. 2026 zavihka gumba »Uči se« (public/uci-se.js): v shranjenem redu zgornje in
// spodnje vrstice »Uči se« dobi mesto, ki ga je imel Učbenik, Laboratorij odpade.
const fromOld = (ids) => (ids.includes("uci") ? ids : ids.map((id) => (id === "textbook" ? "uci" : id)).filter((id) => id !== "lab"));
const read = (key) => {
  try {
    const v = JSON.parse(localStorage.getItem(PREFIX + key));
    if (!Array.isArray(v)) return null;
    return key === "tabs" || key === "tabbar" ? fromOld(v) : v;
  } catch {
    return null;
  }
};
const write = (key, ids) => {
  try {
    if (ids) localStorage.setItem(PREFIX + key, JSON.stringify(ids));
    else localStorage.removeItem(PREFIX + key);
  } catch {}
};
const defaultId = (el) => el.dataset.view || el.dataset.mode || el.dataset.calcMode || el.dataset.tab || el.dataset.sort || "";

function itemsOf(row, opts) {
  return [...row.children].filter((el) => el.matches(opts.item) && opts.idOf(el));
}

// Postavi postavke v shranjeni red. Neznane (nove) postavke obdržijo svoj indeks.
function applyOrder(row, opts, ids) {
  const items = itemsOf(row, opts);
  if (!ids?.length || items.length < 2) return;
  const rank = new Map(ids.map((id, i) => [id, i]));
  const known = items.filter((el) => rank.has(opts.idOf(el))).sort((a, b) => rank.get(opts.idOf(a)) - rank.get(opts.idOf(b)));
  let k = 0;
  const ordered = items.map((el) => (rank.has(opts.idOf(el)) ? known[k++] : el));
  if (ordered.every((el, i) => el === items[i])) return;
  const anchor = document.createComment("");
  items[0].before(anchor);
  anchor.after(...ordered);
  anchor.remove();
}

function save(key, row, opts) {
  const ids = itemsOf(row, opts).map(opts.idOf);
  write(key, ids);
  // Druge vrstice z istim imenom (npr. načini kalkulatorja v zavihku in čez cel zaslon) dobijo isti red.
  for (const o of rows.get(key) || []) if (o.row !== row) applyOrder(o.row, o.opts, ids);
}

/** Vrne vse vrstice v privzeti red in pozabi shranjene. */
export function resetRows() {
  for (const [key, list] of rows) {
    write(key, null);
    for (const { row, opts, def } of list) applyOrder(row, opts, def);
  }
}

/**
 * Vrstico naredi preurejljivo. key: ime za shranjevanje (ista imena si delijo red).
 * opts.item: izbirnik postavk (privzeto neposredni gumbi), opts.idOf(el): trajni id postavke,
 * opts.out: { allowed(el), isOut(ev, rowRect), move(el, ev), drop(el, ev), cancel() } za poteg iz vrstice.
 */
export function makeRowSortable(row, key, opts = {}) {
  if (!row || row.dataset.sortable) return;
  opts = { item: "button", idOf: defaultId, ...opts };
  row.dataset.sortable = key;
  row.classList.add("vr-row");
  const def = itemsOf(row, opts).map(opts.idOf);
  // Vrstice, ki se izrišejo znova (npr. zavihki Zbirk), ne ostanejo v seznamu.
  rows.set(key, [...(rows.get(key) || []).filter((o) => o.row.isConnected), { row, opts, def }]);
  applyOrder(row, opts, read(key));

  let drag = null; // { el, x, y, touch, armed, timer, ghost, mark, out, moved }

  const visible = () => itemsOf(row, opts).filter((el) => el.offsetParent !== null);
  const vertical = () => {
    const v = visible();
    if (v.length < 2) return false;
    const a = v[0].getBoundingClientRect();
    const b = v[1].getBoundingClientRect();
    return Math.abs(b.top - a.top) > Math.abs(b.left - a.left);
  };
  const rtl = () => getComputedStyle(row).direction === "rtl";

  function arm() {
    drag.armed = true;
    drag.el.classList.add("vr-lift");
    if (drag.touch) navigator.vibrate?.(12);
  }
  function ghostAt(ev) {
    if (!drag.ghost) {
      const r = drag.el.getBoundingClientRect();
      const g = drag.el.cloneNode(true);
      g.classList.add("vr-ghost");
      g.removeAttribute("id");
      g.setAttribute("aria-hidden", "true");
      g.style.width = `${r.width}px`;
      g.style.height = `${r.height}px`;
      document.body.append(g);
      drag.ghost = g;
      drag.dx = ev.clientX - r.left;
      drag.dy = ev.clientY - r.top;
      drag.el.classList.add("vr-dragging");
    }
    drag.ghost.style.left = `${ev.clientX - drag.dx}px`;
    drag.ghost.style.top = `${ev.clientY - drag.dy}px`;
  }
  // Mesto vstavljanja: postavka, pred katero pride vlečena (null = na konec). Najbližja postavka in
  // stran glede na njeno sredino, zato deluje tudi v mreži (načini na Učni poti na telefonu).
  function target(ev) {
    const vert = vertical();
    const flip = !vert && rtl();
    const vis = visible().filter((el) => el !== drag.el);
    let best = null;
    let bd = Infinity;
    for (const el of vis) {
      const r = el.getBoundingClientRect();
      const d = Math.hypot(ev.clientX - (r.left + r.width / 2), ev.clientY - (r.top + r.height / 2));
      if (d < bd) {
        bd = d;
        best = el;
      }
    }
    if (!best) return null;
    const r = best.getBoundingClientRect();
    const before = vert ? ev.clientY < r.top + r.height / 2 : flip ? ev.clientX > r.left + r.width / 2 : ev.clientX < r.left + r.width / 2;
    return before ? best : vis[vis.indexOf(best) + 1] || null;
  }
  function markAt(before) {
    if (!drag.mark) {
      drag.mark = document.createElement("div");
      drag.mark.className = "vr-mark";
      document.body.append(drag.mark);
    }
    const vert = vertical();
    const v = visible().filter((el) => el !== drag.el);
    const ref = before || v.at(-1);
    if (!ref) return;
    const r = ref.getBoundingClientRect();
    const m = drag.mark.style;
    drag.mark.classList.toggle("h", vert);
    if (vert) {
      Object.assign(m, { left: `${r.left}px`, width: `${r.width}px`, height: "3px", top: `${(before ? r.top : r.bottom) - 2}px` });
    } else {
      const startEdge = rtl() ? r.right : r.left;
      const endEdge = rtl() ? r.left : r.right;
      Object.assign(m, { top: `${r.top}px`, height: `${r.height}px`, width: "3px", left: `${(before ? startEdge : endEdge) - 1.5}px` });
    }
    drag.mark.hidden = false;
  }
  function end() {
    if (!drag) return;
    clearTimeout(drag.timer);
    drag.el.classList.remove("vr-lift", "vr-dragging");
    drag.ghost?.remove();
    drag.mark?.remove();
    document.body.classList.remove("vr-busy");
    drag = null;
  }
  // Klik po potegu ne sme odpreti zavihka.
  function swallowClick() {
    const stop = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener("click", stop, { capture: true, once: true });
    setTimeout(() => window.removeEventListener("click", stop, { capture: true }), 0);
  }

  row.addEventListener("pointerdown", (ev) => {
    if (drag || !ev.isPrimary || (ev.pointerType === "mouse" && ev.button !== 0)) return;
    const el = ev.target.closest(opts.item);
    if (!el || el.parentElement !== row || !opts.idOf(el)) return;
    drag = { el, pid: ev.pointerId, x: ev.clientX, y: ev.clientY, touch: ev.pointerType !== "mouse", armed: false };
    // Kazalec ostane pri postavki tudi ob hitrem potegu iz vrstice (klik gre še vedno na postavko).
    try {
      el.setPointerCapture(ev.pointerId);
    } catch {}
    if (drag.touch) drag.timer = setTimeout(() => drag && arm(), LONG_PRESS);
  });
  row.addEventListener("pointermove", (ev) => {
    if (!drag || ev.pointerId !== drag.pid) return;
    const dist = Math.hypot(ev.clientX - drag.x, ev.clientY - drag.y);
    if (!drag.armed) {
      if (drag.touch) {
        if (dist > 8) end(); // pomik pred dolgim pritiskom: drsenje vrstice, ne urejanje
        return;
      }
      if (dist < 6) return;
      arm();
    }
    drag.moved = true;
    document.body.classList.add("vr-busy");
    ghostAt(ev);
    const rr = row.getBoundingClientRect();
    const out = !!opts.out?.allowed(drag.el) && opts.out.isOut(ev, rr);
    if (out !== drag.out) {
      drag.out = out;
      drag.ghost.classList.toggle("vr-out", out);
      if (!out) opts.out?.cancel();
    }
    if (out) {
      if (drag.mark) drag.mark.hidden = true;
      opts.out.move(drag.el, ev);
    } else markAt(target(ev));
  });
  const finish = (ev, cancel) => {
    if (!drag || ev.pointerId !== drag.pid) return;
    const { el, moved, out } = drag;
    if (moved) swallowClick();
    if (moved && !cancel) {
      if (out) opts.out.drop(el, ev);
      else {
        const before = target(ev);
        if (before !== el && before !== el.nextElementSibling) {
          if (before) before.before(el);
          else itemsOf(row, opts).at(-1).after(el);
          save(key, row, opts);
        }
      }
    } else if (out) opts.out.cancel();
    end();
  };
  row.addEventListener("pointerup", (ev) => finish(ev, false));
  row.addEventListener("pointercancel", (ev) => {
    if (drag?.out) opts.out.cancel();
    finish(ev, true);
  });
  // Med dolgim pritiskom in potegom na dotik se vrstica ne drsi in ne odpre se priročni meni.
  row.addEventListener("touchmove", (e) => drag?.armed && e.cancelable && e.preventDefault(), { passive: false });
  row.addEventListener("contextmenu", (e) => drag && e.preventDefault());
  row.addEventListener("keydown", (e) => {
    if (!e.altKey || !e.shiftKey || !/^Arrow(Left|Right|Up|Down)$/.test(e.key)) return;
    const el = e.target.closest(opts.item);
    if (!el || el.parentElement !== row) return;
    e.preventDefault();
    const back = e.key === "ArrowUp" || (e.key === "ArrowLeft") !== rtl();
    const v = visible();
    const i = v.indexOf(el);
    const other = v[back ? i - 1 : i + 1];
    if (!other) return;
    if (back) other.before(el);
    else other.after(el);
    el.focus();
    save(key, row, opts);
  });
}
