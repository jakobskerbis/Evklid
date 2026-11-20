// Slovenski glas strežnika za branje vprašanj na glas (j, 19. 11. 2026: »glas inštruktorja ne dela« – glas naprave
// slovenščine v Chromu, aplikaciji za Android in na iPhonu nima). Pot …/ustno/:sid/govor prebere samo vprašanje
// te seje ali dodatno vprašanje, ki ga je seja dobila; brez glasovnega strežnika 503 (odjemalec: glas naprave).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { glasUrl, govorMp3, MAX_GLAS } from "../server/govor.js";
import { REVIEW_SYSTEM } from "../server/ustno.js";

const OHM = "FIZ-OS-9/upor-in-ohmov-zakon";
const MP3 = Buffer.from([0xff, 0xf3, 0x44, 0xc4, 1, 2, 3, 4]);

async function local({ glasFn, followup = "" }, fn) {
  const said = [];
  const opts_ = [];
  const ustnoFn = async (p) => {
    const user = p.messages[0].content;
    const kps = [...user.matchAll(/^KP(\d+): /gm)].map((m) => Number(m[1]));
    const review = p.system === REVIEW_SYSTEM;
    const out = review ? { points: kps.map((kp) => ({ kp, status: "delno", quote: "" })) } : { points: kps.map((kp) => ({ kp, status: "manjka", quote: "" })), followup, feedback: "" };
    return { content: [{ type: "text", text: JSON.stringify(out) }], usage: { input_tokens: 10, output_tokens: 10 }, model: p.model, stop_reason: "end_turn" };
  };
  const store = openDb(":memory:");
  const opts = { scheduler: false, ustnoFn };
  if (glasFn) opts.glasFn = async (t, o) => (said.push(t), opts_.push(o), glasFn(t));
  const app = createApp(store, opts);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, body) => {
    const r = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const type = r.headers.get("content-type") || "";
    return { status: r.status, type, body: /json/.test(type) ? await r.json() : Buffer.from(await r.arrayBuffer()) };
  };
  try {
    const a = (await call("/api/students", { name: "Ana", grade: 9 })).body;
    const b = (await call("/api/students", { name: "Bor", grade: 9 })).body;
    await fn({ call, sid: a.id, other: b.id, said, opts: opts_ });
  } finally {
    server.close();
  }
}

test("glas strežnika prebere vprašanje seje (MP3), drugega besedila ne sprejme", async () => {
  await local({ glasFn: async () => MP3 }, async ({ call, sid, other, said }) => {
    const r = await call(`/api/students/${sid}/ustno/zacni`, { tema: OHM, n: 3, nacin: "tipkanje" });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const g = await call(`/api/students/${sid}/ustno/${r.body.id}/govor`, { i: 1, besedilo: "poljubno besedilo" });
    assert.equal(g.status, 200);
    assert.match(g.type, /audio\/mpeg/);
    assert.deepEqual(g.body, MP3);
    assert.deepEqual(said, [r.body.vprasanja[1].govor], "prebere besedilo vprašanja s strežnika, ne iz zahteve");
    assert.equal((await call(`/api/students/${sid}/ustno/${r.body.id}/govor`, { i: 9 })).status, 400);
    assert.equal((await call(`/api/students/${sid}/ustno/${r.body.id}/govor`, { i: "0" })).status, 200, "i kot niz števke");
    assert.equal((await call(`/api/students/${sid}/ustno/${r.body.id}/govor`, { i: 0, dodatno: true })).status, 400, "dodatnega vprašanja še ni");
    assert.equal((await call(`/api/students/${other}/ustno/${r.body.id}/govor`, { i: 0 })).status, 404, "tuja seja");
    // samoocena (brez AI) bere enako
    const so = await call(`/api/students/${sid}/ustno/samoocena`, { tema: OHM, n: 3 });
    assert.equal((await call(`/api/students/${sid}/ustno/${so.body.id}/govor`, { i: 0 })).status, 200);
  });
});

test("glas strežnika prebere dodatno vprašanje, ki ga je seja dobila", async () => {
  await local({ glasFn: async () => MP3, followup: "Kaj pa **enota** upora?" }, async ({ call, sid, said, opts }) => {
    const r = await call(`/api/students/${sid}/ustno/zacni`, { tema: OHM, n: 3, nacin: "tipkanje" });
    const i = r.body.vprasanja.findIndex((q) => q.vrsta !== "izracunaj");
    const a = await call(`/api/students/${sid}/ustno/${r.body.id}/odgovor`, { i, besedilo: "tok in napetost", nacin: "tipkanje" });
    assert.equal(a.status, 200, JSON.stringify(a.body));
    assert.ok(a.body.dodatno, "seja ima dodatno vprašanje");
    const g = await call(`/api/students/${sid}/ustno/${r.body.id}/govor`, { i, dodatno: true });
    assert.equal(g.status, 200);
    assert.equal(said.at(-1), "Kaj pa enota upora?", "brez ostankov markdowna");
    assert.deepEqual(opts.at(-1), { shrani: false }, "dodatno vprašanje (iz učenčevega odgovora) se ne shrani na disk");
    await call(`/api/students/${sid}/ustno/${r.body.id}/govor`, { i });
    assert.deepEqual(opts.at(-1), { shrani: true });
  });
});

