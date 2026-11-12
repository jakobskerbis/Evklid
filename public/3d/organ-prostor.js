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
