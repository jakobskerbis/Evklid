// Poraba AI: beleženje žetonov in stroška, dnevne omejitve, mesečni proračun.
import "./env.js";
import { costUsd } from "./claude.js";
import { BUDGET, MAX_BUDGET_USD, paceLevel, periodOf, budgetMode, fastMode } from "./proracun.js";
import { explanationsFor, allowanceStage } from "./accounts/plans.js";

const num = (k, d) => {
  const v = Number(process.env[k]);
  return Number.isFinite(v) && process.env[k] !== "" && process.env[k] !== undefined ? v : d;
};

export const LIMITS = {
  dailyQuestions: () => num("EVKLID_DAILY_QUESTIONS", 0), // 0 = brez omejitve
  // Dnevna meja vprašanj po proračunu (j 2026-11-04: meja naj raste s proračunom AI): preostali del
  // učenčevega deleža (+ njegov del dokupljenega kredita) razdeljen na preostale dni v mesecu, deljen z oceno
  // stroška enega vprašanja; zgornja meja (0 = brez nje). Spodnja meja je stalna meja paketa (pravice.js).
  questionUsd: () => Math.max(0.0001, num("EVKLID_QUESTION_USD", 0.005)),
  dailyQuestionsMax: () => Math.max(0, Math.floor(num("EVKLID_DAILY_QUESTIONS_MAX", 200))),
  monthlyBudgetUsd: () => BUDGET.baseUsd(), // 0 = brez omejitve; skrbnik ga spremeni v števcu porabe (server/proracun.js)
  // Na učenca na mesec: nad mehko mejo »Razloži podrobneje« uporabi hitri model,
  // nad trdo mejo inštruktor počaka do naslednjega meseca (Vadnica deluje naprej).
  studentSoftUsd: () => num("EVKLID_STUDENT_SOFT_USD", 1),
  studentMonthlyUsd: () => num("EVKLID_STUDENT_MONTHLY_USD", 3),
  // Koliko odgovorov zmogljivejšega modela (Opus) na učenca na dan.
  dailyDeep: () => num("EVKLID_DAILY_DEEP", 5),
  // Skrita omejitev Opusa za imetnike aktivacijske kode (ne plačujejo; j 2026-10-30): nad njo
  // tiho odgovori Sonnet, brez opombe. Na učenca: odgovorov na dan in $ na mesec (0 = brez meje).
  promoOpusDaily: () => num("EVKLID_PROMO_OPUS_DAILY", 2),
  promoOpusMonthUsd: () => num("EVKLID_PROMO_OPUS_MONTH_USD", 0.3),
  alertRatio: 0.8,
  historyTurns: () => num("EVKLID_HISTORY_TURNS", 10),
  // Zmogljivejši model dobi samo zadnje izmenjave (njegov predpomnilnik je ločen, vsak žeton je drag).
  deepHistoryTurns: () => num("EVKLID_DEEP_HISTORY_TURNS", 3),
  // Tekmovanja: privzeto hitri model z več razmisleka; 1 = vedno zmogljivejši model (prej).
  competitionDeep: () => process.env.EVKLID_COMPETITION_DEEP === "1",
};

// Za prikaz v evrih (Claude API zaračunava v dolarjih).
export const EUR_PER_USD = () => num("EVKLID_EUR_PER_USD", 0.87);

// Opombe, ko je zmogljivejši model nadomeščen s hitrejšim (pokažejo se nad odgovorom).
export const NOTES = {
  dailyDeep: (n) => `*(Danes si že ${n}× dobil najpodrobnejšo razlago. Do jutri so podrobne razlage malo manj poglobljene, a še vedno skrbno premišljene.)*\n\n`,
  // Brezplačni paket: nikoli Opus, da brezplačni učenci ne porabijo plačanega dobroimetja.
  free: "*(V brezplačnem paketu so podrobne razlage malo manj poglobljene, a še vedno skrbno premišljene.)*\n\n",
  softBudget: "*(Ta mesec si že veliko uporabljal podrobne razlage. Do konca meseca so malo manj poglobljene, a še vedno skrbno premišljene.)*\n\n",
  // Skupni mesečni proračun aplikacije je skoraj porabljen (server/proracun.js, raven 0).
  appBudget: "*(Ta mesec je v Evklidu veliko vprašanj, zato so podrobne razlage malo manj poglobljene, a še vedno skrbno premišljene.)*\n\n",
};

