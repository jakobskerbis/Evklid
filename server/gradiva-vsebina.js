// Napisana gradiva ob temi (docs/gradiva.md): domači poskus, projekt iz resničnega življenja in kratek
// video iz obstoječe simulacije. Vsako je ena datoteka content/gradiva/<vrsta>/<POT>/<tema>.md,
// ki jo napiše in trikrat pregleda Opus ali Fable (kot lekcije). Brez datoteke gradiva ni.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";
import { getTopic, getPath } from "./curriculum.js";
import { parseLesson } from "./textbook.js";
import { renderMd, shell } from "./textbook-print.js";
import { speakMarkdown } from "./govor.js";
import { checkIdentities } from "./lesson-identity.js";
import { ENGINES } from "../public/sim/index.js";

export const GRADIVA_DIR = process.env.EVKLID_GRADIVA || path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "gradiva");

// Obvezni razdelki (## naslov) in polja v glavi za vsako vrsto.
export const FORMATS = {
  poskus: { meta: ["naslov", "cas", "odrasli", "avtor", "stanje"], sections: ["Varnost", "Potrebuješ", "Postopek", "Kaj opaziš", "Zakaj", "Vprašanje"] },
  projekt: { meta: ["naslov", "cas", "avtor", "stanje"], sections: ["Izziv", "Potrebuješ", "Koraki", "Kaj oddaš", "Merila"] },
  video: { meta: ["naslov", "simulacija", "trajanje", "avtor", "stanje"], sections: [] },
};
const VRSTE = Object.keys(FORMATS);
const ID_RE = /^[A-Z0-9-]+\/[a-z0-9-]+$/;

const fileOf = (vrsta, topicId) => (Object.hasOwn(FORMATS, vrsta) && ID_RE.test(topicId) ? path.join(GRADIVA_DIR, vrsta, `${topicId}.md`) : null);

const cache = new Map();
export function loadGradivo(vrsta, topicId) {
  const file = fileOf(vrsta, topicId);
  if (!file) return null;
  let st;
  try {
    st = fs.statSync(file);
  } catch {
    return null;
  }
  const hit = cache.get(file);
  if (hit && hit.mtime === st.mtimeMs) return hit.g;
  const g = parseGradivo(vrsta, fs.readFileSync(file, "utf8"));
  cache.set(file, { mtime: st.mtimeMs, g });
  return g;
}

export const hasGradivo = (vrsta, topicId) => !!fileOf(vrsta, topicId) && fs.existsSync(fileOf(vrsta, topicId));
export const gradivaFor = (topicId) => VRSTE.filter((v) => hasGradivo(v, topicId));

