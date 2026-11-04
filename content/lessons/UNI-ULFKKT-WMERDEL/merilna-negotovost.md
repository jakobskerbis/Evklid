---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Do sredine sedemdesetih let 20. stoletja so čas v šprintu na 100 m merili ročno. Ob cilju je stalo več časomerilcev s štoparicami. Za istega tekača so pogosto ustavili različne čase, zato so rezultat zaokrožili na desetinko sekunde.

Ko so uvedli elektronsko merjenje, se je pokazala še druga težava. Ročni časi niso bili le razpršeni, ampak so bili praviloma tudi *prekratki*. Časomerilec je štoparico sprožil šele, ko je zagledal blisk pištole, ustavil pa jo je pogosto malo prezgodaj, ko je pričakoval prihod tekača. Od leta 1977 svetovna atletska zveza rekorde v šprintu priznava le z elektronskim merjenjem.

V tej zgodbi sta skrita oba pojma, ki ju potrebuje vsak merilec: **raztros** ponovljenih meritev in **sistematični zamik** celotnega merilnika. Podobno težavo so imeli meroslovni laboratoriji: isto količino so izmerili vsak po svoje in negotovost poročali na različne načine. Zato je leta 1993 izšel mednarodni *Vodnik za izražanje merilne negotovosti* (GUM). Po njem danes poročajo tudi meritve hrupa, prahu in mikroklime na delovnem mestu.

Tam je ocena negotovosti odločilna. Raven hrupa $84\,\mathrm{dB}$ ali $86\,\mathrm{dB}$ odloča, ali je zgornja opozorilna vrednost $85\,\mathrm{dB}$ presežena in mora delodajalec izvesti program tehničnih in organizacijskih ukrepov. Rezultat brez negotovosti zato ni uporaben.

## Razlaga

**1. Oblak meritev na številski premici.** Trener isti posnetek teka petkrat izmeri z ročno štoparico. Dobi $11{,}32$, $11{,}18$, $11{,}25$, $11{,}41$ in $11{,}24\,\mathrm{s}$. Vrišimo jih na premico (en znak je $0{,}01\,\mathrm{s}$):

```
11,1      11,2      11,3      11,4      11,5  t [s]
|---------|---------|---------|---------|
        •     ••      •        •
                  ▲ povprečje 11,28
         [-----------------]  povprečje ± s
```

Točke tvorijo oblak. Njegova sredina je **povprečje** $\bar{x}$, njegova širina pa je **raztros**. Raztros meri **standardni odmik** $s$: približno dve tretjini meritev leži znotraj pasu $\bar{x} \pm s$.

**2. Ponovljivost.** Če isti merilec z istim merilnikom po istem postopku v kratkem času ponavlja meritev, je raztros mera za **ponovljivost**. Ožji oblak pomeni boljšo ponovljivost. Kadar meritve ponovijo drugi merilci, z drugimi merilniki ali drug dan, govorimo o **obnovljivosti**. Raztros je takrat običajno večji.

Povprečje več meritev je zanesljivejše od ene same. Negotovost povprečja je zato manjša od $s$: deli se s korenom števila meritev.

:::premisli
Trener namesto 5 opravi 20 meritev. Kaj se zgodi s širino oblaka $s$ in kaj z negotovostjo povprečja?
---
Širina oblaka ostane približno enaka, saj je to lastnost štoparice in trenerjeve roke. Negotovost povprečja pa se zmanjša, ker se deli z $\sqrt{n}$: pri 20 meritvah je približno pol manjša kot pri 5.
:::

**3. Kalibracija premakne cel oblak.** Ponavljanje ne pokaže, ali je oblak na pravem mestu. Štoparica, ki vedno zamudi $0{,}1\,\mathrm{s}$, da lep, ozek oblak, a zamaknjen. Tak stalen zamik je **sistematični pogrešek**.

