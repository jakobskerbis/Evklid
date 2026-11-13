// Kovanci in avatar: pravilni odgovori v igrah prinesejo kovance, z njimi učenec kupuje dele avatarja
// (public/avatar.js). Brez pravega denarja. Avatar je edino, kar učenec izbere in vidijo drugi (lige, razred).
import { ITEM, SLOTS, DEFAULT_AVATAR, COINS_PER_CORRECT, COINS_PER_DAY, cleanAvatar } from "../public/avatar.js";
import fs from "node:fs";
import crypto from "node:crypto";
import { ensureKnowledgeTables } from "./zbirke.js";
import { isLocalRequest, purgeOldWishes } from "./feedback.js";
import { unseal } from "./crypto-polje.js";
import { audit } from "./dnevnik-dostopov.js";

export function ensureAvatarTables(db) {
  ensureKnowledgeTables(db); // predmeti za znanje (server/zbirke.js) so tudi del inventarja
  db.exec(`
    CREATE TABLE IF NOT EXISTS coin_events (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS coin_events_student ON coin_events(student_id, created_at);
    CREATE TABLE IF NOT EXISTS avatar_items (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      item TEXT NOT NULL,
      bought_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, item)
    );
    CREATE TABLE IF NOT EXISTS avatar_state (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      equipped TEXT NOT NULL
    );
  `);
  refundBodyColours(db);
}

// Barve telesa so od 29. 10. 2026 brezplačne (j): kdor jih je kupil, dobi kovance nazaj, enkrat na nakup.
function refundBodyColours(db) {
  db.exec(`
    INSERT INTO coin_events (student_id, amount, reason)
    SELECT p.student_id, -SUM(p.amount), 'vračilo: ' || p.reason FROM coin_events p
    WHERE p.reason LIKE 'avatar: body\\_%' ESCAPE '\\' AND p.amount < 0
      AND NOT EXISTS (SELECT 1 FROM coin_events r WHERE r.student_id = p.student_id AND r.reason = 'vračilo: ' || p.reason)
    GROUP BY p.student_id, p.reason;
  `);
}

// Shranjen avatar za prikaz drugim (lige, razred); samo znani deli.
export function publicAvatar(json) {
  if (!json) return null;
  try {
    return cleanAvatar(JSON.parse(json), [], true);
  } catch {
    return null;
  }
}

