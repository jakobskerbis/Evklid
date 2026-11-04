// Dnevne varnostne kopije baze in obnova iz kopije (docs/objava.md → »Varnostna kopija«).
// Kopija: enkrat na dan VACUUM INTO v <mapa baze>/kopije/<ime>-LLLL-MM-DD.db (datum UTC), zadnjih 7;
// ročna (scripts/obnovi-kopijo.js --zdaj) ima še uro, <ime>-LLLL-MM-DD-UUMM.db, zadnje 3.
// Obnova: scripts/obnovi-kopijo.js pripravi <mapa baze>/obnovi.db; ob naslednjem zagonu (v 1 uri) jo
// applyPendingRestore() (server/index.js) postavi na mesto baze, staro bazo pa shrani kot <baza>.pred-obnovo-<čas>.
// Pogovori ostanejo v kopiji šifrirani (EVKLID_DATA_KEY), zato je za obnovo potreben isti ključ.
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const KEEP_DAYS = 7;
export const KEEP_MANUAL = 3;
export const RESTORE_TTL_MS = 60 * 60 * 1000; // pripravljena obnova velja 1 uro, nato se ne uporabi več
const SAVED_DAYS = 14; // .pred-obnovo-* (za razveljavitev obnove) se pobrišejo po 14 dneh
const HOUR = 60 * 60 * 1000;
const MB = 1024 * 1024;

