// Ime aplikacije je v brand.json. Ta test:
// 1) prepreči, da bi se prejšnje ime (brand.json → legacy) vrnilo, vidno ali v kodi,
// 2) preveri, da se nastavitve, baza, piškotek, cene in oznake s prejšnjim imenom prenesejo brez izgube.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import express from "express";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAND = JSON.parse(fs.readFileSync(path.join(root, "brand.json"), "utf8"));
const LEGACY = BRAND.legacy || [];
const OLD = LEGACY.map((l) => new RegExp(l.match || l.slug, "i"));

// Smejo ostati samo vrstice, označene z »brand:legacy« (seznam prejšnjih imen v theme.js).
// Prejšnje ime repozitorija na GitHubu je v brand.json → legacy[].repo.
const ALLOW = [];
const SKIP_FILES = new Set(["brand.json", "test/ime.test.js", "scripts/preimenuj.js"]);
const SKIP_DIRS = new Set([".git", ".claude", "node_modules", "data", "vendor"]);
const TEXT = /\.(js|cjs|mjs|json|md|html|css|bat|cmd|command|yaml|yml|txt|svg|webmanifest|py|csv)$|^(Dockerfile|\.env\.example|\.gitattributes)$/;

function* walk(dir) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(d.name)) continue;
    const p = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
}

test("brand.json je popoln", () => {
  for (const k of ["name", "slug", "env"]) assert.ok(BRAND[k], k);
  assert.equal(BRAND.wordmark.join(""), BRAND.name);
  assert.match(BRAND.slug, /^[a-z]+$/);
  assert.match(BRAND.env, /^[A-Z]+$/);
  for (const l of LEGACY) assert.ok(l.name && l.slug && l.env, JSON.stringify(l));
});

test("prejšnje ime se ne vrne (razen v kodi za prenos, ki ga bere iz brand.json)", () => {
  const bad = [];
  for (const file of walk(root)) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (OLD.some((re) => re.test(path.basename(file)))) bad.push(`${rel}: ime datoteke`);
    if (SKIP_FILES.has(rel) || !TEXT.test(path.basename(file))) continue;
    fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      if (line.includes("brand:legacy")) return;
      const rest = ALLOW.reduce((s, re) => s.replace(re, ""), line);
      if (OLD.some((re) => re.test(rest))) bad.push(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
    });
  }
  assert.deepEqual(bad, [], `Aplikacija se zdaj imenuje ${BRAND.name} (${BRAND.env}_*, ${BRAND.slug}.*). Popravi te vrstice:\n${bad.join("\n")}`);
});

test("theme.js prenese ključe vseh prejšnjih imen", () => {
  const src = fs.readFileSync(path.join(root, "public/theme.js"), "utf8");
  assert.match(src, new RegExp(`const NOW = "${BRAND.slug}";`));
  const list = JSON.parse(src.match(/const LEGACY = (\[.*?\]); \/\/ brand:legacy/)[1]);
  assert.deepEqual(list, LEGACY.map((l) => l.slug));
});

for (const old of LEGACY) {
  test(`nastavitve ${old.env}_* v .env veljajo kot ${BRAND.env}_*`, async () => {
    process.env[`${old.env}_PREIZKUS_IMENA`] = "staro";
    process.env[`${old.env}_PREIZKUS_OBA`] = "staro";
    process.env[`${BRAND.env}_PREIZKUS_OBA`] = "novo";
    await import(`../server/env.js?t=${Date.now()}`);
    assert.equal(process.env[`${BRAND.env}_PREIZKUS_IMENA`], "staro");
    assert.equal(process.env[`${BRAND.env}_PREIZKUS_OBA`], "novo"); // novo ime ima prednost
    for (const p of [old.env, BRAND.env]) for (const k of ["PREIZKUS_IMENA", "PREIZKUS_OBA"]) delete process.env[`${p}_${k}`];
  });

  test(`baza data/${old.slug}.db se ob prvem zagonu prenese v data/${BRAND.slug}.db`, async () => {
    const { openDb } = await import("../server/db.js");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ime-"));
    const prev = openDb(path.join(dir, `${old.slug}.db`));
    const s = prev.createStudent("Ana");
    prev.db.close();
    const store = openDb(path.join(dir, `${BRAND.slug}.db`));
    assert.deepEqual(store.listStudents().map((x) => [x.id, x.name]), [[s.id, "Ana"]]);
    assert.ok(fs.existsSync(path.join(dir, `${old.slug}.db`)), "stara ostane kot varnostna kopija");
    store.createStudent("Bor");
    store.db.close();
    const again = openDb(path.join(dir, `${BRAND.slug}.db`)); // drugič se ne prepiše čez
    assert.equal(again.listStudents().length, 2);
    again.db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test(`piškotek z geslom ${old.slug}_geslo še velja in se zamenja z novim`, async () => {
    const { passwordGate } = await import("../server/gate.js");
    const app = express();
    app.use(passwordGate("geslo1"));
    app.get("/api/x", (_req, res) => res.json({ ok: true }));
    const server = app.listen(0);
    try {
      const base = `http://127.0.0.1:${server.address().port}`;
      const legacy = crypto.createHmac("sha256", "geslo1").update(`${old.slug}-gate-v1`).digest("hex");
      const r = await fetch(base + "/api/x", { headers: { cookie: `${old.slug}_geslo=${legacy}` } });
      assert.equal(r.status, 200);
      assert.match(r.headers.get("set-cookie") || "", new RegExp(`^${BRAND.slug}_geslo=[a-f0-9]{64}`));
      const wrong = await fetch(base + "/api/x", { headers: { cookie: `${old.slug}_geslo=${"0".repeat(64)}` } });
      assert.equal(wrong.status, 401);
    } finally {
      server.close();
    }
  });

  test(`naročnine s cenami ${old.slug}_… se še prepoznajo`, async () => {
    const { planByKey } = await import("../server/accounts/plans.js");
    assert.equal(planByKey(`${old.slug}_1_month`)?.key, `${BRAND.slug}_1_month`);
    assert.equal(planByKey(`${BRAND.slug}_2_year`)?.seats, 2);
    assert.equal(planByKey("drugo"), null);
  });

  test(`zagonske datoteke z oznako ${old.env}-SAMOPOSODOBITEV se še posodobijo`, async () => {
    const { planChanges } = await import("../scripts/posodobitev.js");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ime-"));
    fs.writeFileSync(path.join(dir, "zagon-windows.bat"), `rem ${old.env}-SAMOPOSODOBITEV\r\nstara`);
    const plan = planChanges(dir, new Map([["zagon-windows.bat", Buffer.from("nova")]]), []);
    assert.deepEqual(plan.write, ["zagon-windows.bat"]);
    assert.deepEqual(plan.skipped, []);
    fs.rmSync(dir, { recursive: true, force: true });
  });
}
