// Laboratorij: napoved pred meritvijo (lab.js → napoved) in primerjava »Tvoja napoved · Izmerjeno« na koncu.
// Vsak poskus, ki v »Preizkusi« pravi »Napovej …«, ima pravi korak napovedi (razen datotek PR #994, ti pridejo pozneje).
import test, { before } from "node:test";
import assert from "node:assert/strict";
import { ENGINES } from "../public/sim/index.js";
import { parseStevilo, faktorDeset } from "../public/sim/lab.js";
import { tokPri } from "../public/sim/lab-fiz.js";
import { indikatorIzMeritev } from "../public/sim/lab-titracija.js";
import { poPolUre } from "../public/sim/lab-toplota.js";
import { playwright, serve, odpri, nastavi, meriOhm } from "./laboratorij-pomoc.js";

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

test("number parsing accepts a decimal comma and the experiment's own unit, rejects text and other units", () => {
  assert.equal(parseStevilo("4,5"), 4.5);
  assert.equal(parseStevilo(" 1 000 "), 1000);
  assert.equal(parseStevilo("−0,25"), -0.25);
  for (const x of ["", "abc", "1,2,3", "5 mA", "60%", "60 %", null]) assert.equal(parseStevilo(x), null, String(x));
  // enota poskusa za številom (pregled #1054, točka 16), tudi m/s2 za m/s² in »2-krat«
  assert.equal(parseStevilo("97 Ω", "Ω"), 97);
  assert.equal(parseStevilo("9,6 m/s²", "m/s²"), 9.6);
  assert.equal(parseStevilo("9,6 m/s2", "m/s²"), 9.6);
  assert.equal(parseStevilo("37 °C", "°C"), 37);
  assert.equal(parseStevilo("2-krat", "-krat"), 2);
  assert.equal(parseStevilo("60 %", "%"), 60);
  assert.equal(parseStevilo("0,06 A", "mA"), null, "druga enota ni ista količina v mA");
  // faktor ~10ⁿ: napaka pri pretvorbi enot
  assert.equal(faktorDeset(0.06, 60), 3);
  assert.equal(faktorDeset(600, 60), 1);
  assert.equal(faktorDeset(70, 60), 0);
});

