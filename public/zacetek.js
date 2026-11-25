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
  function konec(app) {
    prej = [];
    var tap = tapZadnji;
    tapZadnji = null;
    tapOn = false;
    gotovo = false;
    caka(null);
    naslovi = []; // naslove od tu upravlja app.js
    // Učna pot s strežnika, ki jo je učenec pomaknil: prava (isti HTML) ostane na istem mestu (pregled #903).
    var odmiki = [];
    var srv = app === true ? document.querySelector("main[data-posnetek][data-streznik]") : null;
    if (srv) {
      if (srv.scrollTop) odmiki.push(["", srv.scrollTop]);
      var zid = srv.querySelectorAll("[id]");
      for (var z = 0; z < zid.length; z++) if (zid[z].scrollTop) odmiki.push([zid[z].id, zid[z].scrollTop]);
    }
    var pm = document.querySelector('meta[name="evklid-pot"]');
    if (pm) pm.remove();
    if (slogiPoKoncu) {
      slogiPoKoncu = false;
      slogi(false, true);
    }
    if (obrazecCaka) {
      obrazecCaka = false;
      html.removeAttribute("data-zacetek-slogi");
    }
    html.removeAttribute("data-zacetek");
    html.removeAttribute("data-zacetek-pot");
    html.removeAttribute("data-zacetek-pod");
    var p = document.querySelectorAll("main[data-posnetek]");
    for (var i = 0; i < p.length; i++) p[i].remove();
    var tpl = document.getElementById("evklid-pot");
    if (tpl) tpl.remove(); // Učna pot s strežnika ni več potrebna (app.js izriše svojo)
    var vp = odmiki.length ? document.getElementById("view-path") : null;
    for (var o = 0; vp && !vp.hidden && o < odmiki.length; o++) {
      var cel = odmiki[o][0] ? vp.querySelector("#" + CSS.escape(odmiki[o][0])) : vp;
      if (cel) cel.scrollTop = odmiki[o][1];
    }
    if (app === true && tap)
      setTimeout(function () {
        odigraj(tap);
      }, 0);
  }
  var cakaEl = null;
  function caka(el) {
    if (cakaEl) cakaEl.removeAttribute("data-caka");
    cakaEl = el;
    if (el) el.setAttribute("data-caka", "");
    if (el) html.setAttribute("data-zacetek-caka", "");
    else html.removeAttribute("data-zacetek-caka");
  }
  var tapOn = false;
  var gotovo = false;
  var appTece = false;
  var tapZadnji = null;
  var TAP = "button, [role=button], [data-open], [data-view], [data-mode], [data-gm], [data-home-go], [data-go-schedule], [data-daily], [data-dnevna], [data-scan-home]";
  function tapOpis(el) {
    var m = el.closest("main[data-streznik]");
    if (!m) return { el: el };
    var sel = el.tagName.toLowerCase();
    var at = el.attributes;
    var ima = false;
    for (var i = 0; i < at.length; i++) {
      var n = at[i].name;
      if (n === "id" || (/^data-/.test(n) && n !== "data-pogoj" && n !== "data-nastal" && n !== "data-wired")) {
        sel += n === "id" ? "#" + CSS.escape(at[i].value) : "[" + n + '="' + CSS.escape(at[i].value) + '"]';
        ima = true;
      }
    }
    if (!ima) for (var c = 0; c < el.classList.length; c++) sel += "." + CSS.escape(el.classList[c]);
    var pr = el.parentElement && el.parentElement.closest("[id]");
    if (pr && pr !== m && m.contains(pr)) sel = "#" + CSS.escape(pr.id) + " " + sel;
    var vsi = vidni(m.querySelectorAll(sel));
    var k = 0;
    for (var j = 0; j < vsi.length; j++) if (vsi[j] === el) k = j;
    return { sel: sel, k: k, t: Date.now() };
  }
  function vidni(vsi) {
    var r = [];
    for (var i = 0; i < vsi.length; i++) if (vsi[i].getClientRects().length) r.push(vsi[i]);
    return r;
  }
  function odigraj(o) {
    if (Date.now() - o.t > 20000 || document.getElementById("boot-down") || document.body.classList.contains("auth-mode")) return;
    if (document.querySelector("dialog[open], #lock-overlay, .tour:not([hidden])")) return;
    // Zavihek ali gumb lupine: kot klik nanj (app.js ga obdela kot prej, tudi skritega). Učna pot: isti element v
    // pravem pogledu, le če je viden (app.js ga je morda skril, ker se je stanje vmes spremenilo).
    var el = o.el;
    if (el) {
      if (el.isConnected && !el.disabled) el.click();
      return;
    }
    var v = document.getElementById("view-path");
    var vsi = v && !v.hidden ? vidni(v.querySelectorAll(o.sel)) : [];
    el = vsi[o.k] || null;
    if (!el || el.disabled) return;
    el.click();
  }
  function tapZadrzi(e) {
    // Klik iz skripte, ko app.js že teče (npr. account.js po plačilu), gre naprej kot prej; dotik uporabnika in
    // klik iz skripte pred app.js (dostopnost, testi) počakata na app.js.
    if (!tapOn || (appTece && !e.isTrusted)) return;
    var el = e.target && e.target.closest ? e.target.closest(TAP) : null;
    if (!el || el.closest("a[href]") || !el.closest("main[data-streznik], .topbar, #tabbar, body > .banner")) return;
    if (gotovo && !el.closest("main[data-streznik]")) {
      // app.js pripravljen: zavihek takoj, kot brez strežnika; starejši zadržan dotik ne velja več (pregled #903).
      tapZadnji = null;
      caka(null);
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    tapZadnji = tapOpis(el);
    caka(el); // dotik je sprejet: gumb kot pritisnjen, dokler ga app.js ne izvede
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
    tapOn = false;
    tapZadnji = null;
    caka(null);
    try {
      localStorage.removeItem(POSNETEK);
    } catch (e) {}
    var chip = potSrv ? document.querySelector("#xp-badge .stat.xp") : null;
    if (chip) chip.style.removeProperty("--lvl");
    for (var t = naslovi.length - 1; t >= 0; t--) naslovi[t][0].title = naslovi[t][1]; // obratno: prvi zapis je izvirnik
    naslovi = [];
    var pm = document.querySelector('meta[name="evklid-pot"]');
    if (pm) pm.remove();
    var p = document.querySelector("main[data-posnetek]:not(.zagon-okostje)");
    if (p) {
      p.removeAttribute("data-streznik");
      p.setAttribute("aria-hidden", "true");
      p.inert = true;
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
      var tpl = p && p.srv ? document.getElementById("evklid-pot") : null;
      if (p && p.srv && !(tpl && tpl.content)) {
        p = null;
        okostjePot = true;
        potSrv = false;
      }
      var pot = !p && okostjePot && v === "path";
      m.className = p ? p.c : pot ? "view narrow zagon-okostje zo-pot" + (zp && zp.d["/api/students/" + zp.s + "/path"] && zp.d["/api/students/" + zp.s + "/path"].danes ? " zo-danes" : "") : "view narrow zagon-okostje";
      if (p) m.id = "view-" + v;
      if (tpl) {
        m.removeAttribute("aria-hidden");
        m.inert = false;
        m.setAttribute("data-streznik", "");
        m.appendChild(document.importNode(tpl.content, true));
        pogoji(m);
        tapOn = true;
        postavi(m);
      } else if (p) {
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
        if (pos && !pos.srv && !prenos && (pos.r || "") !== r) pos = null;
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
      if (p && p.srv && potSrv && p.hd) glavaStreznik(p.hd);
      var tb = p && typeof p.tb === "string" && IME.test(p.tb) ? p.tb : "";
      var tabs = bar ? bar.querySelectorAll(".tab") : [];
      for (var j = 0; tb && j < tabs.length; j++) {
        var izbran = tabs[j].getAttribute("data-view") === tb;
        tabs[j].classList.toggle("active", izbran);
        if (izbran) tabs[j].setAttribute("aria-current", "page");
        else tabs[j].removeAttribute("aria-current");
      }
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
  var potSrv = false;
  var potDejstvo = null;
  function shramba(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }
  function potStreznika(sid0) {
    var pm = document.querySelector('meta[name="evklid-pot"]');
    if (!pm || pm.getAttribute("data-s") !== String(sid0) || html.hasAttribute("data-era") || navigator.onLine === false) return null;
    var jez = pm.getAttribute("data-jezik") || "";
    var L = jezik();
    if (!L) {
      var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "";
      var tz = "";
      try {
        tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      } catch (e) {}
      var zaz = pm.getAttribute("data-zaznan") || "";
      if (zaz && String(nav).toLowerCase() === String(pm.getAttribute("data-oznaka") || "").toLowerCase()) L = zaz === "en" && tz === "Europe/Ljubljana" ? "sl" : zaz;
    }
    if (!jez || L !== jez) return null;
    try {
      for (var i = 0; i < localStorage.length; i++) if (/^evklid\.vrsta\./.test(localStorage.key(i) || "")) return null;
    } catch (e) {
      return null;
    }
    var ok = function (k, re) {
      var x = shramba(k);
      return !x || !re.test(x);
    };
    if (!ok("evklid.razdelilnik", /"path"/) || !ok("evklid.okna", /"path"/) || !ok("evklid.offline.queue." + sid0, /\{/)) return null;
    var hd = null;
    try {
      hd = JSON.parse(pm.getAttribute("data-glava") || "null");
    } catch (e) {}
    var d = Number(pm.getAttribute("data-dejstvo"));
    potDejstvo = isFinite(d) ? d : null;
    html.lang = jez;
    html.dir = pm.getAttribute("data-smer") === "rtl" ? "rtl" : "ltr";
    html.setAttribute("data-zacetek-pot", "");
    return { srv: true, v: "path", c: "view narrow split-host", tb: "path", t: Date.now(), hd: hd && typeof hd === "object" ? hd : null };
  }
  function lokalniDan(d) {
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function pogoji(m) {
    var el = m.querySelectorAll("[data-pogoj]");
    for (var i = 0; i < el.length; i++) {
      var k = el[i].getAttribute("data-pogoj");
      var skrij = false;
      if (k === "sch") skrij = shramba("evklid.scheduleCardHidden") === "1";
      else if (k === "fb") {
        var st = shramba("evklid.feedbackCard");
        var born = new Date(String(el[i].getAttribute("data-nastal") || "").replace(" ", "T") + "Z");
        skrij = st === "hidden" || st === "sent" || isNaN(born.getTime()) || !(born < new Date()) || lokalniDan(born) === lokalniDan(new Date());
      } else if (k === "inst") {
        var at = Number(shramba("evklid.install"));
        var mm = ["standalone", "fullscreen", "minimal-ui", "window-controls-overlay"];
        var sam = / EvklidApp\//.test(navigator.userAgent) || navigator.standalone === true;
        for (var j = 0; !sam && j < mm.length; j++) sam = matchMedia("(display-mode: " + mm[j] + ")").matches;
        skrij = sam || (at > 0 && Date.now() - at < 21 * 864e5);
      }
      if (skrij) el[i].hidden = true;
    }
  }
  var naslovi = [];
  function glavaStreznik(hd) {
    var chip = document.querySelector("#xp-badge .stat.xp");
    if (chip && typeof hd.l === "number") {
      chip.style.setProperty("--lvl", hd.l);
      if (typeof hd.lt === "string") naslovi.push([chip, chip.title]), (chip.title = hd.lt);
    }
    var pb = document.getElementById("profile-btn");
    if (pb && typeof hd.pt === "string") naslovi.push([pb, pb.title]), (pb.title = hd.pt);
    // Napisi lupine v jeziku strani (server/pot-takoj.js napisiLupine), kot applyI18n; Učna pot je že prevedena.
    var np = hd.np && typeof hd.np === "object" ? hd.np : null;
    // Spodnja vrstica je morda še razčlenjena le do pol: napisi še enkrat, ko je cela stran prebrana (pregled #903).
    var tb = document.getElementById("tabbar");
    if (np && !hd.znova && document.readyState === "loading" && typeof MutationObserver === "function" && !(tb && tb.nextElementSibling)) {
      var mo = new MutationObserver(function () {
        var b = document.getElementById("tabbar");
        if (!(b && b.nextElementSibling) && document.readyState === "loading") return;
        mo.disconnect();
        if (!pozabljen && html.hasAttribute("data-zacetek")) glavaStreznik({ np: np, znova: true });
      });
      mo.observe(html, { childList: true, subtree: true });
    }
    var el = np ? document.querySelectorAll("[data-i18n],[data-i18n-title],[data-i18n-aria]") : [];
    for (var i = 0; i < el.length; i++) {
      if (el[i].closest("main")) continue;
      var k = el[i].getAttribute("data-i18n");
      if (k && typeof np[k] === "string") el[i].textContent = np[k];
      k = el[i].getAttribute("data-i18n-title");
      if (k && typeof np[k] === "string") el[i].title = np[k];
      k = el[i].getAttribute("data-i18n-aria");
      if (k && typeof np[k] === "string") el[i].setAttribute("aria-label", np[k]);
    }
  }
  function postavi(m) {
    var go = function () {
      if (!m.isConnected) return;
      lomi();
      locnica(m);
    };
    requestAnimationFrame(go);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  }
  function lomi() {
    var bar = document.querySelector(".topbar");
    var tabs = bar && bar.querySelector(".tabs");
    if (!tabs) return;
    var over = function () {
      return tabs.scrollWidth > tabs.clientWidth + 1;
    };
    var STEPS = ["tabs-tight", "tabs-nobrand", "tabs-minor", "tabs-compact"];
    for (var i = 0; i < STEPS.length; i++) bar.classList.remove(STEPS[i]);
    for (var j = 0; j < STEPS.length && over(); j++) bar.classList.add(STEPS[j]);
    var max = tabs.scrollWidth - tabs.clientWidth;
    var at = Math.abs(tabs.scrollLeft);
    tabs.classList.toggle("fade-start", max > 1 && at > 1);
    tabs.classList.toggle("fade-end", max > 1 && at < max - 1);
  }
  function locnica(m) {
    var old = m.querySelector(":scope > .split-handle");
    if (old) old.remove();
    if (shramba("evklid.windows") === "0" || matchMedia("(max-width: 760px), (max-height: 500px) and (pointer: coarse)").matches) return;
    var cs = getComputedStyle(m);
    if (!/grid/.test(cs.display)) return;
    var px = function (v) {
      return parseFloat(v) || 0;
    };
    var tr = function (v) {
      return String(v || "").trim().split(/\s+/).map(px);
    };
    var cols = tr(cs.gridTemplateColumns);
    if (cols.length < 2) return;
    var at = px(cs.columnGap) / 2 + cols[0];
    var pos = cs.direction === "rtl" ? m.clientWidth - px(cs.paddingRight) - at : px(cs.paddingLeft) + at;
    var rows = tr(cs.gridTemplateRows);
    var len = 0;
    for (var i = 0; i < rows.length; i++) len += rows[i];
    len += px(cs.rowGap) * (rows.length - 1);
    var h = document.createElement("div");
    h.className = "split-handle split-x";
    h.setAttribute("aria-hidden", "true");
    h.style.left = pos + "px";
    h.style.top = px(cs.paddingTop) + "px";
    h.style.height = Math.max(0, len) + "px";
    h.innerHTML = '<span class="split-grip"></span>';
    m.appendChild(h);
  }
  function dejstvo() {
    var d = potSrv ? potDejstvo : null;
    potDejstvo = null;
    return d;
  }
  if (typeof window.addEventListener === "function") window.addEventListener("click", tapZadrzi, true);
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
  window.evklidZacetek = { KEY: KEY, POSNETEK: POSNETEK, PRENOS: PRENOS, OWNER: OWNER, MAX: MAX, JEZIK: JEZIK, izberi: izberi, beri: beri, vnaprej: vnaprej, pozabiVnaprej: pozabiVnaprej, konec: konec, zacel: function () {
      appTece = true;
    }, gotov: function () {
      gotovo = true;
    }, pozabi: pozabi, lahkoShrani: lahkoShrani, znova: znova, ociscen: ociscen, dejstvo: dejstvo, ucenec: !!(zp && zp.s != null) };
  try {
    var z = beri();
    var sid = localStorage.getItem("studentId");
    var moj = z && String(z.s) === sid;
    var q = new URLSearchParams(location.search).get("pogled");
    var v = q || (moj ? izberi(z, Date.now()) : "path");
    var pos = !q && sid && v && IME.test(v) ? posnetekZa(v, moj ? z : null, sid, Date.now()) : null;
    var takoj = pos && !pos.z ? pos : null;
    var srv = !pos && v === "path" && zp && zp.s != null ? potStreznika(zp.s) : null;
    potSrv = !!srv;
    if (srv) takoj = srv;
    okostjePot = !!(zp && zp.s != null && v === "path" && !pos && !srv);
    if (v && IME.test(v) && (v !== "path" || pos || okostjePot || srv)) {
      slogiPoKoncu = !!zp && v === "path";
      html.setAttribute("data-zacetek", v);
      setTimeout(konec, okostjePot || srv ? 20000 : 8000);
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
    if (lang !== "en") return true;
    var tz = "";
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch (e) {}
    return tz !== "Europe/Ljubljana";
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
  var obrazecCaka = false;
  function obrazecObiskovalca(pm) {
    moduli();
    slogiPoKoncu = true;
    obrazecCaka = true;
    html.setAttribute("data-zacetek-slogi", "");
    setTimeout(function () {
      if (!obrazecCaka) return;
      obrazecCaka = slogiPoKoncu = false;
      slogi(false, true);
      html.removeAttribute("data-zacetek-slogi");
    }, 8000);
    try {
      var q = location.search.replace(/^\?/, "").split("&");
      for (var i = 0; i < q.length; i++) if (q[i] && !/^(utm_[a-z_]+|fbclid|gclid|vir)(=|$)/i.test(q[i])) return;
      if (localStorage.getItem(OWNER) !== null) return;
    } catch (e) {
      return;
    }
    window.evklidZacetek.obrazec = function () {
      if (!obrazecCaka) return;
      obrazecCaka = false;
      pasovi(pm.getAttribute("data-mock") === "1", pm.getAttribute("data-tn") || "");
      html.removeAttribute("data-zacetek-slogi");
    };
  }
  var OBRAZCI = { "#registracija": 1, "#prijava": 1, "#pozabljeno-geslo": 1 };
  var poIzrisu = null;
  var pm = null;
  try {
    pm = document.querySelector('meta[name="evklid-pristajalna"]');
    var prist = !!pm && !html.hasAttribute("data-zacetek") && pristajalnaVelja(pm);
    if (!prist && pm && !html.hasAttribute("data-zacetek") && OBRAZCI[location.hash] === 1) obrazecObiskovalca(pm);
    else if (!prist) brezPristajalne(pm || (zp && !slogiPoKoncu));
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
