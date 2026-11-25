// Laboratorij → šibke točke učenca (docs/sibke-tocke.md, #1094): prvo preverjanje napovedi, sklepa in računa javi
// dogodek »evklid:lab-preverjeno« (public/sim/lab.js), public/laboratorij.js pošlje POST /api/students/:id/tool-check.
// Nikoli vpisana vrednost, nikoli po »Pokaži rešitev«, ponovni poskusi ne štejejo.
import test, { before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { sibkaTocka, LAB_PREVERJENO } from "../public/sim/lab.js";
import { playwright, serve, odpri, meriOhm } from "./laboratorij-pomoc.js";

const TOOL_ITEM = /^[A-Za-z0-9_:.\/-]{1,80}$/; // server/weaknesses.js

test("tool-check body: lab source, the closest topic, a stable item without the student's input", () => {
  const x = { key: "lab-ohm", topics: [{ id: "fiz-ohm" }, { id: "druga" }] };
  assert.deepEqual(sibkaTocka(x, null, { vrsta: "napoved:tok-6V", ok: false }), { source: "lab", topic: "fiz-ohm", item: "ohm:napoved:tok-6V", ok: false });
  assert.equal(sibkaTocka(x, null, { vrsta: "racun:R Ω", ok: true }).item, "ohm:racun:R__");
  const long = sibkaTocka(x, null, { vrsta: "racun:" + "x".repeat(200), ok: true }).item;
  assert.ok(TOOL_ITEM.test(long) && long.length === 80);
  assert.equal(sibkaTocka({ key: "lab-ohm", topics: [] }, null, { vrsta: "racun", ok: true }), null, "brez teme ni zapisa");
  assert.equal(sibkaTocka(x, null, { vrsta: "racun", ok: "da" }), null, "ok mora biti true/false");
  assert.equal(LAB_PREVERJENO, "evklid:lab-preverjeno");
  // Pogled Laboratorij posluša dogodek in pošlje telo na tool-check (le za izbranega učenca).
  const src = fs.readFileSync("public/laboratorij.js", "utf8");
  assert.match(src, /m\.addEventListener\("evklid:lab-preverjeno"/);
  assert.match(src, /D\.api\(`\/api\/students\/\$\{s\.id\}\/tool-check`, \{ method: "POST", body \}\)/);
});

let browser = null;
before(async () => {
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
});

test("lab-ohm in a browser: first prediction, conclusion and calculation checks are reported once", { timeout: 120000 }, async (t) => {
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const ctx = await browser.newContext({ locale: "sl-SI", viewport: { width: 360, height: 740 } });
  const { p, errs } = await odpri(ctx, base, "lab-ohm");
  await p.evaluate(() => {
    window.javljeno = [];
    document.getElementById("m").addEventListener("evklid:lab-preverjeno", (e) => javljeno.push({ ...e.detail, item: lab.sibkaTocka({ key: "lab-ohm", topics: [{ id: "t" }] }, document.getElementById("m"), e.detail, e.target).item }));
  });
  const jav = () => p.evaluate(() => javljeno.map((x) => [x.item, x.ok]));
  // Napoved 30 mA (napačna), meritve do 6 V: ena javitev ob prvi primerjavi.
  await p.locator(".lab-napoved input").fill("30");
  await p.locator(".lab-napoved").getByRole("button", { name: "Zapiši napoved" }).click();
  await meriOhm(p, [2, 4, 6]);
  await p.waitForTimeout(500);
  assert.deepEqual(await jav(), [["ohm:napoved:tok-6V", false]]);
  // Račun: »Vpiši število« ne šteje; prvi številčni račun šteje (napačen), naslednji (pravilen) ne več.
  await p.locator(".lab-racun input").fill("abc");
  await p.locator(".lab-racun").getByRole("button", { name: "Preveri moj račun" }).click();
  assert.equal((await jav()).length, 1);
  await p.locator(".lab-racun input").fill("1");
  await p.locator(".lab-racun").getByRole("button", { name: "Preveri moj račun" }).click();
  const r = await jav();
  assert.equal(r.length, 2);
  assert.match(r[1][0], /^ohm:racun:/);
  assert.equal(r[1][1], false);
  assert.ok(!r[1][0].includes(":1"), "vpisana vrednost ni v id");
  await p.locator(".lab-racun").getByRole("button", { name: "Pokaži rešitev" }).click();
  assert.equal((await jav()).length, 2, "»Pokaži rešitev« ne šteje");
  // Sklep (gradnik lab.conclusion, drugi .lab-q v poskusu): prva izbira šteje, po »Poskusi znova« ne več.
  await p.evaluate(() => {
    const m = document.getElementById("m");
    for (let k = 0; k < 2; k++) m.append(lab.conclusion({ text: `Vprašanje ${k}`, options: [{ t: "prav", ok: true, why: "a" }, { t: "narobe", ok: false, why: "b" }] }));
  });
  const q = p.locator(".lab-q").last();
  const n = await p.locator(".lab-q").count();
  await q.locator(".lab-opt").nth(1).click();
  const s = await jav();
  assert.equal(s.length, 3);
  assert.deepEqual(s[2], [`ohm:sklep${n - 1}`, false]);
  await q.getByRole("button", { name: "Poskusi znova" }).click();
  await q.locator(".lab-opt").first().click();
  assert.equal((await jav()).length, 3, "ponovni poskus ne šteje");
  for (const [item] of await jav()) assert.ok(TOOL_ITEM.test(item), item);
  assert.deepEqual(errs, []);
  await ctx.close();
});
