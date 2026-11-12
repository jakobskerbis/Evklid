---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poskus za jasen večer s polno Luno. Iz papirja izreži krožec s premerom $5\,\text{mm}$ in ga z lepilnim trakom pritrdi na okensko steklo. Zapri eno oko in se od okna počasi odmikaj, dokler krožec ravno pokrije Luno. Prijatelj naj izmeri razdaljo od tvojega očesa do krožca. Dobil bo približno $55\,\text{cm}$.

Iz te meritve in iz razdalje do Lune ($384\,000\,\text{km}$) izračunaš, da ima Luna premer približno $3\,500\,\text{km}$. Za to ne potrebuješ vesoljske ladje, le sorazmerje. Žarka od očesa do robov krožca in Lune sta kraka kota, krožec in Luna pa sta dve vzporedni daljici med krakoma.

Pravilo, ki to omogoča, je **Talesov izrek o sorazmerjih**. Z njim izračunaš razdalje, ki jih ne moreš izmeriti, in daljico brez merjenja razdeliš na enake dele ali v danem razmerju.

Pozor: »Talesov izrek« se imenuje tudi izrek o kotu v polkrogu. Tu govorimo o izreku o vzporednicah in razmerjih odsekov.

Nikoli ne gledaj v Sonce, niti skozi krožec ali luknjico.

## Razlaga

Izrek sestavimo po kosih. Za vsakim kosom je kratek preizkus z odgovorom v oklepaju.

**1. Kot in dve vzporednici.** Vzemimo kot z vrhom $S$. Na enem kraku ležita točki $A$ in $C$, na drugem kraku točki $B$ in $D$. Točki $A$ in $B$ sta bližje vrhu. Daljici $AB$ in $CD$ sta **vzporedni**: $AB \parallel CD$.

:::risba skica
opis: Kot z vrhom S v spodnjem levem kotu. Spodnji krak je vodoraven, na njem sta točki A pri 3 enotah in C pri 7,5 enote od S. Na poševnem kraku sta točki B in D. Daljici AB in CD sta vzporedni, CD je 2,5-krat daljša od AB.
območje: -1; -1 .. 9; 9
črta: 0; 0 -> 8,5; 0
črta: 0; 0 -> 5,6; 8,4
črta: 3; 0 -> 2; 3 | modra debelo
črta: 7,5; 0 -> 5; 7,5 | oranžna debelo
točka: 0; 0 | S | levo
točka: 3; 0 | A | pod
točka: 7,5; 0 | C | pod
točka: 2; 3 | B | levo
točka: 5; 7,5 | D | levo
podnapis: AB je vzporedna s CD; SA = 3 in SC = 7,5 enote
:::

*Preizkus:* Na katerem kraku ležita $A$ in $C$? *(Na istem kraku; $B$ in $D$ na drugem.)*

**2. Odsek od vrha in cel odsek.** Vzporednici odrežeta na obeh krakih **sorazmerne** odseke. Odsek od vrha do prve vzporednice primerjamo z odsekom od vrha do druge:

$$SA : SC = SB : SD$$

Na sliki je $SC$ $2{,}5$-krat daljši od $SA$. Zato je tudi $SD$ $2{,}5$-krat daljši od $SB$.

*Preizkus:* $SA = 2\,\text{cm}$, $SC = 6\,\text{cm}$, $SB = 2{,}5\,\text{cm}$. Koliko meri $SD$? *($SC$ je trikrat daljši od $SA$, zato $SD = 3 \cdot 2{,}5 = 7{,}5\,\text{cm}$.)*

**3. Odsek med vzporednicama.** Sorazmerje velja tudi, če namesto celega odseka vzamemo samo del **med** vzporednicama:

$$SA : AC = SB : BD$$

*Preizkus:* $SA = 4\,\text{cm}$, $AC = 2\,\text{cm}$, $SB = 6\,\text{cm}$. Koliko meri $BD$? *($AC$ je pol od $SA$, zato $BD = 6 : 2 = 3\,\text{cm}$.)*

:::premisli
Zakaj velja tudi drugo sorazmerje? Namig: če je $SC = 2{,}5 \cdot SA$, koliko je $AC$?
---
$AC = SC - SA = 2{,}5 \cdot SA - SA = 1{,}5 \cdot SA$. Na drugem kraku na enak način dobimo $BD = 1{,}5 \cdot SB$. Oba dela sta torej enakokrat daljša od odseka od vrha, zato je $SA : AC = SB : BD$.
:::

