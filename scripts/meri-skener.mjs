// Meritev skenerja s fotografijami nalog (točka 27 načrta izboljšav, j 19. 11. 2026). Prej je bila meritev skenerja le
// simulacija brez pravega klica AI; tu gre vsaka slika iz test/fixtures/sken/ (ali --mapa s pravimi fotografijami, ista
// oblika naloge.json, scripts/sken-ocena.mjs) skozi PRAVE poti skenerja v aplikaciji (server/app.js v istem procesu,
// začasna baza, samo 127.0.0.1), z vsemi varovali kot v produkciji:
//   1. POST /scan/read-task (kamera v Inštruktorju, readTaskPhoto, Haiku): prepis naloge in zastavice figure/more/tasks;
//   2. POST /scan/read (zaslon Skeniraj, readMathPhoto, Sonnet): naloge v zapisu kalkulatorja;
//   3. prvo prebrano nalogo reši kot zaslon Skeniraj (public/scan/scan.js solveNow): najprej lastni reševalnik
//      (public/scan/solvecore.js, 0 $), šele ko ga ne zna, POST /scan/solve (solveWithAi s preverjanjem verifyAiFull).
// Prepise oceni samodejno (scripts/sken-ocena.mjs): besedilo (vsa števila in operacije, besede), figure/more/tasks,
// branje prve in vseh nalog, ali je rešitev pravilna in ali jo je preverila koda.
// Ne piše v pravo bazo in ne v docs/. Pred vsakim klicem rezervira najslabši strošek klica (kot poti v server/scan.js,
// server/meje-ai.js imageCallReserveUsd / callMaxUsd) in se ustavi, preden bi strošek presegel --max-usd.
//   node scripts/meri-skener.mjs [--max-usd 2] [--naloge s01-kvadratna,f03-vezje] [--mapa <mapa>] [--suho] [--preizkus]
//   --naloge    samo te slike (id iz naloge.json), npr. za drugi del meritve
//   --mapa      mapa z naloge.json in slikami (privzeto test/fixtures/sken; prave fotografije: scripts/sken-fotografije.mjs --mapa)
//   --suho      samo ocena najslabšega stroška, brez klica modela (0 $)
//   --preizkus  preizkusni prepisi iz naloge.json namesto modela (samo brez ključa API), za test poti in ocene (0 $)
// Zagon: GitHub Actions > Meritev, skripta scripts/meri-skener.mjs. Izid: data/meri-skener.json (artefakt »meritev«) in
// v dnevniku med vrsticama ODGOVORI-ZACETEK in ODGOVORI-KONEC (lastne naloge, brez slik in brez osebnih podatkov).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const arg = (name, d) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : d;
};
const ZNANI = { "--max-usd": 1, "--naloge": 1, "--mapa": 1, "--suho": 0, "--preizkus": 0 };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!(a in ZNANI) || (ZNANI[a] && (process.argv[i + 1] === undefined || process.argv[i + 1].startsWith("--")))) {
    console.error(`Neznan ali nepopoln argument »${a}« (dovoljeni: ${Object.keys(ZNANI).join(", ")}; vrednost za presledkom, ne z =). Nič ni bilo poklicano.`);
    process.exit(1);
  }
  i += ZNANI[a];
}
const MAX_USD = Number(arg("--max-usd", 2));
const SUHO = process.argv.includes("--suho");
const PREIZKUS = process.argv.includes("--preizkus");
const OUT = process.env.EVKLID_MERI_IZID || "data/meri-skener.json";
if (!(MAX_USD > 0) || MAX_USD > 5) {
  console.error("--max-usd mora biti večji od 0 in največ 5. Nič ni bilo poklicano.");
  process.exit(1);
}

