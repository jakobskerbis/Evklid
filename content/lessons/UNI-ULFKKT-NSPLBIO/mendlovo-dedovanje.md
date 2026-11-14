---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Gregor Mendel je med letoma $1856$ in $1863$ v samostanskem vrtu v Brnu vzgojil več deset tisoč rastlin graha. Ko je križal rastline z okroglimi in z nagubanimi semeni, so bila vsa semena potomcev okrogla. Ko so se te rastline samooprašile, je dobil $5474$ okroglih in $1850$ nagubanih semen. Takrat razširjena razlaga, da se lastnosti staršev zmešajo kot barve, ne pojasni dveh stvari: v prvi generaciji ni bilo »napol nagubanih« semen, v drugi pa so se nagubana semena vrnila nespremenjena, in to v razmerju skoraj natanko $3 : 1$. Mendel je iz teh števil sklepal na dedne »delce«, ki se ne mešajo. Na istem sklepanju danes temelji žlahtnjenje v semenarskih podjetjih, ki prodajajo hibridno seme koruze, paradižnika in sončnic, in genetsko svetovanje.

## Razlaga

### Blok 1: gen, alel, genotip

**Definicija.** **Gen** je dedna enota za neko lastnost (pri grahu za obliko semena). **Alel** je ena od različic gena ($R$ za okroglo, $r$ za nagubano). Vsak diploidni organizem ima za vsak gen **dva** alela, enega od matere in enega od očeta. **Genotip** je par alelov ($RR$, $Rr$, $rr$), **fenotip** pa opazna lastnost (okroglo ali nagubano).

Organizem z enakima aleloma ($RR$ ali $rr$) je **homozigot**, z različnima ($Rr$) **heterozigot**. Alel je **dominanten**, če se izrazi že v heterozigotu; **recesiven** alel se pokaže le v homozigotu. Dominantni alel pišemo z veliko črko.

*Preveri:* ima rastlina z nagubanimi semeni lahko genotip $Rr$? (Ne: nagubanost je recesivna, zato je rastlina $rr$.)

### Blok 2: zakon segregacije

**Izrek (Mendlov prvi zakon, zakon segregacije).** Naj bo gen avtosomen (ne na spolnem kromosomu) in naj imajo vse spolne celice in vsi potomci enake možnosti za preživetje. Potem gresta alela starša pri nastanku spolnih celic (gamet) narazen: vsaka gameta dobi natanko enega, vsakega z verjetnostjo $\tfrac{1}{2}$. Ob oploditvi se gameti združujeta naključno.

Danes vemo, zakaj: alela ležita na homolognih kromosomih, ki se pri mejozi razporedita v različni celici. Podrobneje mejozo spoznaš v lekciji o celičnem ciklu.

**Punnettova shema** je tabela, v kateri so v vrstici gamete enega starša, v stolpcu gamete drugega, v celicah pa genotipi potomcev. Križanje $Rr \times Rr$:

| | $R$ | $r$ |
|---|---|---|
| $R$ | $RR$ | $Rr$ |
| $r$ | $Rr$ | $rr$ |

Vsaka celica ima verjetnost $\tfrac{1}{4}$. Genotipi so v razmerju $RR : Rr : rr = 1 : 2 : 1$, fenotipi pa okroglo : nagubano $= 3 : 1$, ker sta $RR$ in $Rr$ oba okrogla.

**Poimenovanje generacij.** Starša sta generacija P, njuni potomci F1, potomci F1 med seboj F2. Križanje dveh čistih linij ($RR \times rr$) da enotno F1 ($Rr$), F2 pa razcepi $3 : 1$.

:::premisli
Zakaj se je v F2 nagubano seme pojavilo nespremenjeno, čeprav ga v F1 ni bilo? Kaj bi napovedalo »mešanje« lastnosti?
---
V F1 je bil alel $r$ prisoten, le skrit ob dominantnem $R$. Ker se ne pomeša z $R$, gre v polovico gamet nespremenjen; dve taki gameti dasta $rr$ z verjetnostjo $\tfrac{1}{4}$. Mešanje bi dalo v F1 vmesno obliko, v F2 pa spet le vmesne oblike, brez vrnitve nagubanih semen.
:::

### Blok 3: testno križanje

