// Priprava na test PR 5: načrtovalnik (server/priprava/nacrt.js) – dnevni načrt do testa iz izkazanega znanja,
// brez AI in brez napovedi ocen; pot …/priprave/:pid/nacrt.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { sestaviNacrt, enoteTeme, ocenaTeme, NA_DAN, BREZ_DATUMA_DNI, NAJVEC_RAZMIK } from "../server/priprava/nacrt.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const tema = (id, ocena, o = {}) => ({ id, ime: id, sklop: "S", red: Number(id.replace(/\D/g, "")) || 0, izsekov: 1, ocena, vaja: true, danesNalog: 0, ...o });
const vseNaloge = (n) => n.dnevi.flatMap((d) => d.naloge.map((x) => ({ ...x, datum: d.datum })));

test("enote po izkazanem znanju; ocena teme kot pripravljenost na izpit", () => {
  assert.deepEqual(enoteTeme(tema("t1", 0)), ["nova", "vaja", "ponovitev"]);
  assert.deepEqual(enoteTeme(tema("t1", 0.4)), ["vaja", "ponovitev"]);
  assert.deepEqual(enoteTeme(tema("t1", 0.8)), ["ponovitev"]);
  assert.deepEqual(enoteTeme(tema("t1", 1)), []);
  assert.deepEqual(enoteTeme(tema("t1", 0, { vaja: false })), ["zapiski"]);
  assert.equal(ocenaTeme(null, "2026-12-01 00:00:00"), 0);
  assert.equal(ocenaTeme({ status: "learning", level: 2 }, "x"), 0.4);
  assert.equal(ocenaTeme({ status: "mastered", review_due: "2026-11-01 00:00:00" }, "2026-12-01 00:00:00"), 0.8);
  assert.equal(ocenaTeme({ status: "mastered", review_due: "2026-12-31 00:00:00" }, "2026-12-01 00:00:00"), 1);
  // Samo označeno kot obvladano (ni izkazano) in zgrešena zadnja ponovitev nista obvladano.
  assert.equal(ocenaTeme({ status: "mastered", source: "manual", review_due: "2026-12-31 00:00:00" }, "2026-12-01 00:00:00"), 0.4);
  assert.equal(ocenaTeme({ status: "mastered", source: "practice", review_failed: 1, review_due: "2026-12-31 00:00:00" }, "2026-12-01 00:00:00"), 0.6);
});

test("načrt do testa: najšibkejše prve, razmik med enotami, največ NA_DAN na dan, poskusni test zadnji dan", () => {
  const n = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-11", teme: [tema("t1", 1), tema("t2", 0), tema("t3", 0.4), tema("t4", 0.8)] });
  assert.equal(n.dni, 10);
  assert.equal(n.dnevi[0].datum, "2026-12-01");
  assert.equal(n.dnevi.at(-1).datum, "2026-12-10");
  assert.ok(n.dnevi.every((d) => d.naloge.length <= NA_DAN + (d === n.dnevi.at(-1) ? 1 : 0)));
  assert.deepEqual(n.dnevi.at(-1).naloge.map((x) => x.vrsta), ["poskusni_test"]);
  // Obvladana tema dobi samo osvežitev v zadnjih OSVEZITEV_DNI učnih dneh; nova ima tri enote, razmaknjene vsaj za dan
  // in vse pred poskusnim testom.
  const vse = vseNaloge(n);
  assert.deepEqual(vse.filter((x) => x.tema?.id === "t1").map((x) => [x.vrsta, x.datum >= "2026-12-07" && x.datum < "2026-12-10"]), [["ponovitev", true]]);
  const t2 = vse.filter((x) => x.tema?.id === "t2");
  assert.deepEqual(t2.map((x) => x.vrsta), ["nova", "vaja", "ponovitev"]);
  assert.ok(t2[0].datum < t2[1].datum && t2[1].datum < t2[2].datum);
  // Prvi dan začne z najšibkejšo temo.
  assert.equal(n.naslednja.tema.id, "t2");
  assert.equal(n.stisnjeno, false);
  assert.deepEqual(n.pripravljenost, { odstotek: Math.round((100 * (1 + 0 + 0.4 + 0.8)) / 4), obvladanih: 1, preverljivih: 4, nepreverljivih: 0 });
});

