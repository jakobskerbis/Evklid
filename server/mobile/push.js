// Potisna obvestila v mobilno aplikacijo (Expo Push: ena pot za APNs na iPhonu in FCM na Androidu).
// Aplikacija sama nastavi lokalni dnevni opomnik za vajo; strežnik pošlje le to, česar telefon ne ve:
// opomnik cilja (npr. »Matura: še 30 dni«) ob 12.00, enkrat na dan za vsakega otroka.
import express from "express";
import { ljNow, reminderDays } from "../accounts/goal-reminder.js";

// Besedilo iz zahteve; drugačna vrednost (predmet, število) šteje kot prazna, da ni napake 500.
const text = (v) => (typeof v === "string" ? v : "");

const EXPO_PUSH = "https://exp.host/--/api/v2/push/send";
const TOKEN_RE = /^Expo(nent)?PushToken\[[A-Za-z0-9_-]{10,200}\]$/;
const NAMES = { sprotno: "Sprotno učenje", test: "Test v šoli", npz: "NPZ", matura: "Matura", tekmovanje: "Tekmovanje", izpit: "Izpit" };
const daysWord = (n) => (n % 100 === 1 ? "dan" : n % 100 === 2 ? "dneva" : n % 100 === 3 || n % 100 === 4 ? "dnevi" : "dni");

export function migratePush(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS push_tokens (
      token TEXT PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      platform TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_push_tokens_parent ON push_tokens(parent_id);
    CREATE TABLE IF NOT EXISTS push_log (
      parent_id INTEGER NOT NULL,
      kind TEXT NOT NULL,
      period TEXT NOT NULL,
      PRIMARY KEY (parent_id, kind, period)
    );
  `);
  // Izbris računa: dnevnik obvestil (brez tuje povezave) gre z njim.
  if (db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'parents'").get()) {
    db.exec(`CREATE TRIGGER IF NOT EXISTS push_log_parent_delete AFTER DELETE ON parents BEGIN
      DELETE FROM push_log WHERE parent_id = OLD.id;
    END;`);
  }
}

export function goalPushText(child, n) {
  const s = child.settings || {};
  const goal = NAMES[s.goal] || NAMES.sprotno;
  return {
    title: `${goal}: ${n === 0 ? "danes je dan cilja" : `še ${n} ${daysWord(n)}`}`,
    body: `${child.name}, danes 15 minut vaje? Današnji trening te čaka.`,
  };
}

export function mountPush(app, ctx, opts = {}) {
  const { db, children } = ctx;
  const fetchFn = opts.fetchFn || fetch;
  const log = opts.log || console;
  migratePush(db);
  const json = express.json({ limit: "8kb" });

  app.post("/api/push/register", json, (req, res) => {
    const token = text(req.body?.token);
    if (!TOKEN_RE.test(token)) return res.status(400).json({ error: "Napačen žeton obvestil." });
    const platform = ["ios", "android"].includes(req.body?.platform) ? req.body.platform : "";
    // Žeton pripada napravi: ob prijavi z drugim računom gre k novemu računu.
    db.prepare(
      `INSERT INTO push_tokens (token, parent_id, platform) VALUES (?, ?, ?)
       ON CONFLICT(token) DO UPDATE SET parent_id = excluded.parent_id, platform = excluded.platform, updated_at = datetime('now')`,
    ).run(token, req.parent.id, platform);
    res.json({ ok: true });
  });
  app.post("/api/push/unregister", json, (req, res) => {
    db.prepare("DELETE FROM push_tokens WHERE token = ? AND parent_id = ?").run(text(req.body?.token), req.parent.id);
    res.json({ ok: true });
  });

  async function sendPush(parentId, { title, body, data = {} }) {
    const tokens = db.prepare("SELECT token FROM push_tokens WHERE parent_id = ?").all(parentId).map((r) => r.token);
    if (!tokens.length) return 0;
    const r = await fetchFn(EXPO_PUSH, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(tokens.map((to) => ({ to, title, body, data, sound: "default" }))),
      signal: AbortSignal.timeout(10000),
    });
    const out = await r.json().catch(() => ({}));
    let ok = 0;
    (out.data || []).forEach((t, i) => {
      if (t.status === "ok") ok++;
      else if (t.details?.error === "DeviceNotRegistered") db.prepare("DELETE FROM push_tokens WHERE token = ?").run(tokens[i]);
    });
    return ok;
  }

  async function sendGoalPushAll(now = new Date()) {
    const { date } = ljNow(now);
    const parents = db.prepare("SELECT DISTINCT parent_id AS id FROM push_tokens").all();
    let sent = 0;
    for (const { id } of parents) {
      for (const child of children(id)) {
        const n = reminderDays(child, date);
        if (n === null) continue;
        const claim = db.prepare("INSERT OR IGNORE INTO push_log (parent_id, kind, period) VALUES (?, 'goal', ?)").run(id, `${date}:${child.id}`);
        if (!claim.changes) continue;
        try {
          sent += await sendPush(id, { ...goalPushText(child, n), data: { student_id: child.id, view: "path" } });
        } catch (err) {
          log.error?.("[evklid] potisno obvestilo:", err.message);
        }
      }
    }
    return sent;
  }

  if (opts.scheduler !== false && process.env.EVKLID_PUSH !== "0") {
    const timer = setInterval(() => {
      if (ljNow().hour >= 12) sendGoalPushAll().catch((e) => log.error?.("[evklid] potisna obvestila:", e.message));
    }, 30 * 60000);
    timer.unref();
  }
  return { sendPush, sendGoalPushAll };
}
