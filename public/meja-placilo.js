// Kartica ob porabljenih brezplačnih vprašanjih za inštruktorja (j 2026-11-15, korak 5 načrta pilota):
// razlog in kdaj se vprašanja vrnejo (besedilo strežnika, server/usage.js BLOCK_TEXT), kaj prinese naročnina
// in en gumb: mladoletni (imetnik računa ali profil pod 18 na računu staršev) pošlje povezavo staršu,
// polnoleten imetnik odpre zavihek Račun.
//
// Pravila ponudb (server/placila/ponudbe.js: ne med poukom, učitelj jih lahko izklopi, pod 15 brez cene in brez
// gumba za plačilo, ne učencu iz šole) uveljavi strežnik: namig »block.hintParent« / »block.hintAdult« doda samo,
// ko sme ponudba imeti ceno (server/accounts/index.js upsell → moreHintCode). Brez takega namiga kartica ne
// pokaže ničesar o naročnini. Samo naročnina, brez paketa pred testom (j). Brez odštevanja, nujnosti in značk.
import { t, locale } from "./i18n.js";
import { icon } from "./icons.js";
import { linkBox, bindLinkBox } from "./pay-ui.js";
import { levelPrices } from "./pristajalna.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// Valute brez decimalk imajo v ceniku cele enote (server/accounts/plans.js ZERO_DECIMAL, enako public/account.js money).
const ZERO_DECIMAL = new Set(["VND", "XOF", "XAF", "UGX", "RWF", "JPY", "KRW", "GNF", "MGA"]);
const money = (minor, currency) => {
  const major = ZERO_DECIMAL.has(currency) ? minor : minor / 100;
  const digits = currency !== "EUR" && Number.isInteger(major) ? 0 : 2;
  return major.toLocaleString(locale(), { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits });
};

// Kode porabljenega brezplačnega dela (server/usage.js BLOCK_TEXT; server/accounts/index.js freeBlock, aiBlockFor).
export const FREE_LIMIT_CODES = new Set(["block.freeDaily", "block.freeMonth", "block.freePool", "block.trialOut"]);
const OFFER_HINTS = new Set(["block.hintParent", "block.hintAdult"]);

// Katero različico pokažemo. body: telo odgovora 429 ({ code, hint, params }); status: /api/account/status;
// prices: /api/account/prices; level: stopnja profila (OS, SS, FAKS); inApp: aplikacija iz trgovine
// (nakupa mimo trgovine ne ponudimo). Vrne null (ni kartice), ali { kind, price, action }:
// kind "guest" | "plain" (brez ponudbe) | "offer"; action "link" | "account" | null; price: niz ali "";
// payOn: plačila delujejo.
export function limitVariant({ body, status = null, prices = null, level = "OS", inApp = false } = {}) {
  const code = body?.code;
  if (!FREE_LIMIT_CODES.has(code)) return null;
  if (body.hint === "block.hintGuest") return { kind: "guest", price: "", action: null, payOn: false };
  // Aplikacija iz trgovine: nakupov mimo trgovine ne ponuja (docs/mobilna-aplikacija.md), zato brez ponudbe.
  if (!OFFER_HINTS.has(body.hint) || inApp) return { kind: "plain", price: "", action: null, payOn: false };
  // Plačila delujejo: računi vklopljeni, prijavljen pravi račun, Stripe nastavljen, cenik ima pakete.
  const plans = prices?.plans || [];
  const payOn = !!status?.enabled && !!status.logged_in && !!status.parent && !status.parent.guest && !!status.billing && plans.length > 0;
  // Cena enega profila velja samo za račun z enim profilom: paket za 1 profil ima stopnjo prvega profila
  // (server/accounts/index.js planForAccount), pri več profilih pa izbira med paketi ostane v zavihku Račun.
  const single = (status?.children ?? 0) <= 1;
  const lp = payOn && single ? levelPrices(prices, money) : {};
  const price = lp[level]?.month || "";
  const parentPays = !!status?.parent?.minor || body.hint === "block.hintParent";
  let action = null;
  if (payOn && !status.parent.birth_missing) {
    if (!parentPays) action = "account";
    else if (single) action = "link";
  }
  return { kind: "offer", price, action, payOn };
}

