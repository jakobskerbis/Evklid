# Mobilna aplikacija (iPhone, iPad, Android)

Prava aplikacija v mapi `mobile/` (Expo, React Native), ne ovita spletna stran. Uporablja isti strežnik
in isti račun kot splet, napredek je skupen.

## Kaj zna

- **Učna pot** z ravnjo, nizom dni in dnevnim ciljem XP, Današnji trening, ponavljanje, teme po poglavjih.
- **Vaje** z rešenim zgledom, postopnimi namigi, rešitvijo, slikami (graf premice, številska premica) in
  gumbom »Vprašaj inštruktorja«. Vibracija ob pravilnem in napačnem odgovoru.
- **Vaje brez povezave**: naloge učne poti se shranijo na telefon, odgovor preveri telefon (isto
  preverjanje kot strežnik, `server/practice/check.js`), ob povezavi strežnik odgovore preveri še
  enkrat in podeli XP.
- **Lekcije** po korakih (kratke kartice z vprašanji »Preveri se« vmes, `public/lesson-steps.js`) ali vse
  naenkrat, »Razloži drugače«, formule in tabele kot na spletu.
- **Razloži**: v lekciji označi besedilo in v meniju izbora tapni »Razloži«; odpre se pogovor z inštruktorjem z
  istim sporočilom kot na spletu (`public/textbook.js`). Na Androidu je v meniju še »Kopiraj«.
- **Kalkulator** med vajo (gumb ob Namigu): spletni kalkulator s strani `/kalkulator` (znanstveni, grafični,
  orodja, PSE; pri kemiji se odpre PSE) v WebView, brez prijave in brez »Moji grafi«.
- **Učbenik** s kazalom in iskanjem.
- **Inštruktor**: klepet, odgovor prihaja sproti, fotografija naloge (kamera ali galerija),
  »Razloži podrobneje«, predlog spremembe šole in letnika.
- **Skeniraj**: kamera z okvirjem in svetilko; fotografija gre inštruktorju v nov pogovor.
- **Opomniki**: dnevni opomnik ob izbrani uri (deluje brez povezave, odpade, ko je cilj dosežen) in
  potisna obvestila strežnika (npr. »Matura: še 3 dnevi«).
- **Prijava** z e-naslovom ali **Prijava z Apple**, profili z gesli, izbris računa v aplikaciji.
- **Prijava iz brskalnika**: kdor je na telefonu prijavljen v brskalniku, na /prenesi tapne »Odpri Evklid in
  ostani prijavljen« in aplikacija se odpre prijavljena, s profilom iz brskalnika (enkratna povezava
  `evklid://prijava?t=…`, 15 minut, `server/mobile/app-link.js`). Zaslon za prijavo v aplikaciji ima gumb,
  ki to stran odpre.
- **Naročnina**: v trgovinah nakup v aplikaciji (Apple In-App Purchase, Google Play Billing), v APK za
  neposredni prenos plačilo na spletu (Stripe).
- Svetla in temna tema, 33 jezikov vmesnika (isti prevodi kot splet), iPad, dostopnost (VoiceOver,
  TalkBack).

## Razlike med spletom in aplikacijo

Pravilo (docs/oblikovanje.md, j 1. 11. 2026): kar zna splet, zna tudi aplikacija. Spodaj je, česa aplikacija
še nima. Velikost: S do pol dneva, M en do dva dni, L več dni. »WebView« pomeni samostojno spletno stran brez
prijave ali s sejo aplikacije, kot `/kalkulator` (`server/mobile/calculator.js`): hitro in vedno enako kot
splet; »naravno« pomeni zaslon v React Native (boljši občutek, več dela). Nove naravne odvisnosti zahtevajo
novo gradnjo APK (posodobitev OTA jih ne prinese).

