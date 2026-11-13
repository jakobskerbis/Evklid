// Preveri, ali vse povezave referenčnega materiala delujejo (HTTP 200 po preusmeritvah).
//   node scripts/preveri-reference.js            vse povezave
//   node scripts/preveri-reference.js --cacert pot/do/bundle.pem
// Uporablja curl (vzporedno po 6). Nekateri strežniki (npr. fmf.uni-lj.si) ne pošljejo
// vmesnega certifikata; tedaj ga dodaj v --cacert (nikoli ne izklapljaj preverjanja TLS).
import "../server/env.js";
import { execFile } from "node:child_process";
import { allReferenceItems, referenceStats } from "../server/references.js";

const args = process.argv.slice(2);
const ca = args.includes("--cacert") ? args[args.indexOf("--cacert") + 1] : process.env.EVKLID_CACERT;
const items = allReferenceItems();
const where = new Map();
for (const it of items) where.set(it.url, [...(where.get(it.url) || []), it.where]);
const urls = [...where.keys()];

const check = (u) =>
  new Promise((res) =>
    execFile(
      "curl",
      ["-sS", "-o", "/dev/null", "-L", "-m", "30", "-A", "Mozilla/5.0 (Evklid preverjanje povezav)", "-w", "%{http_code}", ...(ca ? ["--cacert", ca] : []), u],
      (err, out) => res(out || "000"),
    ),
  );

const queue = [...urls];
const bad = [];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const u = queue.shift();
      const code = await check(u);
      if (code !== "200") bad.push([code, u]);
    }
  }),
);
// Wikipedija in nekateri drugi strežniki ob hkratnih zahtevah vrnejo 429: te preverimo še enkrat, počasi.
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
for (const pair of [...bad]) {
  if (!["429", "000", "502", "503"].includes(pair[0])) continue;
  for (let i = 0; i < 3 && pair[0] !== "200"; i++) {
    await wait(2000 * (i + 1));
    pair[0] = await check(pair[1]);
  }
  if (pair[0] === "200") bad.splice(bad.indexOf(pair), 1);
}
const s = referenceStats();
console.log(`Tem ${s.themes}, virov ${s.items} (${s.urls} različnih povezav, ${s.slovenian} slovenskih), predmetov ${s.courses}.`);
for (const [code, u] of bad) console.log(`${code}  ${u}  (${where.get(u).join(", ")})`);
console.log(bad.length ? `Ne deluje: ${bad.length}` : "Vse povezave delujejo.");
process.exit(bad.length ? 1 : 0);
