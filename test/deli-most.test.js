// Most za deljenje slike v mobilni aplikaciji (public/deli-most.js): kdaj je gumb »Deli zbirko« viden in kaj
// aplikacija sprejme od strani.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { shareMode, checkShareImage, shareResultKey, shareResultJs, base64Bytes, NATIVE_FLAG_JS, SHARE_IMAGE, SHARE_IMAGE_RESULT, SHARE_IMAGE_MAX } from "../public/deli-most.js";

const APP_UA = "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36 EvklidApp/1.0.0";
const WEB_UA = "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36";
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]).toString("base64");
const msg = (o = {}) => ({ type: SHARE_IMAGE, id: "1-abc", name: "evklid-zbirka.png", dataBase64: PNG, ...o });

test("v aplikaciji brez zastavice (starejši APK) je gumb skrit", () => {
  assert.equal(shareMode(APP_UA, undefined), "");
  assert.equal(shareMode(APP_UA, {}), "");
  assert.equal(shareMode(APP_UA, { shareImage: 0 }), "");
});

test("v aplikaciji z zastavico deli most, drugje brskalnik", () => {
  assert.equal(shareMode(APP_UA, { shareImage: 1 }), "bridge");
  assert.equal(shareMode(WEB_UA, undefined), "browser");
  // Zastavica zunaj aplikacije ne spremeni poti (ni ReactNativeWebView).
  assert.equal(shareMode(WEB_UA, { shareImage: 1 }), "browser");
  assert.equal(shareMode("", undefined), "browser");
});

test("zastavica, ki jo vbrizga aplikacija, nastavi window.EvklidNative.shareImage", () => {
  const window = { EvklidNative: { other: 2 } };
  new Function("window", NATIVE_FLAG_JS)(window);
  assert.deepEqual(window.EvklidNative, { other: 2, shareImage: 1 });
  assert.equal(shareMode(APP_UA, window.EvklidNative), "bridge");
});

test("veljavno sporočilo s PNG", () => {
  assert.deepEqual(checkShareImage(msg()), { ok: true, id: "1-abc", name: "evklid-zbirka.png", dataBase64: PNG });
});

test("napačna vrsta, ime, podatki ali ne-PNG so zavrnjeni", () => {
  assert.equal(checkShareImage(null).error, "type");
  assert.equal(checkShareImage("x").error, "type");
  assert.equal(checkShareImage(msg({ type: "evklid:other" })).error, "type");
  for (const name of ["", "a.jpg", "../x.png", "a/b.png", ".png", "x".repeat(70) + ".png", 5]) assert.equal(checkShareImage(msg({ name })).error, "name", String(name));
  for (const dataBase64 of ["", 7, "abc", "iVBO!w0KGgo=", `data:image/png;base64,${PNG}`]) assert.equal(checkShareImage(msg({ dataBase64 })).error, "data", String(dataBase64));
  assert.equal(checkShareImage(msg({ dataBase64: Buffer.from("GIF89a-not-png!").toString("base64") })).error, "png");
  assert.equal(checkShareImage(msg({ dataBase64: Buffer.from("<svg/>").toString("base64") })).error, "png");
  // Napaka ohrani id, da stran prepozna odgovor.
  assert.equal(checkShareImage(msg({ name: "x.gif" })).id, "1-abc");
});

test("meja velikosti 5 MB", () => {
  const head = Buffer.from(PNG, "base64");
  const at = Buffer.concat([head, Buffer.alloc(SHARE_IMAGE_MAX - head.length)]).toString("base64");
  assert.equal(base64Bytes(at), SHARE_IMAGE_MAX);
  assert.equal(checkShareImage(msg({ dataBase64: at })).ok, true);
  const over = Buffer.concat([head, Buffer.alloc(SHARE_IMAGE_MAX - head.length + 1)]).toString("base64");
  assert.equal(checkShareImage(msg({ dataBase64: over })).error, "size");
});

test("odgovor aplikacije: uspeh pomeni le, da se je meni odprl", () => {
  assert.equal(shareResultKey({ ok: true }), "share.appOpened");
  assert.equal(shareResultKey({ ok: false, error: "x" }), "share.appFailed");
  assert.equal(shareResultKey(undefined), "share.appFailed");
  assert.equal(shareResultKey({ ok: "true" }), "share.appFailed");
  const sl = fs.readFileSync(new URL("../public/i18n/sl.js", import.meta.url), "utf8");
  assert.match(sl, /"share\.appOpened": "Odprl se je meni za deljenje\./);
  assert.doesNotMatch(sl, /"share\.appOpened": "[^"]*shranjen/i, "ne trdimo, da je slika shranjena");
});

test("injectJavaScript odgovora sproži dogodek z id-jem na strani", () => {
  const seen = [];
  const window = { dispatchEvent: (e) => seen.push(e) };
  class CustomEvent {
    constructor(type, init) {
      this.type = type;
      this.detail = init.detail;
    }
  }
  const run = (r) => new Function("window", "CustomEvent", shareResultJs(r))(window, CustomEvent);
  run({ id: "1-abc", ok: true });
  run({ id: "2", ok: false, error: "Activity not found </script>" });
  assert.deepEqual(seen.map((e) => [e.type, e.detail]), [
    [SHARE_IMAGE_RESULT, { id: "1-abc", ok: true, error: "" }],
    [SHARE_IMAGE_RESULT, { id: "2", ok: false, error: "Activity not found </script>" }],
  ]);
});

test("brez odgovora aplikacije stran po času neha čakati, brez sporočila in brez poslušalca", async () => {
  const { shareCardNative } = await import("../public/deli-kartico.js");
  const listeners = new Set();
  const posted = [];
  globalThis.window = {
    addEventListener: (_, f) => listeners.add(f),
    removeEventListener: (_, f) => listeners.delete(f),
    ReactNativeWebView: { postMessage: (s) => posted.push(JSON.parse(s)) },
  };
  globalThis.FileReader = class {
    readAsDataURL() {
      this.result = `data:image/png;base64,${PNG}`;
      queueMicrotask(() => this.onload());
    }
  };
  try {
    const r = await shareCardNative(new Blob([]), { name: "evklid-zbirka.png", timeout: 20 });
    assert.deepEqual(r, { ok: false, error: "timeout" });
    assert.equal(listeners.size, 0);
    assert.equal(checkShareImage(posted[0]).ok, true, "poslano sporočilo prestane preverjanje aplikacije");
    assert.equal(shareResultKey(r), "", "ob izteku časa ne trdimo ne uspeha ne napake");
  } finally {
    delete globalThis.window;
    delete globalThis.FileReader;
  }
});
