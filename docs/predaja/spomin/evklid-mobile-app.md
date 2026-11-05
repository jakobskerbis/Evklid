---
name: evklid-mobile-app
description: Native Evklid app (Expo, mobile/) for iOS+Android: decisions 2026-10-30 (distribution outside stores first, store prices, commission)
metadata:
  type: project
  modified: 2026-10-30T05:49:49.014Z
---

Thread "Build native Evklid app for the App Store" (cmsg_011HYzNBAS5HRU1H7PcSE7JtWa3LqcX7C7Z4apg1rtmNFP), started 2026-10-30.

- j wants a real native app (not a wrapped site) that would pass App Store review, also on Google Play, but **for now distributed outside the stores**: APK on evklid.app/prenesi; iPhone TestFlight or PWA.
- Built as Expo SDK 58 / React Native app in `mobile/`. Server part in `server/mobile/`. Ids in brand.json `app` (bundle id app.evklid, products evklid.<month|year>.<1|2>), permanent after store release.
- Two build channels (eas.json): `direct` (APK, pays via Stripe web checkout, no store commission) and `store` (Apple IAP / Play Billing required for digital subscriptions).
- Stores take 15 %; only outside the stores is commission-free.
- Store prices (cover 15 %): 11,99 / 104,99 / 18,99 / 159,99 €; In server/mobile/store-billing.js STORE_PRICES_EUR. Store apps never mention cheaper web.
- Apple/Google subs: parents.sub_provider, sub_id "apple:<id>"/"google:<token>" (payments thread guard keeps Stripe from overwriting).
- **PR #166 merged 2026-10-30** (whole app + server/mobile + docs/mobilna-aplikacija.md = j's step-by-step guide).
- App headers X-App-Client / X-App-Device / X-App-Session are deliberately brand-neutral: never rename them on app rename.
- Follow-up: Skeniraj tab still sends photo to tutor; switch it to scan solver API ([[evklid-scan]], PR #165) now on main.
- Expo account @evklid.app; EAS project id in brand.json app (PR #199). NEVER delete the Expo project (j asked 4 Nov, told no): keystore, OTA (u.expo.dev), APK builds, push (exp.host) all depend on it.
- 30 Oct: first APK built on EAS (base dir /mobile, profile direct; locales JSON keys under "ios", PR #208), live on evklid.app/prenesi (PR #217). New version = new EAS build + paste link.
- PR #223 merged 30 Oct (self-update): app asks »Posodobi« at sign-in when server APK versionCode (server/mobile/apk-info.js, /api/app-links apkVersion) > build → one-tap download + installer. JS-only changes ship via EAS Update (channel direct, runtimeVersion fingerprint, workflow mobile/.eas/workflows/posodobitev.yml on push to main, env preview + EXPO_PUBLIC_CHANNEL=direct). Build 5 (1 Nov) has the updater. j 1 Nov: web and app ALWAYS aligned in look AND function (docs/oblikovanje.md, PR #257/#258). 4 Nov: handed over to thread »Make the app look like the website« (/mnt/project-files/predaja/native-app.md): close remaining gaps (JS-only, OTA);
- j 1 Nov 12:28: app "still looks completely different" from web, must also WORK the same. Thread cmsg_011HYzNBAS5HRU1H7PcSE7Jt6coHWo6qvCQF4iEzumYkdH owns it; Since 4 Nov this thread also owns the native app (handover /mnt/project-files/predaja/native-app.md). DECIDED j 4 Nov 03:57: app shows the REAL web app inside (WebView of evklid.app, session = same cookie as X-App-Session); native stays: sign-in, camera/scan, notifications, offline practice, updates, payments. PR #302 merged 4 Nov 07:19: mobile/src/app/web.tsx + server/mobile/web-session.js (GET /api/mobile/web), web detects UA 'EvklidApp/'; native tabs only for offline. Open: store builds must not use web Stripe (route to native Naročnina) before store release. App has only Čist, no Tekmovanja tab. 

- 4 Nov build 7 = camera fix #274.
- Store test buys: admins/EVKLID_STORE_TESTERS/EVKLID_STORE_TEST_PURCHASES=1.
- 4 Nov: free Expo plan no longer builds. APK now built on GitHub: Actions »APK za Android« (.github/workflows/apk.yml, PR #422/#425), workflow_dispatch on main (Claude can trigger via actions_run_trigger). Secret EXPO_TOKEN set by j → `eas build --local` uses EAS keystore + remote versionCode; output GitHub release apk-<N>; paste release URL in Račun → Aplikacija za Android. APK 8 (new logo, same cert as 7, fingerprint ce0c965…) built 4 Nov 17:10.
