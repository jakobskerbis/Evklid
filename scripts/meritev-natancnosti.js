// Meritev natančnosti CELEGA Evklidovega odgovora (j 2026-11-10: »meri tudi s programom«).
// Kliče jo scripts/primerjava-modelov.js --s-preverjanjem. Iste rešene primere iz lekcij pošlje skozi PRAVO pot
// klepeta (POST /api/conversations/:id/messages na aplikaciji v pomnilniku: isti prompt, model po stopnji,
// server/live-check.js), vsakega dvakrat v istem zagonu:
//   »brez«  EVKLID_LIVE_CHECK=0  (sam model, brez skrite opombe z rezultatom, preračuna, popravka in pregleda),
//   »s«     EVKLID_LIVE_CHECK=1  (odgovor, kot ga vidi učenec).
// Oceni končno besedilo, ki ga dobi učenec: zmogljivejši model (Opus) proti rešitvi iz lekcije, pri računskih
// nalogah še koda (končna števila iz vrstice »Odgovor« v lekciji morajo biti v odgovoru; neujemanje se izpiše
// posebej za ročni pregled, ker je enak rezultat lahko zapisan drugače).
// Tu so tudi čisti deli brez klicev (povzetek, tabela za docs/stroski-ai.md, zadnja meritev), ki jih uporabljata
// server/vidnost.js (stran /zakaj-evklid) in test/vidnost.test.js.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const MERITVE_DIR = path.join(root, "docs", "meritve");
export const DOC = path.join(root, "docs", "stroski-ai.md");
export const DOC_START = "<!-- NATANCNOST:ZACETEK (piše scripts/primerjava-modelov.js, ne urejaj ročno) -->";
export const DOC_END = "<!-- NATANCNOST:KONEC -->";

export const CONDITIONS = [
  { kljuc: "brez", liveCheck: "0", ime: "Sam model, brez preverjanja", ime_en: "Model alone, without the program check" },
  { kljuc: "s", liveCheck: "1", ime: "Cel Evklidov odgovor, s preverjanjem", ime_en: "Evklid's full answer, with the program check" },
];

