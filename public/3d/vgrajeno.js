// Stran /3d v okvirju aplikacije (»Uči se« → 3D svet, public/uci-se.js): naslov ima ?vgrajeno=1, starš je na istem
// izvoru. Takrat »Nazaj« na prvem zaslonu in »Vprašaj inštruktorja« pošljeta sporočilo staršu (zapre okvir ali odpre
// klepet), namesto da bi stran zamenjala sebe.
export const vgrajeno = (() => {
  try {
    return window.parent !== window && new URLSearchParams(location.search).has("vgrajeno") && window.parent.location.origin === location.origin;
  } catch {
    return false; // drug izvor: dostop do parent.location ni dovoljen
  }
})();

export function starsu(sporocilo) {
  window.parent.postMessage(sporocilo, location.origin);
}
