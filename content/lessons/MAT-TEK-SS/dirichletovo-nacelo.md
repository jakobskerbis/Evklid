---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Na mizi leži deset računov iz trgovine, v vrstnem redu, kot jih je natisnila blagajna. Zneski so poljubni: $2{,}37$ €, $1{,}48$ €, $4{,}09$ € in tako naprej. Trditev: med njimi vedno najdeš enega ali več zaporednih računov, katerih skupni znesek ima na zadnjem mestu ničlo, kot na primer $17{,}90$ €.

Na prvi pogled je to nemogoče zagotoviti. Zneskov nihče ni izbral nalašč, kombinacij pa je ogromno. Pa vendar trditev velja za vsakih deset računov. Dokaz je dolg le nekaj vrstic in temelji na opazki, ki jo razume vsak otrok: če je golobov več kot lukenj v golobnjaku, sta v neki luknji vsaj dva goloba.

Tej opazki pravimo **Dirichletovo načelo** (tudi predalčno načelo). Na tekmovanjih je eno najmočnejših orodij za dokaze, da nekaj **zagotovo obstaja**.

## Razlaga

Začnimo s sliko. V $4$ žepe jakne razporedimo $5$ kovancev, kakor koli želimo.

:::risba skica
opis: Štirje žepi, označeni od Ž1 do Ž4. V vsakem žepu je po en kovanec. Peti kovanec je v žepu Ž1, ki ima tako 2 kovanca.
območje: 0; 0 .. 9; 3,6
enota: 34
pravokotnik: 0,3; 0,4 .. 2,1; 2,4 | modra
pravokotnik: 2,5; 0,4 .. 4,3; 2,4 | modra
pravokotnik: 4,7; 0,4 .. 6,5; 2,4 | modra
pravokotnik: 6,9; 0,4 .. 8,7; 2,4 | modra
krog: 1,2; 1 | 0,35 | siva polno
krog: 3,4; 1 | 0,35 | siva polno
krog: 5,6; 1 | 0,35 | siva polno
krog: 7,8; 1 | 0,35 | siva polno
krog: 1,2; 1,8 | 0,35 | oranžna polno
napis: 1,2; 2,9 | Ž1: 2 | sredina
napis: 3,4; 2,9 | Ž2: 1 | sredina
napis: 5,6; 2,9 | Ž3: 1 | sredina
napis: 7,8; 2,9 | Ž4: 1 | sredina
:::

Kovance poskusimo razporediti čim bolj enakomerno. Prvi štirje gredo vsak v svoj žep. Za peti ni več praznega žepa, zato pride k nekemu kovancu. Ne glede na to, kam ga damo, ima neki žep vsaj $2$ kovanca.

Pomembna je beseda **zagotovo**. Sprašujemo, kaj velja pri vsaki razporeditvi, tudi pri najbolj neugodni. Najbolj neugodna je najbolj enakomerna: kovanec, ki ga damo v že polnejši žep, nam le pomaga. Zato vedno razmišljamo o njej. Razporeditev kovancev v $4$ žepe:

| kovanci | najbolj enakomerno | zagotovo vsaj |
|---|---|---|
| $4$ | $1, 1, 1, 1$ | $1$ |
| $5$ | $2, 1, 1, 1$ | $2$ |
| $8$ | $2, 2, 2, 2$ | $2$ |
| $9$ | $3, 2, 2, 2$ | $3$ |
| $13$ | $4, 3, 3, 3$ | $4$ |

Zagotovljeno število zraste takoj za vsakim večkratnikom števila žepov: pri $5$, $9$, $13$.

:::premisli
Koliko kovancev moraš dati v $4$ žepe, da bo v nekem žepu zagotovo vsaj $5$ kovancev? Pojasni tudi, zakaj en kovanec manj ne zadošča.
---
$17$. S $16$ kovanci gre še razporeditev $4, 4, 4, 4$. Sedemnajsti kovanec mora k nekemu žepu s štirimi.
:::