**4. Vzporednici sami.** Trikotnika $SAB$ in $SCD$ imata skupni kot pri $S$, kota pri $A$ in $C$ pa sta enaka, ker krak $SC$ seka vzporednici $AB$ in $CD$ pod enakim kotom. Dva para enakih kotov pomenita po izreku KK, da sta trikotnika podobna. Zato v istem razmerju kot cela odseka od vrha stojita tudi vzporednici:

$$SA : SC = AB : CD$$

Tu je vedno **cel** odsek od vrha. Sorazmerje $SA : AC = AB : CD$ je napačno.

To je račun iz poskusa z Luno. Vrh $S$ je oko, $SA$ je razdalja do krožca, $SC$ razdalja do Lune, $AB$ premer krožca in $CD$ premer Lune.

*Preizkus:* $5\,\text{mm} : 550\,\text{mm} = CD : 384\,000\,\text{km}$. Koliko je $CD$? *($CD = 384\,000 \cdot 5 : 550 \approx 3\,491\,\text{km}$, torej približno $3\,500\,\text{km}$. Prava vrednost je $3\,474\,\text{km}$.)*

V simulaciji spodaj (»Talesov izrek o sorazmerjih«) premikaj drsnik »nagib vzporednic«. Opazuj, da se dolžine spreminjajo, tri razmerja pa ostanejo enaka.

**5. Obrat izreka.** Velja tudi obratno: če je $SA : SC = SB : SD$, sta $AB$ in $CD$ vzporedni. Tako vzporednost preverimo z računom.

*Preizkus:* $SA = 2$, $SC = 5$, $SB = 3$, $SD = 7{,}5$ (v cm). Sta $AB$ in $CD$ vzporedni? *(Da: $2 : 5 = 0{,}4$ in $3 : 7{,}5 = 0{,}4$.)*

**6. Deljenje daljice na enake dele.** Daljico $AB$ želimo razdeliti na $5$ enakih delov brez merjenja.

1. Iz $A$ nariši poltrak, ki ne leži na premici $AB$.
2. S šestilom nanj zaporedoma nanesi $5$ enakih odsekov poljubne dolžine. Dobiš točke $P_1, P_2, \dots, P_5$.
3. Poveži $P_5$ z $B$.
4. Skozi $P_1, P_2, P_3, P_4$ nariši vzporednice k $P_5B$.

Poltrak in $AB$ sta zdaj kraka kota z vrhom $A$. Več vzporednic odreže na obeh krakih sorazmerne odseke. Na poltraku so vsi odseki enaki, zato so enaki tudi odseki na $AB$.

:::risba skica
opis: Daljica AB dolga 10 enot leži vodoravno. Iz A gre poševno navzgor poltrak s točkami P1 do P5 v enakih razmikih. P5 je povezana z B. Vzporednice k P5B skozi P1, P2, P3 in P4 sekajo AB pri 2, 4, 6 in 8 enotah. Vzporednica skozi P2 zadene AB v točki T pri 4 enotah, zato je AT : TB = 2 : 3.
območje: -0,5; -1 .. 10,5; 7
črta: 0; 0 -> 10; 0 | debelo
črta: 0; 0 -> 9; 6,75
črta: 8; 6 -> 10; 0 | modra debelo
črta: 1,6; 1,2 -> 2; 0 | siva črtkano
črta: 3,2; 2,4 -> 4; 0 | oranžna debelo
črta: 4,8; 3,6 -> 6; 0 | siva črtkano
črta: 6,4; 4,8 -> 8; 0 | siva črtkano
točka: 0; 0 | A | pod
točka: 10; 0 | B | pod
točka: 4; 0 | T | pod
točka: 1,6; 1,2 | P_1 | levo
točka: 3,2; 2,4 | P_2 | levo
točka: 4,8; 3,6 | P_3 | levo
točka: 6,4; 4,8 | P_4 | levo
točka: 8; 6 | P_5 | levo
podnapis: Pet enakih odsekov na poltraku da pet enakih delov na AB
:::

*Preizkus:* Na koliko delov razdeliš $AB$, če na poltrak naneseš $7$ odsekov? *(Na $7$ enakih delov.)*

**7. Deljenje v razmerju $m : n$.** Na poltrak nanesi $m + n$ enakih odsekov, zadnjo točko poveži z $B$ in nariši eno samo vzporednico, skozi $P_m$. Ta seka $AB$ v točki $T$, za katero velja $AT : TB = m : n$. Na sliki je $m = 2$ in $n = 3$: vzporednica skozi $P_2$ da točko $T$.

