---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Vzemi $5$ kamenčkov in $4$ lončke ali kozarce. Kamenčke razdeli v lončke, kakor želiš. Poskusi tako, da bo v vsakem lončku največ en kamenček.

Ne gre. Ne glede na to, kako se potrudiš, v nekem lončku pristaneta vsaj dva kamenčka. Poskus ponovi z $9$ kamenčki in $4$ lončki: zdaj v nekem lončku vedno pristanejo vsaj trije.

Ta preprost poskus je jedro **Dirichletovega načela**. Na tekmovanjih z njim dokažeš, da nekaj *gotovo obstaja*: dva dneva z enakim vremenom, dve ptici na istem drevesu, dve točki blizu skupaj. Pri tem sploh ne veš, kateri sta to.

## Razlaga

**Od invariante k predalom.** Pri invariantah smo dokazovali, da cilja *ni mogoče* doseči. Dirichletovo načelo dela ravno nasprotno: dokaže, da se nekaj *mora* zgoditi. Obe metodi imata nekaj skupnega: ne preizkušaš vseh možnosti, ampak najdeš en razlog, ki velja za vse hkrati.

| | Invarianta | Dirichletovo načelo |
|---|---|---|
| Kaj dokažemo | da nečesa ni mogoče doseči | da nekaj gotovo obstaja |
| Kaj poiščemo | lastnost, ki se ne spremeni | predale za predmete |
| Tipičen odgovor | »nikoli« | »vedno vsaj …« |

**Načelo.** Imamo $n$ predalov in vanje razdelimo $n + 1$ predmetov. Potem sta v vsaj enem predalu vsaj $2$ predmeta.

**Zakaj velja.** Dokažemo s **protislovjem**: predpostavimo nasprotno in pokažemo, da to ne more veljati. Recimo, da je v vsakem predalu največ en predmet. Potem je vseh predmetov največ $n$. Imamo pa jih $n + 1$. Protislovje, zato predpostavka ne drži.

:::premisli
Imaš $n$ predmetov in $n$ predalov. Ali sta v nekem predalu gotovo dva? Napovej, preden pogledaš.
---
Ne. Vsak predmet lahko gre v svoj predal, in nobeden ni podvojen. Načelo zahteva vsaj en predmet *več*, kot je predalov.
:::

**Več predmetov.** Kaj, če je predmetov veliko več? Velja splošnejša oblika: če je predmetov več kot $k \cdot n$, je v nekem predalu vsaj $k + 1$ predmetov. Dokaz je enak: če bi jih bilo v vsakem predalu največ $k$, bi jih bilo skupaj največ $k \cdot n$.

Krajše: število predmetov deliš s številom predalov in rezultat **zaokrožiš navzgor**. Pri $9$ kamenčkih in $4$ lončkih je $9 : 4 = 2{,}25$, navzgor zaokroženo $3$.

**Kje je razlika s povprečjem.** Povprečje $2{,}25$ kamenčka ne obstaja v resnici. Ker so kamenčki celi, mora vsaj en lonček preseči povprečje, torej imeti vsaj $3$.

V simulaciji spodaj (Dirichletovo načelo) nastavi predale $n = 4$ in predmete $N = 9$. Nato predmete povečuj do $12$ in še na $13$. Opazuj, pri katerem številu predmetov zagotovljeno število v enem predalu skoči s $3$ na $4$.

**Najslabši primer.** Pri vprašanju »najmanj koliko moramo vzeti, da gotovo …« si predstavljaj **smolarja**, ki ima vedno najslabšo možno srečo: predmeti se mu razporedijo čim bolj enakomerno, tako da cilja še ni. Šele en predmet več cilj zagotovo doseže.

:::premisli
Zakaj je najslabši primer ravno *enakomerna* razporeditev in ne kup vseh predmetov v enem predalu?
---
Ker kopičenje v enem predalu cilj doseže prej. Pri enakomerni razporeditvi je v vsakem predalu čim manj predmetov, zato cilj pride najpozneje.
:::

**Najtežji del je izbira predalov.** V nalogi o vremenu so predali vrste vremena. V nalogi o številih so lahko predali sodo in liho, ali pari števil. V geometriji so predali deli lika. Vprašaj se: kaj želim dokazati za dva predmeta? Predal naj bo tak, da dva predmeta v istem predalu to že izpolnita.

