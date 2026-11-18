---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Pri teku na $400\,\text{m}$ tekači ne startajo v vrsti. Kdor teče v zunanji progi, stoji na startu več metrov pred sosedom v notranji. Videti je nepošteno, pa ni: zunanja proga v zavojih poteka po večjem krogu, zato bi bila brez zamika daljša.

Presenečenje pride pri vprašanju, za koliko. Zavoja steze skupaj tvorita en krog, sosednja proga pa je od njegovega središča oddaljena le $1{,}22\,\text{m}$ več. Bi bila razlika na stadionu z velikimi zavoji večja kot na stadionu z majhnimi? Večina ljudi reče da. V resnici je dodatna pot vedno približno $7{,}7\,\text{m}$, ne glede na velikost zavoja.

Kako je to mogoče, boš izračunal sam. Za to potrebuješ obseg kroga in posebno število $\pi$. Ob tem spoznaš še ploščino kroga, ki jo rabiš pri vsem okroglem: tarčah, igriščih, kolesih in žogah.

## Razlaga

**Meritev na treningu.** Učenci so z merilnim trakom ovili tri okrogle športne predmete in tako izmerili njihov **obseg** $o$, to je dolžino krožnice, ki omejuje krog. Izmerili so še **premer** $d$, daljico skozi središče od roba do roba. Nato so obseg delili s premerom.

| Predmet | premer $d$ | obseg $o$ | $o : d$ |
|---|---|---|---|
| hokejski plošček | $7{,}6\,\text{cm}$ | $23{,}9\,\text{cm}$ | $3{,}145$ |
| frizbi | $27\,\text{cm}$ | $84{,}8\,\text{cm}$ | $3{,}141$ |
| košarkarski obroč | $45\,\text{cm}$ | $141{,}4\,\text{cm}$ | $3{,}142$ |

Predmeti so zelo različno veliki. Količnik $o : d$ pa je skoraj enak, majhne razlike so posledica merjenja.

:::premisli
Sredinski krog na nogometnem igrišču ima premer $18{,}3\,\text{m}$. Napovej: bo količnik $o : d$ zanj večji, manjši ali enak kot pri ploščku?
---
Enak, približno $3{,}14$. Vsak krog je le povečava ali pomanjšava drugega. Kolikokrat večji je premer, tolikokrat večji je tudi obseg, zato se količnik ne spremeni.
:::

**Število $\pi$.** Ta stalni količnik imenujemo $\pi$ (beri »pi«):

$$\pi = \frac{o}{d} = 3{,}14159\ldots$$

Decimalk ima neskončno in se ne ponavljajo. Zato $\pi$ ni ulomek in ga z decimalnim številom ne moremo zapisati natančno. Pri računanju vzamemo približek $\pi \approx 3{,}14$ ali pa $\pi$ pustimo v rezultatu.

**Obseg.** Iz $\dfrac{o}{d} = \pi$ sledi $o = \pi d$. **Polmer** $r$ je razdalja od središča do krožnice, premer je dvakratni polmer: $d = 2r$. Zato je

$$o = \pi d = 2\pi r$$

Obseg je dolžina, zato ga merimo v $\text{cm}$, $\text{m}$ in drugih dolžinskih enotah.

**Ploščina: iz izsekov v pravokotnik.** Krog razrežemo kot torto na enake **izseke**. Polovico jih obrnemo s konico navzgor, polovico s konico navzdol in jih zložimo izmenično drugega ob drugega. V simulaciji spodaj (Ploščina kroga iz izsekov) povečuj število izsekov. Opazuj, kako se valoviti robovi zravnajo in lik vse bolj spominja na pravokotnik.

Pri zelo veliko izsekih ima ta »pravokotnik«:

- višino $r$, ker je stranica vsakega izseka polmer,
- osnovnico $\pi r$, to je polovico obsega, $\dfrac{2\pi r}{2}$.

