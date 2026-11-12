// Izbira z dotikom skozi prosojne plasti (docs/3d.md »Picking«): zadetki so urejeni po razdalji (kit.zadetki).
// Prosojne (koža, ovojnica, rentgen, steklo) preskočimo, dokler je za njimi neprosojen zadetek; če so vsi prosojni,
// velja prvi (tap samo na prosojno plast izbere to plast). Brez uvozov, da ga preizkus naloži v Node.

// Material zadetka (pri več materialih tisti iz skupine zadete ploskve) je skoraj prozoren.
export function prosojenZadetek(h) {
  const mat = h?.object?.material;
  const m = Array.isArray(mat) ? mat[h.face?.materialIndex ?? 0] : mat;
  return !!m && m.transparent === true && m.opacity < 0.5;
}

export function prviNeprosojen(zadetki, prosojen = prosojenZadetek) {
  return zadetki.find((h) => !prosojen(h)) || zadetki[0] || null;
}
