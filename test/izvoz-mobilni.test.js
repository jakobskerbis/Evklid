// Prenos podatkov v mobilni aplikaciji (GDPR čl. 15 in 20): zaslon mobile/src/app/export-data.tsx, vrstica v Jaz,
// besedila mob.export* v vseh 33 jezikih, strežnik izvoz s sejo aplikacije (geslo; Apple: test/izvoz-apple.test.js).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import SL from "../public/i18n/sl.js";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const KEYS = ["exportData", "exportTitle", "exportText", "exportPrivate", "exportButton", "exportAppleHint", "exportNoPassword", "exportSetPassword", "exportLinkSent", "exportDone", "exportUnavailable"].map((k) => `mob.${k}`);

test("zaslon za prenos: geslo ali Apple, datoteka v predpomnilnik in meni za deljenje, 401 kot pri izbrisu", () => {
  const src = read("mobile/src/app/export-data.tsx");
  assert.match(src, /api\("\/api\/account\/export", \{ method: "POST", body, signal: request\.current\.signal \}\)/);
  assert.match(src, /new File\(Paths\.cache, EXPORT_FILE\)/);
  assert.match(src, /Sharing\.shareAsync\(file\.uri, \{ mimeType: "application\/json"/);
  assert.match(src, /const denied = err instanceof ApiError && err\.status === 401 && !err\.body\?\.login;/);
  assert.match(src, /body\.apple_identity_token \? "mob\.appleFailed" : "mob\.wrongPassword"/);
  assert.match(src, /apple_identity_token: cred\.identityToken, apple_nonce: nonce/);
  // Pregled #525 B: write() je v expo-file-system 58 asinhron; zapuščen zaslon prekliče zahtevo in nič ne zapiše.
  assert.match(src, /await file\.write\(/, "deli šele celo datoteko");
  assert.doesNotMatch(src, /[^t] file\.write\(/, "brez neawaitanega write()");
  assert.match(src, /signal: request\.current\.signal/);
  assert.match(src, /mounted\.current = false;\s*request\.current\?\.abort\(\);\s*removeCopy\(\);/, "ob zapustitvi: preklic in izbris");
  assert.match(src, /mounted\.current = true;\s*removeCopy\(\);/, "ob odprtju: izbris ostanka");
  assert.match(src, /if \(!mounted\.current\) return;\s*const file = new File/, "po zapustitvi ne pišemo");
  assert.match(src, /if \(!mounted\.current\) return removeCopy\(\);\s*await Sharing\.shareAsync/, "meni za deljenje ne čez drug zaslon");
  assert.match(src, /catch \(err\) \{\s*request\.current = null;\s*removeCopy\(\);/, "ob napaki izbris");
  assert.match(src, /api\("\/api\/auth\/forgot", \{ body: \{ email: parent\.email \} \}\)/, "Android brez gesla: povezava za geslo");
  for (const k of src.match(/t\("mob\.[A-Za-z]+"/g)) assert.ok(SL[k.slice(3, -1)], `${k} manjka v sl.js`);
  assert.match(read("mobile/src/app/_layout.tsx"), /<Stack\.Screen name="export-data"/);
  assert.match(read("mobile/src/app/(tabs)/me.tsx"), /router\.push\("\/export-data"\)/);
  assert.match(read("mobile/src/lib/session.tsx"), /has_password\?: boolean;/);
});

test("besedila mob.export* v vseh jezikih, prevedena in z {email}", () => {
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(files.length, 32);
  for (const k of KEYS) assert.ok(SL[k], `sl: ${k}`);
  for (const f of files) {
    const d = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    for (const k of KEYS) {
      assert.ok(d[k], `${f}: ${k}`);
      assert.notEqual(d[k], SL[k], `${f}: ${k} je ostal slovenski`);
    }
    assert.match(d["mob.exportLinkSent"], /\{email\}/, f);
  }
});

test("strežnik: izvoz s sejo aplikacije z geslom; napačno geslo je 401 brez login (zaslon: mob.wrongPassword)", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  let session = null;
  const call = async (path, body) => {
    const res = await fetch(base + path, {
      method: body ? "POST" : "GET",
      headers: { "content-type": "application/json", "x-app-client": "android/1.0.0", "x-app-device": "naprava-izvoz-mobilni-1234567890", ...(session ? { authorization: `Bearer ${session}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const s = res.headers.get("x-app-session");
    if (s) session = s === "-" ? null : s;
    return { status: res.status, body: await res.json().catch(() => null) };
  };
  try {
    const reg = await call("/api/auth/register", { email: "izvoz@primer.si", password: "geslo12345", accept_privacy: true, birth_date: "1985-04-12" });
    assert.equal(reg.status, 201, JSON.stringify(reg.body));
    const st = await call("/api/account/status");
    assert.equal(st.body.parent.has_password, true, "zaslon pokaže polje za geslo");
    assert.equal(st.body.parent.guest, false);
    const bad = await call("/api/account/export", { password: "napacno-geslo" });
    assert.equal(bad.status, 401);
    assert.ok(!bad.body.login, "seja ostane, napačno geslo ni potekla prijava");
    const ok = await call("/api/account/export", { password: "geslo12345" });
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    assert.equal(ok.body.parent.email, "izvoz@primer.si");
    assert.equal(ok.body.parent.password_hash, undefined);
    assert.ok(Array.isArray(ok.body.children));
  } finally {
    server.close();
  }
});
