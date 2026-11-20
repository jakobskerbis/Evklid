// Dolg pogovor se odpre takoj, tap »Pošlji« ne zamrzne strani (docs/meritve/prijavljen-mobilno-2026-11-19.md, 1. in
// 3. točka). Ob odprtju se izriše le zadnjih 20 sporočil brez meritev po sporočilu, starejša pa ob drsenju navzgor, ne
// da bi se vidni del premaknil. Tap »Pošlji« doda oba mehurčka brez sinhronih meritev (formule in pomik na dno v
// naslednji sličici).
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };
const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>';
const N = 60; // sporočil v pogovoru (30 vprašanj in 30 odgovorov)

test("odjemalec: openConversation ne meri po sporočilu, send meri v naslednji sličici", () => {
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  const open = app.slice(app.indexOf("async function openConversation("), app.indexOf("// Telefon: seznam pogovorov"));
  assert.doesNotMatch(open, /for \(const m of conv\.messages\) addMessage/, "ne addMessage z meritvami za vsako sporočilo");
  assert.match(open, /addMessage\(m\.role, m\.text, m\.has_image, m, \{ meri: false \}\)/);
  assert.equal(open.match(/prilagodiZdaj\(\)/g).length, 3, "enkrat ob odprtju, enkrat po prihodu knjižnic za formule (samo, če so še prihajale) in enkrat na kos starejših");
  const send = app.slice(app.indexOf("async function send(text"), app.indexOf("// --- varnostni odgovor"));
  assert.match(send, /userEl = addMessage\("user", text, !!image, null, \{ meri: false \}\);\n\s+naDnoRaf = requestAnimationFrame\(naDno\);/);
  assert.match(send, /bubble = addMessage\("assistant", "", false, null, \{ meri: false \}\);/);
  assert.doesNotMatch(send, /paint\("", true\)/, "prvi izris napisa brez meritve");
});

// Varnostni zaznavalnik je ob prvem klicu v seji prevajal nekaj tisoč vzorcev (telefon ~0,8 s v tapu »Pošlji«).
// ogrej() jih prevede vnaprej, po kosih; zaznavanje mora ostati enako kot brez njega (primerjava z ločenim procesom).
test("zaznavalnik: ogrej() po kosih prevede vzorce, rezultati zaznavanja ostanejo enaki", async () => {
  const nabor = (k) => {
    const j = JSON.parse(readFileSync(new URL(`./nujno-nabor-${k}.json`, import.meta.url), "utf8"));
    return (j.primeri || j).map((x) => x.text);
  };
  const besedila = [...nabor("d"), ...nabor("e"), "Kako rešim enačbo 3(x − 2) = 2x + 5? Ne vem, kaj naredim z oklepajem.", "Moj brat ima 40 stopinj vročine", "ne zdržim več"];
  const pot = new URL("../public/nujno.js", import.meta.url).href;
  const koda = "const m = await import(process.env.NUJNO); const b = JSON.parse(process.env.BESEDILA); process.stdout.write(JSON.stringify(b.map((t) => [m.zaznajNujno(t), m.izsiljevanje(t)])));";
  const { execFileSync } = await import("node:child_process");
  const brez = execFileSync(process.execPath, ["--input-type=module", "-e", koda], { env: { ...process.env, NUJNO: pot, BESEDILA: JSON.stringify(besedila) } }).toString();
  const rezultati = (m) => JSON.stringify(besedila.map((t) => [m.zaznajNujno(t), m.izsiljevanje(t)]));
  const m = await import("../public/nujno.js");
  let kosov = 0;
  while (!m.ogrej(5)) kosov++;
  assert.ok(kosov > 1, "po kosih, ne v eni dolgi nalogi");
  assert.equal(m.ogrej(5), true);
  assert.equal(rezultati(m), brez);
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /if \(name === "chat"\) \{[^}]*pripraviZaznavalnik\(\);/);
  // Kos 8–20 ms v času mirovanja; ko čaka dotik ali tipka, ga izpusti (nikoli dolgo opravilo ob interakciji).
  assert.match(app, /const kos = \(\) => whenIdle\(\(d\) => \(navigator\.scheduling\?\.isInputPending\?\.\(\) \? kos\(\) : ogrejNujno\(Math\.min\(20, Math\.max\(8, \(d\?\.timeRemaining\?\.\(\) \?\? 0\) - 2\)\)\) \|\| kos\(\)\)\);/);
  // Zaznavalnik je statično uvožen (pregled varnosti #888): na voljo takoj ob pošiljanju, brez povezave in ob zavrnitvi.
  assert.match(app, /^import \{ zaznajNujno,[^\n]*\} from "\.\/nujno\.js";$/m);
  assert.doesNotMatch(app, /lenModul\("\.\/nujno\.js"\)/);
});

