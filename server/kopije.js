// Dnevne varnostne kopije baze in obnova iz kopije (docs/objava.md → »Varnostna kopija«).
// Kopija: enkrat na dan VACUUM INTO v <mapa baze>/kopije/<ime>-LLLL-MM-DD.db (datum UTC), zadnjih 7;
// ročna (scripts/obnovi-kopijo.js --zdaj) ima še uro, <ime>-LLLL-MM-DD-UUMM.db, zadnje 3 in največ MANUAL_MAX_DAYS dni.
// Obnova: scripts/obnovi-kopijo.js pripravi <mapa baze>/obnovi.db; ob naslednjem zagonu (v 1 uri) jo
// applyPendingRestore() (server/index.js) postavi na mesto baze, staro bazo pa shrani kot <baza>.pred-obnovo-<čas>.
// Pogovori ostanejo v kopiji šifrirani (EVKLID_DATA_KEY), zato je za obnovo potreben isti ključ.
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const KEEP_DAYS = 7;
export const KEEP_MANUAL = 3;
// Ročna kopija (tudi prenesena iz R2) se pobriše po 22 dneh, četudi je med zadnjimi tremi: zasebnost.html §5 obljublja
// izbris iz varnostnih kopij najpozneje v 30 dneh. Posnetek diska pri Renderju (z mapo kopije) ostane še 7 dni, čiščenje
// pa teče enkrat na dan (dnevna kopija in dnevno čiščenje po rokih hrambe): 22 + 7 + 1 = 30.
export const MANUAL_MAX_DAYS = 22;
export const RESTORE_TTL_MS = 60 * 60 * 1000; // pripravljena obnova velja 1 uro, nato se ne uporabi več
const SAVED_DAYS = 14; // .pred-obnovo-* (za razveljavitev obnove) se pobrišejo po 14 dneh (+ 7 dni posnetka diska)
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

