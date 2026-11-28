// Skener (public/scan/scan.js): jasna sporočila, ko kamera ali slika ne gre, sproščanje blob: URL-jev in okvir s tipkovnico
// (j, 25. 11. 2026, profil A8). Slika, ki je brskalnik ne zna odpreti (npr. HEIC v Chromu), ni »na sliki ni naloge«;
// zavrnjena, zasedena ali manjkajoča kamera ima vsaka svoje sporočilo.
import { test } from "node:test";
import assert from "node:assert/strict";

// --- najmanjši ponaredek DOM-a: vsak querySelector vrne (shranjen) element, ki si zapomni poslušalce ---
function fakeEl() {
  const kids = new Map();
  const on = {};
  return {
    hidden: false,
    isConnected: true,
    style: {},
    dataset: {},
    textContent: "",
    innerHTML: "",
    clicks: 0,
    on,
    addEventListener(type, fn) {
      (on[type] ||= []).push(fn);
    },
    removeEventListener() {},
    setAttribute() {},
    setPointerCapture() {},
    insertAdjacentHTML() {},
    click() {
      this.clicks++;
    },
    play: () => Promise.resolve(),
    querySelector(sel) {
      if (!kids.has(sel)) kids.set(sel, fakeEl());
      return kids.get(sel);
    },
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 360, height: 300 }),
  };
}
let box = fakeEl();
const view = { hidden: false };
globalThis.document = {
  documentElement: { dataset: {}, setAttribute() {}, removeAttribute() {}, getAttribute: () => null, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} } },
  getElementById: (id) => (id === "view-scan" ? view : null),
  querySelector: (sel) => (sel === "#view-scan .scan-body" ? box : null),
  querySelectorAll: () => [],
  addEventListener() {},
  createElement: () => ({ getContext: () => null }),
};
globalThis.window = globalThis;
globalThis.addEventListener ??= () => {};
globalThis.removeEventListener ??= () => {};
globalThis.matchMedia = () => ({ matches: true }); // telefon: kamera začne sama
let gumError = null;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: { onLine: true, languages: ["sl-SI"], mediaDevices: { getUserMedia: () => Promise.reject(gumError) } },
});
const revoked = [];
URL.createObjectURL = (file) => `blob:test/${file.name}`;
URL.revokeObjectURL = (u) => revoked.push(u);
// slika: »bad« se ne odpre (onerror), ostale se
globalThis.Image = class {
  set src(u) {
    setTimeout(() => {
      if (u.includes("bad")) return this.onerror?.();
      this.naturalWidth = 800;
      this.naturalHeight = 600;
      this.onload?.();
    });
  }
};

const { t } = await import("../public/i18n.js");
const scan = await import("../public/scan/scan.js");
const toasts = [];
scan.initScan({ getStudent: () => ({ id: 1, settings: {} }), toast: (m) => toasts.push(m), api: async () => ({}) });
const tick = () => new Promise((r) => setTimeout(r, 5));

test("ime napake kamere → sporočilo (zavrnjena, zasedena, je ni, sicer splošno)", () => {
  const cases = {
    NotAllowedError: "scan.camDenied",
    SecurityError: "scan.camDenied",
    NotReadableError: "scan.camBusy",
    AbortError: "scan.camBusy",
    NotFoundError: "scan.camNone",
    OverconstrainedError: "scan.camNone",
    TypeError: "scan.camOff",
  };
  for (const [name, key] of Object.entries(cases)) assert.equal(scan.camErrorKey(new DOMException("x", name)), key, name);
  assert.equal(scan.camErrorKey(undefined), "scan.camOff");
  for (const k of ["scan.camDenied", "scan.camBusy", "scan.camNone", "scan.imgFormat", "scan.frameKeys"]) assert.notEqual(t(k), k, `${k} ima besedilo`);
});

test("zavrnjena kamera na zaslonu pokaže svoje sporočilo, ne splošnega", async () => {
  for (const [name, key] of [
    ["NotAllowedError", "scan.camDenied"],
    ["NotReadableError", "scan.camBusy"],
    ["NotFoundError", "scan.camNone"],
  ]) {
    box = fakeEl();
    gumError = new DOMException("x", name);
    scan.leaveScan();
    scan.showScan();
    await tick();
    const off = box.querySelector(".scan-cam-off");
    assert.equal(off.hidden, false, name);
    assert.equal(off.querySelector("p").textContent, t(key, { btn: t("scan.gallery") }), name);
  }
  assert.match(t("scan.camNone", { btn: t("scan.gallery") }), /»Iz galerije«/);
});

test("slika v neznanem zapisu: sporočilo o zapisu (ne »ni naloge«) in sproščen URL", async () => {
  box = fakeEl();
  toasts.length = 0;
  revoked.length = 0;
  scan.loadFile({ name: "bad.heic" });
  await tick();
  assert.deepEqual(toasts, [t("scan.imgFormat")]);
  assert.notEqual(toasts[0], t("scan.readFail"));
  assert.deepEqual(revoked, ["blob:test/bad.heic"]);
});

test("zamenjana in zaprta slika sprostita blob: URL; okvir se premika s puščicami", async () => {
  box = fakeEl();
  revoked.length = 0;
  scan.loadFile({ name: "a.jpg" });
  await tick();
  assert.deepEqual(revoked, []);
  scan.loadFile({ name: "b.jpg" });
  await tick();
  assert.deepEqual(revoked, ["blob:test/a.jpg"], "prejšnja slika sproščena, nova ne");

  const frameEl = box.querySelector("[data-stage]").querySelector(".scan-frame");
  const key = (k, shiftKey = false) => frameEl.on.keydown.at(-1)({ key: k, shiftKey, preventDefault() {} });
  const pct = (v) => Math.round(parseFloat(v) * 100) / 100;
  key("ArrowRight"); // okvir slike iz galerije je 4 % / 92 %: korak 2 % v desno
  assert.equal(pct(frameEl.style.left), 6);
  key("ArrowDown", true); // Shift: spodnji rob niže
  assert.equal(pct(frameEl.style.height), 94);
  assert.equal(pct(frameEl.style.top), 4);

  assert.equal(scan.scanBack(), true);
  assert.deepEqual(revoked, ["blob:test/a.jpg", "blob:test/b.jpg"], "nazaj na zajem sprosti sliko");
});

test("nudgeFrame: premik ostane v sliki, Shift spremeni velikost (najmanj 10 %)", () => {
  const f = { x: 0.04, y: 0.04, w: 0.92, h: 0.92 };
  assert.deepEqual(scan.nudgeFrame(f, -0.1, 0, false), { ...f, x: 0 });
  assert.deepEqual(scan.nudgeFrame(f, 0.1, 0.1, false), { ...f, x: 1 - 0.92, y: 1 - 0.92 });
  assert.deepEqual(scan.nudgeFrame(f, 0.02, 0, true), { ...f, w: 0.92 + 0.02 });
  assert.deepEqual(scan.nudgeFrame(f, 0.1, 0, true), { ...f, w: 1 - 0.04 }, "desni rob ostane v sliki");
  assert.deepEqual(scan.nudgeFrame({ x: 0.5, y: 0.5, w: 0.12, h: 0.12 }, -0.05, -0.05, true), { x: 0.5, y: 0.5, w: 0.1, h: 0.1 });
});
