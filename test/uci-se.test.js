// Uči se (j, 4. 11. 2026): en gumb v zgornji in spodnji vrstici, v njem Učbenik | Laboratorij | 3D svet. Odpre se zadnji
// uporabljeni zavihek (localStorage evklid.uciZavihek); stare poti (pogled textbook/lab, ?pogled=, ukaz inštruktorju)
// izberejo pravi zavihek; iz lekcije en dotik odpre poskus ali 3D pogled iste teme (samo iz kataloga).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import SL from "../public/i18n/sl.js";
import { SIM_TOPICS, simsForTopic, labExperiments } from "../public/sim/katalog.js";
import { lessonLinks, lessonView } from "../server/textbook.js";
import { openWindowIntent, WINDOW_VIEWS } from "../server/chat-settings.js";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const html = read("public/index.html");

// Najmanjši DOM za public/uci-se.js: gumbi preklopnika in trije zavihki.
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};
const el = (data = {}) => {
  const cls = new Set();
  const attrs = {};
  return {
    dataset: data,
    hidden: false,
    tabIndex: 0,
    classList: { toggle: (c, on) => (on ? cls.add(c) : cls.delete(c)), contains: (c) => cls.has(c) },
    setAttribute: (k, v) => (attrs[k] = v),
    getAttribute: (k) => attrs[k],
  };
};
const buttons = ["textbook", "lab", "3d"].map((v) => el({ uciTab: v }));
const panes = { textbook: el(), lab: el(), "3d": el() };
globalThis.document = {
  documentElement: { lang: "sl" },
  querySelector: () => null,
  querySelectorAll: (sel) => (sel === "[data-uci-tab]" ? buttons : []),
  getElementById: (id) => panes[id.replace(/^view-/, "")] || null,
};
const load = (v) => import(`../public/uci-se.js?v=${v}`);

test("Uči se replaces the Učbenik and Laboratorij buttons on top and in the phone bar", () => {
  const top = html.match(/<nav class="tabs"[\s\S]*?<\/nav>/)[0];
  const bar = html.match(/<nav id="tabbar"[\s\S]*?<\/nav>/)[0];
  for (const nav of [top, bar]) {
    assert.match(nav, /data-view="uci"><i data-icon="graduation-cap"><\/i><span data-i18n="nav.learn">Uči se<\/span>/);
    assert.doesNotMatch(nav, /data-view="(textbook|lab)"/);
  }
  // Spodnja vrstica: Učna pot, Uči se, Inštruktor, četrto mesto (Tekmovanja ali NPZ/Matura), Jaz.
  assert.deepEqual([...bar.matchAll(/data-view="([\w-]+)"/g)].map((m) => m[1]), ["path", "uci", "chat", "competition", "me"]);
  assert.match(bar, /id="competition-tab-m"/);
  assert.doesNotMatch(html, /data-go="lab"/, "Laboratorij ni več vrstica pod Jaz");
  // Pogled »Uči se«: preklopnik z vlogo tablist in trije zavihki (obstoječi pogledi, ne kopije).
  const uci = html.match(/<main id="view-uci"[\s\S]*?<\/main>/)[0];
  assert.match(uci, /class="seg uci-tabs" role="tablist"/);
  assert.deepEqual([...uci.matchAll(/data-uci-tab="([\w-]+)" aria-controls="view-\1"/g)].map((m) => m[1]), ["textbook", "lab", "3d"]);
  for (const v of ["textbook", "lab", "3d"]) assert.match(uci, new RegExp(`<section id="view-${v}" class="uci-pane[^"]*" role="tabpanel"`));
  assert.equal((html.match(/id="view-textbook"/g) || []).length, 1);
  assert.equal((html.match(/id="lab-content"/g) || []).length, 1);
  assert.match(html, /<link rel="stylesheet" href="uci.css">/);
});

test("last tab: textbook by default, every choice is saved on the device and comes back", async () => {
  mem.clear();
  const a = await load(1);
  assert.equal(a.uciTab(), "textbook");
  a.setUciTab("lab");
  assert.equal(a.uciTab(), "lab");
  assert.equal(mem.get("evklid.uciZavihek"), "lab");
  assert.deepEqual(buttons.map((b) => b.classList.contains("active")), [false, true, false]);
  assert.deepEqual(buttons.map((b) => b.getAttribute("aria-selected")), ["false", "true", "false"]);
  assert.deepEqual(Object.values(panes).map((p) => p.hidden), [true, false, true]);
  a.setUciTab("nekaj"); // neznan zavihek se prezre
  assert.equal(a.uciTab(), "lab");
  a.setUciTab("3d");
  // Nova seja (osvežena stran): »Uči se« odpre zadnji zavihek.
  const b = await load(2);
  assert.equal(b.uciTab(), "3d");
  // Pokvarjena vrednost ali shramba, ki ne dela (zasebno okno): Učbenik.
  mem.set("evklid.uciZavihek", "<script>");
  assert.equal((await load(3)).uciTab(), "textbook");
  const keep = globalThis.localStorage;
  globalThis.localStorage = {
    getItem() {
      throw new Error("blokirano");
    },
    setItem() {
      throw new Error("blokirano");
    },
  };
  try {
    const c = await load(4);
    assert.equal(c.uciTab(), "textbook");
    c.setUciTab("lab");
    assert.equal(c.uciTab(), "lab");
  } finally {
    globalThis.localStorage = keep;
  }
});