test("premalo časa: vsaka šibka tema pride na vrsto, odpadejo poznejše enote; brez datuma en teden; test mimo", () => {
  const teme = Array.from({ length: 8 }, (_, i) => tema(`t${i + 1}`, 0));
  const n = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-04", teme });
  assert.equal(n.dni, 3);
  assert.equal(n.stisnjeno, true);
  const prve = vseNaloge(n).filter((x) => x.vrsta === "nova").map((x) => x.tema.id);
  // 2 učna dneva × 3 = 6 mest: šest tem dobi novo snov, dve ne prideta na vrsto.
  assert.equal(prve.length, 6);
  assert.ok(n.nePrideNaVrsto.some((x) => x.tema.id === "t8" && x.vrsta === "nova"));
  assert.ok(!vseNaloge(n).some((x) => x.vrsta === "vaja" && !prve.includes(x.tema.id)), "vaja brez nove snovi ne pride v načrt");
  const brez = sestaviNacrt({ danes: "2026-12-01", teme: [tema("t1", 0)] });
  assert.equal(brez.dni, BREZ_DATUMA_DNI);
  assert.ok(!vseNaloge(brez).some((x) => x.vrsta === "poskusni_test"));
  const mimo = sestaviNacrt({ danes: "2026-12-05", datum: "2026-12-01", teme: [tema("t1", 0)] });
  assert.equal(mimo.mimo, true);
  assert.deepEqual(mimo.dnevi, []);
  assert.equal(mimo.naslednja, null);
});

test("razmiki veljajo med dnevi: vaja po razmiku od zadnje vaje, ponovitev po Evklidu, dolg rok konča blizu testa", () => {
  // Tema v učenju, vadena včeraj: vaja ne danes, ampak čez razmik; tema, vadena danes, je danes (opravljena).
  const n = sestaviNacrt({
    danes: "2026-12-01",
    datum: "2026-12-21",
    teme: [tema("t1", 0.2, { zadnjic: "2026-11-30" }), tema("t2", 0.2, { zadnjic: "2026-12-01", danesNalog: 3 }), tema("t3", 1, { ponovitev: "2026-12-05" })],
  });
  const vse = vseNaloge(n);
  const t1 = vse.filter((x) => x.tema?.id === "t1");
  assert.ok(t1[0].datum > "2026-12-01" && t1[0].vrsta === "vaja", JSON.stringify(t1));
  assert.deepEqual(n.dnevi[0].naloge.find((x) => x.tema?.id === "t2"), { vrsta: "vaja", tema: n.dnevi[0].naloge.find((x) => x.tema?.id === "t2").tema, opravljeno: true });
  // Obvladana tema: ponovitev na dan Evklidove ponovitve.
  assert.deepEqual(vse.filter((x) => x.tema?.id === "t3").map((x) => x.datum), ["2026-12-05"]);
  // Dolg rok (90 dni): razmik največ NAJVEC_RAZMIK dni, obvladane teme se osvežijo v zadnjem tednu.
  const d = sestaviNacrt({ danes: "2026-12-01", datum: "2027-03-01", teme: [tema("a1", 0), tema("a2", 1)] });
  const a1 = vseNaloge(d).filter((x) => x.tema?.id === "a1").map((x) => x.datum);
  for (let i = 1; i < a1.length; i++) assert.ok((Date.parse(a1[i]) - Date.parse(a1[i - 1])) / 86400000 <= NAJVEC_RAZMIK, a1.join());
  assert.ok(vseNaloge(d).some((x) => x.tema?.id === "a2" && x.datum >= "2027-02-25"));
  // En sam učni dan (test jutri): najprej utrjevanje tem v učenju, nova snov za njimi.
  const jutri = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-02", poskusniTest: false, teme: [tema("n1", 0), tema("n2", 0), tema("n3", 0), tema("l1", 0.4)] });
  assert.equal(jutri.dnevi[0].naloge[0].tema.id, "l1");
  // Z načrtom testa je dan pred testom poskusni test, kot so ga kazali prejšnji dnevi.
  const zadnji = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-02", teme: [tema("n1", 0), tema("m1", 1)] });
  assert.deepEqual(zadnji.dnevi[0].naloge.map((x) => x.vrsta), ["poskusni_test"]);
  assert.equal(zadnji.stisnjeno, false);
  // Test danes: nič ne »ne pride na vrsto«.
  const danes = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-01", teme: [tema("n1", 0)] });
  assert.equal(danes.stisnjeno, false);
  assert.deepEqual(danes.nePrideNaVrsto, []);
});

