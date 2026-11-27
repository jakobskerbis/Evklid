// Stikalo »Podrobna razlaga« (j, 27. 11. 2026): izklopljeno = kratki odgovori, vklopljeno = običajne dolžine.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildSystemPrompt, systemBlocks } from "../server/prompt.js";
import { normalizeSettings } from "../server/settings.js";
import { cacheKey } from "../server/app.js";
import { createSettingsTools } from "../server/chat-settings.js";
import { PROFILE_SETTINGS } from "../public/settings-registry.js";
import { openDb } from "../server/db.js";

const dolzina = (p) => systemBlocks(p)[1].text.match(/Dolžina odgovorov: (.+)/)[1];

test("privzeto kratki odgovori, stikalo vklopi podrobno razlago, lahki način ostane kratek", () => {
  assert.equal(normalizeSettings({}).detailed, false);
  assert.equal(normalizeSettings({ detailed: true }).detailed, true);
  assert.equal(normalizeSettings({ detailed: "nekaj" }).detailed, false);
  assert.equal(dolzina(buildSystemPrompt({ settings: normalizeSettings({}) })), "kratka");
  assert.equal(dolzina(buildSystemPrompt({ settings: normalizeSettings({ detailed: true }) })), "podrobna");
  assert.equal(dolzina(buildSystemPrompt({ settings: normalizeSettings({ detailed: true }), lite: true })), "kratka (lahki način)");
});

test("stalni del prompta ima meje 50/150/300 in je enak ne glede na stikalo", () => {
  const a = systemBlocks(buildSystemPrompt({ settings: normalizeSettings({}) }))[0].text;
  const b = systemBlocks(buildSystemPrompt({ settings: normalizeSettings({ detailed: true }) }))[0].text;
  assert.equal(a, b);
  assert.match(a, /Največ 50 besed za vsak odgovor .*Do 150 besed le za celotno rešitev ene naloge/);
  assert.match(a, /do 300 le za rešitev naloge s podvprašanji/);
  assert.match(a, /»Podrobna razlaga«/);
});

test("shranjeni dolgi odgovori se ne vrnejo kratkemu načinu", () => {
  const t = "Kaj je množina snovi in kako jo izračunam?";
  const s = { subject: "KEM", educational_track: "SREDNJA_SOLA", curriculum_level: "1. letnik", solving_mode: "A" };
  assert.notEqual(cacheKey(t, { ...s, detailed: false }, "chat"), cacheKey(t, { ...s, detailed: true }, "chat"));
});

test("inštruktor stikalo preklopi iz klepeta, v obrazcu je stikalo", async () => {
  assert.deepEqual(PROFILE_SETTINGS.detailed.values, ["on", "off"]);
  const html = readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  assert.match(html, /role="switch"[^>]*data-detailed/);
  assert.match(html, /name="detailed"/);
  const store = openDb(":memory:");
  const s = store.createStudent("Ana", { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" });
  const st = createSettingsTools({ store, studentId: s.id, conversationId: 1, pending: new Map() });
  const call = async (name, input) => JSON.parse((await st.onToolUse(name, input)).content);
  const r = await call("change_settings", { changes: { detailed: "on" } });
  assert.equal(r.status, "applied");
  assert.equal(store.getStudent(s.id).settings.detailed, true);
  assert.match(JSON.stringify(await call("get_settings", {})), /"detailed":"on"/);
});
