---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Imaš šahovnico $8 \times 8$ in $31$ domin. Vsaka domina pokrije natanko dve sosednji polji. Iz šahovnice izrežeš dve nasprotni kotni polji, npr. levo spodaj in desno zgoraj. Ostane $64 - 2 = 62$ polj, domine pa pokrijejo $31 \cdot 2 = 62$ polj. Števila se ujemajo. Ali lahko z dominami pokriješ celo okrnjeno šahovnico?

Lahko poskušaš ure in ure, pa ne bo šlo. Toda »ni mi uspelo« ni dokaz. Morda si le premalo poskušal. V tej lekciji se naučiš, kako v nekaj vrsticah **dokažeš**, da nekaj ni mogoče. Orodje se imenuje **invarianta**, na tekmovanjih pa ga srečaš pri kovancih, številih na tabli, šahovnicah in igrah.

## Razlaga

**1. Korak in invarianta.** Mnoge naloge opišejo **dovoljen korak**: obrni kovanca, zbriši dve števili, premakni figuro. Sprašujejo, ali lahko s koraki pridemo od začetka do cilja. **Invarianta** je lastnost, ki se pri nobenem dovoljenem koraku ne spremeni.

Primer: na tabli so števila $1$, $2$, $3$, $4$. V koraku zbrišeš dve števili in napišeš njuno vsoto. Vsota vseh števil na tabli se pri tem ne spremeni, saj $a$ in $b$ zamenjaš z $a + b$. Zato je na koncu na tabli število $1 + 2 + 3 + 4 = 10$, ne glede na vrstni red.

**2. Zakaj invarianta dokaže »ne gre«.** Če ima začetek eno vrednost invariante, cilj pa drugo, cilja ne dosežeš nikoli. Vsak korak namreč ohrani vrednost začetka. Obratno ne velja: če se vrednosti ujemata, to še ni dokaz, da gre. Takrat moraš pot pokazati.

**3. Parnost.** Število je **sodo**, če je deljivo z $2$, in **liho**, če ni. Lastnosti, ali je število sodo ali liho, rečemo **parnost**. Za vsoto velja:

| $+$ | sodo | liho |
|---|---|---|
| **sodo** | sodo | liho |
| **liho** | liho | sodo |

Torej: vsota je liha natanko takrat, ko ima **liho število lihih sumandov**. Sodi sumandi na parnost ne vplivajo. Enako velja za razliko, ker se $a - b$ in $a + b$ razlikujeta za $2b$, ki je sodo.

:::premisli
Ali je vsota $13 + 25 + 37 + 41 + 59$ soda ali liha? Odgovori, ne da bi seštel.
---
Liha. Vsi sumandi so lihi in teh je $5$, kar je liho število. Za kontrolo: vsota je $175$.
:::

**4. Parnost kot invarianta.** Pogosto se količina pri koraku spreminja, a vedno za sodo število, npr. za $-2$, $0$ ali $+2$. Takrat se ohranja njena parnost. Sama količina ni invarianta, njena parnost pa je. To je najpogostejša invarianta na tekmovanjih.

**5. Barvanje polj.** Pri nalogah na mreži polja pobarvamo, da opazimo invarianto. Najpogostejše je **šahovsko barvanje**: sosednji polji imata vedno različni barvi. Na šahovnici:

