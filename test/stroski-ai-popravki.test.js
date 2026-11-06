// Popravki trde meje AI po pregledih 2 in 3 (PR #462, j 2026-11-06).
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts, META } from "./racuni-pomoc.js";

const until = async (cond, ms = 3000) => {
  const end = Date.now() + ms;
  while (!cond() && Date.now() < end) await new Promise((r) => setTimeout(r, 20));
  return cond();
};

test("preverjanje plača aplikacija: brezplačen profil dobi kartico (meja 0,2 $ < rezerva dveh modelov)", async () => {
  const card = "Gostota.\n<<KARTICA\nV: Kaj pove gostota snovi?\nO: Koliko mase je v enoti prostornine.\n>>" + META;
  let verified = 0;
  await withAccounts(
    {},
    async ({ call, store, kid }) => {
      const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      const r = await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "Kaj je gostota?" } });
      assert.equal(r.status, 200);
      assert.ok(await until(() => store.db.prepare("SELECT COUNT(*) n FROM flashcards WHERE student_id = ? AND verified = 1").get(kid.id).n === 1), "kartica shranjena in preverjena");
      assert.ok(verified >= 1);
    },
    {
      streamFn: async ({ onText }) => {
        onText(card);
        return { text: card, stopReason: "end_turn", model: "claude-haiku-4-5", usage: { input_tokens: 100, output_tokens: 20 } };
      },
      verifyFn: async () => {
        verified++;
        return { ok: true };
      },
    },
  );
});

test("preverjanje: dnevni znesek aplikacije je trd (rezervacije v teku in poraba danes)", async () => {
  const { openDb } = await import("../server/db.js");
  const { Usage } = await import("../server/usage.js");
  const store = openDb(":memory:");
  const usage = new Usage(store.db);
  const a = usage.appHold("verify", 0.5, 0.3);
  assert.ok(a);
  assert.equal(usage.appHold("verify", 0.5, 0.3), null, "drugo preverjanje v teku ne gre čez dnevni znesek");
  a.release();
  usage.log(null, "claude-opus-5-5", { output_tokens: 25000 }, "verify"); // 0,5 $ danes
  assert.equal(usage.appHold("verify", 0.5, 0.01), null);
  assert.ok(usage.appHold("verify", -1, 5), "negativen znesek = brez meje");
  // Strošek preverjanja ni v porabi nobenega učenca.
  assert.equal(store.db.prepare("SELECT COUNT(*) n FROM usage WHERE student_id IS NOT NULL").get().n, 0);
});

