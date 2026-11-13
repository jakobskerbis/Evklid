// Ocena stroška AI na učenca na mesec (v €), prej in zdaj.
//   node scripts/ocena-stroska.js            ocena iz velikosti prompta in predpostavk
//   node scripts/ocena-stroska.js --db       še dejanska poraba iz data/evklid.db (ta mesec)
// Z nastavljenim ANTHROPIC_API_KEY prešteje žetone prompta prek count_tokens (brezplačno),
// sicer jih oceni iz dolžine besedila. Ne kliče modela in ne porablja dobroimetja.
import "../server/env.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSystemPrompt, systemBlocks } from "../server/prompt.js";
import { DEFAULT_SETTINGS } from "../server/settings.js";
import { PRICES, MODEL, MODEL_DEEP, getClient } from "../server/claude.js";
import { EUR_PER_USD } from "../server/usage.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const EUR = EUR_PER_USD();

// --- 1. Velikost sistemskega prompta ---------------------------------------
const blocks = systemBlocks(buildSystemPrompt({ settings: DEFAULT_SETTINGS, weaknesses: ["ulomki"], studentName: "Ana" }));
const est = (s) => Math.round(s.length / 3); // slovensko besedilo: ~3 znaki na žeton (novejši tokenizator)
let staticTok = est(blocks[0].text);
let dynTok = est(blocks[1]?.text || "");
let counted = false;
if (process.env.ANTHROPIC_API_KEY) {
  try {
    const c = getClient();
    const n = async (system) => (await c.messages.countTokens({ model: MODEL, system, messages: [{ role: "user", content: "x" }] })).input_tokens;
    const both = await n(blocks);
    staticTok = await n([blocks[0]]);
    dynTok = both - staticTok;
    counted = true;
  } catch (e) {
    console.warn("count_tokens ni uspel, uporabim oceno:", e.message);
  }
}

// --- 2. Predpostavke o porabi -----------------------------------------------
// Žetoni na odgovor (z razmišljanjem). Haiku effort low ~600, Haiku effort high ~2000,
// Opus effort medium ~2000 (prej), effort low ~1100 (zdaj). Zgodovina: ~2500 žetonov pri Haikuju (10 izmenjav).
const T = { outChat: 600, outThink: 2000, outDeepBefore: 2000, outDeepAfter: 1100, histHaiku: 2500, histDeepFull: 4500, histDeepShort: 1500, newPerTurn: 450, image: 1450 };
// Delež klicev Opusa s hladnim predpomnilnikom za stalni del prompta: prej 5 minut (pogosto
// poteče), zdaj 1 ura (zapis stane 2× namesto 1,25×, a poteče redko).
const COLD = { before: { share: 0.6, write: 1.25 }, after: { share: 0.25, write: 2 } };

const P = (m) => PRICES[m];
const usd = (m, { input = 0, out = 0, read = 0, write = 0 }) => (input * P(m).in + out * P(m).out + read * P(m).cacheRead + write * P(m).cacheWrite) / 1e6;

// En odgovor po načinu.
function msgCost(kind, { shortDeepHistory }) {
  if (kind === "chat" || kind === "think") {
    return usd(MODEL, { read: staticTok + T.histHaiku, write: dynTok * 0.1 + T.newPerTurn, out: kind === "think" ? T.outThink : T.outChat });
  }
  const now = shortDeepHistory; // »zdaj« = nove nastavitve
  const hist = now ? T.histDeepShort : T.histDeepFull;
  const cold = now ? COLD.after : COLD.before;
  // Opus: stalni del je predpomnjen (topel ali hladen), zgodovina je pri Opusu vedno nova.
  return (
    usd(MODEL_DEEP, { read: staticTok * (1 - cold.share), write: dynTok + hist, out: now ? T.outDeepAfter : T.outDeepBefore }) +
    (staticTok * cold.share * P(MODEL_DEEP).in * cold.write) / 1e6
  );
}

// Profil učenca na mesec.
const PROFILES = {
  "Tipičen učenec (20 dni × 10 vprašanj, 10 % podrobne razlage)": { days: 20, perDay: 10, deepShare: 0.1, help: 0.15, pathStart: 0.05, competition: false },
  "Zelo aktiven učenec (25 dni × 30 vprašanj, 25 % podrobne razlage)": { days: 25, perDay: 30, deepShare: 0.25, help: 0.15, pathStart: 0.05, competition: false },
  "Tekmovalec (20 dni × 15 vprašanj, program Tekmovanja)": { days: 20, perDay: 15, deepShare: 0.05, help: 0.1, pathStart: 0.05, competition: true },
};

