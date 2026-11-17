// Časi odgovorov inštruktorja (j, 17. 11. 2026: »prvo besedilo naj pride prej«; najprej merimo, brez stroška).
// Za vsak klic modela pri odgovoru v klepetu: čas do prvega razmišljanja, do prvega besedila in do konca (od
// začetka klica modela), čas pred klicem (od prihoda sporočila: povzetek, priprava), model, način, raven in ali je
// model razmišljal. Brez učenca, pogovora ali besedila. Da vrstice ni mogoče povezati z vrstico v tabeli usage
// (ta ima učenca in čas na sekundo), je shranjen samo dan, ključ vrstice pa je naključen (vrstni red znotraj dneva
// ne pove ničesar). Vrstice starejše od 30 dni se brišejo (največ enkrat na uro). Povzetek (mediana in p90 po modelu, načinu in
// razmišljanju) vidi samo skrbnik (GET /api/usage/casi). Poskus »hitri-korak«: server/hitri-korak.js.

const HRAMBA_DNI = 30; // ~30 MB pri 10 tisoč odgovorih na dan (tabela je v vsaki varnostni kopiji)

export function ensureCasiTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS casi_odgovora (
      id INTEGER PRIMARY KEY,
      created_at TEXT NOT NULL DEFAULT (date('now')),
      model TEXT NOT NULL,
      nacin TEXT NOT NULL,
      raven TEXT NOT NULL DEFAULT '',
      razmislek INTEGER NOT NULL DEFAULT 1,
      poskus TEXT NOT NULL DEFAULT '',
      pred_ms INTEGER,
      razmislek_ms INTEGER,
      besedilo_ms INTEGER,
      konec_ms INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_casi_odgovora ON casi_odgovora(created_at);
  `);
}

const ms = (v) => (Number.isFinite(v) && v >= 0 ? Math.round(v) : null);
let zadnjeCiscenje = 0;
function pocisti(db, zdaj = false) {
  if (!zdaj && Date.now() - zadnjeCiscenje < 3600e3) return;
  zadnjeCiscenje = Date.now();
  db.prepare(`DELETE FROM casi_odgovora WHERE created_at < date('now', '-${HRAMBA_DNI} days')`).run();
}

/** Zapiše čase enega odgovora. t: { thinking, firstThinkMs, firstTextMs, totalMs } iz streamReply (server/claude.js). */
export function logCasi(db, { model, nacin, raven = "", poskus = "", predMs = null, timing }) {
  if (!db || !timing || !model) return;
  try {
    ensureCasiTable(db);
    // Naključen ključ (ne zaporedni rowid): vrstni red vstavljanja ostane skrit.
    db.prepare("INSERT OR IGNORE INTO casi_odgovora (id, model, nacin, raven, razmislek, poskus, pred_ms, razmislek_ms, besedilo_ms, konec_ms) VALUES (abs(random()) % 9007199254740991 + 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
      String(model).slice(0, 60),
      String(nacin || "chat").slice(0, 20),
      String(raven || "").slice(0, 10),
      timing.thinking === false ? 0 : 1,
      String(poskus || "").slice(0, 20),
      ms(predMs),
      ms(timing.firstThinkMs),
      ms(timing.firstTextMs),
      ms(timing.totalMs),
    );
    pocisti(db);
  } catch (e) {
    console.warn(`[evklid] časi odgovora niso zapisani: ${e?.message || e}`);
  }
}

// Povzetek je v predpomnilniku 60 s (števec porabe ga lahko odpira večkrat); kvantili se računajo v SQLite (okenske
// funkcije), v JS pride le nekaj vrstic na skupino. Kvantil q: urejena vrednost na mestu ceil(q · n) (1 = prva).
const POLJA = { pred: "pred_ms", misli: "razmislek_ms", besedilo: "besedilo_ms", konec: "konec_ms" };
const SKUPINA = "model, nacin, razmislek, poskus";
let predpomnilnik = null;

/** Povzetek zadnjih `dni` koledarskih dni (z današnjim): skupine po modelu, načinu, razmišljanju in poskusu; mediana in p90 v ms. */
export function casiPovzetek(db, { dni = 7 } = {}) {
  const d = Math.max(1, Math.min(HRAMBA_DNI, Number(dni) || 7));
  if (predpomnilnik && predpomnilnik.db === db && predpomnilnik.dni === d && Date.now() - predpomnilnik.at < 60e3) return predpomnilnik.out;
  ensureCasiTable(db);
  pocisti(db);
  const od = `-${d - 1} days`; // dni = 7: danes in 6 dni prej
  const skupine = new Map();
  const kljuc = (v) => [v.model, v.nacin, v.razmislek, v.poskus].join("|");
  for (const v of db.prepare(`SELECT ${SKUPINA}, COUNT(*) AS n FROM casi_odgovora WHERE created_at >= date('now', ?) GROUP BY ${SKUPINA}`).all(od)) {
    skupine.set(kljuc(v), { model: v.model, nacin: v.nacin, razmislek: !!v.razmislek, poskus: v.poskus, n: v.n, ...Object.fromEntries(Object.keys(POLJA).map((k) => [k, { n: 0, mediana: null, p90: null }])) });
  }
  for (const [ime, stolpec] of Object.entries(POLJA)) {
    const vrstice = db
      .prepare(
        `WITH r AS (
           SELECT ${SKUPINA}, ${stolpec} AS v,
                  ROW_NUMBER() OVER (PARTITION BY ${SKUPINA} ORDER BY ${stolpec}) AS rn,
                  COUNT(*) OVER (PARTITION BY ${SKUPINA}) AS n
           FROM casi_odgovora WHERE created_at >= date('now', ?) AND ${stolpec} IS NOT NULL)
         SELECT ${SKUPINA}, MAX(n) AS n,
                MAX(CASE WHEN rn = (50 * n + 99) / 100 THEN v END) AS mediana,
                MAX(CASE WHEN rn = (90 * n + 99) / 100 THEN v END) AS p90
         FROM r GROUP BY ${SKUPINA}`,
      )
      .all(od);
    for (const v of vrstice) {
      const g = skupine.get(kljuc(v));
      if (g) g[ime] = { n: v.n, mediana: v.mediana, p90: v.p90 };
    }
  }
  const out = [...skupine.values()].sort((a, b) => b.n - a.n);
  predpomnilnik = { db, dni: d, at: Date.now(), out };
  return out;
}

/** Samo za teste: takojšnje čiščenje. */
export const pocistiCasi = (db) => pocisti(db, true);
/** Samo za teste: pozabi predpomnjen povzetek. */
export const pozabiPovzetek = () => (predpomnilnik = null);
