// Opozorilo o dnevnem strošku AI (6. korak priprave na pilot, docs/spremljanje.md). Vsakih 10 min sešteje današnjo
// porabo AI vseh učencev in aplikacije (usage_dnevno, dan po UTC kot v Števcu porabe). Ko preseže mejo
// EVKLID_OPOZORILO_AI_USD (privzeto 3 $; 0 ali manj = izklopljeno), pošlje naslovom iz EVKLID_ADMIN_EMAILS največ en
// e-mail na dan (ob neuspehu poskusi znova ob naslednjem pregledu). Nič ne ustavi: meje AI ostanejo, kot so.
// Javno na /healthz/stanje (aiStrosek) je samo, ali je meja danes presežena in od kdaj, brez zneska; Straža
// (scripts/straza.mjs) ob novem preseganju pade, da opozorilo pride tudi po GitHubu.
import { BRAND } from "./brand.js";
import { Mailer, layout, esc } from "./accounts/email.js";
import { emailList } from "./accounts/pilot-meja.js";

const KV_KEY = "opozorilo_ai";
const MIN = 60 * 1000;
export const PRIVZETA_MEJA_USD = 3;

export function mejaUsd(env = process.env) {
  const raw = env.EVKLID_OPOZORILO_AI_USD;
  if (raw == null || String(raw).trim() === "") return PRIVZETA_MEJA_USD;
  const v = Number(String(raw).replace(",", "."));
  return Number.isFinite(v) ? v : PRIVZETA_MEJA_USD;
}

const usd = (v) => `${(Math.round(v * 100) / 100).toFixed(2).replace(".", ",")} $`;

export function opozoriloEmail(dan, porabljeno, meja) {
  const subject = `${BRAND.name}: strošek AI danes ${usd(porabljeno)} (meja opozorila ${usd(meja)})`;
  const steps = [
    "Poglej Števec porabe (skrbnik → Poraba): kdo in kaj porablja.",
    "Meje AI na učenca in račun delujejo naprej; to je samo opozorilo, nič se ne ustavi.",
    "Mejo opozorila spremeniš v Render → Environment: EVKLID_OPOZORILO_AI_USD (0 = izklop).",
  ];
  const text = `Današnja poraba AI (${dan}, UTC) je ${usd(porabljeno)}, kar je nad mejo opozorila ${usd(meja)}.\n\n${steps.map((s) => `- ${s}`).join("\n")}\n\nNavodila: docs/spremljanje.md`;
  const html = layout(
    "Strošek AI danes nad mejo",
    `<p>Današnja poraba AI (${esc(dan)}, UTC) je <b>${esc(usd(porabljeno))}</b>, kar je nad mejo opozorila ${esc(usd(meja))}.</p><ul>${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><p>Navodila: docs/spremljanje.md</p>`,
  );
  return { subject, text, html };
}

/**
 * @param {import("node:sqlite").DatabaseSync} db
 * @param {{ todayTotal: () => number }} usage
 * Vrne { status, run }. run() je za teste in ročni zagon; status() je javni del za /healthz/stanje.
 */
export function startAiCostAlert(db, usage, { scheduler = true, mock = false, env = process.env, mailer = null, fetchFn, log = console, now = () => new Date() } = {}) {
  const kvGet = () => {
    try {
      return JSON.parse(db.prepare("SELECT value FROM kv WHERE key = ?").get(KV_KEY)?.value || "null");
    } catch {
      return null;
    }
  };
  const kvSet = (v) => db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(KV_KEY, JSON.stringify(v));
  const danes = () => now().toISOString().slice(0, 10);
  const porabljeno = () => {
    try {
      return Number(usage?.todayTotal?.()) || 0;
    } catch {
      return 0;
    }
  };
  let busy = false;

  // "poslano" | "napaka" (Resend ni sprejel nobenega: znova ob naslednjem pregledu) | "ni nastavljeno"
  async function notify(dan, vsota, meja) {
    const to = emailList(env.EVKLID_ADMIN_EMAILS);
    const m = mailer ?? new Mailer({ fetchFn });
    if (!to.length || !m.enabled) {
      log.error?.("[evklid] opozorilo o strošku AI: e-pošta skrbniku ni poslana (ni EVKLID_ADMIN_EMAILS ali Resend)");
      return "ni nastavljeno";
    }
    let sent = 0;
    for (const addr of to) {
      try {
        await m.send({ to: addr, ...opozoriloEmail(dan, vsota, meja) });
        sent++;
      } catch (e) {
        log.error?.(`[evklid] opozorilo o strošku AI: e-pošta skrbniku ni uspela (${String(e.message).replace(/[^\s<>"']+@[^\s<>"']+/g, "…")})`);
      }
    }
    return sent ? "poslano" : "napaka";
  }

  const run = async () => {
    const meja = mejaUsd(env);
    if (busy || meja <= 0 || db.isOpen === false) return null;
    busy = true;
    // Vse v try: run teče iz setInterval, zavrnjena obljuba bi ustavila strežnik.
    try {
      const dan = danes();
      const vsota = porabljeno();
      if (vsota < meja) return null;
      const prev = kvGet();
      const state = prev?.dan === dan ? prev : { dan, od: now().toISOString(), poslano: false, poskusov: 0 };
      if (!state.poslano && state.koncano !== true) {
        log.error?.(`[evklid] OPOZORILO: strošek AI danes (${dan}, UTC) ${usd(vsota)} je nad mejo ${usd(meja)}`);
        state.poskusov = (state.poskusov || 0) + 1;
        const r = await notify(dan, vsota, meja); // največ en e-mail na dan
        if (r === "poslano") state.poslano = true;
        else if (r === "ni nastavljeno" || state.poskusov >= 6) state.koncano = true; // ponovitev nič ne spremeni
      }
      if (db.isOpen !== false) kvSet(state);
      return state;
    } catch (e) {
      log.error?.(`[evklid] opozorilo o strošku AI: ${e.message}`);
      return null;
    } finally {
      busy = false;
    }
  };
  if (scheduler && !mock && env.NODE_ENV !== "test") {
    setTimeout(run, 3 * MIN).unref?.();
    setInterval(run, 10 * MIN).unref?.();
  }

  const status = () => {
    const meja = mejaUsd(env);
    if (meja <= 0 || db.isOpen === false) return null;
    const nad = porabljeno() >= meja;
    const s = kvGet();
    return { nadMejo: nad, od: nad && s?.dan === danes() ? s.od : null };
  };
  return { status, run };
}