| Na spletu | Kaj je | Velikost | Predlog | Stanje |
|---|---|---|---|---|
| Videz sloga Čist | barve, robovi, pisava Instrument Sans, zavihki v istem redu | S | naravno (`theme.ts`, `font()`) | ✓ narejeno; besedilo v WebView (lekcije, klepet) ima Instrument Sans, formule pa KaTeX in `public/sirina.js` s strežnika kot splet (brez povezave MathML) |
| Razloži ob izboru | označeno besedilo lekcije → inštruktor | S | naravno (meni izbora WebView) | ✓ narejeno |
| Kalkulator | znanstveni, grafični, orodja, PSE (`public/graph/`) | M | WebView `/kalkulator` | ✓ narejeno med vajo; manjka še gumb v lekciji in klepetu |
| Formule | zbirka formul (način Formule kalkulatorja) | S | dodati način `formulas` na `/kalkulator` (potrebuje `rich.js`, marked) | ✗ |
| Moji grafi | shranjeni grafi na strežniku | S | `/kalkulator` s sejo aplikacije (žeton v glavi ali enkratna povezava kot `app-link.js`) | ✗ |
| Zaslonska tipkovnica | matematične plasti, simboli, enote (`public/tipkovnica*.js`) | L | naravno, iz istih podatkov (`tipkovnica-data.js`); v WebView strani že deluje | ✗ |
| Laboratorij | poskusi in meritve (`public/laboratorij.js`) | L | WebView samostojne strani | ✗ |
| Simulacije | interaktivni poskusi v lekcijah (`public/sim/`) | L | WebView `/simulacija/<id>` v lekciji (zdaj se poskus v aplikaciji ne pokaže) | ✗ |
| Igre | matematične igre (`public/games/`) | L | WebView | ✗ |
| Tekmovanja | priprava na tekmovanja (`#view-competition`) | M | WebView, pozneje naravno | ✗ |
| NPZ in matura | preizkusi s časom (`#view-exams`) | M | naravno, kot vaje | ✗ |
| Pretekle pole RIC v Evklidu | prenešena pola se odpre v aplikaciji, razdelitev na naloge, »Pomoč pri tej nalogi« (`public/paper-viewer.js`, `public/paper-tasks.js`) | M | naravno: aplikacija polo prenese z ric.si na napravi in jo odpre sama (brez izbire datoteke); razdelilnik `paper-tasks.js` je čista funkcija, uporabna tudi tu | ✗ |
| Kartice | ponavljanje s karticami (`flashcards.js`) | M | naravno | ✗ |
| Napredek | statistika in grafi po temah (`#view-progress`) | M | naravno, grafi v WebView | ✗ |
| Lige | tedenska lestvica (`leagues.js`) | S | naravno | ✗ |
| Urnik | načrt učenja do cilja (`schedule.js`) | M | naravno | ✗ |
| Zbirke | zbirke, odklepanje, kozmetika (`zbirke-view.js`) | M | WebView | ✗ |
| Kotiček | novice in zanimivosti (`corner.js`) | M | WebView | ✗ |
| Mnenja | povratne informacije (`feedback.js`) | S | naravno (obrazec) | ✗ |
| Okna | več oken hkrati (`okna.js`) | L | samo iPad (Split View); na telefonu ne | ✗ (namerno na telefonu) |
| Nastavitve | slogi (Igriv, Temen, zgodovinski), lastne barve, jezik, tempo, tipkovnica, glas; aplikacija ima raven, opomnike, vibracijo | M | naravno; slogi kot dodatne palete v `theme.ts` | delno |
| Račun staršev | otroci, plačila, darila, šole (`account.js`) | M | odpri spletno stran prijavljeno (`app-link.js` v obratni smeri) | delno (naročnina, izbris) |
| Skrbnik | upravljanje (APK, uporabniki) | S | samo splet | ✗ (namerno) |
| Skeniraj: po korakih | reševalnik po korakih (`public/scan/`); aplikacija pošlje fotografijo inštruktorju | M | WebView strani skeniranja ali naravni zaslon korakov | delno |
| Govor | mikrofon v klepetu (`speech.js`) | M | naravna odvisnost (prepoznava govora) → nova gradnja APK | ✗ |
| Učbenik za tisk | PDF učbenika (`/ucbenik`) | S | odpri v brskalniku (`WebBrowser`) | ✗ |

