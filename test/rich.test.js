import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { marked } from "marked";
import katex from "katex";
import { createRenderer, streamSafe, fixTables, isTableSeparator, centerNumberColumns, subHeadings } from "../public/rich.js";
import { nextChunk } from "../public/pace.js";
import { annotateTex } from "../public/formula-data.js";

const { renderRich } = createRenderer({ marked, katex, sanitize: (h) => h });

test("a numbered bold start of a paragraph becomes its own sub-heading; other bold text stays", () => {
  assert.equal(subHeadings("<p><strong>1. Imaginarna enota.</strong> Vpeljemo $i$.</p>"), '<h3 class="sub-head">1. Imaginarna enota</h3><p>Vpeljemo $i$.</p>');
  assert.equal(subHeadings("<p><strong>2. Konjugirano število</strong></p>"), '<h3 class="sub-head">2. Konjugirano število</h3>');
  assert.equal(subHeadings("<p><strong>Opomba.</strong> Besedilo.</p>"), "<p><strong>Opomba.</strong> Besedilo.</p>");
  assert.match(renderRich("**3. Absolutna vrednost.** Razdalja od $0$."), /^<h3 class="sub-head">3\. Absolutna vrednost<\/h3><p>Razdalja od /);
});

// Odgovor iz posnetka zaslona (j, 2026-10-29): tabela takoj pod besedilom, ulomki v celicah.
const REPLY = [
  "Gremo počasi s tabelo. Vsak člen zapišemo kot $2$, deljeno z neko potenco števila $2$:",
  "| $n$ | $a_n$ | zapis | eksponent |",
  "|---|---|---|---|",
  "| 1 | 2 | $\\frac{2}{1} = \\frac{2}{2^0}$ | 0 |",
  "| 2 | 1 | $\\frac{2}{2} = \\frac{2}{2^1}$ | 1 |",
  "| 3 | 0,5 | $\\frac{2}{4} = \\frac{2}{2^2}$ | 2 |",
  "| 4 | 0,25 | $\\frac{2}{8} = \\frac{2}{2^3}$ | 3 |",
  "Pri $a_1$ še nismo delili, zato je eksponent $0$.",
].join("\n");

const count = (s, re) => (s.match(re) || []).length;

test("tabela iz odgovora inštruktorja je prava tabela z razredom md-table", () => {
  const html = renderRich(REPLY);
  // Tabela s 3+ stolpci ima imena stolpcev v celicah (zložljiva na telefonu, public/vodoravna-tabela.js).
  assert.match(html, /<div class="md-table-wrap"><table class="md-table md-stolpci">/);
  assert.equal(count(html, /<th[ >]/g), 4);
  assert.equal(count(html, /<td[ >]/g), 16);
  assert.ok(!html.includes("|"), "v izrisu ni ostala nobena navpična črta");
  assert.ok(!html.includes("@@MATH"), "vse formule so izrisane");
  // Ulomki v celicah v polni velikosti, besedilo za tabelo je svoj odstavek.
  assert.match(html, /\\displaystyle \\frac\{2\}\{1\}/);
  assert.match(html, /<p>Pri <span class="katex">/);
});

test("stolpci s števili in formulami so na sredini, besedilni levo", () => {
  const html = renderRich("| ime | $x$ | delež |\n|---|---|---|\n| Ana | $\\frac{1}{2}$ | 50 % |\n| Bor | $2$ | 12,5 % |");
  const head = html.match(/<thead>[\s\S]*?<\/thead>/)[0];
  assert.match(head, /<th>ime<\/th>/);
  assert.equal(count(head, /align="center"/g), 2);
  assert.match(html, /<td data-label="ime">Ana<\/td>/);
  // Poravnava, ki jo zapiše avtor, ostane.
  const own = renderRich("| a | b |\n|:--|--:|\n| 1 | 2 |");
  assert.match(own, /<td align="left">1<\/td>/);
  assert.match(own, /<td align="right">2<\/td>/);
  assert.equal(centerNumberColumns("<p>brez tabele</p>"), "<p>brez tabele</p>");
});

test("absolutna vrednost |x| v formuli ne razdeli celice", () => {
  const html = renderRich("| $x$ | $|x|$ |\n|---|---|\n| $-3$ | $|-3| = 3$ |");
  assert.equal(count(html, /<td[ >]/g), 2);
});

