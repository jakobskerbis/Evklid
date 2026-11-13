import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { SETTINGS_TOOLS, createSettingsTools, mockToolCall, cleanDevice } from "../server/chat-settings.js";
import { PROFILE_SETTINGS, DEVICE_SETTINGS } from "../public/settings-registry.js";
import { ALL_SUBJECTS } from "../server/subjects.js";
import { ENUMS, DEFAULT_SETTINGS } from "../server/settings.js";

const tools = (store, student, extra = {}) => {
  const events = [];
  const pending = extra.pending || new Map();
  const t = createSettingsTools({ store, studentId: student.id, conversationId: 1, pending, send: (e, d) => events.push({ e, d }), ...extra });
  const call = async (name, input) => JSON.parse((await t.onToolUse(name, input)).content);
  return { ...t, call, events, pending };
};

test("registry covers every Settings form field and device setting; no financial or personal keys", () => {
  const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  const form = html.slice(html.indexOf('id="settings-form"'), html.indexOf("</form>", html.indexOf('id="settings-form"')));
  const fields = [...new Set([...form.matchAll(/name="([a-z_]+)"/g)].map((m) => m[1]))];
  // ime je osebni podatek; manual_weaknesses = weak_points; pace = reply_speed (naprava)
  const alias = { manual_weaknesses: "weak_points", pace: "reply_speed" };
  const exempt = ["name"];
  for (const f of fields) {
    if (exempt.includes(f)) continue;
    const key = alias[f] || f;
    assert.ok(PROFILE_SETTINGS[key] || DEVICE_SETTINGS[key], `nastavitev ${f} manjka v public/settings-registry.js`);
  }
  // Vse nastavitve profila na strežniku (razen regije, ki sledi jeziku) so v seznamu.
  for (const k of Object.keys(DEFAULT_SETTINGS)) if (k !== "region") assert.ok(PROFILE_SETTINGS[k], k);
  assert.deepEqual(PROFILE_SETTINGS.subject.values, ALL_SUBJECTS);
  for (const k of ["track", "solving_mode", "data_mode", "educational_track"]) assert.deepEqual(PROFILE_SETTINGS[k].values, ENUMS[k], k);
  const all = JSON.stringify(SETTINGS_TOOLS.find((x) => x.name === "change_settings").input_schema.properties.changes.properties);
  for (const bad of ["plan", "payment", "price", "stripe", "code", "email", "password", "birth", "parent", "nickname", '"name"']) {
    assert.ok(!Object.keys(JSON.parse(all)).some((k) => k.includes(bad.replaceAll('"', ""))), bad);
  }
  // Tool definitions are static (same bytes for every student → shared prompt cache).
  assert.equal(JSON.stringify(SETTINGS_TOOLS), JSON.stringify(SETTINGS_TOOLS));
});

test("profile changes apply at once; device changes go to the client; unknown or financial keys are refused", async () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana", { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" });
  const t = tools(store, s);
  let r = await t.call("change_settings", { changes: { subject: "KEM", solving_mode: "B", theme: "dark", reply_speed: "hitro", weak_points: ["ulomki"] } });
  assert.equal(r.status, "applied");
  const st = store.getStudent(s.id);
  assert.equal(st.settings.subject, "KEM");
  assert.equal(st.settings.solving_mode, "B");
  assert.deepEqual(st.manual_weaknesses, ["ulomki"]);
  assert.deepEqual(t.events.find((e) => e.e === "device_settings").d.changes, { theme: "dark", reply_speed: "hitro" });
  assert.ok(t.events.some((e) => e.e === "settings" && e.d.student.settings.subject === "KEM"));

  r = await t.call("change_settings", { changes: { plan: "family", email: "x@y.z" } });
  assert.equal(r.status, "error");
  assert.match(r.errors.join(" "), /financial and personal/);
  r = await t.call("change_settings", { changes: { theme: "purple", accent: "#12345" } });
  assert.equal(r.status, "error");
  assert.equal(store.getStudent(s.id).settings.subject, "KEM");

  const g = await t.call("get_settings", {});
  assert.equal(g.profile.subject, "KEM");
  assert.equal(g.device.theme, "dark");
  assert.ok(!("name" in g.profile) && !JSON.stringify(g).includes("Ana"));
});