## Dve različici

| | Neposredni prenos (zdaj) | Trgovini (kasneje) |
|---|---|---|
| Kje | Android: APK na evklid.app/prenesi | App Store, Google Play |
| Gradnja | `eas build --profile direct --platform android` | `eas build --profile production` |
| Plačilo | Stripe na spletu (9,99 / 89 / 15,99 / 139 €) | nakup v aplikaciji (11,99 / 104,99 / 18,99 / 159,99 €) |
| Provizija | Stripe ~1,5 % + 0,25 € | 15 % (Apple Small Business Program, Google Play) |

Cene v trgovinah so višje zaradi provizije. Aplikacija iz trgovine ne sme omenjati cenejših cen na
spletu (pravila Apple 3.1.1 in Google Play), zato jih ne omenja.

**iPhone zdaj:** brez Applovega razvijalskega računa (99 $ na leto) aplikacije na iPhone ni mogoče
namestiti mimo trgovine. Do takrat iPhone uporablja spletno aplikacijo (Safari → Deli → Dodaj na
začetni zaslon). Ko je račun, gre aplikacija najprej v TestFlight (do 10.000 testerjev, brez pregleda
za notranje testerje), nato v App Store.

## Kaj mora narediti človek

**Račune v trgovinah mora odpreti polnoletna oseba** (npr. starš). Apple in Google zahtevata
polnoletnost in pravo identiteto; ime razvijalca je javno vidno v trgovini.

### 1. APK za Android (brezplačno, zdaj)

