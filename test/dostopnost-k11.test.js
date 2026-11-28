// Dostopnost K-11 (WCAG 2.2 AA, axe 4.11 na glavnih zaslonih, docs/meritve/dostopnost-2026-11-26.md):
// kontrast barv besedila, imena kontrolam brez napisa, vloge ARIA in dosegljivost drsnih področij s tipko Tab.
// V brskalniku vse to preverja scripts/preveri-aplikacijo.cjs (axe na vsakem posnetku); tu so pravila, ki jih
// je mogoče preveriti brez brskalnika, da se popravki ne izgubijo.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { dosegljiva, POGLED } from "../public/drsniki.js";

const read = (f) => fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");

// Relativna svetlost in kontrast po WCAG 2.x (1.4.3).
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const kontrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
// Vrednosti spremenljivk v svetlem :root (prvi blok v style.css).
const svetle = () => {
  const css = read("style.css");
  const blok = css.slice(css.indexOf(":root {"), css.indexOf("}", css.indexOf(":root {")));
  const v = {};
  for (const [, k, val] of blok.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) v[k] = val;
  return v;
};

test("svetla tema: rdeče in zlato besedilo ima vsaj 4,5 : 1", () => {
  const v = svetle();
  for (const k of ["--danger", "--danger-bg", "--gold-text", "--surface"]) assert.ok(v[k], `${k} manjka v :root`);
  assert.ok(kontrast(v["--danger"], v["--danger-bg"]) >= 4.5, `--danger na --danger-bg: ${kontrast(v["--danger"], v["--danger-bg"]).toFixed(2)}`);
  assert.ok(kontrast(v["--danger"], "#ffffff") >= 4.5);
  assert.ok(kontrast(v["--gold-text"], v["--surface"]) >= 4.5, `--gold-text: ${kontrast(v["--gold-text"], v["--surface"]).toFixed(2)}`);
  // temna tema zlato besedilo pusti v zlati barvi (na temni podlagi ima dovolj kontrasta)
  assert.match(read("style.css"), /:root\.dark\s*\{[^}]*--gold-text:\s*var\(--gold\)/);
});

test("besedilo ne bledi s prosojnostjo (axe ga ne zna preveriti ali je pod 4,5 : 1)", () => {
  const css = read("style.css").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(css, /\.xp-gain\s*\{[^}]*color:\s*var\(--gold-text\)/, "+XP v zlatem besedilu");
  const hero = css.match(/\.hero p\s*\{([^}]*)\}/);
  assert.ok(hero, ".hero p");
  assert.doesNotMatch(hero[1], /opacity/, ".hero p brez opacity");
  const zb = read("zbirke.css").replace(/\/\*[\s\S]*?\*\//g, "").match(/\.zb-tabs small\s*\{([^}]*)\}/);
  assert.ok(zb, ".zb-tabs small");
  assert.doesNotMatch(zb[1], /opacity/, "število na zavihku zbirk brez opacity");
});

