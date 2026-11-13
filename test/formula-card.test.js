// Kartica oznake brez DOM (public/formula-card.js): enaka na spletu in v aplikaciji na telefonu
// (mobile/src/lib/rich.ts izriše klikljive črke z istim označevanjem in odpre to kartico).
import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { Marked } from "marked";
import { createRenderer } from "../public/rich.js";
import { annotateTex, withFormulaSubject } from "../public/formula-data.js";
import { cardFor, configureCard } from "../public/formula-card.js";
import SL from "../public/i18n/sl.js";

configureCard({ katex, t: (k, v = {}) => String(SL[k] || k).replace(/\{(\w+)\}/g, (_, n) => v[n] ?? "") });
const fxRender = createRenderer({ marked: new Marked(), katex, sanitize: (h) => h, annotate: (tex) => annotateTex(tex) });
const codes = (html) => [...html.matchAll(/data-fx="([^"]+)"/g)].map((m) => decodeURIComponent(m[1].replace(/\./g, "%")));

test("aplikacija: črke v formuli dobijo data-fx s pomenom iz lekcije, kartica se zgradi brez DOM", () => {
  const symbols = [{ keys: ["T"], tex: ["T"], n: "prepustnost (transmitanca)", r: "T = \\frac{I}{I_0}", u: "–", note: "" }];
  const html = withFormulaSubject("KEM", () => fxRender.renderRich("$T = \\frac{I}{I_0}$"), symbols);
  const c = codes(html).find((x) => x.endsWith(":T"));
  assert.ok(c && c.split(":")[1][0] === "@", "T iz oznak lekcije");
  const card = cardFor(c);
  assert.match(card.label, /prepustnost/);
  assert.match(card.html, /fx-title/);
});

test("aplikacija: brez oznak lekcije velja slovar predmeta (sila v fiziki)", () => {
  const html = withFormulaSubject("FIZ", () => fxRender.renderRich("$F = m a$"), null);
  const card = cardFor(codes(html).find((x) => x.endsWith(":F")));
  assert.match(card.label, /sila/);
});