:::risba skica
opis: Šahovnica 8 krat 8 s šahovskim barvanjem: polja so izmenično belo (B) in temno (T), levo zgoraj je belo. Sosednji polji imata vedno različni barvi.
območje: 0; 0 .. 8; 8
enota: 30
pravokotnik: 0; 7 .. 1; 8 | ozadje
pravokotnik: 1; 7 .. 2; 8 | modra
pravokotnik: 2; 7 .. 3; 8 | ozadje
pravokotnik: 3; 7 .. 4; 8 | modra
pravokotnik: 4; 7 .. 5; 8 | ozadje
pravokotnik: 5; 7 .. 6; 8 | modra
pravokotnik: 6; 7 .. 7; 8 | ozadje
pravokotnik: 7; 7 .. 8; 8 | modra
pravokotnik: 0; 6 .. 1; 7 | modra
pravokotnik: 1; 6 .. 2; 7 | ozadje
pravokotnik: 2; 6 .. 3; 7 | modra
pravokotnik: 3; 6 .. 4; 7 | ozadje
pravokotnik: 4; 6 .. 5; 7 | modra
pravokotnik: 5; 6 .. 6; 7 | ozadje
pravokotnik: 6; 6 .. 7; 7 | modra
pravokotnik: 7; 6 .. 8; 7 | ozadje
pravokotnik: 0; 5 .. 1; 6 | ozadje
pravokotnik: 1; 5 .. 2; 6 | modra
pravokotnik: 2; 5 .. 3; 6 | ozadje
pravokotnik: 3; 5 .. 4; 6 | modra
pravokotnik: 4; 5 .. 5; 6 | ozadje
pravokotnik: 5; 5 .. 6; 6 | modra
pravokotnik: 6; 5 .. 7; 6 | ozadje
pravokotnik: 7; 5 .. 8; 6 | modra
pravokotnik: 0; 4 .. 1; 5 | modra
pravokotnik: 1; 4 .. 2; 5 | ozadje
pravokotnik: 2; 4 .. 3; 5 | modra
pravokotnik: 3; 4 .. 4; 5 | ozadje
pravokotnik: 4; 4 .. 5; 5 | modra
pravokotnik: 5; 4 .. 6; 5 | ozadje
pravokotnik: 6; 4 .. 7; 5 | modra
pravokotnik: 7; 4 .. 8; 5 | ozadje
pravokotnik: 0; 3 .. 1; 4 | ozadje
pravokotnik: 1; 3 .. 2; 4 | modra
pravokotnik: 2; 3 .. 3; 4 | ozadje
pravokotnik: 3; 3 .. 4; 4 | modra
pravokotnik: 4; 3 .. 5; 4 | ozadje
pravokotnik: 5; 3 .. 6; 4 | modra
pravokotnik: 6; 3 .. 7; 4 | ozadje
pravokotnik: 7; 3 .. 8; 4 | modra
pravokotnik: 0; 2 .. 1; 3 | modra
pravokotnik: 1; 2 .. 2; 3 | ozadje
pravokotnik: 2; 2 .. 3; 3 | modra
pravokotnik: 3; 2 .. 4; 3 | ozadje
pravokotnik: 4; 2 .. 5; 3 | modra
pravokotnik: 5; 2 .. 6; 3 | ozadje
pravokotnik: 6; 2 .. 7; 3 | modra
pravokotnik: 7; 2 .. 8; 3 | ozadje
pravokotnik: 0; 1 .. 1; 2 | ozadje
pravokotnik: 1; 1 .. 2; 2 | modra
pravokotnik: 2; 1 .. 3; 2 | ozadje
pravokotnik: 3; 1 .. 4; 2 | modra
pravokotnik: 4; 1 .. 5; 2 | ozadje
pravokotnik: 5; 1 .. 6; 2 | modra
pravokotnik: 6; 1 .. 7; 2 | ozadje
pravokotnik: 7; 1 .. 8; 2 | modra
pravokotnik: 0; 0 .. 1; 1 | modra
pravokotnik: 1; 0 .. 2; 1 | ozadje
pravokotnik: 2; 0 .. 3; 1 | modra
pravokotnik: 3; 0 .. 4; 1 | ozadje
pravokotnik: 4; 0 .. 5; 1 | modra
pravokotnik: 5; 0 .. 6; 1 | ozadje
pravokotnik: 6; 0 .. 7; 1 | modra
pravokotnik: 7; 0 .. 8; 1 | ozadje
črta: 0; 0 -> 8; 0 | siva
črta: 0; 0 -> 0; 8 | siva
črta: 0; 1 -> 8; 1 | siva
črta: 1; 0 -> 1; 8 | siva
črta: 0; 2 -> 8; 2 | siva
črta: 2; 0 -> 2; 8 | siva
črta: 0; 3 -> 8; 3 | siva
črta: 3; 0 -> 3; 8 | siva
črta: 0; 4 -> 8; 4 | siva
črta: 4; 0 -> 4; 8 | siva
črta: 0; 5 -> 8; 5 | siva
črta: 5; 0 -> 5; 8 | siva
črta: 0; 6 -> 8; 6 | siva
črta: 6; 0 -> 6; 8 | siva
črta: 0; 7 -> 8; 7 | siva
črta: 7; 0 -> 7; 8 | siva
črta: 0; 8 -> 8; 8 | siva
črta: 8; 0 -> 8; 8 | siva
napis: 0,5; 7,5 | B
napis: 1,5; 7,5 | T
napis: 2,5; 7,5 | B
napis: 3,5; 7,5 | T
napis: 4,5; 7,5 | B
napis: 5,5; 7,5 | T
napis: 6,5; 7,5 | B
napis: 7,5; 7,5 | T
napis: 0,5; 6,5 | T
napis: 1,5; 6,5 | B
napis: 2,5; 6,5 | T
napis: 3,5; 6,5 | B
napis: 4,5; 6,5 | T
napis: 5,5; 6,5 | B
napis: 6,5; 6,5 | T
napis: 7,5; 6,5 | B
napis: 0,5; 5,5 | B
napis: 1,5; 5,5 | T
napis: 2,5; 5,5 | B
napis: 3,5; 5,5 | T
napis: 4,5; 5,5 | B
napis: 5,5; 5,5 | T
napis: 6,5; 5,5 | B
napis: 7,5; 5,5 | T
napis: 0,5; 4,5 | T
napis: 1,5; 4,5 | B
napis: 2,5; 4,5 | T
napis: 3,5; 4,5 | B
napis: 4,5; 4,5 | T
napis: 5,5; 4,5 | B
napis: 6,5; 4,5 | T
napis: 7,5; 4,5 | B
napis: 0,5; 3,5 | B
napis: 1,5; 3,5 | T
napis: 2,5; 3,5 | B
napis: 3,5; 3,5 | T
napis: 4,5; 3,5 | B
napis: 5,5; 3,5 | T
napis: 6,5; 3,5 | B
napis: 7,5; 3,5 | T
napis: 0,5; 2,5 | T
napis: 1,5; 2,5 | B
napis: 2,5; 2,5 | T
napis: 3,5; 2,5 | B
napis: 4,5; 2,5 | T
napis: 5,5; 2,5 | B
napis: 6,5; 2,5 | T
napis: 7,5; 2,5 | B
napis: 0,5; 1,5 | B
napis: 1,5; 1,5 | T
napis: 2,5; 1,5 | B
napis: 3,5; 1,5 | T
napis: 4,5; 1,5 | B
napis: 5,5; 1,5 | T
napis: 6,5; 1,5 | B
napis: 7,5; 1,5 | T
napis: 0,5; 0,5 | T
napis: 1,5; 0,5 | B
napis: 2,5; 0,5 | T
napis: 3,5; 0,5 | B
napis: 4,5; 0,5 | T
napis: 5,5; 0,5 | B
napis: 6,5; 0,5 | T
napis: 7,5; 0,5 | B
podnapis: T = temno, B = belo.
:::

