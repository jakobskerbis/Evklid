// Lahek zagon (j, 17. 11. 2026): paketi nalog iger (public/games/subjects/, ~1,5 MB) se naložijo le za
// predmete, ki jih učenec potrebuje (topics.js loadSubjects), in prenos v ozadju (igre, orodja, 3D) teče le na hitri
// povezavi brez omejitve podatkov (games/stage.js backgroundLoadOk). Brskalniški del: Playwright, če je nameščen.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import * as T from "../public/games/topics.js";
import { META } from "../public/games/subjects/meta.js";
import { PACK_FILES } from "../public/games/subjects/index.js";
import { backgroundLoadOk } from "../public/games/stage.js";
import { startupFiles } from "../server/startup-files.js";

const PUB = path.resolve("public");
const PACK_URLS = Object.values(PACK_FILES).map((f) => `/games/subjects/${f}.js`);

test("topics.js: seznam vseh pojmov takoj, generatorji šele po loadSubjects in samo za izbrani predmet", async () => {
  assert.deepEqual(T.loadedPacks(), [], "uvoz topics.js ne naloži nobenega paketa");
  // vrstni red kot prej (matematika iz topics.js, nato paketi po PACK_FILES): barve ploščic ostanejo enake
  const metaIds = Object.values(META).flatMap((m) => m.concepts.map((c) => c[0]));
  assert.deepEqual(T.CONCEPTS.slice(-metaIds.length).map((c) => c.id), metaIds);
  assert.deepEqual(T.SUBJECTS, ["MAT", "SPO", "NIT", "NAR", "FIZ", "KEM", "BIO", "GEO", "RAC", "EKO"]);
  const f = T.concept("f_speed");
  assert.equal(f.subject, "FIZ");
  assert.equal(f.name.sl, "Hitrost");
  assert.ok(T.conceptReady("frac_add"), "matematika iz topics.js je vedno pripravljena");
  assert.ok(!T.conceptReady("f_speed") && !T.subjectsReady(["FIZ"]));
  assert.throws(() => f.gen(1), /not loaded/);
  await T.loadSubjects(["FIZ"]);
  assert.deepEqual(T.loadedPacks().sort(), ["FIZ", "FIZ2"]);
  assert.ok(T.subjectsReady(["FIZ"]) && !T.subjectsReady(["FIZ", "KEM"]) && !T.conceptReady("k_mol"));
  T.setNumberStyle("sl");
  const q = T.makeQuestion("f_speed", 2);
  assert.ok(q.q.includes("v") || q.q.includes("s") || q.q.includes("t"), JSON.stringify(q));
  await T.loadSubjects(["MAT", "NEZNAN"]);
  assert.deepEqual(T.loadedPacks().sort(), ["FIZ", "FIZ2", "MAT15", "MAT2"]);
  await T.loadAllSubjects();
  assert.equal(T.loadedPacks().length, Object.keys(PACK_FILES).length);
  for (const c of T.CONCEPTS) assert.ok(T.conceptReady(c.id), c.id);
});

test("subjects/meta.js je svež (sicer node scripts/igre-pojmi.js)", async () => {
  const { packMeta } = await import("../scripts/igre-pojmi.js");
  assert.deepEqual(META, await packMeta(), "subjects/meta.js je star – zaženi node scripts/igre-pojmi.js");
  assert.deepEqual(Object.keys(META), Object.keys(PACK_FILES));
});

