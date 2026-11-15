// Aplikacija in nameščena spletna aplikacija strani ne povečujeta (public/theme.js, j 2026-11-15): nehoten poteg z
// dvema prstoma je zaslon povečal, glava je zdrsnila, spodnji vrstici so se odrezali napisi, vidna sta bila drsnika.
// V brskalniku povečava ostane. Pas s preklopnikom v Uči se je neprosojen (public/uci.css).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const PUB = path.join(import.meta.dirname, "..", "public");
const VP = "width=device-width, initial-scale=1, interactive-widget=resizes-content";

function viewportPo(userAgent, standalone = false) {
  const meta = { content: VP, setAttribute(k, v) { this[k] = v; } };
  const el = () => ({ style: { setProperty() {}, removeProperty() {} }, dataset: {}, classList: { toggle() {}, add() {} }, removeAttribute() {}, setAttribute() {}, appendChild() {} });
  const store = new Map();
  const window = {
    localStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k), key: () => null, length: 0 },
    matchMedia: (q) => ({ matches: standalone && q.includes("standalone"), addEventListener() {} }),
    document: { documentElement: el(), head: el(), querySelector: (s) => (s.includes("viewport") ? meta : null), createElement: el },
    navigator: { userAgent },
    dispatchEvent() {},
    CustomEvent: class {},
  };
  window.window = window;
  vm.runInNewContext(fs.readFileSync(path.join(PUB, "theme.js"), "utf8").replace("Object.keys(localStorage)", "[]"), window);
  return meta.content;
}

const ANDROID = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36";

test("v aplikaciji (WebView) in nameščeni spletni aplikaciji se stran ne povečuje", () => {
  for (const vp of [viewportPo(`${ANDROID} EvklidApp/1.4.0`), viewportPo(ANDROID, true)]) {
    assert.match(vp, /maximum-scale=1/);
    assert.match(vp, /user-scalable=no/);
    assert.ok(vp.startsWith(VP), "prejšnje nastavitve ostanejo");
  }
});

test("v brskalniku povečava ostane (dostopnost)", () => {
  assert.equal(viewportPo(ANDROID), VP);
});

test("pas s preklopnikom Učbenik | Laboratorij | 3D svet je neprosojen", () => {
  const css = fs.readFileSync(path.join(PUB, "uci.css"), "utf8");
  assert.match(css, /\.uci-head \{ background: var\(--bg\); \}/);
});
