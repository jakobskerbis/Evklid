#!/usr/bin/env node
// Sprejemni preizkus poti Vadnica → »Vprašaj inštruktorja« (pregled pripravljenosti pilota 26. 11. 2026, poseg 2; j odobril
// ~5 $, meja 8 $). 30 poti iz test/fixtures/pot-vadnice/poti.json (10 maturitetnih konceptov, 18 s tipično napako,
// 6 pravilnih standardnih, 6 pravilnih nestandardnih). Vsaka pot gre skozi PRAVO aplikacijo (server/app.js v istem
// procesu, začasna baza, nov učenec SŠ 4. letnik, način A):
//   1. naloga iz generatorja v Vadnici, učenčev odgovor gre skozi pravo preverjanje (POST …/answer)
//   2. »Vprašaj inštruktorja« z učenčevimi koraki (pri pravilnem odgovoru »Preglej«), prvo sporočilo v klepet;
//      če je prvi odgovor sestavila koda, še drugo sporočilo učenca (fixture drugo_sporocilo), da odgovori model
//   3. pri poti z napako učenec popravi odgovor v Vadnici, nato »naslednja naloga« iste teme
// Koda preveri: skrita opomba s preverjenim rezultatom je v prvem sporočilu; »s pomočjo« (hint_used); nova naloga iste
// teme in istega generatorja. Ocenjevalec (MODEL_DEEP, Opus) slepo oceni vse inštruktorjeve odgovore: ali imenuje prav
// tisti napačen korak, ali izda končni rezultat, ali pravilen korak razglasi za napačnega, ali ima računsko napako.
// Ocenjevalec dobi nalogo, učenčeve korake, referenco (pravilen rezultat in pri poti z napako opis napačnega koraka) in
// odgovore; ne ve, katera različica aplikacije je odgovorila.
// Ne piše v pravo bazo. Ustavi se, preden bi strošek (aplikacija + ocenjevalec) presegel --max-usd.
//   node scripts/meri-pot-vadnice.mjs [--max-usd 2] [--del 1-3] [--poti lin-1,kor-2] [--suho] [--preizkus]
//   --del k-n   le vsaka n-ta pot od k-te (1-3, 2-3, 3-3: cel nabor v treh zagonih po 2 $)
//   --suho      samo izbor in najslabši strošek (0 $); --preizkus preizkusni odgovori brez ključa (0 $)
// Zagon: GitHub Actions > Meritev, skripta scripts/meri-pot-vadnice.mjs. Izid data/meri-pot-vadnice*.json (artefakt).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateTask } from "../server/practice/index.js";
import { fmt } from "../server/practice/check.js";

const FIXTURE = new URL("../test/fixtures/pot-vadnice/poti.json", import.meta.url);

// Naloga poti: ista kot generateTask s temo, ravnjo, semenom in letnikom iz nabora.
export const nalogaPoti = (n) => generateTask(n.topic, n.level, n.seed, "sl", n.year);

// Pravilen odgovor v zapisu, kot ga vpiše učenec (popravek po pomoči).
export function pravilenOdgovor(a) {
  if (a.type === "number") return `${fmt(a.value, a.decimals ?? null)}${a.unit ? ` ${a.unit}` : ""}`;
  if (a.type === "fraction") return `${a.num}/${a.den}`;
  if (a.type === "choice") return String(a.index);
  if (a.type === "coefficients") return a.values.join(", ");
  throw new Error(`vrsta odgovora ${a.type}`);
}

export const NAVODILA = `You grade an AI maths tutor for Slovenian secondary-school students (matura). A student solved a practice task, then asked the tutor for help (or for a review of a correct solution). You get the task, the student's steps and answer, a reference (the correct result and, if the student made a mistake, which step is wrong), and the tutor's replies in order. The first reply may be composed by the app's code, the later one by the model; grade the tutor as a whole and also the model's reply separately.

Answer ONLY with one JSON object, no other text:
{"napaka_imenovana": true|false|null, "napaka_imenovana_model": true|false|null, "izda_rezultat": true|false, "lazna_napaka": true|false, "racunska_napaka": true|false, "utemeljitev": "<one or two sentences in Slovenian>"}

- napaka_imenovana: only when the student made a mistake: does the tutor (any reply) point to the wrong step given in the reference (the right place and what is wrong there)? A vague "check your calculation" is false. null when the student's solution is correct.
- napaka_imenovana_model: the same, judged only on the LAST reply (the model's). null when the student's solution is correct.
- izda_rezultat: does any reply state the final correct result of the task, or the full solution, before the student found it? (Restating the student's own correct result when the student's solution is correct is not revealing.)
- lazna_napaka: does any reply call a correct step or a correct result of the student wrong, or push the student to change a correct method? For a correct non-standard method, steering the student to "the usual way" as if theirs were wrong counts.
- racunska_napaka: does any reply contain a mathematical error of its own?`;

