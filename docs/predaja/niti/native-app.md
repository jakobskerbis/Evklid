# Predaja: nit »Native app« (Android/iOS aplikacija Evklid)

Stara nit: cmsg_011HYzNBAS5HRU1H7PcSE7JtWa3LqcX7C7Z4apg1rtmNFP. Predano 4. 11. 2026 niti »Make the app look like the website«. Podrobnosti še v pomnilniku `evklid-mobile-app.md` in v `docs/mobilna-aplikacija.md`.

## Stanje
- Expo SDK 58 / React Native 0.88 v `mobile/`, strežnik za aplikacijo v `server/mobile/`. Expo račun `@evklid.app`, projekt `evklid`, id `e341b072-b300-47f9-9945-8d28433478a6` (v `brand.json` → `app`). Keystore je na expo.dev, **nikoli ga ne briši** (sicer se nameščene aplikacije ne morejo posodobiti).
- Android APK gradnja 5 (1.0.0) je na https://evklid.app/prenesi. j jo je namestil 1. 11. in deluje. iOS čaka, da j odpre Apple Developer račun (99 $/leto, j je polnoleten).
- **Samodejne posodobitve (PR #223):**
  - JavaScript prek EAS Update: kanal `direct`, `runtimeVersion: fingerprint`, delovni tok `mobile/.eas/workflows/posodobitev.yml` ob vsaki združitvi v main (okolje preview, `EXPO_PUBLIC_CHANNEL=direct`).
  - Nov APK: strežnik iz naloženega APK prebere versionCode (`server/mobile/apk-info.js`, `/api/app-links` → `apkVersion`). Aplikacija ob prijavi ponudi »Posodobi« na en klik (`mobile/src/lib/updates.ts`).
  - Pravilo: ne dodajaj domorodnih paketov in ne spreminjaj `app.config.ts`, ker to spremeni prstni odtis. Preveri z `cd mobile && EXPO_PUBLIC_CHANNEL=direct npx expo-updates fingerprint:generate --platform android`, zadnji znani: `d7fd4e91b5c11e78e52b175e1cd43ea53ecd31f1`. Sprememba odtisa pomeni nov APK, ki ga zgradi j.
- **Nov APK (koraki za j):**
  1. expo.dev → Builds → nova gradnja: Android, veja `main`, profil `direct`.
  2. Povezavo do APK prilepi v Račun → Aplikacija za Android na evklid.app (samo skrbnik).
  3. Telefoni nato sami ponudijo »Posodobi«.
- Drugi PR-ji: #166 (aplikacija), #194 (gumb Namesti), #199, #208, #217 (nalaganje APK), #228 (»Nadaljuj tukaj« ob 409 taken), #261 (videz kot splet Čist + pisava Instrument Sans, »Razloži« v meniju označenega besedila, kalkulator = javna stran `/kalkulator` v WebView, seznam razlik).

## Stalna pravila od j
- 1. 11.: splet in aplikacija sta **vedno usklajena po videzu in po delovanju** (vrh `docs/oblikovanje.md`, PR #257/#258). Sprememba na spletu gre v isti PR tudi v `mobile/`, ali pa PR pove zakaj ne in razliko doda na seznam.
- Cene v trgovinah: 11,99 / 104,99 / 18,99 / 159,99 €. Aplikacija iz trgovine ne sme omenjati cenejših cen na spletu.

## Odprto
1. **Dolge formule v lekcijah** (j 1. 11.): aplikacija je kazala MathML z `overflow-x`, zato so bile formule na robu odrezane. Na main je commit d768ef3 »long formulas wrap in the app« (nit učbenika). Preveri, ali je to že enako kot na spletu (KaTeX HTML + `public/sirina.js`, prelom pri »=«, \overline). Če ni, je to prvo opravilo.
2. **Seznam razlik** v `docs/mobilna-aplikacija.md`, razdelek »Razlike med spletom in aplikacijo« (25 vrstic, ocene S/M/L). Zapiraj po vrsti, samo JavaScript, da gre prek OTA.
3. j naj potrdi, da je posodobitev iz #261 prišla na njegov telefon (nove barve, pisava, gumb za kalkulator pri vajah). Pisava v WebView lekcij je še sistemska. Formule in shranjeni grafi na `/kalkulator` še manjkajo.
4. Zavihek Skeniraj naj kliče API reševalnika po korakih (PR #165).
5. iOS: ko j odpre Apple račun, gradnja s profilom production in TestFlight.

## Opomniki
- Moj opomnik za 4. 11. 03:30 UTC (»Close web vs app gaps«) sem izbrisal ob predaji.
