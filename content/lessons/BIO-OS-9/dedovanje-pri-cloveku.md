---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Luka in njegova sestra Ana snemata pesem. Na mešalni mizi lučka sveti zeleno, ko je glasnost prava, in rdeče, ko je preglasno. Ana razliko vidi takoj, Luka nikoli. Luka je barvno slep za rdečo in zeleno barvo, tako kot njun dedek po mamini strani. Mama vidi barve povsem normalno.

Sosedov pradedek je igral kitaro v plesnem orkestru. Ko si je ob padcu z odra urezal roko, rana ni nehala krvaveti. Imel je **hemofilijo**, bolezen, pri kateri se kri ne strjuje dovolj. Hemofilijo je imel tudi njegov vnuk, ženske v družini pa nikoli.

Na prvi pogled nimata nič skupnega: ena zadeva oči, druga kri. A obe se skoraj vedno pokažeta pri moških in obe skočita čez mamo. Za obema se skriva isto pravilo. Z njim boš znal brati družinska drevesa in slike kromosomov.

## Razlaga

**Napačna ideja 1: »Za vsako lastnost je en gen. Nekateri imajo gen za glasbo, drugi ne.«** Za večino lastnosti ne drži. Iz prejšnje lekcije poznaš dedovanje z enim genom in dvema aleloma: lastnost ima le nekaj jasno ločenih oblik. Pri človeku so takšne barvna slepota, hemofilija, krvne skupine AB0 (en gen s tremi aleli: A, B in 0) in ena oblika prirojene gluhote.

Telesna višina, barva kože ali glasbena nadarjenost pa nimajo dveh ali treh oblik. Ljudje so lahko visoki $150\,\mathrm{cm}$, $163\,\mathrm{cm}$, $178\,\mathrm{cm}$ in vse vmes. Take lastnosti so **lastnosti več genov**: vsak gen prispeva malo, zraven pa močno vpliva okolje. Pri višini je to prehrana, pri glasbi vadba.

| Lastnost | Koliko genov | Okolje |
|---|---|---|
| barvna slepota | en gen | skoraj nič |
| krvna skupina | en gen | nič |
| telesna višina | veliko genov | prehrana, bolezni |
| glasbena nadarjenost | veliko genov | vadba, učitelj |

Popravek: »gena za glasbo« ni. Je veliko genov, ki malo prispevajo, in še več ur vaje.

**Napačna ideja 2: »Kar imajo skoraj samo moški, je zapisano na kromosomu Y.«** Spomni se: človek ima $23$ parov kromosomov. $22$ parov je enakih pri obeh spolih; to so **telesni kromosomi**. Triindvajseti par so **spolni kromosomi**: ženska ima $XX$, moški $XY$. Kromosom $X$ je velik in nosi veliko genov. Kromosom $Y$ je majhen in nosi le malo genov, med njimi tistega, ki zarodek usmeri v razvoj dečka.

Gen za zaznavanje rdeče in zelene barve ter gen za beljakovino, potrebno za strjevanje krvi, sta na kromosomu $X$, ne na $Y$. Alela zapišemo kot $X^B$ (normalen vid) in $X^b$ (barvna slepota): črka zgoraj pove, kateri alel nosi ta kromosom $X$. Alel $X^b$ je recesiven. Pri hemofiliji enako pišemo $X^H$ (normalno strjevanje) in $X^h$ (hemofilija).

- Moški ima en sam $X$. Če nosi $X^b$, je barvno slep, saj drugega $X$, ki bi ga prekril, nima.
- Ženska ima dva $X$. Z genotipom $X^B X^b$ vidi normalno, a alel lahko preda otrokom. Taki ženski rečemo **prenašalka**. Barvno slepa je le, če ima $X^b X^b$.