test("osvežitev obvladane teme enkrat in samo v prostor, ki ostane; današnja opravljena enota ostane v »Danes«", () => {
  // Test 5. 12., poskusni test 4. 12.: osvežitev 1. 12.; vadena 1. 12. → 2. 12. je ni več.
  const m = (o) => tema("m1", 1, o);
  const d1 = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-05", teme: [m()] });
  assert.deepEqual(vseNaloge(d1).filter((x) => x.tema).map((x) => x.vrsta), ["ponovitev"]);
  const d2 = sestaviNacrt({ danes: "2026-12-02", datum: "2026-12-05", teme: [m({ zadnjic: "2026-12-01" })] });
  assert.deepEqual(vseNaloge(d2).filter((x) => x.tema), []);
  // Neobvezne osvežitve ne izrinejo obveznih enot šibkih tem.
  const sibke = Array.from({ length: 6 }, (_, i) => tema(`a${i + 1}`, 0));
  const obvl = Array.from({ length: 9 }, (_, i) => tema(`m${i + 10}`, 1));
  const n = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-10", teme: [...sibke, ...obvl] });
  const brez = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-10", teme: sibke });
  assert.deepEqual(n.nePrideNaVrsto, brez.nePrideNaVrsto);
  // Tema, danes ponovljena in spet obvladana, ostane danes kot opravljena; druge enote se ne premaknejo v danes.
  const pred = [0, 1, 2, 3].map((i) => tema(`p${i}`, 0.8));
  const prej = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-10", teme: pred });
  const potem = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-10", teme: pred.map((t, i) => (i === 0 ? { ...t, ocena: 1, zadnjic: "2026-12-01", danesNalog: 2 } : t)) });
  assert.deepEqual(potem.dnevi[0].naloge.map((x) => x.tema.id), prej.dnevi[0].naloge.map((x) => x.tema.id));
  assert.equal(potem.dnevi[0].naloge.find((x) => x.tema.id === "p0").opravljeno, true);
});

test("zapiski: največ ena enota na dan, za preverljivimi; prebrani ne pridejo znova", () => {
  const teme = [tema("z1", 0, { vaja: false }), tema("z2", 0, { vaja: false }), tema("z3", 0, { vaja: false }), tema("a", 0.6), tema("b", 0.8)];
  const n = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-08", teme });
  const prvi = n.dnevi[0].naloge;
  assert.equal(prvi.filter((x) => x.vrsta === "zapiski").length, 1);
  assert.ok(prvi.some((x) => x.tema.id === "a") && prvi.some((x) => x.tema.id === "b"), JSON.stringify(prvi));
  assert.equal(prvi.at(-1).vrsta, "zapiski");
  assert.notEqual(n.naslednja.vrsta, "zapiski");
  const p = sestaviNacrt({ danes: "2026-12-02", datum: "2026-12-08", teme: teme.map((t) => (t.id === "z1" ? { ...t, prebrano: "2026-12-01" } : t)) });
  assert.ok(!vseNaloge(p).some((x) => x.tema?.id === "z1"));
  const d = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-08", teme: teme.map((t) => (t.id === "z1" ? { ...t, prebrano: "2026-12-01" } : t)) });
  assert.equal(d.dnevi[0].naloge.find((x) => x.tema.id === "z1")?.opravljeno, true);
});

test("danes opravljeno po rešenih nalogah; tema brez nalog je »zapiski« in ne šteje v pripravljenost", () => {
  const n = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-08", teme: [tema("t1", 0.4, { danesNalog: 3 }), tema("t2", 0.2), tema("t3", 0, { vaja: false })] });
  const danes = n.dnevi[0].naloge;
  assert.equal(danes.find((x) => x.tema.id === "t1").opravljeno, true);
  assert.equal(danes.find((x) => x.tema.id === "t2").opravljeno, false);
  assert.equal(n.naslednja.tema.id, "t2");
  assert.ok(vseNaloge(n).some((x) => x.tema?.id === "t3" && x.vrsta === "zapiski"));
  assert.equal(n.pripravljenost.preverljivih, 2);
  assert.equal(n.pripravljenost.nepreverljivih, 1);
});

