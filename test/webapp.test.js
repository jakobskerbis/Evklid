// Aplikacija na začetnem zaslonu: manifest v jeziku vmesnika, bližnjice, posnetki, Google Play.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import { manifest, manifestLang, mountWebApp } from "../server/webapp.js";
import { passwordGate } from "../server/gate.js";

const PUB = path.join(import.meta.dirname, "..", "public");

async function withServer(fn, { gate = false } = {}) {
  const app = express();
  if (gate) app.use(passwordGate("geslo"));
  mountWebApp(app);
  const server = app.listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

test("manifest: namestljiv (ime, ikone, začetek, samostojno okno) in vse datoteke obstajajo", () => {
  const m = manifest("sl");
  assert.equal(m.id, "/");
  assert.equal(m.start_url, "/");
  assert.equal(m.display, "standalone");
  assert.equal(m.description, "Inštruktor za matematiko, fiziko in kemijo");
  assert.ok(m.icons.some((i) => i.sizes === "192x192") && m.icons.some((i) => i.sizes === "512x512" && i.purpose === "maskable"));
  assert.ok(m.screenshots.some((s) => s.form_factor === "wide") && m.screenshots.some((s) => s.form_factor === "narrow"));
  for (const src of [...m.icons, ...m.screenshots, ...m.shortcuts.flatMap((s) => s.icons)].map((i) => i.src)) {
    assert.ok(fs.existsSync(path.join(PUB, src)), `manjka ${src}`);
    assert.match(src, /^\/icons\/[\w.-]+\.png$/, `${src} mora biti dostopen brez gesla`);
  }
  for (const s of m.shortcuts) assert.match(s.url, /^\/\?pogled=(path|chat|textbook|graph)$/);
});

test("manifest v jeziku vmesnika: ?lang= ima prednost, sicer jezik brskalnika, desno-levo za arabščino", () => {
  assert.equal(manifestLang("ja", ["de"]), "ja");
  assert.equal(manifestLang(undefined, ["de-AT", "en"]), "de");
  assert.equal(manifestLang("<script>", ["sl-SI"]), "sl");
  const ja = manifest("ja");
  assert.equal(ja.shortcuts[0].name, "学習パス");
  assert.equal(manifest("ar").dir, "rtl");
  // jezik brez prevoda vmesnika uporabi nadomestnega (bhodžpuri → hindijščina)
  assert.equal(manifest("bho").description, manifest("hi").description);
});

test("manifest in povezava za Google Play sta dostopna brez gesla", () =>
  withServer(
    async (base) => {
      const r = await fetch(base + "/manifest.webmanifest?lang=de");
      assert.equal(r.status, 200);
      assert.match(r.headers.get("content-type"), /manifest\+json/);
      assert.equal((await r.json()).lang, "de");
      const a = await fetch(base + "/.well-known/assetlinks.json");
      assert.equal(a.status, 404); // brez ANDROID_PACKAGE / ANDROID_SHA256
      process.env.ANDROID_PACKAGE = "si.evklid.app";
      process.env.ANDROID_SHA256 = "AA:BB, CC:DD";
      try {
        const b = await (await fetch(base + "/.well-known/assetlinks.json")).json();
        assert.equal(b[0].target.package_name, "si.evklid.app");
        assert.deepEqual(b[0].target.sha256_cert_fingerprints, ["AA:BB", "CC:DD"]);
      } finally {
        delete process.env.ANDROID_PACKAGE;
        delete process.env.ANDROID_SHA256;
      }
    },
    { gate: true },
  ));

test("manifest: barva sistemske vrstice sledi slogu (?barva=, ?ozadje=), neveljavne vrednosti zavrne", async () => {
  const m = manifest("sl");
  assert.equal(m.theme_color, "#ffffff"); // privzeti slog »čist«, ne več modra
  assert.equal(m.background_color, "#f6f7f9");
  assert.equal(manifest("sl", { barva: "#EAD8BD", ozadje: "#f3ead8" }).theme_color, "#ead8bd");
  assert.equal(manifest("sl", { barva: "red;}", ozadje: ["#000000"] }).theme_color, "#ffffff");
  await withServer(async (base) => {
    const r = await (await fetch(base + "/manifest.webmanifest?lang=sl&barva=%23301b16&ozadje=%2319130c")).json();
    assert.equal(r.theme_color, "#301b16");
    assert.equal(r.background_color, "#19130c");
  });
  // theme.js in install.js ohranita drug drugemu parameter v povezavi do manifesta
  const theme = fs.readFileSync(path.join(PUB, "theme.js"), "utf8");
  const inst = fs.readFileSync(path.join(PUB, "install.js"), "utf8");
  assert.match(theme, /searchParams\.set\("barva"/);
  assert.match(inst, /searchParams\.set\("lang"/);
});