Sin dobi od očeta $Y$, od matere $X$. Zato sin barvno slepoto ali hemofilijo vedno podeduje po materi. Barvno slepih je približno $8$ od $100$ moških in manj kot $1$ od $100$ žensk. Hemofilija je mnogo redkejša.

:::premisli
Luka bo morda nekoč oče. Ali bo lahko svojo barvno slepoto predal sinu? In kaj bo predal hčeram?
---
Sinu ne: sin od očeta dobi $Y$, ne $X$. Vsaka hči pa od očeta dobi njegov edini $X$, torej $X^b$. Če ima od mame $X^B$, je prenašalka.
:::

V simulaciji spodaj (»Barvna slepota (kromosom X)«) izberi mamo prenašalko in očeta z normalnim vidom. Opazuj: barvno slepi so lahko le sinovi, in sicer polovica; hčere vidijo normalno, polovica pa je prenašalk.

**Napačna ideja 3: »Če lastnosti nimata starša, je ne more imeti otrok.«** Pri recesivni lastnosti lahko. To najlaže vidimo v **rodovniku**, družinskem drevesu z dogovorjenimi znaki: kvadrat je moški, krog ženska, poln znak oseba z lastnostjo, krog s piko prenašalka. Vodoravna črta poveže starša, navpična vodi do otrok. Lukova družina:

:::risba skica
opis: Rodovnik barvne slepote v treh rodovih. Zgoraj sta dedek, poln kvadrat, barvno slep, in babica, prazen krog, z normalnim vidom. Pod njima je njuna hči, mama, krog s piko, prenašalka. Mama in oče, prazen kvadrat z normalnim vidom, imata dva otroka: Luka, poln kvadrat, barvno slep, in Ana, prazen krog z normalnim vidom.
območje: 0; 1 .. 12,3; 8,6
enota: 25
pravokotnik: 3,4; 7,4 .. 4,2; 8,2 | modra polno
krog: 6,6; 7,8 | 0,4 | modra
črta: 4,2; 7,8 -> 6,2; 7,8
črta: 5,2; 7,8 -> 5,2; 5,3
napis: 3,2; 8,1 | dedek | levo
napis: 3,2; 7,5 | barvno slep | levo
napis: 7,2; 8,1 | babica | desno
napis: 7,2; 7,5 | normalen vid | desno
krog: 5,2; 4,9 | 0,4 | modra
krog: 5,2; 4,9 | 0,12 | modra polno
pravokotnik: 7,6; 4,5 .. 8,4; 5,3 | modra
črta: 5,6; 4,9 -> 7,6; 4,9
napis: 4,6; 5,2 | mama | levo
napis: 4,6; 4,6 | prenašalka | levo
napis: 8,6; 5,2 | oče | desno
napis: 8,6; 4,6 | normalen vid | desno
črta: 6,6; 4,9 -> 6,6; 3,4
črta: 5,2; 3,4 -> 8; 3,4
črta: 5,2; 3,4 -> 5,2; 2,4
črta: 8; 3,4 -> 8; 2,4
pravokotnik: 4,8; 1,6 .. 5,6; 2,4 | modra polno
krog: 8; 2 | 0,4 | modra
napis: 4,6; 2,3 | Luka | levo
napis: 4,6; 1,7 | barvno slep | levo
napis: 8,6; 2,3 | Ana | desno
napis: 8,6; 1,7 | normalen vid | desno
podnapis: Kvadrat je moški, krog ženska, poln znak barvno slep, krog s piko prenašalka.
:::

Dedek je hčeri dal svoj $X^b$, zato je mama prenašalka, čeprav vidi normalno. Mama ga je predala Luku. Lastnost je »preskočila« en rod.

**Napačna ideja 4: »Downov sindrom je dedna bolezen, ki jo prenaša recesivni alel.«** Pri Downovem sindromu ni napačen en alel, ampak je preveč celega kromosoma. Ugotovimo ga s **kromosomsko analizo**. V laboratoriju celice iz krvi (pri nerojenem otroku iz plodovnice) gojijo, delitev ustavijo, ko so kromosomi najbolj zviti, jih obarvajo in fotografirajo. Kromosome nato razvrstijo v pare po velikosti in preštejejo. Taki urejeni sliki rečemo **kariogram**.