V simulaciji spodaj »Posplošeno Dirichletovo načelo« nastavi $5$ predalov in predmete povečuj od $1$ do $16$. Opazuj, pri katerih številih predmetov se zagotovljeno število poveča: pri $6$, $11$ in $16$.

Pri tekmovalnih nalogah predali niso narisani. Iznajti jih moraš sam, in to je vsa umetnost. Predali morajo biti taki, da dva predmeta v istem predalu že dasta lastnost, ki jo dokazujemo. Zgled: v trgovini izbereš $6$ izdelkov s cenami v celih evrih. Trdimo, da imata dva izdelka ceni, katerih razlika je deljiva s $5$. Predali so ostanki pri deljenju s $5$: $0$, $1$, $2$, $3$, $4$. Šest cen v pet predalov da dve ceni z istim ostankom, njuna razlika pa je deljiva s $5$.

:::premisli
Ali trditev o razliki, deljivi s $5$, velja tudi za samo $5$ izdelkov? Zakaj?
---
Ne. Cene $1$ €, $2$ €, $3$ €, $4$ € in $5$ € imajo pet različnih ostankov, zato nobena razlika ni deljiva s $5$. Predmetov mora biti več kot predalov.
:::

Predali so lahko tudi intervali. Med $11$ izdelki s cenami od $0{,}01$ € do $10{,}00$ € sta zagotovo dva, katerih ceni se razlikujeta za manj kot $1$ €. Cene razdelimo v $10$ predalov: do vključno $1$ €, nad $1$ € do vključno $2$ €, …, nad $9$ € do vključno $10$ €. Dve od $11$ cen padeta v isti predal, zato je njuna razlika manjša od $1$ €.

Šele zdaj zapišimo vse s simboli. Imamo $N$ predmetov in $n$ predalov. Zgornji celi del $\lceil x \rceil$ je najmanjše celo število, ki ni manjše od $x$, na primer $\lceil 2{,}25 \rceil = 3$ in $\lceil 2 \rceil = 2$.

**Posplošeno Dirichletovo načelo:** v nekem predalu je vsaj

$$g = \left\lceil \frac{N}{n} \right\rceil$$

predmetov. Dokaz s protislovjem. Ker je $g$ najmanjše celo število, ki ni manjše od $\frac{N}{n}$, velja $g - 1 < \frac{N}{n}$. Če bi imel vsak predal največ $g - 1$ predmetov, bi jih bilo skupaj manj kot $n \cdot \frac{N}{n} = N$.

Pogosto potrebujemo obrnjeno vprašanje. Z $n \cdot m$ predmeti gre še razporeditev po $m$ v vsak predal. Da bo v nekem predalu zagotovo vsaj $m + 1$ predmetov, je najmanjše potrebno število predmetov

$$N = n \cdot m + 1$$

Še dve posplošitvi. **Povprečje:** med števili $x_1, \dots, x_n$ je vsaj eno večje ali enako njihovemu povprečju in vsaj eno manjše ali enako.

**Neskončna oblika:** če neskončno predmetov razporedimo v končno mnogo predalov, je v nekem predalu neskončno predmetov. Zgled: v vsakem neskončnem zaporedju naravnih števil se neka zadnja števka pojavi neskončnokrat, ker je števk le $10$.

## Rešeni primeri

### Primer 1 (lažji): kovanci iz hranilnika

V hranilniku je veliko kovancev vseh $8$ vrst evrskih kovancev (za $1$, $2$, $5$, $10$, $20$ in $50$ centov ter za $1$ € in $2$ €). Koliko kovancev moraš na slepo stresti iz njega, da imaš zagotovo $3$ kovance iste vrste?

**Podatki:** $8$ vrst kovancev, vsake dovolj; želimo vsaj $3$ iste vrste
**Iščemo:** najmanjše število kovancev $N$

