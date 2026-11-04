// HTTP za urnik učenca (server/schedule.js): branje, shranjevanje, uvoz s fotografije in iz koledarja,
// javni urniki fakultet in kratka ponovitev pred uro.
import { courseKeysFor } from "./settings.js";
import { UNI_PATHS } from "./university-data.js";
import { getPath } from "./curriculum.js";
import {
  Schedules,
  scheduleView,
  syncTestPlan,
  normalizeSchedule,
  parseIcs,
  fetchIcs,
  scheduleSources,
  readTimetablePhoto,
  mergeImport,
} from "./schedule.js";
import { jeFaks } from "../public/stopnja.js";

export function mountSchedule(app, store, { loadStudent, progress, usage, schedules = new Schedules(store.db), photoFn = readTimetablePhoto, fetchFn = fetch, lookup, modelCapFor = () => null } = {}) {
  // Pogled urnika + Priprava na test, usklajena z najbližjim testom.
  const view = (s) => {
    const v = scheduleView(schedules.get(s.id), s.settings);
    v.testPlan = syncTestPlan(progress, s.id, v);
    return v;
  };
  // Predmeti za obrazec: pri fakulteti predmeti letnika in izbirni predmeti programa.
  const courses = (s) =>
    jeFaks(s.settings)
      ? courseKeysFor(s.settings.study_program, s.settings.curriculum_level)
          .filter((k) => UNI_PATHS[k])
          .map((k) => ({ course: k, subject: UNI_PATHS[k].subject, name: UNI_PATHS[k].label.replace(/ \([^)]*\)$/, "") }))
      : null;

  app.get("/api/students/:id/schedule", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json({ schedule: view(s), courses: courses(s) });
  });

  app.put("/api/students/:id/schedule", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const cur = schedules.get(s.id);
    const body = req.body || {};
    schedules.save(
      s.id,
      {
        lessons: Array.isArray(body.lessons) ? body.lessons : cur.lessons,
        events: Array.isArray(body.events) ? body.events : cur.events,
        source: body.source !== undefined ? body.source : cur.source,
      },
      s.settings,
    );
    res.json({ schedule: view(s), courses: courses(s) });
  });

  app.delete("/api/students/:id/schedule", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    schedules.clear(s.id);
    res.json({ schedule: view(s) });
  });

  // Fotografija urnika ali seznama testov → predlog, ki ga učenec preveri in shrani (ničesar ne shrani sam).
  app.post("/api/students/:id/schedule/photo", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(String(req.body?.image || ""));
    if (!m || m[2].length > 7 * 1024 * 1024) return res.status(400).json({ error: "Slika urnika manjka ali je prevelika." });
    const blocked = usage?.blockInfo(s.id);
    if (blocked) return res.status(429).json(blocked);
    try {
      const out = await photoFn({ imageBase64: m[2], mediaType: m[1], capped: !!modelCapFor(s.id) });
      if (out.mock) return res.json({ lessons: [], events: [], mock: true });
      if (out.usage) usage?.log(s.id, out.model, out.usage, "urnik");
      const clean = normalizeSchedule({ lessons: out.lessons, events: out.events }, s.settings);
      res.json({ lessons: clean.lessons, events: clean.events });
    } catch (err) {
      console.error("[evklid] branje urnika:", err?.message || err);
      res.status(502).json({ error: "Branje urnika trenutno ne deluje. Vpiši ga ročno." });
    }
  });

  // Koledar .ics: povezava (javni urnik, Google Koledar …) ali vsebina datoteke → predlog.
  app.post("/api/students/:id/schedule/ics", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    try {
      let text = typeof req.body?.text === "string" ? req.body.text : null;
      let url = null;
      if (!text) ({ url, text } = await fetchIcs(req.body?.url, { fetchFn, lookup }));
      if (text.length > 3 * 1024 * 1024) return res.status(400).json({ error: "Koledar je prevelik." });
      const out = parseIcs(text, s.settings);
      if (!out) return res.status(400).json({ error: "To ni koledar (.ics)." });
      // Pretekli datumi (npr. kolokviji z začetka semestra) niso več zanimivi.
      const today = new Date().toISOString().slice(0, 10);
      res.json({ lessons: out.lessons, events: out.events.filter((e) => e.date >= today), source: url ? { url, label: String(req.body?.label || "").slice(0, 80) } : null });
    } catch (err) {
      res.status(400).json({ error: err.message || "Koledarja ni bilo mogoče prebrati." });
    }
  });

  // Ponoven prenos povezanega koledarja: uvožene ure se zamenjajo (razen skritih), novi testi se dodajo.
  app.post("/api/students/:id/schedule/refresh", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const cur = schedules.get(s.id);
    if (!cur.source?.url) return res.status(400).json({ error: "Urnik ni povezan s koledarjem." });
    try {
      const { text } = await fetchIcs(cur.source.url, { fetchFn, lookup });
      const out = parseIcs(text, s.settings);
      if (!out) return res.status(400).json({ error: "To ni koledar (.ics)." });
      const hidden = new Set(cur.source.hidden || []);
      const lessons = [...cur.lessons.filter((l) => l.source !== "ics"), ...out.lessons.filter((l) => !hidden.has(l.key))];
      const today = new Date().toISOString().slice(0, 10);
      const merged = mergeImport({ ...cur, lessons: [] }, { lessons, events: out.events.filter((e) => e.date >= today) });
      schedules.save(s.id, { ...merged, source: { ...cur.source, at: new Date().toISOString() } }, s.settings);
      res.json({ schedule: view(s), courses: courses(s) });
    } catch (err) {
      res.status(400).json({ error: err.message || "Koledarja ni bilo mogoče osvežiti." });
    }
  });

  app.get("/api/students/:id/schedule/sources", async (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json({ sources: await scheduleSources({ fetchFn, settings: s.settings }) });
  });

  // Kratka ponovitev pred uro / utrditev po uri za predmet iz urnika.
  app.post("/api/students/:id/class", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const key = String(req.body?.path || "");
    if (!getPath(key)) return res.status(400).json({ error: "Za ta predmet v aplikaciji ni učne poti." });
    const out = progress.startClass(s.id, key);
    if (!out) return res.json({ finished: true, empty: true });
    res.json(out);
  });

  return schedules;
}
