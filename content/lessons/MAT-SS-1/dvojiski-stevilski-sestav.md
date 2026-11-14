---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

*(višja raven) Dvojiški številski sestav matura preverja samo na višji ravni.*

Sošolec Matic je med odmorom trdil: »Računalnik pozna samo števki $0$ in $1$. Zato ne more zapisati niti števila $2$, kaj šele $8$, kolikor je planetov v Osončju.« Ima prav?

Ne. Vesoljska sonda daleč za Neptunom pošilja na Zemljo fotografije, meritve temperature in razdalje, vse to pa v signalu, ki pozna le dve stanji: impulz je ali ga ni. Sporočilo, ki so ga z radijskim teleskopom Arecibo poslali proti zvezdni kopici M13, se začne kar s števili od $1$ do $10$, zapisanimi samo z dvema znakoma. Kako je to mogoče, pove **dvojiški številski sestav**. Na koncu lekcije boš Maticu znal pokazati, da z dvema števkama zapišeš vsako naravno število.

## Razlaga

**1. Kaj že znaš: desetiški sestav.** Število $307$ pomeni $3$ stotice, $0$ desetic in $7$ enic: $3 \cdot 100 + 0 \cdot 10 + 7 \cdot 1 = 307$. Vsako mesto ima svojo **mestno vrednost**: $1$, $10$, $100$, $1000$ … Vsaka je desetkrat večja od tiste desno od nje. Ko pri štetju porabiš vseh deset števk (po $9$), zapišeš $0$ in na naslednje mesto preneseš $1$.

**2. Štetje z dvema števkama.** Kaj pa, če imaš samo števki $0$ in $1$? Šteješ po istem pravilu, le da prenašaš že po $1$. Za $0$ in $1$ ni težav. Število $2$ nima svoje števke, zato zapišeš $0$ in preneseš: $10$. Nadaljuj:

| število | zapis z $0$ in $1$ | število | zapis z $0$ in $1$ |
|---|---|---|---|
| $1$ | $1$ | $5$ | $101$ |
| $2$ | $10$ | $6$ | $110$ |
| $3$ | $11$ | $7$ | $111$ |
| $4$ | $100$ | $8$ | $1000$ |

Opaziš vzorec? Zapisi $1$, $10$, $100$, $1000$ pripadajo številom $1$, $2$, $4$, $8$. Vsak naslednji zapis z eno enico in samimi ničlami za njo pomeni **dvakrat** večje število od prejšnjega.

:::premisli
Napovej, kako se zapiše $16$ in katero število je zapisano s $1111$.
---
$16$ je spet podvojitev, zato je zapis $10000$. Zapis $1111$ je število tik pred tem: $8 + 4 + 2 + 1 = 15$.
:::

**3. Pravilo: mestne vrednosti so potence števila 2.** V **dvojiškem** (binarnem) številskem sestavu je osnova $2$. Števki sta $0$ in $1$; eni števki rečemo **bit**. Mestne vrednosti so od desne proti levi $2^0 = 1$, $2^1 = 2$, $2^2 = 4$, $2^3 = 8$ in tako naprej:

| mesto od desne | mestna vrednost | desetiško |
|---|---|---|
| 1. | $2^0$ | $1$ |
| 2. | $2^1$ | $2$ |
| 3. | $2^2$ | $4$ |
| 4. | $2^3$ | $8$ |
| 5. | $2^4$ | $16$ |
| 6. | $2^5$ | $32$ |
| 7. | $2^6$ | $64$ |
| 8. | $2^7$ | $128$ |

Da dvojiškega zapisa ne zamenjamo z desetiškim, osnovo napišemo desno spodaj v oklepaju: $1011_{(2)}$. Števila brez oznake so desetiška. Zapis $1011_{(2)}$ beremo »ena nič ena ena v dvojiškem sestavu«, nikoli »tisoč enajst«. V splošnem ima število z zapisom $a_k \dots a_2 a_1 a_0$ v dvojiškem sestavu (vsaka števka je $0$ ali $1$, $a_0$ je skrajno desna) vrednost