test("kontrole brez vidnega napisa imajo ime, vloge ARIA so dovoljene", () => {
  assert.match(read("textbook.js"), /class="tb-progress"[^>]*aria-label="\$\{esc\(t\("tb\.steps\.count"/);
  assert.match(read("textbook.js"), /bar\.setAttribute\("aria-label", t\("tb\.steps\.count"/, "oznaka sledi koraku");
  assert.match(read("zbirke-view.js"), /class="zb-bar"[^>]*aria-label=/);
  assert.match(read("racun.js"), /<input id="ref-url" readonly aria-label="/);
  assert.match(read("games/core.js"), /<span class="gm-lives" role="img" aria-label=/);
  // gumb »Jaz« v glavi kalkulatorja: na ozkem zaslonu se napis skrije, ime ostane
  assert.match(read("index.html"), /<div class="calc-top"><button type="button" class="ghost back me-back" aria-label="Jaz" data-i18n-aria="nav\.me">/);
  // gumba Obrazec/Pogovor nista zavihka (ni tabpanel): skupina s pritisnjenim gumbom
  const fb = read("feedback.js");
  assert.doesNotMatch(fb, /fb-tabs"[^>]*role="tablist"/);
  assert.match(fb, /aria-pressed="\$\{tab === "form"\}"/);
  assert.match(fb, /aria-pressed="\$\{tab === "chat"\}"/);
  // <ul> z vlogo group nima več elementov seznama (axe listitem)
  assert.doesNotMatch(read("our-paper.js"), /<ul class="op-choices[^"]*"[^>]*role="group"/);
  // vrstica zgodovine skenerja: ime iz besedila naloge, nikoli surov LaTeX (bralnik bi ga bral znak za znakom)
  assert.match(read("scan/scan.js"), /class="list-row" data-hist="\$\{i\}" aria-label="\$\{esc\(h\.text \|\| `\$\{t\("scan\.history"\)\}/);
  assert.doesNotMatch(read("scan/scan.js"), /aria-label="\$\{esc\(\[?h\.tex\b/);
});

test("ponovljena črka formule nima aria-label in aria-expanded brez vloge gumba", () => {
  const src = read("formula-info.js");
  const dup = src.slice(src.indexOf("if (dup) {"), src.indexOf("const tone ="));
  assert.match(dup, /removeAttribute\("role"\)[\s\S]*removeAttribute\("aria-label"\)[\s\S]*removeAttribute\("aria-expanded"\)/);
  assert.match(dup, /setAttribute\("role", "button"\)[\s\S]*dataset\.fxLabel[\s\S]*setAttribute\("aria-expanded", "false"\)/);
});

test("risba simulacije (svg role=img) dobi ime", () => {
  const src = read("sim/index.js");
  assert.match(src, /svg\[role="img"\]:not\(\[aria-label\]\):not\(\[aria-labelledby\]\)/);
  assert.match(src, /focusableTargets\(el, naslov\)/);
  // naslov ni v opts: opts so del ključa shranjenih meritev laboratorija (labId), ki se ne sme spremeniti
  // (peti argument { prvic } je samo za nov poskus po neuspelem uvozu, sim/index.js uvoziPogon)
  assert.match(src, /export async function mountSim\(id, el, opts = \{\}, naslov = ""(, \{ prvic = true \} = \{\})?\)/);
  assert.match(read("textbook.js"), /mountSim\(d\.id, m, d\.opts, d\.title\)/);
  assert.match(read("laboratorij.js"), /mountSim\(x\.id, m, x\.opts, x\.title\)/);
  assert.match(read("odpri.js"), /mountSim\(x\.id, body, x\.opts \|\| \{\}, x\.title\)/);
});

test("zlato besedilo uporablja --gold-text (igre, +XP), temni bloki strani so enaki :root.dark", () => {
  const brez = (f) => read(f).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.match(brez("games.css"), /\.gm-record \{[^}]*color: var\(--gold-text\)/);
  assert.match(brez("games.css"), /\.gm-xp \{ color: var\(--gold-text\); \}/);
  assert.match(brez("xp.css"), /\.xp-plus \{[^}]*color: var\(--gold-text\)/);
  for (const f of ["videz-naprave.css", "o-evklidu.html", "zakaj-evklid.html"]) assert.match(read(f), /--gold-text: var\(--gold\);/, f);
});

// Lažen element: dovolj za dosegljiva() brez brskalnika. fokus: null (nič za fokus), "viden" ali "skrit";
// gumb: element je sam gumb ali je v gumbu.
function el({ tabindex = null, fokus = null, gumb = false } = {}) {
  const a = new Map(tabindex === null ? [] : [["tabindex", tabindex]]);
  return {
    dataset: {},
    hasAttribute: (k) => a.has(k),
    getAttribute: (k) => (a.has(k) ? a.get(k) : null),
    setAttribute: (k, v) => a.set(k, String(v)),
    removeAttribute: (k) => a.delete(k),
    querySelectorAll: () => (fokus ? [{ checkVisibility: () => fokus === "viden" }] : []),
    matches: () => gumb === "sam",
    parentElement: { closest: () => (gumb === "v" ? {} : null) },
    set fokus(v) {
      fokus = v;
    },
  };
}

test("dosegljiva: drsno področje brez česar koli za fokus dobi tabindex 0, ko ni več drsno, ga izgubi", () => {
  const e = el();
  dosegljiva(e, true);
  assert.equal(e.getAttribute("tabindex"), "0");
  dosegljiva(e, true); // drugič nič ne spremeni
  assert.equal(e.getAttribute("tabindex"), "0");
  dosegljiva(e, false);
  assert.equal(e.hasAttribute("tabindex"), false);
  assert.equal(e.dataset.drsFokus, undefined);
});

test("dosegljiva: kjer je kaj za fokus, tabindex ni potreben; dodan se odstrani, ko vsebina dobi gumb", () => {
  const z = el({ fokus: "viden" });
  dosegljiva(z, true);
  assert.equal(z.hasAttribute("tabindex"), false);
  const e = el();
  dosegljiva(e, true);
  assert.equal(e.getAttribute("tabindex"), "0");
  e.fokus = "viden"; // npr. Napredek je naložil gumb
  dosegljiva(e, true);
  assert.equal(e.hasAttribute("tabindex"), false);
});

test("dosegljiva: skrit gumb (display: none) ne šteje kot nekaj za fokus", () => {
  const e = el({ fokus: "skrit" }); // Napredek na računalniku: »← Jaz« je skrit
  dosegljiva(e, true);
  assert.equal(e.getAttribute("tabindex"), "0");
});

test("dosegljiva: vrstica v gumbu ali sama gumb ne dobi tabindex (brez gnezdenega interaktivnega elementa)", () => {
  for (const gumb of ["sam", "v"]) {
    const e = el({ gumb }); // npr. izraz v vrstici zgodovine skenerja (<button class="list-row">)
    dosegljiva(e, true);
    assert.equal(e.hasAttribute("tabindex"), false, gumb);
  }
});

test("dosegljiva: tabindex, ki ga je element imel že prej, ostane nespremenjen", () => {
  for (const ti of ["-1", "0", "2"]) {
    const e = el({ tabindex: ti });
    dosegljiva(e, true);
    assert.equal(e.getAttribute("tabindex"), ti);
    dosegljiva(e, false);
    assert.equal(e.getAttribute("tabindex"), ti);
  }
});

test("pogledi, ki se pomikajo sami (.narrow), so med drsnimi področji", () => {
  assert.equal(POGLED, "main.view");
  assert.match(read("style.css"), /\.narrow \{[^}]*overflow-y: auto/);
});
