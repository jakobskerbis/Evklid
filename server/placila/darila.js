// Darilna koda (j 2026-10-30): polnoletna oseba kupi kodo za eno leto Osebno (en profil) za 49 €
// z enkratnim plačilom in jo podari. Prejemnik jo vpiše v polje za aktivacijsko kodo v zavihku Račun.
// Koda je ločena od aktivacijskih kod (te so ena na račun): darilo podaljša dostop parents.gift_until.
// Vračilo ali spor pred vpisom kodo izklopi; po vpisu se dostop prejemnika konča.
import express from "express";
import { randomBytes } from "node:crypto";

// Izjavi ob nakupu darilne kode (darilo se uporabi pozneje, zato drugače kot pri naročnini).
export const GIFT_ADULT_TEXT = "Sem polnoletna oseba in kupujem darilno kodo za Evklid.";
export const GIFT_WITHDRAWAL_TEXT =
  "Vem, da lahko v 14 dneh od nakupa odstopim in dobim vrnjeno celotno plačilo, če koda še ni vpisana. Ko je koda vpisana, se uporaba začne in pravica do odstopa preneha.";
import { giftFor, isoIn } from "../accounts/plans.js";
import { BIRTH_MISSING_PAY } from "../accounts/age.js";
import { STOPNJE, visja } from "../../public/stopnja.js";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // brez I, O, 0, 1
export const newCode = () =>
  "DAR-" +
  [...randomBytes(8)]
    .map((b, i) => (i === 4 ? "-" : "") + ALPHABET[b % ALPHABET.length])
    .join("");
