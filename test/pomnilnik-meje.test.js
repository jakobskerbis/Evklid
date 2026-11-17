// Predpomnilniki v pomnilniku ostanejo omejeni (Render starter: 512 MB, 16. 11. 2026 presežen).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { compressedStatic } from "../server/compress.js";
import { rankLessons, indexCount, INDEX_MAX } from "../server/lekcija-za-vprasanje.js";
import { listPaths } from "../server/curriculum.js";

// Najmanjši odjemalec za vmesnik (middleware) brez strežnika.
function call(mw, url) {
  return new Promise((resolve, reject) => {
    const headers = {};
    const res = {
      setHeader: (k, v) => (headers[k.toLowerCase()] = v),
      status() {
        return this;
      },
      end: (body) => resolve({ headers, body }),
    };
    const req = { method: "GET", path: url, headers: { "accept-encoding": "gzip" } };
    Promise.resolve(mw(req, res, () => resolve(null))).catch(reject);
  });
}

test("compressed static files: cache stays under its byte limit and evicted files are still served", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-stisk-"));
  try {
    // Naključni base64 se stisne le na ~6 KB: meja 20 KB = največ trije vnosi.
    for (let i = 0; i < 12; i++) fs.writeFileSync(path.join(dir, `f${i}.js`), crypto.randomBytes(8192).toString("base64").slice(0, 8192));
    const mw = compressedStatic([["/", dir]], { maxBytes: 20 * 1024 });
    for (let round = 0; round < 2; round++)
      for (let i = 0; i < 12; i++) {
        const r = await call(mw, `/f${i}.js`);
        assert.ok(r, `f${i}.js postrežena`);
        assert.equal(r.headers["content-encoding"], "gzip");
        const s = mw.stats();
        assert.ok(s.bytes <= s.maxBytes, `predpomnilnik ${s.bytes} B > ${s.maxBytes} B`);
        assert.ok(s.entries <= 3);
      }
    // Polna meja: najstarejše so šle ven (LRU), ne vse naenkrat.
    assert.equal(mw.stats().entries, 3);
    // Datoteka, večja od meje, se pošlje, a ne shrani.
    fs.writeFileSync(path.join(dir, "velika.js"), crypto.randomBytes(40 * 1024).toString("base64"));
    const big = await call(mw, "/velika.js");
    assert.ok(big && big.body.length > 20 * 1024);
    assert.ok(mw.stats().bytes <= 20 * 1024);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("lesson search: at most INDEX_MAX subject/level indexes are kept", () => {
  const subjects = [...new Set(listPaths().map((p) => p.subject))];
  const levels = [
    ...Array.from({ length: 9 }, (_, i) => ({ educational_track: "OSNOVNA_SOLA", curriculum_level: `${i + 1}. razred` })),
    ...Array.from({ length: 4 }, (_, i) => ({ educational_track: "SREDNJA_SOLA", curriculum_level: `${i + 1}. letnik` })),
  ];
  let built = 0;
  for (const subject of subjects)
    for (const lvl of levels) {
      rankLessons("Kako izračunam ploščino?", { subject, ...lvl });
      built++;
      assert.ok(indexCount() <= INDEX_MAX, `${indexCount()} kazal > ${INDEX_MAX}`);
    }
  assert.ok(built > INDEX_MAX, "preizkus mora zgraditi več kazal, kot je meja");
});

test("render.yaml and Dockerfile tell glibc to return freed memory (RSS 653 → 381 MB, 17. 11. 2026)", () => {
  const yaml = fs.readFileSync(new URL("../render.yaml", import.meta.url), "utf8");
  const docker = fs.readFileSync(new URL("../Dockerfile", import.meta.url), "utf8");
  for (const [k, v] of [["MALLOC_ARENA_MAX", "2"], ["MALLOC_TRIM_THRESHOLD_", "131072"], ["MALLOC_MMAP_THRESHOLD_", "131072"]]) {
    assert.match(yaml, new RegExp(`- key: ${k}\\n\\s+value: "${v}"`), `render.yaml: ${k}`);
    assert.match(docker, new RegExp(`${k}=${v}\\b`), `Dockerfile: ${k}`);
  }
});
