---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Arhimed iz Sirakuz je pred več kot 2000 leti dokazal, da ima krogla, ki se natanko prilega v valj, dve tretjini prostornine tega valja. Na to odkritje je bil tako ponosen, da je želel imeti na nagrobniku izklesan valj s kroglo v njem. Rimljan Cicero je mnogo let pozneje njegov grob, zaraščen z grmovjem, prepoznal prav po tej podobi.

Arhimed je moral najprej znati izračunati valj. Valje računamo tudi danes, na primer v športu. Koliko vode gre v termovko ob igrišču? Koliko blaga potrebuje šivilja za prevleko penastega valja za razgibavanje? Kolikšen del igrišča povalja valjar v enem obratu? Prvo vprašanje sprašuje po **prostornini**, drugo in tretje po **površini** oziroma njenem delu.

## Razlaga

**Mamljiva ideja.** Trener ima tri valjaste posode za vodo. Posoda B ima polmer dna $3\,\text{cm}$ in višino $10\,\text{cm}$. Posoda A je dvakrat višja, posoda C pa ima dvakrat večji polmer. Na prvi pogled se zdi, da gre v A in C enako vode, dvakrat toliko kot v B. To ne drži. Zakaj, pokaže račun.

**Valj.** Pokončni valj ima dve skladni, vzporedni krožni ploskvi. Imenujemo ju **osnovni ploskvi**. Ukrivljena ploskev med njima je **plašč**. Polmer osnovne ploskve označimo z $r$. **Višina** $v$ je razdalja med osnovnima ploskvama. Premica skozi središči osnovnih ploskev je **os** valja; pri pokončnem valju je pravokotna na osnovni ploskvi.

**Prostornina.** Valj si predstavljaj kot kupček enakih tankih okroglih ploščic, kot stolpec kovancev. Vsaka plast ima ploščino osnovne ploskve $O = \pi r^2$, plasti pa sežejo do višine $v$. Tako kot pri prizmi je prostornina ploščina osnovne ploskve krat višina:

$$V = \pi r^2 v$$

Zdaj trenerjeve posode:

| posoda | $r$ | $v$ | $V$ |
|---|---|---|---|
| B | $3\,\text{cm}$ | $10\,\text{cm}$ | $90\pi\,\text{cm}^3$ |
| A | $3\,\text{cm}$ | $20\,\text{cm}$ | $180\pi\,\text{cm}^3$ |
| C | $6\,\text{cm}$ | $10\,\text{cm}$ | $360\pi\,\text{cm}^3$ |

V A gre res dvakrat toliko kot v B. V C pa štirikrat toliko. Polmer je v formuli kvadriran: dvakrat večji polmer da štirikrat večjo osnovno ploskev ($6^2 = 36$ proti $3^2 = 9$).

:::premisli
Bidon ima trikrat večji premer kot ozka epruveta enake višine. Kolikokrat več tekočine gre vanj? Napovej, preden računaš.
---
Devetkrat več. Premer je trikrat večji, zato je tudi polmer trikrat večji. Osnovna ploskev je $3 \cdot 3 = 9$-krat večja, višina pa ostane enaka.
:::

**Druga mamljiva ideja: »Plašč je ukrivljen, zato ga ne moremo izračunati.«** Pomisli na nalepko na pločevinki teniških žogic. Ko jo vzdolž višine prerežeš in odlepiš, leži na mizi kot raven **pravokotnik**. Ena stranica je višina $v$. Druga stranica je bila ovita natanko enkrat okoli roba osnovne ploskve, zato je dolga toliko kot obseg kroga, $2\pi r$. Ploščina plašča je zato

$$\mathrm{pl} = 2\pi r v$$

Če valj razrežemo in razgrnemo na ravnino, dobimo njegovo **mrežo**: plašč in dva kroga.

:::risba skica
opis: Mreža valja. V sredini je pravokotnik plašča, visok v in dolg 2πr. Nad njim in pod njim se ga dotika po en krog s polmerom r: to sta osnovni ploskvi.
območje: 0; -2,3 .. 7,6; 5,3
enota: 40
pravokotnik: 0,8; 0 .. 7,08; 3 | modra
krog: 3,94; -1 | 1 | oranžna
krog: 3,94; 4 | 1 | oranžna
črta: 3,94; -1 -> 4,94; -1 | oranžna
napis: 4,44; -1 | r | nad
napis: 3,94; 4 | O | sredina
napis: 3,94; 1,5 | plašč | sredina
napis: 0,8; 1,5 | v | levo
napis: 6; 3 | 2πr | nad
:::

