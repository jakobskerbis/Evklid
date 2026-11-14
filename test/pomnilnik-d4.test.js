// Točka D4 (master brief j 13. 11.): /healthz/stanje pove delež pomnilnika, Straža opozori nad 85 % meje
// (tudi ob kratkem vrhu v zadnjih 15 min). Na stari kodi pade (ni polja pomnilnik). Zagon: node --test test/pomnilnik-d4.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { createPomnilnik, virPomnilnika, OKNO_MS } from "../server/pomnilnik.js";

process.env.STRAZA_URL = "http://127.0.0.1:9";
const MB = 1024 * 1024;

test("D4 meja in poraba: cgroup v2 in v1 (brez neaktivnega predpomnilnika), EVKLID_POMNILNIK_MB, sicer 512 MB in RSS", () => {
  const vir = (m, env = {}) => virPomnilnika({ beri: (f) => { if (f in m) return m[f]; throw new Error("ni"); }, env, rss: () => 7 * MB });
  let v = vir({ "/sys/fs/cgroup/memory.max": "536870912\n", "/sys/fs/cgroup/memory.current": String(400 * MB), "/sys/fs/cgroup/memory.stat": `anon 1\ninactive_file ${100 * MB}\n` });
  assert.equal(v.meja, 512 * MB);
  assert.equal(v.poraba(), 300 * MB, "vsebnik brez neaktivnega predpomnilnika (tudi podprocesi, ne samo RSS)");
  v = vir({ "/sys/fs/cgroup/memory.max": "max\n", "/sys/fs/cgroup/memory/memory.limit_in_bytes": "1073741824", "/sys/fs/cgroup/memory/memory.usage_in_bytes": String(600 * MB), "/sys/fs/cgroup/memory/memory.stat": `cache 5\ntotal_inactive_file ${50 * MB}\n` });
  assert.equal(v.meja, 1024 * MB);
  assert.equal(v.poraba(), 550 * MB);
  v = vir({ "/sys/fs/cgroup/memory/memory.limit_in_bytes": "9223372036854771712", "/sys/fs/cgroup/memory/memory.usage_in_bytes": "1" });
  assert.equal(v.meja, 512 * MB, "v1 brez meje");
  assert.equal(v.poraba(), 7 * MB, "brez meje v cgroup: RSS strežnika");
  assert.equal(vir({}, { EVKLID_POMNILNIK_MB: "2048" }).meja, 2048 * MB);
  assert.equal(vir({ "/sys/fs/cgroup/memory.max": "536870912", "/sys/fs/cgroup/memory.current": "1" }, { EVKLID_POMNILNIK_MB: "256" }).meja, 256 * MB, "okolje prepiše cgroup");
});

test("D4 vrh v zadnjih 15 min ostane viden, starejši ne", () => {
  let t = 0;
  let rss = 300 * MB;
  const p = createPomnilnik({ poraba: () => rss, now: () => t, meja: 512 * MB, zacni: false });
  p.vzorec();
  t += 10_000;
  rss = 460 * MB; // 90 %
  p.vzorec();
  t += 10_000;
  rss = 300 * MB;
  let s = p.stanje();
  assert.equal(s.delez, 59);
  assert.equal(s.najvecDelez15min, 90);
  assert.equal(s.mejaMb, 512);
  assert.equal(s.opozorilo, 85);
  t += OKNO_MS;
  s = p.stanje();
  assert.equal(s.najvecDelez15min, 59, "vrh je starejši od 15 min");
  // Branje stanja (javna pot) ne doda vzorca: 10 000 branj ne napihne seznama in ne vrže napake.
  for (let i = 0; i < 10_000; i++) p.stanje();
  rss = 470 * MB;
  assert.equal(p.stanje().najvecDelez15min, 92, "trenutna poraba šteje tudi brez vzorca");
  rss = 300 * MB;
  assert.equal(p.stanje().najvecDelez15min, 59, "branje je ni shranilo");
});

test("D4 /healthz/stanje vrne pomnilnik; Straža opozori nad 85 %, pod tem ne", async () => {
  const app = createApp(openDb(":memory:"), { pomnilnik: false });
  const srv = app.listen(0);
  try {
    const r = await fetch(`http://127.0.0.1:${srv.address().port}/healthz/stanje`);
    const j = await r.json();
    assert.equal(typeof j.pomnilnik?.delez, "number");
    assert.equal(typeof j.pomnilnik?.najvecDelez15min, "number");
    assert.ok(j.pomnilnik.mb > 0 && j.pomnilnik.mejaMb > 0);
  } finally {
    srv.close();
  }

  const { PREIZKUSI } = await import("../scripts/straza.mjs");
  const stanje = PREIZKUSI.find((p) => p.pot === "/healthz/stanje");
  const odgovor = (pomnilnik) => ({ json: async () => ({ razlicica: "x", id: "y", pomnilnik }) });
  await stanje.preveri(odgovor({ delez: 60, najvecDelez15min: 85, mejaMb: 512, mb: 300, opozorilo: 85 }));
  await stanje.preveri(odgovor(undefined)); // starejši strežnik brez polja: brez opozorila
  await assert.rejects(stanje.preveri(odgovor({ delez: 60, najvecDelez15min: 86, mejaMb: 512, mb: 300, opozorilo: 85 })), /pomnilnik 86 % meje 512 MB/);

});
