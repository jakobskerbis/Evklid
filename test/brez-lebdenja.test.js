import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

// Zaslon na dotik: :hover se odstrani iz pravil CSS (j, 17. 11. 2026: »ikone ostanejo označene«).
const src = readFileSync(new URL("../public/brez-lebdenja.js", import.meta.url), "utf8");
function run(hoverNone, sheets) {
  const ctx = {
    window: { matchMedia: () => ({ matches: hoverNone }), addEventListener() {} },
    matchMedia: () => ({ matches: hoverNone }),
    document: { styleSheets: sheets, addEventListener() {}, head: {}, documentElement: {} },
    MutationObserver: class { observe() {} },
    WeakSet,
  };
  ctx.window.matchMedia = ctx.matchMedia;
  vm.runInNewContext(src, ctx);
  return ctx;
}
const rule = (selectorText) => ({ selectorText });
function sheetOf(rules) {
  const s = { cssRules: rules, deleteRule(i) { rules.splice(i, 1); } };
  rules.forEach((r) => (r.parentStyleSheet = s));
  return s;
}

test("touch screens: :hover selectors are removed, other selectors of the rule stay", () => {
  const media = { cssRules: [rule(".a:hover")], deleteRule(i) { this.cssRules.splice(i, 1); } };
  media.cssRules[0].parentRule = media;
  const rules = [rule("button.ghost:hover"), rule(".x:hover, .x:focus-visible"), rule(":is(.a, .b):hover, .c"), rule(".plain"), media];
  run(true, [sheetOf(rules)]);
  assert.deepEqual(rules.map((r) => r.selectorText), [".x:focus-visible", ".c", ".plain", undefined]);
  assert.equal(media.cssRules.length, 0, "tudi v @media");
});

test("touch screens: :not(:hover) always holds, so only that part is removed", () => {
  const rules = [rule(".g .lbl:not(:hover)"), rule(".k:not( :hover ), .k:hover")];
  run(true, [sheetOf(rules)]);
  assert.deepEqual(rules.map((r) => r.selectorText), [".g .lbl", ".k"]);
});

test("mouse devices keep :hover", () => {
  const rules = [rule("button.ghost:hover")];
  run(false, [sheetOf(rules)]);
  assert.equal(rules[0].selectorText, "button.ghost:hover");
});

test("split keeps commas inside :is() and attribute values", () => {
  const ctx = run(true, []);
  assert.deepEqual([...ctx.window.EvklidDotik.split(':is(.a, .b) .c, [data-x="1,2"]:hover')], [":is(.a, .b) .c", '[data-x="1,2"]:hover']);
});

test("app pages load brez-lebdenja.js", () => {
  for (const f of ["index.html", "3d.html", "kalkulator.html"]) assert.match(readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8"), /<script src="\/?brez-lebdenja\.js"><\/script>/, f);
});
