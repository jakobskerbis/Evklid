// Pedagoške mere inštruktorja (točka 25 načrta izboljšav, j 19. 11. 2026; po zgledu LearnLM in MathDial).
// 12 pogovorov (test/fixtures/pedagogika-12.json, lastne naloge v slogu mature): maturant (SŠ 4. letnik, MAT, način A)
// prosi za pomoč brez prošnje za rešitev, pošlje korak (8 napačnih, 4 pravilni) in nato prosi za preprostejšo razlago
// ali pošlje naslednji korak. Vsak pogovor gre skozi PRAVO aplikacijo (server/app.js v istem procesu, začasna baza);
// veljajo vsa varovala kot v produkciji. Ocene tu ni: prepise slepo oceni ločen ocenjevalec (izven repozitorija) po
// merah: ali inštruktor ne izda rezultata prehitro, ali prepozna napačen korak (in ne graja pravilnega), ali razlago
// ob »ne razumem« res poenostavi.
// Ne piše v pravo bazo in ne v docs/. Ustavi se, preden bi strošek presegel --max-usd.
//   node scripts/meri-pedagogika.mjs [--max-usd 2] [--nacin think|chat] [--kandidat] [--suho] [--preizkus]
//   --kandidat  kandidat prompta (EVKLID_INSTRUKTOR_KANDIDAT=1: prompts/system_prompt-kandidat.md; popravka besedila iz
//               server/instruktor-kandidat.js sta od 21. 11. 2026 vklopljena v obeh različicah, zato izidi pred tem dnem
//               brez argumenta niso neposredno primerljivi); izid v data/meri-pedagogika-kandidat.json z "kandidat": true,
//               za primerjavo pred/po z zagonom brez argumenta (j 21. 11. 2026: primerjavo vidi, preden gre v produkcijo)
//   --suho      samo ocena najslabšega stroška, brez klica modela (0 $)
//   --preizkus  preizkusni odgovori namesto modela (samo brez ključa API), za test poti (0 $)
// Zagon: GitHub Actions > Meritev, skripta scripts/meri-pedagogika.mjs. Izid: data/meri-pedagogika.json (artefakt
// »meritev«) in v dnevniku med vrsticama ODGOVORI-ZACETEK in ODGOVORI-KONEC (naloge in odgovori so javni, brez
// osebnih podatkov).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const arg = (name, d) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : d;
};
const ZNANI = { "--max-usd": 1, "--nacin": 1, "--kandidat": 0, "--suho": 0, "--preizkus": 0 };
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
const OUT = process.env.EVKLID_MERI_IZID || (KANDIDAT ? "data/meri-pedagogika-kandidat.json" : "data/meri-pedagogika.json");
if (!(MAX_USD > 0) || MAX_USD > 5) {
  console.error("--max-usd mora biti večji od 0 in največ 5. Nič ni bilo poklicano.");
  process.exit(1);
}
if (!["think", "chat"].includes(NACIN)) {
  console.error(`--nacin mora biti think ali chat (ne »${NACIN}«). Nič ni bilo poklicano.`);
  process.exit(1);
}

const { pogovori } = JSON.parse(fs.readFileSync(new URL("../test/fixtures/pedagogika-12.json", import.meta.url), "utf8"));
// Sporočila učenca v pogovoru; rezultat in napaka ostaneta ocenjevalcu.
const sporocila = (p) => [`Pomagaj mi pri tej nalogi, rada bi jo rešila sama.\n\n${p.naloga}`, p.korak, p.tretje];

// Okolje pred uvozom aplikacije: začasna baza (nikoli prava).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-pedagogika-"));
process.env.EVKLID_DB = path.join(tmp, "meritev.db");
if (NACIN === "chat") process.env.EVKLID_SS_THINK = "0";
// Kandidat ali trenutni inštruktor: izrecno v obe smeri (lokalno okolje ne sme pomešati različic).
process.env.EVKLID_INSTRUKTOR_KANDIDAT = KANDIDAT ? "1" : "0";
delete process.env.EVKLID_PROMPT_PATH;
// Preverjanje kartic v ozadju (Sonnet + Opus) ni del odgovora, ki ga vidi učenec: izklopljeno, da ostane pod mejo.
process.env.EVKLID_VERIFY_DAILY_USD = "0";
// Brez mesečnega proračuna (server/proracun.js budgetMode): z njim bi prazna baza nadgradila Haiku v Sonnet ali Opus in
// najslabši primer spodaj ne bi več veljal (lokalni zagon z okoljem strežnika).
process.env.EVKLID_MONTHLY_BUDGET_USD = "0";
// Sprotni pregled (Sonnet), ki ga ustavi časovna meja, ne zapiše porabe (server/live-check.js reviewAnswer), plačan pa je
// lahko vseeno: brez zapisa bi ga porabljeno() spodaj ne videlo. Z daljšo mejo se vsak pregled konča in zapiše. Razlika od
// produkcije (tam se počasen pregled po 25 s opusti) je zapisana v glavi te skripte (meritev ni produkcija).
process.env.EVKLID_LIVE_REVIEW_TIMEOUT_MS = "300000";
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");
const { buildSystemPrompt, templatePath } = await import("../server/prompt.js");
const { isMockMode, modeParams, MODEL_MID, MAX_TOKENS, MAX_TOOL_ROUNDS } = await import("../server/claude.js");
const { callMaxUsd } = await import("../server/meje-ai.js");
const { normalizeSettings } = await import("../server/settings.js");

