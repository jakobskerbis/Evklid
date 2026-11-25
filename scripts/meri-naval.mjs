// Obremenilni test čakalne vrste za AI s pravim modelom (točka 23 načrta izboljšav, j 19. 11. 2026).
// K učencev (--hkrati, privzeto 12) hkrati pošlje prvo sporočilo (kratko lastno nalogo iz matematike za OŠ) skozi PRAVO
// aplikacijo (server/app.js v istem procesu, začasna baza, samo 127.0.0.1); meja hkratnih odgovorov EVKLID_AI_SOCASNO
// (--socasno, privzeto 4) je nižja od K, zato vrsta (server/vrsta-ai.js) res dela. Za vsako sporočilo izpiše: status
// HTTP, dogodke vrste (mesta), čas do prvega besedila, skupni čas, napake (429, 529); na koncu vsote in strošek.
// Učenec OŠ (8. razred, MAT): inštruktor je Haiku (način chat). Ne piše v pravo bazo in ne v docs/.
//   node scripts/meri-naval.mjs [--max-usd 2] [--hkrati 12] [--socasno 4] [--suho] [--preizkus]
//   --suho      samo ocena najslabšega stroška, brez klica modela (0 $)
//   --preizkus  preizkusni odgovori namesto modela (samo brez ključa API), za test poti (0 $)
// Meja stroška: sporočila tečejo hkrati, zato skripta PRED navalom rezervira K × najslabši primer enega sporočila in
// zavrne zagon (izhod 1), če to preseže --max-usd.
// Zagon: GitHub Actions > Meritev, skripta scripts/meri-naval.mjs (argumenti npr. --hkrati 12 --socasno 4).
// Izid: data/meri-naval.json (artefakt »meritev«) in dnevnik (brez osebnih podatkov: izmišljeni učenci, lastne naloge).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const arg = (name, d) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : d;
};
const ZNANI = { "--max-usd": 1, "--hkrati": 1, "--socasno": 1, "--suho": 0, "--preizkus": 0 };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!(a in ZNANI)) {
    console.error(`Neznan argument »${a}« (dovoljeni: ${Object.keys(ZNANI).join(", ")}; vrednost za presledkom, ne z =). Nič ni bilo poklicano.`);
    process.exit(1);
  }
  i += ZNANI[a];
}
const MAX_USD = Number(arg("--max-usd", 2));
const K = Number(arg("--hkrati", 12));
const SOCASNO = Number(arg("--socasno", 4));
const SUHO = process.argv.includes("--suho");
const PREIZKUS = process.argv.includes("--preizkus");
const OUT = process.env.EVKLID_MERI_IZID || "data/meri-naval.json";
if (!(MAX_USD > 0) || MAX_USD > 5) {
  console.error("--max-usd mora biti večji od 0 in največ 5. Nič ni bilo poklicano.");
  process.exit(1);
}
if (!Number.isInteger(K) || K < 2 || K > 40) {
  console.error("--hkrati mora biti celo število od 2 do 40. Nič ni bilo poklicano.");
  process.exit(1);
}
if (!Number.isInteger(SOCASNO) || SOCASNO < 1 || SOCASNO >= K) {
  console.error(`--socasno mora biti celo število od 1 do ${K - 1} (manj kot --hkrati, sicer vrsta ne dela). Nič ni bilo poklicano.`);
  process.exit(1);
}

// Kratke lastne naloge za OŠ, vsaka drugačna (brez skupnega predpomnilnika odgovorov).
const vprasanje = (i) => {
  const a = 12 + i;
  const b = 3 + (i % 7);
  return [
    `Reši enačbo ${b}x + ${a} = ${b * 5 + a}.`,
    `Koliko je ${a} % od ${b * 40}?`,
    `Izračunaj ploščino pravokotnika s stranicama ${a} cm in ${b} cm.`,
    `Koliko je ${a} · ${b + 10}?`,
    `Kolikšen je obseg kvadrata s stranico ${a} cm?`,
    `Koliko je ${a * b} : ${b}?`,
  ][i % 6];
};

