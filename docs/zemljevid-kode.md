# Zemljevid kode

Samodejno ustvarjeno z `node scripts/zemljevid-kode.mjs` (2026-11-19). Ne urejaj ročno: popravi uvodni
komentar datoteke in znova poženi skripto. Opis je prva vrstica komentarja na vrhu datoteke.

## Kje je kaj

| Kaj | Kje |
|---|---|
| Zagon strežnika, vse poti API | `server/app.js`, `server/index.js` |
| Računi, prijava, starost in privolitev staršev, izbris | `server/accounts/` (`auth.js`, `age.js`, `izbris.js`, `index.js`) |
| Plačila, paketi, odstop, garancija | `server/accounts/plans.js`, `server/accounts/billing.js`, `server/accounts/stripe.js`, `server/placila/` |
| Klic modela AI, poziv inštruktorja, meje porabe | `server/claude.js`, `server/prompt.js`, `prompts/system_prompt.md`, `server/usage.js`, `server/meje-ai.js` |
| Preverjanje odgovorov | `server/live-check.js`, `server/verify.js`, `server/sodba-koraka.js`, `server/hitri-korak.js` |
| Varnost učencev (stiska, nujni primeri) | `server/nujno.js`, `server/stiska-obvestilo.js`, `public/nujno.js` |
| Baza, šifriranje, roki hrambe, kopije | `server/db.js`, `server/crypto-polje.js`, `server/zasebnost.js`, `server/kopije*.js` |
| Vadnica (generatorji nalog) | `server/practice/` |
| Vsebina lekcij | `content/lessons/` (Markdown, ni v tem seznamu) |

## Vsote

