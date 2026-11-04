// Spodnja vrstica v lekciji Učbenika (j 2026-11-04): »naj se noga v učbeniku odpre, ko drsenje udari v zgornji ali
// spodnji del«. Preizkus s pravim potegom na telefonu je bil narejen v brskalniku; tu varujemo, da logika ostane.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");

test("drsenje lekcije, ki udari v vrh ali dno, pokaže spodnjo vrstico", () => {
  const i = app.indexOf('document.addEventListener("scroll"');
  assert.ok(i > 0, "poslušalec drsenja obstaja");
  const body = app.slice(i, app.indexOf("}, { capture: true", i));
  assert.match(body, /view-textbook/, "velja za pogled Učbenika");
  assert.match(body, /lessonEdge\(/, "rob se meri kot pri potegu (samo v odprti lekciji)");
  assert.match(body, /edge\.top/);
  assert.match(body, /edge\.bottom/);
  assert.match(body, /peekBar\(true\)/, "vrstico samo pokaže, nikoli ne skrije");
  assert.match(body, /userScrollAt/, "šteje samo drsenje uporabnika, ne programskega skoka na vrh");
  // Dotik gumba (npr. Naprej, ki prestavi korak na vrh) ni drsenje.
  assert.match(app, /addEventListener\("click", \(\) => \{ userScrollAt = 0; \}, true\)/);
});