Vsaka domina pokrije dve sosednji polji, torej **eno temno in eno belo**. Če položimo $k$ domin, pokrijejo $k$ temnih in $k$ belih polj. Za pokritje mora biti temnih in belih polj enako.

Nasprotna kota šahovnice sta iste barve, oba temna. Po izrezu ostane $32 - 2 = 30$ temnih in $32$ belih polj. $31$ domin bi pokrilo $31$ temnih polj, a teh je le $30$. Pokritje ni mogoče, in to je dokaz.

Tudi skakač vsako potezo zamenja barvo polja. Po lihem številu potez je na drugi barvi kot na začetku, po sodem na isti.

:::premisli
Iz šahovnice $8 \times 8$ zdaj izrežemo dva kota v isti vrstici (levo spodaj in desno spodaj). Ali barvanje dokaže, da pokritje ni mogoče? Napovej, nato preveri.
---
Ne. Kota v isti vrstici sta različnih barv, ker ju loči $7$ polj, zato ostane $31$ temnih in $31$ belih polj. Barvanje ne prepove ničesar. Pokritje tu obstaja: preostalih $6$ polj spodnje vrstice pokrijejo $3$ vodoravne domine, vsako od ostalih $7$ vrstic pa $4$ domine. Skupaj $3 + 7 \cdot 4 = 31$ domin.
:::

V **simulaciji spodaj** (»Barvanje šahovnice in domine«) je tabla $6 \times 6$ brez dveh nasprotnih kotov. Preberi, koliko je belih in koliko temnih polj. Nato klikni en izrezan kot, da ga vrneš, in izreži polje tik ob njem. Opazuj, kako se števili izenačita in kdaj tlakovanje postane mogoče.