const { naloziNabor, PRIVZETA_MAPA, oceniBesedilo, oceniRacun, oceniResitev, najblizja } = await import("./sken-ocena.mjs");
let nabor;
try {
  nabor = naloziNabor(arg("--mapa") || PRIVZETA_MAPA);
} catch (e) {
  console.error(`${e.message}\nNič ni bilo poklicano.`);
  process.exit(1);
}
let slike = nabor.slike;
if (arg("--naloge")) {
  const ids = arg("--naloge").split(",");
  const ni = ids.filter((id) => !slike.some((s) => s.id === id));
  if (ni.length || new Set(ids).size !== ids.length) {
    console.error(`--naloge: ${ni.length ? `ni slik ${ni.join(", ")}` : "id se ponovi"} (id iz naloge.json, ločeni z vejico). Nič ni bilo poklicano.`);
    process.exit(1);
  }
  slike = ids.map((id) => slike.find((s) => s.id === id));
}

// Okolje pred uvozom aplikacije: začasna baza (nikoli prava).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-skener-"));
process.env.EVKLID_DB = path.join(tmp, "meritev.db");
// Preverjanje kartic v ozadju ni del skenerja: izklopljeno, da ostane pod mejo.
process.env.EVKLID_VERIFY_DAILY_USD = "0";
// Brez mesečnega proračuna (server/proracun.js budgetMode), kot pri drugih meritvah.
process.env.EVKLID_MONTHLY_BUDGET_USD = "0";
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");
const { isMockMode, MODEL, MODEL_MID } = await import("../server/claude.js");
const { callMaxUsd, imageCallReserveUsd } = await import("../server/meje-ai.js");
const { READ_PROMPT, TASK_READ_PROMPT, readLangLine } = await import("../server/scan.js");
const { normalizeSettings } = await import("../server/settings.js");
const { solve, prep } = await import("../public/scan/solvecore.js");
const { soughtNeedsAi } = await import("../public/scan/odgovor.js");
const { jeOs } = await import("../public/stopnja.js");

// Modeli in rezerve kot v server/scan.js (READ_MODEL, SOLVE_MODEL, TASK_READ_MODEL; rezerve v mountScan).
const izOkolja = (k, d) => (process.env[k] === undefined || process.env[k] === "" ? d : process.env[k]);
const MODELI = { prepis: izOkolja("EVKLID_SCAN_TUTOR_MODEL", MODEL), branje: izOkolja("EVKLID_SCAN_MODEL", MODEL_MID), resevanje: izOkolja("EVKLID_SCAN_SOLVE_MODEL", MODEL_MID) };
const bajti = (s) => Buffer.byteLength(String(s ?? ""), "utf8");
const REZERVA = {
  prepis: imageCallReserveUsd(MODELI.prepis, 1200, 1, bajti(TASK_READ_PROMPT) + 300),
  // Navodila branja + vrstica jezika (v poti je v rezervi 500 bajtov prostora zanjo).
  branje: imageCallReserveUsd(MODELI.branje, 2000, 1, bajti(READ_PROMPT) + 500 + bajti(readLangLine("sl"))),
  // Do dva klica (ponovitev ob napačni rešitvi), vsak z navodili, nalogo in podatki ter do 8000 izhodnimi žetoni.
  resevanje: (body) => 2 * callMaxUsd(MODELI.resevanje, 6000 + bajti(body.text + (body.given || []).join("") + (body.sought || "")), 8000),
};
// Najslabši primer slike: največja naloga (600 znakov), 10 podatkov po 160 znakov in iskano.
const RESEVANJE_NAJVEC = REZERVA.resevanje({ text: "x".repeat(600), given: Array(10).fill("x".repeat(160)), sought: "x".repeat(160) });
const naSliko = REZERVA.prepis + REZERVA.branje + RESEVANJE_NAJVEC;
console.log(
  `${slike.length} slik iz ${path.relative(process.cwd(), nabor.mapa) || nabor.mapa}; prepis ${MODELI.prepis}, branje ${MODELI.branje}, reševanje ${MODELI.resevanje}; ` +
    `najslabši primer na sliko ${naSliko.toFixed(3)} $ (prepis ${REZERVA.prepis.toFixed(4)}, branje ${REZERVA.branje.toFixed(3)}, reševanje ${RESEVANJE_NAJVEC.toFixed(3)}), ` +
    `za vse ${(naSliko * slike.length).toFixed(2)} $; meja ${MAX_USD} $.`,
);
if (SUHO) process.exit(0);
if (PREIZKUS !== isMockMode()) {
  console.error(PREIZKUS ? "--preizkus deluje samo brez ključa API (sicer bi klical pravi model). Nič ni bilo poklicano." : "Ni ključa API (preizkusni način; GitHub Actions: manjka skrivnost ANTHROPIC_API_KEY).");
  process.exit(1);
}

