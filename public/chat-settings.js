// Nastavitve iz klepeta na strani odjemalca (strežnik: server/chat-settings.js).
// - deviceSnapshot(): nastavitve te naprave, ki jih sporočilo pošlje inštruktorju (get_settings).
// - applyDeviceSettings(): uporabi spremembe, ki jih je inštruktor naredil (videz, hitrost, kalkulator …).
// - addProposal(): kartica »Spremenim šolo in letnik?« pod odgovorom inštruktorja.
import { icon } from "./icons.js";
import { t } from "./i18n.js";
import { DEVICE_SETTINGS } from "./settings-registry.js";
import { levelLabel } from "./level-picker.js";
import { PREF_KEY, parsePrefs } from "./tipkovnica-data.js";

const get = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const set = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};
const padPrefs = () => {
  try {
    return JSON.parse(get("evklid.pad")) || {};
  } catch {
    return {};
  }
};
// Evklidova tipkovnica (public/tipkovnica-data.js): { mode, words, buzz, glide }.
const kbPrefs = () => parsePrefs(get(PREF_KEY));
const KB_KEYS = { keyboard: "mode", keyboard_words: "words", keyboard_vibration: "buzz", keyboard_glide: "glide" };
// Imena barv iz nastavitev → deli palete v theme.js.
const PART = { color_background: "bg", color_windows: "surface", color_menus: "menu", color_text: "text" };

export function deviceSnapshot() {
  const out = {};
  const T = window.STEMTheme;
  if (T) {
    const s = T.load();
    out.style = s.style;
    out.theme = s.mode;
    if (s.accent) out.accent = s.accent;
    const pal = s[T.isDarkMode(s) ? "dark" : "light"] || {};
    for (const [key, part] of Object.entries(PART)) if (pal[part]) out[key] = pal[part];
  }
  for (const [key, def] of Object.entries(DEVICE_SETTINGS)) {
    if (!def.ls) continue;
    const raw = get(def.ls[0]);
    if (raw === null) continue;
    const map = def.ls[1];
    const v = map ? Object.keys(map).find((k) => map[k] === raw) : raw;
    if (v && def.values.includes(v)) out[key] = v;
  }
  const pad = padPrefs();
  if (pad.auto !== undefined) out.writing_pad = pad.auto ? "auto" : "off";
  if (pad.tab) out.writing_pad_tab = pad.tab;
  const kb = kbPrefs();
  // samo, kar ni privzeto (privzeto piše v opisu nastavitve; manj besedila za inštruktorja)
  if (kb.mode !== "always") out.keyboard = kb.mode;
  if (kb.words) out.keyboard_words = "on";
  if (!kb.buzz) out.keyboard_vibration = "off";
  if (!kb.glide) out.keyboard_glide = "off";
  return out;
}

export function applyDeviceSettings(changes = {}) {
  const T = window.STEMTheme;
  const themeKeys = ["style", "theme", "accent", "colors", ...Object.keys(PART)];
  if (T && themeKeys.some((k) => changes[k])) {
    const s = T.load();
    if (changes.style) Object.assign(s, { style: changes.style, accent: null });
    if (changes.theme) s.mode = changes.theme;
    const key = T.isDarkMode(s) ? "dark" : "light";
    if (changes.colors === "default") Object.assign(s, { accent: null, light: null, dark: null });
    if (changes.colors === "random") {
      const r = T.randomPalette(s);
      if (r.pal) Object.assign(s, { [key]: r.pal, accent: r.accent });
    }
    for (const [name, part] of Object.entries(PART)) if (changes[name]) s[key] = { ...(s[key] || {}), [part]: changes[name] };
    if (changes.accent === "default") s.accent = null;
    else if (changes.accent === "random") s.accent = T.randomAccent(s);
    else if (changes.accent) s.accent = changes.accent;
    T.save(s);
  }
  for (const [key, value] of Object.entries(changes)) {
    const def = DEVICE_SETTINGS[key];
    if (!def) continue;
    if (def.ls) set(def.ls[0], def.ls[1] ? def.ls[1][value] : value);
    if (key === "writing_pad" || key === "writing_pad_tab") {
      const p = padPrefs();
      if (key === "writing_pad") p.auto = value === "auto";
      else p.tab = value;
      set("evklid.pad", JSON.stringify(p));
    }
    if (KB_KEYS[key]) {
      const p = kbPrefs();
      p[KB_KEYS[key]] = key === "keyboard" ? value : value === "on";
      set(PREF_KEY, JSON.stringify(p));
    }
    // Moduli, ki imajo vrednost v pomnilniku (kalkulator, plošča, cel zaslon), se odzovejo na dogodek.
    window.dispatchEvent(new CustomEvent("evklid:device-setting", { detail: { key, value } }));
  }
}

function describe(d) {
  const track = { OSNOVNA_SOLA: t("lp.os"), SREDNJA_SOLA: t("lp.ss"), UNIVERZA: t("lp.uni") }[d.track];
  return [d.system, d.system ? null : track, levelLabel(d.level), d.program].filter(Boolean).join(" · ");
}

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// onConfirm(settings) shrani spremembo; vrne obljubo. Kartica nato pokaže izid.
export function addProposal(bubble, proposal, { onConfirm }) {
  if (!bubble || !proposal?.settings) return null;
  const el = document.createElement("div");
  el.className = "set-proposal";
  el.innerHTML = `<div class="sp-head">${icon("settings")} <b>${t("chat.setAsk")}</b></div>
    <p class="sp-change"><span class="muted" dir="auto">${esc(describe(proposal.from))}</span> ${icon("arrow-right", "sp-arrow")} <b dir="auto">${esc(describe(proposal.to))}</b></p>
    <div class="actions"><button type="button" class="primary sp-yes">${icon("check")}${t("chat.setYes")}</button><button type="button" class="secondary sp-no">${t("chat.setNo")}</button></div>`;
  const done = (msg, ok) => {
    el.querySelector(".actions").outerHTML = `<p class="sp-result${ok ? " ok" : ""}">${ok ? icon("check") : ""}${esc(msg)}</p>`;
  };
  el.querySelector(".sp-yes").addEventListener("click", async (e) => {
    e.currentTarget.disabled = true;
    try {
      await onConfirm(proposal.settings);
      done(t("chat.setDone"), true);
    } catch (err) {
      e.currentTarget.disabled = false;
      el.querySelector(".sp-result")?.remove();
      el.insertAdjacentHTML("beforeend", `<p class="sp-result">${esc(err.message)}</p>`);
    }
  });
  el.querySelector(".sp-no").addEventListener("click", () => done(t("chat.setKept"), false));
  bubble.appendChild(el);
  return el;
}
