import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { normalizeFeedback, summarize, summaryMarkdown, areasOf } from "../server/feedback.js";

async function withServer(fn, opts = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-fb-"));
  const file = path.join(dir, "povratne-informacije.json");
  const store = openDb(":memory:");
  const app = createApp(store, { feedbackFile: file, ...opts });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, o = {}) => {
    const res = await fetch(base + p, {
      method: o.method || "GET",
      headers: { "Content-Type": "application/json", ...(o.headers || {}) },
      body: o.body ? JSON.stringify(o.body) : undefined,
    });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, headers: res.headers, body: type.includes("json") && !res.headers.get("content-disposition") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, file, store });
  } finally {
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("feedback form: saved to the database and mirrored to the JSON file", async () => {
  await withServer(async ({ call, file }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Ana" } })).body;
    const r = await call(`/api/students/${s.id}/feedback`, {
      method: "POST",
      body: { ratings: { path: 4, speed: 2, design: 9, nope: 3 }, recommend: "maybe", bad: "Na telefonu se Učbenik nalaga počasi.", device: "phone", screen: "390x844", lang: "sl" },
    });
    assert.equal(r.status, 201);
    const saved = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(saved.length, 1);
    assert.deepEqual(saved[0].ratings, { path: 4, speed: 2 }, "neveljavne ocene in področja se zavržejo");
    assert.equal(saved[0].name, "Ana", "ime iz profila, če ga tester ne vpiše");
    assert.equal(saved[0].recommend, "maybe");
    assert.equal(saved[0].device, "phone");
    // prazno mnenje in neznan učenec
    assert.equal((await call(`/api/students/${s.id}/feedback`, { method: "POST", body: { good: "  " } })).status, 400);
    assert.equal((await call(`/api/students/999/feedback`, { method: "POST", body: { good: "super" } })).status, 404);
  });
});

test("feedback interview: answers with question keys are stored; AI interview is off by default", async () => {
  await withServer(async ({ call, file }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Žan" } })).body;
    const interview = [
      { q: "Kaj ti je bilo pri tem všeč?", a: "Simulacije v učbeniku", k: "liked" },
      { q: "Kje si se zataknil?", a: "Gumb Preveri na telefonu ni delal", k: "stuck" },
      { q: "x", a: "y", k: "hack" },
    ];
    assert.equal((await call(`/api/students/${s.id}/feedback`, { method: "POST", body: { kind: "interview", interview } })).status, 201);
    const [e] = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(e.kind, "interview");
    assert.equal(e.interview.length, 3);
    assert.equal(e.interview[1].k, "stuck");
    assert.equal(e.interview[2].k, undefined, "neznan ključ vprašanja se zavrže");
    const ai = await call(`/api/students/${s.id}/feedback/interview`, { method: "POST", body: { answers: interview } });
    assert.equal(ai.status, 409, "brez EVKLID_FEEDBACK_AI=1 ni klica API");
    const cfg = (await call("/api/config")).body;
    assert.deepEqual(cfg.feedback, { prompt: true, ai: false, admin: true });
  });
});

test("AI interview uses the cheap model with a few turns and logs the cost", async () => {
  const old = { ai: process.env.EVKLID_FEEDBACK_AI, key: process.env.ANTHROPIC_API_KEY, mock: process.env.EVKLID_MOCK };
  process.env.EVKLID_FEEDBACK_AI = "1";
  process.env.ANTHROPIC_API_KEY = "test";
  delete process.env.EVKLID_MOCK;
  const calls = [];
  const feedbackCreateFn = async (p) => {
    calls.push(p);
    return { content: [{ type: "text", text: "Na katerem zaslonu je bilo to?" }], usage: { input_tokens: 300, output_tokens: 20 }, model: p.model };
  };
  try {
    await withServer(
      async ({ call, store }) => {
        const s = (await call("/api/students", { method: "POST", body: { name: "Eva" } })).body;
        const r = await call(`/api/students/${s.id}/feedback/interview`, { method: "POST", body: { answers: [{ q: "Kaj si uporabljal?", a: "Učno pot" }] } });
        assert.deepEqual(r.body, { question: "Na katerem zaslonu je bilo to?", done: false });
        assert.match(calls[0].model, /haiku/);
        assert.ok(calls[0].max_tokens <= 300);
        assert.equal(calls[0].messages.at(-1).content, "Učno pot");
        const used = store.db.prepare("SELECT kind, student_id FROM usage").all();
        assert.deepEqual(used.map((u) => ({ ...u })), [{ kind: "feedback", student_id: s.id }]);
        // po šestih odgovorih konec brez klica
        const six = Array.from({ length: 6 }, (_, i) => ({ q: `v${i}`, a: `o${i}` }));
        const end = await call(`/api/students/${s.id}/feedback/interview`, { method: "POST", body: { answers: six } });
        assert.deepEqual(end.body, { question: null, done: true });
        assert.equal(calls.length, 1);
      },
      { feedbackCreateFn },
    );
  } finally {
    for (const [k, v] of [["EVKLID_FEEDBACK_AI", old.ai], ["ANTHROPIC_API_KEY", old.key], ["EVKLID_MOCK", old.mock]]) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
});

test("collected feedback is visible only on the computer running the server, not through the phone tunnel", async () => {
  await withServer(async ({ call }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Tim" } })).body;
    await call(`/api/students/${s.id}/feedback`, { method: "POST", body: { ratings: { tutor: 5 }, good: "Inštruktor lepo razloži" } });
    const local = await call("/api/feedback");
    assert.equal(local.status, 200);
    assert.equal(local.body.count, 1);
    assert.match(local.body.summary, /Inštruktor \(razlage\) \| 5,0 \| 1/);
    const tunnel = await call("/api/feedback", { headers: { "Cf-Connecting-Ip": "203.0.113.5" } });
    assert.equal(tunnel.status, 403);
    assert.equal((await call("/api/feedback/export?format=json", { headers: { "X-Forwarded-For": "203.0.113.5" } })).status, 403);
    assert.equal((await call("/api/config", { headers: { "Cf-Connecting-Ip": "203.0.113.5" } })).body.feedback.admin, false);
    const md = await call("/api/feedback/export?format=md");
    assert.match(md.headers.get("content-disposition"), /povratne-informacije-povzetek-\d{4}-\d\d-\d\d\.md/);
    assert.match(md.body, /# Povratne informacije testerjev/);
    const json = await call("/api/feedback/export");
    assert.equal(JSON.parse(json.body).length, 1);
  });
});

test("summary puts the worst-rated areas with complaints first and keeps praise separate", () => {
  const entries = [
    { id: 1, name: "Ana", ratings: { speed: 1, tutor: 5 }, recommend: "yes", good: "Inštruktor je super", bad: "Aplikacija se na telefonu zatika", ideas: "Dodaj temni način za učbenik", interview: [] },
    { id: 2, name: null, ratings: { speed: 2, path: 4 }, recommend: "no", good: "", bad: "", ideas: "", interview: [
      { q: "Kje si se zataknil?", a: "Naloge so bile pretežke", k: "stuck" },
      { q: "Kaj si uporabljal?", a: "Učno pot", k: "used" },
      { q: "Bi uporabljal za šolo?", a: "Mogoče pred testom", k: "use" },
    ] },
  ];
  const s = summarize(entries);
  assert.equal(s.priority[0].area, "speed");
  assert.equal(s.priority[0].avg, 1.5);
  assert.deepEqual(s.recommend, { yes: 1, maybe: 0, no: 1 });
  assert.equal(s.rows.find((r) => r.area === "path").complaints[0].text, "Naloge so bile pretežke");
  assert.equal(s.general.other[0].text, "Mogoče pred testom");
  const md = summaryMarkdown(entries, new Date("2026-10-28T12:00:00Z"));
  assert.match(md, /Povzetek 2026-10-28 · 2 mnenj/);
  assert.match(md, /### 1\. Hitrost in delovanje \(ocena 1,5\/5\)\n\nTežave:\n\n- »Aplikacija se na telefonu zatika« \(Ana\)/);
  assert.match(md, /Kaj je testerjem všeč[\s\S]*Inštruktor je super/);
  assert.match(md, /#2/, "brez imena je oznaka številka mnenja");
  assert.doesNotMatch(md, /Učno pot/, "odgovor na »kaj si uporabljal« je samo ozadje");
  assert.deepEqual(areasOf("Simulacija v učbeniku je počasna"), ["textbook", "speed"]);
  assert.equal(summaryMarkdown([]).includes("Še ni mnenj."), true);
});

test("normalizeFeedback trims long text and rejects empty feedback", () => {
  assert.equal(normalizeFeedback({}), null);
  assert.equal(normalizeFeedback({ ratings: { path: 0 } }), null);
  const fb = normalizeFeedback({ bad: "x".repeat(5000), recommend: "sure", device: "fridge", screen: "<script>" });
  assert.equal(fb.bad.length, 2000);
  assert.equal(fb.recommend, null);
  assert.equal(fb.device, null);
  assert.equal(fb.screen, null);
});
