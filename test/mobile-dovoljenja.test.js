// Dovoljenja mobilne aplikacije (mobile/app.config.ts): kamera za zavihek Skeniraj ne sme biti blokirana.
// expo-image-picker s cameraPermission: false doda CAMERA med blokirana dovoljenja (tools:node="remove"),
// zato je APK 5 ni imel in je v nastavitvah Androida ni bilo mogoče vklopiti.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const src = fs.readFileSync(new URL("../mobile/app.config.ts", import.meta.url), "utf8");

test("kamera je zahtevana in je noben vtičnik ne blokira", () => {
  assert.match(src, /permissions:\s*\[[^\]]*"android\.permission\.CAMERA"/);
  const blocked = src.match(/blockedPermissions:\s*\[([^\]]*)\]/)?.[1] ?? "";
  assert.doesNotMatch(blocked, /CAMERA/);
  for (const plugin of ["expo-camera", "expo-image-picker"]) {
    const line = src.split("\n").find((l) => l.includes(`["${plugin}"`));
    assert.ok(line, `${plugin} manjka med vtičniki`);
    assert.doesNotMatch(line, /cameraPermission:\s*false/, `${plugin} ne sme imeti cameraPermission: false`);
  }
});
