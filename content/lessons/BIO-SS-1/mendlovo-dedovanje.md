---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Prvi prizor: šolski bend vadi v telovadnici. Ko bobnar udari s polno močjo, flavte ne slišiš, čeprav flavtistka igra ves čas. Bobni utihnejo in melodija flavte je spet tu, nespremenjena.

Drugi prizor: Ana in Luka sta glasbenika in oba odlično slišita. Njuna hčerka se rodi gluha. Zdravnica razloži, da gre za eno pogostih oblik prirojene gluhosti. Oba starša nosita isto spremenjeno različico gena (alel), a pri njiju je ne opaziš.

Na videz prizora nimata nič skupnega. V obeh pa se nekaj, kar je bilo prekrito, ni izgubilo. Pri dedovanju je to alel, ki se v enem rodu skrije, v naslednjem pa se pokaže. Ko poznaš pravila, po katerih starši predajajo alele, lahko vnaprej izračunaš, s kolikšno verjetnostjo bo lastnost imel otrok, tele ali sadika na vrtu.

## Razlaga

**1. Mamljiva ideja: dedovanje kot mešanje barv.** Še pred dobrimi $150$ leti so skoraj vsi naravoslovci mislili, da se lastnosti staršev pri potomcu zmešajo, kot se rdeča in bela barva zmešata v rožnato. Po tej ideji bi se vsaka lastnost iz roda v rod redčila. Slišeča starša bi lahko imela le slišečega otroka. Ideja zveni razumno, a je poskusi ne potrdijo.

**2. Mendlov poskus z grahom.** Gregor Mendel je v samostanskem vrtu v Brnu križal grah. Rastline z vijoličnimi cvetovi, ki so skozi rodove dajale samo vijolične potomce, je oprašil s cvetnim prahom rastlin z belimi cvetovi. Starše imenujemo starševski rod **P**, njihove potomce prvi rod **F₁**. Vsi potomci F₁ so cveteli vijolično. Bela barva je navidez izginila.

Nato je pustil, da se rastline F₁ oprašijo same. V drugem rodu **F₂** je preštel $705$ vijoličnih in $224$ belih rastlin. Bela barva se je vrnila, enako bela kot pri starih starših, in to pri približno vsaki četrti rastlini. Mešanje tega ne more razložiti: iz zmešane barve ne dobiš nazaj čiste bele.

**3. Popravek: aleli so ločene enote.** Mendel je sklepal, da vsako lastnost določata dva dedna dejavnika. Danes jima rečemo aleli. Alel $V$ da vijolične cvetove, alel $v$ bele.

Zapis obeh alelov rastline, na primer $Vv$, je njen **genotip**, vidna lastnost (barva cveta) pa **fenotip**. Rastlina z enakima aleloma ($VV$ ali $vv$) je **homozigot**, rastlina z različnima ($Vv$) **heterozigot**.

Alel $V$ je **dominanten** (prevladujoč): pri heterozigotu $Vv$ prekrije $v$, tako kot boben prekrije flavto. Alel $v$ je **recesiven** (prikrit): pokaže se le pri homozigotu $vv$. V heterozigotu se alela ne zmešata in ne spremenita.

Pri mejozi se homologna kromosoma ločita. Zato dobi vsaka spolna celica (**gameta**) le en alel vsakega gena. Rastlina $Vv$ naredi polovico gamet z $V$ in polovico z $v$. To je **zakon cepitve** ali zakon o ločevanju alelov.

**4. Punnettov kvadrat.** Na zgornji rob napišemo gamete enega starša, na levi rob gamete drugega. V vsako polje združimo alela iz vrstice in stolpca. Za križanje $Vv \times Vv$ (F₁ s F₁):

| gamete | $V$ | $v$ |
|---|---|---|
| $V$ | $VV$ | $Vv$ |
| $v$ | $Vv$ | $vv$ |

Vsa štiri polja so enako verjetna. Delež oziroma verjetnost preberemo s štetjem polj:

$$p = \frac{k}{m}$$

