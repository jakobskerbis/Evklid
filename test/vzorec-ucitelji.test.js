// Vzorec za strokovni pregled učiteljev (N-06, scripts/vzorec-ucitelji.mjs, docs/strokovni-pregled.md).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { izberiVzorec, PLASTI, NALOGE, POLE, PRIVZETO_SEME, odg } from "../scripts/vzorec-ucitelji.mjs";

test("vzorec: ponovljiv iz semena, po plasteh, brez ponovitev, samo obstoječe lekcije", () => {
  const a = izberiVzorec(PRIVZETO_SEME);
  const b = izberiVzorec(PRIVZETO_SEME);
  assert.deepEqual(a, b, "isto seme, isti vzorec");
  assert.equal(a.lekcije.length, Object.values(PLASTI).reduce((x, y) => x + y, 0));
  for (const [mapa, k] of Object.entries(PLASTI)) assert.equal(a.lekcije.filter((l) => l.plast === mapa).length, k, mapa);
  assert.equal(new Set(a.lekcije.map((l) => l.id)).size, a.lekcije.length);
  for (const l of a.lekcije) assert.ok(fs.existsSync(`content/lessons/${l.id}.md`), l.id);
  assert.equal(a.naloge.length, Object.values(NALOGE).reduce((x, y) => x + y, 0));
  for (const n of a.naloge) assert.ok(n.besedilo && odg(n.odgovor), n.tema);
  assert.equal(new Set(a.naloge.map((n) => n.tema)).size, a.naloge.length);
  assert.equal(a.pole.length, Object.values(POLE).reduce((x, y) => x + y, 0));
  assert.equal(new Set(a.pole.map((p) => p.kljuc)).size, a.pole.length);
  // drugo seme da drug vzorec (izbor ni vezan na vrstni red datotek)
  assert.notDeepEqual(izberiVzorec("drugo-seme").lekcije.map((l) => l.id), a.lekcije.map((l) => l.id));
});

test("vzorec: zapisani izbor v docs (velja ta zapis) kaže na obstoječe lekcije", () => {
  const md = fs.readFileSync("docs/strokovni-pregled-vzorec.md", "utf8");
  const ids = [...md.matchAll(/https:\/\/evklid\.app\/ucbenik\/([A-Z]+-[A-Z]+-\d)\/([a-z0-9-]+)/g)].map((m) => `${m[1]}/${m[2]}`);
  assert.equal(ids.length, Object.values(PLASTI).reduce((x, y) => x + y, 0));
  for (const id of ids) assert.ok(fs.existsSync(`content/lessons/${id}.md`), id);
});

test("odg: odgovor kot ga vidi učenec", () => {
  assert.equal(odg({ type: "number", value: 733.902, unit: "J", decimals: 0 }), "734 J (zaokroženo na celo število)");
  assert.equal(odg({ type: "number", value: 60, unit: "°", decimals: 1 }), "60,0° (zaokroženo na 1 decimalko)");
  assert.equal(odg({ type: "number", value: [1.5, -2], decimals: 2 }), "1,50; -2,00 (zaokroženo na 2 decimalki)");
  assert.equal(odg({ type: "number", value: 1.6e-19, unit: "C" }), "1,6e-19 C");
  assert.equal(odg({ type: "coefficients", values: [1, 3, 2] }), "1, 3, 2");
  assert.equal(odg({ type: "fraction", num: 240, den: 289 }), "240/289");
  assert.equal(odg({ type: "choice", options: ["a", "b"], index: 1 }), "b");
  assert.equal(odg({ type: "number", value: 0.1 + 0.2 }), "0,3");
});
