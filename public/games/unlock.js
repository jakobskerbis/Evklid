// Odklepanje iger (j: igre so zaklenjene, dokler učenec snovi ne zna dovolj, da jo reši tako hitro, kot igra zahteva).
// Uporablja ga portal (index.js) in strežnik (server/games.js). Brez uvozov.
//
// 1. Znanje snovi: tema je obvladana na učni poti, snov je iz nižjega razreda ali učenec opravi preizkus (4 od 5).
// 2. Hitrost: mirne igre (1) so odprte takoj, ko snov zna; srednje hitre (2) šele, ko v mirni igri te snovi
//    zbere vsaj 8 pravilnih in 80 % pravilnih v eni igri; hitre (3) enako po srednje hitri igri.
import { LESSONS } from "./lessons.js";

export const PACE = {
  maze: 1, castle: 1, bubbles: 1, cannon: 1, marble: 1, orb: 1,
  meteor: 2, balloons: 2, sorter: 2, snake: 2, bricks: 2, frog: 2, invaders: 2, lander: 2, crane: 2,
  runner: 3, heli: 3, moles: 3, jumper: 3,
  pet: 1, pairs: 1, water: 1, mines: 1, diner: 2, hills: 2, catcher: 2, slicer: 3,
  match: 1, cards: 1, blocks: 2,
  impostor: 1,
  numline: 1, typed: 2, tiles: 1, order: 1,
};
// j (2026-10-29 18:04): »Odstrani zaporo iger« – zapora je izklopljena, vse igre so odprte.
// Pravila spodaj ostajajo, da jo lahko spet vklopimo (true).
export const LOCKS_ON = false;
export const CLEAR_CORRECT = 8;
export const CLEAR_RATE = 0.8;
export const CHECK_TASKS = 5;
export const CHECK_PASS = 4;

export const isCleared = (correct, wrong) => correct >= CLEAR_CORRECT && correct / Math.max(1, correct + wrong) >= CLEAR_RATE;

// Razred teme iz ključa poti: MAT-OS-7 → 7, FIZ-SS-2 → 11.
export function topicYear(id) {
  const m = /^[A-Z]+-(OS|SS)-(\d)\//.exec(id);
  return m ? (m[1] === "OS" ? +m[2] : 9 + +m[2]) : 99;
}

export const lessonsOf = (conceptId) => LESSONS[conceptId] || [];

// st = { year, known: Set(tem), passed: Set(pojmov), games: { "vrsta:pojem": { cleared } } }
export function knowsConcept(c, st) {
  if (st.passed.has(c.id)) return true;
  const topics = lessonsOf(c.id);
  if (topics.some((t) => st.known.has(t))) return true;
  // Snov iz nižjega razreda (že obravnavana v šoli); študentom so odprte vse snovi do fakultete.
  // Prvi razred, v katerem se snov uči: nižji od razreda pojma in razreda teme (npr. zaokroževanje že v 4. razredu).
  const year = Math.min(c.year, ...topics.map(topicYear));
  return year < st.year || (st.year >= 14 && year <= 14);
}

// Najvišja hitrost iger, ki jih je učenec pri tej snovi že opravil (0 = nobene).
export function clearedPace(conceptId, st) {
  let best = 0;
  for (const [id, g] of Object.entries(st.games || {})) {
    const [eid, cid] = id.split(":");
    if (cid === conceptId && g.cleared) best = Math.max(best, PACE[eid] || 1);
  }
  return best;
}

// null = odprto; sicer { need: "learn", topic } ali { need: "pace", pace } (najprej opravi igro te hitrosti).
export function gameLock(engineId, c, st) {
  if (!knowsConcept(c, st)) return { need: "learn", topic: lessonsOf(c.id)[0] || null };
  const pace = PACE[engineId] || 2;
  if (pace > 1 && clearedPace(c.id, st) < pace - 1) return { need: "pace", pace: pace - 1 };
  return null;
}