**Površina** valja je vsota ploščin vseh delov mreže: dveh osnovnih ploskev in plašča.

$$P = 2O + \mathrm{pl}$$

$$P = 2\pi r^2 + 2\pi r v$$

Oba člena imata skupni faktor $2\pi r$, zato lahko pišemo tudi $P = 2\pi r (r + v)$.

:::premisli
Polmer valja podvojimo, višina ostane enaka. Prostornina se početveri. Ali se početveri tudi plašč? In površina?
---
Ne, plašč se samo podvoji. V formuli $\mathrm{pl} = 2\pi r v$ polmer ni kvadriran: pravokotnik plašča postane dvakrat daljši, visok pa ostane enako. Površina se zato ne podvoji in ne početveri: osnovni ploskvi se početverita, plašč pa le podvoji.
:::

**Valj kot vrtenina.** **Vrtenina** je telo, ki ga opiše ravninski lik, ko ga zavrtimo za cel obrat okoli premice. Pravokotnik zavrtimo okoli ene od njegovih stranic. Ta stranica leži na osi valja in je njegova višina $v$. Sosednja stranica je pravokotna na os. Ko se zavrti, opiše krog, zato je njena dolžina polmer $r$, ne premer.

**Osni presek.** Valj prerežemo z ravnino, ki vsebuje os. Presek je pravokotnik s stranicama $2r$ in $v$: to sta dva prvotna pravokotnika, iz katerih je valj nastal, položena drug ob drugega. Če je osni presek kvadrat, torej $v = 2r$, je valj **enakostraničen**.

V simulaciji spodaj »3D: Valj (plašč se razvije)« razgrni plašč. Opazuj, da je dolga stranica pravokotnika natanko tako dolga kot rob osnovne ploskve.

**Enote.** Površino merimo v kvadratnih enotah ($\text{cm}^2$, $\text{m}^2$), prostornino v kubičnih ($\text{cm}^3$, $\text{dm}^3$). Velja $1\,\text{l} = 1\,\text{dm}^3 = 1000\,\text{cm}^3$. Pred računanjem zapiši vse dolžine v isti enoti.

## Rešeni primeri

### Primer 1 (lažji): penasti valj

Penasti valj za razgibavanje po treningu ima polmer $7\,\text{cm}$ in dolžino (višino) $30\,\text{cm}$. Koliko blaga potrebujemo za prevleko brez šivov? Koliko prostora zavzame valj?

**Podatki:** $r = 7\,\text{cm}$, $v = 30\,\text{cm}$
**Iščemo:** površino $P$ in prostornino $V$

:::formula
$P = 2\pi r^2 + 2\pi r v$ in $V = \pi r^2 v$
:::

**Rešitev:**

1. Osnovna ploskev, ki jo potrebujemo pri obeh računih: $O = \pi \cdot 7^2 = 49\pi \approx 153{,}94\,\text{cm}^2$.
2. Plašč je pravokotnik $2\pi r$ krat $v$: $\mathrm{pl} = 2\pi \cdot 7 \cdot 30 = 420\pi \approx 1319{,}47\,\text{cm}^2$.
3. Prevleka pokrije obe osnovni ploskvi in plašč: $P = 2 \cdot 49\pi + 420\pi = 518\pi \approx 1627{,}34\,\text{cm}^2$.
4. Prostornina je osnovna ploskev krat višina: $V = 49\pi \cdot 30 = 1470\pi \approx 4618{,}14\,\text{cm}^3$.
5. Odgovor: za prevleko potrebujemo približno $1627\,\text{cm}^2$ blaga, valj pa zavzame približno $4618\,\text{cm}^3$, torej okoli $4{,}6\,\text{l}$.

### Primer 2: zastavica, ki se vrti

Navijač ima pravokotno zastavico s stranicama $7\,\text{cm}$ in $4\,\text{cm}$. Palčka je pritrjena ob daljši stranici. Ko palčko hitro vrti med dlanmi, zastavica opiše valj. Kolikšna je prostornina tega valja? Kolikšna bi bila, če bi bila palčka ob krajši stranici?

