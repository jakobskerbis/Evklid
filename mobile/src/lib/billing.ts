// Naročnina v aplikaciji.
// - Različica za trgovine (CHANNEL "store"): Apple In-App Purchase / Google Play Billing (expo-iap).
//   Trgovini to zahtevata za digitalne naročnine. Nakup potrdi strežnik (server/mobile/store-billing.js),
//   šele nato ga aplikacija zaključi (finishTransaction).
// - Neposredni prenos (CHANNEL "direct", APK z evklid.app): obstoječe plačilo prek Stripa v brskalniku.
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { api, CHANNEL } from "./api";

export type StoreProduct = { id: string; seats: number; interval: "month" | "year"; price?: string; level?: string | null; family?: boolean };
type StoreInfo = { account_token: string; products: StoreProduct[]; provider: string | null };

let iap: typeof import("expo-iap") | null = null;
const lib = () => (iap ||= require("expo-iap") as typeof import("expo-iap"));

export const usesStoreBilling = CHANNEL === "store";

// Izdelki s ceno iz trgovine (cena je v valuti in z DDV države uporabnika).
export async function loadProducts(): Promise<{ info: StoreInfo; products: StoreProduct[] }> {
  const info = await api<StoreInfo>("/api/billing/store");
  if (!usesStoreBilling) return { info, products: info.products };
  const I = lib();
  let found: any[] = [];
  try {
    await I.initConnection();
    found = (await I.fetchProducts({ skus: info.products.map((p) => p.id), type: "subs" })) as any[];
  } catch {
    // trgovina ni dosegljiva (npr. simulator, telefon brez Google Play): zaslon to pove
  }
  const byId = new Map(found.map((p) => [p.id, p]));
  return { info, products: info.products.filter((p) => byId.has(p.id)).map((p) => ({ ...p, price: byId.get(p.id).displayPrice, _store: byId.get(p.id) })) };
}

// Pošlje nakup strežniku in ga v trgovini zaključi šele, ko ga strežnik sprejme (sicer ga trgovina
// dostavi znova). Vrne odgovor strežnika { account, conflict } ali vrže napako (ApiError).
// Nakup, ki še čaka (npr. starš ga mora potrditi ali plačilo z gotovino), se ne pošilja.
type Confirmed = { account?: any; conflict?: string | null; pending?: boolean };
async function confirm(purchase: any): Promise<Confirmed> {
  if (purchase.purchaseState === "pending") return { pending: true };
  const body = Platform.OS === "ios" ? { signed_transaction: purchase.purchaseToken } : { purchase_token: purchase.purchaseToken };
  const out = await api(Platform.OS === "ios" ? "/api/billing/apple" : "/api/billing/google", { body });
  await lib().finishTransaction({ purchase, isConsumable: false }).catch(() => {});
  return out;
}

let buying = false;

// Nakupi, ki pridejo mimo gumba za nakup: prekinjen nakup (brez povezave, napaka strežnika), nakup, ki
// ga je pozneje potrdil starš, ponovna dostava trgovine. Teče, dokler je uporabnik prijavljen.
export function watchPurchases(onChange: () => void) {
  if (!usesStoreBilling) return () => {};
  const I = lib();
  let alive = true;
  const sub = I.purchaseUpdatedListener(async (purchase: any) => {
    if (buying) return;
    try {
      if (!(await confirm(purchase)).pending) onChange();
    } catch {
      // ostane nezaključen; poskusimo ob naslednjem zagonu
    }
  });
  (async () => {
    try {
      await I.initConnection();
      const list = (await I.getAvailablePurchases()) as any[];
      // Android: nepotrjen nakup Google po 3 dneh vrne. iOS nezaključene dostavi poslušalcu sam.
      for (const p of list) if (alive && Platform.OS === "android" && p.isAcknowledgedAndroid === false) await confirm(p).then(onChange).catch(() => {});
    } catch {
      // trgovina ni dosegljiva
    }
  })();
  return () => {
    alive = false;
    sub.remove();
  };
}

// Nakup naročnine v trgovini. Rezultat pride prek poslušalca (tako deluje StoreKit in Play Billing).
export function buyInStore(product: StoreProduct & { _store?: any }, accountToken: string): Promise<Confirmed> {
  const I = lib();
  buying = true;
  return new Promise<Confirmed>((resolve, reject) => {
    const done = () => {
      buying = false;
      ok.remove();
      bad.remove();
    };
    const ok = I.purchaseUpdatedListener(async (purchase: any) => {
      if (purchase.productId !== product.id) return;
      done();
      try {
        resolve(await confirm(purchase));
      } catch (err) {
        reject(err);
      }
    });
    const bad = I.purchaseErrorListener((err: any) => {
      done();
      reject(Object.assign(new Error(err.message), { cancelled: I.isUserCancelledError?.(err) }));
    });
    const offer = product._store?.subscriptionOffers?.find((o: any) => o.offerTokenAndroid)?.offerTokenAndroid;
    I.requestPurchase({
      type: "subs",
      request: {
        apple: { sku: product.id, appAccountToken: accountToken },
        google: { skus: [product.id], obfuscatedAccountId: accountToken, ...(offer ? { subscriptionOffers: [{ sku: product.id, offerToken: offer }] } : {}) },
      },
    }).catch((err: any) => {
      done();
      reject(err);
    });
  });
}

// »Obnovi nakupe«: vse aktivne naročnine iz trgovine pošlje strežniku.
export async function restorePurchases() {
  const I = lib();
  await I.initConnection();
  await I.restorePurchases().catch(() => {});
  const list = (await I.getAvailablePurchases()) as any[];
  let account = null;
  for (const p of list) {
    try {
      account = (await confirm(p)).account || account;
    } catch {
      // nakup drugega računa ali neznan izdelek: preskočimo
    }
  }
  return { count: list.length, account };
}

export async function manageInStore() {
  await lib().deepLinkToSubscriptions({}).catch(() => {});
}

// Neposredni prenos: Stripe v brskalniku, po vrnitvi osvežimo naročnino.
export async function buyOnWeb(seats: number, interval: string) {
  const { url } = await api<{ url: string }>("/api/billing/checkout", { body: { seats, interval } });
  await WebBrowser.openAuthSessionAsync(url, null);
  return api("/api/billing/sync", { body: {} });
}
export async function manageOnWeb() {
  const { url } = await api<{ url: string }>("/api/billing/portal", { body: {} });
  await WebBrowser.openBrowserAsync(url);
  return api("/api/billing/sync", { body: {} });
}