// Lažen odjemalec API: dogodki, nato napaka (prekinitev); streamReply brez ključa teče v načinu mock, zato lažen ključ.
async function withFakeStream(events, fn, { abortFirst = false } = {}) {
  const { setClient } = await import("../server/claude.js");
  setClient({
    beta: {
      messages: {
        stream: () => ({
          async *[Symbol.asyncIterator]() {
            for (const e of events) yield e;
            throw new Error("Request was aborted.");
          },
          finalMessage: async () => {
            throw new Error("ni končnega sporočila");
          },
        }),
      },
    },
  });
  const prevKey = process.env.ANTHROPIC_API_KEY;
  const prevMock = process.env.EVKLID_MOCK;
  process.env.ANTHROPIC_API_KEY = "test-ni-pravi";
  delete process.env.EVKLID_MOCK;
  try {
    const ctrl = new AbortController();
    if (abortFirst) ctrl.abort();
    return await fn(ctrl.signal);
  } finally {
    setClient(null);
    if (prevKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = prevKey;
    if (prevMock !== undefined) process.env.EVKLID_MOCK = prevMock;
  }
}

test("KRITIČNO prekinjen tok: brez message_delta (pride šele na koncu) se zapiše izhod = max_tokens kroga", async () => {
  const { streamReply, modeParams } = await import("../server/claude.js");
  // Kot pravi API: message_start z output_tokens 1, razmišljanje in besedilo, prekinitev pred message_delta.
  const events = [
    { type: "message_start", message: { model: "claude-opus-5-5", usage: { input_tokens: 1200, output_tokens: 1 } } },
    { type: "content_block_delta", delta: { type: "thinking_delta", thinking: "Premislimo ".repeat(50) } },
    { type: "content_block_delta", delta: { type: "text_delta", text: "Zač" } },
  ];
  await withFakeStream(events, (signal) =>
    assert.rejects(streamReply({ system: "x", messages: [{ role: "user", content: "a" }], mode: "deep", onText: () => {}, signal }), (err) => {
      assert.equal(err.usage.input_tokens, 1200);
      assert.equal(err.usage.output_tokens, modeParams("deep").max_tokens, "izhod = max_tokens kroga, ne 1");
      return true;
    }),
  );
  // Ko message_delta pride (končni izhod), velja ta.
  const done = [...events, { type: "message_delta", usage: { output_tokens: 777 } }];
  await withFakeStream(done, (signal) =>
    assert.rejects(streamReply({ system: "x", messages: [{ role: "user", content: "a" }], mode: "deep", onText: () => {}, signal }), (err) => err.usage.output_tokens === 777),
  );
});

test("KRITIČNO prekinjen tok: prekinitev pred message_start zapiše vhod iz rezerve", async () => {
  const { streamReply } = await import("../server/claude.js");
  const { systemTokens, messageTokens } = await import("../server/meje-ai.js");
  const messages = [{ role: "user", content: [{ type: "text", text: "Razloži ulomke. ".repeat(40) }] }];
  await withFakeStream(
    [],
    (signal) =>
      assert.rejects(streamReply({ system: "Navodila.", messages, mode: "lite", onText: () => {}, signal }), (err) => {
        assert.ok(err.usage.cache_creation_input_tokens >= messageTokens(messages), "ves vhod (zgornja meja)");
        assert.equal(err.usage.cache_creation.ephemeral_1h_input_tokens, err.usage.cache_creation_input_tokens, "po najvišji ceni");
        assert.equal(err.usage.output_tokens, 0);
        assert.ok(systemTokens("Navodila.") > 0);
        return true;
      }),
    { abortFirst: true },
  );
});

test("KRITIČNO prekinjen tok: prekinjeni odgovori zmogljivejšega modela štejejo v dnevno mejo (deepToday)", async () => {
  const { openDb } = await import("../server/db.js");
  const { Usage } = await import("../server/usage.js");
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const usage = new Usage(store.db);
  usage.log(s.id, "claude-opus-5-5", { input_tokens: 10, output_tokens: 6000 }, "prekinjeno");
  usage.log(s.id, "claude-opus-5-5", { input_tokens: 10, output_tokens: 10 }, "chat");
  assert.equal(usage.deepToday(s.id, "claude-opus-5-5"), 2);
});

test("prekinjen povzetek pogovora se zapiše v porabo", async () => {
  const { openDb } = await import("../server/db.js");
  const { summarizedHistory } = await import("../server/povzetek.js");
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const c = store.createConversation(s.id);
  const msg = (i) => ({ role: i % 2 ? "assistant" : "user", content: [{ type: "text", text: `sporočilo ${i}` }] });
  const full = Array.from({ length: 30 }, (_, i) => msg(i));
  const logged = [];
  const streamFn = async () => {
    throw Object.assign(new Error("Request was aborted."), { usage: { input_tokens: 900, output_tokens: 400 }, model: "claude-haiku-5-5" });
  };
  await summarizedHistory({ store, conversationId: c.id, fullHistory: full, history: full.slice(-10), streamFn, log: (r) => logged.push(r) });
  assert.equal(logged.length, 1);
  assert.equal(logged[0].usage.output_tokens, 400);
});

test("slika: rezerva ≥ 4784 žetonov (modeli 4.7+ do 2576 px)", async () => {
  const { IMAGE_TOKENS, messageTokens } = await import("../server/meje-ai.js");
  assert.ok(IMAGE_TOKENS >= 4784);
  assert.ok(messageTokens([{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: "image/png", data: "x" } }] }]) >= 4784);
});