test("dolg pogovor: zadnjih 20 takoj in na dnu, starejša ob drsenju navzgor brez premika; Pošlji brez sinhronih meritev", opts, async () => {
  const reply = "Rešitev je $x = 4$, ker $2x + 1 = 9$." + META;
  const streamFn = async ({ onText }) => {
    await new Promise((r) => setTimeout(r, 300));
    onText(reply);
    return { content: [{ type: "text", text: reply }], text: reply, stopReason: "end_turn" };
  };
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, streamFn, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await chromium.newContext({ viewport: { width: 1280, height: 800 }, locale: "sl-SI", serviceWorkers: "block" });
  try {
    const st = await (await fetch(base + "/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Zgodovina", settings: { school: "SREDNJA_SOLA", grade: "1. letnik", interests: [] } }) })).json();
    const conv = store.createConversation(st.id, { title: "Dolg pogovor" });
    for (let i = 1; i <= N; i++) {
      const user = i % 2 === 1;
      const text = user ? `Vprašanje ${i}: koliko je $${i} + x = ${2 * i}$?` : `Odgovor ${i}: $x = ${i / 2}$, ker je $\\frac{${i}}{2} + ${i / 2} = ${i}$.\n\nDrugi odstavek odgovora ${i}.`;
      store.addMessage(conv.id, user ? "user" : "assistant", [{ type: "text", text }], text);
    }
    await ctx.addInitScript(() => {
      localStorage.setItem("evklid.tour", "1");
      localStorage.setItem("evklid.lang", "sl");
    });
    const p = await ctx.newPage();
    const napake = [];
    p.on("pageerror", (e) => napake.push(e.message));
    await p.goto(base + "/healthz");
    await p.evaluate((id) => localStorage.setItem("studentId", String(id)), st.id);
    await p.goto(base + "/");
    await p.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
    await p.evaluate(() => document.querySelector('.tab[data-view="chat"]').click());
    await p.waitForSelector("#input", { state: "visible", timeout: 30000 });
    await p.locator("#conversation-list li", { hasText: "Dolg pogovor" }).first().click();
    await p.waitForFunction(() => document.querySelectorAll("#messages .msg").length >= 20, null, { timeout: 30000 });
    await p.evaluate(() => document.fonts.ready); // pisave KaTeX: formule po nalaganju pisave spremenijo višino
    await p.waitForTimeout(400);
    const besedila = () => p.evaluate(() => [...document.querySelectorAll("#messages .msg")].map((m) => Number(/^(?:Vprašanje|Odgovor) (\d+)/.exec(m.textContent.trim())?.[1])));
    const stanje = () =>
      p.evaluate(() => {
        const b = document.querySelector("#messages");
        return { odDna: Math.round(b.scrollHeight - b.scrollTop - b.clientHeight), top: b.scrollTop, globlje: document.querySelectorAll("#messages .deep-btn:not(.full-btn)").length };
      });
    // Ob odprtju: zadnjih 20 v pravem vrstnem redu, na dnu, KaTeX izrisan, »Razloži podrobneje« samo pri zadnjem odgovoru.
    assert.deepEqual(await besedila(), Array.from({ length: 20 }, (_, i) => N - 19 + i));
    let s = await stanje();
    assert.ok(s.odDna <= 1, `na dnu (${s.odDna})`);
    assert.equal(s.globlje, 1);
    assert.ok(await p.evaluate(() => !!document.querySelector("#messages .msg.assistant:last-child .deep-btn, #messages .msg.assistant:last-of-type .deep-btn")));
    assert.ok(await p.evaluate(() => document.querySelectorAll("#messages .msg .katex").length >= 20), "formule izrisane");
    // Drsenje navzgor: starejša pridejo nad izrisana, vidno sporočilo ostane na istem mestu na zaslonu.
    for (let krog = 0; krog < 10 && (await besedila()).length < N; krog++) {
      const pred = await p.evaluate(() => {
        const b = document.querySelector("#messages");
        b.scrollTop = Math.min(b.scrollTop, 40);
        const el = document.querySelector("#messages .msg");
        return { y: el.getBoundingClientRect().top, txt: el.textContent.slice(0, 20), n: document.querySelectorAll("#messages .msg").length };
      });
      await p.waitForFunction((n) => document.querySelectorAll("#messages .msg").length > n, pred.n, { timeout: 5000 });
      await p.waitForTimeout(100);
      const po = await p.evaluate((txt) => [...document.querySelectorAll("#messages .msg")].find((m) => m.textContent.startsWith(txt)).getBoundingClientRect().top, pred.txt);
      assert.ok(Math.abs(po - pred.y) < 2, `vidni del se ni premaknil (le zaokrožitev pod pikslom) (${pred.y} → ${po})`);
    }
    assert.deepEqual(await besedila(), Array.from({ length: N }, (_, i) => i + 1), "vsa sporočila v pravem vrstnem redu");
    s = await stanje();
    assert.equal(s.globlje, 1, "starejši odgovori nimajo »Razloži podrobneje«");
    // Pošlji: v istem opravilu nobenega branja postavitve (scrollHeight, getComputedStyle, getBoundingClientRect).
    await p.evaluate(() => (document.querySelector("#messages").scrollTop = 0));
    await p.fill("#input", "Koliko je $3x = 12$?");
    const meritve = await p.evaluate(() => {
      let n = 0;
      const stej = (proto, ime) => {
        const d = Object.getOwnPropertyDescriptor(proto, ime);
        if (d.get) Object.defineProperty(proto, ime, { ...d, get() { n++; return d.get.call(this); } });
        else Object.defineProperty(proto, ime, { ...d, value(...a) { n++; return d.value.apply(this, a); } });
        return () => Object.defineProperty(proto, ime, d);
      };
      const nazaj = [stej(Element.prototype, "scrollHeight"), stej(Element.prototype, "clientHeight"), stej(Element.prototype, "getBoundingClientRect"), stej(HTMLElement.prototype, "offsetHeight"), stej(window, "getComputedStyle")];
      document.querySelector("#composer").requestSubmit();
      nazaj.forEach((f) => f());
      return { n, mehurcki: document.querySelectorAll("#messages .msg.user").length, napis: !!document.querySelector(".msg.assistant.typing .wait-note"), vnos: document.querySelector("#input").value };
    });
    assert.deepEqual(meritve, { n: 0, mehurcki: N / 2 + 1, napis: true, vnos: "" }, "mehurček takoj, brez sinhronih meritev");
    // Naslednja sličica: na dnu, formula v učenčevem mehurčku izrisana.
    await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0))));
    s = await stanje();
    assert.ok(s.odDna <= 1, `po pošiljanju na dnu (${s.odDna})`);
    await p.waitForSelector(".msg.assistant:not(.typing) .deep-btn", { timeout: 20000 });
    await p.waitForTimeout(300);
    s = await stanje();
    assert.ok(s.odDna <= 1, `odgovor na dnu (${s.odDna})`);
    assert.equal(s.globlje, 1);
    assert.deepEqual(napake, []);
  } finally {
    await ctx.close();
    server.close();
  }
});

test.after(() => chromium?.close());