| Del | Koda (vrstic) | Podatki (vrstic) | Datotek |
|---|---:|---:|---:|
| Strežnik | 110.957 | 61.764 | 209 |
| Odjemalec (public/*.js, samo vrhnja mapa) | 34.535 | 3101 | 133 |
| Skripte | 14.579 | 0 | 83 |

»Podatki« so datoteke, ki so večinoma tabele (učni načrti, izpitne pole, fakultetni predmeti), ne logika.

## Strežnik

| Datoteka | Vrstic | Kaj dela |
|---|---:|---|
| `server/accounts/account-lock.js` | 63 | Zaklep računa (j, 2026-10-30): zavihek Račun in dejanja lastnika računa (naročnina, profili, |
| `server/accounts/age.js` | 52 | Preverjanje starosti ob registraciji (GDPR čl. 8). |
| `server/accounts/auth.js` | 164 | Gesla (scrypt), seje s piškotkom in žetoni za e-poštne povezave. |
| `server/accounts/billing.js` | 1046 | Novi del plačil (j 2026-10-30, načrt »Evklid – nov sistem plačil«): |
| `server/accounts/devices.js` | 94 | Naprave: profil je hkrati odprt samo na eni napravi, menjava profilov je omejena, |
| `server/accounts/email.js` | 382 | Pošiljanje e-pošte prek Resend. Brez ključa se sporočilo izpiše v dnevnik (razvoj). |
| `server/accounts/goal-reminder.js` | 47 | Dnevni opomnik ob 12.00 (Ljubljana) do datuma cilja: »Matura: še 215 dni. Danes 15 minut?« |
| `server/accounts/guest.js` | 195 | Uporaba brez registracije (gost) je odstranjena (j, 2026-10-29); ta koda ostane za stare goste in teste. |
| `server/accounts/index.js` | 3090 | Starševski računi, soglasja, naročnine (Stripe), priporočila in tedenska poročila (Resend). |
| `server/accounts/izbris.js` | 35 | Izbris profilov in računa iz baze: ena pot za DELETE /api/account, prevzem nepotrjenega računa (#747, pregled 2) |
| `server/accounts/neaktivni.js` | 145 | Neaktivni računi (j 18. 11. 2026, po osnutku DPIA). Vklop samo z EVKLID_NEAKTIVNI=1 (privzeto izklopljeno, j vklopi |
| `server/accounts/pilot-meja.js` | 95 | Meja inštruktorja za pilot in lastnika (j 2026-11-06 12:14). |
| `server/accounts/plans.js` | 492 | Paketi, cene in pravica do polnega dostopa. |
| `server/accounts/ponoven-id.js` | 103 | id računa (parents.id, INTEGER PRIMARY KEY brez AUTOINCREMENT) dobi po izbrisu naslednji nov račun. Dogodek Stripa, |
| `server/accounts/potrdilo.js` | 137 | Splošni pogoji ob registraciji in nakupu ter potrdilo o nakupu po e-pošti (#765 točki 2 in 3, j 2026-11-17). |
| `server/accounts/profile-lock.js` | 88 | Geslo za vsak profil (j, 2026-10-29: »vsak profil naj ima svoje geslo«). |
| `server/accounts/promo.js` | 159 | Aktivacijske kode: poln dostop za D dni brez kartice (npr. EVKLID3X). |
| `server/accounts/schema.js` | 185 | Tabele za starševske račune, soglasja, naročnine, priporočila in e-pošto. |
| `server/accounts/stripe.js` | 172 | Tanek odjemalec za Stripe REST API (brez dodatne knjižnice) in preverjanje webhookov. |
| `server/accounts/weekly.js` | 422 | Tedensko poročilo: kaj se je učenec ta teden učil, kaj mu gre, kje se zatika in kaj naj naredi naslednji teden. |
| `server/advice.js` | 212 | Predlog mesečne meje AI in cene za skrbnika (števec porabe, public/usage-meter.js). |
| `server/ai-oznaka.js` | 42 | Podporni metapodatki za vsebino, ki jo je ustvarila umetna inteligenca (j 18. 11. 2026; v zvezi z AI Act čl. 50, |
| `server/anketa-teden.js` | 178 | Točka B3 (pilot, j 2026-11-14 potrdil besedilo in pravila): kratka anketa s tremi vprašanji 7 dni po prvi uporabi. |
| `server/app.js` | 2196 | HTTP strežnik Evklid: API + statični vmesnik. |
| `server/avatar.js` | 206 | Kovanci in avatar: pravilni odgovori v igrah prinesejo kovance, z njimi učenec kupuje dele avatarja |
| `server/brand.js` | 6 | Ime aplikacije (brand.json v korenu) za strežnik in skripte. Prejšnja imena (legacy) uporablja |
| `server/cas.js` | 160 | Most do pravega računalniškega algebrskega sistema (SymPy, server/cas/worker.py). |
| `server/casi-odgovora.js` | 106 | Časi odgovorov inštruktorja (j, 17. 11. 2026: »prvo besedilo naj pride prej«; najprej merimo, brez stroška). |
| `server/chat-settings.js` | 732 | Inštruktor spreminja nastavitve iz klepeta: orodji za model (get_settings, change_settings), |
| `server/claude.js` | 489 | Klic Claude API (pretakanje), izbira modela, strošek, preizkusni način. |
| `server/competition.js` | 178 | Razdelek »Tekmovanja«: samo težje naloge v slogu tekmovanj (MAT, FIZ, KEM; OŠ in SŠ). |
| `server/compress.js` | 186 | Stiskanje odgovorov (brotli ali gzip) brez dodatnih knjižnic: za počasne in drage |
| `server/corner.js` | 292 | Kotiček zanimanj: novice iz uglednih znanstvenih virov (RSS) za področja, ki jih je učenec |
| `server/crypto-polje.js` | 219 | Šifriranje osebnih polj v bazi (AES-256-GCM, node:crypto). Pregled: docs/varnost-podatkov.md. |
| `server/curriculum-data.js` (podatki) | 1039 | Učne poti po učnih načrtih (OŠ in gimnazija). |
| `server/curriculum.js` | 331 | Učne poti: dostop do podatkov iz curriculum-data.js. |
| `server/daily-puzzle.js` | 160 | Dnevna uganka (public/games/daily.js): ena uganka na dan za vse, v treh stopnjah, lestvica po času. |
| `server/db.js` | 658 | Shramba (SQLite, vgrajen v Node 22). |
| `server/dnevnik-dostopov.js` | 62 | Dnevnik dostopov (audit log): prijave, izvoz in izbris računa, gesla, dejanja skrbnika in učiteljev. |
| `server/env.js` | 24 | Nastavitve v .env iz časa prejšnjih imen aplikacije (brand.json → legacy, npr. <STARO>_PASSWORD) |
| `server/exam-data-africa.js` (podatki) | 1332 | Državni izpiti (podatki, enaka oblika kot EXAMS v exam-data.js). |
| `server/exam-data-asia.js` (podatki) | 704 | Državni izpiti (podatki, enaka oblika kot EXAMS v exam-data.js). |
| `server/exam-data-si.js` (podatki) | 159 | Slovenski državni izpiti kot poskusni izpit na čas: NPZ (6. in 9. razred) in splošna matura. |
| `server/exam-data-southasia.js` (podatki) | 1183 | Državni izpiti (podatki, enaka oblika kot EXAMS v exam-data.js). |
| `server/exam-data-west.js` (podatki) | 313 | Državni in mednarodni izpiti (podatki, enaka oblika kot EXAMS v exam-data.js). |
| `server/exam-data.js` (podatki) | 1612 | Priprave na izpite po državah (podatki). Izpiti po regijah so v exam-data-si.js (NPZ, matura), |
| `server/exam-helpers.js` | 12 | Gradniki podatkov o izpitih (exam-data.js in exam-data-*.js): teme iz banke in skupine |
| `server/exam-hi.js` | 257 | Indijski izpiti v hindijščini: imena in opisi izpitov ter imena sklopov in tem (po NCERT |
| `server/exam-papers-si.js` (podatki) | 441 | Katalog preteklih pol NPZ in mature (samo povezave na ric.si). Ustvari: node scripts/pole-ric.js (2026-10-30). |
| `server/exams.js` | 194 | Priprave na izpite (SAT, gaokao, JEE, NEET, CBSE, ICSE/ISC …): poti, poskusni izpit in točkovanje. |
| `server/explanations.js` | 28 | Vnaprej pripravljene razlage tem (ustvarjene enkrat z Batch API, glej |
| `server/feedback.js` | 353 | Povratne informacije testerjev: vprašalnik (ocene po področjih + pripombe) in kratek pogovor. |
| `server/flashcards.js` | 159 | Kartice za ponavljanje: pomembna dejstva, ki jih inštruktor zapiše v blok <<KARTICA …>>, |
| `server/games.js` | 365 | Igre (razdelek IGRE): najboljši rezultat in stopnja za vsako igro, XP za pravilne odgovore. |
| `server/gate.js` | 150 | Zaščita testne različice z enim skupnim geslom (EVKLID_PASSWORD). |
| `server/govor.js` | 296 | Besedilo lekcije (Markdown + LaTeX) → slovensko besedilo za branje na glas (zvočni povzetek). |
| `server/gradiva-vsebina.js` (podatki) | 232 | Napisana gradiva ob temi (docs/gradiva.md): domači poskus, projekt iz resničnega življenja in kratek |
| `server/gradiva.js` | 482 | Nove vrste gradiv ob lekciji (docs/gradiva.md): povzetek na eni strani z miselnim vzorcem |
| `server/graphs.js` | 76 | Shranjeni grafi grafičnega kalkulatorja (po učencu). Graf je JSON s seznamom izrazov, |
| `server/hints.js` | 40 | Prvi odgovor pri »Vprašaj Evklida« iz Vadnice brez klica modela. |
| `server/hitri-korak.js` | 20 | Poskus (j, 17. 11. 2026, privzeto IZKLOPLJEN): lahek prvi korak brez razmišljanja modela, da prvo besedilo pride |
| `server/ikone.js` | 10 | Ikone v <head> strani, ki jih izdela strežnik (tisk, gradiva, predračun ...), enake kot v public/index.html. |
| `server/ime-oznaka.js` | 156 | Ime učenca ne gre k ponudniku AI (j, 18. 11. 2026, po osnutku ocene učinka DPIA). |
| `server/index.js` | 68 | Obnova iz varnostne kopije (scripts/obnovi-kopijo.js) samo ob zagonu strežnika, preden se baza odpre. |
| `server/kopije-oblak.js` | 197 | Dnevna kopija baze tudi zunaj Renderja (docs/objava.md → »Kopija zunaj Renderja«). |
| `server/kopije-preizkus.js` | 92 | Preizkus obnove iz kopije (scripts/obnovi-kopijo.js --preveri in nočni preizkus, server/kopije-preveri.js). |
| `server/kopije-preveri.js` | 170 | Nočni samodejni preizkus obnove iz varnostne kopije (docs/objava.md → »Varnostna kopija«); ročno isto naredi |
| `server/kopije.js` | 241 | Dnevne varnostne kopije baze in obnova iz kopije (docs/objava.md → »Varnostna kopija«). |
| `server/kviz.js` | 330 | Kviz v živo za razred (kot Kahoot): učitelj vodi kviz na projektorju (ucitelj.html), učenci razreda |
| `server/laboratorij.js` | 55 | Virtualni laboratorij kot svoj zavihek (public/laboratorij.js, docs/laboratorij.md): vsi poskusi iz |
| `server/leagues.js` | 587 | Tedenske lige in razredne/prijateljske lestvice. |
| `server/lekcija-za-vprasanje.js` | 190 | Lokalno iskanje lekcije za vprašanje v prostem pogovoru (optimizator 2026-11-04, »local lesson search«). |
| `server/lesson-check.js` | 363 | Preverjanje oblike lekcije učbenika (content/lessons/README.md). |
| `server/lesson-identity.js` | 451 | Varovalo za enačbe z neznankami (j, 1. 11. 2026: napaka kot »z·z̄ = a² − b²« se ne sme ponoviti; |
| `server/lesson-math.js` | 275 | Samodejno preračunavanje številskih korakov v lekciji (docs/kakovost.md §1.1, docs/token-rules.md §3). |
| `server/level-up.js` | 83 | Prehod v višji razred, letnik ali na fakulteto. |
| `server/live-check.js` | 1175 | Sprotno preverjanje odgovorov inštruktorja (j, 2026-10-30: »kako vemo, da Haiku najprej ne da napačnega |
| `server/meje-ai.js` | 172 | Trda meja stroška AI na uporabnika (j 2026-11-06 6:40, »marža vedno ≥ 75 %«). |
| `server/meritev-po-objavi.js` | 337 | Samodejna ciljna meritev natančnosti po vsaki spremembi lekcij ali prompta v main (j 2026-11-12). |
| `server/meta.js` | 195 | Branje in odstranjevanje strojnih blokov iz odgovorov modela: |
| `server/mobile/apk-info.js` | 120 | Različica datoteke APK (versionCode, versionName) iz AndroidManifest.xml v njej. |
| `server/mobile/app-link.js` | 151 | Iz brskalnika v aplikacijo brez ponovne prijave (j, 2026-10-30: »če app prenese nekdo iz spletne strani |
| `server/mobile/apple-crypto.js` | 152 | Preverjanje podpisov Apple brez zunanjih knjižnic: |
| `server/mobile/apple-signin.js` | 196 | Prijava z Apple v mobilni aplikaciji (iPhone, iPad). |
| `server/mobile/calculator.js` | 14 | Stran /kalkulator: kalkulator spletne aplikacije (znanstveni, grafični, orodja, PSE) brez prijave, |
| `server/mobile/download.js` | 215 | Stran /prenesi: Evklid kot aplikacija za Android in iPhone, tudi mimo trgovin. |
| `server/mobile/google-play.js` | 83 | Google Play Developer API: stanje naročnine iz žetona nakupa (purchases.subscriptionsv2). |
| `server/mobile/index.js` | 55 | Strežniški del mobilne aplikacije (mobile/): prijava brez piškotkov, prijava z Apple, |
| `server/mobile/push.js` | 117 | Potisna obvestila v mobilno aplikacijo (Expo Push: ena pot za APNs na iPhonu in FCM na Androidu). |
| `server/mobile/store-billing.js` | 287 | Naročnine iz App Store (StoreKit 2) in Google Play (Play Billing) za mobilno aplikacijo. |
| `server/mobile/trgovina.js` | 73 | Različica aplikacije iz trgovine (Google Play, App Store) ne sme ponuditi nakupa s kartico (Apple 3.1.1, Google Play |
| `server/mobile/web-session.js` | 36 | Aplikacija pokaže pravo spletno stran (j, 2026-11-04: »Splet znotraj aplikacije«, da sta splet in aplikacija |
| `server/nacin.js` | 19 | Način A (vodenje) / B (celotna rešitev) med pogovorom (j 14. 11. 2026): učenec zamenja način v glavi Inštruktorja, |
| `server/nastevanje.js` | 144 | Naštevanje števil z decimalno vejico (j, 6. 11. 2026): kadar je v naštevanju vsaj eno število z |
| `server/ni-strani.js` | 51 | Kratke povezave na javne strani in prijazna stran 404 (pregled celotne aplikacije, 17. 11. 2026). |
| `server/nujno.js` | 393 | Varnost čez mejo porabe (j, 6. 11. 2026; kartica-nujno, potrjena 6. 11.). |
| `server/odpiranje-delov.js` | 94 | Točka B2 (pilot, j 2026-11-14): kateri deli aplikacije se odpirajo in ali se isti učenec vanje vrača. |
| `server/odpri.js` | 342 | Inštruktor odpre orodja aplikacije iz pogovora (j 2026-11-04, ideje 1, 4, 6, 7, 11, 25, 26; docs/odpri.md). |
| `server/opozorilo-ai.js` | 131 | Opozorilo o dnevnem strošku AI (6. korak priprave na pilot, docs/spremljanje.md). Vsakih 10 min sešteje današnjo |
| `server/our-paper-structures.js` | 85 | Zgradba izvirnih pol RIC, ki jim sledijo naše pole (content/exam-papers): samo število nalog, točke po delih in |
| `server/our-papers.js` (podatki) | 148 | Naše pole v slogu preteklih pol NPZ in mature (j 30. 10. 2026: »ne uporabljaj dobesednih nalog, samo strukturo |
| `server/paper-context.js` | 49 | Skrit kontekst pri nalogi iz pretekle pole (»Pomoč pri tej nalogi«, »Rešuj z inštruktorjem«, public/app.js): |
| `server/pdf-potrdilo.js` | 100 | Preverjanje potrdila o izvoru (GitHub artifact attestation, Sigstore) za kazalo vnaprej izdelanih PDF-jev učbenika |
| `server/pilot-mnenja.js` | 295 | Mnenja članov pilota (j, 2026-11-10): ocena 1–5 zvezdic, »Kaj ti je najbolj všeč?«, »Kaj te najbolj moti?« in |
| `server/pilot-naloge.js` | 609 | Naloge za člane pilota (j 2026-11-06): »Pomagaj izboljšati Evklid« v zavihku Jaz. |
| `server/pilot-ucinek.js` | 324 | Merjenje učinka v pilotu (j, 6. 11. 16:0x): kratek preizkus znanja na začetku in čez 14 dni ter vprašanje za starše |
| `server/pilot.js` | 136 | Merjenje v pilotu (j 2026-10-30, točka 6 načrta »Evklid Osebno in šolska licenca»): |
| `server/placila/darila.js` | 308 | Darilna koda (j 2026-10-30): polnoletna oseba kupi kodo za eno leto Osebno (en profil) za 49 € |
| `server/placila/garancija.js` | 349 | Garancija »Boljša ocena ali vrnemo denar« (j 2026-11-04, kartici ob 3.55 in 7.56). |
| `server/placila/krediti.js` | 124 | Dokupljena poraba AI (j 2026-10-30): ko učenec porabi svoj mesečni delež skupnega proračuna |
| `server/placila/odstop.js` | 538 | Funkcija za odstop od pogodbe (ZVPot-1A, nov 138.a člen; Direktiva (EU) 2023/2673, člen 11a Direktive 2011/83/EU). |
| `server/placila/placano.js` | 177 | Dejansko plačilo naročnine po obdobjih (j 2026-11-06 12:53, pregled #462 A2): meja AI in vračilo iz tega, kar je |
| `server/placila/podari.js` | 262 | »Podari Evklid« (j 2026-11-04, kartica »Oboje«): otroci, ki si naročnine ne morejo privoščiti, dobijo kodo |
| `server/placila/ponudbe.js` | 63 | Pravila ponudb (j 2026-10-30, načrt »Šolska licenca in Evklid Osebno«, UCPD Priloga I, točka 28): |
| `server/placila/pravice.js` | 164 | Pravice: kaj učenec dobi iz vseh virov skupaj (j 2026-10-30, načrt »Šolska licenca in Evklid Osebno«). |
| `server/placila/sola-vir.js` | 104 | Šolska licenca kot vir pravic (server/placila/pravice.js). Podatke o šolah, licencah in razredih ima |
| `server/pogoji-stran.js` | 30 | Stran /pogoji.html glede na EVKLID_POGOJI_OBJAVLJENI (server/accounts/potrdilo.js termsPublished). |
| `server/pomnilnik.js` | 83 | Pomnilnik strežnika za Stražo (točka D4, master brief j 13. 11.): delež porabe od meje gostovanja. |
| `server/povzetek.js` | 114 | Sprotni povzetek dolgega pogovora (optimizator 2026-11-04, j sprožil čakalno vrsto). Inštruktor dobi |
| `server/practice/check.js` | 466 | Preverjanje odgovorov: števila (z zaokroževanjem in enotami), ulomki in razmerja, |
| `server/practice/choice.js` | 95 | Izbirna vprašanja za izpite (SAT, JEE, NEET, gaokao …): številski ali ulomkovni odgovor |
| `server/practice/generators/bio.js` | 476 | Naloge pri biologiji (OŠ 8. in 9. razred, gimnazija 1.–4. letnik). |
| `server/practice/generators/dodatne-fiz-ss.js` | 3894 | Generatorji za teme, ki prej niso imele nalog (fiz-ss). Merila: docs/kakovost.md §2. |
| `server/practice/generators/dodatne-kem-ss.js` | 2395 | Generatorji za teme, ki prej niso imele nalog (kem-ss). Merila: docs/kakovost.md §2. |
| `server/practice/generators/dodatne-mat-os.js` | 5140 | Generatorji za teme, ki prej niso imele nalog (mat-os). Merila: docs/kakovost.md §2. |
| `server/practice/generators/dodatne-mat-ss12.js` | 3363 | Generatorji za teme, ki prej niso imele nalog (mat-ss12: gimnazija, 1. in 2. letnik). Merila: docs/kakovost.md §2. |
| `server/practice/generators/dodatne-mat-ss34.js` | 3633 | Generatorji za teme, ki prej niso imele nalog (mat-ss34). Merila: docs/kakovost.md §2. |
| `server/practice/generators/dodatne-os-fiz-kem.js` | 3755 | Generatorji za teme, ki prej niso imele nalog (os-fiz-kem). Merila: docs/kakovost.md §2. |
| `server/practice/generators/dodatne-vrzeli-fiz-kem.js` | 1545 | Naloge za teme fizike in kemije, dodane po primerjavi z učnimi načrti (2026-10-30): fizika v sodobnih |
| `server/practice/generators/dodatne-vrzeli-mat.js` | 1191 | Naloge za teme matematike, dodane po primerjavi z učnimi načrti (2026-10-30): množice in diagrami (OŠ 6), |
| `server/practice/generators/exam-fiz.js` | 1428 | Izpitne naloge iz fizike (angleško in hindijsko) za JEE, NEET, gaokao in CBSE: mehanika, nihanje, |
| `server/practice/generators/exam-gap-bio.js` | 2331 | Naloge za teme drugih državnih izpitov, ki jih banka še ni imela (angleško in hindijsko). |
| `server/practice/generators/exam-gap-fiz.js` | 1420 | Naloge za teme drugih državnih izpitov, ki jih banka še ni imela (angleško in hindijsko). |
| `server/practice/generators/exam-gap-kem.js` | 941 | Naloge za teme drugih državnih izpitov, ki jih banka še ni imela (angleško in hindijsko). |
| `server/practice/generators/exam-gap-mat.js` | 2340 | Naloge za teme drugih državnih izpitov, ki jih banka še ni imela (angleško in hindijsko): |
| `server/practice/generators/exam-in-bio.js` | 3753 | Indija: izpitne naloge iz biologije (NEET-UG, CBSE/ICSE/ISC), angleško in hindijsko. |
| `server/practice/generators/exam-in-fiz.js` | 2469 | Indija: izpitne naloge iz fizike (CBSE/NCERT, ICSE/ISC, državne šole, JEE, NEET), angleško in hindijsko. |
| `server/practice/generators/exam-in-kem.js` | 3330 | Indija: izpitne naloge iz kemije (CBSE, ICSE/ISC, državne šole, JEE, NEET), angleško in hindijsko. |
| `server/practice/generators/exam-in-mat.js` | 3359 | Indija: izpitne naloge (CBSE, ICSE/ISC, državne šole, JEE, NEET), angleško in hindijsko. |
| `server/practice/generators/exam-kem.js` | 1047 | Izpitne naloge iz kemije (angleško) za JEE, NEET, gaokao in CBSE: mol, stehiometrija, |
| `server/practice/generators/exam-mat.js` | 1697 | Izpitne naloge iz matematike (angleško in hindijsko): teme, ki jih zahtevajo SAT, gaokao, JEE in |
| `server/practice/generators/exam-util.js` | 97 | Pomožne funkcije za izpitne generatorje (SAT, gaokao, JEE, NEET, CBSE …). |
| `server/practice/generators/fiz.js` | 533 | Generatorji nalog za fiziko (OŠ in gimnazija). |
| `server/practice/generators/kem.js` | 439 | Generatorji nalog za kemijo (OŠ in gimnazija). |
| `server/practice/generators/mat.js` | 1979 | Generatorji nalog za matematiko v OŠ (6.–9. razred). |
| `server/practice/generators/matura-mat-ss1-geo.js` | 1163 | Generatorji za geometrijske teme 1. letnika gimnazije, ki jih zahteva maturitetna pot (MAT-SS-1): |
| `server/practice/generators/matura-mat-ss1.js` | 1661 | Generatorji za teme 1. letnika gimnazije, ki jih zahteva maturitetna pot (MAT-SS-1): kartezični produkt in |
| `server/practice/generators/matura-mat-ss2.js` | 1677 | Generatorji za teme 2. letnika gimnazije, ki jih zahteva maturitetna pot (MAT-SS-2): iracionalne |
| `server/practice/generators/matura-mat-ss3.js` | 1679 | Generatorji za teme 3. letnika gimnazije, ki jih zahteva maturitetna pot (MAT-SS-3): premice in |
| `server/practice/generators/matura-mat-ss4.js` | 1771 | Generatorji za teme 4. letnika gimnazije, ki so prišle z maturitetno potjo (MAT-SS-4). |
| `server/practice/generators/matura-util.js` | 65 | Skupne pomožne funkcije generatorjev za maturitetne teme (matura-mat-ss2/3/4.js). |
| `server/practice/generators/nar.js` | 95 | Naloge pri naravoslovju (OŠ 6. in 7. razred): izbirna vprašanja iz naborov za razvrščanje |
| `server/practice/generators/tek-fiz.js` | 1433 | Tekmovalne naloge iz fizike (Stefanovo priznanje, fizikalna olimpijada), OŠ in SŠ. |
| `server/practice/generators/tek-kem.js` | 1235 | Tekmovalne naloge iz kemije (Preglovo priznanje, kemijska olimpijada), OŠ in SŠ. |
| `server/practice/generators/tek-mat-os-mladi.js` | 528 | Tekmovalne naloge iz matematike za 1.–4. razred (Kenguru za mlajše; j, 15. 11. 2026). |
| `server/practice/generators/tek-mat-os.js` | 1327 | Tekmovalne naloge iz matematike za OŠ (Kenguru, Vegovo priznanje). |
| `server/practice/generators/tek-mat-ss.js` | 1084 | Tekmovalne naloge iz matematike za SŠ (Vegovo priznanje, matematična olimpijada). |
| `server/practice/generators/tek-util.js` | 147 | Pomožne funkcije za tekmovalne generatorje (tek-*.js). |
| `server/practice/generators/uni.js` | 1654 | Generatorji nalog za fakultetne predmete (1. stopnja). |
| `server/practice/generators/vrzeli-util.js` | 94 | Skupne pomožne funkcije za naloge tem, dodanih po primerjavi z učnimi načrti (2026-10-30): |
| `server/practice/index.js` | 214 | Register generatorjev in ustvarjanje nalog. |
| `server/practice/rng.js` | 61 | Ponovljiv generator naključnih števil (mulberry32) in pomožne funkcije. |
| `server/prenos-uporabnik.js` | 184 | Prenosi z naslova, ki ga vpiše uporabnik (točka A4): en modul za vse take prenose (zdaj uvoz koledarja .ics, |
| `server/progress.js` | 1154 | Napredovanje: prilagodljiva težavnost, obvladanje tem, odklepanje sklopov, |
| `server/prompt.js` | 144 | Sestavi sistemski prompt iz predloge in aktivnih nastavitev. |
| `server/proracun.js` | 89 | Mesečni proračun API (j 2026-10-30): izbira modela naj porabi čim bližje mesečnemu znesku |
| `server/racun.js` | 180 | »Račun za kodo« (j, 2026-11-11: »da lahko odgovore inštruktorja vedno potrdimo s kodo«). |
| `server/rast.js` | 357 | Lastna analitika rasti (j 2026-11-04, načrt rasti pred pilotom 15. 11.): od kod pridejo učenci, |
| `server/razlicica.js` | 75 | Katera različica Evklida teče (za samodejno osvežitev odprtih strani po posodobitvi). |
| `server/references.js` | 123 | Referenčni material za fakultetne predmete: prosto in zakonito dostopni viri |
| `server/region-curricula.js` | 964 | Učni načrti za regijske profile (public/regions.js). |
| `server/reports.js` | 412 | Prijave napak: v odgovorih inštruktorja (gumb »Prijavi napako« pod vsakim odgovorom), v lekcijah |
| `server/results.js` | 90 | Rezultati učenca za sistemski prompt (del pod črto, ni predpomnjen): iz njih inštruktor |
| `server/risbe.js` | 4 | Risbe v lekcijah (j, 10. 11. 2026): blok »:::risba <vrsta> … :::« se na strežniku izriše v vrstični SVG. |
| `server/scan.js` | 363 | Skeniranje nalog (zaslon »Skeniraj«, public/scan/): |
| `server/schedule-api.js` | 147 | HTTP za urnik učenca (server/schedule.js): branje, shranjevanje, uvoz s fotografije in iz koledarja, |
| `server/schedule.js` | 545 | Urnik učenca: ure v tednu (dan, čas, predmet, učilnica) in datumi testov, kolokvijev in izpitov. |
| `server/schools.js` | 764 | Šole, učitelji, razredi s šolsko licenco in razredne naloge. |
| `server/settings.js` | 180 | Nastavitve učenca (nadzorna plošča) in njihovo preverjanje. |
| `server/skrite-opombe.js` | 5 | Skrite opombe za inštruktorja v sporočilih (učenec jih ne vidi): pola, preverjen račun, povzetek pogovora, |
| `server/sodba-koraka.js` | 383 | Sodba kode o učenčevem koraku (Geminijev pregled 18. 11. 2026: inštruktor včasih reče »Prav«, ko je učenčev |
| `server/sole.js` | 314 | Stran za šole (/sole) in naročila šolske licence (j, 2026-10-30). |
| `server/startup-files.js` | 53 | Datoteke, ki jih brskalnik potrebuje ob prvem odprtju strani: vse, kar naloži public/index.html |
| `server/stiska-obvestilo.js` | 283 | Obvestilo skrbniku ob oznaki stiske (j 18. 11. 2026): ko inštruktor označi stisko (events.flag »distress«), dobi |
| `server/subjects.js` | 42 | Predmeti aplikacije po predmetniku: OŠ 6. in 7. razred matematika in naravoslovje, |
| `server/tecaji.js` | 104 | Tečaji tujih valut za mejo AI regijskih paketov (j 2026-11-06 12:53): tedensko iz odprtega vira brez ključa, |
| `server/textbook-print.js` | 511 | Učbenik za tiskanje oziroma shranjevanje kot PDF (brezplačno, brez prijave). |
| `server/textbook.js` | 653 | Učbenik: lekcije za teme učnih poti. |
| `server/tisk-predpomnilnik.js` | 167 | Predpomnilnik strani za tisk (/ucbenik/..., /gradiva/povzetek/...): javne poti brez prijave, izris celotnega |
| `server/tri-d.js` | 134 | 3D atlas in modeli (docs/3d.md): stran /3d, knjižnica three pod /vendor/three in seznam datotek modelov. |
| `server/ucbenik-pdf.js` | 453 | Vnaprej izdelani PDF-ji učbenika (j, 10. 11. 2026: »12 s je preveč«). PDF razreda, poglavja in celega predmeta |
| `server/university-data.js` (podatki) | 1386 | Univerzitetni študijski programi 1. stopnje (UN) in enoviti magistrski (EMŠ, le prvi letniki) ter njihovi predmeti. |
| `server/university-extra.js` (podatki) | 52.923 | Dodatne naravoslovne fakultete in strokovni predmeti. |
| `server/university-razsiritve.js` (podatki) | 292 | Razširitve predmetov po uradnih učnih načrtih (vsebina po tednih predavanj). |
| `server/usage.js` | 972 | Poraba AI: beleženje žetonov in stroška, dnevne omejitve, mesečni proračun. |
| `server/ustno-api.js` | 481 | Poti ustnega spraševanja (server/ustno.js). Zvok nikoli ne pride sem: samo besedilo, ki ga učenec pred oddajo |
| `server/ustno.js` | 918 | Ustno spraševanje (»Vprašaj me«, korak 1 predloga; j potrdil 10. 11. 2026 z vsemi priporočili). |
| `server/vabila-kode.js` | 39 | Kode vabila v pilot iz okolja EVKLID_VABILA (server/vabila.js) brez Expressa: uvozita jih stran /api/vabilo in meja |
| `server/vabila.js` | 128 | Kode vabila v pilot (j 2026-11-15, 4. korak načrta pilota): stran /vabilo?koda=… (public/vabilo.html). |
| `server/vaja-iz-lista.js` | 483 | Vaja iz mojega testa ali domače naloge, faza 1 (j potrdil 18. 11. 2026): učenec slika test ali domačo nalogo |
| `server/verify.js` | 174 | Trojno preverjanje, preden se odgovor inštruktorja shrani za ponovno uporabo (j, 2026-10-30: |
| `server/vidnost.js` | 315 | Vidnost v iskalnikih in pri pomočnikih AI (j 2026-11-10): Google AI je evklid.app zamenjal s tujimi projekti |
| `server/vitrina.js` | 131 | Vitrina v razredu (j-jev dokument o kozmetiki, »Avatar, vitrina in socialni sloj«): v razredu, ki ga je |
| `server/vstopna-stran.js` | 85 | Vstopna stran (public/index.html) z vnaprejšnjim nalaganjem modulov (<link rel="modulepreload">). |
| `server/weaknesses.js` | 266 | Šibke točke: ročno vnesene + samodejno zaznane iz vseh mest, kjer učenec rešuje naloge (j 2026-11-04: |
| `server/webapp.js` | 114 | Evklid kot aplikacija na telefonu in računalniku (PWA). |
| `server/zapiski.js` | 567 | Uči se iz svojih zapiskov, korak 1 (predlog 10. 11. 2026, j potrdil vsa priporočila): |
| `server/zasebnost.js` | 418 | Varstvo podatkov učencev (docs/varnost-podatkov.md): šifriranje obstoječih vrstic ob zagonu, |
| `server/zbirke.js` | 216 | Zbirke znanja in učni pass (public/zbirke.js). Odklepanje je samo na strežniku: obvladane teme |

## Odjemalec (public/*.js, samo vrhnja mapa)

| Datoteka | Vrstic | Kaj dela |
|---|---:|---|
| `public/account.js` | 2303 | Starševski račun: prijava, potrditev e-naslova, otroci s soglasjem, naročnina, priporočila. |
| `public/aktivnost.js` | 81 | Koledar aktivnosti (Napredek in Jaz): en kvadratek na dan za zadnjih 53 tednov, barva po XP tistega dne |
| `public/anketa-teden.js` | 125 | Točka B3 (pilot, j 14. 11.): kratka anketa s tremi vprašanji 7 dni po prvi uporabi (server/anketa-teden.js). |
| `public/app.js` | 5409 | Evklid – odjemalec (brez ogrodja). |
| `public/appearance.js` | 149 | Nastavitve → Videz: slog (Čist / Igriv in zgodovinski slogi iz theme.js → ERAS), svetli/temni način, poudarki, barve oken, menijev in pisave, naključne barve. |
| `public/avatar.js` | 326 | Avatar učenca (j: kovanci iz iger za predmete, kot skini; avatar je edino, kar učenec izbere in vidijo drugi). |
| `public/brez-lebdenja.js` | 63 | Zaslon na dotik: brez »lebdečega« videza (:hover) (j, 17. 11. 2026: »ikone ostanejo označene«). |
| `public/chat-settings.js` | 138 | Nastavitve iz klepeta na strani odjemalca (strežnik: server/chat-settings.js). |
| `public/check-progress.js` | 27 | Vrstica napredka med preverjanjem odgovora (j, 2. 11. 2026): pokaže se šele, ko preverjanje traja več |
| `public/corner.js` | 424 | Kotiček zanimanj: novice iz znanosti o temah, ki jih je učenec izbral, pripete novice, |
| `public/credit-card.js` | 102 | Kartica »Dodatna poraba AI« v zavihku Račun (server/accounts/billing.js, /api/billing/credit). |
| `public/datum.js` | 18 | Datumi v besedilu: v slovenščini mesec v rodilniku (»do 23. novembra 2026«, »ponedeljek, 23. novembra«), kot ga |
| `public/deli-kartico.js` | 195 | Deljiva kartica zbirke (j-jev dokument o kozmetiki: »Deljiva kartica (slika) za družbena omrežja brez osebnih |
| `public/deli-most.js` | 58 | Most za deljenje slike v mobilni aplikaciji (WebView, mobile/src/app/web.tsx). WebView ne podpira Web Share |
| `public/demos.js` | 666 | Interaktivne demonstracije za učbenik (brez knjižnic, SVG + drsniki). |
| `public/dialects.js` | 79 | Narečje inštruktorja oziroma različica jezika (nastavitev profila »dialect«). |
| `public/dotik.js` | 17 | Povezave na dotik (j 2026-11-13): ko na telefonu pridržiš kartico ali gumb, ki je povezava (<a href>, |
| `public/dropdown.js` | 364 | Spustni meniji v slogu aplikacije (zaobljen seznam namesto sistemskega). |
| `public/drsniki.js` | 162 | Vrstice, ki se pomikajo vstran (j 2026-11-01: »zdaj se sploh ne vidi, ali je navadna vrstica ali ne«). |
| `public/enote-izbira.js` | 246 | Izbira enote pri številski nalogi (j, 16. 11. 2026: v »Testu predznanja« je gumb ob polju za odgovor že |
| `public/exam-papers.js` | 169 | Pretekle pole NPZ in mature v razdelku »NPZ in matura«: izbira po korakih kot pri ravni izobrazbe |
| `public/feedback.js` | 308 | Povratne informacije testerjev: vprašalnik (ocene po področjih + pripombe) ali kratek pogovor |
| `public/flashcards.js` | 319 | Kartice za ponavljanje: pomembna dejstva iz razlag inštruktorja (in lastne kartice), razdeljena v sklope po temah |
| `public/fokus-okna.js` | 76 | Okno čez zaslon (role="dialog", aria-modal="true"): fokus gre v okno, Tab in Shift+Tab krožita samo po njem |
| `public/formula-card.js` | 180 | Kartica oznake (simbol ali enota) iz kode data-fx: { label, html }. Brez DOM, zato jo uporablja |
| `public/formula-data.js` (podatki) | 1023 | Klikljive formule: vsak znan simbol in enota v formuli (KaTeX) je pikčasto podčrtan. |
| `public/formula-info.js` | 319 | Klikljive formule: kartica ob kliku na simbol ali enoto (slovar in označevanje sta v formula-data.js). |
| `public/fullscreen.js` | 96 | Celozaslonski način v brskalniku (privzeto izklopljen, vklop v Nastavitvah, velja za to napravo). |
| `public/garancija-ui.js` | 248 | Zavihek Račun: garancija »Boljša ocena ali vrnemo denar« in »Podari Evklid« (strežnik: server/placila/garancija.js, |
| `public/goal-data.js` (podatki) | 62 | Cilj učenca (NPZ, matura, tekmovanje, izpit …) in neobvezni datum. Vpraša se enkrat ob novem profilu, |
| `public/goal.js` | 164 | Cilj in datum cilja: vprašamo enkrat (nov profil), nato le vrstica z odštevanjem na Učni poti, |
| `public/gradiva.js` | 261 | Gradiva ob lekciji: povzetek na eni strani, kratek video in delovni list za tisk z rešitvami (strežnik: server/gradiva.js). |
| `public/greek.js` | 71 | Kartica zgodovinskih dejstev (docs/oblikovanje.md → »Pridih stare Grčije«, »Zgodovinski slogi«). |
| `public/i18n.js` | 150 | Jezik vmesnika: t("ključ", { spremenljivke }) in prevod statičnih napisov v strani (data-i18n). |
| `public/icons.js` | 208 | Ikone Lucide (ISC licenca, https://lucide.dev) in lastne (CUSTOM). Ustvarjeno s scripts/build-icons.js. |
| `public/ime-skupine.js` | 47 | Ime skupine prijateljev ali razreda vidijo drugi otroci (lestvica, kviz, vitrina), zato v njem ni kontaktov: |
| `public/install.js` | 254 | Evklid kot aplikacija na napravi. |
| `public/interests.js` | 119 | Kotiček zanimanj: področja, ki jih učenec izbere v vprašalniku, in viri novic zanje. |
| `public/izpis-toka.js` | 77 | Izpis odgovora med pretakanjem (točka D5, master brief j 13. 11.): prej se je ob vsaki besedi znova izrisal ves |
| `public/kalkulator-nastavi.js` | 15 | Stran /kalkulator, pred moduli: tema (?theme=dark/light, sicer nastavitev naprave) in jezik (?lang=xx) |
| `public/kalkulator.js` | 70 | Samostojni kalkulator za /kalkulator (mobilna aplikacija ga pokaže v WebView): isti moduli kot okno |
| `public/kartice-sklopi.js` | 33 | Sklopi kartic za ponavljanje (brez DOM, za public/flashcards.js in teste). |
| `public/kviz.js` | 303 | Kviz v živo za razred: učitelj ga vodi na projektorju (ucitelj.html), učenci odgovarjajo v Ligah. |
| `public/laboratorij.js` | 171 | Laboratorij (zavihek v »Uči se«, public/uci-se.js): vsi virtualni poskusi na enem mestu, po predmetih, |
| `public/language.js` | 37 | Izbira jezika (Nastavitve in prvi zagon). Seznam ima iskalnik (dropdown.js pri dolgih seznamih). |
| `public/leagues.js` | 393 | Pogled »Lige«: tedenska liga, vzdevek, razredi in skupine prijateljev. |
| `public/lepi-zapis.js` | 100 | Lep zapis med pisanjem v klepetu (j, 2026-11-04: »naj se potence in ulomki izpisujejo tudi v chatboxu, ne kot |
| `public/lesson-steps.js` | 137 | Lekcija po korakih: razdeli razdelke lekcije na kratke kartice in med njih vstavi |
| `public/level-picker.js` | 236 | Izbira šole po korakih: OŠ → razred, SŠ → letnik → raven matematike, |
| `public/level-up.js` | 139 | Prehod v višji razred, letnik ali na fakulteto (kartica na vrhu Učne poti). |
| `public/magnet.js` | 45 | Magnetni X za mehurček inštruktorja (okna.js): blizu X-a mehurček skoči nanj, hiter poteg (flik) proti |
| `public/meja-placilo.js` | 150 | Kartica ob porabljenih brezplačnih vprašanjih za inštruktorja (j 2026-11-15, korak 5 načrta pilota): |
| `public/mnenje.js` | 251 | Mnenje člana pilota (server/pilot-mnenja.js): ocena 1–5 zvezdic, »Kaj ti je najbolj všeč?«, »Kaj te najbolj moti?« |
| `public/noga.js` | 139 | Spodnja vrstica (»noga«, #tabbar) se povsod po 3 s neuporabe skrije, ob drsenju pa se pojavi nazaj |
| `public/nujno.js` | 933 | Zaznavalnik nujnih primerov brez AI (strošek 0), za strežnik in vmesnik (j, 6. 11. 2026: »varnost ima |
| `public/odgovor.js` | 17 | Telo odgovora vedno preberemo ali zavržemo. Neprebrano telo odgovora s »Cache-Control: no-store« (vse /api in |
| `public/odpri.js` | 322 | Gumbi pod odgovorom inštruktorja za orodja aplikacije (server/odpri.js, docs/odpri.md): poskus z nastavljenimi |
| `public/odstop-ui.js` | 118 | Zavihek Račun: povezava »Odstop od pogodbe« (ZVPot-1A, funkcija za odstop je na /odstop.html), pasica ob novi |
| `public/odstop.js` | 123 | Stran »Odstop od pogodbe« (/odstop.html): funkcija za odstop po ZVPot-1A (138.a člen). Naslov strani je zakonska oznaka |
| `public/offline.js` | 280 | Vaje brez povezave (lahki način). |
| `public/okna.js` | 756 | Premična okna in mehurček inštruktorja (docs/oblikovanje.md, »Premična okna«). |
| `public/our-paper-key.js` | 5 | Oznake delov naše pole (public/our-paper.js, server/paper-context.js). Pola z dvema izpitnima polama ali deli |
| `public/our-paper.js` | 180 | Naša pola v slogu pretekle pole NPZ ali mature (server/our-papers.js, content/exam-papers): naloge napiše Evklid |
| `public/pace.js` | 149 | Tempo izpisa odgovorov: besedilo se pokaže beseda za besedo z berljivo hitrostjo |
| `public/pad.js` | 461 | Vnos odgovora pri nalogi: tipke so Evklidova tipkovnica (public/tipkovnica.js, 123 + enote, Enter = Preveri), |
| `public/paper-tasks.js` | 127 | Razdelitev prenesene pole na naloge iz besedilne plasti PDF (pdf.js getTextContent), brez DOM-a (test/paper-tasks.test.js). |
| `public/paper-viewer.js` | 359 | Prenesena pola v Evklidu: učenec polo prenese z ric.si (Izpitna pola) in jo izbere tukaj. PDF ostane v napravi: |
| `public/pass-offer.js` | 123 | Kartica »Pripravi se na test« v Urniku: paket pred testom (enkratno plačilo, 7 ali 14 dni polnega dostopa). |
| `public/pay-ui.js` | 147 | Skupni deli plačilnih zaslonov: tri potrditve pred plačilom (polnoletnost, odstop, pogoji) in povezava »Prosi starše za plačilo«. |
| `public/pilot-naloge.js` | 747 | Naloge za člane pilota (server/pilot-naloge.js): v zavihku Jaz »Pomagaj izboljšati Evklid«. |
| `public/placaj.js` | 125 | Stran za starše »Plačilo za Evklid« (placaj.html?t=…): najstnik ali otrok pošlje povezavo, |
| `public/poraba-skrbnik.js` | 22 | Kartica Poraba v Nastavitvah (samo skrbnik). Naloži se šele, ko jo strežnik dovoli (loadUsage v public/app.js); |
| `public/posnetek.js` | 70 | Posnetek zadnjega zaslona (hiter zagon, j 2026-11-10): public/zacetek.js ga ob naslednjem odprtju pokaže takoj, |
| `public/potrditev-po-nalogi.js` | 61 | Opomnik za potrditev e-naslova po rešeni nalogi (#747, j 2026-11-17): nov učenec najprej reši prvo nalogo, šele |
| `public/povabi.js` | 109 | »Pokaži Evklida prijatelju«: majhna kartica s povezavo za povabilo takoj po uspehu (osvojena tema, opravljen |
| `public/predlogi.js` | 132 | Predlogi vprašanj v praznem klepetu (j, 17. 11. 2026): po profilu in vsakič drugačni. |
| `public/predogled-vnosa.js` | 356 | Formule v poljih za vnos (j, 12. 11. 2026: »Naj se ulomki, koreni itd. izpisujejo tudi v takih poljih«; 14. 11.: |
| `public/predracun.js` | 3 | Gumb »Natisni ali shrani kot PDF« na predračunu (server/sole.js, predracunHtml). CSP ne dovoli vrinjenih |
| `public/preveri-se-ziv.js` | 178 | »Preveri se« v spletnem učbeniku: vpiši število in razvrsti (vrste z poljem type, public/preveri-se.js). |
| `public/preveri-se.js` | 158 | »Preveri se« v lekciji: preverjanje odgovorov na vprašanja z vpisom števila in razvrščanjem. |
| `public/prijave.js` | 320 | Prijave napak (server/reports.js): »Prijavi napako« v lekciji, skrbnikova prijava iz klepeta in seznam |
| `public/pristajalna.js` | 86 | Pristajalna stran za nove obiskovalce pred prijavo (j 2026-11-04, kartica »Pristajalna stran«). |
| `public/profile-menu.js` | 157 | Meni profila zgoraj desno (klik na ime): kdo uči, menjava profila, nov profil, zbirke, mnenje, nastavitve, |
| `public/programs.js` | 49 | Univerzitetni študijski programi (1. stopnja in enoviti magistrski): seznam s strežnika in izbirnik. |
| `public/quick-start.js` | 162 | Klik na klobuk (logotip zgoraj levo): »Nadaljuj z učenjem« (j, 2026-10-30). |
| `public/razdelilnik.js` | 285 | Ločnice med deli strani (docs/oblikovanje.md, »Spreminjanje velikosti delov«). |
| `public/razpri.js` | 112 | Besedilo, ki na zaslonu nima prostora, se samodejno pokaže v celoti v pojavnem oknu (mirna animacija). |
| `public/regions.js` (podatki) | 474 | Šolski sistemi po državah (regijski profili). Uporabljata jih strežnik in vmesnik. |
| `public/restart-retry.js` | 18 | Med objavo nove različice je strežnik ~1 minuto ustavljen (Render s trajnim diskom) in gostitelj vrne |
| `public/rich.js` | 527 | Izris besedila z Markdownom in formulami (inštruktor, razlage, naloge, lekcije, kartice). |
| `public/risbe-izris.js` | 726 | Risbe v lekcijah (j, 10. 11. 2026): blok »:::risba <vrsta> … :::« se na strežniku izriše v vrstični SVG. |
| `public/risbe-zive.js` | 71 | Grafi z drsniki v lekcijah (j, 11. 11. 2026): blok »:::risba graf« s ključem »drsnik:« strežnik izriše pri |
| `public/schedule.js` | 613 | Urnik učenca (Jaz → Urnik): ure v tednu in testi. Strežnik: server/schedule.js, server/schedule-api.js. |
| `public/settings-registry.js` | 95 | Vse nastavitve, ki jih inštruktor sme spremeniti iz klepeta (orodji v server/chat-settings.js). |
| `public/sirina.js` | 768 | Široke formule in tabele v lekciji (j 2026-10-31: na telefonu so se skrivali stolpci in konci formul). |
| `public/slike-nalog.js` | 83 | Slike pri nalogah (iz public/app.js, da app.js ostane v proračunu 80 KB stisnjeno na datoteko). |
| `public/sole.js` | 83 | Stran za šole (/sole): obrazec za naročilo ali povpraševanje. |
| `public/speech.js` | 210 | Glasovni vnos vprašanj (prepoznavanje govora v brskalniku, slovenščina). |
| `public/starsi.js` | 67 | Stran za starše (starsi.html); ločena datoteka zaradi politike CSP (brez vrinjenih skript). |
| `public/stopnja.js` | 54 | Stopnja profila: OŠ, SŠ ali faks (j 2026-11-01, načrt »Delitev na OŠ, SŠ in faks«). |
| `public/subject-switch.js` | 92 | Menjava predmeta v menijih zgoraj (klobuk »Nadaljuj z učenjem« in meni profila), da učenec |
| `public/sw.js` | 376 | Service worker: aplikacija se odpre tudi brez povezave in ponovno ne prenaša knjižnic. |
| `public/symbols.js` | 129 | Simboli za plast Σ Evklidove tipkovnice (public/tipkovnica.js): koreni, potence, integrali, |
| `public/testna-verzija.js` | 64 | Obvestilo »Testna verzija« pod glavo: kaj v aplikaciji še ne dela. Seznam pošlje strežnik (/api/config → test_notice), |
| `public/textbook.js` | 1023 | Učbenik: kazalo, iskanje in lekcije z interaktivnimi demonstracijami. |
| `public/theme.js` | 692 | Svetli/temni način in lastne barve. Navaden skript v <head>, da se barve nastavijo pred prvim izrisom. |
| `public/tipkovnica-besede.js` (podatki) | 46 | Predlogi besed nad črkami (Nastavitve → Vnos → Predlogi besed, privzeto izklopljeno). |
| `public/tipkovnica-data.js` (podatki) | 432 | Evklidova tipkovnica: podatki in čista pravila brez DOM (razporeditve po jeziku, različice črk, |
| `public/tipkovnica-glide-sl.js` (podatki) | 1064 | Ustvari: node scripts/glide-besede.js (iz content/**/*.md; ne urejaj ročno). Slovenske besede za drsenje po črkah, |
| `public/tipkovnica-strani.js` | 5 | Evklidova tipkovnica tudi na straneh zunaj aplikacije (plačilo, šole, starši, učitelji): j, 1. 11. |
| `public/tipkovnica.js` | 1587 | Evklidova tipkovnica: ena tipkovnica na zaslonu za vso aplikacijo (docs/oblikovanje.md »Evklidova tipkovnica»). |
| `public/tisk-v-chromu.js` | 14 | Strani za tisk, ki jih aplikacija odpre v privzetem brskalniku telefona (navadno Chrome; mobile/src/app/web.tsx), |
| `public/ucbenik-priprava.js` | 95 | Učbenik za tiskanje (server/textbook-print.js): pregrada »Pripravljam učbenik …« z napredkom, med tem ko se stran |
| `public/ucbenik-ravni.js` | 17 | Učbenik, filtri predmet / raven (j 2026-11-14): vrstica predmetov pokaže le predmete, ki imajo učbenik na ravni |
| `public/ucbenik-tisk.js` | 35 | Učbenik za tiskanje (server/textbook-print.js): gumb »Shrani kot PDF« in samodejni tisk (#natisni). |
| `public/uci-se.js` | 315 | Uči se (j, 4. 11. 2026): en gumb v zgornji in spodnji vrstici, v njem trije zavihki Učbenik / Laboratorij / 3D svet. |
| `public/ucitelj.js` | 453 | Stran za učitelje (ucitelj.html): šola, razredi, razredne naloge, pregled razreda, licenca. |
| `public/usage-meter.js` | 218 | Števec porabe AI v zgornji vrstici: vidi ga samo skrbnik (strežnik vrne porabo le na |
| `public/uvodni-ogled.js` | 112 | Uvodni ogled (iz public/app.js; naloži se šele, ko se ogled začne). app.js odloči, kdaj (maybeTour, »Ponovi uvodni ogled«). |
| `public/v-aplikaciji.js` | 19 | Javne strani brez theme.js (Za starše, Za šole, Zasebnost; videz po napravi): v aplikaciji za Android/iOS enako kot |
| `public/vabilo.js` | 98 | Stran /vabilo (j 2026-11-15, 4. korak načrta pilota): koda iz povezave (?koda=…) ali vpisana, preverjanje |
| `public/vir.js` | 36 | Od kod je učenec prišel (server/rast.js): oznaka iz povezave se shrani ob prvem obisku in gre zraven, |
| `public/vnos-formul.js` | 276 | Formule, ki jih učenec napiše v klepetu s tipkami Evklidove tipkovnice (j, 4. 11.: »ulomke, integrale, |
| `public/vodic.js` | 24 | Vodič po aplikaciji: kratek opis vsakega dela (Nastavitve → Pomoč na spletu, Jaz → Vodič v aplikaciji). |
| `public/vodoravna-tabela.js` | 81 | Vodoravna tabela: oznaka v prvem stolpcu, ena vrstica vrednosti in vsaj 6 stolpcev (relativne atomske mase, |
| `public/vrstice.js` | 263 | Vrstice zavihkov in načinov, ki jih učenec preuredi s potegom (docs/oblikovanje.md, »Premična okna«). |
| `public/xp-fx.js` | 264 | Občutek dosežka ob XP: števec v zgornji vrstici steče do novega zneska, zvezdice odletijo k njemu, |
| `public/xp-levels.js` | 40 | Ravni, dnevni cilj in mejniki XP. Skupno strežniku (server/progress.js, settings.js) in odjemalcu (public/xp-fx.js). |
| `public/zacetek.js` | 337 | Zagon na zadnjem zaslonu in hiter zagon s posnetkom (j 2026-11-10). Navaden skript v <head>, pred prvim izrisom. |
| `public/zacetna.js` | 97 | Začetna stran (Učna pot) po stopnji (j 2026-11-01, načrt »Delitev na OŠ, SŠ in faks«): isti videz in iste |
| `public/zagon.js` | 29 | Zagon strani: najprej prevodi, nato moduli strani (v vrstnem redu iz data-moduli). |
| `public/zbirke-view.js` | 369 | Pogled »Zbirke in nagradna pot« (public/zbirke.js): vitrina, nagradna pot (pass) s 30 stopnjami, tri zbirke |
| `public/zbirke.js` | 591 | Zbirke znanja in učni pass (j, 29. 10. 2026: dokument »Kozmetika in personalizacija v igrah Evklid«). |

## Skripte

| Datoteka | Vrstic | Kaj dela |
|---|---:|---|
| `scripts/3d-slicice.cjs` | 84 | Sličice modelov za kartice zbirke /3d (public/3d/slicice/<id>.webp, docs/3d.md »Sličice«): vsak model iz kode se |
| `scripts/bliznjice.js` | 35 | Windows: bližnjice s prejšnjimi imeni aplikacije (brand.json → legacy) na namizju in v samodejnem |
| `scripts/build-icons.js` | 113 | Iz paketa lucide-static zgradi public/icons.js z ikonami, ki jih uporablja vmesnik. |
| `scripts/build-pse-extra.js` | 86 | Iz podatkov PubChem (NCBI, javna domena) zgradi public/graph/pse-extra.js: |
| `scripts/check-gradivo.js` | 30 | Preveri obliko napisanih gradiv (docs/gradiva.md): domači poskusi, projekti, videi, miselni vzorci. |
| `scripts/check-lesson.js` | 56 | Preveri obliko lekcij učbenika (content/lessons/README.md). |
| `scripts/check-paper.js` | 30 | Preveri našo polo (server/our-papers.js): oblika, točke po delih kot izvirna pola, LaTeX, številski koraki. |
| `scripts/dnevnik-dostopov.js` | 30 | Dnevnik dostopov (server/dnevnik-dostopov.js): prijave, izvozi, izbrisi, gesla, dejanja skrbnika in učiteljev. |
| `scripts/fakultetne-lekcije.js` | 45 | Seznam fakultetnih tem brez lekcije, urejen po tem, v koliko programih se tema pojavi. |
| `scripts/formule-simboli.js` | 19 | Preveri liste s formulami (content/formulas/*.md): vsak razdelek ima blok :::simboli z vrstico |
| `scripts/generate-explanations.js` | 111 | Ustvari razlage vseh tem učnih poti z Message Batches API (50 % ceneje) |
| `scripts/generate-lessons.js` | 151 | Ustvari lekcije učbenika z Message Batches API (50 % ceneje) in jih shrani |
| `scripts/glide-besede.js` | 82 | Seznam slovenskih besed za drsenje po črkah (glide) iz lastnih vsebin aplikacije, brez zunanjih virov. |
| `scripts/gumbi-na-dotik-aplikacija.cjs` | 159 | Gumbi na dotik v Safariju po vsej aplikaciji (razlaga v scripts/gumbi-na-dotik.cjs): zažene strežnik, naredi |
| `scripts/gumbi-na-dotik.cjs` | 182 | Gumbi na dotik v Safariju (iPad, iPhone; j 2026-11-15: »vsi gumbi na tej strani ne delajo«). |
| `scripts/igre-pojmi.js` | 62 | 1) Seznam pojmov drugih predmetov brez generatorjev nalog (public/games/subjects/meta.js): igre ga imajo takoj, |
| `scripts/ikone-obdobij.js` | 528 | Ikone zgodovinskih slogov: za vsak slog (public/theme.js → ERAS) sestavi public/eras/<id>/ikone.json |
| `scripts/ikone-okvir.mjs` | 60 | Izmeri surove risbe ikon obdobij (črnilo z debelino črte, težišče) in na novo zapiše tabelo OKVIR v scripts/ikone-obdobij.js: |
| `scripts/imena-skupin.js` | 39 | Enkraten pregled imen razredov in skupin prijateljev, ki so že v bazi (pred PR #491): imena s kontakti |
| `scripts/kakovost-nalog.js` | 86 | Pregled kakovosti generatorjev nalog po merilih iz docs/kakovost.md. |
| `scripts/kljuc-podatkov.js` | 47 | Ključ za šifriranje osebnih podatkov v bazi (docs/varnost-podatkov.md). |
| `scripts/lesson-brief.js` | 204 | Izpiše kratka, popolna navodila (brief) za pisca ali pregledovalca lekcij, pripravljena za |
| `scripts/lesson-topic.js` | 43 | Izpiše podatke o temah (za pisanje lekcije): node scripts/lesson-topic.js MAT-OS-6/kot FIZ-OS-8/vzgon |
| `scripts/logotip.cjs` | 104 | Logotip Evklida: kristal kuhinjske soli (j, 2026-11-04, predlog K6a2 + K6c2 v niti »Zasnuj logo za Evklid«). |
| `scripts/meri-hitri-korak.mjs` | 170 | Meritev poskusa »hitri korak« (server/hitri-korak.js, EVKLID_HITRI_KORAK): isti prvi korak pri lahki nalogi |
| `scripts/meri-hitrost.cjs` | 384 | Meritev hitrosti odpiranja zaslonov (naloga »Takojšnje odpiranje«, j 6. 11. 2026). |
| `scripts/meri-izpis-toka.mjs` | 36 | Meritev D5: koliko časa procesorja porabi izris odgovora med pretakanjem (po besedah, kot pacer), z isto kodo |
| `scripts/meri-kalkulator.cjs` | 240 | Meritev kalkulatorja (naloga hitrost +9, pregled PR #481): odprtje kalkulatorja in prvi/topli preklop razdelkov |
| `scripts/meri-model.mjs` | 80 | Čas pravega modela (D6, del »česa nisem preveril«): koliko časa učenec čaka na prvo besedilo in na konec odgovora |
| `scripts/meri-nacin-b.mjs` | 163 | Meritev krajšega načina B (j 2026-11-17, »krajši prvi odgovor«): iste naloge pošlje inštruktorju v načinu B |
| `scripts/meri-napacne-korake.mjs` | 137 | Meritev s pravim modelom: ali inštruktor potrdi napačen korak (Gemini 18. 11. 2026: »Prav« ob napačnem koraku). |
| `scripts/meri-natancnost-ss.mjs` | 145 | Meritev pravilnosti CELEGA Evklidovega odgovora na srednješolski snovi (j, 18. 11. 2026: pred vabili v pilot |
| `scripts/meri-nujno-ziv.mjs` | 203 | Živi preizkus varnostnega filtra z mejo stroška, za delovni tok »Meritev« (GitHub Actions, docs/stroski-ai.md). |
| `scripts/meri-poraba-danes.mjs` | 20 | D2: čas dnevne meje močnejšega modela (deepToday) pri 1 000 000 vrsticah porabe (90 dni, ~11 000 danes). |
| `scripts/meri-prav-matura.mjs` | 188 | Meritev s pravim inštruktorjem: ali še reče »Prav« (potrdi, pohvali ali tiho gradi naprej) ob napačnem koraku maturanta |
| `scripts/meri-preizkus3-ocena.mjs` | 39 | Zaznavanje v meritvi Preizkusa 3 (scripts/meri-preizkus3.mjs), ločeno, da ga preizkusi test brez klica modela. |
| `scripts/meri-preizkus3.mjs` | 237 | Meritev popravkov po Preizkusu 3 (j 2026-11-17, gumb): (1) vsi deli naloge a), b), c) v enem odgovoru v načinu B in pri |
| `scripts/meri-zgodovina-pogovora.mjs` | 41 | D3: čas strežnika za sporočilo inštruktorju v dolgem pogovoru (60 sporočil, od tega 4 fotografije po 1 MB). |
| `scripts/meritev-natancnosti.js` | 381 | Meritev natančnosti CELEGA Evklidovega odgovora (j 2026-11-10: »meri tudi s programom«). |
| `scripts/meritev-po-objavi.mjs` | 21 | Ciljna meritev natančnosti po spremembi lekcij ali prompta v main; teče v GitHubu (.github/workflows/meritev-po-objavi.yml), |
| `scripts/meritev-produkcija.mjs` | 99 | Faza 0 – seštevki iz produkcijske baze za izhodiščne meritve (docs/meritve/zmogljivost-2026-11-13.md, »Za j na Renderju«). |
| `scripts/meritev-zmogljivosti.mjs` | 1730 | Faza 0 – izhodiščne meritve zmogljivosti (docs/meritve/zmogljivost-2026-11-13.md). |
| `scripts/nadzor.js` | 146 | Skupno za scripts/zagon.js (računalnik) in scripts/telefon.js (telefon prek povezave): |
| `scripts/najdi-hrosce.mjs` | 133 | Iskalnik hroščev brez AI (CI posel »hrosci« v .github/workflows/testi.yml, j 2026-11-15). |
| `scripts/najdi-sporocilo.js` | 78 | Ob neljubem dogodku (docs/krizni-nacrt.md): poišče sporočilo inštruktorja po kodi s posnetka zaslona |
| `scripts/namesti-sympy.cjs` | 40 | Namesti SymPy za preverjanje s kodo (server/cas.js) v mapo .pylib. Teče sam ob `npm install` / `npm ci` |
| `scripts/napacni-koraki.js` | 53 | Primerjava prej/potem za sodbo o učenčevem koraku (Gemini 18. 11. 2026: inštruktor reče »Prav« ob napačnem koraku). |
| `scripts/napredek-programov.js` | 41 | Stanje lekcij po univerzitetnih programih: za vsak program in letnik število tem |
| `scripts/napredek.js` | 177 | Kratko poročilo o napredku lekcij in vaj (nalog) za j – samo štetje v repozitoriju, brez agentov. |
| `scripts/nastevanje.js` | 74 | Najde (in s --popravi popravi) naštevanja števil z decimalno vejico, ločena z vejico: |
| `scripts/nujno-ziv-preizkus.js` | 230 | Živi preizkus varnostnega filtra (Haiku) iz PR #479 (j, 10. 11. 2026: »na strežniku po objavi«). |
| `scripts/obnovi-kopijo.js` | 151 | Varnostne kopije baze (server/kopije.js). Poženi v Render → evklid → Shell ali v mapi aplikacije. |
| `scripts/obvestilo-zasebnost.js` | 78 | Enkratna e-pošta o spremembi politike zasebnosti (PRIVACY_VERSION) potrjenim naslovom obstoječih računov. |
| `scripts/ocena-stroska.js` | 141 | Ocena stroška AI na učenca na mesec (v €), prej in zdaj. |
| `scripts/og-slika.cjs` | 41 | Slika za predogled povezave (og:image, twitter:image) 1200 × 630 (j 2026-11-16). |
| `scripts/pilot-naloge.js` | 21 | Pilot: povzetek nalog članov za jutranji pregled (brez imen in e-naslovov, brez API in stroškov). |
| `scripts/pole-ric.js` | 202 | Katalog preteklih pol NPZ in mature: zbere POVEZAVE na uradne pole na ric.si in zapiše server/exam-papers-si.js. |
| `scripts/popravi-datum-rojstva.js` | 46 | Popravek datuma rojstva imetnika računa (samo skrbnik, ne samopostrežno): |
| `scripts/posodobitev.js` | 350 | Samodejna posodobitev Evklida z GitHuba (veja main), brez git in brez dodatnih orodij. |
| `scripts/potrdi-racun.js` | 40 | Potrdi e-naslov računa brez e-pošte: node scripts/potrdi-racun.js ime@primer.si |
| `scripts/povzetek-povratnih.js` | 26 | Povzetek povratnih informacij testerjev (brez API, brez stroškov). |
| `scripts/pregled-popravkov.js` | 100 | Pregled žive kontrole odgovorov (server/live-check.js; j 2026-11-04 »nadaljuj kontrolo«): koliko popravkov, |
| `scripts/preimenuj.js` | 130 | Preimenuje aplikacijo: node scripts/preimenuj.js <Ime> [--slug ime] [--env IME] [--znak Ime,] [--domena ime.app] [--suho] |
| `scripts/preveri-3d-okna.cjs` | 232 | Okno dela in kader v 3D pregledovalnikih (docs/3d.md »Okno dela in kader«, j 5. 11.). Pade, ko: |
| `scripts/preveri-aplikacijo.cjs` | 1994 | Dimni test celotne aplikacije v pravem brskalniku: ali vsak del deluje od začetka do konca. |
| `scripts/preveri-formule.cjs` | 178 | Formule, ki se pomikajo vstran (j 2026-11-04: »Predolge zapise ustrezno prelomi v drugo vrstico. Če je mogoče, |
| `scripts/preveri-generatorje.js` | 88 | Preveri vse generatorje nalog: vsaka naloga mora prestati preverjanje s svojim |
| `scripts/preveri-reference.js` | 51 | Preveri, ali vse povezave referenčnega materiala delujejo (HTTP 200 po preusmeritvah). |
| `scripts/preveri-simulacije.cjs` | 121 | Pregled vseh simulacij iz kataloga na telefonski širini (360 px) po merilih docs/kakovost.md §3: |
| `scripts/preveri-videz-lekcij.cjs` | 286 | Vizualni pregled lekcij v aplikaciji (j 2026-10-31: »koreni nad ulomki, neporavnane tabele, necentriran tekst«). |
| `scripts/primerjava-modelov.js` | 435 | Primerjava natančnosti modelov za inštruktorja (j 2026-10-30: »ali bo Haiku dovolj natančen za učenje«). |
| `scripts/pristajalna-noscript.js` | 62 | Pristajalna stran brez JavaScripta (pregled »kupca« 16. 11. 2026): kdor prebere surovi HTML strani https://evklid.app/ |
| `scripts/render-objava.js` | 106 | Kdaj objaviti novo različico na Renderju (j, 2026-10-30: »optimiziraj samodejne posodobitve«). |
| `scripts/simboli.js` | 64 | Oznake lekcij (blok :::simboli, content/lessons/README.md) za klikljive formule. |
| `scripts/straza.mjs` | 113 | Straža: preveri, ali živo spletišče deluje. Samo branje (GET), brez prijave, brez računov, brez klicev AI. |
| `scripts/tapeta.js` | 87 | Tapeta zgodovinskega sloga: iz 6–8 motivov (public/theme.js → ERAS[id].motifs, public/eras/<id>/*.svg, viewBox 64 × 64) |
| `scripts/telefon.js` | 395 | Odpre Evklid na telefonu: zažene strežnik (z računi prijava v račun, sicer skupno geslo) in odpre povezavo z interneta. |
| `scripts/ucbenik-pdf.cjs` | 693 | Izdela PDF-je učbenika vnaprej (server/ucbenik-pdf.js; j, 10. 11. 2026): za vsak predmet, razred in poglavje |
| `scripts/ustno-pregled.js` | 73 | Ročni pregled vprašanj iz :::premisli za ustno spraševanje (vzorec 2, pravilo 6). |
| `scripts/vaja-obnove.mjs` | 420 | Vaja obnove baze na sveži namestitvi (j 2026-11-15, priprava na zaprt pilot; zapis v docs/obnova.md). |
| `scripts/zaganjalnik.js` | 35 | Zažene scripts/zagon.js ali scripts/telefon.js in ga zažene znova, ko se ta posodobi |
| `scripts/zagon.js` | 43 | Evklid na tem računalniku: zažene strežnik, ga drži prižganega in ga |
| `scripts/zemljevid-kode.mjs` | 105 | Zemljevid kode za človeka (zunanji pregled 18. 11. 2026, točki 41 in 42 načrta izboljšav): za vsako datoteko v |
