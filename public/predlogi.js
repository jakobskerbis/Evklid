// Predlogi vprašanj v praznem klepetu (j, 17. 11. 2026): po profilu in vsakič drugačni.
// Teme z učne poti učenčevega razreda/letnika in predmeta: naslednja in nekaj neosvojenih za njo, za ponavljanje
// nekaj osvojenih. Vsak predlog ima drugo temo in drugo vrsto vprašanja (razlaga, naloga, rešen primer, kratko
// preverjanje, pogoste napake, ponavljanje). Maturant (4. letnik MAT/FIZ/KEM/BIO) pogosto dobi nalogo v slogu mature
// (pri MAT z ravnijo), 6. in 9. razred pri MAT v slogu NPZ. Brez učne poti ostanejo splošni predlogi.
import { jeOs, jeSs } from "./stopnja.js";

const NEW = ["chat.ideaExplain", "chat.ideaTask", "chat.ideaExample", "chat.ideaQuiz", "chat.ideaMistakes"];
const OLD = ["chat.ideaRepeat", "chat.ideaTask", "chat.ideaQuiz"];
const NEAR = 6; // koliko neosvojenih tem od naslednje naprej pride v poštev
const EXAM_SHARE = 0.6; // kako pogosto je med predlogi naloga v slogu mature/NPZ

function shuffle(list, rnd) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Naloga v slogu izpita za ta profil (ključ i18n) ali null. */
export function examIdea(s = {}) {
  const level = String(s.curriculum_level || "");
  if (jeSs(s) && /^4\. letnik/.test(level) && ["MAT", "FIZ", "KEM", "BIO"].includes(s.subject)) {
    const raven = / (VR|OR)$/.exec(level)?.[1];
    return s.subject === "MAT" && raven ? (raven === "VR" ? "chat.ideaMaturaVR" : "chat.ideaMaturaOR") : "chat.ideaMatura";
  }
  if (jeOs(s) && /^(6|9)\. razred/.test(level) && s.subject === "MAT") return "chat.ideaNpz";
  return null;
}

/**
 * Trije predlogi za prazen klepet.
 * @param {object} s nastavitve učenca
 * @param {{ next?: object, topics?: object[] }|null} path učna pot (teme z id, name, status)
 * @param {(key: string, params?: object) => string} t prevod
 * @param {() => number} rnd naključje (v testih stalno)
 */
export function chatIdeas(s = {}, path = null, t = (k) => k, rnd = Math.random) {
  const topics = (path?.topics || []).filter((x) => x?.name);
  const open = topics.filter((x) => x.status !== "mastered");
  const at = path?.next?.id ? Math.max(0, open.findIndex((x) => x.id === path.next.id)) : 0;
  const near = open.slice(at, at + NEAR);
  if (path?.next?.name && !near.some((x) => x.id === path.next.id)) near.unshift(path.next);
  const done = topics.filter((x) => x.status === "mastered").slice(-NEAR);
  if (!near.length && !done.length) return shuffle([t("chat.idea1"), t("chat.idea2"), t("chat.idea3")], rnd);

  const out = [];
  const exam = examIdea(s);
  if (exam && rnd() < EXAM_SHARE) out.push({ text: t(exam), kind: "exam", topic: null });
  const options = shuffle([...near.flatMap((x) => NEW.map((k) => ({ k, x }))), ...done.flatMap((x) => OLD.map((k) => ({ k, x })))], rnd);
  // Najprej različne teme in različne vrste; če tem ni dovolj, ista tema z drugo vrsto vprašanja.
  for (const strict of [true, false]) {
    for (const o of options) {
      if (out.length >= 3) break;
      if (out.some((i) => i.kind === o.k && i.topic === o.x.id)) continue;
      if (out.some((i) => i.kind === o.k || (strict && i.topic === o.x.id))) continue;
      out.push({ text: t(o.k, { topic: o.x.name }), kind: o.k, topic: o.x.id });
    }
  }
  if (exam && out.length < 3 && !out.some((i) => i.kind === "exam")) out.push({ text: t(exam), kind: "exam", topic: null });
  return shuffle(out.map((i) => i.text), rnd);
}
