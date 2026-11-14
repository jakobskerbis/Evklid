---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Naredi kratek poskus. Na list z velikimi tiskanimi črkami napiši besedi TAT in SOS. List drži pred sprednjo kamero telefona (večina telefonov predogled selfija zrcali) ali pred ogledalom. Beseda TAT ostane enaka, v besedi SOS pa sta obe črki S obrnjeni. Nato list obrni na glavo, torej ga zasukaj za pol kroga. Zdaj ostane enaka beseda SOS, TAT pa ne.

Kamera je naredila **zrcaljenje**, tvoja roka pa **vrtenje**. Ti dve preslikavi sta orodje za veliko tekmovalnih nalog: koliko različnih likov lahko sestaviš, ali se vzorec ploščic sklene brez vrzeli, ali lahko mrežo pokriješ z dominami. Kdor zna lik v mislih zrcaliti in vrteti, take naloge reši hitro in brez risanja vseh možnosti.

## Razlaga

**1. Zrcaljenje čez os.** Izberemo premico, ki ji rečemo **os**. Točka $P$ se preslika v točko $P'$ na drugi strani osi, in sicer tako, da je daljica $PP'$ pravokotna na os in jo os razpolavlja (os je torej **simetrala** daljice $PP'$). Točka na osi ostane, kjer je. Lik se pri zrcaljenju ne skrči in ne raztegne: slika je **skladna** z likom. Spremeni pa se **orientacija**: če si oglišča $A$, $B$, $C$ sledijo v smeri urinega kazalca, si $A'$, $B'$, $C'$ sledijo v nasprotni smeri.

*Preizkus:* katere črke iz TAT imajo navpično os? Vse tri: T, A in T.

**2. Os simetrije lika.** Premica je **os simetrije** lika, če zrcaljenje čez njo lik prekrije samega s sabo. Za tekmovanja si zapomni nekaj znanih likov. Zadnji stolpec pove, za koliko moramo lik najmanj zasukati, da se prekrije sam s sabo; vrtenje natančneje opišemo v točki 3.

| lik | število osi | najmanjši zasuk |
|---|---|---|
| kvadrat | $4$ | $90^\circ$ |
| pravokotnik (ne kvadrat) | $2$ | $180^\circ$ |
| romb (ne kvadrat) | $2$ | $180^\circ$ |
| paralelogram (brez pravih kotov, ne romb) | $0$ | $180^\circ$ |
| pravilni $n$-kotnik | $n$ | $\dfrac{360^\circ}{n}$ |

Krog ima neskončno osi: vsaka premica skozi središče je os.

:::premisli
Zakaj diagonala pravokotnika, ki ni kvadrat, ni njegova os simetrije? Napovej, preden pogledaš.
---
Pri zrcaljenju čez diagonalo bi se daljša stranica preslikala na premico, po kateri teče krajša stranica. Ker nista enako dolgi, se slika ne prekrije s pravokotnikom. Pri kvadratu sta stranici enaki, zato je tam diagonala os.
:::

**3. Vrtenje.** Izberemo **središče vrtenja** $O$ in kot $\alpha$. Vsaka točka $P$ se premakne po krožnici s središčem $O$, tako da je $|OP'| = |OP|$ in $\angle POP' = \alpha$. Središče ostane na mestu. Pri vrtenju je slika skladna z likom in **orientacija ostane enaka**. Vrtenje za $180^\circ$ se imenuje **središčna simetrija**: $O$ je takrat razpolovišče daljice $PP'$.

Lik ima **vrtilno simetrijo**, če ga lahko zasukamo za kot, manjši od $360^\circ$, in se prekrije sam s sabo. Najmanjši tak kot vedno deli $360^\circ$. Če se lik prekrije $k$-krat v enem polnem obratu, je najmanjši kot $\dfrac{360^\circ}{k}$.

V simulaciji spodaj (Zrcaljenje in vrtenje) izberi »Navpična os« in poglej, v katero smer si sledijo $A'$, $B'$, $C'$. Nato izberi »Središčna«. Opazi: pri zrcaljenju se smer obhoda obrne, pri zasuku za $180^\circ$ pa ostane enaka.

*Preizkus:* za koliko je treba najmanj zasukati črko S, da je videti enako? Za $180^\circ$.

**4. Dvakratno zrcaljenje.** Lik zrcalimo čez os $p$, nato sliko še čez os $q$. Če se osi sekata pod kotom $\beta$, sta obe zrcaljenji skupaj **vrtenje za $2\beta$** okrog presečišča osi. Orientacija se je namreč obrnila dvakrat, torej je spet prvotna. Od tod sledi pravilo: če ima lik dve osi pod kotom $\beta$, ga smemo zasukati za $2\beta$.

:::premisli
Lik ima dve osi simetrije, ki se sekata pod kotom $45^\circ$. Kateri lik iz tabele zgoraj bi to lahko bil? Pomagaj si s pravilom o dvakratnem zrcaljenju.
---
Za $2 \cdot 45^\circ = 90^\circ$. Primer je kvadrat: diagonala in srednjica (simetrala stranice) oklepata kot $45^\circ$, kvadrat pa se prekrije pri zasuku za $90^\circ$.
:::

**5. Tlakovanje.** Ravnino **tlakujemo**, ko jo pokrijemo z liki brez vrzeli in brez prekrivanja. Ključ je v oglišču: koti, ki se stikajo v eni točki, dajo skupaj natanko $360^\circ$. Notranji kot pravilnega $n$-kotnika je $\dfrac{(n-2) \cdot 180^\circ}{n}$. Zato ravnino z enim samim pravilnim likom pokrijejo le trikotniki ($6 \cdot 60^\circ$), kvadrati ($4 \cdot 90^\circ$) in šestkotniki ($3 \cdot 120^\circ$). Pravilni petkotnik ima kot $108^\circ$, kar ne deli $360^\circ$.

Z vrtenjem dokažemo presenetljivo dejstvo: **vsak** trikotnik in **vsak** štirikotnik tlakuje ravnino. Lik zasukamo za $180^\circ$ okrog razpolovišča ene stranice in ponavljamo. Pri štirikotniku se v vsakem oglišču srečajo vsi štirje različni koti, vsota kotov štirikotnika pa je ravno $360^\circ$.

*Preizkus:* ali lahko okrog točke položiš tri pravilne petkotnike? Ne, saj $3 \cdot 108^\circ = 324^\circ$ pusti vrzel $36^\circ$.

**6. Sestavljanje in barvanje.** Pri sestavljanju likov je prvi pogoj ploščina: deli morajo skupaj imeti enako ploščino kot lik. To pa ne zadostuje. Močan trik je **šahovsko barvanje** mreže: vsaka domina $1 \times 2$ pokrije eno črno in eno belo polje, ne glede na to, kako jo položiš. Če je črnih in belih polj različno, pokritje z dominami ne obstaja.

*Preizkus:* koliko belih polj pokrije $8$ domin? Natanko $8$.

## Rešeni primeri

### Primer 1 (lažji): ikona ventilatorja

Ikona za hlajenje v nastavitvah telefona je ventilator s $3$ enakimi lopaticami. Vse lopatice so ukrivljene v isto smer (kot vrtavka). Za koliko stopinj moramo ikono najmanj zasukati, da je videti enako? Koliko osi simetrije ima?

**Podatki:** $3$ enake lopatice, enakomerno razporejene okrog središča, vse ukrivljene v isto smer
**Iščemo:** najmanjši vrtilni kot $\alpha$ in število osi simetrije

:::formula
$\alpha = \dfrac{360^\circ}{k}$, kjer je $k$ število leg, v katerih se ikona prekrije sama s sabo; zrcaljenje obrne orientacijo.
:::

**Rešitev:**

1. Ko ikono zasučemo tako, da pride vsaka lopatica na mesto naslednje, je videti enako. Takih leg je v enem obratu $k = 3$.
2. Zato $\alpha = 360^\circ : 3 = 120^\circ$.
3. Zrcaljenje obrne orientacijo, zato bi bile lopatice na sliki ukrivljene v nasprotno smer. Slika se z ikono ne prekrije pri nobeni osi.
4. Odgovor: ikono moramo zasukati za $120^\circ$, osi simetrije pa nima.

### Primer 2: kosi v igri

Igra na telefonu uporablja kose iz $4$ enakih kvadratkov, ki se stikajo s celimi stranicami. Kos lahko na zaslonu vrtiš, obrniti (prezrcaliti) pa ga ne moreš. Koliko različnih kosov potrebuje igra?

**Podatki:** $4$ kvadratki, stik po celih stranicah; dovoljeno je vrtenje, zrcaljenje ni dovoljeno
**Iščemo:** število različnih kosov

:::formula
Najprej preštej vse like, zrcalni par pa štej kot en lik. Lik z osjo simetrije da $1$ kos, lik brez osi pa $2$: sebe in svojo zrcalno sliko.
:::

**Rešitev:**

1. Like razvrstimo po najdaljši vrsti kvadratkov v ravni črti. Vrsta $4$: ravna palica I. Vrsta $3$: četrti kvadratek je pod krajnim (L) ali pod srednjim (T). Vrsta $2$: druga dvojica je točno spodaj (kvadrat O) ali zamaknjena (S). Skupaj $5$ likov.
2. I, O in T imajo os simetrije. Njihova zrcalna slika je kar zasukan isti lik, zato vsak da en kos.
3. L in S nimata osi. Zrcalna slika L je kos J, zrcalna slika S je kos Z. Z vrtenjem ju ne dobimo, ker vrtenje ohrani orientacijo.
4. Število kosov: $3 + 2 \cdot 2 = 7$.
5. Odgovor: igra potrebuje $7$ različnih kosov.

### Primer 3 (težji): obratna naloga s ploščicami

Ovitek za telefon ima vzorec iz pravilnih likov. V vsakem oglišču vzorca se brez vrzeli stikajo kvadrat, pravilni šestkotnik in še en pravilni lik. Koliko oglišč ima ta tretji lik?

**Podatki:** v oglišču so kvadrat ($90^\circ$), pravilni šestkotnik ($120^\circ$) in neznani pravilni $n$-kotnik; skupaj $360^\circ$
**Iščemo:** število oglišč $n$

:::formula
$90^\circ + 120^\circ + x = 360^\circ$ in $x = \dfrac{(n-2) \cdot 180^\circ}{n}$
:::

**Rešitev:**

1. Kot, ki ostane za tretji lik: $360^\circ - 90^\circ - 120^\circ = 150^\circ$.
2. Notranji kot $n$-kotnika mora biti $150^\circ$: $(n-2) \cdot 180 = 150 \cdot n$.
3. Odpravimo oklepaj: $180n - 360 = 150n$, torej $30n = 360$ in $n = 12$.
4. Preverimo: $\dfrac{10 \cdot 180^\circ}{12} = 150^\circ$, kar se ujema.
5. Odgovor: tretji lik je pravilni dvanajstkotnik. Tak vzorec res obstaja in pokrije vso ravnino.

### Primer 4 – zdaj ti: mreža brez kotov

Zaslon igre je mreža $6 \times 6$ polj. Dve nasprotni kotni polji sta zaklenjeni. Ali lahko preostala polja pokriješ z dominami $1 \times 2$ brez prekrivanja?

**Podatki:** mreža $6 \times 6$, odstranjeni dve nasprotni kotni polji, domine $1 \times 2$
**Iščemo:** ali pokritje obstaja

:::formula
Šahovsko barvanje: vsaka domina pokrije $1$ črno in $1$ belo polje.
:::

**Rešitev:**

1. Ostane $36 - 2 = 34$ polj, kar je sodo. Ploščina bi zadostovala za $17$ domin, zato moramo pogledati globlje.
2. Mrežo pobarvamo šahovsko: $18$ črnih in $18$ belih polj. Nasprotni kotni polji ležita na isti diagonali, zato sta iste barve, recimo obe črni.
3. Izračunaj, koliko črnih in belih polj ostane, in sklepaj sam:

:::premisli
Ali pokritje obstaja?
---
Ostane $16$ črnih in $18$ belih polj. $17$ domin bi pokrilo $17$ črnih in $17$ belih, zato pokritje ne obstaja.
:::

## Pogoste napake

- **»Zrcalna slika je samo zasukan lik.«** Učenec misli, da S z vrtenjem dobi Z. Vrtenje pa ohrani orientacijo, zrcaljenje jo obrne. Pri liku brez osi sta zrcalna slika in lik različna. Popravek: preveri, ali ima lik os; šele takrat sta isto.
- **»Kdor se vrti, ima tudi os.«** Paralelogram in ikona ventilatorja se prekrijeta pri zasuku, osi pa nimata. Vrtilna simetrija ne prinese osi. Popravek: osi in vrtenje preveri vsako posebej.
- **»Diagonali pravokotnika sta vedno osi.«** Diagonala pravokotnik razpolovi na dva skladna trikotnika, a to ni zrcaljenje: trikotnika se prekrijeta šele po zasuku. Popravek: os mora vsako oglišče preslikati na oglišče.
- **»Vsak pravilni lik tlakuje.«** Pravilni petkotnik ima kot $108^\circ$, ki ne deli $360^\circ$. Popravek: preveri vsoto kotov v oglišču.
- **»Ploščina se ujema, torej gre.«** Pri mreži brez dveh nasprotnih kotov ploščina ustreza, pokritja pa ni. Popravek: pri dominah vedno poskusi šahovsko barvanje.

## Povzetek

- Zrcaljenje čez os: os je simetrala daljice $PP'$; slika je skladna, orientacija se obrne.
- Vrtenje okrog $O$ za $\alpha$: $|OP'| = |OP|$, orientacija ostane. Zasuk za $180^\circ$ je središčna simetrija.
- Najmanjši vrtilni kot lika je $\dfrac{360^\circ}{k}$. Pravilni $n$-kotnik ima $n$ osi in kot $\dfrac{360^\circ}{n}$.
- Dve zrcaljenji čez osi pod kotom $\beta$ dasta vrtenje za $2\beta$.
- Tlakovanje: koti v oglišču dajo $360^\circ$. Sami pravilni liki: le trikotnik, kvadrat, šestkotnik. Vsak trikotnik in vsak štirikotnik tlakuje.
- Sestavljanje: ploščina je nujen pogoj; šahovsko barvanje pogosto pokaže, da pokritje ne obstaja.
- Pri štetju kosov lik brez osi da dva kosa, če zrcaljenje ni dovoljeno.

## Drugače: Na sliki

Kosa S in Z narišemo s kvadratki:

:::risba skica
opis: Kosa S in Z iz štirih kvadratkov. Pri S sta zgoraj dva kvadratka zamaknjena v desno, spodaj dva v levo. Z je zrcalna slika S čez navpično ogledalo (črtkana črta) med njima.
območje: 0; -0,2 .. 9; 2,4
napis: 0,4; 1 | S | sredina | debelo
pravokotnik: 2; 1 .. 3; 2
pravokotnik: 3; 1 .. 4; 2
pravokotnik: 1; 0 .. 2; 1
pravokotnik: 2; 0 .. 3; 1
črta: 4,75; -0,1 -> 4,75; 2,3 | siva črtkano
napis: 5,1; 1 | Z | sredina | debelo
pravokotnik: 5,5; 1 .. 6,5; 2 | oranžna
pravokotnik: 6,5; 1 .. 7,5; 2 | oranžna
pravokotnik: 6,5; 0 .. 7,5; 1 | oranžna
pravokotnik: 7,5; 0 .. 8,5; 1 | oranžna
:::

Med njima si predstavljaj navpično ogledalo: Z je zrcalna slika S. Zasukaj S za $90^\circ$:

:::risba skica
opis: Kos S, zasukan za 90°: navpično tri vrste. Zgoraj kvadratek levo, v sredini dva kvadratka, spodaj kvadratek desno.
območje: -0,2; -0,2 .. 2,2; 3,2
enota: 40
pravokotnik: 0; 2 .. 1; 3
pravokotnik: 0; 1 .. 1; 2
pravokotnik: 1; 1 .. 2; 2
pravokotnik: 1; 0 .. 2; 1
:::

Zgornji kvadratek je levo, spodnji desno, pa naj S zasukaš v levo ali v desno. Tudi po zasuku za $180^\circ$ je spet S. Z vrtenjem se te »smeri stopnice« ne da zamenjati.

Oglišče vzorca iz Primera 3 si predstavljaj kot torto, razrezano na tri kose: kvadrat vzame $90^\circ$, šestkotnik $120^\circ$, dvanajstkotnik $150^\circ$. Skupaj je cela torta, $360^\circ$.

## Drugače: Bolj natančno

Zakaj sta dve zrcaljenji vrtenje? Naj se osi $p$ in $q$ sekata v $O$ pod kotom $\beta$. Smeri okrog $O$ merimo od premice $p$ v nasprotni smeri urinega kazalca, os $q$ je torej pri $\beta$. Točka $P$ naj leži v smeri $\varphi$. Zrcaljenje čez $p$ jo pošlje v smer $-\varphi$. Zrcaljenje čez $q$ pošlje smer $\psi$ v smer $2\beta - \psi$, torej $-\varphi$ v $2\beta + \varphi$. Točka se je zasukala za $2\beta$, ne glede na $\varphi$, razdalja do $O$ pa se ni spremenila. To je vrtenje okrog $O$ za $2\beta$.

Če sta osi vzporedni, na razdalji $d$, dasta zrcaljenji **vzporedni premik** za $2d$. Prav tako se pri tlakovanju vzorec ponavlja s premiki.

Zakaj so pravilni tlakovalni liki le trije: v oglišču se morajo srečati vsaj trije liki, saj je vsak notranji kot manjši od $180^\circ$. Zato mora biti kot največ $120^\circ$, kar velja le za $n \le 6$. Od $n = 3, 4, 5, 6$ deli $360^\circ$ vsak kot razen $108^\circ$.

Šahovsko barvanje je primer **invariante**: količina »črna polja minus bela polja pod dominami« je vedno $0$, zato je ne more popraviti nobena postavitev.

## Preveri se

? Katera vrstica opisuje pravokotnik, ki ni kvadrat?
- $4$ osi, najmanjši zasuk $90^\circ$
~ To velja za kvadrat. Pri pravokotniku z različnima stranicama se zasuk za $90^\circ$ ne prekrije.
- $2$ osi (diagonali), najmanjši zasuk $180^\circ$
~ Diagonala ni os pravokotnika, saj bi daljšo stranico preslikala na smer krajše.
+ $2$ osi (simetrali stranic), najmanjši zasuk $180^\circ$
- $0$ osi, najmanjši zasuk $180^\circ$
~ To opisuje paralelogram brez pravih kotov. Pravokotnik pa ima dve osi.
> Osi pravokotnika sta simetrali stranic. Prekrije se šele pri zasuku za $180^\circ$.

? Približno koliko pravilnih petkotnikov ($108^\circ$) bi šlo okrog ene točke in kaj to pomeni?
- Natanko $4$, zato tlakujejo.
~ $4 \cdot 108^\circ = 432^\circ$, kar je več kot $360^\circ$: četrti bi se prekrival.
+ Malo več kot $3$, zato ravnine ne tlakujejo.
- Natanko $3$, zato tlakujejo.
~ $3 \cdot 108^\circ = 324^\circ$, ostane vrzel $36^\circ$.
> $360^\circ : 108^\circ \approx 3{,}3$. Število ni celo, zato ostane vrzel ali pride do prekrivanja.

? Zakaj v igri kosa S ne moreš z vrtenjem spremeniti v kos Z?
- Ker ima S vrtilno simetrijo za $180^\circ$.
~ Vrtilna simetrija pove le, da se S prekrije sam s sabo. O tem, ali postane Z, ne pove nič.
- Ker sta S in Z različno velika.
~ Oba imata $4$ kvadratke in sta skladna. Razlikujeta se le po orientaciji.
+ Ker je Z zrcalna slika S, S pa nima osi, vrtenje pa orientacije ne spremeni.
> Vrtenje ohrani orientacijo, zrcaljenje jo obrne. Ker S nima osi, njegova zrcalna slika ni zasukan S.

? Lik ima natanko $6$ osi simetrije, ki se sekajo v eni točki pod enakimi koti. Kolikšen je njegov najmanjši vrtilni kot?
- $30^\circ$
~ $30^\circ$ je kot med sosednjima osema. Dve zrcaljenji dasta zasuk za dvakratni kot.
+ $60^\circ$
- $0^\circ$, ker osi z vrtenjem nimajo zveze.
~ Dve zrcaljenji sta skupaj vrtenje, zato osi pomenijo tudi vrtilno simetrijo.
> Sosednji osi oklepata $180^\circ : 6 = 30^\circ$. Dvakratno zrcaljenje je zasuk za $2 \cdot 30^\circ = 60^\circ$, kot pri pravilnem šestkotniku.

? Iz mreže $5 \times 5$ odstranimo srednje polje. Ali lahko preostanek pokrijemo z dominami $1 \times 2$?
- Ne, ker ima mreža $25$ polj, kar je liho.
~ Srednje polje je odstranjeno, ostane $24$ polj, kar je sodo.
- Ne, ker je črnih polj več kot belih.
~ Kotna polja so črna in srednje tudi. Ostane $12$ črnih in $12$ belih polj, barvanje ne prepove.
+ Da, na primer zunanji obroč iz $16$ polj in notranji obroč iz $8$ polj pokrijemo z dominami po obodu.
> $25 - 1 = 24$ polj, $12$ črnih in $12$ belih. Pokritje obstaja: vsak obroč ima sodo število polj, zato ga domine pokrijejo zaporedoma.

:::simboli
\alpha | najmanjši kot vrtenja | \alpha = \dfrac{360^\circ}{k} | ° | po vrtenju za α se lik prekrije sam s sabo
k | število leg, v katerih se lik prekrije | | – | v enem polnem obratu
x | notranji kot pravilnega n-kotnika | x = \dfrac{(n-2) \cdot 180^\circ}{n} | ° | v primeru: kot tretjega lika v oglišču
n | število oglišč pravilnega n-kotnika | | | n ≥ 3
:::
