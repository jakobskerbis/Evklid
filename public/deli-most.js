// Most za deljenje slike v mobilni aplikaciji (WebView, mobile/src/app/web.tsx). WebView ne podpira Web Share
// z datotekami ne prenosa, zato stran PNG pošlje aplikaciji (base64), ta ga zapiše v predpomnilnik in odpre
// sistemski meni za deljenje (expo-sharing). Od tam ga učenec shrani v Galerijo/Datoteke ali deli.
// Čiste funkcije brez DOM-a: uporabljata jih splet (public/zbirke-view.js) in aplikacija (web.tsx), preizkus
// test/deli-most.test.js.
// - Zmožnost: aplikacija, ki most ima, pred nalaganjem strani nastavi window.EvklidNative = { shareImage: 1 }.
//   Starejši APK zastavice nima, zato je gumb »Deli zbirko« tam še vedno skrit.

export const SHARE_IMAGE = "evklid:share-image"; // stran → aplikacija
export const SHARE_IMAGE_RESULT = "evklid:share-image-result"; // aplikacija → stran (dogodek na window)
export const SHARE_IMAGE_MAX = 5 * 1024 * 1024; // največ 5 MB slike (dekodirano)
const PNG_B64 = "iVBORw0KGgo"; // začetek PNG (\x89PNG\r\n\x1a\n) v base64
const NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}\.png$/;
const B64 = /^[A-Za-z0-9+/]+={0,2}$/;

// Kako stran deli kartico: "bridge" (aplikacija z mostom), "browser" (Web Share ali prenos) ali "" (gumba ni:
// aplikacija brez mostu). ua = navigator.userAgent, native = window.EvklidNative.
export function shareMode(ua, native) {
  if (!/ EvklidApp\//.test(String(ua || ""))) return "browser";
  return Number(native?.shareImage) >= 1 ? "bridge" : "";
}

// Dekodirana velikost base64 v bajtih.
export const base64Bytes = (s) => (s.length / 4) * 3 - (s.endsWith("==") ? 2 : s.endsWith("=") ? 1 : 0);

// Preveri sporočilo strani v aplikaciji. Vrne { ok: true, id, name, dataBase64 } ali { ok: false, id, error }.
// Sprejme le PNG v base64 (brez predpone data:) do SHARE_IMAGE_MAX in varno ime datoteke.
/** @returns {{ ok: true, id: string, name: string, dataBase64: string } | { ok: false, id: string, error: string }} */
export function checkShareImage(m) {
  if (!m || typeof m !== "object" || m.type !== SHARE_IMAGE) return { ok: false, id: "", error: "type" };
  const id = typeof m.id === "string" ? m.id.slice(0, 64) : "";
  const fail = (error) => ({ ok: false, id, error });
  if (typeof m.name !== "string" || !NAME.test(m.name)) return fail("name");
  const d = m.dataBase64;
  if (typeof d !== "string" || !d) return fail("data");
  // Hitra meja pred regexom: base64 je 4/3 velikosti slike.
  if (d.length > Math.ceil(SHARE_IMAGE_MAX / 3) * 4) return fail("size");
  if (d.length % 4 || !B64.test(d)) return fail("data");
  if (base64Bytes(d) > SHARE_IMAGE_MAX) return fail("size");
  if (!d.startsWith(PNG_B64)) return fail("png");
  return { ok: true, id, name: m.name, dataBase64: d };
}

// Odgovor aplikacije → ključ prevoda za sporočilo pod gumbom. Uspeh pomeni le, da se je meni odprl: ali je
// učenec sliko shranil ali delil, aplikacija ne ve, zato tega ne trdimo. Brez odgovora v SHARE_IMAGE_TIMEOUT
// (error "timeout") sporočila ni: meni je morda še odprt (Android odgovori šele, ko se zapre), zato ne trdimo
// ne uspeha ne napake, gumb pa spet deluje.
export const SHARE_IMAGE_TIMEOUT = 120000;
export const shareResultKey = (r) => (r?.ok === true ? "share.appOpened" : r?.error === "timeout" ? "" : "share.appFailed");

// JavaScript, ki ga aplikacija vbrizga v stran z odgovorom (injectJavaScript).
export function shareResultJs(r) {
  const detail = JSON.stringify({ id: String(r?.id || ""), ok: r?.ok === true, error: r?.ok === true ? "" : String(r?.error || "error").slice(0, 200) });
  return `(function(){try{window.dispatchEvent(new CustomEvent(${JSON.stringify(SHARE_IMAGE_RESULT)},{detail:${detail}}));}catch(e){}})();true;`;
}

// Zastavica zmožnosti, ki jo aplikacija vbrizga pred nalaganjem strani.
export const NATIVE_FLAG_JS = "(function(){try{window.EvklidNative=Object.assign(window.EvklidNative||{},{shareImage:1});}catch(e){}})();true;";
