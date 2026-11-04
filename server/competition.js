// Razdelek »Tekmovanja«: samo težje naloge v slogu tekmovanj (MAT, FIZ, KEM; OŠ in SŠ).
// Teme so v curriculum-data.js (poti <predmet>-TEK-<OS|SS>), naloge v
// practice/generators/tek-*.js. Fakultete tekmovanj nimajo.
import { getPath } from "./curriculum.js";
import { jeFaks, jeSs } from "../public/stopnja.js";

export const COMPETITIONS = {
  "MAT-TEK-OS": ["Kenguru", "Vegovo priznanje"],
  "MAT-TEK-SS": ["Kenguru", "Vegovo priznanje", "matematična olimpijada"],
  "FIZ-TEK-OS": ["Stefanovo priznanje"],
  "FIZ-TEK-SS": ["Stefanovo priznanje", "fizikalna olimpijada"],
  "KEM-TEK-OS": ["Preglovo priznanje"],
  "KEM-TEK-SS": ["Preglovo priznanje", "kemijska olimpijada"],
};

// Poskusno tekmovanje: naloge od lažjih k težjim, točke po težavnosti (kot pri Kenguruju: 3, 4 in 5).
export const CONTEST = {
  levels: [1, 1, 1, 2, 2, 2, 2, 3, 3, 3],
  points: { 1: 3, 2: 4, 3: 5 },
  minutes: 45,
};
export const TRAINING_TASKS = 10;

// Imena težavnosti v razdelku: tudi najlažja raven je nad rednim poukom.
export const LEVEL_NAMES = { 1: "težja", 2: "zahtevna", 3: "izziv" };

export const isCompetitionPath = (key) => /^(MAT|FIZ|KEM)-TEK-(OS|SS)$/.test(String(key || ""));

export function competitionKey(subject, school) {
  const key = `${subject}-TEK-${school === "SS" ? "SS" : "OS"}`;
  return isCompetitionPath(key) ? key : null;
}

// Privzeta tekmovalna pot iz nastavitev učenca (fakulteta: ni tekmovanj).
export function competitionKeyFor(settings) {
  if (jeFaks(settings)) return null;
  // Tekmovanja so za MAT, FIZ in KEM; pri drugih predmetih (npr. biologija) pokažemo matematiko.
  const subject = ["MAT", "FIZ", "KEM"].includes(settings.subject) ? settings.subject : "MAT";
  return competitionKey(subject, jeSs(settings) ? "SS" : "OS");
}

export function competitionInfo(key) {
  const p = getPath(key);
  if (!p || !isCompetitionPath(key)) return null;
  const [subject, , school] = key.split("-");
  return {
    key,
    label: p.label,
    subject,
    school,
    competitions: COMPETITIONS[key],
    contest: { tasks: CONTEST.levels.length, minutes: CONTEST.minutes, maxPoints: CONTEST.levels.reduce((s, l) => s + CONTEST.points[l], 0) },
    levelNames: LEVEL_NAMES,
  };
}
