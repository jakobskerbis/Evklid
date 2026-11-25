// Seznam pogovorov v Inštruktorju (360 × 740 z dotikom in 1280): dotik ali klik kjerkoli v vrstici starega
// pogovora odpre ta pogovor. Prej je klik poslušalo le besedilo (<span>), dotik ob robu vrstice je samo zaprl
// seznam in na zaslonu je ostal prejšnji (najnovejši) pogovor (j, 17. 11. 2026). Koš v vrstici pogovor izbriše
// in ga ne odpre.
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 };

const reply = 'Odgovor.\n<<META subject=MAT topic="x" error=0 mode=A flag=none done=0>>';
const streamFn = async ({ onText }) => {
  onText(reply);
  return { content: [{ type: "text", text: reply }], text: reply, stopReason: "end_turn" };
};

test("Inštruktor: klik ali dotik kjerkoli v vrstici starega pogovora odpre ta pogovor", opts, async (t) => {
  const store = openDb(":memory:");
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    server.close();
    await chromium.close();
  });
  const call = async (p, body) => {
    const r = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return /json/.test(r.headers.get("content-type") || "") ? r.json() : r.text();
  };
  const s = await call("/api/students", { name: "Ana", settings: { school: "SREDNJA_SOLA", grade: "2. letnik", tour_version: 99 } });
  for (const q of ["prvi pogovor", "drugi pogovor", "tretji pogovor", "četrti pogovor"]) {
    const c = await call(`/api/students/${s.id}/conversations`, {});
    await call(`/api/conversations/${c.id}/messages`, { text: q });
  }

  for (const vp of [{ width: 360, height: 740 }, { width: 1280, height: 800 }]) {
    const phone = vp.width < 500;
    // Brez service workerja: ob novi različici bi stran med testom osvežil (app-version).
    const ctx = await chromium.newContext({ viewport: vp, hasTouch: true, isMobile: phone, serviceWorkers: "block" });
    await ctx.addInitScript((sid) => {
      localStorage.setItem("evklid.tour", "1");
      localStorage.setItem("studentId", String(sid));
    }, s.id);
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base + "/", { waitUntil: "networkidle" });
    await p.waitForFunction(() => window.evklid?.showView);
    await p.evaluate(() => window.evklid.showView("chat"));
    await p.waitForSelector("#conversation-list li", { state: "attached" });
    const title = () => p.textContent("#chat-title");
    // Najprej je odprt najnovejši pogovor (kot ob vrnitvi v inštruktorja pred manj kot 10 min).
    if (phone) await p.locator("#toggle-sidebar").tap();
    await p.locator("#conversation-list li span", { hasText: "četrti pogovor" }).click();
    await p.waitForFunction(() => document.querySelector("#chat-title").textContent === "četrti pogovor");

    const openList = async () => {
      if (!phone) return;
      await p.locator("#toggle-sidebar").tap();
      await p.waitForSelector(".sidebar.open");
    };
    // Rob vrstice (zgoraj, levo, spodaj): ne na besedilu.
    const row = (text) => p.locator("#conversation-list li", { hasText: text });
    const edge = async (text, where) => {
      const li = row(text);
      const b = await li.boundingBox();
      const span = await li.locator("span").boundingBox();
      assert.ok(b && span, "vrstica je vidna");
      // Ne tik ob košu: telefon dotik ob gumbu pripiše gumbu (prilagoditev dotika).
      const pt = where === "top" ? [span.x + span.width / 3, b.y + 2] : where === "left" ? [b.x + 3, b.y + b.height / 2] : [span.x + span.width / 3, b.y + b.height - 2];
      const hit = await p.evaluate(([x, y]) => document.elementFromPoint(x, y)?.tagName, pt);
      assert.equal(hit, "LI", `točka ${where} je v vrstici, ne na besedilu ali košu`);
      if (phone) await p.touchscreen.tap(pt[0], pt[1]);
      else await p.mouse.click(pt[0], pt[1]);
    };
    for (const [text, where] of [["prvi pogovor", "top"], ["drugi pogovor", "left"], ["tretji pogovor", "bottom"]]) {
      await openList();
      await edge(text, where);
      await p.waitForFunction((x) => document.querySelector("#chat-title").textContent === x, text, { timeout: 5000 }).catch(() => {});
      assert.equal(await title(), text, `${vp.width}: ${where} rob vrstice »${text}« odpre ta pogovor`);
      assert.match(await p.locator("#messages").innerText(), new RegExp(text), "sporočila tega pogovora");
      assert.equal(await row(text).getAttribute("class"), "active");
      if (phone) assert.equal(await p.locator(".sidebar.open").count(), 0, "seznam se na telefonu zapre");
    }
    // Koš izbriše pogovor in ga ne odpre (odprt ostane drugi pogovor).
    if (vp.width === 1280) {
      await row("prvi pogovor").hover();
      await row("prvi pogovor").locator("button").click();
      await p.waitForFunction(() => ![...document.querySelectorAll("#conversation-list li span")].some((x) => x.textContent === "prvi pogovor"));
      assert.equal(await title(), "tretji pogovor", "koš ne odpre pogovora");
    }
    assert.deepEqual(errors, []);
    await ctx.close();
  }
});
