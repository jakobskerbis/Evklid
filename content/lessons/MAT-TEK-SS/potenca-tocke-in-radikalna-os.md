---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Nika je na bolšjem sejmu za $20$ € kupila staro okroglo mizo. Steklena plošča je bila počena in ostal je le en večji kos z delom roba. Steklar zaračuna $50$ € za kvadratni meter. Koliko bo stala nova plošča?

Za ceno potrebuje polmer, središča pa na kosu ni. Nika zato na robu označi dve točki, ki sta $80\,\mathrm{cm}$ narazen, in ju poveže z ravnilom. Na sredini te daljice izmeri, kako daleč je pravokotno do roba stekla: $10\,\mathrm{cm}$. Samo iz teh dveh števil lahko izračuna polmer.

Orodje, ki to omogoči, je **potenca točke**: eno samo število, ki poveže tetive, sekante in tangente skozi isto točko. Na tekmovanjih z njim dokazujemo, da štiri točke ležijo na isti krožnici ali da se tri premice sekajo v eni točki.

## Razlaga

**Najprej slika.** Krožnica spodaj ima središče $O$ in polmer $3$. Točka $P$ leži zunaj, $5$ enot od $O$. Skozi $P$ potegnemo tri premice. Prva gre skozi središče in seka krožnico v $A$ in $B$. Druga jo seka poševno, v $C$ in $D$. Premici z dvema presečiščema rečemo **sekanta**. Tretja se krožnice le dotakne v točki $T$: to je **tangenta**.

:::risba skica
opis: Krožnica s središčem O in polmerom 3. Točka P je 5 enot desno od O. Prva sekanta gre skozi O in seka krožnico v A (2 od P) in B (8 od P). Druga sekanta jo seka v C in D. Tangenta iz P se je dotakne v T; PT je dolga 4, polmer OT je pravokoten na PT.
območje: -4; -4 .. 6; 4
enota: 30
krog: 0; 0 | 3 | modra
črta: 5; 0 -> -3; 0 | oranžna
črta: 5; 0 -> 0,84; -2,88 | zelena
črta: 5; 0 -> 1,8; 2,4 | rdeča debelo
črta: 0; 0 -> 1,8; 2,4 | siva črtkano
pravikot: 1,8; 2,4 | 0; 0 | 5; 0
točka: 0; 0 | O | pod
točka: 5; 0 | P | desno
točka: 3; 0 | A | nad desno
točka: -3; 0 | B | levo
točka: 2,4; -1,8 | C | desno
točka: 0,84; -2,88 | D | pod
točka: 1,8; 2,4 | T | nad
:::

Izmerimo razdalje od $P$ do obeh presečišč vsake premice in ju zmnožimo:

| premica skozi $P$ | bližje | dlje | produkt |
|---|---|---|---|
| skozi središče | $PA = 2$ | $PB = 8$ | $16$ |
| poševna | $PC \approx 3{,}16$ | $PD \approx 5{,}06$ | $16$ |
| tangenta | $PT = 4$ | $PT = 4$ | $16$ |

Vsi trije produkti so enaki. To ni naključje izbranih premic.

:::premisli
Skozi $P$ potegnemo še četrto sekanto. Bližje presečišče je $2{,}5$ od $P$. Kako daleč je drugo?
---
Na razdalji $6{,}4$. Produkt je za vsako premico skozi $P$ enak $16$, in $\frac{16}{2{,}5} = 6{,}4$.
:::

**Zakaj je produkt stalen.** Na premici skozi središče je $PA = OP - r$ in $PB = OP + r$, zato je $PA \cdot PB = OP^2 - r^2$, če je $P$ zunaj. Pri tangenti je polmer $OT$ pravokoten na $PT$, in Pitagorov izrek da isto: $PT^2 = OP^2 - r^2$, če je $P$ zunaj.

Za poševno sekanto primerjamo trikotnika $PAC$ in $PDB$. Kot pri $P$ imata skupen. Štirikotnik $ABDC$ je tetiven, zato je njegov zunanji kot $\angle PAC$ enak nasprotnemu notranjemu kotu $\angle BDC$. Trikotnika sta torej podobna in $\frac{PA}{PD} = \frac{PC}{PB}$, kar da $PA \cdot PB = PC \cdot PD$.

