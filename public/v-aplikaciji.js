// Javne strani brez theme.js (Za starše, Za šole, Zasebnost; videz po napravi): v aplikaciji za Android/iOS enako kot
// theme.js označi stran in odstrani dvojni odmik za uro in gumbe (j 2026-11-04). Mora se ujemati s theme.js.
(function () {
  try {
    if (!/ EvklidApp\//.test(navigator.userAgent)) return;
    const r = document.documentElement;
    r.classList.add("v-aplikaciji");
    r.style.setProperty("--varno-zg", "0px");
    r.style.setProperty("--varno-sp", "0px");
    // Aplikacija iz trgovine (»EvklidApp/<različica> store«, public/pay-ui.js isStoreApp): brez povezav na cene in
    // na prenos APK mimo trgovine (pravila trgovin).
    if (/ EvklidApp\/\S+ store\b/.test(navigator.userAgent)) {
      r.classList.add("v-trgovini");
      const st = document.createElement("style");
      st.textContent = '.v-trgovini a[href*="#cene"],.v-trgovini a[href^="/prenesi"]{display:none!important}';
      document.head.appendChild(st);
    }
  } catch {}
})();