export function vprasanje(p, naloga, odgovori) {
  const ref = p.vrsta === "napaka" ? `Correct result: ${pravilenOdgovor(naloga.answer)}. The student's solution is WRONG. Wrong step (reference): ${p.napacen_korak}` : `Correct result: ${pravilenOdgovor(naloga.answer)}. The student's solution is CORRECT (${p.vrsta === "nestandard" ? "a correct non-standard method" : "the standard method"}).`;
  const opcije = naloga.answer.type === "choice" ? `\nOptions (0-based): ${naloga.answer.options.map((o, i) => `${i}: ${o}`).join("; ")}` : "";
  return `TASK:\n${naloga.text}${opcije}\n\nSTUDENT'S STEPS:\n${p.koraki}\nSTUDENT'S ANSWER: ${p.odgovor}\n\nREFERENCE:\n${ref}\n\n${odgovori.map((o, i) => `--- REPLY ${i + 1} (${o.vir}) ---\n${o.besedilo}`).join("\n\n")}`;
}

export function preberiOceno(text) {
  const m = String(text).match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    const o = JSON.parse(m[0]);
    return typeof o.izda_rezultat === "boolean" && typeof o.lazna_napaka === "boolean" ? o : null;
  } catch {
    return null;
  }
}

// Povzetek po merilih sprejemnega preizkusa.
export function povzetek(izid) {
  const napake = izid.filter((r) => r.vrsta === "napaka");
  const pravilne = izid.filter((r) => r.vrsta !== "napaka");
  const k = (arr, f) => `${arr.filter(f).length}/${arr.length}`;
  return {
    poti: izid.length,
    opomba: k(izid, (r) => r.opomba),
    napaka_imenovana: k(napake, (r) => r.ocena?.napaka_imenovana === true),
    napaka_imenovana_model: k(napake, (r) => r.ocena?.napaka_imenovana_model === true),
    lazne_napake: k(pravilne, (r) => r.ocena?.lazna_napaka === true),
    izdan_rezultat: k(napake, (r) => r.ocena?.izda_rezultat === true),
    racunske_napake: k(izid, (r) => r.ocena?.racunska_napaka === true),
    s_pomocjo: k(napake, (r) => r.s_pomocjo),
    nova_naloga_ista_tema: k(napake, (r) => r.nova_naloga?.tema === true),
    nova_naloga_isti_generator: k(napake, (r) => r.nova_naloga?.generator === true),
    brez_ocene: izid.filter((r) => !r.ocena).length,
  };
}

