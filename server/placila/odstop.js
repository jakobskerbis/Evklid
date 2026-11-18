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
import { withdrawalAckEmail, withdrawalAdminEmail } from "../accounts/email.js";
import { emailList } from "../accounts/pilot-meja.js";
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

// Meje za obrazec brez prijave (zloraba: pošiljanje potrdil na tuje naslove). Nad mejo se obvestilo zapiše, potrdilo
// pa ne pošlje (ack_ok = -1); skrbnik ga vidi in pošlje ročno, če je pravo.
export const PER_EMAIL_DAY = 2;
export const PUBLIC_DAY = 50;
const ACK_RETRY_MS = DAY; // ponovni poskus potrdila enkrat na dan
const ACK_TRIES = 5;
const CONSENT_SLACK_MS = 10 * 60000; // soglasje do 10 minut po začetku pogodbe še šteje (zapis pred Checkout)

export function migrateWithdrawals(db) {
  db.exec(`
    -- Obvestila o odstopu od pogodbe (dokaz o pravočasnem odstopu in o potrdilu o prejemu).
    CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY,
      parent_id INTEGER REFERENCES parents(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      contract TEXT NOT NULL,            -- sub | pass:<id> | credit:<id> | gift:<id> | other
      contract_text TEXT NOT NULL,       -- podatki o pogodbi, kot jih je potrošnik videl ali vpisal
      details TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL,              -- app (prijavljen imetnik) | public (brez prijave)
      submitted_at TEXT NOT NULL,        -- ISO z milisekundami, UTC
      ack_ok INTEGER,                    -- potrdilo poslano (1) / ni uspelo (0, ponovni poskus) / zadržano nad mejo (-1)
      ack_tries INTEGER NOT NULL DEFAULT 0,
      ack_tried_at TEXT,
      ack_auto INTEGER NOT NULL DEFAULT 0, -- potrdilo je napovedalo takojšnjo izvedbo
      status TEXT NOT NULL DEFAULT 'received', -- received | processing | done | failed | closed
      refund_mode TEXT,
      refund_cents INTEGER NOT NULL DEFAULT 0,
      refund_target INTEGER,             -- znesek ob oddaji obvestila (zgornja meja vračila)
      currency TEXT,
      refunds TEXT NOT NULL DEFAULT '{}', -- {payment_intent: {state: pending|done, amount, id}}
      note TEXT NOT NULL DEFAULT '',
      admin_alerted INTEGER NOT NULL DEFAULT 0,
      processed_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_withdrawals_parent ON withdrawals(parent_id);
    CREATE INDEX IF NOT EXISTS idx_withdrawals_email ON withdrawals(email);
  `);
}

