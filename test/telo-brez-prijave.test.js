// Javne poti brez prijave (iskalec 6): veliko telo JSON se ne razčleni (413 takoj), s prijavo pa slike v pogovoru
// (do 10 MB) delujejo kot prej. Prej je 5 MB telo na /api/school-orders ali /api/auth/<karkoli> porabilo 0,3–0,4 s
// procesorja še pred omejitvijo naročil na IP.
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts } from "./racuni-pomoc.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const big = (mb) => JSON.stringify({ school: "OŠ", note: "x".repeat(mb * 1e6) });

test("brez prijave: veliko telo na javnih poteh → 413, majhno deluje", async () => {
  await withAccounts({}, async ({ store }) => {
    const app = createApp(store, { accounts: true, scheduler: false, log: { error() {} } });
    const server = app.listen(0);
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
      for (const p of ["/api/school-orders", "/api/auth/neznano"]) {
        const r = await fetch(base + p, { method: "POST", headers: { "content-type": "application/json" }, body: big(2) });
        assert.equal(r.status, 413, p);
      }
      const small = await fetch(base + "/api/school-orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ school: "" }) });
      assert.equal(small.status, 400, "majhno telo pride do preverjanja polj");
    } finally {
      server.close();
    }
  });
});

test("s prijavo: telo do 10 MB se še razčleni (slike v pogovoru)", async () => {
  await withAccounts({}, async ({ call, kid }) => {
    const r = await call(`/api/students/${kid.id}/conversations`, { method: "POST", body: { pad: "x".repeat(2e6) } });
    assert.ok(r.status === 200 || r.status === 201, `${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
  });
});

test("brez računov (domača namestitev): velika telesa kot prej", async () => {
  const app = createApp(openDb(":memory:"), { accounts: false, scheduler: false });
  const server = app.listen(0);
  try {
    const r = await fetch(`http://127.0.0.1:${server.address().port}/api/neznano`, { method: "POST", headers: { "content-type": "application/json" }, body: big(2) });
    assert.notEqual(r.status, 413);
  } finally {
    server.close();
  }
});
