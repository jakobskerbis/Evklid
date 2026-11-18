---
stanje: osnutek
demo: ulomki
avtor: AI
---

## Zakaj se tega učimo

Pisarji v starem Egiptu so merili žito, moko in sestavine za zdravila s posodo, ki so ji rekli hekat. Za zdravila so pogosto potrebovali le del mere. Zato so imeli posebne znake za polovico, četrtino, osmino in še manjše dele, vse do $\dfrac{1}{64}$ mere.

Pri takem delu se hitro pojavi vprašanje. Pomočnik odmeri dve četrtini mere. Ali je to isto kot ena polovica? Dobi bolnik enako zdravila? Odgovor je da: isto količino lahko zapišemo z različnimi ulomki.

Danes rešuje enako vprašanje medicinska sestra, ki tableto prelomi po zarezah, ali farmacevt, ki sirup odmeri z merilno žličko. Ko znaš ulomek razširiti in skrajšati, hitro prepoznaš, kdaj dva različna zapisa pomenita isto. To boš potreboval tudi pri primerjanju ulomkov in pri seštevanju ulomkov z različnimi imenovalci.

## Razlaga

**Trakovi, ki jih režemo.** Predstavljaj si štiri enako dolge trakove papirja, enega pod drugim. Vsak trak je ena cela tableta. Prvega razrežemo na $2$ enaka dela, drugega na $4$, tretjega na $6$, četrtega na $8$. Na vsakem pobarvamo nekaj kosov od leve proti desni:

| Trak razrežemo na | Pobarvamo | Zapis |
|---|---|---|
| $2$ dela | $1$ del | $\dfrac{1}{2}$ |
| $4$ dele | $2$ dela | $\dfrac{2}{4}$ |
| $6$ delov | $3$ dele | $\dfrac{3}{6}$ |
| $8$ delov | $4$ dele | $\dfrac{4}{8}$ |

Na vseh štirih trakovih se pobarvani del konča na isti navpični črti, točno na sredini. Pobarvana dolžina je enaka. Razlikujeta se le velikost in število kosov.

**Ista točka na premici.** Enako vidiš na številski premici od $0$ do $1$. Ulomki $\dfrac{1}{2}$, $\dfrac{2}{4}$, $\dfrac{3}{6}$ in $\dfrac{4}{8}$ padejo v isto točko. Ulomkom, ki predstavljajo isti del celote, rečemo **enakovredni ulomki**. Imajo isto vrednost, a različen zapis.

:::premisli
Na premici označiš $\dfrac{3}{4}$. Ali bo $\dfrac{6}{8}$ levo od te točke, desno od nje ali na isti točki? Napovej, preden bereš naprej.
---
Na isti točki. Če vsako četrtino prerežeš na pol, dobiš osmine. Tri četrtine so tako šest osmin, dolžina se ne spremeni.
:::

**Razširjanje: kose prerežemo.** Vzemi trak z $\dfrac{2}{4}$ in vsak kos prereži na $3$ manjše. Kosov je zdaj $4 \cdot 3 = 12$, pobarvanih $2 \cdot 3 = 6$. Pobarvana dolžina je ostala ista, zato $\dfrac{2}{4} = \dfrac{6}{12}$. Število vseh kosov in število pobarvanih se je pomnožilo z istim številom. Temu rečemo **razširjanje** ulomka.

**Krajšanje: kose zlepimo.** Pot gre tudi nazaj. Pri $\dfrac{6}{12}$ lahko zlepimo po $2$ sosednja kosa in dobimo $\dfrac{3}{6}$. Lahko pa zlepimo po $6$ kosov in dobimo $\dfrac{1}{2}$. To je **krajšanje**.

Po $4$ kose pa pri $\dfrac{6}{12}$ ne gre. Vseh $12$ kosov bi sicer razdelili v $3$ skupine, pobarvanih $6$ pa ne: ena skupina bi bila napol pobarvana. Zato krajšamo samo s **skupnim deliteljem** števca in imenovalca.

**Okrajšan ulomek.** Ko kosov ne moremo več zlepiti, je ulomek **okrajšan**. Števec in imenovalec takrat nimata skupnega delitelja, večjega od $1$ (sta tuji števili). Ulomek $\dfrac{1}{2}$ je okrajšan, $\dfrac{6}{12}$ ni. Najhitreje pridemo do okrajšanega ulomka, če lepimo po toliko kosov, kolikor je največji skupni delitelj: $D(6, 12) = 6$, zato v enem koraku dobimo $\dfrac{1}{2}$.

