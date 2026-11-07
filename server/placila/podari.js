// »Podari Evklid« (j 2026-11-04, kartica »Oboje«): otroci, ki si naročnine ne morejo privoščiti, dobijo kodo
// za 3 mesece. Kdo kodo dobi, presodi šola; Evklid podatkov o dohodkih nikoli ne vpraša in ne hrani, na profilu
// ni nobene oznake (koda je navadna darilna koda DAR-…, server/placila/darila.js).
// Dva vira kod:
//  - pilot: Evklid kode plača iz svojega proračuna za AI (2–3 na šolo, skupaj največ 10 na mesec ≈ 20 $ AI);
//  - sklad: kupci kupijo »Podari mesec« (cena OŠ meseca). Dodatka 2/5/10 € pri plačilu naročnine ni več
//    (j 2026-11-04, brez mikrotransakcij); stari vnosi kind = 'addon' v podari_fund ostanejo v skladu in se
//    berejo kot doslej (invoicePaid, addonOf, end), novih ni.
//    To ni donacija dobrodelni organizaciji: je nakup darila za neznanega prejemnika (brez davčne olajšave).
//    Do s.p. deluje samo v testnem načinu Stripa, kot vsa plačila.
import { levelPlanFor } from "../accounts/plans.js";
import { newCode } from "./darila.js";
import { audit } from "../dnevnik-dostopov.js";
import { BIRTH_MISSING_PAY } from "../accounts/age.js";

export const PODARI_DAYS = 90; // 3 mesece
export const PODARI_MONTHS = 3;
export const PODARI_TEXT =
  "Razumem, da to ni donacija dobrodelni organizaciji in da davčne olajšave ni."; // enako kot potrditev pod.notDonation
export const PODARI_ADULT = "Sem polnoletna oseba.";
const num = (k, d) => {
  const v = Number(process.env[k]);
  return Number.isInteger(v) && v >= 0 && process.env[k] !== "" && process.env[k] !== undefined ? v : d;
};
export const pilotPerSchool = () => num("EVKLID_PODARI_PER_SCHOOL", 3);
export const pilotPerMonth = () => num("EVKLID_PODARI_PILOT_MONTH", 10);
// Mesec naročnine stopnje v centih (OŠ 9,99 €, SŠ 13,99 €); en »podarjen mesec« na števcu je mesec OŠ.
export const monthCents = (level = "OS") => levelPlanFor(level, "month")?.amount || 999;

