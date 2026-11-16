// Točka 1.7: pod /practice/ strežnik pokaže samo check.js (preverjanje odgovorov brez povezave), ne cele mape
// server/practice (generatorji nalog z rešitvami, index.js). Prej jo je stisnjeno streženje (server/compress.js)
// dalo vsakemu, ki je poslal Accept-Encoding.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

test("1.7: /practice/ serves only check.js, with and without compression", async () => {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  // fetch v Node sam doda Accept-Encoding; "identity" = brez stiskanja.
  const get = (p, enc) => fetch(base + p, { headers: { "Accept-Encoding": enc || "identity" } });
  try {
    const generator = fs.readdirSync("server/practice/generators").find((f) => f.endsWith(".js"));
    for (const enc of [null, "br", "gzip", "br, gzip, deflate"]) {
      const ok = await get("/practice/check.js", enc);
      assert.equal(ok.status, 200, `check.js ${enc}`);
      assert.match(ok.headers.get("content-type"), /javascript/);
      assert.ok((await ok.text()).length > 0);
      for (const p of ["/practice/index.js", "/practice/rng.js", "/practice/choice.js", `/practice/generators/${generator}`, "/practice/", "/practice/check.js/x.js", "/practice/check.js%2F..%2Findex.js"]) {
        const r = await get(p, enc);
        const body = await r.text();
        assert.ok(r.status === 404 || !/^\s*(import|export)\b/m.test(body), `${p} (${enc}) je dostopen: ${r.status}`);
      }
    }
  } finally {
    server.close();
  }
});