$$n = a_k \cdot 2^k + \dots + a_2 \cdot 2^2 + a_1 \cdot 2 + a_0$$

**4. Iz dvojiškega v desetiški sestav.** Nad vsako števko napiši njeno mestno vrednost in seštej tiste, pod katerimi stoji $1$. Pri $101101_{(2)}$:

:::risba skica
opis: Šest okvirčkov s števkami 1, 0, 1, 1, 0, 1 od leve proti desni. Nad njimi so mestne vrednosti 32, 16, 8, 4, 2, 1. Vrednosti nad enicami (32, 8, 4 in 1) so poudarjene.
območje: 0; 0 .. 6; 2,2
enota: 45
pravokotnik: 0; 0 .. 1; 1 | modra
pravokotnik: 1; 0 .. 2; 1 | siva
pravokotnik: 2; 0 .. 3; 1 | modra
pravokotnik: 3; 0 .. 4; 1 | modra
pravokotnik: 4; 0 .. 5; 1 | siva
pravokotnik: 5; 0 .. 6; 1 | modra
napis: 0,5; 0,5 | 1 | sredina | debelo
napis: 1,5; 0,5 | 0 | sredina
napis: 2,5; 0,5 | 1 | sredina | debelo
napis: 3,5; 0,5 | 1 | sredina | debelo
napis: 4,5; 0,5 | 0 | sredina
napis: 5,5; 0,5 | 1 | sredina | debelo
napis: 0,5; 1,5 | 32 | sredina | oranžna debelo
napis: 1,5; 1,5 | 16 | sredina | siva
napis: 2,5; 1,5 | 8 | sredina | oranžna debelo
napis: 3,5; 1,5 | 4 | sredina | oranžna debelo
napis: 4,5; 1,5 | 2 | sredina | siva
napis: 5,5; 1,5 | 1 | sredina | oranžna debelo
:::

Seštejemo $32 + 8 + 4 + 1 = 45$. Torej je $101101_{(2)}$ število $45$.

**5. Iz desetiškega v dvojiški sestav: vsota potenc.** Pot nazaj: število zapišeš kot vsoto različnih potenc števila $2$. Vzemi največjo potenco, ki ni večja od števila, in jo odštej; ponavljaj z ostankom. Pri $45$: največja je $32$, ostane $13$; nato $8$, ostane $5$; nato $4$, ostane $1$; nato $1$. Torej $45 = 32 + 8 + 4 + 1$. Na mesta $32$, $8$, $4$, $1$ zapišeš enice, na mesta $16$ in $2$ **ničle**: $101101_{(2)}$.

**6. Iz desetiškega v dvojiški sestav: zaporedno deljenje z 2.** Pri velikih številih je hitrejše deljenje. Spomni se osnovnega izreka o deljenju: za naravni števili $a$ in $b$ obstajata natanko en količnik $q$ in natanko en ostanek $r$, da je

$$a = q \cdot b + r, \quad 0 \le r < b$$

Pri $b = 2$ je ostanek $r$ lahko le $0$ ali $1$, torej ravno dvojiška števka. Zakaj je to **zadnja** števka? Vse mestne vrednosti razen $1$ so sode, zato je število sodo natanko takrat, ko je zadnja števka $0$. Količnik $q$ pa ima vse ostale števke, le premaknjene za eno mesto v desno: $45 = 101101_{(2)}$ deljeno z $2$ da količnik $22 = 10110_{(2)}$ in ostanek $1$, torej zadnja enica preprosto odpade. Zato deliš količnik spet z $2$ in tako dobiš predzadnjo števko. Ponavljaš, dokler ne dobiš količnika $0$. Ostanke **bereš od spodaj navzgor**, ker je prvi ostanek zadnja števka.

:::premisli
Dvojiški zapis nekega števila se konča z dvema ničlama. Kaj zagotovo veš o tem številu? Zakaj?
---
Deljivo je s $4$. Vse mestne vrednosti od tretjega mesta naprej ($4$, $8$, $16$ …) so večkratniki števila $4$, zadnji dve mesti pa ne prispevata ničesar.
:::

