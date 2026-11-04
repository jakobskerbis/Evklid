// Oznake delov naše pole (public/our-paper.js, server/paper-context.js). Pola z dvema izpitnima polama ali deli
// A/B lahko ima nalogo 1 večkrat, zato ključ vsebuje polo in del: »3b«, »A3b«, »2-5«, »1-A3b«.
export const partKey = (tk, p) => `${tk.pola ? `${tk.pola}-` : ""}${tk.section || ""}${tk.n}${p.id || ""}`;
// Oznaka za učenca in inštruktorja brez pole (»A3b«); pola gre posebej (»2. izpitna pola«).
export const partLabel = (tk, p) => `${tk.section || ""}${tk.n}${p.id || ""}`;
