#!/usr/bin/env node
// Vizualni pregled lekcij v aplikaciji (j 2026-10-31: »koreni nad ulomki, neporavnane tabele, necentriran tekst«).
// Izriše vsako lekcijo (vse naenkrat, ne po korakih) na telefonu (360 px) in računalniku (1280 px) v
// preizkusnem načinu in poišče težave, ki jih vidi učenec:
//   katex      napaka KaTeX (rdeč surovi TeX)
//   koren      znak korena brez črte (SVG KaTeX skrčen s tujim CSS)
//   sirina     formula, tabela ali odstavek širši od kartice (vodoravni drsnik ali odrezano)
//   tabela     vrstice z različnim številom celic, stolpec z različno poravnavo
//   sredina    prikazna formula ($$…$$) ni na sredini kartice
//   vrstica    formula sredi besedila razmakne vrstico (razmik med vrsticami ni enak)
// Formula ali tabela, ki je tudi po pomanjšanju (public/sirina.js) širša od kartice, se pomika z bledim
// robom: to je le opozorilo »drsnik« (ne šteje kot napaka), da se vidi, kje bi pomagal krajši zapis.
// Uporaba: node scripts/preveri-videz-lekcij.cjs [--slike mapa] [--samo POT/tema …] [--json datoteka] [--vse]
const { chromium } = require("playwright");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");

const ROOT = path.resolve(__dirname, "..");
const argv = process.argv.slice(2);
const opt = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : null);
const all = argv.includes("--vse");
const shots = opt("--slike");
const jsonOut = opt("--json");
const only = argv.includes("--samo") ? argv.slice(argv.indexOf("--samo") + 1).map((a) => a.replace(/^(?:.*\/)?content\/lessons\//, "").replace(/\.md$/, "")).filter((a) => /^[A-Z][A-Z0-9-]*\/[a-z0-9-]+$/.test(a)) : null;

if (only && !only.length) {
  console.error("--samo: navedi id-je v obliki POT/tema (npr. MAT-SS-1/naravna-in-cela-stevila)");
  process.exit(2);
}
const ids = only || fs
  .readdirSync(path.join(ROOT, "content/lessons"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) => fs.readdirSync(path.join(ROOT, "content/lessons", d.name)).filter((f) => f.endsWith(".md")).map((f) => `${d.name}/${f.slice(0, -3)}`))
  .sort();

const freePort = () =>
  new Promise((res, rej) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
    s.on("error", rej);
  });

async function start() {
  const port = await freePort();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-videz-"));
  const env = { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_MOCK_DELAY_MS: "0", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", ANTHROPIC_API_KEY: "", RESEND_API_KEY: "", STRIPE_SECRET_KEY: "" };
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: ROOT, env, stdio: "ignore" });
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base + "/healthz")).ok) return { base, stop: () => (srv.kill(), fs.rmSync(dir, { recursive: true, force: true })) };
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  srv.kill();
  throw new Error("strežnik se ni zagnal");
}

async function page(browser, base, phone) {
  const ctx = await browser.newContext({ viewport: phone ? { width: 360, height: 740 } : { width: 1280, height: 800 }, isMobile: phone, hasTouch: phone, deviceScaleFactor: 1, locale: "sl-SI", reducedMotion: "reduce", serviceWorkers: "block" });
  const p = await ctx.newPage();
  await p.goto(base + "/");
  await p.waitForSelector("#onboard-form", { timeout: 15000 });
  await p.fill('#onboard-form input[name="name"]', "Videz");
  for (const v of ["OSNOVNA_SOLA", "8. razred"]) {
    const o = p.locator(`#onboard-form .lp-opt[data-val="${v}"]`);
    if (await o.count()) await o.first().click();
  }
  await p.click('#onboard-form button[type="submit"]');
  await p.waitForSelector(".iq-wrap [data-iq=skip]", { timeout: 8000 }).then(() => p.click(".iq-wrap [data-iq=skip]")).catch(() => {});
  await p.waitForSelector("#tour", { timeout: 5000 }).then(() => p.click('#tour [data-tour="skip"]')).catch(() => {});
  await p.evaluate(() => localStorage.setItem("tb-steps", "0"));
  if (process.env.VIDEZ_DEBUG) await p.screenshot({ path: process.env.VIDEZ_DEBUG });
  return p;
}

