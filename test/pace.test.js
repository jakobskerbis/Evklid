import { test } from "node:test";
import assert from "node:assert/strict";
import { nextChunk, chunkDelay, createPacer, PACES } from "../public/pace.js";

function reveal(text) {
  const out = [];
  let pos = 0;
  for (;;) {
    const c = nextChunk(text, pos, true);
    if (!c) break;
    out.push({ s: text.slice(pos, c.end), pause: c.pause });
    pos = c.end;
  }
  return out;
}

test("besedilo se razdeli na besede, formula ostane cela", () => {
  const parts = reveal("Velja $a^2 + b^2 = c^2$. Kaj je c?");
  assert.deepEqual(parts.map((p) => p.s), ["Velja", " $a^2 + b^2 = c^2$.", " Kaj", " je", " c?"]);
  assert.equal(parts[1].pause, "sentence");
  assert.equal(parts[4].pause, "sentence");
});

test("nedokončana formula ali beseda med pretakanjem počaka", () => {
  assert.equal(nextChunk("Velja $a^2 +", 5, false), null);
  assert.equal(nextChunk("Velja", 0, false), null);
  assert.deepEqual(nextChunk("Velja ", 0, false), { end: 5, pause: "none" });
});

test("prazna vrstica pomeni premor odstavka", () => {
  const parts = reveal("Prvo.\n\nDrugo");
  assert.equal(parts[1].pause, "para");
});

test("počasnejši tempo pomeni daljši zamik", () => {
  assert.ok(chunkDelay(PACES.pocasi, 6, "sentence") > chunkDelay(PACES.hitro, 6, "sentence"));
  assert.equal(chunkDelay(PACES.takoj, 6, "sentence"), 0);
});

test("pacer izpiše vse, skip pokaže takoj", async () => {
  const timers = [];
  let painted = "";
  const p = createPacer(PACES.pocasi, (t) => (painted = t), { setTimer: (f) => timers.push(f), clearTimer: () => {} });
  p.push("Ena dva ");
  assert.equal(painted, "Ena");
  timers.shift()();
  assert.equal(painted, "Ena dva");
  p.push("tri.");
  p.finish("Ena dva tri.");
  p.skip();
  assert.equal(painted, "Ena dva tri.");
  await p.done;
});
