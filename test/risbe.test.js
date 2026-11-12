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
  assert.equal(expandDrawings(blok("premica", "opis: Premica z napako v zapisu, ki se ne izriše.\nod: 3\ndo: 1")), '\n\n<p class="risba-opis">Premica z napako v zapisu, ki se ne izriše.</p>\n\n');
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

// Pregled PR #559: popravki 2–9 in manjkajoči testi.
test("prazni vrstici: odstavek tik pod »:::« ostane odstavek (aplikacija in tisk)", () => {
  const md = `Pred sliko.\n${blok("premica", `${OPIS}\nod: 0\ndo: 2`)}\nZa sliko **krepko**.`;
  const html = renderMd(md);
  assert.match(html, /<\/figure>\s*<p>Za sliko <strong>krepko<\/strong>\.<\/p>/);
  assert.match(html, /<p>Pred sliko\.<\/p>\s*<figure/);
  assert.equal(expandFormulaBlocks(md, "plain"), "Pred sliko.\n[Slika: Številska premica od −6 do 3 z enakimi koraki.]\nZa sliko **krepko**.");
});

test("indeksi in eksponenti z več znaki in predznakom; več črk brez oklepajev je napaka", () => {
  const tsp = (s) => [...renderDrawing("skica", `${OPIS}\nobmočje: 0; 0 .. 4; 2\nnapis: 2; 1 | ${s}`).html.matchAll(/<tspan class="rs-i"[^>]*>([^<]*)<\/tspan>/g)].map((m) => m[1]);
  assert.deepEqual(tsp("10^-3 m"), ["−3"]);
  assert.deepEqual(tsp("x^10"), ["10"]);
  assert.deepEqual(tsp("a_12 + a_1"), ["12", "1"]);
  assert.deepEqual(tsp("U_{Th} in F_r"), ["Th", "r"]);
  assert.throws(() => tsp("U_Th"), /_\{Th\}/);
  assert.throws(() => tsp("e^ix"), /zavitih oklepajih/);
});

test("liki zunaj območja (skica, graf) so napaka v check-lesson; robovi so dovoljeni", () => {
  const sk = (l) => renderDrawing("skica", `${OPIS}\nobmočje: 0; 0 .. 4; 3\n${l}`);
  assert.throws(() => sk("točka: 100; 1"), /zunaj območja/);
  assert.throws(() => sk("črta: 0; 0 -> 4; 3,5"), /zunaj območja/);
  assert.throws(() => sk("krog: 3,5; 1 | 1"), /polmerom/);
  assert.throws(() => sk("pravokotnik: 0; 0 .. 5; 1"), /zunaj območja/);
  assert.throws(() => sk("napis: -1; 1 | A"), /zunaj območja/);
  assert.doesNotThrow(() => sk("črta: 0; 0 -> 4; 3\nkrog: 2; 1,5 | 1,5\npravikot: 4; 0 | 0; 0 | 4; 3"));
  assert.throws(() => renderDrawing("graf", `${OPIS}\nx: -2 .. 2\ny: 0 .. 4\ntočka: 3; 1 | T`), /zunaj območja/);
  const src = blok("skica", `${OPIS}\nobmočje: 0; 0 .. 4; 3\ntočka: 100; 1`);
  assert.ok(checkLessonSource(src, "x").errors.some((e) => /risba »skica«.*zunaj območja/.test(e)));
});

test("meja zank: drobni korak ali enota je napaka, ne obesi izrisa", () => {
  const t0 = Date.now();
  assert.throws(() => renderDrawing("stolpci", `${OPIS}\nstolpec: a | 9\nstolpec: b | 2\nkorak: 0,000001`), /največ 20/);
  assert.throws(() => renderDrawing("skica", `${OPIS}\nobmočje: 0; 0 .. 30000; 1\nenota: 0,01\nmreža: da`), /več kot 60 črt/);
  assert.throws(() => renderDrawing("premica", `${OPIS}\nod: 0\ndo: 5\noznake: 0`), /oznake/);
  assert.throws(() => renderDrawing("premica", `${OPIS}\nod: 0\ndo: 5\nkorak: 0,000001`), /60/);
  assert.ok(Date.now() - t0 < 1000);
});