Tu je $k$ število polj z iskano lastnostjo, $m$ število vseh polj. Genotip $VV$ je v enem polju, $Vv$ v dveh, $vv$ v enem: razmerje genotipov je $1 : 2 : 1$. Vijolični fenotip je v treh poljih, beli v enem: razmerje fenotipov je $3 : 1$. Mendlovih $705 : 224$ je zelo blizu, saj je $705$ približno trikratnik števila $224$.

:::premisli
Iz F₂ naključno izbereš rastlino z vijoličnimi cvetovi. Kolikšna je verjetnost, da je heterozigot $Vv$? Napovej, preden pogledaš.
---
$\frac{2}{3}$, ne $\frac{2}{4}$. Bele rastline si že izločil, zato ostanejo le tri polja: eno $VV$ in dve $Vv$. Torej je $m = 3$ in $k = 2$.
:::

**5. Testno križanje.** Na oko ne ločiš, ali je vijolična rastlina $VV$ ali $Vv$. Zato jo križaš z belo $vv$. Če so vsi potomci vijolični, je bila $VV$. Če je približno polovica belih, je bila $Vv$: polja $Vv$ in $vv$ sta v razmerju $1 : 1$.

**6. Dve lastnosti hkrati.** Mendel je spremljal tudi semena: barvo (rumena $A$, zelena $a$) in obliko (gladka $B$, nagubana $b$). Takemu križanju rečemo **dihibridno**, križanju z eno lastnostjo pa **monohibridno**. Gena ležita na različnih kromosomih. Pri mejozi se kromosomi razporedijo neodvisno, zato heterozigot $AaBb$ naredi štiri enako pogoste gamete: $AB$, $Ab$, $aB$ in $ab$. Na splošno da $n$ heterozigotnih genov $2^n$ vrst gamet.

Pri $AaBb \times AaBb$ ima Punnettov kvadrat $4 \cdot 4 = 16$ polj. Hitreje gre, če vsak gen obravnavaš posebej in verjetnosti zmnožiš. To smemo, ker se gena dedujeta neodvisno: alel za barvo ne vpliva na to, kateri alel za obliko pride v gameto.

$$p = p_1 \cdot p_2$$

Rumena barva ima verjetnost $\frac{3}{4}$, gladka oblika tudi $\frac{3}{4}$. Tako dobimo:

| fenotip semena | potrebni aleli | delež |
|---|---|---|
| rumeno, gladko | vsaj en $A$, vsaj en $B$ | $\frac{9}{16}$ |
| rumeno, nagubano | vsaj en $A$, $bb$ | $\frac{3}{16}$ |
| zeleno, gladko | $aa$, vsaj en $B$ | $\frac{3}{16}$ |
| zeleno, nagubano | $aa$, $bb$ | $\frac{1}{16}$ |

Razmerje je $9 : 3 : 3 : 1$. Mendel je preštel $315$; $101$; $108$ in $32$ semen v tem vrstnem redu. V simulaciji spodaj »Dihibridno križanje« izberi za oba starša $AaBb$ in preštej polja, kjer ni nobene velike črke. Opazi, da je tako polje eno samo od $16$.

**7. Nepopolna dominanca.** Pri nočni lepotici rdeča rastlina $RR$ in bela $rr$ dasta same rožnate potomce $Rr$. Mala črka tu ne pomeni prikritega alela: noben alel ne prevlada. En alel $R$ naredi manj rdečega barvila kot dva, zato je cvet bledejši. Takemu dedovanju rečemo **nepopolna dominanca** ali vmesno dedovanje.

Videti je kot mešanje barv. Križanje $Rr \times Rr$ pa da rdeče, rožnate in bele cvetove v razmerju $1 : 2 : 1$. Rdeča in bela se vrneta čisti, torej se tudi tu alela nista zmešala. Ker ima vsak genotip svoj fenotip, je razmerje fenotipov enako razmerju genotipov.

:::premisli
Rožnato nočno lepotico ($Rr$) oprašiš s cvetnim prahom bele ($rr$). Kakšne cvetove pričakuješ in v kakšnem razmerju?
---
Polovico rožnatih in polovico belih, $1 : 1$. Bela rastlina da le gamete $r$, zato potomec ne more dobiti dveh alelov $R$. Rdečih cvetov ne bo.
:::

