// Besedila ustnega spraševanja (public/ustno/besedila): vsi jeziki vmesnika imajo iste ključe in iste spremenljivke;
// gumb »Vprašaj me« je v glavnem slovarju, ostalo se naloži šele ob odprtju (proračun prvega odprtja).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import SL from "../public/ustno/besedila/sl.js";
import MAIN from "../public/i18n/sl.js";
import { UI_LANGUAGES } from "../public/i18n/languages.js";

const DIR = path.join(import.meta.dirname, "..", "public", "ustno", "besedila");
const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const forms = (v) => (typeof v === "object" ? Object.values(v) : [v]);

test("ustno: vsak jezik ima vse ključe in spremenljivke, nič ni ostalo v slovenščini", () => {
  const keys = Object.keys(SL).sort();
  for (const code of UI_LANGUAGES.filter((c) => c !== "sl")) {
    const d = JSON.parse(fs.readFileSync(path.join(DIR, `${code}.json`), "utf8"));
    assert.deepEqual(Object.keys(d).sort(), keys, code);
    for (const k of keys) {
      const want = vars(forms(SL[k]).join(" ")).filter((v, i, a) => a.indexOf(v) === i);
      for (const f of forms(d[k])) {
        assert.ok(typeof f === "string" && f.trim(), `${code} ${k}`);
        assert.deepEqual(vars(f).filter((v, i, a) => a.indexOf(v) === i), want, `${code} ${k}`);
      }
      if (typeof SL[k] === "object") assert.ok(d[k].other, `${code} ${k}`);
    }
    // sorodni jeziki imajo lahko kakšen enak niz (»Povedal si«, »Da«), večina mora biti prevedena
    const same = keys.filter((k) => forms(d[k])[0] === forms(SL[k])[0]).length;
    assert.ok(same <= keys.length * 0.1, `${code}: ${same} nizov je enakih slovenskim`);
  }
  assert.ok(MAIN["ustno.vprasajMe"]);
});
