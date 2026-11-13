// Stran /kalkulator, pred moduli: tema (?theme=dark|light, sicer nastavitev naprave) in jezik (?lang=xx)
// iz naslova, ki ga sestavi mobilna aplikacija. Navaden skript, da ni bliska svetle strani v temnem načinu.
(function () {
  var q = new URLSearchParams(location.search);
  var theme = q.get("theme");
  var dark = theme ? theme === "dark" : !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  // i18n.js prebere izbrani jezik iz shrambe naprave (WebView ima svojo).
  var lang = q.get("lang");
  if (lang && /^[a-zA-Z-]{2,10}$/.test(lang)) {
    try {
      localStorage.setItem("evklid.lang", lang);
    } catch (e) {}
  }
})();
