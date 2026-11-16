---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za doma potrebuje le slamico s pregibom in svetilko. V temni sobi poravnaj slamico in poglej skozi njo proti svetilki: na koncu vidiš svetlo piko. Zdaj slamico upogni. Pika izgine, čeprav je cevka še vedno odprta na obeh straneh.

Ta preprost poskus razloži tudi velik dogodek. Avgusta 2026 je Luna nad severno Španijo za slabi dve minuti popolnoma zakrila Sonce in večer se je v trenutku spremenil v noč. V Sloveniji so ljudje istočasno videli le, da manjka del Sonca. Astronomi so že leta prej vedeli, kje bo mrk popoln in kje le delen. Kako? Ker vedo, kako se širi svetloba in kam pade senca Lune.

## Razlaga

Začnimo z razliko med telesi. Sonce, zvezde, plamen sveče, žareča nitka v žarnici in zaslon telefona svetlobo **oddajajo** sami. Takim telesom rečemo **svetila**. Luna, planeti, knjiga ali tvoja roka sami ne svetijo. Svetlobo svetila le **odbijajo** v vse smeri; to so **osvetljena telesa**.

Telo vidimo, ko svetloba z njega pride v naše oko. Pri svetilu gre svetloba naravnost od njega do očesa. Pri osvetljenem telesu potuje po poti svetilo → telo → oko. Luno torej vidimo zato, ker nanjo sije Sonce in se del te svetlobe odbije k nam.

:::premisli
Mednarodna vesoljska postaja (ISS) je osvetljeno telo. Zakaj jo s tal vidimo kot svetlo piko le zvečer ali zjutraj, sredi noči pa skoraj nikoli?
---
Zvečer je pri nas že temno, postaja pa leti visoko in jo Sonce še obsije. Sredi noči je tudi ona v Zemljini senci: nanjo ne pade sončna svetloba, zato ni ničesar, kar bi se odbilo v naše oči.
:::

**Kako potuje svetloba.** Poglej tri primere:

1. Skozi ravno slamico vidiš svetilko, skozi upognjeno ne.
2. Ko skozi špranjo v polknih sije Sonce v prašno sobo, vidiš svetel pas. Je raven, brez zavojev.
3. Trije kartoni imajo vsak luknjico. Svetilka posveti skozi vse tri na steno le, ko luknjice ležijo na isti ravni črti. Premakneš en karton za prst in svetla pika na steni izgine.

V vseh treh je vzorec isti: svetloba ne zavije okoli ovinka. Pravilo se imenuje **premočrtno širjenje svetlobe**: v isti snovi (v zraku, v vodi, v praznem vesolju) se svetloba širi po ravnih črtah. Pot svetlobe rišemo kot **žarek**, ravno črto s puščico v smeri širjenja.

**Senca.** Ko na pot svetlobe postaviš neprozorno telo, ga svetloba ne more obiti. Za njim ostane prostor, kamor svetloba ne pride. To je **senca**. Njen rob določata žarka, ki gresta tik mimo robov telesa.

Majhna svetilka sveti na zaslon, ki je $60\,\text{cm}$ od nje. Med njiju postavimo karton, visok $4\,\text{cm}$, in ga premikamo:

| Karton od svetilke [cm] | Senca na zaslonu [cm] | Kolikokrat večja |
|---|---|---|
| $15$ | $16$ | $4$-krat |
| $20$ | $12$ | $3$-krat |
| $30$ | $8$ | $2$-krat |

Opaziš? Bliže svetilki je karton, večja je senca. Poglej še prvo vrstico: zaslon je od svetilke $4$-krat dlje kot karton ($60 : 15 = 4$), in senca je $4$-krat večja od kartona. Tako je v vsaki vrstici. Če višino predmeta označimo s $h$, višino sence s $H$, razdaljo svetilo–predmet z $a$ in razdaljo svetilo–zaslon z $b$:

$$\frac{H}{h} = \frac{b}{a}$$

Pravilo sledi iz premočrtnosti: žarka mimo robov se razhajata enakomerno, kot kraka črke V.

