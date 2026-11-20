// Aplikacija (mobile/): ob koncu seje (odjava, izbris računa, potekla seja) s telefona izginejo podatki računa,
// nastavitve naprave ostanejo; spletna stran v WebView pobriše svoje osebne podatke; paket in vrsta vaj brez
// povezave sta vezana na račun in na profil (id profila se po izbrisu lahko ponovi). mobile/src/lib/zasebnost.js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { pathToFileURL } from "node:url";

const BRAND = JSON.parse(fs.readFileSync("brand.json", "utf8"));
const S = BRAND.slug;
const OLD = (BRAND.legacy || []).map((l) => l.slug).filter(Boolean);

// mobile/package.json nima »type: module«: modul se uvozi kot kopija .mjs. public/offline.js kot v
// test/offline-naprava.test.js (uvoz »/practice/check.js« je pot v brskalniku).
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-odjava-"));
test.after(() => fs.rmSync(dir, { recursive: true, force: true }));
fs.copyFileSync("mobile/src/lib/zasebnost.js", path.join(dir, "zasebnost.mjs"));
const z = await import(pathToFileURL(path.join(dir, "zasebnost.mjs")).href);
const url = (p) => JSON.stringify(pathToFileURL(path.resolve(p)).href);
fs.writeFileSync(
  path.join(dir, "offline.mjs"),
  fs.readFileSync("public/offline.js", "utf8").replace('"/practice/check.js"', url("server/practice/check.js")).replace('"./enote-izbira.js"', url("public/enote-izbira.js")),
);
const web = await import(pathToFileURL(path.join(dir, "offline.mjs")).href);

// expo-sqlite/kv-store (sinhroni del, ki ga uporablja aplikacija).
class KvStore {
  constructor(o = {}) {
    this.m = new Map(Object.entries(o));
  }
  getAllKeysSync() {
    return [...this.m.keys()];
  }
  getItemSync(k) {
    return this.m.has(k) ? this.m.get(k) : null;
  }
  setItemSync(k, v) {
    this.m.set(k, String(v));
  }
  removeItemSync(k) {
    return this.m.delete(k);
  }
}

const ANA = { id: 7, created_at: "2026-11-01 10:00:00" };
const pack = JSON.stringify({ path: "MAT-OS-8", created: "2026-11-02T10:00:00Z", tasks: { t: [{ seed: 1, answer: "4", solution: "x = 4" }] } });
const PREFS = { [`${S}.haptics`]: "0", [`${S}.reminder`]: "17:30", [`${S}.pushToken`]: "ExponentPushToken[x]", [`${S}.web.pocisti`]: "1" };
const phone = () =>
  new KvStore({
    ...PREFS,
    [`${S}.student`]: "7",
    [`${S}.account`]: JSON.stringify({ parent: { id: 3, email: "starš@example.si" }, students: [ANA] }),
    [z.offlineKljuc(S, "pack", 3, ANA)]: pack,
    [z.offlineKljuc(S, "queue", 3, ANA)]: JSON.stringify([{ topic_id: "t", seed: 1, answer: "5", at: "2026-11-03T10:00:00Z" }]),
    [z.offlineKljuc(S, "pack", 3, { id: 8, created_at: "2026-11-05 08:00:00" })]: pack,
    [`${S}.offline.pack.9`]: pack, // prejšnja oblika ključa
    [`${S}.offline.queue.9`]: "[]",
    [`${S}.checkTimes`]: "[1200,3400]",
    [`${S}.uciZavihek`]: "lab",
    ...Object.fromEntries(OLD.map((o) => [`${o}.offline.pack.7`, pack])),
    "tuj.kljuc": "ostane", // ni od aplikacije
  });

test("ob koncu seje izginejo vsi ključi računa, nastavitve naprave ostanejo", () => {
  const kv = phone();
  const removed = z.pocistiShrambo(kv, S, OLD);
  assert.ok(removed.length >= 9, removed.join());
  const left = Object.fromEntries(kv.m);
  assert.deepEqual(left, { ...PREFS, "tuj.kljuc": "ostane" });
  for (const k of Object.keys(left)) if (k.startsWith(`${S}.`)) assert.ok(z.NAPRAVA.includes(k.slice(S.length + 1)), k);
  // Ponovno brisanje nič ne pokvari.
  assert.deepEqual(z.pocistiShrambo(kv, S, OLD), []);
});