:::premisli
Sošolec za razmerje $2 : 3$ nanese na poltrak samo $3$ odseke. Kaj je naredil narobe?
---
Ker je $2 : 3$ razmerje med deloma, ne med delom in celoto. $AT$ ima $2$ dela, $TB$ ima $3$ dele, cela daljica $AB$ pa $2 + 3 = 5$ delov. S $3$ odseki bi dobil razmerje $1 : 2$ ali $2 : 1$.
:::

## Rešeni primeri

### Primer 1 (lažji): cel odsek

Daljici $AB$ in $CD$ sta vzporedni, $A$ in $C$ ležita na enem kraku kota z vrhom $S$, $B$ in $D$ na drugem. Znano je $SA = 3\,\text{cm}$, $SC = 9\,\text{cm}$ in $SB = 4\,\text{cm}$. Izračunaj $SD$.

**Podatki:** $SA = 3\,\text{cm}$, $SC = 9\,\text{cm}$, $SB = 4\,\text{cm}$, $AB \parallel CD$
**Iščemo:** dolžino $SD$

:::formula
$SA : SC = SB : SD$ (Talesov izrek, cela odseka od vrha)
:::

**Rešitev:**

1. Vstavimo podatke, ker poznamo oba odseka na prvem kraku: $3 : 9 = 4 : SD$.
2. Zmnožek zunanjih členov je enak zmnožku notranjih: $3 \cdot SD = 9 \cdot 4 = 36$.
3. Delimo s $3$: $SD = 36 : 3 = 12\,\text{cm}$.
4. Preizkus: $3 : 9 = \dfrac{1}{3}$ in $4 : 12 = \dfrac{1}{3}$.

Daljica $SD$ meri $12\,\text{cm}$.

### Primer 2: deljenje daljice v razmerju

Daljico $AB$ dolžine $10\,\text{cm}$ razdeli s točko $T$ v razmerju $AT : TB = 2 : 3$. Opiši konstrukcijo in izračunaj $AT$ in $TB$.

**Podatki:** $AB = 10\,\text{cm}$, $AT : TB = 2 : 3$
**Iščemo:** konstrukcijo točke $T$ ter dolžini $AT$ in $TB$

:::formula
Na poltrak nanesemo $m + n$ enakih odsekov. En del: $d = \dfrac{AB}{m + n}$, nato $AT = m \cdot d$ in $TB = n \cdot d$.
:::

**Rešitev:**

1. Konstrukcija: iz $A$ nariši poltrak in nanj nanesi $2 + 3 = 5$ enakih odsekov. Poveži $P_5$ z $B$ in skozi $P_2$ nariši vzporednico k $P_5B$. Kjer seka $AB$, je $T$ (slika v razlagi).
2. Zakaj deluje: $P_2T \parallel P_5B$, zato je $AT : TB = AP_2 : P_2P_5 = 2 : 3$.
3. En del meri $d = 10 : 5 = 2\,\text{cm}$, ker ima cela daljica $5$ delov.
4. $AT = 2 \cdot 2 = 4\,\text{cm}$ in $TB = 3 \cdot 2 = 6\,\text{cm}$.
5. Preizkus: $4 + 6 = 10$ in $4 : 6 = 2 : 3$.

Točka $T$ je $4\,\text{cm}$ od $A$ in $6\,\text{cm}$ od $B$.

### Primer 3 (težji): kdaj Luna pokrije Sonce

Ob popolnem Sončevem mrku Luna ravno pokrije Sonce. Premer Lune je $3\,474\,\text{km}$, premer Sonca $1\,392\,000\,\text{km}$, Sonce je od nas oddaljeno $149\,600\,000\,\text{km}$. Kako daleč mora biti Luna, da Sonce ravno pokrije? Luna je od nas oddaljena med približno $357\,000\,\text{km}$ in $407\,000\,\text{km}$. Kaj to pomeni za mrke?

**Podatki:** premer Lune $AB = 3\,474\,\text{km}$, premer Sonca $CD = 1\,392\,000\,\text{km}$, razdalja do Sonca $SC = 149\,600\,000\,\text{km}$, razdalja do Lune med $357\,000\,\text{km}$ in $407\,000\,\text{km}$
**Iščemo:** razdaljo do Lune $SA$, pri kateri Luna ravno pokrije Sonce

:::formula
$SA : SC = AB : CD$ (vzporednici in cela odseka od vrha)
:::

