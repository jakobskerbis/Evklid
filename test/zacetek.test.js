// Gladka uporaba na telefonu (j, 10. 11. 2026):
// A) odprtje na zadnjem zaslonu brez utripa Učne poti; na Učno pot samo po več kot 12 urah (public/zacetek.js),
// B) tipka Nazaj po plasteh, dva pritiska za izhod na Učni poti, zgodovina se ne nabira (public/app.js).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import SL from "../public/i18n/sl.js";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const H = 60 * 60 * 1000;

// public/zacetek.js je navaden skript v <head>: zaženemo ga z lažnim oknom.
function zacetek({ zapis, studentId = "7", search = "", raw } = {}) {
  const store = new Map();
  if (zapis) store.set("evklid.zadnji-zaslon", JSON.stringify(zapis));
  if (raw != null) store.set("evklid.zadnji-zaslon", raw);
  if (studentId != null) store.set("studentId", studentId);
  const attrs = {};
  const window = {};
  const ctx = {
    window,
    localStorage: { getItem: (k) => store.get(k) ?? null },
    location: { search },
    URLSearchParams,
    document: { documentElement: { setAttribute: (k, v) => (attrs[k] = v) } },
  };
  vm.runInNewContext(read("public/zacetek.js"), ctx);
  return { api: window.evklidZacetek, attr: attrs["data-zacetek"] };
}

test("zadnji zaslon velja do 12 ur; pozneje, ob pokvarjenem zapisu ali uri iz prihodnosti se odpre Učna pot", () => {
  const { api } = zacetek();
  const zdaj = Date.UTC(2026, 10, 10, 8);
  assert.equal(api.MAX, 12 * H);
  assert.equal(api.izberi({ v: "chat", t: zdaj - 5 * 60 * 1000 }, zdaj), "chat");
  assert.equal(api.izberi({ v: "settings", t: zdaj - 12 * H }, zdaj), "settings", "natanko 12 ur še velja (šele VEČ kot 12 ur ne)");
  assert.equal(api.izberi({ v: "settings", t: zdaj - 12 * H - 1 }, zdaj), "path");
  assert.equal(api.izberi({ v: "chat", t: zdaj + H }, zdaj), "path", "ura telefona prestavljena nazaj");
  for (const slab of [null, undefined, "chat", 5, {}, { v: "chat" }, { v: 3, t: zdaj }, { v: "chat", t: "včeraj" }, { v: '"><img>', t: zdaj }, { v: "Chat", t: zdaj }])
    assert.equal(api.izberi(slab, zdaj), "path", JSON.stringify(slab));
});

test("odločitev pade pred prvim izrisom: html[data-zacetek] skrije Učno pot, dokler app.js ne pokaže pogleda", () => {
  const t = Date.now() - H;
  assert.equal(zacetek({ zapis: { v: "chat", t, s: 7 } }).attr, "chat");
  assert.equal(zacetek({ zapis: { v: "path", t, s: 7 } }).attr, undefined);
  assert.equal(zacetek({ zapis: { v: "chat", t: Date.now() - 13 * H, s: 7 } }).attr, undefined, "po več kot 12 urah Učna pot");
  assert.equal(zacetek({ zapis: { v: "chat", t, s: 8 } }).attr, undefined, "zapis drugega profila");
  assert.equal(zacetek({ zapis: { v: "chat", t, s: 7 }, studentId: null }).attr, undefined);
  assert.equal(zacetek({ raw: "{pokvarjeno" }).attr, undefined);
  assert.equal(zacetek().attr, undefined, "prvi obisk");
  assert.equal(zacetek({ search: "?pogled=chat" }).attr, "chat", "bližnjica z ikone");
  assert.equal(zacetek({ search: "?pogled=%22%3E" }).attr, undefined);
  // Skript je v <head> pred slogi in moduli, slog skrije Učno pot in njen označeni zavihek.
  const html = read("public/index.html");
  const head = html.slice(0, html.indexOf("</head>"));
  assert.ok(head.indexOf('<script src="zacetek.js"></script>') > 0 && head.indexOf('<script src="zacetek.js"></script>') < head.indexOf('rel="stylesheet"'));
  assert.match(read("public/style.css"), /html\[data-zacetek\] #view-path \{ display: none; \}/);
  const app = read("public/app.js");
  assert.match(app, /const startDone = \(\) => document\.documentElement\.removeAttribute\("data-zacetek"\);/);
  assert.match(app, /const START_REC = ZACETEK\?\.beri\(\) \?\? null;/, "zapis se prebere pred prvim showView");
  // Zapis nosi profil; tema in lekcija se odpreta znova; ob skritju strani se čas zadnjega obiska osveži.
  assert.match(app, /Number\(rec\.s\) !== state\.student\.id\) return null;/);
  assert.match(app, /if \(document\.visibilityState === "hidden"\) return rememberScreen\(\);/);
  assert.match(app, /window\.addEventListener\("pagehide", rememberScreen\);/);
});

