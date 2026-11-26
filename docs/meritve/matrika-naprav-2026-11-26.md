# Matrika naprav in brskalnikov K-12 (26. 11. 2026)

## Povzetek
- Glavna številka: **0 prekrivanj in 0 malih drsnikov (▲▼) na 9 od 9 kombinacij** naprave in brskalnika (cilj 0, nižje je bolje), n = 821 posnetkov dimnega testa (63–147 na kombinacijo). Tudi vodoravnega drsenja ni nikjer. »Prekrivanje« je tu samodejno pravilo dimnega testa: mehurček inštruktorja ali obvestilo prekrije gumb, povezavo ali polje. Plavajoči gumbi nad navadnim besedilom ne štejejo (glej Napake in neuspehi).
- Hitrost ponovnega obiska (nov zavihek, počasno omrežje »Slow 4G«): pravi pogled Učna pot z napredkom je na vseh 9 kombinacijah hitrejši kot pred delom na hitrosti (N-08, N-08b, N-08c). Mediana vseh 63 ponovitev je **1087 ms, prej 1197 ms** (−9 %), po kombinacijah od −5 % do −19 %. Prva vsebina (posnetek zadnjega zaslona) se pri osvežitvi pokaže v 120–251 ms, prej 263–461 ms.
- Pomeni: v pogonih, ki posnemajo Android, iPhone, iPad, Windows, Mac in Firefox, se Evklid na vseh zaslonih, ki jih obišče dimni test, izriše brez prekrivanj kontrol in brez malih drsnikov. Ob vrnitvi se odpre hitreje kot pred N-08.
- Ne pomeni: da je tako na pravih napravah. To so pogoni brskalnikov v Playwrightu (Chromium, WebKit, Firefox) na strežniku v oblaku, ne pravi telefoni, Safari ali iPad. Prvi obisk (prazen predpomnilnik) ostaja okoli 5,0–5,5 s do obrazca za nov profil, kar je nad ciljem 2,5 s na nadzorni plošči.

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
- **Zasloni:** vsi koraki dimnega testa `scripts/preveri-aplikacijo.cjs` za postavitev (telefon ali računalnik), brez korakov z računi (`--brez-racunov`). Telefon: 63–64 posnetkov (ipad-1180 nima posnetka `poskus-povecan-tel`: gumb »Povečaj risbo« se pokaže le, ko je poskus ožji od 800 px (`public/sim/materiali.js`), na ležečem iPadu je širši), računalnik: 144–147.
- **Kdo je določil pričakovani izid:** pravila dimnega testa (prekrivanje mehurčka in obvestila, mali drsnik, vodoravno drsenje) so v repozitoriju od prej (UX PR 1 #1127, `docs/oblikovanje.md`). Za to meritev se niso spremenila. Skriti kontrolni del: ne.

## Metoda
- **Ukaz:** `PLAYWRIGHT_BROWSERS_PATH=<mapa> node scripts/matrika-naprav.cjs --mapa <izhod> --prej <mapa različice prej>`. Ponovni zagon za Mac: `… --samo mac-1440 --brez-hitrosti`. Playwright 1.63.0 ni odvisnost repozitorija; brskalnike WebKit in Firefox namestimo z `npx playwright install webkit firefox` (in `install-deps webkit`). Za vsako kombinacijo najprej teče dimni test, nato hitrost (`scripts/hitrost-naprav.cjs`) za »potem« in »prej«. Naenkrat teče ena kombinacija.
- **Commit:** »potem« je `main` 613278d73e1fc9e94e00af64167ddfcd063ad2e8 z vejo K-12 (spremembe samo v `scripts/`): glavni zagon s skriptami iz 9960e80a, ponovni zagon za Mac s popravkom `answerTask` iz ed283244. »Prej« je `main` dc49e90721dec820c59fbcb15e6554bdb1c4f8ca (N-07 #1118), torej pred N-08 #1124, N-08b #1131 in N-08c #1137.
- **Stroj:** oblak, 4 jedra Intel Xeon 2,1 GHz, Node 22, strežnik v preizkusnem načinu (`EVKLID_MOCK=1`, `EVKLID_SKRCI=1` kot v produkciji). Procesor ni upočasnjen, ker WebKit in Firefox v Playwrightu tega ne podpirata. Zato so časi primerljivi samo med »prej« in »potem« na istem stroju, ne s pravim telefonom.
- **Omrežje:** posrednik med brskalnikom in strežnikom vsakemu odgovoru doda 150 ms zakasnitve, ki se prišteje času strežnika. Vse odgovore pošilja po kosih do 16 kB skozi eno linijo s hitrostjo 1,6 Mbit/s × 0,9, kar je profil »Slow 4G« iz Lighthouse. Za vse tri pogone je enak (`posrednik()` v `scripts/hitrost-naprav.cjs`, preverja ga `test/matrika-naprav.test.js`).
- **Hitrost:**
  - Prvi obisk: od začetka nalaganja do vidnega obrazca za nov profil, s praznim predpomnilnikom. To je ena meritev na kombinacijo.
  - Nato nov profil (OŠ, 8. razred). Med vsemi meritvami posrednik počaka 3,5 s in nato, da 0,5 s ni nobene zahteve v teku. Tako se preverjanje service workerja v ozadju (3 s po odprtju, `public/sw.js`, samo »potem«) ne prekrije z naslednjo meritvijo.
  - Merilnik v strani preverja stanje samo v sličicah (`requestAnimationFrame`). Brez posnetka zadnjega zaslona šteje za prvo vsebino že statično ogrodje Učne poti iz `index.html`.
  - Hitrost je izmerjena v ločenem zagonu (`--brez-dimnega`) po pregledu skript. Tako iPad kot telefon tečeta z mobilnim pogledom (`isMobile`), kot v dimnem testu.
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
| **Skupaj** | **821** | **0** | **0** | **0** | |

Ker prekrivanja ni bilo na nobeni od 9 kombinacij, je zgornja meja 95-% intervala (Wilson, enostransko) za delež
kombinacij s prekrivanjem 30 %. Na ravni posnetkov (n = 821) je zgornja meja 0,5 %. Posnetki niso neodvisni, saj gre za iste zaslone na različnih napravah, zato je ta meja preozka.

### Hitrost (mediana v ms, v oklepaju »prej«)

Intervala za mediane ne navajamo: 7 ponovitev na kombinacijo je premalo za zanesljiv interval. Namesto tega je pri Učni poti razpon (najmanj–največ) vseh 7 ponovitev, surove vrednosti so v JSON (`surovo`).

| Kombinacija | Prvi obisk | Ponovni obisk: prva vsebina | Ponovni obisk: Učna pot | Razpon Učne poti | Sprememba Učne poti | Osvežitev: prva vsebina | Osvežitev: Učna pot |
|---|---|---|---|---|---|---|---|
| Android telefon 360 × 740, Chrome | 5015 (5388) | 168 (339) | 867 (1070) | 796–1010 (987–1113) | −19 % | 120 (263) | 810 (998) |
| Android telefon 412 × 915, Chrome | 5049 (5404) | 166 (340) | 842 (1021) | 775–900 (929–1076) | −18 % | 120 (286) | 824 (1031) |
| iPhone SE 375 × 667, Safari | 5334 (5716) | 294 (287) | 1099 (1204) | 1021–1278 (1172–1299) | −9 % | 206 (445) | 1040 (1339) |
| iPhone 390 × 844, Safari | 5347 (5664) | 305 (293) | 1113 (1206) | 1043–1185 (1173–1321) | −8 % | 203 (461) | 1034 (1371) |
| iPad 820 × 1180 pokončno, Safari | 5333 (5778) | 300 (292) | 1146 (1201) | 1098–1317 (1158–1292) | −5 % | 229 (435) | 1132 (1306) |
| iPad 1180 × 820 ležeče, Safari | 5364 (5691) | 277 (306) | 1093 (1231) | 1035–1286 (1171–1361) | −11 % | 194 (455) | 990 (1384) |
| računalnik 1366 × 768, Chrome/Edge | 5077 (5424) | 167 (389) | 858 (1030) | 768–901 (951–1093) | −17 % | 123 (273) | 796 (1016) |
| Mac 1440 × 900, Safari | 5494 (5709) | 298 (319) | 1181 (1253) | 1062–1362 (1218–1366) | −6 % | 222 (456) | 1017 (1376) |
| računalnik 1920 × 1080, Firefox | 5206 (5519) | 252 (397) | 1114 (1231) | 1056–1213 (1168–1279) | −10 % | 251 (400) | 1070 (1202) |

- **Ponovni obisk, Učna pot:** hitrejša na 9 od 9 kombinacij. Mediana vseh 63 ponovitev je 1087 ms, prej 1197 ms. Na Chromu in Firefoxu se razpona »prej« in »potem« skoraj ne prekrivata. V Safariju (WebKit) se deloma prekrivata, zato je tam izboljšava (5–11 %) manj gotova.
- **Prvi obisk:** hitrejši na 9 od 9, za 215–445 ms. Mediana je 5333 ms, prej 5664 ms. To je ena meritev na kombinacijo, zato je to le smer, ne natančna številka.
- **Prva vsebina pri ponovnem obisku v WebKitu:** ostane približno enaka, 277–305 ms proti 287–319 ms (na iPhonih in pokončnem iPadu 7–12 ms počasneje). Posnetek zadnjega zaslona je bil že prej takojšen. V Chromiumu in Firefoxu se je skrajšala za približno polovico.
- **Osvežitev, prva vsebina:** povsod hitrejša, 120–251 ms, prej 263–461 ms.
- Surove ponovitve so v `matrika-naprav-2026-11-26.json` (`surovo`).

## Napake in neuspehi
- **Prekrivanje, mali drsnik, vodoravno drsenje:** ni jih.
- **»Drugo« v WebKitu (Safari):**
  - `konzola: Viewport argument key "interactive-widget" not recognized and ignored.` (32-krat, vse WebKit kombinacije). Safari ne pozna ključa `interactive-widget` v `<meta name="viewport">` (`public/index.html`). Chrome z njim ob odprti tipkovnici skrči vsebino. Safari ključ prezre in izpiše opozorilo v konzolo. Na zaslon to ne vpliva. Dimni test ga šteje za napako, ker šteje vsako opozorilo v konzoli. Tega v testu nismo utišali.
  - `napaka strani: ResizeObserver loop completed with undelivered notifications.` (15-krat v WebKitu, 0-krat v Chromiumu in Firefoxu). Pojavi se na zavihku Uči se, v Učbeniku, pri vprašanju iz 3D, v Laboratoriju, pri NPZ in maturi ter v Vadbi za izpit. V ponovnem zagonu za mac-1440 se je namesto pri NPZ pokazalo pri načinu Test, torej se ne pojavi vedno na istem mestu. Brskalnik tako sporoči, da je nekaj obvestil o velikosti prestavil v naslednjo sličico. Na posnetkih ni vidne napake. V ločenem poskusu (Uči se ↔ Učna pot na iPhonu) se ni ponovilo. Katerega od 19 opazovalcev velikosti sproži, še ne vemo. To je odprta naloga.
  - **mac-1440, 2× »korak ni uspel« (Tekmovanja, Poskusno tekmovanje):** napaka dimnega testa, ne aplikacije. Čestitka »Nova raven« se je v Safariju pokazala malo pozneje kot v Chromu, med odgovarjanjem na nalogo. Dimni test je zapiral čestitko pred klikom gumba, ne pa pred vnosom odgovora, zato je klik na polje čakal 30 s. Popravljeno v `answerTask` (`scripts/preveri-aplikacijo.cjs`). Ponovni zagon samo za mac-1440 po popravku: glej spodaj.

- **mac-1440 po popravku dimnega testa** (samo dimni test, ista koda): 147 posnetkov, 0 neuspelih korakov, 0 prekrivanj, 0 malih drsnikov, 0 vodoravnega drsenja. Ostanejo samo 4 opozorila `interactive-widget` in 2 obvestili `ResizeObserver loop` (`macPoPopravku` v JSON).

## Omejitve
- **Kar samodejno pravilo ne zajame** (pregled posnetkov, 11 od 821):
  - Android 360 (`055-tel-mehurcek-tel`): plavajoči mehurček inštruktorja prekrije konec besedila v kartici Današnji trening (»nova sn…«). Gumba ne prekrije; mehurček se lahko premakne.
  - iPhone SE 375 × 667 (`039-tel-lekcija-korak-tel`): plavajoči gumbi lekcije (←, 2/12, →) in mehurček so nad besedilom lekcije. Besedilo se pomakne izpod njih. Obvestilo »Hvala! Lekcijo bomo preverili« za kratek čas prekrije besedilo.
  - Mac Safari 1440 (`049-pc-tekmovanja-OS`, samo WebKit): tanka vodoravna črta nad kartico Sklop 2 in srednji stolpec je približno 15 px nižje od desnega. V Chromu tega ni. Odprta naloga.
  - iPhone SE, kalkulator (`042-tel-kalkulator-sci-tel`): tanek navpični drsnik v ozkem zgodovinskem delu. Ni mali drsnik ▲▼. Odpravil ga je #1181 (združen po tej meritvi); ponovni posnetek na main 2275cc2f v WebKitu 375 × 667 ga nima več.
- To so pogoni brskalnikov v Playwrightu, ne pravi Safari, iPhone, iPad ali Android. Pisav, tipkovnice na zaslonu, vrstice z naslovom in varnih robov (notch) pravih naprav ta meritev ne vidi. Pravi iPad je bil ročno preverjen 25. 11. (nit 3D na iPadu), za to meritev ne.
- Procesor ni upočasnjen. Na šibkem telefonu so časi daljši, razlika prej/potem pa velja le za ta stroj.
- Dimni test obišče zaslone, ki jih ima v korakih (brez računov in plačil). Iskanje prekrivanj je samodejno (mehurček inštruktorja, obvestilo) in ne zajame vsakega mogočega prekrivanja.
- Prvi obisk je ena meritev na kombinacijo. Ponovni obisk in osvežitev imata po 7 ponovitev.
- Edge, Samsung Internet in starejše različice brskalnikov niso zajeti.

## Stroški
Klicev API: 0, cena: 0 $. Inštruktor teče v preizkusnem načinu.
