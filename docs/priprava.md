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
`server/zapiski.js`, meja `STRANI`, `server/meje-ai.js`). Cel uvoz enega vira (branje in razrez) teče v ločeni niti
(`nit-uvoza.js`, `uvoziVNiti`): 20 s in največ 500 MB rasti pomnilnika procesa, nato se nit ustavi (`uvoz_cas`,
`uvoz_pomnilnik`), zato zlonameren dokument ne ustavi strežnika. `uvoz.js`: prilepljeno besedilo (naslovi `#`,
alineje); Word (slogi naslovov, alineje, tabele po vrsticah, polja z besedilom brez podvojitve `mc:Fallback`, `<w:cr/>`,
nadpisano in podpisano kot 10⁻⁶, H₂O ali `^(…)`, formule OMML → LaTeX do globine 12 z oklepaji iz dokumenta,
matrikami, sistemi, limitami in naglasi; pregloboka formula ali neznan oklepaj, operator ali naglas da `[formula] [?]`;
prelomi strani); PowerPoint (prosojnice v vrstnem redu iz `presentation.xml`, `<a:br/>`, opombe govorca; številka
prosojnice, noga, datum in glava niso besedilo); PDF z besedilom (`pdfjs-dist` brez JavaScripta in pisav, 80 strani;
vrstice po osnovni črti, manjši dvig ali spust je nadpisano oziroma podpisano v isti vrstici, 3x², H₂O; stran z manj
kot 20 znaki obdrži besedilo in je označena za 3b). ZIP bere sam (meja 20 MB na vnos, 60 MB skupaj,
`maxOutputLength`), XML brez razčlenjevalnika; največ 200 000 znakov na vir. `izseki.js`: bloki do 1200 znakov z
naslovom razdelka, stranjo in zaporedjem; vrsto določi koda iz začetka bloka (definicija, izrek, postopek, formula,
primer, naloga, teorija; oštevilčena naloga s točkami je svoj izsek). Negotovo (linearen pregled nizov): »x2« (tudi
»3x2«, »x2y«, »AB2«) ostane z `[?]`; kemijska formula z vsaj dvema elementoma se dopolni (H2SO4 → H₂SO₄) z `[?]` samo
v enačbi s puščico in brez naboja, sicer (naboj iona SO42-, BC2 v geometriji) samo `[?]`; en simbol z indeksom (F2,
R1), LaTeX in indeksi z `_` se ne označijo; formula, ki je KaTeX ne izriše, dobi `[?]`. Tabela `priprava_izseki`
(besedilo, naslov in seznam negotovih mest šifrirani, v `SEALED`, v izvozu odšifrirani, kaskada z virom in pripravo;
ponovna obdelava briše s `secure_delete`); `priprava_viri` ima `stanje` (caka, obdelan, branje, napaka), `strani`,
`napaka`, `opozorila`. Vir se obdela ob nalaganju (hkrati največ 2 obdelavi, sicer ostane »caka«; če je vir med
branjem izbrisan, 404); poti `POST …/viri/:vid/obdelaj` in `GET …/priprave/:pid/izseki[?vir=&vrsta=]`. Strošek AI 0.
Test: `test/priprava-uvoz.test.js`.

### PR 3b (branje fotografij in skeniranih strani, 25. 11. 2026)

`POST …/priprave/:pid/viri/:vid/preberi` prebere fotografijo vira ali skenirane strani PDF (strani z manj kot 20 znaki
iz PR 3a, največ 5 na zahtevek) z istim branjem kot »Moji zapiski« (`server/zapiski.js` `readNotePhoto`: prepis brez
popravkov, imena → `[ime]`, zavrnitev neučnih fotografij, zastavica stiske odpre okno nujne pomoči in pride v vsak
odgovor, tudi ob napaki ali izbrisu med branjem). Ista mesečna meja strani `STRANI` (ena slika = ena stran, skupaj z
zapiski) in trda meja AI (`readReserveUsd`, `usage.guard`); strošek se zapiše kot `priprava`; neuspel klic ali način
brez ključa strani ne porabi. Stran PDF: `sken.js` v ločeni niti vzame največjo sliko strani, jo pretvori v sivine,
zmanjša na 1568 točk in zapiše kot PNG; slike nad 40 milijonov točk pdfjs ne dekodira (`maxImageSize`). Stran brez
slike (`sken_ni_slike`) in prazna stran (manj kot 0,02 % temnih točk, `prazno`) gresta brez klica modela in brez strani
iz meje; če nit pade, se strani poskusijo ena po ena in stran, ki pade tudi sama, dobi `sken_napaka`. Fotografija JPEG
nad mejo modela (5 MB base64) se zmanjša po isti poti (zavita v PDF z eno stranjo, zasukana po EXIF); druga prevelika
slika 413 (`branje_velika`). Obdelava vira, ki se ravno bere, vrne 409.
Prepisi strani se hranijo šifrirano (`priprava_prepisi`, v `SEALED`, kaskada z virom), zato ponovno branje ali
ponovna obdelava ne kliče modela znova; fotografijo prebere znova `?znova=1`, slabši izid (neučno, prazno) pa ne
zamenja dobrega prepisa. Izseki iz prepisa imajo stolpec `ai` in v odgovoru oznako `ai_generated`. Vir PDF ostane
»branje«, dokler ima neprebrane skenirane strani. Test: `test/priprava-branje.test.js`.

