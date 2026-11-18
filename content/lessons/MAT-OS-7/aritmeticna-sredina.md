---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Pet prijateljev se po izletu vrne z bonboni: Ana jih ima $3$, Bor $7$, Cene $4$, Dana $8$ in Eva $3$. Eva se pritoži, da to ni pošteno. Koliko bonbonov bi imel vsak, če bi jih pravično razdelili?

Takšno »pošteno vrednost« srečuješ vsak dan: povprečna ocena v spričevalu, povprečna temperatura v mesecu, povprečno število točk košarkarja na tekmo. Vse to je **aritmetična sredina**. Z eno samo številko opiše celo skupino podatkov in omogoča primerjavo, na primer dveh razredov z različnim številom učencev.

## Razlaga

**1. Izravnava.** Bonbone zložimo na kup: $3 + 7 + 4 + 8 + 3 = 25$. Razdelimo jih med $5$ prijateljev: $25 : 5 = 5$. Če bi bilo pošteno, bi imel vsak $5$ bonbonov.

**Aritmetična sredina** podatkov je število, ki ga dobiš, če vsoto vseh podatkov deliš s številom podatkov. Pove, koliko bi dobil vsak, če bi vse razdelili enako.

**2. Odmiki.** **Odmik** podatka od sredine je razlika med podatkom in sredino. Pozitiven je, če je podatek večji od sredine, negativen, če je manjši.

| Ime | Bonboni | Odmik od $5$ |
|---|---|---|
| Ana | $3$ | $-2$ |
| Bor | $7$ | $+2$ |
| Cene | $4$ | $-1$ |
| Dana | $8$ | $+3$ |
| Eva | $3$ | $-2$ |

Bor in Dana imata skupaj $5$ bonbonov preveč, Ana, Cene in Eva pa skupaj $5$ premalo. Vsota odmikov je $0$. To velja za vsake podatke in je najpomembnejša lastnost sredine.

:::premisli
Eva dobi od babice še $5$ bonbonov. Napovej, kolikšna je nova sredina, preden računaš.
---
$6$. Vsota je zdaj $30$, podatkov je še vedno $5$, zato $30 : 5 = 6$. Dodatnih $5$ bonbonov se pri pošteni delitvi razdeli med $5$ prijateljev, vsak dobi $1$ več.
:::

**3. Na številski premici.** Podatke označi na številski premici: dve piki pri $3$, po eno pri $4$, $7$ in $8$. Predstavljaj si, da je premica lahka palica in da so pike enake uteži. Palica je v ravnovesju, če jo podpreš pri $5$. Uteži levo od $5$ so skupaj oddaljene $2 + 1 + 2 = 5$, uteži desno pa $2 + 3 = 5$. Aritmetična sredina je **točka ravnovesja** podatkov.

V simulaciji spodaj (»Aritmetična sredina kot ravnovesje«) odstrani pike, da ostanejo tri, in jih povleci na $2$, $4$ in $9$. Poglej, kam se postavi podpora (točka ravnovesja), in opazi: je pri $5$, čeprav noben podatek ni $5$. Bližje je majhnima podatkoma, ker sta dva, velik podatek pa je en sam in je zato bolj oddaljen.

**4. Zapis s simboli.** Podatke označimo z $x_1, x_2, \dots, x_n$, kjer je $n$ število podatkov. Aritmetično sredino označimo z $\bar{x}$ (beri »x s črtico«):

$$\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}$$

Če pomnožiš obe strani z $n$, dobiš: **vsota podatkov** $= \bar{x} \cdot n$. To uporabiš, kadar poznaš sredino in iščeš vsoto ali manjkajoči podatek.

**5. Lastnosti.**

- Sredina leži med najmanjšim in največjim podatkom.
- Ni nujno enaka kateremu od podatkov in je lahko decimalno število, tudi če so vsi podatki celi.
- Zelo velik ali zelo majhen podatek jo močno premakne.

