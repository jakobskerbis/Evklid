// Opomnik za potrditev e-naslova po rešeni nalogi (#747, j 2026-11-17): nov učenec najprej reši prvo nalogo, šele
// nato ga prosimo za potrditev. Kartica je pod povratno informacijo pravilno rešene naloge (public/app.js), ne zid:
// »Pošlji znova« pošlje novo povezavo (strežnik: 3 na 15 min), »Pozneje« jo skrije za en dan. Ko je e-naslov potrjen
// (ali račun ni pravi račun z e-naslovom), se ne pokaže nič.
import { t } from "./i18n.js";
import { accountStatus } from "./account.js";

export const LATER_KEY = "evklid.potrdi_pozneje";
const LATER_MS = 24 * 3600000;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const later = () => {
  try {
    return Date.now() - Number(localStorage.getItem(LATER_KEY) || 0) < LATER_MS;
  } catch {
    return false;
  }
};
const needs = (st) => !!st?.logged_in && !!st.parent && !st.parent.guest && !st.parent.verified && !!st.parent.email;

export async function potrdiPoNalogi(slot) {
  if (!slot || later() || !needs(accountStatus())) return;
  // Sveže stanje: e-naslov je morda potrjen v drugem zavihku.
  let st;
  try {
    const res = await fetch("/api/account/status", { headers: { "Content-Type": "application/json" } });
    st = res.ok ? await res.json() : null;
  } catch {
    return;
  }
  if (!needs(st) || !slot.isConnected) return;
  slot.innerHTML = `<div class="card potrdi-kartica">
    <h3>${esc(t("verify.nudgeTitle"))}</h3>
    <p>${esc(t("verify.nudgeText", { email: st.parent.email }))}</p>
    <div class="actions"><button type="button" class="secondary" data-potrdi="znova">${esc(t("verify.resend"))}</button><button type="button" data-potrdi="pozneje">${esc(t("verify.later"))}</button></div>
    <p class="muted small-note" role="status" aria-live="polite"></p>
  </div>`;
  const note = slot.querySelector('[role="status"]');
  const send = slot.querySelector('[data-potrdi="znova"]');
  send.addEventListener("click", async () => {
    send.disabled = true;
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST", headers: { "Content-Type": "application/json" } });
      const r = await res.json().catch(() => ({}));
      if (r.verified) return (slot.innerHTML = "");
      if (res.status === 429) note.textContent = t("verify.tooMany", { min: Math.max(1, Math.ceil((Number(r.retry_after) || 900) / 60)) });
      else if (!res.ok) throw new Error(r.error || String(res.status));
      else note.textContent = t("verify.sent");
    } catch (err) {
      send.disabled = false;
      note.textContent = err instanceof TypeError ? t("lock.offline") : err.message;
    }
  });
  slot.querySelector('[data-potrdi="pozneje"]').addEventListener("click", () => {
    try {
      localStorage.setItem(LATER_KEY, String(Date.now()));
    } catch {}
    slot.innerHTML = "";
  });
}
