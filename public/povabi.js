// »Pokaži Evklida prijatelju«: majhna kartica s povezavo za povabilo takoj po uspehu (osvojena tema, opravljen
// preizkus znanja), ne le v zavihku Račun (j 2026-11-16, korak 6 načrta pilota). Povezava je ista kot v Računu
// (/api/account → referral.url); strežnika ta kartica ne spreminja. Pravila (povabiSme):
// - samo prijavljen račun (ne gost) z znano letnico imetnika in profila, oba 15 let zagotovo dopolnjena
//   (tekoče leto − letnica > 15, kot server/pilot-naloge.js photoAllowed);
// - ne v aplikaciji iz trgovine (EvklidApp/ v User-Agent): nagrada je vezana na plačilo na spletu;
// - največ enkrat na 7 dni na profil in ne 7 dni po »Ne zdaj« (localStorage evklid.povabi.<id>);
// - nagrado (mesec brezplačno) omeni le, ko plačila delujejo (acc.billing), račun ni v pilotu in imetnik ni mladoleten.
// Kartica se pokaže samo po končani nalogi ali preizkusu (app.js), nikoli med njima.
import { t } from "./i18n-osnova.js";
import { icon } from "./icons.js";

export const POVABI_DNI = 7;
export const POVABI_KLJUC = "evklid.povabi.";
const DAN = 86400000;

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const odrasel15 = (leto, now) => Number.isInteger(leto) && now.getFullYear() - leto > 15;

// Zapis na napravi: { shown: ms, dismissed: ms } ali null.
export function preberiZapis(storage, id) {
  try {
    const v = JSON.parse(storage.getItem(POVABI_KLJUC + id) || "null");
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
}
function zapisi(storage, id, rec) {
  try {
    storage.setItem(POVABI_KLJUC + id, JSON.stringify(rec));
  } catch {}
}

// Pravila, ki jih poznamo brez računa (aplikacija iz trgovine, 7 dni): preverimo jih pred klicem /api/account.
export function povabiNaNapravi({ profileId, now = new Date(), storage, ua = "" }) {
  if (/ EvklidApp\//.test(ua)) return false;
  const rec = storage ? preberiZapis(storage, profileId) : null;
  const meja = now.getTime() - POVABI_DNI * DAN;
  return !(rec && ((rec.shown || 0) > meja || (rec.dismissed || 0) > meja));
}

// Ali smemo kartico pokazati? Vrne { reward } ali null.
export function povabiSme({ acc, profileId, now = new Date(), storage, ua = "" }) {
  if (!acc || !acc.parent || acc.parent.guest || !acc.referral?.url) return null;
  if (!povabiNaNapravi({ profileId, now, storage, ua })) return null;
  const profil = (acc.children || []).find((c) => String(c.id) === String(profileId));
  if (!profil || !odrasel15(profil.birth_year, now)) return null;
  if (acc.parent.birth_missing || !odrasel15(acc.parent.birth_year, now)) return null;
  return { reward: !!acc.billing && !acc.pilot && !acc.parent.minor };
}

export function povabiHtml(url, { reward }) {
  const share = typeof navigator !== "undefined" && navigator.share;
  return `<div class="povabi card" role="group" aria-labelledby="povabi-h">
    <div class="povabi-glava"><span class="povabi-ic" aria-hidden="true">${icon("user-plus")}</span>
      <div class="povabi-t"><b id="povabi-h">${esc(t("povabi.title"))}</b><small>${esc(t("povabi.text"))}</small></div></div>
    ${reward ? `<p class="povabi-nagrada">${esc(t("povabi.reward"))}</p>` : ""}
    <div class="povabi-vrsta"><input readonly dir="ltr" value="${esc(url)}" aria-label="${esc(t("povabi.link"))}">
      <button type="button" class="secondary" data-povabi-copy>${icon("copy")}${esc(t("pay.copy"))}</button>
      ${share ? `<button type="button" class="secondary" data-povabi-share>${icon("share")}${esc(t("pay.share"))}</button>` : ""}
    </div>
    <button type="button" class="text-btn povabi-ne" data-povabi-later>${esc(t("povabi.later"))}</button>
  </div>`;
}

// Enkrat na nalaganje strani: isti klic kot zavihek Račun; napaka (brez računa, zaklenjen račun, brez povezave) = null.
let accPromise = null;
const naloziRacun = (api) => (accPromise ||= api("/api/account").catch(() => null));
export const _ponastavi = () => (accPromise = null);

// Pokaže kartico v `slot`, če pravila to dovolijo; vse napake tiho.
export async function povabiPoUspehu(slot, opts) {
  try {
    await pokazi(slot, opts);
  } catch {}
}
async function pokazi(slot, { api, profileId, toast = () => {}, alive = () => true }) {
  if (!slot || profileId == null) return;
  let storage = null;
  try {
    storage = window.localStorage;
  } catch {}
  if (!povabiNaNapravi({ profileId, storage, ua: navigator.userAgent || "" })) return; // brez klica /api/account
  const acc = await naloziRacun(api);
  if (!alive() || !slot.isConnected) return;
  const ok = povabiSme({ acc, profileId, storage, ua: navigator.userAgent || "" });
  if (!ok) return;
  const url = acc.referral.url;
  slot.innerHTML = povabiHtml(url, ok);
  const rec = (storage && preberiZapis(storage, profileId)) || {};
  if (storage) zapisi(storage, profileId, { ...rec, shown: Date.now() });
  slot.querySelector("[data-povabi-copy]")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast(t("pay.copied"));
    } catch {
      slot.querySelector(".povabi input")?.select();
    }
  });
  slot.querySelector("[data-povabi-share]")?.addEventListener("click", () => {
    navigator.share({ title: t("povabi.title"), text: t("povabi.shareText"), url }).catch(() => {});
  });
  slot.querySelector("[data-povabi-later]")?.addEventListener("click", () => {
    const r = (storage && preberiZapis(storage, profileId)) || {};
    if (storage) zapisi(storage, profileId, { ...r, dismissed: Date.now() });
    slot.innerHTML = "";
  });
}