:::premisli
Zakaj sredina nikoli ne more biti večja od največjega podatka?
---
Pri pošteni delitvi nihče ne more dobiti več, kot je imel najbogatejši. Če bi bil vsak delež večji od največjega podatka, bi bila vsota deležev večja od vsote podatkov, a vsota se pri delitvi ne spremeni.
:::

**6. Vpliv izstopajočega podatka.** Pet prijateljev dobi na teden $10$, $12$, $8$, $10$ in $60$ evrov žepnine. Vsota je $100$ €, sredina $100 : 5 = 20$ €. A štirje od petih dobijo največ $12$ €. En sam velik podatek je sredino močno dvignil. Zato pri sredini vedno pogledaj tudi podatke same.

## Rešeni primeri

### Primer 1 (lažji)

V enem tednu so opoldne izmerili temperature $12\,^\circ\text{C}$, $15\,^\circ\text{C}$, $9\,^\circ\text{C}$, $14\,^\circ\text{C}$, $10\,^\circ\text{C}$, $13\,^\circ\text{C}$ in $11\,^\circ\text{C}$. Kolikšna je povprečna opoldanska temperatura?

**Podatki:** $7$ meritev: $12$, $15$, $9$, $14$, $10$, $13$, $11\,^\circ\text{C}$; $n = 7$
**Iščemo:** aritmetično sredino $\bar{x}$

:::formula
$\bar{x} = \dfrac{x_1 + x_2 + \dots + x_n}{n}$
:::

**Rešitev:**

1. Seštejemo vse podatke, ker sredina potrebuje vsoto: $12 + 15 + 9 + 14 + 10 + 13 + 11 = 84$.
2. Delimo s številom podatkov, ker smo merili $7$ dni: $\bar{x} = \dfrac{84\,^\circ\text{C}}{7} = 12\,^\circ\text{C}$.
3. Preverimo: $12$ leži med najmanjšim ($9$) in največjim ($15$) podatkom.
4. Odgovor: povprečna opoldanska temperatura je bila $12\,^\circ\text{C}$.

### Primer 2 (srednji)

Učenci razreda so pri testu dobili ocene, zbrane v tabeli. Kolikšna je povprečna ocena?

| Ocena | Število učencev |
|---|---|
| $5$ | $4$ |
| $4$ | $7$ |
| $3$ | $6$ |
| $2$ | $2$ |
| $1$ | $1$ |

**Podatki:** ocena $5$: $4$ učenci, ocena $4$: $7$, ocena $3$: $6$, ocena $2$: $2$, ocena $1$: $1$ učenec
**Iščemo:** povprečno oceno $\bar{x}$

:::formula
$\bar{x} = \dfrac{\text{vsota vseh ocen}}{\text{število učencev}}$; vsako oceno pomnožimo s **frekvenco**, to je s tem, kolikokrat se pojavi.
:::

**Rešitev:**

1. Število podatkov je število učencev, ne število različnih ocen: $n = 4 + 7 + 6 + 2 + 1 = 20$.
2. Vsoto dobimo z množenjem, ker se vsaka ocena ponovi večkrat: $5 \cdot 4 + 4 \cdot 7 + 3 \cdot 6 + 2 \cdot 2 + 1 \cdot 1 = 20 + 28 + 18 + 4 + 1 = 71$.
3. Delimo: $\bar{x} = \dfrac{71}{20} = 3{,}55$.
4. Odgovor: povprečna ocena razreda je $3{,}55$. Ni cela, čeprav so vse ocene cele.

### Primer 3 (težji)

Nika je na štirih testih dosegla povprečno $78$ točk. Koliko točk mora doseči na petem testu, da bo njeno povprečje $80$ točk?

**Podatki:** $n_1 = 4$ testi, $\bar{x}_1 = 78$ točk; $n_2 = 5$ testov, želeno $\bar{x}_2 = 80$ točk
**Iščemo:** število točk na petem testu $x_5$

:::formula
vsota podatkov $= \bar{x} \cdot n$
:::

