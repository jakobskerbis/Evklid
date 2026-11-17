// Gumbi za tisk v aplikaciji za Android (j, 17. 11. 2026): lekcija, povzetek in delovni list se odprejo v Chromu,
// delovni list (in poskus, projekt) prek povezave za 10 minut, ker Chrome ni prijavljen v Evklid.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { createTiskPovezave, TISK_MS } from "../server/gradiva.js";
import { zaTisk } from "../public/tisk-v-chromu.js";

const O = "https://evklid.app";
const OHM = "FIZ-OS-9/upor-in-ohmov-zakon";

test("aplikacija: katere strani odpre Chrome", () => {
  assert.equal(zaTisk(`${O}/ucbenik/MAT-SS-1/potence?l=sl#natisni`, O), true);
  assert.equal(zaTisk(`${O}/gradiva/povzetek/FIZ-OS-9/upor-in-ohmov-zakon`, O), true);
  assert.equal(zaTisk(`${O}/gradiva/tisk/abc#natisni`, O), true);
  assert.equal(zaTisk(`${O}/ucbenik-pdf/MAT-SS-1?l=sl`, O), true, "zastarel PDF preusmeri na tisk v brskalniku");
  assert.equal(zaTisk(`${O}/ucbenik`, O), false, "stran aplikacije");
  assert.equal(zaTisk(`${O}/`, O), false);
  assert.equal(zaTisk(`${O}/api/students/1/gradiva/delovni-list?topic=x`, O), false);
  assert.equal(zaTisk(`${O}/gradiva/tisk/`, O), false);
  assert.equal(zaTisk(`https://evklid.app.zlo.si/ucbenik/x`, O), false, "samo strani Evklida");
  assert.equal(zaTisk(`https://drugo.si/ucbenik/x`, O), false);
  assert.equal(zaTisk(`${O}/ucbenik/x`, ""), false);
  const web = readFileSync(new URL("../mobile/src/app/web.tsx", import.meta.url), "utf8");
  assert.match(web, /if \(zaTisk\(u\)\) Linking\.openURL\(u\)/, "target=_blank (lekcija, povzetek)");
  assert.match(web, /if \(zaTisk\(req\.url\)\) Linking\.openURL\(req\.url\)/, "navigacija (povezava za tisk)");
  assert.match(web, /m\?\.t === "tisk" && typeof m\.url === "string" && zaTisk\(m\.url\)/, "sporočilo strani (delovni list)");
});

test("povezave za tisk: 10 minut, naključne, omejeno število", () => {
  let t = 1_000_000;
  const p = createTiskPovezave({ now: () => t });
  const a = p.add("<p>a</p>");
  const b = p.add("<p>b</p>");
  assert.match(a, /^[\w-]{32}$/);
  assert.notEqual(a, b);
  assert.equal(p.get(a), "<p>a</p>");
  assert.equal(p.get(a), "<p>a</p>", "osvežitev strani v 10 minutah dela");
  assert.equal(p.get("x".repeat(32)), null);
  t += TISK_MS - 1;
  assert.equal(p.get(b), "<p>b</p>");
  t += 1;
  assert.equal(p.get(b), null, "po 10 minutah ne");
  for (let i = 0; i < 100; i++) p.add(`<p>${i}</p>`, `s:${i}`);
  assert.ok(p.size <= 60, "najstarejše gredo ven");
  // En lastnik ima največ 5 povezav: ne izrine povezav drugih.
  const q = createTiskPovezave({ now: () => t });
  const tuja = q.add("<p>tuja</p>", "s:2");
  const moje = [];
  for (let i = 0; i < 20; i++) moje.push(q.add(`<p>${i}</p>`, "s:1"));
  assert.equal(q.get(tuja), "<p>tuja</p>");
  assert.equal(q.size, 6);
  assert.equal(q.get(moje[19]), "<p>19</p>");
  assert.equal(q.get(moje[0]), null);
});

test("HTTP: delovni list s ?povezava=1 vrne povezavo, ki brez prijave pokaže isti list", async () => {
  const store = openDb(":memory:");
  const app = createApp(store);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = store.createStudent("Ana");
    let r = await fetch(`${base}/api/students/${s.id}/gradiva/delovni-list?topic=${OHM}&seme=7&n=3&povezava=1`);
    assert.equal(r.status, 200);
    assert.equal(r.headers.get("cache-control"), "no-store");
    const d = await r.json();
    assert.match(d.url, /^\/gradiva\/tisk\/[\w-]{32}$/);
    assert.equal(d.velja_s, 600);
    r = await fetch(base + d.url);
    assert.equal(r.status, 200);
    assert.equal(r.headers.get("referrer-policy"), "no-referrer");
    assert.equal(r.headers.get("x-robots-tag"), "noindex");
    assert.match(await r.text(), /koda lista 7/);
    // Brez ?povezava=1 stran kot prej.
    r = await fetch(`${base}/api/students/${s.id}/gradiva/delovni-list?topic=${OHM}&seme=7&n=3`);
    assert.match(r.headers.get("content-type"), /html/);
    // Napaka ali tuj dostop: brez povezave.
    const before = app.locals.tiskPovezave.size;
    assert.equal((await fetch(`${base}/api/students/${s.id}/gradiva/delovni-list?topic=X/y&povezava=1`)).status, 404);
    assert.equal((await fetch(`${base}/api/students/999999/gradiva/delovni-list?topic=${OHM}&povezava=1`)).status, 404);
    assert.equal((await fetch(`${base}/api/students/${s.id}/gradiva/stran?vrsta=nic&topic=${OHM}&povezava=1`)).status, 400);
    assert.equal(app.locals.tiskPovezave.size, before);
    // Neznan ali potekel žeton: prijazna stran, 410.
    r = await fetch(`${base}/gradiva/tisk/${"a".repeat(32)}`);
    assert.equal(r.status, 410);
    assert.match(await r.text(), /Povezava je potekla/);
    assert.equal((await fetch(`${base}/gradiva/tisk/kratek`)).status, 410);
  } finally {
    server.close();
  }
});

test("odjemalec: v aplikaciji povezava za tisk, sicer novo okno", () => {
  const src = readFileSync(new URL("../public/gradiva.js", import.meta.url), "utf8");
  assert.match(src, /povezava=1/);
  assert.match(src, /d\.url\.startsWith\("\/gradiva\/tisk\/"\)/);
  assert.match(src, /const to = `\$\{location\.origin\}\$\{d\.url\}#natisni`/);
  assert.match(src, /window\.EvklidNative\?\.tisk && window\.ReactNativeWebView\?\.postMessage/, "nova aplikacija: sporočilo");
  assert.match(src, /return location\.assign\(to\)/, "starejša aplikacija: stran kar v WebView");
});
