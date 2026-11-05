// Evklidova tipkovnica (public/tipkovnica.js, tipkovnica-data.js): katera polja jo dobijo, vstavljanje predlog,
// razporeditve po jeziku, funkcije, ki jih kalkulator razume, nastavitve in prevodi.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  prettyIns, autocorrect, autoCapNeeded, doubleSpaceAt, wordsBack, sentenceBack, digitFor,
  fieldKind, usesOwnKeyboard, applyTemplate, deleteBack, stepCaret, withUnit, layoutFor, LAYOUTS, VARIANTS, FX_GROUPS, CAS_SL, KEM_ROWS, KEM_GROUPS,
  NUM_TOP_MATH, TUTOR_CHIPS, parsePrefs, DEFAULT_PREFS, PREF_KEY, suggest, glideDecode,
} from "../public/tipkovnica-data.js";
import { WORDS } from "../public/tipkovnica-besede.js";
import { GROUPS, symGroups } from "../public/symbols.js";
import { DEVICE_SETTINGS, deviceValue } from "../public/settings-registry.js";
import { BUILTINS } from "../public/graph/math.js";
import { evaluate } from "../public/graph/scicore.js";
import { parseCommand, runCas } from "../public/graph/cas.js";
import { UI_LANGUAGES } from "../public/i18n/languages.js";
import SL from "../public/i18n/sl.js";

