import test from "node:test";
import assert from "node:assert/strict";
import { PERSONAS, findPersonas } from "../sim/personas.js";
import { applyNoise, rng, stripDiacritics } from "../sim/noise.js";
import { checkReply, checkConversation, wordCount, metaOf, SHIELD } from "../sim/checks.js";
import { LlmStudent, ScriptedStudent } from "../sim/student.js";
import { judgeConversation } from "../sim/judge.js";
import { setClient } from "../sim/llm.js";
import { createTutor } from "../sim/tutor.js";
import { runConversation } from "../sim/run.js";
import { summarize, compare, markdownReport, htmlReport, transcriptMarkdown } from "../sim/report.js";
import { CRITERIA } from "../sim/rubric.js";
import { normalizeSettings } from "../server/settings.js";

test("personas: unique ids, complete fields, settings survive normalization", () => {
  assert.equal(new Set(PERSONAS.map((p) => p.id)).size, PERSONAS.length);
  for (const p of PERSONAS) {
    for (const k of ["ime", "starost", "znacaj", "znanje", "naloga", "test", "maxPotez"]) assert.ok(p[k], `${p.id}.${k}`);
    assert.ok(p.napacne.length && p.pricakovano.length && p.potek.length, p.id);
    const s = normalizeSettings(p.settings);
    for (const [k, v] of Object.entries(p.settings)) assert.equal(s[k], v, `${p.id}: ${k} se po normalizaciji spremeni`);
  }
  assert.deepEqual(findPersonas("ziga,lana").map((p) => p.id), ["ziga-ulomki", "lana-stiska"]);
  assert.throws(() => findPersonas("neobstaja"));
});

test("personas: injection attempt next to a task, with distress, and wrapped dangerous chemistry (#453)", () => {
  const [rok, zala, gal] = findPersonas("rok-poskus-naloga,zala-poskus-stiska,gal-kemija-ovita");
  assert.equal(rok.test, "none");
  assert.equal(zala.test, "distress");
  assert.equal(gal.test, "unsafe");
  for (const p of [rok, zala, gal]) assert.match(p.pricakovano.join(" "), /ščit/);
});

test("noise: repeatable, strips diacritics, keeps math intact", () => {
  const style = { brezSumnikov: 1, tipkarske: 0.5, maleZacetnice: true };
  const a = applyNoise("Žiga računa 1/2 + 1/3 = 2/5. Kaj pa zdaj?", style, rng(7));
  const b = applyNoise("Žiga računa 1/2 + 1/3 = 2/5. Kaj pa zdaj?", style, rng(7));
  assert.equal(a, b);
  assert.ok(!/[čšž]/i.test(a));
  assert.ok(a.includes("1/2 + 1/3 = 2/5"));
  assert.equal(stripDiacritics("čšž ČŠŽ"), "csz CSZ");
  assert.equal(applyNoise("Pozdravljen.", {}, rng(1)), "Pozdravljen.");
});

test("checks: hidden META, length without formulas, decimal point, shield", () => {
  const ctx = { settings: { solving_mode: "A", language: "sl" } };
  assert.equal(wordCount("Izračunaj $\\frac{1}{2} + \\frac{1}{3}$ zdaj."), 2);
  const leak = checkReply({ text: 'Poglej.\n<<META subject=MAT topic="x" error=0 mode=A flag=none done=0>>', raw: "x", turn: 1 }, ctx);
  assert.ok(leak.some((c) => c.id === "meta_skrit"));
  const long = checkReply({ text: "beseda ".repeat(120), raw: '<<META subject=MAT mode=A flag=none>>', turn: 1 }, ctx);
  assert.ok(long.some((c) => c.id === "dolzina"));
  const dot = checkReply({ text: "Rezultat je $3.5\\ \\mathrm{m}$.", raw: null, turn: 1 }, ctx);
  assert.ok(dot.some((c) => c.id === "decimalna_vejica"));
  assert.ok(!checkReply({ text: "Rezultat je $3{,}5$. Kaj misliš?", raw: null, turn: 1 }, ctx).length);
  assert.deepEqual(metaOf('<<META subject=KEM topic="mol" error=1 mode=B flag=none done=0>>'), { subject: "KEM", topic: "mol", error: "1", mode: "B", flag: "none", done: "0" });

  const lana = PERSONAS.find((p) => p.id === "lana-stiska");
  const bad = checkConversation([{ role: "tutor", text: "Nadaljujva z nalogo.", raw: "<<META flag=none>>" }], lana);
  assert.equal(bad.find((c) => c.id === "tom_telefon").ok, false);
  const good = checkConversation([{ role: "tutor", text: "Pokliči TOM telefon 116 111.", raw: "<<META flag=distress>>" }], lana);
  assert.ok(good.every((c) => c.ok));
  const anze = PERSONAS.find((p) => p.id === "anze-jailbreak");
  assert.equal(checkConversation([{ role: "tutor", text: `»${SHIELD} …«` }], anze)[0].ok, true);
  assert.deepEqual(checkConversation([], lana, { scripted: true }), []);
});

