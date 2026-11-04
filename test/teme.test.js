// Zgodovinski slogi (public/theme.js → ERAS): kontrast v svetlem in temnem načinu, datoteke motivov,
// prevodi in nastavitev za inštruktorja. Nov slog iz docs/oblikovanje.md mora prestati te teste.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import SL from "../public/i18n/sl.js";
import { DEVICE_SETTINGS } from "../public/settings-registry.js";

const PUB = path.join(import.meta.dirname, "..", "public");

function loadTheme() {
  const store = new Map();
  const el = () => ({ style: { setProperty() {}, removeProperty() {} }, dataset: {}, classList: { toggle() {}, add() {} }, removeAttribute() {}, setAttribute() {}, appendChild() {} });
  const window = {
    localStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k), key: () => null, length: 0 },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    document: { documentElement: el(), head: el(), querySelector: () => null, createElement: el },
    navigator: {},
    dispatchEvent() {},
    CustomEvent: class {},
  };
  window.window = window;
  vm.runInNewContext(fs.readFileSync(path.join(PUB, "theme.js"), "utf8").replace("Object.keys(localStorage)", "[]"), window);
  return window.STEMTheme;
}

const T = loadTheme();
const cap = (s) => s[0].toUpperCase() + s.slice(1);

test("every history style passes the contrast check in light and dark mode, also over its background motifs", () => {
  assert.ok(Object.keys(T.ERAS).length >= 4);
  for (const id of Object.keys(T.ERAS)) {
    for (const mode of ["light", "dark"]) {
      const c = T.compute({ style: id, mode, accent: null, light: null, dark: null });
      assert.ok(c && c.motifBg?.length === 2, `${id} ${mode}`);
      assert.equal(c.dark, mode === "dark", `${id} ${mode}: napačna svetlost ozadja`);
      assert.ok(T.check(c), `${id} ${mode}: premajhen kontrast`);
      // Osnovne barve so že dovolj kontrastne (theme.js jih ne sme opazno popraviti).
      assert.equal(c.vars["--accent"], T.ERAS[id][mode].accent, `${id} ${mode}: poudarek ni dovolj kontrasten`);
      // Okvir v barvah obdobja (ui.css → »Okvir«): meniji, glave in vrstica za pisanje, obvestila, pas ob robovih.
      const e = T.ERAS[id][mode];
      for (const k of ["menu", "bar", "banner"]) assert.match(e[k] || "", /^#[0-9a-f]{6}$/, `${id} ${mode}: ERAS.${k}`);
      assert.notEqual(e.menu, e.surface, `${id} ${mode}: meni naj ima barvo obdobja`);
      for (const k of ["--menu", "--menu-text", "--menu-accent", "--menu-accent-text", "--bar", "--banner", "--edge-c"]) assert.ok(c.vars[k], `${id} ${mode}: ${k}`);
      assert.equal(c.vars["--menu-accent"], e.menuAccent || e.accent, `${id} ${mode}: poudarek menija ni dovolj kontrasten`);
      assert.ok(c.menuMotif.length === 1 && c.chrome.length === 2, `${id} ${mode}: preverjanje okvirja`);
      // Lastne barve: poudarek in meni uporabnika veljata, kontrast ostane preverjen.
      for (const own of [{ accent: "#1d7a3a" }, { [mode]: { menu: mode === "dark" ? "#3a3f52" : "#20304a" } }, { [mode]: { surface: mode === "dark" ? "#1a1a1a" : "#ffffff" } }]) {
        const o = T.compute({ style: id, mode, accent: null, light: null, dark: null, ...own });
        assert.ok(T.check(o), `${id} ${mode} ${JSON.stringify(own)}: premajhen kontrast`);
      }
    }
  }
});

test("the contrast check covers the wallpaper opacity in ui.css and every wallpaper tile is up to date", async () => {
  const css = fs.readFileSync(path.join(PUB, "ui.css"), "utf8");
  const pcts = [...css.matchAll(/--wall-[cm]: color-mix\(in srgb, var\(--text\) ([\d.]+)%/g)].map((m) => Number(m[1]) / 100);
  assert.match(css, /--wall-m: color-mix/, "--wall-m (tapeta na seznamu pogovorov) v ui.css");
  assert.ok(pcts.length && pcts.every((p) => p > 0), "--wall-c v ui.css");
  assert.ok(T.MOTIF >= Math.max(...pcts), `MOTIF ${T.MOTIF} < ${Math.max(...pcts)}`);
  assert.match(css, /mask: var\(--tapeta\) repeat/);
  // Tapeta je sestavljena iz motivov sloga (node scripts/tapeta.js); nova risba ali tema zahteva novo sestavo.
  const { sestavi } = await import("../scripts/tapeta.js");
  for (const [id, e] of Object.entries(T.ERAS)) {
    const file = path.join(PUB, "eras", id, "tapeta.svg");
    assert.equal(fs.existsSync(file) && fs.readFileSync(file, "utf8"), sestavi(id, e), `${id}: node scripts/tapeta.js ${id}`);
  }
});

test("every history style has its font, motif files, fact texts, picker names and tutor setting", () => {
  const deps = JSON.parse(fs.readFileSync(path.join(PUB, "..", "package.json"), "utf8")).dependencies;
  for (const [id, e] of Object.entries(T.ERAS)) {
    assert.match(id, /^[a-z]+$/, id);
    assert.ok(deps[`@fontsource-variable/${e.font[1]}`], `${id}: paket pisave ${e.font[1]} ni v package.json`);
    assert.ok(e.motifs.length >= 6 && e.motifs.length <= 8, `${id}: 6–8 motivov`);
    let bytes = 0;
    for (const f of new Set([e.band[0], e.glyph, ...e.motifs])) {
      const file = path.join(PUB, "eras", id, `${f}.svg`);
      assert.ok(fs.existsSync(file), `manjka ${file}`);
      const svg = fs.readFileSync(file, "utf8");
      assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="[\d. ]+"/, file);
      assert.doesNotMatch(svg, /<script|href=|<text/i, file);
      bytes += svg.length;
    }
    assert.ok(bytes < 30000, `${id}: motivi ${bytes} B`);
    const [prefix, n] = e.facts;
    for (const k of [`${prefix}.title`, ...Array.from({ length: n }, (_, i) => `${prefix}.f${i + 1}`), `ap.style${cap(id)}`, `ap.style${cap(id)}Text`]) assert.ok(SL[k], `${id}: manjka ${k} v sl.js`);
    assert.ok(!SL[`${prefix}.f${n + 1}`], `${id}: več dejstev kot ${n}`);
    assert.ok(prefix === "greek" || prefix === `era.${id}`, `${id}: ključi dejstev naj bodo era.${id}.*`);
    assert.ok(DEVICE_SETTINGS.style.values.includes(id), `${id}: ni v settings-registry.js`);
    assert.match(DEVICE_SETTINGS.style.desc, new RegExp(`\\b${id} = `), `${id}: opis v settings-registry.js`);
  }
  assert.deepEqual(DEVICE_SETTINGS.style.values, [...T.STYLES]);
});

// Veljavni podatki poti SVG: ukazi s pravim številom števil (zastavici loka sta 0 ali 1, lahko brez presledka).
function validPathData(d) {
  const ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
  const num = /[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/iy;
  let i = 0, cmd = null, first = true;
  const skip = () => { while (i < d.length && /[\s,]/.test(d[i])) i++; };
  for (skip(); i < d.length; skip()) {
    if (/[a-z]/i.test(d[i])) {
      cmd = d[i++];
      if (!(cmd.toLowerCase() in ARGS) || (first && cmd.toLowerCase() !== "m")) return false;
      first = false;
      if (cmd.toLowerCase() === "z") continue;
    } else if (!cmd || cmd.toLowerCase() === "z") return false;
    const k = cmd.toLowerCase();
    for (let a = 0; a < ARGS[k]; a++) {
      skip();
      if (k === "a" && (a === 3 || a === 4)) {
        if (!/[01]/.test(d[i])) return false;
        i++;
        continue;
      }
      num.lastIndex = i;
      const m = num.exec(d);
      if (!m) return false;
      i = num.lastIndex;
    }
  }
  return !first;
}

test("every history style supplies period icons: each mapped icon exists in icons.js and is valid, small SVG", async () => {
  const { ZNAKI, sestavi } = await import("../scripts/ikone-obdobij.js");
  const src = fs.readFileSync(path.join(PUB, "icons.js"), "utf8");
  const base = new Set([...src.matchAll(/[{\s]"([a-z0-9-]+)":"/g)].map((m) => m[1]));
  assert.ok(base.has("map") && base.has("sparkles"), "imena ikon iz icons.js");
  for (const z of ZNAKI) assert.ok(base.has(z), `ZNAKI: ${z} ni v icons.js`);
  const lucide = fs.existsSync(path.join(PUB, "..", "node_modules", "lucide-static"));
  for (const [id, e] of Object.entries(T.ERAS)) {
    assert.ok(e.icons, `${id}: ERAS.${id}.icons (ikone obdobja)`);
    const file = path.join(PUB, "eras", id, `${e.icons}.json`);
    const raw = fs.readFileSync(file, "utf8");
    assert.ok(raw.length < 40000, `${id}: ikone ${raw.length} B`);
    if (lucide) assert.equal(raw, sestavi(id), `${id}: node scripts/ikone-obdobij.js`);
    const { map, svg } = JSON.parse(raw);
    // Vsaka ikona vmesnika ima odločitev: ikona obdobja v vsakem slogu ali navaden znak (ZNAKI, docs/oblikovanje.md).
    for (const name of base) assert.ok(ZNAKI.includes(name) !== Boolean(map[name]), `${id}: ${name} naj bo ${ZNAKI.includes(name) ? "brez ikone obdobja (ZNAKI)" : "v map"}`);
    for (const [name, def] of Object.entries(map)) {
      assert.ok(base.has(name), `${id}: ${name} ni ikona v icons.js`);
      assert.ok(svg[def], `${id}: ${name} → ${def} manjka v svg`);
    }
    for (const [def, body] of Object.entries(svg)) {
      assert.ok(Object.values(map).includes(def), `${id}: ${def} ni uporabljena`);
      const tags = [...body.matchAll(/<(\/?)([a-z]+)\b([^>]*)>/g)];
      assert.ok(tags.length, `${id}/${def}: prazna`);
      for (const [, close, tag, attrs] of tags) {
        if (close) continue;
        assert.ok(["path", "circle", "rect", "ellipse", "line", "polyline", "polygon"].includes(tag), `${id}/${def}: <${tag}>`);
        assert.doesNotMatch(attrs, /\bon[a-z]+=|href|url\(|style=/i, `${id}/${def}`);
        for (const [, d] of attrs.matchAll(/\bd="([^"]*)"/g)) assert.ok(validPathData(d), `${id}/${def}: neveljavna pot ${d}`);
        for (const [, k, v] of attrs.matchAll(/\b(cx|cy|r|rx|ry|x|y|width|height|x1|y1|x2|y2)="([^"]*)"/g)) assert.ok(Number.isFinite(+v) && +v >= -1 && +v <= 25, `${id}/${def}: ${k}="${v}"`);
      }
    }
  }
  assert.ok(validPathData("M3 3a1 1 0 01 2 2z") && !validPathData("M3 3L4") && !validPathData("L3 3"), "preverjanje poti");
});

// Klepet obdobja (ERAS[…].chat) in stebri (ERAS[…].arch): vsaka vrednost ima svoj videz v ui.css, papir in les
// sta berljiva (check() v svetlem in temnem načinu, tudi z lastnimi barvami), deli stebrov so preprost SVG.
test("every history chat look and column set is styled in ui.css, readable and simple SVG", () => {
  const css = fs.readFileSync(path.join(PUB, "ui.css"), "utf8");
  const attrs = { tutor: "data-tutor-surface", user: "data-user-shape", frame: "data-chat-frame", composer: "data-composer" };
  assert.ok(Object.values(T.ERAS).some((e) => e.chat && e.arch), "vsaj en slog s klepetom obdobja in stebri");
  for (const [id, e] of Object.entries(T.ERAS)) {
    for (const [k, v] of Object.entries(e.chat || {})) {
      assert.ok(attrs[k], `${id}: neznan ključ chat.${k}`);
      assert.ok(css.includes(`[${attrs[k]}="${v}"]`), `${id}: ui.css nima videza ${attrs[k]}="${v}"`);
    }
    for (const mode of ["light", "dark"]) {
      const c = T.compute({ style: id, mode, accent: null, light: null, dark: null });
      if (e.chat) {
        assert.equal(c.vars["--paper"], e[mode].paper, `${id} ${mode}: papir naj bo berljiv brez popravka`);
        assert.equal(c.vars["--wood"], e[mode].wood, `${id} ${mode}: les naj ima 3:1 brez popravka`);
        assert.equal(c.paperBg.length, 3, `${id} ${mode}: preverjanje papirja (list, vlakna, koda)`);
        assert.ok(T.check(c), `${id} ${mode}: kontrast na papirju`);
        const own = T.compute({ style: id, mode, accent: "#1d7a3a", light: null, dark: null });
        assert.ok(T.check(own), `${id} ${mode}: lastni poudarek na papirju`);
        // Lastne barve oken (tudi »naključne barve«): papirus v barvi okna, nikoli brez --paper.
        const pal = mode === "dark" ? { bg: "#101820", surface: "#18222c", text: "#eef2f6" } : { bg: "#eef3f8", surface: "#ffffff", text: "#13202c" };
        const win = T.compute({ style: id, mode, accent: "#1d5fa8", light: mode === "light" ? pal : null, dark: mode === "dark" ? pal : null });
        assert.equal(win.vars["--paper"], pal.surface, `${id} ${mode}: papir z lastnimi barvami`);
        assert.ok(win.vars["--paper-fibre"] && win.vars["--paper-2"] && T.check(win), `${id} ${mode}: kontrast papirja z lastnimi barvami`);
      }
      if (e.arch) for (const k of ["cap", "shaft", "base"]) assert.match(c.vars[`--arch-${k}`] + c.vars[`--arch-${k}-m`], /^url\("data:image\/svg\+xml,.*url\("data:image\/svg\+xml,/, `${id} ${mode}: --arch-${k}`);
    }
    const simple = (body, what) => assert.ok(!/<(?!\/?(path|rect|circle|ellipse|line|polyline|polygon)\b)/.test(body) && !/\son\w+=|href|url\(|style=|fill="#|stroke="#/i.test(body), `${id}: ${what} samo osnovne oblike, barve iz ui.css`);
    for (const [k, part] of Object.entries(e.arch || {})) {
      assert.ok(["cap", "shaft", "base", "temple"].includes(k), `${id}: neznan del arch.${k}`);
      if (k === "temple") continue;
      const [w, h, body] = part;
      assert.ok(w > 0 && h > 0 && w <= 400 && h <= 60 && body.length < 1200, `${id}: arch.${k} mere`);
      simple(body, `arch.${k}`);
    }
    // Pročelje (arch.temple): zatrep 1 : 4 do 1 : 7, entablatura in stopnice široke, steber [kapitel, deblo, baza];
    // temple() iz tega sestavi zgornji (zatrep, entablatura) in spodnji del (4 stebri, stopnice), vse aria-hidden.
    const tp = e.arch && e.arch.temple;
    if (tp) {
      assert.deepEqual(Object.keys(tp).sort(), ["column", "entablature", "pediment", "stylobate"], `${id}: deli pročelja`);
      const parts = { pediment: tp.pediment, entablature: tp.entablature, stylobate: tp.stylobate, cap: tp.column[0], shaft: tp.column[1], base: tp.column[2] };
      for (const [k, [w, h, body]] of Object.entries(parts)) {
        assert.ok(w > 0 && h > 0 && w <= 600 && h <= 200 && body.length < 2000, `${id}: temple.${k} mere`);
        simple(body, `temple.${k}`);
        assert.ok(!/class="(?![ftlsdvn ]+")/.test(body), `${id}: temple.${k} samo razredi f t l s d v n`);
      }
      const [pw, ph] = tp.pediment;
      assert.ok(pw / ph >= 4 && pw / ph <= 7, `${id}: zatrep ${pw}:${ph}`);
      assert.ok(tp.column[0][0] >= tp.column[1][0] * 1.6 && tp.column[2][0] > tp.column[1][0], `${id}: kapitel in baza širša od debla`);
      const html = T.temple(id);
      assert.ok(html && /class="t-part t-roof"/.test(html.top) && /t-ent/.test(html.top), `${id}: temple().top`);
      assert.equal((html.bottom.match(/class="t-part t-col/g) || []).length, 4, `${id}: štirje stebri`);
      assert.ok(/t-steps/.test(html.bottom), `${id}: temple().bottom`);
      assert.ok([html.top, html.bottom].every((s) => (s.match(/<svg/g) || []).length === (s.match(/aria-hidden="true"/g) || []).length - (s.match(/<div/g) || []).length), `${id}: deli pročelja so aria-hidden`);
      for (const k of ["t-roof", "t-ent", "t-col", "t-steps"]) assert.ok(css.includes(`.${k}`), `${id}: ui.css nima .${k}`);
    } else if (!e.building) assert.equal(T.temple(id), null, `${id}: brez pročelja`);
    if (e.chat && e.chat.frame === "stebri") assert.ok(tp, `${id}: stebri potrebujejo arch.temple`);
  }
  assert.ok(T.PAPER > 0 && T.PAPER <= 0.15, "PAPER (vlakna papirusa)");
});

// Stavba obdobja (ERAS[…].building, j 2026-11-04: stebri samo za Antični, drugi slogi stavba iz svojega obdobja, npr.
// Tadž Mahal za Indijo): vsak slog ima natanko en okvir pozdrava, deli so preprost SVG z razredi za barve iz ui.css.
test("every history style frames the empty chat with a building of its own period, columns only in Antični", () => {
  const css = fs.readFileSync(path.join(PUB, "ui.css"), "utf8");
  for (const [id, e] of Object.entries(T.ERAS)) {
    const own = e.chat && e.chat.frame;
    assert.ok(!!own !== !!e.frame, `${id}: natanko en okvir pozdrava (chat.frame ali frame)`);
    if (own === "stebri") assert.equal(id, "antik", "stebri samo v Antičnem");
    if (!e.frame) continue;
    assert.equal(e.frame, "stavba", `${id}: frame je »stavba«`);
    assert.ok(css.includes(`[data-chat-frame="${e.frame}"]`), `${id}: ui.css nima videza stavbe`);
    const b = e.building;
    assert.ok(b && !e.arch, `${id}: stavba v building, brez stebrov v okvirju (arch)`);
    const parts = { roof: b.pediment, cap: b.column[0], shaft: b.column[1], base: b.column[2], plinth: b.stylobate, ...(b.entablature ? { band: b.entablature } : {}) };
    for (const [k, [w, h, body]] of Object.entries(parts)) {
      assert.ok(w > 0 && h > 0 && w <= 600 && h <= 200 && body.length < 2000, `${id}: ${k} mere`);
      assert.ok(!/<(?!\/?(path|rect|circle|ellipse)\b)/.test(body) && !/\son\w+=|href|url\(|style=|fill="#|stroke="#/i.test(body), `${id}: ${k} samo osnovne oblike`);
      assert.ok(!/class="(?![ftlsdvn ]+")/.test(body), `${id}: ${k} samo razredi f t l s d v n`);
    }
    const [rw, rh] = b.pediment;
    assert.ok(rw / rh >= 3 && rw / rh <= 7, `${id}: streha ${rw}:${rh}`);
    const html = T.temple(id);
    assert.ok(html && /t-roof/.test(html.top) && (html.bottom.match(/class="t-part t-col/g) || []).length === 4 && /t-steps/.test(html.bottom), `${id}: temple() sestavi stavbo`);
    assert.ok(!!b.entablature === /t-ent/.test(html.top), `${id}: pas pod streho samo, če je podan`);
  }
});
