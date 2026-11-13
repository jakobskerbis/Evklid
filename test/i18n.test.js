import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import SL from "../public/i18n/sl.js";
import { LANGUAGES, LANGUAGE_CODES, UI_LANGUAGES, RTL, uiChain, uiLanguage, langInfo, detectLanguage, homeLanguage } from "../public/i18n/languages.js";
import { buildSystemPrompt, systemBlocks, languagePrompt } from "../server/prompt.js";
import { normalizeSettings } from "../server/settings.js";

const UI_DIR = path.join(import.meta.dirname, "..", "public", "i18n", "ui");
const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const forms = (v) => (typeof v === "object" ? Object.values(v) : [v]);

test("language list: unique codes, all over a million speakers, every fallback leads to a translated UI", () => {
  assert.ok(LANGUAGES.length >= 250, `samo ${LANGUAGES.length} jezikov`);
  assert.equal(new Set(LANGUAGE_CODES).size, LANGUAGE_CODES.length, "podvojena koda");
  for (const [code, native, english, fallback, speakers] of LANGUAGES) {
    assert.ok(native && english, code);
    assert.ok(speakers >= 1, `${code}: ${speakers}`);
    if (fallback) assert.ok(LANGUAGE_CODES.includes(fallback), `${code} → ${fallback}`);
    assert.ok(UI_LANGUAGES.includes(uiLanguage(code)) || uiLanguage(code) === "sr-Latn", code);
  }
  for (const code of RTL) assert.ok(LANGUAGE_CODES.includes(code), code);
  for (const code of UI_LANGUAGES) assert.ok(LANGUAGE_CODES.includes(code), code);
  assert.deepEqual(uiChain("bho"), ["bho", "hi", "en", "sl"]);
  assert.equal(uiLanguage("yue"), "zh-Hant");
  assert.equal(uiLanguage("xx"), "sl");
  assert.equal(langInfo("ar").rtl, true);
});

test("every UI translation has exactly the Slovenian keys and the same placeholders", () => {
  const keys = Object.keys(SL).sort();
  for (const code of UI_LANGUAGES.filter((c) => c !== "sl")) {
    const file = path.join(UI_DIR, `${code}.json`);
    assert.ok(fs.existsSync(file), `manjka ${code}.json`);
    const d = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.deepEqual(Object.keys(d).sort(), keys, `${code}: ključi se ne ujemajo`);
    for (const k of keys) {
      const want = vars(forms(SL[k])[0]).filter((v) => v !== "n");
      for (const f of forms(d[k])) {
        assert.equal(typeof f, "string", `${code} ${k}`);
        assert.ok(f.trim(), `${code} ${k} je prazen`);
        for (const v of vars(f)) assert.ok(vars(forms(SL[k]).join(" ")).includes(v), `${code} ${k}: neznana spremenljivka {${v}}`);
        for (const v of want) assert.ok(vars(f).includes(v), `${code} ${k}: manjka {${v}}`);
      }
      if (typeof SL[k] === "object") assert.ok(typeof d[k] === "object" && d[k].other, `${code} ${k}: potrebuje množinske oblike z »other«`);
    }
  }
});

test("Slovenian catalog: plural keys have every Slovenian form", () => {
  for (const [k, v] of Object.entries(SL)) {
    if (typeof v === "object") for (const f of ["one", "two", "few", "other"]) assert.ok(v[f], `${k}.${f}`);
  }
});

test("chosen language reaches the tutor prompt below the cache line; default is Slovenian", () => {
  assert.equal(normalizeSettings({}).language, "sl");
  assert.equal(normalizeSettings({ language: "de" }).language, "de");
  assert.equal(normalizeSettings({ language: "klingon" }).language, "sl");
  const de = buildSystemPrompt({ settings: normalizeSettings({ language: "de" }), studentName: "Lena" });
  const sl = buildSystemPrompt({ settings: normalizeSettings({}), studentName: "Lena" });
  const [sDe, dDe] = systemBlocks(de);
  const [sSl, dSl] = systemBlocks(sl);
  assert.equal(sDe.text, sSl.text, "stalni del mora ostati enak za vse jezike");
  assert.match(sDe.text, /### Jezik pogovora/);
  assert.match(dDe.text, /Jezik pogovora: German – Deutsch \(de\)/);
  assert.match(dSl.text, /Jezik pogovora: slovenščina \(sl\)/);
  assert.equal(languagePrompt("ar"), "Arabic (Standard) – العربية (ar)");
});

test("first start picks the device language and region, the nearest variant, else English", () => {
  const d = (...tags) => detectLanguage(tags);
  assert.deepEqual(d("sl-SI", "en"), { code: "sl", region: "SI" });
  assert.deepEqual(d("de-AT"), { code: "de", region: "AT" });
  assert.deepEqual(d("pt-BR"), { code: "pt", region: "BR" });
  assert.equal(d("zh-TW").code, "zh-Hant");
  assert.equal(d("zh-HK").code, "zh-Hant");
  assert.equal(d("zh-CN").code, "zh");
  assert.equal(d("sr-Latn-RS").code, "sr-Latn");
  assert.equal(d("ar-EG").code, "arz");
  assert.equal(d("ar-SA").code, "ar");
  assert.equal(d("no").code, "nb");
  assert.equal(d("fil-PH").code, "tl");
  assert.equal(d("xx-YY", "fr-CA").code, "fr");
  assert.deepEqual(d("qq"), { code: "en", region: "" });
  assert.deepEqual(d(), { code: "en", region: "" });
});

test("English device in Slovenia starts in Slovenian, other languages stay", () => {
  assert.equal(homeLanguage("en", "Europe/Ljubljana"), "sl");
  assert.equal(homeLanguage("de", "Europe/Ljubljana"), "de");
  assert.equal(homeLanguage("en", "Europe/London"), "en");
  assert.equal(homeLanguage("en", ""), "en");
});

test("device language also works without Intl.Locale (phone app on Hermes)", () => {
  const saved = Intl.Locale;
  try {
    delete Intl.Locale;
    const d = (...tags) => detectLanguage(tags);
    assert.deepEqual(d("sl-SI", "en"), { code: "sl", region: "SI" });
    assert.deepEqual(d("sl_SI"), { code: "sl", region: "SI" });
    assert.deepEqual(d("de-AT"), { code: "de", region: "AT" });
    assert.equal(d("zh-TW").code, "zh-Hant");
    assert.equal(d("zh-CN").code, "zh");
    assert.equal(d("sr-Latn-RS").code, "sr-Latn");
    assert.equal(d("ar-EG").code, "arz");
    assert.equal(d("no").code, "nb");
    assert.equal(d("xx-YY", "fr-CA").code, "fr");
    assert.deepEqual(d("qq"), { code: "en", region: "" });
  } finally {
    Intl.Locale = saved;
  }
});

test("region reaches the tutor prompt and is validated", () => {
  assert.equal(normalizeSettings({ region: "BR" }).region, "BR");
  assert.equal(normalizeSettings({ region: "brazil" }).region, "");
  assert.equal(languagePrompt("pt", "BR"), "Portuguese – Português (pt), regija: Brazil (BR)");
  assert.equal(languagePrompt("sl", "SI"), "slovenščina (sl)");
  const p = buildSystemPrompt({ settings: normalizeSettings({ language: "pt", region: "BR" }), studentName: "Ana" });
  assert.match(systemBlocks(p)[1].text, /Jezik pogovora: Portuguese – Português \(pt\), regija: Brazil \(BR\)/);
});
