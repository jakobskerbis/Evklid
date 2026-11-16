// Gumbi pod odgovorom inštruktorja za orodja aplikacije (server/odpri.js, docs/odpri.md): poskus z nastavljenimi
// vrednostmi (okno nad pogovorom), 3D model ali del telesa, lekcija v učbeniku, igra za snov, formula iz zbirke,
// premičen graf in preprosta skica kar v sporočilu. Pogovor ostane odprt: okno poskusa se zapre z ×, Esc ali Nazaj.
import { mountSim } from "./sim/index.js";
import { zadrziFokus } from "./fokus-okna.js";

let D = null; // { t, icon, escapeHtml, renderMath, openLesson, open3d, openGames, openLab, openFormulas, openGraph }
export function initOpen(deps) {
  D = deps;
}

const fold = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

/** Doda gumbe in vdelave pod sporočilo (enkrat). */
export function addOpen(bubble, list) {
  if (!D || !Array.isArray(list) || !list.length || bubble.querySelector(".open-tools")) return;
  const box = el("div", "open-tools");
  const row = el("div", "open-row");
  row.setAttribute("role", "group");
  row.setAttribute("aria-label", D.t("open.group"));
  for (const x of list) {
    if (x.kind === "graph") box.append(graphCard(x));
    else if (x.kind === "sketch") box.append(sketchCard(x));
    else if (x.kind === "formula") box.append(formulaCard(x));
    else {
      const b = button(x);
      if (b) row.append(b);
    }
  }
  if (row.children.length) box.prepend(row);
  if (!box.children.length) return;
  const foot = bubble.querySelector(".msg-foot");
  if (foot) foot.before(box);
  else bubble.append(box);
}

const KIND = {
  sim: ["flask-conical", "open.sim"],
  "3d": ["box", "open.3d"],
  lesson: ["book-open", "open.lesson"],
  game: ["gamepad-2", "open.game"],
};
function button(x) {
  const k = KIND[x.kind];
  if (!k) return null;
  const b = el("button", "secondary small open-btn");
  b.type = "button";
  const label = `${D.t(k[1])}: ${x.title}`;
  b.innerHTML = `${D.icon(x.locked ? "lock" : k[0])}<span dir="auto">${D.escapeHtml(label)}</span>`;
  b.setAttribute("aria-label", x.locked ? `${label} (${D.t("open.locked")})` : label);
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    if (x.kind === "sim") return x.locked ? D.openLab() : openSim(x, b);
    if (x.kind === "3d") return D.open3d(x.id, x.title, x.id === "atlas" ? { izberi: x.izberi } : x.del ? { del: x.del } : null);
    if (x.kind === "lesson") return D.openLesson(x.id);
    if (x.kind === "game") return D.openGames(x.concepts);
  });
  return b;
}

// ---------------------------------------------------------------- poskus v oknu nad pogovorom
let simOpen = null;
export const simOverlayOpen = () => !!simOpen;
export function closeSimOverlay() {
  if (!simOpen) return false;
  const { box, from, onKey, sprosti } = simOpen;
  simOpen = null;
  sprosti({ vrni: false });
  document.removeEventListener("keydown", onKey, true);
  box.remove();
  document.body.classList.remove("open-sim-on");
  from?.focus?.({ preventScroll: true });
  return true;
}

async function openSim(x, from) {
  closeSimOverlay();
  const box = el("div", "open-sim");
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", x.title);
  const card = el("div", "open-sim-card");
  const head = el("div", "open-sim-head");
  const h = el("h2", "", x.title);
  h.setAttribute("dir", "auto");
  const close = el("button", "icon-btn open-sim-close");
  close.type = "button";
  close.innerHTML = D.icon("x");
  close.setAttribute("aria-label", D.t("open.close"));
  close.addEventListener("click", closeSimOverlay);
  head.append(h, close);
  const body = el("div", "open-sim-body");
  card.append(head, body);
  if (x.set) card.append(el("p", "open-sim-note muted", D.t("open.preset")));
  box.append(card);
  box.addEventListener("click", (e) => e.target === box && closeSimOverlay());
  const onKey = (e) => {
    if (e.key !== "Escape" || !simOpen) return;
    e.preventDefault();
    e.stopPropagation();
    closeSimOverlay();
  };
  document.addEventListener("keydown", onKey, true);
  document.body.append(box);
  simOpen = { box, from, onKey, sprosti: zadrziFokus(box, { zacetni: close, prej: from }) };
  document.body.classList.add("open-sim-on");
  const ok = await mountSim(x.id, body, x.opts || {});
  if (!ok) body.replaceChildren(el("p", "muted", D.t("open.failed")));
  else if (x.set) applySet(body, x.set);
}