Okrogel fenotip je lahko $RR$ ali $Rr$. Genotip razkrije **testno križanje**: osebek križamo z recesivnim homozigotom $rr$. Ta da le gamete $r$, zato fenotip potomca neposredno pokaže alel, ki ga je dal testirani osebek.

- $RR \times rr$: vsi potomci $Rr$, okrogli.
- $Rr \times rr$: polovica $Rr$, polovica $rr$, razmerje $1 : 1$.

*Preveri:* med $40$ potomci testnega križanja je $19$ nagubanih. Kakšen je testirani osebek? ($Rr$, saj bi $RR$ dal same okrogle.)

### Blok 4: zakon neodvisnega razporejanja

**Izrek (Mendlov drugi zakon).** Naj bosta gena na različnih kromosomih (oziroma tako daleč narazen, da se dedujeta neodvisno) in naj veljajo pogoji prvega zakona. Potem se alela enega gena razporedita v gamete neodvisno od alelov drugega gena. Dihibrid $RrYy$ da štiri vrste gamet $RY$, $Ry$, $rY$, $ry$, vsako z verjetnostjo $\tfrac{1}{4}$.

*Izpeljava razmerja $9 : 3 : 3 : 1$.* Pri križanju $RrYy \times RrYy$ je verjetnost dominantnega fenotipa za vsak gen $\tfrac{3}{4}$, recesivnega $\tfrac{1}{4}$. Ker sta gena neodvisna, se verjetnosti množita (**pravilo produkta**):

- oba dominantna: $\tfrac{3}{4} \cdot \tfrac{3}{4} = \tfrac{9}{16}$;
- prvi dominanten, drugi recesiven: $\tfrac{3}{16}$, in obratno $\tfrac{3}{16}$;
- oba recesivna: $\tfrac{1}{16}$.

Tabela $4 \times 4$ da isto, a pravilo produkta je hitrejše in deluje tudi za tri ali več genov.

### Blok 5: kadar razmerje ni 3 : 1

Mendlova zakona veljata tudi tu; drugačen je le odnos med aleli.

- **Nepopolna dominantnost:** heterozigot ima vmesen fenotip. Pri zajčkih (*Antirrhinum*) da rdeč × bel rožnato F1; F2 je rdeč : rožnat : bel $= 1 : 2 : 1$, fenotipi so enaki genotipom.
- **Kodominantnost:** heterozigot izrazi oba alela hkrati. Krvna skupina AB ima na eritrocitih oba antigena; alel $i$ (skupina 0) je recesiven do obeh.
- **Letalni aleli:** pri miših je alel za rumeno dlako dominanten glede barve, v homozigotu pa smrten pred rojstvom. Rumena × rumena da rumene : nerumene $= 2 : 1$, ker manjka četrtina homozigotov.

*Preveri:* starša s krvnima skupinama A ($I^Ai$) in B ($I^Bi$). Katere skupine imajo lahko otroci? (A, B, AB in 0, vsaka z verjetnostjo $\tfrac{1}{4}$.)

### Blok 6: rodovniki

Pri človeku križanj ne izbiramo, zato dedovanje beremo iz **rodovnika**: kvadrat je moški, krog ženska, polno znamenje oseba z lastnostjo, vodoravna črta zakon, navpična potomce.

```
 I    □───○        zdrava starša
        │
 II   ┌─┼───┐
      ■ ○   □      bolan sin,
                   zdrava otroka
```

Tipični vzorci:

- **Avtosomno recesivno:** bolni otroci zdravih staršev, lastnost preskoči generacije, oba spola enako pogosto. Zdrava starša bolnega otroka sta oba $Aa$.
- **Avtosomno dominantno:** vsaka bolna oseba ima bolnega starša, lastnost ne preskakuje generacij; bolan heterozigot z zdravim partnerjem ima bolnega otroka z verjetnostjo $\tfrac{1}{2}$.
- **X-vezano recesivno** (barvna slepota, hemofilija): večinoma bolni moški, ki lastnost dobijo od zdrave matere prenašalke; nikoli od očeta na sina, ker sin dobi od očeta kromosom Y.

**Pogojna verjetnost v rodovniku.** Zdrav brat bolnega otroka na sliki je $AA$ ali $Aa$. Iz Punnettove sheme $Aa \times Aa$ izločimo $aa$ (vemo, da je zdrav); ostanejo $AA$, $Aa$, $Aa$, zato je prenašalec z verjetnostjo $\tfrac{2}{3}$, ne $\tfrac{1}{2}$.

