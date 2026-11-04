// Evklidova tipkovnica: ena tipkovnica na zaslonu za vso aplikacijo (docs/oblikovanje.md »Evklidova tipkovnica»).
// Na napravah na dotik jo dobi vsako polje za pisanje (inputmode="none", telefonova se ne odpira in zapira),
// razen prijave (e-pošta, geslo), polj z data-system-kb ter datotek, datumov, barv in drsnikov.
// Na računalniku se pokaže samo na zahtevo (gumb Σ v Inštruktorju, meni kalkulatorja).
//
// Klicatelji opišejo polje (ali okvir s polji) s configureKeyboard(el, {...}):
//   layers  plasti: "abc" | "num" | "fx" | "sym" | "kem" ali lastna mreža { id, label, cols, keys: [[napis, vstavi]] }
//   start   začetna plast (ali funkcija polja); enter: "calc" | "check" | "send" | "next" | "newline" | "go" (enterText: napis)
//   parsed  polje bere math.js (kalkulator, skener): tipke vstavijo imena funkcij (floor, stdev …), drugje zapis za ljudi (⌊x⌋, σ)
//   ctx     vrstica nad tipkami: [[napis, vstavi]] ali { label, ins, unit } (ali funkcija polja)
//   math    polje za matematiko (velja tudi pri nastavitvi »Samo za matematiko«); own: polje ima svoje tipke
import { t, currentLang } from "./i18n.js";
import { icon } from "./icons.js";
import { GROUPS, groupOrder, chemFormat } from "./symbols.js";
import { stopnja } from "./stopnja.js";
import { chapterProfile, fxGroupFor } from "./graph/tipke-poglavja.js";
import {
  layoutFor, FX_GROUPS, CAS_SL, KEM_ROWS, NUM_TOP_MATH, NUM_TOP_TEXT, EMAIL_CHIPS, URL_CHIPS, isUrlField,
  fieldKind, usesOwnKeyboard, applyTemplate, prettyIns, digitFor, autoCapNeeded, doubleSpaceAt, wordsBack, autocorrect, deleteBack, stepCaret, withUnit, PREF_KEY, MODES, parsePrefs, suggest, glideDecode,
} from "./tipkovnica-data.js";

const touch = () => typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const lsGet = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};

let prefs = parsePrefs(lsGet(PREF_KEY));
const savePrefs = () => {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  } catch {}
};
const configs = new WeakMap(); // polje ali okvir → nastavitve
const origMode = new WeakMap(); // polje → izvirni inputmode (null: ga ni bilo)
const numShadow = new WeakMap(); // type=number: vpisano besedilo (brskalnik »3.« ne sprejme kot vrednost)
let studentSettings = () => null;
let chapterOf = () => null; // poglavje, iz katerega je odprt kalkulator (tipke-poglavja.js)
let lastProfile; // f(x) odpre skupino poglavja samo ob novem poglavju; učenčeva izbira potem ostane
let words = null; // seznam za predloge (naloži se, ko so predlogi vklopljeni)
let starts = null; // predlogi, ko se beseda še ne piše

const S = { open: false, field: null, cfg: {}, kind: null, layers: [], layer: null, shift: 0, shiftAt: 0, fxg: "trig", symg: null, sys: null, explicit: false };
let board = null;
let keys = []; // data-k → dejanje

// ---------- nastavitve polj ----------

/** Opiši polje ali okvir s polji (velja za vsa polja v njem). */
export function configureKeyboard(el, cfg) {
  if (el) configs.set(el, cfg || {});
}
/** Nastavitve učenca za vrstni red skupin Σ (raven, predmet). */
export function setKeyboardContext({ settings, chapter } = {}) {
  if (settings) studentSettings = settings;
  if (chapter) chapterOf = chapter;
}
export const keyboardPrefs = () => ({ ...prefs });

function configFor(field) {
  for (let el = field; el; el = el.parentElement) if (configs.has(el)) return configs.get(el);
  return {};
}
const val = (v, field) => (typeof v === "function" ? v(field) : v);
const orig = (f) => (origMode.has(f) ? origMode.get(f) : f.getAttribute("inputmode"));
const textField = (el) => el?.closest?.("input, textarea, [contenteditable='true'], [contenteditable='']") || null;
const visible = (el) => !!el && el.isConnected && el.getClientRects().length > 0;

// Polje dobi našo tipkovnico samo od sebe (dotik, nastavitev, ni »svoje« tipkovnice, ni telefonove za to polje).
const isOwn = (f) => !!configFor(f).own || !!f.closest("[data-kb-own]");
function autoEligible(f) {
  if (!f || !touch() || f === S.sys || isOwn(f)) return false;
  const cfg = configFor(f);
  return usesOwnKeyboard(f, prefs.mode, { math: !!cfg.math, inputmode: orig(f) });
}
function prepare(f) {
  if (!origMode.has(f)) origMode.set(f, f.getAttribute("inputmode"));
  f.setAttribute("inputmode", "none");
}
function release(f) {
  if (!f || !origMode.has(f)) return;
  const v = origMode.get(f);
  origMode.delete(f);
  if (v == null) f.removeAttribute("inputmode");
  else f.setAttribute("inputmode", v);
}

// ---------- plasti ----------

const LAYER_LABEL = { abc: "ABC", num: "123", fx: "f(x)", sym: "Σ" };
function layerList() {
  const L = val(S.cfg.layers, S.field);
  if (!L) return S.kind === "num" ? ["num"] : ["abc", "num", "sym"];
  return L;
}
const layerId = (l) => (typeof l === "string" ? l : l.id);
const layerObj = (id) => S.layers.find((l) => layerId(l) === id) || S.layers[0];
function startLayer(opt) {
  const ids = S.layers.map(layerId);
  const want = opt || val(S.cfg.start, S.field) || (S.kind === "num" ? "num" : ids[0]);
  return ids.includes(want) ? want : ids[0];
}

// ---------- odpiranje in zapiranje ----------

/** Odpri tipkovnico za polje (tudi na računalniku). opts.layer: začetna plast. */
export function openKeyboard(field, { layer } = {}) {
  if (!field || !field.isConnected) return;
  initKeyboard();
  const cfg = configFor(field);
  const kind = fieldKind(field, orig(field)) || "text";
  const same = S.field && S.cfg === cfg && S.kind === kind;
  if (S.field && S.field !== field && !autoEligible(S.field)) release(S.field);
  if (S.sys === field) S.sys = null;
  S.explicit = !autoEligible(field);
  S.field = field;
  S.cfg = cfg;
  S.kind = kind;
  S.layers = layerList();
  if (layer || !same || !S.layers.some((l) => layerId(l) === S.layer)) S.layer = startLayer(layer);
  S.shift = 0;
  S.corr = null;
  // novo poglavje: plast f(x) začne s skupino tega poglavja (kotne funkcije, potence, statistika …)
  let prof = null;
  try {
    prof = chapterProfile(chapterOf());
  } catch {}
  if (prof !== lastProfile) {
    lastProfile = prof;
    const g = fxGroupFor(prof);
    if (g) S.fxg = g;
  }
  if (S.layer === "abc") autoShift();
  prepare(field);
  if (document.activeElement !== field) field.focus({ preventScroll: true });
  const was = S.open;
  S.open = true;
  board.hidden = false;
  document.body.classList.add("tk-open");
  render();
  if (prefs.words) loadWords();
  requestAnimationFrame(() => lift(field, !was));
  emit();
}

