// Vsak klik takoj (j 15. 11. 2026: »vse se ob kliku odpre takoj«; meritev scripts/meritev-zmogljivosti.mjs --samo kliki):
// tema z Učne poti brez čakanja strežnika (vsebina in stanje vnaprej, sicer oba klica hkrati in »Nalagam …«), naslednja
// naloga vadnice pripravljena pred klikom, Lige in Kartice z vnaprej prenesenimi podatki, kalkulator z vsemi datotekami
// hkrati (ne raven za ravnijo uvozov), pogovor s seznama prenesen že ob dotiku.
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { moduleDeps } from "../server/startup-files.js";

const require = createRequire(import.meta.url);
const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };
test.after(() => chromium?.close());
const tiho = { error() {}, warn() {}, info() {} };
const pocakaj = (ms) => new Promise((ok) => setTimeout(ok, ms));

// Strežnik in učenec 8. razreda z dvema temama v učenju (zgled že videl, ena naloga čaka).
async function pripravi(t, { viewport = { width: 390, height: 844 } } = {}) {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: tiho });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const ctx = await chromium.newContext({ viewport, hasTouch: true, isMobile: viewport.width < 600, locale: "sl-SI", serviceWorkers: "block" });
  t.after(async () => {
    await ctx.close();
    server.close();
  });
  await ctx.addInitScript(() => localStorage.setItem("evklid.tour", "done"));
  const p = await ctx.newPage();
  const napake = [];
  p.on("pageerror", (e) => napake.push(e.message));
  await p.goto(base + "/healthz");
  const u = await p.evaluate(async () => {
    const j = (r) => r.json();
    const post = (url, body) => fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(j);
    const s = await post("/api/students", { name: "Klik", settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT", tour_version: 99, interests: [], game_childhood: [] } });
    const pot = await fetch(`/api/students/${s.id}/path`).then(j);
    const teme = pot.units.flatMap((x) => x.topics).filter((x) => x.practice).slice(0, 2);
    for (const tp of teme) for (let i = 0; i < 2; i++) await post(`/api/students/${s.id}/practice/next`, { topic_id: tp.id });
    return { id: s.id, teme: teme.map((x) => x.id), pot: pot.key };
  });
  await p.evaluate((id) => localStorage.setItem("studentId", String(id)), u.id);
  return { p, base, u, napake, store };
}

// Zahteve na naslov (z zamikom, ko je zamik > 0): seznam časov začetka.
async function pocasi(p, vzorec, stanje) {
  await p.route(vzorec, async (route) => {
    stanje.zahteve.push({ url: route.request().url(), t: Date.now() });
    if (stanje.zamik) await pocakaj(stanje.zamik);
    await route.continue().catch(() => {});
  });
}

test("strežnik: naloga vadnice vnaprej ne pokaže zgleda in ne spremeni nove teme; potem ista naloga kot ob kliku", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: tiho });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const post = (url, body) => fetch(base + url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json());
    const s = await post("/api/students", { name: "Vnaprej", settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" } });
    const pot = await fetch(`${base}/api/students/${s.id}/path`).then((r) => r.json());
    const tp = pot.units.flatMap((x) => x.topics).find((x) => x.practice);
    // Nova tema (zgled še ni bil pokazan): vnaprej nič, stanje ostane »new«.
    assert.deepEqual(await post(`/api/students/${s.id}/practice/next`, { topic_id: tp.id, vnaprej: true }), { vnaprej: false });
    const st = () => store.db.prepare("SELECT status, seen_example FROM topic_state WHERE student_id = ? AND topic_id = ?").get(s.id, tp.id);
    assert.ok(!st() || (st().status === "new" && !st().seen_example), JSON.stringify(st()));
    // Klik pokaže zgled kot prej.
    assert.ok((await post(`/api/students/${s.id}/practice/next`, { topic_id: tp.id })).example);
    // Zdaj vnaprej da nalogo (tema v učenju: stanje teme ostane enako), klik pa isto nalogo (nerešena naloga počaka),
    // brez nove vrstice; čas naloge je čas klika, ne priprave (tedensko poročilo, server/rast.js štejeta po created_at).
    const vse = () => store.db.prepare("SELECT * FROM topic_state WHERE student_id = ? AND topic_id = ?").get(s.id, tp.id);
    const stanjePrej = JSON.stringify(vse());
    const a = await post(`/api/students/${s.id}/practice/next`, { topic_id: tp.id, vnaprej: true });
    assert.ok(a.task?.id);
    assert.equal(JSON.stringify(vse()), stanjePrej, "vnaprej ne spremeni stanja teme");
    store.db.prepare("UPDATE tasks SET created_at = '2000-01-01 00:00:00' WHERE id = ?").run(a.task.id);
    const n = () => store.db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE student_id = ?").get(s.id).n;
    const prej = n();
    const b = await post(`/api/students/${s.id}/practice/next`, { topic_id: tp.id });
    assert.equal(b.task.id, a.task.id);
    assert.equal(n(), prej);
    const cas = store.db.prepare("SELECT created_at FROM tasks WHERE id = ?").get(a.task.id).created_at;
    assert.ok(cas > "2020", `čas naloge ob kliku (${cas})`);
    // Nedotaknjena naloga za drugo stopnjo (npr. po preizkusu predznanja): klik da novo nalogo za trenutno stopnjo.
    const stopnja = store.db.prepare("SELECT level FROM tasks WHERE id = ?").get(a.task.id).level;
    store.db.prepare("UPDATE tasks SET level = level + 1 WHERE id = ?").run(a.task.id);
    const c = await post(`/api/students/${s.id}/practice/next`, { topic_id: tp.id });
    assert.equal(store.db.prepare("SELECT level FROM tasks WHERE id = ?").get(c.task.id).level, stopnja, "nova naloga za trenutno stopnjo");
    assert.notEqual(c.task.id, a.task.id, "nova naloga z drugo številko");
    assert.equal(n(), prej);
    // Naloga s poskusom ostane taka, kot je (čas in naloga).
    store.db.prepare("UPDATE tasks SET attempts = 1, created_at = '2000-01-01 00:00:00' WHERE id = ?").run(c.task.id);
    const d = await post(`/api/students/${s.id}/practice/next`, { topic_id: tp.id });
    assert.equal(d.task.id, c.task.id);
    assert.equal(store.db.prepare("SELECT created_at FROM tasks WHERE id = ?").get(c.task.id).created_at, "2000-01-01 00:00:00");
  } finally {
    server.close();
  }
});