export const GIFT_RE = /^DAR-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export function migrateGifts(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS gifts (
      id INTEGER PRIMARY KEY,
      buyer_id INTEGER REFERENCES parents(id) ON DELETE SET NULL, -- izbris kupca ne izbriše podarjene kode
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      days INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | refunded | disputed
      code TEXT UNIQUE,
      checkout_id TEXT,
      payment_id TEXT,
      redeemed_by INTEGER REFERENCES parents(id) ON DELETE SET NULL,
      redeemed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_gifts_buyer ON gifts(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_gifts_payment ON gifts(payment_id);
  `);
  // Stopnja darila (j 2026-11-01): cena = letna cena stopnje; stara darila (brez stopnje) odprejo vse stopnje.
  if (!db.prepare("PRAGMA table_info(gifts)").all().some((c) => c.name === "level")) db.exec("ALTER TABLE gifts ADD COLUMN level TEXT");
  if (!db.prepare("PRAGMA table_info(parents)").all().some((c) => c.name === "gift_level")) db.exec("ALTER TABLE parents ADD COLUMN gift_level TEXT");
}

const later = (iso, now = Date.now()) => !!iso && Date.parse(iso) > now;

// ctx: { db, stripe, json, log, getParent, ensureCustomer, baseUrl, isMinor, recordConsent, paidActive }
export function mountGifts(app, ctx) {
  const {
    db,
    stripe,
    json,
    log,
    getParent,
    ensureCustomer,
    baseUrl,
    isMinor,
    birthMissing = () => false,
    recordConsent,
    paidActive,
    pilotOf = () => false, // član pilota: brez nakupa darilne kode (j 2026-11-10)
  } = ctx;
  migrateGifts(db);
  const get = (id) =>
    db.prepare("SELECT * FROM gifts WHERE id = ?").get(id) || null;
  const byCode = (code) =>
    db.prepare("SELECT * FROM gifts WHERE code = ?").get(
      String(code || "")
        .trim()
        .toUpperCase(),
    ) || null;

  // Plačilo je uspelo: ustvari kodo (enkrat). session = Stripe Checkout Session.
  function complete(session) {
    if (session?.metadata?.kind !== "gift" || session.payment_status !== "paid")
      return false;
    const g = get(Number(session.metadata.gift_id));
    if (
      !g ||
      String(g.buyer_id) !== String(session.metadata.parent_id) ||
      g.status !== "pending"
    )
      return false;
    const pi =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || null;
    for (let i = 0; i < 5; i++) {
      try {
        const r = db
          .prepare(
            "UPDATE gifts SET status = 'paid', code = ?, payment_id = ? WHERE id = ? AND status = 'pending'",
          )
          .run(newCode(), pi, g.id);
        return r.changes > 0;
      } catch (e) {
        if (!/UNIQUE/.test(String(e.message))) throw e; // zelo redko: enaka koda, poskusi znova
      }
    }
    return false;
  }

  // Vračilo ali spor: nevpisana koda ne velja več; vpisana prejemniku odvzame dni tega darila
  // (druga vpisana darila ostanejo). Vrne true, če plačilo pripada darilu (tudi že vrnjenemu),
  // da spor pri darilu ne prekliče kupčeve naročnine.
  function end(paymentId, status) {
    const g =
      paymentId &&
      db.prepare("SELECT * FROM gifts WHERE payment_id = ?").get(paymentId);
    if (!g) return false;
    if (db.prepare("UPDATE gifts SET status = ? WHERE id = ? AND status = 'paid'").run(status, g.id).changes && g.redeemed_by) {
      const r = getParent(g.redeemed_by);
      const left = Math.max(Date.now(), (Date.parse(r?.gift_until || 0) || 0) - g.days * 86400000);
      db.prepare("UPDATE parents SET gift_until = ? WHERE id = ?").run(new Date(left).toISOString(), g.redeemed_by);
    }
    return true;
  }

  // Vpis kode: dostop eno leto od danes ali od konca prejšnjega darila. Vrne { ok, until } ali { error }.
  // Darilo začne teči po preizkusu ali aktivacijski kodi (ti imata prednost v accessFor).
  function redeem(stale, raw) {
    const parent = getParent(stale.id) || stale;
    const g = byCode(raw);
    if (!g || g.status !== "paid")
      return { error: "Ta darilna koda ni veljavna." };
    // redeemed_at, ne redeemed_by: ob izbrisu prejemnikovega računa je redeemed_by NULL.
    if (g.redeemed_at) return { error: "Ta darilna koda je že uporabljena." };
    if (paidActive(parent))
      return {
        error:
          "Naročnino že imaš, zato darilo ni potrebno. Prihrani ga za nekoga drugega.",
      };
    const from = Math.max(
      Date.now(),
      ...[parent.gift_until, parent.trial_ends_at, parent.promo_until].map((d) => (later(d) ? Date.parse(d) : 0)),
    );
    const until = isoIn(g.days, from);
    const r = db
      .prepare(
        "UPDATE gifts SET redeemed_by = ?, redeemed_at = datetime('now') WHERE id = ? AND redeemed_at IS NULL AND status = 'paid'",
      )
      .run(parent.id, g.id);
    if (!r.changes) return { error: "Ta darilna koda je že uporabljena." };
    // Stopnja: višja od veljavnega darila in novega (staro darilo brez stopnje = vse stopnje).
    const prev = later(parent.gift_until) ? (STOPNJE.includes(parent.gift_level) ? parent.gift_level : "FAKS") : null;
    const level = STOPNJE.includes(g.level) ? (prev ? visja(prev, g.level) : g.level) : "FAKS";
    db.prepare("UPDATE parents SET gift_until = ?, gift_level = ? WHERE id = ?").run(
      until,
      level,
      parent.id,
    );
    return { ok: true, until, gift: true };
  }

  // Kupljena darila za zavihek Račun (kupec vidi kodo, dokler je ni kdo vpisal).
  const listFor = (parentId) =>
    db
      .prepare(
        "SELECT id, status, code, redeemed_at, created_at FROM gifts WHERE buyer_id = ? AND status IN ('paid', 'refunded', 'disputed') ORDER BY id DESC LIMIT 20",
      )
      .all(parentId)
      .map((g) => ({
        id: g.id,
        code: g.status === "paid" ? g.code : null,
        status: g.status,
        redeemed: !!g.redeemed_at,
        created_at: g.created_at,
      }));

  app.post("/api/billing/gift", json, async (req, res) => {
    const p = req.parent;
    if (pilotOf(p)) return res.status(409).json({ error: "V pilotu nakup ni mogoč.", pilot: true });
    if (!stripe.enabled)
      return res
        .status(503)
        .json({
          error: "Plačila še niso nastavljena (manjka STRIPE_SECRET_KEY).",
        });
    if (p.is_guest)
      return res.status(403).json({ error: "Najprej ustvari račun." });
    if (birthMissing(p)) return res.status(403).json(BIRTH_MISSING_PAY);
    if (isMinor(p))
      return res
        .status(403)
        .json({ error: "Darilno kodo lahko kupi samo polnoletna oseba." });
    if (req.body?.adult !== true || req.body?.withdrawal !== true)
      return res
        .status(400)
        .json({ error: "Pred plačilom sta potrebni obe potrditvi.", consent: true });
    const open = db
      .prepare(
        "SELECT COUNT(*) AS n FROM gifts WHERE buyer_id = ? AND status = 'pending' AND created_at > datetime('now', '-1 day')",
      )
      .get(p.id).n;
    if (open >= 5)
      return res
        .status(429)
        .json({ error: "Preveč odprtih nakupov. Poskusi jutri." });
    // Stopnja darila: OŠ (privzeto), SŠ ali faks; cena je letna cena stopnje (99 / 139 / 199 €). Neznana stopnja
    // je napaka (400), ne tiho OŠ, da kupec ne plača in dobi druge stopnje, kot jo je izbral.
    const want = req.body?.level ?? "OS";
    if (!STOPNJE.includes(want)) return res.status(400).json({ error: "Neznana stopnja darila." });
    const GIFT = giftFor(want);
    try {
      const customer = await ensureCustomer(p);
      const id = Number(
        db
          .prepare(
            "INSERT INTO gifts (buyer_id, amount, currency, days, level) VALUES (?, ?, ?, ?, ?)",
          )
          .run(p.id, GIFT.amount, GIFT.currency, GIFT.days, GIFT.level).lastInsertRowid,
      );
      const lang = /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(String(req.body?.lang || "")) ? req.body.lang : "sl";
      db.prepare("INSERT INTO billing_consents (parent_id, payer_email, kind, text) VALUES (?, ?, 'gift', ?)").run(p.id, p.email, `${GIFT_ADULT_TEXT}\n${GIFT_WITHDRAWAL_TEXT}\n[jezik: ${lang}]`);
      const meta = { kind: "gift", gift_id: id, parent_id: p.id };
      const base = baseUrl(req);
      const session = await stripe.request("POST", "/checkout/sessions", {
        mode: "payment",
        customer,
        client_reference_id: String(p.id),
        line_items: [
          {
            price_data: {
              currency: GIFT.currency.toLowerCase(),
              unit_amount: GIFT.amount,
              tax_behavior: "inclusive",
              product_data: { name: `Evklid – ${GIFT.label}` },
            },
            quantity: 1,
          },
        ],
        success_url: `${base}/?billing=gift&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/?billing=cancel`,
        locale: "sl",
        metadata: meta,
        payment_intent_data: { metadata: meta },
      });
      db.prepare("UPDATE gifts SET checkout_id = ? WHERE id = ?").run(
        session.id,
        id,
      );
      recordConsent(p.id, p.email, "gift", req.body?.lang);
      res.json({ url: session.url });
    } catch (err) {
      log.error?.("[evklid] Stripe darilo:", err.message);
      res
        .status(502)
        .json({
          error: "Plačilne strani ni bilo mogoče odpreti. Poskusi znova.",
        });
    }
  });

  // Vrnitev s plačilne strani (deluje tudi brez webhooka).
  app.post("/api/billing/gift/confirm", json, async (req, res) => {
    if (!stripe.enabled)
      return res
        .status(503)
        .json({
          error: "Plačila še niso nastavljena (manjka STRIPE_SECRET_KEY).",
        });
    const sid = String(req.body?.session_id || "");
    if (!/^cs_[\w]+$/.test(sid))
      return res.status(400).json({ error: "Plačila ni mogoče najti." });
    try {
      const session = await stripe.request("GET", `/checkout/sessions/${sid}`);
      if (
        String(session.metadata?.parent_id) !== String(req.parent.id) ||
        session.metadata?.kind !== "gift"
      )
        return res.status(404).json({ error: "Plačilo ne obstaja." });
      complete(session);
      const g = get(Number(session.metadata.gift_id));
      res.json({
        paid: g?.status === "paid",
        code: g?.status === "paid" ? g.code : null,
      });
    } catch (err) {
      log.error?.("[evklid] Stripe darilo (potrditev):", err.message);
      res
        .status(502)
        .json({
          error: "Plačila ni bilo mogoče preveriti. Osveži stran čez minuto.",
        });
    }
  });

  return {
    complete,
    end,
    redeem,
    listFor,
    isGift: (code) =>
      GIFT_RE.test(
        String(code || "")
          .trim()
          .toUpperCase(),
      ),
    get,
  };
}
