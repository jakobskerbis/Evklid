// Stran /3d, pred moduli: jezik iz naslova (?lang=xx, mobilna aplikacija) za i18n.js. Navaden skript (brez modulov).
(function () {
  var lang = new URLSearchParams(location.search).get("lang");
  if (lang && /^[a-zA-Z-]{2,10}$/.test(lang)) {
    try {
      localStorage.setItem("evklid.lang", lang);
    } catch (e) {}
  }
})();

// Odmik za uro zgoraj in gumbe spodaj (»Brez praznih robov«, docs/oblikovanje.md): 3d.css ga piše kot
// var(--varno-zg/--varno-sp, env(safe-area-inset-*)). Na 0 ga postavimo, kadar prostor pusti že nekdo drug:
// aplikacija (User-Agent » EvklidApp/«, mobile/src/app/web.tsx; kot theme.js na glavni strani, ki ga /3d ne naloži)
// in okvir »Uči se« → 3D svet (?vgrajeno, public/uci.css .uci-3d-full ima odmik sam). Brez tega bi bil pas dvojen.
(function () {
  try {
    var vgrajeno = window.parent !== window && new URLSearchParams(location.search).has("vgrajeno");
    if (!/ EvklidApp\//.test(navigator.userAgent) && !vgrajeno) return;
    var r = document.documentElement;
    r.style.setProperty("--varno-zg", "0px");
    r.style.setProperty("--varno-sp", "0px");
  } catch (e) {}
})();