const slikaB64 = (s) => fs.readFileSync(path.join(nabor.mapa, s.datoteka)).toString("base64");
const vrstaSlike = (s) => (/\.png$/i.test(s.datoteka) ? "image/png" : /\.webp$/i.test(s.datoteka) ? "image/webp" : "image/jpeg");
const vseNaloge = (s) => [s, ...(s.ostale || [])];

// --preizkus: namesto modela vrne pričakovano iz naloge.json (pot, rezerve in ocena tečejo kot sicer, 0 $).
function preizkusneFunkcije() {
  const poSliki = new Map(slike.map((s) => [slikaB64(s), s]));
  const poRacunu = new Map(slike.flatMap(vseNaloge).filter((n) => n.racun).map((n) => [prep(n.racun), n]));
  return {
    scanReadTaskFn: async ({ imageBase64 }) => {
      const s = poSliki.get(imageBase64);
      return { text: s.besedilo, figure: s.figure, more: s.more, tasks: s.tasks, usage: null, model: MODELI.prepis };
    },
    scanReadFn: async ({ imageBase64 }) => ({
      problems: vseNaloge(poSliki.get(imageBase64)).map((n) => ({ text: n.racun || (n.podatki || []).join("*"), tex: "", goal: n.goal || null, ...(n.racun && /=\s*\?$/.test(n.racun) ? { given: n.podatki } : {}) })),
      usage: null,
      model: MODELI.branje,
    }),
    scanSolveFn: async ({ text }) => {
      const n = poRacunu.get(text);
      if (!n?.resitev) return { solution: null, usage: [], model: MODELI.resevanje };
      const enacba = /=/.test(n.racun) && !/=\s*\?$/.test(n.racun);
      const solution = { kind: "other", variable: "x", problem_tex: "", answer_tex: n.resitev.join(", "), solutions: enacba ? n.resitev : [], value: n.resitev.length === 1 ? n.resitev[0] : "", methods: [{ name: "preizkus", steps: [{ title: "preizkus", tex: "", why: "" }] }], verified: false, check: null };
      return { solution, usage: [], model: MODELI.resevanje };
    },
  };
}