**Rešitev:**

1. Vsota točk na prvih štirih testih: $78 \cdot 4 = 312$, ker je sredina vsota, deljena s $4$.
2. Želena vsota po petih testih: $80 \cdot 5 = 400$, iz istega razloga.
3. Peti test mora prinesti razliko: $x_5 = 400 - 312 = 88$.
4. Preverimo: $\dfrac{312 + 88}{5} = \dfrac{400}{5} = 80$.
5. Odgovor: Nika mora na petem testu doseči $88$ točk.

### Primer 4: zdaj ti

Pet košarkarjev ima povprečno višino $186\,\text{cm}$. Trener zamenja igralca z višino $178\,\text{cm}$ z igralcem z višino $193\,\text{cm}$. Kolikšna je nova povprečna višina ekipe?

**Podatki:** $n = 5$, $\bar{x} = 186\,\text{cm}$, odide igralec s $178\,\text{cm}$, pride igralec s $193\,\text{cm}$
**Iščemo:** novo povprečno višino $\bar{x}_\text{nova}$

:::formula
vsota podatkov $= \bar{x} \cdot n$, nato $\bar{x}_\text{nova} = \dfrac{\text{nova vsota}}{n}$
:::

**Rešitev:**

1. Vsota višin prej: $186\,\text{cm} \cdot 5 = 930\,\text{cm}$.
2. Nova vsota: $930\,\text{cm} - 178\,\text{cm} + 193\,\text{cm} = 945\,\text{cm}$, ker en igralec odide in drugi pride.
3. Igralcev je še vedno $5$. Izračunaj sam, nato preveri:

:::premisli
Kolikšna je nova povprečna višina?
---
$\bar{x}_\text{nova} = \dfrac{945\,\text{cm}}{5} = 189\,\text{cm}$. Novi igralec je za $15\,\text{cm}$ višji, razlika se razdeli med $5$ igralcev, zato je povprečje višje za $3\,\text{cm}$.
:::

## Pogoste napake

- **»Ničla ni podatek.«** Podatki $4$, $0$, $5$, $3$: učenec izračuna $12 : 3 = 4$, ker ničle ne šteje. Ničla je pravi podatek (npr. tekma brez gola). Popravek: $12 : 4 = 3$.
- **Pri tabeli seštejejo le različne vrednosti.** Učenec izračuna $(5 + 4 + 3 + 2 + 1) : 5 = 3$ in pozabi, koliko učencev ima posamezno oceno. Popravek: vsako vrednost pomnoži s frekvenco in deli s številom vseh podatkov.
- **»Sredina mora biti eden od podatkov ali celo število.«** Povprečno število otrok v družini je lahko $1{,}6$, čeprav nobena družina nima $1{,}6$ otroka. Sredina je rezultat poštene delitve, ne izmerjen podatek.
- **Povprečje povprečij.** Po dveh testih s povprečjem $70$ in tretjem testu s $85$ točkami učenec izračuna $(70 + 85) : 2 = 77{,}5$. A $70$ predstavlja dva testa. Popravek: $(140 + 85) : 3 = 75$.
- **»Sredina je podatek na sredini seznama.«** Pri podatkih $2$, $9$, $4$ na sredini stoji $9$, sredina pa je $15 : 3 = 5$. Popravek: vedno računaj vsoto, deljeno s številom podatkov.

## Povzetek

- Aritmetična sredina: $\bar{x} = \dfrac{x_1 + x_2 + \dots + x_n}{n}$ (vsota podatkov, deljena s številom podatkov).
- Pove, koliko bi dobil vsak, če bi vse razdelili enako; je točka ravnovesja podatkov.
- Vsota odmikov od sredine je $0$.
- Obratno: vsota podatkov $= \bar{x} \cdot n$; tako poiščeš manjkajoči podatek.
- Pri frekvenčni tabeli vsako vrednost pomnoži s frekvenco, deli s skupnim številom podatkov.
- Sredina leži med najmanjšim in največjim podatkom, je lahko decimalna in ni nujno eden od podatkov.
- Izstopajoč podatek sredino močno premakne.