test("strežnik: /lene-odvisnosti.js našteje vse statične odvisnosti lenih modulov", async () => {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: tiho });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const r = await fetch(`${base}/lene-odvisnosti.js`);
    assert.equal(r.status, 200);
    assert.match(r.headers.get("content-type"), /javascript/);
    const map = JSON.parse((await r.text()).replace(/^export default /, "").replace(/;\s*$/, ""));
    for (const e of ["graph/sci.js", "graph/calc.js", "graph/tools.js", "games/index.js"]) {
      assert.equal(map[e][0], `/${e}`);
      assert.deepEqual(map[e], moduleDeps(PUBLIC, e));
    }
    assert.ok(map["graph/sci.js"].includes("/graph/scicore.js"), "odvisnost druge ravni");
    assert.ok(map["games/index.js"].length > 20);
  } finally {
    server.close();
  }
});

test("Učna pot → tema: odprtje brez čakanja strežnika; nepripravljena tema takoj »Nalagam …«, oba klica hkrati", opts, async (t) => {
  const { p, u, napake } = await pripravi(t);
  const tema = { zahteve: [], zamik: 0 };
  const pot = { zahteve: [], zamik: 0 };
  await pocasi(p, "**/api/topic?*", tema);
  await pocasi(p, `**/api/students/${u.id}/path?key=*`, pot);
  await p.goto(p.url().replace("/healthz", "/"));
  await p.waitForSelector(`#view-path .node.learning[data-open="${u.teme[0]}"]`);
  // Teme v učenju se v miru prenesejo vnaprej.
  for (let i = 0; i < 100 && !tema.zahteve.some((z) => z.url.includes(encodeURIComponent(u.teme[0]))); i++) await p.waitForTimeout(50);
  await p.waitForTimeout(500);
  tema.zamik = pot.zamik = 3000;
  const prej = tema.zahteve.length + pot.zahteve.length;
  const t0 = Date.now();
  await p.tap(`#view-path .node[data-open="${u.teme[0]}"]`);
  await p.waitForSelector("#topic-content .topic-head h1", { timeout: 2000 });
  assert.ok(Date.now() - t0 < 1500, `tema po ${Date.now() - t0} ms`);
  assert.equal(tema.zahteve.length + pot.zahteve.length, prej, "brez nove zahteve za temo ali pot");
  assert.ok(await p.locator("#t-practice").isVisible(), "stanje teme (vaje) iz Učne poti");

  // Tema, ki ni bila vnaprej (osvojena ali nova niso med vnaprejšnjimi): pogled takoj, »Nalagam …«, pot hkrati s temo.
  await p.click("#back-to-path");
  await p.waitForSelector("#view-path .node");
  const druga = await p.evaluate(() => [...document.querySelectorAll("#view-path .node.new[data-open]")].map((b) => b.dataset.open).at(-1));
  // Brez shranjene poti (sprememba na strežniku jo razveljavi): pot gre na strežnik hkrati s temo.
  await p.evaluate(() => fetch("/api/healthz").catch(() => null));
  tema.zahteve.length = pot.zahteve.length = 0;
  await p.evaluate((id) => document.querySelector(`#view-path .node[data-open="${id}"]`).dispatchEvent(new MouseEvent("click", { bubbles: true })), druga);
  await p.waitForFunction(() => !document.querySelector("#view-topic").hidden, null, { timeout: 500 });
  assert.match(await p.locator("#topic-content").innerText(), /Nalagam/);
  await p.waitForSelector("#topic-content .topic-head h1", { timeout: 10000 });
  assert.equal(tema.zahteve.length, 1);
  assert.deepEqual(napake, []);
});

