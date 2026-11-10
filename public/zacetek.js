// Odprtje aplikacije na zadnjem zaslonu (j 2026-11-10): nameščena aplikacija (PWA, APK) in zavihek brskalnika se
// odpreta tam, kjer je učenec končal; na Učno pot samo, če je od zadnjega obiska minilo VEČ kot 12 ur.
// Navaden skript v <head> (kot theme.js): odločitev pade pred prvim izrisom, zato Učna pot iz index.html ne utripne,
// preden app.js odpre zadnji zaslon. Zapis »evklid.zadnji-zaslon« = { v: pogled, t: čas (ms), s: id profila,
// l: odprta lekcija Učbenika, p: odprta tema }; piše ga app.js (rememberScreen) ob vsaki menjavi in ob skritju strani.
// html[data-zacetek] skrije Učno pot (style.css), dokler app.js ne pokaže prvega pogleda (startDone ga odstrani).
// Hiter zagon (j 2026-11-10, docs/aplikacija.md): namesto praznega zaslona se takoj pokaže POSNETEK zadnjega zaslona
// (»evklid.zadnji-posnetek« = { v, s, t, l, p, c, tb, b, h: HTML pogleda }, piše ga public/posnetek.js), sicer okostje.
// Posnetek je samo slika (inert), vstavljena ZA prave poglede, da $("#…") v app.js najde prave elemente; app.js ju
// zamenja v istem izrisu (startDone). Velja za isti profil in zaslon, največ 12 ur; osebni ključ (PRIVATE_KEYS).
// Klici zagona stečejo že tukaj, vzporedno z moduli; app.js jih prevzame z evklidZacetek.vnaprej(url).
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
  var POSNETEK = "evklid.zadnji-posnetek";
  var html = document.documentElement;
  // Konec zagona (app.js startDone, varovalo spodaj): oznaki in posnetek izginejo skupaj, v istem izrisu.
  function konec() {
    html.removeAttribute("data-zacetek");
    html.removeAttribute("data-zacetek-pod");
    var p = document.querySelectorAll("main[data-posnetek]");
    for (var i = 0; i < p.length; i++) p[i].remove();
  }
  // Posnetek s te naprave izgine (zaklenjen profil, seja ne velja več): prazno okostje namesto tujega zaslona.
  function pozabi() {
    try {
      localStorage.removeItem(POSNETEK);
    } catch (e) {}
    var p = document.querySelector("main[data-posnetek]:not(.zagon-okostje)");
    if (p) {
      p.removeAttribute("id");
      p.className = "view narrow zagon-okostje";
      p.innerHTML = OKOSTJE;
    }
  }
  var OKOSTJE = '<div class="card zo-a"></div><div class="card zo-b"></div><div class="card zo-b"></div>';
  // Posnetek za ta zagon: isti profil, isti pogled (lekcija, tema) kot zapis zadnjega zaslona, star največ 12 ur.
  function posnetekZa(v, zapis, sid, zdaj) {
    var p;
    try {
      p = JSON.parse(localStorage.getItem(POSNETEK) || "null");
    } catch (e) {
      return null;
    }
    if (!p || typeof p !== "object" || p.v !== v || String(p.s) !== sid || typeof p.h !== "string" || !p.h) return null;
    var t = Number(p.t);
    if (!isFinite(t) || zdaj - t > MAX || t - zdaj > 5 * 60 * 1000) return null;
    if (typeof p.c !== "string" || !/^[a-z0-9 _-]{0,80}$/i.test(p.c)) return null;
    if (v !== "path" && ((p.l || "") !== ((zapis && zapis.l) || "") || (p.p || "") !== ((zapis && zapis.p) || ""))) return null;
    return p;
  }
  // Ko je stran razčlenjena do spodnje vrstice (vsi pravi pogledi so pred njo), še pred prvim izrisom.
  // prej(): ob vsaki spremembi strani do takrat (brskalnik lahko prvič izriše že napol razčlenjeno stran).
  function koLupina(fn, prej) {
    var done = false;
    var mo = null;
    function poskusi() {
      var bar = document.getElementById("tabbar");
      if (done) return;
      if (!bar) return prej && prej();
      done = true;
      if (mo) mo.disconnect();
      fn(bar);
    }
    poskusi();
    if (done) return;
    if (typeof MutationObserver === "function") {
      mo = new MutationObserver(poskusi);
      mo.observe(html, { childList: true, subtree: true });
    }
    document.addEventListener("DOMContentLoaded", poskusi);
  }
  // Posnetek ali okostje: najprej pred prvi pogled (da ga vidi že prvi izris napol razčlenjene strani), ob koncu
  // razčlenjevanja pa za prave poglede, pred spodnjo vrstico (moduli aplikacije stečejo šele po tem).
  function pokazi(v, pos) {
    var m = null;
    function vstavi(pred) {
      if (!html.hasAttribute("data-zacetek")) return;
      if (!m) {
        m = document.createElement("main");
        m.className = pos ? pos.c : "view narrow zagon-okostje";
        if (pos) m.id = "view-" + v;
        m.setAttribute("data-posnetek", "");
        m.setAttribute("aria-hidden", "true");
        m.inert = true;
        m.innerHTML = pos ? pos.h : OKOSTJE;
      }
      pred.parentNode.insertBefore(m, pred);
      // Notranji drsniki (npr. klepet na dnu), kot ob odhodu.
      var zs = m.querySelectorAll("[data-zs]");
      for (var i = 0; i < zs.length; i++) zs[i].scrollTop = Number(zs[i].getAttribute("data-zs")) || 0;
    }
    koLupina(
      function (bar) {
        vstavi(bar);
        // Označen zavihek spodnje vrstice, kot ob odhodu.
        var tb = pos && typeof pos.tb === "string" && IME.test(pos.tb) ? pos.tb : "";
        var tabs = bar.querySelectorAll(".tab");
        for (var j = 0; tb && j < tabs.length; j++) tabs[j].classList.toggle("active", tabs[j].getAttribute("data-view") === tb);
        // Pasici nad pogledom (preizkusni način, testna različica), če sta bili vidni: vsebina se ob zamenjavi ne premakne.
        var b = pos && Array.isArray(pos.b) ? pos.b : [];
        for (var k = 0; k < b.length; k++) {
          var el = b[k] === "mock-banner" || b[k] === "test-notice" ? document.getElementById(b[k]) : null;
          if (el) el.hidden = false;
        }
      },
      function () {
        var prvi = !m && document.querySelector("body > main");
        if (prvi) vstavi(prvi);
      }
    );
  }
  // Klici zagona vnaprej (samo GET, isti kot v app.js in account.js). Odgovor velja 15 s in samo enkrat.
  var pred = {};
  var predOd = Date.now();
  function vnaprejZacni(url) {
    try {
      pred[url] = fetch(url, { headers: { "Content-Type": "application/json" } })
        .then(function (r) {
          if (r.ok) return r.json();
          // telo napake zavržemo (neprebrano bi zahtevo držalo odprto, public/odgovor.js)
          try {
            r.body.cancel().catch(function () {});
          } catch (e) {}
          return null;
        })
        .catch(function () {
          return null;
        });
    } catch (e) {}
    return pred[url] || null;
  }
  function vnaprej(url) {
    var p = pred[url];
    delete pred[url];
    return p && Date.now() - predOd < 15000 ? p : null;
  }
  window.evklidZacetek = { KEY: KEY, POSNETEK: POSNETEK, MAX: MAX, izberi: izberi, beri: beri, vnaprej: vnaprej, konec: konec, pozabi: pozabi };
  try {
    // Bližnjica z ikone (/?pogled=chat …) odpre drug pogled: tudi takrat Učna pot ne utripne.
    // Zapis drugega profila (»studentId« je izbrani profil na tej napravi) ne velja: app.js odpre Učno pot.
    var z = beri();
    var sid = localStorage.getItem("studentId");
    var moj = z && String(z.s) === sid;
    var q = new URLSearchParams(location.search).get("pogled");
    var v = q || (moj ? izberi(z, Date.now()) : "path");
    var pos = !q && sid && v && IME.test(v) ? posnetekZa(v, moj ? z : null, sid, Date.now()) : null;
    if (v && IME.test(v) && (v !== "path" || pos)) {
      html.setAttribute("data-zacetek", v);
      // Varovalo: če se app.js ne naloži ali zagon obvisi, stran ne ostane prazna (ali pod posnetkom).
      setTimeout(konec, 8000);
      pokazi(v, pos);
    }
    var stanje = vnaprejZacni("/api/account/status");
    vnaprejZacni("/api/config");
    // Profili in pogovori samo, ko je na napravi izbran profil (ob odjavi se »studentId« pobriše).
    var profili = sid && /^\d+$/.test(sid) ? vnaprejZacni("/api/students") : null;
    if (profili) vnaprejZacni("/api/students/" + sid + "/conversations");
    // Zasebnost: seja ne velja več ali profil je zaklenjen (ali ga ni več) → posnetek izgine, še preden se app.js zažene.
    if (pos && stanje)
      stanje.then(function (s) {
        if (s && s.enabled && !s.logged_in) pozabi();
      });
    if (pos && profili)
      profili.then(function (list) {
        if (!Array.isArray(list)) return;
        for (var i = 0; i < list.length; i++) if (String(list[i].id) === sid && !list[i].locked) return;
        pozabi();
      });
  } catch (e) {}
  // Aplikacija (APK, mobile/src/app/web.tsx) drži svoj zagonski zaslon, dokler stran ne izriše prve vsebine
  // (lupina s posnetkom, okostjem ali Učno potjo): sporočilo »izris« po prvem izrisu.
  try {
    koLupina(function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          window.evklidZacetek.izris = Date.now();
          try {
            if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({ t: "izris" }));
          } catch (e) {}
        });
      });
    });
  } catch (e) {}
})();