## Rešeni primeri

### Primer 1: Zborovska pevca

Neja in Matic pojeta v zboru in oba slišita. Genetski test je pokazal, da sta oba prenašalca alela za prirojeno gluhost: njun genotip je $Ss$. Alel $S$ (sluh) je dominanten, alel $s$ recesiven. Kolikšna je verjetnost, da bo njun otrok gluh? In kolikšna, da bo slišeč prenašalec?

**Podatki:** mati $Ss$, oče $Ss$; $S$ dominanten (sluh), $s$ recesiven (gluhost)
**Iščemo:** verjetnost $p$ za genotip $ss$ in za genotip $Ss$

:::formula
Punnettov kvadrat $2 \times 2$, nato $p = \dfrac{k}{m}$
:::

**Rešitev:**

1. Gamete: vsak starš da $S$ ali $s$, vsako v polovici primerov (zakon cepitve).
2. Kvadrat ima $m = 4$ enako verjetna polja: $SS$, $Ss$, $Ss$, $ss$.
3. Gluh je le otrok $ss$, to je eno polje: $p = \frac{1}{4} = 0{,}25$.
4. Slišeč prenašalec je $Ss$, ki je v dveh poljih: $p = \frac{2}{4} = 0{,}5$.
5. Odgovor: otrok bo gluh z verjetnostjo $25\,\%$ in slišeč prenašalec s $50\,\%$.

### Primer 2: Nočne lepotice na balkonu

Vrtnarka je oprašila dve rožnati nočni lepotici. Iz semen je vzgojila $80$ rastlin. Koliko rastlin z rdečimi, rožnatimi in belimi cvetovi lahko pričakuje?

**Podatki:** starša $Rr \times Rr$ (oba rožnata), nepopolna dominanca, $N = 80$ potomcev
**Iščemo:** pričakovano število $E$ rastlin za vsako barvo

:::formula
$E = p \cdot N$
:::

**Rešitev:**

1. Vsak starš da gamete $R$ in $r$ v razmerju $1 : 1$.
2. Kvadrat da $RR$, $Rr$, $Rr$, $rr$. Ker je dominanca nepopolna, ima vsak genotip svojo barvo.
3. Rdeča ($RR$): $E = \frac{1}{4} \cdot 80 = 20$.
4. Rožnata ($Rr$, dve polji): $E = \frac{1}{2} \cdot 80 = 40$.
5. Bela ($rr$): $E = \frac{1}{4} \cdot 80 = 20$.
6. Preverba: $20 + 40 + 20 = 80$, vse rastline so zajete.
7. Odgovor: pričakuje okoli $20$ rdečih, $40$ rožnatih in $20$ belih. Pravo število bo malo odstopalo, ker je razmerje verjetnostno.

### Primer 3: Koliko zelenih gladkih semen?

Mendel je vzgojil rastline F₁ z genotipom $AaBb$ in jih pustil, da se oprašijo same. Dobil je $556$ semen. Koliko zelenih gladkih semen bi pričakovali? Primerjaj z Mendlovim štetjem: $108$.

**Podatki:** $AaBb \times AaBb$; $A$ rumena, $a$ zelena, $B$ gladka, $b$ nagubana; $N = 556$ semen; prešteto $108$ zelenih gladkih
**Iščemo:** pričakovano število zelenih gladkih semen $E$

:::formula
$p = p_1 \cdot p_2$, nato $E = p \cdot N$
:::

**Rešitev:**

1. Gena sta na različnih kromosomih, zato vsakega obravnavamo posebej.
2. Barva, $Aa \times Aa$: zeleno je le $aa$, zato $p_1 = \frac{1}{4}$.
3. Oblika, $Bb \times Bb$: gladko je $BB$ ali $Bb$, zato $p_2 = \frac{3}{4}$.
4. Obe lastnosti hkrati: $p = \frac{1}{4} \cdot \frac{3}{4} = \frac{3}{16}$.
5. Pričakovano število: $E = \frac{3}{16} \cdot 556 = 104{,}25$, torej približno $104$ semen.
6. Odgovor: pričakujemo okoli $104$ zelenih gladkih semen. Mendel jih je preštel $108$, kar se lepo ujema.

