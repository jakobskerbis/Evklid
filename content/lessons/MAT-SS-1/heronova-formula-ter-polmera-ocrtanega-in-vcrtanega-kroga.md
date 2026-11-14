---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Maja pripravlja orientacijski pohod. Na zemljevidu je označila tri kontrolne točke in s sledilnikom izmerila razdalje med njimi: $5\,\text{km}$, $5\,\text{km}$ in $6\,\text{km}$. Reševalci jo vprašajo dvoje: kolikšna je ploščina območja med točkami in kako daleč mora seči radijski oddajnik, ki ga postavijo enako daleč od vseh treh točk.

Višine trikotnika Maja nima, kotov tudi ne. Ima samo tri stranice. Ali to zadošča? Zadošča: iz treh stranic dobiš ploščino trikotnika ter oba polmera, včrtane in očrtane krožnice.

## Razlaga

**1. Mamljiva bližnjica.** Maja najprej pomisli: »Ploščina je polovica produkta dveh stranic.« Izračuna $\dfrac{5 \cdot 5}{2} = 12{,}5$ in zapiše $12{,}5\,\text{km}^2$.

Preverimo. Trikotnik je enakokrak z osnovnico $6$, zato višina na osnovnico razpolovi osnovnico. Po Pitagorovem izreku je višina $v = \sqrt{5^2 - 3^2} = \sqrt{16} = 4$, ploščina pa $\dfrac{6 \cdot 4}{2} = 12$. Bližnjica se je zmotila. Formula $S = \dfrac{ab}{2}$ velja le, kadar sta $a$ in $b$ kateti, torej med njima leži pravi kot. Pri splošnem trikotniku potrebujemo višino, ki je pogosto ne poznamo.

**2. Heronova formula.** Ploščino trikotnika s stranicami $a$, $b$, $c$ dobimo brez višine. Najprej izračunamo polobseg $s$, to je polovico obsega:

$$s = \frac{a + b + c}{2}$$

Nato ploščino dobimo s korenom:

$$S = \sqrt{s(s - a)(s - b)(s - c)}$$

Pri Majinem trikotniku: $s = \dfrac{5 + 5 + 6}{2} = 8$, faktorji pod korenom so $8$, $3$, $3$ in $2$, zato $S = \sqrt{8 \cdot 3 \cdot 3 \cdot 2} = \sqrt{144} = 12$. Enako kot z višino, le da višine nismo potrebovali. Območje meri $12\,\text{km}^2$.

:::premisli
Nekdo vstavi stranice $2$, $3$ in $6$. Napovej, kaj se zgodi v formuli, in povej, zakaj.
---
$s = 5{,}5$ in $s - c = -0{,}5$, zato je pod korenom negativno število in ploščine ni. Tak trikotnik ne obstaja: $2 + 3 < 6$, kršena je trikotniška neenakost. Heronova formula to »opazi« sama.
:::

**3. Polmer včrtane krožnice.** Iz lekcije o trikotniku veš, da je središče $I$ včrtane krožnice od vseh treh stranic oddaljeno za $r$. Če $I$ povežemo z oglišči, trikotnik razpade na tri trikotnike z osnovnicami $a$, $b$, $c$ in skupno višino $r$:

:::risba skica
opis: Pravokotni trikotnik z oglišči C v izhodišču, A štiri enote desno in B tri enote navzgor. Stranice so a = 3, b = 4, c = 5. V njem je včrtana krožnica s središčem I v točki (1, 1) in polmerom 1. Črtkane daljice povezujejo I z oglišči, polni polmeri r so pravokotni na vse tri stranice.
območje: -0,8; -0,8 .. 4,8; 3,6
enota: 55
lik: 0; 0 -> 4; 0 -> 0; 3 | modra
krog: 1; 1 | 1 | zelena
črta: 1; 1 -> 0; 0 | siva črtkano
črta: 1; 1 -> 4; 0 | siva črtkano
črta: 1; 1 -> 0; 3 | siva črtkano
črta: 1; 1 -> 1; 0 | oranžna debelo
črta: 1; 1 -> 0; 1 | oranžna debelo
črta: 1; 1 -> 1,6; 1,8 | oranžna debelo
točka: 1; 1 | I | nad levo
točka: 0; 0 | C | pod levo
točka: 4; 0 | A | pod desno
točka: 0; 3 | B | nad levo
napis: 2,5; 0 | b = 4 | pod
napis: 0; 2 | a = 3 | levo
napis: 2,2; 1,4 | c = 5 | nad desno
napis: 1,1; 0,5 | r | desno | oranžna
:::