:::premisli
Ulomek $\dfrac{12}{18}$ skrajšaš z $2$ in dobiš $\dfrac{6}{9}$. Ali je to že okrajšan ulomek? Zakaj?
---
Ne. Števili $6$ in $9$ sta še deljivi s $3$, zato $\dfrac{6}{9} = \dfrac{2}{3}$. Število $2$ je skupni delitelj, ni pa največji: $D(12, 18) = 6$. Z deljenjem s $6$ bi bil v enem koraku pri $\dfrac{2}{3}$.
:::

V simulaciji spodaj (»Razširjanje in krajšanje ulomkov«) nastavi števec $3$ in imenovalec $4$, nato klikni »Razširi z 2«. Opazuj pobarvani del kroga in točko na številski premici: oba ostaneta na mestu, spremenita se le število in velikost kosov. Nato nastavi $\dfrac{8}{12}$ in klikni »Okrajšaj«.

**Zapis s simboli.** Kar smo delali s trakovi, zapišemo na kratko. Razširjanje s številom $n \ne 0$:

$$\frac{a}{b} = \frac{a \cdot n}{b \cdot n}$$

Krajšanje s skupnim deliteljem $n$ števca in imenovalca:

$$\frac{a}{b} = \frac{a : n}{b : n}$$

Na primer $\dfrac{3}{5} = \dfrac{3 \cdot 4}{5 \cdot 4} = \dfrac{12}{20}$ in $\dfrac{12}{18} = \dfrac{12 : 6}{18 : 6} = \dfrac{2}{3}$. Vrednost ulomka ostane ista, spremeni se le zapis. Z istim številom vedno množimo ali delimo **oba**, števec in imenovalec.

## Rešeni primeri

### Primer 1: oznaka na infuziji

Na steklenici z infuzijo je lestvica z $20$ enakimi razdelki. Bolnik naj prejme $\dfrac{3}{4}$ vsebine. Koliko razdelkov tekočine mora odteči?

**Podatki:** delež $\dfrac{3}{4}$ steklenice, lestvica z $20$ enakimi razdelki
**Iščemo:** število razdelkov $x$, da je $\dfrac{3}{4} = \dfrac{x}{20}$

:::formula
Razširjanje: $\dfrac{a}{b} = \dfrac{a \cdot n}{b \cdot n}$
:::

**Rešitev:**

1. Imenovalec $4$ mora postati $20$, zato $n = 20 : 4 = 5$. Vsako četrtino si mislimo razrezano na $5$ razdelkov.
2. Z istim številom pomnožimo števec, da se vrednost ne spremeni: $x = 3 \cdot 5 = 15$.
3. Zapis: $\dfrac{3}{4} = \dfrac{15}{20}$.
4. Preizkus s krajšanjem: $\dfrac{15 : 5}{20 : 5} = \dfrac{3}{4}$.
5. Odgovor: odteči mora $15$ od $20$ razdelkov.

### Primer 2: kočniki

Odrasel človek ima $32$ stalnih zob, od tega $12$ kočnikov. Kolikšen del vseh zob so kočniki? Zapiši z okrajšanim ulomkom.

**Podatki:** vseh stalnih zob je $32$, kočnikov je $12$
**Iščemo:** delež kočnikov kot okrajšan ulomek

:::formula
Krajšanje z največjim skupnim deliteljem: $\dfrac{a}{b} = \dfrac{a : D(a, b)}{b : D(a, b)}$
:::

**Rešitev:**

1. Delež je $\dfrac{12}{32}$: kočniki v števcu, vsi zobje v imenovalcu.
2. Razcep na prafaktorje: $12 = 2^2 \cdot 3$ in $32 = 2^5$.
3. Skupni prafaktor je samo $2$, z manjšim eksponentom $2$, zato $D(12, 32) = 2^2 = 4$.
4. Oba delimo s $4$: $\dfrac{12 : 4}{32 : 4} = \dfrac{3}{8}$.
5. Števili $3$ in $8$ sta tuji, zato je $\dfrac{3}{8}$ okrajšan ulomek.
6. Odgovor: kočniki so $\dfrac{3}{8}$ vseh stalnih zob.

### Primer 3: dva dneva krvodajalske akcije

Na krvodajalski akciji je prvi dan od $45$ krvodajalcev $18$ imelo krvno skupino A. Drugi dan jih je skupino A imelo $24$ od $60$. Ali je bil delež krvodajalcev s skupino A oba dneva enak?

