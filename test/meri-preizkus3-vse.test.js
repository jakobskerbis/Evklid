// scripts/meri-preizkus3-vse.mjs: vseh 150 nalog Preizkusa 3 skozi pravo pot klepeta; naloge šifrirane
// (scripts/preizkus3-naloge.enc, scripts/preizkus3-sifra.mjs). Brez klicev API (--suho) in brez pravega ključa.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { sifriraj, odsifriraj, kljucIz, OBLIKA } from "../scripts/preizkus3-sifra.mjs";
import { normalizeSettings } from "../server/settings.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const skripta = path.join(root, "scripts/meri-preizkus3-vse.mjs");
const enc = fs.readFileSync(path.join(root, "scripts/preizkus3-naloge.enc"), "utf8");

// Izmišljene naloge v obliki prave datoteke (pravih besedil v repozitoriju ni).
const NALOGE = {
  naloge: [
    { id: 1, naslov: "Matematika · OŠ 3. razred · standardna", nastavitve: { educational_track: "OSNOVNA_SOLA", curriculum_level: "3. razred", subject: "MAT", solving_mode: "B" }, q: "Sem v 3. razredu osnovne šole.\nKoliko je 3 · 8 − 7?" },
    { id: 2, naslov: "Matematika · OŠ 9. razred · Vodenje", nastavitve: { educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred", subject: "MAT", solving_mode: "A" }, q: "Sem v 9. razredu osnovne šole.\nNe povej mi rešitve, samo vodi me. Reši 2x + 3 = 11.", odgovori: ["Odštejem 3 in dobim 2x = 14.", "Ne vem."] },
    { id: 3, naslov: "Matematika · fakulteta 1. letnik · standardna", nastavitve: { educational_track: "UNIVERZA", curriculum_level: "1. letnik", study_program: "UL-FRI-RI", study_course: "UNI-ULFRI-OMA", solving_mode: "B" }, q: "Sem študent 1. letnika.\nIzračunaj odvod funkcije x · e^x." },
  ],
};
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "p3-vse-"));
const datoteka = path.join(tmp(), "preizkus3-naloge.json");
fs.writeFileSync(datoteka, JSON.stringify(NALOGE));
const zagon = (a, env = {}) => {
  const cwd = tmp();
  const r = spawnSync(process.execPath, ["--disable-warning=ExperimentalWarning", skripta, ...a], {
    cwd,
    encoding: "utf8",
    timeout: 120000,
    env: { ...process.env, ANTHROPIC_API_KEY: "sk-ni-pravi", EVKLID_MOCK: "", PREIZKUS3_KLJUC: "", GITHUB_ACTIONS: "", ...env },
  });
  return { ...r, cwd };
};

test("šifra: AES-256-GCM z naključnim IV, glava z različico; napačen ključ, sprememba ali druga različica padejo", () => {
  const k = crypto.randomBytes(32);
  const a = sifriraj('{"x":"čšž"}', k);
  const b = sifriraj('{"x":"čšž"}', k);
  assert.notEqual(JSON.parse(a).iv, JSON.parse(b).iv, "naključen IV");
  assert.equal(odsifriraj(a, k), '{"x":"čšž"}');
  assert.deepEqual(Object.keys(JSON.parse(a)), ["oblika", "v", "alg", "iv", "tag", "data"]);
  assert.throws(() => odsifriraj(a, crypto.randomBytes(32)), /Odšifriranje ni uspelo/);
  const o = JSON.parse(a);
  const pokvarjen = Buffer.from(o.data, "base64");
  pokvarjen[0] ^= 1;
  assert.throws(() => odsifriraj(JSON.stringify({ ...o, data: pokvarjen.toString("base64") }), k), /Odšifriranje ni uspelo/);
  assert.throws(() => odsifriraj(JSON.stringify({ ...o, v: 2 }), k), /Neznana oblika/);
  assert.throws(() => kljucIz("abc"), /32 bajtov/);
  assert.equal(kljucIz(k.toString("base64")).length, 32);
});