test("school year change is only proposed, then applied after confirmation", async () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Bor", { educational_track: "UNIVERZA", study_program: "UL-FKKT-KEM", curriculum_level: "1. letnik" });
  const t = tools(store, s);
  let r = await t.call("change_settings", { changes: { curriculum_level: "2. letnik" }, confirmed: true });
  assert.equal(r.status, "needs_confirmation", "confirmed without a proposal is still only a proposal");
  assert.equal(store.getStudent(s.id).settings.curriculum_level, "1. letnik");
  assert.equal(t.state.proposal.to.level, "2. letnik");
  assert.equal(t.state.proposal.settings.curriculum_level, "2. letnik");
  r = await t.call("change_settings", { changes: { curriculum_level: "drugi letnik" }, confirmed: true });
  assert.equal(r.status, "applied");
  assert.equal(store.getStudent(s.id).settings.curriculum_level, "2. letnik");
  assert.equal(t.pending.size, 0);

  // Program by name; ambiguous names ask back.
  r = await t.call("change_settings", { changes: { study_program: "Kemija" } });
  assert.equal(r.status, "error");
  assert.match(r.errors[0], /UL FKKT – Kemija.*UM FKKT – Kemija|UM FKKT – Kemija.*UL FKKT – Kemija/);
  r = await t.call("change_settings", { changes: { study_program: "biokemija" } });
  assert.equal(r.status, "needs_confirmation");
  assert.equal(t.state.proposal.settings.study_program, "UL-FKKT-BIO");

  // Course of the year by name, applied at once.
  const opts = await t.call("get_settings", { options: "study_course" });
  assert.ok(opts.options.length > 2);
  r = await t.call("change_settings", { changes: { study_course: opts.options[1] } });
  assert.equal(r.status, "applied");

  // OŠ pupil saying »letnik« must say which school.
  const o = store.createStudent("Cene", { educational_track: "OSNOVNA_SOLA", curriculum_level: "9. razred" });
  const t2 = tools(store, o);
  r = await t2.call("change_settings", { changes: { curriculum_level: "1. letnik" } });
  assert.equal(r.status, "error");
  r = await t2.call("change_settings", { changes: { educational_track: "SREDNJA_SOLA", curriculum_level: "1. letnik VR" } });
  assert.equal(r.status, "needs_confirmation");
  assert.equal(t2.state.proposal.settings.curriculum_level, "1. letnik VR");
});

test("mock parser and device sanitizer", () => {
  assert.deepEqual(mockToolCall("Vklopi temni način, prosim").input.changes, { theme: "dark" });
  assert.deepEqual(mockToolCall("Zamenjaj na 2. letnik").input.changes, { curriculum_level: "2. letnik" });
  assert.equal(mockToolCall("Koliko je 2. letnik vrednosti?"), null);
  assert.equal(mockToolCall("da", true).input.confirmed, true);
  assert.equal(mockToolCall("da", false), null);
  assert.deepEqual(cleanDevice({ theme: "dark", accent: "#AABBCC", reply_speed: "x", evil: "1" }), { theme: "dark", accent: "#aabbcc" });
});

