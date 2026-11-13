import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { filesFromTarball, planChanges, applyChanges, rollback, readState, needsRestart, supervisorChanged, MARKER } from "../scripts/posodobitev.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "evklid-pos-"));
const put = (root, rel, text, mode) => {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), text);
  if (mode) fs.chmodSync(path.join(root, rel), mode);
};
const read = (root, rel) => fs.readFileSync(path.join(root, rel), "utf8");
const long = `content/${"zelo-dolgo-ime-mape-".repeat(4)}/${"lekcija-".repeat(10)}.md`;

// Arhiv kot ga vrne GitHub: vse v mapi evklid-<sha>/, format pax.
function tarball(files) {
  const dir = tmp();
  const top = path.join(dir, "evklid-abc123");
  for (const [rel, text, mode] of files) put(top, rel, text, mode);
  const out = path.join(dir, "a.tar.gz");
  execFileSync("tar", ["--format=pax", "-czf", out, "-C", dir, "evklid-abc123"]);
  return fs.readFileSync(out);
}

const NEW = [
  ["package.json", '{"name":"evklid"}'],
  ["server/index.js", "// nova"],
  ["public/app.js", "// nova app"],
  [long, "# dolga pot"],
  ["zagon-windows.bat", `rem ${MARKER}\r\nnova`],
  ["telefon-windows.bat", `rem ${MARKER}\r\nnova`],
  ["zagon-mac.command", "#!/bin/bash\n# nova", 0o755],
  [".env", "ANTHROPIC_API_KEY=iz-arhiva"],
  ["data/evklid.db", "iz-arhiva"],
];

test("arhiv: dolge poti, brez .env in data/, izvedljive datoteke", () => {
  const files = filesFromTarball(tarball(NEW));
  assert.ok(files.has(long));
  assert.equal(String(files.get("server/index.js")), "// nova");
  assert.ok(!files.has(".env") && !files.has("data/evklid.db"));
  assert.equal(files.get("zagon-mac.command").executable, true);
  assert.ok(!files.get("server/index.js").executable);
});

test("posodobitev prepiše samo spremenjeno, ohrani .env in podatke, zna nazaj", () => {
  const root = tmp();
  put(root, ".env", "ANTHROPIC_API_KEY=moj");
  put(root, "data/evklid.db", "moji podatki");
  put(root, "package.json", '{"name":"evklid"}'); // enaka
  put(root, "server/index.js", "// stara");
  put(root, "server/staro.js", "// iz prejšnje posodobitve, v main je ni več");
  put(root, "moja-datoteka.txt", "uporabnikova");
  put(root, "zagon-windows.bat", `rem ${MARKER}\r\nstara`); // varna oblika: prepišemo
  put(root, "telefon-windows.bat", "stara brez oznake"); // stara oblika: med tekom ne prepišemo
  const files = filesFromTarball(tarball(NEW));
  const plan = planChanges(root, files, ["server/index.js", "server/staro.js", "package.json"]);
  assert.deepEqual(plan.skipped, ["telefon-windows.bat"]);
  assert.deepEqual(plan.remove, ["server/staro.js"]);
  assert.ok(!plan.write.includes("package.json"));
  assert.ok(plan.write.includes("server/index.js") && plan.write.includes(long));

  fs.writeFileSync(path.join(root, "data", "posodobitev.json"), JSON.stringify({ sha: "a".repeat(40), datoteke: ["server/staro.js"] }));
  applyChanges(root, files, plan);
  fs.writeFileSync(path.join(root, "data", "posodobitev.json"),
    JSON.stringify({ sha: "b".repeat(40), prejsnja: "a".repeat(40), datoteke: [...files.keys()], prejsnjeDatoteke: ["server/staro.js"] }));
  assert.equal(read(root, "server/index.js"), "// nova");
  assert.equal(read(root, long), "# dolga pot");
  assert.ok(!fs.existsSync(path.join(root, "server/staro.js")));
  assert.equal(read(root, ".env"), "ANTHROPIC_API_KEY=moj");
  assert.equal(read(root, "data/evklid.db"), "moji podatki");
  assert.equal(read(root, "moja-datoteka.txt"), "uporabnikova");
  assert.equal(read(root, "telefon-windows.bat"), "stara brez oznake");
  if (process.platform !== "win32") assert.ok(fs.statSync(path.join(root, "zagon-mac.command")).mode & 0o100);

  assert.equal(rollback(root, () => {}), true);
  assert.equal(read(root, "server/index.js"), "// stara");
  assert.equal(read(root, "server/staro.js"), "// iz prejšnje posodobitve, v main je ni več");
  assert.ok(!fs.existsSync(path.join(root, long)));
  const state = readState(root);
  assert.equal(state.sha, "a".repeat(40));
  assert.deepEqual(state.slabe, ["b".repeat(40)]);
  assert.deepEqual(state.datoteke, ["server/staro.js"]);
});

test("kdaj znova zagnati strežnik oziroma zagonski program", () => {
  assert.equal(needsRestart(["docs/posodobitve.md", "README.md", "test/a.test.js", "zagon-windows.bat"]), false);
  assert.equal(needsRestart(["content/lessons/MAT-OS-9/x.md"]), true);
  assert.equal(needsRestart(["public/i18n/ui/de.json"]), true);
  assert.equal(supervisorChanged(["server/app.js"]), false);
  assert.equal(supervisorChanged(["scripts/telefon.js"]), true);
});

