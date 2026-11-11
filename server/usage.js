// Poraba AI: beleženje žetonov in stroška, dnevne omejitve, mesečni proračun.
import "./env.js";
import { costUsd, MODEL_MID } from "./claude.js";
import { BUDGET, MAX_BUDGET_USD, paceLevel, periodOf, budgetMode, fastMode } from "./proracun.js";
import { explanationsFor, allowanceStage, detailedShare, freeStudentMonthlyUsd } from "./accounts/plans.js";
import { callMaxUsd } from "./meje-ai.js";
import { MODEL, MAX_TOKENS } from "./claude.js";

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
  // Fotografije v zgodovini: koliko zadnjih učenčevih sporočil obdrži sliko (server/usage.js staleImages).
  historyImageTurns: () => num("EVKLID_HISTORY_IMAGE_TURNS", 1),
  // Zmogljivejši model dobi samo zadnje izmenjave (njegov predpomnilnik je ločen, vsak žeton je drag).
  deepHistoryTurns: () => num("EVKLID_DEEP_HISTORY_TURNS", 3),
  // Tekmovanja: privzeto hitri model z več razmisleka; 1 = vedno zmogljivejši model (prej).
  competitionDeep: () => process.env.EVKLID_COMPETITION_DEEP === "1",
  // Srednja šola: hitri model z več razmisleka namesto navadnega (j 2026-11-04 po primerjavi modelov:
  // napake Haikuja pri SŠ 27 % → 7 %, Sonnet 0 %, a ~15× dražji). 0 = navadni hitri model.
  secondaryThink: () => process.env.EVKLID_SS_THINK !== "0",
  // Fakulteta (j 2026-11-01, načrt stopenj: »daljše razlage, več dokazov, pogosteje Sonnet«): privzeto hitri model z
  // več razmisleka (kot SŠ), prva »Razloži podrobneje« pri naročnini Sonnet. 0 = kot drugi učenci.
  universityMid: () => process.env.EVKLID_UNI_MID !== "0",
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

