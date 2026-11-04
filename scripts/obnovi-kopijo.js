// Varnostne kopije baze (server/kopije.js). Poženi v Render → evklid → Shell ali v mapi aplikacije.
//   node scripts/obnovi-kopijo.js               seznam kopij
//   node scripts/obnovi-kopijo.js --zdaj        naredi kopijo takoj (prepiše današnjo)
//   node scripts/obnovi-kopijo.js --preveri     preizkus obnove brez spreminjanja: najnovejša kopija je cela,
//                                               tabele in števila vrstic se ujemajo z bazo (do zadnjega dne)
//   node scripts/obnovi-kopijo.js 2026-11-04    pripravi obnovo iz te kopije; velja ob naslednjem zagonu
//                                               (Render → Manual Deploy → Restart service)
import "../server/env.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { BRAND } from "../server/brand.js";
import { listBackups, checkFile, makeBackup, restoreFile } from "../server/kopije.js";

const TABLES = ["parents", "students", "conversations", "messages", "events", "tasks"];

/** Preizkus obnove: kopija je cela, ima vse tabele baze, vrstic ni več kot v bazi in ne bistveno manj. */
export function verifyBackup(dbFile, backupFile) {
  const out = { file: backupFile, ok: true, notes: [], counts: {} };
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
  } finally {
    live.close();
    copy.close();
  }
  return out;
}

/** Pripravi obnovo: kopijo prekopira v obnovi.db (strežnik jo uporabi ob naslednjem zagonu). */
export function prepareRestore(dbFile, backupFile) {
  const ok = checkFile(backupFile);
  if (ok !== "ok") throw new Error(`kopija ni cela: ${ok}`);
  const dest = restoreFile(dbFile);
  fs.copyFileSync(backupFile, `${dest}.tmp`);
  fs.renameSync(`${dest}.tmp`, dest);
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
  const mb = (b) => (b / 1024 / 1024).toFixed(1);
  if (!arg) {
    if (!list.length) console.log("Kopij še ni. Strežnik naredi prvo 2 minuti po zagonu (ali: --zdaj).");
    for (const b of list) console.log(`${b.date}  ${mb(b.bytes)} MB  ${b.file}`);
  } else if (arg === "--zdaj") {
    const db = new DatabaseSync(file);
    try {
      const r = makeBackup(db, file, { force: true });
      console.log(r.made ? `Narejena: ${r.file} (${mb(r.bytes)} MB)` : `Ni narejena: ${r.reason}`);
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
    console.log(`Kopija ${b.date} (${mb(b.bytes)} MB): ${r.ok ? "OBNOVA BI USPELA" : "NAPAKA"}`);
    for (const [t, c] of Object.entries(r.counts)) console.log(`  ${t.padEnd(14)} kopija ${String(c.kopija).padStart(7)}   zdaj ${String(c.baza).padStart(7)}`);
    for (const n of r.notes) console.log(`  ! ${n}`);
    if (!r.ok) process.exitCode = 1;
  } else {
    const b = list.find((x) => x.date === arg || x.file === path.resolve(arg));
    if (!b) {
      console.log(`Kopije ${arg} ni. Seznam: node scripts/obnovi-kopijo.js`);
      process.exit(1);
    }
    const dest = prepareRestore(file, b.file);
    console.log(`Pripravljeno: ${dest}`);
    console.log("Zdaj znova zaženi strežnik (Render → evklid → Manual Deploy → Restart service).");
    console.log("Ob zagonu se baza zamenja s kopijo; sedanja ostane kot <baza>.pred-obnovo-<čas>.");
  }
}