Odkrije ga le **kalibracija**: primerjava merilnika z **etalonom**, to je virom z znano vrednostjo in znano negotovostjo. Merilnik hrupa na primer priključimo na zvočni kalibrator, ki daje natanko $94{,}0\,\mathrm{dB}$. Če merilnik pokaže $94{,}4\,\mathrm{dB}$, sedi njegov oblak $0{,}4\,\mathrm{dB}$ desno od prave vrednosti. **Popravek** je razlika med referenco in odčitkom, tu $-0{,}4\,\mathrm{dB}$. Prištejemo ga vsem nadaljnjim odčitkom.

:::premisli
Zakaj tudi zelo veliko ponovitev meritve ne more nadomestiti kalibracije?
---
Ponovitve zožijo negotovost povprečja, a vse nosijo isti zamik. Oblak postane ožji, ne pa pravilneje postavljen. Zamik vidiš šele, ko merilnik primerjaš z znano vrednostjo.
:::

**4. Dve poti do negotovosti.** Prispevek, ki ga ocenimo iz raztrosa ponovljenih meritev, je **ocena tipa A**. Prispevek iz drugih podatkov, na primer iz kalibracijskega lista, tolerance proizvajalca ali ločljivosti prikazovalnika, je **ocena tipa B**. Kadar je znana le meja $\pm a$, znotraj katere je vsaka vrednost enako verjetna (**pravokotna** ali enakomerna porazdelitev), je standardna negotovost $a/\sqrt{3}$.

**5. Proračun negotovosti.** Vse prispevke zberemo v tabelo, imenovano **proračun negotovosti**. Vrednosti so iz meritve hrupa v primeru 3:

| vir | tip | $u$ [dB] |
|---|---|---|
| ponovljivost | A | $0{,}33$ |
| kalibrator | B | $0{,}17$ |
| merilnik | B | $0{,}70$ |

Neodvisni prispevki se ne seštevajo naravnost: seštejemo njihove kvadrate in vsoto korenimo. Velik prispevek zato prevlada, majhni skoraj ne vplivajo. Dobimo **kombinirano standardno negotovost** $u_c$. Pomnožimo jo s **faktorjem pokritja** $k$, običajno $k = 2$, in dobimo **razširjeno negotovost** $U$. Interval $\bar{x} \pm U$ zajame pravo vrednost s približno $95\,\%$ verjetnostjo.

**6. Simboli na koncu.** Vse zgornje slike zapišemo z enačbami:

$$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}$$

$$s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n - 1}}$$

$$u_A = \frac{s}{\sqrt{n}} \qquad u_B = \frac{a}{\sqrt{3}}$$

$$u_c = \sqrt{u_1^2 + u_2^2 + u_3^2}$$

$$U = k \cdot u_c$$

**7. Poročilo o meritvah.** Rezultat brez konteksta ni preverljiv. Poročilo zato vsebuje:

- merjeno količino, mesto, datum in pogoje (delovni proces, temperatura, trajanje),
- merilnik, njegovo serijsko številko, datum kalibracije in uporabljeni popravek,
- postopek ali standard in število ponovitev,
- rezultat v obliki $\bar{x} \pm U$ z enoto in navedenim $k$,
- primerjavo z mejno vrednostjo, ki upošteva negotovost.

$U$ zaokrožimo na eno ali dve veljavni mesti, rezultat pa na isto decimalno mesto kot $U$.

## Rešeni primeri

### Primer 1: ponovljivost ročne štoparice

Trener petkrat izmeri čas istega teka na posnetku: $11{,}32$, $11{,}18$, $11{,}25$, $11{,}41$ in $11{,}24\,\mathrm{s}$. Določi povprečje, standardni odmik in negotovost povprečja.

**Podatki:** $n = 5$; $x_i$: $11{,}32$, $11{,}18$, $11{,}25$, $11{,}41$, $11{,}24\,\mathrm{s}$
**Iščemo:** $\bar{x}$, $s$ in $u_A$

