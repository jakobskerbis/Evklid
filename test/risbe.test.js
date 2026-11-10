// Risbe v lekcijah (server/risbe.js; j, 10. 11. 2026): blok »:::risba« → vrstični SVG brez skript,
// matematično točen, z opisom za bralnik zaslona; v načinu »plain« ostane samo opis.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { renderDrawing, expandDrawings, drawingErrors, DRAW_KINDS } from "../server/risbe.js";
import { expandFormulaBlocks, parseLesson } from "../server/textbook.js";
import { renderMd } from "../server/textbook-print.js";
import { checkLessonSource } from "../server/lesson-check.js";

const OPIS = "opis: Številska premica od −6 do 3 z enakimi koraki.";
const blok = (vrsta, telo) => `:::risba ${vrsta}\n${telo}\n:::`;
const attr = (html, tag, name) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*\\s${name}="([^"]*)"`, "g"))].map((m) => +m[1]);

test("premica: črtice so enako narazen in števila v pravem vrstnem redu", () => {
  const { html } = renderDrawing("premica", `${OPIS}\nod: -6\ndo: 3`);
  const xs = [...new Set(attr(html, "line", "x1"))].filter((x) => attr(html, "text", "x").includes(x));
  assert.equal(xs.length, 10);
  const d = xs.slice(1).map((x, i) => +(x - xs[i]).toFixed(2));
  assert.ok(d.every((v) => Math.abs(v - d[0]) < 0.02), `koraki ${d}`);
  assert.deepEqual([...html.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]), ["−6", "−5", "−4", "−3", "−2", "−1", "0", "1", "2", "3"]);
});

test("graf: krivulja gre skozi izračunane točke, zunaj območja je odrezana", () => {
  const { html } = renderDrawing("graf", "opis: Graf polinoma tretje stopnje z ničlami.\nx: -3 .. 4\ny: -20 .. 20 | 10\nf: (x+2)*(x-1)^2*(x-3)");
  const d = /<path class="rs-l a rs-b" d="([^"]+)"/.exec(html)[1];
  const pts = [...d.matchAll(/[ML]?(-?[\d.]+),(-?[\d.]+)/g)].map((m) => [+m[1], +m[2]]);
  // viewBox: x od 40 do 298 za −3 … 4, y od 20 (vrednost 20) do 210 (vrednost −20)
  const X = (v) => 40 + ((v + 3) / 7) * 258;
  const Y = (v) => 20 + 190 - ((v + 20) / 40) * 190;
  const near = (x, y) => pts.some((p) => Math.abs(p[0] - X(x)) < 0.8 && Math.abs(p[1] - Y(y)) < 1.2);
  assert.ok(near(0, -6), "p(0) = −6");
  assert.ok(near(2, -4), "p(2) = −4");
  assert.ok(pts.every((p) => p[1] >= 19.99 && p[1] <= 210.01), "krivulja ostane v risbi");
});

test("graf z enako enoto: trikotnik 3-4-5 ima na risbi razmerje stranic 3 : 4 : 5", () => {
  const { html } = renderDrawing("graf", "opis: Pravokotni trikotnik s katetama 4 in 3 v koordinatnem sistemu.\nx: 0 .. 6\ny: 0 .. 5\nenako: da\nlik: 1; 1 -> 5; 1 -> 5; 4");
  const p = /<polygon class="rs-p" points="([^"]+)"/.exec(html)[1].split(" ").map((q) => q.split(",").map(Number));
  const len = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const u = len(p[0], p[1]) / 4;
  assert.ok(Math.abs(len(p[1], p[2]) / u - 3) < 0.01 && Math.abs(len(p[0], p[2]) / u - 5) < 0.01);
});

test("mreža, stolpci, atom, molekula: število likov ustreza podatkom", () => {
  const n = (html, re) => (html.match(re) || []).length;
  assert.equal(n(renderDrawing("mreža", "opis: Kvadrat iz 16 enakih kvadratkov.\nvrstic: 4\nstolpcev: 4").html, /<rect /g), 16);
  const st = renderDrawing("stolpci", "opis: Stolpčni prikaz priljubljenih športov.\nstolpec: nogomet | 9\nstolpec: atletika | 2\nkorak: 2").html;
  const h = attr(st, "rect", "height");
  assert.ok(Math.abs(h[0] / h[1] - 4.5) < 0.01, "višini stolpcev sta v razmerju 9 : 2");
  assert.equal(n(renderDrawing("atom", "opis: Atom natrija z lupinami 2, 8, 1.\njedro: 11 p⁺\nlupine: 2, 8, 1").html, /<circle class="rs-f a"/g), 11);
  const m = renderDrawing("molekula", "opis: Strukturna formula metana CH4.\n---\n      H\n      |\n  H – C – H\n      |\n      H").html;
  assert.equal(n(m, /<line /g), 4);
  assert.equal(n(m, /<text /g), 5);
  assert.match(renderDrawing("molekula", "opis: Skupina CH3 z indeksom spodaj.\n---\nCH3 – OH").html, /CH₃/);
});

