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
