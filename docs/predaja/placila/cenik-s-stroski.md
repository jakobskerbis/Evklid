# Predlog cenika Evklid z vsemi stroški (osnutek, 1. 11. 2026)

**Pozor:** 1. 11. zjutraj si že potrdil cenik po stopnjah (OŠ 9,99/89 €, SŠ 12,99/119 €, faks 16,99/149 €, Družina 17,99/159 €; meja AI OŠ 2 $ / SŠ 3 $ / faks 5 $; darilna koda = letna cena stopnje; trgovine +2 €). Tisti cenik velja, ta dokument dodaja samo pregled stroškov. Hitra različica (tedenska poraba 97 %). Številke za AI so **ocene**. Ko bo pilot tekel, jih zamenjamo s pravimi iz kartice »Merjenje v pilotu« (Račun → skrbnik).

## 1. Stroški na učenca na mesec

**AI** (Claude; s predpomnjenjem pozivov):

- Ena izmenjava stane okoli 0,005 € s Haiku, 0,02 € s Sonnet in 0,03 € z Opus. Skeniranje naloge stane okoli 0,01–0,02 €.
- Povprečen učenec postavi okoli 120 vprašanj na mesec (15 dni po 8). Pri mešanici 70 % Haiku, 25 % Sonnet in 5 % Opus to stane **okoli 1,1 € na mesec**.
- Zelo zagnan učenec (60 vprašanj na dan, 25 dni) bi brez omejitve stal **do 14 € na mesec**. Zato predlagam mehko mejo 4 € AI na otroka na mesec. Nad njo ostane samo Haiku.
- Šolska licenca (15 vprašanj na dan, Haiku + Sonnet) stane okoli 0,3–0,8 € na učenca na mesec. Meja na šolo naj bo 0,5 € na učenca na mesec.
- Brezplačni paket: 10 vprašanj na dan, največ 0,2 $ na učenca in 10 $ za vse skupaj na mesec. Največ okoli 9 € na mesec skupaj.
- Glas in pregledi vsebin stanejo malo (pregledi so enkratni strošek pri pisanju lekcij, ne na učenca).

**Stalni stroški** (na mesec, za celo aplikacijo):

| Strošek | Na mesec |
|---|---|
| Render (strežnik + disk 1 GB) | ~7 € (pri večji rasti ~25 €) |
| Domena evklid.app | ~1,2 € |
| E-pošta Resend | 0 € do 3.000 sporočil, nato ~19 € |
| Apple razvijalec (99 $/leto) | ~7,5 € |
| Google Play (25 $ enkrat) | ~0 € |
| Cloudflare, GitHub, Expo | 0 € (brezplačni paketi) |
| Naročnina Claude: zdaj Ultra 200 $, od 29. 11. Max 5x ~100 $ | ~174 € zdaj, ~87 € od 29. 11. |
| **Skupaj** | **~105–145 € na mesec (od 29. 11.)** |

**Pomembno:** naročnina Claude vključuje dobroimetje za API: 200 $ zdaj, od 29. 11. 100 $ na mesec. To dobroimetje plača AI za vse učence, aplikacija pa porabo že sama razporedi tako, da ga ne preseže. Do porabe okoli 100 $ na mesec (približno 80–90 aktivnih plačnikov s povprečno porabo) je AI torej že plačan z naročnino. Strošek AI na učenca v tabeli spodaj šteje šele, ko je učencev več.

Pri 100 plačnikih je to okoli 1,1–1,5 € na plačnika (z naročnino Claude).

**Provizije pri plačilu:**

| Način plačila | Provizija |
|---|---|
| Stripe (kartice EU) | 1,5 % + 0,25 € |
| Stripe za naročnine | dodatno 0,7 % |
| Trgovina z aplikacijami (Apple/Google, program za male razvijalce) | 15 % |
| Šola (nakazilo na TRR) | 0 €; ponudnik e-računov ~1–3 € na račun |

**Davki in prispevki** (ko odpreš s.p.; preveri z računovodjo):

- **DDV:** dokler promet ne preseže praga za DDV (v Sloveniji okoli 50.000 € na leto), DDV-ja ne obračunavaš. Ko ga, gre od vsake cene z DDV 18 % (22/122). Prodaja potrošnikom v drugih državah EU nad 10.000 € na leto zahteva OSS.
- **Normirani s.p.:** dohodnina je približno 4 % prihodka.
- **Prispevki:** to je največji stalni strošek. Za s.p. kot glavno dejavnost znašajo okoli 400–500 € na mesec, za popoldanski s.p. bistveno manj.

**Oglaševanje:** predlagam, da za novega plačnika porabiš največ toliko, kot plača v enem mesecu (≈10 €).