// Strežnik brez računov z eno mejo (kot test/marza-ai.test.js).
async function capServer(CAP, streamFn, extra = {}) {
  const { openDb } = await import("../server/db.js");
  const { createApp } = await import("../server/app.js");
  const { Usage } = await import("../server/usage.js");
  const store = openDb(":memory:");
  const usage = new Usage(store.db);
  usage.configure({ capsOf: () => [{ key: "t", usd: CAP, spent: usage.monthTotal(), code: "block.freeMonth" }] });
  const server = createApp(store, { scheduler: false, streamFn, usage, ...extra }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const s = await (await post("/api/students", { name: "Ana", settings: { level: "OS", grade: 8 } })).json();
  return { store, usage, server, post, s };
}

test("popravek: rezerva po načinu popravka (think, 8000 žetonov); najslabši strošek ostane pod mejo", async () => {
  const { modeParams } = await import("../server/claude.js");
  const { systemTokens, messageTokens } = await import("../server/meje-ai.js");
  const CAP = 0.03;
  const fixModes = [];
  // Vsak klic stane največ, kolikor sme (ves vhod po najvišji ceni, izhod = max_tokens načina); odgovor ima napačen račun.
  const streamFn = async ({ system, messages, mode, onText, tools }) => {
    const isFix = typeof system === "string" && system.startsWith("You fix one mistake");
    if (isFix) fixModes.push(mode);
    const { model, max_tokens } = modeParams(mode);
    const bound = systemTokens(system) + messageTokens(messages) + (tools?.length ? Math.ceil(Buffer.byteLength(JSON.stringify(tools)) / 2) : 0);
    const text = isFix ? "Popravek: $7 \\cdot 8 = 56$." : "Izračunajmo: $7 \\cdot 8 = 54$. Zdaj prištej še $2$." + META;
    if (!isFix) onText(text);
    return { text, stopReason: "end_turn", model, usage: { cache_creation_input_tokens: bound, cache_creation: { ephemeral_1h_input_tokens: bound }, output_tokens: max_tokens } };
  };
  const { usage, server, post, s } = await capServer(CAP, streamFn);
  try {
    let blocked = false;
    for (let i = 0; i < 30 && !blocked; i++) {
      const conv = await (await post(`/api/students/${s.id}/conversations`)).json();
      const r = await post(`/api/conversations/${conv.id}/messages`, { text: `Koliko je 7 krat 8 plus 2? (${i})` });
      if (r.status === 429) blocked = true;
      await r.text();
    }
    assert.ok(blocked);
    assert.ok(fixModes.length > 0 && fixModes.every((m) => m === "think"), fixModes.join(","));
    assert.ok(usage.monthTotal() <= CAP + 1e-9, `poraba ${usage.monthTotal()} $ > ${CAP} $`);
    assert.equal(usage.inflight.size, 0);
  } finally {
    server.close();
  }
});

test("napaka pred pretakanjem: pogovor in rezervacija se sprostita, vprašanje ne šteje", async () => {
  const streamFn = async ({ onText }) => {
    onText("Ok." + META);
    return { text: "Ok." + META, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 10, output_tokens: 10 } };
  };
  const { store, usage, server, post, s } = await capServer(1, streamFn, { log: { error() {} } });
  const orig = store.addMessage.bind(store);
  let fail = true;
  store.addMessage = (...a) => {
    if (fail && a[1] === "user") {
      fail = false;
      throw Object.assign(new Error("database is locked"), { code: "SQLITE_BUSY" });
    }
    return orig(...a);
  };
  try {
    const conv = await (await post(`/api/students/${s.id}/conversations`)).json();
    const r1 = await post(`/api/conversations/${conv.id}/messages`, { text: "Razloži ulomke." });
    assert.equal(r1.status, 500);
    await r1.text();
    assert.ok(await until(() => usage.inflight.size === 0), "rezervacija sproščena");
    assert.equal(usage.questionsToday(s.id), 0, "neodgovorjeno vprašanje ne šteje");
    const r2 = await post(`/api/conversations/${conv.id}/messages`, { text: "Razloži ulomke." });
    assert.equal(r2.status, 200, "pogovor ni ostal zaseden (409)");
    await r2.text();
  } finally {
    server.close();
  }
});