// ---------- zadnja meritev (docs/meritve/natancnost-<datum>.json) ----------
export function latestMeasurement(dir = MERITVE_DIR) {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^natancnost-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort() : [];
  if (!files.length) return null;
  const file = files.at(-1);
  return { ...JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")), datoteka: `docs/meritve/${file}` };
}

// Delež napak vrstice: iz števila napak, če je zapisano, sicer zapisani odstotek (stara meritev ima le odstotke).
export const pctOf = (row) => (Number.isFinite(row.napake) && row.primeri ? (100 * row.napake) / row.primeri : row.napake_pct);
export const pctText = (row) => {
  const p = pctOf(row);
  return (Number.isInteger(p) ? String(p) : p.toFixed(1)).replace(".", ",");
};
// »2026-11-04« → »4. 11. 2026«
export const slDate = (iso) => iso.split("-").map(Number).reverse().join(". ");

// ---------- ocena s kodo: končna števila iz lekcije ----------
const plainNumbers = (s) =>
  String(s || "")
    .replace(/\{,\}/g, ",")
    .replace(/\\[,;:! ]/g, "")
    .replace(/[   ]/g, "")
    .replace(/\^\{?-?\d+\}?/g, "") // potence enot (m^2)
    .replace(/_\{?[\w,]+\}?/g, "") // indeksi (U_1)
    .replace(/(\d)\.(\d)/g, "$1,$2")
    .match(/\d+(?:,\d+)?/g) || [];
const norm = (n) => n.replace(/^0+(?=\d)/, "").replace(/(,\d*?)0+$/, "$1").replace(/,$/, "");

// Števila iz zadnje vrstice »Odgovor« rešitve v lekciji; [] = naloga nima številskega odgovora.
export function finalNumbers(solution) {
  const line = String(solution || "").split("\n").filter((l) => /Odgovor\s*:/.test(l)).at(-1);
  return line ? [...new Set(plainNumbers(line.split(/Odgovor\s*:/)[1]).map(norm))] : [];
}
// true: vsa končna števila lekcije so v odgovoru; false: katero manjka; null: ni kaj primerjati.
export function codeResult(solution, answer) {
  const want = finalNumbers(solution);
  if (!want.length) return null;
  const have = new Set(plainNumbers(answer).map(norm));
  return want.every((n) => have.has(n));
}

// ---------- povzetek ----------
// rows: { id, stopnja, pogoj, ocena, vrsta, razlog, rezultat_podan, koda, usd, popravek, pregled, model }
export function summarize(rows, meta) {
  const graded = (r) => ["pravilno", "manjsa_napaka", "napaka"].includes(r.ocena);
  // Primerljivo: samo primeri, ocenjeni v OBEH pogojih.
  const byId = {};
  for (const r of rows) (byId[r.id] ||= []).push(r);
  const ids = Object.keys(byId).filter((id) => CONDITIONS.every((c) => byId[id].some((r) => r.pogoj === c.kljuc && graded(r))));
  const used = rows.filter((r) => ids.includes(r.id));
  const count = (list, key) => list.reduce((a, r) => ((a[r[key]] = (a[r[key]] || 0) + 1), a), {});
  const vrstice = CONDITIONS.map((c) => {
    const r = used.filter((x) => x.pogoj === c.kljuc);
    const err = r.filter((x) => x.ocena === "napaka");
    const po = {};
    for (const x of r) {
      const g = (po[x.stopnja] ||= { primeri: 0, napake: 0 });
      g.primeri++;
      if (x.ocena === "napaka") g.napake++;
    }
    return {
      kljuc: c.kljuc,
      ime: c.ime,
      ime_en: c.ime_en,
      primeri: r.length,
      napake: err.length,
      manjse_napake: r.filter((x) => x.ocena === "manjsa_napaka").length,
      pravilno: r.filter((x) => x.ocena === "pravilno").length,
      rezultat_podan: r.filter((x) => x.rezultat_podan === true).length,
      po_stopnjah: po,
      vrste_napak: count(err, "vrsta"),
      // Koda: končno število iz lekcije manjka v odgovoru, čeprav je ocenjevalec odgovor ocenil kot pravilen (ročni pregled).
      koda_neujemanje: r.filter((x) => x.koda === false && x.rezultat_podan === true && x.ocena !== "napaka").length,
      popravki: r.filter((x) => x.popravek).length,
      pregledi: r.filter((x) => x.pregled).length,
      modeli: count(r, "model"),
      usd_na_odgovor: r.length ? Number((r.reduce((s, x) => s + (x.usd || 0), 0) / r.length).toFixed(5)) : 0,
    };
  });
  return {
    shema: 1,
    datum: meta.datum,
    vrsta: "aplikacija",
    primeri: ids.length,
    izpusceni: Object.keys(byId).length - ids.length,
    ocenjevalec: meta.ocenjevalec,
    vprasanje: meta.vprasanje,
    vrstice,
    strosek_usd: meta.strosek_usd,
    trajanje_min: meta.trajanje_min,
    opombe: [
      "Isti primeri v obeh pogojih, isti zagon; vsak odgovor je nastal s svojim klicem modela, zato je del razlike lahko naključen.",
      "Pot: POST /api/conversations/:id/messages (pravi klepet), nov učenec in pogovor s temo lekcije za vsak primer, model po stopnji kot pri plačljivem paketu.",
      "Brez predpomnilnika odgovorov, brez nadgradenj po mesečnem proračunu in brez dnevne meje za pregled z zmogljivejšim modelom (v aplikaciji 0,30 $ na dan za vse učence skupaj).",
      "Ocenjevalec je model AI (primerja z rešitvijo iz lekcije), ne človek.",
      ...(meta.opombe || []),
    ],
    napake: used
      .filter((r) => r.ocena === "napaka" || (r.koda === false && r.rezultat_podan === true))
      .map((r) => ({ id: r.id, stopnja: r.stopnja, pogoj: r.pogoj, ocena: r.ocena, vrsta: r.vrsta || null, koda: r.koda, razlog: String(r.razlog || "").slice(0, 300) })),
  };
}

// ---------- tabela za docs/stroski-ai.md ----------
export function tableMd(m) {
  const lines = [
    `Zadnja meritev: ${slDate(m.datum)}, ${m.primeri} rešenih primerov iz lekcij, ocenjevalec ${m.ocenjevalec} (\`${m.datoteka || `docs/meritve/natancnost-${m.datum}.json`}\`).`,
    ``,
    `| Kaj je merjeno | Odgovori z napako | Primeri |`,
    `|---|---|---|`,
    ...m.vrstice.map((r) => `| ${r.ime}${r.opomba ? ` (${r.opomba})` : ""} | ${pctText(r)} %${Number.isFinite(r.napake) ? ` (${r.napake} od ${r.primeri})` : ""} | ${r.primeri} |`),
  ];
  if (m.vrsta === "aplikacija") {
    const stopnje = [...new Set(m.vrstice.flatMap((r) => Object.keys(r.po_stopnjah || {})))];
    lines.push(``, `| Stopnja | ${m.vrstice.map((r) => r.ime).join(" | ")} |`, `|---|${m.vrstice.map(() => "---").join("|")}|`);
    for (const g of stopnje) lines.push(`| ${g} | ${m.vrstice.map((r) => (r.po_stopnjah[g] ? `${r.po_stopnjah[g].napake} od ${r.po_stopnjah[g].primeri}` : "–")).join(" | ")} |`);
    const s = m.vrstice.find((r) => r.kljuc === "s");
    const vrste = Object.entries(s?.vrste_napak || {}).map(([k, v]) => `${k} ${v}`).join(", ");
    lines.push(
      ``,
      `S preverjanjem: popravek v ${s?.popravki ?? 0} odgovorih, pregled z zmogljivejšim modelom v ${s?.pregledi ?? 0}; preostale napake po vrstah: ${vrste || "ni napak"}; koda našla neujemanje končnega števila pri ${s?.koda_neujemanje ?? 0} odgovorih brez ocene »napaka« (ročni pregled).`,
      `Strošek zagona: ${Number(m.strosek_usd?.skupaj || 0).toFixed(2).replace(".", ",")} $ (aplikacija ${Number(m.strosek_usd?.aplikacija || 0).toFixed(2).replace(".", ",")} $, ocenjevalec ${Number(m.strosek_usd?.ocenjevalec || 0).toFixed(2).replace(".", ",")} $), ${m.trajanje_min ?? "?"} min.`,
    );
  }
  lines.push(``);
  for (const o of m.opombe || []) lines.push(`- ${o}`);
  return lines.join("\n");
}

export function updateDoc(text, m) {
  const a = text.indexOf(DOC_START);
  const b = text.indexOf(DOC_END);
  if (a < 0 || b < a) throw new Error("docs/stroski-ai.md: manjka oznaka NATANCNOST");
  return `${text.slice(0, a + DOC_START.length)}\n${tableMd(m)}\n${text.slice(b)}`;
}

export function writeMeasurement(m, { dir = MERITVE_DIR, doc = DOC } = {}) {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `natancnost-${m.datum}.json`);
  const { datoteka: _d, ...clean } = m;
  fs.writeFileSync(file, JSON.stringify(clean, null, 1) + "\n");
  fs.writeFileSync(doc, updateDoc(fs.readFileSync(doc, "utf8"), { ...clean, datoteka: `docs/meritve/${path.basename(file)}` }));
  return file;
}

