// Poti ustnega spraševanja (server/ustno.js). Zvok nikoli ne pride sem: samo besedilo, ki ga učenec pred oddajo
// vidi in lahko popravi. Strošek gre skozi iste meje AI kot inštruktor (server/usage.js hold, server/meje-ai.js),
// spraševanje šteje kot USTNO_QUESTIONS vprašanj na dan (accounts: brezplačni paket 3 od 10). Ne gre v lige, učitelj
// ga ne vidi; prepis se hrani kot pogovor (šifrirano, kot drugi pogovori). Ugovor »Ne strinjam se« gre v prijave napak.
import { getTopic } from "./curriculum.js";
import { loadLesson } from "./textbook.js";
import { hasGenerator } from "./practice/index.js";
import { lessonForQuestion } from "./lekcija-za-vprasanje.js";
import { cleanText } from "./settings.js";
import { seal, sealJson, unsealJson } from "./crypto-polje.js";
import { callMaxUsd } from "./meje-ai.js";
import { lokalnaVrsta, nujnoZa } from "./nujno.js";
import { audit } from "./dnevnik-dostopov.js";
import {
  pickQuestions, publicQuestion, gradeUser, reviewUser, callModel, pointsFrom, resultStatus, score, better, cleanFollowup, cleanFeedback,
  GRADE_SYSTEM, REVIEW_SYSTEM, USTNO_MODEL, USTNO_REVIEW_MODEL, GRADE_MAX_TOKENS, REVIEW_MAX_TOKENS, USTNO_QUESTIONS, COUNTS, MAX_ANSWER, MAX_APPEALS, POINTS,
} from "./ustno.js";

const bytes = (s) => Buffer.byteLength(String(s ?? ""), "utf8");
// Rezerva klica: vhod = bajti (zgornja meja žetonov), izhod = max_tokens (server/meje-ai.js).
export const gradeReserve = (user) => callMaxUsd(USTNO_MODEL(), bytes(GRADE_SYSTEM) + bytes(user) + 60, GRADE_MAX_TOKENS);
export const reviewReserve = (user) => callMaxUsd(USTNO_REVIEW_MODEL(), bytes(REVIEW_SYSTEM) + bytes(user) + 60, REVIEW_MAX_TOKENS);
// Zvok ali datoteka v zahtevi: zavrnemo (strežnik zvoka nikoli ne sprejme).
const AUDIO_KEYS = /^(audio|zvok|posnetek|recording|blob|file|datoteka|wav|webm|ogg|mp3|m4a|data)$/i;
export const hasAudio = (body) => !!body && typeof body === "object" && Object.keys(body).some((k) => AUDIO_KEYS.test(k));
// Starost, od katere glas ne potrebuje dovoljenja starša (odločitev 3; ZVOP-2: privolitev od 15. leta).
export const VOICE_AGE = 15;

