// Inštruktor odpre orodja aplikacije iz pogovora (j 2026-11-04, ideje 1, 4, 6, 7, 11, 25, 26; docs/odpri.md).
// Model v odgovor zapiše strojne bloke, strežnik jih prebere, poišče pravo vsebino in pošlje gumbe pod sporočilom:
//   <<ODPRI poskus="prosti pad" nastavi="višina=20; masa=2">>   poskus ali simulacija (Laboratorij, učbenik)
//   <<ODPRI 3d="srce" del="levi prekat">>                       3D model (del se osvetli) ali struktura v atlasu telesa
//   <<ODPRI ucbenik="Pitagorov izrek">>                          lekcija v učbeniku
//   <<ODPRI igra="ulomki">>                                     igra za to snov
//   <<ODPRI formula="Ohmov zakon">>                              formula iz zbirke formul (prikaz v sporočilu)
//   <<GRAF ["y = a*x^2 + c", "a = 1", "c = 0"]>>               premičen graf v sporočilu (vrstica »a = 1« je drsnik)
//   <<SKICA {"tocke": {...}, "daljice": [...]}>>                 preprosta skica (trikotnik, sile, krožnica)
// Model ne pozna id-jev: išče z besedami, strežnik izbere najbližje ujemanje (najprej učenčeva pot) ali nič.
// Nič ne najde → gumba ni (nikoli napačen gumb). Učenec blokov nikoli ne vidi (meta.js stripMeta in MARKERS).
import fs from "node:fs";
import path from "node:path";
import { SIM_TOPICS, simsForTopic } from "../public/sim/katalog.js";
import { TOPIC_CONCEPTS } from "../public/games/learn-link.js";
import { getTopic, getPath, pathKeyFor } from "./curriculum.js";
import { rankLessons, terms } from "./lekcija-za-vprasanje.js";
import { formulaSheet } from "./textbook.js";
import { stopnja } from "../public/stopnja.js";
import { SKUPINE, najdiSkupino, delPoImenu } from "../public/3d/skupine.js";

const here = path.dirname(new URL(import.meta.url).pathname);
export const OPEN_MAX = 4; // orodij pod enim sporočilom (prompt dovoli dve; strežnik je strpen)
const KINDS = { poskus: "sim", sim: "sim", lab: "sim", "3d": "3d", ucbenik: "lesson", "učbenik": "lesson", igra: "game", formula: "formula" };

const OPEN_RE = /<<\s*ODPRI\b([^\n]*?)>>/g;
const GRAPH_RE = /<<\s*GRAF\b\s*(\[[^\n]*?\])\s*>>/g;
const SKETCH_RE = /<<\s*SKICA\b\s*(\{[\s\S]*?\})\s*>>/g;
// Skrivanje blokov pred učencem: server/meta.js (stripMeta, MARKERS).

function parseAttrs(body) {
  const out = {};
  const re = /([\p{L}\d_]+)=(?:"([^"]*)"|«([^»]*)»|»([^«]*)«|(\S+))/gu;
  let m;
  while ((m = re.exec(body))) out[m[1].toLowerCase()] = (m[2] ?? m[3] ?? m[4] ?? m[5] ?? "").trim().slice(0, 120);
  return out;
}

// Bloki iz besedila, v vrstnem redu: [{ kind, q, set?, del? } | { kind: "graph", exprs } | { kind: "sketch", spec }].
export function parseOpenBlocks(text) {
  const s = String(text || "");
  const found = [];
  for (const m of s.matchAll(OPEN_RE)) {
    const a = parseAttrs(m[1]);
    const key = Object.keys(a).find((k) => KINDS[k]);
    if (!key || !a[key]) continue;
    const b = { at: m.index, kind: KINDS[key], q: a[key] };
    if (a.nastavi) b.set = parseSet(a.nastavi);
    if (a.del) b.del = a.del;
    found.push(b);
  }
  for (const m of s.matchAll(GRAPH_RE)) {
    const exprs = parseGraph(m[1]);
    if (exprs) found.push({ at: m.index, kind: "graph", exprs });
  }
  for (const m of s.matchAll(SKETCH_RE)) {
    const spec = parseSketch(m[1]);
    if (spec) found.push({ at: m.index, kind: "sketch", spec });
  }
  return found.sort((a, b) => a.at - b.at).map(({ at, ...b }) => b);
}

