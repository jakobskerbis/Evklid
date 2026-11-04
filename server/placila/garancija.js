// Garancija »Boljša ocena ali vrnemo denar« (j 2026-11-04, kartici ob 3.55 in 7.56).
// Starš se prijavi v prvih 14 dneh plačljive naročnine in vpiše predmet ter trenutno oceno otroka.
// Otrok nato 8 tednov vadi vsaj 3 dni na teden (dan vaje = dan, ko je zbral XP; Evklid to izmeri sam).
// Po 8 tednih ima starš 60 dni, da sporoči novo oceno. Če ni boljša, vrnemo vsa plačila naročnine.
// Enkrat na družino (račun in e-naslov). Samo OŠ in SŠ (lestvica 1–5), samo naročnina prek Stripa.
// Do s.p. vse deluje samo v testnem načinu Stripa, kot ostala plačila.
import { createHash } from "node:crypto";
import { audit } from "../dnevnik-dostopov.js";

export const GUARANTEE = { enrollDays: 14, weeks: 8, minDays: 3, claimDays: 60 };
export const GUARANTEE_SUBJECTS = ["MAT", "FIZ", "KEM", "BIO", "NAR"];
const DAY = 86400000;

const emailHash = (email) => createHash("sha256").update(String(email || "").trim().toLowerCase()).digest("hex");
// Čas za SQLite (UTC, »YYYY-MM-DD HH:MM:SS«), da se ujema z xp_events.created_at.
const sqlTime = (ms) => new Date(ms).toISOString().slice(0, 19).replace("T", " ");