/** Skrij tipkovnico. blur: na telefonu polje izgubi fokus (kazalec izgine). */
export function hideKeyboard({ blur = false } = {}) {
  if (!S.open) return;
  S.open = false;
  clearTimers(); // držanje ⌫ / ← / → se ustavi
  closePop();
  trailEnd(true);
  S.lastGlide = null;
  if (board) board.hidden = true;
  document.body.classList.remove("tk-open");
  document.documentElement.style.setProperty("--tk-h", "0px");
  const f = S.field;
  if (f && !autoEligible(f)) release(f);
  if (blur && f && touch() && document.activeElement === f) f.blur();
  emit();
}

/** Odpri (ali zapri, če je že odprta na tej plasti) za polje. Vrne, ali je odprta. */
export function toggleKeyboard(field, opts = {}) {
  if (S.open && S.field === field && (!opts.layer || S.layer === opts.layer)) {
    hideKeyboard();
    return false;
  }
  openKeyboard(field, opts);
  return true;
}
export const keyboardOpenFor = (field) => S.open && (!field || S.field === field || field.contains?.(S.field));
export const keyboardLayer = () => (S.open ? S.layer : null);

function emit() {
  window.dispatchEvent(new CustomEvent("evklid:tipkovnica", { detail: { open: S.open, field: S.field, layer: S.layer } }));
}

// Vsebina se enkrat dvigne: polje mora biti vidno nad tipkovnico.
function lift(field, first) {
  if (!S.open || !board) return;
  const h = board.offsetHeight;
  document.documentElement.style.setProperty("--tk-h", h + "px");
  const r = field.getBoundingClientRect();
  const bottom = (window.visualViewport?.height || innerHeight) - h - 8;
  if (r.bottom > bottom || r.top < 0) field.scrollIntoView({ block: first ? "center" : "nearest" });
}

// Telefonova tipkovnica za to polje (jeziki z načinom za znake). Ostane, dokler se učenec ne dotakne
// česa drugega: telefon polje ob odpiranju tipkovnice za hip odfokusira, zato izguba fokusa ne šteje (#247).
function toSystem() {
  const f = S.field;
  if (!f) return;
  S.sys = f;
  hideKeyboard();
  release(f);
  f.blur();
  f.focus({ preventScroll: true });
}
const scopeOf = (f) => f.closest("[data-kb-scope]") || f.closest("form") || f;

// ---------- risanje ----------

function key(label, act, { cls = "", aria = "", hint = "", html = "", role = "" } = {}) {
  const i = keys.push(act) - 1;
  return `<button type="button" class="tk-k ${cls}" data-k="${i}"${role ? ` role="${role}"` : ""}${aria ? ` aria-label="${esc(aria)}"` : ""}>${html || esc(label)}${hint ? `<span class="tk-v" aria-hidden="true">${esc(hint)}</span>` : ""}</button>`;
}
const chip = (label, act, cls = "") => {
  const i = keys.push(act) - 1;
  return `<button type="button" class="tk-chip ${cls}" data-k="${i}">${esc(label)}</button>`;
};
const decimal = () => {
  if (S.field?.type === "number") return ".";
  try {
    return (1.5).toLocaleString(currentLang()).includes(",") ? "," : ".";
  } catch {
    return ",";
  }
};
const bsKey = (cls = "fn w15") => key("", { a: "bs" }, { cls, aria: t("sc.del"), html: icon("delete") });
const leftKey = () => key("", { a: "l" }, { cls: "fn", aria: t("sc.left"), html: icon("arrow-left") });
const rightKey = () => key("", { a: "r" }, { cls: "fn", aria: t("sc.right"), html: icon("arrow-right") });
const spaceKey = (cls = "w5") => key("", { a: "sp" }, { cls: `space ${cls}`, aria: t("tk.space") });

function enterMode() {
  const m = val(S.cfg.enter, S.field);
  if (m) return m;
  if (S.field?.tagName === "TEXTAREA" || S.field?.isContentEditable) return "newline";
  return "next";
}
function goKey(cls = "w2") {
  const m = enterMode();
  const text = val(S.cfg.enterText, S.field);
  if (text) return key(text, { a: "go" }, { cls: `go txt ${cls}` });
  if (m === "calc") return key("=", { a: "go" }, { cls: `go ${cls}`, aria: t("sc.equals") });
  if (m === "check") return key(t("task.check"), { a: "go" }, { cls: `go txt ${cls}` });
  if (m === "next") return key(t("tk.next"), { a: "go" }, { cls: `go txt ${cls}` });
  if (m === "send") return key("", { a: "go" }, { cls: `go ${cls}`, aria: t("chat.send"), html: icon("send") });
  return key("", { a: "go" }, { cls: `go ${cls}`, aria: t("tk.newline"), html: icon("corner-down-left") });
}

function ctxChips() {
  const auto0 = String(S.field?.getAttribute("autocomplete") || "") + " " + String(orig(S.field) || "");
  const url = isUrlField(S.field) || /\burl\b/.test(auto0);
  const mail = !url && (S.field?.type === "email" || /\bemail\b/.test(auto0));
  if (url || mail) {
    const paste = chip(t("tk.paste"), { a: "paste" }, "paste");
    return { words: false, html: paste + (url ? URL_CHIPS : EMAIL_CHIPS).map(([l, v]) => chip(l, { a: "lit", v })).join("") };
  }
  // po drsenju: drugi kandidati (tudi ko so predlogi besed izklopljeni); tap zamenja drsano besedo
  const g = S.layer === "abc" && S.lastGlide && glideValid(S.field, S.lastGlide) ? S.lastGlide : null;
  if (g) {
    const alts = g.cands.filter((x) => x !== g.cur);
    return { words: true, glide: true, html: alts.map((x) => chip(glideCase(x, g.shift), { a: "gword", v: x }, "word")).join("") };
  }
  if (prefs.words && S.layer === "abc" && words) {
    const w = currentWord();
    const v = String(S.field?.value ?? S.field?.textContent ?? "");
    const r = S.field && sel(S.field);
    // vezne besede samo za presledkom (za »2« ali »?« bi se zlepile: »2je«)
    const kind = !v.trim() ? "start" : r && /\s$/.test(v.slice(0, r[0])) ? "next" : null;
    const list = w ? suggest(words, w) : (kind && starts?.[kind]) || [];
    return { words: true, html: list.map((x) => chip(x, { a: "word", v: x }, "word")).join("") };
  }
  let list = val(S.cfg.ctx, S.field);
  const auto = String(S.field?.getAttribute("autocomplete") || "") + " " + String(orig(S.field) || "");
  if (!list && /\bemail\b/.test(auto)) list = EMAIL_CHIPS;
  if (!list?.length) return { words: false, html: "" };
  return {
    words: false,
    html: list
      .map((c) => {
        const o = Array.isArray(c) ? { label: c[0], ins: c[1] ?? c[0] } : c;
        return chip(o.label, o.unit ? { a: "unit", v: o.ins ?? o.label } : { a: "ins", v: o.ins ?? o.label }, o.unit ? "unit" : "");
      })
      .join(""),
  };
}

function tabsHtml() {
  const tabs = S.layers.length > 1
    ? S.layers
        .map((l) => {
          const id = layerId(l);
          const label = typeof l === "object" ? l.label : id === "kem" ? t("tk.l.kem") : LAYER_LABEL[id] || id;
          const on = id === S.layer;
          const i = keys.push({ a: "layer", v: id }) - 1;
          return `<button type="button" class="tk-tab${on ? " on" : ""}" role="tab" aria-selected="${on}" data-k="${i}">${esc(label)}</button>`;
        })
        .join("")
    : "";
  const h = keys.push({ a: "hide" }) - 1;
  return `<div class="tk-tabs"><div class="tk-tablist" role="tablist" aria-label="${esc(t("tk.label"))}">${tabs}</div><button type="button" class="tk-hide" data-k="${h}" aria-label="${esc(t("gc.hideKeypad"))}">${icon("chevron-down")}</button></div>`;
}

