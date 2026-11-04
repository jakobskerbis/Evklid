// Pregled vseh simulacij iz kataloga na telefonski širini (360 px) po merilih docs/kakovost.md §3:
// napake v konzoli, vodoravno drsenje, oznake kontrol, tipkovnica za vlečne elemente, »Poskusi«, »Ponastavi«,
// drsnik, poravnan z osjo (kit.axisSlider): ročica je pri min, sredini in max navpično pod oznako na osi (≤ 2 px, 360 in 1280 px).
// Zagon: node scripts/preveri-simulacije.cjs [SIM_FILTER='^3d-' za del]   (potrebuje Playwright s Chromiumom; zažene strežnik na vratih 3998)
const { spawn } = require("node:child_process");
const path = require("node:path");
const { chromium } = require("playwright");
const PORT = 3998;

(async () => {
  const root = path.join(__dirname, "..");
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: root, env: { ...process.env, PORT, EVKLID_MOCK: "1" }, stdio: "ignore" });
  const base = `http://localhost:${PORT}`;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base + "/style.css")).ok) break; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 360, height: 740 }, hasTouch: true });
  const errs = [];
  let cur = "";
  p.on("pageerror", (e) => errs.push(`${cur}: ${String(e.message).slice(0, 140)}`));
  p.on("console", (m) => m.type() === "error" && errs.push(`${cur}: ${m.text().slice(0, 140)}`));
  await p.goto(base + "/zasebnost.html");
  await p.evaluate(async (filter) => {
    document.head.innerHTML = '<meta name="viewport" content="width=device-width,initial-scale=1">' + ["vendor/katex/katex.min.css", "style.css", "ui.css", "textbook.css"].map((h) => `<link rel="stylesheet" href="/${h}">`).join("");
    document.body.innerHTML = '<div id="box" style="padding:16px"></div>';
    await new Promise((r) => { const sc = document.createElement("script"); sc.src = "/vendor/katex/katex.min.js"; sc.onload = r; document.head.append(sc); });
    const { mountSim } = await import("/sim/index.js");
    const { SIM_TOPICS } = await import("/sim/katalog.js");
    const seen = new Set();
    window.SIMS = [];
    for (const [topic, v] of Object.entries(SIM_TOPICS)) for (const [id, , opts] of Array.isArray(v[0]) ? v : [v]) {
      const k = id + JSON.stringify(opts || {});
      if (!seen.has(k)) seen.add(k), SIMS.push({ topic, id, opts: opts || {} });
    }
    // SIM_FILTER=<regex> preveri le simulacije z ujemajočim id (npr. SIM_FILTER='^3d-').
    if (filter) window.SIMS = SIMS.filter((s) => new RegExp(filter).test(s.id));
    window.mountOne = async (i) => {
      const box = document.getElementById("box");
      box.innerHTML = "";
      const m = document.createElement("div");
      box.append(m);
      await mountSim(SIMS[i].id, m, SIMS[i].opts);
      await new Promise((r) => setTimeout(r, 200));
      // 3D modeli (pogon »3d-<id>«) naložijo three in model asinhrono: počakaj na kontrole pregledovalnika.
      if (SIMS[i].id.startsWith("3d-")) for (let k = 0; k < 150 && !m.querySelector("[data-reset]"); k++) await new Promise((r) => setTimeout(r, 100));
      const ctrls = [...m.querySelectorAll("input,select,button")];
      return {
        overflow: Math.max(document.documentElement.scrollWidth - innerWidth, 0),
        tryText: !!m.querySelector(".demo-try"),
        reset: !!m.querySelector(".demo-reset, [data-reset]") || SIMS[i].id === "zbirka",
        unlabeled: ctrls.filter((c) => !(c.getAttribute("aria-label") || c.textContent.trim() || c.labels?.length || c.title)).length,
        dragNoKey: m.querySelectorAll(".drag:not([tabindex])").length,
        axis: [...m.querySelectorAll(".axis-slider[data-for]")].map((x) => x.dataset.for),
      };
    };
    const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    // Postavi drsnik key na v in vrne lego ročice (iz geometrije tirnice) in oznake na osi.
    window.axisProbe = async (key, v) => {
      const m = document.querySelector("#box > div");
      const sl = m.querySelector(`.axis-slider[data-for="${key}"]`), inp = sl.querySelector("input");
      if (v != null) inp.value = v, inp.dispatchEvent(new Event("input", { bubbles: true }));
      await frames();
      sl.scrollIntoView({ block: "center" });
      await frames();
      const tick = m.querySelector(`.amark[data-for="${key}"] .amark-tick`);
      const ir = inp.getBoundingClientRect(), tr = tick?.getBoundingClientRect();
      const thumb = parseFloat(getComputedStyle(inp).getPropertyValue("--thumb")) || 0;
      const lo = +inp.min, hi = +inp.max, val = +inp.value;
      return { markX: tr ? tr.left + tr.width / 2 : NaN, thumbX: ir.left + thumb / 2 + ((val - lo) / (hi - lo)) * (ir.width - thumb), y: ir.top + ir.height / 2, lo, hi, step: +inp.step, ppu: (ir.width - thumb) / (hi - lo), val };
    };
  }, process.env.SIM_FILTER || "");
  const n = await p.evaluate(() => SIMS.length);
  const bad = [];
  // Ročica pod oznako: izračunana lega in klik na tirnico pod oznako (drsnik skoči na isto vrednost).
  const axisCheck = async (keys) => {
    const out = [];
    for (const key of keys) {
      const r0 = await p.evaluate((k) => axisProbe(k), key);
      const mid = r0.lo + Math.round((r0.hi - r0.lo) / 2 / r0.step) * r0.step;
      for (const v of [r0.lo, mid, r0.hi]) {
        const r = await p.evaluate(([k, v]) => axisProbe(k, v), [key, v]);
        if (!(Math.abs(r.thumbX - r.markX) <= 2)) out.push(`${key} = ${r.val}: ročica ${r.thumbX.toFixed(1)} px, oznaka ${r.markX.toFixed(1)} px`);
        await p.evaluate(([k, v]) => axisProbe(k, v), [key, v < mid ? r0.hi : r0.lo]);
        await p.mouse.click(r.markX, r.y);
        const c = await p.evaluate((k) => axisProbe(k), key);
        if (Math.abs(c.val - r.val) * r.ppu > 2 + (r.step * r.ppu) / 2) out.push(`${key}: klik pod oznako ${r.val} da ${c.val}`);
      }
    }
    return out;
  };
  const aligned = [];
  for (let i = 0; i < n; i++) {
    const sim = await p.evaluate((i) => SIMS[i], i);
    cur = `${sim.id} (${sim.topic})`;
    const r = await p.evaluate((i) => mountOne(i), i);
    const issues = [];
    if (r.overflow) issues.push(`širša od zaslona za ${r.overflow} px`);
    if (!r.tryText) issues.push("brez »Poskusi«");
    if (!r.reset) issues.push("brez »Ponastavi«");
    if (r.unlabeled) issues.push(`${r.unlabeled} kontrol brez oznake`);
    if (r.dragNoKey) issues.push(`${r.dragNoKey} vlečnih elementov brez tipkovnice`);
    if (r.axis.length) aligned.push([i, r.axis]), issues.push(...(await axisCheck(r.axis)).map((x) => `360 px: ${x}`));
    if (issues.length) bad.push(`${cur}: ${issues.join("; ")}`);
  }
  await p.setViewportSize({ width: 1280, height: 800 });
  for (const [i, keys] of aligned) {
    const sim = await p.evaluate((i) => SIMS[i], i);
    cur = `${sim.id} (${sim.topic})`;
    await p.evaluate((i) => mountOne(i), i);
    const issues = (await axisCheck(keys)).map((x) => `1280 px: ${x}`);
    if (issues.length) bad.push(`${cur}: ${issues.join("; ")}`);
  }
  await b.close();
  srv.kill();
  bad.forEach((x) => console.log(x));
  errs.forEach((x) => console.log("NAPAKA " + x));
  console.log(`Simulacij: ${n}, z drsnikom ob osi: ${aligned.length}, s pomanjkljivostmi: ${bad.length}, napak v konzoli: ${errs.length}`);
  process.exit(bad.length || errs.length ? 1 : 0);
})();
