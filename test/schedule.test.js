import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { normalizeSettings } from "../server/settings.js";
import { createSettingsTools, mockToolCall } from "../server/chat-settings.js";
import { SCHEDULE_SETTINGS, DEVICE_SETTINGS } from "../public/settings-registry.js";
import { buildSystemPrompt } from "../server/prompt.js";
import {
  parseIcs,
  normalizeLesson,
  normalizeEvent,
  matchSubject,
  splitSummary,
  cleanIcsUrl,
  fetchIcs,
  parseFmfLayers,
  scheduleView,
  schedulePrompt,
  Schedules,
  nowParts,
} from "../server/schedule.js";

const SCHOOL = normalizeSettings({ curriculum_level: "8. razred" });
const FMF = normalizeSettings({ educational_track: "UNIVERZA", study_program: "UL-FMF-MAT", curriculum_level: "1. letnik" });

// Izsek izvoza urnik.fmf.uni-lj.si (zložene vrstice, ubežni znaki, skupine vaj, kolokvij kot rezervacija).
const ev = (summary, start, end, extra = "") =>
  `BEGIN:VEVENT\r\nSUMMARY:${summary}\r\nDTSTART;TZID=Europe/Ljubljana:${start}\r\nDTEND;TZID=Europe/Ljubljana:${end}\r\n${extra}END:VEVENT\r\n`;
const FMF_ICS =
  "BEGIN:VCALENDAR\r\nVERSION:2.0\r\n" +
  ev("Analiza 1 (MAT-1\\, PM-1)\\, Predavanja (P)", "20261007T080000", "20261007T100000", "DESCRIPTION:Predmet: Analiza 1\\nIzvajalci: X\\nPros\r\n tor: 2.05\r\n") +
  ev("Analiza 1 (MAT-1\\, PM-1)\\, Predavanja (P)", "20261014T080000", "20261014T100000") +
  ev("Analiza 1 (MAT-1\\, PM-1)\\, Vaje (V)\\, [1]", "20261008T120000", "20261008T140000") +
  ev("Analiza 1 (MAT-1\\, PM-1)\\, Vaje (V)\\, [1]", "20261015T120000", "20261015T140000") +
  ev("Analiza 1 (MAT-1\\, PM-1)\\, Vaje (V)\\, [2]", "20261008T120000", "20261008T140000") +
  ev("Analiza 1 (MAT-1\\, PM-1)\\, Vaje (V)\\, [2]", "20261015T120000", "20261015T140000") +
  ev("Sprejem brucev M (MAT-1\\, PM-1)\\, Ostalo (O)", "20261001T090000", "20261001T100000") +
  ev("1. kolokvij Analiza 1", "20991208T160000", "20991208T180000", "CATEGORIES:Reservation\r\n") +
  "END:VCALENDAR\r\n";

test("ics: repeated meetings become weekly lessons, single tests become dates, one-off events are skipped", () => {
  const out = parseIcs(FMF_ICS, FMF);
  assert.equal(out.lessons.length, 3);
  const lec = out.lessons.find((l) => l.kind === "Predavanja");
  assert.deepEqual([lec.day, lec.start, lec.end, lec.name, lec.room, lec.course], [3, "08:00", "10:00", "Analiza 1", "2.05", "UNI-ULFMF-ANALIZA1"]);
  assert.deepEqual(out.lessons.filter((l) => l.kind === "Vaje").map((l) => l.group).sort(), ["1", "2"]);
  assert.ok(out.lessons.every((l) => l.source === "ics" && l.key));
  assert.equal(out.events.length, 1);
  assert.deepEqual([out.events[0].date, out.events[0].time, out.events[0].kind, out.events[0].course], ["2099-12-08", "16:00", "kolokvij", "UNI-ULFMF-ANALIZA1"]);
  assert.equal(parseIcs("ni koledar", FMF), null);
});

test("ics: weekly RRULE, UTC times in Slovenian time, one-week export", () => {
  const ics =
    "BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:Fizika\nDTSTART:20261103T070000Z\nDTEND:20261103T074500Z\nRRULE:FREQ=WEEKLY;BYDAY=TU,TH\nEND:VEVENT\n" +
    "BEGIN:VEVENT\nSUMMARY:Kontrolna naloga iz matematike\nDTSTART;VALUE=DATE:20261120\nEND:VEVENT\nEND:VCALENDAR";
  const out = parseIcs(ics, SCHOOL);
  assert.deepEqual(out.lessons.map((l) => [l.day, l.start, l.end, l.subject]), [[2, "08:00", "08:45", "FIZ"], [4, "08:00", "08:45", "FIZ"]]);
  assert.deepEqual([out.events[0].date, out.events[0].kind, out.events[0].subject], ["2026-11-20", "test", "MAT"]);
});

