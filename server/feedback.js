// Povratne informacije testerjev: vprašalnik (ocene po področjih + pripombe) in kratek pogovor.
// Odgovori so v bazi in v data/povratne-informacije.json (za branje in za Clauda, ki iz njih
// pripravi seznam sprememb). Brez API ključa ali brez EVKLID_FEEDBACK_AI=1 ne stane nič.
import "./env.js";
import fs from "node:fs";
import path from "node:path";
import { getClient, isMockMode, MODEL, quickParams } from "./claude.js";
import { cleanText } from "./settings.js";
import { callMaxUsd } from "./meje-ai.js";
import { seal, unseal, sealJson, unsealJson, encryptionOn } from "./crypto-polje.js";

export const AREAS = ["path", "tutor", "textbook", "competition", "design", "speed", "league"];
export const AREA_NAMES = {
  path: "Učna pot in naloge",
  tutor: "Inštruktor (razlage)",
  textbook: "Učbenik in simulacije",
  competition: "Tekmovanja",
  design: "Videz in preglednost",
  speed: "Hitrost in delovanje",
  league: "Točke in lige",
};
// cosmetics: želja za tedensko posodobitev trgovine z avatarji (public/games/index.js, docs/kozmetika-posodobitve.md).
const KINDS = ["form", "interview", "cosmetics"];
const RECOMMEND = ["yes", "maybe", "no"];
const DEVICES = ["phone", "tablet", "desktop"];
const MAX_TEXT = 2000;
const MAX_ROWS = 5000; // zaščita pred zasipanjem
export const MAX_INTERVIEW_TURNS = 6;
// Pripravljena vprašanja pogovora (public/feedback.js) in kam sodi odgovor v povzetku.
const QUESTION_KEYS = ["used", "liked", "stuck", "where", "change", "use"];
const QUESTION_BUCKET = { liked: "praise", stuck: "complaints", where: "complaints", change: "ideas", use: "other" };

// Pogovor z AI samo, kadar je izrecno vklopljen (privzeto vprašanja iz aplikacije, brez stroškov).
export const feedbackAiOn = () => process.env.EVKLID_FEEDBACK_AI === "1" && !isMockMode();
// Kartica »Kako ti je všeč Evklid?« na Učni poti (za testno različico; za javno objavo nastavi 0).
export const feedbackPromptOn = () => process.env.EVKLID_FEEDBACK_PROMPT !== "0";

// Zbrana mnenja vidi samo, kdor odpre aplikacijo na računalniku, kjer teče strežnik
// (ne prek povezave za telefon, ta doda glavo Cf-Connecting-Ip / X-Forwarded-For).
export function isLocalRequest(req) {
  if (req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.headers["forwarded"]) return false;
  const ip = req.socket?.remoteAddress || "";
  return ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
}

// Želje za trgovino so prosto besedilo otrok: hranimo jih največ WISH_DAYS dni (docs/kozmetika-posodobitve.md).
export const WISH_DAYS = 90;
export function purgeOldWishes(db) {
  ensureFeedbackTable(db);
  return Number(db.prepare(`DELETE FROM feedback WHERE kind = 'cosmetics' AND created_at < datetime('now', '-${WISH_DAYS} days')`).run().changes);
}

export function ensureFeedbackTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY,
      student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
      name TEXT,
      kind TEXT NOT NULL DEFAULT 'form',   -- form | interview | cosmetics
      ratings TEXT NOT NULL DEFAULT '{}',  -- {področje: 1–5}
      recommend TEXT,                      -- yes | maybe | no
      good TEXT, bad TEXT, ideas TEXT,
      interview TEXT NOT NULL DEFAULT '[]', -- [{q, a}]
      lang TEXT, device TEXT, screen TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

const longText = (v) => (typeof v === "string" ? v.replace(/\r\n/g, "\n").trim().slice(0, MAX_TEXT) : "");

