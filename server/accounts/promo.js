// Aktivacijske kode: poln dostop za D dni brez kartice (npr. EVKLID3X).
// Kode živijo v tabeli promo_codes; skrbnik jih ustvari in izklopi v zavihku Račun.
// Koda iz .env se ob zagonu vpiše oziroma posodobi (dnevi, število uporab, profili, model),
// izklop iz zavihka Račun pa ostane tudi po ponovnem zagonu.
// Nastavitve v .env: EVKLID_PROMO_CODE (privzeto EVKLID3X), EVKLID_PROMO_LIMIT (100),
// EVKLID_PROMO_DAYS (90 = 3 meseci), EVKLID_PROMO_SEATS (1 otrok). EVKLID_PROMO_CODE=off kode iz .env ne doda.
// EVKLID_PROMO_MODEL: zmogljivejši model za imetnike kode, privzeto »sonnet« (j 2026-10-30): Sonnet
// ob 2. zaporedni »Razloži podrobneje«, Opus šele ob 3.; »opus« omejitev izklopi.
// Vsak račun porabi največ eno aktivacijsko kodo (dve kodi se ne seštevata).
import "../env.js";
import { isoIn } from "./plans.js";

export const CODE_RE = /^[A-Z0-9-]{4,30}$/;
export const MODEL_CAPS = ["sonnet"]; // null = brez omejitve (Opus)

export function promoConfig(env = process.env) {
  const code = String(env.EVKLID_PROMO_CODE ?? "EVKLID3X").trim().toUpperCase();
  const num = (v, def) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Math.floor(Number(v)) : def);
  return {
    code: code === "OFF" || code === "" ? null : code,
    limit: num(env.EVKLID_PROMO_LIMIT, 100),
    days: num(env.EVKLID_PROMO_DAYS, 90),
    seats: num(env.EVKLID_PROMO_SEATS, 1),
    maxModel: String(env.EVKLID_PROMO_MODEL ?? "sonnet").trim().toLowerCase() === "opus" ? null : "sonnet",
  };
}