:::premisli
Zakaj je osnovnica le polovica obsega in ne cel obseg?
---
Loki vseh izsekov skupaj tvorijo obseg kroga. Polovica izsekov ima lok spodaj, polovica zgoraj, zato na vsaki dolgi stranici leži le polovica obsega, $\pi r$.
:::

Ploščina pravokotnika je osnovnica krat višina, torej $\pi r \cdot r$. Ploščina kroga je

$$p = \pi r^2$$

Najprej kvadriramo polmer, šele nato množimo s $\pi$. Ploščino merimo v kvadratnih enotah, na primer $\text{cm}^2$ ali $\text{m}^2$.

**Kateri obrazec?** Za dolžino (obod, trak, pot enega obrata kolesa) vzameš obseg, za površino (koliko pokrije, koliko barve) ploščino. Če poznaš obseg ali ploščino, polmer dobiš z obratno računsko operacijo:

$$r = \frac{o}{2\pi} \qquad r = \sqrt{\frac{p}{\pi}}$$

## Rešeni primeri

### Primer 1 (lažji): sredinski krog na košarkarskem igrišču

Sredinski krog na košarkarskem igrišču ima polmer $1{,}8\,\text{m}$. Kolikšna sta njegov obseg in ploščina? Uporabi $\pi \approx 3{,}14$ in zaokroži na dve decimalki.

**Podatki:** $r = 1{,}8\,\text{m}$, $\pi \approx 3{,}14$
**Iščemo:** obseg $o$ in ploščino $p$

:::formula
$o = 2\pi r$, $\quad p = \pi r^2$
:::

**Rešitev:**

1. Obseg: $o = 2 \cdot 3{,}14 \cdot 1{,}8 = 11{,}304\,\text{m}$, kar je zaokroženo $11{,}30\,\text{m}$.
2. Za ploščino najprej kvadriramo polmer: $1{,}8^2 = 3{,}24$.
3. $p = 3{,}14 \cdot 3{,}24 = 10{,}1736\,\text{m}^2$, zaokroženo $10{,}17\,\text{m}^2$.
4. Smiselnost: kvadrat, ki krog objame, ima stranico $3{,}6\,\text{m}$ in ploščino $3{,}6^2 = 12{,}96\,\text{m}^2$. Krog je nekoliko manjši, kot mora biti.
5. Odgovor: obseg kroga je približno $11{,}30\,\text{m}$, ploščina približno $10{,}17\,\text{m}^2$.

### Primer 2: lokostrelska tarča

Lokostrelska tarča za tekme na $70\,\text{m}$ ima premer $122\,\text{cm}$. Koliko kvadratnih metrov papirja potrebujejo za eno tarčo? Uporabi $\pi \approx 3{,}14$ in zaokroži na dve decimalki.

**Podatki:** $d = 122\,\text{cm}$, $\pi \approx 3{,}14$
**Iščemo:** ploščino $p$ v $\text{m}^2$

:::formula
$r = \dfrac{d}{2}$, $\quad p = \pi r^2$
:::

**Rešitev:**

1. Obrazec potrebuje polmer, zato premer razpolovimo: $r = 122 : 2 = 61\,\text{cm}$.
2. Kvadriramo: $61^2 = 3721$.
3. $p = 3{,}14 \cdot 3721 = 11\,683{,}94\,\text{cm}^2$.
4. En kvadratni meter ima $10\,000\,\text{cm}^2$, zato delimo z $10\,000$ in dobimo približno $1{,}17\,\text{m}^2$.
5. Odgovor: za eno tarčo potrebujejo približno $1{,}17\,\text{m}^2$ papirja. Kdor bi namesto polmera vstavil premer, bi dobil štirikrat preveč.

### Primer 3 (težji): zamik na atletski stezi

Zavoja atletske steze skupaj tvorita krog. Tekač v prvi progi teče po krožnici s polmerom $36{,}5\,\text{m}$, tekač v drugi progi pa po krožnici, ki je od središča $1{,}22\,\text{m}$ dlje. Koliko daljšo pot ima v zavojih tekač v drugi progi? Uporabi $\pi \approx 3{,}14$.