test("jeZasebenKljuc: privzeto zaseben, razen nastavitev naprave", () => {
  for (const k of ["student", "account", "offline.pack.3.7.20261101100000", "offline.queue.3.7.0", "offline.pack.7", "checkTimes", "uciZavihek", "nov-kljuc-v-prihodnje"])
    assert.equal(z.jeZasebenKljuc(`${S}.${k}`, S, OLD), true, k);
  for (const k of z.NAPRAVA) assert.equal(z.jeZasebenKljuc(`${S}.${k}`, S, OLD), false, k);
  assert.equal(z.jeZasebenKljuc("tuj.kljuc", S, OLD), false);
  assert.equal(z.jeZasebenKljuc(`${S}session`, S, OLD), false);
  for (const o of OLD) assert.equal(z.jeZasebenKljuc(`${o}.haptics`, S, OLD), true, o);
});

test("shramba, ki ne dela, ne ustavi odjave", () => {
  assert.deepEqual(z.pocistiShrambo({ getAllKeysSync() { throw new Error("x"); } }, S), []);
  const kv = new KvStore({ [`${S}.student`]: "1", [`${S}.account`]: "{}" });
  kv.removeItemSync = function (k) {
    if (k.endsWith(".student")) throw new Error("x");
    return this.m.delete(k);
  };
  assert.deepEqual(z.pocistiShrambo(kv, S), [`${S}.account`]);
});

test("ponovljen id profila ne vidi starega paketa ne vrste", () => {
  const nova = { id: 7, created_at: "2026-11-20 09:00:00" };
  assert.notEqual(z.offlineKljuc(S, "pack", 3, ANA), z.offlineKljuc(S, "pack", 3, nova));
  assert.notEqual(z.offlineKljuc(S, "queue", 3, ANA), z.offlineKljuc(S, "queue", 3, nova));
  // Drug račun z istim id-jem profila (in celo istim časom) ima svoj ključ.
  assert.notEqual(z.offlineKljuc(S, "pack", 3, ANA), z.offlineKljuc(S, "pack", 4, ANA));
  const kv = phone();
  assert.equal(kv.getItemSync(z.offlineKljuc(S, "pack", 3, nova)), null);
  assert.equal(kv.getItemSync(z.offlineKljuc(S, "queue", 3, nova)), null);
  assert.equal(z.offlineKljuc(S, "pack", 3, ANA), `${S}.offline.pack.3.7.20261101100000`);
});

test("ključi prejšnje oblike: paket gre, odgovori ostanejo le za profil računa in po njegovem nastanku", () => {
  const nova = { id: 7, created_at: "2026-11-20 09:00:00" };
  const kv = new KvStore({
    [`${S}.offline.pack.7`]: pack,
    [`${S}.offline.queue.7`]: JSON.stringify([
      { topic_id: "t", seed: 1, answer: "staro", at: "2026-11-19T10:00:00.000Z" }, // izbrisan profil z istim id-jem
      { topic_id: "t", seed: 2, answer: "novo", at: "2026-11-20T09:30:00.000Z" },
    ]),
    [`${S}.offline.queue.12`]: JSON.stringify([{ topic_id: "t", seed: 3, answer: "tuj", at: "2026-11-20T09:30:00.000Z" }]),
    [`${S}.offline.queue.x`]: "ni stara oblika",
    [`${S}.haptics`]: "1",
  });
  z.preseliStare(kv, S, 3, [nova]);
  assert.equal(kv.getItemSync(`${S}.offline.pack.7`), null);
  assert.equal(kv.getItemSync(`${S}.offline.queue.7`), null);
  assert.equal(kv.getItemSync(`${S}.offline.queue.12`), null);
  assert.deepEqual(JSON.parse(kv.getItemSync(z.offlineKljuc(S, "queue", 3, nova))).map((r) => r.answer), ["novo"]);
  assert.equal(kv.getItemSync(z.offlineKljuc(S, "pack", 3, nova)), null);
  assert.equal(kv.getItemSync(`${S}.haptics`), "1");
  assert.equal(kv.getItemSync(`${S}.offline.queue.x`), "ni stara oblika");
});

