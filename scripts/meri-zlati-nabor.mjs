// Zlati nabor inštruktorja (P1-10 načrta treh prioritet, j 25. 11. 2026): en nabor z znanimi odgovori, s katerim se meri vsaka
// sprememba poziva ali izbire modela (pred in po, slepo). Združi:
//   bio, kem, predstave – nov nabor (test/fixtures/zlati-nabor/novi.json): 11 BIO, 11 KEM, 14 napačnih predstav
//   astra      – 10 vprašanj iz primerjave z Astro (test/fixtures/astra-vprasanja.json)
//   pedagogika – 12 pogovorov po 3 sporočila (test/fixtures/pedagogika-12.json)
//   matura     – stalen vzorec 20 od 121 maturitetnih korakov, vsaka vrsta napake (test/fixtures/napacni-koraki-matura.json)
//   preizkus3  – vsaka 5. od 150 nalog Preizkusa 3 (šifrirane, PREIZKUS3_KLJUC); uradnih rešitev v repozitoriju ni, zato
//                ocenjevalec rešuje sam in vrstica nosi oznako »brez reference«; izid se šifrira, v dnevniku ni besedil
// Vsak primer gre skozi PRAVO aplikacijo (server/app.js v istem procesu, začasna baza, nov učenec za vsak primer), z
// vsemi varovali kot v produkciji. Nato ga slepo ocenita dva ločena klica ocenjevalca (MODEL_DEEP, Opus) z znano referenco;
// ob razhajanju še tretji, odloči večina (scripts/zlati-nabor-ocena.mjs). Ocenjevalec ne ve, katera različica je
// odgovorila. Referenca gre samo ocenjevalcu, inštruktorju nikoli.
// Ne piše v pravo bazo in ne v docs/. Ustavi se, preden bi strošek (aplikacija + ocenjevalci) presegel --max-usd.
//   node scripts/meri-zlati-nabor.mjs [--max-usd 2] [--skupine bio,kem] [--primeri id1,id2] [--del 1-3] [--hkrati 3]
//                                     [--nacin think|chat] [--kandidat] [--suho] [--preizkus] [--p3-datoteka <pot>]
//   --skupine   privzeto vse javne (bio, kem, predstave, astra, pedagogika, matura); preizkus3 samo izrecno
//   --del 1-4   le vsak četrti primer (1., 5., 9. …), da gre cel nabor v več zagonov po 2 $; nato 2-4, 3-4 in 4-4
//   --kandidat  kandidat prompta (EVKLID_INSTRUKTOR_KANDIDAT=1), izid z »-kandidat« v imenu; primerjava pred/po:
//               node scripts/zlati-nabor-ocena.mjs --primerjaj <prej.json> <potem.json>
//   --suho      samo izbor in najslabši strošek, brez klica (0 $); --preizkus preizkusni odgovori brez ključa (0 $)
//   --p3-datoteka  lokalno (ne v GitHub Actions) naloge Preizkusa 3 v čistem besedilu namesto šifrirane datoteke
// Zagon: GitHub Actions > Meritev, skripta scripts/meri-zlati-nabor.mjs (docs/zlati-nabor.md). Izid:
// data/meri-zlati-nabor*.json (artefakt »meritev«), tabela na koncu dnevnika (in v povzetku zagona).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { NAVODILA, SKUPINE, JAVNE, sestaviPrimere, vzorecPoVrsti, vprasanjeOcenjevalcu, preberiOceno, potrebenTretji, zdruziOcene, povzetek, tabela } from "./zlati-nabor-ocena.mjs";
import { odsifriraj, sifriraj, kljucIz } from "./preizkus3-sifra.mjs";