**Podatki:** $r_1 = 36{,}5\,\text{m}$, širina proge $1{,}22\,\text{m}$, $\pi \approx 3{,}14$
**Iščemo:** razliko poti $o_2 - o_1$

:::formula
$o = 2\pi r$
:::

**Rešitev:**

1. Polmer druge proge: $r_2 = 36{,}5 + 1{,}22 = 37{,}72\,\text{m}$.
2. Pot v prvi progi: $o_1 = 2 \cdot 3{,}14 \cdot 36{,}5 = 229{,}22\,\text{m}$.
3. Pot v drugi progi: $o_2 = 2 \cdot 3{,}14 \cdot 37{,}72 = 236{,}8816\,\text{m}$.
4. Razlika: $236{,}8816 - 229{,}22 = 7{,}6616$, torej približno $7{,}66\,\text{m}$.
5. Zakaj velikost zavoja ni pomembna: izpostavimo $2\pi$, $o_2 - o_1 = 2\pi r_2 - 2\pi r_1 = 2\pi(r_2 - r_1)$. Ostane le širina proge: $2 \cdot 3{,}14 \cdot 1{,}22 = 7{,}6616$.
6. Odgovor: tekač v drugi progi ima v zavojih približno $7{,}66\,\text{m}$ daljšo pot, zato starta pred sosedom. Pri večjem ali manjšem zavoju bi bila razlika enaka.

### Primer 4: zdaj ti

Trener z vrvjo, dolgo $25{,}12\,\text{m}$, na travi označi krožno igrišče za ogrevalno igro. Kolikšna je ploščina igrišča? Uporabi $\pi \approx 3{,}14$.

**Podatki:** $o = 25{,}12\,\text{m}$, $\pi \approx 3{,}14$
**Iščemo:** ploščino $p$

:::formula
$r = \dfrac{o}{2\pi}$, $\quad p = \pi r^2$
:::

**Rešitev:**

1. Vrv leži po robu igrišča, zato je njena dolžina obseg.
2. Za ploščino potrebujemo polmer, zato ga izrazimo iz obsega: $r = \dfrac{25{,}12}{2 \cdot 3{,}14} = \dfrac{25{,}12}{6{,}28}$.
3. Zdaj ti: izračunaj $r$, nato še ploščino $p$.

:::premisli
Koliko sta $r$ in $p$?
---
$r = 4\,\text{m}$, ker je $6{,}28 \cdot 4 = 25{,}12$. Ploščina: $p = 3{,}14 \cdot 4^2 = 3{,}14 \cdot 16 = 50{,}24\,\text{m}^2$.
:::

## Pogoste napake

- **Premer namesto polmera.** »Tarča ima premer $122\,\text{cm}$, torej $p = 3{,}14 \cdot 122^2$.« Obrazec $\pi r^2$ zahteva polmer. Premer je dvakrat daljši, njegov kvadrat pa štirikrat večji, zato je ploščina štirikrat prevelika. Popravek: pri vsaki nalogi najprej zapiši $r$.
- **Zamenjana obrazca.** »Za obseg vzamem $\pi r^2$.« Obseg je dolžina, $\pi r^2$ pa da kvadratne enote. Popravek: preveri enoto, $\text{m}$ pri obsegu in $\text{m}^2$ pri ploščini.
- **Kvadriranje na napačnem mestu.** »$\pi r^2$ je isto kot $(\pi r)^2$« ali »$r^2 = 2r$«. Kvadrira se samo polmer, $r^2 = r \cdot r$: pri $r = 3$ je $r^2 = 9$, ne $6$. Popravek: najprej izračunaj $r^2$, šele nato množi s $\pi$.
- **»Dvakrat večji polmer, dvakrat večja ploščina.«** To velja za obseg, ne za ploščino: pri polmeru $2r$ je ploščina $\pi (2r)^2 = 4\pi r^2$. Popravek: ko se polmer spremeni, izračunaj obe ploščini in ju primerjaj.
- **»$\pi$ je točno $3{,}14$« ali »točno $\frac{22}{7}$«.** Oboje sta le približka, zato rezultat s $3{,}14$ ni povsem natančen. Popravek: v odgovoru piši $\approx$ ali pusti $\pi$ v rezultatu, na primer $p = 16\pi\,\text{m}^2$.

