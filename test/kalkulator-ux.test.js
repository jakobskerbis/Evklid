// AUDIT-082, 083, 086: drobni popravki videza in dostopnosti kalkulatorja (docs/revizija/register.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const src = (f) => fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");

test("AUDIT-086: polja razmerja in koeficientov v Orodjih imajo dostopno ime", () => {
  const t = src("graph/tools.js");
  for (const c of ["tl-ra", "tl-co"]) assert.match(t, new RegExp(`<input class="${c}"[^>]*aria-label="\\$\\{l\\}"`), c);
});

test("AUDIT-083: zgodovina znanstvenega kalkulatorja nima malega drsnika", () => {
  const css = src("graph.css");
  assert.match(css, /\.sc-history \{[^}]*overflow-y: auto;[^}]*scrollbar-width: none;/);
  assert.match(css, /\.sc-history::-webkit-scrollbar[^{]*\{ display: none; \}/);
});

test("AUDIT-082: izbira regresije brez surovega zapisa potence v živih jezikih", async () => {
  const { LIVE_UI_LANGUAGES } = await import("../public/i18n/languages.js");
  const sl = src("i18n/sl.js").match(/"gc\.reg\.expe": "([^"]*)"/)[1];
  const vsi = [sl, ...LIVE_UI_LANGUAGES.filter((l) => l !== "sl").map((l) => JSON.parse(src(`i18n/ui/${l}.json`))["gc.reg.expe"])];
  for (const s of vsi) assert.ok(s.includes("a·eᵇˣ") && !s.includes("^"), s);
});