const ZNANI = { "--max-usd": 1, "--skupine": 1, "--primeri": 1, "--del": 1, "--hkrati": 1, "--nacin": 1, "--kandidat": 0, "--suho": 0, "--preizkus": 0, "--p3-datoteka": 1 };
const napaka = (m) => {
  console.error(`${m} Nič ni bilo poklicano.`);
  process.exit(1);
};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!(a in ZNANI)) napaka(`Neznan argument »${a}« (dovoljeni: ${Object.keys(ZNANI).join(", ")}; vrednost za presledkom, ne z =).`);
  if (ZNANI[a] && (i + 1 >= process.argv.length || process.argv[i + 1].startsWith("--"))) napaka(`Argument »${a}« nima vrednosti.`);
  i += ZNANI[a];
}
const arg = (name, d) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : d;
};
const MAX_USD = Number(arg("--max-usd", 2));
const NACIN = arg("--nacin", "think");
const HKRATI = Number(arg("--hkrati", 3));
const DEL = arg("--del", "");
const SUHO = process.argv.includes("--suho");
const PREIZKUS = process.argv.includes("--preizkus");
const KANDIDAT = process.argv.includes("--kandidat");
const IZBRANE = arg("--skupine", JAVNE.join(",")).split(",").filter(Boolean);
const P3_DATOTEKA = arg("--p3-datoteka", "");
if (!(MAX_USD > 0) || MAX_USD > 5) napaka("--max-usd mora biti večji od 0 in največ 5.");
if (!["think", "chat"].includes(NACIN)) napaka(`--nacin mora biti think ali chat (ne »${NACIN}«).`);
if (!Number.isInteger(HKRATI) || HKRATI < 1 || HKRATI > 6) napaka("--hkrati mora biti celo število od 1 do 6.");
const neznane = IZBRANE.filter((s) => !SKUPINE.includes(s));
if (!IZBRANE.length || neznane.length || new Set(IZBRANE).size !== IZBRANE.length) napaka(`Neveljavne --skupine »${arg("--skupine", "")}« (dovoljeno: ${SKUPINE.join(", ")}, brez ponovitev).`);
const delM = DEL ? /^([1-9])-([1-9])$/.exec(DEL) : null;
if (DEL && (!delM || Number(delM[1]) > Number(delM[2]))) napaka(`Neveljaven --del »${DEL}« (npr. 1-3, 2-3, 3-3).`);
if (P3_DATOTEKA && process.env.GITHUB_ACTIONS) napaka("--p3-datoteka ni dovoljen v GitHub Actions (naloge Preizkusa 3 samo šifrirane).");
const S_P3 = IZBRANE.includes("preizkus3");
const OUT = process.env.EVKLID_MERI_IZID || `data/meri-zlati-nabor${KANDIDAT ? "-kandidat" : ""}${S_P3 ? "-p3" : ""}${DEL ? `-${DEL}` : ""}.json`;

// Ključ Preizkusa 3 se takoj odstrani iz okolja, da ga noben del strežnika ne vidi in ne zapiše.
const KLJUC_B64 = process.env.PREIZKUS3_KLJUC || "";
delete process.env.PREIZKUS3_KLJUC;
let KLJUC = null;
if (S_P3 && process.env.GITHUB_ACTIONS && !KLJUC_B64) napaka("Ni ključa PREIZKUS3_KLJUC (skrivnost v GitHubu): izid Preizkusa 3 mora biti šifriran.");
if (S_P3 && !P3_DATOTEKA && !KLJUC_B64) napaka("Za skupino preizkus3 je potreben ključ PREIZKUS3_KLJUC ali lokalno --p3-datoteka.");

const beri = (p) => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), "utf8"));
let preizkus3 = [];
try {
  if (KLJUC_B64) KLJUC = kljucIz(KLJUC_B64);
  if (S_P3) {
    const naloge = P3_DATOTEKA ? JSON.parse(fs.readFileSync(P3_DATOTEKA, "utf8")).naloge : JSON.parse(odsifriraj(fs.readFileSync(new URL("./preizkus3-naloge.enc", import.meta.url), "utf8"), KLJUC)).naloge;
    if (!Array.isArray(naloge) || naloge.some((n) => !Number.isInteger(n.id) || typeof n.q !== "string" || !n.nastavitve)) throw new Error("neveljavna oblika");
    preizkus3 = naloge.filter((_, i) => i % 5 === 0);
  }
} catch (e) {
  napaka(`Nalog Preizkusa 3 ni bilo mogoče prebrati: ${e.message}`);
}
const vsi = sestaviPrimere({
  novi: beri("../test/fixtures/zlati-nabor/novi.json").primeri,
  astra: beri("../test/fixtures/astra-vprasanja.json").primeri,
  pedagogika: beri("../test/fixtures/pedagogika-12.json").pogovori,
  matura: vzorecPoVrsti(beri("../test/fixtures/napacni-koraki-matura.json").primeri, 8),
  preizkus3,
});
let primeri = vsi.filter((p) => IZBRANE.includes(p.skupina));
if (arg("--primeri", "")) {
  const ids = arg("--primeri", "").split(",");
  const manjka = ids.filter((id) => !primeri.some((p) => p.id === id));
  if (manjka.length) napaka(`Neznani primeri v izbranih skupinah: ${manjka.join(", ")}.`);
  primeri = primeri.filter((p) => ids.includes(p.id));
}
if (delM) primeri = primeri.filter((_, i) => i % Number(delM[2]) === Number(delM[1]) - 1);
if (!primeri.length) napaka("Izbor je prazen.");

