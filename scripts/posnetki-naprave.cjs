// Posnetki in dimni test na več napravah za zunanji pregled (j, 25. 11. 2026, R3 v »Evklid – zunanji pregled«).
// Za vsako napravo (pokončno in ležeče) zažene scripts/preveri-aplikacijo.cjs z --zaslon na svojem preizkusnem
// strežniku (začasna baza, vzorčni odgovori inštruktorja, brez pravih API-klicev in brez produkcije). Tok izbere
// isto pravilo kot aplikacija (public/style.css, spodnja vrstica): do 760 px ali dotik do 1240 px → »telefon«,
// sicer »računalnik«. Vsaka naprava teče v svetli in temni temi, z meritvami (--meritve).
// Nato preveri tipkovnico (Tab: je fokus viden?) in pisalo (dogodki pointerType »pen« na platnu za risanje,
// le delno: Playwright pravega pisala nima) ter zapiše kazalo.html in POVZETEK.md za recenzenta.
//
// Zagon: node scripts/posnetki-naprave.cjs [--mapa <mapa>] [--naprave tel-390,ipad-820,...] [--teme svetla,temna] [--hkrati 3]
// (ali node scripts/preveri-aplikacijo.cjs --naprave …). Ročni seznam za pravo napravo: docs/naprave-rocno.md.
// --kazalo: nič ne zažene, samo sestavi kazalo.html in POVZETEK.md iz map v --mapa (vsaka ima rezultat.json);
// tako GitHub Actions združi posle, ki tečejo vzporedno (.github/workflows/posnetki-naprave.yml).
// Izhod 1, če je kje kaj narobe (seznam je v POVZETEK.md).
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const net = require("node:net");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const OUT = path.resolve(arg("--mapa") || "posnetki-naprave");
const HKRATI = Math.max(1, Number(arg("--hkrati")) || Math.min(3, os.cpus().length));

// ime, širina × višina pokončno, dotik, mobilni pogled
const NAPRAVE = [
  { ime: "tel-360", opis: "telefon 360 × 740", w: 360, h: 740, dotik: true, mobilno: true },
  { ime: "tel-390", opis: "telefon 390 × 844", w: 390, h: 844, dotik: true, mobilno: true },
  { ime: "tel-430", opis: "telefon 430 × 932", w: 430, h: 932, dotik: true, mobilno: true },
  { ime: "ipad-820", opis: "iPad 820 × 1180", w: 820, h: 1180, dotik: true, mobilno: false },
  { ime: "ipad-1024", opis: "iPad Pro 1024 × 1366", w: 1024, h: 1366, dotik: true, mobilno: false },
  { ime: "pc-1280", opis: "računalnik 1280 × 800", w: 1280, h: 800, dotik: false, mobilno: false, lezece: false },
  { ime: "pc-1440", opis: "računalnik 1440 × 900", w: 1440, h: 900, dotik: false, mobilno: false, lezece: false },
  { ime: "pc-1920", opis: "računalnik 1920 × 1080", w: 1920, h: 1080, dotik: false, mobilno: false, lezece: false },
];
const izbira = arg("--naprave")?.split(",").map((s) => s.trim());
const TEME = (arg("--teme") || "svetla,temna").split(",").map((s) => s.trim());
if (TEME.some((t) => !["svetla", "temna"].includes(t))) throw new Error("--teme: svetla, temna");
const ZAGONI = [];
for (const n of NAPRAVE) {
  if (izbira && !izbira.includes(n.ime)) continue;
  // Računalnik je samo ležeč (širši kot visok); telefon in tablica v obeh legah.
  const lege = n.lezece === false ? [["", n.w, n.h]] : [["-pokoncno", n.w, n.h], ["-lezece", n.h, n.w]];
  for (const tema of TEME)
    for (const [lega, w, h] of lege) ZAGONI.push({ ...n, id: `${n.ime}${lega}-${tema}`, lega: lega ? lega.slice(1) : "", tema, w, h });
}
// Isto pravilo kot public/style.css (»spodnja vrstica«): telefon do 760 px, tablica na dotik do 1240 px.
const tokZa = (z) => (z.w <= 760 || (z.dotik && z.w <= 1240) ? "telefon" : "racunalnik");
if (!ZAGONI.length) throw new Error(`--naprave: ${NAPRAVE.map((n) => n.ime).join(", ")}`);