**Rešitev:**

1. Vrh $S$ je oko opazovalca. Žarka do robov Sonca sta kraka kota. Premera Lune in Sonca sta vzporedni daljici med krakoma, ker sta oba pravokotna na smer pogleda.
2. Vstavimo: $SA : 149\,600\,000 = 3\,474 : 1\,392\,000$.
3. Izrazimo $SA$: $SA = 149\,600\,000 \cdot 3\,474 : 1\,392\,000$.
4. Izračunamo: $SA \approx 373\,355\,\text{km}$, torej približno $373\,000\,\text{km}$.
5. Primerjamo: $373\,000\,\text{km}$ leži med $357\,000\,\text{km}$ in $407\,000\,\text{km}$. Ko je Luna bližje, je videti večja od Sonca in ga pokrije v celoti. Ko je dlje, ga ne pokrije in okoli nje ostane svetel obroč.

Luna mora biti oddaljena približno $373\,000\,\text{km}$. Zato je Sončev mrk včasih popoln, včasih pa kolobarjast (okoli Lune ostane svetel kolobar).

### Primer 4 – zdaj ti

Daljici $AB$ in $CD$ sta vzporedni. Znano je $SA = 6\,\text{cm}$, $AC = 4\,\text{cm}$ in $SB = 9\,\text{cm}$. Izračunaj $BD$.

**Podatki:** $SA = 6\,\text{cm}$, $AC = 4\,\text{cm}$, $SB = 9\,\text{cm}$, $AB \parallel CD$
**Iščemo:** dolžino $BD$

:::formula
$SA : AC = SB : BD$ (odseka med vzporednicama)
:::

**Rešitev:**

1. Podan je odsek med vzporednicama $AC$, iščemo odsek med vzporednicama $BD$, zato vzamemo drugo sorazmerje: $6 : 4 = 9 : BD$.
2. Zmnožek zunanjih členov je enak zmnožku notranjih: $6 \cdot BD = 4 \cdot 9$.
3. Izračunaj $BD$ in naredi preizkus.

:::premisli
Koliko meri $BD$?
---
$6 \cdot BD = 36$, zato $BD = 36 : 6 = 6\,\text{cm}$. Preizkus: $6 : 4 = 1{,}5$ in $9 : 6 = 1{,}5$.
:::

## Pogoste napake

- **Cel odsek namesto dela (ali obratno).** »$SA = 6$, $AC = 4$, torej $6 : 4 = 9 : SD$.« Napaka: na prvem kraku je del med vzporednicama, na drugem pa cel odsek od vrha. Na obeh krakih vzemi isto vrsto odseka: $SA : AC = SB : BD$ ali $SA : SC = SB : SD$. Pri vzporednicah $AB$ in $CD$ vedno vzemi cel odsek: $SA : SC = AB : CD$.
- **Razlika namesto razmerja.** »$SC$ je za $6\,\text{cm}$ daljši od $SA$, zato je tudi $SD$ za $6\,\text{cm}$ daljši od $SB$.« Napačno, ker izrek govori o tem, *kolikokrat* je odsek daljši, ne *za koliko*. Pri $SA = 2$, $SC = 8$ je $SC$ štirikrat daljši, zato je tudi $SD = 4 \cdot SB$.
- **Obrnjeno sorazmerje.** Napačno: $SA : SC = SD : SB$. Na levi je krajši odsek prvi, na desni pa daljši. Levo razmerje je zato manjše od $1$, desno večje od $1$, in ne moreta biti enaki. Na obeh straneh zapiši odseke v istem vrstnem redu: najprej bližje vrhu, nato dlje.
- **Deljenje v razmerju $m : n$ na $m$ ali $n$ delov.** Za $AT : TB = 2 : 3$ na poltrak nanesemo $2 + 3 = 5$ odsekov, en del pa je $AB : 5$, ne $AB : 3$.
- **Različne enote.** Krožec v milimetrih in razdalja v metrih: kdor ne pretvori, dobi rezultat, ki je za faktor $1\,000$ napačen. Pred računanjem vse dolžine istega razmerja zapiši v isti enoti.

## Povzetek