## 2. Kaj ti ostane pri sedanjih cenah (brez DDV, plačilo prek Stripa)

| Paket | Cena | Stripe | AI (povprečno) | Stalni stroški | **Ostane** | Ostane pri zagnanem učencu (meja 4 €) |
|---|---|---|---|---|---|---|
| 1 otrok, mesečno | 9,99 € | 0,47 € | 1,1 € | 0,3 € | **8,1 €** | 5,7 € |
| 1 otrok, šolsko leto | 89 € | 2,2 € | 11 € (10 mes.) | 3 € | **73 €** (7,3 €/mes.) | 47 € |
| 2 otroka, mesečno | 15,99 € | 0,6 € | 2,2 € | 0,3 € | **12,9 €** | 7,1 € |
| 2 otroka, šolsko leto | 139 € | 3,3 € | 22 € | 3 € | **111 €** | 56 € |
| Osebno ob šolski licenci, mesečno | 5,99 € | 0,38 € | 0,6 € (dodatno) | 0,3 € | **4,7 €** | 2,4 € |
| Osebno ob šolski licenci, leto | 49 € | 1,3 € | 6 € | 3 € | **39 €** | 24 € |
| Darilna koda (1 leto) | 49 € | 1,0 € | 13 € (12 mes.) | 3,6 € | **31 €** | 0 € (brez meje) |
| Paket pred testom, 7 dni | 5,19 € | 0,33 € | do 0,65 € | – | **≥ 4,2 €** | |
| Paket pred testom, 14 dni | 7,79 € | 0,37 € | do 1,3 € | – | **≥ 6,1 €** | |
| Paket pred testom, 30 dni | 11,69 € | 0,43 € | do 2,6 € | – | **≥ 8,7 €** | |
| Šola, razredi (na učenca na leto) | 20 € | 0 € | 3–8 € | – | **12–17 €** | |
| Šola, cela šola | 14 € | 0 € | 3–8 € | – | **6–11 €** | |
| Šola, pilot (2 leti) | 12 € | 0 € | 3–8 € | – | **4–9 €** | |

Pri nakupu v aplikaciji za iOS ali Android gre 15 % namesto Stripa. Pri 9,99 € je to 1,50 € namesto 0,47 €.

Ko boš zavezanec za DDV, ostane okoli 18 % manj. Pri 9,99 € je to okoli 6,3 €.

## 3. Predlog, da ti ostane čim več

1. **Cene za starše obdrži** (9,99/89 €, 15,99/139 €). So pod konkurenco: Astra Plus stane okoli 20 € na mesec. Marža je dobra.
2. **Dodaj mehko mejo AI 4 € na otroka na mesec** pri vseh plačljivih paketih. Nad mejo ostane samo Haiku, učenec pa tega skoraj ne opazi. Brez meje lahko en sam zelo zagnan učenec poje večino zaslužka.
3. **Darilna koda:** dodaj isto mejo, ali pa ceno dvigni na 59 €, ker velja 12 mesecev, ne 10.
4. **Spodbujaj letne pakete.** Imajo nižje provizije, denar dobiš vnaprej in manj ljudi odpove.
5. **Šole:** cene 20/14/12 € so v redu le z mejo AI 0,5 € na učenca na mesec. Pilot po 12 € je skoraj na meji stroškov, zato naj bo časovno omejen (2 leti, kot je zdaj).
6. **Plačilo v aplikaciji (iOS/Android)** naj bo 1 € dražje (10,99 €) ali pa naj poteka prek spleta, kjer je provizija nižja.
7. **Ko boš zavezanec za DDV:** dvigni na 10,99 €/99 € in 16,99 €/149 €, sicer ostane bistveno manj.
8. **Točka preloma:** stalni stroški brez Clauda (okoli 30 €) so pokriti s 4–5 plačniki, z naročnino Claude Max 5x (skupaj okoli 120 € na mesec od 29. 11.) pa s približno 15 plačniki. Ker dobroimetje API pokrije AI za prvih ~80 plačnikov, je zaslužek do tam skoraj cela cena minus Stripe. Ko je aplikacija dokončana, lahko razmisliš o še cenejšem paketu Claude, a takrat moraš API plačevati posebej. Prispevki za s.p. (okoli 400–500 € pri glavni dejavnosti) pa šele s približno 60 plačniki po 8 €.

## 4. Kaj še potrebujem (po 4. 11.)

- Prave stroške AI iz pilota (kartica »Merjenje v pilotu«).
- Odločitev o s.p. (glavni ali popoldanski), da izračunam prispevke.
- Tvoj izbor točk 2–7, da jih vgradim.
