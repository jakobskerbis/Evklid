// Ista vprašanja za Evklid in Astro AI (primerjava 21. 11. 2026, nit »Preseži Astro AI v vseh pogledih«).
// test/fixtures/astra-vprasanja.json: 10 primerov (namig, razlaga, preverjanje rešitve, OŠ, FIZ, KEM, polna rešitev, stiska),
// nekateri z dvema krogoma v istem pogovoru. j jih postavi Astri v aplikaciji, Evklid jih dobi skozi PRAVO aplikacijo
// (server/app.js v istem procesu, začasna baza), vsak primer kot nov pogovor novega učenca s profilom iz primera.
// Veljajo vsa varovala kot v produkciji. Privzeto plačljivi paket (»think«); --nacin chat = brezplačni paket.
// Ocene tu ni: odgovore oceni ločen ocenjevalec skupaj z Astrinimi (izven repozitorija). Ne piše v pravo bazo.
// Ustavi se, preden bi strošek presegel --max-usd.
//   node scripts/meri-astra.mjs [--max-usd 2] [--nacin think|chat] [--model haiku|sonnet] [--kandidat] [--suho] [--preizkus]
//   --kandidat  kandidat prompta (EVKLID_INSTRUKTOR_KANDIDAT=1: prompts/system_prompt-kandidat.md), izid v
//               data/meri-astra-kandidat.json z "kandidat": true, za primerjavo pred/po z zagonom brez argumenta
// Zagon: GitHub Actions > Meritev, skripta scripts/meri-astra.mjs. Izid: data/meri-astra.json (artefakt »meritev«) in
// v dnevniku med vrsticama ODGOVORI-ZACETEK in ODGOVORI-KONEC (vprašanja in odgovori so javni, brez osebnih podatkov).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const arg = (name, d) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : d;
};
const ZNANI = { "--max-usd": 1, "--nacin": 1, "--model": 1, "--kandidat": 0, "--suho": 0, "--preizkus": 0 };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!(a in ZNANI)) {
    console.error(`Neznan argument »${a}« (dovoljeni: ${Object.keys(ZNANI).join(", ")}; vrednost za presledkom, ne z =). Nič ni bilo poklicano.`);
    process.exit(1);
  }
  i += ZNANI[a];
}
const MAX_USD = Number(arg("--max-usd", 2));
const NACIN = arg("--nacin", "think");
const SUHO = process.argv.includes("--suho");
const PREIZKUS = process.argv.includes("--preizkus");
const KANDIDAT = process.argv.includes("--kandidat");
const OUT = process.env.EVKLID_MERI_IZID || (KANDIDAT ? "data/meri-astra-kandidat.json" : "data/meri-astra.json");
if (!(MAX_USD > 0) || MAX_USD > 5) {
  console.error("--max-usd mora biti večji od 0 in največ 5. Nič ni bilo poklicano.");
  process.exit(1);
}
const MODELI = { haiku: "claude-haiku-5-5", sonnet: "claude-sonnet-5-5" };
const MODEL_IME = arg("--model", "haiku");
if (!Object.hasOwn(MODELI, MODEL_IME)) {
  console.error(`--model mora biti haiku ali sonnet (ne »${MODEL_IME}«). Nič ni bilo poklicano.`);
  process.exit(1);
}
if (!["think", "chat"].includes(NACIN)) {
  console.error(`--nacin mora biti think ali chat (ne »${NACIN}«). Nič ni bilo poklicano.`);
  process.exit(1);
}

const { primeri } = JSON.parse(fs.readFileSync(new URL("../test/fixtures/astra-vprasanja.json", import.meta.url), "utf8"));

