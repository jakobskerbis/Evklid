// Laboratorij: matematično nihalo (lab-nihalo) in Boylov zakon (lab-boyle).
// 1) fizika brez brskalnika: nihajni čas (točen, z odmikom), g iz naklona t₀²(l) iz meritev s šumom, neodvisnost od mase;
//    pV je pri stalni temperaturi stalen, 2-krat manjša prostornina da ~2-krat večji tlak, prehodno segrevanje, meje brizge;
// 2) v brskalniku (Playwright, če je nameščen): napoved pred meritvijo, račun g in pV iz shranjenih meritev, postavitev na telefonu.
import test, { before } from "node:test";
import assert from "node:assert/strict";
import { NihaloBench, KROGLICE, NIHALO, nihajniCas, G_LJ, naklonSkoziIzhodisce } from "../public/sim/lab-model-gibanje.js";
import { BoyleBench, BRIZGA, SENZOR_P, PLIN_STISK } from "../public/sim/lab-model-toplota.js";
import { primerjavaMas } from "../public/sim/lab-gibanje.js";
import { razmerjeTlakov } from "../public/sim/lab-toplota.js";
import { ENGINES } from "../public/sim/index.js";
import { playwright, serve, odpri, nastavi } from "./laboratorij-pomoc.js";

const rel = (a, b) => Math.abs(a / b - 1);
const RAD = Math.PI / 180;

// Izmeri čas n nihajev kot učenec (štoparica z reakcijskim časom); vrne meritev { n, t, t0 }.
function meriNihaje(B, n = 10) {
  B.meri(n);
  for (let i = 0; i < 200000 && !B.meritev(); i++) B.step(0.02);
  return B.meritev();
}

test("pendulum: exact period, small-angle limit and amplitude correction", () => {
  const l = 0.8, T = 2 * Math.PI * Math.sqrt(l / G_LJ);
  assert.ok(rel(nihajniCas(l, 0), T) < 1e-12, "θ₀ → 0: T = 2π√(l/g)");
  // vrsta T ≈ T₀ (1 + θ₀²/16 + 11θ₀⁴/3072)
  for (const st of [5, 10, 20, 30]) {
    const th = st * RAD;
    assert.ok(rel(nihajniCas(l, th), T * (1 + th ** 2 / 16 + (11 * th ** 4) / 3072)) < 2e-5, `${st}°`);
  }
  assert.ok(rel(nihajniCas(l, 90 * RAD), 1.18034 * T) < 1e-4, "pri 90° je T za 18,0 % daljši");
  // idealno nihalo (brez upora, vzgona in napak): izmerjeni t₀ je točen
  const B = new NihaloBench({ seed: 3, idealno: true });
  B.dolzina(0.5);
  B.odmik(10);
  const m = meriNihaje(B, 10);
  const r = KROGLICE.jeklo64.D / 2, Tfiz = nihajniCas(0.5, 10 * RAD) * Math.sqrt(1 + (0.4 * r * r) / 0.25); // fizično nihalo
  assert.ok(Math.abs(m.t0 - Tfiz) <= NIHALO.stoparica / 10 + 1e-9, `t₀ ${m.t0}, teorija ${Tfiz}`);
});

test("pendulum: g from the slope of t₀²(l) with realistic noise is within 2 % (several seeds)", () => {
  for (const seed of [1, 2, 3, 7, 11, 42]) {
    const B = new NihaloBench({ seed });
    const pts = [];
    for (const l of [0.3, 0.5, 0.8, 1.1, 1.4]) {
      B.dolzina(l);
      B.odmik(10);
      const m = meriNihaje(B, 10);
      pts.push([l, m.t0 * m.t0]);
    }
    const g = (4 * Math.PI ** 2) / naklonSkoziIzhodisce(pts);
    assert.ok(rel(g, G_LJ) < 0.02, `seed ${seed}: g = ${g.toFixed(3)}`);
    // ista seme da iste meritve (shranjene meritve in posnetki so ponovljivi)
    const C = new NihaloBench({ seed });
    C.dolzina(0.3);
    C.odmik(10);
    assert.equal(meriNihaje(C, 10).t, Math.round(Math.sqrt(pts[0][1]) * 10 * 100) / 100);
  }
});