// Meritve v brskalniku za odprto lekcijo.
function measure() {
  const out = [];
  const add = (kind, el, detail) => {
    const raw = el.closest(".katex-display, .katex")?.querySelector("annotation")?.textContent || "";
    // Brez ovojev klikljivih oznak (\htmlData{fx=…}{x} → x).
    let tex = raw;
    for (let i = 0; i < 5; i++) tex = tex.replace(/\\htmlData\{[^{}]*\}\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/g, "$1");
    const box = el.closest(".katex-display, table, p, li") || el;
    box.setAttribute("data-videz", String(out.length));
    const sec = el.closest(".tb-section")?.querySelector("h2")?.textContent || "";
    out.push({ kind, detail, tex: tex.slice(0, 160), sec, text: tex ? "" : (el.textContent || "").trim().slice(0, 80) });
  };
  const root = document.querySelector("#view-textbook");
  if (!root) return [{ kind: "napaka", detail: "lekcija se ni odprla" }];
  // Razlaga drugače: odpri vse zavihke ni potrebno; preveri, kar je izrisano.
  root.querySelectorAll(".katex-error").forEach((e) => add("katex", e, e.title || e.textContent.slice(0, 80)));
  // KaTeX nariše znak korena s črto kot SVG v .hide-tail; če ga tuj CSS skrči, črta nad korenom manjka.
  root.querySelectorAll(".katex svg").forEach((svg) => {
    const box = svg.parentElement;
    const w = svg.getBoundingClientRect().width;
    const bw = box.getBoundingClientRect().width;
    if (bw > 4 && w < bw - 2) add("koren", svg, `SVG v formuli (${svg.closest(".sqrt") ? "koren" : "znak"}) je ožji od svojega prostora (${Math.round(w)} od ${Math.round(bw)} px)`);
  });
  const within = (el) => {
    const c = el.closest(".card");
    if (!c || !el.getClientRects().length) return true; // skrit element (npr. zaprt poskus) nima mesta
    const cr = c.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return r.left >= cr.left - 1 && r.right <= cr.right + 1;
  };
  root.querySelectorAll(".katex-display").forEach((d) => {
    const k = d.querySelector(".katex");
    const dr = d.getBoundingClientRect();
    if (d.scrollWidth > d.clientWidth + 2) add("drsnik", d, `formula širša od kartice za ${d.scrollWidth - d.clientWidth} px`);
    else if (!within(d)) add("sirina", d, "formula sega čez rob kartice");
    else if (k) {
      const kr = k.querySelector(".katex-html")?.getBoundingClientRect() || k.getBoundingClientRect();
      const left = kr.left - dr.left;
      const right = dr.right - kr.right;
      if (Math.abs(left - right) > 12 && kr.width < dr.width - 4) add("sredina", d, `formula ni na sredini (levo ${Math.round(left)} px, desno ${Math.round(right)} px)`);
    }
  });
  root.querySelectorAll("table").forEach((t) => {
    const rows = [...t.rows];
    const counts = rows.map((r) => [...r.cells].reduce((n, c) => n + (c.colSpan || 1), 0));
    if (new Set(counts).size > 1) add("tabela", t, `vrstice imajo različno število celic (${counts.join(",")})`);
    const wrap = t.parentElement;
    const scrolls = wrap && getComputedStyle(wrap).overflowX !== "visible" && wrap.scrollWidth > wrap.clientWidth + 2;
    if (scrolls) add("drsnik", t, `tabela širša od kartice za ${wrap.scrollWidth - wrap.clientWidth} px`);
    else if (!within(t)) add("sirina", t, "tabela sega čez rob kartice");
    // Poravnava: stolpec s samimi števili naj bo poravnan enako v vseh vrsticah.
    const body = [...(t.tBodies[0]?.rows || [])];
    for (let c = 0; c < (counts[0] || 0); c++) {
      const al = new Set(body.map((r) => r.cells[c] && getComputedStyle(r.cells[c]).textAlign).filter(Boolean));
      if (al.size > 1) add("tabela", t, `stolpec ${c + 1} ima različno poravnavo (${[...al].join("/")})`);
    }
  });
  root.querySelectorAll(".explanation p, .explanation li, .tb-section h2").forEach((e) => {
    if (e.scrollWidth > e.clientWidth + 2 && !e.querySelector(".katex-display")) add("sirina", e, `besedilo širše od kartice za ${e.scrollWidth - e.clientWidth} px`);
  });
  // Formula sredi besedila ne sme razmakniti vrstice (j 2026-11-01: enak razmik med vrsticami).
  root.querySelectorAll(".explanation :is(p, li) .katex:not(.tb-zlozena, .tb-dolga)").forEach((k) => {
    if (k.parentElement.closest(".katex-display, table, .katex")) return;
    const cs = getComputedStyle(k);
    const lh = parseFloat(getComputedStyle(k.parentElement.closest("p, li")).lineHeight);
    const h = k.getBoundingClientRect().height + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
    if (cs.display === "inline-block" && Number.isFinite(lh) && h > lh + 1) add("vrstica", k, `formula razmakne vrstico (${Math.round(h)} px, vrstica ${Math.round(lh)} px)`);
  });
  root.querySelectorAll(".katex.tb-dolga").forEach((k) => {
    if (k.scrollWidth > k.clientWidth + 2) add("drsnik", k, `formula v besedilu širša od kartice za ${k.scrollWidth - k.clientWidth} px`);
  });
  root.querySelectorAll("pre").forEach((e) => {
    if (!within(e)) add("sirina", e, "blok kode sega čez rob kartice");
  });
  if (document.documentElement.scrollWidth > innerWidth + 1) out.push({ kind: "sirina", detail: `stran se pomika vodoravno (${document.documentElement.scrollWidth - innerWidth} px)` });
  return out;
}

