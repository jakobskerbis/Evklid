// Grafični kalkulator – risanje na platno (canvas) ter premikanje, povečava in dotiki.
// Mreža z lepimi koraki (1, 2, 5 ali π), puščice na oseh, krivulje z zaznavo asimptot,
// implicitne krivulje (marching squares), senčenje neenačb, posebne točke in sledenje krivulji.
import { toNum, specialPoints, intersections } from "./model.js";
import { integrate, niceNumber } from "./math.js";

// barve krivulj (kot CSS spremenljivke v graph.css, da delujejo v temnem načinu)
export const PALETTE = ["--g-red", "--g-blue", "--g-green", "--g-purple", "--g-orange", "--g-black", "--g-teal", "--g-pink"];
const PLOTTABLE = new Set(["y", "x", "polar", "param", "implicit", "ineq-y", "ineq-x", "region", "points", "table", "func"]);

function niceStep(span, px, target = 90) {
  const raw = (span / Math.max(1, px)) * target;
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  const k = m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10;
  return { step: k * p, minor: k === 2 ? 4 : 5 };
}

function piLabel(k, den) {
  // k·π/den skrajšano
  const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
  if (k === 0) return "0";
  const d = g(k, den);
  const num = k / d;
  const dd = den / d;
  const n = num === 1 ? "π" : num === -1 ? "−π" : `${String(num).replace("-", "−")}π`;
  return dd === 1 ? n : `${n}/${dd}`;
}

export class GraphView {
  /**
   * @param {HTMLElement} host
   * @param {object} hooks { getModel, getState, onView, onDrag, onDragEnd, onSelect, onTool, label(key), fmt(n) }
   */
  constructor(host, hooks) {
    this.host = host;
    this.hooks = hooks;
    this.canvas = document.createElement("canvas");
    this.canvas.className = "gc-canvas";
    this.canvas.setAttribute("role", "img");
    this.canvas.tabIndex = 0;
    host.append(this.canvas);
    this.tip = document.createElement("div");
    this.tip.className = "gc-tip";
    this.tip.hidden = true;
    host.append(this.tip);
    this.selected = null;
    this.shown = []; // označene posebne točke (z napisom)
    this.trace = null;
    this.polylines = new Map();
    this.pois = [];
    this.handles = [];
    this.pointers = new Map();
    this.dirty = false;
    this.W = 300;
    this.H = 300;
    this.bindEvents();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
  }

  get view() {
    return this.hooks.getState().view;
  }
  set view(v) {
    this.hooks.getState().view = v;
    this.hooks.onView?.(v);
  }

  resize() {
    const r = this.host.getBoundingClientRect();
    const W = Math.max(50, Math.round(r.width));
    const H = Math.max(50, Math.round(r.height));
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    if (W === this.W && H === this.H && this.dpr === dpr) return;
    const oldW = this.W;
    const oldH = this.H;
    this.W = W;
    this.H = H;
    this.dpr = dpr;
    this.canvas.width = Math.round(W * dpr);
    this.canvas.height = Math.round(H * dpr);
    this.canvas.style.width = `${W}px`;
    this.canvas.style.height = `${H}px`;
    // ob spremembi velikosti ohranimo merilo (enoto na piksel) in središče
    const v = this.view;
    if (v && oldW && oldH && this.sized) {
      const cx = (v.xmin + v.xmax) / 2;
      const cy = (v.ymin + v.ymax) / 2;
      const sx = (v.xmax - v.xmin) / oldW;
      const sy = (v.ymax - v.ymin) / oldH;
      this.view = { xmin: cx - (sx * W) / 2, xmax: cx + (sx * W) / 2, ymin: cy - (sy * H) / 2, ymax: cy + (sy * H) / 2 };
    } else if (v) this.view = this.squared(v);
    // Platno, ki še ni na strani (širina 0), nima pravega merila: ob prvi pravi velikosti ohranimo
    // območje (−10 … 10), ne enote na piksel, sicer se graf odpre oddaljen (−150 … 150).
    this.sized = r.width > 0 && r.height > 0;
    this.draw();
  }

  // enako merilo na obeh oseh (krog je krog)
  squared(v, keep = "x") {
    if (!this.hooks.getState().settings?.square) return v;
    const sx = (v.xmax - v.xmin) / this.W;
    const sy = (v.ymax - v.ymin) / this.H;
    if (Math.abs(sx - sy) / sx < 1e-9) return v;
    if (keep === "x") {
      const cy = (v.ymin + v.ymax) / 2;
      return { ...v, ymin: cy - (sx * this.H) / 2, ymax: cy + (sx * this.H) / 2 };
    }
    const cx = (v.xmin + v.xmax) / 2;
    return { ...v, xmin: cx - (sy * this.W) / 2, xmax: cx + (sy * this.W) / 2 };
  }

  X(x) {
    const v = this.view;
    return ((x - v.xmin) / (v.xmax - v.xmin)) * this.W;
  }
  Y(y) {
    const v = this.view;
    return this.H - ((y - v.ymin) / (v.ymax - v.ymin)) * this.H;
  }
  inv(px, py) {
    const v = this.view;
    return [v.xmin + (px / this.W) * (v.xmax - v.xmin), v.ymin + ((this.H - py) / this.H) * (v.ymax - v.ymin)];
  }

  draw() {
    if (this.dirty) return;
    this.dirty = true;
    requestAnimationFrame(() => {
      this.dirty = false;
      const ctx = this.canvas.getContext("2d");
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.render(ctx, this.W, this.H);
    });
  }

  colors() {
    const root = document.documentElement;
    const key = `${root.className}|${root.getAttribute("style") || ""}`;
    if (this.cKey === key && this.cCache) return this.cCache;
    if (!this.probe) {
      this.probe = document.createElement("span");
      this.probe.style.display = "none";
      this.host.append(this.probe);
    }
    const read = (v, d) => {
      this.probe.style.color = d;
      this.probe.style.color = `var(${v}, ${d})`;
      return getComputedStyle(this.probe).color || d;
    };
    const rgb = (c) => (c.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);
    const mix = (a, b, t) => {
      const [p, q] = [rgb(a), rgb(b)];
      return `rgb(${p.map((v, i) => Math.round(v * t + q[i] * (1 - t))).join(",")})`;
    };
    const bg = read("--surface", "#ffffff");
    const text = read("--text", "#14213d");
    const muted = read("--muted", "#5d6b86");
    this.cKey = key;
    this.cCache = {
      bg,
      text,
      grid: mix(text, bg, 0.14),
      minor: mix(text, bg, 0.06),
      axis: mix(text, bg, 0.88),
      poi: muted,
      palette: PALETTE.map((p, i) => read(p, ["#c74440", "#2d70b3", "#388c46", "#6042a6", "#e8710a", "#1f2937", "#0e8a8a", "#c2367f"][i])),
    };
    return this.cCache;
  }