## Drugače: Na sliki

Nariši stolpčni prikaz bonbonov iz uvoda: stolpci visoki $3$, $7$, $4$, $8$ in $3$ kvadratke. Čez vse stolpce potegni vodoravno črto na višini $5$.

Zdaj si predstavljaj, da so kvadratki iz plastelina. Vse, kar sega nad črto, odrežeš: pri Boru $2$ kvadratka, pri Dani $3$, skupaj $5$. S tem zapolniš luknje pod črto: pri Ani manjkata $2$, pri Cenetu $1$, pri Evi $2$, skupaj $5$. Odrezanega je natanko toliko, kolikor je lukenj. Na koncu so vsi stolpci visoki $5$.

Aritmetična sredina je torej **višina, na katero se stolpci izravnajo**, ko vrhove prestaviš v doline. Če bi črto postavil na $6$, bi bilo lukenj več kot odrezanega, pri $4$ pa obratno.

## Drugače: Iz vsakdanjega življenja

Štirje prijatelji gredo na pico. Račun plačajo skupaj, vsak prispeva nekaj: Ana $9$ €, Bor $6$ €, Cene $12$ € in Dana $5$ €. Skupaj $32$ €. Pošteno bi bilo, da vsak plača enako, torej $32 : 4 = 8$ €.

Kdo komu dolguje? Ana je plačala $1$ € preveč, Cene $4$ € preveč. Bor je plačal $2$ € premalo, Dana $3$ € premalo. Preplačanega je $1 + 4 = 5$ €, premalo plačanega pa $2 + 3 = 5$ €. Bor in Dana dasta skupaj $5$ €: Ana dobi $1$ €, Cene $4$ €. Vsak je potem plačal točno sredino.

Podobno deluje povprečna poraba goriva avtomobila ali povprečna hitrost na izletu: dejanske vrednosti nihajo, sredina pa pove, kakšna bi bila vrednost, če bi bila ves čas enaka.

## Drugače: Korak za korakom s številkami

Tehtamo štiri jabolka: $152\,\text{g}$, $148\,\text{g}$, $160\,\text{g}$ in $140\,\text{g}$. Pokažimo dva načina.

**Način A, z vsoto:**

1. Seštej: $152 + 148 + 160 + 140 = 600$.
2. Preštej podatke: $n = 4$.
3. Deli: $600 : 4 = 150$. Povprečna masa je $150\,\text{g}$.

**Način B, z odmiki od ugibane vrednosti:**

1. Ugibaj okroglo vrednost blizu podatkov, npr. $150$.
2. Zapiši odmike: $+2$, $-2$, $+10$, $-10$.
3. Seštej odmike: $0$. Deli s $4$: $0$.
4. Prištej k ugibani vrednosti: $150 + 0 = 150\,\text{g}$.

Če bi ugibal $145$, bi bili odmiki $+7$, $+3$, $+15$, $-5$, vsota $20$, deljeno s $4$ je $5$, in $145 + 5 = 150$. Način B je hiter za računanje na pamet.

## Drugače: Bolj natančno

Zakaj je vsota odmikov vedno $0$? Vsota odmikov je $(x_1 - \bar{x}) + (x_2 - \bar{x}) + \dots + (x_n - \bar{x})$. To je vsota vseh podatkov, zmanjšana za $n \cdot \bar{x}$. Ker je $n \cdot \bar{x}$ ravno vsota podatkov, je rezultat $0$.

Iz tega sledi nekaj pravil:

