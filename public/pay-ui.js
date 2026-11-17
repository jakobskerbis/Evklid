// Skupni deli plačilnih zaslonov: tri potrditve pred plačilom (polnoletnost, odstop, pogoji) in povezava »Prosi starše za plačilo«.
// Uporabljajo jih zavihek Račun (account.js), kartica paketa pred testom (pass-offer.js) in stran za starše (placaj.js).
import { t, currentLang } from "./i18n.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Dve obvezni potrditvi (besedilo hrani tudi strežnik ob vsakem plačilu).
// kind "gift": izjavi za nakup darilne kode (uporaba se začne šele ob vpisu kode).
export const consentFields = (kind = "") => `
  <label class="check pay-consent"><input type="checkbox" name="adult" required><span>${esc(t(kind === "gift" ? "pay.giftAdult" : "pay.adult"))}</span></label>
  <label class="check pay-consent"><input type="checkbox" name="withdrawal" required><span>${esc(t(kind === "gift" ? "pay.giftWithdrawal" : "pay.withdrawal"))}</span></label>
  ${termsField()}`;

// Potrditev splošnih pogojev (#765 točka 2): pred vsakim plačilom in ob registraciji. Strežnik shrani različico.
export const termsField = (name = "terms") => {
  const [before, after = ""] = t("terms.accept").split("{link}");
  return `<label class="check pay-consent"><input type="checkbox" name="${name}" required><span>${esc(before)}<a href="/pogoji.html" target="_blank" rel="noopener">${esc(t("terms.link"))}</a>${esc(after)}</span></label>`;
};

export const consentsOk = (form) => !!form.adult?.checked && !!form.withdrawal?.checked && !!form.terms?.checked;
// Sporočilo, ko kaj ni označeno: manjkajo samo pogoji → »terms.missing«, sicer sporočilo klicatelja.
export const consentMessage = (form, key) => (form.adult?.checked && form.withdrawal?.checked && !form.terms?.checked ? t("terms.missing") : t(key));
// Potrditve za strežnik, z jezikom, v katerem jih je plačnik prebral.
export const consentBody = () => ({ adult: true, withdrawal: true, terms: true, lang: currentLang() });

// Polje s povezavo za starše: kopiraj in (na telefonu) deli.
export const linkBox = (url) => `
  <div class="pay-link" role="group" aria-label="${esc(t("pay.askParent"))}">
    <p class="muted">${esc(t("pay.askParentText"))}</p>
    <div class="inline"><input readonly dir="ltr" value="${esc(url)}" aria-label="${esc(t("pay.linkLabel"))}">
      <button type="button" data-pay-copy>${esc(t("pay.copy"))}</button>
      ${navigator.share ? `<button type="button" data-pay-share>${esc(t("pay.share"))}</button>` : ""}
    </div>
  </div>`;

export function bindLinkBox(root, url, toast) {
  root.querySelector("[data-pay-copy]")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast(t("pay.copied"));
    } catch {
      root.querySelector(".pay-link input")?.select();
    }
  });
  root.querySelector("[data-pay-share]")?.addEventListener("click", () => {
    navigator.share({ title: t("pay.shareTitle"), text: t("pay.shareText"), url }).catch(() => {});
  });
}
