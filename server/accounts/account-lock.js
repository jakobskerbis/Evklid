// Zaklep računa (j, 2026-10-30): zavihek Račun in dejanja lastnika računa (naročnina, profili,
// izvoz, izbris) zahtevajo geslo računa, da jih otrok na isti napravi ne more odpreti.
// Odklep velja na tej napravi ACCOUNT_UNLOCK_MIN minut od zadnje uporabe; ob prijavi je naprava odklenjena.

export const ACCOUNT_UNLOCK_MIN = () => Number(process.env.EVKLID_ACCOUNT_UNLOCK_MIN) || 10;

// Poti (relativno na /api), ki so samo za lastnika računa.
const OWNER_ONLY = [
  [/^\/account\/?$/i, null], // GET, PUT, DELETE
  [/^\/account\/(export|promo|logout-others|weekly-report\/[a-z]+)\/?$/i, null],
  [/^\/account\/birth-date\/?$/i, "POST"], // datum rojstva imetnika: otrok ga na starševi napravi ne sme vpisati
  [/^\/account\/(pilot-wtp|privacy-seen|owner-code)\/?$/i, "POST"], // vprašanje o plačilu, obvestilo o zasebnosti, koda imetnika: samo imetnik
  [/^\/account\/pilot-photos\/\d+\/?$/i, "DELETE"], // izbris fotografij pilota v Računu (pregled B3)
  [/^\/account\/ustno-glas\/?$/i, null], // stikalo starša »Dovoli odgovarjanje z glasom« (server/ustno-api.js): samo imetnik
  [/^\/billing\/(checkout|portal)\/?$/i, null],
  [/^\/admin(\/|$)/i, null],
  [/^\/prijave\/(izvoz|[^/]+\/[^/]+\/stanje)\/?$/i, null], // izvoz prijav s skrbnikovo sejo (server/reports.js)
  [/^\/students\/?$/i, "POST"], // nov profil
  [/^\/students\/[^/]+\/?$/i, "DELETE"], // izbris profila
];

export function ownerOnly(path, method) {
  return OWNER_ONLY.some(([re, m]) => re.test(path) && (!m || m === method));
}

export class AccountLocks {
  constructor(db) {
    this.db = db;
    db.exec(`
      CREATE TABLE IF NOT EXISTS account_unlocks (
        parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
        device_id TEXT NOT NULL,
        expires_at INTEGER NOT NULL,            -- ms
        PRIMARY KEY (parent_id, device_id)
      );
    `);
  }
  unlock(parentId, deviceId, now = Date.now()) {
    this.db
      .prepare(
        `INSERT INTO account_unlocks (parent_id, device_id, expires_at) VALUES (?, ?, ?)
         ON CONFLICT(parent_id, device_id) DO UPDATE SET expires_at = excluded.expires_at`,
      )
      .run(parentId, deviceId, now + ACCOUNT_UNLOCK_MIN() * 60000);
  }
  // Odklenjeno? Ob uporabi se čas podaljša (drsno okno).
  touch(parentId, deviceId, now = Date.now()) {
    const row = this.db.prepare("SELECT expires_at FROM account_unlocks WHERE parent_id = ? AND device_id = ?").get(parentId, deviceId);
    if (!row || row.expires_at <= now) return false;
    this.unlock(parentId, deviceId, now);
    return true;
  }
  isUnlocked(parentId, deviceId, now = Date.now()) {
    const row = this.db.prepare("SELECT expires_at FROM account_unlocks WHERE parent_id = ? AND device_id = ?").get(parentId, deviceId);
    return !!row && row.expires_at > now;
  }
  lock(parentId, deviceId) {
    this.db.prepare("DELETE FROM account_unlocks WHERE parent_id = ? AND device_id = ?").run(parentId, deviceId);
  }
  lockAll(parentId) {
    this.db.prepare("DELETE FROM account_unlocks WHERE parent_id = ?").run(parentId);
  }
}
