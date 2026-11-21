// Drugi »Vprašaj inštruktorja« v poli, medtem ko se prvi odgovor še izpisuje (pregled #917, 2. prehod, 3): vprašanje se
// ne izgubi (prej send() med state.sending tiho vrnil in ostal je prazen pogovor), pošlje se po koncu odgovora.
import test from "node:test";
import assert from "node:assert/strict";
import { chromium, opts, streznik, racunZame, stran, zavihek, META } from "./maturant-splet-pomoc.js";

test("drugo vprašanje iz pole med odgovorom: počaka in se pošlje, brez praznega pogovora", opts, async () => {
  let klicev = 0;
  let pusti;
  const vrata = new Promise((r) => (pusti = r)); // prvi odgovor se izpisuje, dokler ga test ne spusti
  const srv = streznik({
    streamFn: async ({ onText }) => {
      klicev++;
      onText("razmišljam ");
      if (klicev === 1) await vrata;
      onText("ok");
      return { text: "razmišljam ok" + META, stopReason: "end_turn" };
    },
  });
  const racun = await racunZame(srv, "pola2@test.si");
  const { ctx, p } = await stran(srv.base, racun);
  try {
    await p.goto(srv.base + "/");
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    await zavihek(p, "exams");
    await p.locator("[data-pp-ours]").first().click();
    await p.waitForSelector(".op-task", { timeout: 15000 });
    const vprasaj = async (i) => {
      await p.locator(`.op-task[data-op-i="${i}"]`).scrollIntoViewIfNeeded();
      await p.locator(`.op-task[data-op-i="${i}"] [data-op-tutor]`).first().click();
    };
    await vprasaj(4);
    await p.waitForSelector("#view-chat:not([hidden])", { timeout: 15000 });
    for (let i = 0; klicev < 1 && i < 150; i++) await p.waitForTimeout(100); // prvi odgovor se izpisuje
    await p.click("#chat-back"); // nazaj na polo, odgovor se še izpisuje
    await p.waitForSelector(".op-task", { timeout: 15000 });
    await vprasaj(5);
    await p.waitForFunction(() => /prejšnje vprašanje/.test(document.body.textContent), null, { timeout: 5000 });
    await p.waitForTimeout(1000);
    assert.equal(klicev, 1, "drugo vprašanje čaka na konec prvega odgovora");
    pusti();
    // Po koncu prvega odgovora se odpre nov pogovor in vprašanje se pošlje.
    await p.waitForSelector("#view-chat:not([hidden])", { timeout: 15000 });
    for (let i = 0; klicev < 2 && i < 150; i++) await p.waitForTimeout(100);
    await p.waitForFunction(() => !document.querySelector("#send")?.disabled || document.querySelector("#input")?.value === "", null, { timeout: 15000 });
    await p.waitForTimeout(1000);
    assert.equal(klicev, 2, "obe vprašanji sta prišli do inštruktorja");
    const pogovori = srv.store.db
      .prepare("SELECT c.id, (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.role = 'user') AS n FROM conversations c WHERE c.student_id = ?")
      .all(racun.id);
    assert.equal(pogovori.length, 2, JSON.stringify(pogovori));
    assert.ok(pogovori.every((c) => c.n === 1), "noben pogovor ni prazen: " + JSON.stringify(pogovori));
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    srv.close();
  }
});

test.after(() => chromium?.close());