test("preizkus3-naloge.enc: šifrirana, brez čistega besedila nalog; čisto besedilo v .gitignore", () => {
  const o = JSON.parse(enc);
  assert.equal(o.oblika, OBLIKA);
  assert.equal(o.v, 1);
  assert.equal(o.alg, "aes-256-gcm");
  assert.equal(Buffer.from(o.iv, "base64").length, 12);
  assert.ok(Buffer.from(o.data, "base64").length > 50000, "vseh 150 nalog");
  assert.doesNotMatch(enc, /razred|letnik|Reši|Ne vem/);
  assert.ok(!fs.existsSync(path.join(root, "scripts/preizkus3-naloge.json")), "čisto besedilo ni v repozitoriju");
  assert.match(fs.readFileSync(path.join(root, ".gitignore"), "utf8"), /^preizkus3-naloge\*\.json$/m);
});

// S pravim ključem (lokalno, ne v CI): vse naloge in nastavitve veljavne.
test("prave naloge (le s ključem PREIZKUS3_KLJUC): 150, Vodenje z dvema odgovoroma, nastavitve veljavne", { skip: !process.env.PREIZKUS3_KLJUC }, () => {
  const { naloge } = JSON.parse(odsifriraj(enc, kljucIz(process.env.PREIZKUS3_KLJUC)));
  assert.deepEqual(naloge.map((n) => n.id), Array.from({ length: 150 }, (_, i) => i + 1));
  assert.deepEqual(naloge.filter((n) => n.odgovori).map((n) => n.id), [6, 25, 40, 50, 93, 112]);
  for (const n of naloge) {
    assert.equal(n.nastavitve.solving_mode, n.odgovori ? "A" : "B", `naloga ${n.id}`);
    if (n.odgovori) assert.equal(n.odgovori.length, 2);
    const s = normalizeSettings(n.nastavitve);
    // Nastavitev, ki je normalizeSettings ne bi sprejel, bi tiho postala privzeta: vse morajo ostati.
    for (const [k, v] of Object.entries(n.nastavitve)) assert.equal(s[k], v, `naloga ${n.id}: ${k}`);
  }
});