:::formula
$\bar{x} = \dfrac{\sum x_i}{n}$, $\quad s = \sqrt{\dfrac{\sum (x_i - \bar{x})^2}{n - 1}}$, $\quad u_A = \dfrac{s}{\sqrt{n}}$
:::

**Rešitev:**

1. Vsota je $56{,}40\,\mathrm{s}$, zato $\bar{x} = 56{,}40 / 5 = 11{,}28\,\mathrm{s}$.
2. Odmiki od povprečja so $0{,}04$, $-0{,}10$, $-0{,}03$, $0{,}13$ in $-0{,}04\,\mathrm{s}$. Njihovi kvadrati dajo vsoto $0{,}031\,\mathrm{s^2}$.
3. Delimo z $n - 1 = 4$, ker smo povprečje izračunali iz istih podatkov: $s = \sqrt{0{,}031 / 4} \approx 0{,}088\,\mathrm{s}$.
4. Negotovost povprečja: $u_A = 0{,}088 / \sqrt{5} \approx 0{,}039\,\mathrm{s}$.
5. Odgovor: povprečni čas je $11{,}28\,\mathrm{s}$, posamezna meritev raztrosi za približno $0{,}09\,\mathrm{s}$, standardna negotovost povprečja pa je približno $0{,}04\,\mathrm{s}$.

### Primer 2: popravek iz kalibracije

Pred meritvijo hrupa merilnik priključimo na kalibrator z ravnijo $94{,}0\,\mathrm{dB}$. Merilnik pokaže $94{,}4\,\mathrm{dB}$. Na delovnem mestu nato odčitamo $87{,}6\,\mathrm{dB}$. Proizvajalec za kalibrator navaja toleranco $\pm 0{,}3\,\mathrm{dB}$. Določi popravljeno raven in prispevek kalibratorja k negotovosti.

**Podatki:** $L_\mathrm{ref} = 94{,}0\,\mathrm{dB}$, $L_\mathrm{kal} = 94{,}4\,\mathrm{dB}$, $L_\mathrm{odč} = 87{,}6\,\mathrm{dB}$, $a = 0{,}3\,\mathrm{dB}$
**Iščemo:** popravek $K$, popravljeno raven $L$ in $u_B$

:::formula
$K = L_\mathrm{ref} - L_\mathrm{kal}$, $\quad L = L_\mathrm{odč} + K$, $\quad u_B = \dfrac{a}{\sqrt{3}}$
:::

**Rešitev:**

1. Popravek: $K = 94{,}0 - 94{,}4 = -0{,}4\,\mathrm{dB}$. Merilnik kaže preveč, zato je popravek negativen.
2. Popravljena raven: $L = 87{,}6 - 0{,}4 = 87{,}2\,\mathrm{dB}$.
3. Toleranca pove le mejo, zato uporabimo pravokotno porazdelitev: $u_B = 0{,}3 / \sqrt{3} \approx 0{,}17\,\mathrm{dB}$.
4. Odgovor: popravljena raven je $87{,}2\,\mathrm{dB}$, kalibrator prispeva standardno negotovost približno $0{,}17\,\mathrm{dB}$.

### Primer 3: od proračuna do poročila

Na delovnem mestu ob stiskalnici opravimo šest meritev ravni hrupa. Po popravku je povprečje $83{,}9\,\mathrm{dB}$, standardni odmik pa $0{,}8\,\mathrm{dB}$. Kalibrator prispeva $0{,}17\,\mathrm{dB}$, merilnik sam $0{,}70\,\mathrm{dB}$. Zapiši rezultat za poročilo ($k = 2$). Ali lahko trdimo, da je hrup pod zgornjo opozorilno vrednostjo $85\,\mathrm{dB}$? Do katerega povprečja bi to lahko trdili pri enaki negotovosti?