test("Tema → Vadi in »Naprej«: naloga je pripravljena pred klikom (strežnik ne zadrži)", opts, async (t) => {
  const { p, u, napake } = await pripravi(t);
  const vaje = { zahteve: [], zamik: 0 };
  await pocasi(p, `**/api/students/${u.id}/practice/next`, vaje);
  await p.goto(p.url().replace("/healthz", "/"));
  await p.waitForSelector(`#view-path .node[data-open="${u.teme[0]}"]`);
  await p.tap(`#view-path .node[data-open="${u.teme[0]}"]`);
  await p.waitForSelector("#t-practice");
  for (let i = 0; i < 100 && !vaje.zahteve.length; i++) await p.waitForTimeout(50);
  await p.waitForTimeout(500);
  assert.equal(vaje.zahteve.length, 1, "naloga vnaprej ob odprti temi");
  vaje.zamik = 3000;
  const t0 = Date.now();
  await p.tap("#t-practice");
  await p.waitForSelector("#practice .task .task-text", { timeout: 2000 });
  assert.ok(Date.now() - t0 < 1500, `naloga po ${Date.now() - t0} ms`);
  assert.equal(vaje.zahteve.length, 1, "klik ne gre na strežnik");
  // Napačni odgovori do rešenega zgleda, nato »Podobna naloga« takoj.
  vaje.zamik = 0;
  for (let i = 0; i < 4 && !(await p.locator("#fb-next").isVisible()); i++) {
    if (await p.locator("#fb-retry").isVisible()) await p.click("#fb-retry");
    if (await p.locator("#answer").isVisible()) {
      await p.fill("#answer", String(987654 + i));
      await p.click("#practice .answer-row button.primary");
    } else await p.locator("#practice .choice:not([disabled])").first().click();
    await p.waitForSelector("#feedback .fb.bad, #feedback .fb.ok, #feedback #fb-next", { timeout: 10000 });
  }
  await p.waitForSelector("#fb-next");
  for (let i = 0; i < 100 && vaje.zahteve.length < 2; i++) await p.waitForTimeout(50);
  await p.waitForTimeout(300);
  vaje.zamik = 3000;
  const stara = await p.locator("#practice .task-text").first().innerText();
  const t1 = Date.now();
  await p.click("#fb-next");
  await p.waitForFunction((s) => document.querySelector("#practice .task-text")?.innerText !== s && !document.querySelector("#feedback")?.textContent.trim(), stara, { timeout: 2000 });
  assert.ok(Date.now() - t1 < 1500, `naslednja po ${Date.now() - t1} ms`);
  assert.equal(vaje.zahteve.length, 2, "»Naprej« ne gre na strežnik");
  assert.deepEqual(napake, []);
});

