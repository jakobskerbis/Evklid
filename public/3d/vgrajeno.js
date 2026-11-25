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
// kontekst: { v, sourceType: "atlas" | "model3d", sourceId, selectedObject } za skrit kontekst (server/ucni-kontekst.js).
export function vprasajInstruktorja(besedilo, { vrni = "", oznaka = "", kontekst = null } = {}) {
  if (vgrajeno) {
    starsu({ tip: "vprasaj", besedilo, vrni, oznaka, kontekst });
    return;
  }
  if (window.ReactNativeWebView?.postMessage) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ tip: "vprasaj", besedilo }));
    return;
  }
  location.href = `/?pogled=chat&vprasaj=${encodeURIComponent(besedilo)}`;
}

// Okvir je pripravljen (stran /3d je pokazala zbirko, model ali atlas) ali je pokazal napako: starš (uci-se.js) skrije
// oziroma pokaže svoj gumb »Zapri« (cuvaj3d). Brez okvirja nič.
export function javiStarsu(tip) {
  if (vgrajeno) starsu({ tip });
}

// Starš: okvir s stranjo /3d prekrije cel zaslon in ima svoj »Nazaj« šele, ko se stran naloži. Če se v `cas` ms ne
// oglasi (»pripravljen« ali »napaka«; počasna povezava, star brskalnik, napaka pred prvim izrisom), čez okvir pokažemo
// kratko sporočilo in gumb »Zapri«, da učenec ni ujet. Ob »napaka« samo gumb (okvir sam pove, kaj je narobe).
// Videz: public/uci.css .uci-3d-zastoj. Vrne { pripravljen, napaka, ustavi }.
export function cuvaj3d(el, { zapri, t, cas = 8000 } = {}) {
  let plast = null;
  const pokazi = (besedilo) => {
    if (plast || !el.isConnected) return;
    plast = document.createElement("div");
    plast.className = "uci-3d-zastoj";
    plast.setAttribute("role", "alert");
    if (besedilo) {
      const p = document.createElement("p");
      p.textContent = t("a3.slow");
      plast.append(p);
    }
    const b = document.createElement("button");
    b.type = "button";
    b.className = "secondary";
    b.textContent = t("a3.close");
    b.addEventListener("click", () => zapri());
    plast.append(b);
    el.append(plast);
  };
  const rok = setTimeout(() => pokazi(true), cas);
  return {
    pripravljen() {
      clearTimeout(rok);
      plast?.remove();
      plast = null;
    },
    napaka() {
      clearTimeout(rok);
      pokazi(false);
    },
    ustavi: () => clearTimeout(rok),
  };
}
