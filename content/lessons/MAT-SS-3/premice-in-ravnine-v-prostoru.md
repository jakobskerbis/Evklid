---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Medicinska sestra pred cepljenjem v nadlaket drži iglo pokonci na kožo. Preden zabode, iglo pogleda od spredaj in nato še od strani. Šele ko je pokonci v obeh pogledih, je res pravokotna na kožo.

Drugi prizor: fizioterapevt nastavlja infuzijsko stojalo ob postelji. Z libelo preveri drog najprej v eni smeri, potem stojalo zasuka za četrt kroga in preveri še enkrat.

Prizora sta različna, ideja je ista. Ploskev (koža, tla) si predstavljamo kot **ravnino**, iglo ali drog kot **premico**. Da je premica pravokotna na ravnino, je treba preveriti v **dveh** smereh, ena ni dovolj. Zakaj je tako in kako izmerimo kot, kadar igla ni pokonci (pri podkožni injekciji je nagnjena za približno $45^\circ$), pove ta lekcija.

## Razlaga

**1. Model: kocka.** Vse lege premic in ravnin v prostoru najdemo na kocki $ABCDEFGH$. Spodnja ploskev je $ABCD$, zgornja $EFGH$; oglišče $E$ leži nad $A$, $F$ nad $B$, $G$ nad $C$ in $H$ nad $D$. Robove, ki jih od spredaj ne vidimo, rišemo črtkano.

:::risba skica
opis: Kocka ABCDEFGH v poševni projekciji. Spodaj spredaj sta A levo in B desno, zadaj spodaj D levo in C desno. Zgoraj nad njimi E, F, G, H. Robovi AD, DC in DH so črtkani, ker so skriti.
območje: 0; 0 .. 7; 6,5
enota: 40
črta: 0,5; 0,5 -> 4,5; 0,5 -> 4,5; 4,5 -> 0,5; 4,5 -> 0,5; 0,5 | modra
črta: 4,5; 0,5 -> 6,1; 1,7 -> 6,1; 5,7 -> 4,5; 4,5 | modra
črta: 0,5; 4,5 -> 2,1; 5,7 -> 6,1; 5,7 | modra
črta: 0,5; 0,5 -> 2,1; 1,7 -> 6,1; 1,7 | modra črtkano
črta: 2,1; 1,7 -> 2,1; 5,7 | modra črtkano
točka: 0,5; 0,5 | A | pod levo
točka: 4,5; 0,5 | B | pod desno
točka: 6,1; 1,7 | C | desno
točka: 2,1; 1,7 | D | nad desno
točka: 0,5; 4,5 | E | levo
točka: 4,5; 4,5 | F | pod desno
točka: 6,1; 5,7 | G | nad
točka: 2,1; 5,7 | H | nad
:::

**2. Lega dveh premic.** V ravnini se dve premici sekata ali pa sta vzporedni. V prostoru je še tretja možnost: premici nimata skupne točke, a nista vzporedni. Takima premicama rečemo **mimobežni**; ne ležita v nobeni skupni ravnini. V tabeli so »Točke« število skupnih točk, »Ravnina« pa pove, ali premici ležita v isti ravnini.

| Lega | Točke | Ravnina |
|---|---|---|
| sekajoči | $1$ | da |
| vzporedni | $0$ | da |
| mimobežni | $0$ | ne |

Na kocki se $AB$ in $BC$ sekata, $AB$ in $HG$ sta vzporedni, $AB$ in $CG$ pa mimobežni.

Kot med mimobežnicama izmerimo tako, da eno vzporedno premaknemo, da seka drugo. Premica $CG$ je vzporedna z $BF$, ta pa je pravokotna na $AB$. Zato sta $AB$ in $CG$ **pravokotni mimobežnici**.

**3. Premica in ravnina, dve ravnini.** Premica lahko leži v ravnini (rob $AB$ v ploskvi $ABCD$), jo seka v eni točki (rob $AE$ seka $ABCD$ v $A$) ali je z njo vzporedna (rob $EF$ in ploskev $ABCD$). Dve ravnini sta vzporedni ($ABCD$ in $EFGH$) ali pa se sekata v premici ($ABCD$ in $BCGF$ v premici $BC$).

**4. Premica, pravokotna na ravnino.** Premica je **pravokotna na ravnino**, če je pravokotna na vsako premico te ravnine. Vseh premic ne moremo preveriti, zato velja kriterij: dovolj je, da je pravokotna na **dve sekajoči se** premici ravnine. Rob $AE$ je pravokoten na $AB$ in na $AD$, zato je pravokoten na celo ploskev $ABCD$. Tako je pravokoten tudi na diagonalo $BD$, čeprav je ne seka.

Ravnini sta pravokotni, če ena vsebuje premico, ki je pravokotna na drugo. Ploskev $ABFE$ vsebuje $AE$, zato je $ABFE \perp ABCD$.