export function migratePromo(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS promo_codes (
      code TEXT PRIMARY KEY,
      days INTEGER NOT NULL,
      seats INTEGER NOT NULL DEFAULT 1,
      max_model TEXT,                         -- 'sonnet' ali NULL (brez omejitve)
      max_uses INTEGER NOT NULL,
      valid_until TEXT,                       -- zadnji dan, ko jo je mogoče vpisati (YYYY-MM-DD) ali NULL
      active INTEGER NOT NULL DEFAULT 1,
      from_env INTEGER NOT NULL DEFAULT 0,
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// Preverjanje podatkov nove kode iz skrbniškega obrazca. Vrne { value } ali { error }.
export function parseCode(body = {}) {
  const code = String(body.code || "").trim().toUpperCase();
  if (!CODE_RE.test(code)) return { error: "Koda ima 4–30 znakov: velike črke, številke ali vezaj." };
  const int = (v) => (Number.isInteger(Number(v)) ? Number(v) : NaN);
  const days = int(body.days);
  if (!(days >= 1 && days <= 730)) return { error: "Dnevi: od 1 do 730." };
  const seats = int(body.seats ?? 1);
  if (!(seats >= 1 && seats <= 2)) return { error: "Profilov: 1 ali 2." };
  const maxUses = int(body.max_uses);
  if (!(maxUses >= 1 && maxUses <= 100000)) return { error: "Število uporab: od 1 do 100000." };
  const model = body.max_model == null || body.max_model === "" || body.max_model === "opus" ? null : String(body.max_model);
  if (model !== null && !MODEL_CAPS.includes(model)) return { error: "Neznan model." };
  const until = body.valid_until ? String(body.valid_until) : null;
  if (until !== null && (!/^\d{4}-\d{2}-\d{2}$/.test(until) || Number.isNaN(Date.parse(until)))) return { error: "Datum veljavnosti ni pravilen." };
  return { value: { code, days, seats, max_model: model, max_uses: maxUses, valid_until: until, note: String(body.note || "").slice(0, 120) } };
}

export function createPromo(db, cfg) {
  migratePromo(db);
  if (cfg.code) {
    db.prepare(
      `INSERT INTO promo_codes (code, days, seats, max_model, max_uses, from_env) VALUES (?, ?, ?, ?, ?, 1)
       ON CONFLICT(code) DO UPDATE SET days = excluded.days, seats = excluded.seats, max_model = excluded.max_model, max_uses = excluded.max_uses, from_env = 1`,
    ).run(cfg.code, cfg.days, cfg.seats, cfg.maxModel ?? null, cfg.limit);
  }
  // Koda, ki je bila prej v .env (ali EVKLID_PROMO_CODE=off), se izklopi.
  db.prepare("UPDATE promo_codes SET active = 0 WHERE from_env = 1 AND code IS NOT ?").run(cfg.code || null);

  const get = (code) => db.prepare("SELECT * FROM promo_codes WHERE code = ?").get(code);
  const usedOf = (code) => db.prepare("SELECT COUNT(*) AS n FROM promo_redemptions WHERE code = ?").get(code).n;
  const used = () => (cfg.code ? usedOf(cfg.code) : 0);
  const today = () => new Date().toISOString().slice(0, 10);
  const anyActive = () => !!db.prepare("SELECT 1 FROM promo_codes WHERE active = 1 AND (valid_until IS NULL OR valid_until >= ?)").get(today());

  // node:sqlite je sinhron, zato sta štetje in vpis skupaj atomarna (ni tekme za zadnje mesto).
  function redeem(parent, raw) {
    const code = String(raw || "").trim().toUpperCase();
    if (!code) return { error: "Vpiši aktivacijsko kodo." };
    const row = CODE_RE.test(code) ? get(code) : null;
    if (!row || !row.active || (row.valid_until && row.valid_until < today())) return { error: "Ta aktivacijska koda ni veljavna." };
    if (db.prepare("SELECT 1 FROM promo_redemptions WHERE parent_id = ?").get(parent.id)) {
      return { error: "Na tem računu je bila aktivacijska koda že uporabljena." };
    }
    if (["active", "trialing", "past_due"].includes(parent.sub_status)) {
      return { error: "Naročnino že imaš, zato koda ni potrebna. Prihrani jo za prijatelja." };
    }
    if (usedOf(code) >= row.max_uses) return { error: `Vseh ${row.max_uses} aktivacij te kode je že porabljenih.`, exhausted: true };
    const until = isoIn(row.days);
    db.prepare("INSERT INTO promo_redemptions (parent_id, code) VALUES (?, ?)").run(parent.id, code);
    db.prepare("UPDATE parents SET promo_until = ? WHERE id = ?").run(until, parent.id);
    return { ok: true, until };
  }

  // Koda, ki jo je račun porabil (za število profilov in omejitev modela), ali null.
  const codeOf = (parentId) =>
    db.prepare("SELECT c.* FROM promo_redemptions r JOIN promo_codes c ON c.code = r.code WHERE r.parent_id = ?").get(parentId) || null;
  // Profili in model za račun s kodo; stari računi (koda brez vrstice) dobijo nastavitve iz .env.
  const termsOf = (parentId) => {
    const c = codeOf(parentId);
    return c ? { seats: c.seats, maxModel: c.max_model } : { seats: cfg.seats, maxModel: cfg.maxModel ?? null };
  };

  const stats = () => (cfg.code ? { code: cfg.code, used: used(), limit: cfg.limit, days: cfg.days, seats: cfg.seats } : null);
  const list = () =>
    db
      .prepare("SELECT c.*, (SELECT COUNT(*) FROM promo_redemptions r WHERE r.code = c.code) AS used FROM promo_codes c ORDER BY c.created_at DESC, c.code")
      .all()
      .map((c) => ({ ...c, active: !!c.active, from_env: !!c.from_env }));

  function create(body) {
    const p = parseCode(body);
    if (p.error) return p;
    if (get(p.value.code)) return { error: "Koda že obstaja.", exists: true };
    const v = p.value;
    db.prepare("INSERT INTO promo_codes (code, days, seats, max_model, max_uses, valid_until, note) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
      v.code,
      v.days,
      v.seats,
      v.max_model,
      v.max_uses,
      v.valid_until,
      v.note,
    );
    return { ok: true, code: v.code };
  }

  function setActive(code, active) {
    const r = db.prepare("UPDATE promo_codes SET active = ? WHERE code = ?").run(active ? 1 : 0, String(code || "").toUpperCase());
    return r.changes ? { ok: true } : { error: "Koda ne obstaja." };
  }

  return { redeem, stats, used, codeOf, termsOf, list, create, setActive, anyActive };
}