:::premisli
Karton prestavimo na $40\,\text{cm}$ od svetilke. Najprej brez računanja napovej, ali bo senca večja ali manjša od $8\,\text{cm}$. Nato izračunaj, kolikšna bo.
---
Manjša: $6\,\text{cm}$. Zaslon je od svetilke $\dfrac{60}{40} = 1{,}5$-krat dlje kot karton, zato je senca $1{,}5$-krat večja od $4\,\text{cm}$.
:::

**Polsenca.** Majhna svetilka da senco z ostrim robom. Sonce pa ni točka, ampak velika svetla krogla. Vsak njen del je kot majhna svetilka, ki meče svojo senco, in te sence se le delno prekrivajo. Za oviro je prostor, kamor ne pride svetloba z nobenega dela Sonca: tam je **senca**. Okoli nje je pas, kamor sveti le del Sonca: to je **polsenca**, temnejša od okolice, a svetlejša od sence. Zato imajo sence dreves na soncu mehke robove.

V simulaciji spodaj (»Premočrtno širjenje svetlobe: senca in polsenca«) najprej povleci oviro bliže izviru in opazuj, kako senca na zaslonu raste. Nato izberi dva izvora in poišči sivi pas polsence: tja sveti le eden od njiju.

**Sončev in Lunin mrk.** Sonce, Luna in Zemlja so včasih na isti premici.

```
Sončev mrk:  Sonce ───→  Luna  ───→  Zemlja
                               senca Lune
Lunin mrk:   Sonce ───→  Zemlja ───→  Luna
                               senca Zemlje
```

Pri **Sončevem mrku** pade senca Lune na Zemljo. Kdor je v njeni senci, vidi popolni mrk; kdor je v polsenci, vidi delni mrk. Pri **Luninem mrku** Luna zaide v senco Zemlje in potemni.

## Rešeni primeri

### Primer 1 (lažji): kaj na nebu sveti samo

Na jasnem večernem nebu opaziš Sonce tik nad obzorjem, Luno, planet Venero, zvezdo Sirij, utrinek in ISS. Katera od teh teles so svetila?

**Podatki:** Sonce, Luna, Venera (planet), Sirij (zvezda), utrinek (kamenček, ki zgori v ozračju), ISS (vesoljska postaja)
**Iščemo:** katera so svetila in katera osvetljena telesa

:::formula
Svetilo svetlobo oddaja samo; osvetljeno telo le odbija svetlobo svetila.
:::

**Rešitev:**

1. Sonce in Sirij sta zvezdi. Zvezde so vroče in svetijo same, zato sta svetili.
2. Utrinek je kamenček, ki se v ozračju tako segreje, da zažari. Medtem ko gori, svetlobo oddaja sam, zato je svetilo.
3. Luna, Venera in ISS sami ne svetijo. Vidimo jih, ker jih obsije Sonce in se svetloba odbije k nam.
4. Odgovor: svetila so Sonce, Sirij in utrinek; Luna, Venera in ISS so osvetljena telesa.

### Primer 2: model Lunine sence

Pri modelu mrka žogica s premerom $6\,\text{cm}$ predstavlja Luno. Od majhne žarnice je oddaljena $40\,\text{cm}$, zaslon pa je od žarnice $120\,\text{cm}$. Kolikšen je premer sence na zaslonu?

**Podatki:** $h = 6\,\text{cm}$, $a = 40\,\text{cm}$, $b = 120\,\text{cm}$
**Iščemo:** premer sence $H$

:::formula
$\dfrac{H}{h} = \dfrac{b}{a}$, torej $H = h \cdot \dfrac{b}{a}$
:::

**Rešitev:**

1. Kolikokrat je zaslon dlje od žarnice kot žogica: $\dfrac{120}{40} = 3$.
2. Senca je zato $3$-krat večja od žogice: $H = 6 \cdot 3 = 18$, torej $18\,\text{cm}$.
3. Odgovor: senca na zaslonu ima premer $18\,\text{cm}$.

