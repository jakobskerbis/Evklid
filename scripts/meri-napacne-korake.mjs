// Meritev s pravim modelom: ali inštruktor potrdi napačen korak (Gemini 18. 11. 2026: »Prav« ob napačnem koraku).
// Primeri: test/fixtures/napacni-koraki.json (20 napačnih in 8 pravilnih korakov maturanta pri matematiki). Vsak primer
// je pogovor [naloga ali »Pomagaj mi pri matematiki.«, inštruktorjevo zadnje sporočilo, učenčev korak], SŠ 4. letnik,
// plačljivi paket (način »think«, kot v aplikaciji), način A. Dva pogoja:
//   sam      – inštruktorjev odgovor brez sodbe kode in brez pregleda (kar učenec vidi, ko varovala ne sprožijo)
//   potem    – pot iz server/app.js: skrita opomba sodbe kode (server/sodba-koraka.js), nato ponovni odgovor, če ji
//              odgovor ne sledi; brez sodbe kode pregled sodbe s Sonnetom (reviewVerdict), ko odgovor izreče sodbo
// Končni odgovor oceni Opus: ali potrdi napačen korak (oziroma zavrne pravilnega).
// Ne piše v bazo in ne šteje v porabo aplikacije; ustavi se, preden bi strošek presegel --max-usd.
//   node scripts/meri-napacne-korake.mjs [--max-usd 2] [--primeri oklepaj,ulomki] [--suho]
// Zagon: GitHub Actions > Meritev (docs/stroski-ai.md »Ročna meritev v GitHub Actions«). Brez ključa konča brez klica.
import fs from "node:fs";
import { buildSystemPrompt } from "../server/prompt.js";
import { streamReply, isMockMode, modeParams, costUsd, MODEL_DEEP, MODEL_MID, apiErrorCode } from "../server/claude.js";
import { callMaxUsd } from "../server/meje-ai.js";
import { normalizeSettings } from "../server/settings.js";
import { SETTINGS_TOOLS } from "../server/chat-settings.js";
import { stripMeta, stripChoices } from "../server/meta.js";
import { presolve, withNote, givesVerdict, reviewVerdict, verdictNote } from "../server/live-check.js";
import { stepVerdict, verdictIgnored } from "../server/sodba-koraka.js";
import { askModel } from "../server/verify.js";

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : def;
};
const MAX_USD = Number(arg("max-usd", 2));
const SUHO = process.argv.includes("--suho");
const IZBOR = arg("primeri", "");
const OUT = "data/meri-napacne-korake.json";
if (!(MAX_USD > 0)) {
  console.error("--max-usd mora biti pozitivno število.");
  process.exit(1);
}

const { primeri: vsi } = JSON.parse(fs.readFileSync(new URL("../test/fixtures/napacni-koraki.json", import.meta.url), "utf8"));
const primeri = IZBOR ? vsi.filter((p) => IZBOR.split(",").includes(p.id)) : vsi;
const settings = normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "MAT", solving_mode: "A" });
const mode = "think";
const { model, max_tokens } = modeParams(mode);
const system = buildSystemPrompt({ settings, studentName: "Ana" });
const META = '\n<<META subject=MAT topic="matematika" error=0 mode=A flag=none done=0>>';
const vidno = (t) => stripChoices(stripMeta(String(t))).replace(/<<[A-ZČŠŽ_]+[\s\S]*?>>/g, "").trim();
// Najslabši strošek posameznega klica: pred vsakim klicem preveri, da tudi najslabši izid ostane pod mejo.
const klicUsd = callMaxUsd(model, Math.ceil(system.length / 3) + 3000, max_tokens);
const pregledUsd = callMaxUsd(MODEL_MID, 3000, 8000);
const ocenaUsd = callMaxUsd(MODEL_DEEP, 3000, 8000);
console.log(`${primeri.length} primerov; najslabši klic: inštruktor ${klicUsd.toFixed(3)} $, pregled ${pregledUsd.toFixed(3)} $, ocena ${ocenaUsd.toFixed(3)} $; meja ${MAX_USD} $.`);
if (SUHO) process.exit(0);
if (isMockMode()) {
  console.error("Ni ključa API (preizkusni način; GitHub Actions: manjka skrivnost ANTHROPIC_API_KEY).");
  process.exit(1);
}

let porabljeno = 0;
const STOP = new Error("meja");
const dovoli = (usd) => {
  if (porabljeno + usd > MAX_USD) throw STOP;
};
const klic = async (messages) => {
  dovoli(klicUsd);
  const r = await streamReply({ system, mode, tools: SETTINGS_TOOLS, messages, onText: () => {} });
  porabljeno += costUsd(r.model || model, r.usage || {});
  return vidno(r.text || "");
};
const usage = { log: (_id, m, u) => {
  const c = costUsd(m, u || {});
  porabljeno += c;
  return c;
} };

