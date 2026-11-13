// Stran za starše »Plačilo za Evklid« (placaj.html?t=…): najstnik ali otrok pošlje povezavo,
// starš vidi, kaj plačuje, potrdi obe izjavi in plača prek Stripa. Brez prijave v Evklid.
// Strežnik: /api/pay/:token (server/accounts/billing.js).
import { t, locale, applyI18n } from "./i18n.js";
import { consentFields, consentsOk, consentBody } from "./pay-ui.js";

const root = document.getElementById("pay-root");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ZERO_DECIMAL = new Set(["VND", "XOF", "XAF", "UGX", "RWF", "JPY", "KRW", "GNF", "MGA"]);
const money = (minor, currency) => (ZERO_DECIMAL.has(currency) ? minor : minor / 100).toLocaleString(locale(), { style: "currency", currency });
const fmtDay = (s) => new Date(`${s}T12:00:00`).toLocaleDateString(locale(), { weekday: "short", day: "numeric", month: "numeric" });
const fmtIso = (iso) => new Date(iso).toLocaleDateString(locale(), { day: "numeric", month: "numeric", year: "numeric" });

const q = new URLSearchParams(location.search);
const token = q.get("t") || "";
const sessionId = q.get("session_id");

async function api(path, body) {
  const res = await fetch(`/api/pay/${encodeURIComponent(token)}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || t("common.error", { status: res.status })), { data, status: res.status });
  return data;
}

function shell(inner) {
  const back = document.documentElement.dir === "rtl" ? "→" : "←";
  root.innerHTML = `<p><a href="/">${back} Evklid</a></p><h1>${esc(t("payp.title"))}</h1>${inner}`;
}

function showPaid(v) {
  shell(`<div class="card"><h2 class="ok-mark">${esc(t("payp.paid"))}</h2><p>${esc(v.name ? t("payp.paidText", { name: v.name }) : t("payp.paidTextNoName"))}</p></div>`);
}

function summary(v) {
  const p = v.plan;
  if (v.kind === "sub") {
    return `<div class="pay-sum"><b>${esc(t("payp.sub", { n: p.seats || 1 }))}</b>
      <span class="pay-price">${esc(money(p.amount, p.currency))}</span>
      <span class="muted">${esc(t(p.interval === "year" ? "payp.perYear" : "payp.perMonth"))}</span>
      <p class="muted">${esc(t("payp.subNote"))}</p></div>`;
  }
  return `<div class="pay-sum"><b>${esc(t("payp.pass", { n: p.days }))}</b>
    <span class="pay-price">${esc(money(p.amount, p.currency))}</span>
    ${v.test?.name ? `<span>${esc(t("payp.passTest", { name: v.test.name, date: fmtDay(v.test.date) }))}</span>` : ""}
    <span>${esc(t("payp.passWhat", { n: p.days }))}</span>
    <p class="muted">${esc(t("payp.passNote"))}</p></div>`;
}

function render(v) {
  if (v.paid) return showPaid(v);
  shell(`
    <p>${esc(v.name ? t("payp.intro", { name: v.name }) : t("payp.introNoName"))} <a href="/starsi.html" target="_blank">${esc(t("payp.whatLink"))}</a></p>
    <div class="card">
      ${summary(v)}
      <form id="pay-form" novalidate>
        <label for="pay-email">${esc(t("payp.email"))}</label>
        <input id="pay-email" name="email" type="email" required autocomplete="email" maxlength="200">
        ${consentFields()}
        <p class="form-error" role="alert" hidden></p>
        <button class="primary" type="submit">${esc(t("payp.pay"))}</button>
        <p class="muted">${esc(t("payp.secure"))}</p>
        <p class="muted">${esc(t("payp.expires", { date: fmtIso(v.expires_at) }))}</p>
      </form>
    </div>`);
  const f = document.getElementById("pay-form");
  const err = f.querySelector(".form-error");
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.hidden = true;
    const fail = (x) => {
      err.textContent = x.message;
      err.hidden = false;
    };
    f.email.removeAttribute("aria-invalid");
    if (!f.email.checkValidity()) {
      f.email.setAttribute("aria-invalid", "true");
      return fail(new Error(t("payp.emailMissing")));
    }
    if (!consentsOk(f)) return fail(new Error(t("payp.consentMissing")));
    const btn = f.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      const r = await api("/checkout", { email: f.email.value, ...consentBody() });
      location.href = r.url;
    } catch (x) {
      btn.disabled = false;
      if (x.data?.paid) return load();
      fail(x);
    }
  });
}

function expired() {
  shell(`<div class="card"><p>${esc(t("payp.expired"))}</p></div>`);
}

async function load() {
  try {
    let v;
    if (sessionId) {
      // Vrnitev s plačilne strani: potrdi plačilo (deluje tudi brez webhooka).
      root.querySelector("#pay-status")?.replaceChildren(t("payp.checking"));
      v = await api("/confirm", { session_id: sessionId }).catch(() => null);
      history.replaceState(null, "", `${location.pathname}?t=${encodeURIComponent(token)}`);
    }
    v = v || (await api(""));
    render(v);
  } catch (x) {
    if (x.status === 404) return expired();
    shell(`<div class="card"><p class="form-error">${esc(x.message)}</p></div>`);
  }
}

applyI18n();
document.title = t("payp.title");
if (!token) expired();
else load();
