// Novi del plačil (j 2026-10-30, načrt »Evklid – nov sistem plačil«):
// - paketi pred testom: enkratno plačilo za 7 ali 14 dni polnega dostopa za en profil,
//   ponudijo se samo učencu brez aktivne naročnine;
// - povezava »Prosi starše za plačilo«: mladoletni imetnik računa pošlje staršu povezavo,
//   starš pregleda in plača brez lastnega računa v Evklidu;
// - dve potrditvi pred vsakim plačilom (polnoletnost in takojšen začetek z vedenjem o odstopu);
// - skrbniške aktivacijske kode (seznam, nova koda, izklop);
// - dnevna opravila: usklajevanje naročnin s Stripom, opomnik pred koncem kode in pred letno obnovitvijo.
import express from "express";
import { randomToken, sha256, Throttle } from "./auth.js";
import { passesFor, passByDays, passByKey, passForDaysLeft, paidActive, planFor, planByKey, isPremiumChild, GRACE_DAYS, currencyDecimals, schoolPlanFor, isSchoolPlan, planLevel, levelPlanFor, familyPlanFor, LEVEL_LABEL, explanationsFor, guaranteeUsd, passCapUsd, planGuarantee, vatRateFor, aiCapFromNetEur } from "./plans.js";
import { BIRTH_MISSING_PAY } from "./age.js";
import { Schedules, nowParts, cleanDate, TEST_KINDS } from "../schedule.js";
import { cleanText } from "../settings.js";
import { ljNow } from "./goal-reminder.js";
import { promoEndingEmail, renewalEmail, schoolSubEndEmail, planChangeEmail, allowanceEmail } from "./email.js";
import { audit } from "../dnevnik-dostopov.js";
import { NO_PRICE_AGE } from "../placila/ponudbe.js";
import { CREDIT_PACKS, packById, creditUsdFor, conversationsFor } from "../placila/krediti.js";

export const ADULT_TEXT = "Sem polnoleten/-na in plačujem za svoj profil ali kot starš oziroma skrbnik.";
// Odstop v 14 dneh (j 2026-11-06): vrne se del plačila za neporabljeno storitev, sorazmerno PORABI: manjši od deleža
// preostalega časa in deleža neporabljene meje AI (withdrawalRefundCents). Besedilo pred zagonom plačil preveri pravnik.
export const WITHDRAWAL_TEXT =
  "Želim, da se uporaba začne takoj. Vem, da lahko v 14 dneh odstopim od pogodbe. Takrat dobim vrnjen del plačila za storitev, ki je še nisem porabil: manjši od deleža preostalega časa in deleža še neporabljenih vprašanj za inštruktorja.";
