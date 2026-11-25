// Napake 3D sveta (public/3d/napake.js): vsaka napaka ne sme reči »Preveri povezavo«. Star Safari (SyntaxError) mora
// dobiti navodilo za posodobitev, premalo pomnilnika nasvet za nižjo kakovost, neznana napaka kodo.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { napakaBesedilo, napakaVsebina, tehnicno, osveziMimoStarih } from "../public/3d/napake.js";

const na = (err) => napakaBesedilo(err, { naVoljo: true });

test("star brskalnik: SyntaxError → posodobi sistem in brskalnik", () => {
  assert.equal(na(new SyntaxError("Unexpected token '{'")).key, "a3.oldBrowser");
  assert.equal(na({ koda: "brskalnik" }).key, "a3.oldBrowser");
});

test("pomnilnik: RangeError, »out of memory«, izgubljen kontekst → nižja kakovost", () => {
  assert.equal(na(new RangeError("Array buffer allocation failed")).key, "a3.lowMemory");
  assert.equal(na(new Error("Out of memory")).key, "a3.lowMemory");
  assert.equal(na(new Error("WebGL: CONTEXT_LOST_WEBGL")).key, "a3.lowMemory");
  assert.equal(na({ koda: "pomnilnik" }).vrsta, "pomnilnik");
});

test("povezava: Safari »Load failed«, Chrome »Failed to fetch«, uvoz modula, HTTP 404 in 500, brez povezave", () => {
  for (const m of ["Load failed", "Failed to fetch", "Importing a module script failed.", "error loading dynamically imported module", "Failed to fetch dynamically imported module: https://x/3d/a.js", "NetworkError when attempting to fetch resource."]) {
    assert.equal(na(new TypeError(m)).key, "a3.loadError", m);
  }
  const http404 = na(Object.assign(new Error('fetch for "https://x/a.glb" responded with 404: Not Found'), { response: { status: 404 } }));
  assert.deepEqual([http404.key, http404.detail], ["a3.loadError", "HTTP 404"]);
  assert.equal(na(new Error("HTTP 500")).key, "a3.loadError");
  assert.equal(na({ status: 503 }).key, "a3.loadError");
  // brez povezave: tudi napaka, ki je sicer ne bi prepoznali, pomeni povezavo
  assert.equal(napakaBesedilo(new TypeError("x is not a function"), { naVoljo: false }).key, "a3.loadError");
});

test("WebGL ostane svoje sporočilo, neznana napaka dobi splošno besedilo in ime napake", () => {
  assert.equal(na({ koda: "webgl" }).key, "a3.noWebgl");
  const r = na(new TypeError("Cannot read properties of undefined (reading 'x')"));
  assert.deepEqual([r.key, r.vrsta, r.detail], ["a3.otherError", "drugo", "TypeError"]);
  assert.equal(na(null).key, "a3.otherError");
  assert.equal(na("niz").detail, "Error");
});

