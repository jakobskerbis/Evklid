// Sklopi kartic za ponavljanje in izbor kartic za vajo (public/kartice-sklopi.js, brez DOM).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cardSets, sessionCards, setKey, OWN, OTHER } from "../public/kartice-sklopi.js";

const cards = [
  { id: 1, topic: "Gostota", source: "tutor", is_due: true },
  { id: 2, topic: "Ohmov zakon", source: "tutor", is_due: false },
  { id: 3, topic: "Gostota", source: "tutor", is_due: false },
  { id: 4, topic: null, source: "tutor", is_due: true },
  { id: 5, topic: "Gostota", source: "own", is_due: true },
  { id: 6, topic: "Ohmov zakon", source: "tutor", is_due: true },
  { id: 7, topic: "  ", source: "tutor", is_due: false },
];

test("kartice: sklopi po temah, lastne in brez teme posebej, največ na vrsti najprej", () => {
  const sets = cardSets(cards);
  assert.deepEqual(sets.map((s) => s.key), ["Gostota", "Ohmov zakon", OTHER, OWN]);
  const g = sets[0];
  assert.deepEqual([g.ids, g.total, g.due, g.kind], [[1, 3], 2, 1, "topic"]);
  assert.deepEqual(sets[2].ids, [4, 7], "brez teme → Splošno");
  assert.equal(sets[3].kind, "own");
  assert.equal(setKey(cards[4]), OWN, "lastna kartica je v lastnem sklopu, tudi če ima temo");
  // več kartic na vrsti → prej
  const more = cardSets([...cards, { id: 8, topic: "Ohmov zakon", source: "tutor", is_due: true }]);
  assert.equal(more[0].key, "Ohmov zakon");
  assert.deepEqual(cardSets([]), []);
});

test("kartice: vaja vzame kartice na vrsti, brez njih vse kartice sklopa brez spremembe razporeda", () => {
  assert.deepEqual(sessionCards(cards), { ids: [1, 4, 5, 6], practice: false });
  assert.deepEqual(sessionCards(cards, "Gostota"), { ids: [1], practice: false });
  assert.deepEqual(sessionCards(cards, OWN), { ids: [5], practice: false });
  assert.deepEqual(sessionCards(cards, "Ohmov zakon", { practice: true }), { ids: [2, 6], practice: true });
  assert.deepEqual(sessionCards(cards, "Ni teme"), { ids: [], practice: false });
});

test("kartice: odgovor je na hrbtu kartice, ki se obrne, in je skrit do obrata (tudi na seznamu)", () => {
  const js = readFileSync(new URL("../public/flashcards.js", import.meta.url), "utf8");
  const css = readFileSync(new URL("../public/style.css", import.meta.url), "utf8");
  assert.match(js, /class="fc-face fc-face-back" aria-hidden="true"/);
  assert.match(js, /class="fc-a muted" dir="auto" hidden>/);
  assert.match(js, /fc-grade fc-wait" inert/, "ocena šele po obratu");
  assert.match(css, /\.fc-flip\.flipped \.fc-inner \{ transform: rotateY\(180deg\)/);
  assert.match(css, /\.fc-flip:not\(\.flipped\) \.fc-face-back, \.fc-flip\.flipped \.fc-face-front \{ visibility: hidden; \}/);
  // med vajo je na zaslonu samo ena kartica: pregled (seznam, sklopi, obrazec) se ne izriše
  const practice = js.slice(js.indexOf("function renderPractice"), js.indexOf("function flip"));
  assert.doesNotMatch(practice, /fc-list|fc-set-grid|fc-add/);
});