:::premisli
Zakaj sin ne more podedovati X-vezane barvne slepote od očeta, hči pa jo lahko?
---
Sin dobi od očeta kromosom Y, kromosom X pa od matere. Hči dobi očetov X, zato vsaka hči barvno slepega očeta podeduje alel; barvno slepa je, če dobi alel tudi od matere.
:::

### Blok 7: se podatki ujemajo z razmerjem?

Prave številke nikoli niso točno $3 : 1$. Ali je odstopanje naključno, pove test **hi-kvadrat**. Za vsak razred potomcev primerjamo opaženo število $O$ s pričakovanim $E$:

$$\chi^2 = \sum \frac{(O - E)^2}{E}.$$

Število prostostnih stopenj je število razredov manj ena. Pri $1$ prostostni stopnji je meja pri stopnji značilnosti $0{,}05$ enaka $3{,}84$, pri $3$ prostostnih stopnjah $7{,}81$. Če je $\chi^2$ manjši od meje, odstopanje lahko pripišemo naključju in hipoteze ne zavrnemo.

*Preveri:* v Mendlovih podatkih $5474 : 1850$ je pričakovano $5493$ in $1831$. Je $\chi^2$ večji ali manjši od $1$? (Manjši: $\chi^2 \approx 0{,}26$.)

## Rešeni primeri

### Primer 1 (lažji)

Semenarsko podjetje vzgaja paradižnik. Rdeč plod ($R$) je dominanten nad rumenim ($r$). Dve heterozigotni rastlini oprašijo med seboj in posejejo $400$ semen. Koliko sadik pričakujemo z rdečimi in koliko z rumenimi plodovi? Kako bi ugotovili, katere rdeče sadike so čiste linije?

**Podatki:** starša $Rr \times Rr$, $R$ (rdeč) dominanten nad $r$ (rumen), $n = 400$ sadik
**Iščemo:** pričakovano število rdečih in rumenih sadik, postopek za čiste linije

:::formula
$Rr \times Rr$: fenotipi $3 : 1$; testno križanje z $rr$
:::

**Rešitev:**

1. Vsak starš da gamete $R$ in $r$ z verjetnostjo $\tfrac{1}{2}$, zato $P(rr) = \tfrac{1}{2} \cdot \tfrac{1}{2} = \tfrac{1}{4}$.
2. Rumenih: $400 \cdot \tfrac{1}{4} = 100$; rdečih: $400 - 100 = 300$.
3. Med rdečimi je tretjina $RR$ in dve tretjini $Rr$. Vsako rdečo rastlino križamo z rumeno ($rr$).
4. Odgovor: pričakujemo okoli $300$ rdečih in $100$ rumenih sadik. Čiste linije so tiste rdeče rastline, ki v testnem križanju dajo same rdeče potomce.

### Primer 2

Podjetje prodaja seme zajčkov z rožnatimi cvetovi. Barva je nepopolno dominantna: $C^RC^R$ rdeča, $C^RC^W$ rožnata, $C^WC^W$ bela. Vrtnar ohrani seme svojih rožnatih rastlin in ga poseje: zraste $240$ rastlin. Koliko je pričakovano rdečih, rožnatih in belih? Kako mora podjetje pridelovati seme, da so vse rastline rožnate?

**Podatki:** nepopolna dominantnost, $C^RC^R$ rdeč, $C^RC^W$ rožnat, $C^WC^W$ bel; križanje rožnata × rožnata, $n = 240$
**Iščemo:** pričakovano število rastlin po barvah, način pridelave rožnatega semena

:::formula
rožnata × rožnata (heterozigota): $1 : 2 : 1$; vsak genotip ima svoj fenotip
:::

**Rešitev:**

1. Rožnati starš je heterozigot. Punnettova shema da $C^RC^R : C^RC^W : C^WC^W = 1 : 2 : 1$.
2. Pri nepopolni dominantnosti ima vsak genotip svoj fenotip, zato je razmerje barv enako.
3. Rdečih: $240/4 = 60$; rožnatih: $240/2 = 120$; belih: $60$.
4. Vse potomke so rožnate le pri križanju $C^RC^R \times C^WC^W$, ker vsaka dobi en alel od vsakega starša.
5. Odgovor: pričakujemo $60$ rdečih, $120$ rožnatih in $60$ belih rastlin. Podjetje mora vsako leto znova križati rdečo in belo čisto linijo; zato se hibridno seme kupuje vsako leto.