(async () => {
  const app = await start();
  let browser;
  const report = {};
  try {
    browser = await chromium.launch();
    const p = await page(browser, app.base, true);
    for (const phone of [true, false]) {
      const label = phone ? "telefon" : "racunalnik";
      if (!phone) await p.setViewportSize({ width: 1280, height: 800 });
      for (const id of ids) {
        const ok = await p
          .evaluate(async (id) => {
            document.querySelector("#view-textbook").innerHTML = "";
            const m = await import("/textbook.js");
            await m.openLesson(id);
            for (let i = 0; i < 100 && !document.querySelector("#view-textbook .tb-title"); i++) await new Promise((r) => setTimeout(r, 50));
            await new Promise((r) => setTimeout(r, 50));
            return !!document.querySelector("#view-textbook .tb-title");
          }, id)
          .catch((e) => (console.error(id, e.message), false));
        if (!ok) {
          (report[id] ||= []).push({ view: label, kind: "napaka", detail: "lekcija se ni odprla" });
          continue;
        }
        // Odpri »Razloži drugače« (prvi zavihek) in vse skrite odgovore (<details>), da se izmeri tudi njihova vsebina.
        await p.evaluate(() => {
          document.querySelector("#tb-alt-btn")?.click();
          document.querySelectorAll("#view-textbook details").forEach((d) => (d.open = true));
        });
        await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 40)))));
        const found = await p.evaluate(measure);
        for (const f of found) (report[id] ||= []).push({ view: label, ...f });
        if (shots && found.length) {
          fs.mkdirSync(shots, { recursive: true });
          for (let i = 0; i < Math.min(found.length, 4); i++) {
            const el = await p.$(`[data-videz="${i}"]`);
            if (el) await el.screenshot({ path: path.join(shots, `${id.replace("/", "__")}-${label}-${i}-${found[i].kind}.png`) }).catch(() => {});
          }
        }
      }
    }
    await p.context().close();
  } finally {
    await browser?.close();
    app.stop();
  }
  const kinds = {};
  for (const list of Object.values(report)) for (const f of list) kinds[f.kind] = (kinds[f.kind] || 0) + 1;
  const napake = Object.entries(report).filter(([, list]) => list.some((f) => f.kind !== "drsnik"));
  for (const [id, list] of Object.entries(report)) {
    const show = list.filter((f) => all || f.kind !== "drsnik");
    if (!show.length) continue;
    console.log(`${list.some((f) => f.kind !== "drsnik") ? "✗" : "·"} ${id}`);
    const seen = new Set();
    for (const f of show) {
      const key = f.kind + f.detail + f.tex;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`  - [${f.view}] ${f.kind}: ${f.detail}${f.tex ? `  ${f.tex}` : f.text ? `  »${f.text}«` : ""}`);
    }
  }
  const sum = Object.entries(kinds).map(([k, n]) => `${k} ${n}`).join(", ") || "brez težav";
  console.log(`${ids.length} lekcij, ${napake.length} z napakami; ${sum}.${kinds.drsnik && !all ? " (drsnik je le opozorilo; izpiše ga --vse)" : ""}`);
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 1));
  process.exit(napake.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
