// Inštruktor: stopnja, raven in začetna vprašanja (j, 16. 11. 2026, zunanji pregledi posnetkov s telefona).
// B1 raven matematike in »Druga šola ali stopnja …« v glavi, B2 začetna vprašanja po predmetu, razredu in ravni,
// B3 krajši napis v polju (360 px, 33 jezikov), B4 »Nariši graf« samo, kjer ima graf smisel, B5 koda sporočila
// samo v obrazcu prijave.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { PATHS } from "../server/curriculum-data.js";

globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { levelChoices } = await import("../public/level-picker.js");
const { STARTERS, VR_EXTRA, VR_TOPICS, starterKeys } = await import("../public/zacetna-vprasanja.js");
const { plottableFromText, worthGraph } = await import("../public/graph/math.js");
const sl = (await import("../public/i18n/sl.js")).default;

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const UI = new URL("../public/i18n/ui/", import.meta.url);
const LANGS = readdirSync(UI).filter((f) => f.endsWith(".json"));
const ui = Object.fromEntries(LANGS.map((f) => [f.replace(".json", ""), JSON.parse(readFileSync(new URL(f, UI), "utf8"))]));
const SHOTS = process.env.STOPNJA_POSNETEK || "";

const titles = (key) => PATHS[key].units.flatMap(([, ts]) => ts.map((x) => x.split(" | ")[0]));

test("B2: vsako začetno vprašanje je iz teme učnega načrta tega razreda in predmeta", () => {
  for (const [key, topics] of Object.entries(STARTERS)) {
    assert.equal(topics.length, 3, key);
    if (/^MAT-OS-[1-5]$/.test(key)) {
      assert.ok(!PATHS[key], `${key}: pot zdaj obstaja, vpiši teme`);
      continue;
    }
    assert.ok(PATHS[key], `${key}: ni poti`);
    for (const tp of topics) assert.ok(titles(key).includes(tp), `${key}: tema »${tp}« ni v učnem načrtu`);
  }
  assert.ok(titles("MAT-SS-4").includes(VR_TOPICS["MAT-SS-4-VR.3"]));
  // Vse poti OŠ in SŠ iz učnega načrta imajo začetna vprašanja (nova pot brez njih → test pade).
  for (const key of Object.keys(PATHS).filter((k) => /^[A-Z]+-(OS|SS)-\d$/.test(k))) assert.ok(STARTERS[key], `${key}: brez začetnih vprašanj`);
});

