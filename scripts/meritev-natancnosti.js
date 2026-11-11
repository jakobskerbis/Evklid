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
export const MIN_PRIMERI = 40; // najmanjši vzorec meritve s preverjanjem za zapis in objavo
// Oblika, ki jo stran sme pokazati; vrne razlog napake ali null.
export function measurementError(m) {
  if (!m || typeof m !== "object" || Array.isArray(m)) return "ni objekt";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(m.datum)) || Number.isNaN(Date.parse(m.datum))) return "datum";
  if (!["model", "aplikacija"].includes(m.vrsta)) return "vrsta";
  if (!Number.isInteger(m.primeri) || m.primeri <= 0) return "primeri";
  if (!Array.isArray(m.vrstice) || !m.vrstice.length) return "vrstice";
  for (const r of m.vrstice) {
    if (!r || typeof r.ime !== "string" || !r.ime.trim() || !Number.isInteger(r.primeri) || r.primeri <= 0) return "vrstica";
    const counted = r.napake !== undefined;
    if (counted ? !(Number.isInteger(r.napake) && r.napake >= 0 && r.napake <= r.primeri) : !(Number.isFinite(r.napake_pct) && r.napake_pct >= 0 && r.napake_pct <= 100)) return `napake (${r.ime})`;
  }
  if (m.vrsta === "aplikacija") {
    if (m.primeri < MIN_PRIMERI) return `manj kot ${MIN_PRIMERI} primerov`;
    if (m.vrstice.length !== CONDITIONS.length || CONDITIONS.some((c, i) => m.vrstice[i].kljuc !== c.kljuc || m.vrstice[i].napake === undefined || m.vrstice[i].primeri !== m.primeri)) return "pogoja";
    if (!["brez", "resnicna"].includes(m.meja_pregledov)) return "meja_pregledov";
  }
  return null;
}
// Pokvarjena ali napačno oblikovana zadnja datoteka → null (stran razdelek skrije, nikoli 500).
export function latestMeasurement(dir = MERITVE_DIR) {
  try {
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^natancnost-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort() : [];
    if (!files.length) return null;
    const file = files.at(-1);
    const m = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    const err = measurementError(m);
    if (err) throw new Error(`${file}: ${err}`);
    return { ...m, datoteka: `docs/meritve/${file}` };
  } catch (e) {
    console.warn(`[evklid] meritev natančnosti ni berljiva: ${e?.message || e}`);
    return null;
  }
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
      rezultat_podan_pct: r.length ? Math.round((100 * r.filter((x) => x.rezultat_podan === true).length) / r.length) : 0,
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
  // Pari: kaj se je pri istem primeru spremenilo med pogojema (napaka ↔ brez napake).
  const err = (id, k) => byId[id].find((r) => r.pogoj === k && graded(r)).ocena === "napaka";
  const pari = { bolje: 0, slabse: 0, napaka_v_obeh: 0, brez_napake_v_obeh: 0 };
  for (const id of ids) pari[err(id, "brez") ? (err(id, "s") ? "napaka_v_obeh" : "bolje") : err(id, "s") ? "slabse" : "brez_napake_v_obeh"]++;
  return {
    shema: 1,
    datum: meta.datum,
    vrsta: "aplikacija",
    meja_pregledov: meta.meja_pregledov === "resnicna" ? "resnicna" : "brez",
    pari,
    primeri: ids.length,
    izpusceni: Object.keys(byId).length - ids.length,
    ocenjevalec: meta.ocenjevalec,
    vprasanje: meta.vprasanje,
    vrstice,
    strosek_usd: meta.strosek_usd,
    trajanje_min: meta.trajanje_min,
    opombe: [
      "Isti primeri v obeh pogojih; vsak odgovor je nastal s svojim klicem modela, zato je del razlike šum: isti model na isto nalogo ne odgovori vedno enako. Polje »pari« pove, pri koliko primerih se je ocena spremenila v vsako smer (bolje: napaka samo brez preverjanja; slabše: napaka samo s preverjanjem).",
      "Napaka = ocena »napaka« (napačen rezultat, formula ali trditev). Manjše napake so štete posebej. Odgovor, ki učenca samo vodi z vprašanji in rezultata ne pove, šteje brez napake (delež odgovorov s podanim rezultatom: rezultat_podan_pct).",
      "Pot: POST /api/conversations/:id/messages (pravi klepet), nov učenec in pogovor s temo lekcije za vsak primer, model po stopnji kot pri plačljivem paketu.",
      meta.meja_pregledov === "resnicna"
        ? "Brez predpomnilnika odgovorov in brez nadgradenj po mesečnem proračunu; pregled z zmogljivejšim modelom z dnevno mejo aplikacije (0,30 $ na dan za vse učence skupaj), zato ga dobi le prvi del primerov."
        : "Brez predpomnilnika odgovorov, brez nadgradenj po mesečnem proračunu in BREZ dnevne meje za pregled z zmogljivejšim modelom (v aplikaciji 0,30 $ na dan za vse učence skupaj; ko je porabljena, pregleda ni).",
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
      `Pari (isti primer v obeh pogojih): bolje ${m.pari?.bolje ?? "?"}, slabše ${m.pari?.slabse ?? "?"}, napaka v obeh ${m.pari?.napaka_v_obeh ?? "?"}, brez napake v obeh ${m.pari?.brez_napake_v_obeh ?? "?"}. Rezultat podan: ${m.vrstice.map((r) => `${r.ime} ${r.rezultat_podan_pct ?? "?"} %`).join(", ")}. Dnevna meja pregledov: ${m.meja_pregledov === "resnicna" ? "resnična (kot v aplikaciji)" : "izklopljena"}.`,
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
  const bad = measurementError(m);
  if (bad) throw new Error(`Meritev ni v pravi obliki (${bad}); nič ni zapisano.`);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `natancnost-${m.datum}.json`);
  const { datoteka: _d, ...clean } = m;
  fs.writeFileSync(file, JSON.stringify(clean, null, 1) + "\n");
  fs.writeFileSync(doc, updateDoc(fs.readFileSync(doc, "utf8"), { ...clean, datoteka: `docs/meritve/${path.basename(file)}` }));
  return file;
}

// ---------- priprava odgovora za ocenjevalca ----------
// Popravek aplikacije je na koncu odgovora kot citat »> **Popravek:** …« (server/live-check.js fixBlock). Ocenjevalec
// ne sme iz oznake uganiti pogoja: oznako in znak citata odstranimo, besedilo popravka ostane kot zadnji odstavek.
export function neutralize(answer) {
  const s = String(answer || "");
  const i = s.lastIndexOf("\n\n> **");
  if (i < 0) return s;
  const block = s.slice(i + 2);
  if (!/^> \*\*[^*\n]{2,45}:\*\* /.test(block) || !block.split("\n").every((l) => l.startsWith(">"))) return s;
  return `${s.slice(0, i)}\n\n${block.replace(/^> \*\*[^*\n]{2,45}:\*\* /, "").split("\n").map((l) => l.replace(/^> ?/, "")).join("\n")}`;
}
export const GRADER_FINAL_RULE = "Če odgovor svojo trditev ali rezultat pozneje sam popravi, šteje končno stanje odgovora po popravku.";

// ---------- zagon skozi pravo pot klepeta ----------
const isGraded = (r) => ["pravilno", "manjsa_napaka", "napaka"].includes(r?.ocena);
const rowCost = (r) => (r.usd || 0) + (r.grade_usd || 0);

// Vmesne vrstice (data/, ni v repozitoriju): po prekinitvi isti ukaz nadaljuje, že ocenjeni odgovori se ne plačajo znova.
export function loadProgress(file) {
  try {
    const rows = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(rows) ? rows.filter((r) => r && typeof r.id === "string" && typeof r.pogoj === "string") : [];
  } catch {
    return [];
  }
}
function saveProgress(file, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(`${file}.tmp`, JSON.stringify(rows, null, 1));
  fs.renameSync(`${file}.tmp`, file);
}

// maxUsd velja za VES strošek meritve (tudi že shranjene vrstice prejšnjega zagona). worstPair: najdražji možni par
// (dva odgovora, pregled, popravek, dve oceni); pred vsakim primerom mora biti zanj še prostor pod mejo.
// createOpts: samo za teste (vstavljeni streamFn in reviewCreateFn namesto API).
export async function runChecked({ tasks, settingsFor, question, grade, group, maxUsd, worstPair, progressFile, realCap = false, createOpts = {}, log = console.log }) {
  if (!(Number.isFinite(maxUsd) && maxUsd > 0) || !(Number.isFinite(worstPair) && worstPair > 0)) throw new Error("runChecked: neveljavna meja stroška");
  // Nastavitve morajo biti pred uvozom aplikacije (server/app.js jih delno prebere ob uvozu).
  process.env.EVKLID_ANSWER_CACHE = "0"; // vsak odgovor res pripravi model
  process.env.EVKLID_VARNOST_VSAKO = "0"; // varnostni pregled sporočila ni del meritve pravilnosti
  // Dnevna meja pregledov z zmogljivejšim modelom: privzeto izklopljena (meri plačljivi paket, dokler je meja prosta);
  // --resnicna-meja pusti mejo aplikacije (privzeto 0,30 $ na dan), zato pregled dobi le prvi del primerov.
  if (realCap) delete process.env.EVKLID_LIVE_CHECK_DAILY_USD;
  else process.env.EVKLID_LIVE_CHECK_DAILY_USD = "1000";
  for (const k of ["EVKLID_PASSWORD", "EVKLID_TESTNA_VERZIJA", "EVKLID_MONTHLY_BUDGET_USD", "EVKLID_SS_THINK", "EVKLID_UNI_MID", "EVKLID_COMPETITION_DEEP"]) delete process.env[k];
  const { openDb } = await import("../server/db.js");
  const { createApp } = await import("../server/app.js");
  const store = openDb(":memory:"); // produkcijske baze se ne dotakne
  const app = createApp(store, { accounts: false, scheduler: false, backups: false, ...createOpts });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const started = Date.now();
  const old = progressFile ? loadProgress(progressFile) : [];
  // Že ocenjeni odgovori izbranih primerov se ne ponovijo; spodleteli (plačani, a neocenjeni) se ponovijo, njihov strošek ostane v vsoti.
  const rows = old.filter((r) => isGraded(r) && tasks.some((t) => t.id === r.id));
  const dead = old.filter((r) => !rows.includes(r)).map((r) => ({ id: r.id, pogoj: r.pogoj, ocena: "neocenjeno", usd: r.usd || 0, grade_usd: r.grade_usd || 0, razlog: r.razlog }));
  const resumed = rows.length;
  const spent = () => [...rows, ...dead].reduce((s, r) => s + rowCost(r), 0);
  if (old.length) log(`Nadaljujem: ${resumed} že ocenjenih odgovorov iz ${path.relative(root, progressFile)} (${spent().toFixed(2)} $ že porabljenih; --znova za nov začetek).`);
  let stopped = false;
  try {
    for (const [i, t] of tasks.entries()) {
      const todo = CONDITIONS.filter((c) => !rows.some((r) => r.id === t.id && r.pogoj === c.kljuc));
      if (!todo.length) continue;
      if (spent() + worstPair > maxUsd) {
        stopped = true;
        log(`Naslednji primer bi lahko presegel mejo ${maxUsd} $, ustavljam pri ${i} od ${tasks.length}.`);
        break;
      }
      for (const c of todo) {
        process.env.EVKLID_LIVE_CHECK = c.liveCheck;
        const row = { id: t.id, stopnja: group(t.path), pogoj: c.kljuc, title: t.title, usd: 0, grade_usd: 0 };
        let student = null;
        try {
          student = store.createStudent(`Ana ${i + 1}${c.kljuc}`, settingsFor(t.path));
          const conv = store.createConversation(student.id, { pathTopic: t.id, title: "Meritev" });
          const res = await fetch(`${base}/api/conversations/${conv.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: question(t.task) }) });
          const sse = await res.text();
          const done = [...sse.matchAll(/^event: done\ndata: (.*)$/gm)].at(-1);
          if (!res.ok || !done) throw new Error(`klepet ${res.status}: ${sse.slice(0, 160)}`);
          row.answer = String(JSON.parse(done[1]).text || "");
          row.koda = codeResult(t.solution, row.answer);
          // Ocenjevalec dobi besedilo brez oznake popravka in ne izve, kateri pogoj ocenjuje.
          const { usd = 0, ...verdict } = await grade(t, neutralize(row.answer));
          row.grade_usd = usd;
          Object.assign(row, verdict);
        } catch (err) {
          Object.assign(row, { ocena: "neocenjeno", razlog: `napaka klica: ${String(err?.message || err).slice(0, 200)}` });
        }
        // Strošek aplikacije za ta odgovor (tudi, če je ocena spodletela: odgovor je plačan).
        const used = student ? store.db.prepare("SELECT kind, model, cost_usd FROM usage WHERE student_id = ?").all(student.id) : [];
        row.usd = used.reduce((s, u) => s + u.cost_usd, 0);
        row.model = used.find((u) => u.kind === "chat")?.model || "?";
        row.popravek = used.some((u) => u.kind === "popravek");
        row.pregled = used.some((u) => u.kind === "preverjanje" || u.kind === "preverjanje-sola");
        (isGraded(row) ? rows : dead).push(row);
        if (progressFile) saveProgress(progressFile, [...rows, ...dead]);
        log(`[${i + 1}/${tasks.length}] ${c.kljuc.padEnd(4)} ${String(row.ocena).padEnd(13)} ${row.popravek ? "popravek " : ""}${row.pregled ? "pregled " : ""}${t.id}  (skupaj ${spent().toFixed(2)} $)`);
      }
    }
  } finally {
    process.env.EVKLID_LIVE_CHECK = "1";
    await new Promise((r) => server.close(r));
    server.closeAllConnections?.();
    store.db.close();
  }
  return {
    rows,
    stopped,
    resumed,
    failed: dead.length,
    appUsd: [...rows, ...dead].reduce((s, r) => s + (r.usd || 0), 0),
    gradeUsd: [...rows, ...dead].reduce((s, r) => s + (r.grade_usd || 0), 0),
    trajanje_min: Math.round((Date.now() - started) / 60000),
  };
}