**Potenca točke.** Številu

$$p(P) = OP^2 - r^2$$

rečemo **potenca točke** $P$ glede na krožnico. Zunaj krožnice je pozitivna in enaka $PA \cdot PB$ za vsako sekanto ter $PT^2$ za tangento. Na krožnici je $0$. V notranjosti je negativna. Tam se tetive skozi $P$ sekajo in za vsako velja $PA \cdot PB = r^2 - OP^2$, če je $P$ v notranjosti (izrek o sekajočih se tetivah).

V simulaciji spodaj »Potenca točke na krožnico« povleci $P$ v notranjost krožnice in vrti obe premici. Opazuj: produkta sta ves čas enaka, potenca pa zamenja predznak, ko $P$ prečka krožnico.

**Obrat izreka.** Na tekmovanjih je najbolj uporaben obrat. Premici $AB$ in $CD$ naj se sekata v $P$, ki leži bodisi zunaj obeh daljic $AB$ in $CD$ bodisi znotraj obeh. Če je $PA \cdot PB = PC \cdot PD$, točke $A$, $B$, $C$, $D$ ležijo na isti krožnici. Podobno: če je $PT^2 = PA \cdot PB$, se krožnica skozi $A$, $B$ in $T$ dotika premice $PT$.

**Radikalna os.** Imejmo dve krožnici s središčema $O_1$, $O_2$ in polmeroma $r_1$, $r_2$. Katere točke imajo enako potenco na obe? Če se krožnici sekata v $A$ in $B$, sta to gotovo $A$ in $B$, saj imata na obe potenco $0$. Tudi vsaka točka $M$ na premici $AB$ zunaj daljice ustreza: na obe krožnici ima potenco $MA \cdot MB$.

Splošno postavimo $O_1$ v izhodišče in $O_2$ v $(d; 0)$. Točka $(x; y)$ ima enako potenco, če velja enačba $x^2 + y^2 - r_1^2 = (x - d)^2 + y^2 - r_2^2$. Člena $x^2$ in $y^2$ se odštejeta, ostane $2dx = d^2 + r_1^2 - r_2^2$ oziroma

$$x = \frac{d^2 + r_1^2 - r_2^2}{2d}$$

To je premica, pravokotna na $O_1O_2$. Imenujemo jo **radikalna os** krožnic. Iz vsake njene točke zunaj krožnic sta tangenti na obe krožnici enako dolgi.

:::premisli
Naj bo $r_1 > r_2$. Leži radikalna os na razpolovišču $O_1O_2$, bližje večji ali bližje manjši krožnici? Napovej, preden pogledaš.
---
Bližje manjši. Razpolovišče je pri $\frac{d}{2}$, os pa je od njega premaknjena za $\frac{r_1^2 - r_2^2}{2d}$. Pri $r_1 > r_2$ je ta premik pozitiven, torej proti $O_2$. Simetrala $O_1O_2$ je le pri enakih polmerih.
:::

**Radikalno središče.** Tri krožnice s središči, ki niso na isti premici, imajo tri radikalne osi. Točka, ki leži na osi prve in druge ter na osi prve in tretje krožnice, ima enako potenco na vse tri. Zato leži tudi na osi druge in tretje. Vse tri osi se torej sekajo v eni točki, **radikalnem središču**. Tako na tekmovanjih dokažemo, da so tri premice sočasne (gredo skozi isto točko): pokažemo, da so radikalne osi treh krožnic.

## Rešeni primeri

### Primer 1: Nikina plošča

Na kosu stekla je tetiva $AB$ dolga $80\,\mathrm{cm}$. Od njenega razpolovišča $M$ do roba je pravokotno $10\,\mathrm{cm}$, do točke $C$. Steklar zaračuna $50$ € za $\mathrm{m}^2$. Koliko stane nova okrogla plošča?

