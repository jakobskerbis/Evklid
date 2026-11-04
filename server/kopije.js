// Dnevne varnostne kopije baze in obnova iz kopije (docs/objava.md → »Varnostne kopije«).
// Kopija: enkrat na dan VACUUM INTO v <mapa baze>/kopije/<ime>-LLLL-MM-DD.db, zadnjih 7 dni.
// Obnova: scripts/obnovi-kopijo.js pripravi <mapa baze>/obnovi.db; ob naslednjem zagonu jo
// applyPendingRestore() (server/index.js) postavi na mesto baze, staro bazo pa shrani kot <baza>.pred-obnovo-<čas>.
// Pogovori ostanejo v kopiji šifrirani (EVKLID_DATA_KEY), zato je za obnovo potreben isti ključ.
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const KEEP_DAYS = 7;
const HOUR = 60 * 60 * 1000;

export const backupDir = (dbFile) => path.join(path.dirname(path.resolve(dbFile)), "kopije");
export const restoreFile = (dbFile) => path.join(path.dirname(path.resolve(dbFile)), "obnovi.db");
const stem = (dbFile) => path.basename(dbFile, ".db");
const day = (now) => now.toISOString().slice(0, 10);

/** Kopije od najnovejše naprej: [{ file, date, bytes }]. */
export function listBackups(dbFile) {
  const dir = backupDir(dbFile);
  if (!fs.existsSync(dir)) return [];
  const re = new RegExp(`^${stem(dbFile).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d{4}-\\d{2}-\\d{2})\\.db$`);
  return fs
    .readdirSync(dir)
    .map((name) => ({ name, m: name.match(re) }))
    .filter((x) => x.m)
    .map(({ name, m }) => ({ file: path.join(dir, name), date: m[1], bytes: fs.statSync(path.join(dir, name)).size }))
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

/**
 * Naredi današnjo kopijo, če je še ni, in pobriše starejše od KEEP_DAYS.
 * Vrne { made, file, bytes } ali { made: false, reason }.
 */
export function makeBackup(db, dbFile, { now = new Date(), keep = KEEP_DAYS, force = false } = {}) {
  const dir = backupDir(dbFile);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${stem(dbFile)}-${day(now)}.db`);
  if (fs.existsSync(file) && !force) return { made: false, reason: "danes že narejena", file };
  // Disk (Render: 1 GB) ne sme biti poln: kopija potrebuje vsaj dvakratno velikost baze prostora.
  const size = fs.existsSync(dbFile) ? fs.statSync(dbFile).size : 0;
  const free = freeBytes(dir);
  if (free != null && free < size * 2 + 20 * 1024 * 1024) return { made: false, reason: `premalo prostora na disku (${mb(free)} MB prostih)` };
  const tmp = `${file}.tmp`;
  fs.rmSync(tmp, { force: true });
  db.exec(`VACUUM INTO '${tmp.replace(/'/g, "''")}'`); // dosledna slika tudi med pisanjem (WAL)
  const ok = checkFile(tmp);
  if (ok !== "ok") {
    fs.rmSync(tmp, { force: true });
    return { made: false, reason: `kopija ni cela: ${ok}` };
  }
  fs.renameSync(tmp, file);
  for (const old of listBackups(dbFile).slice(keep)) fs.rmSync(old.file, { force: true });
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
const mb = (b) => Math.round((b / 1024 / 1024) * 10) / 10;

/**
 * Dnevne kopije: prva 2 min po zagonu (strežnik se najprej zažene), nato vsako uro preveri, ali je nov dan.
 * Vrne status() za /healthz/stanje.
 */
export function startBackups(db, dbFile, { scheduler = true, log = console, now = () => new Date() } = {}) {
  const state = { zadnja: null, velikostMB: null, kopij: 0, napaka: null };
  const off = !dbFile || dbFile === ":memory:" || process.env.EVKLID_BACKUPS === "0";
  const refresh = () => {
    const list = off ? [] : listBackups(dbFile);
    state.kopij = list.length;
    state.zadnja = list[0]?.date ?? null;
    state.velikostMB = list[0] ? mb(list[0].bytes) : null;
  };
  const run = () => {
    if (db.isOpen === false) return;
    try {
      const r = makeBackup(db, dbFile, { now: now() });
      if (r.made) log.info?.(`[evklid] varnostna kopija: ${path.basename(r.file)} (${mb(r.bytes)} MB)`);
      else if (r.reason !== "danes že narejena") log.error?.(`[evklid] varnostna kopija ni narejena: ${r.reason}`);
      state.napaka = r.made || r.reason === "danes že narejena" ? null : r.reason;
    } catch (e) {
      state.napaka = e.message;
      log.error?.(`[evklid] varnostna kopija: ${e.message}`);
    }
    refresh();
  };
  if (!off) {
    refresh();
    if (scheduler) {
      setTimeout(run, 2 * 60 * 1000).unref?.();
      setInterval(run, HOUR).unref?.();
    }
  }
  return { status: () => (off ? null : { ...state }), run };
}

/**
 * Pred odprtjem baze: če čaka obnovi.db (scripts/obnovi-kopijo.js), jo postavi na mesto baze.
 * Trenutna baza (z -wal in -shm) se preimenuje v <baza>.pred-obnovo-<čas>, da se obnova da razveljaviti.
 */
export function applyPendingRestore(dbFile, { log = console, now = new Date() } = {}) {
  if (!dbFile || dbFile === ":memory:") return null;
  const src = restoreFile(dbFile);
  if (!fs.existsSync(src)) return null;
  const ok = checkFile(src);
  if (ok !== "ok") {
    const bad = `${src}.pokvarjena`;
    fs.renameSync(src, bad);
    log.error?.(`[evklid] obnova preklicana, kopija ni cela (${ok}); premaknjena v ${path.basename(bad)}`);
    return { restored: false, reason: ok };
  }
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  const saved = `${dbFile}.pred-obnovo-${stamp}`;
  if (fs.existsSync(dbFile)) {
    fs.renameSync(dbFile, saved);
    for (const ext of ["-wal", "-shm"]) if (fs.existsSync(dbFile + ext)) fs.renameSync(dbFile + ext, saved + ext);
  }
  fs.renameSync(src, dbFile);
  log.info?.(`[evklid] baza obnovljena iz kopije; prejšnja je v ${path.basename(saved)}`);
  return { restored: true, saved };
}
