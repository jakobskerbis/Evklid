// Preizkus 3 v celoti (krog 4 in naprej, j 18. 11. 2026): vseh 150 nalog iz scripts/preizkus3-naloge.json enkrat
// skozi pravo pot klepeta (POST /api/conversations/:id/messages v tem procesu, začasna baza v pomnilniku), kot so
// krogi 1–3 tekli v brskalniku na evklid.app: nastavitve iz vrstice »Evklid« (šola, razred/letnik, predmet, program
// in predmet na faksu, cilj Tekmovanje), način B (»Celotna rešitev«), pri Vodenju način A in tri sporočila (naloga,
// pripravljen napačen korak, »Ne vem.«). Z izbiro modela (usage.chooseMode), skrito opombo lekcije, reševalnikom in
// preverjanjem s kodo (live-check) kot v aplikaciji; brez predpomnilnika odgovorov (EVKLID_ANSWER_CACHE=0) in vsaka
// naloga s svojim novim profilom (brez šibkih točk in rezultatov iz prejšnjih nalog). Samo trenutni prompt.
// Privzeto kot plačljivi paket brez nadgradenj po mesečnem proračunu (OŠ »chat«, SŠ in faks »think«, kot
// meri-preizkus3.mjs in meritev-po-objavi) in brez pregleda z zmogljivejšim modelom: v krogih 1–3 je j-jev profil
// dnevno mejo pregledov učenca (6) porabil že v 1. krogu. --kot-produkcija: mesečni proračun kot v render.yaml
// (200 $), zato pri nizki porabi nadgradnja na Opus (vrsta »boost«), kot morda v krogih 1–3; ~20–40× dražje (ocena 8–13 $ za vse naloge).
// --s-pregledom: pregled z zmogljivejšim modelom kot za nov profil (6 na nalogo, 1 $ na dan kot render.yaml).
// Izid: za vsako nalogo {conv, ts, tsEnd, out: [{ms, txt, choices, model, cena, …}, …]} v data/meri-preizkus3-vse*.json
// (artefakt »meritev«); txt je besedilo, kot ga vidi učenec (brez META, gumbov in strojnih blokov), ms čas do konca
// odgovora. Pretvorba v obliko res/evklid-rN.json: ocene2/r4/pretvori.py (zunaj repozitorija).
// Ne piše v bazo aplikacije in ne šteje v njeno porabo; ustavi se, preden bi strošek presegel --max-usd.
//   node scripts/meri-preizkus3-vse.mjs [--max-usd 2] [--naloge 1,6,45] [--del 1-2] [--hkrati 4] [--out data/x.json]
//                                      [--kot-produkcija] [--s-pregledom] [--suho]
//   --del 1-2   le vsaka druga naloga (1., 3., 5. …), za zagon v dveh delih; nato --del 2-2
//   --hkrati 4  toliko nalog hkrati (1–6; privzeto 4), čas posameznega odgovora se meri posebej
//   --suho      preizkusni odgovori brez klica modela (0 $), tudi kadar je ključ nastavljen
// Zagon: GitHub Actions > Meritev > Run workflow, skripta scripts/meri-preizkus3-vse.mjs (docs/stroski-ai.md).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ZNANI = {
  "--max-usd": 1,
  "--naloge": 1,
  "--del": 1,
  "--hkrati": 1,
  "--out": 1,
  "--kot-produkcija": 0,
  "--s-pregledom": 0,
  "--suho": 0,
};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!(a in ZNANI)) {
    console.error(
      `Neznan argument »${a}« (dovoljeni: ${Object.keys(ZNANI).join(", ")}; vrednost za presledkom). Nič ni bilo poklicano.`,
    );
    process.exit(1);
  }
  i += ZNANI[a];
}
const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : def;
};
const MAX_USD = Number(arg("max-usd", 2));
const SUHO = process.argv.includes("--suho");
const PRODUKCIJA = process.argv.includes("--kot-produkcija");
const PREGLED = process.argv.includes("--s-pregledom");
const HKRATI = Number(arg("hkrati", 4));
const DEL = arg("del", "");
const OUT = arg("out", `data/meri-preizkus3-vse${DEL ? `-${DEL}` : ""}.json`);
const napaka = (m) => {
  console.error(`${m} Nič ni bilo poklicano.`);
  process.exit(1);
};
if (!(MAX_USD > 0) || MAX_USD > 5)
  napaka(
    `Neveljavna meja --max-usd »${arg("max-usd", "")}« (večja od 0, največ 5).`,
  );
if (!Number.isInteger(HKRATI) || HKRATI < 1 || HKRATI > 6)
  napaka("--hkrati mora biti celo število od 1 do 6.");
const delM = DEL ? /^([1-9])-([1-9])$/.exec(DEL) : null;
if (DEL && (!delM || Number(delM[1]) > Number(delM[2])))
  napaka(`Neveljaven --del »${DEL}« (npr. 1-2 in 2-2).`);