// Okolje pred uvozom aplikacije: začasna baza (nikoli prava) in meja hkratnih odgovorov.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-naval-"));
process.env.EVKLID_DB = path.join(tmp, "meritev.db");
process.env.EVKLID_AI_SOCASNO = String(SOCASNO);
// Najslabši primer spodaj velja samo za Haiku. Inštruktor OŠ je Haiku; Sonnet in Opus se pri prvem sporočilu učenca OŠ ne
// pokličeta (pregled sodbe le pri koraku, ne pri prvem sporočilu; sprotni pregled OŠ le z EVKLID_LIVE_REVIEW_OS=1 ali ob
// tveganju (tekmovanje, faks, »Razloži podrobneje«); preverjanje za predpomnilnik in kartice le z dnevnim zneskom; nadgradnja
// modela le z mesečnim proračunom). Vse to je spodaj izklopljeno, poleg tega pa sta srednji in največji model nastavljena na
// Haiku: če bi kakšna pot vseeno poklicala »Sonnet« ali »Opus«, gre klic k Haikuju in meja drži.
const HAIKU = "claude-haiku-5-5";
process.env.EVKLID_MODEL = HAIKU;
process.env.EVKLID_MODEL_MID = HAIKU;
process.env.EVKLID_MODEL_DEEP = HAIKU;
process.env.EVKLID_LIVE_REVIEW_OS = "0";
process.env.EVKLID_VERIFY_DAILY_USD = "0";
process.env.EVKLID_MONTHLY_BUDGET_USD = "0";
// Vsako sporočilo gre k modelu (ne iz skupnega predpomnilnika odgovorov).
process.env.EVKLID_ANSWER_CACHE = "0";
// Pregled, ki ga ustavi časovna meja, ne zapiše porabe (glej scripts/meri-primerjava.mjs); z daljšo mejo se zapiše vsak.
process.env.EVKLID_LIVE_REVIEW_TIMEOUT_MS = "300000";
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");
const { buildSystemPrompt } = await import("../server/prompt.js");
const { isMockMode, modeParams, MODEL_MID } = await import("../server/claude.js");
const { callMaxUsd, systemTokens, CHECK_MAX_TOKENS } = await import("../server/meje-ai.js");
const { MODEL_VARNOST } = await import("../server/nujno.js");
const { normalizeSettings } = await import("../server/settings.js");
const { AI_VRSTA_MS } = await import("../server/vrsta-ai.js");