// Preveri in počisti oddano mnenje. Vrne null, če je prazno.
export function normalizeFeedback(body = {}) {
  const ratings = {};
  for (const a of AREAS) {
    const r = Number(body.ratings?.[a]);
    if (Number.isInteger(r) && r >= 1 && r <= 5) ratings[a] = r;
  }
  const interview = (Array.isArray(body.interview) ? body.interview : [])
    .slice(0, MAX_INTERVIEW_TURNS * 2 + 2)
    .map((x) => ({ q: longText(x?.q).slice(0, 500), a: longText(x?.a), ...(QUESTION_KEYS.includes(x?.k) ? { k: x.k } : {}) }))
    .filter((x) => x.q && x.a);
  const fb = {
    kind: KINDS.includes(body.kind) ? body.kind : "form",
    name: cleanText(body.name, 40) || null,
    ratings,
    recommend: RECOMMEND.includes(body.recommend) ? body.recommend : null,
    good: longText(body.good),
    bad: longText(body.bad),
    ideas: longText(body.ideas),
    interview,
    lang: cleanText(body.lang, 12) || null,
    device: DEVICES.includes(body.device) ? body.device : null,
    screen: /^\d{2,5}x\d{2,5}$/.test(body.screen || "") ? body.screen : null,
  };
  const empty = !Object.keys(ratings).length && !fb.recommend && !fb.good && !fb.bad && !fb.ideas && !interview.length;
  return empty ? null : fb;
}

const parseRow = (r) => ({
  id: r.id,
  created_at: r.created_at,
  kind: r.kind,
  name: unseal(r.name),
  student_id: r.student_id,
  ratings: JSON.parse(r.ratings),
  recommend: r.recommend,
  good: unseal(r.good) || "",
  bad: unseal(r.bad) || "",
  ideas: unseal(r.ideas) || "",
  interview: unsealJson(r.interview, []),
  lang: r.lang,
  device: r.device,
  screen: r.screen,
});

