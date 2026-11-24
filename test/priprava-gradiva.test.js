// Testni nabor za pripravo na test iz zapiskov (docs/priprava.md, PR 1): nabor je popoln, vse formule v virih se
// izrišejo s KaTeX (isti zapis kot v aplikaciji) in pričakovanja se sklicujejo na besedilo, ki v viru res je.
// Uvoz, teme in načrt (PR 3–5) ta nabor uporabijo kot vhod; tu preverimo samo nabor sam.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";

const DIR = path.join(import.meta.dirname, "fixtures", "priprava");
const exp = JSON.parse(fs.readFileSync(path.join(DIR, "pricakovano.json"), "utf8"));
const rubrika = JSON.parse(fs.readFileSync(path.join(DIR, "astra-rubrika.json"), "utf8"));
const viri = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"));
const besedilo = (f) => fs.readFileSync(path.join(DIR, f), "utf8");

// $$…$$ (prikaz) in $…$ (v vrstici); v virih ni drugih znakov $.
function formule(txt) {
  const out = [];
  const rest = txt.replace(/\$\$([\s\S]+?)\$\$/g, (_, f) => (out.push(f), " "));
  for (const m of rest.matchAll(/\$([^$\n]+?)\$/g)) out.push(m[1]);
  return { out, odvec: (rest.replace(/\$([^$\n]+?)\$/g, "").match(/\$/g) || []).length };
}

test("vsak vir ima pričakovanja in vsako pričakovanje svoj vir", () => {
  assert.deepEqual(Object.keys(exp.viri).sort(), viri.sort());
  for (const n of exp.neskladja) for (const v of n.viri) assert.ok(viri.includes(v), v);
  for (const k of rubrika.kompleti) for (const v of k.viri) assert.ok(viri.includes(v), `${k.id}: ${v}`);
});

test("vse formule v virih se izrišejo s KaTeX", () => {
  let n = 0;
  for (const f of viri) {
    const { out, odvec } = formule(besedilo(f));
    assert.equal(odvec, 0, `${f}: nezaprt $`);
    for (const tex of out) {
      assert.doesNotThrow(() => katex.renderToString(tex, { throwOnError: true, displayMode: false }), `${f}: ${tex}`);
      n++;
    }
  }
  assert.ok(n >= 40, `premalo formul v naboru (${n})`);
});

test("pričakovano besedilo, negotova mesta in slabo pokrite teme so dobesedno v viru", () => {
  for (const [f, e] of Object.entries(exp.viri)) {
    const t = besedilo(f);
    for (const s of e.mora_najti) assert.ok(t.includes(s), `${f}: ${s}`);
    for (const s of e.negotovo) assert.ok(t.includes(s.besedilo), `${f}: ${s.besedilo}`);
    for (const s of e.slabo_pokrito) assert.ok(t.includes(s), `${f}: ${s}`);
    if (e.ne_izvedi) assert.ok(t.includes(e.ne_izvedi), `${f}: napad`);
    assert.ok(e.teme.length >= 1, `${f}: brez tem`);
  }
});

test("nabor pokriva predmete in vrste iz zahteve", () => {
  const predmeti = new Set(Object.values(exp.viri).map((e) => e.predmet));
  for (const p of ["MAT", "FIZ", "KEM", "BIO", "ZGO"]) assert.ok(predmeti.has(p), p);
  assert.ok(Object.values(exp.viri).some((e) => e.vrsta === "test"), "star test");
  assert.ok(exp.neskladja.length >= 1, "nasprotujoča si vira");
  assert.ok(Object.values(exp.viri).some((e) => e.ne_izvedi), "vrinjena navodila");
  assert.deepEqual(new Set(rubrika.kompleti.map((k) => k.datum_cez_dni)), new Set([1, 7, 30]));
});
