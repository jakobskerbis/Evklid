// Kartica »Pripravi se na test« v Urniku: paket pred testom (enkratno plačilo, 7 ali 14 dni polnega dostopa).
// Strežnik (server/accounts/billing.js) ponudi paket samo učencu brez aktivne naročnine in samo,
// ko je v urniku test v naslednjih 14 dneh. Pravila ponudb (server/placila/ponudbe.js): ne med poukom,
// ne, če jih je učitelj izklopil; pod 15 let brez cene, le povezava s podatki za starše (parent_info).
// Gumba »Prosi starše za plačilo« kartica ne ponuja sama: učenec ga odpre v »Kako lahko plača starš?«.
import { t, locale } from "./i18n.js";
import { icon, hydrateIcons } from "./icons.js";
import { consentFields, consentsOk, consentBody, linkBox, bindLinkBox } from "./pay-ui.js";
import { accountsOn } from "./account.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const money = (cents, currency) => (cents / 100).toLocaleString(locale(), { style: "currency", currency });
const fmtDay = (s) => new Date(`${s}T12:00:00`).toLocaleDateString(locale(), { weekday: "short", day: "numeric", month: "numeric" });
// Zadnji dan paketa, če ga plačaš danes.
const fmtShort = (days) => new Date(Date.now() + days * 86400000).toLocaleDateString(locale(), { day: "numeric", month: "numeric" });
const fmtIso = (iso) => new Date(iso).toLocaleDateString(locale(), { day: "numeric", month: "numeric", year: "numeric" });

export async function renderPassOffer(el, { api, studentId, toast }) {
  if (!el || !studentId) return;
  if (!accountsOn()) return void (el.innerHTML = ""); // brez računov ni plačil
  let d;
  try {
    d = await api(`/api/students/${studentId}/pass-offer`);
  } catch {
    el.innerHTML = ""; // brez računov ali brez povezave: kartice ni
    return;
  }
  if (d.active) {
    el.innerHTML = `<p class="muted pass-active">${icon("check")} ${esc(t("pass.active", { date: fmtIso(d.active.ends_at) }))}</p>`;
    hydrateIcons?.(el);
    return;
  }
  const o = d.offer;
  if (!o) {
    el.innerHTML = "";
    return;
  }
  if (o.parent_info) {
    el.innerHTML = `
      <div class="card pass-card">
        <h3>${icon("clipboard-check")} ${esc(t("pass.title"))}</h3>
        <p>${esc(t("pass.parentInfo", { name: o.test.name, date: fmtDay(o.test.date) }))}</p>
        <p class="pass-parent-info"><a href="/starsi.html" target="_blank" rel="noopener">${esc(t("pass.parentInfoLink"))}</a></p>
      </div>`;
    hydrateIcons?.(el);
    return;
  }
  const options = d.passes
    .map(
      (p) => `<label class="plan"><input type="radio" name="days" value="${p.days}" ${p.days === o.suggested ? "checked" : ""}>
        <span><b>${esc(t("pass.days", { n: p.days }))}</b> · ${esc(money(p.amount, p.currency))}<br><span class="muted">${esc(t("pass.until", { date: fmtShort(p.days) }))}</span>${p.days === o.suggested ? `<br><span class="muted">${esc(t("pass.suggested"))}</span>` : ""}</span></label>`,
    )
    .join("");
  el.innerHTML = `
    <form class="card pass-card" novalidate>
      <h3>${icon("clipboard-check")} ${esc(t("pass.title"))}</h3>
      <p>${esc(t("pass.text", { name: o.test.name, date: fmtDay(o.test.date) }))}</p>
      <fieldset class="pass-options"><legend class="sr-only">${esc(t("pass.title"))}</legend>${options}</fieldset>
      <p class="muted">${esc(t("pass.note"))}</p>
      ${o.birth_missing ? `<p class="muted">${esc(t("birth.payMissing"))}</p>` : ""}
      ${o.pay_link || o.birth_missing ? "" : `<div class="form-actions"><button type="button" class="primary" data-pass-now aria-expanded="false">${esc(t("pay.payNow"))}</button></div>`}
      <details class="pass-parent">
        <summary>${esc(t("pay.parentOptions"))}</summary>
        <button type="button" class="secondary" data-pass-link>${esc(t("pay.askParent"))}</button>
      </details>
      <div class="pass-link-out"></div>
      <div class="pass-pay" hidden>
        ${consentFields()}
        <button type="submit" class="primary">${esc(t("pay.continue"))}</button>
      </div>
      <p class="form-error" role="alert" hidden></p>
    </form>`;
  hydrateIcons?.(el);
  const form = el.querySelector("form");
  const err = form.querySelector(".form-error");
  const fail = (e) => {
    err.textContent = e.message;
    err.hidden = false;
  };
  const body = () => ({ student_id: studentId, days: Number(form.days.value), test_date: o.test.date, test_name: o.test.name });
  form.querySelector("[data-pass-link]").addEventListener("click", async (e) => {
    err.hidden = true;
    e.target.disabled = true;
    try {
      const r = await api("/api/billing/pay-link", { method: "POST", body: { kind: "pass", ...body() } });
      // Ena pot naenkrat: povezava za starše skrije plačilo v aplikaciji.
      const pay = form.querySelector(".pass-pay");
      pay.hidden = true;
      form.querySelector("[data-pass-now]")?.setAttribute("aria-expanded", "false");
      const out = form.querySelector(".pass-link-out");
      out.innerHTML = linkBox(r.url);
      bindLinkBox(out, r.url, toast);
      out.scrollIntoView?.({ block: "nearest" });
      out.querySelector("input")?.focus();
    } catch (x) {
      fail(x);
    } finally {
      e.target.disabled = false;
    }
  });
  form.querySelector("[data-pass-now]")?.addEventListener("click", (e) => {
    const box = form.querySelector(".pass-pay");
    box.hidden = !box.hidden;
    if (!box.hidden) form.querySelector(".pass-link-out").innerHTML = "";
    e.target.setAttribute("aria-expanded", String(!box.hidden));
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.hidden = true;
    if (!consentsOk(form)) return fail(new Error(t("pay.consentMissing")));
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      const r = await api("/api/billing/pass", { method: "POST", body: { ...body(), ...consentBody() } });
      location.href = r.url;
    } catch (x) {
      btn.disabled = false;
      fail(x);
    }
  });
}
