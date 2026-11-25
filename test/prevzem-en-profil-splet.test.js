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
    // Okno prevzema odpre katerikoli odgovor 409 (public/account.js), tudi zahteva, ki jo stran pošlje sama (po nalaganju
    // in osvežitvi jih je več): okno je lahko že čez gumb, preden ga test pritisne, in klik miške bi 30 s čakal, ker okno
    // prestreže kazalec. Zato pošiljanje prek DOM: ob odprtem oknu vrne strežnik spet 409 in okno ostane eno samo.
    const poslji = () => p.evaluate(() => document.querySelector("#send").click());
    await poslji();
    await p.waitForSelector("#taken-overlay", { timeout: 15000 });
    assert.equal(await p.locator("#taken-other").count(), 0, "brez »Izberi drug profil«");
    assert.equal(await p.locator("#taken-logout").innerText(), "Odjava");
    assert.ok(await p.locator("#taken-here").isVisible());
    // Okno v jeziku vmesnika (mob.taken*), z imenom druge naprave; dialog z aria-modal, fokus v njem, Tab ostane v njem.
    assert.equal(await p.locator("#taken-title").innerText(), "Profil je odprt drugje");
    assert.match(await p.locator("#taken-text").innerText(), /Če nadaljuješ tukaj, se tam zapre\./);
    // Neznana naprava (fetch brez brskalnika): prevedeni napis, ne slovenski privzeti z strežnika.
    assert.match(await p.locator("#taken-overlay").innerText(), /Neznana naprava/);
    assert.doesNotMatch(await p.locator("#taken-overlay").innerText(), /druga naprava|\nNaprava\n/);
    const dlg = p.locator('#taken-overlay [role="dialog"][aria-modal="true"]');
    assert.equal(await dlg.getAttribute("aria-labelledby"), "taken-title");
    const fokus = () => p.evaluate(() => document.activeElement?.id);
    assert.equal(await fokus(), "taken-here");
    await p.keyboard.press("Tab");
    assert.equal(await fokus(), "taken-logout");
    await p.keyboard.press("Tab");
    assert.equal(await fokus(), "taken-here", "Tab ostane v oknu");
    await p.keyboard.press("Shift+Tab");
    assert.equal(await fokus(), "taken-logout");
    assert.equal(await p.inputValue("#input"), vprasanje);
    await Promise.all([p.waitForNavigation(), p.click("#taken-here")]);
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    if (await p.locator("#view-chat").isHidden()) await zavihek(p, "chat");
    assert.equal(await p.inputValue("#input"), vprasanje, "vprašanje po »Nadaljuj tukaj«");
    assert.equal(await p.locator("#taken-overlay").count(), 0);
    // »Odjava« v oknu odjavi (druga naprava profil spet prevzame).
    await fetch(`${srv.base}/api/students/${racun.id}/claim`, { method: "POST", headers: { cookie: drugje } });
    await poslji();
    await p.waitForSelector("#taken-logout", { timeout: 15000 });
    await Promise.all([p.waitForURL(/odjava=1/, { timeout: 15000 }), p.click("#taken-logout")]);
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    srv.close();
  }
});

test.after(() => chromium?.close());
