// Povezava iger z učno potjo (j 2026-11-01, docs/igre-smernice.md §12): igra kot nagrada po dnevnem
// treningu, vrsta »Ponovi šibke teme« in merjenje v pilotu. Samo čista logika (brez DOM), da jo uporabljata
// strežnik (server/games.js, server/progress.js) in brskalnik (index.js).
import { LESSONS } from "./lessons.js";

// Tema učne poti → pojmi iger, ki to snov urijo (obrat LESSONS).
export const TOPIC_CONCEPTS = {};
for (const [concept, topics] of Object.entries(LESSONS)) for (const tp of topics) (TOPIC_CONCEPTS[tp] ||= []).push(concept);

// Pojmi za teme (najpogostejša tema prva); `base` preslika regijsko temo v osnovne (server/curriculum.js).
export function conceptsOfTopics(topicIds, base = (id) => [id], max = 6) {
  const count = new Map();
  for (const id of topicIds) count.set(id, (count.get(id) || 0) + 1);
  const out = [];
  for (const [id] of [...count].sort((a, b) => b[1] - a[1]))
    for (const b of base(id)) for (const c of TOPIC_CONCEPTS[b] || []) if (!out.includes(c)) out.push(c);
  return out.slice(0, max);
}

// Šibke teme: napake na učni poti (po temah) in v igrah (po pojmih) v zadnjem tednu, največ `max` pojmov,
// največ napak prvi. pathRows: [{ topic_id, n }], gameRows: [{ concept, n }].
export const WEAK_MAX = 6;
export function weakConcepts(pathRows, gameRows, base = (id) => [id], max = WEAK_MAX * 2) {
  const by = new Map();
  const add = (c, k, n) => {
    const x = by.get(c) || { concept: c, path: 0, game: 0 };
    x[k] += n;
    by.set(c, x);
  };
  for (const r of pathRows) {
    const cs = new Set(base(r.topic_id).flatMap((b) => TOPIC_CONCEPTS[b] || []));
    for (const c of cs) add(c, "path", r.n);
  }
  for (const r of gameRows) if (r.n > 0) add(r.concept, "game", r.n);
  return [...by.values()]
    .map((x) => ({ ...x, n: x.path + x.game }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n || b.path - a.path || a.concept.localeCompare(b.concept))
    .slice(0, max);
}

// Igra za pojem: najprej igre, v katerih učenec odgovor naredi sam (produce.js, produce2.js), nato mirne
// igre, ki ustrezajo vsem pojmom. `skip` = vrste, ki jih ne želimo ponoviti (raznolikost v vrsti).
export const REWARD_ENGINES = ["numline", "tiles", "order", "typed", "pairs", "cannon", "maze", "meteor"];
export function gameFor(concept, engines, fits, skip = []) {
  const list = REWARD_ENGINES.map((id) => engines.find((e) => e.id === id)).filter(Boolean);
  const ok = list.filter((e) => fits(e, concept));
  return ok.find((e) => !skip.includes(e.id)) || ok[0] || null;
}

// Prva igra za nagrado: prvi pojem, ki obstaja in ima igro → "vrsta:pojem".
export function rewardGame(conceptIds, concepts, engines, fits) {
  for (const id of conceptIds || []) {
    const c = concepts.find((x) => x.id === id);
    const e = c && gameFor(c, engines, fits);
    if (e) return `${e.id}:${c.id}`;
  }
  return null;
}