### Primer 4 – zdaj ti

Rumeno gladko rastlino $AaBb$ križaš z zeleno nagubano $aabb$ in dobiš $200$ semen. Koliko zelenih nagubanih semen pričakuješ?

**Podatki:** $AaBb \times aabb$; $A$ rumena, $a$ zelena, $B$ gladka, $b$ nagubana; $N = 200$ semen
**Iščemo:** pričakovano število zelenih nagubanih semen $E$

:::formula
$p = p_1 \cdot p_2$, nato $E = p \cdot N$
:::

**Rešitev:**

1. Rastlina $aabb$ da samo gamete $ab$, zato potomca določi gameta drugega starša.
2. Barva, $Aa \times aa$: zeleno je $aa$, zato $p_1 = \frac{1}{2}$.
3. Oblika, $Bb \times bb$: nagubano je $bb$, zato $p_2 = \frac{1}{2}$.
4. Izračunaj $p$ in $E$ sam, nato preveri:

:::premisli
Koliko sta $p$ in $E$?
---
$p = \frac{1}{2} \cdot \frac{1}{2} = \frac{1}{4}$ in $E = \frac{1}{4} \cdot 200 = 50$. Vse štiri vrste semen so enako pogoste, razmerje je $1 : 1 : 1 : 1$.
:::

## Pogoste napake

- **»Dominantni alel je pogostejši.«** Učenec sklepa: če alel prevlada, ga ima večina ljudi. Dominanca pa pove le, kateri alel se pokaže pri heterozigotu. Alel za šest prstov na roki je dominanten, a zelo redek. Razmerje $3 : 1$ velja le za potomce dveh heterozigotov.
- **Gameta z dvema aleloma istega gena.** Na rob kvadrata nekdo napiše $Aa$ ali $AaBb$. Gameta je haploidna, zato ima en alel vsakega gena: $AaBb$ da $AB$, $Ab$, $aB$, $ab$, nikoli $Aa$.
- **Razmerje fenotipov namesto razmerja genotipov.** Pri $Ss \times Ss$ učenec reče, da je heterozigotov $\frac{3}{4}$, ker »tri polja slišijo«. Med temi tremi polji je tudi $SS$. Heterozigot je v dveh poljih od štirih, torej $\frac{1}{2}$.
- **»Prvi otrok je gluh, zato bodo naslednji trije slišali.«** Razmerje $3 : 1$ ni urnik. Gamete nastanejo za vsakega otroka znova, zato je verjetnost pri vsakem otroku spet $\frac{1}{4}$. Tudi družina s štirimi gluhimi otroki je mogoča, le redka.
- **»Rožnati cvetovi dokazujejo mešanje.«** Pri nepopolni dominanci je heterozigot vmesen, alela pa ostaneta nespremenjena. To dokaže F₂, kjer se rdeča in bela vrneta čisti.

## Povzetek

- Lastnost določata dva alela, ki se pri potomcu ne zmešata; vsaka gameta dobi en alel vsakega gena (zakon cepitve).
- Dominantni alel se pokaže že pri heterozigotu, recesivni le pri homozigotu.
- Punnettov kvadrat: gamete na rob, potomci v polja, delež je $p = \frac{k}{m}$; pričakovano število $E = p \cdot N$.
- Monohibridno križanje $Aa \times Aa$: genotipi $1 : 2 : 1$, fenotipi $3 : 1$. Testno križanje $Aa \times aa$: $1 : 1$.
- Dihibridno križanje $AaBb \times AaBb$: geni na različnih kromosomih se dedujejo neodvisno, $p = p_1 \cdot p_2$, fenotipi $9 : 3 : 3 : 1$.
- Nepopolna dominanca: heterozigot je vmesen (rožnata nočna lepotica), fenotipi in genotipi so v razmerju $1 : 2 : 1$.
- Razmerja so verjetnosti; vsak potomec je nov, neodvisen dogodek.