export function migratePodari(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS podari_fund (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER REFERENCES parents(id) ON DELETE SET NULL,
      kind TEXT NOT NULL,                       -- addon (pri naročnini) | month (samostojen nakup)
      amount INTEGER NOT NULL,                  -- centi z DDV
      status TEXT NOT NULL DEFAULT 'pending',   -- pending | paid | refunded | disputed
      checkout_id TEXT,
      payment_id TEXT,
      paid_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_podari_payment ON podari_fund(payment_id);
  `);
  const cols = db.prepare("PRAGMA table_info(gifts)").all().map((c) => c.name);
  if (!cols.includes("source")) db.exec("ALTER TABLE gifts ADD COLUMN source TEXT"); // NULL = kupljeno darilo | pilot | sklad
  if (!cols.includes("school")) db.exec("ALTER TABLE gifts ADD COLUMN school TEXT");
}

// ctx: { db, stripe, json, log, ensureCustomer, baseUrl, isMinor }
export function mountPodari(app, ctx) {
  const { db, stripe, json, log, ensureCustomer, baseUrl, isMinor, birthMissing = () => false } = ctx;
  migratePodari(db);

  const paidSum = () => db.prepare("SELECT COALESCE(SUM(amount), 0) AS c FROM podari_fund WHERE status = 'paid'").get().c;
  // Sklad porabijo kode iz sklada (amount = cena 3 mesecev stopnje); preklicana nevpisana koda denar vrne v sklad.
  const spent = () => db.prepare("SELECT COALESCE(SUM(amount), 0) AS c FROM gifts WHERE source = 'sklad' AND status = 'paid'").get().c;
  // Vračilo plačila v sklad po izdaji kod iz sklada bi dalo negativno stanje: sklad nikoli ni pod 0.
  const balance = () => Math.max(0, paidSum() - spent());

  function stats() {
    const codes = db.prepare("SELECT source, COUNT(*) AS n, SUM(redeemed_at IS NOT NULL) AS used FROM gifts WHERE source IN ('pilot', 'sklad') AND status = 'paid' GROUP BY source").all();
    const by = Object.fromEntries(codes.map((c) => [c.source, c]));
    const used = (by.pilot?.used || 0) + (by.sklad?.used || 0);
    return {
      // Meseci, ki so jih plačali kupci (mesec OŠ), meseci, ki jih je podaril Evklid, in meseci v uporabi.
      donated_months: Math.max(0, Math.floor(paidSum() / monthCents("OS"))),
      evklid_months: (by.pilot?.n || 0) * PODARI_MONTHS,
      in_use_months: used * PODARI_MONTHS,
      month_price: monthCents("OS"),
      text: PODARI_TEXT,
    };
  }

  // invoice.paid: prvi plačan račun naročnine z (starim) dodatkom (podari_id v metadata naročnine) ga potrdi.
  // Novih dodatkov ni; to ostane za naročnine, sklenjene pred 5. 11. 2026, ki prvi račun plačajo po koncu preizkusa.
  function invoicePaid(inv) {
    const id = Number(inv?.subscription_details?.metadata?.podari_id);
    if (!id || !(inv.amount_paid > 0)) return false;
    const row = db.prepare("SELECT * FROM podari_fund WHERE id = ? AND kind = 'addon'").get(id);
    const pid = String(inv.subscription_details?.metadata?.parent_id || "");
    if (!row || row.status !== "pending" || (pid && String(row.parent_id) !== pid) || inv.amount_paid < row.amount) return false;
    const pi = typeof inv.payment_intent === "string" ? inv.payment_intent : inv.payment_intent?.id || null;
    return db.prepare("UPDATE podari_fund SET status = 'paid', payment_id = ?, paid_at = datetime('now') WHERE id = ? AND status = 'pending'").run(pi, id).changes > 0;
  }

  // Dodatek na računu naročnine: amount = znesek dodatka na tem računu, held = koliko ga je še v skladu
  // (za garancijo in nagrado za priporočilo: dodatek ni plačilo naročnine).
  function addonOf(inv) {
    const pi = typeof inv?.payment_intent === "string" ? inv.payment_intent : inv?.payment_intent?.id;
    const row = pi && db.prepare("SELECT amount, status FROM podari_fund WHERE payment_id = ? AND kind = 'addon'").get(pi);
    if (row) return { amount: row.amount, held: row.status === "paid" ? row.amount : 0 };
    // invoice.paid še ni obdelan: dodatek je na prvem računu naročnine.
    const id = Number(inv?.subscription_details?.metadata?.podari_id);
    const pending = id && inv.billing_reason === "subscription_create" && db.prepare("SELECT amount FROM podari_fund WHERE id = ? AND kind = 'addon' AND status = 'pending'").get(id);
    return pending ? { amount: pending.amount, held: pending.amount } : { amount: 0, held: 0 };
  }

  // Samostojen nakup »Podari mesec« je plačan (Checkout Session v načinu payment).
  // unmatched(razlog): kupec je račun izbrisal pred plačilom (parent_id SET NULL) – zapis za ročno vračilo (webhook).
  function complete(session, unmatched = null) {
    if (session?.metadata?.kind !== "podari" || session.payment_status !== "paid") return false;
    const row = db.prepare("SELECT * FROM podari_fund WHERE id = ?").get(Number(session.metadata.fund_id));
    if (row && row.parent_id == null && row.status === "pending") unmatched?.("kupec_izbrisan");
    if (!row || row.kind !== "month" || String(row.parent_id) !== String(session.metadata.parent_id)) return false;
    const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null;
    return db.prepare("UPDATE podari_fund SET status = 'paid', payment_id = ?, paid_at = datetime('now') WHERE id = ? AND status = 'pending'").run(pi, row.id).changes > 0;
  }

  // Vračilo ali spor: znesek gre iz sklada (kode, ki so že izdane, ostanejo). Vrne vrsto vnosa ali null,
  // da webhook ve, ali je plačilo samo »Podari« (month) ali tudi naročnina (addon na istem plačilu).
  // charge (pri vračilu): dodatek se konča šele, ko od plačila ostane manj kot dodatek (delno vračilo naročnine,
  // npr. garancija ali odstop, dodatka ne vzame iz sklada).
  function end(paymentId, status, charge = null) {
    const row = paymentId && db.prepare("SELECT * FROM podari_fund WHERE payment_id = ?").get(paymentId);
    if (!row) return null;
    if (row.kind === "addon" && charge && Number(charge.amount) - Number(charge.amount_refunded || 0) >= row.amount) return row.kind;
    db.prepare("UPDATE podari_fund SET status = ? WHERE id = ? AND status = 'paid'").run(status, row.id);
    return row.kind;
  }

  // Javni števec (tudi brez prijave, za stran za šole).
  app.get("/api/podari", (_req, res) => res.json(stats()));

  app.post("/api/billing/podari", json, async (req, res) => {
    const p = req.parent;
    if (!stripe.enabled) return res.status(503).json({ error: "Plačila še niso nastavljena (manjka STRIPE_SECRET_KEY)." });
    if (p.is_guest) return res.status(403).json({ error: "Najprej ustvari račun." });
    if (birthMissing(p)) return res.status(403).json(BIRTH_MISSING_PAY);
    if (isMinor(p)) return res.status(403).json({ error: "Podari lahko samo polnoletna oseba." });
    if (req.body?.adult !== true || req.body?.understand !== true) return res.status(400).json({ error: "Pred plačilom sta potrebni obe potrditvi.", consent: true });
    const open = db.prepare("SELECT COUNT(*) AS n FROM podari_fund WHERE parent_id = ? AND status = 'pending' AND kind = 'month' AND created_at > datetime('now', '-1 day')").get(p.id).n;
    if (open >= 5) return res.status(429).json({ error: "Preveč odprtih nakupov. Poskusi jutri." });
    const amount = monthCents("OS");
    try {
      const customer = await ensureCustomer(p);
      const id = Number(db.prepare("INSERT INTO podari_fund (parent_id, kind, amount) VALUES (?, 'month', ?)").run(p.id, amount).lastInsertRowid);
      const lang = /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(String(req.body?.lang || "")) ? req.body.lang : "sl";
      // Shrani se samo to, kar je kupec potrdil (polnoletnost in »ni donacija«), ne besedilo o odstopu pri naročnini.
      db.prepare("INSERT INTO billing_consents (parent_id, payer_email, kind, text) VALUES (?, ?, 'podari', ?)").run(p.id, p.email, `${PODARI_ADULT}\n${PODARI_TEXT}\n[jezik: ${lang}]`);
      const meta = { kind: "podari", fund_id: id, parent_id: p.id, parent_uid: p.uid || undefined };
      const base = baseUrl(req);
      const session = await stripe.request("POST", "/checkout/sessions", {
        mode: "payment",
        customer,
        client_reference_id: String(p.id),
        line_items: [{ price_data: { currency: "eur", unit_amount: amount, tax_behavior: "inclusive", product_data: { name: "Podari Evklid – 1 mesec za otroka, ki ga izbere šola" } }, quantity: 1 }],
        success_url: `${base}/?billing=podari&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/?billing=cancel`,
        locale: "sl",
        metadata: meta,
        payment_intent_data: { metadata: meta },
      });
      db.prepare("UPDATE podari_fund SET checkout_id = ? WHERE id = ?").run(session.id, id);
      res.json({ url: session.url });
    } catch (err) {
      log.error?.("[evklid] Stripe podari:", err.message);
      res.status(502).json({ error: "Plačilne strani ni bilo mogoče odpreti. Poskusi znova." });
    }
  });

  app.post("/api/billing/podari/confirm", json, async (req, res) => {
    if (!stripe.enabled) return res.status(503).json({ error: "Plačila še niso nastavljena (manjka STRIPE_SECRET_KEY)." });
    const sid = String(req.body?.session_id || "");
    if (!/^cs_[\w]+$/.test(sid)) return res.status(400).json({ error: "Plačila ni mogoče najti." });
    try {
      const session = await stripe.request("GET", `/checkout/sessions/${sid}`);
      if (String(session.metadata?.parent_id) !== String(req.parent.id) || session.metadata?.kind !== "podari") return res.status(404).json({ error: "Plačilo ne obstaja." });
      complete(session);
      const row = db.prepare("SELECT status FROM podari_fund WHERE id = ?").get(Number(session.metadata.fund_id));
      res.json({ paid: row?.status === "paid" });
    } catch (err) {
      log.error?.("[evklid] Stripe podari (potrditev):", err.message);
      res.status(502).json({ error: "Plačila ni bilo mogoče preveriti. Osveži stran čez minuto." });
    }
  });

  // --- skrbnik: kode za šole ---
  const admin = (req, res) => {
    if (req.parent?.is_admin) return true;
    res.status(403).json({ error: "Samo za skrbnika." });
    return false;
  };
  const adminView = () => ({
    ...stats(),
    balance: balance(),
    per_school: pilotPerSchool(),
    pilot_month_left: Math.max(0, pilotPerMonth() - db.prepare("SELECT COUNT(*) AS n FROM gifts WHERE source = 'pilot' AND created_at >= date('now', 'start of month')").get().n),
    codes: db
      .prepare("SELECT id, code, school, source, level, status, redeemed_at, created_at FROM gifts WHERE source IN ('pilot', 'sklad') ORDER BY id DESC LIMIT 200")
      .all()
      .map((g) => ({ ...g, redeemed: !!g.redeemed_at, redeemed_at: undefined })),
  });

  app.get("/api/admin/podari", (req, res) => {
    if (admin(req, res)) res.json(adminView());
  });

  app.post("/api/admin/podari/codes", json, (req, res) => {
    if (!admin(req, res)) return;
    // NFKC in brez nevidnih znakov, da »OŠ« (Š kot S + strešica) ali ničelni presledek ne obide meje na šolo.
    const school = String(req.body?.school || "").normalize("NFKC").replace(/[\u200B-\u200D\u2060\uFEFF\u00AD]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
    if (school.length < 2) return res.status(400).json({ error: "Vpiši ime šole." });
    const count = Number(req.body?.count);
    if (!Number.isInteger(count) || count < 1 || count > 10) return res.status(400).json({ error: "Število kod mora biti od 1 do 10." });
    const level = req.body?.level === "SS" ? "SS" : req.body?.level === undefined || req.body?.level === "OS" ? "OS" : null;
    if (!level) return res.status(400).json({ error: "Kode so za osnovno ali srednjo šolo." });
    const source = req.body?.source === "sklad" ? "sklad" : req.body?.source === "pilot" ? "pilot" : null;
    if (!source) return res.status(400).json({ error: "Izberi vir: pilot ali sklad." });
    const cost = source === "sklad" ? PODARI_MONTHS * monthCents(level) : 0;
    const make = () => {
      if (source === "pilot") {
        // Ime šole brez ozira na velike črke (SQLite lower() ne pozna Š, Č, Ž).
        const key = school.toLocaleLowerCase("sl");
        const atSchool = db.prepare("SELECT school FROM gifts WHERE source = 'pilot' AND status = 'paid'").all().filter((g) => String(g.school || "").normalize("NFKC").toLocaleLowerCase("sl") === key).length;
        if (atSchool + count > pilotPerSchool()) return { error: `Ta šola ima že ${atSchool} pilotnih kod (največ ${pilotPerSchool()}).` };
        const thisMonth = db.prepare("SELECT COUNT(*) AS n FROM gifts WHERE source = 'pilot' AND created_at >= date('now', 'start of month')").get().n;
        if (thisMonth + count > pilotPerMonth()) return { error: `Ta mesec je ostalo še ${Math.max(0, pilotPerMonth() - thisMonth)} pilotnih kod.` };
      } else if (balance() < cost * count) return { error: "V skladu ni dovolj denarja za toliko kod." };
      const ins = db.prepare("INSERT INTO gifts (buyer_id, amount, currency, days, status, code, level, source, school) VALUES (NULL, ?, 'EUR', ?, 'paid', ?, ?, ?, ?)");
      for (let i = 0; i < count; i++) {
        for (let t = 0; ; t++) {
          try {
            ins.run(cost, PODARI_DAYS, newCode(), level, source, school);
            break;
          } catch (e) {
            if (!/UNIQUE/.test(String(e.message)) || t > 4) throw e;
          }
        }
      }
      return { ok: true };
    };
    // Ena transakcija: preverjanje meje in vpis kod skupaj (dva skrbnika hkrati ne preseženeta meje).
    let r;
    db.exec("BEGIN IMMEDIATE");
    try {
      r = make();
      db.exec(r.error ? "ROLLBACK" : "COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
    if (r.error) return res.status(409).json({ error: r.error });
    audit(db, { req, parentId: req.parent.id, actor: "admin", action: `podari_${source}`, target: `${count}` });
    res.status(201).json(adminView());
  });

  // Preklic nevpisane kode (npr. šola je ne potrebuje): koda iz sklada vrne denar v sklad.
  app.post("/api/admin/podari/codes/:id/revoke", json, (req, res) => {
    if (!admin(req, res)) return;
    const r = db.prepare("UPDATE gifts SET status = 'revoked' WHERE id = ? AND source IN ('pilot', 'sklad') AND status = 'paid' AND redeemed_at IS NULL").run(Number(req.params.id));
    if (!r.changes) return res.status(409).json({ error: "Preklicati je mogoče samo nevpisano kodo." });
    audit(db, { req, parentId: req.parent.id, actor: "admin", action: "podari_revoke" });
    res.json(adminView());
  });

  return { stats, addonOf, invoicePaid, complete, end };
}