**Podatki:** $n = 6$, $\bar{x} = 83{,}9\,\mathrm{dB}$, $s = 0{,}8\,\mathrm{dB}$, $u_\mathrm{kal} = 0{,}17\,\mathrm{dB}$, $u_\mathrm{m} = 0{,}70\,\mathrm{dB}$, $k = 2$, opozorilna vrednost $85\,\mathrm{dB}$
**Iščemo:** $\bar{x} \pm U$, odločitev in največje dopustno povprečje

:::formula
$u_A = \dfrac{s}{\sqrt{n}}$, $\quad u_c = \sqrt{u_A^2 + u_\mathrm{kal}^2 + u_\mathrm{m}^2}$, $\quad U = k \cdot u_c$
:::

**Rešitev:**

1. Tip A: $u_A = 0{,}8 / \sqrt{6} \approx 0{,}33\,\mathrm{dB}$.
2. Kombinirana negotovost: $u_c = \sqrt{0{,}33^2 + 0{,}17^2 + 0{,}70^2} \approx 0{,}79\,\mathrm{dB}$. Prevlada merilnik.
3. Razširjena: $U = 2 \cdot 0{,}79 = 1{,}58\,\mathrm{dB}$, zaokroženo $1{,}6\,\mathrm{dB}$.
4. V poročilo zapišemo $L = (83{,}9 \pm 1{,}6)\,\mathrm{dB}$, $k = 2$. Interval sega od $82{,}3$ do $85{,}5\,\mathrm{dB}$.
5. Interval vsebuje $85\,\mathrm{dB}$, zato ne moremo trditi, da je hrup pod opozorilno vrednostjo.
6. Za zadnje vprašanje mora zgornji rob intervala ležati pod mejo. Izračunaj sam, nato preveri:

:::premisli
Do katerega povprečja $\bar{x}$ velja $\bar{x} + 1{,}6\,\mathrm{dB} < 85\,\mathrm{dB}$?
---
$\bar{x} < 85 - 1{,}6 = 83{,}4\,\mathrm{dB}$. Pri izmerjenem povprečju pod $83{,}4\,\mathrm{dB}$ bi lahko v poročilu zapisali, da je hrup pod opozorilno vrednostjo.
:::

## Pogoste napake

- **»Več ponovitev odpravi vsako napako.«** Ponovitve zmanjšajo le naključni del. Zamaknjen merilnik ostane zamaknjen, zato ga je treba kalibrirati in upoštevati popravek.
- **Standardni odmik namesto negotovosti povprečja.** Kdor za negotovost povprečja vzame kar $s$, pozabi, da je povprečje zanesljivejše od posamezne meritve. Pravilno je $u_A = s/\sqrt{n}$. Velja tudi obratno: $u_A$ ni raztros posameznih meritev.
- **Seštevanje naravnost.** $0{,}33 + 0{,}17 + 0{,}70 = 1{,}20\,\mathrm{dB}$ precenjuje negotovost, saj neodvisni prispevki redko vsi hkrati kažejo v isto smer. Seštevamo kvadrate in korenimo.
- **Toleranca kot standardna negotovost.** Meja $\pm a$ ni standardna negotovost. Pri enakomerni porazdelitvi jo delimo s $\sqrt{3}$.
- **Odločanje samo po povprečju.** Povprečje $83{,}9\,\mathrm{dB}$ je pod $85\,\mathrm{dB}$, a interval $\pm U$ mejo prečka. Poročilo mora to povedati.

## Povzetek

- Ponovljivost opisuje raztros meritev v enakih pogojih; meri jo standardni odmik $s$, negotovost povprečja je $u_A = s/\sqrt{n}$.
- Kalibracija s primerjavo z etalonom odkrije sistematični zamik; popravek $K$ = referenca − odčitek.
- Tip A iz ponovitev, tip B iz kalibracijskega lista, tolerance ali ločljivosti ($a/\sqrt{3}$).
- Neodvisne prispevke seštevamo v kvadratih: $u_c = \sqrt{\sum u_i^2}$; razširjena negotovost $U = k \cdot u_c$, običajno $k = 2$.
- Poročilo navede merilnik in kalibracijo, postopek, pogoje, rezultat $\bar{x} \pm U$ s $k$ in primerjavo z mejno vrednostjo, ki upošteva $U$.