// ---------- tipka Nazaj: del app.js z lažno zgodovino ----------

function nazaj({ entries = [null], view = "path" } = {}) {
  const app = read("public/app.js");
  const src = app.slice(app.indexOf('let currentView = "path";'), app.indexOf("const ME_VIEWS = ["));
  assert.ok(src.includes('window.addEventListener("popstate"'), "del app.js s tipko Nazaj");
  const h = { list: entries.map((s) => s), i: entries.length - 1, left: false, queue: [] };
  const pops = [];
  const history = {
    get state() {
      return h.list[h.i];
    },
    get length() {
      return h.list.length;
    },
    pushState(s) {
      h.list.splice(h.i + 1, Infinity, s);
      h.i++;
    },
    replaceState(s) {
      h.list[h.i] = s;
    },
    back() {
      h.queue.push(-1);
    },
  };
  const open = new Set(); // odprte plasti: "dialog", "keyboard", "pad", "menu", "lesson", "3d", "esc"
  const toasts = [];
  const timers = [];
  const closeIf = (k) => () => open.delete(k);
  const ctx = {
    history,
    window: { addEventListener: (ev, fn) => ev === "popstate" && pops.push(fn) },
    document: {
      body: { classList: { contains: () => false }, dispatchEvent: () => open.delete("esc") },
      querySelectorAll: (sel) => (sel === "dialog[open]" ? (open.has("dialog") ? [{ dispatchEvent: () => true, close: () => open.delete("dialog") }] : []) : { length: open.size }),
      querySelector: () => null,
    },
    Event: class {},
    KeyboardEvent: class {},
    setTimeout: (fn, ms) => timers.push({ fn, ms }),
    clearTimeout: (id) => id && (timers[id - 1].off = true),
    $: (s) => (s === "#tabbar" ? { offsetParent: {} } : s === "#tour" ? null : { classList: { contains: () => false }, offsetParent: null }),
    t: (k) => SL[k],
    toast: (m) => toasts.push(m),
    state: { backTo: "path" },
    startTour: {},
    closeFormulaPop: () => false,
    closePaperViewer: () => false,
    closeOurPaper: () => false,
    closeQuickStart: () => false,
    closeProfileMenu: closeIf("menu"),
    installSheetOpen: () => false,
    closeInstallSheet() {},
    closeFull() {},
    keyboardOpenFor: () => open.has("keyboard"),
    hideKeyboard: closeIf("keyboard"),
    padIsSheet: () => open.has("pad"),
    closePad: closeIf("pad"),
    calcOverlayOpen: () => false,
    closeCalcOverlay() {},
    cornerBack: () => false,
    simOverlayOpen: () => false,
    closeSimOverlay() {},
    isOpen3d: () => open.has("3d"),
    leaveUci: closeIf("3d"),
    setSidebar() {},
    uciBack: closeIf("lesson"),
    textbookBack() {},
    labBack() {},
    gamesBack: () => false,
    scanBack: () => false,
    meView: (v) => ["me", "settings", "progress"].includes(v),
  };
  vm.runInNewContext(
    `${src}
    function showView(name) { syncHistory(name); currentView = name; }
    currentView = ${JSON.stringify(view)};
    globalThis.api = { showView, overlayOpened, overlayClosed, view: () => currentView, EXIT_MS };`,
    ctx,
  );
  // Zgodovina je asinhrona: korak nazaj se zgodi šele tu, popstate pride za njim.
  const flush = () => {
    while (h.queue.length) {
      h.queue.shift();
      if (h.i === 0) {
        h.left = true;
        continue;
      }
      h.i--;
      pops.forEach((fn) => fn());
    }
  };
  return {
    h,
    state: ctx.state,
    open,
    toasts,
    view: ctx.api.view,
    EXIT_MS: ctx.api.EXIT_MS,
    show: (v) => (ctx.api.showView(v), flush()),
    overlay: (on) => ((on ? ctx.api.overlayOpened : ctx.api.overlayClosed)(), flush()),
    back: () => (history.back(), flush()),
    // Časovnik za vrnitev varovala (prvi pritisk Nazaj na Učni poti brez drugega).
    timeout() {
      const live = timers.filter((x) => !x.off);
      live.forEach((x) => ((x.off = true), x.fn()));
      return live.map((x) => x.ms);
    },
    levels: () => h.list.map((s) => s?.stm ?? 0).join(""),
  };
}

