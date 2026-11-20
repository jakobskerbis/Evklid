// Kamera v Inštruktorju gre vedno skozi skener (j, 17. 11. 2026: »Naj bo v inštruktorju default skener nalog, ki nalogo
// potem preda inštruktorju po pregledu; naj bo samo eden od obkroženih znakov«). Ikona skenerja v glavi je odstranjena,
// »Vprašaj me« (ustno spraševanje) ima svojo ikono, mikrofon v vrstici ostane za narek.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { plainTitle } from "../server/settings.js";
import { TASK_READ_PROMPT } from "../server/scan.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const SHOTS = process.env.SKENER_POSNETEK || "";
const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>';

test("glava: brez ikone skenerja, »Vprašaj me« z ikono vprašanja, mikrofon samo za narek", () => {
  const html = read("public/index.html");
  assert.doesNotMatch(html, /data-open-scan|chat-scan|id="image-input"/);
  assert.match(html, /data-ustno="pogovor"[^>]*><i data-icon="speech"><\/i><\/button>/);
  assert.deepEqual(html.match(/data-icon="mic"/g)?.length, 1, "en mikrofon: #mic-btn (narek)");
  assert.match(html, /id="mic-btn"[^>]*><i data-icon="mic">/);
  assert.match(html, /<button type="button" id="photo-btn" class="icon-btn"[^>]*data-i18n-aria="chat\.photo"><i data-icon="camera"><\/i><\/button>/);
  // Drugje »Vprašaj me« z isto ikono (urnik, lekcija).
  assert.match(read("public/urnik-kartica.js"), /data-ustno="test">\$\{icon\("speech"\)\}/);
  assert.match(read("public/textbook.js"), /data-ustno="\$\{esc\(L\.id\)\}">\$\{ic\("speech"\)\}/);
  assert.match(read("public/icons.js"), /"speech":"<path/);
  // Zaslon Skeniraj zunaj Inštruktorja ostane (Jaz → Skeniraj nalogo).
  assert.match(html, /data-go="scan"/);
});

test("naslov pogovora je berljiv: formule in zapis kalkulatorja brez surovih znakov", () => {
  assert.equal(plainTitle("Reši $\\frac{x+1}{2} = \\frac{3}{4}$."), "Reši (x+1)/2 = 3/4.");
  assert.equal(plainTitle("Pomagaj mi razumeti nalogo 2*(x-3)=x+4."), "Pomagaj mi razumeti nalogo 2·(x-3)=x+4.");
  assert.equal(plainTitle("Telo z $m = 2\\ \\mathrm{kg}$, $x^2 + y^{2} = 25$, $\\sqrt{2} \\cdot \\pi$"), "Telo z m = 2 kg, x² + y² = 25, √2 · π");
  assert.equal(plainTitle("Kaj je gostota?"), "Kaj je gostota?");
});

function server({ readTask, slow = () => 0 }) {
  const seen = [];
  const streamFn = async ({ messages, onText }) => {
    await new Promise((r) => setTimeout(r, slow()));
    const last = messages.at(-1);
    seen.push(Array.isArray(last.content) ? last.content.map((b) => b.type) : ["text"]);
    const text = "Najprej odštej 3 na obeh straneh." + META;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn" };
  };
  const calls = [];
  const scanReadTaskFn = async (a) => (calls.push(a), readTask(a));
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, streamFn, scanReadTaskFn, log: { error() {}, warn() {}, info() {} } });
  return { app, seen, calls, store };
}

test("strežnik: /scan/read-task vrne prepis, skico in več nalog; slaba slika 400; branje se zapiše", async () => {
  assert.match(TASK_READ_PROMPT, /physics, chemistry or biology/);
  const { app, calls, store } = server({ readTask: async () => ({ text: "Reši enačbo $2x + 3 = 11$.", figure: true, more: true, usage: { input_tokens: 2600, output_tokens: 40 }, model: "claude-haiku-5-5" }) });
  const srv = app.listen(0);
  try {
    const base = `http://127.0.0.1:${srv.address().port}`;
    const post = (p, body) => fetch(base + p, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body || {}) });
    const s = await (await post("/api/students", { name: "Ana" })).json();
    assert.equal((await post(`/api/students/${s.id}/scan/read-task`, { image: "x" })).status, 400);
    const r = await post(`/api/students/${s.id}/scan/read-task`, { image: "data:image/jpeg;base64,AAAA" });
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { text: "Reši enačbo $2x + 3 = 11$.", figure: true, more: true, tasks: 2 });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].imageBase64, "AAAA");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM usage WHERE kind = 'skeniranje'").get()?.n, 1);
  } finally {
    srv.close();
  }
});

