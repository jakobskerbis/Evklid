// /prenesi pove velikost in datum APK na tem strežniku (pregled javnih strani 21. 11. 2026, P5, del brez nove gradnje):
// dijak na mobilnih podatkih pred prenosom vidi, koliko prenaša. APK z drugega naslova: teh podatkov ni.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import { mountDownload } from "../server/mobile/download.js";

async function page(opts, query = "?lang=sl") {
  const app = express();
  mountDownload(app, opts);
  const server = app.listen(0);
  try {
    return await (await fetch(`http://127.0.0.1:${server.address().port}/prenesi${query}`)).text();
  } finally {
    server.close();
  }
}

test("lokalni APK: približna velikost in datum pod gumbom; brez APK ali z oddaljenim APK ni vrstice", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "apk-"));
  const apkFile = path.join(dir, "evklid.apk");
  fs.writeFileSync(apkFile, Buffer.concat([Buffer.from("PK\x03\x04"), Buffer.alloc(2_400_000)]));
  const when = new Date("2026-11-04T10:00:00Z");
  fs.utimesSync(apkFile, when, when);
  try {
    const sl = await page({ apkFile, env: {} });
    const info = sl.match(/<p class="muted" id="apk-info">([^<]*)<\/p>/)?.[1];
    assert.ok(info, "vrstica z velikostjo");
    assert.match(info, /^približno 2 MB · /);
    assert.match(info, /objavljeno 4\. novembra 2026$/);
    const en = await page({ apkFile, env: {} }, "?lang=en");
    assert.match(en.match(/id="apk-info">([^<]*)</)[1], /^about 2 MB · .*released November 4, 2026$/);
    assert.doesNotMatch(await page({ apkFile: path.join(dir, "ni.apk"), env: {} }), /apk-info/);
    assert.doesNotMatch(await page({ apkFile, env: { EVKLID_ANDROID_APK_URL: "https://example.org/a.apk" } }), /apk-info/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Pregled 27. 11. 2026 (revizija za pilot): na evklid.app je pisalo »različica [object Object]«, ker apkVersion vrne
// { versionCode, versionName }. Dijak mora videti ime različice (»1.0.0«).
test("različica APK na /prenesi: ime različice iz manifesta, nikoli [object Object]", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "apk-"));
  const apkFile = path.join(dir, "evklid.apk");
  fs.copyFileSync(new URL("./fixtures/mini.apk", import.meta.url), apkFile);
  try {
    const sl = await page({ apkFile, env: {} });
    const info = sl.match(/id="apk-info">([^<]*)</)?.[1] || "";
    assert.match(info, /različica 1\.0\.0/);
    assert.doesNotMatch(sl, /object Object/);
    const en = await page({ apkFile, env: {} }, "?lang=en");
    assert.match(en.match(/id="apk-info">([^<]*)</)[1], /version 1\.0\.0/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