### PR 4 (tematski zemljevid, 25. 11. 2026)

`server/priprava/teme.js`, pot `GET …/priprave/:pid/teme`. Brez AI: tema izseka je iskanje po kazalu tem
(`server/lekcija-za-vprasanje.js` `rankLessons`, ista pravila kot `topicForName`: beseda iz naslova teme, najmanjša
ocena, prednost pred drugo temo). Najprej začetek besedila izseka, nato naslov razdelka; naslov, ki imenuje več tem
(»Kemijske reakcije in množina snovi«), ne da teme. Formula da eno besedo po prednosti (`\int` z mejama → določeni
integral, `\lim` → limita, `\det` → determinanta …; `\sqrt` nič). Izsek brez jasne teme ostane `samoVZapiskih` (ne
ugibamo). Obseg testa so teme sklopov iz načrta testa (`pot`, `sklopi`, samo šolske poti; iskanje do ravni poti, če je
višja od ravni v profilu); tema iz obsega ima prednost, če ima vsaj 80 % ocene najboljše in ni dvoumna (cel naslov,
dve besedi naslova ali besede, ki jih nima nobena druga tema). Merjeno na 133 izsekih (23 zapiskov, OŠ in SŠ):
natančnost 0,99, priklic 0,57. Največ 5000 izsekov na izračun (`delno`), računanje prepušča zanko drugim zahtevkom,
zadnji izračuni so v predpomnilniku. Vrne teme v vrstnem redu učnega načrta (z id-ji izsekov in `vObsegu`), obseg z `izsekov` na temo,
`pokritost` (pokrite / vse teme obsega) in `predznanje` (5 tem poti pred prvim sklopom testa, brez trditev o znanju).
Računa se sproti iz trenutnih izsekov, zato tabela `priprava_teme` ni potrebna. Faks in tuji šolski sistemi: `iskanje:
false`, vse ostane v zapiskih. Test: `test/priprava-teme.test.js`.

### PR 5 (načrtovalnik, 25. 11. 2026)

`server/priprava/nacrt.js`, poti `GET …/priprave/:pid/nacrt` in `POST …/priprave/:pid/nacrt/prebrano` (`{ tema_id,
prebrano? }`, tabela `priprava_prebrano`). Koda, ne model; brez napovedi ocen. Teme so obseg testa (brez načrta testa
teme iz zapiskov, PR 4; na osnovni ravni mature brez tem samo za višjo raven, `exams.js ravenProfila`).
Ocena teme: `progress.js topicScore` (ista lestvica kot pripravljenost na izpit; velja boljša od teme in njenih osnovnih
tem): nova 0, v učenju 0,2–0,6, za ponovitev 0,8, obvladana 1. Strogo izkazano: samo ročna oznaka »obvladano« šteje 0,4
(dokler je ne potrdita 2 pravilni ponovitvi ali 8 pravilnih nalog), obvladana tema z zgrešeno ponovitvijo brez poznejše
pravilne naloge 0,6 (pripravljenost na izpit zaenkrat ostaja brez tega; odloči j).
Enote: nova → nova snov, vaja, ponovitev; v učenju → vaja, ponovitev; za ponovitev → ponovitev; obvladana → ponovitev na
dan ponovitve Evklida (`review_due`), sicer neobvezna osvežitev v zadnjih 3 učnih dneh (enkrat, samo v prostor, ki ostane po obveznih enotah); tema
brez nalog v Vadnici → »zapiski« (ni preverljiva, največ ena na dan, za preverljivimi enotami, opravljena, ko je
označena kot prebrana; ne šteje v pripravljenost).
Razmiki veljajo med dnevi, ker se načrt vsak dan računa znova iz zgodovine: tema v učenju dobi naslednjo vajo 1–2 dni
po zadnji vaji (ne vsak dan), ponovitev pride tretjino preostalega časa pozneje, največ 7 dni. Najšibkejše prve; najprej
prve enote vseh tem, nato druge in tretje; samo en učni dan → najprej teme v učenju. Največ 3 enote na dan; kar ne gre,
je v `nePrideNaVrsto` (`stisnjeno`). Zadnji dan pred testom (tudi, ko je to danes) poskusni test (obstoječi `/test-prep`: aktivna priprava,
izbrani sklopi in vsaj ena tema z nalogami). Brez datuma en teden; test mimo → `mimo`; test danes → prazen načrt.
Danes: šteje samo vaja, ponavljanje in vaja iz lista (ne test, uvrstitev ali tekmovanje); nova snov in vaja sta opravljeni
po 3 odgovorjenih nalogah teme ta dan (tudi napačnih) (slovenski dan izdaje naloge), ponovitev po 2 (kot ponavljanje Evklida); `naslednja` je
prva neopravljena preverljiva enota (»Nadaljuj učenje«); teme, vadene danes, ostanejo danes (opravljene), druge enote se ne
premaknejo v danes. Tabela `priprava_nacrti` ni potrebna.
`pripravljenost`: povprečje ocen preverljivih tem, število obvladanih, preverljivih in nepreverljivih. Test:
`test/priprava-nacrt.test.js`.

