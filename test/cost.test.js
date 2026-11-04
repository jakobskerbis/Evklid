import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Usage, recentHistory, windowHistory } from "../server/usage.js";
import { modeParams, MODEL, MODEL_DEEP, MODEL_MID, quickParams } from "../server/claude.js";
import { codeHint } from "../server/hints.js";
import { generateTask } from "../server/practice/index.js";

const META = '\n<<META subject=MAT topic="ulomki" error=0 mode=A flag=none done=0>>';

async function withServer(fn) {
  const store = openDb(":memory:");
  const seen = [];
  const streamFn = async ({ messages, mode, onText }) => {
    seen.push({ messages, mode });
    const text = `Odgovor ${seen.length}.${META}`;
    onText(text);
    const model = modeParams(mode).model;
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model, usage: { input_tokens: 1000, output_tokens: 500 } };
  };
  const app = createApp(store, { streamFn });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, {
      method: opts.method || "GET",
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, seen, store });
  } finally {
    server.close();
  }
}

const doneOf = (sse) => {
  const chunks = sse.split("\n\n").filter(Boolean);
  const last = chunks.findLast((c) => c.startsWith("event: done"));
  return JSON.parse(/^data: (.*)$/m.exec(last)[1]);
};

test("model per mode: Haiku for chat, capped output; Opus only for deep", () => {
  assert.equal(modeParams("chat").model, MODEL);
  assert.equal(modeParams("think").model, MODEL);
  assert.equal(modeParams("deep").model, MODEL_DEEP);
  assert.ok(modeParams("lite").max_tokens < modeParams("chat").max_tokens);
  assert.ok(modeParams("chat").max_tokens <= 4000);
  assert.equal(modeParams("think").effort, "high");
  // Kratka opravila: Haiku brez razmišljanja, Opus 5.5 ga ne sme izklopiti.
  assert.equal(quickParams("claude-haiku-5-5").thinking.type, "disabled");
  assert.equal(quickParams("claude-opus-5-5").thinking, undefined);
});

test("deep model gets only the last exchanges; history window starts with the user", () => {
  const msgs = [];
  for (let i = 0; i < 12; i++) msgs.push({ role: "user", content: `u${i}` }, { role: "assistant", content: `a${i}` });
  msgs.push({ role: "user", content: "razloži podrobneje" });
  const r = recentHistory(msgs, 3);
  assert.equal(r.length, 5);
  assert.equal(r[0].role, "user");
  assert.equal(r.at(-1).content, "razloži podrobneje");
  assert.ok(windowHistory(msgs, 10).length > r.length);
});

test("daily deep cap and monthly soft budget fall back to the thinking Haiku with a note", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const u = new Usage(store.db);
  assert.equal(u.chooseMode(s.id, { wantDeep: true, deepModel: MODEL_DEEP }).mode, "deep");
  for (let i = 0; i < 5; i++) u.log(s.id, MODEL_DEEP, { input_tokens: 100, output_tokens: 100 });
  const capped = u.chooseMode(s.id, { wantDeep: true, deepModel: MODEL_DEEP });
  assert.equal(capped.mode, "think");
  assert.match(capped.note, /5×/);

  const t = store.createStudent("Bor");
  u.log(t.id, MODEL, { input_tokens: 0, output_tokens: 2_100_000 }); // ~1,05 $
  const soft = u.chooseMode(t.id, { wantDeep: true, deepModel: MODEL_DEEP });
  assert.equal(soft.mode, "think");
  assert.ok(soft.note);
  assert.equal(u.chooseMode(t.id, {}).mode, "chat");
  assert.equal(u.chooseMode(t.id, { lite: true }).mode, "lite");
  // Srednja šola: Haiku z več razmisleka (primerjava modelov 4. 11.), razen v varčnem načinu ali z EVKLID_SS_THINK=0.
  assert.equal(u.chooseMode(t.id, { secondary: true }).mode, "think");
  assert.equal(u.chooseMode(t.id, { secondary: true, lite: true }).mode, "lite");
  assert.equal(u.chooseMode(t.id, { secondary: true, wantDeep: true, deepModel: MODEL_DEEP }).mode, "think", "nad mehko mejo");
  process.env.EVKLID_SS_THINK = "0";
  try {
    assert.equal(u.chooseMode(t.id, { secondary: true }).mode, "chat");
  } finally {
    delete process.env.EVKLID_SS_THINK;
  }
  assert.equal(u.studentMonth(t.id).soft_reached, true);
  assert.equal(u.blockReason(t.id), null);
  u.log(t.id, MODEL, { input_tokens: 0, output_tokens: 4_000_000 }); // nad 3 $
  assert.match(u.blockReason(t.id), /omejitev/);
  assert.equal(u.studentMonth(t.id).hard_reached, true);
});

