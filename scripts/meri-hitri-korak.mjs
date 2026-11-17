// Meritev poskusa »hitri korak« (server/hitri-korak.js, EVKLID_HITRI_KORAK): isti prvi korak pri lahki nalogi
// z razmišljanjem modela (kot zdaj) in brez njega. Za vsako nalogo oba klica zapored (vrstni red se izmenjuje), z istim
// pozivom, orodji, skrito opombo reševalnika in filtrom izpisa kot inštruktor (server/claude.js streamReply).
// Meri: čas do prvega besedila, do konca, strošek; kakovost s kodo kot v klepetu: blok RACUN (je, pade pri SymPy),
// »Popravek« iz kode (codeFindings) in ali odgovor v načinu A že izda končni rezultat (ne bi smel).
// Ne piše v bazo in ne šteje v porabo aplikacije (vidno samo v konzoli Anthropic).
// Zagon v lupini Renderja (tam je ključ API):
//   node scripts/meri-hitri-korak.mjs [--meja-usd 3] [--lahke 40] [--tezje 20] [--json pot.json]
// Ustavi se, preden bi strošek presegel --meja-usd (privzeto 3 $). Ocena: ~0,001 $ na klic (Haiku), 120 klicev ~0,15 $.
import fs from "node:fs";
import { buildSystemPrompt } from "../server/prompt.js";
import { streamReply, isMockMode, costUsd } from "../server/claude.js";
import { normalizeSettings } from "../server/settings.js";
import { SETTINGS_TOOLS } from "../server/chat-settings.js";
import { createStreamFilter, stripMeta } from "../server/meta.js";
import { presolve, withNote, codeFindings } from "../server/live-check.js";
import { hasClaimBlock, checkAnswerClaims } from "../server/racun.js";

const arg = (name, d) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : d;
};
const MEJA = Number(arg("--meja-usd", 3));
const NA_KLIC_NAJVEC = 0.02; // zgornja ocena enega klica (Haiku, ~20 tisoč žetonov poziva, hladen predpomnilnik)

// Lahke naloge (OŠ, en ali dva koraka) in težje (SŠ: kvadratne, sistemi, ulomki v enačbi). Vse reši naš reševalnik.
export const LAHKE = [
  "Izračunaj 3/4 + 5/6.", "Reši enačbo 3x + 7 = 22.", "Reši enačbo 5x - 9 = 16.", "Izračunaj 2/3 - 1/4.",
  "Izračunaj 7 · 8 - 6 · 9.", "Reši enačbo 4x = 2x + 10.", "Izračunaj (2/3) · (9/4) - 1/2.", "Izračunaj 2^5 - 3^3.",
  "Reši enačbo x - 12 = 31.", "Izračunaj 3/5 · 10/9.", "Reši enačbo 2(x + 4) = 18.", "Izračunaj 1,2 + 3,45 - 0,7.",
  "Izračunaj 45 : 9 + 6 · 3.", "Reši enačbo 7x + 3 = 5x + 11.", "Izračunaj 5/8 + 1/4.", "Izračunaj (-3) · (-7) + 4.",
  "Reši enačbo 6x - 4 = 20.", "Izračunaj 12 - 4 · (3 - 5).", "Izračunaj 3/7 : 9/14.", "Reši enačbo 9 - x = 4.",
  "Izračunaj 0,5 · 0,4 + 1,8.", "Reši enačbo x/2 + 3 = 8.", "Izračunaj 5/2 + 7/4.", "Izračunaj 10^3 - 10^2.",
  "Reši enačbo 3(x - 2) = 2x + 5.", "Izračunaj 7/12 - 1/3.", "Izračunaj -8 + 15 - 23.", "Reši enačbo 11x = 99.",
  "Izračunaj 4^2 + 3^2.", "Reši enačbo 5 + 2x = 3x - 1.", "Izračunaj 6/5 · 5/12.", "Izračunaj 100 - 3 · 27.",
  "Reši enačbo x/4 = 7.", "Izračunaj 1/2 + 1/3 + 1/6.", "Reši enačbo 8x - 3 = 5x + 9.", "Izračunaj (12 - 4) · (3 + 2).",
  "Izračunaj 24 : 6 - 3.", "Reši enačbo 4(x + 1) = 3x + 9.", "Izračunaj 3/4 · 8 - 5.", "Reši enačbo 2x + 3 = 11.",
];
export const TEZJE = [
  "Reši enačbo x^2 - 5x + 6 = 0.", "Reši enačbo 2x^2 + 3x - 2 = 0.", "Reši sistem x + y = 10, x - y = 2.", "Reši enačbo x/3 + x/4 = 14.",
  "Reši enačbo x^2 - 9 = 0.", "Reši sistem 2x + y = 7, x - y = -1.", "Reši enačbo 3x^2 - 12x = 0.", "Reši enačbo (x - 1)/2 = (x + 3)/6.",
  "Reši enačbo x^2 + 2x - 15 = 0.", "Reši sistem 3x - 2y = 4, x + y = 3.", "Reši enačbo 2(x - 3) = 4x + 8.", "Reši enačbo x^2 - 4x + 4 = 0.",
  "Reši enačbo 5x^2 = 20.", "Reši sistem x + 2y = 8, 3x - y = 3.", "Reši enačbo (2x + 1)/3 - (x - 2)/4 = 2.", "Reši enačbo x^2 - 7x + 10 = 0.",
  "Reši enačbo 4x^2 - 1 = 0.", "Reši sistem 2x - 3y = 1, 4x + y = 9.", "Reši enačbo 6x^2 - x - 2 = 0.", "Reši enačbo 3/(x) = 1/2.",
];

