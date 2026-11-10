// Ogrodje za lastne simulacije v učbeniku (brez knjižnic: SVG, canvas, drsniki).
// Vsaka simulacija je funkcija (el, opts) => void, ki vse nariše v el.
// Barve jemljemo iz CSS spremenljivk, da delujejo v svetli in temni temi.

import { okrasi, vstavi } from "./materiali.js";

export const NS = "http://www.w3.org/2000/svg";

// Število s slovensko decimalno vejico.
export function fmt(x, d = 2) {
  if (!Number.isFinite(x)) return "–";
  const r = Number(x.toFixed(d));
  return String(Object.is(r, -0) ? 0 : r).replace(".", ",").replace("-", "−");
}
// Število za KaTeX (decimalna vejica brez presledka).
export const tfmt = (x, d = 2) => fmt(x, d).replace("−", "-").replace(",", "{,}");

// Kombinirajoča črta (x̄ = x + U+0304) se v pisavi aplikacije izriše zamaknjeno kot »x‾« (j, 2. 11.
// 2026), zato črko s črto izrišemo kot črko s črto nad njo (razred ovl, text-decoration: overline).
const BAR = /(.)\u0304/;
const barParts = (t) => String(t).split(/(.\u0304)/).filter(Boolean).map((p) => (BAR.test(p) && p.length === 2 ? { bar: p[0] } : p));
export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const k of kids.flat()) {
    if (k == null || k === false) continue;
    if (typeof k === "string" && BAR.test(k)) for (const p of barParts(k)) el.append(typeof p === "string" ? p : Object.assign(document.createElement("span"), { className: "ovl", textContent: p.bar }));
    else el.append(k);
  }
  return el;
}

// SVG element; text = besedilo za <text>.
export function s(tag, attrs = {}, parent, text) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) if (v != null) el.setAttribute(k, v);
  if (text != null && BAR.test(String(text))) {
    for (const p of barParts(text)) {
      if (typeof p === "string") el.append(p);
      else {
        const t = document.createElementNS(NS, "tspan");
        t.setAttribute("class", "ovl");
        t.textContent = p.bar;
        el.append(t);
      }
    }
  } else if (text != null) el.textContent = text;
  if (parent) parent.append(el);
  // materiali laboratorija (steklo, tekočina, kovina, miza …): okras po razredu, glej materiali.js
  if (parent && (attrs?.class || attrs?.fill)) okrasi(el, attrs.class, attrs.fill);
  return el;
}

let uid = 0;
export function svgBox(w, hgt, cls = "") {
  const svg = s("svg", { viewBox: `0 0 ${w} ${hgt}`, class: `demo-svg ${cls}`, role: "img" });
  svg.uid = `s${++uid}`;
  if (cls.includes("lab-")) vstavi(); // ozadje in materiali laboratorija (slog in <defs> enkrat na stran)
  return svg;
}