:::premisli
Zakaj ena premica ni dovolj? Poišči na kocki premico skozi $A$, ki ne leži v ploskvi $ABCD$ in je pravokotna na $AD$, na ploskev $ABCD$ pa ni pravokotna.
---
Diagonala $AF$. Rob $AD$ je pravokoten na $AB$ in na $AE$, torej na ploskev $ABFE$, zato je pravokoten na vsako premico v njej, tudi na $AF$. Toda $AF$ je proti tlom nagnjena za $45^\circ$. Enako bi bila igla lahko pokonci v pogledu od spredaj, a nagnjena vstran.
:::

**5. Pravokotna projekcija.** Iz točke $T$ spustimo pravokotnico na ravnino; nožišče $T'$ je **pravokotna projekcija** točke $T$. Projekcijo premice dobimo tako, da projiciramo dve njeni točki in ju povežemo. Projekcija oglišča $G$ na ploskev $ABCD$ je $C$, zato je projekcija telesne diagonale $AG$ ploskovna diagonala $AC$. Če je premica pravokotna na ravnino, je njena projekcija ena sama točka.

**Kot med premico in ravnino** je kot med premico in njeno pravokotno projekcijo. Leži med $0^\circ$ (premica je vzporedna z ravnino ali leži v njej) in $90^\circ$ (premica je pravokotna na ravnino). Naj eno krajišče daljice leži v ravnini. Daljica dolžine $l$, njena projekcija $p$ in razdalja $v$ drugega krajišča od ravnine tvorijo pravokotni trikotnik s pravim kotom ob nožišču:

$$\sin\varphi = \frac{v}{l}$$

$$\cos\varphi = \frac{p}{l}$$

$$\tan\varphi = \frac{v}{p}$$

Iz $p = l \cos\varphi$ vidiš, da projekcija ni nikoli daljša od daljice.

:::premisli
Napovej: kaj je bolj strmo glede na ploskev $ABCD$, diagonala $AF$ stranske ploskve ali telesna diagonala $AG$?
---
Diagonala $AF$. Obe se dvigneta za $a$, projekcija $AF$ je rob $AB$ dolžine $a$, projekcija $AG$ pa daljša diagonala $AC = a\sqrt{2}$. Pri $AF$ je $\tan\varphi = 1$, torej $45^\circ$; pri $AG$ je kot manjši, okoli $35^\circ$ (Primer 2).
:::

**6. Množice točk v prostoru (višja raven).** Pri krožnici si točke opisal s pogojem o razdalji. V prostoru isti pogoji dajo ploskve:

- Enako oddaljene od točk $A$ in $B$: v ravnini simetrala daljice $AB$, v prostoru **simetralna ravnina** daljice $AB$.
- Na razdalji $r$ od točke $S$: v ravnini krožnica, v prostoru **sfera**.
- Na razdalji $r$ od premice $q$: v ravnini dve vzporednici, v prostoru **valjasta ploskev** z osjo $q$.

(višja raven) Simetralna ravnina gre skozi razpolovišče daljice in je nanjo pravokotna. Pri obsevanju tumorja zdravnik določi območje točk, ki so od središča tumorja oddaljene največ $r$: to je krogla, njen rob pa sfera.

## Rešeni primeri

### Primer 1 (lažji): lege na kocki

V kocki $ABCDEFGH$ določi lego: (a) premic $EH$ in $BC$, (b) premic $EH$ in $CG$, (c) premice $EG$ in ravnine $ABCD$, (d) ravnin $ABFE$ in $DCGH$.

**Podatki:** kocka $ABCDEFGH$, osnovna ploskev $ABCD$, $E$ nad $A$, $F$ nad $B$, $G$ nad $C$, $H$ nad $D$
**Iščemo:** medsebojno lego štirih parov

:::formula
Premici: skupna točka $\Rightarrow$ sekajoči; ni skupne točke in sta v isti ravnini $\Rightarrow$ vzporedni; sicer mimobežni.
:::

**Rešitev:**

1. (a) $EH \parallel AD$ in $AD \parallel BC$, torej $EH \parallel BC$: premici sta vzporedni. Obe ležita v ravnini $BCHE$.
2. (b) $EH$ leži v zgornji ploskvi, $CG$ jo seka le v $G$, ki ni na $EH$. Skupne točke ni, smeri sta različni: mimobežni. Ker $CG \parallel DH$ in $DH \perp EH$, sta pravokotni mimobežnici.
3. (c) Vse točke $EG$ so za rob $a$ nad ploskvijo $ABCD$, zato $EG$ ravnine $ABCD$ ne doseže: premica je vzporedna z ravnino.
4. (d) Ploskvi sta nasprotni ploskvi kocke: ravnini sta vzporedni.
5. Odgovor: (a) vzporedni, (b) pravokotni mimobežnici, (c) vzporedni, (d) vzporedni.