// Kako dolgo po napaki »ni dobroimetja« inštruktor ne kliče API-ja (en neuspel klic na 10 minut).
const CREDIT_PAUSE_MS = 10 * 60_000;
// Vsota uteži aktivnih učencev (delitev proračuna) se izračuna največ enkrat na minuto.
const SHARE_TTL_MS = 60_000;
// Nad tem deležem svojega dela proračuna učenec ne dobi več nadgradnje ali Opusa.
const SHARE_SOFT = 0.8;

export class Usage {
  constructor(db) {
    this.db = db;
    this.db.exec("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
    this.creditOutAt = 0;
    // Zadnja napaka »ni dobroimetja« ostane zapisana do prvega uspešnega klica (tudi čez ponovni zagon): obvestilo »Testna verzija«.
    this.lastCreditOut = Number(this.kvGet("ai_credit_out_at")) || 0;
    // Brez računov (lokalno): vsi profili imajo enako utež, dokupa ni.
    this.weightOf = () => 1;
    // Zajamčena mesečna poraba profila v $ (naročnina: OŠ 2, SŠ 3, faks 5; 0 = brez, deli se po utežeh).
    this.guaranteeOf = () => 0;
    this.ownerOf = () => null;
    this.freeOver = () => false;
    // Ali sme sporočilo o porabljenem delu predlagati dokup (ne pod 15 let in ne ob ponudbi paketa pred testom).
    this.topupPrompt = () => true;
    this.credits = null;
    this.shareCache = null;
  }
  // Računi (server/accounts/index.js): utež profila po paketu, lastnik računa in dokupljeni kredit.
  // freeOver: brezplačni profil je nad mejo brezplačnega paketa (s kreditom nadaljuje, ves strošek gre iz kredita).
  // guaranteeOf: zajamčena mesečna poraba naročnika (j 2026-11-01); ima prednost pred deleži brezplačnih.
  configure({ weightOf, ownerOf, credits, freeOver, guaranteeOf, topupPrompt } = {}) {
    if (weightOf) this.weightOf = weightOf;
    if (topupPrompt) this.topupPrompt = topupPrompt;
    if (guaranteeOf) this.guaranteeOf = guaranteeOf;
    if (ownerOf) this.ownerOf = ownerOf;
    if (freeOver) this.freeOver = freeOver;
    if (credits) this.credits = credits;
    this.shareCache = null;
  }
  kvGet(key) {
    return this.db.prepare("SELECT value FROM kv WHERE key = ?").get(key)?.value ?? null;
  }
  kvSet(key, value) {
    this.db.prepare("INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, String(value));
  }
  // Mesečni proračun: znesek skrbnika (ali EVKLID_MONTHLY_BUDGET_USD) + kredit, ki ga je skrbnik dodal ta mesec.
  // cap je meja z rezervo; do nje sme priti poraba iz skupnega proračuna.
  budget(now = new Date()) {
    const raw = this.kvGet("budget_base_usd");
    const base = raw !== null && Number.isFinite(Number(raw)) ? Number(raw) : BUDGET.baseUsd();
    const topup = Number(this.kvGet(`budget_topup_${periodOf(now).key}`)) || 0;
    const total = base > 0 ? base + topup : 0;
    return { base, topup, total, cap: total * (1 - BUDGET.reservePct() / 100), reserve_pct: BUDGET.reservePct() };
  }
  setBudgetBase(usd) {
    const v = Number(usd);
    if (!Number.isFinite(v) || v < 0 || v > MAX_BUDGET_USD) return false;
    this.kvSet("budget_base_usd", Math.round(v * 100) / 100);
    return true;
  }
  addBudget(usd, now = new Date()) {
    const v = Number(usd);
    if (!Number.isFinite(v) || v <= 0 || v > MAX_BUDGET_USD) return false;
    const k = `budget_topup_${periodOf(now).key}`;
    this.kvSet(k, Math.round(((Number(this.kvGet(k)) || 0) + v) * 100) / 100);
    return true;
  }
  todayTotal() {
    return this.db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE created_at >= date('now')").get().s;
  }
  // Poraba iz skupnega proračuna ta mesec (brez porabe iz dokupljenega kredita), za učenca ali vse.
  baseSpent(studentId = null) {
    return Math.max(0, this.monthTotal(studentId) - (this.credits?.usedMonth(studentId) || 0));
  }
  // Aktivni učenci (AI v zadnjih 30 dneh): vsota uteži brez naročnikov in rezervacija naročnikov
  // (vsak naročnik zajamčeno ali več, če je porabil več), enkrat na minuto.
  shares() {
    const now = Date.now();
    if (!this.shareCache || now - this.shareCache.at > SHARE_TTL_MS) {
      const ids = this.db
        .prepare("SELECT DISTINCT student_id AS id FROM usage WHERE student_id IS NOT NULL AND kind NOT IN ('reuse','hint') AND created_at >= datetime('now','-30 days')")
        .all()
        .map((r) => r.id);
      let sum = 0;
      let reserved = 0;
      const guaranteed = new Map();
      for (const id of ids) {
        const g = this.guaranteeOf(id) || 0;
        if (g > 0) {
          guaranteed.set(id, g);
          reserved += Math.max(g, this.baseSpent(id));
        } else sum += this.weightOf(id);
      }
      this.shareCache = { at: now, ids: new Set(ids), sum, reserved, guaranteed };
    }
    return this.shareCache;
  }
  // Vsota uteži učencev brez zajamčenega deleža, ki so v zadnjih 30 dneh uporabljali AI (in tega učenca).
  totalWeight(studentId = null) {
    const c = this.shares();
    const extra = studentId != null && !c.ids.has(studentId) && !(this.guaranteeOf(studentId) > 0) ? this.weightOf(studentId) : 0;
    return c.sum + extra;
  }
  // Del proračuna, rezerviran za naročnike (zajamčeni deleži), skupaj s tem učencem, če še ni med aktivnimi.
  reservedUsd(studentId = null) {
    const c = this.shares();
    const g = studentId != null && !c.ids.has(studentId) ? this.guaranteeOf(studentId) || 0 : 0;
    return c.reserved + g;
  }
  // Stanje proračuna in raven nadgradnje modelov (server/proracun.js).
  budgetState(now = new Date()) {
    const b = this.budget(now);
    const spent = this.baseSpent();
    const pace = paceLevel({ cap: b.cap, spent, today: this.todayTotal(), now });
    return { ...b, spent, ...pace, credit_out: this.creditOut() };
  }
  // Delež učenca. Naročnik (zajamčeno, j 2026-11-01): svoj zajamčeni znesek, tudi brez proračuna in ne glede na
  // druge. Ostali: proračun brez rezervacije naročnikov se deli po utežeh (plačljivi sorazmerno s ceno več).
  studentBudget(studentId, state = this.budgetState()) {
    const weight = this.weightOf(studentId);
    const owner = this.ownerOf(studentId);
    const base = { weight, spent: this.baseSpent(studentId), credit: this.credits?.balance(owner) || 0, owner };
    const g = this.guaranteeOf(studentId) || 0;
    if (g > 0) return { ...base, allowance: g, guaranteed: true };
    const pool = state.cap ? Math.max(0, state.cap - this.reservedUsd(studentId)) : 0;
    const allowance = pool ? (pool * weight) / Math.max(weight, this.totalWeight(studentId)) : 0;
    return { ...base, allowance, guaranteed: false };
  }
  // Ali je učenec (ali vsa aplikacija) porabil svoj del proračuna; z dokupljenim kreditom gre naprej.
  // Naročnika proračun nikoli ne ustavi: nad zajamčenim deležem odgovarja hitri model do dnevne meje vprašanj.
  overShare(studentId, state = this.budgetState()) {
    if (!state.cap) return false;
    const sb = this.studentBudget(studentId, state);
    if (sb.guaranteed) return false;
    return (sb.spent >= sb.allowance || state.spent >= state.cap) && sb.credit <= 0;
  }
  // Naročnik je porabil zajamčeni delež (brez dokupljenega kredita): inštruktor nadaljuje v hitrem načinu.
  fastOnly(studentId, state = this.budgetState()) {
    const sb = this.studentBudget(studentId, state);
    return !!sb.guaranteed && sb.spent >= sb.allowance && sb.credit <= 0;
  }
  // Prikaz porabe za učenca in starše (j 2026-11-01): preostale podrobne razlage, nikoli € ali $.
  // stage: ok | low (80 %) | out (100 %, hitri način); null brez zajamčenega deleža.
  allowance(studentId, state = this.budgetState()) {
    const sb = this.studentBudget(studentId, state);
    if (!sb.guaranteed) return { guaranteed: false, stage: null, percent: null, explanations_left: null };
    const spent = Math.max(0, sb.spent);
    return {
      guaranteed: true,
      stage: allowanceStage(spent, sb.allowance),
      percent: Math.min(100, Math.round((100 * spent) / sb.allowance)),
      explanations_left: explanationsFor(Math.max(0, sb.allowance - spent)) + explanationsFor(sb.credit),
      explanations_month: explanationsFor(sb.allowance),
    };
  }
  // Prilagodi izbrani način proračunu: pod načrtom močnejši model, nad njim hitri.
  // Učenec blizu svojega dela proračuna nadgradnje ne dobi.
  route(studentId, mode, { lite = false, maxTier = "deep", state = this.budgetState() } = {}) {
    const sb0 = this.studentBudget(studentId, state);
    // Naročnik nad zajamčenim deležem: hitri model (Haiku), brez nadgradnje, tudi brez proračuna.
    if (sb0.guaranteed && sb0.spent >= sb0.allowance && sb0.credit <= 0) {
      const down = fastMode(mode);
      return { mode: down, boosted: false, saved: false, fast: true, level: state.level };
    }
    if (!state.cap) return { mode, boosted: false, saved: false, level: state.level };
    const sb = sb0;
    // Naročnik pod zajamčenim deležem ima prednost: skupni proračun ga ne spusti pod običajno raven.
    if (sb.guaranteed && state.level < 1) return { mode, boosted: false, saved: false, level: state.level };
    // Tudi pri porabi iz dokupljenega kredita brez nadgradnje: kupljeni pogovori so ocenjeni za običajne modele.
    const near = sb.spent >= sb.allowance * SHARE_SOFT;
    return { ...budgetMode(mode, { level: state.level, maxTier, lite, overShare: near }), level: state.level };
  }
  // API račun nima dobroimetja (napaka 400): nekaj minut ne kličemo, učenec dobi jasno sporočilo.
  markCreditOut() {
    this.creditOutAt = this.lastCreditOut = Date.now();
    this.kvSet("ai_credit_out_at", this.lastCreditOut);
  }
  // Je v zadnjem dnevu zmanjkalo AI kredita in od takrat ni bilo nobenega uspešnega klica?
  creditOutRecently(ms = 24 * 3600_000) {
    return !!this.lastCreditOut && Date.now() - this.lastCreditOut < ms;
  }
  creditOut() {
    return !!this.creditOutAt && Date.now() - this.creditOutAt < CREDIT_PAUSE_MS;
  }
  log(studentId, model, usage, kind = "chat") {
    const cost = costUsd(model, usage || {});
    this.db
      .prepare(
        `INSERT INTO usage (student_id, model, kind, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_usd)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        studentId,
        model,
        kind,
        usage?.input_tokens || 0,
        usage?.output_tokens || 0,
        usage?.cache_read_input_tokens || 0,
        usage?.cache_creation_input_tokens || 0,
        cost,
      );
    this.creditOutAt = 0;
    if (this.lastCreditOut) {
      this.lastCreditOut = 0;
      this.kvSet("ai_credit_out_at", 0);
    }
    this.chargeCredit(studentId, cost);
    const month = this.baseSpent();
    const budget = this.budget().total;
    if (budget && month >= budget * LIMITS.alertRatio && month - cost < budget * LIMITS.alertRatio) {
      console.warn(`[evklid] OPOZORILO: porabljenih ${Math.round((month / budget) * 100)} % mesečnega proračuna (${month.toFixed(2)} $).`);
    }
    return cost;
  }
  // Del stroška nad deležem učenca (ali nad skupnim proračunom) gre iz dokupljenega kredita računa.
  chargeCredit(studentId, cost) {
    if (!this.credits || studentId == null || !(cost > 0)) return;
    // Meja brezplačnega paketa ob kreditu ne velja (accounts/index.js), zato tam plača kredit ves strošek, tudi brez proračuna.
    const free = !!this.freeOver(studentId);
    const state = this.budgetState();
    if (!state.cap && !free) return;
    const sb = this.studentBudget(studentId, state);
    if (!sb.owner || sb.credit <= 0) return;
    const over = free ? cost : Math.max(sb.spent - sb.allowance, state.spent - state.cap, 0);
    const take = Math.min(cost, over, sb.credit);
    if (take > 0) this.credits.use(sb.owner, studentId, Math.round(take * 1e6) / 1e6);
  }
  // Poraba ene vrste (npr. "verify") danes, v USD.
  kindToday(kind) {
    return this.db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE kind = ? AND created_at >= date('now')").get(kind).s;
  }
  monthTotal(studentId = null) {
    const q = `SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE created_at >= date('now','start of month')${studentId ? " AND student_id = ?" : ""}`;
    return studentId ? this.db.prepare(q).get(studentId).s : this.db.prepare(q).get().s;
  }
  // Število odgovorov zmogljivejšega modela danes.
  deepToday(studentId, deepModel) {
    return this.db
      .prepare("SELECT COUNT(*) AS n FROM usage WHERE student_id = ? AND kind = 'chat' AND model LIKE ? AND date(created_at) = date('now')")
      .get(studentId, `%${String(deepModel).replace(/^claude-/, "").split("-")[0]}%`).n;
  }
  // Ali je imetnik aktivacijske kode dosegel skrito omejitev Opusa (danes ali ta mesec).
  promoOpusSpent(studentId, deepModel) {
    const daily = LIMITS.promoOpusDaily();
    if (daily && this.deepToday(studentId, deepModel) >= daily) return true;
    const month = LIMITS.promoOpusMonthUsd();
    if (!month) return false;
    const like = `%${String(deepModel).replace(/^claude-/, "").split("-")[0]}%`;
    const spent = this.db
      .prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE student_id = ? AND model LIKE ? AND created_at >= date('now','start of month')")
      .get(studentId, like).s;
    return spent >= month;
  }
  // Izbere način klica za sporočilo. Vrne { mode, note }: note je opomba za učenca,
  // kadar je zmogljivejši model zaradi omejitve nadomeščen.
  // wantThink: prva ponovna razlaga (Haiku z več razmisleka); wantDeep: ponovna prošnja zapored (Opus).
  // free: brezplačni paket (brez naročnine, preizkusa ali kode) nikoli ne dobi zmogljivejšega modela.
  // capped: namesto Opusa Sonnet (šolska licenca vedno; Osebno in aktivacijska koda pred 3. zaporedno prošnjo, glej app.js).
  chooseMode(studentId, { wantDeep = false, wantThink = false, competition = false, lite = false, free = false, deepModel = "claude-opus", capped = false } = {}) {
    if (competition && !wantDeep && !LIMITS.competitionDeep()) return { mode: "think", note: null };
    if (free && (wantDeep || competition)) return { mode: "think", note: wantDeep ? NOTES.free : null };
    if (wantDeep || competition) {
      const daily = LIMITS.dailyDeep();
      if (daily && this.deepToday(studentId, deepModel) >= daily) return { mode: "think", note: NOTES.dailyDeep(daily) };
      // S proračunom: blizu svojega dela proračuna (brez dokupljenega kredita); brez njega mehka meja v $.
      const state = this.budgetState();
      // Naročnik (zajamčeni delež): podrobne razlage do 100 % deleža, potem hitri način (obvestilo pošlje app.js).
      const sb = this.studentBudget(studentId, state);
      if (sb.guaranteed) {
        if (sb.spent >= sb.allowance && sb.credit <= 0) return { mode: "think", note: null, fast: true };
        return { mode: capped ? "mid" : "deep", note: null };
      }
      if (state.cap) {
        const sb = this.studentBudget(studentId, state);
        if (sb.spent >= sb.allowance * SHARE_SOFT && sb.credit <= 0) return { mode: "think", note: NOTES.softBudget };
      } else {
        const soft = LIMITS.studentSoftUsd();
        if (soft && this.monthTotal(studentId) >= soft) return { mode: "think", note: NOTES.softBudget };
      }
      // Aktivacijska koda (capped): Sonnet (mode "mid") namesto Opusa.
      return { mode: capped ? "mid" : "deep", note: null };
    }
    if (wantThink) return { mode: "think", note: null };
    return { mode: lite ? "lite" : "chat", note: null };
  }
  // Odgovor brez klica modela (ponovna raba ali namig iz generatorja): zapišemo, da je viden prihranek.
  logSaved(studentId, kind) {
    this.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, ?, ?, 0)").run(studentId, kind === "reuse" ? "cache" : "koda", kind);
  }
  // Poraba učenca danes (UTC), v USD.
  studentToday(studentId) {
    return this.db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE student_id = ? AND created_at >= date('now')").get(studentId).s;
  }
  // Dnevna meja vprašanj iz proračuna (plačljivi paketi in šolska licenca; brezplačni paket ima svojo mejo).
  // Brez proračuna vrne null. Šteje del deleža, ki je ostal na začetku dneva, zato lastna vprašanja meje čez dan
  // ne znižajo (premakneta jo lahko nov aktiven učenec, ki spremeni delež, in poraba kredita); zadnji dan dobi
  // ves ostanek. credit: učenčev del kredita računa (privzeto ves kredit).
  dailyLimit(studentId, { state = this.budgetState(), now = new Date(), credit } = {}) {
    if (!state.cap) return null;
    const sb = this.studentBudget(studentId, state);
    const left = Math.max(0, sb.allowance - Math.max(0, sb.spent - this.studentToday(studentId))) + Math.max(0, credit ?? sb.credit);
    const startOfDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const days = Math.max(1, Math.round((periodOf(now).end - startOfDay) / 86_400_000));
    const n = Math.floor(left / days / LIMITS.questionUsd());
    const max = LIMITS.dailyQuestionsMax();
    return max ? Math.min(max, n) : n;
  }
  questionsToday(studentId) {
    return this.db
      .prepare(
        `SELECT COUNT(*) AS n FROM messages m JOIN conversations c ON c.id = m.conversation_id
         WHERE c.student_id = ? AND m.role = 'user' AND date(m.created_at) = date('now')`,
      )
      .get(studentId).n;
  }
  // Vrne besedilo razloga, če je klepet trenutno onemogočen, sicer null.
  blockReason(studentId) {
    const daily = LIMITS.dailyQuestions();
    if (daily && this.questionsToday(studentId) >= daily) {
      return `Danes si porabil vseh ${daily} vprašanj za inštruktorja. Jutri jih spet dobiš. Do takrat lahko neomejeno vadiš v Vadnici.`;
    }
    if (this.creditOut()) {
      return "Inštruktor je za nekaj minut nedosegljiv (dobroimetje za AI je porabljeno). Vadnica in razlage tem delujejo naprej.";
    }
    // Skupni proračun se deli po profilih (server/proracun.js); nad svojim delom učenec nadaljuje z dokupljenim kreditom.
    const state = this.budgetState();
    if (state.cap) {
      if (!this.overShare(studentId, state)) return null;
      // Pod 15 let ali ob ponudbi paketa pred testom brez poziva k dokupu (ponudbe.js, ena ponudba naenkrat).
      if (!this.topupPrompt(studentId)) {
        return state.spent >= state.cap
          ? "Inštruktor ta mesec ni več na voljo (dosežen je mesečni proračun). Vadnica in razlage tem delujejo naprej."
          : "Ta mesec si porabil svoj del inštruktorja. Spet ga dobiš 1. v mesecu. Vadnica in razlage tem delujejo naprej.";
      }
      return state.spent >= state.cap
        ? "Inštruktor ta mesec ni več na voljo (dosežen je mesečni proračun). Z dokupom porabe v zavihku Račun lahko nadaljuješ takoj. Vadnica in razlage tem delujejo naprej."
        : "Ta mesec si porabil svoj del inštruktorja. Z dokupom porabe v zavihku Račun lahko nadaljuješ takoj, sicer 1. v mesecu. Vadnica in razlage tem delujejo naprej.";
    }
    const per = LIMITS.studentMonthlyUsd();
    // Naročnika mesečna meja ne ustavi: nad zajamčenim deležem odgovarja hitri model (dnevna meja vprašanj velja).
    if (per && !(this.guaranteeOf(studentId) > 0) && this.monthTotal(studentId) >= per) {
      return "Ta mesec si dosegel omejitev vprašanj za inštruktorja. Vadnica in razlage tem delujejo naprej.";
    }
    return null;
  }
  summary() {
    const month = "u.created_at >= date('now','start of month')";
    const today = "date(u.created_at) = date('now')";
    const rows = this.db
      .prepare(
        `SELECT s.id, s.name, COUNT(CASE WHEN u.kind NOT IN ('reuse','hint') THEN 1 END) AS calls,
                COUNT(CASE WHEN u.kind IN ('reuse','hint') THEN 1 END) AS saved,
                COUNT(CASE WHEN u.model LIKE '%opus%' OR u.model LIKE '%sonnet%' OR u.model LIKE '%fable%' THEN 1 END) AS deep_calls,
                COALESCE(SUM(u.input_tokens),0) AS input_tokens,
                COALESCE(SUM(u.output_tokens),0) AS output_tokens, COALESCE(SUM(u.cache_read_tokens),0) AS cache_read_tokens,
                COALESCE(SUM(u.cost_usd),0) AS cost_usd,
                COUNT(CASE WHEN ${today} AND u.kind NOT IN ('reuse','hint') THEN 1 END) AS today_calls,
                COUNT(CASE WHEN ${today} AND u.kind IN ('reuse','hint') THEN 1 END) AS today_saved,
                COALESCE(SUM(CASE WHEN ${today} THEN u.cost_usd END),0) AS today_usd
         FROM students s LEFT JOIN usage u ON u.student_id = s.id AND ${month}
         GROUP BY s.id ORDER BY cost_usd DESC`,
      )
      .all();
    const byModel = this.db
      .prepare(
        `SELECT model, kind, COUNT(*) AS calls, SUM(input_tokens) AS input_tokens, SUM(output_tokens) AS output_tokens,
                SUM(cache_read_tokens) AS cache_read_tokens, SUM(cache_write_tokens) AS cache_write_tokens, SUM(cost_usd) AS cost_usd
         FROM usage u WHERE ${month} GROUP BY model, kind ORDER BY cost_usd DESC`,
      )
      .all();
    const total = this.monthTotal();
    const eur = EUR_PER_USD();
    const active = rows.filter((r) => r.calls + r.saved > 0).length;
    const now = new Date();
    const day = now.getUTCDate();
    const daysInMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
    const calls = byModel.filter((m) => m.kind !== "reuse" && m.kind !== "hint").reduce((a, m) => a + m.calls, 0);
    const saved = byModel.filter((m) => m.kind === "reuse" || m.kind === "hint").reduce((a, m) => a + m.calls, 0);
    const r4 = (x) => Math.round(x * 10000) / 10000;
    const state = this.budgetState();
    // Kako blizu meje je učenec (100 = inštruktor počaka do 1. v mesecu ali do dokupa):
    // s proračunom delež njegovega dela, sicer mesečna meja v $.
    const limitPct = (id, usd) => {
      if (state.cap) {
        const sb = this.studentBudget(id, state);
        return sb.allowance ? Math.round((100 * sb.spent) / sb.allowance) : null;
      }
      return LIMITS.studentMonthlyUsd() ? Math.round((100 * usd) / LIMITS.studentMonthlyUsd()) : null;
    };
    const todayUsd = rows.reduce((a, r) => a + r.today_usd, 0);
    return {
      today_usd: todayUsd,
      today_eur: r4(todayUsd * eur),
      today_calls: rows.reduce((a, r) => a + r.today_calls, 0),
      today_saved: rows.reduce((a, r) => a + r.today_saved, 0),
      month_calls: calls,
      month_usd: total,
      month_eur: r4(total * eur),
      eur_per_usd: eur,
      projected_eur: r4((total / Math.max(1, day)) * daysInMonth * eur),
      active_students: active,
      per_active_eur: active ? r4((total / active) * eur) : 0,
      per_message_eur: calls ? r4((total / calls) * eur) : 0,
      saved_answers: saved,
      budget_usd: this.budget().total || null,
      budget: state,
      daily_questions: LIMITS.dailyQuestions() || null,
      limits: {
        student_soft_usd: LIMITS.studentSoftUsd() || null,
        student_hard_usd: LIMITS.studentMonthlyUsd() || null,
        daily_deep: LIMITS.dailyDeep() || null,
      },
      by_model: byModel.map((m) => ({ ...m, cost_eur: r4(m.cost_usd * eur) })),
      students: rows.map((r) => ({
        ...r,
        cost_eur: r4(r.cost_usd * eur),
        today_eur: r4(r.today_usd * eur),
        limit_pct: r.calls ? limitPct(r.id, r.cost_usd) : null,
      })),
    };
  }
  // Za starše: poraba otroka ta mesec kot delež mesečne omejitve (brez zneskov).
  // Naročnik (zajamčeni delež): odstotek in preostale podrobne razlage; inštruktor se ne ustavi (hitri način).
  studentMonth(studentId) {
    const state = this.budgetState();
    const a = this.allowance(studentId, state);
    if (a.guaranteed) {
      return {
        ...a,
        soft_reached: a.stage !== "ok",
        hard_reached: false,
        fast: a.stage === "out",
        can_buy: !!this.credits && !!this.ownerOf(studentId),
      };
    }
    if (state.cap) {
      const sb = this.studentBudget(studentId, state);
      const pct = sb.allowance ? Math.round((sb.spent / sb.allowance) * 100) : 100;
      return {
        percent: Math.min(100, pct),
        soft_reached: sb.spent >= sb.allowance * SHARE_SOFT,
        hard_reached: sb.spent >= sb.allowance || state.spent >= state.cap,
        credit_usd: sb.credit,
        can_buy: !!this.credits && !!sb.owner,
      };
    }
    const usd = this.monthTotal(studentId);
    const hard = LIMITS.studentMonthlyUsd();
    const soft = LIMITS.studentSoftUsd();
    return {
      percent: hard ? Math.min(100, Math.round((usd / hard) * 100)) : null,
      soft_reached: !!soft && usd >= soft,
      hard_reached: !!hard && usd >= hard,
    };
  }
}

// Zgodovina za API v "kosih": ko pogovor preseže 2N izmenjav, odrežemo
// najstarejših N naenkrat. Tako ostane začetek zgodovine enak več potez
// zapored in predpomnilnik deluje.
// Zgodovina za zmogljivejši model: samo zadnjih N izmenjav (njegov predpomnilnik
// se z Haikujevim ne deli, zato bi vso zgodovino plačali po polni ceni).
export function recentHistory(messages, turns = LIMITS.deepHistoryTurns()) {
  if (!turns) return messages;
  let out = messages.slice(-(turns * 2 - 1));
  while (out.length && out[0].role !== "user") out = out.slice(1);
  return out;
}

export function windowHistory(messages, turns = LIMITS.historyTurns()) {
  if (!turns) return messages;
  const exchanges = Math.ceil(messages.length / 2);
  const drop = Math.max(0, Math.floor((exchanges - turns) / turns) * turns);
  let out = messages.slice(drop * 2);
  while (out.length && out[0].role !== "user") out = out.slice(1);
  return out;
}
