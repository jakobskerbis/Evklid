// Raven razlage 3D modelov (j, 6. 11. 14:37): vsi deli so na vseh ravneh vidni; po ravni (1 Osnovno, 2 Srednja šola,
// 3 Študij) se prilagodi samo razlaga dela: OŠ preprosto (»opisOs«), SŠ »opis« z latinskim imenom, študij še
// »opisStudij«. Globlje besedilo je vedno dosegljivo pod »Več o tem« (nič ni zaklenjeno). Začetna raven je raven
// profila: aplikacija poda vir nastavitev (app.js: nastaviVirRavni(() => state.student?.settings)), okvir »Uči se«
// jo dobi v naslovu (uci-se.js: /3d?raven=…), samostojna stran /3d brez profila »?raven=« ali SŠ.
import { stopnja } from "../stopnja.js";

let vir = () => null;
export function nastaviVirRavni(fn) {
  if (typeof fn === "function") vir = fn;
}
export function ravenProfila() {
  let s = null;
  try {
    s = vir();
  } catch {}
  if (!s) {
    let q = null;
    try {
      q = Number(new URLSearchParams(globalThis.location?.search || "").get("raven"));
    } catch {}
    return [1, 2, 3].includes(q) ? q : 2;
  }
  const st = stopnja(s);
  return st === "FAKS" ? 3 : st === "SS" ? 2 : 1;
}

/**
 * Razlaga dela za raven: { opis, la, vec } – opis za to raven, latinsko ime (OŠ: v »Več o tem«) in globlje besedilo
 * za »Več o tem« (null, če ga ni).
 */
export function razlaga(d, raven) {
  const os = d?.opisOs || d?.opis || "";
  const ss = d?.opis || d?.opisOs || "";
  const st = d?.opisStudij || "";
  if (raven <= 1) {
    const vec = [ss !== os ? ss : "", st].filter(Boolean).join(" ");
    return { opis: os, la: null, vec: [d?.la, vec].filter(Boolean).join(" · ") || null };
  }
  if (raven === 2) return { opis: ss, la: d?.la || null, vec: st || null };
  return { opis: [ss, st].filter(Boolean).join(" "), la: d?.la || null, vec: null };
}
// Ali ima model besedila po ravneh (pokaži preklop »OŠ / SŠ / Študij«).
export const imaRavni = (deli) => (deli || []).some((d) => d.opisOs || d.opisStudij);
