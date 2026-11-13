// Ravni, dnevni cilj in mejniki XP. Skupno strežniku (server/progress.js, settings.js) in odjemalcu (public/xp-fx.js).

// Raven L se začne pri 50·(L−1)² XP: 2 → 50, 3 → 200, 4 → 450, 5 → 800, 10 → 4050.
// Prve ravni pridejo hitro (nekaj nalog), poznejše počasneje, a vsaka je še vedno dosegljiva v nekaj dneh.
export const levelFor = (total) => Math.floor(Math.sqrt(Math.max(0, Number(total) || 0) / 50)) + 1;
export const levelStart = (level) => 50 * (level - 1) ** 2;

// Napredek v trenutni ravni: { level, from, to, pct } (from/to sta skupna XP na začetku te in naslednje ravni).
export function levelProgress(total) {
  const level = levelFor(total);
  const from = levelStart(level);
  const to = levelStart(level + 1);
  return { level, from, to, pct: Math.max(0, Math.min(100, Math.round(((total - from) / (to - from)) * 100))) };
}

// Dnevni cilj XP (nastavitev profila xp_goal). 50 XP ≈ 3–4 naloge.
export const XP_GOALS = [30, 50, 100, 200];
export const DEFAULT_XP_GOAL = 50;
export const cleanXpGoal = (v) => (XP_GOALS.includes(Number(v)) ? Number(v) : DEFAULT_XP_GOAL);

// Mejniki skupnih XP, ob katerih aplikacija čestita.
export const MILESTONES = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];
// Največji mejnik, ki ga je učenec prestopil med prej in zdaj (ali null).
export function crossedMilestone(before, after) {
  return MILESTONES.filter((m) => before < m && after >= m).pop() ?? null;
}

// Razlog XP s strežnika (slovensko, xp_events.reason) → ključ prevoda v public/i18n (xp.r.*). Samo razlogi ob odgovoru
// na nalogo (žetoni pod »Pravilno!«); za druge (dnevni trening, igra, tekmovanje) ni ključa in vrne null.
export function reasonKey(reason) {
  const r = String(reason || "");
  if (r === "pravilno") return ["xp.r.correct"];
  if (r === "pravilno (s pomočjo)") return ["xp.r.helped"];
  if (r === "popravljena napaka") return ["xp.r.fix"];
  if (r === "obvladana tema") return ["xp.r.mastery"];
  if (r === "preizkus znanja") return ["xp.r.placement"];
  const m = /^(\d+) dni zapored$/.exec(r);
  if (m) return ["xp.r.streak", { n: Number(m[1]) }];
  return null;
}
