// Izbira z dotikom skozi »lupino« (docs/3d.md »Picking«): zadetki so urejeni po razdalji (kit.zadetki). Zadetke,
// ki so lupina (privzeto: material z userData.skozi = true; atlas: koža), preskočimo, dokler je za njimi del, ki ni
// lupina; če so vsi lupina, velja prvi. Vrne izbrani zadetek in preskočene pred njim (najbližji prvi), da drugi tap
// na isto mesto doseže lupino in da kviz šteje tudi lupino, skozi katero je učenec tapnil.
// Brez uvozov, da ga preizkus naloži v Node.

export function jeLupina(h) {
  const mat = h?.object?.material;
  const m = Array.isArray(mat) ? mat[h.face?.materialIndex ?? 0] : mat;
  return m?.userData?.skozi === true;
}

export function skoziLupino(zadetki, lupina = jeLupina) {
  const i = zadetki.findIndex((h) => !lupina(h));
  if (i < 0) return { zadetek: zadetki[0] || null, spredaj: [] };
  return { zadetek: zadetki[i], spredaj: zadetki.slice(0, i) };
}
