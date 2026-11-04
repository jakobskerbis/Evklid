// Varnostne kopije baze (server/kopije.js). Poženi v Render → evklid → Shell ali v mapi aplikacije.
//   node scripts/obnovi-kopijo.js               seznam kopij (in ali čaka obnova)
//   node scripts/obnovi-kopijo.js --zdaj        dodatna kopija takoj (z uro; obstoječih ne prepiše)
//   node scripts/obnovi-kopijo.js --preveri     preizkus obnove brez spreminjanja: najnovejša kopija je cela,
//                                               pogovori se dajo prebrati s sedanjim ključem, števila vrstic
//   node scripts/obnovi-kopijo.js 2026-11-04    pripravi obnovo iz te kopije; velja ob zagonu v naslednji uri
//                                               (Render → Manual Deploy → Restart service)
//   node scripts/obnovi-kopijo.js --preklici    prekliče pripravljeno obnovo
//   node scripts/obnovi-kopijo.js --razveljavi  pripravi vrnitev baze, kakršna je bila pred zadnjo obnovo
//   node scripts/obnovi-kopijo.js --oblak       seznam kopij zunaj strežnika (server/kopije-oblak.js)
//   node scripts/obnovi-kopijo.js --oblak-zdaj  naloži najnovejšo kopijo zunaj strežnika takoj (preizkus nastavitev)
//   node scripts/obnovi-kopijo.js --oblak-prenesi 2026-11-04
//                                               prenese kopijo od zunaj med lokalne kot 2026-11-04-0000 (nato obnova)
import "../server/env.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { BRAND } from "../server/brand.js";
import { listBackups, checkFile, makeBackup, restoreFile, savedBeforeRestore } from "../server/kopije.js";
import { encryptionStats } from "../server/zasebnost.js";
import { cloudConfig, listCloud, uploadBackup, downloadBackup } from "../server/kopije-oblak.js";

const TABLES = ["parents", "students", "conversations", "messages", "events", "tasks"];
const HELP = `Uporaba:
  node scripts/obnovi-kopijo.js               seznam kopij
  node scripts/obnovi-kopijo.js --zdaj        kopija takoj
  node scripts/obnovi-kopijo.js --preveri     preizkus obnove (nič ne spremeni)
  node scripts/obnovi-kopijo.js LLLL-MM-DD    obnova iz kopije s tem datumom (npr. 2026-11-04)
  node scripts/obnovi-kopijo.js --preklici    prekliči pripravljeno obnovo
  node scripts/obnovi-kopijo.js --razveljavi  vrni bazo, kakršna je bila pred zadnjo obnovo
  node scripts/obnovi-kopijo.js --oblak       seznam kopij zunaj strežnika
  node scripts/obnovi-kopijo.js --oblak-zdaj  naloži najnovejšo kopijo zunaj strežnika takoj
  node scripts/obnovi-kopijo.js --oblak-prenesi LLLL-MM-DD   prenese kopijo od zunaj (nato obnova z LLLL-MM-DD-0000)`;

/** Preizkus obnove: kopija je cela, pogovori berljivi s sedanjim ključem, števila vrstic v primerjavi z bazo. */
export function verifyBackup(dbFile, backupFile) {
  const out = { file: backupFile, ok: true, notes: [], counts: {}, unreadable: 0 };
  const integrity = checkFile(backupFile);
  if (integrity !== "ok") return { ...out, ok: false, notes: [`kopija ni cela: ${integrity}`] };
  const live = new DatabaseSync(dbFile, { readOnly: true });
  const copy = new DatabaseSync(backupFile, { readOnly: true });
  try {
    const names = (db) => new Set(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((r) => r.name));
    const liveTables = names(live);
    const copyTables = names(copy);
    const missing = [...liveTables].filter((t) => !copyTables.has(t));
    // Tabela, ki jo je dodala novejša različica po kopiji, se ob zagonu ustvari sama.
    if (missing.length) out.notes.push(`tabele, ki jih kopija še nima (nastanejo ob zagonu): ${missing.join(", ")}`);
    for (const t of TABLES.filter((x) => liveTables.has(x) && copyTables.has(x))) {
      const n = (db) => db.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get().n;
      out.counts[t] = { kopija: n(copy), baza: n(live) };
    }
    if (!Object.keys(out.counts).length) {
      out.ok = false;
      out.notes.push("v kopiji ni nobene od glavnih tabel");
    }
    // Šifrirani pogovori: s sedanjim EVKLID_DATA_KEY (in EVKLID_DATA_KEYS_OLD) jih je treba znati prebrati.
    out.unreadable = encryptionStats(copy).reduce((a, s) => a + s.unreadable, 0);
    if (out.unreadable) {
      out.ok = false;
      out.notes.push(`${out.unreadable} šifriranih vrstic se s sedanjim ključem ne da prebrati (EVKLID_DATA_KEY, docs/varnost-podatkov.md)`);
    }
  } finally {
    live.close();
    copy.close();
  }
  return out;
}