## Drugače: Kot zgodba

Sledimo enemu alelu $s$ skozi tri rodove glasbene družine.

Dedek Jože je igral harmoniko in dobro slišal. V svojih celicah je nosil en alel $s$, a za to ni vedel, saj ga je prekril $S$. Ko so v njegovem telesu nastajale spolne celice, je alel $s$ zašel v polovico njih. Ena takih celic je dala življenje hčerki Ani.

Ana je pela v zboru in tudi slišala. Tudi ona je bila $Ss$. Alel $s$ se v njej ni prav nič spremenil, ni se »razredčil« in ni oslabel. Čakal je.

Ana je spoznala Luko, bobnarja. Tudi Luka je po naključju nosil en $s$. Pri vsakem njunem otroku je iz vsakega starša prišla ena gameta: lahko z $S$, lahko z $s$. Ko sta se srečala alela $s$ in $s$, se je rodila deklica, ki ne sliši. Alel, ki se dva rodova ni pokazal, je bil ves čas tu.

Ko se bo Ani in Luki rodil naslednji otrok, se zgodba začne od začetka: spet ena gameta od vsakega, spet verjetnost $\frac{1}{4}$ za gluhost.

## Drugače: Korak za korakom s številkami

Vzemimo križanje $Ss \times ss$ in nato $AaBb \times AaBb$.

1. **Zapiši genotipa staršev.** $Ss$ in $ss$.
2. **Zapiši gamete.** $Ss$ da $S$ in $s$; $ss$ da le $s$.
3. **Sestavi kvadrat.** Polja so $Ss$, $Ss$, $ss$, $ss$, torej $m = 4$.
4. **Preštej.** Gluhi $ss$: $k = 2$, zato $p = \frac{2}{4} = 0{,}5$.
5. **Pomnoži s številom potomcev.** Če ima več takih družin skupaj $N = 10$ otrok, je pričakovano število gluhih $E = 0{,}5 \cdot 10 = 5$.

Pri dveh genih ponovi korake 2 do 4 za vsak gen posebej, nato zmnoži:

1. Rumena pri $Aa \times Aa$: $p_1 = \frac{3}{4}$. Gladka pri $Bb \times Bb$: $p_2 = \frac{3}{4}$.
2. Rumena in gladka hkrati: $p = \frac{3}{4} \cdot \frac{3}{4} = \frac{9}{16}$.
3. Zelena in nagubana: $p = \frac{1}{4} \cdot \frac{1}{4} = \frac{1}{16}$.
4. Preverba: $\frac{9}{16} + \frac{3}{16} + \frac{3}{16} + \frac{1}{16} = 1$.

## Preveri se

? Pri nočni lepotici ima rastlina $RR$ rdeče cvetove, $rr$ bele, $Rr$ pa rožnate. Kako imenujemo tak način dedovanja?
- mešanje dednih lastnosti
~ Mešanje ne razloži, zakaj se v F₂ vrneta čista rdeča in čista bela. Alela ostaneta nespremenjena.
+ nepopolna dominanca
- recesivno dedovanje bele barve
~ Če bi bil alel za belo recesiven, bi bila rastlina $Rr$ rdeča kot $RR$. Rožnata barva kaže, da noben alel ne prevlada.
- dihibridno križanje
~ Dihibridno križanje spremlja dva gena hkrati. Tu gre za en gen z dvema aleloma.
> Pri nepopolni dominanci je heterozigot vmesen, zato ima vsak genotip svoj fenotip.

? Križamo $AaBb \times AaBb$ ($A$ rumena, $B$ gladka). Razvrsti fenotipe rumeno gladko, zeleno gladko in zeleno nagubano od najpogostejšega do najredkejšega.
+ rumeno gladko, zeleno gladko, zeleno nagubano
- zeleno nagubano, zeleno gladko, rumeno gladko
~ Fenotip z obema recesivnima lastnostma je najredkejši, ker zahteva $aa$ in $bb$ hkrati: $\frac{1}{16}$.
- zeleno gladko, rumeno gladko, zeleno nagubano
~ Zeleno gladko zahteva recesivni $aa$ z verjetnostjo $\frac{1}{4}$, zato je le $\frac{3}{16}$. Rumeno gladko ($\frac{9}{16}$) je pogostejše.
- vsi trije so enako pogosti
~ Enake deleže $1 : 1 : 1 : 1$ da testno križanje z $aabb$, ne križanje dveh dihibridov.
> Deleži so $\frac{9}{16}$, $\frac{3}{16}$ in $\frac{1}{16}$, ker $p = p_1 \cdot p_2$.

