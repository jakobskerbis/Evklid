// Napis pred besedilom »try« pod simulacijami, 3D modeli in demi (j, 12. 11. 2026): »Preizkusi:« za nalogo v
// simulaciji/modelu, »Razmisli:« za vprašanje le za razmislek, nikoli »Poskusi:« (bere se kot samostalnik).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { napisPoskusa } from "../public/sim/napis-poskusa.js";
import { SETS as NAR } from "../public/sim/nar-data.js";
import { SETS as BIO } from "../public/sim/bio-data.js";
import sl from "../public/i18n/sl.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

test("napisPoskusa: niz → Preizkusi, { razmisli } → Razmisli, prazno → nič", () => {
  assert.deepEqual(napisPoskusa("Nastavi a = 2."), { vrsta: "preizkusi", kljuc: "sc.try", napis: "Preizkusi:", besedilo: "Nastavi a = 2." });
  assert.deepEqual(napisPoskusa({ razmisli: "Zakaj?" }), { vrsta: "razmisli", kljuc: "sc.think", napis: "Razmisli:", besedilo: "Zakaj?" });
  for (const x of [null, undefined, "", "  ", {}, { razmisli: "" }]) assert.equal(napisPoskusa(x), null);
  assert.equal(sl["sc.try"], "Preizkusi:");
  assert.equal(sl["sc.think"], "Razmisli:");
});

test("nobena simulacija, 3D model ali demo ne pokaže napisa »Poskusi:«", () => {
  const files = [];
  const rd = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) rd(p);
      else if (p.endsWith(".js")) files.push(p);
    }
  };
  rd(path.join(ROOT, "public/sim"));
  rd(path.join(ROOT, "public/3d"));
  files.push(path.join(ROOT, "public/demos.js"));
  const slabi = [];
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    // napis v nizu (»"Poskusi: …"«, »`Poskusi: `«) ali na začetku besedila try/poskusi/razmisli
    for (const m of src.matchAll(/["'`]Poskusi:/g)) slabi.push(`${path.relative(ROOT, f)}:${src.slice(0, m.index).split("\n").length}`);
  }
  assert.deepEqual(slabi, []);
});

test("nabori za razvrščanje: vsak ima natanko eno od polj try (Preizkusi) ali razmisli (Razmisli)", () => {
  for (const [id, s] of Object.entries({ ...NAR, ...BIO })) {
    const ima = ["try", "razmisli"].filter((k) => s[k] !== undefined);
    assert.equal(ima.length, 1, `${id}: ${ima.join(", ") || "ni ne try ne razmisli"}`);
    const t = s.try ?? s.razmisli;
    assert.ok(typeof t === "string" && t.trim() && !/^(Poskusi|Preizkusi|Razmisli)\b/.test(t), `${id}: besedilo`);
  }
  // primer, ki ga je j javil: vprašanje za razmislek, ne poskus
  assert.match(NAR.celica.razmisli, /^Zakaj živalska celica ne potrebuje kloroplastov/);
});
