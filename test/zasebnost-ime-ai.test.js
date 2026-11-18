// Ime otroka ne gre k ponudniku AI (j, 18. 11. 2026, po osnutku DPIA). Model dobi oznako {{IME}} (server/prompt.js),
// strežnik jo zamenja s pravim imenom samo v besedilu za učenca (server/ime-oznaka.js). Test vohuni na odjemalcu
// Anthropic (setClient) in preveri, da ime ne pride v NOBEN klic: klepet (prvi odgovor, vodenje v več potezah,
// »Razloži podrobneje«, sprotno preverjanje, popravek, varnostni pregled), ustno spraševanje, zapiski, skener,
// urnik s fotografije in pogovor za mnenje. Tedensko poročilo modela ne kliče (samo e-pošta, server/accounts).
// Kar učenec napiše sam (»Ime mi je …«), ostane, kot je.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { setClient } from "../server/claude.js";
import { withName, createNameStream, maskName, maskHistory, IME_OZNAKA } from "../server/ime-oznaka.js";
import { summarizedHistory } from "../server/povzetek.js";

const NAME = "Zarjana Kovačič";
const LEAK = /Zarjana|Kovačič|Kovacic/i;
const META = '\n<<META subject=MAT topic="seštevanje" error=0 mode=A flag=none done=0>>';

// --- enote ---

test("withName: oznaka → ime, prilepljene črke odpadejo, brez oznake nespremenjeno", () => {
  assert.equal(withName("Bravo, {{IME}}! Še enkrat, {{IME}}.", "Ana"), "Bravo, Ana! Še enkrat, Ana.");
  assert.equal(withName("Hvala, {{IME}}u.", "Ana"), "Hvala, Ana.", "sklonjena oznaka: ime v imenovalniku, ne »Anau«");
  assert.equal(withName("{{IME}}-jev korak", "Ana"), "Ana-jev korak");
  assert.equal(withName("$\\frac{{a}}{b}$ in {{IM", "Ana"), "$\\frac{{a}}{b}$ in {{IM");
  assert.equal(withName("brez oznake", "Ana"), "brez oznake");
});

test("createNameStream: oznaka, razdeljena na katerem koli mestu, pride cela; umik zavrže zadržano", () => {
  const full = `Bravo, ${IME_OZNAKA}! Poglejva ${IME_OZNAKA}u skupaj {{ in {x}.`;
  const want = withName(full, "Ana");
  for (let size = 1; size <= full.length; size++) {
    const s = createNameStream("Ana");
    let out = "";
    for (let i = 0; i < full.length; i += size) out += s.push(full.slice(i, i + size));
    assert.ok(!/\{\{I|ME\}\}/.test(out), `kos ${size}: oznaka je ušla: ${out}`);
    out += s.end();
    assert.equal(out, want, `kos ${size}`);
  }
  // Na vsakem mestu reza posebej (dva kosa).
  for (let cut = 0; cut <= full.length; cut++) {
    const s = createNameStream("Ana");
    assert.equal(s.push(full.slice(0, cut)) + s.push(full.slice(cut)) + s.end(), want, `rez ${cut}`);
  }
  const s = createNameStream("Ana");
  assert.equal(s.push("Uvod {{IM"), "Uvod ");
  s.reset();
  assert.equal(s.push("Nov začetek") + s.end(), "Nov začetek", "umik (retract) zavrže zadržani konec");
});

test("maskName in maskHistory: samo odgovori inštruktorja, cele besede, sporočila učenca ostanejo", () => {
  assert.equal(maskName("Bravo, Zarjana! Zarjana Kovačič, Kovačič.", NAME), "Bravo, {{IME}}! {{IME}}, {{IME}}.");
  assert.equal(maskName("Ana in Anatomija", "Ana"), "{{IME}} in Anatomija");
  const h = [
    { role: "user", content: [{ type: "text", text: "Ime mi je Zarjana." }] },
    { role: "assistant", content: [{ type: "text", text: "Živjo, Zarjana!" }] },
    { role: "assistant", content: "Zarjana, poglej." },
  ];
  const m = maskHistory(h, NAME);
  assert.equal(m[0], h[0], "sporočilo učenca ostane, kot ga je napisal");
  assert.equal(m[1].content[0].text, "Živjo, {{IME}}!");
  assert.equal(m[2].content, "{{IME}}, poglej.");
});

