// Zaslon »Skeniraj«: fotografija naloge → prepis (uredljiv) → rešitev po korakih.
// - kamera z okvirjem (telefon) ali slika iz galerije / odložišča z izrezom; vpis s tipkami deluje vedno
// - rešitev: lasten reševalnik (solvecore.js, brez AI, deluje brez povezave); težje naloge reši AI na strežniku,
//   ki rešitev preveri (verify.js). Vsak korak ima »Zakaj?« in »Vprašaj Evklida«, več metod, graf, številsko premico.
import { icon, hydrateIcons } from "../icons.js";
import { t } from "../i18n.js";
import { jeOs } from "../stopnja.js";
import { solve, analyze, prep, tex as exprTex, parseTask } from "./solvecore.js";
import { configureKeyboard, toggleKeyboard, keyboardOpenFor, keyboardLayer } from "../tipkovnica.js";
import { measureSource, problemOf, tiltAngle } from "./kakovost.js";

let D = null; // { api, getStudent, toast, escapeHtml, askTutor, openGraph }
const fresh = () => ({
  mode: "capture", // capture | crop | reading | confirm | solution
  image: null, // { url, w, h } za izrez
  problems: [],
  text: "",
  goal: null,
  goals: [],
  result: null,
  method: 0,
  shown: 1, // koliko korakov je razkritih
  ai: null, // { loading, error }
  note: null, // obvestilo nad poljem (npr. brez povezave)
  quality: null, // težava fotografije (blur | dark | glare), ki jo zaznamo na napravi pred branjem
});
const S = fresh();
let owner = null; // profil, čigar naloga je v S (drug profil začne na praznem zaslonu)
let aiSeq = 0; // odgovor AI za prejšnjo nalogo ne prepiše nove
let stream = null;
let frame = { x: 0.06, y: 0.34, w: 0.88, h: 0.26 };
let graphView = null;
// sprotna preverba slike v kameri: ostrina, svetloba, odsev, nagib telefona (kakovost.js)
let qTimer = null;
let qLast = null; // težava zadnjega vzorca
let qShown = null; // težava, ki je na zaslonu
let tilt = null; // kot telefona glede na vodoravno (°), null brez senzorja

export function initScan(deps) {
  D = deps;
  const view = document.getElementById("view-scan");
  document.addEventListener("paste", (e) => {
    if (view && !view.hidden && (S.mode === "capture" || S.mode === "crop")) onPaste(e);
  });
}

