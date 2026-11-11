// Starševski računi, soglasja, naročnine (Stripe), priporočila in tedenska poročila (Resend).
// Vklop: EVKLID_ACCOUNTS=1. Brez tega aplikacija deluje kot prej (brez prijave).
import crypto from "node:crypto";
import "../env.js";
import { BRAND, LEGACY } from "../brand.js";
import { isLocalRequest } from "../feedback.js";
import express from "express";
import { migrateAccounts } from "./schema.js";
import { hashPassword, verifyPassword, needsRehash, fakeVerify, unusablePasswordHash, randomToken, sha256, readCookie, Sessions, setSessionCookie, clearSessionCookie, Throttle } from "./auth.js";
import { audit, detachAudit } from "../dnevnik-dostopov.js";
import { openMessage } from "../db.js";
import { openReport } from "../reports.js";
import { unseal, auditSecret } from "../crypto-polje.js";
import { createHmac } from "node:crypto";
import { exportOtherTables } from "../zasebnost.js";
import { pilotSummary, pilotWtp } from "../pilot-naloge.js";
import { aiCapFromNetEur, vatRateFor, eurVatFor } from "./plans.js";
import { isPilotParent, isOwnerParent, pilotEndMs, emailList, privilegedEmail, PILOT_PROFILES, PILOT_LOCK_PROFILES, pilotLastDay } from "./pilot-meja.js";
import { createPaidPeriods } from "../placila/placano.js";
import { planByKey, planFor, plansFor, currencyForCountry, REGIONAL_DRAFT, monthlyAmount, accessFor, paidActive, isPremiumChild, isoIn, SCHOOL_PLANS, schoolPlanFor, isSchoolPlan, GIFT_PRICES, planLevel, opensLevel, guaranteeUsd, planGuarantee, giftGuarantee, subscriptionCeiling, MIN_CEILING_USD, upgradeMonthUsd, upgradeFromUsd, levelPlanFor, familyPlanFor, passLevel, monthlyOf, freeDailyQuestions, freeMonthlyPoolUsd, freeStudentMonthlyUsd, passCapUsd, TRIAL_DAYS, REFERRAL_DAYS, MAX_CHILDREN, PRIVACY_VERSION, GRACE_DAYS } from "./plans.js";
import { Stripe, verifyWebhook } from "./stripe.js";
import { Mailer, verifyEmail, resetEmail, appleLinkedEmail, referralRewardEmail, paymentFailedEmail, parentInviteEmail, ownerCodeEmail } from "./email.js";
import { mountBilling, migrateBilling, publicPass, ADULT_TEXT, WITHDRAWAL_TEXT } from "./billing.js";
import { buildWeeklyReport, weekKey, isSendTime } from "./weekly.js";
import { buildGoalReminder, reminderDays, isNoonTime, ljNow } from "./goal-reminder.js";
import { Devices, deviceLabel, deviceWarnLimit } from "./devices.js";
import { cleanText } from "../settings.js";
import { Usage, BLOCK_TEXT } from "../usage.js";
import { USTNO_QUESTIONS } from "../ustno.js";
import { NOPAY_USD, nopayPoolUsd } from "../meje-ai.js";
import { promoConfig, createPromo } from "./promo.js";
import { minAgeOf, ageOn, parseBirthDate, ADULT_AGE, MIN_HOLDER_AGE, BIRTH_MISSING_PAY } from "./age.js";
import { guestModeOn, guestNet, guestPerDay, GuestInvites, GuestQuota, GUEST_SESSION_DAYS, netKey } from "./guest.js";
import { AccountLocks, ownerOnly } from "./account-lock.js";
import { ProfileLocks, checkProfilePassword } from "./profile-lock.js";
import { rights as rightsOf, lessonInteractive as lessonOpen } from "../placila/pravice.js";
import { createSchoolSource } from "../placila/sola-vir.js";
import { offerPolicy, oneOffer } from "../placila/ponudbe.js";
import { Credits } from "../placila/krediti.js";
import { SHARE } from "../proracun.js";
import { stopnja, rang, STOPNJE } from "../../public/stopnja.js";
import { mountGifts } from "../placila/darila.js";
import { mountGuarantee, purgeOldGuarantees, guaranteeAdvertised, GUARANTEE } from "../placila/garancija.js";
import { mountPodari } from "../placila/podari.js";
import { Schedules, nowParts } from "../schedule.js";
import { setSource } from "../rast.js";
import { parentFromMeta, unmatchedRecorder } from "./ponoven-id.js";

export const CONSENT_TEXT =
  "Izjavljam, da sem starš ali zakoniti zastopnik tega otroka in soglašam, da Evklid obdeluje otrokove osebne podatke " +
  "(ime ali vzdevek, letnica rojstva, nastavitve, pogovori z AI inštruktorjem, fotografije nalog in napredek) za namen " +
  "učenja, kot je opisano v Obvestilu o varstvu osebnih podatkov. Soglasje lahko kadar koli prekličem z izbrisom otrokovega profila.";

// Soglasje dijaka, ki je dovolj star za lastno privolitev in ustvarja svoj profil.
export const SELF_CONSENT_TEXT =
  "Profil je moj. Prebral(a) sem Obvestilo o varstvu osebnih podatkov in soglašam, da Evklid obdeluje moje podatke " +
  "(ime ali vzdevek, letnica rojstva, nastavitve, pogovori z AI inštruktorjem, fotografije nalog in napredek) za namen učenja.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAID = new Set(["active", "trialing", "past_due"]);
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
// Povezava za potrditev e-naslova velja 7 dni (nato »Pošlji znova« v Računu); migracija v schema.js.
export const VERIFY_DAYS = 7;
// Piškotek po zavrnjeni registraciji zaradi starosti: 24 ur je na tej napravi mogoča samo
// registracija polnoletnega (starša), da otrok ne poskusi znova z drugim datumom.
const AGE_COOKIE = `${BRAND.slug}_age`;
const LEGACY_AGE_COOKIES = LEGACY.map((l) => `${l.slug}_age`); // prejšnja imena (velja en dan)

function referralCode() {
  let s = "";
  for (const b of randomToken(8).split("")) s += CODE_CHARS[b.charCodeAt(0) % CODE_CHARS.length];
  return s.slice(0, 7);
}

