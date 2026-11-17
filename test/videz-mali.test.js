// Drobni popravki videza (j, 17. 11. 2026): vprašalnik zanimanj, obvestila, zapiski, »← Jaz«, spodnja vrstica,
// mehurček inštruktorja in datumi. Vsak preizkus pade na stari različici.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync } from "node:fs";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import sl from "../public/i18n/sl.js";
import zapSl from "../public/zapiski/sl.js";
import { dateText, SL_MONTH } from "../public/datum.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 300000 };
const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>';
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const uiDir = new URL("../public/i18n/ui/", import.meta.url);
const LANGS = readdirSync(uiDir).filter((f) => f.endsWith(".json"));
const ui = Object.fromEntries(LANGS.map((f) => [f.replace(".json", ""), JSON.parse(readFileSync(new URL(f, uiDir), "utf8"))]));

test("datumi: v slovenščini mesec v rodilniku (»23. novembra 2026«), drugje Intl; vsa mesta uporabljajo isti pomočnik", () => {
  const d = new Date(2026, 10, 23, 12);
  assert.equal(dateText(d, "sl-SI"), "23. novembra 2026");
  assert.equal(dateText(d, "sl", { day: "numeric", month: "long" }), "23. novembra");
  assert.equal(dateText(d, "sl", { weekday: "long", day: "numeric", month: "long" }), "ponedeljek, 23. novembra");
  assert.equal(dateText(d, "en"), "November 23, 2026");
  assert.equal(dateText("ni datum", "sl"), "");
  assert.equal(SL_MONTH.length, 12);
  for (const f of ["account.js", "garancija-ui.js", "flashcards.js", "corner.js", "zapiski/zapiski.js", "pilot-naloge.js"]) {
    const src = read(`public/${f}`);
    assert.ok(!/toLocaleDateString\([^)]*month: "long"/.test(src), `${f}: datum z mesecem prek dateText`);
    assert.match(src, /from "\.\.?\/datum\.js"/, f);
  }
});

test("besedila: »Shranjeno« brez ✓ (kljukica je ikona), poskusni izpit brez »0 izbirnih«, kratek napis zavihka, zapiski brez kartic", () => {
  for (const [lang, d] of [["sl", sl], ...Object.entries(ui)]) {
    assert.ok(!/✓/.test(d["common.saved"]), `${lang}: common.saved`);
    assert.ok(d["exam.mockTextNoChoice"] && !d["exam.mockTextNoChoice"].includes("{choice}"), `${lang}: exam.mockTextNoChoice`);
    for (const k of ["{tasks}", "{minutes}", "{max}"]) assert.ok(d["exam.mockTextNoChoice"].includes(k), `${lang}: ${k}`);
    assert.ok(d["nav.competitionShort"], `${lang}: nav.competitionShort`);
  }
  assert.equal(ui.en["nav.competitionShort"], "Contests");
  assert.equal(zapSl["zap.notKeptNoCards"], "Prilepljenega besedila nismo shranili.");
  const zdir = new URL("../public/zapiski/i18n/", import.meta.url);
  for (const f of readdirSync(zdir)) {
    const d = JSON.parse(readFileSync(new URL(f, zdir), "utf8"));
    for (const k of ["zap.printedNoCards", "zap.notKeptNoCards"]) assert.ok(d[k] && d[k].length < d[k.replace("NoCards", "")].length, `${f}: ${k}`);
  }
});

