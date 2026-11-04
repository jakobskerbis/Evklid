import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import SL from "../public/i18n/sl.js";
import { GUIDE, APP_GUIDE } from "../public/vodic.js";

test("vodič po aplikaciji: besedila obstajajo, povezave vodijo v obstoječe dele (splet in aplikacija)", () => {
  const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  const icons = fs.readFileSync(new URL("../public/icons.js", import.meta.url), "utf8");
  for (const g of GUIDE) {
    assert.ok(SL[g.title] && SL[g.text], `${g.id}: manjka besedilo`);
    assert.ok(icons.includes(`"${g.icon}":`), `${g.id}: ikona ${g.icon}`);
    if (g.view) assert.ok(html.includes(`id="view-${g.view}"`), `${g.id}: pogled ${g.view}`);
  }
  for (const k of ["guide.title", "guide.intro"]) assert.ok(SL[k], k);
  assert.ok(APP_GUIDE.length >= 5);
  const route = (p) => (p === "/" ? "(tabs)/index" : fs.existsSync(new URL(`../mobile/src/app/(tabs)${p}.tsx`, import.meta.url)) ? `(tabs)${p}` : p.slice(1));
  for (const g of APP_GUIDE.filter((x) => typeof x.app === "string")) {
    assert.ok(fs.existsSync(new URL(`../mobile/src/app/${route(g.app)}.tsx`, import.meta.url)), `${g.id}: zaslon ${g.app}`);
  }
  assert.ok(fs.existsSync(new URL("../mobile/src/app/vodic.tsx", import.meta.url)));
});
