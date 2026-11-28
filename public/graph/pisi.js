// Okno »Piši« znanstvenega kalkulatorja (j, 27. 11.: »naj se polje za pisavo obnaša kot resizable okno, ki docka ob
// strani ekrana«). Učenec piše s pisalom ali prstom; ko neha pisati, se zapis prebere (strežnik, model za branje) in
// postavi v vnos kalkulatorja. Okno je pripeto desno, levo ali spodaj (ločnica spremeni velikost) ali prosto
// (vlečenje za ⠿, kot spodaj desno spremeni velikost); ob robu se pripne. Postavitev se zapomni (ta naprava).
// Postavitev mreže: graph.css (.sc.sc-pisi-r/-l/-b/-f). Risalna površina: public/crnilo.js (zavračanje dlani).
import { createInk } from "../crnilo.js";

const KEY = "evklid.sci.pisi";
const MODES = ["r", "l", "b", "f"];
const SNAP = 90; // px od roba kalkulatorja: pripni
const PAUSE = 900; // ms brez nove poteze: preberi

const load = () => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY)) || {};
    return typeof s === "object" ? s : {};
  } catch {
    return {};
  }
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** Ali naj bo okno »Piši« ob odprtju kalkulatorja odprto: zapomnjena izbira, sicer na tablici (dotik, ≥ 700 px). */
export function writerDefaultOpen() {
  const s = load();
  if (typeof s.open === "boolean") return s.open;
  try {
    return matchMedia("(pointer: coarse) and (min-width: 700px) and (min-height: 600px)").matches;
  } catch {
    return false;
  }
}

/**
 * sc: koren kalkulatorja (.sc). o: { t, read(dataUrl) → Promise<{ text, message }>, onText(text), entry() → trenutni vnos,
 * onFail(), onClose(), onReading(bool) }
 */