test("brez glasovnega strežnika 503 (odjemalec uporabi glas naprave)", async () => {
  // napaka ali gneča: 503 brez code (odjemalec poskusi ob naslednjem branju znova)
  await local({ glasFn: async () => null }, async ({ call, sid }) => {
    const r = await call(`/api/students/${sid}/ustno/zacni`, { tema: OHM, n: 3, nacin: "tipkanje" });
    const g = await call(`/api/students/${sid}/ustno/${r.body.id}/govor`, { i: 0 });
    assert.equal(g.status, 503);
    assert.equal(g.body.code, undefined);
  });
  // ni nastavljen (EVKLID_GLAS_URL prazen): code »ni«, odjemalec v tem odprtju ne poskuša več
  const prej = process.env.EVKLID_GLAS_URL;
  delete process.env.EVKLID_GLAS_URL;
  try {
    await local({ glasFn: null }, async ({ call, sid }) => {
      const r = await call(`/api/students/${sid}/ustno/zacni`, { tema: OHM, n: 3, nacin: "tipkanje" });
      const g = await call(`/api/students/${sid}/ustno/${r.body.id}/govor`, { i: 0 });
      assert.equal(g.status, 503);
      assert.equal(g.body.code, "ni");
    });
  } finally {
    if (prej !== undefined) process.env.EVKLID_GLAS_URL = prej;
  }
});

test("govorMp3: naslov iz Renderja (ime:vrata), samo audio/mpeg, napaka → null", async () => {
  assert.equal(glasUrl("evklid-glas:10000"), "http://evklid-glas:10000");
  assert.equal(glasUrl("https://glas.example/"), "https://glas.example");
  assert.equal(glasUrl(""), null);
  assert.equal(await govorMp3("Kaj je upor?", { url: null }), null);
  const seen = [];
  const ok = async (u, o) => (seen.push([u, JSON.parse(o.body)]), new Response(MP3, { headers: { "Content-Type": "audio/mpeg" } }));
  assert.deepEqual(await govorMp3("  Kaj   je upor? ", { url: "http://g:1", fetchFn: ok }), MP3);
  assert.deepEqual(seen[0], ["http://g:1/govor", { besedilo: "Kaj je upor?" }]);
  await govorMp3("Dodatno?", { url: "http://g:1", fetchFn: ok, shrani: false });
  assert.deepEqual(seen.pop()[1], { besedilo: "Dodatno?", shrani: false });
  await govorMp3("x".repeat(5000), { url: "http://g:1", fetchFn: ok });
  assert.equal(seen[1][1].besedilo.length, MAX_GLAS);
  assert.equal(await govorMp3("x", { url: "http://g:1", fetchFn: async () => new Response("{}", { headers: { "Content-Type": "application/json" } }) }), null);
  assert.equal(await govorMp3("x", { url: "http://g:1", fetchFn: async () => new Response("", { status: 500 }) }), null);
  assert.equal(await govorMp3("x", { url: "http://g:1", fetchFn: async () => Promise.reject(new Error("ECONNREFUSED")) }), null);
});

test("odjemalec: glas strežnika najprej, glas naprave kot rezerva, en odklenjen <audio>", () => {
  const client = fs.readFileSync(path.join(import.meta.dirname, "..", "public", "ustno", "ustno.js"), "utf8");
  assert.match(client, /\/ustno\/\$\{run\.id\}\/govor/);
  assert.match(client, /deviceSpeak\(text, onNoVoice\)/);
  assert.match(client, /addEventListener\("click", unlock, true\)/);
  // obe mesti branja povesta, katero vprašanje seje se bere
  assert.equal((client.match(/live\(tt\("u\.niGlasu"\)\), \{ i: run\.i/g) || []).length, 2);
});

test("glasovni strežnik (Python) se prevede, render.yaml ga poveže z Evklidom", () => {
  const root = path.join(import.meta.dirname, "..");
  try {
    execFileSync("python3", ["-c", "import ast,sys\nfor f in sys.argv[1:]: ast.parse(open(f).read(), f)", "glas/streznik.py", "glas/prenesi.py"], { cwd: root, stdio: "pipe" });
  } catch (e) {
    if (e.code !== "ENOENT") throw new Error(String(e.stderr || e));
  }
  const yaml = fs.readFileSync(path.join(root, "render.yaml"), "utf8");
  assert.match(yaml, /type: pserv\n\s+name: evklid-glas/);
  assert.match(yaml, /key: EVKLID_GLAS_URL\n\s+fromService:\n\s+type: pserv\n\s+name: evklid-glas\n\s+property: hostport/);
  const prenesi = fs.readFileSync(path.join(root, "glas", "prenesi.py"), "utf8");
  assert.match(prenesi, /[0-9a-f]{64}/, "model preverjen z zgoščeno vrednostjo");
  // izbrani glas Supertonic se prenese ob gradnji
  const glas = /key: EVKLID_GLAS_GLAS[^\n]*\n\s+value: (\S+)/.exec(yaml)?.[1];
  assert.match(glas || "", /^[FM][1-5]$/);
  assert.ok(prenesi.includes(`"voice_styles/${glas}.json"`));
});
