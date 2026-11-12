// Kalkulator v pravem brskalniku (pregled PR #481): Grafični, pripravljen ob nedejavnosti, se nariše v barvah sloga;
// kazalo zanesljivo skoči tudi na daljno kartico (kartice daleč od
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
  await ctx.addInitScript(([mem, mode]) => {
    localStorage.setItem("evklid.tour", "1");
    if (mode) localStorage.setItem("evklid.theme", JSON.stringify({ style: "cist", mode }));
    if (mem) Object.defineProperty(Navigator.prototype, "deviceMemory", { get: () => mem });
  }, [init?.mem || 0, init?.mode || ""]);
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
          const toc = root.querySelector(".fm-toc-bar"); // prilepljena vrstica kazala (z ozadjem)
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
test("telefon z malo pomnilnika (deviceMemory 2): list Formul se ob nedejavnosti ne pripravi vnaprej; pripravljen list ob prikazu označi prvi čip", opts, async () => {
  await withApp(async (base) => {
    for (const [mem, want] of [[2, false], [8, true]]) {
      const { ctx, p } = await phone(base, { mem }, (page) => page.on("request", (r) => r.url().includes("/api/formulas") && (page.__formule = true)));
      try {
        for (let w = 0; w < 25 && !p.__formule; w++) await p.waitForTimeout(1000);
        assert.equal(!!p.__formule, want, `deviceMemory ${mem}`);
        if (want) {
          // Pregled B2 P2-2: v pripravljenem (skritem) listu je bil ob prikazu označen zadnji čip kazala, ne prvi.
          await p.waitForTimeout(4000);
          await p.evaluate(() => document.querySelector('#view-graph [data-calc-mode="formulas"]').click());
          await p.waitForFunction(() => document.querySelectorAll("#view-graph .fm-toc [data-sec]").length > 1, null, { timeout: 30000 });
          await p.waitForTimeout(500);
          const active = await p.evaluate(() => [...document.querySelectorAll("#view-graph .fm-toc [data-sec]")].findIndex((c) => c.classList.contains("active")));
          assert.equal(active, 0, "ob prvem prikazu je označen prvi čip");
        }
      } finally {
        await ctx.close();
      }
    }
  });
});

// Pregled B2 P1-1: Grafični, zgrajen ob nedejavnosti zunaj strani, je imel prazne barve (bela podlaga, črna mreža)
// in platno 0 × 0 (napačno merilo). Po pripravi in tapu mora biti platno pravih mer v barvah sloga (svetlo in temno).
test("Grafični po pripravi ob nedejavnosti: platno pravih mer in v barvah sloga (svetlo in temno)", opts, async () => {
  await withApp(async (base) => {
    for (const mode of ["light", "dark"]) {
      const { ctx, p } = await phone(base, { mode }, (page) => page.on("request", (r) => r.url().includes("/graph/calc.js") && (page.__graf = true)));
      try {
        for (let w = 0; w < 25 && !p.__graf; w++) await p.waitForTimeout(1000);
        assert.ok(p.__graf, "Grafični se pripravi ob nedejavnosti");
        await p.waitForTimeout(3000);
        await p.evaluate(() => document.querySelector('#view-graph [data-calc-mode="graph"]').click());
        await p.waitForFunction(() => [...document.querySelectorAll("#graph-slot canvas")].some((c) => c.getClientRects().length && c.width > 100), null, { timeout: 30000 });
        await p.waitForTimeout(800);
        const r = await p.evaluate(() => {
          const c = [...document.querySelectorAll("#graph-slot canvas")].find((x) => x.getClientRects().length && x.width > 100);
          const box = c.getBoundingClientRect();
          const probe = document.createElement("span");
          probe.style.color = "var(--surface)";
          document.body.append(probe);
          const want = getComputedStyle(probe).color.match(/\d+/g).slice(0, 3).map(Number);
          probe.remove();
          // vogal platna (brez mreže in osi): barva podlage
          const px = [...c.getContext("2d").getImageData(3, 3, 1, 1).data].slice(0, 3);
          return { w: Math.round(box.width), cw: c.width, want, px, dpr: devicePixelRatio };
        });
        assert.ok(r.w > 200 && Math.abs(r.cw - r.w * r.dpr) <= 2, `platno pravih mer (${mode}): ${JSON.stringify(r)}`);
        assert.ok(r.px.every((v, i) => Math.abs(v - r.want[i]) <= 12), `podlaga v barvi sloga (${mode}): ${JSON.stringify(r)}`);
      } finally {
        await ctx.close();
      }
    }
  });
});

test.after(() => chromium?.close());
