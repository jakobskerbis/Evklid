// Kalkulator kot cilj gumba v pogovoru (P1-9, del A; server/odpri.js findCalc, public/odpri.js, docs/odpri.md).
// Način iz besed poizvedbe; neznana ali dvoumna poizvedba → ni gumba (nikoli napačen način).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { findCalc, resolveOpen, parseOpenBlocks } from "../server/odpri.js";
import { stripMeta } from "../server/meta.js";

test("kalkulator: način iz besed, kot jih piše model", () => {
  const nacin = (q) => findCalc(q)?.mode;
  assert.equal(nacin("znanstveni"), "sci");
  assert.equal(nacin("računalo"), "sci");
  assert.equal(nacin("grafični"), "graph");
  assert.equal(nacin("odpri v grafičnem načinu"), "graph");
  assert.equal(nacin("pretvornik enot"), "tools");
  assert.equal(nacin("enote"), "tools");
  assert.equal(nacin("periodni sistem"), "pse");
  assert.equal(nacin("PSE"), "pse");
  assert.equal(nacin("zbirka formul"), "formulas");
  // Samo »kalkulator« → zadnji uporabljeni način (mode null), gumb »Kalkulator«.
  assert.deepEqual(findCalc("kalkulator"), { kind: "calc", id: "calc", mode: null });
});

test("kalkulator: neznana ali dvoumna poizvedba ne da gumba", () => {
  for (const q of ["Ohmov zakon", "sistem enačb", "graf formule", "znanstveni in grafični", "xyz"]) assert.equal(findCalc(q), null, q);
});

test("ODPRI kalkulator: gumb pod sporočilom, enak blok enkrat, blok učenec ne vidi", async () => {
  const besedilo = 'Izračunaj s kalkulatorjem.\n<<ODPRI kalkulator="znanstveni">> <<ODPRI kalkulator="znanstveni">> <<ODPRI računalo="grafični">>';
  assert.deepEqual(parseOpenBlocks(besedilo).map((b) => b.kind), ["calc", "calc", "calc"]);
  const r = await resolveOpen(besedilo, {});
  assert.deepEqual(r.map((x) => x.mode), ["sci", "graph"]);
  assert.deepEqual(await resolveOpen('<<ODPRI kalkulator="Ohmov zakon">>', {}), []);
  assert.doesNotMatch(stripMeta(besedilo), /ODPRI|kalkulator=/);
});

test("odjemalec: gumb s kalkulatorjem odpre kalkulator v načinu; imena načinov obstajajo v 6 živih jezikih", () => {
  const odpri = fs.readFileSync(new URL("../public/odpri.js", import.meta.url), "utf8");
  assert.match(odpri, /calc: \["calculator", "nav\.graph"\]/);
  assert.match(odpri, /if \(x\.kind === "calc"\) return D\.openCalc\(/);
  const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  const vrstica = app.split("\n").find((l) => /^\s*openCalc: \(mode\) =>/.test(l)) || "";
  assert.ok(vrstica.includes('openFromTutor({ view: "graph", mode })'), vrstica);
  const sl = fs.readFileSync(new URL("../public/i18n/sl.js", import.meta.url), "utf8");
  const kljuci = ["nav.graph", "sc.modeSci", "sc.modeGraph", "sc.toolsMode", "sc.pseMode", "sc.formMode"];
  for (const k of kljuci) assert.match(sl, new RegExp(`"${k.replace(".", "\\.")}": "`), k);
  for (const l of ["en", "de", "hr", "it", "hu"]) {
    const j = JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${l}.json`, import.meta.url), "utf8"));
    for (const k of kljuci) assert.ok(j[k], `${l} ${k}`);
  }
});
