// Splošni pogoji ob registraciji in nakupu ter potrdilo o nakupu po e-pošti (#765 točki 2 in 3, j 2026-11-17).
// Potrditev pogojev se shrani z različico (datum »Različica« na public/pogoji.html): ob registraciji v consents
// (brez profila), ob nakupu v billing_consents skupaj z ostalimi potrditvami, opisom nakupa in id plačilne seje.
// Po uspešnem plačilu (webhook checkout.session.*) gre plačniku potrdilo na trajnem nosilcu (ZVPot-1).
import { BRAND } from "../brand.js";
import { purchaseEmail } from "./email.js";

// Ob vsaki spremembi pogojev: novi datum tukaj in na strani (test/pogoji-potrditev.test.js preveri, da se ujemata).
export const TERMS_VERSION = "2026-11-17";
export const TERMS_TEXT = "Strinjam se s splošnimi pogoji uporabe.";
export const TERMS_ERROR = { error: "Pred plačilom potrdite, da se strinjate s splošnimi pogoji uporabe.", consent: true, terms: true };
export const CONTACT_EMAIL = `zasebnost@${BRAND.domain}`;
export const termsAccepted = (body) => body?.terms === true;
// »2026-11-17« → »17. 11. 2026« (kot na strani).
export const termsVersionText = (v = TERMS_VERSION) => {
  const [y, m, d] = String(v).split("-").map(Number);
  return `${d}. ${m}. ${y}`;
};

const LANG_RE = /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/;
export const moneyText = (minor, currency = "EUR") => {
  const cur = String(currency || "EUR").toUpperCase();
  const digits = new Intl.NumberFormat("sl-SI", { style: "currency", currency: cur }).resolvedOptions().maximumFractionDigits;
  return new Intl.NumberFormat("sl-SI", { style: "currency", currency: cur }).format((Number(minor) || 0) / 10 ** digits);
};

// Opis naročnine za potrdilo: paket, cena na obdobje in samodejno podaljšanje (pogoji §10).
export const subItem = (plan) =>
  `Naročnina: ${plan.label}, ${moneyText(plan.amount, plan.currency || "EUR")} ${plan.interval === "month" ? "na mesec" : "na leto"}, samodejno podaljšanje do preklica`;

// Prvo plačilo naročnine s preizkusom (trial_end v sekundah): »17. 12. 2026, 9,99 €«.
export const firstChargeText = (trialEndSec, plan) =>
  `${dayText(trialEndSec * 1000)}, ${moneyText(plan.amount, plan.currency || "EUR")}`;
const dayText = (ms) => new Intl.DateTimeFormat("sl-SI", { timeZone: "Europe/Ljubljana", day: "numeric", month: "numeric", year: "numeric" }).format(new Date(ms));

// Kaj vrnemo ob odstopu, po vrsti nakupa (enako kot /pogoji.html 12. točka).
// TODO(j, pravnik): »Podari Evklid« (kind podari) v pogojih nima pravila o odstopu, zato potrdilo pove samo, kako odstop sporočiti.
export function withdrawalNote(kind) {
  const k = String(kind || "");
  if (k === "gift") return "Dokler koda ni vpisana, vam vrnemo celotno plačilo. Ko je koda vpisana, pravica do odstopa preneha.";
  if (k.endsWith("credit")) return "Vrnemo vam delež plačila za še neporabljene pogovore.";
  if (k === "podari") return "";
  return "Kaj vrnemo, piše v 12. točki splošnih pogojev.";
}

export function migrateTerms(db) {
  const cols = db.prepare("PRAGMA table_info(billing_consents)").all().map((c) => c.name);
  if (!cols.length) return;
  if (!cols.includes("terms_version")) db.exec("ALTER TABLE billing_consents ADD COLUMN terms_version TEXT");
  if (!cols.includes("checkout_id")) db.exec("ALTER TABLE billing_consents ADD COLUMN checkout_id TEXT");
  if (!cols.includes("item")) db.exec("ALTER TABLE billing_consents ADD COLUMN item TEXT");
  if (!cols.includes("first_charge")) db.exec("ALTER TABLE billing_consents ADD COLUMN first_charge TEXT");
  db.exec("CREATE INDEX IF NOT EXISTS billing_consents_checkout ON billing_consents (checkout_id)");
}

