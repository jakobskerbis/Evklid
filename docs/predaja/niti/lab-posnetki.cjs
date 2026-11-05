const { spawn } = require("node:child_process");
const { chromium } = require("playwright");
const PORT = 4318, root = "/home/user/wt-opt", OUT = process.argv[2] || "/tmp/claude-0/-home-user-stemmind/99b3a969-1c9a-5156-afe8-d09c8f9bf24b/scratchpad/optika/"; // brand:legacy
const only = process.argv[3] ? process.argv[3].split(",") : null;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: root, env: { ...process.env, PORT, EVKLID_MOCK: "1" }, stdio: "ignore" });
  const base = `http://localhost:${PORT}`;
  for (let i = 0; i < 50; i++) { try { if ((await fetch(base + "/style.css")).ok) break; } catch {} await wait(200); }
  const b = await chromium.launch();
  async function mount(id, { dark = false, width = 360 } = {}) {
    const p = await b.newPage({ viewport: { width, height: 740 }, hasTouch: width < 600, locale: "sl-SI" });
    const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    await p.goto(base + "/zasebnost.html");
    await p.evaluate(async ({ id, dark }) => {
      try { localStorage.setItem("evklid.lang", "sl"); } catch {}
      document.head.innerHTML = '<meta name="viewport" content="width=device-width,initial-scale=1">' + ["vendor/katex/katex.min.css", "style.css", "ui.css", "textbook.css"].map((h) => `<link rel="stylesheet" href="/${h}">`).join("");
      if (dark) document.documentElement.classList.add("dark");
      document.body.innerHTML = '<div id="box" class="lab-view" style="padding:16px"></div>';
      const { mountSim } = await import("/sim/index.js");
      const m = document.createElement("div"); document.getElementById("box").append(m);
      await mountSim(id, m, {});
    }, { id, dark });
    await wait(400);
    p.errs = errs;
    return p;
  }
  const check = async (p, name) => {
    const r = await p.evaluate(() => ({
      overflow: Math.max(document.documentElement.scrollWidth - innerWidth, 0),
      small: [...document.querySelectorAll("#box button, #box select, #box input[type=checkbox]")].filter((e) => e.offsetParent).map((e) => { const el = e.type === "checkbox" ? e.closest("label") || e : e; const r = el.getBoundingClientRect(); return r.height < 44 ? `${(el.textContent || el.ariaLabel || el.tagName).trim().slice(0, 30)}:${Math.round(r.height)}` : null; }).filter(Boolean),
      wideTables: [...document.querySelectorAll("#box table")].map((t) => t.scrollWidth - t.parentElement.clientWidth).filter((x) => x > 0),
    }));
    console.log(name, JSON.stringify(r), p.errs.length ? "ERR " + p.errs.join(" | ") : "");
  };
  const btn = (p, n) => p.getByRole("button", { name: n, exact: true }).first().click();
  const shot = async (p, f) => { await p.evaluate(() => scrollTo(0, 0)); await (await import("node:timers/promises")).setTimeout(300); await p.screenshot({ path: OUT + f + ".png", fullPage: true }); };
  const sel = (p, i, v) => p.locator("select").nth(i).selectOption(v);
  const goggles = (p) => p.getByText("zaščitna očala", { exact: true }).click();
  const setSlider = (p, name, v) => p.getByRole("slider", { name, exact: true }).first().evaluate((e, v) => { e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); }, v);
  const jobs = {
    async lom(width = 360, file = "lom-telefon", dark = false) {
      const p = await mount("lab-lom", { width, dark });
      await p.getByText("laser vklopljen", { exact: true }).click();
      for (const a of [10, 20, 30, 40, 50, 60]) { await setSlider(p, "vpadni kot α (zasuk diska)", a); await btn(p, "Zapiši meritev"); }
      await p.getByRole("radio", { name: "iz snovi v zrak" }).click();
      for (const a of [20, 35, 50]) { await setSlider(p, "vpadni kot α (zasuk diska)", a); await btn(p, "Zapiši meritev"); }
      await setSlider(p, "vpadni kot α (zasuk diska)", 30);
      await check(p, file); await shot(p, file); await p.close();
    },
    async leca(width = 360, file = "leca-telefon", dark = false) {
      const p = await mount("lab-leca", { width, dark });
      for (const [L, Z] of [[200, 0], [250, 0], [300, 0], [350, 0]]) {
        await setSlider(p, "leča", L);
        // poišči ostro sliko: zaslon po mm
        const ok = await p.evaluate(() => 0);
        let best = null;
        for (let z = L + 60; z <= 1000; z += 2) { await setSlider(p, "zaslon", z); const t = await p.locator("svg.lab-opt-klop").getAttribute("aria-label"); if (t.includes("ostra") && !t.includes("zamegljena")) { best = z; break; } }
        if (best) await btn(p, "Zapiši meritev");
      }
      await setSlider(p, "leča", 120); await setSlider(p, "zaslon", 600); await btn(p, "Poglej skozi lečo");
      await check(p, file); await shot(p, file); await p.close();
    },
    async pc() { await jobs.lom(1280, "optika-racunalnik"); },
    async temno() { await jobs.leca(360, "leca-temno", true); },
    async temnolom() { await jobs.lom(360, "lom-temno", true); },
  };
  for (const [k, f] of Object.entries(jobs)) if (!only || only.includes(k)) await f().catch((e) => console.log(k, "FAIL", e.message.slice(0, 200)));
  await b.close(); srv.kill();
})();
