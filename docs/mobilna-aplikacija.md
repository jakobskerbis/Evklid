# Mobilna aplikacija (iPhone, iPad, Android)

Aplikacija v mapi `mobile/` (Expo, React Native). Uporablja isti strežnik in isti račun kot splet, napredek je
skupen.

**Splet znotraj aplikacije** (j, 4. 11. 2026): po prijavi aplikacija pokaže pravo spletno stran Evklida čez cel
zaslon (`mobile/src/app/web.tsx`), zato sta videz in delovanje vedno enaka spletu: vsi slogi, igre, nastavitve,
Evklidova tipkovnica, laboratorij, NPZ, vse nove stvari s spleta. Seja je ena: WebView najprej odpre
`/api/mobile/web` z glavami aplikacije, strežnik isto sejo zapiše v piškotek WebView-a
(`server/mobile/web-session.js`). Odjava na spletu odjavi tudi aplikacijo. Splet aplikacijo prepozna po
`EvklidApp/<različica>` v User-Agent (`public/install.js` → `isStandalone()`: brez ponudbe »Namesti aplikacijo«).
Vrstici telefona (ura, gumbi) dobita barvo roba strani. Gumb nazaj na Androidu gre nazaj po strani, povezave na
druge strani odpre brskalnik.

Naravno ostane: prijava in registracija (tipkovnica telefona), posodobitve (OTA in nov APK), obvestila, vaje
brez povezave. Med objavo nove različice (gostitelj vrne 502/503/504) aplikacija ob vrtavki pokaže »Evklid se posodablja …« in poskuša znova do ~70 s (`BUSY_WAIT`, kot splet), ob prekinjeni povezavi dvakrat tiho poskusi znova. Ko strežnik še vedno ni dosegljiv, aplikacija pokaže »Ni povezave« z gumboma »Poskusi znova« in »Vaje brez
povezave« (naravni zavihki spodaj). Če je strežnik starejši od aplikacije (posodobitev OTA pride pred objavo na Renderju, `/api/mobile/web` vrne 404), aplikacija do posodobitve strežnika pokaže naravne zaslone in spletno stran poskusi znova, ko se vrne v ospredje (`mobile/src/lib/web-state.ts`). Seznam razlik spodaj velja zdaj samo še za te naravne zaslone.

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
- **Uči se** (kot na spletu, j 4. 11. 2026): drugi naravni zavihek ima preklopnik Učbenik | Laboratorij | 3D svet
  (`mobile/src/app/(tabs)/textbook.tsx`, zadnji zavihek v `evklid.uciZavihek`). Učbenik je naravno kazalo, 3D svet
  zbirka strani `/3d` v WebView, Laboratorij (samo splet) pove, da potrebuje povezavo, in ponudi nov poskus spletne
  strani. V spletni strani znotraj aplikacije je »Uči se« isti kot na spletu.
