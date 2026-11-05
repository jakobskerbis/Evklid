// Kartica »Dodatna poraba AI« v zavihku Račun (server/accounts/billing.js, /api/billing/credit).
// Vsak profil ima mesečni del skupnega proračuna AI (server/proracun.js); ko ga porabi, imetnik računa
// tukaj dokupi pogovore, ki veljajo za vse profile računa in ne potečejo. Prikazano je samo število
// pogovorov, ne delež plačila ali znesek kredita (j 2026-10-30).
import { t, locale } from "./i18n.js";
import { icon, hydrateIcons } from "./icons.js";
import { consentFields, consentsOk, consentBody } from "./pay-ui.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const money = (cents, currency) => (cents / 100).toLocaleString(locale(), { style: "currency", currency });

export async function renderCreditCard(el, { api }) {
  if (!el) return;
  let d;
  try {
    d = await api("/api/billing/credit");
  } catch {
    el.innerHTML = "";
    return;
  }
  if (!d.packs?.length && !d.balance_conversations) {
    el.innerHTML = "";
    return;
  }
  // Ploščice: cena zgoraj, ocena pogovorov pod njo; izbrana ploščica dobi obrobo in kljukico.
  const packs = d.packs
    .map(
      (p, i) => `<label class="credit-pack"><input type="radio" name="pack" value="${esc(p.id)}" ${i === 1 || d.packs.length === 1 ? "checked" : ""}>
        <b class="credit-price">${esc(money(p.amount, p.currency))}</b>
        <span class="credit-conv">${esc(t("credit.est", { n: p.conversations }))}</span></label>`,
    )
    .join("");
  const canPay = d.billing && !d.minor && d.packs.length;
  el.innerHTML = `
    <form class="card credit-card" novalidate>
      <h2>${icon("zap")} ${esc(t("credit.title"))}</h2>
      <p>${esc(t("credit.text"))}</p>
      ${d.balance_conversations ? `<p><b>${esc(t("credit.balance", { n: d.balance_conversations }))}</b></p>` : ""}
      ${
        !d.billing
          ? `<p class="muted">${esc(t("credit.off"))}</p>`
          : d.minor
            ? `<p class="muted">${esc(t("credit.minor"))}</p>`
            : `<fieldset class="credit-packs"><legend class="sr-only">${esc(t("credit.title"))}</legend>${packs}</fieldset>
      <p class="muted">${esc(t("credit.note"))}</p>`
      }
      ${canPay ? `${consentFields()}<button type="submit" class="primary">${esc(t("pay.continue"))}</button>` : ""}
      <p class="form-error" role="alert" hidden></p>
    </form>`;
  hydrateIcons?.(el);
  const form = el.querySelector("form");
  const err = form.querySelector(".form-error");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.hidden = true;
    if (!canPay) return;
    if (!consentsOk(form)) {
      err.textContent = t("pay.consentMissing");
      err.hidden = false;
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      const r = await api("/api/billing/credit", { method: "POST", body: { pack: form.pack.value, ...consentBody() } });
      location.href = r.url;
    } catch (x) {
      btn.disabled = false;
      err.textContent = x.message;
      err.hidden = false;
    }
  });
}
