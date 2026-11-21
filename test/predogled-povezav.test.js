// Predogled povezave v WhatsAppu, Messengerju, Viberju (pregled javnih strani 21. 11. 2026, P3): strani, ki jih dijak
// pošlje staršu (povezava za plačilo, Za starše), vabilo v pilot in /prenesi imajo opis, og:title, og:description,
// veliko sliko za deljenje (deljenje.jpg) in twitter:card=summary_large_image. Strani z žetonom ostanejo noindex.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const read = (f) => readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");
const meta = (html, attr, name) => html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];
const IMG = "https://evklid.app/icons/deljenje.jpg";

function checkPreview(html, label, { domain = true } = {}) {
  const desc = meta(html, "name", "description");
  assert.ok(desc && desc.length >= 60 && desc.length <= 220, `${label}: opis (${desc?.length})`);
  if (domain) assert.ok(/evklid\.app/.test(desc), `${label}: opis pove domeno`);
  for (const k of ["og:title", "og:description"]) assert.ok(meta(html, "property", k)?.trim(), `${label}: ${k}`);
  assert.equal(meta(html, "property", "og:image"), IMG, `${label}: og:image`);
  assert.equal(meta(html, "property", "og:image:width"), "1200", label);
  assert.equal(meta(html, "property", "og:image:height"), "630", label);
  assert.equal(meta(html, "name", "twitter:card"), "summary_large_image", label);
}

test("placaj.html, vabilo.html, starsi.html: opis in predogled z veliko sliko; noindex na straneh z žetonom ostane", () => {
  assert.ok(existsSync(new URL("../public/icons/deljenje.jpg", import.meta.url)));
  for (const f of ["placaj.html", "vabilo.html", "starsi.html"]) checkPreview(read(f), f);
  for (const f of ["placaj.html", "vabilo.html"]) {
    const html = read(f);
    assert.match(html, /<meta name="robots" content="noindex">/, f);
    assert.equal(meta(html, "property", "og:url"), undefined, `${f}: brez og:url (naslov ima žeton ali kodo)`);
  }
  assert.match(read("placaj.html"), /<title>Plačilo za Evklid<\/title>/);
  assert.match(read("vabilo.html"), /<title>Vabilo v pilot Evklida<\/title>/);
  assert.doesNotMatch(read("starsi.html"), /noindex/);
  assert.equal(meta(read("starsi.html"), "property", "og:url"), "https://evklid.app/starsi.html");
});

test("/o-evklidu in /zakaj-evklid: velika slika za deljenje namesto kvadratne ikone", () => {
  for (const f of ["o-evklidu.html", "zakaj-evklid.html"]) {
    const html = read(f);
    assert.equal(meta(html, "property", "og:image"), IMG, f);
    assert.equal(meta(html, "name", "twitter:card"), "summary_large_image", f);
    assert.ok(!html.includes("icon-512.png\">\n  <meta name=\"twitter:card\""), f);
  }
});

test("/prenesi (izriše strežnik): opis je uvod strani v jeziku obiskovalca, predogled z veliko sliko", async () => {
  const store = openDb(":memory:");
  const server = createApp(store, { scheduler: false, log: { error() {}, warn() {}, info() {} } }).listen(0);
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const sl = await (await fetch(`${base}/prenesi?lang=sl`)).text();
    checkPreview(sl, "/prenesi", { domain: false });
    const intro = sl.match(/<main>[\s\S]*?<p>([^<]+)<\/p>/)[1];
    assert.equal(meta(sl, "name", "description"), intro, "opis = uvod strani");
    assert.equal(meta(sl, "property", "og:url"), "https://evklid.app/prenesi");
    const en = await (await fetch(`${base}/prenesi?lang=en`)).text();
    assert.notEqual(meta(en, "name", "description"), meta(sl, "name", "description"), "opis v jeziku strani");
  } finally {
    server.close();
    store.db.close();
  }
});