/** Različice za dolg pritisk: v zgornji vrsti najprej številka (kot Gboard), nato črke z znaki. */
function varsFor(c) {
  const lay = layoutFor(currentLang());
  const d = digitFor(lay.rows, c);
  return [...(d ? [d] : []), ...(lay.variants[c] || [])];
}
// Gboard v besedilu: velika začetnica, dva presledka = pika, samopopravek (s predlogi). Ne v matematiki,
// e-pošti, povezavah ali polju z autocapitalize="off"/"none".
function prose() {
  const f = S.field;
  if (!f || S.kind !== "text" || S.cfg.math || S.layer !== "abc" || isUrlField(f)) return false;
  if (/\bemail\b/.test(String(f.getAttribute("autocomplete") || "") + " " + String(orig(f) || "") + " " + String(f.type || ""))) return false;
  return !/^(off|none)$/i.test(f.getAttribute("autocapitalize") || "");
}
function before() {
  const f = S.field;
  const r = f && sel(f);
  return r ? f.value.slice(0, r[0]) : null;
}
/** Samodejni ⇧ na začetku stavka; ročno izbranega ali zaklenjenega ne spreminja. */
function autoShift() {
  if (S.shift === 2 || (S.shift === 1 && !S.autoShift)) return;
  const b = prose() ? before() : null;
  const want = b !== null && autoCapNeeded(b) && !layoutFor(currentLang()).caseless;
  S.shift = want ? 1 : 0;
  S.autoShift = want;
}

function abcHtml() {
  const lay = layoutFor(currentLang());
  const up = (c) => {
    const u = c.toLocaleUpperCase(currentLang());
    return S.shift && u.length === 1 ? u : c;
  };
  const letter = (c) => {
    const v = varsFor(c);
    const show = digitFor(lay.rows, c) || !lay.hints || lay.hints.includes(c);
    return key(up(c), { a: "char", v: c }, { hint: v[0] && show ? up(v[0]) : "" });
  };
  const [r1, r2, r3] = lay.rows;
  // krajša vrsta je na sredini (kot Gboard: a–l zamaknjene za pol tipke), tipke ostanejo enako široke kot zgoraj
  const pad = (r) => (r.length < r1.length ? `<span class="tk-pad" style="flex-grow:${(r1.length - r.length) / 2}" aria-hidden="true"></span>` : "");
  const shift = lay.caseless ? "" : key("⇧", { a: "sh" }, { cls: `fn w15 shift${S.shift ? " on" : ""}${S.shift === 2 ? " lock" : ""}`, aria: t("tk.shift") });
  const email = /\bemail\b/.test(String(S.field?.getAttribute("autocomplete") || "") + " " + String(orig(S.field) || ""));
  const slot = email ? key("@", { a: "lit", v: "@" }, { cls: "fn" }) : lay.globe ? key("🌐", { a: "globe" }, { cls: "fn", aria: t("tk.globe") }) : key("-", { a: "ins", v: "-" }, { cls: "fn" });
  const toNum = S.layers.some((l) => layerId(l) === "num") ? key("?123", { a: "layer", v: "num" }, { cls: "fn w15 sm", aria: "123" }) : "";
  const comma = key(lay.comma, { a: "char", v: lay.comma }, { hint: lay.variants[lay.comma]?.[0] || "" });
  const dot = key(".", { a: "char", v: "." }, { hint: lay.variants["."]?.[0] || "" });
  // Vrstice so vedno od leve proti desni (tudi arabščina: ض levo zgoraj kot na telefonu; tipkovnica.css).
  // spodnja vrsta kot Gboard (j, 4. 11.): ?123 , [-|@|🌐] presledek . Enter
  return `<div class="tk-row">${r1.map(letter).join("")}</div>
    <div class="tk-row">${pad(r2)}${r2.map(letter).join("")}${pad(r2)}</div>
    <div class="tk-row">${shift}${r3.map(letter).join("")}${bsKey()}</div>
    <div class="tk-row">${toNum}${comma}${slot}${spaceKey()}${dot}${goKey()}</div>`;
}

function numHtml() {
  const d = decimal();
  if (S.kind === "num" && !S.cfg.layers) {
    const cells = ["7", "8", "9", "BS", "4", "5", "6", "−", "1", "2", "3", "D", "L", "0", "R", "GO"];
    return `<div class="tk-grid" style="--cols:4">${cells
      .map((c) => (c === "BS" ? bsKey("fn") : c === "L" ? leftKey() : c === "R" ? rightKey() : c === "GO" ? goKey("") : c === "D" ? key(d, { a: "ins", v: d }) : c === "−" ? key("−", { a: "ins", v: "-" }, { cls: "fn" }) : key(c, { a: "ins", v: c }, { cls: "dig" })))
      .join("")}</div>`;
  }
  const math = S.cfg.math || S.layers.some((l) => layerId(l) === "fx");
  const top = (math ? NUM_TOP_MATH : NUM_TOP_TEXT).map(([l, ins]) => key(l, { a: "ins", v: ins }, { cls: "fn sm" })).join("");
  const cells = ["7", "8", "9", "÷", "BS", "4", "5", "6", "×", "L", "1", "2", "3", "−", "R", "0", "D", math ? "x" : "=", "+", "GO"];
  const ins = { "÷": ":", "×": "·", "−": "-" };
  const grid = cells
    .map((c) => (c === "BS" ? bsKey("fn") : c === "L" ? leftKey() : c === "R" ? rightKey() : c === "GO" ? goKey("") : c === "D" ? key(d, { a: "ins", v: d }) : key(c, { a: "ins", v: ins[c] || c }, { cls: /\d/.test(c) ? "dig" : "" })))
    .join("");
  return `<div class="tk-grid" style="--cols:6">${top}</div><div class="tk-grid" style="--cols:5">${grid}</div>`;
}

function subtabs(list, cur, act) {
  return `<div class="tk-sub" role="tablist">${list
    .map(([id, label]) => {
      const i = keys.push({ a: act, v: id }) - 1;
      return `<button type="button" role="tab" class="tk-subtab${id === cur ? " on" : ""}" aria-selected="${id === cur}" data-k="${i}">${esc(label)}</button>`;
    })
    .join("")}</div>`;
}

function fxHtml() {
  if (!FX_GROUPS.some(([id]) => id === S.fxg)) S.fxg = FX_GROUPS[0][0];
  const g = FX_GROUPS.find(([id]) => id === S.fxg);
  const toNum = S.layers.some((l) => layerId(l) === "num") ? key("123", { a: "layer", v: "num" }, { cls: "fn sm w15" }) : "";
  return `${subtabs(FX_GROUPS.map(([id, k]) => [id, t(k)]), S.fxg, "fxg")}
    <div class="tk-grid tk-scroll" style="--cols:5">${g[2].map(([l, ins]) => fxKey(g[0], l, ins)).join("")}</div>
    <div class="tk-row">${toNum}${leftKey()}${rightKey()}${bsKey()}${goKey()}</div>`;
}