// Okolje pred uvozom aplikacije: začasna baza (nikoli prava), brez predpomnilnika odgovorov.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-zlati-"));
process.env.EVKLID_DB = path.join(tmp, "meritev.db");
process.env.EVKLID_ANSWER_CACHE = "0";
process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
if (NACIN === "chat") process.env.EVKLID_SS_THINK = "0";
// Kandidat ali trenutni inštruktor: izrecno v obe smeri (lokalno okolje ne sme pomešati različic).
process.env.EVKLID_INSTRUKTOR_KANDIDAT = KANDIDAT ? "1" : "0";
delete process.env.EVKLID_PROMPT_PATH;
// Preverjanje kartic v ozadju (Sonnet + Opus) ni del odgovora, ki ga vidi učenec: izklopljeno, da ostane pod mejo.
process.env.EVKLID_VERIFY_DAILY_USD = "0";
// Brez mesečnega proračuna: z njim bi prazna baza nadgradila Haiku v Sonnet ali Opus (server/proracun.js) in izid ne bi
// meril plačljivega paketa, kot ga dobi učenec ob običajni porabi.
process.env.EVKLID_MONTHLY_BUDGET_USD = "0";
// Sprotni pregled, ki ga ustavi časovna meja, ne zapiše porabe, plačan pa je lahko vseeno: z daljšo mejo se vsak konča in
// zapiše (kot scripts/meri-pedagogika.mjs).
process.env.EVKLID_LIVE_REVIEW_TIMEOUT_MS = "300000";
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");
const { buildSystemPrompt, templatePath } = await import("../server/prompt.js");
const { isMockMode, modeParams, getClient, costUsd, MODEL_MID, MODEL_DEEP, MAX_TOKENS, MAX_TOOL_ROUNDS } = await import("../server/claude.js");
const { callMaxUsd } = await import("../server/meje-ai.js");
const { normalizeSettings } = await import("../server/settings.js");
const { lessonForQuestion, lessonNote } = await import("../server/lekcija-za-vprasanje.js");

// Opus 5.5 razmišljanja ne dovoli izklopiti (server/claude.js quickParams): prostor za razmislek in JSON, napor »medium« kot
// pri preverjanju kartic (server/verify.js).
const OCENA_MAX_TOKENS = 6000;
const OCENA_NAPOR = "medium";
const { model, max_tokens } = modeParams(NACIN);
const izhod = Math.max(max_tokens, MAX_TOKENS.think);
const nastavitve = (p) => normalizeSettings(p.profil);
const system = Math.max(...primeri.map((p) => buildSystemPrompt({ settings: nastavitve(p), studentName: "Ana" }).length));
const znakov = (p) => [...(p.zgodovina || []).map((z) => z.besedilo), ...p.krogi].join("").length;
// Najslabši primer enega sporočila (kot scripts/meri-pedagogika.mjs): odgovor in ponovljen odgovor (vsak z do
// MAX_TOOL_ROUNDS krogi orodij), popravek in varnostni pregled, dva klica Sonnet (sprotni pregled ali sodba koraka).
const najdaljsi = Math.max(...primeri.map(znakov));
const klicUsd = callMaxUsd(model, Math.ceil(system / 3) + najdaljsi + (MAX_TOOL_ROUNDS + 3) * izhod + 4000, izhod);
const naSporocilo = (2 * (MAX_TOOL_ROUNDS + 1) + 2) * klicUsd + 2 * callMaxUsd(MODEL_MID, 4000 + najdaljsi + 2 * max_tokens, 8000) + 0.01;
// Ocenjevalec: navodila + dejanski pogovor in referenca (rezerva se izračuna šele po pogovoru, iz njegove dolžine).
const ocenaUsd = (p, prepis) => callMaxUsd(MODEL_DEEP, 1500 + Math.ceil(([...(p.zgodovina || []).map((z) => z.besedilo), ...prepis.flatMap((k) => [k.ucenec, k.evklid]), p.referenca || ""].join("").length) / 2), OCENA_MAX_TOKENS);
const poSkupini = Object.fromEntries(IZBRANE.map((s) => [s, primeri.filter((p) => p.skupina === s).length]));
const sporocil = primeri.reduce((a, p) => a + p.krogi.length, 0);
console.log(`Različica: ${KANDIDAT ? "KANDIDAT" : "trenutni inštruktor"} (${path.basename(templatePath())}); izid ${OUT}`);
console.log(`${primeri.length} primerov (${Object.entries(poSkupini).map(([s, n]) => `${s} ${n}`).join(", ")}), ${sporocil} sporočil; način ${NACIN} (${model}); ocenjevalci ${MODEL_DEEP}.`);
console.log(`Rezerva pred vsakim sporočilom ${naSporocilo.toFixed(3)} $ (najslabši primer), pred vsakim klicem ocenjevalca po dolžini pogovora; meja ${MAX_USD} $. Ob meji se ustavi in zapiše, kar je ocenjeno.`);
if (SUHO) process.exit(0);
if (PREIZKUS !== isMockMode()) napaka(PREIZKUS ? "--preizkus deluje samo brez ključa API (sicer bi klical pravi model)." : "Ni ključa API (GitHub Actions: manjka skrivnost ANTHROPIC_API_KEY).");