? Kaj se zgodi, če vijolično rastlino graha $Vv$ križaš z belo $vv$?
- Vsi potomci bodo vijolični.
~ Tako bi bilo, če bi bila vijolična rastlina $VV$. Heterozigot polovici potomcev preda alel $v$.
+ Približno polovica potomcev bo vijoličnih in polovica belih.
- Približno četrtina potomcev bo belih.
~ Četrtina belih nastane pri $Vv \times Vv$. Tu drugi starš da le $v$, zato je belih polovica.
- Potomci bodo svetlo vijolični.
~ Pri grahu je vijolična barva popolnoma dominantna, heterozigot ni vmesen.
> Gameti $V$ in $v$ se srečata z gameto $v$: $Vv$ in $vv$ v razmerju $1 : 1$. S tem testnim križanjem prepoznaš heterozigota.

? Križaš dve rastlini $Vv$ in dobiš $400$ semen. Koliko heterozigotov $Vv$ pričakuješ?
- $100$
~ To je četrtina, delež enega polja. Heterozigot je v dveh poljih od štirih.
+ $200$
- $300$
~ To je število vijoličnih rastlin (fenotip). Med njimi so tudi homozigoti $VV$.
- $267$
~ To so $\frac{2}{3}$ od $400$. Delež $\frac{2}{3}$ velja le med vijoličnimi, vprašanje pa šteje vse potomce.
> $p = \frac{2}{4} = \frac{1}{2}$, zato $E = \frac{1}{2} \cdot 400 = 200$.

? Ana in Luka (oba $Ss$) imata gluho hčerko. Kolikšna je verjetnost, da bo gluh tudi njun drugi otrok?
- $0$, ker je »gluha četrtina« že rojena
~ Razmerje $3 : 1$ ni urnik. Gamete za drugega otroka nastanejo znova.
+ $\frac{1}{4}$
- $\frac{1}{16}$
~ $\frac{1}{4} \cdot \frac{1}{4}$ je verjetnost, da sta gluha oba otroka, gledano pred prvim rojstvom. Prvi otrok je že rojen.
- $\frac{3}{4}$
~ To je verjetnost, da bo otrok slišal, ne da bo gluh.
> Vsak otrok je neodvisen dogodek: $p = \frac{1}{4}$ ne glede na prejšnje otroke.

<<RACUN
vrednost: 1/4 | 0.25
vrednost: 2/4 | 0.5
vrednost: 80/4 | 20
vrednost: 80/2 | 40
vrednost: 20+40+20 | 80
vrednost: 1/4*3/4 | 3/16
vrednost: 3/16*556 | 104.25
vrednost: 1/2*1/2 | 1/4
vrednost: 1/4*200 | 50
vrednost: 3/4*3/4 | 9/16
vrednost: 1/4*1/4 | 1/16
vrednost: 9/16+3/16+3/16+1/16 | 1
vrednost: 1/2*400 | 200
vrednost: 2^2 | 4
vrednost: 4*4 | 16
vrednost: 0.5*10 | 5
>>

:::simboli
p | verjetnost (delež) potomcev z lastnostjo | p = \dfrac{k}{m} | – | število med 0 in 1
k | število polj z iskano lastnostjo | | –
m | število vseh enako verjetnih polj, ki jih upoštevamo | | – | navadno ves Punnettov kvadrat
p_1, p_2 | verjetnost lastnosti prvega oziroma drugega gena | | –
E | pričakovano število potomcev z lastnostjo | E = p \cdot N | –
N | število vseh potomcev | | –
:::
