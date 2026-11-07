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
    assert.ok(searchTextbook("zz").length >= 0);
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