// Nastavljene vrednosti: drsnik z oznako, ki se začne z imenom (»višina« → »Višina h«); vrednost v mejah drsnika.
export function applySet(root, set) {
  const inputs = [...root.querySelectorAll('input[type="range"]')];
  for (const [name, value] of Object.entries(set || {})) {
    const want = fold(name);
    const inp = inputs.find((i) => fold(i.getAttribute("aria-label")).startsWith(want)) || inputs.find((i) => fold(i.getAttribute("aria-label")).includes(want));
    if (!inp || !Number.isFinite(value)) continue;
    const lo = Number(inp.min), hi = Number(inp.max), st = Number(inp.step) || 1;
    const v = Math.min(hi, Math.max(lo, Math.round((value - lo) / st) * st + lo));
    inp.value = String(v);
    inp.dispatchEvent(new Event("input", { bubbles: true }));
    inp.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

// ---------------------------------------------------------------- formula iz zbirke
function formulaCard(x) {
  const c = el("div", "open-card open-formula");
  const top = el("div", "open-card-top");
  top.append(el("span", "open-card-kind", `${D.t("open.formula")}: ${x.title}`));
  const b = el("button", "secondary small");
  b.type = "button";
  b.innerHTML = `${D.icon("sigma")}<span>${D.escapeHtml(D.t("open.formulas"))}</span>`;
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    D.openFormulas();
  });
  top.append(b);
  const f = el("div", "open-formula-tex");
  // Besedilo zunaj $…$ ubežimo, formule izrišemo (prej se je ubežal tudi izris KaTeX).
  f.innerHTML = String(x.tex || "")
    .split(/(\$[^$]+\$)/)
    .map((p) => (/^\$[^$]+\$$/.test(p) ? D.renderMath(p.slice(1, -1), false) : D.escapeHtml(p)))
    .join("");
  c.append(top, f);
  return c;
}

// ---------------------------------------------------------------- premičen graf v sporočilu
function graphCard(x) {
  const c = el("div", "open-card open-graph");
  const top = el("div", "open-card-top");
  top.append(el("span", "open-card-kind", D.t("open.graph")));
  const b = el("button", "secondary small");
  b.type = "button";
  b.innerHTML = `${D.icon("maximize-2")}<span>${D.escapeHtml(D.t("open.inCalc"))}</span>`;
  top.append(b);
  const host = el("div", "open-graph-host gc-graph");
  const sliders = el("div", "open-graph-sliders");
  c.append(top, host, sliders);
  let current = x.exprs.slice();
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    D.openGraph(current);
  });
  // Graf se nariše, ko je sporočilo vidno (modul kalkulatorja se naloži šele takrat).
  requestAnimationFrame(() => drawGraph(host, sliders, x.exprs, (list) => (current = list)).catch(() => host.replaceChildren(el("p", "muted", D.t("open.failed")))));
  return c;
}

async function drawGraph(host, slidersEl, exprs, onChange) {
  const [{ GraphView }, { buildModel, emptyState, newId, sliderRange }] = await Promise.all([import("./graph/plot.js"), import("./graph/model.js")]);
  const state = emptyState();
  state.items = exprs.map((text, i) => ({ id: newId(), type: "expr", text, color: i % 8 }));
  let model = buildModel(state);
  const fmt = (v, d = 4) => String(Math.round(v * 10 ** d) / 10 ** d).replace(".", ",").replace("-", "−");
  const view = new GraphView(host, {
    getState: () => state,
    getModel: () => model,
    label: (k) => D.t(`gc.poi.${k}`),
    fmt,
    axisFmt: (v, dec) => v.toFixed(dec).replace(".", ",").replace("-", "−"),
  });
  view.canvas.setAttribute("aria-label", exprs.filter((e) => !/^\s*[a-zA-Z]\w*\s*=\s*-?[\d.,]+\s*$/.test(e)).join("; "));
  const redraw = () => {
    model = buildModel(state);
    view.draw();
    onChange(state.items.map((it) => it.text));
  };
  for (const o of model.items.filter((o) => o.kind === "slider")) {
    const it = o.src;
    const r = { ...sliderRange(o.value) };
    const row = el("label", "open-graph-slider");
    const name = el("span", "open-graph-name", o.name);
    const inp = document.createElement("input");
    Object.assign(inp, { type: "range", min: r.min, max: r.max, step: r.step, value: o.value });
    inp.setAttribute("aria-label", o.name);
    const out = el("output", "", fmt(o.value, 2));
    inp.addEventListener("input", () => {
      const v = Number(inp.value);
      it.text = `${o.name} = ${v}`;
      out.textContent = fmt(v, 2);
      redraw();
    });
    row.append(name, inp, out);
    slidersEl.append(row);
  }
  view.draw();
}

