---
stanje: osnutek
demo: konstrukcija
avtor: AI
---

## Zakaj se tega učimo

Uganka za začetek. Na vremenski karti sta postaji $A$ in $B$, narisani $6\,\text{cm}$ narazen. Meteorologi bi radi postavili radar, ki bo od obeh postaj enako oddaljen. Kje vse ga lahko postavijo? Nariši točki $6\,\text{cm}$ narazen in poišči vsaj tri taka mesta, preden bereš naprej.

Eno mesto najdeš hitro: sredino med postajama. Druga z ravnilom iščeš dolgo in le približno. Šestilo pa ima lastnost, ki tu pomaga: vse točke, ki jih zariše, so enako oddaljene od središča. Risanju samo s šestilom in ravnilom, brez merjenja, rečemo **konstrukcija**. Z njo najdeš vsa iskana mesta, razpoloviš kot in narišeš pravi kot brez kotomera. Mizarji, geodeti in arhitekti jo uporabljajo že več kot 2000 let.

## Razlaga

**1. Orodje in pravila.** Šestilo nariše krožni lok (kos krožnice) z izbranim središčem in polmerom, ravnilo pa samo ravno črto (z njim ne merimo). Razpona šestila med enim korakom ne spreminjaj. Pomožnih lokov ne briši, končni rezultat pa potegni močneje.

**2. Ključna zamisel: krožni lok.** Vse točke loka s središčem $A$ in polmerom $r$ so od $A$ oddaljene za $r$, saj je lok del krožnice. Če narišemo enako velika loka s središčema $A$ in $B$, je vsako njuno presečišče enako oddaljeno od $A$ in od $B$. Na tem temelji skoraj vsaka konstrukcija.

**3. Simetrala daljice.** Vrnimo se k uganki. Šestilo nastavi na $4\,\text{cm}$ in nariši lok s središčem $A$ ter enak lok s središčem $B$. Loka se sekata v dveh točkah, nad daljico in pod njo. Obe sta od $A$ in od $B$ oddaljeni po $4\,\text{cm}$. Ponovi s polmerom $5\,\text{cm}$ in dobiš še dve taki točki. Vse štiri ležijo na isti ravni črti skupaj z razpoloviščem daljice, črta pa seka daljico pod pravim kotom.

Tej premici pravimo **simetrala daljice**: premica skozi razpolovišče daljice, ki je pravokotna nanjo. **Vsaka točka simetrale je enako oddaljena od $A$ in $B$.** Odgovor na uganko je torej: radar lahko stoji kjer koli na simetrali daljice $AB$, takih mest je neskončno mnogo.

:::risba skica
opis: Daljica AB, dolga 6 enot. Okrog A in okrog B sta črtkani krožnici s polmerom 4 enote. Sekata se v točki C nad daljico in v točki D pod njo. Premica CD gre skozi razpolovišče M in je pravokotna na AB.
območje: -2,5; -1,5 .. 12,5; 7,5
krog: 2; 3 | 4 | črtkano
krog: 8; 3 | 4 | črtkano
črta: 2; 3 -> 8; 3 | debelo
črta: 5; -1,2 -> 5; 7,2 | modra
pravikot: 5; 3 | 8; 3 | 5; 5,65
točka: 2; 3 | A | levo
točka: 8; 3 | B | desno
točka: 5; 5,65 | C | desno
točka: 5; 0,35 | D | desno
točka: 5; 3 | M | pod levo
napis: 5; 7,2 | simetrala | desno
:::

Postopek:

1. Nastavi šestilo na polmer $r$, ki je **večji od polovice dolžine daljice** $AB$.
2. Zapiči šestilo v $A$ in nariši lok nad daljico in pod njo.
3. Brez spremembe razpona zapiči šestilo v $B$ in nariši lok, ki prvega seka v dveh točkah.
4. Presečišči povežeš z ravnilom. Dobljena premica je simetrala daljice.

:::premisli
Daljica je dolga $6\,\text{cm}$. Zakaj šestila ne smeš nastaviti na $2\,\text{cm}$? Napovej, kaj se zgodi z lokoma, nato preveri z risbo.
---
Loka se ne srečata. Vsak seže le $2\,\text{cm}$ od krajišča, do sredine pa je $3\,\text{cm}$. Pri polmeru natanko $3\,\text{cm}$ bi se le dotaknila v razpolovišču. Polmer mora biti večji od $3\,\text{cm}$.
:::

