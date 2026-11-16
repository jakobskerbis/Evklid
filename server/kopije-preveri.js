// Nočni samodejni preizkus obnove iz varnostne kopije (docs/objava.md → »Varnostna kopija«); ročno isto naredi
// scripts/obnovi-kopijo.js --preveri. Nič ne spremeni: kopija in baza se odpreta samo za branje.
// Enkrat na dan med 4.30 in 8.00 po ljubljanskem času (dnevna kopija nastane po polnoči UTC), v ločeni niti
// (server/kopije-preizkus.js), da strežnik med preverjanjem odgovarja. Preveri najnovejšo dnevno kopijo (cela,
// pogovori berljivi s sedanjim ključem, glavne tabele), ali je današnja, in, če je nastavljena kopija zunaj
// strežnika, ali je tam kopija istega dne (samo seznam ključev, nič se ne prenese). Ob napaki vrstica v dnevniku
// in največ en e-mail na dan naslovom iz EVKLID_ADMIN_EMAILS; ob uspehu nič. Dan je opravljen šele ob uspehu ali
// ko je e-mail o napaki poslan; sicer se preizkus ponovi ob naslednjem pregledu (10 min), največ MAX_TRIES-krat.
// Rezultat: kv »kopije_preverjanje«, javno samo { datum, ok } na /healthz/stanje → preverjanjeKopij.
import { BRAND } from "./brand.js";
import { listBackups } from "./kopije.js";
import { verifyBackup, verifyInWorker } from "./kopije-preizkus.js";
import { cloudConfig, listCloud } from "./kopije-oblak.js";
import { Mailer, layout, esc } from "./accounts/email.js";
import { emailList } from "./accounts/pilot-meja.js";

export { verifyBackup };
const KV_KEY = "kopije_preverjanje";
const MIN = 60 * 1000;
const START = 4 * 60 + 30; // 4.30 po ljubljanskem času
const END = 8 * 60; // po 8.00 se ne začne več (podnevi je strežnik zaseden); zamujeno ponovi naslednja noč
const MAX_TRIES = 4; // poskusov na dan, ko e-mail o napaki ne gre skozi
const LJ = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Ljubljana", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const ljParts = (d) => Object.fromEntries(LJ.formatToParts(d).map((p) => [p.type, p.value]));
const ljDate = (d) => {
  const p = ljParts(d);
  return `${p.year}-${p.month}-${p.day}`;
};
const ljMinutes = (d) => {
  const p = ljParts(d);
  return Number(p.hour) * 60 + Number(p.minute);
};

/**
 * Dnevni preizkus: najnovejša dnevna kopija je današnja (UTC, kot v imenih kopij), obnova iz nje bi uspela,
 * in (če je nastavljena) kopija istega dne je tudi zunaj strežnika. Vrne { ok, kopija, napake, prehodna };
 * prehodna: edina napaka je nedosegljiva shramba zunaj strežnika (omrežje), ki jo je vredno poskusiti še enkrat.
 */
export async function checkBackups(dbFile, { now = new Date(), env = process.env, fetchFn, worker = true, timeoutMs } = {}) {
  const napake = [];
  const latest = listBackups(dbFile).find((b) => !b.manual);
  const today = now.toISOString().slice(0, 10);
  if (!latest) napake.push("ni nobene dnevne kopije");
  else {
    if (latest.date !== today) napake.push(`današnje dnevne kopije (${today}, UTC) ni; najnovejša je z dne ${latest.date}`);
    const v = worker ? await verifyInWorker(dbFile, latest.file, timeoutMs ? { timeoutMs } : {}) : verifyBackup(dbFile, latest.file);
    if (!v.ok) napake.push(...v.notes);
  }
  const cfg = cloudConfig(env);
  let prehodna = false;
  if (cfg && latest) {
    try {
      const remote = await listCloud(cfg, dbFile, { fetchFn });
      if (!remote.some((r) => r.date === latest.date)) napake.push(`kopije z dne ${latest.date} zunaj strežnika ni (najnovejša tam: ${remote[0]?.date ?? "nobena"})`);
    } catch (e) {
      prehodna = !napake.length;
      napake.push(`seznama kopij zunaj strežnika ni bilo mogoče dobiti: ${e.message}`);
    }
  }
  return { ok: !napake.length, kopija: latest?.date ?? null, napake, prehodna };
}

function failureEmail(date, napake) {
  const subject = `${BRAND.name}: preizkus varnostne kopije ni uspel (${date})`;
  const steps = "Preveri v Render → Shell: node scripts/obnovi-kopijo.js --preveri (in --oblak). Navodila: docs/objava.md → »Varnostna kopija«.";
  const text = `Nočni preizkus obnove iz varnostne kopije ${date} ni uspel:\n\n${napake.map((n) => `- ${n}`).join("\n")}\n\n${steps}`;
  const html = layout("Preizkus varnostne kopije ni uspel", `<p>Nočni preizkus obnove ${esc(date)} ni uspel:</p><ul>${napake.map((n) => `<li>${esc(n)}</li>`).join("")}</ul><p>${esc(steps)}</p>`);
  return { subject, text, html };
}

