// Poštene oznake vsebine (N-03, server/oznake-vsebine.js, public/oznake-vsebine.js): nobena oznaka brez dokaza v podatkih.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { oznakeIzDokazov, leanDokazi, oznakeLekcije, oznakePole, OZNAKE, imeCloveka, sha256, stanjeZaStare } from "../server/oznake-vsebine.js";
import { checkLessonSource } from "../server/lesson-check.js";
import { ourPaperIds } from "../server/our-papers.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const DANES = new Date("2026-11-26T10:00:00Z");
const ids = (o) => o.map((x) => x.id);

test("oznakeIzDokazov: vsaka oznaka zahteva svoj dokaz", () => {
  // brez preverjanja programa ni »strojno«, tudi pri stanju »preverjeno«
  assert.deepEqual(ids(oznakeIzDokazov({ stanje: "preverjeno" }, DANES)), ["osnutek"]);
  // napaka programa → osnutek, tudi pri »pregledano« z učiteljem
  assert.deepEqual(ids(oznakeIzDokazov({ stanje: "pregledano", pregledal: "Ana Novak", pregledano: "2026-11-20", preverjanje: { napake: 1, koraki: 9 } }, DANES)), ["osnutek"]);
  // brez preračunanih korakov samo »Pregledal AI«
  assert.deepEqual(ids(oznakeIzDokazov({ stanje: "preverjeno", preverjanje: { napake: 0, koraki: 0 } }, DANES)), ["pregledal_ai"]);
  assert.deepEqual(oznakeIzDokazov({ stanje: "preverjeno", preverjanje: { napake: 0, koraki: 12 } }, DANES), [{ id: "strojno", koraki: 12 }]);
  // osnutek ostane osnutek, četudi program nima pripomb
  assert.deepEqual(ids(oznakeIzDokazov({ stanje: "osnutek", preverjanje: { napake: 0, koraki: 12 } }, DANES)), ["osnutek"]);
  // strokovni pregled: stanje, ime človeka, pravi datum, ne v prihodnosti
  const ok = { stanje: "pregledano", pregledal: "Ana Novak", pregledano: "2026-11-20", preverjanje: { napake: 0, koraki: 3 } };
  assert.deepEqual(oznakeIzDokazov(ok, DANES), [{ id: "strojno", koraki: 3 }, { id: "strokovno", datum: "2026-11-20" }]);
  for (const slabo of [
    { pregledal: null },
    { pregledal: "" },
    { pregledal: "AI" },
    { pregledal: "Claude Opus" },
    { pregledal: "program" },
    { pregledano: null },
    { pregledano: "20. 11. 2026" },
    { pregledano: "2026-02-30" },
    { pregledano: "2026-11-27" }, // jutri
    { stanje: "preverjeno" },
  ]) assert.ok(!ids(oznakeIzDokazov({ ...ok, ...slabo }, DANES)).includes("strokovno"), JSON.stringify(slabo));
  // formalno: samo svež dokaz z vsaj enim izrekom, vedno s številom
  assert.deepEqual(oznakeIzDokazov({ ...ok, stanje: "preverjeno", lean: { izreki: 7, svez: true } }, DANES).at(-1), { id: "formalno", izreki: 7 });
  for (const lean of [{ izreki: 7, svez: false }, { izreki: 0, svez: true }, { izreki: 7 }, null]) assert.ok(!ids(oznakeIzDokazov({ ...ok, lean }, DANES)).includes("formalno"), JSON.stringify(lean));
});