**4. Pravokotnica.** Pravokotni premici ($a \perp b$) se sekata pod kotom $90^\circ$. Pravokotnico skozi dano točko $T$ na dano premico $p$ konstruiramo v dveh primerih.

*Točka $T$ leži na premici $p$.*

1. Zapiči šestilo v $T$ in nariši lok, ki premico $p$ seka na obeh straneh točke $T$, v točkah $A$ in $B$. Točka $T$ je zdaj razpolovišče daljice $AB$.
2. Konstruiraj simetralo daljice $AB$. Ta poteka skozi $T$ in je iskana pravokotnica.

*Točka $T$ leži zunaj premice $p$.*

1. Zapiči šestilo v $T$ in nariši lok z dovolj velikim polmerom, da seka premico $p$ v dveh točkah $A$ in $B$.
2. Konstruiraj simetralo daljice $AB$. Ker je $T$ enako oddaljena od $A$ in $B$, leži $T$ na tej simetrali. Simetrala je pravokotna na $AB$, torej na $p$.

Pravokotnica je torej le poseben primer simetrale daljice. Pravokotnica seka premico $p$ v točki, recimo ji $N$. Dolžini daljice $TN$ pravimo **razdalja točke od premice**: to je najkrajša pot od $T$ do $p$.

**5. Simetrala kota.** Kot ima **vrh** $V$ in dva **kraka** (poltraka iz vrha). **Simetrala kota** je poltrak iz vrha, ki kot razdeli na dva enaka dela.

Postopek:

1. Zapiči šestilo v vrh $V$ in nariši lok, ki seka oba kraka, v točkah $A$ in $B$.
2. Zapiči šestilo v $A$ in nariši lok znotraj kota. Polmer naj bo večji od polovice razdalje $AB$.
3. Brez spremembe razpona zapiči šestilo v $B$ in nariši lok, ki prvega seka v točki $S$.
4. Potegni poltrak iz $V$ skozi $S$. To je simetrala kota.

Če je kot enak $\alpha$, je vsak od obeh delov enak $\dfrac{\alpha}{2}$. Točke simetrale so enako oddaljene od obeh krakov.

:::premisli
Zakaj mora imeti prvi lok središče prav v vrhu $V$?
---
Tako sta $A$ in $B$ enako oddaljeni od $V$, točka $S$ pa je enako oddaljena od $A$ in $B$. Če list prepogneš po poltraku $VS$, se $A$ pokrije z $B$ in krak s krakom, zato sta dela kota enaka. Z lokom drugje bi bili $|VA|$ in $|VB|$ različni in $VS$ kota ne bi razpolovil.
:::

| Kot $\alpha$ | $80^\circ$ | $90^\circ$ | $120^\circ$ |
|---|---|---|---|
| vsak del $\dfrac{\alpha}{2}$ | $40^\circ$ | $45^\circ$ | $60^\circ$ |

**6. Preverjanje.** Rezultat lahko preveriš z merjenjem. Pri simetrali daljice izmeri obe polovici, pri pravokotnici uporabi kotomer ali geotrikotnik, pri simetrali kota izmeri oba dela kota. Pri natančni konstrukciji se izmerjeni deli razlikujejo le za malo.

V simulaciji spodaj (**Osnovne konstrukcije po korakih**) izberi »Simetrala kota« in z gumbom »Naprej« pojdi korak za korakom. Opazuj, da sta točki na krakih enako daleč od vrha in da je slika na obeh straneh simetrale zrcalno enaka.

## Rešeni primeri

### Primer 1 (lažji)

Na vremenski karti sta postaji $A$ in $B$ narisani $7\,\text{cm}$ narazen. Konstruiraj simetralo daljice $AB$: na njej so vsa mesta, enako oddaljena od obeh postaj. Kolikšna je razdalja razpolovišča od krajišča $A$ in kakšen polmer šestila izbereš?

**Podatki:** $\lvert AB\rvert = 7\,\text{cm}$
**Iščemo:** razdaljo razpolovišča od $A$ in primeren polmer šestila $r$