// Končni rezultat iz reševalnika kot števila (za grobo oceno, ali odgovor v načinu A že izda rešitev).
const stevila = (tex) => [...String(tex).replace(/\\frac\{(-?\d+)\}\{(\d+)\}/g, "$1/$2").replace(/\{,\}/g, ",").matchAll(/-?\d+(?:[.,]\d+)?(?:\/\d+)?/g)].map((m) => m[0]);
export const izda = (plain, pre) => {
  const cilj = pre.problems.flatMap((p) => stevila(p.answer).filter((x) => !/^[12]$/.test(x))); // indeksi x_1, x_2 ne štejejo
  if (!cilj.length) return false;
  const t = plain.replace(/\\frac\{(-?\d+)\}\{(\d+)\}/g, "$1/$2").replace(/\{,\}/g, ",");
  return cilj.every((x) => new RegExp(`(^|[^\\d,./])${x.replace(/[.\\/]/g, "\\$&")}($|[^\\d,/])`).test(t)) && /=\s*-?\d/.test(t);
};

const mediana = (a) => {
  const b = a.filter((x) => x != null).sort((x, y) => x - y);
  if (!b.length) return null;
  return b.length % 2 ? b[(b.length - 1) / 2] : (b[b.length / 2 - 1] + b[b.length / 2]) / 2;
};
const p90 = (a) => {
  const b = a.filter((x) => x != null).sort((x, y) => x - y);
  return b.length ? b[Math.min(b.length - 1, Math.ceil(0.9 * b.length) - 1)] : null;
};

async function klic({ system, text, pre, brez }) {
  const filter = createStreamFilter();
  let shown = "";
  const r = await streamReply({
    system,
    messages: withNote([{ role: "user", content: [{ type: "text", text }] }], pre.note),
    mode: "chat",
    tools: SETTINGS_TOOLS,
    onToolUse: async () => ({ content: "{}" }),
    noThinking: brez,
    onText: (c) => (shown += filter.push(c)),
  });
  const plain = stripMeta(r.text);
  let racun = null;
  if (hasClaimBlock(r.text)) {
    try {
      racun = (await checkAnswerClaims(r.text)).issue ? "pade" : "ok";
    } catch {
      racun = "napaka";
    }
  }
  return {
    besediloMs: r.timing?.firstTextMs ?? null,
    konecMs: r.timing?.totalMs ?? null,
    usd: r.usage ? costUsd(r.model, r.usage) : 0,
    izhod: r.usage?.output_tokens || 0,
    racun,
    popravek: !!codeFindings(plain, pre, text).issue,
    izda: izda(plain, pre),
  };
}

