// AI Act čl. 50 (j 18. 11. 2026): učenec ve, da govori z AI (50(1), public/ai-oznaka/); podporni metapodatki
// (server/ai-oznaka.js): odgovori API, DOM, strani za tisk in PDF-ji učbenika.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { startupFiles } from "../server/startup-files.js";
import { shell } from "../server/textbook-print.js";
import { pdfTemplateHash, PDF_MERGE_VERSION, PDF_AI_MARK_VERSION } from "../server/ucbenik-pdf.js";
import { AI_HEAD, IPTC_AI, PDF_AI_INFO, PDF_AI_XMP } from "../server/ai-oznaka.js";
import SL from "../public/ai-oznaka/sl.js";
import MAIN from "../public/i18n/sl.js";
import { mlad } from "../public/ai-oznaka/mlad.js";
import { UI_LANGUAGES } from "../public/i18n/languages.js";

const require = createRequire(import.meta.url);
const ROOT = path.join(import.meta.dirname, "..");
const PUB = path.join(ROOT, "public");
const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>';
const forms = (v) => (typeof v === "object" ? Object.values(v) : [v]);

test("besedila: vsak jezik ima vse ključe, nič ni ostalo v slovenščini; splošna opomba pove, da je AI", () => {
  const keys = Object.keys(SL).sort();
  const dir = path.join(PUB, "ai-oznaka", "i18n");
  for (const code of UI_LANGUAGES.filter((c) => c !== "sl")) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, `${code}.json`), "utf8"));
    assert.deepEqual(Object.keys(d).sort(), keys, code);
    for (const k of keys) {
      assert.ok(typeof d[k] === "string" && d[k].trim(), `${code} ${k}`);
      assert.notEqual(d[k], SL[k], `${code} ${k} je v slovenščini`);
    }
    const ui = JSON.parse(fs.readFileSync(path.join(PUB, "i18n", "ui", `${code}.json`), "utf8"));
    assert.equal(ui["chat.aiNote"], d["aio.star"], `${code}: chat.aiNote = aio.star`);
  }
  assert.equal(fs.readdirSync(dir).length, UI_LANGUAGES.length - 1);
  assert.equal(MAIN["chat.aiNote"], SL["aio.star"]);
  for (const k of ["aio.mlad", "aio.star", "aio.opisMlad", "aio.opisStar"]) assert.match(SL[k], /umetn\w+ inteligenc/, k);
  assert.match(SL["aio.star"], /ne s človekom/);
  assert.match(SL["aio.mlad"], /ne človek/);
  for (const v of Object.values(SL)) forms(v).forEach((s) => assert.doesNotMatch(s, /\{\w+\}/));
});

test("starost: OŠ 1.–5. razred preprosteje, starejši in tuji sistem po letu šolanja", () => {
  assert.equal(mlad({ educational_track: "OSNOVNA_SOLA", curriculum_level: "3. razred" }), true);
  assert.equal(mlad({ educational_track: "OSNOVNA_SOLA", curriculum_level: "5. razred" }), true);
  assert.equal(mlad({ educational_track: "OSNOVNA_SOLA", curriculum_level: "6. razred" }), false);
  assert.equal(mlad({ educational_track: "SREDNJA_SOLA", curriculum_level: "1. letnik" }), false);
  assert.equal(mlad({}), false);
});

test("prvo odprtje: oznaka se naloži šele ob uporabi (klepet, skener z import())", () => {
  const first = startupFiles(PUB, "index.html");
  assert.ok(!first.some((u) => u.startsWith("/ai-oznaka/")), first.filter((u) => u.startsWith("/ai-oznaka/")).join());
  const app = fs.readFileSync(path.join(PUB, "app.js"), "utf8");
  assert.match(app, /import\("\.\/ai-oznaka\/ai-oznaka\.js"\)/);
  assert.match(app, /el\.dataset\.aiGenerated = "true"/);
  const scan = fs.readFileSync(path.join(PUB, "scan", "scan.js"), "utf8");
  assert.match(scan, /import\("\.\.\/ai-oznaka\/ai-oznaka\.js"\)/);
  assert.match(scan, /data-ai-generated="true"/);
  for (const f of ["ustno/ustno.js", "zapiski/zapiski.js"]) assert.match(fs.readFileSync(path.join(PUB, f), "utf8"), /data-ai-generated="true"[\s\S]*opombaHtml|opombaHtml[\s\S]*data-ai-generated="true"/, f);
});

