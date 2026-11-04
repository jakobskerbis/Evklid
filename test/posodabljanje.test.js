// Ponovni zagon strežnika ob objavi: zahteva počaka in uspe, uporabnik ne vidi napake (public/restart-retry.js).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fetchThroughRestart, BUSY_WAIT } from "../public/restart-retry.js";

const page = (status) => ({ status, headers: new Map([["content-type", "text/html"]]) });
const busy = (r) => [502, 503, 504].includes(r.status);

test("host 502 during a deploy: request is retried until the server answers", async () => {
  const seen = [];
  const answers = [page(502), page(503), { status: 200 }];
  const waits = [];
  const res = await fetchThroughRestart("/api/x", { method: "POST" }, { busy, fetchFn: async (u, init) => (seen.push(init.method), answers.shift()), wait: async (ms) => waits.push(ms) });
  assert.equal(res.status, 200);
  assert.deepEqual(seen, ["POST", "POST", "POST"]);
  assert.deepEqual(waits, BUSY_WAIT.slice(0, 2));
  assert.ok(BUSY_WAIT.reduce((a, b) => a + b, 0) >= 60000, "počaka vsaj minuto (toliko traja ponovni zagon)");
});

test("gives up after the wait list and returns the last host page; failed fetch is offline at once", async () => {
  let n = 0;
  const res = await fetchThroughRestart("/api/x", {}, { busy, fetchFn: async () => (n++, page(502)), wait: async () => {}, delays: [1, 1] });
  assert.equal(res.status, 502);
  assert.equal(n, 3);
  n = 0;
  const off = await fetchThroughRestart("/api/x", {}, { busy, fetchFn: async () => (n++, Promise.reject(new TypeError("Failed to fetch"))), wait: async () => {} });
  assert.equal(off, null);
  assert.equal(n, 1);
});

test("web and app both wait through a restart and show the updating notice", () => {
  const app = fs.readFileSync("public/app.js", "utf8");
  assert.match(app, /fetchThroughRestart\(url,/);
  assert.match(app, /fetchThroughRestart\(`\/api\/conversations\//);
  assert.match(app, /t\("off\.updating"\)/);
  const api = fs.readFileSync("mobile/src/lib/api.ts", "utf8");
  assert.match(api, /hostBusy\(res\)/);
  assert.match(fs.readFileSync("mobile/src/app/_layout.tsx", "utf8"), /t\("off\.updating"\)/);
});

test("app WebView: a deploy (5xx or dropped connection) retries quietly instead of »Ni povezave« at once", () => {
  const web = fs.readFileSync("mobile/src/app/web.tsx", "utf8");
  assert.match(fs.readFileSync("mobile/src/lib/api.ts", "utf8"), /export const BUSY_WAIT = \[/);
  assert.match(web, /onError=\{\(\) => failOrWait\(busy\.current \? BUSY_WAIT\.length : 2\)\}/);
  assert.match(web, /busy\.current = \[502, 503, 504\]\.includes\(e\.nativeEvent\.statusCode\);\s*failOrWait\(busy\.current \? BUSY_WAIT\.length : 0\)/);
  assert.doesNotMatch(web, /onError=\{\(\) => setFailed\(true\)\}/);
  assert.match(web, /updating \? \(\s*<Text accessibilityLiveRegion="polite"[^>]*>\{t\("off\.updating"\)\}/); // kot splet: obvestilo med čakanjem
});
