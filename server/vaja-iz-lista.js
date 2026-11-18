// Vaja iz mojega testa ali domače naloge, faza 1 (j potrdil 18. 11. 2026): učenec slika test ali domačo nalogo
// (do 5 strani, PDF ali prilepljeno besedilo) v »Moji zapiski«, Evklid prepozna veščino vsake naloge in iz
// generatorjev Vadnice sestavi novo vajo od lažjih k težjim. Izvirnih nalog Evklid tu ne rešuje.
//
//   POST /api/students/:id/zapiski/vaja/naloge  { pages, photos }                  → { sheet, tasks, pages }
//   POST /api/students/:id/zapiski/vaja/zacni   { sheet, tasks: [{ i, skill }], length } ali { again: sessionId, length }
//                                                                                   → prva naloga seje (kot /test-prep)
// Naloge seje so v načinu »list« (server/progress.js startList, listSummary): namigi, rešen zgled, XP, obvladanje
// in ponavljanje kot v Vadnici. Branje fotografij je obstoječi /zapiski/preberi (server/zapiski.js).
// Samo za slovensko OŠ in SŠ (iskanje po učbeniku, searchOn); drugje zaslon pokaže eno vrstico in strežnik vrne 422.
//
// Veščine: koda najprej najde kratek seznam kandidatov za vsako nalogo (iskanje po učbeniku, server/lekcija-za-vprasanje.js,
// z besedami za matematične znake, prednostjo predmeta lista in nekaj temami z učenčeve poti; samo teme z generatorjem,
// brez AI), nato hitri model (Haiku) izbere ENO temo s tega seznama in oceni, kako prepričan je
// (prompts/vaja-iz-lista.md). Tema zunaj seznama ne velja. Brez klica (meja AI, preizkusni način, napaka) ostane
// najboljši kandidat kode, označen kot negotov, učenec ga potrdi ali zamenja.
//
// Zasebnost: slika se ne shrani (branje). Besedilo nalog je samo v tej zahtevi (modelu gre kot podatek v oznakah,
// klic nima orodij in vrne samo JSON z id-ji). Strežnik ne hrani ničesar: seznam id-jev kandidatnih tem za vsako
// nalogo dobi odjemalec kot podpisan žeton (HMAC, velja 2 uri; v njem so samo id profila, rok in id-ji tem, nikoli
// besedilo), ob »Začni« strežnik iz žetona preveri izbiro. V bazi so samo id-ji tem v seji in naše naloge.
// Vrstice z imeni, razredom, datumom, oceno, šolo in podpisom koda odstrani, preden gre besedilo modelu.
//
// Strošek: strani gredo iz obstoječe mesečne meje strani (STRANI, server/zapiski.js), prebrana fotografija je že
// plačana z branjem (dobropis). Klic za veščine gre skozi trdo mejo AI (usage.guard); največ 20 listov v 10 minutah
// na profil. »Še ena vaja« ne bere in ne porabi strani.
import crypto from "node:crypto";
import fs from "node:fs";
import { getClient, isMockMode, MODEL } from "./claude.js";
import { callMaxUsd } from "./meje-ai.js";
import { rankLessons, topicForName, levelOf, searchOn } from "./lekcija-za-vprasanje.js";
import { getTopic, getPath, localTopic, pathKeyFor } from "./curriculum.js";
import { hasGenerator } from "./practice/index.js";
import { SCHOOL_SUBJECTS } from "./subjects.js";
import { LIST } from "./progress.js";
import { lokalnaVrsta, nujnoZa } from "./nujno.js";
import { auditSecret } from "./crypto-polje.js";
import { uiLanguage } from "../public/i18n/languages.js";
import { cleanNoteText, parsePages, pageLimit, pagesUsed, takePage, givePage, useReads, giveReads, nextMonth, MAX_PAGES } from "./zapiski.js";

