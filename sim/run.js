#!/usr/bin/env node
// Digitalni razred: simulirani učenci se pogovarjajo z inštruktorjem Evklid,
// ocenjevalec oceni vsak pogovor, na koncu nastane poročilo.
//
//   node sim/run.js                       vsi učenci, lokalni inštruktor (ista koda in prompt)
//   node sim/run.js --ucenci ziga,lana    samo izbrani
//   node sim/run.js --primerjaj sim-results/referenca   primerjava z referenčnim zagonom
//   node sim/run.js --tutor http --url https://….ngrok-free.dev --email … --geslo-racuna …
//   node sim/run.js --seznam              seznam učencev
// Vse možnosti: node sim/run.js --pomoc
import "../server/env.js";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { PERSONAS, findPersonas } from "./personas.js";
import { LlmStudent, ScriptedStudent } from "./student.js";
import { createTutor } from "./tutor.js";
import { checkReply, checkConversation, wordCount } from "./checks.js";
import { judgeConversation } from "./judge.js";
import { hasCredentials, setEngine, defaultEngine } from "./llm.js";
import { hasClaude } from "./cli.js";
import { summarize, compare, markdownReport, transcriptMarkdown, htmlReport } from "./report.js";

const HELP = `Digitalni razred – simulacija prvih uporabnikov inštruktorja Evklid

Možnosti:
  --ucenci <id,id|all>       katere učence (privzeto all; glej --seznam)
  --ponovitve <n>            vsak učenec n-krat z drugim semenom (privzeto 1)
  --max-potez <n>            največ sporočil učenca (privzeto po osebnosti)
  --vzporedno <n>            hkratnih pogovorov (privzeto 3)
  --seme <n>                 seme za tipkarske napake (privzeto 1)
  --tutor local|http         lokalno (privzeto) ali tekoča aplikacija prek spleta
  --url <naslov>             naslov aplikacije za --tutor http
  --geslo <geslo>            geslo testne različice (EVKLID_PASSWORD)
  --email, --geslo-racuna    testni račun, če ima aplikacija prijavo staršev
  --motor cli|api            cli = prek Claude Code (porablja omejitev naročnine Claude, privzeto,
                             če je \`claude\` nameščen in prijavljen); api = Claude API s ključem
  --motor-instruktorja cli|api  inštruktor posebej (privzeto kot --motor); api = natanko kot v
                             aplikaciji (Haiku, ~0,03 $ na razred), cli = približek prek naročnine
  --mock                     lokalni inštruktor v preizkusnem načinu (brez modela)
  --skripta                  vnaprej napisani učenci namesto modela (brez API ključa)
  --model-ucenca <id>        privzeto claude-opus-5-5
  --effort-ucenca <raven>    privzeto medium
  --model-ocenjevalca <id>   privzeto claude-opus-5-5
  --effort-ocenjevalca <r>   privzeto high
  --brez-ocene               brez ocenjevalca (samo pogovori in samodejna preverjanja)
  --izhod <mapa>             privzeto sim-results/<datum-čas>
  --primerjaj <mapa>         primerjaj z rezultati.json prejšnjega zagona
  --seznam                   izpiši učence in končaj
  --pomoc                    ta pomoč

Naročnina (--motor cli): Claude Code mora biti nameščen (npm install -g @anthropic-ai/claude-code)
in prijavljen (zaženi \`claude\` in se prijavi). Učenci, ocenjevalec in lokalni inštruktor takrat
tečejo prek naročnine; API ključ se ne uporabi.
API (--motor api): ANTHROPIC_API_KEY (prebere se tudi iz .env, kot pri aplikaciji).`;

/**
 * En pogovor učenca z inštruktorjem.
 * @returns {Promise<object>} pogovor z učenčevimi potezami, odgovori, preverjanji in razlogom za konec
 */