**Podatki:** prvi dan $18$ od $45$ krvodajalcev, drugi dan $24$ od $60$ krvodajalcev
**Iščemo:** ali sta deleža $\dfrac{18}{45}$ in $\dfrac{24}{60}$ enakovredna

:::formula
Dva ulomka sta enakovredna, če ju skrajšamo do istega okrajšanega ulomka.
:::

**Rešitev:**

1. Deleža zapišemo kot ulomka $\dfrac{18}{45}$ in $\dfrac{24}{60}$. Imenovalca sta različna, zato ju ne moremo primerjati kar na pogled.
2. Prvi dan: $18 = 2 \cdot 3^2$ in $45 = 3^2 \cdot 5$, zato $D(18, 45) = 9$ in $\dfrac{18 : 9}{45 : 9} = \dfrac{2}{5}$.
3. Drugi dan: $24 = 2^3 \cdot 3$ in $60 = 2^2 \cdot 3 \cdot 5$, zato $D(24, 60) = 12$ in $\dfrac{24 : 12}{60 : 12} = \dfrac{2}{5}$.
4. Okrajšana ulomka sta enaka, zato sta deleža enakovredna.
5. Odgovor: da, oba dneva sta skupino A imela $2$ od vsakih $5$ krvodajalcev.

### Primer 4 – zdaj ti

Novorojenček prespi približno $16$ ur na dan. Kolikšen del dneva ($24$ ur) je to? Zapiši z okrajšanim ulomkom.

**Podatki:** spanec $16$ ur, dan ima $24$ ur
**Iščemo:** delež dneva kot okrajšan ulomek

:::formula
$\dfrac{a}{b} = \dfrac{a : D(a, b)}{b : D(a, b)}$
:::

**Rešitev:**

1. Delež dneva je $\dfrac{16}{24}$.
2. Razcep: $16 = 2^4$ in $24 = 2^3 \cdot 3$, zato $D(16, 24) = 2^3 = 8$.
3. Skrajšaj sam, nato preveri:

:::premisli
Kateri okrajšan ulomek dobiš iz $\dfrac{16}{24}$?
---
$\dfrac{16 : 8}{24 : 8} = \dfrac{2}{3}$. Novorojenček prespi približno dve tretjini dneva.
:::

## Pogoste napake

- **Pomnožen samo imenovalec.** »Potrebujem dvanajstine, torej $\dfrac{2}{3} = \dfrac{2}{12}$.« Kose si tako zmanjšal, njihovega števila pa nisi povečal. $\dfrac{2}{12}$ je le četrtina vrednosti $\dfrac{2}{3}$. Popravek: kar narediš z imenovalcem, naredi tudi s števcem, $\dfrac{2}{3} = \dfrac{8}{12}$.
- **Prištevanje namesto množenja.** »Obema prištejem $2$: $\dfrac{1}{2} = \dfrac{3}{4}$.« Na traku pa $\dfrac{3}{4}$ pokrije več kot $\dfrac{1}{2}$. Razširjanje pomeni, da vsak kos prerežemo na enako število delov, to pa je množenje. Popravek: razširjaj z množenjem, krajšaj z deljenjem.
- **Krajšanje seštevancev.** Pri $\dfrac{2 + 3}{2 + 5}$ učenec prečrta obe dvojki in dobi $\dfrac{3}{5}$. Toda $\dfrac{2 + 3}{2 + 5} = \dfrac{5}{7}$, kar ni $\dfrac{3}{5}$. Krajšaš lahko le, če *celoten* števec in *celoten* imenovalec deliš z istim številom.
- **Prezgodnja ustavitev.** $\dfrac{24}{36} = \dfrac{12}{18}$ je pravilno, a ulomek še ni okrajšan. Popravek: deli z $D(24, 36) = 12$ in dobiš $\dfrac{2}{3}$, ali pa po vsakem koraku preveri, ali imata števili še skupni delitelj.
- **Večja števila, večji ulomek.** »$\dfrac{15}{20}$ je več kot $\dfrac{3}{4}$, ker sta števili večji.« Na traku pokrijeta isto dolžino, le kosi so manjši. Popravek: vrednosti primerjaj po okrajšanem ulomku.

## Povzetek

- Enakovredni ulomki imajo isto vrednost, različen zapis. Na traku ali številski premici pokrijejo isto dolžino.
- Razširjanje: števec in imenovalec pomnožimo z istim številom ($\ne 0$).
- Krajšanje: števec in imenovalec delimo z istim skupnim deliteljem.
- Okrajšan ulomek nima skupnega delitelja števca in imenovalca, večjega od $1$.
- Do okrajšanega ulomka pridemo z deljenjem z največjim skupnim deliteljem.
- Enakovrednost dveh ulomkov preverimo tako, da ju skrajšamo do okrajšanih ulomkov.

