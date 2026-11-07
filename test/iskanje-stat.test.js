// Iskanje po Učbeniku je javno (brez prijave) in preleti vse teme. Manjkajoča lekcija naj ne sproži izjeme
// v fs.statSync (iskalec 6: na main ~200 izjem na vsako iskanje).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { searchTextbook, lessonView } from "../server/textbook.js";

test("iskanje ne sproži izjeme za teme brez lekcije", () => {
  searchTextbook("ulomki"); // ogrevanje predpomnilnika lekcij
  const orig = fs.statSync;
  let calls = 0;
  let thrown = 0;
  fs.statSync = (...a) => {
    calls++;
    try {
      return orig(...a);
    } catch (e) {
      thrown++;
      throw e;
    }
  };
  try {
    assert.ok(searchTextbook("ulomki").length > 0);
    assert.deepEqual(searchTextbook("qqxqz"), [], "iskanje brez zadetkov preleti vse teme in vrne prazno");
  } finally {
    fs.statSync = orig;
  }
  assert.ok(calls > 0, "lekcije se še preverjajo (sprememba datoteke se pozna brez ponovnega zagona)");
  assert.equal(thrown, 0, "manjkajoča lekcija brez izjeme");
});

test("tema brez lekcije in tema z lekcijo se še vedno pravilno naložita", () => {
  assert.ok(lessonView("FIZ-OS-9/upor-in-ohmov-zakon").lesson);
  assert.equal(lessonView("FIZ-OS-9/ta-tema-ne-obstaja-xyz"), null);
});

test("lekcija, ki je ni mogoče prebrati (izgine med stat in branjem), je null, ne izjema", () => {
  const file = new URL("../content/lessons/FIZ-OS-9/upor-in-ohmov-zakon.md", import.meta.url);
  const before = fs.statSync(file);
  const orig = fs.readFileSync;
  fs.readFileSync = (f, ...a) => {
    if (String(f).endsWith("upor-in-ohmov-zakon.md")) throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
    return orig(f, ...a);
  };
  try {
    // Nov mtime prisili ponovno branje (predpomnilnik po mtime).
    fs.utimesSync(file, before.atime, new Date(before.mtimeMs + 1000));
    assert.equal(lessonView("FIZ-OS-9/upor-in-ohmov-zakon").lesson, null);
  } finally {
    fs.readFileSync = orig;
    // Prvotni čas spremembe nazaj: test ne sme pustiti »spremenjene« lekcije (predpomnilniki po mtime, make, rsync).
    fs.utimesSync(file, before.atimeMs / 1000, before.mtimeMs / 1000);
  }
  assert.ok(Math.abs(fs.statSync(file).mtimeMs - before.mtimeMs) < 1, "čas spremembe lekcije je po testu enak kot prej");
  assert.ok(lessonView("FIZ-OS-9/upor-in-ohmov-zakon").lesson, "po popravku branja se lekcija spet naloži");
});