### Primer 2: kot med telesno diagonalo in osnovno ploskvijo

Kocka ima rob $a = 6\,\mathrm{cm}$. Izračunaj kot med telesno diagonalo $AG$ in osnovno ploskvijo $ABCD$.

**Podatki:** $a = 6\,\mathrm{cm}$
**Iščemo:** kot $\varphi$ med $AG$ in ravnino $ABCD$

:::formula
Projekcija telesne diagonale je ploskovna diagonala $d = a\sqrt{2}$; $\tan\varphi = \dfrac{a}{d}$
:::

**Rešitev:**

1. Pravokotna projekcija točke $G$ na $ABCD$ je $C$, ker je $CG \perp ABCD$. Projekcija diagonale $AG$ je $AC$.
2. Trikotnik $ACG$ ima pravi kot pri $C$. Narišemo ga v pravi velikosti:

:::risba skica
opis: Pravokotni trikotnik ACG. Kateta AC je vodoravna in meri a√2, kateta CG je navpična in meri a, hipotenuza AG je telesna diagonala. Pravi kot je pri C, kot φ je pri A.
območje: 0; 0 .. 7; 5,4
enota: 40
lik: 0,5; 0,5 -> 6,16; 0,5 -> 6,16; 4,5 | modra zaprto
pravikot: 6,16; 0,5 | 0,5; 0,5 | 6,16; 4,5
točka: 0,5; 0,5 | A | levo
točka: 6,16; 0,5 | C | desno
točka: 6,16; 4,5 | G | desno
napis: 3,3; 0,5 | d = a√2 | pod
napis: 6,16; 2,5 | a | desno
napis: 1,7; 0,8 | φ | desno
:::