test("pendulum: period does not depend on mass; it grows with amplitude", () => {
  const T = (kr, kot, seed = 5) => {
    const B = new NihaloBench({ seed, idealno: true });
    B.izberi(kr);
    B.dolzina(0.6);
    B.odmik(kot);
    return meriNihaje(B, 10).t0;
  };
  assert.ok(rel(T("jeklo128", 10), T("jeklo64", 10)) < 0.002, "2-krat težja kroglica: enak t₀");
  assert.ok(rel(T("les", 10), T("jeklo64", 10)) < 0.003, "lesena kroglica: skoraj enak t₀ (vzgon v idealnem ni)");
  const d = T("jeklo64", 30) / T("jeklo64", 5) - 1;
  assert.ok(d > 0.012 && d < 0.02, `30° proti 5°: ${(100 * d).toFixed(2)} % daljši`);
  // primerjava napovedi: enaka dolžina, dve masi → »enak«
  const meas = [
    { kr: "jeklo64", l: 0.6, kot: 10, n: 10, t0: 1.556 },
    { kr: "jeklo128", l: 0.6, kot: 10, n: 10, t0: 1.559 },
  ];
  assert.equal(primerjavaMas(meas).vrednost, "enak");
  assert.equal(primerjavaMas([{ ...meas[0] }, { ...meas[1], t0: 1.70 }]).vrednost, "daljsi");
  assert.equal(primerjavaMas([meas[0], { ...meas[1], l: 0.9 }]), null, "različni dolžini nista primerjava mase");
});

test("Boyle: pV is constant at constant temperature (ideal); halving V doubles p", () => {
  const B = new BoyleBench({ seed: 4, idealno: true });
  B.premakni(40);
  B.zapri();
  const pV0 = B.p * B.Vplin();
  for (const V of [35, 30, 25, 20, 15, 50, 60]) {
    B.premakni(V);
    for (let i = 0; i < 200; i++) B.step(0.1);
    assert.ok(rel(B.p * B.Vplin(), pV0) < 1e-12, `V = ${V} mL`);
  }
  B.premakni(40);
  const p40 = B.read().value;
  B.premakni(20);
  assert.ok(Math.abs(B.read().value / p40 - 2) < 0.01, "40 mL → 20 mL: 2-krat večji tlak");
});

test("Boyle: with dead volume, scale error and sensor offset pV stays within a few % (several seeds)", () => {
  for (const seed of [1, 2, 5, 9, 13, 21]) {
    const B = new BoyleBench({ seed });
    B.premakni(40);
    B.zapri();
    const vrst = [];
    for (const V of [40, 35, 30, 25, 20, 50, 60]) {
      B.premakni(V);
      for (let i = 0; i < 300; i++) B.step(0.1); // 30 s: tlak se ustali
      assert.ok(B.ustaljeno, `seed ${seed}, ${V} mL: ustaljeno`);
      const r = B.read();
      vrst.push({ V, p: r.value, pV: (r.value * V) / 1000 });
    }
    const sr = vrst.reduce((a, x) => a + x.pV, 0) / vrst.length;
    for (const x of vrst) assert.ok(rel(x.pV, sr) < 0.06, `seed ${seed}, ${x.V} mL: pV ${x.pV.toFixed(3)} J, povprečje ${sr.toFixed(3)} J`);
    assert.ok(sr > 3.3 && sr < 4.6, `seed ${seed}: pV ≈ p₀ · 40 mL ≈ 3,9 J (${sr.toFixed(2)})`);
    // mrtvi volumen (nastavek, cevka, senzor): pV z odčitano prostornino je pri majhni V manjši
    const r2 = vrst.find((x) => x.V === 20).p / vrst.find((x) => x.V === 40).p;
    assert.ok(r2 > 1.85 && r2 < 2.02, `seed ${seed}: 40 → 20 mL razmerje ${r2.toFixed(3)}`);
    const R = razmerjeTlakov(vrst.map((x) => ({ s: 1, V: x.V, p: x.p })));
    assert.deepEqual([R.V1, R.V2], [40, 20]);
    assert.ok(Math.abs(R.vrednost - r2) < 1e-12);
  }
});