test("paketi predmetov niso v statičnem drevesu iger (naložijo se z import())", () => {
  const games = startupFiles(PUB, "index.html", ["games/index.js"]);
  assert.ok(games.includes("/games/index.js") && games.includes("/games/subjects/meta.js"));
  for (const u of PACK_URLS) assert.ok(!games.includes(u), `${u} je statično uvožen`);
  const src = fs.readFileSync(path.join(PUB, "games/subjects/index.js"), "utf8");
  assert.ok(!/^\s*(import|export)\s[^(]*from\s/m.test(src), "subjects/index.js ne uvaža paketov statično");
});

test("backgroundLoadOk: prenos v ozadju le na hitri povezavi brez omejitve podatkov", () => {
  assert.equal(backgroundLoadOk(undefined), true, "brskalnik brez navigator.connection (Safari, Firefox)");
  assert.equal(backgroundLoadOk({ effectiveType: "4g" }), true);
  assert.equal(backgroundLoadOk({ effectiveType: "4g", type: "wifi" }), true);
  assert.equal(backgroundLoadOk({ effectiveType: "4g", type: "ethernet" }), true);
  assert.equal(backgroundLoadOk({ effectiveType: "4g", saveData: true }), false);
  for (const e of ["slow-2g", "2g", "3g"]) assert.equal(backgroundLoadOk({ effectiveType: e }), false, e);
  assert.equal(backgroundLoadOk({ effectiveType: "4g", type: "cellular" }), false);
});

test("app.js: igre in orodja v ozadju preverijo povezavo, igre pripravijo učenčev predmet", () => {
  const src = fs.readFileSync(path.join(PUB, "app.js"), "utf8");
  const games = src.slice(src.indexOf("// Igre v ozadju"), src.indexOf("// Takojšnje odpiranje (j 6. 11. 2026)"));
  assert.match(games, /!backgroundLoadOk\(navigator\.connection\)\) return;\s*loadGames\(\)/);
  // prefetchNext: težki koraki le ob backgroundLoadOk; pregledovalnik pole in uvodni ogled na vsaki povezavi (razen
  // varčevanja s podatki in lahkega načina), ker delujeta tudi brez povezave (pregled 2 #816, točka 1)
  const start = src.indexOf("function prefetchNext()");
  const next = src.slice(start, src.indexOf("\n}\n", start));
  assert.match(next, /if \(navigator\.connection\?\.saveData \|\| document\.documentElement\.classList\.contains\("lite"\) \|\| !state\.student\) return;/);
  assert.match(next, /const heavy = backgroundLoadOk\(navigator\.connection\);/);
  const light = next.slice(next.indexOf(": []),"));
  assert.match(next.slice(0, next.indexOf(": []),")), /heavy\s*\?\s*\[\s*\(\) => calcTool[\s\S]*3d\/modeli\.js/);
  assert.match(light, /loadPaperViewer\(\)/);
  assert.match(light, /heavy \? \["\/3d\/stran\.js"[^\]]*three\.module\.js[^\]]*\] : \[\]\),\s*"\/uvodni-ogled\.js"/);
  assert.match(src, /m\.prepareSubjects\?\.\(\)/, "po nalaganju iger: paket učenčevega predmeta");
  assert.match(src, /function leaveHiddenGames\(\) \{[^}]*gamesMod\?\.prepareSubjects\?\.\(\)/, "menjava predmeta ali profila");
  const idx = fs.readFileSync(path.join(PUB, "games/index.js"), "utf8");
  assert.match(idx, /if \(!conceptReady\(cid\)\) return waitForPack\(id, concept\);/, "igra drugega predmeta počaka na svoj paket");
  assert.match(idx, /export function leaveGames\(\) \{\s*root\?\.querySelector\("\.gm-wait"\)\?\.remove\(\);/, "odhod iz Iger prekliče čakanje na paket");
  assert.match(idx, /!subjectsReady\(\[subj\]\) && navigator\.onLine !== false && !portalTried\.has\(subj\)/, "portal brez povezave ne prenaša paketov");
});

// ---------- v brskalniku ----------
const require = createRequire(import.meta.url);
let browser = null;
try {
  browser = await require("playwright").chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

const PAGE = `<!doctype html><meta charset="utf-8"><script type="module">
import * as T from "/games/topics.js";
window.T = T;
window.ready = true;
</script>`;
function serve(hits) {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    hits.push(req.url);
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": "text/javascript" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

test("brskalnik: topics.js ne prenese paketov; FIZ prenese le fiz.js in fiz2.js; po izpadu povezave nov poskus uspe", { skip }, async (t) => {
  const hits = [];
  const server = await serve(hits);
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const p = await (await browser.newContext()).newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(`http://127.0.0.1:${server.address().port}/t.html`);
  await p.waitForFunction(() => window.ready);
  const packs = () => hits.filter((u) => PACK_URLS.includes(u.split("?")[0]));
  assert.deepEqual(packs(), []);
  assert.equal(await p.evaluate(() => T.CONCEPTS.length), T.CONCEPTS.length);
  // brez povezave: nalaganje ne uspe, igra ostane brez paketa
  await p.route("**/games/subjects/kem*.js*", (r) => r.abort());
  assert.equal(await p.evaluate(() => T.loadSubjects(["KEM"]).then(() => "ok", () => "napaka")), "napaka");
  assert.equal(await p.evaluate(() => T.subjectsReady(["KEM"])), false);
  await p.unroute("**/games/subjects/kem*.js*");
  await p.evaluate(() => T.loadSubjects(["FIZ"]));
  assert.deepEqual(packs().filter((u) => !u.includes("kem")).sort(), ["/games/subjects/fiz.js", "/games/subjects/fiz2.js"]);
  // povezava je spet tu: nov poskus (z drugim naslovom, brskalnik si neuspel modul zapomni) uspe
  assert.equal(await p.evaluate(() => T.loadSubjects(["KEM"]).then(() => T.subjectsReady(["KEM"]))), true);
  assert.equal(await p.evaluate(() => (T.setNumberStyle("sl"), !!T.makeQuestion("k_mol", 1).q)), true);
  assert.ok(packs().some((u) => /\/kem2?\.js\?r=\d+$/.test(u)), packs().join(" "));
  assert.ok(!packs().some((u) => /bio|geo|rac|eko|spo|nit|nar|mat/.test(u)), packs().join(" "));
  assert.deepEqual(errors, []);
});