**Podatki:** $AB = 80\,\mathrm{cm}$, $MA = MB = 40\,\mathrm{cm}$, $MC = 10\,\mathrm{cm}$, cena $50$ € za $\mathrm{m}^2$
**Iščemo:** polmer $r$ in ceno plošče

:::formula
Sekajoči se tetivi: $MA \cdot MB = MC \cdot MD$
:::

**Rešitev:**

1. Pravokotnica na tetivo skozi njeno razpolovišče gre skozi središče. Podaljšamo jo čez $M$ do nasprotnega roba, do točke $D$. Zato je $CD$ premer in $MD = 2r - 10$.
2. Enačba $40 \cdot 40 = 10 \cdot (2r - 10)$ da $2r - 10 = 160$, torej $r = 85\,\mathrm{cm}$.
3. Ploščina: $S = \pi \cdot (0{,}85\,\mathrm{m})^2 \approx 2{,}2698\,\mathrm{m}^2$.
4. Cena: $2{,}2698 \cdot 50 \approx 113{,}49$ €.
5. Odgovor: premer plošče je $170\,\mathrm{cm}$, nova plošča stane približno $113{,}49$ €.

### Primer 2: sekanta in tangenta

Krožnica ima polmer $5$, točka $P$ je od središča $O$ oddaljena $13$. Premica skozi $P$ seka krožnico v $A$ in $B$, pri čemer je $PA = 9$. Izračunaj $PB$, tetivo $AB$ in dolžino tangente $PT$.

**Podatki:** $r = 5$, $OP = 13$, $PA = 9$
**Iščemo:** $PB$, $AB$, $PT$

:::formula
$PA \cdot PB = PT^2 = OP^2 - r^2$
:::

**Rešitev:**

1. Potenca: $p(P) = 13^2 - 5^2 = 144$.
2. Ker je $PA \cdot PB = 144$, je $PB = \frac{144}{9} = 16$.
3. $A$ je bližje presečišče, zato $AB = 16 - 9 = 7$.
4. Tangenta: $PT = \sqrt{144} = 12$.
5. Preizkus: bližje presečišče je najbližje pri premici skozi središče ($OP - r = 8$) in najdlje pri tangenti ($PT = 12$). Število $9$ leži vmes.
6. Odgovor: $PB = 16$, $AB = 7$, $PT = 12$.

### Primer 3: skupna tangenta

Krožnici se sekata v $A$ in $B$. Njuna skupna tangenta se ju dotika v $T_1$ in $T_2$, pri čemer je $T_1T_2 = 10$. Premica $AB$ seka $T_1T_2$ v točki $M$. Dokaži, da je $M$ razpolovišče $T_1T_2$, in izračunaj $AB$, če je $MA = 2$ in $A$ leži med $M$ in $B$.

**Podatki:** $T_1T_2 = 10$, $MA = 2$, $A$ med $M$ in $B$
**Iščemo:** $MT_1$, $MT_2$, $AB$

:::formula
$MT_1^2 = MA \cdot MB = MT_2^2$
:::

**Rešitev:**

1. Premica $AB$ je radikalna os obeh krožnic, ker gre skozi presečišči.
2. $M$ leži na njej, zato ima na obe krožnici enako potenco: na prvo $MT_1^2$, na drugo $MT_2^2$.
3. Torej $MT_1 = MT_2 = 5$; $M$ je razpolovišče $T_1T_2$.
4. Na prvi krožnici velja $MA \cdot MB = 25$, zato $MB = \frac{25}{2} = 12{,}5$.
5. $AB = 12{,}5 - 2 = 10{,}5$.
6. Odgovor: premica $AB$ razpolovi skupno tangento, tetiva $AB$ je dolga $10{,}5$.

### Primer 4 – zdaj ti: radikalno središče

Krožnica $k_1$ ima središče $(0; 0)$ in polmer $5$, $k_2$ središče $(12; 0)$ in polmer $1$, $k_3$ središče $(2; 6)$ in polmer $5$. Poišči točko, iz katere so tangente na vse tri krožnice enako dolge, in izračunaj njihovo dolžino.