test("oznakeIzDokazov: na mreži vseh vhodov nobena oznaka ni močnejša od dokaza", () => {
  const stanja = ["osnutek", "preverjeno", "pregledano", undefined, "kaj"];
  const preverjanja = [null, { napake: 0, koraki: 0 }, { napake: 0, koraki: 5 }, { napake: 2, koraki: 5 }, { napake: "0", koraki: 5 }];
  const ljudje = [null, "Ana Novak", "Opus"];
  const datumi = [null, "2026-11-01", "2027-01-01", "x"];
  const leani = [null, { izreki: 3, svez: true }, { izreki: 3, svez: false }];
  let n = 0;
  for (const stanje of stanja) for (const preverjanje of preverjanja) for (const pregledal of ljudje) for (const pregledano of datumi) for (const lean of leani) {
    const o = oznakeIzDokazov({ stanje, preverjanje, pregledal, pregledano, lean }, DANES);
    n++;
    for (const x of o) assert.ok(OZNAKE.includes(x.id));
    const brezNapak = preverjanje?.napake === 0;
    const has = (id) => o.some((x) => x.id === id);
    assert.equal(o.filter((x) => ["osnutek", "pregledal_ai", "strojno"].includes(x.id)).length, 1, "natanko ena osnovna oznaka");
    if (has("strojno")) assert.ok(brezNapak && preverjanje.koraki > 0 && ["preverjeno", "pregledano"].includes(stanje));
    if (has("pregledal_ai")) assert.ok(brezNapak && ["preverjeno", "pregledano"].includes(stanje));
    if (has("strokovno")) assert.ok(stanje === "pregledano" && brezNapak && pregledal === "Ana Novak" && pregledano === "2026-11-01");
    if (has("formalno")) assert.ok(lean?.svez === true && lean.izreki > 0);
  }
  assert.equal(n, 5 * 5 * 3 * 4 * 3);
  assert.equal(imeCloveka("Ana Čaić"), true);
  assert.equal(imeCloveka("GPT"), false);
});

test("leanDokazi: glava vir + sha256, izreki brez »example«, brez glave ni dokaza", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "oz-lean-"));
  try {
    fs.mkdirSync(path.join(dir, "MAT_SS_4"));
    const sha = "a".repeat(64);
    fs.writeFileSync(path.join(dir, "MAT_SS_4", "Odvod.lean"), `/-\nvir: content/lessons/MAT-SS-4/odvod.md\nsha256: ${sha}\n-/\nmodule\n\ntheorem a : 1 = 1 := rfl\nlemma b : 2 = 2 := rfl\nprivate theorem c : 3 = 3 := rfl\nexample : 4 = 4 := rfl\n-- theorem d v komentarju se ne šteje\n`);
    fs.writeFileSync(path.join(dir, "MAT_SS_4", "Brez.lean"), `theorem x : 1 = 1 := rfl\n`);
    // Pregled 2: izrek v (gnezdenem) bločnem komentarju ni izrek; datoteka s »sorry« ali »axiom« ni dokaz.
    const glava = (l) => `/-\nvir: content/lessons/MAT-SS-4/${l}.md\nsha256: ${sha}\n-/\n`;
    fs.writeFileSync(path.join(dir, "MAT_SS_4", "Kom.lean"), `${glava("integral")}theorem a : 1 = 1 := rfl\n/- zunaj /- gnezdeno -/\ntheorem skrit : 2 = 2 := rfl\n-/\n`);
    fs.writeFileSync(path.join(dir, "MAT_SS_4", "Sorry.lean"), `${glava("limita")}theorem a : 1 = 2 := by\n  sorry\n`);
    fs.writeFileSync(path.join(dir, "MAT_SS_4", "Aks.lean"), `${glava("vrsta")}axiom h : 1 = 2\ntheorem a : 1 = 2 := h\n`);
    fs.writeFileSync(path.join(dir, "MAT_SS_4", "SorryKom.lean"), `${glava("zaporedje")}-- brez sorry\ntheorem a : 1 = 1 := rfl\n`);
    const idx = leanDokazi(dir);
    assert.deepEqual([...idx.keys()].sort(), ["integral", "odvod", "zaporedje"].map((l) => `content/lessons/MAT-SS-4/${l}.md`));
    assert.equal(idx.get("content/lessons/MAT-SS-4/integral.md").izreki, 1);
    assert.equal(idx.get("content/lessons/MAT-SS-4/zaporedje.md").izreki, 1);
    assert.deepEqual(idx.get("content/lessons/MAT-SS-4/odvod.md"), { sha, izreki: 3 });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("oznakeLekcije: prave lekcije – oznaka sledi programu in glavi, star dokaz Lean se ne šteje", () => {
  const id = "FIZ-OS-9/upor-in-ohmov-zakon";
  const file = path.join("content", "lessons", `${id}.md`);
  const buf = fs.readFileSync(file);
  const r = checkLessonSource(buf.toString("utf8"), id);
  assert.deepEqual(r.errors, []);
  const koraki = r.calcChecked + r.identitiesChecked;
  assert.ok(koraki > 0);
  const lean = (s) => new Map([[file.split(path.sep).join("/"), { sha: s, izreki: 4 }]]);
  assert.deepEqual(oznakeLekcije(id, { danes: DANES, lean: new Map() }), [{ id: "strojno", koraki }]);
  assert.deepEqual(oznakeLekcije(id, { danes: DANES, lean: lean(sha256(buf)) }).at(-1), { id: "formalno", izreki: 4 });
  assert.ok(!ids(oznakeLekcije(id, { danes: DANES, lean: lean("0".repeat(64)) })).includes("formalno"));
  assert.equal(oznakeLekcije("FIZ-OS-9/ne-obstaja", { danes: DANES }), null);
  // Danes nobena lekcija nima strokovnega pregleda: oznaka »Strokovno pregledano« se ne sme pojaviti (vzorec po mapah).
  for (const d of fs.readdirSync("content/lessons")) {
    const dir = path.join("content/lessons", d);
    if (!fs.statSync(dir).isDirectory()) continue;
    const f = fs.readdirSync(dir).find((x) => x.endsWith(".md"));
    if (!f) continue;
    const src = fs.readFileSync(path.join(dir, f), "utf8");
    const o = oznakeLekcije(`${d}/${f.slice(0, -3)}`, { danes: DANES });
    if (!/^pregledal:\s*\S/m.test(src)) assert.ok(!ids(o || []).includes("strokovno"), `${d}/${f}`);
  }
});

test("oznakePole: naše pole so strojno preverjene (program preračuna korake), učitelj jih še ni pregledal", () => {
  const all = [...ourPaperIds().keys()];
  assert.ok(all.length > 0);
  for (const id of all) {
    const o = oznakePole(id, { danes: DANES });
    assert.equal(o[0].id, "strojno", id);
    assert.ok(o[0].koraki > 0, id);
    assert.ok(!ids(o).includes("strokovno"), id);
  }
  assert.equal(oznakePole("NPZ9-MAT-1999-redni"), null);
});

test("API: lekcija in pola vrneta oznake", async () => {
  const app = createApp(openDb(":memory:"), {});
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const l = await (await fetch(`${base}/api/lesson?id=${encodeURIComponent("FIZ-OS-9/upor-in-ohmov-zakon")}`)).json();
    assert.equal(l.labels[0].id, "strojno");
    assert.equal(l.lesson.status, "preverjeno"); // staro polje ostane za stare odjemalce
    // Pregled 2: staro polje za stare odjemalce nikoli močnejše od oznak.
    assert.equal(stanjeZaStare("preverjeno", [{ id: "osnutek" }]), "osnutek");
    assert.equal(stanjeZaStare("pregledano", [{ id: "strojno", koraki: 3 }]), "preverjeno");
    assert.equal(stanjeZaStare("pregledano", [{ id: "strojno", koraki: 3 }, { id: "strokovno", datum: "2026-11-20" }]), "pregledano");
    assert.equal(stanjeZaStare("preverjeno", null), "osnutek");
    const pid = [...ourPaperIds().keys()][0];
    const p = await (await fetch(`${base}/api/exam-papers/ours/${pid}`)).json();
    assert.equal(p.labels[0].id, "strojno");
  } finally {
    server.close();
  }
});