test("competition track: thinking Haiku by default, Opus only on request", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const u = new Usage(store.db);
  assert.equal(u.chooseMode(s.id, { competition: true }).mode, "think");
  assert.equal(u.chooseMode(s.id, { competition: true, wantDeep: true, deepModel: MODEL_DEEP }).mode, "deep");
});

test("activation code caps the deep model at Sonnet", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const u = new Usage(store.db);
  assert.equal(u.chooseMode(s.id, { wantDeep: true, capped: true, deepModel: MODEL_MID }).mode, "mid");
  assert.equal(u.chooseMode(s.id, { competition: true, wantDeep: true, capped: true, deepModel: MODEL_MID }).mode, "mid");
  assert.equal(u.chooseMode(s.id, { wantThink: true, capped: true }).mode, "think");
  assert.equal(u.chooseMode(s.id, { capped: true }).mode, "chat");
  const p = modeParams("mid");
  assert.match(p.model, /sonnet/);
  assert.equal(p.max_tokens, modeParams("deep").max_tokens);
});

test("hidden Opus limit for activation-code holders: per day and per month", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const u = new Usage(store.db);
  assert.equal(u.promoOpusSpent(s.id, MODEL_DEEP), false);
  u.log(s.id, MODEL_DEEP, {});
  assert.equal(u.promoOpusSpent(s.id, MODEL_DEEP), false);
  u.log(s.id, MODEL_DEEP, {});
  assert.equal(u.promoOpusSpent(s.id, MODEL_DEEP), true); // 2 na dan
  const t = store.createStudent("Bor");
  store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, ?, 'chat', 0.3, datetime('now','-1 day'))").run(t.id, MODEL_DEEP);
  assert.equal(u.promoOpusSpent(t.id, MODEL_DEEP), new Date().getUTCDate() !== 1); // 0,3 $ na mesec
});

test("free tier never gets Opus: re-explain and competition use thinking Haiku", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const u = new Usage(store.db);
  const r = u.chooseMode(s.id, { wantDeep: true, free: true, deepModel: MODEL_DEEP });
  assert.equal(r.mode, "think");
  assert.match(r.note, /brezplačnem/);
  assert.equal(u.chooseMode(s.id, { competition: true, wantDeep: true, free: true, deepModel: MODEL_DEEP }).mode, "think");
  assert.equal(u.chooseMode(s.id, { wantThink: true, free: true }).mode, "think");
  assert.equal(u.chooseMode(s.id, { free: true }).mode, "chat");
});

test("code hint: data, unknown and hint without the formula or the result", () => {
  let task = null;
  for (let seed = 1; seed < 50 && !task; seed++) {
    const t = generateTask("FIZ-OS-8/fizikalne-kolicine-in-enote", 1, seed);
    if (t?.data?.given?.length) task = t;
  }
  if (!task) {
    task = { text: "x", data: { given: ["m = 2\\ \\mathrm{kg}"], find: ["F_g"] }, formula: "F_g = m g", answer: { type: "number", value: 20 } };
  }
  const h = codeHint(task, { subject: "FIZ", topicName: "teža", lastAnswer: "7" });
  assert.match(h, /\*\*Podatki:\*\*/);
  assert.match(h, /<<META subject=FIZ topic="teža" error=1 mode=A/);
  for (const f of [].concat(task.formula || [])) assert.ok(!h.includes(f), "formula ostane skrita");
  assert.equal(codeHint({ text: "x", data: false, formula: false }), null);
});

test("Vadnica help: first reply comes from code, the next one from the model", async () => {
  await withServer(async ({ call, seen, store }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Miha", settings: { subject: "FIZ", curriculum_level: "8" } } })).body;
    const payload = { text: "Telo ima maso $2\\ \\mathrm{kg}$. Kolikšna je teža?", answer: { type: "number", value: 20, unit: "N" }, data: { given: ["m = 2\\ \\mathrm{kg}"], find: ["F_g"] }, formula: "F_g = m \\cdot g", hint: "Teža je sila, s katero Zemlja privlači telo." };
    const taskId = store.db
      .prepare("INSERT INTO tasks (student_id, topic_id, level, payload, last_answer) VALUES (?, ?, 1, ?, ?)")
      .run(s.id, "FIZ-OS-8/fizikalne-kolicine-in-enote", JSON.stringify(payload), "2 N").lastInsertRowid;
    const h = (await call(`/api/students/${s.id}/tasks/${taskId}/help`, { method: "POST" })).body;
    const r1 = await call(`/api/conversations/${h.conversation.id}/messages`, { method: "POST", body: { text: h.text } });
    assert.equal(seen.length, 0, "brez klica modela");
    assert.match(doneOf(r1.body).text, /Podatki/);
    assert.ok(!r1.body.includes("META"));
    await call(`/api/conversations/${h.conversation.id}/messages`, { method: "POST", body: { text: "F = m · g" } });
    assert.equal(seen.length, 1);
    assert.equal(seen[0].messages.length, 3, "model vidi prvi korak iz kode");
    const sum = (await call("/api/usage")).body;
    assert.equal(sum.saved_answers, 1);
  });
});

