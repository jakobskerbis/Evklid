// Teme delov nalog naših pol (content/exam-papers/teme/<id>.json, server/our-papers.js ourPaperTopicTags): vsak del
// vsake pole ima oznako (tema ali null), tema obstaja, je iz predmeta in stopnje izpita in ima vajo (gumb »Vadi«);
// paperTopics (šibke točke, pola na čas) uporabi oznake namesto ugibanja po besedah.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadOurPaper, ourPaperIds, ourPaperTopicTags, OUR_PAPERS_DIR } from "../server/our-papers.js";
import { partKey } from "../public/our-paper-key.js";
import { getTopic } from "../server/curriculum.js";
import { hasGenerator } from "../server/practice/index.js";
import { paperTopics } from "../server/weaknesses.js";

// Poti učnega načrta, iz katerih so lahko teme izpita (NPZ6 samo 6. razred, NPZ9 6.–9. razred, matura 1.–4. letnik in
// snov OŠ, ki je v SŠ ni kot svoje teme, npr. odstotni račun, razmerje, mikroskop).
const OS = ["OS-6", "OS-7", "OS-8", "OS-9"];
const SS = ["SS-1", "SS-2", "SS-3", "SS-4"];
const PATHS = { NPZ6: ["OS-6"], NPZ9: OS, MATURA: [...SS, ...OS], POKLICNA: [...SS, ...OS] };
const MIN_COVER = 0.8; // najmanjši delež delov s temo na vsaki poli
const DIR = path.join(OUR_PAPERS_DIR, "teme");

test("teme pol: vsaka pola ima oznake za vse dele, teme obstajajo, ustrezajo izpitu in imajo vajo", () => {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  const ids = [...ourPaperIds().keys()];
  assert.deepEqual(files.map((f) => f.slice(0, -5)).sort(), ids.sort(), "ena datoteka tem za vsako našo polo");
  for (const id of ids) {
    const paper = loadOurPaper(id);
    const raw = JSON.parse(fs.readFileSync(path.join(DIR, `${id}.json`), "utf8"));
    assert.equal(raw.paper, id);
    const tags = ourPaperTopicTags(id);
    const keys = paper.tasks.flatMap((tk) => tk.parts.map((p) => partKey(tk, p)));
    assert.deepEqual(Object.keys(tags).sort(), [...keys].sort(), `${id}: vsak del pole natanko enkrat`); // ključi »12« so v JS vedno prvi
    const allowed = PATHS[paper.exam].map((s) => `${paper.subject}-${s}`);
    for (const [key, t] of Object.entries(tags)) {
      if (t === null) continue;
      const topic = getTopic(t);
      assert.ok(topic, `${id} ${key}: tema ${t} ne obstaja`);
      assert.ok(allowed.includes(topic.path), `${id} ${key}: tema ${t} ni iz ${allowed.join(", ")}`);
      assert.ok(hasGenerator(t), `${id} ${key}: tema ${t} nima vaje`);
    }
    const cover = Object.values(tags).filter(Boolean).length / keys.length;
    assert.ok(cover >= MIN_COVER, `${id}: s temo le ${Math.round(100 * cover)} % delov`);
  }
});

test("teme pol: paperTopics vzame oznake (null = brez teme), brez datoteke in za tujo polo ni oznak", () => {
  for (const id of ourPaperIds().keys()) {
    const tags = ourPaperTopicTags(id);
    const map = paperTopics(id, loadOurPaper(id));
    assert.deepEqual(Object.fromEntries(map), Object.fromEntries(Object.entries(tags).filter(([, t]) => t)), id);
  }
  assert.deepEqual(ourPaperTopicTags("NPZ9-MAT-1999-redni"), {});
  // Pola brez datoteke tem: ostane ugibanje po besedilu naloge.
  const brez = paperTopics("NPZ9-MAT-1999-redni", { exam: "NPZ9", subject: "MAT", tasks: [{ n: 1, parts: [{ id: "a", points: 1, text: "Odstotni račun: koliko je 20 odstotkov od 50?" }] }] });
  assert.equal(brez.get("1a"), "MAT-OS-7/odstotni-racun");
  assert.deepEqual(ourPaperTopicTags("../../package"), {});
});
