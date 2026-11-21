// Pomočnik za brskalniške teste poti maturanta (UX maturanta, 21. 11. 2026): strežnik z računi v procesu, račun »Zame«
// (polnoletna maturantka sama, potrjen e-naslov) in stran v Chromiumu, prijavljena v ta račun.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const require = createRequire(import.meta.url);
export let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
export const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 240000 };
export const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>';
export const MATURANT = { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik OR", subject: "MAT", tour_version: 99, first_task: 1 };
export const TELEFON = { viewport: { width: 412, height: 839 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" };

export function streznik({ streamFn } = {}) {
  const store = openDb(":memory:");
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    stripeKey: "",
    resendKey: "",
    log: { error() {}, warn() {}, info() {} },
    streamFn:
      streamFn ||
      (async ({ onText }) => {
        onText("ok");
        return { text: "ok" + META, stopReason: "end_turn" };
      }),
  });
  const server = app.listen(0);
  return { store, base: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}

const piskot = (res) => res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
// Račun »Zame«: polnoletna maturantka s potrjenim e-naslovom in enim lastnim profilom.
export async function racunZame({ base, store }, email, settings = MATURANT) {
  const reg = await fetch(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "geslo1234", accept_privacy: true, birth_date: "2007-03-03" }),
  });
  assert.equal(reg.status, 201, await reg.clone().text());
  const cookie = piskot(reg);
  store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run(email);
  const s = await fetch(`${base}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify({ name: "Nika", self: true, consent: true, settings }),
  });
  assert.equal(s.status, 201, await s.clone().text());
  return { cookie, id: (await s.json()).id };
}

// Druga naprava istega računa (prijava z geslom): piškotek za klice API.
export async function prijava(base, email) {
  const r = await fetch(`${base}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: "geslo1234" }) });
  assert.equal(r.status, 200, await r.clone().text());
  return piskot(r);
}

// Stran v novem kontekstu (telefon ali računalnik), prijavljena v račun, z izbranim profilom.
export async function stran(base, { cookie, id }, ctxOpts = TELEFON) {
  const ctx = await chromium.newContext(ctxOpts);
  await ctx.addCookies(cookie.split("; ").map((c) => ({ name: c.split("=")[0], value: c.slice(c.indexOf("=") + 1), url: base })));
  await ctx.addInitScript((sid) => {
    localStorage.setItem("evklid.tour", "1");
    localStorage.setItem("studentId", String(sid));
  }, id);
  const p = await ctx.newPage();
  p.napake = [];
  p.on("pageerror", (e) => p.napake.push(e.message));
  return { ctx, p };
}

// Zavihek v spodnji vrstici (telefon): vrstica se po 3 s skrije, zato klik prek DOM.
export async function zavihek(p, view) {
  await p.evaluate((v) => document.querySelector(`#tabbar [data-view="${v}"]`).click(), view);
  await p.waitForSelector(`#view-${view}:not([hidden])`, { timeout: 15000 });
}
