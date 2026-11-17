// Iz #792 (j 17. 11.: obdrži #793 in vzemi dobre dele #792): konkretna vprašanja razreda kot dodatni predlogi
// (public/predlogi.js CONCRETE), »Druga šola ali stopnja …« v glavi, iskanje brez presledkov, »Nariši graf« samo pri
// grafu, koda sporočila samo v obrazcu prijave, kratek namig v polju, seznam razredov pri 360 px.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { PATHS } from "../server/curriculum-data.js";
import { CONCRETE, UNI_SUBJECTS, concreteKeys, chatIdeas } from "../public/predlogi.js";
import { plottableFromText, worthGraph } from "../public/graph/math.js";
import sl from "../public/i18n/sl.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const UI = new URL("../public/i18n/ui/", import.meta.url);
const ui = Object.fromEntries(readdirSync(UI).filter((f) => f.endsWith(".json")).map((f) => [f.replace(".json", ""), JSON.parse(readFileSync(new URL(f, UI), "utf8"))]));
const SHOTS = process.env.STOPNJA_POSNETEK || "";
const titles = (key) => PATHS[key].units.flatMap(([, ts]) => ts.map((x) => x.split(" | ")[0]));

test("konkretna vprašanja: vsako iz teme učnega načrta tega razreda, besedila v 33 jezikih", () => {
  for (const [key, topics] of Object.entries(CONCRETE)) {
    if (/^MAT-OS-[1-5]$/.test(key)) {
      assert.ok(!PATHS[key], `${key}: pot zdaj obstaja, vpiši teme`);
      continue;
    }
    assert.equal(topics.length, 3, key);
    for (const tp of topics) assert.ok(titles(key).includes(tp), `${key}: tema »${tp}« ni v učnem načrtu`);
  }
  assert.ok(titles("MAT-SS-4").includes("Matematična indukcija"));
  for (const key of Object.keys(PATHS).filter((k) => /^[A-Z]+-(OS|SS)-\d$/.test(k))) assert.ok(CONCRETE[key], `${key}: brez konkretnih vprašanj`);
  const all = [...Object.keys(CONCRETE).flatMap((k) => [1, 2, 3].map((n) => `start.${k}.${n}`)), "start.MAT-SS-4-VR.3", ...UNI_SUBJECTS.flatMap((s) => [1, 2, 3].map((n) => `start.${s}-UNI.${n}`))];
  assert.equal(all.length, 112);
  for (const key of [...all, "chat.levelOther", "chat.placeholderShort"]) {
    assert.ok(sl[key], key);
    for (const [l, d] of Object.entries(ui)) assert.ok(d[key] && (d[key] !== sl[key] || ["hr", "bs", "sr"].includes(l)), `${l}: ${key}`);
  }
  // Popravki po pregledu #792.
  assert.equal(sl["start.BIO-OS-9.1"], "Kaj pomeni, da je alel dominanten?");
  assert.equal(sl["start.KEM-OS-9.1"], "Kolikšna je množina snovi v 36 g vode?");
  assert.equal(sl["start.MAT-OS-3.3"], "Koliko minut je dve uri in pol?");
  assert.equal(sl["start.BIO-SS-4.3"], "Kaj pove Hardy-Weinbergovo ravnovesje?");
  assert.equal(sl["start.BIO-OS-8.1"], "Kakšna je naloga mitohondrijev?");
});