test("povzetek pogovora: shranjen povzetek z imenom (pred spremembo) gre k modelu z oznako", async () => {
  const store = { getSummary: () => ({ text: "Zarjana je vprašala o ulomkih.", upto: 2 }) };
  const msg = (role, text) => ({ role, content: [{ type: "text", text }] });
  const fullHistory = [msg("user", "a"), msg("assistant", "b"), msg("user", "c"), msg("assistant", "d"), msg("user", "e")];
  const out = await summarizedHistory({ store, conversationId: 1, fullHistory, history: fullHistory.slice(2), streamFn: null, mask: (t) => maskName(t, NAME) });
  assert.doesNotMatch(JSON.stringify(out), LEAK);
  assert.match(JSON.stringify(out), /\{\{IME\}\} je vprašala/);
});

// --- vse poti z vohunom na odjemalcu ---

function spyClient(calls) {
  const record = (kind, p) => calls.push({ kind, body: JSON.stringify(p) });
  const usage = { input_tokens: 50, output_tokens: 20 };
  const isTutor = (p) => Array.isArray(p.system) && p.system.some((b) => /Aktivne nastavitve/.test(b.text || ""));
  return {
    messages: {
      create: async (p) => {
        record("create", p);
        return { content: [{ type: "text", text: "{}" }], usage, model: p.model, stop_reason: "end_turn" };
      },
    },
    beta: {
      messages: {
        stream: (p) => {
          record("stream", p);
          // Oznaka razdeljena med dva kosa toka.
          const chunks = isTutor(p) ? ["Bravo, {{I", "ME}}! Poglejva ", "skupaj: koliko je $2 + 3$?" + META] : ["ok"];
          const text = chunks.join("");
          return {
            async *[Symbol.asyncIterator]() {
              yield { type: "message_start", message: { usage: { ...usage, output_tokens: 1 }, model: p.model } };
              yield { type: "content_block_start", content_block: { type: "text" } };
              for (const t of chunks) yield { type: "content_block_delta", delta: { type: "text_delta", text: t } };
              yield { type: "content_block_stop" };
              yield { type: "message_delta", usage: { output_tokens: 20 } };
            },
            finalMessage: async () => ({ content: [{ type: "text", text }], stop_reason: "end_turn", usage, model: p.model }),
          };
        },
      },
    },
  };
}