const store = openDb(process.env.EVKLID_DB);
// Brez opravil v ozadju in samo na 127.0.0.1: strežnik s pravim ključem ni dosegljiv od drugod.
const server = createApp(store, { scheduler: false, ...(PREIZKUS ? preizkusneFunkcije() : {}) }).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;
const porabljeno = () => store.db.prepare("SELECT COALESCE(SUM(cost_usd), 0) AS s FROM usage").get().s;
// Klic, ki še teče (npr. odjemalec je obupal po 300 s, strežnik pa še čaka na model), ima rezervo v ai_holds: šteje.
const vTeku = () => store.db.prepare("SELECT COALESCE(SUM(usd), 0) AS s FROM ai_holds").get().s;
async function post(pot, body) {
  const res = await fetch(`${base}${pot}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${String(out.error || "").slice(0, 200)}`);
  return out;
}
const nastavitve = (s) =>
  normalizeSettings(
    s.stopnja === "OŠ"
      ? { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT", solving_mode: "A" }
      : { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik OR", subject: s.predmet, solving_mode: "A" },
  );

class Ustavi extends Error {}
const izid = [];
let ustavljeno = false;
// Rezervira najslabši strošek klica: če ne gre pod mejo, se meritev ustavi pred klicem.
function rezerviraj(usd, kaj, id) {
  if (porabljeno() + vTeku() + usd > MAX_USD) {
    ustavljeno = true;
    console.log(`${id}: ${kaj} ustavljeno pred mejo ${MAX_USD} $ (porabljeno ${porabljeno().toFixed(4)} $, rezerva ${usd.toFixed(4)} $)`);
    throw new Ustavi();
  }
}

async function meriSliko(s, x) {
  const st = store.createStudent("Ana", nastavitve(s)); // nov učenec za vsako sliko: dnevne meje ne vplivajo
  const image = `data:${vrstaSlike(s)};base64,${slikaB64(s)}`;
  const zacetek = porabljeno();
  // 1. kamera v Inštruktorju
  rezerviraj(REZERVA.prepis, "prepis", s.id);
  try {
    const t = await post(`/api/students/${st.id}/scan/read-task`, { image });
    x.prepis = { text: t.text || "", figure: !!t.figure, more: !!t.more, tasks: t.tasks || 1, ...(t.unrelated ? { unrelated: true } : {}) };
    x.ocena.prepis = { ...oceniBesedilo(s.besedilo, x.prepis.text), figure: x.prepis.figure === s.figure, more: x.prepis.more === s.more, tasks: x.prepis.tasks === s.tasks };
  } catch (e) {
    x.napake.push(`prepis: ${e.message}`);
  }
  // 2. zaslon Skeniraj
  rezerviraj(REZERVA.branje, "branje", s.id);
  let problems = [];
  try {
    problems = (await post(`/api/students/${st.id}/scan/read`, { image })).problems || [];
    x.branje = problems;
    const naloge = vseNaloge(s);
    x.ocena.branje = {
      stevilo: problems.length,
      pricakovano: naloge.length,
      prva: problems.length ? oceniRacun(s, problems[0]) : null,
      vse: naloge.filter((n) => problems.some((p) => oceniRacun(n, p).ok)).length,
    };
  } catch (e) {
    x.napake.push(`branje: ${e.message}`);
  }
  // 3. rešitev prve prebrane naloge, kot jo pokaže zaslon Skeniraj
  const p = problems[0];
  if (p) {
    const { n, i } = najblizja(s, p);
    const nast = st.settings || nastavitve(s);
    const complex = !jeOs(nast) || /SŠ|faks/i.test(nast.curriculum_level || "");
    let r = p.given?.length ? { ok: false, goals: [] } : solve(p.text, { goal: p.goal, complex });
    if (soughtNeedsAi(r, { sought: p.sought, goal: p.goal })) r = { ok: false, goals: r.goals || [] };
    if (r.ok) {
      const dobljeno = { answer_tex: r.answer?.tex || "" };
      x.resitev = { vir: "lastni reševalnik", answer_tex: dobljeno.answer_tex, preverjeno: !!r.verified };
      x.ocena.resitev = { naloga: i, pravilno: oceniResitev(n, dobljeno), preverjeno: !!r.verified };
    } else {
      const goal = r.goal || p.goal || null;
      const text = prep(p.text);
      const body = goal === "zeros" ? { text: `${text}=0`, goal: "solve" } : { text, goal };
      if (p.given?.length) body.given = p.given;
      if (p.sought) body.sought = p.sought;
      rezerviraj(REZERVA.resevanje(body), "reševanje", s.id);
      try {
        const { solution } = await post(`/api/students/${st.id}/scan/solve`, body);
        x.resitev = { vir: "AI", answer_tex: solution.answer_tex || "", solutions: solution.solutions || [], value: solution.value || "", preverjeno: !!solution.verified, check: solution.check || null };
        x.ocena.resitev = { naloga: i, pravilno: oceniResitev(n, solution), preverjeno: !!solution.verified };
      } catch (e) {
        x.napake.push(`reševanje: ${e.message}`);
        x.ocena.resitev = { naloga: i, pravilno: n.resitev ? false : null, preverjeno: false };
      }
    }
  }
  x.usd = Math.round((porabljeno() - zacetek) * 1e5) / 1e5;
}

const zapisi = (koncano) => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ datum: new Date().toISOString(), modeli: MODELI, mapa: path.relative(process.cwd(), nabor.mapa), porabljeno: porabljeno(), ustavljeno, koncano, izid }, null, 1));
};
for (const s of slike) {
  const x = { id: s.id, prepis: null, branje: null, resitev: null, ocena: {}, napake: [], usd: 0 };
  try {
    await meriSliko(s, x);
  } catch (e) {
    if (!(e instanceof Ustavi)) x.napake.push(String(e?.message || e).slice(0, 200));
  }
  if (x.prepis || x.branje || x.napake.length) izid.push(x);
  if (x.prepis || x.branje) {
    const o = x.ocena;
    console.log(
      `${s.id}: prepis ${o.prepis ? (o.prepis.ok ? "OK" : `ne (števila ${o.prepis.stevila}, operacije ${o.prepis.operatorji}, besede ${o.prepis.besede})`) : "–"}` +
        `${o.prepis ? `, slika ${o.prepis.figure ? "OK" : "ne"}, več ${o.prepis.more && o.prepis.tasks ? "OK" : "ne"}` : ""}; ` +
        `branje ${o.branje ? `${o.branje.prva?.ok ? "OK" : "ne"} (${o.branje.vse}/${o.branje.pricakovano} nalog)` : "–"}; ` +
        `rešitev ${o.resitev ? `${o.resitev.pravilno === null ? "brez pričakovane" : o.resitev.pravilno ? "pravilna" : "NAPAČNA"} (${x.resitev?.vir || "napaka"}${o.resitev.preverjeno ? ", preverjena" : ""})` : "–"}; ` +
        `${x.usd.toFixed(4)} $, skupaj ${porabljeno().toFixed(4)} $${x.napake.length ? `; napake: ${x.napake.join(" | ")}` : ""}`,
    );
  }
  zapisi(false);
  if (ustavljeno) break;
}
// Pred koncem počaka, da se vsi začeti klici končajo in zapišejo porabo (največ 10 min).
for (let i = 0; i < 600 && vTeku() > 0; i++) await new Promise((r) => setTimeout(r, 1000));
if (vTeku() > 0) console.log(`Opozorilo: klic še teče, rezerva ${vTeku().toFixed(4)} $ ni v porabi.`);
server.close();
zapisi(true);