:::formula
$N = n \cdot m + 1$, kjer je $n$ število predalov in $m + 1$ želeno število v enem predalu
:::

**Rešitev:**

1. Predali so vrste kovancev: $n = 8$. Želimo $3 = m + 1$, torej $m = 2$.
2. Najbolj neugodno: po $2$ kovanca vsake vrste, to je $16$ kovancev brez treh enakih. Zato $16$ ni dovolj.
3. $N = 8 \cdot 2 + 1 = 17$: sedemnajsti kovanec je tretji neke vrste.
4. Odgovor: stresti moraš $17$ kovancev.

### Primer 2: cene, ki dajo skupaj 21 €

Na polici je $20$ izdelkov s cenami $1$ €, $2$ €, …, $20$ € (vsaka cena enkrat). Koliko izdelkov moraš izbrati, da sta med njimi zagotovo dva, ki skupaj staneta natanko $21$ €?

**Podatki:** $20$ izdelkov, cene od $1$ € do $20$ €, vse različne; iskana vsota $21$ €
**Iščemo:** najmanjše število izbranih izdelkov $N$

:::formula
Predali so pari cen $\{c, 21 - c\}$; $N = n + 1$
:::

**Rešitev:**

1. Cene združimo v pare z vsoto $21$: $\{1, 20\}$, $\{2, 19\}$, …, $\{10, 11\}$. Predalov je $n = 10$.
2. Če izbereš $11$ izdelkov, sta dva v istem paru, zato skupaj staneta $21$ €.
3. Deset ni dovolj: izdelki od $1$ € do $10$ € dajo največjo vsoto dveh $10 + 9 = 19$ €.
4. Odgovor: izbrati moraš $11$ izdelkov.

### Primer 3 (težji): deset računov

Dokaži trditev iz uvoda: med $10$ računi z zneski v celih centih, ki si sledijo v vrsti, vedno obstaja en račun ali več zaporednih računov, katerih skupni znesek v centih je deljiv z $10$.

**Podatki:** zneski $a_1, a_2, \dots, a_{10}$ v centih, cela števila, v danem vrstnem redu
**Iščemo:** dokaz, da je za neka $i < j$ vsota $a_{i+1} + \dots + a_j$ deljiva z $10$

:::formula
Delne vsote $S_j = a_1 + \dots + a_j$ in $S_j - S_i = a_{i+1} + \dots + a_j$; predali so ostanki pri deljenju z $10$
:::

**Rešitev:**

1. Izračunamo $10$ delnih vsot $S_1, S_2, \dots, S_{10}$. Vsota zaporednih računov je razlika dveh delnih vsot.
2. Če ima katera $S_j$ ostanek $0$, so iskani računi prvi do $j$-ti.
3. Sicer ima vseh $10$ vsot ostanke med $1$ in $9$. To je $10$ predmetov v $9$ predalih, zato imata neki $S_i$ in $S_j$, $i < j$, enak ostanek.
4. Razlika vsot z enakim ostankom je deljiva z $10$, ta razlika pa je ravno $a_{i+1} + \dots + a_j$. S tem je trditev dokazana.
5. Številski zgled. Računi v centih in ostanki delnih vsot:

| $j$ | $a_j$ | $S_j$ | ostanek |
|---|---|---|---|
| $1$ | $237$ | $237$ | $7$ |
| $2$ | $148$ | $385$ | $5$ |
| $3$ | $409$ | $794$ | $4$ |
| $4$ | $512$ | $1306$ | $6$ |
| $5$ | $356$ | $1662$ | $2$ |
| $6$ | $91$ | $1753$ | $3$ |
| $7$ | $274$ | $2027$ | $7$ |
| $8$ | $184$ | $2211$ | $1$ |
| $9$ | $625$ | $2836$ | $6$ |
| $10$ | $718$ | $3554$ | $4$ |

