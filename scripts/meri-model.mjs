// Čas pravega modela (D6, del »česa nisem preveril«): koliko časa učenec čaka na prvo besedilo in na konec odgovora
// pri prvem sporočilu v pogovoru, z istim pozivom, orodji in filtrom izpisa kot inštruktor (server/prompt.js,
// server/chat-settings.js, server/meta.js, server/claude.js streamReply; brez skrite opombe lekcije). Meri oba
// načina: »think« (dijak SŠ z naročnino, usage.chooseMode) in »chat« (brezplačni paket in OŠ). Prvi klic posebej
// (hladen predpomnilnik poziva), nato mediana ostalih (topel predpomnilnik). Ne piše v bazo, ne ustvari računa in ne
// šteje v meritve pilota ali porabo aplikacije (vidno samo v konzoli Anthropic); strošek nekaj centov (izpiše ga).
// Zagon v lupini Renderja (tam je ključ API): node scripts/meri-model.mjs [vprašanj na način, privzeto 5, od 2 do 10]
import { buildSystemPrompt } from "../server/prompt.js";
import { streamReply, isMockMode, modeParams, costUsd, apiErrorCode } from "../server/claude.js";
import { normalizeSettings } from "../server/settings.js";
import { SETTINGS_TOOLS } from "../server/chat-settings.js";
import { createStreamFilter } from "../server/meta.js";

if (isMockMode()) {
  console.error("Ni ključa API (preizkusni način): zaženi v lupini Renderja.");
  process.exit(1);
}
const VPRASANJA = [
  "Kako rešim enačbo 2x + 3 = 11?",
  "Kaj je odvod funkcije f(x) = x^2 sin x?",
  "Koliko je vsota prvih 20 členov aritmetičnega zaporedja s prvim členom 3 in diferenco 4?",
  "Kako izračunam ploščino trikotnika s stranicama 5 cm in 7 cm ter vmesnim kotom 60°?",
  "Kaj pomeni, da je funkcija soda?",
  "Kako rešim neenačbo x^2 - 5x + 6 < 0?",
  "Kaj je logaritem in kako izračunam log_2 32?",
  "Kako najdem presečišče premic y = 2x + 1 in y = -x + 4?",
  "Kaj je kombinacija in koliko je 5 nad 2?",
  "Kako izračunam prostornino valja z r = 3 cm in v = 10 cm?",
];
const NACINI = [
  ["think", "srednja šola z naročnino"],
  ["chat", "brezplačno ali osnovna šola"],
];
const n = Math.min(Math.max(Number(process.argv[2]) || 5, 2), VPRASANJA.length);
const system = buildSystemPrompt({ settings: normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik" }), weaknesses: [], studentName: "Ana", results: "", schedule: "" });
const s = (ms) => `${(ms / 1000).toFixed(1).replace(".", ",")} s`;
const mediana = (a) => {
  const b = [...a].sort((x, y) => x - y);
  return b.length % 2 ? b[(b.length - 1) / 2] : (b[b.length / 2 - 1] + b[b.length / 2]) / 2;
};
let skupaj = 0;
const povzetek = [];
for (const [mode, opis] of NACINI) {
  const { model, effort } = modeParams(mode);
  console.log(`\nNačin ${mode} (${opis}; ${model}, effort ${effort}):`);
  const meritve = [];
  for (let i = 0; i < n; i++) {
    const t0 = performance.now();
    const filter = createStreamFilter(); // kot app.js: zadrži uvodno frazo in skrije META
    let prvi = null;
    try {
      const r = await streamReply({
        system,
        mode,
        tools: SETTINGS_TOOLS, // kot v aplikaciji (ista predpona predpomnilnika); brez onToolUse se orodje ne izvede
        messages: [{ role: "user", content: VPRASANJA[i] }],
        onText: (t) => {
          if (prvi === null && filter.push(t)) prvi = performance.now() - t0;
        },
      });
      const konec = performance.now() - t0;
      skupaj += costUsd(r.model || model, r.usage || {});
      const u = r.usage || {};
      const predpomnilnik = u.cache_read_input_tokens ? "topel" : u.cache_creation_input_tokens ? "hladen" : "brez";
      const opomba = r.stopReason === "tool_use" ? ", klic orodja (ne šteje)" : prvi === null ? ", brez besedila (ne šteje)" : "";
      console.log(`  ${i + 1}. prvo besedilo ${prvi === null ? "–" : s(prvi)}, konec ${s(konec)}, predpomnilnik ${predpomnilnik}${opomba}`);
      if (!opomba) meritve.push({ prvi, konec });
    } catch (e) {
      if (e?.usage) skupaj += costUsd(e.model || model, e.usage);
      console.log(`  ${i + 1}. napaka: ${apiErrorCode(e) || e.message}`);
    }
  }
  const [hladen, ...topli] = meritve;
  const vrstica = [`Način ${mode} (${opis}):`];
  if (hladen) vrstica.push(`prvi klic ${s(hladen.prvi)} do prvega besedila, ${s(hladen.konec)} do konca;`);
  if (topli.length) vrstica.push(`nato običajno (mediana) ${s(mediana(topli.map((m) => m.prvi)))} do prvega besedila, ${s(mediana(topli.map((m) => m.konec)))} do konca.`);
  if (!meritve.length) vrstica.push("brez uspešnih meritev.");
  povzetek.push(vrstica.join(" "));
}
console.log(`\nPovzetek (prvo sporočilo v pogovoru):\n${povzetek.join("\n")}\nStrošek ${skupaj.toFixed(4)} $.\nPrilepi celoten izpis nazaj v pogovor.`);
