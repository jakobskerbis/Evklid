// Oznake delov naše pole (public/our-paper.js, server/paper-context.js). Pola z dvema izpitnima polama ali deli
// A/B lahko ima nalogo 1 večkrat, zato ključ vsebuje polo in del: »3b«, »A3b«, »2-5«, »1-A3b«.
export const partKey = (tk, p) => `${tk.pola ? `${tk.pola}-` : ""}${tk.section || ""}${tk.n}${p.id || ""}`;
// Oznaka za učenca in inštruktorja brez pole (»A3b«); pola gre posebej (»2. izpitna pola«).
export const partLabel = (tk, p) => `${tk.section || ""}${tk.n}${p.id || ""}`;
// Poskusni izpit (server/poskusna-pola.js, public/our-paper.js openExamSim): naloge in največ točk ene izpitne pole
// (pola = 1, 2) ali cele pole brez delitve (pola = null).
// Pri izbirnih nalogah (maxPoints, učenec izbere nekaj nalog) je izbira v zadnji izpitni poli (matura BIO/FIZ pola 2,
// poklicna matura): največ točk te pole je vsota naštetih minus presežek.
export function simScope(paper, pola = null) {
  const polas = (paper.polas || []).map((x) => x.pola);
  if (polas.length ? !polas.includes(pola) : pola !== null) return null;
  const tasks = polas.length ? paper.tasks.filter((tk) => tk.pola === pola) : paper.tasks;
  const listed = tasks.reduce((s, tk) => s + tk.parts.reduce((a, p) => a + p.points, 0), 0);
  const total = paper.tasks.reduce((s, tk) => s + tk.parts.reduce((a, p) => a + p.points, 0), 0);
  const extra = paper.maxPoints ? total - paper.maxPoints : 0;
  const last = !polas.length || pola === polas[polas.length - 1];
  const info = (paper.polas || []).find((x) => x.pola === pola);
  return { pola, tasks, maxPoints: Math.max(1, listed - (last ? extra : 0)), minutes: info?.minutes || paper.minutes, tools: info?.tools || (polas.length ? "" : paper.tools || ""), choice: last && extra > 0 };
}

// Vse izpitne pole za uvod poskusnega izpita (pola brez delitve: ena, pola = null).
export const simPolas = (paper) => (paper.polas?.length ? paper.polas.map((x) => simScope(paper, x.pola)) : [simScope(paper, null)]);
