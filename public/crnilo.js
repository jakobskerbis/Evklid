// Risalna površina (prst, miška, pisalo). Pri pisalu so dotiki dlani prezrti.
// Uporabljata jo plošča »Piši« pri nalogah (public/pad.js) in okno »Piši« znanstvenega kalkulatorja (public/graph/pisi.js).
// api.onChange (neobvezno): klic po koncu poteze, razveljavitvi ali brisanju (branje po premoru pisanja).
// api.onTool (neobvezno): klic, ko se orodje zamenja z dvojnim dotikom prsta (gumb Radirka naj to pokaže).
//
// Pisalo (j, 27. 11.):
// - Ko naprava enkrat zazna pisalo (Apple Pencil), prsti ne rišejo več, tudi ko pisala ni na zaslonu
//   (»evklid.pisalo« na tej napravi: velja 3 dni od zadnje uporabe pisala, nato prsti spet rišejo, npr. na
//   skupnem iPadu ali brez pisala). Miška riše kot prej.
// - Počečkaj za brisanje: cikcak čez zapisano (vsaj 5 obratov) izbriše poteze, ki jih prečka; Razveljavi jih vrne.
// - Dvojni tap pisala (Apple Pencil 2/Pro) brskalnik v iPadu ne sporoči (Safari nima dogodka za to), zato je
//   nadomestilo dvojni dotik s prstom na površini: zamenja pisalo in radirko.

const PEN_KEY = "evklid.pisalo";
const PEN_DAYS = 3;

// Število obratov smeri vzdolž osi a (0 = x, 1 = y); manjši tresljaji od tol niso obrat.
export function reversals(pts, a, tol) {
  let dir = 0;
  let ext = pts[0][a];
  let n = 0;
  for (const p of pts) {
    const v = p[a];
    if (dir === 0) {
      if (Math.abs(v - ext) > tol) {
        dir = Math.sign(v - ext);
        ext = v;
      }
    } else if ((v - ext) * dir > 0) ext = v;
    else if (Math.abs(v - ext) > tol) {
      n++;
      dir = -dir;
      ext = v;
    }
  }
  return n;
}

const bbox = (pts) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) {
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
};

// Je poteza čečka (cikcak)? Vsaj 5 obratov vzdolž ene osi, vsak zamah čez vsaj 40 % okvirja, in dolga pot.
// Črke in znaki (m, w, M, 8, ≈, ~, 3, ε) imajo največ 4 take obrate; pisana »mm« jih ima več, a ne prečka
// zapisanega (scratchVictims), zato ne briše.
export function isScratch(pts) {
  if (pts.length < 10) return false;
  const b = bbox(pts);
  if (Math.max(b.w, b.h) < 24) return false;
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const rx = reversals(pts, 0, Math.max(6, b.w * 0.4));
  const ry = reversals(pts, 1, Math.max(6, b.h * 0.4));
  return Math.max(rx, ry) >= 5 && len >= 2.5 * (b.w + b.h);
}

// Število presečišč dveh lomljenk (daljša se redči na ~200 točk).
const thin = (pts, n = 200) => (pts.length <= n ? pts : pts.filter((_, i) => i % Math.ceil(pts.length / n) === 0));
function crossings(a, b) {
  a = thin(a);
  b = thin(b);
  const cross = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  let n = 0;
  for (let i = 1; i < a.length; i++)
    for (let j = 1; j < b.length; j++) {
      const d1 = cross(a[i - 1], a[i], b[j - 1]), d2 = cross(a[i - 1], a[i], b[j]);
      const d3 = cross(b[j - 1], b[j], a[i - 1]), d4 = cross(b[j - 1], b[j], a[i]);
      if (d1 * d2 < 0 && d3 * d4 < 0) n++;
    }
  return n;
}

// Poteze (indeksi v strokes), ki jih čečka izbriše: čečka jih prečka vsaj dvakrat. Drobne poteze (pika, vejica,
// ki jih ni mogoče prečkati) gredo zraven le, če ležijo v okvirju čečke in je čečka prečkala še kaj drugega.
export function scratchVictims(strokes, scratch) {
  const b = bbox(scratch.pts);
  const crossed = [];
  const small = [];
  strokes.forEach((s, i) => {
    if (s === scratch || s.tool !== "pen") return;
    const sb = bbox(s.pts);
    if (sb.x1 < b.x0 || sb.x0 > b.x1 || sb.y1 < b.y0 || sb.y0 > b.y1) return;
    if (Math.max(sb.w, sb.h) < 14) {
      if (sb.x0 >= b.x0 && sb.x1 <= b.x1 && sb.y0 >= b.y0 && sb.y1 <= b.y1) small.push(i);
    } else if (crossings(scratch.pts, s.pts) >= 2) crossed.push(i);
  });
  return crossed.length ? [...crossed, ...small].sort((x, y) => x - y) : [];
}