// skupini Algebra in Analiza: v slovenščini poenostavi/razvij/razstavi/reši/integriraj/limita, drugje angleška imena
// (kot na kalkulatorjih CAS)
function fxKey(group, l, ins) {
  const cas = (group === "alg" || group === "ana") && CAS_SL[l];
  const sl = cas && /^sl/.test(currentLang() || "sl");
  const cls = cas ? "sm word" : "sm";
  return sl ? key(CAS_SL[l], { a: "ins", v: ins.replace(l, CAS_SL[l]) }, { cls }) : key(l, { a: "ins", v: ins }, { cls });
}

function symName(g) {
  return g === "analiza" ? t("sc.grp.ana") : t(`tk.g.${g}`);
}
function symHtml() {
  const s = studentSettings() || {};
  const order = groupOrder(stopnja(s), s.subject);
  const all = [...order, ...Object.keys(GROUPS).filter((g) => !order.includes(g))];
  if (!all.includes(S.symg)) S.symg = all[0];
  const sl = currentLang() === "sl";
  return `${subtabs(all.map((g) => [g, symName(g)]), S.symg, "symg")}
    <div class="tk-grid tk-scroll" style="--cols:6">${GROUPS[S.symg].keys.map((k) => key(k.label, { a: "ins", v: k.ins }, { cls: "sym", aria: sl && k.title ? k.title : "" })).join("")}</div>
    <div class="tk-row">${leftKey()}${rightKey()}${bsKey()}${goKey()}</div>`;
}

function kemHtml() {
  const row = (r, cls = "") => `<div class="tk-row">${r.map((c) => key(c, { a: "ins", v: c }, { cls: (c.length > 2 ? "sm " : "") + cls })).join("")}</div>`;
  return `${row(KEM_ROWS[0], "el")}${row(KEM_ROWS[1])}${row(KEM_ROWS[2])}
    <div class="tk-row">${leftKey()}${rightKey()}${key("+", { a: "ins", v: " + " })}${spaceKey("w3")}${key("H₂O", { a: "chem" }, { cls: "fn sm", aria: t("tk.chemFormat") })}${bsKey("fn")}${goKey()}</div>`;
}

function customHtml(L) {
  const cells = L.keys.map((k) => key(k[0], { a: "ins", v: k[1] ?? k[0] }, { cls: /^[0-9.,]$/.test(k[0]) ? "dig" : "sm", aria: k[2] || "" })).join("");
  return `<div class="tk-grid" style="--cols:${L.cols || 8}">${cells}</div>
    <div class="tk-row">${leftKey()}${rightKey()}${bsKey("fn")}${goKey()}</div>`;
}

function render() {
  if (!board || !S.open) return;
  keys = [];
  const L = layerObj(S.layer);
  S.layer = layerId(L);
  const body = typeof L === "object" ? customHtml(L) : { abc: abcHtml, num: numHtml, fx: fxHtml, sym: symHtml, kem: kemHtml }[S.layer]?.() || abcHtml();
  const c = ctxChips();
  const ctx = c.html || (prefs.words && S.layer === "abc" && words) ? `<div class="tk-ctx${c.words ? " words" : ""}"${c.glide ? ' data-g="1"' : ""}>${c.html}</div>` : "";
  board.innerHTML = `<div class="tk-in">${ctx}${tabsHtml()}<div class="tk-rows" data-layer="${esc(S.layer)}">${body}</div></div>`;
  for (const cv of [trail?.cv, fading]) {
    // sled drsenja ostane, dokler ne zbledi (prehod steče znova od polne barve)
    if (!cv || cv.isConnected) continue;
    cv.classList.remove("out");
    board.firstElementChild.appendChild(cv);
    cv.getBoundingClientRect();
    if (cv === fading) cv.classList.add("out");
  }
  if (S.layer === "abc" && prefs.glide) loadGlide();
}
function renderCtx() {
  const box = board?.querySelector(".tk-ctx");
  const c = ctxChips();
  const was = box?.dataset.g === "1";
  if (c.glide || was) {
    if (box && c.glide && was) box.innerHTML = c.html;
    else render(); // vrstica se pojavi ali izgine
    return;
  }
  if (!box || !(prefs.words && S.layer === "abc")) return;
  box.innerHTML = c.html;
}

// ---------- pisanje v polje ----------

function target() {
  const f = S.field;
  if (!f || !f.isConnected) return null;
  if (document.activeElement !== f) f.focus({ preventScroll: true });
  return f;
}
const fire = (f, inputType, data = null) => f.dispatchEvent(new InputEvent("input", { bubbles: true, inputType, data }));
function sel(f) {
  try {
    if (typeof f.selectionStart === "number") return [f.selectionStart, f.selectionEnd];
  } catch {}
  return null;
}

function insertText(f, ins, literal = false) {
  if (f.isContentEditable) {
    const at = literal ? -1 : ins.indexOf("@");
    const text = literal ? ins : ins.replace("@", "");
    document.execCommand("insertText", false, text);
    if (at >= 0) for (let i = 0; i < text.length - at; i++) getSelection()?.modify?.("move", "backward", "character");
    return;
  }
  const r = sel(f);
  if (!r) {
    // type=number (in email): brez kazalca, pišemo na konec
    const v = (shadow(f) ?? String(f.value)) + (literal ? ins : ins.replace("@", ""));
    numShadow.set(f, v);
    f.value = v;
    fire(f, "insertText", ins);
    return;
  }
  const [s, e] = r;
  const out = applyTemplate(f.value, s, e, ins, f.maxLength ?? -1, literal);
  if (!out.text && ins) return;
  f.setRangeText(out.text, s, e, "end");
  f.setSelectionRange(out.caret, out.caret);
  fire(f, "insertText", out.text);
}
// vpisano besedilo v type=number (»3.«); pri drugih poljih (e-pošta) šteje vrednost, ki jo lahko spremeni tudi obrazec
const shadow = (f) => (f.type === "number" ? numShadow.get(f) : undefined);

function backspace(f) {
  if (f.isContentEditable) return document.execCommand("delete");
  const r = sel(f);
  if (!r) {
    const v = (shadow(f) ?? String(f.value)).slice(0, -1);
    numShadow.set(f, v);
    f.value = v;
    return fire(f, "deleteContentBackward");
  }
  const [s, e] = r;
  const out = deleteBack(f.value, s, e);
  if (out.value === f.value) return;
  f.setRangeText("", out.caret, e > s ? e : s, "end");
  f.setSelectionRange(out.caret, out.caret);
  fire(f, "deleteContentBackward");
}

function moveCaret(f, dir) {
  if (f.isContentEditable) return getSelection()?.modify?.("move", dir < 0 ? "backward" : "forward", "character");
  const r = sel(f);
  if (!r) return;
  const [s, e] = r;
  const p = s !== e ? (dir < 0 ? s : e) : stepCaret(f.value, s, dir);
  f.setSelectionRange(p, p);
}

function currentWord() {
  const f = S.field;
  const r = f && sel(f);
  if (!r) return "";
  return /[\p{L}\p{M}]+$/u.exec(f.value.slice(0, r[0]))?.[0] || "";
}

async function loadWords() {
  const base = currentLang().split("-")[0];
  try {
    const m = await import("./tipkovnica-besede.js");
    words = m.WORDS[base] || null;
    starts = m.ZACETKI?.[base] || null;
  } catch {
    words = null;
    starts = null;
  }
  if (S.open && S.layer === "abc") render();
}

// ---------- drsenje po črkah (glide) ----------