test("vsak ključ ima besedilo v slovenščini in v živih jezikih", async () => {
  const { default: SL } = await import("../public/i18n/sl.js");
  const { LIVE_UI_LANGUAGES } = await import("../public/i18n/languages.js");
  const kljuci = ["a3.oldBrowser", "a3.lowMemory", "a3.lowQuality", "a3.otherError", "a3.errorTech", "a3.updated", "a3.retry", "a3.loadError", "a3.noWebgl"];
  for (const k of kljuci) assert.ok(SL[k], `sl: ${k}`);
  for (const jezik of LIVE_UI_LANGUAGES.filter((j) => j !== "sl")) {
    const ui = JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${jezik}.json`, import.meta.url), "utf8"));
    for (const k of kljuci) assert.ok(ui[k], `${jezik}: ${k}`);
  }
});

test("star modul ob novem (service worker): manjkajoč izvoz ni star brskalnik, ampak posodobitev z osvežitvijo", () => {
  for (const m of ["The requested module './scena.js' does not provide an export named 'locljivostPlatna'", "Importing binding name 'napakaVsebina' is not found.", "ambiguous indirect export: x"]) {
    const r = na(new SyntaxError(m));
    assert.deepEqual([r.vrsta, r.key, r.modul], ["posodobitev", "a3.updated", true], m);
  }
  // uvoz modula prek omrežja: besedilo o povezavi, »Poskusi znova« pa osveži mimo starih kopij
  assert.equal(na(new TypeError("Importing a module script failed.")).modul, true);
  assert.equal(na(new TypeError("Failed to fetch dynamically imported module: https://x/3d/a.js")).modul, true);
  assert.equal(na(new TypeError("Failed to fetch")).modul, false);
});

test("tehnični razlog: ime in prva vrstica, največ 120 znakov, brez poizvedbe v naslovu in brez žetonov", () => {
  assert.equal(tehnicno(new RangeError("Array buffer allocation failed\n    at x (y.js:1:2)")), "RangeError: Array buffer allocation failed");
  assert.equal(tehnicno(new TypeError("Failed to fetch dynamically imported module: https://evklid.si/3d/modeli/celice/a.js?v=123&token=abc")), "TypeError: Failed to fetch dynamically imported module: /3d/modeli/celice/a.js");
  assert.ok(!tehnicno(new Error("napaka abcdefghijklmnopqrstuvwxyz0123456789ABCDEF")).includes("abcdefghij"));
  assert.ok(tehnicno(new Error("x".repeat(400))).length <= 120);
  assert.equal(tehnicno(null), "");
  assert.equal(tehnicno({ name: "SyntaxError" }), "SyntaxError");
});

// Najmanjši DOM za kartico (Node nima document).
function lazniDokument() {
  const el = (tag) => ({
    tag,
    className: "",
    textContent: "",
    dataset: {},
    href: "",
    type: "",
    poslusalci: {},
    addEventListener(d, f) {
      this.poslusalci[d] = f;
    },
  });
  return { createElement: el };
}
const t = (k, v) => (v ? `${k} ${JSON.stringify(v)}` : k);

test("kartica: besedilo, »Tehnično«, gumb pokliče znova; pri uvozu modula osveži mimo starih kopij", () => {
  globalThis.document = lazniDokument();
  try {
    let klici = 0;
    const [p, teh, b] = napakaVsebina(new TypeError("x is not a function"), { t, znova: () => klici++ });
    assert.equal(p.textContent, "a3.otherError");
    assert.match(teh.textContent, /^a3\.errorTech .*TypeError: x is not a function/);
    assert.equal(b.dataset.znova, "znova");
    b.poslusalci.click();
    assert.equal(klici, 1);
    // star brskalnik: brez gumba (ponovni poskus ne pomaga)
    assert.ok(!napakaVsebina(new SyntaxError("Unexpected token '{'"), { t, znova: () => klici++ }).some((x) => x.tag === "button"));
    // napaka uvoza: gumb je tudi brez znova (mikroskop) in osveži stran
    const brez = napakaVsebina(new SyntaxError("does not provide an export named 'x'"), { t });
    assert.equal(brez.at(-1).dataset.znova, "osvezi");
  } finally {
    delete globalThis.document;
  }
});

test("osvežitev mimo starih kopij: service worker dobi »app-stale« z različico strežnika, nato reload", async () => {
  const prej = globalThis.fetch;
  const sporocila = [];
  let osvezeno = 0;
  globalThis.fetch = async (u) => ({ ok: String(u).includes("/healthz/stanje"), json: async () => ({ datoteke: "abc123" }) });
  try {
    const okno = {
      navigator: { serviceWorker: { controller: { postMessage: (m, [port]) => (sporocila.push(m), port.postMessage("ok")) } } },
      location: { reload: () => osvezeno++ },
    };
    await osveziMimoStarih({ okno });
    assert.deepEqual(sporocila, [{ type: "app-stale", app: "abc123" }]);
    assert.equal(osvezeno, 1);
    // brez service workerja: samo osvežitev
    await osveziMimoStarih({ okno: { navigator: {}, location: { reload: () => osvezeno++ } } });
    assert.equal(osvezeno, 2);
  } finally {
    globalThis.fetch = prej;
  }
});

// Pregled #1064: SyntaxError iz JSON ali izbirnika ni »prestar brskalnik«; RangeError ni vedno pomnilnik.
test("HTML namesto JSON (prestrezna stran) je povezava s ponovnim poskusom, neveljaven izbirnik je druga napaka", () => {
  for (const m of [`Unexpected token '<', "<!DOCTYPE "... is not valid JSON`, "JSON Parse error: Unrecognized token '<'", "JSON.parse: unexpected character at line 1 column 1 of the JSON data"]) {
    const r = na(new SyntaxError(m));
    assert.deepEqual([r.vrsta, r.key], ["povezava", "a3.loadError"], m);
  }
  const izbirnik = na(Object.assign(new Error("'#3d' is not a valid selector."), { name: "SyntaxError" }));
  assert.deepEqual([izbirnik.vrsta, izbirnik.key], ["drugo", "a3.otherError"]);
  // pravi star brskalnik ostane
  assert.equal(na(new SyntaxError("Unexpected token '{'. Expected a ')' or a ',' after a parameter declaration.")).vrsta, "brskalnik");
});

test("RangeError je pomnilnik samo s sporočilom o pomnilniku ali medpomnilniku", () => {
  assert.equal(na(new RangeError("Array buffer allocation failed")).vrsta, "pomnilnik");
  assert.equal(na(new RangeError("Out of memory")).vrsta, "pomnilnik");
  const prirezan = na(new RangeError("Offset is outside the bounds of the DataView"));
  assert.deepEqual([prirezan.vrsta, prirezan.detail], ["drugo", "RangeError"]);
  assert.equal(na(new RangeError("Maximum call stack size exceeded")).vrsta, "drugo");
});

test("napaka z povezava: true (naloziModel brez povezave) je napaka povezave", () => {
  assert.equal(na(Object.assign(new Error("model ni na voljo"), { povezava: true })).vrsta, "povezava");
});

test("tehnični razlog: naslov z oklepaji ne pušča poizvedbe, e-pošta je skrita", () => {
  assert.equal(tehnicno(new Error("x https://x/a(b)?k=s(x)&y=1 konec")), "Error: x /a(b) konec");
  assert.equal(tehnicno(new Error("(at https://x/b.js?t=1&u=2)")), "Error: (at /b.js");
  assert.equal(tehnicno(new Error("napaka za ana.novak@primer.si pri /a.js?k=1&m=2")), "Error: napaka za [e-pošta] pri /a.js");
  assert.equal(tehnicno(new SyntaxError("Unexpected token '?'")), "SyntaxError: Unexpected token '?'");
});

test("aplikacija (Web3D.tsx): števec padcev procesa strani se ponastavi po uspešnem nalaganju", () => {
  const src = fs.readFileSync(new URL("../mobile/src/components/Web3D.tsx", import.meta.url), "utf8");
  assert.match(src, /onLoad=\{\(\) => \(loadedAt\.current = Date\.now\(\)\)\}/);
  assert.match(src, /if \(loadedAt\.current && Date\.now\(\) - loadedAt\.current > 60_000\) crashes\.current = 0;/);
  assert.match(src, /onContentProcessDidTerminate=\{reloadAfterCrash\}/);
});
