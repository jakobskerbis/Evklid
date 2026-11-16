// Javne poti brez prijave (iskalec 6): veliko telo JSON se ne razčleni (413 takoj), s prijavo pa slike v pogovoru
// (do 10 MB) delujejo kot prej (točka A9: druge poti s prijavo imajo 100 kb). Prej je 5 MB telo na /api/school-orders ali /api/auth/<karkoli> porabilo 0,3–0,4 s
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

// Točka A9 (odločitev j, 14. 11.): velika telesa s prijavo samo še na poteh s fotografijo (test/meja-telesa.test.js).
// Prej je ta test pošiljal 2 MB na ustvarjanje pogovora (vsaka pot je sprejela 10 MB); zdaj sliko v sporočilo.
test("s prijavo: telo do 10 MB se še razčleni (slike v pogovoru)", async () => {
  await withAccounts({}, async ({ call, kid }) => {
    const conv = await call(`/api/students/${kid.id}/conversations`, { method: "POST" });
    assert.ok(conv.status === 200 || conv.status === 201, `${conv.status} ${JSON.stringify(conv.body).slice(0, 200)}`);
    const r = await call(`/api/conversations/${conv.body.id}/messages`, { method: "POST", body: { text: "kaj je to", image: { media_type: "image/png", data: "A".repeat(2e6) } } });
    assert.notEqual(r.status, 413, `${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
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