function zazeni(z) {
  return new Promise((resolve) => {
    const mapa = path.join(OUT, z.id);
    fs.rmSync(mapa, { recursive: true, force: true });
    fs.mkdirSync(mapa, { recursive: true });
    const tok = tokZa(z);
    const a = ["scripts/preveri-aplikacijo.cjs", "--brez-racunov", "--samo", tok, "--zaslon", `${z.w}x${z.h}`, "--posnetki", mapa, "--meritve"];
    if (z.tema === "temna") a.push("--tema", "temna");
    if (z.dotik) a.push("--dotik");
    if (z.mobilno) a.push("--mobilno");
    const t0 = Date.now();
    const p = spawn(process.execPath, a, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
    let log = "";
    p.stdout.on("data", (d) => (log += d));
    p.stderr.on("data", (d) => (log += d));
    p.on("close", (code) => {
      fs.writeFileSync(path.join(mapa, "dnevnik.txt"), log);
      const napake = log.split("\n").filter((l) => l.startsWith("NAPAKA ")).map((l) => l.slice(7));
      if (code && !napake.length) napake.push(`preverjanje se je končalo z izhodom ${code} (glej dnevnik.txt)`);
      console.log(`${z.id} (${z.w}×${z.h}, ${tok}): ${napake.length ? `${napake.length} težav` : "v redu"} v ${Math.round((Date.now() - t0) / 1000)} s`);
      resolve({ ...z, tok, napake });
    });
  });
}

// ---------- tipkovnica in pisalo (en preizkusni strežnik za vse naprave) ----------
const freePort = () =>
  new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
    s.on("error", reject);
  });
async function streznik() {
  const port = await freePort();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-naprave-"));
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
  };
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: ROOT, env, stdio: "ignore" });
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base + "/healthz")).ok) return { base, stop: () => (srv.kill(), fs.rmSync(dir, { recursive: true, force: true })) };
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  srv.kill();
  throw new Error("preizkusni strežnik se ni zagnal");
}

// Prvi zaslon (uvod novega učenca): do 25× Tab; vsak fokus mora biti viden (obroba ali senca) in na zaslonu.
async function tipkovnica(p) {
  const brez = [];
  let postaj = 0;
  for (let i = 0; i < 25; i++) {
    await p.keyboard.press("Tab");
    const f = await p.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const ime = `${el.nodeName.toLowerCase()}${el.id ? "#" + el.id : ""}${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30) ? ` »${(el.getAttribute("aria-label") || el.textContent).trim().slice(0, 30)}«` : ""}`;
      // Viden fokus: obroba, senca ali drugačna barva roba kot brez fokusa (polja, npr. #onb-goal-date).
      const rob = cs.borderColor;
      el.blur();
      const robBrez = getComputedStyle(el).borderColor;
      el.focus({ preventScroll: true });
      const viden = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none" || rob !== robBrez;
      const naZaslonu = r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
      return { ime, viden, naZaslonu };
    });
    if (!f) continue;
    postaj++;
    if (!f.viden) brez.push(`fokus ni viden: ${f.ime}`);
    else if (!f.naZaslonu) brez.push(`fokus izven zaslona: ${f.ime}`);
  }
  if (!postaj) brez.push("Tab ne doseže nobenega elementa");
  return { postaj, tezave: [...new Set(brez)] };
}

// Pisalo: na prvem vidnem <canvas> (risanje ali graf) pošlje potezo s pointerType »pen« in preveri, da je
// stran sprejela dogodke (pointerdown/move/up). Ni dokaz za pravo pisalo (pritisk, dlan na zaslonu, Apple Pencil).
async function pisalo(p) {
  return p.evaluate(async () => {
    const c = [...document.querySelectorAll("canvas")].find((x) => x.getBoundingClientRect().width > 50);
    if (!c) return "ni platna na tem zaslonu";
    const r = c.getBoundingClientRect();
    let dobil = 0;
    const st = () => dobil++;
    ["pointerdown", "pointermove", "pointerup"].forEach((t) => c.addEventListener(t, st, true));
    const ev = (t, x, y) => c.dispatchEvent(new PointerEvent(t, { pointerType: "pen", pointerId: 9, isPrimary: true, bubbles: true, cancelable: true, pressure: t === "pointerup" ? 0 : 0.5, clientX: r.left + x, clientY: r.top + y, buttons: t === "pointerup" ? 0 : 1 }));
    ev("pointerdown", 20, 20);
    for (let i = 1; i <= 5; i++) ev("pointermove", 20 + i * 10, 20 + i * 5);
    ev("pointerup", 70, 45);
    return dobil >= 7 ? null : `platno je dobilo ${dobil} od 7 dogodkov pisala`;
  });
}