Običajen kariogram ima $46$ kromosomov. Pri **Downovem sindromu** so kromosomi 21 trije namesto dveh, skupaj jih je $47$; temu rečemo **trisomija 21**. Nastane, ko se pri mejozi par kromosomov 21 ne razdeli: v spolno celico prideta oba, zato ima $24$ kromosomov namesto $23$. Po oploditvi z običajno spolno celico ima zarodek $24 + 23 = 47$ kromosomov. Taka napaka v mejozi je pogostejša pri starejših materah. Ljudje z Downovim sindromom se razvijajo počasneje in imajo pogosteje srčne napake; ob podpori se učijo, delajo in mnogi tudi muzicirajo.

:::premisli
Kaj pa, če pri mejozi v spolno celico ne pride noben kromosom 21? Koliko kromosomov bi imel zarodek po oploditvi z običajno celico?
---
Spolna celica bi imela $22$ kromosomov, zarodek $22 + 23 = 45$. Ker mu manjka cel kromosom z mnogimi geni, se tak zarodek navadno sploh ne razvije.
:::

## Rešeni primeri

### Primer 1: barvna slepota pri otrocih

Pianistka Maja je prenašalka barvne slepote, njen mož bobnar vidi barve normalno. Kolikšna je verjetnost, da bo njun sin barvno slep? In kolikšna, da bo barvno slep katerikoli njun otrok?

**Podatki:** mati $X^B X^b$ (prenašalka), oče $X^B Y$ (normalen vid)
**Iščemo:** verjetnost barvne slepote med sinovi in med vsemi otroki

:::formula
Punnettov kvadrat za $X^B X^b \times X^B Y$; verjetnost $P = \dfrac{k}{n}$ ($k$ ugodna polja, $n$ vsa obravnavana polja)
:::

**Rešitev:**

1. Mati naredi jajčeca z $X^B$ ali $X^b$, oče semenčice z $X^B$ ali $Y$.
2. Punnettov kvadrat:

|  | $X^B$ | $Y$ |
|---|---|---|
| $X^B$ | $X^B X^B$ | $X^B Y$ |
| $X^b$ | $X^B X^b$ | $X^b Y$ |

3. Sinova sta v desnem stolpcu ($Y$ od očeta). Od dveh polj je eno $X^b Y$: $P = \dfrac{1}{2} = 0{,}5$.
4. Hčere so v levem stolpcu. Nobena ni $X^b X^b$, ena od dveh pa je prenašalka.
5. Med vsemi štirimi polji je barvno slepo eno: $P = \dfrac{1}{4} = 0{,}25$.
6. Odgovor: sin bo barvno slep z verjetnostjo $50\,\%$, katerikoli otrok pa s $25\,\%$.

### Primer 2: oče s hemofilijo

Violinist ima hemofilijo, njegova žena ni prenašalka. Kakšni bodo njuni otroci?

**Podatki:** oče $X^h Y$ (hemofilija), mati $X^H X^H$ (zdrava, ni prenašalka)
**Iščemo:** genotipe in fenotipe sinov in hčera

:::formula
Sin dobi $X$ od matere in $Y$ od očeta; hči dobi $X$ od obeh staršev.
:::

**Rešitev:**

1. Mati ima le alel $X^H$, zato ga dobi vsak otrok.
2. Sinovi dobijo od očeta $Y$: vsi so $X^H Y$, torej zdravi.
3. Hčere dobijo od očeta njegov edini $X$, torej $X^h$: vse so $X^H X^h$.
4. Odgovor: vsi sinovi so zdravi in alela ne nosijo, vse hčere pa so zdrave prenašalke.

