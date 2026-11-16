// Prostor organa (docs/3d.md »Organi«): vse mere v JSON organa (ravnine prereza, točke delov, središče okvirja,
// središča vzorcev v senčilnikih) so v metrih v koordinatah GLB (izhodišče GLB = središče organa ob izvozu). Model
// se ob nalaganju prestavi v središče svoje škatle in pomanjša na polmer 1 (organ.js, pripravi). Škatla se z naknadno
// obdelavo mreže lahko premakne (npr. dograjen aortni lok, popravi-zile.mjs), zato mere iz JSON vedno pretvorimo
// tukaj; množenje samo z merilom bi rez in točke zamaknilo za premik središča. Brez DOM-a in three (test v Node).
export function prostorOrgana(sredisce = [0, 0, 0], polmer = 1) {
  const c = Array.isArray(sredisce) ? sredisce : [sredisce.x, sredisce.y, sredisce.z];
  const s = 1 / (polmer || 1);
  return {
    s,
    sredisce: c,
    // točka v metrih GLB → enote modela
    tocka: (p) => [(p[0] - c[0]) * s, (p[1] - c[1]) * s, (p[2] - c[2]) * s],
    // ravnina n·p + d = 0 v metrih GLB → { n (enotska), d } v enotah modela
    ravnina(n, d = 0) {
      const l = Math.hypot(n[0], n[1], n[2]) || 1;
      const e = [n[0] / l, n[1] / l, n[2] / l];
      return { n: e, d: (d / l + e[0] * c[0] + e[1] * c[1] + e[2] * c[2]) * s };
    },
  };
}

// Deli iste žile s steno (extras »stik«, scripts/atlas/popravi-zile.mjs) so vsak zase zaprti, zato je na stiku dveh
// delov pregrada: obroč istih trikotnikov v obeh delih, obrnjenih drug proti drugemu. Od zunaj je ni videti, v
// prerezu pa se sprednja stran enega in pokrov reza drugega prekrivata (črtkan drugi obroč). Iz združene mreže
// zato odpadejo pari nasprotno navitih trikotnikov z istimi tremi oglišči (položaji so v obeh delih do bita enaki).
// polozaji: Float32Array (3 na oglišče), indeksi: trikotniki. Vrne nove indekse ali null, če ni kaj odstraniti.
export function brezPregrad(polozaji, indeksi) {
  const st = new Map();
  const ogl = new Uint32Array(polozaji.length / 3);
  for (let i = 0; i < ogl.length; i++) {
    const k = `${polozaji[i * 3]},${polozaji[i * 3 + 1]},${polozaji[i * 3 + 2]}`;
    let j = st.get(k);
    if (j === undefined) st.set(k, (j = st.size));
    ogl[i] = j;
  }
  const prvi = new Map();
  const proc = new Uint8Array(indeksi.length / 3);
  let odstranjenih = 0;
  for (let f = 0; f < indeksi.length; f += 3) {
    const a = ogl[indeksi[f]], b = ogl[indeksi[f + 1]], c = ogl[indeksi[f + 2]];
    if (a === b || b === c || a === c) continue;
    // ključ: najmanjše oglišče in drugi dve v smeri navitja; nasprotno navit dvojnik ima drugi dve zamenjani
    const [x, y, z] = a < b && a < c ? [a, b, c] : b < c ? [b, c, a] : [c, a, b];
    const k = `${x},${z},${y}`;
    const nasprotni = prvi.get(k);
    if (nasprotni !== undefined) {
      prvi.delete(k);
      proc[nasprotni] = proc[f / 3] = 1;
      odstranjenih += 2;
    } else prvi.set(`${x},${y},${z}`, f / 3);
  }
  if (!odstranjenih) return null;
  const nov = new Uint32Array(indeksi.length - odstranjenih * 3);
  let n = 0;
  for (let f = 0; f < indeksi.length; f += 3) if (!proc[f / 3]) { nov[n++] = indeksi[f]; nov[n++] = indeksi[f + 1]; nov[n++] = indeksi[f + 2]; }
  return nov;
}
