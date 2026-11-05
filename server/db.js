// Shramba (SQLite, vgrajen v Node 22).
import "./env.js";
import { BRAND, LEGACY } from "./brand.js";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { DEFAULT_SETTINGS, normalizeSettings, normalizeWeaknessList } from "./settings.js";
import { DEFAULT_GOAL } from "../public/goal-data.js";
import { Flashcards } from "./flashcards.js";
import { seal, unseal, sealJson, unsealJson, UNREADABLE } from "./crypto-polje.js";

// Šibke točke: kako dolgo hranimo dnevne vsote (skill_results) in oznake »že šteto« (skill_seen).
export const SKILL_KEEP_DAYS = 365;

// Baza ima ime aplikacije (data/<ime>.db). Ob prvem zagonu po preimenovanju prepišemo najnovejšo
// bazo s prejšnjim imenom (brand.json → legacy) v novo (VACUUM INTO zajame tudi neshranjeni WAL).
// Stara datoteka ostane kot varnostna kopija in za morebitno vrnitev na prejšnjo različico.
export function migrateLegacyDb(file) {
  if (file === ":memory:" || path.basename(file) !== `${BRAND.slug}.db` || fs.existsSync(file)) return false;
  const old = LEGACY.map((l) => path.join(path.dirname(file), `${l.slug}.db`)).find((f) => fs.existsSync(f));
  if (!old) return false;
  const src = new DatabaseSync(old);
  try {
    src.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
  } finally {
    src.close();
  }
  return true;
}