**Podatki:** $k_1$: $(0; 0)$, $r_1 = 5$; $k_2$: $(12; 0)$, $r_2 = 1$; $k_3$: $(2; 6)$, $r_3 = 5$
**Iščemo:** radikalno središče in dolžino tangent

:::formula
Potenca točke $(x; y)$ na krožnico s središčem $(a; b)$ in polmerom $r$: $(x - a)^2 + (y - b)^2 - r^2$
:::

**Rešitev:**

1. Os $k_1$ in $k_2$: enačba $x^2 + y^2 - 25 = (x - 12)^2 + y^2 - 1$ da $24x = 168$, torej $x = 7$.
2. Os $k_1$ in $k_3$: enačba $x^2 + y^2 - 25 = (x - 2)^2 + (y - 6)^2 - 25$ da $4x + 12y = 40$ oziroma $x + 3y = 10$.
3. Presekaj osi in izračunaj dolžino tangente sam, nato preveri:

:::premisli
Kje je radikalno središče in kako dolge so tangente?
---
Iz $7 + 3y = 10$ sledi $y = 1$, središče je $(7; 1)$. Potenca na $k_1$ je $49 + 1 - 25 = 25$, tangente so dolge $5$. Preizkus na $k_2$: $(7 - 12)^2 + 1 - 1 = 25$.
:::

## Pogoste napake

- **$PA \cdot AB$ namesto $PA \cdot PB$.** Dijak vzame zunanji del in tetivo, ker sta »na sliki«. Toda podobna trikotnika dasta razmerje razdalj od $P$. Obe dolžini vedno meri od $P$: $PB = PA + AB$.
- **Polmer brez kvadrata.** Zapis $OP^2 - r$ ali $OP - r$ je napačen, ker potenca izhaja iz Pitagorovega izreka $PT^2 = OP^2 - r^2$. Kvadriraj obe razdalji.
- **Predznak v notranjosti.** Za točko v krožnici je $OP^2 - r^2$ negativno, dolžine pa so pozitivne. Kdor tega ne opazi, dobi negativno dolžino. Tam velja $PA \cdot PB = r^2 - OP^2$, če je $P$ v notranjosti.
- **Radikalna os je simetrala središč.** Velja le pri enakih polmerih. Sicer je os pravokotna na $O_1O_2$, a premaknjena proti manjši krožnici.
- **Potenca ostane, ko premaknemo $P$.** Stalen je produkt za vse premice skozi isto točko. Ko se $P$ premakne, se spremeni $OP$ in z njim potenca.

## Povzetek

- Potenca točke $P$ na krožnico s središčem $O$ in polmerom $r$: $p(P) = OP^2 - r^2$.
- Za vsako premico skozi $P$, ki seka krožnico v $A$ in $B$, je $PA \cdot PB = |p(P)|$; za tangento iz zunanje točke $PT^2 = p(P)$.
- Zunaj je potenca pozitivna, na krožnici $0$, znotraj negativna.
- Obrat: iz $PA \cdot PB = PC \cdot PD$ sledi, da $A$, $B$, $C$, $D$ ležijo na krožnici.
- Radikalna os dveh krožnic so točke z enako potenco na obe; je premica, pravokotna na zveznico središč, pri sekajočih se krožnicah skozi presečišči.
- Radikalne osi treh krožnic se sekajo v radikalnem središču; iz njega so tangente na vse tri enako dolge.

## Drugače: Z analogijo

Imaš natanko $16$ € za sadje. Kupiš lahko $2\,\mathrm{kg}$ po $8$ €, $4\,\mathrm{kg}$ po $4$ € ali $3{,}2\,\mathrm{kg}$ po $5$ €. Količina in cena se spreminjata, njun produkt pa ostane proračun.

Točka $P$ je tak proračun. Vsaka premica skozi $P$ je drug nakup: razdalja do bližjega presečišča je en faktor, do daljnega drugi, produkt je vedno $p(P)$. Tangenta je nakup, pri katerem sta faktorja enaka ($4 \cdot 4$). Ko se premakneš v drugo točko, dobiš drug proračun.

