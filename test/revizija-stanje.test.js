// K-01/K-02: scripts/revizija-stanje.mjs najde razlike med registrom revizije, PR-ji in testi z oznako.
import { test } from "node:test";
import assert from "node:assert/strict";
import { celice, oznake, preberiRegister, primerjaj, stevilkePr, zdruzeniIzGita } from "../scripts/revizija-stanje.mjs";

const REGISTER = `# Register
| ID | Prioriteta | Področje | Kratek opis | Status | Pregledani commit | Komentar | PR popravka |
|---|---|---|---|---|---|---|---|
| AUDIT-101 | P1 | Kalkulator | Združen, status zaostaja | V IZVEDBI | \`abc\` | j | #11 |
| AUDIT-102 | P2 | Inštruktor | Status prehiteva | PRIPRAVLJENO ZA PONOVNI PREGLED | \`abc\` | – | [#12](https://github.com/x/y/pull/12) (nad #11) |
| AUDIT-103 | P2 | Vnos | Kazalec v \`2×1|0^(5)\` in \\|x\\| | ZAKLJUČENO | \`abc\` | Claude (pregled #11) | #13 |
| AUDIT-104 | P3 | Okna | Drsnik v oknu | NOVO | \`abc\` | – | – |
| AUDIT-105 | P2 | Vnos | Zavrnjena | ZAVRNJENO Z DOKAZI | \`abc\` | – | – |
| AUDIT-106 | P2 | Vnos | Vse v redu | ZAKLJUČENO | \`abc\` | – | #14 |
`;

const LOG = [
  ["c1", "AUDIT-101: popravek (#11)", ""],
  ["c3", "Popravek brez oznake (#13)", ""],
  ["c4", "Merge pull request #14 from x/claude/audit-106-vse", "AUDIT-106: vse v redu"],
  ["c5", "AUDIT-107 do AUDIT-108: dva nova (#15)", ""],
  ["c6", "Lekcije (#16)", ""],
]
  .map((z) => z.join("\u001f"))
  .join("\u001e");

test("celice: »\\|« ne loči celic, neubežan | pa (opis se kasneje združi)", () => {
  assert.deepEqual(celice("| a | b \\| c | d |"), ["a", "b | c", "d"]);
  const { vrstice, napake } = preberiRegister(REGISTER);
  assert.deepEqual(napake, []);
  const v = vrstice.find((x) => x.id === "AUDIT-103");
  assert.equal(v.status, "ZAKLJUČENO");
  assert.match(v.opis, /2×1 \| 0\^\(5\)/);
  assert.deepEqual(v.pr, [13]);
});

test("PR-ji v oklepaju (»nad #11«) niso popravek ugotovitve", () => {
  const { vrstice } = preberiRegister(REGISTER);
  assert.deepEqual(vrstice.find((x) => x.id === "AUDIT-102").pr, [12]);
  assert.deepEqual(stevilkePr("[#1004](https://github.com/a/b/pull/1004), #7"), [1004, 7]);
});

test("oznake: posamezne, razponi in imena vej", () => {
  assert.deepEqual(oznake("AUDIT-026, AUDIT-041: isti zapis"), ["AUDIT-026", "AUDIT-041"]);
  assert.deepEqual(oznake("AUDIT-058–060"), ["AUDIT-058", "AUDIT-059", "AUDIT-060"]);
  assert.deepEqual(oznake("AUDIT-029 do AUDIT-031"), ["AUDIT-029", "AUDIT-030", "AUDIT-031"]);
  assert.deepEqual(oznake("[x/claude/audit-040-bralnik]"), ["AUDIT-040"]);
  assert.deepEqual(oznake("Lekcije 3. letnika"), []);
});

test("zdruzeniIzGita: squash in merge commit", () => {
  const z = zdruzeniIzGita(LOG);
  assert.equal(z.get(11).naslov, "AUDIT-101: popravek");
  assert.match(z.get(14).naslov, /^AUDIT-106: vse v redu \[x\/claude\/audit-106-vse\]$/);
  assert.equal(z.size, 5);
});

test("primerjaj najde vseh pet vrst razlik in nič odveč", () => {
  const register = preberiRegister(REGISTER);
  const odprti = [
    { number: 12, title: "AUDIT-102: prehiteva" },
    { number: 17, title: "AUDIT-104: drug popravek pod tujo oznako" },
  ];
  const testi = new Map([
    ["AUDIT-101", new Set(["test/a.test.js"])],
    ["AUDIT-106", new Set(["test/b.test.js"])],
  ]);
  const { vrstice, razlike } = primerjaj(register, zdruzeniIzGita(LOG), odprti, testi);
  const kratko = razlike.map((r) => `${r.vrsta} ${r.id}`);
  assert.deepEqual(kratko, [
    "zaostaja AUDIT-101",
    "prehiteva AUDIT-102",
    "nepovezan AUDIT-104",
    "manjka AUDIT-107",
    "manjka AUDIT-108",
    "brez-testa AUDIT-103",
  ]);
  const po = Object.fromEntries(vrstice.map((v) => [v.id, v.dejansko]));
  assert.deepEqual(po, {
    "AUDIT-101": "popravek v main",
    "AUDIT-102": "popravek v odprtem PR",
    "AUDIT-103": "zaključeno",
    "AUDIT-104": "popravek v odprtem PR",
    "AUDIT-105": "zavrnjeno",
    "AUDIT-106": "zaključeno",
  });
});

test("zaključena ugotovitev brez združenega PR-ja prehiteva", () => {
  const md = REGISTER.replace("| AUDIT-104 | P3 | Okna | Drsnik v oknu | NOVO |", "| AUDIT-104 | P3 | Okna | Drsnik v oknu | ZAKLJUČENO |");
  const { razlike } = primerjaj(preberiRegister(md), zdruzeniIzGita(LOG), [], new Map([["AUDIT-104", new Set(["t"])]]));
  assert.ok(razlike.some((r) => r.vrsta === "prehiteva" && r.id === "AUDIT-104" && r.opis === "brez PR"));
});
