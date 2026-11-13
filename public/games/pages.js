// Mreža iger po straneh (j 2026-10-30: »prikaži največ 50 iger naenkrat zaradi laga«, »lahko je tudi več«):
// 60 se lepo razdeli v vrstice po 2–6. Brez uvozov in DOM (testi: test/games.test.js).
export const PER_PAGE = 60;

// groups: [{ id, games: [...] }] (prazne izpuščene) → { page, pages, total, parts: [{ id, games (na strani), all }] }.
// Stran, ki je po ožji izbiri ni več, postane zadnja.
export function pageSlice(groups, page, per = PER_PAGE) {
  const total = groups.reduce((n, g) => n + g.games.length, 0);
  const pages = Math.max(1, Math.ceil(total / per));
  page = Math.min(Math.max(0, page), pages - 1);
  let from = page * per, left = per;
  const parts = [];
  for (const g of groups) {
    if (left <= 0) break;
    if (from >= g.games.length) {
      from -= g.games.length;
      continue;
    }
    const games = g.games.slice(from, from + left);
    from = 0;
    left -= games.length;
    parts.push({ id: g.id, games, all: g.games.length });
  }
  return { page, pages, total, parts };
}

// Številke gumbov: prva, zadnja in near sosedov trenutne (0-indeksi, urejeni).
export const pageNums = (page, pages, near = 2) =>
  [...new Set([0, pages - 1, ...Array.from({ length: 2 * near + 1 }, (_, i) => page - near + i)])].filter((n) => n >= 0 && n < pages).sort((a, b) => a - b);
