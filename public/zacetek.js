// Zagon na zadnjem zaslonu in hiter zagon s posnetkom (j 2026-11-10; podrobno docs/aplikacija.md, pregled #560).
// Navaden skript v <head>: pred prvim izrisom izbere pogled (zapis »evklid.zadnji-zaslon« { v, t, s, l, p }, app.js
// rememberScreen) in vstavi posnetek zadnjega zaslona (»evklid.zadnji-posnetek«, public/posnetek.js) ali okostje, kot
// sliko (inert) za pravimi pogledi; app.js ga zamenja (startDone). Posnetek: isti račun in odklenjen profil, ≤ 12 ur,
// isti jezik (g) in različica (r); klepet ga nima. Klice zagona začne vnaprej (evklidZacetek.vnaprej).
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
  // Posnetek izgine (zaklep, seja ne velja, clearPrivate); zaprto: app.js do znova() ne zapiše nič (A2, A3).
  var pozabljen = false;
  var zaprto = false;
  function pozabi() {
    pozabljen = true;
    zaprto = true;
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
  function lahkoShrani() {
    return !zaprto;
  }
  function znova() {
    zaprto = false;
  }
  var OWNER = "evklid.offline.owner";
  var JEZIK = "evklid.lang"; // public/i18n.js
  function jezik() {
    try {
      return localStorage.getItem(JEZIK) || "";
    } catch (e) {
      return "";
    }
  }
  // Meta je na koncu <head> (server/vstopna-stran.js): beremo šele ob vstavitvi.
  function razlicica() {
    var m = document.querySelector('meta[name="evklid-app"]');
    return (m && m.getAttribute("content")) || "";
  }
  // Isti lastnik naprave kot ob shranjevanju in profil na seznamu naprave brez zaklepa (brez računov: velja).
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
  // Drugo čiščenje (prvo: DOMPurify ob shranjevanju): <template>, brez nevarnih elementov, on…, tujih naslovov.
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
  // Posnetek za ta zagon: isti profil, pogled, lekcija in tema, ≤ 12 ur.
  function posnetekZa(v, zapis, sid, zdaj) {
    var p;
    try {
      p = JSON.parse(localStorage.getItem(POSNETEK) || "null");
    } catch (e) {
      return null;
    }
    if (v === "chat") {
      pozabiKljuc(); // klepet posnetka nima (zasebnost); star zapis izgine
      return null;
    }
    if (!p || typeof p !== "object" || p.v !== v || String(p.s) !== sid || typeof p.h !== "string" || !p.h) return null;
    var t = Number(p.t);
    if (!isFinite(t) || zdaj - t > MAX || t - zdaj > 5 * 60 * 1000) return null;
    if (typeof p.c !== "string" || !/^[a-z0-9 _-]{0,80}$/i.test(p.c)) return null;
    if ((p.g || "") !== jezik()) return null; // drug jezik vmesnika (menjava jezika osveži stran)
    if (v !== "path" && ((p.l || "") !== ((zapis && zapis.l) || "") || (p.p || "") !== ((zapis && zapis.p) || ""))) return null;
    if (!lokalnoOdklenjen(p, sid)) {
      pozabiKljuc();
      return null;
    }
    return p;
  }
  // fn, ko je razčlenjena spodnja vrstica (za vsemi pogledi); prej(): ob spremembah do takrat (napol razčlenjena stran).
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
  // Najprej pred prvi pogled, nato pred spodnjo vrstico. kasneje: profil z geslom, po potrditvi strežnika (nadgradi).
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
      var zs = m.querySelectorAll("[data-zs]");
      for (var i = 0; i < zs.length; i++) zs[i].scrollTop = Number(zs[i].getAttribute("data-zs")) || 0;
    }
    function vstavi(pred) {
      if (!html.hasAttribute("data-zacetek")) return;
      if (!m) {
        var r = razlicica();
        if (pos && (pos.r || "") !== r) pos = null;
        if (kasneje && (kasneje.r || "") !== r) kasneje = null;
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
      // Pasici nad pogledom, če sta bili vidni.
      var b = p && Array.isArray(p.b) ? p.b : [];
      for (var k = 0; k < b.length; k++) {
        var el = b[k] === "mock-banner" || b[k] === "test-notice" ? document.getElementById(b[k]) : null;
        if (el) el.hidden = false;
      }
    }
    if (kasneje)
      nadgradi = function () {
        nadgradi = null;
        if (!kasneje || pozabljen || !m || !m.parentNode || !html.hasAttribute("data-zacetek") || html.hasAttribute("data-zacetek-pod")) return;
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
  // Klici zagona vnaprej (GET), veljajo 15 s, enkrat. Brez roka: app.js prevzame klic, ki še teče (B2); neuspeh → null.
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
  window.evklidZacetek = { KEY: KEY, POSNETEK: POSNETEK, OWNER: OWNER, MAX: MAX, JEZIK: JEZIK, izberi: izberi, beri: beri, vnaprej: vnaprej, konec: konec, pozabi: pozabi, lahkoShrani: lahkoShrani, znova: znova, ociscen: ociscen };
  try {
    // Bližnjica z ikone (/?pogled=chat) tudi; zapis drugega profila (»studentId«) ne velja.
    var z = beri();
    var sid = localStorage.getItem("studentId");
    var moj = z && String(z.s) === sid;
    var q = new URLSearchParams(location.search).get("pogled");
    var v = q || (moj ? izberi(z, Date.now()) : "path");
    var pos = !q && sid && v && IME.test(v) ? posnetekZa(v, moj ? z : null, sid, Date.now()) : null;
    var takoj = pos && !pos.z ? pos : null;
    if (v && IME.test(v) && (v !== "path" || pos)) {
      html.setAttribute("data-zacetek", v);
      // Varovalo, če app.js obvisi.
      setTimeout(konec, 8000);
      pokazi(v, takoj, pos && pos.z ? pos : null);
    }
    var stanje = vnaprejZacni("/api/account/status");
    vnaprejZacni("/api/config");
    var profili = sid && /^\d+$/.test(sid) ? vnaprejZacni("/api/students") : null;
    if (profili) vnaprejZacni("/api/students/" + sid + "/conversations");
    // Seja ne velja ali profil je zaklenjen → posnetek izgine že pred app.js.
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
        // Brez povezave velja seznam na napravi, a le brez odgovora o seji.
        if (s == null && nadgradi) nadgradi();
      });
  } catch (e) {}
  // APK (mobile/src/app/web.tsx) drži zagonski zaslon do sporočila »izris« po prvem izrisu.
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
