// Meritev skenerja s fotografijami nalog (scripts/meri-skener.mjs, točka 27 načrta izboljšav): brez klicev API.
// Nabor slik (test/fixtures/sken/naloge.json) je veljaven in majhen, pričakovane rešitve so prave, samodejna ocena
// loči pravilne prepise od napačnih, --suho ne kliče modela, --preizkus pelje vse slike skozi prave poti skenerja (0 $),
// meritev se ustavi pred mejo stroška in sprejme mapo pravih fotografij v isti obliki.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { naloziNabor, oceniBesedilo, oceniRacun, oceniResitev, normalizirajBesedilo } from "../scripts/sken-ocena.mjs";
import { solve, satisfies } from "../public/scan/solvecore.js";

const env = { ...process.env, ANTHROPIC_API_KEY: "", EVKLID_DATA_KEY: "" };
const skripta = "scripts/meri-skener.mjs";
const nabor = naloziNabor();
const MAPA = nabor.mapa;
const tmpIzid = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), "evklid-skener-test-")), "izid.json");

test("sken: nabor ~20 slik, majhne slike JPEG brez EXIF, vsaka naloga se oceni sama s seboj", () => {
  const { slike } = nabor;
  assert.ok(slike.length >= 18 && slike.length <= 30, `${slike.length} slik`);
  assert.ok(slike.filter((s) => s.predmet === "FIZ").length >= 2 && slike.filter((s) => s.stopnja === "OŠ").length >= 2);
  assert.ok(slike.filter((s) => s.more).length >= 2 && slike.filter((s) => s.figure).length >= 3);
  let skupaj = 0;
  for (const s of slike) {
    const b = fs.readFileSync(path.join(MAPA, s.datoteka));
    skupaj += b.length;
    assert.ok(b.length <= 150_000, `${s.datoteka}: ${b.length} B`);
    assert.equal(b.readUInt16BE(0), 0xffd8, `${s.datoteka}: JPEG`);
    assert.equal(b.indexOf("Exif"), -1, `${s.datoteka}: brez EXIF`);
    for (const n of [s, ...(s.ostale || [])]) {
      assert.equal(oceniBesedilo(n.besedilo, n.besedilo).ok, true, `${s.id}: ${n.besedilo}`);
      assert.equal(oceniRacun(n, { text: n.racun || (n.podatki || []).join(" "), given: n.podatki }).ok, true, `${s.id}: ${n.racun}`);
    }
  }
  assert.ok(skupaj < 4 * 1024 * 1024, `skupaj ${skupaj} B`);
  // Vse slike v mapi so v naboru (nič odvečnega v javnem repozitoriju).
  const vMapi = fs.readdirSync(MAPA).filter((f) => f !== "naloge.json");
  assert.deepEqual(vMapi.sort(), slike.map((s) => s.datoteka).sort());
});

