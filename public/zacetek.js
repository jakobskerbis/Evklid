// Odprtje aplikacije na zadnjem zaslonu (j 2026-11-10): nameščena aplikacija (PWA, APK) in zavihek brskalnika se
// odpreta tam, kjer je učenec končal; na Učno pot samo, če je od zadnjega obiska minilo VEČ kot 12 ur.
// Navaden skript v <head> (kot theme.js): odločitev pade pred prvim izrisom, zato Učna pot iz index.html ne utripne,
// preden app.js odpre zadnji zaslon. Zapis »evklid.zadnji-zaslon« = { v: pogled, t: čas (ms), s: id profila,
// l: odprta lekcija Učbenika, p: odprta tema }; piše ga app.js (rememberScreen) ob vsaki menjavi in ob skritju strani.
// html[data-zacetek] skrije Učno pot (style.css), dokler app.js ne pokaže prvega pogleda (startDone ga odstrani).
(function () {
  var KEY = "evklid.zadnji-zaslon";
  var MAX = 12 * 60 * 60 * 1000;
  var IME = /^[a-z][a-z0-9-]{0,30}$/;
  // Pogled, ki naj se odpre: zadnji (≤ 12 ur) ali "path". Zapis iz prihodnosti (ura telefona prestavljena) ne velja.
  function izberi(zapis, zdaj) {
    if (!zapis || typeof zapis !== "object" || typeof zapis.v !== "string" || !IME.test(zapis.v)) return "path";
    var t = Number(zapis.t);
    if (!isFinite(t) || zdaj - t > MAX || t - zdaj > 5 * 60 * 1000) return "path";
    return zapis.v;
  }
  function beri() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (e) {
      return null;
    }
  }
  window.evklidZacetek = { KEY: KEY, MAX: MAX, izberi: izberi, beri: beri };
  try {
    // Bližnjica z ikone (/?pogled=chat …) odpre drug pogled: tudi takrat Učna pot ne utripne.
    // Zapis drugega profila (»studentId« je izbrani profil na tej napravi) ne velja: app.js odpre Učno pot.
    var z = beri();
    var moj = z && String(z.s) === localStorage.getItem("studentId");
    var v = new URLSearchParams(location.search).get("pogled") || (moj ? izberi(z, Date.now()) : "path");
    if (v && v !== "path" && IME.test(v)) document.documentElement.setAttribute("data-zacetek", v);
  } catch (e) {}
})();