Seštejemo ploščine treh delov: $S = \dfrac{ar}{2} + \dfrac{br}{2} + \dfrac{cr}{2} = r \cdot \dfrac{a + b + c}{2} = r \cdot s$, zato

$$r = \frac{S}{s}$$

**4. Polmer očrtane krožnice.** Očrtana krožnica gre skozi vsa tri oglišča, njeno središče $O$ je presečišče simetral stranic. Njen polmer je

$$R = \frac{abc}{4S}$$

Dokaz potrebuje sinusni izrek, ki ga spoznaš v 3. letniku. Formulo zdaj uporabljamo in jo preverimo na znanem primeru.

Zdaj lahko odgovorimo še na drugo vprašanje reševalcev. Oddajnik, enako oddaljen od vseh treh točk, stoji v središču očrtane krožnice: $R = \dfrac{5 \cdot 5 \cdot 6}{4 \cdot 12} = \dfrac{150}{48} = 3{,}125$. Seči mora vsaj $3{,}125\,\text{km}$ (približno $3{,}1\,\text{km}$).

**5. Preizkus na trikotniku $3$, $4$, $5$.** Trikotnik na risbi je pravokoten. Polobseg je $s = 6$, Heron da $S = \sqrt{6 \cdot 3 \cdot 2 \cdot 1} = \sqrt{36} = 6$, kar se ujema s $\dfrac{3 \cdot 4}{2} = 6$. Dalje $r = \dfrac{6}{6} = 1$ (središče $I$ je res v $(1, 1)$) in $R = \dfrac{3 \cdot 4 \cdot 5}{4 \cdot 6} = 2{,}5$. To je ravno $\dfrac{c}{2}$: po Talesovem izreku je hipotenuza premer očrtane krožnice. Formuli se ujemata z vsem, kar že veš.

:::premisli
Ali je lahko $R$ manjši od polovice najdaljše stranice? Zakaj?
---
Ne more. Vsaka stranica je tetiva očrtane krožnice, tetiva pa ni nikoli daljša od premera $2R$. Zato je $R \ge \dfrac{c}{2}$ za najdaljšo stranico $c$; enakost velja le, ko je $c$ premer, torej pri pravokotnem trikotniku.
:::

## Rešeni primeri

### Primer 1 (lažji): območje na zemljevidu

Tri vasi so med seboj oddaljene $11\,\text{km}$, $13\,\text{km}$ in $20\,\text{km}$ (zračna razdalja). Kolikšna je ploščina trikotnika, ki ga omejujejo?

**Podatki:** $a = 11\,\text{km}$, $b = 13\,\text{km}$, $c = 20\,\text{km}$
**Iščemo:** ploščino $S$

:::formula
$s = \dfrac{a + b + c}{2}$, $\;S = \sqrt{s(s - a)(s - b)(s - c)}$
:::

**Rešitev:**

1. Polobseg: $s = \dfrac{11 + 13 + 20}{2} = 22\,\text{km}$.
2. Razlike: $s - a = 11$, $s - b = 9$, $s - c = 2$ (vse pozitivne, trikotnik obstaja).
3. $S = \sqrt{22 \cdot 11 \cdot 9 \cdot 2} = \sqrt{4356} = 66$.
4. Odgovor: trikotnik meri $66\,\text{km}^2$.

### Primer 2: domet oddajnika

Planinske koče $A$, $B$, $C$ so med seboj oddaljene $a = 10\,\text{km}$, $b = 17\,\text{km}$ in $c = 21\,\text{km}$. Oddajnik naj bo enako daleč od vseh treh koč. Kolikšen mora biti njegov domet? Kolikšen je polmer največjega krožnega območja, ki še leži v trikotniku?

**Podatki:** $a = 10\,\text{km}$, $b = 17\,\text{km}$, $c = 21\,\text{km}$
**Iščemo:** polmer $R$ očrtane in polmer $r$ včrtane krožnice

:::formula
$S = \sqrt{s(s - a)(s - b)(s - c)}$, $\;r = \dfrac{S}{s}$, $\;R = \dfrac{abc}{4S}$
:::

**Rešitev:**

1. $s = \dfrac{10 + 17 + 21}{2} = 24\,\text{km}$.
2. $S = \sqrt{24 \cdot 14 \cdot 7 \cdot 3} = \sqrt{7056} = 84$, torej $84\,\text{km}^2$.
3. Točka, enako oddaljena od vseh oglišč, je središče očrtane krožnice: $R = \dfrac{10 \cdot 17 \cdot 21}{4 \cdot 84} = \dfrac{3570}{336} = 10{,}625$. Ker je $21^2 = 441 > 10^2 + 17^2 = 389$, je trikotnik topokoten in oddajnik stoji zunaj trikotnika koč.
4. Največji krog v trikotniku je včrtani: $r = \dfrac{84}{24} = 3{,}5$.
5. Odgovor: oddajnik mora seči vsaj $10{,}625\,\text{km}$ (približno $10{,}6\,\text{km}$); največje krožno območje ima polmer $3{,}5\,\text{km}$.

