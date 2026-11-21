// Račun »Zame« (maturantka z računom zase, UX maturanta 10): kjer je bilo besedilo za starše, je besedilo za učenca
// (»Naročnina in profil«, »lahko odgovarjaš z glasom«, »Ko se prijatelj, ki ga povabiš …«). Ponudba ostane ista.
import test from "node:test";
import assert from "node:assert/strict";
import { chromium, opts, streznik, racunZame, stran, zavihek } from "./maturant-splet-pomoc.js";

test("račun Zame: Jaz in Račun nagovorita učenca, ne starša", opts, async () => {
  const srv = streznik();
  const racun = await racunZame(srv, "zame@test.si");
  const { ctx, p } = await stran(srv.base, racun);
  try {
    await p.goto(srv.base + "/");
    await p.waitForSelector("#xp-card [data-danes-topic]", { state: "attached", timeout: 20000 });
    await zavihek(p, "me");
    const vrstica = p.locator('#view-me [data-go="account"]:visible').first();
    assert.match(await vrstica.innerText(), /Naročnina in profil/);
    assert.doesNotMatch(await vrstica.innerText(), /otroci/);
    await vrstica.click();
    await p.waitForSelector("#view-account:not([hidden]) #ref-url", { timeout: 20000 });
    await p.waitForSelector("#ustno-starsi .us-stars", { timeout: 20000 });
    const racunTxt = await p.locator("#view-account").innerText();
    assert.match(racunTxt, /Ko se prijatelj, ki ga povabiš, naroči in prvič plača, oba dobita en mesec brezplačno\./);
    assert.match(racunTxt, /lahko odgovarjaš z glasom/);
    assert.doesNotMatch(racunTxt, /obe družini|lahko otrok odgovarja|dokler ga ne vklopite/);
    assert.deepEqual(p.napake, []);
  } finally {
    await ctx.close();
    srv.close();
  }
});

test.after(() => chromium?.close());