test("Jaz → Lige in Učna pot → Kartice: podatki že na napravi, odprtje brez čakanja", opts, async (t) => {
  const { p, u, napake } = await pripravi(t);
  const liga = { zahteve: [], zamik: 0 };
  const kartice = { zahteve: [], zamik: 0 };
  await pocasi(p, `**/api/students/${u.id}/league`, liga);
  await pocasi(p, `**/api/students/${u.id}/flashcards?*`, kartice);
  await p.goto(p.url().replace("/healthz", "/"));
  await p.waitForSelector("#view-path .node");
  for (let i = 0; i < 100 && !kartice.zahteve.length; i++) await p.waitForTimeout(50);
  assert.equal(kartice.zahteve.length, 1, "kartice vnaprej na Učni poti");
  kartice.zamik = 3000;
  let t0 = Date.now();
  await p.click('#modebar [data-mode="cards"]');
  await p.waitForSelector("#view-cards .fc-back", { timeout: 2000 });
  assert.ok(Date.now() - t0 < 1500, `kartice po ${Date.now() - t0} ms`);
  assert.equal(kartice.zahteve.length, 1);

  await p.evaluate(() => document.querySelector('#tabbar .tab[data-view="me"]').click());
  await p.waitForSelector('#view-me [data-go="league"]');
  for (let i = 0; i < 100 && !liga.zahteve.length; i++) await p.waitForTimeout(50);
  assert.equal(liga.zahteve.length, 1, "liga vnaprej, ko je odprt »Jaz«");
  await p.waitForTimeout(300);
  liga.zamik = 3000;
  t0 = Date.now();
  await p.click('#view-me [data-go="league"]');
  await p.waitForSelector("#league-content .league-hero", { timeout: 2000 });
  assert.ok(Date.now() - t0 < 1500, `lige po ${Date.now() - t0} ms`);
  assert.equal(liga.zahteve.length, 1);
  // Drugo odprtje (podatki porabljeni) gre znova na strežnik: lestvica ni stara.
  liga.zamik = 0;
  await p.evaluate(() => document.querySelector('#tabbar .tab[data-view="path"]').click());
  await p.evaluate(() => document.querySelector('#tabbar .tab[data-view="league"], .tab[data-view="league"]').click());
  for (let i = 0; i < 100 && liga.zahteve.length < 2; i++) await p.waitForTimeout(50);
  assert.equal(liga.zahteve.length, 2);
  assert.deepEqual(napake, []);
});

