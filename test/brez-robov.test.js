// Brez praznih robov (j 2026-11-04): »če je ob straneh zaslona na katerem koli delu Evklida prazen prostor, naj se
// prikaz spremeni tako, da ga izkoristi«, in glava Inštruktorja brez praznega pasu ter odrezanih oznak.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const pub = new URL("../public/", import.meta.url);
const read = (f) => readFileSync(new URL(f, pub), "utf8");
const css = (f) => read(f).replace(/\/\*[\s\S]*?\*\//g, "");
const CSS = readdirSync(pub).filter((f) => f.endsWith(".css"));

test("pogledi nimajo omejene širine (.narrow in glavni pogledi čez vso širino)", () => {
  const style = css("style.css");
  const narrow = /(^|\n)\.narrow \{([^}]*)\}/.exec(style);
  assert.ok(narrow, ".narrow obstaja");
  assert.doesNotMatch(narrow[2], /max-width/, ".narrow brez max-width");
  // Nobeno pravilo za cel pogled (#view-…) ali vsebino klepeta ne sme imeti max-width v px.
  const bad = [];
  for (const f of CSS) {
    for (const [, sel, body] of css(f).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const m = /max-width:\s*(\d+)px/.exec(body);
      if (!m) continue;
      if (/#view-[a-z]+(?::has\([^)]*\))?\s*$|\.gm-portal|\.lab-view|\.composer-row|\.ai-note|\.pse-wrap|\.fm-wrap|\.un-wrap|\.tl-view|\.op-body|\.pv-pages|\.cb-grid/.test(sel.trim())) bad.push(`${f}: ${sel.trim()} (${m[1]}px)`);
    }
  }
  assert.deepEqual(bad, []);
});

test("kartice strani se razvrstijo v stolpce, ki se računajo iz širine vsebnika", () => {
  const ui = css("ui.css");
  assert.match(ui, /\.set-cols[^{]*\{[^}]*column-width:\s*400px/);
  assert.match(read("index.html"), /<div class="set-cols">/, "Nastavitve imajo ovoj za stolpce");
  assert.match(read("account.js"), /<div class="kolone">/, "Račun ima ovoj za stolpce");
});

test("aplikacija na telefonu: odmik za uro in gumbe ni podvojen", () => {
  // Vsak odmik zgoraj/spodaj gre prek --varno-zg/--varno-sp, ki ju theme.js v aplikaciji nastavi na 0.
  const raw = [];
  for (const f of CSS) {
    const s = css(f).replace(/var\(--varno-(?:zg|sp), env\(safe-area-inset-(?:top|bottom), 0px\)\)/g, "");
    if (/env\(safe-area-inset-(?:top|bottom)/.test(s)) raw.push(f);
  }
  assert.deepEqual(raw, []);
  const theme = read("theme.js");
  assert.match(theme, / EvklidApp\\\//, "theme.js prepozna aplikacijo po User-Agent");
  assert.match(theme, /setProperty\("--varno-zg", "0px"\)/);
  assert.match(theme, /setProperty\("--varno-sp", "0px"\)/);
  // Aplikacija res pusti prostor sama (če to kdaj odstranimo, mora splet spet uporabiti env()).
  const web = readFileSync(new URL("../mobile/src/app/web.tsx", import.meta.url), "utf8");
  assert.match(web, /paddingTop: insets\.top/);
  assert.match(web, /paddingBottom: insets\.bottom/);
});

test("glava Inštruktorja na telefonu: oznake cele v svoji vrstici, »Preberi lekcijo« z ikono", () => {
  const touch = css("touch.css");
  assert.match(touch, /\.chat-head #chat-state \{[^}]*flex: 1 1 100%/);
  assert.match(touch, /\.chat-head #chat-state \.chip \{[^}]*overflow: visible/);
  assert.match(css("okna.css"), /\.chat-head #chat-state \{[^}]*flex: 1 1 100%/, "tudi v ozkem oknu");
  assert.doesNotMatch(css("ui.css"), /#chat-state[^{]*\{[^}]*max-width:\s*34%/, "brez odrezane oznake predmeta");
  assert.match(read("app.js"), /chat-lesson[\s\S]{0,80}icon\("book-open"\)/);
});