**Podatki:** stranici pravokotnika $7\,\text{cm}$ in $4\,\text{cm}$; os vrtenja najprej ob daljši, nato ob krajši stranici
**Iščemo:** prostornini $V_1$ in $V_2$ ter kateri valj je večji

:::formula
$V = \pi r^2 v$, kjer je stranica ob osi višina $v$, sosednja stranica pa polmer $r$
:::

**Rešitev:**

1. Palčka ob daljši stranici: ta stranica je višina, $v = 7\,\text{cm}$. Krajša stranica opiše krog, zato je $r = 4\,\text{cm}$.
2. $V_1 = \pi \cdot 4^2 \cdot 7 = 112\pi \approx 351{,}86\,\text{cm}^3$.
3. Palčka ob krajši stranici: vlogi se zamenjata, $v = 4\,\text{cm}$ in $r = 7\,\text{cm}$.
4. $V_2 = \pi \cdot 7^2 \cdot 4 = 196\pi \approx 615{,}75\,\text{cm}^3$.
5. Primerjamo: $196\pi : 112\pi = 1{,}75$. Daljša stranica je v drugem primeru polmer, ki je kvadriran.
6. Odgovor: prvi valj ima prostornino približno $352\,\text{cm}^3$, drugi približno $616\,\text{cm}^3$. Večji valj nastane, ko palčko pritrdimo ob krajšo stranico.

### Primer 3 (težji): valjar na teniškem igrišču

Peščeno teniško igrišče z okolico meri $36\,\text{m}$ krat $18\,\text{m}$. Valj valjarja ima premer $60\,\text{cm}$ in širino $1{,}2\,\text{m}$. Kolikokrat se mora valj vsaj zavrteti, da enkrat povalja vse igrišče? Pasovi se ne prekrivajo.

**Podatki:** igrišče $36\,\text{m} \times 18\,\text{m}$, premer $d = 60\,\text{cm}$, širina valja (višina) $v = 1{,}2\,\text{m}$
**Iščemo:** najmanjše število obratov $n$

:::formula
$r = \dfrac{d}{2}$, $\mathrm{pl} = 2\pi r v$, $n = \dfrac{S}{\mathrm{pl}}$
:::

**Rešitev:**

1. Polmer: $r = 60\,\text{cm} : 2 = 30\,\text{cm} = 0{,}3\,\text{m}$. Vse dolžine zapišemo v metrih, ker je igrišče v metrih.
2. V enem obratu se ves plašč enkrat odvalja po tleh. Povaljana ploskev je zato enaka plašču: $\mathrm{pl} = 2\pi \cdot 0{,}3 \cdot 1{,}2 = 0{,}72\pi \approx 2{,}26\,\text{m}^2$.
3. Ploščina igrišča: $S = 36 \cdot 18 = 648\,\text{m}^2$.
4. Zdaj ti: izračunaj $n$ in premisli, kako zaokrožiti.

:::premisli
Koliko je $n = \dfrac{648\,\text{m}^2}{2{,}26\,\text{m}^2}$ in koliko obratov je potrebnih?
---
$n \approx 286{,}7$ (z natančno vrednostjo $0{,}72\pi$ dobiš $286{,}5$). Zaokrožimo **navzgor**, ker $286$ obratov ne povalja vsega. Valj se mora zavrteti vsaj $287$-krat.
:::

## Pogoste napake

- **»Dvakrat širši valj drži dvakrat več.«** Učenec misli, da polmer vpliva tako kot višina. Polmer je v $V = \pi r^2 v$ kvadriran, zato dvakrat večji polmer da štirikrat večjo prostornino. Pri primerjavi valjev najprej poglej, ali se spremeni $r$ ali $v$.
- **Premer namesto polmera.** V formulo vstaviš $d$, ker je tako podano. Pri $\pi r^2 v$ dobiš tako štirikrat preveliko prostornino. Najprej zapiši $r = d : 2$.
- **Ena osnovna ploskev premalo.** Učenec računa $P = O + \mathrm{pl}$ in prešteje samo dno. Valj ima dno *in* pokrov, zato je $P = 2O + \mathrm{pl}$. Samo pri odprti posodi, na primer vedru, ena osnovna ploskev zavestno odpade.
- **Zamenjana $\pi r^2$ in $2\pi r$.** $\pi r^2$ je ploščina kroga, $2\pi r$ je njegov obseg. Prostornina potrebuje ploščino ($r^2$), plašč pa obseg ($2\pi r$), ker je obseg dolžina pravokotnika.
- **Napačna pretvorba v litre.** Učenec deli $\text{cm}^3$ s $100$. Liter je kubični decimeter, $1\,\text{l} = 1000\,\text{cm}^3$, zato deliš s $1000$.