test("Kalkulator: vse datoteke orodja se začnejo prenašati hkrati, ne raven za ravnijo uvozov", opts, async (t) => {
  const { p, napake } = await pripravi(t);
  const graf = { zahteve: [], zamik: 400 };
  await pocasi(p, "**/graph/*.js", graf);
  await p.goto(p.url().replace("/healthz", "/"));
  await p.waitForSelector("#view-path .node");
  // Seznam odvisnosti je v miru že naložen.
  await p.waitForFunction(() => performance.getEntriesByType("resource").some((e) => e.name.includes("/lene-odvisnosti.js")), null, { timeout: 15000 });
  const zacetek = graf.zahteve.length;
  await p.evaluate(() => localStorage.setItem("evklid.calcMode", "sci"));
  await p.evaluate(() => document.querySelector('#tabbar .tab[data-view="me"]').click());
  await p.click('#view-me [data-go="graph"]');
  await p.waitForSelector("#graph-slot > * button", { timeout: 20000 });
  const z = graf.zahteve.slice(zacetek);
  const sci = z.filter((x) => /\/graph\/(sci|scicore|scisolve|cas)\.js/.test(x.url));
  assert.ok(sci.length >= 3, z.map((x) => x.url).join(" "));
  // Druga in tretja raven (scicore, cas …) se začneta v istem trenutku kot sci.js, ne 400 ms (zamik ene ravni) pozneje.
  const t0 = Math.min(...sci.map((x) => x.t));
  assert.ok(Math.max(...sci.map((x) => x.t)) - t0 < 300, sci.map((x) => `${x.url.split("/").pop()} +${x.t - t0}`).join(", "));
  assert.deepEqual(napake, []);
});

test("Pogovor s seznama: prenos se začne že ob dotiku (pointerdown), zadnji pogovori vnaprej ob odprtem seznamu", opts, async (t) => {
  const { p, u, napake } = await pripravi(t, { viewport: { width: 1280, height: 800 } });
  // Pet pogovorov s sporočilom (preizkusni način inštruktorja).
  const ids = await p.evaluate(async (sid) => {
    const out = [];
    for (let i = 0; i < 5; i++) {
      const c = await fetch(`/api/students/${sid}/conversations`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }).then((r) => r.json());
      out.push(c.id);
    }
    return out;
  }, u.id);
  const pog = { zahteve: [], zamik: 0 };
  await pocasi(p, "**/api/conversations/*", pog);
  await p.goto(p.url().replace("/healthz", "/"));
  await p.waitForSelector("#view-path .node");
  await p.click('.topbar .tab[data-view="chat"]');
  await p.waitForSelector("#conversation-list li[data-id]");
  for (let i = 0; i < 100 && pog.zahteve.length < 3; i++) await p.waitForTimeout(50);
  assert.ok(pog.zahteve.length >= 3, `vnaprej ${pog.zahteve.length}`);
  // Dotik vrstice, ki ni bila prenesena vnaprej: zahteva že ob pointerdown.
  const zadnji = await p.evaluate(() => [...document.querySelectorAll("#conversation-list li[data-id]")].at(-1).dataset.id);
  const prej = pog.zahteve.filter((z) => z.url.endsWith(`/${zadnji}`)).length;
  const li = p.locator(`#conversation-list li[data-id="${zadnji}"] span`);
  const box = await li.boundingBox();
  await p.mouse.move(box.x + 5, box.y + 5);
  await p.mouse.down();
  for (let i = 0; i < 40 && pog.zahteve.filter((z) => z.url.endsWith(`/${zadnji}`)).length === prej; i++) await p.waitForTimeout(25);
  assert.equal(pog.zahteve.filter((z) => z.url.endsWith(`/${zadnji}`)).length, prej + 1, "prenos ob pointerdown");
  await p.mouse.up();
  await p.waitForFunction((id) => document.querySelector(`#conversation-list li[data-id="${id}"]`)?.classList.contains("active"), zadnji, { timeout: 5000 });
  assert.equal(pog.zahteve.filter((z) => z.url.endsWith(`/${zadnji}`)).length, prej + 1, "klik porabi isti prenos");
  assert.ok(ids.length === 5);
  assert.deepEqual(napake, []);
});