## Povzetek

- Število $\pi$ je količnik obsega in premera, enak za vse kroge: $\pi \approx 3{,}14$.
- Premer je dvakratni polmer: $d = 2r$.
- Obseg kroga: $o = \pi d = 2\pi r$ (dolžinska enota).
- Ploščina kroga: $p = \pi r^2$ (kvadratna enota); izseki se zložijo v pravokotnik $\pi r$ krat $r$.
- Polmer iz obsega: $r = \dfrac{o}{2\pi}$; iz ploščine: $r = \sqrt{\dfrac{p}{\pi}}$.
- Dvakrat večji polmer: obseg je dvakrat, ploščina štirikrat večja.
- Če polmer povečamo za $a$, se obseg poveča za $2\pi a$, ne glede na velikost kroga.

## Drugače: Z analogijo

Predstavljaj si lokostrelsko tarčo, navito iz zelo tankega traku, kot je navit zvitek lepilnega traku. Prerežemo jo z ravnim rezom od roba do središča in vse obroče zravnamo na mizi, vsakega v ravno progo.

Proga iz središča je skoraj nič dolga. Proga z zunanjega roba je dolga toliko kot obseg, $2\pi r$. Vmesne proge so vse daljše, enakomerno od najkrajše do najdaljše. Zložene druga nad drugo tvorijo trikotnik z osnovnico $2\pi r$ in višino $r$.

Ploščino trikotnika že poznaš, polovica osnovnice krat višina:

$$p = \frac{2\pi r \cdot r}{2} = \pi r^2$$

Dobili smo isto kot z izseki, le po drugi poti.

Za samo število $\pi$ pomaga primerjava z menjalnico, v kateri tečaj nikoli ne niha. Iz premera v obseg vedno »zamenjaš« z istim faktorjem, tako kot metre v centimetre vedno s $100$. Faktor za kroge je $\pi$.

## Drugače: Bolj natančno

**Zakaj je $\dfrac{o}{d}$ enak za vse kroge?** Vsaka dva kroga sta podobna: enega dobimo iz drugega s povečavo. Če polmer povečamo $k$-krat, se vse dolžine na sliki povečajo $k$-krat, tudi obseg. Količnik $\dfrac{k \cdot o}{k \cdot d}$ je zato enak $\dfrac{o}{d}$.

**Koliko je $\pi$ natančno?** Grški matematik Arhimed je v krog včrtal in krogu očrtal pravilni $96$-kotnik in izračunal njuna obsega. Tako je dokazal, da je $\pi$ med $3\frac{10}{71}$ in $3\frac{1}{7}$. Ulomek $\frac{22}{7}$ je torej nekoliko prevelik približek. Da $\pi$ ni ulomek, je leta 1761 dokazal Johann Heinrich Lambert; tak dokaz presega osnovno šolo.

**Kako natančna je izpeljava z izseki?** Pri končnem številu izsekov lik ni pravi pravokotnik, ker so robovi iz lokov. Bolj ko so izseki ozki, bolj se loki zravnajo, in ploščina se vse bolj približuje $\pi r \cdot r$. Natančna ploščina kroga je meja tega približevanja, $p = \pi r^2$. Strogo to dokažemo v srednji šoli.

## Preveri se

? Športni pedagog izmeri obod okroglega koša za žoge in ga deli s premerom koša. Kaj dobi?
+ Število $\pi$, približno $3{,}14$.
- Polmer koša.
~ Polmer dobiš, če premer deliš z $2$. Obseg, deljen s premerom, je nekaj drugega.
- Ploščino dna koša.
~ Ploščina je $\pi r^2$ in ima kvadratne enote. Količnik dveh dolžin pa je število brez enote.
- Število, ki je pri večjem košu večje.
~ Pri večjem košu sta večja oba, obseg in premer, njun količnik pa ostane enak.
> Količnik obsega in premera je pri vsakem krogu enak. Tako je definirano število $\pi$.

