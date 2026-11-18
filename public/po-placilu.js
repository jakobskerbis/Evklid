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
// Zapis ostane, dokler naročnina ni plačana (morda se je vrnil sredi plačila) ali ne poteče (2 uri).
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
      if (paid) clearCheckout();
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
