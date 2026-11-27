// Risalna površina (public/crnilo.js): čečka briše, pisalo izključi risanje s prsti, dvojni dotik prsta zamenja orodje
// (j, 27. 11. 2026: »dvojni tap za radirko«, »počečkaj in se izbriše«, »ob vnosu s svinčnikom prsti ne rišejo«).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { isScratch, scratchVictims, reversals } from "../public/crnilo.js";

// cikcak čez pravokotnik x 100–220, y 40–80: n potez levo-desno
const zigzag = (n, x0 = 100, x1 = 220, y0 = 40, y1 = 80) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const y = y0 + ((y1 - y0) * i) / n;
    const from = i % 2 ? x1 : x0;
    const to = i % 2 ? x0 : x1;
    for (let k = 0; k <= 8; k++) pts.push([from + ((to - from) * k) / 8, y + (k * (y1 - y0)) / n / 8]);
  }
  return pts;
};
const line = (x0, y0, x1, y1, n = 20) => Array.from({ length: n + 1 }, (_, i) => [x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n]);

test("čečka: cikcak z vsaj 4 obrati je čečka, črke in ravne črte niso", () => {
  assert.equal(isScratch(zigzag(6)), true);
  assert.equal(isScratch(zigzag(2)), false, "trije zamahi (kot Z) niso čečka");
  assert.equal(isScratch(line(0, 0, 200, 0)), false);
  // W: dol-gor-dol-gor = 3 obrati po y
  const W = [...line(0, 0, 20, 60, 10), ...line(20, 60, 40, 10, 10), ...line(40, 10, 60, 60, 10), ...line(60, 60, 80, 0, 10)];
  assert.equal(isScratch(W), false);
  assert.equal(reversals(zigzag(6), 0, 10), 6);
  // drobna čečka (pika, ki se trese) ni brisanje
  assert.equal(isScratch(zigzag(6, 0, 10, 0, 6)), false);
});

test("čečka: izbriše le poteze, ki ležijo pod njo", () => {
  const covered = { tool: "pen", pts: line(120, 60, 200, 60) };
  const other = { tool: "pen", pts: line(400, 60, 480, 60) };
  const half = { tool: "pen", pts: line(180, 60, 300, 60) }; // le del pod čečko
  const scratch = { tool: "pen", pts: zigzag(6) };
  const strokes = [covered, other, half, scratch];
  assert.deepEqual(scratchVictims(strokes, scratch), [0]);
});

// ---------- pravi brskalnik ----------
const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

test("crnilo v brskalniku: pisalo izključi prste, dvojni dotik zamenja orodje, čečka in Razveljavi", { skip: !playwright && "ni Playwrighta" }, async () => {
  const src = fs.readFileSync(path.resolve("public/crnilo.js"), "utf8");
  const b = await playwright.chromium.launch();
  try {
    const p = await b.newPage({ viewport: { width: 600, height: 400 } });
    await p.route("http://evklid.test/**", (r) =>
      r.request().url().endsWith("/crnilo.js")
        ? r.fulfill({ contentType: "text/javascript", body: src })
        : r.fulfill({ contentType: "text/html", body: '<div id="w" style="width:500px;height:300px"><canvas class="ink" style="display:block;width:100%;height:100%;touch-action:none"></canvas></div>' }),
    );
    await p.goto("http://evklid.test/");
    await p.evaluate(async () => {
      const { createInk } = await import("/crnilo.js");
      const ink = createInk(document.querySelector("canvas"));
      ink.fit();
      window.ink = ink;
      window.tools = [];
      ink.onTool = (t) => window.tools.push(t);
      const c = document.querySelector("canvas");
      const r = c.getBoundingClientRect();
      let id = 1;
      window.stroke = (type, pts, { width = 1 } = {}) => {
        const pid = id++;
        const ev = (name, [x, y]) =>
          c.dispatchEvent(new PointerEvent(name, { pointerId: pid, pointerType: type, isPrimary: true, bubbles: true, clientX: r.left + x, clientY: r.top + y, width, height: width, button: name === "pointermove" ? -1 : 0 }));
        ev("pointerdown", pts[0]);
        for (const q of pts.slice(1)) ev("pointermove", q);
        ev("pointerup", pts[pts.length - 1]);
      };
    });
    const hasInk = () => p.evaluate(() => window.ink.hasInk());
    // prst riše, dokler naprava ne pozna pisala
    await p.evaluate(() => localStorage.removeItem("evklid.pisalo"));
    await p.evaluate(() => window.stroke("touch", [[10, 10], [60, 10]]));
    assert.equal(await hasInk(), true);
    await p.evaluate(() => window.ink.clear());
    // pisalo: od zdaj prsti ne rišejo (tudi pozneje, shranjeno na napravi)
    await p.evaluate(() => window.stroke("pen", [[120, 60], [160, 60], [200, 60]]));
    assert.equal(await p.evaluate(() => localStorage.getItem("evklid.pisalo")), "1");
    await p.waitForTimeout(600); // po pisalu dotik ni takoj ukaz (dlan)
    const before = await p.evaluate(() => window.ink.version);
    await p.evaluate(() => window.stroke("touch", [[300, 200], [380, 220]]));
    assert.equal(await p.evaluate(() => window.ink.version), before, "prst ne riše");
    // dvojni dotik prsta: radirka, še enkrat: pisalo
    await p.evaluate(() => {
      window.stroke("touch", [[300, 200]]);
      window.stroke("touch", [[302, 201]]);
    });
    assert.equal(await p.evaluate(() => window.ink.tool), "eraser");
    await p.evaluate(() => {
      window.stroke("touch", [[300, 200]]);
      window.stroke("touch", [[302, 201]]);
    });
    assert.deepEqual(await p.evaluate(() => window.tools), ["eraser", "pen"]);
    // dlan (velika ploskev) ni dotik
    await p.evaluate(() => {
      window.stroke("touch", [[300, 200]], { width: 80 });
      window.stroke("touch", [[300, 200]], { width: 80 });
    });
    assert.equal(await p.evaluate(() => window.ink.tool), "pen");
    // čečka s pisalom izbriše zapis, Razveljavi ga vrne
    const zz = zigzag(6);
    await p.evaluate((pts) => window.stroke("pen", pts), zz);
    assert.equal(await hasInk(), false, "počečkano je izbrisano");
    await p.evaluate(() => window.ink.undo());
    assert.equal(await hasInk(), true, "Razveljavi vrne izbrisano");
    // nova miniaturna slika za branje: krajša stranica vsaj ~220 px
    const dim = await p.evaluate(
      () =>
        new Promise((res) => {
          const im = new Image();
          im.onload = () => res([im.width, im.height]);
          im.src = window.ink.exportImage();
        }),
    );
    assert.ok(dim[1] >= 200 && dim[0] <= 1000, `velikost slike ${dim}`);
  } finally {
    await b.close();
  }
});