? Razvrsti kroge po ploščini od najmanjše do največje. A: $r = 3\,\text{cm}$, B: $d = 5\,\text{cm}$, C: $o = 12{,}56\,\text{cm}$. Uporabi $\pi \approx 3{,}14$.
+ C, B, A
- A, B, C
~ Primerjal si podana števila $3$, $5$ in $12{,}56$, a ta pomenijo različne količine. Iz vsakega najprej izračunaj polmer.
- C, A, B
~ Pri B si premer $5\,\text{cm}$ vzel kot polmer. Polmer je $2{,}5\,\text{cm}$.
- B, A, C
~ Pri C si obseg delil le s $\pi$ in dobil $r = 4\,\text{cm}$. Pravilno je $r = \dfrac{o}{2\pi} = 2\,\text{cm}$.
> Polmeri so A $3\,\text{cm}$, B $2{,}5\,\text{cm}$, C $2\,\text{cm}$. Ploščine: C $12{,}56\,\text{cm}^2$, B $19{,}625\,\text{cm}^2$, A $28{,}26\,\text{cm}^2$.

? Kaj se zgodi z obsegom in ploščino kroga, če polmer podvojimo?
- Oba se podvojita.
~ Obseg res, ploščina pa ne: v $\pi r^2$ je polmer na kvadrat, zato je $\pi(2r)^2 = 4\pi r^2$.
+ Obseg se podvoji, ploščina se početveri.
- Obseg se početveri, ploščina se podvoji.
~ Zamenjal si obrazca. Obseg $2\pi r$ raste kot polmer, ploščina $\pi r^2$ pa kot kvadrat polmera.
- Oba se početverita.
~ Kvadrat je le v obrazcu za ploščino. V $2\pi r$ je dvojka faktor, ne potenca.
> Nov obseg je $2\pi \cdot 2r = 2 \cdot (2\pi r)$, nova ploščina pa $\pi (2r)^2 = 4 \cdot \pi r^2$.

? Kolo pri kolesu ima premer $60\,\text{cm}$. Kolikšno pot prevozi v $10$ obratih? Uporabi $\pi \approx 3{,}14$.
+ $18{,}84\,\text{m}$
- $37{,}68\,\text{m}$
~ V $2\pi r$ si vstavil premer namesto polmera. Pri premeru velja $o = \pi d$.
- $1{,}884\,\text{m}$
~ To je pot enega obrata. V desetih obratih kolo prevozi desetkrat toliko.
- $282{,}6\,\text{m}$
~ Računal si s ploščino $\pi r^2$. Pot enega obrata je obseg, ne ploščina.
> En obrat: $o = 3{,}14 \cdot 60 = 188{,}4\,\text{cm}$. Deset obratov: $1884\,\text{cm}$, kar je $18{,}84\,\text{m}$.

? Krog ima premer $10\,\text{cm}$. Kolikšna je njegova ploščina? Uporabi $\pi \approx 3{,}14$.
- $314\,\text{cm}^2$
~ Namesto polmera si vstavil premer, zato je ploščina štirikrat prevelika.
+ $78{,}5\,\text{cm}^2$
- $31{,}4\,\text{cm}^2$
~ To je obseg, $\pi d$, in ima dolžinsko enoto. Ploščina je $\pi r^2$.
- $62{,}8\,\text{cm}^2$
~ To je $2\pi$ krat premer, obseg z napačnim polmerom. Ploščina potrebuje $r^2$.
> Polmer je $5\,\text{cm}$, zato je $p = 3{,}14 \cdot 5^2 = 3{,}14 \cdot 25 = 78{,}5\,\text{cm}^2$.

:::simboli
o | obseg kroga (dolžina krožnice) | o = 2\pi r | | tudi o = π · d
d | premer | d = 2r |
r | polmer | r = \dfrac{d}{2} | | razdalja od središča do krožnice
p | ploščina kroga | p = \pi r^2 |
:::