const nastavitve = () => normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik OR", subject: "MAT", solving_mode: "A" });
const { model, max_tokens } = modeParams(NACIN);
const system = buildSystemPrompt({ settings: nastavitve(), studentName: "Ana" });
// Najslabši primer enega sporočila: odgovor in ponovljen odgovor (Haiku, vsak z do MAX_TOOL_ROUNDS krogi orodij),
// popravek in varnostni pregled (Haiku) ter dva klica Sonnet (sprotni pregled pri SŠ dva vzporedna klica; sodba
// učenčevega koraka je tudi Sonnet, a izključi sprotni pregled). Popravek in sporočila s trditvijo tečejo v načinu think
// (do MAX_TOKENS.think izhoda) tudi pri --nacin chat. Vhod: navodila, zgodovina (do dve izmenjavi) in izhodi prejšnjih krogov.
const najdaljsa = Math.max(...pogovori.flatMap((p) => sporocila(p).map((s) => s.length)));
const izhod = Math.max(max_tokens, MAX_TOKENS.think);
const klicUsd = callMaxUsd(model, Math.ceil(system.length / 3) + 3 * najdaljsa + (MAX_TOOL_ROUNDS + 3) * izhod + 4000, izhod);
const najslabse = (2 * (MAX_TOOL_ROUNDS + 1) + 2) * klicUsd + 2 * callMaxUsd(MODEL_MID, 4000 + 3 * najdaljsa + 2 * max_tokens, 8000) + 0.01;
console.log(`${pogovori.length} pogovorov po 3 sporočila; način ${NACIN} (${model}); najslabši primer na sporočilo ${najslabse.toFixed(3)} $; meja ${MAX_USD} $.`);
console.log(`Različica: ${KANDIDAT ? "KANDIDAT" : "trenutni inštruktor"} (${path.basename(templatePath())}); izid ${OUT}`);
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

// Eno sporočilo v pogovoru; vrne besedilo, kot ga vidi učenec (dogodek done), in vrste klicev.
async function poslji(convId, text) {
  const zacetek = store.db.prepare("SELECT COALESCE(MAX(id), 0) AS m FROM usage").get().m;
  const res = await fetch(`${base}/api/conversations/${convId}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
  const body = await res.text();
  const vrstice = store.db.prepare("SELECT kind, model, cost_usd FROM usage WHERE id > ? ORDER BY id").all(zacetek);
  const klici = vrstice.map((r) => `${r.kind}:${String(r.model).replace(/^claude-/, "")}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  const done = [...body.matchAll(/event: done\ndata: (.*)\n/g)].at(-1);
  if (!done) throw new Error(`brez dogodka done: ${body.slice(-200)}`);
  return { odgovor: JSON.parse(done[1]).text, klici };
}

const izid = [];
let ustavljeno = false;
const zapisi = (koncano) => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ datum: new Date().toISOString(), kandidat: KANDIDAT, prompt: path.basename(templatePath()), nacin: NACIN, model, porabljeno: porabljeno(), ustavljeno, koncano, izid }, null, 1));
};
for (const p of pogovori) {
  const s = store.createStudent("Ana", nastavitve()); // nov učenec za vsak pogovor: dnevne meje ne vplivajo
  const conv = store.createConversation(s.id);
  const prepis = [];
  for (const besedilo of sporocila(p)) {
    if (porabljeno() + najslabse > MAX_USD) {
      ustavljeno = true;
      break;
    }
    try {
      const { odgovor, klici } = await poslji(conv.id, besedilo);
      prepis.push({ ucenec: besedilo, evklid: odgovor });
      console.log(`${p.id} #${prepis.length}: ${odgovor.length} znakov (${klici.join(" ") || "brez klicev"}), skupaj ${porabljeno().toFixed(3)} $`);
    } catch (e) {
      console.log(`${p.id}: napaka ${String(e?.message || e).slice(0, 200)}`);
      break;
    }
  }
  if (prepis.length) izid.push({ id: p.id, prepis });
  zapisi(false);
  if (ustavljeno) {
    console.log(`${p.id}: ustavljeno pred mejo ${MAX_USD} $`);
    break;
  }
}
server.close();
zapisi(true);
console.log("ODGOVORI-ZACETEK");
console.log(JSON.stringify(izid));
console.log("ODGOVORI-KONEC");
const polni = izid.filter((x) => x.prepis.length === 3).length;
console.log(`\nIZID: ${polni}/${pogovori.length} celih pogovorov; strošek ${porabljeno().toFixed(4)} $${ustavljeno ? ` (ustavljeno pred mejo ${MAX_USD} $)` : ""}. Prepisi: ${OUT}`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(polni ? 0 : 1);
