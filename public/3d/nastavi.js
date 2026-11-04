// Stran /3d, pred moduli: jezik iz naslova (?lang=xx, mobilna aplikacija) za i18n.js. Navaden skript (brez modulov).
(function () {
  var lang = new URLSearchParams(location.search).get("lang");
  if (lang && /^[a-zA-Z-]{2,10}$/.test(lang)) {
    try {
      localStorage.setItem("evklid.lang", lang);
    } catch (e) {}
  }
})();