test("konkretna vprašanja: razred, raven, predmet, fakulteta, drug sistem; brez poti so edini predlogi", () => {
  const k = (s) => concreteKeys(s)[0]?.replace(/\.\d$/, "");
  assert.equal(k({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "FIZ" }), "start.FIZ-SS-4");
  assert.deepEqual(concreteKeys({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "MAT" }), ["start.MAT-SS-4.1", "start.MAT-SS-4.2", "start.MAT-SS-4-VR.3"]);
  assert.equal(k({ educational_track: "OSNOVNA_SOLA", curriculum_level: "3. razred", subject: "FIZ" }), "start.MAT-OS-3");
  assert.equal(k({ educational_track: "OSNOVNA_SOLA", curriculum_level: "7. razred", subject: "BIO" }), "start.NAR-OS-7");
  assert.equal(k({ educational_track: "UNIVERZA", curriculum_level: "1. letnik", subject: "KEM" }), "start.KEM-UNI");
  assert.deepEqual(concreteKeys({ educational_track: "UNIVERZA", curriculum_level: "1. letnik", subject: "INF" }), []);
  assert.equal(k({ school_system: "IN-CBSE", educational_track: "SREDNJA_SOLA", curriculum_level: "Class 11", subject: "FIZ" }), "start.FIZ-SS-2");
  assert.deepEqual(concreteKeys({}), []);
  const t = (x) => x;
  assert.deepEqual(chatIdeas({ educational_track: "OSNOVNA_SOLA", curriculum_level: "2. razred", subject: "MAT" }, null, t, () => 0.3).slice().sort(), ["start.MAT-OS-2.1", "start.MAT-OS-2.2", "start.MAT-OS-2.3"]);
  // S potjo: kdaj pa kdaj eno konkretno vprašanje med predlogi iz tem.
  const path = { next: { id: "a", name: "Nihanje" }, topics: [{ id: "a", name: "Nihanje" }, { id: "b", name: "Valovanje" }, { id: "c", name: "Zvok" }] };
  let n = 0;
  for (let i = 0; i < 40; i++) {
    let x = i + 1;
    const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
    const ideas = chatIdeas({ educational_track: "SREDNJA_SOLA", curriculum_level: "3. letnik OR", subject: "FIZ" }, path, t, rnd);
    assert.equal(ideas.length, 3);
    n += ideas.filter((s) => s.startsWith("start.FIZ-SS-3.")).length;
  }
  assert.ok(n > 5 && n < 40, `konkretna v ${n} od 40`);
});