6. Ostanek $7$ se ponovi pri $S_1$ in $S_7$: $S_7 - S_1 = 2027 - 237 = 1790$. Računi od drugega do sedmega skupaj stanejo $17{,}90$ €.
7. Odgovor: takšni zaporedni računi vedno obstajajo; v zgledu so to računi $2$ do $7$.

### Primer 4 – zdaj ti: sto računov

Blagajna je izdala $100$ računov. Vsak znesek je cel evro od $1$ € do $20$ €. Dokaži, da ima vsaj $5$ računov enak znesek. Ali je zagotovljenih tudi $6$ računov z enakim zneskom?

**Podatki:** $N = 100$ računov, zneski so cela števila od $1$ do $20$ (€)
**Iščemo:** zagotovljeno število računov z enakim zneskom $g$; ali je $g \ge 6$

:::formula
$g = \left\lceil \dfrac{N}{n} \right\rceil$
:::

**Rešitev:**

1. Predali so možni zneski: $n = 20$.
2. Predmeti so računi: $N = 100$.
3. Izračunaj $g$ sam in odgovori na drugo vprašanje z najbolj neugodno razporeditvijo:

:::premisli
Koliko je $g$ in ali je zagotovljenih $6$ enakih zneskov?
---
$g = \left\lceil \frac{100}{20} \right\rceil = 5$. Šest ni zagotovljenih: po $5$ računov z vsakim od $20$ zneskov je natanko $100$ računov in noben znesek se ne pojavi šestkrat.
:::

## Pogoste napake

- **Predmetov je toliko kot predalov.** Pri $12$ kupcih in $12$ mesecih imajo lahko vsi rojstni dan v različnih mesecih. Načelo zahteva $N > n$.
- **Manjka $+1$.** V Primeru 1 je odgovor $16$ napačen, ker gre še razporeditev po $2$ kovanca vsake vrste. Najbolj neugodno razporeditev vedno zapiši in ji dodaj en predmet.
- **Spodnji namesto zgornjega celega dela.** Pri $9$ kovancih v $4$ žepih je $\frac{9}{4} = 2{,}25$. Zagotovljeno število je $\lceil 2{,}25 \rceil = 3$, ne $2$.
- **Načelo pove, kateri predal je poln.** Ne pove. Pove le, da tak predal obstaja, ne kateri in ne, da imajo vsi predali toliko.
- **Napačno izbrani predali.** V Primeru 2 predali »soda cena« in »liha cena« ne pomagajo: dve sodi ceni nimata nujno vsote $21$. Dva predmeta v istem predalu morata dati iskano lastnost.

## Povzetek

- Dirichletovo načelo: če je $N$ predmetov v $n$ predalih in $N > n$, ima neki predal vsaj $2$ predmeta.
- Posplošeno: neki predal ima vsaj $\left\lceil \frac{N}{n} \right\rceil$ predmetov.
- Za zagotovljenih $m + 1$ predmetov v istem predalu potrebuješ najmanj $n \cdot m + 1$ predmetov; manj ne zadošča zaradi enakomerne razporeditve.
- »Zagotovo« preverjaš z najbolj neugodno, najbolj enakomerno razporeditvijo.
- Predale iznajdeš sam: ostanki, pari z dano vsoto, intervali, delne vsote.
- Posplošitve: vsaj eno število je večje ali enako povprečju; neskončno predmetov v končno predalih da predal z neskončno predmeti.

## Drugače: Z analogijo

Predstavljaj si nagajivca, ki ti hoče dokazati, da se motiš. Ti trdiš »v nekem predalu bo vsaj $3$«, on pa predmete razporeja tako, da bi trditev podrl. Najboljša strategija nagajivca je enakomernost: vsak predal polni do $2$, dokler ne gre več. Ko so vsi predali polni do $2$, mora naslednji predmet ustvariti trojico. Dirichletovo načelo pove natanko, kdaj nagajivcu zmanjka prostora.