async function vnos(rezultati) {
  const { chromium } = require("playwright");
  const s = await streznik();
  const browser = await chromium.launch();
  try {
    for (const r of rezultati) {
      if (r.tema === "temna" && rezultati.some((x) => x.ime === r.ime && x.lega === r.lega && x.tema === "svetla")) continue; // vnos ni odvisen od teme
      const ctx = await browser.newContext({ viewport: { width: r.w, height: r.h }, hasTouch: r.dotik, isMobile: r.mobilno, colorScheme: r.tema === "temna" ? "dark" : "light", locale: "sl-SI", reducedMotion: "reduce", serviceWorkers: "block" });
      const p = await ctx.newPage();
      await p.goto(s.base + "/");
      await p.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
      const t = await tipkovnica(p);
      r.tipkovnica = t;
      for (const x of t.tezave) r.napake.push(`tipkovnica: ${x}`);
      // Pisalo na grafičnem kalkulatorju (javna stran /kalkulator, brez prijave).
      await p.goto(s.base + "/kalkulator");
      await p.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
      await p.getByRole("button", { name: /^Grafični$/ }).first().click({ timeout: 3000 }).catch(() => p.getByText(/^Grafični$/).first().click({ timeout: 3000 }).catch(() => {}));
      await p.waitForTimeout(500);
      r.pisalo = await pisalo(p).catch((e) => `ni mogoče preveriti: ${e.message.slice(0, 100)}`);
      await ctx.close();
    }
  } finally {
    await browser.close();
    s.stop();
  }
}