test("Boyle: fast compression heats the air briefly; force and sensor limits", () => {
  const B = new BoyleBench({ seed: 3 });
  B.premakni(40);
  B.zapri();
  B.premakni(20);
  const takoj = B.read().value;
  assert.ok(B.T > B.Tsoba + 5, "takoj po stisku je zrak toplejši (delno adiabatno)");
  for (let i = 0; i < 300; i++) B.step(0.1);
  const pozneje = B.read().value;
  assert.ok(takoj > pozneje * 1.03, `tlak pade, ko se zrak ohladi: ${takoj} → ${pozneje} kPa`);
  assert.ok(B.T - B.Tsoba < 0.1 && PLIN_STISK.tau < 3);
  // od 60 mL bata ne potisneš do 5 mL: sila bi bila nad 150 N
  const C = new BoyleBench({ seed: 3 });
  C.premakni(60);
  C.zapri();
  const V = C.premakni(5);
  assert.ok(V > 5, `bat se ustavi pri ${V} mL`);
  assert.ok(C.sila <= BRIZGA.sila + 1e-9);
  // nad 210 kPa senzor kaže OL
  const D = new BoyleBench({ seed: 3, idealno: true });
  D.premakni(60);
  D.zapri();
  D.c *= 3; // umetno: trikrat več zraka
  assert.equal(D.read().text, "OL");
  assert.equal(SENZOR_P.max, 210);
  // odprt ventil: zračni tlak ne glede na prostornino
  const E = new BoyleBench({ seed: 3, idealno: true });
  E.premakni(20);
  assert.equal(E.p, E.p0);
});