test("ključi prejšnje oblike: zaklenjen profil (brez created_at) obdrži odgovore do odklepa, prenos je enkraten", () => {
  const q = JSON.stringify([{ topic_id: "t", seed: 2, answer: "novo", at: "2026-11-20T09:30:00.000Z" }]);
  const kv = new KvStore({ [`${S}.offline.queue.7`]: q });
  z.preseliStare(kv, S, 3, [{ id: 7, name: "Ana", locked: true }]);
  assert.equal(kv.getItemSync(`${S}.offline.queue.7`), q);
  const nova = { id: 7, created_at: "2026-11-20 09:00:00" };
  z.preseliStare(kv, S, 3, [nova]);
  z.preseliStare(kv, S, 3, [nova]);
  assert.equal(kv.getItemSync(`${S}.offline.queue.7`), null);
  assert.deepEqual(JSON.parse(kv.getItemSync(z.offlineKljuc(S, "queue", 3, nova))).map((r) => r.answer), ["novo"]);
});

// --- Spletna stran v WebView ---
const SAMPLE = [
  `${S}.offline.pack.7`, `${S}.offline.queue.7`, `${S}.offline.students`, `${S}.offline.owner`, `${S}.scan.7`, `${S}.work.12`,
  `${S}.graph.7`, `${S}.sci.7`, `${S}.goalSeen.7`, `${S}.scheduleReminders`, `${S}.ours.7.x`, `${S}.levelup.7.8`,
  `${S}.zadnji-zaslon`, `${S}.zadnji-posnetek`, `${S}.zadnji-zaslonX`, "teacherClasses", "studentId", `${S}_invite_name`, `${S}_koda`,
  `${S}_ref`, `${S}.vabilo`, `${S}.lang`, `${S}.theme`, `${S}.units`, `${S}.config`, "lang", "theme", `${S}.racun`,
];

test("seznam osebnih ključev spletne strani je enak kot v public/offline.js", () => {
  for (const k of SAMPLE) assert.equal(z.spletJeZasebno(k, S), web.isPrivateKey(k), k);
  const src = fs.readFileSync("public/offline.js", "utf8");
  const re = /const PRIVATE_KEYS = \/(.*)\/;/.exec(src)[1];
  assert.equal(new RegExp(z.spletVzorec(S)).source, re);
});

test("skript za WebView pobriše osebne ključe in predpomnilnik API, nastavitve ostanejo", async () => {
  const m = new Map(SAMPLE.map((k) => [k, "1"]));
  const ls = { get length() { return m.size; }, key: (i) => [...m.keys()][i] ?? null, getItem: (k) => m.get(k) ?? null, removeItem: (k) => m.delete(k), setItem: (k, v) => m.set(k, String(v)) };
  const deleted = [];
  const caches = { keys: async () => [`${S}-v1-api-javni`, `${S}-v1-static`], delete: async (n) => deleted.push(n) };
  const out = vm.runInNewContext(z.spletPocistiJs(S), { localStorage: ls, caches });
  assert.equal(out, true);
  await new Promise((r) => setTimeout(r, 10));
  assert.deepEqual([...m.keys()].sort(), SAMPLE.filter((k) => !web.isPrivateKey(k)).sort());
  assert.ok(m.has(`${S}.lang`) && m.has(`${S}.theme`) && m.has("lang"));
  assert.deepEqual(deleted, [`${S}-v1-api-javni`]);
  // Brez localStorage in caches (napaka) skript ne vrže.
  assert.equal(vm.runInNewContext(z.spletPocistiJs(S), {}), true);
  // Odprta stran ob zapiranju ne zapiše znova zadnjega zaslona (kot clearPrivate).
  let pozabil = false;
  vm.runInNewContext(z.spletPocistiJs(S), { window: { evklidZacetek: { pozabi: () => (pozabil = true) } }, localStorage: ls });
  assert.equal(pozabil, true);
});

// --- Povezava v aplikaciji (izvorna koda React Native ni izvedljiva v Node; preverimo, da so poti povezane) ---
const src = (p) => fs.readFileSync(p, "utf8");

