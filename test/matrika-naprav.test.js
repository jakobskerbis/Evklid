// K-12 (načrt dviga kakovosti po reviziji, 26. 11. 2026): matrika 9 naprav in brskalnikov (scripts/matrika-naprav.cjs),
// hitrost na počasnem omrežju (scripts/hitrost-naprav.cjs) in Firefox v dimnem testu (scripts/preveri-aplikacijo.cjs).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { MATRIKA, tokZa, vrsta } = require("../scripts/matrika-naprav.cjs");

test("matrika: 9 različnih kombinacij, vsi trije pogoni, telefoni, tablici in računalniki", () => {
  assert.equal(MATRIKA.length, 9);
  assert.equal(new Set(MATRIKA.map((z) => z.id)).size, 9);
  assert.deepEqual([...new Set(MATRIKA.map((z) => z.brskalnik))].sort(), ["chromium", "firefox", "webkit"]);
  const toki = MATRIKA.map(tokZa);
  assert.ok(toki.filter((t) => t === "telefon").length >= 4, "telefoni in tablici na dotik");
  assert.ok(toki.filter((t) => t === "racunalnik").length >= 3, "računalniki");
  // Firefox v Playwrightu nima mobilnega pogleda (isMobile): v matriki ga zato ni na telefonu.
  for (const z of MATRIKA.filter((z) => z.brskalnik === "firefox")) assert.equal(z.mobilno, false, z.id);
});

test("matrika: pravilo telefon/računalnik je isto kot v public/style.css (760 px, dotik do 1240 px)", () => {
  const css = fs.readFileSync(new URL("../public/style.css", import.meta.url), "utf8");
  assert.match(css, /@media \(max-width: 760px\), \(max-width: 1240px\) and \(hover: none\) and \(pointer: coarse\)/);
  assert.equal(tokZa({ w: 760, dotik: false }), "telefon");
  assert.equal(tokZa({ w: 761, dotik: false }), "racunalnik");
  assert.equal(tokZa({ w: 1180, dotik: true }), "telefon");
  assert.equal(tokZa({ w: 1240, dotik: true }), "telefon");
  assert.equal(tokZa({ w: 1366, dotik: true }), "racunalnik");
});

test("matrika: vrste napak ustrezajo sporočilom dimnega testa", () => {
  const preveri = fs.readFileSync(new URL("../scripts/preveri-aplikacijo.cjs", import.meta.url), "utf8");
  // Sporočila, ki jih K-12 šteje posebej, so res v dimnem testu (sprememba besedila ne sme tiho izpasti iz štetja).
  for (const s of ["mehurček inštruktorja prekriva", "obvestilo prekriva", "mali navpični drsnik", "vodoravno drsenje za", "cela stran je za"]) assert.ok(preveri.includes(s), s);
  assert.equal(vrsta("tel zagon: mehurček inštruktorja prekriva: #input"), "prekrivanje");
  assert.equal(vrsta("pc zbirke: obvestilo prekriva: .zb-tabs"), "prekrivanje");
  assert.equal(vrsta("tel napredek: mali navpični drsnik (▲▼) v: .x"), "mali drsnik");
  assert.equal(vrsta("tel uci: vodoravno drsenje za 12 px"), "vodoravno drsenje");
  assert.equal(vrsta("tel uci: cela stran je za 30 px višja od zaslona"), "vodoravno drsenje");
  assert.equal(vrsta("tel uci: napaka strani: x"), "drugo");
});

test("dimni test: Firefox brez isMobile in brez Chromovih zastavic, WebKit telefon z mobilnim pogledom", () => {
  const s = fs.readFileSync(new URL("../scripts/preveri-aplikacijo.cjs", import.meta.url), "utf8");
  assert.match(s, /--brskalnik/);
  assert.match(s, /\.\.\.\(FIREFOX \? \{\} : \{ isMobile: /, "Firefox ne dobi isMobile (Playwright ga ne podpira)");
  assert.match(s, /FIREFOX && \(MOBILNO/, "Firefox z --mobilno se ustavi z jasno napako");
  // Privzeti telefon na WebKitu je iPhone 13; z --zaslon velja izbrana velikost (iPhone SE, iPad).
  assert.match(s, /phone && WEBKIT && !ZASLON \? \{ \.\.\.playwright\.devices\["iPhone 13"\]/);
});

test("hitrost: posrednik doda zakasnitev in deli eno linijo omejene hitrosti", { timeout: 30000 }, async (t) => {
  let posrednik = null;
  try {
    ({ posrednik } = require("../scripts/hitrost-naprav.cjs"));
  } catch (e) {
    return t.skip(`scripts/hitrost-naprav.cjs ni mogoče naložiti: ${e.message}`);
  }
  const TELO = Buffer.alloc(50000, 97); // 50 kB
  const srv = http.createServer((req, res) => res.writeHead(200, { "content-type": "text/plain" }).end(req.url === "/majhno" ? "ok" : TELO));
  await new Promise((ok) => srv.listen(0, "127.0.0.1", ok));
  // 100 ms zakasnitve, 250 kB/s: 50 kB = 200 ms prenosa.
  const pos = await posrednik(`http://127.0.0.1:${srv.address().port}`, { rtt: 100, hitrost: 250000 });
  t.after(() => (pos.stop(), srv.close()));
  const cas = async (pot) => {
    const t0 = Date.now();
    const r = await fetch(pos.base + pot);
    const b = Buffer.from(await r.arrayBuffer());
    return { ms: Date.now() - t0, n: b.length, status: r.status };
  };
  const m = await cas("/majhno");
  assert.equal(m.status, 200);
  assert.ok(m.ms >= 95, `majhen odgovor tudi čaka zakasnitev: ${m.ms} ms`);
  const v = await cas("/veliko");
  assert.equal(v.n, TELO.length, "telo pride celo");
  assert.ok(v.ms >= 280, `50 kB pri 250 kB/s + 100 ms: ${v.ms} ms`);
  // Dva hkratna prenosa si delita linijo: skupaj vsaj 2 × 200 ms prenosa.
  const t0 = Date.now();
  const [a, b] = await Promise.all([cas("/veliko"), cas("/veliko")]);
  assert.equal(a.n + b.n, 2 * TELO.length);
  assert.ok(Date.now() - t0 >= 480, `dva hkratna prenosa: ${Date.now() - t0} ms`);
});