test("task help: explain and review send the answer and the student's steps to the model", async () => {
  await withServer(async ({ call, seen, store }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Lea", settings: { subject: "FIZ", curriculum_level: "8" } } })).body;
    const payload = { text: "Kolesar vozi s hitrostjo 4 m/s. Koliko poti prevozi v 30 s?", answer: { type: "number", value: 120, unit: "m" }, data: { given: ["v = 4"], find: ["s"] }, formula: "s = v t" };
    const taskId = store.db
      .prepare("INSERT INTO tasks (student_id, topic_id, level, payload, last_answer) VALUES (?, ?, 1, ?, ?)")
      .run(s.id, "FIZ-OS-8/fizikalne-kolicine-in-enote", JSON.stringify(payload), "100 m").lastInsertRowid;
    for (const kind of ["explain", "review"]) {
      const h = (await call(`/api/students/${s.id}/tasks/${taskId}/help`, { method: "POST", body: { kind, work: "s = v · t\ns = 4 · 25" } })).body;
      assert.match(h.text, /Moj odgovor: 100 m/);
      assert.match(h.text, /s = 4 · 25/);
      await call(`/api/conversations/${h.conversation.id}/messages`, { method: "POST", body: { text: h.text } });
    }
    assert.equal(seen.length, 2, "razlaga in pregled gresta k modelu, ne h kodi");
  });
});

test("path topic start is reused across students; deep goes to Opus with a short history", async () => {
  await withServer(async ({ call, seen }) => {
    const topic = "MAT-OS-6/deljivost";
    for (const name of ["Ana", "Bor"]) {
      const s = (await call("/api/students", { method: "POST", body: { name } })).body;
      const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST", body: { topic_id: topic } })).body;
      await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Začniva s temo: Deljivost." } });
    }
    assert.equal(seen.length, 1, "drugi učenec dobi shranjen odgovor");

    const s = (await call("/api/students", { method: "POST", body: { name: "Cene" } })).body;
    const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
    for (let i = 0; i < 6; i++) await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: `Vprašanje številka ${i}?` } });
    // Prva ponovna razlaga: Haiku z več razmisleka; ponovna prošnja zapored: Opus; nato spet od začetka.
    const r1 = await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Razloži podrobneje.", deep: true } });
    assert.equal(seen.at(-1).mode, "think");
    assert.equal(doneOf(r1.body).deep, true);
    const r = await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Še vedno ne razumem.", deep: true } });
    const last = seen.at(-1);
    assert.equal(last.mode, "deep");
    await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Aha, zdaj razumem." } });
    assert.equal(seen.at(-1).mode, "chat");
    await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Razloži podrobneje.", deep: true } });
    assert.equal(seen.at(-1).mode, "think", "števec se po običajnem sporočilu ponastavi");
    assert.ok(last.messages.length <= 5);
    assert.equal(doneOf(r.body).deep, true);

    const sum = (await call("/api/usage")).body;
    assert.ok(sum.month_eur > 0);
    // Števec porabe: danes za vse profile, po profilih.
    assert.ok(sum.today_eur > 0 && sum.today_calls > 0);
    assert.equal(sum.can_claim, false);
    const row = sum.students.find((x) => x.id === s.id);
    assert.ok(row.today_eur > 0 && row.today_calls === row.calls);
    // Prek povezave za telefon (tunel doda X-Forwarded-For) porabe brez računov ne vidi nihče.
    assert.equal((await call("/api/usage", { headers: { "X-Forwarded-For": "1.2.3.4" } })).status, 403);
    assert.ok(sum.per_active_eur > 0);
    assert.ok(sum.by_model.some((m) => m.model === MODEL_DEEP));
    assert.equal(sum.limits.daily_deep, 5);
    const mine = (await call(`/api/students/${s.id}/usage`)).body;
    assert.equal(typeof mine.percent, "number");
  });
});