:::formula
Razpolovišče: $\dfrac{\lvert AB\rvert}{2}$. Polmer šestila: $r > \dfrac{\lvert AB\rvert}{2}$.
:::

**Rešitev:**

1. Razdalja razpolovišča od krajišča: $7\,\text{cm} : 2 = 3{,}5\,\text{cm}$.
2. Polmer mora biti večji od $3{,}5\,\text{cm}$. Izberemo na primer $r = 5\,\text{cm}$.
3. Z istim polmerom $5\,\text{cm}$ narišemo loka okrog $A$ in okrog $B$. Sekata se v dveh točkah, ki ju povežemo z ravnilom.
4. Odgovor: razpolovišče je od $A$ oddaljeno $3{,}5\,\text{cm}$. Polmer je lahko $5\,\text{cm}$ ali kateri koli, večji od $3{,}5\,\text{cm}$.

### Primer 2 (srednji)

Na zemljevidu stoji planinec v točki $T$, ravna reka pa je premica $p$, od $T$ oddaljena $4\,\text{cm}$. Najkrajša pot do vode poteka po pravokotnici. Konstruiraj pravokotnico skozi $T$ na $p$, vse loke s polmerom $5\,\text{cm}$. Prvi lok ima središče v $T$ in seka $p$ v točkah $A$ in $B$. Loka s središčema $A$ in $B$ se sekata v $T$ in še v točki $T'$. Kje leži $T'$ in kolikšna je razdalja $\lvert TT'\rvert$?

**Podatki:** razdalja $T$ od $p$ je $4\,\text{cm}$; polmer prvega loka (središče $T$) je $5\,\text{cm}$; polmer lokov s središčema $A$ in $B$ je $5\,\text{cm}$
**Iščemo:** pravokotnico skozi $T$, položaj točke $T'$ in dolžino $\lvert TT'\rvert$

:::formula
Pravokotnica skozi $T$ je simetrala daljice $AB$, kjer sta $A$, $B$ presečišči loka s središčem $T$ s premico $p$.
:::

**Rešitev:**

1. Lok s središčem $T$ in polmerom $5\,\text{cm}$ seka $p$ v $A$ in $B$. Obe točki sta od $T$ oddaljeni $5\,\text{cm}$.
2. Z istim razponom narišemo loka okrog $A$ in okrog $B$. Sekata se v $T$, saj je $T$ od $A$ in od $B$ oddaljena ravno $5\,\text{cm}$. Drugo presečišče $T'$ leži na drugi strani premice $p$.
3. Premica $TT'$ je simetrala daljice $AB$, zato je pravokotna na $p$.
4. Loka okrog $A$ in $B$ sta na obeh straneh premice $p$ enaka, zato je slika zrcalna glede na $p$. Točka $T'$ je od $p$ oddaljena prav tako $4\,\text{cm}$ kot $T$.
5. Odgovor: pravokotnica je premica $TT'$; točka $T'$ leži na drugi strani premice $p$, $4\,\text{cm}$ od nje. Velja $\lvert TT'\rvert = 4\,\text{cm} + 4\,\text{cm} = 8\,\text{cm}$.

### Primer 3 (težji)

Na vetrokazu so smeri neba. Smer zahod–vzhod je premica $p$, vetrokaz se vrti okrog točke $V$ na njej. Sever je pravokoten na $p$, severozahod pa leži točno na sredini med severom in zahodom. Brez kotomera konstruiraj smer severozahod. Kolikšen kot oklepa s smerjo vzhod?

**Podatki:** smer zahod–vzhod je premica $p$ skozi $V$ (iztegnjeni kot $180^\circ$); sever je pravokoten na $p$; severozahod razpolavlja kot med severom in zahodom; orodje: šestilo in ravnilo
**Iščemo:** konstrukcijo smeri severozahod in kot med vzhodom in severozahodom

:::formula
$90^\circ : 2 = 45^\circ$ in $180^\circ - 45^\circ = 135^\circ$
:::

**Rešitev:**

