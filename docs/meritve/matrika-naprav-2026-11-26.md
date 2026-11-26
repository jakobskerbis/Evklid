# Matrika naprav in brskalnikov K-12 (26. 11. 2026)

## Povzetek
- Glavna številka: **0 prekrivanj in 0 malih drsnikov (▲▼) na 9 od 9 kombinacij** naprave in brskalnika (cilj 0, nižje je bolje), n = 757 posnetkov dimnega testa (64–147 na kombinacijo). Tudi vodoravnega drsenja ni nikjer.
- Hitrost ponovnega obiska (nov zavihek, počasno omrežje »Slow 4G«): pravi pogled Učna pot z napredkom je na vseh 9 kombinacijah hitrejši kot pred delom na hitrosti (N-08, N-08b, N-08c). Mediana vseh 63 ponovitev je **1052 ms, prej 1193 ms** (−12 %), po kombinacijah od −7 % do −21 %. Prva vsebina (posnetek zadnjega zaslona) se pri osvežitvi pokaže v 115–232 ms, prej 259–452 ms.
- Pomeni: Evklid se na Androidu, iPhonu, iPadu, Windows, Macu in v Firefoxu izriše brez prekrivanj in brez malih drsnikov na vseh zaslonih, ki jih obišče dimni test, in se ob vrnitvi odpre hitreje kot pred N-08.
- Ne pomeni: da je tako na pravih napravah. To so pogoni brskalnikov v Playwrightu (Chromium, WebKit, Firefox) na strežniku v oblaku, ne pravi telefoni, Safari ali iPad. Prvi obisk (prazen predpomnilnik) ostaja okoli 5,1–5,4 s do obrazca za nov profil, kar je nad ciljem 2,5 s na nadzorni plošči.

## Nabor
- **Kombinacije** (izbor najpogostejših naprav učencev; isti seznam je v `scripts/matrika-naprav.cjs`):

| Oznaka | Naprava | Pogon | Zaslon | Dotik | Postavitev |
|---|---|---|---|---|---|
| android-360 | Android telefon | Chromium (Chrome) | 360 × 740 | da | telefon |
| android-412 | Android telefon | Chromium (Chrome) | 412 × 915 | da | telefon |
| iphone-375 | iPhone SE | WebKit (Safari) | 375 × 667 | da | telefon |
| iphone-390 | iPhone | WebKit (Safari) | 390 × 844 | da | telefon |
| ipad-820 | iPad pokončno | WebKit (Safari) | 820 × 1180 | da | telefon (spodnja vrstica, kot v aplikaciji do 1240 px na dotik) |
| ipad-1180 | iPad ležeče | WebKit (Safari) | 1180 × 820 | da | telefon (spodnja vrstica) |
| windows-1366 | računalnik | Chromium (Chrome/Edge) | 1366 × 768 | ne | računalnik |
| mac-1440 | Mac | WebKit (Safari) | 1440 × 900 | ne | računalnik |
| firefox-1920 | računalnik | Firefox | 1920 × 1080 | ne | računalnik |