// »1:30« → 90 s
export const seconds = (s) => {
  const m = /^(\d{1,2}):([0-5]\d)$/.exec(String(s || "").trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

export function parseGradivo(vrsta, src) {
  const { meta, sections } = parseLesson(src);
  const g = { vrsta, meta, sections: sections.filter((x) => x.title) };
  if (vrsta === "video") {
    // Prizor: »## 0:12«, besedilo (podnapis, ki se tudi prebere) in vrstice »- nastavi: Oznaka = vrednost«, »- klikni: Gumb«.
    g.scenes = g.sections
      .map((x) => {
        const actions = [];
        const text = x.md
          .split("\n")
          .filter((line) => {
            const a = /^\s*-\s*(nastavi|klikni)\s*:\s*(.+?)\s*$/i.exec(line);
            if (!a) return true;
            if (a[1].toLowerCase() === "klikni") actions.push({ do: "click", target: a[2] });
            else {
              // Brez »=« ni vrednosti (checkGradivo to javi), oznaka ostane cela.
              const eq = a[2].lastIndexOf("=");
              actions.push(eq < 0 ? { do: "set", target: a[2], value: "" } : { do: "set", target: a[2].slice(0, eq).trim(), value: a[2].slice(eq + 1).trim() });
            }
            return false;
          })
          .join("\n")
          .trim();
        return { t: seconds(x.title), md: text, actions };
      });
    g.duration = seconds(meta.trajanje);
  }
  return g;
}

// Napake oblike (scripts/check-gradivo.js in testi). Vrne seznam besedil; prazen seznam = v redu.
export function checkGradivo(vrsta, src, topicId = null) {
  if (!Object.hasOwn(FORMATS, vrsta)) return [`neznana vrsta ${vrsta}`];
  const f = FORMATS[vrsta];
  const errs = [];
  const g = parseGradivo(vrsta, src);
  if (topicId && !getTopic(topicId)) errs.push(`tema ${topicId} ne obstaja`);
  for (const k of f.meta) if (!g.meta[k]) errs.push(`manjka polje »${k}« v glavi`);
  if (g.meta.stanje && !["osnutek", "pregledano"].includes(g.meta.stanje)) errs.push("stanje mora biti osnutek ali pregledano");
  if (g.meta.avtor && g.meta.avtor !== "AI") errs.push("avtor: AI (nikoli ime modela)");
  const titles = g.sections.map((x) => x.title);
  for (const s of f.sections) {
    const sec = g.sections.find((x) => x.title === s);
    if (!sec) errs.push(`manjka razdelek »## ${s}«`);
    else if (!sec.md.trim()) errs.push(`razdelek »${s}« je prazen`);
  }
  if (vrsta !== "video") {
    for (const t of titles) if (!f.sections.includes(t)) errs.push(`nepričakovan razdelek »## ${t}«`);
    for (const t of new Set(titles)) if (titles.filter((x) => x === t).length > 1) errs.push(`razdelek »## ${t}« je dvakrat`);
    const order = titles.filter((t) => f.sections.includes(t));
    const want = f.sections.filter((t) => order.includes(t));
    if (order.join("|") !== want.join("|")) errs.push(`razdelki naj bodo v vrstnem redu: ${f.sections.join(", ")}`);
  }
  if (vrsta === "poskus") {
    if (g.meta.odrasli && !["da", "ne"].includes(g.meta.odrasli)) errs.push("odrasli: da ali ne");
    const need = g.sections.find((x) => x.title === "Potrebuješ")?.md || "";
    if (!/^\s*-\s+\S/m.test(need)) errs.push("»Potrebuješ« naj bo seznam (- …)");
    const steps = g.sections.find((x) => x.title === "Postopek")?.md || "";
    if (!/^\s*1\.\s+\S/m.test(steps)) errs.push("»Postopek« naj bo oštevilčen seznam (1. …)");
    const q = g.sections.find((x) => x.title === "Vprašanje")?.md || "";
    if (q && !/^>\s*Odgovor\s*:\s*\S/m.test(q)) errs.push("»Vprašanje« naj ima vrstico »> Odgovor: …«");
    else if (q && !q.split(/^>/m)[0].trim()) errs.push("»Vprašanje« nima vprašanja pred odgovorom");
  }
  if (vrsta === "video") {
    if (g.meta.simulacija && !Object.hasOwn(ENGINES, g.meta.simulacija)) errs.push(`simulacija »${g.meta.simulacija}« ne obstaja`);
    if (g.meta.moznosti) {
      try {
        const o = JSON.parse(g.meta.moznosti);
        if (!o || typeof o !== "object" || Array.isArray(o)) throw new Error();
      } catch {
        errs.push("moznosti naj bodo JSON, npr. {\"mode\": \"uporniki\"}");
      }
    }
    if (g.duration == null || g.duration < 45 || g.duration > 150) errs.push("trajanje naj bo med 0:45 in 2:30 (m:ss)");
    if (!g.scenes.length) errs.push("video nima prizorov (## 0:00 …)");
    let prev = -1;
    for (const sc of g.scenes) {
      if (sc.t == null) errs.push("naslov prizora naj bo čas m:ss");
      else if (sc.t <= prev) errs.push(`prizor ${sc.t} s ni za prejšnjim`);
      else if (g.duration != null && sc.t >= g.duration) errs.push(`prizor ${sc.t} s je po koncu videa`);
      if (sc.t != null) prev = sc.t;
      if (!sc.md) errs.push(`prizor ${sc.t ?? "?"} s nima besedila`);
      if (sc.md.length > 260) errs.push(`besedilo prizora ${sc.t} s je predolgo (največ 260 znakov, en ali dva stavka)`);
      for (const a of sc.actions) if (a.do === "set" && a.value === "") errs.push(`prizor ${sc.t} s: nastavi brez vrednosti (- nastavi: oznaka = vrednost)`);
      // Alineja v podnapisu je skoraj vedno zatipkano dejanje (»- nastvai: …«); predvajalnik bi jo prebral.
      if (/^\s*[-*+]\s/m.test(sc.md)) errs.push(`prizor ${sc.t ?? "?"} s: alineja v besedilu (dejanja so le »- nastavi:« in »- klikni:«)`);
    }
    if (g.scenes[0] && g.scenes[0].t !== 0) errs.push("prvi prizor naj bo ob 0:00");
  }
  // Formule morajo izrisati brez napake.
  for (const m of src.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
    try {
      katex.renderToString(m[1] || m[2], { throwOnError: true, strict: "ignore" });
    } catch (e) {
      errs.push(`formula se ne izriše: ${(m[1] || m[2]).slice(0, 40)} (${String(e.message).slice(0, 60)})`);
    }
  }
  if (/PhET/i.test(src)) errs.push("brez omembe PhET");
  // Formule, ki si jih učenec zapomni: enakost mora veljati za vse vrednosti (lesson-identity.js).
  for (const m of checkIdentities(src).mismatches) errs.push(`vrstica ${m.line}: enakost ne velja za vse vrednosti: $${m.tex}$`);
  return errs;
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const today = () => new Date().toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" });

const PAGE_CSS = `
  .gr { font: 10.5pt/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .gr h1 { font-size: 1.45rem; margin: 2px 0; }
  .gr h2 { font-size: 1.05rem; margin: 14px 0 4px; color: #2f6fed; border-bottom: 2px solid #dde2ec; padding-bottom: 2px; break-after: avoid; }
  .gr .safety { border: 2px solid #c2410c; background: #fff7ed; border-radius: 10px; padding: 4px 12px; margin: 10px 0; }
  .gr .safety h2 { color: #9a3412; border: 0; margin-top: 6px; }
  .gr .adult { font-weight: 700; color: #9a3412; }
  .gr .facts { display: flex; flex-wrap: wrap; gap: 6px 18px; color: #3a4257; }
  .gr .answer { border-top: 1px dashed #ccd3e0; margin-top: 18px; padding-top: 6px; color: #3a4257; font-size: 0.92em; }
  .gr li { margin: 3px 0; }
`;

// Stran za tisk (domači poskus, projekt). Varnost je vedno na vrhu, takoj za naslovom.
export function gradivoPage(vrsta, topicId) {
  if (vrsta !== "poskus" && vrsta !== "projekt") return null;
  const g = loadGradivo(vrsta, topicId);
  const t = getTopic(topicId);
  if (!g || !t) return null;
  const sec = (title) => g.sections.find((x) => x.title === title);
  const block = (title) => (sec(title) ? `<h2>${esc(title)}</h2>${renderMd(sec(title).md)}` : "");
  const kind = vrsta === "poskus" ? "Domači poskus" : "Projekt iz resničnega življenja";
  const facts = [g.meta.cas && `Čas: ${esc(g.meta.cas)}`, `${esc(getPath(t.path)?.label || "")} · ${esc(t.name)}`].filter(Boolean);
  let body;
  if (vrsta === "poskus") {
    const q = sec("Vprašanje")?.md || "";
    // Odgovor na vprašanje je za črto »> Odgovor: …« in se natisne na dnu strani.
    const at = q.search(/^>/m);
    const ask = at < 0 ? q : q.slice(0, at);
    const ans = at < 0 ? "" : q.slice(at).replace(/^>[ \t]?/gm, "");
    body = `${g.meta.odrasli === "da" ? `<p class="adult">Poskus delaj skupaj z odraslo osebo.</p>` : ""}
      <div class="safety"><h2>Varnost</h2>${renderMd(sec("Varnost")?.md || "")}</div>
      ${block("Potrebuješ")}${block("Postopek")}${block("Kaj opaziš")}${block("Zakaj")}
      <h2>Vprašanje</h2>${renderMd(ask.trim())}
      ${ans ? `<div class="answer">${renderMd(ans.trim())}</div>` : ""}`;
  } else {
    body = ["Izziv", "Potrebuješ", "Koraki", "Kaj oddaš", "Merila"].map(block).join("");
  }
  const content = `<section class="gr">
    <p class="brand small">Evkli<span>d</span></p>
    <p class="muted">${esc(kind)}</p>
    <h1>${esc(g.meta.naslov || t.name)}</h1>
    <p class="facts">${facts.map((f) => `<span>${f}</span>`).join("")}<span>${esc(today())}</span></p>
    ${body}
    ${g.meta.stanje !== "pregledano" ? `<p class="muted small">Osnutek: gradivo še pregleduje učitelj.</p>` : ""}
  </section>`;
  return shell(`${g.meta.naslov || t.name} · ${kind.toLowerCase()}`, content, PAGE_CSS);
}

// Kratek video: scenarij za predvajalnik v aplikaciji (public/gradiva.js), ki upravlja simulacijo.
export function videoFor(topicId) {
  const g = loadGradivo("video", topicId);
  // Prizori brez časa se ne predvajajo; brez »trajanje« video traja do zadnjega prizora in še 10 s.
  const scenes = (g?.scenes.filter((sc) => sc.t != null) || []).sort((a, b) => a.t - b.t);
  if (!g || !Object.hasOwn(ENGINES, g.meta.simulacija) || !scenes.length) return null;
  let opts = {};
  try {
    opts = g.meta.moznosti ? JSON.parse(g.meta.moznosti) : {};
  } catch {}
  if (!opts || typeof opts !== "object" || Array.isArray(opts)) opts = {};
  const last = scenes.at(-1).t;
  const duration = g.duration > last ? g.duration : last + 10;
  return {
    topic: topicId,
    title: g.meta.naslov || getTopic(topicId)?.name || "",
    sim: g.meta.simulacija,
    opts,
    duration,
    draft: g.meta.stanje !== "pregledano",
    scenes: scenes.map((sc) => ({ t: sc.t, html: renderMd(sc.md), speak: speakMarkdown(sc.md).replace(/\n/g, " "), actions: sc.actions })),
  };
}