export async function runConversation({ persona, student, tutor, maxTurns, key, log = () => {} }) {
  const session = await tutor.start(persona);
  const conv = { key, persona, settings: session.settings, turns: [], endReason: "največ potez", cost: { student: 0, tutor: 0, judge: 0 } };
  const limit = Math.min(maxTurns || persona.maxPotez, 30);
  for (let i = 0; i < limit; i++) {
    let s;
    try {
      s = await student.next(conv.turns);
    } catch (err) {
      conv.endReason = `napaka učenca: ${err.message}`;
      break;
    }
    conv.turns.push({ role: "student", ...s });
    if (s.action === "odidi") {
      conv.endReason = "učenec je odšel";
      break;
    }
    const deep = s.action === "podrobneje";
    log(`${persona.ime} › ${deep ? "[Razloži podrobneje]" : s.text.slice(0, 70)}`);
    const r = await session.send(s.text, { deep });
    const turn = { role: "tutor", text: r.text, raw: r.raw ?? null, error: r.error ?? null, deep, words: wordCount(r.text), costUsd: r.costUsd ?? null, model: r.model ?? null };
    turn.turn = conv.turns.filter((t) => t.role === "tutor").length + 1;
    turn.checks = checkReply(turn, { persona, settings: session.settings });
    conv.turns.push(turn);
    conv.cost.tutor += r.costUsd || 0;
    if (r.error) {
      conv.endReason = `napaka inštruktorja: ${r.error}`;
      break;
    }
  }
  conv.cost.student = student.cost || 0;
  conv.convChecks = checkConversation(conv.turns, persona, { scripted: student instanceof ScriptedStudent });
  conv.allChecks = [...conv.turns.flatMap((t) => t.checks || []), ...conv.convChecks];
  return conv;
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.max(1, Math.min(n, items.length)) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

const stamp = () => new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);
// Pogovor brez razčlenjene osebnosti (za JSON): osebnost je v personas.js, shranimo samo id.
const serializable = (c) => ({ ...c, persona: { id: c.persona.id, ime: c.persona.ime, starost: c.persona.starost, test: c.persona.test } });

