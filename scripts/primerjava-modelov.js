// Primerjava natančnosti modelov za inštruktorja (j 2026-10-30: »ali bo Haiku dovolj natančen za učenje«).
// Iz lekcij vzame rešene primere (naloga + rešitev po korakih), jih kot učenec pošlje
// inštruktorju z istimi navodili in nastavitvami kot v aplikaciji (Haiku = način chat, Sonnet = mid),
// nato Opus vsak odgovor primerja z rešitvijo iz lekcije in oceni: pravilno / manjša napaka / napaka.
//
//   node scripts/primerjava-modelov.js --dry          izpiše izbrane naloge in oceno stroška, brez klicev
//   node scripts/primerjava-modelov.js                zažene (potrebuje ANTHROPIC_API_KEY)
// Možnosti: --n 50 (število nalog), --modes chat,mid (tudi think, deep), --max-usd 5 (ustavi se pred mejo),
//           --out data/primerjava-modelov.md, --seed 1,
//           --groups ss,tek (le te stopnje: os, ss, tek, uni),
//           --prompt /tmp/novi-prompt.md (drug sistemski prompt za preizkus spremembe, aplikacija ga ne uporablja),
//           --from data/primerjava-modelov.json (iste naloge kot prejšnji zagon, npr. za primerjavo z drugim načinom)
// Brez ključa (ali z EVKLID_MOCK=1) teče v preizkusnem načinu: odgovori in ocene so izmišljeni, strošek 0.
//
//   node scripts/primerjava-modelov.js --s-preverjanjem --max-usd 5
// Meritev CELEGA Evklidovega odgovora (j 2026-11-10, scripts/meritev-natancnosti.js): iste primere pošlje skozi pravo
// pot klepeta dvakrat (brez preverjanja s programom in z njim), oceni besedilo, ki ga vidi učenec, in zapiše
// docs/meritve/natancnost-<datum>.json ter tabelo v docs/stroski-ai.md (bere ju stran /zakaj-evklid).
// Privzeto 100 primerov, razvrščenih izmenično po stopnjah: ob meji --max-usd se ustavi z uravnoteženim vzorcem.
// Zagon s ključem NE piše v docs/ (na strežniku to ni repozitorij): izpiše blok »POVZETEK ZA REPOZITORIJ«. Vmesne
// vrstice sproti shranjuje v data/natancnost-napredek.json; po prekinitvi isti ukaz nadaljuje (--znova začne na novo).
// Brez ključa ali z EVKLID_MOCK=1 konča z 0 brez klica in brez zapisa (izmišljene številke ne smejo na stran).
//   --resnicna-meja        pusti dnevno mejo pregledov z zmogljivejšim modelom, kot je v aplikaciji (privzeto izklopljena)
//   --iz-json <datoteka>   preveri obliko in zapiše povzetek v docs/meritve + tabelo v docs/stroski-ai.md, brez klicev.
// Ciljna ponovitev (krog 2, 2026-11-11): samo izbrani primeri, vsak večkrat, za poceni preverbo spremembe pri primerih z napako.
//   node scripts/primerjava-modelov.js --s-preverjanjem --samo KEM-OS-8/kovalentna-vez,UNI-ULFKKT-ORG1/alkani-alkeni-in-alkini --ponovi 3 [--pogoj s] --max-usd 1.5
//   --samo <id,id>   id-ji lekcij (kot v polju »napake« meritve); isti rešeni primer kot v meritvi z istim --seed
//   --ponovi <N>     vsak primer N-krat (1–10), ker isti model na isto nalogo ne odgovori vedno enako
//   --pogoj s|brez   samo en pogoj (privzeto oba); »s« = cel Evklidov odgovor s preverjanjem
//   --nadaljuj       nadaljuje prekinjeno ciljno ponovitev (privzeto vsak zagon začne na novo)
//   --izid-json <f>  na koncu zapiše strošek in štetje po primerih v <f> (bere ga server/meritev-po-objavi.js)
// Vmesne vrstice gredo v data/natancnost-ponovitve.json (ne v napredek prave meritve), na koncu je tabela po primerih.
// Ciljna ponovitev ni meritev za objavo: povzetka za repozitorij ne izpiše. --dry pokaže izbor in oceno stroška.
import "../server/env.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSystemPrompt } from "../server/prompt.js";
import { stripMeta as stripMetaBlocks } from "../server/meta.js";
import { DEFAULT_SETTINGS } from "../server/settings.js";
import { streamReply, modeParams, costUsd, getClient, isMockMode, MODEL_DEEP } from "../server/claude.js";
import { getTopic, getPath, learningPathPrompt } from "../server/curriculum.js";
import { lessonSummaryForPrompt } from "../server/textbook.js";
import { EUR_PER_USD } from "../server/usage.js";
import { PROGRAMS } from "../server/university-data.js";
import { runChecked, summarize, writeMeasurement, measurementError, examplesOf, CONDITIONS, MIN_PRIMERI, GRADER_FINAL_RULE } from "./meritev-natancnosti.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name, d) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : d;
};
const DRY = process.argv.includes("--dry");
const CHECK = process.argv.includes("--s-preverjanjem");
const FROM_JSON = arg("iz-json", "");
const N = Number(arg("n", CHECK ? 100 : 50));
const MODES = arg("modes", "chat,mid").split(",").filter((m) => ["chat", "think", "mid", "deep"].includes(m));
// Meja stroška mora biti pozitivno število s piko (»5« ali »7.5«): »5,5«, »0«, »-1« ali prazno ustavi skripto pred klici.
const MAX_USD_RAW = arg("max-usd", process.argv.includes("--max-usd") ? "" : "5");
const MAX_USD = /^\d+(\.\d+)?$/.test(MAX_USD_RAW) ? Number(MAX_USD_RAW) : NaN;
if (!(MAX_USD > 0)) {
  console.error(`Neveljavna meja --max-usd »${MAX_USD_RAW}«: vpiši pozitivno število s piko, na primer --max-usd 5. Nič ni bilo poklicano.`);
  process.exit(1);
}
const OUT = path.resolve(root, arg("out", "data/primerjava-modelov.md"));
const PROMPT = arg("prompt", "");
const TEMPLATE = PROMPT ? fs.readFileSync(path.resolve(root, PROMPT), "utf8") : undefined;
const MOCK = isMockMode();
const SAMO_ALL = arg("samo", "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);
const SAMO = [...new Set(SAMO_ALL)];
if (SAMO.length < SAMO_ALL.length) console.warn(`--samo: podvojeni id-ji so izpuščeni (${SAMO_ALL.filter((x, i) => SAMO_ALL.indexOf(x) !== i).join(", ")}).`);
const PONOVI_RAW = process.argv.includes("--ponovi") ? arg("ponovi", "") : "1";
const PONOVI = /^\d+$/.test(PONOVI_RAW) ? Number(PONOVI_RAW) : NaN;
const POGOJ = arg("pogoj", "");
const flagNoValue = ["samo", "ponovi", "pogoj", "izid-json"].find((k) => process.argv.includes(`--${k}`) && !arg(k, ""));
if (SAMO.length || flagNoValue || process.argv.includes("--ponovi") || POGOJ || process.argv.includes("--nadaljuj")) {
  const why = flagNoValue
    ? `--${flagNoValue} potrebuje vrednost`
    : !CHECK
    ? "--samo, --ponovi in --pogoj veljajo le z --s-preverjanjem"
    : !SAMO.length
      ? "--ponovi, --pogoj in --nadaljuj veljajo le skupaj z --samo <id,id>"
      : !(PONOVI >= 1 && PONOVI <= 10)
        ? `neveljaven --ponovi »${PONOVI_RAW}« (celo število od 1 do 10)`
        : POGOJ && !CONDITIONS.some((c) => c.kljuc === POGOJ)
          ? `neveljaven --pogoj »${POGOJ}« (${CONDITIONS.map((c) => c.kljuc).join(" ali ")})`
          : "";
  if (why) {
    console.error(`${why}. Nič ni bilo poklicano.`);
    process.exit(1);
  }
}
const CONDS = POGOJ ? CONDITIONS.filter((c) => c.kljuc === POGOJ) : CONDITIONS;
if (FROM_JSON) {
  try {
    const file = writeMeasurement(JSON.parse(fs.readFileSync(path.resolve(root, FROM_JSON), "utf8")));
    console.log(`Zapisano: ${path.relative(root, file)} in tabela v docs/stroski-ai.md.`);
    process.exit(0);
  } catch (e) {
    console.error(`--iz-json: ${e?.message || e}`);
    process.exit(1);
  }
}
if (CHECK && MOCK && !DRY) {
  console.log("Meritev s preverjanjem potrebuje ANTHROPIC_API_KEY (in ne EVKLID_MOCK=1). Brez ključa ni klica in ni zapisa. Izbor in oceno stroška pokaže --dry.");
  process.exit(0);
}
const GROUP_KEYS = { os: "osnovna šola", ss: "srednja šola", tek: "tekmovanja", uni: "fakulteta" };
const GROUPS = arg("groups", "")
  .split(",")
  .map((g) => GROUP_KEYS[g.trim()])
  .filter(Boolean);
const LABEL = { chat: "Haiku", think: "Haiku (več razmisleka)", mid: "Sonnet", deep: "Opus" };

// --- 1. Naloge iz lekcij --------------------------------------------------
// Rešeni primeri: examplesOf v meritev-natancnosti.js (pišeta in pregledujeta jih Opus ali Fable, zato je rešitev merilo).
const group = (key) => (key.startsWith("UNI-") ? "fakulteta" : key.includes("-TEK-") ? "tekmovanja" : key.includes("-SS-") ? "srednja šola" : "osnovna šola");
const SHARE = { "osnovna šola": 0.3, "srednja šola": 0.3, tekmovanja: 0.15, fakulteta: 0.25 };

// Ponovljiv izbor (seme), razporejen po stopnjah in predmetih, težji primeri imajo prednost.
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
function pick() {
  const rand = rng(Number(arg("seed", 1)));
  const dir = path.join(root, "content/lessons");
  const pool = {};
  for (const p of fs.readdirSync(dir)) {
    const full = path.join(dir, p);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const f of fs.readdirSync(full).filter((f) => f.endsWith(".md"))) {
      const id = `${p}/${f.replace(/\.md$/, "")}`;
      if (!getTopic(id)) continue;
      const ex = examplesOf(path.join(full, f));
      if (!ex.length) continue;
      // En primer na lekcijo: težji, če obstaja, sicer naključen.
      const hard = ex.filter((e) => e.hard);
      const e = (hard.length ? hard : ex)[Math.floor(rand() * (hard.length || ex.length))];
      (pool[group(p)] ||= []).push({ id, path: p, ...e });
    }
  }
  // --samo: izbrani primeri iz celotnega nabora (isti rešeni primer kot v meritvi, ker je seme enako).
  if (SAMO.length) return Object.values(pool).flat();
  const out = [];
  for (const [g, share] of Object.entries(SHARE)) {
    const list = (pool[g] || []).map((x) => [rand(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    // Najprej po en primer na predmet, da so zastopani vsi.
    const bySubj = {};
    for (const x of list) (bySubj[x.path.split("-")[0] + (g === "fakulteta" ? x.path : "")] ||= []).push(x);
    const order = [];
    while (order.length < list.length) for (const k of Object.keys(bySubj)) if (bySubj[k].length) order.push(bySubj[k].shift());
    out.push(...order.slice(0, Math.round(N * share)));
  }
  const all = out.slice(0, N);
  if (!CHECK) return all;
  // Izmenično po stopnjah: če se zagon ustavi ob meji stroška, je narejeni del še vedno uravnotežen.
  return Object.keys(SHARE)
    .flatMap((g) => all.filter((x) => group(x.path) === g).map((x, j, list) => [(j + 0.5) / list.length, x]))
    .sort((p, q) => p[0] - q[0])
    .map((p) => p[1]);
}

// Nastavitve učenca iz poti (kot bi jih imel učenec, ki odpre to temo).
function settingsFor(p) {
  const meta = getPath(p) || {};
  const s = { ...DEFAULT_SETTINGS, subject: meta.subject || DEFAULT_SETTINGS.subject };
  if (meta.school === "UNI") {
    const prog = Object.keys(PROGRAMS).find((k) => PROGRAMS[k].courseKeys?.flat().includes(p)) || "";
    return { ...s, educational_track: "UNIVERZA", study_program: prog, study_course: p, curriculum_level: `${meta.grade || 1}. letnik` };
  }
  if (meta.school === "SS") return { ...s, educational_track: "SREDNJA_SOLA", curriculum_level: `${meta.grade}. letnik` };
  // Pogovor o tekmovalni temi ima v aplikaciji track COMPETITION (server/app.js tekTopic).
  if (meta.school === "TEK") return { ...s, track: "COMPETITION", educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred" };
  return { ...s, educational_track: "OSNOVNA_SOLA", curriculum_level: `${meta.grade || 8}. razred` };
}

const question = (task) => `Kako rešim to nalogo? Pokaži mi rešitev po korakih in končni rezultat.\n\n${task}`;
const stripMeta = (t) => stripMetaBlocks(t).trim();

// --- 2. Ocena stroška pred zagonom ------------------------------------------
// Na nalogo: inštruktor (~11.000 žetonov stalnih navodil iz predpomnilnika, ~1.500 novih, izhod po načinu)
// in ocenjevalec Opus (~3.000 vhod, ~600 izhod) za vsak model.
const OUT_TOK = { chat: 900, think: 2200, mid: 1300, deep: 1500 };
function estimate(n) {
  let usd = 0;
  for (const m of MODES) {
    const model = modeParams(m).model;
    usd += n * costUsd(model, { input_tokens: 1500, output_tokens: OUT_TOK[m], cache_read_input_tokens: 11000 });
    usd += costUsd(model, { cache_creation_input_tokens: 11000 }) * 2; // hladen predpomnilnik
    usd += n * costUsd(MODEL_DEEP, { input_tokens: 3000, output_tokens: 1500 });
  }
  return usd;
}

// --- 3. Ocenjevalec ----------------------------------------------------------
const GRADER = `Si strog, a pravičen ocenjevalec matematike in naravoslovja. Dobiš nalogo, uradno rešitev iz
učbenika in odgovor AI inštruktorja učencu. Oceni samo STROKOVNO PRAVILNOST odgovora
(slog in pedagogika nista pomembna; inštruktor sme učenca voditi z vprašanji namesto da pove rezultat).

- "pravilno": vse trditve, enačbe, računi in (če je podan) končni rezultat so pravilni.
- "manjsa_napaka": rezultat je pravilen ali ni podan, a je vmes manjša nenatančnost (zaokroževanje, enota,
  nerodna ali delno netočna formulacija), ki učenca ne bi zavedla.
- "napaka": napačen rezultat, napačna formula ali trditev, ki bi učenca naučila nekaj narobe.

Uradna rešitev je pravilna; drugačna pravilna pot je dovoljena. Odgovori samo z JSON:
{"ocena":"pravilno|manjsa_napaka|napaka","rezultat_podan":true|false,"vrsta":"ni|koncni_rezultat|racun_vmes|formula|trditev|dodatna_vaja|drugo","razlog":"en stavek v slovenščini"}
"vrsta" pove, kje je napaka (pri "pravilno" je "ni"); "dodatna_vaja" je napaka v nalogi, ki jo je inštruktor dodal sam.
${GRADER_FINAL_RULE}`;

const GRADER_MAX_TOKENS = 4000;
// Najdražji možni korak (poln izhod inštruktorja in ocenjevalca, hladen predpomnilnik): pred vsakim
// korakom preverimo, da ga meja še prenese, zato skupni strošek --max-usd ne preseže.
const worstStep = (m) =>
  costUsd(modeParams(m).model, { input_tokens: 3000, cache_creation_input_tokens: 14000, output_tokens: modeParams(m).max_tokens }) +
  costUsd(MODEL_DEEP, { input_tokens: 10000, output_tokens: GRADER_MAX_TOKENS });

async function grade(ex, answer) {
  if (MOCK) {
    const r = ["pravilno", "pravilno", "manjsa_napaka", "napaka"][Math.floor(Math.random() * 4)];
    return { ocena: r, rezultat_podan: true, razlog: "(preizkusni način)", usd: 0 };
  }
  const res = await getClient().messages.create({
    model: MODEL_DEEP,
    max_tokens: GRADER_MAX_TOKENS,
    output_config: { effort: "medium" },
    system: GRADER,
    messages: [{ role: "user", content: `NALOGA:\n${ex.task}\n\nURADNA REŠITEV:\n${ex.solution}\n\nODGOVOR INŠTRUKTORJA:\n${answer}` }],
  });
  const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  let j = null;
  try {
    j = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
  } catch {
    j = { ocena: "neocenjeno", rezultat_podan: false, razlog: text.slice(0, 200) };
  }
  const ocena = String(j?.ocena ?? "neocenjeno").toLowerCase().replace("š", "s").replace(/\s+/g, "_");
  return { ...j, ocena, usd: costUsd(res.model || MODEL_DEEP, res.usage) };
}

// --- 4. Zagon ----------------------------------------------------------------
// --from: naloge iz prejšnjega poročila (lekcije se medtem spreminjajo, zato izbor s semenom ni nujno enak).
const FROM = arg("from", "");
const fromRows = () => {
  const seen = new Set();
  return JSON.parse(fs.readFileSync(path.resolve(root, FROM), "utf8"))
    .filter((r) => !seen.has(r.id) && seen.add(r.id))
    .map(({ id, path: p, title, task, solution, hard }) => ({ id, path: p, title, task, solution, hard }));
};
const base = (FROM ? fromRows() : pick()).filter((t) => !GROUPS.length || GROUPS.includes(group(t.path)));
// --samo/--ponovi: izbrani primeri v podanem vrstnem redu; ponovitev k dobi id »<id>#k« (tema pogovora ostane <id>).
const missing = SAMO.filter((id) => !base.some((t) => t.id === id));
if (missing.length) {
  console.error(`--samo: teh primerov ni med lekcijami z rešenimi primeri${GROUPS.length ? " izbranih stopenj" : ""}: ${missing.join(", ")}. Nič ni bilo poklicano.`);
  process.exit(1);
}
const chosen = SAMO.length ? SAMO.map((id) => base.find((t) => t.id === id)) : base;
const tasks = SAMO.length && PONOVI > 1 ? Array.from({ length: PONOVI }, (_, k) => chosen.map((t) => ({ ...t, id: `${t.id}#${k + 1}`, topic: t.id }))).flat() : chosen;
const est = estimate(tasks.length);
const eur = EUR_PER_USD();
console.log(`Naloge: ${tasks.length} (${Object.entries(tasks.reduce((a, t) => ((a[group(t.path)] = (a[group(t.path)] || 0) + 1), a), {})).map(([k, v]) => `${k} ${v}`).join(", ")})`);
if (!CHECK) console.log(`Modeli: ${MODES.map((m) => LABEL[m]).join(", ")}; ocenjevalec ${MODEL_DEEP}`);
if (!CHECK) console.log(`Ocena stroška: ~${est.toFixed(2)} $ (meja --max-usd ${MAX_USD} $)${MOCK ? " — preizkusni način, dejanski strošek 0" : ""}`);
// Meritev s preverjanjem: na primer dva odgovora po poti klepeta (model po stopnji: OŠ hitri, drugje z več razmisleka),
// pri tekmovanjih, fakulteti in delu SŠ pregled z zmogljivejšim modelom, občasen popravek, in dve oceni.
const pairModes = (t) => (group(t.path) === "osnovna šola" ? "chat" : "think");
// Delež odgovorov s pregledom: tekmovanja in fakulteta vsi, srednja šola ~0,7 (odgovor z vajo ali okvirjem v rešeni
// nalogi, od 2026-11-11), osnovna šola 0 (EVKLID_LIVE_REVIEW_OS je privzeto izklopljen).
const reviewed = (t) => ({ tekmovanja: 1, fakulteta: 1, "srednja šola": 0.7 })[group(t.path)] || 0;
// Ocena za en pogoj: odgovor in ocena; s preverjanjem še pregled (delež po stopnji) in občasen popravek.
const condEstimate = (t, kljuc) =>
  costUsd(modeParams(pairModes(t)).model, { input_tokens: 1500, output_tokens: OUT_TOK[pairModes(t)], cache_read_input_tokens: 11000 }) +
  costUsd(MODEL_DEEP, { input_tokens: 3000, output_tokens: 1500 }) +
  (kljuc === "s" ? reviewed(t) * costUsd(modeParams("mid").model, { input_tokens: 2500, output_tokens: 1500 }) + 0.15 * costUsd(modeParams("think").model, { input_tokens: 3000, output_tokens: 2000 }) : 0);
const pairEstimate = (t) => CONDS.reduce((s, c) => s + condEstimate(t, c.kljuc), 0);
// Najdražji možni par: dva odgovora (poln izhod, hladen predpomnilnik), pregled z zmogljivejšim modelom (do 8000
// izhodnih žetonov), popravek in dve oceni, kjer gre ocenjevalcu ves dolg odgovor (do max_tokens) z nalogo in rešitvijo.
const thinkP = modeParams("think");
const worstPair =
  2 * costUsd(thinkP.model, { input_tokens: 3000, cache_creation_input_tokens: 14000, output_tokens: thinkP.max_tokens }) +
  costUsd(modeParams("mid").model, { input_tokens: thinkP.max_tokens + 4000, output_tokens: 8000 }) +
  costUsd(thinkP.model, { input_tokens: thinkP.max_tokens + 4000, output_tokens: thinkP.max_tokens }) +
  2 * costUsd(MODEL_DEEP, { input_tokens: thinkP.max_tokens + 6000, output_tokens: GRADER_MAX_TOKENS });
const REAL_CAP = process.argv.includes("--resnicna-meja");
const PROGRESS = path.join(root, "data", SAMO.length ? "natancnost-ponovitve.json" : "natancnost-napredek.json");
if (CHECK) {
  const estC = tasks.reduce((s, t) => s + pairEstimate(t), 0);
  const perUsd = estC / Math.max(1, tasks.length);
  if (SAMO.length) console.log(`Ciljna ponovitev: ${chosen.length} primerov × ${PONOVI} ponovitve × ${CONDS.length} pogoj${CONDS.length > 1 ? "a" : ""} (${CONDS.map((c) => c.ime).join(" / ")}) = ${tasks.length * CONDS.length} odgovorov.`);
  else console.log(`Meritev s preverjanjem: vsak primer dvakrat (${CONDITIONS.map((c) => c.ime).join(" / ")}).`);
  console.log(`Ocena stroška za vse primere: ~${estC.toFixed(2)} $ (~${perUsd.toFixed(3)} $ na primer); meja --max-usd ${MAX_USD} $ zadošča za ~${Math.min(tasks.length, Math.max(0, Math.floor((MAX_USD - worstPair) / perUsd)))} primerov. Trajanje ~${Math.round((tasks.length * 0.6 * CONDS.length))} min za vse.`);
}
if (DRY) {
  for (const t of tasks) console.log(`- ${t.id} · ${t.title}`);
  process.exit(0);
}
if (CHECK) {
  // Ciljna ponovitev začne vedno na novo (stari odgovori so lahko iz prejšnjega prompta); --nadaljuj nadaljuje prekinjeno.
  if (SAMO.length ? !process.argv.includes("--nadaljuj") : process.argv.includes("--znova")) fs.rmSync(PROGRESS, { force: true });
  const r = await runChecked({ tasks, settingsFor, question, grade, group, maxUsd: MAX_USD, worstPair, progressFile: PROGRESS, realCap: REAL_CAP, conditions: CONDS });
  if (SAMO.length) {
    // Tabela po primerih in pogojih (ni povzetka za objavo: izbor ni vzorec vseh lekcij).
    console.log(`\nCiljna ponovitev (${PONOVI}× na primer):`);
    for (const t of chosen)
      for (const c of CONDS) {
        const mine = r.rows.filter((x) => (x.id === t.id || x.id.startsWith(`${t.id}#`)) && x.pogoj === c.kljuc);
        const n = (o) => mine.filter((x) => x.ocena === o).length;
        console.log(`- ${t.id} [${c.kljuc}]: napaka ${n("napaka")}, manjša ${n("manjsa_napaka")}, pravilno ${n("pravilno")} od ${mine.length}${mine.some((x) => x.popravek) ? `; popravkov ${mine.filter((x) => x.popravek).length}` : ""}`);
        for (const x of mine.filter((x) => x.ocena !== "pravilno")) console.log(`    ${x.id} ${x.ocena}: ${String(x.razlog || "").slice(0, 220)}`);
      }
    console.log(`Strošek: ${(r.appUsd + r.gradeUsd).toFixed(2)} $ (aplikacija ${r.appUsd.toFixed(2)} $, ocenjevalec ${r.gradeUsd.toFixed(2)} $). Odgovori: ${path.relative(root, PROGRESS)}.`);
    // Samodejna meritev po objavi (server/meritev-po-objavi.js) prebere dejanski strošek za tedensko mejo in povzetek za skrbnika.
    // Brez odgovorov in nalog: le id-ji lekcij, štetje ocen in kratek razlog ocenjevalca (učenčevih podatkov tu ni).
    const IZID = arg("izid-json", "");
    if (IZID) {
      const primeri = chosen.flatMap((t) =>
        CONDS.map((c) => {
          const mine = r.rows.filter((x) => (x.id === t.id || x.id.startsWith(`${t.id}#`)) && x.pogoj === c.kljuc);
          const n = (o) => mine.filter((x) => x.ocena === o).length;
          return { id: t.id, pogoj: c.kljuc, od: mine.length, napaka: n("napaka"), manjsa_napaka: n("manjsa_napaka"), pravilno: n("pravilno"), razlogi: mine.filter((x) => x.ocena !== "pravilno").map((x) => `${x.ocena}: ${String(x.razlog || "").slice(0, 220)}`) };
        }),
      );
      fs.writeFileSync(path.resolve(root, IZID), JSON.stringify({ strosek_usd: Number((r.appUsd + r.gradeUsd).toFixed(4)), ponovi: PONOVI, ustavljeno_ob_meji: !!r.stopped, primeri }, null, 1));
    }
    process.exit(0);
  }
  const summary = summarize(r.rows, {
    datum: new Date().toISOString().slice(0, 10),
    ocenjevalec: `${MODEL_DEEP} (model AI)`,
    vprasanje: question("<naloga>"),
    meja_pregledov: REAL_CAP ? "resnicna" : "brez",
    strosek_usd: { aplikacija: Number(r.appUsd.toFixed(2)), ocenjevalec: Number(r.gradeUsd.toFixed(2)), skupaj: Number((r.appUsd + r.gradeUsd).toFixed(2)) },
    trajanje_min: r.trajanje_min,
    opombe: [
      ...(r.stopped ? [`Zagon se je ustavil ob meji stroška ${MAX_USD} $ (izbranih ${tasks.length} primerov).`] : []),
      ...(r.resumed ? ["Meritev je nastala v več zagonih (nadaljevanje po prekinitvi); trajanje velja za zadnji zagon."] : []),
    ],
  });
  for (const v of summary.vrstice) console.log(`${v.ime}: ${v.napake} napak od ${v.primeri} (manjših ${v.manjse_napake}; rezultat podan ${v.rezultat_podan_pct} %; popravki ${v.popravki}, pregledi ${v.pregledi}; vrste: ${JSON.stringify(v.vrste_napak)})`);
  console.log(`Pari: ${JSON.stringify(summary.pari)}. Strošek skupaj: ${summary.strosek_usd.skupaj} $. Vmesne vrstice z odgovori: ${path.relative(root, PROGRESS)}.`);
  // Na strežniku ne pišemo v docs/ (ni repozitorij): povzetek gre Claudu, ki ga zapiše z --iz-json.
  if (measurementError(summary)) {
    console.error(`Meritev še ni za objavo (${measurementError(summary)}; najmanj ${MIN_PRIMERI} primerov v obeh pogojih). Isti ukaz z višjo --max-usd nadaljuje brez ponovnega plačila že ocenjenih.`);
    process.exit(1);
  }
  console.log(`\n===== POVZETEK ZA REPOZITORIJ (kopiraj vse med črtama) =====\n${JSON.stringify(summary)}\n===== KONEC =====`);
  process.exit(0);
}
if (!CHECK && !MOCK && est > MAX_USD) {
  console.error(`Ocena presega mejo ${MAX_USD} $. Zmanjšaj --n ali povečaj --max-usd.`);
  process.exit(1);
}

let spent = 0;
let stopped = false;
const rows = [];
for (const [i, t] of tasks.entries()) {
  const system = buildSystemPrompt({
    settings: settingsFor(t.path),
    studentName: "Ana",
    learningPath: [learningPathPrompt(t.id), lessonSummaryForPrompt(t.id)].filter(Boolean).join("\n"),
  }, TEMPLATE);
  for (const m of MODES) {
    if (!MOCK && spent + worstStep(m) > MAX_USD) {
      stopped = true;
      break;
    }
    let answer = "";
    let usd = 0;
    let g;
    try {
      const r = await streamReply({ system, messages: [{ role: "user", content: question(t.task) }], mode: m, onText: () => {} });
      answer = stripMeta(r.text);
      usd = MOCK ? 0 : costUsd(r.model, r.usage);
      g = await grade(t, answer);
    } catch (err) {
      // Napaka klica ne sme zavreči že plačanih rezultatov.
      g = { ocena: "neocenjeno", rezultat_podan: false, razlog: `napaka klica: ${String(err?.message || err).slice(0, 200)}`, usd: 0 };
    }
    // Cena ocene (Opus) je ločena od cene odgovora, sicer bi stolpec »Cena na odgovor« kazal ceno ocenjevanja.
    const { usd: gradeUsd = 0, ...verdict } = g;
    spent += usd + gradeUsd;
    rows.push({ ...t, mode: m, answer, usd, grade_usd: gradeUsd, ...verdict });
    console.log(`[${i + 1}/${tasks.length}] ${LABEL[m].padEnd(8)} ${String(g.ocena).padEnd(13)} ${t.id}  (skupaj ${spent.toFixed(2)} $)`);
  }
  if (stopped) {
    console.error(`Naslednji korak bi lahko presegel mejo ${MAX_USD} $, ustavljam.`);
    break;
  }
}

// --- 5. Poročilo -------------------------------------------------------------
const dec = (x, d) => x.toFixed(d).replace(".", ",");
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)} %` : "–");
const lines = [
  `# Primerjava modelov za inštruktorja`,
  ``,
  `${new Date().toISOString().slice(0, 10)} · ${new Set(rows.map((r) => r.id)).size} rešenih primerov iz lekcij · ocenjevalec ${MODEL_DEEP}${PROMPT ? ` · prompt ${path.basename(PROMPT)}` : ""}${MOCK ? " · PREIZKUSNI NAČIN (izmišljeni rezultati)" : ""}`,
  ``,
  `| Model | Pravilno | Manjša napaka | Napaka | Rezultat podan | Cena na odgovor |`,
  `|---|---|---|---|---|---|`,
];
for (const m of MODES) {
  const r = rows.filter((x) => x.mode === m);
  const c = (o) => r.filter((x) => x.ocena === o).length;
  const avg = r.length ? r.reduce((s, x) => s + x.usd, 0) / r.length : 0;
  lines.push(`| ${LABEL[m]} | ${pct(c("pravilno"), r.length)} | ${pct(c("manjsa_napaka"), r.length)} | ${pct(c("napaka"), r.length)} | ${pct(r.filter((x) => x.rezultat_podan === true).length, r.length)} | ${dec(avg * eur * 100, 2)} centa |`);
}
lines.push(``, `## Po stopnjah (delež napak)`, ``, `| Stopnja | ${MODES.map((m) => LABEL[m]).join(" | ")} |`, `|---|${MODES.map(() => "---").join("|")}|`);
for (const g of Object.keys(SHARE)) {
  const cells = MODES.map((m) => {
    const r = rows.filter((x) => x.mode === m && group(x.path) === g);
    return r.length ? `${pct(r.filter((x) => x.ocena === "napaka").length, r.length)} (${r.length})` : "–";
  });
  lines.push(`| ${g} | ${cells.join(" | ")} |`);
}
lines.push(``, `## Napake`, ``);
for (const x of rows.filter((r) => r.ocena === "napaka")) lines.push(`- **${LABEL[x.mode]}** · ${x.id} · ${x.title}: ${x.razlog}`);
lines.push(``, `Skupni strošek preizkusa: ${dec(spent, 2)} $ (${dec(spent * eur, 2)} €).`);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, lines.join("\n") + "\n");
fs.writeFileSync(OUT.replace(/\.md$/, ".json"), JSON.stringify(rows, null, 1));
console.log(`\nPoročilo: ${path.relative(root, OUT)} (+ .json z vsemi odgovori)`);
