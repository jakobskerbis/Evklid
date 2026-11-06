// Trda meja AI, krog 3 popravkov PR #462 (pregleda A in B, j 2026-11-06).
import test from "node:test";
import assert from "node:assert/strict";
import { rights } from "../server/placila/pravice.js";

const DAY = 86400000;
const iso = (days) => new Date(Date.now() + days * DAY).toISOString();

test("A4: šolska licenca z mejo AI 0 $ (ali neveljavno) = brez šolskega AI, ne neomejeno", () => {
  const school = { id: 1, subjects: '["MAT"]', grades: null, valid_until: iso(30), ai_month_usd: 0, ai_spent_usd: 0 };
  for (const s of [school, { ...school, ai_month_usd: NaN }, { ...school, ai_month_usd: null }]) {
    const r = rights({ schools: [s], freeDaily: 10 });
    assert.equal(r.school, true, "vsebine licence ostanejo");
    assert.equal(r.schoolAiOut, true);
    assert.equal(r.maxModel, null, "brez Sonneta");
  }
  assert.equal(rights({ schools: [{ ...school, ai_month_usd: 5 }] }).schoolAiOut, false);
});

test("S5: poraba izbrisanega profila brez dela, ki ga je plačal kredit (ni dvojnega štetja)", async () => {
  const { withAccounts } = await import("./racuni-pomoc.js");
  const { Usage } = await import("../server/usage.js");
  const { Credits } = await import("../server/placila/krediti.js");
  await withAccounts({}, async ({ store, kid }) => {
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    const credits = new Credits(store.db);
    const u = new Usage(store.db);
    u.configure({ credits });
    store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, parent_id) VALUES (?, 'claude-haiku-5-5', 'chat', 0.5, ?)").run(kid.id, pid);
    credits.use(pid, kid.id, 0.3);
    store.deleteStudent(kid.id);
    assert.ok(Math.abs(u.orphanSpent(pid) - 0.2) < 1e-9, `${u.orphanSpent(pid)}`);
  });
});

test("A1: Haiku 5.5 nad 100k žetonov poziva 5× cena (zapis in rezerva); dolg pogovor gre pod prag", async () => {
  const { costUsd } = await import("../server/claude.js");
  const { callMaxUsd, fitLongPrompt, messageTokens } = await import("../server/meje-ai.js");
  const short = costUsd("claude-haiku-5-5", { input_tokens: 90_000, output_tokens: 1000 });
  assert.ok(Math.abs(short - (90_000 * 0.1 + 1000 * 0.5) / 1e6) < 1e-12);
  const long = costUsd("claude-haiku-5-5", { input_tokens: 20_000, cache_read_input_tokens: 100_000, output_tokens: 1000 });
  assert.ok(Math.abs(long - (20_000 * 0.5 + 100_000 * 0.05 + 1000 * 2.5) / 1e6) < 1e-12, "branje šteje v prag, ves klic po dolgi ceni");
  assert.ok(callMaxUsd("claude-haiku-5-5", 120_000, 1000) >= 5 * (120_000 * 0.2 + 1000 * 0.5) / 1e6 - 1e-12);
  assert.equal(costUsd("claude-opus-5-5", { input_tokens: 200_000 }), (200_000 * 4) / 1e6, "Opus brez doplačila");
  const big = Array.from({ length: 40 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "x".repeat(5000) }));
  const fit = fitLongPrompt({ mode: "chat", system: "s", messages: big });
  assert.ok(messageTokens(fit) < 95_000 && fit.length < big.length && fit[0].role === "user");
  assert.equal(fitLongPrompt({ mode: "deep", system: "s", messages: big }), big, "Opus: brez rezanja");
});
