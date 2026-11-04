// Stran za šole (/sole): obrazec za naročilo ali povpraševanje.
  // »Podari Evklid«: razdelek in števec podarjenih mesecev (/api/podari, samo z računi; brez njega ostane skrit).
  (function () {
    var box = document.getElementById("podari");
    if (!box || !window.fetch) return;
    fetch("/api/podari")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (s) {
        if (!s || typeof s.donated_months !== "number") return;
        var months = (s.donated_months || 0) + (s.evklid_months || 0);
        box.querySelector('[data-podari="months"]').textContent = String(months);
        box.querySelector('[data-podari="used"]').textContent = String(s.in_use_months || 0);
        // Števec pokažemo, ko je podarjen vsaj en mesec.
        document.getElementById("podari-count").hidden = months < 1;
        box.hidden = false;
      })
      .catch(function () {});
  })();
  (function () {
    var f = document.getElementById("order-form");
    var prices = {};
    try { prices = JSON.parse(f.getAttribute("data-prices")); } catch (e) {}
    var fmt = function (x) { var w = Number.isInteger(x); return x.toLocaleString("sl-SI", { style: "currency", currency: "EUR", minimumFractionDigits: w ? 0 : 2, maximumFractionDigits: w ? 0 : 2 }); };
    var today = new Date();
    var iso = function (d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
    f.startDate.min = iso(today);
    f.startDate.max = iso(new Date(today.getFullYear() + 2, today.getMonth(), today.getDate() - 1));
    // Privzeti začetek: med šolskim letom (september–april) danes, sicer 1. september.
    var m = today.getMonth();
    f.startDate.value = iso(m >= 8 || m <= 3 ? today : new Date(today.getFullYear(), 8, 1));
    var budget = document.getElementById("budget-user");
    var codeRow = document.getElementById("budget-code-row");
    budget.addEventListener("change", function () {
      codeRow.hidden = !budget.checked;
      f.budgetCode.required = budget.checked;
    });
    var estimate = function () {
      var n = Number(f.students.value);
      var plan = (f.querySelector('input[name="plan"]:checked') || {}).value;
      var el = document.getElementById("estimate");
      if (!plan || !Number.isInteger(n) || n < 1 || n > Number(f.dataset.maxStudents || 5000)) { el.textContent = ""; return; }
      el.textContent = "Okvirno: " + n + " × " + fmt(prices[plan]) + " = " + fmt(n * prices[plan]) + " na leto";
    };
    f.addEventListener("input", estimate);
    f.addEventListener("change", estimate);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = f.querySelector(".form-error");
      err.hidden = true;
      var bad = Array.prototype.find.call(f.querySelectorAll("input, textarea"), function (i) { return !i.closest(".hp") && !i.closest("[hidden]") && !i.checkValidity(); });
      if (bad) {
        err.textContent = bad.name === "consent" ? "Za odgovor potrebujemo vaše soglasje, da vas kontaktiramo." : "Preverite polje: " + (bad.closest("label").firstChild.textContent || "").replace(/\(neobvezno\)/, "").trim() + ".";
        err.hidden = false;
        bad.focus();
        return;
      }
      var btn = f.querySelector("button[type=submit]");
      btn.disabled = true;
      var body = {
        school: f.school.value, address: f.address.value, registrationNo: f.registrationNo.value, taxId: f.taxId.value,
        budgetUser: budget.checked, budgetCode: f.budgetCode.value, contact: f.contact.value, email: f.email.value, phone: f.phone.value,
        plan: (f.querySelector('input[name="plan"]:checked') || {}).value, students: Number(f.students.value), startDate: f.startDate.value,
        note: f.note.value, consent: f.consent.checked, website: f.website.value
      };
      fetch("/api/school-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (x) {
          if (!x.ok) throw new Error(x.d.error || "Pošiljanje ni uspelo. Poskusite znova.");
          var box = document.getElementById("order-box");
          box.className = "ok-box";
          box.setAttribute("role", "status");
          box.innerHTML = "<h3>Hvala, naročilo smo prejeli.</h3><p>Številka naročila: <b></b></p><p>Odgovorimo vam na navedeni e-naslov s predračunom ali z vprašanji. Številko navedite, če nam pišete.</p>";
          box.querySelector("b").textContent = x.d.number || "–";
          box.scrollIntoView({ block: "center" });
        })
        .catch(function (ex) {
          err.textContent = ex.message === "Failed to fetch" ? "Ni povezave. Poskusite znova." : ex.message;
          err.hidden = false;
          btn.disabled = false;
        });
    });
  })();
