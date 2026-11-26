// Vmesnik priprave na test v pravem brskalniku (docs/priprava.md, PR 7), na istih 8 napravah kot
// scripts/posnetki-naprave.cjs. Za vsako napravo nov profil (SŠ, 4. letnik, MAT) na svojem preizkusnem strežniku
// (začasna baza, preizkusni način brez pravih klicev AI, začasni ključ za šifriranje) prehodi pot od zapiskov do prvega
// kviza: korak 1 (sklop Integral, datum čez 7 dni), korak 2 (prilepljeni zapiski test/fixtures/priprava/mat-integrali.md),
// korak 3 (teme), prvi kviz (prva naloga na zaslonu), nato »Danes«, »Moji zapiski« in tema z razlago.
//
// Merila (j, 25. 11. 2026): (1) od zapiskov do prvega kviza največ 3 minute: čas od klika »Prilepi besedilo« do prve
// naloge kviza na zaslonu (s strežnikom in brskalnikom, ne s tipkanjem učenca) in število dejanj; (2) 0 uganjenih znakov:
// besedilo izseka iz zapiskov na zaslonu je enako izvirniku, oznaka [?] ostane; (3) posnetki na 8 napravah brez napak:
// brez napak strani in konzole, brez odgovorov ≥ 400 (razen pričakovanih), brez vodoravnega drsenja, brez neprevedenih
// ključev (»pr.«).
//
// Zagon: node scripts/preveri-pripravo.cjs [--posnetki <mapa>] [--naprave tel-390,pc-1440] [--tema temna]
// Izhod 1, če je kaj narobe; povzetek v <mapa>/rezultat.json.
const { spawn } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const net = require("node:net");
const path = require("node:path");
const playwright = require("playwright");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2);
const arg = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);
const MAPA = arg("--posnetki");
const TEMA = arg("--tema") || "svetla";
// Iste naprave kot scripts/posnetki-naprave.cjs (pokončno; tablica tudi ležeče).
const NAPRAVE = [
  { ime: "tel-360", w: 360, h: 740, dotik: true, mobilno: true },
  { ime: "tel-390", w: 390, h: 844, dotik: true, mobilno: true },
  { ime: "tel-430", w: 430, h: 932, dotik: true, mobilno: true },
  { ime: "ipad-820", w: 820, h: 1180, dotik: true, mobilno: false },
  { ime: "ipad-1024-lezece", w: 1366, h: 1024, dotik: true, mobilno: false },
  { ime: "pc-1280", w: 1280, h: 800, dotik: false, mobilno: false },
  { ime: "pc-1440", w: 1440, h: 900, dotik: false, mobilno: false },
  { ime: "pc-1920", w: 1920, h: 1080, dotik: false, mobilno: false },
];
const izbor = arg("--naprave")?.split(",");
const ZAPISKI = fs.readFileSync(path.join(ROOT, "test/fixtures/priprava/mat-integrali.md"), "utf8");
const MEJA_MS = 3 * 60 * 1000;

const prostVrata = () =>
  new Promise((ok, no) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => ok(port));
    });
    s.on("error", no);
  });

