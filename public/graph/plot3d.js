// 3D graf ploskve z = f(x, y) na platnu: vrtenje s prstom, miško ali puščicami, povečava s kolescem
// ali s prsti. Barva ploskve pove višino (lestvica ob grafu), zato oblika ni odvisna samo od barve.

/**
 * opts: { f(x, y), x: [a, b], y: [c, d], n (mreža), label(z) → besedilo }
 * Vrne { draw(), set(opts), destroy() }.
 */
export function createPlot3d(canvas, opts) {
  let o = { n: 44, ...opts };
  let az = -0.75; // vrtenje okoli osi z
  let el = 0.55; // nagib
  let zoom = 1;
  let grid = null;
  const ctx = canvas.getContext("2d");

  function sample() {
    const { f, n } = o;
    const [x0, x1] = o.x;
    const [y0, y1] = o.y;
    const pts = [];
    let zmin = Infinity;
    let zmax = -Infinity;
    for (let i = 0; i <= n; i++) {
      const row = [];
      for (let j = 0; j <= n; j++) {
        const x = x0 + ((x1 - x0) * i) / n;
        const y = y0 + ((y1 - y0) * j) / n;
        const z = f(x, y);
        row.push(Number.isFinite(z) ? z : NaN);
        if (Number.isFinite(z)) {
          zmin = Math.min(zmin, z);
          zmax = Math.max(zmax, z);
        }
      }
      pts.push(row);
    }
    // obrežemo skrajne vrednosti (1/x … ), da ploskev ostane berljiva
    const all = pts.flat().filter(Number.isFinite).sort((a, b) => a - b);
    if (all.length > 20) {
      const lo = all[Math.floor(all.length * 0.02)];
      const hi = all[Math.ceil(all.length * 0.98) - 1];
      if (zmax - zmin > 20 * (hi - lo || 1)) {
        zmin = lo;
        zmax = hi;
      }
    }
    if (zmin === Infinity) zmin = zmax = 0;
    if (zmax - zmin < 1e-12) {
      zmin -= 1;
      zmax += 1;
    }
    grid = { pts, zmin, zmax };
  }

  const css = (name, d) => getComputedStyle(canvas).getPropertyValue(name).trim() || d;
  function color(t, shade) {
    // zaporedna lestvica: modra (nizko) → zelena → rumena (visoko)
    const h = 230 - 180 * t;
    const l = 38 + 22 * t;
    return `hsl(${h.toFixed(0)} 70% ${(l * shade).toFixed(1)}%)`;
  }

  function draw() {
    if (!grid) sample();
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const { pts, zmin, zmax } = grid;
    const n = o.n;
    // normirane koordinate v kocki [-1, 1]
    const ca = Math.cos(az);
    const sa = Math.sin(az);
    const ce = Math.cos(el);
    const se = Math.sin(el);
    // merilo, pri katerem kocka [-1, 1]³ ostane na platnu pri vsakem nagibu (√2 vodoravno, √3 navpično)
    const S = Math.min(w / (2 * Math.SQRT2), h / (2 * Math.sqrt(3))) * 0.84 * zoom;
    const P = (u, v, t) => {
      const X = u * ca - v * sa;
      const Y = u * sa + v * ca;
      return { sx: w / 2 + X * S, sy: h / 2 + (Y * se - t * ce) * S, d: Y * ce + t * se };
    };
    const nz = (z) => ((z - zmin) / (zmax - zmin)) * 2 - 1;
    const U = (i) => (i / n) * 2 - 1;
    const quads = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const zs = [pts[i][j], pts[i + 1][j], pts[i + 1][j + 1], pts[i][j + 1]];
        if (zs.some((z) => !Number.isFinite(z))) continue;
        const cl = zs.map((z) => Math.max(-1.15, Math.min(1.15, nz(z))));
        const c = [P(U(i), U(j), cl[0]), P(U(i + 1), U(j), cl[1]), P(U(i + 1), U(j + 1), cl[2]), P(U(i), U(j + 1), cl[3])];
        const avg = (zs[0] + zs[1] + zs[2] + zs[3]) / 4;
        // preprosto senčenje po naklonu
        const dzx = cl[1] - cl[0];
        const dzy = cl[3] - cl[0];
        const shade = 0.82 + 0.18 * (1 / Math.sqrt(1 + (dzx * n) ** 2 / 4 + (dzy * n) ** 2 / 4));
        quads.push({ c, d: (c[0].d + c[1].d + c[2].d + c[3].d) / 4, t: Math.max(0, Math.min(1, (avg - zmin) / (zmax - zmin))), shade });
      }
    }
    quads.sort((a, b) => a.d - b.d); // najprej oddaljeni deli
    // osi (za ploskvijo)
    const axis = css("--muted", "#888");
    const text = css("--text", "#111");
    ctx.lineWidth = 1;
    ctx.strokeStyle = axis;
    const box = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    ].map(([u, v, t]) => P(u, v, t));
    ctx.beginPath();
    box.forEach((p, k) => (k ? ctx.lineTo(p.sx, p.sy) : ctx.moveTo(p.sx, p.sy)));
    ctx.closePath();
    ctx.stroke();
    // spredaj (bližje gledalcu) sta stranici z večjo globino d; os z postavimo v skrajno levi kot
    const vF = P(0, 1, -1).d > P(0, -1, -1).d ? 1 : -1;
    const uF = P(1, 0, -1).d > P(-1, 0, -1).d ? 1 : -1;
    const zc = [[-1, -1], [1, -1], [1, 1], [-1, 1]].reduce((best, c) => (P(c[0], c[1], -1).sx < P(best[0], best[1], -1).sx ? c : best));
    const up0 = P(zc[0], zc[1], -1);
    const up1 = P(zc[0], zc[1], 1);
    ctx.beginPath();
    ctx.moveTo(up0.sx, up0.sy);
    ctx.lineTo(up1.sx, up1.sy);
    ctx.stroke();
    const edge = css("--surface", "#fff");
    for (const q of quads) {
      ctx.beginPath();
      q.c.forEach((p, k) => (k ? ctx.lineTo(p.sx, p.sy) : ctx.moveTo(p.sx, p.sy)));
      ctx.closePath();
      ctx.fillStyle = color(q.t, q.shade);
      ctx.fill();
      ctx.strokeStyle = edge;
      ctx.globalAlpha = 0.35;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // oznake osi
    ctx.fillStyle = text;
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lab = (u, v, t, s) => {
      const p = P(u, v, t);
      ctx.fillText(s, p.sx, p.sy);
    };
    const L = o.label || ((v) => String(v));
    lab(0, vF * 1.32, -1, "x");
    lab(uF * 1.32, 0, -1, "y");
    lab(zc[0], zc[1], 1.22, "z");
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = axis;
    lab(-1, vF * 1.16, -1, L(o.x[0]));
    lab(1, vF * 1.16, -1, L(o.x[1]));
    lab(uF * 1.16, -1, -1, L(o.y[0]));
    lab(uF * 1.16, 1, -1, L(o.y[1]));
    ctx.textAlign = "right";
    const zl = (t, s) => {
      const p = P(zc[0], zc[1], t);
      ctx.fillText(s, p.sx - 14, p.sy);
    };
    zl(-1, L(zmin));
    zl(1, L(zmax));
  }

  // vrtenje
  let drag = null;
  const pointers = new Map();
  const onDown = (e) => {
    canvas.setPointerCapture?.(e.pointerId);
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    drag = { x: e.clientX, y: e.clientY, az, el, dist: pinchDist() };
  };
  const pinchDist = () => {
    if (pointers.size < 2) return 0;
    const [a, b] = [...pointers.values()];
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
  };
  const onMove = (e) => {
    if (!drag || !pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size >= 2) {
      const d = pinchDist();
      if (drag.dist) zoom = Math.max(0.4, Math.min(3, zoom * (d / drag.dist)));
      drag.dist = d;
    } else {
      az = drag.az - (e.clientX - drag.x) * 0.01;
      el = Math.max(-0.2, Math.min(1.5, drag.el + (e.clientY - drag.y) * 0.01));
    }
    draw();
  };
  const onUp = (e) => {
    pointers.delete(e.pointerId);
    if (!pointers.size) drag = null;
    else drag = { ...drag, dist: pinchDist() };
  };
  const onWheel = (e) => {
    e.preventDefault();
    zoom = Math.max(0.4, Math.min(3, zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1)));
    draw();
  };
  const onKey = (e) => {
    const k = { ArrowLeft: [0.12, 0], ArrowRight: [-0.12, 0], ArrowUp: [0, -0.08], ArrowDown: [0, 0.08] }[e.key];
    if (e.key === "+" || e.key === "=") zoom = Math.min(3, zoom * 1.1);
    else if (e.key === "-") zoom = Math.max(0.4, zoom / 1.1);
    else if (!k) return;
    else {
      az += k[0];
      el = Math.max(-0.2, Math.min(1.5, el + k[1]));
    }
    e.preventDefault();
    draw();
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("keydown", onKey);
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => draw()) : null;
  ro?.observe(canvas);

  return {
    draw,
    set(next) {
      o = { ...o, ...next };
      grid = null;
      draw();
    },
    reset() {
      az = -0.75;
      el = 0.55;
      zoom = 1;
      draw();
    },
    range: () => (grid ? [grid.zmin, grid.zmax] : null),
    destroy() {
      ro?.disconnect();
    },
  };
}
