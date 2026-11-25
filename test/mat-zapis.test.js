// Vsa matematika v Evklidu je izrisana s KaTeX (j, 25. 11. 2026, N-07: »Vsi matematični zapisi v celotnem Evklidu
// morajo biti dosledno prikazani v LaTeX/KaTeX«; merilo: skripta najde neizrisano matematiko v VSEH vidnih besedilih,
// teče v CI, cilj 0 zadetkov). scripts/popis-formul.js izriše lekcije, liste s formulami, gradiva, NPZ/maturitetne
// pole, naloge vseh generatorjev, slovar oznak in besedila vmesnika po poti aplikacije in išče napake KaTeX, ukaze
// LaTeX, osamljene $, x^2 / a_n, sqrt(…), * in ASCII <= zunaj formul. Prej je to za lekcije delal test/mat-lekcije.test.js
// (z izjemo cele datoteke); zdaj velja za vse vire, z izhodiščem na ravni posameznega zadetka.
// Znani zadetki v vsebini so v test/fiksno/mat-zapis-izhodisce.json (popravke vsebine pregledajo ločeni pregledovalci).
// Seznam se samo krči: nov zadetek podre test; popravljen zadetek odstrani z
//   node scripts/popis-formul.js --odstrani-popravljene
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { popis, pregledaj, primerjaj, preberiIzhodisce, UI_VNOS } from "../scripts/popis-formul.js";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const vrste = (s, nacin) => pregledaj(s, nacin).map((z) => z.vrsta);

test("pregled: najde vsako vrsto neizrisane matematike", () => {
  // Regresija: skupni izris (public/mat/izris.js) ob napaki KaTeX pokaže okvirček ⬚; popis je prej to štel kot 0 napak.
  assert.deepEqual(vrste("Okrajšaj $\\frac{1}{$ in nadaljuj."), ["napaka"]);
  assert.deepEqual(vrste("x^{2", "tex"), ["napaka"]);
  assert.deepEqual(vrste("Velja \\frac{a}{b} = 2."), ["latex"]);
  assert.deepEqual(vrste("Zapiši $x + 1 brez konca."), ["dolar"]);
  assert.deepEqual(vrste("Izračunaj x^2 in a_n."), ["potenca", "potenca"]);
  assert.deepEqual(vrste("Koliko je sqrt(16)?"), ["koren"]);
  assert.deepEqual(vrste("Izračunaj 3*4 in 2 * x."), ["zvezdica", "zvezdica"]);
  assert.deepEqual(vrste("Velja x <= 3 in a != b."), ["primerjava", "primerjava"]);
});

test("pregled: pravilen zapis in namerno navadno besedilo nista zadetka", () => {
  for (const s of [
    "Izračunaj $x^2 + \\frac{1}{2}$ in $$\\sqrt{a_n}$$.",
    "Ploščina je \\(a \\cdot b\\), prostornina \\[V = a^3\\].",
    "Koda: `x**2 <= y_1` in\n\n```\nprint(a_b * 2)\n```",
    "Povezava https://evklid.si/naloge/a_b in datoteka moj_zapis.txt.",
    "*Poudarek* in **krepko**, opomba*.",
    "Ocena za ves mesec: {usd} $, mesečni znesek ($), cena $5.",
    "Puščici -> in => sta namerni.",
    "Kemija: $\\mathrm{CO_2}$ in H₂O.",
  ])
    assert.deepEqual(vrste(s), [], s);
  assert.deepEqual(vrste("\\frac{a}{b} \\cdot x^2", "tex"), []);
});

test("pregled: ključi kalkulatorja, ki učijo tipkanje, so namerno navadni (niso v pregledu ui)", () => {
  assert.ok(UI_VNOS("sc.ana.hint") && UI_VNOS("sc.err.propHint"));
  assert.ok(!UI_VNOS("task.hint") && !UI_VNOS("gc.reg.expe"));
});

