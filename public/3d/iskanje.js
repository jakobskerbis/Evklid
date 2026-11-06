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


// Iskanje po ploščicah zavihka »Uči se → 3D svet« (public/uci-3d.js): po naslovu, opisu, predmetu, sinonimih in DELIH
// modela (kazalo public/3d/iskalnik.json, scripts/3d/indeks.mjs). Vsaka ploščica: { id, naslov, opis, podrocjeIme,
// predmetIme, sinonimi: [], deli: [[ime, ključ, vrednost, latinsko?]] }. Vrne [{ p: ploščica, del: vnos | null }]; del je
// najboljši ujemajoči del (da ga ploščica pokaže in odpre model naravnost na njem), null, če se je ujel že naslov.
export function isciPloscice(ploscice, q, { red = null } = {}) {
  const besede = brezStresic(q).split(/\s+/).filter(Boolean);
  if (!besede.length) return [];
  const ocene = [];
  ploscice.forEach((p, i) => {
    const naslov = brezStresic(p.naslov);
    const ostalo = [p.opis, p.podrocjeIme, p.predmetIme, ...(p.sinonimi || [])].map(brezStresic).join(" ");
    const deli = (p.deli || []).map((d) => ({ d, t: brezStresic(`${d[0]} ${d[3] || ""}`), ime: brezStresic(d[0]) }));
    let vsota = 0;
    for (const b of besede) {
      let o = 0;
      if (naslov.startsWith(b)) o = 7;
      else if (naslov.split(/[\s-]+/).some((w) => w.startsWith(b))) o = 6;
      else if (naslov.includes(b)) o = 5;
      if (!o && deli.some((x) => x.ime.split(/[\s-]+/).includes(b))) o = 5; // cela beseda imena dela (»kocka« → telesa pred »kockasta kost«, »prekat« → Srce pred »prekata« v atlasu)
      if (!o && deli.some((x) => x.ime.split(/[\s-]+/).some((w) => w.startsWith(b)))) o = 4;
      if (!o && deli.some((x) => x.t.includes(b))) o = 3;
      if (!o && (p.sinonimi || []).some((s) => brezStresic(s).includes(b))) o = 3;
      if (!o && ostalo.includes(b)) o = 1;
      if (!o) return;
      vsota += o;
    }
    // Beseda brez zadetka (o = 0) je ploščico že izločila: vse besede morajo biti nekje na njej.
    // Najboljši del: ujame vse besede v enem imenu (ali čim več besed); naslov ploščice ujame le, če ni boljšega dela.
    let del = null;
    const vNaslovu = besede.every((b) => naslov.includes(b));
    if (!vNaslovu) {
      let naj = 0;
      for (const x of deli) {
        const n = besede.filter((b) => x.t.includes(b)).length;
        const toc = n * 2 + (besede.some((b) => x.ime.split(/[\s-]+/).some((w) => w.startsWith(b))) ? 1 : 0) + (besede.length === 1 && x.ime === besede[0] ? 2 : 0);
        if (n && toc > naj) (naj = toc), (del = x.d);
      }
    }
    ocene.push([{ p, del }, vsota, red ? red(p, i) : i, p.id === "atlas" ? 1 : 0]);
  });
  // Enako ocenjene: najprej poseben model (»prekat« → Srce pred atlasom z gostim seznamom struktur), nato vrstni red zbirke.
  return ocene.sort((a, b) => b[1] - a[1] || a[3] - b[3] || a[2] - b[2]).map(([r]) => r);
}

export const NEDAVNO = "evklid.3d.nedavno"; // zadnji odprti modeli (stran.js zapomni), isti zapis v zbirki /3d in v »Uči se«

/** Zadnji odprti model (id) iz zapisa na napravi; napaka ali prazen zapis = null. */
export function zadnjiModel(ids, beri) {
  try {
    const l = JSON.parse(beri());
    return (Array.isArray(l) ? l : []).find((id) => typeof id === "string" && ids.includes(id)) || null;
  } catch {
    return null;
  }
}

/** Nadzor ali del, ki ga odpre zadetek: [ime, ključ, vrednost] → parametri strani /3d (del, izberi (atlas) ali nadzor modela). */
export const paramDela = (d) => (d && d[1] && d[2] ? { [d[1]]: d[2] } : null);