const nastavitve = normalizeSettings({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT", solving_mode: "A" });
const system = buildSystemPrompt({ settings: nastavitve, studentName: "Ana" });
const chat = modeParams("chat");
const think = modeParams("think");
// Najslabši primer enega prvega sporočila (vse Haiku, glej zgoraj):
// - odgovor s tremi dodatnimi krogi orodij (4 klici, server/claude.js MAX_TOOL_ROUNDS = 3), vsak z izhodom prejšnjih na vhodu;
//   vhod: sistemski prompt + 12 000 žetonov za skrito opombo lekcije, vprašanje in orodja;
// - popravek (server/live-check.js correction, način think);
// - sprotni pregled, do dva klica (reviewCalls; tu model MID = Haiku);
// - varnostni pregled (Haiku, 16 žetonov) s ponovitvijo v ozadju.
const vhod = systemTokens(system) + 12000;
let odgovor = 0;
for (let r = 0; r < 4; r++) odgovor += callMaxUsd(chat.model, vhod + r * (chat.max_tokens + 2000), chat.max_tokens);
const popravek = callMaxUsd(think.model, 2 * chat.max_tokens + 5000, think.max_tokens);
const pregled = 2 * callMaxUsd(MODEL_MID, 4000 + 2 * chat.max_tokens, CHECK_MAX_TOKENS);
const varnost = 2 * callMaxUsd(MODEL_VARNOST, 3000, 16);
const najslabse = odgovor + popravek + pregled + varnost + 0.002;
const rezerva = K * najslabse;
console.log(
  `Naval: ${K} učencev OŠ hkrati, meja hkratnih odgovorov ${SOCASNO}, največ ${Math.round(AI_VRSTA_MS() / 1000)} s v vrsti; inštruktor ${chat.model} (chat).`,
);
console.log(`Najslabši primer na sporočilo ${najslabse.toFixed(4)} $; rezerva za naval ${K} × = ${rezerva.toFixed(3)} $; meja ${MAX_USD} $.`);
if ([chat.model, think.model, MODEL_MID, MODEL_VARNOST].some((m) => m !== HAIKU)) {
  console.error(`Najslabši primer velja samo za Haiku (modeli: ${chat.model}, ${think.model}, ${MODEL_MID}, ${MODEL_VARNOST}). Nič ni bilo poklicano.`);
  process.exit(1);
}
if (rezerva > MAX_USD) {
  console.error(`Rezerva ${rezerva.toFixed(3)} $ presega --max-usd ${MAX_USD} $: zmanjšaj --hkrati ali zvišaj mejo. Nič ni bilo poklicano.`);
  process.exit(1);
}
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

// Eno sporočilo: tok SSE beremo sproti, da izmerimo čas do prvega besedila in dogodke vrste.
async function posljiInMeri(i, t0) {
  const s = store.createStudent(`Učenec ${i + 1}`, nastavitve); // vsak svoj učenec: dnevne meje ne vplivajo
  const conv = store.createConversation(s.id);
  const r = { st: i + 1, status: null, vrsta: [], naVrstiMs: null, prviDeltaMs: null, skupajMs: null, done: false, napaka: null, koda: null, usd: 0 };
  const ms = () => Math.round(performance.now() - t0);
  try {
    const res = await fetch(`${base}/api/conversations/${conv.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: vprasanje(i) }),
    });
    r.status = res.status;
    if (!res.ok) {
      r.napaka = `HTTP ${res.status}: ${(await res.text()).slice(0, 160)}`;
    } else {
      const dec = new TextDecoder();
      let buf = "";
      for await (const kos of res.body) {
        buf += dec.decode(kos, { stream: true });
        for (let k = buf.indexOf("\n\n"); k >= 0; k = buf.indexOf("\n\n")) {
          const blok = buf.slice(0, k);
          buf = buf.slice(k + 2);
          const ev = /^event: (.*)$/m.exec(blok)?.[1];
          const data = JSON.parse(/^data: (.*)$/m.exec(blok)?.[1] || "null");
          if (ev === "phase" && data?.phase === "queue") r.vrsta.push({ mesto: data.mesto, ms: ms() });
          else if (ev === "phase" && data?.phase === "answer" && r.vrsta.length && r.naVrstiMs === null) r.naVrstiMs = ms();
          else if (ev === "delta" && r.prviDeltaMs === null) r.prviDeltaMs = ms();
          else if (ev === "done") r.done = true;
          else if (ev === "error") r.napaka = String(data?.error || "napaka");
        }
      }
    }
  } catch (e) {
    r.napaka = String(e?.message || e).slice(0, 200);
  }
  r.skupajMs = ms();
  r.koda = /Koda: (\d{3})/.exec(r.napaka || "")?.[1] || (r.status && r.status !== 200 ? String(r.status) : null);
  r.usd = store.db.prepare("SELECT COALESCE(SUM(cost_usd), 0) AS s FROM usage WHERE student_id = ?").get(s.id).s;
  return r;
}

const s = (x) => (x === null ? "–" : `${(x / 1000).toFixed(1).replace(".", ",")} s`);
const t0 = performance.now();
const izid = await Promise.all(Array.from({ length: K }, (_, i) => posljiInMeri(i, t0)));
const zidMs = Math.round(performance.now() - t0);
server.close();

for (const r of izid) {
  const vrsta = r.vrsta.length ? `vrsta ${r.vrsta.map((v) => v.mesto).join("→")}${r.naVrstiMs !== null ? ` (na vrsti ${s(r.naVrstiMs)})` : ""}` : "brez vrste";
  console.log(
    `#${String(r.st).padStart(2)}  HTTP ${r.status ?? "–"}  ${vrsta}  prvo besedilo ${s(r.prviDeltaMs)}  skupaj ${s(r.skupajMs)}  ${r.usd.toFixed(4)} $${r.done ? "" : "  NI KONČANO"}${r.napaka ? `  napaka: ${r.napaka.slice(0, 120)}` : ""}`,
  );
}
const modeli = store.db.prepare("SELECT model, COUNT(*) AS n, SUM(cost_usd) AS usd FROM usage GROUP BY model").all();
const tuji = modeli.filter((m) => !String(m.model).startsWith(HAIKU));
const sortiran = (a) => a.filter((x) => x !== null).sort((x, y) => x - y);
const prvi = sortiran(izid.map((r) => r.prviDeltaMs));
const skupaj = sortiran(izid.map((r) => r.skupajMs));
const med = (a) => (a.length ? a[Math.floor((a.length - 1) / 2)] : null);
const vsote = {
  koncanih: izid.filter((r) => r.done).length,
  vVrsti: izid.filter((r) => r.vrsta.length).length,
  najvisjeMesto: Math.max(0, ...izid.flatMap((r) => r.vrsta.map((v) => v.mesto))),
  napake429: izid.filter((r) => r.koda === "429").length,
  napake529: izid.filter((r) => r.koda === "529").length,
  drugeNapake: izid.filter((r) => r.napaka && !["429", "529"].includes(r.koda)).length,
  prviDeltaMedianaMs: med(prvi),
  prviDeltaNajvecMs: prvi.at(-1) ?? null,
  skupajMedianaMs: med(skupaj),
  skupajNajvecMs: skupaj.at(-1) ?? null,
  zidMs,
  usd: porabljeno(),
  rezervaUsd: rezerva,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ datum: new Date().toISOString(), hkrati: K, socasno: SOCASNO, vrstaMs: AI_VRSTA_MS(), model: chat.model, preizkus: PREIZKUS, vsote, modeli, izid }, null, 1));
if (tuji.length) console.log(`OPOZORILO: klici drugih modelov kot ${HAIKU}: ${tuji.map((m) => `${m.model} ×${m.n}`).join(", ")}`);
if (vsote.usd > rezerva) console.log(`OPOZORILO: strošek ${vsote.usd.toFixed(4)} $ presega rezervo ${rezerva.toFixed(4)} $ (najslabši primer je treba popraviti).`);
console.log(
  `\nIZID: ${vsote.koncanih}/${K} končanih; v vrsti ${vsote.vVrsti} (najvišje mesto ${vsote.najvisjeMesto}); napake 429: ${vsote.napake429}, 529: ${vsote.napake529}, druge: ${vsote.drugeNapake}; ` +
    `prvo besedilo mediana ${s(vsote.prviDeltaMedianaMs)}, največ ${s(vsote.prviDeltaNajvecMs)}; skupaj mediana ${s(vsote.skupajMedianaMs)}, največ ${s(vsote.skupajNajvecMs)}; ` +
    `ves naval ${s(zidMs)}; strošek ${vsote.usd.toFixed(4)} $ (rezerva ${rezerva.toFixed(3)} $). Podrobno: ${OUT}`,
);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(vsote.koncanih ? 0 : 1);
