// Dimni test celotne aplikacije v pravem brskalniku: ali vsak del deluje od začetka do konca.
// Zažene svoj strežnik (preizkusni način, začasna baza, brez novic), nato v Chromiumu na računalniški
// (1280×800) in telefonski širini (360×740, dotik) prehodi uvod treh profilov (OŠ, SŠ, fakulteta),
// vse zavihke, nalogo (narobe, nato prav, lestev namigov), lekcijo s simulacijo, klepet, igro,
// tekmovalni trening, nastavitve, meni profila, urnik in izpite; z računi še registracijo,
// prijavo, Račun in stran za starše. Beleži napake strani in konzole, neuspele zahteve in odgovore
// ≥ 400, vodoravno drsenje in vidne neprevedene ključe (npr. »nav.path«).
// Zagon: node scripts/preveri-aplikacijo.cjs [--posnetki <mapa>] [--brez-racunov] [--samo racunalnik|telefon]
// Izhod 1, če je kaj narobe. Potrebuje Playwright s Chromiumom (require("playwright")).
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const net = require("node:net");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const { tinyPdf, SAMPLE } = require("../test/fixtures/tiny-pdf.cjs");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const SHOTS = arg("--posnetki") ? path.resolve(arg("--posnetki")) : null;
const ONLY = arg("--samo");
const ACCOUNTS = !args.includes("--brez-racunov");
const T0 = Date.now();

const problems = []; // { where, what }
const notes = [];
let shotN = 0;
const problem = (where, what) => {
  const key = `${where}|${what}`;
  if (!problems.some((p) => `${p.where}|${p.what}` === key)) problems.push({ where, what });
};

// ---------- strežnik ----------
const freePort = () =>
  new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
    s.on("error", reject);
  });