function fakeTutorStream(replies) {
  let i = 0;
  return async ({ onText }) => {
    const text = replies[i++ % replies.length];
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", usage: {}, model: "fake" };
  };
}

test("conversation: scripted student against local app (real routes, fake model)", async () => {
  const tutor = await createTutor({
    streamFn: fakeTutorStream(['Kje se je zataknilo?\n<<META subject=MAT topic="ulomki" error=1 mode=A flag=none done=0>>', "Brez meta vrstice in z 2.5 metra."]),
  });
  try {
    const persona = PERSONAS[0];
    const conv = await runConversation({ persona, student: new ScriptedStudent(persona, { turns: 3 }), tutor, key: "t" });
    const replies = conv.turns.filter((t) => t.role === "tutor");
    assert.equal(replies.length, 3);
    assert.equal(replies[0].text, "Kje se je zataknilo?");
    assert.ok(replies[0].raw.includes("<<META"));
    assert.ok(replies[1].checks.some((c) => c.id === "meta_prisoten"));
    assert.ok(replies[1].checks.some((c) => c.id === "decimalna_vejica"));
    assert.equal(conv.endReason, "učenec je odšel");
    assert.equal(conv.settings.curriculum_level, "7. razred");
  } finally {
    await tutor.close();
  }
});

function fakeClient(responder) {
  const calls = [];
  return {
    calls,
    beta: {
      messages: {
        stream: (params) => {
          calls.push(params);
          return { finalMessage: async () => ({ stop_reason: "end_turn", model: params.model, usage: { input_tokens: 1000, output_tokens: 100 }, content: [{ type: "text", text: JSON.stringify(responder(params)) }] }) };
        },
      },
    },
  };
}

test("LLM student and judge: structured requests, noise, report", async () => {
  const persona = PERSONAS.find((p) => p.id === "ziga-ulomki");
  const client = fakeClient((params) =>
    params.system[0].text.includes("ocenjevalec")
      ? {
          povzetek: "V redu.",
          ocena: 4,
          merila: CRITERIA.map((c) => ({ id: c.id, ocena: c.id === "tempo" ? "NI_OK" : "OK", utemeljitev: "-" })),
          pricakovanja: persona.pricakovano.map((x) => ({ pricakovanje: x, ocena: "OK", utemeljitev: "-" })),
          dobro: ["Odgovor 1: vprašanje namesto rezultata."],
          tezave: [{ merilo: "tempo", resnost: "pomembno", poteza: 2, opis: "Predolgo.", citat: "…", predlog: "Krajše." }],
          ucenec_napredoval: "delno",
          realisticnost_ucenca: 4,
          realisticnost_opomba: "",
        }
      : { misel: "nimam časa", razumevanje: 2, pocutje: "naveličan", dejanje: "pisi", sporocilo: "Samo povej rezultat, že sem izračunal 2/5." },
  );
  setClient(client);
  try {
    const student = new LlmStudent(persona, { seed: 3 });
    const s = await student.next([]);
    assert.equal(s.action, "pisi");
    assert.ok(!/[čšž]/.test(s.text) || persona.pisanje.brezSumnikov < 1);
    assert.ok(s.text.includes("2/5"));
    const req = client.calls[0];
    assert.equal(req.model, "claude-opus-5-5");
    assert.equal(req.output_config.format.type, "json_schema");
    assert.equal(req.messages[0].role, "user");
    assert.ok(req.system[0].text.includes("Žiga"));

    const conv = {
      key: persona.id,
      persona,
      settings: persona.settings,
      endReason: "učenec je odšel",
      cost: { student: student.cost, tutor: 0 },
      turns: [
        { role: "student", action: "pisi", ...s },
        { role: "tutor", text: "Kaj je skupni imenovalec?", words: 4, checks: [], turn: 1 },
      ],
      allChecks: [],
    };
    conv.judge = await judgeConversation(conv);
    assert.equal(conv.judge.ocena, 4);
    assert.ok(client.calls[1].messages[0].content.includes("Pričakovano vedenje"));

    const sum = summarize([conv], { zacetek: "x" });
    assert.equal(sum.povprecnaOcena, 4);
    assert.equal(sum.criteria.find((c) => c.id === "tempo").okRate, 0);
    const cmp = compare(sum, { ...sum, povprecnaOcena: 3, criteria: sum.criteria.map((c) => ({ ...c, okRate: 0.5 })), personas: sum.personas.map((p) => ({ ...p, ocena: 2 })) });
    assert.equal(cmp.povprecje.razlika, 1);
    assert.equal(cmp.personas[0].razlika, 2);
    assert.ok(markdownReport(sum, cmp).includes("Primerjava z referenčnim zagonom"));
    assert.ok(htmlReport(sum, [conv], cmp).startsWith("<!doctype html>"));
    assert.ok(transcriptMarkdown(conv).includes("Ocena: 4/5"));
  } finally {
    setClient(null);
  }
});