let glideList = null; // seznam besed za drsenje v jeziku vmesnika (lenobno naložen)
let glideP = null;
let glideLang = "";
/** Naloži seznam za drsenje: slovenščina velik seznam iz vsebin (tipkovnica-glide-sl.js), angleščina WORDS.en. */
function loadGlide() {
  const base = currentLang().split("-")[0];
  if (glideP && glideLang === base) return glideP;
  glideLang = base;
  glideList = null;
  glideP = (async () => {
    try {
      if (base === "sl") glideList = (await import("./tipkovnica-glide-sl.js")).GLIDE_SL;
      else glideList = (await import("./tipkovnica-besede.js")).WORDS[base] || null;
    } catch {
      glideList = null;
    }
    if (!glideList) glideP = null; // naslednje drsenje poskusi znova
    return glideList;
  })();
  return glideP;
}
/** Ali se tu sme drsati: ABC, vklopljeno, ne v e-pošti in povezavah, ne v poljih brez kazalca. */
function glideOn() {
  const f = S.field;
  if (!prefs.glide || S.layer !== "abc" || !f || f.isContentEditable || sel(f) === null || S.kind !== "text") return false;
  const lay = layoutFor(currentLang());
  if (lay.globe || lay.id === "ime") return false;
  const auto = String(f.getAttribute("autocomplete") || "") + " " + String(orig(f) || "") + " " + String(f.type || "");
  return !isUrlField(f) && !/\b(email|url)\b/.test(auto);
}
const glideCase = (w, shift) => (shift === 2 ? w.toLocaleUpperCase(currentLang()) : shift === 1 ? w.charAt(0).toLocaleUpperCase(currentLang()) + w.slice(1) : w);
/** Drsana beseda je še tik pred kazalcem (nič drugega se ni spremenilo). */
function glideValid(f, g) {
  const r = f && f === S.field && sel(f);
  return !!r && r[0] === r[1] && r[0] === g.end && String(f.value).slice(g.start, g.end) === g.text;
}
function finishGlide(pts, centers) {
  const f = target();
  if (!f || pts.length < 2) return;
  loadGlide().then((list) => {
    if (!list || !f.isConnected || S.field !== f || !glideOn()) return;
    const cands = glideDecode(pts, centers, list, { n: 3 });
    if (!cands.length) return;
    const shift = S.shift;
    const w = glideCase(cands[0], shift);
    const r = sel(f);
    if (!r) return;
    const b = f.value.slice(0, r[0]);
    const sp = /[\p{L}\p{N}]$/u.test(b) ? " " : ""; // kot Gboard: druga drsana beseda dobi presledek pred seboj
    if (f.maxLength >= 0 && f.value.length - (r[1] - r[0]) + sp.length + w.length > f.maxLength) return;
    S.corr = null;
    S.lastSpace = 0;
    insertText(f, sp + w, true);
    const e = sel(f);
    if (!e) return;
    S.lastGlide = { start: e[0] - w.length, end: e[0], text: w, cands, cur: cands[0], shift };
    if (S.shift === 1) S.shift = 0;
    autoShift();
    render();
  });
}

function nextField(f) {
  const scope = f.form || f.closest(".view, .overlay, [role='dialog'], .card") || document.body;
  const list = [...scope.querySelectorAll("input, textarea, [contenteditable='true']")].filter((x) => fieldKind(x, orig(x)) && visible(x));
  const i = list.indexOf(f);
  return i >= 0 ? list[i + 1] || null : null;
}
function submitForm(f) {
  const form = f.form || f.closest("form");
  if (!form) return false;
  if (typeof form.requestSubmit === "function") form.requestSubmit();
  else form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  return true;
}
const pressEnter = (f) => !f.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));

function enter(f) {
  if (typeof S.cfg.onEnter === "function") return S.cfg.onEnter(f);
  const m = enterMode();
  if (m === "newline") return insertText(f, "\n");
  if (m === "check" || m === "send") {
    if (!submitForm(f)) pressEnter(f);
    // po poslanem sporočilu je polje prazno: naslednje se začne z veliko začetnico
    setTimeout(() => {
      if (!S.open || S.layer !== "abc") return;
      const was = S.shift;
      autoShift();
      if (was !== S.shift) render();
    }, 0);
    return;
  }
  if (m === "calc" || m === "go") return pressEnter(f);
  // next: polje samo obdela Enter (iskanje), sicer naslednje polje ali oddaja obrazca
  if (pressEnter(f)) return;
  const n = nextField(f);
  if (n) {
    n.focus();
    if (n !== S.field && !autoEligible(n) && !S.explicit) hideKeyboard();
  } else if (!submitForm(f)) hideKeyboard({ blur: true });
}

const buzz = () => {
  if (prefs.buzz) {
    try {
      navigator.vibrate?.(8);
    } catch {}
  }
};

// Prilepi iz odložišča (telefon lahko vpraša za dovoljenje); če ne gre, pove, kako drugače.
async function paste(f) {
  try {
    const txt = await navigator.clipboard.readText();
    if (txt) insertText(f, txt.trim(), true);
  } catch {
    const p = document.createElement("div");
    p.className = "tk-pop tk-say";
    p.setAttribute("role", "status");
    p.textContent = t("tk.pasteFail");
    board?.querySelector(".tk-in")?.appendChild(p);
    setTimeout(() => p.remove(), 3500);
  }
}

function act(a) {
  if (!a) return;
  if (a.a === "layer") {
    S.layer = a.v;
    S.shift = 0;
    autoShift();
    return render();
  }
  if (a.a === "fxg") return (S.fxg = a.v), render();
  if (a.a === "symg") return (S.symg = a.v), render();
  if (a.a === "hide") return hideKeyboard({ blur: true });
  if (a.a === "globe") return toSystem();
  if (a.a === "sh") {
    const now = Date.now();
    S.shift = S.shift ? (S.shift === 1 && now - S.shiftAt < 350 ? 2 : 0) : 1;
    S.shiftAt = now;
    S.autoShift = false;
    return render();
  }
  const f = target();
  if (!f) return;
  const shiftWas = S.shift;
  const corr = S.corr;
  S.corr = null;
  const lg = S.lastGlide && glideValid(f, S.lastGlide) ? S.lastGlide : null;
  if (a.a !== "gword") S.lastGlide = null;
  if (a.a === "gword") {
    const w = lg && glideCase(a.v, lg.shift);
    if (lg && (f.maxLength < 0 || f.value.length - (lg.end - lg.start) + w.length <= f.maxLength)) {
      f.setRangeText(w, lg.start, lg.end, "end");
      fire(f, "insertReplacementText", w);
      S.lastGlide = { ...lg, end: lg.start + w.length, text: w, cur: a.v };
    }
  } else if (a.a === "bs" && lg) {
    // ⌫ takoj po drsenju zbriše vso drsano besedo (kot Gboard)
    f.setRangeText("", lg.start, lg.end, "end");
    f.setSelectionRange(lg.start, lg.start);
    fire(f, "deleteContentBackward");
  } else if (a.a === "ins") insertText(f, prettyIns(a.v, !!S.cfg.parsed));
  else if (a.a === "lit") insertText(f, a.v, true);
  else if (a.a === "char") {
    const u = a.v.toLocaleUpperCase(currentLang());
    insertText(f, S.shift && u.length === 1 ? u : a.v);
    if (S.shift === 1) S.shift = 0;
  } else if (a.a === "sp") space(f, !!lg);
  else if (a.a === "bs") {
    if (!undoCorrection(f, corr)) backspace(f);
  }
  else if (a.a === "l") moveCaret(f, -1);
  else if (a.a === "r") moveCaret(f, 1);
  else if (a.a === "go") return enter(f);
  else if (a.a === "paste") return paste(f);
  else if (a.a === "chem") {
    const v = chemFormat(f.value);
    if (v !== f.value) {
      f.value = v;
      fire(f, "insertReplacementText");
    }
  } else if (a.a === "unit") {
    f.value = withUnit(f.value, a.v);
    f.setSelectionRange?.(f.value.length, f.value.length);
    fire(f, "insertReplacementText");
  } else if (a.a === "word") {
    const w = currentWord();
    const r = sel(f);
    if (r) {
      f.setRangeText(a.v + " ", r[0] - w.length, r[0], "end");
      fire(f, "insertReplacementText", a.v);
    }
  }
  if (S.layer === "abc") autoShift();
  if (shiftWas !== S.shift) render();
  else renderCtx();
}