const servers = [];
async function startServer(extraEnv = {}) {
  const port = await freePort();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-preveri-"));
  const env = {
    ...process.env,
    PORT: String(port),
    EVKLID_MOCK: "1",
    EVKLID_MOCK_DELAY_MS: "0",
    EVKLID_NEWS: "0",
    EVKLID_DB: path.join(dir, "t.db"),
    EVKLID_PASSWORD: "",
    ANTHROPIC_API_KEY: "",
    RESEND_API_KEY: "",
    STRIPE_SECRET_KEY: "",
    ...extraEnv,
  };
  const log = [];
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] });
  srv.stdout.on("data", (d) => log.push(String(d)));
  srv.stderr.on("data", (d) => log.push(String(d)));
  const base = `http://localhost:${port}`;
  servers.push({ srv, dir });
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base + "/healthz")).ok) return { base, db: env.EVKLID_DB, log };
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`strežnik se ni zagnal:\n${log.join("")}`);
}
function stopServers() {
  for (const { srv, dir } of servers) {
    srv.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// ---------- pravilni in napačni odgovori iz baze (koda za preverjanje je ista kot na strežniku) ----------
let checkAnswer;
let sqlite;
function taskAnswer(dbPath, taskId) {
  const db = new sqlite.DatabaseSync(dbPath, { readOnly: true });
  try {
    const row = db.prepare("SELECT payload FROM tasks WHERE id = ?").get(Number(taskId));
    return row ? JSON.parse(row.payload).answer : null;
  } finally {
    db.close();
  }
}
function answersFor(a) {
  const round = (v, d) => (d == null ? String(v) : (Math.round(v * 10 ** d + 1e-9) / 10 ** d).toFixed(d));
  let right = [];
  let wrong = [];
  if (a.type === "number") {
    const u = a.unit ? ` ${a.unit}` : "";
    const s = round(a.value, a.decimals);
    right = [s.replace(".", ",") + u, s + u, String(a.value).replace(".", ",") + u];
    wrong = [round(a.value * 3 + 17, a.decimals).replace(".", ",") + u, `${Math.round(a.value) + 101}${u}`];
  } else if (a.type === "fraction") {
    right = [`${a.num}/${a.den}`];
    wrong = [`${a.num + 1}/${a.den + 3}`, `${a.num * 5 + 2}/${a.den}`];
  } else if (a.type === "choice") {
    right = [String(a.index)];
    wrong = [String(a.index === 0 ? 1 : 0)];
  } else if (a.type === "coefficients") {
    right = [a.values.join(", ")];
    wrong = [a.values.map((v, i) => v + i + 1).join(", "), a.values.map((v, i) => (i ? v : v + 1)).join(", ")];
  }
  return {
    right: right.find((x) => checkAnswer(a, x).kind === "correct"),
    wrong: wrong.find((x) => checkAnswer(a, x).kind === "wrong"),
  };
}

// ---------- brskalnik ----------
let KEYS = [];
async function newPage(browser, phone, label, base) {
  const ctx = await browser.newContext({
    viewport: phone ? { width: 360, height: 740 } : { width: 1280, height: 800 },
    hasTouch: phone,
    isMobile: phone,
    deviceScaleFactor: 1,
    locale: "sl-SI",
    timezoneId: "Europe/Ljubljana",
    reducedMotion: "reduce",
    serviceWorkers: "block",
  });
  const p = await ctx.newPage();
  p.label = label;
  p.where = "zagon";
  p.base = base;
  p.allow = []; // pričakovani odgovori ≥ 400 (npr. napačno geslo)
  p.on("pageerror", (e) => problem(`${label} ${p.where}`, `napaka strani: ${String(e.message).split("\n")[0].slice(0, 160)}`));
  p.on("console", (m) => {
    if (m.type() !== "error") return;
    const txt = m.text();
    if (/Failed to load resource/.test(txt)) return; // zabeleži že odgovor ≥ 400
    problem(`${label} ${p.where}`, `konzola: ${txt.slice(0, 160)}`);
  });
  p.on("requestfailed", (r) => {
    const why = r.failure()?.errorText || "";
    if (/ERR_ABORTED/.test(why)) return; // prekinjeno ob menjavi strani ali pretoku
    problem(`${label} ${p.where}`, `zahteva ni uspela: ${r.method()} ${r.url().replace(base, "")} (${why})`);
  });
  p.on("response", (r) => {
    if (r.status() < 400) return;
    const u = r.url().replace(base, "");
    if (p.allow.some((re) => re.test(`${r.status()} ${u}`))) return;
    problem(`${label} ${p.where}`, `HTTP ${r.status()} ${r.request().method()} ${u}`);
  });
  p.on("dialog", (d) => d.accept().catch(() => {}));
  p.on("crash", () => problem(`${label} ${p.where}`, "stran se je sesula (crash)"));
  // Tipka Nazaj ali zgodovina ne sme odpeljati iz aplikacije (npr. na about:blank).
  p.on("framenavigated", (f) => {
    if (f === p.mainFrame() && !f.url().startsWith(base)) problem(`${label} ${p.where}`, `stran je zapustila aplikacijo: ${f.url()}`);
  });
  await p.addInitScript(PAGE_HOOKS);
  return p;
}

// V strani: id zadnje prikazane naloge (za pravilen/napačen odgovor iz baze) in pospešena ura iger
// (window.__fastGames: vsak okvir izriše 10 korakov po 50 ms, core.js pa čas igre še pospeši 8×, da se igra konča tudi na počasnem stroju).
function PAGE_HOOKS() {
  // Neobravnavane zavrnitve aplikacija pokaže le kot obvestilo; tukaj jih zabeležimo kot napako.
  addEventListener("unhandledrejection", (e) => console.error(`neobravnavana zavrnitev: ${e.reason?.message || e.reason}`));
  const f = window.fetch;
  window.fetch = async (...a) => {
    const r = await f(...a);
    try {
      if (/\/(practice\/next|pretest|competition-training|contest|daily|review|unit-practice|placement|test-prep|answer|skip)$/.test(String(a[0])) && r.ok) {
        r.clone().json().then((j) => {
          const t = j.task || j.next?.task;
          if (t?.id) window.__stmTask = t.id;
        }).catch(() => {});
      }
    } catch {}
    return r;
  };
  const raf = window.requestAnimationFrame.bind(window);
  const caf = window.cancelAnimationFrame.bind(window);
  const pending = new Map();
  let seq = 0;
  let fake = 0;
  let scheduled = false;
  const flush = () => {
    scheduled = false;
    fake = Math.max(fake, performance.now());
    for (let i = 0; i < 10 && pending.size; i++) {
      const cbs = [...pending.values()];
      pending.clear();
      fake += 50;
      for (const cb of cbs) cb(fake);
    }
    if (pending.size && !scheduled) (scheduled = true), raf(flush);
  };
  window.requestAnimationFrame = (cb) => {
    if (!window.__fastGames) return raf(cb);
    const id = -++seq;
    pending.set(id, cb);
    if (!scheduled) (scheduled = true), raf(flush);
    return id;
  };
  window.cancelAnimationFrame = (id) => (id < 0 ? pending.delete(id) : caf(id));
}

// Stanje zaslona: vodoravno drsenje in vidni neprevedeni ključi; posnetek.
async function screen(p, name) {
  p.where = name;
  await settle(p);
  const r = await p
    .evaluate((keys) => {
      const set = new Set(keys);
      const vis = (el) => !!(el.offsetParent || el.getClientRects().length) && getComputedStyle(el).visibility !== "hidden";
      const texts = [document.body.innerText];
      for (const el of document.querySelectorAll("[placeholder],[aria-label],[title]")) {
        if (!vis(el)) continue;
        for (const a of ["placeholder", "aria-label", "title"]) if (el.getAttribute(a)) texts.push(el.getAttribute(a));
      }
      const raw = new Set();
      for (const t of texts) for (const m of t.matchAll(/\b[a-z]+\.[a-zA-Z]+(\.[a-zA-Z]+)*\b/g)) if (set.has(m[0])) raw.add(m[0]);
      const over = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth;
      // V aplikaciji drsi samo odprt pogled, nikoli cela stran: sicer jo scrollIntoView premakne in spodnja vrstica
      // obvisi sredi zaslona (j 2026-11-04, skrit napis na dnu Nastavitev).
      const down = document.querySelector("#tabbar") ? document.documentElement.scrollHeight - innerHeight : 0;
      // Mali navpični drsnik s puščicama ▲▼ ob vrstici (j 2026-11-04: »never use scrollbars like that again«).
      const mini = [...document.querySelectorAll("body *")]
        .filter((el) => !/^(TEXTAREA|INPUT|SELECT)$/.test(el.nodeName) && el.clientHeight > 0 && el.clientHeight < 80 && el.scrollHeight > el.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(el).overflowY) && getComputedStyle(el).scrollbarWidth !== "none" && vis(el))
        .map((el) => `${el.nodeName.toLowerCase()}.${[...el.classList].join(".")}`);
      return { raw: [...raw], over, down, mini: [...new Set(mini)] };
    }, KEYS)
    .catch((e) => ({ raw: [], over: 0, err: e.message }));
  if (r.err) problem(`${p.label} ${name}`, `ni mogoče pregledati: ${r.err.slice(0, 120)}`);
  if (r.over > 1) problem(`${p.label} ${name}`, `vodoravno drsenje za ${r.over} px`);
  if (r.down > 1) problem(`${p.label} ${name}`, `cela stran je za ${r.down} px višja od zaslona (drsi stran namesto pogleda)`);
  if (r.raw.length) problem(`${p.label} ${name}`, `neprevedeni ključi: ${r.raw.join(", ")}`);
  if (r.mini?.length) problem(`${p.label} ${name}`, `mali navpični drsnik (▲▼) v: ${r.mini.slice(0, 5).join(", ")} (docs/oblikovanje.md)`);
  if (SHOTS) {
    const file = path.join(SHOTS, `${String(++shotN).padStart(3, "0")}-${p.label}-${name}.png`.replace(/[^\w.\-]+/g, "_"));
    await p.screenshot({ path: file }).catch(() => {});
  }
}
// Počaka, da se zahteve umirijo (brez fiksnih dolgih čakanj).
async function settle(p, ms = 150) {
  await p.waitForLoadState("networkidle", { timeout: 3000 }).catch(() => {});
  await p.waitForTimeout(ms);
}

// Korak: napaka v enem koraku ne ustavi pregleda, zabeleži se z imenom koraka.
async function step(p, name, fn) {
  p.where = name;
  try {
    await fn();
  } catch (e) {
    const at = await p
      .evaluate(() => `${[...document.querySelectorAll("main.view")].find((v) => !v.hidden)?.id || "brez pogleda"} ${document.body.className}`.trim())
      .catch(() => "?");
    problem(`${p.label} ${name}`, `korak ni uspel: ${String(e.message).split("\n")[0].slice(0, 200)} [${at}]`);
    if (SHOTS) await p.screenshot({ path: path.join(SHOTS, `NAPAKA-${p.label}-${name}.png`.replace(/[^\w.\-]+/g, "_")) }).catch(() => {});
    if (SHOTS) fs.writeFileSync(path.join(SHOTS, `NAPAKA-${p.label}-${name}.html`.replace(/[^\w.\-]+/g, "_")), await p.content().catch(() => ""));
  }
}
const visible = (p, sel) => p.locator(sel).filter({ visible: true }).first();
// Čestitka ob novi ravni XP (public/xp-fx.js) prekrije zaslon, dokler je učenec ne zapre.
async function closeLevelUp(p) {
  if (!(await p.locator(".xp-cele").isVisible().catch(() => false))) return false;
  await screen(p, "nova-raven").catch(() => {});
  await p.locator(".xp-cele button").click({ timeout: 3000 });
  return true;
}
async function click(p, sel, opts = {}) {
  await closeLevelUp(p);
  try {
    await visible(p, sel).click({ timeout: opts.timeout ?? 5000 });
  } catch (e) {
    // Čestitka se je odprla med klikom (pride malo za animacijo XP): zapri in klikni znova.
    if (!(await closeLevelUp(p))) throw e;
    await visible(p, sel).click({ timeout: opts.timeout ?? 5000 });
  }
  await settle(p, opts.wait ?? 100);
}
async function expectVisible(p, sel, what, timeout = 5000) {
  await visible(p, sel).waitFor({ state: "visible", timeout }).catch(() => {
    throw new Error(`ni vidno: ${what || sel}`);
  });
}
// Telefon: na zaslonih za branje (klepet, tema, lekcija, kalkulator) se spodnja vrstica umakne (touch.css);
// kolešček ali poteg navzgor po vsebini jo pokaže (app.js). Ob fokusu v polju (tipkovnica) se ne pokaže.
async function revealBar(p) {
  const bar = p.locator("#tabbar");
  if ((await bar.isVisible()) || !(await bar.evaluate((b) => getComputedStyle(b).position === "fixed"))) return;
  await p.evaluate(() => {
    document.activeElement?.blur();
    document.body.dispatchEvent(new WheelEvent("wheel", { deltaY: -200, bubbles: true }));
  });
  await bar.waitFor({ state: "visible", timeout: 2000 }).catch(() => {
    throw new Error("spodnja vrstica se ob drsenju gor ne pokaže");
  });
}
async function barTab(p, view, opts) {
  await revealBar(p);
  return click(p, `#tabbar .tab[data-view="${view}"]`, opts);
}
// Učbenik, Laboratorij in 3D svet so zavihki pogleda »Uči se« (public/uci-se.js).
const UCI_TABS = ["textbook", "lab", "3d"];
async function tab(p, view) {
  if (UCI_TABS.includes(view)) {
    await tab(p, "uci");
    const seg = p.locator(`#view-uci [data-uci-tab="${view}"]`);
    // Na telefonu se preklopnik v odprti lekciji ali poskusu umakne: najprej nazaj na seznam.
    if (!(await seg.isVisible())) await click(p, "#view-uci .uci-pane:not([hidden]) :is(.tb-back, [data-lab-back])", { wait: 200 });
    return click(p, `#view-uci [data-uci-tab="${view}"]`, { wait: 200 });
  }
  // Računalnik: zgornja vrstica; telefon: spodnja vrstica ali »Jaz« → seznam.
  const top = p.locator(`.topbar .tab[data-view="${view}"]`);
  if (await top.isVisible()) return click(p, `.topbar .tab[data-view="${view}"]`);
  await revealBar(p);
  const bottom = p.locator(`#tabbar .tab[data-view="${view}"]`);
  if (await bottom.isVisible()) return click(p, `#tabbar .tab[data-view="${view}"]`);
  await barTab(p, "me");
  await click(p, `#view-me [data-go="${view}"]`);
}
const currentMain = (p) => p.evaluate(() => [...document.querySelectorAll("main.view:not(.in-okno)")].find((v) => !v.hidden)?.id || "");
// V »Uči se« šteje viden zavihek (view-textbook, view-lab, view-3d).
const currentView = (p) =>
  p.evaluate(() => {
    const v = [...document.querySelectorAll("main.view:not(.in-okno)")].find((x) => !x.hidden);
    return (v?.id === "view-uci" ? [...v.querySelectorAll(".uci-pane")].find((x) => !x.hidden)?.id : v?.id) || "";
  });

// Klobuk zgoraj levo: »Nadaljuj z učenjem« (public/quick-start.js). Nazaj zapre meni, vrstica odpre temo.
async function quickStart(p) {
  await tab(p, "path");
  await click(p, ".topbar .brand", { wait: 300 });
  await expectVisible(p, '#quick-pop .qs-row[data-act="new"]', "»Nadaljuj« pod klobukom");
  if ((await p.locator("#quick-pop .qs-row").count()) < 2) throw new Error("pod klobukom manjka današnji trening");
  await screen(p, "nadaljuj-meni");
  await p.goBack();
  await settle(p, 200);
  if (await p.locator("#quick-pop").isVisible()) throw new Error("tipka Nazaj ne zapre menija pod klobukom");
  await click(p, ".topbar .brand", { wait: 300 });
  await click(p, '#quick-pop .qs-row[data-act="new"]', { wait: 500 });
  if ((await currentView(p)) !== "view-topic") throw new Error("»Nadaljuj« ne odpre teme");
  await screen(p, "nadaljuj-tema");
  // Na telefonu plošča za vnos prekrije spodnjo vrstico: nazaj s tipko Nazaj.
  await p.goBack();
  await settle(p, 300);
  if ((await currentView(p)) !== "view-path") throw new Error("tipka Nazaj po »Nadaljuj« ne vodi na učno pot");
}

// ---------- koraki ----------

// Vodič ob prvi uporabi: vsak profil ga dobi enkrat (settings.tour_version na strežniku).
// how: "vse" (vsi koraki z Naprej, enkrat Nazaj), "esc" ali "preskoci". Po zaprtju mora biti v profilu shranjen.
async function closeTour(p, how, timeout = 5000) {
  await expectVisible(p, "#tour", "vodič ob prvi uporabi", timeout);
  if (how === "vse") {
    for (let i = 0; i < 40 && (await p.locator("#tour").isVisible()); i++) {
      if (i === 0) await screen(p, "uvodni-ogled");
      if (i === 2) {
        const at = await p.locator("#tour .tour-step").innerText();
        await click(p, '#tour [data-tour="back"]');
        if ((await p.locator("#tour .tour-step").innerText()) === at) throw new Error("»Nazaj« v vodiču ne gre korak nazaj");
      }
      await click(p, '#tour [data-tour="next"]');
    }
  } else if (how === "esc") await p.keyboard.press("Escape");
  else await click(p, '#tour [data-tour="skip"]');
  await p.locator("#tour").waitFor({ state: "hidden", timeout: 3000 }).catch(() => {
    throw new Error(`vodič se ni zaprl (${how})`);
  });
  await settle(p, 200);
  const tv = await p.evaluate(async () => {
    const r = await fetch(`/api/students/${localStorage.getItem("studentId")}`);
    return r.ok ? (await r.json()).settings?.tour_version || 0 : -1;
  });
  if (!(tv >= 1)) throw new Error(`vodič ni shranjen v profilu (tour_version ${tv})`);
}

// tour: kako zapreti vodič; stran: »drug pogled« = takoj po vprašalniku odpre Učbenik, vodič pa
// mora počakati na vrnitev na Učno pot (ne sme se odpreti čez drug pogled).
async function onboard(p, name, levelSteps, { interests = false, tour = "preskoci", away = false } = {}) {
  await expectVisible(p, "#onboard-form", "obrazec za nov profil", 10000);
  await p.fill('#onboard-form input[name="name"]', name);
  for (const val of levelSteps) await click(p, `#onboard-form .lp-opt[data-val="${val}"]`);
  await screen(p, `uvod-${name}`);
  await click(p, '#onboard-form button[type="submit"]', { wait: 300 });
  // Vprašalnik kotička zanimanj (ob prvem zagonu profila).
  await expectVisible(p, ".iq-wrap .iq", "vprašalnik zanimanj", 8000);
  await screen(p, `zanimanja-${name}`);
  if (interests) {
    await click(p, '.iq-wrap [data-int="space"]');
    await click(p, '.iq-wrap [data-int="math"]');
    await click(p, ".iq-wrap [data-iq=next]");
    await click(p, ".iq-wrap [data-level]");
    await click(p, ".iq-wrap [data-iq=next]");
    await p.fill(".iq-wrap .iq-custom input", "šah");
    await click(p, ".iq-wrap [data-iq=save]", { wait: 300 });
  } else if (away)
    await p.evaluate(() => {
      document.querySelector(".iq-wrap [data-iq=skip]").click();
      document.querySelector('.topbar .tab[data-view="uci"]').click();
      document.querySelector('#view-uci [data-uci-tab="textbook"]').click();
    });
  else await click(p, ".iq-wrap [data-iq=skip]", { wait: 300 });
  await p.locator(".iq-wrap").waitFor({ state: "detached", timeout: 5000 }).catch(() => {
    throw new Error("vprašalnik zanimanj se ni zaprl");
  });
  if (away) {
    await p.waitForTimeout(1200);
    if ((await currentView(p)) !== "view-textbook") throw new Error(`po vprašalniku je odprt ${await currentView(p)} namesto Učbenika`);
    if (await p.locator("#tour").isVisible()) throw new Error("vodič se je odprl čez drug pogled");
    await tab(p, "path");
  }
  await closeTour(p, tour);
  await expectVisible(p, "#view-path #xp-card .hero", "učna pot");
  await screen(p, `pot-${name}`);
}

// Odgovor na nalogo prek vmesnika: izbira ali vpis.
async function answerTask(p, db, value) {
  const choice = p.locator("#practice .task .choices .choice");
  if (await choice.count()) await choice.nth(Number(value)).click();
  else {
    await p.fill("#answer", value);
    await p.locator("#practice .answer-row button.primary").click();
  }
  await p.locator("#feedback .fb:not(.info), #feedback .fb.info:not(:has-text('Preverjam'))").first().waitFor({ timeout: 5000 });
  await settle(p);
}
async function practiceTopic(p, db) {
  // Naslednja tema na učni poti → stran teme (pri novi temi test predznanja).
  await click(p, "#xp-card .next-row[data-open]", { wait: 300 });
  await expectVisible(p, "#view-topic .topic-head, #view-topic #practice .task", "stran teme");
  await screen(p, "tema");
  // Test predznanja: »Ne vem« do konca, nato vaja.
  for (let i = 0; i < 5 && (await p.locator("#p-skip").isVisible()); i++) await click(p, "#p-skip", { wait: 250 });
  if (await p.locator(".pretest-result").isVisible()) {
    await screen(p, "test-predznanja");
    await click(p, "#pt-practice", { wait: 300 });
  } else await click(p, "#t-practice", { wait: 300 });
  // Rešen zgled, nato prva naloga.
  if (await p.locator("#ex-next").isVisible()) {
    await screen(p, "zgled");
    await click(p, "#ex-next", { wait: 300 });
  }
  await expectVisible(p, "#practice .task .task-text", "naloga");
  const taskId = await p.evaluate(() => window.__stmTask);
  if (!taskId) throw new Error("ne najdem id naloge");
  // Lestev namigov do konca.
  let hints = 0;
  for (; hints < 5 && (await p.locator("#hint-btn").isVisible()); hints++) {
    await click(p, "#hint-btn", { wait: 200 });
  }
  const steps = await p.locator("#hint-box .fb.hint").count();
  if (await p.locator("#hint-box").count()) {
    if (!steps) throw new Error("lestev namigov ni pokazala nobenega koraka");
    if (steps !== hints) throw new Error(`lestev namigov: ${hints} klikov, ${steps} korakov`);
  }
  await screen(p, "naloga-namigi");
  const ans = taskAnswer(db, taskId);
  const { right, wrong } = answersFor(ans);
  if (!right || !wrong) throw new Error(`ne znam sestaviti odgovora (${ans?.type})`);
  await answerTask(p, db, wrong);
  if (!(await p.locator("#feedback .fb.bad").isVisible())) throw new Error("napačen odgovor ni označen kot napačen");
  await screen(p, "naloga-narobe");
  if (await p.locator("#fb-retry").isVisible()) {
    await click(p, "#fb-retry");
    await answerTask(p, db, right);
    if (!(await p.locator("#feedback .fb.ok").isVisible())) throw new Error("pravilen odgovor ni označen kot pravilen");
    await screen(p, "naloga-prav");
  } else notes.push("naloga je po prvem napačnem odgovoru pokazala rešitev (izbirna)");
  // Naslednja naloga se odpre.
  await click(p, "#fb-next", { wait: 300 });
  await expectVisible(p, "#practice .task", "naslednja naloga");
  // Kalkulator iz naloge (okno čez zaslon) in nazaj.
  await click(p, "#practice .task-calc", { wait: 300 });
  await expectVisible(p, "#graph-overlay", "kalkulator iz naloge");
  await screen(p, "naloga-kalkulator");
  await click(p, "#graph-close");
  if (await p.locator("#graph-overlay").isVisible()) throw new Error("kalkulator se ni zaprl");
  // Nazaj na učno pot.
  await click(p, "#back-to-path");
  if ((await currentView(p)) !== "view-path") throw new Error("»Učna pot« z naloge ne vodi na učno pot");
}

async function textbook(p, label) {
  await tab(p, "textbook");
  await expectVisible(p, "#view-textbook .tb-head", "učbenik");
  await screen(p, `ucbenik-${label}`);
  // Lekcija s poskusom (simulacijo), sicer katera koli napisana lekcija.
  let lesson = p.locator("#tb-body .tb-topic:has(.tb-badge.demo):has(.tb-badge:text('lekcija'))").first();
  if (!(await lesson.count())) lesson = p.locator("#tb-body .tb-topic:not(.pending)").first();
  if (!(await lesson.count())) throw new Error("v učbeniku ni nobene lekcije");
  await lesson.scrollIntoViewIfNeeded();
  await lesson.click();
  await settle(p, 400);
  await expectVisible(p, "#view-textbook .tb-title", "lekcija");
  await screen(p, `lekcija-${label}`);
  // »Prijavi napako« v lekciji (public/prijave.js): brez razloga opozori, z razlogom pošlje.
  await click(p, "#tb-report", { wait: 150 });
  await expectVisible(p, "#view-textbook .tb-tools + .report-box", "okvir za prijavo napake v lekciji");
  await screen(p, `lekcija-prijava-${label}`);
  await click(p, "#view-textbook .report-box .rep-send", { wait: 100 });
  await expectVisible(p, "#view-textbook .report-box .rep-err", "opozorilo, da je treba izbrati razlog");
  await click(p, "#view-textbook .report-box .rep-reasons button >> nth=1", { wait: 50 });
  await click(p, "#view-textbook .report-box .rep-send", { wait: 400 });
  if (await p.locator("#view-textbook .report-box").count()) throw new Error("prijava napake v lekciji se ni poslala");
  if (!(await p.locator("#tb-report").isDisabled())) throw new Error("gumb »Prijavi napako« po prijavi ni označen kot prijavljeno");
  // Lekcija po korakih (privzeto): Naprej do konca, enkrat Nazaj; »Preveri se« in »Razloži drugače«
  // preveri v koraku, kjer sta (skriti koraki so hidden).
  const shown = (sel) => p.locator(sel).filter({ visible: true }).first();
  const steps = await p.locator("#tb-step-next").count();
  let checked = false;
  let alt = false;
  let sim = false;
  for (let i = 0; i < 60; i++) {
    // Simulacija: na računalniku ob strani, na telefonu v enem od korakov.
    if (!sim && (await shown(".tb-demo").count())) {
      const demo = shown(".tb-demo");
      await demo.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      if (!(await demo.locator(".tb-demo-mount").first().evaluate((m) => m.children.length))) throw new Error("simulacija se ni naložila");
      // Prvi viden drsnik ali gumb simulacije (nastavitev z malo vrednostmi ima skrit drsnik in gumbe).
      const ctl = demo.locator("input[type=range]:visible, button:visible").first();
      if (await ctl.count()) {
        if ((await ctl.getAttribute("type")) === "range") await ctl.fill(String(await ctl.evaluate((x) => x.max)));
        else await ctl.click();
      }
      await screen(p, `simulacija-${label}`);
      sim = true;
    }
    if (!checked && (await shown(".tb-check .tb-opt").count())) {
      const opt = shown(".tb-check .tb-opt");
      await opt.scrollIntoViewIfNeeded();
      await opt.click();
      if (!(await shown(".tb-check .tb-why").count())) throw new Error("»Preveri se« ne pokaže odziva");
      checked = true;
    }
    if (!alt && (await shown("#tb-alt-btn").count())) {
      await shown("#tb-alt-btn").scrollIntoViewIfNeeded();
      await click(p, "#tb-alt-btn");
      if (!(await p.locator("#tb-alt-body .explanation").isVisible())) throw new Error("»Razloži drugače« ne pokaže razlage");
      alt = true;
    }
    if (!steps || !(await p.locator("#tb-step-next").isEnabled())) break;
    if (i === 1) {
      await click(p, "#tb-step-prev", { wait: 50 });
      if (parseInt((await p.locator(".tb-step-count").innerText()).trim(), 10) !== 1) throw new Error("»Nazaj« v lekciji po korakih ne gre na 1. korak");
      await click(p, "#tb-step-next", { wait: 50 });
    }
    await click(p, "#tb-step-next", { wait: 50 });
    if (i === 0) await screen(p, `lekcija-korak-${label}`);
  }
  if (steps && (await p.locator("#tb-step-next").isEnabled())) throw new Error("lekcija po korakih ne pride do konca");
  if ((await p.locator(".tb-demo").count()) && !sim) throw new Error("simulacija lekcije ni bila vidna v nobenem koraku");
  // Nazaj na seznam in iskanje.
  await p.locator("#tb-back").scrollIntoViewIfNeeded();
  await click(p, "#tb-back");
  await p.fill("#tb-q", "ulom");
  await settle(p, 500);
  await screen(p, `ucbenik-iskanje-${label}`);
  await p.fill("#tb-q", "");
  await settle(p, 300);
}

async function chat(p, label) {
  await tab(p, "chat");
  await expectVisible(p, "#view-chat #composer", "inštruktor");
  if (await p.locator("#new-chat").isVisible()) await click(p, "#new-chat");
  await p.fill("#input", "Koliko je 3/4 + 1/8?");
  await click(p, "#send", { wait: 300 });
  await p.locator("#messages .msg.assistant, #messages [class*=assistant]").last().waitFor({ timeout: 8000 }).catch(() => {
    throw new Error("ni odgovora inštruktorja");
  });
  await p.waitForFunction(() => !document.querySelector("#send")?.disabled, null, { timeout: 8000 }).catch(() => {});
  await settle(p, 300);
  await screen(p, `klepet-${label}`);
  // Ulomki, vsote in integrali s tipk (j, 4. 11.): predogled nad poljem jih izriše kot formulo.
  await p.fill("#input", "Koliko je (3)/(4) + ∑_(n=1)^(5) n in ∫_(0)^(1) (x^(2)) dx?");
  await expectVisible(p, "#formula-preview .katex .mfrac", "predogled ulomka nad poljem");
  if (!(await p.locator("#formula-preview .katex .mop").count())) throw new Error("vsota ali integral nista izrisana v predogledu");
  await screen(p, `klepet-formule-${label}`);
  await p.fill("#input", "");
  await p.waitForFunction(() => document.querySelector("#formula-preview")?.hidden, null, { timeout: 3000 }).catch(() => {
    throw new Error("predogled ostane po praznjenju polja");
  });
  // Način v glavi se zamenja kar tam (j, 4. 11.): »Celotna rešitev«, nato nazaj na »Vodenje«.
  for (const want of ["Celotna rešitev", "Vodenje"]) {
    await click(p, '#chat-state .chip-pick:has(select[data-pick="mode"]) .dd-btn', { wait: 200 });
    if (want !== "Vodenje") await screen(p, `klepet-glava-izbira-${label}`);
    await click(p, `.dd-list .dd-opt:has-text("${want}")`, { wait: 400 });
    const shown = await p.locator('#chat-state .chip-pick:has(select[data-pick="mode"]) .dd-label').textContent();
    if (shown.trim() !== want) throw new Error(`način v glavi ni »${want}«, ampak »${shown}«`);
  }
  const n = await p.locator("#conversation-list li").count();
  if (!n) throw new Error("pogovor ni na seznamu");
  // Gumbi z izbirami (<<IZBIRE [...]>>): pod zadnjim odgovorom, tap pošlje odgovor, gumbi izginejo.
  await p.fill("#input", "kaj je rešitev enačbe");
  await click(p, "#send", { wait: 300 });
  // Dolg odgovor se izpisuje z berljivim tempom; dotik pokaže vse naenkrat (gumbi pridejo na koncu izpisa).
  await p.waitForFunction(() => !document.querySelector("#send")?.disabled, null, { timeout: 8000 }).catch(() => {});
  if (await p.locator("#messages .msg.assistant.typing").count()) await click(p, "#messages .msg.assistant.typing", { wait: 300 });
  await expectVisible(p, "#messages .msg.assistant:last-child .choice-row .choice-btn", "gumbi z izbirami pod odgovorom", 8000);
  if (await p.locator("#messages .msg.assistant").last().evaluate((m) => m.textContent.includes("IZBIRE"))) throw new Error("blok IZBIRE je viden učencu");
  await screen(p, `klepet-izbire-${label}`);
  const before = await p.locator("#messages .msg.user").count();
  await click(p, "#messages .choice-row .choice-btn >> nth=0", { wait: 300 });
  await p.waitForFunction(() => !document.querySelector("#send")?.disabled, null, { timeout: 8000 }).catch(() => {});
  if ((await p.locator("#messages .msg.user").count()) !== before + 1) throw new Error("tap na izbiro ne pošlje odgovora");
  if ((await p.locator("#messages .msg.user").last().textContent()).trim() !== "Preverim z vstavljanjem") throw new Error("poslano ni besedilo izbire");
  await settle(p, 300);
  // Orodja aplikacije pod odgovorom (<<ODPRI …>>, <<GRAF …>>, <<SKICA …>>; public/odpri.js): poskus z nastavljeno
  // višino v oknu nad pogovorom (Esc ga zapre), 3D, premičen graf z drsnikom in skica.
  await p.fill("#input", "pokaži poskus");
  await click(p, "#send", { wait: 300 });
  await p.waitForFunction(() => !document.querySelector("#send")?.disabled, null, { timeout: 8000 }).catch(() => {});
  if (await p.locator("#messages .msg.assistant.typing").count()) await click(p, "#messages .msg.assistant.typing", { wait: 300 });
  const last = "#messages .msg.assistant:last-child";
  await expectVisible(p, `${last} .open-tools .open-btn`, "gumbi orodij pod odgovorom", 8000);
  if (await p.locator(last).evaluate((m) => /ODPRI|GRAF \[|SKICA/.test(m.textContent))) throw new Error("blok orodij je viden učencu");
  if ((await p.locator(`${last} .open-btn`).count()) < 2) throw new Error("manjka gumb za poskus ali 3D");
  await expectVisible(p, `${last} .open-graph canvas`, "graf v sporočilu");
  await expectVisible(p, `${last} .open-graph-slider input`, "drsnik grafa");
  await expectVisible(p, `${last} .open-sketch svg line`, "skica v sporočilu");
  await screen(p, `klepet-orodja-${label}`);
  await click(p, `${last} .open-btn >> nth=0`, { wait: 600 });
  await expectVisible(p, ".open-sim .open-sim-body.demo", "poskus v oknu nad pogovorom", 8000);
  const h = await p.evaluate(() => [...document.querySelectorAll(".open-sim input[type=range]")].find((i) => /^višina/i.test(i.getAttribute("aria-label") || ""))?.value);
  if (h != null && Number(h) !== 20) throw new Error(`nastavljena višina v poskusu je ${h}, ne 20`);
  await screen(p, `klepet-poskus-${label}`);
  await p.keyboard.press("Escape");
  await settle(p, 300);
  if (await p.locator(".open-sim").count()) throw new Error("Esc ne zapre okna s poskusom");
  // Brisanje pogovora z enim klikom, brez potrditve (j, 4. 11.): na koncu prejšnji pogovor odpremo znova.
  if (p.viewportSize().width > 760 && (await p.locator("#conversation-list").isVisible())) {
    const keep = await p.evaluate(() => document.querySelector("#conversation-list li.active span")?.textContent);
    await click(p, "#new-chat", { wait: 200 });
    await p.fill("#input", "Živjo");
    await click(p, "#send", { wait: 300 });
    await p.waitForFunction(() => !document.querySelector("#send")?.disabled, null, { timeout: 8000 }).catch(() => {});
    await settle(p, 300);
    const count = await p.locator("#conversation-list li").count();
    let asked = false;
    const onDialog = () => (asked = true);
    p.on("dialog", onDialog);
    await click(p, "#conversation-list li.active button", { wait: 500 });
    p.off("dialog", onDialog);
    if (asked) throw new Error("brisanje pogovora še vedno sprašuje za potrditev");
    if ((await p.locator("#conversation-list li").count()) !== count - 1) throw new Error("pogovor se z enim klikom ni izbrisal");
    if (keep) await p.evaluate((k) => [...document.querySelectorAll("#conversation-list li span")].find((x) => x.textContent === k)?.click(), keep);
    await settle(p, 400);
  }
}

async function calculator(p, label) {
  await tab(p, "graph");
  await expectVisible(p, "#view-graph #graph-slot > *", "kalkulator");
  for (const mode of ["sci", "graph", "tools", "pse", "formulas"]) {
    await click(p, `#view-graph [data-calc-mode="${mode}"]`, { wait: 400 });
    const empty = await p.locator("#graph-slot").evaluate((s) => !s.innerText.trim() && !s.querySelector("canvas,svg"));
    if (empty) throw new Error(`kalkulator »${mode}« je prazen`);
    await screen(p, `kalkulator-${mode}-${label}`);
  }
  // Znanstveni: izračun.
  await click(p, '#view-graph [data-calc-mode="sci"]', { wait: 300 });
}

// Premična okna (public/okna.js): ukaz inštruktorju odpre kalkulator v oknu (telefon: spodnji list),
// zunaj klepeta ostane mehurček, ki odpre klepet v oknu; zavihek iz zgornje vrstice potegnemo na stran.
// Vsak zavihek zgoraj (tudi tedenske novosti) se odpre kot premično okno brez napak, vodoravnega
// drsenja in s pogledom na svojem mestu po zaprtju. Na računalniku vsak glavni pogled z dvema
// visokima stolpcema drug ob drugem dobi ročaj za širino (public/razdelilnik.js), docs/oblikovanje.md.
async function oknaVsi(p) {
  await tab(p, "path");
  // Okna iz prejšnjih korakov zapremo in jih na koncu vrnemo (sicer bi zavihek odprl okno namesto glavnega pogleda).
  const before = await p.$$eval(".okno[data-view]", (ws) => ws.map((w) => w.dataset.view));
  for (const v of before) await p.evaluate((v) => window.evklid.closeWindow(v), v);
  const views = await p.$$eval(".topbar .tabs .tab[data-view]", (ts) => ts.filter((t) => !t.hidden).map((t) => t.dataset.view));
  for (const v of views) {
    if (v === "path") continue; // Učna pot je glavni pogled tega koraka
    const ok = await p.evaluate((v) => window.evklid.openWindow(v), v);
    if (!ok) throw new Error(`zavihek »${v}« se ne odpre kot okno`);
    await settle(p, 400);
    const bad = await p.evaluate((v) => {
      const w = document.querySelector(`.okno[data-view="${v}"]`);
      if (!w) return "ni okna";
      const body = w.querySelector(".okno-body") || w;
      if (body.scrollWidth > body.clientWidth + 2) return `vodoravno drsenje v oknu (${body.scrollWidth} > ${body.clientWidth})`;
      if (!w.querySelector(`#view-${v}`)) return "pogled ni v oknu";
      return "";
    }, v);
    if (bad) throw new Error(`okno »${v}«: ${bad}`);
    await p.evaluate((v) => window.evklid.closeWindow(v), v);
    await settle(p, 200);
    if (!(await p.locator(`#view-${v}`).evaluate((el) => el.parentElement === document.body || !el.closest(".okno")))) throw new Error(`pogled »${v}« se po zaprtju okna ni vrnil`);
  }
  // Dvostolpčne postavitve brez ročaja (nov pogled tedna brez makeSplitter): mreža z dvema stolpcema ali
  // vrstica flex z dvema deloma drug ob drugem. Dve visoki kartici, ki nista dvodelni pogled: data-brez-locnice.
  for (const v of views) {
    await tab(p, v);
    await settle(p, 300);
    const miss = await p.evaluate(() => {
      const main = document.querySelector("main.view:not([hidden]):not(.in-okno)");
      if (!main) return [];
      const out = [];
      for (const el of [main, ...main.querySelectorAll("*")]) {
        if (!el.offsetParent && el !== main) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "grid") {
          const cols = cs.gridTemplateColumns.split(" ").filter((c) => parseFloat(c) > 0);
          if (cols.length !== 2 || cols.some((c) => parseFloat(c) < 240)) continue;
        } else if (!(cs.display.endsWith("flex") && cs.flexDirection.startsWith("row"))) continue;
        if (el.closest("[data-brez-locnice]")) continue;
        const kids = [...el.children].filter((c) => c.offsetParent && !c.classList.contains("split-handle") && !/absolute|fixed/.test(getComputedStyle(c).position));
        if (kids.length !== 2) continue;
        const [a, b] = kids.map((k) => k.getBoundingClientRect());
        if (Math.min(a.width, b.width) < 240 || Math.min(a.height, b.height) < innerHeight * 0.5) continue;
        if (!(a.right <= b.left + 2 || b.right <= a.left + 2)) continue; // eden pod drugim
        if (el.querySelector(":scope > .split-handle") || el.closest(".split-host")?.querySelector(":scope > .split-handle")) continue;
        out.push(el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`);
      }
      return out;
    });
    if (miss.length) throw new Error(`pogled »${v}«: dva stolpca brez ročaja za širino (${miss.join(", ")}); uporabi makeSplitter`);
  }
  await tab(p, "path");
  for (const v of before) await p.evaluate((v) => window.evklid.openWindow(v), v);
}

async function okna(p, label) {
  const sheet = label === "tel";
  await tab(p, "chat");
  // Skrbnik (računalnik s strežnikom): »Prijavi napako« v glavi klepeta; brez opisa opozori, z opisom pošlje.
  await click(p, "#chat-bug", { wait: 150 });
  await expectVisible(p, "#view-chat .bug-box textarea", "okvir za skrbnikovo prijavo napake");
  await click(p, "#view-chat .bug-box .rep-send", { wait: 100 });
  await expectVisible(p, "#view-chat .bug-box .rep-err", "opozorilo, da je treba opisati napako");
  await p.fill("#view-chat .bug-box textarea", "Preizkus: prijava iz klepeta");
  await screen(p, `klepet-prijava-${label}`);
  await click(p, "#view-chat .bug-box .rep-send", { wait: 400 });
  if (await p.locator("#view-chat .bug-box").count()) throw new Error("skrbnikova prijava napake se ni poslala");
  await p.fill("#input", "Pokaži periodni sistem");
  await click(p, "#send", { wait: 300 });
  await expectVisible(p, '.okno[data-view="graph"] #graph-slot .pse, .okno[data-view="graph"] #graph-slot > *', "kalkulator v oknu po ukazu inštruktorju", 8000);
  if (sheet !== (await p.locator(".okno-sheet").count()) > 0) throw new Error(sheet ? "na telefonu okno ni spodnji list" : "na računalniku je okno spodnji list");
  if ((await currentView(p)) !== "view-chat") throw new Error("ukaz za okno je zamenjal glavni pogled");
  await screen(p, `okno-kalkulator-${label}`);
  await click(p, '.okno[data-view="graph"] .okno-x');
  if (await p.locator(".okno").count()) throw new Error("okno se ni zaprlo");
  // Prijava odgovora: skrbnik vidi odgovor tako, kot ga je videl učenec (izrisan HTML in naprava).
  // Odgovor na ukaz odpre okno, še preden se pretok konča; noga (koda, »Prijavi napako«) pride šele na koncu
  // (app.js addMsgFoot). Počakamo nanjo in odgovor pripnemo, sicer bi »nth=-1« med kliki skočil s prejšnjega
  // odgovora na novega (prijava odprta pod enim, »Pošlji« iskan pod drugim: nestabilen »tel-okna«).
  await p.waitForFunction(() => [...document.querySelectorAll("#view-chat .msg.assistant")].pop()?.querySelector(".msg-report"), null, { timeout: 8000 }).catch(() => {
    throw new Error("zadnji odgovor nima »Prijavi napako« (pretok se ni končal)");
  });
  await p.evaluate(() => {
    document.querySelectorAll("[data-preveri-odgovor]").forEach((m) => m.removeAttribute("data-preveri-odgovor"));
    [...document.querySelectorAll("#view-chat .msg.assistant")].pop().setAttribute("data-preveri-odgovor", "");
  });
  const ans = "#view-chat .msg.assistant[data-preveri-odgovor]";
  {
    await click(p, `${ans} >> .msg-report`, { wait: 150 });
    await click(p, `${ans} >> .report-box .rep-reasons button >> nth=0`, { wait: 50 });
    await click(p, `${ans} >> .report-box .rep-send`, { wait: 400 });
    const seen = await p.evaluate(async () => {
      const { renderAdminReports } = await import("/prijave.js");
      const box = document.createElement("div");
      document.body.append(box);
      const api = async (u) => {
        const r = await fetch(u, { credentials: "same-origin" });
        if (!r.ok) throw new Error(`${u}: ${r.status}`);
        return r.json();
      };
      await renderAdminReports(box, { api });
      const li = box.querySelector('.adm-rep[data-kind="message"]');
      const { t } = await import("/i18n.js");
      const label = li?.querySelector(".adm-rep-shown > small")?.textContent;
      const out = { shown: label === t("adm.rep.shown") ? li.querySelector(".adm-rep-shown .msg").textContent.trim().length : 0, device: li?.querySelector("small")?.textContent || "" };
      box.remove();
      return out;
    });
    if (!seen.shown) throw new Error("prijava odgovora skrbniku ne pokaže odgovora, kot ga je videl učenec");
    if (!/web-(phone|tablet|desktop) \d+x\d+/.test(seen.device)) throw new Error(`prijava odgovora brez naprave (${seen.device})`);
  }
  if (!(await p.locator("#view-graph").evaluate((v) => v.hidden && v.parentElement === document.body))) throw new Error("kalkulator se po zaprtju okna ni vrnil na svoje mesto");
  await tab(p, "path");
  await expectVisible(p, "#chat-bubble .cb-main", "mehurček inštruktorja zunaj klepeta");
  await screen(p, `mehurcek-${label}`);
  await click(p, "#chat-bubble .cb-main", { wait: 300 });
  await expectVisible(p, '.okno[data-view="chat"] #composer', "klepet v oknu iz mehurčka");
  if (await p.locator("#chat-bubble").isVisible()) throw new Error("mehurček ostane, ko je klepet odprt");
  await click(p, '.okno[data-view="chat"] .okno-x');
  if (!sheet) {
    // Poteg zavihka Uči se na desni rob: okno, pripeto na desno polovico.
    const b = await p.locator('.topbar .tab[data-view="uci"]').boundingBox();
    const vw = p.viewportSize().width;
    await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await p.mouse.down();
    for (let i = 1; i <= 10; i++) await p.mouse.move(b.x + b.width / 2 + (vw - 4 - b.x - b.width / 2) * (i / 10), b.y + 30 + 300 * (i / 10));
    await p.mouse.up();
    await settle(p, 300);
    const w = await p.locator('.okno[data-view="uci"]').boundingBox();
    if (!w || Math.abs(w.x + w.width - vw) > 2 || Math.abs(w.width - vw / 2) > 2) throw new Error("zavihek, spuščen ob desnem robu, ni okno na desni polovici");
    await screen(p, `okno-ucbenik-desno-${label}`);
    // Zavihek v oknu se zamenja kot v glavnem pogledu.
    await click(p, '.okno[data-view="uci"] [data-uci-tab="lab"]', { wait: 300 });
    await expectVisible(p, '.okno[data-view="uci"] #view-lab .lab-card', "laboratorij v oknu Uči se");
    await click(p, '.okno[data-view="uci"] .okno-max');
    if ((await currentMain(p)) !== "view-uci" || (await p.locator(".okno").count())) throw new Error("»Odpri čez cel zaslon« ne vrne Uči se v glavni pogled");
    await tab(p, "path");
  }
  // Mehurček, povlečen na X, izgine (prej se je X skril, preden je bil spust preverjen); X ga privlači.
  await tab(p, "path");
  if (await p.locator("#chat-bubble").isVisible()) {
    const b = await p.locator("#chat-bubble .cb-main").boundingBox();
    const vw = p.viewportSize().width;
    const vh = p.viewportSize().height;
    await p.mouse.move(b.x + 28, b.y + 28);
    await p.mouse.down();
    for (let i = 1; i <= 12; i++) await p.mouse.move(b.x + 28 + (vw / 2 - 40 - b.x - 28) * (i / 12), b.y + 28 + (vh - 100 - b.y - 28) * (i / 12));
    await settle(p, 150);
    if (!(await p.locator("#chat-bubble.magnet").count())) throw new Error("X ne privlači mehurčka");
    await screen(p, `mehurcek-x-${label}`);
    await p.mouse.up();
    await settle(p, 400);
    if (await p.locator("#chat-bubble").isVisible()) throw new Error("mehurček, spuščen na X, se ni zaprl");
  }
}

// Ločnice med deli strani (public/razdelilnik.js): poteg ločnice ob seznamu pogovorov razširi seznam,
// širina ostane po ponovnem nalaganju, puščica jo spremeni za 16 px, dvoklik vrne privzeto.
async function razdelilnik(p, label) {
  const handle = async () => {
    await tab(p, "chat");
    const h = p.locator("#view-chat > .split-handle");
    await h.waitFor({ state: "visible", timeout: 5000 }).catch(() => {
      throw new Error("ni ločnice ob seznamu pogovorov");
    });
    return h;
  };
  const width = () => p.locator("#view-chat > .sidebar").evaluate((el) => Math.round(el.getBoundingClientRect().width));
  let h = await handle();
  const w0 = await width();
  const b = await h.boundingBox();
  const y = b.y + Math.min(b.height / 2, 300);
  await p.mouse.move(b.x + b.width / 2, y);
  await p.mouse.down();
  for (let i = 1; i <= 5; i++) await p.mouse.move(b.x + b.width / 2 + 16 * i, y);
  await p.mouse.up();
  await settle(p, 200);
  const w1 = await width();
  if (Math.abs(w1 - w0 - 80) > 3) throw new Error(`poteg ločnice ni razširil seznama pogovorov (${w0} → ${w1} px)`);
  await screen(p, `razdelilnik-klepet-${label}`);
  await p.reload();
  await settle(p, 500);
  h = await handle();
  const w2 = await width();
  if (Math.abs(w2 - w1) > 2) throw new Error(`širina seznama se po ponovnem nalaganju ni ohranila (${w1} → ${w2} px)`);
  await h.focus();
  await p.keyboard.press("ArrowLeft");
  await settle(p, 150);
  if (Math.abs((await width()) - (w2 - 16)) > 2) throw new Error("puščica levo na ločnici ne zoži seznama za 16 px");
  await h.dblclick();
  await settle(p, 200);
  if (Math.abs((await width()) - w0) > 2) throw new Error("dvoklik na ločnico ne vrne privzete širine");
  await tab(p, "path");
}

async function competition(p, label, view = "competition") {
  await tab(p, view);
  await expectVisible(p, `#${view}-content [data-comp-train]`, "tekmovanja ali izpiti");
  if (view === "competition" && (await p.locator("#competition-content [data-prep]").count())) throw new Error("v Tekmovanjih je še preklop na NPZ in maturo");
  await screen(p, `${view === "exams" ? "npz-matura" : "tekmovanja"}-${label}`);
  await click(p, `#${view}-content [data-comp-train]`, { wait: 400 });
  await expectVisible(p, "#practice .task", "naloga tekmovalnega treninga");
  // Trening do konca: »Ne vem« ni, zato odgovorimo pravilno ali narobe, dokler ni konec.
  for (let i = 0; i < 12; i++) {
    if (await p.locator("#practice .result").isVisible()) break;
    const id = await p.evaluate(() => window.__stmTask);
    const { right, wrong } = answersFor(taskAnswer(p.db, id));
    await answerTask(p, p.db, i % 2 ? wrong || right : right || wrong);
    if (await p.locator("#fb-retry").isVisible()) {
      await click(p, "#fb-retry");
      await answerTask(p, p.db, right);
    }
    if (await p.locator("#practice .result").isVisible()) break;
    await click(p, "#fb-next", { wait: 250 });
  }
  if (!(await p.locator("#practice .result").isVisible())) throw new Error("trening se ni končal");
  await screen(p, `trening-konec-${label}`);
  await click(p, "#fb-back");
  if ((await currentView(p)) !== `view-${view}`) throw new Error(`gumb na koncu treninga ne vodi na ${view}`);
}

async function contest(p, label, view = "competition") {
  // Poskusno tekmovanje: začni, preskoči eno nalogo, končaj, poglej rezultat.
  await click(p, `#${view}-content [data-comp-contest]`, { wait: 400 });
  await expectVisible(p, "#practice .task", "naloga poskusnega tekmovanja");
  await screen(p, `poskusni-${label}`);
  await click(p, "#c-skip", { wait: 300 });
  await click(p, "#c-finish", { wait: 400 });
  await expectVisible(p, "#practice .result", "rezultat poskusnega tekmovanja");
  await screen(p, `poskusni-rezultat-${label}`);
  await click(p, "#fb-back");
  if ((await currentView(p)) !== `view-${view}`) throw new Error(`rezultat poskusnega izpita ne vodi na ${view}`);
}

// NPZ in matura (slovenska OŠ in SŠ): pripravljenost, »Vadi« pri šibki temi, pretekle pole (samo povezave na ric.si).
async function examsView(p, label) {
  await tab(p, "exams");
  await expectVisible(p, "#exams-content .exam-ready", "NPZ in matura: pripravljenost");
  await expectVisible(p, '#exam-papers .pp-row a[href^="https://www.ric.si/mma/"]', "pretekle pole");
  await screen(p, `npz-matura-pole-${label}`);
  await click(p, "#exams-content [data-er-practice]", { wait: 500 });
  await expectVisible(p, "#view-topic #practice .task", "vaja šibke teme");
  await click(p, "#back-to-path", { wait: 300 });
  if ((await currentView(p)) !== "view-exams") throw new Error("»Nazaj« z vaje šibke teme ne vodi v NPZ in maturo");
  // »Rešuj z inštruktorjem« pri poli: nov pogovor z vnaprej napisanim sporočilom (ne pošlje ga samo).
  await click(p, "#exam-papers .pp-tutor", { wait: 500 });
  if ((await currentView(p)) !== "view-chat") throw new Error("»Rešuj z inštruktorjem« ne odpre inštruktorja");
  if (!(await p.inputValue("#input")).trim()) throw new Error("»Rešuj z inštruktorjem«: sporočilo ni pripravljeno");
  await p.fill("#input", "");
  await tab(p, "exams");
  await expectVisible(p, '#exam-papers .pp-row', "pretekle pole po vrnitvi");
  // »Odpri preneseno polo«: majhen PDF (ne prava pola RIC) se odpre v napravi, naloga dobi »Pomoč pri tej nalogi«.
  // EVKLID_PREVERI_POLA=<pot do prenesene pole>: ročni preizkus s pravo polo (samo lokalno, nikoli v repozitorij).
  const real = process.env.EVKLID_PREVERI_POLA;
  const pdf = real ? { name: "pola.pdf", mimeType: "application/pdf", buffer: fs.readFileSync(real) } : { name: "pola.pdf", mimeType: "application/pdf", buffer: tinyPdf(SAMPLE) };
  await p.locator("#exam-papers [data-pp-local]").first().setInputFiles(pdf);
  await expectVisible(p, ".pv .pv-task .pv-help", "naloga v preneseni poli", 15000);
  const found = await p.locator(".pv .pv-task").count();
  if (real ? !found : found !== 2) throw new Error(`prenesena pola: najdenih nalog ${found}, pričakovani 2`);
  if (real) console.log(`prenesena pola (${label}): ${await p.locator(".pv .pv-help").count()} gumbov za ${found} območij`);
  await expectVisible(p, ".pv .pv-page canvas[width]:not([width='0'])", "izris strani prenesene pole", 15000);
  await screen(p, `prenesena-pola-${label}`);
  await click(p, ".pv [data-pv-close]", { wait: 200 });
  if (await p.locator(".pv").count()) throw new Error("prenesene pole ni mogoče zapreti");
  // »Pomoč pri tej nalogi«: nov pogovor, v enem sporočilu izrez naloge (slika) in besedilo.
  await p.locator("#exam-papers [data-pp-local]").first().setInputFiles(pdf);
  await expectVisible(p, ".pv .pv-task .pv-help", "naloga v preneseni poli", 15000);
  await click(p, ".pv .pv-task .pv-help", { wait: 800 });
  if ((await currentView(p)) !== "view-chat") throw new Error("»Pomoč pri tej nalogi« ne odpre inštruktorja");
  await expectVisible(p, "#messages .msg.user", "sporočilo z nalogo iz pole", 10000);
  const sent = await p.locator("#messages .msg.user").last().innerText();
  if (!/1/.test(sent) || !(await p.locator("#messages .msg.user").last().locator("img, .photo-note").count())) throw new Error("»Pomoč pri tej nalogi«: v sporočilu ni naloge s sliko");
  await screen(p, `prenesena-pola-pomoc-${label}`);
  await tab(p, "exams");
  await expectVisible(p, '#exam-papers .pp-row', "pretekle pole po pomoči pri nalogi");
  // Pola ostane v pomnilniku: »Odpri preneseno polo« jo po pomoči odpre znova brez izbire datoteke; Esc jo pozabi.
  await p.locator("#exam-papers .pp-local").first().click();
  await expectVisible(p, ".pv .pv-task .pv-help", "ponovno odprta pola po pomoči", 15000);
  await p.keyboard.press("Escape");
  await p.waitForTimeout(200);
  if (await p.locator(".pv").count()) throw new Error("Esc ne zapre ponovno odprte pole");
  // Ista pola na telefonski širini (360 px): brez vodoravnega drsenja, gumb za pomoč viden.
  const size = p.viewportSize();
  await p.setViewportSize({ width: 360, height: 740 });
  await p.locator("#exam-papers [data-pp-local]").first().setInputFiles(pdf);
  await expectVisible(p, ".pv .pv-task .pv-help", "naloga v preneseni poli na telefonu", 15000);
  await expectVisible(p, ".pv .pv-page canvas[width]:not([width='0'])", "izris strani na telefonu", 15000);
  await screen(p, `prenesena-pola-360-${label}`);
  await p.keyboard.press("Escape");
  await p.waitForTimeout(200);
  if (await p.locator(".pv").count()) throw new Error("Esc ne zapre prenesene pole");
  await p.setViewportSize(size);
  // Izbira pol po korakih: krušne drobtine vrnejo korak, izbira ga zapre.
  await click(p, "#exam-papers .lp-crumb[data-pp-step=\"exam\"]", { wait: 200 });
  await expectVisible(p, "#exam-papers .lp-opt", "izbira izpita pri polah");
  await click(p, "#exam-papers .lp-opt", { wait: 200 });
}

async function games(p, label) {
  await tab(p, "games");
  await expectVisible(p, "#games-content .gm-portal", "igre");
  await screen(p, `igre-${label}`);
  // strani mreže (60 iger na stran): druga stran ima igre, nato nazaj na prvo
  if (await p.locator("#games-content .gm-pager").count()) {
    await click(p, '#games-content .gm-pager [data-page="1"]', { wait: 300 });
    const cur = await p.locator("#games-content .gm-pager [aria-current]").textContent();
    if (cur.trim() !== "2") throw new Error(`strani iger: po kliku na 2 je izbrana stran ${cur}`);
    if (!(await p.locator("#games-content .gm-sec .gm-tile").count())) throw new Error("strani iger: druga stran je prazna");
    await click(p, '#games-content .gm-pager [data-page="0"]', { wait: 300 });
  }
  const tile = p.locator("#games-content .gm-tile:not(.gm-locked)").first();
  if (!(await tile.count())) throw new Error("ni odklenjene igre");
  await tile.click();
  await expectVisible(p, ".gm-play [data-act=play]", "začetek igre");
  await screen(p, `igra-${label}`);
  await p.evaluate(() => (window.__fastGames = true));
  await click(p, ".gm-play [data-act=play]", { wait: 200 });
  // Do konca igre: brez odgovorov se čas za nalogo izteče in igra porabi vsa življenja.
  const over = () => p.locator(".gm-end").isVisible();
  for (let i = 0; i < 240 && !(await over()); i++) await p.waitForTimeout(250); // do 60 s (počasen stroj, igra brez časovne meje)
  await p.evaluate(() => (window.__fastGames = false));
  if (!(await over())) throw new Error("igra se ni končala (brez odgovorov bi morala izgubiti vsa življenja)");
  await settle(p, 400);
  await screen(p, `igra-konec-${label}`);
  await click(p, ".gm-end [data-act=exit]");
  await expectVisible(p, "#games-content .gm-portal", "igre po koncu igre");
}

// Laboratorij (public/laboratorij.js): seznam poskusov, odprt poskus s simulacijo; Nazaj in Esc vrneta na seznam,
// »Odpri temo v učbeniku« odpre lekcijo.
async function lab(p, label) {
  await tab(p, "lab");
  await expectVisible(p, "#view-lab .lab-card", "poskusi v laboratoriju");
  await screen(p, `laboratorij-${label}`);
  const opened = "#view-lab .lab-mount .demo-reset, #view-lab .lab-locked";
  await click(p, "#view-lab .lab-card [data-lab-open]", { wait: 300 });
  await expectVisible(p, opened, "odprt poskus");
  await screen(p, `poskus-${label}`);
  await p.goBack();
  await settle(p, 300);
  if ((await currentView(p)) !== "view-lab") throw new Error("Nazaj v poskusu ne vodi na seznam laboratorija");
  await expectVisible(p, "#view-lab .lab-card", "seznam po tipki Nazaj");
  await click(p, "#view-lab .lab-card [data-lab-open]", { wait: 300 });
  await expectVisible(p, opened, "odprt poskus");
  await p.keyboard.press("Escape");
  await expectVisible(p, "#view-lab .lab-card", "seznam po Esc");
  await click(p, "#view-lab .lab-card [data-lab-topic]", { wait: 300 });
  await expectVisible(p, "#view-textbook .tb-title", "tema učbenika iz laboratorija");
  // Iz lekcije en dotik nazaj v isti poskus (»Uči se«: povezava iz kataloga, textbook.js .tb-links).
  await expectVisible(p, "#view-textbook .tb-link[data-tb-lab]", "povezava »Poskus v laboratoriju« v lekciji");
  await screen(p, `lekcija-povezave-${label}`);
  await click(p, "#view-textbook .tb-link[data-tb-lab]", { wait: 400 });
  await expectVisible(p, "#view-lab .lab-stage", "poskus iz lekcije");
  if ((await currentView(p)) !== "view-lab") throw new Error("povezava iz lekcije ne odpre zavihka Laboratorij");
  await click(p, "#view-lab [data-lab-back]", { wait: 300 });
}

async function views(p, label) {
  for (const v of ["corner", "progress", "settings", "league", "schedule"]) {
    await step(p, `${v}-${label}`, async () => {
      await tab(p, v);
      await settle(p, 300);
      if ((await currentView(p)) !== `view-${v}`) throw new Error(`zavihek ${v} se ni odprl`);
      await screen(p, `${v}-${label}`);
    });
  }
}

async function settingsChange(p) {
  await tab(p, "settings");
  const sel = p.locator('#settings-form select[name="data_mode"]');
  await sel.selectOption("lite");
  await click(p, '#settings-form button[type="submit"]', { wait: 300 });
  await expectVisible(p, "#settings-saved", "»Shranjeno«");
  const saved = await p.evaluate(async () => {
    const id = localStorage.getItem("studentId");
    return (await (await fetch(`/api/students/${id}`)).json()).settings.data_mode;
  });
  if (saved !== "lite") throw new Error(`nastavitev ni shranjena (${saved})`);
  await sel.selectOption("auto");
  await click(p, '#settings-form button[type="submit"]', { wait: 300 });
}

async function schedule(p) {
  await tab(p, "schedule");
  await click(p, '#view-schedule [data-act="lesson"]');
  await p.fill('#sch-lesson-form input[name="name"]', "Matematika");
  await p.selectOption('#sch-lesson-form select[name="period"]', "2");
  await click(p, '#sch-lesson-form button.primary', { wait: 300 });
  await expectVisible(p, "#view-schedule .sch-lesson", "ura v urniku");
  await click(p, '#view-schedule [data-act="event"]');
  const d = new Date(Date.now() + 10 * 864e5).toISOString().slice(0, 10);
  await p.fill('#sch-event-form input[name="subject"]', "Matematika");
  await p.fill('#sch-event-form input[name="date"]', d);
  await click(p, '#sch-event-form button.primary', { wait: 400 });
  // Nov test s predmetom aplikacije odpre izbiro sklopov: izberemo prvega in shranimo.
  if (await p.locator('#sch-event-form input[name="unit"]').count()) {
    await p.locator('#sch-event-form input[name="unit"]').first().check();
    await click(p, '#sch-event-form button.primary', { wait: 400 });
  }
  await expectVisible(p, '#view-schedule [data-event]', "test v urniku");
  await screen(p, "urnik-izpolnjen");
}

// Skeniraj nalogo: vpis (fotografija v preizkusnem načinu ne bere), rešitev po korakih, metode, graf, premica.
async function scan(p, label) {
  await tab(p, "scan");
  await expectVisible(p, '#view-scan [data-act="type"]', "skeniranje");
  await screen(p, `skeniraj-${label}`);
  await click(p, '#view-scan [data-act="type"]');
  await p.fill("#scan-input", "(x+1)/2 - (x-1)/3 = 1");
  await expectVisible(p, "#view-scan .scan-preview .katex", "predogled naloge");
  await click(p, '#view-scan [data-act="solve"]', { wait: 300 });
  await expectVisible(p, "#view-scan .scan-answer .scan-badge.ok", "preverjena rešitev");
  await click(p, '#view-scan [data-act="next"]');
  await click(p, '#view-scan [data-why="1"]');
  await expectVisible(p, "#view-scan .scan-why", "razlaga koraka");
  await click(p, '#view-scan [data-act="all"]');
  await screen(p, `skeniraj-linearna-${label}`);
  await click(p, '#view-scan [data-act="edit"]');
  await p.fill("#scan-input", "2x^2+3x-2=0");
  await click(p, '#view-scan [data-act="solve"]', { wait: 300 });
  await click(p, '#view-scan [data-method="1"]', { wait: 200 });
  await click(p, '#view-scan [data-act="all"]');
  await expectVisible(p, "#view-scan .scan-graph-host canvas", "graf");
  await screen(p, `skeniraj-kvadratna-${label}`);
  await click(p, '#view-scan [data-act="edit"]');
  await p.fill("#scan-input", "2x - 3 < 5x + 6");
  await click(p, '#view-scan [data-act="solve"]', { wait: 300 });
  await expectVisible(p, "#view-scan .scan-nl-svg", "številska premica");
  await click(p, '#view-scan [data-act="edit"]');
  await p.fill("#scan-input", "sqrt(x+3) = x - 3");
  await click(p, '#view-scan [data-act="solve"]', { wait: 600 });
  await expectVisible(p, "#view-scan .scan-ai-state", "naloga za AI (preizkusni način)");
  await click(p, '#view-scan [data-act="new"]', { wait: 200 });
  await expectVisible(p, "#view-scan .scan-hist .list-row", "zadnje naloge");
  await screen(p, `skeniraj-zgodovina-${label}`);
}

// Predmet v menijih zgoraj (public/subject-switch.js): menjava pod klobukom (meni ostane odprt)
// in v meniju profila (meni se zapre); na koncu spet prvotni predmet.
async function subjectSwitch(p, lbl) {
  await tab(p, "path");
  const label = (pop) => p.locator(`${pop} .subj-sw-btn b`).innerText().then((x) => x.trim());
  await click(p, ".topbar .brand", { wait: 300 });
  await expectVisible(p, "#quick-pop .subj-sw-btn", "predmet pod klobukom");
  const first = await label("#quick-pop");
  await click(p, "#quick-pop .subj-sw-btn", { wait: 200 });
  await expectVisible(p, "#quick-pop .subj-sw-opt[aria-checked=false]", "seznam predmetov pod klobukom");
  await screen(p, `predmet-klobuk-${lbl}`);
  const other = p.locator("#quick-pop .subj-sw-opt[aria-checked=false]").first();
  const want = (await other.innerText()).trim();
  await other.click();
  await settle(p, 700);
  if (!(await p.locator("#quick-pop").isVisible())) throw new Error("po menjavi predmeta se meni pod klobukom zapre");
  if ((await label("#quick-pop")) !== want) throw new Error(`predmet pod klobukom: pričakoval »${want}«, vidim »${await label("#quick-pop")}«`);
  await expectVisible(p, "#quick-pop .qs-row", "naslednji korak v novem predmetu");
  await p.keyboard.press("Escape");
  await click(p, "#profile-btn", { wait: 300 });
  if ((await label("#profile-pop")) !== want) throw new Error("meni profila ne kaže novega predmeta");
  await click(p, "#profile-pop .subj-sw-btn", { wait: 200 });
  await screen(p, `predmet-profil-${lbl}`);
  await p.locator("#profile-pop .subj-sw-opt").filter({ has: p.getByText(first, { exact: true }) }).first().click();
  await settle(p, 700);
  if (await p.locator("#profile-pop").isVisible()) throw new Error("po menjavi predmeta se meni profila ne zapre");
  await click(p, "#profile-btn", { wait: 300 });
  if ((await label("#profile-pop")) !== first) throw new Error("predmet se ni vrnil na prvotnega");
  await p.keyboard.press("Escape");
}

async function profileMenu(p) {
  await click(p, "#profile-btn");
  await expectVisible(p, "#profile-pop .pm-item", "meni profila");
  await screen(p, "meni-profila");
  const others = p.locator("#profile-pop .pm-student[aria-checked=false]");
  if (await others.count()) {
    const name = (await others.first().locator("span[dir=auto]").innerText()).trim();
    await others.first().click();
    await settle(p, 500);
    const now = (await p.locator("#profile-btn .pm-name").innerText()).trim();
    if (now !== name) throw new Error(`menjava profila: pričakoval »${name}«, vidim »${now}«`);
  } else await p.keyboard.press("Escape");
}

async function league(p) {
  await tab(p, "league");
  await expectVisible(p, "#nick-change", "liga");
  // Vzdevek: izbira iz predlogov.
  await click(p, "#nick-change", { wait: 300 });
  const nick = (await visible(p, "#nick-picker [data-nick]").innerText()).trim();
  await click(p, "#nick-picker [data-nick]", { wait: 400 });
  const now = (await p.locator("#league-content .nick b").innerText()).trim();
  if (now !== nick) throw new Error(`vzdevek se ni zamenjal (${now} namesto ${nick})`);
  // Skupina prijateljev: nastane, se pokaže s kodo, zapustimo jo.
  await p.fill("#friends-name", "Šahisti");
  await click(p, '#friends-form button[type="submit"]', { wait: 400 });
  await expectVisible(p, "#league-content .code-chip", "skupina prijateljev");
  await screen(p, "liga-skupina");
  await click(p, "#league-content [data-leave]", { wait: 400 });
  if (await p.locator("#league-content .code-chip").count()) throw new Error("skupine ni bilo mogoče zapustiti");
}

async function flashcards(p) {
  await tab(p, "path");
  await click(p, '#modebar [data-mode="cards"]', { wait: 400 });
  await expectVisible(p, "#fc-add", "kartice");
  await p.fill('#fc-add textarea[name="front"]', "Koliko je 7 · 8?");
  await p.fill('#fc-add textarea[name="back"]', "56");
  await click(p, "#fc-add button.primary", { wait: 400 });
  await expectVisible(p, ".fc-list li", "nova kartica na seznamu");
  if (await p.locator(".fc-list .fc-a").first().isVisible()) throw new Error("odgovor na seznamu kartic je viden pred tapom");
  await screen(p, "kartice");
  // vaja: kartica se obrne, ocena šele po obratu, med vajo ni seznama
  await click(p, "#view-cards [data-start]", { wait: 300 });
  await expectVisible(p, "#view-cards .fc-flip", "kartica za vajo");
  if (await p.locator("#view-cards .fc-list").count()) throw new Error("med vajo je viden seznam kartic");
  if (await p.locator("#view-cards .fc-face-back").isVisible()) throw new Error("odgovor viden pred obratom");
  await click(p, "#view-cards .fc-flip", { wait: 700 });
  await expectVisible(p, "#view-cards .fc-face-back", "hrbet kartice po obratu");
  await screen(p, "kartice-obrnjena");
  // na vrsti je lahko več kartic (tudi vzorčne): oceni vse do konca vaje
  for (let i = 0; i < 20 && !(await p.locator("#view-cards .fc-done").count()); i++) {
    if (!(await p.locator("#view-cards .fc-flip.flipped").count())) await click(p, "#view-cards .fc-flip", { wait: 650 });
    await click(p, '#view-cards .fc-grade [data-act="know"]', { wait: 400 });
  }
  await expectVisible(p, "#view-cards .fc-done", "konec vaje");
  await click(p, "#view-cards [data-back]", { wait: 400 });
  await click(p, ".fc-back");
}

async function feedback(p, label) {
  const t = p.locator('.topbar .tab[data-view="feedback"]');
  if (!(await t.isVisible()) && !(await p.locator("#tabbar").evaluate((b) => getComputedStyle(b).display !== "none"))) return;
  await tab(p, "feedback");
  await settle(p, 300);
  if ((await currentView(p)) !== "view-feedback") throw new Error("Mnenje se ni odprlo");
  await screen(p, `mnenje-${label}`);
}

// ---------- scenariji ----------

async function desktop(browser, app) {
  const p = await newPage(browser, false, "pc", app.base);
  p.db = app.db;
  await p.goto(app.base + "/");
  await step(p, "uvod-OS", () => onboard(p, "Ana", ["OSNOVNA_SOLA", "8. razred"], { interests: true, tour: "vse" }));
  await step(p, "naloga", () => practiceTopic(p, app.db));
  await step(p, "dnevni-trening", async () => {
    await click(p, "#xp-card [data-daily]", { wait: 400 });
    await expectVisible(p, "#practice .task, #practice .result, #practice p", "dnevni trening");
    await screen(p, "dnevni-trening");
    await click(p, "#back-to-path");
  });
  await step(p, "nadaljuj", () => quickStart(p));
  await step(p, "predmet-meni", () => subjectSwitch(p, "OS"));
  // Zbirke so na računalniku v meniju profila (na telefonu pod »Jaz«).
  await step(p, "profil-zbirke", async () => {
    await click(p, "#profile-btn");
    await click(p, '#profile-pop [data-act="zbirke"]', { wait: 400 });
    if ((await currentView(p)) !== "view-zbirke") throw new Error("Zbirke se iz menija profila niso odprle");
    await tab(p, "path");
  });
  for (const m of ["review", "test", "cards"]) {
    await step(p, `nacin-${m}`, async () => {
      await tab(p, "path");
      await click(p, `#modebar [data-mode="${m}"]`, { wait: 400 });
      await screen(p, `nacin-${m}`);
      await tab(p, "path");
    });
  }
  await step(p, "ucbenik", () => textbook(p, "OS"));
  await step(p, "klepet", () => chat(p, "OS"));
  await step(p, "kalkulator", () => calculator(p, "OS"));
  await step(p, "laboratorij", () => lab(p, "OS"));
  await step(p, "okna", () => okna(p, "OS"));
  await step(p, "razdelilnik", () => razdelilnik(p, "OS"));
  await step(p, "okna-vsi", () => oknaVsi(p));
  await step(p, "tekmovanja", () => competition(p, "OS"));
  await step(p, "poskusno-tekmovanje", () => contest(p, "OS"));
  await step(p, "npz-matura", () => examsView(p, "OS"));
  await step(p, "npz-trening", () => competition(p, "OS-npz", "exams"));
  await step(p, "npz-poskusni", () => contest(p, "OS-npz", "exams"));
  await step(p, "igre", () => games(p, "OS"));
  await views(p, "OS");
  await step(p, "mnenje", () => feedback(p, "OS"));
  await step(p, "nastavitve", () => settingsChange(p));
  await step(p, "lige", () => league(p));
  await step(p, "kartice", () => flashcards(p));
  await step(p, "urnik", () => schedule(p));
  await step(p, "skeniraj", () => scan(p, "OS"));
  // »Dodaj profil« se da preklicati: Nastavitve in zavihki se vrnejo.
  await step(p, "nov-profil-preklic", async () => {
    await click(p, "#profile-btn");
    await click(p, '#profile-pop [data-act="add"]', { wait: 300 });
    await p.fill('#new-student-form input[name="name"]', "Preklic");
    await click(p, '#new-student-form button[type="submit"]', { wait: 400 });
    await expectVisible(p, "#onboard-form [data-onb-cancel]", "»Prekliči« na uvodu profila");
    await click(p, "#onboard-form [data-onb-cancel]", { wait: 300 });
    if ((await currentView(p)) !== "view-settings") throw new Error("»Prekliči« ne vodi nazaj v Nastavitve");
    if (!(await p.locator(".topbar .tabs").isVisible())) throw new Error("po preklicu so zavihki še skriti");
  });
  // Drugi in tretji profil: »Dodaj profil« iz menija profila.
  for (const [name, levels, lbl, opts] of [
    ["Bor", ["SREDNJA_SOLA", "2. letnik", "VR"], "SS", { tour: "esc", away: true }],
    ["Cene", ["UNIVERZA", "UL", "UL-FMF", "UL-FMF-MAT", "1. letnik"], "UNI", { tour: "preskoci" }],
  ]) {
    await step(p, `nov-profil-${lbl}`, async () => {
      await click(p, "#profile-btn");
      await click(p, '#profile-pop [data-act="add"]', { wait: 300 });
      await p.fill('#new-student-form input[name="name"]', name);
      await click(p, '#new-student-form button[type="submit"]', { wait: 400 });
      await onboard(p, name, levels, opts);
    });
    await step(p, `pot-${lbl}`, async () => {
      await click(p, "#xp-card .next-row[data-open]", { wait: 300 });
      await expectVisible(p, "#view-topic .topic-head, #view-topic #practice .task", "stran teme");
      await screen(p, `tema-${lbl}`);
      await click(p, "#back-to-path");
    });
    await step(p, `ucbenik-${lbl}`, () => textbook(p, lbl));
    if (lbl === "UNI") await step(p, "predmet-meni-UNI", () => subjectSwitch(p, lbl));
    await step(p, `klepet-${lbl}`, () => chat(p, lbl));
    if (lbl === "SS") await step(p, `tekmovanja-${lbl}`, () => competition(p, lbl));
    if (lbl === "SS") await step(p, `npz-matura-${lbl}`, () => examsView(p, lbl));
    if (lbl === "UNI")
      await step(p, "faks-brez-npz", async () => {
        if (await p.locator("#exams-tab").isVisible()) throw new Error("fakulteta ima zavihek NPZ in matura");
      });
    if (lbl === "UNI")
      await step(p, "faks-brez-tekmovanj", async () => {
        if (await p.locator("#competition-tab").isVisible()) throw new Error("fakulteta ima zavihek Tekmovanja");
      });
    await views(p, lbl);
  }
  await step(p, "meni-profila", () => profileMenu(p));
  // Izpiti: profil v tujem šolskem sistemu (zavihek »Izpiti«). Osvežitev na podstrani (Urnik)
  // preveri tudi, da zgodovina ne odpelje iz aplikacije.
  await step(p, "izpiti", async () => {
    const id = await p.evaluate(() => localStorage.getItem("studentId"));
    await p.evaluate(async (id) => {
      await fetch(`/api/students/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: { school_system: "IN-CBSE", educational_track: "SREDNJA_SOLA", curriculum_level: "Class 11", language: "sl" } }) });
    }, id);
    await p.reload();
    await settle(p, 500);
    await expectVisible(p, "#view-path #xp-card .hero", `učna pot po osvežitvi (${p.url()})`, 8000);
    await tab(p, "competition");
    await expectVisible(p, "#competition-content [data-comp-train]", "izpiti");
    if (await p.locator("#exams-tab").isVisible()) throw new Error("regijski sistem ima zavihek NPZ in matura");
    await screen(p, "izpiti");
    await click(p, "#competition-content [data-comp-train]", { wait: 400 });
    await expectVisible(p, "#practice .task", "naloga izpitnega treninga");
    await screen(p, "izpit-trening");
    // Razlaga ob seriji nalog: »Celotna lekcija« odpre lekcijo te teme v učbeniku.
    await expectVisible(p, "#session-side #side-lesson", "razlaga ob nalogi");
    const topic = (await p.locator("#session-side h2").innerText()).trim();
    await click(p, "#side-lesson", { wait: 500 });
    await expectVisible(p, "#view-textbook .tb-title", "lekcija iz razlage ob nalogi");
    const title = (await p.locator("#view-textbook .tb-title").innerText()).trim();
    if (title !== topic) throw new Error(`»Celotna lekcija« odpre »${title}« namesto »${topic}«`);
  });
  await p.context().close();
}

// Uči se na telefonu: trije zavihki, zadnji ostane izbran, 3D svet odpre model čez cel zaslon in Nazaj ga zapre.
async function uciPhone(p) {
  for (const v of UCI_TABS) {
    await click(p, `#view-uci [data-uci-tab="${v}"]`, { wait: 300 });
    if ((await currentView(p)) !== `view-${v}`) throw new Error(`zavihek »${v}« v Uči se se ni odprl`);
    const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (over > 1) throw new Error(`Uči se → ${v}: vodoravno drsenje (${over} px)`);
  }
  await expectVisible(p, "#view-3d .uci-3d-card", "kartice 3D sveta", 8000);
  await screen(p, "uci-3d");
  await click(p, "#view-3d .uci-3d-card", { wait: 300 });
  // Okvir je istega izvora in si deli glavno nit: gradnja prizora (swiftshader) lahko za nekaj sekund ustavi strani.
  await p.locator(".uci-3d-full iframe").waitFor({ state: "attached", timeout: 20000 }).catch(async () => {
    throw new Error(`3D se ni odprl čez cel zaslon (${await p.evaluate(() => document.querySelectorAll(".uci-3d-full").length)} okvirjev)`);
  });
  const box = await p.locator(".uci-3d-full").boundingBox();
  if (!box || box.width < p.viewportSize().width - 1 || box.height < p.viewportSize().height - 1) throw new Error(`3D ni čez cel zaslon (${JSON.stringify(box)})`);
  const frame = p.frameLocator(".uci-3d-full iframe");
  await frame.locator("#k3-glavni > *").first().waitFor({ state: "attached", timeout: 20000 }).catch(() => {
    throw new Error("stran /3d se v okvirju ni naložila");
  });
  await p.goBack();
  await settle(p, 300);
  if (await p.locator(".uci-3d-full").count()) throw new Error("tipka Nazaj ne zapre 3D čez cel zaslon");
  if ((await currentView(p)) !== "view-3d") throw new Error(`po zaprtju 3D je odprt ${await currentView(p)}`);
  // Zadnji zavihek: Laboratorij ostane izbran, ko se učenec vrne v »Uči se«.
  await click(p, '#view-uci [data-uci-tab="lab"]', { wait: 300 });
  await barTab(p, "path", { wait: 300 });
  await barTab(p, "uci", { wait: 300 });
  if ((await currentView(p)) !== "view-lab") throw new Error(`»Uči se« ne odpre zadnjega zavihka (${await currentView(p)})`);
  // Povezave iz lekcije (katalog): »Poglej v 3D« odpre pravi model čez cel zaslon (Nazaj in Esc sta preverjena zgoraj);
  // »Poskus v laboratoriju« odpre poskus, Nazaj vrne v lekcijo (ne na seznam poskusov). Klik prek DOM in dolgi roki:
  // lekcija s 3D modelom ga gradi na glavni niti in telefon brez grafične kartice med tem skoraj ne riše.
  const uciTb = async (id) => {
    await p.evaluate((id) => window.evklid.openLesson(id), id);
    await expectVisible(p, "#view-textbook .tb-links", `povezave v lekciji ${id}`, 15000);
  };
  const closeLesson = async () => {
    await p.goBack();
    await p.locator("#view-textbook .tb-title").waitFor({ state: "detached", timeout: 15000 }).catch(() => {
      throw new Error("Nazaj ne zapre lekcije");
    });
  };
  await uciTb("BIO-OS-8/dna-in-dedna-informacija");
  // Klik in Esc v enem koraku: okvir se zapre, preden začne graditi prizor.
  const src = await p.evaluate(() => {
    document.querySelector("#view-textbook .tb-link[data-tb-3d]").click();
    const f = document.querySelector(".uci-3d-full iframe")?.getAttribute("src") || "";
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    return f;
  });
  if (!/^\/3d\?vgrajeno=1#[a-z0-9]+(-[a-z0-9]+)*$/.test(src)) throw new Error(`»Poglej v 3D« v lekciji ne odpre modela (${src || "brez okvirja"})`);
  if (await p.locator(".uci-3d-full").count()) throw new Error("Esc ne zapre 3D modela iz lekcije");
  await closeLesson();
  await uciTb("FIZ-OS-8/gostota");
  await p.evaluate(() => document.querySelector("#view-textbook .tb-link[data-tb-lab]").click());
  await expectVisible(p, "#view-lab .lab-stage", "poskus iz lekcije", 15000);
  await p.goBack();
  await settle(p, 300);
  if ((await currentView(p)) !== "view-textbook") throw new Error(`Nazaj iz poskusa, odprtega v lekciji, odpre ${await currentView(p)} namesto lekcije`);
  await expectVisible(p, "#view-textbook .tb-title", "lekcija po Nazaj iz poskusa");
  await closeLesson();
}

async function phone(browser, app) {
  const p = await newPage(browser, true, "tel", app.base);
  p.db = app.db;
  await p.goto(app.base + "/");
  await settle(p, 500);
  // Profil iz baze se odpre brez uvoda (prvi profil).
  await step(p, "zagon", async () => {
    await expectVisible(p, "#view-path #xp-card .hero", "učna pot na telefonu", 8000);
    if (!(await p.locator("#tabbar").isVisible())) throw new Error("spodnja vrstica ni vidna");
    await screen(p, "pot");
  });
  // Vodič na telefonu: »Ponovi uvodni ogled« v Nastavitvah, vsi koraki (zavihki pod »Jaz« se preskočijo).
  await step(p, "tel-vodic", async () => {
    await barTab(p, "me", { wait: 200 });
    await click(p, '#view-me [data-go="settings"]', { wait: 300 });
    await click(p, "#tour-again", { wait: 200 });
    await closeTour(p, "vse");
    if ((await currentView(p)) !== "view-path") throw new Error("po vodiču ni odprta Učna pot");
  });
  // Uči se (Učbenik | Laboratorij | 3D svet, j 4. 11.), Inštruktor in četrto mesto: Tekmovanja ali NPZ/Matura.
  const fourth = await p.locator("#competition-tab-m").getAttribute("data-view");
  for (const v of ["uci", "chat", fourth]) {
    await step(p, `zavihek-${v}`, async () => {
      await barTab(p, v, { wait: 300 });
      if ((await currentMain(p)) !== `view-${v}`) throw new Error(`zavihek ${v} se ni odprl`);
      await screen(p, v);
      if (v === "uci") await uciPhone(p);
      if (v === fourth) {
        if (!(await p.locator("#competition-tab-m").evaluate((b) => b.classList.contains("active")))) throw new Error(`${v} v spodnji vrstici ni označen`);
        if (await p.locator(`#view-${v} .me-back`).isVisible()) throw new Error(`${v} v spodnji vrstici ima gumb »← Jaz«`);
      }
    });
  }
  // Klepet: spodnja vrstica umaknjena, vrstica za pisanje na dnu; kolešček gor jo pokaže, Nazaj v glavi vodi nazaj.
  await step(p, "tel-vrstica", async () => {
    await barTab(p, "chat", { wait: 400 });
    if (await p.locator("#tabbar").isVisible()) throw new Error("spodnja vrstica v klepetu ni skrita");
    const gap = await p.evaluate(() => innerHeight - document.querySelector("#composer").getBoundingClientRect().bottom);
    if (Math.abs(gap) > 1) throw new Error(`vrstica za pisanje ni na dnu (${gap} px)`);
    await revealBar(p);
    const over = await p.evaluate(() => document.querySelector("#composer").getBoundingClientRect().bottom - document.querySelector("#tabbar").getBoundingClientRect().top);
    if (over > 1) throw new Error(`pokazana spodnja vrstica prekrije vrstico za pisanje (${over} px)`);
    await click(p, "#chat-back", { wait: 400 });
    if ((await currentMain(p)) !== `view-${fourth}`) throw new Error(`Nazaj v klepetu vodi na ${await currentMain(p)}`);
  });
  await step(p, "jaz", async () => {
    await barTab(p, "me", { wait: 300 });
    await expectVisible(p, "#view-me .me-head", "Jaz");
    await screen(p, "jaz");
  });
  // Vsaka vrstica v »Jaz« in nazaj (gumb in tipka Nazaj).
  const rows = await p.locator("#view-me [data-go]").evaluateAll((bs) => bs.filter((b) => !b.hidden && b.offsetParent).map((b) => b.dataset.go));
  for (const v of rows) {
    await step(p, `jaz-${v}`, async () => {
      await barTab(p, "me", { wait: 200 });
      await click(p, `#view-me [data-go="${v}"]`, { wait: 400 });
      if ((await currentView(p)) !== `view-${v}`) throw new Error(`»${v}« se ni odprl`);
      await screen(p, `jaz-${v}`);
      await p.goBack();
      await settle(p, 300);
      const now = await currentView(p);
      if (now !== "view-me" && v !== "graph") throw new Error(`tipka Nazaj z »${v}« vodi na ${now} namesto na »Jaz«`);
    });
  }
  await step(p, "tel-naloga", async () => {
    await barTab(p, "path", { wait: 300 });
    await click(p, "#xp-card .next-row[data-open]", { wait: 400 });
    await expectVisible(p, "#view-topic", "tema");
    await screen(p, "tema");
    if (await p.locator("#t-practice").isVisible()) await click(p, "#t-practice", { wait: 400 });
    if (await p.locator("#ex-next").isVisible()) await click(p, "#ex-next", { wait: 400 });
    await screen(p, "naloga");
    await p.goBack();
    await settle(p, 300);
    if ((await currentView(p)) !== "view-path") throw new Error("tipka Nazaj s teme ne vodi na učno pot");
  });
  await step(p, "tel-nadaljuj", () => quickStart(p));
  await step(p, "tel-klepet", () => chat(p, "tel"));
  await step(p, "tel-osvezitev", async () => {
    // Osvežitev na podstrani (potegni za osvežitev) in tipka Nazaj: aplikacija mora ostati odprta.
    await barTab(p, "me", { wait: 200 });
    await click(p, '#view-me [data-go="settings"]', { wait: 300 });
    await p.reload();
    await settle(p, 600);
    await expectVisible(p, "#view-path #xp-card .hero", "učna pot po osvežitvi", 8000);
    await barTab(p, "chat", { wait: 300 });
    await p.goBack();
    await settle(p, 400);
    if (!p.url().startsWith(p.base)) throw new Error(`tipka Nazaj po osvežitvi zapre aplikacijo (${p.url()})`);
    if ((await currentView(p)) !== "view-path") throw new Error(`tipka Nazaj po osvežitvi vodi na ${await currentView(p)}`);
  });
  await step(p, "tel-ucbenik", () => textbook(p, "tel"));
  await step(p, "tel-kalkulator", () => calculator(p, "tel"));
  await step(p, "tel-laboratorij", () => lab(p, "tel"));
  await step(p, "tel-okna", () => okna(p, "tel"));
  await step(p, "tel-igre", () => games(p, "tel"));
  await step(p, "tel-skeniraj", () => scan(p, "tel"));
  await p.context().close();
}

async function accounts(browser, app) {
  const p = await newPage(browser, false, "racun", app.base);
  p.db = app.db;
  await p.goto(app.base + "/");
  await settle(p, 500);
  const email = "stars@primer.si";
  // Nov obiskovalec najprej vidi pristajalno stran (public/pristajalna.js), od tam gre na prijavo.
  await step(p, "pristajalna", async () => {
    await expectVisible(p, "#view-auth .land .land-hero", "pristajalna stran");
    await screen(p, "pristajalna");
    await click(p, '#view-auth .land-hero [data-land="login"]', { wait: 300 });
  });
  await step(p, "prijava-prazna", async () => {
    await expectVisible(p, "#view-auth #auth-form", "prijava");
    await screen(p, "prijava");
    p.allow = [/^401 \/api\/auth\/login$/];
    await p.fill('#auth-form input[name="email"]', email);
    await p.fill('#auth-form input[name="password"]', "napacno-geslo");
    await click(p, '#auth-form button[type="submit"]', { wait: 300 });
    await expectVisible(p, "#auth-form .form-error", "napaka ob napačnem geslu");
    p.allow = [];
  });
  await step(p, "registracija", async () => {
    await click(p, '#view-auth [data-go="register"]');
    await p.fill('#auth-form input[name="name"]', "Mama");
    await p.fill('#auth-form input[name="email"]', email);
    await p.fill('#auth-form input[name="password"]', "geslo1234");
    await p.fill('#auth-form input[name="birth_date"]', "1985-04-02");
    await p.check('#auth-form input[name="accept_privacy"]');
    await screen(p, "registracija");
    await click(p, '#auth-form button[type="submit"]', { wait: 400 });
    await expectVisible(p, "#verify-done", "potrditev e-naslova");
    await screen(p, "potrditev");
    const href = await p.locator('#view-auth a[href*="/api/auth/verify"]').getAttribute("href");
    await p.goto(href);
    await settle(p, 500);
  });
  await step(p, "otrok", async () => {
    await expectVisible(p, "#child-form", "obrazec za otroka", 8000);
    await p.check('#child-form input[name="whose"][value="child"]');
    await p.fill('#child-form input[name="name"]', "Miha");
    for (const val of ["OSNOVNA_SOLA", "7. razred"]) await click(p, `#child-form .lp-opt[data-val="${val}"]`);
    await p.selectOption('#child-form select[name="birth_year"]', String(new Date().getFullYear() - 12));
    // Prvi profil nima gesla profila (j, 2026-10-30): polja ni.
    if (await p.$('#child-form input[name="profile_password"]')) throw new Error("prvi profil sprašuje za geslo profila");
    await p.check('#child-form input[name="consent"]');
    await screen(p, "otrok");
    await click(p, '#child-form button[type="submit"]', { wait: 600 });
    await expectVisible(p, ".iq-wrap .iq", "vprašalnik zanimanj otroka", 8000);
    await click(p, ".iq-wrap [data-iq=skip]", { wait: 300 });
    await closeTour(p, "preskoci");
    await expectVisible(p, "#view-path #xp-card .hero", "učna pot otroka");
    await screen(p, "pot-otroka");
  });
  await step(p, "racun", async () => {
    await click(p, "#account-tab", { wait: 500 });
    await expectVisible(p, "#view-account #logout-btn", "Račun");
    await screen(p, "racun");
  });
  await step(p, "dodaj-profil", async () => {
    await click(p, "#profile-btn");
    await click(p, '#profile-pop [data-act="add"]', { wait: 400 });
    if ((await currentView(p)) !== "view-account") throw new Error("»Dodaj profil« ne odpre Računa");
  });
  await step(p, "klepet-racun", () => chat(p, "racun"));
  await step(p, "odjava-prijava", async () => {
    await click(p, "#account-tab", { wait: 400 });
    await click(p, "#logout-btn", { wait: 500 });
    await expectVisible(p, "#auth-form", "prijava po odjavi", 8000);
    await p.fill('#auth-form input[name="email"]', email);
    await p.fill('#auth-form input[name="password"]', "geslo1234");
    await click(p, '#auth-form button[type="submit"]', { wait: 600 });
    // Geslo samo enkrat (j, 2026-10-30): po ponovni prijavi z geslom računa profil ne zahteva gesla znova.
    if (await p.$("#lock-overlay")) throw new Error("po ponovni prijavi profil spet zahteva geslo");
    await expectVisible(p, "#view-path #xp-card .hero", "učna pot po prijavi", 8000);
    // Račun z enim profilom: na drugi napravi ni zaslona za geslo profila (j, 2026-10-30), samo prevzem.
    const p2 = await newPage(browser, false, "pc2", app.base);
    try {
      await p2.goto(app.base + "/#prijava");
      await expectVisible(p2, "#auth-form", "prijava na drugi napravi", 8000);
      await p2.fill('#auth-form input[name="email"]', email);
      await p2.fill('#auth-form input[name="password"]', "geslo1234");
      // Profil je odprt na prvi napravi: druga ga prevzame (»Nadaljuj tukaj«).
      p2.allow = [/^409 \/api\/students\/\d+\//];
      await click(p2, '#auth-form button[type="submit"]', { wait: 600 });
      if (await p2.$("#lock-overlay #lock-form")) throw new Error("en profil, pa druga naprava zahteva geslo profila");
      await expectVisible(p2, "#taken-here", "prevzem profila na drugi napravi", 8000);
      await click(p2, "#taken-here", { wait: 800 });
      p2.allow = [];
      await expectVisible(p2, "#view-path #xp-card .hero", "učna pot na drugi napravi", 8000);
    } finally {
      await p2.context().close();
    }
  });
  await step(p, "ucitelj", async () => {
    await p.goto(app.base + "/ucitelj.html");
    await expectVisible(p, "#class-form", "stran za učitelje", 8000);
    if (await p.$("#school-form")) {
      await p.fill('#school-form input[name="name"]', "OŠ Preizkus");
      await click(p, '#school-form button[type="submit"]', { wait: 600 });
      await expectVisible(p, "[data-leave-school]", "šola dodana");
    }
    await p.fill('#class-form input[name="name"]', "7.a");
    await p.selectOption('#class-form select[name="path"]', "MAT-OS-7");
    await click(p, '#class-form button[type="submit"]', { wait: 800 });
    await expectVisible(p, "[data-class] .tc-add", "pregled novega razreda", 8000);
    await p.waitForFunction(() => document.querySelector('.tc-add select[name="topic"]')?.options.length > 2, null, { timeout: 8000 });
    const topic = await p.$eval('.tc-add select[name="topic"] optgroup option', (o) => o.value);
    await p.selectOption('.tc-add select[name="topic"]', topic);
    await click(p, '.tc-add button[type="submit"]', { wait: 800 });
    await expectVisible(p, ".tc-assign li", "naloga razreda dodana", 8000);
    await screen(p, "ucitelj");
  });
  await step(p, "starsi", async () => {
    await p.goto(app.base + "/starsi.html");
    await settle(p, 400);
    await screen(p, "starsi");
  });
  await step(p, "sole", async () => {
    await p.goto(app.base + "/sole");
    await settle(p, 400);
    await screen(p, "sole");
  });
  await p.context().close();
}

(async () => {
  checkAnswer = (await import(pathToFileURL(path.join(ROOT, "server/practice/check.js")))).checkAnswer;
  process.removeAllListeners("warning");
  sqlite = require("node:sqlite");
  KEYS = Object.keys((await import(pathToFileURL(path.join(ROOT, "public/i18n/sl.js")))).default);
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await chromium.launch();
  try {
    const app = await startServer();
    if (ONLY !== "telefon") await desktop(browser, app);
    if (ONLY !== "racunalnik") await phone(browser, app);
    if (ACCOUNTS && !ONLY) {
      const acc = await startServer({ EVKLID_ACCOUNTS: "1" });
      await accounts(browser, acc);
      const bad = acc.log.join("").split("\n").filter((l) => /napaka|Error|TypeError/.test(l) && !/\[evklid\] 4\d\d /.test(l));
      bad.forEach((l) => problem("strežnik (računi)", l.slice(0, 200)));
    }
    const bad = app.log.join("").split("\n").filter((l) => /napaka|Error|TypeError/.test(l) && !/\[evklid\] 4\d\d /.test(l));
    bad.forEach((l) => problem("strežnik", l.slice(0, 200)));
  } finally {
    await browser.close();
    stopServers();
  }
  for (const n of notes) console.log(`opomba: ${n}`);
  for (const { where, what } of problems) console.log(`NAPAKA ${where}: ${what}`);
  console.log(`Preverjeno v ${Math.round((Date.now() - T0) / 1000)} s${SHOTS ? `, posnetki: ${shotN} v ${SHOTS}` : ""}. Težav: ${problems.length}.`);
  process.exit(problems.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  stopServers();
  process.exit(1);
});
