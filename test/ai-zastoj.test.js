// Zanesljivost klica AI (21. 11. 2026): nadzornik mirovanja toka (zastoj), izid klicev za zdravje strežnika in
// zagon v produkciji brez ključa API.
import test from "node:test";
import assert from "node:assert/strict";

process.env.ANTHROPIC_API_KEY = "sk-test";
process.env.EVKLID_MOCK = "0";
const Anthropic = (await import("@anthropic-ai/sdk")).default;
const { streamReply, setClient, apiErrorCode, errorText, nastaviOpazovalcaAi, zagonBrezAiKljuca, mirovanjeMs } = await import("../server/claude.js");

const enc = new TextEncoder();
const sse = (type, data) => enc.encode(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`);
const START = sse("message_start", { message: { id: "m", type: "message", role: "assistant", model: "claude-haiku-5-5", content: [], stop_reason: null, usage: { input_tokens: 10, output_tokens: 1 } } });
const KONEC = [
  sse("content_block_start", { index: 0, content_block: { type: "text", text: "" } }),
  sse("content_block_delta", { index: 0, delta: { type: "text_delta", text: "Živijo" } }),
  sse("content_block_stop", { index: 0 }),
  sse("message_delta", { delta: { stop_reason: "end_turn" }, usage: { output_tokens: 5 } }),
  sse("message_stop", {}),
];
const odjemalec = (start) =>
  new Anthropic({
    apiKey: "sk-test",
    maxRetries: 0,
    timeout: 5000,
    fetch: async () => new Response(new ReadableStream({ start }), { status: 200, headers: { "content-type": "text/event-stream", "request-id": "x" } }),
  });
const klic = (idleMs) => streamReply({ system: "s", messages: [{ role: "user", content: "hi" }], onText: () => {}, mode: "chat", idleMs });

test("zastoj: tok, ki po message_start obmolkne, se konča z napako »zastoj odgovora«", async (t) => {
  const izidi = [];
  nastaviOpazovalcaAi((i) => izidi.push(i));
  t.after(() => {
    setClient(null);
    nastaviOpazovalcaAi(null);
  });
  setClient(odjemalec((c) => c.enqueue(START))); // nato nič več, povezava ostane odprta
  const t0 = Date.now();
  const err = await klic(300).then(() => null, (e) => e);
  assert.ok(err, "klic se mora končati z napako");
  assert.ok(Date.now() - t0 < 3000, "napaka mora priti kmalu po roku mirovanja");
  assert.equal(err.zastoj, true);
  assert.equal(apiErrorCode(err), "zastoj odgovora");
  assert.match(errorText(err), /Koda: zastoj odgovora/);
  // Poraba: message_start je prišel, izhod ni znan → previdno ves max_tokens kroga (klic je morda plačan).
  assert.equal(err.usage.input_tokens, 10);
  assert.ok(err.usage.output_tokens >= 1000);
  assert.deepEqual(izidi, [{ ok: false, koda: "zastoj odgovora" }]);
});

test("zastoj: »ping« Anthropica (SDK ga ne pokaže) šteje kot življenje toka", async (t) => {
  const izidi = [];
  nastaviOpazovalcaAi((i) => izidi.push(i));
  t.after(() => {
    setClient(null);
    nastaviOpazovalcaAi(null);
  });
  setClient(
    odjemalec(async (c) => {
      c.enqueue(START);
      for (let i = 0; i < 8; i++) {
        await new Promise((r) => setTimeout(r, 100));
        c.enqueue(sse("ping", {}));
      }
      for (const k of KONEC) c.enqueue(k);
      c.close();
    }),
  );
  const r = await klic(300);
  assert.equal(r.text, "Živijo");
  assert.deepEqual(izidi, [{ ok: true }]);
});

test("zastoj: učenčeva prekinitev ni izid za zdravje AI", async (t) => {
  const izidi = [];
  nastaviOpazovalcaAi((i) => izidi.push(i));
  t.after(() => {
    setClient(null);
    nastaviOpazovalcaAi(null);
  });
  setClient(odjemalec((c) => c.enqueue(START)));
  const ac = new AbortController();
  setTimeout(() => ac.abort(), 100);
  const err = await streamReply({ system: "s", messages: [{ role: "user", content: "hi" }], onText: () => {}, signal: ac.signal, idleMs: 5000 }).then(() => null, (e) => e);
  assert.ok(err);
  assert.notEqual(err.zastoj, true);
  assert.deepEqual(izidi, []);
});

test("zastoj: rok iz EVKLID_AI_MIROVANJE_S (privzeto 60 s, 0 = izklop)", () => {
  assert.equal(mirovanjeMs({}), 60_000);
  assert.equal(mirovanjeMs({ EVKLID_AI_MIROVANJE_S: "90" }), 90_000);
  assert.equal(mirovanjeMs({ EVKLID_AI_MIROVANJE_S: "0" }), 0);
  assert.equal(mirovanjeMs({ EVKLID_AI_MIROVANJE_S: "x" }), 0);
});

test("zagon: produkcija brez ključa API se ne zažene, razen z izrecnim EVKLID_MOCK=1", () => {
  assert.equal(zagonBrezAiKljuca({}), null); // razvoj in testi: preizkusni način kot doslej
  assert.match(zagonBrezAiKljuca({ NODE_ENV: "production" }), /ANTHROPIC_API_KEY/);
  assert.match(zagonBrezAiKljuca({ RENDER: "true", ANTHROPIC_API_KEY: "  " }), /ne zažene/);
  assert.equal(zagonBrezAiKljuca({ RENDER: "true", EVKLID_MOCK: "1" }), null);
  assert.equal(zagonBrezAiKljuca({ NODE_ENV: "production", ANTHROPIC_API_KEY: "sk-x" }), null);
  assert.equal(zagonBrezAiKljuca({ NODE_ENV: "production", ANTHROPIC_AUTH_TOKEN: "t" }), null);
  // Besedilo ne izpiše nobene vrednosti iz okolja.
  assert.doesNotMatch(zagonBrezAiKljuca({ NODE_ENV: "production", EVKLID_DATA_KEY: "skrivnost" }), /skrivnost/);
});