Dve krožnici sta kot dve trgovini z različnima ponudbama. Radikalna os so mesta, kjer sta »proračuna« enaka in ti je vseeno, katero izbereš.

## Drugače: Iz vsakdanjega življenja

Kako daleč vidiš obzorje? Tvoje oko $P$ je $h = 1{,}7\,\mathrm{m}$ nad morjem, Zemlja je krogla s polmerom $R = 6371\,\mathrm{km}$. Pogled proti obzorju je tangenta, navpična črta skozi središče Zemlje pa sekanta. Bližje presečišče je pod tvojimi nogami ($h$), daljše na drugi strani Zemlje ($h + 2R$). Zato je razdalja do obzorja

$$d = \sqrt{h(2R + h)}$$

Za $h = 1{,}7\,\mathrm{m}$ dobiš $d \approx 4654\,\mathrm{m}$, torej slabih $5\,\mathrm{km}$. S stolpa, visokega $100\,\mathrm{m}$, je obzorje oddaljeno približno $35{,}7\,\mathrm{km}$.

## Preveri se

? Točka $P$ je zunaj krožnice s središčem $O$ in polmerom $r$. $PT$ je tangenta, premica skozi $P$ seka krožnico v $A$ (bližje) in $B$. Kateri izraz ne sodi zraven, ker ni enak potenci točke $P$?
- $PA \cdot PB$
~ Ta produkt je potenca za vsako sekanto skozi $P$, ne glede na smer premice.
- $PT^2$
~ Tangenta je mejni primer sekante, pri katerem se $A$ in $B$ zlijeta v $T$; zato je $PT^2$ potenca.
- $OP^2 - r^2$
~ To je definicija potence; Pitagorov izrek v trikotniku $OTP$ da $PT^2 = OP^2 - r^2$.
+ $PA \cdot AB$
> Potenca je produkt razdalj od $P$ do obeh presečišč. $AB$ je tetiva, ne razdalja od $P$, zato $PA \cdot AB$ ne sodi zraven.

? Z risbe odčitaj $PA = 4$ in $AB = 5$. Kolikšna je dolžina tangente $PT$?
:::risba skica
opis: Krožnica s polmerom 3. Iz točke P levo zunaj krožnice gre vodoravna sekanta, ki seka krožnico v A in B. PA je dolga 4, tetiva AB 5. Iz P gre tangenta do dotikališča T zgoraj.
območje: -7; -4 .. 4; 4
enota: 28
krog: 0; 0 | 3 | modra
črta: -6,5; 1,66 -> 2,5; 1,66 | oranžna
črta: -6,5; 1,66 -> -0,64; 2,93 | rdeča debelo
točka: -6,5; 1,66 | P | levo
točka: -2,5; 1,66 | A | pod
točka: 2,5; 1,66 | B | pod
točka: -0,64; 2,93 | T | nad
napis: -4,5; 1,66 | 4 | pod
napis: 0; 1,66 | 5 | pod
:::
= 6 | 0,01
~ 4,47 | To je $\sqrt{PA \cdot AB} = \sqrt{20}$. Druga razdalja se meri od $P$: $PB = 4 + 5 = 9$.
~ 36 | To je $PT^2$. Dolžina tangente je koren potence.
> $PB = 4 + 5 = 9$, $PT^2 = PA \cdot PB = 36$, torej $PT = 6$.

? Točko $P$ zunaj krožnice premikamo proti krožnici. Kaj se zgodi s potenco in zakaj?
- Ostane enaka, ker je produkt $PA \cdot PB$ za vse premice enak.
~ Produkt je enak za vse premice skozi isto točko. Ko se $P$ premakne, se spremeni $OP$ in s tem potenca.
+ Pada proti $0$, ker se $OP$ približuje $r$ in je $p(P) = OP^2 - r^2$.
- Raste, ker postane tetiva $AB$ daljša.
~ Daljša tetiva ne pomeni večjega produkta: razdalji $PA$ in $PB$ merimo od $P$, bližje presečišče pa se približuje $P$.
> Ko je $P$ na krožnici, je $OP = r$ in potenca $0$; tangenta ima takrat dolžino $0$.

