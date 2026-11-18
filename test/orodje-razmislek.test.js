import test from "node:test";
import assert from "node:assert/strict";
import { createStreamFilter } from "../server/meta.js";

// Besedilo pred klicem orodja (»Želi zeleno barvo. Najbolj smiselno je …«) ni odgovor (j, 17. 11. 2026, posnetek).
test("streamReply: text written before a tool call is retracted, only the answer after the tool stays", async () => {
  const { streamReply, getClient } = await import("../server/claude.js");
  const keep = { key: process.env.ANTHROPIC_API_KEY, mock: process.env.EVKLID_MOCK };
  process.env.ANTHROPIC_API_KEY = "sk-ant-test";
  delete process.env.EVKLID_MOCK;
  const rounds = [
    { text: "Želi zeleno barvo. Najbolj smiselno je spremeniti poudarno barvo.", tool: true },
    { text: "Poudarna barva je zdaj zelena.", tool: false },
  ];
  let i = 0;
  getClient().beta.messages = {
    stream() {
      const r = rounds[i++];
      const content = [{ type: "text", text: r.text }, ...(r.tool ? [{ type: "tool_use", id: "t1", name: "change_settings", input: { accent: "#2e7d32" } }] : [])];
      return {
        async *[Symbol.asyncIterator]() {
          yield { type: "content_block_delta", delta: { type: "text_delta", text: r.text } };
        },
        finalMessage: async () => ({ content, stop_reason: r.tool ? "tool_use" : "end_turn", usage: { input_tokens: 10, output_tokens: 5 }, model: "claude-haiku-5-5" }),
      };
    },
  };
  try {
    let streamed = "";
    const retracts = [];
    const r = await streamReply({
      system: "S",
      messages: [{ role: "user", content: "Ali lahko narediš evklida zelenega" }],
      tools: [{ name: "change_settings", input_schema: { type: "object" } }],
      onToolUse: async () => ({ content: "{\"status\":\"applied\"}" }),
      onText: (c) => (streamed += c),
      onRetract: (kept) => (retracts.push(kept), (streamed = kept)),
    });
    assert.equal(r.text, "Poudarna barva je zdaj zelena.");
    assert.deepEqual(retracts, [""]);
    assert.equal(streamed, "Poudarna barva je zdaj zelena.");
    assert.equal(r.toolCalls, 1);

    // Brez besedila po orodju ostane razmislek (odgovor ni prazen).
    i = 0;
    rounds[1].text = "";
    const r2 = await streamReply({ system: "S", messages: [{ role: "user", content: "x" }], tools: [{ name: "change_settings", input_schema: { type: "object" } }], onToolUse: async () => ({ content: "ok" }), onText: () => {} });
    assert.match(r2.text, /Želi zeleno barvo/);
  } finally {
    if (keep.key === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = keep.key;
    if (keep.mock !== undefined) process.env.EVKLID_MOCK = keep.mock;
  }
});

test("stream filter reset starts over (lead phrase check and META detection)", () => {
  const f = createStreamFilter();
  f.push("Nekaj besedila pred orodjem, ki je dovolj dolgo za izpis.\n");
  f.reset();
  const out = f.push("Odgovor po orodju je tukaj in je dovolj dolg za izpis.\n");
  assert.ok(out.startsWith("Odgovor"), out);
  assert.ok(!f.end().raw.includes("pred orodjem"));
});