async function streznik() {
  const port = await prostVrata();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-priprava-"));
  const env = {
    ...process.env,
    PORT: String(port),
    EVKLID_MOCK: "1",
    EVKLID_MOCK_DELAY_MS: "0",
    EVKLID_NEWS: "0",
    EVKLID_DB: path.join(dir, "t.db"),
    EVKLID_PASSWORD: "",
    EVKLID_DATA_KEY: crypto.randomBytes(32).toString("base64"),
    ANTHROPIC_API_KEY: "",
    RESEND_API_KEY: "",
    STRIPE_SECRET_KEY: "",
  };
  const log = [];
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] });
  srv.stdout.on("data", (d) => log.push(String(d)));
  srv.stderr.on("data", (d) => log.push(String(d)));
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 150; i++) {
    try {
      if ((await fetch(base + "/healthz")).ok) return { base, srv, dir, log };
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  srv.kill();
  throw new Error(`strežnik se ni zagnal:\n${log.join("")}`);
}

// Odgovor naloge iz baze preizkusnega strežnika (tasks.payload.answer): pravilen ali očitno napačen.
function odgovor(dbPath, id, prav) {
  const db = new (require("node:sqlite").DatabaseSync)(dbPath, { readOnly: true });
  try {
    const a = JSON.parse(db.prepare("SELECT payload FROM tasks WHERE id = ?").get(Number(id))?.payload || "{}").answer || {};
    if (a.type === "choice") return String(prav ? a.index : a.index === 0 ? 1 : 0);
    if (a.type === "number") {
      if (!prav) return "123456";
      const d = Number.isInteger(a.decimals) ? a.decimals : null;
      const v = d === null ? String(a.value) : (Math.sign(a.value) * Math.round(Math.abs(a.value) * 10 ** d + 1e-9) / 10 ** d).toFixed(d);
      return v.replace(".", ",") + (a.unit ? ` ${a.unit}` : "");
    }
    if (a.type === "fraction") return prav ? `${a.num}/${a.den}` : "1234/7";
    if (a.type === "coefficients") return prav ? a.values.join(", ") : a.values.map((v) => v + 1).join(", ");
    return "0";
  } finally {
    db.close();
  }
}

const danPlus = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

async function naprava(brskalnik, n) {
  const s = await streznik();
  const tezave = [];
  const dejanja = [];
  const ucenec = await (
    await fetch(`${s.base}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Eva", settings: { curriculum_level: "4. letnik", educational_track: "SREDNJA_SOLA", subject: "MAT", first_task: 1 } }),
    })
  ).json();
  const ctx = await brskalnik.newContext({
    viewport: { width: n.w, height: n.h },
    hasTouch: n.dotik,
    isMobile: n.mobilno,
    deviceScaleFactor: 1,
    colorScheme: TEMA === "temna" ? "dark" : "light",
    locale: "sl-SI",
  });
  await ctx.addInitScript((id) => {
    try {
      localStorage.setItem("studentId", String(id));
    } catch {}
  }, ucenec.id);
  const p = await ctx.newPage();
  p.on("pageerror", (e) => tezave.push(`napaka strani: ${e.message}`));
  p.on("console", (m) => m.type() === "error" && !/favicon|Failed to load resource/.test(m.text()) && tezave.push(`konzola: ${m.text()}`));
  // Pričakovano: razlaga teme še ne obstaja (404), preizkusni način brez modela.
  p.on("response", (r) => {
    const u = r.url();
    if (r.status() >= 400 && !/\/razlaga\?tema_id=/.test(u) && !/\/razlaga$/.test(u)) tezave.push(`odgovor ${r.status()}: ${u.replace(s.base, "")}`);
  });
  const posnetek = async (ime) => {
    const siroko = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (siroko > 1) tezave.push(`${ime}: vodoravno drsenje (${siroko} px)`);
    const kljuci = await p.evaluate(() => (document.querySelector("#topic-content")?.innerText.match(/\bpr\.[a-zA-Z.]+/g) || []).slice(0, 5));
    if (kljuci.length) tezave.push(`${ime}: neprevedeni ključi ${kljuci.join(", ")}`);
    if (MAPA) await p.screenshot({ path: path.join(MAPA, `${n.ime}-${TEMA}-${ime}.png`), fullPage: false });
  };
  const klik = async (sel, opis) => {
    dejanja.push(opis);
    await p.locator(sel).first().click();
  };
  // Gumb »Priprava na test« v vrstici načinov; poslušalci pridejo z app.js, zato ponovi, dokler se zaslon ne odpre.
  const odpri = async (sel) => {
    for (let i = 0; i < 20; i++) {
      await p.evaluate(() => document.querySelector('#modebar [data-mode="test"]')?.click());
      try {
        await p.locator(sel).first().waitFor({ timeout: 1500 });
        return;
      } catch {}
    }
    throw new Error(`zaslon ${sel} se ni odprl`);
  };
  const izid = { naprava: n.ime, w: n.w, h: n.h };
  try {
    await p.goto(s.base, { waitUntil: "domcontentloaded" });
    await p.waitForFunction(() => !!document.querySelector('#modebar [data-mode="test"]'), null, { timeout: 20000 });
    await odpri("#pr-test");
    // Korak 1: sklop Integral, datum.
    await p.locator('#pr-test input[name="unit"][value="2"]').check();
    await p.locator("#pr-datum").fill(danPlus(7));
    await posnetek("1-test");
    await klik('#pr-test button[type="submit"]', "korak 1: naprej");
    // Korak 2: prilepljeni zapiski.
    await p.locator("[data-pr-prilepi]").waitFor({ timeout: 15000 });
    const t0 = Date.now();
    await klik("[data-pr-prilepi]", "prilepi besedilo");
    await p.locator("[data-pr-prilepi-obrazec] textarea").fill(ZAPISKI);
    await klik("[data-pr-prilepi-obrazec] button", "dodaj besedilo");
    await p.locator(".pr-vir .pr-stanje.ok").first().waitFor({ timeout: 30000 });
    await posnetek("2-zapiski");
    await klik("[data-pr-naprej]", "naprej: teme");
    // Korak 3: teme.
    await p.locator("[data-pr-kviz]").waitFor({ timeout: 30000 });
    const teme = await p.locator(".pr-tema").count();
    if (!teme) tezave.push("korak 3: ni tem");
    await posnetek("3-teme");
    await klik("[data-pr-kviz]", "začni prvi kviz");
    await p.locator("#practice .task").first().waitFor({ timeout: 30000 });
    izid.doKvizaMs = Date.now() - t0;
    izid.dejanj = dejanja.length - 1; // brez koraka 1
    if (izid.doKvizaMs > MEJA_MS) tezave.push(`od zapiskov do kviza ${izid.doKvizaMs} ms (meja ${MEJA_MS})`);
    await posnetek("4-kviz");
    // Kviz do konca: prve štiri naloge prav, druge narobe (mešan izid po temah); konec kviza s povzetkom in načrtom.
    const resitve = [];
    const naloge = [];
    let zadnja = null;
    // Klik v kvizu: če okno nove ravni (pride z zamikom) prekrije gumb, ga učenec zapre in klikne znova.
    const klikKviz = async (loc) => {
      for (let k = 0; k < 3; k++) {
        try {
          return await loc.click({ timeout: 4000 });
        } catch (e) {
          if (!(await p.locator(".xp-cele button").isVisible())) throw e;
          await p.locator(".xp-cele button").click();
          dejanja.push("zapri okno nove ravni");
          await p.waitForTimeout(150);
        }
      }
      return loc.click({ timeout: 10000 });
    };
    for (let i = 0; i < 60 && !(await p.locator(".pr-konec").count()); i++) {
      // Okno nove ravni (xp-fx.js) zapre učenec z gumbom »Nadaljuj«.
      if (await p.locator(".xp-cele button").isVisible()) {
        await p.locator(".xp-cele button").click();
        dejanja.push("zapri okno nove ravni");
        await p.waitForTimeout(150);
        continue;
      }
      if (await p.locator("#fb-next").isVisible()) {
        await klikKviz(p.locator("#fb-next"));
        await p.waitForTimeout(150);
        continue;
      }
      const ponovno = await p.locator("#fb-retry").isVisible();
      if (ponovno) {
        await klikKviz(p.locator("#fb-retry"));
        await p.waitForTimeout(150);
      }
      const id = await p.locator("#practice .card.task[data-task-id]").first().getAttribute("data-task-id").catch(() => null);
      // Brez naloge ali naloga je že oddana in čaka na odziv: počakaj.
      if (!id || (id === zadnja && !ponovno)) {
        await p.waitForTimeout(200);
        continue;
      }
      if (!naloge.includes(id)) naloge.push(id);
      const prav = naloge.indexOf(id) < 4;
      const odg = odgovor(path.join(s.dir, "t.db"), id, prav);
      const izbira = p.locator("#practice .task .choices .choice");
      try {
        if (await izbira.count()) await klikKviz(izbira.nth(Number(odg) || 0));
        else {
          await p.fill("#answer", odg, { timeout: 10000 });
          await klikKviz(p.locator("#practice .answer-row button.primary"));
        }
      } catch (e) {
        throw new Error(`kviz, naloga ${id} (${naloge.length}. naloga): ${e.message.split("\n")[0]}`);
      }
      zadnja = id;
      await p.locator("#feedback .fb:not(.info)").first().waitFor({ timeout: 10000 }).catch(() => {});
      resitve.push({ id, prav, odg, ok: (await p.locator("#feedback .fb.ok").count()) > 0, fb: ((await p.locator("#feedback").innerText().catch(() => "")) || "").slice(0, 80) });
    }
    if (process.env.RAZHROSCI) console.log(JSON.stringify(resitve));
    await p.locator(".pr-konec [data-pr-nacrt-po] .pr-nacrt-kartica").waitFor({ timeout: 15000 });
    await p.locator(".pr-konec").scrollIntoViewIfNeeded();
    // Povzetek kviza mora ustrezati oddanim odgovorom: pravilno v prvem poskusu / vseh nalog.
    const prvic = naloge.filter((id) => resitve.find((r) => r.id === id)?.ok).length;
    const povz = (await p.locator(".pr-konec").innerText()).match(/(\d+) od (\d+) pravilno/);
    if (!povz || +povz[1] !== prvic || +povz[2] !== naloge.length) tezave.push(`povzetek kviza ${povz?.[0] ?? "?"}, oddano ${prvic} od ${naloge.length}`);
    else dejanja.push(`povzetek kviza ${prvic} od ${naloge.length}`);
    await posnetek("4b-konec-kviza");
    // Danes.
    await odpri(".pr-mreza");
    await posnetek("5-danes");
    // Moji zapiski: [?] ostane, besedilo izseka enako izvirniku (preveri ga strežnik spodaj).
    await klik("[data-pr-zapiski]", "moji zapiski");
    await p.locator(".pr-vir").first().waitFor({ timeout: 15000 });
    await posnetek("6-zapiski");
    await klik("[data-pr-nazaj]", "nazaj");
    await p.locator(".pr-mreza").waitFor({ timeout: 20000 });
    // Tema iz obsega z izseki (razlaga se v preizkusnem načinu ne pripravi: pokaže se gumb).
    await klik("[data-pr-tema-odpri]", "tema");
    await p.locator(".pr-tema-mreza").waitFor({ timeout: 20000 });
    await posnetek("7-tema");
    // 0 uganjenih znakov: vsak izsek, ki ga strežnik vrne, je podniz prilepljenega besedila (brez presledkov na robu),
    // nobena oznaka [?] ne izgine.
    const iz = await p.evaluate(async () => {
      const id = localStorage.getItem("studentId");
      const pr = await (await fetch(`/api/students/${id}/priprave`)).json();
      const pid = pr.priprave.find((x) => x.aktivna).id;
      return (await (await fetch(`/api/students/${id}/priprave/${pid}/izseki`)).json()).izseki.map((x) => x.besedilo);
    });
    // Uvoz sme samo dodati oznako [?] ob dvoumnem zapisu (x2 je lahko x², 2x ali x₂), nikoli spremeniti znaka.
    const brezOznak = (x) => x.replace(/\s*\[\?\]/g, "").replace(/\s+/g, " ").trim();
    const izvirnik = brezOznak(ZAPISKI);
    const tuji = iz.filter((b) => !izvirnik.includes(brezOznak(b)));
    izid.izsekov = iz.length;
    izid.uganjenih = tuji.length;
    if (tuji.length) tezave.push(`izseki s spremenjenimi znaki: ${tuji.length}`);
    const neg = (ZAPISKI.match(/\[\?\]/g) || []).length;
    const negIz = iz.join("\n").match(/\[\?\]/g)?.length || 0;
    izid.dodanihOznak = negIz - neg;
    if (negIz < neg) tezave.push(`[?] izgubljen: v izvirniku ${neg}, v izsekih ${negIz}`);
    // Na zaslonu »Moji zapiski« in v izseku teme: oznaka [?] je vidna (mark.pr-neg), ko jo izsek ima.
  } catch (e) {
    tezave.push(`tok se je ustavil: ${e.message.split("\n")[0]}${process.env.RAZHROSCI ? `\n${e.stack}` : ""}`);
    try {
      await posnetek("napaka");
    } catch {}
  }
  izid.tezave = tezave;
  izid.dejanja = dejanja;
  await ctx.close();
  s.srv.kill();
  fs.rmSync(s.dir, { recursive: true, force: true });
  return izid;
}

(async () => {
  if (MAPA) fs.mkdirSync(MAPA, { recursive: true });
  const brskalnik = await playwright.chromium.launch();
  const izidi = [];
  for (const n of NAPRAVE) {
    if (izbor && !izbor.includes(n.ime)) continue;
    const r = await naprava(brskalnik, n);
    izidi.push(r);
    console.log(`${r.tezave.length ? "✗" : "✓"} ${n.ime}: do kviza ${r.doKvizaMs ?? "?"} ms, ${r.dejanj ?? "?"} dejanj, izsekov ${r.izsekov ?? "?"}, spremenjenih ${r.uganjenih ?? "?"}, dodanih [?] ${r.dodanihOznak ?? "?"}`);
    for (const x of r.tezave) console.log(`   ${x}`);
  }
  await brskalnik.close();
  if (MAPA) fs.writeFileSync(path.join(MAPA, "rezultat.json"), JSON.stringify({ tema: TEMA, izidi }, null, 2));
  process.exit(izidi.some((r) => r.tezave.length) ? 1 : 0);
})();