// ---------------------------------------------------------------- skica (SVG)
const NS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs = {}, text) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  if (text != null) e.textContent = text;
  return e;
};
export function sketchSvg(spec) {
  const pts = spec.tocke;
  const xs = [], ys = [];
  for (const [x, y] of Object.values(pts)) xs.push(x), ys.push(y);
  for (const [p, dx, dy] of spec.vektorji) xs.push(pts[p][0] + dx), ys.push(pts[p][1] + dy);
  for (const [p, r] of spec.krogi) xs.push(pts[p][0] - r, pts[p][0] + r), ys.push(pts[p][1] - r, pts[p][1] + r);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const W = 320, H = 220, pad = 30;
  const k = Math.min((W - 2 * pad) / Math.max(maxX - minX, 1e-9), (H - 2 * pad) / Math.max(maxY - minY, 1e-9));
  const sx = (x) => pad + (x - minX) * k + ((W - 2 * pad) - (maxX - minX) * k) / 2;
  const sy = (y) => H - pad - (y - minY) * k - ((H - 2 * pad) - (maxY - minY) * k) / 2;
  const cx = Object.values(pts).reduce((a, p) => a + p[0], 0) / Object.keys(pts).length;
  const cy = Object.values(pts).reduce((a, p) => a + p[1], 0) / Object.keys(pts).length;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "open-sketch-svg", role: "img" });
  const defs = svgEl("defs");
  const mk = svgEl("marker", { id: "open-arrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
  mk.append(svgEl("path", { d: "M0 0L10 5L0 10z", class: "open-sk-head" }));
  defs.append(mk);
  svg.append(defs);
  // Oznake so navadno besedilo; »F_g«, »F_{tr}« ali »$F_g$« pokaže z indeksom (ne s podčrtajem).
  const text = (x, y, s, cls = "open-sk-lbl") => {
    const t = svgEl("text", { x, y, class: cls, "text-anchor": "middle", "dominant-baseline": "middle" });
    const plain = String(s).replace(/\$/g, "");
    const m = plain.match(/^([^_]+)_\{?([^{}_]+)\}?$/);
    if (m) t.append(m[1], svgEl("tspan", { dy: "0.35em", "font-size": "75%" }, m[2]));
    else t.textContent = plain;
    svg.append(t);
  };
  for (const [p, r] of spec.krogi) svg.append(svgEl("circle", { cx: sx(pts[p][0]), cy: sy(pts[p][1]), r: r * k, class: "open-sk-line" }));
  for (const [a, b, l] of spec.daljice) {
    const [x1, y1, x2, y2] = [sx(pts[a][0]), sy(pts[a][1]), sx(pts[b][0]), sy(pts[b][1])];
    svg.append(svgEl("line", { x1, y1, x2, y2, class: "open-sk-line" }));
    if (l) {
      // Oznaka stranice na zunanji strani (stran od središča lika).
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      let nx = -(y2 - y1), ny = x2 - x1;
      const len = Math.hypot(nx, ny) || 1;
      nx /= len; ny /= len;
      if ((mx - sx(cx)) * nx + (my - sy(cy)) * ny < 0) (nx = -nx), (ny = -ny);
      text(mx + nx * 12, my + ny * 12, l);
    }
  }
  for (const [a, b, c, l] of spec.koti) {
    const [vx, vy] = [sx(pts[b][0]), sy(pts[b][1])];
    const a1 = Math.atan2(sy(pts[a][1]) - vy, sx(pts[a][0]) - vx);
    const a2 = Math.atan2(sy(pts[c][1]) - vy, sx(pts[c][0]) - vx);
    let d = a2 - a1;
    while (d <= -Math.PI) d += 2 * Math.PI;
    while (d > Math.PI) d -= 2 * Math.PI;
    const r = 18;
    const p1 = [vx + r * Math.cos(a1), vy + r * Math.sin(a1)], p2 = [vx + r * Math.cos(a1 + d), vy + r * Math.sin(a1 + d)];
    svg.append(svgEl("path", { d: `M${p1[0]} ${p1[1]}A${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${p2[0]} ${p2[1]}`, class: "open-sk-angle" }));
    if (l) text(vx + (r + 11) * Math.cos(a1 + d / 2), vy + (r + 11) * Math.sin(a1 + d / 2), l);
  }
  for (const [p, dx, dy, l] of spec.vektorji) {
    const [x1, y1] = [sx(pts[p][0]), sy(pts[p][1])];
    const [x2, y2] = [sx(pts[p][0] + dx), sy(pts[p][1] + dy)];
    svg.append(svgEl("line", { x1, y1, x2, y2, class: "open-sk-vec", "marker-end": "url(#open-arrow)" }));
    if (l) text(x2 + Math.sign(x2 - x1 || 1) * 12, y2 + Math.sign(y2 - y1 || -1) * 10, l, "open-sk-lbl open-sk-vlbl");
  }
  for (const [n, [x, y]] of Object.entries(pts)) {
    svg.append(svgEl("circle", { cx: sx(x), cy: sy(y), r: 3, class: "open-sk-pt" }));
    let ox = sx(x) - sx(cx), oy = sy(y) - sy(cy);
    const len = Math.hypot(ox, oy) || 1;
    text(sx(x) + (ox / len) * 13, sy(y) + (oy / len) * 13 || sy(y) - 13, n, "open-sk-lbl open-sk-name");
  }
  return svg;
}
function sketchCard(x) {
  const c = el("div", "open-card open-sketch");
  c.append(el("span", "open-card-kind", x.spec.naslov ? `${D.t("open.sketch")}: ${x.spec.naslov}` : D.t("open.sketch")));
  const svg = sketchSvg(x.spec);
  svg.setAttribute("aria-label", x.spec.naslov || D.t("open.sketch"));
  c.append(svg);
  return c;
}
