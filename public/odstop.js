// Stran »Odstop od pogodbe« (/odstop.html): funkcija za odstop po ZVPot-1A (138.a člen). Brez prijave deluje kot
// obrazec (ime, e-naslov za potrdilo, podatki o pogodbi); prijavljen imetnik izbere pogodbo v roku s seznama in odstop
// se izvede takoj. Dva koraka: »Kliknite tukaj za odstop od pogodbe« odpre obrazec, »Potrdi odstop od pogodbe« ga odda.
// Strežnik: server/placila/odstop.js. Vikanje (plačnik je odrasel, docs/besedila.md).
import { t, locale } from "./i18n.js";

const root = document.getElementById("wd-root");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ZERO_DECIMAL = new Set(["VND", "XOF", "XAF", "UGX", "RWF", "JPY", "KRW", "GNF", "MGA"]);
const money = (minor, currency = "EUR") => (ZERO_DECIMAL.has(currency) ? minor : minor / 100).toLocaleString(locale(), { style: "currency", currency });
const day = (iso) => new Date(iso).toLocaleDateString(locale(), { day: "numeric", month: "numeric", year: "numeric" });
const STORE = { apple: "App Store", google: "Google Play" };
let view = { logged_in: false, days: 14, contact: "" };

async function api(path, body) {
  const res = await fetch(path, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || t("common.error", { status: res.status })), { data, status: res.status });
  return data;
}

function shell(inner) {
  const back = document.documentElement.dir === "rtl" ? "→" : "←";
  root.innerHTML = `<p><a href="/">${back} Evklid</a></p><h1>${esc(t("odstop.title"))}</h1>${inner}`;
}

const optionLabel = (o) => t(`odstop.opt.${o.kind}`, { date: day(o.from), paid: money(o.paid_cents, o.currency) });

function refundLine(o) {
  if (!o) return "";
  const amount = money(o.refund.cents, o.currency);
  return `${t(o.refund.mode === "sorazmerno" ? "odstop.refundPart" : "odstop.refundFull", { amount })} ${t("odstop.deadline", { date: day(o.deadline) })}`;
}

function start() {
  const store = view.store ? `<p class="warn">${esc(t("odstop.store", { store: STORE[view.store] || view.store }))}</p>` : "";
  shell(`<div class="card">
    <p>${esc(t("odstop.intro", { days: view.days }))}</p>
    ${store}
    <button type="button" class="primary" id="wd-open">${esc(t("odstop.open"))}</button>
    ${view.logged_in ? "" : `<p class="muted small">${esc(t("odstop.loginHint"))} <a href="/#prijava">${esc(t("odstop.login"))}</a></p>`}
  </div>`);
  document.getElementById("wd-open").addEventListener("click", form);
}

function form() {
  const opts = view.logged_in ? view.options || [] : [];
  const select = opts.length
    ? `<label>${esc(t("odstop.contract"))}
        <select name="contract">${opts.map((o) => `<option value="${esc(o.id)}">${esc(optionLabel(o))}</option>`).join("")}<option value="other">${esc(t("odstop.other"))}</option></select>
      </label>
      <p class="muted small" id="wd-refund" aria-live="polite">${esc(refundLine(opts[0]))}</p>`
    : view.logged_in
      ? `<p class="muted small">${esc(t("odstop.none"))}</p>`
      : "";
  shell(`<form class="card form" id="wd-form" novalidate>
    <label>${esc(t("odstop.name"))} <input name="name" autocomplete="name" maxlength="120" required value="${esc(view.name || "")}"></label>
    <label>${esc(t("odstop.email"))} <input name="email" type="email" autocomplete="email" maxlength="200" required value="${esc(view.email || "")}"></label>
    ${select}
    <label><span id="wd-details-label">${esc(t(opts.length ? "odstop.detailsMore" : "odstop.details"))}</span> <textarea name="details" maxlength="1000"${opts.length ? "" : " required"}></textarea></label>
    <p class="form-error" role="alert" hidden></p>
    <div class="wd-actions">
      <button type="submit" class="primary">${esc(t("odstop.confirm"))}</button>
      <button type="button" class="secondary" id="wd-back">${esc(t("odstop.back"))}</button>
    </div>
    <p class="muted small">${esc(t("odstop.contact", { email: view.contact }))}</p>
  </form>`);
  const f = document.getElementById("wd-form");
  f.name.focus();
  document.getElementById("wd-back").addEventListener("click", start);
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
  shell(`<div class="card" role="status">
    <h2 class="ok-mark">${esc(t("odstop.doneTitle"))}</h2>
    <dl class="wd-receipt">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
    <p>${esc(r.ack_sent ? t("odstop.doneMail", { email: w.email }) : t("odstop.doneMailFail", { email: view.contact }))}</p>
    <p>${esc(next)}</p>
  </div>`);
  root.querySelector("h2").setAttribute("tabindex", "-1");
  root.querySelector("h2").focus();
}

api("/api/withdrawal")
  .then((v) => (view = v))
  .catch(() => null)
  .finally(start);
