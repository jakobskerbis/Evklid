// Risalna površina (prst, miška, pisalo). Pri pisalu so dotiki dlani prezrti.
// Uporabljata jo plošča »Piši« pri nalogah (public/pad.js) in okno »Piši« znanstvenega kalkulatorja (public/graph/pisi.js).
// api.onChange (neobvezno): klic po koncu poteze, razveljavitvi ali brisanju (branje po premoru pisanja).

export function createInk(canvas) {
  const ctx = canvas.getContext("2d");
  const strokes = [];
  let active = null;
  let lastPen = -Infinity; // čas zadnjega dotika s pisalom (zavračanje dlani)
  let extra = 0; // dodatna višina (»+ prostor«)
  let baseH = 0; // višina okvirja brez dodatnega prostora
  let canvasExtra = 0; // dodatna višina samega platna, ko okvir ne more zrasti (plošča ob strani)
  // changed: zapis se je spremenil po zadnjem branju; version: številka spremembe (za branje med pisanjem)
  const api = { tool: "pen", changed: false, version: 0 };
  const wrap = canvas.parentElement;

  const color = () => getComputedStyle(canvas).color || "#111";

  function size() {
    const r = canvas.parentElement.getBoundingClientRect();
    return { w: r.width, h: canvas.clientHeight };
  }

  api.fit = () => {
    const base = wrap.clientHeight - 2;
    if (base <= 0) return;
    if (!extra) baseH = wrap.clientHeight;
    canvas.style.height = base + canvasExtra + "px";
    const { w, h } = size();
    if (!w) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  };

  function drawStroke(c, s, ink) {
    c.save();
    c.globalCompositeOperation = s.tool === "eraser" ? "destination-out" : "source-over";
    c.strokeStyle = ink;
    c.lineWidth = s.tool === "eraser" ? 22 : 3;
    c.lineCap = c.lineJoin = "round";
    c.beginPath();
    const p = s.pts;
    c.moveTo(p[0][0], p[0][1]);
    if (p.length === 1) c.lineTo(p[0][0] + 0.1, p[0][1]);
    for (let i = 1; i < p.length; i++) c.lineTo(p[i][0], p[i][1]);
    c.stroke();
    c.restore();
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const c = color();
    for (const s of strokes) drawStroke(ctx, s, c);
  }

  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "pen") {
      lastPen = performance.now();
      // dlan se je dotaknila pred pisalom: poteza dlani ni zapis, pisalo ima prednost
      if (active?.touch) {
        strokes.splice(strokes.indexOf(active), 1);
        active = null;
        redraw();
      }
    }
    // Dlan na zaslonu: dotik s prstom tik ob pisalu prezremo (1,5 s), kasneje prst spet piše.
    if (e.pointerType === "touch" && performance.now() - lastPen < 1500) return;
    if (active || (e.pointerType === "touch" && !e.isPrimary)) return; // drugi prst med pisanjem ne prekine poteze
    if (e.button > 0) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}
    active = { id: e.pointerId, tool: e.button === 5 ? "eraser" : api.tool, pts: [pos(e)], touch: e.pointerType === "touch" };
    strokes.push(active);
    api.changed = true;
    api.version++;
    redraw();
    e.preventDefault();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!active || e.pointerId !== active.id) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of evs.length ? evs : [e]) active.pts.push(pos(ev));
    redraw();
    e.preventDefault();
  });
  const end = (e) => {
    if (active && e.pointerId === active.id) {
      if (e.pointerType === "pen") lastPen = performance.now();
      active = null;
      api.onChange?.();
    }
  };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
  let lastWrapH = 0;
  new ResizeObserver(() => {
    const h = wrap.clientHeight;
    if (h && h !== lastWrapH) {
      lastWrapH = h;
      api.fit();
    }
  }).observe(wrap);

  api.undo = () => {
    strokes.pop();
    api.changed = true;
    api.version++;
    redraw();
    api.onChange?.();
  };
  api.clear = (resetSize = false) => {
    strokes.length = 0;
    api.changed = false;
    api.version++;
    if (resetSize) {
      extra = 0;
      canvasExtra = 0;
      lastPen = -Infinity;
      wrap.style.height = "";
    }
    if (resetSize && canvas.width) api.fit();
    else redraw();
    api.onChange?.();
  };
  // Več prostora: na telefonu se poveča okvir (plošča se premika kot celota). Ob strani (računalnik,
  // tablica ležeče) je okvir že čez vso višino, zato zraste platno in okvir se pomakne na novi prostor.
  api.grow = () => {
    const before = wrap.clientHeight;
    extra += 160;
    wrap.style.height = (baseH || before) + extra + "px";
    if (wrap.clientHeight < before + 80) canvasExtra += 160;
    api.fit();
    requestAnimationFrame(() => {
      if (canvasExtra) wrap.scrollTo({ top: wrap.scrollHeight, behavior: "smooth" });
      else canvas.scrollIntoView({ block: "end", behavior: "smooth" });
    });
  };

  // Izvoz za branje: le del s pisavo, črno na belem, največ 800 px → manj žetonov.
  api.exportImage = () => {
    const pen = strokes.filter((s) => s.tool === "pen");
    if (!pen.length) return null;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const s of pen) for (const [x, y] of s.pts) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
    const m = 16;
    x0 -= m; y0 -= m; x1 += m; y1 += m;
    const w = x1 - x0, h = y1 - y0;
    const k = Math.min(1.5, 800 / Math.max(w, h));
    const W = Math.max(1, Math.round(w * k)), H = Math.max(1, Math.round(h * k));
    const layer = document.createElement("canvas");
    layer.width = W;
    layer.height = H;
    const lc = layer.getContext("2d");
    lc.setTransform(k, 0, 0, k, -x0 * k, -y0 * k);
    for (const s of strokes) drawStroke(lc, s, "#000");
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const oc = out.getContext("2d");
    oc.fillStyle = "#fff";
    oc.fillRect(0, 0, W, H);
    oc.drawImage(layer, 0, 0);
    return out.toDataURL("image/png");
  };
  api.hasInk = () => strokes.some((s) => s.tool === "pen");
  api.writing = () => !!active;
  return api;
}
