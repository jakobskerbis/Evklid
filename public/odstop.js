// Stran »Odstop od pogodbe« (/odstop.html): funkcija za odstop po ZVPot-1A (138.a člen). Naslov strani je zakonska oznaka
// »Kliknite tukaj za odstop od pogodbe«, obrazec je takoj pod njim (ime, e-naslov za potrdilo, pogodba), oddaja z
// »Potrdi odstop od pogodbe«. Brez prijave deluje kot obrazec; prijavljen imetnik izbere pogodbo v roku s seznama in
// odstop se izvede takoj. Strežnik: server/placila/odstop.js. Vikanje (plačnik je odrasel, docs/besedila.md).
import { t, locale } from "./i18n.js";

const root = document.getElementById("wd-root");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ZERO_DECIMAL = new Set(["VND", "XOF", "XAF", "UGX", "RWF", "JPY", "KRW", "GNF", "MGA"]);
const money = (minor, currency = "EUR") => (ZERO_DECIMAL.has(currency) ? minor : minor / 100).toLocaleString(locale(), { style: "currency", currency });
const day = (iso) => new Date(iso).toLocaleDateString(locale(), { day: "numeric", month: "numeric", year: "numeric" });
const STORE = { apple: "App Store", google: "Google Play" };
const ERR = new Set(["throttle", "name", "email", "details", "contract"]);
let view = { logged_in: false, days: 14, contact: "" };

async function api(path, body) {
  const res = await fetch(path, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Napaka strežnika kot koda, prevedena tu (strežnik pošlje tudi slovensko besedilo za druge odjemalce).
    const msg = ERR.has(data.code) ? t(`odstop.err.${data.code}`, { email: view.contact }) : data.error || t("common.error", { status: res.status });
    throw Object.assign(new Error(msg), { data, status: res.status });
  }
  return data;
}

function shell(inner) {
  const back = document.documentElement.dir === "rtl" ? "→" : "←";
  root.innerHTML = `<p><a href="/">${back} Evklid</a></p>${inner}`;
}

const optionLabel = (o) => t(`odstop.opt.${o.kind}`, { date: day(o.from), paid: money(o.paid_cents, o.currency) });

function refundLine(o) {
  if (!o) return "";
  const amount = money(o.refund.cents, o.currency);
  const what = o.kind === "gift" ? t("odstop.giftRefund", { amount }) : o.refund.cents > 0 ? t(o.refund.mode === "sorazmerno" ? "odstop.refundPart" : "odstop.refundFull", { amount }) : "";
  return `${what} ${t("odstop.deadline", { date: day(o.deadline) })}`.trim();
}

function form() {
  const opts = view.logged_in ? view.options || [] : [];
  const store = view.store ? `<p class="warn">${esc(t("odstop.store", { store: STORE[view.store] || view.store }))}</p>` : "";
  const select = opts.length
    ? `<label>${esc(t("odstop.contract"))}
        <select name="contract">${opts.map((o) => `<option value="${esc(o.id)}">${esc(optionLabel(o))}</option>`).join("")}<option value="other">${esc(t("odstop.other"))}</option></select>
      </label>
      <p class="muted small" id="wd-refund" aria-live="polite">${esc(refundLine(opts[0]))}</p>`
    : view.logged_in
      ? `<p class="muted small">${esc(t("odstop.none"))}</p>`
      : "";
  shell(`<h1>${esc(t("odstop.open"))}</h1>
  <p>${esc(t("odstop.intro", { days: view.days }))}</p>
  ${store}
  ${view.logged_in ? "" : `<p class="muted small">${esc(t("odstop.loginHint"))} <a href="/#prijava" id="wd-login">${esc(t("odstop.login"))}</a></p>`}
  <form class="card form" id="wd-form" novalidate>
    <label>${esc(t("odstop.name"))} <input name="name" autocomplete="name" maxlength="120" required value="${esc(view.name || "")}"></label>
    <label>${esc(t("odstop.email"))} <input name="email" type="email" autocomplete="email" maxlength="200" required value="${esc(view.email || "")}"></label>
    ${select}
    <label><span id="wd-details-label">${esc(t(opts.length ? "odstop.detailsMore" : "odstop.details"))}</span> <textarea name="details" maxlength="1000"${opts.length ? "" : " required"}></textarea></label>
    <p class="form-error" role="alert" hidden></p>
    <button type="submit" class="primary">${esc(t("odstop.confirm"))}</button>
    <p class="muted small">${esc(t("odstop.contact", { email: view.contact }))}</p>
  </form>`);
  const f = document.getElementById("wd-form");
  // Po prijavi nazaj sem (public/account.js).
  document.getElementById("wd-login")?.addEventListener("click", () => sessionStorage.setItem("evklid.poPrijavi", "/odstop.html"));
  f.contract?.addEventListener("change", () => {
    const o = opts.find((x) => x.id === f.contract.value);
    document.getElementById("wd-refund").textContent = refundLine(o);
    document.getElementById("wd-details-label").textContent = t(o ? "odstop.detailsMore" : "odstop.details");
    f.details.required = !o;
  });
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = f.querySelector(".form-error");
    const btn = f.querySelector("button[type=submit]");
    err.hidden = true;
    btn.disabled = true;
    try {
      const r = await api("/api/withdrawal", { name: f.name.value, email: f.email.value, contract: f.contract?.value || "other", details: f.details.value });
      done(r);
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
      btn.disabled = false;
      const field = ex.data?.field && f[ex.data.field];
      if (field?.focus) field.focus();
    }
  });
}

function done(r) {
  const w = r.withdrawal;
  const rows = [
    [t("odstop.name"), w.name],
    [t("odstop.email"), w.email],
    [t("odstop.contract"), w.contract_text],
    ...(w.details ? [[t("odstop.detailsMore"), w.details]] : []),
    [t("odstop.when"), w.submitted_text],
  ];
  const next = r.processed
    ? `${t("odstop.doneAuto")}${w.refund_cents ? ` ${t("odstop.doneRefund", { amount: money(w.refund_cents, w.currency || "EUR") })}` : ""}`
    : t("odstop.doneManual");
  const mail = r.ack_sent ? t("odstop.doneMail", { email: w.email }) : t("odstop.doneMailFail", { email: view.contact });
  shell(`<h1>${esc(t("odstop.title"))}</h1><div class="card" role="status">
    <h2 class="ok-mark" tabindex="-1">${esc(t("odstop.doneTitle"))}</h2>
    <dl class="wd-receipt">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
    <p>${esc(mail)}</p>
    <p>${esc(next)}</p>
    <p><a class="btn-secondary" id="wd-download" href="#" download="potrdilo-odstop-${esc(w.submitted_at.slice(0, 10))}.txt">${esc(t("odstop.download"))}</a></p>
  </div>`);
  // Potrdilo kot datoteka (shrani se tudi, če e-pošta ne pride).
  const text = [t("odstop.doneTitle"), "", ...rows.map(([k, v]) => `${k}: ${v}`), "", next].join("\n");
  const a = document.getElementById("wd-download");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  root.querySelector("h2").focus();
}

api("/api/withdrawal")
  .then((v) => (view = v))
  .catch(() => null)
  .finally(form);