export class Avatars {
  constructor(db) {
    this.db = db;
    ensureAvatarTables(db);
  }
  balance(id) {
    return this.db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM coin_events WHERE student_id = ?").get(id).s;
  }
  earnedToday(id) {
    return this.db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM coin_events WHERE student_id = ? AND amount > 0 AND reason NOT LIKE 'vračilo:%' AND date(created_at) = date('now')").get(id).s;
  }
  // Kupljeni deli in predmeti za znanje (brez odvzetih).
  owned(id) {
    return this.db
      .prepare("SELECT item FROM avatar_items WHERE student_id = ? UNION SELECT item FROM knowledge_items WHERE student_id = ? AND revoked_at IS NULL")
      .all(id, id)
      .map((r) => r.item);
  }
  // Izbrani deli; brez shranjenega avatarja null (drugi vidijo privzetega).
  equipped(id) {
    const r = this.db.prepare("SELECT equipped FROM avatar_state WHERE student_id = ?").get(id);
    if (!r) return null;
    try {
      return cleanAvatar(JSON.parse(r.equipped), this.owned(id));
    } catch {
      return { ...DEFAULT_AVATAR };
    }
  }
  // Kovanci za pravilne odgovore v igri, največ COINS_PER_DAY na dan.
  award(id, correct, reason) {
    const room = Math.max(0, COINS_PER_DAY - this.earnedToday(id));
    const n = Math.min(room, Math.max(0, Math.floor(correct)) * COINS_PER_CORRECT);
    if (n > 0) this.db.prepare("INSERT INTO coin_events (student_id, amount, reason) VALUES (?, ?, ?)").run(id, n, reason);
    return n;
  }
  buy(id, itemId) {
    const x = ITEM[itemId];
    if (!x) return { error: "unknown" };
    if (x.earn) return { error: "earn" }; // predmeti za znanje niso naprodaj
    if (x.price === 0 || this.owned(id).includes(x.id)) return { ok: true };
    this.db.exec("BEGIN IMMEDIATE");
    try {
      if (this.balance(id) < x.price) {
        this.db.exec("ROLLBACK");
        return { error: "coins" };
      }
      this.db.prepare("INSERT INTO coin_events (student_id, amount, reason) VALUES (?, ?, ?)").run(id, -x.price, `avatar: ${x.id}`);
      this.db.prepare("INSERT OR IGNORE INTO avatar_items (student_id, item) VALUES (?, ?)").run(id, x.id);
      this.db.exec("COMMIT");
      return { ok: true };
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  equip(id, eq) {
    const clean = cleanAvatar(eq, this.owned(id));
    this.db
      .prepare("INSERT INTO avatar_state (student_id, equipped) VALUES (?, ?) ON CONFLICT(student_id) DO UPDATE SET equipped = excluded.equipped")
      .run(id, JSON.stringify(clean));
    return clean;
  }
  // Anonimni seštevki za tedensko posodobitev kozmetike (docs/kozmetika-posodobitve.md): koliko učencev
  // nosi oziroma je kupilo kateri predmet. Samo števila, brez imen; pod TRENDS_MIN učencev nič.
  trends() {
    const rows = this.db.prepare("SELECT equipped FROM avatar_state").all();
    if (rows.length < TRENDS_MIN) return { students: rows.length, enough: false };
    const worn = {};
    for (const r of rows) {
      const eq = publicAvatar(r.equipped) || {};
      for (const slot of SLOTS) for (const id of [].concat(eq[slot] || [])) if (id && !/_none$/.test(id) && id !== DEFAULT_AVATAR[slot]) worn[id] = (worn[id] || 0) + 1;
    }
    const bought = Object.fromEntries(this.db.prepare("SELECT item, COUNT(*) AS n FROM avatar_items GROUP BY item").all().map((r) => [r.item, r.n]));
    // Predmet z manj kot TRENDS_MIN učenci izpustimo, da se iz seštevka ne da sklepati na posameznika.
    const sort = (o) => Object.fromEntries(Object.entries(o).filter(([, n]) => n >= TRENDS_MIN).sort((a, b) => b[1] - a[1]));
    return { students: rows.length, enough: true, worn: sort(worn), bought: sort(bought) };
  }
  view(id) {
    return { coins: this.balance(id), earnedToday: this.earnedToday(id), perDay: COINS_PER_DAY, owned: this.owned(id), equipped: this.equipped(id) || { ...DEFAULT_AVATAR }, saved: !!this.equipped(id) };
  }
}

export const TRENDS_MIN = 3;

// Ključ za izvoz brez prijave: dolg vsaj 24 znakov, primerjava v stalnem času.
export function exportTokenOk(req, env = process.env) {
  const want = String(env.EVKLID_EXPORT_TOKEN || "");
  const got = /^Bearer\s+(\S+)$/i.exec(req.headers?.authorization || "")?.[1] || "";
  if (want.length < 24 || !got) return false;
  const a = crypto.createHash("sha256").update(got).digest();
  const b = crypto.createHash("sha256").update(want).digest();
  return crypto.timingSafeEqual(a, b);
}
const exportAllowed = (req) => exportTokenOk(req) || !!req.parent?.is_admin || isLocalRequest(req);

export function mountAvatar(app, avatars, { loadStudent, trendsFile = null }) {
  // Samo skrbnik, računalnik s strežnikom ali tedenska posodobitev s ključem EVKLID_EXPORT_TOKEN.
  const denied = (res) => res.status(403).json({ error: "Samo za skrbnika." });
  app.get("/api/avatar/trends", (req, res) => (exportAllowed(req) ? res.json(avatars.trends()) : denied(res)));
  // Izvoz za tedensko posodobitev kozmetike (docs/kozmetika-posodobitve.md): anonimni seštevki in želje
  // otrok brez imen in id-jev (samo besedilo, jezik, dan). Pot je mimo gesla in prijave (gate.js,
  // accounts), zato jo varuje ključ ali skrbnik.
  app.get("/api/kozmetika/export", (req, res) => {
    res.set("Cache-Control", "no-store");
    // Brez ključa 404 (kot da poti ni), ključ samo v glavi Authorization.
    if (!exportAllowed(req)) return res.status(404).json({ error: "Ne obstaja." });
    purgeOldWishes(avatars.db);
    const wishes = avatars.db
      .prepare("SELECT ideas, lang, date(created_at) AS day FROM feedback WHERE kind = 'cosmetics' AND ideas IS NOT NULL AND ideas != '' ORDER BY id DESC LIMIT 500")
      .all()
      // ideas je šifrirano (server/crypto-polje.js); prazna želja je zašifrirana kot neprazen niz.
      .map((r) => ({ text: unseal(r.ideas, ""), lang: r.lang || null, day: r.day }))
      .filter((w) => w.text);
    const admin = !!req.parent?.is_admin && !exportTokenOk(req);
    audit(avatars.db, { req, parentId: admin ? req.parent.id : null, actor: admin ? "admin" : "system", action: "cosmetics_export", target: `wishes:${wishes.length}` });
    res.json({ at: new Date().toISOString(), trends: avatars.trends(), wishes });
  });
  // Kopija v data/kozmetika-trendi.json (ob zagonu in vsakih 6 h), da jo tedenska posodobitev prebere brez baze.
  if (trendsFile) {
    const write = () => {
      try {
        fs.writeFileSync(trendsFile, JSON.stringify({ at: new Date().toISOString(), ...avatars.trends() }, null, 2));
      } catch (e) {
        console.warn(`[evklid] kozmetika-trendi: ${e.message}`);
      }
    };
    write();
    setInterval(write, 6 * 3600e3).unref();
  }
  app.get("/api/students/:id/avatar", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.json(avatars.view(s.id));
  });
  app.post("/api/students/:id/avatar/buy", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const r = avatars.buy(s.id, String(req.body?.item || ""));
    if (r.error) return res.status(400).json({ error: r.error === "coins" ? "Premalo kovancev." : r.error === "earn" ? "Ta predmet se odklene samo z znanjem." : "Neznan predmet." });
    res.json(avatars.view(s.id));
  });
  app.post("/api/students/:id/avatar", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const eq = req.body?.equipped;
    if (!eq || typeof eq !== "object" || Object.keys(eq).some((k) => !SLOTS.includes(k))) return res.status(400).json({ error: "Neveljaven avatar." });
    avatars.equip(s.id, eq);
    res.json(avatars.view(s.id));
  });
}
