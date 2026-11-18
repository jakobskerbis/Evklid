// Oznaka »pogovarjaš se z umetno inteligenco, ne s človekom« (EU AI Act, čl. 50(1); j 18. 11. 2026).
// Klepet: stalna opomba pod poljem za vnos (.ai-note), znak »AI« v glavi in ob prvem pogovoru prijazno obvestilo
// (enkrat na profil, »Razumem«). Skener, ustno spraševanje in zapiski pokažejo isto opombo ob besedilu AI.
// Besedilo je prilagojeno starosti: OŠ 1.–5. razred preprosteje (»računalniški pomočnik«).
// Strojno berljiva oznaka (čl. 50(2)): data-ai-generated="true" na besedilu AI (in ai_generated v odgovorih API,
// server/ai-oznaka.js). Modul se naloži z import() ob odprtju klepeta: prvo odprtje aplikacije ne raste.
import { t as tGlobal, currentLang, srToLatin } from "../i18n.js";
import { uiChain, UI_LANGUAGES } from "../i18n/languages.js";
import { mlad } from "./mlad.js";
import { icon } from "../icons.js";
import { zavrzi } from "../odgovor.js";
import SL from "./sl.js";

const KEY = "evklid.aiObvestilo"; // + ».<id profila>«: vsak profil na napravi vidi obvestilo enkrat
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export { mlad };

let dicts = [SL];
let dictsLang = "sl";
let loading = null;
/** Naloži prevode za izbrani jezik (enkrat na jezik). */
export function nalozi() {
  const lang = currentLang();
  if (dictsLang === lang) return Promise.resolve();
  if (loading?.lang === lang) return loading.p;
  const chain = uiChain(lang);
  const want = chain.slice(0, Math.max(0, chain.indexOf("sl")));
  const p = Promise.all(
    want.map(async (code) => {
      const file = code === "sr-Latn" ? "sr" : code;
      if (!UI_LANGUAGES.includes(file)) return null;
      try {
        const res = await fetch(`/ai-oznaka/i18n/${file}.json`);
        if (!res.ok) return zavrzi(res), null;
        const d = await res.json();
        return code === "sr-Latn" ? Object.fromEntries(Object.entries(d).map(([k, v]) => [k, srToLatin(v)])) : d;
      } catch {
        return null;
      }
    }),
  ).then((ds) => {
    dicts = [...ds.filter(Boolean), SL];
    dictsLang = lang;
  });
  loading = { lang, p };
  return p;
}
export function tt(key) {
  for (const d of dicts) if (d[key] !== undefined) return d[key];
  return tGlobal(key);
}

/** Besedilo opombe: vrsta »klepet« | »resitev« (skener) | »ocena« (ustno) | »prepis« (zapiski). */
export function besedilo(settings, vrsta = "klepet") {
  if (mlad(settings)) return tt("aio.mlad");
  return tt({ resitev: "aio.resitev", ocena: "aio.ocena", prepis: "aio.prepis" }[vrsta] || "aio.star");
}
/** Opomba pod besedilom AI (HTML); kliči po nalozi(). */
export const opombaHtml = (settings, vrsta) => `<p class="aio-opomba" role="note">${icon("bot")}<span>${esc(besedilo(settings, vrsta))}</span></p>`;
export const opomba = async (settings, vrsta) => (await nalozi(), opombaHtml(settings, vrsta));

const CSS = `
.aio-opomba { display: flex; gap: 6px; align-items: flex-start; margin: 8px 0 0; font-size: 0.8rem; line-height: 1.35; color: var(--muted); }
.aio-opomba svg { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; }
.aio-znak { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; min-width: 26px; height: 20px; padding: 0 5px; border-radius: 6px; border: 1px solid var(--border); color: var(--muted); font: 700 0.68rem/1 system-ui, sans-serif; letter-spacing: 0.03em; cursor: default; }
.aio-uvod { box-sizing: border-box; width: 100%; flex-shrink: 0; display: flex; flex-wrap: wrap; gap: 10px 12px; align-items: flex-start; margin: 0 auto 12px; max-width: 640px; padding: 12px 14px; border-radius: 14px; border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border)); background: color-mix(in srgb, var(--accent) 8%, var(--surface)); color: var(--text); }
.aio-uvod > svg { width: 22px; height: 22px; flex-shrink: 0; color: var(--accent); margin-top: 2px; }
.aio-uvod > div { flex: 1 1 200px; min-width: 0; }
.aio-uvod p { margin: 0; font-size: 0.92rem; line-height: 1.45; }
.aio-uvod p + p { margin-top: 4px; }
.aio-uvod button { margin-inline-start: auto; min-height: 40px !important; }
`;
function css() {
  if (document.getElementById("aio-css")) return;
  const s = document.createElement("style");
  s.id = "aio-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

const ls = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};

/** Klepet z inštruktorjem: opomba pod poljem, znak v glavi in obvestilo ob prvem pogovoru tega profila. */
export async function oznaciKlepet(student, root = document) {
  if (!student) return;
  await nalozi();
  css();
  const s = student.settings || {};
  const young = mlad(s);
  const note = root.querySelector("#composer .ai-note");
  if (note) {
    note.removeAttribute("data-i18n"); // applyI18n() je ne vrne na splošno besedilo
    note.textContent = besedilo(s);
  }
  const title = root.querySelector("#chat-title");
  if (title) {
    let znak = root.querySelector(".chat-head .aio-znak");
    if (!znak) {
      znak = document.createElement("span");
      znak.className = "aio-znak";
      znak.setAttribute("role", "img");
      znak.textContent = "AI";
      title.after(znak);
    }
    znak.title = tt("aio.znak");
    znak.setAttribute("aria-label", tt("aio.znak"));
  }
  const box = root.querySelector("#messages");
  const key = `${KEY}.${student.id}`;
  if (!box || ls.get(key)) return;
  box.querySelector(".aio-uvod")?.remove();
  const el = document.createElement("div");
  el.className = "aio-uvod";
  el.setAttribute("role", "note");
  el.innerHTML = `${icon("bot")}<div><p><strong>${esc(tt(young ? "aio.uvodMlad" : "aio.uvodStar"))}</strong></p><p>${esc(tt(young ? "aio.opisMlad" : "aio.opisStar"))}</p></div><button type="button" class="secondary small">${esc(tt("aio.razumem"))}</button>`;
  el.querySelector("button").addEventListener("click", () => {
    ls.set(key, "1");
    el.remove();
    root.querySelector("#input")?.focus();
  });
  box.prepend(el);
}
