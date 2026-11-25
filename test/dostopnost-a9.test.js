// Dostopnost A9: ločilo »·« in datum se ne prelomita (public/datum.js zdruzi), meni je navigacija z aria-current
// (ne tablist brez zavihkov), napisi spodnje vrstice vsaj 12 px, gumbi za dotik vsaj 40 px (preverja tudi
// scripts/preveri-aplikacijo.cjs v brskalniku, korak »tel-dostopnost«).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { NBSP, LOCILO, celDatum, zdruzi } from "../public/datum.js";

const read = (f) => fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");

test("zdruzi: nedeljiv presledek pred »·«, prazni deli izpadejo, datum cel", () => {
  assert.equal(LOCILO, " · ");
  assert.equal(zdruzi(["Osnovna šola 9. razred", "", null, "NPZ", "29. 5. 2027", undefined, "še 185 dni"]), "Osnovna šola 9. razred · NPZ · 29. 5. 2027 · še 185 dni");
  assert.equal(zdruzi([]), "");
  assert.equal(zdruzi(["samo"]), "samo");
  // »·« nikoli za navadnim presledkom (tam bi se lahko prelomil na začetek vrstice).
  assert.ok(!/ ·/.test(zdruzi(["a", "b", "c"])));
});

test("celDatum: presledki v številskem datumu so nedeljivi, besedilo ostane", () => {
  assert.equal(celDatum("29. 5. 2027"), `29.${NBSP}5.${NBSP}2027`);
  assert.equal(celDatum("čet., 30. 10."), `čet., 30.${NBSP}10.`);
  assert.equal(celDatum("8. razred"), "8. razred");
  assert.equal(celDatum("5/29/2027"), "5/29/2027");
  assert.equal(celDatum(null), "");
});

test("ločilo »·« med podatki gre skozi zdruzi (ne .join(\" · \"))", () => {
  const files = ["goal.js", "app.js", "exam-papers.js", "schedule.js", "ucitelj.js", "quick-start.js", "zacetna.js", "kviz.js", "racun.js", "chat-settings.js", "textbook.js", "corner.js", "mnenje.js", "3d/atlas.js", "3d/raven.js"];
  for (const f of files) {
    const src = read(f)
      .split("\n")
      // Izjeme: kontekst za črke v formulah (ni prikazan) in namig ob zavihku (title).
      .filter((l) => !/const topicScope|withFormulaSubject\(lessonSubject|tab\.title = /.test(l))
      .join("\n");
    assert.ok(!/join\(" · "\)/.test(src), `${f}: ločilo »·« prek zdruzi iz datum.js`);
    assert.match(src, /from "\.{1,2}\/datum\.js"/, `${f}: uvozi pomočnika iz datum.js`);
  }
  // Tudi v predlogah (`${a} · ${b}`) je pred »·« nedeljiv presledek (LOCILO). Izjeme: komentarji, namig (title),
  // kontekst formul in besedilo sporočila inštruktorju (vadnica.js pp.oursTask), ki ni prikazano v vrstici.
  for (const f of ["goal.js", "exam-papers.js", "schedule.js", "ucitelj.js", "quick-start.js", "zacetna.js", "kviz.js", "chat-settings.js", "textbook.js", "corner.js", "mnenje.js", "vadnica.js", "app.js"]) {
    const bad = read(f)
      .split("\n")
      .filter((l) => / · /.test(l) && !/^\s*\/\/|\/\/ .* · |const topicScope|withFormulaSubject\(lessonSubject|tab\.title = |pp\.oursPola|pp\.oursTask/.test(l));
    assert.deepEqual(bad, [], `${f}: ločilo »·« z navadnim presledkom`);
  }
  // Datum cilja (»29. 5. 2027«) se ne prelomi.
  assert.match(read("goal.js"), /return celDatum\(new Intl\.DateTimeFormat/);
});

test("glavni meni: navigacija z aria-current, ne tablist brez zavihkov", () => {
  const html = read("index.html");
  const top = html.match(/<nav class="tabs"[^>]*>/)[0];
  assert.ok(!/role="tablist"/.test(top), "zgornji meni ni tablist (gumbi nimajo vloge tab)");
  assert.match(top, /aria-label="Glavni meni"/);
  assert.match(html, /<nav id="tabbar" class="tabbar" aria-label="Glavni meni"/);
  assert.match(read("app.js"), /\.topbar \.tabs \.tab, #tabbar \.tab"\)\.forEach\(\(t\) => \(t\.classList\.contains\("active"\) \? t\.setAttribute\("aria-current", "page"\)/);
});

test("spodnja vrstica: napisi in značke vsaj 12 px; žetoni, »Spremeni«, izbira letnika in stikalo vsaj 40 px", () => {
  const css = read("style.css");
  const ui = read("ui.css");
  const rule = (src, sel) => src.match(new RegExp(`(^|\\n)\\s*${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`))?.[2] || "";
  const rem = (decl) => {
    const v = Number(decl.match(/font-size: ([\d.]+)rem/)?.[1] ?? NaN) * 16;
    assert.ok(Number.isFinite(v), `font-size v »${decl.trim().slice(0, 60)}«`);
    return v;
  };
  assert.ok(rem(rule(css, ".tabbar .tab")) >= 12, ".tabbar .tab font-size");
  assert.ok(rem(rule(css, ".modes .badge, .tabbar .badge")) >= 12, ".tabbar .badge font-size");
  assert.ok(!/\.tabbar \.tab span \{[^}]*font-size: 0\.(6|7[01])/.test(css), "napis zavihka ni manjši od 12 px");
  assert.match(rule(css, ".lp-crumb"), /min-height: 40px/);
  assert.match(rule(css, "button.small"), /min-height: 40px/);
  assert.match(rule(ui, ".chip-row > a, .chip-row > button"), /min-height: 40px/);
  assert.match(rule(ui, ".goal-line .gl-edit"), /min-height: 40px/);
  assert.match(rule(ui, ".switch"), /height: 40px/);
});
