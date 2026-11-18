// Funkcija za odstop od pogodbe (ZVPot-1A, nov 138.a člen; Direktiva (EU) 2023/2673, člen 11a Direktive 2011/83/EU).
// Pri pogodbi, sklenjeni prek spletnega vmesnika, mora potrošnik lahko odstopiti tudi s funkcijo, ki:
//  - je označena z »kliknite tukaj za odstop od pogodbe« (ali drugo nedvoumno izjavo), stalno na voljo ves rok za
//    odstop, na vidnem mestu in zlahka dostopna (public/odstop.html, povezava v nogi strani in v zavihku Račun);
//  - omogoči, da potrošnik vpiše ali potrdi ime, podatke o pogodbi in e-naslov za potrdilo;
//  - obvestilo odda z gumbom »potrdi odstop od pogodbe«;
//  - potrošniku brez odlašanja na trajnem nosilcu (e-pošta) pošlje potrdilo o prejemu z vsebino ter datumom in uro.
// Odstop je pravočasen, če je obvestilo oddano pred iztekom roka (14 dni, 134. člen ZVPot-1).
//
// Kaj naredi strežnik: zapiše obvestilo (withdrawals), pošlje potrdilo o prejemu in, kadar je obvestilo oddal prijavljen
// imetnik računa za svojo pogodbo v roku, odstop izvede sam: vračilo v Stripu (najprej) in takojšen preklic naročnine.
// Ostalo (obrazec brez prijave, darilne kode, »Podari«, nakupi v trgovini, prepozno) obravnava skrbnik v zavihku Račun.
//
// Vračilo (pogoji 12. točka, osnutek; preveri pravnik): naročnina in paket pred testom vrneta plačilo × delež preostalega
// časa, dokup delež neporabljenih pogovorov, a samo če je plačnik pred plačilom izrecno potrdil takojšen začetek
// (zapis v billing_consents z [odstop: V]). Brez takega zapisa vrnemo celotno plačilo (ZVPot-1: brez izrecne zahteve
// potrošnik za opravljeno storitev ne plača ničesar). EVKLID_ODSTOP_VRACILO=celotno vedno vrne celotno plačilo.
// Samodejno vračilo deluje samo v testnem načinu Stripa, dokler ni EVKLID_ODSTOP_LIVE=1 (j še nima s.p.);
// EVKLID_ODSTOP_SAMODEJNO=0 izklopi samodejno izvedbo (vse gre skrbniku).
import { Throttle } from "../accounts/auth.js";
import { audit } from "../dnevnik-dostopov.js";
import { withdrawalAckEmail } from "../accounts/email.js";
import { moneyText, CONTACT_EMAIL } from "../accounts/potrdilo.js";

export const WITHDRAW_LABEL = "Kliknite tukaj za odstop od pogodbe";
export const CONFIRM_LABEL = "Potrdi odstop od pogodbe";
export const WITHDRAWAL_DAYS = 14;
const DAY = 86400000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const refundMode = () => (process.env.EVKLID_ODSTOP_VRACILO === "celotno" ? "celotno" : "sorazmerno");
export const autoOn = () => process.env.EVKLID_ODSTOP_SAMODEJNO !== "0";
export const liveOn = () => process.env.EVKLID_ODSTOP_LIVE === "1";

// Datum in ura oddaje po slovenskem času, s sekundami: »18. 11. 2026 ob 14.05.33 (CET)«.
export function submittedText(iso) {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat("sl-SI", { timeZone: "Europe/Ljubljana", day: "numeric", month: "numeric", year: "numeric" }).format(d);
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Ljubljana", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZoneName: "short" }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t)?.value || "";
  return `${day.replace(/\s+/g, " ")} ob ${get("hour")}.${get("minute")}.${get("second")} (${get("timeZoneName")})`; // CET ali CEST
}

