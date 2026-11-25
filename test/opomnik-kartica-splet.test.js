// Kartica dnevnega opomnika na Učni poti ne ostane na dan, ko je učenec že vadil (pregled #917, 2. prehod, drobnarija):
// tako kot e-pošta in potisno obvestilo (vadilDanes). Po prvem XP dneva izgine tudi brez osvežitve.
import test from "node:test";
import assert from "node:assert/strict";
import { chromium, opts, streznik, racunZame, stran, MATURANT, TELEFON } from "./maturant-splet-pomoc.js";

test("kartica opomnika: vidna od 16.00, izgine, ko učenec danes zbere XP", opts, async () => {
  const srv = streznik();
  const far = `${new Date().getFullYear() + 1}-06-01`;
  const racun = await racunZame(srv, "opomnik@test.si", { ...MATURANT, goal: "matura", goal_date: far, goal_reminder: true });
  const { ctx, p } = await stran(srv.base, racun, { ...TELEFON, timezoneId: "UTC" });
  try {
    await p.clock.setFixedTime(new Date(`${new Date().toISOString().slice(0, 10)}T17:00:00Z`));
    await p.goto(srv.base + "/");
    await p.waitForSelector("#goal-reminder .gr-body", { timeout: 20000 });
    srv.store.db.prepare("INSERT INTO xp_events (student_id, amount, reason) VALUES (?, 5, 'task')").run(racun.id);
    // XP pride z zapisom (ne GET), ki pobriše vnaprej prenesene odgovore; tu dogodek evklid:sprememba. Seme s strežnika
    // (zacetek.js, 60 s) pri ustavljeni uri ne poteče, zato ga test pozabi sam.
    await p.evaluate(() => (window.evklidZacetek?.pozabiVnaprej(), dispatchEvent(new Event("evklid:sprememba")), import("/app.js").then((m) => m.refreshXp())));
    await p.waitForFunction(() => !document.querySelector("#goal-reminder .gr-body"), null, { timeout: 10000 });
    await p.reload();
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    await p.waitForTimeout(1500);
    assert.equal(await p.locator("#goal-reminder .gr-body").count(), 0, "po osvežitvi kartice ni");
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    srv.close();
  }
});

test.after(() => chromium?.close());