test("glava: razredi v izbiri imajo ime (»8. razred«), ne številke (#793 je dal indeks map kot napis)", async () => {
  globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
  const { levelChoices } = await import("../public/level-picker.js");
  assert.deepEqual(levelChoices({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" }).map((x) => x.label).slice(6, 9), ["7. razred", "8. razred", "9. razred"]);
  assert.deepEqual(levelChoices({ educational_track: "UNIVERZA", study_program: "UL-FKKT-KEM", curriculum_level: "1. letnik" }).map((x) => x.label)[0], "1. letnik");
});

test("glava, graf, koda, namig in nastavitve (koda)", () => {
  const app = read("public/app.js");
  const fn = app.slice(app.indexOf("function renderState("), app.indexOf("async function wireStatePicks("));
  assert.match(fn, /opt\("other", t\("chat\.levelOther"\), false\)/);
  assert.match(app, /e\.target\.value === "other"\) return renderState\(null\), openSchoolSettings\(\)/);
  assert.match(app, /\$\("#me-head"\)\?\.addEventListener\("click", \(\) => openSchoolSettings\(\)\)/);
  assert.match(read("public/dropdown.js"), /replace\(\/\\s\+\/g, ""\)\.toLowerCase\(\)/);
  // »Nariši graf« samo pri zvezi z y ali f(x).
  const has = (s) => plottableFromText(s).some(worthGraph);
  assert.equal(has("Prištej $-1$: $x + 1 = 5$, torej $x = 4$."), false);
  assert.equal(has("Graf $y = 2x - 1$ je premica."), true);
  assert.equal(has("Naj bo $f(x) = x^2 - 3$."), true);
  assert.match(app, /if \(!exprs\.some\(worthGraph\)/);
  // Koda samo v obrazcu prijave; napis navaden, monospace samo koda.
  const foot = app.slice(app.indexOf("function addMsgFoot("), app.indexOf("function openReport("));
  assert.doesNotMatch(foot, /msg-code/);
  assert.match(read("public/prijave.js"), /<p class="rep-code muted" hidden><span><\/span> <span class="msg-code"><\/span><\/p>/);
  // Kratek namig v obstoječem prilagajanju (ne drugo prilagajanje).
  assert.equal((app.match(/getContext\("2d"\)/g) || []).length >= 1, true);
  assert.match(app, /const short = t\("chat\.placeholderShort"\);/);
  assert.doesNotMatch(app, /function fitPlaceholder/);
  // Shranjene nastavitve osvežijo predloge praznega klepeta.
  const save = app.slice(app.indexOf('$("#settings-form").addEventListener("submit"'), app.indexOf('$("#settings-form").addEventListener("submit"') + 3000);
  assert.match(save, /if \(ideasKey\(before\) !== ideasKey\(updated\.settings\)\) refreshIdeas\(\);/);
});

async function withApp(fn) {
  const reply = 'Rešitev: $x + 1 = 5$, torej $x = 4$.\n<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>';
  const streamFn = async ({ onText }) => (onText(reply), { content: [{ type: "text", text: reply }], text: reply, stopReason: "end_turn" });
  const server = createApp(openDb(":memory:"), { scheduler: false, streamFn, log: { error() {}, warn() {}, info() {} } }).listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

async function open(base, settings, mode = "dark") {
  const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
  await ctx.addInitScript((mode) => {
    localStorage.setItem("evklid.tour", "1");
    localStorage.setItem("evklid.lang", "sl");
    localStorage.setItem("evklid.theme", JSON.stringify({ style: "cist", mode }));
  }, mode);
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base + "/healthz");
  const id = await p.evaluate((settings) => fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Nika", settings: { interests: [], ...settings } }) }).then((r) => r.json()).then((s) => s.id), settings);
  await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
  await p.goto(base + "/");
  await p.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
  await p.evaluate(() => document.querySelector('.tab[data-view="chat"]').click());
  await p.waitForSelector("#messages .ideas .idea", { timeout: 30000 });
  return { ctx, p, errors };
}

test("telefon 360 px: seznam razredov pokaže razrede pred izbranim, skupine in ime; graf, koda in namig", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await open(base, { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" });
    // Namig v polju je cel (kratek), nič odrezano.
    const ph = await p.$eval("#input", (el) => el.placeholder);
    assert.equal(ph, "Napiši nalogo");
    // Seznam razredov: izbran 8. razred, vidni so tudi razredi pred njim, zadnja »Druga šola ali stopnja …«.
    await p.locator('#chat-state [data-pick="level"]').locator("xpath=..").locator(".dd-btn").tap();
    const list = p.locator(".dd-list");
    await list.waitFor();
    assert.equal(await list.getAttribute("aria-label"), "Šola in letnik");
    const visible = await p.$$eval(".dd-list .dd-opt:not([hidden])", (els) => {
      const box = document.querySelector(".dd-list").getBoundingClientRect();
      return els.filter((e) => {
        const r = e.getBoundingClientRect();
        return r.top >= box.top - 1 && r.bottom <= box.bottom + 1;
      }).map((e) => e.textContent.trim());
    });
    assert.ok(visible.includes("7. razred"), visible.join(" | "));
    assert.ok(visible.length >= 4, visible.join(" | "));
    assert.ok(visible.includes("Druga šola ali stopnja …"));
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/b-razredi-dark.png` });
    await p.keyboard.press("Escape");
    // Skupine z imenom (raven pri SŠ ima izbirnik ravni; tu preverimo skupine v izbirniku predmeta ali ravni, če so).
    const grp = await p.evaluate(() => {
      const sel = document.createElement("select");
      sel.setAttribute("aria-label", "Preizkus");
      sel.innerHTML = '<optgroup label="A"><option>1</option></optgroup><optgroup label="B"><option>2</option></optgroup>';
      document.body.append(sel);
      return import("/dropdown.js").then((m) => {
        m.enhanceSelect(sel);
        sel.closest(".dd").querySelector(".dd-btn").click();
        const g = [...document.querySelectorAll('.dd-list [role="group"]')].map((x) => document.getElementById(x.getAttribute("aria-labelledby"))?.textContent);
        return g;
      });
    });
    assert.deepEqual(grp, ["A", "B"]);
    await p.keyboard.press("Escape");
    // Odgovor »x = 4«: brez »Nariši graf«; koda samo v obrazcu prijave.
    await p.fill("#input", "Koliko je x, če je x + 1 = 5?");
    await p.locator("#send").tap();
    await p.waitForSelector(".msg.assistant:not(.typing) .msg-report", { timeout: 20000 });
    await p.waitForTimeout(800);
    assert.equal(await p.locator(".graph-btn").count(), 0);
    assert.equal(await p.locator(".msg-foot .msg-code").count(), 0);
    await p.locator(".msg-report").tap();
    assert.match(await p.locator(".report-box .rep-code").innerText(), /^Koda sporočila: #[0-9A-Z]{4}$/);
    assert.equal(await p.$eval(".report-box .rep-code > span:first-child", (e) => getComputedStyle(e).fontFamily.includes("monospace")), false);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/b-prijava-koda-dark.png` });
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test.after(() => chromium?.close());