### Primer 3 (težji): parcela z načrta

Na katastrskem načrtu v merilu $1 : 1000$ ima trikotna parcela stranice $9\,\text{cm}$, $10\,\text{cm}$ in $17\,\text{cm}$. Kolikšna je njena ploščina v naravi (v $\text{m}^2$ in v hektarih)? Kolikšen je lahko največji polmer okrogle gredice na njej?

**Podatki:** merilo $1 : 1000$, stranice na načrtu $9\,\text{cm}$, $10\,\text{cm}$, $17\,\text{cm}$; $1\,\text{ha} = 10\,000\,\text{m}^2$
**Iščemo:** ploščino $S$ v naravi in polmer $r$ včrtane krožnice

:::formula
Dolžine v naravi so $1000$-krat večje. Nato $S = \sqrt{s(s - a)(s - b)(s - c)}$ in $r = \dfrac{S}{s}$.
:::

**Rešitev:**

1. Dolžine v naravi: $1\,\text{cm}$ na načrtu je $1000\,\text{cm} = 10\,\text{m}$, zato $a = 90\,\text{m}$, $b = 100\,\text{m}$, $c = 170\,\text{m}$.
2. $s = \dfrac{90 + 100 + 170}{2} = 180\,\text{m}$; razlike so $90$, $80$ in $10$.
3. $S = \sqrt{180 \cdot 90 \cdot 80 \cdot 10} = \sqrt{12960000} = 3600$, torej $3600\,\text{m}^2 = 0{,}36\,\text{ha}$.
4. Kontrola po drugi poti: na načrtu je $s = 18$ in $S = \sqrt{18 \cdot 9 \cdot 8 \cdot 1} = 36\,\text{cm}^2$. Vsak $\text{cm}^2$ načrta je $10\,\text{m} \cdot 10\,\text{m} = 100\,\text{m}^2$, torej $3600\,\text{m}^2$. Ujema se.
5. Gredica: $r = \dfrac{3600}{180} = 20$, torej $20\,\text{m}$.
6. Odgovor: parcela meri $3600\,\text{m}^2$ ($0{,}36\,\text{ha}$); okrogla gredica ima lahko polmer največ $20\,\text{m}$.

### Primer 4 – zdaj ti

Turistična pot povezuje tri razglednike, med seboj oddaljene $5\,\text{km}$, $12\,\text{km}$ in $13\,\text{km}$. Izračunaj polmera $r$ in $R$.

**Podatki:** $a = 5\,\text{km}$, $b = 12\,\text{km}$, $c = 13\,\text{km}$
**Iščemo:** $r$ in $R$

:::formula
$r = \dfrac{S}{s}$, $\;R = \dfrac{abc}{4S}$
:::

**Rešitev:**

1. $s = \dfrac{5 + 12 + 13}{2} = 15$.
2. $S = \sqrt{15 \cdot 10 \cdot 3 \cdot 2} = \sqrt{900} = 30$, torej $30\,\text{km}^2$.
3. Izračunaj $r$ in $R$ sam, nato preveri:

:::premisli
Koliko sta $r$ in $R$? Kaj opaziš pri $R$?
---
$r = \dfrac{30}{15} = 2\,\text{km}$ in $R = \dfrac{5 \cdot 12 \cdot 13}{4 \cdot 30} = 6{,}5\,\text{km}$. Velja $R = \dfrac{13}{2}$: ker je $5^2 + 12^2 = 13^2$, je trikotnik pravokoten in hipotenuza je premer očrtane krožnice.
:::

## Pogoste napake

**Polovica produkta dveh stranic.** $S = \dfrac{ab}{2}$ velja samo za kateti pravokotnega trikotnika. Pri trikotniku $5$, $5$, $6$ da $12{,}5$ namesto $12$. Če ne veš, ali je med stranicama pravi kot, uporabi Heronovo formulo.

**Obseg namesto polobsega.** Kdor v formulo vstavi $o = a + b + c$, dobi pri trikotniku $3$, $4$, $5$ napačno $\sqrt{12 \cdot 9 \cdot 8 \cdot 7} \approx 77{,}8$ namesto $6$. V formuli je vedno $s = \dfrac{o}{2}$. Enako pri $r$: $\dfrac{S}{o}$ je napačno in da polovico pravega polmera.