export function migrateWithdrawals(db) {
  db.exec(`
    -- Obvestila o odstopu od pogodbe (dokaz o pravočasnem odstopu in o potrdilu o prejemu).
    CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER REFERENCES parents(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      contract TEXT NOT NULL,            -- sub | pass:<id> | credit:<id> | other
      contract_text TEXT NOT NULL,       -- podatki o pogodbi, kot jih je potrošnik videl ali vpisal
      details TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL,              -- app (prijavljen imetnik) | public (brez prijave)
      submitted_at TEXT NOT NULL,        -- ISO z milisekundami, UTC
      ack_ok INTEGER,                    -- potrdilo o prejemu poslano (1) / ni uspelo (0)
      status TEXT NOT NULL DEFAULT 'received', -- received | processing | done | failed | closed
      refund_mode TEXT,
      refund_cents INTEGER NOT NULL DEFAULT 0,
      refund_target INTEGER,
      currency TEXT,
      refunded_payments TEXT NOT NULL DEFAULT '[]',
      note TEXT NOT NULL DEFAULT '',
      processed_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_withdrawals_parent ON withdrawals(parent_id);
  `);
}

// Pogodbe računa, od katerih lahko imetnik ta trenutek odstopi s funkcijo (v roku 14 dni). quote = billing.withdrawalQuote.
export function contractsFor(db, p, quote, now = Date.now(), exceptId = 0) {
  if (!p || p.is_guest) return { options: [], store: null };
  const q = quote(p, now);
  const deadline = (from) => new Date(Date.parse(from) + WITHDRAWAL_DAYS * DAY).toISOString();
  const options = [];
  const provider = p.sub_provider || "stripe";
  const s = q.subscription;
  let store = null;
  if (s && provider !== "stripe") store = provider; // App Store / Google Play: odstop pri trgovini
  else if (s && s.within_14_days && LIVE_SUB.has(p.sub_status) && String(p.sub_id || "").startsWith("sub_"))
    options.push({ id: "sub", kind: "sub", plan: s.plan, from: s.contract_from, deadline: deadline(s.contract_from), paid_cents: s.paid_cents, refund_cents: s.refund_cents, currency: s.currency });
  for (const ps of q.passes) {
    if (!ps.within_14_days || !ps.contract_from) continue;
    options.push({ id: `pass:${ps.id}`, kind: "pass", from: ps.contract_from, deadline: deadline(ps.contract_from), paid_cents: ps.paid_cents, refund_cents: ps.refund_cents, currency: ps.currency });
  }
  for (const c of q.credits || []) {
    if (!c.within_14_days || !c.contract_from) continue;
    options.push({ id: `credit:${c.id}`, kind: "credit", from: c.contract_from, deadline: deadline(c.contract_from), paid_cents: c.paid_cents, refund_cents: c.refund_cents, currency: c.currency });
  }
  // Pogodba, od katere je imetnik že odstopil (obvestilo po sklenitvi, v obdelavi ali izvedeno), ni več na seznamu.
  const taken = db.prepare("SELECT contract, submitted_at FROM withdrawals WHERE parent_id = ? AND id != ? AND status IN ('processing', 'done')").all(p.id, exceptId);
  const open = options.filter((o) => !taken.some((w) => w.contract === o.id && Date.parse(w.submitted_at) >= Date.parse(o.from)));
  return { options: open, store };
}
const LIVE_SUB = new Set(["active", "trialing", "past_due"]);

// Opis pogodbe za zapis in potrdilo (slovensko, vikanje; plačnik je odrasel).
const dayText = (iso) => new Intl.DateTimeFormat("sl-SI", { timeZone: "Europe/Ljubljana", day: "numeric", month: "numeric", year: "numeric" }).format(new Date(iso)).replace(/\s+/g, " ");
export function contractText(o) {
  const what = o.kind === "sub" ? "Naročnina Evklid" : o.kind === "pass" ? "Paket pred testom" : "Dokup pogovorov";
  return `${what}, sklenjeno ${dayText(o.from)}, plačano ${moneyText(o.paid_cents, o.currency)}`;
}