export const backupDir = (dbFile) => path.join(path.dirname(path.resolve(dbFile)), "kopije");
export const restoreFile = (dbFile) => path.join(path.dirname(path.resolve(dbFile)), "obnovi.db");
const stem = (dbFile) => path.basename(dbFile, ".db");
const day = (now) => now.toISOString().slice(0, 10);
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Kopije od najnovejše naprej: [{ file, date, manual, bytes }]. date: "LLLL-MM-DD" ali "LLLL-MM-DD-UUMM". */
export function listBackups(dbFile) {
  const dir = backupDir(dbFile);
  if (!fs.existsSync(dir)) return [];
  const re = new RegExp(`^${reEsc(stem(dbFile))}-(\\d{4}-\\d{2}-\\d{2}(-\\d{4})?)\\.db$`);
  return fs
    .readdirSync(dir)
    .map((name) => ({ name, m: name.match(re) }))
    .filter((x) => x.m)
    .map(({ name, m }) => ({ file: path.join(dir, name), date: m[1], manual: !!m[2], bytes: fs.statSync(path.join(dir, name)).size }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Preveri, ali je datoteka cela baza SQLite. Vrne "ok" ali opis napake. */
export function checkFile(file) {
  let db;
  try {
    db = new DatabaseSync(file, { readOnly: true });
    const rows = db.prepare("PRAGMA integrity_check").all();
    const msg = rows.map((r) => Object.values(r)[0]).join("; ");
    return msg === "ok" ? "ok" : msg.slice(0, 300);
  } catch (e) {
    return e.message;
  } finally {
    db?.close();
  }
}

// Pobriše dnevne kopije nad keepDaily in ročne nad keepManual (najstarejše najprej) ter ostanke .tmp.
function prune(dbFile, keepDaily, keepManual) {
  const list = listBackups(dbFile);
  for (const b of [...list.filter((x) => !x.manual).slice(keepDaily), ...list.filter((x) => x.manual).slice(keepManual)]) fs.rmSync(b.file, { force: true });
  const dir = backupDir(dbFile);
  // Ostanki prekinjenih kopij (starejši od 1 ure; mlajšega morda prav zdaj piše druga kopija).
  if (fs.existsSync(dir))
    for (const n of fs.readdirSync(dir))
      if (n.endsWith(".db.tmp") && Date.now() - fs.statSync(path.join(dir, n)).mtimeMs > HOUR) fs.rmSync(path.join(dir, n), { force: true });
}

/**
 * Naredi današnjo kopijo, če je še ni (manual: ročna kopija z uro, nikoli ne prepiše obstoječe).
 * Ko zmanjkuje prostora, najprej pobriše najstarejše kopije (najnovejša ostane). Vrne { made, file, bytes } ali { made: false, reason }.
 */
export function makeBackup(db, dbFile, { now = new Date(), keep = KEEP_DAYS, manual = false } = {}) {
  const dir = backupDir(dbFile);
  fs.mkdirSync(dir, { recursive: true });
  const name = manual ? `${day(now)}-${now.toISOString().slice(11, 16).replace(":", "")}` : day(now);
  const file = path.join(dir, `${stem(dbFile)}-${name}.db`);
  if (fs.existsSync(file)) return { made: false, reason: manual ? "kopija s to uro že obstaja" : "danes že narejena", file };
  prune(dbFile, manual ? keep : keep - 1, manual ? KEEP_MANUAL - 1 : KEEP_MANUAL);
  // Disk (Render: 1 GB) ne sme biti poln: kopija potrebuje vsaj dvakratno velikost baze prostora.
  const size = fs.existsSync(dbFile) ? fs.statSync(dbFile).size : 0;
  const need = size * 2 + 20 * MB;
  let free = freeBytes(dir);
  // Stare kopije brišemo le, če to res sprosti dovolj prostora (sicer ostane vsa zgodovina).
  const older = listBackups(dbFile).slice(1).reverse();
  if (free != null && free < need && free + older.reduce((a, b) => a + b.bytes, 0) >= need)
    for (const old of older) {
      if (free >= need) break;
      fs.rmSync(old.file, { force: true });
      free = freeBytes(dir) ?? free + old.bytes;
    }
  if (free != null && free < need) return { made: false, reason: `premalo prostora na disku (${mb(free)} MB prostih)` };
  const tmp = `${file}.tmp`;
  try {
    db.exec(`VACUUM INTO '${tmp.replace(/'/g, "''")}'`); // dosledna slika tudi med pisanjem (WAL)
    const ok = checkFile(tmp);
    if (ok !== "ok") return { made: false, reason: `kopija ni cela: ${ok}` };
    fs.renameSync(tmp, file);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
  return { made: true, file, bytes: fs.statSync(file).size };
}

function freeBytes(dir) {
  try {
    const s = fs.statfsSync(dir);
    return s.bavail * s.bsize;
  } catch {
    return null;
  }
}
const mb = (b) => Math.round((b / MB) * 10) / 10;

/**
 * Dnevne kopije: prva 2 min po zagonu (strežnik se najprej zažene), nato vsako uro preveri, ali je nov dan (UTC).
 * Vrne { status, run }; status() je za javni /healthz/stanje (brez poti in podrobnosti napake).
 */
export function startBackups(db, dbFile, { scheduler = true, log = console, now = () => new Date() } = {}) {
  const off = !dbFile || dbFile === ":memory:" || process.env.EVKLID_BACKUPS === "0";
  let failed = false;
  const run = () => {
    if (db.isOpen === false) return;
    try {
      const r = makeBackup(db, dbFile, { now: now() });
      if (r.made) log.info?.(`[evklid] varnostna kopija: ${path.basename(r.file)} (${mb(r.bytes)} MB)`);
      else if (r.reason !== "danes že narejena") log.error?.(`[evklid] varnostna kopija ni narejena: ${r.reason}`);
      failed = !r.made && r.reason !== "danes že narejena";
    } catch (e) {
      failed = true;
      log.error?.(`[evklid] varnostna kopija: ${e.message}`);
    }
  };
  if (!off && scheduler) {
    setTimeout(run, 2 * 60 * 1000).unref?.();
    setInterval(run, HOUR).unref?.();
  }
  const status = () => {
    if (off) return null;
    const list = listBackups(dbFile);
    return { zadnja: list[0]?.date ?? null, kopij: list.length, napaka: failed, obnovaCaka: fs.existsSync(restoreFile(dbFile)) };
  };
  return { status, run };
}

// Baza z -wal in -shm se premakne skupaj; najprej -wal/-shm, da stara WAL nikoli ne ostane ob novi bazi.
function moveDb(from, to) {
  for (const ext of ["-wal", "-shm"]) if (fs.existsSync(from + ext)) fs.renameSync(from + ext, to + ext);
  if (fs.existsSync(from)) fs.renameSync(from, to);
}

/**
 * Ob zagonu strežnika, pred odprtjem baze: če čaka obnovi.db (scripts/obnovi-kopijo.js) in ni starejša od 1 ure,
 * jo postavi na mesto baze. Trenutna baza (z -wal in -shm) se preimenuje v <baza>.pred-obnovo-<čas>.
 * Starejša ali pokvarjena obnovi.db se ne uporabi (preimenuje se v .potekla oz. .pokvarjena).
 */
export function applyPendingRestore(dbFile, { log = console, now = new Date() } = {}) {
  if (!dbFile || dbFile === ":memory:") return null;
  const dir = path.dirname(path.resolve(dbFile));
  // Shranjene baze pred obnovo ter potekle in pokvarjene obnove po 14 dneh (disk ima 1 GB).
  const leftover = (n) => n.startsWith(`${path.basename(dbFile)}.pred-obnovo-`) || /^obnovi\.db\.(potekla|pokvarjena)$/.test(n);
  if (fs.existsSync(dir))
    for (const n of fs.readdirSync(dir))
      if (leftover(n) && now - fs.statSync(path.join(dir, n)).mtimeMs > SAVED_DAYS * 24 * HOUR) fs.rmSync(path.join(dir, n), { force: true });
  const src = restoreFile(dbFile);
  if (!fs.existsSync(src)) return null;
  if (now - fs.statSync(src).mtimeMs > RESTORE_TTL_MS) {
    fs.renameSync(src, `${src}.potekla`);
    log.error?.("[evklid] obnova ni uporabljena: pripravljena je bila pred več kot 1 uro (obnovi.db.potekla)");
    return { restored: false, reason: "potekla" };
  }
  const ok = checkFile(src);
  if (ok !== "ok") {
    fs.renameSync(src, `${src}.pokvarjena`);
    log.error?.(`[evklid] obnova preklicana, kopija ni cela (${ok}); premaknjena v obnovi.db.pokvarjena`);
    return { restored: false, reason: ok };
  }
  const saved = `${dbFile}.pred-obnovo-${now.toISOString().replace(/[:.]/g, "-")}`;
  moveDb(dbFile, saved);
  fs.renameSync(src, dbFile);
  log.info?.(`[evklid] baza obnovljena iz kopije; prejšnja je v ${path.basename(saved)}`);
  return { restored: true, saved };
}

/** Shranjene baze pred obnovo, najnovejša prva (za razveljavitev obnove). */
export function savedBeforeRestore(dbFile) {
  const dir = path.dirname(path.resolve(dbFile));
  const re = new RegExp(`^${reEsc(path.basename(dbFile))}\\.pred-obnovo-[\\dT-]+Z$`);
  return fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((n) => re.test(n))
        .sort()
        .reverse()
        .map((n) => path.join(dir, n))
    : [];
}