const env = (k, d) => (process.env[k] === undefined || process.env[k] === "" ? d : process.env[k]);
export const PICK_MODEL = () => env("EVKLID_VAJA_PICK_MODEL", MODEL);
export const PICK_SYSTEM = fs.readFileSync(new URL("../prompts/vaja-iz-lista.md", import.meta.url), "utf8").trim();
export const MAX_TASKS = 30;
export const MAX_TASK_TEXT = 1200;
export const MAX_OPTIONS = 8; // iz iskanja
export const MAX_FALLBACK = 4; // teme z učenčeve poti, vedno na koncu seznama
export const SURE = 0.7; // pod tem učenec veščino potrdi (enako kot pasovi v pozivu)
const MIN_PICK = 0.4; // pod tem izbira modela ne velja
const OTHER_SUBJECT = 0.6; // utež kandidatov drugih predmetov, kot je predmet lista
const PICK_MAX_TOKENS = 1500;
export const SHEET_TTL_MS = 2 * 3600 * 1000;
export const RATE = { max: 20, windowMs: 10 * 60 * 1000 }; // listov na profil

// ---------- osebni podatki in razdelitev na naloge (brez AI) ----------
// Vrstica glave testa (ime, razred, datum, ocena, točke, podpis, učitelj, šola): ključna beseda na začetku vrstice
// (tudi v tabeli »| Ime | … |«, za »**«, »#«), brez »=« in »?«. Odstrani se, če ima dvopičje, črte, tri pike ali »|«, ali če je kratka
// in brez »=« in »?« (»Datum 12. 11.«, »OŠ Prule«, »Učenec/ka«).
const HEAD_WORD =
  "ime(?:\\s+in\\s+priimek)?|priimek|učen(?:ec|ka)|dija(?:k|kinja)|razred|oddelek|datum|ocena|točk[ea]?|skupaj\\s+točk|podpis|učitelj(?:ica)?|profesor(?:ica)?|šola|oš|o\\.\\s*š\\.|osnovna\\s+šola|gimnazija|srednja\\s+šola|name(?:\\s+and\\s+surname)?|surname|class|date|grade|score|teacher|school";
const HEAD_START = new RegExp(`^[\\s|*_#>\\-]*(?:${HEAD_WORD})(?![a-zčšžćđ])`, "i");
const HEAD_MARK = /:|_{2,}|\.{3,}|…|\|/;
export const isHeadLine = (l) => HEAD_START.test(l) && !/[=?]/.test(l) && (HEAD_MARK.test(l) || l.trim().length <= 60);
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
// Telefon samo v strogi obliki (»041 123 456«, »01/234-56-78«, »+386 41 123 456«) ali v vrstici z besedo za telefon,
// da števila v nalogah (»05 10 15 20 25«) ostanejo.
const PHONE_STRICT = /(?<![\d,.])(?:\+\d{3}[ ]?\d{1,2}|0[1-7]\d?)[ /-]?\d{3}[ /-]?\d{2,3}(?:[ -]\d{2})?(?!\d|[,.]\d|\s\d)/g;
const PHONE_WORD = /\b(tel|telefon|gsm|mobi|mobitel|phone|kontakt)\b/i;
export function stripPersonal(text) {
  return String(text ?? "")
    .split("\n")
    .filter((l) => !isHeadLine(l))
    .map((l) => (PHONE_WORD.test(l) ? l.replace(/\+?\d[\d /-]{6,}\d/g, "") : l.replace(PHONE_STRICT, "")))
    .join("\n")
    .replace(/\[ime\]/gi, "")
    .replace(EMAIL, "");
}
// Oznake, s katerimi bi besedilo naloge »zaprlo« podatek ali ponaredilo seznam možnosti.
const TAGS = /[<＜‹〈﹤]\s*[\/／]?\s*(sheet|task|options?|student)\b[^>＞›〉﹥\n]{0,200}[>＞›〉﹥]?/gi;
export const cleanTaskText = (s) => cleanNoteText(stripPersonal(s).replace(TAGS, " "), MAX_TASK_TEXT).replace(/\n{3,}/g, "\n\n");

