// Gradiva ob lekciji: povzetek na eni strani, zvočni povzetek (branje na glas v brskalniku)
// in delovni list za tisk z rešitvami (strežnik: server/gradiva.js).
import { t } from "./i18n.js";
import { icon } from "./icons.js";
import { zavrzi } from "./odgovor.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const LABEL = { povzetek: "gr.povzetek", zvok: "gr.zvok", "delovni-list": "gr.delovni", video: "gr.video", poskus: "gr.poskus", projekt: "gr.projekt" };

// Gumbi za temo; prazno, če tema nima gradiv. Zaklenjena gradiva ne pokažemo (ponudbe so drugje).
export async function gradivaHtml(studentId, topicId) {
  let d;
  try {
    const r = await fetch(`/api/students/${studentId}/gradiva?topic=${encodeURIComponent(topicId)}`);
    if (!r.ok) return zavrzi(r), "";
    d = await r.json();
  } catch {
    return "";
  }
  const items = d.items.filter((x) => !x.locked);
  if (!items.length) return "";
  return `${items
    .map((x) =>
      x.url
        ? `<a class="tb-pdf" href="${esc(x.url)}" target="_blank" rel="noopener">${icon(x.icon)}${esc(t(LABEL[x.vrsta]))}</a>`
        : `<button type="button" class="tb-pdf tb-gr-btn" data-gradivo="${esc(x.vrsta)}" data-topic="${esc(topicId)}"${x.vrsta === "zvok" ? ' aria-pressed="false"' : ""}>${icon(x.icon)}<span>${esc(t(LABEL[x.vrsta]))}</span></button>`,
    )
    .join("")}<p class="muted tb-gr-msg" role="status" hidden></p>`;
}

function say(root, msg) {
  const el = root.querySelector(".tb-gr-msg");
  if (!el) return;
  el.textContent = msg || "";
  el.hidden = !msg;
}

// Stran za tisk odpremo v novem oknu: okno odpremo takoj (sicer ga brskalnik blokira), vsebino
// naložimo s prijavo trenutne seje in jo zapišemo vanj (base: poti do slogov in KaTeX).
export async function openPrintable(url, onError, headers = {}) {
  // V aplikaciji (spletna stran v WebView, mobile/src/app/web.tsx) novih oken ni: window.open bi izpraznil
  // stran. Preverimo dostop (napake kot na spletu) in stran odpremo kar tu; nazaj z gumbom nazaj ali potegom.
  const inApp = / EvklidApp\//.test(navigator.userAgent) && !Object.keys(headers).length;
  const w = inApp ? null : window.open("", "_blank");
  if (!w && !inApp) return onError(t("gr.popup"));
  try {
    w.document.title = "Evklid";
    w.document.body.textContent = "…";
  } catch {}
  let r;
  try {
    r = await fetch(url, { headers });
  } catch {
    w?.close();
    return onError(t("off.noConnection"));
  }
  if (w?.closed) return; // uporabnik je okno zaprl, preden je stran prišla
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    w?.close();
    return onError(e.code && t(e.code) !== e.code ? t(e.code) : e.error || t("common.error", { status: r.status }));
  }
  if (!w) return location.assign(url); // v aplikaciji: dostop je preverjen, stran odpremo tu
  const html = (await r.text()).replace("<head>", `<head><base href="${location.origin}/">`);
  w.document.open();
  w.document.write(html);
  w.document.close();
}

// --- branje na glas ---
let speaking = null; // gumb, ki trenutno bere
let run = 0; // vsak stop() ali nov začetek poveča; star klik ali onend po čakanju ne naredi nič

function slVoice() {
  const voices = window.speechSynthesis?.getVoices() || [];
  return voices.find((v) => /^sl(-|_|$)/i.test(v.lang)) || null;
}
// Glasovi se v Chromu naložijo z zamikom.
function voiceReady() {
  if (slVoice() || !window.speechSynthesis) return Promise.resolve(slVoice());
  return new Promise((res) => {
    const done = () => res(slVoice());
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1500);
  });
}

function stop() {
  run++;
  window.speechSynthesis?.cancel();
  if (speaking) {
    speaking.querySelector("span").textContent = t("gr.zvok");
    speaking.setAttribute("aria-pressed", "false");
  }
  speaking = null;
}

