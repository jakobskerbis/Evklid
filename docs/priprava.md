# Priprava na test iz zapiskov

Načrt (j, 24. 11. 2026, projektna zahteva »Evklid – priprava na test iz lastnih zapiskov«). Celoten načrt s
primerjavo z Astro, stroški in UI je v dokumentu https://claude.ai/artifact/ANPptZ4arhKEB2JCghihtn; ta datoteka je
kratek povzetek za agente. Pregledano stanje: `main` 91d88f7 (#977).

## Odločitve j (24. 11. 2026)

1. Izvirniki (fotografije, PDF, Word, PowerPoint) se shranijo šifrirano; izbris kadar koli, samodejno 30 dni po
   testu (brez datuma testa 30 dni po zadnji uporabi priprave; ob spremembi datuma šteje nov datum). To velja samo za pripravo na test; »Moji zapiski« zunaj priprave ostanejo brez slik (odločitev 10. 11.).
2. Nadgradimo obstoječo »Pripravo na test« (`test_plans`, `/test-plan`, `/test-prep`, Urnik); nov razdelek ne nastane.
3. Faza B najprej za MAT, FIZ, KEM (preverjanje s kodo); drugi predmeti v Fazi C.
4. Vsak PR tega projekta gre v `main` in na evklid.app šele po izrecni odobritvi j (ima prednost pred pravilom
   »objava takoj po zelenih testih«).

## Načela

- Vsak vir se razreže na izseke z izvorom (vir, stran, zaporedje, vrsta). Vse, kar sistem ustvari (razlaga,
  kartica, vprašanje, naloga), nosi id-je izsekov; koda preveri, da sklic obstaja.
- Načini virov: A samo izseki (privzeto), B + Evklidove lekcije (oznaka »Iz Evklida«), C + splošno znanje
  (oznaka »Dodatna razlaga«). Neskladje dveh virov pri istem pojmu = opozorilo, ne izbira.
- Računske naloge preveri koda (generator Vadnice ali SymPy, `server/cas.js`); besedilna trditev v načinu A
  potrebuje dobeseden navedek iz izseka, sicer »nepreverjeno« ali zavržena.
- Negotovo branje (eksponenti, indeksi, predznaki, enote) se označi z `[?]` in nikoli ne popravi z ugibanjem.
  Izjema so nedvoumni kemijski indeksi (H2SO4 → H₂SO₄): smejo se dopolniti, a z oznako `[?]`, da učenec vidi
  popravek. Pri matematiki (x2 je lahko x², 2x ali x₂) samo oznaka, brez dopolnitve.
- Besedilo dokumenta gre modelu samo kot podatek v oznakah; klici brez orodij, samo JSON z omejeno dolžino.
  Navodila v dokumentu se ne izvedejo (`test/fixtures/priprava/napad.md`).
- Načrtovalnik je koda, ne model. Brez napovedi ocen in obljub.
- Vsak klic AI gre skozi `server/meje-ai.js`; strani iz obstoječe mesečne meje (`STRANI`, server/zapiski.js).

## Moduli (`server/priprava/`)

| Modul | Naloga |
|---|---|
| `uvoz.js` | tip po vsebini, meje velikosti; PDF z besedilom, Word, PowerPoint brez AI; slike prek branja zapiskov |
| `izseki.js` | izseki, vrste (definicija, izrek, postopek, formula, primer, naloga, teorija), popravki, KaTeX |
| `teme.js` | tematski zemljevid, predznanje, pokritost, preslikava na Evklidove teme (iskanje IDF) |
| `nacrt.js` | dnevni načrt, prednostni red, prilagajanje, različice |
| `postavke.js` | kartice, vprašanja, naloge, razlage z izvorom in preverjanjem |
| `ocena.js` | kratki odgovori, ustna in pisna simulacija (točkovnik, točke sešteje koda) |
| `povezave.js` | lekcija, poskus, 3D, graf po temi (iskanje iz `server/odpri.js`) |
| `deljenje.js` | zasebno deljenje, preklic |

Tabele: `priprave`, `priprava_viri`, `priprava_izseki`, `priprava_teme`, `priprava_nacrti`, `priprava_postavke`,
`priprava_rezultati`, `priprava_deljenja` (vse `ON DELETE CASCADE`, besedila šifrirana). `test_plans` se preseli
v `priprave`; `/test-plan` in `/test-prep` ostaneta kot ovoj.

## PR-ji

| PR | Faza | Vsebina |
|---|---|---|
| 1 | A | ta datoteka, testni nabor `test/fixtures/priprava/` |
| 2 | B | tabele, selitev `test_plans`, poti z lastništvom, izbris |
| 3 | B | uvoz (PDF, Word, PowerPoint, fotografije, besedilo), izseki |
| 4 | B | tematski zemljevid |
| 5 | B | načrtovalnik, »Nadaljuj učenje« |
| 6 | B | razlaga z izvorom, kviz, napredek |
| 7 | B | vmesnik (po potrjenih mockupih) |
| 8–9 | C | kartice, ponavljanje, šibke točke, vse vrste vprašanj, drugi predmeti, načina B in C |
| 10–11 | D | pisna in ustna simulacija |
| 12 | E | povezave z učbenikom, laboratorijem, 3D, kalkulatorjem; zvočna razlaga |
| 13–14 | F | deljenje; dostopnost, stroški, regresija, primerjava z Astro |

### PR 2a (osnova, 25. 11. 2026)

PR 2 je razdeljen: 2a ima samo tabele `priprave`, `priprava_viri` in `priprava_izvirniki` (`server/priprava/shema.js`),
shranjevanje šifriranih izvirnikov s prepoznavo vrste po vsebini (`shramba.js`), poti z lastništvom
(`poti.js`: `/api/students/:id/priprave[/:pid[/viri[/:vid[/izvirnik]]]]`, tuj profil 404) in samodejni izbris
(`ciscenje.js`, v `server/zasebnost.js` runRetention). Izvirniki niso v varnostnih kopijah in ne v izvozu. Brez AI in
brez vmesnika; `test_plans`, `/test-plan`, `/test-prep` in Urnik so nespremenjeni (selitev v 2b). Test:
`test/priprava-osnova.test.js`.

### PR 2b (ena priprava, 25. 11. 2026)

`test_plans` je preseljena v `priprave` (stolpci `pot`, `sklopi`, `dogodek_id`, `aktivna`; selitev in izbris tabele v
`shema.js` ob odprtju baze, v eni transakciji). Načrt testa je **aktivna priprava** (največ ena na profil, delni
enolični indeks); `server/priprava/aktivna.js` nadomesti SQL v `progress.js` (`testPlan`, `setTestPlan`,
`clearTestPlan`), zato `/test-plan`, `/test-prep`, Urnik in ustno spraševanje delajo kot prej; načrt ima nov
`pripravaId`. Pravila: isti test (isti dogodek iz urnika, ista pot z istim datumom ali premaknjen datum še
prihajajočega testa na isti poti) posodobi isto pripravo, da viri ostanejo pri njem; drug test naredi novo aktivno
pripravo, prejšnja brez virov se izbriše, z viri ostane neaktivna. Odstranitev načrta izbriše pripravo brez virov,
pripravo z viri samo deaktivira; ko se isti test vrne (isti dogodek ali ista pot in datum), se ta priprava spet
aktivira, da so viri spet pri njem. Meja 20 priprav na profil velja samo za ročno dodane priprave (POST
`/priprave`), načrt testa jo sme preseči, da se viri starega testa ne premaknejo na nov datum. Datum aktivne priprave
se spreminja tudi prek PUT `/priprave/:pid` (isti načrt). Selitev preskoči vrstice izbrisanih profilov; ob vrnitvi na
starejšo kodo in ponovni nadgradnji se načrt, nastavljen vmes, ne preseli, če ima profil že aktivno pripravo. Test v
urniku sam odpre pripravo z naslovom testa. Novo: tudi načrt testa se
samodejno izbriše 30 dni po testu (prej je načrt v `test_plans` ostal do zamenjave). `/priprave` vrne `aktivna`, `pot`,
`sklopi`, `dogodek_id`. Test: `test/priprava-nacrt-testa.test.js`.

### PR 3a (uvoz brez AI in izseki, 25. 11. 2026)

PR 3 je razdeljen: 3a uvozi brez AI, 3b doda branje fotografij in skeniranih strani PDF (obstoječe branje zapiskov,
`server/zapiski.js`, meja `STRANI`, `server/meje-ai.js`). `uvoz.js`: prilepljeno besedilo (naslovi `#`, alineje),
Word (slogi naslovov, alineje, tabele po vrsticah, formule OMML → LaTeX do globine 12, sicer `[formula] [?]`, prelomi
strani), PowerPoint (prosojnice v vrstnem redu iz `presentation.xml`, opombe govorca), PDF z besedilom (`pdfjs-dist`
v ločeni niti, brez JavaScripta in pisav, 80 strani, 20 s; stran z manj kot 20 znaki je skenirana in čaka na 3b).
ZIP bere sam (meja 20 MB na vnos, 60 MB skupaj, `maxOutputLength`), XML brez razčlenjevalnika; največ 200 000 znakov
na vir. `izseki.js`: bloki do 1200 znakov z naslovom razdelka, stranjo in zaporedjem; vrsto določi koda (definicija,
izrek, postopek, formula, primer, naloga, teorija; oštevilčena naloga s točkami je svoj izsek). Negotovo: »x2« ostane
z `[?]`, kemijska formula z vsaj dvema elementoma brez indeksov se dopolni (H2SO4 → H₂SO₄) z `[?]`, en simbol z
indeksom (F2, R1) se ne označi, formula, ki je KaTeX ne izriše, dobi `[?]`. Tabela `priprava_izseki` (besedilo,
naslov in seznam negotovih mest šifrirani, v `SEALED`, v izvozu odšifrirani, kaskada z virom in pripravo);
`priprava_viri` ima `stanje` (caka, obdelan, branje, napaka), `strani`, `napaka`, `opozorila`. Vir se obdela ob
nalaganju (hkrati največ 2 obdelavi, sicer ostane »caka«); poti `POST …/viri/:vid/obdelaj` in
`GET …/priprave/:pid/izseki[?vir=&vrsta=]`. Strošek AI 0. Test: `test/priprava-uvoz.test.js`.

## Testni nabor

`test/fixtures/priprava/` ima besedilne vire in `pricakovano.json` (kaj mora uvoz najti, kaj označiti kot
negotovo, kje je neskladje, česa ne sme izvesti). Binarne vire (PDF, Word, PowerPoint) ustvari test iz istih
besedil, da v repozitoriju ni binarnih datotek; fotografije zvezkov priskrbi j (30 strani, kot pri zapiskih): brez imen in drugih osebnih podatkov, ne gredo v
repozitorij, hranijo se samo lokalno ali šifrirano.
`test/priprava-gradiva.test.js` preveri, da je nabor popoln in da se vse formule izrišejo s KaTeX.
Primerjava z Astro (`astra-rubrika.json`) gre po vzorcu `scripts/meri-astra.mjs`: j vnese isto gradivo v Astro
in prepiše rezultate; trditev »boljše od Astre« šele z izmerjenimi rezultati.