if (!/^data\/meri-[a-z0-9-]+\.json$/.test(OUT))
  napaka("--out mora biti data/meri-<ime>.json (artefakt).");

const NALOGE = JSON.parse(
  fs.readFileSync(new URL("./preizkus3-naloge.json", import.meta.url), "utf8"),
).naloge;
let izbor = NALOGE;
if (arg("naloge", "")) {
  const ids = arg("naloge", "").split(",").map(Number);
  if (
    ids.some((n) => !NALOGE.some((x) => x.id === n)) ||
    new Set(ids).size !== ids.length
  )
    napaka(
      `Neveljavne --naloge »${arg("naloge", "")}« (številke 1–150, brez ponovitev).`,
    );
  izbor = NALOGE.filter((x) => ids.includes(x.id));
}
if (delM)
  izbor = izbor.filter((_, i) => i % Number(delM[2]) === Number(delM[1]) - 1);

// Okolje pred uvozom strežnika (nekatere nastavitve se preberejo ob nalaganju modulov).
process.env.EVKLID_ANSWER_CACHE = "0"; // vsak odgovor nov, ne iz predpomnilnika
delete process.env.EVKLID_ACCOUNTS; // brez računov: poln paket, brez dnevne meje vprašanj
process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
// Brez mesečnega proračuna ni nadgradenj (usage.route); z njim (render.yaml 200 $) pri nizki porabi Opus.
if (PRODUKCIJA) process.env.EVKLID_MONTHLY_BUDGET_USD = "200";
else delete process.env.EVKLID_MONTHLY_BUDGET_USD;
process.env.EVKLID_LIVE_CHECK_DAILY_USD = "1"; // kot render.yaml
process.env.EVKLID_LIVE_REVIEW_PER_PUPIL = PREGLED ? "6" : "0";
if (SUHO) {
  process.env.EVKLID_MOCK = "1";
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_AUTH_TOKEN;
}
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");
const { isMockMode } = await import("../server/claude.js");
const { stripMeta, stripChoices } = await import("../server/meta.js");
if (isMockMode() && !SUHO) {
  console.error(
    "Ni ključa API (GitHub Actions: manjka skrivnost ANTHROPIC_API_KEY). Brezplačen preizkus: --suho.",
  );
  process.exit(1);
}

// Besedilo, ki ga vidi učenec (kot meri-preizkus3.mjs): brez META, gumbov in strojnih blokov (RACUN, GRAF, SKICA …).
const vidno = (t) =>
  stripChoices(stripMeta(String(t)))
    .replace(/<<[A-ZČŠŽ_]+[\s\S]*?>>/g, "")
    .trim();
// Najslabši strošek enega sporočila: odgovor (Haiku z razmislekom ali Opus pri nadgradnji, 1-urni zapis celega
// poziva v predpomnilnik in poln izhod), popravek in pregled (Sonnet).
const NA_SPOROCILO = (PRODUKCIJA ? 0.4 : 0.08) + (PREGLED ? 0.05 : 0);

const store = openDb(":memory:");
const server = createApp(store, { scheduler: false }).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;
const post = (p, body, signal) =>
  fetch(base + p, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

let porabljeno = 0; // vsota cost_usd odgovorov (+ rezerva za klic brez podatka o porabi)
let vTeku = 0;
let ustavljeno = false;
const izid = {};
const vBazi = () =>
  store.db.prepare("SELECT COALESCE(SUM(cost_usd), 0) AS s FROM usage").get().s;
const stroskek = () => Math.max(porabljeno, vBazi());
const zapisi = (koncano) => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const naloge = Object.fromEntries(
    Object.entries(izid).sort((a, b) => a[0] - b[0]),
  );
  fs.writeFileSync(
    OUT,
    JSON.stringify(
      {
        datum: new Date().toISOString(),
        commit: process.env.GITHUB_SHA || null,
        del: DEL || null,
        suho: SUHO,
        kotProdukcija: PRODUKCIJA,
        sPregledom: PREGLED,
        porabljeno: stroskek(),
        ustavljeno,
        koncano,
        naloge,
      },
      null,
      1,
    ),
  );
};