? Krožnica $k_1$ ima središče $(0; 0)$ in polmer $5$, krožnica $k_2$ središče $(6; 0)$ in polmer $3$. Ana išče radikalno os.
**Korak 1.** Os so točke z enako potenco na obe krožnici.
**Korak 2.** Za točko $(x; y)$ zapiše enačbo $x^2 + y^2 - 5 = (x - 6)^2 + y^2 - 3$.
**Korak 3.** Odšteje $x^2 + y^2$ in dobi $12x = 38$.
**Korak 4.** Os je navpična premica $x = \frac{19}{6}$.
Kateri korak je napačen?
- Korak 1
~ To je pravilna definicija radikalne osi.
+ Korak 2
- Korak 3
~ Iz zapisane enačbe res sledi $12x = 38$; napaka je prej.
- Korak 4
~ Iz $12x = 38$ res sledi $x = \frac{19}{6}$; napaka je prej.
> V potenci nastopa kvadrat polmera: $x^2 + y^2 - 25 = (x - 6)^2 + y^2 - 9$. Od tod $12x = 52$ in os $x = \frac{13}{3}$.

? Razvrsti korake iskanja točke, iz katere so tangente na tri krožnice enako dolge.
1. Zapiši potenco poljubne točke na vsako od treh krožnic.
2. Izenači potenci na prvo in drugo krožnico: dobiš prvo radikalno os.
3. Izenači potenci na prvo in tretjo krožnico: dobiš drugo radikalno os.
4. Izračunaj presečišče osi: to je radikalno središče.
5. Dolžina tangente je koren potence radikalnega središča.
> Vsaka os da eno premico; presečišče dveh osi ima enako potenco na vse tri krožnice, tangenta pa je koren te potence.

:::simboli
p | potenca točke $P$ | p = OP^2 - r^2 | | zunaj pozitivna, znotraj negativna
O | središče krožnice | | |
P | točka, katere potenco računamo | | |
r | polmer krožnice | | |
A, B | presečišči sekante s krožnico | | | $A$ je bližje $P$
C, D | presečišči druge sekante | | |
T | dotikališče tangente | | |
M | presečišče tetive in premera oz. točka na radikalni osi | | |
T_1, T_2 | dotikališči skupne tangente | | |
O_1, O_2 | središči dveh krožnic | | |
r_1, r_2, r_3 | polmeri krožnic | | |
k_1, k_2, k_3 | krožnice v Primeru 4 | | |
S | ploščina steklene plošče | S = \pi r^2 | m^2 | Primer 1
d | razdalja med središčema | | | v Drugače: razdalja do obzorja
x, y | koordinati točke | | |
a, b | koordinati središča krožnice | | |
h | višina očesa nad morjem | | m |
R | polmer Zemlje | | km |
:::

<<RACUN
resi: 40*40 = 10*(2*r - 10) | r | 85
vrednost: pi*0.85^2 | 2.2698
vrednost: pi*0.85^2*50 | 113.49
vrednost: 16/2.5 | 6.4
vrednost: 13^2 - 5^2 | 144
vrednost: 144/9 | 16
vrednost: sqrt(144) | 12
resi: 2*y = 25 | y | 12.5
vrednost: 12.5 - 2 | 10.5
resi: -25 = -24*x + 143 | x | 7
resi: 7 + 3*y = 10 | y | 1
vrednost: 7^2 + 1^2 - 25 | 25
vrednost: (7 - 12)^2 + 1^2 - 1 | 25
vrednost: (7 - 2)^2 + (1 - 6)^2 - 25 | 25
vrednost: sqrt(4*9) | 6
vrednost: sqrt(4*5) | 4.47
resi: 12*x = 52 | x | 13/3
resi: 12*x = 38 | x | 19/6
vrednost: sqrt(1.7*(2*6371000 + 1.7)) | 4654.18
vrednost: sqrt(100*(2*6371000 + 100)) | 35696.08
>>
