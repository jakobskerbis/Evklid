// Vaja iz mojega testa ali domače naloge, faza 1 (j potrdil 18. 11. 2026): učenec slika test ali domačo nalogo
// (do 5 strani, PDF ali prilepljeno besedilo) v »Moji zapiski«, Evklid prepozna veščino vsake naloge in iz
// generatorjev Vadnice sestavi novo vajo od lažjih k težjim. Izvirnih nalog Evklid tu ne rešuje.
//
//   POST /api/students/:id/zapiski/vaja/naloge  { pages, photos }                  → { sheet, tasks, pages }
//   POST /api/students/:id/zapiski/vaja/zacni   { sheet, tasks: [{ i, skill }], length } ali { again: sessionId, length }
//                                                                                   → prva naloga seje (kot /test-prep)
// Naloge seje so v načinu »list« (server/progress.js startList, listSummary): namigi, rešen zgled, XP, obvladanje
// in ponavljanje kot v Vadnici. Branje fotografij je obstoječi /zapiski/preberi (server/zapiski.js).
//
// Veščine: koda najprej najde kratek seznam kandidatov za vsako nalogo (iskanje po učbeniku, server/lekcija-za-vprasanje.js,
// samo teme z generatorjem, brez AI), nato hitri model (Haiku) izbere ENO temo s tega seznama in oceni, kako
// prepričan je (prompts/vaja-iz-lista.md). Tema zunaj seznama ne velja. Brez klica (meja AI, preizkusni način,
// napaka) ostane najboljši kandidat kode, označen kot negotov, učenec ga potrdi ali zamenja.
//
// Zasebnost: slika se ne shrani (branje). Besedilo nalog je samo v tej zahtevi (modelu gre kot podatek v oznakah,
// klic nima orodij in vrne samo JSON z id-ji); po odgovoru ostane v pomnilniku strežnika le seznam id-jev tem za
// vsako nalogo (največ 2 uri, da strežnik ob »Začni« preveri izbiro), v bazi pa samo id-ji tem v seji in naše naloge.
// Vrstice z imeni, razredom, datumom, oceno in podpisom koda odstrani, preden gre besedilo modelu.
//
// Strošek: strani gredo iz obstoječe mesečne meje strani (STRANI, server/zapiski.js), prebrana fotografija je že
// plačana z branjem (dobropis). Klic za veščine gre skozi trdo mejo AI (usage.guard). »Še ena vaja« ne bere in ne
// porabi strani.
import crypto from "node:crypto";
import fs from "node:fs";
import { getClient, isMockMode, MODEL } from "./claude.js";
import { callMaxUsd } from "./meje-ai.js";
import { rankLessons, topicForName } from "./lekcija-za-vprasanje.js";
import { getTopic, getPath, localTopic } from "./curriculum.js";
import { hasGenerator } from "./practice/index.js";
import { SCHOOL_SUBJECTS } from "./subjects.js";
import { LIST } from "./progress.js";
import { lokalnaVrsta, nujnoZa } from "./nujno.js";
import { uiLanguage } from "../public/i18n/languages.js";
import { cleanNoteText, parsePages, pageLimit, pagesUsed, takePage, givePage, useReads, giveReads, nextMonth, MAX_PAGES } from "./zapiski.js";

const env = (k, d) => (process.env[k] === undefined || process.env[k] === "" ? d : process.env[k]);
export const PICK_MODEL = () => env("EVKLID_VAJA_PICK_MODEL", MODEL);
export const PICK_SYSTEM = fs.readFileSync(new URL("../prompts/vaja-iz-lista.md", import.meta.url), "utf8").trim();
export const MAX_TASKS = 30;
export const MAX_TASK_TEXT = 1200;
export const MAX_OPTIONS = 8;
export const SURE = 0.7; // pod tem učenec veščino potrdi
const MIN_PICK = 0.4; // pod tem izbira modela ne velja (»nimam preverjene vaje«)
const PICK_MAX_TOKENS = 1500;
export const SHEET_TTL_MS = 2 * 3600 * 1000;
const MAX_SHEETS = 2000; // pomnilnik strežnika

