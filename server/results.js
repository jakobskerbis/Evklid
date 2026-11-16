// Rezultati učenca za sistemski prompt (del pod črto, ni predpomnjen): iz njih inštruktor
// izbere začetno zahtevnost primerov in nalog ter jo med pogovorom dviga ali spušča.
// Razlaga nove snovi je vedno od začetka (ničelno predznanje), ne glede na rezultate.

export const TIERS = ["osnovna", "srednja", "višja"];
const pct = (k, n) => `${Math.round((100 * k) / n)} %`;

// store: Store; studentId; topicId: tema učne poti ali null (prost pogovor).
// Vrne { text, tier } – text gre v prompt, tier tudi v ključ predpomnilnika odgovorov.
export function studentResults(store, studentId, topicId = null) {
  const db = store.db;
  const all = db
    .prepare(
      `SELECT COUNT(*) AS n, COALESCE(SUM(first_try_correct), 0) AS ok FROM tasks
       WHERE student_id = ? AND first_try_correct IS NOT NULL AND mode != 'pretest' AND created_at >= datetime('now', '-30 days')`,
    )
    .get(studentId);
  const chat = db
    .prepare(
      `SELECT COUNT(*) AS n, COALESCE(SUM(error), 0) AS err FROM events
       WHERE student_id = ? AND conversation_id IS NOT NULL AND topic IS NOT NULL AND created_at >= datetime('now', '-30 days')`,
    )
    .get(studentId);
  let topic = null;
  if (topicId) {
    const st = db.prepare("SELECT status, level, pretest FROM topic_state WHERE student_id = ? AND topic_id = ?").get(studentId, topicId);
    const last = db
      .prepare(
        `SELECT first_try_correct AS ok, level, hint_used FROM tasks
         WHERE student_id = ? AND topic_id = ? AND first_try_correct IS NOT NULL AND mode != 'pretest' ORDER BY id DESC LIMIT 8`,
      )
      .all(studentId, topicId);
    topic = {
      status: st?.status || "new",
      level: st?.level || 1,
      pretest: st?.pretest ?? null, // 0–3: stopnje, rešene zapored v začetnem testu predznanja
      n: last.length,
      ok: last.filter((t) => t.ok).length,
      hardOk: last.filter((t) => t.ok && t.level >= 2).length,
    };
  }

  const overallAcc = all.n >= 8 ? all.ok / all.n : null;
  const chatErr = chat.n >= 6 ? chat.err / chat.n : null;
  let tier = "osnovna";
  let why = "nova snov ali premalo podatkov";
  if (topic && topic.status === "mastered") {
    tier = "višja";
    why = "tema je že obvladana";
  } else if (topic && topic.n >= 4 && topic.ok / topic.n >= 0.8 && topic.hardOk >= 2) {
    tier = "višja";
    why = "pri tej temi zanesljivo rešuje tudi zahtevnejše naloge";
  } else if (topic && topic.n >= 3 && topic.ok / topic.n >= 0.6) {
    tier = "srednja";
    why = "pri tej temi večino nalog reši v prvem poskusu";
  } else if (topic && topic.n >= 3 && topic.ok / topic.n < 0.4) {
    tier = "osnovna";
    why = "pri tej temi se pogosto zmoti: manjši koraki, preprosta števila";
  } else if (topic && topic.pretest != null) {
    tier = TIERS[Math.max(0, topic.pretest - 1)];
    why =
      topic.pretest >= 3
        ? "v začetnem testu je rešil vse tri stopnje: osnove le na kratko ponovi"
        : topic.pretest === 2
          ? "v začetnem testu je rešil osnovno in srednjo nalogo"
          : topic.pretest === 1
            ? "v začetnem testu je rešil le osnovno nalogo"
            : "v začetnem testu ni rešil nobene naloge: razlaga od začetka, po korakih";
  } else if (!topic?.n && overallAcc !== null && overallAcc >= 0.8 && (chatErr === null || chatErr < 0.25)) {
    tier = "osnovna";
    why = "nova snov, a sicer zelo uspešen: po razlagi hitro preidi na zahtevnejše primere";
  }

  const parts = [];
  if (all.n) parts.push(`Vadnica (30 dni): ${all.ok} od ${all.n} nalog v prvem poskusu pravilno (${pct(all.ok, all.n)})`);
  if (topic) {
    const status = { new: "nova", learning: "v učenju", mastered: "obvladana" }[topic.status] || topic.status;
    parts.push(
      `ta tema: ${status}, stopnja nalog ${topic.level}/3` +
        (topic.pretest != null ? `, začetni test predznanja: rešene stopnje ${topic.pretest} od 3` : "") +
        (topic.n ? `, zadnjih ${topic.n} nalog: ${topic.ok} v prvem poskusu pravilno` : ", vaj še ni reševal"),
    );
  }
  if (chat.n) parts.push(`pogovori (30 dni): vsebinska napaka v ${chat.err} od ${chat.n} odgovorov`);
  if (!parts.length) parts.push("še ni podatkov");
  // personal: vrstica nosi rezultate tega učenca (štetja, stopnja, začetni test), ne le privzetih vrednosti nove teme;
  // tak odgovor ne gre v skupni predpomnilnik (server/app.js hasPersonalPrompt, pregled #484 B P2-1).
  const personal = all.n > 0 || chat.n > 0 || (!!topic && (topic.status !== "new" || topic.level !== 1 || topic.pretest != null || topic.n > 0));
  return { text: `${parts.join("; ")}. Predlagana začetna zahtevnost: ${tier} (${why}).`, tier, personal };
}