// Preslednica kot Gboard: samopopravek zadnje besede (le s predlogi), dva presledka = ». «.
function space(f, afterGlide = false) {
  const b = before();
  const room = f.maxLength < 0 || f.value.length + 1 < f.maxLength; // pika ali popravek dodata znak
  if (b !== null && prose() && room) {
    const ds = S.lastSpace && Date.now() - S.lastSpace < 1500 ? doubleSpaceAt(b) : -1;
    S.lastSpace = 0;
    if (ds >= 0) {
      f.setRangeText(". ", ds, ds + 1, "end");
      return fire(f, "insertText", ". ");
    }
    // sredi besede (za kazalcem so še črke) ne popravljamo
    const w = !afterGlide && prefs.words && words && !/^[\p{L}\p{M}]/u.test(f.value.charAt(b.length)) ? currentWord() : "";
    const fix = w && autocorrect(w, words);
    if (fix) {
      const end = b.length;
      f.setRangeText(fix + " ", end - w.length, end, "end");
      fire(f, "insertReplacementText", fix);
      S.corr = { from: w, to: fix, end: end - w.length + fix.length + 1 };
      return;
    }
  }
  insertText(f, " ");
  S.lastSpace = Date.now();
}
/** ⌫ takoj po samopopravku vrne napisano besedo (kot Gboard). */
function undoCorrection(f, c) {
  const r = c && sel(f);
  if (!r || r[0] !== r[1] || r[0] !== c.end || !f.value.slice(0, c.end).endsWith(c.to + " ")) return false;
  const s = c.end - c.to.length - 1;
  f.setRangeText(c.from, s, c.end, "end");
  fire(f, "insertReplacementText", c.from);
  return true;
}

// ---------- dotik: tipke ne vzamejo fokusa, dolg pritisk, poteg po preslednici, ponavljanje ⌫ ----------

let down = null;
// Povečana tipka nad prstom (kot Gboard), samo črke na dotik.
let prevTimer = 0;
function preview(btn) {
  closePreview();
  const host = board.firstElementChild;
  const r = btn.getBoundingClientRect();
  const br = host.getBoundingClientRect();
  const p = document.createElement("div");
  p.className = "tk-prev";
  p.setAttribute("aria-hidden", "true");
  p.textContent = btn.firstChild?.nodeType === 3 ? btn.firstChild.textContent : btn.textContent;
  const w = r.width + 16;
  const h = Math.round(r.height * 1.15);
  p.style.cssText = `width:${w}px;height:${h}px;left:${Math.round(r.left - br.left - 8)}px;top:${Math.round(r.top - br.top - h - 6)}px`;
  host.appendChild(p);
}
function closePreview(ms = 0) {
  clearTimeout(prevTimer);
  const p = board?.querySelector(".tk-prev");
  if (!p) return;
  if (!ms) return p.remove();
  p.classList.add("out");
  prevTimer = setTimeout(() => p.remove(), ms);
}
function closePop() {
  board?.querySelector(".tk-pop")?.remove();
}
function showPop(btn, base) {
  closePop();
  const vars = varsFor(base);
  if (!vars.length) return false;
  const up = S.shift && base.toLocaleUpperCase(currentLang()).length === 1;
  const list = [base, ...vars].map((v) => (up && v.toLocaleUpperCase().length === 1 ? v.toLocaleUpperCase() : v));
  const pop = document.createElement("div");
  pop.className = "tk-pop";
  pop.setAttribute("role", "group");
  pop.setAttribute("aria-label", t("tk.variants"));
  pop.innerHTML = list.map((v, i) => `<button type="button" data-v="${esc(v)}"${i === 1 ? ' class="on"' : ""}>${esc(v)}</button>`).join("");
  board.firstElementChild.appendChild(pop);
  const r = btn.getBoundingClientRect();
  const br = board.firstElementChild.getBoundingClientRect();
  const w = pop.offsetWidth;
  const left = Math.max(4, Math.min(br.width - w - 4, r.left - br.left + r.width / 2 - w / 2));
  pop.style.left = left + "px";
  pop.style.top = Math.max(0, r.top - br.top - pop.offsetHeight - 4) + "px";
  return true;
}
function popInsert(v) {
  const f = target();
  S.lastGlide = null;
  if (f) insertText(f, v);
  closePop();
  if (S.shift === 1) {
    S.shift = 0;
    render();
  } else renderCtx();
}

function clearTimers() {
  if (!down) return;
  clearTimeout(down.lp);
  clearTimeout(down.rep);
  clearInterval(down.iv);
}

// Sled prsta med drsenjem (kot Gboard: barvna črta, ki bledi); platno znotraj plošče, brez dogodkov dotika.
let trail = null;
const reduceMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
function trailColor() {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const era = root.hasAttribute("data-era") ? cs.getPropertyValue("--menu-accent").trim() : "";
  return era || cs.getPropertyValue("--accent").trim() || "#2563eb";
}
function trailStart() {
  trailEnd(true);
  const host = board.firstElementChild;
  const br = host.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cv = document.createElement("canvas");
  cv.className = "tk-trail";
  cv.setAttribute("aria-hidden", "true");
  cv.width = Math.max(1, Math.round(br.width * dpr));
  cv.height = Math.max(1, Math.round(br.height * dpr));
  host.appendChild(cv);
  trail = { cv, g: cv.getContext("2d"), pts: [], dpr, br, color: trailColor(), raf: 0, live: true, reduced: reduceMotion() };
  const loop = () => {
    if (!trail || trail.cv !== cv || !trail.live) return;
    trailDraw();
    trail.raf = requestAnimationFrame(loop);
  };
  trail.raf = requestAnimationFrame(loop);
}
function trailAdd(x, y) {
  if (!trail) return;
  trail.pts.push({ x: x - trail.br.left, y: y - trail.br.top, t: performance.now() });
}
function trailDraw(tr = trail) {
  const { g, cv, pts, dpr, color, reduced } = tr;
  const now = performance.now();
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, cv.width, cv.height);
  g.lineCap = "round";
  g.lineJoin = "round";
  g.strokeStyle = color;
  for (let i = 1; i < pts.length; i++) {
    const a = reduced ? 1 : Math.max(0, 1 - (now - pts[i].t) / 600); // starejši del sledi bledi
    if (a <= 0) continue;
    g.globalAlpha = 0.75 * a;
    g.lineWidth = reduced ? 8 : 3 + 7 * a;
    g.beginPath();
    g.moveTo(pts[i - 1].x, pts[i - 1].y);
    g.lineTo(pts[i].x, pts[i].y);
    g.stroke();
  }
  g.globalAlpha = 1;
}
/** Konec drsenja: sled ~200 ms zbledi (pri zmanjšanem gibanju takoj izgine). */
let fading = null; // platno, ki še bledi (render() ga ohrani)
function trailEnd(now = false) {
  fading?.remove();
  fading = null;
  const tr = trail;
  if (!tr) return;
  trail = null;
  tr.live = false;
  cancelAnimationFrame(tr.raf);
  if (now || tr.reduced) return tr.cv.remove();
  const cv = tr.cv;
  trailDraw(tr);
  fading = cv;
  cv.getBoundingClientRect(); // začetno stanje, da prehod steče
  cv.classList.add("out");
  setTimeout(() => {
    cv.remove();
    if (fading === cv) fading = null;
  }, 220);
}