1. Skozi $V$ konstruiramo pravokotnico na $p$. Ta kaže proti severu, s smerjo zahod oklepa pravi kot.
2. Pravi kot med severom in zahodom razpolovimo s simetralo kota. Simetrala je smer severozahod; z zahodom oklepa $90^\circ : 2 = 45^\circ$.
3. Zahod in vzhod sta nasprotna poltraka premice $p$, skupaj tvorita iztegnjeni kot. Zato je kot med vzhodom in severozahodom $180^\circ - 45^\circ = 135^\circ$.
4. Preverimo drugače: od vzhoda do severa je pravi kot, od severa do severozahoda še pol pravega, $90^\circ + 45^\circ = 135^\circ$.
5. Odgovor: smer severozahod je simetrala pravega kota med severom in zahodom. S smerjo vzhod oklepa $135^\circ$, z zahodom $45^\circ$.

### Primer 4 – zdaj ti

Dve ravni gozdni poti se začneta pri koči $V$ in oklepata kot $110^\circ$. Gozdarji bodo med njima zasadili vrsto smrek, ki bo od obeh poti povsod enako oddaljena. Kje bo vrsta in kolikšen kot oklepa z vsako potjo?

**Podatki:** poti sta kraka kota z vrhom $V$, $\alpha = 110^\circ$; vrsta smrek je od obeh poti enako oddaljena
**Iščemo:** lego vrste smrek in kot med vrsto in vsako potjo

:::formula
Simetrala kota razdeli kot $\alpha$ na dva dela po $\dfrac{\alpha}{2}$.
:::

**Rešitev:**

1. Točke, ki so enako oddaljene od obeh krakov, ležijo na simetrali kota. Vrsta smrek bo torej na simetrali kota z vrhom $V$.
2. Konstrukcija: lok okrog $V$ seka poti v $A$ in $B$, loka z enakim polmerom okrog $A$ in $B$ se sekata v $S$, poltrak $VS$ je simetrala.
3. Izračunaj kot med vrsto in vsako potjo ter rezultat preveri.

:::premisli
Kolikšen kot oklepa vrsta smrek z vsako potjo?
---
$110^\circ : 2 = 55^\circ$. Preizkus: $55^\circ + 55^\circ = 110^\circ$.
:::

## Pogoste napake

- **Razpon šestila se med korakom spremeni.** Če pri loku v $A$ uporabiš en polmer, pri loku v $B$ pa drugega, presečišči nista enako oddaljeni od $A$ in $B$ in premica ni simetrala. Pravilno: polmer nastavi enkrat, pri lokih v $A$ in $B$ ga ne spreminjaj, šestilo pa drži za ročaj in ne za krake.
- **Polmer je premajhen.** Če je polmer manjši od polovice daljice $AB$, se loka ne srečata. Če je enak polovici, se le dotakneta v razpolovišču, in premice ni s čim določiti. Pravilno: polmer vedno izberi večji od $\dfrac{\lvert AB\rvert}{2}$. Pri daljici $6\,\text{cm}$ vzemi na primer $4\,\text{cm}$.
- **Zamenjava simetrale in pravokotnice skozi krajišče.** Simetrala daljice gre skozi *razpolovišče*, ne skozi krajišče. Pravilno: preveri, da sta obe polovici daljice enako dolgi, vsaka $\dfrac{\lvert AB\rvert}{2}$, in da je kot $90^\circ$.
- **Središče loka pri simetrali kota.** Prvi lok mora imeti središče v *vrhu* kota $V$, ne v kateri koli drugi točki. Pravilno: najprej zapiči šestilo v $V$, šele nato iz točk $A$ in $B$ na krakih nadaljuj.

## Povzetek

- Konstrukcija je risanje s šestilom in ravnilom, brez merjenja. Razpona šestila med korakom ne spreminjaj.
- **Simetrala daljice** $AB$: loka z enakim polmerom $r > \dfrac{\lvert AB\rvert}{2}$ okrog $A$ in $B$, presečišči povežeš. Poteka skozi razpolovišče in je pravokotna na $AB$.
- Točke simetrale daljice so enako oddaljene od krajišč.
- **Pravokotnica** skozi točko $T$: lok okrog $T$ na premici $p$ izreže $A$ in $B$, nato simetrala daljice $AB$. Pravokotnica in $p$ oklepata kot $90^\circ$.
- **Simetrala kota** $\alpha$: lok okrog vrha $V$, nato loka okrog presečišč s kraki. Vsak del je $\dfrac{\alpha}{2}$.
- Ko razpolovimo pravi kot, dobimo kot $45^\circ$.

