// »Vprašaj inštruktorja« v naši maturitetni poli (UX maturanta 5): ← v klepetu in tipka Nazaj (Android, brskalnik)
// vrneta na stran NPZ in matura z odprto polo pri isti nalogi (prej zaprta pola oziroma Učna pot).
import test from "node:test";
import assert from "node:assert/strict";
import { chromium, opts, streznik, racunZame, stran, zavihek } from "./maturant-splet-pomoc.js";

test("pola → Vprašaj inštruktorja → ← ali Nazaj: pola je spet odprta pri isti nalogi", opts, async () => {
  const srv = streznik();
  const racun = await racunZame(srv, "pola@test.si");
  const { ctx, p } = await stran(srv.base, racun);
  try {
    await p.goto(srv.base + "/");
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    const naNalogi = (i) =>
      p.evaluate((n) => {
        const el = document.querySelector(`.op-task[data-op-i="${n}"]`);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top > -10 && r.top < innerHeight;
      }, i);
    for (const nazaj of ["puscica", "tipka"]) {
      if (await p.locator("#view-exams").isHidden()) await zavihek(p, "exams");
      await p.locator("[data-pp-ours]").first().click();
      await p.waitForSelector(".op-task", { timeout: 15000 });
      const i = 4; // A5
      await p.locator(`.op-task[data-op-i="${i}"]`).scrollIntoViewIfNeeded();
      await p.locator(`.op-task[data-op-i="${i}"] [data-op-tutor]`).first().click();
      await p.waitForSelector("#view-chat:not([hidden])", { timeout: 15000 });
      assert.equal(await p.locator(".op-task").count(), 0, "pola je med klepetom zaprta");
      if (nazaj === "puscica") await p.click("#chat-back");
      else await p.goBack();
      await p.waitForSelector(".op-task", { timeout: 15000 });
      assert.ok(await p.locator("#view-exams").isVisible(), `${nazaj}: stran NPZ in matura`);
      assert.ok(await naNalogi(i), `${nazaj}: pola pri isti nalogi`);
      await p.keyboard.press("Escape");
      await p.waitForFunction(() => !document.querySelector(".op-task"));
    }
    // Iz klepeta, ki ni odprt iz pole, ← vodi kot prej (Učna pot), pole ne odpre.
    await zavihek(p, "chat");
    await p.click("#chat-back");
    await p.waitForTimeout(500);
    assert.equal(await p.locator(".op-task").count(), 0);
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    srv.close();
  }
});

test.after(() => chromium?.close());