### Primer 3 (težji): višina stolpa iz sence

Sonce sveti na ravno dvorišče. Navpična palica, visoka $1{,}0\,\text{m}$, meče senco, dolgo $1{,}6\,\text{m}$. V istem trenutku je senca zvonika dolga $24\,\text{m}$. Kako visok je zvonik?

**Podatki:** višina palice $h_\text{p} = 1{,}0\,\text{m}$, senca palice $s_\text{p} = 1{,}6\,\text{m}$, senca zvonika $s_\text{z} = 24\,\text{m}$
**Iščemo:** višino zvonika $h_\text{z}$

:::formula
Sončni žarki so vzporedni, zato je razmerje $\dfrac{\text{senca}}{\text{višina}}$ za vse predmete enako: $h_\text{z} = \dfrac{s_\text{z}}{s_\text{p} : h_\text{p}}$
:::

**Rešitev:**

1. Sonce je tako daleč, da so žarki, ki zadenejo palico in zvonik, praktično vzporedni. Oba predmeta zato mečeta senco pod istim kotom.
2. Senca palice je $\dfrac{1{,}6}{1{,}0} = 1{,}6$-krat daljša od palice.
3. Enako velja za zvonik, zato njegovo višino dobimo z deljenjem: $\dfrac{24}{1{,}6} = 15$, torej $15\,\text{m}$.
4. Preizkus: $15\,\text{m} \cdot 1{,}6 = 24\,\text{m}$, kar je izmerjena senca.
5. Odgovor: zvonik je visok $15\,\text{m}$.

### Primer 4: zdaj ti

Žogico s premerom $5\,\text{cm}$ postavimo med majhno žarnico in zaslon, ki je od žarnice $100\,\text{cm}$. Kam jo moramo postaviti, da bo senca na zaslonu imela premer $20\,\text{cm}$?

**Podatki:** $h = 5\,\text{cm}$, $H = 20\,\text{cm}$, $b = 100\,\text{cm}$
**Iščemo:** razdaljo žogice od žarnice $a$

:::formula
$\dfrac{H}{h} = \dfrac{b}{a}$, torej $a = \dfrac{b}{H : h}$
:::

**Rešitev:**

1. Senca naj bo $\dfrac{20}{5} = 4$-krat večja od žogice.
2. Torej mora biti zaslon $4$-krat dlje od žarnice kot žogica.
3. Zadnji korak izračunaj sam, nato preveri:

:::premisli
Koliko je $a$?
---
$a = \dfrac{100\,\text{cm}}{4} = 25\,\text{cm}$. Preizkus: $5\,\text{cm} \cdot \dfrac{100}{25} = 20\,\text{cm}$.
:::

## Pogoste napake

- **Luna sveti sama.** Ponoči je najsvetlejše telo na nebu, zato se zdi kot svetilo. A Luna le odbija sončno svetlobo; brez Sonca bi bila temna.
- **Oči pošiljajo pogled k predmetu.** Videti ni dejanje, ki gre iz očesa ven. Svetloba mora priti od svetila (ali po odboju od predmeta) v oko. V popolnoma temni sobi ne vidiš ničesar, čeprav imaš oči odprte.
- **Bliže svetilki, manjša senca.** Ravno obratno. Ko oviro približaš svetilu, se žarka mimo njenih robov bolj razpreta in senca na zaslonu se poveča.
- **Lunine mene so Zemljina senca.** Luna je vedno do polovice osvetljena. Mene nastanejo, ker z Zemlje vidimo različno velik del te osvetljene polovice. Zemljina senca pade na Luno samo ob Luninem mrku, ki je redek.

## Povzetek

- Svetila oddajajo svetlobo sama (Sonce, zvezde, plamen); osvetljena telesa jo le odbijajo (Luna, planeti, ISS).
- Telo vidimo, ko njegova svetloba pride v oko.
- V isti snovi se svetloba širi premočrtno; pot rišemo z žarki.
- Senca je prostor za neprozornim telesom, kamor svetloba ne pride. Pri majhnem svetilu je $\dfrac{H}{h} = \dfrac{b}{a}$: bliže svetilu, večja senca.
- Velik izvor da senco in okoli nje polsenco. Sončev mrk: senca Lune na Zemlji. Lunin mrk: Luna v senci Zemlje.