## Drugače: Korak za korakom s številkami

**A. Simetrala daljice dolžine $8\,\text{cm}$.**

1. Polovica: $8\,\text{cm} : 2 = 4\,\text{cm}$.
2. Polmer mora biti večji od $4\,\text{cm}$, izbereš $5\,\text{cm}$.
3. Nariši loka okoli $A$ in $B$ in poveži presečišči. Razpolovišče je od $A$ in od $B$ oddaljeno $4\,\text{cm}$, skupaj $4\,\text{cm} + 4\,\text{cm} = 8\,\text{cm}$.

**B. Simetrala kota $50^\circ$.**

1. Lok okoli vrha $V$ preseka kraka v $A$ in $B$.
2. Loka okoli $A$ in $B$ se srečata v točki $S$.
3. Poltrak $VS$ razdeli kot na dva dela po $50^\circ : 2 = 25^\circ$.
4. Preveri: $25^\circ + 25^\circ = 50^\circ$.

**C. Pravokotnica skozi točko na premici.**

1. Točka $T$ leži na $p$. Lok s polmerom $3\,\text{cm}$ izreže $A$ in $B$, kjer sta $\lvert TA\rvert = \lvert TB\rvert = 3\,\text{cm}$.
2. Daljica $AB$ je dolga $3\,\text{cm} + 3\,\text{cm} = 6\,\text{cm}$.
3. Simetrala daljice $AB$ gre skozi razpolovišče $T$ in tvori kot $90^\circ$ s premico $p$.

## Drugače: Kot zgodba

Po neurju je potok odplavil skupni zbiralnik deževnice sosedov Ane in Bora. Novega sta hotela postaviti tako, da bi bil od obeh hiš enako daleč. Meter je bil prekratek, zato sta vzela vrv in kola.

Ana je en kol zabila ob svojo hišo $A$, nanj privezala vrv in z drugim kolom ob napeti vrvi zarisala lok po travi. Bor je z isto vrvjo naredil enako ob svoji hiši $B$. Loka sta se sekala v dveh točkah, ena je bila pred hišama, druga za njima. Med njima sta napela vrvico.

»Vsaka točka na tej vrvici je od tvoje hiše enako daleč kot od moje,« je rekla Ana. Zbiralnik sta postavila tam, kjer vrvica preseka pot. Brez računanja sta konstruirala simetralo daljice $AB$, vrv pa jima je služila kot šestilo.

## Preveri se

? Katera trditev drži za simetralo daljice $AB$?
+ Poteka skozi razpolovišče daljice in je pravokotna nanjo.
- Poteka skozi krajišče $A$ in je pravokotna na daljico.
~ To je pravokotnica v krajišču. Simetrala gre skozi razpolovišče, zato so njene točke enako oddaljene od $A$ in $B$.
- Daljico razpolovi pod kotom $45^\circ$.
~ Simetrala in daljica oklepata pravi kot, $90^\circ$. Kot $45^\circ$ dobiš, ko razpoloviš pravi kot.
- Razpolovišče je edina njena točka, ki je enako oddaljena od $A$ in $B$.
~ Enako oddaljena od $A$ in $B$ je vsaka točka simetrale, tudi tiste daleč od daljice.
> Simetrala daljice je premica skozi razpolovišče, ki z daljico oklepa $90^\circ$. Vse njene točke so enako oddaljene od $A$ in $B$.

? Na sliki je poltrak $VS$ simetrala kota $AVB$. Kot med krakom $VA$ in simetralo meri $35^\circ$. Koliko stopinj meri kot $AVB$?
:::risba skica
opis: Kot AVB z vrhom V. Krak VA je vodoraven, krak VB je strm. Črtkani poltrak VS je simetrala kota. Kot med VA in VS je označen s 35°.
območje: 0; 0 .. 9; 8,2
črta: 1; 1 -> 8,5; 1 | puščica
črta: 1; 1 -> 3,39; 7,58 | puščica
črta: 1; 1 -> 6,9; 5,13 | črtkano
točka: 1; 1 | V | pod
točka: 7; 1 | A | pod
točka: 3,05; 6,64 | B | levo
točka: 5,91; 4,44 | S | desno
napis: 3,48; 1,78 | 35° | desno
:::
= 70
~ 35 | To je le en del. Simetrala razdeli kot na dva enaka dela, zato je celoten kot dvakrat večji.
~ 17,5 | Kot $35^\circ$ si razpolovil, namesto da bi ga podvojil.
> Simetrala razdeli kot na dva enaka dela po $35^\circ$, zato je $\angle AVB = 2 \cdot 35^\circ = 70^\circ$.

