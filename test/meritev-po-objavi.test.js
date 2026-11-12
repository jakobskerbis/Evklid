// Samodejna meritev po objavi (server/meritev-po-objavi.js): varovalke stroška AI brez klicev API.
// Zagon skripte je vstavljen (zagon), zato nič ne kliče modela.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  zaženi, odlociZagon, izberiIdje, idjiKroga, isoTeden, vklopljeno, porabaTedna, preberiStanje, nacrtujMeritevPoObjavi,
  vpisiVKnjigo, porabaKnjige,
  MAX_ZAGON_USD, MAX_TEDEN_USD, MAX_PRIMEROV, PONOVI,
} from "../server/meritev-po-objavi.js";

const KROG_MD = `# Spremembe\n\n## 2026-11-12: preverjevalec kartic\n\n- \`--samo NAPACNO/ne-sme\`\n\n## 2026-11-12: natančnost, krog 8 – x\n\n- Ponovna meritev: \`node scripts/primerjava-modelov.js --s-preverjanjem --samo KEM-OS-8/formule-spojin,KEM-OS-8/nekovine --ponovi 4\`.\n\n## 2026-11-11: natančnost, krog 7\n\n- \`--samo STARO/x\`\n`;

// Majhen repozitorij: dve lekciji, prompt in docs/spremembe-prompta.md.
function repo() {
  const root = fs.mkdtempSync(path.join(tmpdir(), "evklid-mpo-"));
  const w = (f, t) => (fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }), fs.writeFileSync(path.join(root, f), t));
  w("content/lessons/README.md", "format");
  w("content/lessons/MAT-OS-7/a.md", "a1");
  w("content/lessons/FIZ-OS-8/b.md", "b1");
  w("prompts/system_prompt.md", "p1");
  w("server/live-check.js", "l1");
  w("docs/spremembe-prompta.md", KROG_MD);
  return { root, w, file: path.join(root, "data", "meritev-po-objavi.json"), knjiga: path.join(root, "data", "meritve-strosek.jsonl") };
}

// Vstavljen zagon: zapiše izid s podanim stroškom (ali nič, kot ob sesutju) in si zapomni klice.
// Kot prava skripta vpiše strošek v knjigo ob izidu (path.dirname(izidFile)/../meritve-strosek.jsonl).
function lazniZagon(strosek, { code = 0, now = new Date("2026-11-12T10:00:00Z") } = {}) {
  const klici = [];
  const fn = async (o) => {
    klici.push(o);
    if (strosek) vpisiVKnjigo(path.join(path.dirname(o.izidFile), "..", "meritve-strosek.jsonl"), strosek, { now, vir: "po-objavi" });
    if (strosek != null) fs.writeFileSync(o.izidFile, JSON.stringify({ strosek_usd: strosek, ustavljeno_ob_meji: false, primeri: o.idji.map((id) => ({ id, pogoj: "s", od: 4, napaka: 0, manjsa_napaka: 1, pravilno: 3, razlogi: ["manjsa_napaka: x"] })) }));
    return { code };
  };
  fn.klici = klici;
  return fn;
}

const env = (commit) => ({ RENDER_GIT_COMMIT: commit });
const ura = (iso) => () => new Date(iso);
const vse = () => true;

test("vklop: le na Render z EVKLID_MERITEV_PO_OBJAVI=1 in ključem; nikoli lokalno, v CI, v testih ali v preizkusnem načinu", () => {
  const ok = { EVKLID_MERITEV_PO_OBJAVI: "1", RENDER: "true", ANTHROPIC_API_KEY: "sk" };
  assert.equal(vklopljeno(ok), true);
  assert.equal(vklopljeno({ ...ok, EVKLID_MERITEV_PO_OBJAVI: "0" }), false);
  assert.equal(vklopljeno({ ...ok, RENDER: "" }), false, "lokalno (ni RENDER)");
  assert.equal(vklopljeno({ ...ok, CI: "true" }), false);
  assert.equal(vklopljeno({ ...ok, GITHUB_ACTIONS: "true" }), false);
  assert.equal(vklopljeno({ ...ok, NODE_ENV: "test" }), false);
  assert.equal(vklopljeno({ ...ok, ANTHROPIC_API_KEY: "" }), false);
  assert.equal(vklopljeno(ok, { mock: true }), false);
  // Ta testni proces (brez RENDER) ne načrtuje ničesar.
  assert.equal(nacrtujMeritevPoObjavi({ env: { EVKLID_MERITEV_PO_OBJAVI: "1" } }), false);
});