test("sken: pričakovane rešitve so prave (vstavljanje v enačbo, lastni reševalnik)", () => {
  let preverjenih = 0;
  for (const s of nabor.slike) {
    for (const n of [s, ...(s.ostale || [])]) {
      if (!n.racun || !n.resitev || /=\s*\?$/.test(n.racun)) continue;
      // Enačba z eno neznanko: vsaka pričakovana rešitev jo reši.
      if (/^[^;<>]*=[^;<>]*$/.test(n.racun) && /x/.test(n.racun) && n.resitev.every((r) => !/[\[(]?.*,/.test(r) && !/i$/.test(r))) {
        for (const r of n.resitev) {
          const x = Function(`return ${r.replace(/pi/g, "Math.PI")}`)();
          assert.equal(satisfies(n.racun, { x }), true, `${s.id}: x = ${r}`);
          preverjenih++;
        }
      }
      // Kar zna lastni reševalnik, mora oceniti kot pravilno.
      const r = solve(n.racun, { goal: n.goal || null, complex: true });
      if (r.ok) {
        assert.equal(oceniResitev(n, { answer_tex: r.answer.tex }), true, `${s.id}: ${r.answer.tex}`);
        preverjenih++;
      }
    }
  }
  assert.ok(preverjenih >= 12, `${preverjenih} preverjenih`);
});

test("sken: ocena prepisa loči pravilne zapise od napačnih", () => {
  const b = "Reši enačbo $2x^2 - 3x - 5 = 0$.";
  assert.equal(oceniBesedilo(b, "Reši enačbo $2x^{2}-3x-5=0$.").ok, true);
  assert.equal(oceniBesedilo(b, "4. Reši enačbo 2x² − 3x − 5 = 0").ok, true);
  assert.equal(oceniBesedilo(b, "Reši enačbo $2x^2 - 3x - 6 = 0$.").ok, false, "napačno število");
  assert.equal(oceniBesedilo(b, "Reši enačbo $2x^2 + 3x - 5 = 0$.").ok, false, "napačen predznak");
  assert.equal(oceniBesedilo(b, "$2x^2 - 3x - 5 = 0$").ok, false, "brez navodila");
  const k = "Reši enačbo $\\sqrt{x + 7} = x + 1$.";
  assert.equal(oceniBesedilo(k, "Reši enačbo √(x+7) = x+1.").ok, true);
  assert.equal(oceniBesedilo(k, "Reši enačbo $x + 7 = x + 1$.").ok, false, "brez korena");
  const f = "Grelnik z močjo $2\\ \\mathrm{kW}$ segreva $1{,}5\\ \\mathrm{kg}$ vode od $20\\ ^\\circ\\mathrm{C}$ do $80\\ ^\\circ\\mathrm{C}$.";
  assert.equal(oceniBesedilo(f, "Grelnik z močjo $2$ kW segreva $1,5$ kg vode od $20\\,^{\\circ}$C do $80^\\circ$C.").ok, true);
  assert.equal(oceniBesedilo(f, "Grelnik z močjo 2 kW segreva 15 kg vode od 20 °C do 80 °C.").ok, false, "izgubljena decimalna vejica");
  assert.equal(normalizirajBesedilo("$\\dfrac{2}{3} \\cdot x \\le 1$"), "\\frac 2 3 · x ≤ 1");
  assert.equal(oceniBesedilo("na intervalu $[0, 2\\pi)$", "na intervalu $[0,2\\pi)$").ok, true);
});

test("sken: ocena branja zaslona Skeniraj (zapis kalkulatorja, enakovredni zapisi, podatki)", () => {
  const n = { racun: "2*x^2-3*x-5=0" };
  assert.equal(oceniRacun(n, { text: "2x^2-3x-5=0" }).ok, true);
  assert.equal(oceniRacun(n, { text: "0=2*x^2-3*x-5" }).ok, true);
  assert.equal(oceniRacun(n, { text: "2*x^2-3*x+5=0" }).ok, false);
  assert.equal(oceniRacun({ racun: "x^2-2*x-8<=0" }, { text: "x^2-2x-8<=0" }).ok, true);
  assert.equal(oceniRacun({ racun: "x^2-2*x-8<=0" }, { text: "x^2-2x-8<0" }).ok, false, "stroga neenačba");
  assert.equal(oceniRacun({ racun: "x^2*e^x", goal: "derivative" }, { text: "f(x)=x^2*e^x", goal: "derivative" }).ok, true);
  assert.equal(oceniRacun({ racun: "3*x-2*y=4;x+y=3" }, { text: "x+y=3; 3x-2y=4" }).ok, true);
  const w = { racun: "s=?", podatki: ["2.5", "8"] };
  assert.equal(oceniRacun(w, { text: "s=?", given: ["a = 2{,}5\\ \\mathrm{m/s^2}", "t = 8\\ \\mathrm{s}"] }).ok, true);
  assert.equal(oceniRacun(w, { text: "s=?", given: ["a = 2{,}5\\ \\mathrm{m/s^2}"] }).ok, false, "manjka podatek");
});

test("sken: ocena rešitve (rešitve, odvečna rešitev, interval, kompleksno, fizika z zaokroževanjem)", () => {
  const k = { racun: "sqrt(x+7)=x+1", resitev: ["2"] };
  assert.equal(oceniResitev(k, { solutions: ["2"], answer_tex: "x = 2" }), true);
  assert.equal(oceniResitev(k, { solutions: ["2", "-3"], answer_tex: "x_1 = 2,\\ x_2 = -3" }), false, "lažna rešitev");
  const q = { racun: "2*x^2-3*x-5=0", resitev: ["-1", "5/2"] };
  assert.equal(oceniResitev(q, { solutions: ["x=-1", "x=2.5"] }), true);
  assert.equal(oceniResitev(q, { solutions: ["1", "-5/2"] }), false);
  const t = { racun: "2*sin(x)-1=0", resitev: ["pi/6", "5*pi/6"] };
  assert.equal(oceniResitev(t, { answer_tex: "x_1 = \\frac{\\pi}{6},\\quad x_2 = \\frac{5\\pi}{6}" }), true);
  assert.equal(oceniResitev(t, { solutions: ["pi/6+2*k*pi", "5*pi/6+2*k*pi"], answer_tex: "x = \\frac{\\pi}{6} + 2k\\pi" }), false, "splošna rešitev namesto intervala");
  assert.equal(oceniResitev({ racun: "x^2-2*x-8<=0", resitev: ["[-2,4]"] }, { answer_tex: "x \\in \\left[-2, 4\\right]" }), true);
  assert.equal(oceniResitev({ racun: "x^2-2*x-8<=0", resitev: ["[-2,4]"] }, { answer_tex: "x \\in (-2, 4)" }), false);
  assert.equal(oceniResitev({ racun: "(3+4*i)/(1-2*i)", resitev: ["-1+2i"] }, { value: "-1 + 2*i", answer_tex: "-1 + 2i" }), true);
  assert.equal(oceniResitev({ racun: "f(x)=?", resitev: ["(x-1)^2-4"] }, { answer_tex: "f(x) = (x - 1)^2 - 4" }), true);
  assert.equal(oceniResitev({ racun: "f(x)=?", resitev: ["(x-1)^2-4"] }, { answer_tex: "f(x) = (x + 1)^2 - 4" }), false);
  const g = { racun: "t=?", resitev: ["189"], toleranca: 0.005 };
  assert.equal(oceniResitev(g, { answer_tex: "t \\approx 189\\ \\mathrm{s}" }), true);
  assert.equal(oceniResitev(g, { answer_tex: "t = 378\\ \\mathrm{s}" }), false);
  assert.equal(oceniResitev({ racun: "alpha=?", resitev: ["22.62"], toleranca: 0.002 }, { answer_tex: "\\alpha \\approx 22{,}62^\\circ" }), true);
  assert.equal(oceniResitev({ racun: "x^3-2*x^2-9*x+18", goal: "factor", resitev: ["(x-2)*(x-3)*(x+3)"] }, { value: "(x-2)*(x-3)*(x+3)" }), true);
  assert.equal(oceniResitev({ racun: "x=?", resitev: ["400"] }, null), null);
});

test("meri-skener: --suho brez klica; neveljavni argumenti končajo z 1", () => {
  const suho = spawnSync(process.execPath, [skripta, "--suho"], { encoding: "utf8", env });
  assert.equal(suho.status, 0, suho.stderr);
  assert.match(suho.stdout, new RegExp(`^${nabor.slike.length} slik iz test/fixtures/sken; prepis claude-haiku`));
  const vse = Number(/za vse ([\d.]+) \$/.exec(suho.stdout)?.[1]);
  assert.ok(vse > 3 && vse < 10, `najslabši primer ${vse} $`);
  assert.doesNotMatch(suho.stdout, /IZID/);
  assert.match(spawnSync(process.execPath, [skripta, "--suho", "--naloge", "s01-kvadratna,f03-vezje"], { encoding: "utf8", env }).stdout, /^2 slik/);
  for (const slab of [["--max-usd", "9"], ["--max-usd", "0"], ["--max-usd=1"], ["--nacin", "chat"], ["--naloge", "s99"], ["--naloge", "s01-kvadratna,s01-kvadratna"], ["--naloge"], ["--mapa", os.tmpdir()]]) {
    const r = spawnSync(process.execPath, [skripta, "--suho", ...slab], { encoding: "utf8", env });
    assert.equal(r.status, 1, slab.join(" "));
    assert.match(r.stderr, /Nič ni bilo poklicano/, slab.join(" "));
  }
});

test("meri-skener --preizkus: vse slike skozi prave poti skenerja (0 $), ocena v datoteki in dnevniku", () => {
  const out = tmpIzid();
  const r = spawnSync(process.execPath, [skripta, "--preizkus"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out }, timeout: 180000 });
  assert.equal(r.status, 0, r.stderr + r.stdout.slice(-500));
  const izid = JSON.parse(fs.readFileSync(out, "utf8"));
  const n = nabor.slike.length;
  assert.equal(izid.koncano, true);
  assert.equal(izid.ustavljeno, false);
  assert.equal(izid.porabljeno, 0);
  assert.equal(izid.izid.length, n);
  for (const x of izid.izid) {
    assert.deepEqual(x.napake, [], x.id);
    assert.equal(x.ocena.prepis.ok && x.ocena.prepis.figure && x.ocena.prepis.more && x.ocena.prepis.tasks, true, x.id);
    assert.equal(x.ocena.branje.prva.ok, true, x.id);
    assert.equal(x.ocena.resitev.pravilno, true, x.id);
  }
  // Lastni reševalnik reši, kar zna (0 $); ostalo gre k AI kot na zaslonu Skeniraj.
  const lokalno = izid.izid.filter((x) => x.resitev.vir === "lastni reševalnik").map((x) => x.id);
  assert.ok(lokalno.includes("s01-kvadratna") && lokalno.includes("o01-ulomki"));
  assert.equal(izid.izid.find((x) => x.id === "s02-koren").resitev.vir, "AI");
  const m = /ODGOVORI-ZACETEK\n(.*)\nODGOVORI-KONEC/.exec(r.stdout);
  assert.ok(m, "izid v dnevniku");
  assert.equal(JSON.parse(m[1]).length, n);
  assert.doesNotMatch(m[1], /base64/, "brez slik v dnevniku");
  assert.match(r.stdout, new RegExp(`IZID: ${n}/${n} slik; Inštruktor \\(prepis\\) ${n}/${n} pravilnih`));
});

test("meri-skener: ustavi se pred mejo stroška in zapiše ustavljeno", () => {
  const out = tmpIzid();
  const r = spawnSync(process.execPath, [skripta, "--preizkus", "--max-usd", "0.001"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out }, timeout: 60000 });
  assert.equal(r.status, 1, r.stdout.slice(-500));
  const izid = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.equal(izid.ustavljeno, true);
  assert.equal(izid.izid.length, 0);
  assert.match(r.stdout, /s01-kvadratna: prepis ustavljeno pred mejo 0.001 \$/);
  // Prepis (Haiku) gre pod mejo, branje (Sonnet) ne: ustavi se pred branjem prve slike, prepis ostane v izidu.
  const out2 = tmpIzid();
  const r2 = spawnSync(process.execPath, [skripta, "--preizkus", "--max-usd", "0.01"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out2 }, timeout: 60000 });
  assert.equal(r2.status, 0, r2.stdout.slice(-500));
  const izid2 = JSON.parse(fs.readFileSync(out2, "utf8"));
  assert.equal(izid2.ustavljeno, true);
  assert.equal(izid2.izid.length, 1);
  assert.equal(izid2.izid[0].branje, null);
  assert.match(r2.stdout, /s01-kvadratna: branje ustavljeno pred mejo 0.01 \$/);
});

