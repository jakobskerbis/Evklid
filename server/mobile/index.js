// Strežniški del mobilne aplikacije (mobile/): prijava brez piškotkov, prijava z Apple,
// nakupi v App Store in Google Play, potisna obvestila in stran za prenos (/prenesi).
import { COOKIE } from "../accounts/auth.js";
import { DEVICE_COOKIE } from "../accounts/devices.js";
import { mountAppleSignIn } from "./apple-signin.js";
import { mountStoreBilling } from "./store-billing.js";
import { mountPush } from "./push.js";
import { mountDownload } from "./download.js";
import { mountCalculator } from "./calculator.js";
import { createAppLinks, mountAppLink } from "./app-link.js";
import { mountWebSession } from "./web-session.js";

const TOKEN = /^[A-Za-z0-9_-]{20,200}$/;

// Aplikacija ne uporablja piškotkov: sejo pošlje v glavi "Authorization: Bearer …", napravo v
// "X-App-Device". Glavi pretvorimo v piškotka, ki ju bere obstoječa koda računov, novo sejo pa
// vrnemo v glavi "X-App-Session" (namesto Set-Cookie). Velja samo za zahteve z glavo X-App-Client,
// ki je brskalnik z druge strani ne more poslati brez CORS (zato ni nevarnosti CSRF).
export function mobileClient(req, res, next) {
  if (!req.get("x-app-client")) return next();
  const cookies = [];
  const bearer = /^Bearer\s+(\S+)$/i.exec(req.get("authorization") || "")?.[1];
  if (bearer && TOKEN.test(bearer)) cookies.push(`${COOKIE}=${bearer}`);
  const device = req.get("x-app-device");
  if (device && TOKEN.test(device)) cookies.push(`${DEVICE_COOKIE}=${device}`);
  req.headers.cookie = cookies.join("; ");
  const append = res.append.bind(res);
  res.append = (field, value) => {
    if (String(field).toLowerCase() !== "set-cookie") return append(field, value);
    const keep = [];
    for (const v of [].concat(value)) {
      const s = String(v);
      if (s.startsWith(`${COOKIE}=`)) res.setHeader("X-App-Session", s.slice(COOKIE.length + 1).split(";")[0] || "-");
      else if (!s.startsWith(`${DEVICE_COOKIE}=`)) keep.push(s);
    }
    return keep.length ? append(field, keep) : res;
  };
  next();
}

// Klic za createApp: po mountAccounts (potrebuje račune), pred skupnim geslom.
export function mountMobile(app, accounts, opts = {}) {
  const ctx = accounts?.mobile;
  // Gumb »Odpri Evklid in ostani prijavljen« na /prenesi (server/mobile/app-link.js).
  const appLinks = ctx ? createAppLinks(ctx) : null;
  mountDownload(app, { ...opts, appLinks });
  mountCalculator(app); // /kalkulator za WebView v aplikaciji, brez prijave
  if (!ctx) return null; // brez računov (EVKLID_ACCOUNTS) aplikacija za trgovine ne deluje
  mountAppLink(app, ctx, appLinks);
  mountWebSession(app, ctx); // spletna stran v aplikaciji, prijavljena s sejo aplikacije
  mountAppleSignIn(app, ctx, opts);
  const billing = mountStoreBilling(app, ctx, opts);
  const push = mountPush(app, ctx, { ...opts, scheduler: opts.scheduler });
  return { billing, push };
}