## Drugače: Z analogijo

Isto sliko lahko narišeš z velikimi ali z drobnimi kvadratki (piksli). Vzemi zastavico, ki je na levi polovici rdeča, na desni bela. Narišeš jo lahko z $2$ velikima kvadratkoma: rdeč je $1$ od $2$.

Če vsak kvadratek razdeliš na $4$ manjše, imaš $8$ kvadratkov. Rdeči so $4$ od $8$. Slika je ista, le mreža je finejša: $\dfrac{1}{2} = \dfrac{4}{8}$. To je razširjanje.

Krajšanje je obratna pot: majhne kvadratke združuješ v večje. Smeš pa jih združiti le tako, da noben večji kvadratek ni pol rdeč in pol bel. Okrajšan ulomek je najbolj groba mreža, ki sliko še pokaže brez napake.

Primerjava ima mejo: pri sliki kvadratek delimo v mrežo, pri ulomku pa kos razrežemo na poljubno število enakih delov.

## Drugače: Iz vsakdanjega življenja

**Čokolada.** Tablica ima $12$ kock. Če poješ $6$ kock, si pojedel $\dfrac{6}{12}$ tablice, to je pol tablice. Ko prijatelju poveš »pojedel sem polovico«, si ulomek skrajšal:

$$\frac{6}{12} = \frac{6 : 6}{12 : 6} = \frac{1}{2}$$

**Ura.** $30$ minut od $60$ je $\dfrac{30}{60} = \dfrac{1}{2}$ ure. $15$ minut je $\dfrac{15}{60} = \dfrac{1}{4}$ ure. Tako vsak dan krajšaš ulomke, ne da bi se tega zavedal.

**Recept.** Recept zahteva $\dfrac{1}{2}$ skodelice moke, ti pa imaš samo merico za $\dfrac{1}{4}$ skodelice. Ulomek razširiš: $\dfrac{1}{2} = \dfrac{2}{4}$, torej moraš dvakrat zajeti z merico.

## Drugače: Korak za korakom s številkami

Krajšanje ulomka $\dfrac{18}{48}$ s pravili deljivosti:

| Korak | Kaj naredimo | Rezultat |
|---|---|---|
| 1 | Obe števili sta sodi, zato delimo z $2$. | $\dfrac{9}{24}$ |
| 2 | Vsota števk je pri $9$ enaka $9$, pri $24$ pa $6$. Obe sta deljivi s $3$. | $\dfrac{3}{8}$ |
| 3 | $3$ in $8$ nimata skupnega delitelja, večjega od $1$. | okrajšan |

V enem koraku: $D(18, 48) = 6$, zato $\dfrac{18 : 6}{48 : 6} = \dfrac{3}{8}$.

## Drugače: Bolj natančno

Zakaj se vrednost ulomka pri razširjanju ne spremeni? Ulomek $\dfrac{a}{b}$ je količnik $a : b$. Količnik se ne spremeni, če deljenec in delitelj pomnožimo z istim številom $n \ne 0$:

$$\frac{a \cdot n}{b \cdot n} = \frac{a}{b} \cdot \frac{n}{n} = \frac{a}{b} \cdot 1$$

Ulomek $\dfrac{n}{n}$ je enak $1$, množenje z $1$ pa vrednosti ne spremeni.

Dva ulomka $\dfrac{a}{b}$ in $\dfrac{c}{d}$ sta enakovredna natanko tedaj, ko je $a \cdot d = b \cdot c$. Za ulomka iz Primera 3 je $18 \cdot 60 = 1080$ in $45 \cdot 24 = 1080$. Produkta sta enaka, zato sta ulomka enakovredna, kar se ujema s krajšanjem.

## Preveri se

? Števec in imenovalec ulomka pomnožimo s $3$. Kaj se zgodi z vrednostjo ulomka?
- Potroji se.
~ Potrojila bi se, če bi s $3$ pomnožil samo števec. Ker pomnožiš tudi imenovalec, so kosi trikrat manjši, a jih je trikrat več.
+ Ostane enaka.
- Zmanjša se na tretjino.
~ Na tretjino bi se zmanjšala, če bi s $3$ pomnožil samo imenovalec. Ker pomnožiš tudi števec, se učinka izničita.
- Poveča se za $3$.
~ Množenje ni prištevanje. Ker pomnožiš oba dela z istim številom, se vrednost sploh ne spremeni.
> To je razširjanje: $\dfrac{a \cdot 3}{b \cdot 3} = \dfrac{a}{b}$. Vsak kos razrežemo na $3$ dele, zato je kosov trikrat več, a so trikrat manjši.