async function sporocilo(studentId, convId, text) {
  if (stroskek() + (vTeku + 1) * NA_SPOROCILO > MAX_USD) {
    ustavljeno = true;
    return null;
  }
  vTeku++;
  const zadnja = store.db
    .prepare("SELECT COALESCE(MAX(id), 0) AS m FROM usage")
    .get().m;
  const t0 = performance.now();
  try {
    const r = await post(
      `/api/conversations/${convId}/messages`,
      { text },
      AbortSignal.timeout(300_000),
    );
    const sse = await r.text();
    const ms = Math.round(performance.now() - t0);
    if (!r.ok) {
      porabljeno += NA_SPOROCILO;
      return { napaka: `HTTP ${r.status}: ${sse.slice(0, 200)}` };
    }
    const ev = sse
      .split("\n\n")
      .filter((x) => /^event: /m.test(x))
      .map((x) => ({
        event: /^event: (.*)$/m.exec(x)[1],
        data: JSON.parse(/^data: (.*)$/m.exec(x)?.[1] || "null"),
      }));
    const done = ev.find((e) => e.event === "done")?.data;
    if (!done) {
      porabljeno += NA_SPOROCILO;
      return {
        napaka:
          ev.find((e) => e.event === "error")?.data?.error ||
          "odgovor brez dogodka done",
      };
    }
    porabljeno += Number(done.cost_usd) || 0;
    const klici = store.db
      .prepare(
        "SELECT model, kind, cost_usd FROM usage WHERE id > ? AND student_id = ? ORDER BY id",
      )
      .all(zadnja, studentId);
    return {
      ms,
      txt: vidno(done.text),
      ...(done.choices?.length ? { choices: done.choices } : {}),
      model:
        klici.find((k) => k.kind === "chat" || k.kind === "boost")?.model ||
        klici[0]?.model ||
        null,
      klici: klici.map((k) => `${k.kind}:${k.model}`),
      cena: Number(done.cost_usd) || 0,
      popravek: /Popravek/.test(done.text) || undefined,
      ...(done.open?.length
        ? { bloki: done.open.map((o) => o.kind || o.type || "odpri") }
        : {}),
    };
  } catch (e) {
    porabljeno += NA_SPOROCILO;
    return {
      napaka:
        e?.name === "TimeoutError" ? "rok 300 s" : String(e?.message || e),
    };
  } finally {
    vTeku--;
  }
}

async function naloga(n) {
  const s = store.createStudent("Jakob", n.nastavitve);
  const conv = await (
    await post(`/api/students/${s.id}/conversations`, {})
  ).json();
  const v = {
    conv: conv.id,
    ts: new Date().toISOString(),
    tsEnd: null,
    nastavitve: store.getStudent(s.id).settings,
    out: [],
  };
  for (const text of [n.q, ...(n.odgovori || [])]) {
    const r = await sporocilo(s.id, conv.id, text);
    if (!r) break;
    if (r.napaka) {
      v.napaka = r.napaka;
      break;
    }
    v.out.push(r);
  }
  v.tsEnd = new Date().toISOString();
  const popolna = v.out.length === 1 + (n.odgovori?.length || 0);
  if (!popolna && !v.napaka) v.napaka = "ustavljeno pred mejo stroška";
  if (v.out.length || v.napaka !== "ustavljeno pred mejo stroška")
    izid[n.id] = v;
  if (!popolna) v.napake = v.out.length; // delna naloga: pretvornik je ne vzame
  zapisi(false);
  const t = v.out.map((o) => (o.ms / 1000).toFixed(1)).join("+");
  console.log(
    `${String(n.id).padStart(3)} ${n.naslov.slice(0, 48).padEnd(48)} ${popolna ? "OK" : `NAPAKA (${v.napaka})`} · ${t} s · ${v.out.reduce((a, o) => a + o.cena, 0).toFixed(4)} $ · ${v.out.map((o) => o.model).join(",")}`,
  );
}

console.log(
  `Preizkus 3 v celoti: ${izbor.length} nalog${DEL ? ` (del ${DEL})` : ""}, hkrati ${HKRATI}, meja ${MAX_USD} $${PRODUKCIJA ? ", kot produkcija (nadgradnje)" : ""}${PREGLED ? ", s pregledom" : ""}${SUHO ? ", suho (brez klicev)" : ""}.`,
);
const vrsta = [...izbor];
await Promise.all(
  Array.from({ length: HKRATI }, async () => {
    while (vrsta.length && !ustavljeno) await naloga(vrsta.shift());
  }),
);
server.close();
zapisi(true);
const vsi = Object.values(izid)
  .flatMap((v) => v.out.map((o) => o.ms))
  .sort((a, b) => a - b);
const prvi = Object.values(izid)
  .filter((v) => v.out.length)
  .map((v) => v.out[0].ms)
  .sort((a, b) => a - b);
const med = (a) =>
  a.length ? (a[Math.floor((a.length - 1) / 2)] / 1000).toFixed(1) : "–";
const ok = Object.values(izid).filter((v) => !v.napaka).length;
console.log(
  `\nNalog: ${ok}/${izbor.length} brez napake; odgovorov ${vsi.length}; mediana prvega odgovora ${med(prvi)} s, vseh ${med(vsi)} s.`,
);
const nap = Object.entries(izid).filter(([, v]) => v.napaka);
if (nap.length)
  console.log(
    `Napake: ${nap.map(([k, v]) => `${k} (${v.napaka})`).join("; ")}`,
  );
console.log(
  `Strošek ${stroskek().toFixed(4)} $${
    ustavljeno
      ? ` (ustavljeno pred mejo ${MAX_USD} $; manjkajo: ${izbor
          .filter((n) => !izid[n.id] || izid[n.id].napaka)
          .map((n) => n.id)
          .join(",")})`
      : ""
  }.`,
);
console.log(`Odgovori: ${OUT}`);
