import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

// Zaslon na dotik: :hover se odstrani iz pravil CSS (j, 17. 11. 2026: »ikone ostanejo označene«).
const src = readFileSync(new URL("../public/brez-lebdenja.js", import.meta.url), "utf8");
// paint: brez njega (brskalnik brez Paint Timing in brez requestAnimationFrame) čiščenje steče takoj.
function run(hoverNone, sheets, { paint = false } = {}) {
  const on = {};
  const timers = [];
  const ctx = {
    window: { matchMedia: () => ({ matches: hoverNone }), addEventListener(t, f) { on[t] = f; } },
    matchMedia: () => ({ matches: hoverNone }),
    document: { styleSheets: sheets, addEventListener(t, f) { on[t] = f; }, head: {}, documentElement: {} },
    MutationObserver: class { observe() {} },
    WeakSet,
    setTimeout: (f, ms) => timers.push({ f, ms }),
    on,
    timers,
  };
  if (paint) {
    ctx.PerformanceObserver = class {
      static supportedEntryTypes = ["paint", "largest-contentful-paint"];
      constructor(cb) { ctx.paintCb = cb; }
      observe(o) { ctx.observed = o; }
      disconnect() { ctx.disconnected = true; }
    };
    ctx.window.PerformanceObserver = ctx.PerformanceObserver;
  }
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

test("touch screens: cleaning waits for the first paint (it delayed the first paint by ~50 ms on phones)", () => {
  const rules = [rule("button.ghost:hover"), rule(".plain")];
  const ctx = run(true, [sheetOf(rules)], { paint: true });
  assert.deepEqual({ ...ctx.observed }, { type: "paint", buffered: true });
  ctx.on.DOMContentLoaded();
  ctx.on.load();
  assert.equal(rules[0].selectorText, "button.ghost:hover", "before the first paint nothing changes");
  ctx.paintCb({ getEntriesByName: () => [] }); // first-paint without content does not count
  assert.equal(ctx.timers.filter((t) => t.ms === 0).length, 0, "waits for first-contentful-paint");
  ctx.paintCb({ getEntriesByName: (n) => (n === "first-contentful-paint" ? [{}] : []) });
  assert.equal(ctx.disconnected, true);
  assert.equal(rules[0].selectorText, "button.ghost:hover", "right after the paint, in a new task");
  for (const t of ctx.timers.filter((t) => t.ms === 0)) t.f();
  assert.deepEqual(rules.map((r) => r.selectorText), [".plain"]);
  const late = [rule(".late:hover, .late:focus")];
  ctx.document.styleSheets.push(sheetOf(late));
  ctx.on.load();
  assert.equal(late[0].selectorText, ".late:focus", "after the first paint every later stylesheet as before");
});

test("touch screens: a tab that never paints (hidden) is cleaned after 3 s at the latest", () => {
  const rules = [rule(".a:hover")];
  const ctx = run(true, [sheetOf(rules)], { paint: true });
  const t = ctx.timers.find((t) => t.ms === 3000);
  assert.ok(t);
  t.f();
  assert.equal(rules.length, 0);
});

test("touch screens: the first touch cleans at once, before the post-paint task (review #931)", () => {
  const rules = [rule(".a:hover"), rule(".b")];
  const ctx = run(true, [sheetOf(rules)], { paint: true });
  assert.equal(rules.length, 2, "nothing before the touch");
  ctx.on.touchstart();
  assert.deepEqual(rules.map((r) => r.selectorText), [".b"]);
});

test("split keeps commas inside :is() and attribute values", () => {
  const ctx = run(true, []);
  assert.deepEqual([...ctx.window.EvklidDotik.split(':is(.a, .b) .c, [data-x="1,2"]:hover')], [":is(.a, .b) .c", '[data-x="1,2"]:hover']);
});

test("app pages load brez-lebdenja.js", () => {
  for (const f of ["index.html", "3d.html", "kalkulator.html"]) assert.match(readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8"), /<script src="\/?brez-lebdenja\.js"><\/script>/, f);
});