- **3D svet** (zavihek v Uči se in vrstica v zavihku Jaz): stran `/3d` (atlas človeškega telesa in modeli iz kode,
  `docs/3d.md`) v WebView `mobile/src/components/Web3D.tsx` (`atlas.tsx` čez cel zaslon); »Vprašaj inštruktorja« pošlje `{tip: "vprasaj", besedilo}` in aplikacija odpre
  nov pogovor s tem sporočilom. Modeli ostanejo v predpomnilniku WebView (service worker), ob prvem odprtju je
  potrebna povezava.
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
| 3D atlas in modeli | telo v 3D, kviz, modeli iz kode (`public/3d/`) | L | WebView `/3d` (`Web3D.tsx`), vstop v Uči se → 3D svet in v zavihku Jaz | ✓ narejeno; vstop iz lekcije (»Poglej v 3D«, simulacija `3d-<id>` v katalogu) je na spletu, v naravni lekciji še ne |
| Formule | zbirka formul (način Formule kalkulatorja) | S | dodati način `formulas` na `/kalkulator` (potrebuje `rich.js`, marked) | ✗ |
| Klikljive črke v formulah | kartica s pomenom črke iz predmeta, razdelka in lekcije (`public/formula-info.js`; lekcije, razlaga teme z »Bistvom«, naloge, odgovori inštruktorja, list s formulami z oznakami razdelkov) | M | naravno: `RichText` označi črke (`annotateTex`), dotik pošlje kodo iz WebView, kartica (`public/formula-card.js`) se odpre kot spodnji list; predmet in oznake iz `FormulaCtx` (`useTopicFx`, `/api/topic`) | ✓ narejeno v lekciji, nalogah in klepetu; list s formulami čaka na način Formule (vrstica »Formule«) |
| Moji grafi | shranjeni grafi na strežniku | S | `/kalkulator` s sejo aplikacije (žeton v glavi ali enkratna povezava kot `app-link.js`) | ✗ |
| Zaslonska tipkovnica | matematične plasti, simboli, enote (`public/tipkovnica*.js`) | L | naravno, iz istih podatkov (`tipkovnica-data.js`); v WebView strani že deluje | ✗ |
| Laboratorij | poskusi in meritve (`public/laboratorij.js`), zavihek v Uči se | L | WebView samostojne strani | ✗ (naravni zavihek Uči se → Laboratorij pove, da potrebuje povezavo) |
| Simulacije | interaktivni poskusi v lekcijah (`public/sim/`) | L | WebView `/simulacija/<id>` v lekciji (zdaj se poskus v aplikaciji ne pokaže) | ✗ |
| Igre | matematične igre (`public/games/`) | L | WebView | ✗ |
| Tekmovanja | priprava na tekmovanja (`#view-competition`) | M | WebView, pozneje naravno | ✗ |
| NPZ in matura | preizkusi s časom (`#view-exams`) | M | naravno, kot vaje | ✗ |
| Pretekle pole RIC v Evklidu | prenešena pola se odpre v aplikaciji, razdelitev na naloge, »Pomoč pri tej nalogi« (`public/paper-viewer.js`, `public/paper-tasks.js`) | M | naravno: aplikacija polo prenese z ric.si na napravi in jo odpre sama (brez izbire datoteke); razdelilnik `paper-tasks.js` je čista funkcija, uporabna tudi tu | ✗ |
| Naše pole v slogu NPZ in mature | »Reši našo polo v tem slogu«: naloge Evklida z rešitvami, načini razlage, lastnim štetjem točk in »Vprašaj inštruktorja« (`public/our-paper.js`, `/api/exam-papers/ours/:id`) | M | naravno: podatki so JSON, besedila z `RichText` | ✗ |
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
| Nadgradnja stopnje, dokup razlag, darilo po stopnji | gumb »Odpri: …« (doplačilo razlike), gumb »Dokupi razlage« ob obvestilu o porabi, izbira stopnje darilne kode (`account.js`, `app.js` addAllowanceNote) | S | splet; aplikacija iz trgovine teh nakupov ne sme ponuditi mimo trgovine | delno (cena stopnje, Družina, obvestilo o porabi brez gumba) |
| Skrbnik | upravljanje (APK, uporabniki) | S | samo splet | ✗ (namerno) |
| Skeniraj: po korakih | reševalnik po korakih (`public/scan/`); aplikacija pošlje fotografijo inštruktorju | M | WebView strani skeniranja ali naravni zaslon korakov | delno |
| Govor | mikrofon v klepetu (`speech.js`) | M | naravna odvisnost (prepoznava govora) → nova gradnja APK | ✗ |
| Učbenik za tisk | PDF učbenika (`/ucbenik`) | S | odpri v brskalniku (`WebBrowser`) | ✗ |

- **Deljiva kartica zbirke** (»Deli zbirko«, public/deli-kartico.js): WebView ne podpira Web Share z datotekami
  ne prenosa slike, zato aplikacija deli prek mostu (`public/deli-most.js`, `mobile/src/app/web.tsx`):
  - Stran pošlje `{type: "evklid:share-image", id, name, dataBase64}` (`window.ReactNativeWebView.postMessage`).
    Aplikacija sprejme samo sporočilo s strani Evklida, ime `*.png`, PNG v base64 (preveri glavo PNG) do 5 MB
    (`checkShareImage`), sliko zapiše v predpomnilnik (`expo-file-system`, `Paths.cache`) in odpre sistemski meni
    za deljenje (`expo-sharing`, `image/png`). Od tam jo učenec shrani v Galerijo/Datoteke ali deli.
  - Odgovor (`injectJavaScript` → dogodek `evklid:share-image-result` na `window`) pove le, ali se je meni odprl:
    stran napiše »Odprl se je meni za deljenje …« ali »Menija za deljenje ni bilo mogoče odpreti …«. Ali je
    učenec sliko res shranil, aplikacija ne ve, zato tega nikoli ne trdimo.
  - **Zmožnost**: gradnja z mostom pred nalaganjem strani nastavi `window.EvklidNative = { shareImage: 1 }`
    (`injectedJavaScriptBeforeContentLoaded`). Stran gumb v aplikaciji (`EvklidApp/` v user agentu) pokaže samo
    z zastavico (`shareMode`), sicer ostane skrit; v brskalniku ostaneta Web Share in prenos.
  - Most deluje na **Androidu in iOS** (`expo-sharing` podpira oba; na iOS se odpre list za deljenje, od koder
    »Shrani sliko« v Fotografije), oboje z naslednjo gradnjo.
  - Če aplikacija v ~2 minutah ne odgovori (`SHARE_IMAGE_TIMEOUT`), stran neha čakati brez sporočila (meni je
    morda še odprt), gumb pa spet deluje.
  - **Potrebuje novo gradnjo** (2026-11-04): `expo-sharing` je nov domorodni paket, zato se spremeni prstni odtis
    (`runtimeVersion: fingerprint`) in posodobitev OTA nanj ne pride na stare gradnje. Do nove gradnje je gumb v
    aplikaciji skrit kot doslej. Android: v mapi `mobile` `npm install`, nato
    `npx eas-cli build --profile direct --platform android` in povezavo do APK naloži kot v koraku 4 spodaj
    (»Kaj mora narediti človek« → 1. APK za Android). iOS in trgovini: enako s `--profile production`
    (`--platform ios` ali `android`), ko bosta računa v trgovinah odprta.