// Ali je plačnik pred plačilom izrecno potrdil takojšen začetek (soglasje z različico pravila o odstopu).
function expressConsent(db, p, o) {
  const kinds = o.kind === "sub" ? ["sub", "pay_link_sub"] : o.kind === "pass" ? ["pass", "pay_link_pass"] : ["credit", "pay_link_credit"];
  const row = db
    .prepare(`SELECT text FROM billing_consents WHERE parent_id = ? AND kind IN (${kinds.map(() => "?").join(",")}) AND created_at <= ? ORDER BY created_at DESC, id DESC LIMIT 1`)
    .get(p.id, ...kinds, new Date(Date.parse(o.deadline)).toISOString().slice(0, 19).replace("T", " "));
  return !!row && /\n\[odstop: [^\]]+\]/.test(String(row.text || ""));
}

export function refundFor(db, p, o) {
  const mode = refundMode() === "celotno" || !expressConsent(db, p, o) ? "celotno" : "sorazmerno";
  return { mode, cents: mode === "celotno" ? o.paid_cents : o.refund_cents };
}

export function mountWithdrawal(app, { db, stripe, json, log = {}, getParent, quote, cancelSubscription, passes, credits, sendMail, baseUrl, ownerOk, isMinor }) {
  migrateWithdrawals(db);
  const throttle = new Throttle(5, 60 * 60000); // 5 obvestil na uro z enega naslova IP (potrdilo gre na vpisan e-naslov)
  const running = new Set();
  const viewer = (req) => (req.parent && !req.parent.is_guest && ownerOk(req) ? req.parent : null);

  // Stran /odstop.html: prijavljen imetnik dobi ime, e-naslov in pogodbe v roku; brez prijave prazen obrazec.
  app.get("/api/withdrawal", (req, res) => {
    const p = viewer(req);
    if (!p) return res.json({ logged_in: false, days: WITHDRAWAL_DAYS, contact: CONTACT_EMAIL });
    const { options, store } = contractsFor(db, p, quote);
    const mine = db.prepare("SELECT id, contract_text, submitted_at, status FROM withdrawals WHERE parent_id = ? ORDER BY id DESC LIMIT 5").all(p.id);
    res.json({
      logged_in: true,
      days: WITHDRAWAL_DAYS,
      contact: CONTACT_EMAIL,
      name: p.name || "",
      email: p.email,
      options: options.map((o) => ({ ...o, refund: refundFor(db, p, o) })),
      store,
      submitted: mine.map((w) => ({ ...w, submitted_text: submittedText(w.submitted_at) })),
    });
  });

  app.post("/api/withdrawal", json, async (req, res) => {
    const ipKey = `odstop|${req.ip}`;
    if (throttle.blocked(ipKey)) return res.status(429).json({ error: "Preveč obvestil v kratkem času. Poskusite čez eno uro ali pišite na " + CONTACT_EMAIL + "." });
    const name = String(req.body?.name ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
    const email = String(req.body?.email ?? "").trim().slice(0, 200);
    const details = String(req.body?.details ?? "").trim().slice(0, 1000);
    const want = String(req.body?.contract ?? "other");
    if (!name) return res.status(400).json({ error: "Vpišite ime in priimek.", field: "name" });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Vpišite veljaven e-naslov za potrdilo.", field: "email" });
    const p = viewer(req);
    let option = null;
    if (p && want !== "other") {
      option = contractsFor(db, p, quote).options.find((o) => o.id === want) || null;
      if (!option) return res.status(409).json({ error: "Te pogodbe ni več med pogodbami v roku za odstop. Osvežite stran.", field: "contract" });
    }
    if (!option && details.length < 3) return res.status(400).json({ error: "Napišite, od katere pogodbe odstopate (kaj ste kupili in kdaj).", field: "details" });
    throttle.fail(ipKey);
    const submittedAt = new Date().toISOString();
    const cText = option ? contractText(option) : "Drugo (opis spodaj)";
    const refund = option ? refundFor(db, p, option) : null;
    const id = Number(
      db
        .prepare("INSERT INTO withdrawals (parent_id, name, email, contract, contract_text, details, source, submitted_at, refund_mode, refund_target, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(p?.id ?? null, name, email, option ? option.id : "other", cText, details, p ? "app" : "public", submittedAt, refund?.mode ?? null, refund?.cents ?? null, option?.currency ?? null).lastInsertRowid,
    );
    audit(db, { req, parentId: p?.id ?? null, actor: p ? "parent" : "public", action: "withdrawal_submit", target: `withdrawal:${id}` });
    // Potrdilo o prejemu najprej (zakon: brez nepotrebnega odlašanja), neodvisno od izvedbe vračila.
    const willAuto = !!(p && option && canAuto(p));
    const msg = withdrawalAckEmail({
      name,
      email,
      contract: cText,
      details,
      submitted: submittedText(submittedAt),
      refundText: refund ? `${moneyText(refund.cents, option.currency)}${refund.mode === "sorazmerno" ? " (sorazmerni del za čas po odstopu)" : " (celotno plačilo)"}` : "",
      auto: willAuto,
      contact: CONTACT_EMAIL,
      appUrl: `${String(baseUrl(req) || "").replace(/\/+$/, "")}/`,
    });
    let ok = false;
    try {
      ok = !!(await sendMail(email, msg));
    } catch (err) {
      log.error?.("[evklid] potrdilo o odstopu:", err.message);
    }
    db.prepare("UPDATE withdrawals SET ack_ok = ? WHERE id = ?").run(ok ? 1 : 0, id);
    if (!ok) log.error?.("[evklid] potrdilo o prejemu odstopa ni poslano", id);
    let result = null;
    if (willAuto) result = await processRow(id, { req, actor: "parent" });
    const row = db.prepare("SELECT * FROM withdrawals WHERE id = ?").get(id);
    res.status(201).json({ withdrawal: publicRow(row), ack_sent: ok, processed: result?.ok === true });
  });

  const canAuto = (p) => autoOn() && stripe.enabled && (stripe.testMode || liveOn()) && !isMinor(p);

  const publicRow = (w) => ({
    id: w.id,
    name: w.name,
    email: w.email,
    contract_text: w.contract_text,
    details: w.details,
    submitted_at: w.submitted_at,
    submitted_text: submittedText(w.submitted_at),
    status: w.status,
    refund_cents: w.refund_cents,
    refund_target: w.refund_target,
    refund_mode: w.refund_mode,
    currency: w.currency,
  });

  // Vračilo po plačilih (od zadnjega) do zneska target; že vrnjena plačila se ne ponovijo (refunded_payments).
  async function refundPayments(w, payments, target) {
    const done = new Set(JSON.parse(w.refunded_payments || "[]"));
    let cents = w.refund_cents || 0;
    for (const pay of payments) {
      if (cents >= target) break;
      if (!pay.pi || done.has(pay.pi)) continue;
      const amount = Math.min(target - cents, pay.left);
      if (amount <= 0) continue;
      const r = await stripe.request("POST", "/refunds", { payment_intent: pay.pi, amount, reason: "requested_by_customer", metadata: { kind: "withdrawal", withdrawal_id: String(w.id) } });
      done.add(pay.pi);
      cents += Number(r?.amount || amount);
      db.prepare("UPDATE withdrawals SET refunded_payments = ?, refund_cents = ? WHERE id = ?").run(JSON.stringify([...done]), cents, w.id);
    }
    return cents;
  }

  // Plačani računi naročnine od sklenitve pogodbe naprej (najnovejši najprej) z zneskom, ki ga še lahko vrnemo.
  async function subPayments(p, fromIso) {
    const page = await stripe.request("GET", "/invoices", { subscription: p.sub_id, status: "paid", limit: 24, expand: ["data.charge"] });
    const from = Date.parse(fromIso) - DAY;
    return (page?.data || [])
      .filter((inv) => Number(inv.created) * 1000 >= from && inv.amount_paid > 0)
      .sort((a, b) => b.created - a.created)
      .map((inv) => {
        const before = typeof inv.charge === "object" && inv.charge ? Number(inv.charge.amount_refunded || 0) : 0;
        return { pi: typeof inv.payment_intent === "string" ? inv.payment_intent : inv.payment_intent?.id, left: inv.amount_paid - before };
      });
  }

  // Izvedba odstopa za zapis id (prijavljen imetnik takoj ali skrbnik pozneje). Vrne { ok, error? }.
  async function processRow(id, { req, actor }) {
    if (running.has(id)) return { ok: false, error: "Odstop se že izvaja." };
    const w0 = db.prepare("SELECT * FROM withdrawals WHERE id = ?").get(id);
    if (!w0) return { ok: false, error: "Zapisa ni." };
    // »processing« brez teka v tem procesu = prekinjeno (ponovni zagon); ponovitev ne vrne že vrnjenih plačil.
    if (!["received", "failed", "processing"].includes(w0.status)) return { ok: false, error: "Odstop je že obdelan." };
    const p = w0.parent_id ? getParent(w0.parent_id) : null;
    if (!p) return { ok: false, error: "Obvestilo ni povezano z računom." };
    if (!stripe.enabled) return { ok: false, error: "Plačila niso nastavljena." };
    if (!stripe.testMode && !liveOn()) return { ok: false, error: "Samodejno vračilo deluje samo v testnem načinu Stripa (EVKLID_ODSTOP_LIVE=1 po s.p.)." };
    // Pogodba in znesek ob času oddaje obvestila (rok in sorazmerni del se štejeta do izjave, ne do obdelave).
    const at = Date.parse(w0.submitted_at);
    const option = contractsFor(db, p, quote, at, id).options.find((o) => o.id === w0.contract);
    if (!option) return { ok: false, error: "Pogodba ob času obvestila ni bila v roku za odstop ali je ni več. Uredi ročno." };
    running.add(id);
    db.prepare("UPDATE withdrawals SET status = 'processing' WHERE id = ?").run(id);
    try {
      const refund = refundFor(db, p, option);
      db.prepare("UPDATE withdrawals SET refund_mode = ?, refund_target = ?, currency = ? WHERE id = ?").run(refund.mode, refund.cents, option.currency, id);
      const w = db.prepare("SELECT * FROM withdrawals WHERE id = ?").get(id);
      if (option.kind === "sub") {
        if (refund.cents > 0) await refundPayments(w, await subPayments(p, option.from), refund.cents);
        await cancelSubscription(getParent(p.id));
      } else if (option.kind === "pass") {
        const ps = db.prepare("SELECT * FROM passes WHERE id = ? AND parent_id = ?").get(Number(option.id.split(":")[1]), p.id);
        if (refund.cents > 0) await refundPayments(w, [{ pi: ps?.payment_id, left: ps?.amount || 0 }], refund.cents);
        if (ps) passes.end(ps.id, "refunded");
      } else if (option.kind === "credit") {
        const c = db.prepare("SELECT * FROM ai_credit_buys WHERE id = ? AND parent_id = ?").get(Number(option.id.split(":")[1]), p.id);
        if (refund.cents > 0) await refundPayments(w, [{ pi: c?.payment_id, left: c?.amount || 0 }], refund.cents);
        if (c?.payment_id) credits.refund(c.payment_id);
      }
      db.prepare("UPDATE withdrawals SET status = 'done', processed_at = ? WHERE id = ?").run(new Date().toISOString(), id);
      audit(db, { req, parentId: req?.parent?.id ?? p.id, actor, action: "withdrawal_done", target: `withdrawal:${id}` });
      return { ok: true };
    } catch (err) {
      log.error?.("[evklid] odstop (vračilo):", id, err.message);
      db.prepare("UPDATE withdrawals SET status = 'failed', note = ? WHERE id = ?").run(String(err.message || "napaka").slice(0, 300), id);
      return { ok: false, error: "Vračilo ni uspelo do konca. Poskusi znova (že vrnjena plačila se ne ponovijo)." };
    } finally {
      running.delete(id);
    }
  }

  // --- skrbnik ---
  const admin = (req, res) => {
    if (req.parent?.is_admin) return true;
    res.status(403).json({ error: "Samo za skrbnika." });
    return false;
  };
  const adminList = () =>
    db
      .prepare(
        `SELECT w.*, p.email AS account_email FROM withdrawals w LEFT JOIN parents p ON p.id = w.parent_id
         ORDER BY CASE w.status WHEN 'failed' THEN 0 WHEN 'received' THEN 1 WHEN 'processing' THEN 2 ELSE 3 END, w.id DESC LIMIT 200`,
      )
      .all()
      .map((w) => ({ ...publicRow(w), parent_id: w.parent_id, account_email: w.account_email || null, source: w.source, contract: w.contract, ack_ok: w.ack_ok, note: w.note, processed_at: w.processed_at }));
  app.get("/api/admin/withdrawals", (req, res) => {
    if (!admin(req, res)) return;
    audit(db, { req, parentId: req.parent?.id, actor: "admin", action: "withdrawal_list" });
    res.json({ withdrawals: adminList(), mode: refundMode(), auto: autoOn(), live: liveOn(), test_mode: !!stripe.testMode });
  });
  // Izvedba (vračilo + preklic) za obvestilo, povezano z računom in pogodbo; skrbnik lahko poveže obvestilo brez prijave
  // z računom (parent_id) in pogodbo (contract), ko je preveril, da je od imetnika.
  app.post("/api/admin/withdrawals/:id/process", json, async (req, res) => {
    if (!admin(req, res)) return;
    const id = Number(req.params.id);
    const w = db.prepare("SELECT * FROM withdrawals WHERE id = ?").get(id);
    if (!w) return res.status(404).json({ error: "Zapisa ni." });
    const pid = req.body?.parent_id != null ? Number(req.body.parent_id) : null;
    const contract = req.body?.contract != null ? String(req.body.contract) : null;
    if (pid != null || contract != null) {
      if (!["received", "failed", "processing"].includes(w.status)) return res.status(409).json({ error: "Odstop je že obdelan." });
      if (pid != null && !getParent(pid)) return res.status(404).json({ error: "Račun ne obstaja." });
      if (contract != null && !/^(sub|pass:\d+|credit:\d+)$/.test(contract)) return res.status(400).json({ error: "Neznana pogodba (sub, pass:<id>, credit:<id>)." });
      db.prepare("UPDATE withdrawals SET parent_id = COALESCE(?, parent_id), contract = COALESCE(?, contract) WHERE id = ?").run(pid, contract, id);
    }
    const r = await processRow(id, { req, actor: "admin" });
    if (!r.ok) return res.status(409).json({ error: r.error, withdrawals: adminList() });
    res.json({ withdrawals: adminList() });
  });
  // Zaključi brez samodejne izvedbe (urejeno ročno, pri trgovini, prepozno …) z razlogom.
  app.post("/api/admin/withdrawals/:id/close", json, (req, res) => {
    if (!admin(req, res)) return;
    const note = String(req.body?.note || "").trim().slice(0, 300);
    if (!note) return res.status(400).json({ error: "Napiši razlog." });
    const r = db.prepare("UPDATE withdrawals SET status = 'closed', note = ?, processed_at = ? WHERE id = ? AND status IN ('received', 'failed')").run(note, new Date().toISOString(), Number(req.params.id));
    if (!r.changes) return res.status(409).json({ error: "Zaključiti je mogoče samo neobdelano obvestilo." });
    audit(db, { req, parentId: req.parent?.id, actor: "admin", action: "withdrawal_close", target: `withdrawal:${req.params.id}` });
    res.json({ withdrawals: adminList() });
  });

  return { processRow };
}
