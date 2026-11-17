// Časi odgovorov inštruktorja (j, 17. 11. 2026: »prvo besedilo naj pride prej«; najprej merimo, brez stroška).
// Za vsak klic modela pri odgovoru v klepetu: čas do prvega razmišljanja, do prvega besedila in do konca (od
// začetka klica modela), čas pred klicem (od prihoda sporočila: povzetek, priprava), model, način, raven in ali je
// model razmišljal. Brez učenca, pogovora ali besedila. Da vrstice ni mogoče povezati z vrstico v tabeli usage
// (ta ima učenca in čas na sekundo), je shranjen samo dan, ključ vrstice pa je naključen (vrstni red znotraj dneva
// ne pove ničesar). Vrstice starejše od 90 dni se brišejo. Povzetek (mediana in p90 po modelu, načinu in
// razmišljanju) vidi samo skrbnik (GET /api/usage/casi). Poskus »hitri-korak«: server/hitri-korak.js.

const HRAMBA_DNI = 90;

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
function pocisti(db, { zdaj = false } = {}) {
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

const kvantil = (urejeno, q) => (urejeno.length ? urejeno[Math.min(urejeno.length - 1, Math.ceil(q * urejeno.length) - 1)] : null);

/** Povzetek zadnjih `dni` dni: skupine po modelu, načinu, razmišljanju in poskusu; mediana in p90 v ms. */
export function casiPovzetek(db, { dni = 7 } = {}) {
  ensureCasiTable(db);
  pocisti(db, { zdaj: true });
  const vrstice = db
    .prepare(`SELECT model, nacin, razmislek, poskus, pred_ms, razmislek_ms, besedilo_ms, konec_ms FROM casi_odgovora WHERE created_at >= date('now', ?)`)
    .all(`-${Math.max(1, Math.min(90, Number(dni) || 7))} days`);
  const skupine = new Map();
  for (const v of vrstice) {
    const k = [v.model, v.nacin, v.razmislek, v.poskus].join("|");
    if (!skupine.has(k)) skupine.set(k, { model: v.model, nacin: v.nacin, razmislek: !!v.razmislek, poskus: v.poskus, vrstice: [] });
    skupine.get(k).vrstice.push(v);
  }
  const stat = (list, polje) => {
    const u = list.map((v) => v[polje]).filter((x) => x !== null && x !== undefined).sort((a, b) => a - b);
    return { n: u.length, mediana: kvantil(u, 0.5), p90: kvantil(u, 0.9) };
  };
  return [...skupine.values()]
    .map(({ vrstice: list, ...g }) => ({ ...g, n: list.length, pred: stat(list, "pred_ms"), misli: stat(list, "razmislek_ms"), besedilo: stat(list, "besedilo_ms"), konec: stat(list, "konec_ms") }))
    .sort((a, b) => b.n - a.n);
}