test("B2: predmet, razred, raven, fakulteta in drug šolski sistem izberejo prava vprašanja", () => {
  const k = (s, subj) => starterKeys(s, subj)[0].replace(/\.\d$/, "");
  assert.equal(k({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" }, "MAT"), "start.MAT-OS-8");
  assert.equal(k({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR" }, "FIZ"), "start.FIZ-SS-4");
  assert.deepEqual(starterKeys({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR" }, "MAT"), ["start.MAT-SS-4.1", "start.MAT-SS-4.2", "start.MAT-SS-4-VR.3"]);
  assert.deepEqual(starterKeys({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik OR" }, "MAT"), ["start.MAT-SS-4.1", "start.MAT-SS-4.2", "start.MAT-SS-4.3"]);
  assert.equal(k({ educational_track: "OSNOVNA_SOLA", curriculum_level: "3. razred" }, "FIZ"), "start.MAT-OS-3", "v 1.–5. razredu samo matematika");
  assert.equal(k({ educational_track: "OSNOVNA_SOLA", curriculum_level: "7. razred" }, "BIO"), "start.NAR-OS-7");
  assert.equal(k({ educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred" }, "NAR"), "start.FIZ-OS-9");
  assert.equal(k({ educational_track: "UNIVERZA", curriculum_level: "1. letnik", study_program: "UL-FKKT-KEM" }, "KEM"), "start.KEM-UNI");
  assert.deepEqual(starterKeys({ educational_track: "UNIVERZA", curriculum_level: "2. letnik" }, "INF"), ["chat.idea1", "chat.idea2", "chat.idea3"]);
  assert.equal(k({ school_system: "IN-CBSE", educational_track: "SREDNJA_SOLA", curriculum_level: "Class 11" }, "FIZ"), "start.FIZ-SS-2", "11. leto šolanja → 2. letnik");
  assert.equal(k({}, "MAT"), "start.MAT-OS-8");
  // Vsak ključ ima besedilo v slovenščini in v vseh 32 drugih jezikih (prevedeno, ne slovensko).
  const all = new Set([...Object.keys(STARTERS).flatMap((key) => [1, 2, 3].map((n) => `start.${key}.${n}`)), ...Object.values(VR_EXTRA).flat().map((x) => `start.${x}`)]);
  for (const s of ["MAT", "FIZ", "KEM", "BIO"]) for (const n of [1, 2, 3]) all.add(`start.${s}-UNI.${n}`);
  assert.equal(all.size, 112);
  for (const key of all) {
    assert.ok(sl[key], key);
    // Hrvaščina, bosanščina in srbščina imajo lahko enako besedilo (»Koliko je 7 + 5?«); drugi jeziki ne.
    for (const [l, d] of Object.entries(ui)) assert.ok(d[key] && (d[key] !== sl[key] || ["hr", "bs", "sr"].includes(l)), `${l}: ${key}`);
  }
});

test("B1: v glavi letniki obeh ravni matematike in »Druga šola ali stopnja …«", () => {
  const vr = levelChoices({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR" });
  assert.equal(vr.length, 8);
  assert.deepEqual(vr.map((x) => x.settings.curriculum_level).slice(0, 5), ["1. letnik OR", "2. letnik OR", "3. letnik OR", "4. letnik OR", "1. letnik VR"]);
  assert.deepEqual([...new Set(vr.map((x) => x.group))], [sl["lp.or"], sl["lp.vr"]]);
  assert.equal(vr.find((x) => x.current).settings.curriculum_level, "4. letnik VR");
  const app = read("public/app.js");
  const fn = app.slice(app.indexOf("function renderState("), app.indexOf("// Formule v odgovorih inštruktorja"));
  assert.match(fn, /opt\("other", t\("chat\.levelOther"\), false\)/);
  assert.match(fn, /e\.target\.value === "other"\) return renderState\(null\), openSchoolSettings\(\)/);
  assert.match(app, /\$\("#me-head"\)\?\.addEventListener\("click", \(\) => openSchoolSettings\(\)\)/, "ista pot kot Jaz → Šola in letnik");
  // Iskanje v izbirnem seznamu ne upošteva presledkov: »4.letni« najde »4. letnik VR«.
  assert.match(read("public/dropdown.js"), /replace\(\/\\s\+\/g, ""\)\.toLowerCase\(\)/);
});

test("B4: »Nariši graf« samo pri zvezi z y ali funkciji f(x), ne pri rešitvi x = 4", () => {
  const has = (t) => plottableFromText(t).some(worthGraph);
  assert.equal(has("Prištej $-1$: $x + 1 = 5$, torej $x = 4$."), false);
  assert.equal(has("Rešitev neenačbe je $x > 3$."), false);
  assert.equal(has("Graf $y = 2x - 1$ je premica."), true);
  assert.equal(has("Naj bo $f(x) = x^2 - 3$."), true);
  assert.equal(has("Krožnica $x^2 + y^2 = 25$."), true);
  assert.match(read("public/app.js"), /if \(!exprs\.some\(worthGraph\)/);
});

test("B5: koda sporočila ni pod odgovorom, je v obrazcu prijave z napisom »Koda sporočila«", () => {
  const app = read("public/app.js");
  const foot = app.slice(app.indexOf("function addMsgFoot("), app.indexOf("function openReport("));
  assert.doesNotMatch(foot, /msg-code/);
  const rep = app.slice(app.indexOf("function openReport("), app.indexOf("function openReport(") + 2500);
  assert.match(rep, /`\$\{t\("rep\.code"\)\}: \$\{foot\.dataset\.code\}`/);
});

async function withApp(fn) {
  const reply = "Rešitev: $x + 1 = 5$, torej $x = 4$.\n<<META subject=MAT topic=\"-\" error=0 mode=A flag=none done=0>>";
  const streamFn = async ({ onText }) => (onText(reply), { content: [{ type: "text", text: reply }], text: reply, stopReason: "end_turn" });
  const server = createApp(openDb(":memory:"), { scheduler: false, streamFn, log: { error() {}, warn() {}, info() {} } }).listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

async function open(base, { mode = "dark", lang = "sl", settings }) {
  const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
  await ctx.addInitScript(
    ([mode, lang]) => {
      localStorage.setItem("evklid.tour", "1");
      localStorage.setItem("evklid.lang", lang);
      localStorage.setItem("evklid.theme", JSON.stringify({ style: "cist", mode }));
    },
    [mode, lang],
  );
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base + "/healthz");
  const id = await p.evaluate(
    (settings) => fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Nika", settings: { interests: [], ...settings } }) }).then((r) => r.json()).then((s) => s.id),
    settings,
  );
  await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
  await p.goto(base + "/");
  await p.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
  await p.evaluate(() => document.querySelector('.tab[data-view="chat"]').click());
  await p.waitForSelector("#messages .ideas .idea", { timeout: 30000 });
  return { ctx, p, errors };
}

test("telefon 360 px: 4. letnik VR s fiziko, menjava predmeta, napis v polju, »Nariši graf« in koda", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p, errors } = await open(base, { settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "FIZ" } });
    const ideas = () => p.$$eval("#messages .ideas .idea", (b) => b.map((x) => x.textContent));
    assert.deepEqual(await ideas(), ["Kaj je fotoefekt?", "Kaj pomeni razpolovni čas?", "Kako nastanejo zvezde?"]);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/b-zacetna-fiz-4vr-dark.png` });
    // Letnik v glavi (3. letnik OR) zamenja vprašanja: fizika 3. letnika.
    await p.evaluate(async () => {
      const sel = document.querySelector('#chat-state [data-pick="level"]');
      sel.value = String([...sel.options].findIndex((o) => o.textContent === "3. letnik OR"));
      sel.dispatchEvent(new Event("change"));
    });
    await p.waitForFunction(() => document.querySelector("#messages .ideas .idea")?.textContent === "Kako izračunam nihajni čas nitnega nihala?", null, { timeout: 10000 });
    const lvl = await p.$eval('#chat-state [data-pick="level"]', (s) => ({ groups: [...s.querySelectorAll("optgroup")].map((g) => g.label), last: s.options[s.options.length - 1].textContent }));
    assert.deepEqual(lvl.groups, ["Osnovna raven", "Višja raven"]);
    assert.equal(lvl.last, "Druga šola ali stopnja …");
    // Napis v polju je cel (ni odrezan) pri 360 px.
    const fit = await p.$eval("#input", (el) => {
      const cs = getComputedStyle(el);
      const c = document.createElement("canvas").getContext("2d");
      c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      return { text: el.placeholder, need: c.measureText(el.placeholder).width, have: el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) };
    });
    assert.match(fit.text, /^Napiši (ali slikaj )?nalogo$/);
    assert.ok(fit.need <= fit.have, JSON.stringify(fit));
    // Odgovor »x + 1 = 5, torej x = 4«: brez »Nariši graf«; koda samo v obrazcu prijave.
    await p.fill("#input", "Koliko je x, če je x + 1 = 5?");
    await p.locator("#send").tap();
    await p.waitForSelector(".msg.assistant:not(.typing) .msg-report", { timeout: 20000 });
    await p.waitForTimeout(800);
    assert.equal(await p.locator(".graph-btn").count(), 0);
    assert.equal(await p.locator(".msg-foot .msg-code").count(), 0);
    await p.locator(".msg-report").tap();
    assert.match(await p.locator(".report-box .msg-code").innerText(), /^Koda sporočila: #[0-9A-Z]{4}$/);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/b-prijava-koda-dark.png` });
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});

test("B3: napis v polju gre cel v polje pri 360 px v vseh 33 jezikih (sicer kratek napis)", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p } = await open(base, { mode: "light", settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" } });
    const all = { sl: sl["chat.placeholderShort"], ...Object.fromEntries(Object.entries(ui).map(([l, d]) => [l, d["chat.placeholderShort"]])) };
    const res = await p.$eval(
      "#input",
      (el, all) => {
        const cs = getComputedStyle(el);
        const c = document.createElement("canvas").getContext("2d");
        c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const have = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        return Object.entries(all).map(([l, s]) => ({ l, s, need: Math.ceil(c.measureText(s).width), have }));
      },
      all,
    );
    assert.deepEqual(res.filter((r) => r.need > r.have), [], "odrezan kratek napis");
    // Prikazan napis je cel; oznaka za bralnik zaslona ostane dolga.
    const shown = await p.$eval("#input", (el) => ({ ph: el.placeholder, aria: el.getAttribute("aria-label") }));
    assert.equal(shown.ph, "Napiši nalogo");
    assert.equal(shown.aria, "Napiši ali slikaj nalogo");
    // Na širšem zaslonu cel napis.
    await p.setViewportSize({ width: 1280, height: 800 });
    await p.waitForFunction(() => document.querySelector("#input").placeholder === "Napiši ali slikaj nalogo", null, { timeout: 5000 });
    await ctx.close();
  });
});

test.after(() => chromium?.close());
