// Spodnja vrstica se po 5 s neuporabe skrije (public/noga.js, j 2026-11-14), kjer ni že drugače določeno.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { nastaviNogo, MIROVANJE_MS, VRNITEV_MS } from "../public/noga.js";

function okolje({ vidna = true, branje = false, vodic = false } = {}) {
  let ura = 1000;
  let id = 0;
  const casovniki = new Map();
  const poslusalci = new Map();
  const razredi = new Set();
  const body = {
    classList: {
      contains: (c) => razredi.has(c),
      add: (c) => razredi.add(c),
      remove: (c) => razredi.delete(c),
    },
  };
  const bar = { offsetHeight: 64, contains: () => false };
  const win = {
    innerHeight: 800,
    setTimeout: (fn, ms) => (casovniki.set(++id, { fn, ob: ura + ms }), id),
    clearTimeout: (i) => casovniki.delete(i),
    addEventListener: (ime, fn) => poslusalci.set(ime, fn),
    removeEventListener: (ime) => poslusalci.delete(ime),
  };
  const doc = { hidden: false, activeElement: null, addEventListener: () => {} };
  const stanje = { vidna, branje, vodic, sync: 0 };
  const noga = nastaviNogo({
    bar, body, win, doc,
    vidna: () => stanje.vidna,
    branje: () => stanje.branje,
    vodic: () => stanje.vodic,
    sync: () => stanje.sync++,
    zdaj: () => ura,
  });
  // Premakne uro in sproži časovnike, ki so na vrsti.
  const pocakaj = (ms) => {
    ura += ms;
    for (const [i, c] of [...casovniki].sort((a, b) => a[1].ob - b[1].ob)) {
      if (c.ob <= ura && casovniki.has(i)) {
        casovniki.delete(i);
        c.fn();
      }
    }
  };
  const sprozi = (tip, e = {}) => poslusalci.get(tip)({ type: tip, preventDefault() { this.ustavljen = true; }, stopPropagation() {}, ...e });
  return { noga, razredi, stanje, pocakaj, sprozi, poslusalci };
}

test("after 5 s without use the bar slides away; scrolling brings it back", () => {
  const o = okolje();
  assert.equal(MIROVANJE_MS, 5000);
  o.pocakaj(4999);
  assert.ok(!o.razredi.has("tb-mir"), "pred 5 s ostane");
  o.pocakaj(1);
  assert.ok(o.razredi.has("tb-mir"), "po 5 s se skrije");
  o.sprozi("wheel");
  assert.ok(!o.razredi.has("tb-mir"));
  assert.ok(o.razredi.has("tb-vraca"), "vrne se z drsenjem navzgor");
  o.pocakaj(VRNITEV_MS);
  assert.ok(!o.razredi.has("tb-vraca"), "nato je spet v postavitvi");
  o.pocakaj(MIROVANJE_MS - VRNITEV_MS);
  assert.ok(o.razredi.has("tb-mir"), "in se po novih 5 s spet skrije");
  assert.ok(o.stanje.sync > 0, "višina vrstice za liste (--tabbar-h) se osveži");
});

test("a finger swipe of 10 px or a scroll key brings it back; a tap, a slider or a bare scroll event does not", () => {
  const o = okolje();
  const dotik = (y, target) => ({ touches: [{ clientY: y }], target });
  o.pocakaj(MIROVANJE_MS);
  for (const [tip, e] of [["pointerdown", {}], ["touchstart", dotik(500)], ["touchmove", dotik(505)], ["keydown", { key: "a" }], ["scroll", {}], ["input", {}]]) {
    o.sprozi(tip, e);
    assert.ok(o.razredi.has("tb-mir"), `${tip} ne vrne vrstice`);
  }
  const drsnik = { closest: (s) => (s.includes("input[type=range]") ? {} : null) };
  o.sprozi("touchmove", dotik(560, drsnik));
  assert.ok(o.razredi.has("tb-mir"), "vlečenje drsnika ni drsenje strani");
  o.sprozi("touchmove", dotik(520, { closest: () => null }));
  assert.ok(o.razredi.has("tb-vraca"), "poteg prsta jo vrne");
  o.pocakaj(MIROVANJE_MS);
  assert.ok(o.razredi.has("tb-mir"));
  o.sprozi("keydown", { key: "PageDown" });
  assert.ok(!o.razredi.has("tb-mir"), "tipka za drsenje jo vrne");
});

test("while it is shown, every use restarts the 5 s", () => {
  const o = okolje();
  for (const tip of ["pointerdown", "wheel", "keydown", "input", "scroll", "pointermove", "touchstart"]) {
    o.pocakaj(3000);
    o.sprozi(tip, { key: "a" });
  }
  o.pocakaj(4000);
  assert.ok(!o.razredi.has("tb-mir"));
  o.pocakaj(1000);
  assert.ok(o.razredi.has("tb-mir"));
});

test("reading screens keep their rule: a shown (peeked) bar hides after 5 s, nothing more", () => {
  const o = okolje({ branje: true });
  o.razredi.add("tb-peek");
  o.pocakaj(MIROVANJE_MS);
  assert.ok(!o.razredi.has("tb-peek"), "pokazana vrstica se skrije");
  assert.ok(!o.razredi.has("tb-mir"), "razred za neuporabo ni potreben");
  o.sprozi("wheel");
  assert.ok(!o.razredi.has("tb-peek") && !o.razredi.has("tb-vraca"), "kdaj se pokaže, določa app.js (drsenje nazaj gor)");
});

test("hidden bar (desktop, pad, onboarding) and the guided tour are left alone", () => {
  const skrita = okolje({ vidna: false });
  skrita.pocakaj(MIROVANJE_MS * 2);
  assert.ok(!skrita.razredi.has("tb-mir"));
  const vodic = okolje({ vodic: true });
  vodic.pocakaj(MIROVANJE_MS * 3);
  assert.ok(!vodic.razredi.has("tb-mir"), "med vodičem vrstica ostane");
  vodic.stanje.vodic = false;
  vodic.pocakaj(MIROVANJE_MS);
  assert.ok(vodic.razredi.has("tb-mir"), "po vodiču spet velja");
});

test("CSS: only phone/tablet, reading screens keep the stronger rule, reduced motion has no slide", () => {
  const css = readFileSync(new URL("../public/touch.css", import.meta.url), "utf8");
  const i = css.indexOf("body.tb-mir > .tabbar");
  assert.ok(i > 0, "touch.css ima pravilo za body.tb-mir");
  const blok = css.slice(css.lastIndexOf("@media", i), i);
  assert.match(blok, /max-width: 760px\), \(max-width: 1240px\) and \(hover: none\) and \(pointer: coarse\)/);
  assert.match(css, /prefers-reduced-motion: reduce\) \{ \.tabbar[^}]*transition: none/);
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /nastaviNogo\(\{ bar: tabbarEl/);
  assert.match(app, /const barAuto = \(\) => [^\n]*tb-mir, \.tb-vraca/, "poteg in kolešček v app.js ne mešata neuporabe z zasloni za branje");
});