test("strežnik pove različico in zasedenost; service worker dobi različico knjižnic", async () => {
  const app = createApp(openDb(":memory:"));
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = await (await fetch(`${base}/healthz/stanje`)).json();
    assert.equal(typeof s.razlicica, "string");
    assert.equal(s.aktivni, 0);
    assert.ok(s.gorMs >= 0);
    await fetch(`${base}/api/config`);
    assert.equal((await (await fetch(`${base}/healthz/stanje`)).json()).aktivni, 0);
    const sw = await fetch(`${base}/sw.js`);
    assert.match(sw.headers.get("content-type"), /javascript/);
    const src = await sw.text();
    assert.match(src, /const VERSION = "evklid-v1-[0-9a-f]{8}";/);
    assert.match(src, /const APP = "[0-9a-f]{12}";/); // različica datotek aplikacije (takojšnje odpiranje)
  } finally {
    server.close();
  }
});

test("stara povezava (ngrok) preusmeri na lastno domeno, ko ta kaže na ta strežnik", async () => {
  const http = await import("node:http");
  const { BRAND } = await import("../server/brand.js");
  const get = (port, host, p) => new Promise((resolve, reject) => {
    http.get({ port, path: p, headers: { host } }, (res) => { res.resume(); resolve(res); }).on("error", reject);
  });
  for (const [home, expect] of [[true, 302], [false, 200]]) {
    const app = createApp(openDb(":memory:"), { homeCheck: async () => home });
    const server = app.listen(0);
    const port = server.address().port;
    try {
      const r = await get(port, "cranium-freehand-jaybird.ngrok-free.dev", "/healthz?x=1");
      assert.equal(r.statusCode, expect);
      if (home) assert.equal(r.headers.location, `https://${BRAND.domain}/healthz?x=1`);
      assert.equal((await get(port, "localhost", "/healthz")).statusCode, 200); // lokalno nikoli
    } finally {
      server.close();
    }
  }
});

test("Render: objava, ko je strežnik miren, med uporabo največ 3 ure čakanja, neuspele ne ponavlja", async () => {
  const { decide, pendingSince } = await import("../scripts/render-objava.js");
  const sha = "abcdef1234567890";
  const ura = 3600000;
  const miren = { razlicica: "111111111111", aktivni: 0, mirujeMs: null, gorMs: 2 * ura };
  assert.equal(decide({ stanje: { ...miren, razlicica: sha.slice(0, 12) }, mainSha: sha, cakaMin: 500 }).objavi, false);
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 5 }).objavi, true);
  const zaseden = { ...miren, mirujeMs: 60000 };
  assert.equal(decide({ stanje: zaseden, mainSha: sha, cakaMin: 60 }).objavi, false);
  assert.equal(decide({ stanje: { ...miren, aktivni: 1 }, mainSha: sha, cakaMin: 60 }).objavi, false);
  assert.equal(decide({ stanje: zaseden, mainSha: sha, cakaMin: 181 }).objavi, true);
  assert.equal(decide({ stanje: { ...miren, gorMs: 20 * 60000 }, mainSha: sha, cakaMin: 30 }).objavi, false);
  assert.equal(decide({ stanje: zaseden, mainSha: sha, cakaMin: 1, rocno: true }).objavi, true);
  assert.equal(decide({ stanje: null, mainSha: sha, cakaMin: 10 }).objavi, false);
  assert.equal(decide({ stanje: null, mainSha: sha, cakaMin: 61 }).objavi, true);
  const now = Date.now();
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 200, zadnja: { sha, at: now - ura }, now }).objavi, false);
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 200, zadnja: { sha, at: now - 4 * ura }, now }).objavi, true);
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 5, zadnja: { sha: "drugi", at: now - 2 * ura }, now }).objavi, true);
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 5, zadnja: { sha: "drugi", at: now - 20 * 60000 }, now }).objavi, false);
  assert.equal(decide({ stanje: null, mainSha: sha, cakaMin: 61, zadnja: { sha: "drugi", at: now - 20 * 60000 }, now }).objavi, false);
  const c = (sha, date, ...parents) => ({ sha, commit: { committer: { date } }, parents: parents.map((p) => ({ sha: p })) });
  // m1, m2: združitvi v main; b1 (star commit v veji), bm (»Merge main« v veji, star datum) se ne štejeta.
  const vrsta = [c("b1", "2026-10-30T01:00:00Z", "x"), c("bm", "2026-10-30T02:00:00Z", "b1", "x"), c("m1", "2026-10-30T08:00:00Z", "x", "bm"), c("s1", "2026-10-30T08:30:00Z", "m1"), c("m2", "2026-10-30T09:00:00Z", "s1", "y")];
  assert.equal(pendingSince(vrsta, "m2"), Date.parse("2026-10-30T08:00:00Z"));
  assert.equal(pendingSince([c("a", "2026-10-30T07:00:00Z", "x")], "a"), Date.parse("2026-10-30T07:00:00Z"));
  assert.equal(pendingSince([]), null);
});
