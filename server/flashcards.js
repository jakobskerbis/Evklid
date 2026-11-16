// Kartice za ponavljanje: pomembna dejstva, ki jih inštruktor zapiše v blok <<KARTICA …>>,
// ali kartice, ki jih učenec doda sam. Ponavljanje z razmiki (Leitnerjeve škatle):
// pravilen priklic premakne kartico v naslednjo škatlo (1, 3, 7, 16, 35, 90 dni),
// napačen jo vrne na začetek (na vrsti takoj, v isti seji še enkrat).

import { seal, unseal, blindIndex } from "./crypto-polje.js";
import { sameSubject } from "./subjects.js";

export const INTERVALS = [1, 3, 7, 16, 35, 90];
export const MAX_PER_REPLY = 3;
export const MAX_CARDS = 2000;
export const MAX_FROM_NOTES = 12;
const FRONT_MAX = 300;
const BACK_MAX = 600;

const clean = (s, max) =>
  String(s ?? "")
    .replace(/\r/g, "")
    .replace(/<<|>>/g, "")
    .trim()
    .slice(0, max);
// Ključ za podvojene kartice: male črke, brez ločil na koncu in odvečnih presledkov.
export const normCard = (front) =>
  clean(front, FRONT_MAX)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[\s.?!:;…]+$/, "")
    .trim();

const view = (r) =>
  r && {
    id: r.id,
    front: unseal(r.front),
    back: unseal(r.back),
    subject: r.subject,
    topic: r.topic,
    topic_id: r.topic_id,
    source: r.source,
    // Kartica iz zapiskov: preverjena (koda in pregled) ali »Iz tvojih zapiskov – nepreverjeno«.
    ...(r.source === "zapiski" ? { checked: r.checked === 1, zapisek_id: r.zapisek_id } : {}),
    box: r.box,
    due: r.due,
    is_due: !!r.is_due,
    reviews: r.reviews,
    lapses: r.lapses,
    created_at: r.created_at,
  };

export class Flashcards {
  constructor(db) {
    this.db = db;
  }