const sqlTime = (ms) => new Date(ms).toISOString().slice(0, 19).replace("T", " ");
const fromSql = (t) => (t ? Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(t) ? t : `${String(t).replace(" ", "T")}Z`) : NaN);
const LIVE_SUB = new Set(["active", "trialing", "past_due"]);
const refundsOf = (w) => {
  try {
    const v = JSON.parse(w?.refunds || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
};

// Pogodbe računa, od katerih lahko imetnik ta trenutek odstopi s funkcijo (v roku 14 dni). quote = billing.withdrawalQuote.
// gift: darilna koda (vrne se celotno plačilo, dokler ni vpisana; izvede skrbnik). store: nakup v trgovini (navodilo).
export function contractsFor(db, p, quote, now = Date.now(), exceptId = 0) {
  if (!p || p.is_guest) return { options: [], store: null };
  const q = quote(p, now);
  const deadline = (from) => new Date(Date.parse(from) + WITHDRAWAL_DAYS * DAY).toISOString();
  const within = (from) => Number.isFinite(from) && now >= from && now - from <= WITHDRAWAL_DAYS * DAY;
  const options = [];
  const provider = p.sub_provider || "stripe";
  const s = q.subscription;
  let store = null;
  if (s && provider !== "stripe") store = provider; // App Store / Google Play: odstop pri trgovini
  else if (s && s.within_14_days && LIVE_SUB.has(p.sub_status) && String(p.sub_id || "").startsWith("sub_")) {
    // Preizkus brez plačila: nič za vrniti (prej bi cenik dal znesek, ki ga kupec ni plačal).
    const unpaid = s.source !== "placilo" && p.sub_status === "trialing";
    options.push({ id: "sub", kind: "sub", plan: s.plan, from: s.contract_from, deadline: deadline(s.contract_from), paid_cents: unpaid ? 0 : s.paid_cents, refund_cents: unpaid ? 0 : s.refund_cents, currency: s.currency, auto: true });
  }
  for (const ps of q.passes) {
    if (!ps.within_14_days || !ps.contract_from) continue;
    options.push({ id: `pass:${ps.id}`, kind: "pass", from: ps.contract_from, deadline: deadline(ps.contract_from), paid_cents: ps.paid_cents, refund_cents: ps.refund_cents, currency: ps.currency, auto: true });
  }
  for (const c of q.credits || []) {
    if (!c.within_14_days || !c.contract_from) continue;
    options.push({ id: `credit:${c.id}`, kind: "credit", from: c.contract_from, deadline: deadline(c.contract_from), paid_cents: c.paid_cents, refund_cents: c.refund_cents, currency: c.currency, auto: true });
  }
  if (db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'gifts'").get()) {
    for (const g of db.prepare("SELECT * FROM gifts WHERE buyer_id = ? AND status = 'paid' AND redeemed_by IS NULL").all(p.id)) {
      const from = fromSql(g.created_at);
      if (!within(from)) continue;
      const iso = new Date(from).toISOString();
      options.push({ id: `gift:${g.id}`, kind: "gift", from: iso, deadline: deadline(iso), paid_cents: g.amount, refund_cents: g.amount, currency: g.currency || "EUR", auto: false });
    }
  }
  // Pogodba, za katero že obstaja obvestilo po sklenitvi, ki je v obdelavi, izvedeno, neuspelo (uredi skrbnik) ali je
  // že kaj vrnilo, ni več na seznamu: drugo obvestilo ne sme sprožiti drugega vračila.
  const taken = db
    .prepare("SELECT contract, submitted_at, status, refund_cents, refunds FROM withdrawals WHERE parent_id = ? AND id != ? AND status != 'closed'")
    .all(p.id, exceptId)
    .filter((w) => w.status !== "received" || w.refund_cents > 0 || Object.keys(refundsOf(w)).length > 0);
  const open = options.filter((o) => !taken.some((w) => w.contract === o.id && Date.parse(w.submitted_at) >= Date.parse(o.from)));
  return { options: open, store };
}

// Opis pogodbe za zapis in potrdilo (slovensko, vikanje; plačnik je odrasel).
const dayText = (iso) => new Intl.DateTimeFormat("sl-SI", { timeZone: "Europe/Ljubljana", day: "numeric", month: "numeric", year: "numeric" }).format(new Date(iso)).replace(/\s+/g, " ");
const KIND_TEXT = { sub: "Naročnina Evklid", pass: "Paket pred testom", credit: "Dokup pogovorov", gift: "Darilna koda" };
export function contractText(o) {
  return `${KIND_TEXT[o.kind] || "Nakup"}, sklenjeno ${dayText(o.from)}, plačano ${moneyText(o.paid_cents, o.currency)}`;
}

// Ali je plačnik pred plačilom izrecno potrdil takojšen začetek: soglasje z različico pravila o odstopu ([odstop: V]),
// zapisano pred začetkom pogodbe (z rezervo nekaj minut) ali povezano z isto plačilno sejo. Prednost ima soglasje
// plačane seje (potrdilo o nakupu v email_log). Darilna koda: uporaba se začne šele z vpisom, vedno celotno vračilo.
function consentRow(db, p, o) {
  const kinds = o.kind === "sub" ? ["sub", "pay_link_sub"] : o.kind === "pass" ? ["pass", "pay_link_pass"] : ["credit", "pay_link_credit"];
  const ref = Number(String(o.id).split(":")[1]);
  const checkout = o.kind === "pass" ? db.prepare("SELECT checkout_id FROM passes WHERE id = ?").get(ref)?.checkout_id : o.kind === "credit" ? db.prepare("SELECT checkout_id FROM ai_credit_buys WHERE id = ?").get(ref)?.checkout_id : null;
  if (checkout) {
    const linked = db.prepare("SELECT text FROM billing_consents WHERE checkout_id = ? ORDER BY id DESC LIMIT 1").get(checkout);
    if (linked) return linked;
  }
  return db
    .prepare(
      `SELECT text FROM billing_consents WHERE parent_id = ? AND kind IN (${kinds.map(() => "?").join(",")}) AND created_at <= ?
       ORDER BY (checkout_id IS NOT NULL AND checkout_id IN (SELECT period FROM email_log WHERE kind = 'purchase')) DESC, created_at DESC, id DESC LIMIT 1`,
    )
    .get(p.id, ...kinds, sqlTime(Date.parse(o.from) + CONSENT_SLACK_MS));
}
function expressConsent(db, p, o) {
  if (o.kind === "gift") return false;
  const row = consentRow(db, p, o);
  return !!row && /\n\[odstop: [^\]]+\]/.test(String(row.text || ""));
}

export function refundFor(db, p, o) {
  const mode = refundMode() === "celotno" || !expressConsent(db, p, o) ? "celotno" : "sorazmerno";
  return { mode, cents: mode === "celotno" ? o.paid_cents : o.refund_cents };
}

// Za e-pošto obvestila brez prijave: brez povezav in naslovov (nihče ne sme prek nas pošiljati povezav na tuje naslove).
export const stripLinks = (s) =>
  String(s || "")
    .replace(/\b(?:https?:\/\/|www\.)\S+/gi, "[povezava]")
    .replace(/\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g, "[e-naslov]")
    .replace(/\b[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}(?:\/\S*)?/gi, "[povezava]")
    .slice(0, 300);

export function mountWithdrawal(app, { db, stripe, json, log = {}, getParent, quote, cancelSub, passes, credits, sendMail, baseUrl, ownerOk, isMinor, env = process.env }) {
  migrateWithdrawals(db);
  const throttle = new Throttle(5, 60 * 60000); // 5 obvestil na uro z enega naslova IP
  const running = new Set();
  const viewer = (req) => (req.parent && !req.parent.is_guest && ownerOk(req) ? req.parent : null);
  const fail = (res, status, code, error, extra = {}) => res.status(status).json({ error, code, ...extra });
  const appUrl = (req) => `${String(baseUrl(req) || "").replace(/\/+$/, "")}/`;

  app.get("/api/withdrawal", (req, res) => {
    const p = viewer(req);
    if (!p) return res.json({ logged_in: false, days: WITHDRAWAL_DAYS, contact: CONTACT_EMAIL });
    const { options, store } = contractsFor(db, p, quote);
    res.json({
      logged_in: true,
      days: WITHDRAWAL_DAYS,
      contact: CONTACT_EMAIL,
      name: p.name || "",
      email: p.email,
      options: options.map((o) => ({ ...o, refund: refundFor(db, p, o) })),
      store,
    });
  });

  // Potrdilo o prejemu iz zapisa (prvo pošiljanje, dnevni ponovni poskus, skrbnik »Pošlji potrdilo znova«).
  function ackMessage(w) {
    const pub = w.source === "public";
    const refundText = w.refund_target > 0 ? `${moneyText(w.refund_target, w.currency || "EUR")}${w.refund_mode === "sorazmerno" ? " (sorazmerni del za čas po odstopu)" : " (celotno plačilo)"}` : "";
    const msg = withdrawalAckEmail({
      name: pub ? stripLinks(w.name) : w.name,
      email: w.email,
      contract: w.contract_text,
      details: pub ? stripLinks(w.details) : w.details,
      submitted: submittedText(w.submitted_at),
      refundText,
      auto: !!w.ack_auto,
      contact: CONTACT_EMAIL,
      appUrl: w.app_url || "",
    });
    // Brez prijave samo navadno besedilo (brez HTML in povezav).
    return pub ? { subject: msg.subject, text: msg.text } : msg;
  }
  async function sendAck(w, appBase = "") {
    let ok = false;
    try {
      ok = !!(await sendMail(w.email, ackMessage({ ...w, app_url: appBase })));
    } catch (err) {
      log.error?.("[evklid] potrdilo o odstopu:", err.message);
    }
    db.prepare("UPDATE withdrawals SET ack_ok = ?, ack_tries = ack_tries + 1, ack_tried_at = ? WHERE id = ?").run(ok ? 1 : 0, new Date().toISOString(), w.id);
    if (!ok) log.error?.("[evklid] potrdilo o prejemu odstopa ni poslano", w.id);
    return ok;
  }

  // Skrbniku e-pošta za vsako obvestilo, ki ni bilo izvedeno samodejno (EVKLID_ADMIN_EMAILS), enkrat.
  async function alertAdmin(id) {
    const w = db.prepare("SELECT * FROM withdrawals WHERE id = ?").get(id);
    if (!w || w.status === "done" || w.admin_alerted) return;
    const to = emailList(env.EVKLID_ADMIN_EMAILS);
    if (!to.length) return log.error?.("[evklid] odstop čaka skrbnika, EVKLID_ADMIN_EMAILS ni nastavljen", id);
    const msg = withdrawalAdminEmail({ id, status: w.status, source: w.source, submitted: submittedText(w.submitted_at), contract: w.contract_text, note: w.note, ackOk: w.ack_ok });
    let sent = 0;
    for (const a of to) sent += (await sendMail(a, msg).catch(() => false)) ? 1 : 0;
    if (sent) db.prepare("UPDATE withdrawals SET admin_alerted = 1 WHERE id = ?").run(id);
  }

  app.post("/api/withdrawal", json, async (req, res) => {
    const ipKey = `odstop|${req.ip}`;
    if (throttle.blocked(ipKey)) return fail(res, 429, "throttle", `Preveč obvestil v kratkem času. Poskusite čez eno uro ali pišite na ${CONTACT_EMAIL}.`);
    const name = String(req.body?.name ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
    const email = String(req.body?.email ?? "").trim().slice(0, 200);
    const details = String(req.body?.details ?? "").trim().slice(0, 1000);
    const want = String(req.body?.contract ?? "other");
    if (!name) return fail(res, 400, "name", "Vpišite ime in priimek.", { field: "name" });
    if (!EMAIL_RE.test(email)) return fail(res, 400, "email", "Vpišite veljaven e-naslov za potrdilo.", { field: "email" });
    const p = viewer(req);
    let option = null;
    if (p && want !== "other") {
      option = contractsFor(db, p, quote).options.find((o) => o.id === want) || null;
      if (!option) return fail(res, 409, "contract", "Te pogodbe ni več med pogodbami v roku za odstop. Osvežite stran.", { field: "contract" });
    }
    if (!option && details.length < 3) return fail(res, 400, "details", "Napišite, od katere pogodbe odstopate (kaj ste kupili in kdaj).", { field: "details" });
    throttle.fail(ipKey);
    const submittedAt = new Date().toISOString();
    const cText = option ? contractText(option) : "Drugo (opis spodaj)";
    const refund = option ? refundFor(db, p, option) : null;
    const willAuto = !!(p && option?.auto && canAuto(p));
    const id = Number(
      db
        .prepare("INSERT INTO withdrawals (parent_id, name, email, contract, contract_text, details, source, submitted_at, refund_mode, refund_target, currency, ack_auto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(p?.id ?? null, name, email, option ? option.id : "other", cText, details, p ? "app" : "public", submittedAt, refund?.mode ?? null, refund?.cents ?? null, option?.currency ?? null, willAuto ? 1 : 0).lastInsertRowid,
    );
    audit(db, { req, parentId: p?.id ?? null, actor: p ? "parent" : "public", action: "withdrawal_submit", target: `withdrawal:${id}` });
    // Brez prijave: največ PER_EMAIL_DAY potrdil na isti naslov in PUBLIC_DAY na dan skupaj; nad tem zapis brez e-pošte.
    let held = false;
    if (!p) {
      const since = new Date(Date.now() - DAY).toISOString();
      const perEmail = db.prepare("SELECT COUNT(*) AS n FROM withdrawals WHERE lower(email) = lower(?) AND source = 'public' AND submitted_at >= ? AND ack_ok = 1").get(email, since).n;
      const all = db.prepare("SELECT COUNT(*) AS n FROM withdrawals WHERE source = 'public' AND submitted_at >= ?").get(since).n;
      if (all > PUBLIC_DAY) log.error?.(`[evklid] OPOZORILO: ${all} obvestil o odstopu brez prijave v 24 urah (meja ${PUBLIC_DAY}); potrdila zadržana`);
      held = perEmail >= PER_EMAIL_DAY || all > PUBLIC_DAY;
    }
    let ok = false;
    if (held) db.prepare("UPDATE withdrawals SET ack_ok = -1, note = 'potrdilo zadržano (meja obvestil brez prijave)' WHERE id = ?").run(id);
    else ok = await sendAck(db.prepare("SELECT * FROM withdrawals WHERE id = ?").get(id), appUrl(req));
    let result = null;
    if (willAuto) result = await processRow(id, { req, actor: "parent" });
    if (!result?.ok) await alertAdmin(id).catch((e) => log.error?.("[evklid] opozorilo o odstopu:", e.message));
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

  // Plačilo (payment_intent): koliko je še mogoče vrniti (prejeto − že vrnjeno, tudi vračila zunaj odstopa).
  async function piLeft(pi) {
    const intent = await stripe.request("GET", `/payment_intents/${pi}`, { expand: ["latest_charge"] });
    const got = Number(intent?.amount_received ?? intent?.amount ?? 0);
    const ch = intent?.latest_charge && typeof intent.latest_charge === "object" ? intent.latest_charge : null;
    return Math.max(0, got - Number(ch?.amount_refunded || 0));
  }

  // Vračilo po plačilih (od zadnjega) do zneska target, idempotentno: ključ withdrawal-<id>-<pi>, oznaka »pending« pred
  // klicem; ob ponovitvi najprej poiščemo že narejeno vračilo tega odstopa (metadata.withdrawal_id) pri Stripu.
  async function refundPayments(id, payments, target) {
    const read = () => db.prepare("SELECT * FROM withdrawals WHERE id = ?").get(id);
    const save = (map) => {
      const cents = Object.values(map).reduce((t, r) => t + (r.state === "done" ? Number(r.amount) || 0 : 0), 0);
      db.prepare("UPDATE withdrawals SET refunds = ?, refund_cents = ? WHERE id = ?").run(JSON.stringify(map), cents, id);
      return cents;
    };
    let map = refundsOf(read());
    // Prekinjena vračila (pending): ali jih Stripe že ima?
    for (const [pi, r] of Object.entries(map)) {
      if (r.state !== "pending") continue;
      const list = await stripe.request("GET", "/refunds", { payment_intent: pi, limit: 100 });
      const hit = (list?.data || []).find((x) => String(x?.metadata?.withdrawal_id) === String(id) && x.status !== "failed" && x.status !== "canceled");
      if (hit) map[pi] = { state: "done", amount: Number(hit.amount) || 0, id: hit.id };
      else delete map[pi]; // ni ga: spodaj znova z istim ključem (Stripe ne naredi dvojnika)
    }
    let cents = save(map);
    for (const pay of payments) {
      if (cents >= target) break;
      if (!pay.pi || map[pay.pi]?.state === "done") continue;
      const left = pay.left != null ? pay.left : await piLeft(pay.pi);
      const amount = Math.min(target - cents, left);
      if (amount <= 0) continue;
      map[pay.pi] = { state: "pending", amount };
      save(map);
      const r = await stripe.request(
        "POST",
        "/refunds",
        { payment_intent: pay.pi, amount, reason: "requested_by_customer", metadata: { kind: "withdrawal", withdrawal_id: String(id) } },
        { idempotencyKey: `withdrawal-${id}-${pay.pi}` },
      );
      map[pay.pi] = { state: "done", amount: Number(r?.amount || amount), id: r?.id || null };
      cents = save(map);
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
        return { pi: typeof inv.payment_intent === "string" ? inv.payment_intent : inv.payment_intent?.id, left: Math.max(0, inv.amount_paid - before) };
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
    if (option.kind === "gift") return { ok: false, error: "Darilno kodo vrni ročno v Stripu (vrnemo celotno plačilo), nato zaključi." };
    running.add(id);
    db.prepare("UPDATE withdrawals SET status = 'processing' WHERE id = ?").run(id);
    try {
      const refund = refundFor(db, p, option);
      // Zgornja meja: znesek, ki smo ga potrošniku pokazali ob oddaji (npr. delež neporabljenih pogovorov takrat).
      const target = w0.refund_target != null ? Math.min(refund.cents, w0.refund_target) : refund.cents;
      db.prepare("UPDATE withdrawals SET refund_mode = ?, refund_target = ?, currency = ? WHERE id = ?").run(refund.mode, target, option.currency, id);
      let got = 0;
      if (option.kind === "sub") {
        if (target > 0) got = await refundPayments(id, await subPayments(p, option.from), target);
        await cancelSub(getParent(p.id));
      } else if (option.kind === "pass") {
        const ps = db.prepare("SELECT * FROM passes WHERE id = ? AND parent_id = ?").get(Number(option.id.split(":")[1]), p.id);
        if (target > 0 && ps?.payment_id) got = await refundPayments(id, [{ pi: ps.payment_id }], target);
        if (ps) passes.end(ps.id, "refunded");
      } else if (option.kind === "credit") {
        const c = db.prepare("SELECT * FROM ai_credit_buys WHERE id = ? AND parent_id = ?").get(Number(option.id.split(":")[1]), p.id);
        if (target > 0 && c?.payment_id) got = await refundPayments(id, [{ pi: c.payment_id }], target);
        if (c?.payment_id) credits.refund(c.payment_id);
      }
      const nowIso = new Date().toISOString();
      if (got < target) {
        const note = `vrnjeno ${moneyText(got, option.currency)} od ${moneyText(target, option.currency)}, uredi ročno`;
        db.prepare("UPDATE withdrawals SET status = 'failed', note = ?, processed_at = ? WHERE id = ?").run(note, nowIso, id);
        audit(db, { req, parentId: req?.parent?.id ?? p.id, actor, action: "withdrawal_short", target: `withdrawal:${id}` });
        return { ok: false, error: `Vračilo ni bilo v celoti mogoče (${note}).` };
      }
      db.prepare("UPDATE withdrawals SET status = 'done', note = '', processed_at = ? WHERE id = ?").run(nowIso, id);
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

  // Dnevno: potrdila, ki niso bila poslana (ack_ok = 0), poskusimo znova (največ ACK_TRIES-krat, enkrat na dan).
  async function retryAcks(now = Date.now()) {
    let sent = 0;
    for (const w of db.prepare("SELECT * FROM withdrawals WHERE ack_ok = 0 AND ack_tries < ?").all(ACK_TRIES)) {
      if (w.ack_tried_at && now - Date.parse(w.ack_tried_at) < ACK_RETRY_MS) continue;
      if (await sendAck(w, appUrl(null))) sent++;
    }
    return sent;
  }

  // --- skrbnik ---
  const admin = (req, res) => {
    if (req.parent?.is_admin) return true;
    res.status(403).json({ error: "Samo za skrbnika." });
    return false;
  };
  const OLD_MS = 7 * DAY;
  const adminList = () =>
    db
      .prepare(
        `SELECT w.*, p.email AS account_email FROM withdrawals w LEFT JOIN parents p ON p.id = w.parent_id
         ORDER BY CASE w.status WHEN 'failed' THEN 0 WHEN 'received' THEN 1 WHEN 'processing' THEN 2 ELSE 3 END, w.id DESC LIMIT 200`,
      )
      .all()
      .map((w) => ({
        ...publicRow(w),
        parent_id: w.parent_id,
        account_email: w.account_email || null,
        source: w.source,
        contract: w.contract,
        ack_ok: w.ack_ok,
        note: w.note,
        processed_at: w.processed_at,
        // Neobdelano dlje kot 7 dni: vračilo mora biti v 14 dneh od prejema.
        overdue: ["received", "failed", "processing"].includes(w.status) && Date.now() - Date.parse(w.submitted_at) > OLD_MS,
      }));
  app.get("/api/admin/withdrawals", (req, res) => {
    if (!admin(req, res)) return;
    audit(db, { req, parentId: req.parent?.id, actor: "admin", action: "withdrawal_list" });
    res.json({ withdrawals: adminList(), mode: refundMode(), auto: autoOn(), live: liveOn(), test_mode: !!stripe.testMode });
  });
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
  app.post("/api/admin/withdrawals/:id/close", json, (req, res) => {
    if (!admin(req, res)) return;
    const note = String(req.body?.note || "").trim().slice(0, 300);
    if (!note) return res.status(400).json({ error: "Napiši razlog." });
    const r = db.prepare("UPDATE withdrawals SET status = 'closed', note = ?, processed_at = ? WHERE id = ? AND status IN ('received', 'failed')").run(note, new Date().toISOString(), Number(req.params.id));
    if (!r.changes) return res.status(409).json({ error: "Zaključiti je mogoče samo neobdelano obvestilo." });
    audit(db, { req, parentId: req.parent?.id, actor: "admin", action: "withdrawal_close", target: `withdrawal:${req.params.id}` });
    res.json({ withdrawals: adminList() });
  });
  // Potrdilo znova (tudi zadržano nad mejo, ko je skrbnik preveril, da je obvestilo pravo).
  app.post("/api/admin/withdrawals/:id/ack", json, async (req, res) => {
    if (!admin(req, res)) return;
    const w = db.prepare("SELECT * FROM withdrawals WHERE id = ?").get(Number(req.params.id));
    if (!w) return res.status(404).json({ error: "Zapisa ni." });
    const ok = await sendAck(w, appUrl(req));
    audit(db, { req, parentId: req.parent?.id, actor: "admin", action: "withdrawal_ack", target: `withdrawal:${w.id}` });
    if (!ok) return res.status(502).json({ error: "Potrdila ni bilo mogoče poslati.", withdrawals: adminList() });
    res.json({ withdrawals: adminList() });
  });
  // Izbris neželenega obvestila brez prijave (ni povezano z računom, nič vrnjeno).
  app.delete("/api/admin/withdrawals/:id", (req, res) => {
    if (!admin(req, res)) return;
    const r = db.prepare("DELETE FROM withdrawals WHERE id = ? AND parent_id IS NULL AND source = 'public' AND refund_cents = 0 AND status IN ('received', 'closed')").run(Number(req.params.id));
    if (!r.changes) return res.status(409).json({ error: "Izbrisati je mogoče samo neobdelano obvestilo brez prijave." });
    audit(db, { req, parentId: req.parent?.id, actor: "admin", action: "withdrawal_delete", target: `withdrawal:${req.params.id}` });
    res.json({ withdrawals: adminList() });
  });

  return { processRow, retryAcks, contracts: (p) => contractsFor(db, p, quote) };
}
