// Telo odgovora napake se zavrže (public/odgovor.js): neprebrano telo odgovora z »no-store« Chrome drži odprto
// (zahteva »pending«, stran ne doseže »networkidle«). Iskalec 9, 7. 11.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { jsonAliNic, zavrzi } from "../public/odgovor.js";

const pub = path.join(path.dirname(fileURLToPath(import.meta.url)), "../public");

test("jsonAliNic: uspeh vrne JSON, napaka zavrže telo in vrne privzeto", async () => {
  const ok = new Response('{"a":1}', { status: 200 });
  assert.deepEqual(await jsonAliNic(ok), { a: 1 });
  for (const privzeto of [null, {}]) {
    const r = new Response('{"error":"x"}', { status: 404 });
    assert.equal(jsonAliNic(r, privzeto), privzeto);
    const { done } = await r.body.getReader().read(); // preklican tok je prazen
    assert.equal(done, true, "telo napake je zavrženo");
  }
  zavrzi(null); // brez napake
  const prebran = new Response("x", { status: 500 });
  await prebran.text();
  zavrzi(prebran); // že prebrano telo: brez napake
});

test("v public/ ni več »r.ok ? r.json() : …« (telo napake bi ostalo neprebrano)", () => {
  const najdbe = [];
  // 3d/atlas.js: spreminja ga veja claude/srce-teksture (popravi po njeni združitvi).
  const izpusti = new Set([path.join("3d", "atlas.js")]);
  const hodi = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      const rel = path.relative(pub, p);
      if (e.isDirectory()) {
        if (!["vendor", "i18n", path.join("3d", "modeli")].includes(rel)) hodi(p);
      } else if (e.name.endsWith(".js") && !izpusti.has(rel)) {
        const vrstice = fs.readFileSync(p, "utf8").split("\n");
        vrstice.forEach((l, i) => {
          // »r.ok ? r.json() : …« in »res.ok ? await res.json()… : …« (pregled #524 A: oblika z await)
          if (/\.ok \? (await )?\w+\.json\(\)/.test(l) && !/zavrzi\(/.test(l)) najdbe.push(`${rel}:${i + 1}`);
          // »if (!r.ok) return …« tik za fetch() brez zavrzi(r), razen če je telo že prebrano (rezultati poskusov v sim/ niso Response)
          else if (/if \(!\w+\.ok\) return(?! zavrzi)/.test(l)) {
            const prej = vrstice.slice(Math.max(0, i - 3), i).join("\n");
            if (/fetch\(/.test(prej) && !/\.(json|text)\(/.test(prej)) najdbe.push(`${rel}:${i + 1}`);
          }
        });
      }
    }
  };
  hodi(pub);
  assert.deepEqual(najdbe, []);
});

test("napake na poteh /api zavržejo telo (gradiva, lige, učitelj, števec porabe, prevodi)", () => {
  const src = (f) => fs.readFileSync(path.join(pub, f), "utf8");
  assert.match(src("gradiva.js"), /if \(!r\.ok\) return zavrzi\(r\), "";/);
  assert.match(src("leagues.js"), /if \(!r\.ok\) return zavrzi\(r\), toast\(/);
  assert.match(src("ucitelj.js"), /if \(!r\.ok\) return zavrzi\(r\), toast\(/);
  assert.match(src("usage-meter.js"), /: \(zavrzi\(res\), null\)/);
  assert.match(src("i18n.js"), /if \(!res\.ok\) return zavrzi\(res\), null;/);
});
