// Robustnost API: čudni ključi v poizvedbi in pokvarjena telesa zahtev ne smejo vrniti napake 500.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

async function withApp(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { newsOffline: true });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    server.close();
  }
}

test("ključi iz poizvedbe, kot je »toString« ali »__proto__«, ne najdejo podedovanih lastnosti", () =>
  withApp(async (base) => {
    const s = await (await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ana" }) })).json();
    const post = (url, body) => fetch(base + url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    for (const key of ["toString", "__proto__", "constructor", "hasOwnProperty"]) {
      const k = encodeURIComponent(key);
      const checks = [
        [await fetch(`${base}/api/topic?id=${k}`), 404],
        [await fetch(`${base}/api/textbook/toc?path=${k}`), 404],
        [await fetch(`${base}/api/students/${s.id}/lesson?id=${k}`), 404],
        [await fetch(`${base}/api/paths?program=${k}`), 200],
        [await fetch(`${base}/api/references?program=${k}`), 404],
        [await fetch(`${base}/api/textbook/books?program=${k}`), 200],
        [await fetch(`${base}/ucbenik/${k}`), 404],
        [await fetch(`${base}/api/students/${s.id}/path?key=${k}`), 200],
        [await fetch(`${base}/api/students/${s.id}/offline-pack?path=${k}`), 200],
        [await fetch(`${base}/api/students/${s.id}/exams?exam=${k}`), 200],
        [await post(`/api/students/${s.id}/practice/next`, { topic_id: key }), 400],
        [await post(`/api/students/${s.id}/pretest`, { topic_id: key }), 200],
        [await post(`/api/students/${s.id}/placement`, { path: key, unit: 0 }), 400],
        [await post(`/api/students/${s.id}/unit-practice`, { path: key, unit: 0 }), 400],
      ];
      for (const [res, want] of checks) assert.equal(res.status, want, `${key}: ${res.url}`);
    }
  }));

test("pokvarjen ali prevelik JSON: odgovor 400/413 v JSON s sporočilom", () =>
  withApp(async (base) => {
    const bad = await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{ime: " });
    assert.equal(bad.status, 400);
    assert.match((await bad.json()).error, /oblik/);
    const big = await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "x".repeat(11 * 1024 * 1024) }) });
    assert.equal(big.status, 413);
    assert.match((await big.json()).error, /prevelika/);
  }));
