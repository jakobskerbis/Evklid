// Ustvari razlage vseh tem učnih poti z Message Batches API (50 % ceneje)
// in jih shrani v content/explanations.json. Zaženeš enkrat; nato jih
// aplikacija streže brezplačno.
//
//   node scripts/generate-explanations.js                 # ocena stroška
//   node scripts/generate-explanations.js --yes           # zaženi za vse teme
//   node scripts/generate-explanations.js --yes --path MAT-OS-8
//   node scripts/generate-explanations.js --yes --model claude-sonnet-5-5
//
// Že obstoječe razlage preskoči (dodaj --force, da jih ustvari znova).
import "../server/env.js";
import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { listPaths, topicOrder, getPath } from "../server/curriculum.js";
import { EXPLANATIONS_PATH, loadExplanations } from "../server/explanations.js";
import { PRICES } from "../server/claude.js";

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};
const model = arg("--model") || process.env.EVKLID_EXPLAIN_MODEL || "claude-opus-5-5";
const onlyPath = arg("--path");
const force = args.includes("--force");

const existing = loadExplanations();
const topics = listPaths()
  .filter((p) => !onlyPath || p.key === onlyPath)
  .flatMap((p) => topicOrder(p.key))
  .filter((t) => force || !existing[t.id]);

const SYSTEM = `Si izkušen slovenski učitelj matematike, fizike in kemije. Pišeš kratke, natančne razlage za učence v slovenščini (tikanje). Formule piši v LaTeX ($...$), z decimalno vejico ($3{,}5$) in enotami pokončno. Upoštevaj raven razreda/letnika in ne uporabljaj snovi, ki je učenec še ni obravnaval. Ne izmišljuj si podatkov.`;

function userPrompt(t) {
  const p = getPath(t.path);
  return `Napiši razlago teme za učno pot »${p.label}«.
Sklop: ${t.unit}
Tema: ${t.name}
Cilji: ${t.goals}

Oblika (Markdown, skupaj največ ~350 besed):
### Najprej pomisli
Eno kratko vprašanje za priklic predznanja (brez odgovora).
### Bistvo
Jedro teme v 3–6 kratkih točkah ali odstavkih. Kjer pomaga, preprosta tabela ali opis skice.
### Rešen zgled
Ena tipična naloga, rešena po oštevilčenih korakih, vsak korak z »zakaj«.
### Pogoste napake
2–3 točke.
### Preveri se
Dve kratki vprašanji. Odgovor vsakega zapiši v <details><summary>Odgovor</summary>…</details>.`;
}

// Groba ocena: ~600 vhodnih in ~1500 izhodnih žetonov (z razmišljanjem) na temo, Batch = 50 %.
const price = PRICES[model] || PRICES["claude-opus-5-5"];
const estimate = (topics.length * (600 * price.in + 1500 * price.out)) / 1e6 / 2;
console.log(`Tem brez razlage: ${topics.length}. Model: ${model}. Ocena stroška: ~${estimate.toFixed(2)} $ (Batch API, -50 %).`);
if (!args.includes("--yes")) {
  console.log("Za zagon dodaj --yes.");
  process.exit(0);
}
if (!topics.length) process.exit(0);

const client = new Anthropic();
const ids = topics.map((t, i) => ({ custom: `t${i}`, topic: t }));
const batch = await client.messages.batches.create({
  requests: ids.map(({ custom, topic }) => ({
    custom_id: custom,
    params: {
      model,
      max_tokens: 8000,
      system: SYSTEM,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      messages: [{ role: "user", content: userPrompt(topic) }],
    },
  })),
});
console.log(`Paket ${batch.id} poslan. Čakam na rezultate (običajno do 1 ure) ...`);

let b;
for (;;) {
  b = await client.messages.batches.retrieve(batch.id);
  if (b.processing_status === "ended") break;
  console.log(`  v obdelavi: ${b.request_counts.processing}, končanih: ${b.request_counts.succeeded}`);
  await new Promise((r) => setTimeout(r, 60_000));
}

const byCustom = Object.fromEntries(ids.map((x) => [x.custom, x.topic]));
const out = loadExplanations();
let ok = 0;
for await (const result of await client.messages.batches.results(batch.id)) {
  const topic = byCustom[result.custom_id];
  if (result.result.type !== "succeeded") {
    console.warn(`  ${topic.id}: ${result.result.type}`);
    continue;
  }
  const msg = result.result.message;
  if (msg.stop_reason === "refusal") {
    console.warn(`  ${topic.id}: zavrnjeno`);
    continue;
  }
  const text = msg.content.filter((c) => c.type === "text").map((c) => c.text).join("").trim();
  if (text) {
    out[topic.id] = { text, model, created: new Date().toISOString().slice(0, 10) };
    ok++;
  }
}
fs.writeFileSync(EXPLANATIONS_PATH, JSON.stringify(out, null, 1));
console.log(`Shranjenih ${ok} razlag v ${EXPLANATIONS_PATH}. Preglej jih, preden jih daš učencem.`);
