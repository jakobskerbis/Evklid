// Gumbi na dotik v Safariju (iPad, iPhone; j 2026-11-15: v lekciji o ločevanju zmesi niso delali »Ustavi«, »Znova«,
// »Ponastavi« in »Naslednja«). Safari po dotiku nekaj deset milisekund opazuje stran; nov klikljiv element na zaslonu
// (poslušalec click/mousedown/mouseup ali gumb, polje, povezava) vzame kot meni ob lebdenju in klika ne pošlje nobenemu
// gumbu na strani. Animacija ga zato ne sme risati znova v vsaki sličici. Razlaga: scripts/gumbi-na-dotik.cjs.
import test, { before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { preveri, ponavlja } = require("../scripts/gumbi-na-dotik.cjs");

test("ponavlja: only elements that keep appearing (animation) count, a one-off change does not", () => {
  assert.deepEqual(ponavlja([]), []);
  assert.deepEqual(ponavlja([{ t: 10, opis: "button.layer-chip" }, { t: 12, opis: "button.layer-chip" }]), []);
  assert.deepEqual(ponavlja([{ t: 10, opis: "g.pt-cell" }, { t: 400, opis: "g.pt-cell" }]), ["g.pt-cell", "g.pt-cell"]);
});

test("sims that redraw every frame listen for clicks on a lasting parent, not on redrawn elements", () => {
  const kem = fs.readFileSync("public/sim/kem-organska.js", "utf8");
  const dest = kem.slice(kem.indexOf("export function destilacija"), kem.indexOf("// ----", kem.indexOf("export function destilacija")));
  assert.doesNotMatch(dest, /\bg\.addEventListener\("click"/, "destilacija: frakcija brez lastnega poslušalca");
  assert.match(dest, /svg\.addEventListener\("click"/);
  const tek = fs.readFileSync("public/sim/mat-tek.js", "utf8");
  const han = tek.slice(tek.indexOf("export function hanoi"), tek.indexOf("// ----", tek.indexOf("export function hanoi")));
  assert.doesNotMatch(han, /\bg\.addEventListener\("click"/, "hanoi: palica brez lastnega poslušalca");
  const lab = fs.readFileSync("public/sim/lab.js", "utf8");
  assert.match(lab, /legend\.addEventListener\("click"/);
  assert.match(lab, /if \(sig !== legSig\)/, "legenda grafa se nariše znova le, ko se spremeni");
});

let chromium = null;
before(async () => {
  try {
    const pw = require("playwright").chromium;
    await (await pw.launch()).close();
    chromium = pw;
  } catch {}
});

// Vse simulacije, ki so imele to napako, in nekaj drugih z neprestano animacijo (oder se riše vsako sličico).
const IDS = ["destilacija", "hanoi", "lab-grelnik", "lab-ohlajanje", "lab-mesanje", "lab-faze", "delci", "plini", "nihalo", "orbita", "razpad", "val", "titracija", "hitrost", "populacija", "krozenje"];

test("in a real browser no sim keeps creating clickable elements on its own", { timeout: 180000 }, async (t) => {
  if (!chromium) return t.skip("Playwright chromium ni nameščen");
  const { slabi, napake, skupaj } = await preveri({ ids: IDS, chromium, mirovanje: 900, vzporedno: 6 });
  assert.ok(skupaj >= IDS.length, `preverjenih le ${skupaj} simulacij`);
  assert.deepEqual(napake, [], napake.join("\n"));
  assert.deepEqual(slabi.map((s) => `${s.id} ${JSON.stringify(s.opts)}: ${s.najdbe.join(", ")}`), []);
});
