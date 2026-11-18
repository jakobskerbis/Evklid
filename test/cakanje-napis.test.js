// Napis med čakanjem na odgovor inštruktorja (j, 16. 11. 2026, zunanji pregledi posnetkov s telefona: »po
// pošiljanju samo utripajoča pika 6–10 s, po »Razloži podrobneje« ~4 s nič«). Takoj ob piki »Pripravljam
// razlago …« (podrobneje: »Pripravljam podrobnejšo razlago …«); pravo fazo »Preverjam odgovor …« pove strežnik
// z dogodkom phase, ko koda ali pregled res preverja račun. Napis ni del odgovora in izgine, ko se odgovor začne.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import sl from "../public/i18n/sl.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };
const META = '\n<<META subject=KEM topic="-" error=0 mode=A flag=none done=0>>';
const KEYS = ["chat.wait", "chat.waitDeep", "chat.waitCheck"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function events(body) {
  return body
    .split("\n\n")
    .filter(Boolean)
    .map((c) => ({ event: /^event: (.*)$/m.exec(c)?.[1], data: JSON.parse(/^data: (.*)$/m.exec(c)?.[1] || "null") }));
}

async function withApp(streamFn, fn) {
  const app = createApp(openDb(":memory:"), { scheduler: false, streamFn, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

test("besedila: tri nova besedila v vseh 33 jezikih, kratka in brez »strežnik/model«", () => {
  assert.equal(sl["chat.wait"], "Pripravljam razlago …");
  assert.equal(sl["chat.waitDeep"], "Pripravljam podrobnejšo razlago …");
  assert.equal(sl["chat.waitCheck"], "Preverjam odgovor …");
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  const langs = readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(langs.length, 32);
  for (const f of langs) {
    const ui = JSON.parse(readFileSync(new URL(f, dir), "utf8"));
    for (const k of KEYS) {
      assert.ok(ui[k] && ui[k] !== sl[k], `${f}: ${k}`);
      assert.ok(ui[k].length <= 48, `${f}: ${k} je predolg`);
    }
  }
});

test("strežnik: dogodek phase »check«, ko koda preverja račun iz bloka RACUN (pred done); brez preverjanja ga ni", async () => {
  const withBlock = "Enačba je urejena: $2H_2 + O_2 \\to 2H_2O$.\n<<RACUN\nkemija: 2 H2 + O2 -> 2 H2O\n>>" + META;
  const plain = "Gostota je masa na prostornino." + META;
  const streamFn = async ({ messages, onText }) => {
    const last = JSON.stringify(messages.at(-1));
    const text = /H2/.test(last) ? withBlock : plain;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn" };
  };
  await withApp(streamFn, async (base) => {
    const post = (p, body) => fetch(base + p, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body || {}) });
    const s = await (await post("/api/students", { name: "Ana" })).json();
    const ask = async (text) => {
      const c = await (await post(`/api/students/${s.id}/conversations`)).json();
      return events(await (await post(`/api/conversations/${c.id}/messages`, { text })).text());
    };
    const ev = await ask("Uredi enačbo H2 + O2 -> H2O");
    const names = ev.map((e) => e.event);
    const at = names.indexOf("phase");
    assert.ok(at > -1, names.join(","));
    // »check«, ko koda preverja, in »answer«, ko konča (napis ne ostane do konca), oboje pred done.
    assert.deepEqual(ev.filter((e) => e.event === "phase").map((e) => e.data.phase), ["check", "answer"]);
    assert.ok(names.lastIndexOf("phase") < names.indexOf("done"));
    // Brez bloka in brez preverjanja: nobene faze (napis ostane »Pripravljam razlago …«, nič izmišljenega).
    assert.ok(!(await ask("Kaj je gostota?")).some((e) => e.event === "phase"));
  });
});

test("odjemalec: »answer« odstrani napis pod odgovorom; novo sporočilo prekliče čakajočo podrobnejšo razlago", () => {
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  const send = app.slice(app.indexOf("async function send(text"), app.indexOf("// --- varnostni odgovor"));
  assert.match(send, /if \(d\?\.phase === "answer"\) \{[\s\S]{0,200}bubble\.classList\.remove\("checking"\);[\s\S]{0,120}return paint\(shownText\);/);
  assert.match(send, /state\.sendSeq = \(state\.sendSeq \|\| 0\) \+ 1;/);
  const deep = app.slice(app.indexOf("function addDeepButton("), app.indexOf("function addFullButton("));
  assert.match(deep, /if \(state\.sendSeq !== seq\) return b\.remove\(\);/);
});

test("telefon 360 px: napis takoj ob pošiljanju, izgine ob odgovoru; »Razloži podrobneje« se takoj odzove", opts, async () => {
  const reply = "Gostota pove, koliko mase je v enoti prostornine." + META;
  const streamFn = async ({ onText, deep }) => {
    await sleep(deep ? 1800 : 1500); // počasen začetek odgovora (posnetki: 6–10 s)
    onText(reply);
    return { content: [{ type: "text", text: reply }], text: reply, stopReason: "end_turn" };
  };
  await withApp(streamFn, async (base) => {
    for (const mode of ["light", "dark"]) {
      const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
      await ctx.addInitScript((mode) => {
        localStorage.setItem("evklid.tour", "1");
        localStorage.setItem("evklid.lang", "sl");
        localStorage.setItem("evklid.theme", JSON.stringify({ style: "cist", mode }));
      }, mode);
      const p = await ctx.newPage();
      const napake = [];
      p.on("pageerror", (e) => napake.push(e.message));
      await p.goto(base + "/healthz");
      const id = await p.evaluate(() =>
        fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Čaka", settings: { school: "SREDNJA_SOLA", grade: "1. letnik", interests: [] } }) })
          .then((r) => r.json())
          .then((s) => s.id),
      );
      await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
      await p.goto(base + "/");
      await p.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
      await p.evaluate(() => document.querySelector('.tab[data-view="chat"]').click());
      await p.waitForSelector("#input", { state: "visible", timeout: 30000 });
      await p.fill("#input", `Kaj je gostota (${mode})?`); // drugačno vprašanje: skupni predpomnilnik odgovorov bi odgovoril takoj
      await p.locator("#send").tap();
      const note = p.locator(".msg.assistant.typing .wait-note");
      await note.waitFor({ timeout: 1000 }); // takoj, ne šele ob odgovoru
      assert.equal(await note.innerText({ timeout: 1000 }), "Pripravljam razlago …");
      assert.equal(await p.evaluate(() => !!document.querySelector(".wait-note").closest('[aria-live="polite"]')), true, "bralnik zaslona ga prebere");
      const lh0 = await note.evaluate((e) => getComputedStyle(e).lineHeight + getComputedStyle(e).fontSize);
      if (process.env.CAKANJE_POSNETEK) await p.screenshot({ path: `${process.env.CAKANJE_POSNETEK}/a-cakanje-${mode}.png` });
      await p.waitForSelector(".msg.assistant:not(.typing) .deep-btn", { timeout: 20000 });
      assert.equal(await p.locator(".wait-note").count(), 0, "napis ni del odgovora");
      const lh1 = await p.locator(".msg.assistant").last().evaluate((e) => getComputedStyle(e.querySelector("p")).lineHeight + getComputedStyle(e.querySelector("p")).fontSize);
      assert.equal(lh1, lh0, "napis ima isto velikost kot odstavek odgovora (ob začetku odgovora se nič ne premakne)");
      // »Razloži podrobneje«: takoj pritisnjen ali že napis podrobnejše razlage, nikoli nič.
      await p.locator(".deep-btn").first().tap();
      await p.waitForFunction(() => document.querySelector(".deep-btn.pressed[disabled]") || [...document.querySelectorAll(".wait-note")].some((e) => e.textContent === "Pripravljam podrobnejšo razlago …"), null, { timeout: 300 });
      await p.waitForFunction(() => [...document.querySelectorAll(".wait-note")].some((e) => e.textContent === "Pripravljam podrobnejšo razlago …"), null, { timeout: 2000 });
      if (process.env.CAKANJE_POSNETEK) await p.screenshot({ path: `${process.env.CAKANJE_POSNETEK}/a-podrobneje-${mode}.png` });
      await p.waitForFunction(() => document.querySelectorAll(".msg.assistant:not(.typing)").length >= 2 && !document.querySelector(".wait-note"), null, { timeout: 20000 });
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "brez vodoravnega drsenja");
      assert.deepEqual(napake, []);
      await ctx.close();
    }
  });
});

test.after(() => chromium?.close());
