import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { PROGRAMS, UNI_PATHS } from "../server/university-data.js";
import { loadReferences, reloadReferences, referencesFor, programReferences, referenceStats, REF_TYPES, REFERENCES_DIR } from "../server/references.js";

const data = loadReferences();
const programCourses = [...new Set(Object.values(PROGRAMS).flatMap((p) => [...p.courseKeys.flat(), ...p.electiveKeys]))];
const allItems = [
  ...Object.values(data.themes).flatMap((t) => t.items.map((it) => [t.id, it])),
  ...Object.entries(data.courseItems).flatMap(([k, items]) => items.map((it) => [k, it])),
];

// Gostitelji, ki niso zakonit vir (piratske knjižnice, naloženi tuji dokumenti).
const BANNED = /(libgen|z-lib|zlibrary|annas-archive|sci-hub|scribd\.com|studocu|coursehero|docplayer|pdfcoffee|dokumen\.pub|vdoc\.pub|epdf\.pub|drive\.google|dropbox\.com)/i;
const LICENSE = /^(CC0( 1\.0)?|CC BY(-SA|-NC|-ND|-NC-SA|-NC-ND)?( [1-4]\.[05]( [A-Z]{2,3})?)?|javna domena|prost dostop|GNU FDL( 1\.[23])?|GNU GPL( [23])?|BSD|MIT|Apache 2\.0|PostgreSQL License)$/;

test("reference data: every item has the required fields, a valid type, language and licence", () => {
  assert.ok(allItems.length >= 200, `samo ${allItems.length} virov`);
  for (const [where, it] of allItems) {
    const at = `${where}: ${it.title}`;
    for (const f of ["title", "url", "source", "lang", "type", "desc", "license"]) assert.ok(typeof it[f] === "string" && it[f].trim(), `${at}: manjka ${f}`);
    assert.ok(REF_TYPES.includes(it.type), `${at}: vrsta ${it.type}`);
    assert.match(it.lang, /^[a-z]{2,3}$/, `${at}: jezik ${it.lang}`);
    assert.match(it.license, LICENSE, `${at}: licenca »${it.license}«`);
    assert.ok(it.desc.length <= 220, `${at}: opis je predolg`);
    const u = new URL(it.url);
    assert.equal(u.protocol, "https:", `${at}: samo https`);
    assert.ok(!BANNED.test(u.hostname), `${at}: nedovoljen vir ${u.hostname}`);
  }
});

test("reference data: themes have 3–8 distinct sources and ids with a group prefix", () => {
  for (const t of Object.values(data.themes)) {
    assert.match(t.id, /^(mat|rac|fiz|kem|bio|geo|eko)-[a-z0-9-]+$/, t.id);
    assert.ok(t.title?.trim(), `${t.id}: brez naslova`);
    assert.ok(t.items.length >= 3 && t.items.length <= 8, `${t.id}: ${t.items.length} virov`);
    assert.equal(new Set(t.items.map((i) => i.url)).size, t.items.length, `${t.id}: podvojena povezava`);
  }
});

test("reference data: every course of every study programme has sources; mappings point to existing themes", () => {
  for (const [k, ids] of Object.entries(data.courses)) {
    assert.ok(UNI_PATHS[k], `neznan predmet ${k}`);
    assert.ok(ids.length >= 1 && ids.length <= 4, `${k}: ${ids.length} tem`);
    for (const id of ids) assert.ok(data.themes[id], `${k}: neznana tema ${id}`);
  }
  for (const k of Object.keys(data.courseItems)) assert.ok(UNI_PATHS[k], `courseItems: neznan predmet ${k}`);
  const missing = programCourses.filter((k) => referencesFor(k).length < 3);
  assert.deepEqual(missing, [], "predmeti z manj kot 3 viri");
});

test("reference data: Slovenian sources are included", () => {
  const s = referenceStats();
  assert.ok(s.slovenian >= 30, `samo ${s.slovenian} slovenskih virov`);
  const withSl = Object.values(data.themes).filter((t) => t.items.some((i) => i.lang === "sl")).length;
  assert.ok(withSl / Object.keys(data.themes).length >= 0.3, `slovenski vir ima samo ${withSl} tem`);
});

test("referencesFor: faculty material first, no duplicate links across themes", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "refs-"));
  const item = (n, extra = {}) => ({ title: `Vir ${n}`, url: `https://example.org/${n}`, source: "Zgled", lang: "en", type: "ucbenik", desc: "Opis.", license: "CC BY 4.0", ...extra });
  fs.writeFileSync(
    path.join(dir, "a.json"),
    JSON.stringify({
      themes: { "mat-a": { title: "A", items: [item(1), item(2), item(3)] }, "mat-b": { title: "B", items: [item(3), item(4), item(5, { lang: "sl" })] } },
      courses: { "UNI-ULFKKT-MAT": ["mat-a", "mat-b"] },
      courseItems: { "UNI-ULFKKT-MAT": [item("skripta", { type: "zapiski", lang: "sl" })] },
    }),
  );
  try {
    reloadReferences(dir);
    const r = referencesFor("UNI-ULFKKT-MAT");
    assert.deepEqual(r.map((i) => i.title), ["Vir skripta", "Vir 1", "Vir 2", "Vir 3", "Vir 4", "Vir 5"]);
    assert.equal(r[0].theme, null, "gradivo fakultete nima teme");
    assert.equal(r[3].theme, "A");
    assert.equal(r[5].theme, "B");
    assert.deepEqual(referencesFor("UNI-NEOBSTAJA-X"), []);
    const prog = programReferences("UL-FKKT-KEM");
    const mat = prog.courses.find((c) => c.key === "UNI-ULFKKT-MAT");
    assert.equal(mat.group, "1. letnik");
    assert.deepEqual(mat.themes, ["A", "B"]);
    assert.equal(programReferences("NI-TAKEGA"), null);
    fs.writeFileSync(path.join(dir, "b.json"), JSON.stringify({ themes: { "mat-a": { title: "A2", items: [] } } }));
    assert.throws(() => loadReferences(dir), /mat-a/);
  } finally {
    reloadReferences(REFERENCES_DIR);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("API: /api/references for a programme and a course", async () => {
  const db = openDb(":memory:");
  const app = createApp(db, { streamFn: async () => ({ content: [], text: "", stopReason: "end_turn" }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const prog = await (await fetch(`${base}/api/references?program=UL-FKKT-KEM`)).json();
    assert.equal(prog.program, "UL-FKKT-KEM");
    assert.ok(prog.courses.length >= 10);
    assert.ok(prog.courses.every((c) => c.items.length >= 3 && c.group));
    const course = await (await fetch(`${base}/api/references?course=UNI-ULFKKT-SPLKEM`)).json();
    assert.match(course.label, /Splošna kemija/);
    assert.ok(course.items.length >= 3);
    assert.equal((await fetch(`${base}/api/references?program=NI-TAKEGA`)).status, 404);
    assert.equal((await fetch(`${base}/api/references?course=MAT-OS-8`)).status, 404);
  } finally {
    server.close();
  }
});