export function migrateGuarantee(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS guarantees (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER UNIQUE REFERENCES parents(id) ON DELETE SET NULL,
      email_hash TEXT NOT NULL UNIQUE,        -- enkrat na družino tudi po izbrisu in ponovni registraciji
      student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
      subject TEXT NOT NULL,
      grade_before INTEGER NOT NULL,
      grade_after INTEGER,
      started_at TEXT NOT NULL,
      first_paid_at TEXT,
      status TEXT NOT NULL DEFAULT 'active',  -- active | improved | claimed | refunded | rejected
      claimed_at TEXT,
      decided_at TEXT,
      note TEXT,
      refunded_cents INTEGER NOT NULL DEFAULT 0,
      refunded_payments TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

// Hramba zapisa (j 2026-11-04, kartica »10 let po odločitvi«): zapis se izbriše 10 let po odločitvi (vračilo, zavrnitev,
// boljša ocena); zapis brez odločitve (starš ni sporočil ocene) 10 let po začetku. Zahtevek, o katerem še ni odločeno,
// ostane. Poganja ga dnevno opravilo v server/accounts/index.js.
export const RETENTION_YEARS = 10;
export function purgeOldGuarantees(db, now = Date.now()) {
  const d = new Date(now);
  d.setUTCFullYear(d.getUTCFullYear() - RETENTION_YEARS);
  const cutoff = sqlTime(d.getTime());
  // started_at je ISO (»…T…Z«), claimed_at/decided_at iz datetime('now'): datetime() oboje poenoti, sicer bi se zapis
  // na dan roka primerjal kot niz (»T« > presledek) in izbrisal dan pozneje.
  return db
    .prepare("DELETE FROM guarantees WHERE status != 'claimed' AND datetime(COALESCE(decided_at, claimed_at, started_at)) < ?")
    .run(cutoff).changes;
}

// Dnevi in tedni vaje štejejo po času v Ljubljani (vaja ob 0.30 v ponedeljek je ponedeljek, ne nedelja v UTC).
const LJ_DATE = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Ljubljana", year: "numeric", month: "2-digit", day: "2-digit" });
const LJ_HOUR = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Ljubljana", hour: "2-digit", hourCycle: "h23" });
// Datum v Ljubljani (»YYYY-MM-DD«) za trenutek ms.
export const ljDate = (ms) => LJ_DATE.format(new Date(ms));
// Polnoč v Ljubljani (ms) na dan trenutka ms, premaknjeno za addDays koledarskih dni (upošteva poletni čas:
// ob polnoči je zamik do UTC enak kot ob 0.00 UTC istega dne, preklop je šele ob 1.00 UTC).
export function ljMidnight(ms, addDays = 0) {
  const [y, m, d] = ljDate(ms).split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d + addDays);
  return utc - Number(LJ_HOUR.format(new Date(utc))) * 3600000;
}

// Teden k (0–7) od začetka: koliko različnih dni je otrok vadil. Pure, za teste. Tedni so celi dnevi v
// Ljubljani od dneva prijave (start), da en dan vaje ne šteje v dva tedna.
export function weeksFor(start, practiceDays, now = Date.now()) {
  const out = [];
  for (let k = 0; k < GUARANTEE.weeks; k++) {
    const from = ljMidnight(start, k * 7);
    const to = ljMidnight(start, (k + 1) * 7);
    const days = practiceDays(from, to);
    const state = now >= to ? (days >= GUARANTEE.minDays ? "ok" : "miss") : now >= from ? (days >= GUARANTEE.minDays ? "ok" : "now") : "future";
    out.push({ week: k + 1, days, state });
  }
  return out;
}

// ctx: { db, stripe, json, log, getParent, childIds, levelOf, paidActive, isMinor, cancelSubscription, addonOf }
// addonOf(invoice) → { amount, held }: dodatek »Podari Evklid« na računu (ni plačilo naročnine, server/placila/podari.js).
export function mountGuarantee(app, ctx) {
  const { db, stripe, json, log, getParent, childIds, levelOf, paidActive, isMinor, cancelSubscription } = ctx;
  const addonOf = ctx.addonOf || (() => ({ amount: 0, held: 0 }));
  const refunding = new Set(); // vračilo, ki že teče (dvojni klik ali dva skrbnika hkrati)
  migrateGuarantee(db);

  // Različni dnevi vaje (datum v Ljubljani) med from in to; created_at je UTC.
  const practiceDays = (studentId) => (from, to) =>
    new Set(
      db
        .prepare("SELECT created_at FROM xp_events WHERE student_id = ? AND created_at >= ? AND created_at < ?")
        .all(studentId, sqlTime(from), sqlTime(to))
        .map((r) => ljDate(Date.parse(`${String(r.created_at).replace(" ", "T")}Z`))),
    ).size;

  const rowFor = (p) => db.prepare("SELECT * FROM guarantees WHERE parent_id = ? OR email_hash = ?").get(p.id, emailHash(p.email)) || null;

  function stateOf(g, now = Date.now()) {
    // Tedni so celi dnevi v Ljubljani od dneva prijave, da en dan vaje ne šteje v dva tedna.
    const start = ljMidnight(Date.parse(g.started_at));
    const weeks = g.student_id ? weeksFor(start, practiceDays(g.student_id), now) : [];
    const practiceOk = weeks.length === GUARANTEE.weeks && weeks.every((w) => w.state === "ok");
    const missed = weeks.find((w) => w.state === "miss")?.week || (g.student_id ? null : 1);
    const opens = ljMidnight(start, GUARANTEE.weeks * 7);
    const until = ljMidnight(start, GUARANTEE.weeks * 7 + GUARANTEE.claimDays);
    let phase = g.status;
    if (g.status === "active") phase = missed ? "lapsed" : now < opens ? "practice" : now <= until ? "claim" : "expired";
    return { weeks, practiceOk, missed, opens, until, phase };
  }

  // Kaj vidi starš v Računu. Brez prijave: ali se lahko prijavi (Stripe se vpraša šele ob prijavi).
  function viewFor(p) {
    if (!p || p.is_guest || isMinor(p)) return null;
    const g = rowFor(p);
    if (!g) {
      const stripeSub = paidActive(p) && (p.sub_provider || "stripe") === "stripe" && !!p.stripe_customer_id && String(p.sub_id || "").startsWith("sub_");
      const kids = childIds(p.id).filter((id) => levelOf(id) !== "FAKS");
      return { terms: GUARANTEE, subjects: GUARANTEE_SUBJECTS, can_enroll: stripeSub && kids.length > 0, students: kids };
    }
    if (g.parent_id !== p.id) return { terms: GUARANTEE, used: true }; // že porabljena na drugem računu iste družine
    const s = stateOf(g);
    return {
      terms: GUARANTEE,
      id: g.id,
      student_id: g.student_id,
      subject: g.subject,
      grade_before: g.grade_before,
      grade_after: g.grade_after,
      status: g.status,
      phase: s.phase,
      weeks: s.weeks,
      missed: s.missed,
      started_at: g.started_at,
      claim_opens: new Date(s.opens).toISOString(),
      claim_until: new Date(s.until).toISOString(),
      refunded_cents: g.refunded_cents,
      note: g.status === "rejected" ? g.note : null,
    };
  }

  // Plačani računi (invoices) naročnine pri Stripu, od najstarejšega naprej.
  async function paidInvoices(customer) {
    const out = [];
    let after = null;
    for (let i = 0; i < 10; i++) {
      const page = await stripe.request("GET", "/invoices", { customer, status: "paid", limit: 100, expand: ["data.charge"], ...(after ? { starting_after: after } : {}) });
      out.push(...(page.data || []));
      if (!page.has_more || !page.data?.length) break;
      after = page.data.at(-1).id;
    }
    // Račun samo z dodatkom »Podari« (npr. ob začetku preizkusa) ni plačilo naročnine.
    return out.filter((i) => i.amount_paid - addonOf(i).amount > 0).sort((a, b) => a.created - b.created);
  }

  const grade = (v, min, max) => {
    // Samo število (ne true ali "2"), da napačen odjemalec ne vpiše ocene 1 po pomoti.
    return typeof v === "number" && Number.isInteger(v) && v >= min && v <= max ? v : null;
  };

  app.get("/api/guarantee", (req, res) => res.json({ guarantee: viewFor(req.parent) }));

  app.post("/api/guarantee/enroll", json, async (req, res) => {
    const p = req.parent;
    if (p.is_guest) return res.status(403).json({ error: "Najprej ustvari račun." });
    if (isMinor(p)) return res.status(403).json({ error: "Za garancijo se prijavi starš." });
    if (rowFor(p)) return res.status(409).json({ error: "Garancijo je tvoja družina že uporabila." });
    if (!paidActive(p) || (p.sub_provider || "stripe") !== "stripe" || !p.stripe_customer_id || !String(p.sub_id || "").startsWith("sub_"))
      return res.status(409).json({ error: "Garancija velja za naročnino, plačano na spletu." });
    const sid = Number(req.body?.student_id);
    if (!childIds(p.id).includes(sid)) return res.status(404).json({ error: "Profila ni." });
    if (levelOf(sid) === "FAKS") return res.status(400).json({ error: "Garancija velja za osnovno in srednjo šolo." });
    const subject = String(req.body?.subject || "").toUpperCase();
    if (!GUARANTEE_SUBJECTS.includes(subject)) return res.status(400).json({ error: "Izberi predmet." });
    const before = grade(req.body?.grade, 1, 5);
    if (!before) return res.status(400).json({ error: "Izberi oceno od 1 do 5." });
    if (before === 5) return res.status(400).json({ error: "Pri oceni 5 ni kaj izboljšati, zato garancija ne velja." });
    if (req.body?.terms !== true) return res.status(400).json({ error: "Potrdi pogoje garancije.", consent: true });
    if (!stripe.enabled) return res.status(503).json({ error: "Plačila še niso nastavljena." });
    let invoices;
    try {
      invoices = await paidInvoices(p.stripe_customer_id);
    } catch (err) {
      log.error?.("[evklid] garancija (računi):", err.message);
      return res.status(502).json({ error: "Plačil ni bilo mogoče preveriti. Poskusi znova." });
    }
    if (!invoices.length) return res.status(409).json({ error: "Garancija začne teči s prvim plačilom naročnine." });
    const first = invoices[0].created * 1000;
    if (Date.now() - first > GUARANTEE.enrollDays * DAY)
      return res.status(409).json({ error: `Prijava je mogoča v prvih ${GUARANTEE.enrollDays} dneh plačljive naročnine.` });
    try {
      db.prepare(
        "INSERT INTO guarantees (parent_id, email_hash, student_id, subject, grade_before, started_at, first_paid_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).run(p.id, emailHash(p.email), sid, subject, before, new Date().toISOString(), new Date(first).toISOString());
    } catch (err) {
      if (/UNIQUE/.test(String(err.message))) return res.status(409).json({ error: "Garancijo je tvoja družina že uporabila." });
      throw err;
    }
    audit(db, { req, parentId: p.id, actor: "parent", action: "guarantee_enroll" });
    res.status(201).json({ guarantee: viewFor(p) });
  });

  app.post("/api/guarantee/claim", json, (req, res) => {
    const p = req.parent;
    const g = db.prepare("SELECT * FROM guarantees WHERE parent_id = ?").get(p.id);
    if (!g || g.status !== "active") return res.status(409).json({ error: "Zahtevka ni mogoče oddati." });
    const s = stateOf(g);
    if (s.phase === "practice") return res.status(409).json({ error: "Zahtevek oddaš po 8 tednih vaje." });
    if (s.phase === "lapsed") return res.status(409).json({ error: `Garancija ne velja, ker otrok v ${s.missed}. tednu ni vadil vsaj ${GUARANTEE.minDays} dni.` });
    if (s.phase !== "claim") return res.status(409).json({ error: "Rok za zahtevek je potekel." });
    const after = grade(req.body?.grade, 1, 5);
    if (!after) return res.status(400).json({ error: "Izberi oceno od 1 do 5." });
    if (req.body?.honest !== true) return res.status(400).json({ error: "Potrdi, da je ocena prava.", consent: true });
    const status = after > g.grade_before ? "improved" : "claimed";
    db.prepare("UPDATE guarantees SET grade_after = ?, status = ?, claimed_at = datetime('now') WHERE id = ? AND status = 'active'").run(after, status, g.id);
    audit(db, { req, parentId: p.id, actor: "parent", action: `guarantee_${status}` });
    res.json({ guarantee: viewFor(p) });
  });

  // --- skrbnik: zahtevki in vračilo ---
  const admin = (req, res) => {
    if (req.parent?.is_admin) return true;
    res.status(403).json({ error: "Samo za skrbnika." });
    return false;
  };
  const adminList = () =>
    db
      .prepare(
        `SELECT g.*, p.email AS email, s.name AS student_name FROM guarantees g
         LEFT JOIN parents p ON p.id = g.parent_id LEFT JOIN students s ON s.id = g.student_id
         ORDER BY CASE g.status WHEN 'claimed' THEN 0 WHEN 'active' THEN 1 ELSE 2 END, g.id DESC LIMIT 100`,
      )
      .all()
      .map((g) => {
        const s = stateOf(g);
        return {
          id: g.id,
          email: g.email,
          student: g.student_name,
          subject: g.subject,
          grade_before: g.grade_before,
          grade_after: g.grade_after,
          status: g.status,
          phase: s.phase,
          practice_ok: s.practiceOk,
          weeks: s.weeks.map((w) => w.days),
          claimed_at: g.claimed_at,
          refunded_cents: g.refunded_cents,
          note: g.note,
        };
      });

  app.get("/api/admin/guarantees", (req, res) => {
    if (admin(req, res)) res.json({ guarantees: adminList() });
  });

  // Vračilo vseh plačil naročnine od prvega plačila in takojšen preklic naročnine.
  // Že vrnjena plačila se ob ponovnem poskusu preskočijo (refunded_payments).
  app.post("/api/admin/guarantees/:id/refund", json, async (req, res) => {
    if (!admin(req, res)) return;
    const g = db.prepare("SELECT * FROM guarantees WHERE id = ?").get(Number(req.params.id));
    if (!g) return res.status(404).json({ error: "Zahtevka ni." });
    if (g.status !== "claimed") return res.status(409).json({ error: "Vrniti je mogoče samo oddan zahtevek." });
    if (!stripe.enabled) return res.status(503).json({ error: "Plačila še niso nastavljena." });
    if (!stripe.testMode && process.env.EVKLID_GUARANTEE_LIVE !== "1")
      return res.status(409).json({ error: "Vračila prek garancije delujejo samo v testnem načinu Stripa (do s.p.)." });
    const p = g.parent_id ? getParent(g.parent_id) : null;
    if (!p?.stripe_customer_id) return res.status(409).json({ error: "Račun nima plačil pri Stripu." });
    if (refunding.has(g.id)) return res.status(409).json({ error: "Vračilo že teče." });
    refunding.add(g.id);
    try {
      await refundAll(req, res, g, p);
    } finally {
      refunding.delete(g.id);
    }
  });

  async function refundAll(req, res, g, p) {
    const done = new Set(JSON.parse(g.refunded_payments || "[]"));
    let cents = g.refunded_cents;
    try {
      const subId = String(p.sub_id || "");
      for (const inv of await paidInvoices(p.stripe_customer_id)) {
        const pi = typeof inv.payment_intent === "string" ? inv.payment_intent : inv.payment_intent?.id;
        const invSub = typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id;
        // Samo plačila naročnine (paketi, dokup in darila imajo svoja pravila in svoje vračilo).
        if (!pi || !invSub || done.has(pi)) continue;
        if (g.first_paid_at && inv.created * 1000 < Date.parse(g.first_paid_at) - DAY) continue; // samo od prvega plačila te naročnine
        // Dodatek »Podari« ostane v skladu; že vrnjen del (npr. odstop) se ne vrača znova.
        const held = addonOf(inv).held;
        const before = typeof inv.charge === "object" && inv.charge ? Number(inv.charge.amount_refunded || 0) : 0;
        const amount = inv.amount_paid - before - held;
        if (amount <= 0) {
          done.add(pi);
          continue;
        }
        const r = await stripe.request("POST", "/refunds", {
          payment_intent: pi,
          ...(held || before ? { amount } : {}),
          reason: "requested_by_customer",
          metadata: { kind: "guarantee", guarantee_id: String(g.id) },
        });
        done.add(pi);
        cents += Number(r.amount || inv.amount_paid || 0);
        db.prepare("UPDATE guarantees SET refunded_payments = ?, refunded_cents = ? WHERE id = ?").run(JSON.stringify([...done]), cents, g.id);
      }
      if (paidActive(p) && subId.startsWith("sub_")) await cancelSubscription(p);
    } catch (err) {
      log.error?.("[evklid] garancija (vračilo):", err.message);
      return res.status(502).json({ error: "Vračilo ni uspelo do konca. Poskusi znova (že vrnjena plačila se ne ponovijo).", guarantees: adminList() });
    }
    db.prepare("UPDATE guarantees SET status = 'refunded', decided_at = datetime('now') WHERE id = ?").run(g.id);
    audit(db, { req, parentId: req.parent.id, actor: "admin", action: "guarantee_refund" });
    res.json({ guarantees: adminList() });
  }

  app.post("/api/admin/guarantees/:id/reject", json, (req, res) => {
    if (!admin(req, res)) return;
    const note = String(req.body?.note || "").trim().slice(0, 300);
    if (!note) return res.status(400).json({ error: "Napiši razlog." });
    const r = db.prepare("UPDATE guarantees SET status = 'rejected', note = ?, decided_at = datetime('now') WHERE id = ? AND status = 'claimed'").run(note, Number(req.params.id));
    if (!r.changes) return res.status(409).json({ error: "Zavrniti je mogoče samo oddan zahtevek." });
    audit(db, { req, parentId: req.parent.id, actor: "admin", action: "guarantee_reject" });
    res.json({ guarantees: adminList() });
  });

  return { viewFor };
}
