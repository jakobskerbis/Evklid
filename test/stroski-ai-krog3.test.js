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