Ista misel s povprečjem: $13$ kovancev v $4$ žepih pomeni povprečno $3{,}25$ kovanca na žep. Vsi žepi ne morejo biti pod povprečjem, sicer bi bila vsota manjša od $13$. Neki žep ima vsaj $3{,}25$ kovanca, in ker je število kovancev celo, vsaj $4$.

## Drugače: Iz vsakdanjega življenja

- **Nogavice v temi.** V predalu so črne in bele nogavice. Tri vzete na slepo dajo zagotovo par iste barve: $2$ barvi sta predala.
- **Kupci in rojstni dnevi.** Med $367$ kupci imata vsaj dva rojstni dan na isti dan, saj ima leto največ $366$ dni.
- **Vračilo drobiža.** Blagajna ima $6$ predalčkov za kovance po vrednostih. Kdor vanje na slepo vrže $13$ kovancev, ima v nekem predalčku zagotovo vsaj $3$, ker je $\lceil \frac{13}{6} \rceil = 3$.
- **Kode na računih.** Kratka kontrolna koda računa ima le omejeno mnogo vrednosti. Računov je več, zato imata nujno dva različna računa isto kodo; koda torej ne more biti povsem edinstvena.

## Preveri se

? Trgovec trdi: »Med $13$ stalnimi kupci imata vsaj dva rojstni dan v istem mesecu.« Kaj so pri tem sklepu predali in kaj predmeti?
- Predali so kupci, predmeti so meseci.
~ Predmete razporejamo v predale. Vsak kupec »pade« v svoj mesec, zato so kupci predmeti.
+ Predali so meseci ($12$), predmeti so kupci ($13$).
- Predali so dnevi v letu, predmeti so kupci.
~ Dni je $365$, več kot kupcev, zato taki predali ne dajo ničesar. Trditev govori o mesecih.
> $13$ kupcev v $12$ mesecih: ker je $13 > 12$, imata dva kupca isti mesec.

? Razvrsti primere od najmanjšega do največjega zagotovljenega števila predmetov v nekem predalu.
1. $5$ kovancev v $4$ žepih
2. $7$ računov v $3$ mapah
3. $20$ kupcev v $6$ delovnih dneh
4. $9$ kovancev v $2$ žepih
> Zagotovljena števila so $\lceil \frac{5}{4} \rceil = 2$, $\lceil \frac{7}{3} \rceil = 3$, $\lceil \frac{20}{6} \rceil = 4$ in $\lceil \frac{9}{2} \rceil = 5$.

? Kaj se zgodi v Primeru 2, če so na polici izdelki s cenami od $1$ € do $21$ € in iščemo dva s skupno ceno $22$ €? Koliko izdelkov moraš potem izbrati?
- $11$
~ Parov z vsoto $22$ je še vedno $10$, a cena $11$ € nima para in je sama svoj predal. Predalov je $11$.
+ $12$
- $21$
~ To so vsi izdelki na polici, toliko jih ni treba vzeti. Predali so pari, zato zadošča en izdelek več, kot je predalov.
> Pari $\{1, 21\}$, …, $\{10, 12\}$ in sama cena $11$ € dajo $11$ predalov. Z $11$ izdelki gre še $1$ € do $11$ €, dvanajsti pa zapre par.

