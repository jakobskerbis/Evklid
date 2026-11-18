import test from "node:test";
import assert from "node:assert/strict";

// Mikrofon v klepetu ne sme ostati rdeč, če brskalnik ne pošlje onend (j, 17. 11. 2026, posnetek iz aplikacije).
test("mic button turns off even when the browser never fires onend", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const listeners = {};
  const on = (o) => (o.addEventListener = (k, f) => ((listeners[k] ||= []).push(f)));
  const made = [];
  class FakeRec {
    constructor() { made.push(this); }
    start() {}
    stop() {} // nikoli ne pokliče onend
    abort() {}
  }
  globalThis.window = { SpeechRecognition: FakeRec };
  on(globalThis.window);
  globalThis.document = { hidden: false };
  on(globalThis.document);
  const classes = new Set();
  const button = { hidden: false, title: "", classList: { toggle: (c, v) => (v ? classes.add(c) : classes.delete(c)) }, setAttribute() {} };
  on(button);
  const form = {};
  on(form);
  const field = { value: "", form, focus() {} };
  const { attachMic } = await import("../public/speech.js");
  const mic = attachMic(button, field);
  await listeners.click[0]();
  assert.ok(classes.has("rec"), "posluša");
  await listeners.click[0](); // dotik za konec
  assert.ok(mic.listening, "čaka na onend");
  t.mock.timers.tick(2000);
  assert.ok(!classes.has("rec") && !mic.listening, "po 2 s ugasne tudi brez onend");

  // Napaka (npr. no-speech) brez onend: enako.
  await listeners.click[0]();
  made.at(-1).onerror({ error: "no-speech" });
  t.mock.timers.tick(2000);
  assert.ok(!classes.has("rec"));

  // Pošiljanje sporočila med poslušanjem: takoj ugasne, pozen rezultat in onend ne vrneta besedila v prazno polje,
  // pozni dogodki starega poslušanja ne zmotijo novega.
  await listeners.click[0]();
  const old = made.at(-1);
  const lateResult = old.onresult, lateEnd = old.onend, lateError = old.onerror;
  field.value = ""; // send() je polje izpraznil
  listeners.submit[0]();
  assert.ok(!classes.has("rec") && !mic.listening, "pošiljanje takoj ugasne");
  lateResult({ resultIndex: 0, results: [Object.assign([{ transcript: "pozno" }], { isFinal: true })] });
  lateEnd();
  assert.equal(field.value, "", "poslano besedilo se ne vrne v polje");
  await listeners.click[0]();
  lateEnd();
  lateError({ error: "aborted" });
  assert.ok(classes.has("rec"), "novo poslušanje teče naprej");

  // Dolga tišina brez onend in onerror (WebView): ugasne samo.
  t.mock.timers.tick(45000);
  t.mock.timers.tick(2000);
  assert.ok(!classes.has("rec") && !mic.listening, "po tišini ugasne");
  delete globalThis.window;
  delete globalThis.document;
});
