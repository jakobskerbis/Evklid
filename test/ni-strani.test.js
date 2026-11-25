// Kratke povezave /pogoji, /zasebnost, /starsi, /garancija in prijazna stran 404 (server/ni-strani.js;
// pregled celotne aplikacije, 17. 11. 2026: prej »Cannot GET«).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { KRATKE_POTI, KRATKA_SIDRA } from "../server/ni-strani.js";
import { BRAND } from "../server/brand.js";

async function withServer(fn) {
  const server = createApp(openDb(":memory:"), { scheduler: false }).listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

test("kratke povezave preusmerijo na stran .html (poizvedba ostane), stran se odpre", async () => {
  await withServer(async (base) => {
    assert.deepEqual(Object.keys(KRATKE_POTI).sort(), ["/garancija", "/odstop", "/pogoji", "/sole.html", "/starsi", "/zasebnost"]);
    for (const [kratka, cilj] of Object.entries(KRATKE_POTI)) {
      const r = await fetch(base + kratka, { redirect: "manual" });
      assert.equal(r.status, 301, kratka);
      assert.equal(r.headers.get("location"), cilj, kratka);
      const page = await fetch(base + kratka);
      assert.equal(page.status, 200, kratka);
      assert.match(page.headers.get("content-type"), /text\/html/, kratka);
      assert.doesNotMatch(await page.text(), /Cannot GET/, kratka);
    }
    const q = await fetch(`${base}/starsi?vir=letak&x=1`, { redirect: "manual" });
    assert.equal(q.headers.get("location"), "/starsi.html?vir=letak&x=1", "oznaka vira ostane (števec obiskov)");
    assert.equal((await fetch(`${base}/sole`)).status, 200, "/sole ima svojo pot");
  });
});

// Pregled javnih strani 21. 11. 2026, P8: narekovani naslovi in ena stran za šole.
test("kratki naslovi /prijava, /registracija, /cenik, /cene vodijo na sidro (302, poizvedba pred sidrom); POST ostane", async () => {
  await withServer(async (base) => {
    assert.deepEqual(KRATKA_SIDRA, { "/prijava": "/#prijava", "/registracija": "/#registracija", "/cenik": "/o-evklidu#cene", "/cene": "/o-evklidu#cene" });
    for (const [kratka, cilj] of Object.entries(KRATKA_SIDRA)) {
      const r = await fetch(base + kratka, { redirect: "manual" });
      assert.equal(r.status, 302, kratka);
      assert.equal(r.headers.get("location"), cilj, kratka);
      assert.equal((await fetch(base + kratka)).status, 200, `${kratka}: cilj se odpre`);
    }
    const q = await fetch(`${base}/cene?vir=ig`, { redirect: "manual" });
    assert.equal(q.headers.get("location"), "/o-evklidu?vir=ig#cene");
    // Samo GET: POST na /prijava ni preusmerjen (vrata z geslom, server/gate.js, ga obdelajo sama).
    const post = await fetch(`${base}/prijava`, { method: "POST", redirect: "manual", headers: { accept: "text/html" } });
    assert.notEqual(post.status, 302);
    // /sole.html → /sole (301), kanonični naslov na /sole in /starsi.html.
    const sole = await fetch(`${base}/sole.html?vir=x`, { redirect: "manual" });
    assert.equal(sole.status, 301);
    assert.equal(sole.headers.get("location"), "/sole?vir=x");
    assert.match(await (await fetch(`${base}/sole`)).text(), /<link rel="canonical" href="https:\/\/evklid\.app\/sole">/);
    assert.match(await (await fetch(`${base}/starsi.html`)).text(), /<link rel="canonical" href="https:\/\/evklid\.app\/starsi\.html">/);
    // Noga pristajalne strani vodi na /sole, ne na /sole.html.
    const land = await (await fetch(`${base}/index.html`)).text();
    assert.ok(land.includes('href="/sole"') && !land.includes('href="/sole.html"'));
  });
});

test("vrata z geslom: POST /prijava še vedno prijavi, GET /prijava vodi na začetek", async () => {
  const { passwordGate } = await import("../server/gate.js");
  const express = (await import("express")).default;
  const { mountShortLinks } = await import("../server/ni-strani.js");
  const app = express();
  app.use(passwordGate("skrito-geslo"));
  mountShortLinks(app);
  const server = app.listen(0);
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const ok = await fetch(`${base}/prijava`, { method: "POST", redirect: "manual", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "geslo=skrito-geslo&naprej=%2F" });
    assert.equal(ok.status, 303);
    assert.match(ok.headers.get("set-cookie") || "", /_geslo=/);
    const get = await fetch(`${base}/prijava`, { redirect: "manual" });
    assert.equal(get.status, 303);
    assert.equal(get.headers.get("location"), "/");
  } finally {
    server.close();
  }
});

test("neznana pot: stran 404 v slogu aplikacije; API dobi JSON, drugi odjemalci besedilo", async () => {
  await withServer(async (base) => {
    for (const pot of ["/ni-te-strani", "/pogoji/neki", "/POGOJI"]) {
      const r = await fetch(base + pot, { headers: { accept: "text/html,application/xhtml+xml,*/*;q=0.8" } });
      assert.equal(r.status, 404, pot);
      assert.match(r.headers.get("content-type"), /text\/html/, pot);
      const html = await r.text();
      assert.doesNotMatch(html, /Cannot GET/, pot);
      assert.match(html, /Te strani ni/, pot);
      assert.match(html, new RegExp(`href="/"[^>]*>Na začetek – ${BRAND.name}<`), pot);
      assert.match(html, /<meta name="robots" content="noindex">/, pot);
      assert.match(r.headers.get("content-security-policy"), /script-src 'self'/, "varnostne glave ostanejo");
    }
    const api = await fetch(`${base}/api/ni-te-poti`);
    assert.equal(api.status, 404);
    assert.deepEqual(await api.json(), { error: "Pot ne obstaja." });
    const json = await fetch(`${base}/ni-te-strani`, { headers: { accept: "application/json" } });
    assert.equal(json.status, 404);
    assert.match(json.headers.get("content-type"), /text\/plain/);
    const post = await fetch(`${base}/ni-te-strani`, { method: "POST", headers: { accept: "text/html" } });
    assert.equal(post.status, 404);
    assert.doesNotMatch(await post.text(), /Cannot POST/);
    // Obstoječe strani in datoteke se ne spremenijo.
    assert.equal((await fetch(`${base}/pogoji.html`)).status, 200);
    assert.equal((await fetch(`${base}/healthz`)).status, 200);
  });
});
