# Matematično preverjanje: skupni statusi in zapis trditve

j, 25. 11. 2026 (»Celovit sistem matematičnega preverjanja«): vsaka matematična trditev v Evklidu naj ima status
preverjanja, ki ne obljublja več, kot dokazi upravičijo. Načelo: **AI razloži. Matematika preveri. Lean dokaže.**
Ne obljubljamo 100-odstotne pravilnosti; cilj je 100-odstotna pokritost trditev s pravim statusom in čim manj
napačnih trditev, označenih kot preverjene (glavna metrika).

Načrt (22 PR-jev PV-01 do PV-22, faze A–J, delitev s profilom B): Claude Doc
<https://claude.ai/artifact/4MDrdZGAMias5kvAmNc1Ci>; predlogi za profil B na #539. Lean: `docs/lean.md` (L1–L6).
SymPy: `docs/preverjanje-s-kodo.md`.

## Sedem statusov (`public/preverjanje/statusi.js`)

| Status | Ključ | Kdaj velja |
| --- | --- | --- |
| Formalno dokazano | `dokazano` | Lean je dokazal trditev in njeno popolnost (cela množica rešitev). Pogoji iz `docs/lean.md`: izrek je zapisan tako kot v viru (prevod AI preveri neodvisno), predpostavke imajo `example`, ki pokaže, da se dajo izpolniti, aksiomi so samo `propext`, `Classical.choice`, `Quot.sound`. |
| Računsko preverjeno | `izracunano` | Točna aritmetika, točna algebra (`public/scan/algebra.js`) ali SymPy z `how: "symbolic"` (PV-03) potrdi trditev v celoti. |
| Numerično preverjeno | `numericno` | Vsaj en del (trditev ali popolnost) je preverjen samo s števili (naključne točke, mreža). Ni dokaz in se nikoli ne zviša sam. |
| Delno preverjeno | `delno` | Del trditve ali odgovora je preverjen, del ne (npr. vsaka navedena rešitev drži, popolnost ne). |
| Preverjanje v teku | `v_teku` | Počasnejši motor (Lean) še dela. Začasno; po roku velja najvišji doseženi status (rok uvede PV-14). Oznaka »ni preverjeno z Lean« iz L6 (`docs/lean.md`) je ta status oziroma status, ki ga je trditev dobila brez Leana. |
| Zaznana napaka | `napaka` | Preverjanje je pokazalo, da trditev ne drži (protiprimer, manjkajoča ali odvečna rešitev). |
| Nepreverjeno | `nepreverjeno` | Noben motor trditve ne zna preveriti, ali pa se motorja ne strinjata. |

Pravila:

- **Status ni nikoli močnejši od dokaza.** `statusIzDokazov({ holds, how, complete })` vzame šibkejšega od obeh
  delov: Lean dokaz trditve s popolnostjo iz SymPy je `izracunano`; številski preizkus je vedno največ `numericno`.
- **Odgovor je najšibkejši člen** (`statusOdgovora`): ena `napaka` → napaka; sicer ena `v_teku` → v teku;
  mešanica preverjenih in nepreverjenih → `delno`; `dokazano` samo, ko je dokazana vsaka trditev in vsak prehod
  med koraki (prehod je svoja trditev vrste `korak`).
- **Vsak motor sme navesti največ svoj način** (`MOTORJI` v `trditev.js`): `formal` samo Lean, njegov »drži« pa samo z
  imenovanim izrekom (`dokaz.izrek`; protiprimer šteje tudi brez), `exact` aritmetika, algebra, SymPy in kemija, `numeric` števila. Močnejša navedba šteje
  le do meje motorja; mnenje AI in neznan motor nista dokaz. Pri enačbi, neenačbi in sistemu (in kadar vrsta ni
  podana) je popolnost del trditve, zato `complete: "na"` tam šteje kot »ni preverjena«.
- **Več dokazov za isto trditev** (`statusTrditve` v `trditev.js`): formalni protiprimer → `napaka`; točen
  »ne drži« → `napaka`, razen če Lean isto trditev dokaže (SymPy lahko »ne drži« odloči s preizkusom v točkah):
  takrat `nepreverjeno`; številski »ne drži« → `napaka`, razen če ga močnejši motor ovrže za isti del (»ne drži«
  le močnejši »drži«, manjkajočo rešitev le močnejši dokaz popolnosti): takrat `nepreverjeno`. Neskladje motorjev
  gre v meritev. Sicer velja najmočnejši dokaz.
- **Potrjeno** (`jePotrjeno`) pomeni `dokazano` ali `izracunano`. Napačna trditev s takim statusom je
  »napačno potrjena«; ta delež mora biti 0.

Skener ima na zaslonu svojih pet statusov (`public/scan/status.js`), ki so od PV-01 samo prevod skupnih:
`izracunano` in `dokazano` → »Preverjeno« (`verified`), `delno` → `partial`, `numericno` → `numeric`,
`napaka` → `wrong`, `nepreverjeno` in `v_teku` → `unverified`. Besedila na zaslonu se niso spremenila.

## Zapis trditve (`public/preverjanje/trditev.js`)

Vsak vir odda trditve v istem zapisu: `id`, `besedilo` (kot ga vidi učenec), `zapis` (strojni zapis, isti jezik kot
blok RACUN), `vrsta` (`VRSTE`), `predpostavke`, `obmocje`, `enote`, `prejsnji` (id koraka, iz katerega trditev
sledi), `pravilo`, `dokazi` (`{ motor, holds, how, complete, ms, razlicica }`), `dokaz` (Lean izrek in sha256) in
`izid` (status, izračunan iz dokazov; vir ga ne nastavi sam). `napakeZapisa(t)` preveri obliko, ne matematike.

## Način preverjanja SymPy (PV-03)