test("lessons and events are validated; school periods get bell times; subjects are matched by name", () => {
  assert.deepEqual(
    (({ day, start, end, subject }) => ({ day, start, end, subject }))(normalizeLesson({ day: 2, period: 3, name: "Matematika" }, SCHOOL)),
    { day: 2, start: "10:15", end: "11:00", subject: "MAT" },
  );
  assert.equal(normalizeLesson({ day: 9, start: "08:00", name: "MAT" }, SCHOOL), null);
  assert.equal(normalizeLesson({ day: 1, name: "MAT" }, SCHOOL), null);
  assert.equal(normalizeLesson({ day: 1, start: "8.00", name: "Šport" }, SCHOOL).end, "08:45");
  assert.equal(normalizeLesson({ day: 1, start: "8.00", name: "Šport" }, SCHOOL).subject, null);
  assert.equal(normalizeEvent({ date: "2026-02-30", name: "Test" }, SCHOOL), null);
  const e = normalizeEvent({ date: "2026-11-20", name: "Test – Kemija", subject_name: "Kemija" }, SCHOOL);
  assert.deepEqual([e.kind, e.subject], ["test", "KEM"]);
  assert.equal(normalizeEvent({ date: "2026-11-20", name: "Ustno spraševanje pri fiziki" }, SCHOOL).kind, "ustno");
  assert.deepEqual(matchSubject("Analiza 1 (kviz)", FMF), { course: "UNI-ULFMF-ANALIZA1", subject: "MAT" });
  assert.deepEqual(matchSubject("matematike", SCHOOL), { subject: "MAT" });
  assert.deepEqual(splitSummary("Logika in množice (MAT-1, PM-1), Vaje (V), [2]"), { name: "Logika in množice", kind: "Vaje", group: "2" });
});

test("calendar links: https only, FMF page becomes the semester export, private addresses are refused", async () => {
  assert.equal(cleanIcsUrl("https://urnik.fmf.uni-lj.si/layer_one/32/?day=2026-11-02"), "https://urnik.fmf.uni-lj.si/layer_one/32/?export=1");
  assert.equal(cleanIcsUrl("webcal://example.org/a.ics"), "https://example.org/a.ics");
  assert.equal(cleanIcsUrl("http://example.org/a.ics"), null);
  assert.equal(cleanIcsUrl("https://localhost/a.ics"), null);
  const fetchFn = async () => new Response("BEGIN:VCALENDAR\nEND:VCALENDAR");
  await assert.rejects(fetchIcs("https://intra.example/a.ics", { fetchFn, lookup: async () => [{ address: "192.168.1.10" }] }), /ni javen/);
  await assert.rejects(fetchIcs("https://10.0.0.1/a.ics", { fetchFn }), /ni javen/);
  const ok = await fetchIcs("https://cal.example/a.ics", { fetchFn, lookup: async () => [{ address: "93.184.216.34" }] });
  assert.match(ok.text, /VCALENDAR/);
  assert.deepEqual(parseFmfLayers(`"Letnik: 1. letnik (M) (MAT-1)": "/layer_one/32/",`), [{ id: 32, label: "1. letnik (M) (MAT-1)" }]);
});

test("view and prompt: today, tomorrow and upcoming tests; private summary reaches the prompt below the cache line", () => {
  const store = openDb(":memory:");
  const sch = new Schedules(store.db);
  const s = store.createStudent("Ana", SCHOOL);
  sch.save(s.id, { lessons: [{ day: 1, start: "08:20", name: "Matematika" }, { day: 2, start: "09:10", name: "Fizika" }], events: [{ date: "2099-11-03", kind: "test", name: "Test – Fizika", subject_name: "Fizika" }] }, s.settings);
  const v = scheduleView(sch.get(s.id), s.settings, new Date("2099-11-02T09:00:00Z"));
  assert.deepEqual([v.today.map((l) => l.name), v.tomorrow.map((l) => l.name)], [["Matematika"], ["Fizika"]]);
  assert.equal(v.reminders[0].daysLeft, 1);
  assert.ok(v.today[0].path, "matematika ima učno pot");
  const text = schedulePrompt(v);
  assert.match(text, /ponedeljek 2099-11-02.*danes: 08:20 Matematika; jutri: 09:10 Fizika; testi in roki: 2099-11-03 \(jutri\) test: Test – Fizika/);
  const prompt = buildSystemPrompt({ settings: s.settings, schedule: text });
  assert.ok(prompt.indexOf(text) > prompt.indexOf("EVKLID:NASTAVITVE"));
  assert.match(schedulePrompt({ lessons: [], events: [] }), /ni vnesel/);
});

