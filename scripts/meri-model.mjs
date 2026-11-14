// Čas pravega modela (D6, del »česa nisem preveril«): čas do prvega besedila in do konca odgovora za kratka
// vprašanja maturanta, z istim pozivom in istim klicem kot inštruktor (server/prompt.js, server/claude.js
// streamReply). Ne piše v bazo, ne ustvari računa in ne šteje v meritve pilota; strošek ~1 cent.
// Zagon v lupini Renderja (tam je ključ API): node scripts/meri-model.mjs [število vprašanj, privzeto 6, največ 10]
import { buildSystemPrompt } from "../server/prompt.js";
import { streamReply, isMockMode, MODEL, costUsd } from "../server/claude.js";
import { normalizeSettings } from "../server/settings.js";

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
const n = Math.min(Math.max(Number(process.argv[2]) || 6, 1), VPRASANJA.length);
const system = buildSystemPrompt({ settings: normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik" }), weaknesses: [], studentName: "Ana", results: "", schedule: "" });
const vrstice = [];
let skupaj = 0;
for (let i = 0; i < n; i++) {
  const t0 = performance.now();
  let prvi = null;
  let znakov = 0;
  const r = await streamReply({
    system,
    messages: [{ role: "user", content: VPRASANJA[i] }],
    onText: (t) => {
      if (prvi === null) prvi = performance.now() - t0;
      znakov += t.length;
    },
  });
  const konec = performance.now() - t0;
  const usd = costUsd(r.model || MODEL, r.usage || {});
  skupaj += usd;
  vrstice.push({ prvi: Math.round(prvi ?? konec), konec: Math.round(konec), znakov });
  console.log(`${i + 1}. prvo besedilo ${Math.round(prvi ?? konec)} ms, konec ${Math.round(konec)} ms, ${znakov} znakov`);
}
const sred = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
console.log(`\nModel ${MODEL}, ${n} vprašanj. Mediana: prvo besedilo ${sred(vrstice.map((v) => v.prvi))} ms, konec ${sred(vrstice.map((v) => v.konec))} ms. Strošek ${skupaj.toFixed(4)} $.`);
