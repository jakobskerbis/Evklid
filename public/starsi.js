// Stran za starše (starsi.html); ločena datoteka zaradi politike CSP (brez vrinjenih skript).
// Ime otroka iz povezave (?ime=Miha) in cene v lokalni valuti s strežnika.
(function () {
  var q = new URLSearchParams(location.search);
  var ime = (q.get("ime") || "").trim().slice(0, 40);
  var href = "/?starsi=1" + (ime ? "&ime=" + encodeURIComponent(ime) : "");
  document.getElementById("cta").href = href;
  document.getElementById("cta2").href = href;
  if (ime) {
    document.getElementById("ask").textContent = ime + " bi rad(a) uporabljal(a) Evklid. Otroci, mlajši od 15 let, v Sloveniji ne morejo sami privoliti v obdelavo osebnih podatkov, zato je potrebno vaše soglasje. Na tej strani je vse, kar potrebujete za odločitev.";
  }
  var region = ((navigator.language || "").split("-")[1] || "").toUpperCase();
  fetch("/api/account/prices" + (region ? "?country=" + region : ""))
    .then(function (r) { return import("/odgovor.js").then(function (m) { return m.jsonAliNic(r); }); })
    .then(function (d) {
      if (!d) return;
      var zero = ["VND", "XOF", "XAF", "UGX", "RWF", "JPY", "KRW", "GNF", "MGA"].indexOf(d.currency) >= 0;
      var fmt = function (minor) {
        var v = zero ? minor : minor / 100;
        var whole = Number.isInteger(v);
        return v.toLocaleString(d.currency === "EUR" ? "sl-SI" : undefined, { style: "currency", currency: d.currency, minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2 });
      };
      var p = function (seats, interval) {
        var x = d.plans.find(function (pl) { return pl.seats === seats && pl.interval === interval; });
        return x ? fmt(x.amount) : "";
      };
      document.getElementById("trial").textContent = d.trial_days + " dni";
      document.getElementById("free").textContent = d.free_daily_questions;
      // Cene po stopnjah (j 2026-11-01): v evrih ima vsak paket stopnjo, regijske cene so ene za vse stopnje.
      var lv = function (level, family, interval) {
        var x = d.plans.find(function (pl) { return pl.level === level && !!pl.family === family && pl.interval === interval; });
        return x ? fmt(x.amount) : "";
      };
      if (d.plans.some(function (pl) { return pl.level; })) {
        document.getElementById("plan-month").innerHTML = "Naročnina na mesec: <b>" + lv("OS", false, "month") + "</b> v osnovni šoli, <b>" + lv("SS", false, "month") + "</b> v srednji šoli, <b>" + lv("FAKS", false, "month") + "</b> na fakulteti. Družina (2–4 profili): <b>" + lv("SS", true, "month") + "</b>, s študentom <b>" + lv("FAKS", true, "month") + "</b>.";
        // Letni paket prvi (j 2026-11-04), s prihrankom glede na 12 mesečnih plačil: najmanjši med naštetimi paketi (nikoli preveč).
        var amt = function (level, family, interval) { var x = d.plans.find(function (pl) { return pl.level === level && !!pl.family === family && pl.interval === interval; }); return x ? x.amount : 0; };
        var pct = Infinity;
        [["OS", false], ["SS", false], ["FAKS", false], ["SS", true], ["FAKS", true]].forEach(function (k) {
          var m = amt(k[0], k[1], "month"), y = amt(k[0], k[1], "year");
          if (m > 0 && y > 0) pct = Math.min(pct, Math.floor((1 - y / (12 * m)) * 100));
        });
        if (!isFinite(pct)) pct = 0;
        document.getElementById("plan-year").innerHTML = "Za celo leto" + (pct > 0 ? " (prihranite " + pct + " %)" : "") + ": <b>" + lv("OS", false, "year") + "</b> (osnovna šola), <b>" + lv("SS", false, "year") + "</b> (srednja šola), <b>" + lv("FAKS", false, "year") + "</b> (fakulteta). Družina <b>" + lv("SS", true, "year") + "</b>, s študentom <b>" + lv("FAKS", true, "year") + "</b>.";
        return;
      }
      document.getElementById("plan-month").innerHTML = "Naročnina: <b>" + p(1, "month") + "</b> na mesec za enega otroka ali <b>" + p(2, "month") + "</b> za dva.";
      document.getElementById("plan-year").innerHTML = "Za celo šolsko leto: <b>" + p(1, "year") + "</b> za enega otroka ali <b>" + p(2, "year") + "</b> za dva.";
    })
    .catch(function () {});
})();
