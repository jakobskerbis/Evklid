// Skupni deli plačilnih zaslonov: tri potrditve pred plačilom (polnoletnost, odstop, pogoji) in povezava »Prosi starše za plačilo«.
// Uporabljajo jih zavihek Račun (account.js), kartica paketa pred testom (pass-offer.js) in stran za starše (placaj.js).
// Spodaj še aplikacija iz trgovine (isStoreApp) in vrnitev v aplikacijo po plačilu (watchReturnFromPay).
import { t, currentLang, locale } from "./i18n.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Dve obvezni potrditvi (besedilo hrani tudi strežnik ob vsakem plačilu).
// kind "gift": izjavi za nakup darilne kode (uporaba se začne šele ob vpisu kode).
// kind "credit": dokup pogovorov (ob odstopu se vrne delež neporabljenih pogovorov, ne delež časa).
const WITHDRAWAL_KEY = { gift: "pay.giftWithdrawal", credit: "pay.creditWithdrawal" };
export const consentFields = (kind = "") => `
  <label class="check pay-consent"><input type="checkbox" name="adult" required><span>${esc(t(kind === "gift" ? "pay.giftAdult" : "pay.adult"))}</span></label>
  <label class="check pay-consent"><input type="checkbox" name="withdrawal" required><span>${esc(t(WITHDRAWAL_KEY[kind] || "pay.withdrawal"))}</span></label>
  ${termsField()}`;

// Potrditev splošnih pogojev (#765 točka 2): pred vsakim plačilom in ob registraciji. Strežnik shrani različico;
// ob povezavi je različica pogojev (iz /api/config, ko pride; prej je prazna in skrita).
let termsVersion = "";
const versionLabel = (v) => {
  const [y, m, d] = String(v).split("-").map(Number);
  return y ? t("terms.version", { date: new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString(locale(), { day: "numeric", month: "numeric", year: "numeric", timeZone: "UTC" }) }) : "";
};
const fillVersions = () => document.querySelectorAll(".terms-version").forEach((el) => ((el.textContent = ` ${versionLabel(termsVersion)}`), (el.hidden = !termsVersion)));
if (typeof document !== "undefined" && typeof fetch === "function")
  fetch("/api/config")
    .then((r) => (r.ok ? r.json() : null))
    .then((c) => {
      termsVersion = String(c?.terms?.version || "");
      fillVersions();
    })
    .catch(() => {});
export const termsField = (name = "terms") => {
  const [before, after = ""] = t("terms.accept").split("{link}");
  const v = termsVersion ? ` ${esc(versionLabel(termsVersion))}` : "";
  return `<label class="check pay-consent"><input type="checkbox" name="${name}" required><span>${esc(before)}<a href="/pogoji.html" target="_blank" rel="noopener">${esc(t("terms.link"))}</a>${esc(after)}<span class="terms-version muted"${v ? "" : " hidden"}>${v}</span></span></label>`;
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

// Plačila s Stripom in aplikacija Evklid (mobile/src/app/web.tsx: User-Agent »EvklidApp/<različica> <kanal>«).
// 1) Različica iz trgovine (Google Play, App Store; kanal »store«): po pravilih trgovin (Apple 3.1.1, Google Play
//    Payments) v njej ni nakupa s kartico. Splet tam ne pokaže naročnine, darila, dokupa, paketa pred testom ali
//    povezave za plačilo staršu (public/account.js, credit-card.js, pass-offer.js); strežnik takšne zahteve zavrne
//    (server/mobile/trgovina.js). APK z evklid.app (kanal »direct«) in starejše aplikacije brez kanala ostanejo, kot so.
// 2) Vrnitev po plačilu v APK: Stripe se odpre v zavihku brskalnika (Custom Tab), stran za uspeh se naloži tam, ne
//    v aplikaciji. Tik pred odhodom na Stripe si zapomnimo nakup (sessionStorage); ko se učenec ali starš vrne v
//    aplikacijo (dogodek »evklid:spet« iz web.tsx ali visibilitychange), stran vpraša strežnik za novo stanje in
//    zavihek Račun izriše znova, da ne vidi starega stanja in ne plača dvakrat.
export const STORE_APP_UA = / EvklidApp\/\S+ store\b/;
export const isStoreApp = (ua = globalThis.navigator?.userAgent) => STORE_APP_UA.test(String(ua || ""));

const FLAG = "evklid.checkout";
const KIND = "evklid.checkout.vrsta";
export const CHECKOUT_MAX_AGE = 2 * 3600 * 1000; // starejši zapis ne velja več
export const REFRESH_GAP = 5000; // največ ena osvežitev na 5 s

const ss = () => {
  try {
    return globalThis.sessionStorage || null;
  } catch {
    return null; // zasebno okno ali izklopljena shramba
  }
};

// kind: »sub« (naročnina), »gift«, »credit«, »pass«.
export function markCheckout(kind = "sub") {
  try {
    ss()?.setItem(FLAG, String(Date.now()));
    ss()?.setItem(KIND, String(kind));
  } catch {}
}

export function clearCheckout() {
  try {
    ss()?.removeItem(FLAG);
    ss()?.removeItem(KIND);
  } catch {}
}

// Ali čaka nakup, ki je bil začet v zadnjih 2 urah. Star ali pokvarjen zapis pobriše.
export function checkoutPending(now = Date.now()) {
  const raw = ss()?.getItem(FLAG);
  if (!raw) return false;
  const age = now - Number(raw);
  if (!(age >= 0 && age < CHECKOUT_MAX_AGE)) {
    clearCheckout();
    return false;
  }
  return true;
}

// Ob vrnitvi v aplikacijo: POST /api/billing/sync (strežnik vpraša Stripe), nato onSynced({ acc, becamePaid }).
// Zapis naročnine ostane, dokler ni plačana (morda se je vrnil sredi plačila) ali ne poteče (2 uri); zapis
// enkratnega plačila se pobriše po prvi uspešni osvežitvi.
// Vrne funkcijo za ročni klic (preizkusi).
export function watchReturnFromPay({ api, onSynced, now = () => Date.now(), win = globalThis }) {
  let last = -Infinity;
  let busy = false;
  const run = async () => {
    if (busy || !checkoutPending(now()) || now() - last < REFRESH_GAP) return;
    last = now();
    busy = true;
    try {
      const sub = ss()?.getItem(KIND) === "sub";
      const acc = await api("/api/billing/sync", { method: "POST" });
      const paid = acc?.access?.tier === "paid";
      // Enkratno plačilo (darilo, dokup, paket, Podari): ena osvežitev; naročnina: dokler ni plačana.
      if (paid || !sub) clearCheckout();
      await onSynced?.({ acc, becamePaid: paid && sub });
    } catch {
      // brez povezave ali plačila izklopljena: poskusimo ob naslednji vrnitvi
    } finally {
      busy = false;
    }
  };
  win.addEventListener?.("evklid:spet", run);
  const doc = win.document;
  doc?.addEventListener?.("visibilitychange", () => doc.visibilityState === "visible" && run());
  return run;
}