**Pozabljen koren.** Produkt $s(s - a)(s - b)(s - c)$ je $S^2$, ne $S$. Pri $5$, $5$, $6$ je produkt $144$, ploščina pa $12$.

**Zamenjana polmera.** $r = \dfrac{S}{s}$ je za včrtano (dotika se stranic), $R = \dfrac{abc}{4S}$ za očrtano krožnico (gre skozi oglišča). Pomaga razmislek: $R$ je vedno večji od $r$.

**Merilo pri ploščini.** Pri merilu $1 : 1000$ je ploščina v naravi $1000^2$-krat večja, ne $1000$-krat. Najvarneje je najprej pretvoriti dolžine.

## Povzetek

- Polobseg: $s = \dfrac{a + b + c}{2}$.
- Heronova formula: $S = \sqrt{s(s - a)(s - b)(s - c)}$; ploščina iz treh stranic brez višine in kotov.
- Polmer včrtane krožnice: $r = \dfrac{S}{s}$ (trikotnik razrežemo na tri trikotnike z višino $r$).
- Polmer očrtane krožnice: $R = \dfrac{abc}{4S}$ (dokaz s sinusnim izrekom v 3. letniku).
- Preizkus s $3$, $4$, $5$: $S = 6$, $r = 1$, $R = 2{,}5 = \dfrac{c}{2}$.
- Pri merilu najprej pretvori dolžine; ploščina se poveča s kvadratom merila.

## Drugače: Kot zgodba

V starem Egiptu je Nil vsako leto poplavil polja in izbrisal meje. Merilci so jih znova zakoličili z vrvmi. Dolžino vrvi med dvema količkoma je bilo lahko izmeriti, višino trikotne njive pa ne: treba bi bilo poiskati pravi kot sredi blatnega polja.

Heron iz Aleksandrije je v 1. stoletju v knjigi *Metrika* zapisal pravilo, ki potrebuje samo tri izmerjene vrvi. Merilec sešteje dolžine, vzame polovico, od nje odšteje vsako stranico, vse štiri številke zmnoži in izračuna koren. Tako kot Maja na svojem pohodu: tri razdalje, en koren, ena ploščina.

## Drugače: Korak za korakom s številkami

Vse tri formule za trikotnik $a = 13$, $b = 14$, $c = 15$:

| korak | račun | rezultat |
|---|---|---|
| polobseg | $\frac{13 + 14 + 15}{2}$ | $s = 21$ |
| razlike | $21 - 13$, $21 - 14$, $21 - 15$ | $8$, $7$, $6$ |
| ploščina | $\sqrt{21 \cdot 8 \cdot 7 \cdot 6}$ | $S = 84$ |
| včrtana | $\frac{84}{21}$ | $r = 4$ |
| očrtana | $\frac{13 \cdot 14 \cdot 15}{4 \cdot 84}$ | $R = 8{,}125$ |

Kontrola z višino: višina $12$ na stranico $14$ jo razdeli na $5$ in $9$, saj sta $5$, $12$, $13$ in $9$, $12$, $15$ pravokotna trikotnika. Ploščina je $\dfrac{14 \cdot 12}{2} = 84$. Ujema se.

## Preveri se

? Katera formula ne spada med ostale, ker ne da ploščine poljubnega trikotnika?
- $S = \sqrt{s(s - a)(s - b)(s - c)}$
~ To je Heronova formula; velja za vsak trikotnik.
- $S = r \cdot s$
~ Velja za vsak trikotnik: razrez na tri trikotnike z višino $r$.
- $S = \dfrac{c \cdot v_c}{2}$
~ Osnovnica krat pripadajoča višina, deljeno z $2$, velja vedno.
+ $S = \dfrac{ab}{2}$
> $\dfrac{ab}{2}$ velja le, če sta $a$ in $b$ kateti pravokotnega trikotnika.

? Vse tri stranice trikotnika podvojimo. Kolikokrat se poveča ploščina?
= 4
~ 2 | Podvojijo se dolžine, ploščina pa raste s kvadratom: $2^2 = 4$.
~ 16 | Pod korenom se res pojavi faktor $16$, a ploščina je koren tega: $\sqrt{16} = 4$.
~ 8 | Faktor $8$ velja za prostornino teles, ne za ploščino.
> Polobseg in vse razlike se podvojijo, zato je pod korenom $2^4 = 16$-krat več in ploščina $\sqrt{16} = 4$-krat večja.