// ---------- osebni podatki in razdelitev na naloge (brez AI) ----------
// Vrstice glave testa (ime, razred, datum, ocena, točke, podpis, učitelj) ne gredo modelu in se ne prikažejo.
const HEAD_LINE = /^\s*[*_#>\-]*\s*(ime(\s+in\s+priimek)?|priimek|učen(ec|ka)|dija(k|kinja)|razred|oddelek|datum|ocena|točke|skupaj\s+točk|podpis|učitelj(ica)?|profesor(ica)?|šola|name|class|date|grade|score|teacher)\b\s*[:.]/i;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
// Telefonska številka: »041 123 456«, »+386 1 234 5678« (začne se z 0 ali +, da števila v računih ostanejo).
const PHONE = /(?<![\d,.])(?:\+\d{2,3}|0\d)[\d /-]{6,}\d(?!\d|[,.]\d)/g;
export function stripPersonal(text) {
  return String(text ?? "")
    .split("\n")
    .filter((l) => !HEAD_LINE.test(l))
    .join("\n")
    .replace(/\[ime\]/gi, "")
    .replace(EMAIL, "")
    .replace(PHONE, "");
}
// Oznake, s katerimi bi besedilo naloge »zaprlo« podatek ali ponaredilo seznam možnosti.
const TAGS = /[<＜‹〈﹤]\s*[\/／]?\s*(sheet|task|options?)\b[^>＞›〉﹥\n]{0,200}[>＞›〉﹥]?/gi;
export const cleanTaskText = (s) => cleanNoteText(stripPersonal(s).replace(TAGS, " "), MAX_TASK_TEXT).replace(/\n{3,}/g, "\n\n");

// Začetek naloge: »1.«, »1)«, »2. naloga«, »Naloga 3«, »3. (4 točke)«; podnaloge (a, b, c) ostanejo v isti nalogi.
const START = /^\s*(?:\*\*)?\s*(?:(?:naloga|task|exercise)\s*\d{1,2}\b|\d{1,2}\s*[.)](?!\d)|\d{1,2}\.\s*naloga\b)/i;
export function splitTasks(pages) {
  const out = [];
  for (const p of pages) {
    const lines = stripPersonal(p.text).split("\n");
    const starts = lines.map((l, i) => (START.test(l) ? i : -1)).filter((i) => i >= 0);
    let chunks;
    if (starts.length >= 2 || (starts.length === 1 && starts[0] > 0)) {
      // Besedilo pred prvo številko (navodilo, skupni podatki) je samo glava, ne naloga.
      chunks = starts.map((s, k) => lines.slice(s, starts[k + 1] ?? lines.length).join("\n"));
    } else {
      // Brez oštevilčenja: odstavki, ločeni s prazno vrstico.
      chunks = lines.join("\n").split(/\n\s*\n/);
    }
    for (const c of chunks) {
      const text = cleanTaskText(c).trim();
      // Vsaj nekaj besedila ali računa (ne samo »1.« ali glava).
      if (text.replace(/^\s*\d{1,2}\s*[.)]/, "").replace(/\s+/g, "").length >= 8) out.push(text);
      if (out.length >= MAX_TASKS) return out;
    }
  }
  return out;
}

