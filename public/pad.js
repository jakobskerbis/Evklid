// Vnos odgovora pri nalogi: tipke so Evklidova tipkovnica (public/tipkovnica.js, 123 + enote, Enter = Preveri),
// plošča »Piši« je risalna površina. Na telefonu se plošča odpre spodaj (besedilo naloge ostane pripeto zgoraj),
// na širšem zaslonu ob strani, tako da je naloga ves čas vidna.
import { icon } from "./icons.js";
import { t as tr, currentLang } from "./i18n.js";
import { configureKeyboard, openKeyboard, hideKeyboard, keyboardOpenFor, keyboardPrefs, initKeyboard } from "./tipkovnica.js";

const LS_KEY = "evklid.pad";
const prefs = (() => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch {
    return {};
  }
})();
// Inštruktor lahko nastavitev plošče spremeni iz klepeta (public/chat-settings.js).
window.addEventListener("evklid:device-setting", (e) => {
  const { key, value } = e.detail || {};
  if (key === "writing_pad") prefs.auto = value === "auto";
  if (key === "writing_pad_tab") prefs.tab = value;
});
const savePrefs = () => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  } catch {}
};

const isTouch = () => matchMedia("(pointer: coarse)").matches;

let pad = null; // DOM plošče
let cur = null; // { task, input, form, readFn }
let ink = null; // risalna površina

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function build() {
  pad = el(`<aside id="pad" class="pad" hidden aria-label="${tr("pad.label")}">
    <div class="pad-head">
      <div class="pad-tabs" role="tablist">
        <button type="button" data-tab="keys" role="tab">${icon("keyboard")}${tr("pad.keys")}</button>
        <button type="button" data-tab="draw" role="tab">${icon("pencil")}${tr("task.write")}</button>
      </div>
      <button type="button" class="pad-close" aria-label="${tr("pad.close")}">${icon("x")}</button>
    </div>
    <div class="pad-answer"><span class="pad-value" aria-live="polite"></span><span class="pad-units"></span><button type="button" class="primary pad-check">${tr("task.check")}</button></div>
    <div class="read-result" aria-live="polite"></div>
    <div class="pad-body pad-draw">
      <div class="draw-tools">
        <button type="button" data-tool="pen" class="on" title="${tr("pad.pen")}" aria-label="${tr("pad.pen")}">${icon("pencil")}<span>${tr("pad.pen")}</span></button>
        <button type="button" data-tool="eraser" title="${tr("pad.eraser")}" aria-label="${tr("pad.eraser")}">${icon("eraser")}<span>${tr("pad.eraser")}</span></button>
        <button type="button" data-act="undo" title="${tr("pad.undo")}" aria-label="${tr("pad.undo")}">${icon("undo-2")}</button>
        <button type="button" data-act="clear" title="${tr("pad.clear")}" aria-label="${tr("pad.clear")}">${icon("trash-2")}</button>
        <button type="button" data-act="grow" title="${tr("pad.grow")}" aria-label="${tr("pad.grow")}">${icon("plus")}<span>${tr("pad.growShort")}</span></button>
      </div>
      <div class="canvas-wrap"><canvas class="ink" aria-label="${tr("pad.canvas")}"></canvas></div>
      <div class="draw-foot">
        <span class="muted">${tr("pad.drawNote", { check: tr("task.check") })}</span>
      </div>
    </div>
  </aside>`);
  document.body.appendChild(pad);

  pad.querySelector(".pad-close").addEventListener("click", () => {
    prefs.auto = false;
    savePrefs();
    closePad();
  });
  pad.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));
  pad.querySelector(".pad-units").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) press(" " + b.dataset.u);
  });
  pad.querySelector(".pad-check").addEventListener("click", submit);
  ink = createInk(pad.querySelector("canvas.ink"));
  pad.querySelectorAll("[data-tool]").forEach((b) =>
    b.addEventListener("click", () => {
      ink.tool = b.dataset.tool;
      pad.querySelectorAll("[data-tool]").forEach((x) => x.classList.toggle("on", x === b));
    }),
  );
  pad.querySelector("[data-act=undo]").addEventListener("click", () => ink.undo());
  pad.querySelector("[data-act=clear]").addEventListener("click", () => ink.clear());
  pad.querySelector("[data-act=grow]").addEventListener("click", () => ink.grow());

  // Prostor pod vsebino, da plošča na telefonu ne prekrije odgovora in povratne informacije.
  new ResizeObserver(() => {
    document.documentElement.style.setProperty("--pad-h", pad.hidden ? "0px" : pad.offsetHeight + "px");
  }).observe(pad);
}