test("teden ISO (UTC): ponedeljek–nedelja, prelom leta", () => {
  assert.equal(isoTeden(new Date("2026-11-12T10:00:00Z")), "2026-W46");
  assert.equal(isoTeden(new Date("2026-11-15T23:59:00Z")), "2026-W46");
  assert.equal(isoTeden(new Date("2026-11-16T00:00:00Z")), "2026-W47");
  assert.equal(isoTeden(new Date("2027-01-01T12:00:00Z")), "2026-W53");
  assert.equal(isoTeden(new Date("2027-01-04T00:00:00Z")), "2027-W01");
});

test("izbor: spremenjene lekcije, ob spremembi prompta zadnji krog natančnosti; le merljive, največ MAX_PRIMEROV", () => {
  assert.deepEqual(idjiKroga(KROG_MD), ["KEM-OS-8/formule-spojin", "KEM-OS-8/nekovine"]);
  assert.deepEqual(idjiKroga("# nič"), []);
  const krog = idjiKroga(KROG_MD);
  assert.deepEqual(izberiIdje([], { krog }), [], "nič spremenjenega → nič");
  assert.deepEqual(izberiIdje(["server/app.js", "public/app.js", "content/lessons/README.md", "docs/x.md"], { krog }), [], "nerelevantne datoteke → nič");
  assert.deepEqual(izberiIdje(["content/lessons/MAT-OS-7/a.md"], { krog }), ["MAT-OS-7/a"], "brez spremembe prompta ni kroga");
  assert.deepEqual(izberiIdje(["server/live-check.js"], { krog }), krog);
  assert.deepEqual(izberiIdje(["prompts/system_prompt.md", "content/lessons/KEM-OS-8/nekovine.md", "content/lessons/MAT-OS-7/a.md"], { krog }), [...krog, "MAT-OS-7/a"], "brez podvojenih");
  assert.deepEqual(izberiIdje(["content/lessons/MAT-OS-7/a.md", "content/lessons/FIZ-OS-8/b.md"], { merljiv: (id) => id !== "MAT-OS-7/a" }), ["FIZ-OS-8/b"], "nemerljive izpusti");
  const veliko = Array.from({ length: 10 }, (_, i) => `content/lessons/MAT-OS-7/l${i}.md`);
  assert.equal(izberiIdje(veliko).length, MAX_PRIMEROV);
});

test("odločitev: tedenska meja, en zagon na objavo, nič spremenjenega", () => {
  const t = "2026-W46";
  const idji = ["MAT-OS-7/a"];
  assert.equal(odlociZagon({}, { objava: "c1", teden: t, idji }).ok, true);
  assert.equal(odlociZagon({}, { objava: "c1", teden: t, idji: [] }).ok, false);
  assert.match(odlociZagon({ objave: ["c1"] }, { objava: "c1", teden: t, idji }).razlog, /že obdelana/);
  assert.equal(odlociZagon({ teden: t, porabljeno_usd: MAX_TEDEN_USD - MAX_ZAGON_USD }, { objava: "c2", teden: t, idji }).ok, true, "točno do meje sme");
  const nad = odlociZagon({ teden: t, porabljeno_usd: MAX_TEDEN_USD - MAX_ZAGON_USD + 0.01 }, { objava: "c2", teden: t, idji });
  assert.equal(nad.ok, false);
  assert.match(nad.razlog, /tedenska meja/);
  assert.equal(odlociZagon({ teden: "2026-W45", porabljeno_usd: 15 }, { objava: "c2", teden: t, idji }).ok, true, "nov teden začne pri 0");
  assert.equal(porabaTedna({ teden: "2026-W45", porabljeno_usd: 15 }, t), 0);
});

test("zaženi: prvi zagon le izhodišče; nato meri samo spremenjeno, z mejo 1 $ na zagon in pravim ukazom", async () => {
  const { root, w, file, knjiga } = repo();
  const zagon = lazniZagon(0.42);
  const o = { root, file, knjiga, merljiv: vse, zagon, log() {}, now: ura("2026-11-12T10:00:00Z") };
  let r = await zaženi({ ...o, env: env("c0") });
  assert.equal(r.ok, false);
  assert.match(r.razlog, /prvi zagon/);
  assert.equal(zagon.klici.length, 0);

  r = await zaženi({ ...o, env: env("c1") });
  assert.equal(r.ok, false, "nič spremenjenega → preskok");
  assert.match(r.razlog, /ni spremenila/);
  assert.equal(zagon.klici.length, 0);

  w("content/lessons/MAT-OS-7/a.md", "a2");
  r = await zaženi({ ...o, env: env("c2") });
  assert.equal(r.ok, true);
  assert.equal(zagon.klici.length, 1);
  assert.deepEqual(zagon.klici[0].idji, ["MAT-OS-7/a"]);
  assert.equal(zagon.klici[0].maxUsd, MAX_ZAGON_USD, "skripta dobi --max-usd 1");
  assert.equal(PONOVI, 4);
  const s = preberiStanje(file);
  assert.equal(s.porabljeno_usd, 0, "rezervacija 1 $ odpade, dejanski strošek je v knjigi");
  assert.equal(porabaKnjige(knjiga, "2026-W46"), 0.42);
  assert.equal(s.zgodovina[0].stanje, "končano");
  assert.equal(s.zgodovina[0].primeri[0].id, "MAT-OS-7/a");

  // Sprememba prompta → zadnji krog iz docs/spremembe-prompta.md (vstavljeni merljiv sprejme vse).
  w("prompts/system_prompt.md", "p2");
  r = await zaženi({ ...o, env: env("c3") });
  assert.deepEqual(zagon.klici[1].idji, ["KEM-OS-8/formule-spojin", "KEM-OS-8/nekovine"]);
});