## Drugače: Korak za korakom s številkami

Kako izračunaš velikost sence, če je svetilo majhno:

1. **Nariši.** Svetilo, predmet in zaslon na eni črti; od svetila potegni žarka mimo zgornjega in spodnjega roba predmeta do zaslona.
2. **Izpiši razdalje od svetila.** Primer: predmet $a = 25\,\text{cm}$, zaslon $b = 75\,\text{cm}$, predmet visok $h = 2\,\text{cm}$.
3. **Kolikokrat dlje je zaslon?** $\dfrac{75}{25} = 3$.
4. **Tolikokrat povečaj predmet.** $H = 2 \cdot 3 = 6$, torej je senca visoka $6\,\text{cm}$.
5. **Preveri smisel.** Senca ne more biti manjša od predmeta, saj se žarka od svetila samo razhajata. Če dobiš manjšo, si delil v napačno smer.

Pri Soncu je drugače: žarki so vzporedni, zato je senca predmeta na zaslonu tik za njim enako velika kot predmet.

## Drugače: Kot zgodba

Pred več kot dva tisoč leti je v egiptovski Aleksandriji živel učenjak Eratosten. Slišal je, da v mestu Siena daleč na jugu Sonce nekega poletnega dne opoldne posije prav do dna globokega vodnjaka. Tam navpične palice v tistem trenutku sploh niso metale sence.

Eratosten je isti dan opoldne v Aleksandriji postavil navpično palico. Ta je senco imela, kratko, a jasno. Kako je to mogoče, če je Sonce isto in so njegovi žarki vzporedni?

Sklepal je takole: svetloba potuje premočrtno, žarki do obeh mest so vzporedni. Če bi bila Zemlja ravna, bi bile sence v obeh mestih enake. Ker niso, morajo biti tla ukrivljena. Iz dolžine sence je izračunal, kako zelo, in iz razdalje med mestoma ocenil obseg Zemlje. Zgrešil je za manj kot petino.

Ena palica, njena senca in pravilo o premočrtnem širjenju svetlobe so bili dovolj, da je izmeril planet.

## Preveri se

? Majhna svetilka sveti na zaslon $60\,\text{cm}$ stran. Vmes premikamo karton, visok $3\,\text{cm}$. Kateri par meritev se ujema s poskusom?
- karton na $20\,\text{cm}$: senca $6\,\text{cm}$; karton na $30\,\text{cm}$: senca $9\,\text{cm}$
~ Tu senca raste, ko karton odmikaš od svetilke. Velja obratno: bliže svetilki, večja senca.
- karton na $20\,\text{cm}$: senca $3\,\text{cm}$; karton na $30\,\text{cm}$: senca $3\,\text{cm}$
~ Senca ni vedno enako velika kot predmet. Žarka od majhne svetilke se razhajata, zato je senca na zaslonu večja.
+ karton na $20\,\text{cm}$: senca $9\,\text{cm}$; karton na $30\,\text{cm}$: senca $6\,\text{cm}$
- karton na $20\,\text{cm}$: senca $1\,\text{cm}$; karton na $30\,\text{cm}$: senca $1{,}5\,\text{cm}$
~ Tu je razmerje obrnjeno ($\dfrac{a}{b}$ namesto $\dfrac{b}{a}$). Senca ne more biti manjša od kartona.
> Pri $20\,\text{cm}$ je zaslon $3$-krat dlje, senca je $3 \cdot 3\,\text{cm} = 9\,\text{cm}$. Pri $30\,\text{cm}$ je $2$-krat dlje, senca je $6\,\text{cm}$.