### Primer 3: gluh otrok slišečih staršev

Oba starša sta glasbenika in slišita normalno. Njun prvi otrok je od rojstva gluh. Ta oblika gluhote je recesivna lastnost na telesnem kromosomu: alel $g$ povzroči gluhoto, alel $G$ normalen sluh. Kakšna sta genotipa staršev? Kolikšna je verjetnost, da bo drugi otrok slišal?

**Podatki:** starša slišita (fenotip $G\_$, drugi alel neznan), prvi otrok gluh ($gg$); $G$ dominanten nad $g$
**Iščemo:** genotipa staršev in verjetnost $P$, da drugi otrok sliši

:::formula
Gluh otrok je $gg$: en $g$ ima od matere, enega od očeta. Nato Punnettov kvadrat $Gg \times Gg$ in $P = \dfrac{k}{n}$.
:::

**Rešitev:**

1. Otrok je $gg$, torej je vsak starš predal alel $g$.
2. Starša slišita, zato ima vsak tudi $G$. Oba sta heterozigota $Gg$.
3. Punnettov kvadrat $Gg \times Gg$ ima polja $GG$, $Gg$, $Gg$, $gg$.
4. Sliši otrok z vsaj enim $G$: tri polja od štirih, $P = \dfrac{3}{4} = 0{,}75$.
5. Prvi gluh otrok ne spremeni verjetnosti za drugega: vsaka oploditev je nova.
6. Odgovor: oba starša sta $Gg$; drugi otrok bo slišal z verjetnostjo $75\,\%$.

### Primer 4 – zdaj ti: kariogram

Laboratorij pregleda celice iz plodovnice. V kariogramu prešteje $47$ kromosomov, pri paru 21 so trije. Semenčica je imela običajnih $23$ kromosomov. Koliko kromosomov je imelo jajčece in za kaj gre?

**Podatki:** zarodek $n_z = 47$ kromosomov, trije kromosomi 21; semenčica $n_2 = 23$
**Iščemo:** število kromosomov v jajčecu $n_1$ in ime stanja

:::formula
$n_z = n_1 + n_2$
:::

**Rešitev:**

1. Običajno je $23 + 23 = 46$; tu je en kromosom preveč.
2. Dodatni je kromosom 21, ker so trije le pri tem paru.
3. Izračunaj $n_1$ sam in poimenuj stanje.

:::premisli
Koliko kromosomov je imelo jajčece in kako se stanje imenuje?
---
$n_1 = 47 - 23 = 24$. Jajčece je imelo dva kromosoma 21, ker se par pri mejozi ni razdelil. Zarodek ima trisomijo 21, to je Downov sindrom.
:::

## Pogoste napake

- **»Za glasbeni talent (ali višino) je en gen.«** Take lastnosti imajo vse vmesne stopnje, zato jih oblikuje veliko genov in okolje.
- **»Barvna slepota gre od očeta na sina.«** Sin od očeta dobi $Y$, gen pa je na $X$. Sin jo podeduje po materi. Oče jo preda hčeram, ki postanejo prenašalke.
- **»Ženska ne more biti barvno slepa.«** Lahko, če ima $X^b X^b$: oče je barvno slep, mati vsaj prenašalka. Zato je takih žensk malo, ne pa nič.
- **»Polovica sinov je isto kot polovica otrok.«** Pri materi prenašalki je barvno slepa polovica sinov, a le četrtina vseh otrok, ker hčere niso barvno slepe.
- **»Downov sindrom se deduje kot recesivni alel.«** Gre za odvečen kromosom 21, ki nastane zaradi napake pri mejozi. Starša imata navadno običajne kromosome.

## Povzetek