// Z računi (prijava): meja telesa 10 MB velja tudi za /scan/read-task (prej 413), dnevna meja in izklopljen klepet
// ustavita branje, preden ga plačamo.
test("z računi: fotografija čez 100 kB gre skozi, dnevna meja in izklopljen klepet ustavita branje", async () => {
  const YEAR = new Date().getFullYear();
  const store = openDb(":memory:");
  const mails = [];
  const fetchFn = async (url, init = {}) => {
    const u = new URL(url);
    if (u.host === "api.resend.com") mails.push(JSON.parse(init.body));
    return { ok: true, status: 200, json: async () => ({ id: "x_1", data: [] }) };
  };
  const reads = [];
  const text = "Reši enačbo $2x + 3 = 11$." + META;
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn,
    log: { error() {}, warn() {}, info() {} },
    scanReadTaskFn: async (a) => (reads.push(a), { text: "Reši enačbo $2x + 3 = 11$.", figure: false, usage: null, model: "claude-haiku-5-5" }),
    streamFn: async ({ onText }) => (onText(text), { content: [{ type: "text", text }], text, stopReason: "end_turn" }),
  });
  const srv = app.listen(0);
  const jar = {};
  const base = `http://127.0.0.1:${srv.address().port}`;
  const call = async (path, body) => {
    const res = await fetch(base + path, { method: body ? "POST" : "GET", redirect: "manual", headers: { "content-type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") }, body: body ? JSON.stringify(body) : undefined });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
    }
    return { status: res.status, body: (res.headers.get("content-type") || "").includes("json") ? await res.json() : null };
  };
  const env = { ...process.env };
  try {
    assert.equal((await call("/api/auth/register", { email: "ucenec@primer.si", password: "geslo1234", accept_privacy: true, birth_date: `${YEAR - 17}-03-01` })).status, 201);
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mails.at(-1).text)[0]);
    const kid = await call("/api/students", { name: "Lara", birth_year: YEAR - 17, self: true, consent: true });
    assert.equal(kid.status, 201, JSON.stringify(kid.body));
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z', birth_asked_at = datetime('now')").run();
    const big = "data:image/jpeg;base64," + "A".repeat(300_000); // ~300 kB: nad mejo 100 kB
    const r = await call(`/api/students/${kid.body.id}/scan/read-task`, { image: big });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(reads.length, 1);
    process.env.EVKLID_CHAT_OFF = "1";
    const off = await call(`/api/students/${kid.body.id}/scan/read-task`, { image: big });
    assert.equal(off.status, 503);
    assert.equal(off.body.chat_off, true);
    delete process.env.EVKLID_CHAT_OFF;
    process.env.EVKLID_FREE_DAILY_QUESTIONS = "1";
    const conv = (await call(`/api/students/${kid.body.id}/conversations`, {})).body;
    assert.equal((await call(`/api/conversations/${conv.id}/messages`, { text: "prvo" })).status, 200);
    assert.equal((await call(`/api/students/${kid.body.id}/scan/read-task`, { image: big })).status, 429, "dnevna meja dosežena");
    assert.equal(reads.length, 1, "branje ni bilo plačano");
  } finally {
    for (const k of ["EVKLID_CHAT_OFF", "EVKLID_FREE_DAILY_QUESTIONS"]) env[k] === undefined ? delete process.env[k] : (process.env[k] = env[k]);
    srv.close();
  }
});

test("naslov: sin, log, ln, cos², 2·3·4 in **krepko**", () => {
  assert.equal(plainTitle("$\\sin x = 0,5$"), "sin x = 0,5");
  assert.equal(plainTitle("$\\log_2 8$ in $\\ln e$"), "log₂ 8 in ln e");
  assert.equal(plainTitle("$\\cos^2 x$"), "cos² x");
  assert.equal(plainTitle("2*3*4"), "2·3·4");
  assert.equal(plainTitle("**Naloga**"), "Naloga");
});

async function photoPage(p) {
  // 600 × 400 slika »naloge« iz platna (galerija).
  const b64 = await p.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = 400;
    const g = c.getContext("2d");
    g.fillStyle = "#fff";
    g.fillRect(0, 0, 600, 400);
    g.fillStyle = "#000";
    g.font = "48px sans-serif";
    g.fillText("2x + 3 = 11", 140, 210);
    return c.toDataURL("image/png").split(",")[1];
  });
  return { name: "naloga.png", mimeType: "image/png", buffer: Buffer.from(b64, "base64") };
}

async function openChat(base, mode) {
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
  const id = await p.evaluate(() =>
    fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Jan", settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "FIZ", interests: [] } }) })
      .then((r) => r.json())
      .then((s) => s.id),
  );
  await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
  await p.goto(base + "/");
  await p.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
  await p.evaluate(() => document.querySelector('.tab[data-view="chat"]').click());
  await p.waitForSelector("#photo-btn", { state: "visible", timeout: 30000 });
  return { ctx, p, errors };
}