## Drugače: Z analogijo

Predstavljaj si pikado. Vsaka puščica je ena meritev, središče tarče je prava vrednost.

- Puščice tesno skupaj, a v zgornjem levem kotu: dobra ponovljivost, velik sistematični zamik. Igralec ima mirno roko, a krivo nameri. Pomaga »kalibracija« merka.
- Puščice razpršene po vsej tarči, a okrog središča: slaba ponovljivost, brez zamika. Povprečje vseh puščic je blizu središča, a za to potrebuješ veliko metov.
- Puščice tesno skupaj na sredini: to je cilj dobrega merilnika.

Razširjena negotovost je krog okrog povprečja puščic, v katerem s $95\,\%$ verjetnostjo leži središče. Analogija ima mejo: pri meritvi središča tarče ne vidimo. Prav zato potrebujemo etalon.

## Drugače: Iz vsakdanjega življenja

Kuhinjska tehtnica pokaže $1004\,\mathrm{g}$, ko nanjo postaviš liter vode. Če vodo stehtaš petkrat in dobiš $1003$ do $1005\,\mathrm{g}$, je tehtnica ponovljiva. Liter vode pri sobni temperaturi ima maso blizu $998\,\mathrm{g}$, zato tehtnica kaže približno $6\,\mathrm{g}$ preveč. To je domača kalibracija: od vsakega odčitka odšteješ okrog $6\,\mathrm{g}$.

Tudi točilni avtomati za gorivo so redno overjeni. Uradni merilec natoči znano prostornino v etalonsko posodo in primerja z odčitkom. Na avtomatu je nalepka z datumom overitve. To je kratko »poročilo o meritvah«: kdo, kdaj in s čim je preveril merilnik.

## Preveri se

? Kaj od naštetega **ne** sodi med vire ocene negotovosti tipa B?
- toleranca kalibratorja, ki jo navaja proizvajalec
~ Toleranca je podatek iz dokumentacije, ne iz ponovitev, zato je tipična ocena tipa B.
+ raztros šestih zaporednih meritev na istem mestu
- ločljivost prikazovalnika $0{,}1\,\mathrm{dB}$
~ Ločljivost je znana meja zaokroževanja ($\pm 0{,}05\,\mathrm{dB}$), torej ocena tipa B.
- negotovost iz kalibracijskega lista merilnika
~ Kalibracijski list je zunanji podatek; njegovo negotovost uporabimo kot oceno tipa B.
> Raztros ponovljenih meritev obdelamo statistično, zato je to ocena tipa A.

? Pri devetih meritvah prahu je standardni odmik $0{,}6\,\mathrm{mg/m^3}$. Kolikšna je standardna negotovost povprečja?
- $0{,}6\,\mathrm{mg/m^3}$
~ To je raztros posamezne meritve. Povprečje devetih meritev je zanesljivejše, zato delimo s $\sqrt{9}$.
+ $0{,}2\,\mathrm{mg/m^3}$
- $0{,}067\,\mathrm{mg/m^3}$
~ Delil si z $n = 9$ namesto s $\sqrt{n} = 3$.
> $u_A = \dfrac{s}{\sqrt{n}} = \dfrac{0{,}6}{3} = 0{,}2\,\mathrm{mg/m^3}$.