- Lastnosti enega gena imajo jasno ločene oblike (barvna slepota, hemofilija, krvne skupine AB0). Lastnosti več genov (višina, barva kože, glasbena nadarjenost) imajo vse vmesne stopnje in nanje močno vpliva okolje.
- Spolni kromosomi: ženska $XX$, moški $XY$. Gena za barvno slepoto in hemofilijo sta na $X$; alela, ki ju povzročita, sta recesivna.
- Moški z enim recesivnim alelom ima lastnost; ženska $X^B X^b$ je prenašalka. Sin dobi $X$ od matere, $Y$ od očeta.
- Mati prenašalka in zdrav oče: polovica sinov ima lastnost, polovica hčera je prenašalk.
- Rodovnik: kvadrat moški, krog ženska, poln znak lastnost, pika prenašalka. Recesivna lastnost lahko preskoči rod.
- Kromosomska analiza (kariogram) pokaže število in obliko kromosomov. Downov sindrom je trisomija 21: $47$ kromosomov zaradi napake pri mejozi.

## Drugače: Kot zgodba

Angleška kraljica Viktorija je živela v 19. stoletju in imela devet otrok. Nihče ni vedel, da je prenašalka hemofilije; alel se je v njeni družini najverjetneje pojavil na novo, saj med njenimi predniki hemofilije ni imel nihče. Njen sin Leopold je imel hemofilijo in je umrl mlad, po padcu, ki bi bil za drugega le nerodnost.

Viktorijine hčere so bile videti zdrave. Vsaj dve sta bili prenašalki, a tega nihče ni mogel vedeti. Poročile so se v kraljeve družine po Evropi. Vnukinja Aleksandra je postala ruska carica. Njen edini sin, prestolonaslednik Aleksej, je imel hemofilijo. Vsak udarec je bil zanj nevaren. Tudi v španski kraljevi družini sta dva Viktorijina pravnuka imela hemofilijo.

V zgodbi so bolni samo moški, prenašalke so zdrave, alel pa potuje po ženski strani rodovnika, dokler ne pride do sina z enim samim $X$.

## Drugače: Korak za korakom s številkami

Zakaj je barvno slepih moških toliko več kot žensk? Izračunajmo.

1. Recimo, da $8$ od $100$ kromosomov $X$ v Evropi nosi alel $X^b$, to je delež $0{,}08$.
2. Moški ima en $X$. Barvno slep je, če je ta $X^b$: delež $0{,}08$, torej $8$ od $100$ moških. Na $1000$ moških: $1000 \cdot 0{,}08 = 80$.
3. Ženska ima dva $X$. Barvno slepa je le, če sta oba $X^b$. $X$ od mame je $X^b$ z verjetnostjo $0{,}08$, $X$ od očeta prav tako. Da sta $X^b$ oba hkrati, verjetnosti zmnožimo.
4. $0{,}08 \cdot 0{,}08 = 0{,}0064$, torej približno $6$ od $1000$ žensk ($1000 \cdot 0{,}0064 = 6{,}4$).
5. Na vsakih $1000$: $80$ moških in približno $6$ žensk. Moškemu zadošča en alel.

## Preveri se

? Tina vidi barve normalno, njen oče pa je barvno slep. Kaj je Tina glede barvne slepote?
- Barvno slepa, ker je oče barvno slep.
~ Tina vidi normalno, torej ima vsaj en $X^B$. Barvna slepota se pri ženski pokaže le pri $X^b X^b$.
+ Prenašalka z genotipom $X^B X^b$.
- Brez alela za barvno slepoto, ker se ta deduje le na sinove.
~ Hči od očeta vedno dobi njegov edini $X$, pri barvno slepem očetu je to $X^b$.
- Homozigotka $X^B X^B$.
~ En $X$ je dobila od očeta in ta nosi $X^b$, zato ne more imeti dveh $X^B$.
> Od očeta ima $X^b$, od mame $X^B$: vidi normalno, a alel lahko preda sinovom.

