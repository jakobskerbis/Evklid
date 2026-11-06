#!/usr/bin/env node
// Menjava stanja z odprtim delom v 3D pregledovalnikih (j, 6. 11.: »Naj se to ne dogaja pri nobenem modelu.«;
// public/3d/isti-del.js, pregledovalnik.js obMenjavi). Pade, ko po izbiri, stikalu, gumbu ali puščici ‹ ›:
//  - okno dela kaže opis, ki ni opis istega dela v novem stanju (npr. »2 atoma Fe« pri ledu),
//  - je okno odprto, a noben del ni izbran (ali obratno), ali poudarek ni na novih mrežah izbranega dela,
//  - se okno zapre brez obvestila ob modelu (»Ta celica nima jedra.«) ali obvestilo prekriva platno,
//  - model po menjavi ni cel v kadru ali okno prekriva platno.
// Kristali: vsak kristal z izbrano »Osnovno celico« na vsakega naslednjega (opis = novi kristal) in vsi deli bcc → led.
// Celice, organi, molekule, telesa, grafi, polja, procesi: prvi del, nato vse izbire (do 4 možnosti), stikala in gumbi.
// Puščici ‹ ›: jedro iz živalske celice v naslednjo celico; jedro v celico brez jedra (eritrocit) → obvestilo.
// Atlas: izbran del ostane ali se kartica zapre ob preklopu Moško/Žensko.
// Uporaba:
//   node scripts/preveri-3d-menjava.cjs                 vse
//   node scripts/preveri-3d-menjava.cjs kristali        le kristali (ali id modela, »puscice«, »atlas«)
//   node scripts/preveri-3d-menjava.cjs --posnetek=pot.png   samo posnetek telefona: bcc + Osnovna celica → Led Ih
//   EVKLID_KOREN=/pot/do/kopije node scripts/...        streže drugo kopijo aplikacije (posnetek »prej«)
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = process.env.EVKLID_KOREN || path.join(__dirname, "..");
let chromium;
try {
  ({ chromium } = require(process.env.PLAYWRIGHT || "/opt/npm-tools/node_modules/playwright"));
} catch {
  ({ chromium } = require("playwright"));
}