? Na sliki je $9$ kovancev v $5$ predalih. Koliko kovancev moraš še dodati, kamor koli jih že daš, da bodo v nekem predalu zagotovo vsaj $3$ kovanci?
:::risba skica
opis: Pet predalov P1 do P5. V predalih P1, P2, P3 in P4 sta po 2 kovanca, v predalu P5 je 1 kovanec. Skupaj 9 kovancev.
območje: 0; 0 .. 10; 3,6
enota: 30
pravokotnik: 0,2; 0,3 .. 1,8; 2,4 | modra
pravokotnik: 2,2; 0,3 .. 3,8; 2,4 | modra
pravokotnik: 4,2; 0,3 .. 5,8; 2,4 | modra
pravokotnik: 6,2; 0,3 .. 7,8; 2,4 | modra
pravokotnik: 8,2; 0,3 .. 9,8; 2,4 | modra
krog: 1; 0,8 | 0,3 | siva polno
krog: 1; 1,6 | 0,3 | siva polno
krog: 3; 0,8 | 0,3 | siva polno
krog: 3; 1,6 | 0,3 | siva polno
krog: 5; 0,8 | 0,3 | siva polno
krog: 5; 1,6 | 0,3 | siva polno
krog: 7; 0,8 | 0,3 | siva polno
krog: 7; 1,6 | 0,3 | siva polno
krog: 9; 0,8 | 0,3 | siva polno
napis: 1; 3 | P1: 2 | sredina
napis: 3; 3 | P2: 2 | sredina
napis: 5; 3 | P3: 2 | sredina
napis: 7; 3 | P4: 2 | sredina
napis: 9; 3 | P5: 1 | sredina
:::
= 2
~ 1 | Če ga daš v predal P5, imajo vsi predali po $2$ kovanca in nobeden $3$.
~ 6 | Toliko jih potrebuješ, da bi imel vsak predal $3$. Iščemo le en tak predal.
> Za zagotovljene $3$ v $5$ predalih potrebuješ $5 \cdot 2 + 1 = 11$ kovancev, torej še $11 - 9 = 2$.

? Najmanj koliko kupcev mora priti v trgovino, da imajo zagotovo vsaj $4$ kupci rojstni dan na isti dan v tednu?
= 22
~ 21 | Z $21$ kupci gre še razporeditev po $3$ na vsak dan v tednu. Dodaj enega.
~ 28 | Z $28$ kupci res dobiš $4$, a iščemo najmanjše število. Že $22$ zadošča.
~ 8 | Toliko jih potrebuješ za $2$ na isti dan. Za $4$ potrebuješ $7 \cdot 3 + 1$.
> $N = n \cdot m + 1 = 7 \cdot 3 + 1 = 22$.

<<RACUN
vrednost: 4*4+1 | 17
vrednost: ceiling(9/4) | 3
vrednost: ceiling(13/4) | 4
vrednost: 8*2+1 | 17
vrednost: 10+1 | 11
vrednost: 10+9 | 19
vrednost: 237+148+409+512+356+91+274 | 2027
vrednost: 237+148+409+512+356+91+274+184+625+718 | 3554
vrednost: Mod(2027, 10) | 7
vrednost: Mod(237, 10) | 7
vrednost: 148+409+512+356+91+274 | 1790
vrednost: 2027-237 | 1790
vrednost: ceiling(100/20) | 5
vrednost: ceiling(13/6) | 3
vrednost: ceiling(20/6) | 4
vrednost: ceiling(9/2) | 5
vrednost: 5*2+1-9 | 2
vrednost: 7*3+1 | 22
>>

:::simboli
N | število predmetov | | | v Primerih 1 in 2 najmanjše potrebno število
n | število predalov | | |
g | zagotovljeno število predmetov v nekem predalu | g = \left\lceil \frac{N}{n} \right\rceil | | $\lceil x \rceil$ je zgornji celi del
m | število predmetov v vsakem predalu pri najbolj neugodni razporeditvi | N = n \cdot m + 1 | | želimo $m + 1$ v istem predalu
c | cena izdelka v evrih | | | par $\{c, 21 - c\}$
a_1, a_{i+1}, a_j | znesek prvega, $(i+1)$-tega oziroma $j$-tega računa v centih | | |
S_i, S_j | delna vsota prvih $i$ oziroma $j$ računov | S_j = a_1 + \dots + a_j | |
i, j | zaporedni številki računov, $i < j$ | | |
:::