const ROOT = path.join(import.meta.dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// Preprost »element« za fieldKind (brez DOM).
function el(tag, attrs = {}, { parent = null, editable = false } = {}) {
  const a = { ...attrs };
  return {
    tagName: tag.toUpperCase(),
    type: tag === "input" ? a.type || "text" : undefined,
    disabled: "disabled" in a,
    readOnly: "readonly" in a,
    isContentEditable: editable,
    getAttribute: (k) => (k in a ? a[k] : null),
    hasAttribute: (k) => k in a,
    closest: (sel) => (parent && sel === "[data-system-kb]" && parent.sys ? parent : null),
  };
}

test("which fields get Evklid's keyboard: login e-mail and password keep the phone keyboard", () => {
  assert.equal(fieldKind(el("input")), "text");
  assert.equal(fieldKind(el("input", { type: "search" })), "text");
  assert.equal(fieldKind(el("textarea")), "text");
  assert.equal(fieldKind(el("div", {}, { editable: true })), "text");
  // samo 123
  assert.equal(fieldKind(el("input", { type: "number" })), "num");
  assert.equal(fieldKind(el("input", { inputmode: "decimal" })), "num");
  assert.equal(fieldKind(el("input", { inputmode: "numeric" })), "num");
  assert.equal(fieldKind(el("input", { type: "tel" })), "num");
  // izvirni inputmode šteje, tudi ko ga tipkovnica nastavi na »none«
  assert.equal(fieldKind(el("input", { inputmode: "none" }), "decimal"), "num");
  // prijava in registracija: telefon ponudi shranjeno geslo (j, 31. 10.)
  // e-pošta brez gesla v obrazcu (npr. e-pošta staršev) piše z Evklidovo; z geslom gl. test spodaj (j, 1. 11.)
  for (const a of [{ type: "password" }, { autocomplete: "username" }, { autocomplete: "current-password" }, { autocomplete: "new-password" }, { autocomplete: "one-time-code" }]) {
    assert.equal(fieldKind(el("input", a)), null, JSON.stringify(a));
  }
  // izjeme
  for (const type of ["file", "date", "color", "range", "checkbox", "radio", "submit", "hidden", "time"]) assert.equal(fieldKind(el("input", { type })), null, type);
  assert.equal(fieldKind(el("input", { "data-system-kb": "" })), null);
  assert.equal(fieldKind(el("input", {}, { parent: { sys: true } })), null, "data-system-kb na okvirju");
  assert.equal(fieldKind(el("input", { readonly: "" })), null);
  assert.equal(fieldKind(el("input", { disabled: "" })), null);
  assert.equal(fieldKind(el("select")), null);
  assert.equal(fieldKind(el("button")), null);
  // nastavitev Vedno / Samo za matematiko / Nikoli
  const text = el("input");
  assert.equal(usesOwnKeyboard(text, "always"), true);
  assert.equal(usesOwnKeyboard(text, "math"), false);
  assert.equal(usesOwnKeyboard(text, "math", { math: true }), true);
  assert.equal(usesOwnKeyboard(el("input", { type: "number" }), "math"), true);
  assert.equal(usesOwnKeyboard(text, "never", { math: true }), false);
  assert.equal(usesOwnKeyboard(el("input", { type: "password" }), "always"), false);
});

test("templates: @ marks the caret and takes the selected text", () => {
  assert.deepEqual(applyTemplate("", 0, 0, "√(@)"), { value: "√()", caret: 2, text: "√()" });
  assert.deepEqual(applyTemplate("x16", 1, 3, "√(@)"), { value: "x√(16)", caret: 5, text: "√(16)" });
  assert.deepEqual(applyTemplate("a", 1, 1, "²"), { value: "a²", caret: 2, text: "²" });
  assert.deepEqual(applyTemplate("ab", 1, 1, "(@)/()"), { value: "a()/()b", caret: 2, text: "()/()" });
  assert.equal(applyTemplate("12", 2, 2, "log_(@)()").caret, 7);
  // maxlength: ne preseže meje
  assert.equal(applyTemplate("abc", 3, 3, "def", 4).value, "abcd");
  assert.equal(applyTemplate("abcd", 4, 4, "e", 4).text, "");
  // brisanje in kazalec po celih znakih (tudi znaki zunaj BMP)
  assert.deepEqual(deleteBack("ab", 2, 2), { value: "a", caret: 1 });
  assert.deepEqual(deleteBack("abc", 0, 2), { value: "c", caret: 0 });
  assert.deepEqual(deleteBack("a𝑥", 3, 3), { value: "a", caret: 1 });
  assert.equal(stepCaret("a𝑥b", 1, 1), 3);
  assert.equal(stepCaret("a𝑥b", 3, -1), 1);
  assert.equal(stepCaret("ab", 0, -1), 0);
  // enota pri nalogi zamenja prejšnjo
  assert.equal(withUnit("12", "km/h"), "12 km/h");
  assert.equal(withUnit("12 m/s", "km/h"), "12 km/h");
  // vse predloge imajo največ en @
  const all = [...FX_GROUPS.flatMap(([, , k]) => k), ...NUM_TOP_MATH, ...TUTOR_CHIPS, ...Object.values(GROUPS).flatMap((g) => g.keys.map((x) => [x.label, x.ins]))];
  for (const [label, ins] of all) assert.ok((ins.match(/@/g) || []).length <= 1, label);
});

test("letter layouts per app language", () => {
  const sl = layoutFor("sl");
  assert.equal(sl.id, "sl");
  // kot Gboard na telefonu (j, 4. 11.): QWERTY, č š ž z dolgim pritiskom, namig le na c s z
  assert.deepEqual(sl.rows.map((r) => r.join("")), ["qwertyuiop", "asdfghjkl", "zxcvbnm"]);
  assert.ok(!sl.rows.flat().some((c) => "čšž".includes(c)));
  assert.deepEqual(sl.variants.c, ["č", "ć"]);
  assert.equal(sl.variants.s[0], "š");
  assert.equal(sl.variants.z[0], "ž");
  assert.equal(sl.hints, "csz");
  assert.equal(layoutFor("en").hints, null);
  assert.equal(layoutFor("en").rows[0].join(""), "qwertyuiop");
  const de = layoutFor("de").rows.flat();
  for (const c of ["ä", "ö", "ü", "ß"]) assert.ok(de.includes(c), c);
  for (const code of ["fr", "es", "it", "pl", "tr", "sw", "id", "sq", "ro", "pt"]) {
    const l = layoutFor(code);
    assert.equal(l.rows[0].join(""), "qwertyuiop", code);
    assert.ok(l.variants.e?.length && l.variants.a?.length, `${code}: dolg pritisk za naglase`);
  }
  for (const code of ["hr", "bs", "sr-Latn"]) {
    assert.equal(layoutFor(code).id, "hr", code);
    assert.ok(layoutFor(code).rows.flat().includes("č"), code);
  }
  for (const code of ["cs", "sk", "hu"]) assert.equal(layoutFor(code).rows[0].join(""), "qwertzuiop", code);
  const ar = layoutFor("ar");
  assert.ok(ar.rtl && ar.caseless && !ar.globe);
  assert.ok(ar.rows.flat().every((c) => /\p{Script=Arabic}/u.test(c)));
  assert.ok(layoutFor("fa").rtl && layoutFor("ur").rtl && layoutFor("arz").rtl, "arabska pisava od desne proti levi");
  assert.ok(layoutFor("ru").rows.flat().includes("ы"));
  assert.ok(layoutFor("uk").rows.flat().includes("є"));
  assert.ok(layoutFor("sr").rows.flat().includes("љ") && layoutFor("mk").rows.flat().includes("ќ"));
  // jeziki z načinom za znake: 🌐 da telefonovo tipkovnico za to polje
  for (const code of ["ja", "zh", "zh-Hant", "ko", "hi", "bn", "th", "vi"]) assert.equal(layoutFor(code).globe, true, code);
  for (const code of ["sl", "en", "de", "ar", "ru"]) assert.equal(layoutFor(code).globe, false, code);
  // vsak jezik vmesnika ima razporeditev s tremi vrsticami, največ 11 tipk v vrsti
  for (const code of UI_LANGUAGES) {
    const l = layoutFor(code);
    assert.equal(l.rows.length, 3, code);
    for (const r of l.rows) assert.ok(r.length >= 7 && r.length <= 11, `${code}: ${r.join("")}`);
  }
  for (const [id, v] of Object.entries(VARIANTS)) for (const [k, list] of Object.entries(v)) assert.ok(Array.isArray(list) && list.length, `${id} ${k}`);
  assert.ok(Object.keys(LAYOUTS).length >= 10);
});

test("f(x) keys only insert what the calculator understands; ℂ is among the sets", () => {
  const extra = new Set(["d", "dx", "x", "y", "e", "f", "g", "n", "i", "Ans", "π"]);
  for (const [group, , list] of FX_GROUPS) {
    for (const [label, ins] of list) {
      // Algebra in Analiza: ukazi CAS (public/graph/cas.js, calculus.js), v slovenščini z imeni iz CAS_SL
      if ((group === "alg" || group === "ana") && /^[a-z]{3,}\(/.test(ins)) {
        assert.ok(CAS_SL[label], `${label}: ni v CAS_SL`);
        for (const txt of [ins, ins.replace(label, CAS_SL[label] || label)]) {
          // det, inverz: predloga matrike 2 × 2 → [[a; b]; [c; d]]
          const filled = /\[\[/.test(txt) ? txt.replace("@", "a").replace("[; ]", "[c; d]").replace("; ]", "; b]") : txt.replace("@", /^(solve|reši)/.test(txt) ? "x² − 1 = 0" : "x² − 1").replace(/;\s*\)$/, "; 2)");
          const cmd = parseCommand(filled);
          assert.ok(cmd, `${label}: ${txt} ni ukaz CAS`);
          assert.ok(!runCas(cmd).error, `${label}: ${txt} → ${JSON.stringify(runCas(cmd).error)}`);
        }
        continue;
      }
      for (const name of ins.match(/[a-zA-Z]{2,}(?=\()/g) || []) assert.ok(BUILTINS.has(name) || extra.has(name), `${label}: ${name} ni funkcija kalkulatorja`);
      // znanstveni kalkulator zapis prebere (»@« in prazni argumenti dobijo število); znaki za enačbe so samo delčki
      if (/^(=|;|<|>|≤|≥|[fg]\(x\)=|[∑∏]_)/.test(ins)) continue;
      const filled = ("2" + ins).replaceAll("@", "2").replace(/;(?=[;)])/g, ";3").replace(/\(\)/g, "(3)");
      const r = evaluate(filled);
      assert.ok(!r?.error || r.error.code === "missing", `${label}: ${filled} → ${JSON.stringify(r?.error)}`);
    }
  }
  assert.ok(GROUPS.funkcije.keys.some((k) => k.label === "ℂ"), "ℂ v skupini množic");
  // 3. faza CAS: determinanta in inverz matrike s predlogo 2 × 2 v skupini Algebra
  const alg = FX_GROUPS.find(([g]) => g === "alg")[2].map(([l]) => l);
  assert.ok(alg.includes("det") && alg.includes("inverse"));
  assert.equal(CAS_SL.inverse, "inverz");
  assert.ok(KEM_ROWS.flat().includes("(aq)") && KEM_ROWS.flat().includes("₂") && KEM_ROWS.flat().includes("⇌"));
});

test("kemija je samo enkrat: zavihek Kem ima vse iz čipa Σ, čipa Σ ni, kjer je zavihek (j, 5. 11.)", () => {
  const kem = KEM_ROWS.flat();
  assert.equal(new Set(kem).size, kem.length, "tipka v Kem je dvakrat");
  for (const k of GROUPS.kemija.keys) assert.ok(kem.includes(k.ins), `»${k.label}« je bila samo v čipu Σ, v Kem je ni`);
  for (const [lvl, subj] of [["OS", "MAT"], ["SS", "KEM"], ["FAKS", "KEM"], ["FAKS", "MAT"], ["OS", "FIZ"]]) {
    assert.ok(!symGroups(lvl, subj, true).includes("kemija"), `${lvl} ${subj}: čip Kemija ob zavihku Kem`);
    assert.ok(symGroups(lvl, subj, false).includes("kemija"), `${lvl} ${subj}: brez zavihka Kem čip ostane`);
  }
  // naboj ⁺ je v Kem enkrat in brez še ene »+« v spodnji vrstici
  assert.equal(read("public/tipkovnica.js").includes('key("+", { a: "ins", v: " + " })'), false);
  // dva podzavihka po največ dve vrstici po 10 tipk: zavihek je enako visok kot drugi
  for (const [, , rows] of KEM_GROUPS) assert.ok(rows.length <= 2 && rows.every((r) => r.length <= 10));
});

test("settings: registry keys for the tutor, defaults, stored per device", () => {
  assert.deepEqual(DEVICE_SETTINGS.keyboard.values, ["always", "math", "never"]);
  assert.deepEqual(DEVICE_SETTINGS.keyboard_words.values, ["on", "off"]);
  assert.deepEqual(DEVICE_SETTINGS.keyboard_vibration.values, ["on", "off"]);
  assert.deepEqual(DEVICE_SETTINGS.keyboard_glide.values, ["on", "off"]);
  assert.equal(deviceValue("keyboard", "math"), "math");
  assert.equal(deviceValue("keyboard", "sometimes"), null);
  assert.equal(PREF_KEY, `${JSON.parse(read("brand.json")).slug}.tipkovnica`);
  assert.deepEqual(parsePrefs(null), DEFAULT_PREFS);
  assert.deepEqual(DEFAULT_PREFS, { mode: "always", words: false, buzz: true, glide: true }, "privzeto: Vedno, brez predlogov, s tresljajem, z drsenjem");
  assert.deepEqual(parsePrefs('{"mode":"never","words":true,"glide":false}'), { mode: "never", words: true, buzz: true, glide: false });
  assert.deepEqual(parsePrefs("{pokvarjeno"), DEFAULT_PREFS);
  assert.deepEqual(parsePrefs('{"mode":"x"}').mode, "always");
  const cs = read("public/chat-settings.js");
  for (const k of ["keyboard", "keyboard_words", "keyboard_vibration", "keyboard_glide"]) assert.ok(cs.includes(k), `chat-settings.js: ${k}`);
  // predlogi besed: lokalni seznam, brez klicev
  assert.ok(WORDS.sl.length > 200 && WORDS.sl.includes("enačba"));
  assert.deepEqual(suggest(WORDS.sl, "enač").slice(0, 1), ["enačba"]);
  assert.equal(suggest(WORDS.sl, "Enač")[0], "Enačba");
  assert.deepEqual(suggest(WORDS.sl, ""), []);
  const src = read("public/tipkovnica.js") + read("public/tipkovnica-besede.js");
  assert.ok(!/fetch\(|\/api\//.test(src), "tipkovnica ne kliče strežnika");
});

test("i18n: every keyboard string is in Slovenian and all 32 UI languages, translated", () => {
  const src = read("public/tipkovnica.js") + read("public/tipkovnica-data.js");
  const used = new Set([...src.matchAll(/\bt\(\s*["'`]([a-zA-Z0-9_.]+)["'`]/g)].map((m) => m[1]));
  for (const m of src.matchAll(/"(tk\.[a-zA-Z0-9_.]+|sc\.grp\.[a-z]+)"/g)) used.add(m[1]);
  for (const g of Object.keys(GROUPS)) if (g !== "analiza") used.add(`tk.g.${g}`);
  for (const m of ["always", "math", "never"]) used.add(`tk.set.${m}`);
  const tk = Object.keys(SL).filter((k) => k.startsWith("tk."));
  assert.ok(tk.length >= 20);
  for (const k of used) assert.ok(SL[k], `sl.js: ${k}`);
  const files = UI_LANGUAGES.filter((c) => c !== "sl");
  assert.equal(files.length, 32);
  for (const code of files) {
    const d = JSON.parse(read(`public/i18n/ui/${code}.json`));
    for (const k of [...used, ...tk]) assert.ok(d[k], `${code}: ${k}`);
    // prevedeno, ne slovenska kopija (razen kratic in imen, ki so v več jezikih enaka)
    const same = tk.filter((k) => d[k] === SL[k] && !["tk.l.kem", "tk.g.osnovno", "tk.g.funkcije", "tk.g.kemija", "tk.set.title"].includes(k));
    assert.ok(same.length <= 3, `${code}: neprevedeno ${same.join(", ")}`);
  }
});

test("old keypads are replaced by the shared keyboard", () => {
  const calc = read("public/graph/calc.js");
  assert.ok(!calc.includes("gc-keypad") && !calc.includes("renderKeypad"), "kalkulator nima svoje tipkovnice");
  assert.ok(calc.includes("configureKeyboard"));
  const pad = read("public/pad.js");
  assert.ok(!/class="keys"|data-k="⌫"/.test(pad) && pad.includes("openKeyboard"), "plošča: tipke so Evklidova tipkovnica");
  assert.ok(pad.includes("pad-draw"), "Piši ostane");
  assert.ok(!read("public/index.html").includes('id="sym-panel"'), "Inštruktor: Σ je plast tipkovnice");
  assert.ok(!read("public/symbols.js").includes("mountSymbols"));
  assert.ok(read("public/graph/sci.js").includes("data-kb-own"), "znanstveni kalkulator ima svoje tipke");
  assert.ok(read("public/index.html").includes('href="tipkovnica.css"'));
  // tipke ne vzamejo fokusa, višina tipk ≥ 44 px, ikone imajo opis
  const js = read("public/tipkovnica.js");
  assert.match(js, /addEventListener\("pointerdown", \(e\) => \{\s*e\.preventDefault\(\)/);
  assert.match(read("public/tipkovnica.css"), /\.tk-k \{[^}]*min-height: 44px/);
  assert.match(js, /class="tk-hide"[^>]*aria-label/);
});

test("predlogi besed: vrstica nikoli ni prazna (začetki in vezne besede za sl in en)", async () => {
  const { WORDS, ZACETKI } = await import("../public/tipkovnica-besede.js");
  for (const lang of Object.keys(WORDS)) {
    assert.ok(ZACETKI[lang]?.start?.length >= 3, `${lang}: začetki`);
    assert.ok(ZACETKI[lang]?.next?.length >= 3, `${lang}: vezne besede`);
  }
});

test("telefonova tipkovnica samo za prijavne podatke; povezave in ostala e-pošta pišejo z Evklidovo", () => {
  const form = (pw) => ({ querySelector: (q) => (pw && q.includes("password") ? {} : null) });
  const el = (attrs, f = null) => ({ tagName: "INPUT", type: attrs.type || "text", form: f, getAttribute: (k) => attrs[k] ?? null, hasAttribute: () => false, closest: () => null });
  assert.equal(fieldKind(el({ type: "url", inputmode: "url" })), "text");
  assert.equal(fieldKind(el({ type: "password" })), null);
  assert.equal(fieldKind(el({ type: "email", autocomplete: "email" }, form(true))), null);
  assert.equal(fieldKind(el({ type: "email", autocomplete: "email" }, form(false))), "text");
  assert.equal(fieldKind(el({ type: "text", autocomplete: "username" })), null);
  // čip »@«, @gmail.com in prilepljena povezava: »@« je znak, ne mesto kazalca
  assert.deepEqual(applyTemplate("ana", 3, 3, "@gmail.com", -1, true), { value: "ana@gmail.com", caret: 13, text: "@gmail.com" });
  assert.equal(applyTemplate("", 0, 0, "https://expo.dev/@j/a", -1, true).value, "https://expo.dev/@j/a");
});

test("tablica: tipkovnica čez celo širino, ⌄ v vrstici zavihkov (j, 2. 11.)", async () => {
  const { readFile } = await import("node:fs/promises");
  const css = await readFile(new URL("../public/tipkovnica.css", import.meta.url), "utf8");
  const i = css.indexOf("@media (pointer: coarse) and (min-width: 700px) and (min-height: 600px)");
  assert.ok(i > css.indexOf(".tk-in {"), "pravilo za tablico mora biti za osnovnimi pravili, sicer ga ta povozijo");
  const blk = css.slice(i, css.indexOf("\n}\n", i));
  assert.match(blk, /\.tk-in \{[^}]*max-width: none/);
  assert.match(blk, /\.tk-hide \{[^}]*position: static/);
});

test("tipke v poljih za ljudi: |x| namesto abs(), ⌊x⌋, σ … (j, 2. 11.); kalkulator dobi imena funkcij", () => {
  const raw = /\b(abs|floor|ceil|stdev|total|root|logb|gcd|lcm)\(/;
  const all = [...FX_GROUPS.flatMap((g) => g[2].map((k) => k[1])), ...Object.values(GROUPS).flatMap((g) => g.keys.map((k) => k.ins))];
  for (const ins of all) assert.doesNotMatch(prettyIns(ins, false), raw, ins);
  assert.equal(prettyIns("abs(@)", true), "|@|"); // math.js razume |x|
  assert.equal(prettyIns("floor(@)", true), "floor(@)");
  assert.equal(prettyIns("sin(@)", false), "sin(@)");
});

test("črke kot Gboard: velika začetnica, dva presledka, poteg po ⌫, številke v zgornji vrsti, samopopravek", () => {
  assert.ok(autoCapNeeded("") && autoCapNeeded("Ok. ") && autoCapNeeded("Kaj? ") && autoCapNeeded("a\n"));
  assert.ok(!autoCapNeeded("ok ") && !autoCapNeeded("3.5"));
  assert.equal(doubleSpaceAt("ok "), 2);
  assert.equal(doubleSpaceAt("ok. "), -1);
  assert.equal(wordsBack("ena dve  tri", 12, 2), 4);
  assert.equal(wordsBack("ena", 3, 5), 0);
  assert.equal(digitFor([[..."qwertzuiopš"]], "q"), "1");
  assert.equal(digitFor([[..."qwertzuiopš"]], "p"), "0");
  assert.equal(digitFor([[..."qwertzuiopš"]], "š"), "");
  const w = ["rešitev", "koliko", "enačba", "kako"];
  assert.equal(autocorrect("resitev", w), "rešitev");
  assert.equal(autocorrect("Resitev", w), "Rešitev");
  assert.equal(autocorrect("koilko", w), "koliko");
  assert.equal(autocorrect("kako", w), null);
  assert.equal(autocorrect("mačka", w), null); // neznane besede ostanejo
  assert.equal(autocorrect("NASA", w), null);
});

// ---------- drsenje po črkah ----------
// Mreža tipk kot v razporeditvi: tipka 40 × 50, tretja vrstica zamaknjena.
function keyGrid(lang = "sl") {
  const centers = {};
  layoutFor(lang).rows.forEach((row, r) => row.forEach((c, i) => (centers[c] = { x: 20 + i * 40 + (r === 2 ? 40 : r === 1 ? 10 : 0), y: 25 + r * 50 })));
  return centers;
}
// pot prsta: ravne črte skozi središča tipk besede, z malo šuma
function pathFor(word, centers, jitter = 6) {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * 2 * jitter;
  const FOLD = { č: "c", š: "s", ž: "z", ć: "c", đ: "d" };
  const ks = [...word].map((c) => (centers[c] ? c : FOLD[c])).filter((c, i, a) => c !== a[i - 1]).map((c) => centers[c]);
  const out = [];
  for (let i = 0; i < ks.length - 1; i++) for (let t = 0; t < 8; t++) out.push({ x: ks[i].x + ((ks[i + 1].x - ks[i].x) * t) / 8 + rnd(), y: ks[i].y + ((ks[i + 1].y - ks[i].y) * t) / 8 + rnd() });
  out.push({ x: ks.at(-1).x + rnd(), y: ks.at(-1).y + rnd() });
  return out;
}
test("glide: besedo prepozna iz poti prsta (k-e-m-i-j-a)", async () => {
  const { GLIDE_SL } = await import("../public/tipkovnica-glide-sl.js");
  const g = keyGrid();
  const list = ["kemija", "kemijo", "kamera", "kosi", "enačba", "reši", "rešitev", "čas", "šola", "žoga", "kot", "bit", "pot", "pit"];
  for (const w of ["kemija", "enačba", "rešitev", "žoga", "šola", "čas"]) {
    assert.equal(glideDecode(pathFor(w, g), g, list)[0], w, w);
  }
  // veliki seznam (13 tisoč besed): pravilna beseda je skoraj vedno prva, v prvih treh pa skoraj vedno
  let tried = 0;
  let top1 = 0;
  let top3 = 0;
  for (const w of WORDS.sl.filter((x) => x.length >= 4)) {
    if (![...w].every((c) => g[c])) continue;
    tried++;
    const r = glideDecode(pathFor(w, g), g, GLIDE_SL, { n: 3 });
    if (r[0] === w) top1++;
    if (r.includes(w)) top3++;
  }
  assert.ok(tried > 100);
  assert.ok(top1 / tried > 0.93 && top3 / tried > 0.97, `prva ${top1}/${tried}, prve tri ${top3}/${tried}`);
});
test("glide: prva in zadnja črka določata kandidate, podvojene črke se strnejo", () => {
  const g = keyGrid();
  const out = glideDecode(pathFor("sedaj", g), g, ["tedaj", "sedaj", "sedem", "seja"], { n: 3 });
  assert.equal(out[0], "sedaj");
  assert.ok(!out.includes("sedem"), "zadnja črka m je predaleč od j");
  const dbl = glideDecode(pathFor("pomoč", g), g, ["pomoč", "poomoč", "pomooč"]);
  assert.ok(dbl.includes("pomoč"));
  assert.deepEqual(glideDecode(pathFor("ta", g), g, ["tt", "ta", "tat"]).slice(0, 1), ["ta"]);
  assert.deepEqual(glideDecode([{ x: 5000, y: 5000 }, { x: 5100, y: 5000 }], g, ["ta"]), [], "prst zunaj tipk");
  assert.deepEqual(glideDecode([{ x: 20, y: 25 }], g, ["ta"]), []);
  assert.deepEqual(glideDecode(pathFor("ta", g), g, []), []);
});
test("glide: š č ž so svoje tipke v hr; v sl in drugje gre črka na osnovno tipko", () => {
  const hr = keyGrid("hr");
  assert.ok(hr["š"] && hr["č"] && hr["ž"]);
  assert.equal(glideDecode(pathFor("šola", hr), hr, ["sola", "šola", "pola"])[0], "šola");
  const sl = keyGrid("sl");
  assert.ok(!sl["š"] && !sl["č"] && !sl["ž"]);
  assert.equal(glideDecode(pathFor("enačba", sl), sl, ["enačba", "enaka", "enota"])[0], "enačba", "č na tipki c");
  const en = keyGrid("qwerty");
  assert.ok(!en["š"]);
  assert.equal(glideDecode(pathFor("sola", en), en, ["šola", "pola", "kola"])[0], "šola", "š na tipki s");
});
test("glide: dovolj hitro tudi pri velikem seznamu", async () => {
  const { GLIDE_SL } = await import("../public/tipkovnica-glide-sl.js");
  const g = keyGrid();
  const t0 = performance.now();
  for (let i = 0; i < 10; i++) glideDecode(pathFor("kemija", g), g, GLIDE_SL);
  assert.ok((performance.now() - t0) / 10 < 60, "pod 60 ms na drsenje");
});
test("glide: slovar je veljaven, WORDS.sl na začetku, brez dvojnikov, pod 150 KB", async () => {
  const { GLIDE_SL } = await import("../public/tipkovnica-glide-sl.js");
  assert.ok(GLIDE_SL.length > 5000);
  assert.deepEqual(GLIDE_SL.slice(0, new Set(WORDS.sl).size), [...new Set(WORDS.sl)]);
  assert.equal(new Set(GLIDE_SL).size, GLIDE_SL.length, "brez dvojnikov");
  assert.ok(GLIDE_SL.every((w) => /^\p{L}{1,20}$/u.test(w)), "samo črke");
  assert.ok(fs.statSync(path.join(ROOT, "public/tipkovnica-glide-sl.js")).size < 150 * 1024);
  assert.ok(GLIDE_SL.includes("enačba") && GLIDE_SL.includes("kemija"));
});

test("sentenceBack: troklik na ⌫ izbriše poved do konca prejšnje (presledek za piko ostane)", () => {
  const v = "Prva poved. Druga po";
  assert.equal(v.slice(0, sentenceBack(v, v.length)), "Prva poved. ");
  assert.equal(sentenceBack("Prva poved.", 11), 0);
  assert.equal(sentenceBack("Ali je? Da!  ", 13), 8);
  assert.equal(sentenceBack("vrstica\nnova vrst", 17), 8);
  assert.equal(sentenceBack("x = 3.5 cm", 10), 0, "decimalna pika brez presledka ni konec povedi");
  assert.equal(sentenceBack("", 0), 0);
  const w = "Prva poved. Druga ";
  assert.equal(w.slice(0, sentenceBack(w, w.length)), "Prva poved. ");
});