// Potrditve pred plačilom (lines: slovenska besedila, ki jih je plačnik označil), pogoji z različico in jezik.
// Vrne id zapisa; checkoutId se lahko doda pozneje (linkConsent), ko plačilna seja obstaja.
export function insertBillingConsent(db, { parentId, email, kind, lines, lang, checkoutId = null, item = "", firstCharge = "" }) {
  const l = LANG_RE.test(String(lang || "")) ? lang : "sl";
  const text = [...lines, TERMS_TEXT, `[pogoji: ${TERMS_VERSION}]`, `[jezik: ${l}]`].join("\n");
  const r = db
    .prepare("INSERT INTO billing_consents (parent_id, payer_email, kind, text, terms_version, checkout_id, item, first_charge) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run(parentId ?? null, email || "", kind, text, TERMS_VERSION, checkoutId, String(item || "").slice(0, 300), firstCharge || null);
  return Number(r.lastInsertRowid);
}
export const linkConsent = (db, id, checkoutId) => db.prepare("UPDATE billing_consents SET checkout_id = ? WHERE id = ?").run(checkoutId, id);

// Registracija: potrditev pogojev brez profila (consents.student_id NULL), izbriše se z računom.
export function recordSignupTerms(db, parentId, email) {
  db.prepare("INSERT INTO consents (parent_id, student_id, child_birth_year, under_15, version, text, parent_email) VALUES (?, NULL, NULL, 0, ?, ?, ?)").run(
    parentId,
    TERMS_VERSION,
    TERMS_TEXT,
    email || "",
  );
}

// Potrdilo po uspešnem plačilu Checkout seje. Samo za seje z zapisom potrditev (nakup v tej različici), enkrat na sejo.
// Napaka pri pošiljanju ne ustavi obdelave dogodka (zapis ok = 0 v email_log, skrbnik pošlje ročno).
export async function sendPurchaseConfirmation({ db, session, sendMail, appUrl, log = {} }) {
  if (!session?.id || session.status !== "complete") return false;
  if (!["paid", "no_payment_required"].includes(session.payment_status)) return false;
  const c = db.prepare("SELECT * FROM billing_consents WHERE checkout_id = ? ORDER BY id DESC LIMIT 1").get(String(session.id));
  if (!c) return false;
  const to = String(session.customer_details?.email || c.payer_email || "").trim();
  if (!to) return false;
  const claim = db.prepare("INSERT OR IGNORE INTO email_log (parent_id, kind, period) VALUES (?, 'purchase', ?)").run(c.parent_id ?? null, String(session.id));
  if (!claim.changes) return false;
  if (c.parent_id == null && db.prepare("SELECT COUNT(*) AS n FROM email_log WHERE kind = 'purchase' AND period = ?").get(String(session.id)).n > 1) return false;
  const lines = String(c.text || "").split("\n");
  const statements = lines.filter((s) => s && !/^\[[a-z]+: /.test(s));
  // Shranjeno je slovensko besedilo; plačnik ga je v aplikaciji morda bral v prevodu (e-pošta je zaenkrat samo slovenska).
  const lang = (lines.find((s) => s.startsWith("[jezik: ")) || "").slice(8, -1) || "sl";
  const base = String(appUrl || "/").replace(/\/+$/, "");
  const msg = purchaseEmail({
    item: c.item || "Nakup v aplikaciji " + BRAND.name,
    paidText: moneyText(session.amount_total ?? 0, session.currency || "EUR"),
    dateText: dayText(Number(session.created) > 0 ? Number(session.created) * 1000 : Date.now()),
    firstCharge: !(session.amount_total > 0) && c.first_charge ? c.first_charge : "",
    statements,
    lang,
    withdrawal: withdrawalNote(c.kind),
    termsUrl: `${base}/pogoji.html`,
    termsVersion: termsVersionText(c.terms_version || TERMS_VERSION),
    withdrawUrl: `${base}/pogoji.html#obrazec`,
    contact: CONTACT_EMAIL,
    appUrl: `${base}/`,
  });
  const ok = await sendMail(to, msg);
  if (!ok) {
    db.prepare("UPDATE email_log SET ok = 0 WHERE kind = 'purchase' AND period = ?").run(String(session.id));
    log.error?.("[evklid] potrdilo o nakupu ni poslano", c.id);
  }
  return ok;
}