3. Ploskovna diagonala: $d = 6\sqrt{2} \approx 8{,}49\,\mathrm{cm}$.
4. $\tan\varphi = \dfrac{6}{6\sqrt{2}} = \dfrac{1}{\sqrt{2}} \approx 0{,}707$, zato $\varphi \approx 35{,}26^\circ$.
5. Za preizkus: telesna diagonala $AG$ meri $D = \sqrt{d^2 + a^2} = \sqrt{72 + 36} = 6\sqrt{3} \approx 10{,}39\,\mathrm{cm}$ in $\sin\varphi = \dfrac{6}{6\sqrt{3}} \approx 0{,}577$, kar spet da $35{,}26^\circ$.
6. Odgovor: telesna diagonala oklepa z osnovno ploskvijo kot približno $35{,}26^\circ$ ($35^\circ 16'$). Rob $a$ se je pokrajšal, zato je kot enak pri vsaki kocki.

### Primer 3 (težji): kot igle pri injekciji

Konica igle mora biti $8\,\mathrm{mm}$ pod kožo. Igla je dolga $16\,\mathrm{mm}$ in jo medicinska sestra zabode do konca. Pod kolikšnim kotom glede na kožo jo mora zabosti? Kako daleč od vbodne točke je točka na koži, ki leži točno nad konico? Kožo obravnavaj kot ravnino.

**Podatki:** dolžina igle $l = 16\,\mathrm{mm}$, globina konice $v = 8\,\mathrm{mm}$
**Iščemo:** kot $\varphi$ med iglo in kožo, dolžino projekcije $p$

:::formula
$\sin\varphi = \dfrac{v}{l}$, nato $p = l\cos\varphi$
:::

**Rešitev:**

1. Točka na koži nad konico je pravokotna projekcija konice. Vbodna točka, projekcija in konica tvorijo pravokotni trikotnik s hipotenuzo $l$.
2. $\sin\varphi = \dfrac{8}{16} = 0{,}5$, torej $\varphi = 30^\circ$.
3. Projekcija igle: $p = 16 \cos 30^\circ \approx 13{,}86\,\mathrm{mm}$.
4. Odgovor: iglo mora zabosti pod kotom $30^\circ$; točka nad konico je približno $13{,}9\,\mathrm{mm}$ od vbodne točke.

### Primer 4 – zdaj ti

Kvader ima osnovno ploskev $3\,\mathrm{cm} \times 4\,\mathrm{cm}$. Njegova telesna diagonala oklepa z osnovno ploskvijo kot $60^\circ$. Kolikšna je višina kvadra?

**Podatki:** $a = 3\,\mathrm{cm}$, $b = 4\,\mathrm{cm}$, $\varphi = 60^\circ$
**Iščemo:** višino $c$

:::formula
$d = \sqrt{a^2 + b^2}$, $\tan\varphi = \dfrac{c}{d}$
:::

**Rešitev:**

1. Projekcija telesne diagonale na osnovno ploskev je diagonala osnovne ploskve.
2. $d = \sqrt{9 + 16} = 5\,\mathrm{cm}$.
3. Iz $\tan\varphi = \dfrac{c}{d}$ izrazi $c$ in izračunaj.

:::premisli
Kolikšna je višina $c$?
---
$c = d\tan 60^\circ = 5\sqrt{3} \approx 8{,}66\,\mathrm{cm}$.
:::

## Pogoste napake

- **»Premici, ki se ne sekata, sta vzporedni.«** To velja v ravnini, v prostoru ne: $AB$ in $CG$ se ne sekata in nista vzporedni. Preden rečeš »vzporedni«, preveri, ali premici ležita v isti ravnini in imata isto smer.
- **»Ena pravokotnica zadošča.«** Diagonala $AF$ je pravokotna na $AD$, na ploskev $ABCD$ pa ni. Premica mora biti pravokotna na dve sekajoči se premici ravnine.
- **Napačna projekcija.** Pri kotu med $AG$ in $ABCD$ marsikdo vzame rob $AB$ namesto diagonale $AC$ in dobi $\tan\varphi = 1$, torej $45^\circ$. Najprej poišči, kam pade pravokotnica iz zgornjega krajišča ($G \to C$), nato poveži.
- **»Projekcija je enako dolga kot daljica.«** Velja le za daljico, vzporedno z ravnino. Sicer je $p = l\cos\varphi$ krajša, pri $90^\circ$ je le točka.
- (višja raven) **Ravninska slika v prostoru.** Točke, enako oddaljene od dveh točk, niso simetrala (premica), ampak simetralna ravnina; točke na razdalji $r$ od premice niso dve vzporednici, ampak valjasta ploskev.

## Povzetek

- **Dve premici** v prostoru se sekata, sta vzporedni ali mimobežni.
- **Mimobežni** premici nimata skupne točke in ne ležita v skupni ravnini.
- Premica je **pravokotna na ravnino**, če je pravokotna na dve sekajoči se premici ravnine; potem je pravokotna na vsako premico ravnine.
- **Dve ravnini** sta vzporedni ali se sekata v premici.
- Ravnini sta **pravokotni**, če ena vsebuje pravokotnico na drugo.
- **Pravokotna projekcija** točke je nožišče pravokotnice.
- **Kot med premico in ravnino** je kot med premico in njeno projekcijo.

V pravokotnem trikotniku daljica $l$ – projekcija $p$ – razdalja $v$:

$$\sin\varphi = \frac{v}{l},\quad \cos\varphi = \frac{p}{l}$$

$$\tan\varphi = \frac{v}{p}$$

- Telesna diagonala kocke oklepa z osnovno ploskvijo kot $\approx 35{,}26^\circ$, ne glede na rob.

**Enako oddaljene točke** (višja raven):

| Od | Ploskev |
|---|---|
| dveh točk | simetralna ravnina |
| točke | sfera |
| premice | valjasta ploskev |

## Ponovitev

**Formule**
- premica $\perp$ ravnina $\iff$ premica $\perp$ dve sekajoči se premici ravnine (na pamet)
- daljica $l$, projekcija $p$, razdalja $v$ krajišča od ravnine: $\sin\varphi = \frac{v}{l}$, $\cos\varphi = \frac{p}{l}$, $\tan\varphi = \frac{v}{p}$ (na pamet)
- projekcija: $p = l\cos\varphi$ (na pamet)

**Postopek**
1. Skiciraj telo in označi premico ter ravnino.
2. Iz zgornjega krajišča spusti pravokotnico na ravnino in poišči nožišče.
3. Poveži nožišče s presečiščem premice in ravnine: to je projekcija.
4. V pravokotnem trikotniku daljica–projekcija–razdalja izračunaj manjkajoče stranice.
5. Kot $\varphi$ izračunaj s $\sin$, $\cos$ ali $\tan$.

**Pazi na**
- Premici, ki se ne sekata, sta lahko mimobežni: preveri, ali ležita v isti ravnini.
- Ena pravokotnica ne zadošča: premica mora biti pravokotna na dve sekajoči se premici ravnine.
- Projekcija $AG$ na $ABCD$ je diagonala $AC$, ne rob $AB$: najprej poišči nožišče ($G \to C$).

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Pravilna štiristrana piramida ima osnovni rob $6\,\mathrm{cm}$ in stranski rob $6\,\mathrm{cm}$. Izračunajte kot med stranskim robom in ravnino osnovne ploskve.

**Rešitev:**

1. Vrh pravilne piramide se pravokotno projicira v središče kvadrata, to je v presečišče diagonal. Pravokotna projekcija stranskega roba je zato polovica diagonale osnovne ploskve.
2. Diagonala kvadrata meri $6\sqrt{2}\,\mathrm{cm}$, projekcija stranskega roba torej $p = 3\sqrt{2}\,\mathrm{cm}$.
3. Stranski rob $l = 6\,\mathrm{cm}$, projekcija in višina piramide tvorijo pravokotni trikotnik: $\cos\varphi = \dfrac{p}{l} = \dfrac{3\sqrt{2}}{6} = \dfrac{\sqrt{2}}{2}$, zato $\varphi = 45^\circ$.
4. Odgovor: stranski rob oklepa z osnovno ploskvijo kot $45^\circ$.

**Točkovanje:** 1 točka za ugotovitev, da je projekcija stranskega roba polovica diagonale osnovne ploskve, 1 točka za $p = 3\sqrt{2}\,\mathrm{cm}$, 1 točka za $\varphi = 45^\circ$.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 2 (z računalom)

Kvader $ABCDEFGH$ ima osnovno ploskev $ABCD$ in robove $AB = 12\,\mathrm{cm}$, $BC = 4\,\mathrm{cm}$ in $AE = 3\,\mathrm{cm}$; oglišča $E$, $F$, $G$, $H$ ležijo po vrsti nad $A$, $B$, $C$, $D$. Kote zaokrožite na stotinko stopinje.

a) Zapišite vse robove kvadra, ki so z robom $AE$ mimobežni. (2 točki)
b) Izračunajte kot med telesno diagonalo $AG$ in ravnino $ABCD$. (2 točki)
c) Izračunajte kot med telesno diagonalo $AG$ in ravnino stranske ploskve $ABFE$. (3 točke)