// Puščice: s("line", { ..., "marker-end": arrowHead(svg, "a") }).
export function arrowHead(svg, color = "text") {
  const id = `${svg.uid}-arr-${color}`;
  if (!svg.querySelector(`#${id}`)) {
    let defs = svg.querySelector("defs");
    if (!defs) defs = s("defs", {}, null), svg.prepend(defs);
    const mk = s("marker", { id, viewBox: "0 0 10 10", refX: 8.5, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse", markerUnits: "strokeWidth" }, defs);
    s("path", { d: "M0,0 L10,5 L0,10 z", class: `fill-${color}` }, mk);
  }
  return `url(#${id})`;
}
export function arrow(parent, x1, y1, x2, y2, color = "text", width = 2.5, extra = {}) {
  const svg = parent.ownerSVGElement || parent;
  if (Math.hypot(x2 - x1, y2 - y1) < 1) return null;
  return s("line", { x1, y1, x2, y2, class: `vec stroke-${color}`, "stroke-width": width, "marker-end": arrowHead(svg, color), ...extra }, parent);
}
export const label = (parent, x, y, t, cls = "lbl", anchor = "middle") =>
  s("text", { x, y, class: cls, "text-anchor": anchor, "dominant-baseline": "middle" }, parent, t);

// Največ toliko vrednosti pokažemo kot gumbe namesto drsnika (j 2026-10-31: »za samo štiri nastavitve
// nočem drsnika«). Drsnik pod osjo grafa (axisSlider) ostane drsnik.
export const GUMBI_DO = 6;

// Drsnik z oznako in prikazano vrednostjo. Pri največ GUMBI_DO vrednostih so namesto njega gumbi
// (npr. n: 2 · 3 · 4 · 5); skriti drsnik ostane vir vrednosti, zato set/get/input delujejo enako.
// cls (a, b, c, accent …): barvni krog ob oznaki, ko ima drsnik oznako na grafu iste barve (axisMark, spanMark).
// fino (npr. 10000): drsnik se premika fino-krat drobneje kot step (skoraj zvezno, j 2026-11-04); step ostane
// korak puščic in zaokroževanje izpisa, izris ob vlečenju pa se zbere v enega na sličico (gladko na telefonu).
export function slider({ label: lab, min, max, step = 1, value, unit = "", digits, onInput, format, cls, fino = 0 }) {
  const d = digits ?? (String(step).split(".")[1]?.length || 0);
  const out = h("output");
  const input = h("input", { type: "range", min, max, step: fino ? Number((step / fino).toPrecision(12)) : step, value, "aria-label": lab });
  const txt = (v) => (format ? format(v) : `${fmt(v, d)}${unit ? (unit === "°" || unit === "%" ? "" : " ") + unit : ""}`);
  const choice = h("div", { class: "demo-seg demo-choice", role: "radiogroup", "aria-label": lab, hidden: true });
  let key = "";
  const sync = () => {
    const lo = Number(input.min), hi = Number(input.max), st = Number(input.step) || 1;
    const n = Math.round((hi - lo) / st) + 1;
    const gumbi = n >= 2 && n <= GUMBI_DO && !wrap.classList.contains("axis-slider");
    wrap.classList.toggle("as-choice", gumbi);
    input.hidden = gumbi;
    out.hidden = gumbi;
    choice.hidden = !gumbi;
    if (!gumbi) return;
    if (key !== `${lo}|${hi}|${st}`) {
      key = `${lo}|${hi}|${st}`;
      choice.replaceChildren(
        ...Array.from({ length: n }, (_, i) => {
          const v = Number((lo + i * st).toFixed(10));
          const b = h("button", { type: "button", role: "radio", class: "seg-btn", onclick: () => v !== Number(input.value) && ((input.value = v), input.dispatchEvent(new Event("input"))) }, txt(v));
          b.dataset.v = v;
          return b;
        })
      );
    }
    for (const b of choice.children) {
      const on = Number(b.dataset.v) === Number(input.value);
      b.classList.toggle("on", on);
      b.setAttribute("aria-checked", String(on));
    }
  };
  const show = () => {
    out.textContent = txt(Number(input.value));
    sync();
  };
  let cakaSlicico = false;
  input.addEventListener("input", () => {
    show();
    if (!fino || typeof requestAnimationFrame === "undefined") return onInput?.(Number(input.value));
    if (cakaSlicico) return;
    cakaSlicico = true;
    requestAnimationFrame(() => ((cakaSlicico = false), onInput?.(Number(input.value))));
  });
  // Puščice premaknejo fini drsnik za cel step (Shift: 10) na mrežo stepa, ne za drobni korak.
  if (fino)
    input.addEventListener("keydown", (ev) => {
      const k = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[ev.key];
      if (!k) return;
      ev.preventDefault();
      const lo = Number(input.min), hi = Number(input.max), n = (Number(input.value) - lo) / step;
      const i = k > 0 ? Math.floor(n + 1e-9) + k * (ev.shiftKey ? 10 : 1) : Math.ceil(n - 1e-9) + k * (ev.shiftKey ? 10 : 1);
      const v = Number(clamp(lo + i * step, lo, hi).toFixed(10));
      if (v !== Number(input.value)) wrap.set(v);
    });
  const name = h("span", { class: "demo-slider-label" }, cls ? h("i", { class: `dot dot-${cls}`, "aria-hidden": "true" }) : null, lab);
  const wrap = h("label", { class: "demo-slider" }, name, input, out, choice);
  show();
  wrap.set = (v, silent) => {
    input.value = v;
    show();
    if (!silent) onInput?.(Number(input.value));
  };
  wrap.get = () => Number(input.value);
  wrap.input = input;
  wrap.sync = sync; // po spremembi min/max/step od zunaj
  return wrap;
}

// Izbirni seznam. options: [[vrednost, napis], …] ali [napis, …].
export function select({ label: lab, options, value, onChange }) {
  const sel = h("select", { "aria-label": lab }, options.map((o) => (Array.isArray(o) ? h("option", { value: o[0] }, o[1]) : h("option", { value: o }, o))));
  if (value != null) sel.value = value;
  sel.addEventListener("change", () => onChange?.(sel.value));
  const wrap = h("label", { class: "demo-slider" }, h("span", { class: "demo-slider-label" }, lab), sel);
  wrap.get = () => sel.value;
  wrap.set = (v) => ((sel.value = v), onChange?.(sel.value));
  wrap.sel = sel;
  return wrap;
}

// Skupina gumbov, kjer je izbran natanko eden (npr. načini prikaza).
export function segmented({ options, value, onChange }) {
  const wrap = h("div", { class: "demo-seg", role: "radiogroup" });
  const btns = options.map((o) => {
    const [v, t] = Array.isArray(o) ? o : [o, o];
    // z̄ se izriše s črto nad črko (ovl), bralnik zaslona pa naj prebere celo oznako.
    const b = h("button", { type: "button", role: "radio", class: "seg-btn", "aria-label": typeof t === "string" && t.includes("\u0304") ? t : null, onclick: () => wrap.set(v) }, t);
    b.dataset.v = v;
    return b;
  });
  wrap.append(...btns);
  wrap.set = (v, silent) => {
    wrap.value = v;
    btns.forEach((b) => {
      const on = b.dataset.v === String(v);
      b.classList.toggle("on", on);
      b.setAttribute("aria-checked", on);
    });
    if (!silent) onChange?.(v);
  };
  wrap.get = () => wrap.value;
  wrap.set(value ?? (Array.isArray(options[0]) ? options[0][0] : options[0]), true);
  return wrap;
}

export function toggle(lab, checked, onChange) {
  const chk = h("input", { type: "checkbox", checked: !!checked });
  chk.addEventListener("change", () => onChange?.(chk.checked));
  const wrap = h("label", { class: "demo-check" }, chk, " ", lab);
  wrap.get = () => chk.checked;
  wrap.set = (v) => ((chk.checked = v), onChange?.(v));
  return wrap;
}

export function button(text, onclick, cls = "secondary small") {
  return h("button", { type: "button", class: cls, onclick }, text);
}
export const buttons = (...kids) => h("div", { class: "demo-buttons" }, ...kids);
export const controls = (...kids) => h("div", { class: "demo-controls" }, ...kids);
// Izmerjene vrednosti kot kartice: values([["čas t", "3,16 s"], …]) vrne HTML.
export const values = (list) =>
  `<div class="demo-values">${list.map(([label, v]) => `<div class="demo-val"><span>${label}</span><b>${v}</b></div>`).join("")}</div>`;
export const readout = () => h("div", { class: "demo-readout", "aria-live": "polite" });
export const stage = (...kids) => h("div", { class: "demo-stage" }, ...kids);
export const tryIt = (text) => (text ? h("p", { class: "demo-try" }, h("b", {}, "Poskusi: "), text) : null);

// Animacija, ki se ustavi, ko simulacija ni več na strani.
// Vrne { play(), pause(), toggle(), running }.
export function animate(el, step, { autoplay = true } = {}) {
  const ctl = { running: false };
  let last = 0;
  const tick = (now) => {
    if (!el.isConnected && el.dataset.mounted) return (ctl.running = false);
    if (el.isConnected) el.dataset.mounted = "1";
    if (!ctl.running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (step(dt) === false) ctl.running = false, ctl.onstop?.();
    if (ctl.running) requestAnimationFrame(tick);
  };
  ctl.play = () => {
    if (ctl.running) return;
    ctl.running = true;
    last = performance.now();
    requestAnimationFrame(tick);
    ctl.onchange?.();
  };
  ctl.pause = () => {
    ctl.running = false;
    ctl.onchange?.();
  };
  ctl.toggle = () => (ctl.running ? ctl.pause() : ctl.play());
  // Učenec, ki ima v sistemu vklopljeno »manj gibanja«, animacijo zažene sam.
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (autoplay && !reduced) ctl.play();
  return ctl;
}

// Gumb Predvajaj/Ustavi za animacijo.
export function playButton(anim, { play = "Predvajaj", pause = "Ustavi" } = {}) {
  const b = button("", () => anim.toggle(), "primary small");
  const upd = () => (b.textContent = anim.running ? `❚❚ ${pause}` : `▶ ${play}`);
  const prev = anim.onchange;
  anim.onchange = () => (prev?.(), upd());
  const prevStop = anim.onstop;
  anim.onstop = () => (prevStop?.(), upd());
  upd();
  return b;
}

// Decimalna vejica v formuli: »0,041« → »0{,}041« (KaTeX bi za vejico dodal presledek kot za ločilom: »0, 041«).
// Naštevanje (»1, 2«, »\{1, 2, 3\}«, »x_{1,2}«) ostane, kot je: le število z eno vejico med števkama.
export const decVejica = (t) =>
  String(t).replace(/\d+(?:,\d+)+/g, (m, i, s) => (m.indexOf(",") === m.lastIndexOf(",") && !/(?:_\{|\\\{)\s*$/.test(s.slice(0, i)) ? m.replace(",", "{,}") : m));
export const tex = (t) => (window.katex ? katex.renderToString(decVejica(t), { throwOnError: false }) : t);
export const texBlock = (t) => `<div class="demo-eq">${tex(t)}</div>`;

// Koordinatni sistem. Vrne { X, Y, inv(px,py), g } za risanje v enotah.
export function axes(svg, { W, H, x: [x0, x1], y: [y0, y1], pad = 28, padR = 10, padT = 10, grid = true, xStep, yStep, xLabel = "x", yLabel = "y", origin = true, xFmt, yFmt, parent } = {}) {
  const P = parent || svg;
  const L = pad, B = H - pad, R = W - padR, T = padT;
  const X = (x) => L + ((x - x0) / (x1 - x0)) * (R - L);
  const Y = (y) => B - ((y - y0) / (y1 - y0)) * (B - T);
  const inv = (px, py) => [x0 + ((px - L) / (R - L)) * (x1 - x0), y0 + ((B - py) / (B - T)) * (y1 - y0)];
  const g = s("g", { class: "axes" }, P);
  const nice = (span) => {
    const raw = span / 8, p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  };
  const xs = xStep || nice(x1 - x0), ys = yStep || nice(y1 - y0);
  const ax = origin && y0 <= 0 && y1 >= 0 ? Y(0) : B;
  const ay = origin && x0 <= 0 && x1 >= 0 ? X(0) : L;
  const dec = (st) => Math.max(0, -Math.floor(Math.log10(st) + 1e-9));
  for (let v = Math.ceil(x0 / xs) * xs; v <= x1 + 1e-9; v += xs) {
    if (grid) s("line", { x1: X(v), y1: T, x2: X(v), y2: B, class: "grid" }, g);
    if (Math.abs(v) > 1e-9 || !origin || ay === L) s("text", { x: X(v), y: ax + 14, class: "tick", "text-anchor": "middle" }, g, xFmt ? xFmt(v) : fmt(v, dec(xs)));
  }
  for (let v = Math.ceil(y0 / ys) * ys; v <= y1 + 1e-9; v += ys) {
    if (grid) s("line", { x1: L, y1: Y(v), x2: R, y2: Y(v), class: "grid" }, g);
    if (Math.abs(v) > 1e-9 || !origin || ax === B) s("text", { x: ay - 5, y: Y(v) + 4, class: "tick", "text-anchor": "end" }, g, yFmt ? yFmt(v) : fmt(v, dec(ys)));
  }
  s("line", { x1: L, y1: ax, x2: R, y2: ax, class: "axis", "marker-end": arrowHead(svg) }, g);
  s("line", { x1: ay, y1: B, x2: ay, y2: T, class: "axis", "marker-end": arrowHead(svg) }, g);
  if (xLabel) s("text", { x: R - 2, y: ax - 8, class: "axis-label", "text-anchor": "end" }, g, xLabel);
  if (yLabel) s("text", { x: ay + 7, y: T + 10, class: "axis-label" }, g, yLabel);
  return { X, Y, inv, g, L, R, T, B, x0, x1, y0, y1, ax, ay };
}

// ---- Drsnik ↔ oznaka na grafu (docs/kakovost.md §3): vrednost drsnika, ki je lega ali interval na osi x,
// je na osi označena s simbolom in vrednostjo v barvi drsnika; oznako lahko vlečeš in premakne drsnik.
// Vrednost iz lege na zaslonu: zaokroži na korak drsnika in omeji na njegov obseg.
export function snapTo(sl, v) {
  const inp = sl.input, st = Number(inp.step) || 1, lo = Number(inp.min), hi = Number(inp.max);
  const r = lo + Math.round((clamp(v, lo, hi) - lo) / st) * st;
  return Number(clamp(r, lo, hi).toFixed(10));
}
// Vleči oznako (miška, prst, puščice): toValue(px) → vrednost; drsnik se premakne in sproži en izris.
function linkDrag(svg, g, sl, toValue, label) {
  // Puščice premaknejo drsnik za en korak (Shift: 10 korakov) kot na drsniku. Ne iz lege na zaslonu kot pri
  // draggable: napis ob robu osi premakne središče oznake, zato bi puščica levo oznako premaknila v desno.
  g.addEventListener("keydown", (ev) => {
    const d = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[ev.key];
    if (!d) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    const idx = [...svg.querySelectorAll(".drag")].indexOf(g);
    const v = snapTo(sl, sl.get() + d * (Number(sl.input.step) || 1) * (ev.shiftKey ? 10 : 1));
    if (v !== sl.get()) sl.set(v);
    const now = g.isConnected ? g : svg.querySelectorAll(".drag")[idx];
    if (now && now !== document.activeElement) now.focus?.();
  });
  draggable(svg, g, (px) => {
    const v = snapTo(sl, toValue(px));
    if (v !== sl.get()) sl.set(v);
  }, { label });
}
// Navpična oznaka na osi x pri x: kljukica, napis »x₀ = 1« in (če je y) črtkana črta do točke (x, y).
// sl: drsnik, ki ga oznaka premika (vlečenje). key: povezava za preverjanje poravnave (data-for).
export function axisMark(svg, A, x, text, cls = "c", { y, sl, key, parent, lblDy = 0 } = {}) {
  if (!(x >= A.x0 - 1e-9 && x <= A.x1 + 1e-9)) return null;
  const P = parent || svg, px = A.X(x), ay = A.ax;
  const g = s("g", { class: `amark amark-${cls}`, "data-for": key || null }, P);
  if (Number.isFinite(y) && y >= A.y0 && y <= A.y1) s("line", { x1: px, y1: A.Y(y), x2: px, y2: ay, class: "amark-drop" }, g);
  s("rect", { x: px - 18, y: ay - 18, width: 36, height: 36, class: "hit" }, g);
  s("line", { x1: px, y1: ay - 8, x2: px, y2: ay + 8, class: "amark-tick" }, g);
  const ty = Math.min(ay + 27 + lblDy, Number(svg.getAttribute("viewBox")?.split(" ")[3] || 1e9) - 3);
  const anchor = px < A.L + 30 ? "start" : px > A.R - 30 ? "end" : "middle";
  s("text", { x: px, y: ty, class: "amark-lbl", "text-anchor": anchor }, g, text);
  if (sl) linkDrag(svg, g, sl, (qx) => A.inv(qx, 0)[0], `${text}: premikaj s puščicami`);
  if (sl && key) sl.dataset.for = key;
  return g;
}
// Interval na osi x od x1 do x2 (npr. h od x₀ do x₀ + h): kotirna črta pod številkami osi (če ni prostora, nad osjo)
// z napisom; dolžina je interval v enotah osi. Z drsnikom sl se da vleči konec x2 (vrednost = x2 − x1).
// y2: črtkana črta od točke (x2, y2) do osi.
export function spanMark(svg, A, x1, x2, text, cls = "a", { sl, key, parent, y2 } = {}) {
  const P = parent || svg, below = A.ax + 54 <= Number(svg.getAttribute("viewBox")?.split(" ")[3] || 0);
  const y = below ? A.ax + 38 : A.ax - 14, ty = below ? y + 15 : y - 8;
  const a = A.X(Math.max(A.x0, Math.min(x1, x2))), b = A.X(Math.min(A.x1, Math.max(x1, x2)));
  if (!(b > a - 0.5)) return null;
  const g = s("g", { class: `amark amark-${cls}`, "data-for": key || null }, P);
  if (Number.isFinite(y2) && y2 >= A.y0 && y2 <= A.y1 && x2 <= A.x1) s("line", { x1: A.X(x2), y1: A.Y(y2), x2: A.X(x2), y2: y, class: "amark-drop" }, g);
  if (below) s("path", { d: `M${a},${A.ax + 8} V${y} M${b},${A.ax} V${y}`, class: "amark-ext" }, g);
  s("path", { d: `M${a},${y - 5} V${y + 5} M${a},${y} H${b} M${b},${y - 5} V${y + 5}`, class: "amark-span" }, g);
  s("text", { x: (a + b) / 2, y: ty, class: "amark-lbl", "text-anchor": "middle" }, g, text);
  if (sl) {
    const end = s("g", { class: "amark-end", "data-for": key || null }, g);
    // ročica ostane na grafu, tudi ko je x2 zunaj okna (sicer je ne moreš prijeti)
    const kx = A.X(clamp(x2, A.x0, A.x1));
    s("rect", { x: kx - 18, y: y - 18, width: 36, height: 36, class: "hit" }, end);
    s("circle", { cx: kx, cy: y, r: 5, class: "amark-knob" }, end);
    linkDrag(svg, end, sl, (qx) => A.inv(qx, 0)[0] - x1, `${text}: premikaj konec s puščicami`);
  }
  return g;
}
// Drsnik, poravnan z osjo x pod grafom: tirnica se razteza točno čez interval osi, ki ga drsnik predstavlja,
// zato je ročica pri vsaki vrednosti navpično pod oznako (en korak drsnika = isti premik na osi).
// Po vsakem izrisu pokliči sl.align(A); meje drsnika so večkratniki koraka znotraj okna osi.
export function axisSlider(sl, svg) {
  sl.classList.add("axis-slider");
  sl.sync?.();
  let A = null;
  const place = () => {
    const m = A && svg.isConnected && svg.getScreenCTM();
    if (!m || !sl.isConnected) return;
    const inp = sl.input, lo = Number(inp.min), hi = Number(inp.max);
    const thumb = parseFloat(getComputedStyle(inp).getPropertyValue("--thumb")) || 22;
    const left = m.e + m.a * A.X(lo), right = m.e + m.a * A.X(hi);
    const box = sl.getBoundingClientRect();
    sl.style.setProperty("--ax-l", `${(left - box.left - thumb / 2).toFixed(2)}px`);
    sl.style.setProperty("--ax-w", `${(right - left + thumb).toFixed(2)}px`);
  };
  sl.align = (a) => {
    A = a;
    const inp = sl.input, st = Number(inp.step) || 1;
    const lo = Number((Math.ceil(a.x0 / st - 1e-9) * st).toFixed(10)), hi = Number((Math.floor(a.x1 / st + 1e-9) * st).toFixed(10));
    if (Number(inp.min) !== lo || Number(inp.max) !== hi) {
      const v = sl.get();
      inp.min = lo;
      inp.max = hi;
      sl.sync?.();
      if (v !== clamp(v, lo, hi)) sl.set(clamp(v, lo, hi), true);
    }
    place();
  };
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => place());
    ro.observe(svg);
    ro.observe(sl);
  }
  return sl;
}

// Pot grafa funkcije f na intervalu (prekine pri skokih in neskončnostih).
export function fnPath(f, A, { from = A.x0, to = A.x1, n = 240 } = {}) {
  let d = "", pen = false, prevY = null;
  const span = A.y1 - A.y0;
  for (let i = 0; i <= n; i++) {
    const x = from + ((to - from) * i) / n;
    const y = f(x);
    const ok = Number.isFinite(y) && y > A.y0 - span * 2 && y < A.y1 + span * 2;
    if (ok && pen && prevY != null && Math.abs(y - prevY) > span * 1.5) pen = false;
    if (ok) d += `${pen ? "L" : "M"}${A.X(x).toFixed(1)},${A.Y(y).toFixed(1)}`;
    pen = ok;
    prevY = ok ? y : null;
  }
  return d;
}

// Pretvorba položaja kazalca v koordinate SVG.
export function svgPoint(svg, ev) {
  const pt = svg.createSVGPoint();
  pt.x = ev.clientX;
  pt.y = ev.clientY;
  const m = svg.getScreenCTM();
  if (!m) return [0, 0];
  const p = pt.matrixTransform(m.inverse());
  return [p.x, p.y];
}

// Vlečenje elementa (miška, prst, pisalo). onMove(x, y) v koordinatah SVG.
// Premike poslušamo na oknu, zato vlečenje deluje tudi, ko simulacija ročico med vlečenjem nariše na novo.
export function draggable(svg, target, onMove, { onStart, onEnd, label = "Vlečna točka: premikaj jo s puščicami" } = {}) {
  target.classList.add("drag");
  keyboardDrag(svg, target, onMove, { onStart, onEnd, label });
  // Brskalniki ne upoštevajo touch-action na oblikah SVG: brez tega bi prst namesto vlečenja premaknil stran.
  target.addEventListener("touchstart", (e) => e.cancelable && e.preventDefault(), { passive: false });
  target.addEventListener("pointerdown", (ev) => {
    if (ev.button > 0) return;
    ev.preventDefault();
    const id = ev.pointerId;
    // Zajem na celotni sliki: ročica sme med vlečenjem izginiti in se narisati znova.
    try {
      svg.setPointerCapture?.(id);
    } catch {}
    onStart?.(...svgPoint(svg, ev));
    const move = (e) => {
      if (e.pointerId !== id) return;
      e.preventDefault();
      onMove(...svgPoint(svg, e));
    };
    const up = (e) => {
      if (e.pointerId !== id) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      onEnd?.();
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  });
}

// Tipkovnica: Tab izbere vlečni element, puščice ga premaknejo (Shift = večji korak).
// Položaj vzamemo iz središča elementa na zaslonu, zato deluje za vse simulacije brez dodatne kode.
function keyboardDrag(svg, target, onMove, { onStart, onEnd, label }) {
  if (target.hasAttribute("tabindex")) return;
  target.setAttribute("tabindex", "0");
  target.setAttribute("role", "button");
  if (!target.getAttribute("aria-label")) target.setAttribute("aria-label", label);
  const DIR = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  const center = (t) => {
    const r = t.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  };
  target.addEventListener("keydown", (ev) => {
    const d = DIR[ev.key];
    if (!d) return;
    ev.preventDefault();
    // Simulacija lahko ob premiku nariše vse na novo: vlečni element poiščemo po zaporedni številki.
    const idx = [...svg.querySelectorAll(".drag")].indexOf(target);
    const current = () => (target.isConnected ? target : svg.querySelectorAll(".drag")[idx] || target);
    const [cx, cy] = center(target);
    const [x, y] = svgPoint(svg, { clientX: cx, clientY: cy });
    const vb = svg.viewBox?.baseVal;
    const step = ((vb && vb.width) || 400) * (ev.shiftKey ? 0.05 : 0.01);
    onStart?.(x, y);
    // Pri simulacijah, ki točko zaokrožijo na mrežo, korak povečujemo, dokler se točka ne premakne.
    for (const k of [1, 2, 4, 8, 16]) {
      onMove(x + d[0] * step * k, y + d[1] * step * k);
      const [nx, ny] = center(current());
      if (Math.hypot(nx - cx, ny - cy) > 1) break;
    }
    onEnd?.();
    const now = current();
    if (now !== document.activeElement) now.focus?.();
  });
}

// Vlečna točka: krog z večjo nevidno ploskvijo za prst.
export function handle(parent, cls = "a", r = 7) {
  const g = s("g", { class: "handle" }, parent);
  s("circle", { r: 18, class: "hit" }, g);
  const c = s("circle", { r, class: `pt fill-${cls}` }, g);
  g.move = (x, y) => g.setAttribute("transform", `translate(${x},${y})`);
  g.dot = c;
  return g;
}

// Canvas, ki se prilagodi gostoti zaslona. Vrne { cv, ctx, W, H }.
export function canvasBox(W, H) {
  const cv = h("canvas", { class: "demo-canvas", width: W * 2, height: H * 2 });
  cv.style.aspectRatio = `${W} / ${H}`;
  const ctx = cv.getContext("2d");
  ctx.scale(2, 2);
  return { cv, ctx, W, H };
}

// Barva iz CSS spremenljivke (za canvas).
export function cssColor(el, name, fallback = "#2563eb") {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  return v || fallback;
}
export function palette(el) {
  const c = (n, f) => cssColor(el, n, f);
  return { text: c("--text", "#14213d"), muted: c("--muted", "#5d6b86"), border: c("--border", "#dfe6f1"), surface: c("--surface", "#fff"), surface2: c("--surface-2", "#eaf0f9"), accent: c("--accent", "#2563eb"), a: c("--demo-a", "#e8833a"), b: c("--demo-b", "#2f9e8f"), c: c("--demo-c", "#7b61d1"), ok: c("--ok", "#16a05a"), danger: c("--danger", "#e5484d") };
}

// Postavi simulacijo: oder, kontrole, izpis, namig.
export function layout(el, { stage: st, controls: ctl, out, extra, tryText }) {
  el.append(...[st && (st.classList?.contains("demo-stage") ? st : stage(...[].concat(st))), ctl && (Array.isArray(ctl) ? controls(...ctl) : ctl), extra, out, tryIt(tryText)].flat().filter(Boolean));
}

export function gcd(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) [x, y] = [y, x % y];
  return x;
}
export const lcm = (a, b) => (a && b ? Math.abs(a * b) / gcd(a, b) : 0);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const rnd = (a, b) => a + Math.random() * (b - a);
export const rint = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
export const deg = (r) => (r * 180) / Math.PI;
export const rad = (d) => (d * Math.PI) / 180;
export function primeFactors(n) {
  const out = [];
  for (let p = 2; p * p <= n; p++) while (n % p === 0) out.push(p), (n /= p);
  if (n > 1) out.push(n);
  return out;
}
// Ulomek za KaTeX.
export const frac = (a, b) => (b === 1 ? `${a}` : `\\frac{${a}}{${b}}`);
// Sklanjanje: n + (1 / 2 / 3-4 / 5+) oblika.
export function plural(n, [one, two, few, many]) {
  const m = Math.abs(n) % 100;
  return m === 1 ? one : m === 2 ? two : m === 3 || m === 4 ? few : many;
}