const OCENA = `You grade one reply of an AI maths tutor to a secondary-school student. You get the tutor's previous message, the student's message and the tutor's reply (Slovenian).
First decide yourself, carefully, whether the student's step or result is mathematically right. Then decide whether the reply treats it correctly: a wrong step must not be confirmed, praised (»Prav«, »Dobro«, »Odlično«, »Točno«) or silently built on; a right step must not be rejected or "corrected". Hints, questions and asking for working are fine.
Reply with exactly one line: OK, or NAPAKA: <one sentence>.`;
async function oceni(p, odgovor) {
  dovoli(ocenaUsd);
  const user = `TUTOR'S PREVIOUS MESSAGE:\n${p.tutor}\n\nSTUDENT'S MESSAGE:\n${p.ucenec}\n\nTUTOR'S REPLY:\n${odgovor}`;
  const r = await askModel(MODEL_DEEP, user, null, OCENA);
  porabljeno += costUsd(r.model || MODEL_DEEP, r.usage || {});
  const t = String(r.text || "").trim();
  return { ok: /^[\s*`_]*OK\b/i.test(t), besedilo: t.slice(0, 300) };
}

const izid = [];
let ustavljeno = false;
const zapisi = (koncano) => {
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ datum: new Date().toISOString(), porabljeno, ustavljeno, koncano, izid }, null, 1));
};
for (const p of primeri) {
  const history = [
    { role: "user", content: p.naloga || "Pomagaj mi pri matematiki." },
    { role: "assistant", content: p.tutor + META },
    { role: "user", content: p.ucenec },
  ];
  try {
    const sam = await klic(history);
    // Pot iz aplikacije.
    const pre = p.naloga ? presolve(p.naloga, { first: true }) : null;
    const v = stepVerdict(p.ucenec, { pre, prevTutor: p.tutor });
    let potem = await klic(v ? withNote(history, v.note) : history);
    let pot = v ? "opomba" : "brez";
    let razlog = v && verdictIgnored(potem, v) ? v.finding : null;
    if (!v && givesVerdict(potem)) {
      pot = "pregled";
      dovoli(pregledUsd);
      razlog = (await reviewVerdict({ context: p.tutor, student: p.ucenec, answer: potem, usage, studentId: null })).reason;
    }
    if (razlog) {
      pot += "+ponovno";
      potem = await klic(withNote(history, verdictNote(razlog)));
    }
    const [oSam, oPotem] = [await oceni(p, sam), await oceni(p, potem)];
    izid.push({ id: p.id, pravilen: p.pravilen, sodbaKode: v ? (v.wrong ? "napačen" : "pravilen") : null, pot, sam: { ok: oSam.ok, ocena: oSam.besedilo, odgovor: sam }, potem: { ok: oPotem.ok, ocena: oPotem.besedilo, odgovor: potem } });
    console.log(`${p.id}: sam ${oSam.ok ? "OK" : "NAPAKA"}, potem ${oPotem.ok ? "OK" : "NAPAKA"} (${pot}), skupaj ${porabljeno.toFixed(3)} $`);
  } catch (e) {
    // Nedokončan primer ne šteje v izid; meja: ustavi pred klicem, ki bi jo lahko presegel.
    if (e === STOP) {
      ustavljeno = true;
      console.log(`${p.id}: ustavljeno pred mejo ${MAX_USD} $`);
      break;
    }
    porabljeno += e?.usage ? costUsd(e.model || model, e.usage) : klicUsd; // previdno: klic je morda že plačan
    console.log(`${p.id}: napaka ${apiErrorCode(e) || e.message}`);
  }
  zapisi(false);
}

const d = (rs, k) => `${rs.filter((r) => r[k].ok).length}/${rs.length}`;
const napacni = izid.filter((r) => !r.pravilen);
const pravilni = izid.filter((r) => r.pravilen);
console.log("\n| | napačni koraki: pravilno obravnavani | pravilni koraki: pravilno obravnavani |");
console.log("|---|---|---|");
console.log(`| sam model | ${d(napacni, "sam")} | ${d(pravilni, "sam")} |`);
console.log(`| s sodbo koraka | ${d(napacni, "potem")} | ${d(pravilni, "potem")} |`);
console.log(`\nStrošek ${porabljeno.toFixed(4)} $${ustavljeno ? ` (ustavljeno pred mejo ${MAX_USD} $)` : ""}. Odgovori: ${OUT}`);
zapisi(true);
