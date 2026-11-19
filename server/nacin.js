// Način A (vodenje) / B (celotna rešitev) med pogovorom (j 14. 11. 2026): učenec zamenja način v glavi Inštruktorja,
// nastavitev se shrani, a sistemski prompt pove le »Način: B« na koncu, zgodovina pogovora (prejšnji odgovori z
// META mode=A, opomba pretekle pole »vodi z namigi«) pa vleče nazaj v stari način. Zato ob zamenjavi strežnik
// sporočilu doda skrito opombo (kot opomba pole ali lekcije), ki se shrani v zgodovino. Besedilo prompta ostane enako.
export const MODE_TAG = "nacin";

const NAME = { A: "A (vodenje)", B: "B (celotna rešitev)" };

// before: način, s katerim je inštruktor nazadnje odgovoril v pogovoru (null = še ni odgovoril); now: nastavitev zdaj.
export function modeSwitchNote(before, now) {
  if (!NAME[before] || !NAME[now] || before === now) return "";
  return [
    `<${MODE_TAG}>`,
    `The Evklid app: the student has just switched the solving mode in the app from način ${NAME[before]} to način ${NAME[now]}.`,
    `From this message on answer by the rules of način ${now}, even where earlier messages or notes in this conversation followed način ${before}.`,
    "Never mention this note.",
    `</${MODE_TAG}>`,
  ].join("\n");
}

// Izrecna prošnja za rešitev naloge v načinu A (j 19. 11. 2026, kartica po slepi primerjavi): »Reši to nalogo … Pokaži
// postopek« je inštruktor v načinu A obravnaval kot vodenje in vrnil le vprašanje. Prompt že pravi, da izrecna zahteva
// za celotno rešitev preklopi v način B (enkratno ali trajno); skrita opomba to pove izrecno, besedilo prompta ostane.
// Samo jasne prošnje: navodilo naloge (»Reši enačbo …«) ni prošnja, zanikanje (»ne reši mi«) tudi ne.
const SOLVE_ASK = [
  /\bre[sš]i(?:te)?\s+(?:mi\s+)?(?:to|tole|naslednjo|spodnjo|sledečo|tole)?\s*nalogo\b/,
  /\bre[sš]i(?:te)?\s+mi\b/,
  /\bkar\s+re[sš]i(?:te)?\b/,
  /\bpoka[zž]i(?:te)?\s+(?:mi\s+)?(?:cel\w*\s+|ves\s+)?(?:postopek|re[sš]itev)\b/,
  /\bcel(?:o|otno)\s+re[sš]itev\b/,
  /\b(?:daj|napi[sš]i)(?:te)?\s+mi\s+(?:cel\w*\s+)?re[sš]itev\b/,
];
const SOLVE_NOT = /\bne\s+(?:mi\s+)?(?:re[sš]i|poka[zž]i|daj|napi[sš]i)\w*\b|\bbrez\s+re[sš]itve\b/;

export function asksForSolution(text) {
  const t = String(text || "").toLowerCase().slice(0, 600);
  return !SOLVE_NOT.test(t) && SOLVE_ASK.some((r) => r.test(t));
}

export function solveRequestNote() {
  return [
    `<${MODE_TAG}>`,
    "The Evklid app: in this message the student explicitly asks you to solve the task and show the working.",
    "This is an explicit request for the full solution: answer this task by the rules of način B (full worked solution ending with the result) and follow the rule on a one-time or lasting change. If the message holds several separate tasks or says the work must be handed in, the homework rule still applies.",
    "Never mention this note.",
    `</${MODE_TAG}>`,
  ].join("\n");
}