/**
 * Nočni samodejni preizkus. Brez urnika v testih (scheduler: false, NODE_ENV=test) in v preizkusnem načinu (mock);
 * run({ force: true }) ga požene vseeno. isBusy(): zahteve v teku → počakaj (do 6 × 10 min).
 * Vrne { status, run, tick }; status() je za javni /healthz/stanje (samo datum in ok).
 */
export function startBackupChecks(db, dbFile, { scheduler = true, mock = false, log = console, now = () => new Date(), env = process.env, mailer = null, fetchFn, isBusy = () => false, worker = true, timeoutMs } = {}) {
  const off = !dbFile || dbFile === ":memory:" || env.EVKLID_BACKUPS === "0" || env.EVKLID_KOPIJE_PREVERI === "0";
  const kvGet = () => {
    try {
      return JSON.parse(db.prepare("SELECT value FROM kv WHERE key = ?").get(KV_KEY)?.value || "null");
    } catch {
      return null;
    }
  };
  const kvSet = (v) => db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(KV_KEY, JSON.stringify(v));
  const doneOn = (s, date) => s?.datum === date && s.koncano !== false;
  let busy = false;
  let waited = 0;

  // "poslano" | "napaka" (Resend ni sprejel nobenega) | "ni nastavljeno" (ni naslovov ali Resend: ponovitev nič ne spremeni)
  async function notify(date, napake) {
    const to = emailList(env.EVKLID_ADMIN_EMAILS);
    const m = mailer ?? new Mailer({ fetchFn });
    // Brez Resend ne kličemo send(): ta bi lokalno izpisal naslove skrbnikov v dnevnik.
    if (!to.length || !m.enabled) {
      log.error?.("[evklid] preizkus varnostne kopije: e-pošta skrbniku ni poslana (ni EVKLID_ADMIN_EMAILS ali Resend)");
      return "ni nastavljeno";
    }
    let sent = 0;
    for (const addr of to) {
      try {
        await m.send({ to: addr, ...failureEmail(date, napake) });
        sent++;
      } catch (e) {
        log.error?.(`[evklid] preizkus varnostne kopije: e-pošta skrbniku ni uspela (${String(e.message).replace(/[^\s<>"']+@[^\s<>"']+/g, "…")})`);
      }
    }
    return sent ? "poslano" : "napaka";
  }

  const run = async ({ force = false } = {}) => {
    if (off || busy || db.isOpen === false) return null;
    const t = now();
    const date = ljDate(t);
    const prev = kvGet();
    if (!force && doneOn(prev, date)) return null;
    busy = true;
    // Vse v try: run teče iz setInterval, zavrnjena obljuba bi ustavila strežnik.
    try {
      const tries = (prev?.datum === date ? prev.poskusov || 0 : 0) + 1;
      let r;
      try {
        r = await checkBackups(dbFile, { now: t, env, fetchFn, worker, timeoutMs });
      } catch (e) {
        r = { ok: false, kopija: null, napake: [`preizkus ni uspel: ${e.message}`] };
      }
      const state = { datum: date, ok: r.ok, kopija: r.kopija, ob: t.toISOString(), napake: r.napake, poslano: prev?.poslano ?? null, poskusov: tries, koncano: true };
      if (r.ok) log.info?.(`[evklid] preizkus varnostne kopije ${r.kopija}: obnova bi uspela`);
      else if (r.prehodna && tries < 2) {
        // Shramba zunaj strežnika morda le trenutno ni dosegljiva: še en poskus ob naslednjem pregledu, brez alarma.
        log.warn?.(`[evklid] preizkus varnostne kopije: ${r.napake.join("; ")}; ponovim čez 10 min`);
        state.koncano = false;
      } else {
        log.error?.(`[evklid] NAPAKA: preizkus varnostne kopije ni uspel: ${r.napake.join("; ")}`);
        if (state.poslano !== date) {
          const sent = await notify(date, r.napake); // največ en e-mail na dan
          if (sent === "poslano") state.poslano = date;
          else if (sent === "napaka" && tries < MAX_TRIES) state.koncano = false; // e-mail ponovno ob naslednjem pregledu
        }
      }
      if (db.isOpen !== false) kvSet(state);
      return state;
    } catch (e) {
      log.error?.(`[evklid] preizkus varnostne kopije: ${e.message}`);
      return null;
    } finally {
      busy = false;
    }
  };

  const tick = () => {
    const t = now();
    const m = ljMinutes(t);
    if (m < START || m >= END || doneOn(kvGet(), ljDate(t))) return void (waited = 0);
    if (isBusy() && waited < 6) return void waited++;
    waited = 0;
    return run();
  };
  if (!off && scheduler && !mock && env.NODE_ENV !== "test") setInterval(tick, 10 * MIN).unref?.();

  const status = () => {
    if (off) return null;
    const s = db.isOpen === false ? null : kvGet();
    return s ? { datum: s.datum, ok: s.ok } : null;
  };
  return { status, run, tick };
}