**Rešitev:**

1. a) Rob $AE$ sekajo robovi $AB$, $AD$, $EF$ in $EH$, vzporedni z njim so $BF$, $CG$ in $DH$. Ostali robovi nimajo skupne točke z $AE$ in z njim niso vzporedni: $BC$, $CD$, $FG$ in $GH$.
2. b) Projekcija oglišča $G$ na ravnino $ABCD$ je $C$, zato je projekcija diagonale $AG$ diagonala $AC = \sqrt{12^2 + 4^2} = \sqrt{160} \approx 12{,}649\,\mathrm{cm}$.
3. b) V pravokotnem trikotniku $ACG$ je $\tan\varphi_1 = \dfrac{3}{\sqrt{160}} \approx 0{,}2372$, zato $\varphi_1 \approx 13{,}342^\circ \approx 13{,}34^\circ$.
4. c) Rob $GF$ je pravokoten na $FB$ in na $FE$, ki se sekata in ležita v ravnini $ABFE$, zato je $GF$ pravokoten na to ravnino. Projekcija oglišča $G$ je $F$, projekcija diagonale $AG$ je $AF$, razdalja $G$ od ravnine pa $GF = BC = 4\,\mathrm{cm}$.
5. c) Telesna diagonala: $AG = \sqrt{12^2 + 4^2 + 3^2} = \sqrt{169} = 13\,\mathrm{cm}$.
6. c) $\sin\varphi_2 = \dfrac{4}{13} \approx 0{,}3077$, zato $\varphi_2 \approx 17{,}920^\circ \approx 17{,}92^\circ$.
7. Odgovor: a) $BC$, $CD$, $FG$, $GH$; b) približno $13{,}34^\circ$; c) približno $17{,}92^\circ$.

**Točkovanje:** a) 2 točki za vse štiri robove (1 točka za dva ali tri pravilne robove brez napačnega); b) 1 točka za projekcijo $AC = \sqrt{160}\,\mathrm{cm}$, 1 točka za $\varphi_1 \approx 13{,}34^\circ$; c) 1 točka za utemeljitev, da je projekcija oglišča $G$ točka $F$, 1 točka za $AG = 13\,\mathrm{cm}$, 1 točka za $\varphi_2 \approx 17{,}92^\circ$.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Kocka $ABCDEFGH$ ima rob $4\,\mathrm{cm}$, osnovno ploskev $ABCD$ in oglišča $E$, $F$, $G$, $H$ po vrsti nad $A$, $B$, $C$, $D$. Točka $S$ je središče osnovne ploskve.

a) Utemeljite, da je premica $BD$ pravokotna na ravnino $ACGE$. (3 točke)
b) Opišite množico vseh točk prostora, ki so enako oddaljene od vseh štirih oglišč osnovne ploskve $A$, $B$, $C$ in $D$, in odgovor utemeljite. (2 točki)
c) Opišite množico vseh točk prostora, ki so od premice $AE$ oddaljene $4\,\mathrm{cm}$. Katera oglišča kocke ležijo v tej množici? (2 točki)
d) Izračunajte kot med diagonalo $BG$ stranske ploskve $BCGF$ in ravnino $ACGE$. (3 točke)

**Rešitev:**