**7. Zakaj računalniki.** Elektronsko vezje najzanesljiveje loči dve stanji: napetost je ali je ni, impulz pride ali ne pride. Šum v signalu z Marsa lahko popači »malo napetosti« v »srednjo«, težko pa spremeni »nič« v »vse«. Zato sonde, telefoni in računalniki števila zapisujejo dvojiško. Z $k$ biti zapišeš števila od $0$ do $2^k - 1$, to je $2^k$ različnih števil, tako kot ima množica s $k$ elementi $2^k$ podmnožic: vsak bit je odločitev »da ali ne«.

## Rešeni primeri

### Primer 1 (lažji): sporočilo sonde

Sonda sporoči, koliko fotografij je posnela, z dvojiškim številom $101101_{(2)}$. Koliko fotografij je to?

**Podatki:** dvojiški zapis $101101_{(2)}$
**Iščemo:** desetiški zapis števila fotografij

:::formula
$n = a_5 \cdot 2^5 + a_4 \cdot 2^4 + a_3 \cdot 2^3 + a_2 \cdot 2^2 + a_1 \cdot 2 + a_0$
:::

**Rešitev:**

1. Mestne vrednosti od leve: $32$, $16$, $8$, $4$, $2$, $1$, ker je zapis šestmesten.
2. Vstavimo števke: $1 \cdot 32 + 0 \cdot 16 + 1 \cdot 8 + 1 \cdot 4 + 0 \cdot 2 + 1 \cdot 1 = 45$.
3. Odgovor: sonda je posnela $45$ fotografij.

### Primer 2: deljenje z 2

Teleskop je v enem tednu zaznal $89$ meteorjev. Zapiši $89$ v dvojiškem sestavu.

**Podatki:** $a = 89$ (desetiško), osnova $b = 2$
**Iščemo:** dvojiški zapis števila $89$

:::formula
Zaporedno deljenje: $a = q \cdot 2 + r$ z $r \in \{0, 1\}$; ostanke beremo od spodaj navzgor.
:::

**Rešitev:**

1. $89 = 44 \cdot 2 + 1$, ostanek $1$ (zadnja števka; $89$ je liho).
2. $44 = 22 \cdot 2 + 0$, ostanek $0$.
3. $22 = 11 \cdot 2 + 0$, ostanek $0$.
4. $11 = 5 \cdot 2 + 1$, ostanek $1$.
5. $5 = 2 \cdot 2 + 1$, ostanek $1$.
6. $2 = 1 \cdot 2 + 0$, ostanek $0$.
7. $1 = 0 \cdot 2 + 1$, ostanek $1$; količnik je $0$, zato končamo.
8. Ostanke beremo od zadnjega proti prvemu: $1011001_{(2)}$.
9. Preizkus z mestnimi vrednostmi: $64 + 16 + 8 + 1 = 89$.
10. Odgovor: $89$ meteorjev zapišemo kot $1011001_{(2)}$.

### Primer 3 (težji): koliko bitov je dovolj

Merilnik na sondi pošilja razdaljo v kilometrih kot $8$-mestno dvojiško število (osem bitov, spredaj so lahko ničle). Katero največje število lahko pošlje? Ali lahko pošlje razdaljo $300$ km?

**Podatki:** $k = 8$ bitov, razdalja $300$ km
**Iščemo:** največje število z $8$ biti; ali je $300$ km mogoče poslati

:::formula
Največje $k$-mestno dvojiško število so same enice: $2^k - 1$.
:::

**Rešitev:**