### Primer 3 (težji)

Mendel je križal čisti liniji z okroglimi rumenimi ($RRYY$) in nagubanimi zelenimi semeni ($rryy$). Rastline F1 je samooplodil in v F2 dobil $315$ okroglih rumenih, $108$ okroglih zelenih, $101$ nagubano rumeno in $32$ nagubanih zelenih semen. a) Ali se podatki ujemajo z razmerjem $9 : 3 : 3 : 1$ (stopnja značilnosti $0{,}05$)? b) S kolikšno verjetnostjo je naključno izbrana okrogla rumena rastlina F2 dvojni heterozigot? c) Kaj bi dalo testno križanje take rastline?

**Podatki:** F2: $315$ okroglih rumenih, $108$ okroglih zelenih, $101$ nagubanih rumenih, $32$ nagubanih zelenih; $R$ okroglo, $Y$ rumeno, oba dominantna; meja $\chi^2$ pri $3$ prostostnih stopnjah $7{,}81$
**Iščemo:** $\chi^2$ in sklep, $P(RrYy \mid$ okrogla rumena$)$, izid testnega križanja

:::formula
$\chi^2 = \sum \dfrac{(O - E)^2}{E}$; pravilo produkta za neodvisna gena
:::

**Rešitev:**

1. Skupaj: $315 + 108 + 101 + 32 = 556$ semen.
2. Pričakovana števila: $556 \cdot \tfrac{9}{16} = 312{,}75$; $556 \cdot \tfrac{3}{16} = 104{,}25$ (dvakrat); $556 \cdot \tfrac{1}{16} = 34{,}75$.
3. Prispevki: okrogla rumena $2{,}25^2/312{,}75 \approx 0{,}016$; okrogla zelena $3{,}75^2/104{,}25 \approx 0{,}135$; nagubana rumena $3{,}25^2/104{,}25 \approx 0{,}101$; nagubana zelena $2{,}75^2/34{,}75 \approx 0{,}218$.
4. $\chi^2 \approx 0{,}47$. Razredi so štirje, zato so prostostne stopnje $3$; $0{,}47 < 7{,}81$.
5. b) Med $9$ okroglimi rumenimi kombinacijami je za vsak gen razmerje $RR : Rr = 1 : 2$, torej $P(Rr) = \tfrac{2}{3}$ in $P(Yy) = \tfrac{2}{3}$.
6. Gena sta neodvisna: $P(RrYy) = \tfrac{2}{3} \cdot \tfrac{2}{3} = \tfrac{4}{9}$.
7. c) $RrYy \times rryy$: testirana rastlina da štiri vrste gamet enako pogosto, $rryy$ le $ry$.
8. Odgovor: $\chi^2 \approx 0{,}47$ je daleč pod mejo, zato odstopanje pripišemo naključju; podatki se ujemajo z neodvisnim razporejanjem. Okrogla rumena rastlina je dvojni heterozigot z verjetnostjo $\tfrac{4}{9}$; njeno testno križanje da okrogla rumena, okrogla zelena, nagubana rumena in nagubana zelena semena v razmerju $1 : 1 : 1 : 1$.

### Primer 4 – zdaj ti

Albinizem je avtosomno recesiven. Zdrava starša imata albino sina in zdravo hčer. Hči se poroči z zdravim moškim, za katerega genetski test pokaže, da je prenašalec ($Aa$). Kolikšna je verjetnost, da bo njun prvi otrok albino?

**Podatki:** avtosomno recesivno dedovanje; starša hčere zdrava, njen brat albino; hči zdrava; mož $Aa$
**Iščemo:** verjetnost, da je prvi otrok $aa$

:::formula
$P(\text{hči } Aa) = \tfrac{2}{3}$; $P(aa \mid Aa \times Aa) = \tfrac{1}{4}$
:::

**Rešitev:**

1. Albino sin je $aa$, zato sta oba zdrava starša $Aa$.
2. Hči je zdrava: iz $AA$, $Aa$, $Aa$ je prenašalka z verjetnostjo $\tfrac{2}{3}$.
3. Dokončaj sam: kdaj bo otrok albino in kako združiš verjetnosti?