test("brez ključa in brez --naloge-datoteka: jasna napaka, nič poklicano; napačen ključ tudi", () => {
  const r = zagon(["--suho"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Ni ključa PREIZKUS3_KLJUC/);
  const n = zagon(["--suho"], { PREIZKUS3_KLJUC: crypto.randomBytes(32).toString("base64") });
  assert.equal(n.status, 1);
  assert.match(n.stderr, /Odšifriranje ni uspelo/);
});

test("--suho z lokalno datoteko: brez klica (tudi s ključem API), Vodenje tri sporočila, izid brez besedil nalog", () => {
  const r = zagon(["--suho", "--naloge-datoteka", datoteka, "--hkrati", "2"]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /suho \(brez klicev\)/);
  assert.match(r.stdout, /Nalog: 3\/3 brez napake; odgovorov 5/);
  assert.match(r.stdout, /Strošek 0\.0000 \$/);
  const izhod = fs.readFileSync(path.join(r.cwd, "data/meri-preizkus3-vse.json"), "utf8");
  const d = JSON.parse(izhod);
  assert.equal(d.koncano, true);
  assert.equal(d.porabljeno, 0);
  assert.deepEqual(Object.keys(d.naloge), ["1", "2", "3"]);
  assert.equal(d.naloge["2"].out.length, 3, "Vodenje: naloga, napačen korak, »Ne vem.«");
  assert.equal(d.naloge["2"].nastavitve.solving_mode, "A");
  assert.equal(d.naloge["3"].nastavitve.study_course, "UNI-ULFRI-OMA");
  for (const v of Object.values(d.naloge)) for (const o of v.out) assert.ok(Number.isInteger(o.ms) && o.txt.length > 0 && !/<<|META/.test(o.txt));
  // Besedila nalog niso v izidu ne v dnevniku (le številke).
  for (const n of NALOGE.naloge)
    for (const t of [n.q, ...(n.odgovori || [])]) {
      assert.ok(!izhod.includes(JSON.stringify(t).slice(1, -1)), `izid: ${t.slice(0, 30)}`);
      assert.ok(!r.stdout.includes(t), `dnevnik: ${t.slice(0, 30)}`);
    }
});

test("--del: le izbrane naloge; ime profila »Učenec«", () => {
  const r = zagon(["--suho", "--naloge-datoteka", datoteka, "--del", "1-2"]);
  assert.equal(r.status, 0, r.stderr);
  const d = JSON.parse(fs.readFileSync(path.join(r.cwd, "data/meri-preizkus3-vse-1-2.json"), "utf8"));
  assert.deepEqual(Object.keys(d.naloge), ["1", "3"]);
  assert.match(fs.readFileSync(skripta, "utf8"), /const IME = "Učenec";/);
});

test("neveljavni argumenti končajo z 1 pred vsakim klicem; --kot-produkcija ne v GitHub Actions; brez ključa API tudi", () => {
  for (const a of [["--x"], ["--del", "3-2"], ["--del", "1/2"], ["--hkrati", "9"], ["--naloge", "0"], ["--naloge", "1,1"], ["--max-usd", "6"], ["--out", "/etc/x.json"], ["--max-usd=1"]]) {
    assert.equal(zagon(["--suho", "--naloge-datoteka", datoteka, ...a]).status, 1, a.join(" "));
  }
  const gh = zagon(["--suho", "--naloge-datoteka", datoteka, "--kot-produkcija"], { GITHUB_ACTIONS: "true" });
  assert.equal(gh.status, 1);
  assert.match(gh.stderr, /ni dovoljen v GitHub Actions/);
  assert.equal(zagon(["--suho", "--naloge-datoteka", datoteka, "--naloge", "1", "--kot-produkcija"]).status, 0, "lokalno dovoljen");
  const brez = zagon(["--naloge-datoteka", datoteka, "--naloge", "1"], { ANTHROPIC_API_KEY: "", ANTHROPIC_AUTH_TOKEN: "" });
  assert.equal(brez.status, 1);
  assert.match(brez.stderr, /Ni ključa API/);
});

test("okolje kot plačljivi paket: brez predpomnilnika, kartic, pregleda OŠ in tekmovalnega Opusa; ključ nalog se odstrani", () => {
  const src = fs.readFileSync(skripta, "utf8");
  assert.match(src, /arg\("(--)?max-usd"/); // isti vzorec kot korak »Skripta upošteva --max-usd« v meri.yml
  assert.match(src, /if \(SUHO\) \{\n\s+process\.env\.EVKLID_MOCK = "1";\n\s+delete process\.env\.ANTHROPIC_API_KEY;/);
  assert.match(src, /process\.env\.EVKLID_ANSWER_CACHE = "0";/);
  assert.match(src, /process\.env\.EVKLID_VERIFY_DAILY_USD = "0";/);
  assert.match(src, /delete process\.env\.EVKLID_VERIFY_MODELS;/);
  assert.match(src, /delete process\.env\.EVKLID_COMPETITION_DEEP;/);
  assert.match(src, /process\.env\.EVKLID_LIVE_REVIEW_OS = "0";/);
  assert.match(src, /const KLJUC = process\.env\.PREIZKUS3_KLJUC;\ndelete process\.env\.PREIZKUS3_KLJUC;/);
  // Okolje se nastavi pred uvozom strežnika.
  assert.ok(src.indexOf('EVKLID_VERIFY_DAILY_USD = "0"') < src.indexOf('await import("../server/app.js")'));
  for (const a of ["--del 1-2 --hkrati 4", "--del 2-2 --s-pregledom"]) assert.match(a, /^[a-z0-9 ,=.-]*$/); // polje »argumenti«
});
