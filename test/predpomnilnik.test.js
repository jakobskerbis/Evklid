import test from "node:test";
import assert from "node:assert/strict";
import { costUsd, addUsage } from "../server/claude.js";

test("cost: 1-hour cache writes cost 2× input, 5-minute writes 1.25×, and survive summing tool rounds", () => {
  const u = { cache_creation_input_tokens: 1_000_000, cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: 1_000_000 } };
  assert.equal(costUsd("claude-opus-5-5", u), 8, "Opus 5.5: 2 × 4 $");
  assert.equal(costUsd("claude-opus-5-5", { cache_creation_input_tokens: 1_000_000 }), 5, "brez razdelitve: 5 min");
  const sum = addUsage(addUsage(null, { input_tokens: 10, cache_creation_input_tokens: 500_000, cache_creation: { ephemeral_1h_input_tokens: 500_000 } }), { cache_creation_input_tokens: 500_000, cache_creation: { ephemeral_5m_input_tokens: 500_000 } });
  assert.deepEqual(sum.cache_creation, { ephemeral_5m_input_tokens: 500_000, ephemeral_1h_input_tokens: 500_000 });
  // Haiku nad 100k žetonov poziva: dolga cena za ves klic (1 h zapis 1 $, 5 min 0,625 $, vhod 0,5 $ na milijon).
  assert.ok(Math.abs(costUsd("claude-haiku-5-5", sum) - (0.5 + 0.3125 + 0.000005)) < 1e-9);
  assert.equal(costUsd("claude-opus-5-5-20261015", u), 8, "tudi ime z datumom");
});
