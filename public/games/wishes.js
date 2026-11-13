// Glasovanje »Katero novo igro naj Evklid naredi ta teden?« (j 2026-10-30: tedenske posodobitve z
// novimi vrstami iger, usklajene s povratnimi informacijami). Zvrsti, ki jih zbirka še nima; tedenski
// zagon (docs/igre-tedensko.md) naredi najbolj želeno kot izvirno Evklidovo igro in jo prestavi iz
// tega seznama v GENRES (childhood.js). Samo splošna imena zvrsti, nikoli imena tujih iger.

export const WISHES = [
  { id: "tower", emoji: "🏰" },
  { id: "pinball", emoji: "🪩" },
  { id: "merge", emoji: "🔢" },
  { id: "golf", emoji: "⛳" },
  { id: "bowling", emoji: "🎳" },
  { id: "darts", emoji: "🎯" },
  { id: "fishing", emoji: "🎣" },
  { id: "rhythm", emoji: "🥁" },
  { id: "puzzle", emoji: "🧩" },
  { id: "connect", emoji: "🔴" },
  { id: "words", emoji: "🔤" },
  { id: "farm", emoji: "🌾" },
  { id: "city", emoji: "🏙️" },
  { id: "spot", emoji: "🔍" },
  { id: "hoops", emoji: "🏀" },
  { id: "penalty", emoji: "⚽" },
];
export const WISH_IDS = WISHES.map((w) => w.id);

// Teden glasovanja: od srede do srede (UTC), ključ = datum srede, ko se je začel (YYYY-MM-DD).
// Tedenski zagon v sredo zjutraj bere glasove pravkar končanega tedna.
export function weekKey(now = new Date()) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 4) % 7)); // 3 = sreda
  return d.toISOString().slice(0, 10);
}
