// Prvi zagon brez podvojenih zahtev in brez napak (pregled celotne aplikacije, 17. 11. 2026): /api/usage je
// zahteval vsak (403 za vse razen skrbnika; tudi skrbnik, ki seje še ni potrdil s kodo, A9), paket vaj se je
// zahteval dvakrat (dve izdaji od dnevne meje, nato 429), /api/config, učna pot, seznam poti, urnik in dnevni
// izziv pa po dvakrat ali trikrat. Kratke povezave in stran 404 sta v test/ni-strani.test.js.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const read = (f) => fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");
const REMOTE = { "x-forwarded-for": "203.0.113.7" }; // kot prek gostovanja: ne računalnik s strežnikom

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = new Map();
  const web = async (path, { body, headers = REMOTE } = {}) => {
    const res = await fetch(base + path, {
      method: body ? "POST" : "GET",
      headers: { "content-type": "application/json", cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      const i = kv.indexOf("=");
      jar.set(kv.slice(0, i), kv.slice(i + 1));
    }
    return { status: res.status, body: await res.json().catch(() => null) };
  };
  try {
    await fn({ base, web, jar, store });
  } finally {
    server.close();
  }
}

const registerWithChild = async (web, store) => {
  const r = await web("/api/auth/register", { body: { email: "mama@primer.si", password: "geslo12345", accept_privacy: true, birth_date: "1985-04-12" } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  store.db.prepare("UPDATE parents SET email_verified_at = datetime('now')").run(); // potrjen e-naslov (povezava v e-pošti)
  const s = await web("/api/students", { body: { name: "Ana", self: true, consent: true } });
  assert.ok(s.status < 300, JSON.stringify(s.body));
};

test("/api/config admin pove natanko, kdaj sme odjemalec klicati /api/usage", async () => {
  await withServer(async ({ web, store }) => {
    await registerWithChild(web, store);
    const remote = await web("/api/config");
    assert.equal(remote.body.admin, false);
    assert.equal((await web("/api/usage")).status, 403, "starš prek spleta: ni skrbnik");
    const local = await web("/api/config", { headers: {} });
    assert.equal(local.body.admin, true);
    assert.equal((await web("/api/usage", { headers: {} })).status, 200, "računalnik s strežnikom");
  });
});

test("odjemalec zahteva porabo samo kot skrbnik in združi enake zahteve v teku", () => {
  const meter = read("usage-meter.js");
  const refresh = meter.slice(meter.indexOf("export async function refreshUsageMeter"));
  assert.ok(refresh.indexOf("D.allowed && !D.allowed()") > 0 && refresh.indexOf("D.allowed && !D.allowed()") < refresh.indexOf('fetch("/api/usage")'), "števec: dovoljenje pred zahtevo");
  const app = read("app.js");
  const load = app.slice(app.indexOf("async function loadUsage"));
  assert.ok(load.indexOf("if (!usageAdmin)") < load.indexOf('fetch("/api/usage")'), "nastavitve: dovoljenje pred zahtevo");
  assert.match(app, /initUsageMeter\(\{ escapeHtml, showView, toast, allowed: \(\) => usageAdmin \}\)/);
  assert.match(app, /if \(get && apiInFlight\.has\(url\)\) return apiInFlight\.get\(url\)\.then\(kopija\)/);
  assert.match(app, /p\.then\(pobrisi, pobrisi\);\n\s*return p\.then\(kopija\);/, "tudi prvi klic dobi kopijo");
  assert.match(app, /if \(!get\) apiInFlight\.clear\(\);/, "sprememba pozabi GET v teku");
  assert.match(app, /await start\(\{ cfgFresh: true \}\)/, "prvi zagon prijavljenega: /api/config enkrat");
  // Pregledovalnik pole: ni del zagona, a se predpomni v mirovanju; neuspel uvoz se pozabi in poskusi z ?r= (kot igre).
  assert.doesNotMatch(app, /^import [^\n]*"\.\/paper-viewer\.js"/m);
  assert.match(app, /\(\) => loadPaperViewer\(\), \/\/ pregledovalnik prenesene pole/);
  assert.match(app, /paperViewerTries\+\+ \? import\(`\.\/paper-viewer\.js\?r=\$\{paperViewerTries\}`\) : import\("\.\/paper-viewer\.js"\)/);
  assert.match(app, /\.catch\(\(err\) => \{\n\s*paperViewerP = null;/);
});

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

test("prvi zagon prijavljenega starša: vsaka zahteva API enkrat, brez odgovorov ≥ 400", { skip: !playwright && "Playwright ni nameščen", timeout: 90_000 }, async () => {
  await withServer(async ({ base, web, jar, store }) => {
    await registerWithChild(web, store);
    const browser = await playwright.chromium.launch();
    try {
      const ctx = await browser.newContext({ locale: "sl-SI", timezoneId: "Europe/Ljubljana", serviceWorkers: "block", extraHTTPHeaders: REMOTE });
      const host = new URL(base).hostname;
      await ctx.addCookies([...jar].map(([name, value]) => ({ name, value, domain: host, path: "/" })));
      const p = await ctx.newPage();
      const seen = [];
      p.on("response", (r) => {
        const u = new URL(r.url());
        if (u.pathname.startsWith("/api/")) seen.push({ key: `${r.request().method()} ${u.pathname}${u.search}`, status: r.status() });
      });
      await p.goto(base + "/");
      await p.waitForSelector("#view-path #xp-card", { state: "visible", timeout: 20_000 });
      await p.waitForTimeout(3000); // zahteve v ozadju (paket vaj, urnik, dnevni izziv)
      const bad = seen.filter((x) => x.status >= 400).map((x) => `${x.status} ${x.key}`);
      assert.deepEqual(bad, [], "napake ob zagonu");
      const count = {};
      for (const { key } of seen) count[key] = (count[key] || 0) + 1;
      const dup = Object.entries(count).filter(([, n]) => n > 1);
      assert.deepEqual(dup, [], "podvojene zahteve");
      assert.ok(!Object.keys(count).some((k) => k.startsWith("GET /api/usage")), "poraba samo za skrbnika");
      assert.ok(Object.keys(count).some((k) => k.includes("/offline-pack")), "paket vaj se prenese (enkrat)");
      assert.equal(await p.locator("#usage-meter").isHidden(), true);
    } finally {
      await browser.close();
    }
  });
});
