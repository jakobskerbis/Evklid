// Iskanje po zbirki /3d (stran.js), ločeno od strani, da ga preizkusi test/3d-zbirka.test.js brez brskalnika.
// Iskanje brez strešic in velikih črk (»srcna misicna« najde »Srčna mišična celica«).
export const brezStresic = (s) => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function najdi(modeli, q) {
  const besede = brezStresic(q).split(/\s+/).filter(Boolean);
  if (!besede.length) return [];
  const ocena = (m) => {
    const naslov = brezStresic(m.naslov);
    const vse = `${naslov} ${brezStresic(m.opis)} ${brezStresic(m.podrocjeIme)}`;
    if (!besede.every((b) => vse.includes(b))) return -1;
    return besede.reduce((s, b) => s + (naslov.startsWith(b) ? 3 : naslov.includes(b) ? 2 : 1), 0);
  };
  return modeli.map((m) => [m, ocena(m)]).filter(([, o]) => o >= 0).sort((a, b) => b[1] - a[1]).map(([m]) => m);
}