test("brez risbe.css: svg ima fill=none, polni liki in napisi barvo besedila", () => {
  const { html } = renderDrawing("graf", "opis: Graf kvadratne funkcije s točko.\nx: -2 .. 2\ny: -1 .. 4\nf: x^2\ntočka: 1; 1 | T");
  assert.match(html, /<svg class="rs" fill="none" stroke="currentColor"/);
  assert.ok([...html.matchAll(/<text\b[^>]*>/g)].every((m) => /fill="currentColor" stroke="none"/.test(m[0])));
  assert.ok([...html.matchAll(/<[a-z]+ [^>]*class="rs-f[^>]*>/g)].every((m) => /fill="currentColor"/.test(m[0])));
  assert.match(html, /class="rs-g" stroke-opacity="0.14"/);
  const css = fs.readFileSync(path.join(import.meta.dirname, "..", "public", "risbe.css"), "utf8");
  assert.doesNotMatch(css, /system-ui|sans-serif|font:/, "napisi podedujejo pisavo lekcije (PDF pregled pisav)");
});

test("opis: brez opisa ni praznega odstavka in check-lesson javi napako; _ in ^ v opisu sta napaka", () => {
  assert.equal(expandDrawings(blok("premica", "od: 0\ndo: 5")), "");
  assert.equal(expandDrawings(blok("premica", "od: 0\ndo: 5"), "plain"), "");
  assert.ok(checkLessonSource(`Uvod.\n\n${blok("premica", "od: 0\ndo: 5")}\n`, "x").errors.some((e) => /risba »premica«.*opis/.test(e)));
  assert.throws(() => renderDrawing("premica", "opis: Premica s točko x_1 na sredini dolžine.\nod: 0\ndo: 5"), /Unicode/);
  assert.throws(() => renderDrawing("premica", "opis: Premica z dolžino 10^3 metrov na vsako stran.\nod: 0\ndo: 5"), /Unicode/);
});

test("iskanje in branje na glas uporabljata opis, ne surovega bloka", async () => {
  const { speakMarkdown } = await import("../server/govor.js");
  const md = `Uvod.\n\n${blok("skica", "opis: Krog s središčem na sredini risbe.\nobmočje: 0; 0 .. 4; 3\nkrog: 2; 1,5 | 1 | modra")}\n\nKonec.`;
  const said = speakMarkdown(md);
  assert.match(said, /Krog s središčem na sredini risbe\./);
  assert.doesNotMatch(said, /območje|modra|risba/);
  const src = fs.readFileSync(path.join(import.meta.dirname, "..", "server", "textbook.js"), "utf8");
  assert.ok((src.match(/expandDrawings\(s\.md, "plain"\)/g) || []).length >= 2, "iskanje in odlomek gresta skozi opis");
  const govor = fs.readFileSync(path.join(import.meta.dirname, "..", "server", "govor.js"), "utf8");
  assert.match(govor, /import \{ DRAW_RE/);
});

test("check-lesson: vrstice risbe ne štejejo med besede lekcije", () => {
  const besedilo = Array.from({ length: 100 }, (_, i) => `beseda${i}`).join(" ");
  const tocke = Array.from({ length: 300 }, (_, i) => `točka: ${(i / 100).toFixed(2).replace(".", ",")} | t ${i} | modra`).join("\n");
  const src = `${besedilo}\n\n${blok("premica", `${OPIS}\nod: 0\ndo: 3\n${tocke}`)}\n\nKonec.\n`;
  const m = checkLessonSource(src, "x").warnings.join(" | ").match(/kratka \((\d+) besed/);
  assert.ok(m && +m[1] < 120, `štetje besed: ${m?.[1]}`);
});

// ---------- graf z drsniki (»drsnik:«, j, 11. 11. 2026) ----------
const ZIVA = [
  "opis: Premica y = kx + n. Izbrano je k = {k} in n = {n}, torej y = {k}x {+n}.",
  "x: -6 .. 6",
  "y: -6 .. 6",
  "enako: da",
  "drsnik: k | -3 .. 3 | 0,5 | 1 | smerni koeficient k",
  "drsnik: n | -3 .. 3 | 1 | 2 | začetna vrednost n",
  "f: k*x + n",
  "črta: 0; n -> 1; n -> 1; k + n | oranžna črtkano",
  "točka: 0; n | (0, {n}) | levo | oranžna",
  "točka: -n/k; 0 | x_0 = {-n/k} | nad",
  "podnapis: k = {k}, y = {k}x {+n}",
].join("\n");
// viewBox pri x, y od −6 do 6 z enako enoto: 258 enot za 12, izhodišče (169, 149)
const ZX = (v) => 40 + ((v + 6) / 12) * 258;
const ZY = (v) => 20 + 258 - ((v + 6) / 12) * 258;
const krivulja = (html) => [.../<path class="rs-l a rs-b" d="([^"]+)"/.exec(html)[1].matchAll(/[ML]?(-?[\d.]+),(-?[\d.]+)/g)].map((m) => [+m[1], +m[2]]);

test("drsnik: strežnik izriše graf pri začetnih vrednostih in doda telo bloka za brskalnik", () => {
  const r = renderDrawing("graf", ZIVA);
  assert.deepEqual(r.drsniki, [
    { name: "k", lo: -3, hi: 3, step: 0.5, start: 1, label: "smerni koeficient k", value: 1 },
    { name: "n", lo: -3, hi: 3, step: 1, start: 2, label: "začetna vrednost n", value: 2 },
  ]);
  const pts = krivulja(r.html);
  const near = (x, y) => pts.some((p) => Math.abs(p[0] - ZX(x)) < 0.8 && Math.abs(p[1] - ZY(y)) < 0.8);
  assert.ok(near(0, 2) && near(2, 4) && near(-3, -1), "premica y = x + 2");
  assert.match(r.html, /<circle class="rs-f b"[^>]* cx="169" cy="106"/, "točka (0, 2)");
  assert.match(r.html, />\(0, 2\)<\/text>/);
  assert.match(r.html, /<polyline class="rs-l b rs-d" points="169,106 190\.5,106 190\.5,84\.5"\/>/, "stopnica 1 desno, k gor");
  assert.match(r.html, /<figcaption>k = 1, y = 1x \+ 2<\/figcaption>/);
  assert.equal(r.opis, "Premica y = kx + n. Izbrano je k = 1 in n = 2, torej y = 1x + 2.");
  assert.match(r.html, /aria-label="Premica y = kx \+ n\. Izbrano je k = 1 in n = 2/);
  // Telo bloka potuje v atributu: ena vrstica, brez znakov, ki jih Markdown ali HTML razumeta po svoje.
  const data = /<figure class="risba risba-ziva" data-risba="([^"]+)">/.exec(r.html)[1];
  assert.match(data, /^[A-Za-z0-9%.-]+$/);
  assert.equal(decodeURIComponent(data), ZIVA);
  assert.doesNotMatch(r.html, /[\n|$]/);
  // Graf brez drsnikov ostane, kot je bil: brez podatkov in zaviti oklepaji so navadno besedilo.
  const navaden = renderDrawing("graf", "opis: Graf kvadratne funkcije s temenom v izhodišču.\nx: -2 .. 2\ny: -1 .. 4\nf: x^2\nnapis: 0; 3 | {k} | sredina");
  assert.deepEqual(Object.keys(navaden), ["html", "opis"]);
  assert.doesNotMatch(navaden.html, /risba-ziva|data-risba/);
  assert.match(navaden.html, />\{k\}<\/text>/);
});

test("drsnik: izris pri drugih vrednostih (kot v brskalniku) je matematično točen", () => {
  const r = renderDrawing("graf", ZIVA, { vrednosti: { k: -0.5, n: -1 }, popustljivo: true });
  const pts = krivulja(`<path class="rs-l a rs-b" d="${/<path class="rs-l a rs-b" d="([^"]+)"/.exec(r.svg)[1]}"`);
  const near = (x, y) => pts.some((p) => Math.abs(p[0] - ZX(x)) < 0.8 && Math.abs(p[1] - ZY(y)) < 0.8);
  assert.ok(near(0, -1) && near(4, -3) && near(-6, 2), "premica y = −0,5x − 1");
  assert.equal(r.podnapis, "k = −0,5, y = −0,5x − 1");
  assert.match(r.svg, /^<title>Premica y = kx \+ n\. Izbrano je k = −0,5 in n = −1, torej y = −0,5x − 1\.<\/title>/);
  assert.match(r.svg, /cx="126" cy="149"/, "ničla −n/k = −2 na osi x");
  assert.match(r.svg, /<tspan dy="-4"> = −2<\/tspan>/);
  // Vrednost zunaj območja ali med korakoma se popravi na najbližjo dovoljeno; neveljavna pomeni začetno.
  const v = (vrednosti) => renderDrawing("graf", ZIVA, { vrednosti, popustljivo: true }).drsniki.map((d) => d.value);
  assert.deepEqual(v({ k: 99, n: -99 }), [3, -3]);
  assert.deepEqual(v({ k: 0.74, n: 1.4 }), [0.5, 1]);
  assert.deepEqual(v({ k: "abc", n: null }), [1, 2]);
  // Pri k = 0 ničle ni (deljenje z 0): točke ni na sliki, izraz v besedilu se izpiše kot »/«, slika se vseeno izriše.
  const nic = renderDrawing("graf", ZIVA, { vrednosti: { k: 0, n: 3 }, popustljivo: true });
  assert.equal((nic.svg.match(/<circle /g) || []).length, 1);
  assert.equal(renderDrawing("graf", ZIVA.replace("podnapis: k = {k}, y = {k}x {+n}", "podnapis: Ničla je {-n/k}."), { vrednosti: { k: 0 }, popustljivo: true }).podnapis, "Ničla je /.");
  // Lik, ki ga drsnik premakne iz območja risbe, se izpusti (stopnica pri k + n = 6 še ostane, točka (−n/k; 0) ne vedno).
  const rob = renderDrawing("graf", ZIVA, { vrednosti: { k: 3, n: 3 }, popustljivo: true });
  assert.match(rob.svg, /<polyline class="rs-l b rs-d"/);
  const zunaj = renderDrawing("graf", ZIVA.replace("y: -6 .. 6", "y: -6 .. 5"), { vrednosti: { k: 3, n: 3 }, popustljivo: true });
  assert.doesNotMatch(zunaj.svg, /<polyline class="rs-l b rs-d"/);
  assert.match(zunaj.svg, /<path class="rs-l a rs-b"/);
  // Krivulja, ki je pri neki vrednosti vsa zunaj risbe, ni napaka.
  const visoko = "opis: Vodoravna premica y = c, ki jo premikaš gor in dol.\nx: 0 .. 4\ny: 0 .. 4\ndrsnik: c | 0 .. 8 | 1 | 2 | višina c\nf: c";
  assert.doesNotMatch(renderDrawing("graf", visoko, { vrednosti: { c: 8 }, popustljivo: true }).svg, /<path /);
  assert.deepEqual(drawingErrors(blok("graf", visoko)), []);
});

test("drsnik: tisk, PDF in besedilo dobijo začetne vrednosti; podatki za brskalnik samo v aplikaciji", async () => {
  const md = `Uvod.\n\n${blok("graf", ZIVA)}\nPod sliko.`;
  const app = expandFormulaBlocks(md, "html");
  assert.match(app, /<figure class="risba risba-ziva" data-risba="/);
  assert.match(app, /\n\nPod sliko\./);
  const tisk = renderMd(md);
  assert.match(tisk, /<figure class="risba"><svg/);
  assert.doesNotMatch(tisk, /data-risba|risba-ziva|drsnik/);
  assert.match(tisk, /<figcaption>k = 1, y = 1x \+ 2<\/figcaption>/);
  assert.equal(expandDrawings(md, "plain"), "Uvod.\n\n[Slika: Premica y = kx + n. Izbrano je k = 1 in n = 2, torej y = 1x + 2.]\nPod sliko.");
  const { speakMarkdown } = await import("../server/govor.js");
  const said = speakMarkdown(md);
  assert.match(said, /Izbrano je k = 1 in n = 2/);
  assert.doesNotMatch(said, /[{}]|drsnik/);
});

test("drsnik: check-lesson preveri območje, korak, začetno vrednost, imena in število drsnikov", () => {
  const z = (drsniki, f = "f: k*x") => drawingErrors(blok("graf", `opis: Premica skozi izhodišče z naklonom k.\nx: -4 .. 4\ny: -4 .. 4\n${drsniki}\n${f}`));
  assert.deepEqual(z("drsnik: k | -2 .. 2 | 0,5 | 1 | naklon k"), []);
  assert.deepEqual(z("drsnik: k | −2 .. 2 | 0,25 | −0,75"), [], "pravi minus, napis ni obvezen");
  assert.match(z("drsnik: k | 2 .. -2 | 0,5 | 1")[0], /»do« mora biti večji od »od«/);
  assert.match(z("drsnik: k | -2 .. 2 | 0,3 | 1")[0], /korak mora razdeliti območje/);
  assert.match(z("drsnik: k | -2 .. 2 | 0 | 1")[0], /korak mora razdeliti območje/);
  assert.match(z("drsnik: k | -2 .. 2 | 0,001 | 1")[0], /največ 200 enakih delov/);
  assert.match(z("drsnik: k | -2 .. 2 | 0,5 | 3")[0], /začetna vrednost 3 mora biti med −2 in 2/);
  assert.match(z("drsnik: k | -2 .. 2 | 0,5 | 0,3")[0], /na koraku 0,5/);
  assert.match(z("drsnik: k | -2 .. 2 | 0,5")[0], /pričakujem »ime \| od \.\. do \| korak \| začetna \| napis«/);
  assert.match(z("drsnik: k | -2 do 2 | 0,5 | 1")[0], /pričakujem »od \.\. do«/);
  for (const ime of ["x", "y", "e", "kk", "2", "k_1"]) assert.match(z(`drsnik: ${ime} | -2 .. 2 | 0,5 | 1`)[0], /ime »[^»]+« ni dovoljeno/, ime);
  assert.match(z("drsnik: k | -2 .. 2 | 1 | 1\ndrsnik: k | 0 .. 2 | 1 | 1")[0], /samo enkrat/);
  assert.match(z("drsnik: k | -2 .. 2 | 1 | 1\ndrsnik: n | -2 .. 2 | 1 | 0")[0], /drsnik »n« se v risbi ne uporablja/);
  assert.match(z("drsnik: k | -2 .. 2 | 1 | 1", "f: k*x + n")[0], /neznana spremenljivka »n« \(drsniki: k\)/);
  assert.match(z("drsnik: k | -2 .. 2 | 1 | 1", "f: k*x\ntočka: 1; b | T")[0], /neznana spremenljivka »b«/);
  assert.match(z("drsnik: k | -2 .. 2 | 1 | 1", "f: k*x\nnapis: 0; 3 | k = {q}")[0], /neznana spremenljivka »q«/);
  assert.match(z("drsnik: k | -2 .. 2 | 1 | 1 | naklon k_1")[0], /napis bere bralnik zaslona/);
  const stirje = ["a", "b", "c", "d"].map((i) => `drsnik: ${i} | 0 .. 2 | 1 | 1`).join("\n");
  assert.match(z(stirje, "f: a*x^3 + b*x^2 + c*x + d")[0], /največ 3 drsnike/);
  assert.deepEqual(z(stirje.split("\n").slice(0, 3).join("\n"), "f: a*x^2 + b*x + c"), []);
  // Pri začetnih vrednostih mora biti vse na sliki in določeno (to vidita tisk in PDF).
  assert.match(z("drsnik: k | -2 .. 2 | 1 | 2", "f: k*x\ntočka: 3; 3*k | T")[0], /zunaj območja risbe/);
  assert.match(z("drsnik: k | -2 .. 2 | 1 | 0", "f: k*x\ntočka: 1/k; 1 | T")[0], /pri teh vrednostih drsnikov ni število/);
  assert.deepEqual(z("drsnik: k | -2 .. 2 | 1 | 1", "f: k*x\ntočka: 1/k; 1 | T"), [], "drugje se točka samo skrije");
  // Drsnik je samo v grafu.
  assert.match(drawingErrors(blok("skica", "opis: Krog s polmerom, ki ga določa drsnik.\nobmočje: 0; 0 .. 4; 4\ndrsnik: r | 1 .. 2 | 1 | 1\nkrog: 2; 2 | r"))[0], /neznan ključ »drsnik«/);
  // Polmer kroga in napisi puščic poznajo drsnike.
  assert.deepEqual(drawingErrors(blok("graf", "opis: Krožnica s središčem v izhodišču in polmerom r.\nx: -4 .. 4\ny: -4 .. 4\nenako: da\ndrsnik: r | 1 .. 4 | 0,5 | 2 | polmer r\nkrog: 0; 0 | r\npuščica: 0; 0 -> r; 0 | r = {r} | nad")), []);
});

test("drsnik: brskalnik in strežnik uporabljata isto kodo izrisa", async () => {
  const skupna = await import("../public/risbe-izris.js");
  assert.equal(skupna.renderDrawing, renderDrawing);
  const koda = (f) => fs.readFileSync(path.join(import.meta.dirname, "..", f), "utf8");
  assert.match(koda("public/risbe-zive.js"), /import \{[^}]*renderDrawing[^}]*\} from "\.\/risbe-izris\.js"/);
  assert.doesNotMatch(koda("public/risbe-izris.js"), /\b(document|window|require|process)\b|from "node:|from "\.\.\//, "izris teče v brskalniku: brez DOM, Node in datotek zunaj public/");
  assert.match(koda("public/textbook.js"), /import\("\.\/risbe-zive\.js"\)/);
  // Vzorčna lekcija: graf z drsnikoma k in n.
  const lekcija = koda("content/lessons/MAT-SS-1/linearna-funkcija.md");
  assert.match(lekcija, /^drsnik: k \|/m);
  assert.match(lekcija, /^drsnik: n \|/m);
  assert.deepEqual(drawingErrors(lekcija), []);
});
