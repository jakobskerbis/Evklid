// Vaja po razlagi iz generatorjev (P1-3, del A; server/vaja-po-razlagi.js, blok <<ODPRI vaja="…">> v server/odpri.js).
// Gumb »Podobna naloga« odpre nalogo iz Vadnice: samo tema z generatorjem, nikoli napačna tema, brez stikala nič.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { temaZVajo, vajaVklopljena } from "../server/vaja-po-razlagi.js";
import { resolveOpen, parseOpenBlocks } from "../server/odpri.js";
import { stripMeta } from "../server/meta.js";
import { normalizeSettings } from "../server/settings.js";
import { generateTask } from "../server/practice/index.js";

const st = (track, level, subject) => normalizeSettings({ educational_track: track, curriculum_level: level, subject });
const SS2 = st("SREDNJA_SOLA", "2. letnik", "MAT");
const OS9F = st("OSNOVNA_SOLA", "9. razred", "FIZ");
const OS6 = st("OSNOVNA_SOLA", "6. razred", "MAT");
const SS1K = st("SREDNJA_SOLA", "1. letnik", "KEM");
const SS2B = st("SREDNJA_SOLA", "2. letnik", "BIO");

const zStikalom = async (fn) => {
  const prej = process.env.EVKLID_VAJA_PO_RAZLAGI;
  process.env.EVKLID_VAJA_PO_RAZLAGI = "1";
  try {
    return await fn();
  } finally {
    if (prej == null) delete process.env.EVKLID_VAJA_PO_RAZLAGI;
    else process.env.EVKLID_VAJA_PO_RAZLAGI = prej;
  }
};

test("tema z vajo: ime teme učenčeve stopnje najde temo z generatorjem", () => {
  assert.equal(temaZVajo("kvadratna enačba", SS2)?.topicId, "MAT-SS-2/kvadratna-enacba");
  assert.equal(temaZVajo("Ohmov zakon", OS9F)?.topicId, "FIZ-OS-9/upor-in-ohmov-zakon");
  assert.equal(temaZVajo("množina snovi", SS1K)?.topicId, "KEM-SS-1/mnozina-snovi");
  assert.equal(temaZVajo("logaritemska enačba", SS2)?.topicId, "MAT-SS-2/logaritemska-funkcija-in-enacbe");
  assert.ok(temaZVajo("kvadratna enačba", SS2).title.length > 3);
});

test("tema z vajo: dvoumna ali neznana poizvedba ne da gumba (nikoli napačna tema)", () => {
  // »seštevanje ulomkov« bi po besedilu najprej našlo »Desetiški ulomki« (le ena od dveh besed v naslovu).
  assert.equal(temaZVajo("seštevanje ulomkov", OS6), null);
  assert.equal(temaZVajo("", SS2), null);
  assert.equal(temaZVajo("xyzzy blabla", SS2), null);
  // Brez slovenske stopnje (tuji šolski sistem) ni iskanja po lekcijah.
  assert.equal(temaZVajo("kvadratna enačba", normalizeSettings({ ...SS2, school_system: "GB" })), null);
});

test("naloga za izbrano temo: generator jo ustvari na vseh treh ravneh (odgovore preverja test vseh generatorjev)", () => {
  for (const [q, s] of [["kvadratna enačba", SS2], ["Ohmov zakon", OS9F], ["množina snovi", SS1K], ["mitoza", SS2B]]) {
    const t = temaZVajo(q, s);
    assert.ok(t, q);
    for (const level of [1, 2, 3]) {
      const task = generateTask(t.topicId, level, 12345 + level, "sl");
      assert.ok(task?.text && task.answer?.type, `${q} ${level}`);
    }
  }
});

test("ODPRI vaja: brez stikala nič; s stikalom gumb z id teme; blok učenec ne vidi", async () => {
  const blok = 'Razložila sem. Poskusi še sam.\n<<ODPRI vaja="kvadratna enačba">>';
  assert.equal(vajaVklopljena(), process.env.EVKLID_VAJA_PO_RAZLAGI === "1");
  if (!vajaVklopljena()) assert.deepEqual(await resolveOpen(blok, SS2), []);
  assert.deepEqual(parseOpenBlocks(blok).map((b) => b.kind), ["practice"]);
  const r = await zStikalom(() => resolveOpen(blok, SS2));
  assert.equal(r.length, 1);
  assert.equal(r[0].kind, "practice");
  assert.equal(r[0].id, "MAT-SS-2/kvadratna-enacba");
  assert.deepEqual(await zStikalom(() => resolveOpen('<<ODPRI vaja="seštevanje ulomkov">>', OS6)), []);
  // Ista tema dvakrat → en gumb; skupaj z lekcijo dva različna gumba.
  const dva = await zStikalom(() => resolveOpen('<<ODPRI vaja="kvadratna enačba">> <<ODPRI vaja="kvadratna enačba">> <<ODPRI ucbenik="kvadratna enačba">>', SS2));
  assert.deepEqual(dva.map((x) => x.kind), ["practice", "lesson"]);
  assert.doesNotMatch(stripMeta(blok), /ODPRI|vaja=/);
});

test("odjemalec: gumb »Podobna naloga« odpre temo v Vadnici in začne vajo; prevod v 6 živih jezikih", () => {
  const odpri = fs.readFileSync(new URL("../public/odpri.js", import.meta.url), "utf8");
  assert.match(odpri, /practice: \["pencil", "vr\.vaja"\]/);
  assert.match(odpri, /if \(x\.kind === "practice"\) return D\.openPractice\(x\.id\);/);
  const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /openPractice: async \(id\) => \(await openTopic\(id\)\) \|\| \(currentView === "topic" && state\.topic\?\.id === id && \$\("#t-practice"\) && nextPractice\(\)\)/);
  assert.match(fs.readFileSync(new URL("../public/i18n/sl.js", import.meta.url), "utf8"), /"vr\.vaja": "Podobna naloga"/);
  for (const l of ["en", "de", "hr", "it", "hu"]) assert.ok(JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${l}.json`, import.meta.url), "utf8"))["vr.vaja"], l);
});
