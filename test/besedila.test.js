// Mehanska pravila iz docs/besedila.md: en nagovor na zaslon, brez tehničnega žargona za učence, čista oblika.
import { test } from "node:test";
import assert from "node:assert/strict";
import SL from "../public/i18n/sl.js";

// Samo skrbnik (j) vidi te zaslone, zato smejo omenjati modele, API in žetone.
const ADMIN = /^(meter|admin|usage|pilot)\./;
// Strani za starše, učitelje in šole vikajo; vse ostalo (učenci, imetnik računa v aplikaciji) tika.
const VI = /^(payp|tc|orders|sole|starsi)\.|^kv\.joinHow$/;

// »kje ste« = ti in bolnik skupaj (množina, ne vikanje); besedilo je j potrdil dobesedno (kartica nujno, 6. 11.).
const MNOZINA = new Set(["nujno.zdravje.2"]);
const strings = Object.entries(SL).flatMap(([k, v]) => (typeof v === "string" ? [v] : Object.values(v)).map((s) => [k, s]));
const word = (src) => new RegExp(`(?<![\\p{L}])(?:${src})(?![\\p{L}])`, "iu");

test("učencem ne govorimo o modelih, API-ju in žetonih", () => {
  const jargon = word("API|Sonnet|Opus|Haiku|Anthropic|žeton\\p{L}*|model(?:a|u|om|i|ov|e|ih)?|strežnik\\p{L}*");
  const bad = strings.filter(([k, s]) => !ADMIN.test(k) && jargon.test(s)).map(([k]) => k);
  assert.deepEqual(bad, []);
});

test("vikanje samo na straneh za starše, učitelje in šole", () => {
  const vi = word("vaš\\p{L}*|vam|imate|želite|morate|boste|ste|lahko(?: \\p{L}+)? \\p{L}+(?:ite|ete|ate)");
  const ti = word("tvoj\\p{L}*|imaš|želiš|moraš|boš|lahko(?: \\p{L}+)? \\p{L}+(?:iš|eš|aš)");
  const bad = strings.filter(([k, s]) => !MNOZINA.has(k) && (VI.test(k) ? ti : vi).test(s)).map(([k, s]) => `${k}: ${s}`);
  assert.deepEqual(bad, []);
});

test("oblika: brez dvojnih presledkov, presledka pred ločilom in treh pik", () => {
  const bad = strings.filter(([, s]) => /  |\s[,!?](?!\d)|\.\.\./.test(s)).map(([k]) => k);
  assert.deepEqual(bad, []);
});
