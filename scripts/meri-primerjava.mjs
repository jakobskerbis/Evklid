// Odgovori Evklida za slepo primerjavo z Astro, ChatGPT in Geminijem (točka 5 načrta izboljšav, j 19. 11. 2026).
// 20 nalog iz Evklidovih lastnih pol v slogu mature (test/fixtures/primerjava-20.json; j: nalog RIC ne prepisujemo).
// Vsaka naloga gre skozi PRAVO aplikacijo (server/app.js v istem procesu, začasna baza) kot prvo sporočilo novega
// pogovora maturanta (SŠ 4. letnik, MAT, način A), z istim besedilom, kot ga je j prilepil drugim orodjem
// (»Reši to nalogo … Pokaži postopek in na koncu jasno zapiši rezultat.«). Veljajo vsa varovala kot v produkciji.
// Privzeto plačljivi paket (Haiku z več razmisleka, »think«); --nacin chat = brezplačni paket.
// Ocene tu ni: odgovore slepo oceni ločen ocenjevalec skupaj z odgovori drugih orodij (izven repozitorija).
// Ne piše v pravo bazo in ne v docs/. Ustavi se, preden bi strošek presegel --max-usd.
//   node scripts/meri-primerjava.mjs [--max-usd 2] [--nacin think|chat] [--suho] [--preizkus]
//   --suho      samo ocena najslabšega stroška, brez klica modela (0 $)
//   --preizkus  preizkusni odgovori namesto modela (samo brez ključa API), za test poti (0 $)
// Zagon: GitHub Actions > Meritev, skripta scripts/meri-primerjava.mjs. Izid: data/meri-primerjava.json (artefakt
// »meritev«) in v dnevniku med vrsticama ODGOVORI-ZACETEK in ODGOVORI-KONEC (naloge in odgovori so javni, brez
// osebnih podatkov).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const arg = (name, d) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : d;
};
const ZNANI = { "--max-usd": 1, "--nacin": 1, "--suho": 0, "--preizkus": 0 };
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
const OUT = process.env.EVKLID_MERI_IZID || "data/meri-primerjava.json";
if (!(MAX_USD > 0) || MAX_USD > 5) {
  console.error("--max-usd mora biti večji od 0 in največ 5. Nič ni bilo poklicano.");
  process.exit(1);
}
if (!["think", "chat"].includes(NACIN)) {
  console.error(`--nacin mora biti think ali chat (ne »${NACIN}«). Nič ni bilo poklicano.`);
  process.exit(1);
}

const { naloge } = JSON.parse(fs.readFileSync(new URL("../test/fixtures/primerjava-20.json", import.meta.url), "utf8"));
// Isto besedilo kot gumb »Kopiraj nalogo« na strani za primerjavo.
const navodilo = (t) =>
  `Reši to nalogo iz splošne mature iz matematike (${t.raven} raven, ${t.racunalo ? "računalo je dovoljeno" : "brez računala"}). Pokaži postopek in na koncu jasno zapiši rezultat.\n\n${t.besedilo}`;

// Okolje pred uvozom aplikacije: začasna baza (nikoli prava).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-primerjava-"));
process.env.EVKLID_DB = path.join(tmp, "meritev.db");
if (NACIN === "chat") process.env.EVKLID_SS_THINK = "0";
// Preverjanje kartic v ozadju (Sonnet + Opus) ni del odgovora, ki ga vidi učenec: izklopljeno, da ostane pod mejo.
process.env.EVKLID_VERIFY_DAILY_USD = "0";
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");
const { buildSystemPrompt } = await import("../server/prompt.js");
const { isMockMode, modeParams, MODEL_MID } = await import("../server/claude.js");
const { callMaxUsd } = await import("../server/meje-ai.js");
const { normalizeSettings } = await import("../server/settings.js");

const nastavitve = (t) =>
  normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: `4. letnik ${t.raven === "višja" ? "VR" : "OR"}`, subject: "MAT", solving_mode: "A" });