async function withApp(fn) {
  const streamFn = async ({ onText }) => {
    const text = "Seštej enice, nato desetice." + META;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn" };
  };
  const app = createApp(openDb(":memory:"), { scheduler: false, streamFn, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}
async function phone(base, settings, { tour = true } = {}) {
  const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, serviceWorkers: "block" });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base + "/healthz");
  const id = await p.evaluate(
    (st) => fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Nika", settings: st }) }).then((r) => r.json()).then((s) => s.id),
    { interests: [], ...settings },
  );
  await p.evaluate(([id, tour]) => (localStorage.setItem("studentId", String(id)), tour && localStorage.setItem("evklid.tour", "1")), [id, tour]);
  await p.goto(base + "/");
  await p.waitForSelector(settings.interests === null ? ".iq-wrap" : "#view-path #xp-card .hero", { timeout: 60000 });
  return { ctx, p, id, errors };
}
const OS = { educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred", subject: "MAT" };
const toastShown = (p) => p.evaluate(() => !document.querySelector("#toast").hidden && document.querySelector("#toast").textContent);

test("brskalnik (360 px): vprašalnik, obvestila, »←« na Urniku in NPZ, poskusni izpit, zapiski, spodnja vrstica, mehurček", opts, async () => {
  await withApp(async (base) => {
    // 1b + 4: prvi zagon – »Pozneje« tudi na 2. in 3. koraku; po shranjevanju ni obvestila (skrila bi ga kartica ogleda).
    {
      const { ctx, p, errors } = await phone(base, { ...OS, interests: null, first_task: 1 }, { tour: false });
      await p.click('[data-iq="next"]');
      assert.equal(await p.locator('[data-iq="skip"]').count(), 1, "2. korak: Pozneje");
      assert.equal(await p.locator('[data-iq="back"]').count(), 1);
      await p.click('[data-iq="next"]');
      assert.equal(await p.locator('[data-iq="skip"]').count(), 1, "3. korak: Pozneje");
      await p.click('[data-iq="save"]');
      await p.waitForSelector(".iq-wrap", { state: "detached" });
      await p.waitForTimeout(300);
      assert.notEqual(await toastShown(p), sl["iq.saved"], "brez »Zanimanja so shranjena« ob prvem zagonu");
      assert.deepEqual(errors, []);
      await ctx.close();
    }
    const { ctx, p, errors } = await phone(base, OS);
    // 9b + 9c: »Shranjeno« z eno kljukico (ikona); obvestilo ne ostane po menjavi pogleda.
    await p.evaluate(() => window.evklid.showView("cards"));
    await p.fill('#fc-add [name="front"]', "Kaj je ulomek?");
    await p.fill('#fc-add [name="back"]', "Del celote.");
    await p.click("#fc-add button.primary");
    await p.waitForFunction(() => !document.querySelector("#toast").hidden);
    assert.equal(await p.evaluate(() => [document.querySelector("#toast").textContent.trim(), document.querySelectorAll("#toast svg").length].join("|")), `${sl["common.saved"]}|1`);
    await p.waitForTimeout(700);
    await p.click('#tabbar [data-view="me"]');
    assert.equal(await toastShown(p), false, "obvestilo izgine ob menjavi pogleda");
    // 10d: Urnik in NPZ z Učne poti → »← Učna pot« in nazaj na Učno pot; z Jaz → »← Jaz«.
    await p.click('#tabbar [data-view="path"]');
    for (const view of ["schedule", "exams"]) {
      await p.evaluate((v) => window.evklid.showView(v), view);
      const back = p.locator(`#view-${view} .me-back`).first();
      await back.waitFor();
      assert.equal((await back.innerText()).trim(), sl["nav.path"], `${view}: oznaka`);
      await back.click();
      assert.equal(await p.locator("#view-path").isVisible(), true, `${view}: nazaj na Učno pot`);
      await p.click('#tabbar [data-view="me"]');
      await p.evaluate((v) => window.evklid.showView(v), view);
      await p.locator(`#view-${view} .me-back`).first().waitFor();
      assert.equal((await p.locator(`#view-${view} .me-back`).first().innerText()).trim(), sl["nav.me"], `${view}: z Jaz`);
      await p.locator(`#view-${view} .me-back`).first().click();
      assert.equal(await p.locator("#view-me").isVisible(), true);
      await p.click('#tabbar [data-view="path"]');
    }
    // 10b: NPZ 9 matematika nima izbirnih nalog → brez »(od tega 0 izbirnih)«.
    await p.evaluate(() => window.evklid.showView("exams"));
    await p.waitForSelector("#view-exams .contest-head");
    const mock = await p.locator("#view-exams .contest-head p.muted").first().innerText();
    assert.ok(!/izbirnih/.test(mock) && /vprašanj/.test(mock), mock);
    // 9e + 9a: zapiski – kvota strani na zaslonu za lepljenje; brez kartic obvestilo ne obljublja kartic.
    await p.evaluate(() => window.evklid.showView("path"));
    await p.route("**/zapiski", (r) =>
      r.request().method() === "POST"
        ? r.fulfill({ json: { note: { id: 1, title: "Ulomki", topics: [], text: "", cards: 0, set: "Ulomki" }, quiz: [], cards: [], not_kept: true } })
        : r.fallback(),
    );
    await p.evaluate(async () => {
      const box = document.createElement("div");
      box.id = "zap-test";
      document.querySelector("#view-path").prepend(box);
      const api = async (url, o = {}) => (await fetch(url, { method: o.method || "GET", headers: { "content-type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined })).json();
      const st = await (await fetch(`/api/students/${localStorage.getItem("studentId")}`)).json();
      const m = await import("/zapiski/zapiski.js");
      await m.showZapiski({ api, renderRich: (x) => x, escapeHtml: (x) => String(x), toast() {}, getStudent: () => st, box: () => box, back() {} });
    });
    await p.click('#zap-test [data-act="paste"]');
    await p.waitForSelector("#zap-test textarea");
    const quota = await p.locator("#zap-test .zap-check").innerText();
    assert.match(quota, /Strani ta mesec: še \d+ od \d+/, "kvota strani pri lepljenju");
    await p.fill("#zap-test textarea", "Ulomek je del celote. Števec in imenovalec.");
    await p.click("#zap-test .zap-check button.primary");
    await p.waitForSelector("#zap-test .zap-cards");
    const res = await p.locator("#zap-test").innerText();
    assert.ok(res.includes(zapSl["zap.notKeptNoCards"]) && !res.includes(zapSl["zap.notKept"]), "brez »samo snov in kartice«");
    await p.evaluate(() => document.querySelector("#zap-test").remove());
    // 11a: spodnja vrstica pri 360 px: v nobenem od 33 jezikov se beseda ne prelomi sredi besede (»Competition|s«).
    const dicts = { sl, ...ui };
    const broken = await p.evaluate((dicts) => {
      const spans = [...document.querySelectorAll("#tabbar .tab:not([hidden]) span")];
      const out = [];
      for (const [lang, d] of Object.entries(dicts)) {
        document.documentElement.lang = lang;
        for (const [key, s] of [["nav.path", spans[0]], ["nav.learn", spans[1]], ["nav.chat", spans[2]], ["nav.competitionShort", spans[3]], ["goal.npz", spans[3]], ["goal.matura", spans[3]], ["nav.exams", spans[3]], ["nav.me", spans[4]]]) {
          s.textContent = d[key] || "";
          const tn = s.firstChild;
          const lh = parseFloat(getComputedStyle(s).lineHeight);
          if (s.getBoundingClientRect().height > lh * 2 + 2) out.push(`${lang} ${key}: več kot 2 vrstici`);
          for (const m of tn ? tn.data.matchAll(/\S+/g) : []) {
            const r = document.createRange();
            r.setStart(tn, m.index);
            r.setEnd(tn, m.index + m[0].length);
            if (new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size > 1) out.push(`${lang} ${key}: »${m[0]}«`);
          }
        }
      }
      return out;
    }, dicts);
    assert.deepEqual(broken, []);
    const tab4 = await p.evaluate(() => document.querySelector("#competition-tab-m span").dataset.i18n);
    assert.equal(tab4, "nav.competitionShort");
    // 11d: mehurček inštruktorja ne prekrije polj in gumbov v Nastavitvah (po drsenju se umakne).
    await p.reload();
    await p.waitForSelector("#view-path #xp-card .hero");
    await p.click('#tabbar [data-view="chat"]');
    await p.fill("#input", "Koliko je 12 + 30?");
    await p.click("#send");
    await p.waitForSelector(".msg.assistant:not(.typing)");
    await p.evaluate(() => window.evklid.showView("settings"));
    await p.waitForSelector(".chat-bubble:not([hidden])");
    const bubbleY = await p.evaluate(() => document.querySelector(".chat-bubble").getBoundingClientRect().top);
    for (const sel of ['#view-settings input[type="date"]', "#view-settings button.primary[type=submit]"]) {
      await p.evaluate(([sel, y]) => {
        const el = document.querySelector(sel);
        window.scrollBy(0, el.getBoundingClientRect().top - y);
      }, [sel, bubbleY]);
      await p.waitForTimeout(1100);
      const cover = await p.evaluate(() => {
        const b = document.querySelector(".chat-bubble").getBoundingClientRect();
        return [...document.querySelectorAll("#view-settings :is(input, select, textarea, button, a[href], [role=button], [role=switch])")]
          .filter((el) => el.offsetParent)
          .map((el) => [el, el.getBoundingClientRect()])
          .filter(([, r]) => r.width && b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top)
          .map(([el]) => el.outerHTML.slice(0, 80));
      });
      assert.deepEqual(cover, [], `${sel}: mehurček prekrije`);
    }
    assert.deepEqual(errors, []);
    await ctx.close();
  });
});