export class FeedbackStore {
  constructor(db, file = null) {
    this.db = db;
    this.file = file;
    ensureFeedbackTable(db);
  }
  count() {
    return this.db.prepare("SELECT COUNT(*) AS n FROM feedback").get().n;
  }
  add(studentId, fb) {
    const r = this.db
      .prepare(
        `INSERT INTO feedback (student_id, name, kind, ratings, recommend, good, bad, ideas, interview, lang, device, screen)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(studentId, seal(fb.name), fb.kind, JSON.stringify(fb.ratings), fb.recommend, seal(fb.good), seal(fb.bad), seal(fb.ideas), sealJson(fb.interview), fb.lang, fb.device, fb.screen);
    this.writeFile();
    return Number(r.lastInsertRowid);
  }
  list() {
    return this.db.prepare("SELECT * FROM feedback ORDER BY id").all().map(parseRow);
  }
  // Datoteka je vedno cela kopija tabele, da jo lahko kdorkoli prebere brez baze.
  // S ključem za šifriranje (produkcija) nešifrirane kopije ne pišemo; mnenja so v bazi in na /api/feedback.
  writeFile() {
    if (!this.file || encryptionOn()) return;
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const tmp = this.file + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(this.list(), null, 2));
      fs.renameSync(tmp, this.file);
    } catch (e) {
      console.warn(`[evklid] povratnih informacij ni bilo mogoče zapisati v ${this.file}: ${e.message}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Povzetek: področja z najslabšimi ocenami najprej, pripombe razvrščene po področjih.

const KEYWORDS = {
  path: /učn\w* pot|nalog|vaj|trening|ponavlj|preizkus|vadnic|task|exercise|practice/i,
  tutor: /inštruktor|instruktor|razlag|klepet|odgovor|tutor|chat|explain|\bai\b|\bumetn/i,
  textbook: /učbenik|ucbenik|lekcij|simulac|poskus|textbook|lesson|simulation/i,
  competition: /tekmovan|competition|contest/i,
  design: /barv|videz|gumb|pregledn|zmed|menij|pisav|ikon|temn|design|colou?r|button|confus|font/i,
  speed: /počas|pocas|hitr|zatika|nalaga|sesu|zmrzn|ne dela|ne deluje|napak|crash|slow|bug|error|lag/i,
  league: /\blig|\bxp\b|točk|tock|lestvic|league|points|streak/i,
};

export function areasOf(text) {
  return AREAS.filter((a) => KEYWORDS[a].test(text));
}

const avg = (xs) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null);
const fmt = (x) => x.toFixed(1).replace(".", ",");
const oneLine = (s) => s.replace(/\s+/g, " ").trim();

export function summarize(entries) {
  const areas = Object.fromEntries(AREAS.map((a) => [a, { ratings: [], complaints: [], praise: [], ideas: [] }]));
  const general = { complaints: [], praise: [], ideas: [], other: [] };
  const recommend = { yes: 0, maybe: 0, no: 0 };
  const put = (bucket, text, who) => {
    if (!text) return;
    const item = { text: oneLine(text), who };
    const hit = areasOf(text);
    if (!hit.length || bucket === "other") general[bucket].push(item);
    if (bucket === "other") return;
    for (const a of hit) areas[a][bucket].push(item);
  };
  for (const e of entries) {
    const who = e.name || `#${e.id}`;
    for (const [a, r] of Object.entries(e.ratings || {})) areas[a]?.ratings.push(r);
    if (e.recommend) recommend[e.recommend]++;
    put("praise", e.good, who);
    put("complaints", e.bad, who);
    put("ideas", e.ideas, who);
    // Pogovor: vprašanje pove, kam sodi odgovor (všeč / težave / spremembe).
    for (const { q, a, k } of e.interview || []) {
      if (k === "used" || /^(nič|nic|ne vem|nothing|no|ne|-)\.?$/i.test(a.trim())) continue;
      const ql = q.toLowerCase();
      const bucket =
        QUESTION_BUCKET[k] ||
        (/všeč|liked|like/.test(ql) ? "praise" : /spremen|dodal|change|add/.test(ql) ? "ideas" : /zatakn|zmed|motil|ni delo|stuck|confus|zaslon|screen/.test(ql) ? "complaints" : "other");
      put(bucket, a, who);
    }
  }
  const rows = AREAS.map((a) => {
    const x = areas[a];
    return { area: a, name: AREA_NAMES[a], avg: avg(x.ratings), n: x.ratings.length, low: x.ratings.filter((r) => r <= 2).length, ...x };
  });
  // Najprej področja, kjer je največ težav: nizka ocena in pritožbe.
  const score = (r) => (r.avg === null ? 0 : 5 - r.avg) * Math.min(r.n, 5) + r.complaints.length * 2 + r.low;
  const priority = rows.filter((r) => r.complaints.length || r.ideas.length || (r.avg !== null && r.avg < 4)).sort((a, b) => score(b) - score(a));
  return { count: entries.length, recommend, rows, priority, general };
}

const quote = (items, max = 8) =>
  items
    .slice(0, max)
    .map((i) => `- »${i.text.length > 300 ? i.text.slice(0, 300) + " …" : i.text}« (${i.who})`)
    .join("\n") + (items.length > max ? `\n- … in še ${items.length - max}` : "");

export function summaryMarkdown(all, now = new Date()) {
  // Želje za trgovino z avatarji gredo v svoj razdelek (tedenska posodobitev kozmetike), ne med ocene aplikacije.
  const wishes = all.filter((e) => e.kind === "cosmetics" && e.ideas).map((e) => ({ text: oneLine(e.ideas), who: e.name || `#${e.id}` }));
  const entries = all.filter((e) => e.kind !== "cosmetics");
  const s = summarize(entries);
  const out = [`# Povratne informacije testerjev`, ``, `Povzetek ${now.toISOString().slice(0, 10)} · ${s.count} mnenj · priporočil bi: da ${s.recommend.yes}, mogoče ${s.recommend.maybe}, ne ${s.recommend.no}`, ``];
  const wishPart = wishes.length ? [``, `## Želje za trgovino z avatarji (${wishes.length})`, ``, quote(wishes.slice().reverse(), 30)] : [];
  if (!s.count) return out.concat(["Še ni mnenj."], wishPart).join("\n") + "\n";
  out.push(`## Ocene po področjih (1–5)`, ``, `| Področje | Povprečje | Ocen | Slabih (1–2) |`, `|---|---|---|---|`);
  for (const r of s.rows) out.push(`| ${r.name} | ${r.avg === null ? "–" : fmt(r.avg)} | ${r.n} | ${r.low} |`);
  out.push(``, `## Predlogi sprememb (najprej najpomembnejše)`, ``);
  let i = 0;
  const item = (title, complaints, ideas) => {
    out.push(`### ${++i}. ${title}`, ``);
    if (complaints.length) out.push(`Težave:`, ``, quote(complaints), ``);
    if (ideas.length) out.push(`Predlogi:`, ``, quote(ideas), ``);
  };
  for (const r of s.priority) item(`${r.name}${r.avg !== null ? ` (ocena ${fmt(r.avg)}/5)` : ""}`, r.complaints, r.ideas);
  if (s.general.complaints.length || s.general.ideas.length) item("Splošno", s.general.complaints, s.general.ideas);
  if (!i) out.push(`Ni pritožb ali predlogov.`);
  if (s.general.other.length) out.push(``, `## Drugi odgovori iz pogovorov`, ``, quote(s.general.other, 12));
  const praise = [...s.rows.flatMap((r) => r.praise), ...s.general.praise];
  const seen = new Set();
  const uniq = praise.filter((p) => !seen.has(p.text) && seen.add(p.text));
  if (uniq.length) out.push(``, `## Kaj je testerjem všeč (tega ne spreminjaj)`, ``, quote(uniq, 12));
  out.push(...wishPart);
  out.push(
    ``,
    `## Kako naprej`,
    ``,
    `V projektu napiši Claudu »uporabi povratne informacije«. Prebere to datoteko (ali data/povratne-informacije.json), iz nje pripravi kratek seznam konkretnih sprememb in ti ga pokaže. Ko odgovoriš »ok« (ali izbereš točke), jih naredi in pošlje novo različico.`,
  );
  return out.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// Pogovor z AI (samo s EVKLID_FEEDBACK_AI=1): Haiku, kratki odgovori, največ 6 vprašanj.

const INTERVIEW_SYSTEM = `Si prijazen anketar za aplikacijo Evklid (AI inštruktor za matematiko, fiziko in kemijo za osnovno in srednjo šolo ter fakulteto: Učna pot z nalogami, Inštruktor za klepet, Učbenik s simulacijami, Tekmovanja, Lige in točke).
S testerjem (pogosto učenec) vodiš kratek pogovor, da izveš, kaj je dobro in kaj ne.
- Vedno zastavi točno eno kratko vprašanje (največ 25 besed), brez uvoda in brez naštevanja.
- Pokrij: kaj je uporabljal, kaj mu je bilo všeč, kje se je zataknil ali kaj ni delovalo (na katerem zaslonu), kaj bi spremenil, ali bi aplikacijo uporabljal.
- Če je odgovor nejasen (npr. »nekaj ni delalo«), enkrat vprašaj po podrobnostih: kateri zaslon, kaj je naredil, kaj je pričakoval.
- Ne zagovarjaj aplikacije, ne obljubljaj sprememb, ne pomagaj pri nalogah.
- Ko imaš dovolj (ali po 6 vprašanjih), se v enem stavku zahvali in na konec dodaj [KONEC].`;

export async function nextInterviewQuestion({ answers, lang = "sl", createFn }) {
  const messages = [{ role: "user", content: `(Začetek pogovora. Jezik pogovora: ${lang}.)` }];
  for (const { q, a } of answers) {
    messages.push({ role: "assistant", content: q });
    messages.push({ role: "user", content: a });
  }
  const create = createFn || ((p) => getClient().messages.create(p));
  const final = await create({ model: MODEL, max_tokens: 200, ...quickParams(MODEL), system: INTERVIEW_SYSTEM, messages });
  const raw = final.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  const done = /\[KONEC\]/.test(raw) || answers.length >= MAX_INTERVIEW_TURNS;
  return { question: raw.replace(/\[KONEC\]/g, "").trim().slice(0, 500), done, usage: final.usage, model: final.model || MODEL };
}

// ---------------------------------------------------------------------------

export function mountFeedback(app, store, { usage, file = null, createFn } = {}) {
  const fb = new FeedbackStore(store.db, file);
  if (purgeOldWishes(store.db)) fb.writeFile();

  // Mnenje je vezano na profil (pri starševskih računih to preveri prijava za /api/students/:id).
  const student = (req, res) => {
    const s = /^\d+$/.test(req.params.id) ? store.getStudent(Number(req.params.id)) : null;
    if (!s) res.status(404).json({ error: "Učenec ne obstaja." });
    return s;
  };

  app.post("/api/students/:id/feedback", (req, res) => {
    const s = student(req, res);
    if (!s) return;
    const entry = normalizeFeedback(req.body);
    if (!entry) return res.status(400).json({ error: "Oceni vsaj eno področje ali napiši pripombo." });
    if (fb.count() >= MAX_ROWS) return res.status(429).json({ error: "Zbranih je že dovolj mnenj. Hvala!" });
    // Želje za trgovino: največ 5 na dan na učenca, da otrok ne zasuje tabele.
    if (entry.kind === "cosmetics" && fb.db.prepare("SELECT COUNT(*) AS n FROM feedback WHERE student_id = ? AND kind = 'cosmetics' AND date(created_at) = date('now')").get(s.id).n >= 5)
      return res.status(429).json({ error: "Za danes je želja dovolj. Hvala!" });
    // Želje za trgovino brez imena (otrok piše prosto besedilo; povzetek pokaže samo #id).
    if (entry.kind === "cosmetics") {
      entry.name = null;
      if (purgeOldWishes(fb.db)) fb.writeFile();
    }
    else if (!entry.name) entry.name = s.name;
    res.status(201).json({ id: fb.add(s.id, entry) });
  });

  app.post("/api/students/:id/feedback/interview", async (req, res) => {
    const s = student(req, res);
    if (!s) return;
    if (!feedbackAiOn()) return res.status(409).json({ error: "Pogovor z AI ni vklopljen." });
    const answers = normalizeFeedback({ interview: req.body?.answers })?.interview || [];
    if (answers.length >= MAX_INTERVIEW_TURNS) return res.json({ question: null, done: true });
    // Trda meja AI (server/meje-ai.js): kratek klic hitrega modela (do 200 izhodnih žetonov) pod mejo profila.
    const hold = usage?.guard ? usage.guard(s.id, callMaxUsd(MODEL, 3000 + Buffer.byteLength(JSON.stringify(answers), "utf8"), 200)) : null;
    if (usage?.guard && !hold) return res.status(429).json(usage.guardBlock(s.id));
    try {
      const r = await nextInterviewQuestion({ answers, lang: cleanText(req.body?.lang, 12) || s.settings.language || "sl", createFn });
      if (r.usage) usage?.log(s.id, r.model, r.usage, "feedback");
      res.json({ question: r.question || null, done: r.done || !r.question });
    } catch (e) {
      console.warn(`[evklid] pogovor za povratne informacije: ${e.message}`);
      res.status(502).json({ error: "AI trenutno ni dosegljiv." });
    } finally {
      hold?.release();
    }
  });

  // Samo na računalniku, kjer teče strežnik.
  const localOnly = (req, res, next) => (isLocalRequest(req) ? next() : res.status(403).json({ error: "Mnenja so vidna samo na računalniku, kjer teče Evklid." }));
  app.get("/api/feedback", localOnly, (_req, res) => {
    const list = fb.list();
    const wishes = list.filter((e) => e.kind === "cosmetics").length;
    res.json({ count: list.length - wishes, wishes, entries: list, summary: summaryMarkdown(list), file });
  });
  app.get("/api/feedback/export", localOnly, (req, res) => {
    const list = fb.list();
    const day = new Date().toISOString().slice(0, 10);
    if (req.query.format === "md") {
      res.attachment(`povratne-informacije-povzetek-${day}.md`).type("text/markdown; charset=utf-8").send(summaryMarkdown(list));
    } else {
      res.attachment(`povratne-informacije-${day}.json`).type("application/json").send(JSON.stringify(list, null, 2));
    }
  });
  return fb;
}