export function mountAccounts(app, store, opts = {}) {
  const enabled = opts.accounts ?? process.env.EVKLID_ACCOUNTS === "1";
  if (!enabled) {
    app.get("/api/account/status", (_req, res) => res.json({ enabled: false }));
    return null;
  }

  const db = store.db;
  migrateAccounts(db);
  migrateBilling(db);
  const aiUsage = new Usage(db);
  // Uporaba brez registracije je odstranjena: vedno izklopljena, vklopijo jo le testi (opts.guest).
  const guestOn = opts.guest ?? guestModeOn(process.env);
  const guests = new GuestQuota(db);
  const invites = new GuestInvites(db);
  // Gost sme naprej, če je uporaba brez računa vklopljena (testi) ali če je prišel z lastnikovim povabilom.
  const guestAllowed = (p) => guestOn || !!p?.guest_invite_id;
  app.set("trust proxy", 1);

  const kv = {
    get: (k) => db.prepare("SELECT value FROM kv WHERE key = ?").get(k)?.value ?? null,
    set: (k, v) => db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(k, v),
  };
  // Dejansko plačilo naročnine po obdobjih (meja AI in vračilo, server/placila/placano.js).
  const paidPeriods = createPaidPeriods(kv);

  const env = process.env;
  const stripe = new Stripe({ secretKey: opts.stripeKey ?? env.STRIPE_SECRET_KEY, fetchFn: opts.fetchFn, kv });
  const mailer = new Mailer({ apiKey: opts.resendKey ?? env.RESEND_API_KEY, fetchFn: opts.fetchFn, log: opts.mailLog });
  const webhookSecret = opts.webhookSecret ?? env.STRIPE_WEBHOOK_SECRET;
  // Isti razčlenjevalnik kot meja lastnika (pilot-meja.js emailList, pregled #477 B3).
  const adminEmails = emailList(env.EVKLID_ADMIN_EMAILS);
  const sessions = new Sessions(db);
  const devices = new Devices(db);
  const throttle = new Throttle();
  // Brez skupnega gesla je registracija odprta spletu: največ 5 novih računov z enega naslova IP na dan.
  const signupThrottle = new Throttle(Number(env.EVKLID_SIGNUPS_PER_DAY) || 5, 24 * 3600000);
  // Povezava za potrditev ali novo geslo v odgovoru (ko e-pošta ni nastavljena) samo na računalniku s strežnikom
  // ali za skupnim geslom; sicer bi kdorkoli prevzel tuj račun (»pozabljeno geslo«) ali potrdil izmišljen e-naslov.
  const forgotThrottle = new Throttle(5, 3600000); // pošiljanje povezav za novo geslo: 5 na uro
  // Prošnja za starše (premlad za lasten račun): z enega naslova IP 3 na uro, na isti e-naslov 2 na dan.
  const inviteIpThrottle = new Throttle(3, 3600000);
  const inviteToThrottle = new Throttle(2, 24 * 3600000);
  // Skupaj največ 30 na dan za ves strežnik, da prošnje ne porabijo kvote Resend za potrditve in gesla.
  const inviteAllThrottle = new Throttle(30, 24 * 3600000);
  // Povezave za potrditev in novo geslo v odgovoru (brez e-pošte) samo na računalniku, kjer teče strežnik, in nikoli
  // v produkciji: s skupnim geslom (EVKLID_GATE) bi jih sicer dobil vsak tester za tuj e-naslov in prevzel račun
  // (ponastavitev gesla) ali postal skrbnik (EVKLID_ADMIN_EMAILS), če Resend ne deluje (pregled #492 B, P2-4).
  const production = env.NODE_ENV === "production" || /^https:/i.test(env.EVKLID_BASE_URL || "");
  // Za naslove s seznama pilota ali skrbnikov nikoli (pregled #477 A): sicer bi kdorkoli za vstopnimi vrati
  // registriral tak naslov, ga sam »potrdil« in dobil mejo pilota oziroma inštruktorja brez meje.
  const devLinks = (req, email) => !mailer.enabled && !production && isLocalRequest(req) && !privilegedEmail(email);
  const locks = new ProfileLocks(db);
  // Geslo profila ločuje profile na istem računu (brat ne odpre sestrinega). Račun z enim profilom ga ne
  // potrebuje, prijava v račun zadošča (j, 2026-10-30: »nočem, da se ta zaslon prikazuje«).
  const profileLockOn = (p) => !p.is_guest && childIds(p.id).length > 1;
  const profileLocked = (p, studentId, deviceId) => profileLockOn(p) && locks.locked(studentId, deviceId);
  const accountLocks = new AccountLocks(db);
  // Zaklep računa: dejanja lastnika zahtevajo geslo računa. Privzeto izklopljen (j, 2026-10-30: geslo samo
  // enkrat); EVKLID_ACCOUNT_LOCK=1 ga vklopi. Izvoz in izbris računa geslo zahtevata vedno.
  const accountLockOn = opts.accountLock ?? env.EVKLID_ACCOUNT_LOCK === "1";
  const accountThrottle = new Throttle(10);
  // Račun brez gesla (prijava z Apple) ali gost: zaklepa ni, ker ni gesla za odklep.
  const lockable = (p) => accountLockOn && !p.is_guest && !String(p.password_hash || "").startsWith("none$");
  const reauthHooks = []; // potrditev izbrisa računa brez gesla (prijava z Apple)
  const profileThrottle = new Throttle(10);
  // Poskusi ugibanja z več naslovov IP: e-naslov 30 napačnih na uro, en naslov IP 100 na 15 minut,
  // profil (geslo ima lahko samo 4 znake) in račun 30 na uro ne glede na IP.
  const emailThrottle = new Throttle(30, 3600000);
  const ipThrottle = new Throttle(100, 15 * 60000);
  const acrossThrottle = new Throttle(30, 3600000);
  // Meja za ves račun (acct<id>: odklep, izvoz, geslo profila) velja eno uro; prijava z geslom računa napravo odklene.
  const ACCT_BLOCKED = "Preveč napačnih poskusov. Poskusi čez eno uro ali se odjavi in znova prijavi z geslom računa.";
  // Potrditev, da dejanje opravi imetnik računa (geslo računa ali nova prijava z Apple), ne kdo drug na napravi s
  // sejo (zaklep računa je privzeto izklopljen): obvestilo o zasebnosti, vprašanje o plačilu, izbris fotografij pilota.
  // Vrne true, false (napačno geslo) ali "throttled".
  // Isti števec kot izvoz in geslo profila (acct<id>), zato ne da dodatnih ugibanj (A4). Neuspeh se zabeleži pred
  // preverjanjem (vzporedne zahteve ne presežejo meje) in v dnevnik dostopov. Račun brez gesla (Apple) potrdi s
  // kodo, poslano na potrjeni e-naslov (POST /api/account/owner-code).
  const noPassword = (p) => String(p?.password_hash || "").startsWith("none$");
  const confirmOwner = async (req) => {
    const p = req.parent;
    if (!p || p.is_guest) return false;
    const key = `acct${p.id}`;
    if (acrossThrottle.blocked(key)) return "throttled";
    acrossThrottle.fail(key);
    let ok = false;
    if (noPassword(p)) {
      const code = String(req.body?.code || "").replace(/\D/g, "");
      const row = code.length === 6 ? db.prepare("SELECT code_hash, expires_at FROM owner_codes WHERE parent_id = ?").get(p.id) : null;
      if (row && row.expires_at > Date.now() && row.code_hash === sha256(`${p.id}:${code}`)) {
        db.prepare("DELETE FROM owner_codes WHERE parent_id = ?").run(p.id);
        ok = true;
      }
    } else ok = await verifyPassword(String(req.body?.password || ""), p.password_hash);
    if (!ok) for (const fn of reauthHooks) if (await fn(req, p)) ok = true;
    if (ok) acrossThrottle.reset?.(key);
    else audit(db, { req, parentId: p.id, action: "owner_confirm", ok: false });
    return ok;
  };
  const json = express.json({ limit: "100kb" });
  const log = opts.log || console;
  const promoCfg = opts.promo ?? promoConfig(env);
  const promo = createPromo(db, promoCfg);
  if (promoCfg.code) log.info?.(`[evklid] aktivacijska koda ${promoCfg.code}: porabljenih ${promo.used()}/${promoCfg.limit}, ${promoCfg.days} dni`);
  // Število profilov pri aktivacijski kodi je lastnost kode, ki jo je račun porabil.
  const accessOf = (p) => accessFor(p, Date.now(), p.promo_until ? promo.termsOf(p.id).seats : promoCfg.seats);
  let billing = null; // paketi pred testom, povezave za starše (mountBilling spodaj)
  let gifts = null; // darilne kode (mountGifts spodaj)
  let guarantee = null; // garancija »Boljša ocena ali vrnemo denar« (mountGuarantee spodaj)
  let podari = null; // »Podari Evklid« (mountPodari spodaj)

  const baseUrl = (req) => (env.EVKLID_BASE_URL || (req ? `${req.protocol}://${req.get("host")}` : `http://localhost:${env.PORT || 3000}`)).replace(/\/$/, "");

  // --- podatki ---
  const getParent = (id) => db.prepare("SELECT * FROM parents WHERE id = ?").get(id);
  const parentByEmail = (email) => db.prepare("SELECT * FROM parents WHERE email = ?").get(String(email).trim());
  const parentByCustomer = (cid) => cid && db.prepare("SELECT * FROM parents WHERE stripe_customer_id = ?").get(cid);
  const childIds = (parentId) => db.prepare("SELECT id FROM students WHERE parent_id = ? ORDER BY id").all(parentId).map((r) => r.id);
  const birthYear = (id) => db.prepare("SELECT birth_year FROM students WHERE id = ?").get(id)?.birth_year ?? null;
  const children = (parentId) => childIds(parentId).map((id) => ({ ...store.getStudent(id), birth_year: birthYear(id) }));
  const ownerOf = (studentId) => db.prepare("SELECT parent_id FROM students WHERE id = ?").get(studentId)?.parent_id;
  const update = (id, fields) => {
    const keys = Object.keys(fields);
    db.prepare(`UPDATE parents SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`).run(...keys.map((k) => fields[k]), id);
  };
  // Dostop, ki ga ima lahko nekdo drug kot lastnik e-naslova (prevzem pred registracijo, pregled #492): vse seje,
  // zaklep računa na napravah, žetoni potisnih obvestil (ime otroka na tujem telefonu), ključi razredov, ki jih je
  // dobil ob ustvarjanju razreda, in zasedenost profilov na napravah. Tabele drugih modulov morda ne obstajajo.
  // classKeys: false pri ponastavitvi gesla potrjenega računa – ključe razredov je dobil lastnik sam (učitelj na šolskem
  // računalniku bi sicer brez obvestila izgubil pregled razreda; pregled #492 A P2-4). Ob prevzemu (nepotrjen račun) da.
  function dropForeignAccess(parentId, { classKeys = true } = {}) {
    sessions.destroyAll(parentId);
    accountLocks.lockAll(parentId);
    const run = (sql, ...args) => {
      try {
        db.prepare(sql).run(...args);
      } catch (err) {
        if (!/no such table/.test(String(err.message))) throw err;
      }
    };
    run("DELETE FROM push_tokens WHERE parent_id = ?", parentId);
    run("DELETE FROM profile_devices WHERE student_id IN (SELECT id FROM students WHERE parent_id = ?)", parentId);
    if (!classKeys) return;
    try {
      for (const c of db.prepare("SELECT id FROM classes WHERE owner_parent_id = ? AND kind = 'class'").all(parentId))
        db.prepare("UPDATE classes SET teacher_key_hash = ? WHERE id = ?").run(sha256(randomToken()), c.id);
    } catch (err) {
      if (!/no such table|no such column/.test(String(err.message))) throw err;
    }
  }

  // Skrbnik po e-naslovu (EVKLID_ADMIN_EMAILS) šele po potrditvi e-naslova: sicer bi se kdorkoli registriral z njim.
  const isAdminEmail = (p) => !!p?.email_verified_at && adminEmails.includes(String(p.email).toLowerCase());

  // Imetnik računa, mlajši od 18 let (dijak, ki je račun ustvaril sam): sme imeti samo svoj profil.
  const isMinor = (p) => {
    const age = p?.birth_date ? ageOn(p.birth_date) : null;
    return age !== null && age < ADULT_AGE;
  };
  // Račun brez datuma rojstva (star račun, »Pozneje«): ne plača ničesar, dokler datuma ne vpiše (j 2026-11-06).
  const birthMissing = (p) => !!p && !p.is_guest && !p.birth_date;

  const publicParent = (p) => ({
    id: p.id,
    email: p.is_guest ? null : p.email,
    guest: !!p.is_guest,
    name: p.name,
    minor: isMinor(p),
    birth_year: p.birth_date ? Number(p.birth_date.slice(0, 4)) : null,
    // Star račun brez datuma rojstva: aplikacija ga ob prijavi enkrat vpraša (need_birth), pozneje v zavihku Račun.
    birth_missing: !p.is_guest && !p.birth_date,
    need_birth: !p.is_guest && !p.birth_date && !p.birth_asked_at,
    // Račun brez gesla (prijava z Apple): potrditev imetnika s kodo na e-pošto namesto gesla.
    has_password: !String(p.password_hash || "").startsWith("none$"),
    // Politika zasebnosti se je spremenila po registraciji: aplikacija enkrat pokaže kratko obvestilo s povezavo.
    privacy_notice: !p.is_guest && (p.privacy_seen || p.privacy_version || "") < PRIVACY_VERSION ? PRIVACY_VERSION : null,
    verified: !!p.email_verified_at,
    // Račun s prijavo z Apple nima gesla: splet za izvoz in izbris namesto gesla ponudi nastavitev gesla.
    has_password: !p.is_guest && !String(p.password_hash || "").startsWith("none$"),
    is_admin: !!p.is_admin || isAdminEmail(p),
    weekly_email: !!p.weekly_email,
    referral_code: p.referral_code,
    trial_ends_at: p.trial_ends_at,
    bonus_until: p.bonus_until,
    promo_until: p.promo_until,
    has_customer: !!p.stripe_customer_id,
    subscription: p.sub_status
      ? { status: p.sub_status, plan: p.sub_plan, seats: p.sub_seats, period_end: p.sub_period_end, cancel_at_period_end: !!p.sub_cancel_at_period_end }
      : null,
  });

  // Naročnina iz trgovine za en profil (j 2026-11-04): višja stopnja profila je odprta do konca obdobja, v katerem
  // jo je prvič dobil (zapis v store_level_grace ob prvem ogledu), nato samo stopnja izdelka in nižje. Stripe
  // ceno ob podaljšanju zamenja sam (billing.js levelChanges), trgovini pa ne, zato bi bila sicer odprta za vedno.
  function storeGrace(parent, plan, lvl) {
    if (rang(lvl) <= rang(plan.level) || !parent.sub_id) return null;
    db.prepare("INSERT OR IGNORE INTO store_level_grace (parent_id, sub_id, level, until) VALUES (?, ?, ?, ?)").run(parent.id, parent.sub_id, lvl, parent.sub_period_end || new Date().toISOString());
    const row = db.prepare("SELECT until FROM store_level_grace WHERE parent_id = ? AND sub_id = ? AND level = ?").get(parent.id, parent.sub_id, lvl);
    return Date.parse(String(row.until).replace(" ", "T")) > Date.now() ? lvl : null;
  }
  // Zapisi pilota v kv (pregled #477 A2, GDPR): ključ se konča z mesecem (UTC, obdobje meje pilota usage.monthStart).
  //   pilot_stopnja_p<račun>_<LLLL-MM>       zaklenjena stopnja računa (B2, C1)
  //   pilot_prej_<HMAC e-naslova>_<LLLL-MM>  poraba izbrisanih pilotnih računov istega naslova (B1)
  // Zapisi preteklih mesecev se brišejo ob zagonu in v opravilu na 30 min (purgePilotKv), po koncu pilota vsi.
  const monthKey = () => new Date().toISOString().slice(0, 7);
  const levelKeyPrefix = (parentId) => `pilot_stopnja_p${parentId}_`;
  // Zaklep pilotnega RAČUNA v tem mesecu (pregled #477 B2/C1, potrdil j 2026-11-06 19:5x): { level, family }.
  // Zaklep nastopi ob PRVI porabi AI v mesecu (j 2026-11-10), ne ob pogledu: dokler račun ta mesec ni porabil AI,
  // velja sprotna stopnja (učenec jo lahko še zamenja) in nič se ne zapiše. Zapiše se ob prvi rezervaciji klica AI
  // (usage.js onUse → commit), ob že zapisani porabi v tem mesecu ali ob podedovanem zaklepu izbrisanega računa.
  // level = najvišja stopnja profilov ob prvi porabi AI v mesecu; family = ali je imel račun takrat več profilov
  // (uporabi se samo pri PILOT_LOCK_PROFILES, A3-2). Menjava stopnje, izbris profila in nov profil višje stopnje sredi
  // meseca meje in stopenj ne dvignejo (profil dobi največ to stopnjo); naslednji mesec velja nova. Nov račun z istim
  // naslovom v istem mesecu podeduje zaklep izbrisanega računa (zapis pilot_prej_*, pregled #477 A3-1).
  const parseLock = (v) => {
    if (!v) return null;
    try {
      const o = JSON.parse(v);
      if (o && typeof o === "object" && STOPNJE.includes(o.level)) return { level: o.level, family: !!o.family };
    } catch {}
    return STOPNJE.includes(v) ? { level: v, family: false } : null; // stari zapis: samo stopnja
  };
  // Ali je račun ta mesec (UTC, kot monthKey) že porabil AI (zapis v usage, tudi prekinjen klic ali rezerva).
  const usedAiThisMonth = (parentId) =>
    !!db.prepare("SELECT 1 FROM usage WHERE parent_id = ? AND cost_usd > 0 AND created_at >= datetime('now','start of month') LIMIT 1").get(parentId);
  function pilotLock(parentId, { commit = false } = {}) {
    const key = `${levelKeyPrefix(parentId)}${monthKey()}`;
    const saved = parseLock(kv.get(key));
    if (saved) return saved;
    const ids = childIds(parentId);
    const levels = ids.map((id) => stopnja(store.getStudent(id)?.settings));
    const top = levels.reduce((t, l) => (rang(l) > rang(t) ? l : t), levels[0] || "OS");
    const prior = pilotPrior(getParent(parentId)); // izbrisan račun z istim naslovom ta mesec
    const lock = prior?.level ? { level: prior.level, family: !!prior.family } : { level: top, family: ids.length > 1 };
    // Pred prvo porabo AI v mesecu: sprotna stopnja, brez zapisa (j 2026-11-10).
    if (!commit && !prior && !usedAiThisMonth(parentId)) return lock;
    db.prepare("INSERT OR IGNORE INTO kv (key, value) VALUES (?, ?)").run(key, JSON.stringify(lock));
    return parseLock(kv.get(key)) || lock;
  }
  const pilotLevel = (parentId) => pilotLock(parentId).level;
  // Ob izbrisu računa (pregled #477 A2): ponovno uporabljen id računa ne podeduje zaklenjene stopnje.
  const clearPilotLevels = (parentId) => db.prepare("DELETE FROM kv WHERE substr(key, 1, length(?)) = ?").run(levelKeyPrefix(parentId), levelKeyPrefix(parentId));
  // Pilot po e-naslovu (pregled #477 B1): izbris računa in nov račun z istim naslovom meje ne ponastavita. Ob izbrisu
  // pilotnega računa (sprožilec v schema.js porabi odvzame parent_id) se poraba računa v tem mesecu zapiše pod HMAC
  // e-naslova s strežniško skrivnostjo (crypto-polje.js auditSecret; brez skrivnosti iz seznama pilota ni razrešljiv)
  // in se prišteje vsem pilotnim profilom novega računa z istim naslovom (usage.js priorSpentOf). Hramba: do konca
  // meseca (purgePilotKv), docs/stroski-ai.md, public/zasebnost.html.
  const pilotSecret = auditSecret(db);
  const pilotKey = (email, month = monthKey()) =>
    `pilot_prej_${createHmac("sha256", pilotSecret).update(`pilot:${String(email || "").trim().toLowerCase()}`).digest("hex")}_${month}`;
  // Zapis izbrisanih pilotnih računov istega naslova v tem mesecu: { usd, level, family } (stari zapis: samo znesek).
  function pilotPrior(p) {
    const v = p?.email ? kv.get(pilotKey(p.email)) : null;
    if (!v) return null;
    try {
      const o = JSON.parse(v);
      if (o && typeof o === "object") return { usd: Number(o.usd) || 0, level: STOPNJE.includes(o.level) ? o.level : null, family: !!o.family };
      return { usd: Number(o) || 0, level: null, family: false };
    } catch {
      return null;
    }
  }
  function pilotPriorSpent(studentId) {
    const owner = ownerOf(studentId);
    const p = owner ? getParent(owner) : null;
    if (!p || !isPilotParent(p) || rightsFor(studentId).personalTier !== "pilot") return 0;
    return pilotPrior(p)?.usd || 0;
  }
  function recordPilotDeletion(p) {
    if (!isPilotParent(p)) return;
    const since = db.prepare("SELECT datetime('now','start of month') AS d").get().d;
    const usd = db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE parent_id = ? AND created_at >= ?").get(p.id, since).s;
    const lock = parseLock(kv.get(`${levelKeyPrefix(p.id)}${monthKey()}`));
    if (!(usd > 0) && !lock) return;
    const prev = pilotPrior(p);
    // Zaklep: prvi v mesecu velja (prejšnji izbrisani račun ima prednost, ker ga je novi račun že podedoval).
    const keep = prev?.level ? prev : lock || prev || {};
    kv.set(pilotKey(p.email), JSON.stringify({ usd: (prev?.usd || 0) + usd, level: keep.level || null, family: !!keep.family }));
  }
  // Brisanje zapisov pilota: preteklih mesecev vedno, po koncu pilota vseh.
  function purgePilotKv(now = Date.now()) {
    const like = "(key LIKE 'pilot\\_prej\\_%' ESCAPE '\\' OR key LIKE 'pilot\\_stopnja\\_%' ESCAPE '\\')";
    if (now >= pilotEndMs()) return db.prepare(`DELETE FROM kv WHERE ${like}`).run().changes;
    return db.prepare(`DELETE FROM kv WHERE ${like} AND substr(key, -7) <> ?`).run(new Date(now).toISOString().slice(0, 7)).changes;
  }
  try {
    purgePilotKv(); // ob zagonu
  } catch (e) {
    log.error?.("[evklid] brisanje zapisov pilota:", e.message);
  }
  // Račun pilota ali lastnika (pregled #477 B3 P1-1): "pilot", "owner" ali null. Ta računa ne vidita ponudb za nakup
  // (naročnina, dokup, paket pred testom) in strežnik nakupa ne sprejme; zavihek Račun pokaže pilot (accountView).
  const specialOf = (p) => {
    if (!p || p.is_guest) return null;
    if (isOwnerParent(p)) return "owner";
    return isPilotParent(p) && (accessOf(p).tier !== "paid" || unpaidTier(p)) ? "pilot" : null;
  };
  // Koliko profilov sme imeti račun: po paketu (preizkus 2, brezplačno 1, družina do MAX_CHILDREN); član pilota med
  // pilotom PILOT_PROFILES (j 2026-11-06 18:3x), a ne manj kot paket. Po pilotu obstoječi profili ostanejo.
  const profileSeats = (p) => {
    const plan = Math.min(MAX_CHILDREN, accessOf(p).seats || 1);
    return isPilotParent(p) ? Math.max(plan, Math.min(MAX_CHILDREN, PILOT_PROFILES)) : plan;
  };
  // Osebni paket (»Evklid Osebno«): naročnina, preizkus, koda, bonus ali paket pred testom. Vrne { tier, until } ali null.
  function personalOf(studentId) {
    const parentId = ownerOf(studentId);
    if (!parentId) return { tier: "legacy", until: null }; // stari podatki brez starša
    const parent = getParent(parentId);
    const access = accessOf(parent);
    // Lastnik (j 2026-11-06, server/accounts/pilot-meja.js): vsi profili imajo poln paket, inštruktor brez meje
    // (aiUnlimited spodaj). Član pilota: do konca pilota VSI profili računa (j 2026-11-06 17:0x) kot plačan paket
    // svoje stopnje (več profilov: Družina s skupnim deležem, j 19:0x), brezplačno; stopnja je zaklenjena na račun in
    // mesec (pilotLevel, pregled #477 B2/C1), kot pri plačanem paketu. Prava plačana naročnina ostane naročnina (Stripe v preizkusni dobi še
    // ni plačilo, zato tam velja pilot).
    if (isOwnerParent(parent)) return { tier: "owner", until: null, level: null };
    if (isPilotParent(parent) && (access.tier !== "paid" || unpaidTier(parent))) {
      return { tier: "pilot", until: new Date(pilotEndMs()).toISOString(), level: pilotLevel(parentId) };
    }
    // level: najvišja stopnja paketa (null = vse); grace: profil za en sedež, ki je prešel na višjo stopnjo,
    // jo ima odprto do naslednjega podaljšanja (tedaj velja nova cena, billing.js levelChanges).
    const own = { tier: access.tier, until: access.until, level: access.level ?? null };
    const plan = access.tier === "paid" ? planByKey(parent.sub_plan) : null;
    if (plan && !plan.family && plan.seats === 1 && planLevel(plan)) {
      const lvl = stopnja(store.getStudent(studentId)?.settings);
      own.grace = (parent.sub_provider || "stripe") === "stripe" ? lvl : storeGrace(parent, plan, lvl);
    }
    // Osebno ob šolski licenci: mesto dobi najprej otrok s šolsko licenco (sicer najstarejši profil).
    if (access.tier === "paid" && isSchoolPlan(parent.sub_plan)) {
      const ids = childIds(parentId);
      const order = [...ids.filter((id) => schools.hasLicence(id)), ...ids.filter((id) => !schools.hasLicence(id))];
      if (order.slice(0, access.seats).includes(studentId)) return own;
    } else if (isPremiumChild(access, childIds(parentId), studentId)) return own;
    if (billing?.passPremium(studentId)) {
      const pass = billing.passes.activeFor(studentId);
      return { tier: "pass", until: pass?.ends_at || null, level: passLevel(pass) };
    }
    return null;
  }
  const schools = createSchoolSource(db, { source: opts.schoolSource, personalOf: (id) => !!personalOf(id) });

  // Vse pravice učenca iz vseh virov (server/placila/pravice.js): osebni paket in šolska licenca se seštejeta.
  const levelOf = (studentId) => stopnja(store.getStudent(studentId)?.settings);
  const rightsFor = (studentId) =>
    rightsOf({ personal: personalOf(studentId), schools: schools.forStudent(studentId), freeDaily: freeDailyQuestions(), ownLevel: levelOf(studentId) });

  // Poln dostop iz katerega koli vira (osebni paket ali šolska licenca).
  function premiumFor(studentId) {
    const r = rightsFor(studentId);
    return r.personal || r.school;
  }

  // Plačan AI iz katerega koli vira; šola, ki je porabila mesečno mejo AI, za AI šteje kot brezplačni paket.
  function aiPremiumFor(studentId) {
    const r = rightsFor(studentId);
    return r.personal || (r.school && !r.schoolAiOut);
  }

  // Utež profila pri delitvi mesečnega proračuna AI (server/proracun.js): plačljiva naročnina po mesečni
  // ceni na otroka v €, preizkus/koda/bonus/paket kot mesečna naročnina za enega otroka, šola in brezplačni po SHARE.
  function shareWeightFor(studentId) {
    const r = rightsFor(studentId);
    const standard = monthlyAmount(1, "EUR", r.useLevel) / 100;
    if (r.personal) {
      if (r.personalTier !== "paid") return standard;
      const p = getParent(ownerOf(studentId));
      const plan = p?.sub_plan && planByKey(p.sub_plan);
      if (!plan || plan.currency && plan.currency !== "EUR") return standard;
      return plan.amount / 100 / (plan.interval === "year" ? 12 : 1) / Math.max(1, plan.seats || 1);
    }
    return r.school && !r.schoolAiOut ? SHARE.school() : SHARE.free();
  }
  // Dokupljena poraba AI, vezana na račun (server/placila/krediti.js).
  const credits = new Credits(db);
  // Brezplačni profil nad mejo paketa: s kreditom nadaljuje, strošek gre iz kredita (server/usage.js chargeCredit).
  const freeOver = (studentId) => !aiPremiumFor(studentId) && !!freeBudgetReason(studentId);
  // Zajamčena poraba AI na mesec (j 2026-11-04, plans.js planGuarantee): naročnina po paketu (stopnja in obdobje,
  // Družina en skupen delež za ves račun, šolska cena, regijska cena po pravilu 75 %), darilna koda kot letna
  // naročnina stopnje; ima prednost pred deleži brezplačnih v skupnem proračunu, nad njo hitri model (server/usage.js).
  function subGuarantee(studentId) {
    const r = rightsFor(studentId);
    if (!r.personal) return null;
    const owner = ownerOf(studentId);
    if (r.personalTier === "gift") return giftGuarantee(getParent(owner)?.gift_level, r.useLevel);
    // Pilot (j 2026-11-06 19:0x): en profil = meja plačanega paketa stopnje (levelGuarantee); več profilov = meja
    // ustrezne Družine s skupnim deležem (familyPlanFor po zaklenjeni stopnji računa, planGuarantee, pool), tako kot
    // plačujoča družina. Lastnik je brez meje (aiUnlimited).
    if (r.personalTier === "pilot") {
      const n = childIds(owner).length;
      // A3-2 (PILOT_LOCK_PROFILES): oblika meje iz zaklepa ob začetku meseca, sicer sproti po številu profilov.
      const family = PILOT_LOCK_PROFILES ? pilotLock(owner).family : n > 1;
      if (!family) {
        if (n < 2) return levelGuarantee(r.useLevel);
        // Zaklenjen en profil, zdaj jih je več: delijo si mejo enega paketa zaklenjene stopnje (ne vsak svoje), z enim
        // brezplačnim repom (total), kot en profil.
        const one = levelGuarantee(r.openLevel);
        return { ...one, pool: true, total: one.usd + freeStudentMonthlyUsd(), profiles: 1 };
      }
      const fam = familyPlanFor(r.openLevel === "FAKS", "month");
      return fam ? { ...planGuarantee(fam), pool: true } : levelGuarantee(r.useLevel);
    }
    if (NOPAY_USD[r.personalTier]) return nopayGuarantee(r.personalTier, owner);
    if (r.personalTier !== "paid") return null;
    // Naročnina v preizkusni dobi pri Stripu (trialing): plačila še ni bilo, zato do prvega plačanega računa velja meja
    // paketa, ki dejansko teče (preizkus, koda, darilo ali bonus), ne meja plačanega paketa (pregled #462, KRITIČNO).
    const under = unpaidTier(getParent(owner));
    if (under === "gift") return giftGuarantee(getParent(owner)?.gift_level, r.useLevel);
    if (under) return nopayGuarantee(under, owner);
    // DDV po državi kupca (j 2026-11-06 12:53); neznana: najvišja na trgu paketa.
    const country = getParent(owner)?.country;
    const subPlan = planByKey(getParent(owner)?.sub_plan);
    const vat = country ? (!subPlan?.currency || subPlan.currency === "EUR" ? eurVatFor(country) : vatRateFor(country)) : undefined;
    const g = (subPlan && planGuarantee(subPlan, vat)) || levelGuarantee(r.useLevel);
    // Nadgradnja ta mesec (applySubscription): stari paket za pretekle dni, novi za preostale (plans.js upgradeMonthUsd).
    // Zapis velja samo za isto naročnino (id računa se po izbrisu lahko ponovno uporabi, nova naročnina začne znova).
    const up = JSON.parse(kv.get(`ai_upgrade_${owner}`) || "null");
    const was = up && up.sub && up.sub === getParent(owner)?.sub_id ? (up.usd ?? planGuarantee(planByKey(up.from))?.usd) : null;
    // Mešanje po oknu meje (obdobje naročnine), ne po koledarskem mesecu (pregled #462 L1).
    const win = paidWindow(getParent(owner));
    const usd = was != null ? upgradeMonthUsd(was || 0, g.usd || 0, up.at, Date.now(), win) : g.usd;
    const out = usd !== g.usd ? { ...g, usd, total: Math.min(g.total ?? Infinity, usd + freeStudentMonthlyUsd() * (g.profiles || 1)) } : g;
    return paidCap(out, owner, win);
  }
  // Meja plačanega paketa stopnje (naročnina z neznanim paketom in pilot): zajamčeni AI stopnje brez brezplačnega repa.
  function levelGuarantee(level) {
    return { usd: subscriptionCeiling(guaranteeUsd(level)), pool: false };
  }
  // Lastnik (server/accounts/pilot-meja.js): inštruktor brez meje, poraba se še vedno zapiše.
  const aiUnlimited = (studentId) => {
    const owner = ownerOf(studentId);
    return !!owner && isOwnerParent(getParent(owner));
  };
  // Skupina za poročilo marže (server/advice.js): "owner", "pilot" ali null (plačniki in brezplačni).
  const marginGroupOf = (studentId) => {
    if (aiUnlimited(studentId)) return "owner";
    return rightsFor(studentId).personalTier === "pilot" ? "pilot" : null;
  };
  // Okno meje plačane naročnine { start, end } (ms) ali null. Sidrano na konec obdobja; neuspelo plačilo (past_due)
  // ne odpre novega okna. Preklop mesečno ↔ letno (portal Stripe) premakne konec obdobja in bi odprl novo okno brez
  // novega denarja (pregled #462 L2): okno iste naročnine se zato ne zamenja, dokler od začetka prejšnjega ni minil
  // mesec (ai_window_<račun>); takrat se začne novo okno ob preteku meseca.
  function paidWindow(p, now = Date.now()) {
    if (!p) return null;
    const failed = p.sub_status === "past_due" && Date.parse(p.past_due_since || "");
    const iso = monthWindowStart(p.sub_period_end, failed ? failed - DAY : now);
    if (!iso) return null;
    let start = Date.parse(iso);
    if (p.sub_id) {
      const key = `ai_window_${p.id}`;
      const prev = JSON.parse(kv.get(key) || "null");
      if (prev && prev.sub === p.sub_id && start !== prev.start) {
        const next = addMonthsUtc(prev.start, 1);
        if (start < next) start = now < next ? prev.start : next;
      }
      if (!prev || prev.sub !== p.sub_id || prev.start !== start) kv.set(key, JSON.stringify({ sub: p.sub_id, start }));
      // Obnovitev (ali konec preizkusa) pred invoice.paid: Stripe premakne konec obdobja takoj, račun pa je plačan šele
      // čez uro (SEPA dneve, ali nikoli). Dokler za novo okno ni plačila, velja zadnje plačano okno (pregled #462
      // H1/K3-1); naročnine brez kakršnega koli zapisa (pred to spremembo) ostanejo na ceniku.
      if (paidPeriods.has(p.id, p.sub_id) && !paidPeriods.eurIn(p.id, p.sub_id, start, addMonthsUtc(start, 1)).rows) {
        const last = paidPeriods.lastEnd(p.id, p.sub_id);
        if (last > 0 && last <= start) {
          for (let k = 0; k < 24 && start >= last; k++) start = addMonthsUtc(start, -1);
        }
      }
    }
    return { start, end: addMonthsUtc(start, 1) };
  }
  // Meja iz dejanskega plačila obdobja (j 2026-11-06 12:53, pregled #462 A2): promocijske kode Stripa, proracije in
  // vračila znižajo plačilo, zato meja ni nikoli nad 25 % tega, kar je kupec za to okno res plačal brez DDV
  // (server/placila/placano.js). Brez zapisa za okno (naročnina pred to spremembo, obnovitev še ni plačana): cenik.
  // Okno, plačano z 0 € (popust 100 %): kot aktivacijska koda (meja brez plačila in skupni bazen).
  function paidCap(g, owner, win) {
    const p = getParent(owner);
    if (!g || !p?.sub_id || !win) return g;
    const m = paidPeriods.eurIn(owner, p.sub_id, win.start, win.end);
    if (!m.rows) return g;
    if (!(m.eur > 0.005)) return nopayGuarantee("promo", owner);
    const max = aiCapFromNetEur(m.eur);
    if ((g.total ?? Infinity) <= max) return g;
    return { ...g, total: max, usd: Math.min(g.usd || 0, subscriptionCeiling(max, g.profiles || 1)), paidEur: m.eur };
  }
  // Brez plačila (j 2026-11-06: trda meja AI): preizkus, aktivacijska koda, bonus in stari profili brez računa imajo nizko
  // stalno mejo za ves račun (server/meje-ai.js NOPAY_USD). Brezplačni rep je ZNOTRAJ te meje (total), tudi pri več
  // sedežih (pregled #462: 3 sedeži so dali 0,001 $ + 3 × 0,2 $ namesto 0,5 $).
  function nopayGuarantee(tier, owner) {
    const n = owner ? Math.max(1, accessOf(getParent(owner)).seats || 1) : 1;
    const total = NOPAY_USD[tier]();
    return { usd: subscriptionCeiling(total, n), total, profiles: n, pool: !!owner, nopay: tier };
  }
  // Paket, ki teče pod naročnino v preizkusni dobi (trialing, še brez plačanega računa): promo, trial, gift ali bonus.
  // Preizkus pri Stripu brez drugega paketa (npr. potekel) šteje kot preizkus. null = naročnina je plačana.
  function unpaidTier(parent) {
    if (parent?.sub_status !== "trialing") return null;
    const t = accessFor({ ...parent, sub_status: null }).tier;
    return t === "free" ? "trial" : t;
  }
  // Obdobje meje AI (pregled #462, VISOKO): meja velja za plačano obdobje, ne za koledarski mesec (sicer naročnina,
  // sklenjena 28., dobi dve meji za eno plačilo). Naročnina, darilo in koda: mesečna okna, sidrana na konec obdobja
  // (letni paket: 12 mesečnih oken); preizkus in bonus: ves paket eno okno. Neuspelo plačilo (past_due): Stripe že
  // premakne konec obdobja, a novo okno se ne odpre (okno ob prvem neuspelem plačilu velja do plačila).
  const DAY = 86400000;
  function addMonthsUtc(t, k) {
    const d = new Date(t);
    const day = d.getUTCDate();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + k);
    const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(day, last));
    return d.getTime();
  }
  // Začetek mesečnega okna, sidranega na endIso, ki vsebuje »now« (po koncu: zadnje okno, nikoli novo).
  function monthWindowStart(endIso, now = Date.now()) {
    const end = Date.parse(endIso || "");
    if (!Number.isFinite(end)) return null;
    for (let k = 1; k <= 240; k++) {
      const start = addMonthsUtc(end, -k);
      if (start <= now) return new Date(start).toISOString();
    }
    return null;
  }
  function aiPeriodStart(studentId) {
    const r = rightsFor(studentId);
    if (!r.personal) return null;
    const p = getParent(ownerOf(studentId));
    if (!p) return null;
    const tier = r.personalTier === "paid" ? unpaidTier(p) || "paid" : r.personalTier;
    const future = (iso) => Date.parse(iso || "") > Date.now();
    switch (tier) {
      case "paid": {
        const w = paidWindow(p);
        return w ? new Date(w.start).toISOString() : null;
      }
      case "gift":
        return monthWindowStart(p.gift_until);
      case "promo":
        return monthWindowStart(p.promo_until);
      case "trial":
        return future(p.trial_ends_at) ? new Date(Date.parse(p.trial_ends_at) - TRIAL_DAYS * DAY).toISOString() : monthWindowStart(p.sub_period_end);
      case "bonus":
        return future(p.bonus_until) ? new Date(Date.parse(p.bonus_until) - REFERRAL_DAYS * DAY).toISOString() : null;
      default:
        return null;
    }
  }
  // Vrednost paketa (meja + brezplačni rep) v $: trda meja (server/usage.js capsFor), največ to.
  const guaranteeTotalFor = (studentId) => subGuarantee(studentId)?.total ?? null;
  // Meja paketa (brez brezplačnega repa, plans.js subscriptionCeiling); naročnik z mejo 0 ostane zajamčen (MIN_CEILING_USD).
  const guaranteeFor = (studentId) => {
    const g = subGuarantee(studentId);
    return g ? Math.max(g.usd || 0, MIN_CEILING_USD) : 0;
  };
  // Profili s skupnim deležem: profili s sedežem pri družinskem paketu (isPremiumChild), sicer null.
  function poolFor(studentId) {
    if (!subGuarantee(studentId)?.pool) return null;
    const owner = ownerOf(studentId);
    const access = accessOf(getParent(owner));
    // Pilot: vsi profili računa (največ MAX_CHILDREN) v skupnem deležu Družine.
    const seats = rightsFor(studentId).personalTier === "pilot" ? MAX_CHILDREN : access.seats || 1;
    const ids = [...childIds(owner)].sort((a, b) => a - b).slice(0, seats);
    return ids.includes(studentId) ? ids : null;
  }
  // Trda meja AI (j 2026-11-06, server/meje-ai.js): meje profila brez zajamčenega paketa za server/usage.js hold.
  // Paket pred testom: meja paketa (25 % plačila); šola: mesečna meja licence (25 % plačila); brezplačni paket in
  // gost: meja na profil (omrežje) in skupna meja vseh brezplačnih; s kreditom brezplačni profil plača iz kredita.
  function capsOf(studentId) {
    const owner = ownerOf(studentId);
    if (!owner) return [];
    const r = rightsFor(studentId);
    const credit = credits.balance(owner) || 0;
    // Kredit računa si delijo vsi profili: kdor ga sme uporabiti, ima tudi skupni ključ credit:<račun>, da hkratni
    // klici dveh profilov kredita ne presežejo (pregled #462).
    const creditCap = (room) => ({ key: `credit:${owner}`, usd: credit + Math.max(0, room), spent: 0, code: "block.freeMonth" });
    if (r.personal) {
      if (r.personalTier !== "pass") {
        // Zajamčeni paketi: meja v server/usage.js capsFor. Brez plačila (preizkus, koda, bonus, tudi pod naročnino v
        // preizkusni dobi): še skupni bazen vseh takih računov (pregled #462: vsak nov e-naslov dobi preizkus).
        const out = [];
        if (subGuarantee(studentId)?.nopay) {
          const pool = { key: "nopaypool", usd: nopayPoolUsd(), spent: nopayPoolSpent(), code: "block.freePool" };
          // Izčrpan bazen (pregled #462 L4): profil ni zaklenjen, nadaljuje z mejami brezplačnega paketa; poraba nad
          // bazenom šteje v skupno mejo brezplačnih (freeCaps over), da bazen ne zraste brez meje.
          if (aiUsage.headroom(studentId, [pool]) >= aiUsage.minCallUsd()) out.push(pool);
          else out.push(...freeCaps(studentId, owner, Math.max(0, pool.spent - pool.usd)));
        }
        // S kreditom še skupni ključ kredita (kredit + preostanek paketa).
        const sb = credit > 0 ? aiUsage.studentBudget(studentId) : null;
        if (sb?.guaranteed) {
          const n = sb.group?.length || 1;
          out.push(creditCap(Math.min(sb.ceiling + freeStudentMonthlyUsd() * n, guaranteeTotalFor(studentId) ?? Infinity) - sb.spent));
        }
        return out;
      }
      // Paket pred testom: meja paketa brez kredita (kredit se porabi šele v brezplačnem paketu po koncu paketa),
      // poraba brez dela iz kredita (Passes.spentUsd).
      const p = billing?.passes.activeFor(studentId);
      return p ? [{ key: `pass:${p.id}`, usd: passCapUsd(p), spent: billing.passes.spentUsd(p), code: "block.passOut" }] : [];
    }
    if (r.school && !r.schoolAiOut) {
      const s = r.schools.find((x) => x.ai_month_usd > 0 && (x.ai_spent_usd || 0) < x.ai_month_usd);
      if (s) {
        const cap = { key: `school:${s.school_id}`, usd: s.ai_month_usd, spent: s.ai_spent_usd || 0, code: "block.monthLimit" };
        // Šola brez prostora za najcenejši klic velja kot porabljena: profil nadaljuje v brezplačnem paketu.
        if (aiUsage.headroom(studentId, [cap]) >= aiUsage.minCallUsd()) return [cap];
      }
    }
    if (credit > 0) return [{ key: `credit:${owner}`, usd: credit, spent: 0, code: "block.freeMonth" }];
    return freeCaps(studentId, owner);
  }
  function freeCaps(studentId, owner = ownerOf(studentId), over = 0) {
    const caps = [];
    const scope = quotaScope(studentId);
    const per = freeStudentMonthlyUsd();
    if (per) caps.push({ key: scope.net ? `net:${scope.net}` : `s:${studentId}`, usd: per, spent: freeSpent(studentId, owner, scope), code: "block.freeMonth" });
    const pool = freeMonthlyPoolUsd();
    if (pool) caps.push({ key: "freepool", usd: pool, spent: freePoolSpent() + over, code: "block.freePool" });
    return caps;
  }
  // Besedilo zavrnitve: preizkus in bonus → poziv k naročnini (ne »spet jih dobiš«); brezplačni paket z namigom.
  function aiBlockFor(studentId, code) {
    const g = subGuarantee(studentId);
    if (/^block\.freeTail(Topup|Birth)?$/.test(code) && (g?.nopay === "trial" || g?.nopay === "bonus")) code = "block.trialOut";
    if (code === "block.freeMonth" || code === "block.freePool") return freeBlock(studentId, code);
    return { error: BLOCK_TEXT[code], code };
  }
  // Paket pred testom: poraba nad mejo paketa (brez dela iz kredita), ki jo plača kredit; null brez paketa.
  function passCreditOver(studentId) {
    const r = rightsFor(studentId);
    if (!r.personal || r.personalTier !== "pass") return null;
    const p = billing?.passes.activeFor(studentId);
    return p ? billing.passes.spentUsd(p) - passCapUsd(p) : null;
  }
  aiUsage.configure({ blockFor: aiBlockFor, creditOverOf: passCreditOver });
  // Zapis porabe: predpomnilnika (šola, bazena) in knjiga šole – poraba, ki je šla pod mejo šole, ostane v šoli tudi,
  // ko učenec razred zapusti (pregled #462 H7). Šola, katere meja velja (capsOf), je prva z mejo.
  // Prvi klic AI profila pilota v mesecu zaklene stopnjo računa za ta mesec (j 2026-11-10, usage.js hold.take).
  function pilotOnUse(studentId) {
    const owner = ownerOf(studentId);
    if (owner && rightsFor(studentId).personalTier === "pilot") pilotLock(owner, { commit: true });
  }
  // Pred menjavo stopnje profila (PUT /api/students/:id, app.js): če je račun ta mesec že porabil AI brez rezervacije
  // (zaklepa še ni), se zaklene sedanja stopnja, ne nova (pregled #545).
  function pilotBeforeLevelChange(studentId) {
    const owner = ownerOf(studentId);
    if (owner && rightsFor(studentId).personalTier === "pilot") pilotLevel(owner);
  }
  function schoolOnLog(studentId, cost) {
    poolMemo.clear();
    try {
      if (studentId != null && cost > 0) {
        schools.clearCache();
        const r = rightsFor(studentId);
        // Ali je šola imela prostor PRED tem zapisom (poraba sedanjih učencev že vsebuje ta strošek).
        const s = !r.personal && r.school ? r.schools.find((x) => x.ai_month_usd > 0 && (x.ai_spent_usd || 0) - cost < x.ai_month_usd) : null;
        if (s) schools.recordUse(s.school_id, studentId, cost);
      }
    } finally {
      schools.clearCache();
    }
  }
  aiUsage.configure({ weightOf: shareWeightFor, ownerOf, credits, freeOver, guaranteeOf: guaranteeFor, totalOf: guaranteeTotalFor, periodOf: aiPeriodStart, poolOf: poolFor, capsOf, unlimitedOf: aiUnlimited, priorSpentOf: pilotPriorSpent, pilotOf: (id) => rightsFor(id).personalTier === "pilot", onLog: schoolOnLog, onUse: pilotOnUse });

  // Dnevna meja vprašanj plačljivega ali šolskega profila: stalna meja iz pravic (Osebno 60 + šola 15) je
  // spodnja meja, s proračunom AI zraste (server/usage.js dailyLimit). Kredit računa se deli med otroke.
  // null = brez meje (stari profili, meja 0 v nastavitvah). Mesečni delež še vedno omeji usage.blockReason.
  const dailyLimitFor = (studentId, r = rightsFor(studentId)) => {
    if (r.dailyQuestions === null || aiUnlimited(studentId)) return null;
    // Nad trdo mesečno mejo naročnine (zajamčeni AI paketa: podrobni del in hitri način, plans.js FAST_TAIL): kot brezplačni paket.
    if (aiUsage.overCeiling(studentId)) return freeDailyQuestions();
    const owner = ownerOf(studentId);
    const credit = owner ? credits.balance(owner) / Math.max(1, childIds(owner).length) : 0;
    return Math.max(r.dailyQuestions, aiUsage.dailyLimit(studentId, { credit }) ?? 0);
  };

  // Interaktivni del lekcije: Osebno za vse teme, šolska licenca za svoje predmete in razrede.
  const lessonInteractive = (studentId, topicId) => lessonOpen(rightsFor(studentId), topicId);

  // Lestev »Razloži podrobneje«: opus = ali sme do Opusa (ob 3. zaporedni prošnji), promo = skrita meja Opusa
  // aktivacijske kode (usage.promoOpusSpent). Šolska licenca brez osebnega paketa: največ Sonnet.
  function ladderFor(studentId) {
    const r = rightsFor(studentId);
    // Skrita meja velja le za kodo z omejenim modelom (EVKLID_PROMO_MODEL=opus je brez nje, kot doslej).
    return { opus: r.maxModel === "opus", promo: r.personalTier === "promo" && !!promo.termsOf(ownerOf(studentId)).maxModel };
  }

  // Najzmogljivejši dovoljeni model za učenca (za klice zunaj lestve, npr. fotografija urnika): pri dostopu
  // iz aktivacijske kode model kode (EVKLID3X: »sonnet« namesto Opusa), pri samo šolski licenci »sonnet«,
  // sicer null (brez omejitve; brezplačni paket omeji usage.chooseMode).
  function modelCapFor(studentId) {
    const r = rightsFor(studentId);
    if (r.personalTier === "promo") return promo.termsOf(ownerOf(studentId)).maxModel;
    return !r.personal && r.school && !r.schoolAiOut ? "sonnet" : null;
  }

  // Poraba AI brezplačnih učencev v tem mesecu (učenci brez naročnine, preizkusa, bonusa ali kode).
  // Varnostni pregledi (server/nujno.js) plača aplikacija, zato ne jemljejo brezplačnega bazena.
  const monthUsdByStudent = () =>
    db.prepare("SELECT student_id AS id, COALESCE(SUM(cost_usd),0) AS usd FROM usage WHERE created_at >= date('now','start of month') AND kind != 'varnost' GROUP BY student_id").all();
  // Gostje: kvota velja za omrežje (vsi gostje z istega omrežja skupaj, tudi izbrisani), ne za profil.
  const quotaScope = (studentId) => {
    const net = guests.netOf(studentId);
    return net ? { ids: guests.idsOnNet(net), net } : { ids: [studentId], net: null };
  };
  // Pravila ponudb (server/placila/ponudbe.js): ne med poukom, ne, če jih je učitelj izklopil, pod 15 let brez cene.
  // Starost: ob letu rojstva vzamemo mlajšo možnost (rojen 2011 je leta 2026 »14«), neznana velja kot pod 15.
  const schedules = new Schedules(db);
  function ageOfStudent(studentId, now = new Date()) {
    const year = birthYear(studentId);
    // Lasten profil imetnika (dijak ali študent): letnica je iz njegovega datuma rojstva, zato velja točna starost.
    const own = getParent(ownerOf(studentId))?.birth_date;
    return own && Number(own.slice(0, 4)) === year ? ageOn(own, now) : year ? Number(nowParts(now).date.slice(0, 4)) - year - 1 : null;
  }
  function offersFor(studentId, now = new Date()) {
    // Pilot in lastnik (pregled #477 B7): brez ponudb (paket pred testom, naročnina, dokup) – pilot ima mejo plačanega
    // paketa brezplačno, kupljen paket med pilotom ne bi dal ničesar.
    const tier = rightsFor(studentId).personalTier;
    if (tier === "pilot" || tier === "owner") return { show: false, prices: false, reason: tier };
    return offerPolicy({ age: ageOfStudent(studentId, now), membership: schools.membership(studentId), lessons: schedules.get(studentId).lessons, now: nowParts(now) });
  }
  // Ena ponudba naenkrat (ponudbe.js oneOffer): "pass", "topup" ali null za profil.
  function offerKindFor(studentId) {
    const r = rightsFor(studentId);
    const subscribed = r.personal && (r.personalTier === "paid" || r.personalTier === "gift");
    const a = subscribed ? aiUsage.allowance(studentId) : null;
    return oneOffer({ subscribed, testSoon: !subscribed && !!billing?.passOfferFor(studentId), overShare: !!a && (a.stage === "low" || a.stage === "out") });
  }
  // Ali sme sporočilo o porabljenem delu inštruktorja predlagati dokup: polnoleten imetnik računa, profil 15+
  // (pod 15 brez poziva k nakupu) in ne hkrati s ponudbo paketa pred testom.
  function topupPrompt(studentId) {
    const p = getParent(ownerOf(studentId));
    if (!p || p.is_guest || isMinor(p)) return false;
    const o = offersFor(studentId);
    if (!(o.show && o.prices && offerKindFor(studentId) !== "pass")) return false;
    // Brez datuma rojstva dokup ni mogoč: sporočilo pove, naj ga vpiše v zavihku Račun (usage.js »block.*Birth«).
    return birthMissing(p) ? "birth" : true;
  }
  // Gumb »Dokupi« ob obvestilu o porabi (80 %, 100 %): samo naročniku po pravilu ene ponudbe in samo polnoletnemu
  // profilu (j 2026-11-01: gumb za dokup le polnoletni in starši); dijak 15–17 na računu staršev ga ne vidi.
  const topupButton = (studentId) => (ageOfStudent(studentId) ?? 0) >= 18 && topupPrompt(studentId) === true && offerKindFor(studentId) === "topup";
  aiUsage.configure({ topupPrompt });

  // Ali sme sporočilo o porabljenih vprašanjih predlagati nakup: le ponudba s ceno in ne učencu iz šole
  // (ta izve za Osebno v zavihku Račun, ne ob vsaki omejitvi).
  const upsell = (studentId) => {
    const o = offersFor(studentId);
    return o.show && o.prices && !schools.membership(studentId)?.inSchool;
  };
  // Namig, kako do več vprašanj: ključ i18n (block.hint*) ali null; odjemalec ga doda razlogu (public/app.js serverError).
  // Mlajši od 18: naj starš izbere naročnino; polnoleten (npr. študent) jo izbere sam. Brez znane starosti ponudbe
  // s ceno ni (ponudbe.js), zato tudi namiga ne.
  const moreHintCode = (studentId) =>
    guests.netOf(studentId) ? "block.hintGuest" : upsell(studentId) ? ((ageOfStudent(studentId) ?? 0) >= 18 ? "block.hintAdult" : "block.hintParent") : null;
  // Odgovor 429 za brezplačni paket: { error, code, params?, hint? }; error je slovenska rezerva (razlog + namig).
  function freeBlock(studentId, code, params) {
    const hint = moreHintCode(studentId);
    const text = params ? BLOCK_TEXT[code].replace("{n}", params.n) : BLOCK_TEXT[code];
    return { error: hint ? `${text} ${BLOCK_TEXT[hint]}` : text, code, ...(params ? { params } : {}), ...(hint ? { hint } : {}) };
  }

  // Poraba brezplačnega profila ta mesec (gost: vse omrežje) in poraba izbrisanih profilov istega računa.
  function freeSpent(studentId, owner = ownerOf(studentId), scope = quotaScope(studentId)) {
    return guests.monthUsd(scope.ids, scope.net) + (scope.net ? 0 : aiUsage.orphanSpent(owner));
  }
  // Poraba vseh profilov brez plačila (preizkus, koda, bonus) ta mesec, za skupni bazen (meje-ai.js nopayPoolUsd).
  // Skupna bazena seštejeta porabo vseh profilov (pregled #462 A10: pri tisočih profilih tisoče poizvedb na klic):
  // vsota se hrani do 30 s ali do naslednjega zapisa porabe (onLog spodaj), zato ostane meja trda.
  const poolMemo = new Map();
  const memo = (key, fn) => {
    const hit = poolMemo.get(key);
    if (hit && Date.now() - hit.at < 30_000) return hit.v;
    const v = fn();
    poolMemo.set(key, { v, at: Date.now() });
    return v;
  };
  function nopayPoolSpent() {
    return memo("nopay", () => monthUsdByStudent().filter((r) => r.id != null && subGuarantee(r.id)?.nopay).reduce((t, r) => t + r.usd, 0));
  }
  function freePoolSpent() {
    return memo("free", () => {
      const gone = db.prepare("SELECT COALESCE(SUM(usd),0) AS usd FROM guest_spent WHERE day >= date('now','start of month')").get().usd;
      return monthUsdByStudent().filter((r) => r.id != null && !aiPremiumFor(r.id)).reduce((t, r) => t + r.usd, gone);
    });
  }
  // Meja velja že, ko ne ostane prostora niti za najcenejši klic (trda meja, server/meje-ai.js).
  function freeBudgetInfo(studentId) {
    const need = aiUsage.minCallUsd();
    const room = (c) => c.usd - c.spent - (aiUsage.inflight.get(c.key) || 0);
    for (const c of freeCaps(studentId)) if (room(c) < need) return freeBlock(studentId, c.code);
    return null;
  }
  function freeBudgetReason(studentId) {
    return freeBudgetInfo(studentId)?.error ?? null;
  }

  function questionsToday(studentId) {
    const scope = quotaScope(studentId);
    return guests.questionsToday(scope.ids, scope.net);
  }

  async function sendMail(to, msg) {
    if (/@gost\.invalid$/i.test(String(to))) return false; // gost nima e-naslova
    try {
      await mailer.send({ to, ...msg });
      return true;
    } catch (err) {
      log.error?.("[evklid] pošiljanje e-pošte ni uspelo:", err.message);
      return false;
    }
  }

  // --- prijava in preverjanje lastništva za vse /api klice ---
  app.use("/api", (req, _res, next) => {
    const pid = sessions.parentId(readCookie(req));
    req.parent = pid ? getParent(pid) : null;
    // Skrbnik: e-naslov v EVKLID_ADMIN_EMAILS (tudi če je bil dodan po registraciji).
    if (req.parent && isAdminEmail(req.parent)) req.parent.is_admin = 1;
    req.deviceId = devices.identify(req, _res);
    next();
  });

  const PUBLIC = [/^\/kozmetika\/export$/, /^\/prijave\/izvoz$/, /^\/prijave\/(message|lesson|app)\/\d+\/stanje$/, /^\/app-links$/, /^\/auth\//, /^\/account\/status$/, /^\/account\/prices$/, /^\/account\/unsubscribe$/, /^\/stripe\/webhook$/, /^\/config$/, /^\/school-orders$/, /^\/podari$/, /^\/pay\/[^/]+(\/checkout|\/confirm)?$/];
  app.use("/api", (req, res, next) => {
    if (PUBLIC.some((re) => re.test(req.path))) return next();
    const p = req.parent;
    if (!p) return res.status(401).json({ error: "Prijavi se.", login: true });
    if (lockable(p) && ownerOnly(req.path, req.method) && !accountLocks.touch(p.id, req.deviceId)) {
      return res.status(403).json({ error: "Za to vpiši geslo računa.", account_locked: true });
    }
    if (p.is_guest && /^\/billing\//.test(req.path)) return res.status(403).json({ error: "Najprej ustvari račun v zavihku Račun.", guest: true });
    if (p.is_guest && !guestAllowed(p)) return res.status(401).json({ error: "Uporaba brez računa ni več mogoča. Ustvari račun, da obdržiš napredek.", login: true, guest_off: true });
    // Porabo AI vidi samo skrbnik ali kdor aplikacijo odpre na računalniku, kjer teče strežnik.
    if (/^\/usage(\/|$)/i.test(req.path) && !p.is_admin && !isLocalRequest(req)) return res.status(403).json({ error: "Samo za skrbnika." });

    // Express poti ujema brez ozira na velike črke in parametre dekodira (%31 = 1, Number(" 1") = 1),
    // zato je id učenca ali pogovora v poti samo iz števk, sicer bi šel mimo preverjanja lastništva in zaklepa.
    const seg = /^\/(students|conversations)\/([^/]+)/i.exec(req.path);
    if (seg && !/^\d+$/.test(seg[2])) return res.status(404).json({ error: "Ne obstaja." });
    let studentId = null;
    const s = /^\/students\/(\d+)(\/|$)/i.exec(req.path);
    const c = /^\/conversations\/(\d+)(\/|$)/i.exec(req.path);
    if (s) studentId = Number(s[1]);
    if (c) {
      studentId = store.getConversation(Number(c[1]))?.student_id ?? null;
      if (studentId === null) return res.status(404).json({ error: "Pogovor ne obstaja." });
    }
    if (studentId !== null && ownerOf(studentId) !== p.id) {
      return res.status(404).json({ error: s ? "Učenec ne obstaja." : "Pogovor ne obstaja." });
    }

    // Geslo profila: odklep je mogoč brez odklepa; profil z geslom je sicer odprt samo na napravi, kjer je bil odklenjen.
    if (s && req.method === "POST" && req.path === `/students/${studentId}/unlock`) return next();
    if (studentId !== null && profileLocked(p, studentId, req.deviceId)) {
      return res.status(423).json({
        error: "Profil je zaklenjen. Vpiši geslo profila.",
        locked: true,
        student_id: studentId,
        name: store.getStudent(studentId)?.name || "",
      });
    }

    // Profil je hkrati odprt samo na eni napravi. Izbris profila je dovoljen z vsake naprave staršu.
    // Skrbnik (is_admin: EVKLID_ADMIN_EMAILS s potrjenim naslovom ali zastavica v bazi) ima profile lahko
    // odprte na več napravah hkrati (j, 4. 11.).
    if (studentId !== null) {
      const own = s && /^\/students\/\d+\/?$/.test(req.path);
      if (own && req.method === "DELETE") {
        devices.logChange(p.id, "deleted", studentId);
        guests.snapshot(studentId);
      } else if (c && req.method === "DELETE" && /^\/conversations\/\d+\/?$/.test(req.path)) {
        guests.snapshotConversation(Number(c[1]), studentId);
      } else {
        const takeover = !!p.is_admin || (req.method === "POST" && req.path === `/students/${studentId}/claim`);
        const r = devices.use(studentId, req.deviceId, deviceLabel(req.get("user-agent")), { takeover });
        if (!r.ok) {
          return res.status(409).json({
            error: `Ta profil je trenutno odprt na drugi napravi (${r.other}). Profil je lahko hkrati odprt samo na eni napravi.`,
            taken: true,
            student_id: studentId,
          });
        }
      }
    }

    // Vprašanja inštruktorju na dan: brezplačni paket (10); plačljivi paketi in šolska licenca vsaj vsota
    // šolske licence (15) in Osebno (60), s proračunom AI več (dailyLimitFor).
    if (c && req.method === "POST" && /\/messages$/i.test(req.path)) {
      const r = rightsFor(studentId);
      if (!r.personal && (!r.school || r.schoolAiOut)) {
        const limit = freeDailyQuestions();
        if (questionsToday(studentId) >= limit) {
          return res.status(429).json({
            ...freeBlock(studentId, "block.freeDaily", { n: limit }),
            limit: true,
            upgrade: !!guests.netOf(studentId) || upsell(studentId),
          });
        }
      } else {
        const limit = dailyLimitFor(studentId, r);
        if (limit && questionsToday(studentId) >= limit) {
          return res.status(429).json({
            error: BLOCK_TEXT["block.daily"].replace("{n}", limit),
            code: "block.daily",
            params: { n: limit },
            limit: true,
          });
        }
      }
    }
    // Ustno spraševanje (server/ustno-api.js) šteje kot USTNO_QUESTIONS vprašanj (j 10. 11.: 3 od 10 v brezplačnem paketu);
    // začne se le, če jih je danes še toliko na voljo. Samoocena (brez AI, /ustno/samoocena) ne šteje.
    if (s && req.method === "POST" && /^\/students\/\d+\/ustno\/zacni\/?$/i.test(req.path)) {
      const r = rightsFor(studentId);
      const free = !r.personal && (!r.school || r.schoolAiOut);
      const limit = free ? freeDailyQuestions() : dailyLimitFor(studentId, r);
      if (limit && questionsToday(studentId) + USTNO_QUESTIONS > limit) {
        return res.status(429).json(
          free
            ? { ...freeBlock(studentId, "block.freeDaily", { n: limit }), limit: true, upgrade: !!guests.netOf(studentId) || upsell(studentId) }
            : { error: BLOCK_TEXT["block.daily"].replace("{n}", limit), code: "block.daily", params: { n: limit }, limit: true },
        );
      }
    }
    // Mesečna meja porabe brezplačnega paketa velja za vse klice AI (inštruktor, branje zapisa, fotografija urnika).
    // Z dokupljenim kreditom ta meja ne velja (poraba gre iz kredita, server/usage.js chargeCredit).
    if (studentId !== null && req.method === "POST" && /(\/messages|\/tasks\/\d+\/read|\/schedule\/photo|\/ustno\/(zacni|\d+\/odgovor|\d+\/ugovor))$/i.test(req.path) && !aiPremiumFor(studentId) && !(credits.balance(ownerOf(studentId)) > 0)) {
      const blocked = freeBudgetInfo(studentId);
      if (blocked) return res.status(429).json({ ...blocked, limit: true, upgrade: !!guests.netOf(studentId) || upsell(studentId) });
    }
    next();
  });

  // --- registracija, prijava, gesla ---
  // Skupna preverjanja za registracijo in nadgradnjo gosta. Ob napaki pošlje odgovor in vrne null.
  function checkSignup(req, res) {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!EMAIL_RE.test(email) || email.length > 200) return res.status(400).json({ error: "Vpiši veljaven e-naslov." }), null;
    if (password.length < 8) return res.status(400).json({ error: "Geslo mora imeti vsaj 8 znakov." }), null;
    if (req.body?.accept_privacy !== true) return res.status(400).json({ error: "Označi, da si prebral(a) obvestilo o varstvu podatkov." }), null;
    const birthIso = checkAge(req, res);
    if (!birthIso) return null;
    if (parentByEmail(email)) return res.status(409).json({ error: "Ta e-naslov je že registriran. Prijavi se.", exists: true }), null;
    return { email, password, birthIso };
  }

  const BIRTH_MISSING = "Vpiši svoj datum rojstva. Z njim preverimo, ali lahko račun ustvariš sam ali ga ustvari starš.";

  // Preverjanje starosti: mlajši od starosti digitalne privolitve dobijo povezavo za starše.
  // Vrne datum rojstva (YYYY-MM-DD) ali null (odgovor je že poslan). Tudi za prijavo z Apple (server/mobile).
  function checkAge(req, res) {
    const birth = parseBirthDate(req.body?.birth_date);
    const age = birth ? ageOn(birth) : null;
    if (age === null || age < 0 || age > 120) return res.status(400).json({ error: BIRTH_MISSING, birth_date: true }), null;
    const cf = String(req.headers["cf-ipcountry"] || "").toUpperCase();
    const minAge = minAgeOf(cf, req.body?.country);
    const blockedBefore = readCookie(req, AGE_COOKIE) === "1" || LEGACY_AGE_COOKIES.some((c) => readCookie(req, c) === "1");
    if (age < minAge || (blockedBefore && age < ADULT_AGE)) {
      const secure = req.secure ? "; Secure" : "";
      res.append("Set-Cookie", `${AGE_COOKIE}=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${secure}`);
      return res.status(403).json({
        error: `Za mlajše od ${minAge} let račun ustvari starš. Pokaži mu povezavo za starše.`,
        under_age: true,
        min_age: minAge,
      }), null;
    }
    return `${birth.y}-${String(birth.m).padStart(2, "0")}-${String(birth.d).padStart(2, "0")}`;
  }

  // Nov račun (registracija z e-naslovom ali prijava z Apple). verified: e-naslov je že potrjen (Apple).
  // Vrne { id, verifyToken }.
  function createParent(req, { email, passwordHash, name, birthIso, referrerId = null, verified = false }) {
    const token = randomToken();
    let code = referralCode();
    while (db.prepare("SELECT 1 FROM parents WHERE referral_code = ?").get(code)) code = referralCode();
    const r = db
      .prepare(
        `INSERT INTO parents (email, password_hash, name, is_admin, verify_token_hash, privacy_version, trial_ends_at, unsubscribe_token, referral_code, referred_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(email, passwordHash, cleanText(name, 60), 0, verified ? null : sha256(token), PRIVACY_VERSION, isoIn(TRIAL_DAYS), randomToken(18), code, referrerId);
    const id = Number(r.lastInsertRowid);
    db.prepare("UPDATE parents SET birth_date = ? WHERE id = ?").run(birthIso, id);
    if (verified) update(id, { email_verified_at: new Date().toISOString() });
    else update(id, { verify_expires_at: isoIn(VERIFY_DAYS) });
    const country = String(req.headers["cf-ipcountry"] || req.body?.country || "").toUpperCase();
    if (/^[A-Z]{2}$/.test(country)) db.prepare("UPDATE parents SET country = ? WHERE id = ?").run(country, id);
    return { id, verifyToken: token };
  }

  app.post("/api/auth/register", json, async (req, res) => {
    // Ključ je omrežje (IPv6: /64), sicer bi en priključek z menjavo naslovov v svojem /64 ustvaril neomejeno računov.
    const signupKey = netKey(req.ip);
    if (!isLocalRequest(req) && signupThrottle.blocked(signupKey)) return res.status(429).json({ error: "S tega omrežja je danes ustvarjenih že preveč računov. Poskusi jutri." });
    const v = checkSignup(req, res);
    if (!v) return;
    signupThrottle.fail(signupKey);
    const { email, password } = v;

    const refCode = String(req.body?.referral_code || "").trim().toUpperCase();
    const referrer = refCode ? db.prepare("SELECT id FROM parents WHERE referral_code = ? AND is_guest = 0").get(refCode) : null;
    const { id, verifyToken: token } = createParent(req, { email, passwordHash: await hashPassword(password), name: req.body?.name, birthIso: v.birthIso, referrerId: referrer?.id ?? null });

    const url = `${baseUrl(req)}/api/auth/verify?token=${token}`;
    await sendMail(email, verifyEmail(url));
    // Aktivacijska koda ob registraciji; napačna koda registracije ne ustavi.
    const promoRaw = String(req.body?.promo_code || "").trim();
    const promoResult = promoRaw ? promo.redeem(getParent(id), promoRaw) : null;
    accountLocks.unlock(id, req.deviceId);
    setSessionCookie(req, res, sessions.create(id));
    res.status(201).json({
      parent: publicParent(getParent(id)),
      referred: !!referrer,
      ...(promoResult?.ok ? { promo_until: promoResult.until } : promoResult ? { promo_error: promoResult.error } : {}),
      ...(devLinks(req, getParent(id)?.email) ? { dev_verify_url: url } : {}),
    });
  });

  // --- uporaba brez registracije (gost) ---
  app.post("/api/auth/guest", json, (req, res) => {
    // Brez vklopljene uporabe brez računa samo z veljavnim povabilom lastnika (/?gost=…).
    const invite = guestOn ? null : invites.find(req.body?.invite);
    if (!guestOn && !invite) return res.status(404).json({ error: "Povabilo ne velja več (poteklo je ali je porabljeno). Ustvari račun ali prosi za novo povezavo.", invite_invalid: true });
    if (req.parent) return res.json({ parent: publicParent(req.parent) });
    if (req.body?.accept_privacy !== true) return res.status(400).json({ error: "Označi, da si prebral(a) obvestilo o varstvu podatkov." });
    // Naprava, ki je bila zavrnjena pri registraciji zaradi starosti, tudi brez računa ne more naprej.
    if (readCookie(req, AGE_COOKIE) === "1" || LEGACY_AGE_COOKIES.some((c) => readCookie(req, c) === "1")) {
      return res.status(403).json({ error: "Za mlajše učence račun ustvari starš. Pokaži mu povezavo za starše.", under_age: true });
    }
    const net = guestNet(req);
    if (guests.createdToday(net) >= guestPerDay()) {
      return res.status(429).json({ error: "S tega omrežja je danes nastalo že preveč profilov brez računa. Ustvari račun ali poskusi jutri.", guest_limit: true });
    }
    if (invite && !invites.use(invite.id)) return res.status(404).json({ error: "Povabilo ne velja več (poteklo je ali je porabljeno). Ustvari račun ali prosi za novo povezavo.", invite_invalid: true });
    let code = referralCode();
    while (db.prepare("SELECT 1 FROM parents WHERE referral_code = ?").get(code)) code = referralCode();
    const r = db
      .prepare(
        `INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, weekly_email, is_guest, guest_net, guest_invite_id)
         VALUES (?, ?, ?, ?, ?, 0, 1, ?, ?)`,
      )
      .run(`gost-${randomToken(12)}@gost.invalid`, unusablePasswordHash(), PRIVACY_VERSION, randomToken(18), code, net, invite?.id ?? null);
    const id = Number(r.lastInsertRowid);
    guests.logCreated(net);
    const country = String(req.headers["cf-ipcountry"] || req.body?.country || "").toUpperCase();
    if (/^[A-Z]{2}$/.test(country)) db.prepare("UPDATE parents SET country = ? WHERE id = ?").run(country, id);
    setSessionCookie(req, res, sessions.create(id, GUEST_SESSION_DAYS));
    res.status(201).json({ parent: publicParent(getParent(id)) });
  });

  // Gost ustvari račun: isti profili in napredek, dobi e-naslov in geslo. Do potrditve e-naslova
  // ostane v kvoti omrežja (guest_net); 7-dnevni preizkus dobi šele ob potrditvi (/api/auth/verify).
  app.post("/api/auth/upgrade", json, async (req, res) => {
    const p = req.parent;
    if (!p) return res.status(401).json({ error: "Prijavi se.", login: true });
    if (!p.is_guest) return res.status(400).json({ error: "Račun že imaš." });
    const v = checkSignup(req, res);
    if (!v) return;
    const token = randomToken();
    const hash = await hashPassword(v.password);
    db.prepare(
      `UPDATE parents SET email = ?, password_hash = ?, name = ?, is_admin = ?, verify_token_hash = ?, privacy_version = ?,
         privacy_accepted_at = datetime('now'), birth_date = ?, weekly_email = 1, is_guest = 0, verify_expires_at = ? WHERE id = ?`,
    ).run(v.email, hash, cleanText(req.body?.name, 60), 0, sha256(token), PRIVACY_VERSION, v.birthIso, isoIn(VERIFY_DAYS), p.id);
    db.prepare("UPDATE consents SET parent_email = ? WHERE parent_id = ?").run(v.email, p.id);
    const url = `${baseUrl(req)}/api/auth/verify?token=${token}`;
    await sendMail(v.email, verifyEmail(url));
    sessions.destroyAll(p.id);
    accountLocks.unlock(p.id, req.deviceId);
    setSessionCookie(req, res, sessions.create(p.id));
    res.json({ parent: publicParent(getParent(p.id)), ...(devLinks(req, v.email) ? { dev_verify_url: url } : {}) });
  });

  // Gost se prijavi v obstoječi račun: njegove profile prenesemo, če je v paketu prostor.
  const canAdopt = (guest, p) => {
    const n = childIds(guest.id).length;
    const room = profileSeats(p) - childIds(p.id).length;
    return !n || (n <= room && !(isMinor(p) && childIds(p.id).length));
  };
  function adoptGuest(guest, p) {
    const ids = childIds(guest.id);
    db.prepare("UPDATE students SET parent_id = ? WHERE parent_id = ?").run(p.id, guest.id);
    db.prepare("UPDATE consents SET parent_id = ?, parent_email = ? WHERE parent_id = ?").run(p.id, p.email, guest.id);
    db.prepare("DELETE FROM parents WHERE id = ?").run(guest.id);
    detachAudit(db, guest.id);
    return { moved: ids.length };
  }

  // Potrditev e-naslova: gost zapusti kvoto omrežja, skrbnik prevzame učence iz časa pred računi.
  function confirmEmail(parentId) {
    // Nekdanji gost: s potrditvijo zapusti kvoto omrežja in dobi 7-dnevni preizkus. Poraba gosta ostane šteta za
    // omrežje (guest_spent), zapisana, dokler je račun še na omrežju (pred potrditvijo; pregled #462).
    const before = getParent(parentId);
    if (before.guest_net && !before.is_guest && !before.email_verified_at) guests.snapshotParent(parentId);
    update(parentId, { email_verified_at: new Date().toISOString(), verify_token_hash: null, verify_expires_at: null });
    const full = getParent(parentId);
    if (full.guest_net && !full.is_guest) update(parentId, { guest_net: null, trial_ends_at: full.trial_ends_at || isoIn(TRIAL_DAYS) });
    // Skrbnik (potrjen e-naslov iz EVKLID_ADMIN_EMAILS) prevzame učence iz časa pred računi.
    if (isAdminEmail(full)) {
      update(parentId, { is_admin: 1 });
      db.prepare("UPDATE students SET parent_id = ? WHERE parent_id IS NULL").run(parentId);
    }
  }
  // Povezava velja VERIFY_DAYS dni (#493), za GET in POST: potekla se ne more več uporabiti (nova: »Pošlji znova« v Računu).
  const byVerifyToken = (token) => {
    const p = token ? db.prepare("SELECT * FROM parents WHERE verify_token_hash = ?").get(sha256(token)) : null;
    return p && Date.parse(p.verify_expires_at || "") > Date.now() ? p : null;
  };

  // GET (povezava iz e-pošte) ne spremeni ničesar, razen iz seje tega računa: povezavo odprejo tudi pregledovalniki
  // povezav v e-pošti (Microsoft Safe Links, Mimecast) in Safari brez seje mobilne aplikacije (pregled #492 B, P1-1).
  // Brez seje stran vpraša za geslo računa ali »tega računa nisem ustvaril« (POST spodaj).
  app.get("/api/auth/verify", (req, res) => {
    const token = String(req.query.token || "");
    const p = byVerifyToken(token);
    if (!p) return res.redirect("/?verified=0");
    // Že potrjen račun (npr. s ponastavitvijo gesla): stara povezava samo počisti žeton.
    if (p.email_verified_at) {
      update(p.id, { verify_token_hash: null, verify_expires_at: null });
      return res.redirect("/?verified=1");
    }
    // Samo seja tega računa potrdi takoj; brez nje (tudi račun brez gesla) GET ne potrdi ničesar, ker povezavo odprejo
    // tudi pregledovalniki pošte (pregled #492/#500 A P3-1).
    if (req.parent?.id === p.id) {
      confirmEmail(p.id);
      return res.redirect("/?verified=1");
    }
    res.redirect(`/?verify=${encodeURIComponent(token)}`);
  });

  // { token, password }: geslo računa dokaže, da je račun ustvaril lastnik naslova; seje ostanejo.
  // { token, not_mine: true }: lastnik naslova računa ni ustvaril ali gesla ne pozna. Geslo je lahko tujčevo (prevzem
  // pred registracijo, pregled #492 B), zato ga zamenjamo z neuporabnim in odjavimo vse naprave. Povezavo za novo geslo
  // pošljemo na naslov računa (velja 1 uro), ne v odgovor: kdor ima samo povezavo za potrditev (zgodovina brskalnika,
  // posredovana pošta), brez nabiralnika računa ne dobi (pregled #492/#500 A in B, P2-1).
  app.post("/api/auth/verify", json, async (req, res) => {
    const token = String(req.body?.token || "");
    const p = byVerifyToken(token);
    if (!p) return res.status(400).json({ error: "Povezava za potrditev ni veljavna ali je že uporabljena." });
    if (p.email_verified_at) {
      update(p.id, { verify_token_hash: null, verify_expires_at: null });
      return res.json({ ok: true });
    }
    // Seja istega računa (povezava odprta v brskalniku, kjer je lastnik prijavljen): potrdi brez gesla.
    if (req.parent?.id === p.id && req.body?.not_mine !== true) {
      confirmEmail(p.id);
      return res.json({ ok: true });
    }
    if (req.body?.not_mine === true) {
      confirmEmail(p.id);
      const reset = randomToken();
      // Tujčev Apple ID (če ga je povezal) odpade z njegovim geslom (pregled #492 A P3-7).
      update(p.id, { password_hash: unusablePasswordHash(), reset_token_hash: sha256(reset), reset_expires_at: isoIn(1 / 24) });
      if (p.apple_sub) update(p.id, { apple_sub: null });
      dropForeignAccess(p.id);
      audit(db, { req, parentId: p.id, action: "verify_foreign_session" });
      const url = `${baseUrl(req)}/?reset=${reset}`;
      const sent = await sendMail(p.email, resetEmail(url));
      return res.json({ ok: true, mail: sent !== false, ...(devLinks(req, p.email) ? { dev_reset_url: url } : {}) });
    }
    // Meja za ves račun (ugibanje z menjavo omrežja, kot odklep in izvoz; pregled #492 A P1-1) in za omrežje.
    const acct = `acct${p.id}`;
    if (acrossThrottle.blocked(acct) || ipThrottle.blocked(req.ip))
      return res.status(429).json({ error: "Preveč poskusov. Poskusi čez eno uro ali izberi »Računa nisem ustvaril jaz / ne poznam gesla«." });
    const ok = await verifyPassword(String(req.body?.password || ""), p.password_hash);
    // Med čakanjem na scrypt se je geslo ali žeton lahko zamenjal.
    const same = ok && db.prepare("SELECT 1 FROM parents WHERE id = ? AND password_hash = ? AND verify_token_hash = ?").get(p.id, p.password_hash, p.verify_token_hash);
    if (!same) {
      acrossThrottle.fail(acct);
      ipThrottle.fail(req.ip);
      audit(db, { req, parentId: p.id, action: "verify_password_fail", ok: false });
      return res.status(401).json({ error: "Napačno geslo." });
    }
    confirmEmail(p.id);
    audit(db, { req, parentId: p.id, action: "verify_password" });
    // Geslo in dostop do e-pošte: kot prijava (Safari po registraciji v aplikaciji je potem tudi prijavljen).
    if (!req.parent) {
      accountLocks.unlock(p.id, req.deviceId);
      setSessionCookie(req, res, sessions.create(p.id));
    }
    res.json({ ok: true });
  });

  app.post("/api/auth/resend-verification", async (req, res) => {
    const p = req.parent;
    if (!p) return res.status(401).json({ error: "Prijavi se.", login: true });
    if (p.is_guest) return res.status(400).json({ error: "Najprej ustvari račun." });
    if (p.email_verified_at) return res.json({ ok: true, verified: true });
    const token = randomToken();
    update(p.id, { verify_token_hash: sha256(token), verify_expires_at: isoIn(VERIFY_DAYS) });
    const url = `${baseUrl(req)}/api/auth/verify?token=${token}`;
    await sendMail(p.email, verifyEmail(url));
    res.json({ ok: true, ...(devLinks(req, p.email) ? { dev_verify_url: url } : {}) });
  });

  app.post("/api/auth/login", json, async (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const key = `${email}|${req.ip}`;
    if (throttle.blocked(key) || emailThrottle.blocked(email) || ipThrottle.blocked(req.ip)) return res.status(429).json({ error: "Preveč poskusov. Poskusi čez 15 minut." });
    const p = parentByEmail(email);
    const password = String(req.body?.password || "");
    // Brez računa enako dolgo računamo, da čas odgovora ne izda, ali e-naslov obstaja.
    const ok = p ? await verifyPassword(password, p.password_hash) : await fakeVerify();
    // Močnejši zapis gesla; ob polni vrsti (SCRYPT_BUSY) prijava vseeno uspe, zamenjamo naslednjič.
    const rehashed = ok && needsRehash(p.password_hash) ? await hashPassword(password).catch(() => null) : null;
    // Med čakanjem na scrypt se je geslo lahko zamenjalo (ponastavitev odjavi vse seje) ali je bil račun izbrisan:
    // takrat staro geslo ne sme odpreti nove seje.
    const same = ok && db.prepare("SELECT password_hash FROM parents WHERE id = ?").get(p.id)?.password_hash === p.password_hash;
    if (!same) {
      throttle.fail(key);
      emailThrottle.fail(email);
      ipThrottle.fail(req.ip);
      audit(db, { req, parentId: p?.id ?? null, action: "login_fail", ok: false });
      return res.status(401).json({ error: "Napačen e-naslov ali geslo." });
    }
    const fromGuest = req.parent?.is_guest && req.parent.id !== p.id ? req.parent : null;
    // Profila brez računa ne zavržemo potiho: brez prostora v paketu prijava ne uspe.
    if (fromGuest && !canAdopt(fromGuest, p)) {
      return res.status(409).json({ error: "Profila brez računa ni mogoče prenesti, ker v paketu tega računa ni prostora. Ustvari nov račun ali najprej izbriši podatke brez računa.", guest_conflict: true });
    }
    throttle.reset(key);
    if (rehashed) db.prepare("UPDATE parents SET password_hash = ? WHERE id = ? AND password_hash = ?").run(rehashed, p.id, p.password_hash);
    audit(db, { req, parentId: p.id, action: "login" });
    const guest = fromGuest ? adoptGuest(fromGuest, p) : null;
    accountLocks.unlock(p.id, req.deviceId);
    setSessionCookie(req, res, sessions.create(p.id));
    res.json({ parent: publicParent(p), ...(guest ? { guest_moved: guest.moved } : {}) });
  });

  app.post("/api/auth/logout", (req, res) => {
    // Profili na napravi ostanejo odklenjeni (geslo samo enkrat, j 2026-10-30); brez seje niso dostopni,
    // ob ponovni prijavi z geslom računa pa jih ni treba odklepati znova.
    if (req.parent) accountLocks.lock(req.parent.id, req.deviceId);
    if (req.parent) audit(db, { req, parentId: req.parent.id, action: "logout" });
    sessions.destroy(readCookie(req));
    clearSessionCookie(req, res);
    // Gumb »Odjava« na zaslonu za geslo profila je navaden obrazec (deluje tudi, če skript odpove).
    if (req.accepts(["json", "html"]) === "html") return res.redirect(303, "/");
    res.json({ ok: true });
  });

  // Premlad za lasten račun (checkAge): Evklid pošlje staršu povezavo na stran za starše.
  // Naslova ne shranimo; besedilo je stalno, zato ga ni mogoče zlorabiti za poljubna sporočila.
  app.post("/api/auth/ask-parent", json, async (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 200) return res.status(400).json({ error: "Vpiši veljaven e-naslov starša." });
    const net = netKey(req.ip);
    if (inviteIpThrottle.blocked(net) || inviteToThrottle.blocked(email) || inviteAllThrottle.blocked("*")) return res.status(429).json({ error: "Preveč sporočil. Poskusi čez eno uro ali pošlji povezavo drugače." });
    if (!mailer.enabled && !devLinks(req, req.body?.email)) return res.status(503).json({ error: "Pošiljanje e-pošte trenutno ne deluje. Pošlji povezavo drugače.", mail: false });
    inviteIpThrottle.fail(net);
    inviteToThrottle.fail(email);
    inviteAllThrottle.fail("*");
    const name = String(req.body?.name || "").replace(/[^\p{L}\p{M} '-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 30);
    const url = `${baseUrl(req)}/starsi.html${name ? `?ime=${encodeURIComponent(name)}` : ""}`;
    const sent = await sendMail(email, parentInviteEmail(url, name));
    if (!sent) return res.status(502).json({ error: "Sporočila ni bilo mogoče poslati. Pošlji povezavo drugače.", mail: false });
    res.json({ ok: true });
  });

  app.post("/api/auth/forgot", json, async (req, res) => {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (forgotThrottle.blocked(email) || forgotThrottle.blocked(req.ip)) return res.status(429).json({ error: "Preveč poskusov. Poskusi čez eno uro." });
    forgotThrottle.fail(email);
    forgotThrottle.fail(req.ip);
    const p = parentByEmail(email);
    let devUrl;
    if (p) {
      const token = randomToken();
      update(p.id, { reset_token_hash: sha256(token), reset_expires_at: isoIn(1 / 24) });
      audit(db, { req, parentId: p.id, action: "password_reset_request" });
      devUrl = `${baseUrl(req)}/?reset=${token}`;
      await sendMail(p.email, resetEmail(devUrl));
    }
    // Enak odgovor ne glede na to, ali račun obstaja.
    res.json({ ok: true, ...(devLinks(req, p?.email) && devUrl ? { dev_reset_url: devUrl } : {}) });
  });

  app.post("/api/auth/reset", json, async (req, res) => {
    const token = String(req.body?.token || "");
    const password = String(req.body?.password || "");
    if (password.length < 8) return res.status(400).json({ error: "Geslo mora imeti vsaj 8 znakov." });
    const p = token && db.prepare("SELECT * FROM parents WHERE reset_token_hash = ?").get(sha256(token));
    if (!p || Date.parse(p.reset_expires_at) < Date.now()) return res.status(400).json({ error: "Povezava je potekla. Zahtevaj novo." });
    const hash = await hashPassword(password);
    // Povezava velja enkrat: ob hkratnih zahtevah z istim žetonom uspe le prva.
    if (!db.prepare("SELECT 1 FROM parents WHERE id = ? AND reset_token_hash = ?").get(p.id, p.reset_token_hash)) return res.status(400).json({ error: "Povezava je potekla. Zahtevaj novo." });
    update(p.id, {
      password_hash: hash,
      reset_token_hash: null,
      reset_expires_at: null,
      email_verified_at: p.email_verified_at || new Date().toISOString(),
      verify_token_hash: null, // stara povezava za potrditev po ponastavitvi ne velja več (pregled #492 B, P2-2)
      verify_expires_at: null,
    });
    // Povezan Apple ID ni nujno lastnikov: povezan pred potrditvijo naslova (pregled #492 B, P2-1) ali dodan na potrjen
    // račun, o čemer je lastnik dobil e-pošto »če niste vi, nastavite novo geslo« (A P3-7). Ostane samo pri računu,
    // ustvarjenem s prijavo z Apple (brez gesla). Lastnik ga znova poveže s prijavo z Apple. Stolpec obstaja samo s
    // prijavo z Apple (server/mobile/apple-signin.js).
    if (p.apple_sub && (!p.email_verified_at || !String(p.password_hash || "").startsWith("none$"))) update(p.id, { apple_sub: null });
    // Vse seje (tudi napadalčeve) in obvestila na telefon po novem geslu ne veljajo; ključi razredov samo, če naslov še ni
    // bil potrjen (prevzem pred registracijo), sicer jih je dobil lastnik sam (pregled #492 A P2-4).
    dropForeignAccess(p.id, { classKeys: !p.email_verified_at });
    audit(db, { req, parentId: p.id, action: "password_reset" });
    accountLocks.unlock(p.id, req.deviceId);
    setSessionCookie(req, res, sessions.create(p.id));
    res.json({ ok: true });
  });

  // --- račun ---
  app.get("/api/account/status", (req, res) => {
    const p = req.parent;
    res.json({
      enabled: true,
      guest_mode: guestAllowed(p),
      logged_in: !!p,
      parent: p ? publicParent(p) : null,
      children: p ? childIds(p.id).length : 0,
      billing: stripe.enabled,
      email: mailer.enabled,
      account_lock: p ? lockable(p) : false,
      account_unlocked: p ? !lockable(p) || accountLocks.isUnlocked(p.id, req.deviceId) : false,
    });
  });

  // Star račun brez datuma rojstva ga vpiše enkrat (ob prijavi na odklenjeni napravi ali v zavihku Račun) ali izbere »Pozneje«.
  // Samo lastnik računa (OWNER_ONLY v account-lock.js): otrok na starševi napravi ga ne vpiše namesto starša.
  // Vpisanega datuma ni mogoče spremeniti sam (sicer bi se mladoletni naredil polnoletnega); napako popravi skrbnik
  // s scripts/popravi-datum-rojstva.js (zapis v dnevnik dostopov). Datuma ne beležimo v dnevnik.
  // Mlajši od 18 let: plačila prek staršev (isMinor, pay_link). Mlajši od starosti digitalne privolitve (SI: 15, age.js):
  // datum se shrani, račun deluje naprej, odgovor ima under_age (aplikacija pove, da plačila potekajo prek starša).
  // Zapis je atomski (WHERE birth_date IS NULL): ob dveh hkratnih zahtevkih uspe samo prvi, drugi dobi 409.
  app.post("/api/account/birth-date", json, (req, res) => {
    const p = req.parent;
    if (!p) return res.status(401).json({ error: "Prijavi se.", login: true });
    if (p.is_guest) return res.status(400).json({ error: "Najprej ustvari račun.", guest: true });
    const taken = () => res.status(409).json({ error: "Datum rojstva je že vpisan.", parent: publicParent(getParent(p.id)) });
    if (p.birth_date) return taken();
    const now = new Date().toISOString();
    if (req.body?.later === true) {
      const r = db.prepare("UPDATE parents SET birth_asked_at = ? WHERE id = ? AND birth_date IS NULL").run(now, p.id);
      if (!r.changes) return taken();
      return res.json({ parent: publicParent(getParent(p.id)) });
    }
    const birth = parseBirthDate(req.body?.birth_date);
    const age = birth ? ageOn(birth) : null;
    // Mlajši od 5 let ne more biti imetnik računa (kot birth_year pri profilih): zatipkana letnica, ne pravi datum.
    if (age === null || age < MIN_HOLDER_AGE || age > 120) return res.status(400).json({ error: "Vpiši pravi datum rojstva.", birth_date: true });
    const iso = `${birth.y}-${String(birth.m).padStart(2, "0")}-${String(birth.d).padStart(2, "0")}`;
    const r = db.prepare("UPDATE parents SET birth_date = ?, birth_asked_at = ? WHERE id = ? AND birth_date IS NULL").run(iso, now, p.id);
    if (!r.changes) return taken();
    const minAge = minAgeOf(p.country, String(req.headers["cf-ipcountry"] || ""));
    res.json({ parent: publicParent(getParent(p.id)), ...(age < minAge ? { under_age: true, min_age: minAge } : {}) });
  });

  // Enkratna koda za račun brez gesla (Apple): 6 števk na potrjeni e-naslov, velja 10 minut, največ 3 na uro.
  db.exec(`CREATE TABLE IF NOT EXISTS owner_codes (
    parent_id INTEGER PRIMARY KEY REFERENCES parents(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  )`);
  const codeThrottle = new Throttle(3, 3600000);
  app.post("/api/account/owner-code", json, async (req, res) => {
    const p = req.parent;
    if (!p) return res.status(401).json({ error: "Prijavi se.", login: true });
    if (!noPassword(p)) return res.status(400).json({ error: "Račun ima geslo." });
    if (!p.email_verified_at || p.is_guest) return res.status(400).json({ error: "E-naslov ni potrjen." });
    if (codeThrottle.blocked(`code${p.id}`)) return res.status(429).json({ error: "Preveč kod. Poskusi čez eno uro." });
    codeThrottle.fail(`code${p.id}`);
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    db.prepare("INSERT INTO owner_codes (parent_id, code_hash, expires_at) VALUES (?, ?, ?) ON CONFLICT(parent_id) DO UPDATE SET code_hash = excluded.code_hash, expires_at = excluded.expires_at").run(p.id, sha256(`${p.id}:${code}`), Date.now() + 10 * 60000);
    try {
      await mailer.send({ to: p.email, ...ownerCodeEmail(code) });
    } catch {
      return res.status(502).json({ error: "Kode ni bilo mogoče poslati. Poskusi znova." });
    }
    res.json({ ok: true, ...(devLinks(req, p.email) ? { dev_code: code } : {}) });
  });

  // Obvestilo o spremenjeni politiki zasebnosti zaprto (»V redu« ali ×): ne pokaže se več do naslednje spremembe.
  // Samo z geslom računa (pasica v zavihku Račun), da obvestila ne zapre otrok na starševi napravi.
  app.post("/api/account/privacy-seen", json, async (req, res) => {
    const p = req.parent;
    if (!p) return res.status(401).json({ error: "Prijavi se.", login: true });
    const ok = await confirmOwner(req);
    if (ok === "throttled") return res.status(429).json({ error: "Preveč poskusov. Poskusi čez eno uro." });
    if (!ok) return res.status(401).json({ error: "Napačno geslo.", password: true });
    db.prepare("UPDATE parents SET privacy_seen = ? WHERE id = ?").run(PRIVACY_VERSION, p.id);
    res.json({ parent: publicParent(getParent(p.id)) });
  });

  // Odklep računa na tej napravi z geslom računa (zavihek Račun, nov ali izbrisan profil).
  app.post("/api/account/unlock", json, async (req, res) => {
    const p = req.parent;
    if (!lockable(p)) return res.json({ ok: true });
    const key = `${p.id}|${req.ip}`;
    // Tudi meja za ves račun (acct<id>, kot izvoz in geslo profila): z menjavo omrežja se gesla ne da ugibati brez konca.
    if (accountThrottle.blocked(key)) return res.status(429).json({ error: "Preveč napačnih poskusov. Poskusi čez 15 minut." });
    if (acrossThrottle.blocked(`acct${p.id}`)) return res.status(429).json({ error: ACCT_BLOCKED });
    const ok = await verifyPassword(String(req.body?.password || ""), p.password_hash);
    if (!ok) {
      accountThrottle.fail(key);
      acrossThrottle.fail(`acct${p.id}`);
      audit(db, { req, parentId: p.id, action: "account_unlock", ok: false });
      return res.status(401).json({ error: "Napačno geslo." });
    }
    accountThrottle.reset(key);
    accountLocks.unlock(p.id, req.deviceId);
    res.json({ ok: true });
  });

  // Zaklep takoj (ob odhodu iz zavihka Račun).
  app.post("/api/account/lock", (req, res) => {
    accountLocks.lock(req.parent.id, req.deviceId);
    res.json({ ok: true });
  });

  // Država za ceno: Cloudflare (CF-IPCountry, npr. tunel ali gostovanje za Cloudflare), sicer
  // država, shranjena ob registraciji, sicer Slovenija. Naročnina ostane v valuti, v kateri je sklenjena.
  const countryOf = (req, p) => {
    const cf = String(req.headers["cf-ipcountry"] || "").toUpperCase();
    return /^[A-Z]{2}$/.test(cf) && cf !== "XX" && cf !== "T1" ? cf : p?.country || "SI";
  };
  const currencyOf = (req, p) => {
    const sub = p?.sub_plan && planByKey(p.sub_plan);
    return sub?.currency || currencyForCountry(countryOf(req, p));
  };

  // Paket za nakup (j 2026-11-01): en profil po stopnji profila s sedežem (najstarejši profil), 2 ali več profilov
  // Družina; Družina s študentom, če je med profili faks. V regijskih valutah kot doslej (1 ali 2 otroka).
  function planForAccount(parentId, seats, interval, currency = "EUR") {
    const levels = childIds(parentId).map(levelOf);
    const level = seats >= 2 ? (levels.includes("FAKS") ? "FAKS" : "SS") : levels[0] || "OS";
    return planFor(seats, interval, currency, level);
  }

  // Nadgradnja med obdobjem (j 2026-11-01): višja stopnja le z doplačilom razlike za preostanek obdobja (proracija
  // Stripa). En profil: vse višje stopnje; Družina: Družina s študentom. Samo naročnina prek Stripa v evrih.
  function upgradeFor(p) {
    if (!paidActive(p) || (p.sub_provider || "stripe") !== "stripe" || !p.sub_id || !String(p.sub_id).startsWith("sub_")) return null;
    const plan = planByKey(p.sub_plan);
    const level = planLevel(plan);
    if (!level || plan.legacy) return null;
    const options = plan.family
      ? level === "FAKS" ? [] : [familyPlanFor(true, plan.interval)]
      : STOPNJE.filter((l) => rang(l) > rang(level)).map((l) => levelPlanFor(l, plan.interval));
    return options.length ? { from: plan.key, options: options.map((o) => ({ key: o.key, level: o.level, family: !!o.family, label: o.label, amount: o.amount, interval: o.interval, currency: "EUR" })) } : null;
  }

  function accountView(req, p) {
    const access = accessOf(p);
    const rewards = db.prepare("SELECT COUNT(*) AS n FROM referral_rewards WHERE referrer_id = ?").get(p.id).n;
    const special = specialOf(p);
    return {
      parent: publicParent(p),
      access,
      // Pilot: poln paket brezplačno do zadnjega dne pilota (LLLL-MM-DD); lastnik: brez meje (public/account.js planText).
      pilot: special ? { kind: special, last_day: special === "pilot" ? pilotLastDay() : null, profiles: profileSeats(p) } : null,
      free_daily_questions: freeDailyQuestions(),
      // Osebno ob šolski licenci: ponudi se, ko ima vsaj en otrok šolsko licenco (samo v evrih).
      school_plans: childIds(p.id).some((id) => schools.hasLicence(id)) && currencyOf(req, p) === "EUR" ? SCHOOL_PLANS : [],
      gifts: gifts ? gifts.listFor(p.id) : [],
      // V pilotu brez nakupa darilne kode in brez »Podari Evklid« (j 2026-11-10); strežnik nakup zavrne (409).
      gift_buy: !isPilotParent(p),
      guarantee: guarantee ? guarantee.viewFor(p) : null,
      podari: podari && !isPilotParent(p) ? podari.stats() : null,
      // Darilna koda po letni ceni stopnje (99 / 139 / 199 €).
      gift_prices: GIFT_PRICES,
      gift_price: GIFT_PRICES.OS,
      // Stopnja profila s sedežem (cena paketa za en profil) in ali je Družina na izbiro (vsaj 2 profila).
      plan_level: childIds(p.id).map(levelOf)[0] || "OS",
      family_ok: childIds(p.id).length >= 2,
      // Nadgradnja na višjo stopnjo med obdobjem (doplačilo razlike) in čakajoča nova cena ob podaljšanju.
      upgrade: upgradeFor(p),
      pending_change: billing?.pendingChange(p) || null,
      children: children(p.id).map((c) => ({
        id: c.id,
        name: c.name,
        birth_year: c.birth_year,
        level: levelOf(c.id),
        // V pilotu brez oznake »stopnja zaklenjena« (j 2026-11-10); zaklep stopnje pilota še velja (pilotLock).
        level_locked: rightsFor(c.id).personalTier !== "pilot" && rightsFor(c.id).levelLocked,
        premium: premiumFor(c.id),
        school: rightsFor(c.id).school,
        pass: publicPass(billing?.passes.latestFor(c.id)),
        questions_today: questionsToday(c.id),
        ai_month: aiUsage.studentMonth(c.id),
        devices: devices.recent(c.id),
        has_password: locks.hasPassword(c.id),
        pilot: pilotSummary(db, c.id), // naloge za pilot: član? koliko fotografij je shranjenih (server/pilot-naloge.js)
      })),
      // Pilot: vprašanje »Ali bi za Evklid plačali?« 14 dni po začetku (samo polnoleten imetnik, server/pilot-ucinek.js).
      pilot_wtp: pilotWtp(db, p),
      max_children: profileSeats(p),
      device_warn_limit: deviceWarnLimit(),
      swap_blocked_until: devices.swapBlockedUntil(p.id),
      // Paketi v valuti, za evre s stopnjo (level) in družinska paketa (family); stari paketi so v planByKey.
      plans: plansFor(currencyOf(req, p)),
      currency: currencyOf(req, p),
      prices_draft: REGIONAL_DRAFT && currencyOf(req, p) !== "EUR",
      billing: stripe.enabled,
      email: mailer.enabled,
      promo: {
        redeemed: !!db.prepare("SELECT 1 FROM promo_redemptions WHERE parent_id = ?").get(p.id),
        available: promo.anyActive(),
        seats: promo.termsOf(p.id).seats,
        ...(p.is_admin && promoCfg.code ? { admin: { ...promo.stats(), url: `${baseUrl(req)}/?koda=${promoCfg.code}` } } : {}),
        ...(p.is_admin ? { codes: promo.list(), base_url: `${baseUrl(req)}/?koda=` } : {}),
      },
      ...(isAdminEmail(p) ? { guest_invite: true } : {}),
      ...(p.is_admin
        ? { billing_events: db.prepare("SELECT id, type, received_at, processed_at, error FROM billing_events ORDER BY received_at DESC, rowid DESC LIMIT 10").all() }
        : {}),
      consents: { adult: ADULT_TEXT, withdrawal: WITHDRAWAL_TEXT },
      grace_days: GRACE_DAYS,
      referral: { code: p.referral_code, url: `${baseUrl(req)}/?ref=${p.referral_code}`, rewards, days: REFERRAL_DAYS },
      consent_text: CONSENT_TEXT,
    };
  }

  app.get("/api/account", (req, res) => res.json(accountView(req, req.parent)));

  // Lastnik (EVKLID_ADMIN_EMAILS s potrjenim e-naslovom) ustvari povezavo za uporabo brez e-naslova.
  // Žeton je v odgovoru samo enkrat; v bazi je le njegov sha256.
  app.post("/api/admin/guest-invite", (req, res) => {
    if (!isAdminEmail(req.parent)) return res.status(403).json({ error: "Samo za lastnika." });
    const inv = invites.create(req.parent.id);
    res.status(201).json({ url: `${baseUrl(req)}/?gost=${inv.token}`, expires_at: inv.expires_at, max_uses: inv.max_uses });
  });

  // Cene in preizkus za stran za starše (starsi.html), brez prijave.
  app.get("/api/account/prices", (req, res) => {
    const country = String(req.query.country || "").toUpperCase();
    const currency = currencyOf(req, /^[A-Z]{2}$/.test(country) ? { country } : null);
    // Garancija na pristajalni strani: samo ob vklopljenem stikalu in živih plačilih (garancija.js guaranteeAdvertised),
    // samo pri cenah v evrih (garancija velja za slovensko lestvico ocen 1–5).
    const guarantee = currency === "EUR" && guaranteeAdvertised(stripe) ? { weeks: GUARANTEE.weeks, min_days: GUARANTEE.minDays, enroll_days: GUARANTEE.enrollDays } : null;
    res.json({ currency, plans: plansFor(currency), trial_days: TRIAL_DAYS, free_daily_questions: freeDailyQuestions(), min_age: minAgeOf(String(req.headers["cf-ipcountry"] || ""), country), ...(guarantee ? { guarantee } : {}) });
  });

  app.post("/api/account/promo", json, (req, res) => {
    if (req.parent.is_guest) return res.status(403).json({ error: "Najprej ustvari račun." });
    if (req.parent.guest_net && !req.parent.email_verified_at) return res.status(403).json({ error: "Najprej potrdi e-naslov." });
    const key = `promo|${req.parent.id}`;
    if (throttle.blocked(key)) return res.status(429).json({ error: "Preveč poskusov. Poskusi čez 15 minut." });
    // Darilna koda (DAR-XXXX-XXXX) ima svoja pravila (server/placila/darila.js).
    const r = gifts?.isGift(req.body?.code) ? gifts.redeem(req.parent, req.body?.code) : promo.redeem(req.parent, req.body?.code);
    if (r.error) {
      throttle.fail(key);
      return res.status(r.exhausted ? 410 : 400).json({ error: r.error });
    }
    // Darilo med preizkusom ali kodo začne teči pozneje, zato je datum v odgovoru (access je lahko še trial).
    res.json({ ...accountView(req, getParent(req.parent.id)), ...(r.gift ? { gift_until: r.until } : {}) });
  });

  // Na računalniku, kjer teče strežnik: »ta račun je moj«, da števec porabe vidim tudi na telefonu.
  app.post("/api/usage/claim", (req, res) => {
    if (!isLocalRequest(req)) return res.status(403).json({ error: "Samo na računalniku, kjer teče Evklid." });
    db.prepare("UPDATE parents SET is_admin = 1 WHERE id = ?").run(req.parent.id);
    res.json({ ok: true });
  });

  app.put("/api/account", json, (req, res) => {
    const p = req.parent;
    const fields = {};
    if (req.body?.name !== undefined) fields.name = cleanText(req.body.name, 60);
    if (req.body?.weekly_email !== undefined) fields.weekly_email = req.body.weekly_email ? 1 : 0;
    if (Object.keys(fields).length) update(p.id, fields);
    res.json(accountView(req, getParent(p.id)));
  });

  // Izvoz vseh podatkov (GDPR čl. 15 in 20).
  // Prenos vseh podatkov: s seje računa, ki si jo delijo profili na napravi, zato z geslom računa
  // (sicer bi brat prebral pogovore zaklenjenega sestrinega profila). Gost gesla nima. Račun brez gesla (prijava
  // z Apple) se potrdi z novo prijavo pri Applu (reauthHooks, kot izbris), sicer izvoza nikoli ne bi mogel.
  app.post("/api/account/export", json, async (req, res) => {
    const p = req.parent;
    const key = `export${p.id}|${req.ip}`;
    if (throttle.blocked(key)) return res.status(429).json({ error: "Preveč poskusov. Poskusi čez 15 minut." });
    if (acrossThrottle.blocked(`acct${p.id}`)) return res.status(429).json({ error: ACCT_BLOCKED });
    const reauth = async () => {
      for (const fn of reauthHooks) if (await fn(req, p, { revoke: false })) return true;
      return false;
    };
    if (!p.is_guest && !(await verifyPassword(String(req.body?.password || ""), p.password_hash)) && !(await reauth())) {
      throttle.fail(key);
      acrossThrottle.fail(`acct${p.id}`);
      audit(db, { req, parentId: p.id, action: "export", ok: false });
      return res.status(401).json({ error: "Napačno geslo." });
    }
    audit(db, { req, parentId: p.id, action: "export" });
    const parent = { ...p };
    for (const k of ["password_hash", "verify_token_hash", "verify_expires_at", "reset_token_hash", "reset_expires_at", "unsubscribe_token", "store_account_token"]) delete parent[k];
    const q = (sql, ...a) => db.prepare(sql).all(...a);
    const data = {
      exported_at: new Date().toISOString(),
      parent,
      consents: q("SELECT * FROM consents WHERE parent_id = ?", p.id),
      children: children(p.id).map((c) => ({
        ...c,
        vir: db.prepare("SELECT vir FROM students WHERE id = ?").get(c.id)?.vir ?? null, // od kod je profil prišel (server/rast.js)
        conversations: store.listConversations(c.id).map((conv) => ({
          ...conv,
          // Šifrirana besedila (server/crypto-polje.js) gredo v izvoz odšifrirana.
          messages: q("SELECT role, display_text, has_image > 0 AS has_image, created_at FROM messages WHERE conversation_id = ? ORDER BY id", conv.id).map((m) => {
            const { display_text, ...rest } = openMessage(m);
            return { role: rest.role, text: display_text, has_image: rest.has_image, created_at: rest.created_at };
          }),
          // Sprotni povzetek starejšega dela pogovora (server/povzetek.js), ki ga vidi le inštruktor.
          summary: store.getSummary(conv.id)?.text || null,
        })),
        events: q("SELECT subject, topic, topic_id, error, mode, flag, created_at FROM events WHERE student_id = ?", c.id),
        // Šibke točke iz iger, učbenika, pol, kartic in kviza (server/weaknesses.js): dnevne vsote po temi.
        weak_points: q("SELECT day, source, topic_id, subject, topic, n, wrong FROM skill_results WHERE student_id = ?", c.id),
        weak_points_seen: q("SELECT item, created_at FROM skill_seen WHERE student_id = ?", c.id),
        topics: q("SELECT * FROM topic_state WHERE student_id = ?", c.id),
        tasks: q("SELECT topic_id, mode, level, attempts, hint_used, solved, first_try_correct, last_answer, created_at FROM tasks WHERE student_id = ?", c.id),
        xp: q("SELECT amount, reason, created_at FROM xp_events WHERE student_id = ?", c.id),
        // Prijave napak (server/reports.js): tudi opomba učenca so njegovi podatki.
        reports: q("SELECT message_id, reason, note, question, answer, device, created_at FROM message_reports WHERE student_id = ?", c.id).map(openReport),
        lesson_reports: (() => {
          try {
            return q("SELECT kind, topic_id, step, reason, note, created_at FROM bug_reports WHERE student_id = ? AND kind = 'lesson'", c.id).map((r) => ({ ...r, note: unseal(r.note) }));
          } catch {
            return [];
          }
        })(),
        flashcards: (() => {
          try {
            return q("SELECT front, back, subject, topic, source, box, due, reviews, verified, zapisek_id, checked, created_at FROM flashcards WHERE student_id = ?", c.id).map((f) => ({ ...f, front: unseal(f.front), back: unseal(f.back) }));
          } catch {
            return [];
          }
        })(),
        // Naloge za člane pilota (server/pilot-naloge.js): ocene, opombe, anketa; sama fotografija (če je shranjena) je v data.other.pilot_photos.
        pilot: (() => {
          try {
            return {
              scans: q("SELECT s.cond, s.ok, s.note, s.problems, s.created_at, (p.scan_id IS NOT NULL) AS photo_saved, p.created_at AS photo_at FROM pilot_scans s LEFT JOIN pilot_photos p ON p.scan_id = s.id WHERE s.student_id = ?", c.id).map(
                (r) => ({ ...r, note: unseal(r.note), problems: r.problems ? JSON.parse(unseal(r.problems, "[]") || "[]") : [] }),
              ),
              features: q("SELECT feature, ok, note, created_at FROM pilot_features WHERE student_id = ?", c.id).map((r) => ({ ...r, note: unseal(r.note) })),
              survey: q("SELECT answers, created_at FROM pilot_survey WHERE student_id = ?", c.id),
            };
          } catch {
            return null;
          }
        })(),
        // Mnenja člana pilota (server/pilot-mnenja.js): ocena, besedili, razred ali letnik in dovoljenje za objavo.
        pilot_opinions: (() => {
          try {
            return q("SELECT label, stars, liked, bothers, grade, publish, consent, lang, created_at FROM pilot_mnenja WHERE student_id = ?", c.id).map((r) => ({ ...r, liked: unseal(r.liked), bothers: unseal(r.bothers) }));
          } catch {
            return [];
          }
        })(),
        // Igre (server/games.js, server/daily-puzzle.js); tabele morda še ne obstajajo.
        games: Object.fromEntries(
          [
            ["scores", "SELECT game, best, plays, tier, correct, wrong, cleared, updated_at FROM game_scores WHERE student_id = ?"],
            ["ratings", "SELECT engine, up, updated_at FROM game_ratings WHERE student_id = ?"],
            ["wishes", "SELECT week, genre FROM game_wishes WHERE student_id = ?"],
            ["unlocks", "SELECT concept, created_at FROM game_unlocks WHERE student_id = ?"],
            ["days", "SELECT day, plays, returns, pending, last_end FROM game_days WHERE student_id = ?"],
            ["concept_days", "SELECT day, concept, weak, correct, wrong FROM game_concept_days WHERE student_id = ?"],
            // Vzdevek na lestvicah (tudi pri dnevni uganki), lige, avatar in kovanci.
            ["league_profile", "SELECT nickname, tier, created_at FROM league_profiles WHERE student_id = ?"],
            ["leagues", "SELECT week, final_rank, final_xp, outcome FROM league_members WHERE student_id = ?"],
            ["avatar", "SELECT equipped FROM avatar_state WHERE student_id = ?"],
            ["avatar_items", "SELECT item, bought_at FROM avatar_items WHERE student_id = ?"],
            ["coins", "SELECT amount, reason, created_at FROM coin_events WHERE student_id = ?"],
            ["daily_puzzle", "SELECT day, level, started_at, finished_at, hints, wrong, solved, time_ms, total_ms FROM daily_puzzle WHERE student_id = ?"],
          ].map(([k, sql]) => {
            try {
              return [k, q(sql, c.id)];
            } catch {
              return [k, []];
            }
          }),
        ),
        schedule: (() => {
          try {
            const r = db.prepare("SELECT data FROM schedules WHERE student_id = ?").get(c.id);
            return r ? JSON.parse(unseal(r.data)) : null;
          } catch {
            return null; // tabela urnikov še ne obstaja
          }
        })(),
        // Vse prijave napak (lekcija, aplikacija, naloga …), ne samo lekcije.
        bug_reports: (() => {
          try {
            return q("SELECT kind, topic_id, step, reason, note, context, created_at FROM bug_reports WHERE student_id = ?", c.id).map((r) => ({ ...r, note: unseal(r.note), context: unseal(r.context) }));
          } catch {
            return [];
          }
        })(),
        // Mnenja in pogovor za povratne informacije (server/feedback.js).
        feedback: (() => {
          try {
            return q("SELECT kind, name, ratings, recommend, good, bad, ideas, interview, lang, device, screen, created_at FROM feedback WHERE student_id = ?", c.id).map((f) => ({
              ...f,
              name: unseal(f.name),
              good: unseal(f.good),
              bad: unseal(f.bad),
              ideas: unseal(f.ideas),
              interview: unseal(f.interview),
            }));
          } catch {
            return [];
          }
        })(),
      })),
    };
    // Vse ostale tabele z vrsticami računa ali profilov (server/zasebnost.js exportOtherTables): nove tabele niso izpuščene.
    // Zgodovina skenerja in neposlani odgovori so samo na napravi: doda jih aplikacija ob prenosu (public/offline.js deviceData).
    data.other = exportOtherTables(db, { parentId: p.id, studentIds: data.children.map((c) => c.id), skip: EXPORTED_TABLES });
    res.set("Content-Disposition", 'attachment; filename="evklid-podatki.json"');
    res.json(data);
  });

  // Tabele, ki jih izvoz zgoraj zajame posebej (ostale doda exportOtherTables).
  const EXPORTED_TABLES = [
    "consents", "conversations", "messages", "conversation_summaries", "events", "skill_results", "skill_seen", "topic_state", "tasks", "xp_events",
    "message_reports", "bug_reports", "flashcards", "game_scores", "game_ratings", "game_wishes", "game_unlocks", "game_days", "game_concept_days",
    "league_profiles", "league_members", "avatar_state", "avatar_items", "coin_events", "daily_puzzle", "schedules", "feedback",
    // Naloge pilota: ocene, opombe in anketa zgoraj (data.children[].pilot); fotografija in nagrade v data.other.
    "pilot_scans", "pilot_features", "pilot_survey",
    "pilot_mnenja",
  ];

  // Izbris računa z vsemi otroki in pogovori (GDPR čl. 17).
  app.delete("/api/account", json, async (req, res) => {
    const p = req.parent;
    // Brez gesla (račun s prijavo z Apple): potrditev z novo prijavo pri Applu (server/mobile).
    const reauth = async () => {
      for (const fn of reauthHooks) if (await fn(req, p, { revoke: true })) return true;
      return false;
    };
    const delKey = `delete${p.id}`;
    if (acrossThrottle.blocked(delKey)) return res.status(429).json({ error: "Preveč poskusov. Poskusi čez eno uro." });
    if (!p.is_guest && !(await verifyPassword(String(req.body?.password || ""), p.password_hash)) && !(await reauth())) {
      acrossThrottle.fail(delKey);
      audit(db, { req, parentId: p.id, action: "account_delete", ok: false });
      return res.status(401).json({ error: "Napačno geslo." });
    }
    // Naročnino iz App Store ali Google Play prekliče uporabnik v trgovini; Stripe je ne pozna.
    if (stripe.enabled && p.sub_id && PAID.has(p.sub_status) && (!p.sub_provider || p.sub_provider === "stripe")) {
      try {
        await stripe.request("DELETE", `/subscriptions/${p.sub_id}`);
      } catch (err) {
        log.error?.("[evklid] preklic naročnine ni uspel:", err.message);
        return res.status(502).json({ error: "Naročnine ni bilo mogoče preklicati. Poskusi znova ali jo prekliči z gumbom »Upravljaj naročnino in račune«." });
      }
    }
    guests.snapshotParent(p.id); // poraba gosta ostane šteta za omrežje
    // Zapis pilota in izbris v eni transakciji (pregled #477 B3 P3-3): če izbris pade, zapis pilot_prej_* ne ostane.
    db.exec("BEGIN IMMEDIATE");
    try {
      recordPilotDeletion(p);
      clearPilotLevels(p.id);
      db.prepare("DELETE FROM students WHERE parent_id = ?").run(p.id);
      db.prepare("DELETE FROM parents WHERE id = ?").run(p.id);
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
    // Dnevnik dostopov ostane brez povezave na izbrisani račun (brez e-naslova).
    audit(db, { req, parentId: p.id, action: "account_delete" });
    detachAudit(db, p.id);
    clearSessionCookie(req, res);
    res.json({ ok: true });
  });

  app.get("/api/account/unsubscribe", (req, res) => {
    const token = String(req.query.token || "");
    const p = token && db.prepare("SELECT id FROM parents WHERE unsubscribe_token = ?").get(token);
    if (p) update(p.id, { weekly_email: 0 });
    res.type("html").send(
      `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Evklid</title>` +
        `<body style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:0 16px"><h1>Evklid</h1><p>${
          p ? "Tedenskih poročil ne boste več prejemali. Ponovno jih vklopite v zavihku Račun." : "Povezava ni veljavna."
        }</p><p><a href="/">Odpri Evklid</a></p></body>`,
    );
  });

  // --- otroci (nadomesti osnovni GET/POST /api/students) ---
  // Zaklenjen profil (ima geslo, na tej napravi ni odklenjen): samo ime, nastavitve šele po odklepu.
  // needs_password: profil še nima gesla; aplikacija ob odprtju zahteva, da ga nastaviš (gost ne).
  app.get("/api/students", (req, res) => {
    const p = req.parent;
    res.json(
      children(p.id).map((c) => {
        if (p.is_guest) return c;
        if (!profileLockOn(p)) return c;
        if (locks.locked(c.id, req.deviceId)) return { id: c.id, name: c.name, locked: true };
        return { ...c, needs_password: !locks.hasPassword(c.id) };
      }),
    );
  });

  // Odklep profila na tej napravi z geslom profila. Profil brez gesla: { password, set: true } nastavi prvo geslo.
  app.post("/api/students/:id/unlock", json, async (req, res) => {
    const p = req.parent;
    const id = Number(req.params.id);
    if (p.is_guest) return res.json({ ok: true });
    const pw = req.body?.password;
    if (!locks.hasPassword(id)) {
      if (req.body?.set !== true) return res.status(409).json({ error: "Profil še nima gesla. Nastavi ga.", needs_password: true });
      const bad = checkProfilePassword(pw);
      if (bad) return res.status(400).json({ error: bad });
      await locks.setPassword(id, pw);
      locks.unlock(id, req.deviceId);
      audit(db, { req, parentId: p.id, action: "profile_password_set", target: `student:${id}` });
      return res.json({ ok: true });
    }
    const key = `${id}|${req.ip}`;
    if (profileThrottle.blocked(key)) return res.status(429).json({ error: "Preveč napačnih poskusov. Poskusi čez 15 minut." });
    // Meja za profil na vseh omrežjih ima okno 1 ure (acrossThrottle).
    if (acrossThrottle.blocked(`profile${id}`)) return res.status(429).json({ error: "Preveč napačnih poskusov. Poskusi čez eno uro." });
    if (!(await locks.verify(id, pw))) {
      profileThrottle.fail(key);
      acrossThrottle.fail(`profile${id}`);
      audit(db, { req, parentId: p.id, action: "profile_unlock_fail", target: `student:${id}`, ok: false });
      return res.status(401).json({ error: "Napačno geslo profila." });
    }
    profileThrottle.reset(key);
    locks.unlock(id, req.deviceId);
    res.json({ ok: true });
  });

  // Novo geslo profila (sprememba ali pozabljeno geslo): potrdi ga geslo računa ali sedanje geslo profila.
  app.post("/api/account/profile-password", json, async (req, res) => {
    const p = req.parent;
    if (p.is_guest) return res.status(403).json({ error: "Najprej ustvari račun v zavihku Račun.", guest: true });
    const id = Number(req.body?.student_id);
    if (!Number.isInteger(id) || ownerOf(id) !== p.id) return res.status(404).json({ error: "Učenec ne obstaja." });
    const key = `acct${p.id}|${req.ip}`;
    if (profileThrottle.blocked(key)) return res.status(429).json({ error: "Preveč napačnih poskusov. Poskusi čez 15 minut." });
    if (acrossThrottle.blocked(`acct${p.id}`)) return res.status(429).json({ error: ACCT_BLOCKED });
    const auth = String(req.body?.auth ?? "");
    if (!(await verifyPassword(auth, p.password_hash)) && !(await locks.verify(id, auth))) {
      profileThrottle.fail(key);
      acrossThrottle.fail(`acct${p.id}`);
      audit(db, { req, parentId: p.id, action: "profile_password_set", target: `student:${id}`, ok: false });
      return res.status(401).json({ error: "Napačno geslo računa." });
    }
    const bad = checkProfilePassword(req.body?.password);
    if (bad) return res.status(400).json({ error: bad });
    profileThrottle.reset(key);
    await locks.setPassword(id, req.body.password);
    audit(db, { req, parentId: p.id, action: "profile_password_set", target: `student:${id}` });
    res.json({ ok: true });
  });

  // Ta naprava prevzame profil (druga naprava se ustavi ob naslednji zahtevi).
  app.post("/api/students/:id/claim", (_req, res) => res.json({ ok: true }));

  // Odjava z vseh drugih naprav: seje staršev in odprti profili.
  app.post("/api/account/logout-others", (req, res) => {
    sessions.destroyOthers(req.parent.id, readCookie(req));
    devices.releaseOthers(childIds(req.parent.id), req.deviceId);
    locks.lockOtherDevices(childIds(req.parent.id), req.deviceId);
    accountLocks.lockAll(req.parent.id);
    accountLocks.unlock(req.parent.id, req.deviceId);
    res.json({ ok: true });
  });

  app.post("/api/students", json, async (req, res) => {
    const p = req.parent;
    if (!p.email_verified_at && !p.is_guest) return res.status(403).json({ error: "Najprej potrdi e-naslov (povezava je v e-pošti).", verify: true });
    // Število profilov = paket (preizkus: 2, brezplačno: 1). Menjava profila največ enkrat na 30 dni.
    const seats = profileSeats(p);
    if (childIds(p.id).length >= seats) {
      return res.status(400).json({
        error: seats === 1 ? "Tvoj paket ima 1 profil. Za drugega otroka izberi paket za 2 otroka v zavihku Račun." : `Tvoj paket ima ${seats} profila.`,
        seats: true,
      });
    }
    const blocked = devices.swapBlockedUntil(p.id);
    if (blocked) {
      return res.status(400).json({
        error: `Profil lahko zamenjaš največ enkrat na 30 dni. Nov profil lahko dodaš ${new Date(blocked).toLocaleDateString("sl-SI")}.`,
        swap: true,
      });
    }
    const name = cleanText(req.body?.name, 40);
    if (!name) return res.status(400).json({ error: "Vpiši ime ali vzdevek otroka." });
    const minor = isMinor(p);
    // Mladoletni imetnik (dijak, ki je račun ustvaril sam) ima samo svoj profil; za otroke soglaša starš.
    if (minor && childIds(p.id).length) {
      return res.status(403).json({ error: "Profile za druge otroke lahko doda samo polnoleten starš s svojim računom.", minor: true });
    }
    // Lasten profil (dijak ali študent soglaša sam): letnica iz datuma rojstva ob registraciji.
    const self = minor || req.body?.self === true;
    const year = self && p.birth_date ? Number(p.birth_date.slice(0, 4)) : Number(req.body?.birth_year);
    const now = new Date().getFullYear();
    if (self) {
      const minAge = minAgeOf(p.country);
      // Brez datuma rojstva (stari računi) štejemo previdno: rojeni v letu now-minAge so morda še mlajši.
      const oldEnough = p.birth_date ? ageOn(p.birth_date) >= minAge : now - year > minAge;
      if (!oldEnough) {
        return res.status(403).json({ error: `Sam lahko soglašaš od ${minAge}. leta. Za mlajše otroke profil ustvari starš in izbere »Za mojega otroka«.`, self_too_young: true });
      }
    }
    // Tudi odrasli študenti fakultet ustvarijo svoj profil, zato ni zgornje starostne meje za otroke.
    if (!Number.isInteger(year) || year < now - 90 || year > now - 5) return res.status(400).json({ error: "Vpiši letnico rojstva." });
    if (req.body?.consent !== true) return res.status(400).json({ error: self ? "Označi soglasje za obdelavo podatkov." : "Za otrokov profil je potrebno soglasje starša.", consent: true });
    // Geslo profila (neobvezno v API; brez njega ga aplikacija zahteva ob prvem odprtju profila).
    const profilePw = req.body?.profile_password;
    if (profilePw != null && profilePw !== "") {
      const bad = checkProfilePassword(profilePw);
      if (bad) return res.status(400).json({ error: bad, profile_password: true });
    }
    // Drugi profil na računu: odslej velja geslo profila, zato ga dobijo tudi obstoječi profili brez gesla
    // (sicer bi ga nastavil, kdor jih prvi odpre). { other_passwords: { "<id>": "geslo" } }
    const others = {};
    for (const id of childIds(p.id)) {
      const pw = req.body?.other_passwords?.[id];
      if (pw == null || pw === "" || locks.hasPassword(id)) continue;
      const bad = checkProfilePassword(pw);
      if (bad) return res.status(400).json({ error: bad, profile_password: true });
      others[id] = pw;
    }
    const under15 = now - year <= 15; // previdno: v letu 15. rojstnega dne še štejemo kot mlajšega od 15
    const s = store.createStudent(name, req.body?.settings);
    db.prepare("UPDATE students SET parent_id = ?, birth_year = ? WHERE id = ?").run(p.id, year, s.id);
    setSource(db, s.id, req.body?.vir); // od kod je prišel (server/rast.js)
    db.prepare("INSERT INTO consents (parent_id, student_id, child_birth_year, under_15, version, text, parent_email) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
      p.id,
      s.id,
      year,
      under15 ? 1 : 0,
      PRIVACY_VERSION,
      self ? SELF_CONSENT_TEXT : CONSENT_TEXT,
      p.email,
    );
    devices.logChange(p.id, "created", s.id);
    devices.use(s.id, req.deviceId, deviceLabel(req.get("user-agent")));
    if (profilePw) {
      await locks.setPassword(s.id, profilePw);
      locks.unlock(s.id, req.deviceId);
    }
    for (const [id, pw] of Object.entries(others)) {
      await locks.setPassword(Number(id), pw);
      locks.unlock(Number(id), req.deviceId);
    }
    res.status(201).json({ ...store.getStudent(s.id), birth_year: year });
  });

  // --- naročnina (Stripe) ---
  const needStripe = (res) => {
    if (stripe.enabled) return false;
    res.status(503).json({ error: "Plačila še niso nastavljena (manjka STRIPE_SECRET_KEY)." });
    return true;
  };

  async function ensureCustomer(p) {
    if (p.stripe_customer_id) return p.stripe_customer_id;
    const c = await stripe.request("POST", "/customers", { email: p.email, name: p.name || undefined, metadata: { parent_id: p.id, parent_uid: p.uid || undefined } });
    update(p.id, { stripe_customer_id: c.id });
    return c.id;
  }

  app.post("/api/billing/checkout", json, async (req, res) => {
    if (needStripe(res)) return;
    const p = req.parent;
    if (specialOf(p)) return res.status(409).json({ error: "Ta račun ima v pilotu poln paket brezplačno, zato naročnina ni potrebna.", pilot: true });
    const currency = currencyOf(req, p);
    const school = req.body?.school === true;
    const plan = school ? schoolPlanFor(req.body?.interval) : planForAccount(p.id, Number(req.body?.seats), req.body?.interval, currency);
    if (!plan) return res.status(400).json({ error: "Neznan paket." });
    if (school && currency !== "EUR") return res.status(400).json({ error: "Šolska cena je samo v evrih." });
    if (school && !childIds(p.id).some((id) => schools.hasLicence(id))) {
      return res.status(403).json({ error: "Ta cena velja samo za učence s šolsko licenco." });
    }
    if (PAID.has(p.sub_status)) return res.status(409).json({ error: "Naročnino že imaš. Paket spremeniš z gumbom »Upravljaj naročnino in račune«.", portal: true });
    // Naročnino sklene polnoletna oseba; mladoletni imetnik pošlje staršu povezavo za plačilo. Brez datuma rojstva: najprej ga vpiše.
    if (birthMissing(p)) return res.status(403).json(BIRTH_MISSING_PAY);
    if (isMinor(p)) return res.status(403).json({ error: "Naročnino plača starš. Pošlji mu povezavo za plačilo.", pay_link: true });
    if (req.body?.adult !== true || req.body?.withdrawal !== true) return res.status(400).json({ error: "Pred plačilom sta potrebni obe potrditvi.", consent: true });
    try {
      const customer = await ensureCustomer(p);
      const { prices } = school ? await stripe.ensureSchoolPrices() : await stripe.ensurePrices(currency);
      const base = baseUrl(req);
      // Preostanek preizkusa, aktivacijske ali darilne kode se prenese v Stripe (če sta še vsaj 2 dni; Stripe dovoli največ 730 dni).
      // Darilo stopnje (gift_level) samo, če odpre stopnjo paketa: darilo OŠ ne sme dati brezplačnega faksa do konca darila.
      const giftCarries = opensLevel(STOPNJE.includes(p.gift_level) ? p.gift_level : null, planLevel(plan) || "FAKS");
      const trialEnd = Math.min(
        Date.now() + 729 * 86400000,
        Math.max(Date.parse(p.trial_ends_at || 0) || 0, Date.parse(p.promo_until || 0) || 0, giftCarries ? Date.parse(p.gift_until || 0) || 0 : 0),
      );
      const subscription_data = { metadata: { parent_id: p.id, parent_uid: p.uid || undefined } };
      if (trialEnd - Date.now() > 49 * 3600000) subscription_data.trial_end = Math.floor(trialEnd / 1000);
      const session = await stripe.request("POST", "/checkout/sessions", {
        mode: "subscription",
        customer,
        client_reference_id: String(p.id),
        line_items: [{ price: prices[plan.key], quantity: 1 }],
        success_url: `${base}/?billing=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/?billing=cancel`,
        locale: currency === "EUR" ? "sl" : "auto",
        // Šolska cena je že znižana: brez dodatnih kod za popust.
        ...(school ? {} : { allow_promotion_codes: "true" }),
        subscription_data,
        metadata: { parent_id: p.id, parent_uid: p.uid || undefined },
      });
      const lang = /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(String(req.body?.lang || "")) ? req.body.lang : "sl";
      db.prepare("INSERT INTO billing_consents (parent_id, payer_email, kind, text) VALUES (?, ?, 'sub', ?)").run(p.id, p.email, `${ADULT_TEXT}\n${WITHDRAWAL_TEXT}\n[jezik: ${lang}]`);
      res.json({ url: session.url });
    } catch (err) {
      log.error?.("[evklid] Stripe checkout:", err.message);
      res.status(502).json({ error: "Plačilne strani ni bilo mogoče odpreti. Poskusi znova." });
    }
  });

  // Nadgradnja na višjo stopnjo: Stripe zaračuna razliko za preostanek obdobja takoj (always_invoice), dostop je takoj.
  app.post("/api/billing/upgrade", json, async (req, res) => {
    if (needStripe(res)) return;
    // j še nima s.p.: nadgradnja s proracijo samo v testnem načinu Stripa (EVKLID_STRIPE_LIVE_UPGRADE=1 jo vklopi).
    if (!stripe.testMode && env.EVKLID_STRIPE_LIVE_UPGRADE !== "1") return res.status(503).json({ error: "Nadgradnja trenutno ni na voljo." });
    const p = req.parent;
    if (birthMissing(p)) return res.status(403).json(BIRTH_MISSING_PAY);
    if (isMinor(p)) return res.status(403).json({ error: "Nadgradnjo plača starš. Pošlji mu povezavo za plačilo.", pay_link: true });
    const up = upgradeFor(p);
    const to = up?.options.find((o) => o.key === req.body?.plan);
    if (!to) return res.status(400).json({ error: "Ta nadgradnja ni mogoča." });
    try {
      const sub = await stripe.request("GET", `/subscriptions/${p.sub_id}`);
      const item = sub.items?.data?.[0];
      const { prices } = await stripe.ensurePrices("EUR");
      if (!item?.id || !prices[to.key]) throw new Error("ni postavke naročnine");
      // pending_if_incomplete: paket se zamenja šele, ko je razlika plačana; ob zavrnjeni kartici (ali 3-D Secure)
      // ostane stari paket (sicer bi bila višja stopnja odprta brez plačila in naročnina past_due). Čakajoče
      // posodobitve Stripe ne dovolijo spremembe metadata (parent_id je na naročnini že od nakupa).
      const updated = await stripe.request("POST", `/subscriptions/${p.sub_id}`, {
        items: [{ id: item.id, price: prices[to.key] }],
        proration_behavior: "always_invoice",
        payment_behavior: "pending_if_incomplete",
      });
      if (updated.pending_update) {
        return res.status(402).json({ error: "Plačilo razlike ni uspelo, paket ostaja isti. Preveri kartico z gumbom »Upravljaj naročnino in račune« in poskusi znova." });
      }
      await applySubscription(p.id, updated);
      db.prepare("DELETE FROM plan_changes WHERE parent_id = ?").run(p.id);
      audit(db, { req, parentId: p.id, actor: "parent", action: "plan_upgrade" });
      res.json(accountView(req, getParent(p.id)));
    } catch (err) {
      log.error?.("[evklid] Stripe nadgradnja:", err.message);
      res.status(502).json({ error: "Nadgradnja ni uspela. Poskusi znova." });
    }
  });

  app.post("/api/billing/portal", async (req, res) => {
    if (needStripe(res)) return;
    const p = req.parent;
    if (!p.stripe_customer_id) return res.status(400).json({ error: "Naročnine še nimaš." });
    try {
      // Preklop samo med mesečnim in letnim obdobjem sedanjega paketa (stripe.js ensurePortalConfig).
      const configuration = await stripe.ensurePortalConfig(PAID.has(p.sub_status) && (p.sub_provider || "stripe") === "stripe" ? p.sub_plan : null);
      const s = await stripe.request("POST", "/billing_portal/sessions", { customer: p.stripe_customer_id, return_url: `${baseUrl(req)}/?billing=portal`, configuration });
      res.json({ url: s.url });
    } catch (err) {
      log.error?.("[evklid] Stripe portal:", err.message);
      res.status(502).json({ error: "Strani za upravljanje naročnine ni bilo mogoče odpreti. Poskusi znova." });
    }
  });

  // opts.noFallback: brez prehoda na drugo naročnino (garancija: vrnjena so vsa plačila); opts.retry: napaka seznama
  // naročnin se vrže naprej (webhook odgovori 500 in Stripe dogodek pošlje znova); opts.adopt: notranji prehod.
  async function applySubscription(parentId, sub, opts = {}) {
    const item = sub.items?.data?.[0];
    const price = item?.price || {};
    const plan = planByKey(price.lookup_key);
    const seats = plan?.seats || Number(price.metadata?.seats) || 1;
    const end = sub.current_period_end ?? item?.current_period_end;
    const before = getParent(parentId);
    // Naročnina iz druge trgovine (npr. Apple v aplikaciji za iOS, sub_provider = 'apple'), ki še velja,
    // ima prednost: dogodek Stripa je ne prepiše.
    if (before?.sub_provider && before.sub_provider !== "stripe" && paidActive(before) && sub.id !== before.sub_id) {
      log.error?.("[evklid] Stripe naročnina prezrta: račun ima veljavno naročnino", before.sub_provider, parentId);
      return;
    }
    // Dve naročnini istega kupca (dvojni nakup, zamujen dogodek, pregledi #490 B, #497 A in B). Trenutna ostane, dokler
    // velja; druga postane trenutna samo, če je active/trialing (nikoli past_due, incomplete ali preklicana) in:
    // trenutna ni več active/trialing (npr. past_due v odlogu) ali je druga višji paket (nakup višje stopnje). Obnova
    // druge naročnine istega ali nižjega paketa tako ne preklaplja trenutne.
    const good = (s) => s?.status === "active" || s?.status === "trialing";
    const rank = (s) => monthlyOf(planByKey(s?.items?.data?.[0]?.price?.lookup_key))?.amount ?? 0;
    const curRank = monthlyOf(planByKey(before?.sub_plan))?.amount ?? 0;
    if (!opts.adopt && before?.sub_id && sub.id !== before.sub_id && paidActive(before)) {
      const curGood = before.sub_status === "active" || before.sub_status === "trialing";
      if (!good(sub) || (curGood && rank(sub) <= curRank)) {
        log.error?.("[evklid] dogodek druge naročnine prezrt (velja trenutna)", parentId, sub.id, sub.status, before.sub_id);
        return;
      }
    }
    // Trenutna ni več active/trialing (konec, unpaid, past_due), kupec pa ima v Stripu drugo active/trialing: velja ta
    // (najvišji paket). Napaka seznama: iz webhooka 500 (ponovna dostava), drugje kot doslej.
    if (!opts.noFallback && before?.sub_id === sub.id && !good(sub) && stripe.enabled && before.stripe_customer_id) {
      let other = null;
      try {
        const list = await stripe.request("GET", "/subscriptions", { customer: before.stripe_customer_id, status: "all", limit: 10 });
        other = (list?.data || []).filter((s) => s?.id && s.id !== sub.id && good(s)).sort((x, y) => rank(y) - rank(x))[0] || null;
      } catch (err) {
        log.error?.("[evklid] druge naročnine ni bilo mogoče preveriti:", err.message);
        if (opts.retry) throw err;
      }
      if (other) {
        log.error?.("[evklid] trenutna naročnina ne velja več, velja druga plačana naročnina istega kupca", parentId, sub.id, other.id);
        return applySubscription(parentId, other, { adopt: true });
      }
    }
    // Zamenjava paketa med veljavno naročnino: zapomnimo si stari paket za zajamčeni AI tega meseca (subGuarantee).
    const planKey = plan?.key || price.lookup_key || price.id || null;
    const fromG = before?.sub_plan && planGuarantee(planByKey(before.sub_plan));
    if (fromG && planKey && planKey !== (planByKey(before.sub_plan)?.key || before.sub_plan) && paidActive(before) && before.sub_id === sub.id) {
      // Druga zamenjava v istem mesecu: dnevi pred prvo ostanejo pri prvotnem deležu (plans.js upgradeFromUsd).
      const prev = JSON.parse(kv.get(`ai_upgrade_${parentId}`) || "null");
      const now = Date.now();
      const usd = upgradeFromUsd(prev?.sub === sub.id ? prev : null, fromG.usd || 0, now, paidWindow(before, now));
      kv.set(`ai_upgrade_${parentId}`, JSON.stringify({ from: before.sub_plan, usd, at: now, sub: sub.id }));
    }
    update(parentId, {
      // Prvo neuspelo plačilo začne odlog (GRACE_DAYS); ob uspešnem plačilu se ponastavi.
      past_due_since: sub.status === "past_due" ? before?.past_due_since || new Date().toISOString() : null,
      sub_id: sub.id,
      sub_status: sub.status,
      sub_plan: plan?.key || price.lookup_key || price.id || null,
      sub_seats: seats,
      sub_period_end: end ? new Date(end * 1000).toISOString() : null,
      sub_cancel_at_period_end: sub.cancel_at_period_end ? 1 : 0,
    });
    if (sub.status === "active") await maybeRewardReferral(parentId);
  }

  async function syncCustomer(p) {
    if (!p.stripe_customer_id) return;
    const list = await stripe.request("GET", "/subscriptions", { customer: p.stripe_customer_id, status: "all", limit: 10 });
    const subs = list.data || [];
    // Najprej active/trialing z najvišjim paketom (ne past_due pred aktivno, pregled #497 B P3-2), nato past_due, nato najnovejša.
    const rank = (s) => monthlyOf(planByKey(s?.items?.data?.[0]?.price?.lookup_key))?.amount ?? 0;
    const good = subs.filter((s) => s.status === "active" || s.status === "trialing").sort((a, b) => rank(b) - rank(a));
    const best = good[0] || subs.find((s) => PAID.has(s.status)) || [...subs].sort((a, b) => b.created - a.created)[0];
    if (best) await applySubscription(p.id, best, { adopt: true });
  }

  app.post("/api/billing/sync", async (req, res) => {
    if (needStripe(res)) return;
    try {
      await syncCustomer(req.parent);
    } catch (err) {
      log.error?.("[evklid] Stripe sync:", err.message);
    }
    res.json(accountView(req, getParent(req.parent.id)));
  });

  // Priporočilo: ko povabljeni prvič plača, oba dobita mesec brezplačno.
  async function giveFreeMonth(p) {
    if (stripe.enabled && p.stripe_customer_id && PAID.has(p.sub_status)) {
      try {
        await stripe.request("POST", `/customers/${p.stripe_customer_id}/balance_transactions`, {
          // Dobropis v višini mesečne cene naročnikovega paketa (tudi starega »2 otroka«).
          amount: -(monthlyOf(planByKey(p.sub_plan))?.amount ?? monthlyAmount(p.sub_seats || 1, planByKey(p.sub_plan)?.currency || "EUR")),
          currency: (planByKey(p.sub_plan)?.currency || "EUR").toLowerCase(),
          description: "Evklid: brezplačni mesec (priporočilo)",
        });
        return "credit";
      } catch (err) {
        log.error?.("[evklid] dobropis ni uspel, dodajam dneve:", err.message);
      }
    }
    const from = Math.max(Date.now(), Date.parse(p.bonus_until || 0) || 0);
    update(p.id, { bonus_until: isoIn(REFERRAL_DAYS, from) });
    return "bonus";
  }

  async function maybeRewardReferral(parentId) {
    const p = getParent(parentId);
    if (!p?.referred_by || p.referral_rewarded) return;
    if (db.prepare("UPDATE parents SET referral_rewarded = 1 WHERE id = ? AND referral_rewarded = 0").run(p.id).changes === 0) return;
    const referrer = getParent(p.referred_by);
    const referredReward = await giveFreeMonth(getParent(p.id));
    const referrerReward = referrer ? await giveFreeMonth(referrer) : null;
    db.prepare("INSERT INTO referral_rewards (referrer_id, referred_id, referrer_reward, referred_reward) VALUES (?, ?, ?, ?)").run(
      referrer?.id ?? null,
      p.id,
      referrerReward,
      referredReward,
    );
    const appUrl = baseUrl(null);
    if (referrer) await sendMail(referrer.email, referralRewardEmail(appUrl));
    await sendMail(p.email, referralRewardEmail(appUrl));
  }

  billing = mountBilling(app, {
    specialOf,
    paidPeriods,
    credits,
    db,
    offersFor,
    store,
    stripe,
    log,
    json,
    kv,
    promo,
    getParent,
    update,
    childIds,
    ownerOf,
    ensureCustomer,
    accessOf,
    baseUrl,
    sendMail,
    currencyOf,
    isMinor,
    birthMissing,
    applySubscription,
    syncCustomer,
    hasSchoolChild: (parentId) => childIds(parentId).some((id) => schools.hasLicence(id)),
    levelOf,
    planForParent: planForAccount,
    aiUsage,
    ageOf: ageOfStudent,
  });
  gifts = mountGifts(app, { db, stripe, json, log, getParent, ensureCustomer, baseUrl, isMinor, birthMissing, recordConsent: billing.recordConsent, paidActive, pilotOf: (p) => isPilotParent(p) });
  podari = mountPodari(app, { db, stripe, json, log, ensureCustomer, baseUrl, isMinor, birthMissing, pilotOf: (p) => isPilotParent(p) });
  // Garancija: ob vračilu se naročnina takoj prekliče (profili preidejo na brezplačni paket).
  // Vračilo zajame vsa plačila naročnin kupca (garancija.js refundAll), zato prekličemo vse njegove veljavne naročnine
  // (dvojni nakup) in ne preidemo na drugo (pregled #497 B, N8). Napaka seznama ustavi vračilo (skrbnik poskusi znova).
  async function cancelSubscription(p) {
    const list = p.stripe_customer_id ? await stripe.request("GET", "/subscriptions", { customer: p.stripe_customer_id, status: "all", limit: 100 }) : null;
    for (const s of list?.data || []) {
      if (s?.id && s.id !== p.sub_id && PAID.has(s.status)) await stripe.request("DELETE", `/subscriptions/${s.id}`);
    }
    const sub = await stripe.request("DELETE", `/subscriptions/${p.sub_id}`);
    await applySubscription(p.id, sub?.id ? sub : { ...p, id: p.sub_id, status: "canceled", items: { data: [{ price: { lookup_key: p.sub_plan } }] } }, { noFallback: true });
  }
  guarantee = mountGuarantee(app, { db, stripe, json, log, getParent, childIds, levelOf, paidActive, isMinor, birthMissing, cancelSubscription, addonOf: podari.addonOf });

  // Naročnina iz dogodka: sveže stanje iz Stripa (dogodki lahko pridejo v napačnem vrstnem redu).
  async function freshSubscription(obj) {
    if (!stripe.enabled || !obj?.id) return obj;
    try {
      const fresh = await stripe.request("GET", `/subscriptions/${obj.id}`);
      return fresh?.id === obj.id ? fresh : obj;
    } catch (err) {
      log.error?.("[evklid] sveža naročnina:", err.message);
      return obj;
    }
  }

  // Vsak dogodek obdelamo enkrat; ob napaki odgovorimo 500, da ga Stripe pošlje znova.
  async function handleEvent(event) {
    const obj = event.data?.object || {};
    // Plačilo, ki ga ni mogoče pripisati nobenemu računu (izbrisan račun, ponovno uporabljen id): zapis za ročno vračilo
    // (kv stripe_unmatched:<id dogodka>, ponoven-id.js). Samo pri dogodkih plačila, ne pri vsaki posodobitvi.
    const paying = /^checkout\.session\.(completed|async_payment_succeeded)$|^customer\.subscription\.created$/.test(event.type);
    const record = paying ? unmatchedRecorder(kv, event) : null;
    // Stara naročnina brez uid (prehod 24 h po namestitvi): ni pripisana, a tudi ni zapis »za vračilo«, ker jo
    // checkout.session.completed iste seje pripiše pravemu lastniku (ponovni pregled #511 B, P3-B). Napad tam
    // ujame preverjanje seje, ki ima svoj zapis.
    const unmatched = record && (event.type === "customer.subscription.created" ? (why, n) => why !== "brez_uid" && record(why, n) : record);
    // Po stranki; po id iz metapodatkov samo ob enakem parent_uid (ponovno uporabljen id, ponoven-id.js).
    const parentFor = () =>
      parentByCustomer(obj.customer) || (obj.metadata?.parent_id && parentFromMeta(getParent, obj.metadata.parent_id, obj, log, event.type, unmatched));
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        if (obj.metadata?.kind === "pass") {
          billing.completePassSession(obj, unmatched);
          break;
        }
        if (obj.metadata?.kind === "credit") {
          billing.completeCreditSession(obj, unmatched);
          break;
        }
        if (obj.metadata?.kind === "gift") {
          gifts.complete(obj, unmatched);
          break;
        }
        if (obj.metadata?.kind === "podari") {
          podari.complete(obj, unmatched);
          break;
        }
        if (obj.metadata?.pay_link && obj.subscription && stripe.enabled) {
          await billing.completeSubSession(obj, unmatched);
          break;
        }
        const p = parentFor() || (!obj.metadata?.parent_id && parentFromMeta(getParent, obj.client_reference_id, obj, log, event.type, unmatched));
        if (!p) break;
        if (!p.stripe_customer_id && obj.customer) update(p.id, { stripe_customer_id: obj.customer });
        if (obj.subscription && stripe.enabled) await applySubscription(p.id, await stripe.request("GET", `/subscriptions/${obj.subscription}`));
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const p = parentFor();
        if (p) await applySubscription(p.id, await freshSubscription(obj), { retry: true });
        break;
      }
      case "invoice.paid": {
        const p = parentFor();
        // Dejansko plačilo obdobja brez DDV in popustov (meja AI, vračilo; pregled #462 A2). Pred invoicePaid, da je
        // dodatek »Podari« na tem računu še prepoznan.
        if (p) paidPeriods.record(p.id, obj, { country: p.country, addonCents: podari.addonOf(obj).amount });
        podari.invoicePaid(obj); // stari dodatek »Podari Evklid« pri prvem plačilu naročnine (novih ni)
        // Nagrada za priporočilo šele ob plačilu naročnine (sam dodatek ob začetku preizkusa ne šteje).
        if (p && obj.amount_paid - podari.addonOf(obj).amount > 0) await maybeRewardReferral(p.id);
        break;
      }
      case "invoice.payment_failed": {
        const p = parentFor();
        if (!p) break;
        const claim = db.prepare("INSERT OR IGNORE INTO email_log (parent_id, kind, period) VALUES (?, 'payment_failed', ?)").run(p.id, String(obj.id || ""));
        if (claim.changes) await sendMail(p.email, paymentFailedEmail(baseUrl(null) + "/", GRACE_DAYS));
        break;
      }
      // Vračilo ali spor pri paketu pred testom: paket se takoj konča.
      case "charge.refunded": {
        // Vračilo plačila naročnine (tudi delno, npr. odstop): vrnjeni del ne šteje več v plačilo obdobja, meja AI
        // se zniža takoj (pregled #462 S1). Naročnino prekliče skrbnik (ali kupec) posebej.
        {
          const inv = typeof obj.invoice === "string" ? obj.invoice : obj.invoice?.id;
          const rp = inv && obj.amount > 0 ? parentByCustomer(obj.customer) : null;
          if (rp && paidPeriods.refund(rp.id, inv, obj.amount_refunded / obj.amount)) log.info?.("[evklid] vračilo naročnine: meja AI znižana", rp.id);
        }
        // Vračilo dokupa: kredit se odvzame (porabljeni del ostane porabljen).
        if (obj.amount_refunded > 0 && credits.refund(obj.payment_intent)) break;
        // »Podari«: samostojen nakup se konča tu; dodatek je na plačilu naročnine, zato obdelava teče naprej.
        if (obj.amount_refunded > 0 && podari.end(obj.payment_intent, "refunded", obj) === "month") break;
        const pass = billing.passes.byPayment(obj.payment_intent);
        if (pass && obj.amount_refunded > 0) billing.passes.end(pass.id, "refunded"); // tudi delno vračilo ob odstopu
        if (obj.amount_refunded > 0) gifts.end(obj.payment_intent, "refunded"); // darilna koda: tudi delno vračilo
        break;
      }
      case "charge.dispute.created": {
        if (credits.refund(obj.payment_intent)) break;
        if (gifts.end(obj.payment_intent, "disputed")) break;
        if (podari.end(obj.payment_intent, "disputed") === "month") break;
        const pass = billing.passes.byPayment(obj.payment_intent);
        if (pass) {
          billing.passes.end(pass.id, "disputed");
          break;
        }
        // Spor pri naročnini: naročnina se takoj prekliče, profili preidejo na brezplačni paket.
        if (!stripe.enabled || !obj.charge) break;
        const charge = await stripe.request("GET", `/charges/${obj.charge}`);
        const p = parentByCustomer(charge.customer);
        const inv = charge.invoice ? await stripe.request("GET", `/invoices/${typeof charge.invoice === "string" ? charge.invoice : charge.invoice.id}`) : null;
        const disputedSub = typeof inv?.subscription === "string" ? inv.subscription : inv?.subscription?.id;
        // Plačilo brez računa naročnine je enkratno (dokup, ki je že vrnjen, paket izbrisanega profila …): naročnine, ki
        // jo starš plačuje, ne prekličemo zaradi spora pri drugem nakupu; skrbnik ga reši v Stripu.
        if (!disputedSub) {
          log.error?.("[evklid] spor pri enkratnem plačilu, ki ga v bazi ni (naročnina ostane)", p?.id ?? null, obj.payment_intent || obj.charge);
          break;
        }
        if (p?.sub_id && PAID.has(p.sub_status) && (p.sub_provider || "stripe") === "stripe" && disputedSub === p.sub_id) {
          const sub = await stripe.request("DELETE", `/subscriptions/${p.sub_id}`);
          await applySubscription(p.id, sub?.id ? sub : { ...p, id: p.sub_id, status: "canceled", items: { data: [{ price: { lookup_key: p.sub_plan } }] } });
          log.error?.("[evklid] spor pri plačilu: naročnina preklicana", p.id);
        }
        break;
      }
    }
  }

  app.post("/api/stripe/webhook", express.raw({ type: "*/*", limit: "1mb" }), async (req, res) => {
    const raw = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : "";
    if (!verifyWebhook(raw, req.get("stripe-signature"), webhookSecret)) return res.status(400).json({ error: "Neveljaven podpis." });
    let event;
    try {
      event = JSON.parse(raw);
    } catch {
      return res.status(400).json({ error: "Neveljaven JSON." });
    }
    const id = typeof event.id === "string" && event.id ? event.id.slice(0, 100) : null;
    if (id) {
      db.prepare("INSERT OR IGNORE INTO billing_events (id, type) VALUES (?, ?)").run(id, String(event.type || "").slice(0, 100));
      const seen = db.prepare("SELECT processed_at FROM billing_events WHERE id = ?").get(id);
      if (seen?.processed_at) return res.json({ received: true, duplicate: true });
    }
    try {
      await handleEvent(event);
      if (id) db.prepare("UPDATE billing_events SET processed_at = datetime('now'), error = NULL WHERE id = ?").run(id);
      res.json({ received: true });
    } catch (err) {
      log.error?.("[evklid] webhook:", event.type, err.message);
      if (id) db.prepare("UPDATE billing_events SET error = ? WHERE id = ?").run(String(err.message).slice(0, 300), id);
      res.status(500).json({ error: "Napaka pri obdelavi." });
    }
  });

  // --- tedensko poročilo ---
  // Profili »Zame« (učenec 15+ sam): poročilo ga nagovori neposredno, brez nasvetov za starše.
  // Po prvem stavku (»Profil je moj.«), da stara soglasja ostanejo prepoznana tudi po preimenovanju aplikacije v besedilu.
  const selfPrefix = SELF_CONSENT_TEXT.slice(0, SELF_CONSENT_TEXT.indexOf(".") + 1);
  const selfIds = (parentId) =>
    db.prepare("SELECT student_id FROM consents WHERE parent_id = ? AND substr(text, 1, ?) = ?").all(parentId, selfPrefix.length, selfPrefix).map((r) => r.student_id);
  const reportFor = (p, req) =>
    buildWeeklyReport(db, p, children(p.id), {
      appUrl: baseUrl(req) + "/",
      unsubscribeUrl: `${baseUrl(req)}/api/account/unsubscribe?token=${p.unsubscribe_token}`,
      selfIds: selfIds(p.id),
      aiOf: (id) => aiUsage.studentMonth(id),
    });

  app.get("/api/account/weekly-report/preview", (req, res) => res.type("html").send(reportFor(req.parent, req).html));

  app.post("/api/account/weekly-report/send", async (req, res) => {
    const p = req.parent;
    if (p.is_guest) return res.status(400).json({ error: "Najprej ustvari račun." });
    if (!childIds(p.id).length) return res.status(400).json({ error: "Najprej dodaj profil." });
    const ok = await sendMail(p.email, reportFor(p, req));
    res.status(ok ? 200 : 502).json(ok ? { ok: true, dev: !mailer.enabled } : { error: "Pošiljanje ni uspelo." });
  });

  async function sendWeeklyAll(now = new Date()) {
    const period = weekKey(now);
    const parents = db.prepare("SELECT * FROM parents WHERE weekly_email = 1 AND email_verified_at IS NOT NULL").all();
    let sent = 0;
    for (const p of parents) {
      if (!childIds(p.id).length) continue;
      // Že poslano ta teden: poročila ne sestavljamo znova (urnik teče vsakih 30 minut).
      if (db.prepare("SELECT 1 FROM email_log WHERE parent_id = ? AND kind = 'weekly' AND period = ?").get(p.id, period)) continue;
      const report = reportFor(p, null);
      if (report.quiet) continue; // dva tedna brez vaje: ne pošiljamo praznih poročil
      const claim = db.prepare("INSERT OR IGNORE INTO email_log (parent_id, kind, period) VALUES (?, 'weekly', ?)").run(p.id, period);
      if (!claim.changes) continue;
      const ok = await sendMail(p.email, report);
      if (!ok) db.prepare("UPDATE email_log SET ok = 0 WHERE parent_id = ? AND kind = 'weekly' AND period = ?").run(p.id, period);
      else sent++;
    }
    return sent;
  }

  // --- dnevni opomnik do datuma cilja (ob 12.00 v Ljubljani, enkrat na dan za vsakega otroka) ---
  async function sendGoalRemindersAll(now = new Date()) {
    const { date } = ljNow(now);
    const parents = db.prepare("SELECT * FROM parents WHERE email_verified_at IS NOT NULL").all();
    let sent = 0;
    for (const p of parents) {
      for (const child of children(p.id)) {
        const n = reminderDays(child, date);
        if (n === null) continue;
        const period = `${date}:${child.id}`;
        const claim = db.prepare("INSERT OR IGNORE INTO email_log (parent_id, kind, period) VALUES (?, 'goal', ?)").run(p.id, period);
        if (!claim.changes) continue;
        const ok = await sendMail(p.email, buildGoalReminder(child, n, { appUrl: baseUrl(null) + "/" }));
        if (!ok) db.prepare("UPDATE email_log SET ok = 0 WHERE parent_id = ? AND kind = 'goal' AND period = ?").run(p.id, period);
        else sent++;
      }
    }
    return sent;
  }

  if (opts.scheduler !== false) {
    const timer = setInterval(() => {
      if (process.env.EVKLID_WEEKLY_EMAIL !== "0" && isSendTime()) sendWeeklyAll().catch((e) => log.error?.("[evklid] tedenska poročila:", e.message));
      if (process.env.EVKLID_GOAL_EMAIL !== "0" && isNoonTime()) sendGoalRemindersAll().catch((e) => log.error?.("[evklid] opomniki cilja:", e.message));
      billing.billingDaily().catch((e) => log.error?.("[evklid] dnevna opravila plačil:", e.message));
      try {
        guests.cleanup();
      } catch (e) {
        log.error?.("[evklid] čiščenje gostov:", e.message);
      }
      try {
        purgePilotKv(); // zapisi pilota preteklih mesecev, po koncu pilota vsi (pregled #477 A2)
      } catch (e) {
        log.error?.("[evklid] brisanje zapisov pilota:", e.message);
      }
      try {
        purgeOldGuarantees(db); // zapisi garancije 10 let po odločitvi
      } catch (e) {
        log.error?.("[evklid] brisanje starih garancij:", e.message);
      }
    }, 30 * 60000);
    timer.unref();
  }

  // Za mobilno aplikacijo (server/mobile): prijava z Apple, nakupi v trgovinah, obvestila.
  const mobile = { dropForeignAccess, confirmEmail, sendMail, appleLinkedEmail, audit, privacyVersion: PRIVACY_VERSION, db, sessions, locks, accountLocks, devices, accountOpen: (p, deviceId) => !lockable(p) || (!!deviceId && accountLocks.isUnlocked(p.id, deviceId)), getParent, parentByEmail, publicParent, accountView, createParent, checkAge, childIds, children, accessOf, signupThrottle, addReauth: (fn) => reauthHooks.push(fn) };
  return { ageOfStudent, pilotBeforeLevelChange, confirmOwner, noPassword, profileLockedFor: (req, sid) => !!req.parent && profileLocked(req.parent, sid, req.deviceId), credits, paidPeriods, marginGroupOf, aiUnlimited, shareWeightFor, ownerOf, freeOver, guaranteeFor, aiWindowOf: (pid) => paidWindow(getParent(pid)), poolFor, dailyLimitFor, aiUsage, topupPrompt, topupButton, offerKindFor, sendWeeklyAll, sendGoalRemindersAll, maybeRewardReferral, stripe, mailer, premiumFor, aiPremiumFor, modelCapFor, offersFor, rightsFor, lessonInteractive, ladderFor, schools, guests, billing, mobile };
}

