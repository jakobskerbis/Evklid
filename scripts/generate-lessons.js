// Ustvari lekcije učbenika z Message Batches API (50 % ceneje) in jih shrani
// v content/lessons/<pot>/<tema>.md kot osnutke za učiteljev pregled.
// Ko so datoteke shranjene, jih aplikacija streže brezplačno.
//
//   node scripts/generate-lessons.js                    # ocena stroška za teme z vajami
//   node scripts/generate-lessons.js --all              # ocena za vse teme
//   node scripts/generate-lessons.js --yes              # zaženi (teme z vajami)
//   node scripts/generate-lessons.js --yes --path FIZ-OS-9 --limit 5
//   node scripts/generate-lessons.js --yes --model claude-sonnet-5-5
//   node scripts/generate-lessons.js --list             # izpiši id-je tem
//
// Obstoječih lekcij ne prepiše (dodaj --force). Vzorec sloga je
// content/lessons/MAT-OS-8/pitagorov-izrek.md.
import "../server/env.js";
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { listPaths, topicOrder, getPath } from "../server/curriculum.js";
import { LESSONS_DIR, loadLesson, simsFor } from "../server/textbook.js";
import { hasGenerator } from "../server/practice/index.js";
import { PRICES } from "../server/claude.js";

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};
const model = arg("--model") || process.env.EVKLID_LESSON_MODEL || "claude-opus-5-5";
const onlyPath = arg("--path");
const limit = Number(arg("--limit")) || Infinity;
const force = args.includes("--force");
const all = args.includes("--all");

const topics = listPaths()
  .filter((p) => !onlyPath || p.key === onlyPath)
  .flatMap((p) => topicOrder(p.key))
  .filter((t) => all || onlyPath || hasGenerator(t.id))
  .filter((t) => force || !loadLesson(t.id))
  .slice(0, limit);

if (args.includes("--list")) {
  for (const t of topics) console.log(t.id);
  process.exit(0);
}

const SAMPLE = fs.readFileSync(path.join(LESSONS_DIR, "MAT-OS-8", "pitagorov-izrek.md"), "utf8");
const FORMAT = fs.readFileSync(path.join(LESSONS_DIR, "README.md"), "utf8");

const SYSTEM = `Si izkušena slovenska učiteljica matematike, fizike in kemije. Pišeš lekcije za spletni učbenik Evklid v slovenščini (tikanje učenca).

Lekcija naj bo tako podrobna kot dobra učna ura povprečne učiteljice: navezava na predznanje in zakaj se snov učimo, definicije, razlaga po korakih, 2–3 rešeni primeri od lažjega do težjega (vsak korak z »zakaj«), pogoste napake, kratek povzetek. Dodaj 3–4 razlage z drugega zornega kota (razdelki »## Drugače: …«): na sliki/vizualno, iz vsakdanjega življenja ali z analogijo, korak za korakom s številkami ali tabelo, bolj natančno/formalno (dokaz ali ozadje). Na koncu 3 vprašanja izbirnega tipa v razdelku »## Preveri se«; napačni odgovori naj bodo tipične napake, pojasnilo pa naj pove, zakaj je pravilni odgovor pravilen.

Pravila:
- Upoštevaj raven razreda/letnika in ne uporabljaj snovi, ki je učenec še ni obravnaval. Drži se slovenske terminologije učnih načrtov.
- Formule v LaTeX ($...$ in $$...$$), decimalna vejica ($3{,}5$), enote pokončno ($\\,\\text{m}$ ali $\\mathrm{m}$), kemijske formule z \\mathrm.
- Ne izmišljuj si podatkov. Če nečesa nisi prepričana, tega ne piši.
- Pred oddajo preveri vsak račun, vsako števko in vsako trditev v rešenih primerih (npr. koliko mest ima število).
- V »Preveri se« ima vsako vprašanje natanko en odgovor s »+« in 2–3 z »-«; vsi odgovori so med seboj različni in kratki (brez pojasnil v samem odgovoru). Preveri, da je odgovor s »+« res pravilen.
- Brez emojijev. Brez uvodnega ali zaključnega nagovora zunaj lekcije.
- Odgovori SAMO z vsebino datoteke .md, začni z vrstico "---".

Oblika datoteke:
${FORMAT}

Vzorčna lekcija (slog in podrobnost):
${SAMPLE}`;

