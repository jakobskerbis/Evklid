// Faza 0 – seštevki iz produkcijske baze za izhodiščne meritve (docs/meritve/zmogljivost-2026-11-13.md, »Za j na Renderju«).
// SAMO BRANJE: baza se odpre z readOnly in PRAGMA query_only; izpiše samo seštevke (brez vsebine, imen, e-naslovov ali id-jev):
//   - delež cache_read_tokens v vhodnih žetonih po vrsti klica (kind) in modelu, zadnjih 7 in 30 dni (tabela usage),
//   - število zapisov v answer_cache in SUM(hits),
//   - število vrstic v vsaki tabeli in velikost datoteke baze.
// Vhodni žetoni = input_tokens + cache_read_tokens + cache_write_tokens (API šteje branje in zapis predpomnilnika posebej).
// Zagon v Render Shell: node scripts/meritev-produkcija.mjs            (baza iz EVKLID_DB)
//                      node scripts/meritev-produkcija.mjs --json      (isto kot JSON)
//                      node scripts/meritev-produkcija.mjs <pot-do-baze>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Brez opozorila »SQLite is an experimental feature« (v Render Shell je videti kot napaka), kot server/env.js.
const privzeta = process.listeners("warning");
process.removeAllListeners("warning");
process.on("warning", (w) => {
  if (w?.name === "ExperimentalWarning" && /SQLite/i.test(String(w.message))) return;
  for (const fn of privzeta) fn(w);
});
const { DatabaseSync } = await import("node:sqlite");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAND = JSON.parse(fs.readFileSync(path.join(ROOT, "brand.json"), "utf8"));
const args = process.argv.slice(2);
const kotJson = args.includes("--json");
const file = args.find((a) => !a.startsWith("--")) || process.env[`${BRAND.env}_DB`] || path.join(ROOT, "data", `${BRAND.slug}.db`);
if (!fs.existsSync(file)) {
  console.error(`Baze ni: ${file}`);
  process.exit(1);
}

const db = new DatabaseSync(file, { readOnly: true });
db.exec("PRAGMA query_only = ON");
const tabele = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all()
  .map((r) => r.name);
const ima = (t) => tabele.includes(t);

const out = {
  cas: new Date().toISOString(),
  velikostMB: Math.round((fs.statSync(file).size / 1048576) * 10) / 10,
  predpomnilnik: {},
  odgovori: null,
  vrstice: {},
};

if (ima("usage")) {
  for (const dni of [7, 30]) {
    const vrstice = db
      .prepare(
        `SELECT kind, model, COUNT(*) AS klicev,
                SUM(input_tokens) AS vhod, SUM(cache_read_tokens) AS branje, SUM(cache_write_tokens) AS zapis,
                SUM(output_tokens) AS izhod, ROUND(SUM(cost_usd), 4) AS usd
           FROM usage WHERE created_at >= datetime('now', ?)
          GROUP BY kind, model ORDER BY usd DESC`,
      )
      .all(`-${dni} days`);
    const delez = (r) => {
      const vse = (r.vhod || 0) + (r.branje || 0) + (r.zapis || 0);
      return vse ? Math.round(((r.branje || 0) / vse) * 1000) / 10 : null;
    };
    const skupaj = vrstice.reduce(
      (a, r) => ({
        vhod: a.vhod + (r.vhod || 0),
        branje: a.branje + (r.branje || 0),
        zapis: a.zapis + (r.zapis || 0),
        klicev: a.klicev + r.klicev,
        usd: a.usd + (r.usd || 0),
      }),
      { vhod: 0, branje: 0, zapis: 0, klicev: 0, usd: 0 },
    );
    out.predpomnilnik[`${dni}d`] = {
      skupaj: { ...skupaj, usd: Math.round(skupaj.usd * 100) / 100, delezBranjaOdstotki: delez(skupaj) },
      poVrstiInModelu: vrstice.map((r) => ({ ...r, delezBranjaOdstotki: delez(r) })),
    };
  }
}
if (ima("answer_cache")) out.odgovori = db.prepare("SELECT COUNT(*) AS zapisov, COALESCE(SUM(hits), 0) AS zadetkov FROM answer_cache").get();
for (const t of tabele) out.vrstice[t] = db.prepare(`SELECT COUNT(*) AS n FROM "${t.replace(/"/g, '""')}"`).get().n;
db.close();

if (kotJson) {
  console.log(JSON.stringify(out, null, 1));
} else {
  console.log(`Baza: ${out.velikostMB} MB, ${out.cas}`);
  for (const [obdobje, p] of Object.entries(out.predpomnilnik)) {
    console.log(
      `\nDelež cache_read v vhodnih žetonih, zadnjih ${obdobje}: skupaj ${p.skupaj.delezBranjaOdstotki ?? "–"} % (${p.skupaj.klicev} klicev, ${p.skupaj.usd} $)`,
    );
    console.log("vrsta\tmodel\tklicev\tvhod\tbranje\tzapis\tizhod\tusd\tbranje %");
    for (const r of p.poVrstiInModelu)
      console.log([r.kind, r.model, r.klicev, r.vhod, r.branje, r.zapis, r.izhod, r.usd, r.delezBranjaOdstotki ?? "–"].join("\t"));
  }
  if (out.odgovori) console.log(`\nanswer_cache: ${out.odgovori.zapisov} zapisov, SUM(hits) = ${out.odgovori.zadetkov}`);
  console.log("\nVrstic po tabelah:");
  for (const [t, n] of Object.entries(out.vrstice).sort((a, b) => b[1] - a[1])) console.log(`${t}\t${n}`);
}
