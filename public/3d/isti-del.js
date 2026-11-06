// Isti del v novem stanju ali drugem modelu (j, 6. 11.: »Naj se to ne dogaja pri nobenem modelu.«). Ko se model,
// različica, kristal, pogled ali faza zamenja, pregledovalnik (pregledovalnik.js, obMenjavi) obdrži izbran del, če ga
// novo stanje ima, in okno pokaže njegov novi opis; sicer okno zapre in pokaže kratko obvestilo ob modelu.
// Ujemanje po skupnem ključu, nikoli po prikaznem imenu: id, latinsko ime (`la`), `kljuci` (sinonimi, ki jih da model)
// in nekaj splošnih sinonimov med celicami (ednina in množina, stena rastlinske celice, sarkolema mišičnega vlakna).
const SINONIMI = [
  ["jedro", "jedra"],
  ["mitohondrij", "mitohondriji"],
  ["kloroplast", "kloroplasti"],
  ["celicna-stena", "stena"],
  ["membrana", "sarkolema"],
  ["citoplazma", "sarkoplazma"],
];
const fold = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

/** Ključi dela: id, sinonimi iz tabele, `kljuci` modela in latinsko ime (»la:…«, da se ne pomeša z id-ji). */
export function kljuciDela(d) {
  const k = new Set();
  if (!d) return k;
  for (const x of [d.id, ...(Array.isArray(d.kljuci) ? d.kljuci : [])]) {
    if (x == null || x === "") continue;
    const f = fold(x);
    k.add(f);
    for (const sk of SINONIMI) if (sk.includes(f)) sk.forEach((s) => k.add(s));
  }
  if (d.la) k.add(`la:${fold(d.la)}`);
  return k;
}

/** Del v seznamu, ki ustreza delu `prej`: najprej enak id, nato skupen ključ. null, če ga ni. */
export function najdiIstiDel(seznam, prej) {
  if (!prej || !Array.isArray(seznam)) return null;
  const enak = seznam.find((d) => d && d.id === prej.id);
  if (enak) return enak;
  const kp = kljuciDela(prej);
  return seznam.find((d) => d && [...kljuciDela(d)].some((k) => kp.has(k))) || null;
}

/** Ključ besedila za obvestilo, ko novi model dela nima: »Ta celica nima jedra.« (celice, ne virusi) ali »Ta model nima dela »X«.« */
export function obvestiloManjka(prej, info = {}) {
  const celica = info.podrocje === "celice" && !/virus/.test(String(info.id || ""));
  if (celica && kljuciDela(prej).has("jedro")) return ["a3.noNucleus", {}];
  return ["a3.partMissing", { ime: prej?.ime || "" }];
}