## Rešeni primeri

### Primer 1 (Kenguru, lažji)

Na mizi leži $7$ kovancev, vsi z grbom navzgor. V enem koraku obrneš natanko $2$ kovanca. Ali lahko po nekaj korakih dosežeš, da so vsi kovanci obrnjeni s cifro navzgor?

**Podatki:** $7$ kovancev, na začetku $7$ grbov navzgor; korak: obrni natanko $2$ kovanca; cilj: $0$ grbov navzgor
**Iščemo:** ali je cilj dosegljiv

:::formula
Če se količina pri vsakem koraku spremeni za sodo število, se njena parnost ohrani.
:::

**Rešitev:**

1. Opazujemo število grbov navzgor $g$. Pri koraku so tri možnosti:

| Obrnemo | Sprememba $g$ |
|---|---|
| dva grba | $-2$ |
| grb in cifro | $0$ |
| dve cifri | $+2$ |

2. Sprememba je vedno soda, zato se parnost števila $g$ ne spremeni: to je invarianta.
3. Na začetku je $g = 7$, kar je liho. Cilj je $g = 0$, kar je sodo.
4. Liho število nikoli ne postane sodo, zato cilja ne dosežemo.
5. Odgovor: ne, tega ne moreš doseči, ne glede na to, kako obračaš.

### Primer 2 (števila na tabli, srednji)

Na tabli so števila $1, 2, 3, \ldots, 10$. V enem koraku zbrišeš dve števili in namesto njiju napišeš njuno razliko (večje minus manjše). Po devetih korakih ostane eno število. Ali je to lahko $0$?

**Podatki:** števila od $1$ do $10$; korak: $a$ in $b$ (kjer $a \ge b$) zamenjaš z $a - b$; $9$ korakov, ostane eno število
**Iščemo:** ali je zadnje število lahko $0$

:::formula
Opazuj parnost vsote vseh števil na tabli; $a + b$ in $a - b$ sta iste parnosti.
:::

**Rešitev:**

1. Vsota se pri koraku spremeni: namesto $a + b$ je na tabli $a - b$. Vsota torej ni invarianta.
2. Razlika med $a + b$ in $a - b$ je $2b$, kar je sodo. Vsota se zmanjša za sodo število, zato se njena **parnost** ohrani.
3. Začetna vsota: $1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 = 55$, kar je liho.
4. Ko ostane eno število, je to število hkrati vsota. Zato mora biti liho.
5. Število $0$ je sodo, zato ne more ostati.
6. Odgovor: ne, zadnje število je vedno liho, torej ni nikoli $0$.

### Primer 3 (barvanje, težji)

Na vsakem polju table $5 \times 5$ sedi en hrošč. Na znak vsi hrošči hkrati skočijo, vsak na eno od sosednjih polj (gor, dol, levo ali desno). Ali je lahko po skoku na vsakem polju spet natanko en hrošč?

**Podatki:** tabla $5 \times 5$, na vsakem od $25$ polj en hrošč; vsak skoči na sosednje polje
**Iščemo:** ali je lahko po skoku na vsakem polju natanko en hrošč

:::formula
Šahovsko barvanje: skok na sosednje polje vedno zamenja barvo.
:::

**Rešitev:**

1. Tablo pobarvamo šahovsko, kote temno. V vsaki vrstici se barve izmenjujejo, zato je temnih polj $3 + 2 + 3 + 2 + 3 = 13$ in belih $25 - 13 = 12$.
2. Sosednji polji sta različnih barv. Zato vsak hrošč s temnega polja skoči na belo polje.
3. Na temnih poljih sedi $13$ hroščev in vsi skočijo na bela polja. Belih polj je le $12$.
4. Ko $13$ hroščev razporedimo na $12$ polj, morata vsaj dva pristati na istem polju.
5. Ker je hroščev toliko kot polj, nekje dva hrošča pomenita, da je neko drugo polje prazno.
6. Odgovor: ne, po skoku je vsaj eno polje prazno in na vsaj enem sta vsaj dva hrošča.

### Primer 4 – zdaj ti

Iz table $7 \times 7$ izrežemo polje, ki leži tik ob kotu (v isti vrstici kot kot). Ali lahko preostala polja pokrijemo z dominami $1 \times 2$?

