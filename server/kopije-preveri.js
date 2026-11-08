// Preizkus obnove iz varnostne kopije (docs/objava.md → »Varnostna kopija«): ročno scripts/obnovi-kopijo.js --preveri,
// samodejno vsako noč (startBackupChecks). Nič ne spremeni: kopija in baza se odpreta samo za branje.
// Samodejni preizkus: enkrat na dan med 4.30 in 8.00 po ljubljanskem času (dnevna kopija nastane po polnoči UTC),
// v ločeni niti (worker_threads), da strežnik med preverjanjem odgovarja. Preveri najnovejšo dnevno kopijo
// (cela, pogovori berljivi s sedanjim ključem, glavne tabele), ali je današnja, in, če je nastavljena kopija zunaj
// strežnika, ali je tam kopija istega dne (samo seznam ključev, nič se ne prenese). Ob napaki vrstica v dnevniku
// in največ en e-mail na dan naslovom iz EVKLID_ADMIN_EMAILS; ob uspehu nič. Rezultat: kv »kopije_preverjanje«,
// javno samo { datum, ok } na /healthz/stanje → preverjanjeKopij.
import {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} from "node:worker_threads";
import { DatabaseSync } from "node:sqlite";
import { BRAND } from "./brand.js";
import { listBackups, checkFile } from "./kopije.js";
import { encryptionStats } from "./zasebnost.js";
import { cloudConfig, listCloud } from "./kopije-oblak.js";
import { Mailer, layout, esc } from "./accounts/email.js";
import { emailList } from "./accounts/pilot-meja.js";

export const TABLES = [
  "parents",
  "students",
  "conversations",
  "messages",
  "events",
  "tasks",
];
const KV_KEY = "kopije_preverjanje";
const MIN = 60 * 1000;
const START = 4 * 60 + 30; // 4.30 po ljubljanskem času
const END = 8 * 60; // po 8.00 se ne začne več (podnevi je strežnik zaseden); zamujeno ponovi naslednja noč
const LJ = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Ljubljana",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const ljParts = (d) =>
  Object.fromEntries(LJ.formatToParts(d).map((p) => [p.type, p.value]));
const ljDate = (d) => {
  const p = ljParts(d);
  return `${p.year}-${p.month}-${p.day}`;
};
const ljMinutes = (d) => {
  const p = ljParts(d);
  return Number(p.hour) * 60 + Number(p.minute);
};

/** Preizkus obnove: kopija je cela, pogovori berljivi s sedanjim ključem, števila vrstic v primerjavi z bazo. */
export function verifyBackup(dbFile, backupFile) {
  const out = {
    file: backupFile,
    ok: true,
    notes: [],
    counts: {},
    unreadable: 0,
  };
  const integrity = checkFile(backupFile);
  if (integrity !== "ok")
    return { ...out, ok: false, notes: [`kopija ni cela: ${integrity}`] };
  const live = new DatabaseSync(dbFile, { readOnly: true });
  const copy = new DatabaseSync(backupFile, { readOnly: true });
  try {
    const names = (db) =>
      new Set(
        db
          .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
          .all()
          .map((r) => r.name),
      );
    const liveTables = names(live);
    const copyTables = names(copy);
    const missing = [...liveTables].filter((t) => !copyTables.has(t));
    // Tabela, ki jo je dodala novejša različica po kopiji, se ob zagonu ustvari sama.
    if (missing.length)
      out.notes.push(
        `tabele, ki jih kopija še nima (nastanejo ob zagonu): ${missing.join(", ")}`,
      );
    for (const t of TABLES.filter(
      (x) => liveTables.has(x) && copyTables.has(x),
    )) {
      const n = (db) => db.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get().n;
      out.counts[t] = { kopija: n(copy), baza: n(live) };
    }
    if (!Object.keys(out.counts).length) {
      out.ok = false;
      out.notes.push("v kopiji ni nobene od glavnih tabel");
    }
    // Šifrirani pogovori: s sedanjim EVKLID_DATA_KEY (in EVKLID_DATA_KEYS_OLD) jih je treba znati prebrati.
    out.unreadable = encryptionStats(copy).reduce(
      (a, s) => a + s.unreadable,
      0,
    );
    if (out.unreadable) {
      out.ok = false;
      out.notes.push(
        `${out.unreadable} šifriranih vrstic se s sedanjim ključem ne da prebrati (EVKLID_DATA_KEY, docs/varnost-podatkov.md)`,
      );
    }
  } finally {
    live.close();
    copy.close();
  }
  return out;
}

