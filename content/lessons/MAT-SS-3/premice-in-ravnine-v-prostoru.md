---
stanje: osnutek
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

- Dve premici v prostoru: sekajoči, vzporedni ali mimobežni (ni skupne točke, ni skupne ravnine).
- Premica je pravokotna na ravnino, če je pravokotna na dve sekajoči se premici ravnine; potem je pravokotna na vsako premico ravnine.
- Ravnini sta vzporedni ali se sekata v premici; pravokotni sta, če ena vsebuje pravokotnico na drugo.
- Pravokotna projekcija točke je nožišče pravokotnice; kot med premico in ravnino je kot med premico in njeno projekcijo.
- V pravokotnem trikotniku daljica–projekcija–razdalja: $\sin\varphi = \frac{v}{l}$, $\cos\varphi = \frac{p}{l}$, $\tan\varphi = \frac{v}{p}$.
- Telesna diagonala kocke oklepa z osnovno ploskvijo kot $\approx 35{,}26^\circ$, ne glede na rob.
- (višja raven) Enako oddaljene od dveh točk: simetralna ravnina; od točke: sfera; od premice: valjasta ploskev.

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
= 45 | 0,5
~ 51,3 | Za projekcijo si vzel rob $8\,\mathrm{dm}$. Projekcija diagonale je diagonala osnovne ploskve, $\sqrt{36 + 64} = 10\,\mathrm{dm}$.
~ 59,0 | Za projekcijo si vzel rob $6\,\mathrm{dm}$. Projekcija diagonale je diagonala osnovne ploskve, $10\,\mathrm{dm}$.
> Diagonala osnovne ploskve je $\sqrt{6^2 + 8^2} = 10\,\mathrm{dm}$, enako kot višina. Zato je $\tan\varphi = \frac{10}{10} = 1$ in $\varphi = 45^\circ$.

? (višja raven) Koliko oglišč kocke $ABCDEFGH$ leži na simetralni ravnini daljice $AC$?
= 4
~ 2 | Našel si le $B$ in $D$, kot da gre za simetralo v ravnini $ABCD$. Simetralna ravnina je pravokotna na $AC$ in sega tudi navzgor, zato vsebuje še $F$ in $H$.
~ 0 | Oglišča $B$ in $D$ sta od $A$ in $C$ enako oddaljena (rob $a$), zato ležita na simetralni ravnini.
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