**Podatki:** tabla $7 \times 7$ ($49$ polj); izrežemo polje, sosednje kotu; domine pokrivajo po dve sosednji polji
**Iščemo:** ali je pokritje mogoče

:::formula
Ena domina pokrije eno temno in eno belo polje; potrebno je enako število temnih in belih polj.
:::

**Rešitev:**

1. Pobarvamo šahovsko, kote temno. V vrsticah se izmenjujejo vrstice s $4$ in $3$ temnimi polji, zato je temnih $4 + 3 + 4 + 3 + 4 + 3 + 4 = 25$ in belih $49 - 25 = 24$.
2. Polje ob kotu je sosednje kotu, torej belo.
3. Izračunaj sam, koliko temnih in koliko belih polj ostane, in sklepaj.

:::premisli
Koliko polj katere barve ostane in kaj to pomeni za pokritje?
---
Ostane $25$ temnih in $24 - 1 = 23$ belih polj, skupaj $48$. Za $48$ polj bi potrebovali $24$ domin, ki bi pokrile $24$ temnih in $24$ belih polj. Belih je le $23$, zato pokritje ni mogoče.
:::

## Pogoste napake

- **»Poskušal sem in ni šlo, torej ne gre.«** Neuspešni poskusi niso dokaz, ker morda le nisi našel prave poti. Popravek: poišči invarianto, ki je na začetku drugačna kot na cilju, in to zapiši.
- **»Invarianta se ujema, torej gre.«** Invarianta da le pogoj, ki mora veljati. Če velja, je cilj morda dosegljiv, ni pa nujno. Popravek: ko se invarianta ujema, pokaži konkretno pot (npr. razporeditev domin) ali poišči drugo invarianto.
- **Napačna parnost vsote:** »liho $+$ liho je liho«. Npr. $3 + 5 = 8$, kar je sodo. Popravek: štej lihe sumande. Če jih je liho mnogo, je vsota liha, sicer soda.
- **Invarianta je vzeta kar količina, ki se spreminja.** Učenec opazuje število grbov in ugotovi »spreminja se, torej ni invariante«. Popravek: če se količina spreminja vedno za sodo število, opazuj njeno parnost.
- **Napačno štetje barv.** Pri tabli z lihim robom ($5 \times 5$, $7 \times 7$) učenec misli, da je barv enako. Popravek: kotna polja so iste barve in te barve je za eno polje več.

## Povzetek

- Invarianta je lastnost, ki se pri dovoljenem koraku ne spremeni.
- Če se invarianta na začetku in na cilju razlikuje, cilj ni dosegljiv. Če se ujema, moraš pot še pokazati.
- Parnost: vsota je liha natanko takrat, ko ima liho število lihih sumandov. $a + b$ in $a - b$ sta iste parnosti.
- Če se količina spreminja za sodo število, se ohranja njena parnost.
- Šahovsko barvanje: domina pokrije eno temno in eno belo polje; skok na sosednje polje zamenja barvo.
- Šahovnica $8 \times 8$ brez nasprotnih kotov: $30$ temnih in $32$ belih polj, zato je ne pokrijemo z dominami.
- Postopek: kaj je korak → kaj se ne spremeni → primerjaj začetek in cilj.

## Drugače: Iz vsakdanjega življenja

Luč na stikalo: vsak pritisk zamenja stanje. Če je luč ugasnjena in nekdo pritisne $17$-krat, ne rabiš šteti posameznih pritiskov. Ker je $17$ liho, je luč prižgana. Pomembna je le parnost števila pritiskov.

Podobno je z vrati, ki jih odpiraš in zapiraš, ali s kovancem, ki ga obračaš. Vsako stanje »izmenično« je nalogica o parnosti.

## Drugače: Korak za korakom s številkami

Recept za naloge z invarianto:

1. **Kaj je korak?** Natančno zapiši, kaj se pri enem koraku zgodi (npr. $a$ in $b$ zamenjaš z $a - b$).
2. **Poskusi nekaj korakov** na majhnem primeru in zapisuj vsoto, število ali barvo. Kaj ostaja enako?
3. **Preveri v splošnem:** pokaži, da se to ohrani pri *vsakem* koraku, ne le pri tvojih.
4. **Izračunaj** invarianto na začetku in na cilju.
5. **Sklepaj:** različni vrednosti → ne gre. Enaki vrednosti → poišči pot.

