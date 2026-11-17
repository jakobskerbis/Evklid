// Kartica Poraba v Nastavitvah (samo skrbnik). Naloži se šele, ko jo strežnik dovoli (loadUsage v public/app.js);
// tu je le izris, dovoljenje in zahteva ostaneta v app.js.
import { t, locale } from "./i18n.js";

export function renderUsage(el, u, escapeHtml) {
  const eur = (x) => (x || 0).toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: x && x < 1 ? 3 : 2 }); // kot števec zgoraj: 3 decimalke le pod 1 €
  const L = u.limits || {};
  el.innerHTML = `<p>${t("usage.total", { usd: (u.month_usd || 0).toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })}${t("usage.eur", { eur: eur(u.month_eur) })}${u.budget_usd ? t("usage.budget", { budget: u.budget_usd.toLocaleString(locale()) }) : ""}${
    u.daily_questions ? t("usage.limit", { n: u.daily_questions }) : ""
  }</p>
  <p>${t("usage.summary", { active: u.active_students, avg: eur(u.per_active_eur), msg: eur(u.per_message_eur), proj: eur(u.projected_eur) })}</p>
  <p class="muted">${t("usage.saved", { count: u.saved_answers || 0 })}</p>
  ${L.daily_deep || L.student_soft_usd || L.student_hard_usd ? `<p class="muted">${t("usage.limits", { deep: L.daily_deep ?? "∞", soft: L.student_soft_usd ?? "∞", hard: L.student_hard_usd ?? "∞" })}</p>` : ""}
  <div class="md-table-wrap"><table class="table"><thead><tr><th>${t("usage.student")}</th><th>${t("usage.calls")}</th><th>${t("usage.savedCol")}</th><th>${t("usage.tokens")}</th><th>${t("usage.cost")}</th></tr></thead><tbody>
  ${u.students
    .map((s) => `<tr><td>${escapeHtml(s.name)}</td><td>${s.calls}</td><td>${s.saved || 0}</td><td>${s.input_tokens} / ${s.output_tokens} / ${s.cache_read_tokens}</td><td>${eur(s.cost_eur)} € <span class="muted">(${(s.cost_usd || 0).toLocaleString(locale(), { minimumFractionDigits: 3, maximumFractionDigits: 3 })} $)</span></td></tr>`)
    .join("")}</tbody></table></div>
  ${(u.by_model || []).length ? `<div class="md-table-wrap"><table class="table"><thead><tr><th>${t("usage.model")}</th><th>${t("usage.calls")}</th><th>${t("usage.tokens")}</th><th>${t("usage.cost")}</th></tr></thead><tbody>
  ${u.by_model
    .map((m) => `<tr><td>${escapeHtml(m.model)} <span class="muted">· ${escapeHtml(m.kind)}</span></td><td>${m.calls}</td><td>${m.input_tokens} / ${m.output_tokens} / ${m.cache_read_tokens}</td><td>${eur(m.cost_eur)} €</td></tr>`)
    .join("")}</tbody></table></div>` : ""}`;
}