## Povzetek

- Pokončni valj ima dve skladni krožni osnovni ploskvi s polmerom $r$ in plašč. Višina $v$ je razdalja med osnovnima ploskvama.
- Prostornina: $V = O \cdot v = \pi r^2 v$. Dvakrat večji polmer da štirikrat večjo prostornino.
- Razvit plašč je pravokotnik $2\pi r$ krat $v$: $\mathrm{pl} = 2\pi r v$.
- Površina: $P = 2O + \mathrm{pl} = 2\pi r^2 + 2\pi r v = 2\pi r (r + v)$.
- Valj je vrtenina: nastane z vrtenjem pravokotnika okoli ene stranice. Ta stranica je višina, sosednja je polmer.
- Osni presek je pravokotnik $2r$ krat $v$. Enakostranični valj ima $v = 2r$.
- $1\,\text{l} = 1\,\text{dm}^3 = 1000\,\text{cm}^3$.

## Drugače: Kot zgodba

Pločevinka teniških žogic je nekega dne v garderobi pripovedovala, iz česa je sestavljena.

»Najprej me je stroj razrezal iz ravne pločevine,« je rekla. »Iz nje je izrezal dva enaka kroga: dno in pokrov. Vsak ima ploščino $\pi r^2$. Potem je odrezal pravokotnik in ga zvil v cev. Ko se je cev sklenila, se je dolga stranica pravokotnika natanko enkrat ovila okoli kroga. Zato je dolga $2\pi r$, visoka pa toliko kot jaz, $v$.«

»Koliko pločevine sem torej porabila? Dva kroga in pravokotnik: $2\pi r^2 + 2\pi r v$. To je moja površina.«

»Ko me napolnijo, je v meni prostora za kup tankih okroglih plasti, zloženih ena na drugo do vrha. Vsaka plast ima ploščino $\pi r^2$, kup je visok $v$. Moja prostornina je $\pi r^2 v$.«

Nato je pogledala širšo termovko na klopi: »Ti si dvakrat širša od mene in enako visoka. Tvoje plasti so štirikrat večje, zato držiš štirikrat toliko. Za ovoj pa si porabila le dvakrat daljši pravokotnik.«

## Drugače: Korak za korakom s številkami

Recept za vsako nalogo z valjem:

1. Izpiši podatke. Če je podan premer, ga deli z $2$.
2. Vse dolžine zapiši v isti enoti.
3. Izberi formulo glede na to, kaj iščeš.

Primer s številkami: $r = 2\,\text{cm}$, $v = 10\,\text{cm}$.

| Iščem | Formula | Račun |
|---|---|---|
| osnovna ploskev | $O = \pi r^2$ | $\pi \cdot 2^2 = 4\pi\,\text{cm}^2$ |
| plašč | $\mathrm{pl} = 2\pi r v$ | $2\pi \cdot 2 \cdot 10 = 40\pi\,\text{cm}^2$ |
| površina | $P = 2O + \mathrm{pl}$ | $2 \cdot 4\pi + 40\pi = 48\pi\,\text{cm}^2$ |
| prostornina | $V = O \cdot v$ | $4\pi \cdot 10 = 40\pi\,\text{cm}^3$ |

4. Na koncu preveri enote: površina v $\text{cm}^2$, prostornina v $\text{cm}^3$. Približek $48\pi \approx 150{,}8\,\text{cm}^2$ izračunaj šele na koncu.

## Preveri se

? Tri trditve o pokončnem valju so pravilne, ena ne sodi zraven. Katera?
- Osnovni ploskvi sta skladna kroga.
~ Ta trditev drži: dno in pokrov valja sta enaka kroga s polmerom $r$.
- Razvit plašč je pravokotnik.
~ Ta trditev drži: plašč razgrnemo v pravokotnik $2\pi r$ krat $v$.
+ Razvit plašč je krožni izsek.
- Osni presek je pravokotnik s stranicama $2r$ in $v$.
~ Ta trditev drži: ravnina skozi os prereže valj v pravokotnik, širok kot premer.
> Krožni izsek je razvit plašč stožca. Plašč valja je pravokotnik z dolžino $2\pi r$ in višino $v$.

