// Pomožne funkcije za `done(c)` vodenih poskusov (lab-vodeno-koraki.js in public/sim/vodeno/*.js).
// Brez DOM: berejo le kontekst iz lab-vodeno.js → kontekst().

// Število iz celice ali nastavitve (decimalna vejica, enota za številom).
export const stevilo = (s) => {
  const m = String(s ?? "").replace(/−/g, "-").match(/-?\d+(?:[.,]\d+)?/);
  return m ? Number(m[0].replace(",", ".")) : NaN;
};
// Vrednost stolpca, katerega glava se ujema z `re` (npr. /^h\b/ za »h [m]«).
export const celica = (vrstica, re) => {
  for (const [k, v] of Object.entries(vrstica || {})) if (re.test(k)) return v;
  return "";
};
// Vrstice, pri katerih se stolpec `re` ujema z `vrednost` (regularni izraz).
export const kjer = (c, re, vrednost) => c.vrstice.filter((r) => vrednost.test(celica(r, re)));
// Različne vrednosti (zaokrožene na `d` decimalk) v stolpcu.
export const razlicne = (vrstice, re, d = 2) => new Set(vrstice.map((r) => stevilo(celica(r, re))).filter(Number.isFinite).map((x) => x.toFixed(d)));
// Najmanj dve titraciji istega vzorca se ujemata na 0,10 mL (kot »Ujemanje« v lab-titracija.js → concordant).
export function ujemanje(vrstice) {
  const po = new Map();
  for (const r of vrstice) {
    const V = stevilo(celica(r, /^V\b/));
    if (!Number.isFinite(V)) continue;
    const k = celica(r, /^vzorec/);
    po.set(k, [...(po.get(k) || []), V]);
  }
  for (const V of po.values()) for (const a of V) if (V.filter((b) => b >= a - 1e-9 && b <= a + 0.1 + 1e-9).length >= 2) return true;
  return false;
}
