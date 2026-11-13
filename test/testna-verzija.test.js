// Obvestilo »Testna verzija«: seznam tega, kar še ne dela, sledi nastavitvam strežnika.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const ENV = ["EVKLID_TESTNA_VERZIJA", "STRIPE_SECRET_KEY", "RESEND_API_KEY"];

async function notice(env, { creditOutAt } = {}) {
  const old = Object.fromEntries(ENV.map((k) => [k, process.env[k]]));
  for (const k of ENV) delete process.env[k];
  Object.assign(process.env, env);
  const store = openDb(":memory:");
  if (creditOutAt) {
    store.db.exec("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
    store.db.prepare("INSERT INTO kv (key, value) VALUES ('ai_credit_out_at', ?)").run(String(creditOutAt));
  }
  const server = createApp(store).listen(0);
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}/api/config`);
    return (await res.json()).test_notice;
  } finally {
    server.close();
    for (const k of ENV) old[k] === undefined ? delete process.env[k] : (process.env[k] = old[k]);
  }
}

test("testna verzija: brez Stripe v živo in brez Resend našteje vse", async () => {
  assert.deepEqual(await notice({}), ["tutor", "pay", "email", "apps"]);
  assert.deepEqual(await notice({ STRIPE_SECRET_KEY: "sk_test_x" }), ["tutor", "pay", "email", "apps"]);
});

test("testna verzija: plačila v živo in e-pošta izpadeta s seznama", async () => {
  assert.deepEqual(await notice({ STRIPE_SECRET_KEY: "sk_live_x", RESEND_API_KEY: "re_x" }), ["tutor", "apps"]);
});

test("testna verzija: brez AI kredita (zapisano v bazi) napiše, da inštruktor ne odgovarja", async () => {
  assert.deepEqual(await notice({}, { creditOutAt: Date.now() - 3600_000 }), ["tutorOff", "pay", "email", "apps"]);
  assert.deepEqual(await notice({}, { creditOutAt: Date.now() - 3 * 24 * 3600_000 }), ["tutor", "pay", "email", "apps"]);
});

test("testna verzija: EVKLID_TESTNA_VERZIJA=off skrije obvestilo", async () => {
  assert.deepEqual(await notice({ EVKLID_TESTNA_VERZIJA: "off" }), []);
});

test("testna verzija: vsak ključ obvestila je preveden v vse jezike", async () => {
  const fs = await import("node:fs");
  const SL = (await import("../public/i18n/sl.js")).default;
  const keys = ["title", "text", "more", "close", "tutorOff", "tutor", "pay", "email", "apps", "reportText", "report"].map((k) => `beta.${k}`);
  for (const k of keys) assert.ok(SL[k], k);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of fs.readdirSync(dir)) {
    const o = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    for (const k of keys) assert.ok(o[k], `${f} ${k}`);
    assert.notEqual(o["beta.tutor"], SL["beta.tutor"], `${f} ni preveden`);
  }
});

test("testna verzija: oznaka »ni AI kredita« preživi ponovni zagon in izgine ob prvem uspešnem klicu", async () => {
  const { Usage } = await import("../server/usage.js");
  const store = openDb(":memory:");
  new Usage(store.db).markCreditOut();
  const u = new Usage(store.db);
  assert.equal(u.creditOutRecently(), true);
  u.log(null, "claude-haiku-4-5", { input_tokens: 10, output_tokens: 5 });
  assert.equal(new Usage(store.db).creditOutRecently(), false);
});
