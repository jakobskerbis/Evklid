// Inštruktor odpre orodja aplikacije (server/odpri.js, public/odpri.js, docs/odpri.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseOpenBlocks, parseSet, parseSketch, resolveOpen, _test } from "../server/odpri.js";
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
  // skupine delov (public/3d/skupine.js): ime skupine → vsi deli hkrati; ime dela ima prednost
  assert.equal((await one('<<ODPRI 3d="srce" del="zaklopke">>')).del, "skupina-zaklopke");
  assert.equal((await one('<<ODPRI 3d="srce" del="srčne zaklopke">>')).del, "skupina-zaklopke");
  assert.equal((await one('<<ODPRI 3d="srce" del="preddvora">>')).del, "skupina-preddvora");
  assert.equal((await one('<<ODPRI 3d="srce" del="velike žile">>')).del, "skupina-velike-zile");
  assert.equal((await one('<<ODPRI 3d="srce" del="valves">>')).del, "skupina-zaklopke"); // ime v drugem jeziku
  assert.equal((await one('<<ODPRI 3d="srce" del="pljučne vene">>')).del, "pljučne vene");
  const femur = await one('<<ODPRI 3d="stegnenica">>');
  assert.equal(femur.id, "atlas");
  assert.match(femur.izberi, /^Femur\.[lr]$/); // id vrstice v atlasu (parna kost), ne ime
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

test("resolve: lesson and game need most query words in the title (no near misses)", async () => {
  const MAT7 = { subject: "MAT", curriculum_level: "7. razred", school_system: "SI" };
  assert.deepEqual(await resolveOpen('<<ODPRI ucbenik="kvadratna funkcija">>', MAT9), []); // ne »Linearna funkcija«
  assert.deepEqual(await resolveOpen('<<ODPRI ucbenik="periodni sistem">>', MAT9), []); // ne »Koordinatni sistem …«
  assert.deepEqual(await resolveOpen('<<ODPRI igra="Pitagorov izrek">>', FIZ8), []); // ne igra o silah
  assert.equal((await resolveOpen('<<ODPRI igra="Pitagorov izrek">>', MAT9))[0]?.title, "Pitagorov izrek");
  assert.equal((await resolveOpen('<<ODPRI igra="ulomki">>', MAT7))[0]?.kind, "game");
  assert.equal(stripMeta('Poglej.\n`<<ODPRI 3d="srce">>`\nNaprej.'), "Poglej.\n\nNaprej.");
});

test("server: open list with done and on reload, never when flag is not none", async () => {
  const { openDb } = await import("../server/db.js");
  const { createApp } = await import("../server/app.js");
  const store = openDb(":memory:");
  let next = "";
  const streamFn = async ({ onText }) => {
    onText(next);
    return { content: [{ type: "text", text: next }], text: next, stopReason: "end_turn" };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, body) => {
    const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return (res.headers.get("content-type") || "").includes("json") ? res.json() : res.text();
  };
  const doneOf = (sse) => JSON.parse(/event: done\ndata: (.*)/.exec(sse)[1]);
  const reply = (flag) => `Poglej graf.\n<<GRAF ["y = a*x", "a = 2"]>>\n<<META subject=MAT topic="funkcije" error=0 mode=A flag=${flag} done=0>>`;
  try {
    const s = await call("/api/students", { name: "Ana" });
    const c = await call(`/api/students/${s.id}/conversations`, {});
    next = reply("none");
    const d1 = doneOf(await call(`/api/conversations/${c.id}/messages`, { text: "graf" }));
    assert.deepEqual(d1.open, [{ kind: "graph", exprs: ["y = a*x", "a = 2"] }]);
    assert.ok(!/GRAF/.test(d1.text));
    next = reply("offtopic");
    assert.equal(doneOf(await call(`/api/conversations/${c.id}/messages`, { text: "nekaj drugega" })).open, undefined);
    const conv = await call(`/api/conversations/${c.id}`);
    const asst = conv.messages.filter((m) => m.role === "assistant");
    assert.deepEqual(asst.map((m) => !!m.open), [true, false], "ob ponovnem odprtju enako kot ob pošiljanju");
  } finally {
    server.close();
  }
});

test("ODPRI 3d: ime posameznega dela celice ali virusa ostane del (ne postane skupina)", async () => {
  const { SKUPINE } = await import("../public/3d/skupine.js");
  const fsm = await import("node:fs");
  const mapa = new URL("../public/3d/modeli/celice/", import.meta.url);
  const { delAliSkupina } = _test;
  assert.equal(delAliSkupina("celica-zivalska", "jedro"), "jedro");
  assert.equal(delAliSkupina("celica-zivalska", "membrana"), "membrana");
  assert.equal(delAliSkupina("celica-zivalska", "organeli"), "skupina-organeli");
  assert.equal(delAliSkupina("organ-srce", "prekat"), "skupina-prekata");
  assert.equal(delAliSkupina("organ-srce", "levi prekat"), "levi prekat");
  // vsak član vsake skupine: id in ime dela ostaneta del
  for (const [model, skupine] of Object.entries(SKUPINE)) {
    let imena;
    const o = /^organ-(.+)$/.exec(model);
    if (o) imena = JSON.parse(fsm.readFileSync(new URL(`../public/3d/modeli/organi-3d/${o[1]}.json`, import.meta.url), "utf8")).deli.map((d) => [d.id, d.ime]);
    else {
      const f = fsm.readdirSync(mapa).find((x) => new RegExp(`export const info = \\{\\s*id: "${model}"`).test(fsm.readFileSync(new URL(x, mapa), "utf8")));
      const src = fsm.readFileSync(new URL(f, mapa), "utf8");
      imena = [...src.matchAll(/del\("([a-z0-9-]+)", "([^"]+)"/g), ...src.matchAll(/\{ id: "([a-z0-9-]+)", ime: "([^"]+)"/g)].map((x) => [x[1], x[2]]);
    }
    const clani = new Set(skupine.flatMap((g) => g.deli));
    for (const [id, ime] of imena.filter(([id]) => clani.has(id))) {
      for (const q of [id, ime]) assert.doesNotMatch(String(delAliSkupina(model, q)), /^skupina-/, `${model}: ${q}`);
    }
  }
});