## Rešeni primeri

### Primer 1 (lažji): vreme v aprilu

Vremenoslovec za vsak dan aprila zapiše eno od štirih vrst vremena: sončno, oblačno, deževno ali snežno. April ima $30$ dni. Najmanj koliko dni z enakim vremenom je gotovo zapisal?

**Podatki:** $30$ dni (predmeti), $4$ vrste vremena (predali)
**Iščemo:** najmanjše število dni, ki gotovo pripada isti vrsti vremena

:::formula
Če je predmetov več kot $k \cdot n$, je v nekem predalu vsaj $k + 1$ predmetov.
:::

**Rešitev:**

1. Predali so vrste vremena, $n = 4$; predmeti so dnevi.
2. Poiščemo največji $k$, pri katerem je $k \cdot n$ še manj kot $30$: $4 \cdot 7 = 28$, kar je manj kot $30$. Zato je v nekem predalu vsaj $8$ dni.
3. Ali je $8$ res najboljši odgovor? Razporeditev $8 + 8 + 7 + 7 = 30$ pokaže, da več kot $8$ ni zagotovljeno.
4. Odgovor: gotovo je bilo vsaj $8$ dni z enakim vremenom.

### Primer 2: plodovi v temi

V platneni vreči je $10$ kostanjev, $8$ želodov in $5$ orehov. Plodove jemlješ brez gledanja. (a) Najmanj koliko jih moraš vzeti, da imaš gotovo $3$ enake vrste? (b) Najmanj koliko, da imaš gotovo $3$ želode?

**Podatki:** $10$ kostanjev, $8$ želodov, $5$ orehov; $3$ vrste plodov
**Iščemo:** najmanjše število vzetih plodov za (a) $3$ enake in (b) $3$ želode

:::formula
Najslabši primer: največ, kolikor jih lahko vzameš *brez* cilja, $+1$.
:::

**Rešitev:**

1. (a) Predali so tri vrste plodov. Smolar vzame po $2$ od vsake vrste in še nima treh enakih: $3 \cdot 2 = 6$.
2. Naslednji plod pade v predal, kjer sta že dva: $6 + 1 = 7$.
3. (b) Zdaj nas zanima le en predal. Smolar najprej pobere vse, kar ni želod, in še $2$ želoda: $10 + 5 + 2 = 17$.
4. Naslednji plod je gotovo želod: $17 + 1 = 18$.
5. Odgovor: za $3$ enake plodove potrebuješ $7$ plodov, za $3$ želode pa kar $18$.

### Primer 3 (težji): pari z vsoto $21$

Izmed števil $1, 2, \dots, 20$ izberemo nekaj različnih. Najmanj koliko jih moramo izbrati, da sta med izbranimi gotovo dve z vsoto $21$?

**Podatki:** števila od $1$ do $20$, izbiramo različna števila
**Iščemo:** najmanjše število izbranih, ki zagotovi par z vsoto $21$

:::formula
Predali so pari $\{1, 20\}, \{2, 19\}, \dots, \{10, 11\}$; vsak par ima vsoto $21$.
:::

**Rešitev:**

1. Izberemo predale tako, da dve števili v istem predalu že dasta vsoto $21$. Vsako število $a$ ima natanko enega »partnerja« $21 - a$.
2. Parov je $20 : 2 = 10$. To je $10$ predalov.
3. Če izberemo $11$ števil, sta po načelu dve v istem paru, njuna vsota je $21$.
4. Je $10$ dovolj? Ne: izberemo $1, 2, \dots, 10$. Največja vsota dveh je $9 + 10 = 19$, kar je manj kot $21$.
5. Odgovor: izbrati moramo vsaj $11$ števil; z $10$ števili par še ni zagotovljen.

### Primer 4 – zdaj ti: tri meritve

Vremenska postaja tri dni izmeri jutranjo temperaturo v celih stopinjah (lahko tudi pod ničlo). Dokaži, da sta med tremi meritvami dve, katerih vsota je soda.

**Podatki:** $3$ cela števila (temperature)
**Iščemo:** dokaz, da imata dve izmed njih sodo vsoto

:::formula
Predali: soda števila in liha števila. Vsota dveh števil iste parnosti je soda.
:::

**Rešitev:**

1. Predala sta dva: »sodo« in »liho«.
2. Predmeti so tri meritve, kar je več kot $2$.
3. Dokončaj sam:

:::premisli
Kaj sledi iz načela in zakaj je vsota tistih dveh meritev soda?
---
Po načelu sta dve meritvi v istem predalu, torej iste parnosti. Sodo $+$ sodo je sodo, liho $+$ liho je tudi sodo. Zato je njuna vsota soda.
:::

## Pogoste napake

- **»V vsakem predalu« namesto »v nekem predalu«.** Pri $13$ pticah na $12$ drevesih kdo sklepa, da sta na vsakem drevesu dve. Načelo pove le, da je *vsaj eno* drevo z dvema; druga so lahko prazna.
- **Pozabljeni $+1$.** Pri $n$ predmetih v $n$ predalih ni nič zagotovljeno. Pri »najmanj koliko« vedno izračunaj najslabši primer in prištej $1$.
- **Zaokrožanje navzdol.** Pri $30$ dneh in $4$ vrstah vremena je $30 : 4 = 7{,}5$. Odgovor ni $7$, ker bi bilo potem skupaj največ $28$ dni. Zaokrožiš navzgor: $8$.
- **Pri določeni vrsti štejemo samo njo.** Kdor za »gotovo $3$ želode« odgovori $3$ ali $7$, pozabi, da lahko smolar najprej pobere vse kostanje in orehe.
- **Preveč predalov.** Če je predalov toliko kot predmetov ali več, načelo ne pove ničesar. Predale izberi večje, da jih bo manj.

## Povzetek

- Dirichletovo (predalčno) načelo: $n + 1$ predmetov v $n$ predalih, v nekem predalu sta vsaj $2$.
- Splošno: več kot $k \cdot n$ predmetov v $n$ predalih, v nekem predalu jih je vsaj $k + 1$ (število predmetov : število predalov, zaokroženo navzgor).
- Dokaz s protislovjem: če bi jih bilo v vsakem predalu največ $k$, bi jih bilo skupaj največ $k \cdot n$.
- Načelo pove, da predal obstaja, ne pa, kateri je.
- »Najmanj koliko, da gotovo«: najslabši primer (čim bolj enakomerno ali vse ostalo) in $+1$.
- Ključ je izbira predalov: dva predmeta v istem predalu morata že izpolniti, kar dokazujemo (parnost, pari z isto vsoto, deli lika).
- V odgovoru pokaži še primer, da manjše število ne zadošča.

## Drugače: Na sliki

Sedem ptic sede na tri veje. Vsako ptico narišemo kot `o`, veje kot predale:

```
veja A | o o o |
veja B | o o   |
veja C | o o   |
```

Pri najslabši razporeditvi na nobeni veji še ni treh ptic: na vsaki sedita po dve, to je šest ptic. Sedma nima več prazne izbire: kamor koli sede, nastane veja s tremi. Slika kaže tudi, da več kot tri ptice niso zagotovljene, ker razporeditev $3 + 2 + 2 = 7$ obstaja.

Enako nariši geometrijsko nalogo. Na travniku v obliki kvadrata s stranico $2\,\text{m}$ je $5$ krtin. Pokažimo, da sta dve krtini blizu skupaj. Kvadrat razreži na $4$ kvadratke s stranico $1\,\text{m}$; to so predali. Pet krtin v štirih predalih: dve sta v istem kvadratku, zato sta oddaljeni največ za diagonalo kvadratka, to je približno $1{,}41\,\text{m}$.

## Drugače: Iz vsakdanjega življenja

- **Meseci rojstva.** Leto ima $12$ mesecev. Med $13$ sošolci sta gotovo dva, rojena v istem mesecu. Med $12$ ne nujno, saj je lahko vsak rojen v drugem mesecu.
- **Nogavice v temi.** V predalu so črne in bele nogavice. Tri vzete nogavice gotovo dajo par enake barve, ker sta barvi samo dve.
- **Garderoba v šoli.** Če je $25$ učencev in $24$ obešalnikov, nekdo deli obešalnik. Kdo, ne vemo; vemo pa, da se to mora zgoditi.

V vseh primerih se vprašaš isto: kaj so predali, koliko jih je in koliko je predmetov.

## Preveri se

