// Tabele za starševske račune, soglasja, naročnine, priporočila in e-pošto.
// Ločeno od db.js, da se moduli ne prekrivajo.

export function migrateAccounts(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS parents (
      id INTEGER PRIMARY KEY,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      is_admin INTEGER NOT NULL DEFAULT 0,
      email_verified_at TEXT,
      verify_token_hash TEXT,
      reset_token_hash TEXT,
      reset_expires_at TEXT,
      privacy_version TEXT NOT NULL,
      privacy_accepted_at TEXT NOT NULL DEFAULT (datetime('now')),
      trial_ends_at TEXT,                     -- 7-dnevni preizkus brez kartice
      bonus_until TEXT,                       -- brezplačni mesec iz priporočila (brez naročnine)
      weekly_email INTEGER NOT NULL DEFAULT 1,
      unsubscribe_token TEXT NOT NULL,
      referral_code TEXT NOT NULL UNIQUE,
      referred_by INTEGER REFERENCES parents(id) ON DELETE SET NULL,
      referral_rewarded INTEGER NOT NULL DEFAULT 0,
      stripe_customer_id TEXT,
      sub_id TEXT,
      sub_status TEXT,                        -- active | trialing | past_due | canceled | ...
      sub_plan TEXT,                          -- npr. evklid_2_month
      sub_seats INTEGER NOT NULL DEFAULT 0,
      sub_period_end TEXT,
      sub_cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_parents_customer ON parents(stripe_customer_id);
    CREATE TABLE IF NOT EXISTS parent_sessions (
      token_hash TEXT PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    -- Dokaz o soglasju zakonitega zastopnika (GDPR čl. 8, ZVOP-2: mlajši od 15 let)
    CREATE TABLE IF NOT EXISTS consents (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      child_birth_year INTEGER,
      under_15 INTEGER NOT NULL,
      version TEXT NOT NULL,
      text TEXT NOT NULL,
      parent_email TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS referral_rewards (
      id INTEGER PRIMARY KEY,
      referrer_id INTEGER REFERENCES parents(id) ON DELETE SET NULL,
      referred_id INTEGER REFERENCES parents(id) ON DELETE SET NULL,
      referrer_reward TEXT,
      referred_reward TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS email_log (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER REFERENCES parents(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,
      period TEXT NOT NULL DEFAULT '',
      ok INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (parent_id, kind, period)
    );
    -- Naprave in zaščita pred deljenjem: profil je hkrati odprt samo na eni napravi.
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,                    -- zgoščen piškotek sm_device
      label TEXT NOT NULL DEFAULT '',
      first_seen TEXT NOT NULL DEFAULT (datetime('now')),
      last_seen TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS profile_devices (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      device_id TEXT NOT NULL,
      first_seen TEXT NOT NULL DEFAULT (datetime('now')),
      last_seen TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, device_id)
    );
    CREATE TABLE IF NOT EXISTS profile_claims (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      device_id TEXT NOT NULL,
      last_seen INTEGER NOT NULL              -- ms
    );
    CREATE TABLE IF NOT EXISTS profile_changes (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,                     -- created | deleted
      student_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS promo_redemptions (
      parent_id INTEGER PRIMARY KEY REFERENCES parents(id) ON DELETE CASCADE,
      code TEXT NOT NULL,
      redeemed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS kv (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  // Država starša (za ceno v lokalni valuti); ob registraciji iz naprave oziroma omrežja.
  const pcols = db.prepare("PRAGMA table_info(parents)").all().map((c) => c.name);
  if (!pcols.includes("country")) db.exec("ALTER TABLE parents ADD COLUMN country TEXT");
  // Poln dostop iz aktivacijske kode (glej promo.js).
  if (!pcols.includes("promo_until")) db.exec("ALTER TABLE parents ADD COLUMN promo_until TEXT");
  if (!pcols.includes("gift_until")) db.exec("ALTER TABLE parents ADD COLUMN gift_until TEXT"); // darilna koda (server/placila/darila.js)
  // Datum rojstva imetnika računa (preverjanje starosti, glej age.js). Nov račun ga mora imeti (registracija ga zahteva); stari računi: NULL, dokler ga ne vpišejo.
  if (!pcols.includes("birth_date")) db.exec("ALTER TABLE parents ADD COLUMN birth_date TEXT");
  // Star račun brez datuma rojstva: kdaj smo ga ob prijavi vprašali (vprašamo samo enkrat, j 2026-11-06).
  if (!pcols.includes("birth_asked_at")) db.exec("ALTER TABLE parents ADD COLUMN birth_asked_at TEXT");
  // Gost (uporaba brez registracije, odstranjena 2026-10-29; stari gostje ostanejo): račun brez e-naslova, vezan na piškotek naprave.
  // guest_net = zgoščeni IP omrežja, da brisanje piškotkov ne da nove brezplačne kvote.
  if (!pcols.includes("is_guest")) db.exec("ALTER TABLE parents ADD COLUMN is_guest INTEGER NOT NULL DEFAULT 0");
  if (!pcols.includes("guest_net")) db.exec("ALTER TABLE parents ADD COLUMN guest_net TEXT");
  // Naključna identiteta računa, ki se nikoli ne ponovi (parents.id se po izbrisu ponovno uporabi). Gre v metapodatke
  // plačil Stripa; webhook pripiše plačilo računu samo ob enakem uid (server/accounts/ponoven-id.js, pregled #511 A).
  if (!pcols.includes("uid")) db.exec("ALTER TABLE parents ADD COLUMN uid TEXT");
  db.exec("UPDATE parents SET uid = lower(hex(randomblob(16))) WHERE uid IS NULL");
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_parents_uid ON parents(uid)");
  db.exec(`CREATE TRIGGER IF NOT EXISTS parents_uid AFTER INSERT ON parents WHEN NEW.uid IS NULL BEGIN
    UPDATE parents SET uid = lower(hex(randomblob(16))) WHERE id = NEW.id;
  END;`);
  const cols = db.prepare("PRAGMA table_info(students)").all().map((c) => c.name);
  if (!cols.includes("parent_id")) db.exec("ALTER TABLE students ADD COLUMN parent_id INTEGER REFERENCES parents(id) ON DELETE CASCADE");
  if (!cols.includes("birth_year")) db.exec("ALTER TABLE students ADD COLUMN birth_year INTEGER");
  db.exec("CREATE INDEX IF NOT EXISTS idx_students_parent ON students(parent_id)");
  // Izbris računa: poraba ostane (skupni proračun), a ne več vezana na račun, katerega id se lahko ponovno uporabi.
  if (db.prepare("PRAGMA table_info(usage)").all().some((c) => c.name === "parent_id")) {
    db.exec(`CREATE TRIGGER IF NOT EXISTS usage_parent_detach AFTER DELETE ON parents BEGIN
      UPDATE usage SET parent_id = NULL WHERE parent_id = OLD.id;
    END;`);
  }
  db.exec("CREATE INDEX IF NOT EXISTS idx_parents_guest_net ON parents(guest_net) WHERE is_guest = 1");
}