  // Doda kartice; podvojene (isto vprašanje pri istem učencu) preskoči. Vrne dodane kartice.
  // verified = false: kartica iz odgovora inštruktorja čaka na trojno preverjanje (server/verify.js) in je do takrat skrita.
  // Iz zapiskov (source »zapiski«, server/zapiski.js): do MAX_FROM_NOTES kartic, vsaka s svojo oznako c.checked.
  add(studentId, cards, { conversationId = null, topicId = null, subject = null, topic = null, source = "tutor", verified = true, noteId = null } = {}) {
    const added = [];
    if (this.count(studentId) >= MAX_CARDS) return added;
    const ins = this.db.prepare(
      `INSERT OR IGNORE INTO flashcards (student_id, conversation_id, topic_id, subject, topic, front, back, norm, source, verified, zapisek_id, checked)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const max = source === "tutor" ? MAX_PER_REPLY : source === "zapiski" ? MAX_FROM_NOTES : 1;
    for (const c of cards.slice(0, Math.min(max, MAX_CARDS - this.count(studentId)))) {
      const front = clean(c.front, FRONT_MAX);
      const back = clean(c.back, BACK_MAX);
      const norm = normCard(front);
      if (!norm || !back) continue;
      // Besedilo šifrirano, norm je slepi indeks (server/crypto-polje.js); brez ključa oboje nespremenjeno.
      const checked = source === "zapiski" ? (c.checked === true ? 1 : 0) : null;
      const r = ins.run(studentId, conversationId, topicId, subject, topic ? String(topic).slice(0, 80) : null, seal(front), seal(back), blindIndex(norm), source, verified ? 1 : 0, noteId, checked);
      if (r.changes) added.push(this.get(studentId, Number(r.lastInsertRowid), { pending: true }));
    }
    return added;
  }

  // pending = true: tudi kartica, ki še čaka na preverjanje (samo za add); sicer samo preverjene.
  get(studentId, id, { pending = false } = {}) {
    return view(
      this.db
        .prepare("SELECT *, due <= datetime('now') AS is_due FROM flashcards WHERE id = ? AND student_id = ? AND (verified = 1 OR ?)")
        .get(id, studentId, pending ? 1 : 0),
    );
  }

  count(studentId) {
    return this.db.prepare("SELECT COUNT(*) AS n FROM flashcards WHERE student_id = ?").get(studentId).n;
  }

  // subject: le kartice izbranega predmeta (in kartice brez predmeta); brez njega vse.
  dueCount(studentId, subject = null) {
    return this.db
      .prepare("SELECT subject FROM flashcards WHERE student_id = ? AND verified = 1 AND due <= datetime('now')")
      .all(studentId)
      .filter((r) => sameSubject(r.subject, subject)).length;
  }

  // Vse kartice: najprej tiste na vrsti (najstarejše najprej), nato po času nastanka.
  list(studentId, subject = null) {
    const all = this.db
      .prepare(
        `SELECT *, due <= datetime('now') AS is_due FROM flashcards WHERE student_id = ? AND verified = 1
         ORDER BY is_due DESC, CASE WHEN due <= datetime('now') THEN due END, id DESC`,
      )
      .all(studentId)
      .filter((r) => sameSubject(r.subject, subject));
    const rows = all.slice(0, MAX_CARDS).map(view);
    // Kdaj je na vrsti naslednja kartica (za besedilo »naslednja jutri«).
    const next = all.filter((r) => !r.is_due).reduce((d, r) => (!d || r.due < d ? r.due : d), null);
    return { cards: rows, total: rows.length, due: rows.filter((c) => c.is_due).length, next_due: next || null };
  }

  // ok = true (znal sem) | false (še ne znam).
  review(studentId, id, ok) {
    const c = this.get(studentId, id);
    if (!c) return null;
    if (ok) {
      const box = Math.min(c.box + 1, INTERVALS.length);
      this.db
        .prepare(
          `UPDATE flashcards SET box = ?, due = datetime('now', ?), reviews = reviews + 1, last_review = datetime('now') WHERE id = ?`,
        )
        .run(box, `+${INTERVALS[box - 1]} days`, id);
    } else {
      this.db
        .prepare(
          `UPDATE flashcards SET box = 0, due = datetime('now'), reviews = reviews + 1, lapses = lapses + 1, last_review = datetime('now') WHERE id = ?`,
        )
        .run(id);
    }
    return this.get(studentId, id);
  }

  update(studentId, id, { front, back }) {
    const c = this.get(studentId, id);
    if (!c) return null;
    const f = front === undefined ? c.front : clean(front, FRONT_MAX);
    const b = back === undefined ? c.back : clean(back, BACK_MAX);
    if (!normCard(f) || !b) return { error: "empty" };
    try {
      // Popravljena kartica iz zapiskov ni več preverjena (besedilo je učenčevo).
      this.db.prepare("UPDATE flashcards SET front = ?, back = ?, norm = ?, checked = CASE WHEN source = 'zapiski' THEN 0 ELSE checked END WHERE id = ?").run(seal(f), seal(b), blindIndex(normCard(f)), id);
    } catch {
      return { error: "duplicate" };
    }
    return this.get(studentId, id);
  }

  // Po preverjanju: pravilne kartice postanejo vidne, druge se izbrišejo.
  settle(ids, ok) {
    const st = this.db.prepare(ok ? "UPDATE flashcards SET verified = 1 WHERE id = ?" : "DELETE FROM flashcards WHERE id = ? AND verified = 0");
    for (const id of ids) st.run(id);
  }

  remove(studentId, id) {
    return this.db.prepare("DELETE FROM flashcards WHERE id = ? AND student_id = ?").run(id, studentId).changes > 0;
  }
}