// ---------- kazalo in povzetek ----------
const SHA = (() => {
  try {
    return require("node:child_process").execSync("git rev-parse HEAD", { cwd: ROOT }).toString().trim();
  } catch {
    return process.env.GITHUB_SHA || "neznan";
  }
})();
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const naslov = (r) => `${r.opis}${r.lega ? `, ${r.lega}` : ""}, ${r.tema} tema – ${r.w} × ${r.h}`;
function preberiMeritve(r) {
  const f = path.join(OUT, r.id, "meritve.jsonl");
  const vrst = fs.existsSync(f) ? fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];
  const axe = new Map();
  for (const v of vrst) for (const a of v.axe || []) {
    const x = axe.get(a.id) || { id: a.id, vpliv: a.vpliv, zaslonov: 0, primer: a.primer, posnetek: v.posnetek };
    x.zaslonov++;
    axe.set(a.id, x);
  }
  return {
    zaslonov: vrst.length,
    pod24: vrst.filter((v) => v.pod24?.length).map((v) => ({ posnetek: v.posnetek, cilji: v.pod24 })),
    pod44: vrst.reduce((s, v) => s + (v.pod44 || 0), 0),
    odrezano: vrst.filter((v) => v.odrezano?.length).map((v) => ({ posnetek: v.posnetek, el: v.odrezano })),
    axe: [...axe.values()].sort((a, b) => b.zaslonov - a.zaslonov),
  };
}
function kazalo(rez) {
  const deli = rez.map((r) => {
    const slike = fs.readdirSync(path.join(OUT, r.id)).filter((f) => f.endsWith(".png")).sort((a, b) => (a.startsWith("NAPAKA") ? 1 : 0) - (b.startsWith("NAPAKA") ? 1 : 0) || a.localeCompare(b));
    const figs = slike
      .map((f) => `<figure${f.startsWith("NAPAKA") ? ' class="napaka"' : ""}><a href="${r.id}/${f}"><img loading="lazy" src="${r.id}/${f}" alt="${esc(f)}"></a><figcaption>${esc(f.replace(/\.png$/, ""))}</figcaption></figure>`)
      .join("");
    const nap = r.napake.length ? `<ul class="nap">${r.napake.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : "<p>Brez težav.</p>";
    const m = r.meritve;
    const mer = `<p class="mer">Meritve (opombe, ne napake): cilji pod 24 px na ${m.pod24.length} zaslonih · cilji pod 44 px: ${m.pod44} · odrezano besedilo na ${m.odrezano.length} zaslonih · axe-core: ${m.axe.length ? m.axe.map((a) => `${esc(a.id)} (${a.zaslonov})`).join(", ") : "brez kršitev ali ni nameščen"}</p>`;
    return `<section id="${r.id}"><h2>${esc(naslov(r))}</h2><p>${slike.length} posnetkov · ${r.dotik ? "dotik" : "miška"} · tok »${r.tok}«</p>${nap}${mer}<div class="mreza">${figs}</div></section>`;
  });
  return `<!DOCTYPE html><html lang="sl"><meta charset="utf-8"><title>Evklid – posnetki na napravah</title>
<style>body{font:14px system-ui,sans-serif;margin:24px;color:#111}nav a{margin-right:12px;display:inline-block}.mreza{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
figure{margin:0;border:1px solid #ddd;border-radius:6px;padding:6px;background:#fafafa}figure.napaka{border-color:#c00;background:#fff0f0}img{width:100%;height:220px;object-fit:contain;background:#fff}
figcaption{font-size:12px;word-break:break-all}.nap li{color:#a00}.mer{color:#555}</style>
<h1>Evklid – posnetki na napravah</h1><p>Commit <code>${esc(SHA)}</code> · ${new Date().toISOString().slice(0, 16)} UTC · preizkusni strežnik (začasna baza, vzorčni odgovori inštruktorja, brez produkcije). Povzetek: <a href="POVZETEK.md">POVZETEK.md</a>.</p>
<nav>${rez.map((r) => `<a href="#${r.id}">${r.id}</a>`).join("")}</nav>${deli.join("")}</html>`;
}
function povzetek(rez) {
  const v = [
    "# Evklid – dimni test in posnetki na napravah",
    "",
    `Commit \`${SHA}\`. Preizkusni strežnik: začasna baza, vzorčni odgovori inštruktorja (ne pravi AI), brez produkcije in API-kreditov.`,
    "",
    "**Težave** so neuspeli koraki in samodejna preverjanja dimnega testa (vodoravno drsenje, prekrivanje z mehurčkom, konzola, neprevedeni ključi). **Meritve** so opombe za pregled in testa ne obarvajo rdeče.",
    "",
    "| Zagon | Velikost | Vnos | Tok | Posnetkov | Težave | Cilji < 24 px (zasl.) | Odrezano (zasl.) | axe-core pravil | Tipkovnica (Tab) | Pisalo (delno) |",
    "|---|---|---|---|---|---|---|---|---|---|---|",
  ];
  for (const r of rez) {
    const n = fs.readdirSync(path.join(OUT, r.id)).filter((f) => f.endsWith(".png") && !f.startsWith("NAPAKA")).length;
    const m = r.meritve;
    const tip = r.tipkovnica ? `${r.tipkovnica.postaj} postaj, ${r.tipkovnica.tezave.length ? r.tipkovnica.tezave.length + " težav" : "v redu"}` : "–";
    v.push(`| ${r.id} | ${r.w} × ${r.h} | ${r.dotik ? "dotik" : "miška"} | ${r.tok} | ${n} | ${r.napake.length} | ${m.pod24.length} | ${m.odrezano.length} | ${m.axe.length} | ${tip} | ${r.pisalo === null ? "dogodki sprejeti" : r.pisalo || "–"} |`);
  }
  for (const r of rez.filter((x) => x.napake.length)) {
    v.push("", `## Težave: ${r.id}`, "");
    for (const n of r.napake) v.push(`- ${n}`);
  }
  // Kršitve axe-core in premajhni cilji: združeno po vseh zagonih (isto pravilo na več napravah je ena vrstica).
  const axe = new Map();
  for (const r of rez) for (const a of r.meritve.axe) {
    const x = axe.get(a.id) || { ...a, zagoni: new Set(), zaslonov: 0 };
    x.zagoni.add(r.id);
    x.zaslonov += a.zaslonov;
    axe.set(a.id, x);
  }
  if (axe.size) {
    v.push("", "## axe-core (WCAG 2.2 A/AA, samodejno)", "", "| Pravilo | Vpliv | Zaslonov | Zagonov | Primer | Posnetek |", "|---|---|---|---|---|---|");
    for (const a of [...axe.values()].sort((a, b) => b.zaslonov - a.zaslonov)) v.push(`| ${a.id} | ${a.vpliv || ""} | ${a.zaslonov} | ${a.zagoni.size} | \`${String(a.primer || "").slice(0, 60)}\` | ${a.posnetek} |`);
  }
  const majhni = new Map();
  for (const r of rez) for (const z of r.meritve.pod24) for (const c of z.cilji) {
    const k = c.replace(/ \d+×\d+$/, "");
    if (!majhni.has(k)) majhni.set(k, { cilj: c, posnetek: `${r.id}/${z.posnetek}`, n: 0 });
    majhni.get(k).n++;
  }
  if (majhni.size) {
    v.push("", "## Cilji pod 24 × 24 px (prvih 40)", "");
    for (const m of [...majhni.values()].sort((a, b) => b.n - a.n).slice(0, 40)) v.push(`- ${m.cilj} – ${m.n}× (npr. ${m.posnetek})`);
  }
  v.push("", "Pisalo: Playwright pošlje samo dogodke `pointerType: \"pen\"`; to ni preizkus pravega pisala (pritisk, dlan, Apple Pencil). Ročni seznam: `docs/naprave-rocno.md`.");
  return v.join("\n") + "\n";
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  if (args.includes("--kazalo")) {
    const rez = fs
      .readdirSync(OUT)
      .filter((d) => fs.existsSync(path.join(OUT, d, "rezultat.json")))
      .map((d) => JSON.parse(fs.readFileSync(path.join(OUT, d, "rezultat.json"), "utf8")));
    if (!rez.length) throw new Error(`v ${OUT} ni nobenega rezultat.json`);
    const vrstni = (r) => NAPRAVE.findIndex((n) => n.ime === r.ime) * 10 + (r.tema === "temna" ? 5 : 0) + (r.lega === "lezece" ? 1 : 0);
    rez.sort((a, b) => vrstni(a) - vrstni(b));
    fs.writeFileSync(path.join(OUT, "kazalo.html"), kazalo(rez));
    fs.writeFileSync(path.join(OUT, "POVZETEK.md"), povzetek(rez));
    const vse = rez.reduce((s, r) => s + r.napake.length, 0);
    console.log(`Kazalo iz ${rez.length} zagonov: ${path.join(OUT, "kazalo.html")}. Težav skupaj: ${vse}.`);
    process.exit(vse ? 1 : 0);
  }
  const vrsta = [...ZAGONI];
  const rez = [];
  await Promise.all(
    Array.from({ length: Math.min(HKRATI, vrsta.length) }, async () => {
      while (vrsta.length) rez.push(await zazeni(vrsta.shift()));
    }),
  );
  rez.sort((a, b) => ZAGONI.findIndex((z) => z.id === a.id) - ZAGONI.findIndex((z) => z.id === b.id));
  for (const r of rez) r.meritve = preberiMeritve(r);
  await vnos(rez).catch((e) => rez.forEach((r) => r.napake.push(`tipkovnica/pisalo ni uspelo: ${e.message.slice(0, 120)}`)));
  for (const r of rez) fs.writeFileSync(path.join(OUT, r.id, "rezultat.json"), JSON.stringify(r));
  fs.writeFileSync(path.join(OUT, "kazalo.html"), kazalo(rez));
  fs.writeFileSync(path.join(OUT, "POVZETEK.md"), povzetek(rez));
  const vse = rez.reduce((s, r) => s + r.napake.length, 0);
  console.log(`Kazalo: ${path.join(OUT, "kazalo.html")}. Težav skupaj: ${vse}.`);
  process.exit(vse ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