function wireBoard() {
  board.addEventListener("pointerdown", (e) => {
    e.preventDefault(); // polje obdrži fokus
    const b = e.target.closest("button");
    if (!b || !board.contains(b)) return;
    if (b.closest(".tk-pop")) return;
    if (!b.dataset.k) return;
    closePop();
    clearTimers();
    const a = keys[Number(b.dataset.k)];
    down = { b, a, x: e.clientX, x0: e.clientX, moved: false, pop: false, pts: [{ x: e.clientX, y: e.clientY }], len: 0, glide: false, kw: b.getBoundingClientRect().width };
    b.classList.add("down");
    if (b.classList.contains("tk-k")) buzz();
    if (a?.a === "char" && e.pointerType !== "mouse") preview(b);
    if (a?.a === "sp") {
      try {
        b.setPointerCapture(e.pointerId);
      } catch {}
    } else if (a?.a === "char" && varsFor(a.v).length) {
      down.lp = setTimeout(() => {
        if (down?.b === b) {
          down.pop = showPop(b, a.v);
          if (down.pop) closePreview();
        }
      }, 380);
    } else if (a?.a === "bs" || a?.a === "l" || a?.a === "r") {
      // držanje ⌫, ← ali → ponavlja (briše ali premika kazalec, dokler je prst na tipki)
      try {
        b.setPointerCapture(e.pointerId);
      } catch {}
      down.rep = setTimeout(() => {
        down.moved = true;
        act(a);
        down.iv = setInterval(() => act(a), 75);
      }, 450);
    }
  });
  board.addEventListener("mousedown", (e) => e.preventDefault());
  window.addEventListener("blur", clearTimers);
  board.addEventListener("pointermove", (e) => {
    if (!down) return;
    if (down.a?.a === "char" && !down.pop && /^\p{L}$/u.test(down.a.v) && glideOn()) {
      // poteg čez črke = drsenje: pot ≥ 2 širini tipke ali ≥ 0,6 širine stran od začetne tipke in nad drugo črko
      const last = down.pts[down.pts.length - 1];
      if (e.clientX === last.x && e.clientY === last.y) return;
      down.len += Math.hypot(e.clientX - last.x, e.clientY - last.y);
      down.pts.push({ x: e.clientX, y: e.clientY });
      if (!down.glide) {
        const p0 = down.pts[0];
        const over = document.elementFromPoint(e.clientX, e.clientY)?.closest("button[data-k]");
        const oa = over && over !== down.b ? keys[Number(over.dataset.k)] : null;
        const away = Math.hypot(e.clientX - p0.x, e.clientY - p0.y) > 0.6 * down.kw && oa?.a === "char" && /^\p{L}$/u.test(oa.v);
        if (!(down.len >= 2 * down.kw || away)) return;
        down.glide = true;
        down.moved = true;
        clearTimers();
        closePreview();
        closePop();
        down.b.classList.remove("down");
        try {
          down.b.setPointerCapture(e.pointerId);
        } catch {}
        loadGlide();
        trailStart();
        for (const p of down.pts) trailAdd(p.x, p.y);
      } else trailAdd(e.clientX, e.clientY);
      return;
    }
    if (down.a?.a === "sp") {
      const dx = e.clientX - down.x;
      if (Math.abs(dx) >= 12) {
        const f = target();
        if (f) moveCaret(f, Math.sign(dx) * (layoutFor(currentLang()).rtl && S.layer === "abc" ? -1 : 1));
        down.x = e.clientX;
        down.moved = true;
      }
    } else if (down.a?.a === "bs") {
      // Poteg levo po ⌫ označi besede, dvig prsta jih izbriše (kot Gboard); nazaj desno prekliče.
      const n = Math.floor((down.x0 - e.clientX) / 36);
      const f = S.field;
      const r = f && !f.isContentEditable && sel(f);
      if (!r || (!down.swipe && n < 1)) return;
      if (!down.swipe) {
        clearTimers();
        down.swipe = true;
        down.moved = true;
        down.at = r[1];
      }
      const from = n > 0 ? wordsBack(f.value, down.at, n) : down.at;
      f.setSelectionRange(from, down.at);
    } else if (down.pop) {
      // izbrana ostane zadnja različica pod prstom (na začetku prva, kot Gboard)
      const over = document.elementFromPoint(e.clientX, e.clientY)?.closest(".tk-pop button");
      if (over) board.querySelectorAll(".tk-pop button").forEach((x) => x.classList.toggle("on", x === over));
    }
  });
  // Dejanje ob dvigu prsta nad isto tipko (ne čakamo na »click«, ki ga telefon po potegu včasih ne pošlje).
  const up = (e) => {
    const at = e.type === "pointerup" ? document.elementFromPoint(e.clientX, e.clientY) : null;
    if (!down) {
      const pb = at?.closest(".tk-pop button");
      if (pb && e.type === "pointerup") popInsert(pb.dataset.v);
      return;
    }
    clearTimers();
    const d = down;
    down = null;
    d.b.classList.remove("down");
    closePreview(70);
    if (d.glide) {
      if (e.type === "pointerup") {
        trailAdd(e.clientX, e.clientY);
        d.pts.push({ x: e.clientX, y: e.clientY });
        const centers = {};
        for (const k of board.querySelectorAll(".tk-rows button[data-k]")) {
          const a = keys[Number(k.dataset.k)];
          if (a?.a !== "char" || !/^\p{L}$/u.test(a.v)) continue;
          const r = k.getBoundingClientRect();
          centers[a.v] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
        finishGlide(d.pts, centers);
      }
      trailEnd();
      return;
    }
    if (d.swipe) {
      const f = S.field;
      const r = f && sel(f);
      if (e.type === "pointerup" && r && r[0] !== r[1]) act(d.a);
      return;
    }
    if (e.type !== "pointerup") return;
    // Na dotik po »touchend« (spodaj): tipka mora biti takrat še v tipkovnici, da se klik prekliče.
    const run = (fn) => (e.pointerType === "touch" ? setTimeout(fn, 0) : fn());
    if (d.pop) {
      const v = at?.closest(".tk-pop button") || board.querySelector(".tk-pop button.on");
      if (v) run(() => popInsert(v.dataset.v));
      return;
    }
    if (d.moved || at?.closest("button") !== d.b) return;
    closePop();
    run(() => act(d.a));
  };
  board.addEventListener("pointerup", up);
  board.addEventListener("pointercancel", up);
  board.addEventListener("contextmenu", (e) => e.preventDefault());
  // Dejanje je že ob dvigu prsta; telefonov »click« (in miškini dogodki) za tem bi zadel, kar je pod
  // tipkovnico, ko se ta skrije ali spremeni višino (⌄, Preveri, druga plast), npr. vrstico kalkulatorja.
  board.addEventListener("touchend", (e) => e.cancelable && e.preventDefault(), { passive: false });
  board.addEventListener("click", (e) => {
    const pb = e.target.closest(".tk-pop button");
    if (e.detail > 0) return; // dotik in miška: obdelano ob dvigu (pointerup); tukaj samo Enter/preslednica na tipki
    if (pb) return popInsert(pb.dataset.v);
    const b = e.target.closest("button[data-k]");
    closePop();
    if (b) act(keys[Number(b.dataset.k)]);
  });
}

// ---------- vklop ----------

let inited = false;
let lastTap = { t: 0, el: null };
/** Poveže tipkovnico z vsemi polji (enkrat; kličejo app.js, kalkulator in plošča). */
export function initKeyboard() {
  if (inited || typeof document === "undefined") return;
  inited = true;
  board = document.createElement("div");
  board.id = "tipkovnica";
  board.className = "tk";
  board.hidden = true;
  board.setAttribute("role", "group");
  board.setAttribute("aria-label", t("tk.label"));
  document.body.appendChild(board);
  wireBoard();
  new ResizeObserver(() => {
    if (S.open) document.documentElement.style.setProperty("--tk-h", board.offsetHeight + "px");
  }).observe(board);
  // Tipkovnica sedi na dnu vidnega dela: če brskalnik spodaj prekrije stran (npr. spodnja vrstica naslova), se dvigne nad to.
  const vv = window.visualViewport;
  if (vv) {
    let zadnji = -1;
    const sedi = () => {
      const pod = Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop));
      // večji odmik pomeni odprto sistemsko tipkovnico (npr. 🌐), takrat ne premikamo
      const v = pod < 120 ? pod : 0;
      if (v !== zadnji) document.documentElement.style.setProperty("--tk-vv", (zadnji = v) + "px"); // ob drsenju le ob spremembi
    };
    vv.addEventListener("resize", sedi);
    vv.addEventListener("scroll", sedi);
    sedi();
  }
  // Nikoli dve tipkovnici hkrati: če se odpre telefonova (zaslon se skrajša za več kot 150 px), se naša skrije.
  // Le ob krčenju (telefonova se zapira = zaslon raste) in brez povečave s prsti (vv.height × scale).
  let polna = innerHeight, sirina = innerWidth, prej = innerHeight;
  addEventListener("resize", () => {
    const h = Math.min(innerHeight, vv ? vv.height * (vv.scale || 1) : innerHeight);
    const krci = h < prej - 1;
    prej = h;
    if (innerWidth !== sirina) { sirina = innerWidth; polna = innerHeight; return; } // obrat zaslona
    polna = Math.max(polna, innerHeight);
    if (krci && polna - h > 150 && S.open && touch()) hideKeyboard();
  });

  document.addEventListener(
    "pointerdown",
    (e) => {
      if (board.contains(e.target)) return;
      if (S.sys && !scopeOf(S.sys).contains(e.target)) {
        const f = S.sys;
        S.sys = null;
        if (autoEligible(f)) prepare(f);
      }
      const f = textField(e.target);
      if (f && autoEligible(f)) prepare(f); // pred fokusom: telefonova tipkovnica se ne odpre
      lastTap = { t: Date.now(), el: e.target };
      setTimeout(checkGone, 0);
    },
    true,
  );
  document.addEventListener(
    "click",
    (e) => {
      const f = textField(e.target);
      if (f && !S.open && autoEligible(f)) openKeyboard(f);
    },
    true,
  );
  document.addEventListener("focusin", (e) => {
    const f = textField(e.target);
    if (!f || f === S.sys) return;
    if (!S.open) {
      if (!autoEligible(f)) return;
      prepare(f);
      // Fokus iz dotika (oznaka, vrstica kalkulatorja, ki odpre urejanje), ne iz kode ali gumba.
      if (Date.now() - lastTap.t < 600 && !lastTap.el?.closest?.("button, a, [role='button'], [role='option'], select")) openKeyboard(f);
      return;
    }
    if (f === S.field) return;
    numShadow.delete(f);
    if (autoEligible(f) || (S.explicit && fieldKind(f, orig(f)) && !isOwn(f))) openKeyboard(f);
    else hideKeyboard(); // geslo, e-pošta, polje s svojimi tipkami: telefonova tipkovnica
  });
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape" && S.open) {
        hideKeyboard();
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true,
  );
  // Nastavitev iz klepeta z inštruktorjem (public/chat-settings.js).
  window.addEventListener("evklid:device-setting", (e) => {
    const { key: k, value } = e.detail || {};
    if (k === "keyboard" && MODES.includes(value)) prefs.mode = value;
    else if (k === "keyboard_words") prefs.words = value === "on";
    else if (k === "keyboard_vibration") prefs.buzz = value === "on";
    else if (k === "keyboard_glide") prefs.glide = value === "on";
    else return;
    syncSettings();
    if (S.open && !S.explicit && !autoEligible(S.field)) hideKeyboard();
  });
}