## Dve različici

| | Neposredni prenos (zdaj) | Trgovini (kasneje) |
|---|---|---|
| Kje | Android: APK na evklid.app/prenesi | App Store, Google Play |
| Gradnja | `eas build --profile direct --platform android` | `eas build --profile production` |
| Plačilo | Stripe na spletu po stopnjah (OŠ 9,99 / 99 €, SŠ 13,99 / 139 €, faks 19,99 / 199 €, Družina 18,99 / 189 €, Družina s študentom 27,99 / 269 €) | nakup v aplikaciji, vsak paket 2 € dražji kot na spletu (`STORE_PRICES_EUR` v `server/mobile/store-billing.js`: 11,99 / 101, 15,99 / 141, 21,99 / 201, 20,99 / 191, 29,99 / 271 €); izdelki `<predpona>.<month\|year>.<1\|ss\|faks\|druzina\|druzina_student>`, stari `.2` ostane za obstoječe naročnine |
| Provizija | Stripe ~1,5 % + 0,25 € | 15 % (Apple Small Business Program, Google Play) |

Cene v trgovinah so višje zaradi provizije. Aplikacija iz trgovine ne sme omenjati cenejših cen na
spletu (pravila Apple 3.1.1 in Google Play), zato jih ne omenja.

**TODO pred zagonom trgovin** (j 2026-11-04, »Cene z najmanj 75 % dobička«): +2 € (`STORE_MARKUP_CENTS` v
`server/accounts/plans.js`) ob 15 % provizije ne drži pravila 75 % v najslabšem primeru. Cene v trgovinah morajo
biti ~25 % višje od spletnih (in zajamčeni AI za nakupe iz trgovine približno pol manjši). Zdaj ostane +2 €, ker
trgovini še ne delujeta (brez s.p.); splet je privzet način plačila.

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

**Brez gradenj na expo.dev: APK zgradi GitHub** (brezplačno, `.github/workflows/apk.yml`, od 4. 11. 2026).
Naredi isto kot gradnja s profilom `direct`: kanal `direct`, številka različice = trenutna na evklid.app + 1.
APK mora biti podpisan z **istim ključem** kot prejšnji, sicer ga telefon ne namesti čez staro aplikacijo.

Enkrat (ključ v skrivnosti GitHub, nikoli v repozitorij):
1. expo.dev → projekt evklid → **Credentials** → Android → `app.evklid` → Keystore → **Download**. Na isti
   strani si zapiši *Keystore password*, *Key alias* in *Key password*.
2. V PowerShellu v mapi, kjer je preneseni `.jks` (ime prilagodi):
   `[Convert]::ToBase64String([IO.File]::ReadAllBytes("evklid.jks")) | Set-Clipboard`
3. github.com/jakobskerbis/Evklid → Settings → Secrets and variables → Actions → **New repository secret**,
   štiri skrivnosti: `ANDROID_KEYSTORE_BASE64` (prilepi iz koraka 2), `ANDROID_KEYSTORE_PASSWORD`,
   `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`. Nato datoteko `.jks` shrani na varno (ne briši).

Vsakič:
4. github.com/jakobskerbis/Evklid → **Actions** → »APK za Android« → **Run workflow** (veja `main`), ~25 minut.
5. Povezavo `https://github.com/jakobskerbis/Evklid/releases/download/apk-<številka>/evklid.apk` iz povzetka
   gradnje prilepi v **Račun → Aplikacija za Android (APK)** in tapni »Naloži APK«.

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
   `evklid.<month|year>.<1|ss|faks|druzina|druzina_student>` po cenah iz `STORE_PRICES_EUR` (tabela zgoraj; glej TODO
   o +25 % pred zagonom); stari `evklid.<month|year>.2` samo za obstoječe naročnine.
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
