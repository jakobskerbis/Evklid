// D2: čas dnevne meje močnejšega modela (deepToday) pri 1 000 000 vrsticah porabe (90 dni, ~11 000 danes).
// Zagon: node scripts/meri-poraba-danes.mjs [koren repozitorija]  (sklop D, meritev prej/potem z isto skripto)
import path from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = path.resolve(process.argv[2] || path.join(path.dirname(new URL(import.meta.url).pathname), "..")); // za »prej«: koren starejše kopije
const { openDb } = await import(pathToFileURL(path.join(ROOT, "server/db.js")).href);
const { Usage } = await import(pathToFileURL(path.join(ROOT, "server/usage.js")).href);
const { MODEL_DEEP } = await import(pathToFileURL(path.join(ROOT, "server/claude.js")).href);
const store = openDb(":memory:");
const ids = Array.from({ length: 200 }, (_, i) => store.createStudent(`U${i}`).id);
const ins = store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, ?, 'chat', 0.001, datetime('now', ?))");
store.db.exec("BEGIN");
for (let i = 0; i < 1_000_000; i++) ins.run(ids[i % 200], i % 7 ? "claude-haiku-5-5" : MODEL_DEEP, `-${(i * 7919) % (90 * 86400)} seconds`);
store.db.exec("COMMIT");
const u = new Usage(store.db);
u.deepToday(ids[0], MODEL_DEEP);
const casi = [];
for (let i = 0; i < 20; i++) { const t = performance.now(); u.deepToday(ids[i], MODEL_DEEP); casi.push(performance.now() - t); }
casi.sort((a, b) => a - b);
console.log(JSON.stringify({ tocka: "D2 deepToday", vrstic: 1e6, mediana_ms: +casi[10].toFixed(2), najvec_ms: +casi[19].toFixed(2) }));
