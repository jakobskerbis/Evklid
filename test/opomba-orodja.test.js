// Skrit zapis v zgodovini, kaj je orodje za nastavitve res spremenilo (j, 17. 11. 2026: inštruktor je trdil,
// da barve ni shranil, ker zgodovina hrani samo besedilo odgovora).
import { test } from "node:test";
import assert from "node:assert/strict";
import { actionNote } from "../server/chat-settings.js";

test("opomba orodja: brez sprememb ni zapisa, s spremembami so vse naštete", () => {
  assert.equal(actionNote([]), null);
  assert.equal(actionNote(), null);
  const n = actionNote(["accent = green", "theme = dark"]);
  assert.match(n, /not shown to the student/);
  assert.match(n, /accent = green; theme = dark/);
});

// Koda sporočila je na zaslonu z malimi črkami (public/style.css .msg-code): #000O (24) se ne zamenja z #0000.
import { readFileSync } from "node:fs";
import { messageCode, parseMessageCode } from "../server/reports.js";
test("koda sporočila: male črke na zaslonu, iskanje deluje z obojimi", () => {
  assert.equal(messageCode(24), "#000O");
  assert.equal(parseMessageCode("#000o"), 24);
  assert.equal(parseMessageCode(messageCode(1234).toLowerCase()), 1234);
  assert.match(readFileSync(new URL("../public/style.css", import.meta.url), "utf8"), /\.msg-code \{[^}]*text-transform: lowercase/);
});
