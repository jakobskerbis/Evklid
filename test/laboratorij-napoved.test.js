// Laboratorij: napoved pred meritvijo (lab.js → napoved) in primerjava »Tvoja napoved · Izmerjeno« na koncu.
// Vsak poskus, ki v »Preizkusi« pravi »Napovej …«, ima pravi korak napovedi (razen datotek PR #994, ti pridejo pozneje).
import test, { before } from "node:test";
import assert from "node:assert/strict";
import { ENGINES } from "../public/sim/index.js";
import { parseStevilo } from "../public/sim/lab.js";
import { tokPri } from "../public/sim/lab-fiz.js";
import { indikatorIzMeritev } from "../public/sim/lab-titracija.js";
import { najtoplejsi } from "../public/sim/lab-toplota.js";
import { playwright, serve, odpri, meriOhm } from "./laboratorij-pomoc.js";

const POZNEJE = new Set(["lab-kem.js", "lab-indikatorji.js", "lab-reakcije.js", "lab-elektrika.js", "lab-elektrokemija.js"]);

test("every experiment that says »Napovej« (outside the #994 files) has a prediction step", async () => {
  const z = [];
  for (const id of Object.keys(ENGINES).filter((k) => k.startsWith("lab-") && !POZNEJE.has(ENGINES[k][0]))) {
    const [file, name] = ENGINES[id];
    const src = (await import(`../public/sim/${file}`))[name].toString();
    if (!/tryText: "[^"]*Napovej/.test(src)) continue;
    z.push(id);
    assert.match(src, /= napoved\(\{/, `${id}: »Napovej« brez koraka napovedi`);
    assert.match(src, /napoved: N\.stanje\(\)/, `${id}: napoved se ne shrani`);
  }
  assert.deepEqual(z.sort(), ["lab-mesanje", "lab-ohlajanje", "lab-ohm", "lab-titracija"]);
});

test("number parsing accepts a decimal comma and rejects text", () => {
  assert.equal(parseStevilo("4,5"), 4.5);
  assert.equal(parseStevilo(" 1 000 "), 1000);
  assert.equal(parseStevilo("−0,25"), -0.25);
  assert.equal(parseStevilo("60%"), 60);
  for (const x of ["", "abc", "1,2,3", "5 mA", null]) assert.equal(parseStevilo(x), null, String(x));
});

test("measured values for the comparison come from the student's own measurements", () => {
  // Ohm: meritev v ±0,3 V od 6 V, sicer s premice skozi izhodišče
  assert.equal(tokPri([[2, 20], [5.9, 59.1], [8, 80.5]], 6).vrednost, 59.1);
  const s = tokPri([[2, 20], [4, 40], [8, 80]], 6);
  assert.ok(Math.abs(s.vrednost - 60) < 1e-9 && /premice/.test(s.besedilo));
  assert.equal(tokPri([[2, 20]], 6), null);
  // titracija ocetne kisline: bližje ekvivalentni točki
  const r = (indId, V, over) => ({ indId, V, over });
  assert.equal(indikatorIzMeritev([r("fenolftalein", 24.1, 0.05)]), null, "en indikator še ni dovolj");
  assert.equal(indikatorIzMeritev([r("metiloranz", 7.4, -16.6), r("fenolftalein", 24.1, 0.05), r("fenolftalein", 25.0, 0.95)]).vrednost, "fenolftalein");
  assert.equal(indikatorIzMeritev([r("metiloranz", 24.05, 0.0), r("fenolftalein", 24.1, 0.05)]).vrednost, "enako");
  // ohlajanje: prva meritev po 30 min v vsaki posodi
  const meas = [[[0, 80], [30, 51.2]], [[0, 80], [30, 72.4]], [[0, 80], [29, 60], [30.5, 55]]];
  const n = najtoplejsi(meas, ["porcelanska skodelica", "termovka z zamaškom", "lonček iz stiropora s pokrovom"], 30);
  assert.equal(n.vrednost, "1");
  assert.match(n.besedilo, /^2: termovka z zamaškom \(72,4/);
  assert.equal(najtoplejsi([[[0, 80], [20, 60]], [], []], ["porcelanska skodelica", null, null], 30), null, "pred 30 min ni primerjave");
});

let browser = null;
before(async () => {
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
});

test("prediction component and lab-ohm in a browser", { timeout: 120000 }, async (t) => {
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await browser.close();
    server.close();
  });

  await t.test("component: number and choice, closes before measuring, compares at the end", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const { p, errs } = await odpri(ctx, base);
    const r = await p.evaluate(() => {
      const st = { odprto: true, iz: null, moz: [["a", "prva"], ["b", "druga"]] };
      const N = window.lab.napoved({ id: "x", vprasanje: "Koliko?", enota: "mA", odprto: () => st.odprto, izmerjeno: () => st.iz });
      const M = window.lab.napoved({ id: "y", vprasanje: "Katera?", moznosti: () => st.moz, izmerjeno: () => st.iz && { vrednost: "b", besedilo: "druga" } });
      document.getElementById("m").append(N.el, N.primerjava, M.el, M.primerjava);
      const out = {};
      const inp = N.el.querySelector("input"), btn = N.el.querySelector("button");
      inp.value = "abc";
      btn.click();
      out.napaka = [N.vrednost, N.el.querySelector(".lab-napoved-moja").textContent];
      inp.value = "55,5";
      btn.click();
      out.zapisano = [N.vrednost, N.el.querySelector(".lab-napoved-moja").textContent, N.primerjava.hidden];
      st.odprto = false;
      N.osvezi();
      out.zaprto = [N.el.querySelector(".lab-tit-field").hidden, N.el.querySelector(".lab-napoved-moja").textContent];
      st.iz = { vrednost: 60, besedilo: "60 mA" };
      N.osvezi();
      out.primerjava = [N.primerjava.hidden, N.primerjava.querySelector("h4").textContent, N.primerjava.querySelector(".lab-primerjava-vrednosti").textContent, N.primerjava.querySelector(".lab-why").className];
      st.iz = { vrednost: 56, besedilo: "56 mA" };
      N.osvezi();
      out.ujema = N.primerjava.querySelector(".lab-why").className;
      // izbira: gumbi, izbrani je pritisnjen; ko izbire ni več med možnostmi, napovedi ni
      st.iz = null;
      M.osvezi();
      M.el.querySelectorAll(".lab-opt")[0].click();
      out.izbira = [M.vrednost, [...M.el.querySelectorAll(".lab-opt")].map((b) => b.getAttribute("aria-pressed")).join()];
      st.moz = [["b", "druga"]];
      M.osvezi();
      out.ni = M.vrednost;
      M.el.querySelector(".lab-opt").click();
      st.iz = 1;
      M.osvezi();
      out.izbiraPrim = [M.primerjava.hidden, M.primerjava.querySelector(".lab-why").className, M.stanje()];
      return out;
    });
    assert.deepEqual(r.napaka, [null, "Vpiši število (npr. 50 ali 4,5)."]);
    assert.equal(r.zapisano[0], 55.5);
    assert.match(r.zapisano[1], /^Tvoja napoved: 55,5\s?mA\. Lahko jo še spremeniš/);
    assert.equal(r.zapisano[2], true, "primerjave še ni");
    assert.equal(r.zaprto[0], true, "vnos je zaprt");
    assert.match(r.zaprto[1], /^Tvoja napoved: 55,5\s?mA$/);
    assert.deepEqual(r.primerjava.slice(0, 2), [false, "Tvoja napoved · Izmerjeno"]);
    assert.match(r.primerjava[2], /Tvoja napoved55,5\s?mAIzmerjeno60 mA/);
    assert.equal(r.primerjava[3], "lab-why ok", "55,5 je v 10 % od 60");
    assert.equal(r.ujema, "lab-why ok");
    assert.deepEqual(r.izbira, ["a", "true,false"]);
    assert.equal(r.ni, null);
    assert.deepEqual(r.izbiraPrim, [false, "lab-why ok", { v: "b", t: "druga", zaprto: true }]);
    assert.deepEqual(errs, []);
    await ctx.close();
  });

  await t.test("lab-ohm: predict, measure, compare; the prediction survives reopening", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
    const { p, errs } = await odpri(ctx, base, "lab-ohm");
    assert.equal(await p.evaluate(() => document.querySelector(".demo-controls > .lab-napoved")?.dataset.napoved), "tok-6V");
    await p.locator(".lab-napoved input").fill("30");
    await p.locator(".lab-napoved").getByRole("button", { name: "Zapiši napoved" }).click();
    await meriOhm(p, [2, 4]);
    const vmes = await p.evaluate(() => [document.querySelector(".lab-napoved .lab-tit-field").hidden, document.querySelector(".lab-primerjava").hidden]);
    assert.deepEqual(vmes, [true, true], "po prvi meritvi napoved zaprta, primerjave še ni (ni meritve pri 6 V ne premice)");
    await meriOhm(p, [6]);
    const r = await p.evaluate(() => ({ t: document.querySelector(".lab-primerjava .lab-primerjava-vrednosti").textContent, c: document.querySelector(".lab-primerjava .lab-why").className }));
    assert.match(r.t, /Tvoja napoved30\s?mAIzmerjeno\d+(,\d)?\s?mA pri \d,\d\d\s?V/);
    assert.equal(r.c, "lab-why bad");
    await p.evaluate(() => window.mount("lab-ohm"));
    const po = await p.evaluate(() => [document.querySelector(".lab-napoved-moja").textContent, document.querySelector(".lab-primerjava").hidden]);
    assert.match(po[0], /^Tvoja napoved: 30\s?mA$/);
    assert.equal(po[1], false);
    assert.deepEqual(errs, []);
    await ctx.close();
  });

  await t.test("titracija, mesanje, ohlajanje: prediction first in the controls, no page errors", async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    for (const id of ["lab-titracija", "lab-mesanje", "lab-ohlajanje"]) {
      const { p, errs } = await odpri(ctx, base, id);
      const r = await p.evaluate(() => ({ prvi: !!document.querySelector(".demo-controls > .lab-napoved"), opts: document.querySelectorAll(".lab-napoved .lab-opt").length, polje: !!document.querySelector(".lab-napoved input") }));
      assert.ok(r.prvi, id);
      assert.ok(r.opts >= 2 || r.polje, id);
      assert.deepEqual(errs, [], id);
      await p.close();
    }
    await ctx.close();
  });
});
