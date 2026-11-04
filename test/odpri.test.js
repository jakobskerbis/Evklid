// Inštruktor odpre orodja aplikacije (server/odpri.js, public/odpri.js, docs/odpri.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseOpenBlocks, parseSet, parseSketch, resolveOpen } from "../server/odpri.js";
import { stripMeta, createStreamFilter } from "../server/meta.js";
import { buildSystemPrompt, SPLIT_MARKER } from "../server/prompt.js";
import { normalizeSettings } from "../server/settings.js";

const FIZ8 = { subject: "FIZ", curriculum_level: "8. razred", school_system: "SI" };
const MAT9 = { subject: "MAT", curriculum_level: "9. razred", school_system: "SI" };

test("parse: ODPRI, GRAF and SKICA blocks in order; bad ones are skipped", () => {
  const b = parseOpenBlocks('Besedilo.\n<<ODPRI poskus="prosti pad" nastavi="višina=20; masa=2,5">>\n<<GRAF ["y = a*x^2", "a = 1"]>>\n<<ODPRI neznano="x">>\n<<GRAF nič>>\n<<SKICA {"tocke":{"A":[0,0],"B":[3,0]},"daljice":[["A","B","c"]]}>>');
  assert.deepEqual(b.map((x) => x.kind), ["sim", "graph", "sketch"]);
  assert.deepEqual(b[0].set, { višina: 20, masa: 2.5 });
  assert.deepEqual(b[1].exprs, ["y = a*x^2", "a = 1"]);
  assert.equal(parseSet("ni vrednosti"), undefined);
  // Skica brez črt ali s točkami, ki ne obstajajo, se ne pokaže.
  assert.equal(parseSketch('{"tocke":{"A":[0,0]}}'), null);
  assert.equal(parseSketch('{"tocke":{"A":[0,0]},"daljice":[["A","Z"]]}'), null);
  assert.equal(parseSketch("{pokvarjeno"), null);
});

test("resolve: words find the right experiment, 3D model, atlas structure, lesson, game and formula", async () => {
  const one = async (block, st = FIZ8) => (await resolveOpen(block, st))[0];
  const pad = await one('<<ODPRI poskus="prosti pad" nastavi="višina=20">>');
  assert.equal(pad.kind, "sim");
  assert.equal(pad.id, "prosti-pad");
  assert.deepEqual(pad.set, { višina: 20 });
  const ohm = await one('<<ODPRI poskus="Ohmov zakon">>');
  assert.match(ohm.title, /Ohm/); // ne »Odbojni zakon« (samo beseda »zakon«)
  assert.deepEqual(await one('<<ODPRI 3d="srce" del="levi prekat">>'), { kind: "3d", id: "organ-srce", title: "Srce", del: "levi prekat" });
  const femur = await one('<<ODPRI 3d="stegnenica">>');
  assert.equal(femur.id, "atlas");
  assert.equal(femur.izberi, "Femur");
  assert.equal((await one('<<ODPRI ucbenik="gostota">>')).id, "FIZ-OS-8/gostota");
  assert.equal((await one('<<ODPRI igra="gostota">>')).kind, "game");
  const f = await one('<<ODPRI formula="Pitagorov izrek">>', MAT9);
  assert.equal(f.kind, "formula");
  assert.match(f.tex, /c\^2/);
  // Nič pravega: brez gumba (nikoli napačen gumb).
  assert.deepEqual(await resolveOpen('<<ODPRI poskus="zmajev let po galaksiji">>', FIZ8), []);
});

test("resolve: locked experiment has no preset values; at most 4 tools, no duplicates", async () => {
  const [locked] = await resolveOpen('<<ODPRI poskus="prosti pad" nastavi="višina=20">>', FIZ8, { canOpen: () => false });
  assert.equal(locked.locked, true);
  assert.equal(locked.set, undefined);
  const many = await resolveOpen(['<<ODPRI ucbenik="gostota">>', '<<ODPRI ucbenik="gostota">>', '<<GRAF ["y = x"]>>', '<<GRAF ["y = 2x"]>>', '<<GRAF ["y = 3x"]>>', '<<GRAF ["y = 4x"]>>'].join("\n"), FIZ8);
  assert.equal(many.length, 4);
  assert.equal(many.filter((x) => x.kind === "lesson").length, 1);
});

test("the student never sees the blocks (stripMeta and streaming)", () => {
  const raw = 'Poglej poskus.\n<<ODPRI poskus="prosti pad">>\n<<GRAF ["y = x^2"]>>\n<<META subject=FIZ topic="prosti pad" error=0 mode=A flag=none done=0>>';
  assert.equal(stripMeta(raw), "Poglej poskus.");
  assert.equal(stripMeta("Besedilo\n<<SKICA {\"tocke\":"), "Besedilo"); // odrezan blok
  const f = createStreamFilter();
  let out = "";
  for (const ch of raw.match(/.{1,3}/gs)) out += f.push(ch);
  out += f.end().rest;
  assert.equal(out.trim(), "Poglej poskus.");
});

test("prompt: the tools section is in the cached part, before Analitika", () => {
  const [stat] = buildSystemPrompt({ settings: normalizeSettings({}) }).split(SPLIT_MARKER);
  const i = (x) => stat.indexOf(x);
  assert.ok(i("## Orodja aplikacije (strojni blok)") > i("## Gumbi z izbirami (strojni blok)"));
  assert.ok(i("## Orodja aplikacije (strojni blok)") < i("## Analitika"));
  for (const k of ["<<ODPRI poskus=", "<<GRAF [", "<<SKICA {", "v slovenščini"]) assert.ok(stat.includes(k), k);
});
