// Prenesena pola v Evklidu: učenec polo prenese z ric.si (Izpitna pola) in jo izbere tukaj. PDF ostane v napravi:
// izriše ga pdf.js 6 (/vendor/pdfjs/, naložen šele ob odprtju), strežnik ga ne dobi in ne shrani (pole so last RIC).
// Naloge najde besedilna plast (public/paper-tasks.js); »Pomoč pri tej nalogi« izreže le to nalogo (JPEG, največ
// 1600 px) in jo z besedilom pošlje inštruktorju. Strani brez zaznanih nalog: učenec povleče okvir (prst ali miška).
import { t } from "./i18n.js";
import { icon } from "./icons.js";
import { splitTasks, textInBox } from "./paper-tasks.js";

const LIB = "/vendor/pdfjs/";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const pct = (v, of) => `${((v / of) * 100).toFixed(3)}%`;
const MAX_W = 1600;
const MAX_H = 4000;

let lib = null;
async function pdfjs() {
  if (!lib) {
    lib = await import(`${LIB}legacy/build/pdf.min.mjs`);
    lib.GlobalWorkerOptions.workerSrc = `${LIB}legacy/build/pdf.worker.min.mjs`;
  }
  return lib;
}

// Rezerva (j, 10. 11.): pdf.js 6 zahteva novejši brskalnik (Safari 18+, Chrome 125+). Če se ne naloži ali prvi izris ne uspe
// (zaznano po dejanski napaki ali po časovni omejitvi, ne po UA), učenec dobi gumb »Odpri PDF« v pregledovalniku naprave.
const FALLBACK_MS = 20000; // uvoz modula (počasna povezava ne sme sprožiti rezerve)
const FILE_ERRORS = /^(InvalidPDFException|MissingPDFException|PasswordException|FormatError)$/; // težava datoteke, ne naprave
const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error("timeout"), { fallback: true })), ms))]);

let current = null;
export const paperViewerOpen = () => !!current;
// Zapre pregledovalnik (gumb, Esc, tipka Nazaj v app.js). Vrne true, če je bil odprt.
export function closePaperViewer() {
  if (!current) return false;
  current.close();
  return true;
}