test("vsi viri: nobenega novega zadetka, izhodišče se samo krči", { timeout: 300000 }, async () => {
  const izid = await popis();
  // Vir, ki se tiho izprazni (preimenovana mapa, spremenjen izvoz), ne sme dati lažnih »0 zadetkov«.
  const najmanj = { lekcije: 700, formule: 10, gradiva: 700, pole: 25, vaje: 600, slovar: 4, ui: 1 };
  for (const [vir, n] of Object.entries(najmanj)) assert.ok(izid.viri[vir]?.enot >= n, `${vir}: premalo enot (${izid.viri[vir]?.enot})`);
  assert.ok(izid.viri.vaje.besedil >= 30000 && izid.viri.ui.besedil >= 3000, "premalo besedil");
  const { novi, popravljeni } = primerjaj(izid);
  assert.deepEqual(
    novi.map((z) => `${z.mesto}${z.polje ? ` [${z.polje}]` : ""} ${z.vrsta}: ${z.odlomek}`),
    [],
    "Nov neizrisan matematični zapis: zapiši ga v $…$ (ali v `…`, če uči tipkanje).",
  );
  assert.deepEqual(popravljeni, [], "Zadetek je popravljen: odstrani ga z node scripts/popis-formul.js --odstrani-popravljene.");
  // Izhodišče je urejen seznam brez podvojenih ključev (ročno dodajanje se pozna v pregledu).
  const { kljuci } = preberiIzhodisce();
  assert.deepEqual(kljuci, [...new Set(kljuci)].sort());
});

// Izris v brskalniku: ista funkcija teče na vsakem zaslonu scripts/preveri-aplikacijo.cjs (CI, posel »preveri«).
const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const brskalnik = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 };

test("izris (DOM): pot rich.js da čiste formule, surov zapis in napaka izrisa se najdeta", brskalnik, async (t) => {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  t.after(async () => {
    await chromium.close();
    server.close();
  });
  const p = await chromium.newPage({ viewport: { width: 390, height: 740 } });
  await p.goto(`http://127.0.0.1:${server.address().port}/zasebnost.html`);
  await p.evaluate(async () => {
    document.body.innerHTML = '<div id="dobro"></div><div id="slabo"></div><div id="view-graph"><p>Vpiši \\frac{1}{2}</p></div>';
    for (const src of ["/vendor/katex/katex.min.js", "/vendor/marked/lib/marked.umd.js", "/vendor/dompurify/purify.min.js"])
      await new Promise((r) => { const sc = document.createElement("script"); sc.src = src; sc.onload = sc.onerror = r; document.head.append(sc); });
    const { createRenderer } = await import("/rich.js");
    const { renderRich, renderMath } = createRenderer({});
    // Kot odgovor inštruktorja, naloga, kartica in rešitev pole: vse oblike ločil, tabela, formula naloge.
    document.getElementById("dobro").innerHTML = [
      "Najprej $x^2 - 5x + 6 = 0$, nato $$x_{1,2} = \\frac{5 \\pm \\sqrt{25 - 24}}{2}$$ in \\(a_n = 2^n\\) ter \\[\\int_0^1 x\\,dx\\].",
      "| količina | vrednost |\n|---|---|\n| $v$ | $\\dfrac{s}{t}$ |",
      "Cena: {usd} $ in 5 $.",
    ].map((s) => renderRich(s)).join("") + renderMath("F = m \\cdot a", false) + "<p>Hitrejši model nad 1 $ na mesec; nad 3 $ na mesec samo Haiku.</p>";
    document.getElementById("slabo").innerHTML = renderRich("Okrajšaj $\\frac{1}{$.") + "<p>Velja \\sqrt{2} in $x^2 + 1$ ter sqrt(16).</p>";
  });
  const { neizrisanoVDom } = await import("../scripts/popis-formul.js");
  const najdbe = await p.evaluate(neizrisanoVDom);
  const opis = najdbe.map((z) => `${z.kalk ? "kalk " : ""}${z.vrsta} ${z.kje}`).sort();
  assert.deepEqual(opis, ["dolar #slabo p", "kalk latex #view-graph p", "koren #slabo p", "latex #slabo p", "napaka #slabo span.mat-napaka"].sort());
});
