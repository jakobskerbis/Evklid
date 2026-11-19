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
// JS \b ne pozna šumnikov: za »rešiš«, »pokažeš« konec besede z (?![a-zčšž]).
// Samo ednina (učenec inštruktorju piše »ti«; množina »rešite«, »pokažite« je navodilo učnega lista) in le s
// prošnjo: »Reši nalogo s pomočjo …« ali »Zapiši celotno rešitev« (navodilo) nista prošnja (pregled #879).
const SOLVE_ASK = [
  /\bre[sš]i[sš]?\s+(?:mi\s+)?(?:to|tole|\d+\.?)\s*nalogo\b/,
  /\bre[sš]i[sš]?\s+(?:mi\s+)?nalogo\s+\d/,
  /\bre[sš]i[sš]?\s+mi\b/,
  /\bmi\s+(?:lahko\s+)?re[sš]i[sš](?![a-zčšž])/,
  /\bkar\s+re[sš]i[sš]?(?![a-zčšž])/,
  /\bpoka[zž](?:i|e[sš])\s+(?:mi\s+)?(?:cel\w*\s+|ves\s+)?(?:postopek|re[sš]itev)\b/,
  /\b(?:daj|poka[zž]i|napi[sš]i|povej|rabim|ho[cč]em|potrebujem)\s+(?:mi\s+)?(?:\w+\s+)?cel(?:o|otno)\s+re[sš]itev\b/,
  /\b(?:daj|napi[sš]i|povej)\s+mi\s+(?:cel\w*\s+)?re[sš]itev\b/,
];
// Zanikanje, »rezultat bom sam«, »samo prvi korak« in učenčeva lastna rešitev (»preveri mojo rešitev«): učenec hoče sam
// do rezultata (pregled #879). Zanikanje velja za vse sporočilo (»ne daj mi namigov, reši mi« ostane vodenje: varneje).
const SOLVE_NOT =
  /\bne\s+(?:mi\s+)?(?:re[sš]i[sš]?|poka[zž](?:i|e[sš])|daj|napi[sš]i)(?![a-zčšž])|\bbrez\s+re[sš]itve\b|\bbrez\s+(?:kon[cč]nega\s+)?rezultata\b|\bbom\s+sam[a]?\b|\bsam[a]?\s+bom\b|\bsamo\s+(?:prvi\s+)?korak|\bmoj\w*\s+(?:cel\w*\s+)?re[sš]itev|\bpreveri\b/;

export function asksForSolution(text) {
  // Začetek in konec dolgega sporočila: prošnja je običajno pred ali za prilepljeno nalogo.
  const raw = String(text || "").toLowerCase();
  const t = raw.length > 1200 ? `${raw.slice(0, 600)}\n${raw.slice(-600)}` : raw;
  return !SOLVE_NOT.test(t) && SOLVE_ASK.some((r) => r.test(t));
}

export function solveRequestNote() {
  return [
    `<${MODE_TAG}>`,
    "The Evklid app: in this message the student explicitly asks for the full solution of the task.",
    "This is an explicit request for the full solution of this task: answer it by the rules of način B and follow the rule on a one-time or lasting change. If the message or its photo holds several separate tasks, or says the work must be handed in, the homework rule still applies.",
    "Never mention this note.",
    `</${MODE_TAG}>`,
  ].join("\n");
}
