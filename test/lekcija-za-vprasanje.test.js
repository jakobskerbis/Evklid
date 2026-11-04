import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { lessonForQuestion, lessonNote, terms, LESSON_NOTE_HEAD } from "../server/lekcija-za-vprasanje.js";
import { isHiddenNote } from "../server/skrite-opombe.js";
import { listPaths, topicOrder, getTopic } from "../server/curriculum.js";
import { loadLesson } from "../server/textbook.js";
import { transcript } from "../server/povzetek.js";


const os = (subject, g) => ({ subject, educational_track: "OSNOVNA_SOLA", curriculum_level: `${g}. razred` });
const ss = (subject, g) => ({ subject, educational_track: "SREDNJA_SOLA", curriculum_level: `${g}. letnik` });

test("lesson search: clear questions find the matching lesson of the student's subject and level", () => {
  // Ime teme, ne točen id: nova lekcija na drugi ravni testa ne sme podreti.
  const cases = [
    ["Kaj je Pitagorov izrek in kako izračunam hipotenuzo?", os("MAT", 8), /pitagor/i],
    ["Kako izračunam prostornino valja?", os("MAT", 9), /valj/i],
    ["Kako rešim kvadratno enačbo x^2 - 5x + 6 = 0?", ss("MAT", 2), /kvadratn/i],
    ["Logaritmi mi niso jasni, kaj je log2 8?", ss("MAT", 3), /logarit/i],
    ["Kaj je Ohmov zakon?", os("FIZ", 9), /ohm/i],
    ["Kaj je drugi Newtonov zakon?", ss("FIZ", 1), /newton/i],
    ["Kaj je pH in kaj pomeni, da je raztopina kisla?", ss("KEM", 2), /ph/i],
  ];
  const rank = (s) => (s.educational_track === "SREDNJA_SOLA" ? 10 : 0) + Number(s.curriculum_level[0]);
  for (const [q, s, name] of cases) {
    const hit = lessonForQuestion(q, s);
    assert.match(hit?.name || "", name, q);
    const t = getTopic(hit.id);
    assert.ok((t.path.includes("-SS-") ? 10 : 0) + Number(t.path.at(-1)) <= rank(s), `${q}: ne višja raven`);
  }
});

test("lesson search: asking about any topic by its name gives that topic's lesson, or none if it has no lesson", () => {
  let found = 0;
  const wrong = [];
  for (const subject of ["MAT", "FIZ", "KEM", "BIO", "NAR"]) {
    for (const p of listPaths(subject)) {
      if (!["OS", "SS"].includes(p.school)) continue;
      const settings = p.school === "SS" ? ss(subject, p.grade) : os(subject, p.grade);
      for (const t of topicOrder(p.key)) {
        const hit = lessonForQuestion(`Kaj je ${t.name}?`, settings);
        const has = !!loadLesson(t.id)?.sections.some((x) => /^povzetek/i.test(x.title));
        if (hit && hit.name.toLowerCase() !== t.name.toLowerCase()) wrong.push(`${t.id} → ${hit.id}`);
        if (hit && has) found++;
      }
    }
  }
  assert.deepEqual(wrong, [], "nobena tema ne dobi tuje lekcije");
  assert.ok(found > 100, `najde lekcije (${found})`);
});

test("lesson search: no lesson for chit-chat, off-topic, higher grades, other systems, or when switched off", () => {
  for (const q of ["Živjo, kako si?", "Pomagaj mi pri domači nalogi", "Kdo je bil Napoleon?", "Imam test jutri, kaj naj se učim?", "Koliko je 2+2?", "Zakaj je nebo modro?", "Kako napišem graf v Excelu?", "Kako začnem geometrijsko nalogo?", "Vržemo dve kocki. Kolikšna je verjetnost za vsoto 7?", "Kako izračunam koren enačbe?", "Kako se reče kocka po angleško?"])
    assert.equal(lessonForQuestion(q, os("MAT", 8)), null, q);
  assert.equal(lessonForQuestion("Kaj je odvod funkcije?", os("MAT", 8)), null, "snov višjega letnika ne");
  assert.equal(lessonForQuestion("Kaj je Pitagorov izrek?", { ...os("MAT", 8), school_system: "IN" }), null);
  assert.equal(lessonForQuestion("Kaj je Pitagorov izrek?", { subject: "MAT", educational_track: "UNIVERZA" }), null);
  process.env.EVKLID_LESSON_SEARCH = "0";
  try {
    assert.equal(lessonForQuestion("Kaj je Pitagorov izrek?", os("MAT", 8)), null);
  } finally {
    delete process.env.EVKLID_LESSON_SEARCH;
  }
  assert.deepEqual(terms("Kako rešim ENAČBO?"), ["resim", "enacb"]);
});

test("lesson note is a hidden note: left out of student text, summaries and claim detection", () => {
  const note = lessonNote(lessonForQuestion("Kaj je Pitagorov izrek?", os("MAT", 8)));
  assert.ok(note.startsWith(LESSON_NOTE_HEAD) && note.endsWith("</lekcija_ucbenika>"));
  assert.match(note, /Pitagorov izrek/);
  assert.match(note, /never mention this note/i);
  assert.ok(note.length < 1800);
  assert.ok(isHiddenNote(note));
  assert.equal(transcript([{ role: "user", content: [{ type: "text", text: note }, { type: "text", text: "Kaj je Pitagorov izrek?" }] }]), "STUDENT: Kaj je Pitagorov izrek?");
});

test("chat: first question of a free chat carries the lesson note; the student never sees it", async () => {
  const store = openDb(":memory:");
  const seen = [];
  const streamFn = async ({ messages, onText }) => {
    seen.push(messages);
    const text = "Poglejva skupaj.";
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", usage: { input_tokens: 10, output_tokens: 5 } };
  };
  const app = createApp(store, { streamFn });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  try {
    const s = await (await post("/api/students", { name: "Eva", settings: { subject: "MAT", educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" } })).json();
    const c = await (await post(`/api/students/${s.id}/conversations`, {})).json();
    const q = "Kaj je Pitagorov izrek in kako izračunam hipotenuzo?";
    await (await post(`/api/conversations/${c.id}/messages`, { text: q })).text();
    const texts = seen[0].at(-1).content.filter((b) => b.type === "text").map((b) => b.text);
    assert.equal(texts.length, 2);
    assert.match(texts[0], /^<lekcija_ucbenika>[\s\S]*Pitagorov izrek/);
    assert.equal(texts[1], q);
    // Druga poteza: opomba ostane v prvem sporočilu (enak začetek zgodovine), novo sporočilo je brez nje.
    await (await post(`/api/conversations/${c.id}/messages`, { text: "Kaj pa Pitagorov izrek v prostoru?" })).text();
    assert.deepEqual(seen[1][0].content, seen[0].at(-1).content);
    assert.equal(seen[1].at(-1).content.filter((b) => b.type === "text").length, 1);
    const conv = await (await fetch(`${base}/api/conversations/${c.id}`)).json();
    assert.equal(conv.messages[0].text, q, "učenec vidi le svoje vprašanje");
  } finally {
    server.close();
  }
});