test("zaženi: največ en zagon na objavo, tudi po ponovnem zagonu strežnika in če se je prvi sesul", async () => {
  const { root, w, file, knjiga } = repo();
  const zagon = lazniZagon(null, { code: 1 }); // sesutje brez izida
  const o = { root, file, knjiga, merljiv: vse, zagon, log() {}, now: ura("2026-11-12T10:00:00Z") };
  await zaženi({ ...o, env: env("c0") });
  w("content/lessons/FIZ-OS-8/b.md", "b2");
  assert.equal((await zaženi({ ...o, env: env("c1") })).ok, true);
  assert.equal((await zaženi({ ...o, env: env("c1") })).ok, false);
  assert.equal((await zaženi({ ...o, env: env("c1") })).ok, false);
  assert.equal(zagon.klici.length, 1);
  const s = preberiStanje(file);
  assert.equal(s.porabljeno_usd, MAX_ZAGON_USD, "brez izida ostane rezerviran cel 1 $");
  assert.equal(s.zgodovina.find((z) => z.objava === "c1").stanje, "napaka");
});

test("zaženi: tedenska meja 15 $ zavrne zagon pred klicem; nov teden spet dovoli", async () => {
  const { root, w, file, knjiga } = repo();
  const zagon = lazniZagon(1); // vsak zagon porabi cel 1 $
  const o = { root, file, knjiga, merljiv: vse, zagon, log() {} };
  await zaženi({ ...o, env: env("c0"), now: ura("2026-11-10T10:00:00Z") });
  for (let i = 1; i <= MAX_TEDEN_USD + 2; i++) {
    w("content/lessons/MAT-OS-7/a.md", `a${i}`);
    await zaženi({ ...o, env: env(`c${i}`), now: ura("2026-11-12T10:00:00Z") });
  }
  assert.equal(zagon.klici.length, MAX_TEDEN_USD, "15 zagonov po 1 $, nato zavrnjeno");
  const s = preberiStanje(file);
  assert.equal(s.porabljeno_usd, 0, "rezervacije so odpadle");
  assert.equal(porabaKnjige(knjiga, "2026-W46"), MAX_TEDEN_USD);
  assert.match(s.zgodovina[0].razlog, /tedenska meja/);
  w("content/lessons/MAT-OS-7/a.md", "nov teden");
  assert.equal((await zaženi({ ...o, env: env("c-nov"), now: ura("2026-11-16T08:00:00Z") })).ok, true);
  assert.equal(preberiStanje(file).porabljeno_usd, 0);
});

test("zaženi: prekinjen zagon (objava ustavi proces) šteje cel 1 $ v tedensko porabo", async () => {
  const { root, w, file, knjiga } = repo();
  const o = { root, file, knjiga, merljiv: vse, log() {}, now: ura("2026-11-12T10:00:00Z") };
  await zaženi({ ...o, env: env("c0"), zagon: lazniZagon(0) });
  w("content/lessons/MAT-OS-7/a.md", "a2");
  // Zagon, ki se nikoli ne konča (proces ustavljen med meritvijo): rezervacija je že zapisana.
  zaženi({ ...o, env: env("c1"), zagon: () => new Promise(() => {}) });
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(preberiStanje(file).porabljeno_usd, MAX_ZAGON_USD);
  w("content/lessons/MAT-OS-7/a.md", "a3");
  await zaženi({ ...o, env: env("c2"), zagon: lazniZagon(0.3) });
  const s = preberiStanje(file);
  assert.equal(s.zgodovina.find((z) => z.objava === "c1").stanje, "prekinjeno");
  assert.equal(s.porabljeno_usd, 1, "prekinjeni zagon: cel 1 $ ostane rezerviran");
  assert.equal(porabaKnjige(knjiga, "2026-W46"), 0.3);
});