1. Največje je $11111111_{(2)}$, same enice.
2. Seštejemo mestne vrednosti: $128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255$. Hitreje: za $1$ večje bi bilo $100000000_{(2)}$, to je $2^8 = 256$, zato je $2^8 - 1 = 255$.
3. Ker je $300 > 255$, osem bitov ne zadošča.
4. Koliko mest bi potrebovali? Velja $256 \le 300 < 512$, zato je najvišja enica na mestu z vrednostjo $256 = 2^8$, to je deveto mesto.
5. Preverimo z vsoto potenc: $300 = 256 + 32 + 8 + 4$, torej $100101100_{(2)}$, kar ima res $9$ mest.
6. Odgovor: z $8$ biti lahko pošlje največ $255$; za $300$ km potrebuje $9$ bitov.

### Primer 4 – zdaj ti: vsota potenc

Termometer na sondi je izmeril $58$ stopinj nad dogovorjeno ničlo. Zapiši $58$ v dvojiškem sestavu z vsoto potenc števila $2$.

**Podatki:** $58$ (desetiško)
**Iščemo:** dvojiški zapis

:::formula
Odštevaj največje potence $2$, ki še niso večje od ostanka; na mesta neuporabljenih potenc piši $0$.
:::

**Rešitev:**

1. Največja potenca, ki ni večja od $58$, je $32$: $58 - 32 = 26$.
2. Naslednja je $16$: $26 - 16 = 10$.
3. Nadaljuj z ostankom $10$ in zapiši števke za mesta $32$, $16$, $8$, $4$, $2$, $1$.

:::premisli
Kakšen je dvojiški zapis števila $58$?
---
$10 = 8 + 2$, torej $58 = 32 + 16 + 8 + 2$. Mesta $4$ in $1$ dobita ničlo: $111010_{(2)}$.
:::

## Pogoste napake

- **Ostanki od zgoraj navzdol.** Pri deljenju dijak zapiše ostanke v vrstnem redu, kot jih je dobil. Pri $89$ dobi $1001101_{(2)}$, to pa je $77$. Prvi ostanek je **zadnja** števka, zato beri od spodaj navzgor.
- **Mestne vrednosti od 2 naprej.** Dijak začne skrajno desno z $2$ namesto z $1$ in vse vrednosti so dvakrat prevelike: $101101_{(2)}$ mu da $90$ namesto $45$. Skrajno desno mesto je $2^0 = 1$.
- **Pozabljene ničle.** Iz $40 = 32 + 8$ dijak zapiše $11_{(2)}$, kar je le $3$. Vsaka manjkajoča potenca med $32$ in $1$ dobi ničlo: $101000_{(2)}$.
- **Seštevanje namesto podvajanja.** Mestne vrednosti niso $1, 2, 3, 4$ ali $2, 4, 6, 8$, ampak $1, 2, 4, 8, 16$: vsaka je **dvakrat** večja od prejšnje.
- **Dvojiško število prebrano kot desetiško.** Kdor $1100_{(2)}$ prebere kot »tisoč sto«, misli, da je to veliko število. V resnici je $8 + 4 = 12$. Zato oznake $_{(2)}$ nikoli ne izpusti.

## Povzetek

- Dvojiški sestav ima osnovo $2$ in števki $0$, $1$ (bit). Zapis: $1011_{(2)}$.
- Mestne vrednosti od desne: $1, 2, 4, 8, 16, 32, 64, 128$ …, to je $2^0, 2^1, 2^2, \dots$
- Iz dvojiškega v desetiški: seštej mestne vrednosti nad enicami.
- Iz desetiškega v dvojiški: (a) vsota največjih potenc $2$, manjkajoče potence dobijo $0$; (b) zaporedno deljenje z $2$ po izreku $a = q \cdot b + r$, ostanke beri od spodaj navzgor.
- Zadnja števka je ostanek pri deljenju z $2$: $0$ pri sodem, $1$ pri lihem številu.
- Z $k$ biti zapišeš števila od $0$ do $2^k - 1$.

## Drugače: Korak za korakom s številkami

Pretvorimo $150$ in preverimo.

**Deljenje z 2.** V vsaki vrstici delimo količnik iz prejšnje vrstice:

| deljenec | količnik | ostanek |
|---|---|---|
| $150$ | $75$ | $0$ |
| $75$ | $37$ | $1$ |
| $37$ | $18$ | $1$ |
| $18$ | $9$ | $0$ |
| $9$ | $4$ | $1$ |
| $4$ | $2$ | $0$ |
| $2$ | $1$ | $0$ |
| $1$ | $0$ | $1$ |

Ostanke beremo od spodnje vrstice navzgor: $10010110_{(2)}$.

**Preizkus.** Zapis ima $8$ mest, zato je mestna vrednost skrajno leve enice $2^7 = 128$. Enice stojijo na mestih $128$, $16$, $4$ in $2$: $128 + 16 + 4 + 2 = 150$. Se ujema.

**Kontrola zadnje števke.** $150$ je sodo, zato se zapis konča z $0$. Tudi to se ujema.

## Drugače: Kot zgodba

Astronavtka Eva je na vesoljski postaji pol leta. Koledarja na steni nima, ker se vse prilepljeno odlepi in odplava. Zato si dneve misije šteje kar s prsti ene roke. Prst, ki je iztegnjen, pomeni $1$, skrčen pomeni $0$. Mezinec je vreden $1$, prstanec $2$, sredinec $4$, kazalec $8$, palec $16$.

Prvi dan iztegne mezinec. Drugi dan mezinec skrči in iztegne prstanec: to je $10_{(2)}$. Tretji dan iztegne oba. Četrti dan oba skrči in iztegne sredinec. Tako vsak dan »prenaša« kot števec prevoženih kilometrov v avtomobilu, le da ima vsako kolesce samo dve stanji.

Ko so iztegnjeni vsi prsti, je dan $16 + 8 + 4 + 2 + 1 = 31$. Ena roka ji torej zadošča za mesec. Ko vzame še drugo roko, deset prstov prešteje do $2^{10} - 1 = 1023$ dni, kar je dovolj za skoraj tri leta v vesolju. Matic bi ob tem verjetno priznal, da $0$ in $1$ le nista tako malo.

## Preveri se

? Katera trditev o mestnih vrednostih v dvojiškem sestavu je pravilna?
- Skrajno desno mesto ima vrednost $2$.
~ Skrajno desno mesto je $2^0 = 1$, tako kot je v desetiškem sestavu skrajno desno mesto enic.
- Mestne vrednosti so $1, 10, 100, 1000$ …
~ To so mestne vrednosti desetiškega sestava. V dvojiškem so to le zapisi števil $1, 2, 4, 8$.
+ Vsaka mestna vrednost je dvakrat večja od tiste desno od nje.
- Mestne vrednosti so $1, 2, 3, 4$ …
~ Vrednosti se ne povečujejo za $1$, ampak se podvajajo: $1, 2, 4, 8$ …
> Mestne vrednosti so potence števila $2$: $1, 2, 4, 8, 16$ …; vsaka je dvakrat večja od prejšnje.

? (brez računala) Pretvori $110110_{(2)}$ v desetiški sestav.
= 54
~ 108 | Začel si z mestno vrednostjo $2$ namesto $1$, zato je rezultat dvakrat prevelik.
~ 27 | Bral si števke v obratnem vrstnem redu ($011011_{(2)}$). Skrajno desna števka ima vrednost $1$.
> Enice stojijo na mestih $32$, $16$, $4$ in $2$: $32 + 16 + 4 + 2 = 54$.

? Luka je število $22$ pretvoril z deljenjem: $22 = 11 \cdot 2 + 0$, $11 = 5 \cdot 2 + 1$, $5 = 2 \cdot 2 + 1$, $2 = 1 \cdot 2 + 0$, $1 = 0 \cdot 2 + 1$. Zapisal je: »Torej je $22 = 01101_{(2)}$.« Kje je napaka?
- Že prvo deljenje je napačno, ker $22$ ni deljivo z $2$.
~ $22$ je sodo, zato je ostanek $0$ pravilen.
- Pri deljenju $5$ z $2$ bi moral biti ostanek $0$.
~ $5 = 2 \cdot 2 + 1$, ostanek $1$ je pravilen.
+ Ostanke je bral od zgoraj navzdol; pravilno je $10110_{(2)}$.
- Napačna je le ničla spredaj; brez nje je zapis pravilen.
~ Brez ničle dobiš $1101_{(2)} = 13$, ne $22$. Napaka je v vrstnem redu ostankov.
> Prvi ostanek je zadnja števka. Od spodaj navzgor: $10110_{(2)}$, preizkus $16 + 4 + 2 = 22$.

