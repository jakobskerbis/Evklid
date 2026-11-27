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
zadnji izračuni so v predpomnilniku. Drugi krog (K-10, 27. 11. 2026), samo z obsegom testa: izsek brez teme dobi temo obsega,
če to podpira njegovo LASTNO besedilo z vsaj eno besedo iz imena teme: tema obsega ima besedo naslova, oceno vsaj 9, je
boljša od vseh tem zunaj obsega in vodi za 1,25 pred drugo temo obsega; pri tesnem vodstvu odloči tema izseka tik pred
njim v istem viru in razdelku (vodilna kadar koli, druga le pod 1,1 in če sama izpolni vse pogoje). Vsebinska ocena brez
besede imena teme ne zadošča (visoko oceno pri kaki temi obsega dobi tudi besedilo drugega predmeta), sosedstvo samo
nikoli ne da teme (navodilo, »Primer«, opomba ali naslovna vrstica med izseki iste teme ostane v zapiskih). Isto iskanje
kot prvi krog (shranjeni so le zadetki obsega in prvi zunaj njega), prepušča zanko vsakih 200 izsekov; izseki teme ostanejo
v vrstnem redu zapiskov. Na 10 kompletih K-10 (69 izsekov s potjo) nepovezanih 25 → 21, vse 4 nove povezave pravilne
(ročni pregled); ob zapiskih drugih predmetov (vsi kompleti × vsi tuji zapiski) 3 nove napačne povezave. Snov brez imena teme
(»Splošna oblika: f(x) = …«) ostane v zapiskih. Pragovi so nastavljeni na istih K-10 zapiskih (ni ločenega preizkusa). Vrne teme v vrstnem redu učnega načrta (z id-ji izsekov in `vObsegu`), obseg z `izsekov` na temo,
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
stopnja 2), »few« → nova tema »učim se«, »more« pri novi temi nič (ostane nova snov; napačen odgovor ne dvigne
pripravljenosti), pri obvladani kot doslej ponovitev; obvladanje ostane
pravilo `checkMastery`. Tako kviz spremeni načrt in pripravljenost. Privzeto najšibkejše teme obsega (obvladane samo,
če drugih ni), največ `dolzina/2` tem, da ima vsaka vsaj dve nalogi; `teme` mora biti neprazen seznam id-jev iz načrta
te priprave z nalogami, največ 20 (sicer 400 `kviz_teme`; od izbranih gre v kviz prvih `dolzina/2`); tema brez lastnih
nalog vzame naloge osnovne teme (ena veščina na osnovno temo). Nedokončan kviz z istim izborom (samodejno ali iste
teme) in dolžino istega slovenskega dne se nadaljuje; največ 20 novih kvizov na profil v 10 minutah (429
`kviz_hitro`). Kviz ostane v zgodovini vaje profila tudi po izbrisu priprave (samo id-ji tem, kot vsa vaja).
`GET …/priprave/:pid/napredek`: pripravljenost (kot načrt), posnetki po dnevih (tabela `priprava_napredek`, en na dan,
zapiše se ob odprtju načrta ali napredka, do dneva testa; kaskadni izbris; odprtje šteje kot uporaba priprave za
samodejni izbris) in stanje vsake teme (`nova | ucim | ponovitev | obvladana | zapiski`, vse odgovorjene naloge vaje,
ponavljanja in lista, tudi osnovnih tem, pravilne v prvem poskusu). Vmesnik pokaže posnetke samo kot izkazano znanje
po dnevih, nikoli kot trend do testa ali napoved ocene (odstotek ni ocena in lahko pade, ko pridejo ponovitve).
Test: `test/priprava-kviz.test.js`. Razlaga z izvorom (AI) je PR 6b.

### PR 6b (razlaga teme z izvorom, 25. 11. 2026)

