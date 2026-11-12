// Okna s podatki (čipi) pod interaktivno skico se ob premikanju drsnikov ne premikajo in ne spreminjajo velikosti
// (j, 12. 11. 2026: »Naj se okna s podatki pri skicah ipd ne premikajo s spremembo drsnikov«). Kartica Formule →
// MAT-SS → »Temenska oblika« (kvadratna funkcija): vsak čip in vsak drsnik ostane na istem mestu in iste velikosti
// (±0,5 px) pri a, p, q od skrajnosti do skrajnosti, z D < 0 (»ni realnih«), D = 0 in dolgimi decimalkami.
// Telefon 390 × 844, temni in svetli slog. SKICE_POSNETEK=<mapa> shrani še posnetke zaslona.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };
const posnetek = process.env.SKICE_POSNETEK || "";

async function withApp(fn) {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

async function odpriSkico(base, mode) {
  const ctx = await chromium.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
  await ctx.addInitScript((mode) => {
    localStorage.setItem("evklid.tour", "1");
    localStorage.setItem("evklid.theme", JSON.stringify({ style: "cist", mode }));
  }, mode);
  const p = await ctx.newPage();
  const napake = [];
  p.on("pageerror", (e) => napake.push(e.message));
  await p.goto(base + "/healthz");
  const id = await p.evaluate(() =>
    fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Skica", settings: { school: "SREDNJA_SOLA", grade: "1. letnik" } }) })
      .then((r) => r.json())
      .then((s) => s.id),
  );
  await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
  await p.goto(base + "/");
  await p.waitForSelector('.topbar .tab[data-view="graph"]', { state: "attached", timeout: 60000 });
  await p.waitForSelector(".iq-wrap [data-iq=skip]", { timeout: 15000 }).then((b) => b.click()).catch(() => {});
  await p.evaluate(() => document.querySelector('.topbar .tab[data-view="graph"]').click());
  await p.waitForSelector('#view-graph [data-calc-mode="formulas"]', { state: "attached", timeout: 60000 });
  await p.evaluate(() => document.querySelector('#view-graph [data-calc-mode="formulas"]').click());
  await p.waitForSelector("#view-graph .fm .fm-sec", { timeout: 60000 });
  await p.evaluate(() => {
    document.querySelector('#view-graph .fm-subj [data-k="MAT"]').click();
    document.querySelector('#view-graph .fm-lvl [data-k="SS"]').click();
  });
  // Skica kvadratne funkcije: edina z drsniki a, p, q na listu MAT-SS.
  const najdi = () =>
    [...document.querySelectorAll("#view-graph .fm-skica")].find((h) => h.querySelector(".sk-svg")?.getAttribute("aria-label")?.startsWith("Graf kvadratne funkcije"));
  await p.waitForFunction(() => document.querySelectorAll("#view-graph .fm-skica").length > 0, null, { timeout: 60000 });
  // Skice se naložijo, ko so vidne: list pomikamo, dokler se kvadratna ne pojavi.
  for (let i = 0; i < 60 && !(await p.evaluate(`(${najdi})() !== undefined`)); i++) {
    await p.evaluate(() => {
      const kandidati = [...document.querySelectorAll("#view-graph .fm-skica")].filter((h) => !h.querySelector(".sk-svg"));
      kandidati[0]?.scrollIntoView({ block: "center" });
    });
    await p.waitForTimeout(400);
  }
  await p.evaluate(`(${najdi})().scrollIntoView({ block: "start" })`);
  await p.waitForTimeout(300);
  await p.evaluate(`window.__skica = (${najdi})(); window.__skica.querySelector(".sk-chips").scrollIntoView({ block: "center" })`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800); // pisave KaTeX in prilagoditev širine formul (public/sirina.js)
  return { ctx, p, napake };
}

const skatle = (p) =>
  p.evaluate(() => {
    const r = (e) => {
      const b = e.getBoundingClientRect();
      return [b.x, b.y, b.width, b.height].map((v) => Math.round(v * 100) / 100);
    };
    const s = window.__skica;
    return {
      cipi: [...s.querySelectorAll(".sk-chip")].map(r),
      drsniki: [...s.querySelectorAll(".sk-ctl .sk-slider")].map(r),
      vrstice: [...s.querySelectorAll(".sk-ctl .sk-slider input")].map(r),
      besedila: [...s.querySelectorAll(".sk-chip")].map((c) => c.textContent),
      // vsebina čipa ne sme gledati čez rob čipa (ni prelomov, ni odrezanih oznak)
      cez: [...s.querySelectorAll(".sk-chip")].filter((c) => c.scrollWidth > c.clientWidth + 1 || c.scrollHeight > c.clientHeight + 1).map((c) => c.textContent),
      vrsticeOznak: [...s.querySelectorAll(".sk-chip .sk-tex")].map((t) => Math.round(t.getBoundingClientRect().height)),
    };
  });

async function nastavi(p, i, v) {
  await p.evaluate(
    ([i, v]) => {
      const inp = window.__skica.querySelectorAll(".sk-ctl .sk-slider input")[i];
      inp.value = String(v);
      inp.dispatchEvent(new Event("input", { bubbles: true }));
    },
    [i, v],
  );
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

const enako = (a, b) => a.length === b.length && a.every((x, i) => x.every((v, j) => Math.abs(v - b[i][j]) <= 0.5));

for (const mode of ["dark", "light"]) {
  test(`skica kvadratne funkcije (${mode}): čipi in drsniki ostanejo na mestu pri vseh vrednostih`, opts, async () => {
    await withApp(async (base) => {
      const { ctx, p, napake } = await odpriSkico(base, mode);
      try {
        const zacetek = await skatle(p);
        assert.equal(zacetek.cipi.length, 5, "pet čipov");
        assert.equal(zacetek.drsniki.length, 3, "trije drsniki");
        if (posnetek) await p.screenshot({ path: `${posnetek}/kvadratna-${mode}-zacetek.png` });
        // a: −2 … 2 (z dolgimi decimalkami), p: −3 … 3, q: −3 … 3 (D < 0, D = 0, D > 0)
        const A = [-2, -1.37, -0.1, 0.1, 0.73, 1.1, 2];
        const P = [-3, -1.23, 0, 2.77, 3];
        const Q = [-3, -0.01, 0, 1.91, 3];
        const videno = new Set();
        let st = 0;
        for (const a of A)
          for (const pp of P)
            for (const q of Q) {
              await nastavi(p, 0, a);
              await nastavi(p, 1, pp);
              await nastavi(p, 2, q);
              const zdaj = await skatle(p);
              zdaj.besedila.forEach((b) => videno.add(b));
              const opis = `a=${a} p=${pp} q=${q}: ${zdaj.besedila.join(" | ")}`;
              assert.ok(enako(zdaj.cipi, zacetek.cipi), `čipi so se premaknili (${opis})\n${JSON.stringify(zacetek.cipi)}\n${JSON.stringify(zdaj.cipi)}`);
              assert.ok(enako(zdaj.drsniki, zacetek.drsniki), `drsniki so se premaknili (${opis})`);
              assert.ok(enako(zdaj.vrstice, zacetek.vrstice), `vrstice drsnikov so se premaknile (${opis})`);
              assert.deepEqual(zdaj.cez, [], `vsebina gleda iz čipa (${opis})`);
              if (posnetek && (st++ === 0 || (a === -1.37 && pp === -1.23 && q === -3) || (a === 0.73 && pp === 2.77 && q === -0.01)))
                await p.screenshot({ path: `${posnetek}/kvadratna-${mode}-a${a}-p${pp}-q${q}.png` });
            }
        if (posnetek) {
          // primer z j-jevega posnetka: teme levo ob osi y (oznaka T ne sme pokriti številke osi)
          for (const [i, v] of [[0, 1.1], [1, -0.5], [2, -2]]) await nastavi(p, i, v);
          await p.evaluate(() => window.__skica.scrollIntoView({ block: "start" }));
          await p.waitForTimeout(200);
          await p.evaluate(() => window.__skica.querySelector(".sk-frame").scrollIntoView({ block: "center" }));
          await (await p.evaluateHandle(() => window.__skica)).asElement().screenshot({ path: `${posnetek}/kvadratna-${mode}-skica-p-0.5.png` });
        }
        const vse = [...videno].join(" ");
        assert.match(vse, /ni realnih/, "preizkušen D < 0");
        assert.match(vse, /x1=x2|x1​=x2/, "preizkušena dvojna ničla");
        assert.deepEqual(napake, []);
      } finally {
        await ctx.close();
      }
    });
  });
}

test.after(() => chromium?.close());
