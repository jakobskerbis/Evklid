import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

// Okno inštruktorja: »Pokaži celoten postopek« po treh zaporednih korakih vodenja (način A).
const reply = (mode, done = 0) => `Kaj je naslednji korak?\n<<META subject=MAT topic="enačbe" error=0 mode=${mode} flag=none done=${done}>>`;

async function withServer(fn) {
  const store = openDb(":memory:");
  let next = reply("A");
  const streamFn = async ({ onText }) => {
    onText(next);
    return { content: [{ type: "text", text: next }], text: next, stopReason: "end_turn" };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, o = {}) => {
    const res = await fetch(base + p, { method: o.method || "GET", headers: { "Content-Type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined });
    const type = res.headers.get("content-type") || "";
    return type.includes("json") ? res.json() : res.text();
  };
  try {
    await fn({ call, setReply: (r) => (next = r) });
  } finally {
    server.close();
  }
}
const doneOf = (sse) => JSON.parse(/event: done\ndata: (.*)/.exec(sse)[1]);

test("full solution offer: after three guided replies in a row, reset by a mode B reply", async () => {
  await withServer(async ({ call, setReply }) => {
    const s = await call("/api/students", { method: "POST", body: { name: "Ana" } });
    const c = await call(`/api/students/${s.id}/conversations`, { method: "POST" });
    const say = async (text) => doneOf(await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text } }));
    assert.equal((await say("reši 2x + 3 = 11")).full_offer, undefined);
    assert.equal((await say("odštejem 3")).full_offer, undefined);
    assert.equal((await say("2x = 8")).full_offer, true, "tretji korak vodenja zapored");
    let conv = await call(`/api/conversations/${c.id}`);
    assert.equal(conv.messages.at(-1).full_offer, true, "tudi po ponovnem odprtju pogovora");
    assert.equal(conv.messages.filter((m) => m.full_offer).length, 1, "samo pri zadnjem odgovoru");

    setReply(reply("B"));
    assert.equal((await say("Pokaži mi celoten postopek te naloge.")).full_offer, undefined);
    setReply(reply("A"));
    assert.equal((await say("nova naloga")).full_offer, undefined, "odgovor v načinu B ponastavi štetje");
    await say("korak");
    setReply(reply("A", 1));
    assert.equal((await say("korak")).full_offer, undefined, "ne ob koncu teme");
    conv = await call(`/api/conversations/${c.id}`);
    assert.equal(conv.messages.at(-1).full_offer, undefined, "ne ob koncu teme tudi po ponovnem odprtju");
  });
});

test("full solution button: web and app show it and send a one-time request", () => {
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /if \(doneData\?\.full_offer && !bubble\.nextElementSibling\) addFullButton\(bubble\)/);
  assert.match(app, /send\(t\("chat\.fullMsg"\)\)/);
  const mob = readFileSync(new URL("../mobile/src/app/chat/[id].tsx", import.meta.url), "utf8");
  assert.match(mob, /setFullOk\(!!e\.data\.full_offer\)/);
  assert.match(mob, /send\(\{ text: t\("chat\.fullMsg"\) \}\)/);
});

test("choice buttons: parsed from <<IZBIRE [...]>>, hidden from the student, kept on reopen", async () => {
  const { parseChoices, stripMeta, createStreamFilter } = await import("../server/meta.js");
  assert.deepEqual(parseChoices('Kaj najprej?\n<<IZBIRE ["Odštejem 3", "Delim z 2", "Ne vem"]>>\n<<META subject=MAT>>'), ["Odštejem 3", "Delim z 2", "Ne vem"]);
  assert.deepEqual(parseChoices('<<IZBIRE ["Da"]>>'), [], "ena možnost ni izbira");
  assert.deepEqual(parseChoices("<<IZBIRE [Da, Ne]>>"), [], "neveljaven JSON");
  assert.deepEqual(parseChoices('<<IZBIRE ["a", "A", " b ", 3, "", "c", "d", "e"]>>'), ["a", "b", "c", "d"], "brez podvojenih, praznih, največ 4");
  assert.deepEqual(parseChoices(`<<IZBIRE ["${"x".repeat(61)}", "ok", "da"]>>`), ["ok", "da"], "predolga izbira odpade");
  assert.equal(stripMeta('Vprašanje?\n<<IZBIRE ["Da", "Ne"]>>\n<<META subject=MAT>>'), "Vprašanje?");
  assert.equal(stripMeta('Vprašanje?\n<<IZBIRE ["Da", "Ne'), "Vprašanje?", "odrezan blok");
  const f = createStreamFilter();
  let shown = "";
  for (const ch of 'Je to res? Premisli dobro, preden odgovoriš.\n<<IZBIRE ["Da", "Ne"]>>\n<<META subject=MAT>>') shown += f.push(ch);
  shown += f.end().rest;
  assert.ok(!shown.includes("IZBIRE") && !shown.includes("<<"), shown);

  await withServer(async ({ call, setReply }) => {
    const s = await call("/api/students", { method: "POST", body: { name: "Ana" } });
    const c = await call(`/api/students/${s.id}/conversations`, { method: "POST" });
    setReply('Ali je $x = 4$ rešitev?\n<<IZBIRE ["Da", "Ne", "Ne vem"]>>\n<<META subject=MAT topic="enačbe" error=0 mode=A flag=none done=0>>');
    const d = doneOf(await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "kaj je enačba" } }));
    assert.deepEqual(d.choices, ["Da", "Ne", "Ne vem"]);
    assert.ok(!d.text.includes("IZBIRE"));
    let conv = await call(`/api/conversations/${c.id}`);
    assert.deepEqual(conv.messages.at(-1).choices, ["Da", "Ne", "Ne vem"]);
    assert.ok(!conv.messages.at(-1).text.includes("IZBIRE"));
    setReply('Tega ne morem.\n<<IZBIRE ["Da", "Ne"]>>\n<<META subject=MAT topic="-" error=0 mode=A flag=offtopic done=0>>');
    const d2 = doneOf(await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Da" } }));
    assert.equal(d2.choices, undefined, "brez gumbov, ko flag ni none");
    conv = await call(`/api/conversations/${c.id}`);
    assert.equal(conv.messages.filter((m) => m.choices).length, 0, "le pri zadnjem odgovoru in ne pri opozorilu");
  });
});

test("choice buttons: web and app show them under the last answer, a tap sends, typed text is kept", () => {
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /if \(doneData\?\.choices && !bubble\.nextElementSibling\) addChoices\(bubble, doneData\.choices\);/);
  assert.match(app, /if \(text && info\?\.choices\) addChoices\(el, info\.choices\);/);
  assert.match(app, /querySelectorAll\("\.full-btn, \.choice-row"\)\.forEach\(\(x\) => x\.remove\(\)\)/, "gumbi izginejo ob pošiljanju");
  const fn = app.slice(app.indexOf("function addChoices("));
  assert.ok(fn.indexOf("${c} ${typed}") > 0 && fn.indexOf("send(c)") > fn.indexOf("${c} ${typed}"), "napisano besedilo ostane");
  const mob = readFileSync(new URL("../mobile/src/app/chat/[id].tsx", import.meta.url), "utf8");
  assert.match(mob, /setChoices\(Array\.isArray\(e\.data\.choices\)/);
  assert.match(mob, /send\(\{ text: c \}\)/);
  assert.match(mob, /setChoices\(\[\]\)/);
});