test("chat turn: tool call changes settings, streams events, the answer is not cached", async () => {
  const store = openDb(":memory:");
  let calls = 0;
  const streamFn = async ({ tools: tl, onToolUse, onText }) => {
    calls++;
    assert.ok(tl.some((x) => x.name === "change_settings"));
    const r = JSON.parse((await onToolUse("change_settings", { changes: { curriculum_level: "9. razred", theme: "dark" } })).content);
    const text = `${r.status === "needs_confirmation" ? "Res želiš v 9. razred?" : "Urejeno."}\n<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>`;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", toolCalls: 1 };
  };
  const app = createApp(store, { streamFn });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const s = await (await post("/api/students", { name: "Eva", settings: { curriculum_level: "8. razred" } })).json();
    const c = await (await post(`/api/students/${s.id}/conversations`, {})).json();
    const sse = await (await post(`/api/conversations/${c.id}/messages`, { text: "Daj me v 9. razred in vklopi temni način", device: { theme: "light" } })).text();
    const ev = sse.split("\n\n").filter(Boolean).map((x) => ({ event: /^event: (.*)$/m.exec(x)[1], data: JSON.parse(/^data: (.*)$/m.exec(x)[1]) }));
    assert.deepEqual(ev.find((e) => e.event === "device_settings").data.changes, { theme: "dark" });
    const prop = ev.find((e) => e.event === "proposal").data;
    assert.equal(prop.to.level, "9. razred");
    assert.equal(ev.at(-1).event, "done");
    assert.equal(store.getStudent(s.id).settings.curriculum_level, "8. razred");
    assert.equal(store.db.prepare("SELECT COUNT(*) n FROM answer_cache").get().n, 0);
    // Gumb »Da, spremeni« shrani predlog prek običajnega PUT.
    const put = await fetch(`${base}/api/students/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: prop.settings }) });
    assert.equal((await put.json()).settings.curriculum_level, "9. razred");
  } finally {
    server.close();
  }
  assert.equal(calls, 1);
});

test("tutor can dress the avatar only in free or bought items", async () => {
  const store = openDb(":memory:");
  const student = store.createStudent("Avi", { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" });
  const t = tools(store, student);
  let r = await t.call("change_settings", { changes: { avatar: { hat: "hat_crown" } } });
  assert.equal(r.status, "error");
  assert.match(r.errors[0], /not owned/);
  r = await t.call("change_settings", { changes: { avatar: { eyes: "eyes_happy", bg: "bg_mint" } } });
  assert.deepEqual(r.applied.find((x) => x.setting === "avatar").to.eyes, "eyes_happy");
  store.db.prepare("INSERT INTO avatar_items (student_id, item) VALUES (?, 'hat_crown')").run(student.id);
  r = await t.call("change_settings", { changes: { avatar: { hat: "hat_crown" } } });
  const to = r.applied.find((x) => x.setting === "avatar").to;
  assert.deepEqual(to.hat, ["hat_crown"]);
  assert.equal(to.eyes, "eyes_happy"); // ostali deli ostanejo
  const g = JSON.parse((await t.onToolUse("get_settings", {})).content);
  assert.deepEqual(g.profile.avatar.hat, ["hat_crown"]);
  assert.ok(g.avatar_items_available.some((x) => x.includes("hat_crown")));
  // Več predmetov v predalu: seznam do 6, samo svoji ali brezplačni.
  store.db.prepare("INSERT INTO avatar_items (student_id, item) VALUES (?, 'hat_phones')").run(student.id);
  r = await t.call("change_settings", { changes: { avatar: { hat: ["hat_crown", "hat_phones"] } } });
  assert.deepEqual(r.applied.find((x) => x.setting === "avatar").to.hat, ["hat_crown", "hat_phones"]);
  r = await t.call("change_settings", { changes: { avatar: { acc: ["acc_glasses", "acc_blush"] } } });
  assert.equal(r.status, "error");
  r = await t.call("change_settings", { changes: { avatar: { eyes: ["eyes_happy"] } } });
  assert.match(r.errors[0], /one item/);
});

test("tutor dialect: per language, by id or name, reset on language change, in prompt and cache key", async () => {
  const { buildSystemPrompt } = await import("../server/prompt.js");
  const { normalizeSettings } = await import("../server/settings.js");
  const { DIALECTS } = await import("../public/dialects.js");
  const store = openDb(":memory:");
  const student = store.createStudent("Ana", { language: "sl" });
  const t = tools(store, student);
  let r = await t.call("change_settings", { changes: { dialect: "Štajersko" } });
  assert.equal(r.status, "applied");
  assert.equal(store.getStudent(student.id).settings.dialect, "stajersko");
  r = await t.call("change_settings", { changes: { dialect: "en-GB" } });
  assert.equal(r.status, "error");
  r = await t.call("get_settings", { options: "dialect" });
  assert.ok(r.options.some((o) => o.startsWith("prekmursko")));
  // Prompt: narečje samo pod črto predpomnjenja, pravilo nad njo je enako za vse.
  const p = buildSystemPrompt({ settings: store.getStudent(student.id).settings });
  const [stat, dyn] = p.split("<!-- EVKLID:NASTAVITVE");
  assert.ok(!stat.includes("Štajersko –") && dyn.includes("Narečje / različica jezika: Štajersko –"));
  assert.ok(stat.includes("**Narečje / različica jezika**"));
  assert.ok(buildSystemPrompt({ settings: normalizeSettings({}) }).includes("Narečje / različica jezika: knjižni jezik"));
  // Menjava jezika: narečje drugega jezika ne velja več.
  const updated = store.updateStudent(student.id, { settings: { language: "en" } });
  assert.equal(updated.settings.dialect, "");
  assert.equal(normalizeSettings({ language: "en", dialect: "en-GB" }).dialect, "en-GB");
  assert.equal(normalizeSettings({ language: "en", dialect: "bogus" }).dialect, "");
  // Ids are unique per language and every entry has a name and a hint.
  for (const list of Object.values(DIALECTS)) {
    assert.equal(new Set(list.map((d) => d.id)).size, list.length);
    for (const d of list) assert.ok(d.name && d.hint.length > 10, d.id);
  }
  assert.deepEqual(mockToolCall("govori po prekmursko"), { name: "change_settings", input: { changes: { dialect: "prekmursk" } } });
});