  colorOf(o, C) {
    const c = o.src?.color;
    return C.palette[(Number.isInteger(c) ? c : 0) % C.palette.length];
  }

  // ---------- risanje ----------

  render(ctx, W, H, { exporting = false } = {}) {
    const C = this.colors();
    this.C = C;
    const state = this.hooks.getState();
    const model = this.hooks.getModel();
    const st = state.settings || {};
    ctx.save();
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);
    this.polylines = new Map();
    this.handles = [];
    if (st.grid !== false) this.drawGrid(ctx, W, H, C, st);
    const items = model?.items || [];
    const visible = items.filter((o) => !o.src?.hidden && PLOTTABLE.has(o.kind));
    // najprej senčenje, nato krivulje, nazadnje točke
    for (const o of visible) if (o.kind === "region" || o.kind === "ineq-y" || o.kind === "ineq-x") this.safe(() => this.drawShade(ctx, o, C, W, H));
    for (const o of visible) if (o.src?.tools?.area) this.safe(() => this.drawArea(ctx, o, C));
    if (st.axes !== false) this.drawAxes(ctx, W, H, C, st);
    for (const o of visible) this.safe(() => this.drawItem(ctx, o, C, W, H));
    for (const o of visible) if (o.src?.tools?.tangent != null) this.safe(() => this.drawTangent(ctx, o, C));
    if (!exporting) {
      this.drawPois(ctx, C, items);
      this.drawTrace(ctx, C);
    }
    ctx.restore();
  }

  safe(fn) {
    try {
      fn();
    } catch (e) {
      if (typeof console !== "undefined") console.warn("[graf]", e);
    }
  }

  drawGrid(ctx, W, H, C, st) {
    const v = this.view;
    const gx = this.xGrid(st);
    const gy = niceStep(v.ymax - v.ymin, H);
    ctx.lineWidth = 1;
    const lines = (step, color, isX, skipEvery) => {
      ctx.strokeStyle = color;
      ctx.beginPath();
      const [a, b] = isX ? [v.xmin, v.xmax] : [v.ymin, v.ymax];
      const k0 = Math.ceil(a / step);
      const k1 = Math.floor(b / step);
      if (k1 - k0 > 2000) return;
      for (let k = k0; k <= k1; k++) {
        if (skipEvery && k % skipEvery === 0) continue;
        if (isX) {
          const px = Math.round(this.X(k * step)) + 0.5;
          ctx.moveTo(px, 0);
          ctx.lineTo(px, H);
        } else {
          const py = Math.round(this.Y(k * step)) + 0.5;
          ctx.moveTo(0, py);
          ctx.lineTo(W, py);
        }
      }
      ctx.stroke();
    };
    if (st.minor !== false) {
      lines(gx.step / gx.minor, C.minor, true, gx.minor);
      lines(gy.step / gy.minor, C.minor, false, gy.minor);
    }
    lines(gx.step, C.grid, true);
    lines(gy.step, C.grid, false);
  }

  xGrid(st) {
    const v = this.view;
    if (st.piX) {
      const raw = ((v.xmax - v.xmin) / Math.max(1, this.W)) * 90;
      const opts = [1 / 12, 1 / 6, 1 / 4, 1 / 2, 1, 2, 5, 10, 20, 50, 100];
      const m = opts.find((o) => o * Math.PI >= raw) ?? 100;
      return { step: m * Math.PI, minor: m < 1 ? 2 : m === 1 ? 4 : 5, pi: m };
    }
    return niceStep(v.xmax - v.xmin, this.W);
  }

  drawAxes(ctx, W, H, C, st) {
    const v = this.view;
    const x0 = this.X(0);
    const y0 = this.Y(0);
    const fmt = this.hooks.axisFmt || ((n, d) => n.toFixed(d));
    const ax = Math.min(Math.max(x0, 0), W); // os y (navpična), pripeta na rob
    const ay = Math.min(Math.max(y0, 0), H);
    ctx.strokeStyle = C.axis;
    ctx.fillStyle = C.axis;
    ctx.lineWidth = 1.5;
    const arrows = st.arrows !== false;
    const head = (x, y, dx, dy) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - dx * 9 - dy * 4.5, y - dy * 9 + dx * 4.5);
      ctx.lineTo(x - dx * 9 + dy * 4.5, y - dy * 9 - dx * 4.5);
      ctx.closePath();
      ctx.fill();
    };
    if (y0 >= 0 && y0 <= H) {
      ctx.beginPath();
      ctx.moveTo(0, Math.round(y0) + 0.5);
      ctx.lineTo(W - (arrows ? 3 : 0), Math.round(y0) + 0.5);
      ctx.stroke();
      if (arrows) head(W - 1, Math.round(y0) + 0.5, 1, 0);
    }
    if (x0 >= 0 && x0 <= W) {
      ctx.beginPath();
      ctx.moveTo(Math.round(x0) + 0.5, H);
      ctx.lineTo(Math.round(x0) + 0.5, arrows ? 3 : 0);
      ctx.stroke();
      if (arrows) head(Math.round(x0) + 0.5, 1, 0, -1);
    }
    ctx.font = "700 13px 'Nunito Variable', Nunito, system-ui, sans-serif";
    ctx.textBaseline = "middle";
    // oznake osi
    const halo = (text, x, y, align) => {
      ctx.textAlign = align;
      ctx.lineWidth = 4;
      ctx.strokeStyle = C.bg;
      ctx.lineJoin = "round";
      ctx.strokeText(text, x, y);
      ctx.fillStyle = C.text;
      ctx.fillText(text, x, y);
    };
    if (y0 >= 0 && y0 <= H) halo(st.xLabel ?? "x", W - 8, y0 - 16, "right");
    if (x0 >= 0 && x0 <= W) halo(st.yLabel ?? "y", x0 + 14, 12, "left");
    if (st.numbers === false) return;
    ctx.font = "600 12px 'Nunito Variable', Nunito, system-ui, sans-serif";
    const gx = this.xGrid(st);
    const gy = niceStep(v.ymax - v.ymin, H);
    const decimals = (step) => Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
    const dx = decimals(gx.step);
    const dy = decimals(gy.step);
    const below = ay + 15 > H - 4 ? ay - 12 : ay + 13;
    for (let k = Math.ceil(v.xmin / gx.step); k <= Math.floor(v.xmax / gx.step); k++) {
      if (k === 0) continue;
      const px = this.X(k * gx.step);
      if (px < 12 || px > W - 12) continue;
      const lab = gx.pi ? piLabel(Math.round(k * gx.pi * 12), 12) : fmt(k * gx.step, dx);
      halo(lab, px, below, "center");
      // kratka črtica na osi
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.round(px) + 0.5, ay - 3);
      ctx.lineTo(Math.round(px) + 0.5, ay + 3);
      ctx.stroke();
    }
    const left = ax - 6 < 30 ? ax + 6 : ax - 6;
    const alignY = ax - 6 < 30 ? "left" : "right";
    for (let k = Math.ceil(v.ymin / gy.step); k <= Math.floor(v.ymax / gy.step); k++) {
      if (k === 0) continue;
      const py = this.Y(k * gy.step);
      if (py < 10 || py > H - 10) continue;
      halo(fmt(k * gy.step, dy), left, py, alignY);
      ctx.strokeStyle = C.axis;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ax - 3, Math.round(py) + 0.5);
      ctx.lineTo(ax + 3, Math.round(py) + 0.5);
      ctx.stroke();
    }
    if (x0 >= 0 && x0 <= W && y0 >= 0 && y0 <= H) halo("0", x0 - 6, y0 + 13, "right");
  }

  stroke(ctx, o, color, { width, dash } = {}) {
    const style = o.src?.style || "solid";
    ctx.strokeStyle = color;
    ctx.lineWidth = width ?? o.src?.width ?? 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.setLineDash(dash || (style === "dash" ? [10, 7] : style === "dot" ? [1, 6] : []));
  }

  // y = f(x) z razširitvijo na sezname (več krivulj)
  branches(fn, probe) {
    let v;
    try {
      v = fn(probe);
    } catch {
      return [];
    }
    if (!Array.isArray(v)) return [(x) => toNum(fn(x))];
    return v.map((_, k) => (x) => {
      const r = fn(x);
      return Array.isArray(r) ? r[k] : r;
    });
  }

  // prilagodljivo vzorčenje z zaznavo asimptot; vrne seznam poti v zaslonskih koordinatah
  sampleExplicit(f, swap = false) {
    const v = this.view;
    const [a, b] = swap ? [v.ymin, v.ymax] : [v.xmin, v.xmax];
    const span = swap ? this.W : this.H;
    const lo = swap ? v.xmin : v.ymin;
    const hi = swap ? v.xmax : v.ymax;
    const n = Math.ceil((swap ? this.H : this.W) / 2);
    const toS = (t, y) => (swap ? [this.X(y), this.Y(t)] : [this.X(t), this.Y(y)]);
    const ext = (hi - lo) * 4;
    const paths = [];
    let cur = null;
    const push = (t, y) => {
      const [px, py] = toS(t, Math.max(lo - ext, Math.min(hi + ext, y)));
      if (!cur) {
        cur = [];
        paths.push(cur);
      }
      cur.push(px, py);
    };
    const end = () => (cur = null);
    const tolPx = 0.6;
    const unit = (hi - lo) / span; // enot na piksel
    const refine = (t0, y0, t1, y1, depth) => {
      const tm = (t0 + t1) / 2;
      const ym = f(tm);
      const f0 = Number.isFinite(y0);
      const f1 = Number.isFinite(y1);
      const fm = Number.isFinite(ym);
      if (!f0 && !f1 && !fm) return end();
      if (depth <= 0) {
        if (f0 && f1 && fm) {
          // skok (asimptota ali nezveznost): prekinemo črto
          const jump = Math.abs(y1 - y0) / unit;
          const between = (ym - y0) * (ym - y1) <= 0;
          if (jump > span * 0.5 && !between) {
            end();
            return;
          }
          if (jump > 3 && !between) {
            end();
            push(t1, y1);
            return;
          }
          push(tm, ym);
          push(t1, y1);
          return;
        }
        if (f1) {
          end();
          push(t1, y1);
        } else end();
        return;
      }
      if (f0 && f1 && fm) {
        const lin = (y0 + y1) / 2;
        const err = Math.abs(ym - lin) / unit;
        const outside = (y0 > hi && y1 > hi && ym > hi) || (y0 < lo && y1 < lo && ym < lo);
        if (outside && depth < 6) {
          end();
          return;
        }
        if (err < tolPx && Math.abs(y1 - y0) / unit < span) {
          push(t1, y1);
          return;
        }
      }
      refine(t0, y0, tm, ym, depth - 1);
      refine(tm, ym, t1, y1, depth - 1);
    };
    let t0 = a;
    let y0 = f(a);
    if (Number.isFinite(y0)) push(t0, y0);
    for (let i = 1; i <= n; i++) {
      const t1 = a + ((b - a) * i) / n;
      const y1 = f(t1);
      refine(t0, y0, t1, y1, 8);
      t0 = t1;
      y0 = y1;
    }
    return paths;
  }

  sampleParam(fx, fy, t0, t1, n = 2000) {
    const paths = [];
    let cur = null;
    let last = null;
    const lim = 4 * Math.max(this.W, this.H);
    for (let i = 0; i <= n; i++) {
      const t = t0 + ((t1 - t0) * i) / n;
      const x = toNum(fx(t));
      const y = toNum(fy(t));
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        cur = null;
        last = null;
        continue;
      }
      const px = Math.max(-lim, Math.min(lim, this.X(x)));
      const py = Math.max(-lim, Math.min(lim, this.Y(y)));
      if (last && Math.hypot(px - last[0], py - last[1]) > Math.max(this.W, this.H) * 0.8) cur = null;
      if (!cur) {
        cur = [];
        paths.push(cur);
      }
      cur.push(px, py);
      last = [px, py];
    }
    return paths;
  }

  // implicitna krivulja F(x, y) = 0 (marching squares)
  sampleImplicit(F, cell = 5) {
    const W = this.W;
    const H = this.H;
    const nx = Math.ceil(W / cell) + 1;
    const ny = Math.ceil(H / cell) + 1;
    const vals = new Float64Array(nx * ny);
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const [x, y] = this.inv(i * cell, j * cell);
        const r = toNum(F(x, y));
        vals[j * nx + i] = typeof r === "boolean" ? NaN : r;
      }
    }
    const segs = [];
    const edge = (i0, j0, i1, j1) => {
      const a = vals[j0 * nx + i0];
      const b = vals[j1 * nx + i1];
      const t = a / (a - b);
      return [(i0 + (i1 - i0) * t) * cell, (j0 + (j1 - j0) * t) * cell];
    };
    // prava ničla, ne skok čez pol (npr. tan): preverimo vrednost na sredini
    const real = (p, a, b) => {
      const [x, y] = this.inv(p[0], p[1]);
      const m = Math.abs(toNum(F(x, y)));
      return Number.isFinite(m) && m <= Math.max(Math.abs(a), Math.abs(b));
    };
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const v00 = vals[j * nx + i];
        const v10 = vals[j * nx + i + 1];
        const v01 = vals[(j + 1) * nx + i];
        const v11 = vals[(j + 1) * nx + i + 1];
        if (!(Number.isFinite(v00) && Number.isFinite(v10) && Number.isFinite(v01) && Number.isFinite(v11))) continue;
        const pts = [];
        if (v00 < 0 !== v10 < 0) pts.push([edge(i, j, i + 1, j), v00, v10]);
        if (v10 < 0 !== v11 < 0) pts.push([edge(i + 1, j, i + 1, j + 1), v10, v11]);
        if (v11 < 0 !== v01 < 0) pts.push([edge(i + 1, j + 1, i, j + 1), v11, v01]);
        if (v01 < 0 !== v00 < 0) pts.push([edge(i, j + 1, i, j), v01, v00]);
        const ok = pts.filter(([p, a, b]) => real(p, a, b)).map(([p]) => p);
        if (ok.length >= 2) segs.push(ok[0][0], ok[0][1], ok[1][0], ok[1][1]);
        if (ok.length === 4) segs.push(ok[2][0], ok[2][1], ok[3][0], ok[3][1]);
      }
    }
    return segs;
  }

  strokePaths(ctx, paths) {
    ctx.beginPath();
    for (const p of paths) {
      if (p.length < 2) continue;
      ctx.moveTo(p[0], p[1]);
      for (let i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]);
      if (p.length === 2) ctx.lineTo(p[0] + 0.01, p[1]);
    }
    ctx.stroke();
  }

  drawItem(ctx, o, C) {
    const color = this.colorOf(o, C);
    const v = this.view;
    const sel = this.selected === o.id;
    const w = (o.src?.width ?? 2.5) + (sel ? 1 : 0);
    if (o.kind === "y" || o.kind === "x" || (o.kind === "func" && o.plot === "y")) {
      const swap = o.kind === "x";
      const all = [];
      for (const f of this.branches(o.fn, swap ? (v.ymin + v.ymax) / 2 : (v.xmin + v.xmax) / 2)) {
        const paths = this.sampleExplicit(f, swap);
        all.push(...paths);
      }
      this.stroke(ctx, o, color, { width: w });
      this.strokePaths(ctx, all);
      this.polylines.set(o.id, all);
      if (o.deriv && o.src?.tools?.deriv) {
        const dp = this.sampleExplicit((x) => toNum(o.deriv.fn(x)));
        this.stroke(ctx, o, color, { width: 2, dash: [8, 6] });
        ctx.globalAlpha = 0.75;
        this.strokePaths(ctx, dp);
        ctx.globalAlpha = 1;
        this.polylines.set(`${o.id}'`, dp);
      }
    } else if (o.kind === "func" && o.plot === "seq") {
      // zaporedje: pika za vsak člen na vidnem delu osi x (največ ~1500 pik)
      const a = Math.ceil(v.xmin);
      const b = Math.floor(v.xmax);
      const step = Math.max(1, Math.ceil((b - a + 1) / 1500));
      const pts = b >= a ? o.seq.range(a, b, step).filter(([, y]) => Number.isFinite(y)) : [];
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      const r = step > 1 ? 2.5 : sel ? 5.5 : 4.5;
      ctx.beginPath();
      for (const [n, y] of pts) {
        const px = this.X(n);
        const py = this.Y(y);
        ctx.moveTo(px + r, py);
        ctx.arc(px, py, r, 0, 2 * Math.PI);
      }
      ctx.fill();
      this.polylines.set(o.id, [pts.map(([n, y]) => [this.X(n), this.Y(y)])]);
    } else if (o.kind === "polar") {
      const [t0, t1] = o.domain;
      const paths = this.sampleParam(
        (t) => toNum(o.fn(t)) * Math.cos(t),
        (t) => toNum(o.fn(t)) * Math.sin(t),
        t0,
        t1,
        Math.min(20000, Math.max(1500, Math.ceil(((t1 - t0) / (2 * Math.PI)) * 1500))),
      );
      this.stroke(ctx, o, color, { width: w });
      this.strokePaths(ctx, paths);
      this.polylines.set(o.id, paths);
    } else if (o.kind === "param") {
      const [t0, t1] = o.domain;
      const paths = this.sampleParam(o.fx, o.fy, t0, t1);
      this.stroke(ctx, o, color, { width: w });
      this.strokePaths(ctx, paths);
      this.polylines.set(o.id, paths);
    } else if (o.kind === "implicit" || (o.kind === "region" && o.F)) {
      const segs = this.sampleImplicit(o.F, this.pointers.size ? 7 : 4);
      this.stroke(ctx, o, color, { width: w, dash: o.kind === "region" && o.strict ? [9, 6] : undefined });
      ctx.beginPath();
      for (let i = 0; i < segs.length; i += 4) {
        ctx.moveTo(segs[i], segs[i + 1]);
        ctx.lineTo(segs[i + 2], segs[i + 3]);
      }
      ctx.stroke();
      // za dotik krivulje: vsak odsek kot kratka pot
      const paths = [];
      for (let i = 0; i < segs.length; i += 4) paths.push([segs[i], segs[i + 1], segs[i + 2], segs[i + 3]]);
      this.polylines.set(o.id, paths);
    } else if (o.kind === "points") {
      const pts = o.evalPoints();
      ctx.setLineDash([]);
      for (const [x, y] of pts) {
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        const px = this.X(x);
        const py = this.Y(y);
        if (o.drag) {
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(px, py, 13, 0, 2 * Math.PI);
          ctx.fill();
          ctx.globalAlpha = 1;
          this.handles.push({ kind: "point", id: o.id, x: px, y: py, r: 22 });
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, sel ? 6.5 : 5.5, 0, 2 * Math.PI);
        ctx.fill();
        if (o.src?.label !== false && pts.length <= 12) this.pointLabel(ctx, C, px, py, `(${this.hooks.fmt(x, 4)}; ${this.hooks.fmt(y, 4)})`, color);
      }
      this.polylines.set(o.id, [pts.filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y)).map(([x, y]) => [this.X(x), this.Y(y)])]);
    } else if (o.kind === "table") {
      ctx.setLineDash([]);
      const all = [];
      (o.series || []).forEach((ser, k) => {
        const col = C.palette[((o.src?.color ?? 0) + k) % C.palette.length];
        if (o.src?.lines) {
          this.stroke(ctx, o, col, { width: 2 });
          const sorted = ser.map(([x, y]) => [this.X(x), this.Y(y)]);
          ctx.beginPath();
          sorted.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.stroke();
        }
        ctx.fillStyle = col;
        for (const [x, y, row] of ser) {
          const px = this.X(x);
          const py = this.Y(y);
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, 2 * Math.PI);
          ctx.fill();
          all.push([px, py]);
          if (!o.src?.ref) this.handles.push({ kind: "cell", id: o.id, col: k + 1, row, x: px, y: py, r: 18 });
        }
      });
      this.polylines.set(o.id, [all]);
      if (o.fit) {
        const paths = this.sampleExplicit((x) => o.fit.fn(x));
        this.stroke(ctx, o, color, { width: 2.5 });
        this.strokePaths(ctx, paths);
        this.polylines.set(`${o.id}~`, paths);
      }
    }
    ctx.setLineDash([]);
  }

  pointLabel(ctx, C, px, py, text, color) {
    ctx.font = "700 12px 'Nunito Variable', Nunito, system-ui, sans-serif";
    ctx.textAlign = px > this.W - 90 ? "right" : "left";
    ctx.textBaseline = "bottom";
    const x = px + (ctx.textAlign === "right" ? -9 : 9);
    const y = py < 24 ? py + 22 : py - 8;
    ctx.lineWidth = 4;
    ctx.strokeStyle = C.bg;
    ctx.lineJoin = "round";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color || C.text;
    ctx.fillText(text, x, y);
  }

  drawShade(ctx, o, C, W, H) {
    const color = this.colorOf(o, C);
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = color;
    const v = this.view;
    if (o.kind === "ineq-y" || o.kind === "ineq-x") {
      const swap = o.kind === "ineq-x";
      const up = o.op === ">" || o.op === ">=";
      for (const f of this.branches(o.fn, swap ? (v.ymin + v.ymax) / 2 : (v.xmin + v.xmax) / 2)) {
        const paths = this.sampleExplicit(f, swap);
        for (const p of paths) {
          if (p.length < 4) continue;
          ctx.beginPath();
          if (!swap) {
            const edgeY = up ? -5 : H + 5;
            ctx.moveTo(p[0], edgeY);
            for (let i = 0; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]);
            ctx.lineTo(p[p.length - 2], edgeY);
          } else {
            const edgeX = up ? W + 5 : -5;
            ctx.moveTo(edgeX, p[1]);
            for (let i = 0; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]);
            ctx.lineTo(edgeX, p[p.length - 1]);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        this.stroke(ctx, o, color, { dash: o.op === "<" || o.op === ">" ? [9, 6] : [] });
        this.strokePaths(ctx, paths);
        this.polylines.set(o.id, paths);
        ctx.globalAlpha = 0.2;
      }
    } else if (o.kind === "region") {
      // mreža celic, ki jo povečamo z glajenjem
      const cell = this.pointers.size ? 6 : 3;
      const nx = Math.ceil(W / cell);
      const ny = Math.ceil(H / cell);
      const off = (this.off ||= document.createElement("canvas"));
      off.width = nx;
      off.height = ny;
      const octx = off.getContext("2d");
      const img = octx.createImageData(nx, ny);
      const rgb = this.rgb(color);
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const [x, y] = this.inv((i + 0.5) * cell, (j + 0.5) * cell);
          const r = o.cond(x, y);
          if (r === true || (typeof r === "number" && r > 0)) {
            const k = (j * nx + i) * 4;
            img.data[k] = rgb[0];
            img.data[k + 1] = rgb[1];
            img.data[k + 2] = rgb[2];
            img.data[k + 3] = 255;
          }
        }
      }
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(off, 0, 0, nx * cell, ny * cell);
    }
    ctx.restore();
  }

  rgb(color) {
    const c = (this.rgbCtx ||= document.createElement("canvas").getContext("2d"));
    c.fillStyle = "#000";
    c.fillStyle = color;
    const s = c.fillStyle;
    if (s.startsWith("#")) return [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
    const m = s.match(/\d+/g);
    return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
  }

  drawTangent(ctx, o, C) {
    const fn = o.kind === "y" || o.plot === "y" ? o.fn : null;
    if (!fn || !o.deriv) return;
    const x0 = o.src.tools.tangent;
    const y0 = toNum(fn(x0));
    const k = toNum(o.deriv.fn(x0));
    if (!Number.isFinite(y0)) return;
    const color = this.colorOf(o, C);
    const v = this.view;
    if (Number.isFinite(k)) {
      ctx.strokeStyle = C.text;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(this.X(v.xmin), this.Y(y0 + k * (v.xmin - x0)));
      ctx.lineTo(this.X(v.xmax), this.Y(y0 + k * (v.xmax - x0)));
      ctx.stroke();
    }
    const px = this.X(x0);
    const py = this.Y(y0);
    ctx.fillStyle = C.bg;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(px, py, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    this.handles.push({ kind: "tangent", id: o.id, x: px, y: py, r: 24 });
    const L = this.hooks.label;
    this.pointLabel(ctx, C, px, py, `${L("slope")} = ${this.hooks.fmt(k, 4)}`, C.text);
  }

  drawArea(ctx, o, C) {
    const fn = o.kind === "y" || o.plot === "y" ? o.fn : null;
    if (!fn) return;
    let [a, b] = o.src.tools.area;
    const color = this.colorOf(o, C);
    const f = (x) => toNum(fn(x));
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const n = 300;
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.X(lo), this.Y(0));
    for (let i = 0; i <= n; i++) {
      const x = lo + ((hi - lo) * i) / n;
      const y = f(x);
      ctx.lineTo(this.X(x), this.Y(Number.isFinite(y) ? Math.max(this.view.ymin - 1e3, Math.min(this.view.ymax + 1e3, y)) : 0));
    }
    ctx.lineTo(this.X(hi), this.Y(0));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    const val = integrate(f, a, b);
    // ročaja za meji
    for (const [which, x] of [
      [0, a],
      [1, b],
    ]) {
      const px = this.X(x);
      const py = this.Y(0);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect?.(px - 6, py - 14, 12, 28, 6);
      if (!ctx.roundRect) ctx.rect(px - 6, py - 14, 12, 28);
      ctx.fill();
      this.handles.push({ kind: "area", which, id: o.id, x: px, y: py, r: 24 });
    }
    const L = this.hooks.label;
    const mx = this.X((a + b) / 2);
    const my = this.Y(f((a + b) / 2) / 2);
    ctx.font = "800 13px 'Nunito Variable', Nunito, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = `∫ = ${this.hooks.fmt(val, 5)}`;
    ctx.lineWidth = 4;
    ctx.strokeStyle = C.bg;
    ctx.strokeText(text, mx, Number.isFinite(my) ? Math.max(14, Math.min(this.H - 14, my)) : this.Y(0) - 20);
    ctx.fillStyle = C.text;
    ctx.fillText(text, mx, Number.isFinite(my) ? Math.max(14, Math.min(this.H - 14, my)) : this.Y(0) - 20);
  }

  // posebne točke izbrane krivulje (ničle, ekstremi, presečišča z drugimi krivuljami)
  computePois(items) {
    this.pois = [];
    const o = items.find((x) => x.id === this.selected);
    if (!o || o.src?.hidden) return;
    const v = this.view;
    const isFn = (x) => !x.src?.hidden && (x.kind === "y" || (x.kind === "func" && x.plot === "y")) && x.fn;
    if (isFn(o)) {
      const fs = this.branches(o.fn, (v.xmin + v.xmax) / 2);
      for (const f of fs) this.pois.push(...specialPoints(f, v.xmin, v.xmax, Math.max(300, Math.round(this.W))).map((p) => ({ ...p, id: o.id })));
      for (const other of items) {
        if (other === o || !isFn(other)) continue;
        const gs = this.branches(other.fn, (v.xmin + v.xmax) / 2);
        for (const f of fs) for (const g of gs) this.pois.push(...intersections(f, g, v.xmin, v.xmax, Math.max(300, Math.round(this.W))).map((p) => ({ ...p, id: o.id })));
      }
    } else if (o.kind === "x" && o.fn) {
      // x = f(y): presečišče z osjo y in ničle
      for (const p of specialPoints((y) => toNum(o.fn(y)), v.ymin, v.ymax, 400)) {
        if (p.type === "root") this.pois.push({ x: 0, y: p.x, type: "yint", id: o.id });
        if (p.type === "yint") this.pois.push({ x: p.y, y: 0, type: "root", id: o.id });
      }
    }
    // združimo točke na istem mestu (npr. ničla in minimum x² pri 0)
    const merged = [];
    for (const p of this.pois) {
      const q = merged.find((m) => Math.abs(this.X(m.x) - this.X(p.x)) < 2 && Math.abs(this.Y(m.y) - this.Y(p.y)) < 2);
      if (q) {
        if (!q.types.includes(p.type)) q.types.push(p.type);
      } else merged.push({ ...p, types: [p.type] });
    }
    this.pois = merged.filter((p) => p.x >= v.xmin && p.x <= v.xmax && p.y >= v.ymin && p.y <= v.ymax);
  }

  drawPois(ctx, C, items) {
    this.computePois(items);
    const L = this.hooks.label;
    for (const p of this.pois) {
      const px = this.X(p.x);
      const py = this.Y(p.y);
      const on = this.shown.some((s) => Math.abs(s.x - p.x) < 1e-9 && Math.abs(s.y - p.y) < 1e-9);
      ctx.fillStyle = on ? C.text : C.poi;
      ctx.strokeStyle = C.bg;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, on ? 6 : 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      if (on) this.pointLabel(ctx, C, px, py, `${p.types.map((t) => L(t)).join(", ")} (${this.hooks.fmt(p.x, 4)}; ${this.hooks.fmt(p.y, 4)})`, C.text);
    }
  }

  drawTrace(ctx, C) {
    if (!this.trace) return;
    const { x, y, color } = this.trace;
    const px = this.X(x);
    const py = this.Y(y);
    ctx.setLineDash([]);
    ctx.fillStyle = color || C.text;
    ctx.strokeStyle = C.bg;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(px, py, 6.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    const L = this.hooks.label;
    const kind = this.trace.types ? `${this.trace.types.map((t) => L(t)).join(", ")} ` : "";
    this.pointLabel(ctx, C, px, py, `${kind}(${this.hooks.fmt(x, 4)}; ${this.hooks.fmt(y, 4)})`, C.text);
  }

  // ---------- dotik in miška ----------

  bindEvents() {
    const c = this.canvas;
    c.style.touchAction = "none";
    c.addEventListener("pointerdown", (e) => this.down(e));
    c.addEventListener("pointermove", (e) => this.move(e));
    c.addEventListener("pointerup", (e) => this.up(e));
    c.addEventListener("pointercancel", (e) => this.up(e, true));
    c.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse" && !this.pointers.size) this.hover(null);
    });
    c.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const r = c.getBoundingClientRect();
        const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
        this.zoomAt(Math.exp(d * 0.0016), e.clientX - r.left, e.clientY - r.top);
      },
      { passive: false },
    );
    c.addEventListener("dblclick", (e) => {
      const r = c.getBoundingClientRect();
      this.zoomAt(0.5, e.clientX - r.left, e.clientY - r.top, true);
    });
    c.addEventListener("keydown", (e) => {
      const k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (k) {
        e.preventDefault();
        const v = this.view;
        const dx = (v.xmax - v.xmin) * 0.1 * k[0];
        const dy = (v.ymax - v.ymin) * 0.1 * k[1];
        this.view = { xmin: v.xmin + dx, xmax: v.xmax + dx, ymin: v.ymin + dy, ymax: v.ymax + dy };
        this.draw();
      } else if (e.key === "+" || e.key === "=") this.zoomAt(0.8);
      else if (e.key === "-") this.zoomAt(1.25);
    });
  }

  local(e) {
    const r = this.canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  zoomAt(f, px = this.W / 2, py = this.H / 2, animate = false) {
    const v = this.view;
    const [cx, cy] = this.inv(px, py);
    const target = { xmin: cx - (cx - v.xmin) * f, xmax: cx + (v.xmax - cx) * f, ymin: cy - (cy - v.ymin) * f, ymax: cy + (v.ymax - cy) * f };
    if (target.xmax - target.xmin < 1e-9 || target.xmax - target.xmin > 1e9) return;
    if (animate) this.animateTo(target);
    else {
      this.view = target;
      this.draw();
    }
  }

  animateTo(target, ms = 220) {
    const from = { ...this.view };
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      const e = 1 - (1 - k) ** 3;
      const v = {};
      for (const key of ["xmin", "xmax", "ymin", "ymax"]) v[key] = from[key] + (target[key] - from[key]) * e;
      this.view = v;
      this.draw();
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  hitHandle(px, py, touch) {
    let best = null;
    for (const h of this.handles) {
      const d = Math.hypot(h.x - px, h.y - py);
      if (d <= h.r * (touch ? 1.2 : 0.8) && (!best || d < best.d)) best = { ...h, d };
    }
    return best;
  }

  hitPoi(px, py, touch) {
    let best = null;
    for (const p of this.pois) {
      const d = Math.hypot(this.X(p.x) - px, this.Y(p.y) - py);
      if (d <= (touch ? 22 : 12) && (!best || d < best.d)) best = { p, d };
    }
    return best?.p || null;
  }

  // najbližja krivulja pod prstom/miško
  hitCurve(px, py, touch) {
    const tol = touch ? 22 : 10;
    let best = null;
    for (const [id, paths] of this.polylines) {
      for (const p of paths) {
        const pts = Array.isArray(p[0]) ? p : null; // točke: [[x,y]…]
        if (pts) {
          for (const [x, y] of pts) {
            const d = Math.hypot(x - px, y - py);
            if (d < tol && (!best || d < best.d)) best = { id, d, px: x, py: y };
          }
          continue;
        }
        for (let i = 0; i + 3 < p.length; i += 2) {
          const [x1, y1, x2, y2] = [p[i], p[i + 1], p[i + 2], p[i + 3]];
          const dx = x2 - x1;
          const dy = y2 - y1;
          const L2 = dx * dx + dy * dy || 1;
          const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L2));
          const qx = x1 + t * dx;
          const qy = y1 + t * dy;
          const d = Math.hypot(qx - px, qy - py);
          if (d < tol && (!best || d < best.d)) best = { id, d, px: qx, py: qy };
        }
      }
    }
    return best;
  }

  // točka sledenja na krivulji
  traceAt(id, px, py) {
    const model = this.hooks.getModel();
    const baseId = id.replace(/['~]$/, "");
    const o = model.items.find((x) => x.id === baseId);
    if (!o) return null;
    const C = this.C || this.colors();
    const color = this.colorOf(o, C);
    const [gx, gy] = this.inv(px, py);
    if (id.endsWith("'") && o.deriv) return { x: gx, y: toNum(o.deriv.fn(gx)), color, id: baseId };
    if (id.endsWith("~") && o.fit) return { x: gx, y: o.fit.fn(gx), color, id: baseId };
    if ((o.kind === "y" || o.plot === "y" || o.kind === "ineq-y") && o.fn) {
      const fs = this.branches(o.fn, gx);
      let best = null;
      for (const f of fs) {
        const y = f(gx);
        if (Number.isFinite(y) && (!best || Math.abs(this.Y(y) - py) < Math.abs(this.Y(best) - py))) best = y;
      }
      if (best === null) return null;
      // pripni na posebno točko v bližini
      const snap = this.pois.find((p) => Math.hypot(this.X(p.x) - px, this.Y(p.y) - this.Y(best)) < 10);
      if (snap) return { x: snap.x, y: snap.y, color, id: baseId, types: snap.types };
      return { x: gx, y: best, color, id: baseId };
    }
    if ((o.kind === "x" || o.kind === "ineq-x") && o.fn) {
      const x = toNum(o.fn(gy));
      return Number.isFinite(x) ? { x, y: gy, color, id: baseId } : null;
    }
    return { x: gx, y: gy, color, id: baseId };
  }

  down(e) {
    this.canvas.focus({ preventScroll: true });
    this.canvas.setPointerCapture?.(e.pointerId);
    const [px, py] = this.local(e);
    this.pointers.set(e.pointerId, { px, py, x0: px, y0: py, t0: performance.now() });
    const touch = e.pointerType !== "mouse";
    if (this.pointers.size === 2) {
      // začetek povečave s prsti
      this.mode = { type: "pinch", view: { ...this.view }, start: [...this.pointers.values()].map((p) => [p.px, p.py]) };
      this.trace = null;
      return;
    }
    if (this.pointers.size > 2) return;
    const h = this.hitHandle(px, py, touch);
    if (h) {
      this.mode = { type: "handle", h };
      this.canvas.classList.add("dragging");
      return;
    }
    const poi = this.hitPoi(px, py, touch);
    if (poi) {
      this.mode = { type: "poi", poi };
      return;
    }
    const c = this.hitCurve(px, py, touch);
    if (c) {
      this.mode = { type: "trace", id: c.id };
      const baseId = c.id.replace(/['~]$/, "");
      if (this.selected !== baseId) {
        this.selected = baseId;
        this.shown = [];
        this.hooks.onSelect?.(baseId);
      }
      this.trace = this.traceAt(c.id, c.px, c.py);
      this.draw();
      return;
    }
    this.mode = { type: "pan", view: { ...this.view }, moved: false };
  }

  move(e) {
    const p = this.pointers.get(e.pointerId);
    const [px, py] = this.local(e);
    if (!p) {
      if (e.pointerType === "mouse") this.hover([px, py]);
      return;
    }
    p.px = px;
    p.py = py;
    const m = this.mode;
    if (!m) return;
    if (m.type === "pinch" && this.pointers.size >= 2) {
      const [a, b] = [...this.pointers.values()];
      const [s0, s1] = m.start;
      const d0 = Math.hypot(s1[0] - s0[0], s1[1] - s0[1]) || 1;
      const d1 = Math.hypot(b.px - a.px, b.py - a.py) || 1;
      const f = d0 / d1;
      const v0 = m.view;
      const c0 = [(s0[0] + s1[0]) / 2, (s0[1] + s1[1]) / 2];
      const c1 = [(a.px + b.px) / 2, (a.py + b.py) / 2];
      // točka grafa pod začetnim središčem ostane pod prsti
      const gx = v0.xmin + (c0[0] / this.W) * (v0.xmax - v0.xmin);
      const gy = v0.ymin + ((this.H - c0[1]) / this.H) * (v0.ymax - v0.ymin);
      const w = (v0.xmax - v0.xmin) * f;
      const hgt = (v0.ymax - v0.ymin) * f;
      const xmin = gx - (c1[0] / this.W) * w;
      const ymin = gy - ((this.H - c1[1]) / this.H) * hgt;
      if (w > 1e-9 && w < 1e9) this.view = { xmin, xmax: xmin + w, ymin, ymax: ymin + hgt };
      this.draw();
      return;
    }
    if (m.type === "pan") {
      const dx = px - p.x0;
      const dy = py - p.y0;
      if (!m.moved && Math.hypot(dx, dy) < 4) return;
      m.moved = true;
      const v0 = m.view;
      const ux = (v0.xmax - v0.xmin) / this.W;
      const uy = (v0.ymax - v0.ymin) / this.H;
      this.view = { xmin: v0.xmin - dx * ux, xmax: v0.xmax - dx * ux, ymin: v0.ymin + dy * uy, ymax: v0.ymax + dy * uy };
      this.canvas.classList.add("dragging");
      this.draw();
      return;
    }
    if (m.type === "trace") {
      const model = this.hooks.getModel();
      const baseId = m.id.replace(/['~]$/, "");
      const o = model.items.find((x) => x.id === baseId);
      if (!o) return;
      if (o.kind === "y" || o.plot === "y" || o.kind === "x" || o.kind === "ineq-y" || o.kind === "ineq-x" || m.id.endsWith("'") || m.id.endsWith("~")) this.trace = this.traceAt(m.id, px, py);
      else {
        const c = this.hitCurve(px, py, true);
        if (c && c.id === m.id) {
          const [gx, gy] = this.inv(c.px, c.py);
          this.trace = { x: gx, y: gy, color: this.trace?.color, id: baseId };
        }
      }
      this.draw();
      return;
    }
    if (m.type === "handle") {
      const [gx, gy] = this.inv(px, py);
      this.hooks.onDrag?.(m.h, gx, gy);
      this.draw();
    }
  }

  up(e, cancel = false) {
    const p = this.pointers.get(e.pointerId);
    this.pointers.delete(e.pointerId);
    const m = this.mode;
    this.canvas.classList.remove("dragging");
    if (this.pointers.size === 1 && m?.type === "pinch") {
      // en prst ostane: nadaljujemo s premikanjem
      const [q] = this.pointers.values();
      q.x0 = q.px;
      q.y0 = q.py;
      this.mode = { type: "pan", view: { ...this.view }, moved: true };
      return;
    }
    if (this.pointers.size) return;
    this.mode = null;
    if (cancel || !p) return this.draw();
    const tap = Math.hypot(p.px - p.x0, p.py - p.y0) < 6 && performance.now() - p.t0 < 500;
    if (m?.type === "handle") this.hooks.onDragEnd?.(m.h);
    if (m?.type === "poi" && tap) {
      const i = this.shown.findIndex((s) => s.x === m.poi.x && s.y === m.poi.y);
      if (i >= 0) this.shown.splice(i, 1);
      else this.shown.push(m.poi);
    }
    if (m?.type === "trace") {
      // dotik krivulje pusti točko označeno, dokler se ne dotakneš drugje
      if (!tap && this.trace?.types) this.shown.push({ x: this.trace.x, y: this.trace.y });
      this.trace = tap ? this.trace : null;
    }
    if (m?.type === "pan" && !m.moved) {
      // dotik praznega dela: počistimo izbiro
      this.trace = null;
      if (this.selected) {
        this.selected = null;
        this.shown = [];
        this.hooks.onSelect?.(null);
      }
    }
    this.draw();
  }

  hover(pt) {
    if (!pt) {
      this.canvas.style.cursor = "";
      return;
    }
    const [px, py] = pt;
    const h = this.hitHandle(px, py, false);
    const c = !h && (this.hitPoi(px, py, false) || this.hitCurve(px, py, false));
    this.canvas.style.cursor = h ? "grab" : c ? "pointer" : "";
  }

  select(id) {
    if (this.selected === id) return;
    this.selected = id;
    this.shown = [];
    this.trace = null;
    this.draw();
  }

  /** Vse vidne točke in krivulje v okno (Prilagodi). */
  fitBounds() {
    const model = this.hooks.getModel();
    const xs = [];
    const ys = [];
    for (const o of model.items) {
      if (o.src?.hidden) continue;
      if (o.kind === "points") for (const [x, y] of o.evalPoints()) xs.push(x), ys.push(y);
      if (o.kind === "table") for (const s of o.series || []) for (const [x, y] of s) xs.push(x), ys.push(y);
      if ((o.kind === "y" || o.plot === "y") && o.fn) {
        const v = this.view;
        for (const p of specialPoints((x) => toNum(o.fn(x)), v.xmin, v.xmax, 300)) xs.push(p.x), ys.push(p.y);
      }
    }
    // presečišča funkcij (tudi zunaj trenutnega okna, do ±50)
    const fns = model.items.filter((o) => !o.src?.hidden && (o.kind === "y" || o.plot === "y") && o.fn);
    for (let i = 0; i < fns.length; i++)
      for (let j = i + 1; j < fns.length; j++)
        for (const p of intersections((x) => toNum(fns[i].fn(x)), (x) => toNum(fns[j].fn(x)), -50, 50, 2000)) xs.push(p.x), ys.push(p.y);
    const fin = (a) => a.filter(Number.isFinite);
    const X = fin(xs);
    const Y = fin(ys);
    if (!X.length) return null;
    let [x0, x1] = [Math.min(...X), Math.max(...X)];
    let [y0, y1] = [Math.min(...Y), Math.max(...Y)];
    const padX = Math.max((x1 - x0) * 0.15, 1);
    const padY = Math.max((y1 - y0) * 0.15, 1);
    return { xmin: x0 - padX, xmax: x1 + padX, ymin: y0 - padY, ymax: y1 + padY };
  }

  /** Slika grafa (PNG) z legendo izrazov. */
  async toBlob(legend = [], scale = 2) {
    const W = this.W;
    const H = this.H;
    const c = document.createElement("canvas");
    c.width = W * scale;
    c.height = H * scale;
    const ctx = c.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    this.render(ctx, W, H, { exporting: true });
    const C = this.C;
    if (legend.length) {
      ctx.font = "700 13px 'Nunito Variable', Nunito, system-ui, sans-serif";
      const rows = legend.slice(0, 12);
      const w = Math.min(W - 20, Math.max(...rows.map((r) => ctx.measureText(r.text).width)) + 40);
      const h = rows.length * 22 + 12;
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = C.bg;
      ctx.strokeStyle = C.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(10, 10, w, h, 10) : ctx.rect(10, 10, w, h);
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 1;
      rows.forEach((r, i) => {
        const y = 10 + 17 + i * 22;
        ctx.fillStyle = C.palette[(r.color ?? 0) % C.palette.length];
        ctx.beginPath();
        ctx.arc(26, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = C.text;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(r.text, 40, y, w - 36);
      });
    }
    ctx.font = "800 12px 'Nunito Variable', Nunito, system-ui, sans-serif";
    ctx.fillStyle = C.poi;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("Evklid", W - 10, H - 8);
    return new Promise((res) => c.toBlob(res, "image/png"));
  }

  destroy() {
    this.ro.disconnect();
  }
}

export { niceNumber };