? Zakaj ponoči vidimo Luno?
- Ker Luna sama oddaja šibko svetlobo.
~ Luna ni svetilo. Nima lastne svetlobe, kot jo imajo zvezde.
- Ker naše oči pošljejo pogled do Lune.
~ Iz oči ne gre nič ven. Videti pomeni, da svetloba pride v oko.
+ Ker Sonce osvetli Luno in se del svetlobe od nje odbije v naše oči.
- Ker Luna odbija svetlobo uličnih svetilk.
~ Ulične svetilke so preveč šibke in predaleč, da bi Luno vidno osvetlile. Luno osvetljuje Sonce.
> Luna je osvetljeno telo: svetloba gre po poti Sonce → Luna → oko.

? Popoldne je senca metrske palice dolga $1{,}2\,\text{m}$, senca drevesa pa malo manj kot $6\,\text{m}$. Približno kako visoko je drevo?
- približno $7\,\text{m}$
~ To dobiš, če dolžino sence pomnožiš z $1{,}2$. Tu so sence daljše od predmetov, zato je drevo nižje od svoje sence.
- približno $6\,\text{m}$
~ Senca ni nujno enako dolga kot predmet. Palica nam pove, da je tu senca daljša.
+ približno $5\,\text{m}$
- približno $1\,\text{m}$
~ Tako visoka je palica, ne drevo. Drevo ima precej daljšo senco, torej je višje.
> Senca je $1{,}2$-krat daljša od predmeta, zato je drevo visoko približno $\dfrac{6\,\text{m}}{1{,}2} = 5\,\text{m}$ (malo manj).

? Karton, visok $4\,\text{cm}$, meče na zaslon, ki je $80\,\text{cm}$ od majhne svetilke, senco, visoko $16\,\text{cm}$. Kako daleč od svetilke je karton?
- $320\,\text{cm}$
~ Razdaljo si pomnožil s $4$ namesto delil. Karton bi bil potem za zaslonom, kar ni mogoče.
+ $20\,\text{cm}$
- $5\,\text{cm}$
~ To je $\dfrac{80}{16}$: razdaljo si delil z velikostjo sence. Deliti moraš s tem, kolikokrat je senca večja, to je s $4$.
- $64\,\text{cm}$
~ Od razdalje si odštel velikost sence. Razdalja in velikost nista isti količini, zato ju ne smeš odštevati.
> Senca je $\dfrac{16}{4} = 4$-krat večja, zato je zaslon $4$-krat dlje kot karton: $a = \dfrac{80\,\text{cm}}{4} = 20\,\text{cm}$.

? Avgusta 2026 so ljudje v severni Španiji videli popolni Sončev mrk, v Sloveniji pa je Luna zakrila le del Sonca. Zakaj?
- Ker je bila Slovenija v Lunini senci, Španija pa v polsenci.
~ Obrnjeno: kdor je v senci, ne vidi nobenega dela Sonca, torej popolni mrk.
+ Ker je Slovenija ležala v Lunini polsenci, kamor sveti le del Sonca.
- Ker je takrat senca Zemlje padla na Luno.
~ To je Lunin mrk, ko je Zemlja med Soncem in Luno. Pri Sončevem mrku je Luna med Soncem in Zemljo.
- Ker se je v Sloveniji svetloba Sonca ukrivila okoli Lune.
~ Svetloba se v zraku in v vesolju širi premočrtno, okoli Lune ne zavije.
> Senca Lune na Zemlji je ozek pas. Kdor je v njem, vidi popolni mrk; v širši polsenci okoli njega vidiš le delni mrk.

:::simboli
H | višina sence | H = h \cdot \dfrac{b}{a} | cm | v nalogi tudi premer sence
h | višina predmeta | | cm
a | razdalja svetilo–predmet | | cm
b | razdalja svetilo–zaslon | | cm
h_{\text{z}} | višina zvonika | h_\text{z} = \dfrac{s_\text{z}}{s_\text{p} : h_\text{p}} | m
s_{\text{z}} | dolžina sence zvonika | | m
s_{\text{p}} | dolžina sence palice | | m
h_{\text{p}} | višina palice | | m
:::