const arg = process.argv.slice(2);
const posnetek = arg.find((a) => a.startsWith("--posnetek="))?.slice(11);
const izbrani = arg.filter((a) => !a.startsWith("-"));
const SPLOSNI = ["celica-zivalska", "celica-rastlinska", "celica-bakterija", "organ-srce", "molekule", "atom", "telesa", "graf-ploskev", "elektricno-polje", "mitoza", "soncni-sistem"];
const VSI = ["kristali", ...SPLOSNI, "puscice", "atlas"];
const NALOGE = izbrani.length ? izbrani : VSI;
const NAPRAVE = [
  ["telefon", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
  ["racunalnik", { viewport: { width: 1280, height: 800 } }],
];
const MEJA = 0.01;
const napake = [];
const T = Date.now();
const log = (...a) => console.log(((Date.now() - T) / 1000).toFixed(0).padStart(4), ...a);
const prekriva = (a, b) => a && b && a[0] < b[2] - 1 && a[2] > b[0] + 1 && a[1] < b[3] - 1 && a[3] > b[1] + 1;

// Stanje v strani: izbrani del, okno, obvestilo, poudarek in delež modela izven kadra.
const STANJE = `async () => {
  const host = [...document.querySelectorAll(".k3-pregled")].find((x) => x.k3Pregled);
  const api = host?.k3Pregled;
  if (!api?.model?.group || !api.kit || !host.querySelector("[data-del]")) return { nalaga: true };
  const kam = api.kit.camera;
  kam.updateMatrixWorld();
  const THREE = await import("/vendor/three/build/three.module.js");
  const v = new THREE.Vector3(), mi = new THREE.Matrix4(), mw = new THREE.Matrix4();
  const vidna = (o) => { for (let x = o; x; x = x.parent) if (!x.visible) return false; return true; };
  let n = 0, zunaj = 0;
  api.model.group.updateWorldMatrix(true, true);
  api.model.group.traverse((o) => {
    if (!o.isMesh || o.userData?.k3Sij || !vidna(o) || !o.layers.test(kam.layers)) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    if (mats.every((m) => !m || m.visible === false || m.opacity === 0)) return;
    const pos = o.geometry?.attributes?.position;
    if (!pos) return;
    const st = o.isInstancedMesh ? o.count : 1;
    const korak = Math.max(1, Math.floor((pos.count * st) / 2000));
    for (let k = 0; k < st; k++) {
      mw.copy(o.matrixWorld);
      if (o.isInstancedMesh) { o.getMatrixAt(k, mi); mw.multiply(mi); }
      for (let i = (k * 7) % korak; i < pos.count; i += korak) {
        v.fromBufferAttribute(pos, i).applyMatrix4(mw).project(kam);
        n++;
        if (Math.abs(v.x) > 1.0 || Math.abs(v.y) > 1.0 || v.z > 1) zunaj++;
      }
    }
  });
  const r = (b) => [b.left, b.top, b.right, b.bottom].map(Math.round);
  const info = host.querySelector(".k3-info"), obv = host.querySelector(".k3-obvestilo");
  const id = host.querySelector('[data-del][aria-pressed="true"]')?.dataset.del || null;
  const d = (api.model.deli || []).find((x) => x.id === id) || null;
  // poudarek: vsaj ena mreža izbranega dela ima kopijo materiala s sijem v barvi dela
  let sij = null;
  if (d) {
    const b = new THREE.Color(d.barva || "#6E9BFF");
    sij = (d.meshes || []).some((m) => [].concat(m?.material || []).some((x) => x.emissive && x.emissive.equals(b) && x.emissiveIntensity > 0.8));
  }
  return {
    izven: n ? zunaj / n : 0,
    canvas: r(host.querySelector("canvas").getBoundingClientRect()),
    id, ime: d?.ime ?? null, opis: d?.opis ?? null, sij,
    okno: info && !info.hidden ? { ime: info.querySelector(".k3-info-ime")?.textContent, opis: info.querySelector(".k3-info-opis")?.textContent ?? null, r: r(info.getBoundingClientRect()) } : null,
    obvestilo: obv && !obv.hidden ? { besedilo: obv.textContent, r: r(obv.getBoundingClientRect()) } : null,
    leti: !!api.kit.leti,
  };
}`;
const stanje = (p) => p.evaluate(`(${STANJE})()`).catch((e) => ({ napaka: e.message }));
async function pocakaj(p, pogoj, ms = 30000) {
  const konec = Date.now() + ms;
  let s = null;
  while (Date.now() < konec) {
    s = await stanje(p);
    if (s && !s.nalaga && !s.napaka && !s.leti && pogoj(s)) return s;
    await p.waitForTimeout(300);
  }
  return s;
}
const klikni = (loc) => loc.evaluate((x) => { x.scrollIntoView({ block: "nearest" }); x.click(); });

/** Po menjavi: okno ustreza novemu stanju, poudarek na novih mrežah, model v kadru, nič čez platno. */
function preveriStanje(kje, s, { prejId = null, pricakujObvestilo = true } = {}) {
  if (!s || s.nalaga || s.napaka) return napake.push(`${kje}: stanje ni na voljo ${s?.napaka || ""}`);
  if (s.okno && !s.id) napake.push(`${kje}: okno »${s.okno.ime}« je odprto, a noben del ni izbran`);
  if (!s.okno && s.id) napake.push(`${kje}: del ${s.id} je izbran, okno pa zaprto`);
  if (s.okno && s.id) {
    if (s.okno.ime !== s.ime) napake.push(`${kje}: okno kaže »${s.okno.ime}«, izbran je »${s.ime}«`);
    if ((s.okno.opis ?? "") !== (s.opis ?? "")) napake.push(`${kje}: okno kaže star opis »${(s.okno.opis || "").slice(0, 90)}« namesto »${(s.opis || "").slice(0, 90)}«`);
    if (s.sij === false) napake.push(`${kje}: poudarek ni na novih mrežah dela ${s.id}`);
    if (prekriva(s.okno.r, s.canvas)) napake.push(`${kje}: okno ${s.okno.r} prekriva platno ${s.canvas}`);
  }
  if (prejId && !s.id && pricakujObvestilo && !s.obvestilo) napake.push(`${kje}: okno dela ${prejId} se je zaprlo brez obvestila`);
  if (s.obvestilo && prekriva(s.obvestilo.r, s.canvas)) napake.push(`${kje}: obvestilo prekriva platno`);
  if (s.izven > MEJA) napake.push(`${kje}: po menjavi ${(s.izven * 100).toFixed(1)} % modela izven kadra`);
}

async function odpri(p, hash) {
  await p.goto("about:blank");
  await p.goto(`${base}/3d#${hash}`, { waitUntil: "load" });
  const s = await pocakaj(p, (x) => x.izven <= MEJA, /^organ-/.test(hash) ? 180000 : 60000);
  if (!s || s.nalaga) throw new Error("model se ni naložil");
  return s;
}
const izberiDel = async (p, id) => {
  await klikni(p.locator(`.k3-pregled [data-del="${id}"]`).first());
  return pocakaj(p, (x) => x.id === id && !!x.okno);
};
const izberiMoznost = async (p, k) => {
  const g = p.locator(`.k3-pregled .k3-nadzor [data-k="${k}"]`);
  if (await g.count()) return klikni(g.first());
  const o = p.locator(".k3-pregled .k3-izbor-moznost", { hasText: k });
  return klikni(o.first());
};

async function kristali(p, nm) {
  const MREZE = ["nacl", "cscl", "diamant", "grafit", "bcc", "fcc", "hcp", "led"];
  const PRICAKUJ = { nacl: "4 ioni Na⁺ in 4 ioni Cl⁻", cscl: "en ion Cs⁺ in en ion Cl⁻", diamant: "8 atomov C", grafit: "4 atomi C", bcc: "2 atoma Fe", fcc: "4 atomi Cu", hcp: "6 atomov Mg", led: "4 molekule H₂O" };
  await odpri(p, "kristali?mreza=nacl");
  // osnovna celica: vsak kristal na naslednjega, opis vedno za novi kristal
  await izberiDel(p, "celica");
  for (const [i, m] of MREZE.entries()) {
    if (!i) continue;
    await izberiMoznost(p, m);
    const s = await pocakaj(p, (x) => (x.opis || "").includes(PRICAKUJ[m]) && x.izven <= MEJA);
    preveriStanje(`${nm} kristali ${MREZE[i - 1]}→${m}/celica`, s, { prejId: "celica" });
    if (s?.id !== "celica") napake.push(`${nm} kristali ${m}: osnovna celica ni več izbrana`);
    if (!(s?.okno?.opis || "").includes(PRICAKUJ[m])) napake.push(`${nm} kristali ${m}: opis celice »${s?.okno?.opis}« ne omenja »${PRICAKUJ[m]}«`);
  }
  // vsi deli bcc → led (Fe se zapre z obvestilom, vezi in celica ostaneta z novim opisom), s koordinacijo
  for (const koord of [false, true]) {
    await odpri(p, `kristali?mreza=bcc&koordinacija=${koord ? 1 : 0}`);
    const ids = await p.locator(".k3-pregled [data-del]").evaluateAll((b) => b.map((x) => x.dataset.del));
    for (const id of ids) {
      await izberiMoznost(p, "bcc");
      await pocakaj(p, (x) => (x.opis || x.okno?.opis || "").length >= 0 && x.izven <= MEJA);
      const pred = await izberiDel(p, id);
      if (!pred?.okno) { napake.push(`${nm} kristali bcc/${id}: okno se ni odprlo`); continue; }
      await izberiMoznost(p, "led");
      const s = await pocakaj(p, (x) => x.izven <= MEJA && (x.id !== id || (x.okno?.opis ?? "") === (x.opis ?? "")) && (x.id || x.obvestilo));
      preveriStanje(`${nm} kristali bcc→led/${id}${koord ? " (koordinacija)" : ""}`, s, { prejId: id });
    }
  }
}

async function splosni(p, nm, id) {
  const s0 = await odpri(p, id);
  const deli = await p.locator(".k3-pregled [data-del]").evaluateAll((b) => b.map((x) => x.dataset.del));
  if (!deli.length) return napake.push(`${nm} ${id}: model nima delov`);
  const izberiPrvi = async () => {
    const zdaj = await p.locator(".k3-pregled [data-del]").evaluateAll((b) => b.map((x) => x.dataset.del));
    if (zdaj.length) await izberiDel(p, zdaj[0]);
  };
  await izberiPrvi();
  // nadzori: izbire (do 4 možnosti), stikala, gumbi; drsniki ne (te kader ohranijo)
  const n = await p.locator(".k3-pregled .k3-nadzor .k3-seg, .k3-pregled .k3-nadzor .k3-izbira-meni, .k3-pregled .k3-nadzor [role=switch], .k3-pregled .k3-nadzor > .k3-pill").count();
  let st = 0;
  for (let i = 0; i < n && st < 12; i++) {
    const c = p.locator(".k3-pregled .k3-nadzor .k3-seg, .k3-pregled .k3-nadzor .k3-izbira-meni, .k3-pregled .k3-nadzor [role=switch], .k3-pregled .k3-nadzor > .k3-pill").nth(i);
    if (!(await c.isVisible().catch(() => false))) continue;
    const vrsta = await c.evaluate((x) => (x.classList.contains("k3-seg") ? "seg" : x.classList.contains("k3-izbira-meni") ? "meni" : x.getAttribute("role") === "switch" ? "stikalo" : "gumb"));
    const gumbi = vrsta === "seg" ? c.locator("button[data-k]") : vrsta === "meni" ? c.locator(".k3-izbor-moznost") : null;
    const kliki = gumbi ? Math.min(4, await gumbi.count()) : 2; // stikalo: vklop in izklop; gumb: dvakrat
    for (let j = 0; j < kliki; j++) {
      const g = gumbi ? gumbi.nth(j) : c;
      if (gumbi && (await g.getAttribute("aria-checked")) === "true") continue;
      const pred = await stanje(p);
      if (!pred?.id) await izberiPrvi();
      const prej = (await stanje(p))?.id;
      const ime = ((await g.textContent()) || vrsta).trim().slice(0, 30);
      await klikni(g);
      st++;
      const s = await pocakaj(p, (x) => x.izven <= MEJA && (!x.id || (x.okno?.opis ?? "") === (x.opis ?? "")), 30000);
      preveriStanje(`${nm} ${id} »${ime}«`, s, { prejId: prej });
    }
  }
  void s0;
}

async function puscice(p, nm) {
  // jedro iz živalske celice na naslednji model s puščico › : jedro ostane izbrano z opisom novega modela ali obvestilo
  await odpri(p, "celica-zivalska");
  await izberiDel(p, "jedro");
  const opisPrej = (await stanje(p))?.opis;
  await klikni(p.locator(".k3-sosed:not(.k3-zrcali)").first());
  let s = await pocakaj(p, (x) => x.izven <= MEJA && (x.id || x.obvestilo), 60000);
  preveriStanje(`${nm} ‹ › živalska → naslednja (jedro)`, s, { prejId: "jedro" });
  if (s?.id && s.opis === opisPrej) napake.push(`${nm} ‹ ›: okno kaže opis jedra iz prejšnjega modela`);
  // celica brez jedra: model pred eritrocitom, izbrano jedro, › na eritrocit → »Ta celica nima jedra.«
  await odpri(p, "celica-eritrocit");
  const prejsnji = decodeURIComponent((await p.locator(".k3-sosed.k3-zrcali").first().getAttribute("href")).slice(1));
  await odpri(p, prejsnji);
  const imaJedro = await p.locator('.k3-pregled [data-del="jedro"]').count();
  if (!imaJedro) return napake.push(`${nm} ‹ ›: ${prejsnji} (pred eritrocitom) nima jedra, preizkusa ni mogoče narediti`);
  await izberiDel(p, "jedro");
  await klikni(p.locator(".k3-sosed:not(.k3-zrcali)").first());
  s = await pocakaj(p, (x) => !!x.obvestilo, 60000);
  if (!/^Ta celica nima jedra\.$/.test(s?.obvestilo?.besedilo || "")) napake.push(`${nm} ‹ › ${prejsnji} → eritrocit: ni obvestila »Ta celica nima jedra.« (${s?.obvestilo?.besedilo})`);
  preveriStanje(`${nm} ‹ › ${prejsnji} → eritrocit`, s, { prejId: "jedro" });
}

async function atlas(p, nm) {
  await p.goto(`${base}/3d#atlas?izberi=Femur.r`, { waitUntil: "load" });
  const kartica = async () => p.evaluate(() => {
    const k = document.querySelector(".a3-kartica");
    return k && !k.hidden && k.getClientRects().length ? k.textContent : null;
  });
  const konec = Date.now() + 240000;
  let pred = null;
  while (Date.now() < konec && !(pred = await kartica())) await p.waitForTimeout(500);
  if (!pred) return napake.push(`${nm} atlas: kartica se ni odprla`);
  // preklop telesa (nastavitve): izbran del ostane z enakim besedilom (opis vrstice se ne spreminja) ali se zapre
  const gumb = p.locator(".a3 button", { hasText: /^Žensko$/ });
  if (!(await gumb.count())) {
    const odpriNast = p.locator(".a3 [data-nastavitve], .a3 button[aria-label='Nastavitve']");
    if (await odpriNast.count()) await klikni(odpriNast.first());
  }
  if (!(await gumb.count())) return log(`${nm} atlas: preklop Moško/Žensko ni na voljo (preskočeno)`);
  await klikni(gumb.first());
  await p.waitForTimeout(3000);
  const po = await kartica();
  if (po && po !== pred) napake.push(`${nm} atlas: kartica po preklopu kaže drugo besedilo`);
}

async function slikaj(p, pot) {
  await odpri(p, "kristali?mreza=bcc");
  await izberiDel(p, "celica");
  await p.waitForTimeout(1200);
  await izberiMoznost(p, "led");
  await p.waitForTimeout(2500);
  await pocakaj(p, () => true, 5000);
  await p.waitForTimeout(800);
  fs.mkdirSync(path.dirname(pot), { recursive: true });
  await p.screenshot({ path: pot });
  log("posnetek", pot);
}

const port = 38000 + Math.floor(Math.random() * 2000);
const base = `http://localhost:${port}`;
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-3dmenjava-"));
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_MOCK_DELAY_MS: "0", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", ANTHROPIC_API_KEY: "", RESEND_API_KEY: "", STRIPE_SECRET_KEY: "" },
    stdio: "ignore",
  });
  let browser;
  try {
    for (let i = 0; i < 150; i++) {
      try { if ((await fetch(base + "/healthz")).ok) break; } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
    for (const [nm, opt] of posnetek ? NAPRAVE.slice(0, 1) : NAPRAVE) {
      const ctx = await browser.newContext(opt);
      const p = await ctx.newPage();
      p.on("pageerror", (e) => napake.push(`${nm}: napaka strani ${e.message.slice(0, 160)}`));
      if (posnetek) {
        await slikaj(p, path.resolve(posnetek));
        await ctx.close();
        continue;
      }
      for (const naloga of NALOGE) {
        const pred = napake.length;
        try {
          if (naloga === "kristali") await kristali(p, nm);
          else if (naloga === "puscice") await puscice(p, nm);
          else if (naloga === "atlas") await atlas(p, nm);
          else await splosni(p, nm, naloga);
        } catch (e) {
          napake.push(`${nm} ${naloga}: ${e.message.split("\n")[0].slice(0, 200)}`);
        }
        log(nm, naloga, napake.length === pred ? "ok" : "NAPAKA\n" + napake.slice(pred).map((x) => "       - " + x).join("\n"));
      }
      await ctx.close();
    }
  } finally {
    await browser?.close();
    srv.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (napake.length) {
    console.error(`\n${napake.length} napak:\n` + napake.map((x) => "  - " + x).join("\n"));
    process.exit(1);
  }
  if (!posnetek) console.log(`\nOK: ${NALOGE.length} preizkusov menjave na ${NAPRAVE.length} napravah; okno dela vedno za novo stanje, poudarek in kader posodobljena.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