// Začetek naloge: »1.«, »1)«, »2. naloga«, »Naloga 3«, »### 4.«, »**5.**«; podnaloge (a, b, c) ostanejo v isti nalogi.
// Nova številka velja samo, če je za ena večja od prejšnje (prva je lahko katera koli): »1.« v »3. … 1. korak« ne razdeli.
const START = /^[\s*_#>-]*(?:(?:naloga|task|exercise)\s*(\d{1,2})\b|(\d{1,2})\s*[.)](?!\d)|(\d{1,2})\.\s*naloga\b)/i;
const numOf = (l) => {
  const m = START.exec(l);
  return m ? Number(m[1] || m[2] || m[3]) : null;
};
// Odstavek brez števk, operatorjev in vprašaja (glava, naslov testa) ni naloga.
const looksLikeTask = (t) => /[\d=+\-−·:×÷^?%$]/.test(t);
export function splitTasks(pages) {
  const out = [];
  for (const p of pages) {
    const lines = stripPersonal(p.text).split("\n");
    const starts = [];
    let prev = null;
    lines.forEach((l, i) => {
      const n = numOf(l);
      if (n != null && (prev == null || n === prev + 1)) {
        starts.push(i);
        prev = n;
      }
    });
    let chunks;
    if (starts.length >= 2 || (starts.length === 1 && starts[0] > 0)) {
      // Besedilo pred prvo številko (navodilo, skupni podatki) je samo glava, ne naloga.
      chunks = starts.map((s, k) => lines.slice(s, starts[k + 1] ?? lines.length).join("\n"));
    } else {
      // Brez oštevilčenja: odstavki, ločeni s prazno vrstico; prvi odstavek brez računa je glava.
      chunks = lines.join("\n").split(/\n\s*\n/);
      if (chunks.length > 1 && !looksLikeTask(chunks[0])) chunks.shift();
    }
    for (const c of chunks) {
      const text = cleanTaskText(c).trim();
      // Vsaj nekaj besedila ali računa (ne samo »1.« ali glava).
      if (text.replace(/^[\s*_#>-]*\d{1,2}\s*[.)]/, "").replace(/\s+/g, "").length >= 6) out.push(text);
      if (out.length >= MAX_TASKS) return out;
    }
  }
  return out;
}

// ---------- kandidati (brez AI) ----------
// Iskanje po učbeniku išče besede, zato čiste račune (»3/4 + 2/5«, »$2^3 \cdot 2^4$«, »15 % od 240«) prevedemo v
// besede tem, ki jih Vadnica ima.
const INSTRUCTION = /(izračunaj(te)?|koliko\s+je|koliko\s+meri|reši|poenostavi|izrazi|zapiši|računaj|vrednost\s+izraza|izraza?|od)(?![a-zčšž])/gi;
export function searchText(text) {
  const s = String(text ?? "");
  const words = [];
  if (/\\d?frac|\d\s*\/\s*\d/.test(s)) {
    words.push("ulomki", "računanje z ulomki");
    if (/[+\-−]/.test(s)) words.push("seštevanje in odštevanje ulomkov");
    if (/[·•×*:÷]|\\cdot|\\div/.test(s)) words.push("množenje in deljenje ulomkov");
  }
  // Potenca: »2^3«, »2³«; ne enota (»cm³«, »m²«).
  if (/\^|(?<![a-zA-Zµ])[²³⁴]/.test(s)) words.push("potence", "računanje s potencami");
  if (/%|odstot/i.test(s)) words.push("odstotki", "odstotni račun");
  if (/\\sqrt|√|koren/i.test(s)) words.push("kvadratni koren");
  const plain = s
    .replace(/^[\s*_#>-]*(?:\d{1,2}\s*[.)]|[a-h]\))/gim, " ")
    .replace(/\\(?:cdot|times|div|left|right)/g, " · ")
    .replace(/\\[a-z]+|[{}$]/gi, " ")
    .replace(INSTRUCTION, " ")
    .replace(/(^|\s)[a-h]\)/g, " ");
  // Samo števila in računske operacije (brez spremenljivk in besed): vrstni red računskih operacij.
  // Decimalna števila samo pri čistem računu (pri »2,7 kg« v fiziki bi besede potegnile matematiko).
  const pure = !/[a-zčšž]{2,}/i.test(plain);
  if (pure && /\d\s*(?:,|\{,\})\s*\d/.test(s)) words.push("decimalna števila", "računanje z decimalnimi števili");
  if (pure && /\d\s*[·•×*:÷+\-−]\s*\(?\d/.test(plain) && !/[=<>^]/.test(plain)) words.push("računske operacije", "vrstni red računskih operacij");
  return words.length ? `${s}\n${[...new Set(words)].join(", ")}` : s;
}

const firstLine = (t) => String(t).split("\n").map((l) => l.replace(/\$[^$]*\$/g, " ").trim()).find((l) => l.length >= 4) || "";
// Rang po predmetih za eno nalogo: { subject: [{ id, score }] } (samo teme z generatorjem).
export function rankBySubject(text, settings) {
  const q = searchText(text);
  const out = {};
  for (const subject of SCHOOL_SUBJECTS) {
    const st = { ...settings, subject };
    const hits = rankLessons(q, st).filter((h) => getTopic(h.d.id) && hasGenerator(h.d.id)).slice(0, 5).map((h) => ({ id: h.d.id, score: h.score }));
    const named = topicForName(firstLine(text), st);
    if (named && hasGenerator(named) && !hits.some((h) => h.id === named)) hits.push({ id: named, score: 5 });
    out[subject] = hits;
  }
  return out;
}

// Predmet lista: največ točk najboljših zadetkov vseh nalog (kemijski test z »Uredi enačbo« ostane kemija).
export function sheetSubject(ranked, fallback = null) {
  const sum = {};
  for (const r of ranked) for (const [subj, hits] of Object.entries(r)) sum[subj] = (sum[subj] || 0) + (hits[0]?.score || 0);
  const best = Object.entries(sum).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : fallback;
}

// Kandidati naloge: zadetki (drugi predmeti z utežjo 0,6), do 8; nato do 4 teme z učenčeve poti (ročna izbira).
export function candidatesFor(text, settings, { subject = settings?.subject || null, extra = [], ranked = null } = {}) {
  const found = new Map();
  for (const [subj, hits] of Object.entries(ranked || rankBySubject(text, settings))) {
    const w = subject && subj !== subject ? OTHER_SUBJECT : 1;
    for (const h of hits) if (!found.has(h.id) || found.get(h.id) < h.score * w) found.set(h.id, h.score * w);
  }
  const top = [...found.entries()].sort((a, b) => b[1] - a[1]).slice(0, MAX_OPTIONS).map(([id, score]) => ({ id, score }));
  for (const id of extra) {
    if (top.length >= MAX_OPTIONS + MAX_FALLBACK) break;
    if (getTopic(id) && hasGenerator(id) && !top.some((o) => o.id === id)) top.push({ id, score: 0, path: true });
  }
  return top;
}

// Teme z generatorjem okoli učenčeve trenutne teme na njegovi poti (za ročno izbiro, ko iskanje ne najde prave).
export function pathTopics(progress, studentId, settings, max = MAX_FALLBACK) {
  const key = pathKeyFor(settings);
  const path = key && getPath(key);
  if (!path) return [];
  const ids = path.units.flatMap((u) => u.topics.map((t) => t.id)).filter(hasGenerator);
  let cur = null;
  try {
    cur = progress?.currentTopic?.(studentId, key)?.id ?? null;
  } catch {}
  const from = Math.max(0, ids.indexOf(cur) - 2);
  return ids.slice(from, from + max);
}

const topicName = (id, lang = "sl") => {
  const t = getTopic(id);
  return t ? localTopic(t, lang)?.name || t.name : id;
};
const yearOf = (id) => getPath(getTopic(id)?.path)?.label || "";
export const studentYear = (settings) => {
  const l = levelOf(settings);
  return l ? `${l.grade}. ${l.school === "SS" ? "letnik SŠ" : "razred OŠ"}` : "";
};

// ---------- izbira veščine (Haiku, samo s seznama) ----------
export const wrapSheet = (tasks, year = "") =>
  `<sheet>\n${year ? `<student year="${String(year).replace(/[^0-9A-Za-zČŠŽčšž. ]/g, "")}"/>\n` : ""}${tasks
    .map((t, i) => `<task n="${i + 1}">\n${t.text}\n</task>\n<options n="${i + 1}">\n${t.options.map((o) => `${o.id} | ${topicName(o.id)} | ${yearOf(o.id)}`).join("\n") || "(none)"}\n</options>`)
    .join("\n")}\n</sheet>`;

const jsonFrom = (raw) => {
  try {
    return JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
  } catch {
    return null;
  }
};
const textOf = (msg) => (msg?.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");

// Odgovor modela → za vsako nalogo { id, c } ali { id: null }; id mora biti s seznama te naloge.
export function cleanPick(data, tasks) {
  const rows = Array.isArray(data?.tasks) ? data.tasks : [];
  return tasks.map((t, i) => {
    const r = rows.find((x) => x && Number(x.n) === i + 1);
    const c = Number(r?.c);
    const conf = Number.isFinite(c) ? Math.max(0, Math.min(1, c)) : 0;
    const ok = r && typeof r.id === "string" && t.options.some((o) => o.id === r.id);
    return ok && conf >= MIN_PICK ? { id: r.id, c: conf } : { id: null, c: 0 };
  });
}

// Brez modela: najboljši kandidat iskanja (ne s poti), samo če jasno vodi; vedno negotov (učenec potrdi).
export function codePick(tasks) {
  return tasks.map((t) => {
    const [a, b] = t.options.filter((o) => !o.path);
    return a && (!b || a.score >= b.score * 1.3) ? { id: a.id, c: 0.5 } : { id: null, c: 0 };
  });
}

// Vrne { picks, fromModel, usage, model }; usage je tudi, če odgovora ni bilo mogoče prebrati (klic je plačan).
export async function pickSkills({ tasks, year = "", createFn = null }) {
  if (isMockMode() && !createFn) return { mock: true, fromModel: false, picks: codePick(tasks), usage: null };
  const create = createFn || ((p) => getClient().messages.create(p));
  const model = PICK_MODEL();
  const r = await create({
    model,
    max_tokens: PICK_MAX_TOKENS,
    ...(/haiku/.test(model) ? { thinking: { type: "disabled" } } : {}),
    output_config: { effort: "low" },
    system: PICK_SYSTEM,
    messages: [{ role: "user", content: wrapSheet(tasks, year) }],
  });
  let picks = codePick(tasks);
  let fromModel = false;
  try {
    const cut = r.stop_reason && r.stop_reason !== "end_turn" && r.stop_reason !== "stop_sequence";
    if (!cut) {
      picks = cleanPick(jsonFrom(textOf(r)), tasks);
      fromModel = true;
    }
  } catch {}
  return { picks, fromModel, usage: r.usage, model: r.model || model };
}
const bytes = (s) => Buffer.byteLength(String(s ?? ""), "utf8");
export const pickReserveUsd = (tasks, year = "") => callMaxUsd(PICK_MODEL(), bytes(PICK_SYSTEM) + bytes(wrapSheet(tasks, year)) + 200, PICK_MAX_TOKENS);

// ---------- podpisan žeton seznama (namesto pomnilnika strežnika) ----------
// Vsebina: id profila, rok, id-ji kandidatnih tem za vsako nalogo. Brez besedila nalog. Skrivnost je izpeljana iz
// obstoječe (ključ podatkov ali skrivnost dnevnika dostopov v bazi, server/crypto-polje.js auditSecret); nova ni.
export function sheetTokens(db, now = () => Date.now()) {
  let secret = null;
  const key = () => (secret ||= crypto.createHmac("sha256", auditSecret(db)).update("evklid-vaja-iz-lista").digest());
  const sign = (body) => crypto.createHmac("sha256", key()).update(body).digest("base64url");
  return {
    make(studentId, tasks) {
      const body = Buffer.from(JSON.stringify({ s: studentId, e: now() + SHEET_TTL_MS, o: tasks.map((t) => t.options.map((o) => o.id)) })).toString("base64url");
      return `${body}.${sign(body)}`;
    },
    // { tasks: [{ options }] }, { expired: true } po roku ali null (ponarejen, tuj profil).
    read(token, studentId) {
      const parts = typeof token === "string" && token.length < 64000 ? token.split(".") : [];
      if (parts.length !== 2) return null;
      const [body, mac] = parts;
      const want = Buffer.from(sign(body));
      const got = Buffer.from(mac);
      if (want.length !== got.length || !crypto.timingSafeEqual(want, got)) return null;
      let d;
      try {
        d = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
      } catch {
        return null;
      }
      if (d?.s !== studentId || !Array.isArray(d.o)) return null;
      if (!(d.e > now())) return { expired: true };
      return { tasks: d.o.map((o) => ({ options: Array.isArray(o) ? o.filter((x) => typeof x === "string") : [] })) };
    },
  };
}

// Omejitev hitrosti na profil (drseče okno v pomnilniku; samo časi zahtevkov, brez vsebine).
export function rateLimiter({ max, windowMs } = RATE, now = () => Date.now()) {
  const hits = new Map();
  return (id) => {
    const t = now();
    const list = (hits.get(id) || []).filter((x) => x > t - windowMs);
    const ok = list.length < max;
    if (ok) list.push(t);
    hits.set(id, list);
    if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((x) => x > t - windowMs)) hits.delete(k);
    return ok;
  };
}

export function mountVajaIzLista(app, store, { loadStudent, usage, progress, rightsFor = null, pickFn = pickSkills, now = () => Date.now() }) {
  const db = store.db;
  const tokens = sheetTokens(db, now);
  const allow = rateLimiter(RATE, now);
  const limitFor = (s) => pageLimit(rightsFor ? rightsFor(s.id) : null, s.settings);
  const pagesInfo = (s) => {
    const limit = limitFor(s);
    const used = pagesUsed(db, s.id);
    return { used, limit, left: Math.max(0, limit - used), renews: nextMonth() };
  };
  // Isti list hkrati (dvojni dotik): drugi zahtevek počaka prvega in dobi isti odgovor, brez drugega klica in strani.
  const inFlight = new Map();

  async function readSheet(s, pages, photos) {
    // Stiska v besedilu: lokalni zaznavalnik brez AI (server/nujno.js), kot pri zapiskih.
    const nujno = nujnoZa(lokalnaVrsta(pages.map((p) => p.text).join("\n\n")), s.settings);
    const withNujno = (o) => (nujno ? { ...o, nujno } : o);
    const lang = uiLanguage(s.settings?.language);
    const texts = splitTasks(pages);
    if (!texts.length) return [422, withNujno({ error: "Na listu nisem našel nalog.", code: "vaja_prazno" })];
    const ranked = texts.map((text) => rankBySubject(text, s.settings));
    const subject = sheetSubject(ranked, s.settings?.subject || null);
    const extra = pathTopics(progress, s.id, s.settings);
    const tasks = texts.map((text, i) => ({ text, options: candidatesFor(text, s.settings, { subject, extra, ranked: ranked[i] }) }));
    // Strani: prebrane fotografije so plačane z branjem (dobropis), ostalo nova stran.
    const credit = useReads(db, s.id, Math.min(photos, pages.length));
    const fresh = pages.length - credit;
    if (fresh > 0 && !takePage(db, s.id, limitFor(s), new Date(), fresh)) {
      giveReads(db, s.id, credit);
      return [429, withNujno({ error: "Ta mesec si porabil vse strani.", code: "zapiski_strani", pages: pagesInfo(s) })];
    }
    const ask = tasks.filter((t) => t.options.length);
    const year = studentYear(s.settings);
    let picks = codePick(ask);
    let paid = false;
    let fromModel = false;
    const hold = ask.length && !usage?.blockInfo(s.id) && usage?.guard ? usage.guard(s.id, pickReserveUsd(ask, year)) : null;
    if (hold || (ask.length && !usage?.guard)) {
      try {
        const out = await pickFn({ tasks: ask, year });
        picks = out.picks;
        fromModel = out.fromModel !== false && !out.mock;
        if (out.usage) {
          paid = true;
          usage?.log(s.id, out.model, out.usage, "zapiski");
        }
      } catch (err) {
        console.warn(`[evklid] vaja iz lista: izbira veščin ni uspela (${err?.message || err}), ostane izbira kode`);
      } finally {
        hold?.release?.();
      }
    }
    // Strani vrnemo samo, če plačanega odgovora ni bilo (brez klica: meja AI, preizkusni način; napaka povezave ali
    // napaka API, ki se ne zaračuna). Ko je API odgovoril (usage), strani ostanejo porabljene, tudi če odgovora ni
    // bilo mogoče prebrati.
    if (!paid) {
      if (fresh > 0) givePage(db, s.id, fresh);
      giveReads(db, s.id, credit);
    }
    let k = 0;
    const view = tasks.map((t, i) => {
      const p = t.options.length ? picks[k++] : { id: null, c: 0 };
      return {
        i,
        text: t.text,
        skill: p.id ? { id: p.id, name: topicName(p.id, lang) } : null,
        sure: fromModel && !!p.id && p.c >= SURE,
        options: t.options.map((o) => ({ id: o.id, name: topicName(o.id, lang), year: yearOf(o.id), ...(o.path ? { path: true } : {}) })),
      };
    });
    // Besedilo nalog gre samo nazaj učencu (njegov prepis); strežnik ga ne shrani.
    return [200, withNujno({ sheet: tokens.make(s.id, tasks), tasks: view, ai: fromModel, lengths: LIST.lengths, pages: pagesInfo(s) })];
  }

  app.post("/api/students/:id/zapiski/vaja/naloge", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (!searchOn(s.settings)) return res.status(422).json({ error: "Vaja iz testa je za zdaj samo za slovensko osnovno in srednjo šolo.", code: "vaja_stopnja" });
    const pages = parsePages(req.body?.pages);
    if (!pages) return res.status(400).json({ error: "Naloge manjkajo ali so predolge." });
    const photos = Math.max(0, Math.min(MAX_PAGES, Number(req.body?.photos) || 0));
    const key = `${s.id}:${crypto.createHash("sha256").update(pages.map((p) => p.text).join("\f")).digest("hex")}:${photos}`;
    let job = inFlight.get(key);
    if (!job) {
      if (!allow(s.id)) return res.status(429).json({ error: "Preveč listov v kratkem času. Poskusi čez nekaj minut.", code: "vaja_hitro" });
      job = readSheet(s, pages, photos).finally(() => inFlight.delete(key));
      inFlight.set(key, job);
    }
    try {
      const [status, body] = await job;
      res.status(status).json(body);
    } catch (err) {
      console.error("[evklid] vaja iz lista:", err?.message || err);
      res.status(500).json({ error: "Branje nalog ni uspelo. Poskusi znova." });
    }
  });

  app.post("/api/students/:id/zapiski/vaja/zacni", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    // Telo mora biti predmet (pri seznamu bi bil »length« dolžina seznama, CodeQL).
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const length = typeof body.length === "number" ? body.length : NaN;
    if (!LIST.lengths.includes(length)) return res.status(400).json({ error: "Napačna dolžina vaje." });
    let skills;
    if (body.again != null) {
      // »Še ena vaja«: iste veščine kot prejšnja seja, brez branja in brez strani.
      const prev = progress.getSession(String(body.again));
      if (!prev || prev.student_id !== s.id || prev.kind !== "list") return res.status(404).json({ error: "Vaja ne obstaja." });
      skills = prev.params.skills || [];
    } else {
      const sh = tokens.read(body.sheet, s.id);
      if (!sh || sh.expired) return res.status(410).json({ error: "Seznam nalog je potekel. Preberi list znova.", code: "vaja_potekla" });
      const chosen = Array.isArray(body.tasks) ? body.tasks.slice(0, MAX_TASKS) : [];
      // Veščina mora biti s seznama kandidatov te naloge (strežnik ne zaupa odjemalcu).
      skills = chosen.filter((c) => c && Number.isInteger(c.i) && typeof c.skill === "string" && sh.tasks[c.i]?.options.includes(c.skill)).map((c) => c.skill);
    }
    const out = progress.startList(s.id, skills, length);
    if (!out) return res.status(400).json({ error: "Izberi vsaj eno nalogo z vajo.", code: "vaja_brez" });
    res.json(out);
  });
}
