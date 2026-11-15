// Gumbi na dotik v Safariju po vsej aplikaciji (razlaga v scripts/gumbi-na-dotik.cjs): zažene strežnik, naredi
// profil in na tablici (1024×1366, dotik) in računalniku obišče zavihke, lekcije s poskusi, laboratorij, igre in
// 3D modele. Na vsakem zaslonu nekaj časa ne naredi nič in šteje klikljive elemente, ki se pojavijo sami od sebe.
// Zagon: node scripts/gumbi-na-dotik-aplikacija.cjs   (izhod 1, če jih najde)
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const net = require("node:net");
const path = require("node:path");
const { chromium } = require("playwright");
const { OPAZUJ, ponavlja } = require("./gumbi-na-dotik.cjs");

const ROOT = path.join(__dirname, "..");
const MIR = 1500;

const prostVrata = () =>
  new Promise((ok, no) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => ok(port));
    });
    s.on("error", no);
  });

async function zazeni() {
  const port = await prostVrata();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-dotik-"));
  const env = { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_MOCK_DELAY_MS: "0", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", ANTHROPIC_API_KEY: "", RESEND_API_KEY: "", STRIPE_SECRET_KEY: "" };
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: ROOT, env, stdio: "ignore" });
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 150; i++) {
    try {
      if ((await fetch(base + "/healthz")).ok) return { base, ustavi: () => (srv.kill(), fs.rmSync(dir, { recursive: true, force: true })) };
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  srv.kill();
  throw new Error("strežnik se ni zagnal");
}

async function profil(p, raven) {
  await p.waitForSelector("#onboard-form", { timeout: 15000 });
  await p.fill('#onboard-form input[name="name"]', "Ana");
  for (const v of raven) await p.click(`#onboard-form .lp-opt[data-val="${v}"]`);
  await p.click('#onboard-form button[type="submit"]');
  await p.waitForSelector(".iq-wrap [data-iq=skip]", { timeout: 10000 });
  await p.click(".iq-wrap [data-iq=skip]");
  await p.waitForTimeout(800);
  if (await p.locator("#tour").isVisible()) await p.click('#tour [data-tour="skip"]');
  await p.waitForTimeout(300);
}

async function stej(p) {
  await p.evaluate(() => ((window.__najdbe = []), (window.__stej = true)));
  await p.waitForTimeout(MIR);
  const n = ponavlja(await p.evaluate(() => ((window.__stej = false), window.__najdbe)));
  return n.length ? [...new Set(n)].slice(0, 4).concat(`${n.length}×`) : [];
}

async function main() {
  const browser = await chromium.launch();
  const strezniki = [];
  const najdbe = [];
  const zapisi = (kje, n) => n.length && najdbe.push(`${kje}: ${n.join(", ")}`);
  try {
    for (const [ime, opts, raven] of [
      ["tablica", { viewport: { width: 1024, height: 1366 }, hasTouch: true, isMobile: true }, ["OSNOVNA_SOLA", "8. razred"]],
      ["telefon", { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }, ["SREDNJA_SOLA", "2. letnik", "VR"]],
      ["racunalnik", { viewport: { width: 1280, height: 800 } }, ["OSNOVNA_SOLA", "9. razred"]],
    ]) {
      // Vsaka naprava svoj strežnik: profili brez računov so skupni, drugi obisk bi videl izbiro profila.
      const { base, ustavi } = await zazeni();
      strezniki.push(ustavi);
      const ctx = await browser.newContext({ ...opts, locale: "sl-SI", reducedMotion: "no-preference", serviceWorkers: "block" });
      await ctx.addInitScript(OPAZUJ);
      const p = await ctx.newPage();
      await p.goto(base);
      await profil(p, raven).catch((e) => najdbe.push(`${ime}: profil – ${e.message.split("\n")[0]}`));
      for (const v of ["path", "chat", "graph", "competition", "games", "schedule", "corner", "progress", "settings", "league", "me"]) {
        const ok = await p.evaluate((v) => {
          try {
            window.evklid.showView(v);
            return true;
          } catch {
            return false;
          }
        }, v);
        if (!ok) continue;
        await p.waitForTimeout(700);
        zapisi(`${ime} ${v}`, await stej(p));
      }
      for (const t of ["textbook", "lab", "3d"]) {
        await p.evaluate(() => window.evklid.showView("uci"));
        await p.evaluate((t) => document.querySelector(`[data-uci-tab="${t}"]`)?.click(), t);
        await p.waitForTimeout(900);
        zapisi(`${ime} uci/${t}`, await stej(p));
      }
      // Lekcije s poskusi (tudi tista iz prijave j-ja 15. 11.) in nekaj iz drugih predmetov.
      for (const l of ["KEM-TEK-OS/lastnosti-snovi-in-locevanje-zmesi", "KEM-OS-9/nafta-in-zemeljski-plin", "FIZ-OS-8/enakomerno-gibanje", "FIZ-OS-9/upor-in-ohmov-zakon", "MAT-OS-8/pitagorov-izrek", "BIO-SS-1/celicni-cikel-in-mitoza"]) {
        await p.evaluate((l) => window.evklid.openLesson(l), l);
        await p.waitForTimeout(1500);
        zapisi(`${ime} lekcija ${l}`, await stej(p));
      }
      // Laboratorij: vsak poskus na seznamu odpremo in počakamo.
      await p.evaluate(() => window.evklid.showView("uci"));
      await p.evaluate(() => document.querySelector('[data-uci-tab="lab"]')?.click());
      await p.waitForTimeout(800);
      const nLab = ime === "tablica" ? await p.locator("#view-lab .lab-card").count() : 0;
      for (let i = 0; i < nLab; i++) {
        await p.evaluate(() => window.evklid.showView("uci"));
        await p.evaluate(() => document.querySelector('[data-uci-tab="lab"]')?.click());
        await p.waitForTimeout(300);
        const card = p.locator("#view-lab .lab-card").nth(i);
        const naslov = ((await card.textContent().catch(() => "")) || "").trim().slice(0, 40);
        await card.click({ timeout: 2000 }).catch(() => {});
        await p.waitForTimeout(1200);
        zapisi(`${ime} lab ${naslov}`, await stej(p));
      }
      await ctx.close();
    }
    // 3D: po en ali dva modela z vsakega področja in atlas (mikroskop je med simulacijami).
    const { base, ustavi } = await zazeni();
    strezniki.push(ustavi);
    const ctx = await browser.newContext({ viewport: { width: 1024, height: 1366 }, hasTouch: true, isMobile: true, locale: "sl-SI", reducedMotion: "no-preference", serviceWorkers: "block" });
    await ctx.addInitScript(OPAZUJ);
    const p = await ctx.newPage();
    await p.goto(base + "/3d");
    await p.waitForTimeout(1500);
    zapisi("3d domov", await stej(p));
    const ids = await p.evaluate(async () => {
      const m = await import("/3d/modeli.js");
      const vsi = await m.seznamModelov();
      const po = {};
      for (const x of vsi) (po[x.podrocje] ||= []).length < 2 && po[x.podrocje].push(x.id);
      return Object.values(po).flat();
    });
    for (const id of ["atlas", ...ids]) {
      await p.goto(`${base}/3d#${id}`);
      await p.waitForTimeout(2500);
      zapisi(`3d ${id}`, await stej(p));
    }
    await ctx.close();
  } finally {
    await browser.close();
    strezniki.forEach((u) => u());
  }
  for (const n of najdbe) console.log("✗ " + n);
  console.log(najdbe.length ? `${najdbe.length} zaslonov z gumbi, ki na dotik v Safariju ne bi delali.` : "Nikjer ni klikljivih elementov, ki bi se pojavljali sami od sebe.");
  process.exit(najdbe.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
