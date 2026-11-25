// Laboratorij: sklep se po prvi izbiri zaklene (»Poskusi znova« ga odklene), meritve (tabela in graf) ostanejo ob vrnitvi
// ali osvežitvi strani (lab.js → shramba, ključ evklid.lab.meritve.<učenec>.<poskus>), »Začni znova« jih pobriše.
import test, { before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { ENGINES } from "../public/sim/index.js";
import { kljucMeritev, vJson, izJsona } from "../public/sim/lab.js";
import { playwright, serve, odpri, meriOhm } from "./laboratorij-pomoc.js";

// Poskusi v datotekah, ki jih ureja PR #994 (kemija, elektrika), dobijo shrambo pozneje.
const POZNEJE = new Set(["lab-kem.js", "lab-indikatorji.js", "lab-reakcije.js", "lab-elektrika.js", "lab-elektrokemija.js"]);

test("every lab engine outside the #994 files keeps its measurements (shramba + vezi)", async () => {
  const ids = Object.keys(ENGINES).filter((k) => k.startsWith("lab-") && !POZNEJE.has(ENGINES[k][0]));
  assert.ok(ids.length >= 18, ids.join());
  for (const id of ids) {
    const [file, name] = ENGINES[id];
    const src = (await import(`../public/sim/${file}`))[name].toString();
    assert.match(src, /const zap = shramba\(el\)/, `${id}: ni shrambe`);
    assert.match(src, /seed: zap\.seed/, `${id}: seme ni shranjeno (drug upornik ali vzmet ob vrnitvi)`);
    assert.match(src, /zap\.vezi\(table/, `${id}: tabela ni vezana na shrambo`);
  }
  const idx = fs.readFileSync("public/sim/index.js", "utf8");
  assert.match(idx, /el\.dataset\.labId = labId/);
});

test("storage key and JSON keep NaN (meter shows OL) instead of turning it into 0", () => {
  assert.equal(kljucMeritev(""), null);
  assert.equal(kljucMeritev("lab-ohm"), "evklid.lab.meritve.0.lab-ohm");
  const x = izJsona(vJson({ a: [1, NaN, Infinity, -Infinity], b: "#x" }));
  assert.equal(x.a[0], 1);
  assert.ok(Number.isNaN(x.a[1]));
  assert.equal(x.a[2], Infinity);
  assert.equal(x.a[3], -Infinity);
  assert.equal(x.b, "#x");
});

let browser = null;
before(async () => {
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
});

test("lab in a browser: locked conclusion, measurements survive reopening and refresh", { timeout: 120000 }, async (t) => {
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await browser.close();
    server.close();
  });

  await t.test("conclusion: after the first choice the others are locked; »Poskusi znova« unlocks", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const { p, errs } = await odpri(ctx, base);
    const r = await p.evaluate(() => {
      const q = window.lab.conclusion({ text: "?", options: [{ t: "A", ok: true, why: "zato A" }, { t: "B", ok: false, why: "zato ne B" }, { t: "C", ok: false, why: "zato ne C" }] });
      document.getElementById("m").append(q);
      const [a, b, c] = q.querySelectorAll(".lab-opt"), why = q.querySelector(".lab-why"), again = q.querySelector(".lab-again");
      const out = { againBefore: again.hidden };
      b.click();
      out.first = [b.className, why.textContent, again.hidden];
      a.click(); // zaklenjeno: nič se ne zgodi
      c.click();
      out.locked = [a.className, c.className, why.textContent, [a, b, c].map((x) => x.getAttribute("aria-disabled")).join()];
      again.click();
      out.reset = [[a, b, c].map((x) => x.className).join("|"), why.hidden, again.hidden, document.activeElement === a];
      a.click();
      out.second = [a.className, why.textContent];
      return out;
    });
    assert.equal(r.againBefore, true, "»Poskusi znova« pred izbiro ni viden");
    assert.deepEqual(r.first, ["lab-opt bad", "Ne čisto. zato ne B", false]);
    assert.deepEqual(r.locked, ["lab-opt", "lab-opt", "Ne čisto. zato ne B", "true,true,true"]);
    assert.deepEqual(r.reset, ["lab-opt|lab-opt|lab-opt", true, true, true]);
    assert.deepEqual(r.second, ["lab-opt ok", "Pravilno. zato A"]);
    assert.deepEqual(errs, []);
    await ctx.close();
  });

  await t.test("lab-ohm: rows and graph points come back after reopening and after a page refresh; »Začni znova« clears", async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const { p, errs } = await odpri(ctx, base, "lab-ohm");
    await meriOhm(p, [2, 4, 6]);
    const stanje = () => p.evaluate(() => ({
      rows: [...document.querySelectorAll(".lab-table tbody tr")].map((tr) => tr.textContent),
      pts: document.querySelectorAll(".lab-graph .lab-pt").length,
      fit: document.querySelector(".lab-fitout")?.textContent || "",
      bar: !!document.querySelector(".lab-obnova"),
      key: Object.keys(localStorage).filter((k) => k.startsWith("evklid.lab.meritve.")),
    }));
    const prej = await stanje();
    assert.equal(prej.rows.length, 3);
    assert.equal(prej.pts, 3);
    assert.deepEqual(prej.key, ["evklid.lab.meritve.0.lab-ohm"]);
    assert.equal(prej.bar, false, "pri novih meritvah ni obvestila o obnovi");
    // znova odprt poskus (drug pogled in nazaj): iste vrstice, iste točke, ista premica
    await p.evaluate(() => window.mount("lab-ohm"));
    const po = await stanje();
    assert.deepEqual(po.rows, prej.rows);
    assert.equal(po.pts, 3);
    assert.equal(po.fit, prej.fit);
    assert.equal(po.bar, true);
    // osvežitev strani
    await p.reload();
    await p.waitForFunction(() => window.ready);
    await p.evaluate(() => window.mount("lab-ohm"));
    assert.deepEqual((await stanje()).rows, prej.rows);
    // nova meritev se doda obnovljenim
    await meriOhm(p, [8]);
    assert.equal((await stanje()).rows.length, 4);
    // »Začni znova«: prazna tabela, prazen graf, nič v shrambi
    await p.getByRole("button", { name: "Začni znova" }).click();
    await p.waitForFunction(() => !document.querySelector(".lab-obnova"));
    const zdaj = await stanje();
    assert.deepEqual([zdaj.rows.length, zdaj.pts, zdaj.key.length], [0, 0, 0]);
    // drug učenec na isti napravi ne vidi meritev prvega
    await meriOhm(p, [3]);
    await p.evaluate(() => localStorage.setItem("studentId", "42"));
    await p.evaluate(() => window.mount("lab-ohm"));
    assert.equal((await stanje()).rows.length, 0);
    assert.deepEqual(errs, []);
    await ctx.close();
  });

  await t.test("lab-hooke and lab-mesanje restore table, graph and calculation", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const { p, errs } = await odpri(ctx, base, "lab-hooke");
    // shranjeno stanje kot ga zapiše poskus: vrstice tabele, meritve za graf, začetni odčitek vzmeti
    await p.evaluate(() => {
      localStorage.setItem("evklid.lab.meritve.0.lab-hooke", JSON.stringify({ v: 1, seed: 5, rows: [{ vz: "mehka", m: "0", F: "0,00", r: "10,0", x: "0,0" }, { vz: "mehka", m: "100", F: "0,98", r: "14,9", x: "4,9" }, { vz: "mehka", m: "200", F: "1,96", r: "19,8", x: "9,8" }], meas: [{ g: "mehka", x: 0, y: 0, id: "mehka" }, { g: "mehka", x: 4.9, y: 0.981, id: "mehka" }, { g: "mehka", x: 9.8, y: 1.962, id: "mehka" }], x0: { mehka: 0.1 } }));
    });
    await p.evaluate(() => window.mount("lab-hooke"));
    const h = await p.evaluate(() => ({ rows: document.querySelectorAll(".lab-table tbody tr").length, pts: document.querySelectorAll(".lab-graph .lab-pt").length, bar: !!document.querySelector(".lab-obnova") }));
    assert.deepEqual(h, { rows: 3, pts: 3, bar: true });
    await p.evaluate(() => localStorage.setItem("evklid.lab.meritve.0.lab-mesanje", JSON.stringify({ v: 1, seed: 9, rows: [{ pos: "stiropor s pokrovom", w1: "100,0 g, 80,0 °C", w2: "100,0 g, 20,0 °C", Tm: "49,1", Tc: "50,0" }], trial: { pos: "stiropor", pokrov: true, m1: 100, T1: 80, m2: 100, T2: 20, m2w: true, done: { T: 49.1, Tc: 50, ok: true } }, pts: [[0, 30], [2, 45], [4, 49.1]] })));
    await p.evaluate(() => window.mount("lab-mesanje"));
    const m = await p.evaluate(() => ({ rows: document.querySelectorAll(".lab-table tbody tr").length, pts: document.querySelectorAll(".lab-graph .lab-pt").length, q: [...document.querySelectorAll(".lab-q > h4")].filter((x) => x.textContent === "Sklep").length }));
    assert.equal(m.rows, 1);
    assert.ok(m.pts >= 2, `točke krivulje: ${m.pts}`);
    assert.equal(m.q, 1, "sklep po veljavni meritvi je spet na voljo");
    assert.deepEqual(errs, []);
    await ctx.close();
  });

  // Pregled #1052: pokvarjen zapis, menjava profila, obnova posod (ohlajanje) in nov niz po obnovi (faze).
  await t.test("corrupt saved data is forgotten and the lab is rebuilt; after a profile switch nothing is saved", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const { p, errs } = await odpri(ctx, base);
    const r = await p.evaluate(async () => {
      localStorage.setItem("evklid.lab.meritve.0.test", JSON.stringify({ v: 1, seed: 4, rows: [{ a: "1" }, null, "x"], meas: "pokvarjeno" }));
      const el = document.createElement("div");
      el.dataset.labId = "test";
      let znova = 0;
      el._labZnova = () => znova++;
      document.body.append(el);
      const zap = window.lab.shramba(el), t = window.lab.dataTable([{ key: "a", label: "a" }]);
      el.append(t);
      zap.vezi(t, { get: () => ({}), set: (d) => d.meas.map((x) => x) });
      await new Promise((ok) => setTimeout(ok, 20));
      return { znova, key: localStorage.getItem("evklid.lab.meritve.0.test") };
    });
    assert.deepEqual(r, { znova: 1, key: null }, "pokvarjen zapis: pozabljen, poskus postavljen znova");
    // menjava profila, ko je poskus še na zaslonu: meritve ne gredo k drugemu profilu
    await p.evaluate(() => localStorage.setItem("studentId", "1"));
    await p.evaluate(() => window.mount("lab-ohm"));
    await meriOhm(p, [2]);
    await p.evaluate(() => localStorage.setItem("studentId", "2"));
    await meriOhm(p, [4]);
    const k = await p.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("evklid.lab.meritve.")).sort());
    assert.deepEqual(k, ["evklid.lab.meritve.1.lab-ohm"]);
    const rows = await p.evaluate(() => JSON.parse(localStorage.getItem("evklid.lab.meritve.1.lab-ohm")).rows.length);
    assert.equal(rows, 1, "po menjavi profila se zapis profila 1 ne spremeni");
    assert.deepEqual(errs, []);
    await ctx.close();
  });

  await t.test("lab-ohlajanje restores the cups the tea was poured into; lab-faze starts a new series after a restore", async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const { p, errs } = await odpri(ctx, base);
    const rows = [{ t: "0", T0: "90,0", T1: "–", T2: "90,0" }, { t: "1", T0: "88,1", T1: "–", T2: "85,0" }];
    const meas = [[[0, 90], [1, 88.1]], [], [[0, 90], [1, 85]]];
    const imena = ["lonček iz stiropora s pokrovom", null, "emajliran kovinski lonček"];
    const posode = () => p.evaluate(() => [1, 2, 3].map((i) => document.querySelector(`select[aria-label="posoda ${i}"]`).value));
    await p.evaluate((d) => localStorage.setItem("evklid.lab.meritve.0.lab-ohlajanje", JSON.stringify(d)), { v: 1, seed: 2, rows, meas, imena, vrste: ["stiropor", null, "kovina"] });
    await p.evaluate(() => window.mount("lab-ohlajanje"));
    assert.deepEqual(await posode(), ["stiropor", "", "kovina"]);
    assert.match(await p.locator("svg.lab-top-ohl").getAttribute("aria-label"), /1 lonček iz stiropora s pokrovom, 2 brez posode, 3 emajliran kovinski lonček/);
    // zapis pred to popravo (brez vrst): posode po imenih
    await p.evaluate((d) => localStorage.setItem("evklid.lab.meritve.0.lab-ohlajanje", JSON.stringify(d)), { v: 1, seed: 2, rows, meas, imena });
    await p.evaluate(() => window.mount("lab-ohlajanje"));
    assert.deepEqual(await posode(), ["stiropor", "", "kovina"]);
    // faze: ročni zapis po obnovi začne nov niz (ne doda vrstice k meritvam prejšnjega obiska)
    await p.evaluate(() => localStorage.setItem("evklid.lab.meritve.0.lab-faze", JSON.stringify({ v: 1, seed: 3, rows: [{ t: "0:00", T: "-15,0", v: "led" }, { t: "5:00", T: "0,0", v: "led in voda" }], meas: [[0, -15], [5, 0]] })));
    await p.evaluate(() => window.mount("lab-faze"));
    assert.equal(await p.locator(".lab-table tbody tr").count(), 2);
    await p.waitForFunction(() => /\d/.test(document.querySelector('[aria-label="termometer"] .lab-lcd-val')?.textContent || "")); // termometer že kaže
    await p.getByRole("button", { name: "Zapiši meritev", exact: true }).click();
    assert.equal(await p.locator(".lab-table tbody tr").count(), 1);
    assert.equal(await p.locator(".lab-obnova").count(), 0);
    assert.deepEqual(errs, []);
    await ctx.close();
  });
});