Pri kovancih iz primera 1: korak spremeni $g$ za $-2$, $0$ ali $+2$; začetek $g = 7$ (liho), cilj $g = 0$ (sodo); vrednosti se razlikujeta → ne gre.

## Drugače: Bolj natančno

Parnost je ostanek pri deljenju z $2$. Včasih ta ne zadošča in pomaga ostanek pri deljenju s $3$ ali $4$. Primer: tablo $10 \times 10$ bi radi pokrili s ploščicami $1 \times 4$. Šahovsko barvanje tu ne pomaga, ker ploščica pokrije dve temni in dve beli polji. Pomaga pa barvanje s štirimi barvami po diagonalah (barva polja je ostanek $r + s$ pri deljenju s $4$, kjer sta $r$ in $s$ številki vrstice in stolpca). Vsaka ploščica pokrije po eno polje vsake barve, barv na tabli pa ni enako. To boš podrobneje spoznal pri deljivosti in ostankih.

Sorodno orodje je **monovarianta**: količina, ki se pri vsakem koraku samo poveča (ali samo zmanjša). Z njo dokažeš, da se postopek nekoč ustavi.

## Preveri se

? Kaj je invarianta?
- Količina, ki se pri vsakem koraku poveča.
~ To je monovarianta. Invarianta se pri koraku sploh ne spremeni.
+ Lastnost, ki se pri nobenem dovoljenem koraku ne spremeni.
- Rešitev naloge, do katere pridemo s koraki.
~ Invarianta ni rešitev, ampak orodje, s katerim primerjamo začetek in cilj.
> Invarianta ostane enaka pri vsakem koraku. Če je na začetku drugačna kot na cilju, cilja ne dosežemo.

? Vsota petih lihih števil je
- vedno soda.
~ Pravilo »liho $+$ liho $=$ sodo« velja za dva sumanda. Štej: lihih sumandov je $5$, kar je liho.
+ vedno liha.
- odvisna od tega, katera števila seštevamo.
~ Parnost vsote je odvisna le od števila lihih sumandov, ne od velikosti števil.
> Vsota je liha natanko takrat, ko ima liho število lihih sumandov. Pet je liho število.

? Pri tabli brez dveh polj šahovsko barvanje pokaže $31$ temnih in $31$ belih polj. Kaj sledi?
- Pokritje z dominami gotovo obstaja.
~ Enako število barv je le pogoj. Polja so lahko razporejena tako, da domin vseeno ne položiš.
- Pokritje z dominami ni mogoče.
~ Barvanje prepove pokritje le, če je barv različno število. Tu ne prepove ničesar.
+ Barvanje ne odloči; pokritje moramo pokazati ali najti drug razlog, da ga ni.
> Invarianta dokaže le »ne gre«, kadar se vrednosti razlikujeta. Ko se ujemata, moramo pot (pokritje) pokazati.

? Skakač stoji na temnem polju šahovnice in naredi $7$ potez. Na kakšnem polju stoji?
- Na temnem.
~ To bi veljalo po sodem številu potez. Vsaka poteza zamenja barvo, $7$ je liho.
+ Na belem.
- Ne moremo vedeti, odvisno je od potez.
~ Vsaka skakačeva poteza zamenja barvo polja, zato je barva odvisna le od števila potez.
> Skakač pri vsaki potezi zamenja barvo. Po $7$ (lihem številu) potezah je na drugi barvi kot na začetku, torej na belem polju.

? Na tabli so števila $1, 2, 3, 4, 5, 6$. V koraku zbrišeš dve števili in napišeš njuno razliko (večje minus manjše). Kaj zagotovo velja za zadnje število?
- Je $0$.
~ Morda si poskusil en vrstni red. Parnost vsote se ohranja, začetna vsota $21$ pa je liha.
- Je sodo.
~ Pri koraku se vsota zmanjša za sodo število $2b$, zato se parnost ohrani. Začetna vsota $21$ je liha.
+ Je liho.
> Vsota $1 + 2 + 3 + 4 + 5 + 6 = 21$ je liha. Ker sta $a + b$ in $a - b$ iste parnosti, se parnost vsote ohrani, zato je zadnje število liho.

:::simboli
a, b | števili na tabli, ki ju zamenjamo | | | a + b in a − b imata enako parnost
:::