async function scanFlow(p, shot) {
  await p.locator("#photo-btn").tap();
  await p.waitForSelector('#view-scan:not([hidden]) [data-act="gallery"]', { timeout: 10000 });
  await p.waitForFunction(() => document.activeElement?.matches("#view-scan h1"), null, { timeout: 2000 }); // fokus na naslovu
  assert.equal(await p.locator("#view-scan .me-back span").innerText(), "Inštruktor", "nazaj vodi v Inštruktorja");
  assert.equal(await p.locator("#view-scan .scan-hist").count(), 0, "zgodovina skenerja ni v načinu za Inštruktorja");
  if (shot) await p.screenshot({ path: `${SHOTS}/c-1-zajem-dark.png` });
  await p.setInputFiles("#view-scan [data-file]", await photoPage(p));
  await p.waitForSelector('#view-scan [data-act="read"]', { timeout: 10000 });
  if (shot) await p.screenshot({ path: `${SHOTS}/c-2-izrez-dark.png` });
  await p.locator('#view-scan [data-act="read"]').tap();
  await p.waitForSelector("#view-scan #scan-task", { timeout: 15000 });
}

test("telefon 360 px (temno): kamera → skener → pregled prepisa → naloga v pogovor kot besedilo; ob napaki s fotografijo", opts, async () => {
  let fail = false;
  let wait = 0;
  const { app, seen } = server({
    slow: () => wait,
    readTask: async () => {
      if (fail) throw new Error("529 overloaded");
      return { text: "Reši enačbo $2x + 3 = 11$.", figure: false, more: false, usage: null, model: "claude-haiku-5-5" };
    },
  });
  const srv = app.listen(0);
  try {
    const base = `http://127.0.0.1:${srv.address().port}`;
    const { ctx, p, errors } = await openChat(base, "dark");
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/c-0-glava-dark.png` });
    // Glava pri 360 px: »Vprašaj me« in Kalkulator vidna, nič ne štrli čez rob.
    const head = await p.$eval(".chat-head, #view-chat .chat-head", (h) => [...h.querySelectorAll("button:not([hidden])")].map((b) => b.getBoundingClientRect().right)).catch(() => []);
    assert.ok(head.every((r) => r <= 360), JSON.stringify(head));
    await scanFlow(p, !!SHOTS);
    assert.equal(await p.inputValue("#view-scan #scan-task"), "Reši enačbo $2x + 3 = 11$.");
    assert.equal(await p.isChecked("#view-scan [data-photo]"), false, "brez skice gre samo besedilo");
    // »Pošlji inštruktorju« viden brez drsenja (360 × 740) in v fokusu.
    const sendBox = await p.locator('#view-scan [data-act="send"]').boundingBox();
    assert.ok(sendBox.y >= 0 && sendBox.y + sendBox.height <= 740 - 50, JSON.stringify(sendBox));
    assert.equal(await p.evaluate(() => document.activeElement?.dataset.act), "send");
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/c-3-pregled-dark.png` });
    await p.fill("#view-scan #scan-task", "Reši enačbo $2x + 3 = 13$."); // učenec popravi prepis
    await p.locator('#view-scan [data-act="send"]').tap();
    await p.waitForSelector("#view-chat:not([hidden]) .msg.assistant:not(.typing) .msg-report, #view-chat:not([hidden]) .msg.assistant:not(.typing) .msg-foot", { timeout: 20000 });
    assert.match(await p.locator(".msg.user").last().innerText(), /2x\s*\+\s*3\s*=\s*13/);
    assert.equal(await p.evaluate(() => document.activeElement?.id), "input", "fokus nazaj v polje");
    assert.ok(seen.at(-1).length && !seen.at(-1).includes("image"), "inštruktor dobi besedilo, ne slike");
    assert.equal(await p.locator("#chat-title").innerText(), "Reši enačbo 2x + 3 = 13.", "berljiv naslov");
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/c-4-pogovor-dark.png` });
    // Branje ne uspe: obvestilo, fotografija označena, učenec jo pošlje (nikoli slepa ulica).
    fail = true;
    await scanFlow(p, false);
    assert.match(await p.locator("#view-scan .scan-note").innerText(), /Pošlji fotografijo inštruktorju ali nalogo vpiši/);
    assert.equal(await p.isChecked("#view-scan [data-photo]"), true);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/c-5-napaka-dark.png` });
    await p.locator('#view-scan [data-act="send"]').tap();
    await p.waitForFunction(() => document.querySelectorAll(".msg.assistant:not(.typing)").length >= 2, null, { timeout: 20000 });
    assert.ok(seen.at(-1).includes("image"), "ob napaki branja gre fotografija");
    // Skeniranje med izpisom odgovora: naloga gre v polje, nič se ne izgubi.
    fail = false;
    wait = 4000;
    await p.fill("#input", "Kaj je gostota?");
    await p.locator("#send").tap();
    await p.waitForSelector(".msg.assistant.typing", { timeout: 5000 });
    await scanFlow(p, false);
    await p.locator('#view-scan [data-act="send"]').tap();
    await p.waitForFunction(() => /2x \+ 3 = 11/.test(document.querySelector("#input").value), null, { timeout: 5000 });
    wait = 0;
    await p.waitForFunction(() => !document.querySelector(".msg.assistant.typing"), null, { timeout: 20000 });
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    await ctx.close();
  } finally {
    srv.close();
  }
});

test.after(() => chromium?.close());
