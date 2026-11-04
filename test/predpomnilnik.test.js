import test from "node:test";
import assert from "node:assert/strict";
import { cacheTtl, noteCacheCall, resetCacheCalls, costUsd, addUsage } from "../server/claude.js";

const MIN = 60_000;

test("cache TTL: 1 hour only when the same model is called at 5–60 minute gaps", () => {
  resetCacheCalls();
  const t0 = 1_000_000_000;
  const m = "claude-opus-5-5";
  assert.equal(cacheTtl(m, t0, "auto"), null, "prvi klic: 5 min (redek klic z 1 h bi stal 2× vhod brez branja)");
  noteCacheCall(m, t0);
  assert.equal(cacheTtl(m, t0 + 20 * MIN, "auto"), null, "en klic v zadnji uri: še 5 min");
  noteCacheCall(m, t0 + 20 * MIN);
  assert.equal(cacheTtl(m, t0 + 40 * MIN, "auto"), "1h", "razmiki ~20 min: 1 h");
  assert.equal(cacheTtl("claude-haiku-5-5", t0 + 40 * MIN, "auto"), null, "vsak model ima svoj predpomnilnik");
  // Gost promet (razmiki pod 5 min): branje ohranja vnos za 5 min, 1 h bi le podražil zapis.
  resetCacheCalls();
  for (let i = 0; i < 5; i++) noteCacheCall(m, t0 + i * MIN);
  assert.equal(cacheTtl(m, t0 + 5 * MIN, "auto"), null);
  // Klici, starejši od ure, ne štejejo.
  resetCacheCalls();
  noteCacheCall(m, t0);
  noteCacheCall(m, t0 + 10 * MIN);
  assert.equal(cacheTtl(m, t0 + 75 * MIN, "auto"), null);
  // Ročna nastavitev.
  assert.equal(cacheTtl(m, t0, "1h"), "1h");
  assert.equal(cacheTtl(m, t0, "5m"), null);
  resetCacheCalls();
});

test("cost: 1-hour cache writes cost 2× input, 5-minute writes 1.25×, and survive summing tool rounds", () => {
  const u = { cache_creation_input_tokens: 1_000_000, cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: 1_000_000 } };
  assert.equal(costUsd("claude-opus-5-5", u), 8, "Opus 5.5: 2 × 4 $");
  assert.equal(costUsd("claude-opus-5-5", { cache_creation_input_tokens: 1_000_000 }), 5, "brez razdelitve: 5 min");
  const sum = addUsage(addUsage(null, { input_tokens: 10, cache_creation_input_tokens: 500_000, cache_creation: { ephemeral_1h_input_tokens: 500_000 } }), { cache_creation_input_tokens: 500_000, cache_creation: { ephemeral_5m_input_tokens: 500_000 } });
  assert.deepEqual(sum.cache_creation, { ephemeral_5m_input_tokens: 500_000, ephemeral_1h_input_tokens: 500_000 });
  assert.ok(Math.abs(costUsd("claude-haiku-5-5", sum) - (0.1 + 0.0625 + 0.000001)) < 1e-9);
});