test("API: načrt iz obsega testa in rešenih nalog (vaja, ne test); označeno ni izkazano; prebrano; tuj profil 404", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { log() {}, info() {}, warn() {}, error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (method, p, body) => {
    const r = await fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: await r.json() };
  };
  try {
    const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "4. letnik", educational_track: "SREDNJA_SOLA", subject: "MAT" } })).body;
    const datum = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
    const p = (await req("POST", `/api/students/${s.id}/priprave`, { naslov: "Integrali", predmet: "MAT", datum_testa: datum })).body.priprava;
    const zap = fs.readFileSync(new URL("./fixtures/priprava/mat-integrali.md", import.meta.url), "utf8");
    assert.equal((await req("POST", `/api/students/${s.id}/priprave/${p.id}/viri`, { besedilo: zap })).status, 201);
    store.db.prepare("UPDATE priprave SET pot = 'MAT-SS-4', sklopi = '[2]' WHERE id = ?").run(p.id);
    // Določeni integral je obvladan (izkazano z nalogami): samo osvežitev pred testom. Per partes je le označen kot
    // obvladan (ni izkazano): ostane v načrtu in ne šteje med obvladane.
    const vpis = store.db.prepare(
      "INSERT INTO topic_state (student_id, topic_id, level, streak, status, source, mastered_at, review_due) VALUES (?, ?, 3, 3, 'mastered', ?, datetime('now'), datetime('now', '+30 days'))",
    );
    vpis.run(s.id, "MAT-SS-4/doloceni-integral", "practice");
    vpis.run(s.id, "MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij", "manual");
    // Naloge testa danes ne štejejo kot vaja teme.
    const naloga = store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, solved, mode) VALUES (?, 'MAT-SS-4/nedoloceni-integral', 1, '{}', 1, ?)");
    for (let i = 0; i < 3; i++) naloga.run(s.id, "test");
    const r = await req("GET", `/api/students/${s.id}/priprave/${p.id}/nacrt`);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.obsegIzNacrta, true);
    const vse = r.body.dnevi.flatMap((d) => d.naloge.filter((x) => x.tema).map((x) => ({ ...x, datum: d.datum })));
    const ids = vse.map((x) => x.tema.id);
    assert.ok(ids.includes("MAT-SS-4/nedoloceni-integral"));
    assert.ok(ids.includes("MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij"));
    assert.deepEqual(vse.filter((x) => x.tema.id === "MAT-SS-4/doloceni-integral").map((x) => x.vrsta), ["ponovitev"]);
    assert.equal(r.body.pripravljenost.obvladanih, 1);
    assert.equal(r.body.dnevi[0].naloge.find((x) => x.tema?.id === "MAT-SS-4/nedoloceni-integral").opravljeno, false);
    // Ročna oznaka se potrdi z nalogami po oznaki (2 pravilni ponovitvi).
    const pp = "MAT-SS-4/integracija-per-partes-in-racionalnih-funkcij";
    const ponovi = store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, solved, mode, first_try_correct, created_at) VALUES (?, ?, 1, '{}', 1, 'review', ?, datetime('now', '+1 second'))");
    ponovi.run(s.id, pp, 1);
    ponovi.run(s.id, pp, 1);
    assert.equal((await req("GET", `/api/students/${s.id}/priprave/${p.id}/nacrt`)).body.pripravljenost.obvladanih, 2);
    // Zgrešena ponovitev: 0,6, dokler je tema spet pravilno rešena.
    ponovi.run(s.id, pp, 0);
    assert.equal((await req("GET", `/api/students/${s.id}/priprave/${p.id}/nacrt`)).body.pripravljenost.obvladanih, 1);
    store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, solved, mode, first_try_correct, created_at) VALUES (?, ?, 1, '{}', 1, 'practice', 1, datetime('now', '+1 second'))").run(s.id, pp);
    assert.equal((await req("GET", `/api/students/${s.id}/priprave/${p.id}/nacrt`)).body.pripravljenost.obvladanih, 2);
    // Vaja danes šteje.
    for (let i = 0; i < 3; i++) naloga.run(s.id, "practice");
    const r2 = await req("GET", `/api/students/${s.id}/priprave/${p.id}/nacrt`);
    assert.equal(r2.body.dnevi[0].naloge.find((x) => x.tema?.id === "MAT-SS-4/nedoloceni-integral").opravljeno, true);
    // Prebrano: samo tema iz načrta te priprave.
    assert.equal((await req("POST", `/api/students/${s.id}/priprave/${p.id}/nacrt/prebrano`, { tema_id: "MAT-OS-8/pitagorov-izrek" })).status, 400);
    assert.equal((await req("POST", `/api/students/${s.id}/priprave/${p.id}/nacrt/prebrano`, { tema_id: "MAT-SS-4/doloceni-integral" })).status, 200);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM priprava_prebrano WHERE priprava_id = ?").get(p.id).n, 1);
    assert.equal((await req("POST", `/api/students/${s.id}/priprave/${p.id}/nacrt/prebrano`, { tema_id: "MAT-SS-4/doloceni-integral", prebrano: false })).status, 200);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM priprava_prebrano WHERE priprava_id = ?").get(p.id).n, 0);
    // Priprava ni aktivna (ni načrta testa iz urnika): brez poskusnega testa.
    assert.ok(!r.body.dnevi.some((d) => d.naloge.some((x) => x.vrsta === "poskusni_test")));
    const tuj = (await req("POST", "/api/students", { name: "Ana", settings: {} })).body;
    assert.equal((await req("GET", `/api/students/${tuj.id}/priprave/${p.id}/nacrt`)).status, 404);
    assert.equal((await req("POST", `/api/students/${tuj.id}/priprave/${p.id}/nacrt/prebrano`, { tema_id: "MAT-SS-4/doloceni-integral" })).status, 404);
  } finally {
    await new Promise((r) => server.close(r));
    store.db.close();
  }
});