test("popravi tabele, ki jih model zapiše malo po svoje", () => {
  // brez zunanjih črt, krajše ločilo, manjkajoča celica, tabela v citatu (Zapomni si)
  const loose = renderRich("Tabela:\nx | y\n---|---\n1 | 2\n3 |\nKonec.");
  assert.match(loose, /<table class="md-table">/);
  assert.equal(count(loose, /<td[ >]/g), 4);
  assert.match(loose, /<p>Konec.<\/p>/);
  const short = renderRich("| a | b | c |\n|---|---|\n| 1 | 2 | 3 |");
  assert.equal(count(short, /<th[ >]/g), 3);
  const quoted = renderRich("> 📌 **Zapomni si:**\n> | a | b |\n> |---|---|\n> | 1 | 2 |");
  assert.match(quoted, /<blockquote>[\s\S]*<table class="md-table">[\s\S]*<\/blockquote>/);
  const inList = renderRich("- prvi korak\n| a | b |\n|---|---|\n| 1 | 2 |");
  assert.match(inList, /<\/ul>\s*<div class="md-table-wrap">/);
  // Navadno besedilo in vodoravna črta ostaneta, kot sta.
  assert.equal(fixTables("Besedilo\n\n---\n\nnaprej"), "Besedilo\n\n---\n\nnaprej");
  assert.ok(isTableSeparator("|:-:|---|") && !isTableSeparator("| 1 | 2 |"));
});

test("med izpisovanjem se ne vidi napol napisana vrstica tabele ali formula", () => {
  // glava brez ločila še ni tabela: skrita
  assert.equal(streamSafe("Tabela:\n| $n$ | $a_n$ |"), "Tabela:");
  assert.equal(streamSafe("Tabela:\n| $n$ | $a_n$ |\n|---|--"), "Tabela:");
  // glava + ločilo: tabela je vidna, nedokončana vrstica pa ne
  const s = streamSafe("Tabela:\n| n | a |\n|---|---|\n| 1 | 2 |\n| 2 | $\\frac{2");
  assert.equal(s, "Tabela:\n| n | a |\n|---|---|\n| 1 | 2 |");
  assert.match(renderRich(s), /<table class="md-table">/);
  // nezaprta formula in zvezdice
  assert.equal(streamSafe("Velja $a^2 +"), "Velja ");
  assert.equal(streamSafe("To je **pomembno"), "To je **pomembno**");
  assert.equal(streamSafe("Produkt $a*b$ in *poudarek"), "Produkt $a*b$ in *poudarek*");
  assert.equal(streamSafe(REPLY), REPLY);
});

test("tempo izpisa pokaže tabelo po celih vrsticah, glavo skupaj z ločilom", () => {
  const parts = [];
  for (let pos = 0; ; ) {
    const c = nextChunk(REPLY, pos, true);
    if (!c) break;
    parts.push(REPLY.slice(pos, c.end));
    pos = c.end;
  }
  const rows = parts.filter((p) => p.includes("|"));
  assert.equal(rows.length, 5);
  assert.equal(rows[0].trim(), "| $n$ | $a_n$ | zapis | eksponent |\n|---|---|---|---|");
  assert.ok(rows.slice(1).every((r) => /^\n\| \d .*\|$/.test(r)));
  // vsak vmesni izris je pravilna tabela (nikoli surove črte)
  let shown = "";
  for (const p of parts) {
    shown += p;
    assert.ok(!renderRich(streamSafe(shown)).includes("|"), `surova črta pri: ${JSON.stringify(shown.slice(-40))}`);
  }
  // med pretakanjem glava počaka na ločilo
  assert.equal(nextChunk("A\n| n | a |\n", 2, false), null);
});

test("videz tabel je skupen v vsej aplikaciji (style.css), tudi v temnem načinu", () => {
  const css = fs.readFileSync(new URL("../public/style.css", import.meta.url), "utf8");
  for (const cls of [".md-table", ".table", ".demo-table", ".pse-tab", ".doc table"]) assert.ok(css.includes(cls), cls);
  assert.match(css, /\.md-table-wrap \{[^}]*overflow-x: auto/);
  // samo barvne spremenljivke (temni način jih zamenja), nobene fiksne barve
  const block = css.slice(css.indexOf("tabele: en videz"), css.indexOf(".table td.bad"));
  assert.ok(!/#[0-9a-f]{3,6}\b/i.test(block), "brez fiksnih barv");
  for (const f of ["ui.css", "textbook.css", "feedback.css", "graph.css"]) {
    const other = fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");
    assert.ok(!/table:not\(\.demo-table\)|\.fm-scroll table|\.fb-summary th/.test(other), `${f} nima svojega videza tabel`);
  }
});

test("stolpec z dolgim besedilom se sme prelomiti, formule ne", () => {
  const html = renderRich("| Korak | Kaj naredimo | Rezultat |\n|---|---|---|\n| 1 | Odpravimo ulomke: vse pomnožimo s $4$ (skupni imenovalec) | $2x + 12 = x + 20$ |");
  assert.match(html, /<th class="wrap">Kaj naredimo<\/th>/);
  assert.match(html, /<td align="center" data-label="Korak">1<\/td>/);
  assert.equal(count(html, /class="wrap"/g), 2);
});

test("podčrtan naslov in vodoravna črta nista tabela", () => {
  assert.doesNotMatch(renderRich("a | b\n---\n\nnaprej"), /<table/);
  assert.match(renderRich("Besedilo\n\n---\n\nnaprej"), /<hr>/);
});

// j, 2026-10-30: »naj bo vsaka formula in izrek v svojem okencu v tabeli«.
test("dvostolpčna tabela formul: vsaka formula v svoji vrstici, ime samo v prvi", () => {
  const md = [
    "| | |",
    "|---|---|",
    "| Pravila | $\\log_a (x y) = \\log_a x + \\log_a y$, $\\; \\log_a x^n = n \\log_a x$ |",
    "| Ekstrem | $f'(x_0) = 0$; maksimum, če $f''(x_0) < 0$, minimum, če $f''(x_0) > 0$ |",
    "| Definicija | $\\log_a x = y \\iff a^y = x$ ($a > 0$, $a \\ne 1$, $x > 0$) |",
    "| Elektroni | največ $2$, $8$, $8$ |",
    "| Trikotnik | kot ob $B$, del kotov ob $A$ in $C$ |",
  ].join("\n");
  const html = renderRich(md);
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => m[1]);
  assert.equal(rows.length, 1 + 2 + 3 + 1 + 1 + 1, "glava + 2 pravili + 3 dele ekstrema + po ena vrstica");
  assert.match(rows[1], /<td>Pravila<\/td>/);
  assert.match(rows[2], /^\s*<td><\/td>/, "druga formula ima prazno ime");
  assert.match(rows[4], /maksimum, če/);
  assert.ok(!/\\displaystyle \\;/.test(html), "presledek pred ločeno formulo je odstranjen");
  assert.ok(!/\\displaystyle ;/.test(html), "ločilo ni ostalo v formuli");
  assert.match(rows[6], /Definicija[\s\S]*a \\ne 1/, "pogoji v oklepaju ostanejo pri formuli");
  assert.match(rows[7], /največ[\s\S]*<annotation encoding="application\/x-tex">\\displaystyle 8<\/annotation>/, "seznam števil ostane skupaj");
  assert.match(html, /kot ob <span class="katex">[\s\S]*?del kotov/, "stavek z enim simbolom se ne razdeli");
});

