// Formule, ki se pomikajo vstran (j 2026-11-04: »Predolge zapise ustrezno prelomi v drugo vrstico. Če je mogoče,
// ne uporabljaj scrollanja. To naj velja za vse enačbe«). Vsako simulacijo iz kataloga odpre na telefonski širini
// (privzeto 360 px) z vklopljenim public/sirina.js (initSirina), enkrat v začetnem stanju in enkrat z vsemi drsniki
// na največji vrednosti, ter izpiše okvirje s formulo, ki so še vedno preširoki (po zlaganju in pomanjšanju na 80 %).
// Nato preveri še odgovor inštruktorja, nalogo in namig z dolgo enačbo. Lekcije preverja scripts/preveri-videz-lekcij.cjs.
//
// Zagon: node scripts/preveri-formule.cjs [--sirina 360] [--vejice] [--dovoli N]
//   --vejice  izpiše še vse zapise števil z vejico v formulah simulacij (pregled decVejica v sim/kit.js)
//   --dovoli  koliko simulacij s pomikajočo se formulo še dovolimo (privzeto ZNANE spodaj)
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : d;
};
const W = Number(arg("--sirina", 360));
const VEJICE = process.argv.includes("--vejice");
// Prosta vrata in začasna baza (kot preveri-videz-lekcij.cjs): drug strežnik na istih vratah bi dal tuje rezultate.
const freePort = () => new Promise((res, rej) => {
  const s = net.createServer();
  s.listen(0, () => { const { port } = s.address(); s.close(() => res(port)); });
  s.on("error", rej);
});
// Simulacije s formulo, ki je ni kje prelomiti (en sam nedeljiv člen), smejo ostati drsne; vsaka nova je napaka.
const ZNANE = Number(arg("--dovoli", 0));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const root = path.join(__dirname, "..");
  const PORT = String(await freePort());
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-formule-"));
  const env = { ...process.env, PORT, EVKLID_MOCK: "1", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", ANTHROPIC_API_KEY: "", RESEND_API_KEY: "", STRIPE_SECRET_KEY: "" };
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: root, env, stdio: "ignore" });
  const base = `http://localhost:${PORT}`;
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(base + "/style.css")).ok) break; } catch {}
    await wait(200);
  }
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: 740 }, hasTouch: true });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
  await p.goto(base + "/zasebnost.html");
  await p.evaluate(async (VEJICE) => {
    document.head.innerHTML = '<meta name="viewport" content="width=device-width,initial-scale=1">' + ["vendor/katex/katex.min.css", "style.css", "ui.css", "textbook.css", "drsniki.css"].map((h) => `<link rel="stylesheet" href="/${h}">`).join("");
    document.body.innerHTML = '<div class="textbook"><div class="tb-section" id="box" style="padding:16px 28px"></div></div><div id="drugo"></div>';
    for (const src of ["/vendor/katex/katex.min.js", "/vendor/marked/lib/marked.umd.js", "/vendor/dompurify/purify.min.js"])
      await new Promise((r) => { const sc = document.createElement("script"); sc.src = src; sc.onload = sc.onerror = r; document.head.append(sc); });
    await document.fonts.ready;
    window.VEJ = new Map();
    if (VEJICE) {
      const orig = katex.renderToString;
      katex.renderToString = (t, o) => {
        for (const m of String(t).matchAll(/.{0,14}\d(?:\{,\}|,)\d.{0,10}/g)) VEJ.set(m[0], (VEJ.get(m[0]) || 0) + 1);
        return orig.call(katex, t, o);
      };
    }
    const { initSirina } = await import("/sirina.js");
    initSirina();
    const { mountSim } = await import("/sim/index.js");
    const { SIM_TOPICS } = await import("/sim/katalog.js");
    const seen = new Set();
    window.SIMS = [];
    for (const [topic, v] of Object.entries(SIM_TOPICS)) for (const [id, , opts] of Array.isArray(v[0]) ? v : [v]) {
      const k = id + JSON.stringify(opts || {});
      if (!seen.has(k)) seen.add(k), SIMS.push({ topic, id, opts: opts || {} });
    }
    const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    // Okvirji s formulo, ki se pomikajo, in formule sredi besedila, ki gledajo čez rob.
    window.drsne = (m) => {
      const out = [];
      for (const el of m.querySelectorAll(".demo-eq, .graf-eq, .formula-body, .fm-f, .katex-display, .katex")) {
        if (el.closest("svg")) continue;
        const over = el.scrollWidth - el.clientWidth, r = el.getBoundingClientRect();
        const outside = r.right - (innerWidth - 16);
        const okvir = el.matches(".demo-eq, .graf-eq, .formula-body, .fm-f, .katex-display");
        if ((okvir && over > 1 && !el.parentElement.closest(".katex-display")) || (!okvir && !el.closest(".demo-eq, .graf-eq, .formula-body, .fm-f, .katex-display") && (outside > 1 || el.classList.contains("tb-dolga"))))
          out.push({ cls: el.className.split(" ")[0], over: Math.round(Math.max(over, outside)), tex: (el.querySelector("annotation")?.textContent || el.textContent).slice(0, 100) });
      }
      return out;
    };
    window.mountOne = async (i) => {
      const box = document.getElementById("box");
      box.innerHTML = "";
      const m = document.createElement("div");
      box.append(m);
      await mountSim(SIMS[i].id, m, SIMS[i].opts);
      await frames();
      const out = drsne(m);
      // Vsi drsniki na največjo vrednost (dolga števila), kot bi jih učenec povlekel.
      for (const inp of m.querySelectorAll('input[type="range"]')) {
        inp.value = inp.max;
        inp.dispatchEvent(new Event("input", { bubbles: true }));
      }
      await frames();
      for (const x of drsne(m)) if (!out.some((y) => y.tex === x.tex)) out.push({ ...x, max: true });
      return out;
    };
  }, VEJICE);
  const n = await p.evaluate(() => SIMS.length);
  const slabe = [];
  for (let i = 0; i < n; i++) {
    const sim = await p.evaluate((i) => SIMS[i], i);
    const r = await p.evaluate((i) => mountOne(i), i).catch((e) => [{ cls: "NAPAKA", over: 0, tex: String(e).slice(0, 100) }]);
    if (r.length) slabe.push(`${sim.id} ${JSON.stringify(sim.opts)} (${sim.topic}):\n${r.slice(0, 4).map((x) => `   ${x.cls}${x.max ? " (drsniki na max)" : ""} +${x.over} px  ${x.tex}`).join("\n")}`);
  }
  // Inštruktor, naloga, namig in kartica: dolge enačbe skozi renderRich (rich.js), kot v aplikaciji.
  const drugo = await p.evaluate(async () => {
    const { createRenderer } = await import("/rich.js");
    const { renderRich } = createRenderer({});
    const dolga = "$$n(\\mathrm{MgO}) = \\frac{m(\\mathrm{Mg})}{M(\\mathrm{Mg})} = \\frac{1{,}00\\ \\text{g}}{24{,}31\\ \\text{g/mol}} = 0{,}0411\\ \\text{mol} \\Rightarrow m(\\mathrm{MgO}) = n M = 0{,}0411\\ \\text{mol} \\cdot 40{,}30\\ \\text{g/mol} = 1{,}66\\ \\text{g}$$";
    const vsota = "$$S = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14 + 15 + 16 + 17 + 18 + 19 + 20 = 210$$";
    const el = document.getElementById("drugo");
    el.innerHTML = `<div class="messages" style="padding:12px"><div class="msg assistant"><div class="bubble">${renderRich(`Najprej množina:\n\n${dolga}\n\nŠe vsota:\n\n${vsota}`)}</div></div></div>
      <div class="task" style="padding:16px"><div class="task-text">${renderRich(`Izračunaj maso. ${dolga}`)}</div>
      <div class="formula-body">${["v = \\frac{s}{t} = \\frac{120\\ \\text{km} + 45\\ \\text{km} + 30\\ \\text{km}}{2{,}5\\ \\text{h} + 0{,}75\\ \\text{h}} = 60\\ \\text{km/h}"].map((f) => `<div>${katex.renderToString(f)}</div>`).join("")}</div></div>
      <div class="fc-card" style="padding:18px"><div class="fc-backside">${renderRich(dolga)}</div></div>`;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    return drsne(el);
  });
  const vej = VEJICE ? await p.evaluate(() => [...VEJ.entries()].sort((a, b) => b[1] - a[1])) : [];
  await b.close();
  srv.kill();
  fs.rmSync(dir, { recursive: true, force: true });
  slabe.forEach((x) => console.log(x));
  if (drugo.length) console.log(`Klepet, naloga, namig, kartica:\n${drugo.map((x) => `   ${x.cls} +${x.over} px  ${x.tex}`).join("\n")}`);
  if (VEJICE) console.log(`Števila z vejico v formulah (${vej.length}):\n${vej.map(([t, c]) => `   ${c}× ${t}`).join("\n")}`);
  errs.forEach((x) => console.log("NAPAKA " + x));
  console.log(`Simulacij: ${n} pri ${W} px, s pomikajočo se formulo: ${slabe.length} (dovoljeno ${ZNANE}); drugje: ${drugo.length}; napak: ${errs.length}`);
  process.exit(slabe.length > ZNANE || drugo.length || errs.length ? 1 : 0);
})();