function setTab(tab) {
  prefs.tab = tab;
  savePrefs();
  // Tipke: plošča se umakne, odpre se Evklidova tipkovnica za polje odgovora.
  if (tab === "keys") {
    hideDraw();
    if (cur) openKeyboard(cur.input);
    return;
  }
  hideKeyboard();
  pad.dataset.tab = tab;
  pad.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
  if (tab === "draw") ink.fit();
  // Plošča za pisanje je višja: naloga naj ostane vidna nad njo.
  if (!pad.hidden && padIsSheet()) showTask();
}

function showTask() {
  const card = cur?.form.closest(".task");
  requestAnimationFrame(() => card?.scrollIntoView({ block: "start" }));
}

function syncValue() {
  if (!cur) return;
  const v = cur.input.value;
  const span = pad.querySelector(".pad-value");
  span.textContent = v || cur.input.placeholder || "";
  span.classList.toggle("ph", !v);
}

function press(unit) {
  if (!cur) return;
  // Zamenjaj morebitno prejšnjo enoto.
  cur.input.value = cur.input.value.replace(/\s+[^\d\s,./−-][^\s]*$/, "").trimEnd() + unit;
  syncValue();
}

function submit() {
  if (!cur) return;
  const box = pad.querySelector(".read-result");
  const drawing = pad.dataset.tab === "draw";
  // V načinu Piši gumb Preveri najprej prebere zapis (učenec ga potrdi), nato odgovor preveri.
  if (drawing && ink.hasInk() && (ink.changed || !cur.input.value.trim())) return readInk();
  if (!cur.input.value.trim()) {
    box.innerHTML = `<div class="fb info">${drawing ? tr("pad.emptyDraw") : tr("chk.empty")}</div>`;
    return;
  }
  box.innerHTML = "";
  // Starejši iOS (pred 16) nima requestSubmit; takrat sprožimo dogodek submit sami.
  if (typeof cur.form.requestSubmit === "function") cur.form.requestSubmit();
  else cur.form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
}

