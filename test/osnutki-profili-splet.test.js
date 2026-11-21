// Osnutki in profili (pregled #917, 2. prehod, 1 in 2): ob menjavi profila brez osvežitve natipkano vprašanje
// prejšnjega profila izgine iz polja in se ne shrani kot osnutek drugega profila; odjava pobriše osnutke zavihka.
import test from "node:test";
import assert from "node:assert/strict";
import { chromium, opts, streznik, stran, zavihek, MATURANT } from "./maturant-splet-pomoc.js";

const GESLO = "Profil-9876";
async function druzina({ base, store }, email) {
  const reg = await fetch(`${base}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: "geslo1234", accept_privacy: true, birth_date: "1980-03-03" }) });
  assert.equal(reg.status, 201);
  const cookie = reg.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
  store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run(email);
  const ids = [];
  for (const name of ["Ana", "Bor"]) {
    const body = { name, birth_year: 2009, consent: true, settings: MATURANT, profile_password: GESLO, other_passwords: Object.fromEntries(ids.map((i) => [i, GESLO])) };
    const s = await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json", cookie }, body: JSON.stringify(body) });
    assert.equal(s.status, 201, await s.clone().text());
    ids.push((await s.json()).id);
  }
  return { cookie, ids };
}

test("menjava profila: vprašanje Ane ne ostane Boru; odjava pobriše osnutke", opts, async () => {
  const srv = streznik();
  const { cookie, ids } = await druzina(srv, "druzina@test.si");
  const [ana, bor] = ids;
  const { ctx, p } = await stran(srv.base, { cookie, id: ana });
  const pripravljen = () => p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
  try {
    await p.goto(srv.base + "/");
    for (const id of ids) await p.evaluate(([i, g]) => fetch(`/api/students/${i}/unlock`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: g }) }), [id, GESLO]);
    await p.reload();
    await pripravljen();
    await zavihek(p, "chat");
    await p.fill("#input", "SKRIVNOST ANE");
    await p.evaluate((i) => sessionStorage.setItem(`evklid.odgovor.${i}.7`, "42"), ana);
    // Menjava v meniju profila (brez osvežitve strani).
    await zavihek(p, "path"); // gumb profila je v zgornji vrstici (v klepetu na telefonu je skrita)
    await p.click(".profile-btn");
    await p.click(`.pm-student[data-id="${bor}"]`);
    await p.waitForFunction((i) => localStorage.getItem("studentId") === String(i), bor, { timeout: 15000 });
    await p.waitForTimeout(500);
    if (await p.locator("#view-chat").isHidden()) await zavihek(p, "chat");
    assert.equal(await p.inputValue("#input"), "", "Borovo polje je prazno");
    await p.type("#input", "B");
    const shramba = await p.evaluate(() => Object.fromEntries(Object.entries(sessionStorage).filter(([k]) => /^evklid\.(osnutek|odgovor)\./.test(k))));
    assert.equal(shramba[`evklid.osnutek.${bor}.nov`], "B");
    assert.ok(!Object.entries(shramba).some(([k, v]) => k.startsWith(`evklid.osnutek.${bor}.`) && /SKRIVNOST/.test(v)), JSON.stringify(shramba));
    // Nazaj k Ani: njen osnutek se vrne.
    await zavihek(p, "path");
    await p.click(".profile-btn");
    await p.click(`.pm-student[data-id="${ana}"]`);
    await p.waitForFunction((i) => localStorage.getItem("studentId") === String(i), ana, { timeout: 15000 });
    await p.waitForFunction(() => document.querySelector("#input").value === "SKRIVNOST ANE", null, { timeout: 15000 });
    // Odjava: v zavihku ne ostane noben osnutek.
    await p.evaluate(() => import("/account.js").then((m) => m.logout()));
    await p.waitForURL(/odjava=1/, { timeout: 15000 });
    assert.deepEqual(await p.evaluate(() => Object.keys(sessionStorage).filter((k) => /^evklid\.(osnutek|odgovor)\./.test(k))), []);
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    srv.close();
  }
});

test.after(() => chromium?.close());