// Okolje pred uvozom aplikacije: začasna baza (nikoli prava).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-astra-"));
process.env.EVKLID_DB = path.join(tmp, "meritev.db");
process.env.EVKLID_INSTRUKTOR_KANDIDAT = KANDIDAT ? "1" : "0";
if (NACIN === "chat") process.env.EVKLID_SS_THINK = "0";
process.env.EVKLID_MODEL = MODELI[MODEL_IME];
// Preverjanje kartic v ozadju (Sonnet + Opus) ni del odgovora, ki ga vidi učenec: izklopljeno, da ostane pod mejo.
process.env.EVKLID_VERIFY_DAILY_USD = "0";
// Brez mesečnega proračuna (server/proracun.js budgetMode): z njim bi prazna baza nadgradila Haiku v Sonnet ali Opus in
// najslabši primer spodaj ne bi več veljal (lokalni zagon z okoljem strežnika).
process.env.EVKLID_MONTHLY_BUDGET_USD = "0";
// Sprotni pregled (Sonnet), ki ga ustavi časovna meja, ne zapiše porabe (server/live-check.js reviewAnswer), plačan pa je
// lahko vseeno: brez zapisa bi ga porabljeno() spodaj ne videlo. Z daljšo mejo se vsak pregled konča in zapiše. Razlika od
// produkcije (tam se počasen pregled po 25 s opusti) je zapisana v poročilu primerjave.
process.env.EVKLID_LIVE_REVIEW_TIMEOUT_MS = "300000";
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");
const { buildSystemPrompt, templatePath } = await import("../server/prompt.js");
const { isMockMode, modeParams, MODEL_MID } = await import("../server/claude.js");
const { callMaxUsd } = await import("../server/meje-ai.js");
const { normalizeSettings } = await import("../server/settings.js");

const nastavitve = (p) => normalizeSettings({ ...p.profil, solving_mode: "A" });
const { model, max_tokens } = modeParams(NACIN);
const system = Math.max(...primeri.map((p) => buildSystemPrompt({ settings: nastavitve(p), studentName: "Ana" }).length));
// Najslabši primer enega kroga: odgovor in popravek ali krogi orodij, v drugem krogu še sodba koraka (4 klici z zgodovino
// prvega kroga); sprotni pregled s Sonnetom (dva vzporedna klica, server/live-check.js reviewCalls); varnostni pregled.
const najdaljsa = Math.max(...primeri.flatMap((p) => p.krogi.map((k) => k.length)));
const klicUsd = callMaxUsd(model, Math.ceil(system / 3) + najdaljsa + 4000 + max_tokens, max_tokens);
const naKrog = 4 * klicUsd + 2 * callMaxUsd(MODEL_MID, 4000 + najdaljsa + 2 * max_tokens, 8000) + 0.01;
const krogov = primeri.reduce((a, p) => a + p.krogi.length, 0);
console.log(`Različica: ${KANDIDAT ? "KANDIDAT" : "trenutni inštruktor"} (${path.basename(templatePath())}); izid ${OUT}`);
console.log(`${primeri.length} primerov, ${krogov} krogov; način ${NACIN} (${model}); najslabši primer na krog ${naKrog.toFixed(3)} $; meja ${MAX_USD} $.`);
if (SUHO) process.exit(0);
if (PREIZKUS !== isMockMode()) {
  console.error(PREIZKUS ? "--preizkus deluje samo brez ključa API (sicer bi klical pravi model). Nič ni bilo poklicano." : "Ni ključa API (preizkusni način; GitHub Actions: manjka skrivnost ANTHROPIC_API_KEY).");
  process.exit(1);
}

const store = openDb(process.env.EVKLID_DB);
// Brez opravil v ozadju (kopije, tudi v oblak) in samo na 127.0.0.1: strežnik s pravim ključem ni dosegljiv od drugod.
const server = createApp(store, { scheduler: false }).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;
const porabljeno = () => store.db.prepare("SELECT COALESCE(SUM(cost_usd), 0) AS s FROM usage").get().s;

