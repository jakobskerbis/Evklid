// K-17 (j 26. 11. 2026: »možnost hitre vrnitve na prejšnjo različico«): ročni zagon Render z vrni_na objavi starejši
// commit iz main, potem pa samodejne objave ne vrnejo pokvarjene različice, dokler se main ne spremeni.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { decide, jeZaklenjeno, preveriVrnitev } from "../scripts/render-objava.js";

const A = "a".repeat(40); // pokvarjen vrh main
const B = "b".repeat(40); // starejši dober commit
const C = "c".repeat(40); // nov popravek
const zelen = { stanje: "uspeh", zakaj: "vsi testi zeleni" };
const vrnitev = { sha: B, at: Date.now() - 60000, vrnitev: true, mainOb: A };

test("po vrnitvi se isti vrh main ne objavi znova (tudi takoj in [nujno])", () => {
  const d = decide({ stanje: { razlicica: B.slice(0, 12) }, mainSha: A, cakaMin: 90, testi: zelen, takoj: true, nujno: true, zadnja: vrnitev });
  assert.equal(d.objavi, false);
  assert.match(d.zakaj, /^vrnjeno na b{12}/);
});

test("nov commit v main ali ročni zagon zaklep sprosti", () => {
  assert.equal(decide({ stanje: { razlicica: B.slice(0, 12) }, mainSha: C, cakaMin: 1, testi: zelen, takoj: true, zadnja: vrnitev }).objavi, true);
  assert.equal(decide({ stanje: { razlicica: B.slice(0, 12) }, mainSha: A, cakaMin: 1, testi: zelen, rocno: true, zadnja: vrnitev }).objavi, true);
  assert.equal(jeZaklenjeno({ sha: A, at: 1 }, A), false, "običajna objava ni zaklep");
});

test("vrnitev samo na commit iz main z zelenimi testi", () => {
  assert.equal(preveriVrnitev({ sha: B, primerjava: { status: "ahead", ahead_by: 3 }, testi: zelen }).ok, true);
  assert.equal(preveriVrnitev({ sha: "b".repeat(12), primerjava: { status: "ahead" }, testi: zelen }).ok, false, "kratek SHA");
  assert.equal(preveriVrnitev({ sha: B, primerjava: { status: "diverged" }, testi: zelen }).ok, false, "ni v main");
  assert.equal(preveriVrnitev({ sha: B, primerjava: null, testi: zelen }).ok, false, "commit ne obstaja");
  assert.equal(preveriVrnitev({ sha: B, primerjava: { status: "ahead", ahead_by: 1 }, testi: { stanje: "napaka", zakaj: "testi: failure" } }).ok, false);
  assert.equal(preveriVrnitev({ sha: B, primerjava: { status: "ahead", ahead_by: 1 }, testi: { stanje: "napaka" }, brezTestov: true }).ok, true);
});

test("delovni tok poda vrni_na samo iz ročnega zagona, prek okolja (ne v ukazu)", () => {
  const wf = fs.readFileSync(new URL("../.github/workflows/render-posodobitev.yml", import.meta.url), "utf8");
  assert.match(wf, /vrni_na:\n\s+description:/);
  assert.match(wf, /VRNI_NA: \$\{\{ github\.event_name == 'workflow_dispatch' && inputs\.vrni_na \|\| '' \}\}/);
  assert.equal(wf.match(/inputs\.vrni_na/g).length, 1, "inputs.vrni_na samo v okolju, nikjer v ukazih");
  assert.match(wf, /VEJA: \$\{\{ github\.ref \}\}/);
});