// Odhod z zaslona: polje je izginilo (nova stran, zaprto okno) in fokus ni v drugem našem polju.
function checkGone() {
  if (!S.open) return;
  if (visible(S.field)) return;
  const a = textField(document.activeElement);
  if (a && (autoEligible(a) || S.explicit)) return openKeyboard(a);
  hideKeyboard();
}

// ---------- Nastavitve → Vnos ----------

let settingsBox = null;
function syncSettings() {
  if (!settingsBox) return;
  const sel = settingsBox.querySelector("#tk-mode");
  if (sel && sel.value !== prefs.mode) sel.value = prefs.mode;
  const w = settingsBox.querySelector("#tk-words");
  if (w) w.checked = prefs.words;
  const b = settingsBox.querySelector("#tk-buzz");
  if (b) b.checked = prefs.buzz;
  const gl = settingsBox.querySelector("#tk-glide");
  if (gl) gl.checked = prefs.glide;
}
export function mountKeyboardSettings(box) {
  if (!box) return;
  settingsBox = box;
  box.hidden = false;
  box.innerHTML = `<h2>${esc(t("tk.set.title"))}</h2>
    <div class="form tk-set">
      <label><span>${esc(t("tk.label"))}</span>
        <select id="tk-mode">${MODES.map((m) => `<option value="${m}"${prefs.mode === m ? " selected" : ""}>${esc(t(`tk.set.${m}`))}</option>`).join("")}</select>
        <small class="muted">${esc(t("tk.set.modeNote"))}</small>
      </label>
    </div>
    <div class="tk-set-checks">
      <label class="check-row"><input type="checkbox" id="tk-words"${prefs.words ? " checked" : ""}><span><b>${esc(t("tk.set.words"))}</b><small class="muted">${esc(t("tk.set.wordsNote"))}</small></span></label>
      <label class="check-row"><input type="checkbox" id="tk-glide"${prefs.glide ? " checked" : ""}><span><b>${esc(t("tk.set.glide"))}</b><small class="muted">${esc(t("tk.set.glideNote"))}</small></span></label>
      <label class="check-row"><input type="checkbox" id="tk-buzz"${prefs.buzz ? " checked" : ""}><span><b>${esc(t("tk.set.buzz"))}</b><small class="muted">${esc(t("tk.set.buzzNote"))}</small></span></label>
    </div>`;
  box.querySelector("#tk-mode").addEventListener("change", (e) => {
    prefs.mode = MODES.includes(e.target.value) ? e.target.value : "always";
    savePrefs();
  });
  box.querySelector("#tk-words").addEventListener("change", (e) => {
    prefs.words = e.target.checked;
    savePrefs();
    if (prefs.words) loadWords();
  });
  box.querySelector("#tk-glide").addEventListener("change", (e) => {
    prefs.glide = e.target.checked;
    savePrefs();
    if (prefs.glide) loadGlide();
    else S.lastGlide = null;
  });
  box.querySelector("#tk-buzz").addEventListener("change", (e) => {
    prefs.buzz = e.target.checked;
    savePrefs();
  });
}