test("meri-skener --mapa: mapa pravih fotografij v isti obliki (naloge.json)", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-skener-mapa-"));
  const izbor = nabor.slike.filter((s) => ["s05-neenacba", "f01-pospesek"].includes(s.id)).map((s) => ({ ...s, datoteka: `${s.id}-telefon.jpg` }));
  for (const s of izbor) fs.copyFileSync(path.join(MAPA, s.datoteka.replace("-telefon", "")), path.join(dir, s.datoteka));
  fs.writeFileSync(path.join(dir, "naloge.json"), JSON.stringify({ opis: "preizkus", slike: izbor }));
  const out = tmpIzid();
  const r = spawnSync(process.execPath, [skripta, "--preizkus", "--mapa", dir], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out }, timeout: 60000 });
  assert.equal(r.status, 0, r.stderr + r.stdout.slice(-500));
  assert.match(r.stdout, /IZID: 2\/2 slik/);
  // Neveljaven nabor: napaka pred vsakim klicem.
  fs.writeFileSync(path.join(dir, "naloge.json"), JSON.stringify({ slike: [{ ...izbor[0], more: true }] }));
  const slab = spawnSync(process.execPath, [skripta, "--suho", "--mapa", dir], { encoding: "utf8", env });
  assert.equal(slab.status, 1);
  assert.match(slab.stderr, /more mora biti true natanko pri tasks > 1/);
  fs.rmSync(dir, { recursive: true, force: true });
});

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = require("playwright").chromium;
  if (!fs.existsSync(chromium.executablePath())) chromium = null;
} catch {}
test("sken-fotografije --mapa: prave fotografije pripravi kot aplikacija (≤ 1600 px, brez EXIF)", { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-sken-prave-"));
  const s = { ...nabor.slike[0] };
  // JPEG z vstavljenim segmentom EXIF (APP1) za oznako SOI: priprava ga mora odstraniti.
  const jpg = fs.readFileSync(path.join(MAPA, s.datoteka));
  const exif = Buffer.concat([Buffer.from([0xff, 0xe1, 0x00, 0x10]), Buffer.from("Exif\0\0GPS-test")]);
  fs.writeFileSync(path.join(dir, "telefon.jpg"), Buffer.concat([jpg.subarray(0, 2), exif, jpg.subarray(2)]));
  fs.writeFileSync(path.join(dir, "naloge.json"), JSON.stringify({ opis: "preizkus", slike: [{ ...s, datoteka: "telefon.jpg" }] }));
  const r = spawnSync(process.execPath, ["scripts/sken-fotografije.mjs", "--mapa", dir], { encoding: "utf8", timeout: 110000 });
  assert.equal(r.status, 0, r.stderr + r.stdout);
  const pripravljene = path.join(dir, "pripravljene");
  const n = naloziNabor(pripravljene);
  assert.equal(n.slike[0].datoteka, `${s.id}.jpg`);
  const izhod = fs.readFileSync(path.join(pripravljene, n.slike[0].datoteka));
  assert.equal(izhod.readUInt16BE(0), 0xffd8);
  assert.equal(izhod.indexOf("Exif"), -1);
  assert.equal(izhod.indexOf("GPS-test"), -1);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("sken: ocena odgovorov AI z enotami, predznakom, sistemom in obliko", () => {
  const vse = nabor.slike.flatMap((s) => [[s.id, s], ...(s.ostale || []).map((o, i) => [`${s.id}#${i + 1}`, o])]);
  const n = (id) => vse.find(([i]) => i === id)[1];
  const prav = [
    ["s15-odstotki", { answer_tex: "x = 400\\ \\text{€}" }],
    ["o03-trapez", { answer_tex: "S = 32\\ \\mathrm{cm}^2" }],
    ["s07-trikotnik", { answer_tex: "\\alpha \\approx 22{,}62^\\circ" }],
    ["f03-vezje", { answer_tex: "I = 2\\ \\mathrm{A}" }],
    ["s15-odstotki", { answer_tex: "c = 400\\ €" }],
    ["o03-trapez", { answer_tex: "P = 32\\ \\mathrm{cm}^2" }],
    ["s06-dve-nalogi", { answer_tex: "(x, y) = (2, 1)" }],
    ["s06-dve-nalogi", { solutions: ["x=2; y=1"] }],
    ["s16-razstavi", { value: "(x-2)*(x-3)*(x+3)" }],
    ["s06-dve-nalogi#1", { value: "(x-3)/x" }],
  ];
  const narobe = [
    ["s02-koren", { answer_tex: "x = -2" }],
    ["s11-integral", { value: "-6", answer_tex: "-6" }],
    ["f03-vezje", { answer_tex: "I = -2\\ \\mathrm{A}" }],
    ["f03-vezje", { answer_tex: "I = 0{,}5\\ \\mathrm{A}, R = 2\\ \\Omega" }],
    ["s06-dve-nalogi", { answer_tex: "x = 1,\\ y = 2" }],
    ["s06-dve-nalogi", { answer_tex: "x = 21,\\ y = 10" }],
    ["s06-dve-nalogi", { answer_tex: "x = 2,\\ y = 1/2" }],
    ["s16-razstavi", { value: "x^3-2*x^2-9*x+18" }],
    ["s06-dve-nalogi#1", { value: "(x^2-9)/(x^2+3*x)" }],
    ["s15-odstotki", { answer_tex: "x = 408\\ €" }],
    ["s12-trigonometrija", { solutions: ["pi/6+2*k*pi", "5*pi/6+2*k*pi"] }],
  ];
  for (const [id, d] of prav) assert.equal(oceniResitev(n(id), d), true, `${id} ${JSON.stringify(d)}`);
  for (const [id, d] of narobe) assert.equal(oceniResitev(n(id), d), false, `${id} ${JSON.stringify(d)}`);
});