async function main() {
  if (isMockMode()) {
    console.error("Ni ključa API (preizkusni način): zaženi v lupini Renderja (ANTHROPIC_API_KEY).");
    process.exit(1);
  }
  const nL = Math.min(LAHKE.length, Number(arg("--lahke", 40)));
  const nT = Math.min(TEZJE.length, Number(arg("--tezje", 20)));
  const naloge = [...LAHKE.slice(0, nL).map((t) => ["lahka", t]), ...TEZJE.slice(0, nT).map((t) => ["tezja", t])];
  const sistem = {
    lahka: buildSystemPrompt({ settings: normalizeSettings({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" }), studentName: "Ana" }),
    tezja: buildSystemPrompt({ settings: normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik", subject: "MAT" }), studentName: "Ana" }),
  };
  const rez = [];
  let porabljeno = 0;
  let ustavljeno = false;
  for (const [i, [vrsta, text]] of naloge.entries()) {
    const pre = presolve(text, { first: true });
    if (!pre) {
      console.warn(`brez rešitve reševalnika (izpuščeno): ${text}`);
      continue;
    }
    for (const brez of i % 2 ? [true, false] : [false, true]) {
      if (porabljeno + NA_KLIC_NAJVEC > MEJA) {
        ustavljeno = true;
        break;
      }
      try {
        const r = await klic({ system: sistem[vrsta], text, pre, brez });
        porabljeno += r.usd;
        rez.push({ vrsta, text, brez, ...r });
        process.stderr.write(`${rez.length} ${vrsta} ${brez ? "brez" : "z    "} ${r.besediloMs} ms / ${r.konecMs} ms ${r.usd.toFixed(4)} $ (skupaj ${porabljeno.toFixed(3)} $)\n`);
      } catch (e) {
        console.warn(`napaka: ${text}: ${e?.message || e}`);
      }
    }
    if (ustavljeno) break;
  }
  const vrstica = (vrsta, brez) => {
    const r = rez.filter((x) => x.vrsta === vrsta && x.brez === brez);
    if (!r.length) return null;
    const delez = (f) => `${Math.round((100 * r.filter(f).length) / r.length)} %`;
    const s = (ms) => (ms == null ? "–" : `${(ms / 1000).toFixed(1).replace(".", ",")} s`);
    return `| ${vrsta} | ${brez ? "brez razmišljanja" : "z razmišljanjem"} | ${r.length} | ${s(mediana(r.map((x) => x.besediloMs)))} / ${s(p90(r.map((x) => x.besediloMs)))} | ${s(mediana(r.map((x) => x.konecMs)))} | ${(r.reduce((a, x) => a + x.usd, 0) / r.length).toFixed(4).replace(".", ",")} $ | ${delez((x) => x.racun)} | ${delez((x) => x.racun === "pade")} | ${delez((x) => x.popravek)} | ${delez((x) => x.izda)} |`;
  };
  const tabela = [
    "| naloge | klic | n | prvo besedilo (mediana / p90) | konec (mediana) | strošek na klic | ima RACUN | RACUN pade | Popravek (koda) | izda rezultat |",
    "|---|---|---|---|---|---|---|---|---|---|",
    ...["lahka", "tezja"].flatMap((v) => [vrstica(v, false), vrstica(v, true)]).filter(Boolean),
  ].join("\n");
  console.log(tabela);
  console.log(`\nSkupaj ${porabljeno.toFixed(3).replace(".", ",")} $${ustavljeno ? ` (ustavljeno pri meji ${MEJA} $)` : ""}.`);
  const out = arg("--json", null);
  if (out) fs.writeFileSync(out, JSON.stringify({ porabljeno, ustavljeno, rez }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