const st = (f) => izid.filter(f).length;
const sPrepisom = izid.filter((x) => x.ocena.prepis);
const zBranjem = izid.filter((x) => x.ocena.branje);
const zResitvijo = izid.filter((x) => x.ocena.resitev && x.ocena.resitev.pravilno !== null);
console.log("ODGOVORI-ZACETEK");
console.log(JSON.stringify(izid.map(({ id, prepis, branje, resitev, ocena, napake }) => ({ id, prepis, branje, resitev, ocena, napake }))));
console.log("ODGOVORI-KONEC");
console.log(
  `\nIZID: ${izid.length}/${slike.length} slik; Inštruktor (prepis) ${st((x) => x.ocena.prepis?.ok)}/${sPrepisom.length} pravilnih, ` +
    `slika ${st((x) => x.ocena.prepis?.figure)}/${sPrepisom.length}, več nalog ${st((x) => x.ocena.prepis?.more && x.ocena.prepis?.tasks)}/${sPrepisom.length}; ` +
    `Skeniraj (prva naloga) ${st((x) => x.ocena.branje?.prva?.ok)}/${zBranjem.length}, vse naloge ${st((x) => x.ocena.branje && x.ocena.branje.vse === x.ocena.branje.pricakovano)}/${zBranjem.length}; ` +
    `rešitev ${st((x) => x.ocena.resitev?.pravilno)}/${zResitvijo.length} pravilnih (lastni reševalnik ${st((x) => x.resitev?.vir === "lastni reševalnik")}, AI ${st((x) => x.resitev?.vir === "AI")}, preverjenih ${st((x) => x.ocena.resitev?.preverjeno)}); ` +
    `strošek ${porabljeno().toFixed(4)} $${ustavljeno ? ` (ustavljeno pred mejo ${MAX_USD} $)` : ""}. Izid: ${OUT}`,
);
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(izid.length ? 0 : 1);