async function withSpy(fn) {
  const saved = { key: process.env.ANTHROPIC_API_KEY, mock: process.env.EVKLID_MOCK, fb: process.env.EVKLID_FEEDBACK_AI };
  process.env.ANTHROPIC_API_KEY = "test-ni-pravi";
  delete process.env.EVKLID_MOCK;
  process.env.EVKLID_FEEDBACK_AI = "1";
  const calls = [];
  setClient(spyClient(calls));
  const store = openDb(":memory:");
  const server = createApp(store, { scheduler: false, log: { error() {}, warn() {}, info() {} } }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body, method = body ? "POST" : "GET") => {
    const r = await fetch(base + path, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const text = await r.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    return { status: r.status, text, body: json };
  };
  const sse = (text) => {
    const ev = [];
    for (const part of text.split("\n\n")) {
      const e = /^event: (.*)$/m.exec(part)?.[1];
      const d = /^data: (.*)$/m.exec(part)?.[1];
      if (e) ev.push({ event: e, data: d ? JSON.parse(d) : null });
    }
    return ev;
  };
  try {
    await fn({ call, sse, calls, store });
  } finally {
    server.close();
    setClient(null);
    for (const [k, env] of [["key", "ANTHROPIC_API_KEY"], ["mock", "EVKLID_MOCK"], ["fb", "EVKLID_FEEDBACK_AI"]]) {
      if (saved[k] === undefined) delete process.env[env];
      else process.env[env] = saved[k];
    }
  }
}

const leaks = (calls) => calls.filter((c) => LEAK.test(c.body)).map((c) => c.body.slice(0, 300));

test("noben klic modela ne nese imena: klepet, vodenje, podrobna razlaga, ustno, zapiski, skener, urnik, mnenje", { timeout: 120_000 }, async () => {
  await withSpy(async ({ call, sse, calls, store }) => {
    const s = (await call("/api/students", { name: NAME, grade: 9 })).body;
    assert.ok(s?.id, "profil");
    const conv = (await call(`/api/students/${s.id}/conversations`, {})).body;
    const say = async (body) => sse((await call(`/api/conversations/${conv.id}/messages`, body)).text);

    // 1. Prvi odgovor: pretok z razdeljeno oznako → učenec vidi ime, nikjer oznake.
    const ev1 = await say({ text: "Koliko je 2 + 3?" });
    const done1 = ev1.find((e) => e.event === "done")?.data;
    assert.ok(done1, `ni dogodka done: ${JSON.stringify(ev1).slice(0, 400)}`);
    const streamed = ev1.filter((e) => e.event === "delta").map((e) => e.data.text).join("");
    assert.match(streamed, /Bravo, Zarjana Kovačič! Poglejva/);
    assert.doesNotMatch(streamed + done1.text, /\{\{|IME\}\}/);
    assert.match(done1.text, /Bravo, Zarjana Kovačič!/);
    const tutorCalls = calls.filter((c) => c.kind === "stream" && /Aktivne nastavitve/.test(c.body));
    assert.ok(tutorCalls.length >= 1);
    assert.match(tutorCalls[0].body, /Ime učenca: \{\{IME\}\}/);
    // Shranjeno: prikaz z imenom, zgodovina za API z oznako.
    const row = store.listMessages(conv.id).find((m) => m.role === "assistant");
    assert.match(row.display_text, /Bravo, Zarjana Kovačič!/);
    assert.match(JSON.stringify(row.api_content), /\{\{IME\}\}/);
    assert.doesNotMatch(JSON.stringify(row.api_content), LEAK);

    // 2. Star odgovor z imenom v zgodovini (pred spremembo): pri naslednji potezi gre k modelu z oznako.
    store.setMessageContent(row.id, [{ type: "text", text: `Super, Zarjana! Koliko je 2 + 3?${META}` }], 0);
    const ev2 = await say({ text: "5" });
    assert.ok(ev2.some((e) => e.event === "done"), "druga poteza (vodenje)");
    // 3. »Razloži podrobneje« (močnejši model, isti pogovor).
    const ev3 = await say({ text: "5", deep: true });
    assert.ok(ev3.some((e) => e.event === "done" || e.event === "error"));
    // Ponovno odprt pogovor: gumbi in besedilo z imenom, brez oznake.
    const again = await call(`/api/conversations/${conv.id}`);
    assert.doesNotMatch(JSON.stringify(again.body.messages), /\{\{IME\}\}/);

    const chatCalls = calls.length;
    assert.ok(chatCalls >= 4, `klepet: ${chatCalls} klicev (odgovori, varnostni pregled, preverjanje)`);
    // Vsaka pot mora res poklicati model (sicer test ničesar ne preveri).
    const step = async (what, fn) => {
      const before = calls.length;
      await fn();
      assert.ok(calls.length > before, `${what}: ni klica modela`);
    };
    const img = "data:image/jpeg;base64," + Buffer.from("slika").toString("base64");
    // 4. Ustno spraševanje.
    await step("ustno", async () => {
      const u = await call(`/api/students/${s.id}/ustno/zacni`, { tema: "FIZ-OS-9/upor-in-ohmov-zakon", n: 3, nacin: "tipkanje" });
      assert.equal(u.status, 201, u.text.slice(0, 200));
      await call(`/api/students/${s.id}/ustno/${u.body.id}/odgovor`, { i: 0, besedilo: "Upor je razmerje med napetostjo in tokom, R = U / I.", nacin: "tipkanje" });
    });
    // 5. Zapiski, skener, urnik s fotografije, pogovor za mnenje.
    await step("zapiski", () => call(`/api/students/${s.id}/zapiski/preberi`, { image: img }));
    await step("skener (naloga)", () => call(`/api/students/${s.id}/scan/read-task`, { image: img }));
    await step("skener (rokopis)", () => call(`/api/students/${s.id}/scan/read`, { image: img }));
    await step("skener (rešitev)", () => call(`/api/students/${s.id}/scan/solve`, { text: "x+1=3" }));
    await step("urnik s fotografije", () => call(`/api/students/${s.id}/schedule/photo`, { image: img }));
    await step("mnenje (pogovor)", () => call(`/api/students/${s.id}/feedback/interview`, { answers: [{ q: "Kaj si uporabljal?", a: "Učno pot" }] }));
    assert.deepEqual(leaks(calls), [], "ime otroka je šlo k ponudniku AI");
  });
});

test("kar učenec sam napiše (svoje ime), ostane v njegovem sporočilu; prompt ga ne doda", async () => {
  await withSpy(async ({ call, sse, calls }) => {
    const s = (await call("/api/students", { name: NAME })).body;
    const conv = (await call(`/api/students/${s.id}/conversations`, {})).body;
    sse((await call(`/api/conversations/${conv.id}/messages`, { text: "Ime mi je Zarjana. Koliko je 2 + 3?" })).text);
    const tutor = calls.find((c) => c.kind === "stream" && /Aktivne nastavitve/.test(c.body));
    const p = JSON.parse(tutor.body);
    assert.doesNotMatch(JSON.stringify(p.system), LEAK, "sistemski prompt brez imena");
    assert.match(JSON.stringify(p.messages), /Ime mi je Zarjana/, "besedilo učenca ostane, kot je (dokumentirano)");
  });
});

// --- skupni predpomnilnik: obnašanje enako kot prej ---

test("predpomnilnik: shranjen odgovor z oznako, drugi otrok ga dobi s svojim imenom brez novega klica", async () => {
  const store = openDb(":memory:");
  let n = 0;
  const seen = [];
  const streamFn = async ({ system, messages, onText }) => {
    n++;
    seen.push(JSON.stringify({ system, messages }));
    const text = `Bravo, {{IME}}! 1/2 + 1/3 = 5/6.${META}`;
    onText(text.slice(0, 9));
    onText(text.slice(9));
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 100, output_tokens: 50 } };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = async (p, body) => (await fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).text();
  const ask = async (name) => {
    const s = JSON.parse(await post("/api/students", { name }));
    const c = JSON.parse(await post(`/api/students/${s.id}/conversations`, {}));
    return { text: await post(`/api/conversations/${c.id}/messages`, { text: "Kako seštejem dva ulomka z različnima imenovalcema?" }), conv: c.id };
  };
  try {
    const a = await ask("Zala");
    assert.match(a.text, /Bravo, Zala!/);
    const cached = store.db.prepare("SELECT text FROM answer_cache").all().map((r) => r.text);
    assert.equal(cached.length, 1);
    assert.match(cached[0], /Bravo, \{\{IME\}\}!/, "v predpomnilniku je oznaka");
    const b = await ask("Bor");
    assert.equal(n, 1, "drugi otrok dobi shranjen odgovor");
    assert.match(b.text, /Bravo, Bor!/);
    assert.doesNotMatch(b.text, /Zala|\{\{IME\}\}/);
    const row = store.listMessages(b.conv).find((m) => m.role === "assistant");
    assert.match(row.display_text, /Bravo, Bor!/);
    assert.doesNotMatch(JSON.stringify(row.api_content), /Bor/, "zgodovina za API z oznako tudi pri shranjenem odgovoru");
    assert.ok(seen.every((x) => !/Zala|Bor/.test(x)));
  } finally {
    server.close();
  }
});