1. a) Diagonali kvadrata $ABCD$ sta pravokotni, zato $BD \perp AC$.
2. a) Rob $AE$ je pravokoten na ravnino $ABCD$, zato je pravokoten na vsako premico v njej, tudi na $BD$.
3. a) Premica $BD$ je pravokotna na dve sekajoči se premici $AC$ in $AE$ ravnine $ACGE$, zato je pravokotna na celo ravnino.
4. b) Točke, enako oddaljene od $B$ in $D$, tvorijo simetralno ravnino daljice $BD$: ravnino skozi razpolovišče $S$, pravokotno na $BD$. Ravnina $ACGE$ gre skozi $S$ in je po a) pravokotna na $BD$, zato je to ravnina $ACGE$. Enako so točke, enako oddaljene od $A$ in $C$, v simetralni ravnini $BDHF$ daljice $AC$.
5. b) Iskane točke ležijo v obeh ravninah, torej na njuni presečnici: na premici skozi $S$ in središče zgornje ploskve, ki je pravokotna na ravnino $ABCD$. Vsaka točka $X$ te premice res ustreza, ker je $XA^2 = XS^2 + SA^2$ in so razdalje $SA$, $SB$, $SC$, $SD$ enake.
6. c) Točke na razdalji $4\,\mathrm{cm}$ od premice $AE$ tvorijo valjasto ploskev z osjo $AE$ in polmerom $4\,\mathrm{cm}$.
7. c) Robovi $AB$, $AD$, $EF$ in $EH$ so pravokotni na $AE$, zato so $B$, $D$, $F$ in $H$ od premice $AE$ oddaljeni $4\,\mathrm{cm}$. Oglišči $C$ in $G$ sta oddaljeni $4\sqrt{2}\,\mathrm{cm}$, $A$ in $E$ pa ležita na osi. V množici so oglišča $B$, $D$, $F$, $H$.
8. d) Po a) je $BS \perp ACGE$, zato je projekcija oglišča $B$ na to ravnino točka $S$. Oglišče $G$ leži v ravnini, zato je projekcija daljice $BG$ daljica $SG$.
9. d) Razdalja $B$ od ravnine je $BS = \frac{1}{2} \cdot 4\sqrt{2} = 2\sqrt{2}\,\mathrm{cm}$, diagonala ploskve pa $BG = 4\sqrt{2}\,\mathrm{cm}$.
10. d) $\sin\varphi = \dfrac{BS}{BG} = \dfrac{2\sqrt{2}}{4\sqrt{2}} = \dfrac{1}{2}$, zato $\varphi = 30^\circ$.
11. Odgovor: b) premica skozi $S$, pravokotna na ravnino $ABCD$ (skozi središči osnovne in zgornje ploskve); c) valjasta ploskev z osjo $AE$ in polmerom $4\,\mathrm{cm}$, na njej so $B$, $D$, $F$, $H$; d) $\varphi = 30^\circ$.

**Točkovanje:** a) 1 točka za $BD \perp AC$, 1 točka za $BD \perp AE$, 1 točka za sklep s kriterijem dveh sekajočih se premic; b) 1 točka za simetralni ravnini $ACGE$ (daljice $BD$) in $BDHF$ (daljice $AC$), 1 točka za njuno presečnico, premico skozi $S$, pravokotno na $ABCD$; c) 1 točka za valjasto ploskev z osjo $AE$ in polmerom $4\,\mathrm{cm}$, 1 točka za oglišča $B$, $D$, $F$, $H$; d) 1 točka za projekcijo $SG$ (nožišče $S$), 1 točka za $BS = 2\sqrt{2}\,\mathrm{cm}$ in $BG = 4\sqrt{2}\,\mathrm{cm}$, 1 točka za $\varphi = 30^\circ$.

### Ustno vprašanje 1

:::premisli
Opiši možne medsebojne lege dveh premic v prostoru in navedi primer mimobežnih premic na kocki.
---
Dve različni premici v prostoru se sekata, sta vzporedni ali sta mimobežni. Sekajoči premici imata eno skupno točko, vzporedni nimata skupne točke in ležita v isti ravnini. Mimobežni premici nimata skupne točke in ne ležita v nobeni skupni ravnini. Na kocki $ABCDEFGH$ z osnovno ploskvijo $ABCD$, kjer je $H$ nad $D$, sta mimobežni na primer premici $AB$ in $DH$.
:::

### Ustno vprašanje 2

:::premisli
Kdaj je premica pravokotna na ravnino in zakaj za preverjanje ne zadošča ena pravokotnica v ravnini?
---
Premica je pravokotna na ravnino, če je pravokotna na vsako premico te ravnine. Po kriteriju zadošča, da je pravokotna na dve sekajoči se premici ravnine. Ena premica ne zadošča, ker je premica lahko pravokotna na eno premico ravnine in hkrati proti ravnini nagnjena. V kocki $ABCDEFGH$ z osnovno ploskvijo $ABCD$, kjer je $E$ nad $A$ in $F$ nad $B$, je ploskovna diagonala $AF$ pravokotna na osnovni rob $AD$, z osnovno ploskvijo pa oklepa kot $45^\circ$. Zato pravokotnost preverimo v dveh različnih smereh.
:::

### Ustno vprašanje 3