test("mesanje compares only a valid (stirred) mixture; titracija asks about the indicator only after both", async () => {
  const top = (await import("../public/sim/lab-toplota.js")).labMesanje.toString();
  assert.match(top, /if \(!prvi && trial\.done\.ok\) prvi = /);
  assert.match(top, /Izračun \(samo voda\)/);
  assert.doesNotMatch(top, /Napoved \(samo voda\)/);
  const tit = (await import("../public/sim/lab-titracija.js")).labTitracija.toString();
  assert.match(tit, /if \(!indikatorIzMeritev\(sibke\)\) \{/);
  assert.match(tit, /Za primerjavo titriraj/);
});

test("measured values for the comparison come from the student's own measurements", () => {
  // Ohm: meritev v ±0,3 V od 6 V, sicer s premice skozi izhodišče
  assert.equal(tokPri([[2, 20], [5.9, 59.1], [8, 80.5]], 6).vrednost, 59.1);
  const s = tokPri([[2, 20], [4, 40], [8, 80]], 6);
  assert.ok(Math.abs(s.vrednost - 60) < 1e-9 && /premice/.test(s.besedilo));
  assert.equal(tokPri([[2, 20]], 6), null);
  // titracija ocetne kisline: bližje ekvivalentni točki
  const r = (indId, V, over, id = "ocetna") => ({ id, indId, V, over });
  assert.equal(indikatorIzMeritev([r("fenolftalein", 24.1, 0.05)]), null, "en indikator še ni dovolj");
  assert.equal(indikatorIzMeritev([r("metiloranz", 7.4, -16.6), r("fenolftalein", 24.1, 0.05), r("fenolftalein", 25.0, 0.95)]).vrednost, "fenolftalein");
  assert.equal(indikatorIzMeritev([r("metiloranz", 24.05, 0.0), r("fenolftalein", 24.1, 0.05)]).vrednost, "enako");
  // različna vzorca (ocetna kislina in kis) se ne primerjata (pregled #1053, točka 11)
  assert.equal(indikatorIzMeritev([r("fenolftalein", 24.1, 0.05, "ocetna"), r("metiloranz", 6.0, -15, "kis")]), null);
  assert.equal(indikatorIzMeritev([r("fenolftalein", 24.1, 0.05, "ocetna"), r("metiloranz", 6.0, -15, "kis"), r("fenolftalein", 21.0, 0.02, "kis")]).id, "kis");
  // ohlajanje: temperatura v prvi napolnjeni posodi ob prvi meritvi po 30 min
  const meas = [[], [[0, 80], [29, 60], [30.5, 55.2]], [[0, 80], [30, 72.4]]];
  const n = poPolUre(meas, [null, "porcelanska skodelica", "termovka z zamaškom"], 30);
  assert.equal(n.vrednost, 55.2);
  assert.match(n.besedilo, /^55,2\s°C \(posoda 2: porcelanska skodelica, po 31\smin\)/);
  assert.equal(poPolUre([[[0, 80], [20, 60]], [], []], ["porcelanska skodelica", null, null], 30), null, "pred 30 min ni primerjave");
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
    assert.deepEqual(r.napaka, [null, "Vpiši število v mA (npr. 4,5)."]);
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
    assert.deepEqual(r.izbiraPrim, [false, "lab-why ok", { v: "b", t: "druga", zaprto: true, k: null }]);
    assert.deepEqual(errs, []);
    await ctx.close();
  });

  // Pregled #1053: fokus ostane na izbrani možnosti, odstopanje v enoti (°C), namig »preveri enote«, napoved za drugo posodo izgine.
  await t.test("component: focus stays on the chosen option, absolute tolerance, unit hint, key change clears", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const { p, errs } = await odpri(ctx, base);
    await p.evaluate(() => {
      const st = (window.st = { iz: null, k: "a" });
      window.M = window.lab.napoved({ id: "m", vprasanje: "Katera?", moznosti: [["a", "prva"], ["b", "druga"]] });
      window.T = window.lab.napoved({ id: "t", vprasanje: () => `Posoda ${st.k}?`, enota: "°C", abs: 2, primer: "npr. 37", kljuc: () => st.k, izmerjeno: () => st.iz });
      document.getElementById("m").append(window.M.el, window.T.el, window.T.primerjava);
    });
    await p.locator(".lab-opt", { hasText: "druga" }).focus();
    await p.keyboard.press("Enter");
    const f = await p.evaluate(() => [document.activeElement?.textContent, document.activeElement?.getAttribute("aria-pressed"), window.M.vrednost]);
    assert.deepEqual(f, ["druga", "true", "b"], "fokus ostane na izbranem gumbu");
    assert.equal(await p.locator(".lab-napoved input").nth(0).getAttribute("placeholder"), "npr. 37");
    const r = await p.evaluate(() => {
      const T = window.T, st = window.st, inp = T.el.querySelector("input"), btn = T.el.querySelector("button");
      const out = { caka: T.caka };
      inp.value = "37 °C";
      btn.click();
      out.vnos = [T.vrednost, T.caka];
      st.k = "b";
      T.osvezi();
      out.kljuc = [T.vrednost, T.el.querySelector(".lab-q-text").textContent];
      inp.value = "52";
      btn.click();
      st.iz = { vrednost: 50.6, besedilo: "50,6 °C" };
      T.osvezi();
      out.ok = T.primerjava.querySelector(".lab-why").className;
      st.iz = { vrednost: 36.3, besedilo: "36,3 °C" };
      T.osvezi();
      out.bad = [T.primerjava.querySelector(".lab-why").className, T.primerjava.querySelector(".lab-why").textContent];
      st.iz = { vrednost: 5.2, besedilo: "5,2 °C" };
      T.osvezi();
      out.faktor = T.primerjava.querySelector(".lab-why").textContent;
      return out;
    });
    assert.equal(r.caka, true);
    assert.deepEqual(r.vnos, [37, false], "enota za številom je dovoljena");
    assert.deepEqual(r.kljuc, [null, "Posoda b?"], "napoved za drugo postavitev se pobriše");
    assert.equal(r.ok, "lab-why ok", "52 je v ±2 °C od 50,6");
    assert.equal(r.bad[0], "lab-why bad");
    assert.match(r.bad[1], /Razlika je 15,7\s°C\./);
    assert.match(r.faktor, /faktor ~10: preveri enote/);
    assert.deepEqual(errs, []);
    await ctx.close();
  });

  await t.test("lab-ohm: predict, measure, compare; the prediction survives reopening", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
    const { p, errs } = await odpri(ctx, base, "lab-ohm");
    assert.equal(await p.evaluate(() => document.querySelector(".demo-controls > .lab-napoved")?.dataset.napoved), "tok-6V");
    // napoved in primerjava nista .lab-q: vodeni način (lab-vodeno.js, test laboratorij-vodeno) šteje sklepe po .lab-q
    assert.equal(await p.evaluate(() => document.querySelectorAll(".lab-q.lab-napoved, .lab-q.lab-primerjava").length), 0);
    // ampermeter do napovedi ne izda odgovora (pregled #1053, točka 7)
    await p.waitForTimeout(500);
    const am = () => p.evaluate(() => document.querySelector('[aria-label="ampermeter"]').textContent);
    assert.match(await am(), /najprej napovej tok/);
    await nastavi(p, "napetost napajalnika", 3);
    await p.waitForTimeout(700);
    const risba = () => p.evaluate(() => document.querySelector(".demo-stage svg")?.textContent || "");
    const prej = await risba();
    await p.locator(".lab-napoved input").fill("30");
    await p.locator(".lab-napoved").getByRole("button", { name: "Zapiši napoved" }).click();
    await p.waitForTimeout(700);
    assert.doesNotMatch(await am(), /najprej napovej/);
    // tudi zaslon ampermetra na fotografiji (foto.js) pokaže tok šele po napovedi
    const tok = (await am()).match(/\d+,\d+/)?.[0];
    if (tok && (await risba()).includes(tok)) assert.ok(!prej.includes(tok), `fotografija izda tok ${tok} pred napovedjo`);
    await nastavi(p, "napetost napajalnika", 0);
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

  await t.test("titracija, mesanje, ohlajanje: prediction in the controls (mesanje: below the water sliders), no page errors", async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    for (const id of ["lab-titracija", "lab-mesanje", "lab-ohlajanje"]) {
      const { p, errs } = await odpri(ctx, base, id);
      const r = await p.evaluate(() => ({
        prvi: !!document.querySelector(".demo-controls > .lab-napoved"),
        podVodo: document.querySelector(".lab-napoved")?.previousElementSibling?.querySelector("legend")?.textContent,
        opts: document.querySelectorAll(".lab-napoved .lab-opt").length,
        polje: !!document.querySelector(".lab-napoved input"),
      }));
      if (id === "lab-mesanje") assert.equal(r.podVodo, "2. Voda", id);
      else assert.ok(r.prvi, id);
      assert.ok(r.opts >= 2 || r.polje, id);
      assert.deepEqual(errs, [], id);
      await p.close();
    }
    await ctx.close();
  });

  // Pregled #1053 (3. krog): napoved pri mešanju velja za nastavljeno mešanico; pri ohlajanju jo obnova ne pobriše.
  await t.test("mesanje: moving a water slider clears the prediction; ohlajanje: a restore keeps the prediction for the restored cups", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const { p, errs } = await odpri(ctx, base, "lab-mesanje");
    await p.locator(".lab-napoved input").fill("45");
    await p.locator(".lab-napoved").getByRole("button", { name: "Zapiši napoved" }).click();
    assert.match(await p.evaluate(() => document.querySelector(".lab-napoved-moja").textContent), /45/);
    await nastavi(p, "topla voda m₁", 120);
    assert.equal(await p.evaluate(() => document.querySelector(".lab-napoved-moja").textContent), "", "druga mešanica: napoved pobrisana");
    const shranjeno = { v: 1, seed: 3, rows: [], meas: [[], [], []], imena: [null, null, null], vrste: ["kovina", "porcelanP", "termovka"], napoved: { v: 60, t: "60 °C", zaprto: false, k: "0:kovina" } };
    await p.evaluate((d) => localStorage.setItem("evklid.lab.meritve.0.lab-ohlajanje", JSON.stringify(d)), shranjeno);
    await p.evaluate(() => window.mount("lab-ohlajanje"));
    await p.waitForTimeout(200);
    const o = await p.evaluate(() => ({ moja: document.querySelector(".lab-napoved-moja").textContent, posoda: document.querySelector('select[aria-label="posoda 1"]')?.value }));
    assert.equal(o.posoda, "kovina");
    assert.match(o.moja, /60/, "obnova posod ne pobriše napovedi");
    await p.evaluate(() => localStorage.removeItem("evklid.lab.meritve.0.lab-ohlajanje"));
    assert.deepEqual(errs, []);
    await ctx.close();
  });
});