// file: izbrani PDF; title: oznaka pole; onHelp({ label, page, text, image }) odpre inštruktorja; onClose: zaprl jo je
// učenec (gumb, Esc, Nazaj), ne »Pomoč pri tej nalogi«; page: stran (od 1), ki se pokaže ob odprtju.
export async function openPaperViewer(file, { title, onHelp, onClose, page: startPage = 0 }) {
  closePaperViewer();
  const back = document.activeElement;
  const el = document.createElement("div");
  el.className = "pv";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.tabIndex = -1; // klik na stran ohrani fokus v pregledovalniku (Esc)
  el.setAttribute("aria-label", title);
  el.innerHTML = `<header class="pv-bar">
      <button type="button" class="ghost pv-ic" data-pv-close aria-label="${esc(t("pp.viewerClose"))}" title="${esc(t("pp.viewerClose"))}">${icon("x")}</button>
      <div class="pv-title"><b>${esc(title)}</b><small class="pv-status" aria-live="polite">${esc(t("pp.viewerLoading"))}</small></div>
      <div class="pv-nav">
        <button type="button" class="ghost pv-ic pv-up" data-pv-step="-1" aria-label="${esc(t("pp.prevPage"))}" title="${esc(t("pp.prevPage"))}">${icon("chevron-down")}</button>
        <span class="pv-no" aria-live="polite"></span>
        <button type="button" class="ghost pv-ic" data-pv-step="1" aria-label="${esc(t("pp.nextPage"))}" title="${esc(t("pp.nextPage"))}">${icon("chevron-down")}</button>
      </div>
      <button type="button" class="secondary small pv-mark" data-pv-mark aria-pressed="false" hidden>${icon("scan-text")}<span>${esc(t("pp.markBox"))}</span></button>
    </header>
    <p class="pv-boxhint" hidden>${esc(t("pp.boxHint"))}</p>
    <div class="pv-scroll"><div class="pv-pages"></div></div>`;
  document.body.append(el);
  document.documentElement.classList.add("pv-open");
  const $ = (s) => el.querySelector(s);
  const status = (msg) => ($(".pv-status").textContent = msg);
  const scroller = $(".pv-scroll");
  let doc = null;
  let loading = null; // pdf.js 6: PDFDocumentProxy nima več destroy(); sprosti ga loadingTask
  let observer = null;
  let pages = []; // { width, height, items, el, canvas, rendered, task }
  let sel = null; // ročni okvir { page, x0, y0, x1, y1 } v enotah PDF
  const state = { closed: false, fell: false, drawn: false };
  let blobUrl = null;
  let onScroll = null;
  // Evklidova aplikacija (WebView): blob: PDF bi odprl prazen zaslon, zato tam samo sporočilo brez gumba.
  const inApp = / EvklidApp\//.test(navigator.userAgent || "");
  // Brez pdf.js: sporočilo in povezava na PDF (nov zavihek / sistemski pregledovalnik).
  const fallback = () => {
    if (state.closed || state.fell) return;
    state.fell = true;
    observer?.disconnect();
    for (const p of pages) p.task?.cancel?.();
    if (onScroll) scroller.removeEventListener("scroll", onScroll);
    status(""); // sporočilo je samo v odstavku spodaj
    $(".pv-nav").hidden = true;
    $("[data-pv-mark]").hidden = true;
    if (!inApp) blobUrl = URL.createObjectURL(file);
    const open = blobUrl ? `<a class="btn-primary pv-fb-open" href="${blobUrl}" target="_blank" rel="noopener">${icon("external-link")}<span>${esc(t("pp.fallbackOpen"))}</span></a>` : "";
    $(".pv-pages").innerHTML = `<div class="pv-fallback" dir="auto" role="status"><p>${esc(t("pp.fallbackMsg"))}</p>${open}</div>`;
  };

  const close = (forHelp) => {
    if (state.closed) return;
    state.closed = true;
    if (!forHelp) onClose?.();
    current = null;
    observer?.disconnect();
    for (const p of pages) p.task?.cancel?.();
    loading?.destroy();
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    el.remove();
    document.documentElement.classList.remove("pv-open");
    back?.focus?.();
  };
  current = { close };
  $("[data-pv-close]").focus();
  $("[data-pv-close]").onclick = () => close(); // že med nalaganjem in ob napaki

  el.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    e.preventDefault();
    e.stopPropagation();
    if (sel || el.classList.contains("pv-boxing")) return setMarking(false);
    close();
  });

  try {
    const data = new Uint8Array(await file.arrayBuffer());
    if (String.fromCharCode(...data.slice(0, 5)) !== "%PDF-") throw new Error(t("pp.notPdf"));
    const pdf = await withTimeout(pdfjs(), FALLBACK_MS);
    if (state.closed) return;
    // useWasm: false: CSP nima 'wasm-unsafe-eval' (JPX/JBIG2 gresta čez JS nadomestek v wasm/, brez opozorila v konzoli).
    loading = pdf.getDocument({ data, isEvalSupported: false, cMapUrl: `${LIB}cmaps/`, cMapPacked: true, standardFontDataUrl: `${LIB}standard_fonts/`, useWasm: false, wasmUrl: `${LIB}wasm/`, iccUrl: `${LIB}iccs/` });
    doc = await loading.promise;
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const vp = page.getViewport({ scale: 1 });
      const tc = await page.getTextContent();
      if (state.closed) return loading.destroy();
      pages.push({ page, width: vp.width, height: vp.height, items: tc.items });
    }
  } catch (err) {
    if (state.closed) return;
    if (err.message === t("pp.notPdf")) return status(err.message);
    if (!FILE_ERRORS.test(err.name || "")) return fallback(); // uvoz ali delovanje pdf.js ne uspe v tej napravi
    status(t("pp.loadFail", { msg: err.message }));
    return;
  }
  const tasks = splitTasks(pages);
  status(tasks.length ? t("pp.found", { n: tasks.length }) : t("pp.foundNone"));
  $("[data-pv-mark]").hidden = false;

  $(".pv-pages").innerHTML = pages
    .map((p, i) => {
      const boxes = [];
      tasks.forEach((task, k) =>
        task.regions.forEach((r, j) => {
          if (r.page !== i) return;
          const name = t("pp.taskN", { n: task.label });
          boxes.push(`<div class="pv-task" style="left:${pct(r.x0, p.width)};top:${pct(r.y0, p.height)};width:${pct(r.x1 - r.x0, p.width)};height:${pct(r.y1 - r.y0, p.height)}">
            <button type="button" class="primary small pv-help" data-pv-task="${k}" aria-label="${esc(`${t("pp.taskHelp")}: ${name}`)}">${icon("message-circle")}<span>${esc(t("pp.taskHelp"))}</span><small>${esc(name)}${j ? " ↓" : ""}</small></button></div>`);
        }),
      );
      const none = boxes.length ? "" : `<div class="pv-none" dir="auto"><p>${esc(t("pp.noTasks"))}</p><button type="button" class="secondary small" data-pv-mark>${icon("scan-text")}<span>${esc(t("pp.markBox"))}</span></button></div>`;
      return `<section class="pv-page" data-pv-page="${i}" style="aspect-ratio:${p.width} / ${p.height}" aria-label="${esc(t("pp.pageLabel", { n: i + 1 }))}"><canvas aria-hidden="true"></canvas>${boxes.join("")}${none}</section>`;
    })
    .join("");
  pages.forEach((p, i) => {
    p.el = el.querySelector(`[data-pv-page="${i}"]`);
    p.canvas = p.el.querySelector("canvas");
  });

  // Izris strani blizu zaslona (pomnilnik telefona: oddaljene strani sprostimo).
  let queue = Promise.resolve();
  const draw = (p) =>
    (queue = queue.then(async () => {
      if (state.closed || p.rendered || !p.near) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.min(3, Math.max(1, (p.el.clientWidth * dpr) / p.width));
      const vp = p.page.getViewport({ scale });
      const c = document.createElement("canvas");
      c.width = Math.round(vp.width);
      c.height = Math.round(vp.height);
      c.setAttribute("aria-hidden", "true");
      p.task = p.page.render({ canvasContext: c.getContext("2d"), viewport: vp });
      try {
        await p.task.promise;
      } catch (err) {
        if (!state.drawn && err?.name !== "RenderingCancelledException") fallback(); // prvi izris ne uspe: pdf.js ni uporaben
        return;
      }
      if (state.closed || !p.near) return;
      state.drawn = true;
      p.canvas.replaceWith(c);
      p.canvas = c;
      p.rendered = true;
    }));
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const p = pages[Number(e.target.dataset.pvPage)];
        p.near = e.isIntersecting;
        if (p.near) draw(p);
        else if (p.rendered) {
          p.canvas.width = p.canvas.height = 0;
          p.rendered = false;
        }
      }
    },
    { root: scroller, rootMargin: "150% 0px" },
  );
  pages.forEach((p) => observer.observe(p.el));
  // Naslovnica in navodila nimajo nalog: začnemo pri prvi najdeni nalogi.
  // Ponovno odprta pola (po pomoči pri nalogi) se odpre pri zadnji nalogi.
  const start = startPage ? startPage - 1 : tasks.length ? tasks[0].regions[0].page : -1;
  if (pages[start]) scroller.scrollTop = pages[start].el.offsetTop - 8;

  // Številka strani in premik na prejšnjo/naslednjo.
  const pageAt = () => {
    const mid = scroller.scrollTop + scroller.clientHeight / 3;
    let i = 0;
    pages.forEach((p, k) => p.el.offsetTop <= mid && (i = k));
    // Na širokem zaslonu sta dve strani v vrsti (competition.css → .pv-pages): šteje prva v vrsti.
    while (i > 0 && pages[i - 1].el.offsetTop === pages[i].el.offsetTop) i--;
    return i;
  };
  const showNo = () => ($(".pv-no").textContent = t("pp.pageOf", { n: pageAt() + 1, total: pages.length }));
  let raf = 0;
  onScroll = () => raf || (raf = requestAnimationFrame(() => ((raf = 0), state.fell || showNo())));
  scroller.addEventListener("scroll", onScroll, { passive: true });
  showNo();

  // Izrez območij (enote PDF, y od zgoraj) v en JPEG: vsako stran izrišemo posebej v ločljivosti izreza.
  async function crop(regions) {
    const parts = [];
    for (const r of regions) {
      const p = pages[r.page];
      const w = r.x1 - r.x0;
      const h = r.y1 - r.y0;
      const s = Math.min(3, MAX_W / w);
      const c = document.createElement("canvas");
      c.width = Math.round(w * s);
      c.height = Math.round(h * s);
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, c.width, c.height);
      await p.page.render({ canvasContext: ctx, viewport: p.page.getViewport({ scale: s }), transform: [1, 0, 0, 1, -r.x0 * s, -r.y0 * s] }).promise;
      parts.push(c);
    }
    const width = Math.max(...parts.map((c) => c.width));
    const total = parts.reduce((a, c) => a + c.height, 0);
    const k = Math.min(1, MAX_H / total);
    const out = document.createElement("canvas");
    out.width = Math.round(width * k);
    out.height = Math.round(total * k);
    const ctx = out.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, out.width, out.height);
    let y = 0;
    for (const c of parts) {
      ctx.drawImage(c, 0, y, c.width * k, c.height * k);
      y += c.height * k;
    }
    const url = out.toDataURL("image/jpeg", 0.85);
    return { media_type: "image/jpeg", data: url.split(",")[1], url };
  }

  async function help(btn, payload, regions) {
    if (btn.disabled) return;
    btn.disabled = true;
    status(t("pp.preparing"));
    try {
      const image = await crop(regions);
      close(true);
      onHelp({ ...payload, image });
    } catch (err) {
      btn.disabled = false;
      status(t("pp.loadFail", { msg: err.message }));
    }
  }

  // Ročni okvir: v načinu »Označi nalogo« poteg po strani (pointer events: prst, miška, pisalo).
  const removeSel = () => {
    el.querySelector(".pv-sel")?.remove();
    sel = null;
  };
  function setMarking(on) {
    removeSel();
    el.classList.toggle("pv-boxing", on);
    $(".pv-boxhint").hidden = !on;
    el.querySelectorAll("[data-pv-mark]").forEach((b) => b.setAttribute("aria-pressed", String(on)));
  }
  let drag = null;
  scroller.addEventListener("pointerdown", (e) => {
    if (!el.classList.contains("pv-boxing") || e.button > 0 || e.target.closest("button")) return;
    const pageEl = e.target.closest(".pv-page");
    if (!pageEl) return;
    e.preventDefault();
    removeSel();
    const rect = pageEl.getBoundingClientRect();
    const box = document.createElement("div");
    box.className = "pv-sel";
    pageEl.append(box);
    drag = { pageEl, rect, box, x: e.clientX, y: e.clientY, id: e.pointerId };
    pageEl.setPointerCapture?.(e.pointerId);
  });
  scroller.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { rect, box } = drag;
    const cl = (v, a, b) => Math.max(a, Math.min(b, v));
    const x0 = cl(Math.min(drag.x, e.clientX), rect.left, rect.right) - rect.left;
    const x1 = cl(Math.max(drag.x, e.clientX), rect.left, rect.right) - rect.left;
    const y0 = cl(Math.min(drag.y, e.clientY), rect.top, rect.bottom) - rect.top;
    const y1 = cl(Math.max(drag.y, e.clientY), rect.top, rect.bottom) - rect.top;
    Object.assign(box.style, { left: `${(x0 / rect.width) * 100}%`, top: `${(y0 / rect.height) * 100}%`, width: `${((x1 - x0) / rect.width) * 100}%`, height: `${((y1 - y0) / rect.height) * 100}%` });
    drag.f = [x0 / rect.width, y0 / rect.height, x1 / rect.width, y1 / rect.height];
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { pageEl, box, f } = drag;
    drag = null;
    if (!f || f[2] - f[0] < 0.04 || f[3] - f[1] < 0.02) return box.remove();
    const i = Number(pageEl.dataset.pvPage);
    const p = pages[i];
    sel = { page: i, x0: f[0] * p.width, y0: f[1] * p.height, x1: f[2] * p.width, y1: f[3] * p.height };
    box.innerHTML = `<div class="pv-sel-acts"><button type="button" class="primary small pv-help" data-pv-sel>${icon("message-circle")}<span>${esc(t("pp.taskHelp"))}</span></button><button type="button" class="secondary small pv-ic" data-pv-unsel aria-label="${esc(t("pp.cancelBox"))}" title="${esc(t("pp.cancelBox"))}">${icon("x")}</button></div>`;
    box.querySelector("[data-pv-sel]").focus();
  };
  scroller.addEventListener("pointerup", endDrag);
  scroller.addEventListener("pointercancel", endDrag);

  el.addEventListener("click", (e) => {
    const step = e.target.closest("[data-pv-step]");
    if (step) {
      // Premik za vrstico strani: strani v isti vrstici (dve druga ob drugi) preskočimo.
      const d = Number(step.dataset.pvStep);
      const top = pages[pageAt()].el.offsetTop;
      let i = pageAt() + d;
      while (i > 0 && i < pages.length - 1 && pages[i].el.offsetTop === top) i += d;
      i = Math.max(0, Math.min(pages.length - 1, i));
      return scroller.scrollTo({ top: pages[i].el.offsetTop - 8, behavior: "smooth" });
    }
    if (e.target.closest("[data-pv-mark]")) return setMarking(!el.classList.contains("pv-boxing"));
    if (e.target.closest("[data-pv-unsel]")) return removeSel();
    const sb = e.target.closest("[data-pv-sel]");
    if (sb && sel) return help(sb, { label: null, page: sel.page + 1, text: textInBox(pages[sel.page], sel) }, [sel]);
    const tb = e.target.closest("[data-pv-task]");
    if (tb) {
      const task = tasks[Number(tb.dataset.pvTask)];
      return help(tb, { label: task.label, page: task.regions[0].page + 1, text: task.text }, task.regions);
    }
  });
}