:::premisli
Dokaži, da je kot med telesno diagonalo kocke in osnovno ploskvijo neodvisen od dolžine roba.
---
Zgornje krajišče telesne diagonale se pravokotno projicira v oglišče pod njim, zato je projekcija telesne diagonale ploskovna diagonala dolžine $a\sqrt{2}$. Telesna diagonala, njena projekcija in navpični rob dolžine $a$ tvorijo pravokotni trikotnik s pravim kotom ob nožišču. Kot med diagonalo in ravnino je kot med diagonalo in projekcijo, zato je $\tan\varphi = \frac{a}{a\sqrt{2}} = \frac{1}{\sqrt{2}}$. Rob $a$ se pokrajša, zato je kot pri vsaki kocki enak, približno $35{,}26^\circ$.
:::

## Drugače: Z analogijo

- **Mimobežni premici** sta kot avtocesta in cesta na nadvozu. Na zemljevidu se »križata«, v resnici avto z ene nikoli ne pride na drugo. Nista vzporedni, sekata pa se tudi ne.
- **Pravokotna projekcija** je kot senca opoldne, ko bi sonce sijalo točno navpično. Senca palice je njena projekcija na tla. Palica pokonci da senco v obliki pike, ležeča palica senco enake dolžine.
- **Kot med premico in ravnino** je kot med palico in njeno senco, ne kot med palico in katerokoli črto na tleh. Če bi meril proti drugi črti, bi dobil večji kot.

## Drugače: Iz vsakdanjega življenja

Bolnišnična soba je kvader.

- Rob, kjer se stikata stena in tla, ter navpični rob v nasprotnem kotu sobe sta mimobežnici.
- Infuzijsko stojalo je pravokotno na tla, ker je pokonci v dveh smereh (od spredaj in od strani).
- Dvignjeno vzglavje postelje in ležišče sta ravnini, ki se sekata v premici, tečaju vzglavja.
- Kot igle glede na kožo je kot med premico in ravnino: v mišico približno $90^\circ$, pod kožo približno $45^\circ$, v žilo okoli $25^\circ$. Globino konice izračunaš kot $v = l\sin\varphi$.
- Pri CT-preiskavi so rezine telesa vzporedne ravnine, vse pravokotne na os, po kateri se pomika miza.

## Preveri se

? Na sliki je kocka $ABCDEFGH$. Kakšna je lega premic $AB$ in $CG$, ki sta narisani debelo?
:::risba skica
opis: Kocka ABCDEFGH. Rob AB spodaj spredaj in rob CG zadaj desno, navpičen, sta narisana debelo. Skriti robovi AD, DC in DH so črtkani.
območje: 0; 0 .. 7; 6,5
enota: 40
črta: 4,5; 0,5 -> 4,5; 4,5 -> 0,5; 4,5 -> 0,5; 0,5 | modra
črta: 4,5; 0,5 -> 6,1; 1,7 | modra
črta: 6,1; 5,7 -> 4,5; 4,5 | modra
črta: 0,5; 4,5 -> 2,1; 5,7 -> 6,1; 5,7 | modra
črta: 0,5; 0,5 -> 2,1; 1,7 -> 6,1; 1,7 | modra črtkano
črta: 2,1; 1,7 -> 2,1; 5,7 | modra črtkano
črta: 0,5; 0,5 -> 4,5; 0,5 | oranžna debelo
črta: 6,1; 1,7 -> 6,1; 5,7 | oranžna debelo
točka: 0,5; 0,5 | A | pod levo
točka: 4,5; 0,5 | B | pod desno
točka: 6,1; 1,7 | C | desno
točka: 2,1; 1,7 | D | nad desno
točka: 0,5; 4,5 | E | levo
točka: 4,5; 4,5 | F | pod desno
točka: 6,1; 5,7 | G | nad
točka: 2,1; 5,7 | H | nad
:::
- Vzporedni.
~ Vzporedni premici imata isto smer. $AB$ je vodoravna, $CG$ navpična.
- Sekata se pod pravim kotom.
~ Pravokotni res sta ($CG \parallel BF \perp AB$), skupne točke pa nimata: $CG$ seka spodnjo ploskev le v $C$, ki ni na $AB$.
+ Pravokotni mimobežni.
> Nimata skupne točke in ne ležita v isti ravnini, zato sta mimobežni. Ker je $CG$ vzporedna z $BF$, ta pa pravokotna na $AB$, sta pravokotni mimobežnici.

? Fizioterapevt bolniku počasi dviga iztegnjeno nogo z ležišča do navpične lege. Kaj se dogaja s pravokotno projekcijo noge na ležišče?
- Ostane enako dolga kot noga.
~ Enako dolga je projekcija le, dokler noga leži vzporedno z ležiščem. Ko se dviga, je $p = l\cos\varphi$ krajša.
- Daljša se.
~ Projekcija ni nikoli daljša od daljice, ker je $\cos\varphi \le 1$.
+ Krajša se, v navpični legi je le točka.
> $p = l\cos\varphi$: ko kot narašča od $0^\circ$ do $90^\circ$, kosinus pade z $1$ na $0$. Navpična noga je pravokotna na ležišče, zato je njena projekcija ena točka.