test("Nazaj na Učni poti: prvi pritisk pokaže obvestilo, šele drugi zapusti aplikacijo", () => {
  const a = nazaj();
  a.show("path"); // zagon
  assert.equal(a.levels(), "02", "pod Učno potjo je zapis vstopa, da prvi Nazaj ne zapre aplikacije");
  a.back();
  assert.equal(a.h.left, false);
  assert.deepEqual(a.toasts, ["Še enkrat pritisni Nazaj za izhod."]);
  assert.equal(SL["nav.exitAgain"], "Še enkrat pritisni Nazaj za izhod.");
  a.back();
  assert.equal(a.h.left, true, "drugi pritisk zapusti aplikacijo");
  // Brez drugega pritiska se varovalo vrne (po času obvestila) in izhod spet zahteva dva pritiska.
  const b = nazaj();
  b.show("path");
  b.back();
  assert.deepEqual(b.timeout(), [b.EXIT_MS]);
  assert.equal(b.levels(), "02");
  b.back();
  assert.equal(b.h.left, false);
  assert.equal(b.toasts.length, 2);
  // Po obvestilu odprt pogled: Nazaj z njega vodi na Učno pot, ne iz aplikacije.
  b.show("chat");
  assert.equal(b.levels(), "021");
  assert.deepEqual(b.timeout(), [], "časovnik za izhod je preklican");
  b.back();
  assert.equal(b.view(), "path");
  assert.equal(b.h.left, false);
  assert.equal(b.levels(), "021", "zapis pogleda ostane kot zapis naprej, novi se ne dodajajo");
});