// Fotografije iz nalog pilota ne gredo v kopije (lokalne ne in zato tudi ne v oblak): služijo le izboljšavi branja,
// zato po izbrisu ali roku ne smejo živeti naprej v kopijah (server/pilot-naloge.js, zasebnost.html).
export function withoutPilotPhotos(file) {
  const db = new DatabaseSync(file);
  try {
    if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'pilot_photos'").get()) return 0;
    const n = Number(db.prepare("DELETE FROM pilot_photos").run().changes);
    // Prepis naloge sodi k fotografiji (sprožilec pilot_photo_gone ga počisti tudi sam; tu še za stare kopije brez njega).
    if (db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'pilot_scans'").get()) db.exec("UPDATE pilot_scans SET problems = NULL");
    if (n) db.exec("VACUUM"); // izbrisani bajti ne ostanejo v prostih straneh kopije
    return n;
  } finally {
    db.close();
  }
}

// Pobriše dnevne kopije nad keepDaily, ročne nad keepManual (najstarejše najprej) in ročne, starejše od
// MANUAL_MAX_DAYS, ter ostanke .tmp.
export function prune(dbFile, keepDaily, keepManual, now = new Date()) {
  const list = listBackups(dbFile);
  const manual = list.filter((x) => x.manual);
  for (const b of [...list.filter((x) => !x.manual).slice(keepDaily), ...manual.slice(keepManual)]) fs.rmSync(b.file, { force: true });
  pocistiStare(dbFile, now);
  const dir = backupDir(dbFile);
  // Ostanki prekinjenih kopij (starejši od 1 ure; mlajšega morda prav zdaj piše druga kopija).
  if (fs.existsSync(dir))
    for (const n of fs.readdirSync(dir))
      if (n.endsWith(".db.tmp") && Date.now() - fs.statSync(path.join(dir, n)).mtimeMs > HOUR) fs.rmSync(path.join(dir, n), { force: true });
}

/**
 * Rok hrambe kopij ne glede na EVKLID_BACKUPS (kliče se ob kopiji, ob zagonu in v dnevnem čiščenju, server/zasebnost.js):
 * ročne kopije starejše od MANUAL_MAX_DAYS (po datumu v imenu), shranjene baze pred obnovo ter potekle in pokvarjene
 * obnove starejše od SAVED_DAYS ter zapise seznama izbrisov, starejše od IZBRISI_DNI. Vrne število pobrisanih datotek.
 */
export function pocistiStare(dbFile, now = new Date()) {
  if (!dbFile || dbFile === ":memory:") return 0;
  let n = 0;
  const meja = day(new Date(now.getTime() - MANUAL_MAX_DAYS * 864e5));
  for (const b of listBackups(dbFile))
    if (b.manual && b.date.slice(0, 10) <= meja) {
      fs.rmSync(b.file, { force: true });
      n++;
    }
  const dir = path.dirname(path.resolve(dbFile));
  const leftover = (x) => x.startsWith(`${path.basename(dbFile)}.pred-obnovo-`) || /^obnovi\.db\.(potekla|pokvarjena)$/.test(x);
  if (fs.existsSync(dir))
    for (const x of fs.readdirSync(dir))
      if (leftover(x) && now - fs.statSync(path.join(dir, x)).mtimeMs > SAVED_DAYS * 24 * HOUR) {
        fs.rmSync(path.join(dir, x), { force: true });
        n++;
      }
  // Seznam izbrisov: zapisi, starejši od IZBRISI_DNI, se pobrišejo tudi brez novih izbrisov in brez R2. Pokvarjene
  // datoteke ne prepišemo (napako javi ponovitevIzbrisov ob zagonu).
  try {
    if (fs.existsSync(izbrisiFile(dbFile))) dodajIzbrise(dbFile, [], now);
  } catch {
    // ostane do naslednjega čiščenja
  }
  return n;
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
  prune(dbFile, manual ? keep : keep - 1, manual ? KEEP_MANUAL - 1 : KEEP_MANUAL, now);
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
    withoutPilotPhotos(tmp);
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
  pocistiStare(dbFile, now);
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
  // Shranjena baza (za razveljavitev obnove) brez fotografij pilota: »ne gredo v naše varnostne kopije« (B4 P2-3).
  try {
    withoutPilotPhotos(saved);
  } catch (err) {
    log.error?.(`[evklid] fotografij pilota iz shranjene baze ni bilo mogoče odstraniti: ${err.message}`);
  }
  fs.renameSync(src, dbFile);
  log.info?.(`[evklid] baza obnovljena iz kopije; prejšnja je v ${path.basename(saved)}`);
  return { restored: true, saved };
}

// --- seznam izbrisov (docs/izbris-izvoz.md »Varnostne kopije«) ---
// Obnova baze iz kopije ne sme vrniti izbrisanih računov in profilov. Zato vsak izbris zapiše vrstico v
// <mapa baze>/<ime>-izbrisi.json, ZUNAJ datoteke baze, ki je obnova ne zamenja (server/accounts/izbris.js). Ob vsakem
// zagonu se izbrisi ponovijo za vrstice, ki so spet v bazi. Vsebina brez osebnih podatkov: notranji id-ji, čas nastanka
// vrstice (created_at, da nov račun s ponovno uporabljenim id-jem ostane) in čas izbrisa.
// Zapis: [{ at: ISO, r: [id računa, created_at] | null, s: [[id profila, created_at], …] }].
// Hrani se IZBRISI_DNI: najdlje živi kopija 30 dni (R2; ročna 22 + 7 dni posnetka diska + 1), +15 dni rezerve.
export const IZBRISI_DNI = 45;
export const izbrisiFile = (dbFile) => path.join(path.dirname(path.resolve(dbFile)), `${stem(dbFile)}-izbrisi.json`);

const veljaven = (z) =>
  z && typeof z.at === "string" && (z.r == null || (Array.isArray(z.r) && z.r.length === 2)) && (z.s == null || (Array.isArray(z.s) && z.s.every((x) => Array.isArray(x) && x.length === 2)));

/** Seznam izbrisov (prazen, če ga ni). Pokvarjena datoteka vrže napako: tihi prazen seznam bi izbrise izgubil. */
export function beriIzbrise(dbFile) {
  if (!dbFile || dbFile === ":memory:") return [];
  const f = izbrisiFile(dbFile);
  if (!fs.existsSync(f)) return [];
  const v = JSON.parse(fs.readFileSync(f, "utf8"));
  if (!Array.isArray(v)) throw new Error(`${path.basename(f)} ni seznam`);
  return v.filter(veljaven);
}

// EVKLID_IZBRISI_PREZRI (številke računov, z vejicami): za namerno obnovo po pomotnem izbrisu (docs/obnova.md). Zapisi
// teh računov, nastali pred zagonom tega procesa, se ne ponovijo in se ob naslednjem zapisu odstranijo s seznama (tudi
// iz R2), da se po odstranitvi nastavitve ne vrnejo. Izbris istega računa po zagonu se zapiše kot običajno.
const ZAGON = new Date().toISOString();
const javljeniPrezrti = new Set();
export function brezPrezrtih(list, { env = process.env, log = console, zagon = ZAGON } = {}) {
  const ids = new Set(
    String(env.EVKLID_IZBRISI_PREZRI || "")
      .split(",")
      .map((x) => x.trim())
      .filter((x) => /^\d+$/.test(x))
      .map(Number),
  );
  if (!ids.size) return list;
  return list.filter((z) => {
    const id = z?.r ? Number(z.r[0]) : null;
    if (id == null || !ids.has(id) || !(z.at < zagon)) return true;
    if (!javljeniPrezrti.has(id)) {
      javljeniPrezrti.add(id);
      log.warn?.(`[evklid] izbris računa ${id} se ne ponovi in se odstrani s seznama izbrisov (EVKLID_IZBRISI_PREZRI)`);
    }
    return false;
  });
}

/**
 * Doda izbrise k seznamu (brez dvojnikov), pobriše starejše od IZBRISI_DNI in zapiše atomarno (tmp + rename).
 * Vrne { list, dodanih }. Uporabi ga zapis ob izbrisu in prenos seznama iz R2 (server/kopije-oblak.js).
 */
export function dodajIzbrise(dbFile, novi, now = new Date()) {
  const meja = new Date(now.getTime() - IZBRISI_DNI * 864e5).toISOString();
  const kljuc = (z) => JSON.stringify([z.at, z.r ?? null, z.s ?? []]);
  const vse = beriIzbrise(dbFile);
  const list = brezPrezrtih(vse);
  const znani = new Set(list.map(kljuc));
  let dodanih = 0;
  for (const z of brezPrezrtih(novi.filter(veljaven)))
    if (!znani.has(kljuc(z))) {
      znani.add(kljuc(z));
      list.push({ at: z.at, r: z.r ?? null, s: z.s ?? [] });
      dodanih++;
    }
  const ostane = list.filter((z) => z.at >= meja).sort((a, b) => a.at.localeCompare(b.at));
  if (dodanih || ostane.length !== vse.length) {
    const f = izbrisiFile(dbFile);
    fs.mkdirSync(path.dirname(f), { recursive: true }); // ob zagonu po izgubi diska (prenos iz R2) mape baze še ni
    fs.writeFileSync(`${f}.tmp`, JSON.stringify(ostane));
    fs.renameSync(`${f}.tmp`, f);
  }
  return { list: ostane, dodanih };
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