async function withApp(opts, fn) {
  const streamFn = async ({ onText }) => {
    const text = "Seštej enice, nato desetice." + META;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn" };
  };
  const app = createApp(openDb(":memory:"), { scheduler: false, streamFn, log: { error() {}, warn() {}, info() {} }, ...opts });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (method, url, body) => {
    const res = await fetch(base + url, { method, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    return { status: res.status, body: json, text };
  };
  try {
    await fn({ base, req });
  } finally {
    server.close();
  }
}

test("API: odgovor inštruktorja in rešitev skenerja imata ai_generated, učenčevo sporočilo ne", async () => {
  const scanSolveFn = async () => ({ solution: { kind: "equation", methods: [{ name: "a", steps: [{ title: "t", tex: "x", why: "" }] }] }, usage: [], model: "m" });
  await withApp({ scanSolveFn }, async ({ req }) => {
    const s = (await req("POST", "/api/students", { name: "Ana", settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "3. razred" } })).body;
    const c = (await req("POST", `/api/students/${s.id}/conversations`)).body;
    const sent = await req("POST", `/api/conversations/${c.id}/messages`, { text: "Koliko je 23 + 45?" });
    const done = JSON.parse(/event: done\ndata: (.*)\n/.exec(sent.text)[1]);
    assert.equal(done.ai_generated, true);
    const conv = (await req("GET", `/api/conversations/${c.id}`)).body;
    assert.deepEqual(conv.messages.map((m) => [m.role, m.ai_generated]), [["user", undefined], ["assistant", true]]);
    const sol = await req("POST", `/api/students/${s.id}/scan/solve`, { text: "x^2-4=0" });
    assert.equal(sol.status, 200);
    assert.equal(sol.body.ai_generated, true);
  });
});

test("tisk: strani z lekcijami in gradivi imajo meta oznako AI, pdfTemplateHash ostane enak (PDF-ji se ne izdelajo znova)", async () => {
  assert.match(AI_HEAD, /<meta name="ai-generated" content="true">/);
  assert.ok(AI_HEAD.includes(IPTC_AI));
  assert.ok(!shell("T", "C", "", 3).includes("ai-generated"), "lupina brez ai (in s tem pdfTemplateHash) je nespremenjena");
  assert.ok(shell("T", "C", "", 3, { ai: true }).includes(AI_HEAD));
  // Zgoščena vrednost predloge pred to spremembo (main 1ac517c7): oznaka v <head> ne spremeni PDF-jev.
  assert.equal(pdfTemplateHash(), "df45527bed788e2a");
  // Že objavljeni PDF-ji so brez oznake: različica oznake je v zgoščeni vrednosti vsakega PDF-ja (in sestave), zato
  // naslednji zagon »PDF učbenika« vse izdela znova enkrat (samo čas CI).
  assert.equal(PDF_AI_MARK_VERSION, 1);
  assert.equal(PDF_MERGE_VERSION, 2);
  assert.match(fs.readFileSync(path.join(ROOT, "server", "ucbenik-pdf.js"), "utf8"), /sha\(JSON\.stringify\(\[pdfTemplateHash\(\), id, x\.label, body, PDF_AI_MARK_VERSION\]\)\)/);
  await withApp({}, async ({ req }) => {
    const book = await req("GET", "/ucbenik/MAT-OS-8");
    assert.equal(book.status, 200);
    assert.ok(book.text.slice(0, book.text.indexOf("</head>")).includes(AI_HEAD));
    const sheet = await req("GET", "/ucbenik/MAT-OS-8/formule");
    assert.ok(!sheet.text.includes("ai-generated"), "list formul ni besedilo AI");
  });
});

const pypdf = spawnSync("python3", ["-I", "-c", "import pypdf"]).status === 0;
test("PDF učbenika: oznaka AI v Info in XMP ostane po qpdf in pri sestavljenem PDF-ju", { skip: pypdf ? false : "pypdf ni nameščen" }, async () => {
  const { markAiPdf, hasAiMeta, optimizePdf, mergePdfs } = require("../scripts/ucbenik-pdf.cjs");
  const dir = fs.mkdtempSync(path.join(ROOT, ".tmp-ai-oznaka-"));
  try {
    const src = path.join(dir, "a.pdf");
    const mk = spawnSync("python3", ["-I", "-c", "import sys\nfrom pypdf import PdfWriter\nw=PdfWriter()\nw.add_blank_page(200,200)\nw.add_metadata({'/Title':'Matematika & <8>'})\nw.write(sys.argv[1])", src]);
    assert.equal(mk.status, 0, String(mk.stderr));
    const buf = fs.readFileSync(src);
    const meta = { info: PDF_AI_INFO, xmp: PDF_AI_XMP };
    assert.equal(await hasAiMeta(buf), false);
    const marked = markAiPdf(buf, meta);
    assert.ok(marked && (await hasAiMeta(marked)));
    const small = optimizePdf(marked);
    if (small) assert.ok(await hasAiMeta(small), "qpdf ohrani oznako");
    assert.ok(await hasAiMeta(mergePdfs([marked, marked], "Skupaj", meta)), "sestavljen PDF");
    assert.equal(await hasAiMeta(mergePdfs([marked], "Brez")), false, "brez meta ni oznake (stara pot)");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}
test("brskalnik: obvestilo enkrat na profil (tudi brez localStorage), »Razumem« vrne fokus v polje, kopija z »— Evklid (AI)«", { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 }, async () => {
  await withApp({}, async ({ base }) => {
    const p = await chromium.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    try {
      await p.goto(base + "/healthz");
      const r = await p.evaluate(async (SL) => {
        document.head.innerHTML = "";
        document.body.innerHTML = '<div class="chat-head"><h1 id="chat-title">Nov</h1></div><div id="messages"><div class="msg assistant" data-ai-generated="true">Rešitev je 68.</div><div class="msg user">Koliko je 23 + 45?</div></div><form id="composer"><textarea id="input"></textarea><div class="ai-note" data-i18n="chat.aiNote">x</div></form>';
        localStorage.setItem("evklid.lang", "sl");
        const m = await import("/ai-oznaka/ai-oznaka.js");
        const out = {};
        const mladi = { educational_track: "OSNOVNA_SOLA", curriculum_level: "3. razred" };
        await m.oznaciKlepet({ id: 7, settings: mladi });
        await m.oznaciKlepet({ id: 7, settings: mladi });
        out.note = document.querySelector(".ai-note").textContent;
        out.i18n = document.querySelector(".ai-note").hasAttribute("data-i18n");
        out.uvod = document.querySelectorAll(".aio-uvod").length;
        out.znak = document.querySelectorAll(".aio-znak").length;
        out.naslov = document.querySelector(".aio-uvod strong").textContent;
        document.querySelector(".aio-uvod button").click();
        out.fokus = document.activeElement?.id;
        out.poKliku = document.querySelectorAll(".aio-uvod").length;
        await m.oznaciKlepet({ id: 7, settings: mladi });
        out.znova = document.querySelectorAll(".aio-uvod").length;
        await m.oznaciKlepet({ id: 8, settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik" } });
        out.drugi = document.querySelectorAll(".aio-uvod").length;
        out.noteStar = document.querySelector(".ai-note").textContent;
        document.querySelector(".aio-uvod button").click();
        // localStorage vrže (zasebno okno, polna shramba): obvestilo se pokaže in zapre brez napake
        const [g, s] = [Storage.prototype.getItem, Storage.prototype.setItem];
        Storage.prototype.getItem = () => { throw new Error("ni shrambe"); };
        Storage.prototype.setItem = () => { throw new Error("ni shrambe"); };
        try {
          await m.oznaciKlepet({ id: 9, settings: {} });
          out.brezShrambe = document.querySelectorAll(".aio-uvod").length;
          document.querySelector(".aio-uvod button").click();
          out.brezShrambePoKliku = document.querySelectorAll(".aio-uvod").length;
        } finally {
          [Storage.prototype.getItem, Storage.prototype.setItem] = [g, s];
        }
        // kopiranje: odgovor AI dobi oznako, učenčevo sporočilo ne
        const copy = (el) => {
          const range = document.createRange();
          range.selectNodeContents(el);
          getSelection().removeAllRanges();
          getSelection().addRange(range);
          const ev = new ClipboardEvent("copy", { clipboardData: new DataTransfer(), bubbles: true, cancelable: true });
          el.dispatchEvent(ev);
          return ev.clipboardData.getData("text/plain");
        };
        out.kopijaAi = copy(document.querySelector(".msg.assistant"));
        out.kopijaUcenec = copy(document.querySelector(".msg.user"));
        return out;
      }, SL);
      assert.equal(r.note, SL["aio.mlad"]);
      assert.equal(r.i18n, false);
      assert.deepEqual([r.uvod, r.znak], [1, 1], "dvakratni klic: eno obvestilo, en znak");
      assert.equal(r.naslov, SL["aio.uvodMlad"]);
      assert.equal(r.fokus, "input");
      assert.deepEqual([r.poKliku, r.znova, r.drugi], [0, 0, 1], "enkrat na profil");
      assert.equal(r.noteStar, SL["aio.star"]);
      assert.deepEqual([r.brezShrambe, r.brezShrambePoKliku], [1, 0]);
      assert.equal(r.kopijaAi, "Rešitev je 68.\n\n— Evklid (AI)");
      assert.equal(r.kopijaUcenec, "", "brez posega: brskalnik kopira sam (prazno v sintetičnem dogodku)");
      assert.deepEqual(errors, []);
    } finally {
      await p.close();
    }
  });
});
test.after(() => chromium?.close());