test("varnost in dostopnost: samo dovoljene oznake, brez skript in povezav, z opisom", () => {
  const vzorci = {
    premica: "od: 0\ndo: 2\nkorak: 0,25\noznaka: 0,5 | <b>1/2</b>\ntočka: 1 | A\nskok: 0 -> 1,5 | +1,5\ninterval: 0,5 .. 1 | del",
    skica: 'območje: 0; 0 .. 4; 3\nčrta: 0; 0 -> 4; 3 | puščica\nnapis: 1; 1 | "><script>alert(1)</script> | nad\nkrog: 2; 1 | 0,5',
    graf: "x: -2 .. 2\ny: -1 .. 4\nf: x^2\ntočka: 1; 1 | T",
  };
  for (const [vrsta, telo] of Object.entries(vzorci)) {
    const { html } = renderDrawing(vrsta, `opis: Opis risbe za bralnik zaslona | z navpičnico in $ znakom.\n${telo}`);
    const tags = new Set([...html.matchAll(/<([a-z]+)/g)].map((m) => m[1]));
    for (const t of tags) assert.ok(["figure", "figcaption", "svg", "title", "line", "polyline", "polygon", "rect", "circle", "path", "text", "tspan"].includes(t), `${vrsta}: oznaka <${t}>`);
    assert.doesNotMatch(html, /<script|\son[a-z]+=|href|url\(|javascript:/i);
    assert.match(html, /role="img" aria-label="Opis risbe[^"]+"><title>Opis risbe/);
    assert.doesNotMatch(html, /[\n|$]/, "ena vrstica brez | in $ (Markdown ne sme videti tabele ali formule)");
  }
});

test("napake v zapisu so razumljive; brez opisa risbe ni", () => {
  assert.throws(() => renderDrawing("premica", "od: 0\ndo: 5"), /opis/);
  assert.throws(() => renderDrawing("premica", `${OPIS}\nod: 0\ndo: 5\ntočka: 7`), /zunaj območja/);
  assert.throws(() => renderDrawing("krog", OPIS), /neznana vrsta/);
  assert.throws(() => renderDrawing("graf", `${OPIS}\nx: 0 .. 1\ny: 0 .. 1\nbarva: modra`), /neznan ključ/);
  assert.deepEqual(drawingErrors(blok("premica", `${OPIS}\nod: 0\ndo: 5`)), []);
  assert.equal(drawingErrors(blok("premica", "od: 0\ndo: 5")).length, 1);
  assert.ok(DRAW_KINDS.includes("skica"));
});

test("v lekciji: aplikacija in tisk dobita SVG, inštruktor in branje opis; Markdown risbe ne pokvari", () => {
  const md = `Besedilo pred sliko.\n\n${blok("premica", `${OPIS}\nod: -6\ndo: 3`)}\n\nBesedilo za sliko.`;
  assert.match(expandFormulaBlocks(md, "html"), /<figure class="risba"><svg class="rs"/);
  assert.equal(expandFormulaBlocks(md, "plain"), "Besedilo pred sliko.\n\n[Slika: Številska premica od −6 do 3 z enakimi koraki.]\n\nBesedilo za sliko.");
  const print = renderMd(md);
  assert.match(print, /<p>Besedilo pred sliko\.<\/p>\s*<figure class="risba"><svg[^]*<\/svg><\/figure>\s*<p>Besedilo za sliko\.<\/p>/);
  assert.equal(expandDrawings(blok("premica", "opis: Premica z napako v zapisu, ki se ne izriše.\nod: 3\ndo: 1")), '<p class="risba-opis">Premica z napako v zapisu, ki se ne izriše.</p>');
});

test("vse risbe v lekcijah se izrišejo in preverjevalnik jih sprejme", () => {
  const root = path.join(import.meta.dirname, "..", "content", "lessons");
  let n = 0;
  for (const f of fs.readdirSync(root, { recursive: true })) {
    if (!String(f).endsWith(".md") || String(f) === "README.md") continue;
    const src = fs.readFileSync(path.join(root, String(f)), "utf8");
    if (!/^:::risba/m.test(src)) continue;
    assert.deepEqual(drawingErrors(src), [], String(f));
    assert.ok(parseLesson(src).sections.length > 0);
    assert.ok(!checkLessonSource(src, String(f).replace(/\.md$/, "")).errors.some((e) => /risba|:::/.test(e)), String(f));
    n += src.match(/^:::risba/gm).length;
  }
  assert.ok(n >= 10, `vzorec ima vsaj 10 risb (${n})`);
});
