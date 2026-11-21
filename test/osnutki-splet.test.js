// Osnutki (UX maturanta 2 in 9): natipkano vprašanje inštruktorju (po pogovoru) in odgovor naloge (po nalogi) sta v
// sessionStorage, zato preživita osvežitev strani in vrnitev na isto nalogo; po pošiljanju se zbrišeta.
import test from "node:test";
import assert from "node:assert/strict";
import { chromium, opts, streznik, racunZame, stran, zavihek } from "./maturant-splet-pomoc.js";

test("osnutek vprašanja preživi osvežitev, po pošiljanju ga ni; odgovor naloge ostane do preverjanja", opts, async () => {
  const srv = streznik();
  const racun = await racunZame(srv, "osnutki@test.si");
  const { ctx, p } = await stran(srv.base, racun);
  try {
    await p.goto(srv.base + "/");
    await p.waitForSelector("#view-path:not([hidden]) #xp-card", { timeout: 20000 });
    // 1) Klepet: osnutek ostane po osvežitvi (nov pogovor), po pošiljanju ga ni več.
    await zavihek(p, "chat");
    const vprasanje = "Kako začnem z nalogo 5, kjer je f(x) = 2^x?";
    await p.fill("#input", vprasanje);
    await p.reload();
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    await zavihek(p, "chat");
    assert.equal(await p.inputValue("#input"), vprasanje, "osnutek po osvežitvi");
    await p.click("#send");
    await p.waitForSelector("#messages .msg.user", { timeout: 15000 });
    await p.waitForFunction(() => !document.querySelector("#messages .typing"), null, { timeout: 15000 });
    assert.equal(await p.inputValue("#input"), "");
    await p.reload();
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    await zavihek(p, "chat");
    assert.equal(await p.inputValue("#input"), "", "poslano vprašanje se ne vrne");
    assert.equal(await p.evaluate(() => Object.keys(sessionStorage).filter((k) => k.startsWith("evklid.osnutek.")).length), 0);

    // 2) Naloga: odgovor ostane ob vrnitvi na isto nalogo in po osvežitvi; po »Preveri« se osnutek zbriše.
    // Kartica Danes → tema → naloga (preizkus predznanja preskočimo, kot test/povabi-brskalnik.test.js).
    const naNalogo = async () => {
      if (await p.locator("#view-path").isHidden()) await zavihek(p, "path");
      await p.click("#xp-card [data-danes-topic]");
      await p.waitForSelector("#view-topic:not([hidden])", { timeout: 15000 });
      for (let i = 0; i < 20 && !(await p.locator("#practice .card.task[data-task-id]").isVisible()); i++) {
        for (const sel of ["#pt-practice", "#t-practice", "#ex-next"]) if (await p.locator(sel).isVisible()) await p.click(sel, { timeout: 2000 }).catch(() => {});
        await p.waitForTimeout(300);
      }
      await p.waitForSelector("#practice .card.task[data-task-id]", { timeout: 15000 });
      return p.getAttribute("#practice .card.task", "data-task-id");
    };
    const shranjen = (t) => p.evaluate((x) => sessionStorage.getItem(`evklid.odgovor.${x}`), `${racun.id}.${t}`);
    const id = await naNalogo();
    if (!(await p.locator("#answer").count())) return; // naloga z izbiro: polja za odgovor ni
    await p.fill("#answer", "42");
    assert.equal(await shranjen(id), "42");
    // Odhod z naloge (← na Učno pot) in nazaj na isto nalogo: odgovor je še v polju.
    await p.click("#back-to-path");
    await p.waitForSelector("#view-path:not([hidden])", { timeout: 15000 });
    assert.equal(await naNalogo(), id, "ista naloga");
    assert.equal(await p.inputValue("#answer"), "42", "odgovor ob vrnitvi na isto nalogo");
    // Osvežitev: osnutek ostane v sessionStorage (in se vrne, ko se naloga spet izriše).
    await p.reload();
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    assert.equal(await shranjen(id), "42", "osnutek preživi osvežitev");
    // Po »Preveri« osnutka ni več.
    if (await p.locator("#practice .card.task").getAttribute("data-task-id").catch(() => null) !== id) await naNalogo();
    if ((await p.getAttribute("#practice .card.task", "data-task-id")) === id) {
      assert.equal(await p.inputValue("#answer"), "42", "odgovor po osvežitvi");
      await p.locator("#practice .answer-row button.primary").click();
      await p.waitForFunction((t) => sessionStorage.getItem(`evklid.odgovor.${t}`) === null, `${racun.id}.${id}`, { timeout: 15000 }); // po preverjanju ni osnutka
    }
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    srv.close();
  }
});

test.after(() => chromium?.close());