:::premisli
Kolikšna je verjetnost?
---
Otrok je albino le, če je hči $Aa$ in hkrati oba starša dasta alel $a$: $P = \tfrac{2}{3} \cdot \tfrac{1}{4} = \tfrac{1}{6}$. Pogosta napaka je $\tfrac{1}{4}$, kot da bi bilo gotovo, da je hči prenašalka.
:::

## Pogoste napake

- **Razmerje kot zagotovilo.** »Imata tri zdrave otroke, četrti bo gotovo bolan.« Verjetnost $\tfrac{1}{4}$ velja za vsakega otroka posebej; prejšnji otroci nanjo ne vplivajo, ker so oploditve neodvisne.
- **$\tfrac{1}{2}$ namesto $\tfrac{2}{3}$.** Pri zdravem sorojencu bolnega otroka vemo, da ni $aa$. Ostanejo trije enako verjetni izidi, od katerih sta dva $Aa$.
- **Dominanten pomeni pogost.** Dominantnost pove le, kateri alel se izrazi v heterozigotu. Polidaktilija je dominantna in redka, krvna skupina 0 recesivna in pogosta.
- **Seštevanje namesto množenja.** Za »oba dogodka hkrati« pri neodvisnih genih verjetnosti množimo ($\tfrac{3}{4} \cdot \tfrac{3}{4}$), za »eden ali drugi izključujoči« jih seštejemo.
- **Prenos X-vezane lastnosti z očeta na sina.** Sin od očeta dobi kromosom Y, zato barvno slep oče ne more prenesti alela na sina.

## Povzetek

- Gen ima alele; diploiden organizem ima dva; genotip ($RR$, $Rr$, $rr$) določa fenotip.
- Prvi zakon: alela gresta v gamete narazen, vsak z verjetnostjo $\tfrac{1}{2}$; $Rr \times Rr$ da $1 : 2 : 1$ in $3 : 1$.
- Testno križanje z $rr$ razkrije genotip: $1 : 1$ pomeni heterozigot.
- Drugi zakon: geni na različnih kromosomih se razporejajo neodvisno; dihibrid da $9 : 3 : 3 : 1$, verjetnosti se množijo.
- Nepopolna dominantnost $1 : 2 : 1$, kodominantnost (AB), letalni alel $2 : 1$.
- Rodovniki: AR preskakuje generacije, AD ne, X-vezano recesivno večinoma moški, brez prenosa z očeta na sina; zdrav sorojenec bolnega je prenašalec z $\tfrac{2}{3}$.
- Test $\chi^2 = \sum (O - E)^2/E$ s prostostnimi stopnjami razredi manj ena.

## Za izpit

Znati moraš povedati:

- definicije gena, alela, genotipa, fenotipa, homozigota, heterozigota, dominantnosti in recesivnosti;
- oba Mendlova zakona s pogoji in izpeljavo razmerij $3 : 1$, $1 : 2 : 1$ in $9 : 3 : 3 : 1$;
- zakaj Mendlovi podatki zavrnejo dedovanje z mešanjem;
- nepopolno dominantnost, kodominantnost in letalne alele s primerom in razmerjem;
- prepoznavanje AR, AD in X-vezanega recesivnega dedovanja v rodovniku in računanje verjetnosti s pogojem.

### Naloga 1

Ženska z normalnim barvnim vidom in normalno pigmentacijo ima barvno slepega očeta; njen brat je albino, njena starša pa sta pigmentirana. Poroči se z moškim z normalnim vidom, ki je prenašalec albinizma. Barvna slepota je X-vezana recesivna ($X^b$), albinizem avtosomno recesiven ($a$); gena se dedujeta neodvisno. a) Kolikšna je verjetnost, da bo prvi otrok barvno slep sin z normalno pigmentacijo? b) Kolikšna je verjetnost, da bo prvi otrok brez obeh lastnosti? c) Ali je lahko hči barvno slepa?

**Rešitev:**