Worker (`server/cas/worker.py`) v vsakem odgovoru vrne `how`, najšibkejši način, ki ga je ukaz uporabil
(dogovor s profilom B na #539):

- `symbolic`: simbolni račun (poenostavitev na 0, `solveset`, točna števila, ki jih SymPy odloči sam);
- `numeric`: števila na 30 mest (konstanta z decimalkami, |N| < 10⁻¹²), sprejem s toleranco zapisa (`decimals_tol`,
  približki rešitev, zaokroženi vmesni rezultati, enote z razmerjem, ki ni točno 1), numeričen določeni integral,
  realnost korenov in logaritmov, ki je SymPy ne dokaže, in popolnost periodičnih rešitev samo na [−20, 20];
- `sampled`: `is_zero` je odločil s preizkusom v naključnih točkah.

Dve pravili iz pregleda: (1) ukaz z decimalkami, ki je izšel `symbolic`, worker ponovi z decimalkami kot ulomki
(0.05 → 1/20, tudi 0,05 in 5e-2); `symbolic` ostane le, če tudi točen račun drži simbolno, sicer je `numeric` (53-bitni `Float` je
`100000000.05 · 100000001` zaokrožil na `10000000105000000`); `ineq` meje z decimalkami primerja kot ulomke.
(2) Sistem s kotnimi funkcijami je največ `numeric`, ker `sp.solve` vrne le glavne rešitve
(`sin x = y, cos x = y` brez −3π/4 in periodičnih rešitev).
`Timeout` je `BaseException`, da ga širok `except Exception` v SymPy ne pogoltne: ukaz se konča v 6 s, prej je
lahko tekel do roba 9 s v `cas.js`, ki proces ubije (na trditvah iz lekcij se `ok` zato ni spremenil).

`server/cas.js` `casCheck` vrne `how`, kadar ga worker pošlje. Pravilo: SymPy »drži« je `izracunano` samo pri
`how: "symbolic"`, sicer (tudi brez `how`) največ `numericno`. Meja motorja `sympy` v `trditev.js` ostane `exact`;
vir v `dokazi` preslika besednjak workerja: `symbolic` → `exact`, `numeric` in `sampled` → `numeric`.

`ok` se spremeni le na robu: točno število, ki ni 0, a je manjše od 10⁻¹², je prej veljalo za 0, zdaj ga SymPy
odloči simbolno (`equal e^(-60) | 0`: prej `true`, zdaj `false`; `value sqrt(10^40+1) | 10^20`: prej `true`, zdaj
`null`). Na 5.329 trditvah RACUN iz lekcij se `ok` ni spremenil nikjer. Ker `simplify` sam ne najde vseh identitet,
`is_zero` pred vzorčenjem poskusi še tri simbolne prepise (`expand_trig`, `rewrite(exp)`, razstavljena osnova
korena), vsakega z lastnim časovnim robom 1,5 s; Piecewise, ki je 0 povsod razen v točki, kjer izraz ni definiran
(odvod |x|), šteje kot 0. Tako `tan x + cot x = 2/sin 2x`, `sqrt(x²+6x+9) = |x+3|`, `(|x|)' = x/|x|`,
`(ln|x|)' = 1/x` in točna rešitev eksponentne enačbe ostanejo `symbolic`. Skener (`verifyAiFull`) to že upošteva: SymPy, ki ni simbolno dokazal, da
največ »Numerično preverjeno«, razen če je lokalna točna algebra odgovor dokazala. Bloka RACUN (`server/racun.js`,
profil B) še ne preslikamo v statuse; ko ga, velja isto pravilo.

## Preverjevalnik korakov (PV-06)

Ukaz `korak` v workerju presodi en prehod reševanja: `casCheck("korak", [prej, potem, neznanka, območje])`.
`prej` in `potem` sta enačbi, neenačbi (tudi dvojna, `-2<x<2`), več delov, povezanih z »ali« (`x-1=0 ali x+2=0`,
tudi `x=2, x=3`), ali izraza brez relacije. Neznanka je lahko prazna, kadar ima zapis eno samo spremenljivko;
območje (`x>0`, `[0, 2*pi)`) omeji primerjavo. Odgovor ima poleg `ok`, `why` in `how` še `vrsta`:

| `vrsta` | `ok` | Pomen |
| --- | --- | --- |
| `ekvivalenca` | true | Enaka množica realnih rešitev; pri izrazih enaka vrednost povsod, kjer je prvotni izraz definiran (`why` pove pogoj, npr. »velja za x ≠ 0« pri x²/x → x). |
| `posledica` | true | Nova enačba ima vse rešitve in še tuje (kvadriranje, združevanje logaritmov): veljaven vmesni korak, `why` našteje tuje rešitve, ki jih mora preizkus zavreči. Samo pri enačbah. |
| `izguba` | false | Manjkajo rešitve ali del območja: deljenje z izrazom, ki je lahko 0 (`why` ga imenuje), ln(x²) → 2 ln x. |
| `napaka` | false | Drugačna množica rešitev ali drugačna vrednost izraza (s protiprimerom); tudi končni odgovor `x = …` s tujo rešitvijo (manjka preizkus) in neenačba z odvečnim delom. |

Kako: definicijsko območje (imenovalci ≠ 0, argument logaritma > 0, pod sodim korenom ≥ 0, tan/cot) se prebere iz
zapisa, preden ga SymPy okrajša (`parse(..., evaluate=False)`), zato `x²/x = 0 → x = 0` ni enakovreden korak.
Množici rešitev da `solveset` na realni osi (rešitve, ki niso v območju, izločimo); pri periodičnih rešitvah brez
omejenega območja primerjamo [−20, 20] in `how` je `numeric`. Korak, ki obe strani pomnoži s številom (tudi s
parametri), je enakovreden simbolno brez reševanja. Izraza primerja `is_zero`, nato 80 naključnih točk: točka, kjer
je prvotni izraz realen, novi pa ne, je `izguba`; različni vrednosti sta `napaka`. Dvočrkovno ime je v koraku
produkt (`2ab` = 2·a·b). Vejica med argumenti `log(x-2,2)`, `root(8,3)` … je ločilo, ne decimalna vejica (to velja
za vse ukaze; prej je bil `log(x-2,2)` prebran kot `ln(x - 2.2)`).

Česar ne zna, vrne `ok: null`: sistem, veriga enačb, korak iz izraza v enačbo; enačba ali neenačba s parametrom
(`a·x = a → x = 1`: `solveset` predpostavi a ≠ 0), razen koraka, ki obe strani pomnoži s številom; periodične
rešitve z dolgo ali neznano periodo (okno [−20, 20] mora pokriti vsaj štiri periode, sicer bi `sin(πx/30) = 0 → x = 0`
prešel); lihi koren spremenljivke (`x^(1/3) = −2`: SymPy vzame kompleksni glavni koren). Znana meja: osamljene točke,
kjer izraz s kotnimi funkcijami ni definiran (sin x → tan x · cos x), ostanejo nepreverjene; zoženje na intervalu
(ln(x²) → 2 ln x) ujame vzorčenje.

Meritev: `node scripts/meri-korake.mjs` na `test/fixtures/preverjanje/koraki-v1.json` (50 znanih napačnih prehodov,
tipične napake učencev, in 200 pravilnih: 121 ročnih in 79 vzorčnih s stalnimi koeficienti; nabor je sestavil
isti avtor kot ukaz). 26. 11. 2026: ujetih 50/50 (95-% interval 92,9 %–100 %), lažni alarmi 0/200 (0 %–1,9 %),
brez sodbe 0/250, simbolni dokaz pri 234/250 sodbah. Neodvisni slepi nabor `koraki-slepi-v1.json` (40 napačnih,
80 pravilnih) je sestavil ločen agent AI (ne človek) iz opisa vmesnika, preden je videl kodo: ujetih 39/40
(87,1 %–99,6 %), potrjenih napačnih 0/40 (0 %–8,8 %), lažni alarmi 0/80 (0 %–4,6 %), brez sodbe en napačni
(a·x = a → x = 1) in en pravilni (s parametrom). Pred popravki po pregledu je slepi nabor našel en potrjen napačen
korak (parameter) in štiri lažne alarme zunaj nabora (`log(·, osnova)`); ti in ugotovitve pregleda kode so zdaj
testi. Test `test/cas-korak.test.js` zahteva oboje. Ukaz še ni
priključen nikamor v aplikacijo; uporaba (skener, rešitve generatorjev) je naslednji korak načrta.

## Status generatorjev (PV-10)

`node scripts/status-generatorjev.mjs [--semena 5] [--predpona mat-] [--json p.json] [--porocilo p.md] [--dodatek f.md]
[--strogo]` (brez modela AI, z SymPy okoli 10 s) da vsakemu generatorju nalog status. Za vsak generator vzame naloge
ravni 1–3 s semeni 1…N (prva tema generatorja) in v vsaki rešitvi preveri tri vrste trditev:

- **račun**: formula z relacijo, kot v popisu PV-04 (`server/lesson-math.js`, `server/lesson-identity.js`);
- **korak**: zaporedni enačbi ali neenačbi z isto edino neznanko v »čistih« vrsticah (same formule, ločene z vejico ali
  »ali«), prevedeni iz TeX brez izgube (`\pm`, indeksi, besedilo, funkcije f(5) ostanejo zunaj), gredo skozi ukaz
  SymPy `korak` (PV-06). Formule v vrstici, povezane z »ali«, in zaporedni kandidati `x = 9`, `x = -3` so ena trditev;
  rešena oblika ni začetek koraka (za njo pridejo kandidati, preizkus ali pogoji); celoštevilski `n`, `k` izpustimo.
  Identiteta ob enačbi (razširjen kvadrat) in par dveh »enačb« brez rešitve nista korak (sicer bi ∅ = ∅ potrdil dve
  napačni identiteti). Korak z izgubljeno posamezno rešitvijo (a² = 289 → a = 17 pri dolžini) je brez statusa in
  naštet v poročilu: pravilen je, če rešitev izloči kontekst, ki ga ukaz ne vidi; izgubljen interval je napaka;
- **odgovor**: ali je odgovor naloge (v pasu decimalk odgovora) končna vrednost katere od relacij v rešitvi. To je
  skladnost prikaza, ne neodvisen preračun: brez ujemanja trditev ostane brez statusa, ne napaka, in v status
  generatorja ne šteje (poročilo ga navede posebej).

Status generatorja je najšibkejši člen (`statusOdgovora`) trditev »račun« in »korak« v vzorcu. Neodvisnega preračuna
odgovora iz podatkov in obrazca s SymPy ni: obrazci generatorjev so zapisani za učenca (besedilo, mešane enote), ne za
stroj.

Izhodišče `docs/meritve/generatorji-2026-11-26.md` (5 semen): od 704 generatorjev jih ima 12 status numerično, 454
delno, 3 napako, 235 nobenega (večinoma izbirni odgovori in besedilne rešitve). SymPy je potrdil 301 od 305 korakov
simbolno, 4 imajo izgubljeno posamezno rešitev v kontekstu (koncentracija), nobeden ni napačen. Vseh 7 zaznanih napak
je pregledal model AI (ne človek): dve sta pravi napaki zapisa (`dod-fiz-ss-plinska-enacba`: tlak, zaokrožen na eno
decimalko, ne da zapisanega rezultata; `exk-mole`: levi strani manjka ×10²³), popravljeni v #1166 (poročilo je izdelano na commitu pred popravkom); tretja je
lažni alarm preračuna (`\text{…}` kot enota, AUDIT-087). Drugi model AI je ročno preračunal 60 nalog 30 naključnih
generatorjev brez zaznane napake: 0/30 zgrešenih napak (95 % interval 0–11 %); 3/30 imajo zaokroženo vrednost za »=«
(PV-07).

## Status nalog na polah (PV-11)

`node scripts/status-pol.mjs [--pola NPZ9-MAT] [--json p.json] [--porocilo p.md] [--dodatek f.md] [--strogo]` (brez
modela AI, s SymPy nekaj minut) da status vsaki nalogi naših pol mature, poklicne mature in NPZ (`content/exam-papers`,
31 datotek z 41 izpitnimi polami). Za vsak del naloge vzame odgovor, točkovnik, vse poti rešitve in pravilno izbiro
(`mistake` in napačne izbire so namerno napačne in niso trditve) ter preveri dve vrsti trditev:

- **račun**: formula z relacijo, kot v popisu PV-04;
- **korak**: v poteh rešitve isti izbor kot pri generatorjih (PV-10) in še verige v besedilu: kosi ene formule, ločeni z
  »⇒«, ter zaporedni formuli, med katerima je le veznik »torej«, »sledi«, »zato«, »od tod«, »dobimo« (»oziroma« ni
  veznik, pogosto pomeni »po vrsti«). »In« veže le enačbi sredi izpeljave (»…, torej $5x^2 = 180$ in $x^2 = 36$«); na
  začetku je seznam ali sistem (»enačbe $A$, $B$ in $C$«), pri neenačbah hkratni pogoji. Sklep po pogojih, povezanih z
  »in«, ni korak, ker ne sledi le iz zadnjega pogoja. Zaporedni enačbi ali neenačbi z isto neznanko, povezani z »ali«,
  sta ena trditev.

Korak, katerega prva formula nima realne rešitve (x² + 6x + 34 = 0, tudi v obliki »ali« in pri neenačbi), je brez
statusa: iz prazne množice sledi vsaka formula, zato bi ga ukaz potrdil ne glede na drugo stran (velja tudi za
generatorje, `vrstaKoraka`). Par, kjer sta obe formuli brez rešitve, ni korak in ni štet. Protislovje, ki preide v
identiteto, ostane korak in ga ukaz označi za napako. Posledica (korak, ki doda rešitev, npr. kvadriranje) šteje za
pravilen korak.

Status naloge je najšibkejši člen. Vsako število v končnem odgovoru dela mora biti rezultat (desna stran zadnje
relacije) katere od preverjenih trditev dela, sicer dobi del trditev »odgovor« brez statusa. Odgovor z izbirno črko, z
opisom zunaj formul (več kot dve besedi ali besedilo pred formulo) ali brez števila ni preverjen, tudi če so vmesni
računi pravilni; števila v indeksih, eksponentih in `\mathrm{}` (C₆H₁₂) ne štejejo. Zato »numerično« pomeni, da je
preverjen tudi odgovor vsakega dela.

Zaznavanje napak meri skript sam: vsak potrjen korak pokvari dvakrat (zadnje celo število v drugi formuli koraka in
posebej v prvi + 1, `mutiraj`) in prešteje ujete in napačno potrjene; `--strogo` pade, če je katera vstavljena napaka
potrjena ali SymPy ni odgovoril. Izhodišče `docs/meritve/pole-2026-11-26.md`: od 626 nalog jih ima 2 status
numerično, 398 delno, 0 napako in 226 nobenega (besedilne rešitve, biologija, izbire); SymPy je potrdil 160 od 162
korakov, 2 imata izgubljeno posamezno rešitev v kontekstu; vstavljenih napak 320/320 ujetih, 0 potrjenih. Poročilo ima
vrstico za vsako nalogo (oznaka: pola, sklop, številka). Dva neodvisna pregledovalca (modela AI, ne človek) sta ročno
preverila 152 parov korakov iz besedila in vzorec 40 potrjenih korakov in 40 potrjenih računov: 0/80 napačno
potrjenih (95 % interval 0–4,6 %).

## Enote in zaokroževanje (PV-07)

`node scripts/enote-generatorjev.mjs [--semena 5] [--predpona dod-fiz] [--json p.json] [--porocilo p.md] [--dodatek f.md]
[--strogo]` (brez modela AI, s SymPy okoli 5 s za 5 semen) preveri v generatorjih nalog z enotami dve stvari:

- **enote**: vsaka formula naloge (`t.formula`) mora biti dimenzijsko pravilna, ko količine nadomestimo z enotami iz
  podatkov (`t.data.given`; le enota, brez vrednosti, vsaka količina s svojim faktorjem e^(1/p), da se člen ne izbriše
  ali odšteje), iskano količino pa z enoto odgovora. Novi ukaz SymPy `dim` (`server/cas/worker.py`) izračuna
  dimenzijo vsakega dela enačbe; napaka je različna dimenzija, seštevanje količin različnih dimenzij ali argument
  sin/cos/exp z dimenzijo (logaritem sme imeti argument z enoto: pH = −log c). Formula, katere deli so vsi brez
  dimenzije (koti, odstotki, verjetnosti), ostane brez statusa, ker dimenzija o njej ne pove ničesar. Pretvorbe brez
  količin ($1\ \mathrm{km} = 1000\ \mathrm{m}$) preveri ukaz `units` tudi po vrednosti; pretvorba s °C je brez statusa.
  Vmesna količina dobi enoto iz svoje definicije ($\omega = 2\pi\nu$); taka formula je definicija, ne preverjanje, in
  ostane brez statusa, formula, ki to enoto uporabi (tudi različica F_max), pa je največ »delno«. Primerjava samih
  količin, kjer je enota ene iz imena druge (F = F_{tr}), je brez statusa. Brez statusa ostanejo tudi: število brez enote
  ob količini ($T = t + 273$), relativna atomska masa (dogovor $M = M_r \cdot \mathrm{g/mol}$), konstanta ravnotežja brez
  enote, formule z besedilom ali absolutno vrednostjo in količine, ki jih podatki ne naštejejo. Privzete konstante so le
  $g$, $N_A$, $k_B$, $\varepsilon_0$, $\mu_0$ (R, h, G, c so v nalogah pogosto upor, višina, nukleotid, koncentracija);
- **zaokroževanje**: število decimalk, ki ga zahteva besedilo (zadnje navodilo: »Zaokroži na …«, »na cente«, »round to 2
  decimal places«, »nearest tenth«; »zapiši na dve decimalki« le, če ni navodila z »zaokroži«), mora biti enako decimalkam odgovora, po katerih se ocenjuje.
  »Na centimeter« ostane brez statusa, ker je odvisno od enote odgovora.

Nabor z znano resnico `test/fixtures/preverjanje/enote-v1.json` (40 parov formul in 10 parov pretvorb, sestavil isti
avtor): ujetih 50/50, lažnih alarmov 0/50. Slepi nabor `enote-slepi-v1.json` (72 parov, sestavil drug model AI le iz
opisa vmesnika): prva meritev 69/72 ujetih, 0/72 napačno potrjenih, 0/72 lažnih alarmov; po popravkih pregleda 70/72.
Izhodišče `docs/meritve/enote-2026-11-26.md` (5 semen, 421 generatorjev z enotami): preverjenih je 1.039 od 5.323 formul
(19,5 %; fizika 34 %), napaka v 1 generatorju (izkustvena formula iz besedila naloge, dogovor), zaokroževanje skladno
pri 3.204 od 3.205 nalog z zahtevo. Dve formuli s številom brez enote, ki ju je našel prvi popis, sta popravljeni v #1171.
Kodo in rezultate sta pregledala dva neodvisna modela AI (ne človek); ugotovitve in popravki so v
`docs/meritve/enote-2026-11-26-pregled.md`.

## Meritev (PV-02, N-01)

Prvi referenčni nabor `test/fixtures/preverjanje/nabor-v1.json` (384 trditev, 191 pravilnih; od N-01 začetek nabora v2) ustvari
`node scripts/nabor-preverjanje.mjs` iz fiksnega semena (vedno enaka datoteka). Resnica je znana iz konstrukcije
(enačbe iz izbranih ničel, korenske in logaritemske enačbe iz izbrane veljavne in tuje rešitve, neenačbe iz izbranih
krajišč, znani odvodi, integrali in računi), ne iz preverjevalnikov Evklida; drugi pregledovalec je vse oznake
neodvisno preveril s SymPy. Skupine: polinomske enačbe, iracionalne ničle, zaokroženi približki, luknje racionalnih
enačb, korenske enačbe, neenačbe, identitete, odvodi, integrali, računi, limite, enote, periodične rešitve, velika
števila, »skoraj« (napake tik ob meji tolerance: veliki koeficienti, znanstveni zapis, »≈«, napačno zaokroženo,
odrezano namesto zaokroženo, bližnji ulomki, velika števila) in »druge« (logaritemske, eksponentne, z absolutno
vrednostjo, racionalne neenačbe, »ni rešitve«, kompleksni rešitvi kot realni, napačna perioda). Pravilen zaokrožen
odgovor ima mejo `najvec: "numericno"`.

Dogovora: rešitve so realne (kompleksni rešitvi pri realni enačbi sta napaka); identiteta, kot je
`(x^2-4)/(x-2) = x+2`, šteje kot pravilna poenostavitev (izključeno točko preverja skupina »luknja«).

`node scripts/meri-preverjanje.mjs [--json pot] [--porocilo pot.md] [--prej pot.json] [--nabor pot]` (privzeto nabor v2) izmeri tri motorje: `sympy` (izid workerja z načinom `how`), `skener`
(`verifyAiFull`, kot ga vidi učenec) in `skener-lokalno` (isto brez SymPy). Razredi: napačno potrjena, previsok
status, lažni alarm, napačna s šibkim statusom (učenec vidi »delno« ali »numerično«), izjema, ujeta napaka, potrjena,
šibkejši status, nepreverjena. `test/preverjanje-meritev.test.js` (CI ima SymPy prek `npm ci`, postinstall) pade ob
vsaki novi napačni potrditvi, previsokem statusu, lažnem alarmu ali izjemi in kadar motor ujame ali potrdi manj kot
ob izhodišču. Limite in enote (v v2 81 trditev) nimajo oblike rešitve skenerja, zato jih meri samo surov SymPy.

Izhodišče 25. 11. 2026:

| Motor | Trditev | Napačno potrjene | Ujete napake | Napačne s šibkim statusom | Lažni alarmi | Pravilne potrjene |
| --- | --- | --- | --- | --- | --- | --- |
| sympy (surovo) | 384 | 5 | 187/193 | 0 | 0 | 179/191 (+12 previsoko) |
| sympy z načinom (PV-03) | 384 | 0 | 187/193 | 5 | 0 | 173/191 |
| skener | 363 | **4** | 178/182 | 0 | 5 | 153/181 (+1 previsoko) |
| skener-lokalno | 363 | 0 | 172/182 | 5 | 8 | 101/181 |
| skener po popravku | 363 | 0 | 178/182 | 0 | 5 | 154/181 |
| skener s PV-03 | 363 | 0 | 178/182 | 0 | 5 | 154/181 |
| skener-lokalno po popravku | 363 | 0 | 173/182 | 4 | 7 | 106/181 |

0 napačno potrjenih na tem naboru pomeni pri 95-odstotnem zaupanju delež pod približno 3/n (n = število napačnih
trditev) in velja samo za vrste napak v naboru.

Ugotovitve:

- **Skener: 4 napačno potrjene trditve (»Preverjeno« pri napačnem odgovoru).** Identiteta in odvod z velikimi
  koeficienti, napačnimi za 1 (`(x+1000000)^2` = `x^2+1999999*x+10^12`): `is_zero` v `server/cas/worker.py` šteje
  točko za ničlo, ko je |razlika| ≤ 10⁻⁹ · največji člen (≈ 10¹²), in vrne `ok: true`. Ničla v znanstvenem zapisu
  z napačno mantiso (`2*10^6` namesto 2,4·10⁶, `1e6` namesto 1,4·10⁶): `decimals_tol` da toleranco pol enote zadnjega
  mesta mantise (5·10⁵). Pri treh od štirih je lokalna točna algebra pravilno rekla »napaka«, a `verifyAiFull` je
  dal prednost SymPy. **Popravljeno:** točen lokalni protiprimer (`verifyAi` vrne `exact: true`) SymPy ne preglasi,
  skener pokaže »Nepreverjeno«; odvod polinoma `verify.js` preveri točno (ulomki); zapis `1.4e6` se lokalno prebere kot
  1,4·10⁶ (prej kot 1,4·e·6). **Ostane odprto:** popravek velja le za polinome. Napačen odgovor z velikimi koeficienti
  v nepolinomskem izrazu (npr. `(x+1000000)^2 + sin(x)` ali `e*(x+1000000)^3` za odvod) še dobi »Preverjeno«, ker
  vzroka v `is_zero` (relativna toleranca glede na največji člen) ni popravil. **PV-03:** worker zdaj pove, da je
  odločil v točkah (`how: "sampled"`), zato skener tam pokaže največ »Numerično preverjeno«.
- Skener: »≈1414« (zaokroženo na celo število) je dobil »Preverjeno«, ker je regex `rounded` v `verifyAiFull`
  prepoznal le decimalno piko. **Popravljeno:** »≈«, »approx« in znanstveni zapis (2e6, 2*10^6) so približek.
- Odprto, skener: pravilen določeni integral z mejo iz več znakov (`∫_0^pi sin(x) dx = 2`, `∫_1^10 1/x dx = ln(10)`) dobi
  »Zaznana napaka«, ker `public/scan/verify.js` mejo prebere le do prvega znaka. Zaokrožen račun (`1/3+1/7 ≈ 0.476`,
  `sqrt(2) ≈ 1.414`) dobi »Zaznana napaka«, ker skener račun pošlje v `equal` (točno), ne v `value`.
- Odprto, skener brez SymPy: luknja brez rešitev (`(x^2-1)/(x-1)=2`) dobi »Zaznana napaka«; štirje napačni
  odgovori dobijo šibek pozitiven status: trije periodični in napačna periodična rešitev s predolgo periodo
  »Delno preverjeno«.
- Surov SymPy: zaokrožene decimalke sprejme s toleranco (`decimals_tol`) in vrne `ok: true` (12 previsokih
  statusov); zmnožek velikih števil v zapisu `1.2193263111263526*10^17` (napaka 9) sprejme, ker `value` računa s
  plavajočo vejico. **PV-03:** vsi ti odgovori imajo `how` ≠ `symbolic`, zato so največ `numericno`; surov SymPy z
  načinom nima nobene napačno potrjene trditve in nobenega previsokega statusa, pet napačnih pa dobi `numericno`.
- Cena PV-03 v pokritosti: pravilne periodične rešitve (`sin x = 0` → `kπ`, `cos x = 0` → `π/2 + kπ`, 6 trditev)
  so zdaj `numericno`, ker worker popolnost preveri samo na [−20, 20]. Simbolni dokaz popolnosti ostaja odprt.
  Identitete, ki jih `simplify` sam ne najde (tan + cot, koren popolnega kvadrata, odvod |x| in ln|x|, točna rešitev
  eksponentne enačbe), po pregledu ostanejo `izracunano` (trije dodatni simbolni prepisi v `is_zero`).

### Nabor v2 (N-01)

`test/fixtures/preverjanje/nabor-v2.json` (1.020 trditev, 508 pravilnih, 512 napačnih ali robnih) je glavni nabor
meritve in testa; prvih 384 trditev je nespremenjen v1 (test to preveri). Nove družine: eksponentne in logaritemske
enačbe (tudi tuja rešitev zunaj definicijskega območja), absolutna vrednost (tudi negativna desna stran), sistemi
2 × 2 in 3 × 3 (tudi protislovni), trigonometrijske identitete, generirani odvodi (verižno pravilo, produkt, kvocient),
nedoločeni in določeni integrali (točna vrednost z ulomki), limite, računi (delno korenjenje, negativni eksponent,
odstotki, vrstni red operacij, deljenje ulomkov, večmestni zmnožki, logaritmi, neokrajšani ulomki), racionalne in
absolutne neenačbe, enote, enakovredne oblike pravilnih odgovorov (pravilni, ki ne smejo dobiti alarma) ter
zaporedja in kombinatorika. Ponovljene trditve generator izpusti (zato ima kakšna trditev brez para). Enačbe novih
družin imajo `resnica`; generator se ustavi, če je napačen odgovor enak resnici ali pravilen različen od nje.

Pričakovano oceno vseh 636 novih trditev so pred prvim zagonom preverjevalnikov določili trije neodvisni pregledovalci
na slepo (ločeni agenti AI, ne človeški strokovnjaki; premešan seznam brez oznak, brez kode Evklida in brez SymPy,
le ročno in s celimi števili). Ujemanje s
konstrukcijo: 633 od 636. Razhajanja: `racun2-062` je pregledovalčeva napaka (5/5 + 5/5 = 2, odgovor 10/10 = 1 je
napačen); `racun2-084` in `racun2-108` sta bili napaki nabora (zapis `-2^n` je −(2ⁿ), mišljeno je (−2)ⁿ), popravljeni
z oklepajem.

Izhodišče 26. 11. 2026 (po PV-03):

| Motor | Trditev | Napačno potrjene | Ujete napake | Napačne s šibkim statusom | Lažni alarmi | Pravilne potrjene |
| --- | --- | --- | --- | --- | --- | --- |
| sympy z načinom | 1.020 | **0** | 504/512 | 5 | 0 | 484/508 |
| skener | 939 | **0** | 467/471 | 0 | 16 | 406/468 |
| skener-lokalno | 939 | **0** | 462/471 | 4 | 49 | 170/468 |

Po popravku lažnih alarmov skenerja (spodaj):

| Motor | Trditev | Napačno potrjene | Ujete napake | Napačne s šibkim statusom | Lažni alarmi | Pravilne potrjene |
| --- | --- | --- | --- | --- | --- | --- |
| skener | 939 | **0** | 467/471 | 0 | **0** | 417/468 |
| skener-lokalno | 939 | **0** | 462/471 | 4 | 40 | 170/468 |

0 napačno potrjenih na 512 napačnih trditvah pomeni pri 95-odstotnem zaupanju delež pod približno 0,6 % za vrste napak
v naboru.

Popravljeno (lažni alarmi skenerja, `test/scan-lazni-alarmi.test.js`):

- `prep()` v `public/scan/solvecore.js` je uvodno besedo (»reši«, »factor« …) odrezal brez meje besede, zato je iz
  `factorial(14)` nastal `ial(14)` in »Factorise x^2-4« je ostal `ise x^2-4`. Zdaj le cela beseda, »factorise« in
  »factorize« sta ukaza.
- Določeni integral: meji `∫_0^pi` in `∫_1^10` sta se prebrali kot `p` in `1`. Meja je zdaj v oklepaju, zavitem
  oklepaju ali cel žeton.
- Račun z zaokroženim decimalnim rezultatom (1/3 = 0.33, √2 = 1.414): lokalno in s SymPy (`value` namesto `equal`)
  je »Numerično preverjeno« v mejah pol zadnjega mesta, ne »Zaznana napaka«. Le pri golem decimalnem številu z vsaj
  dvema števkama, točni vrednosti brez kratkega decimalnega zapisa (1/2 + 1/4 = »0.8« ostane napaka) in toleranci, ki
  jo plavajoča vejica in relativna rezerva workerja ne prekrijeta (15240740602.07 ostane napaka;
  `verify.js zaokrozenRacun`).
- Enačba z odpravljivo vrzeljo ((x² − 1)/(x + 1) = −2): iskanje ničel je točko vrzeli štelo za manjkajočo rešitev.
  Hkrati je iskanje zgrešilo rešitev tik ob polu, ki leži točno na mreži (1/(x − 1) = 1000 brez rešitve je dobil
  »Numerično preverjeno«); okoli takih polov so zdaj dodatne točke.
- Odvod hitro nihajoče funkcije (cos(x⁶)): numerični odvod s petimi točkami in Richardsonovo ekstrapolacijo.

Ostaja:

- SymPy `equal` bere decimalke kot 53-bitna števila, zato pravilen velik decimalni rezultat (12345678.9 · 1234.5 =
  15240740602.05) dobi »Zaznana napaka« (s SymPy; lokalno »Preverjeno«). Bilo je že prej; popravek v workerju
  (decimalke kot ulomki, kot `_z_ulomki`) je naslednji korak.

- Skener brez SymPy: `log(u, a)` z osnovo (20 trditev), `binomial(n, k)` (9) in `factorial(n)` (11) dobijo
  »Zaznana napaka«, ker jih kalkulatorjev razčlenjevalnik (`public/graph/math.js`, profil B) ne pozna. Skenerjev
  zapis (`log_3(x-2)`, `nCr(n,k)`, `n!`) lokalno deluje; s SymPy so vse pravilne.
- Skener: pravilni nedoločeni in določeni integrali dobijo največ »Numerično preverjeno« (lokalno numerično, SymPy pri
  integralu skenerja ni vključen).
- SymPy: enota `minute` je neznana (`45*minute`, 4 trditve ostanejo nepreverjene; `min` deluje, zato je to bolj
  izbira zapisa v naboru); točni decimalni odgovori z enotami
  (`0.025*m^2`, `0.5*kg`) so `numericno`.
- Generator: `binomial(10,3)` brez presledka worker prebere kot `binomial(10.3)` (decimalna vejica), zato nabor piše
  `binomial(10, 3)`.

## Dnevna meritev (PV-05)

`.github/workflows/meritev-preverjanja.yml` vsak dan ob 3.41 UTC (in ročno) na `main` požene meritev z SymPy in
`--strogo`, brez modela AI in brez stroška. Poročilo po predlogi `docs/meritve/README.md` (povzetek zagona in artefakt
»meritev-preverjanja«, 90 dni) ima za vsak motor merila kot k/n z imenovalcem in Wilsonovim 95-% intervalom:

| Merilo | Imenovalec | Cilj |
| --- | --- | --- |
| napačno potrjene (»izračunano« ali »dokazano«) | napačne trditve | 0 |
| status nad upravičenim | trditve z mejo `najvec` | 0 |
| napačne s šibkim statusom (»numerično«, »delno«) | napačne trditve | čim manj |
| zaznane napake | napačne trditve | čim več |
| lažni alarmi | pravilne trditve | 0 |
| pravilne potrjene (»izračunano« ali »dokazano«) | pravilne trditve | čim več |
| pravilne s šibkim statusom (»numerično«, »delno«) | pravilne trditve | čim manj |
| nepreverjene (in »v teku«) | trditve, ki jih motor oceni | čim manj |
| pokritost: dokončna ocena (pravilna potrjena ali napaka zaznana) | trditve, ki jih motor oceni | čim več |
| izjeme preverjevalnika | trditve, ki jih motor oceni | 0 |

Poleg tega poročilo prešteje trditve, ki imajo obliko za motor (štetje celote, ne vzorec, brez intervala: lastnost
nabora, ne motorja), in zahteve SymPy brez odgovora. Pokritost trditev po delih aplikacije meri PV-04. Intervali
predpostavljajo neodvisne trditve; ker trditve nastanejo v družinah predlog, ki pogosto uspejo ali padejo skupaj, so
preozki (poročilo to navede pod omejitvami). Stolpec »Prej« je zadnja meritev v repozitoriju
(`docs/meritve/preverjanje-<datum>.json`, le na istih trditvah: sha256 trditev brez opisa); slabše merilo je opozorilo
v povzetku zagona. Rdeč zagon in zadeva »Dnevna meritev preverjanja ne gre skozi« (odpre, dopolni, ob zelenem zapre):
napačno potrjena trditev, status nad upravičenim, izjema, motor, ki ni tekel (npr. SymPy ni nameščen), ali vsaj ena
zahteva SymPy brez odgovora (rok, sesutje; `casIzpadi()` v `server/cas.js`), ker bi statusi tiho padli na lokalno
preverjanje (preizkus: SymPy, ki se sesuje sredi meritve, da skenerju 40 lažnih alarmov in zelen zagon brez tega
pravila). Ob spremembi trditev nabora nova meritev v `docs/meritve` (test `test/preverjanje-porocilo.test.js` pade
brez nje). Izhodišče: `docs/meritve/preverjanje-2026-11-26.md`.

## Popis pokritosti (PV-04)

`node scripts/popis-pokritosti.mjs [--json p.json] [--porocilo p.md] [--brez-sympy] [--strogo] [--dodatek f.md]`
(skripta ne kliče modela AI; z SymPy okoli 40 s, brez njega 6 s) za vsako od 19 mest iz načrta PV pove, ali trditve
tam dobijo status. Za vnaprej znano vsebino (razlaga lekcij, »Preveri se«, rešeni primeri, bloki RACUN, pole z
rešitvami in točkovniki, rešitve generatorjev na ravneh 1–3 s semenom 1, tekmovalne naloge, fakultetne lekcije)
zašteje formule z relacijo in status, ki ga dajo obstoječi preverjevalniki, uporabljeni na vsaki formuli posebej:
preračun `server/lesson-math.js` (numerično, delno, napaka), preizkus identitet z naključnimi števili
`server/lesson-identity.js` (le potrditev: numerično), za RACUN SymPy z načinom ali kemijski preizkus. Ostale so
nepreverjene. Namerno napačne trditve (»Pogoste napake«, napačne možnosti in njihova pojasnila ~ v »Preveri se«,
`mistake` in napačne izbire na polah) in vprašanja (?) so izločeni in našteti posebej. Stolpec »Preverjanje danes«
pove, kaj od tega preračuna CI ob vsaki spremembi (koraki rešitev generatorjev in računi v »Preveri se«
ne) in kaj preverijo mesta, kjer trditve nastanejo ob uporabi (inštruktor, kalkulatorji, skener …). Štetje
celote, ne vzorec, zato brez intervala. `--strogo` vrne napako, če SymPy ni tekel ali ni odgovoril na zahtevo.

Izhodišče `docs/meritve/pokritost-2026-11-26.md`: v vsebini, ki jo učenec vidi, je 11.615 od 85.362 formul z relacijo
(13,6 %) v celoti preračunanih, 10.221 (12,0 %) delno, 63.517 (74,4 %) brez statusa; razlaga lekcij 16,2 %, fakultetne
lekcije 8,3 % v celoti. Strojni bloki RACUN, ki ponovijo rezultate lekcij, so ločeni: 5.623 od 5.626. Vseh 9 zaznanih
»napak« je pregledal model AI (ne človek): nobena ni napačen rezultat (napačen preračun lesson-math, AUDIT-087;
zapisi, ki jih preračun ne pozna; trije nenatančni zapisi v naših generatorjih, popravek v ločenem PR #1160). Višji
delež je boljši; formula brez statusa ni napačna, le noben program je ne preveri.

## Odpoved preverjevalnikov (K-04)

Ob izpadu preverjevalnika status nobene trditve ne sme biti višji, kot ga dovoljujejo preostali dokazi.
`test/odpoved-preverjevalnikov.test.js` to preveri na vseh 939 trditvah nabora v2, ki jih zna skener:

| Izpad | Kako ga test povzroči | Pričakovano |
| --- | --- | --- |
| SymPy izklopljen | `EVKLID_CAS=0` | status vsake trditve enak kot brez SymPy (skener-lokalno) |
| SymPy manjka | `EVKLID_PYTHON` kaže na neobstoječ program | isto |
| SymPy se sesuje | lažni worker ob vsaki zahtevi konča (`test/fixtures/odpoved/sesutje.sh`) | isto |
| SymPy se zatika | lažni worker ne odgovori, rok 25 ms (`rok.sh`) | isto |
| SymPy izpisuje nesmisel | ne JSON in napačen id (`smeti.sh`) | isto |
| Lean | ni mape z dokazi, dokaz zastarel ali brez izrekov | nobena lekcija ni »Formalno dokazano« |
| Model | reševanje vrne 529; ponovitev pade po prvem poskusu | brez rešitve ni statusa; status prvega poskusa ostane izid kode |

V vseh izpadih SymPy je napačno potrjenih 0 in nobena trditev ni »dokazano«. Kontrola: lažni worker, ki vse potrdi
(`lazniv.sh`), spremeni status več kot 100 trditvam, zato primerjava res meri. (Pokvarjen, a delujoč SymPy, ki vse
potrdi, ni izpad: pred njim varujeta testi workerja in točna lokalna algebra, ki ima pri ovržbi prednost.)

`/healthz/stanje` → `preverjevalniki` pove, kateri ne dela (`nedelujejo`: `sympy`, `lean`, `model`). SymPy ne dela,
ko je izklopljen, zagon ni uspel ali je bilo vsaj 3 zahteve zapored brez odgovora (`neuspesnih`, `razlog`: rok ali
sesutje); ena prepočasna naloga ni izpad. Lean ne teče na strežniku: »ne dela« pomeni, da ni nobenega dokaza lekcije.
Straža (`scripts/straza.mjs`) ostaja pri `cas.deluje`.

## Pravilo za nove dele aplikacije

Vsak nov del aplikacije, ki prikaže matematično trditev, jo odda v zapisu trditve in prikaže status iz
`statusi.js`; svojega pomena besede »preverjeno« ne uvaja. Pregledovalec (`docs/pregled.md`, prehod 2) to preveri.

## Oznake vsebine (N-03, `server/oznake-vsebine.js`)

Lekcije učbenika in naše pole imajo oznako izvora in pregleda celote, ločeno od statusa posamezne trditve:

| Oznaka | Dokaz v podatkih |
|---|---|
| Osnutek | pregledi niso končani ali program v besedilu najde napako |
| Pregledal AI | pregledi AI končani, program nima česa preračunati |
| Strojno preverjeno | pregledi AI končani in program ob prikazu preračuna vsaj en račun ali identiteto brez napake (`server/lesson-check.js`, pri polah `validatePaper`) |
| Strokovno pregledano | `stanje: pregledano`, `pregledal:` ime človeka, `pregledano:` datum, ki ni v prihodnosti |
| Formalno dokazano: N | dokaz Lean z glavo `vir:` in `sha256:`, ki se ujema s trenutnim besedilom; vedno s številom N dokazanih trditev |

»Strojno preverjeno« lekcije ni status `izracunano` njenih trditev: pomeni le, da program ni našel napake v računih,
ki jih zna preračunati. Ko PV-08 lekcije pretvori v trditve s statusi, oznaka »Strojno preverjeno« dodatno zahteva, da
nobena trditev nima statusa `napaka`. Oznako izriše samo `public/oznake-vsebine.js`; neznane oznake se ne izrišejo.