test("zaženi: ročne meritve iz iste knjige štejejo v tedensko mejo 15 $", async () => {
  const { root, w, file, knjiga } = repo();
  const zagon = lazniZagon(0.5);
  const o = { root, file, knjiga, merljiv: vse, zagon, log() {}, now: ura("2026-11-12T10:00:00Z") };
  await zaženi({ ...o, env: env("c0") });
  // Ročni zagoni ta teden: 14,2 $ (zapisano po odgovorih) + en lanski teden, ki ne šteje.
  for (let i = 0; i < 142; i++) vpisiVKnjigo(knjiga, 0.1, { now: new Date("2026-11-11T09:00:00Z"), vir: "ročno" });
  vpisiVKnjigo(knjiga, 50, { now: new Date("2026-11-05T09:00:00Z"), vir: "ročno" });
  fs.appendFileSync(knjiga, '{"pretrgana vrst'); // pretrgana zadnja vrstica se izpusti
  assert.equal(Number(porabaKnjige(knjiga, "2026-W46").toFixed(4)), 14.2);
  w("content/lessons/MAT-OS-7/a.md", "a2");
  const r = await zaženi({ ...o, env: env("c1") });
  assert.equal(r.ok, false);
  assert.match(r.razlog, /tedenska meja: porabljeno 14\.20/);
  assert.equal(zagon.klici.length, 0);
  // Neberljiva knjiga (npr. mapa namesto datoteke) zavrne zagon.
  assert.equal(porabaKnjige(path.dirname(knjiga), "2026-W46"), Infinity);
  assert.equal(odlociZagon({}, { objava: "x", teden: "2026-W46", idji: ["a/b"], knjiga: Infinity }).ok, false);
});

test("zaženi: pokvarjeno stanje → ni zagona, datoteka ostane nespremenjena (ne izgubi tedenske porabe)", async () => {
  const { root, w, file, knjiga } = repo();
  const zagon = lazniZagon(0.5);
  const o = { root, file, knjiga, merljiv: vse, zagon, log() {}, now: ura("2026-11-12T10:00:00Z") };
  await zaženi({ ...o, env: env("c0") });
  w("content/lessons/MAT-OS-7/a.md", "a2");
  fs.writeFileSync(file, '{"teden":"2026-W46","porabljeno_usd":3,');
  const r = await zaženi({ ...o, env: env("c1") });
  assert.equal(r.ok, false);
  assert.match(r.razlog, /pokvarjeno/);
  assert.equal(zagon.klici.length, 0);
  assert.equal(fs.readFileSync(file, "utf8"), '{"teden":"2026-W46","porabljeno_usd":3,');
  assert.equal(preberiStanje(file), null);
  fs.writeFileSync(file, "[]");
  assert.equal(preberiStanje(file), null);
  assert.deepEqual(preberiStanje(path.join(root, "ni.json")), {}, "manjkajoča datoteka = prvi zagon (le izhodišče, brez stroška)");
});

test("GET /api/admin/meritev-po-objavi: skrbnik vidi povzetek (besedilo in JSON brez odtisov), drugi 403", async () => {
  const { root, w, file, knjiga } = repo();
  process.env.EVKLID_DB = path.join(path.dirname(file), "evklid.db");
  const o = { root, file, knjiga, merljiv: vse, log() {}, now: ura("2026-11-12T10:00:00Z") };
  await zaženi({ ...o, env: env("c0"), zagon: lazniZagon(0) });
  w("content/lessons/MAT-OS-7/a.md", "a2");
  await zaženi({ ...o, env: env("abc1234567890"), zagon: lazniZagon(0.5) });
  const { openDb } = await import("../server/db.js");
  const { createApp } = await import("../server/app.js");
  const app = createApp(openDb(":memory:"), { accounts: false, scheduler: false, backups: false });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}/api/admin/meritev-po-objavi`;
  try {
    const t = await fetch(base);
    assert.equal(t.status, 200);
    const besedilo = await t.text();
    assert.match(besedilo, /Meritev natančnosti po objavi/);
    assert.match(besedilo, /MAT-OS-7\/a: napaka 0, manjša 1, pravilno 3 od 4/);
    assert.match(besedilo, /0\.50 \$ od 15 \$/);
    const j = await (await fetch(`${base}?json=1`)).json();
    assert.equal(j.meja_zagon_usd, 1);
    assert.equal(j.meja_teden_usd, 15);
    assert.equal(j.odtisi, undefined);
    // Zahteva od zunaj (prek posrednika) brez skrbniškega računa: 403.
    const zunaj = await fetch(base, { headers: { "x-forwarded-for": "1.2.3.4" } });
    assert.equal(zunaj.status, 403);
  } finally {
    server.close();
    delete process.env.EVKLID_DB;
  }
});