1. Vid: ženska ima od očeta $X^b$, vidi normalno, zato je $X^BX^b$. Mož je $X^BY$.
2. $X^BX^b \times X^BY$: potomci $X^BX^B$, $X^BX^b$, $X^BY$, $X^bY$, vsak s $\tfrac{1}{4}$. Barvno slep sin: $\tfrac{1}{4}$ (glede na vse otroke).
3. Pigmentacija: ženska je kot zdrava sestra albina $Aa$ z verjetnostjo $\tfrac{2}{3}$; mož je $Aa$. $P(aa) = \tfrac{2}{3} \cdot \tfrac{1}{4} = \tfrac{1}{6}$, $P(\text{pigmentiran}) = \tfrac{5}{6}$.
4. a) Neodvisna gena: $\tfrac{1}{4} \cdot \tfrac{5}{6} = \tfrac{5}{24} \approx 0{,}21$.
5. b) Normalen vid: $\tfrac{3}{4}$; brez obeh: $\tfrac{3}{4} \cdot \tfrac{5}{6} = \tfrac{15}{24} = \tfrac{5}{8}$.
6. c) Hči dobi od očeta $X^B$, zato v tej družini ne more biti barvno slepa (lahko je prenašalka z verjetnostjo $\tfrac{1}{2}$ med hčerami).
7. Odgovor: a) $\tfrac{5}{24}$; b) $\tfrac{5}{8}$; c) ne.

### Naloga 2

Natančno navedi Mendlov drugi zakon s pogoji. Izpelji razmerje fenotipov pri križanju $AaBbCc \times AaBbCc$ za razred »vsi trije dominantni« in »vsi trije recesivni«. Utemelji, zakaj pri genih, ki ležita blizu na istem kromosomu, razmerje $9 : 3 : 3 : 1$ ne velja.

**Rešitev:**

1. Zakon: če gena ležita na različnih kromosomih in veljajo pogoji prvega zakona (enaka preživetja gamet in potomcev), se alela enega gena razporedita v gamete neodvisno od alelov drugega.
2. Za vsak gen je $P(\text{dominanten fenotip}) = \tfrac{3}{4}$, $P(\text{recesiven}) = \tfrac{1}{4}$.
3. Neodvisnost: $P(\text{vsi trije dominantni}) = \left(\tfrac{3}{4}\right)^3 = \tfrac{27}{64}$.
4. $P(\text{vsi trije recesivni}) = \left(\tfrac{1}{4}\right)^3 = \tfrac{1}{64}$.
5. Gena blizu na istem kromosomu se dedujeta skupaj: alela, ki sta na istem kromosomu, gresta večinoma v isto gameto. Gamete $AB$ in $ab$ (pri dihibridu $AB/ab$) so pogostejše od $Ab$ in $aB$, ki nastanejo le s prekrižanjem. Pogoj neodvisnosti ne velja, zato se verjetnosti ne smejo množiti.
6. Odgovor: $\tfrac{27}{64}$ in $\tfrac{1}{64}$; pri vezanih genih je razcep odvisen od pogostosti prekrižanja in ne da $9 : 3 : 3 : 1$.

## Drugače: Na sliki

Dihibridno križanje si lahko narišeš kot **drevo** namesto tabele $4 \times 4$:

```
 oblika        barva     delež
 okroglo 3/4 ┬ rumeno 3/4  9/16
             └ zeleno 1/4  3/16
 nagub.  1/4 ┬ rumeno 3/4  3/16
             └ zeleno 1/4  1/16
```

Vsaka pot skozi drevo je en razred; delež je produkt verjetnosti na veji. Drevo hitro raste: za tri gene ima $8$ končnih vej, tabela pa bi imela $64$ celic.

## Drugače: Uporaba v stroki

**Hibridno seme.** Semenarska podjetja vzdržujejo homozigotne linije koruze in jih vsako leto križajo; F1 je enotna in bujna. Seme, ki ga kmet pridela sam, je F2 in se razcepi, zato ga za setev ne uporablja.

**Genetsko svetovanje.** Pri cistični fibrozi ali fenilketonuriji svetovalec iz rodovnika izračuna verjetnost prenašalstva (pogosto $\tfrac{2}{3}$) in jo nato posodobi z rezultatom genetskega testa.

**Vzreja živali.** Pri pasemskih psih in govedu z rodovniki in testnim križanjem odkrivajo prenašalce recesivnih bolezni, preden žival vključijo v vzrejo.

## Drugače: Bolj natančno

**Epistaza.** Alel enega gena lahko zakrije izraz drugega. Pri labradorcih gen $B$ določa črno ali rjavo barvo, gen $E$ pa, ali se pigment sploh odloži v dlako; $ee$ je rumen ne glede na $B$. Križanje $BbEe \times BbEe$ da črne : rjave : rumene $= 9 : 3 : 4$. Razmerje je preoblikovano $9 : 3 : 3 : 1$, zato zakon neodvisnega razporejanja še vedno velja.

