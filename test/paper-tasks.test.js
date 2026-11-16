// Razdelitev prenesene pole na naloge (public/paper-tasks.js): elementi besedilne plasti pdf.js → naloge z območji.
import test from "node:test";
import assert from "node:assert/strict";
import { splitTasks, textInBox, pageLines } from "../public/paper-tasks.js";
import fixture from "./fixtures/tiny-pdf.cjs";

const W = 595.32;
const H = 841.92;
const it = (str, x, y, h = 11, w = str.length * 5) => ({ str, transform: [h, 0, 0, h, x, y], width: w, height: h });
const page = (items) => ({ width: W, height: H, items });
// stranski napis »Tukaj ne piši« (zasukan) in glava s kodo pole ter številko strani
const chrome = (n) => [{ str: "Tukaj ne piši. Tukaj ne piši.", transform: [0, 17, -17, 0, 31.5, 20], width: 800, height: 17 }, it(`*N2614013${n}*`, 224, 790, 32), it(`${n}/16`, 501.8, 790.1, 8)];

test("pola v slogu NPZ: podnaloge ponovijo številko, naloga čez dve strani, prazna stran brez nalog", () => {
  const pages = [
    page([...chrome(1), it("Preizkus znanja", 200, 600, 20), it("1. Navodila: piši s kemičnim svinčnikom.", 140, 400)]),
    page([...chrome(2), it("1.", 70.9, 752.2), it("Izračunaj", 92.2, 752.2), it(".", 136.8, 752.2),
      it("1.", 70.9, 727.4), it("a)", 92.2, 727.4), it("900", 115, 727.3), it("−", 135.6, 727.3), it("1200", 143, 727.3), it("(1 točka)", 482.3, 702.2),
      it("1.", 70.9, 613.6), it("b)", 92.2, 613.6), it("0,8 · 3,2 =", 115, 613.5), it("(1 točka)", 482.3, 587.4)]),
    page([...chrome(3), it("2.", 70.9, 752.2), it("a)", 92.2, 752.2), it("Kolikšen del lika je osenčen?", 113.5, 752.2), it("Odgovor:", 113.5, 591.2), it("(1 točka)", 482.3, 564),
      it("2.", 70.9, 300), it("b)", 92.2, 300), it("Zapiši z ulomkom.", 113.5, 300)]),
    page([...chrome(4), it("2.", 70.9, 752.2), it("c)", 92.2, 752.2), it("Zapiši z decimalno številko.", 113.5, 752.2),
      it("3.", 70.9, 400.5), it("Reši enačbo", 92.2, 400.5), it("2x + 1 = 7", 160, 400.5), it("5.", 300, 380) /* število v besedilu, ne naloga */]),
    page([...chrome(5), it("Prazna stran", 170, 444, 36)]),
  ];
  const tasks = splitTasks(pages);
  assert.deepEqual(tasks.map((t) => t.label), ["1", "2", "3"]);
  const [t1, t2, t3] = tasks;
  assert.equal(t1.regions.length, 1);
  assert.equal(t1.regions[0].page, 1);
  assert.ok(t1.regions[0].y0 < H - 752.2 - 11 && t1.regions[0].y0 > 60, "območje se začne tik nad številko");
  assert.match(t1.text, /^1\. Izračunaj\./);
  assert.match(t1.text, /a\) 900 − 1200/);
  assert.match(t1.text, /b\) 0,8 · 3,2 =/);
  assert.ok(!/Tukaj ne piši|N2614013|\/16/.test(t1.text), "brez stranskega napisa in glave");
  // naloga 2 ima del na strani 3 in na strani 4 (do naloge 3)
  assert.deepEqual(t2.regions.map((r) => r.page), [2, 3]);
  assert.match(t2.text, /c\) Zapiši z decimalno številko\./);
  assert.ok(t2.regions[1].y1 <= H - 400.5 - 11, "del na strani 4 se konča pred nalogo 3");
  assert.ok(t3.regions[0].y0 >= t2.regions[1].y1 - 1);
  assert.match(t3.text, /2x \+ 1 = 7/);
  // levi rob in desni rob sta simetrična, območje ne seže čez stran
  for (const t of tasks) for (const r of t.regions) assert.ok(r.x0 >= 0 && r.x1 <= W && r.y1 <= H && r.y0 < r.y1);
});