// En krog pogovora; vrne besedilo, kot ga vidi učenec (dogodek done), in vrste klicev.
async function krog(conv, text) {
  const zacetek = store.db.prepare("SELECT COALESCE(MAX(id), 0) AS m FROM usage").get().m;
  const t0 = Date.now();
  const res = await fetch(`${base}/api/conversations/${conv.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
  // Tok se bere sproti: čas do prvega besedila, ki ga učenec vidi (»delta«), in do napisa »Preverjam odgovor …«
  // (phase check: sprotni pregled, račun ali popravek po odgovoru). Vse v ms od oddaje sporočila.
  let body = "";
  let prvoMs = null;
  let preverjamMs = null;
  const dec = new TextDecoder();
  for await (const kos of res.body) {
    body += dec.decode(kos, { stream: true });
    if (prvoMs == null && body.includes("event: delta\n")) prvoMs = Date.now() - t0;
    if (preverjamMs == null && /event: phase\ndata: \{"phase":"check"/.test(body)) preverjamMs = Date.now() - t0;
  }
  body += dec.decode();
  const ms = Date.now() - t0;
  const vrstice = store.db.prepare("SELECT kind, model, cost_usd FROM usage WHERE id > ? ORDER BY id").all(zacetek);
  const klici = vrstice.map((r) => `${r.kind}:${String(r.model).replace(/^claude-/, "")}`);
  const usd = vrstice.reduce((a, r) => a + (r.cost_usd || 0), 0);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  const done = [...body.matchAll(/event: done\ndata: (.*)\n/g)].at(-1);
  if (!done) throw new Error(`brez dogodka done: ${body.slice(-200)}`);
  return { ucenec: text, evklid: JSON.parse(done[1]).text, klici, usd, ms, prvoMs, preverjamMs };
}

const izid = [];
let ustavljeno = false;
const zapisi = (koncano) => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ datum: new Date().toISOString(), kandidat: KANDIDAT, prompt: path.basename(templatePath()), nacin: NACIN, model, porabljeno: porabljeno(), ustavljeno, koncano, izid }, null, 1));
};
for (const p of primeri) {
  if (porabljeno() + p.krogi.length * naKrog > MAX_USD) {
    ustavljeno = true;
    console.log(`${p.id}: ustavljeno pred mejo ${MAX_USD} $`);
    break;
  }
  try {
    const s = store.createStudent("Ana", nastavitve(p)); // nov učenec za vsak primer: dnevne meje ne vplivajo
    const conv = store.createConversation(s.id);
    const prepis = [];
    for (const k of p.krogi) prepis.push(await krog(conv, k));
    izid.push({ id: p.id, prepis });
    const sek = (v) => (v == null ? "–" : `${(v / 1000).toFixed(1)} s`);
    console.log(`${p.id}: ${prepis.map((x) => `${x.evklid.length} znakov v ${sek(x.ms)} (besedilo po ${sek(x.prvoMs)}, preverjanje od ${sek(x.preverjamMs)}; ${x.klici.join(" ")})`).join(", ")}, skupaj ${porabljeno().toFixed(3)} $`);
  } catch (e) {
    console.log(`${p.id}: napaka ${String(e?.message || e).slice(0, 200)}`);
  }
  zapisi(false);
}
server.close();
zapisi(true);
console.log("ODGOVORI-ZACETEK");
console.log(JSON.stringify(izid.map(({ id, prepis }) => ({ id, prepis: prepis.map(({ ucenec, evklid, ms, prvoMs, preverjamMs, klici }) => ({ ucenec, evklid, ms, prvoMs, preverjamMs, klici })) }))));
console.log("ODGOVORI-KONEC");
console.log(`\nIZID: ${izid.length}/${primeri.length} primerov; strošek ${porabljeno().toFixed(4)} $${ustavljeno ? ` (ustavljeno pred mejo ${MAX_USD} $)` : ""}. Odgovori: ${OUT}`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(izid.length ? 0 : 1);
