// Samodejni izbris priprav na test (odločitev j 24. 11. 2026, docs/priprava.md): 30 dni po datumu testa; brez
// datuma testa 30 dni po zadnji uporabi priprave. Ob spremembi datuma šteje nov datum (rok se vedno izračuna iz
// trenutnega datum_testa). Teče v dnevnem čiščenju po rokih hrambe (server/zasebnost.js runRetention) z istim
// `now`, zato ga testi poženejo s podtaknjeno uro.
import { zVarnimBrisanjem } from "./shramba.js";

export const ROK_DNI = 30;

const DAN = 86400000;
const sqlCas = (ms) => new Date(ms).toISOString().replace("T", " ").slice(0, 19);
const sqlDan = (ms) => new Date(ms).toISOString().slice(0, 10);

// Dan samodejnega izbrisa (YYYY-MM-DD, UTC) za vrstico priprave: datum_testa + 30 dni ali zadnja_uporaba + 30 dni.
export function danIzbrisa({ datum_testa, zadnja_uporaba }) {
  const od = datum_testa ? Date.parse(`${datum_testa}T00:00:00Z`) : Date.parse(`${String(zadnja_uporaba || "").replace(" ", "T")}Z`);
  return Number.isFinite(od) ? sqlDan(od + ROK_DNI * DAN) : null;
}

/**
 * Izbriše priprave z iztečenim rokom (z viri in izvirniki, ON DELETE CASCADE). Vrne število izbrisanih priprav.
 * Z datumom testa: izbris na dan datum_testa + 30 (UTC) ali pozneje. Brez datuma: ko je od zadnje uporabe minilo 30 dni.
 */
export function pocistiPriprave(db, { now = Date.now() } = {}) {
  if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'priprave'").get()) return 0;
  const mejaDan = sqlDan(now - ROK_DNI * DAN);
  const mejaCas = sqlCas(now - ROK_DNI * DAN);
  return zVarnimBrisanjem(db, () =>
    Number(
      db
        .prepare("DELETE FROM priprave WHERE (datum_testa IS NOT NULL AND datum_testa <= ?) OR (datum_testa IS NULL AND zadnja_uporaba <= ?)")
        .run(mejaDan, mejaCas).changes,
    ),
  );
}