test("pola v slogu mature: deli A in B začnejo pri 1, številka razbita na »1« + ».«, podnaloge 4.1", () => {
  const pages = [
    page([it("A) KRATKE NALOGE", 70.9, 754.3, 10), it("1.", 70.9, 722.3, 10), it("Razcepite 126 in 150.", 92.2, 722.3, 10), it("(3 točke)", 486, 705, 10),
      it("2.", 70.9, 409.3, 10), it("Izračunajte 5/6 : 0,5.", 92.2, 409.3, 10)]),
    page([it("B) KRAJŠE STRUKTURIRANE NALOGE", 70.9, 754.3, 10), it("1", 70.9, 721.4, 10, 5.5), it(".", 76.4, 721.4, 10, 2.8), it("Na sliki je množica.", 92.2, 721.4, 10)]),
    page([it("2.", 70.9, 744.4, 10), it("Rešite enačbi:", 92.2, 744.4, 10), it("2.1.", 92.2, 700, 10), it("log x = 3", 120, 700, 10)]),
  ];
  const tasks = splitTasks(pages);
  assert.deepEqual(tasks.map((t) => t.label), ["A1", "A2", "B1", "B2"]);
  assert.equal(tasks[2].regions[0].page, 1);
  assert.ok(tasks[2].regions[0].y0 > H - 754.3, "naslov dela ni v nalogi");
  assert.match(tasks[2].text, /^1\. Na sliki/);
  assert.match(tasks[3].text, /2\.1\. log x = 3/);
});

test("skenirana pola (brez besedilne plasti) nima nalog; okvir vrne besedilo v njem", () => {
  assert.deepEqual(splitTasks([page([]), page([])]), []);
  assert.deepEqual(splitTasks([]), []);
  const p = page([it("Slika 1", 100, 500), it("Odgovor: ____", 100, 300)]);
  assert.equal(textInBox(p, { x0: 80, y0: H - 520, x1: 400, y1: H - 480 }), "Slika 1");
  assert.equal(pageLines(p).length, 2);
});

test("pravi PDF: pdf.js prebere besedilno plast majhne pole in najde dve nalogi", async () => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(fixture.tinyPdf(fixture.SAMPLE));
  const doc = await pdfjs.getDocument({ data, verbosity: 0, isEvalSupported: false }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const pg = await doc.getPage(n);
    const vp = pg.getViewport({ scale: 1 });
    pages.push({ width: vp.width, height: vp.height, items: (await pg.getTextContent()).items });
  }
  await doc.loadingTask.destroy();
  const tasks = splitTasks(pages);
  assert.deepEqual(tasks.map((t) => t.label), ["1", "2"]);
  assert.match(tasks[0].text, /a\) 12 \+ 30 =/);
  assert.match(tasks[1].text, /25 % od 80/);
  assert.equal(tasks[1].regions[0].page, 1);
});

test("številka strani, črtna koda in koda pole niso del besedila naloge (j 1. 11.: »5« pod nalogo)", () => {
  const pages = [
    page([it("A) KRATKE NALOGE", 70.9, 754.3, 10), it("1.", 70.9, 722.3, 10), it("Števili 126 in 150 razcepite na prafaktorje.", 92.2, 722.3, 10),
      it("12", 300, 600, 10) /* število v nalogi ostane */, it("(3 točke)", 486, 405, 10), it("*M26140111*", 230, 72, 20), it("5", 295, 48, 10)]),
    page([it("M261-401-1-1", 70, 770, 8), it("2.", 70.9, 722.3, 10), it("Izračunajte 5/6 : 0,5.", 92.2, 722.3, 10), it("Obrnite list.", 450, 60, 9), it("6/16", 290, 45, 9)]),
  ];
  const tasks = splitTasks(pages);
  assert.deepEqual(tasks.map((t) => t.label), ["1", "2"]);
  assert.equal(tasks[0].text, "1. Števili 126 in 150 razcepite na prafaktorje.\n12\n(3 točke)");
  assert.equal(tasks[1].text, "2. Izračunajte 5/6 : 0,5.");
  assert.equal(textInBox(pages[0], { x0: 60, y0: H - 420, x1: 560, y1: H - 30 }), "(3 točke)");
});