- Če $AB \parallel CD$ ($A, C$ na enem kraku kota z vrhom $S$, $B, D$ na drugem), velja $SA : SC = SB : SD$ in $SA : AC = SB : BD$.
- Za vzporednici sami velja $SA : SC = AB : CD$, vedno s celima odsekoma od vrha (podobna trikotnika $SAB$ in $SCD$).
- Obrat: če je $SA : SC = SB : SD$, sta $AB$ in $CD$ vzporedni.
- Daljico razdelimo na $n$ enakih delov s pomožnim poltrakom z $n$ enakimi odseki in vzporednicami; za razmerje $m : n$ nanesemo $m + n$ odsekov in vzporednico narišemo skozi $P_m$.
- Uporaba: razdalje in velikosti, ki jih ne moremo izmeriti (Luna, Sonce, višina iz sence).

## Drugače: Na sliki

Predstavljaj si, da je kot lijak z vrhom $S$. Vsaka vzporednica, ki ga prereže, odreže trikotnik z vrhom $S$, in vsi ti trikotniki so povečane kopije istega trikotnika. Ko se od vrha oddaljiš $2{,}5$-krat dlje, se $2{,}5$-krat podaljšajo **vse** dolžine: odsek na drugem kraku in prečna daljica.

Pri Luni je lijak ogromen. Od očesa do krožca je $55\,\text{cm}$, do Lune pa skoraj $700\,000\,000$-krat dlje. Zato je Luna skoraj $700\,000\,000$-krat večja od krožca. Pri deljenju daljice pa vzporednice delujejo kot tračnice, ki enake odseke s poltraka prenesejo na $AB$.

## Drugače: Bolj natančno

Dokaz, da iz $AB \parallel CD$ sledi $SA : SC = SB : SD$. Uporabimo ploščine trikotnikov; $p(XYZ)$ pomeni ploščino trikotnika $XYZ$.

1. Trikotnika $ACD$ in $BCD$ imata skupno osnovnico $CD$. Ker je $AB \parallel CD$, sta $A$ in $B$ enako oddaljeni od $CD$, zato imata enaki višini in $p(ACD) = p(BCD)$.
2. Daljica $AD$ razdeli trikotnik $SCD$ na $SAD$ in $ACD$, daljica $BC$ pa na $SBC$ in $BCD$. Zato je $p(SAD) = p(SCD) - p(ACD) = p(SCD) - p(BCD) = p(SBC)$.
3. Trikotnika $SAB$ in $SAD$ imata skupno oglišče $A$, osnovnici $SB$ in $SD$ pa ležita na isti premici. Višina iz $A$ je skupna, zato je razmerje ploščin enako razmerju osnovnic: $p(SAB) : p(SAD) = SB : SD$.
4. Enako imata $SAB$ in $SBC$ skupno oglišče $B$ in osnovnici $SA$, $SC$ na isti premici: $p(SAB) : p(SBC) = SA : SC$.
5. Ker je $p(SAD) = p(SBC)$, sta leva strani v korakih 3 in 4 enaki. Zato je $SB : SD = SA : SC$.

Drugo sorazmerje sledi iz prvega. Če je $SC = k \cdot SA$ in $SD = k \cdot SB$, je $AC = (k - 1) \cdot SA$ in $BD = (k - 1) \cdot SB$, torej $SA : AC = SB : BD$.

Obrat velja v obliki $SA : SC = SB : SD$, iz enakosti $SA : SC = AB : CD$ pa vzporednosti ne smemo sklepati. Krožnica s središčem $A$ in polmerom $AB$ lahko seka drugi krak v dveh točkah. Obe daljici iz $A$ imata pravo dolžino, vzporedna s $CD$ pa je le ena.

## Preveri se

? Daljici $AB$ in $CD$ sta vzporedni. Katera četverica meritev (v cm) je lahko pravilna?
- $SA = 2$, $SC = 6$, $SB = 3$, $SD = 7$
~ Tu sta odseka na obeh krakih podaljšana *za* isto dolžino ($4$), ne *enakokrat*. Izrek zahteva enako razmerje.
+ $SA = 2$, $SC = 6$, $SB = 3$, $SD = 9$
- $SA = 2$, $SC = 6$, $SB = 9$, $SD = 3$
~ Na drugem kraku je odsek bližje vrhu daljši od tistega dlje od vrha. To je obrnjeno sorazmerje.
- $SA = 2$, $SC = 6$, $SB = 3$, $SD = 6$
~ $SD = 6$ bi bil odsek $BD$ iz sorazmerja $SA : AC = 2 : 4 = 3 : 6$. Cel odsek je $SD = 3 + 6 = 9$.
> $SC$ je trikrat daljši od $SA$, zato mora biti $SD$ trikrat daljši od $SB$: $SD = 3 \cdot 3 = 9$.