test("Vnaprej prenesen pogovor zastari s sporočilom inštruktorju: po pošiljanju gre klik znova na strežnik", opts, async (t) => {
  // En sam mehanizem vnaprej (kliki.js topli): vsaka sprememba, tudi sporočilo (send gre mimo api()), pobriše vse
  // vnaprej prenesene odgovore (pregled 2 hitrost-skupaj: prej je apiVnaprej po pošiljanju ostal 15 s).
  const { p, u, napake } = await pripravi(t, { viewport: { width: 1280, height: 800 } });
  await p.evaluate(async (sid) => {
    for (let i = 0; i < 3; i++) await fetch(`/api/students/${sid}/conversations`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  }, u.id);
  const pog = { zahteve: [], zamik: 0 };
  await pocasi(p, "**/api/conversations/*", pog);
  await p.goto(p.url().replace("/healthz", "/"));
  await p.waitForSelector("#view-path .node");
  await p.click('.topbar .tab[data-view="chat"]');
  await p.waitForSelector("#conversation-list li[data-id]");
  const get = (id) => pog.zahteve.filter((z) => z.url.endsWith(`/conversations/${id}`)).length;
  const vrstice = () => p.evaluate(() => [...document.querySelectorAll("#conversation-list li[data-id]:not(.active)")].map((li) => li.dataset.id));
  for (let i = 0; i < 100 && (await vrstice()).filter((id) => get(id) > 0).length < 2; i++) await p.waitForTimeout(50);
  // Sporočilo v obstoječem pogovoru (brez novega pogovora, ki bi šel skozi api() kot sprememba): odpremo enega od
  // prenesenih, drugi ostane prenesen vnaprej.
  const [odprt, cilj] = (await vrstice()).filter((id) => get(id) > 0);
  assert.ok(odprt && cilj, "dva pogovora, prenesena vnaprej");
  await p.click(`#conversation-list li[data-id="${odprt}"] span`);
  await p.waitForFunction((id) => document.querySelector(`#conversation-list li[data-id="${id}"]`)?.classList.contains("active"), odprt, { timeout: 5000 });
  await p.waitForTimeout(300);
  const prej = get(cilj);
  await p.fill("#input", "Koliko je 2 + 3?");
  await p.click("#send");
  await p.waitForFunction(() => document.querySelector("#messages .msg.assistant") && !document.querySelector("#send").disabled, null, { timeout: 30000 });
  await p.click(`#conversation-list li[data-id="${cilj}"] span`);
  await p.waitForFunction((id) => document.querySelector(`#conversation-list li[data-id="${id}"]`)?.classList.contains("active"), cilj, { timeout: 5000 });
  assert.equal(get(cilj), prej + 1, "po sporočilu odprtje ne vzame starega prenosa");
  assert.deepEqual(napake, []);
});

test("Učna pot: utrip trenutne teme teče na GPU (samo transform/opacity), ob »manj gibanja« ostane senca pritiska", opts, async (t) => {
  const { p } = await pripravi(t);
  await p.goto(p.url().replace("/healthz", "/"));
  await p.waitForSelector("#view-path .node.current");
  const tece = await p.evaluate(() =>
    document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations === Infinity && a.effect.target?.closest?.("#view-path"))
      .map((a) => ({ ime: a.animationName, lastnosti: [...new Set(a.effect.getKeyframes().flatMap((k) => Object.keys(k).filter((x) => !["offset", "easing", "composite", "computedOffset"].includes(x))))] })),
  );
  assert.ok(tece.some((a) => a.ime === "pulse-krog"), JSON.stringify(tece));
  for (const a of tece) assert.ok(a.lastnosti.every((x) => x === "transform" || x === "opacity"), JSON.stringify(a));
  // Krog je pod piko, enako velik in na istem mestu (sredini se ujemata).
  const lega = await p.evaluate(() => {
    const n = document.querySelector("#view-path .node.current");
    const d = n.querySelector(".node-dot").getBoundingClientRect();
    const s = getComputedStyle(n, "::before");
    const r = n.getBoundingClientRect();
    return { dot: [d.left + d.width / 2 - r.left, d.top + d.height / 2 - r.top, d.width], krog: [parseFloat(s.left) + 27, parseFloat(s.top) + parseFloat(s.marginTop) + 27, parseFloat(s.width)] };
  });
  assert.deepEqual(lega.krog.map(Math.round), lega.dot.map(Math.round));
  await p.emulateMedia({ reducedMotion: "reduce" });
  const senca = await p.evaluate(() => ({
    anim: document.getAnimations().filter((a) => a.effect?.target?.closest?.("#view-path")).length,
    senca: getComputedStyle(document.querySelector("#view-path .node.current .node-dot")).boxShadow,
    krog: getComputedStyle(document.querySelector("#view-path .node.current"), "::before").content,
  }));
  assert.equal(senca.anim, 0);
  assert.equal(senca.krog, "none");
  assert.notEqual(senca.senca, "none");
});