test("izris: samo znane oznake z dokazom; brez strokovnega pregleda vedno pove, da ga ni", async () => {
  globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
  await import("../public/i18n.js");
  const { oznakeHtml } = await import("../public/oznake-vsebine.js");
  assert.equal(oznakeHtml(null), "");
  assert.equal(oznakeHtml([{ id: "dokazano" }]), "");
  assert.equal(oznakeHtml([{ id: "strojno" }]), ""); // brez števila korakov ni oznake
  assert.equal(oznakeHtml([{ id: "strokovno" }]), ""); // brez datuma ni oznake
  assert.equal(oznakeHtml([{ id: "formalno", izreki: 0 }]), "");
  const h = oznakeHtml([{ id: "strojno", koraki: 12 }]);
  assert.match(h, /oz-strojno/);
  assert.match(h, /12/);
  assert.match(h, /Prijavi napako/);
  const s = oznakeHtml([{ id: "strojno", koraki: 2 }, { id: "strokovno", datum: "2026-11-20" }]);
  assert.match(s, /oz-strokovno/);
  assert.doesNotMatch(s, /še ni pregledal/);
  assert.match(oznakeHtml([{ id: "strojno", koraki: 2 }], { vrsta: "pola" }), /Učitelj pole še ni pregledal/);
  assert.doesNotMatch(oznakeHtml([{ id: "strojno", koraki: 2, x: "<script>" }]), /<script>/);
});