test("both experiments are registered and use the shared lab parts (storage, napoved, racun, sklep)", async () => {
  for (const id of ["lab-nihalo", "lab-boyle"]) {
    assert.ok(ENGINES[id], id);
    const [file, name] = ENGINES[id];
    const src = (await import(`../public/sim/${file}`))[name].toString();
    for (const re of [/shramba\(el\)/, /napoved\(\{/, /const Rr = racun\(\{/, /Rr\.odkrito\(/, /racun: Rr\.stanje\(\)/, /conclusion\(\{/, /zap\.vezi\(table/]) assert.match(src, re, `${id}: ${re}`);
  }
});

let browser = null;
before(async () => {
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
});

const NIH = [[0.3, 1.108], [0.5, 1.430], [0.8, 1.809], [1.1, 2.121]].map(([l, t0]) => ({ kr: "jeklo64", ime: "jeklo 64 g", l, kot: 10, n: 10, t: Number((10 * t0).toFixed(2)), t0 }));
const BOY = [[40, 98.3], [30, 130.6], [25, 156.4], [20, 194.8]].map(([V, p]) => ({ s: 1, ime: "poskus 1", V, p, nestalno: false }));

test("pendulum and Boyle in a browser", { timeout: 240000 }, async (t) => {
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const vpisi = async (p, x) => {
    await p.locator(".lab-racun input").fill(String(x));
    await p.locator(".lab-racun").getByRole("button", { name: "Preveri moj račun" }).click();
    return p.evaluate(() => ({ c: document.querySelector(".lab-racun .lab-why").className, t: document.querySelector(".lab-racun .lab-why").textContent }));
  };
  const siroko = (p) => p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  await t.test("lab-nihalo on a phone: napoved first, a real stopwatch measurement, g from stored data", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
    const { p, errs } = await odpri(ctx, base, "lab-nihalo");
    assert.equal(await siroko(p), 0, "na telefonu stran ne drsi vstran");
    assert.equal(await p.evaluate(() => document.querySelector(".demo-controls > .lab-napoved")?.dataset.napoved), "nihalo-masa");
    await p.getByRole("button", { name: "Nihajni čas ostane enak." }).click();
    // ena prava meritev: 10 nihajev pri 30 cm (×5)
    await p.locator('[aria-label="hitrost časa"] .seg-btn', { hasText: "×5" }).click();
    await nastavi(p, "dolžina l (do središča kroglice)", 30);
    await p.getByRole("button", { name: "Izmeri čas n nihajev", exact: true }).click();
    await p.waitForFunction(() => /ustavljena/.test(document.querySelector('[aria-label="štoparica"]')?.textContent || ""), null, { timeout: 60000 });
    await p.waitForTimeout(300);
    await p.getByRole("button", { name: "Zapiši meritev", exact: true }).click();
    const vrst = await p.evaluate(() => [...document.querySelectorAll(".lab-table tbody tr")].map((tr) => [...tr.children].map((td) => td.textContent)));
    assert.equal(vrst.length, 1);
    const t0 = Number(vrst[0].at(-1).replace(",", "."));
    assert.ok(Math.abs(t0 - nihajniCas(0.3, 10 * RAD)) < 0.02, `t₀ pri 30 cm: ${t0}`);
    assert.equal(await p.evaluate(() => document.querySelector(".lab-napoved .lab-opts").hidden), true, "po prvi meritvi napovedi ne moreš več spremeniti");
    assert.match(await p.evaluate(() => document.querySelector(".lab-napoved-moja").textContent), /ostane enak/);
    // račun g iz shranjenih meritev
    await p.evaluate((m) => localStorage.setItem("evklid.lab.meritve.0.lab-nihalo", JSON.stringify({ v: 1, seed: 7, rows: [{ kr: "jeklo 64 g", l: "30", kot: "10", n: "10", t: "11,08", t0: "1,108" }], meas: m })), NIH);
    await p.evaluate(() => window.mount("lab-nihalo"));
    await p.waitForTimeout(300);
    const g = (4 * Math.PI ** 2) / naklonSkoziIzhodisce(NIH.map((r) => [r.l, r.t0 * r.t0]));
    assert.ok(rel(g, 9.81) > 0.01, `primer mora biti dovolj daleč od učbenika: ${g}`);
    assert.equal(await p.evaluate(() => document.querySelector(".lab-racun").hidden), false);
    assert.doesNotMatch(await p.evaluate(() => document.querySelector(".lab-racun").previousElementSibling.textContent), /m\/s²/, "g ni izdan pred računom");
    assert.match((await vpisi(p, "9,81")).t, /vrednost iz učbenika/);
    assert.equal((await vpisi(p, (g * 1.05).toFixed(2).replace(".", ","))).c, "lab-why bad");
    const ok = await vpisi(p, `${(g * 1.01).toFixed(2).replace(".", ",")} m/s2`);
    assert.equal(ok.c, "lab-why ok", ok.t);
    assert.match(await p.evaluate(() => document.querySelector(".lab-racun").previousElementSibling.textContent), /4\\pi\^2|m\/s²/);
    assert.equal(await siroko(p), 0);
    await p.evaluate(() => localStorage.removeItem("evklid.lab.meritve.0.lab-nihalo"));
    assert.deepEqual(errs, []);
    await ctx.close();
  });

  await t.test("lab-boyle on a phone: numeric napoved, closed valve, 40 → 20 mL comparison, pV from stored data", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
    const { p, errs } = await odpri(ctx, base, "lab-boyle");
    assert.equal(await siroko(p), 0, "na telefonu stran ne drsi vstran");
    assert.equal(await p.evaluate(() => document.querySelector(".lab-napoved input").placeholder), "npr. 3");
    await nastavi(p, "prostornina na skali", 40);
    await p.locator(".lab-napoved input").fill("2");
    await p.locator(".lab-napoved").getByRole("button", { name: "Zapiši napoved" }).click();
    assert.match(await p.evaluate(() => document.querySelector(".lab-napoved-moja").textContent), /2-krat/);
    await p.getByRole("button", { name: "Zapri ventil", exact: true }).click();
    await p.waitForTimeout(800);
    await p.getByRole("button", { name: "Zapiši meritev", exact: true }).click();
    await nastavi(p, "prostornina na skali", 20);
    await p.waitForTimeout(10000); // zrak se po stisku ohladi (τ ≈ 1,5 s)
    await p.getByRole("button", { name: "Zapiši meritev", exact: true }).click();
    const prim = await p.evaluate(() => ({ skrito: document.querySelector(".lab-primerjava").hidden, t: document.querySelector(".lab-primerjava").textContent }));
    assert.equal(prim.skrito, false, "primerjava po paru 40 mL / 20 mL");
    const r = Number(prim.t.match(/([\d,]+)-krat \(40/)[1].replace(",", "."));
    assert.ok(r > 1.85 && r < 2.02, `izmerjeno razmerje ${r}`);
    // račun pV iz shranjenih meritev
    await p.evaluate((m) => localStorage.setItem("evklid.lab.meritve.0.lab-boyle", JSON.stringify({ v: 1, seed: 7, rows: [{ s: "1", V: "40", p: "98,3" }], meas: m })), BOY);
    await p.evaluate(() => window.mount("lab-boyle"));
    await p.waitForTimeout(300);
    const C = BOY.reduce((a, x) => a + (x.p * x.V) / 1000, 0) / BOY.length;
    assert.equal(await p.evaluate(() => document.querySelector(".lab-racun").hidden), false);
    assert.equal((await vpisi(p, (C * 1000).toFixed(0))).t.match(/faktor ~1000\b/)?.[0], "faktor ~1000", "kPa · mL namesto J");
    const ok = await vpisi(p, `${(C * 0.99).toFixed(2).replace(".", ",")} J`);
    assert.equal(ok.c, "lab-why ok", ok.t);
    assert.equal(await siroko(p), 0);
    await p.evaluate(() => localStorage.removeItem("evklid.lab.meritve.0.lab-boyle"));
    assert.deepEqual(errs, []);
    await ctx.close();
  });
});