? Razvrsti korake za izračun kota med telesno diagonalo $AG$ kvadra in osnovno ploskvijo $ABCD$.
1. Poišči pravokotno projekcijo oglišča $G$ na osnovno ploskev (to je $C$).
2. Ugotovi, da je projekcija diagonale $AG$ daljica $AC$.
3. Izračunaj $AC = \sqrt{a^2 + b^2}$ po Pitagorovem izreku.
4. V pravokotnem trikotniku $ACG$ izračunaj $\tan\varphi = \frac{c}{AC}$.
> Najprej projekcija, šele nato računanje: brez koraka 1 in 2 ne veš, katero daljico vzeti za priležno kateto.

? (brez računala) Omarica ob bolniški postelji ima obliko kvadra z osnovno ploskvijo $6\,\mathrm{dm} \times 8\,\mathrm{dm}$ in višino $10\,\mathrm{dm}$. Kolikšen kot (v stopinjah) oklepa njena telesna diagonala z osnovno ploskvijo?
= 45 | 0
~ 51,3 | Za projekcijo si vzel rob $8\,\mathrm{dm}$. Projekcija diagonale je diagonala osnovne ploskve, $\sqrt{36 + 64} = 10\,\mathrm{dm}$.
~ 59,0 | Za projekcijo si vzel rob $6\,\mathrm{dm}$. Projekcija diagonale je diagonala osnovne ploskve, $10\,\mathrm{dm}$.
> Diagonala osnovne ploskve je $\sqrt{6^2 + 8^2} = 10\,\mathrm{dm}$, enako kot višina. Zato je $\tan\varphi = \frac{10}{10} = 1$ in $\varphi = 45^\circ$.

? (višja raven) Koliko oglišč kocke $ABCDEFGH$ leži na simetralni ravnini daljice $AC$?
= 4 | 0
~ 2 | Našel si le $B$ in $D$, kot da gre za simetralo v ravnini $ABCD$. Simetralna ravnina je pravokotna na $AC$ in sega tudi navzgor, zato vsebuje še $F$ in $H$.
~ 0 | Oglišči $B$ in $D$ sta od $A$ in $C$ enako oddaljeni (rob $a$), zato ležita na simetralni ravnini.
> Simetralna ravnina daljice $AC$ gre skozi razpolovišče in je pravokotna na $AC$. To je ravnina $BDHF$: oglišča $B$, $D$, $F$, $H$ so enako oddaljena od $A$ in $C$.

<<RACUN
vrednost: 6*sqrt(2) | 8.49
vrednost: 6*sqrt(3) | 10.39
vrednost: atan(1/sqrt(2))*180/pi | 35.26
vrednost: asin(1/sqrt(3))*180/pi | 35.26
vrednost: asin(8/16)*180/pi | 30
vrednost: 16*cos(30°) | 13.86
vrednost: sqrt(3^2+4^2) | 5
vrednost: 5*tan(60°) | 8.66
vrednost: sqrt(6^2+8^2) | 10
vrednost: atan(10/10)*180/pi | 45
vrednost: atan(10/8)*180/pi | 51.3
vrednost: atan(10/6)*180/pi | 59.0
vrednost: 6*sqrt(2)/2 | 3*sqrt(2)
vrednost: acos(3*sqrt(2)/6)*180/pi | 45
vrednost: sqrt(12^2+4^2) | 12.649
vrednost: 3/sqrt(160) | 0.2372
vrednost: atan(3/sqrt(160))*180/pi | 13.34
vrednost: sqrt(12^2+4^2+3^2) | 13
vrednost: 4/13 | 0.3077
vrednost: asin(4/13)*180/pi | 17.92
vrednost: 4*sqrt(2)/2 | 2*sqrt(2)
vrednost: asin(2*sqrt(2)/(4*sqrt(2)))*180/pi | 30
>>

:::simboli
\varphi | kot med premico in ravnino | \tan\varphi = \frac{v}{p} | ° | med $0^\circ$ in $90^\circ$
l | dolžina daljice (igle) | | mm
v | razdalja krajišča od ravnine (globina) | v = l\sin\varphi | mm
p | dolžina pravokotne projekcije | p = l\cos\varphi | mm
a | rob kocke oz. osnovni rob kvadra | | cm
b | drugi osnovni rob kvadra | | cm
c | višina kvadra | c = d\tan\varphi | cm
d | diagonala osnovne ploskve | d = \sqrt{a^2 + b^2} | cm | pri kocki $d = a\sqrt{2}$
D | telesna diagonala | D = \sqrt{d^2 + a^2} | cm
:::
