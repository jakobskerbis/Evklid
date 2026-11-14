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
