// Preizkus obnove iz kopije (scripts/obnovi-kopijo.js --preveri in nočni preizkus, server/kopije-preveri.js).
// Lahek modul: uvaža samo kopije.js in crypto-polje.js (in vgrajene module), ker se naloži tudi v ločeni niti;
// zasebnost.js bi potegnil še učne načrte in ~110 MB pomnilnika (pregled PR #533).
import { Worker, isMainThread, workerData, parentPort } from "node:worker_threads";
import { DatabaseSync } from "node:sqlite";
import { checkFile } from "./kopije.js";
import { encryptionStats } from "./crypto-polje.js";

export const TABLES = ["parents", "students", "conversations", "messages", "events", "tasks"];
const MIN = 60 * 1000;

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

// V niti: preizkus in samo { ok, notes } nazaj (brez vsebine vrstic). Okolje (ključi) je kopija okolja strežnika.
if (!isMainThread && workerData?.kopijePreizkus) {
  const { dbFile, backupFile } = workerData.kopijePreizkus;
  try {
    const r = verifyBackup(dbFile, backupFile);
    parentPort.postMessage({ ok: r.ok, notes: r.notes });
  } catch (e) {
    parentPort.postMessage({ ok: false, notes: [`preizkus obnove ni uspel: ${e.message}`] });
  }
}

/**
 * verifyBackup v ločeni niti (glavna nit vmes streže zahtevam; integrity_check in branje vseh šifriranih vrstic
 * trajata pri večji bazi sekunde). Kopica niti je omejena na 64 MB. Vrne { ok, notes }.
 */
export function verifyInWorker(dbFile, backupFile, { timeoutMs = 15 * MIN } = {}) {
  return new Promise((resolve) => {
    let done = false;
    let timer = null;
    const finish = (r) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(r);
    };
    let w;
    try {
      w = new Worker(new URL(import.meta.url), {
        workerData: { kopijePreizkus: { dbFile, backupFile } },
        // node:sqlite je še »experimental«: opozorilo ob vsakem zagonu niti ne sodi v dnevnik.
        execArgv: ["--disable-warning=ExperimentalWarning"], // zastavice strežnika (npr. --env-file) niti niso dovoljene
        resourceLimits: { maxOldGenerationSizeMb: 64, maxYoungGenerationSizeMb: 16 },
      });
    } catch (e) {
      return finish({ ok: false, notes: [`preizkus obnove ni uspel: ${e.message}`] });
    }
    timer = setTimeout(() => {
      finish({ ok: false, notes: [`preizkus obnove je trajal predolgo (več kot ${Math.round(timeoutMs / MIN) || "<1"} min)`] });
      w.terminate();
    }, timeoutMs);
    timer.unref?.();
    w.once("message", (m) => finish(m));
    w.once("error", (e) => finish({ ok: false, notes: [`preizkus obnove ni uspel: ${e.message}`] }));
    w.once("exit", (code) => finish({ ok: false, notes: [`preizkus obnove se je končal brez rezultata (koda ${code})`] }));
  });
}