? Kovanec s premerom $2\,\text{cm}$ na razdalji $2{,}2\,\text{m}$ od očesa ravno pokrije Luno, ki je oddaljena $384\,000\,\text{km}$. Koliko je približno premer Lune?
- $350\,000\,\text{km}$
~ To dobiš, če centimetre in metre deliš brez pretvorbe ($2 : 2{,}2$). Najprej pretvori: $2{,}2\,\text{m} = 220\,\text{cm}$.
- $350\,\text{km}$
~ To dobiš, če $2{,}2\,\text{m}$ pretvoriš v $2\,200\,\text{cm}$. Pravilno je $2{,}2\,\text{m} = 220\,\text{cm}$.
+ $3\,500\,\text{km}$
- $42\,000\,000\,\text{km}$
~ To je obrnjeno sorazmerje ($220 : 2$ namesto $2 : 220$). Luna ne more biti večja od svoje razdalje do nas.
> $2 : 220 = CD : 384\,000\,\text{km}$, zato $CD = 384\,000 \cdot 2 : 220 \approx 3\,491\,\text{km}$, torej približno $3\,500\,\text{km}$.

? Daljico $AB$ želiš razdeliti v razmerju $3 : 4$. Zakaj na pomožni poltrak naneseš $7$ enakih odsekov?
- Ker je $7$ največje od števil $3$, $4$ in $7$.
~ Število odsekov ni izbrano po velikosti, ampak je število vseh delov.
- Ker mora biti odsekov vedno liho mnogo.
~ Za razmerje $1 : 1$ naneseš $2$ odseka. Število odsekov je vsota členov razmerja, ne glede na sodost.
+ Ker ima $AT$ $3$ dele, $TB$ $4$ dele, cela daljica pa $3 + 4 = 7$ delov.
- Ker mora biti vsak odsek dolg $7\,\text{mm}$.
~ Dolžina odsekov na poltraku je poljubna, pomembno je le, da so enaki.
> Razmerje $3 : 4$ primerja dva dela, skupaj sta $7$ delov. Vzporednica skozi $P_3$ razdeli $AB$ v razmerju $3 : 4$.

? Točka $T$ deli daljico $AB$ v razmerju $AT : TB = 1 : 3$ in $AT = 3\,\text{cm}$. Kako dolga je $AB$?
- $9\,\text{cm}$
~ $9\,\text{cm}$ je samo $TB$. Celo daljico dobiš, ko prišteješ še $AT$.
+ $12\,\text{cm}$
- $4\,\text{cm}$
~ $4$ je število vseh delov, ne dolžina. En del meri $3\,\text{cm}$.
- $6\,\text{cm}$
~ Podvojitev $AT$ bi ustrezala razmerju $1 : 1$, ne $1 : 3$.
> En del meri $AT = 3\,\text{cm}$. Delov je $1 + 3 = 4$, zato $AB = 4 \cdot 3 = 12\,\text{cm}$.

? Pri vesoljskem centru navpična palica, visoka $1{,}2\,\text{m}$, meče senco dolžine $1{,}8\,\text{m}$. Senca izstrelitvenega stolpa je v istem trenutku dolga $60\,\text{m}$. Kako visok je stolp? (Sončni žarki so vzporedni.)
- $90\,\text{m}$
~ To je obrnjeno razmerje ($1{,}8 : 1{,}2$). Palica je nižja od svoje sence, zato mora biti tudi stolp nižji od svoje sence.
- $59{,}4\,\text{m}$
~ Tu je stolp *za* $0{,}6\,\text{m}$ nižji od svoje sence, tako kot palica. Izrek zahteva enako razmerje, ne enako razliko.
+ $40\,\text{m}$
> Sončni žarki so vzporedni, zato je razmerje med višino in senco pri palici in stolpu enako: $1{,}2 : 1{,}8 = h : 60$. Od tod $h = 60 \cdot 1{,}2 : 1{,}8 = 40\,\text{m}$.

:::simboli
S | vrh kota (pri Luni oko opazovalca) | | |
A, C | točki na prvem kraku | | | $A$ je bližje vrhu
B, D | točki na drugem kraku | | | $B$ je bližje vrhu; $AB \parallel CD$
T | delilna točka daljice $AB$ | | | $AT : TB = m : n$
P_2, P_5 | točki na pomožnem poltraku | | | $P_k$ je $k$-ta nanesena točka
m, n | člena razmerja $AT : TB$ | | – |
d | dolžina enega dela | d = \frac{AB}{m + n} | cm |
:::