export function createInk(canvas) {
  const ctx = canvas.getContext("2d");
  const strokes = [];
  // Zgodovina za Razveljavi: { add: poteza } ali { removed: [[indeks, poteza], …] } (počečkano).
  const hist = [];
  let active = null;
  let lastPen = -Infinity; // čas zadnjega dotika s pisalom (zavračanje dlani)
  let penOnly = false; // naprava ima pisalo: prsti ne rišejo
  try {
    penOnly = Date.now() - Number(localStorage.getItem(PEN_KEY)) < PEN_DAYS * 864e5;
  } catch {}
  const touches = new Map(); // dotiki prsta, ko prsti ne rišejo: id → { t, x, y, multi }
  let lastTap = null; // { t, x, y } zadnjega kratkega dotika (za dvojni dotik)
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

  function drawStroke(c, s, ink, width = 3) {
    c.save();
    c.globalCompositeOperation = s.tool === "eraser" ? "destination-out" : "source-over";
    c.strokeStyle = ink;
    c.lineWidth = s.tool === "eraser" ? 22 : width;
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

  const touched = () => {
    api.changed = true;
    api.version++;
    redraw();
    api.onChange?.();
  };

  api.setTool = (tool) => {
    api.tool = tool;
    api.onTool?.(tool);
  };
  Object.defineProperty(api, "penOnly", {
    get: () => penOnly,
    set: (v) => {
      penOnly = !!v;
      try {
        if (penOnly) localStorage.setItem(PEN_KEY, String(Date.now()));
        else localStorage.removeItem(PEN_KEY);
      } catch {}
    },
  });

  // Prst, ko naprava ima pisalo: ne riše; dva kratka dotika na istem mestu zamenjata pisalo in radirko.
  function fingerDown(e) {
    for (const v of touches.values()) v.multi = true;
    touches.set(e.pointerId, { t: performance.now(), x: e.clientX, y: e.clientY, multi: touches.size > 0 });
  }
  function fingerUp(e) {
    const d = touches.get(e.pointerId);
    touches.delete(e.pointerId);
    if (!d || e.type === "pointercancel") return;
    const now = performance.now();
    // kratek dotik enega prsta brez premika; dlan (več dotikov hkrati, velika ploskev) ni dotik
    // med pisanjem in tik po njem (dlan ob pisalu) dotik ni ukaz
    const tap = !active && now - lastPen > 500 && !d.multi && now - d.t < 300 && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 14 && !(e.width > 44 || e.height > 44);
    if (!tap) {
      lastTap = null;
      return;
    }
    if (lastTap && now - lastTap.t < 400 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 48) {
      lastTap = null;
      api.setTool(api.tool === "eraser" ? "pen" : "eraser");
    } else lastTap = { t: now, x: e.clientX, y: e.clientY };
  }

  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "pen") {
      lastPen = performance.now();
      api.penOnly = true; // tudi osveži čas zadnje uporabe pisala
      // dlan se je dotaknila pred pisalom: poteza dlani ni zapis, pisalo ima prednost
      if (active?.touch) {
        const i = strokes.indexOf(active);
        if (i >= 0) strokes.splice(i, 1);
        const h = hist.findIndex((x) => x.add === active);
        if (h >= 0) hist.splice(h, 1);
        active = null;
        redraw();
      }
    }
    if (e.pointerType === "touch" && penOnly) return fingerDown(e);
    // Dlan na zaslonu: dotik s prstom tik ob pisalu prezremo (1,5 s), kasneje prst spet piše.
    if (e.pointerType === "touch" && performance.now() - lastPen < 1500) return;
    if (active || (e.pointerType === "touch" && !e.isPrimary)) return; // drugi prst med pisanjem ne prekine poteze
    if (e.button > 0 && e.button !== 5) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}
    active = { id: e.pointerId, tool: e.button === 5 ? "eraser" : api.tool, pts: [pos(e)], touch: e.pointerType === "touch" };
    strokes.push(active);
    hist.push({ add: active });
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
  // Počečkano: čečka in poteze pod njo izginejo (ena sprememba v zgodovini).
  function scratchOut(s) {
    if (s.tool !== "pen" || !strokes.includes(s) || !isScratch(s.pts)) return false;
    const victims = scratchVictims(strokes, s);
    if (!victims.length) return false;
    const removed = victims.map((i) => [i, strokes[i]]);
    for (let k = victims.length - 1; k >= 0; k--) strokes.splice(victims[k], 1);
    strokes.splice(strokes.indexOf(s), 1);
    const h = hist.findIndex((x) => x.add === s);
    if (h >= 0) hist.splice(h, 1);
    hist.push({ removed });
    return true;
  }
  const end = (e) => {
    if (touches.has(e.pointerId)) return fingerUp(e);
    if (active && e.pointerId === active.id) {
      if (e.pointerType === "pen") lastPen = performance.now();
      const s = active;
      active = null;
      if (scratchOut(s)) return touched();
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
    if (active) return; // med potezo ne (poteza bi izginila pod pisalom)
    const h = hist.pop();
    if (!h) return;
    if (h.add) {
      const i = strokes.indexOf(h.add);
      if (i >= 0) strokes.splice(i, 1);
    } else for (const [i, s] of h.removed) strokes.splice(i, 0, s); // naraščajoči indeksi: vsaka gre na svoje mesto
    touched();
  };
  api.clear = (resetSize = false) => {
    strokes.length = 0;
    hist.length = 0;
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

  // Izvoz za branje: le del s pisavo, črno na belem. Drobna pisava se poveča (krajša stranica vsaj ~220 px),
  // daljša stranica največ 1000 px; črta ostane 3–5 px debela ne glede na povečavo (bolje berljivo, malo žetonov).
  api.exportImage = () => {
    const pen = strokes.filter((s) => s.tool === "pen");
    if (!pen.length) return null;
    const b = bbox(pen.flatMap((s) => s.pts));
    const m = 16;
    const x0 = b.x0 - m, y0 = b.y0 - m;
    const w = b.w + 2 * m, h = b.h + 2 * m;
    const k = Math.min(1000 / Math.max(w, h), Math.max(1.5, 220 / Math.min(w, h)));
    const W = Math.max(1, Math.round(w * k)), H = Math.max(1, Math.round(h * k));
    const layer = document.createElement("canvas");
    layer.width = W;
    layer.height = H;
    const lc = layer.getContext("2d");
    lc.setTransform(k, 0, 0, k, -x0 * k, -y0 * k);
    const lw = Math.min(5, Math.max(3, 3 * k)) / k;
    for (const s of strokes) drawStroke(lc, s, "#000", lw);
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