async function main() {
  const a = process.argv.slice(2);
  const arg = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
  const MAX_USD = Number(arg("--max-usd", 2));
  const SUHO = a.includes("--suho");
  const PREIZKUS = a.includes("--preizkus");
  const DEL = arg("--del", "");
  const IZBOR = arg("--poti", "");
  if (!(MAX_USD > 0)) throw new Error("--max-usd mora biti pozitivno število.");
  const N = JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
  let poti = N.poti;
  if (IZBOR) poti = poti.filter((p) => IZBOR.split(",").includes(p.id));
  if (DEL) {
    const [k, n] = DEL.split("-").map(Number);
    if (!(k >= 1 && n >= k)) throw new Error("--del k-n, npr. 1-3");
    poti = poti.filter((_, i) => i % n === k - 1);
  }
  const OUT = `data/meri-pot-vadnice${DEL ? `-${DEL}` : ""}.json`;

  // Kot scripts/meri-pedagogika.mjs: brez preverjanja kartic v ozadju, brez mesečnega proračuna (nadgradnja modela),
  // sprotni pregled se konča in zapiše porabo.
  process.env.EVKLID_VERIFY_DAILY_USD = "0";
  process.env.EVKLID_MONTHLY_BUDGET_USD = "0";
  process.env.EVKLID_LIVE_REVIEW_TIMEOUT_MS = "300000";
  const { openDb } = await import("../server/db.js");
  const { createApp } = await import("../server/app.js");
  const { isMockMode, modeParams, getClient, costUsd, MODEL_MID, MODEL_DEEP, MAX_TOKENS, MAX_TOOL_ROUNDS } = await import("../server/claude.js");
  const { callMaxUsd } = await import("../server/meje-ai.js");
  const { normalizeSettings } = await import("../server/settings.js");
  const { buildSystemPrompt } = await import("../server/prompt.js");
  const { isHiddenNote } = await import("../server/skrite-opombe.js");

  const nastavitve = () => normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik OR", subject: "MAT", solving_mode: "A" });
  const system = buildSystemPrompt({ settings: nastavitve(), studentName: "Ana" });
  const izhod = Math.max(modeParams("chat").max_tokens, MAX_TOKENS.think);
  const klicUsd = callMaxUsd(modeParams("think").model, Math.ceil(system.length / 3) + 6000 + (MAX_TOOL_ROUNDS + 3) * izhod, izhod);
  // Na pot: do dve sporočili inštruktorju (vsako z odgovorom, ponovitvijo in krogi orodij ter dvema pregledoma Sonnet).
  const potUsd = 2 * ((2 * (MAX_TOOL_ROUNDS + 1) + 2) * klicUsd + 2 * callMaxUsd(MODEL_MID, 8000, 8000));
  const OCENA_MAX = 2000;
  const ocenaUsd = callMaxUsd(MODEL_DEEP, 6000, OCENA_MAX);
  // Teoretični najslabši primer poti (vsi krogi orodij, ponovitve in pregledi z največjim izhodom) je ~0,8 $, dejanska pot
  // pa nekaj centov; z njim bi zagon po 2 $ končal po dveh poteh. Zato rezerva pred vsako potjo: trikratnik najdražje
  // dosedanje poti, vsaj REZERVA_MIN (prva pot ima polno rezervo potUsd), plus najslabša ocena.
  const REZERVA_MIN = 0.15;
  console.log(`${poti.length} poti; teoretično najslabša pot: aplikacija ${potUsd.toFixed(3)} $, ocenjevalec ${ocenaUsd.toFixed(3)} $; rezerva pred potjo 3 × najdražja dosedanja (vsaj ${REZERVA_MIN} $); meja ${MAX_USD} $; izid ${OUT}.`);
  if (SUHO) return;
  if (PREIZKUS !== isMockMode()) throw new Error(PREIZKUS ? "--preizkus deluje samo brez ključa API." : "Ni ključa API (GitHub Actions: manjka skrivnost ANTHROPIC_API_KEY).");

  const store = openDb(process.env.EVKLID_DB || ":memory:");
  const server = createApp(store, { scheduler: false }).listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const klic = async (pot, body) => {
    const res = await fetch(base + pot, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
    const text = await res.text();
    if (!res.ok) throw new Error(`${pot}: HTTP ${res.status} ${text.slice(0, 200)}`);
    return text.startsWith("{") ? JSON.parse(text) : text;
  };
  const aplikacijaUsd = () => store.db.prepare("SELECT COALESCE(SUM(cost_usd), 0) AS s FROM usage").get().s;
  let ocenjevalecUsd = 0;
  const poslji = async (convId, text) => {
    const zacetek = store.db.prepare("SELECT COALESCE(MAX(id), 0) AS m FROM usage").get().m;
    const body = await klic(`/api/conversations/${convId}/messages`, { text });
    const done = [...String(body).matchAll(/event: done\ndata: (.*)\n/g)].at(-1);
    if (!done) throw new Error(`brez dogodka done: ${String(body).slice(-200)}`);
    // Odgovor modela je v porabi kot »chat« ali »boost«; drugi plačani klici (npr. pregled odgovora) ga ne pomenijo.
    const model = store.db.prepare("SELECT COUNT(*) AS n FROM usage WHERE id > ? AND kind IN ('chat', 'boost') AND model NOT IN ('koda', 'cache')").get(zacetek).n > 0;
    return { besedilo: JSON.parse(done[1]).text, vir: model ? "model" : "koda" };
  };

  const izid = [];
  let ustavljeno = false;
  const zapisi = (koncano) => {
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify({ datum: new Date().toISOString(), ocenjevalec: MODEL_DEEP, del: DEL || null, porabljeno: { aplikacija: aplikacijaUsd(), ocenjevalec: ocenjevalecUsd }, ustavljeno, koncano, povzetek: povzetek(izid), izid }, null, 1));
  };
  let najdrazja = null;
  try {
    for (const p of poti) {
      const pred = aplikacijaUsd() + ocenjevalecUsd;
      const rezerva = najdrazja == null ? potUsd : Math.max(3 * najdrazja, REZERVA_MIN);
      if (pred + rezerva + ocenaUsd > MAX_USD) {
        ustavljeno = true;
        break;
      }
      const n = N.naloge[p.naloga];
      const t = nalogaPoti(n);
      const s = store.createStudent("Ana", nastavitve());
      await klic(`/api/students/${s.id}/practice/next`, { topic_id: n.topic }); // zgled teme (prvi obisk)
      const taskId = store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload) VALUES (?, ?, ?, ?)").run(s.id, n.topic, n.level, JSON.stringify(t)).lastInsertRowid;
      const vadnica = await klic(`/api/students/${s.id}/tasks/${taskId}/answer`, { answer: p.odgovor });
      const h = await klic(`/api/students/${s.id}/tasks/${taskId}/help`, p.vrsta === "napaka" ? { work: p.koraki } : { kind: "review", work: p.koraki });
      const odgovori = [await poslji(h.conversation.id, h.text)];
      if (odgovori[0].vir === "koda") odgovori.push(await poslji(h.conversation.id, N.drugo_sporocilo));
      const prvo = store.listMessages(h.conversation.id).find((m) => m.role === "user");
      const opomba = (prvo?.api_content || []).some((b) => isHiddenNote(b.text) && b.text.includes("computed by the task generator"));
      const r = { id: p.id, vrsta: p.vrsta, naloga: p.naloga, vadnica: vadnica.kind, opomba, odgovori };
      if (p.vrsta === "napaka") {
        const popravek = await klic(`/api/students/${s.id}/tasks/${taskId}/answer`, { answer: pravilenOdgovor(t.answer) });
        r.popravek = popravek.kind;
        await klic(`/api/students/${s.id}/practice/next`, { topic_id: n.topic });
        const nova = store.db.prepare("SELECT topic_id, payload FROM tasks WHERE student_id = ? AND id > ? ORDER BY id DESC LIMIT 1").get(s.id, taskId);
        r.nova_naloga = nova ? { tema: nova.topic_id === n.topic, generator: JSON.parse(nova.payload).generator === n.generator } : null;
      }
      r.s_pomocjo = store.db.prepare("SELECT hint_used FROM tasks WHERE id = ?").get(taskId).hint_used === 1;
      // Ocena (slepo: ocenjevalec ne ve, katera različica je odgovorila).
      if (PREIZKUS) r.ocena = { napaka_imenovana: null, napaka_imenovana_model: null, izda_rezultat: false, lazna_napaka: false, racunska_napaka: false, utemeljitev: "preizkus" };
      else {
        const o = await getClient().messages.create({ model: MODEL_DEEP, max_tokens: OCENA_MAX, system: NAVODILA, messages: [{ role: "user", content: vprasanje(p, t, odgovori) }] });
        ocenjevalecUsd += costUsd(o.model || MODEL_DEEP, o.usage || {});
        r.ocena = preberiOceno((o.content || []).filter((b) => b.type === "text").map((b) => b.text).join(""));
      }
      najdrazja = Math.max(najdrazja ?? 0, aplikacijaUsd() + ocenjevalecUsd - pred);
      izid.push(r);
      console.log(`${p.id} (${p.vrsta}): opomba ${r.opomba ? "da" : "NE"}, ${odgovori.map((o) => o.vir).join("+")}, ocena ${JSON.stringify(r.ocena && { ...r.ocena, utemeljitev: undefined })}; skupaj ${(aplikacijaUsd() + ocenjevalecUsd).toFixed(3)} $`);
      zapisi(false);
    }
  } finally {
    zapisi(!ustavljeno);
    server.close();
  }
  console.log(`\nIZID ${JSON.stringify(povzetek(izid))}`);
  console.log(`Strošek: aplikacija ${aplikacijaUsd().toFixed(4)} $, ocenjevalec ${ocenjevalecUsd.toFixed(4)} $${ustavljeno ? ` (ustavljeno pred mejo ${MAX_USD} $)` : ""}.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e?.message || e);
    process.exit(1);
  });
}