export async function main(argv = process.argv.slice(2)) {
  const { values: o } = parseArgs({
    args: argv,
    options: {
      ucenci: { type: "string", default: "all" },
      ponovitve: { type: "string", default: "1" },
      "max-potez": { type: "string" },
      vzporedno: { type: "string", default: "3" },
      seme: { type: "string", default: "1" },
      tutor: { type: "string", default: "local" },
      url: { type: "string" },
      geslo: { type: "string" },
      email: { type: "string" },
      "geslo-racuna": { type: "string" },
      motor: { type: "string" },
      "motor-instruktorja": { type: "string" },
      mock: { type: "boolean", default: false },
      skripta: { type: "boolean", default: false },
      "model-ucenca": { type: "string", default: "claude-opus-5-5" },
      "effort-ucenca": { type: "string", default: "medium" },
      "model-ocenjevalca": { type: "string", default: "claude-opus-5-5" },
      "effort-ocenjevalca": { type: "string", default: "high" },
      "brez-ocene": { type: "boolean", default: false },
      izhod: { type: "string" },
      primerjaj: { type: "string" },
      seznam: { type: "boolean", default: false },
      pomoc: { type: "boolean", default: false },
    },
  });
  if (o.pomoc) return console.log(HELP);
  if (o.seznam) {
    for (const p of PERSONAS) console.log(`${p.id.padEnd(24)} ${p.ime}, ${p.starost} let, ${p.settings.curriculum_level} ${p.settings.subject} – preizkus: ${p.test}`);
    return;
  }

  const engine = o.motor || defaultEngine();
  if (engine === "cli" && !hasClaude()) throw new Error("--motor cli: Claude Code (ukaz `claude`) ni nameščen ali ni v PATH.");
  if (engine === "api" && !hasCredentials()) throw new Error("--motor api: manjka ANTHROPIC_API_KEY.");
  if (engine) setEngine(engine);
  const keyOk = !!engine;
  const scripted = o.skripta || !keyOk;
  const judge = !o["brez-ocene"] && keyOk && !scripted;
  if (!keyOk) console.warn("Ni Claude Code in ne ANTHROPIC_API_KEY: učenci so vnaprej napisani, ocene ni, lokalni inštruktor je v preizkusnem načinu.");

  const personas = findPersonas(o.ucenci);
  const reps = Math.max(1, Number(o.ponovitve) || 1);
  const jobs = personas.flatMap((p) => Array.from({ length: reps }, (_, r) => ({ p, r, key: reps > 1 ? `${p.id}-${r + 1}` : p.id })));
  const out = path.resolve(o.izhod || path.join("sim-results", stamp()));
  fs.mkdirSync(path.join(out, "pogovori"), { recursive: true });

  const tutorEngine = o["motor-instruktorja"] || (engine === "cli" && hasCredentials() ? "api" : engine);
  if (tutorEngine === "api" && !hasCredentials()) throw new Error("--motor-instruktorja api: manjka ANTHROPIC_API_KEY.");
  const tutor = await createTutor({ kind: o.tutor, mock: o.mock, engine: o.mock || scripted ? null : tutorEngine, url: o.url, password: o.geslo, email: o.email, accountPassword: o["geslo-racuna"] });
  const started = new Date().toISOString();
  const engineLabel = engine === "cli" ? "Claude Code (naročnina)" : engine === "api" ? "Claude API (ključ)" : "brez modela";
  console.log(`Motor: ${engineLabel}\nInštruktor: ${tutor.label}\nUčenci: ${scripted ? "vnaprej napisani" : o["model-ucenca"]} · ocenjevalec: ${judge ? o["model-ocenjevalca"] : "brez"}\nPogovorov: ${jobs.length} → ${out}\n`);

  const convs = await pool(jobs, Number(o.vzporedno) || 3, async ({ p, r, key }) => {
    const seed = Number(o.seme) + r;
    const student = scripted ? new ScriptedStudent(p, { seed }) : new LlmStudent(p, { model: o["model-ucenca"], effort: o["effort-ucenca"], seed });
    let conv;
    try {
      conv = await runConversation({ persona: p, student, tutor, maxTurns: Number(o["max-potez"]) || null, key, log: (m) => console.log(`  ${m}`) });
    } catch (err) {
      console.error(`✗ ${p.ime}: ${err.message}`);
      conv = { key, persona: p, settings: p.settings, turns: [], endReason: `napaka: ${err.message}`, allChecks: [], convChecks: [], cost: {} };
    }
    if (judge && conv.turns.length) {
      try {
        conv.judge = await judgeConversation(conv, { model: o["model-ocenjevalca"], effort: o["effort-ocenjevalca"] });
        conv.cost.judge = conv.judge.cost;
      } catch (err) {
        console.error(`✗ ocena ${p.ime}: ${err.message}`);
      }
    }
    fs.writeFileSync(path.join(out, "pogovori", `${key}.json`), JSON.stringify(serializable(conv), null, 2));
    fs.writeFileSync(path.join(out, "pogovori", `${key}.md`), transcriptMarkdown(conv));
    console.log(`✓ ${p.ime} (${key}): ${conv.turns.filter((t) => t.role === "tutor").length} odgovorov, ${conv.endReason}${conv.judge ? `, ocena ${conv.judge.ocena}/5` : ""}`);
    return conv;
  });
  await tutor.close();

  const summary = summarize(convs, {
    zacetek: started,
    izhod: out,
    instruktor: tutor.label,
    motor: engineLabel,
    modelUcenca: scripted ? "vnaprej napisani" : o["model-ucenca"],
    modelOcenjevalca: judge ? o["model-ocenjevalca"] : "brez",
  });
  let base = null;
  if (o.primerjaj) {
    const f = path.resolve(o.primerjaj, fs.existsSync(path.resolve(o.primerjaj, "rezultati.json")) ? "rezultati.json" : "");
    try {
      base = JSON.parse(fs.readFileSync(f, "utf8"));
    } catch (err) {
      console.warn(`Primerjava ni mogoča (${err.message}).`);
    }
  }
  const cmp = compare(summary, base);
  fs.writeFileSync(path.join(out, "rezultati.json"), JSON.stringify({ ...summary, primerjava: cmp }, null, 2));
  fs.writeFileSync(path.join(out, "porocilo.md"), markdownReport(summary, cmp));
  fs.writeFileSync(path.join(out, "porocilo.html"), htmlReport(summary, convs, cmp));

  console.log(`\nPovprečna ocena: ${summary.povprecnaOcena === null ? "–" : summary.povprecnaOcena.toFixed(1)} / 5 · kritičnih težav: ${summary.kriticnih}`);
  console.log(`Poročilo: ${path.join(out, "porocilo.html")}`);
  return { summary, convs, out };
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith(path.join("sim", "run.js"))) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
