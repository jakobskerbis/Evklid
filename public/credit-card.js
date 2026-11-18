// Kartica »Dodatna poraba AI« v zavihku Račun (server/accounts/billing.js, /api/billing/credit).
// Vsak profil ima mesečni del skupnega proračuna AI (server/proracun.js); ko ga porabi, imetnik računa
// tukaj dokupi pogovore, ki veljajo za vse profile računa in ne potečejo. Prikazano je samo število
// pogovorov, ne delež plačila ali znesek kredita (j 2026-10-30).
import { t, locale } from "./i18n.js";
import { icon, hydrateIcons } from "./icons.js";
import { consentFields, consentsOk, consentBody, markCheckout } from "./pay-ui.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// Cela vsota brez »,00« (10 €), sicer na cent (j 2026-11-15: »Nadaljuj za skupaj 10 €«).
const money = (cents, currency) =>
  (cents / 100).toLocaleString(locale(), { style: "currency", currency, minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 });

// Enočrkovni predlog (»z«, »v«, »s«) ostane ob naslednji besedi, da ne visi sam na koncu vrstice.
const glue = (s) => s.replace(/(^|\s)(\p{L})\s/gu, "$1$2\u00a0");

// Vrne preostale pogovore (public/account.js refreshAfterPay primerja, ali se je kaj spremenilo).
// buy: false v aplikaciji iz trgovine (public/pay-ui.js): samo preostali pogovori, brez dokupa.
export async function renderCreditCard(el, { api, buy = true }) {
  if (!el) return;
  let d;
  try {
    d = await api("/api/billing/credit");
  } catch {
    el.innerHTML = "";
    return 0;
  }
  if (!buy) {
    el.innerHTML = d.balance_conversations
      ? `<div class="card credit-card"><h2>${icon("zap")} ${esc(t("credit.title"))}</h2><p><b>${esc(t("credit.balance", { n: d.balance_conversations }))}</b></p></div>`
      : "";
    hydrateIcons?.(el);
    return d.balance_conversations || 0;
  }
  if (!d.packs?.length && !d.balance_conversations) {
    el.innerHTML = "";
    return 0;
  }
  // Izbirne ploščice (j 2026-11-15 izjema: samo videz dokupa): cena je glavni element, ocena pogovorov ob njej
  // (na telefonu pod njo); privzeto je izbran srednji paket. Prave radijske tipke: puščice in Tab delujejo kot v brskalniku.
  // Razmerja do mesečne meje ne pokažemo: /api/billing/credit vrne samo pogovore paketa, ne meje profila.
  const pick = d.packs.length === 1 ? 0 : 1;
  const packs = d.packs
    .map(
      (p, i) => `<label class="credit-pack"><input type="radio" name="pack" value="${esc(p.id)}" data-price="${esc(money(p.amount, p.currency))}" ${i === pick ? "checked" : ""}>
        <b class="credit-price">${esc(money(p.amount, p.currency))}</b>
        <span class="credit-conv">${esc(glue(t("credit.est", { n: p.conversations })))}</span></label>`,
    )
    .join("");
  const canPay = d.billing && !d.minor && !d.birth_missing && d.packs.length;
  el.innerHTML = `
    <form class="card credit-card" novalidate>
      <h2>${icon("zap")} ${esc(t("credit.title"))}</h2>
      <p>${esc(t("credit.text"))}</p>
      ${d.balance_conversations ? `<p><b>${esc(t("credit.balance", { n: d.balance_conversations }))}</b></p>` : ""}
      ${
        !d.billing
          ? `<p class="muted">${esc(t("credit.off"))}</p>`
          : d.birth_missing
            ? `<p class="muted">${esc(t("birth.payMissing"))}</p>`
            : d.minor
            ? `<p class="muted">${esc(t("credit.minor"))}</p>`
            : `<fieldset class="credit-packs"><legend class="sr-only">${esc(t("credit.title"))}</legend>${packs}</fieldset>
      <p class="muted">${esc(t("credit.note"))}</p>`
      }
      ${canPay ? `${consentFields("credit")}<button type="submit" class="primary credit-go">${esc(t("pay.continue"))}</button>` : ""}
      <p class="form-error" role="alert" hidden></p>
    </form>`;
  hydrateIcons?.(el);
  const form = el.querySelector("form");
  const err = form.querySelector(".form-error");
  // En gumb s skupnim zneskom izbranega paketa; besedilo sledi izbiri.
  const go = form.querySelector(".credit-go");
  const total = () => {
    const price = form.querySelector('input[name="pack"]:checked')?.dataset.price;
    if (go && price) go.textContent = t("credit.payTotal", { price });
  };
  total();
  form.addEventListener("change", (e) => e.target.name === "pack" && total());
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
      markCheckout("credit");
      location.href = r.url;
    } catch (x) {
      btn.disabled = false;
      err.textContent = x.message;
      err.hidden = false;
    }
  });
  return d.balance_conversations || 0;
}
