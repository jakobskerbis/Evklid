// K-13 (26. 11. 2026): vsak stolpec, ki ga strežnik zapiše šifrirano (seal/sealJson), mora biti v SEALED,
// sicer ga menjava ključa ne zašifrira znova in po odstranitvi starega ključa postane za vedno neberljiv.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SEALED, SEALED_KV, seal, unseal, newKey, isEncrypted } from "../server/crypto-polje.js";
import { migrateEncryption, encryptionStats } from "../server/zasebnost.js";
import { openDb } from "../server/db.js";
import { STEVCI_KV } from "../server/nujno.js";

const koren = path.resolve(import.meta.dirname, "../server");
const datoteke = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? datoteke(path.join(d, e.name)) : e.name.endsWith(".js") ? [path.join(d, e.name)] : []));

// Za vsak klic seal(…) ali sealJson(…) poišče najbližji INSERT INTO / UPDATE … SET pred njim (do 600 znakov nazaj,
// v istem stavku). Klic brez SQL v bližini (vrednost se zapiše drugje) ta preverba ne zajame.
function sifriraneTabele() {
  const najdene = new Map();
  for (const f of datoteke(koren)) {
    if (f.endsWith("crypto-polje.js") || f.endsWith("zasebnost.js")) continue;
    const src = fs.readFileSync(f, "utf8");
    for (const m of src.matchAll(/\b(?:seal|sealJson)\(/g)) {
      const okno = src.slice(Math.max(0, m.index - 600), m.index);
      const pred = okno.slice(okno.lastIndexOf(";") + 1); // samo isti stavek
      const sql = [...pred.matchAll(/\b(?:INSERT(?:\s+OR\s+\w+)?\s+INTO\s+(\w+)|UPDATE\s+(\w+)\s+SET)\b/g)].at(-1);
      // Posredni zapis v kv prek pomočnika (npr. usage.kvSet(KLJUC, sealJson(...))).
      const t = sql ? sql[1] || sql[2] : /\bkvSet\([^;]*$/.test(pred) ? "kv" : null;
      if (!t) continue;
      if (!najdene.has(t)) najdene.set(t, new Set());
      najdene.get(t).add(path.relative(koren, f));
    }
  }
  return najdene;
}

test("vsaka tabela, zapisana s seal/sealJson, je v SEALED (menjava ključa)", () => {
  const najdene = sifriraneTabele();
  assert.ok(najdene.size >= 10, `preverba najde premalo tabel (${najdene.size}); se je oblika kode spremenila?`);
  const vSealed = new Set(SEALED.map((t) => t.table));
  const manjka = [...najdene].filter(([t]) => !vSealed.has(t)).map(([t, f]) => `${t} (${[...f].join(", ")})`);
  assert.deepEqual(manjka, [], `šifrirano zapisane tabele, ki jih ni v SEALED (server/crypto-polje.js): ${manjka.join("; ")}`);
  assert.ok(najdene.has("ustno_seje") && najdene.has("kv"), "ustno_seje in kv sta zapisani šifrirano");
});

test("šifrirani ključi v kv so v SEALED_KV in jih zajame vrstica kv v SEALED", () => {
  const stiska = fs.readFileSync(path.join(koren, "stiska-obvestilo.js"), "utf8");
  const kljuci = [...stiska.matchAll(/const KV_\w+ = "([^"]+)"/g)].map((m) => m[1]);
  assert.ok(kljuci.length >= 2, "stiska-obvestilo.js: ključa obvestil v kv");
  for (const k of [...kljuci, STEVCI_KV]) assert.ok(SEALED_KV.includes(k), `kv ključ ${k} manjka v SEALED_KV`);
  const kv = SEALED.find((t) => t.table === "kv");
  for (const k of SEALED_KV) assert.ok(kv.where.includes(`'${k}'`), k);
  // Vse datoteke, ki v kv pišejo seal(...), so pregledane zgoraj (nova šifrirana vrednost v kv = nov ključ v SEALED_KV).
  const pisci = [...(sifriraneTabele().get("kv") || [])].sort();
  assert.deepEqual(pisci, ["nujno.js", "stiska-obvestilo.js"], `nova datoteka piše šifrirano v kv: ${pisci.join(", ")}; dodaj ključ v SEALED_KV`);
});

const zKljucem = (key, fn, old = "") => {
  const prev = [process.env.EVKLID_DATA_KEY, process.env.EVKLID_DATA_KEYS_OLD];
  process.env.EVKLID_DATA_KEY = key;
  process.env.EVKLID_DATA_KEYS_OLD = old;
  try {
    return fn();
  } finally {
    for (const [i, k] of ["EVKLID_DATA_KEY", "EVKLID_DATA_KEYS_OLD"].entries()) {
      if (prev[i] === undefined) delete process.env[k];
      else process.env[k] = prev[i];
    }
  }
};

test("menjava ključa: odgovori ustnega izpita in šifrirani kv ostanejo berljivi brez starega ključa", () => {
  const store = openDb(":memory:");
  const db = store.db;
  const s = store.createStudent("Ana");
  db.exec("CREATE TABLE IF NOT EXISTS ustno_seje (id INTEGER PRIMARY KEY, student_id INTEGER, vprasanja TEXT NOT NULL, stanje TEXT NOT NULL)");
  const k1 = newKey();
  const k2 = newKey();
  const stanje = JSON.stringify({ odgovori: [{ navedek: "moje besede 4711" }] });
  zKljucem(k1, () => {
    db.prepare("INSERT INTO ustno_seje (student_id, vprasanja, stanje) VALUES (?, '[]', ?)").run(s.id, seal(stanje));
    db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES ('stiska_starsi', ?)").run(seal('{"1":"2026-11-26"}'));
    db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES ('nujno_stevci', ?)").run(seal('{"d":1}'));
  });
  db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES ('test_navaden', 'ostane berljiv')").run();
  zKljucem(k2, () => migrateEncryption(db), `k1:${k1}`);
  zKljucem(k2, () => {
    // Stari ključ je odstranjen: vse mora biti berljivo s k2 in --preveri ne sme kazati starega ključa.
    assert.equal(unseal(db.prepare("SELECT stanje FROM ustno_seje").get().stanje, null), stanje);
    assert.equal(unseal(db.prepare("SELECT value FROM kv WHERE key = 'stiska_starsi'").get().value, null), '{"1":"2026-11-26"}');
    assert.equal(unseal(db.prepare("SELECT value FROM kv WHERE key = 'nujno_stevci'").get().value, null), '{"d":1}');
    const st = encryptionStats(db).filter((x) => x.table === "ustno_seje" || x.table === "kv");
    assert.equal(st.length, 2);
    for (const x of st) assert.equal(x.oldKey + x.unreadable + x.plain, 0, `${x.table}: ${JSON.stringify(x)}`);
  });
  // Nešifriranih ključev v kv selitev ne zašifrira (berejo jih brez unseal).
  const navaden = db.prepare("SELECT value FROM kv WHERE key = 'test_navaden'").get().value;
  assert.equal(navaden, "ostane berljiv");
  assert.ok(!isEncrypted(navaden));
});