? Katero število je največje?
- $111111_{(2)}$
~ Ima največ enic, a je $32 + 16 + 8 + 4 + 2 + 1 = 63$. Ena višja mestna vrednost prevlada nad vsemi nižjimi skupaj.
+ $1000000_{(2)}$
- $60$
~ To je desetiško $60$, kar je manj od $64$.
- $1100_{(2)}$
~ Ne beri ga kot »tisoč sto«: $1100_{(2)} = 8 + 4 = 12$.
> $1000000_{(2)} = 2^6 = 64$, kar je več od $63$, $60$ in $12$.

? Na sprejemniku sporočila s sonde sveti vrsta sedmih lučk. Prižgana lučka pomeni $1$, ugasnjena $0$. Katero desetiško število je poslala sonda?
:::risba skica
opis: Vrsta sedmih okroglih lučk od leve proti desni. Pod vsako je zapisano, ali je prižgana (1) ali ugasnjena (0): 1, 1, 0, 0, 1, 0, 1.
območje: 0; 0 .. 7; 1,6
enota: 40
krog: 0,5; 1 | 0,35 | oranžna polno
krog: 1,5; 1 | 0,35 | oranžna polno
krog: 2,5; 1 | 0,35 | siva
krog: 3,5; 1 | 0,35 | siva
krog: 4,5; 1 | 0,35 | oranžna polno
krog: 5,5; 1 | 0,35 | siva
krog: 6,5; 1 | 0,35 | oranžna polno
napis: 0,5; 0,3 | 1 | sredina | debelo
napis: 1,5; 0,3 | 1 | sredina | debelo
napis: 2,5; 0,3 | 0 | sredina
napis: 3,5; 0,3 | 0 | sredina
napis: 4,5; 0,3 | 1 | sredina | debelo
napis: 5,5; 0,3 | 0 | sredina
napis: 6,5; 0,3 | 1 | sredina | debelo
:::
= 101
~ 83 | Bral si od desne proti levi. Skrajno desna lučka ima vrednost $1$, skrajno leva $64$.
~ 202 | Začel si z vrednostjo $2$ namesto $1$, zato je rezultat dvakrat prevelik.
> $1100101_{(2)}$: enice na mestih $64$, $32$, $4$ in $1$, torej $64 + 32 + 4 + 1 = 101$.

<<RACUN
vrednost: 8+4+2+1 | 15
vrednost: 1*2^5+0*2^4+1*2^3+1*2^2+0*2+1 | 45
vrednost: 44*2+1 | 89
vrednost: 64+16+8+1 | 89
vrednost: 2^8-1 | 255
vrednost: 256+32+8+4 | 300
vrednost: 32+16+8+2 | 58
vrednost: 64+8+4+1 | 77
vrednost: 32+16+4+2 | 54
vrednost: 16+4+2 | 22
vrednost: 64+32+4+1 | 101
vrednost: 128+16+4+2 | 150
vrednost: 2^10-1 | 1023
vrednost: 32+16+8+4+2+1 | 63
>>

:::simboli
n | naravno število (desetiško) | | |
a_0, a_1, a_2, a_3, a_4, a_5, a_k | dvojiške števke | | | vsaka je $0$ ali $1$; $a_0$ je skrajno desna
k | indeks mesta (štejemo od $0$ na desni) oziroma število bitov | | | števka $a_k$ ima mestno vrednost $2^k$
a | deljenec | a = q \cdot b + r | |
b | delitelj (pri pretvorbi $b = 2$) | | |
q | količnik | | |
r | ostanek | | | $0 \le r < b$; pri $b = 2$ je $0$ ali $1$
:::