test("Menjava pogleda: vrstica zavihkov se ne meri sredi tapa (--tabbar-h in zgornji zavihki v naslednjem okvirju)", opts, async (t) => {
  const { p, napake } = await pripravi(t);
  await p.goto(p.url().replace("/healthz", "/"));
  await p.waitForSelector("#view-path .node");
  await p.waitForTimeout(500);
  const r = await p.evaluate(async () => {
    let bar = 0;
    let zgoraj = 0;
    const g = window.getComputedStyle;
    window.getComputedStyle = function (el, ...a) {
      if (el?.id === "tabbar") bar++;
      return g.call(this, el, ...a);
    };
    const tabs = document.querySelector(".topbar .tabs");
    const sw = Object.getOwnPropertyDescriptor(Element.prototype, "scrollWidth");
    Object.defineProperty(tabs, "scrollWidth", { configurable: true, get() { zgoraj++; return sw.get.call(this); } });
    document.querySelector('#tabbar .tab[data-view="me"]').click();
    await Promise.resolve(); // opazovalci sprememb (mikroopravila) tečejo še v tapu
    await Promise.resolve();
    const vTapu = { bar, zgoraj };
    await new Promise((ok) => requestAnimationFrame(() => setTimeout(ok, 0)));
    window.getComputedStyle = g;
    delete tabs.scrollWidth;
    const h = document.documentElement.style.getPropertyValue("--tabbar-h");
    return { vTapu, po: { bar, zgoraj }, h, barH: document.querySelector("#tabbar").offsetHeight, vidna: getComputedStyle(document.querySelector("#tabbar")).display !== "none" };
  });
  assert.deepEqual(r.vTapu, { bar: 0, zgoraj: 0 }, JSON.stringify(r));
  assert.ok(r.po.bar >= 1 && r.po.zgoraj >= 1, JSON.stringify(r));
  if (r.vidna) assert.equal(r.h, `${r.barH}px`);
  assert.deepEqual(napake, []);
});

