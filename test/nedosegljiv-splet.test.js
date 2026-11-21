// Internet dela, Evklid pa ne odgovori (UX maturanta 11): klepet ne trdi »Ni povezave z internetom«, ampak »Evklid
// trenutno ni dosegljiv. Poskusi čez minuto; tvoje vprašanje je ostalo v polju.« in vprašanje res ostane v polju.
import test from "node:test";
import assert from "node:assert/strict";
import SL from "../public/i18n/sl.js";
import { chromium, opts, streznik, racunZame, stran, zavihek } from "./maturant-splet-pomoc.js";

test("strežnik nedosegljiv ob delujočem internetu: pravo sporočilo, vprašanje ostane", opts, async () => {
  assert.equal(SL["off.serverUnreachable"], "Evklid trenutno ni dosegljiv. Poskusi čez minuto; tvoje vprašanje je ostalo v polju.");
  const srv = streznik();
  const racun = await racunZame(srv, "izpad@test.si");
  const { ctx, p } = await stran(srv.base, racun);
  try {
    await p.goto(srv.base + "/");
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    await zavihek(p, "chat");
    // Izpad strežnika: vsak klic API pogovorov se prekine (brskalnik je povezan, navigator.onLine === true).
    await p.route("**/api/**conversations**", (r) => r.abort("connectionrefused"));
    const vprasanje = "Kako rešim enačbo 2^x = 8?";
    await p.fill("#input", vprasanje);
    await p.click("#send");
    const napaka = p.locator("#messages .msg.error, #messages .msg.assistant").last();
    await napaka.waitFor({ timeout: 20000 });
    await p.waitForFunction(() => !document.querySelector("#messages .typing"), null, { timeout: 20000 });
    const besedilo = await p.locator("#messages").innerText();
    assert.match(besedilo, /Evklid trenutno ni dosegljiv\. Poskusi čez minuto; tvoje vprašanje je ostalo v polju\./);
    assert.doesNotMatch(besedilo, /Ni povezave z internetom/);
    assert.equal(await p.inputValue("#input"), vprasanje, "vprašanje ostane v polju");
    // Brez interneta ostane »Ni povezave z internetom.«
    await ctx.setOffline(true);
    await p.click("#send");
    await p.waitForFunction(() => /Ni povezave z internetom/.test(document.querySelector("#messages").innerText), null, { timeout: 20000 });
    await ctx.setOffline(false);
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    srv.close();
  }
});

test.after(() => chromium?.close());