? Dijak računa $r$ za trikotnik $7$, $15$, $20$. Kateri korak je napačen? Korak 1: $o = 42$. Korak 2: $S = \sqrt{21 \cdot 14 \cdot 6 \cdot 1} = \sqrt{1764} = 42$. Korak 3: $r = \dfrac{S}{o} = 1$. Korak 4: »Polmer včrtane krožnice je $1$.«
- Korak 1
~ Obseg $7 + 15 + 20 = 42$ je pravilen; napaka je v tem, kje ga uporabi.
- Korak 2
~ V koraku 2 je pravilno uporabljen polobseg $21$; $S = 42$ drži.
+ Korak 3
- Napake ni.
~ Napaka je: $r = \dfrac{S}{o}$ ni prava formula, rezultat je za polovico premajhen.
> V formuli je polobseg: $r = \dfrac{S}{s} = \dfrac{42}{21} = 2$. Korak 4 je napačen le zato, ker prevzame napako iz koraka 3.

? (brez računala) Z risbe odčitaj stranice in izračunaj polmer $R$ očrtane krožnice (v cm).
:::risba skica
opis: Enakokraki trikotnik z osnovnico 12 cm in krakoma po 10 cm. Oglišča so A(0, 0), B(12, 0) in C(6, 8).
območje: -1; -1,5 .. 13; 9
enota: 22
lik: 0; 0 -> 12; 0 -> 6; 8 | modra
točka: 0; 0 | A | pod levo
točka: 12; 0 | B | pod desno
točka: 6; 8 | C | nad
napis: 6; 0 | 12 cm | pod
napis: 3; 4 | 10 cm | levo
napis: 9; 4 | 10 cm | desno
:::
= 6,25 cm | 0,01
~ 3 | To je polmer včrtane krožnice $r = \dfrac{S}{s}$.
~ 6 | To je polovica najdaljše stranice; $R = \dfrac{c}{2}$ velja le za pravokotni trikotnik.
~ 12,5 | V imenovalcu je $4S$, ne $2S$.
> $s = 16$, $S = \sqrt{16 \cdot 6 \cdot 6 \cdot 4} = 48$, $R = \dfrac{10 \cdot 10 \cdot 12}{4 \cdot 48} = \dfrac{1200}{192} = 6{,}25\,\text{cm}$.

? Razvrsti korake za izračun polmera očrtane krožnice iz treh stranic.
1. Seštej stranice in vsoto razpolovi: $s$.
2. Izračunaj $s - a$, $s - b$ in $s - c$.
3. Zmnoži $s(s - a)(s - b)(s - c)$ in koreni: $S$.
4. Izračunaj $R = \dfrac{abc}{4S}$.
> Brez polobsega ni razlik, brez razlik ni ploščine, brez ploščine ni $R$.

:::simboli
a, b, c | stranice trikotnika | | | $a$ leži nasproti oglišča $A$
s | polobseg | s = \frac{a + b + c}{2} |
S | ploščina trikotnika | S = \sqrt{s(s - a)(s - b)(s - c)} |
r | polmer včrtane krožnice | r = \frac{S}{s} |
R | polmer očrtane krožnice | R = \frac{abc}{4S} |
v | višina na osnovnico | |
v_c | višina na stranico $c$ | |
o | obseg | o = a + b + c |
I | središče včrtane krožnice | |
O | središče očrtane krožnice | |
:::

<<RACUN
vrednost: sqrt(5^2-3^2) | 4
vrednost: sqrt(8*3*3*2) | 12
vrednost: sqrt(6*3*2*1) | 6
vrednost: 3*4*5/(4*6) | 2.5
vrednost: sqrt(22*11*9*2) | 66
vrednost: sqrt(24*14*7*3) | 84
vrednost: 10*17*21/(4*84) | 10.625
vrednost: 84/24 | 3.5
vrednost: sqrt(180*90*80*10) | 3600
vrednost: sqrt(18*9*8*1) | 36
vrednost: 3600/180 | 20
vrednost: sqrt(15*10*3*2) | 30
vrednost: 5*12*13/(4*30) | 6.5
vrednost: sqrt(16*6*6*4) | 48
vrednost: 10*10*12/(4*48) | 6.25
vrednost: sqrt(21*14*6*1) | 42
vrednost: 5*5*6/(4*12) | 3.125
vrednost: sqrt(21*8*7*6) | 84
vrednost: 13*14*15/(4*84) | 8.125
vrednost: 84/21 | 4
vrednost: sqrt(13^2-5^2) | 12
vrednost: sqrt(15^2-9^2) | 12
>>
