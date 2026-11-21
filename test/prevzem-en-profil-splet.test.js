// »Profil je odprt drugje« pri računu z enim profilom (UX maturanta 7 in 2): okno ponudi »Nadaljuj tukaj« in »Odjava«
// (»Izberi drug profil« je odprl prazen meni in prazno Učno pot), po »Nadaljuj tukaj« je natipkano vprašanje še v polju.
import test from "node:test";
import assert from "node:assert/strict";
import { chromium, opts, streznik, racunZame, prijava, stran, zavihek } from "./maturant-splet-pomoc.js";

test("en profil: prevzem ponudi Nadaljuj tukaj in Odjava, osnutek ostane", opts, async () => {
  const srv = streznik();
  const email = "prevzem@test.si";
  const racun = await racunZame(srv, email);
  const { ctx, p } = await stran(srv.base, racun);
  try {
    await p.goto(srv.base + "/");
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    await zavihek(p, "chat");
    const vprasanje = "Dolgo vprašanje o nalogi 5 iz pole 2024";
    await p.fill("#input", vprasanje);
    // Druga naprava istega računa prevzame profil.
    const drugje = await prijava(srv.base, email);
    const r = await fetch(`${srv.base}/api/students/${racun.id}/claim`, { method: "POST", headers: { cookie: drugje } });
    assert.equal(r.status, 200);
    await p.click("#send");
    await p.waitForSelector("#taken-overlay", { timeout: 15000 });
    assert.equal(await p.locator("#taken-other").count(), 0, "brez »Izberi drug profil«");
    assert.equal(await p.locator("#taken-logout").innerText(), "Odjava");
    assert.ok(await p.locator("#taken-here").isVisible());
    assert.equal(await p.inputValue("#input"), vprasanje);
    await Promise.all([p.waitForNavigation(), p.click("#taken-here")]);
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    if (await p.locator("#view-chat").isHidden()) await zavihek(p, "chat");
    assert.equal(await p.inputValue("#input"), vprasanje, "vprašanje po »Nadaljuj tukaj«");
    assert.equal(await p.locator("#taken-overlay").count(), 0);
    // »Odjava« v oknu odjavi (druga naprava profil spet prevzame).
    await fetch(`${srv.base}/api/students/${racun.id}/claim`, { method: "POST", headers: { cookie: drugje } });
    await p.click("#send");
    await p.waitForSelector("#taken-logout", { timeout: 15000 });
    await Promise.all([p.waitForURL(/odjava=1/, { timeout: 15000 }), p.click("#taken-logout")]);
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    srv.close();
  }
});

test.after(() => chromium?.close());