test("Nazaj po plasteh: okno → tipkovnica → podstran → seznam → Učna pot; zgodovina se ne nabira", () => {
  const a = nazaj();
  a.show("path");
  a.show("uci");
  for (const k of ["lesson", "3d", "pad", "keyboard", "dialog"]) a.open.add(k);
  const order = [];
  for (let i = 0; i < 5; i++) {
    const before = new Set(a.open);
    a.back();
    order.push([...before].find((k) => !a.open.has(k)));
    assert.equal(a.view(), "uci", "pogled ostane, dokler je kaj odprto");
    assert.equal(a.h.list.length, 3);
  }
  assert.deepEqual(order, ["dialog", "keyboard", "pad", "3d", "lesson"]);
  a.back();
  assert.equal(a.view(), "path");
  // Telefon: s podstrani »Jaz« na »Jaz«, nato na Učno pot. Veliko menjav pogledov ne doda zapisov.
  for (let i = 0; i < 20; i++) {
    a.show("settings");
    a.back();
    assert.equal(a.view(), "me");
    a.show("chat");
    a.back();
    assert.equal(a.view(), "path");
    a.show("me");
    a.show("path");
  }
  assert.ok(a.h.list.length <= 3, `zgodovina se nabira: ${a.levels()}`);
  assert.equal(a.h.left, false);
  // Majhno okno, ki ga zapre Esc (meni porabe, spustni seznam), in meni profila na Učni poti: Nazaj ju zapre brez obvestila.
  for (const k of ["esc", "menu"]) {
    a.open.add(k);
    a.back();
    assert.equal(a.open.has(k), false, k);
  }
  assert.equal(a.toasts.length, 0);
  assert.equal(a.h.left, false);
  // Tema, odprta s Tekmovanj: Nazaj vodi na Tekmovanja, nato na Učno pot.
  const c = nazaj();
  c.show("path");
  c.state.backTo = "competition";
  c.show("topic");
  c.back();
  assert.equal(c.view(), "competition");
  c.back();
  assert.equal(c.view(), "path");
  assert.equal(c.levels(), "021");
});

test("Nazaj po osvežitvi na podstrani, v starem zavihku brez varovala in ob oknu na Učni poti", () => {
  // Osvežitev na podstrani: zgodovina brskalnika ostane (vstop, Učna pot, pogled), aplikacija odpre zadnji zaslon.
  const a = nazaj({ entries: [null, { stm: 2 }, { stm: 1, v: "settings" }] });
  a.show("path");
  a.show("settings");
  assert.equal(a.levels(), "021");
  a.back();
  assert.equal(a.view(), "me");
  a.back();
  assert.equal(a.view(), "path");
  a.back();
  assert.equal(a.toasts.length, 1);
  assert.equal(a.h.left, false);
  // Zavihek, odprt pred to različico (brez varovala): po osvežitvi na Učno pot varovalo nastane.
  const b = nazaj({ entries: [null, { stm: 1, v: "chat" }] });
  b.show("path");
  assert.equal(b.levels(), "02");
  b.back();
  assert.equal(b.h.left, false);
  assert.equal(b.toasts.length, 1);
  // Okno na Učni poti (namestitev, pomen črke): Nazaj ga zapre; zaprtje z gumbom odstrani njegov zapis.
  const c = nazaj();
  c.show("path");
  c.overlay(true);
  assert.equal(c.levels(), "021");
  c.back();
  assert.equal(c.toasts.length, 0, "Nazaj je zaprl okno, ne aplikacije");
  c.overlay(true);
  c.overlay(false);
  c.back();
  assert.equal(c.toasts.length, 1);
  assert.equal(c.h.left, false);
});

test("plasti v app.js: okno <dialog>, Evklidova tipkovnica (samo prek API) in plošča so pred pogledi", () => {
  const app = read("public/app.js");
  const step = app.slice(app.indexOf("function backStep("), app.indexOf('window.addEventListener("popstate"'));
  const at = (s) => {
    assert.ok(step.includes(s), s);
    return step.indexOf(s);
  };
  const views = at('if (currentView === "uci" && uciBack(');
  for (const s of ["closeTopDialog()", "hideKeyboard({ blur: true })", "padIsSheet()", "isOpen3d()", "setSidebar(false)"]) assert.ok(at(s) < views, s);
  assert.ok(views < at("closeByEsc()") && at("closeByEsc()") < at('if (currentView === "path") return false;'));
  assert.match(step, /currentView === "topic" && \["competition", "exams"\]\.includes\(state\.backTo\) \? state\.backTo : "path"/);
  // Tipkovnice se dotaknemo samo prek izvoženih funkcij (PR #543 spreminja public/tipkovnica.js).
  assert.match(app, /import \{[^}]*\bhideKeyboard\b[^}]*\bkeyboardOpenFor\b[^}]*\} from "\.\/tipkovnica\.js";/);
});