export const WITHDRAWAL_DAYS = 14;
// Vračilo ob odstopu v centih: plačilo × min(delež preostalega časa, delež neporabljene meje AI), navzdol na cent.
// Brez meje AI (aiCapUsd 0) velja le delež časa.
export function withdrawalRefundCents({ paidCents, startMs, endMs, nowMs = Date.now(), aiCapUsd = 0, aiSpentUsd = 0 }) {
  const clamp = (x) => Math.min(1, Math.max(0, Number.isFinite(x) ? x : 0));
  const timeLeft = endMs > startMs ? clamp((endMs - nowMs) / (endMs - startMs)) : 0;
  const aiLeft = aiCapUsd > 0 ? clamp(1 - aiSpentUsd / aiCapUsd) : 1;
  return { cents: Math.max(0, Math.floor((Number(paidCents) || 0) * Math.min(timeLeft, aiLeft))), timeLeft, aiLeft };
}
const PAY_LINK_DAYS = 7;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function migrateBilling(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS passes (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      days INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      ai_usd REAL NOT NULL,
      test_date TEXT,
      test_name TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending', -- pending | active | refunded | disputed | expired
      checkout_id TEXT,
      payment_id TEXT,
      starts_at TEXT,
      ends_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_passes_student ON passes(student_id, status);
    CREATE INDEX IF NOT EXISTS idx_passes_payment ON passes(payment_id);
    CREATE TABLE IF NOT EXISTS pay_links (
      token_hash TEXT PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,                     -- sub | pass
      plan_key TEXT,
      student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
      days INTEGER,
      test_date TEXT,
      test_name TEXT NOT NULL DEFAULT '',
      pass_id INTEGER,
      expires_at TEXT NOT NULL,
      done_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    -- Dokaz o potrditvah pred plačilom (polnoletnost, takojšen začetek in pravica do odstopa).
    CREATE TABLE IF NOT EXISTS billing_consents (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER REFERENCES parents(id) ON DELETE SET NULL,
      payer_email TEXT NOT NULL DEFAULT '',
      kind TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    -- Webhooki: vsak dogodek se obdela enkrat (ponudnik ga lahko pošlje večkrat).
    CREATE TABLE IF NOT EXISTS billing_events (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      received_at TEXT NOT NULL DEFAULT (datetime('now')),
      processed_at TEXT,
      error TEXT
    );
  `);
  const cols = db.prepare("PRAGMA table_info(parents)").all().map((c) => c.name);
  // Začetek neuspelega plačila (status past_due): poln dostop ostane še GRACE_DAYS dni.
  if (!cols.includes("past_due_since")) db.exec("ALTER TABLE parents ADD COLUMN past_due_since TEXT");
  // Stopnja paketa pred testom (FAKS: faks cene in meja AI ×1,5; SS: paket OŠ in SŠ; prazno: kupljen pred cenami po stopnjah, vse stopnje).
  const pcols = db.prepare("PRAGMA table_info(passes)").all().map((c) => c.name);
  if (!pcols.includes("level")) db.exec("ALTER TABLE passes ADD COLUMN level TEXT");
  // Prehod stopnje (j 2026-11-01): nova cena ob naslednjem podaljšanju, e-pošta vsaj 30 dni prej.
  // Ena vrstica na račun: čakajoča sprememba paketa naročnine (to_key) z dnem, ko začne veljati.
  db.exec(`
    CREATE TABLE IF NOT EXISTS plan_changes (
      parent_id INTEGER PRIMARY KEY REFERENCES parents(id) ON DELETE CASCADE,
      sub_id TEXT NOT NULL,
      from_key TEXT NOT NULL,
      to_key TEXT NOT NULL,
      effective_at TEXT NOT NULL,
      notified_at TEXT,
      applied_at TEXT
    );
    -- Naročnina iz trgovine (Apple, Google) za en profil: cene ob podaljšanju ne moremo zamenjati sami, zato je višja
    -- stopnja profila odprta samo do konca obdobja, v katerem je profil prešel nanjo (until), nato le stopnja
    -- izdelka in nižje (server/accounts/index.js storeGrace).
    CREATE TABLE IF NOT EXISTS store_level_grace (
      parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      sub_id TEXT NOT NULL,
      level TEXT NOT NULL,
      until TEXT NOT NULL,
      PRIMARY KEY (parent_id, sub_id, level)
    );
  `);
}

// Prvo podaljšanje naročnine (konec obdobja periodEnd, nato vsak mesec ali leto), ki je vsaj minMs po zdaj:
// nova cena velja šele tedaj, da je e-pošta poslana vsaj 30 dni prej.
export function firstRenewalAfter(periodEnd, interval, minMs) {
  const d = new Date(periodEnd);
  if (!Number.isFinite(d.getTime())) return null;
  for (let i = 0; i < 40 && d.getTime() < minMs; i++) {
    if (interval === "year") d.setUTCFullYear(d.getUTCFullYear() + 1);
    else d.setUTCMonth(d.getUTCMonth() + 1);
  }
  return d.toISOString();
}

// Paket, ki naj velja ob naslednjem podaljšanju (prehod stopnje, j 2026-11-01), ali null (ni spremembe).
// plan: sedanji paket; levels: stopnje profilov računa po vrsti (prvi je profil s sedežem pri paketu za en profil).
// En profil: cena stopnje profila (navzgor in navzdol). Družina: navzdol (brez študenta) ob podaljšanju, navzgor
// samo z nadgradnjo (faks profil je do takrat zaklenjen); stari paket »2 otroka« preide na Družino.
export function targetPlan(plan, levels) {
  if (!plan || plan.school || (plan.currency && plan.currency !== "EUR") || !planLevel(plan)) return null;
  const withStudent = levels.includes("FAKS");
  let to = null;
  if (plan.family) {
    if (plan.legacy) to = familyPlanFor(withStudent, plan.interval);
    else if (plan.level === "FAKS" && !withStudent) to = familyPlanFor(false, plan.interval);
  } else if (levels.length) to = levelPlanFor(levels[0], plan.interval);
  return to && to.key !== plan.key ? to : null;
}

const iso = (ms) => new Date(ms).toISOString();

export class Passes {
  constructor(db) {
    this.db = db;
  }
  create({ parentId, studentId, plan, testDate, testName }) {
    const r = this.db
      .prepare("INSERT INTO passes (parent_id, student_id, days, amount, currency, ai_usd, test_date, test_name, level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(parentId, studentId, plan.days, plan.amount, plan.currency, plan.aiUsd, testDate, testName || "", plan.level || "SS");
    return Number(r.lastInsertRowid);
  }
  get(id) {
    return this.db.prepare("SELECT * FROM passes WHERE id = ?").get(Number(id)) || null;
  }
  setCheckout(id, checkoutId) {
    this.db.prepare("UPDATE passes SET checkout_id = ? WHERE id = ?").run(checkoutId, id);
  }
  // Iz »pending« (ali »expired«, ko zamudno plačilo, npr. SEPA, prispe po 48 h) v »active«;
  // ponovljen klic (webhook in vrnitev s plačilne strani) ne podaljša paketa.
  // Če ima profil že aktiven paket (dva plačnika hkrati), se novi začne, ko prejšnji poteče.
  activate(id, paymentId, now = Date.now()) {
    const p = this.get(id);
    if (!p || (p.status !== "pending" && p.status !== "expired")) return false;
    const prev = this.latestFor(p.student_id, now);
    const start = prev ? Math.max(now, Date.parse(prev.ends_at)) : now;
    const r = this.db
      .prepare("UPDATE passes SET status = 'active', payment_id = ?, starts_at = ?, ends_at = ? WHERE id = ? AND status IN ('pending','expired')")
      .run(paymentId || null, iso(start), iso(start + p.days * 86400000), id);
    return r.changes > 0;
  }
  activeFor(studentId, now = Date.now()) {
    return (
      this.db
        .prepare("SELECT * FROM passes WHERE student_id = ? AND status = 'active' AND starts_at <= ? AND ends_at > ? ORDER BY ends_at DESC")
        .get(studentId, iso(now), iso(now)) || null
    );
  }
  // Zadnji plačan paket, ki še ni potekel (tudi če se začne šele za trenutno aktivnim).
  latestFor(studentId, now = Date.now()) {
    return this.db.prepare("SELECT * FROM passes WHERE student_id = ? AND status = 'active' AND ends_at > ? ORDER BY ends_at DESC").get(studentId, iso(now)) || null;
  }
  byPayment(paymentId) {
    return paymentId ? this.db.prepare("SELECT * FROM passes WHERE payment_id = ?").get(paymentId) || null : null;
  }
  // Vračilo ali spor: paket se konča takoj.
  end(id, status) {
    this.db.prepare("UPDATE passes SET status = ?, ends_at = ? WHERE id = ?").run(status, iso(Date.now()), id);
  }
  // Poraba AI v času paketa (v dolarjih, kot zaračunava Claude API), brez dela, ki ga je plačal dokupljeni kredit
  // (sicer bi ga meja paketa štela dvakrat: v porabi in z manjšim stanjem kredita; pregled #462).
  spentUsd(pass) {
    const all = this.db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE student_id = ? AND created_at >= datetime(?)").get(pass.student_id, pass.starts_at).s;
    const hasCredits = this.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'ai_credit_use'").get();
    const credit = hasCredits ? this.db.prepare("SELECT COALESCE(SUM(usd),0) AS s FROM ai_credit_use WHERE student_id = ? AND created_at >= datetime(?)").get(pass.student_id, pass.starts_at).s : 0;
    return Math.max(0, all - credit);
  }
  expirePending(hours = 48) {
    return this.db.prepare("UPDATE passes SET status = 'expired' WHERE status = 'pending' AND created_at < datetime('now', ?)").run(`-${hours} hours`).changes;
  }
}

export const publicPass = (p) =>
  p && { id: p.id, days: p.days, amount: p.amount, currency: p.currency, status: p.status, test_name: p.test_name, test_date: p.test_date, ends_at: p.ends_at };

// Najbližji test (test, kolokvij, izpit, ustno) v naslednjih 30 dneh iz urnika učenca.
export function nextTest(schedules, studentId, now = new Date()) {
  const today = nowParts(now).date;
  const days = (d) => Math.round((Date.parse(`${d}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86400000);
  return (
    schedules
      .get(studentId)
      .events.filter((e) => TEST_KINDS.includes(e.kind))
      .map((e) => ({ id: e.id, name: e.name, date: e.date, kind: e.kind, daysLeft: days(e.date) }))
      .filter((e) => e.daysLeft >= 0 && e.daysLeft <= 29)
      .sort((a, b) => a.daysLeft - b.daysLeft)[0] || null
  );
}

export function mountBilling(app, ctx) {
  const { credits = null, db, store, stripe, log, json, getParent, update, childIds, ownerOf, ensureCustomer, accessOf, baseUrl, sendMail, currencyOf, isMinor, birthMissing = () => false, applySubscription, syncCustomer, promo, kv, offersFor = () => ({ show: true, prices: true }), hasSchoolChild = () => false, levelOf = () => "OS", planForParent = null, aiUsage = null, ageOf = () => null, paidPeriods = null } = ctx;
  // Paket naročnine za račun: stopnja profila (en profil) ali Družina (glej index.js planForAccount).
  const subPlan = (p, seats, interval, currency) => (planForParent ? planForParent(p.id, seats, interval, currency) : planFor(seats, interval, currency));
  migrateBilling(db);
  const passes = new Passes(db);
  const schedules = new Schedules(db);
  const publicThrottle = new Throttle(30, 15 * 60000);
  const linkThrottle = new Throttle(10, 3600000);

  const needStripe = (res) => {
    if (stripe.enabled) return false;
    res.status(503).json({ error: "Plačila še niso nastavljena (manjka STRIPE_SECRET_KEY)." });
    return true;
  };
  const consented = (body) => body?.adult === true && body?.withdrawal === true;
  const consentError = { error: "Pred plačilom sta potrebni obe potrditvi.", consent: true };
  // Shrani se slovensko besedilo in jezik, v katerem ju je plačnik prebral (prevod je v public/i18n).
  function recordConsent(parentId, payerEmail, kind, lang) {
    const l = /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(String(lang || "")) ? lang : "sl";
    db.prepare("INSERT INTO billing_consents (parent_id, payer_email, kind, text) VALUES (?, ?, ?, ?)").run(parentId, payerEmail || "", kind, `${ADULT_TEXT}\n${WITHDRAWAL_TEXT}\n[jezik: ${l}]`);
  }

  // Ali ima profil poln dostop iz paketa pred testom (dokler ni porabljena meja AI paketa).
  function passPremium(studentId) {
    const p = passes.activeFor(studentId);
    // Meja paketa največ 25 % plačila (plans.js passCapUsd). Brez prostora za najcenejši klic je paket porabljen:
    // profil preide v brezplačni paket (kot šola), ne ostane zaklenjen z napačnim besedilom (pregled #462).
    return !!p && passes.spentUsd(p) + (aiUsage?.minCallUsd?.() || 0) < passCapUsd(p);
  }

  // Preverjanje nakupa paketa (za plačilo v aplikaciji in za povezavo za starše).
  // Vrne { plan, studentId, test } ali { status, body } za napako.
  function checkPass(req, parent, body) {
    const studentId = Number(body?.student_id);
    if (!Number.isInteger(studentId) || ownerOf(studentId) !== parent.id) return { status: 404, body: { error: "Učenec ne obstaja." } };
    // Faks ima svoje pakete (6,99 / 11,49 €), OŠ in SŠ skupne (plans.js PASSES).
    const level = levelOf(studentId);
    const plan = passByDays(body?.days, level);
    if (!plan) return { status: 400, body: { error: "Neznan paket." } };
    // j 2026-10-30: paket se ponudi samo učencu brez aktivne naročnine na Evklid.
    if (paidActive(parent)) return { status: 409, body: { error: "Ta račun že ima naročnino, zato paket pred testom ni potreben.", subscription: true } };
    if (passes.latestFor(studentId)) return { status: 409, body: { error: "Ta profil že ima aktiven paket pred testom.", active: true } };
    if (currencyOf(req, parent) !== "EUR") return { status: 400, body: { error: "Paketi pred testom so zaenkrat na voljo samo v evrih." } };
    const date = cleanDate(body?.test_date);
    const today = nowParts().date;
    const left = date ? Math.round((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86400000) : -1;
    // Test mora biti v času, ki ga pokrije najdaljši paket (14 dni, plans.js passForDaysLeft).
    if (left < 0 || !passForDaysLeft(left, level)) return { status: 400, body: { error: "Paket pred testom je za test v naslednjih 14 dneh." } };
    return { plan, studentId, test: { date, name: cleanText(body?.test_name, 80) } };
  }

  function passLineItem(plan) {
    return {
      price_data: {
        currency: plan.currency.toLowerCase(),
        unit_amount: plan.amount,
        tax_behavior: "inclusive",
        product_data: { name: `Evklid – ${plan.label} (${plan.days} dni)` },
      },
      quantity: 1,
    };
  }

  // Plačilo paketa je uspelo: vklopi ga (enkrat). session = Stripe Checkout Session.
  function completePassSession(session) {
    if (session?.metadata?.kind !== "pass" || session.payment_status !== "paid") return false;
    const pass = passes.get(session.metadata.pass_id);
    if (!pass || String(pass.parent_id) !== String(session.metadata.parent_id)) return false;
    if (pass.status === "expired") log.error?.("[evklid] zamudno plačilo paketa po izteku čakanja; paket vklopljen", pass.id);
    const ok = passes.activate(pass.id, typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id);
    if (ok) {
      db.prepare("UPDATE pay_links SET done_at = datetime('now') WHERE pass_id = ? AND done_at IS NULL").run(pass.id);
      if (session.metadata.pay_link) db.prepare("UPDATE pay_links SET done_at = datetime('now') WHERE token_hash = ? AND done_at IS NULL").run(session.metadata.pay_link);
    }
    return ok;
  }

  // Naročnina, plačana prek povezave za starše: plačnikova stranka v Stripu postane stranka računa.
  async function completeSubSession(session) {
    const parent = getParent(Number(session?.metadata?.parent_id));
    if (!parent || !session.subscription) return false;
    const subId0 = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    if (paidActive(parent) && parent.sub_id && parent.sub_id !== subId0)
      log.error?.("[evklid] račun je plačan dvakrat (dve naročnini); prejšnjo je treba preklicati v Stripu", parent.id, parent.sub_id);
    if (session.customer) update(parent.id, { stripe_customer_id: session.customer });
    const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    await applySubscription(parent.id, await stripe.request("GET", `/subscriptions/${subId}`));
    if (session.metadata.pay_link) db.prepare("UPDATE pay_links SET done_at = datetime('now') WHERE token_hash = ? AND done_at IS NULL").run(session.metadata.pay_link);
    return true;
  }

  // --- paket pred testom ---
  // Ponudba paketa pred testom za profil ali null (j 2026-10-30): samo brez naročnine, s testom, ki ga paket pokrije
  // (v 14 dneh; brez 30-dnevnega paketa, j 2026-11-04), po
  // pravilih ponudb; ena ponudba naenkrat (ponudbe.js oneOffer): naročnik paketa nikoli ne dobi.
  // Vrne { test, parent_info } ali { test, suggested, pay_link }.
  function passOfferFor(studentId, req = null) {
    const parent = getParent(ownerOf(studentId));
    if (!parent || !stripe.enabled || passes.latestFor(studentId) || paidActive(parent)) return null;
    if (currencyOf(req || { headers: {} }, parent) !== "EUR") return null;
    const test = nextTest(schedules, studentId);
    if (!test) return null;
    const suggested = passForDaysLeft(test.daysLeft, levelOf(studentId));
    if (!suggested) return null; // test je dlje, kot ga pokrije najdaljši paket
    // Pravila ponudb (server/placila/ponudbe.js): ne med poukom in ne, če jih je učitelj izklopil;
    // pod 15 let brez cene, le povezava s podatki za starše.
    const policy = offersFor(studentId);
    if (!policy.show) return null;
    // Preizkus, koda ali bonus, ki pokrije čas do dneva po testu: ponudba ni potrebna.
    const access = accessOf(parent);
    const coverEnd = Date.parse(`${test.date}T23:59:59Z`) + 86400000;
    if (isPremiumChild(access, childIds(parent.id), studentId) && access.until && Date.parse(access.until) >= coverEnd) return null;
    if (!policy.prices) return { test, parent_info: true };
    return { test, suggested: suggested.days, pay_link: isMinor(parent), ...(birthMissing(parent) ? { birth_missing: true } : {}) };
  }

  // --- paket pred testom ---
  app.get("/api/students/:id/pass-offer", (req, res) => {
    const studentId = Number(req.params.id);
    const active = passes.latestFor(studentId);
    const base = { billing: stripe.enabled, active: publicPass(active), passes: passesFor(levelOf(studentId)).map(({ days, amount, currency, label }) => ({ days, amount, currency, label })) };
    const offer = passOfferFor(studentId, req);
    if (offer?.parent_info) return res.json({ ...base, passes: [], offer });
    res.json({ ...base, offer });
  });

  app.post("/api/billing/pass", json, async (req, res) => {
    if (needStripe(res)) return;
    const p = req.parent;
    if (birthMissing(p)) return res.status(403).json(BIRTH_MISSING_PAY);
    if (isMinor(p)) return res.status(403).json({ error: "Paket plača starš. Pošlji mu povezavo za plačilo.", pay_link: true });
    const c = checkPass(req, p, req.body);
    if (c.status) return res.status(c.status).json(c.body);
    if (!consented(req.body)) return res.status(400).json(consentError);
    try {
      const customer = await ensureCustomer(p);
      const passId = passes.create({ parentId: p.id, studentId: c.studentId, plan: c.plan, testDate: c.test.date, testName: c.test.name });
      const base = baseUrl(req);
      const meta = { kind: "pass", pass_id: passId, parent_id: p.id };
      const session = await stripe.request("POST", "/checkout/sessions", {
        mode: "payment",
        customer,
        client_reference_id: String(p.id),
        line_items: [passLineItem(c.plan)],
        success_url: `${base}/?billing=pass&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/?billing=cancel`,
        locale: "sl",
        metadata: meta,
        payment_intent_data: { metadata: meta },
      });
      passes.setCheckout(passId, session.id);
      recordConsent(p.id, p.email, "pass", req.body?.lang);
      res.json({ url: session.url });
    } catch (err) {
      log.error?.("[evklid] Stripe paket:", err.message);
      res.status(502).json({ error: "Plačilne strani ni bilo mogoče odpreti. Poskusi znova." });
    }
  });

  // Vrnitev s plačilne strani (deluje tudi brez webhooka, npr. na domačem računalniku).
  app.post("/api/billing/pass/confirm", json, async (req, res) => {
    if (needStripe(res)) return;
    const id = String(req.body?.session_id || "");
    if (!/^cs_[\w]+$/.test(id)) return res.status(400).json({ error: "Plačila ni mogoče najti." });
    try {
      const session = await stripe.request("GET", `/checkout/sessions/${id}`);
      if (String(session.metadata?.parent_id) !== String(req.parent.id)) return res.status(404).json({ error: "Plačilo ne obstaja." });
      completePassSession(session);
      const pass = passes.get(session.metadata?.pass_id);
      res.json({ pass: publicPass(pass), paid: pass?.status === "active" });
    } catch (err) {
      log.error?.("[evklid] Stripe paket (potrditev):", err.message);
      res.status(502).json({ error: "Plačila ni bilo mogoče preveriti. Osveži stran čez minuto." });
    }
  });

  // --- dokup porabe AI (server/placila/krediti.js) ---
  // Ko učenec porabi svoj del mesečnega proračuna, imetnik računa dokupi kredit: polovica plačila
  // postane kredit v $, vezan na račun (velja za vse njegove profile).
  // Navzven samo cena in število pogovorov, ne delež plačila ali znesek kredita (j 2026-10-30).
  // Polnoleten po datumu rojstva: račun brez datuma rojstva (star račun) dokupa ne plača, dokler ga ne vpiše.
  const adultKnown = (p) => !!p?.birth_date && !isMinor(p);
  const publicPack = (p) => ({ id: p.id, amount: p.amount, currency: p.currency, conversations: conversationsFor(creditUsdFor(p.amount)) });
  app.get("/api/billing/credit", (req, res) => {
    const p = req.parent;
    if (!credits || !p || p.is_guest) return res.json({ billing: false, balance_conversations: 0, packs: [] });
    res.json({
      billing: stripe.enabled,
      balance_conversations: conversationsFor(credits.balance(p.id)),
      // Ena ponudba naenkrat: ko ima kateri profil računa ponudbo paketa pred testom, dokupa ne ponudimo.
      packs: currencyOf(req, p) === "EUR" && !childIds(p.id).some((id) => passOfferFor(id, req)) ? CREDIT_PACKS.map(publicPack) : [],
      // Dokup plača samo polnoleten imetnik z znano starostjo (adultKnown).
      minor: !adultKnown(p),
      birth_missing: birthMissing(p),
    });
  });

  app.post("/api/billing/credit", json, async (req, res) => {
    if (needStripe(res)) return;
    const p = req.parent;
    if (!credits || !p || p.is_guest) return res.status(403).json({ error: "Najprej ustvari račun v zavihku Račun.", guest: true });
    if (birthMissing(p)) return res.status(403).json(BIRTH_MISSING_PAY);
    if (!adultKnown(p)) return res.status(403).json({ error: "Dokup pogovorov plača polnoleten imetnik računa (starš ali skrbnik)." });
    // Samo paketi 5 / 10 / 20 € (poljubnega zneska ni več, j 2026-11-04).
    const pack = packById(req.body?.pack);
    if (!pack) return res.status(400).json({ error: "Neznan paket." });
    if (currencyOf(req, p) !== "EUR") return res.status(400).json({ error: "Dokup pogovorov je zaenkrat na voljo samo v evrih." });
    if (!consented(req.body)) return res.status(400).json(consentError);
    try {
      const customer = await ensureCustomer(p);
      const creditId = credits.create(p.id, pack);
      const base = baseUrl(req);
      const meta = { kind: "credit", credit_id: creditId, parent_id: p.id };
      const session = await stripe.request("POST", "/checkout/sessions", {
        mode: "payment",
        customer,
        client_reference_id: String(p.id),
        line_items: [
          {
            price_data: {
              currency: pack.currency.toLowerCase(),
              unit_amount: pack.amount,
              tax_behavior: "inclusive",
              product_data: { name: `Evklid – dodatna poraba AI inštruktorja (${(pack.amount / 100).toFixed(2).replace(".", ",")} €)` },
            },
            quantity: 1,
          },
        ],
        success_url: `${base}/?billing=credit&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/?billing=cancel`,
        locale: "sl",
        metadata: meta,
        payment_intent_data: { metadata: meta },
      });
      credits.setCheckout(creditId, session.id);
      recordConsent(p.id, p.email, "credit", req.body?.lang);
      res.json({ url: session.url });
    } catch (err) {
      log.error?.("[evklid] Stripe dokup porabe:", err.message);
      res.status(502).json({ error: "Plačilne strani ni bilo mogoče odpreti. Poskusi znova." });
    }
  });

  // Plačilo dokupa je uspelo: kredit se pripiše (enkrat).
  function completeCreditSession(session) {
    if (!credits || session?.metadata?.kind !== "credit" || session.payment_status !== "paid") return false;
    const c = credits.get(session.metadata.credit_id);
    if (!c || String(c.parent_id) !== String(session.metadata.parent_id)) return false;
    return credits.activate(c.id, typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id);
  }

  app.post("/api/billing/credit/confirm", json, async (req, res) => {
    if (needStripe(res)) return;
    const id = String(req.body?.session_id || "");
    if (!/^cs_[\w]+$/.test(id)) return res.status(400).json({ error: "Plačila ni mogoče najti." });
    try {
      const session = await stripe.request("GET", `/checkout/sessions/${id}`);
      if (String(session.metadata?.parent_id) !== String(req.parent.id)) return res.status(404).json({ error: "Plačilo ne obstaja." });
      completeCreditSession(session);
      const c = credits.get(session.metadata?.credit_id);
      res.json({ paid: c?.status === "active", balance_conversations: conversationsFor(credits.balance(req.parent.id)) });
    } catch (err) {
      log.error?.("[evklid] Stripe dokup porabe (potrditev):", err.message);
      res.status(502).json({ error: "Plačila ni bilo mogoče preveriti. Osveži stran čez minuto." });
    }
  });

  // --- povezava »Prosi starše za plačilo« ---
  const linkByToken = (token) => {
    if (!/^[\w-]{20,80}$/.test(String(token || ""))) return null;
    const l = db.prepare("SELECT * FROM pay_links WHERE token_hash = ?").get(sha256(token));
    return l && Date.parse(l.expires_at) > Date.now() ? l : null;
  };

  app.post("/api/billing/pay-link", json, (req, res) => {
    if (needStripe(res)) return;
    const p = req.parent;
    if (p.is_guest) return res.status(403).json({ error: "Najprej ustvari račun." });
    if (birthMissing(p)) return res.status(403).json(BIRTH_MISSING_PAY);
    if (linkThrottle.blocked(`link${p.id}`)) return res.status(429).json({ error: "Preveč povezav v kratkem času. Poskusi čez eno uro." });
    const open = db.prepare("SELECT COUNT(*) AS n FROM pay_links WHERE parent_id = ? AND done_at IS NULL AND expires_at > ?").get(p.id, iso(Date.now())).n;
    if (open >= 5) return res.status(429).json({ error: "Odprtih je že 5 povezav za plačilo. Počakaj, da starš plača ali da povezave potečejo." });
    const kind = req.body?.kind === "pass" ? "pass" : "sub";
    let row;
    if (kind === "sub") {
      if (paidActive(p)) return res.status(409).json({ error: "Naročnino že imaš." });
      const school = req.body?.school === true;
      const plan = school ? schoolPlanFor(req.body?.interval) : subPlan(p, Number(req.body?.seats), req.body?.interval, currencyOf(req, p));
      if (!plan) return res.status(400).json({ error: "Neznan paket." });
      if (school && !hasSchoolChild(p.id)) return res.status(403).json({ error: "Ta cena velja samo za učence s šolsko licenco." });
      row = { plan_key: plan.key, student_id: null, days: null, test_date: null, test_name: "" };
    } else {
      const c = checkPass(req, p, req.body);
      if (c.status) return res.status(c.status).json(c.body);
      row = { plan_key: c.plan.key, student_id: c.studentId, days: c.plan.days, test_date: c.test.date, test_name: c.test.name };
    }
    linkThrottle.fail(`link${p.id}`);
    const token = randomToken(24);
    const expires = iso(Date.now() + PAY_LINK_DAYS * 86400000);
    db.prepare("INSERT INTO pay_links (token_hash, parent_id, kind, plan_key, student_id, days, test_date, test_name, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
      sha256(token),
      p.id,
      kind,
      row.plan_key,
      row.student_id,
      row.days,
      row.test_date,
      row.test_name,
      expires,
    );
    res.status(201).json({ url: `${baseUrl(req)}/placaj.html?t=${token}`, expires_at: expires });
  });

  // Paket naročnine na povezavi za plačilo. Povezava izpred cen po stopnjah s starim paketom »2 otroka« (ni več
  // cene v Stripu): današnji paket računa, enak na strani za starše in v plačilu.
  const linkSubPlan = (l, parent) => {
    const linked = planByKey(l.plan_key);
    return linked?.legacy && parent ? subPlan(parent, linked.seats, linked.interval, "EUR") : linked;
  };

  // Stran za starše (placaj.html) brez prijave: kaj plačujejo, za koga in koliko.
  function linkView(l) {
    const parent = getParent(l.parent_id);
    // Za naročnino: ime prvega profila na računu (najstnikov lasten profil).
    const sid = l.student_id ?? childIds(l.parent_id)[0];
    const student = sid ? store.getStudent(sid) : null;
    const plan = l.kind === "sub" ? linkSubPlan(l, parent) : passByKey(l.plan_key) || passByDays(l.days);
    const pass = l.pass_id ? passes.get(l.pass_id) : null;
    const paid = !!l.done_at || (l.kind === "sub" ? paidActive(parent) : pass?.status === "active");
    return {
      kind: l.kind,
      // Samo ime (vzdevek) iz aplikacije, nikoli e-naslov.
      name: student?.name || parent?.name || "",
      plan: plan && { label: plan.label, amount: plan.amount, currency: plan.currency || "EUR", interval: plan.interval || null, seats: plan.seats || 1, days: plan.days || null },
      test: l.kind === "pass" ? { name: l.test_name, date: l.test_date } : null,
      expires_at: l.expires_at,
      paid,
      grace_days: GRACE_DAYS,
      adult_text: ADULT_TEXT,
      withdrawal_text: WITHDRAWAL_TEXT,
    };
  }

  const publicLink = (req, res) => {
    const key = `pay${req.ip}`;
    if (publicThrottle.blocked(key)) {
      res.status(429).json({ error: "Preveč poskusov. Poskusite čez 15 minut." });
      return null;
    }
    const l = linkByToken(req.params.token);
    if (!l) {
      publicThrottle.fail(key);
      res.status(404).json({ error: "Povezava za plačilo ne obstaja ali je potekla. Prosite za novo.", expired: true });
      return null;
    }
    return l;
  };

  app.get("/api/pay/:token", (req, res) => {
    const l = publicLink(req, res);
    if (!l) return;
    const v = linkView(l);
    // Neplačana povezava za paket, ki ga ni več (30 dni, j 2026-11-04): ne velja več, starš prosi za novo.
    if (!v.plan && !v.paid) return res.status(404).json({ error: "Povezava za plačilo ne velja več. Prosite za novo.", expired: true });
    res.json(v);
  });

  app.post("/api/pay/:token/checkout", json, async (req, res) => {
    if (needStripe(res)) return;
    const l = publicLink(req, res);
    if (!l) return;
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 200) return res.status(400).json({ error: "Vpišite veljaven e-naslov za račun." });
    if (!consented(req.body)) return res.status(400).json(consentError);
    const parent = getParent(l.parent_id);
    if (!parent) return res.status(404).json({ error: "Povezava za plačilo ne obstaja ali je potekla. Prosite za novo.", expired: true });
    // Imetnik povezave brez datuma rojstva: zaprto vsako plačilo (j 2026-11-06), tudi prek že izdane povezave.
    if (birthMissing(parent)) return res.status(403).json(BIRTH_MISSING_PAY);
    if (linkView(l).paid) return res.status(409).json({ error: "To je že plačano. Hvala!", paid: true });
    const base = baseUrl(req);
    const back = `${base}/placaj.html?t=${encodeURIComponent(req.params.token)}`;
    try {
      let session;
      if (l.kind === "sub") {
        if (paidActive(parent)) return res.status(409).json({ error: "To je že plačano. Hvala!", paid: true });
        const plan = linkSubPlan(l, parent);
        if (!plan) return res.status(410).json({ error: "Povezava za plačilo ne velja več. Prosite za novo.", expired: true });
        // Povezava je lahko stara: šolska cena le, če ima otrok šolsko licenco še ob plačilu.
        if (plan.school && !hasSchoolChild(parent.id)) return res.status(403).json({ error: "Ta cena velja samo za učence s šolsko licenco. Prosite za novo povezavo." });
        const { prices } = plan.school ? await stripe.ensureSchoolPrices() : await stripe.ensurePrices(plan.currency || "EUR");
        const trialEnd = Math.max(Date.parse(parent.trial_ends_at || 0) || 0, Date.parse(parent.promo_until || 0) || 0);
        const subscription_data = { metadata: { parent_id: parent.id } };
        if (trialEnd - Date.now() > 49 * 3600000) subscription_data.trial_end = Math.floor(trialEnd / 1000);
        session = await stripe.request("POST", "/checkout/sessions", {
          mode: "subscription",
          customer_email: email,
          client_reference_id: String(parent.id),
          line_items: [{ price: prices[plan.key], quantity: 1 }],
          success_url: `${back}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: back,
          locale: (plan.currency || "EUR") === "EUR" ? "sl" : "auto",
          allow_promotion_codes: "true",
          subscription_data,
          metadata: { parent_id: parent.id, pay_link: l.token_hash },
        });
      } else {
        const plan = passByKey(l.plan_key) || passByDays(l.days);
        if (!plan) return res.status(410).json({ error: "Povezava za plačilo ne velja več. Prosite za novo.", expired: true });
        if (paidActive(parent)) return res.status(409).json({ error: "Ta račun že ima naročnino, zato paket pred testom ni potreben.", subscription: true });
        if (passes.latestFor(l.student_id)) return res.status(409).json({ error: "To je že plačano. Hvala!", paid: true });
        // Ponoven klik na isti povezavi uporabi isti (še neplačan) paket, zato dve plačilni strani ne dasta dveh paketov.
        const prev = l.pass_id ? passes.get(l.pass_id) : null;
        const passId = prev?.status === "pending" ? prev.id : passes.create({ parentId: parent.id, studentId: l.student_id, plan, testDate: l.test_date, testName: l.test_name });
        db.prepare("UPDATE pay_links SET pass_id = ? WHERE token_hash = ?").run(passId, l.token_hash);
        const meta = { kind: "pass", pass_id: passId, parent_id: parent.id, pay_link: l.token_hash };
        session = await stripe.request("POST", "/checkout/sessions", {
          mode: "payment",
          customer_email: email,
          client_reference_id: String(parent.id),
          line_items: [passLineItem(plan)],
          success_url: `${back}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: back,
          locale: "sl",
          metadata: meta,
          payment_intent_data: { metadata: meta },
        });
        passes.setCheckout(passId, session.id);
      }
      recordConsent(parent.id, email, `pay_link_${l.kind}`, req.body?.lang);
      res.json({ url: session.url });
    } catch (err) {
      log.error?.("[evklid] Stripe povezava za starše:", err.message);
      res.status(502).json({ error: "Plačilne strani ni bilo mogoče odpreti. Poskusite znova." });
    }
  });

  app.post("/api/pay/:token/confirm", json, async (req, res) => {
    if (needStripe(res)) return;
    const l = publicLink(req, res);
    if (!l) return;
    const id = String(req.body?.session_id || "");
    if (!/^cs_[\w]+$/.test(id)) return res.status(400).json({ error: "Plačila ni mogoče najti." });
    try {
      const session = await stripe.request("GET", `/checkout/sessions/${id}`);
      if (session.metadata?.pay_link !== l.token_hash) return res.status(404).json({ error: "Plačilo ne obstaja." });
      if (l.kind === "pass") completePassSession(session);
      else if (session.status === "complete") await completeSubSession(session);
      res.json(linkView(db.prepare("SELECT * FROM pay_links WHERE token_hash = ?").get(l.token_hash)));
    } catch (err) {
      log.error?.("[evklid] Stripe povezava za starše (potrditev):", err.message);
      res.status(502).json({ error: "Plačila ni bilo mogoče preveriti. Osvežite stran čez minuto." });
    }
  });

  // --- skrbnik: aktivacijske kode ---
  const admin = (req, res) => {
    if (req.parent?.is_admin) return true;
    res.status(403).json({ error: "Samo za skrbnika." });
    return false;
  };
  // Izračun vračila ob odstopu v 14 dneh (samo prikaz za skrbnika; vračilo izvede skrbnik v Stripu).
  // Naročnina: tekoče plačano obdobje, meja AI = vrednost paketa × mesecev obdobja, poraba vseh profilov računa.
  // Paketi pred testom: ves paket, meja paketa, poraba profila.
  app.get("/api/admin/withdrawal/:parentId", (req, res) => {
    if (!admin(req, res)) return;
    const p = getParent(Number(req.params.parentId));
    if (!p) return res.status(404).json({ error: "Račun ne obstaja." });
    const now = Date.now();
    const sqlTime = (ms) => new Date(ms).toISOString().slice(0, 19).replace("T", " ");
    const out = { subscription: null, passes: [] };
    const plan = p.sub_plan ? planByKey(p.sub_plan) : null;
    const end = Date.parse(p.sub_period_end || "");
    if (plan && Number.isFinite(end)) {
      const months = plan.interval === "year" ? 12 : 1;
      const startD = new Date(end);
      startD.setUTCMonth(startD.getUTCMonth() - months);
      const start = startD.getTime();
      const g = planGuarantee(plan, p.country ? vatRateFor(p.country) : undefined);
      const since = sqlTime(start);
      const spent = [...childIds(p.id)].reduce((t, id) => t + (aiUsage?.spentSince?.(id, since) || 0), 0) + (aiUsage?.orphanSpent?.(p.id, since) || 0);
      // Dejansko plačilo obdobja (promocijska koda, proracija, že vrnjeni del; pregled #462 A2), sicer cenik.
      const real = p.sub_id && paidPeriods ? paidPeriods.centsIn(p.id, p.sub_id, start, end) : null;
      const paidCents = real?.currency ? real.cents : plan.amount;
      // Meja AI obdobja tudi iz dejanskega plačila: 25 % plačila brez DDV, največ vrednost paketa.
      const capFromPaid = real?.currency ? aiCapFromNetEur(paidPeriods.eurIn(p.id, p.sub_id, start, end).eur) : Infinity;
      const r = withdrawalRefundCents({ paidCents, startMs: start, endMs: end, nowMs: now, aiCapUsd: Math.min((g?.total || 0) * months, capFromPaid), aiSpentUsd: spent });
      out.subscription = { plan: plan.key, paid_cents: paidCents, currency: real?.currency || plan.currency || "EUR", refund_cents: r.cents, time_left: r.timeLeft, ai_left: r.aiLeft, within_14_days: now - start <= WITHDRAWAL_DAYS * 86400000 };
    }
    for (const ps of db.prepare("SELECT * FROM passes WHERE parent_id = ? AND status = 'active'").all(p.id)) {
      const start = Date.parse(ps.starts_at);
      const r = withdrawalRefundCents({ paidCents: ps.amount, startMs: start, endMs: Date.parse(ps.ends_at), nowMs: now, aiCapUsd: passCapUsd(ps), aiSpentUsd: passes.spentUsd(ps) });
      out.passes.push({ id: ps.id, paid_cents: ps.amount, refund_cents: r.cents, time_left: r.timeLeft, ai_left: r.aiLeft, within_14_days: now - start <= WITHDRAWAL_DAYS * 86400000 });
    }
    // Dokup: vrne se največ neporabljeni del (pregled #462 S1: credits.refund odvzame ves paket, porabljen AI ostane
    // plačan). Delež neporabljenega je za ves račun (preostanek / vsi aktivni paketi), previdno za vsak paket.
    out.credits = [];
    if (credits) {
      const active = credits.list(p.id).filter((c) => c.status === "active");
      const total = active.reduce((t, c) => t + c.credit_usd, 0);
      const left = total > 0 ? Math.min(1, credits.balance(p.id) / total) : 0;
      for (const c of active) out.credits.push({ id: c.id, paid_cents: c.amount, credit_usd: c.credit_usd, refund_cents: Math.floor(c.amount * left), ai_left: left });
    }
    audit(db, { req, parentId: req.parent?.id, actor: "admin", action: "withdrawal_view", target: `parent:${p.id}` });
    res.json(out);
  });
  app.get("/api/admin/promo-codes", (req, res) => {
    if (admin(req, res)) res.json({ codes: promo.list() });
  });
  app.post("/api/admin/promo-codes", json, (req, res) => {
    if (!admin(req, res)) return;
    const r = promo.create(req.body);
    if (r.error) return res.status(r.exists ? 409 : 400).json({ error: r.error });
    audit(db, { req, parentId: req.parent?.id, actor: "admin", action: "promo_create" });
    res.status(201).json({ codes: promo.list() });
  });
  app.post("/api/admin/promo-codes/:code/active", json, (req, res) => {
    if (!admin(req, res)) return;
    const r = promo.setActive(req.params.code, req.body?.active === true);
    if (r.error) return res.status(404).json({ error: r.error });
    audit(db, { req, parentId: req.parent?.id, actor: "admin", action: req.body?.active === true ? "promo_on" : "promo_off" });
    res.json({ codes: promo.list() });
  });

  // --- dnevna opravila (enkrat na dan po 3.00 v Ljubljani) ---
  const fmtDate = (isoText) => new Date(isoText).toLocaleDateString("sl-SI", { timeZone: "Europe/Ljubljana" });
  const fmtMoney = (minor, currency) => new Intl.NumberFormat("sl-SI", { style: "currency", currency }).format(minor / 10 ** currencyDecimals(currency));
  async function remind(p, kind, period, msg) {
    const claim = db.prepare("INSERT OR IGNORE INTO email_log (parent_id, kind, period) VALUES (?, ?, ?)").run(p.id, kind, period);
    if (!claim.changes) return 0;
    const ok = await sendMail(p.email, msg);
    if (!ok) db.prepare("UPDATE email_log SET ok = 0 WHERE parent_id = ? AND kind = ? AND period = ?").run(p.id, kind, period);
    return ok ? 1 : 0;
  }

  async function billingDaily(now = new Date(), { force = false } = {}) {
    const { date, hour } = ljNow(now);
    if (!force && (hour < 3 || kv.get("billing_daily") === date)) return null;
    kv.set("billing_daily", date);
    const out = { synced: 0, sync_errors: 0, expired: passes.expirePending(), promo_end: 0, renewal: 0 };
    // Usklajevanje s Stripom: če je kak webhook izgubljen (strežnik ugasnjen), ga ujame to.
    if (stripe.enabled) {
      for (const p of db.prepare("SELECT * FROM parents WHERE stripe_customer_id IS NOT NULL AND sub_id IS NOT NULL").all()) {
        try {
          await syncCustomer(p);
          out.synced++;
        } catch (err) {
          out.sync_errors++;
          log.error?.("[evklid] usklajevanje naročnine:", p.id, err.message);
        }
      }
    }
    const appUrl = baseUrl(null) + "/";
    const nowIso = iso(now.getTime());
    const in7 = iso(now.getTime() + 7 * 86400000);
    for (const p of db.prepare("SELECT * FROM parents WHERE email_verified_at IS NOT NULL AND is_guest = 0 AND promo_until > ? AND promo_until <= ?").all(nowIso, in7)) {
      if (paidActive(p, now.getTime())) continue;
      out.promo_end += await remind(p, "promo_end", p.promo_until.slice(0, 10), promoEndingEmail(fmtDate(p.promo_until), appUrl));
    }
    // Pred opomnikom o obnovitvi: ta isti dan ne sme reči »se bo obnovila«, če jo tu ustavimo.
    await schoolSubEnd(now, out, appUrl);
    await levelChanges(now, out, appUrl);
    const in30 = iso(now.getTime() + 30 * 86400000);
    for (const p of db.prepare("SELECT * FROM parents WHERE sub_period_end > ? AND sub_period_end <= ? AND sub_cancel_at_period_end = 0").all(nowIso, in30)) {
      const plan = planByKey(p.sub_plan);
      if (plan?.interval !== "year" || !paidActive(p, now.getTime())) continue;
      // Čakajoča nova cena (prehod stopnje) ob tem podaljšanju: opomnik navede znesek, ki bo res zaračunan.
      const pend = changeOf(p.id);
      const next = pend && !pend.applied_at && pend.sub_id === p.sub_id && Math.abs(Date.parse(pend.effective_at) - Date.parse(p.sub_period_end)) <= 86400000 ? planByKey(pend.to_key) : null;
      const bill = next || plan;
      out.renewal += await remind(p, "renewal", p.sub_period_end.slice(0, 10), renewalEmail(fmtDate(p.sub_period_end), fmtMoney(bill.amount, bill.currency || "EUR"), appUrl));
    }
    return out;
  }

  // Prehod stopnje (j 2026-11-01, načrt »Prehod med stopnjami in cena«): cena sledi stopnji profila, a se spremeni
  // šele ob podaljšanju, ki je vsaj 30 dni po e-pošti z novo ceno. Do takrat ostane stara cena; profil za en sedež ima
  // novo stopnjo odprto že zdaj (pravice.js grace), pri prehodu navzdol ostane do podaljšanja odprta višja.
  // Tik pred podaljšanjem (3 dni prej) se cena v Stripu zamenja brez proracije, da je naslednji račun po novi ceni.
  const APPLY_BEFORE_MS = 3 * 86400000;
  const changeOf = (parentId) => db.prepare("SELECT * FROM plan_changes WHERE parent_id = ?").get(parentId) || null;
  // Stopnje profilov računa: najprej profil s sedežem (najstarejši), kot isPremiumChild.
  const levelsOf = (parentId) => childIds(parentId).sort((a, b) => a - b).map((id) => levelOf(id));
  async function levelChanges(now, out, appUrl) {
    out.plan_notified = 0;
    out.plan_applied = 0;
    for (const p of db.prepare("SELECT * FROM parents WHERE sub_id IS NOT NULL").all()) {
      if ((p.sub_provider || "stripe") !== "stripe" || !paidActive(p, now.getTime())) continue;
      const plan = planByKey(p.sub_plan);
      let row = changeOf(p.id);
      const to = p.sub_cancel_at_period_end ? null : targetPlan(plan, levelsOf(p.id));
      try {
        if (!to) {
          if (row) db.prepare("DELETE FROM plan_changes WHERE parent_id = ?").run(p.id); // spet ista stopnja ali izvedeno
          continue;
        }
        // Zamujena izvedba (strežnik ugasnjen ali napaka Stripa ves čas pred podaljšanjem): izračunaj znova.
        const stale = !!row && !row.applied_at && Date.parse(row.effective_at) < now.getTime() - 86400000;
        if (!row || stale || row.to_key !== to.key || row.sub_id !== p.sub_id || row.from_key !== plan.key) {
          // Dražje: podaljšanje vsaj 30 dni po e-pošti. Ceneje (prehod navzdol): že naslednje podaljšanje, da
          // naročnik nižje stopnje ne plača še enega obdobja po višji ceni.
          const up = to.amount > plan.amount;
          const effective = firstRenewalAfter(p.sub_period_end, plan.interval, now.getTime() + (up ? 30 * 86400000 : 0));
          if (!effective) continue;
          db.prepare(
            "INSERT INTO plan_changes (parent_id, sub_id, from_key, to_key, effective_at, notified_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(parent_id) DO UPDATE SET sub_id = excluded.sub_id, from_key = excluded.from_key, to_key = excluded.to_key, effective_at = excluded.effective_at, notified_at = excluded.notified_at, applied_at = NULL",
          ).run(p.id, p.sub_id, plan.key, to.key, effective, iso(now.getTime()));
          const msg = planChangeEmail({ planText: to.label, amountText: fmtMoney(to.amount, "EUR"), dateText: fmtDate(effective), up }, appUrl);
          const period = `${to.key}:${effective.slice(0, 10)}`;
          const sent = await remind(p, "plan_change", period, msg);
          // Višja cena brez poslane e-pošte ne sme začeti veljati: jutri znova (z novim rokom vsaj 30 dni).
          if (up && !sent && !db.prepare("SELECT 1 FROM email_log WHERE parent_id = ? AND kind = 'plan_change' AND period = ? AND ok = 1").get(p.id, period)) {
            db.prepare("DELETE FROM email_log WHERE parent_id = ? AND kind = 'plan_change' AND period = ?").run(p.id, period);
            db.prepare("DELETE FROM plan_changes WHERE parent_id = ?").run(p.id);
            continue;
          }
          out.plan_notified += sent;
          if (up) continue;
          row = changeOf(p.id); // ceneje: izvede se lahko že zdaj, če je podaljšanje čez največ 3 dni
        }
        // Izvedba: obdobje, ki se konča ob effective_at, teče; podaljšanje je čez največ 3 dni.
        const end = Date.parse(p.sub_period_end);
        if (row.applied_at || !stripe.enabled || Math.abs(end - Date.parse(row.effective_at)) > 86400000 || end - now.getTime() > APPLY_BEFORE_MS) continue;
        const sub = await stripe.request("GET", `/subscriptions/${p.sub_id}`);
        const item = sub.items?.data?.[0];
        const { prices } = await stripe.ensurePrices("EUR");
        if (!item?.id || !prices[to.key]) continue;
        const updated = await stripe.request("POST", `/subscriptions/${p.sub_id}`, { items: [{ id: item.id, price: prices[to.key] }], proration_behavior: "none" });
        await applySubscription(p.id, updated);
        db.prepare("UPDATE plan_changes SET applied_at = ? WHERE parent_id = ?").run(iso(now.getTime()), p.id);
        out.plan_applied++;
      } catch (err) {
        log.error?.("[evklid] prehod stopnje:", p.id, err.message);
      }
    }
  }
  // Čakajoča sprememba paketa za zavihek Račun: { plan, amount, effective_at } ali null.
  function pendingChange(p) {
    const row = changeOf(p.id);
    const to = row && !row.applied_at && row.sub_id === p.sub_id ? planByKey(row.to_key) : null;
    return to ? { plan: to.key, label: to.label, amount: to.amount, currency: "EUR", effective_at: row.effective_at } : null;
  }

  // Poraba podrobnih razlag (j 2026-11-01): pri profilu, mlajšem od 15 let, dobi starš e-pošto pri 80 % in 100 %
  // (enkrat na mesec za vsako mejo, email_log). Starejši in polnoletni vidijo obvestilo v aplikaciji.
  async function allowanceMail(studentId, stage, now = new Date()) {
    if (stage !== "low" && stage !== "out") return 0;
    const age = ageOf(studentId, now);
    if (age !== null && age >= NO_PRICE_AGE) return 0; // neznana starost velja kot pod 15 (ponudbe.js)
    const p = getParent(ownerOf(studentId));
    if (!p || p.is_guest || !p.email_verified_at || isMinor(p)) return 0;
    const month = now.toISOString().slice(0, 7);
    const a = aiUsage?.studentMonth(studentId);
    // Skupen delež družine: ena e-pošta za ves račun (ne za vsak profil posebej).
    const kind = a?.pool ? `ai_${stage}:pool` : `ai_${stage}:${studentId}`;
    if (db.prepare("SELECT 1 FROM email_log WHERE parent_id = ? AND kind = ? AND period = ?").get(p.id, kind, month)) return 0; // že poslano ta mesec
    const st = store.getStudent(studentId);
    const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    const msg = allowanceEmail({ childName: st?.name || "", stage, left: a?.explanations_left ?? 0, untilText: fmtDate(next.toISOString()), pool: !!a?.pool }, baseUrl(null) + "/");
    return remind(p, kind, month, msg);
  }

  // Osebno ob šolski licenci po izteku licence (j 2026-10-30: »naj se naročnina ob poteku šolske licence
  // ne avtomatsko obnovi«). Ko noben otrok nima več šolske licence, naročnina ob koncu plačanega obdobja
  // poteče (cancel_at_period_end v Stripu) in starš dobi obvestilo. Če licenca do takrat spet velja,
  // se podaljšanje vrne (samo, če ga je ustavil Evklid, ne starš).
  async function schoolSubEnd(now, out, appUrl) {
    out.school_ended = 0;
    out.school_resumed = 0;
    if (!stripe.enabled) return;
    for (const p of db.prepare("SELECT * FROM parents WHERE sub_id IS NOT NULL").all()) {
      if ((p.sub_provider || "stripe") !== "stripe" || !isSchoolPlan(p.sub_plan) || !paidActive(p, now.getTime())) continue;
      const key = `school_sub_end:${p.id}`;
      try {
        // Oznaka velja samo za to naročnino (sub_id) in samo, dokler je preklic še v veljavi: stara oznaka
        // po koncu naročnine ne sme vplivati na novo, preklic, ki ga je starš umaknil, pa ni več »naš«.
        const ours = kv.get(key) === p.sub_id && !!p.sub_cancel_at_period_end;
        const covered = hasSchoolChild(p.id);
        if (covered === !ours) continue; // licenca velja in nismo ustavili, ali ne velja in je že ustavljeno
        if (!covered && p.sub_cancel_at_period_end) continue; // starš je že sam preklical
        await stripe.request("POST", `/subscriptions/${p.sub_id}`, { cancel_at_period_end: covered ? "false" : "true" });
        db.prepare("UPDATE parents SET sub_cancel_at_period_end = ? WHERE id = ?").run(covered ? 0 : 1, p.id);
        kv.set(key, covered ? "" : p.sub_id);
        if (covered) {
          out.school_resumed++;
          continue;
        }
        out.school_ended++;
        const regular = subPlan(p, 1, "month", "EUR"); // cena stopnje profila (OŠ, SŠ, faks)
        await remind(p, "school_sub_end", (p.sub_period_end || "").slice(0, 10), schoolSubEndEmail(p.sub_period_end ? fmtDate(p.sub_period_end) : "", fmtMoney(regular.amount, "EUR"), appUrl));
      } catch (err) {
        log.error?.("[evklid] konec naročnine po šolski licenci:", p.id, err.message);
      }
    }
  }

  return { passes, passPremium, passOfferFor, completePassSession, completeCreditSession, completeSubSession, billingDaily, recordConsent, pendingChange, allowanceMail, levelChanges };
}