/** Pripravi obnovo: kopijo prekopira v obnovi.db (strežnik jo uporabi ob zagonu v naslednji uri). */
export function prepareRestore(dbFile, backupFile) {
  const ok = checkFile(backupFile);
  if (ok !== "ok") throw new Error(`kopija ni cela: ${ok}`);
  const dest = restoreFile(dbFile);
  // VACUUM INTO zajame tudi -wal ob shranjeni bazi (pri --razveljavi); dobimo eno samo datoteko.
  fs.rmSync(`${dest}.tmp`, { force: true });
  const src = new DatabaseSync(backupFile, { readOnly: true });
  try {
    src.exec(`VACUUM INTO '${`${dest}.tmp`.replace(/'/g, "''")}'`);
  } finally {
    src.close();
  }
  fs.renameSync(`${dest}.tmp`, dest);
  const now = new Date();
  fs.utimesSync(dest, now, now); // rok 1 ure teče od zdaj
  return dest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.env.EVKLID_DB || `data/${BRAND.slug}.db`;
  const arg = process.argv[2];
  if (!fs.existsSync(file)) {
    console.log(`Baze ${file} ni. Poženi v mapi aplikacije oz. nastavi EVKLID_DB.`);
    process.exit(1);
  }
  const list = listBackups(file);
  const pending = restoreFile(file);
  const mbs = (b) => (b / 1024 / 1024).toFixed(1);
  const restartHint = () => {
    console.log("Zdaj v naslednji uri znova zaženi strežnik: Render → evklid → Manual Deploy → Restart service.");
    console.log("Če ga ne zaženeš v 1 uri, obnova ne velja. Preklic: node scripts/obnovi-kopijo.js --preklici");
  };
  if (!arg) {
    if (!list.length) console.log("Kopij še ni. Strežnik naredi prvo 2 minuti po zagonu (ali: --zdaj).");
    for (const b of list) console.log(`${b.date.padEnd(15)} ${mbs(b.bytes).padStart(7)} MB${b.manual ? "  (ročna)" : ""}`);
    if (fs.existsSync(pending)) console.log(`\n! Obnova je pripravljena (${fs.statSync(pending).mtime.toISOString().slice(0, 16)} UTC) in čaka na ponovni zagon.`);
    console.log("\nDatumi in ure so v času UTC (pri nas je ura 1 ali 2 uri več: 23.30 UTC je že naslednji dan).");
  } else if (arg === "--zdaj") {
    const db = new DatabaseSync(file);
    try {
      const r = makeBackup(db, file, { manual: true });
      console.log(r.made ? `Narejena: ${path.basename(r.file)} (${mbs(r.bytes)} MB)` : `Ni narejena: ${r.reason}`);
      if (!r.made) process.exitCode = 1;
    } finally {
      db.close();
    }
  } else if (arg === "--preveri") {
    const b = process.argv[3] ? list.find((x) => x.date === process.argv[3]) : list[0];
    if (!b) {
      console.log("Ni kopije za preizkus. Najprej: node scripts/obnovi-kopijo.js --zdaj");
      process.exit(1);
    }
    const r = verifyBackup(file, b.file);
    console.log(`Kopija ${b.date} (${mbs(b.bytes)} MB): ${r.ok ? "OBNOVA BI USPELA" : "NAPAKA – obnova iz te kopije ne bi uspela"}`);
    for (const [t, c] of Object.entries(r.counts)) console.log(`  ${t.padEnd(14)} kopija ${String(c.kopija).padStart(7)}   zdaj ${String(c.baza).padStart(7)}`);
    for (const n of r.notes) console.log(`  ! ${n}`);
    if (!r.ok) process.exitCode = 1;
  } else if (arg.startsWith("--oblak")) {
    const cfg = cloudConfig();
    if (!cfg) {
      console.log("Kopija zunaj strežnika ni nastavljena (EVKLID_KOPIJE_S3_URL, _BUCKET, _KEY_ID, _SECRET; docs/objava.md).");
      process.exit(1);
    }
    try {
      if (arg === "--oblak") {
        const remote = await listCloud(cfg, file);
        if (!remote.length) console.log("Zunaj strežnika še ni nobene kopije (strežnik jo naloži 10 minut po zagonu ali: --oblak-zdaj).");
        for (const b of remote) console.log(b.date);
      } else if (arg === "--oblak-zdaj") {
        const b = list.find((x) => !x.manual) ?? list[0];
        if (!b) throw new Error("lokalne kopije še ni; najprej: node scripts/obnovi-kopijo.js --zdaj");
        const date = b.date.slice(0, 10);
        const r = await uploadBackup(cfg, file, b.file, date);
        console.log(`Naložena kopija ${date} (${Math.round(r.bytes / 1024)} kB, šifrirana).${r.deleted.length ? ` Pobrisane stare: ${r.deleted.join(", ")}.` : ""}`);
      } else if (arg === "--oblak-prenesi" && /^\d{4}-\d{2}-\d{2}$/.test(process.argv[3] || "")) {
        const r = await downloadBackup(cfg, file, process.argv[3]);
        console.log(`Prenesena in preverjena kot lokalna kopija ${r.name}.`);
        console.log(`Preizkus: node scripts/obnovi-kopijo.js --preveri ${r.name}   Obnova: node scripts/obnovi-kopijo.js ${r.name}`);
      } else {
        console.log(`Ne razumem »${process.argv.slice(2).join(" ")}«.\n\n${HELP}`);
        process.exitCode = 1;
      }
    } catch (e) {
      console.log(`Napaka: ${e.message}`);
      process.exitCode = 1;
    }
  } else if (arg === "--preklici") {
    if (!fs.existsSync(pending)) console.log("Nobena obnova ni pripravljena.");
    else {
      fs.rmSync(pending, { force: true });
      console.log("Pripravljena obnova je preklicana. Baza ostane, kakršna je.");
    }
  } else if (arg === "--razveljavi") {
    const saved = savedBeforeRestore(file)[0];
    if (!saved) {
      console.log("Ni shranjene baze izpred obnove (hrani se 14 dni).");
      process.exit(1);
    }
    prepareRestore(file, saved);
    console.log(`Pripravljena vrnitev na bazo izpred obnove (${path.basename(saved)}).`);
    restartHint();
  } else {
    const b = list.find((x) => x.date === arg);
    if (!b) {
      console.log(/^\d{4}-\d{2}-\d{2}(-\d{4})?$/.test(arg) ? `Kopije ${arg} ni. Seznam: node scripts/obnovi-kopijo.js` : `Ne razumem »${arg}«.\n\n${HELP}`);
      process.exit(1);
    }
    prepareRestore(file, b.file);
    console.log(`Pripravljena obnova iz kopije ${b.date}. Vse, kar se je zgodilo po njej, se bo izgubilo.`);
    restartHint();
    console.log("Sedanja baza ostane shranjena 14 dni (razveljavitev: node scripts/obnovi-kopijo.js --razveljavi).");
  }
}