export function createWriter(sc, o) {
  const { t } = o;
  let st = load();
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(st));
    } catch {}
  };
  const win = document.createElement("section");
  win.className = "sc-pisi";
  win.setAttribute("aria-label", t("sc.write"));
  win.innerHTML = `
    <div class="sc-pisi-rs" role="separator" tabindex="0" aria-label="${esc(t("sc.writeResize"))}"><span></span></div>
    <div class="sc-pisi-head">
      <button type="button" class="sc-pisi-drag" aria-label="${esc(t("sc.writeMove"))}" title="${esc(t("sc.writeMove"))}">⠿</button>
      <b class="sc-pisi-t">✎ ${esc(t("sc.write"))}</b>
      <span class="sc-pisi-sp"></span>
      <button type="button" data-a="eraser" aria-pressed="false">${esc(t("pad.eraser"))}</button>
      <button type="button" data-a="undo">${esc(t("pad.undo"))}</button>
      <button type="button" data-a="clear">${esc(t("pad.clear"))}</button>
      <button type="button" data-a="keys" class="sc-pisi-k">⌨ ${esc(t("pad.keys"))}</button>
    </div>
    <div class="sc-pisi-paper"><canvas class="ink" aria-label="${esc(t("pad.canvas"))}"></canvas></div>
    <p class="sc-pisi-hint" aria-live="polite"></p>
    <div class="sc-pisi-corner" aria-hidden="true"></div>`;
  const snaps = ["l", "r", "b"].map((z) => {
    const d = document.createElement("div");
    d.className = `sc-pisi-snap sc-pisi-snap-${z}`;
    d.hidden = true;
    d.textContent = t(z === "l" ? "sc.dockLeft" : z === "r" ? "sc.dockRight" : "sc.dockBottom");
    return d;
  });
  const hint = win.querySelector(".sc-pisi-hint");
  const showHint = (text, err = false) => {
    hint.textContent = text || t("sc.writeHint");
    hint.classList.toggle("sc-pisi-err", !!err);
  };
  let ink = null;
  let open = false;

  // ---------- postavitev ----------
  const box = () => sc.getBoundingClientRect();
  function modeNow() {
    const r = box();
    let m = MODES.includes(st.mode) ? st.mode : r.width >= 900 && r.width > r.height ? "r" : "b";
    if (m !== "b" && r.width < 700) m = "b"; // ozko: le spodaj
    return m;
  }
  // največja višina okna spodaj: na ozkem (telefon) okno nadomesti tipke, sicer tipke ostanejo nad njim
  const maxH = (r) => Math.max(160, r.height - 160 - (narrow(r) ? 0 : sc.querySelector(".sc-keys")?.offsetHeight || 0));
  const narrow = (r) => r.width < 700;
  function apply() {
    const m = modeNow();
    for (const x of MODES) sc.classList.toggle(`sc-pisi-${x}`, open && x === m);
    sc.classList.toggle("sc-pisi-on", open);
    const r = box();
    sc.classList.toggle("sc-pisi-narrow", open && narrow(r));
    const sep = win.querySelector(".sc-pisi-rs");
    let size = null;
    let lo = 0;
    let hi = 0;
    if (m === "r" || m === "l") {
      [lo, hi] = [280, Math.max(280, r.width - 320)];
      size = clamp(st.w || Math.round(r.width * 0.46), lo, hi);
      sc.style.setProperty("--pisi-w", `${size}px`);
    } else sc.style.removeProperty("--pisi-w");
    if (m === "b") {
      [lo, hi] = [160, maxH(r)];
      size = clamp(st.h || Math.round(r.height * (narrow(r) ? 0.5 : 0.36)), lo, hi);
      sc.style.setProperty("--pisi-h", `${size}px`);
    } else sc.style.removeProperty("--pisi-h");
    if (m === "f") {
      // stisnjeno (po zasuku ali manjšem oknu) zapišemo nazaj, da vlečenje kota ne skoči
      const f = st.f || {};
      const w = clamp(f.w || 560, 280, r.width);
      const h = clamp(f.h || 380, 200, r.height);
      st.f = { x: clamp(f.x ?? r.width - w - 24, 0, r.width - w), y: clamp(f.y ?? 80, 0, r.height - h), w, h };
      Object.assign(win.style, { left: `${st.f.x}px`, top: `${st.f.y}px`, width: `${w}px`, height: `${h}px` });
    } else for (const p of ["left", "top", "width", "height"]) win.style.removeProperty(p);
    sep.setAttribute("aria-orientation", m === "b" ? "horizontal" : "vertical");
    if (size !== null) Object.entries({ "aria-valuenow": size, "aria-valuemin": lo, "aria-valuemax": hi }).forEach(([k, v]) => sep.setAttribute(k, String(Math.round(v))));
    requestAnimationFrame(() => ink?.fit());
  }
  // vlečenje: konec (pointerup ali pointercancel) odstrani vse poslušalce te poteze
  const track = (el, move, done) => {
    const end = (ev) => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      done(ev);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  };

  // ---------- ločnica (pripeto) ----------
  const rs = win.querySelector(".sc-pisi-rs");
  const setSize = (m, v) => {
    const r = box();
    if (m === "b") st.h = Math.round(clamp(v, 160, maxH(r)));
    else st.w = Math.round(clamp(v, 280, r.width - 320));
    apply();
  };
  rs.addEventListener("pointerdown", (e) => {
    const m = modeNow();
    if (m === "f") return;
    e.preventDefault();
    try {
      rs.setPointerCapture(e.pointerId);
    } catch {}
    rs.classList.add("dragging");
    const move = (ev) => {
      const r = box();
      setSize(m, m === "r" ? r.right - ev.clientX : m === "l" ? ev.clientX - r.left : r.bottom - ev.clientY);
    };
    track(rs, move, () => {
      rs.classList.remove("dragging");
      save();
    });
  });
  rs.addEventListener("keydown", (e) => {
    const m = modeNow();
    const d = { ArrowLeft: -24, ArrowRight: 24, ArrowUp: -24, ArrowDown: 24 }[e.key];
    if (!d || m === "f") return;
    e.preventDefault();
    const cur = m === "b" ? win.getBoundingClientRect().height : win.getBoundingClientRect().width;
    // desno pripeto: puščica levo okno poveča; levo pripeto obratno; spodaj: gor poveča
    setSize(m, cur + (m === "r" ? -d : m === "l" ? d : -d));
    save();
  });

  // ---------- vlečenje (prosto okno) in pripenjanje ----------
  const drag = win.querySelector(".sc-pisi-drag");
  drag.addEventListener("pointerdown", (e) => {
    if (box().width < 700) return; // ozko: okno ostane spodaj
    e.preventDefault();
    const r = box();
    const w0 = win.getBoundingClientRect();
    const w = Math.min(w0.width, st.f?.w || 560);
    const h = Math.min(w0.height, st.f?.h || 380);
    // prijem ostane pod prstom (ob odpetju je okno ožje: prijem ostane na levem robu glave)
    const dx = Math.min(e.clientX - w0.left, w - 40);
    const dy = e.clientY - w0.top;
    st.mode = "f";
    st.f = { x: e.clientX - r.left - dx, y: e.clientY - r.top - dy, w, h };
    apply();
    try {
      drag.setPointerCapture(e.pointerId);
    } catch {}
    for (const s of snaps) s.hidden = false;
    let zone = null;
    const move = (ev) => {
      const b = box();
      st.f.x = clamp(ev.clientX - b.left - dx, 0, b.width - st.f.w);
      st.f.y = clamp(ev.clientY - b.top - dy, 0, b.height - st.f.h);
      zone = ev.clientX - b.left < SNAP ? "l" : b.right - ev.clientX < SNAP ? "r" : b.bottom - ev.clientY < SNAP ? "b" : null;
      for (const s of snaps) s.classList.toggle("on", s.classList.contains(`sc-pisi-snap-${zone}`));
      apply();
    };
    track(drag, move, (ev) => {
      for (const s of snaps) s.hidden = true;
      if (zone && ev.type === "pointerup") st.mode = zone; // prekinjena poteza (pointercancel) ne pripne
      apply();
      save();
    });
  });
  // tipkovnica: ⠿ + Enter kroži med pripeto desno, spodaj, levo
  drag.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    const order = box().width < 700 ? ["b"] : ["r", "b", "l"];
    st.mode = order[(order.indexOf(modeNow()) + 1) % order.length];
    apply();
    save();
  });
  const corner = win.querySelector(".sc-pisi-corner");
  corner.addEventListener("pointerdown", (e) => {
    if (modeNow() !== "f") return;
    e.preventDefault();
    try {
      corner.setPointerCapture(e.pointerId);
    } catch {}
    const x0 = e.clientX;
    const y0 = e.clientY;
    const { w, h } = st.f;
    const move = (ev) => {
      const b = box();
      st.f.w = Math.round(clamp(w + ev.clientX - x0, 280, b.width - st.f.x));
      st.f.h = Math.round(clamp(h + ev.clientY - y0, 200, b.height - st.f.y));
      apply();
    };
    track(corner, move, save);
  });

  // ---------- branje po premoru ----------
  let timer = 0;
  let busy = false;
  let readV = -1; // različica zapisa, ki je že prebrana (ali se bere)
  function schedule() {
    clearTimeout(timer);
    if (!ink.hasInk()) {
      readV = ink.version;
      showHint();
      return;
    }
    timer = setTimeout(readNow, PAUSE);
  }
  async function readNow() {
    if (!open || !ink.hasInk()) return;
    if (ink.writing()) return schedule();
    const v = ink.version;
    if (v === readV || busy) return;
    const image = ink.exportImage();
    if (!image) return;
    const before = o.entry?.(); // vnos ob začetku branja: če ga učenec medtem spremeni, rezultat zavržemo
    busy = true;
    readV = v;
    showHint(t("pad.reading"));
    o.onReading?.(true);
    let res = null;
    let err = null;
    try {
      res = await o.read(image);
    } catch (e) {
      err = e?.message || t("pad.readFail");
    } finally {
      busy = false;
      o.onReading?.(false);
    }
    if (!open) return; // okno zaprto (⌨ Tipke) med branjem
    if (ink.version !== v) return schedule(); // med branjem je nastala nova poteza: preberemo novejši zapis
    if (o.entry && o.entry() !== before) return; // učenec je medtem tipkal: tipkano ostane
    if (err || !res?.text) {
      readV = -1; // ob naslednji potezi znova
      o.onFail?.();
      return showHint(err || res?.message || t("pad.readFail"), true);
    }
    showHint();
    o.onText(res.text);
  }

  // ---------- gumbi ----------
  win.querySelector(".sc-pisi-head").addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]");
    if (!b) return;
    const a = b.dataset.a;
    if (a === "eraser") {
      ink.tool = ink.tool === "eraser" ? "pen" : "eraser";
      b.setAttribute("aria-pressed", String(ink.tool === "eraser"));
    } else if (a === "undo") ink.undo();
    else if (a === "clear") ink.clear();
    else if (a === "keys") api.close();
  });

  let ro = null;
  const api = {
    el: win,
    get isOpen() {
      return open;
    },
    open() {
      if (open) return;
      open = true;
      if (!win.isConnected) sc.append(win, ...snaps);
      win.hidden = false;
      if (!ink) {
        ink = createInk(win.querySelector("canvas.ink"));
        ink.onChange = schedule;
        // dvojni dotik v crnilo.js preklopi pisalo/radirko: gumb »Radirka« naj to pokaže
        ink.onTool = (tl) => win.querySelector('[data-a="eraser"]')?.setAttribute("aria-pressed", String(tl === "eraser"));
        ro = new ResizeObserver(() => apply());
        ro.observe(sc);
      }
      showHint();
      st.open = true;
      save();
      apply();
    },
    close(remember = true) {
      if (!open) return;
      open = false;
      clearTimeout(timer);
      const focused = win.contains(document.activeElement); // ⌨ Tipke: fokus ne pade na stran
      win.hidden = true;
      if (remember) {
        st.open = false;
        save();
      }
      apply();
      o.onClose?.(focused);
    },
    /** Po izračunu: nov račun na prazen list. */
    clear() {
      if (ink?.hasInk()) ink.clear();
      readV = -1;
    },
    get mode() {
      return modeNow();
    },
  };
  return api;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
