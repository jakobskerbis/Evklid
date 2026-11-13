// Shranjeni grafi grafičnega kalkulatorja (po učencu). Graf je JSON s seznamom izrazov,
// pogledom in nastavitvami (public/graph/model.js); sličica je majhen PNG (data URL).
const MAX_DATA = 200_000; // znakov JSON
const MAX_THUMB = 80_000;
const MAX_GRAPHS = 300; // na učenca
const MAX_TITLE = 80;

export function mountGraphs(app, store, { loadStudent }) {
  const db = store.db;
  db.exec(`
    CREATE TABLE IF NOT EXISTS graphs (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      data TEXT NOT NULL,
      thumb TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_graphs_student ON graphs(student_id, updated_at);
  `);

  const clean = (body) => {
    const title = String(body?.title ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_TITLE) || "Graf";
    const d = body?.data;
    if (!d || typeof d !== "object" || !Array.isArray(d.items)) return { error: "Graf nima izrazov." };
    const { savedId, ...rest } = d; // id hrani strežnik
    const data = JSON.stringify({ ...rest, title });
    if (data.length > MAX_DATA) return { error: "Graf je prevelik." };
    const thumb = typeof body.thumb === "string" && body.thumb.startsWith("data:image/png;base64,") && body.thumb.length <= MAX_THUMB ? body.thumb : null;
    return { title, data, thumb };
  };
  const intParam = (v) => (/^\d+$/.test(v) ? Number(v) : NaN);
  const own = (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return null;
    const g = db.prepare("SELECT * FROM graphs WHERE id = ? AND student_id = ?").get(intParam(req.params.gid), s.id);
    if (!g) res.status(404).json({ error: "Graf ne obstaja." });
    return g || null;
  };

  app.get("/api/students/:id/graphs", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.json(db.prepare("SELECT id, title, thumb, created_at, updated_at FROM graphs WHERE student_id = ? ORDER BY updated_at DESC, id DESC").all(s.id));
  });
  app.get("/api/students/:id/graphs/:gid", (req, res) => {
    const g = own(req, res);
    if (!g) return;
    res.json({ id: g.id, title: g.title, data: JSON.parse(g.data), updated_at: g.updated_at });
  });
  app.post("/api/students/:id/graphs", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const c = clean(req.body);
    if (c.error) return res.status(400).json({ error: c.error });
    const n = db.prepare("SELECT COUNT(*) AS n FROM graphs WHERE student_id = ?").get(s.id).n;
    if (n >= MAX_GRAPHS) return res.status(400).json({ error: "Shranjenih je že največ grafov. Izbriši kakšnega starega." });
    const r = db.prepare("INSERT INTO graphs (student_id, title, data, thumb) VALUES (?, ?, ?, ?)").run(s.id, c.title, c.data, c.thumb);
    res.status(201).json({ id: Number(r.lastInsertRowid), title: c.title });
  });
  app.put("/api/students/:id/graphs/:gid", (req, res) => {
    const g = own(req, res);
    if (!g) return;
    const c = clean(req.body);
    if (c.error) return res.status(400).json({ error: c.error });
    db.prepare("UPDATE graphs SET title = ?, data = ?, thumb = ?, updated_at = datetime('now') WHERE id = ?").run(c.title, c.data, c.thumb, g.id);
    res.json({ id: g.id, title: c.title });
  });
  app.delete("/api/students/:id/graphs/:gid", (req, res) => {
    const g = own(req, res);
    if (!g) return;
    db.prepare("DELETE FROM graphs WHERE id = ?").run(g.id);
    res.json({ ok: true });
  });
}
