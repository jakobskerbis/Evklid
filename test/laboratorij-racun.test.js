// Laboratorij: končni rezultat izračuna učenec sam (lab.js → racun). Pričakovana vrednost je izračunana iz učenčevih meritev
// (enaka, kot jo pokaže »Pokaži rešitev« in izračun pod grafom), vrednost v dovoljenem odstopanju je pravilna, zunaj ni.
import test, { before } from "node:test";
import assert from "node:assert/strict";
import { ENGINES } from "../public/sim/index.js";
import { preveriRacun, odzivRacuna } from "../public/sim/lab.js";
import { naklonSkoziIzhodisce } from "../public/sim/lab-model-sile.js";
import { naklon, fIzMeritev } from "../public/sim/lab-model-optika.js";
import { izkoristek } from "../public/sim/lab-model-toplota.js";
import { fitOrigin } from "../public/sim/lab-model.js";
import { playwright, serve, odpri, meriOhm } from "./laboratorij-pomoc.js";

const RACUN = ["lab-ohm", "lab-grelnik", "lab-lom", "lab-leca", "lab-hooke", "lab-klanec", "lab-prosti-pad", "lab-sila-vodnik"];

test("the eight experiments that computed the final result for the student now ask for it", async () => {
  for (const id of RACUN) {
    const [file, name] = ENGINES[id];
    const src = (await import(`../public/sim/${file}`))[name].toString();
    assert.match(src, /const Rr = racun\(\{/, id);
    assert.match(src, /Rr\.nastavi\(/, id);
    assert.match(src, /Rr\.odkrito\(/, `${id}: izračun aplikacije ni skrit do rešitve`);
    assert.match(src, /racun: Rr\.stanje\(\)/, `${id}: rešen račun se ne shrani`);
  }
  // popolni odboj: dnevnik ne pove mejnega kota (iz njega bi učenec dobil n brez računa)
  const [file, name] = ENGINES["lab-lom"];
  assert.doesNotMatch((await import(`../public/sim/${file}`))[name].toString(), /mejniKot\(/);
});

test("local numeric check: decimal comma, relative and absolute tolerance", () => {
  assert.equal(preveriRacun("98,5", 100).ok, true, "1,5 % < 5 %");
  assert.equal(preveriRacun("94,9", 100).ok, false, "5,1 % > 5 %");
  assert.equal(preveriRacun("1,52", 1.49, { tol: 0.03 }).ok, true);
  assert.equal(preveriRacun("1,55", 1.49, { tol: 0.03 }).ok, false);
  assert.equal(preveriRacun("81", 80, { tol: 0, abs: 1 }).ok, true);
  assert.equal(preveriRacun("82", 80, { tol: 0, abs: 1 }).ok, false);
  assert.ok(Math.abs(preveriRacun("110", 100).odmik - 0.1) < 1e-12);
  assert.equal(preveriRacun("abc", 100), null);
  assert.equal(preveriRacun("5", NaN), null);
});

test("unit after the number, nominal and textbook values, feedback without the answer", () => {
  // enota poskusa za številom (pregled A3): »97 Ω« je število, »97 V« ni
  assert.equal(preveriRacun("97 Ω", 96, { enota: "Ω" }).ok, true);
  assert.equal(preveriRacun("97Ω", 96, { enota: "Ω" }).ok, true);
  assert.equal(preveriRacun("97 V", 96, { enota: "Ω" }), null);
  assert.equal(preveriRacun("9,79 m/s2", 9.75, { enota: "m/s²", tol: 0.03 }).ok, true);
  assert.equal(preveriRacun("76 mT", 75.9, { enota: "mT" }).ok, true);
  // napis na sestavnem delu / vrednost iz učbenika ni rezultat meritev, ko se meritve od nje razlikujejo za več kot 1 %
  const R = [{ v: 100, kaj: "napis na uporniku" }];
  const nap = preveriRacun("100", 96.2, { tol: 0.04, nazivno: R });
  assert.equal(nap.ok, false, "100 Ω z napisa, meritve dajo 96,2 Ω");
  assert.equal(nap.nazivno.kaj, "napis na uporniku");
  assert.match(odzivRacuna(nap), /To je napis na uporniku, ne rezultat tvojih meritev/);
  assert.equal(preveriRacun("100,3", 96.2, { tol: 0.04, nazivno: R }).ok, false, "v 0,5 % od napisa");
  assert.equal(preveriRacun("99", 96.2, { tol: 0.04, nazivno: R }).ok, true, "1 % od napisa, v 4 % od meritev: lasten račun");
  assert.equal(preveriRacun("100", 99.5, { tol: 0.04, nazivno: R }).ok, true, "meritve so same blizu napisa");
  const g = [9.81, 9.8].map((v) => ({ v, kaj: "vrednost iz učbenika" }));
  assert.equal(preveriRacun("9,81", 9.62, { tol: 0.03, nazivno: g }).ok, false);
  assert.equal(preveriRacun("9,8", 9.62, { tol: 0.03, nazivno: g }).ok, false);
  assert.equal(preveriRacun("9,8", 9.79, { tol: 0.03, nazivno: g }).ok, true);
  // pošten račun blizu napisa ni zavrnjen: bližje meritvam ali v ozkem pasu (tol/2) okoli njih (pregled #1054, 3. krog)
  assert.equal(preveriRacun("9,77", 9.7, { tol: 0.03, nazivno: g }).ok, true, "prosti pad: premica 9,70, učenec 9,77");
  assert.equal(preveriRacun("99,6", 98.5, { tol: 0.04, nazivno: R }).ok, true, "Ohm: premica 98,5 Ω, učenec 99,6 Ω iz ene vrstice");
  assert.equal(preveriRacun("100", 98.5, { tol: 0.04, nazivno: R }).ok, true, "100 Ω je v 1,5 % od meritev (pas 2 %)");
  // odziv ne izda rešitve: ne odstotka ne številke, le približno (blizu, precej, daleč) ali faktor 10ⁿ
  const odz = (x, p, tol = 0.04) => odzivRacuna(preveriRacun(String(x), p, { tol }), tol);
  assert.match(odz(102, 96.2), /blizu/);
  assert.match(odz(110, 96.2), /precej/);
  assert.match(odz(150, 96.2), /daleč/);
  assert.match(odz(9.62, 96.2), /faktor ~10\b.*enot/);
  assert.match(odz(0.0962, 96.2), /faktor ~1000\b/);
  for (const x of [102, 110, 150, 9.62]) assert.doesNotMatch(odz(x, 96.2), /\d+\s?%|96/, `odziv za ${x}`);
});

// Shranjene meritve (kot jih zapiše vsak poskus, lab.js → shramba) in vrednost, ki jo mora učenec izračunati iz njih.
const pts = (list) => list.map(([x, y]) => [x, y]);
const HOOKE = pts([[0, 0], [6.4, 0.981], [13.3, 1.962], [19.6, 2.943]]);
const KLANEC = [[0.3, 1.12], [0.5, 1.45], [0.7, 1.72], [0.9, 1.95]];
const PAD = [[0.2, 0.2021], [0.5, 0.3195], [1, 0.4517], [1.5, 0.5531]];
const LOM = [[0.1736, 0.1167], [0.342, 0.2299], [0.5, 0.336], [0.6428, 0.4321]];
const LECA = [{ a: 200, b: 202 }, { a: 300, b: 149 }, { a: 150, b: 302 }];
const VODNIK = [[1, 3.1], [2, 6.0], [3, 9.2], [4, 12.1]]; // I [A], F [mN], vodnik 4 cm, 3 magneti
const GREL = { m: 0.2003, T1: 18.4, T2: 32.1, U: 11.82, I: 4.07, t: 300 };
const PRIMERI = {
  "lab-hooke": {
    data: { rows: [{ vz: "mehka", m: "0", F: "0,00", r: "10,0", x: "0,0" }], meas: HOOKE.map(([x, y]) => ({ g: "mehka", x, y, id: "mehka" })), x0: { mehka: 0.1 } },
    vrednost: naklonSkoziIzhodisce(HOOKE) * 100, tol: 0.04,
  },
  "lab-klanec": {
    data: { rows: [{ niz: "4 cm, 250 g", s: "0,30", t: "1,1200", dt: "–", v: "–" }], meas: KLANEC.map(([s, t]) => ({ niz: "4 cm, 250 g", s, t, t2: t * t, v: null, tv: null })) },
    vrednost: 2 * naklonSkoziIzhodisce(KLANEC.map(([s, t]) => [t * t, s])), tol: 0.04,
  },
  "lab-prosti-pad": {
    data: { rows: [{ pr: "kroglica", h: "0,20", t: "0,2021", t2: "0,0408", v: "–" }], meas: PAD.map(([h, t]) => ({ pr: "jeklena kroglica", id: "jeklo", h, t, t2: t * t, v: null, tv: null })) },
    vrednost: 2 * naklonSkoziIzhodisce(PAD.map(([h, t]) => [t * t, h])), tol: 0.03,
  },
  "lab-lom": {
    data: { rows: [{ snov: "zrak → akril", a: "10°", r: "10°", b: "6,7°", sa: "0,174", sb: "0,117" }], serije: [["pmma:zrak", { name: "zrak → akril", smer: "zrak", n: 1.488, pts: LOM }]] },
    vrednost: 1 / naklon(LOM), tol: 0.03,
  },
  "lab-leca": {
    data: { rows: [{ f: "100 mm", a: "200", b: "202", y: "20,2, obrnjena", ia: "5,00", ib: "4,95" }], meritve: [[100, LECA]] },
    vrednost: fIzMeritev(LECA), tol: 0.015,
  },
  "lab-sila-vodnik": {
    data: { rows: [{ n: "3", L: "4", I: "1,00", dm: "0,32", F: "3,10" }], meas: VODNIK.map(([I, F]) => ({ n: 3, L: 4, I, dm: F / 9.81, F, vis: 0, kot: "precno" })) },
    vrednost: naklonSkoziIzhodisce(VODNIK) / 0.04, tol: 0.05, // mT
  },
  "lab-grelnik": {
    data: {
      rows: [{ t: "0", U: "0,00", I: "0,00", T: "18,4" }],
      meas: [{ t: 0, U: 0, I: 0, T: GREL.T1, on: false, mes: false }, { t: 150, U: GREL.U, I: GREL.I, T: 25, on: true, mes: false }, { t: 330, U: 0, I: 0, T: GREL.T2, on: false, mes: true }],
      mStud: GREL.m * 1000, tOn: GREL.t,
    },
    vrednost: 100 * izkoristek(GREL).eta, tol: 0.03,
  },
};

let browser = null;
before(async () => {
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
});

const stevilo = (t) => Number(String(t).replace(/\s| /g, "").replace("−", "-").replace(",", "."));

test("student's own calculation in a browser", { timeout: 180000 }, async (t) => {
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const vpisi = async (p, x) => {
    await p.locator(".lab-racun input").fill(String(x).replace(".", ","));
    await p.locator(".lab-racun").getByRole("button", { name: "Preveri moj račun" }).click();
    return p.evaluate(() => ({ c: document.querySelector(".lab-racun .lab-why").className, t: document.querySelector(".lab-racun .lab-why").textContent }));
  };

  await t.test("lab-ohm: R from the slope of the student's own points; hidden until solved", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const { p, errs } = await odpri(ctx, base, "lab-ohm");
    assert.equal(await p.evaluate(() => document.querySelector(".lab-racun").hidden), true, "brez meritev ni kaj računati");
    await meriOhm(p, [2, 4, 6]);
    const st = await p.evaluate(() => ({
      skrito: document.querySelector(".lab-racun").hidden,
      fit: document.querySelector(".lab-fitout").textContent,
      tocke: [...document.querySelectorAll(".lab-table tbody tr")].map((tr) => [tr.children[2].textContent, tr.children[3].textContent]),
      ui: [...document.querySelectorAll(".lab-table tbody tr")].map((tr) => tr.children[4].textContent),
      kaj: document.querySelector(".lab-racun .lab-q-text").textContent,
    }));
    assert.equal(st.skrito, false);
    assert.equal(await p.evaluate(() => document.querySelectorAll(".lab-q.lab-racun").length), 0, "račun ni .lab-q (vodeni način šteje sklepe)");
    assert.deepEqual(st.ui, ["–", "–", "–"], "stolpec U/I pri uporniku ne izda upora");
    const sirina = await p.evaluate(() => { const t = document.querySelector(".lab-table"); return [t.scrollWidth, t.closest(".lab-table-wrap").clientWidth]; });
    assert.ok(sirina[0] <= sirina[1], `tabela pri 360 px ne drsi vstran: ${sirina}`);
    assert.doesNotMatch(st.kaj, /Ω|100/, "naloga ne pove napisa na uporniku");
    assert.doesNotMatch(st.fit, /Ω|R =/, "upora aplikacija ne pove, dokler ga učenec ne izračuna");
    // pričakovano iz točk v tabeli (zaokroženi odčitki): premica skozi izhodišče
    const R = 1000 / fitOrigin(st.tocke.map(([U, I]) => [stevilo(U), stevilo(I)]));
    const slabo = await vpisi(p, (R * 1.12).toFixed(1));
    assert.equal(slabo.c, "lab-why bad");
    assert.match(slabo.t, /precej razlikuje/);
    assert.doesNotMatch(slabo.t, /\d/, "odziv ne izda rešitve");
    // star odziv izgine, ko učenec vpiše nov rezultat (tudi »Vpiši število«)
    await p.locator(".lab-racun input").fill("9");
    assert.equal(await p.evaluate(() => document.querySelector(".lab-racun .lab-why").hidden), true);
    assert.match((await vpisi(p, "abc")).t, /Vpiši število/);
    await p.locator(".lab-racun input").fill("9");
    assert.equal(await p.evaluate(() => document.querySelector(".lab-racun .lab-why").hidden), true);
    // vrednost z napisa na uporniku ni rezultat meritev (ko se meritve od nje razlikujejo za več kot 1 %)
    if (Math.abs(100 / R - 1) > 0.02) {
      const napis = await vpisi(p, "100 Ω");
      assert.equal(napis.c, "lab-why bad");
      assert.match(napis.t, /napis na uporniku/);
    }
    assert.match((await vpisi(p, (R * 10).toFixed(0))).t, /faktor ~10\b/);
    assert.doesNotMatch(await p.evaluate(() => document.querySelector(".lab-fitout").textContent), /Ω/);
    const dobro = await vpisi(p, (R * 1.02).toFixed(1));
    assert.equal(dobro.c, "lab-why ok");
    const prikaz = stevilo(dobro.t.match(/dobiš ([\d,]+)/)[1]);
    assert.ok(Math.abs(prikaz - R) <= 0.005 * R + 0.05, `prikazano ${prikaz}, iz tabele ${R}`);
    const fit = await p.evaluate(() => document.querySelector(".lab-fitout").textContent);
    assert.match(fit, /Na uporniku piše 100/, "po pravilnem računu je izračun viden");
    assert.ok(fit.replace(/\{,\}/g, ",").replace(/\s/g, "").includes(String(prikaz).replace(".", ",")), `izračun pod grafom kaže isto: ${fit}`); // brez KaTeX v testu: 95{,}9
    // Izbriši meritve: rešitev ni več odkrita, nove meritve istega upornika spet računa sam
    await p.getByRole("button", { name: "Izbriši meritve" }).click();
    assert.equal(await p.evaluate(() => document.querySelector(".lab-racun").hidden), true);
    await meriOhm(p, [3, 5, 7]);
    assert.doesNotMatch(await p.evaluate(() => document.querySelector(".lab-fitout").textContent), /Ω/, "po brisanju je izračun spet skrit");
    assert.equal(await p.evaluate(() => document.querySelector(".lab-racun input").value), "");
    assert.deepEqual(errs, []);
    await ctx.close();
  });

  await t.test("every experiment: expected = value from the stored measurements; in tolerance passes, outside fails; »Pokaži rešitev«", async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const { p, errs } = await odpri(ctx, base);
    for (const [id, x] of Object.entries(PRIMERI)) {
      await p.evaluate(([id, data]) => localStorage.setItem(`evklid.lab.meritve.0.${id}`, JSON.stringify({ v: 1, seed: 7, ...data })), [id, x.data]);
      await p.evaluate((id) => window.mount(id), id);
      assert.equal(await p.evaluate(() => document.querySelector(".lab-racun")?.hidden), false, `${id}: ni računa`);
      const prej = await p.evaluate(() => document.querySelector(".lab-racun").previousElementSibling.textContent);
      // zunaj dovoljenega odstopanja: napačno, izračun ostane skrit
      const slabo = await vpisi(p, x.vrednost * (1 + 2.2 * x.tol));
      assert.equal(slabo.c, "lab-why bad", `${id}: ${slabo.t}`);
      // v dovoljenem odstopanju: pravilno
      const dobro = await vpisi(p, x.vrednost * (1 + 0.6 * x.tol));
      assert.equal(dobro.c, "lab-why ok", `${id}: ${dobro.t}`);
      // prikazana vrednost je ista kot iz meritev
      const prikaz = stevilo(dobro.t.match(/dobiš (−?[\d,]+)/)[1]);
      assert.ok(Math.abs(prikaz - x.vrednost) <= 0.006 * Math.abs(x.vrednost) + 0.0006, `${id}: prikazano ${prikaz}, iz meritev ${x.vrednost}`);
      const po = await p.evaluate(() => document.querySelector(".lab-racun").previousElementSibling.textContent);
      assert.notEqual(po, prej, `${id}: izračun se po pravilnem računu ne pokaže`);
      // ob vrnitvi je račun rešen (izračun viden), »Pokaži rešitev« pri novem poskusu
      await p.evaluate((id) => window.mount(id), id);
      assert.equal(await p.evaluate(() => document.querySelector(".lab-racun").previousElementSibling.textContent), po, `${id}: rešen račun se ni ohranil`);
      await p.evaluate((id) => localStorage.removeItem(`evklid.lab.meritve.0.${id}`), id);
      await p.evaluate(([id, data]) => localStorage.setItem(`evklid.lab.meritve.0.${id}`, JSON.stringify({ v: 1, seed: 7, ...data })), [id, x.data]);
      await p.evaluate((id) => window.mount(id), id);
      await p.locator(".lab-racun").getByRole("button", { name: "Pokaži rešitev" }).click();
      const res = await p.evaluate(() => document.querySelector(".lab-racun .lab-why").textContent);
      assert.ok(Math.abs(stevilo(res.match(/meritev: (−?[\d,]+)/)[1]) - x.vrednost) <= 0.006 * Math.abs(x.vrednost) + 0.0006, `${id}: ${res}`);
      assert.equal(await p.evaluate(() => document.querySelector(".lab-racun").previousElementSibling.textContent), po, `${id}: rešitev ne pokaže izračuna`);
      await p.evaluate((id) => localStorage.removeItem(`evklid.lab.meritve.0.${id}`), id);
    }
    assert.deepEqual(errs, []);
    await ctx.close();
  });
});