### PR 6a (kviz in napredek, 25. 11. 2026)

Brez AI. `POST …/priprave/:pid/kviz` (`{ dolzina: 6 | 12 | 20, teme? }`): obstoječa seja »list« (`progress.js startList`,
naloge Vadnice, ki jih preveri koda; namigi, povzetek po temah) s parametrom `priprava`. Ob koncu kviza izkazano znanje
premakne stanje teme (`listSummary`): »ok« (vsaj 2 nalogi, ≥ 3/4 v prvem poskusu) → stopnja višje (nova → učim se,
stopnja 2), »few« ali »more« → nova tema »učim se« (»more« pri obvladani temi kot doslej ponovitev); obvladanje ostane
pravilo `checkMastery`. Tako kviz spremeni načrt in pripravljenost. Privzeto najšibkejše teme obsega (obvladane samo,
če drugih ni), največ `dolzina/2` tem, da ima vsaka vsaj dve nalogi; `teme` mora biti neprazen seznam id-jev iz načrta
te priprave z nalogami (sicer 400 `kviz_teme`); tema brez lastnih nalog vzame naloge osnovne teme (ena veščina na
osnovno temo). Nedokončan isti kviz istega dne se nadaljuje; največ 20 novih kvizov na profil v 10 minutah (429
`kviz_hitro`). Kviz ostane v zgodovini vaje profila tudi po izbrisu priprave (samo id-ji tem, kot vsa vaja).
`GET …/priprave/:pid/napredek`: pripravljenost (kot načrt), posnetki po dnevih (tabela `priprava_napredek`, en na dan,
zapiše se ob odprtju načrta ali napredka, do dneva testa; kaskadni izbris; odprtje šteje kot uporaba priprave za
samodejni izbris) in stanje vsake teme (`nova | ucim | ponovitev | obvladana | zapiski`, vse odgovorjene naloge vaje,
ponavljanja in lista, tudi osnovnih tem, pravilne v prvem poskusu). Vmesnik pokaže posnetke samo kot izkazano znanje
po dnevih, nikoli kot trend do testa ali napoved ocene (odstotek ni ocena in lahko pade, ko pridejo ponovitve).
Test: `test/priprava-kviz.test.js`. Razlaga z izvorom (AI) je PR 6b.

## Testni nabor

`test/fixtures/priprava/` ima besedilne vire in `pricakovano.json` (kaj mora uvoz najti, kaj označiti kot
negotovo, kje je neskladje, česa ne sme izvesti). Binarne vire (PDF, Word, PowerPoint) ustvari test iz istih
besedil, da v repozitoriju ni binarnih datotek; fotografije zvezkov priskrbi j (30 strani, kot pri zapiskih): brez imen in drugih osebnih podatkov, ne gredo v
repozitorij, hranijo se samo lokalno ali šifrirano.
`test/priprava-gradiva.test.js` preveri, da je nabor popoln in da se vse formule izrišejo s KaTeX.
Primerjava z Astro (`astra-rubrika.json`) gre po vzorcu `scripts/meri-astra.mjs`: j vnese isto gradivo v Astro
in prepiše rezultate; trditev »boljše od Astre« šele z izmerjenimi rezultati.