`server/priprava/postavke.js`, poti `POST …/priprave/:pid/razlaga` (`{ tema_id, znova? }`) in `GET …?tema_id=`. Način A:
model (`EVKLID_PRIPRAVA_RAZLAGA_MODEL`, privzeto srednji model) dobi samo izseke te teme (največ 12 in 9000 znakov,
očiščene kot zapiski: nevidni znaki, oznake `<izseki>`, ponarejene glave izsekov) v oznakah kot podatek, brez orodij,
odgovor samo JSON. Koda obdrži odstavek le, če: navaja samo poslane izseke; ima dobeseden navedek (20–200 znakov, vsaj 3
besede ali cela formula; enoten zapis presledkov, narekovajev in pomišljajev, NFC; velike črke štejejo; vsak navedek
enkrat) iz enega od navedenih izsekov, ki je o istem kot odstavek (vsaj polovica njegovih vsebinskih besed, njegova
formula ali vsa njegova števila so v odstavku); je vsaka njegova formula cela v navedenih izsekih (primerjava po žetonih:
`500` ni začetek `5000`, `E = 5` ni začetek `E = 5 \cdot 10^3`; meja formule ali vrstice v zapiskih je meja izraza; brez
besed v formuli, npr. `$Definicija$`; enačba mora v zapiskih končati, `$a_{n+1} = 2$` ni iz `2a_n`); je vsako število,
tudi v formulah, v navedenih izsekih (NFKC, nadpisane števke kot potenca, predznak in potenca sta del števila: `-2`,
`10^-6`, `2·10^-6` ni `10^-6`; meje integrala sta dve števili; števke zunaj ASCII → odstavek odpade), rezultat v besedilu
(za »je«, »znaša«, »=«, …) je rezultat tudi v izseku (»determinanta je 2« ne gre, če je 2 le element matrike), število z
enoto pa ima v izseku isto enoto (»sila 5000 N« ne gre, če je 5000 N/C jakost); izsek, iz katerega je število, je med viri;
ne razreši negotovega branja `x2 [?]` (zapis `x^2`, `x_2`, `x²`, `H2SO4` brez `[?]` odpade, če ponovi vrstico z negotovim
branjem ali če je branje v navedenem izseku, zapisa pa v navedenih izsekih ni); se formule izrišejo s KaTeX (brez
nezaprtih `$`, `\(`, `\[`); `codeCheck` ne najde računske napake (vsak račun, tudi v besedilu, npr. `8 - 4 = 5`,
`12 : 4 = 4`, `2 ⋅ 3 = 7`, `2³ = 9`, v svoji vrstici, da ga besede »ne velja«, »narobe« ne izpustijo; napačen primer iz
zapiskov zato odpade).
Izhod brez oznak HTML (samo prave oznake; `a<b in b>c` ostane) in povezav; odjemalec ga izriše kot besedilo s KaTeX, ne kot
HTML. `viri` so samo izseki, ki odstavek res podpirajo (navedek ali formula z vsaj tremi žetoni); `negotovo`, ko podporni
izsek ima `[?]`, odstavek pa ne. To je
»podprto z zapiski« (`preverjeno: "zapiski"`), ne »pravilno«. Česar koda ne ujame: števila z besedo (»petsto«),
zanikanje (»tudi pri živalih« ob navedku »samo pri rastlinah« z istimi besedami), negotovo branje, razrešeno z besedo
(»x na kvadrat«), rezultat, pripisan drugemu računu istih izsekov. Poleg tega: napačna vrstica v zapiskih lahko ostane, če je koda ne
preračuna (vmesnik ne sme pisati »pravilno«). Brez preverljivega odstavka 422 (`razlaga_nepreverjena`, s stanjem strani),
nič se ne shrani. Shramba: šifrirano (`priprava_postavke`, SEALED; kaskadni izbris), z id-ji izsekov in odtisom
(id-ji, naslovi in besedila); drugačen odtis = `zastarela` (id-ji izsekov se po izbrisu ponovijo), model se ne kliče znova,
dokler je odtis enak (`znova: true` za novo razlago). Izbris ali ponovna obdelava vira izbriše razlage iz njegovih
izsekov; če se izseki spremenijo med klicem modela, se odtis tik pred zapisom preveri znova in razlaga se ne shrani (409
`razlaga_zapiski_spremenjeni`, stran ostane porabljena, ker je klic plačan). Strošek: ena stran iz mesečne meje zapiskov (`STRANI`; ob napaki modela se vrne, ob 422 ostane, ker je klic
plačan), trda meja AI (`usage.guard` z rezervo iz dejanskega sporočila po pravilu `meje-ai.js`), zapis porabe »priprava«;
hkrati ena razlaga na profil (409). Stiska v izsekih (lokalni zaznavalnik, brez AI) → `nujno` v odgovoru, tudi ob branju shranjene razlage (GET). Odgovor nosi
oznako AI, vire (izsek, vir, stran) in navedek. Ključ predpomnilnika zemljevida ima zdaj tudi dolžino in čas izsekov.
Test: `test/priprava-razlaga.test.js` (model nadomeščen; tudi `napad.md` in stiska).

### PR 7 (vmesnik, 26. 11. 2026)

Po maketah, ki jih je j potrdil 25. 11. (telefon, iPad, računalnik). `public/priprava/priprava.js` je len modul
(`lenModul` v `public/app.js`, `LENI_MODULI` v `server/app.js`): ni v prvem nalaganju. Stari obrazec »Priprava na test«
(`#tp-form`) je odstranjen; `showTestPrep()` odpre modul.

Tok: korak 1 test (sklopi z vajo, datum; odstrani v dveh korakih) → korak 2 zapiski (fotografija s kamero, datoteka,
prilepljeno besedilo; stanje vira, število `[?]`, izbris v dveh korakih, ponovni poskus, meja strani, zasebnost;
»Nadaljuj brez zapiskov«) → korak 3 teme (kljukice obsega, pokritost, predznanje, datum) → prvi kviz (6 nalog, seja
`priprava-kviz`, preveri koda) → povzetek po temah in načrt do testa → domača stran priprave (odštevanje, pripravljenost samo
iz rešenih nalog z razlago, »Danes« z n od N nalog, »Nadaljuj«, naslednji dnevi, teme z napredkom, »Moji zapiski«) →
tema (razlaga iz zapiskov z navedkom in virom, ki odpre izvirni izsek dobesedno z `[?]`; »Podprto z zapiski« / »Pripravil
AI«; zastarela razlaga; »Vadi«, »Prebral sem«, lekcija, inštruktor). Razlaga se izriše kot besedilo s KaTeX
(`public/priprava/izris.js`, `besediloZFormulami`): brez HTML in Markdowna, formula z `[?]` se ne izriše. Nikjer ni
napovedi ocene; odstotek ni ocena.