test("vsak konec seje pobriše telefon: odjava, izbris računa, potekla seja, zagon brez seje", () => {
  const session = src("mobile/src/lib/session.tsx");
  const api = src("mobile/src/lib/api.ts");
  // clearDevice: shramba, vaje brez povezave, spletna stran.
  const fn = session.slice(session.indexOf("function clearDevice"), session.indexOf("export function SessionProvider"));
  assert.match(fn, /forgetOffline\(\)/);
  assert.match(fn, /pocistiShrambo\(Storage, brand\.slug, LEGACY_SLUGS\)/);
  assert.match(fn, /requestWebClear\(\)/);
  // Poslušalec seje: vsak setSession(null) (odjava, izbris, 401 z login, glava X-App-Session »-«).
  assert.match(session, /onSessionChange\(\(\) => \{[\s\S]*?if \(!hasSession\(\)\) \{[\s\S]*?clearDevice\(\);/);
  assert.match(session, /await loadSession\(\);\s*\/\/[^\n]*\n\s*if \(!hasSession\(\)\) clearDevice\(\);/);
  assert.match(api, /async function setSession\(value: string \| null\) \{[\s\S]*?listeners\.forEach\(\(fn\) => fn\(\)\);/);
  assert.match(api, /if \(body\?\.login\) await setSession\(null\);/);
  // Odjava: najprej neposlani odgovori, nato clearSession (→ poslušalec).
  const signOut = session.slice(session.indexOf("const signOut = useCallback"), session.indexOf("const updateStudent"));
  assert.ok(signOut.indexOf("sendAllQueued()") >= 0 && signOut.indexOf("sendAllQueued()") < signOut.indexOf("clearSession()"));
  // Izbris računa: clearSession po uspešnem DELETE.
  assert.match(src("mobile/src/app/delete-account.tsx"), /await api\("\/api\/account", \{ method: "DELETE", body \}\);\s*await clearSession\(\);/);
  // Seznam profilov določi lastnika ključev vaj brez povezave.
  assert.match(session, /setOfflineOwner\(p\?\.id, list\);/);
});

test("vaje brez povezave: ključi samo prek offlineKljuc, zapis po odjavi se ne zgodi", () => {
  const off = src("mobile/src/lib/offline.ts");
  assert.doesNotMatch(off, /offline\.(pack|queue)\.\$\{sid\}/);
  assert.match(off, /offlineKljuc\(brand\.slug, vrsta, owner\.parentId, s\)/);
  assert.match(off, /if \(g === gen\) write\(PACK\(sid\), pack\);/);
  assert.match(off, /if \(g === gen\) write\(QUEUE\(sid\)/);
  // V aplikaciji nihče drug ne sestavlja ključev paketa ali vrste.
  for (const f of fs.readdirSync("mobile/src", { recursive: true })) {
    if (!/\.(ts|tsx|js)$/.test(f) || /lib[/\\](offline\.ts|zasebnost\.js)$/.test(f)) continue;
    assert.doesNotMatch(src(path.join("mobile/src", f)), /offline\.(pack|queue)/, f);
  }
});

test("spletna stran v aplikaciji: brisanje pred skripti strani in takoj, ko je odprta", () => {
  const w = src("mobile/src/app/web.tsx");
  assert.match(w, /const CLEAR_JS = spletPocistiJs\(brand\.slug\);/);
  assert.match(w, /injectedJavaScriptBeforeContentLoaded=\{NATIVE_FLAG_JS \+ \(clearFirst \? CLEAR_JS : ""\) \+ studentJs\(/);
  assert.match(w, /setWebCleaner\(\(\) => ref\.current\?\.injectJavaScript\(CLEAR_JS\)\)/);
  assert.match(w, /if \(clearFirst\) \{\s*webClearDone\(\);/);
  const state = src("mobile/src/lib/web-state.ts");
  assert.match(state, /export function requestWebClear\(\) \{[\s\S]*?Storage\.setItemSync\(FLAG, "1"\)[\s\S]*?cleaner\?\.\(\)/);
  assert.match(state, /const FLAG = key\("web\.pocisti"\);/);
  assert.ok(z.NAPRAVA.includes("web.pocisti"), "zastavica ne sme izginiti z brisanjem");
});