**Komplementarni geni.** Kadar za lastnost potrebujemo dominantna alela dveh genov (dva encima iste presnovne poti), dobimo $9 : 7$.

**Kaj test $\chi^2$ ne pove.** Majhen $\chi^2$ ne dokaže hipoteze, pove le, da je podatki ne zavrnejo. Pri majhnih vzorcih (pričakovano manj kot $5$ v razredu) test ni zanesljiv.

## Preveri se

? Katera Punnettova shema ustreza križanju, ki da fenotipa v razmerju $1 : 1$?
- ena celica $AA$, dve $Aa$, ena $aa$
~ To je $Aa \times Aa$: tri celice imajo dominanten fenotip, ena recesivnega, torej $3 : 1$.
+ dve celici $Aa$ in dve $aa$
- vse štiri celice $Aa$
~ To je $AA \times aa$: vsi potomci so heterozigoti z enakim fenotipom.
> To je testno križanje $Aa \times aa$: polovica $Aa$, polovica $aa$.

? Iz dihibridnega križanja $AaBb \times AaBb$ vzgojimo $1000$ rastlin. Približno koliko jih bo imelo oba recesivna fenotipa?
- okoli $250$
~ $\tfrac{1}{4}$ velja za en gen; za oba hkrati verjetnosti množimo.
+ okoli $60$
- okoli $190$
~ $\tfrac{3}{16}$ je delež razreda z enim dominantnim in enim recesivnim fenotipom.
> $1000 \cdot \tfrac{1}{16} \approx 63$.

? Zakaj je F1 iz križanja dveh čistih linij ($RR \times rr$) enotna?
- Ker se alela staršev zmešata v vmesno obliko.
~ Alela se ne mešata: v F2 se nagubano seme vrne nespremenjeno.
+ Ker vsak potomec dobi en $R$ in en $r$, zato so vsi $Rr$.
- Ker recesivni alel v F1 izgine.
~ Alel $r$ ostane v F1, le skrit je; v F2 se spet pokaže v $\tfrac{1}{4}$ potomcev.
> Homozigota dasta le po eno vrsto gamet, zato je genotip potomcev vedno $Rr$.

? Pri križanju rastline z rdečimi in rastline z belimi cvetovi je polovica potomcev rdečih, polovica belih. Rdeča je dominantna. Kakšna sta bila starša?
- oba starša homozigota, $RR \times rr$
~ To bi dalo same rdeče potomce $Rr$.
- oba starša heterozigota, $Rr \times Rr$
~ To bi dalo razmerje $3 : 1$, poleg tega bela rastlina ne more biti $Rr$.
+ heterozigot in recesivni homozigot, $Rr \times rr$
> Bela rastlina je $rr$; polovica belih potomcev pomeni, da je rdeči starš dal alel $r$ v polovici gamet.

? Pri miših križamo rumeno z rumeno. Med potomci je $2/3$ rumenih in $1/3$ sivih. Katera razlaga je pravilna?
- Rumena je recesivna.
~ Rumena × rumena bi pri recesivnosti dala same rumene potomce.
- Gena za barvo sta dva in se dedujeta neodvisno.
~ Dva neodvisna gena dasta razmerja s $16$ v imenovalcu, ne $2 : 1$.
+ Rumeni alel je dominanten za barvo, homozigot pa ni sposoben preživetja.
> Pri $Yy \times Yy$ manjka četrtina $YY$; ostanejo $Yy : yy = 2 : 1$.

:::simboli
\chi | hi-kvadrat (testna statistika) | \chi^2 = \sum \frac{(O - E)^2}{E} | – | primerjamo z mejo iz tabele
O | opaženo število potomcev v razredu | | –
E | pričakovano število potomcev v razredu | | – | skupno število krat delež razreda
P | verjetnost | | – | število med 0 in 1
n | število potomcev | | –
R, r | alela za obliko semena (okroglo, nagubano) oz. barvo ploda | | | velika črka: dominanten alel
Y, y | alela za barvo semena (rumeno, zeleno) | | | $Y$ dominanten
A, a | dominantni in recesivni alel | | | pri albinizmu $a$ recesiven
:::