1. Na [expo.dev](https://expo.dev) ustvari brezplačen račun.
2. V ukazni vrstici v mapi `evklid-main\mobile` (mapa z aplikacijo, podmapa `mobile`):
   ```
   npm install
   npx eas-cli login
   npx eas-cli init
   ```
   `init` izpiše id projekta. Vpiši ga v `brand.json` → `app.eas_project_id` (ali ga pošlji Claudu).
3. `npx eas-cli build --profile direct --platform android` (gradnja teče v oblaku Expo, ~15 minut).
4. Kopiraj povezavo do APK, ki jo izpiše gradnja (ali na expo.dev → Builds → Install → kopiraj povezavo).
   Na evklid.app se prijavi kot skrbnik, odpri **Račun → Aplikacija za Android (APK)**, prilepi povezavo
   in tapni »Naloži APK«. Strežnik APK shrani na trajni disk (na Renderju `/var/data/evklid.apk`, doma
   `data\evklid.apk`). (Ali v nastavitvah strežnika nastavi `EVKLID_ANDROID_APK_URL`.)

Takoj zatem gumb **»Namesti aplikacijo«** na Androidu ponudi pravo aplikacijo (APK s koraki za namestitev)
namesto spletne različice, prav tako stran https://evklid.app/prenesi. Ob novi različici ponovi koraka 3 in 4.

**Posodobitve nameščene aplikacije** (`mobile/src/lib/updates.ts`):
- **Manjše spremembe (JavaScript, besedila, prevodi)** pridejo same. Ob vsaki združitvi v `main`, ki spremeni
  `mobile/` ali skupne datoteke s spletom, Expo (EAS Workflows, `mobile/.eas/workflows/posodobitev.yml`)
  objavi posodobitev na kanal `direct`. Telefon jo prenese ob zagonu in jo uporabi ob naslednjem zagonu;
  ko je prenesena, aplikacija ponudi »Posodobi« (takojšen ponovni zagon). Dobijo jo samo gradnje z enako
  domorodno kodo (`runtimeVersion: fingerprint`). Brezplačni načrt Expo pokrije do 1.000 uporabnikov na mesec.
- **Nova domorodna koda** (nov paket Expo, nova različica SDK, sprememba `app.config.ts`) potrebuje nov APK:
  ponovi koraka 3 in 4. Strežnik iz naloženega APK prebere `versionCode` (`server/mobile/apk-info.js`,
  `/api/app-links` → `apkVersion`). Aplikacija ga ob prijavi primerja s svojo gradnjo in, če je novejši,
  ponudi »Posodobi«: en dotik prenese APK in odpre sistemsko namestitev (prvič Android vpraša, ali Evklid
  sme nameščati aplikacije). Podatki ostanejo, ker je APK podpisan z istim ključem (keystore na expo.dev,
  nikoli ga ne briši).
- Če je APK zunaj strežnika (`EVKLID_ANDROID_APK_URL`), strežnik njegove različice ne pozna in aplikacija nove
  različice APK ne ponudi; posodobitve JavaScripta delujejo vseeno.
- Nov jezik vmesnika (nova datoteka v `public/i18n/ui/`) spremeni prstni odtis, zato potrebuje nov APK.
- APK 1.0.0 (gradnja 4, 30. 10. 2026) posodabljanja še nima: nanj je treba novo različico enkrat namestiti ročno.

**Gumb »Namesti aplikacijo« po napravah** (`public/install.js`, podatki z `/api/app-links`):
- Android: Google Play, ko je objavljena (`EVKLID_PLAY_URL`), sicer APK; spletna različica ostane druga možnost.
- iPhone, iPad: App Store (`EVKLID_APP_STORE_URL`), sicer TestFlight (`EVKLID_TESTFLIGHT_URL`), sicer koraki
  »Deli → Dodaj na začetni zaslon«.
- Računalnik: Chrome in Edge namestita Evklid kot program (ikona v meniju Start ali med programi, svoje okno,
  odstranitev kot pri drugih programih). Samostojen namestitveni program (.exe) ni boljši: večji je, Windows
  pa brez plačljivega podpisnega potrdila opozarja »neznan založnik«.

### 2. Apple (ko bo odrasla oseba odprla račun)

1. Apple Developer Program, 99 $ na leto, kot posameznik: https://developer.apple.com/programs/enroll/
2. Prijava v [App Store Small Business Program](https://developer.apple.com/app-store/small-business-program/) (provizija 15 % namesto 30 %).
3. V App Store Connect: nova aplikacija z id-jem `app.evklid`, skupina naročnin z izdelki
   `evklid.month.1` (11,99 €), `evklid.year.1` (104,99 €), `evklid.month.2` (18,99 €), `evklid.year.2` (159,99 €).
4. App Store Server Notifications V2: `https://evklid.app/webhooks/app-store` (produkcija in sandbox).
5. Ključ za Prijavo z Apple (Keys → Sign in with Apple) in v `.env` strežnika:
   `EVKLID_APPLE_TEAM_ID`, `EVKLID_APPLE_KEY_ID`, `EVKLID_APPLE_PRIVATE_KEY` (vsebina datoteke .p8).
   Potrebno za preklic prijave z Apple ob izbrisu računa.
6. `npx eas-cli build --profile production --platform ios`, nato `npx eas-cli submit --platform ios`.
   V TestFlight nastavi javno povezavo in jo vpiši v `.env` kot `EVKLID_TESTFLIGHT_URL` (stran /prenesi
   jo pokaže). Po odobritvi v App Store: `EVKLID_APP_STORE_URL`.
7. Za pregled pri Applu: demo račun (e-naslov, geslo, profil z geslom) v polju »App Review
   Information«. Njegov e-naslov dodaj v `.env` v `EVKLID_STORE_TESTERS` (z vejico ločeni naslovi):
   testni nakupi (peskovnik, TestFlight) so brezplačni, zato veljajo samo za te račune in za skrbnike;
   `EVKLID_STORE_TEST_PURCHASES=1` jih začasno dovoli vsem (samo med pregledom). Nato: starostna oznaka po vprašalniku (AI klepet, verjetno 9+ ali 13+); kategorija
   Izobraževanje, **ne** kategorija Kids; izpolni »App Privacy« (e-naslov, ime, napredek, fotografije
   nalog, brez sledenja in oglasov).

### 3. Google Play (ko bo odrasla oseba odprla račun)

1. Račun razvijalca, 25 $ enkrat: https://play.google.com/console/signup
2. Nov osebni račun mora pred objavo izvesti zaprto testiranje (vsaj 12 testerjev, 14 dni).
3. Aplikacija `app.evklid`, naročnine z istimi id-ji in cenami kot pri Applu.
4. Servisni račun v Google Cloud z dostopom do Play Console (Finance), ključ JSON v `.env` kot
   `EVKLID_GOOGLE_PLAY_KEY` (pot do datoteke ali vsebina).
5. Obvestila v realnem času (RTDN): tema Pub/Sub s potisno naročnino na
   `https://evklid.app/webhooks/google-play?token=SKRIVNOST`, isto skrivnost v `.env` kot
   `EVKLID_GOOGLE_RTDN_TOKEN`.
6. `npx eas-cli build --profile production --platform android`, nato `npx eas-cli submit --platform android`.
7. Obrazec »Data safety«, ciljna starostna skupina (13+ ali vključno z mlajšimi po pravilniku Families),
   demo račun za pregled (tudi v `EVKLID_STORE_TESTERS`, enako kot pri Applu; licenčni testerji kupujejo brezplačno). Po objavi: `EVKLID_PLAY_URL`.

Pravilnik o zasebnosti (`public/zasebnost.html`) že navaja Apple, Google in Expo kot obdelovalce.
Odgovore inštruktorja lahko uporabnik prijavi v aplikaciji (»Prijavi napako«), kar zahtevata pravili
obeh trgovin za vsebino, ki jo ustvari AI.

## Za razvijalce

- Zagon: `cd mobile && npm install && npx expo start` (razvojna gradnja: `eas build --profile development`).
- Preverjanje: `npx tsc --noEmit` v `mobile/`, strežnik: `node --test test/mobile.test.js`.
- Ime, id-ji in domena so v `brand.json` (`app.bundle_id`, `app.product_prefix`). Id-ja sta po objavi trajna.
- Aplikacija uvaža kodo spleta in strežnika (`public/i18n`, `public/rich.js`, `public/lesson-steps.js`,
  `public/xp-levels.js`, `server/practice/check.js`); `mobile/metro.config.js` gleda celoten repozitorij.
- Nov niz besedila: ključ `mob.*` v `public/i18n/sl.js` in v vseh 32 `public/i18n/ui/*.json`.
- Strežnik za aplikacijo: `server/mobile/` (seja v glavi namesto piškotka, Prijava z Apple, nakupi in
  obvestila trgovin, potisna obvestila, stran /prenesi). Glave `X-App-Client`, `X-App-Device`,
  `X-App-Session` so namenoma brez imena aplikacije, da preimenovanje ne pokvari nameščenih različic.
- Skeniranje: zavihek Skeniraj zdaj pošlje fotografijo inštruktorju. Ko bo združen reševalnik po korakih
  (ločena nit), naj zavihek najprej pokliče njegov API.
  Razlika do spleta (1. 11. 2026): splet reši izraze s funkcijami (sin 15 v stopinjah in radianih, ln 2)
  brez AI s `public/scan/solvecore.js` in ob nedosegljivem inštruktorju pokaže `scan.tutorDown`; aplikacija
  tega ekrana še nima. Enako je že v obeh: sporočilo `off.serverBusy`, ko strežnik med objavo ne odgovori.
