// Dnevnik dostopov (audit log): prijave, izvoz in izbris računa, gesla, dejanja skrbnika in učiteljev.
// Brez e-naslovov in brez surovih naslovov IP: ip_hash je HMAC-SHA256 s skrivnostjo strežnika (prvih 16 hex).
// Ob izbrisu računa vrstice ostanejo brez parent_id. Branje: node scripts/dnevnik-dostopov.js [e-naslov].
import crypto from "node:crypto";
import { auditSecret } from "./crypto-polje.js";

export const ACTORS = ["parent", "admin", "teacher", "system"];
const secrets = new WeakMap(); // db -> skrivnost

export function ensureAuditTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY,
      at TEXT NOT NULL DEFAULT (datetime('now')),
      parent_id INTEGER,                   -- brez tujega ključa: ob izbrisu računa ga nastavimo na NULL
      actor TEXT NOT NULL,                 -- parent | admin | teacher | system
      action TEXT NOT NULL,                -- npr. login, login_fail, export, account_delete
      target TEXT,                         -- npr. student:12, licence:3, class:AB12
      ip_hash TEXT,
      ok INTEGER NOT NULL DEFAULT 1
    );
    CREATE INDEX IF NOT EXISTS idx_audit_parent ON audit_log(parent_id, at);
    CREATE INDEX IF NOT EXISTS idx_audit_at ON audit_log(at);
  `);
}

export function ipHash(db, ip) {
  if (!ip) return null;
  let s = secrets.get(db);
  if (!s) secrets.set(db, (s = auditSecret(db)));
  return crypto.createHmac("sha256", s).update(String(ip)).digest("hex").slice(0, 16);
}

// Zapis v dnevnik; napaka pri zapisu nikoli ne ustavi zahteve.
export function audit(db, { req = null, parentId = null, actor = "parent", action, target = null, ok = true }) {
  try {
    ensureAuditTable(db);
    db.prepare("INSERT INTO audit_log (parent_id, actor, action, target, ip_hash, ok) VALUES (?, ?, ?, ?, ?, ?)").run(
      parentId ?? null,
      ACTORS.includes(actor) ? actor : "system",
      String(action),
      target === null || target === undefined ? null : String(target).slice(0, 80),
      ipHash(db, req?.ip),
      ok ? 1 : 0,
    );
  } catch (e) {
    console.warn(`[evklid] dnevnik dostopov: ${e.message}`);
  }
}

// Ob izbrisu računa: vrstice ostanejo (varnostna sled), a brez povezave na račun.
export function detachAudit(db, parentId) {
  ensureAuditTable(db);
  db.prepare("UPDATE audit_log SET parent_id = NULL WHERE parent_id = ?").run(parentId);
}

export function auditFor(db, parentId, limit = 200) {
  ensureAuditTable(db);
  return parentId === undefined
    ? db.prepare("SELECT * FROM audit_log ORDER BY id DESC LIMIT ?").all(limit)
    : db.prepare("SELECT * FROM audit_log WHERE parent_id = ? ORDER BY id DESC LIMIT ?").all(parentId, limit);
}