test("Tema: razlaga se ob ponovnem odprtju ne izriše znova (enak HTML brez Markdowna), naloga in liga za sliko tapa", opts, async (t) => {
  const { p, u, napake } = await pripravi(t);
  await p.goto(p.url().replace("/healthz", "/"));
  await p.waitForSelector(`#view-path .node[data-open="${u.teme[0]}"]`);
  await p.waitForFunction(() => window.marked?.parse && window.katex, null, { timeout: 20000 });
  await p.waitForTimeout(1500); // vnaprej v mirovanju
  // Tema z razlago v Markdownu (s formulami).
  const id = await p.evaluate(async () => {
    for (const b of document.querySelectorAll("#view-path .node[data-open]")) {
      const tp = await fetch(`/api/topic?id=${encodeURIComponent(b.dataset.open)}&lang=`).then((r) => r.json());
      if (/\$/.test(tp.explanation || "") && (tp.explanation || "").length > 200) return b.dataset.open;
    }
    return null;
  });
  assert.ok(id, "tema z razlago");
  // Dvakrat odpri in zapri: prvi izris je lahko še nadomestek (oznake formul se nalagajo), drugi se zapomni.
  let prvic = "";
  for (let i = 0; i < 2; i++) {
    await p.evaluate((id) => document.querySelector(`#view-path .node[data-open="${id}"]`).scrollIntoView(), id);
    await p.tap(`#view-path .node[data-open="${id}"]`);
    await p.waitForSelector("#view-topic:not([hidden]) #topic-content .explanation .katex");
    await p.waitForTimeout(500);
    prvic = await p.locator("#topic-content .explanation").innerHTML();
    await p.click("#back-to-path");
    await p.waitForSelector("#view-path:not([hidden]) .node");
  }
  const r = await p.evaluate(async (id) => {
    let n = 0;
    // rich.js bere globalni marked ob vsakem izrisu (lastnost parse je nespremenljiva, zato ovoj celega predmeta)
    const orig = window.marked;
    window.marked = { parse: (...a) => (n++, orig.parse(...a)) };
    const zamenjano = window.marked !== orig;
    document.querySelector(`#view-path .node[data-open="${id}"]`).click();
    const vTapu = !document.querySelector("#view-topic").hidden; // izris pride po sliki tapa
    await new Promise((ok) => {
      const k = () => (document.querySelector("#view-topic:not([hidden]) #topic-content .explanation") ? ok() : setTimeout(k, 20));
      k();
    });
    window.marked = orig;
    return { n, vTapu, zamenjano, html: document.querySelector("#topic-content .explanation").innerHTML };
  }, id);
  assert.equal(r.zamenjano, true, "števec Markdowna");
  assert.equal(r.vTapu, false, "tema iz pomnilnika se pokaže po sliki tapa, ne v njem");
  assert.equal(r.n, 0, "razlaga iz pomnilnika, brez ponovnega Markdowna");
  assert.equal(r.html, prvic);
  assert.deepEqual(napake, []);
});

test("Zbirke: ob nespremenjenih podatkih s strežnika se zaslon ne izriše drugič", opts, async (t) => {
  const { p, napake } = await pripravi(t);
  await p.goto(p.url().replace("/healthz", "/"));
  await p.waitForSelector("#view-path .node");
  await p.evaluate(() => document.querySelector('#tabbar .tab[data-view="me"]').click());
  await p.waitForSelector("#me-zbirke:not([hidden])", { timeout: 15000 }).catch(() => null);
  await p.waitForTimeout(1500);
  const r = await p.evaluate(async () => {
    const root = document.querySelector("#zbirke-content");
    let izrisi = 0;
    new MutationObserver((ms) => ms.some((m) => m.target === root && m.addedNodes.length) && izrisi++).observe(root, { childList: true });
    const odgovor = new Promise((ok) => {
      const f = window.fetch;
      window.fetch = function (url, ...a) {
        const out = f.call(this, url, ...a);
        if (String(url).includes("/zbirke")) out.then(() => setTimeout(ok, 300), ok);
        return out;
      };
    });
    document.querySelector('#view-me [data-go="zbirke"], #me-zbirke').click();
    await odgovor;
    await new Promise((ok) => setTimeout(ok, 300));
    return { izrisi, vsebina: !!root.querySelector(".zb-grid") };
  });
  assert.equal(r.vsebina, true);
  assert.equal(r.izrisi, 1, JSON.stringify(r));
  assert.deepEqual(napake, []);
});