test("tabela, v kateri je tudi prvi stolpec seznam, ostane cela", () => {
  const md = "| kisline | baze |\n|---|---|\n| $\\mathrm{HCl}$ klorovodikova, $\\mathrm{HNO_3}$ dušikova | $\\mathrm{NaOH}$ natrijev hidroksid, $\\mathrm{KOH}$ kalijev hidroksid |";
  assert.equal(count(renderRich(md), /<tr>/g), 2);
});

test("klikljive formule: \\log_a, \\vec F, \\frac1e se izrišejo brez rdeče napake", () => {
  const annotate = (tex) => annotateTex(tex, "MAT");
  const r = createRenderer({ marked, katex, sanitize: (h) => h, annotate });
  for (const tex of ["\\log_a x^n = n \\log_a x", "\\ln x = \\log_e x", "\\vec F = m \\vec a", "\\bar v \\cdot t", "\\frac1e", "\\int_a^b f(x)\\,dx"]) {
    const html = r.renderMath(tex, false);
    assert.doesNotMatch(html, /katex-error/, tex);
    if (/log_a/.test(tex)) assert.match(html, /data-fx=/, "simbol ostane klikljiv");
  }
});

test("formula sheet: a clause after a comma (ko, če, npr.) stays with its formula", () => {
  const md = "| | |\n|---|---|\n| Rang | $A x = b$ je rešljiv natanko tedaj, ko $r(A) = r(A|b)$ |\n| Nevtralizacija | kislina $+$ baza → sol, npr. $\\mathrm{HCl + NaOH \\rightarrow NaCl + H_2O}$ |";
  assert.equal(count(renderRich(md), /<tr>/g), 3);
});

test("oštevilčen podnaslov postane naslov, stavek z odebeljenim začetkom ostane cel", () => {
  assert.equal(
    subHeadings("<p><strong>1. Imaginarna enota.</strong> Vpeljemo število.</p>"),
    '<h3 class="sub-head">1. Imaginarna enota</h3><p>Vpeljemo število.</p>',
  );
  assert.equal(subHeadings("<p><strong>2. Postopek:</strong></p>"), '<h3 class="sub-head">2. Postopek</h3>');
  const sentence = "<p><strong>3. Seštevanje</strong> dveh števil je preprosto.</p>";
  assert.equal(subHeadings(sentence), sentence);
});

test("ločilo takoj za vrstično formulo ostane z njo (kartica »Zapomni si«: pika se ne prelomi sama v novo vrstico)", () => {
  const html = renderRich("> 📌 **Zapomni si:** rešitev je $x = \\frac{1}{2}$.\n\nOdgovor je $a$, potem $b$ in še $c$!");
  assert.ok(html.includes("</span>.</span>"), "pika je v ovoju z zadnjo formulo");
  assert.equal((html.match(/class="fx-nb"/g) || []).length, 3, "tudi vejica in klicaj");
  // formula sredi stavka, brez ločila, ostane brez ovoja; formula v display načinu tudi
  assert.ok(!renderRich("Vrednost $x$ je pozitivna").includes("fx-nb"));
  assert.ok(!renderRich("$$x^2$$.").includes("fx-nb"));
});