let reading = false;
async function readInk() {
  if (!cur || reading) return;
  const box = pad.querySelector(".read-result");
  const image = ink.exportImage();
  if (!image) {
    box.innerHTML = `<div class="fb info">${tr("pad.writeFirst")}</div>`;
    return;
  }
  box.innerHTML = `<div class="fb info">${tr("pad.reading")}</div>`;
  const version = ink.version;
  reading = true;
  try {
    const r = await cur.readFn(image);
    if (!r.text) {
      box.innerHTML = `<div class="fb info">${escapeHtml(currentLang() === "sl" && r.message ? r.message : tr("pad.readFail"))}</div>`;
      return;
    }
    // Prebrano; če je učenec medtem še kaj dopisal, Preveri zapis prebere znova.
    ink.changed = ink.version !== version;
    box.innerHTML = `<div class="fb info"><span>${tr("pad.readAs", { text: '<b class="read-text"></b>' })}</span></div>
      <div class="actions"><button type="button" class="primary" data-ok>${tr("pad.okCheck")}</button><button type="button" data-fix>${tr("pad.fix")}</button></div>`;
    box.querySelector(".read-text").textContent = r.text;
    box.querySelector("[data-ok]").addEventListener("click", () => {
      cur.input.value = r.text;
      syncValue();
      box.innerHTML = "";
      submit();
    });
    box.querySelector("[data-fix]").addEventListener("click", () => {
      cur.input.value = r.text;
      syncValue();
      box.innerHTML = "";
      setTab("keys");
    });
  } catch (err) {
    box.innerHTML = `<div class="fb bad">${escapeHtml(err.message)}</div>`;
  } finally {
    reading = false;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// Začetna plast tipkovnice pri nalogi: številke, pri kemiji brez številskega odgovora Kem, pri besedilu ABC.
function startLayer(task, subject) {
  const numeric = ["number", "fraction", "coefficients"].includes(task.answerType);
  if (subject === "KEM" && !numeric) return "kem";
  return numeric || task.unit ? "num" : "abc";
}

/**
 * Poveži ploščo in tipkovnico z nalogo. Na napravah na dotik se tipkovnica (ali plošča Piši, če jo je
 * učenec izbral nazadnje) odpre sama, razen če jo je učenec zaprl.
 * @param {{task, input: HTMLInputElement, form: HTMLFormElement, readFn: (dataUrl) => Promise<{text, message}>, opener: HTMLElement, subject?: string, stay?: boolean}} opts
 */
export function attachPad(opts) {
  if (!pad) build();
  initKeyboard();
  cur = opts;
  ink.clear(true);
  pad.querySelector(".read-result").innerHTML = "";
  const units = opts.task.unit ? [opts.task.unit] : [];
  pad.querySelector(".pad-units").innerHTML = units.map((u) => `<button type="button" data-u="${escapeHtml(u)}">${escapeHtml(u)}</button>`).join("");
  const kem = opts.subject === "KEM";
  configureKeyboard(opts.input, {
    math: true,
    layers: kem ? ["num", "kem", "abc", "sym"] : ["num", "abc", "fx", "sym"],
    start: startLayer(opts.task, opts.subject),
    enter: "check",
    ctx: units.map((u) => ({ label: u, ins: u, unit: true })),
  });
  opts.input.addEventListener("input", syncValue);
  opts.opener?.addEventListener("click", () => {
    prefs.auto = true;
    savePrefs();
    openPad("draw");
  });
  syncValue();
  // Tipkovnico odpre sama samo na dotik (na računalniku je prava tipkovnica); Piši tudi na računalniku.
  // stay: naloga se je odprla skupaj s temo (»Nova snov«); stran ostane na vrhu, tipkovnica ob dotiku polja.
  const auto = !opts.stay && (prefs.auto ?? isTouch());
  if (auto && prefs.tab === "draw") openPad("draw");
  else {
    hideDraw();
    if (auto && isTouch() && keyboardPrefs().mode !== "never") openKeyboard(opts.input);
  }
}

export function openPad(tab) {
  if (!pad || !cur) return;
  if ((tab || prefs.tab || "keys") === "keys") return setTab("keys");
  pad.hidden = false;
  document.body.classList.add("pad-open");
  // Vrh plošče ob strani = spodnji rob vrstice z naslovom (izmerjeno, ko so zavihki že skriti).
  const top = document.querySelector(".topbar")?.getBoundingClientRect().bottom;
  if (top) document.documentElement.style.setProperty("--pad-top", Math.round(top) + "px");
  setTab("draw");
  document.documentElement.style.setProperty("--pad-h", pad.offsetHeight + "px");
  // Naloga naj bo na vrhu vidnega dela.
  showTask();
}

// Ali je plošča Piši odprta kot list čez spodnji del zaslona (telefon pokončno) in ne ob strani.
export function padIsSheet() {
  if (!pad || pad.hidden) return false;
  const r = pad.getBoundingClientRect();
  return r.left < 1 && r.width > innerWidth - 2;
}

function hideDraw() {
  if (!pad) return;
  pad.hidden = true;
  document.body.classList.remove("pad-open");
  document.documentElement.style.setProperty("--pad-h", "0px");
}

// Zapre ploščo in tipkovnico naloge (nova stran, pravilen odgovor, zaprta plošča).
export function closePad() {
  hideDraw();
  if (cur && keyboardOpenFor(cur.input)) hideKeyboard();
}

// Po oddanem odgovoru: pri pravilnem odgovoru plošča izgine, da je vidna razlaga.
export function padAfterAnswer(correctOrDone) {
  if (correctOrDone) closePad();
}

// ---------------------------------------------------------------------------
// Risalna površina (prst, miška, pisalo). Pri pisalu so dotiki dlani prezrti.

function createInk(canvas) {
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
    if (e.pointerType === "pen") lastPen = performance.now();
    // Dlan na zaslonu: dotik s prstom tik ob pisalu prezremo (1,5 s), kasneje prst spet piše.
    if (e.pointerType === "touch" && performance.now() - lastPen < 1500) return;
    if (active || (e.pointerType === "touch" && !e.isPrimary)) return; // drugi prst med pisanjem ne prekine poteze
    if (e.button > 0) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}
    active = { id: e.pointerId, tool: e.button === 5 ? "eraser" : api.tool, pts: [pos(e)] };
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
  return api;
}
