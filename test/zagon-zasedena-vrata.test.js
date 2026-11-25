// AUDIT-077: če so vrata zasedena, strežnik izpiše pravi vzrok (EADDRINUSE) in izstopi s kodo 1,
// ne pa druge napake »Cannot read properties of null (reading 'port')«, ki je prej skrila pravo.
import test from "node:test";
import assert from "node:assert/strict";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";

test("zasedena vrata: v dnevniku je EADDRINUSE, ne TypeError", async () => {
  const zaseda = net.createServer();
  await new Promise((r) => zaseda.listen(0, r));
  const port = zaseda.address().port;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-vrata-"));
  try {
    const env = { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", EVKLID_ACCOUNTS: "0", ANTHROPIC_API_KEY: "" };
    const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { env, stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    srv.stderr.on("data", (d) => (stderr += d));
    const rok = setTimeout(() => srv.kill(), 60000);
    const code = await new Promise((r) => srv.on("exit", r));
    clearTimeout(rok);
    assert.equal(code, 1, stderr);
    assert.match(stderr, /EADDRINUSE/);
    assert.doesNotMatch(stderr, /reading 'port'/);
  } finally {
    zaseda.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
