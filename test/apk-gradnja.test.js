// Gradnja APK na GitHubu (.github/workflows/apk.yml) mora ostati enaka gradnji EAS s profilom "direct",
// sicer APK ne dobi posodobitev JavaScripta (.eas/workflows/posodobitev.yml) ali se ne namesti čez staro.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const wf = fs.readFileSync(new URL("../.github/workflows/apk.yml", import.meta.url), "utf8");
const eas = JSON.parse(fs.readFileSync(new URL("../mobile/eas.json", import.meta.url), "utf8"));

test("APK na GitHubu: isti kanal in prstni odtis kot profil direct", () => {
  assert.equal(eas.build.direct.env.EXPO_PUBLIC_CHANNEL, "direct");
  assert.match(wf, /EXPO_PUBLIC_CHANNEL: direct/);
  assert.match(wf, /expo-channel-name\\&quot;:\\&quot;direct/, "glava kanala direct v AndroidManifest");
  assert.match(wf, /EXPO_UPDATES_FINGERPRINT_OVERRIDE/, "prstni odtis izračunan pred prebuild");
  assert.match(wf, /api\/app-links/, "številka različice = evklid.app + 1");
});

test("APK na GitHubu: ključ samo iz skrivnosti, izdaja samo z main, brez samodejnega zagona", () => {
  for (const s of ["ANDROID_KEYSTORE_BASE64", "ANDROID_KEYSTORE_PASSWORD", "ANDROID_KEY_ALIAS", "ANDROID_KEY_PASSWORD"]) assert.ok(wf.includes(`secrets.${s}`), s);
  assert.match(wf, /--ks-pass env:KS_PASS/, "geslo ne v ukazni vrstici");
  assert.match(wf, /github\.ref == 'refs\/heads\/main'/);
  assert.doesNotMatch(wf, /^\s+push:/m, "gradnja samo ročno");
});
