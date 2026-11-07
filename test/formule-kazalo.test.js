// Formule v pravem brskalniku (pregled PR #481): kazalo zanesljivo skoči tudi na daljno kartico (kartice daleč od
// zaslona imajo zaradi content-visibility le ocenjeno višino), na telefonu z malo pomnilnika (deviceMemory ≤ 2)
// se list ob nedejavnosti ne pripravi vnaprej. Playwright Chromium (če je nameščen), telefon 360 × 740.
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
const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 180000 };

async function withApp(fn) {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    server.close();
  }
}

// Profil ustvari stran sama (piškotek naprave), nato ga app.js odpre namesto obrazca za nov profil.
async function phone(base, init, onPage) {
  const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, locale: "sl-SI", serviceWorkers: "block" });
  await ctx.addInitScript((mem) => {
    localStorage.setItem("evklid.tour", "1");
    if (mem) Object.defineProperty(Navigator.prototype, "deviceMemory", { get: () => mem });
  }, init?.mem || 0);
  const p = await ctx.newPage();
  onPage?.(p);
  await p.goto(base + "/healthz");
  const id = await p.evaluate(() =>
    fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Kazalo", settings: { school: "OSNOVNA_SOLA", grade: "8. razred" } }) })
      .then((r) => r.json())
      .then((s) => s.id),
  );
  assert.ok(id, "profil ustvarjen");
  await p.evaluate((id) => localStorage.setItem("studentId", String(id)), id);
  await p.goto(base + "/");
  await p.waitForSelector('.topbar .tab[data-view="graph"]', { state: "attached", timeout: 60000 });
  // vprašanje o zanimanjih (novi profil) zapremo, kot bi ga učenec
  await p.waitForSelector(".iq-wrap [data-iq=skip]", { timeout: 15000 }).then((b) => b.click()).catch(() => {});
  await p.evaluate(() => document.querySelector('.topbar .tab[data-view="graph"]').click());
  // kalkulator odprt: viden razdelek v #graph-slot (skriti razdelki ostanejo v pomnilniku)
  await p.waitForFunction(() => [...document.querySelectorAll("#graph-slot > *")].some((c) => !c.hidden && c.getClientRects().length), null, { timeout: 60000 });
  return { ctx, p };
}

test("kazalo Formul: vsak čip (tudi daljna zadnja kartica FIZ-UNI) pripelje kartico tik pod kazalo", opts, async () => {
  await withApp(async (base) => {
    const { ctx, p } = await phone(base);
    try {
      await p.evaluate(() => document.querySelector('#view-graph [data-calc-mode="formulas"]').click());
      await p.waitForSelector("#view-graph .fm .fm-sec", { timeout: 60000 });
      await p.evaluate(() => {
        document.querySelector('#view-graph .fm-subj [data-k="FIZ"]').click();
        document.querySelector('#view-graph .fm-lvl [data-k="UNI"]').click();
      });
      await p.waitForFunction(() => document.querySelectorAll("#view-graph .fm-toc [data-sec]").length > 3 && document.querySelector("#view-graph .fm-sec[id^=fm-FIZ-UNI]"), null, { timeout: 60000 });
      const n = await p.evaluate(() => document.querySelectorAll("#view-graph .fm-toc [data-sec]").length);
      const misses = [];
      // od zadnjega proti prvemu, prvi skok z vrha lista (najdaljši skok čez neizrisane kartice)
      await p.evaluate(() => (document.querySelector("#view-graph .fm").scrollTop = 0));
      for (let i = n - 1; i >= 0; i--) {
        await p.evaluate((i) => document.querySelectorAll("#view-graph .fm-toc [data-sec]")[i].click(), i);
        await p.waitForTimeout(2000);
        const r = await p.evaluate((i) => {
          const root = document.querySelector("#view-graph .fm");
          const toc = root.querySelector(".fm-toc");
          const sec = root.querySelector("#" + toc.querySelectorAll("[data-sec]")[i].dataset.sec);
          const off = sec.getBoundingClientRect().top - toc.getBoundingClientRect().bottom;
          const atEnd = root.scrollTop >= root.scrollHeight - root.clientHeight - 2;
          return { off: Math.round(off), atEnd };
        }, i);
        // cilj 8 px pod kazalom; zadnja kartica, nižja od zaslona, je lahko niže, ko je list do konca pomaknjen
        const ok = Math.abs(r.off - 8) <= 3 || (r.atEnd && r.off >= 8 && r.off < 740);
        if (!ok) misses.push([i, r.off]);
      }
      assert.deepEqual(misses, [], "čipi kazala, ki niso pripeljali kartice pod kazalo: [indeks, odmik px]");
    } finally {
      await ctx.close();
    }
  });
});

// Priprava = prenos lista (/api/formulas) ob nedejavnosti po odprtju kalkulatorja (list se izriše v nepriklopljeno orodje).
test("telefon z malo pomnilnika (deviceMemory 2): list Formul se ob nedejavnosti ne pripravi vnaprej", opts, async () => {
  await withApp(async (base) => {
    for (const [mem, want] of [[2, false], [8, true]]) {
      const { ctx, p } = await phone(base, { mem }, (page) => page.on("request", (r) => r.url().includes("/api/formulas") && (page.__formule = true)));
      try {
        for (let w = 0; w < 25 && !p.__formule; w++) await p.waitForTimeout(1000);
        assert.equal(!!p.__formule, want, `deviceMemory ${mem}`);
      } finally {
        await ctx.close();
      }
    }
  });
});

test.after(() => chromium?.close());