// Besedilo razloga v jeziku vmesnika (kot public/app.js serverError, brez namiga).
const reason = (body) => {
  const own = t(body.code, body.params || {});
  return own && own !== body.code ? own : body.error || "";
};
const hintText = (body) => {
  const h = typeof body.hint === "string" ? t(body.hint) : "";
  return h && h !== body.hint ? h : "";
};

export function limitCardHtml(v, body) {
  const facts = v.kind === "offer"
    ? [v.price ? t("meja.price", { price: v.price }) : "", t("meja.more"), t("meja.deep"), t("meja.lessons")].filter(Boolean)
    : [];
  // Namig strežnika (»ustvari račun«, »naj starš izbere naročnino«) ostane, ko ni gumba, ki ga nadomesti,
  // razen ko plačila ne delujejo (takrat bi pošiljal v zavihek, kjer nakupa ni).
  const hint = v.kind === "guest" || (v.kind === "offer" && !v.action && v.payOn) ? hintText(body) : "";
  const btn = v.action === "link"
    ? `<button type="button" class="primary" data-meja-link>${icon("send")} <span>${esc(t("meja.btnParent"))}</span></button>`
    : v.action === "account"
      ? `<button type="button" class="primary" data-meja-account>${icon("wallet")} <span>${esc(t("meja.btnAdult"))}</span></button>`
      : "";
  return `<div class="meja-head">${icon("info")}<p>${esc(reason(body))}${hint ? ` ${esc(hint)}` : ""}</p></div>
    ${facts.length ? `<div class="meja-plus"><p class="meja-sub">${esc(t("meja.sub"))}</p><ul>${facts.map((f) => `<li>${icon("check")}<span>${esc(f)}</span></li>`).join("")}</ul></div>` : ""}
    <div class="meja-out"></div>
    <div class="meja-actions">${btn}<button type="button" class="text-btn" data-meja-practice>${esc(t("meja.practice"))} ${icon("chevron-right")}</button></div>
    <p class="form-error" role="alert" hidden></p>`;
}

// Kartico vstavi v klepet (box = #messages, ki je aria-live) in poveže gumbe. Fokusa ne prevzame.
// ctx: { api, level, inApp, toast, openAccount, openPractice }.
export async function showLimitCard(box, body, ctx) {
  if (!FREE_LIMIT_CODES.has(body?.code)) return null;
  const el = document.createElement("div");
  el.className = "msg assistant meja-card";
  el.setAttribute("role", "group");
  el.setAttribute("aria-label", t("meja.label"));
  // Stanje računa in cenik samo, ko sme strežnik ponuditi naročnino (namig s ceno).
  let status = null;
  let prices = null;
  if (OFFER_HINTS.has(body.hint) && !ctx.inApp) {
    [status, prices] = await Promise.all([ctx.api("/api/account/status").catch(() => null), ctx.api("/api/account/prices").catch(() => null)]);
  }
  const v = limitVariant({ body, status, prices, level: ctx.level, inApp: ctx.inApp });
  el.dataset.variant = `${v.kind}${v.action ? `-${v.action}` : ""}`;
  el.innerHTML = limitCardHtml(v, body);
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
  const err = el.querySelector(".form-error");
  el.querySelector("[data-meja-practice]")?.addEventListener("click", () => ctx.openPractice());
  el.querySelector("[data-meja-account]")?.addEventListener("click", () => ctx.openAccount());
  el.querySelector("[data-meja-link]")?.addEventListener("click", async (e) => {
    const b = e.currentTarget;
    err.hidden = true;
    b.disabled = true;
    try {
      // Mesečna naročnina za en profil (cena, ki jo kartica pokaže); starš na strani povezave vidi paket in znesek.
      const r = await ctx.api("/api/billing/pay-link", { method: "POST", body: { kind: "sub", seats: 1, interval: "month" } });
      const out = el.querySelector(".meja-out");
      out.innerHTML = linkBox(r.url);
      bindLinkBox(out, r.url, ctx.toast);
      b.hidden = true;
      // Fokus ostane učencu: polje s povezavo samo pokažemo (klik je bil njegov).
      out.scrollIntoView?.({ block: "nearest" });
    } catch (x) {
      err.textContent = x.message;
      err.hidden = false;
      b.disabled = false;
    }
  });
  return el;
}