async function listen(btn, studentId, root) {
  if (speaking === btn) return stop();
  stop();
  const my = run;
  // Med čakanjem na glas ali strežnik je lahko uporabnik kliknil znova ali zamenjal lekcijo.
  const stale = () => my !== run || !btn.isConnected;
  if (!window.speechSynthesis) return say(root, t("gr.noSpeech"));
  const voice = await voiceReady();
  if (stale()) return;
  if (!voice) return say(root, t("gr.noVoice"));
  let a;
  try {
    const r = await fetch(`/api/students/${studentId}/gradiva/zvok?topic=${encodeURIComponent(btn.dataset.topic)}`);
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "");
    a = await r.json();
  } catch (e) {
    return stale() ? undefined : say(root, e.message || t("off.noConnection"));
  }
  if (stale()) return;
  say(root, "");
  speaking = btn;
  btn.querySelector("span").textContent = t("gr.zvokStop");
  btn.setAttribute("aria-pressed", "true");
  // Vsak odstavek posebej: dolga besedila nekateri brskalniki sredi branja prekinejo.
  a.parts.forEach((part, i) => {
    const u = new SpeechSynthesisUtterance(part);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.95;
    if (i === a.parts.length - 1) u.onend = () => my === run && stop();
    window.speechSynthesis.speak(u);
  });
}

// Ko se lekcija zamenja ali uporabnik odide, branje ustavimo.
export const stopReading = stop;

export function wireGradiva(root, studentId) {
  root.querySelectorAll("[data-gradivo]").forEach((btn) => {
    btn.addEventListener("click", () => {
      say(root, "");
      if (btn.dataset.gradivo === "zvok") return listen(btn, studentId, root);
      if (btn.dataset.gradivo === "video") return openVideo(studentId, btn.dataset.topic, (m) => say(root, m));
      if (btn.dataset.gradivo === "poskus" || btn.dataset.gradivo === "projekt")
        return openPrintable(`/api/students/${studentId}/gradiva/stran?vrsta=${btn.dataset.gradivo}&topic=${encodeURIComponent(btn.dataset.topic)}`, (m) => say(root, m));
      if (btn.dataset.gradivo === "delovni-list")
        return openPrintable(`/api/students/${studentId}/gradiva/delovni-list?topic=${encodeURIComponent(btn.dataset.topic)}`, (m) => say(root, m));
    });
  });
}

// --- kratek video iz simulacije ---
// Scenarij (server/gradiva-vsebina.js) ima prizore ob času t: podnapis, ki ga glas prebere, in dejanja
// v simulaciji (nastavi drsnik, klikni gumb). Ko je branje vklopljeno, čas čaka, da glas konča stavek.
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