// »višina=20; masa=2« → { višina: 20, masa: 2 } (decimalna vejica ali pika).
export function parseSet(s) {
  const out = {};
  for (const part of String(s).split(/[;\n]/)) {
    const m = /^\s*([^=]{1,40}?)\s*=\s*(-?\d+(?:[.,]\d+)?)\s*$/.exec(part);
    if (m) out[m[1].trim()] = Number(m[2].replace(",", "."));
    if (Object.keys(out).length >= 6) break;
  }
  return Object.keys(out).length ? out : undefined;
}

export function parseGraph(json) {
  let list;
  try {
    list = JSON.parse(json);
  } catch {
    return null;
  }
  if (!Array.isArray(list)) return null;
  const exprs = list.filter((x) => typeof x === "string" && x.trim() && x.length <= 120).map((x) => x.trim()).slice(0, 8);
  return exprs.length ? exprs : null;
}

// Skica: točke z imeni in koordinatami, daljice, vektorji (sile), krožnice, koti. Vse preverjeno, sicer null.
const NAME_RE = /^[A-Za-zČŠŽčšž][A-Za-z0-9'₀-₉_]{0,3}$/u;
const num = (v) => (typeof v === "number" && Number.isFinite(v) && Math.abs(v) <= 1000 ? v : null);
const lbl = (v) => (typeof v === "string" ? v.slice(0, 24) : "");
export function parseSketch(json) {
  let o;
  try {
    o = JSON.parse(json);
  } catch {
    return null;
  }
  if (!o || typeof o !== "object") return null;
  const tocke = {};
  for (const [k, v] of Object.entries(o.tocke || {}).slice(0, 12)) {
    if (NAME_RE.test(k) && Array.isArray(v) && num(v[0]) !== null && num(v[1]) !== null) tocke[k] = [v[0], v[1]];
  }
  const has = (n) => Object.hasOwn(tocke, n);
  const arr = (x, n) => (Array.isArray(x) ? x.slice(0, n) : []);
  const daljice = arr(o.daljice, 16).filter((d) => Array.isArray(d) && has(d[0]) && has(d[1])).map((d) => [d[0], d[1], lbl(d[2])]);
  const vektorji = arr(o.vektorji, 8)
    .filter((d) => Array.isArray(d) && has(d[0]) && num(d[1]) !== null && num(d[2]) !== null && (d[1] || d[2]))
    .map((d) => [d[0], d[1], d[2], lbl(d[3])]);
  const krogi = arr(o.krogi, 4).filter((d) => Array.isArray(d) && has(d[0]) && num(d[1]) > 0).map((d) => [d[0], d[1]]);
  const koti = arr(o.koti, 6).filter((d) => Array.isArray(d) && has(d[0]) && has(d[1]) && has(d[2])).map((d) => [d[0], d[1], d[2], lbl(d[3])]);
  if (!Object.keys(tocke).length || !(daljice.length + vektorji.length + krogi.length)) return null;
  return { tocke, daljice, vektorji, krogi, koti, naslov: lbl(o.naslov) };
}

// ---------------------------------------------------------------- iskanje
const fold = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const termSet = (s) => new Set(terms(s));
// Besede, ki povedo le vrsto gumba (»poskus z nihalom«), ne snovi.
const KIND_WORDS = new Set(terms("poskus poskusa simulacija simulacijo model modela laboratorij laboratoriju igra igro lekcija lekcijo učbenik formula formulo prikaz"));
// Ocena: delež besed poizvedbe, ki so v naslovu (3) ali v opisu (1); vse besede naslova → bonus.
// V naslovu morata biti vsaj dve tretjini besed poizvedbe (»Ohmov zakon« ne najde »Odbojni zakon«).
function score(q, title, extra = "") {
  const tq = [...termSet(q)].filter((w) => !KIND_WORDS.has(w));
  if (!tq.length) return 0;
  const tt = termSet(title);
  const te = termSet(extra);
  let s = 0;
  let hit = 0;
  for (const w of tq) {
    if (tt.has(w)) (s += 3), hit++;
    else if (te.has(w)) s += 1;
  }
  if (!hit || hit < Math.ceil((tq.length * 2) / 3)) return 0;
  if (hit === tq.length && tt.size === hit) s += 2; // natančno ujemanje naslova
  return s / tq.length;
}

const pathOf = (settings) => pathKeyFor(settings || {}) || "";
// Prednost: učenčeva pot, nato njegov predmet in šola, nato drugo (malo).
function nearness(topicPath, myPath) {
  if (!topicPath || !myPath) return 0;
  if (topicPath === myPath) return 0.6;
  const [s1, sc1] = topicPath.split("-");
  const [s2, sc2] = myPath.split("-");
  return (s1 === s2 ? 0.3 : 0) + (sc1 === sc2 ? 0.2 : 0);
}

// Vse simulacije s temami: id + opts → { id, opts, title, topics: [{ id, title }] }.
let SIMS = null;
function allSims() {
  if (SIMS) return SIMS;
  const map = new Map();
  for (const topicId of Object.keys(SIM_TOPICS))
    for (const d of simsForTopic(topicId)) {
      const key = `${d.id}|${JSON.stringify(d.opts || {})}`;
      if (!map.has(key)) map.set(key, { id: d.id, opts: d.opts || {}, titles: [], topics: [], topicOf: {} });
      const x = map.get(key);
      x.topics.push(topicId);
      if (!x.titles.includes(d.title)) x.titles.push(d.title);
      x.topicOf[d.title] ||= topicId;
    }
  SIMS = [...map.values()];
  return SIMS;
}

function findSim(q, settings, canOpen) {
  const my = pathOf(settings);
  let best = null;
  for (const x of allSims()) {
    if (x.id.startsWith("3d-")) continue; // 3D ima svoj gumb (findModel)
    const names = x.topics.map((id) => getTopic(id)?.name || "").join(" ");
    let s0 = 0;
    let title = x.titles[0];
    for (const tt of x.titles) {
      const v = score(q, tt, names);
      if (v > s0) (s0 = v), (title = tt);
    }
    if (!s0) continue;
    const near = Math.max(0, ...x.topics.map((id) => nearness(getTopic(id)?.path, my)));
    const s = s0 + near;
    if (!best || s > best.s) best = { s, x, title };
  }
  if (!best || best.s < 1.5) return null;
  const { x, title } = best;
  const topic = x.topics.find((id) => getTopic(id)?.path === my) || x.topicOf[title] || x.topics[0];
  return { kind: "sim", id: x.id, opts: x.opts, title, topic, locked: canOpen ? !x.topics.some((id) => canOpen(id)) : false };
}

// 3D: modeli iz public/3d/modeli/<področje>/index.js (samo podatki) in imena struktur atlasa telesa.
let MODELS = null;
async function allModels() {
  if (MODELS) return MODELS;
  const dir = path.join(here, "..", "public", "3d", "modeli");
  const out = [];
  for (const p of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    const f = path.join(dir, p, "index.js");
    if (!fs.existsSync(f)) continue;
    try {
      const m = await import(new URL(`file://${f}`).href);
      for (const x of Array.isArray(m.default) ? m.default : []) if (x?.id && x.naslov) out.push({ id: x.id, naslov: x.naslov, opis: x.opis || "", predmet: x.predmet || "" });
    } catch {}
  }
  MODELS = out;
  return out;
}
let ATLAS = null;
function atlasNames() {
  if (ATLAS) return ATLAS;
  try {
    const read = (f) => JSON.parse(fs.readFileSync(path.join(here, "..", "public", "3d", f), "utf8"));
    // Ključi atlas-imena so imena struktur, atlas pa izbira po id-ju vrstice (»Femur« → »Femur.r«);
    // skupine (»Teeth«, »Skeletal system«) vrstice nimajo in gumba ne dobijo.
    const idOf = new Map();
    let zenske = [];
    try {
      zenske = read("atlas-zenski.json").strukture || [];
    } catch {}
    for (const r of [...read("atlas-strukture.json"), ...zenske]) if (r?.ime && !idOf.has(r.ime)) idOf.set(r.ime, r.id);
    ATLAS = Object.entries(read("atlas-imena.json")).filter(([k, v]) => v?.sl && idOf.has(k)).map(([k, v]) => ({ id: idOf.get(k), sl: v.sl }));
  } catch {
    ATLAS = [];
  }
  return ATLAS;
}

// Skupine delov (public/3d/skupine.js): »zaklopke«, »venčne žile«, »organeli« … → del="skupina-<id>" (pregledovalnik
// osvetli vse dele skupine). Imena skupin v vseh jezikih iz public/i18n/ui/*.json (a3.grp.<id>). Ime dela ima prednost:
// »pljučne vene« je del srca, ne skupina; pri organih iz datotek primerjamo z imeni delov.
let GRP = null;
function imenaSkupin() {
  if (GRP) return GRP;
  GRP = {};
  const dir = path.join(here, "..", "public", "i18n", "ui");
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    try {
      const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      for (const [k, v] of Object.entries(j)) if (k.startsWith("a3.grp.")) (GRP[k.slice(7)] ||= []).push(v);
    } catch {}
  }
  return GRP;
}
// Imena delov modela (id, slovensko ime, latinsko): organi iz <organ>.json, celice in virusi iz datoteke modela
// (del("id", "Ime" …) in { id: "…", ime: "…" }). Brez njih bi ime enega dela (»jedro«) postalo skupina (»jedro z deli«).
const _imena = new Map();
function imenaDelov(id) {
  if (_imena.has(id)) return _imena.get(id);
  let out = [];
  try {
    const m = /^organ-(.+)$/.exec(id || "");
    if (m) {
      const j = JSON.parse(fs.readFileSync(path.join(here, "..", "public", "3d", "modeli", "organi-3d", `${m[1]}.json`), "utf8"));
      out = (j.deli || []).map((d) => ({ id: d.id, ime: d.ime, la: d.la }));
    } else {
      const mapa = path.join(here, "..", "public", "3d", "modeli", "celice");
      const re = new RegExp(`export const info = \\{\\s*id: "${String(id).replace(/[^a-z0-9-]/g, "")}"`);
      const f = fs.readdirSync(mapa).find((x) => x.endsWith(".js") && re.test(fs.readFileSync(path.join(mapa, x), "utf8")));
      if (f) {
        const src = fs.readFileSync(path.join(mapa, f), "utf8");
        out = [...src.matchAll(/del\("([a-z0-9-]+)", "([^"]+)"/g), ...src.matchAll(/\{ id: "([a-z0-9-]+)", ime: "([^"]+)"/g)].map((x) => ({ id: x[1], ime: x[2] }));
      }
    }
  } catch {}
  _imena.set(id, out);
  return out;
}
export function delAliSkupina(modelId, del) {
  if (!del || !SKUPINE[modelId]) return del;
  if (delPoImenu(imenaDelov(modelId), del)) return del;
  const g = najdiSkupino(modelId, del, imenaSkupin());
  return g ? `skupina-${g}` : del;
}

async function findModel(q, del) {
  let best = null;
  for (const m of await allModels()) {
    const s = score(q, m.naslov, m.opis);
    if (s && (!best || s > best.s)) best = { s, m };
  }
  if (best && best.s >= 2) return { kind: "3d", id: best.m.id, title: best.m.naslov, ...(del ? { del: delAliSkupina(best.m.id, del) } : {}) };
  // Struktura v atlasu telesa (»stegnenica«, »levi prekat« brez modela srca).
  const want = fold(del || q);
  let hit = atlasNames().find((x) => fold(x.sl) === want);
  if (!hit) {
    let b = null;
    for (const x of atlasNames()) {
      const s = score(del || q, x.sl);
      if (s >= 3 && (!b || s > b.s || (s === b.s && x.sl.length < b.x.sl.length))) b = { s, x };
    }
    hit = b?.x;
  }
  return hit ? { kind: "3d", id: "atlas", izberi: hit.id, title: hit.sl } : null;
}

function findLesson(q, settings) {
  const s = { ...(settings || {}) };
  // Kot pri poskusih: v naslovu vsaj dve tretjini besed (»kvadratna funkcija« ne najde »Linearna funkcija«).
  const top = rankLessons(q, s).slice(0, 5).find((r) => score(q, r.d.name));
  if (!top) return null;
  return { kind: "lesson", id: top.d.id, title: top.d.name };
}

function findGame(q, settings) {
  // Najprej tema (lekcija) poizvedbe, nato pojmi iger za to temo.
  const ranked = rankLessons(q, { ...(settings || {}) });
  for (const r of ranked.slice(0, 5)) {
    if (!score(q, r.d.name)) continue; // sicer »Pitagorov izrek« pri fiziki najde igro o silah
    const concepts = TOPIC_CONCEPTS[r.d.id];
    if (concepts?.length) return { kind: "game", concepts: concepts.slice(0, 4), title: r.d.name };
  }
  return null;
}

// Zbirka formul učenčeve stopnje: vrstice »| Ime | $formula$ |«.
function findFormula(q, settings) {
  const subj = String(settings?.subject || "").toUpperCase();
  const st = stopnja(settings || {});
  const level = st === "FAKS" ? "UNI" : st === "SS" ? "SS" : "OS";
  const books = [...new Set([`${subj}-${level}`, `${subj}-OS`, `${subj}-SS`])];
  let best = null;
  for (const book of books) {
    const raw = formulaSheet(book);
    if (!raw) continue;
    let section = "";
    for (const line of raw.split("\n")) {
      const h = /^##\s+(.+)/.exec(line);
      if (h) section = h[1].trim();
      const m = /^\|\s*([^|$]+?)\s*\|\s*(\$[^|]+)\|\s*$/.exec(line);
      if (!m) continue;
      const s = score(q, m[1], section) + (book.endsWith(level) ? 0.3 : 0);
      if (s >= 2 && (!best || s > best.s)) best = { s, name: m[1], tex: m[2].trim(), section, book };
    }
  }
  return best ? { kind: "formula", title: best.name, tex: best.tex, section: best.section, book: best.book } : null;
}

/**
 * Bloki → gumbi za odjemalca (največ OPEN_MAX, brez podvojenih). canOpen(topicId) pove, ali je interaktivni
 * del teme odklenjen (zaklep kot v učbeniku in Laboratoriju).
 */
export async function resolveOpen(text, settings, { canOpen = null } = {}) {
  const out = [];
  const seen = new Set();
  for (const b of parseOpenBlocks(text)) {
    if (out.length >= OPEN_MAX) break;
    let r = null;
    try {
      if (b.kind === "graph") r = { kind: "graph", exprs: b.exprs };
      else if (b.kind === "sketch") r = { kind: "sketch", spec: b.spec };
      else if (b.kind === "sim") r = findSim(b.q, settings, canOpen);
      else if (b.kind === "3d") r = await findModel(b.q, b.del);
      else if (b.kind === "lesson") r = findLesson(b.q, settings);
      else if (b.kind === "game") r = findGame(b.q, settings);
      else if (b.kind === "formula") r = findFormula(b.q, settings);
    } catch (err) {
      console.warn("[evklid] odpri:", err?.message);
    }
    if (!r) continue;
    if (r.kind === "sim" && b.set && !r.locked) r.set = b.set;
    const key = JSON.stringify([r.kind, r.id, r.izberi, r.title, r.exprs, r.del]);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

export const _test = { delAliSkupina, score, findSim, findModel, findLesson, findGame, findFormula, getPath };
