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

// »Vprašaj inštruktorja« iz atlasa ali modela. V okvirju aplikacije gre sporočilo staršu (zapre okvir, odpre klepet
// z vpisanim vprašanjem); vrni je naslov tega pogleda (»atlas?izberi=…«, »<id>?del=…«), da vrnitev iz klepeta odpre
// isti model in del, oznaka pa ime na gumbu »Nazaj na: …«. V aplikaciji (WebView) sporočilo aplikaciji, na spletu
// klepet z vnaprej vpisanim vprašanjem (Nazaj v brskalniku vrne sem).
export function vprasajInstruktorja(besedilo, { vrni = "", oznaka = "" } = {}) {
  if (vgrajeno) {
    starsu({ tip: "vprasaj", besedilo, vrni, oznaka });
    return;
  }
  if (window.ReactNativeWebView?.postMessage) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ tip: "vprasaj", besedilo }));
    return;
  }
  location.href = `/?pogled=chat&vprasaj=${encodeURIComponent(besedilo)}`;
}