- **Različice pogonov:** Chromium 158.0.8127.36, WebKit 26.6, Firefox 155.0 (Playwright 1.63).
- **Zasloni:** vsi koraki dimnega testa `scripts/preveri-aplikacijo.cjs` za postavitev (telefon ali računalnik), brez korakov z računi (`--brez-racunov`). Telefon: 64 posnetkov, računalnik: 144–147.
- **Kdo je določil pričakovani izid:** pravila dimnega testa (prekrivanje mehurčka in obvestila, mali drsnik, vodoravno drsenje) so v repozitoriju od prej (UX PR 1 #1127, `docs/oblikovanje.md`). Za to meritev se niso spremenila. Skriti kontrolni del: ne.

## Metoda
- **Ukaz:** `PLAYWRIGHT_BROWSERS_PATH=<mapa> node scripts/matrika-naprav.cjs --mapa <izhod> --prej <mapa različice prej>`. Za vsako kombinacijo najprej teče dimni test, nato hitrost (`scripts/hitrost-naprav.cjs`) za »potem« in »prej«. Naenkrat teče ena kombinacija.
- **Commit:** »potem« je `main` 613278d73e1fc9e94e00af64167ddfcd063ad2e8 z vejo K-12 (spremembe samo v `scripts/`). »Prej« je `main` dc49e90721dec820c59fbcb15e6554bdb1c4f8ca (N-07 #1118), torej pred N-08 #1124, N-08b #1131 in N-08c #1137.
- **Stroj:** oblak, 4 jedra Intel Xeon 2,1 GHz, Node 22, strežnik v preizkusnem načinu (`EVKLID_MOCK=1`, `EVKLID_SKRCI=1` kot v produkciji). Procesor ni upočasnjen, ker WebKit in Firefox v Playwrightu tega ne podpirata. Zato so časi primerljivi samo med »prej« in »potem« na istem stroju, ne s pravim telefonom.
- **Omrežje:** posrednik med brskalnikom in strežnikom vsakemu odgovoru doda 150 ms zakasnitve. Vse odgovore pošilja skozi eno linijo s hitrostjo 1,6 Mbit/s × 0,9, kar je profil »Slow 4G« iz Lighthouse. Za vse tri pogone je enak (`posrednik()` v `scripts/hitrost-naprav.cjs`, preverja ga `test/matrika-naprav.test.js`).
- **Hitrost:**
  - Prvi obisk: od začetka nalaganja do vidnega obrazca za nov profil, s praznim predpomnilnikom. To je ena meritev na kombinacijo.
  - Nato nov profil (OŠ, 8. razred) in 3 s za service worker.
  - 7 ponovnih obiskov (prejšnji zavihek zaprt, nov zavihek, kot ob ponovnem odprtju aplikacije) in 7 osvežitev. Za vsakega se izmerita »prva vsebina« (prvi viden pogled, lahko posnetek zadnjega zaslona) in »Učna pot« (pravi pogled z napredkom).
  - Poročamo mediano.
- **Ocenjevanje:** program (dimni test in merilnik v strani), brez človeka.

## Izidi

### Postavitev (dimni test)

| Kombinacija | Posnetkov | Prekrivanje | Mali drsnik | Vodoravno drsenje | Drugo |
|---|---|---|---|---|---|
| android-360 | 64 | 0 | 0 | 0 | 0 |
| android-412 | 64 | 0 | 0 | 0 | 0 |
| iphone-375 | 64 | 0 | 0 | 0 | 10 (WebKit, glej spodaj) |
| iphone-390 | 64 | 0 | 0 | 0 | 10 (WebKit) |
| ipad-820 | 64 | 0 | 0 | 0 | 10 (WebKit) |
| ipad-1180 | 63 | 0 | 0 | 0 | 10 (WebKit) |
| windows-1366 | 147 | 0 | 0 | 0 | 0 |
| mac-1440 | 144 | 0 | 0 | 0 | 9 (WebKit; 2 zaradi dimnega testa, popravljeno, glej spodaj) |
| firefox-1920 | 147 | 0 | 0 | 0 | 0 |
| **Skupaj** | **757** | **0** | **0** | **0** | |

Pri 0 primerih na 9 od 9 kombinacij je zgornja meja 95-% intervala (Wilson, enostransko) za delež kombinacij s
prekrivanjem 30 %. Na ravni posnetkov (n = 757) je zgornja meja 0,5 %. Posnetki niso neodvisni, saj gre za iste zaslone na različnih napravah, zato je ta meja preozka.

### Hitrost (mediana v ms, v oklepaju »prej«)

| Kombinacija | Prvi obisk | Ponovni obisk: prva vsebina | Ponovni obisk: Učna pot | Sprememba Učne poti | Osvežitev: prva vsebina | Osvežitev: Učna pot |
|---|---|---|---|---|---|---|
| Android telefon 360 × 740, Chrome | 5090 (5529) | 129 (289) | 811 (1003) | −19 % | 118 (282) | 781 (984) |
| Android telefon 412 × 915, Chrome | 5078 (5449) | 144 (288) | 834 (987) | −16 % | 130 (274) | 782 (966) |
| iPhone SE 375 × 667, Safari | 5392 (5724) | 163 (153) | 1143 (1231) | −7 % | 181 (419) | 1070 (1247) |
| iPhone 390 × 844, Safari | 5380 (5743) | 151 (168) | 1104 (1303) | −15 % | 165 (452) | 1002 (1312) |
| iPad 820 × 1180 pokončno, Safari | 5296 (5774) | 154 (167) | 1080 (1213) | −11 % | 162 (424) | 1030 (1256) |
| iPad 1180 × 820 ležeče, Safari | 5338 (5718) | 155 (157) | 1111 (1192) | −7 % | 166 (443) | 1039 (1337) |
| računalnik 1366 × 768, Chrome/Edge | 5097 (5433) | 148 (288) | 786 (990) | −21 % | 115 (259) | 752 (965) |
| Mac 1440 × 900, Safari | 5392 (5749) | 164 (213) | 1085 (1261) | −14 % | 189 (427) | 1015 (1268) |
| računalnik 1920 × 1080, Firefox | 5235 (5816) | 222 (384) | 1034 (1191) | −13 % | 232 (375) | 1005 (1135) |

- **Ponovni obisk, Učna pot:** hitrejša na 9 od 9 kombinacij. Mediana vseh 63 ponovitev je 1052 ms, prej 1193 ms.
- **Prvi obisk:** hitrejši na 9 od 9, za 330–580 ms. Mediana je 5296 ms, prej 5724 ms. To je ena meritev na kombinacijo, zato je to le smer, ne natančna številka.
- **Prva vsebina pri ponovnem obisku v WebKitu:** ostane enaka, 151–164 ms proti 153–213 ms. Posnetek zadnjega zaslona je bil že prej takojšen. V Chromiumu in Firefoxu se je skrajšala za približno polovico.
- **Osvežitev, prva vsebina:** povsod hitrejša, 115–232 ms, prej 259–452 ms.
- Surove ponovitve so v `matrika-naprav-2026-11-26.json` (`surovo`).

## Napake in neuspehi
- **Prekrivanje, mali drsnik, vodoravno drsenje:** ni jih.
- **»Drugo« v WebKitu (Safari):**
  - `konzola: Viewport argument key "interactive-widget" not recognized and ignored.` (32-krat, vse WebKit kombinacije). Safari ne pozna ključa `interactive-widget` v `<meta name="viewport">` (`public/index.html`). Chrome z njim ob odprti tipkovnici skrči vsebino. Safari ključ prezre in izpiše opozorilo v konzolo. Na zaslon to ne vpliva. Dimni test ga šteje kot napako, ker šteje vsako opozorilo v konzoli. Tega v testu nismo utišali.
  - `napaka strani: ResizeObserver loop completed with undelivered notifications.` (15-krat v WebKitu, 0-krat v Chromiumu in Firefoxu). Pojavi se na zavihku Uči se, v Laboratoriju, pri NPZ in maturi ter v Vadbi za izpit. Brskalnik tako sporoči, da je nekaj obvestil o velikosti prestavil v naslednjo sličico. Na posnetkih ni vidne napake. V ločenem poskusu (Uči se ↔ Učna pot na iPhonu) se ni ponovilo. Katerega od 19 opazovalcev velikosti sproži, še ne vemo. To je odprta naloga.
  - **mac-1440, 2× »korak ni uspel« (Tekmovanja, Poskusno tekmovanje):** napaka dimnega testa, ne aplikacije. Čestitka »Nova raven« je v Safariju prišla malo pozneje kot v Chromu, med odgovarjanjem na nalogo. Dimni test je zapiral čestitko pred klikom gumba, ne pa pred vnosom odgovora, zato je klik na polje čakal 30 s. Popravljeno v `answerTask` (`scripts/preveri-aplikacijo.cjs`). Ponovni zagon samo za mac-1440 po popravku: glej spodaj.

- **mac-1440 po popravku dimnega testa** (samo dimni test, ista koda): 147 posnetkov, 0 neuspelih korakov, 0 prekrivanj, 0 malih drsnikov, 0 vodoravnega drsenja. Ostanejo samo 4 opozorila `interactive-widget` in 2 obvestili `ResizeObserver loop` (`macPoPopravku` v JSON).

## Omejitve
- To so pogoni brskalnikov v Playwrightu, ne pravi Safari, iPhone, iPad ali Android. Pisav, tipkovnice na zaslonu, vrstice z naslovom in varnih robov (notch) pravih naprav ta meritev ne vidi. Pravi iPad je bil ročno preverjen 25. 11. (nit 3D na iPadu), za to meritev ne.
- Procesor ni upočasnjen. Na šibkem telefonu so časi daljši, razlika prej/potem pa velja le za ta stroj.
- Dimni test obišče zaslone, ki jih ima v korakih (brez računov in plačil). Iskanje prekrivanj je samodejno (mehurček inštruktorja, obvestilo) in ne zajame vsakega mogočega prekrivanja.
- Prvi obisk je ena meritev na kombinacijo. Ponovni obisk in osvežitev imata po 7 ponovitev.
- Edge, Samsung Internet in starejše različice brskalnikov niso zajeti.

## Stroški
Klicev API: 0, cena: 0 $. Inštruktor teče v preizkusnem načinu.