// Nit za preverjanje: integrity_check in branje vseh šifriranih vrstic trajata pri večji bazi sekunde, zato ne v
// glavni niti. Okolje (ključi) je kopija okolja strežnika; nit vrne samo { ok, notes } (brez vsebine vrstic).
if (!isMainThread && workerData?.kopijePreveri) {
  const { dbFile, backupFile } = workerData.kopijePreveri;
  try {
    const r = verifyBackup(dbFile, backupFile);
    parentPort.postMessage({ ok: r.ok, notes: r.notes });
  } catch (e) {
    parentPort.postMessage({
      ok: false,
      notes: [`preizkus obnove ni uspel: ${e.message}`],
    });
  }
}

/** verifyBackup v ločeni niti (glavna nit vmes streže zahtevam). Vrne { ok, notes }. */
export function verifyInWorker(
  dbFile,
  backupFile,
  { timeoutMs = 15 * MIN } = {},
) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (r) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(r);
    };
    const w = new Worker(new URL(import.meta.url), {
      workerData: { kopijePreveri: { dbFile, backupFile } },
    });
    const timer = setTimeout(() => {
      finish({
        ok: false,
        notes: ["preizkus obnove je trajal predolgo (več kot 15 minut)"],
      });
      w.terminate();
    }, timeoutMs);
    timer.unref?.();
    w.once("message", (m) => finish(m));
    w.once("error", (e) =>
      finish({ ok: false, notes: [`preizkus obnove ni uspel: ${e.message}`] }),
    );
    w.once("exit", (code) =>
      finish({
        ok: false,
        notes: [`preizkus obnove se je končal brez rezultata (koda ${code})`],
      }),
    );
  });
}

/**
 * Dnevni preizkus: najnovejša dnevna kopija je današnja (UTC, kot v imenih kopij), obnova iz nje bi uspela,
 * in (če je nastavljena) kopija istega dne je tudi zunaj strežnika. Vrne { ok, kopija, napake }.
 */
export async function checkBackups(
  dbFile,
  { now = new Date(), env = process.env, fetchFn, worker = true } = {},
) {
  const napake = [];
  const latest = listBackups(dbFile).find((b) => !b.manual);
  const today = now.toISOString().slice(0, 10);
  if (!latest) napake.push("ni nobene dnevne kopije");
  else {
    if (latest.date !== today)
      napake.push(
        `današnje dnevne kopije (${today}, UTC) ni; najnovejša je z dne ${latest.date}`,
      );
    const v = worker
      ? await verifyInWorker(dbFile, latest.file)
      : verifyBackup(dbFile, latest.file);
    if (!v.ok) napake.push(...v.notes);
  }
  const cfg = cloudConfig(env);
  if (cfg && latest) {
    try {
      const remote = await listCloud(cfg, dbFile, { fetchFn });
      if (!remote.some((r) => r.date === latest.date))
        napake.push(
          `kopije z dne ${latest.date} zunaj strežnika ni (najnovejša tam: ${remote[0]?.date ?? "nobena"})`,
        );
    } catch (e) {
      napake.push(
        `seznama kopij zunaj strežnika ni bilo mogoče dobiti: ${e.message}`,
      );
    }
  }
  return { ok: !napake.length, kopija: latest?.date ?? null, napake };
}

function failureEmail(date, napake) {
  const subject = `${BRAND.name}: preizkus varnostne kopije ni uspel (${date})`;
  const steps =
    "Preveri v Render → Shell: node scripts/obnovi-kopijo.js --preveri (in --oblak). Navodila: docs/objava.md → »Varnostna kopija«.";
  const text = `Nočni preizkus obnove iz varnostne kopije ${date} ni uspel:\n\n${napake.map((n) => `- ${n}`).join("\n")}\n\n${steps}`;
  const html = layout(
    "Preizkus varnostne kopije ni uspel",
    `<p>Nočni preizkus obnove ${esc(date)} ni uspel:</p><ul>${napake.map((n) => `<li>${esc(n)}</li>`).join("")}</ul><p>${esc(steps)}</p>`,
  );
  return { subject, text, html };
}