- Če vsakemu podatku prišteješ isto število $k$, se sredina poveča za $k$. Vsota se poveča za $n \cdot k$, deliš pa z $n$.
- Če dodaš podatek, ki je enak sredini, se sredina ne spremeni, ker je njegov odmik $0$.
- Če dodaš podatek, večji od sredine, se sredina poveča; če manjši, se zmanjša.
- Ker je vsak podatek vsaj tolikšen kot najmanjši, je vsota vsaj $n$-krat najmanjši podatek. Ko deliš z $n$, je sredina vsaj enaka najmanjšemu podatku. Enako razmisliš za največjega.

## Preveri se

? Kako izračunaš aritmetično sredino podatkov?
- Najmanjši in največji podatek sešteješ in deliš z $2$.
~ Tako upoštevaš le dva podatka. Sredina mora upoštevati vse podatke.
- Vzameš podatek, ki stoji na sredini seznama.
~ Položaj v seznamu ni pomemben; seznam lahko zapišeš v poljubnem vrstnem redu.
+ Vsoto vseh podatkov deliš s številom podatkov.
> $\bar{x} = \dfrac{x_1 + x_2 + \dots + x_n}{n}$.

? Ali je povprečno število otrok v skupini družin lahko $1{,}6$?
- Ne, ker nobena družina nima $1{,}6$ otroka.
~ Sredina ni izmerjen podatek, ampak rezultat poštene delitve, zato je lahko decimalna.
+ Da, sredina je lahko decimalna, tudi če so vsi podatki celi.
- Ne, sredina mora biti enaka enemu od podatkov.
~ Sredina ni nujno eden od podatkov: pri $2$, $4$, $9$ je $5$.
> Npr. družine z $1$, $2$, $1$, $2$ in $2$ otrokoma imajo skupaj $8$ otrok, $8 : 5 = 1{,}6$.

? Podatkom dodaš nov podatek, ki je večji od njihove sredine. Kaj se zgodi s sredino?
- Ostane enaka, ker se vsota in število podatkov povečata.
~ Enaka ostane le, če je novi podatek enak sredini. Večji podatek prinese pozitiven odmik.
- Zmanjša se, ker deliš z večjim številom.
~ Deliš res z večjim številom, a tudi vsota se poveča za več kot sredino.
+ Poveča se.
> Novi podatek ima pozitiven odmik od stare sredine, zato se točka ravnovesja premakne proti njemu.

? Nogometna ekipa je na $10$ tekmah dosegla: $0$ golov na $3$ tekmah, $1$ gol na $4$ tekmah, $2$ gola na $2$ tekmah in $3$ gole na $1$ tekmi. Kolikšno je povprečno število golov na tekmo?
- $1{,}5$
~ To je $(0 + 1 + 2 + 3) : 4$; seštel si le različne vrednosti brez frekvenc.
- približno $1{,}6$
~ To je $11 : 7$; tekme brez gola si izpustil. Tudi ničla je podatek.
+ $1{,}1$
> Vsota golov: $0 \cdot 3 + 1 \cdot 4 + 2 \cdot 2 + 3 \cdot 1 = 11$, tekem je $10$, zato $11 : 10 = 1{,}1$.

? Jan ima po dveh testih povprečje $70$ točk. Na tretjem testu dobi $85$ točk. Kolikšno je njegovo novo povprečje?
- $77{,}5$
~ Povprečil si $70$ in $85$, kot da bi bila oba en test. A $70$ predstavlja dva testa.
+ $75$
- Ne da se izračunati, ker ne poznamo točk prvih dveh testov.
~ Posameznih točk ne potrebuješ: iz povprečja dobiš vsoto, $70 \cdot 2 = 140$.
> Vsota prvih dveh testov je $70 \cdot 2 = 140$; nova vsota $140 + 85 = 225$; $225 : 3 = 75$.

:::simboli
\bar{x} | aritmetična sredina (povprečje) | \bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}
x_1, x_2, x_n | podatki | | | x₁ je prvi, xₙ zadnji podatek
n | število podatkov | | | vsota podatkov = x̄ · n
\bar{x}_{\text{nova}} | nova aritmetična sredina | \bar{x}_\text{nova} = \dfrac{\text{nova vsota}}{n} |
:::