? Razvrsti korake kromosomske analize od prvega do zadnjega.
1. odvzem celic iz krvi ali plodovnice
2. gojenje celic in ustavitev delitve
3. barvanje in fotografiranje kromosomov
4. razvrstitev kromosomov v pare in štetje
> Kromosome lahko fotografiramo šele v delitvi, razvrstimo in preštejemo pa šele na fotografiji.

? Kaj bi se zgodilo, če bi bil gen za barvno slepoto na kromosomu $Y$ namesto na $X$?
- Imele bi jo vse hčere barvno slepega očeta.
~ Hčere od očeta dobijo $X$, ne $Y$. Ženske kromosoma $Y$ sploh nimajo.
- Prenašale bi jo matere, kot zdaj.
~ Ženske nimajo kromosoma $Y$, zato ga ne morejo prenašati.
+ Imeli bi jo vsi sinovi barvno slepega očeta in nobena ženska.
- Bila bi enako pogosta pri moških in ženskah.
~ Kromosom $Y$ imajo le moški, zato bi bila lastnost samo moška.
> Sin vedno dobi očetov $Y$. Lastnost bi šla od očeta na vse sinove, ženske pa je ne bi imele nikoli.

? Mati je prenašalka hemofilije, oče je zdrav. Kolikšna je verjetnost, da bo njun naslednji otrok sin s hemofilijo?
- $0\,\%$
~ Oče je zdrav, a sin dobi $X$ od matere. Polovica njenih jajčec nosi $X^h$.
+ $25\,\%$
- $50\,\%$
~ To je verjetnost med sinovi. Vprašanje sprašuje po vseh otrocih, polovica so hčere.
- $100\,\%$
~ Mati ima tudi zdrav $X^H$ in ga preda polovici otrok.
> Punnettov kvadrat $X^H X^h \times X^H Y$ ima štiri polja, le eno je $X^h Y$: $\dfrac{1}{4} = 25\,\%$.

? Na glasbeni šoli je $250$ fantov. Barvno slepih je približno $8$ od $100$ moških. Koliko barvno slepih fantov pričakuješ na šoli? Vpiši število.
= 20
~ 8 | $8$ je število na vsakih $100$ fantov, šola pa jih ima $250$.
~ 31 | To je $250 : 8$. Delež $\dfrac{8}{100}$ pomnožimo s številom fantov.
~ 2 | Tako redka je pri dekletih, ki potrebujejo dva alela $X^b$. Fantje imajo en sam $X$.
> $250 \cdot 0{,}08 = 20$ barvno slepih fantov.

:::simboli
X | spolni kromosom X | | –
B | dominantni alel za normalen vid (nadpis pri $X$) | | –
b | recesivni alel za barvno slepoto (nadpis pri $X$) | | –
Y | spolni kromosom Y | | – | le pri moških
H | dominantni alel za normalno strjevanje krvi (nadpis pri $X$) | | –
h | recesivni alel za hemofilijo (nadpis pri $X$) | | –
G | dominantni alel za normalen sluh | | –
g | recesivni alel za prirojeno gluhoto | | –
P | verjetnost | P = \dfrac{k}{n} | –
k | število ugodnih polj Punnettovega kvadrata | | –
n | število vseh obravnavanih polj | | –
n_z | število kromosomov zarodka | n_z = n_1 + n_2 | –
n_1 | število kromosomov v jajčecu | | –
n_2 | število kromosomov v semenčici | | –
:::

<<RACUN
vrednost: 1/2 | 0.5
vrednost: 1/4 | 0.25
vrednost: 3/4 | 0.75
vrednost: 23+23 | 46
vrednost: 24+23 | 47
vrednost: 22+23 | 45
vrednost: 47-23 | 24
vrednost: 1000*0.08 | 80
vrednost: 0.08*0.08 | 0.0064
vrednost: 1000*0.0064 | 6.4
vrednost: 250*0.08 | 20
vrednost: 250/8 | 31.25
vrednost: 250*0.0064 | 1.6
>>