test("registry: timetable and its reminder setting are listed for the tutor", () => {
  assert.ok(SCHEDULE_SETTINGS.lessons && SCHEDULE_SETTINGS.events);
  assert.deepEqual(DEVICE_SETTINGS.schedule_reminders.values, ["on", "off"]);
});

async function withApp(opts, fn) {
  const store = openDb(":memory:");
  const app = createApp(store, opts);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (method, p, body) => {
    const r = await fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: r.headers.get("content-type")?.includes("json") ? await r.json() : await r.text() };
  };
  try {
    await fn({ store, req });
  } finally {
    server.close();
  }
}

// Datumi v slovenskem času, kot jih računa strežnik (nowParts); z UTC sta testa padla, ko je v Sloveniji že
// naslednji dan (pozimi 23–24, poleti 22–24 UTC). Fiksni datumi so v letu 2099, da testi ne zastarajo.
const inDays = (n) => new Date(Date.parse(`${nowParts().date}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);

test("API: saving a test sets Priprava na test by itself, a manual plan wins, deleting the test removes the auto plan", async () => {
  await withApp({}, async ({ store, req }) => {
    const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "8. razred" } })).body;
    const put = await req("PUT", `/api/students/${s.id}/schedule`, {
      lessons: [{ day: 1, period: 1, name: "Matematika" }, { day: 9, name: "napaka" }],
      events: [{ date: inDays(5), kind: "test", name: "Test – Matematika", subject_name: "Matematika" }],
    });
    assert.equal(put.status, 200);
    const v = put.body.schedule;
    assert.equal(v.lessons.length, 1);
    assert.equal(v.events[0].daysLeft, 5);
    assert.equal(v.testPlan.date, inDays(5));
    assert.equal(v.testPlan.eventId, v.events[0].id);
    assert.ok(v.testPlan.units.length >= 1);
    // Učenec izbere sklope pri testu: priprava jim sledi.
    const units = [0, 1];
    const put2 = await req("PUT", `/api/students/${s.id}/schedule`, { events: [{ ...v.events[0], units }] });
    assert.deepEqual(put2.body.schedule.testPlan.units, units);
    const modes = await req("GET", `/api/students/${s.id}/modes`);
    assert.equal(modes.body.testPlan.eventId, v.events[0].id);
    // Ročna priprava (drug datum) ostane, urnik je ne povozi.
    await req("POST", `/api/students/${s.id}/test-plan`, { path: v.testPlan.path, units: [0], date: inDays(9) });
    assert.equal((await req("GET", `/api/students/${s.id}/schedule`)).body.schedule.testPlan.date, inDays(9));
    await req("DELETE", `/api/students/${s.id}/test-plan`);
    assert.equal((await req("GET", `/api/students/${s.id}/schedule`)).body.schedule.testPlan.eventId, v.events[0].id);
    const gone = await req("PUT", `/api/students/${s.id}/schedule`, { events: [] });
    assert.equal(gone.body.schedule.testPlan, null);
    // Ponovitev pred uro: kratka seja nalog na poti predmeta.
    const cls = await req("POST", `/api/students/${s.id}/class`, { path: v.lessons[0].path });
    assert.equal(cls.status, 200);
    assert.equal(cls.body.total, 5);
    assert.ok(cls.body.task);
    assert.equal((await req("POST", `/api/students/${s.id}/class`, { path: "ni-poti" })).status, 400);
    // Izbris učenca izbriše tudi urnik.
    store.deleteStudent(s.id);
    assert.equal(store.db.prepare("SELECT COUNT(*) n FROM schedules").get().n, 0);
  });
});

test("API: photo and calendar imports return a preview and save nothing until the student confirms", async () => {
  const photoFn = async () => ({ lessons: [{ day: 1, period: 2, name: "MAT" }, { day: 3, start: "10:15", end: "11:00", name: "Kemija" }], events: [{ date: inDays(3), kind: "test", name: "Kontrolna naloga iz kemije" }], usage: { input_tokens: 10, output_tokens: 5 }, model: "claude-opus-5-5" });
  const fetchFn = async (url) => {
    assert.equal(url, "https://urnik.fmf.uni-lj.si/layer_one/32/?export=1");
    return new Response(FMF_ICS);
  };
  await withApp({ schedulePhotoFn: photoFn, fetchFn, lookup: async () => [{ address: "193.2.1.1" }] }, async ({ store, req }) => {
    const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "8. razred" } })).body;
    assert.equal((await req("POST", `/api/students/${s.id}/schedule/photo`, { image: "ni slika" })).status, 400);
    const ph = await req("POST", `/api/students/${s.id}/schedule/photo`, { image: "data:image/jpeg;base64,AAAA" });
    assert.deepEqual(ph.body.lessons.map((l) => [l.start, l.subject]), [["09:10", "MAT"], ["10:15", "KEM"]]);
    assert.equal(ph.body.events[0].subject, "KEM");
    assert.equal((await req("GET", `/api/students/${s.id}/schedule`)).body.schedule.lessons.length, 0);
    assert.equal(store.db.prepare("SELECT kind FROM usage ORDER BY id DESC").get().kind, "urnik");
    const txt = await req("POST", `/api/students/${s.id}/schedule/ics`, { text: "BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:Biologija\nDTSTART:20261103T090000\nDTEND:20261103T094500\nRRULE:FREQ=WEEKLY\nEND:VEVENT\nEND:VCALENDAR" });
    assert.deepEqual(txt.body.lessons.map((l) => [l.day, l.name, l.subject]), [[2, "Biologija", "BIO"]]);
    assert.equal(txt.body.source, null);
    assert.equal((await req("POST", `/api/students/${s.id}/schedule/ics`, { url: "http://x.org/a.ics" })).status, 400);

    const st = (await req("POST", "/api/students", { name: "Študent", settings: { educational_track: "UNIVERZA", study_program: "UL-FMF-MAT", curriculum_level: "1. letnik" } })).body;
    const src = await req("GET", `/api/students/${st.id}/schedule/sources`);
    assert.equal(src.body.sources[0].suggested, 32);
    const fmf = await req("POST", `/api/students/${st.id}/schedule/ics`, { url: "https://urnik.fmf.uni-lj.si/layer_one/32/?day=2026-11-02", label: "UL FMF – 1. letnik (M)" });
    assert.equal(fmf.body.lessons.length, 3);
    assert.equal(fmf.body.source.url, "https://urnik.fmf.uni-lj.si/layer_one/32/?export=1");
    // Shrani brez druge skupine vaj; osvežitev je ne vrne.
    const skip = fmf.body.lessons.find((l) => l.group === "2");
    await req("PUT", `/api/students/${st.id}/schedule`, { lessons: fmf.body.lessons.filter((l) => l !== skip), events: fmf.body.events, source: { ...fmf.body.source, hidden: [skip.key] } });
    const ref = await req("POST", `/api/students/${st.id}/schedule/refresh`);
    assert.equal(ref.status, 200);
    assert.equal(ref.body.schedule.lessons.length, 2);
    assert.equal(ref.body.schedule.events.length, 1);
    assert.ok(ref.body.schedule.lessons.every((l) => l.path === "UNI-ULFMF-ANALIZA1"));
  });
});

test("chat: the tutor reads and edits the timetable; mock mode understands »v petek pišem test«", async () => {
  const store = openDb(":memory:");
  const schedules = new Schedules(store.db);
  const s = store.createStudent("Ana", SCHOOL);
  const sent = [];
  let synced = 0;
  const t = createSettingsTools({ store, studentId: s.id, conversationId: 1, pending: new Map(), send: (e) => sent.push(e), schedules, onSchedule: () => synced++ });
  const call = async (name, input) => JSON.parse((await t.onToolUse(name, input)).content);
  const r = await call("change_schedule", { add_lessons: [{ day: 2, start: "08:00", name: "Fizika" }, { day: 8, name: "x" }], add_events: [{ date: inDays(4), kind: "test", name: "Test iz fizike" }] });
  assert.equal(r.status, "partly");
  assert.equal(r.added_events.length, 1);
  assert.deepEqual([sent, synced], [["schedule"], 1]);
  const g = await call("get_schedule", {});
  assert.equal(g.lessons[0].name, "Fizika");
  assert.equal(g.upcoming[0].days_left, 4);
  const rm = await call("change_schedule", { remove_lessons: [g.lessons[0].id] });
  assert.equal(rm.removed, 1);
  assert.equal(schedules.get(s.id).lessons.length, 0);

  const m = mockToolCall("V petek 14. 11. pišem test iz matematike");
  assert.equal(m.name, "change_schedule");
  assert.match(m.input.add_events[0].date, /^\d{4}-11-14$/);
  assert.equal(m.input.add_events[0].name, "Test iz matematike");
});