export function openDb(file = process.env.EVKLID_DB || `data/${BRAND.slug}.db`) {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  migrateLegacyDb(file);
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      settings TEXT NOT NULL,
      manual_weaknesses TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'Nov pogovor',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY,
      conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('user','assistant')),
      api_content TEXT NOT NULL,   -- vsebina, kot gre v API (JSON)
      display_text TEXT NOT NULL,  -- besedilo za prikaz (brez META)
      has_image INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE, -- NULL pri vajah
      message_id INTEGER REFERENCES messages(id) ON DELETE SET NULL,
      subject TEXT,
      topic TEXT,
      error INTEGER NOT NULL DEFAULT 0,
      mode TEXT,
      flag TEXT NOT NULL DEFAULT 'none',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      topic_id TEXT                              -- tema učne poti (šibke točke, server/weaknesses.js)
    );
    -- Stanje učenca pri posamezni temi učne poti
    CREATE TABLE IF NOT EXISTS topic_state (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      topic_id TEXT NOT NULL,
      level INTEGER NOT NULL DEFAULT 1,          -- težavnost 1–3
      streak INTEGER NOT NULL DEFAULT 0,         -- zaporedni pravilni odgovori
      status TEXT NOT NULL DEFAULT 'new',        -- new | learning | mastered
      source TEXT,                               -- practice | chat | placement
      mastered_at TEXT,
      review_stage INTEGER NOT NULL DEFAULT 0,   -- 0..4 (1, 3, 7, 21 dni)
      review_due TEXT,
      seen_example INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, topic_id)
    );
    -- Naloge iz generatorja (odgovor ostane na strežniku)
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      topic_id TEXT NOT NULL,
      mode TEXT NOT NULL DEFAULT 'practice',     -- practice | review | placement
      session_id TEXT,                           -- skupina nalog (preizkus, ponavljanje)
      level INTEGER NOT NULL,
      payload TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      hint_used INTEGER NOT NULL DEFAULT 0,
      solved INTEGER NOT NULL DEFAULT 0,
      first_try_correct INTEGER,
      last_answer TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_topic ON tasks(student_id, topic_id, id);
    CREATE TABLE IF NOT EXISTS xp_events (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_xp ON xp_events(student_id, created_at);
    -- Poraba AI (žetoni in strošek)
    CREATE TABLE IF NOT EXISTS usage (
      id INTEGER PRIMARY KEY,
      student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
      model TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'chat',
      input_tokens INTEGER NOT NULL DEFAULT 0,
      output_tokens INTEGER NOT NULL DEFAULT 0,
      cache_read_tokens INTEGER NOT NULL DEFAULT 0,
      cache_write_tokens INTEGER NOT NULL DEFAULT 0,
      cost_usd REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_usage ON usage(created_at);
    -- Ponovna uporaba odgovorov na enaka prva vprašanja (brez slike)
    CREATE TABLE IF NOT EXISTS answer_cache (
      key TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      hits INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    -- Seje vaj (ponavljanje, preizkus, dnevni trening, priprava na test, vaja sklopa).
    -- Naloge se ustvarijo sproti po načrtu, da se težavnost lahko prilagaja.
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,                        -- review | placement | daily | test | unit
      params TEXT NOT NULL DEFAULT '{}',
      plan TEXT NOT NULL,                        -- [{topic, mode, level?}]
      finished INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_sessions ON sessions(student_id, kind, finished);
    -- Načrt priprave na test (en na učenca)
    CREATE TABLE IF NOT EXISTS test_plans (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      path_key TEXT NOT NULL,
      units TEXT NOT NULL,                       -- indeksi sklopov
      test_date TEXT NOT NULL,                   -- YYYY-MM-DD
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    -- Odgovori na naloge, rešene brez povezave (da se ista naloga ne prešteje dvakrat)
    CREATE TABLE IF NOT EXISTS offline_results (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      topic_id TEXT NOT NULL,
      seed INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, topic_id, seed)
    );
    -- Kartice za ponavljanje (od inštruktorja ali lastne), ponavljanje z razmiki
    CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      conversation_id INTEGER REFERENCES conversations(id) ON DELETE SET NULL,
      topic_id TEXT,                             -- tema učne poti (če je pogovor o njej)
      subject TEXT,
      topic TEXT,                                -- ime teme iz META
      front TEXT NOT NULL,                       -- vprašanje
      back TEXT NOT NULL,                        -- odgovor
      norm TEXT NOT NULL,                        -- vprašanje za iskanje podvojenih
      source TEXT NOT NULL DEFAULT 'tutor',      -- tutor | own
      box INTEGER NOT NULL DEFAULT 0,            -- 0 = novo ali pozabljeno, 1..6 = škatle (1, 3, 7, 16, 35, 90 dni)
      due TEXT NOT NULL DEFAULT (datetime('now')),
      reviews INTEGER NOT NULL DEFAULT 0,
      lapses INTEGER NOT NULL DEFAULT 0,
      last_review TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (student_id, norm)
    );
    CREATE INDEX IF NOT EXISTS idx_cards_due ON flashcards(student_id, due);
    -- Šibke točke iz iger, učbenika, pol, kartic in kviza (server/weaknesses.js): samo dnevne vsote po temi,
    -- brez odgovorov in časov posameznih nalog. Klepet in Vadnica sta v events.
    CREATE TABLE IF NOT EXISTS skill_results (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      day TEXT NOT NULL,                         -- YYYY-MM-DD (UTC)
      source TEXT NOT NULL,                      -- game | lesson | paper | cards | kviz
      key TEXT NOT NULL,                         -- id teme ali »~ime« (tema, ki je ni bilo mogoče preslikati)
      topic_id TEXT,
      subject TEXT,
      topic TEXT,
      n INTEGER NOT NULL DEFAULT 0,
      wrong INTEGER NOT NULL DEFAULT 0,
      last_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, day, source, key)
    );
    CREATE INDEX IF NOT EXISTS idx_skill_results_day ON skill_results(day);
    -- Kar je za šibke točke že šteto (vprašanje lekcije na dan, del pole enkrat).
    CREATE TABLE IF NOT EXISTS skill_seen (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      item TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (date('now')), -- samo dan (brez ure)
      PRIMARY KEY (student_id, item)
    );
    CREATE INDEX IF NOT EXISTS idx_msg_conv ON messages(conversation_id, id);
    CREATE INDEX IF NOT EXISTS idx_events_student ON events(student_id, created_at);
    -- Sprotni povzetek starejšega dela dolgega pogovora (server/povzetek.js), šifriran; upto = število
    -- sporočil, ki jih povzetek pokrije. Izbriše se s pogovorom.
    CREATE TABLE IF NOT EXISTS conversation_summaries (
      conversation_id INTEGER PRIMARY KEY REFERENCES conversations(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      upto INTEGER NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  // Migracije za starejše baze
  const studentCols = db.prepare("PRAGMA table_info(students)").all().map((c) => c.name);
  // Kdaj je učenec nazadnje spremenil šolo ali letnik (za predlog prehoda na začetku šolskega leta).
  if (!studentCols.includes("level_changed_at")) db.exec("ALTER TABLE students ADD COLUMN level_changed_at TEXT");
  // Od kod je profil prišel (server/rast.js): kratka oznaka iz povezave, »priporocilo« ali »razred«; brez piškotkov in IP.
  if (!studentCols.includes("vir")) db.exec("ALTER TABLE students ADD COLUMN vir TEXT");
  migrateTrackToGoal(db);
  // Začetni test predznanja teme: koliko stopenj (0–3) je učenec rešil zapored od lažje proti težji.
  const stateCols = db.prepare("PRAGMA table_info(topic_state)").all().map((c) => c.name);
  if (!stateCols.includes("pretest")) db.exec("ALTER TABLE topic_state ADD COLUMN pretest INTEGER");
  const convCols = db.prepare("PRAGMA table_info(conversations)").all().map((c) => c.name);
  if (!convCols.includes("path_topic")) db.exec("ALTER TABLE conversations ADD COLUMN path_topic TEXT");
  if (!convCols.includes("deep")) db.exec("ALTER TABLE conversations ADD COLUMN deep INTEGER NOT NULL DEFAULT 0");
  // Trojno preverjanje (server/verify.js): shranjen odgovor in kartica sta vidna šele, ko sta preverjena.
  // Stari shranjeni odgovori niso bili preverjeni, zato ostanejo skriti (privzeto 0); stare kartice ostanejo.
  const cacheCols = db.prepare("PRAGMA table_info(answer_cache)").all().map((c) => c.name);
  if (!cacheCols.includes("verified")) db.exec("ALTER TABLE answer_cache ADD COLUMN verified INTEGER NOT NULL DEFAULT 0");
  const cardCols = db.prepare("PRAGMA table_info(flashcards)").all().map((c) => c.name);
  if (!cardCols.includes("verified")) db.exec("ALTER TABLE flashcards ADD COLUMN verified INTEGER NOT NULL DEFAULT 1");
  // Priprava na test, ki jo je nastavil test iz urnika (server/schedule.js).
  const planCols = db.prepare("PRAGMA table_info(test_plans)").all().map((c) => c.name);
  if (!planCols.includes("event_id")) db.exec("ALTER TABLE test_plans ADD COLUMN event_id TEXT");
  // Starejše baze: events.conversation_id je bil NOT NULL, vaje (brez pogovora) pa zapisujejo NULL.
  const convIdCol = db.prepare("PRAGMA table_info(events)").all().find((c) => c.name === "conversation_id");
  if (convIdCol?.notnull) {
    db.exec(`
      BEGIN;
      CREATE TABLE events_new (
        id INTEGER PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        message_id INTEGER REFERENCES messages(id) ON DELETE SET NULL,
        subject TEXT,
        topic TEXT,
        error INTEGER NOT NULL DEFAULT 0,
        mode TEXT,
        flag TEXT NOT NULL DEFAULT 'none',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      INSERT INTO events_new (id, student_id, conversation_id, message_id, subject, topic, error, mode, flag, created_at)
        SELECT id, student_id, conversation_id, message_id, subject, topic, error, mode, flag, created_at FROM events;
      DROP TABLE events;
      ALTER TABLE events_new RENAME TO events;
      CREATE INDEX IF NOT EXISTS idx_events_student ON events(student_id, created_at);
      COMMIT;
    `);
  }
  // Tema učne poti pri dogodku (šibke točke iz vseh virov pod istim ključem, server/weaknesses.js).
  const eventCols = db.prepare("PRAGMA table_info(events)").all().map((c) => c.name);
  if (!eventCols.includes("topic_id")) db.exec("ALTER TABLE events ADD COLUMN topic_id TEXT");
  // Rok hrambe dnevnih vsot za šibke točke.
  db.prepare("DELETE FROM skill_results WHERE day < date('now', ?)").run(`-${SKILL_KEEP_DAYS} days`);
  db.prepare("DELETE FROM skill_seen WHERE created_at < date('now', ?)").run(`-${SKILL_KEEP_DAYS} days`);
  const store = new Store(db);
  store.file = file; // za dnevne varnostne kopije (server/kopije.js)
  return store;
}

// Izbirnik »Program« je odstranjen (j, 4. 11. 2026, »Samo Cilj«); track se zdaj izpelje iz cilja (server/settings.js).
// Profil, ki je imel Program = Tekmovanja in privzeti cilj (sprotno učenje), dobi cilj tekmovanje, da ostane v
// tekmovalnem načinu. Izrecno izbran drug cilj (test, NPZ, matura) ohranimo: cilj ima prednost. Enkratno: po
// zapisu ima vrstica track izpeljan iz cilja; vrne število prepisanih vrstic (drugi zagon: 0).
export function migrateTrackToGoal(db) {
  const rows = db.prepare(`SELECT id, settings FROM students WHERE settings LIKE '%"track":"COMPETITION"%'`).all();
  const save = db.prepare("UPDATE students SET settings = ? WHERE id = ?");
  let changed = 0;
  for (const row of rows) {
    let raw;
    try {
      raw = JSON.parse(row.settings);
    } catch {
      continue;
    }
    if (raw.track !== "COMPETITION") continue;
    const keepGoal = raw.goal && raw.goal !== DEFAULT_GOAL;
    const next = normalizeSettings(keepGoal ? raw : { ...raw, goal: "tekmovanje" });
    const json = JSON.stringify(next);
    if (json === row.settings) continue;
    save.run(json, row.id);
    changed++;
  }
  return changed;
}

const parseStudent = (row) =>
  row && {
    id: row.id,
    name: row.name,
    settings: normalizeSettings(JSON.parse(row.settings)),
    manual_weaknesses: JSON.parse(row.manual_weaknesses),
    created_at: row.created_at,
    level_since: row.level_changed_at || row.created_at,
  };

// Branje šifriranih polj; neberljiva vrstica dobi nadomestno besedilo (strežnik se ne ustavi).
const openConv = (c) => c && { ...c, title: unseal(c.title) };
export const openMessage = (m) => ({
  ...m,
  display_text: unseal(m.display_text),
  api_content: unsealJson(m.api_content, [{ type: "text", text: UNREADABLE }]),
});

export class Store {
  constructor(db) {
    this.db = db;
    this.cards = new Flashcards(db);
  }

  // --- učenci ---
  listStudents() {
    return this.db.prepare("SELECT * FROM students ORDER BY id").all().map(parseStudent);
  }
  getStudent(id) {
    return parseStudent(this.db.prepare("SELECT * FROM students WHERE id = ?").get(id));
  }
  // Isti učenec (ime in nastavitve), ustvarjen v zadnji minuti: dvojni klik ali ponovljena zahteva.
  recentDuplicate(name, settings = DEFAULT_SETTINGS) {
    const row = this.db
      .prepare("SELECT * FROM students WHERE name = ? AND settings = ? AND created_at >= datetime('now', '-60 seconds') ORDER BY id DESC LIMIT 1")
      .get(name, JSON.stringify(normalizeSettings(settings)));
    return row ? parseStudent(row) : null;
  }
  createStudent(name, settings = DEFAULT_SETTINGS) {
    const r = this.db
      .prepare("INSERT INTO students (name, settings) VALUES (?, ?)")
      .run(name, JSON.stringify(normalizeSettings(settings)));
    return this.getStudent(Number(r.lastInsertRowid));
  }
  updateStudent(id, { name, settings, manual_weaknesses }) {
    const cur = this.getStudent(id);
    if (!cur) return null;
    const next = normalizeSettings({ ...cur.settings, ...(settings || {}) });
    const levelChanged = ["educational_track", "curriculum_level", "study_program", "school_system"].some((k) => next[k] !== cur.settings[k]);
    this.db
      .prepare(
        `UPDATE students SET name = ?, settings = ?, manual_weaknesses = ?${levelChanged ? ", level_changed_at = datetime('now')" : ""} WHERE id = ?`,
      )
      .run(
        name ?? cur.name,
        JSON.stringify(next),
        JSON.stringify(manual_weaknesses !== undefined ? normalizeWeaknessList(manual_weaknesses) : cur.manual_weaknesses),
        id,
      );
    return this.getStudent(id);
  }
  deleteStudent(id) {
    return this.db.prepare("DELETE FROM students WHERE id = ?").run(id).changes > 0;
  }

  // --- pogovori (naslov je začetek učenčevega vprašanja, zato šifriran; server/crypto-polje.js) ---
  listConversations(studentId) {
    return this.db
      .prepare("SELECT * FROM conversations WHERE student_id = ? ORDER BY updated_at DESC, id DESC")
      .all(studentId)
      .map(openConv);
  }
  getConversation(id) {
    return openConv(this.db.prepare("SELECT * FROM conversations WHERE id = ?").get(id));
  }
  createConversation(studentId, { pathTopic = null, title = "Nov pogovor" } = {}) {
    const r = this.db
      .prepare("INSERT INTO conversations (student_id, path_topic, title) VALUES (?, ?, ?)")
      .run(studentId, pathTopic, seal(title));
    return this.getConversation(Number(r.lastInsertRowid));
  }
  renameConversation(id, title) {
    this.db.prepare("UPDATE conversations SET title = ? WHERE id = ?").run(seal(title), id);
  }
  touchConversation(id) {
    this.db.prepare("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?").run(id);
  }
  deleteConversation(id) {
    return this.db.prepare("DELETE FROM conversations WHERE id = ?").run(id).changes > 0;
  }

  // --- sporočila ---
  addMessage(conversationId, role, apiContent, displayText, hasImage = false) {
    const r = this.db
      .prepare(
        "INSERT INTO messages (conversation_id, role, api_content, display_text, has_image) VALUES (?, ?, ?, ?, ?)",
      )
      .run(conversationId, role, sealJson(apiContent), seal(displayText), hasImage ? 1 : 0);
    this.touchConversation(conversationId);
    return Number(r.lastInsertRowid);
  }
  listMessages(conversationId) {
    return this.db
      .prepare("SELECT * FROM messages WHERE conversation_id = ? ORDER BY id")
      .all(conversationId)
      .map(openMessage);
  }
  // Zamenja vsebino uporabnikovega sporočila (npr. odstranjena fotografija, server/zasebnost.js).
  setMessageContent(id, apiContent, hasImage) {
    this.db.prepare("UPDATE messages SET api_content = ?, has_image = ? WHERE id = ?").run(sealJson(apiContent), hasImage, id);
  }
  // Sprotni povzetek pogovora (server/povzetek.js): { text, upto } ali null (tudi neberljiv po menjavi ključa).
  getSummary(conversationId) {
    const r = this.db.prepare("SELECT text, upto FROM conversation_summaries WHERE conversation_id = ?").get(conversationId);
    const text = r ? unseal(r.text, null) : null;
    return text ? { text, upto: r.upto } : null;
  }
  setSummary(conversationId, text, upto) {
    this.db
      .prepare(
        `INSERT INTO conversation_summaries (conversation_id, text, upto) VALUES (?, ?, ?)
         ON CONFLICT(conversation_id) DO UPDATE SET text = excluded.text, upto = excluded.upto, updated_at = datetime('now')`,
      )
      .run(conversationId, seal(text), upto);
  }
  // Zgodovina za API: dosledno zaporedje, brez sprememb že poslanih blokov.
  apiHistory(conversationId) {
    return this.listMessages(conversationId).map((m) => ({ role: m.role, content: m.api_content }));
  }

  // --- analitika ---
  addEvent(e) {
    this.db
      .prepare(
        `INSERT INTO events (student_id, conversation_id, message_id, subject, topic, error, mode, flag, topic_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(e.student_id, e.conversation_id, e.message_id ?? null, e.subject, e.topic, e.error, e.mode, e.flag, e.topic_id ?? null);
  }
  lastEvent(conversationId) {
    return this.db
      .prepare("SELECT * FROM events WHERE conversation_id = ? ORDER BY id DESC LIMIT 1")
      .get(conversationId);
  }
  topicStats(studentId, days = 60) {
    return this.db
      .prepare(
        `SELECT subject, topic, COUNT(*) AS turns, SUM(error) AS errors, MAX(created_at) AS last_seen
         FROM events
         WHERE student_id = ? AND topic IS NOT NULL AND created_at >= datetime('now', ?)
         GROUP BY subject, topic
         ORDER BY last_seen DESC`,
      )
      .all(studentId, `-${days} days`);
  }
  flagEvents(studentId, limit = 50) {
    return this.db
      .prepare(
        `SELECT e.flag, e.created_at, e.conversation_id, c.title
         FROM events e JOIN conversations c ON c.id = e.conversation_id
         WHERE e.student_id = ? AND e.flag NOT IN ('none', 'photo') -- zavrnjena fotografija ni opozorilo za starše
         ORDER BY e.id DESC LIMIT ?`,
      )
      .all(studentId, limit)
      .map(openConv);
  }
  // XP po dnevih (vse dejavnosti: lekcije, vaje, igre, inštruktor) za koledar aktivnosti na Napredku in strani Jaz.
  xpByDay(studentId, days = 371) {
    return this.db
      .prepare(
        `SELECT date(created_at) AS day, SUM(amount) AS xp FROM xp_events
         WHERE student_id = ? AND created_at >= datetime('now', ?) GROUP BY day ORDER BY day`,
      )
      .all(studentId, `-${days} days`);
  }
  activityByDay(studentId, days = 30) {
    return this.db
      .prepare(
        `SELECT date(created_at) AS day, COUNT(*) AS turns, SUM(error) AS errors
         FROM events WHERE student_id = ? AND created_at >= datetime('now', ?)
         GROUP BY day ORDER BY day`,
      )
      .all(studentId, `-${days} days`);
  }
}
