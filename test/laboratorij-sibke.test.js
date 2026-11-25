// Laboratorij → šibke točke učenca (docs/sibke-tocke.md, #1094): prvi izbor pri »Sklep« in prvi številčni račun javita
// dogodek »evklid:lab-preverjeno« (public/sim/lab.js), public/laboratorij.js pošlje POST /api/students/:id/tool-check.
// Napovedi ne štejejo; nikoli vpisana vrednost, nikoli po »Pokaži rešitev«, ponovni poskusi ne štejejo.
import test, { before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { sibkaTocka, LAB_PREVERJENO, SIBKE_TEME } from "../public/sim/lab.js";
import { labExperiments } from "../public/sim/katalog.js";
import { labList } from "../server/laboratorij.js";
import { getTopic } from "../server/curriculum.js";
import { TOOL_DAY_MAX } from "../server/weaknesses.js";
import { playwright, serve, odpri, meriOhm } from "./laboratorij-pomoc.js";

const TOOL_ITEM = /^[A-Za-z0-9_:.\/-]{1,80}$/; // server/weaknesses.js

test("weak-point topics: only listed topics of the experiment, on the student's own school level", () => {
  const poskusi = new Map(labExperiments().map((x) => [x.key, x]));
  for (const [key, teme] of Object.entries(SIBKE_TEME)) {
    assert.ok(poskusi.has(key), `${key} ni v laboratoriju`);
    for (const id of teme) {
      assert.ok(getTopic(id), `${key}: tema ${id} ne obstaja`);
      assert.ok(poskusi.get(key).topics.some((t) => t.id === id), `${key}: ${id} ni tema poskusa`);
    }
  }
  const za = (pot, key, vrsta = "racun") => sibkaTocka(labList(pot).find((x) => x.key === key), { vrsta, ok: false })?.topic ?? null;
  assert.equal(za("FIZ-OS-9", "lab-ohm"), "FIZ-OS-9/upor-in-ohmov-zakon", "OŠ: Ohmov zakon, ne tok in napetost");
  assert.equal(za("FIZ-SS-2", "lab-ohm"), "FIZ-SS-2/elektricni-tok");
  assert.equal(za("FIZ-OS-8", "lab-lom"), "FIZ-OS-8/lom-svetlobe", "OŠ: lom, ne odboj");
  assert.equal(za("KEM-SS-2", "lab-titracija"), "KEM-SS-2/titracija");
  assert.equal(za("FIZ-SS-2", "lab-grelnik"), null, "srednješolcu ne gre v temo osnovne šole");
  assert.equal(za("KEM-OS-8", "lab-elektroliza"), null, "osnovnošolcu elektroliza ne gre v ionsko vez");
  assert.equal(za("", "lab-ohm"), null, "brez poti ni teme");
  assert.equal(sibkaTocka({ key: "lab-nihalo", topics: [{ id: "x", rank: 0 }] }, { vrsta: "racun", ok: true }), null, "poskus brez seznama ne pošlje");
  const b = sibkaTocka(labList("FIZ-OS-9").find((x) => x.key === "lab-ohm"), { vrsta: "sklep:abc Ω", ok: true });
  assert.deepEqual(b, { source: "lab", topic: "FIZ-OS-9/upor-in-ohmov-zakon", item: "ohm:sklep:abc__", ok: true });
  assert.equal(sibkaTocka(labList("FIZ-OS-9").find((x) => x.key === "lab-ohm"), { vrsta: "racun", ok: "da" }), null, "ok mora biti true/false");
  assert.equal(LAB_PREVERJENO, "evklid:lab-preverjeno");
  assert.equal(TOOL_DAY_MAX.lab, 2, "en poskus v enem dnevu sam ne naredi šibke teme");
  // Pogled Laboratorij posluša dogodek in pošlje telo na tool-check le za profil, ki je poskus odprl.
  const src = fs.readFileSync("public/laboratorij.js", "utf8");
  assert.match(src, /const sid = D\?\.getStudent\(\)\?\.id;\s*m\.addEventListener\("evklid:lab-preverjeno"/);
  assert.match(src, /if \(!s \|\| s\.id !== sid\) return;/);
  assert.match(src, /D\.api\(`\/api\/students\/\$\{s\.id\}\/tool-check`, \{ method: "POST", body \}\)/);
});

let browser = null;
before(async () => {
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
});

test("lab-ohm in a browser: first conclusion and calculation checks are reported once, predictions never", { timeout: 120000 }, async (t) => {
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
    document.getElementById("m").addEventListener("evklid:lab-preverjeno", (e) => javljeno.push([e.detail.vrsta, e.detail.ok]));
  });
  const jav = () => p.evaluate(() => javljeno);
  const preveri = async (x) => {
    await p.locator(".lab-racun input").fill(x);
    await p.locator(".lab-racun").getByRole("button", { name: "Preveri moj račun" }).click();
  };
  // Napoved 30 mA (napačna) in meritve do 6 V: primerjava je vidna, a napoved ne šteje.
  await p.locator(".lab-napoved input").fill("30");
  await p.locator(".lab-napoved").getByRole("button", { name: "Zapiši napoved" }).click();
  await meriOhm(p, [2, 4, 6]);
  await p.waitForTimeout(500);
  assert.equal(await p.evaluate(() => document.querySelector(".lab-primerjava").hidden), false);
  assert.deepEqual(await jav(), []);
  // Račun: »Vpiši število« in zdrs za faktor 10 ne štejeta; prvi pravi napačen račun šteje, naslednji ne več.
  await preveri("abc");
  const R = await p.evaluate(() => {
    const t = [...document.querySelectorAll(".lab-table tbody tr")].map((tr) => [tr.children[2].textContent, tr.children[3].textContent].map((v) => parseFloat(v.replace(",", "."))));
    return t.reduce((a, [U, I]) => a + U * I, 0) / t.reduce((a, [, I]) => a + I * I, 0) * 1000;
  });
  await preveri(String(Math.round(R * 10)));
  assert.deepEqual(await jav(), [], "faktor 10 je zdrs enot");
  await preveri(String(Math.round(R * 1.5)));
  await preveri(String(Math.round(R * 1.6)));
  assert.deepEqual(await jav(), [["racun", false]], "vpisana vrednost ni v id");
  // Sklep (gradnik lab.conclusion): prvi izbor šteje z id iz besedila, po »Poskusi znova« ne več.
  await p.evaluate(() => {
    const m = document.getElementById("m");
    for (const k of [0, 1]) m.append(lab.conclusion({ text: `Vprašanje ${k}`, options: [{ t: "prav", ok: true, why: "a" }, { t: "narobe", ok: false, why: "b" }] }));
  });
  const q = p.locator(".lab-q").last();
  await q.locator(".lab-opt").nth(1).click();
  await q.getByRole("button", { name: "Poskusi znova" }).click();
  await q.locator(".lab-opt").first().click();
  await p.locator(".lab-q").nth(-2).locator(".lab-opt").first().click();
  const s = await jav();
  assert.equal(s.length, 3, JSON.stringify(s));
  assert.equal(s[1][1], false);
  assert.equal(s[2][1], true);
  assert.match(s[1][0], /^sklep:[0-9a-z]+$/);
  assert.notEqual(s[1][0], s[2][0], "različni vprašanji, različna id");
  // Po »Pokaži rešitev« in ponovnem odprtju (obnovljena rešitev) račun ne šteje.
  const { p: p2 } = await odpri(ctx, base, "lab-ohm");
  await p2.evaluate(() => {
    window.javljeno = [];
    document.getElementById("m").addEventListener("evklid:lab-preverjeno", (e) => javljeno.push([e.detail.vrsta, e.detail.ok]));
  });
  await meriOhm(p2, [3, 5]);
  await p2.locator(".lab-racun").getByRole("button", { name: "Pokaži rešitev" }).click();
  await p2.evaluate(() => window.mount("lab-ohm"));
  await p2.evaluate(() => {
    window.javljeno = [];
    document.getElementById("m").addEventListener("evklid:lab-preverjeno", (e) => javljeno.push([e.detail.vrsta, e.detail.ok]));
  });
  await p2.locator(".lab-racun input").fill("1");
  await p2.locator(".lab-racun").getByRole("button", { name: "Preveri moj račun" }).click();
  assert.deepEqual(await p2.evaluate(() => javljeno), [], "po obnovljeni rešitvi ne šteje");
  for (const [v] of [...s]) assert.ok(TOOL_ITEM.test(`ohm:${v}`), v);
  assert.deepEqual(errs, []);
  await ctx.close();
});