test("old routes land on the right tab: showView, ?pogled=, the tutor's open_window and the guide", () => {
  const app = read("public/app.js");
  // showView("textbook" | "lab" | "3d") izbere zavihek in pokaže »Uči se«.
  assert.match(app, /if \(UCI_TABS\.includes\(name\)\) \{\s*setUciTab\(name\);\s*name = "uci";/);
  assert.match(app, /const START_VIEW = \["chat", "graph", "uci", \.\.\.UCI_TABS\]/);
  assert.match(app, /async function openFromTutor[\s\S]{0,200}if \(UCI_TABS\.includes\(view\)\)/);
  assert.match(app, /currentView === "uci" && uciBack\(/);
  assert.doesNotMatch(app, /currentView === "(textbook|lab)"/);
  for (const v of ["uci", "textbook", "lab", "3d"]) assert.ok(WINDOW_VIEWS.includes(v), v);
  assert.equal(openWindowIntent("odpri učbenik").view, "textbook");
  assert.equal(openWindowIntent("odpri laboratorij").view, "lab");
  assert.equal(openWindowIntent("odpri 3d svet").view, "3d");
  assert.equal(openWindowIntent("pokaži atlas"), null, "»atlas« sam je lahko tudi zemljepisni");
  // Lekcija (openLesson) in Laboratorij (»Odpri temo v učbeniku«) še vedno kličeta showView("textbook").
  assert.match(read("public/textbook.js"), /ctx\.showView\("textbook"\)/);
  // Uvodni ogled in vodič kažeta »Uči se«.
  assert.match(app, /sel: '\.tab\[data-view="uci"\]', title: "nav.learn", text: "tour.learnText"/);
  assert.match(read("public/vodic.js"), /view: "uci"/);
});

test("lesson links: only lab experiments and 3D views that the catalogue has for that topic", () => {
  const labKeys = new Set(labExperiments().map((x) => x.key));
  let n = 0;
  for (const topicId of Object.keys(SIM_TOPICS)) {
    const demos = simsForTopic(topicId);
    for (const k of lessonLinks(demos)) {
      n++;
      if (k.kind === "lab") assert.ok(labKeys.has(k.key), `${topicId}: ${k.key} ni v laboratoriju`);
      else assert.ok(demos.some((d) => d.id === `3d-${k.id}`), `${topicId}: 3D ${k.id} ni v katalogu`);
      assert.ok(k.title, `${topicId}: povezava brez naslova`);
    }
  }
  assert.ok(n >= 10, `le ${n} povezav`);
  assert.deepEqual(lessonView("FIZ-OS-9/upor-in-ohmov-zakon").links, [{ kind: "lab", key: "lab-ohm", title: "Ohmov zakon: tok in napetost" }]);
  // Brez poskusa v katalogu ni povezave (nič izmišljenega).
  assert.deepEqual(lessonLinks([{ id: "graf", title: "Graf", opts: {} }]), []);
  // 3D model iz kataloga (3d-<id>) in isti poskus z enakimi možnostmi le enkrat.
  assert.deepEqual(
    lessonLinks([
      { id: "3d-celica-zivalska", title: "Živalska celica", opts: {} },
      { id: "lab-ohm", title: "A", opts: {} },
      { id: "lab-ohm", title: "B", opts: {} },
    ]),
    [
      { kind: "3d", id: "celica-zivalska", title: "Živalska celica" },
      { kind: "lab", key: "lab-ohm", title: "Ohmov zakon: tok in napetost" },
    ],
  );
});

test("3D world: the /3d page in a frame closes itself and asks the tutor through the app", () => {
  const stran = read("public/3d/stran.js");
  assert.match(stran, /else if \(vgrajeno\) starsu\(\{ tip: "zapri3d" \}\)/);
  assert.match(read("public/3d/atlas.js"), /if \(vgrajeno\) \{\s*starsu\(\{ tip: "vprasaj", besedilo \}\)/);
  const uci = read("public/uci-se.js");
  assert.match(uci, /e\.origin !== location\.origin \|\| e\.source !== full\.frame\.contentWindow/);
  assert.match(uci, /frame\.src = `\/3d\?vgrajeno=1#/);
  assert.match(read("public/3d/vgrajeno.js"), /window\.parent\.location\.origin === location\.origin/);
});

test("Uči se texts exist in Slovenian, without banned words", () => {
  for (const k of ["nav.learn", "tour.learnText", "tb.inLab", "tb.in3d", "tb.openLab", "tb.open3d", "uci.labOffline", "nav.textbook", "nav.lab", "a3.hubTitle"]) assert.ok(SL[k], k);
  for (const k of ["tour.learnText", "tb.in3d", "tb.open3d"]) assert.doesNotMatch(SL[k], /model/i, k);
  assert.match(SL["tb.openLab"], /\{title\}/);
});