? Na $3$ drevesih sedi $7$ ptic. Katera razporeditev pokaže, da načelo **ne** zagotavlja več kot $3$ ptic na enem drevesu?
- $7, 0, 0$
~ Taka razporeditev je možna, a ima na enem drevesu $7$ ptic. Ne pokaže, da je $3$ največ, kar je zagotovljeno.
+ $3, 2, 2$
- $2, 2, 2$
~ Tu je samo $6$ ptic. S $7$ pticami vsa drevesa z največ dvema niso mogoča, to je ravno načelo.
- $4, 2, 1$
~ Na enem drevesu so $4$ ptice. Pokazati moraš razporeditev, kjer nobeno drevo nima več kot $3$.
> Razporeditev $3 + 2 + 2 = 7$ ima največ $3$ ptice na drevesu, zato več kot $3$ ni zagotovljeno. Načelo pa zagotavlja vsaj $3$, ker bi pri največ $2$ na drevo bilo skupaj največ $6$ ptic.

? V gozdu raste $1\,000\,000$ dreves, vsako ima največ $200\,000$ listov. Najmanj koliko dreves ima gotovo enako število listov? Išči največje število, ki ga načelo še **zagotavlja**.
- $2$
~ Dve drevesi sta res zagotovljeni, a načelo zagotavlja več. Predalov je $200\,001$, dreves pa skoraj petkrat toliko.
+ $5$
- $50$
~ Število dreves si delil z $20\,000$ namesto z $200\,001$ (številom predalov).
- Nič, ker so vsa drevesa različna.
~ Drevesa so različna, njihovo število listov pa je lahko enako. Predalov (števil listov) je manj kot dreves.
> Predali so možna števila listov od $0$ do $200\,000$, to je $200\,001$ predalov. Ker je $200\,001 \cdot 4 = 800\,004$ manj kot milijon, je v nekem predalu vsaj $5$ dreves.

? Zakaj $12$ sošolcev **ne** zagotavlja dveh z rojstnim dnem v istem mesecu?
- Ker je verjetnost za to majhna.
~ Načelo ne govori o verjetnosti, ampak o tem, kaj je gotovo. Pri $12$ je par celo zelo verjeten, a ne gotov.
+ Ker je lahko vsak rojen v drugem mesecu.
- Ker ima februar manj dni kot ostali meseci.
~ Dolžina mesecev ni pomembna. Predali so meseci, šteje le, da jih je $12$.
> Predmetov je toliko kot predalov, zato gre lahko vsak v svoj predal. Šele $13$. sošolec zagotovi par.

? Vreme zapisujemo kot sončno, oblačno ali deževno. Najmanj koliko dni moramo zapisovati, da je gotovo vsaj $5$ dni z enakim vremenom?
- $12$
~ To je najslabši primer ($4$ dnevi vsake vrste), ki cilja še ne doseže. Prišteti moraš $1$.
+ $13$
- $15$
~ To je $3 \cdot 5$. Tako dobiš, če zahtevaš $5$ dni za *vsako* vrsto, ne za eno.
- $5$
~ Pet dni je lahko različnih vrst. Smolar razporedi dneve čim bolj enakomerno.
> Najslabši primer: po $4$ dni vsake vrste, to je $3 \cdot 4 = 12$ dni brez petih enakih. Trinajsti dan zagotovi pet enakih.

? V enakostranični trikotnik s stranico $2\,\text{cm}$ narišemo $5$ točk. Katere predale izbereš, da dokažeš, da sta dve točki oddaljeni največ $1\,\text{cm}$?
- Dve polovici trikotnika.
~ V eni polovici bodo res vsaj $3$ točke, a polovica je prevelika: točki v njej sta lahko oddaljeni več kot $1\,\text{cm}$.
+ Štiri enakostranične trikotnike s stranico $1\,\text{cm}$, ki jih dobiš, ko povežeš razpolovišča stranic.
- Pet trikotnikov, za vsako točko enega.
~ Predalov je toliko kot točk, zato načelo ne pove ničesar. Predalov mora biti manj kot predmetov.
> Daljice med razpolovišči stranic razdelijo trikotnik na $4$ trikotnike s stranico $1\,\text{cm}$. Pet točk v $4$ predalih: dve sta v istem malem trikotniku, zato sta oddaljeni največ $1\,\text{cm}$.

:::simboli
n | število predalov | | |
k | največje število predmetov v predalu | | | pri več kot k · n predmetih ima neki predal vsaj k + 1
:::