const $v = () => document.querySelector("#view-scan .scan-body");
const esc = (s) => (D?.escapeHtml ? D.escapeHtml(String(s ?? "")) : String(s ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`));
const sid = () => D.getStudent()?.id ?? 0;
const HIST = () => `evklid.scan.${sid()}`;
const coarse = () => window.matchMedia?.("(pointer: coarse)").matches;

// leva in desna stran pri preizkusu (\\sideL, \\sideR iz solvecore.js) v jeziku vmesnika
const sideMacros = () => ({ "\\sideL": `\\text{${t("scan.sideL")}}`, "\\sideR": `\\text{${t("scan.sideR")}}` });
const plainSides = (tx) => String(tx ?? "").replace(/\\sideL/g, t("scan.sideL")).replace(/\\sideR/g, t("scan.sideR"));
function math(tx, display = false) {
  try {
    return window.katex.renderToString(String(tx ?? ""), { throwOnError: false, strict: "ignore", displayMode: display, macros: sideMacros() });
  } catch {
    return esc(tx);
  }
}
// besedilo z $…$ → HTML s formulami
function rich(str) {
  return String(str ?? "")
    .split(/(\$[^$]+\$)/g)
    .map((p) => (p.startsWith("$") && p.endsWith("$") && p.length > 2 ? math(p.slice(1, -1)) : esc(p)))
    .join("");
}
// ključ i18n s TeX spremenljivkami
function tr(item) {
  if (!item) return "";
  if (typeof item === "string") return rich(item);
  const vars = Object.fromEntries(Object.entries(item.v || {}).map(([k, v]) => [k, `$${v}$`]));
  return rich(t(item.k, vars));
}

// ---------------------------------------------------------------------------

export function showScan({ text = null, goal = null } = {}) {
  if (owner !== sid()) {
    owner = sid();
    Object.assign(S, fresh());
    aiSeq++;
    if (stream) stopCamera();
  }
  if (text) {
    S.text = text;
    S.problems = [];
    S.goal = goal; // npr. »factor« iz kalkulatorja (razstavi)
    return solveNow();
  }
  if (S.mode === "reading") S.mode = "capture";
  render();
}

// Tipka Nazaj (telefon): rešitev, prepis ali izrez → nazaj na zajem; na zajemu zapusti zaslon.
export function scanBack() {
  if (S.mode === "capture") return false;
  S.mode = "capture";
  S.note = null;
  S.quality = null;
  frame = { x: 0.06, y: 0.34, w: 0.88, h: 0.26 };
  aiSeq++;
  render();
  return true;
}

export function leaveScan() {
  stopCamera();
  if (graphView) {
    graphView.destroy?.();
    graphView = null;
  }
}

function render() {
  const box = $v();
  if (!box) return;
  stopCamera(); // tudi pri zajemu: renderCapture zamenja <video>, kamero po potrebi zažene znova
  if (graphView && S.mode !== "solution") {
    graphView.destroy?.();
    graphView = null;
  }
  if (S.mode === "capture") renderCapture(box);
  else if (S.mode === "crop" || S.mode === "reading") renderCrop(box);
  else if (S.mode === "confirm") renderConfirm(box);
  else renderSolution(box);
  hydrateIcons(box);
}

// ---------- 1. zajem ----------

function renderCapture(box) {
  const hist = history();
  box.innerHTML = `
    <div class="scan-cam card">
      <div class="scan-stage" data-stage>
        <video playsinline muted aria-hidden="true"></video>
        <div class="scan-cam-off" hidden>
          <span class="scan-cam-ic">${icon("scan-line")}</span>
          <p>${esc(coarse() ? t("scan.camOff") : t("scan.desk"))}</p>
          <button type="button" class="secondary" data-act="cam">${icon("camera")}${esc(t("scan.camOn"))}</button>
        </div>
        ${frameHtml()}
        <p class="scan-q" role="status" aria-live="polite" hidden></p>
      </div>
      <p class="scan-hint muted">${esc(t("scan.hint"))}</p>
      <div class="scan-bar">
        <button type="button" class="scan-side" data-act="gallery">${icon("image")}<span>${esc(t("scan.gallery"))}</span></button>
        <button type="button" class="scan-shutter" data-act="shoot" aria-label="${esc(t("scan.shoot"))}" title="${esc(t("scan.shoot"))}"><span></span></button>
        <button type="button" class="scan-side" data-act="type">${icon("keyboard")}<span>${esc(t("scan.type"))}</span></button>
      </div>
      <button type="button" class="scan-torch ghost icon-only" data-act="torch" hidden aria-label="${esc(t("scan.torch"))}" title="${esc(t("scan.torch"))}" aria-pressed="false">${icon("zap")}</button>
      <input type="file" accept="image/*" data-file hidden>
      <input type="file" accept="image/*" capture="environment" data-shot hidden>
    </div>
    ${
      hist.length
        ? `<section class="scan-hist"><div class="scan-hist-head"><h2>${esc(t("scan.history"))}</h2><button type="button" class="text-btn" data-act="clear">${esc(t("scan.clearHistory"))}</button></div>
      <div class="card list-card">${hist
        .map((h, i) => `<button type="button" class="list-row" data-hist="${i}"><span class="lr-text"><b class="scan-hist-tex">${math(h.tex || h.text)}</b>${h.answer ? `<small>${math(h.answer)}</small>` : ""}</span>${icon("chevron-right")}</button>`)
        .join("")}</div></section>`
        : ""
    }`;
  const stage = box.querySelector("[data-stage]");
  bindFrame(stage);
  stage.addEventListener("pointerup", askTiltPermission, { once: true }); // pointerdown z dotikom ni »user gesture« (iOS)
  box.querySelector('[data-act="gallery"]').addEventListener("click", () => box.querySelector("[data-file]").click());
  box.querySelector("[data-file]").addEventListener("change", (e) => e.target.files[0] && loadFile(e.target.files[0]));
  box.querySelector("[data-shot]").addEventListener("change", (e) => e.target.files[0] && loadFile(e.target.files[0]));
  box.querySelector('[data-act="type"]').addEventListener("click", () => {
    S.text = "";
    S.problems = [];
    S.note = null;
    S.mode = "confirm";
    render();
  });
  box.querySelector('[data-act="shoot"]').addEventListener("click", shoot);
  box.querySelector('[data-act="cam"]').addEventListener("click", () => {
    askTiltPermission();
    startCamera(true);
  });
  box.querySelector('[data-act="torch"]').addEventListener("click", toggleTorch);
  box.querySelector('[data-act="clear"]')?.addEventListener("click", () => {
    try {
      localStorage.removeItem(HIST());
    } catch {}
    render();
  });
  box.querySelectorAll("[data-hist]").forEach((b) =>
    b.addEventListener("click", () => {
      const h = hist[Number(b.dataset.hist)];
      S.text = h.text;
      S.goal = h.goal || null;
      S.problems = [];
      solveNow();
    }),
  );
  // Na telefonu kamera začne sama (kot pri Photomathu), na računalniku šele na klik.
  if (coarse()) startCamera(false);
  else showCamOff(true);
}

function showCamOff(on) {
  const off = $v()?.querySelector(".scan-cam-off");
  if (off) off.hidden = !on;
  const hint = $v()?.querySelector(".scan-cam > .scan-hint");
  if (hint) hint.hidden = on;
  const video = $v()?.querySelector("video");
  if (video) video.hidden = on;
}

const scanHidden = () => document.getElementById("view-scan")?.hidden !== false;
async function startCamera(userAsked) {
  const video = $v()?.querySelector("video");
  if (!video || scanHidden()) return;
  if (!navigator.mediaDevices?.getUserMedia) return showCamOff(true);
  try {
    stopCamera();
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
    if (S.mode !== "capture" || !video.isConnected || scanHidden()) return stopCamera();
    video.srcObject = stream;
    await video.play().catch(() => {});
    showCamOff(false);
    const track = stream.getVideoTracks()[0];
    const caps = track?.getCapabilities?.() || {};
    const torch = $v()?.querySelector('[data-act="torch"]');
    if (torch) torch.hidden = !caps.torch;
    startQuality();
  } catch {
    showCamOff(true);
    if (userAsked) $v()?.querySelector("[data-shot]")?.click();
  }
}
function stopCamera() {
  if (stream) stream.getTracks().forEach((tr) => tr.stop());
  stream = null;
  stopQuality();
}

// ---------- preverba slike, preden jo pošljemo v branje ----------

// Sprotno: vsakih 700 ms izmeri okvir v videu; namig se pokaže, ko sta dva zaporedna vzorca enaka
// (en zamegljen vzorec med premikanjem telefona še ni težava), in izgine ob prvem dobrem.
function startQuality() {
  stopQuality();
  window.addEventListener("deviceorientation", onTilt);
  qTimer = setInterval(sampleQuality, 700);
}
function stopQuality() {
  if (qTimer) clearInterval(qTimer);
  qTimer = null;
  qLast = qShown = null;
  tilt = null;
  window.removeEventListener("deviceorientation", onTilt);
}
function onTilt(e) {
  tilt = tiltAngle(e.beta, e.gamma);
}
// iOS dovoli senzor nagiba šele po dotiku in vprašanju; drugje je na voljo brez vprašanja.
function askTiltPermission() {
  const ask = window.DeviceOrientationEvent?.requestPermission;
  try {
    if (typeof ask === "function") ask.call(window.DeviceOrientationEvent).catch(() => {});
  } catch {}
}
function sampleQuality() {
  const video = $v()?.querySelector("video");
  const stage = $v()?.querySelector("[data-stage]");
  if (!stream || !video?.videoWidth || !stage || document.hidden) return;
  const r = frameRect(video.videoWidth, video.videoHeight, stage, "cover");
  const p = problemOf(measureSource(video, r.sx, r.sy, r.sw, r.sh, 1600, 640), tilt);
  if (p === qLast || !p) showQuality(p);
  qLast = p;
}
function showQuality(p) {
  if (p === qShown) return;
  qShown = p;
  const el = $v()?.querySelector(".scan-q");
  if (!el) return;
  el.hidden = !p;
  el.textContent = p ? t(`scan.q.${p}`) : "";
}
async function toggleTorch(e) {
  const track = stream?.getVideoTracks()[0];
  if (!track) return;
  const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
  try {
    await track.applyConstraints({ advanced: [{ torch: on }] });
    e.currentTarget.setAttribute("aria-pressed", String(on));
  } catch {}
}

function shoot() {
  const video = $v()?.querySelector("video");
  if (!stream || !video?.videoWidth) {
    // brez kamere v brskalniku: sistemska kamera telefona
    return $v()?.querySelector("[data-shot]")?.click();
  }
  const stage = $v().querySelector("[data-stage]");
  const r = frameRect(video.videoWidth, video.videoHeight, stage, "cover");
  const bad = problemOf(measureSource(video, r.sx, r.sy, r.sw, r.sh, 1600));
  const url = cropTo(video, video.videoWidth, video.videoHeight, stage, "cover");
  stopCamera();
  S.image = { url: snapshot(video), w: video.videoWidth, h: video.videoHeight };
  // zamegljena ali pretemna slika: ne pošljemo je takoj (branje stane in bi verjetno spodletelo);
  // učenec jo vidi z opozorilom in jo posname znova ali vseeno pritisne »Preberi«
  S.quality = bad === "blur" || bad === "dark" ? bad : null;
  if (S.quality) {
    S.mode = "crop";
    return render();
  }
  readImage(url);
}

function snapshot(video) {
  const c = document.createElement("canvas");
  const k = Math.min(1, 1280 / Math.max(video.videoWidth, video.videoHeight));
  c.width = Math.round(video.videoWidth * k);
  c.height = Math.round(video.videoHeight * k);
  c.getContext("2d").drawImage(video, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.8);
}

// izrez okvirja iz videa ali slike (fit: cover pri videu, contain pri sliki)
function cropTo(src, iw, ih, stage, fit) {
  const { sx, sy, sw, sh } = frameRect(iw, ih, stage, fit);
  const k = Math.min(1, 1600 / Math.max(sw, sh));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(sw * k));
  c.height = Math.max(1, Math.round(sh * k));
  c.getContext("2d").drawImage(src, sx, sy, sw, sh, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.88);
}

// okvir na zaslonu → pravokotnik v pikah vira
function frameRect(iw, ih, stage, fit) {
  const r = stage.getBoundingClientRect();
  const scale = fit === "cover" ? Math.max(r.width / iw, r.height / ih) : Math.min(r.width / iw, r.height / ih);
  const ox = (r.width - iw * scale) / 2;
  const oy = (r.height - ih * scale) / 2;
  let sx = (frame.x * r.width - ox) / scale;
  let sy = (frame.y * r.height - oy) / scale;
  let sw = (frame.w * r.width) / scale;
  let sh = (frame.h * r.height) / scale;
  // malo roba okoli okvirja (nalogo pogosto odrežemo preozko)
  const pad = 0.04 * Math.max(sw, sh);
  sx = Math.max(0, sx - pad);
  sy = Math.max(0, sy - pad);
  sw = Math.min(iw - sx, sw + 2 * pad);
  sh = Math.min(ih - sy, sh + 2 * pad);
  return { sx, sy, sw, sh };
}

function onPaste(e) {
  const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
  if (!item) return;
  e.preventDefault();
  loadFile(item.getAsFile());
}

function loadFile(file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    S.image = { url, w: img.naturalWidth, h: img.naturalHeight };
    // slika iz galerije: privzeto označimo skoraj vse, učenec okvir zoži
    frame = { x: 0.04, y: 0.04, w: 0.92, h: 0.92 };
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const p = problemOf(measureSource(img, w * 0.04, h * 0.04, w * 0.92, h * 0.92, 1600));
    S.quality = p === "blur" || p === "dark" ? p : null;
    S.mode = "crop";
    render();
  };
  img.onerror = () => D.toast(t("scan.readFail"));
  img.src = url;
}

// ---------- 2. izrez ----------

function renderCrop(box) {
  const reading = S.mode === "reading";
  box.innerHTML = `
    <div class="scan-cam card">
      <div class="scan-stage contain${reading ? " busy" : ""}" data-stage>
        <img src="${esc(S.image.url)}" alt="${esc(t("scan.photoAlt"))}">
        ${frameHtml()}
        ${reading ? `<div class="scan-reading"><span class="spinner"></span>${esc(t("scan.reading"))}</div>` : ""}
      </div>
      ${S.quality && !reading ? `<p class="scan-warn" role="status">${icon("info")}<span>${esc(t(`scan.q.${S.quality}`))} ${esc(t("scan.q.anyway"))}</span></p>` : `<p class="scan-hint muted">${esc(t("scan.cropHint"))}</p>`}
      <div class="scan-actions">
        <button type="button" class="secondary" data-act="back">${icon("rotate-ccw")}${esc(t("scan.retake"))}</button>
        <button type="button" class="primary" data-act="read" ${reading ? "disabled" : ""}>${icon("scan-text")}${esc(t("scan.read"))}</button>
      </div>
    </div>`;
  const stage = box.querySelector("[data-stage]");
  if (!reading) bindFrame(stage);
  // opozorilo in gumba sta na telefonu lahko pod spodnjo vrstico: pokaži ju
  if (S.quality && !reading) requestAnimationFrame(() => box.querySelector(".scan-actions")?.scrollIntoView?.({ block: "center", behavior: "smooth" }));
  box.querySelector('[data-act="back"]').addEventListener("click", () => {
    S.mode = "capture";
    S.quality = null;
    frame = { x: 0.06, y: 0.34, w: 0.88, h: 0.26 };
    render();
  });
  box.querySelector('[data-act="read"]').addEventListener("click", () => {
    S.quality = null;
    const img = stage.querySelector("img");
    readImage(cropTo(img, img.naturalWidth, img.naturalHeight, stage, "contain"));
  });
}

function frameHtml() {
  return `<div class="scan-frame" role="group" aria-label="${esc(t("scan.frame"))}" style="left:${frame.x * 100}%;top:${frame.y * 100}%;width:${frame.w * 100}%;height:${frame.h * 100}%">
    ${["nw", "ne", "sw", "se"].map((c) => `<span class="scan-h ${c}" data-h="${c}"></span>`).join("")}
  </div>`;
}

// vogali okvirja spremenijo velikost, sredina ga premakne (miška, prst, pisalo)
function bindFrame(stage) {
  const el = stage.querySelector(".scan-frame");
  if (!el) return;
  let drag = null;
  const apply = () => {
    el.style.left = `${frame.x * 100}%`;
    el.style.top = `${frame.y * 100}%`;
    el.style.width = `${frame.w * 100}%`;
    el.style.height = `${frame.h * 100}%`;
  };
  el.addEventListener("pointerdown", (e) => {
    const r = stage.getBoundingClientRect();
    drag = { h: e.target.dataset.h || "move", x0: e.clientX, y0: e.clientY, f: { ...frame }, r };
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  el.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = (e.clientX - drag.x0) / drag.r.width;
    const dy = (e.clientY - drag.y0) / drag.r.height;
    const f = { ...drag.f };
    const min = 0.1;
    if (drag.h === "move") {
      f.x = Math.min(1 - f.w, Math.max(0, f.x + dx));
      f.y = Math.min(1 - f.h, Math.max(0, f.y + dy));
    } else {
      if (drag.h.includes("w")) {
        const nx = Math.min(f.x + f.w - min, Math.max(0, f.x + dx));
        f.w += f.x - nx;
        f.x = nx;
      }
      if (drag.h.includes("e")) f.w = Math.min(1 - f.x, Math.max(min, f.w + dx));
      if (drag.h.includes("n")) {
        const ny = Math.min(f.y + f.h - min, Math.max(0, f.y + dy));
        f.h += f.y - ny;
        f.y = ny;
      }
      if (drag.h.includes("s")) f.h = Math.min(1 - f.y, Math.max(min, f.h + dy));
    }
    frame = f;
    apply();
  });
  const end = () => (drag = null);
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);
}

async function readImage(dataUrl) {
  if (!navigator.onLine) {
    S.note = t("scan.offline");
    S.mode = "confirm";
    return render();
  }
  S.mode = "reading";
  render();
  try {
    const out = await D.api(`/api/students/${sid()}/scan/read`, { method: "POST", body: { image: dataUrl } });
    if (S.mode !== "reading") return;
    if (out.mock) {
      S.note = t("scan.mock");
      S.problems = [];
      S.text = "";
      S.mode = "confirm";
      return render();
    }
    S.problems = out.problems || [];
    if (!S.problems.length) {
      D.toast(t("scan.readFail"));
      S.mode = "crop";
      return render();
    }
    S.note = null;
    S.text = S.problems[0].text;
    S.goal = S.problems[0].goal || null;
    S.mode = "confirm";
    render();
  } catch (err) {
    if (S.mode !== "reading") return;
    D.toast(err?.message || t("scan.readFail"));
    S.mode = S.image ? "crop" : "capture";
    render();
  }
}

// ---------- 3. prepis (uredljiv) ----------

function renderConfirm(box) {
  const multi = S.problems.length > 1;
  box.innerHTML = `
    ${S.note ? `<p class="scan-note card">${icon("info")}<span>${esc(S.note)}</span></p>` : ""}
    ${multi ? `<p class="scan-label">${esc(t("scan.pick"))}</p><div class="scan-picks">${S.problems.map((p, i) => `<button type="button" class="scan-pick${p.text === S.text ? " on" : ""}" data-pick="${i}" aria-pressed="${p.text === S.text}">${math(p.tex || p.text)}</button>`).join("")}</div>` : ""}
    <div class="card scan-confirm">
      ${S.problems.length ? `<p class="scan-label">${esc(t("scan.readAs"))}</p>` : ""}
      <div class="scan-preview" aria-live="polite"></div>
      <label class="scan-label" for="scan-input">${esc(S.problems.length ? t("scan.inputLabel") : t("scan.typeLabel"))}</label>
      <div class="scan-input-row">
        <input id="scan-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" placeholder="${esc(t("scan.placeholder"))}" value="${esc(S.text)}">
        <button type="button" class="ghost icon-only" data-act="sym" aria-label="${esc(t("scan.symbols"))}" title="${esc(t("scan.symbols"))}" aria-expanded="false">${icon("sigma")}</button>
      </div>
      <p class="scan-err" hidden></p>
      <div class="scan-actions">
        <button type="button" class="secondary" data-act="retake">${icon("camera")}${esc(t("scan.retake"))}</button>
        <button type="button" class="primary" data-act="solve">${icon("check")}${esc(t("scan.solve"))}</button>
      </div>
    </div>`;
  const input = box.querySelector("#scan-input");
  const prev = box.querySelector(".scan-preview");
  const err = box.querySelector(".scan-err");
  const update = () => {
    S.text = input.value;
    const info = analyze(input.value);
    err.hidden = true;
    if (!input.value.trim()) return (prev.innerHTML = "");
    if (info.type === "error") {
      prev.innerHTML = "";
      return;
    }
    prev.innerHTML = problemTexOf(input.value);
  };
  input.addEventListener("input", update);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      go();
    }
  });
  update();
  // Σ odpre Evklidovo tipkovnico na plasti simbolov (public/tipkovnica.js); Enter = Reši.
  configureKeyboard(input, { math: true, layers: ["num", "fx", "sym", "abc"], start: "num", enter: "go", enterText: t("scan.solve"), parsed: true });
  const symBtn = box.querySelector('[data-act="sym"]');
  symBtn.addEventListener("click", () => toggleKeyboard(input, { layer: "sym" }));
  const sync = () => {
    if (!symBtn.isConnected) return window.removeEventListener("evklid:tipkovnica", sync);
    symBtn.setAttribute("aria-expanded", String(keyboardOpenFor(input) && keyboardLayer() === "sym"));
  };
  window.addEventListener("evklid:tipkovnica", sync);
  box.querySelectorAll("[data-pick]").forEach((b) =>
    b.addEventListener("click", () => {
      const p = S.problems[Number(b.dataset.pick)];
      S.text = p.text;
      S.goal = p.goal || null;
      render();
    }),
  );
  box.querySelector('[data-act="retake"]').addEventListener("click", () => {
    S.mode = "capture";
    S.note = null;
    frame = { x: 0.06, y: 0.34, w: 0.88, h: 0.26 };
    render();
  });
  const go = () => {
    const info = analyze(input.value);
    if (info.type === "error" || info.type === "empty") {
      err.textContent = t("scan.parseErr");
      err.hidden = false;
      input.focus();
      return;
    }
    S.text = input.value;
    solveNow();
  };
  box.querySelector('[data-act="solve"]').addEventListener("click", go);
  if (!S.problems.length && !coarse()) input.focus();
}

// ---------- 4. rešitev ----------

function solveNow() {
  const complex = !jeOs(D.getStudent()?.settings) || /SŠ|faks/i.test(D.getStudent()?.settings?.curriculum_level || "");
  const r = solve(S.text, { goal: S.goal, complex });
  S.result = r.ok ? r : null;
  S.goals = r.goals || [];
  S.goal = r.goal || S.goal;
  S.method = 0;
  S.shown = 1;
  S.ai = null;
  aiSeq++;
  S.mode = "solution";
  if (r.ok) remember(r);
  render();
  if (!r.ok) solveAi();
}

async function solveAi() {
  const seq = ++aiSeq;
  if (!navigator.onLine) {
    S.ai = { error: t("scan.offline"), retry: true };
    return render();
  }
  S.ai = { loading: true };
  render();
  // izbrani cilj gre zraven (»Razstavi«, »Odvod« …); ničle izraza = rešitve enačbe izraz = 0
  const text = prep(S.text);
  const body = S.goal === "zeros" ? { text: `${text}=0`, goal: "solve" } : { text, goal: S.goal || null };
  try {
    const out = await D.api(`/api/students/${sid()}/scan/solve`, { method: "POST", body });
    if (seq !== aiSeq || S.mode !== "solution") return;
    if (out.mock || !out.solution) {
      S.ai = { error: t("scan.noSolve") };
      return render();
    }
    S.result = fromAi(out.solution);
    S.method = 0;
    S.shown = 1;
    S.ai = null;
    remember(S.result);
    render();
  } catch (err) {
    if (seq !== aiSeq || S.mode !== "solution") return;
    // inštruktor (AI) trenutno ni na voljo: prijazno sporočilo namesto tehnične kode
    S.ai = { error: err?.body?.unavailable ? t("scan.tutorDown") : err?.message || t("scan.aiFail"), retry: true };
    render();
  }
}

function problemTexOf(text) {
  try {
    const info = analyze(text);
    if (info.type === "system") return math(`\\begin{cases} ${info.parts.map((p) => exprTex(parseTask(p))).join(" \\\\ ")} \\end{cases}`, true);
    if (info.type !== "error") return math(exprTex(parseTask(text)), true);
  } catch {}
  return esc(text);
}

function fromAi(sol) {
  return {
    ok: true,
    ai: true,
    kind: sol.kind,
    problemTex: sol.problem_tex,
    answer: { tex: sol.answer_tex },
    methods: sol.methods.map((m, i) => ({ id: `ai${i}`, name: m.name, steps: m.steps.map((s) => ({ title: s.title, tex: s.tex, whyText: s.why })) })),
    verified: !!sol.verified,
    graph: null,
  };
}

function renderSolution(box) {
  const r = S.result;
  const head = `
    <div class="card scan-problem">
      <div class="scan-problem-tex">${r ? math(r.problemTex, true) : problemTexOf(S.text)}</div>
      <button type="button" class="ghost icon-only" data-act="edit" aria-label="${esc(t("scan.edit"))}" title="${esc(t("scan.edit"))}">${icon("pencil")}</button>
    </div>
    ${S.goals?.length > 1 ? `<div class="chip-row scan-goals" role="tablist">${S.goals.map((g) => `<button type="button" role="tab" data-goal="${g}" class="${g === S.goal ? "active" : ""}" aria-selected="${g === S.goal}">${esc(t(`scan.goal.${g}`))}</button>`).join("")}</div>` : ""}`;
  if (!r) {
    box.innerHTML = `${head}
      <div class="card scan-ai-state" aria-live="polite">${S.ai?.loading ? `<span class="spinner"></span><p>${esc(t("scan.solvingAi"))}</p>` : `<p>${esc(S.ai?.error || t("scan.noSolve"))}</p>
        <div class="scan-actions">${S.ai?.retry ? `<button type="button" class="secondary" data-act="retry-ai">${icon("refresh-cw")}${esc(t("scan.retry"))}</button>` : ""}<button type="button" class="secondary" data-act="new">${icon("scan-line")}${esc(t("scan.new"))}</button><button type="button" class="primary" data-act="ask">${icon("message-circle")}${esc(t("scan.askAll"))}</button></div>`}</div>`;
    bindSolution(box);
    return;
  }
  const m = r.methods[Math.min(S.method, r.methods.length - 1)];
  const steps = m.steps;
  const shown = Math.min(S.shown, steps.length);
  const badge = r.verified
    ? `<span class="scan-badge ok" title="${esc(t("scan.verifiedTip"))}">${icon("badge-check")}${esc(r.ai ? t("scan.aiVerified") : t("scan.verified"))}</span>`
    : `<span class="scan-badge warn">${icon("info")}${esc(t("scan.aiUnverified"))}</span>`;
  box.innerHTML = `${head}
    <section class="card scan-answer" aria-label="${esc(t("scan.answer"))}">
      <div class="scan-answer-head"><span class="scan-label">${esc(t("scan.answer"))}</span>${badge}</div>
      <div class="scan-answer-tex">${r.answer.key ? `<p>${esc(t(r.answer.key))}</p>` : ""}${math(r.answer.tex, true)}</div>
      ${r.answer.approx ? `<div class="scan-approx">${math(r.answer.approx)}</div>` : ""}
    </section>
    ${r.methods.length > 1 ? `<div class="scan-methods"><span class="scan-label">${esc(t("scan.method"))}</span><div class="seg" role="tablist">${r.methods.map((mm, i) => `<button type="button" role="tab" data-method="${i}" class="${i === S.method ? "active" : ""}" aria-selected="${i === S.method}">${esc(mm.name || t(`scan.m.${mm.id}`))}</button>`).join("")}</div></div>` : ""}
    <section class="scan-steps" aria-label="${esc(t("scan.steps"))}">
      <h2 class="scan-h2">${esc(t("scan.steps"))}</h2>
      <ol>${steps.slice(0, shown).map((s, i) => stepHtml(s, i)).join("")}</ol>
      ${
        shown < steps.length
          ? `<div class="scan-actions scan-more"><button type="button" class="text-btn" data-act="all">${esc(t("scan.all"))}</button><button type="button" class="primary" data-act="next">${icon("arrow-right")}${esc(t("scan.next"))} <span class="muted">${shown}/${steps.length}</span></button></div>`
          : ""
      }
    </section>
    ${r.numberLine ? `<section class="card scan-nl"><h2 class="scan-h2">${esc(t("scan.numberLine"))}</h2>${numberLineSvg(r.numberLine)}</section>` : ""}
    ${r.graph ? `<section class="card scan-graph"><div class="scan-graph-head"><h2 class="scan-h2">${esc(t("scan.graph"))}</h2><button type="button" class="ghost small" data-act="graph">${icon("maximize-2")}${esc(t("scan.openGraph"))}</button></div><div class="scan-graph-host"></div></section>` : ""}
    <div class="scan-actions scan-foot">
      ${r.ai ? "" : `<button type="button" class="secondary" data-act="retry-ai">${icon("sparkles")}${esc(t("scan.tryAi"))}</button>`}
      <button type="button" class="secondary" data-act="ask">${icon("message-circle")}${esc(t("scan.askAll"))}</button>
      <button type="button" class="primary" data-act="new">${icon("scan-line")}${esc(t("scan.new"))}</button>
    </div>
    ${S.ai?.loading ? `<div class="card scan-ai-state"><span class="spinner"></span><p>${esc(t("scan.solvingAi"))}</p></div>` : S.ai?.error ? `<p class="scan-err">${esc(S.ai.error)}</p>` : ""}`;
  bindSolution(box);
  if (r.graph) drawGraph(box.querySelector(".scan-graph-host"), r.graph);
}

function stepHtml(s, i) {
  const why = s.why || s.whyText || s.whyTex;
  return `<li class="scan-step" style="--i:${i}">
    <div class="scan-step-head"><span class="scan-step-n" aria-hidden="true">${i + 1}</span><p class="scan-step-title"><span class="sr-only">${esc(t("scan.stepN", { n: i + 1 }))}: </span>${tr(s.title)}</p></div>
    <div class="scan-step-math">${math(s.tex, true)}${s.note ? `<span class="scan-step-note">${math(s.note)}</span>` : ""}</div>
    <div class="scan-step-actions">
      ${why ? `<button type="button" class="text-btn" data-why="${i}" aria-expanded="false">${icon("lightbulb")}${esc(t("scan.why"))}</button>` : ""}
      <button type="button" class="text-btn" data-ask="${i}">${icon("message-circle")}${esc(t("scan.askStep"))}</button>
    </div>
    ${why ? `<div class="scan-why" hidden>${s.why ? `<p>${tr(s.why)}</p>` : ""}${(s.why2 || []).map((w) => `<p>${tr(w)}</p>`).join("")}${s.whyText ? `<p>${rich(s.whyText)}</p>` : ""}${s.whyTex ? math(s.whyTex, true) : ""}</div>` : ""}
  </li>`;
}

function bindSolution(box) {
  const on = (sel, fn) => box.querySelectorAll(sel).forEach((b) => b.addEventListener("click", fn));
  on('[data-act="edit"]', () => {
    S.mode = "confirm";
    S.note = null;
    render();
  });
  on("[data-goal]", (e) => {
    S.goal = e.currentTarget.dataset.goal;
    solveNow();
  });
  on("[data-method]", (e) => {
    S.method = Number(e.currentTarget.dataset.method);
    S.shown = 1;
    render();
  });
  on('[data-act="next"]', () => {
    S.shown++;
    render();
    const items = $v().querySelectorAll(".scan-step");
    items[items.length - 1]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  on('[data-act="all"]', () => {
    S.shown = 999;
    render();
  });
  on("[data-why]", (e) => {
    const li = e.currentTarget.closest(".scan-step");
    const w = li.querySelector(".scan-why");
    w.hidden = !w.hidden;
    e.currentTarget.setAttribute("aria-expanded", String(!w.hidden));
  });
  on("[data-ask]", (e) => {
    const i = Number(e.currentTarget.dataset.ask);
    const s = S.result.methods[S.method].steps[i];
    const title = typeof s.title === "string" ? s.title : t(s.title.k, s.title.v);
    D.askTutor(t("scan.askStepText", { problem: S.text, n: i + 1, title, tex: plainSides(s.tex) }));
  });
  on('[data-act="ask"]', () => D.askTutor(t("scan.askAllText", { problem: S.text, answer: S.result?.answer?.tex || "?" })));
  on('[data-act="new"]', () => {
    S.mode = "capture";
    S.result = null;
    S.problems = [];
    S.text = "";
    S.goal = null;
    frame = { x: 0.06, y: 0.34, w: 0.88, h: 0.26 };
    render();
    $v()?.scrollIntoView({ block: "start" });
  });
  on('[data-act="retry-ai"]', () => solveAi());
  on('[data-act="graph"]', () => D.openGraph(S.result.graph.exprs));
}

// ---------- graf in številska premica ----------

async function drawGraph(host, g) {
  if (!host) return;
  try {
    const [{ GraphView }, { buildModel, emptyState }] = await Promise.all([import("../graph/plot.js"), import("../graph/model.js")]);
    if (!host.isConnected) return;
    const state = emptyState();
    state.items = g.exprs.map((text, i) => ({ id: `s${i}`, type: "expr", text, color: i }));
    const model = buildModel(state);
    graphView?.destroy?.();
    graphView = new GraphView(host, {
      getState: () => state,
      getModel: () => model,
      label: (k) => t(`gc.poi.${k}`),
      fmt: (v) => String(Math.round(v * 1000) / 1000).replace(".", ","),
      axisFmt: (v, d) => v.toFixed(Math.max(0, d)).replace(".", ","),
    });
    graphView.canvas.setAttribute("aria-label", t("scan.graph"));
    const v = graphView.fitBounds?.();
    if (v) state.view = v;
    graphView.draw();
  } catch {
    host.closest(".scan-graph")?.remove();
  }
}

function numberLineSvg({ v, intervals }) {
  const pts = [];
  for (const iv of intervals) for (const e of [iv.lo, iv.hi, iv.point]) if (e != null) pts.push(e);
  const num = (e) => (typeof e.num === "function" ? e.num() : e.num);
  const texOf = (e) => (typeof e.tex === "function" ? e.tex() : e.tex);
  const vals = pts.map(num);
  let lo = vals.length ? Math.min(...vals) : -1;
  let hi = vals.length ? Math.max(...vals) : 1;
  if (hi - lo < 1e-9) {
    lo -= 2;
    hi += 2;
  }
  const pad = (hi - lo) * 0.45;
  lo -= pad;
  hi += pad;
  const W = 320;
  const X = (x) => 16 + ((x - lo) / (hi - lo)) * (W - 32);
  const y = 34;
  const segs = intervals
    .map((iv) => {
      if (iv.point) return "";
      const a = iv.lo == null ? 4 : X(num(iv.lo));
      const b = iv.hi == null ? W - 4 : X(num(iv.hi));
      return `<line x1="${a}" y1="${y}" x2="${b}" y2="${y}" class="nl-seg"/>${iv.lo == null ? `<path d="M10 ${y - 6} L2 ${y} L10 ${y + 6}" class="nl-seg-head"/>` : ""}${iv.hi == null ? `<path d="M${W - 10} ${y - 6} L${W - 2} ${y} L${W - 10} ${y + 6}" class="nl-seg-head"/>` : ""}`;
    })
    .join("");
  const dots = [];
  const labels = [];
  for (const iv of intervals) {
    const ends = iv.point ? [[iv.point, true]] : [[iv.lo, iv.loClosed], [iv.hi, iv.hiClosed]];
    for (const [e, closed] of ends) {
      if (e == null) continue;
      const x = X(num(e));
      dots.push(`<circle cx="${x}" cy="${y}" r="6" class="${closed ? "nl-closed" : "nl-open"}"/>`);
      labels.push(`<foreignObject x="${x - 40}" y="${y + 10}" width="80" height="34"><div xmlns="http://www.w3.org/1999/xhtml" class="nl-label">${math(texOf(e))}</div></foreignObject>`);
    }
  }
  const desc = intervals.length ? intervals.map((iv) => (iv.point ? `${v} = ${texOf(iv.point)}` : `${iv.lo != null ? texOf(iv.lo) : "−∞"} … ${iv.hi != null ? texOf(iv.hi) : "∞"}`)).join("; ") : "∅";
  return `<svg class="scan-nl-svg" viewBox="0 0 ${W} 80" role="img" aria-label="${esc(desc)}">
    <line x1="2" y1="${y}" x2="${W - 2}" y2="${y}" class="nl-axis"/>
    <path d="M${W - 10} ${y - 5} L${W - 2} ${y} L${W - 10} ${y + 5}" class="nl-axis"/>
    ${segs}${dots.join("")}${labels.join("")}
  </svg>`;
}

// ---------- zgodovina ----------

function history() {
  try {
    const h = JSON.parse(localStorage.getItem(HIST()) || "[]");
    return Array.isArray(h) ? h.slice(0, 12) : [];
  } catch {
    return [];
  }
}
function remember(r) {
  const h = history().filter((x) => x.text !== S.text || x.goal !== (S.goal || null));
  h.unshift({ text: S.text, goal: S.goal || null, tex: r.problemTex, answer: r.answer?.key ? null : r.answer?.tex, at: Date.now() });
  try {
    localStorage.setItem(HIST(), JSON.stringify(h.slice(0, 12)));
  } catch {}
}