function userPrompt(t) {
  const p = getPath(t.path);
  const sims = simsFor(t.id, null);
  return `Napiši lekcijo za učno pot »${p.label}«.
Sklop: ${t.unit}
Tema: ${t.name}
Cilji: ${t.goals}
${sims.length ? `Za rešenimi primeri bodo interaktivne simulacije: ${sims.map((d) => `»${d.title}«`).join(", ")}. V razdelku »Drugače: Na sliki« se nanje sklicuj kot na »simulacijo spodaj«.` : ""}
V glavi zapiši "stanje: osnutek" in "avtor: AI (${model})".`;
}

// Groba ocena: ~7000 vhodnih (sistem + vzorec) in ~6000 izhodnih žetonov (z razmišljanjem) na lekcijo, Batch = 50 %.
const est = (m) => {
  const pr = PRICES[m];
  return (topics.length * (7000 * pr.in + 6000 * pr.out)) / 1e6 / 2;
};
console.log(`Tem brez lekcije: ${topics.length}.`);
for (const m of ["claude-opus-5-5", "claude-sonnet-5-5", "claude-haiku-5-5"]) console.log(`  ${m}: ~${est(m).toFixed(2)} $`);
console.log(`Izbran model: ${model}.`);
if (!args.includes("--yes")) {
  console.log("Za zagon dodaj --yes. Za seznam tem --list.");
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
      max_tokens: 16000,
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
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
let ok = 0;
const spent = { in: 0, out: 0, cacheRead: 0, cacheWrite: 0 };
for await (const result of await client.messages.batches.results(batch.id)) {
  const topic = byCustom[result.custom_id];
  if (result.result.type !== "succeeded") {
    console.warn(`  ${topic.id}: ${result.result.type}`);
    continue;
  }
  const msg = result.result.message;
  const u = msg.usage || {};
  spent.in += u.input_tokens || 0;
  spent.out += u.output_tokens || 0;
  spent.cacheRead += u.cache_read_input_tokens || 0;
  spent.cacheWrite += u.cache_creation_input_tokens || 0;
  if (msg.stop_reason === "refusal" || msg.stop_reason === "max_tokens") {
    console.warn(`  ${topic.id}: ${msg.stop_reason}`);
    continue;
  }
  let text = msg.content.filter((c) => c.type === "text").map((c) => c.text).join("").trim();
  text = text.replace(/^```(?:markdown|md)?\n/, "").replace(/\n```$/, "");
  if (!text.startsWith("---") || !/^## Preveri se/m.test(text)) {
    console.warn(`  ${topic.id}: nepopolna oblika, preskočeno`);
    continue;
  }
  const [pathKey, slug] = topic.id.split("/");
  fs.mkdirSync(path.join(LESSONS_DIR, pathKey), { recursive: true });
  fs.writeFileSync(path.join(LESSONS_DIR, pathKey, `${slug}.md`), text + "\n");
  ok++;
}
const pr = PRICES[model] || PRICES["claude-opus-5-5"];
const cost = (spent.in * pr.in + spent.out * pr.out + spent.cacheRead * pr.cacheRead + spent.cacheWrite * pr.cacheWrite) / 1e6 / 2;
console.log(`Poraba: ${spent.in} vh., ${spent.out} izh., predpomnilnik ${spent.cacheRead}/${spent.cacheWrite} žetonov ≈ ${cost.toFixed(3)} $ (Batch, -50 %).`);
console.log(`Shranjenih ${ok} lekcij v ${LESSONS_DIR}. Preglej jih (npm test preveri obliko), nato v glavi nastavi "stanje: pregledano".`);
