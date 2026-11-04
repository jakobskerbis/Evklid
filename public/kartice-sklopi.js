// Sklopi kartic za ponavljanje (brez DOM, za public/flashcards.js in teste).
// Sklop = tema, iz katere je inštruktor naredil kartico. Lastne kartice so v svojem sklopu,
// kartice inštruktorja brez teme pa v sklopu »Splošno«.

export const OWN = "__own";
export const OTHER = "__other";

export const setKey = (c) => (c.source === "own" ? OWN : String(c.topic || "").trim() || OTHER);

// cards: kartice s strežnika (v vrstnem redu seznama) → [{ key, kind, name, ids, total, due }].
// Vrstni red: največ kartic na vrsti, nato abecedno; »Splošno« in lastne kartice na koncu.
export function cardSets(cards, collator = new Intl.Collator("sl")) {
  const map = new Map();
  for (const c of cards) {
    const key = setKey(c);
    if (!map.has(key)) map.set(key, { key, kind: key === OWN ? "own" : key === OTHER ? "other" : "topic", name: key === OWN || key === OTHER ? "" : key, ids: [], total: 0, due: 0 });
    const s = map.get(key);
    s.ids.push(c.id);
    s.total++;
    if (c.is_due) s.due++;
  }
  const rank = { topic: 0, other: 1, own: 2 };
  return [...map.values()].sort((a, b) => rank[a.kind] - rank[b.kind] || b.due - a.due || collator.compare(a.name, b.name));
}

// Kartice za vajo v izbranem sklopu (key = null: vsi sklopi).
// Najprej kartice na vrsti (ocena gre na strežnik in premakne razpored);
// practice = true: nobena ni na vrsti, zato vadi vse kartice sklopa brez spremembe razporeda.
export function sessionCards(cards, key = null, { practice = false } = {}) {
  const inSet = cards.filter((c) => key === null || setKey(c) === key);
  if (practice) return { ids: inSet.map((c) => c.id), practice: true };
  return { ids: inSet.filter((c) => c.is_due).map((c) => c.id), practice: false };
}
