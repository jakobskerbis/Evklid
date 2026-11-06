import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import sl from "../public/i18n/sl.js";

// j, 6. 11.: »Razloži« pusti besedilo v polju, »Razloži« na obvestilu »Lekcija še nastaja«, »naj starš« polnoletnemu.
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const UI = new URL("../public/i18n/ui/", import.meta.url);
const langs = readdirSync(UI).filter((f) => f.endsWith(".json"));
const KEYS = ["tbk.pending", "tbk.pendingDemoPractice", "tbk.pendingDemo", "tbk.pendingPractice", "tbk.pendingAsk", "tbk.askTopic", "block.hintAdult"];

test("send: on a usage limit the input stays empty, on a network or server failure the text comes back", () => {
  const app = read("public/app.js");
  const send = app.slice(app.indexOf("async function send(text"), app.indexOf("function checkReplyFits"));
  // Strežnik ob meji vrne 429 z limit: true (server/app.js); odjemalec to označi na napaki.
  assert.match(send, /limit: res\.status === 429 && err\.limit === true/);
  // Polje se izprazni ob pošiljanju (tudi pri samodejno sestavljenih sporočilih: Razloži, izbire, kalkulator …).
  assert.match(send, /userEl = addMessage\("user", text, !!image\);\s*\$\("#input"\)\.value = "";/);
  // V catch se besedilo vrne samo, kadar napaka ni meja porabe.
  const tail = send.slice(send.indexOf("const dropped"));
  assert.match(tail, /if \(!err\.limit\) \{\s*\$\("#input"\)\.value = text;/);
  assert.equal((tail.match(/\$\("#input"\)\.value = text/g) || []).length, 1, "nobena druga pot ne vrne besedila v polje");
  // Server res pošlje limit: true pri meji.
  assert.match(read("server/app.js"), /if \(blocked\) return res\.status\(429\)\.json\(\{ \.\.\.blocked, limit: true \}\);/);
  // Mobilna aplikacija: enako pravilo (429 ne vrne besedila, brez povezave ga).
  const mob = read("mobile/src/app/chat/[id].tsx");
  assert.match(mob, /const lost = !\(err instanceof ApiError\) \|\| err\.offline \|\| err\.status >= 500 \|\| err\.status === 409;/);
});

test("textbook: a topic without a lesson offers »ask the tutor about this topic«, not »Razloži«", () => {
  const tb = read("public/textbook.js");
  assert.doesNotMatch(tb, /še nastaja\.\$\{/, "besedilo ni več sestavljeno v kodi (»nastaja.,«)");
  assert.match(tb, /class="card tb-section tb-pending"/);
  assert.match(tb, /if \(el\.closest\("\.tb-pending"\) \|\| start\?\.closest\("\.tb-pending"\)\) return null;/);
  assert.match(tb, /\$\{pending \? "" : `<p class="muted tb-sel-hint">/, "brez namiga »Označi in pritisni Razloži«");
  assert.match(tb, /\$\{pending \? "" : `<button type="button" class="secondary" id="tb-ask">/, "brez »Prebral sem lekcijo …«");
  assert.match(tb, /\$\("#tb-ask-topic"\)\?\.addEventListener\("click", \(\) => ctx\.learnWithTutor\(\{ id: L\.id, name: L\.name \}\)\)/);
  // learnWithTutor brez sporočila pošlje »Začniva s temo: {name}.« (z imenom teme).
  assert.match(read("public/app.js"), /async function learnWithTutor\(topic, firstMessage = t\("topic\.startMsg", \{ name: topic\.name \}\)\)/);
  assert.match(sl["topic.startMsg"], /\{name\}/);
});

test("pending-lesson text and the adult limit hint exist in all languages, without a double punctuation mark", () => {
  assert.equal(langs.length, 32);
  for (const k of KEYS) assert.ok(sl[k], `sl: ${k}`);
  assert.equal(`${sl["tbk.pending"]} ${sl["tbk.pendingPractice"]}`, "Lekcija za to temo še nastaja. Medtem reši nekaj nalog ali vprašaj inštruktorja, ki ti temo razloži po korakih.");
  assert.doesNotMatch(sl["block.hintAdult"], /starš/);
  for (const f of langs) {
    const j = JSON.parse(readFileSync(new URL(f, UI), "utf8"));
    for (const k of KEYS) {
      assert.ok(j[k] && j[k] !== sl[k], `${f}: ${k} preveden`);
      assert.doesNotMatch(j[k], /[.。।۔]\s*[,،，、]/, `${f}: ${k} brez dvojnega ločila`);
    }
    assert.notEqual(j["block.hintAdult"], j["block.hintParent"], `${f}: polnoletni ne dobi »naj starš«`);
  }
  // Strežnik (rezerva v slovenščini) ima isto besedilo kot odjemalec.
  assert.match(read("server/usage.js"), new RegExp(`"block\\.hintAdult": "${sl["block.hintAdult"]}"`));
});