? Rok je konstruiral simetralo daljice $AB$, dolge $6\,\text{cm}$. 1. korak: lok s središčem $A$ in polmerom $4\,\text{cm}$. 2. korak: lok s središčem $B$ in polmerom $5\,\text{cm}$. 3. korak: presečišči lokov poveže. Kje je napaka?
+ V 2. koraku: polmer v $B$ mora biti enak kot v $A$.
- V 1. koraku: polmer $4\,\text{cm}$ je premajhen.
~ $4\,\text{cm}$ je več od polovice daljice, ki meri $3\,\text{cm}$, zato je primeren.
- V 3. koraku: presečišči bi moral povezati s krajiščem $A$.
~ Simetrala gre skozi obe presečišči lokov. Črta skozi $A$ ne bi šla skozi razpolovišče.
- Napake ni, saj sta oba polmera večja od $3\,\text{cm}$.
~ Večja sta, a različna. Presečišči sta zato od $A$ oddaljeni $4\,\text{cm}$, od $B$ pa $5\,\text{cm}$, in premica ne gre skozi razpolovišče.
> Polmer nastaviš enkrat in ga pri obeh lokih ne spreminjaš. Le tako sta presečišči enako oddaljeni od $A$ in $B$.

? Razvrsti korake konstrukcije simetrale kota z vrhom $V$.
1. Zapiči šestilo v vrh $V$ in nariši lok, ki seka oba kraka, v točkah $A$ in $B$.
2. Zapiči šestilo v $A$ in nariši lok znotraj kota s polmerom, večjim od polovice razdalje $AB$.
3. Brez spremembe razpona zapiči šestilo v $B$ in nariši lok, ki prvega seka v točki $S$.
4. Potegni poltrak iz $V$ skozi $S$.
> Prvi lok mora imeti središče v vrhu, da sta $A$ in $B$ enako daleč od $V$. Šele nato enaka loka okrog $A$ in $B$ dasta točko $S$ simetrale.

? Planinec stoji v točki $T$ blizu ravne reke $p$ in bi rad do vode po najkrajši poti. Kaj konstruira na zemljevidu?
+ Pravokotnico iz $T$ na $p$: lok okrog $T$ izreže na $p$ točki $A$ in $B$, nato simetrala daljice $AB$.
- Simetralo kota med reko in poljubno potjo iz $T$.
~ Simetrala kota razpolovi kot. Najkrajša pot do premice pa je pravokotna nanjo.
- Daljico od $T$ do katere koli točke na reki.
~ Teh daljic je neskončno in so različno dolge. Najkrajša je tista, ki je pravokotna na reko.
- Simetralo daljice med $T$ in najbližjim drevesom.
~ Ta pokaže mesta, enako oddaljena od $T$ in drevesa, ne poti do reke.
> Najkrajša pot od točke do premice je pravokotna daljica. Njena dolžina je razdalja točke od premice.

<<RACUN
vrednost: 7/2 | 3.5
vrednost: 4+4 | 8
vrednost: 90/2 | 45
vrednost: 180-45 | 135
vrednost: 90+45 | 135
vrednost: 110/2 | 55
vrednost: 55+55 | 110
vrednost: 2*35 | 70
vrednost: 6/2 | 3
vrednost: 8/2 | 4
vrednost: 50/2 | 25
>>

:::simboli
A, B | krajišči daljice $AB$ | | | pri pravokotnici presečišči loka s premico $p$, pri simetrali kota presečišči loka s krakoma
r | polmer loka (razpon šestila) | | | pri simetrali večji od $\dfrac{|AB|}{2}$
T | dana točka | | | skozi njo konstruiramo pravokotnico na $p$
p | dana premica | | |
\alpha | kot | | ^\circ | razpolovimo ga s simetralo kota
:::
