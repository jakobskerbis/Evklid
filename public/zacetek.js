// Zagon na zadnjem zaslonu in hiter zagon s posnetkom (j 2026-11-10). Navaden skript v <head>, pred prvim izrisom.
// Opis (zapisi, zasebnost, čiščenje, klici vnaprej): docs/aplikacija.md »Hiter zagon«; brez komentarjev zaradi velikosti.
(function () {
  var KEY = "evklid.zadnji-zaslon";
  var MAX = 12 * 60 * 60 * 1000;
  var IME = /^[a-z][a-z0-9-]{0,30}$/;
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
  var PRENOS = "evklid.posnetek-prenos";
  var prenos = false;
  try {
    prenos = sessionStorage.getItem(PRENOS) === "1";
    sessionStorage.removeItem(PRENOS);
  } catch (e) {}
  var html = document.documentElement;
  var prej = [];
  var slogiPoKoncu = false;
  function konec() {
    prej = [];
    if (slogiPoKoncu) {
      slogiPoKoncu = false;
      slogi(false, true);
    }
    html.removeAttribute("data-zacetek");
    html.removeAttribute("data-zacetek-pod");
    var p = document.querySelectorAll("main[data-posnetek]");
    for (var i = 0; i < p.length; i++) p[i].remove();
  }
  var pozabljen = false;
  var zaprto = false;
  function pozabi() {
    pozabljen = true;
    zaprto = true;
    for (var i = prej.length - 1; i >= 0; i--) {
      if (prej[i][0].textContent !== prej[i][4]) continue;
      prej[i][0].textContent = prej[i][1];
      if (prej[i][2]) prej[i][2].hidden = prej[i][3];
    }
    prej = [];
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
  function razlicica() {
    var m = document.querySelector('meta[name="evklid-app"]');
    return (m && m.getAttribute("content")) || "";
  }
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
  var OKOSTJE_POT = '<div class="zo-stran"><div class="zo-glava"><i></i><i></i><i></i></div><div class="card zo-xp"></div><div class="card zo-nacini"></div></div><div class="zo-vsebina"><div class="card zo-sklop"></div><div class="card zo-sklop"></div></div>';
  var okostjePot = false;
  function posnetekZa(v, zapis, sid, zdaj) {
    var p;
    try {
      p = JSON.parse(localStorage.getItem(POSNETEK) || "null");
    } catch (e) {
      return null;
    }
    if (v === "chat") {
      pozabiKljuc();
      return null;
    }
    if (!p || typeof p !== "object" || p.v !== v || String(p.s) !== sid || typeof p.h !== "string" || !p.h) return null;
    var t = Number(p.t);
    if (!isFinite(t) || zdaj - t > MAX || t - zdaj > 5 * 60 * 1000) {
      pozabiKljuc();
      return null;
    }
    if (typeof p.c !== "string" || !/^[a-z0-9 _-]{0,80}$/i.test(p.c)) return null;
    if ((p.g || "") !== jezik()) return null;
    if (v !== "path" && ((p.l || "") !== ((zapis && zapis.l) || "") || (p.p || "") !== ((zapis && zapis.p) || ""))) return null;
    if (!lokalnoOdklenjen(p, sid)) {
      pozabiKljuc();
      return null;
    }
    return p;
  }
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
  var nadgradi = null;
  function pokazi(v, pos, kasneje) {
    var m = null;
    var bar0 = null;
    function napolni(p) {
      var pot = !p && okostjePot && v === "path";
      m.className = p ? p.c : pot ? "view narrow zagon-okostje zo-pot" + (zp && zp.d["/api/students/" + zp.s + "/path"] && zp.d["/api/students/" + zp.s + "/path"].danes ? " zo-danes" : "") : "view narrow zagon-okostje";
      if (p) m.id = "view-" + v;
      if (p) {
        m.textContent = "";
        m.appendChild(ociscen(p.h));
      } else m.innerHTML = pot ? OKOSTJE_POT : OKOSTJE;
      var zs = m.querySelectorAll("[data-zs]");
      for (var i = 0; i < zs.length; i++) zs[i].scrollTop = Number(zs[i].getAttribute("data-zs")) || 0;
    }
    function vstavi(pred) {
      if (!html.hasAttribute("data-zacetek")) return;
      if (!m) {
        var r = razlicica();
        if (pos && !prenos && (pos.r || "") !== r) pos = null;
        if (kasneje && !prenos && (kasneje.r || "") !== r) kasneje = null;
        m = document.createElement("main");
        m.setAttribute("data-posnetek", "");
        m.setAttribute("aria-hidden", "true");
        m.inert = true;
        if (pozabljen) pos = kasneje = null;
        napolni(pos);
      }
      pred.parentNode.insertBefore(m, pred);
      if (pos) {
        var zs = m.querySelectorAll("[data-zs]");
        for (var i = 0; i < zs.length; i++) zs[i].scrollTop = Number(zs[i].getAttribute("data-zs")) || 0;
      }
    }
    var glavaZa = null;
    function oznaci(bar, p) {
      var tb = p && typeof p.tb === "string" && IME.test(p.tb) ? p.tb : "";
      var tabs = bar ? bar.querySelectorAll(".tab") : [];
      for (var j = 0; tb && j < tabs.length; j++) tabs[j].classList.toggle("active", tabs[j].getAttribute("data-view") === tb);
      if (!p || glavaZa === p || pozabljen) return;
      glavaZa = p;
      var b = p && Array.isArray(p.b) ? p.b : [];
      for (var k = 0; k < b.length; k++) {
        var el = b[k] === "mock-banner" || b[k] === "test-notice" ? document.getElementById(b[k]) : null;
        if (el) el.hidden = false;
      }
      var hd = p && p.hd && typeof p.hd === "object" ? p.hd : null;
      if (hd) {
        if (new Date(Number(p.t)).toDateString() === new Date().toDateString()) glava("#usage-meter", "#usage-meter b", hd.u, true);
        glava(null, "#xp-total", hd.x);
        glava(null, "#xp-streak", hd.k);
        glava("#goal-chip", "#goal-chip b", hd.c, true);
        glava(null, "#profile-btn .pm-avatar", hd.i);
        glava(null, "#profile-btn .pm-name", hd.n);
      }
    }
    function glava(skrit, sel, val, prikazi) {
      if (typeof val !== "string" || !val || val.length > 60) return;
      var el = document.querySelector(sel);
      if (!el) return;
      var s = prikazi ? document.querySelector(skrit) : null;
      prej.push([el, el.textContent, s, s && s.hidden, val]);
      el.textContent = val;
      if (s) s.hidden = false;
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
        if (prvi) oznaci(null, pos);
      }
    );
  }
  var pred = {};
  var predOd = Date.now();
  var seme = {};
  var semeDo = 0;
  function izSemena(url) {
    if (!Object.prototype.hasOwnProperty.call(seme, url) || Date.now() > semeDo) return null;
    try {
      return Promise.resolve(JSON.parse(seme[url]));
    } catch (e) {
      return null;
    }
  }
  function pozabiVnaprej() {
    seme = {};
  }
  function vnaprejZacni(url) {
    var s0 = izSemena(url);
    if (s0) return s0;
    try {
      pred[url] = fetch(url, { headers: { "Content-Type": "application/json" } })
        .then(function (r) {
          if (r.ok) return r.json();
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
    var s0 = izSemena(url);
    if (s0) return s0;
    var p = pred[url];
    delete pred[url];
    return p && Date.now() - predOd < 15000 ? p : null;
  }
  function zacetni() {
    try {
      var el = document.getElementById("evklid-zacetni");
      if (!el) return null;
      el.parentNode.removeChild(el);
      var z = JSON.parse(el.textContent || "null");
      if (!z || typeof z !== "object" || !z.d || typeof z.d !== "object") return null;
      for (var u in z.d) if (Object.prototype.hasOwnProperty.call(z.d, u) && /^\/api\//.test(u) && z.d[u] != null) seme[u] = JSON.stringify(z.d[u]);
      semeDo = Date.now() + 60000;
      var f0 = window.fetch;
      if (typeof f0 === "function")
        window.fetch = function (u, o) {
          try {
            var m = String((o && o.method) || (u && typeof u === "object" && u.method) || "GET").toUpperCase();
            if (m !== "GET" && m !== "HEAD") pozabiVnaprej();
          } catch (e) {}
          return f0.apply(this, arguments);
        };
      return z;
    } catch (e) {
      return null;
    }
  }
  var zp = zacetni();
  function pasovi(mock, tn) {
    var zaprto = null;
    try {
      zaprto = localStorage.getItem("evklid.testnaVerzija");
    } catch (e) {}
    var ids = [mock ? "mock-banner" : "", tn && zaprto !== tn ? "test-notice" : ""];
    for (var j = 0; j < ids.length; j++) {
      var el = ids[j] && document.getElementById(ids[j]);
      if (el) el.hidden = false;
    }
  }
  window.evklidZacetek = { KEY: KEY, POSNETEK: POSNETEK, PRENOS: PRENOS, OWNER: OWNER, MAX: MAX, JEZIK: JEZIK, izberi: izberi, beri: beri, vnaprej: vnaprej, pozabiVnaprej: pozabiVnaprej, konec: konec, pozabi: pozabi, lahkoShrani: lahkoShrani, znova: znova, ociscen: ociscen };
  try {
    var z = beri();
    var sid = localStorage.getItem("studentId");
    var moj = z && String(z.s) === sid;
    var q = new URLSearchParams(location.search).get("pogled");
    var v = q || (moj ? izberi(z, Date.now()) : "path");
    var pos = !q && sid && v && IME.test(v) ? posnetekZa(v, moj ? z : null, sid, Date.now()) : null;
    var takoj = pos && !pos.z ? pos : null;
    okostjePot = !!(zp && zp.s != null && v === "path" && !pos);
    if (v && IME.test(v) && (v !== "path" || pos || okostjePot)) {
      slogiPoKoncu = !!zp && v === "path";
      html.setAttribute("data-zacetek", v);
      setTimeout(konec, okostjePot ? 20000 : 8000);
      pokazi(v, takoj, pos && pos.z ? pos : null);
    }
    var cfg = zp && zp.d["/api/config"];
    if (cfg && typeof cfg === "object")
      koLupina(function () {
        pasovi(!!cfg.mock, Array.isArray(cfg.test_notice) ? cfg.test_notice.join(",") : "");
      });
    if (cfg && cfg.admin) vnaprejZacni("/api/usage");
    var stanje = vnaprejZacni("/api/account/status");
    vnaprejZacni("/api/config");
    var profili = sid && /^\d+$/.test(sid) ? vnaprejZacni("/api/students") : null;
    if (profili) vnaprejZacni("/api/students/" + sid + "/conversations");
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
        if (s == null && nadgradi) nadgradi();
      });
  } catch (e) {}
  function pristajalnaVelja(pm) {
    if (location.hash) return false;
    var q = location.search.replace(/^\?/, "").split("&");
    for (var i = 0; i < q.length; i++) if (q[i] && !/^(utm_[a-z_]+|fbclid|gclid|vir)(=|$)/i.test(q[i])) return false;
    var ls = localStorage;
    if (ls.getItem("evklid.racun") || ls.getItem("studentId") || ls.getItem("evklid_gost") || ls.getItem(POSNETEK) || ls.getItem(OWNER) !== null) return false;
    var lang = pm.getAttribute("content") || "";
    var tag = pm.getAttribute("data-oznaka") || "";
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    if (!lang || !tag || String(nav).toLowerCase() !== tag.toLowerCase()) return false;
    var izbran = jezik();
    if (izbran) return izbran === lang;
    var tz = "";
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (e) {}
    return !(lang === "en" && tz === "Europe/Ljubljana");
  }
  function moduli() {
    var tpl = document.getElementById("evklid-moduli");
    if (!tpl || !tpl.content) return;
    tpl.parentNode.removeChild(tpl);
    document.head.appendChild(tpl.content);
  }
  var slogiCaka = 0;
  var slogiVsi = false;
  function slogiPreveri() {
    if (slogiVsi && slogiCaka <= 0) html.removeAttribute("data-zacetek-slogi");
  }
  function slogDone() {
    slogiCaka--;
    slogiPreveri();
  }
  function slogi(cakaj, vsi) {
    var t = document.querySelectorAll("template[data-evklid-slogi]");
    for (var j = 0; j < t.length; j++) {
      var tpl = t[j];
      if (!tpl.content || (!vsi && !tpl.nextSibling)) continue;
      var l = tpl.content.querySelectorAll("link");
      for (var i = 0; cakaj && i < l.length; i++) {
        slogiCaka++;
        l[i].addEventListener("load", slogDone);
        l[i].addEventListener("error", slogDone);
      }
      tpl.parentNode.replaceChild(tpl.content, tpl);
    }
  }
  function brezPristajalne(pm) {
    moduli();
    if (!pm) return;
    html.setAttribute("data-zacetek-slogi", "");
    setTimeout(function () {
      slogiVsi = true;
      slogiCaka = 0;
      slogiPreveri();
    }, 8000);
    koLupina(
      function () {
        slogi(true, true);
        slogiVsi = true;
        slogiPreveri();
      },
      function () {
        slogi(true, !!document.body);
      }
    );
  }
  var poIzrisu = null;
  var pm = null;
  try {
    pm = document.querySelector('meta[name="evklid-pristajalna"]');
    var prist = !!pm && !html.hasAttribute("data-zacetek") && pristajalnaVelja(pm);
    if (!prist) brezPristajalne(pm || (zp && !slogiPoKoncu));
    else {
      poIzrisu = new Promise(function (ok) {
        var konc = false;
        function fin() {
          if (konc) return;
          konc = true;
          ok();
        }
        setTimeout(fin, 3000);
        try {
          var po = new PerformanceObserver(function (l) {
            if (!l.getEntriesByName("first-contentful-paint").length) return;
            po.disconnect();
            setTimeout(fin, 0);
          });
          po.observe({ type: "paint", buffered: true });
        } catch (e) {
          koLupina(function () {
            requestAnimationFrame(function () {
              requestAnimationFrame(fin);
            });
          });
        }
      });
      poIzrisu.then(function () {
        slogi(false, true);
        moduli();
      });
      html.setAttribute("data-pristajalna", "");
      html.lang = pm.getAttribute("content");
      html.dir = pm.getAttribute("data-smer") === "rtl" ? "rtl" : "ltr";
      koLupina(function () {
        var va = document.getElementById("view-auth");
        if (!va || !va.hasAttribute("data-vnaprej") || !html.hasAttribute("data-pristajalna")) return;
        va.hidden = false;
        pasovi(pm.getAttribute("data-mock") === "1", pm.getAttribute("data-tn") || "");
      });
    }
  } catch (e) {
    poIzrisu = null;
    html.removeAttribute("data-pristajalna");
    try {
      brezPristajalne(pm || (zp && !slogiPoKoncu));
    } catch (e2) {}
  }
  window.evklidZacetek.poIzrisu = poIzrisu || Promise.resolve();
  try {
    html.setAttribute("data-zacetek-lupina", "");
    var pokaziLupino = function () {
      html.removeAttribute("data-zacetek-lupina");
    };
    document.addEventListener("DOMContentLoaded", pokaziLupino);
    setTimeout(pokaziLupino, 3000);
    koLupina(function () {
      pokaziLupino();
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