function monthCost(p, after) {
  const total = p.days * p.perDay;
  let deep = total * p.deepShare;
  let chat = total - deep;
  let think = 0;
  if (p.competition) {
    if (after) {
      think = chat; // Tekmovanja: Haiku z več razmisleka namesto Opusa
      chat = 0;
    } else {
      deep += chat; // prej: vsi odgovori v programu Tekmovanja z Opusom
      chat = 0;
    }
  }
  if (after) {
    // Opus največ 5× na dan, nato Haiku z več razmisleka.
    const capped = Math.min(deep, p.days * 5);
    think += deep - capped;
    deep = capped;
    // Vadnica: prvi odgovor sestavi koda; začetek teme učne poti: ~50 % iz shranjenih odgovorov.
    const saved = total * p.help + total * p.pathStart * 0.5;
    chat = Math.max(0, chat - saved);
  }
  const photos = total * 0.1 * usd(MODEL, { write: T.image });
  let c =
    chat * msgCost("chat", { shortDeepHistory: after }) +
    think * msgCost("think", { shortDeepHistory: after }) +
    deep * msgCost("deep", { shortDeepHistory: after }) +
    photos;
  // Mesečna mehka meja (1 $): nad njo podrobne razlage pripravi Haiku.
  if (after && c > 1) {
    const over = c - 1;
    const perDeep = msgCost("deep", { shortDeepHistory: true }) - msgCost("think", { shortDeepHistory: true });
    const moved = Math.min(deep, over / msgCost("deep", { shortDeepHistory: true }));
    c -= moved * perDeep;
  }
  return c;
}

const eur = (x, d = 2) => `${(x * EUR).toFixed(d)} €`;
console.log(`Sistemski prompt: stalni del ${staticTok} žetonov, nastavitve učenca ${dynTok} žetonov (${counted ? "count_tokens" : "ocena iz dolžine besedila"}).`);
console.log(`Cene (USD / milijon žetonov): Haiku ${P(MODEL).in}/${P(MODEL).out}, Opus ${P(MODEL_DEEP).in}/${P(MODEL_DEEP).out}; 1 $ = ${EUR} €.`);
console.log(`En odgovor: Haiku ${eur(msgCost("chat", {}), 4)} · Haiku z več razmisleka ${eur(msgCost("think", {}), 4)} · Opus prej ${eur(msgCost("deep", { shortDeepHistory: false }), 4)} · Opus zdaj ${eur(msgCost("deep", { shortDeepHistory: true }), 4)}\n`);
console.log("Strošek AI na učenca na mesec:");
for (const [name, p] of Object.entries(PROFILES)) {
  console.log(`- ${name}: prej ${eur(monthCost(p, false))}, zdaj ${eur(monthCost(p, true))}`);
}

// --- 3. Dejanska poraba iz baze ---------------------------------------------
if (process.argv.includes("--db")) {
  const file = process.env.EVKLID_DB || path.join(here, "..", "data", "evklid.db");
  if (!fs.existsSync(file)) {
    console.log(`\nBaze ${file} ni.`);
  } else {
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(file, { readOnly: true });
    const rows = db
      .prepare(
        `SELECT model, kind, COUNT(*) AS n, AVG(input_tokens) AS inp, AVG(output_tokens) AS out, AVG(cache_read_tokens) AS rd,
                AVG(cache_write_tokens) AS wr, SUM(cost_usd) AS usd
         FROM usage WHERE created_at >= date('now','start of month') GROUP BY model, kind ORDER BY usd DESC`,
      )
      .all();
    const students = db.prepare("SELECT COUNT(DISTINCT student_id) AS n FROM usage WHERE created_at >= date('now','start of month')").get().n;
    console.log(`\nDejanska poraba ta mesec (${students} učencev):`);
    for (const r of rows) {
      console.log(`- ${r.model} · ${r.kind}: ${r.n}× · povprečno vhod ${Math.round(r.inp)}, izhod ${Math.round(r.out)}, iz predpomnilnika ${Math.round(r.rd)}, zapis ${Math.round(r.wr)} · skupaj ${eur(r.usd)}`);
    }
    const total = rows.reduce((a, r) => a + r.usd, 0);
    if (students) console.log(`Povprečno na učenca: ${eur(total / students)}`);
  }
}