const store = openDb(process.env.EVKLID_DB);
// Brez opravil v ozadju in samo na 127.0.0.1: strežnik s pravim ključem ni dosegljiv od drugod.
const server = createApp(store, { scheduler: false }).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;
let ocenjevalciUsd = 0;
const izid = [];
let ustavljeno = false;
// Rezervacija pred vsakim klicem: porabljeno + rezervirano v teku + nova rezerva ne sme preseči meje. Če ne gre, počaka, da
// se končajo klici v teku (njihova dejanska cena je navadno precej nižja od rezerve); brez klicev v teku se ustavi.
let vTeku = 0;
// nov: prvo sporočilo novega primera; po ustavitvi se novi primeri ne začnejo, začeti (že plačani pogovori) pa še počakajo
// na prostor za oceno.
async function rezerviraj(znesek, { nov = false } = {}) {
  if (nov && ustavljeno) return false;
  while (porabljeno() + vTeku + znesek > MAX_USD) {
    if (vTeku <= 1e-9) {
      ustavljeno = true;
      return false;
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  vTeku += znesek;
  return true;
}
const aplikacijaUsd = () => store.db.prepare("SELECT COALESCE(SUM(cost_usd), 0) AS s FROM usage").get().s;
const porabljeno = () => aplikacijaUsd() + ocenjevalciUsd;
const META = (s) => `\n<<META subject=${s.subject} topic="${s.subject}" error=0 mode=${s.solving_mode} flag=none done=0>>`;

// Eno sporočilo učenca skozi pravo pot aplikacije; vrne besedilo, kot ga vidi učenec (dogodek done). Napaka nosi
// odlomek toka (lahko z odgovorom) v .podrobno, sporočilo pa samo vrsto (za dnevnik pri Preizkusu 3).
async function poslji(convId, text) {
  const res = await fetch(`${base}/api/conversations/${convId}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }), signal: AbortSignal.timeout(300000) });
  const body = await res.text();
  const napaka = (m, podrobno) => Object.assign(new Error(m), { podrobno });
  if (!res.ok) throw napaka(`HTTP ${res.status}`, body.slice(0, 200));
  const done = [...body.matchAll(/event: done\ndata: (.*)\n/g)].at(-1);
  if (!done) throw napaka("brez dogodka done", body.slice(-200));
  return JSON.parse(done[1]).text;
}

async function pogovor(p) {
  const s = nastavitve(p);
  const ucenec = store.createStudent("Ana", s); // nov učenec za vsak primer: dnevne meje in šibke točke ne vplivajo
  const conv = store.createConversation(ucenec.id);
  // Že zapisan del pogovora (maturitetni koraki), kot v scripts/meri-prav-matura.mjs: prvo sporočilo s skrito opombo lekcije.
  for (const [i, z] of (p.zgodovina || []).entries()) {
    if (z.vloga === "ucenec") {
      const lekcija = i === 0 ? lessonForQuestion(z.besedilo, s) : null;
      store.addMessage(conv.id, "user", [...(lekcija ? [{ type: "text", text: lessonNote(lekcija, s.solving_mode) }] : []), { type: "text", text: z.besedilo }], z.besedilo);
    } else store.addMessage(conv.id, "assistant", [{ type: "text", text: z.besedilo + META(s) }], z.besedilo);
  }
  const prepis = [];
  for (const k of p.krogi) {
    if (!(await rezerviraj(naSporocilo, { nov: !prepis.length }))) return prepis.length ? { prepis, nedokoncan: true } : null;
    try {
      prepis.push({ ucenec: k, evklid: await poslji(conv.id, k) });
    } finally {
      vTeku -= naSporocilo;
    }
  }
  return { prepis };
}

// En ocenjevalec z lastno rezervo; null, če odgovor ni veljaven (manjka merilo, ni JSON, odrezan), klic pade ali ni
// prostora pod mejo. --preizkus: EVKLID_ZLATI_PREIZKUS=razhajanje (drugi ocenjevalec da NE pri prvem merilu) ali
// =napaka (prvi klic vrže napako) preizkusi tretjega ocenjevalca in ponovni poskus brez modela.
let preizkusKlicev = 0;
const neveljavne = {};
async function ocenjevalec(p, prepis, obrni) {
  if (PREIZKUS) {
    const nacin = process.env.EVKLID_ZLATI_PREIZKUS || "";
    if (nacin === "napaka" && preizkusKlicev++ === 0) return null;
    const merila = Object.fromEntries(p.merila.map((m, i) => [m, nacin === "razhajanje" && obrni && i === 0 ? "NE" : "DA"]));
    return { merila, pedagogika: p.pedagogika ? 8 : null, napake: [] };
  }
  const z = ocenaUsd(p, prepis);
  if (!(await rezerviraj(z))) return null;
  try {
    const r = await getClient().messages.create({ model: MODEL_DEEP, max_tokens: OCENA_MAX_TOKENS, output_config: { effort: OCENA_NAPOR }, system: NAVODILA, messages: [{ role: "user", content: vprasanjeOcenjevalcu(p, prepis, { obrni }) }] });
    ocenjevalciUsd += costUsd(r.model || MODEL_DEEP, r.usage || {});
    const o = r.stop_reason === "end_turn" ? preberiOceno((r.content || []).filter((b) => b.type === "text").map((b) => b.text).join(""), p.merila, p.pedagogika) : null;
    if (!o) neveljavne[r.stop_reason === "end_turn" ? "neveljaven JSON" : `stop ${r.stop_reason}`] = (neveljavne[r.stop_reason === "end_turn" ? "neveljaven JSON" : `stop ${r.stop_reason}`] || 0) + 1;
    return o;
  } catch (e) {
    // Plačan del klica, ki je padel, SDK ne vrne; vrsta napake brez besedila (lahko navaja nalogo).
    const k = `napaka ${e?.status || e?.name || "klica"}`;
    neveljavne[k] = (neveljavne[k] || 0) + 1;
    return null;
  } finally {
    vTeku -= z;
  }
}

// Dva ocenjevalca hkrati (drugi z obrnjenim vrstnim redom meril), ob razhajanju tretji; en ponovni poskus na primer za
// neveljavno oceno.
async function oceni(p, prepis) {
  let poskusov = 0;
  const ena = async (obrni) => {
    let o = await ocenjevalec(p, prepis, obrni);
    if (!o && poskusov++ < 1) o = await ocenjevalec(p, prepis, obrni);
    return o;
  };
  const ocene = await Promise.all([ena(false), ena(true)]);
  if (potrebenTretji(ocene[0], ocene[1], p.merila)) ocene.push(await ena(false));
  if (ocene.filter(Boolean).length < 2) return { ocene, koncna: null };
  return { ocene, koncna: zdruziOcene(ocene, p.merila) };
}

const zapisi = (koncano) => {
  const vsebina = JSON.stringify({ datum: new Date().toISOString(), kandidat: KANDIDAT, prompt: path.basename(templatePath()), nacin: NACIN, model, ocenjevalci: MODEL_DEEP, skupine: IZBRANE, del: DEL || null, porabljeno: { aplikacija: aplikacijaUsd(), ocenjevalci: ocenjevalciUsd }, ustavljeno, koncano, izid, povzetek: povzetek(izid) }, null, 1);
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  // Preizkus 3: naloge in odgovori niso javni (j 18. 11.), zato je izid šifriran z istim ključem kot naloge.
  fs.writeFileSync(OUT, S_P3 && KLJUC ? sifriraj(vsebina, KLJUC) : vsebina);
};
const vrsta = [...primeri];
async function delavec() {
  while (vrsta.length && !ustavljeno) {
    const p = vrsta.shift();
    try {
      const pog = await pogovor(p);
      if (!pog) {
        console.log(`${p.id}: ustavljeno pred mejo ${MAX_USD} $ (porabljeno ${porabljeno().toFixed(3)} $)`);
        continue;
      }
      const { prepis, nedokoncan } = pog;
      // Nedokončan pogovor (meja sredi primera) se zapiše, a ne oceni: ocena dela pogovora bi bila zavajajoča.
      const { ocene, koncna } = nedokoncan ? { ocene: [], koncna: null } : await oceni(p, prepis);
      izid.push({ id: p.id, skupina: p.skupina, prepis, ocene, koncna, ...(nedokoncan && { nedokoncan: true }) });
      const opis = koncna ? Object.entries(koncna.merila).map(([m, v]) => `${m} ${v}`).join(", ") + (koncna.pedagogika != null ? `, pedagogika ${koncna.pedagogika}` : "") : nedokoncan ? "nedokončan pogovor (meja), brez ocene" : "ocena ni uspela";
      // Pri Preizkusu 3 brez navedkov ocenjevalca (lahko navajajo nalogo).
      const napake = p.skupina === "preizkus3" ? [] : [...new Set(ocene.filter(Boolean).flatMap((o) => o.napake))].slice(0, 3);
      console.log(`${p.id}: ${opis} (${ocene.filter(Boolean).length} ocenjevalci)${napake.length ? ` – ${napake.join(" | ")}` : ""}; skupaj ${porabljeno().toFixed(3)} $`);
    } catch (e) {
      // Pri Preizkusu 3 samo vrsta napake (odlomek toka lahko navaja nalogo); podrobnosti v šifriranem izidu.
      const podrobno = String(e?.podrobno || e?.stack || "").slice(0, 500);
      izid.push({ id: p.id, skupina: p.skupina, prepis: [], ocene: [], koncna: null, napaka: `${e?.message || e}`, ...(podrobno && { podrobno }) });
      console.log(`${p.id}: napaka ${p.skupina === "preizkus3" ? String(e?.name || "Error") : `${String(e?.message || e).slice(0, 120)} ${String(e?.podrobno || "").slice(0, 200)}`}`);
    }
    zapisi(false);
  }
}
await Promise.all(Array.from({ length: Math.min(HKRATI, primeri.length) }, delavec));
server.close();
// Vrstni red v datoteki kot v izboru (vzporedni delavci končajo v poljubnem vrstnem redu).
izid.sort((x, y) => primeri.findIndex((p) => p.id === x.id) - primeri.findIndex((p) => p.id === y.id));
zapisi(true);
const pov = povzetek(izid);
const md = `### Zlati nabor${KANDIDAT ? " (kandidat)" : ""}${DEL ? `, del ${DEL}` : ""}\n\n${tabela(pov)}\n\nOcenjenih ${izid.filter((r) => r.koncna).length}/${primeri.length}; strošek aplikacija ${aplikacijaUsd().toFixed(3)} $, ocenjevalci ${ocenjevalciUsd.toFixed(3)} $${ustavljeno ? ` (ustavljeno pred mejo ${MAX_USD} $)` : ""}.`;
console.log(`\n${md}`);
if (Object.keys(neveljavne).length) console.log(`Neveljavne ocene ocenjevalcev: ${Object.entries(neveljavne).map(([k, n]) => `${k} ${n}`).join(", ")}`);
console.log(`Izid: ${OUT}${S_P3 && KLJUC ? " (šifriran)" : ""}`);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(izid.some((r) => r.koncna) ? 0 : 1);