function applyAction(simEl, a, tries = 0) {
  const field = [...simEl.querySelectorAll("input[aria-label], select[aria-label]")].find((x) => x.getAttribute("aria-label") === a.target);
  if (a.do === "set" && field?.tagName === "SELECT") {
    // Vrednost možnosti ali njen napis (avtor vidi napis).
    const o = [...field.options].find((x) => x.value === a.value) || [...field.options].find((x) => x.textContent.trim() === a.value);
    if (o) {
      field.value = o.value;
      field.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
  } else if (a.do === "set" && field) {
    field.value = String(a.value).replace(",", ".");
    field.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }
  if (a.do === "click") {
    const b = [...simEl.querySelectorAll("button, [role=button]")].find((x) => x.getAttribute("aria-label")?.trim() === a.target || x.textContent.trim() === a.target);
    if (b) return b.click(), true;
    // Potrditveno polje (kit.toggle): klik na njegov napis ga preklopi.
    const c = [...simEl.querySelectorAll("label.demo-check")].find((x) => x.textContent.trim() === a.target)?.querySelector("input");
    if (c) return c.click(), true;
    // Gumbi »Prikaz na grafu« (sim/prikaz.js) se pojavijo z zamikom: v prvem prizoru jih počakamo.
    if (tries < 10 && simEl.isConnected) return setTimeout(() => applyAction(simEl, a, tries + 1), 150), true;
  }
  console.warn(`Video: v simulaciji ni »${a.target}«.`);
  return false;
}

export async function openVideo(studentId, topicId, onError) {
  stop();
  let v;
  try {
    const r = await fetch(`/api/students/${studentId}/gradiva/video?topic=${encodeURIComponent(topicId)}`);
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return onError(d.code && t(d.code) !== d.code ? t(d.code) : d.error || t("common.error", { status: r.status }));
    v = d;
  } catch {
    return onError(t("off.noConnection"));
  }
  const { mountSim } = await import("./sim/index.js");
  // Dvojni klik na gumb: odprt je lahko le en video.
  document.querySelectorAll("dialog.gr-video").forEach((d) => d.close());
  const dlg = document.createElement("dialog");
  dlg.className = "gr-video";
  dlg.setAttribute("aria-label", v.title);
  dlg.innerHTML = `<div class="gr-video-head"><h2 dir="auto">${esc(v.title)}</h2>
      <button type="button" class="ghost gr-video-close" aria-label="${esc(t("gr.close"))}">${icon("x")}</button></div>
    <div class="gr-video-sim"></div>
    <div class="gr-video-foot"><div class="gr-video-cap" dir="auto" aria-live="polite"></div>
    <div class="gr-video-bar">
      <button type="button" class="primary gr-video-play">${icon("play")}<span>${esc(t("gr.play"))}</span></button>
      <button type="button" class="secondary gr-video-again" aria-label="${esc(t("gr.again"))}">${icon("rotate-ccw")}</button>
      <progress max="${v.duration}" value="0" aria-label="${esc(t("gr.video"))}"></progress><span class="gr-video-time">0:00 / ${mmss(v.duration)}</span>
      <label class="gr-video-voice"><input type="checkbox" checked> ${esc(t("gr.voice"))}</label>
    </div>
    ${v.draft ? `<p class="muted gr-video-draft">${esc(t("gr.videoDraft"))}</p>` : ""}</div>`;
  document.body.append(dlg);
  const $ = (sel) => dlg.querySelector(sel);
  const simEl = $(".gr-video-sim");
  const voiceBox = $(".gr-video-voice input");
  let voice = null;
  // Prvi prizor začne šele, ko vemo, ali je glas (Chrome glasove naloži z zamikom).
  const voiceKnown = voiceReady().then((x) => {
    voice = x;
    if (!x) (voiceBox.checked = false), (voiceBox.disabled = true), $(".gr-video-voice").setAttribute("title", t("gr.noVoice"));
  });
  // waited: koliko sekund čas že stoji zaradi branja; če glas ne javi konca (znana napaka brskalnikov), gremo naprej.
  let time = 0, next = 0, playing = false, last = 0, talking = false, waited = 0, raf = 0, run = 0, loading = false;

  const scene = (i) => {
    const sc = v.scenes[i];
    $(".gr-video-cap").innerHTML = sc.html;
    sc.actions.forEach((a) => applyAction(simEl, a));
    if (voice && voiceBox.checked && window.speechSynthesis) {
      const id = run;
      const u = new SpeechSynthesisUtterance(sc.speak);
      u.voice = voice;
      u.lang = voice.lang;
      u.rate = 0.95;
      talking = true;
      waited = 0;
      u.onend = u.onerror = () => id === run && (talking = false);
      window.speechSynthesis.speak(u);
    }
  };
  const setPlay = (on) => {
    playing = on;
    $(".gr-video-play").innerHTML = `${icon(on ? "pause" : "play")}<span>${esc(t(on ? "gr.pause" : "gr.play"))}</span>`;
    if (!window.speechSynthesis) return;
    if (on) window.speechSynthesis.resume();
    else window.speechSynthesis.pause();
  };
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.25, (now - last) / 1000);
    last = now;
    if (!playing) return;
    const due = next < v.scenes.length ? v.scenes[next].t : v.duration;
    // Med branjem čas ne preskoči v naslednji prizor (ali na konec).
    if (talking && time + dt >= due) {
      if ((waited += dt) < 20) return;
      talking = false;
    }
    time = Math.min(v.duration, time + dt);
    while (next < v.scenes.length && v.scenes[next].t <= time) scene(next++);
    $("progress").value = time;
    $(".gr-video-time").textContent = `${mmss(time)} / ${mmss(v.duration)}`;
    if (time >= v.duration) setPlay(false);
  };
  // cancel() ne prekliče pause(): brez resume() bi glas (tudi zvočni povzetek) potem molčal.
  const hush = () => (window.speechSynthesis?.cancel(), window.speechSynthesis?.resume());
  const restart = async () => {
    run++;
    // Med nalaganjem simulacije čas stoji, sicer bi prvi prizor šel v staro simulacijo in podnapis bi se izbrisal.
    playing = false;
    hush();
    talking = false;
    time = 0;
    next = 0;
    const my = run;
    loading = true;
    await Promise.all([mountSim(v.sim, simEl, { ...v.opts, noReset: true }), voiceKnown]);
    if (my !== run) return;
    loading = false;
    $(".gr-video-cap").textContent = "";
    $("progress").value = 0;
    setPlay(true);
  };
  const close = () => {
    run++;
    cancelAnimationFrame(raf);
    hush();
    dlg.remove();
  };
  $(".gr-video-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("close", close);
  $(".gr-video-play").addEventListener("click", () => loading || (time >= v.duration ? restart() : setPlay(!playing)));
  $(".gr-video-again").addEventListener("click", restart);
  voiceBox.addEventListener("change", () => !voiceBox.checked && window.speechSynthesis?.cancel());
  dlg.showModal();
  last = performance.now();
  raf = requestAnimationFrame(tick);
  await restart();
}
