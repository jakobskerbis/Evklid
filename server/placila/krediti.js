// Dokupljena poraba AI (j 2026-10-30): ko učenec porabi svoj mesečni delež skupnega proračuna
// (server/proracun.js), lahko račun dokupi kredit. Pravilo 75 % (j 2026-11-04, kot pri paketih): od plačila
// ostane vsaj 75 % dobička tudi, ko je ves kredit porabljen. Kredit v $ = (plačilo × (1 − 0,015 − 0,75) − 0,25 €)
// / 0,92 (Stripe 1,5 % + 0,25 €, AI po 0,92 € za 1 $; plans.js COST), največ 25 % plačila brez DDV (spodaj).
// Učenec in starš vidita samo ~število razlag oziroma pogovorov, nikoli € ali $. Kredit je vezan na račun
// (starša ali polnoletnega učenca) in velja za vse njegove profile, dokler ga ne porabijo; ne poteče ob koncu meseca.
import "../env.js";
import { COST, aiCapFromEur } from "../accounts/plans.js";

const num = (k, d) => {
  const v = Number(process.env[k]);
  return Number.isFinite(v) && process.env[k] !== "" && process.env[k] !== undefined ? v : d;
};

// Delež plačila, ki lahko postane kredit: največ 1 − 1,5 % − 75 % = 0,235 (EVKLID_CREDIT_SHARE ga lahko le zniža).
const MAX_SHARE = 1 - COST.stripePct - COST.minProfit;
export const creditShare = () => Math.min(MAX_SHARE, Math.max(0.05, num("EVKLID_CREDIT_SHARE", MAX_SHARE)));

// Paketi za dokup v centih z DDV (osnutek, potrdi j pred objavo).
export const CREDIT_PACKS = [
  { id: "k5", amount: 500, currency: "EUR" },
  { id: "k10", amount: 1000, currency: "EUR" },
  { id: "k20", amount: 2000, currency: "EUR" },
];
export const packById = (id) => CREDIT_PACKS.find((p) => p.id === id) || null;
// Poljuben znesek brez zgornje meje (j 2026-10-30); spodnja meja zaradi plačilnih stroškov,
// zgornja je le tehnična meja enega plačila pri Stripu (999.999,99 €).
export const CUSTOM_MIN_CENTS = 500;
export const CUSTOM_MAX_CENTS = 99_999_999;
export function customPack(amountEur) {
  const cents = Math.round(Number(amountEur) * 100);
  if (!Number.isFinite(cents) || cents < CUSTOM_MIN_CENTS || cents > CUSTOM_MAX_CENTS) return null;
  return { id: "custom", amount: cents, currency: "EUR" };
}

// Učencu in staršu pokažemo samo, za koliko pogovorov z inštruktorjem zadošča kredit (j 2026-10-30:
// ne deleža plačila ali zneska kredita). Ocena za običajen pogovor (~10 sporočil, hitri model, včasih
// podrobna razlaga); zaokroženo navzdol, da je obljuba vedno izpolnjena.
export const usdPerConversation = () => Math.max(0.001, num("EVKLID_USD_PER_CONVERSATION", 0.05));
export function conversationsFor(usd) {
  const n = Math.floor((usd || 0) / usdPerConversation());
  return n >= 20 ? n - (n % 5) : n;
}

// Kredit v $ za plačilo v centih (evri), navzdol na cent.
// Trda meja AI (j 2026-11-06): največ 25 % plačila brez DDV (plans.js aiCapFromEur): 5 € → 1,00 $, 10 € → 2,22 $,
// 20 € → 4,45 $ (prej 2,28 in 4,83 $ po pravilu 75 % od cene z DDV).
export const creditUsdFor = (amountCents) =>
  Math.floor(Math.min(aiCapFromEur(amountCents / 100), Math.max(0, (((amountCents / 100) * creditShare() - COST.stripeFixedEur) / COST.eurPerUsd))) * 100 + 1e-9) / 100;

export function migrateCredits(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_credit_buys (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      pack TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      credit_usd REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- pending | active | refunded
      checkout_id TEXT,
      payment_id TEXT,
      paid_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_credit_buys_parent ON ai_credit_buys(parent_id, status);
    CREATE TABLE IF NOT EXISTS ai_credit_use (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
      usd REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_credit_use ON ai_credit_use(parent_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_credit_use_student ON ai_credit_use(student_id, created_at);
  `);
}

export class Credits {
  constructor(db) {
    this.db = db;
    migrateCredits(db);
  }
  // Preostanek kredita računa v $.
  balance(parentId) {
    if (!parentId) return 0;
    const bought = this.db.prepare("SELECT COALESCE(SUM(credit_usd),0) AS s FROM ai_credit_buys WHERE parent_id = ? AND status = 'active'").get(parentId).s;
    const used = this.db.prepare("SELECT COALESCE(SUM(usd),0) AS s FROM ai_credit_use WHERE parent_id = ?").get(parentId).s;
    return Math.max(0, Math.round((bought - used) * 10000) / 10000);
  }
  // Poraba iz kredita ta mesec (učenec ali vsi skupaj): ne šteje v skupni proračun.
  usedMonth(studentId = null) {
    const q = `SELECT COALESCE(SUM(usd),0) AS s FROM ai_credit_use WHERE created_at >= date('now','start of month')${studentId ? " AND student_id = ?" : ""}`;
    return studentId ? this.db.prepare(q).get(studentId).s : this.db.prepare(q).get().s;
  }
  // Poraba kredita profila od trenutka since (»YYYY-MM-DD HH:MM:SS«, UTC): obdobje naročnine ali paketa.
  usedSince(studentId, since) {
    return this.db.prepare("SELECT COALESCE(SUM(usd),0) AS s FROM ai_credit_use WHERE student_id = ? AND created_at >= ?").get(studentId, since).s;
  }
  use(parentId, studentId, usd) {
    if (!parentId || !(usd > 0)) return;
    this.db.prepare("INSERT INTO ai_credit_use (parent_id, student_id, usd) VALUES (?, ?, ?)").run(parentId, studentId, usd);
  }
  create(parentId, pack) {
    return this.db
      .prepare("INSERT INTO ai_credit_buys (parent_id, pack, amount, currency, credit_usd) VALUES (?, ?, ?, ?, ?)")
      .run(parentId, pack.id, pack.amount, pack.currency, creditUsdFor(pack.amount)).lastInsertRowid;
  }
  get(id) {
    return this.db.prepare("SELECT * FROM ai_credit_buys WHERE id = ?").get(Number(id)) || null;
  }
  setCheckout(id, checkoutId) {
    this.db.prepare("UPDATE ai_credit_buys SET checkout_id = ? WHERE id = ?").run(checkoutId, id);
  }
  // Plačilo uspelo (webhook ali vrnitev s plačilne strani): enkrat, tudi če pride dvakrat.
  activate(id, paymentId = null) {
    return this.db
      .prepare("UPDATE ai_credit_buys SET status = 'active', payment_id = COALESCE(?, payment_id), paid_at = datetime('now') WHERE id = ? AND status = 'pending'")
      .run(paymentId, Number(id)).changes > 0;
  }
  refund(paymentId) {
    return this.db.prepare("UPDATE ai_credit_buys SET status = 'refunded' WHERE payment_id = ? AND status = 'active'").run(paymentId).changes > 0;
  }
  list(parentId) {
    return this.db.prepare("SELECT id, pack, amount, currency, credit_usd, status, paid_at, created_at FROM ai_credit_buys WHERE parent_id = ? AND status != 'pending' ORDER BY id DESC LIMIT 20").all(parentId);
  }
}