? Polmer valja podvojimo, višina ostane enaka. Kaj se zgodi s prostornino?
- Podvoji se.
~ Tako bi bilo pri podvojeni višini. Polmer je v $\pi r^2 v$ kvadriran.
+ Početveri se.
- Poveča se za $2\pi$.
~ Prostornina se pri spremembi mere spremeni za faktor, ne za stalno število.
- Ostane enaka, ker je višina enaka.
~ Višina res ostane, a osnovna ploskev postane večja, z njo pa tudi prostornina.
> Nova osnovna ploskev je $\pi (2r)^2 = 4\pi r^2$, torej štirikrat večja. Pri enaki višini je zato štirikrat večja tudi prostornina.

? Valj ima premer $10\,\text{cm}$ in višino $6\,\text{cm}$. Učenec je računal površino: (1) $r = 5\,\text{cm}$; (2) $O = \pi \cdot 5^2 = 25\pi$; (3) $\mathrm{pl} = 2\pi \cdot 5 \cdot 6 = 60\pi$; (4) $P = O + \mathrm{pl} = 85\pi\,\text{cm}^2$. Kateri korak je napačen?
- korak (1)
~ Polmer je res polovica premera, $10 : 2 = 5$.
- korak (2)
~ Ploščina kroga s polmerom $5$ je res $25\pi$.
- korak (3)
~ Plašč je res $2\pi r v = 60\pi$.
+ korak (4)
> Valj ima dve osnovni ploskvi: $P = 2O + \mathrm{pl} = 50\pi + 60\pi = 110\pi\,\text{cm}^2$.

? Pravokotnik s stranicama $3\,\text{cm}$ in $5\,\text{cm}$ zavrtimo okoli stranice dolžine $5\,\text{cm}$. Kolikšna je prostornina nastalega valja?
- $75\pi\,\text{cm}^3$
~ Zamenjal si vlogi stranic. Stranica ob osi ($5\,\text{cm}$) je višina, druga je polmer.
- $15\pi\,\text{cm}^3$
~ Pozabil si kvadrirati polmer: $\pi \cdot 3 \cdot 5$.
- $30\pi\,\text{cm}^3$
~ To je plašč $2\pi r v$, ne prostornina.
+ $45\pi\,\text{cm}^3$
> Stranica ob osi je višina, $v = 5\,\text{cm}$, druga stranica je polmer, $r = 3\,\text{cm}$. $V = \pi \cdot 3^2 \cdot 5 = 45\pi\,\text{cm}^3$.

? Termovka za ekipo ima obliko valja s polmerom $10\,\text{cm}$ in višino $32\,\text{cm}$. Koliko napitka približno drži?
- približno $1\,\text{l}$
~ Pozabil si kvadrirati polmer: $\pi \cdot 10 \cdot 32 \approx 1005\,\text{cm}^3$.
- približno $2\,\text{l}$
~ To je plašč $2\pi r v \approx 2011\,\text{cm}^2$, ki pove, koliko je ovoja, ne koliko gre vanj.
+ približno $10\,\text{l}$
- približno $100\,\text{l}$
~ Pri pretvorbi si delil s $100$. Ker je $1\,\text{l} = 1000\,\text{cm}^3$, deliš s $1000$.
> $V = \pi \cdot 10^2 \cdot 32 = 3200\pi \approx 10\,053\,\text{cm}^3$. Ker je $1\,\text{l} = 1000\,\text{cm}^3$, drži termovka približno $10\,\text{l}$.

:::simboli
V | prostornina valja | V = \pi r^2 v | |
r | polmer osnovne ploskve | r = \frac{d}{2} | |
v | višina valja | | | razdalja med osnovnima ploskvama
O | ploščina osnovne ploskve | O = \pi r^2 | |
\mathrm{pl} | ploščina plašča | \mathrm{pl} = 2\pi r v | | razvit plašč je pravokotnik
P | površina valja | P = 2O + \mathrm{pl} | |
d | premer osnovne ploskve | | |
S | ploščina igrišča | | m^2 | Primer 3
n | število obratov valjarja | n = \frac{S}{\mathrm{pl}} | – | zaokrožimo navzgor
:::
