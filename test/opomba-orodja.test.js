// Skrit zapis v zgodovini, kaj je orodje za nastavitve res spremenilo (j, 17. 11. 2026: inštruktor je trdil,
// da barve ni shranil, ker zgodovina hrani samo besedilo odgovora).
import { test } from "node:test";
import assert from "node:assert/strict";
import { actionNote } from "../server/chat-settings.js";
import { isHiddenNote } from "../server/skrite-opombe.js";
import { stripMeta } from "../server/meta.js";
import { isPreamble } from "../server/claude.js";

test("opomba orodja: brez sprememb ni zapisa, s spremembami so vse naštete", () => {
  assert.equal(actionNote([]), null);
  assert.equal(actionNote(), null);
  const n = actionNote(["accent = green", "theme = dark"]);
  assert.match(n, /not shown to the student/);
  assert.match(n, /accent = green; theme = dark/);
  assert.ok(isHiddenNote(n), "skrita opomba: povzetek in preverjanja je ne berejo kot besedilo inštruktorja");
  assert.equal(stripMeta(`Tema je temna.\n${n}`).trim(), "Tema je temna.", "če jo model ponovi, je učenec ne vidi");
});

test("besedilo pred orodjem: kratek uvod se umakne, razlaga ostane", () => {
  assert.ok(isPreamble("Želi zeleno barvo. Najbolj smiselno je spremeniti poudarno barvo (accent)."));
  assert.ok(!isPreamble("Najprej izračunajmo: $x = 2$."), "formula");
  assert.ok(!isPreamble("Prvi odstavek razlage.\n\nDrugi odstavek."), "odstavki");
  assert.ok(!isPreamble("x".repeat(301)), "dolgo");
});

// Koda sporočila: črka O je na zaslonu mala (public/app.js addMsgFoot), da se #000O (24) ne zamenja z #0000.
import { readFileSync } from "node:fs";
import { messageCode, parseMessageCode } from "../server/reports.js";
test("koda sporočila: mala črka o na zaslonu, iskanje deluje z obojimi", () => {
  assert.equal(messageCode(24), "#000O");
  assert.equal(parseMessageCode("#000o"), 24);
  assert.equal(parseMessageCode(messageCode(1234).toLowerCase()), 1234);
  assert.match(readFileSync(new URL("../public/app.js", import.meta.url), "utf8"), /tag\.textContent = String\(code \|\| ""\)\.replace\(\/O\/g, "o"\)/);
});
