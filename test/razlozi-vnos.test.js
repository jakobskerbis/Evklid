import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import sl from "../public/i18n/sl.js";

// j, 6. 11.: »Razloži« pusti besedilo v polju, »Razloži« na obvestilu »Lekcija še nastaja«, »naj starš« polnoletnemu.
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const UI = new URL("../public/i18n/ui/", import.meta.url);
const langs = readdirSync(UI).filter((f) => f.endsWith(".json"));
const KEYS = ["tbk.pending", "tbk.pendingDemoPractice", "tbk.pendingDemo", "tbk.pendingPractice", "tbk.pendingAsk", "tbk.askTopic", "block.hintAdult"];

test("send: on a usage limit the input stays empty, on any other failure text and photo come back", () => {
  const app = read("public/app.js");
  const send = app.slice(app.indexOf("async function send(text"), app.indexOf("function checkReplyFits"));
  // Strežnik ob meji vrne 429 z limit: true (server/app.js); odjemalec to označi na napaki.
  assert.match(send, /limit: res\.status === 429 && err\.limit === true/);
  // Polje se izprazni ob pošiljanju iz polja; samodejno sporočilo (Razloži, izbire …) osnutka in fotografije ne pobriše.
  assert.match(send, /const fromInput = !attached && \(\$\("#input"\)\.value\.trim\(\) \|\| ""\) === \(text \|\| ""\)\.trim\(\);/);
  assert.match(send, /const image = attached \|\| \(fromInput \? state\.image : null\);/);
  assert.match(send, /userEl = addMessage\("user", text, !!image\);\s*if \(fromInput\) \{\s*\$\("#input"\)\.value = "";\s*autoGrow\(\);\s*clearImage\(\);/);
  // V catch se besedilo in fotografija vrneta samo, kadar napaka ni meja porabe; nobena pot ne piše v polje mimo restoreDraft.
  const tail = send.slice(send.indexOf("const dropped"));
  assert.match(tail, /if \(!err\.limit\) restoreDraft\(text, image\);/);
  assert.doesNotMatch(send, /\$\("#input"\)\.value = text/, "nobena pot ne prepiše polja z besedilom");
  // restoreDraft ne prepiše osnutka in vrne fotografijo v predogled.
  const restore = app.slice(app.indexOf("function restoreDraft("), app.indexOf("function checkReplyFits"));
  assert.match(restore, /if \(text && !box\.value\.trim\(\)\)/);
  assert.match(restore, /if \(image && !state\.image\) \{\s*state\.image = image;/);
  // Izrez naloge iz pole gre kot slika samodejnega sporočila (ne prek polja).
  assert.match(app, /await send\(text \? `\$\{head\}\\n\\n\$\{text\}` : head, \{ image: task\.image \}\);/);
  // Server res pošlje limit: true pri meji.
  assert.match(read("server/app.js"), /if \(blocked\) return res\.status\(429\)\.json\(\{ \.\.\.blocked, limit: true \}\);/);
  // Mobilna aplikacija: enako pravilo kot splet (samo meja ne vrne besedila in fotografije; tudi 400 ju vrne).
  const mob = read("mobile/src/app/chat/[id].tsx");
  assert.match(mob, /const limit = err instanceof ApiError && err\.status === 429 && err\.body\?\.limit === true;\s*if \(!limit && !body\.deep\) \{\s*setText\(\(cur\) => \(cur\.trim\(\) \? cur : msgText\)\);\s*if \(body\.image\) setPhoto/);
  assert.doesNotMatch(mob, /setText\(msgText\)/, "mobilna ne prepiše osnutka");
  // Mobilna ob meji pokaže razlog v jeziku vmesnika (code/hint), ne slovenske rezerve strežnika.
  assert.match(mob, /blockText\(err\.body\) \|\| err\.message/);
});

test("prepared questions (calculator, scanner, 3D, corner, suggestion) never overwrite a typed draft", () => {
  const app = read("public/app.js");
  const fill = app.slice(app.indexOf("function fillInput("), app.indexOf("function restoreDraft("));
  assert.match(fill, /box\.value = typed \? `\$\{typed\}\\n\\n\$\{text\}` : text;/);
  // Vse poti askTutor in predlogi uporabijo fillInput.
  const asks = app.match(/askTutor: \(text\) => \{[\s\S]*?\n\s*\},/g) || [];
  assert.ok(asks.length >= 4, "kalkulator, skener, uči-se, kotiček");
  for (const a of asks) {
    assert.match(a, /fillInput\(text\)/);
    assert.doesNotMatch(a, /\.value = text/);
  }
  assert.match(app, /if \(!\$\("#input"\)\.value\.trim\(\) && !state\.image\) return send\(b\.dataset\.idea\);\s*fillInput\(b\.dataset\.idea\);/);
  // Delujoča logika (kopija fillInput na lažnem polju).
  const box = { value: "" };
  const fillLike = (text) => {
    const typed = box.value.replace(/\s+$/, "");
    box.value = typed ? `${typed}\n\n${text}` : text;
  };
  fillLike("A");
  assert.equal(box.value, "A");
  box.value = "moj osnutek  ";
  fillLike("B");
  assert.equal(box.value, "moj osnutek\n\nB");
});

test("mobile limit text: block code and hint are translated, unknown codes fall back", () => {
  const mob = read("mobile/src/app/chat/[id].tsx");
  const fn = mob.slice(mob.indexOf("function blockText("), mob.indexOf("export default function Chat"));
  assert.match(fn, /BLOCK_CODE\.test\(body\.code\)/);
  assert.match(fn, /if \(own === body\.code\) return null;/);
  // Mobilna bere iste slovarje kot splet, kjer so vsi block.* ključi.
  assert.match(read("mobile/src/lib/i18n.ts"), /public\/i18n\/sl\.js/);
  for (const k of ["block.hintAdult", "block.hintParent", "block.hintGuest", "block.daily"]) assert.ok(sl[k], k);
});

test("textbook: a topic without a lesson offers »ask the tutor about this topic«, not »Razloži«", () => {
  const tb = read("public/textbook.js");
  assert.doesNotMatch(tb, /še nastaja\.\$\{/, "besedilo ni več sestavljeno v kodi (»nastaja.,«)");
  assert.match(tb, /class="card tb-section tb-pending"/);
  // Na strani »Lekcija še nastaja« ni »Razloži« nikjer (tudi ne na naslovu in Ciljih).
  assert.match(tb, /if \(view\.querySelector\("\.tb-pending"\)\) return null;/);
  // CJK brez presledka po »。«; »Kaj zdaj?« brez praznega bloka gumbov.
  assert.match(tb, /\$\{\/\^\(zh\|ja\)\/\.test\(locale\(\)\) \? "" : " "\}/);
  assert.match(tb, /\$\{L\.practice \|\| !pending \? `<div class="actions">/);
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