// ---------- kandidati (brez AI) ----------
const firstLine = (t) => String(t).split("\n").map((l) => l.replace(/\$[^$]*\$/g, " ").trim()).find((l) => l.length >= 4) || "";
export function candidatesFor(text, settings, max = MAX_OPTIONS) {
  const found = new Map();
  const add = (id, score) => {
    if (id && getTopic(id) && hasGenerator(id) && (!found.has(id) || found.get(id) < score)) found.set(id, score);
  };
  const subjects = [...new Set([settings?.subject, ...SCHOOL_SUBJECTS].filter(Boolean))];
  for (const subject of subjects) {
    const st = { ...settings, subject };
    for (const hit of rankLessons(text, st).slice(0, 5)) add(hit.d.id, hit.score);
    add(topicForName(firstLine(text), st), 5);
  }
  return [...found.entries()].sort((a, b) => b[1] - a[1]).slice(0, max).map(([id, score]) => ({ id, score }));
}

const topicName = (id, lang = "sl") => {
  const t = getTopic(id);
  return t ? localTopic(t, lang)?.name || t.name : id;
};
const yearOf = (id) => getPath(getTopic(id)?.path)?.label || "";

// ---------- izbira veščine (Haiku, samo s seznama) ----------
export const wrapSheet = (tasks) =>
  `<sheet>\n${tasks
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

// Brez modela: najboljši kandidat kode, samo če jasno vodi; vedno negotov (učenec potrdi).
export function codePick(tasks) {
  return tasks.map((t) => {
    const [a, b] = t.options;
    return a && (!b || a.score >= b.score * 1.3) ? { id: a.id, c: 0.5 } : { id: null, c: 0 };
  });
}

export async function pickSkills({ tasks, createFn = null }) {
  if (isMockMode() && !createFn) return { mock: true, picks: codePick(tasks), usage: null };
  const create = createFn || ((p) => getClient().messages.create(p));
  const model = PICK_MODEL();
  const r = await create({
    model,
    max_tokens: PICK_MAX_TOKENS,
    ...(/haiku/.test(model) ? { thinking: { type: "disabled" } } : {}),
    output_config: { effort: "low" },
    system: PICK_SYSTEM,
    messages: [{ role: "user", content: wrapSheet(tasks) }],
  });
  const cut = r.stop_reason && r.stop_reason !== "end_turn" && r.stop_reason !== "stop_sequence";
  return { picks: cut ? codePick(tasks) : cleanPick(jsonFrom(textOf(r)), tasks), usage: r.usage, model: r.model || model };
}
const bytes = (s) => Buffer.byteLength(String(s ?? ""), "utf8");
export const pickReserveUsd = (tasks) => callMaxUsd(PICK_MODEL(), bytes(PICK_SYSTEM) + bytes(wrapSheet(tasks)) + 200, PICK_MAX_TOKENS);

// ---------- seznam v pomnilniku (samo id-ji tem, brez besedila) ----------
export function makeSheets(now = () => Date.now()) {
  const map = new Map();
  const sweep = () => {
    const t = now();
    for (const [k, v] of map) if (v.until <= t) map.delete(k);
    while (map.size > MAX_SHEETS) map.delete(map.keys().next().value);
  };
  return {
    put(studentId, tasks) {
      sweep();
      const id = crypto.randomUUID();
      map.set(id, { studentId, until: now() + SHEET_TTL_MS, tasks: tasks.map((t) => ({ options: t.options.map((o) => o.id) })) });
      return id;
    },
    get(id, studentId) {
      sweep();
      const v = map.get(String(id || ""));
      return v && v.studentId === studentId ? v : null;
    },
    drop: (id) => map.delete(String(id || "")),
    size: () => (sweep(), map.size),
  };
}

export function mountVajaIzLista(app, store, { loadStudent, usage, progress, rightsFor = null, pickFn = pickSkills, sheets = makeSheets() }) {
  const db = store.db;
  const limitFor = (s) => pageLimit(rightsFor ? rightsFor(s.id) : null, s.settings);
  const pagesInfo = (s) => {
    const limit = limitFor(s);
    const used = pagesUsed(db, s.id);
    return { used, limit, left: Math.max(0, limit - used), renews: nextMonth() };
  };

  app.post("/api/students/:id/zapiski/vaja/naloge", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const pages = parsePages(req.body?.pages);
    if (!pages) return res.status(400).json({ error: "Naloge manjkajo ali so predolge." });
    const photos = Math.max(0, Math.min(MAX_PAGES, Number(req.body?.photos) || 0));
    // Stiska v besedilu: lokalni zaznavalnik brez AI (server/nujno.js), kot pri zapiskih.
    const nujno = nujnoZa(lokalnaVrsta(pages.map((p) => p.text).join("\n\n")), s.settings);
    const withNujno = (o) => (nujno ? { ...o, nujno } : o);
    const lang = uiLanguage(s.settings?.language);
    const tasks = splitTasks(pages).map((text) => ({ text, options: candidatesFor(text, s.settings) }));
    if (!tasks.length) return res.status(422).json(withNujno({ error: "Na listu nisem našel nalog.", code: "vaja_prazno" }));
    // Strani: prebrane fotografije so plačane z branjem (dobropis), ostalo nova stran.
    const credit = useReads(db, s.id, Math.min(photos, pages.length));
    const fresh = pages.length - credit;
    if (fresh > 0 && !takePage(db, s.id, limitFor(s), new Date(), fresh)) {
      giveReads(db, s.id, credit);
      return res.status(429).json(withNujno({ error: "Ta mesec si porabil vse strani.", code: "zapiski_strani", pages: pagesInfo(s) }));
    }
    const refund = () => {
      if (fresh > 0) givePage(db, s.id, fresh);
      giveReads(db, s.id, credit);
    };
    const ask = tasks.filter((t) => t.options.length);
    let picks = codePick(ask);
    let ai = false;
    const hold = ask.length && !usage?.blockInfo(s.id) && usage?.guard ? usage.guard(s.id, pickReserveUsd(ask)) : null;
    if (hold || (ask.length && !usage?.guard)) {
      try {
        const out = await pickFn({ tasks: ask });
        picks = out.picks;
        if (out.usage) {
          ai = true;
          usage?.log(s.id, out.model, out.usage, "zapiski");
        }
      } catch (err) {
        console.warn(`[evklid] vaja iz lista: izbira veščin ni uspela (${err?.message || err}), ostane izbira kode`);
      } finally {
        hold?.release?.();
      }
    }
    if (!ai) refund(); // brez klica modela (meja AI, preizkusni način, napaka) strani ne porabimo
    const sheet = sheets.put(s.id, tasks);
    let k = 0;
    const view = tasks.map((t, i) => {
      const p = t.options.length ? picks[k++] : { id: null, c: 0 };
      return {
        i,
        text: t.text,
        skill: p.id ? { id: p.id, name: topicName(p.id, lang) } : null,
        sure: !!p.id && p.c >= SURE,
        options: t.options.map((o) => ({ id: o.id, name: topicName(o.id, lang), year: yearOf(o.id) })),
      };
    });
    // Besedilo nalog gre samo nazaj učencu (njegov prepis); strežnik ga ne shrani.
    res.json(withNujno({ sheet, tasks: view, ai, lengths: LIST.lengths, pages: pagesInfo(s) }));
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
      const sh = sheets.get(typeof body.sheet === "string" ? body.sheet : "", s.id);
      if (!sh) return res.status(410).json({ error: "Seznam nalog je potekel. Preberi list znova.", code: "vaja_potekla" });
      const chosen = Array.isArray(body.tasks) ? body.tasks.slice(0, MAX_TASKS) : [];
      // Veščina mora biti s seznama kandidatov te naloge (strežnik ne zaupa odjemalcu).
      skills = chosen.filter((c) => c && Number.isInteger(c.i) && typeof c.skill === "string" && sh.tasks[c.i]?.options.includes(c.skill)).map((c) => c.skill);
    }
    const out = progress.startList(s.id, skills, length);
    if (!out) return res.status(400).json({ error: "Izberi vsaj eno nalogo z vajo.", code: "vaja_brez" });
    res.json(out);
  });
}