// ---------- zagon skozi pravo pot klepeta ----------
// Najdražji možni korak para (dva odgovora, pregled, popravek, dve oceni): pred vsakim primerom preverimo mejo.
export async function runChecked({ tasks, settingsFor, question, grade, group, maxUsd, worstPair, modelDeep, log = console.log }) {
  // Nastavitve morajo biti pred uvozom aplikacije (server/app.js jih delno prebere ob uvozu).
  process.env.EVKLID_ANSWER_CACHE = "0"; // vsak odgovor res pripravi model
  process.env.EVKLID_VARNOST_VSAKO = "0"; // varnostni pregled sporočila ni del meritve pravilnosti
  process.env.EVKLID_LIVE_CHECK_DAILY_USD = "1000"; // dnevna meja pregledov ne sme prekiniti meritve sredi zagona
  for (const k of ["EVKLID_PASSWORD", "EVKLID_TESTNA_VERZIJA", "EVKLID_MONTHLY_BUDGET_USD", "EVKLID_SS_THINK", "EVKLID_UNI_MID", "EVKLID_COMPETITION_DEEP"]) delete process.env[k];
  const { openDb } = await import("../server/db.js");
  const { createApp } = await import("../server/app.js");
  const store = openDb(":memory:"); // produkcijske baze se ne dotakne
  const app = createApp(store, { accounts: false, scheduler: false, backups: false });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const appCost = () => store.db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage").get().s;
  const started = Date.now();
  const rows = [];
  let gradeUsd = 0;
  let stopped = false;
  let appUsd = 0;
  try {
    for (const [i, t] of tasks.entries()) {
      if (appCost() + gradeUsd + worstPair > maxUsd) {
        stopped = true;
        log(`Naslednji primer bi lahko presegel mejo ${maxUsd} $, ustavljam pri ${i} od ${tasks.length}.`);
        break;
      }
      for (const c of CONDITIONS) {
        process.env.EVKLID_LIVE_CHECK = c.liveCheck;
        const row = { id: t.id, stopnja: group(t.path), pogoj: c.kljuc, title: t.title };
        try {
          const student = store.createStudent(`Ana ${i + 1}${c.kljuc}`, settingsFor(t.path));
          const conv = store.createConversation(student.id, { pathTopic: t.id, title: "Meritev" });
          const res = await fetch(`${base}/api/conversations/${conv.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: question(t.task) }) });
          const sse = await res.text();
          const done = [...sse.matchAll(/^event: done\ndata: (.*)$/gm)].at(-1);
          if (!res.ok || !done) throw new Error(`klepet ${res.status}: ${sse.slice(0, 160)}`);
          row.answer = String(JSON.parse(done[1]).text || "");
          const used = store.db.prepare("SELECT kind, model, cost_usd FROM usage WHERE student_id = ?").all(student.id);
          row.usd = used.reduce((s, u) => s + u.cost_usd, 0);
          row.model = used.find((u) => u.kind === "chat")?.model || "?";
          row.popravek = used.some((u) => u.kind === "popravek");
          row.pregled = used.some((u) => u.kind === "preverjanje");
          row.koda = codeResult(t.solution, row.answer);
          const { usd = 0, ...verdict } = await grade(t, row.answer);
          gradeUsd += usd;
          Object.assign(row, verdict);
        } catch (err) {
          Object.assign(row, { ocena: "neocenjeno", razlog: `napaka klica: ${String(err?.message || err).slice(0, 200)}` });
        }
        rows.push(row);
        log(`[${i + 1}/${tasks.length}] ${c.kljuc.padEnd(4)} ${String(row.ocena).padEnd(13)} ${row.popravek ? "popravek " : ""}${row.pregled ? "pregled " : ""}${t.id}  (skupaj ${(appCost() + gradeUsd).toFixed(2)} $)`);
      }
    }
  } finally {
    process.env.EVKLID_LIVE_CHECK = "1";
    appUsd = appCost(); // ves strošek aplikacije (odgovori, popravki, pregledi), prebran pred zaprtjem baze
    await new Promise((r) => server.close(r));
    server.closeAllConnections?.();
    store.db.close();
  }
  return { rows, stopped, appUsd, gradeUsd, modelDeep, trajanje_min: Math.round((Date.now() - started) / 60000) };
}