? Trije ulomki so enakovredni $\dfrac{2}{5}$, eden ne spada zraven. Kateri?
- $\dfrac{4}{10}$
~ $\dfrac{4}{10}$ je $\dfrac{2}{5}$, razširjen z $2$, zato spada zraven.
- $\dfrac{14}{35}$
~ $14 = 2 \cdot 7$ in $35 = 5 \cdot 7$. To je $\dfrac{2}{5}$, razširjen s $7$; neobičajen faktor te ne sme zmesti.
+ $\dfrac{6}{12}$
- $\dfrac{10}{25}$
~ Skrajšaj s $5$ in dobiš $\dfrac{2}{5}$. Spada zraven.
> $\dfrac{4}{10}$, $\dfrac{14}{35}$ in $\dfrac{10}{25}$ se skrajšajo na $\dfrac{2}{5}$. Ulomek $\dfrac{6}{12}$ pa se skrajša na $\dfrac{1}{2}$: števec je $3 \cdot 2$, imenovalec pa ni $3 \cdot 5 = 15$.

? Luka krajša $\dfrac{36}{48}$. (1) Deli z $2$ in dobi $\dfrac{18}{24}$. (2) Deli s $3$ in dobi $\dfrac{6}{8}$. (3) Zapiše, da je $\dfrac{6}{8}$ okrajšan ulomek. Kateri korak je napačen?
- Korak 1
~ $36 : 2 = 18$ in $48 : 2 = 24$. Obe števili sta sodi, zato je deljenje z $2$ dovoljeno.
- Korak 2
~ $18 : 3 = 6$ in $24 : 3 = 8$. Tudi $3$ je skupni delitelj, korak je pravilen.
+ Korak 3
- Noben, vse je prav.
~ Števili $6$ in $8$ sta še obe sodi, zato ulomek še ni okrajšan.
> $6$ in $8$ imata skupni delitelj $2$, zato $\dfrac{6}{8} = \dfrac{3}{4}$. V enem koraku: $D(36, 48) = 12$ in $\dfrac{36 : 12}{48 : 12} = \dfrac{3}{4}$.

? Okrajšaj ulomek $\dfrac{42}{56}$.
- $\dfrac{21}{28}$
~ Skrajšal si z $2$, a $21$ in $28$ sta še deljivi s $7$. Ulomek še ni okrajšan.
- $\dfrac{6}{8}$
~ Skrajšal si s $7$, a $6$ in $8$ sta še sodi. Ulomek še ni okrajšan.
- $\dfrac{7}{8}$
~ Števec si delil s $6$, imenovalec pa s $7$. Oba moraš deliti z istim številom, sicer se vrednost spremeni.
+ $\dfrac{3}{4}$
> $42 = 2 \cdot 3 \cdot 7$ in $56 = 2^3 \cdot 7$, zato $D(42, 56) = 2 \cdot 7 = 14$ in $\dfrac{42 : 14}{56 : 14} = \dfrac{3}{4}$.

? Zdravnik predpiše $\dfrac{6}{8}$ merilne žličke sirupa. Na žlički so oznake le za četrtine. Do katere oznake naliješ sirup?
- do oznake $\dfrac{2}{4}$
~ Od števca in imenovalca si odštel $4$. Odštevanje spremeni vrednost: $\dfrac{2}{4}$ je le pol žličke, manj kot predpisano.
+ do oznake $\dfrac{3}{4}$
- do oznake $\dfrac{6}{4}$
~ Imenovalec si spremenil, števec pa prepisal. $\dfrac{6}{4}$ je več kot cela žlička in dvakrat več od predpisanega odmerka.
> $\dfrac{6}{8}$ skrajšamo z $2$: $\dfrac{6 : 2}{8 : 2} = \dfrac{3}{4}$. Sirup naliješ do oznake za tri četrtine.

:::simboli
a | števec | |
b | imenovalec | | | b ≠ 0
n | število, s katerim razširimo ali krajšamo | | | n ≠ 0; pri krajšanju skupni delitelj a in b
D | največji skupni delitelj | | | krajšanje z D(a, b) da okrajšani ulomek
:::