/**
 * Nočni samodejni preizkus. Brez urnika v testih (scheduler: false, NODE_ENV=test) in v preizkusnem načinu (mock);
 * run({ force: true }) ga požene vseeno. isBusy(): zahteve v teku → počakaj (do 6 × 10 min).
 * Vrne { status, run }; status() je za javni /healthz/stanje (samo datum in ok).
 */
export function startBackupChecks(
  db,
  dbFile,
  {
    scheduler = true,
    mock = false,
    log = console,
    now = () => new Date(),
    env = process.env,
    mailer = null,
    fetchFn,
    isBusy = () => false,
    worker = true,
  } = {},
) {
  const off =
    !dbFile ||
    dbFile === ":memory:" ||
    env.EVKLID_BACKUPS === "0" ||
    env.EVKLID_KOPIJE_PREVERI === "0";
  const kvGet = () => {
    try {
      return JSON.parse(
        db.prepare("SELECT value FROM kv WHERE key = ?").get(KV_KEY)?.value ||
          "null",
      );
    } catch {
      return null;
    }
  };
  const kvSet = (v) =>
    db
      .prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)")
      .run(KV_KEY, JSON.stringify(v));
  let busy = false;
  let waited = 0;

  async function notify(date, napake) {
    const to = emailList(env.EVKLID_ADMIN_EMAILS);
    const m = mailer ?? new Mailer({ fetchFn });
    // Brez Resend ne kličemo send(): ta bi lokalno izpisal naslove skrbnikov v dnevnik.
    if (!to.length || !m.enabled)
      return (
        log.error?.(
          "[evklid] preizkus varnostne kopije: e-pošta skrbniku ni poslana (ni EVKLID_ADMIN_EMAILS ali Resend)",
        ),
        false
      );
    let sent = 0;
    for (const addr of to) {
      try {
        await m.send({ to: addr, ...failureEmail(date, napake) });
        sent++;
      } catch (e) {
        log.error?.(
          `[evklid] preizkus varnostne kopije: e-pošta skrbniku ni uspela (${String(e.message).replace(/[^\s<>"']+@[^\s<>"']+/g, "…")})`,
        );
      }
    }
    return sent > 0;
  }

  const run = async ({ force = false } = {}) => {
    if (off || busy || db.isOpen === false) return null;
    const t = now();
    const date = ljDate(t);
    const prev = kvGet();
    if (!force && prev?.datum === date) return null;
    busy = true;
    // Vse v try: run teče iz setInterval, zavrnjena obljuba bi ustavila strežnik.
    try {
      let r;
      try {
        r = await checkBackups(dbFile, { now: t, env, fetchFn, worker });
      } catch (e) {
        r = {
          ok: false,
          kopija: null,
          napake: [`preizkus ni uspel: ${e.message}`],
        };
      }
      const state = {
        datum: date,
        ok: r.ok,
        kopija: r.kopija,
        ob: t.toISOString(),
        napake: r.napake,
        poslano: prev?.poslano ?? null,
      };
      if (r.ok)
        log.info?.(
          `[evklid] preizkus varnostne kopije ${r.kopija}: obnova bi uspela`,
        );
      else {
        log.error?.(
          `[evklid] NAPAKA: preizkus varnostne kopije ni uspel: ${r.napake.join("; ")}`,
        );
        if (state.poslano !== date && (await notify(date, r.napake)))
          state.poslano = date; // največ en e-mail na dan
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
    if (m < START || m >= END || kvGet()?.datum === ljDate(t))
      return void (waited = 0);
    if (isBusy() && waited < 6) return void waited++;
    waited = 0;
    run();
  };
  if (!off && scheduler && !mock && env.NODE_ENV !== "test")
    setInterval(tick, 10 * MIN).unref?.();

  const status = () => {
    if (off) return null;
    const s = db.isOpen === false ? null : kvGet();
    return s ? { datum: s.datum, ok: s.ok } : null;
  };
  return { status, run, tick };
}