// Razlogi, zakaj inštruktor ne odgovori (blockInfo). Enako besedilo je v public/i18n/sl.js pod istim ključem.
// topupPrompt: true (poziv k dokupu), "birth" (dokup šele po vpisu datuma rojstva) ali false → pripona kode zavrnitve.
const tpSuffix = (tp) => (tp === "birth" ? "Birth" : tp ? "Topup" : "");
export const BLOCK_TEXT = {
  "block.daily": "Današnja vprašanja za inštruktorja so porabljena ({n} na dan). Jutri jih spet dobiš. Do takrat lahko neomejeno vadiš v Vadnici.",
  "block.creditOut": "Inštruktor je za nekaj minut nedosegljiv (dobroimetje za AI je porabljeno). Vadnica in razlage tem delujejo naprej.",
  // Meja paketa teče po obdobju paketa (naročnina: od dneva plačila), ne po koledarskem mesecu (pregled #462).
  "block.freeTailTopup": "V tem obdobju paketa si porabil vsa vprašanja za inštruktorja. Z dokupom porabe v zavihku Račun lahko nadaljuješ takoj, sicer z novim obdobjem paketa. Vadnica in razlage tem delujejo naprej.",
  "block.freeTail": "V tem obdobju paketa si porabil vsa vprašanja za inštruktorja. Spet jih dobiš z novim obdobjem paketa. Vadnica in razlage tem delujejo naprej.",
  "block.trialOut": "Vprašanja za inštruktorja v preizkusu so porabljena. Za nadaljevanje naj starš izbere naročnino v zavihku Račun. Vadnica in razlage tem delujejo naprej.",
  "block.passOut": "Paket pred testom je porabljen. Nadaljuješ v brezplačnem paketu. Vadnica in razlage tem delujejo naprej.",
  "block.longChat": "Ta pogovor je predolg za inštruktorja. Začni nov pogovor, pa lahko nadaljuješ.",
  "block.freeTailBirth": "V tem obdobju paketa si porabil vsa vprašanja za inštruktorja. Spet jih dobiš z novim obdobjem paketa. Vadnica in razlage tem delujejo naprej. Za dokup porabe mora imetnik računa najprej vpisati datum rojstva v zavihku Račun.",
  "block.capOutBirth": "Inštruktor ta mesec ni več na voljo (dosežen je mesečni proračun). Vadnica in razlage tem delujejo naprej. Za dokup porabe mora imetnik računa najprej vpisati datum rojstva v zavihku Račun.",
  "block.shareOutBirth": "Ta mesec si porabil svoj del inštruktorja. Spet ga dobiš 1. v mesecu. Vadnica in razlage tem delujejo naprej. Za dokup porabe mora imetnik računa najprej vpisati datum rojstva v zavihku Račun.",
  "block.capOut": "Inštruktor ta mesec ni več na voljo (dosežen je mesečni proračun). Vadnica in razlage tem delujejo naprej.",
  "block.shareOut": "Ta mesec si porabil svoj del inštruktorja. Spet ga dobiš 1. v mesecu. Vadnica in razlage tem delujejo naprej.",
  "block.capOutTopup": "Inštruktor ta mesec ni več na voljo (dosežen je mesečni proračun). Z dokupom porabe v zavihku Račun lahko nadaljuješ takoj. Vadnica in razlage tem delujejo naprej.",
  "block.shareOutTopup": "Ta mesec si porabil svoj del inštruktorja. Z dokupom porabe v zavihku Račun lahko nadaljuješ takoj, sicer 1. v mesecu. Vadnica in razlage tem delujejo naprej.",
  "block.monthLimit": "Ta mesec si dosegel omejitev vprašanj za inštruktorja. Vadnica in razlage tem delujejo naprej.",
  // Brezplačni paket (server/accounts/index.js): dnevna in mesečna meja ter namig, kako do več vprašanj (hint).
  "block.freeDaily": "Današnja brezplačna vprašanja za inštruktorja so porabljena ({n} na dan). Jutri jih spet dobiš. Do takrat lahko neomejeno vadiš v Vadnici.",
  "block.freeMonth": "Ta mesec si porabil brezplačna vprašanja za inštruktorja. Vadnica in lekcije delujejo naprej neomejeno.",
  "block.freePool": "Brezplačna vprašanja za inštruktorja so ta mesec za vse porabljena. Vadnica in lekcije delujejo naprej neomejeno.",
  "block.hintGuest": "Za več vprašanj ustvari račun v zavihku Račun.",
  "block.hintParent": "Za več vprašanj naj starš izbere naročnino v zavihku Račun.",
  "block.hintAdult": "Za več vprašanj izberi naročnino v zavihku Račun.",
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
    // Zajamčena mesečna poraba profila v $ (naročnina, plans.js planGuarantee; 0 = brez, deli se po utežeh).
    this.guaranteeOf = () => 0;
    // Družina (j 2026-11-04): profili, ki si delijo en skupen delež (vključno s tem), ali null (delež profila).
    this.poolOf = () => null;
    this.ownerOf = () => null;
    this.freeOver = () => false;
    // Ali sme sporočilo o porabljenem delu predlagati dokup (ne pod 15 let in ne ob ponudbi paketa pred testom).
    this.topupPrompt = () => true;
    this.credits = null;
    this.shareCache = null;
    // Trda meja AI (server/meje-ai.js): dodatne meje profila iz računov (brezplačni paket, šola, paket pred testom,
    // kredit) kot [{ key, usd, spent, code }]; rezervacije klicev v teku po ključu meje.
    this.capsOf = () => [];
    this.totalOf = () => null;
    this.minCall = null;
    // Besedilo zavrnitve po kodi; računi dodajo namig (gost, starš) in kodo preizkusa (block.trialOut).
    this.blockFor = (studentId, code) => ({ error: BLOCK_TEXT[code], code });
    // Začetek obdobja meje zajamčenega paketa (ISO) ali null = koledarski mesec (j 2026-11-06, pregled #462).
    this.periodOf = () => null;
    // Lastnik (server/accounts/pilot-meja.js): brez meje inštruktorja (brez trde meje, dnevnih meja in zaustavitve
    // proračuna); poraba se še vedno zapiše (log).
    this.unlimitedOf = () => false;
    // Poraba prejšnjih računov istega člana pilota (accounts/index.js pilotPriorSpent, pregled #477 B1).
    this.priorSpentOf = () => 0;
    // Član pilota (accounts/index.js): ob meji besedilo brez »obdobja paketa« (block.shareOut, pregled #477 B3 P3-1).
    this.pilotOf = () => false;
    // Ob prvi rezervaciji klica AI za profil (accounts/index.js: zaklep stopnje pilota ob prvi porabi v mesecu, #477).
    this.onUse = null;
    this.onLog = null;
    this.inflight = new Map();
  }
  // Računi (server/accounts/index.js): utež profila po paketu, lastnik računa in dokupljeni kredit.
  // freeOver: brezplačni profil je nad mejo brezplačnega paketa (s kreditom nadaljuje, ves strošek gre iz kredita).
  // guaranteeOf: zajamčena mesečna poraba naročnika (j 2026-11-01); ima prednost pred deleži brezplačnih.
  // poolOf: profili s skupnim deležem (Družina); poraba se tedaj šteje za vse skupaj.
  // totalOf: vrednost paketa (meja + brezplačni rep) v $ ali null; trda meja ni nikoli višja (capsFor).
  configure({ weightOf, ownerOf, credits, freeOver, guaranteeOf, poolOf, topupPrompt, capsOf, onLog, totalOf, periodOf, minCall, blockFor, creditOverOf, unlimitedOf, priorSpentOf, pilotOf, onUse } = {}) {
    if (onUse) this.onUse = onUse;
    if (unlimitedOf) this.unlimitedOf = unlimitedOf;
    if (priorSpentOf) this.priorSpentOf = priorSpentOf;
    if (pilotOf) this.pilotOf = pilotOf;
    if (minCall) this.minCall = minCall;
    if (blockFor) this.blockFor = blockFor;
    if (creditOverOf) this.creditOverOf = creditOverOf;
    if (capsOf) this.capsOf = capsOf;
    if (totalOf) this.totalOf = totalOf;
    if (periodOf) this.periodOf = periodOf;
    if (onLog) this.onLog = onLog;
    if (weightOf) this.weightOf = weightOf;
    if (poolOf) this.poolOf = poolOf;
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
      const pools = new Set(); // skupen delež družine se rezervira enkrat za vse profile
      for (const id of ids) {
        const g = this.guaranteeOf(id) || 0;
        if (g > 0) {
          guaranteed.set(id, g);
          const group = this.poolOf(id);
          const tag = group ? [...group].sort((a, b) => a - b).join(",") : null;
          if (tag && pools.has(tag)) continue;
          if (tag) pools.add(tag);
          reserved += Math.max(g, this.groupSpent(id, group));
        } else sum += this.weightOf(id);
      }
      this.shareCache = { at: now, ids: new Set(ids), sum, reserved, guaranteed, pools };
    }
    return this.shareCache;
  }
  // Vsota uteži učencev brez zajamčenega deleža, ki so v zadnjih 30 dneh uporabljali AI (in tega učenca).
  totalWeight(studentId = null) {
    const c = this.shares();
    const extra = studentId != null && !c.ids.has(studentId) && !(this.guaranteeOf(studentId) > 0) ? this.weightOf(studentId) : 0;
    return c.sum + extra;
  }
  // Del proračuna, rezerviran za naročnike (zajamčeni deleži), skupaj s tem učencem, če še ni med aktivnimi
  // (pri skupnem deležu družine, če ni aktiven noben profil družine).
  reservedUsd(studentId = null) {
    const c = this.shares();
    const group = studentId != null ? this.poolOf(studentId) : null;
    const counted = studentId == null || (group ? group.some((id) => c.ids.has(id)) : c.ids.has(studentId));
    return c.reserved + (counted ? 0 : this.guaranteeOf(studentId) || 0);
  }
  // Poraba iz skupnega proračuna za profil ali za vse profile skupnega deleža (Družina).
  groupSpent(studentId, group = this.poolOf(studentId)) {
    return group ? group.reduce((t, id) => t + this.baseSpent(id), 0) : this.baseSpent(studentId);
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
    if (g > 0) {
      // Družina: skupen delež, poraba vseh profilov skupaj. g je ves mesečni strošek AI paketa (ceiling, trda meja);
      // allowance = del za podrobne razlage (g / 1,15), od tam do meje hitri način (plans.js FAST_TAIL, detailedShare).
      const group = this.poolOf(studentId);
      // Poraba šteje po obdobju paketa (naročnina: od začetka plačanega obdobja, ne koledarski mesec), brez porabe
      // iz kredita; poraba izbrisanih profilov računa šteje (izbris in nov profil meje ne ponastavita).
      const since = this.periodStart(studentId);
      const spent = (group || [studentId]).reduce((t, id) => t + this.spentSince(id, since), 0) + this.orphanSpent(owner, since) + (this.priorSpentOf(studentId, since) || 0);
      return { ...base, spent, group, pool: !!group, allowance: detailedShare(g), ceiling: g, guaranteed: true };
    }
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
  // Naročnik je porabil delež in še 15 % deleža v hitrem načinu (brez kredita): velja dnevna meja brezplačnega
  // paketa (server/accounts/index.js dailyLimitFor), da paket ne preseže svojega stroška.
  overCeiling(studentId, state = this.budgetState()) {
    const sb = this.studentBudget(studentId, state);
    return !!sb.guaranteed && sb.spent >= sb.ceiling - 1e-9 && sb.credit <= 0;
  }
  // Naročnik je nad mejo paketa porabil še brezplačni rep (kot brezplačni profil: freeStudentMonthlyUsd na profil,
  // pri Družini za vse profile skupaj), brez kredita: inštruktor do novega obdobja paketa ali do dokupa ne odgovarja.
  overFreeTail(studentId, state = this.budgetState()) {
    const sb = this.studentBudget(studentId, state);
    return !!sb.guaranteed && sb.credit <= 0 && sb.spent >= sb.ceiling + freeStudentMonthlyUsd() * (sb.group?.length || 1) - 1e-9;
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
      pool: !!sb.pool, // skupen delež družine: obvestila in preostanek veljajo za vse profile skupaj
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
    // Lastnik (brez meje) ima prednost kot naročnik pod deležem, a nikoli ni »blizu svojega dela«.
    const unlimited = this.unlimitedOf(studentId);
    // Naročnik pod zajamčenim deležem ima prednost: skupni proračun ga ne spusti pod običajno raven.
    if ((sb.guaranteed || unlimited) && state.level < 1) return { mode, boosted: false, saved: false, level: state.level };
    // Tudi pri porabi iz dokupljenega kredita brez nadgradnje: kupljeni pogovori so ocenjeni za običajne modele.
    const near = !unlimited && sb.spent >= sb.allowance * SHARE_SOFT;
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
        `INSERT INTO usage (student_id, model, kind, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_usd, parent_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        studentId == null ? null : this.ownerOf(studentId) ?? null,
      );
    this.creditOutAt = 0;
    if (this.lastCreditOut) {
      this.lastCreditOut = 0;
      this.kvSet("ai_credit_out_at", 0);
    }
    this.chargeCredit(studentId, cost);
    try {
      this.onLog?.(studentId, cost);
    } catch {}
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
    // Lastnik (unlimitedOf) je brez meje: nič »nad mejo«, zato kredit ostane nedotaknjen (poraba se še zapiše).
    if (this.unlimitedOf(studentId)) return;
    // Meja brezplačnega paketa ob kreditu ne velja (accounts/index.js), zato tam plača kredit ves strošek, tudi brez proračuna.
    const free = !!this.freeOver(studentId);
    const state = this.budgetState();
    const sb = this.studentBudget(studentId, state);
    // Zajamčen paket in paket pred testom: kredit plača porabo nad mejo paketa TUDI brez proračuna (trda meja AI šteje
    // kredit v mejo, zato se mora res porabiti; pregled #462). Paket: creditOverOf (accounts), zajamčen: nad podrobnim delom.
    const passOver = free ? null : this.creditOverOf?.(studentId);
    if (!state.cap && !free && !sb.guaranteed && passOver == null) return;
    if (!sb.owner || sb.credit <= 0) return;
    const over = free
      ? cost
      : passOver != null
        ? Math.max(passOver, 0)
        : sb.guaranteed
          ? Math.max(sb.spent - sb.allowance, state.cap ? state.spent - state.cap : 0, 0)
          : Math.max(sb.spent - sb.allowance, state.spent - state.cap, 0);
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
  // Število odgovorov zmogljivejšega modela danes; prekinjeni odgovori štejejo (sicer bi prekinitev obšla dnevno mejo).
  deepToday(studentId, deepModel) {
    return this.db
      .prepare("SELECT COUNT(*) AS n FROM usage WHERE student_id = ? AND kind IN ('chat', 'prekinjeno') AND model LIKE ? AND date(created_at) = date('now')")
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
  // secondary: srednješolec (privzeto Haiku z več razmisleka, LIMITS.secondaryThink).
  // university: študent; brez lahkega načina in brezplačnega paketa privzeto Haiku z več razmisleka, prva
  // »Razloži podrobneje« Sonnet (»mid«) z istimi mejami kot podrobna razlaga (LIMITS.universityMid).
  chooseMode(studentId, { wantDeep = false, wantThink = false, competition = false, secondary = false, university = false, lite = false, free = false, deepModel = "claude-opus", capped = false } = {}) {
    if (competition && !wantDeep && !LIMITS.competitionDeep()) return { mode: "think", note: null };
    if (free && (wantDeep || competition)) return { mode: "think", note: wantDeep ? NOTES.free : null };
    const uni = university && !free && !lite && LIMITS.universityMid();
    const uniMid = uni && wantThink && !wantDeep;
    if (wantDeep || competition || uniMid) {
      const daily = LIMITS.dailyDeep();
      // Prva podrobna razlaga na faksu je Sonnet: dnevna meja šteje odgovore Sonneta, tudi brez računov (deepModel Opus).
      const counted = uniMid ? MODEL_MID : deepModel;
      if (this.unlimitedOf(studentId)) return { mode: capped || uniMid ? "mid" : "deep", note: null };
      if (daily && this.deepToday(studentId, counted) >= daily) return { mode: "think", note: NOTES.dailyDeep(daily) };
      // S proračunom: blizu svojega dela proračuna (brez dokupljenega kredita); brez njega mehka meja v $.
      const state = this.budgetState();
      // Naročnik (zajamčeni delež): podrobne razlage do 100 % deleža, potem hitri način (obvestilo pošlje app.js).
      const sb = this.studentBudget(studentId, state);
      if (sb.guaranteed) {
        if (sb.spent >= sb.allowance && sb.credit <= 0) return { mode: "think", note: null, fast: true };
        return { mode: capped || uniMid ? "mid" : "deep", note: null };
      }
      if (state.cap) {
        const sb = this.studentBudget(studentId, state);
        if (sb.spent >= sb.allowance * SHARE_SOFT && sb.credit <= 0) return { mode: "think", note: NOTES.softBudget };
      } else {
        const soft = LIMITS.studentSoftUsd();
        if (soft && this.monthTotal(studentId) >= soft) return { mode: "think", note: NOTES.softBudget };
      }
      // Aktivacijska koda (capped) in prva podrobna razlaga na faksu: Sonnet (mode "mid") namesto Opusa.
      return { mode: capped || uniMid ? "mid" : "deep", note: null };
    }
    if (wantThink) return { mode: "think", note: null };
    // Brezplačni paket ostane pri navadnem Haikuju (0,2 $ na mesec bi sicer zadoščalo za ~3× manj odgovorov).
    // Prva »Razloži podrobneje« je pri SŠ isti model z novo, podrobnejšo prošnjo; druga gre višje kot doslej.
    if (secondary && !lite && !free && LIMITS.secondaryThink()) return { mode: "think", note: null };
    if (uni) return { mode: "think", note: null };
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
    // Skupen delež družine: ostanek se deli med profile skupnega deleža (kredit je že učenčev del).
    const today = sb.group ? sb.group.reduce((t, id) => t + this.studentToday(id), 0) : this.studentToday(studentId);
    const shareLeft = Math.max(0, sb.allowance - Math.max(0, sb.spent - today)) / (sb.group?.length || 1);
    const left = shareLeft + Math.max(0, credit ?? sb.credit);
    const startOfDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const days = Math.max(1, Math.round((periodOf(now).end - startOfDay) / 86_400_000));
    const n = Math.floor(left / days / LIMITS.questionUsd());
    const max = LIMITS.dailyQuestionsMax();
    return max ? Math.min(max, n) : n;
  }
  // Vprašanja danes (server/db.js question_log): izbris pogovora jih ne zmanjša.
  questionsToday(studentId) {
    return this.db.prepare("SELECT COALESCE(SUM(n),0) AS n FROM question_log WHERE student_id = ? AND day = date('now')").get(studentId).n;
  }
  // Vrne besedilo razloga, če je klepet trenutno onemogočen, sicer null.
  blockReason(studentId) {
    return this.blockInfo(studentId)?.error ?? null;
  }
  // Razlog za odgovor 429: { error, code, params? }. code je ključ i18n (public/i18n/sl.js »block.*«), da ga
  // odjemalec pokaže v jeziku vmesnika; error ostane slovensko besedilo (rezerva, če ključa ni).
  // Koda ob porabljeni meji paketa: pilot »Ta mesec … 1. v mesecu« (nima obdobja paketa), sicer block.freeTail*.
  tailCode(studentId) {
    return this.pilotOf(studentId) ? "block.shareOut" : `block.freeTail${tpSuffix(this.topupPrompt(studentId))}`;
  }
  blockInfo(studentId) {
    // Lastnik: ustavi ga le prazno dobroimetje API (takrat ne odgovori nihče).
    if (this.unlimitedOf(studentId)) return this.creditOut() ? this.blockFor(studentId, "block.creditOut") : null;
    const daily = LIMITS.dailyQuestions();
    if (daily && this.questionsToday(studentId) >= daily) {
      return { error: BLOCK_TEXT["block.daily"].replace("{n}", daily), code: "block.daily", params: { n: daily } };
    }
    const out = (code) => this.blockFor(studentId, code);
    if (this.creditOut()) return out("block.creditOut");
    // Skupni proračun se deli po profilih (server/proracun.js); nad svojim delom učenec nadaljuje z dokupljenim kreditom.
    const state = this.budgetState();
    // topupPrompt: true (poziv k dokupu), "birth" (dokup šele po vpisu datuma rojstva) ali false.
    const tail = tpSuffix;
    if (this.overFreeTail(studentId, state)) return out(this.tailCode(studentId));
    if (state.cap) {
      if (!this.overShare(studentId, state)) {
        const hard = this.hardBlock(studentId);
        return hard ? out(hard) : null;
      }
      // Pod 15 let ali ob ponudbi paketa pred testom brez poziva k dokupu (ponudbe.js, ena ponudba naenkrat).
      const capped = state.spent >= state.cap;
      return out(`${capped ? "block.capOut" : "block.shareOut"}${tail(this.topupPrompt(studentId))}`);
    }
    // Trda meja (server/meje-ai.js): ni prostora niti za najcenejši klic.
    const hard = this.hardBlock(studentId);
    if (hard) return out(hard);
    const per = LIMITS.studentMonthlyUsd();
    // Naročnika mesečna meja ne ustavi: nad zajamčenim deležem odgovarja hitri model (dnevna meja vprašanj velja).
    if (per && !(this.guaranteeOf(studentId) > 0) && this.monthTotal(studentId) >= per) return out("block.monthLimit");
    return null;
  }
  // ---------- trda meja AI (j 2026-11-06, server/meje-ai.js) ----------
  // Poraba izbrisanih profilov računa od since (privzeto ta mesec; student_id NULL, parent_id ostane).
  orphanSpent(owner, since = this.monthStart()) {
    if (owner == null) return 0;
    const s = this.db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE parent_id = ? AND student_id IS NULL AND created_at >= ?").get(owner, since).s;
    // Brez dela, ki ga je plačal kredit (pregled #462 S5: sicer dvojno štetje kot pri spentSince).
    return Math.max(0, s - (this.credits?.orphanUsedSince?.(owner, since) || 0));
  }
  // Začetek tega meseca v obliki stolpca created_at (UTC).
  monthStart() {
    return this.db.prepare("SELECT datetime('now','start of month') AS d").get().d;
  }
  // Začetek obdobja meje profila v obliki created_at: obdobje paketa (periodOf) ali koledarski mesec.
  periodStart(studentId) {
    const iso = this.periodOf(studentId);
    const t = iso ? Date.parse(iso) : NaN;
    return Number.isFinite(t) ? new Date(t).toISOString().slice(0, 19).replace("T", " ") : this.monthStart();
  }
  // Poraba profila od since brez porabe iz dokupljenega kredita.
  spentSince(studentId, since) {
    const s = this.db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE student_id = ? AND created_at >= ?").get(studentId, since).s;
    return Math.max(0, s - (this.credits?.usedSince?.(studentId, since) || 0));
  }
  // Meje, ki veljajo za naslednji klic profila: { key, usd, spent, code }. Naročnina, darilo, preizkus, koda in bonus:
  // vsa vrednost paketa (meja + brezplačni rep) + dokupljeni kredit; ostalo iz računov (capsOf).
  capsFor(studentId, state = this.budgetState()) {
    if (studentId != null && this.unlimitedOf(studentId)) return [];
    const caps = [];
    const sb = this.studentBudget(studentId, state);
    if (sb.guaranteed) {
      const n = sb.group?.length || 1;
      caps.push({
        key: sb.group ? `pool:${[...sb.group].sort((a, b) => a - b).join(",")}` : `s:${studentId}`,
        usd: Math.min(sb.ceiling + freeStudentMonthlyUsd() * n, this.totalOf(studentId) ?? Infinity) + Math.max(0, sb.credit || 0),
        spent: sb.spent,
        code: this.tailCode(studentId),
      });
    }
    for (const c of [].concat(this.capsOf(studentId) || [])) if (c && Number.isFinite(c.usd)) caps.push(c);
    return caps;
  }
  // Prostor do najbližje meje v $ (poraba in rezervacije klicev v teku odštete); Infinity brez meje (brez računov).
  headroom(studentId, caps = this.capsFor(studentId)) {
    let h = Infinity;
    for (const c of caps) h = Math.min(h, c.usd - (c.spent || 0) - (this.inflight.get(c.key) || 0));
    return h;
  }
  // Najcenejši klic (hitri model, kratek način, ~30k vhodnih žetonov): brez prostora zanj je inštruktor ustavljen.
  // Strežnik (server/app.js) nastavi minCall na dejansko rezervo »lite« (sistemski prompt, orodja, kratko vprašanje).
  minCallUsd() {
    return Math.max(callMaxUsd(MODEL, 30_000, MAX_TOKENS.lite), this.minCall?.() || 0);
  }
  // Meja z najmanj prostora: { cap, room } (room = Infinity brez meja).
  tightest(studentId, caps = this.capsFor(studentId)) {
    let cap = null;
    let room = Infinity;
    for (const c of caps) {
      const r = c.usd - (c.spent || 0) - (this.inflight.get(c.key) || 0);
      if (r < room) [cap, room] = [c, r];
    }
    return { cap, room };
  }
  // Koda razloga, če meja ne dopušča niti najcenejšega klica, sicer null.
  hardBlock(studentId) {
    const caps = this.capsFor(studentId);
    if (!caps.length) return null;
    const need = this.minCallUsd();
    const c = caps.find((x) => x.usd - (x.spent || 0) - (this.inflight.get(x.key) || 0) < need);
    return c ? c.code || "block.monthLimit" : null;
  }
  // Ena rezervacija za en klic (skener, branje zapisa, urnik, anketa): hold ali null, če ne gre pod mejo.
  guard(studentId, usd) {
    const h = this.hold(studentId);
    return h.take(usd) ? h : null;
  }
  // Strošek aplikacije (ne učenca) z dnevnim zneskom: npr. preverjanje odgovorov in kartic (server/verify.js
  // VERIFY_DAILY_USD, j 2026-11-06). Rezervacija pod »danes porabljeno vrste kind + klici v teku ≤ dailyUsd«;
  // dailyUsd < 0 = brez meje. Vrne hold ali null.
  appHold(kind, dailyUsd, usd) {
    const caps = () => (dailyUsd >= 0 ? [{ key: `app:${kind}`, usd: dailyUsd, spent: this.kindToday(kind) }] : []);
    const h = this.hold(null, caps);
    return h.take(usd) ? h : null;
  }
  // Odgovor 429, ko klic ne gre pod trdo mejo.
  // Koda je koda meje, ki je vezala (najmanj prostora), z namigom računov (blockFor). freshUsd (klepet): rezerva
  // najcenejšega odgovora v novem pogovoru; če je zanjo prostor, je kriv le dolg pogovor (block.longChat).
  guardBlock(studentId, freshUsd = null) {
    const { cap, room } = this.tightest(studentId);
    const code = freshUsd != null && room >= freshUsd ? "block.longChat" : cap?.code || "block.monthLimit";
    return { ...this.blockFor(studentId, code), limit: true };
  }
  // Rezervacija za klice ene zahteve: take(usd) rezervira, če gre pod vse meje profila (sicer false);
  // settle(rezervirano) jo sprosti, ko je strošek zapisan; release() sprosti vse ob koncu zahteve.
  // capsFn: meje, ki veljajo (privzeto meje profila); za strošek aplikacije npr. dnevni znesek preverjanja (appHold).
  hold(studentId, capsFn = () => this.capsFor(studentId)) {
    const keys = capsFn().map((c) => c.key);
    const self = this;
    let held = 0;
    let row = null;
    const add = (usd) => {
      for (const k of keys) {
        const v = (self.inflight.get(k) || 0) + usd;
        if (v > 1e-12) self.inflight.set(k, v);
        else self.inflight.delete(k);
      }
      held += usd;
      if (studentId != null) self.persistHold(row, studentId, held, (id) => (row = id));
    };
    return {
      take(usd) {
        if (!(usd >= 0)) return false;
        if (self.headroom(studentId, capsFn()) < usd) return false;
        // Klic AI gre naprej: zaklep stopnje pilota nastopi zdaj, ob prvi porabi v mesecu (j 2026-11-10), ne ob pogledu.
        if (studentId != null && usd > 0 && self.onUse) {
          try {
            self.onUse(studentId);
          } catch {}
        }
        add(usd);
        return true;
      },
      settle(usd) {
        add(-Math.min(Math.max(0, usd), held));
      },
      release() {
        if (held > 0) add(-held);
        held = 0;
      },
      get held() {
        return held;
      },
    };
  }
  // Rezervacija v bazi (ai_holds): ob ponovnem zagonu med klicem se strošek ne izgubi (pregled #462 S4).
  persistHold(row, studentId, held, setRow) {
    try {
      if (held > 1e-12) {
        if (row == null) setRow(Number(this.db.prepare("INSERT INTO ai_holds (student_id, usd) VALUES (?, ?)").run(studentId, held).lastInsertRowid));
        else this.db.prepare("UPDATE ai_holds SET usd = ? WHERE id = ?").run(held, row);
      } else if (row != null) {
        this.db.prepare("DELETE FROM ai_holds WHERE id = ?").run(row);
        setRow(null);
      }
    } catch {
      // brez tabele (stara baza v testu): samo v pomnilniku
    }
  }
  // Ob zagonu strežnika: rezervacije prejšnjega procesa (klic je morda tekel in bil plačan) se zapišejo kot poraba
  // profila v višini rezerve (zgornja meja). En primerek strežnika (SQLite), zato so vse vrstice ob zagonu ostanki.
  recoverHolds() {
    try {
      const rows = this.db.prepare("SELECT id, student_id, usd FROM ai_holds").all();
      for (const r of rows) {
        if (r.student_id == null || !(r.usd > 0) || !this.db.prepare("SELECT 1 FROM students WHERE id = ?").get(r.student_id)) continue;
        // Kot usage.log (pregled #462 H4/K3-5): lastnik računa (ownerOf), del nad mejo iz kredita, onLog (bazeni, šola).
        this.db
          .prepare("INSERT INTO usage (student_id, model, kind, cost_usd, parent_id) VALUES (?, 'rezerva', 'prekinjeno', ?, ?)")
          .run(r.student_id, r.usd, this.ownerOf(r.student_id) ?? null);
        this.chargeCredit(r.student_id, r.usd);
        try {
          this.onLog?.(r.student_id, r.usd);
        } catch {}
      }
      this.db.prepare("DELETE FROM ai_holds").run();
      if (rows.length) console.warn(`[evklid] ob zagonu zapisanih ${rows.length} rezervacij klicev AI iz prejšnjega procesa`);
      return rows.length;
    } catch {
      return 0;
    }
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
    // Lastnik: brez meje, zato brez odstotka in opozoril.
    if (this.unlimitedOf(studentId)) return { percent: null, soft_reached: false, hard_reached: false, unlimited: true };
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

// Starejše fotografije v zgodovini (j 2026-11-06, dolgi pogovori): slika bi šla modelu z vsakim
// naslednjim sporočilom (branje predpomnilnika, ob premiku okna ali menjavi modela znova zapis, v rezervi
// meje AI vsakič IMAGE_TOKENS). Sliko obdržijo samo zadnja `keep` učenčeva sporočila v zgodovini (privzeto 1:
// »Razloži podrobneje« in takojšnje vprašanje o sliki jo še vidita); starejše dobijo kratko besedilo, nalogo
// pa je inštruktor prepisal v odgovoru (»Prebral sem: …«, prompts/system_prompt.md). Odvisno le od položaja
// od konca, zato se sporočilo spremeni enkrat in ostane enako – predpomnilnik se ne podira vsak krog.
// Baza se ne spremeni (rok hrambe fotografij ureja server/zasebnost.js).
export const OLD_IMAGE_TEXT = "[Fotografija iz tega sporočila ni več priložena. Nalogo s nje si prepisal v odgovoru na to sporočilo; če potrebuješ sliko (npr. skico), prosi učenca, naj jo pošlje znova.]";
// Nadomestila slik (stara slika, izbrisana po roku hrambe, zavrnjena): niso učenčevo besedilo (pregled #462 A7:
// sodba kode o nalogi s slike in vtipkanim besedilom je sicer izpadla, ko je slika postala stara).
export const isImagePlaceholder = (text) => typeof text === "string" && (text === OLD_IMAGE_TEXT || /^\[Fotografija /.test(text));
export function staleImages(messages, keep = LIMITS.historyImageTurns()) {
  let users = 0;
  const out = messages.slice();
  for (let i = out.length - 1; i >= 0; i--) {
    const m = out[i];
    if (m.role !== "user") continue;
    users++;
    if (users <= keep || !Array.isArray(m.content) || !m.content.some((b) => b?.type === "image")) continue;
    // En nadomestni blok na sporočilo (več slik → eno besedilo), besedilo učenca ostane.
    const blocks = [];
    for (const b of m.content) {
      if (b?.type !== "image") blocks.push(b);
      else if (!blocks.some((x) => x?.text === OLD_IMAGE_TEXT)) blocks.push({ type: "text", text: OLD_IMAGE_TEXT });
    }
    out[i] = { ...m, content: blocks };
  }
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