export function ustnoTables(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS ustno_seje (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
      vprasanja TEXT NOT NULL,          -- vprašanja iz lekcij s točkovnikom (vsebina lekcij, brez osebnih podatkov)
      stanje TEXT NOT NULL,             -- šifrirano: ocene z navedki učenčevih besed
      ugovori INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      koncano_at TEXT
    );
    CREATE INDEX IF NOT EXISTS ustno_seje_student ON ustno_seje(student_id);
    CREATE TABLE IF NOT EXISTS ustno_glas (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      dovoljeno INTEGER NOT NULL DEFAULT 0,
      spremenjeno TEXT NOT NULL DEFAULT (datetime('now'))
    );`);
}

export function mountUstno(app, store, { loadStudent, usage, progress = null, accounts = null, createFn = null } = {}) {
  const db = store.db;
  ustnoTables(db);
  const intParam = (v) => (/^\d+$/.test(String(v)) ? Number(v) : NaN);

  // Glas: brez računov (lokalno) vedno; sicer 15+ ali stikalo starša (neznana starost velja kot pod 15).
  function voice(studentId) {
    if (!accounts?.ageOfStudent) return { dovoljen: true, razlog: null };
    const age = accounts.ageOfStudent(studentId);
    if (age != null && age >= VOICE_AGE) return { dovoljen: true, razlog: null };
    const row = db.prepare("SELECT dovoljeno FROM ustno_glas WHERE student_id = ?").get(studentId);
    return row?.dovoljeno ? { dovoljen: true, razlog: null } : { dovoljen: false, razlog: "stars" };
  }

  const topicOf = (id) => {
    const t = getTopic(id);
    // Samo id iz učnega načrta (getTopic), nikoli besedilo iz zahteve, gre naprej v iskanje datoteke lekcije.
    const lesson = t?.id ? loadLesson(t.id) : null;
    return t && lesson ? { id: t.id, name: t.name, lesson, practice: hasGenerator(t.id) } : null;
  };
  // Snov: ena tema (lekcija), test iz urnika (priprava na test: sklopi) ali besedilo iz klepeta.
  function topicsFor(student, src) {
    if (typeof src.tema === "string" && src.tema) {
      const t = topicOf(src.tema);
      return t ? { naslov: t.name, teme: [t] } : null;
    }
    if (src.test) {
      const plan = progress?.testPlan?.(student.id);
      if (!plan?.path) return null;
      const view = progress.pathView(student.id, plan.path);
      const units = view?.units || [];
      const ids = (plan.units || []).flatMap((i) => (units[i]?.topics || []).map((x) => x.id));
      const teme = ids.map(topicOf).filter(Boolean).slice(0, 12);
      return teme.length ? { naslov: plan.name || units[plan.units?.[0]]?.title || teme[0].name, teme } : null;
    }
    if (typeof src.besedilo === "string" && src.besedilo.trim()) {
      const hit = lessonForQuestion(src.besedilo.slice(0, 300), student.settings);
      const t = hit && topicOf(hit.id);
      return t ? { naslov: t.name, teme: [t] } : null;
    }
    return null;
  }

  const loadSession = (req, res, s) => {
    const row = db.prepare("SELECT * FROM ustno_seje WHERE id = ? AND student_id = ?").get(intParam(req.params.sid), s.id);
    if (!row) {
      res.status(404).json({ error: "Spraševanje ne obstaja." });
      return null;
    }
    return { row, qs: JSON.parse(row.vprasanja), st: unsealJson(row.stanje, { odgovori: [] }) };
  };
  const saveState = (id, st) => db.prepare("UPDATE ustno_seje SET stanje = ? WHERE id = ?").run(sealJson(st), id);
  // Zapis enega vprašanja na sveže prebrano stanje (hkratni odgovori na druga vprašanja se ne prepišejo).
  const saveAnswer = (id, i, rec) => {
    const cur = unsealJson(db.prepare("SELECT stanje FROM ustno_seje WHERE id = ?").get(id)?.stanje, { odgovori: [] });
    cur.odgovori[i] = rec;
    saveState(id, cur);
    return cur;
  };
  // Zaklep vprašanja med oceno (pregled A4/B7): hkratne zahteve za isto sejo in vprašanje ne sprožijo dveh ocen.
  const busy = new Set();
  const lock = (sid, i) => {
    const k = `${sid}:${i}`;
    if (busy.has(k)) return null;
    busy.add(k);
    return () => busy.delete(k);
  };
  const addMsg = (convId, role, text) => {
    if (convId) {
      store.addMessage(convId, role, [{ type: "text", text }], text);
      store.touchConversation?.(convId);
    }
  };
  const nujnoOf = (text, student) => nujnoZa(lokalnaVrsta(text), student.settings);

  // Predogled: snov in ali sme glas (brez AI, brez štetja).
  app.get("/api/students/:id/ustno", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const snov = topicsFor(s, { tema: req.query.tema, test: req.query.test === "1", besedilo: req.query.besedilo });
    res.json({ snov: snov ? { naslov: snov.naslov, teme: snov.teme.map((t) => ({ id: t.id, name: t.name })) } : null, glas: voice(s.id), stevila: COUNTS });
  });

  // Začetek: izbor vprašanj, pogovor; spraševanje šteje kot USTNO_QUESTIONS vprašanj (ne pri samooceni).
  // Samoocena (brez AI, brez štetja) ima svojo pot: accounts preveri dnevna vprašanja pred razčlenitvijo telesa.
  const start = (samoocena) => (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (hasAudio(req.body)) return res.status(400).json({ error: "Zvoka ne sprejmemo. Pošlji samo besedilo." });
    const n = COUNTS.includes(Number(req.body?.n)) ? Number(req.body.n) : 5;
    if (req.body?.nacin === "glas" && !voice(s.id).dovoljen) return res.status(403).json({ error: "Odgovarjanje z glasom mora najprej dovoliti starš.", glas: false });
    const snov = topicsFor(s, req.body || {}) || (Number.isInteger(Number(req.body?.iz)) && req.body?.naslov ? { naslov: cleanText(req.body.naslov, 80), teme: [] } : null);
    if (!snov) return res.status(404).json({ error: "Za to snov še ni vprašanj za ustno.", code: "u.niVprasanj" });
    if (!samoocena) {
      const blocked = usage.blockInfo(s.id);
      if (blocked) return res.status(429).json({ ...blocked, limit: true });
      // Vsaj en klic ocene mora iti pod trdo mejo AI (sicer se spraševanje sploh ne začne).
      if (usage.hardBlock(s.id)) return res.status(429).json(usage.guardBlock(s.id));
    }
    const seed = 1 + Math.floor(Math.random() * 2 ** 30);
    // »Ponovi samo šibka vprašanja«: ista vprašanja iz prejšnjega spraševanja tega učenca.
    const iz = Number(req.body?.iz);
    const old = Number.isInteger(iz) ? db.prepare("SELECT vprasanja FROM ustno_seje WHERE id = ? AND student_id = ?").get(iz, s.id) : null;
    const pick = Array.isArray(req.body?.vprasanja) ? req.body.vprasanja.map(Number).filter(Number.isInteger) : [];
    const qs = old ? JSON.parse(old.vprasanja).filter((_, i) => pick.includes(i)).slice(0, 8) : pickQuestions(snov.teme, n, seed);
    if (!qs.length) return res.status(404).json({ error: "Za to snov še ni vprašanj za ustno.", code: "u.niVprasanj" });
    let convId = null;
    if (!samoocena) {
      // Dnevna meja (točka A1, pregled 3): tudi tu, sinhrono s štetjem spodaj. Preverjanje v vmesniku računov teče pred
      // branjem telesa, zato bi ga sočasne zahteve obšle (vse bi videle isto število vprašanj).
      const dnevna = accounts?.dailyBlock?.(s.id, USTNO_QUESTIONS);
      if (dnevna) return res.status(429).json(dnevna);
      const conv = store.createConversation(s.id, { pathTopic: snov.teme.length === 1 ? snov.teme[0].id : qs.length && qs.every((q) => q.topicId === qs[0].topicId) ? qs[0].topicId : null, title: `Ustno spraševanje: ${snov.naslov}`.slice(0, 80) });
      convId = conv.id;
      addMsg(convId, "user", `Vprašaj me (${qs.length} vprašanj): ${snov.naslov}`);
      addMsg(convId, "assistant", `Vprašanje 1 od ${qs.length}: ${qs[0].besedilo}`);
      store.logQuestion(s.id, USTNO_QUESTIONS);
    }
    const id = Number(
      db.prepare("INSERT INTO ustno_seje (student_id, conversation_id, vprasanja, stanje) VALUES (?, ?, ?, ?)").run(s.id, convId, JSON.stringify(qs), sealJson({ odgovori: [], samoocena })).lastInsertRowid,
    );
    // Vzorčni odgovor dobi odjemalec takoj samo pri samooceni (pregled A5); sicer šele po oddaji.
    res.status(201).json({ id, naslov: snov.naslov, samoocena, vprasanja: qs.map((q, i) => publicQuestion(q, i, { vzorec: samoocena })), glas: voice(s.id) });
  };
  app.post("/api/students/:id/ustno/zacni", start(false));
  app.post("/api/students/:id/ustno/samoocena", start(true));

  // Klic modela pod mejo AI: rezervacija → klic → zapis porabe. Vrne json ali null (meja ali napaka).
  async function guarded(studentId, { model, system, user, max_tokens, reserve, kind }) {
    const hold = usage.hold(studentId);
    if (!hold.take(reserve)) return { limit: true };
    try {
      const r = await callModel({ model, system, user, max_tokens, createFn });
      if (r.usage) usage.log(studentId, r.model, r.usage, kind);
      return { json: r.json };
    } finally {
      hold.release();
    }
  }

  // Sodbe »napačno« (tudi rezultat, ki ga je zavrnila koda: pregled A2) pregleda Sonnet; brez prostora za pregled ali
  // ob napaki ostane »manjka« (dvom v korist učenca).
  async function reviewWrong(studentId, q, answer, points, comment = "") {
    const kps = points.filter((p) => p.status === "napacno").map((p) => p.kp);
    if (!kps.length) return points;
    const user = reviewUser(q, answer, kps, comment);
    let r = { json: null };
    try {
      r = await guarded(studentId, { model: USTNO_REVIEW_MODEL(), system: REVIEW_SYSTEM, user, max_tokens: REVIEW_MAX_TOKENS, reserve: reviewReserve(user), kind: "ustno-pregled" });
    } catch (e) {
      console.warn(`[evklid] ustno: pregled ni uspel: ${e?.message || e}`);
    }
    const rev = r.json ? pointsFrom(r.json, q, answer, kps) : kps.map((kp) => ({ kp, status: "manjka", quote: "" }));
    const byKp = new Map(rev.map((p) => [p.kp, p]));
    return points.map((p) => (byKp.has(p.kp) ? { ...byKp.get(p.kp), reviewed: true } : p));
  }

  const resultOf = (points) => ({ ...score(points), pojmi: points });
  const publicPoints = (q, points) => points.map((p) => ({ pojem: q.pojmi[p.kp], stanje: p.status, navedek: p.quote || "" }));
  const feedbackText = (q, out) =>
    [
      out.points.filter((p) => p.status === "povedal").length ? `Povedal si: ${out.points.filter((p) => p.status === "povedal").map((p) => q.pojmi[p.kp]).join("; ")}.` : "",
      out.points.filter((p) => p.status !== "povedal").length ? `Manjkalo ali delno: ${out.points.filter((p) => p.status !== "povedal").map((p) => q.pojmi[p.kp]).join("; ")}.` : "",
      out.razlaga || "",
      `(${out.tocke} od ${out.max} točk)`,
    ]
      .filter(Boolean)
      .join("\n");

  // Odgovor na vprašanje (ali na dodatno vprašanje: dodatno: true).
  app.post("/api/students/:id/ustno/:sid/odgovor", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (hasAudio(req.body)) return res.status(400).json({ error: "Zvoka ne sprejmemo. Pošlji samo besedilo." });
    const ses = loadSession(req, res, s);
    if (!ses) return;
    const { row, qs, st } = ses;
    if (row.koncano_at || st.samoocena) return res.status(409).json({ error: "Spraševanje je končano." });
    const i = Number(req.body?.i);
    const q = qs[i];
    if (!q) return res.status(400).json({ error: "Ni takega vprašanja." });
    const nacin = req.body?.nacin === "glas" ? "glas" : "tipkanje";
    if (nacin === "glas" && !voice(s.id).dovoljen) return res.status(403).json({ error: "Odgovarjanje z glasom mora najprej dovoliti starš.", glas: false });
    const raw = typeof req.body?.besedilo === "string" ? req.body.besedilo : "";
    if (raw.length > MAX_ANSWER) return res.status(400).json({ error: "Odgovor je predolg." });
    const answer = raw.replace(/\s+/g, " ").trim();
    const resultText = cleanText(req.body?.rezultat, 60) || "";
    const dodatno = req.body?.dodatno === true;
    const prev = st.odgovori[i];
    if (dodatno ? !prev?.dodatno || prev.dodatnoOdgovor !== undefined : prev) return res.status(409).json({ error: "Na to vprašanje si že odgovoril." });
    if ((st.samo || []).includes(i)) return res.status(409).json({ error: "To vprašanje si ocenil sam." });
    const unlock = lock(row.id, i);
    if (!unlock) return res.status(409).json({ error: "Počakaj, ocena še poteka." });
    try {
      await answerOne(req, res, { s, row, qs, i, q, prev, nacin, answer, resultText, dodatno });
    } finally {
      unlock();
    }
  });

  async function answerOne(req, res, { s, row, qs, i, q, prev, nacin, answer, resultText, dodatno }) {
    const nujno = nujnoOf(`${answer} ${resultText}`, s);
    const skip = req.body?.preskoci === true || !answer && !resultText;

    const kps = dodatno ? prev.points.filter((p) => p.status !== "povedal" && !(q.vrsta === "izracunaj" && p.kp === 1)).map((p) => p.kp) : q.pojmi.map((_, k) => k);
    const modelKps = q.vrsta === "izracunaj" ? kps.filter((k) => k !== 1) : kps;
    let points = kps.map((kp) => ({ kp, status: "manjka", quote: "" }));
    let followup = "";
    let razlaga = "";
    if (!skip) {
      // Rezultat računske naloge preveri koda (polje z rezultatom ali zadnje število v prepisu).
      if (q.vrsta === "izracunaj" && kps.includes(1)) points = points.map((p) => (p.kp === 1 ? { kp: 1, ...resultStatus(q.odgovor, resultText, answer) } : p));
      if (modelKps.length && answer) {
        const user = gradeUser(q, answer, { language: s.settings?.language || "sl", kps: modelKps, followups: !dodatno, resultText });
        let r;
        try {
          r = await guarded(s.id, { model: USTNO_MODEL(), system: GRADE_SYSTEM, user, max_tokens: GRADE_MAX_TOKENS, reserve: gradeReserve(user), kind: "ustno" });
        } catch (e) {
          console.warn(`[evklid] ustno: ocena ni uspela: ${e?.message || e}`);
          return res.status(502).json({ error: "Ocena tokrat ni uspela. Poskusi znova ali uporabi samooceno.", code: "u.ocenaNapaka", nujno: nujno || undefined });
        }
        if (r.limit) return res.status(429).json({ ...usage.guardBlock(s.id), nujno: nujno || undefined });
        if (!r.json) return res.status(502).json({ error: "Ocena tokrat ni uspela. Poskusi znova ali uporabi samooceno.", code: "u.ocenaNapaka", nujno: nujno || undefined });
        const got = new Map(pointsFrom(r.json, q, answer, modelKps).map((p) => [p.kp, p]));
        points = points.map((p) => got.get(p.kp) || p);
        followup = dodatno ? "" : cleanFollowup(r.json.followup);
        razlaga = cleanFeedback(r.json.feedback);
      }
      // »Napačno« (od modela ali od kode pri rezultatu) pregleda Sonnet; vpisani rezultat je del odgovora.
      points = await reviewWrong(s.id, q, [answer, resultText && `Rezultat: ${resultText}`].filter(Boolean).join("\n"), points);
    }
    let rec;
    if (dodatno) {
      // Dodatno vprašanje lahko stanje samo izboljša (delno → povedal), nikoli poslabša.
      const byKp = new Map(points.map((p) => [p.kp, p]));
      const merged = prev.points.map((p) => (byKp.has(p.kp) ? better(p, byKp.get(p.kp)) : p));
      rec = { ...prev, points: merged, dodatnoOdgovor: answer, razlagaDodatno: razlaga };
    } else {
      const needFollow = points.some((p) => p.status === "delno" || p.status === "manjka");
      rec = { points, odgovor: answer, rezultat: resultText, nacin, razlaga, dodatno: !skip && needFollow && followup ? followup : null, preskoceno: skip };
    }
    saveAnswer(row.id, i, rec);
    const out = { ...resultOf(rec.points), razlaga: dodatno ? razlaga : rec.razlaga };
    // Prepis kot pogovor: učenčev odgovor, nato ocena (in dodatno ali naslednje vprašanje).
    addMsg(row.conversation_id, "user", skip ? "(preskočeno)" : [answer, resultText && `Rezultat: ${resultText}`].filter(Boolean).join("\n"));
    const next = !dodatno && rec.dodatno ? `Dodatno vprašanje: ${rec.dodatno}` : qs[i + 1] ? `Vprašanje ${i + 2} od ${qs.length}: ${qs[i + 1].besedilo}` : "";
    addMsg(row.conversation_id, "assistant", [feedbackText(q, { ...out, points: rec.points }), next].filter(Boolean).join("\n\n"));
    res.json({
      tocke: out.tocke,
      max: out.max,
      dobro: out.dobro,
      pojmi: publicPoints(q, rec.points),
      razlaga: out.razlaga,
      dodatno: dodatno ? null : rec.dodatno,
      vzorec: q.vzorec,
      ugovori: Math.max(0, MAX_APPEALS - (db.prepare("SELECT ugovori FROM ustno_seje WHERE id = ?").get(row.id)?.ugovori ?? 0)),
      nujno: nujno || undefined,
    });
  }

  // Samoocena enega vprašanja med spraševanjem z AI (npr. ko ocena ne uspe): vzorčni odgovor zdaj, ocena tega
  // vprašanja z AI potem ni več mogoča (pregled A5: vzorec gre k odjemalcu šele, ko se vprašanje ne ocenjuje).
  app.post("/api/students/:id/ustno/:sid/vzorec", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const ses = loadSession(req, res, s);
    if (!ses) return;
    const { row, qs, st } = ses;
    const i = Number(req.body?.i);
    const q = qs[i];
    if (!q) return res.status(400).json({ error: "Ni takega vprašanja." });
    if (row.koncano_at) return res.status(409).json({ error: "Spraševanje je končano." });
    if (busy.has(`${row.id}:${i}`)) return res.status(409).json({ error: "Počakaj, ocena še poteka." });
    if (!st.odgovori[i] && !(st.samo || []).includes(i)) {
      const cur = unsealJson(db.prepare("SELECT stanje FROM ustno_seje WHERE id = ?").get(row.id)?.stanje, { odgovori: [] });
      cur.samo = [...new Set([...(cur.samo || []), i])];
      saveState(row.id, cur);
    }
    res.json({ i, vzorec: q.vzorec });
  });

  // »Ne strinjam se«: ponoven pregled s Sonnetom (do MAX_APPEALS na spraševanje), zapis med prijave napak.
  app.post("/api/students/:id/ustno/:sid/ugovor", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (hasAudio(req.body)) return res.status(400).json({ error: "Zvoka ne sprejmemo. Pošlji samo besedilo." });
    const ses = loadSession(req, res, s);
    if (!ses) return;
    const { row, qs, st } = ses;
    const i = Number(req.body?.i);
    const q = qs[i];
    const prev = st.odgovori[i];
    // Samoocena nima ocene AI, zato tudi ugovora ne (pregled B7).
    if (st.samoocena || prev?.samoocena) return res.status(409).json({ error: "Samoocena nima ugovora." });
    if (!q || !prev || prev.preskoceno) return res.status(400).json({ error: "Ni ocene za ugovor." });
    const unlock = lock(row.id, i);
    if (!unlock) return res.status(409).json({ error: "Počakaj, ocena še poteka." });
    // Števec ugovorov se poveča atomarno pred klicem (pregled A4/B7); ob napaki se vrne.
    const took = db.prepare("UPDATE ustno_seje SET ugovori = ugovori + 1 WHERE id = ? AND ugovori < ?").run(row.id, MAX_APPEALS).changes;
    if (!took) {
      unlock();
      return res.status(429).json({ error: `Ugovor lahko pošlješ največ ${MAX_APPEALS}-krat na spraševanje.`, code: "u.ugovorKonec" });
    }
    const refund = () => db.prepare("UPDATE ustno_seje SET ugovori = ugovori - 1 WHERE id = ? AND ugovori > 0").run(row.id);
    try {
      await appealOne(req, res, { s, row, q, i, prev, refund });
    } finally {
      unlock();
    }
  });

  async function appealOne(req, res, { s, row, q, i, prev, refund }) {
    const comment = cleanText(req.body?.razlog, 500) || "";
    const answer = [prev.odgovor, prev.dodatnoOdgovor].filter(Boolean).join(" ");
    const kps = prev.points.filter((p) => p.status !== "povedal" && !(q.vrsta === "izracunaj" && p.kp === 1)).map((p) => p.kp);
    let points = prev.points;
    if (kps.length && answer) {
      const user = reviewUser(q, answer, kps, comment);
      let r;
      try {
        r = await guarded(s.id, { model: USTNO_REVIEW_MODEL(), system: REVIEW_SYSTEM, user, max_tokens: REVIEW_MAX_TOKENS, reserve: reviewReserve(user), kind: "ustno-pregled" });
      } catch (e) {
        console.warn(`[evklid] ustno: ugovor ni uspel: ${e?.message || e}`);
        refund();
        return res.status(502).json({ error: "Ocena tokrat ni uspela. Poskusi znova ali uporabi samooceno.", code: "u.ocenaNapaka" });
      }
      if (r.limit) {
        refund();
        return res.status(429).json(usage.guardBlock(s.id));
      }
      if (r.json) {
        const byKp = new Map(pointsFrom(r.json, q, answer, kps).map((p) => [p.kp, p]));
        // Ponovni pregled stanje samo izboljša (dvom v korist učenca).
        points = prev.points.map((p) => (byKp.has(p.kp) ? better(p, byKp.get(p.kp)) : p));
      }
    }
    saveAnswer(row.id, i, { ...prev, points, ugovor: true });
    // Prijava napake (vidi jo samo skrbnik): vprašanje, ocena pred in po pregledu, razlog; učenčevo ime zamenjano.
    try {
      const note = JSON.stringify({ vprasanje: q.id, pred: prev.points.map((p) => p.status), po: points.map((p) => p.status), razlog: comment });
      const named = s.name?.length > 1 ? note.replaceAll(s.name, "[ime]") : note;
      db.prepare("INSERT INTO bug_reports (student_id, kind, topic_id, conversation_id, reason, note) VALUES (?, 'app', ?, ?, 'ustno', ?)").run(s.id, q.topicId, row.conversation_id, seal(named));
    } catch (e) {
      console.warn(`[evklid] ustno: prijava ugovora ni zapisana: ${e?.message || e}`);
    }
    const out = resultOf(points);
    addMsg(row.conversation_id, "user", `Ne strinjam se z oceno.${comment ? ` ${comment}` : ""}`);
    addMsg(row.conversation_id, "assistant", `Ponovni pregled: ${out.tocke} od ${out.max} točk.`);
    const used = db.prepare("SELECT ugovori FROM ustno_seje WHERE id = ?").get(row.id)?.ugovori ?? MAX_APPEALS;
    res.json({ tocke: out.tocke, max: out.max, dobro: out.dobro, pojmi: publicPoints(q, points), ugovori: Math.max(0, MAX_APPEALS - used) });
  }

  // Konec: povzetek (»4 od 5«, kaj znaš, kaj ponovi). Samoocena pošlje svoje ocene (brez AI).
  app.post("/api/students/:id/ustno/:sid/konec", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const ses = loadSession(req, res, s);
    if (!ses) return;
    const { row, qs, st } = ses;
    const self = Array.isArray(req.body?.samoocena) ? req.body.samoocena : null;
    if (self) {
      self.slice(0, qs.length).forEach((v, i) => {
        // Pri spraševanju z AI samo vprašanja, pri katerih je učenec izbral samooceno (/vzorec).
        if (st.odgovori[i] || !["znam", "delno", "neznam"].includes(v) || (!st.samoocena && !(st.samo || []).includes(i))) return;
        const status = v === "znam" ? "povedal" : v === "delno" ? "delno" : "manjka";
        st.odgovori[i] = { points: qs[i].pojmi.map((_, kp) => ({ kp, status, quote: "" })), samoocena: true };
      });
    }
    const per = qs.map((q, i) => ({ q, i, r: st.odgovori[i] ? score(st.odgovori[i].points) : null }));
    const dobro = per.filter((x) => x.r?.dobro).length;
    const weak = per.filter((x) => !x.r?.dobro);
    const lessonsOf = (list) => [...new Map(list.map((x) => [x.q.topicId, { id: x.q.topicId, name: getTopic(x.q.topicId)?.name || x.q.topicId }])).values()];
    if (!row.koncano_at) {
      db.prepare("UPDATE ustno_seje SET koncano_at = datetime('now'), stanje = ? WHERE id = ?").run(sealJson(st), row.id);
      addMsg(row.conversation_id, "assistant", `Dobro si znal ${dobro} od ${qs.length} vprašanj.`);
    }
    res.json({
      dobro,
      n: qs.length,
      znas: per.filter((x) => x.r?.dobro).map((x) => ({ i: x.i, besedilo: x.q.besedilo })),
      ponovi: weak.map((x) => ({ i: x.i, besedilo: x.q.besedilo, topicId: x.q.topicId })),
      lekcije: lessonsOf(weak),
      tocke: per.reduce((t, x) => t + (x.r?.tocke || 0), 0),
      max: qs.reduce((t, q) => t + q.pojmi.length, 0),
    });
  });

  // Stikalo starša (odločitev 3; j 10. 11.: velja povsod, tudi za mikrofon v klepetu z inštruktorjem, server/app.js):
  // »Dovoli odgovarjanje z glasom« za profile mlajše od 15 let, privzeto izklopljeno.
  app.get("/api/account/ustno-glas", (req, res) => {
    if (!accounts || !req.parent) return res.json({ profili: [] });
    const kids = db.prepare("SELECT s.id, s.name, g.dovoljeno FROM students s LEFT JOIN ustno_glas g ON g.student_id = s.id WHERE s.parent_id = ? ORDER BY s.id").all(req.parent.id);
    res.json({
      profili: kids.map((k) => {
        const age = accounts.ageOfStudent(k.id);
        return { id: k.id, ime: k.name, pod15: !(age != null && age >= VOICE_AGE), dovoljeno: !!k.dovoljeno };
      }),
    });
  });
  app.post("/api/account/ustno-glas", (req, res) => {
    if (!accounts || !req.parent) return res.status(404).json({ error: "Ne obstaja." });
    const id = Number(req.body?.student_id);
    if (!Number.isInteger(id) || accounts.ownerOf(id) !== req.parent.id) return res.status(404).json({ error: "Učenec ne obstaja." });
    if (typeof req.body?.dovoli !== "boolean") return res.status(400).json({ error: "Manjka izbira." });
    db.prepare("INSERT INTO ustno_glas (student_id, dovoljeno, spremenjeno) VALUES (?, ?, datetime('now')) ON CONFLICT(student_id) DO UPDATE SET dovoljeno = excluded.dovoljeno, spremenjeno = excluded.spremenjeno").run(id, req.body.dovoli ? 1 : 0);
    // Dokaz privolitve starša (pregled B7): vklop in izklop v dnevnik dostopov.
    audit(db, { req, parentId: req.parent.id, action: req.body.dovoli ? "ustno_glas_on" : "ustno_glas_off", target: `student:${id}` });
    res.json({ ok: true, dovoljeno: req.body.dovoli });
  });

  return { voice };
}

export { POINTS };