Strežnik: `priprave.izkljucene` (seznam id-jev tem, ≤ 200, `PUT …/priprave/:pid` `{ izkljucene }`, napačen vnos 400
`priprava_teme`, prazen seznam vrne celoten obseg). Izključena tema ni v obsegu, pokritosti, načrtu in kvizu; predznanje se
računa iz celotnega obsega; vseh tem ni mogoče izključiti (ostane celoten obseg). `GET …/nacrt` vrne še `nalogDanes`
(tema → današnje rešene naloge) in `potrebnoNalog` (`OPRAVLJENO_NALOG` iz `nacrt.js`) za »n od N nalog«.

Postavitev: telefon en stolpec; od 820 px dva stolpca (desni: teme, zapiski); od 1200 px trije (300 px / 1fr / 380 px).
Barve samo iz žetonov teme (izjema `#fff` na modri kartici); svetla in temna tema. Prevodi: `public/priprava/sl.js` in
`public/priprava/i18n/{en,de,hr,it,hu}.json` (samo živi jeziki; drugi padejo na `uiChain`).

Merila in kako se merijo (`node scripts/preveri-pripravo.cjs [--posnetki mapa] [--tema temna] [--naprave …]`, 8 naprav:
telefon 360, 390, 430; iPad 820 in 1366×1024 ležeče; računalnik 1280, 1440, 1920; preizkusni strežnik z `EVKLID_MOCK`):
- od zapiskov do prvega kviza ≤ 3 min: izmerjeno ~1 s sistemskega časa in 4 dejanja (prilepi, dodaj, naprej, začni kviz);
- 0 uganjenih znakov: vsak izsek, ki ga vrne strežnik, je brez oznak `[?]` enak delu prilepljenega besedila, nobena
  oznaka ne izgine (dodane oznake se štejejo, npr. `x2 [?]`);
- kviz do konca (4 prav, 2 narobe) in povzetek kviza se ujema z oddanimi odgovori;
- brez napak strani in konzole, brez odgovorov ≥ 400 (razen pričakovane razlage v preizkusnem načinu), brez
  vodoravnega drsenja, brez neprevedenih ključev `pr.`; posnetek vsakega zaslona.
Test: `test/priprava-vmesnik.test.js` (izris dobesedno z `[?]`, pomožne funkcije, prevodi živih jezikov z enakimi
spremenljivkami, izključene teme prek API in v samodejnem kvizu, tuja priprava 404, len modul in barve) in
`test/priprava-vmesnik-brskalnik.test.js` (Playwright: vir, ki ga ni mogoče prebrati, sproži en zahtevek in ne zanke;
napaka nalaganja ostane vidna; vhoda za datoteke s tipkovnico; vsaj ena tema ostane na testu).

Po pregledih (26. 11.): vir, ki se ni premaknil (meja strani, preizkusni način, zapora AI, napaka), gre med ustavljene
in se ne bere znova, dokler učenec ne pritisne »Poskusi znova« (prej do ~60 zahtevkov na sekundo); vir, dodan med
obdelavo, se obdela takoj za njo; kljukice obsega se shranjujejo po eno; dvojni klik ne začne dveh kvizov (ali kviz
sploh je, odloči strežnik, `kviz_brez_tem`); enota »Preberi zapiske« iz »Danes« ima »Prebral sem«; navedek in izvirni
izsek izrišeta formule (formula z `[?]` ostane izvirnik); odstotek pripravljenosti se pokaže šele po prvi rešeni nalogi,
z opombo, da ni ocena; datum po uri naprave.
Znana vrzel: poskusni test (`/test-prep`, `progress.startTest`) jemlje naloge iz sklopov načrta in še ne izpusti
odstranjenih tem.

## Testni nabor

`test/fixtures/priprava/` ima besedilne vire in `pricakovano.json` (kaj mora uvoz najti, kaj označiti kot
negotovo, kje je neskladje, česa ne sme izvesti). Binarne vire (PDF, Word, PowerPoint) ustvari test iz istih
besedil, da v repozitoriju ni binarnih datotek; fotografije zvezkov priskrbi j (30 strani, kot pri zapiskih): brez imen in drugih osebnih podatkov, ne gredo v
repozitorij, hranijo se samo lokalno ali šifrirano.
`test/priprava-gradiva.test.js` preveri, da je nabor popoln in da se vse formule izrišejo s KaTeX.
Primerjava z Astro (`astra-rubrika.json`) gre po vzorcu `scripts/meri-astra.mjs`: j vnese isto gradivo v Astro
in prepiše rezultate; trditev »boljše od Astre« šele z izmerjenimi rezultati.
