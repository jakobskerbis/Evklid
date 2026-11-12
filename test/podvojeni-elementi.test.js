// Podvojeni elementi (j, 12. 11.): ista izbira ali povezava ni dvakrat na istem zaslonu.
// Pregled vseh zaslonov: /mnt/project-files/evklid/redundanca/ (popis.cjs, najdbe-2026-11-12.md).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

globalThis.document ??= { documentElement: { dataset: {} }, querySelectorAll: () => [] };
const { mountPapers } = await import("../public/exam-papers.js");
const pub = (f) => fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");

const PAPERS = [
  { exam: "NPZ9", subject: "MAT", year: 2025, term: "main", files: [{ kind: "paper", url: "https://www.ric.si/mma/a.pdf" }] },
  { exam: "MATURA", subject: "MAT", level: "OR", year: 2025, term: "spring", files: [{ kind: "paper", url: "https://www.ric.si/mma/b.pdf" }] },
];
const click = (box, attr) => box.onclick({ target: { closest: (sel) => (sel === attr ? { dataset: {} } : null) } });

test("NPZ in matura: past papers follow the chips at the top, the full picker only behind »Druge pretekle pole«", () => {
  const box = { innerHTML: "" };
  mountPapers(box, PAPERS, { track: "OSNOVNA_SOLA", exam: "NPZ9", subject: "MAT", level: "OR" }, { follow: true });
  assert.match(box.innerHTML, /ric\.si\/mma\/a\.pdf/);
  assert.doesNotMatch(box.innerHTML, /data-pp-key|data-pp-step/, "šola, izpit in predmet se ne izbirajo še enkrat");
  assert.match(box.innerHTML, /data-pp-other/);
  click(box, "[data-pp-other]");
  assert.match(box.innerHTML, /data-pp-key="track"/, "»Druge pretekle pole« odpre celotno izbiro");
  assert.doesNotMatch(box.innerHTML, /data-pp-other/);
  // Izbira brez pol: sporočilo in povezava, brez drugega izbirnika.
  mountPapers(box, PAPERS, { track: "OSNOVNA_SOLA", exam: "NPZ9", subject: "FIZ" }, { follow: true });
  assert.doesNotMatch(box.innerHTML, /data-pp-key/);
  assert.match(box.innerHTML, /data-pp-other/);
  // Brez follow (drugje) ostane izbira po korakih.
  mountPapers(box, PAPERS, { track: "OSNOVNA_SOLA", exam: "NPZ9", subject: "MAT" });
  assert.match(box.innerHTML, /data-pp-step="exam"/);
  assert.match(pub("app.js"), /mountPapers\(slot, papers, [^\n]+\n[^\n]+\n\s+follow: true,/);
});

test("Jaz: overview does not repeat the bottom bar or the list above it", () => {
  const app = pub("app.js");
  const fn = app.slice(app.indexOf("async function loadMeOverview()"), app.indexOf('$("#me-overview")?.addEventListener'));
  assert.ok(fn.length > 200);
  for (const go of ["path", "chat", "progress"]) assert.ok(!fn.includes(`"${go}"`) && !fn.includes(`data-me="${go}"`), go);
  assert.ok(!/me-ov-head"><h2>\$\{t\("sch\.upcoming"\)\}<\/h2><button/.test(fn), "gumb Urnik ob naslovu");
  assert.match(fn, /row\("daily"/);
});

test("Videz: no style Temen next to the dark mode; old Temen becomes Čist + dark", () => {
  assert.ok(!/"temen"/.test(pub("appearance.js")));
  assert.ok(!/temen/.test(pub("ui.css")));
  const theme = pub("theme.js");
  assert.match(theme, /const STYLES = \["cist", "igriv", \.\.\.Object\.keys\(ERAS\)\]/);
  assert.match(theme, /if \(s\.style === "temen"\) Object\.assign\(s, \{ style: "cist", mode: "dark" \}\)/);
  assert.ok(!pub("settings-registry.js").includes('"temen"'));
});

test("Profile menu does not repeat tabs; feedback has one name", () => {
  const menu = pub("profile-menu.js");
  assert.ok(!/item\("settings"|item\("feedback"/.test(menu));
  assert.match(menu, /item\("zbirke"/, "Zbirke so na računalniku samo v meniju profila");
  assert.ok(!pub("index.html").includes("nav.feedbackShort"));
  assert.ok(!pub("i18n/sl.js").includes("nav.feedbackShort"));
});