? Merilec namesto 4 opravi 16 ponovitev, vse drugo ostane enako. Kaj je posledica?
- Negotovost tipa A in sistematični zamik se oba razpolovita.
~ Ponovitve ne vplivajo na zamik merilnika; tega odpravi le popravek iz kalibracije.
- Standardni odmik $s$ se razpolovi.
~ $s$ je širina oblaka in je lastnost postopka; z več meritvami ostane približno enak.
+ Negotovost povprečja $u_A$ se približno razpolovi, zamik ostane.
> $\sqrt{16}/\sqrt{4} = 2$, zato je $u_A$ pol manjša; sistematični del se ne spremeni.

? Študent napiše proračun: (1) $u_A = 0{,}3\,\mathrm{dB}$, (2) $u_\mathrm{kal} = 0{,}4\,\mathrm{dB}$, (3) $u_c = 0{,}3 + 0{,}4 = 0{,}7\,\mathrm{dB}$, (4) $U = 2 \cdot u_c$. Kateri korak je napačen?
- korak (1)
~ $u_A$ je podan kot rezultat ocene tipa A; s tem ni nič narobe.
+ korak (3)
- korak (4)
~ $U = k \cdot u_c$ s $k = 2$ je pravilno; napaka je prej.
- noben, proračun je pravilen
~ Neodvisni prispevki se ne seštevajo naravnost, zato je eden od korakov napačen.
> Prispevke seštejemo v kvadratih: $u_c = \sqrt{0{,}3^2 + 0{,}4^2} = 0{,}5\,\mathrm{dB}$, nato $U = 1{,}0\,\mathrm{dB}$.

? V poročilu piše: koncentracija prahu $(4{,}6 \pm 0{,}8)\,\mathrm{mg/m^3}$, $k = 2$; mejna vrednost je $5\,\mathrm{mg/m^3}$. Kaj je pravilen zaključek?
- Mejna vrednost je zagotovo upoštevana, ker je $4{,}6 < 5$.
~ Povprečje je pod mejo, a interval sega do $5{,}4\,\mathrm{mg/m^3}$, torej čez mejo.
- Mejna vrednost je zagotovo presežena.
~ Interval sega tudi pod mejo (od $3{,}8$), zato preseganja ne moremo trditi.
+ Skladnosti ni mogoče potrditi; potrebne so dodatne meritve ali manjša negotovost.
> Interval $3{,}8$ do $5{,}4\,\mathrm{mg/m^3}$ vsebuje mejno vrednost, zato odločitev ni zanesljiva.

:::simboli
\bar{x} | povprečje meritev | \bar{x} = \frac{x_1 + \dots + x_n}{n} | | enota kot merjena količina
x_i, x_1, x_2, x_n | posamezne meritve | | | enota kot merjena količina
n | število ponovitev | | – |
s | standardni odmik (raztros) | s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n-1}} | | meri ponovljivost
u_A | standardna negotovost tipa A | u_A = \frac{s}{\sqrt{n}} | | negotovost povprečja
u_B | standardna negotovost tipa B | u_B = \frac{a}{\sqrt{3}} | | iz tolerance, kalibracije, ločljivosti
a | polširina meje (toleranca) | | | vrednost znotraj $\pm a$
u_c | kombinirana standardna negotovost | u_c = \sqrt{u_1^2 + u_2^2 + u_3^2} | |
u_1, u_2, u_3 | posamezni prispevki k negotovosti | | |
U | razširjena negotovost | U = k \cdot u_c | | interval $\bar{x} \pm U$
k | faktor pokritja | | – | običajno 2, približno $95\,\%$
K | popravek iz kalibracije | K = L_\mathrm{ref} - L_\mathrm{kal} | dB |
L_\mathrm{ref} | raven kalibratorja (referenca) | | dB |
L_\mathrm{kal} | odčitek merilnika na kalibratorju | | dB |
L_\mathrm{odč} | odčitek na delovnem mestu | | dB |
L | popravljena raven hrupa | L = L_\mathrm{odč} + K | dB |
u_\mathrm{kal} | prispevek kalibratorja | | dB |
u_\mathrm{m} | prispevek merilnika | | dB |
:::
