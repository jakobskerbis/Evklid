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
// Zasebnost (pregled #560): posnetek se pokaže le, ko je znano, da je na napravi isti račun (a = »evklid.offline.owner«
// ob shranjevanju) in isti odklenjen profil (seznam profilov na napravi ga ima brez »locked«). Profil z geslom (z: 1)
// lahko zaklene druga naprava (novo geslo profila, »Odjavi vse druge naprave«), zato zanj najprej okostje, posnetek
// šele po odgovoru /api/students (brez povezave: po seznamu na napravi). HTML posnetka gre pred vstavitvijo skozi
// čiščenje (DOMPurify ob shranjevanju, ociscen() tukaj) in se razčleni v <template> (nič se ne zažene ali naloži).
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
  var pozabljen = false;
  function pozabi() {
    pozabljen = true;
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
  var OWNER = "evklid.offline.owner";
  // Lokalno stanje potrjuje isti račun in isti odklenjen profil: lastnik naprave je isti kot ob shranjevanju, seznam
  // profilov na napravi (public/offline.js saveStudents) pa ima ta profil brez zaklepa. Brez računov (lastnika ni) velja.
  function lokalnoOdklenjen(p, sid) {
    var owner = localStorage.getItem(OWNER);
    if ((p.a == null ? null : String(p.a)) !== owner) return false;
    if (owner === null) return true;
    var list;
    try {
      list = JSON.parse(localStorage.getItem("evklid.offline.students") || "null");
    } catch (e) {
      return false;
    }
    return seznamOdklenjen(list, sid);
  }
  function seznamOdklenjen(list, sid) {
    if (!Array.isArray(list)) return false;
    for (var i = 0; i < list.length; i++) if (list[i] && String(list[i].id) === sid) return !list[i].locked && !list[i].needs_password;
    return false;
  }
  // Čiščenje posnetka pred vstavitvijo (DOMPurify ob shranjevanju je prvi korak; ta še enkrat, brez knjižnice, ker
  // DOMPurify ob zagonu še ni naložen): razčlenitev v <template> (skripti se ne zaženejo, slike se ne naložijo),
  // brez nevarnih elementov, dogodkov (on…) in naslovov drugih izvorov ali shem (javascript:, data: razen slik).
  var NEVARNI = "script,iframe,frame,frameset,object,embed,applet,base,link,meta,style,template,noscript,portal,dialog";
  var NASLOVI = /^(href|src|srcset|action|formaction|xlink:href|poster|background|ping|lowsrc|dynsrc|data|codebase|cite|manifest)$/i;
  function varenNaslov(val) {
    var v = String(val).replace(/[\u0000-\u0020]+/g, "");
    if (/^#/.test(v)) return true;
    if (/^data:image\/(png|jpe?g|gif|webp|avif);/i.test(v)) return true;
    try {
      var u = new URL(v, location.href);
      return (u.protocol === "http:" || u.protocol === "https:") && u.origin === location.origin;
    } catch (e) {
      return false;
    }
  }
  function ociscen(h) {
    var tpl = document.createElement("template");
    tpl.innerHTML = h;
    var c = tpl.content;
    var bad = c.querySelectorAll(NEVARNI);
    for (var i = 0; i < bad.length; i++) bad[i].remove();
    var all = c.querySelectorAll("*");
    for (var j = 0; j < all.length; j++) {
      var el = all[j];
      var at = el.attributes;
      for (var k = at.length - 1; k >= 0; k--) {
        var n = at[k].name;
        var val = at[k].value;
        if (/^on/i.test(n) || n.toLowerCase() === "srcdoc" || (NASLOVI.test(n) && (n.toLowerCase() === "srcset" || !varenNaslov(val))) || (n.toLowerCase() === "style" && /url\s*\(|expression|@import|javascript:/i.test(val)))
          el.removeAttribute(n);
      }
    }
    return document.importNode(c, true);
  }
  function pozabiKljuc() {
    try {
      localStorage.removeItem(POSNETEK);
    } catch (e) {}
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
    // Drug račun ali profil na napravi, zaklenjen ali neznan profil: posnetek ne velja in izgine.
    if (!lokalnoOdklenjen(p, sid)) {
      pozabiKljuc();
      return null;
    }
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
  // Okostje → posnetek (profil z geslom, ko strežnik potrdi, da ni zaklenjen). Samo, dokler zagon še teče.
  var nadgradi = null;
  function pokazi(v, pos, kasneje) {
    var m = null;
    var bar0 = null;
    function napolni(p) {
      m.className = p ? p.c : "view narrow zagon-okostje";
      if (p) m.id = "view-" + v;
      if (p) {
        m.textContent = "";
        m.appendChild(ociscen(p.h));
      } else m.innerHTML = OKOSTJE;
      // Notranji drsniki (npr. klepet na dnu), kot ob odhodu (učinek ima, ko je m že v strani: nadgradi).
      var zs = m.querySelectorAll("[data-zs]");
      for (var i = 0; i < zs.length; i++) zs[i].scrollTop = Number(zs[i].getAttribute("data-zs")) || 0;
    }
    function vstavi(pred) {
      if (!html.hasAttribute("data-zacetek")) return;
      if (!m) {
        m = document.createElement("main");
        m.setAttribute("data-posnetek", "");
        m.setAttribute("aria-hidden", "true");
        m.inert = true;
        napolni(pos);
      }
      pred.parentNode.insertBefore(m, pred);
      if (pos) {
        var zs = m.querySelectorAll("[data-zs]");
        for (var i = 0; i < zs.length; i++) zs[i].scrollTop = Number(zs[i].getAttribute("data-zs")) || 0;
      }
    }
    function oznaci(bar, p) {
      // Označen zavihek spodnje vrstice, kot ob odhodu.
      var tb = p && typeof p.tb === "string" && IME.test(p.tb) ? p.tb : "";
      var tabs = bar.querySelectorAll(".tab");
      for (var j = 0; tb && j < tabs.length; j++) tabs[j].classList.toggle("active", tabs[j].getAttribute("data-view") === tb);
      // Pasici nad pogledom (preizkusni način, testna različica), če sta bili vidni: vsebina se ob zamenjavi ne premakne.
      var b = p && Array.isArray(p.b) ? p.b : [];
      for (var k = 0; k < b.length; k++) {
        var el = b[k] === "mock-banner" || b[k] === "test-notice" ? document.getElementById(b[k]) : null;
        if (el) el.hidden = false;
      }
    }
    if (kasneje)
      nadgradi = function () {
        nadgradi = null;
        if (pozabljen || !m || !m.parentNode || !html.hasAttribute("data-zacetek") || html.hasAttribute("data-zacetek-pod")) return;
        napolni(kasneje);
        if (bar0) oznaci(bar0, kasneje);
      };
    koLupina(
      function (bar) {
        bar0 = bar;
        vstavi(bar);
        oznaci(bar, pos);
      },
      function () {
        var prvi = !m && document.querySelector("body > main");
        if (prvi) vstavi(prvi);
      }
    );
  }
  // Klici zagona vnaprej (samo GET, isti kot v app.js in account.js). Odgovor velja 15 s in samo enkrat.
  // Časovna omejitev ROK: počasna ali obvisela povezava vrne null (app.js nato pokliče običajno pot s svojo obravnavo).
  var pred = {};
  var predOd = Date.now();
  var ROK = 5000;
  function vnaprejZacni(url) {
    try {
      var ac = typeof AbortController === "function" ? new AbortController() : null;
      var rok = null;
      var cas = new Promise(function (res) {
        rok = setTimeout(function () {
          try {
            if (ac) ac.abort();
          } catch (e) {}
          res(null);
        }, ROK);
      });
      var klic = fetch(url, { headers: { "Content-Type": "application/json" }, signal: ac ? ac.signal : undefined })
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
      pred[url] = Promise.race([klic, cas]).then(function (x) {
        clearTimeout(rok);
        return x;
      });
    } catch (e) {}
    return pred[url] || null;
  }
  function vnaprej(url) {
    var p = pred[url];
    delete pred[url];
    return p && Date.now() - predOd < 15000 ? p : null;
  }
  window.evklidZacetek = { KEY: KEY, POSNETEK: POSNETEK, OWNER: OWNER, MAX: MAX, ROK: ROK, izberi: izberi, beri: beri, vnaprej: vnaprej, konec: konec, pozabi: pozabi, ociscen: ociscen };
  try {
    // Bližnjica z ikone (/?pogled=chat …) odpre drug pogled: tudi takrat Učna pot ne utripne.
    // Zapis drugega profila (»studentId« je izbrani profil na tej napravi) ne velja: app.js odpre Učno pot.
    var z = beri();
    var sid = localStorage.getItem("studentId");
    var moj = z && String(z.s) === sid;
    var q = new URLSearchParams(location.search).get("pogled");
    var v = q || (moj ? izberi(z, Date.now()) : "path");
    var pos = !q && sid && v && IME.test(v) ? posnetekZa(v, moj ? z : null, sid, Date.now()) : null;
    // Profil z geslom: zaklep se lahko spremeni na drugi napravi, zato najprej okostje, posnetek po potrditvi.
    var takoj = pos && !pos.z ? pos : null;
    if (v && IME.test(v) && (v !== "path" || pos)) {
      html.setAttribute("data-zacetek", v);
      // Varovalo: če se app.js ne naloži ali zagon obvisi, stran ne ostane prazna (ali pod posnetkom).
      setTimeout(konec, 8000);
      pokazi(v, takoj, pos && pos.z ? pos : null);
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
      Promise.all([stanje, profili]).then(function (r) {
        var s = r[0];
        var list = r[1];
        if (s && s.enabled && !s.logged_in) return pozabi();
        if (Array.isArray(list)) {
          if (!seznamOdklenjen(list, sid)) return pozabi();
          if (nadgradi) nadgradi();
          return;
        }
        // Brez odgovora (brez povezave, časovna omejitev): velja seznam profilov na napravi (preverjen v posnetekZa),
        // a samo brez odgovora strežnika o seji (napaka strežnika ali odjava → okostje ostane).
        if (s == null && nadgradi) nadgradi();
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