const { model, max_tokens } = modeParams(NACIN);
const system = buildSystemPrompt({ settings: nastavitve(naloge[0]), studentName: "Ana" });
// Najslabši primer ene naloge: odgovor, pregled sodbe (Sonnet), ponovni odgovor, krog orodij, varnostni pregled.
const najdaljsa = Math.max(...naloge.map((t) => navodilo(t).length));
const klicUsd = callMaxUsd(model, Math.ceil(system.length / 3) + najdaljsa + 4000, max_tokens);
const najslabse = 3 * klicUsd + callMaxUsd(MODEL_MID, 4000 + najdaljsa, 8000) + 0.01;
console.log(`${naloge.length} nalog; način ${NACIN} (${model}); najslabši primer na nalogo ${najslabse.toFixed(3)} $; meja ${MAX_USD} $.`);
if (SUHO) process.exit(0);
if (PREIZKUS !== isMockMode()) {
  console.error(PREIZKUS ? "--preizkus deluje samo brez ključa API (sicer bi klical pravi model). Nič ni bilo poklicano." : "Ni ključa API (preizkusni način; GitHub Actions: manjka skrivnost ANTHROPIC_API_KEY).");
  process.exit(1);
}

const store = openDb(process.env.EVKLID_DB);
const server = createApp(store).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const porabljeno = () => store.db.prepare("SELECT COALESCE(SUM(cost_usd), 0) AS s FROM usage").get().s;

// Naloga kot prvo sporočilo novega pogovora; vrne besedilo, kot ga vidi učenec (dogodek done), in vrste klicev.
async function vprasaj(t) {
  const s = store.createStudent("Ana", nastavitve(t)); // nov učenec za vsako nalogo: dnevne meje ne vplivajo
  const conv = store.createConversation(s.id);
  const zacetek = store.db.prepare("SELECT COALESCE(MAX(id), 0) AS m FROM usage").get().m;
  const res = await fetch(`${base}/api/conversations/${conv.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: navodilo(t) }) });
  const body = await res.text();
  const vrstice = store.db.prepare("SELECT kind, model, cost_usd FROM usage WHERE id > ? ORDER BY id").all(zacetek);
  const klici = vrstice.map((r) => `${r.kind}:${String(r.model).replace(/^claude-/, "")}`);
  const usd = vrstice.reduce((a, r) => a + (r.cost_usd || 0), 0);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  const done = [...body.matchAll(/event: done\ndata: (.*)\n/g)].at(-1);
  if (!done) throw new Error(`brez dogodka done: ${body.slice(-200)}`);
  return { odgovor: JSON.parse(done[1]).text, klici, usd };
}

const izid = [];
let ustavljeno = false;
const zapisi = (koncano) => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ datum: new Date().toISOString(), nacin: NACIN, model, porabljeno: porabljeno(), ustavljeno, koncano, izid }, null, 1));
};
for (const t of naloge) {
  if (porabljeno() + najslabse > MAX_USD) {
    ustavljeno = true;
    console.log(`${t.id}: ustavljeno pred mejo ${MAX_USD} $`);
    break;
  }
  try {
    const { odgovor, klici, usd } = await vprasaj(t);
    izid.push({ id: t.id, klici, usd, odgovor });
    console.log(`${t.id}: ${odgovor.length} znakov (${klici.join(" ") || "brez klicev"}), skupaj ${porabljeno().toFixed(3)} $`);
  } catch (e) {
    console.log(`${t.id}: napaka ${String(e?.message || e).slice(0, 200)}`);
  }
  zapisi(false);
}
server.close();
zapisi(true);
console.log("ODGOVORI-ZACETEK");
console.log(JSON.stringify(izid.map(({ id, odgovor }) => ({ id, odgovor }))));
console.log("ODGOVORI-KONEC");
console.log(`\nIZID: ${izid.length}/${naloge.length} odgovorov; strošek ${porabljeno().toFixed(4)} $${ustavljeno ? ` (ustavljeno pred mejo ${MAX_USD} $)` : ""}. Odgovori: ${OUT}`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(izid.length ? 0 : 1);
