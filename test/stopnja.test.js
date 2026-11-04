// Ena stopnja v kodi (j 2026-11-01): vsa preverjanja OŠ / SŠ / faks gredo prek public/stopnja.js.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { stopnja, jeFaks, jeSs, jeOs, rang, visja, stopnjaPoti, stageCode, imaStopnjo, STOPNJE } from "../public/stopnja.js";

test("stopnja: iz educational_track, iz profila ali nastavitev, sicer iz curriculum_level", () => {
  assert.equal(stopnja({ educational_track: "OSNOVNA_SOLA" }), "OS");
  assert.equal(stopnja({ educational_track: "SREDNJA_SOLA" }), "SS");
  assert.equal(stopnja({ educational_track: "UNIVERZA" }), "FAKS");
  assert.equal(stopnja({ settings: { educational_track: "UNIVERZA" } }), "FAKS", "cel profil");
  assert.equal(stopnja({ curriculum_level: "2. letnik VR" }), "SS", "brez educational_track");
  assert.equal(stopnja({ curriculum_level: "8. razred" }), "OS");
  assert.equal(stopnja(null), "OS");
  assert.equal(stopnja(undefined), "OS");
  assert.ok(jeFaks({ educational_track: "UNIVERZA" }) && jeSs({ educational_track: "SREDNJA_SOLA" }) && jeOs({}));
  assert.ok(imaStopnjo({ educational_track: "SREDNJA_SOLA" }) && !imaStopnjo({ educational_track: "" }));
  assert.deepEqual(STOPNJE.map(rang), [0, 1, 2]);
  assert.equal(visja("OS", "FAKS"), "FAKS");
  assert.equal(stopnjaPoti("MAT-SS-2"), "SS");
  assert.equal(stopnjaPoti("UNI-ULFKKT-MAT"), "FAKS");
  assert.equal(stopnjaPoti("MAT-OS-8"), "OS");
  assert.equal(stopnjaPoti("MAT-TEK-OS"), "OS");
  assert.equal(stageCode({ educational_track: "UNIVERZA" }), "UNI", "oznaka lig ostane");
});

// Neposredno primerjanje educational_track (z besedilom, z drugo stopnjo, kot ključ slovarja ali v
// seznamu) je dovoljeno samo v public/stopnja.js. Novo preverjanje naj uporabi stopnja() / jeFaks() …
const ALLOW = new Set(["public/stopnja.js"]);
const SKIP = /university-extra\.js$|university-data\.js$|curriculum-data\.js$|exam-data.*\.js$|\/vendor\//;
const RULES = [
  [/educational_track\s*[!=]==?\s*["'`]/, "primerjava z besedilom"],
  [/["'`]\s*[!=]==?\s*[\w$.?]*educational_track\b/, "primerjava z besedilom"],
  [/educational_track\s*[!=]==?\s*[\w$.?]*educational_track\b/, "primerjava dveh stopenj"],
  [/[\w$\])}]\[[\w$.?]*educational_track\]/, "slovar po educational_track"],
  [/\]\.includes\([\w$.?]*educational_track\)/, "seznam stopenj"],
  [/switch\s*\([\w$.?]*educational_track\)/, "switch po stopnji"],
  [/\$\.educational_track/, "SQL po stopnji (uporabi stageCodeSql)"],
];

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "node_modules" ? [] : files(p);
    return /\.(m?js|cjs)$/.test(e.name) ? [p] : [];
  });
}

test("stopnja: nobenega preverjanja educational_track mimo public/stopnja.js (server/, public/)", () => {
  const root = path.resolve(import.meta.dirname, "..");
  const bad = [];
  for (const abs of [...files(path.join(root, "server")), ...files(path.join(root, "public"))]) {
    const rel = path.relative(root, abs).split(path.sep).join("/");
    if (ALLOW.has(rel) || SKIP.test(rel)) continue;
    fs.readFileSync(abs, "utf8")
      .split("\n")
      .forEach((line, i) => {
        for (const [re, why] of RULES) if (re.test(line)) bad.push(`${rel}:${i + 1} ${why}: ${line.trim().slice(0, 120)}`);
      });
  }
  assert.deepEqual(bad, [], `Uporabi stopnja()/jeFaks()/jeSs()/jeOs() iz public/stopnja.js:\n${bad.join("\n")}`);
});

test("stopnja: pravilo ujame novo neposredno preverjanje", () => {
  const caught = (line) => RULES.some(([re]) => re.test(line));
  assert.ok(caught('if (s.educational_track === "UNIVERZA") x();'));
  assert.ok(caught('const a = settings?.educational_track !== "SREDNJA_SOLA";'));
  assert.ok(caught("const m = { UNIVERZA: 1 }[st.educational_track];"));
  assert.ok(caught('["SREDNJA_SOLA", "UNIVERZA"].includes(s.educational_track)'));
  assert.ok(!caught("if (jeFaks(s)) x();"));
  assert.ok(!caught("if (changes.educational_track !== undefined) {"), "preverjanje, ali je polje podano, ni preverjanje stopnje");
});
