---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Odpri na telefonu aplikacijo z osciloskopom za zvok (na primer phyphox) in zažvižgaj. Na zaslonu se izriše val. Ko žvižgaš glasneje, je val višji. Ko žvižgaš višji ton, je val gostejši: v enakem času je valov več.

**Napoved.** Graf $y = \sin x$ je tak val. Eden od zapisov $y = 2\sin x$ in $y = \sin 2x$ opiše glasnejši žvižg, drugi višji ton. Kateri je kateri? Zapiši si odgovor; v 5. razdelku ga preveriš.

Iz prejšnje lekcije veš, da se vrednosti sinusa in kosinusa ponovijo po vsakem polnem obratu. Ko znaš njun val raztegniti, skrčiti in premakniti, z eno formulo opišeš zvok, utripanje lučke na telefonu ali nihanje vzmeti.

## Razlaga

**1. Od krožnice do grafa.** Točka $P$ kroži po enotski krožnici. Njena navpična koordinata je $\sin x$, kjer je $x$ kot v radianih. Na vodoravno os nanašamo kot $x$, na navpično pa višino točke. Kot zdaj označimo z $x$, ker ga nanašamo na os $x$; $x$ torej ni več abscisa točke $P$.

:::risba graf
opis: Levo je enotska krožnica s točko P pri kotu x = 3π/4; kot x je označen z lokom ob središču. Višina točke P nad vodoravnim premerom je sin x ≈ 0,71. Vodoravna črtkana črta vodi od P do točke (3π/4; 0,71) na grafu y = sin x desno: graf je pri kotu 3π/4 enako visoko kot točka P. Graf je narisan za x od 0 do 2π.
x: -2,7 .. 6,6 | 1,5708 | x
y: -1,3 .. 1,5 | 0,5 | y
enako: da
mreža: ne
oznake: ne
oznakax: 2,3562 | 3π/4
oznakax: 6,2832 | 2π
krog: -1,5; 0 | 1 | siva
črta: -1,5; 0 -> -2,2071; 0,7071 | debelo
črta: -1,2; 0 -> -1,21; 0,078 -> -1,24; 0,15 -> -1,288; 0,212 -> -1,35; 0,26 -> -1,422; 0,29 -> -1,5; 0,3 -> -1,578; 0,29 -> -1,65; 0,26 -> -1,712; 0,212
napis: -1,13; 0,42 | x | sredina
črta: -2,2071; 0 -> -2,2071; 0,7071 | oranžna debelo
črta: -2,2071; 0,7071 -> 2,3562; 0,7071 | oranžna črtkano
črta: 2,3562; 0 -> 2,3562; 0,7071 | oranžna debelo
f: sin(x) | modra | 0 .. 6,2832
točka: -2,2071; 0,7071 | P | nad levo
točka: 2,3562; 0,7071
črta: -0,08; 1 -> 0,08; 1
črta: -0,08; -1 -> 0,08; -1
napis: 0,12; 1,25 | 1 | desno
napis: 0,1; -1 | −1 | desno
podnapis: Višina točke P na krožnici je višina grafa pri istem kotu x
:::

Na sliki je $P$ pri kotu $x = \frac{3\pi}{4}$. Njena višina $\sin\frac{3\pi}{4} \approx 0{,}71$ je hkrati višina grafa nad $\frac{3\pi}{4}$. Ko $P$ kroži naprej, se ta višina spreminja gladko, zato je tudi graf gladek val in ne lomljenka. Nekaj vrednosti:

| $x$ | $\sin x$ | $\cos x$ |
|---|---|---|
| $0$ | $0$ | $1$ |
| $\frac{\pi}{2}$ | $1$ | $0$ |
| $\pi$ | $0$ | $-1$ |
| $\frac{3\pi}{2}$ | $-1$ | $0$ |
| $2\pi$ | $0$ | $1$ |

Točke povežemo z gladko krivuljo. Dobimo **sinusoido**: val, ki se dvigne do $1$, pade do $-1$ in se vrne na $0$.

:::risba graf
opis: Graf funkcije y = sin x za x od 0 do 2π. Val gre skozi pet točk: ničla (0; 0), vrh (π/2; 1), ničla (π; 0), dno (3π/2; −1) in ničla (2π; 0).
x: -0,4 .. 6,9 | 1,5708 | x
y: -1,5 .. 1,5 | 0,5 | y
oznake: ne
oznakax: 1,5708 | π/2
oznakax: 3,1416 | π
oznakax: 4,7124 | 3π/2
oznakax: 6,2832 | 2π
oznakay: 1 | 1
oznakay: -1 | −1
f: sin(x) | modra | 0 .. 6,2832
točka: 0; 0
točka: 1,5708; 1 | vrh | nad
točka: 3,1416; 0
točka: 4,7124; -1 | dno | pod
točka: 6,2832; 0
podnapis: Ena perioda sinusa: ničla, vrh, ničla, dno, ničla
:::

Na sliki je pet točk iz tabele. Med zaporednima je vedno $\frac{\pi}{2}$, četrtina obrata.

V simulaciji spodaj (»Od enotske krožnice do grafa«) počasi povečuj kot od $0^\circ$ do $360^\circ$ (to je od $0$ do $2\pi$). Opazuj, kako višina točke na krožnici sproti riše graf. Pri katerem kotu je graf najvišje?

*Preveri:* pri katerem $x$ med $0$ in $2\pi$ je $\sin x$ najmanjši? *Odgovor:* pri $\frac{3\pi}{2}$, kjer je $\sin x = -1$.

**2. Perioda.** Funkcija je **periodična**, če se njene vrednosti ponavljajo: obstaja število $T > 0$, da je $f(x + T) = f(x)$ za vsak $x$. Najmanjše tako število je **osnovna perioda**. Za sinus in kosinus je osnovna perioda $2\pi$, ker je to en poln obrat. Manjša ne more biti: vrednost $1$ doseže sinus v enem obratu samo enkrat, pri $\frac{\pi}{2}$.

*Preveri:* ali je $4\pi$ tudi perioda sinusa? *Odgovor:* je, ker sta to dva obrata, a ni osnovna perioda.

**3. Lastnosti osnovnih grafov.**

| | $\sin x$ | $\cos x$ |
|---|---|---|
| zaloga vrednosti | $[-1, 1]$ | $[-1, 1]$ |
| ničle | $k\pi$ | $\frac{\pi}{2} + k\pi$ |
| maksimum $1$ pri | $\frac{\pi}{2} + 2k\pi$ | $2k\pi$ |

Tu je $k$ poljubno celo število. Graf kosinusa ima enako obliko kot graf sinusa, le premaknjen je za $\frac{\pi}{2}$ v levo: vrh ima pri $0$, sinus pa šele pri $\frac{\pi}{2}$.

:::risba graf
opis: Grafa y = sin x (polna črta) in y = cos x (črtkana črta) za x od približno −1,9 do 6,9. Kosinus ima vrh pri 0, sinus pri π/2. Puščica dolžine π/2 kaže od vrha sinusa v levo do vrha kosinusa.
x: -1,9 .. 6,9 | 1,5708 | x
y: -1,5 .. 2 | 0,5 | y
oznake: ne
oznakax: -1,5708 | −π/2
oznakax: 1,5708 | π/2
oznakax: 3,1416 | π
oznakax: 4,7124 | 3π/2
oznakax: 6,2832 | 2π
oznakay: 1 | 1
oznakay: -1 | −1
f: sin(x) | modra
f: cos(x) | oranžna črtkano
točka: 1,5708; 1
točka: 0; 1 | | | oranžna
puščica: 1,5708; 1,35 -> 0; 1,35 | π/2 | nad
napis: 4,7124; -1 | sin x | pod | modra
napis: 5,4; 1,1 | cos x | nad | oranžna
podnapis: Kosinus (črtkano) je sinus, premaknjen za π/2 v levo
:::

Graf **tangensa** je drugačen. Tangens ni definiran tam, kjer je $\cos x = 0$, torej pri $x = \frac{\pi}{2} + k\pi$. V teh točkah, **polih**, je imenovalec ulomka $\frac{\sin x}{\cos x}$ enak $0$. Tam ima graf **navpične asimptote**: premice, ki se jim graf vse bolj približuje, a jih ne doseže. Zaloga vrednosti tangensa so vsa realna števila, osnovna perioda pa je $\pi$: po pol obrata zamenjata predznak sinus in kosinus, njun količnik pa ostane enak. Manjša perioda ni mogoča, ker tangens med dvema asimptotama samo narašča.

:::risba graf
opis: Graf funkcije y = tan x za x od −π/2 do 3π/2. Navpične asimptote so črtkane premice pri −π/2, π/2 in 3π/2. Med dvema asimptotama graf narašča od zelo negativnih do zelo pozitivnih vrednosti; ničli sta pri 0 in π. Označena je točka (π/4; 1).
x: -2,2 .. 5,3 | 1,5708 | x
y: -4 .. 4 | 1 | y
oznake: ne
oznakax: -1,5708 | −π/2
oznakax: 0,7854 | π/4
oznakax: 1,5708 | π/2
oznakax: 3,1416 | π
oznakax: 4,7124 | 3π/2
oznakay: 1 | 1
oznakay: -1 | −1
f: tan(x) | modra | -1,45 .. 1,45
f: tan(x) | modra | 1,69 .. 4,59
črta: -1,5708; -4 -> -1,5708; 4 | črtkano siva
črta: 1,5708; -4 -> 1,5708; 4 | črtkano siva
črta: 4,7124; -4 -> 4,7124; 4 | črtkano siva
točka: 0; 0
točka: 3,1416; 0
točka: 0,7854; 1
podnapis: Tangens: perioda π, črtkane premice so asimptote
:::

Na sliki se ista veja ponovi po vsakem $\pi$. Število ob $x$ periodo skrajša kot pri sinusu, le da izhajamo iz $\pi$: $\tan(bx)$ ima osnovno periodo $\frac{\pi}{|b|}$.

*Preveri:* kolikšna je osnovna perioda $y = \tan 2x$? *Odgovor:* $\frac{\pi}{2}$.

:::premisli
Ali je $\sin 4$ pozitiven ali negativen? Pomagaj si z grafom, ne s kalkulatorjem.
---
Negativen. Velja $\pi \approx 3{,}14 < 4 < \frac{3\pi}{2} \approx 4{,}71$, na tem delu pa je graf sinusa pod osjo $x$ (padajoč proti $-1$).
:::

**4. Amplituda: število pred sinusom.** Graf $y = 2\sin x$ dobiš tako, da vsako vrednost sinusa podvojiš. Val sega od $-2$ do $2$, ničle ostanejo na mestu. **Amplituda** je razdalja od srednje črte vala do vrha. Srednja črta je vodoravna premica, okoli katere val niha; pri $y = 2\sin x$ je to kar os $x$. Pri $y = A\sin x$ je amplituda $|A|$. Če je $A < 0$, se graf še zrcali čez os $x$.

*Preveri:* kolikšna je amplituda $y = -3\sin x$? *Odgovor:* $3$; graf je še zrcaljen čez os $x$.

**5. Perioda: število ob $x$.** Pri $y = \sin 2x$ se kot $2x$ spreminja dvakrat hitreje kot $x$. Val se zato ponovi dvakrat pogosteje, njegova višina pa ostane enaka. Pri $y = \sin(bx)$ je osnovna perioda

$$T = \frac{2\pi}{|b|}$$

Zdaj lahko preveriš napoved: $y = 2\sin x$ je višji val, torej glasnejši žvižg. $y = \sin 2x$ je gostejši val, torej višji ton.

:::premisli
Sošolec sklepa: »Pri $\sin 2x$ je kot dvakrat večji, zato je val dvakrat širši in perioda je $4\pi$.« Zakaj ima $\sin 2x$ v resnici periodo $\pi$?
---
Ker kot $2x$ teče dvakrat hitreje kot $x$. Ko $x$ naraste za $\pi$, naraste $2x$ že za $2\pi$, kar je cel obrat. Graf se zato v smeri osi $x$ skrči na polovico: $T = \frac{2\pi}{2} = \pi$.
:::

*Preveri:* kolikšna je osnovna perioda $y = \sin\frac{x}{3}$? *Odgovor:* $6\pi$, graf je raztegnjen.

:::risba graf
opis: Graf funkcije y = A sin(bx) za x od 0 do 2π, zraven črtkano osnovni graf y = sin x. V aplikaciji se z drsnikoma spreminjata število A od −3 do 3 in število b od 0,5 do 4. Izbrano je A = {A} in b = {b}: amplituda je {abs(A)}, 2π/b je približno {2*pi/b}. Če je konec prve periode na sliki, je označen s točko na osi x. Pri A = 0 vala ni (o periodi takrat ne govorimo), graf je os x.
x: -0,4 .. 6,9 | 1,5708 | x
y: -3,5 .. 3,5 | 1 | y
oznake: ne
oznakax: 1,5708 | π/2
oznakax: 3,1416 | π
oznakax: 4,7124 | 3π/2
oznakax: 6,2832 | 2π
oznakay: 1 | 1
oznakay: 2 | 2
oznakay: 3 | 3
oznakay: -1 | −1
oznakay: -2 | −2
oznakay: -3 | −3
drsnik: A | -3 .. 3 | 0,5 | 2 | število A pred sinusom
drsnik: b | 0,5 .. 4 | 0,5 | 1 | število b ob x
f: sin(x) | siva črtkano | 0 .. 6,2832
f: A*sin(b*x) | modra | 0 .. 6,2832
točka: 2*pi/b; 0 | | | oranžna
podnapis: y = A sin(bx) pri A = {A} in b = {b}; črtkano y = sin x; perioda 2π/b ≈ {2*pi/b:.2} (točka na osi x, če je na sliki)
:::

Slika kaže $y = 2\sin x$ (polna črta) ob $y = \sin x$ (črtkano): ničle so iste, vrh je pri $2$. Točka na osi $x$ označuje konec prve periode, tu pri $2\pi \approx 6{,}28$. V aplikaciji premikaj drsnika:

- Spreminjaj $A$ od $2$ do $-2$. Ničle ostanejo na mestu, pri negativnem $A$ se val obrne čez os $x$. Pri $A = 0$ vala ni: graf je os $x$.
- Vrni $A$ na $2$. Preden premakneš $b$, napovej, kje bo točka pri $b = 3$. Nato povečuj $b$ od $1$ do $4$: točka potuje proti izhodišču. Pri $b = 2$ je pri $\pi \approx 3{,}14$, pri $b = 3$ pri $\frac{2\pi}{3} \approx 2{,}09$, pri $b = 4$ pri $\frac{\pi}{2} \approx 1{,}57$. Višina vala ostane enaka.
- Nastavi $b = 0{,}5$. Perioda je zdaj $4\pi$, zato je na sliki le pol vala, točka pa je zunaj slike.

**6. Premik v smeri osi $x$.** Pri $y = \sin(x - c)$ se graf premakne **v desno** za $c$, če je $c > 0$. Razlog: vrednost, ki jo je $\sin$ imel pri $0$, ima nova funkcija šele pri $x = c$, saj je $\sin(c - c) = \sin 0$. Če je $c < 0$, gre graf v levo.

*Preveri:* kam je premaknjen $y = \sin(x + 1)$? *Odgovor:* za $1$ v levo, ker je $x + 1 = x - (-1)$.

**7. Premik v smeri osi $y$.** Pri $y = \sin x + d$ se ves graf dvigne za $d$, pri $d < 0$ pa spusti. Vodoravna premica $y = d$ je **srednja črta**: val niha okoli nje.

*Preveri:* med katerima vrednostma niha $y = \sin x + 3$? *Odgovor:* med $2$ in $4$.

:::risba graf
opis: Graf funkcije y = sin(x − c) + d, zraven črtkano osnovni graf y = sin x. V aplikaciji se z drsnikoma spreminjata vodoravni premik c od −3 do 3 in navpični premik d od −2 do 2. Izbrano je c = {c} in d = {d}: začetek vala je v točki ({c}; {d}), črtkana srednja črta je y = {d}, val niha med {d-1} in {d+1}.
x: -4 .. 8 | 1 | x
y: -4 .. 4 | 1 | y
enako: da
drsnik: c | -3 .. 3 | 0,5 | 1 | premik c v smeri osi x
drsnik: d | -2 .. 2 | 0,5 | 2 | premik d v smeri osi y
f: sin(x) | siva črtkano
črta: -4; d -> 8; d | oranžna črtkano
f: sin(x - c) + d | modra
točka: c; d | | | oranžna
podnapis: y = sin(x − c) + d pri c = {c} in d = {d}; označena točka ({c}; {d}) je začetek vala
:::

Slika kaže $y = \sin(x - 1) + 2$ (polna črta) ob osnovnem grafu (črtkano). Točka iz izhodišča je zdaj v $(1; 2)$, val niha med $1$ in $3$ okoli srednje črte $y = 2$. V aplikaciji premikaj drsnika:

- Spreminjaj $c$ od $1$ do $-2$. Pri negativnem $c$ gre označena točka v levo: $\sin(x + 2)$ je premaknjen za $2$ v levo.
- Spreminjaj $d$. Oblika vala ostane enaka; srednja črta, vrhovi in dna se premaknejo enako daleč.

**8. Vse skupaj.** Vse štiri spremembe združi **splošna sinusna funkcija**:

$$f(x) = A\sin\big(b(x - c)\big) + d$$

| | spremeni | pravilo |
|---|---|---|
| $A$ | višina | amplituda $\lvert A\rvert$ |
| $b$ | širina | $T = \frac{2\pi}{\lvert b\rvert}$ |
| $c$ | premik levo–desno | za $c$ v desno |
| $d$ | premik gor–dol | srednja črta $y = d$ |

Največja vrednost funkcije je $d + |A|$, najmanjša $d - |A|$. Če je $A < 0$, se graf zrcali čez srednjo črto.

V simulaciji spodaj (»Graf A sin(b(x − c)) + d«) spreminjaj vse štiri hkrati. Nastavi $b = 2$ in $c = \frac{\pi}{4}$: kolikšna je perioda in kje se začne val? *Odgovor:* perioda je $\pi$, val se začne pri $x = \frac{\pi}{4}$.

**Pazi na obliko.** Če je funkcija zapisana kot $\sin(2x - \frac{\pi}{2})$, najprej izpostavi $b$: $2x - \frac{\pi}{2} = 2\left(x - \frac{\pi}{4}\right)$. Premik je $c = \frac{\pi}{4}$, ne $\frac{\pi}{2}$.

Enako velja za kosinus: $f(x) = A\cos\big(b(x - c)\big) + d$ ima amplitudo $|A|$, periodo $\frac{2\pi}{|b|}$ in enaka premika.

## Rešeni primeri

### Primer 1 (lažji)

Dana je funkcija $f(x) = 3\sin x - 1$. Določi amplitudo, osnovno periodo in zalogo vrednosti. Kje na intervalu $[0, 2\pi]$ doseže največjo vrednost?

**Podatki:** $f(x) = 3\sin x - 1$, interval $[0, 2\pi]$
**Iščemo:** amplitudo, periodo $T$, zalogo vrednosti $Z_f$, mesto maksimuma

:::formula
$f(x) = A\sin\big(b(x - c)\big) + d$: amplituda $|A|$, $T = \dfrac{2\pi}{|b|}$, $Z_f = [d - |A|,\ d + |A|]$
:::

**Rešitev:**

1. Primerjamo s splošno obliko: $A = 3$, $b = 1$, $c = 0$, $d = -1$.
2. Amplituda je $|A| = 3$, ker je val trikrat višji od osnovnega.
3. $T = \frac{2\pi}{1} = 2\pi$, ker $b$ grafa ne skrči.
4. $Z_f = [-1 - 3,\ -1 + 3] = [-4, 2]$, ker je srednja črta pri $y = -1$.
5. $\sin x$ je največji pri $x = \frac{\pi}{2}$, zato tam tudi $f$, ker je $A > 0$: $f\left(\frac{\pi}{2}\right) = 3 \cdot 1 - 1 = 2$.
6. Odgovor: amplituda je $3$, perioda $2\pi$, $Z_f = [-4, 2]$; največjo vrednost $2$ doseže pri $x = \frac{\pi}{2}$.

### Primer 2 (srednji)

Za funkcijo $f(x) = 2\sin\left(2x - \frac{\pi}{2}\right) + 1$ določi amplitudo, osnovno periodo, premika in zalogo vrednosti. Pri katerem najmanjšem pozitivnem $x$ ima maksimum?

**Podatki:** $f(x) = 2\sin\left(2x - \frac{\pi}{2}\right) + 1$
**Iščemo:** amplitudo, $T$, premik v smeri osi $x$ in $y$, $Z_f$, prvi maksimum

:::formula
$f(x) = A\sin\big(b(x - c)\big) + d$, $\quad T = \dfrac{2\pi}{|b|}$; $\sin u = 1$ pri $u = \dfrac{\pi}{2} + 2k\pi$
:::

**Rešitev:**

1. Izpostavimo $2$: $2x - \frac{\pi}{2} = 2\left(x - \frac{\pi}{4}\right)$, da dobimo splošno obliko.
2. Preberemo $A = 2$, $b = 2$, $c = \frac{\pi}{4}$, $d = 1$.
3. Amplituda je $2$; perioda $T = \frac{2\pi}{2} = \pi$.
4. Graf je premaknjen za $\frac{\pi}{4}$ v desno in za $1$ navzgor.
5. $Z_f = [1 - 2,\ 1 + 2] = [-1, 3]$.
6. Maksimum je tam, kjer je $\sin$ enak $1$: $2\left(x - \frac{\pi}{4}\right) = \frac{\pi}{2}$, torej $x - \frac{\pi}{4} = \frac{\pi}{4}$ in $x = \frac{\pi}{2}$. Prejšnji maksimum je eno periodo prej, pri $\frac{\pi}{2} - \pi < 0$, zato je to najmanjši pozitivni $x$.
7. Preverimo: $f\left(\frac{\pi}{2}\right) = 2\sin\frac{\pi}{2} + 1 = 3$, kar je res zgornja meja $Z_f$.
8. Odgovor: amplituda $2$, perioda $\pi$, premik za $\frac{\pi}{4}$ v desno in za $1$ navzgor, $Z_f = [-1, 3]$; prvi maksimum je pri $x = \frac{\pi}{2}$.

### Primer 3 (težji)

Vremenska aplikacija na telefonu kaže sončni vzhod in zahod. V Ljubljani traja najkrajši dan (21. december) približno $8{,}6\,\text{h}$, najdaljši (21. junij) približno $15{,}8\,\text{h}$. Dolžina dneva se ponovi po $365$ dneh. Ob spomladanskem enakonočju, 20. marca, ki je v navadnem letu $79$. dan, je dan srednje dolg in se daljša. Zapiši dolžino dneva v obliki $D(t) = A\sin\big(b(t - c)\big) + d$, kjer je $t$ zaporedni dan v letu. Koliko po tem modelu traja dan 1. maja ($t = 121$)? Kateri dan je po modelu najdaljši?

**Podatki:** $D_{\min} = 8{,}6\,\text{h}$, $D_{\max} = 15{,}8\,\text{h}$, $T = 365\,\text{dni}$, začetek vala pri $t = 79$, 1. maj: $t = 121$
**Iščemo:** $A$, $b$, $c$, $d$, $D(121)$ in dan z najdaljšim dnevom

:::formula
$A = \dfrac{D_{\max} - D_{\min}}{2}$, $\quad d = \dfrac{D_{\max} + D_{\min}}{2}$, $\quad b = \dfrac{2\pi}{T}$
:::

**Rešitev:**

1. Srednja črta je na sredini med skrajnima vrednostma: $d = \frac{15{,}8 + 8{,}6}{2} = 12{,}2\,\text{h}$.
2. Amplituda je polovica razlike: $A = \frac{15{,}8 - 8{,}6}{2} = 3{,}6\,\text{h}$.
3. Iz periode: $b = \frac{2\pi}{365}$ (na dan).
4. Sinus je na srednji črti in narašča na začetku vala. Dan je tak pri $t = 79$, zato je $c = 79$.
5. Torej $D(t) = 3{,}6\sin\left(\frac{2\pi}{365}(t - 79)\right) + 12{,}2$.
6. Za 1. maj je $t - c = 121 - 79 = 42$. Argument sinusa je $\frac{2\pi \cdot 42}{365} \approx 0{,}723$ (v radianih) in $\sin 0{,}723 \approx 0{,}662$.
7. $D(121) \approx 3{,}6 \cdot 0{,}662 + 12{,}2 \approx 14{,}6\,\text{h}$.
8. Vrh vala je četrtino periode po začetku, ker je tam sinus enak $1$: $t = 79 + \frac{365}{4} \approx 170$. To je 19. junij.
9. Odgovor: $D(t) = 3{,}6\sin\left(\frac{2\pi}{365}(t - 79)\right) + 12{,}2$ (v urah). Po modelu traja dan 1. maja približno $14{,}6\,\text{h}$, najdaljši pa je 19. junija. V resnici je najdaljši dva dni pozneje: sinusoida je dober približek, ne natančen opis.

### Primer 4: zdaj ti

Na sliki je graf funkcije $f(x) = A\sin\big(b(x - c)\big) + d$, kjer je $A > 0$ in $b > 0$. Z grafa preberi $A$, $b$, $c$ in $d$; $c$ naj bo najmanjši pozitivni premik.

:::risba graf
opis: Graf vala v koordinatnem sistemu z x od −1 do 7 in y od −2 do 6. Označene so štiri točke: začetek vala (1; 2), vrh (2; 5), dno (4; −1) in konec vala (5; 2). Od začetka do vrha graf narašča, nato pada do dna in se spet dvigne do konca vala.
x: -1 .. 7 | 1 | x
y: -2 .. 6 | 1 | y
f: 3*sin(pi/2*(x - 1)) + 2 | modra
točka: 1; 2 | (1; 2) | pod desno
točka: 2; 5 | (2; 5) | nad
točka: 4; -1 | (4; −1) | pod
točka: 5; 2 | (5; 2) | pod desno
podnapis: En val: začetek (1; 2), vrh (2; 5), dno (4; −1), konec (5; 2)
:::

**Podatki:** vrh $(2; 5)$, dno $(4; -1)$, en val od $(1; 2)$ do $(5; 2)$
**Iščemo:** $A$, $b$, $c$, $d$

:::formula
$A = \dfrac{f_{\max} - f_{\min}}{2}$, $\quad d = \dfrac{f_{\max} + f_{\min}}{2}$, $\quad b = \dfrac{2\pi}{T}$
:::

**Rešitev:**

1. $A = \frac{5 - (-1)}{2} = 3$, ker je amplituda polovica razdalje med vrhom in dnom.
2. $d = \frac{5 + (-1)}{2} = 2$, ker je srednja črta na sredini. Res: val se začne in konča na višini $2$.
3. En val sega od $x = 1$ do $x = 5$, zato je $T = 5 - 1 = 4$.
4. Izračunaj še $b$, preberi $c$ in zapiši funkcijo:

:::premisli
Koliko sta $b$ in $c$ ter kako se glasi $f(x)$?
---
$b = \frac{2\pi}{4} = \frac{\pi}{2}$. Val se začne na srednji črti pri $x = 1$, zato je $c = 1$. Torej $f(x) = 3\sin\big(\frac{\pi}{2}(x - 1)\big) + 2$. Preizkus: $f(2) = 3\sin\frac{\pi}{2} + 2 = 5$, kar je vrh na sliki. Ustrezal bi tudi $c = 5$ ali $c = -3$, ker je perioda $4$. Isti graf opiše tudi $3\cos\big(\frac{\pi}{2}(x - 2)\big) + 2$, ker se kosinusni val začne v vrhu $(2; 5)$.
:::

## Pogoste napake

- **Perioda pomnožena namesto deljena.** »Pri $\sin 2x$ je perioda $2 \cdot 2\pi = 4\pi$.« Večji $b$ pomeni hitrejše ponavljanje, torej krajšo periodo. Pravilno: $T = \frac{2\pi}{|b|}$, pri $\sin 2x$ je $T = \pi$. Tudi tangensu število ob $x$ periodo skrajša: $\tan 2x$ ima periodo $\frac{\pi}{2}$, ne $\pi$.
- **Zamenjani vlogi števil.** »$y = \sin 2x$ je dvakrat višji val.« Število ob $x$ (v argumentu sinusa) spremeni periodo, višino pa le število pred sinusom. Dvojke iz argumenta tudi ne smeš prestaviti pred sinus: $\sin\left(2 \cdot \frac{\pi}{2}\right) = \sin\pi = 0$, a $2\sin\frac{\pi}{2} = 2$.
- **Napačna smer premika.** »$\sin\left(x - \frac{\pi}{3}\right)$ je premaknjen v levo, ker je tam minus.« Vrednost, ki jo ima $\sin$ pri $0$, ima nova funkcija pri $x = \frac{\pi}{3}$, torej desno. Minus v oklepaju pomeni premik v desno.
- **Premik brez izpostavljanja.** »Pri $\sin\left(2x - \frac{\pi}{3}\right)$ je premik $\frac{\pi}{3}$.« Najprej izpostavi $b$: $2\left(x - \frac{\pi}{6}\right)$. Premik je $\frac{\pi}{6}$.
- **Srednja črta prezrta.** »Pri $3\sin x - 1$ je amplituda $2$, ker je največja vrednost $2$.« ali »$Z_f$ funkcije $4\cos x + 1$ je $[-4, 4]$.« Amplitudo merimo od srednje črte $y = d$, ne od osi $x$, in ves val se premakne z njo. Pri $3\sin x - 1$ je amplituda $3$, pri $4\cos x + 1$ pa $Z_f = [-3, 5]$. Amplituda je razdalja, zato ni nikoli negativna: pri $-2\sin x$ je $2$.

## Povzetek

- Sinus in kosinus imata osnovno periodo $2\pi$ in zalogo vrednosti $[-1, 1]$; tangens ima periodo $\pi$ in asimptote pri $x = \frac{\pi}{2} + k\pi$; $\tan(bx)$ ima periodo $\frac{\pi}{|b|}$.
- Ničle: $\sin x = 0$ pri $x = k\pi$, $\cos x = 0$ pri $x = \frac{\pi}{2} + k\pi$.
- $f(x) = A\sin\big(b(x - c)\big) + d$: amplituda $|A|$, perioda $T = \dfrac{2\pi}{|b|}$.
- $c > 0$: premik v desno za $c$; $d > 0$: premik navzgor za $d$.
- Zaloga vrednosti: $[d - |A|,\ d + |A|]$.
- Pred branjem premika izpostavi $b$: $\sin(bx - p) = \sin\big(b(x - \frac{p}{b})\big)$.

## Drugače: Na sliki

Graf sinusa si predstavljaj kot val, ki ga narišeš s petimi točkami na eno periodo: **ničla, vrh, ničla, dno, ničla** (pri premaknjenem valu so namesto ničel točke na srednji črti). Razdalja med zaporednima točkama je vedno četrtina periode.

Nariši še vodoravno črtkano **srednjo črto**: vrh je $|A|$ nad njo, dno $|A|$ pod njo.

$d$ premakne srednjo črto, $A$ raztegne val v višino, $b$ stisne ali razmakne pet točk, $c$ premakne ves val levo ali desno.

Kosinus je isti val, le da se začne na vrhu: **vrh, ničla, dno, ničla, vrh**.

Tako narišeš tudi $f(x) = 2\sin\big(2(x - \frac{\pi}{4})\big) + 1$ iz Primera 2. Val se začne pri $x = c = \frac{\pi}{4}$ na srednji črti $y = 1$, ker je tam argument sinusa enak $0$. Perioda je $\pi$, zato so točke narazen za $\frac{\pi}{4}$: pri $\frac{\pi}{4}$, $\frac{\pi}{2}$, $\frac{3\pi}{4}$, $\pi$ in $\frac{5\pi}{4}$. Njihove višine so $1$, $3$, $1$, $-1$, $1$.

:::risba graf
opis: Graf funkcije f(x) = 2 sin(2(x − π/4)) + 1 za x od 0 do 4,2. Črtkana srednja črta je y = 1. Označenih je pet točk ene periode: (π/4; 1), vrh (π/2; 3), (3π/4; 1), dno (π; −1) in (5π/4; 1).
x: -0,3 .. 4,4 | 0,7854 | x
y: -2 .. 4 | 1 | y
oznake: ne
oznakax: 0,7854 | π/4
oznakax: 1,5708 | π/2
oznakax: 2,3562 | 3π/4
oznakax: 3,1416 | π
oznakax: 3,927 | 5π/4
oznakay: -1 | −1
oznakay: 1 | 1
oznakay: 3 | 3
črta: -0,3; 1 -> 4,4; 1 | oranžna črtkano
f: 2*sin(2*(x - pi/4)) + 1 | modra | 0 .. 4,2
točka: 0,7854; 1
točka: 1,5708; 3 | vrh | nad
točka: 2,3562; 1
točka: 3,1416; -1 | dno | pod
točka: 3,927; 1
podnapis: En val od π/4 do 5π/4 okoli srednje črte y = 1
:::

## Drugače: Bolj natančno

Zakaj je perioda funkcije $g(x) = \sin(bx)$ ravno $\frac{2\pi}{|b|}$? Iščemo najmanjši $T > 0$, za katerega velja $\sin\big(b(x + T)\big) = \sin(bx)$ za vsak $x$. Ker je $\sin(bx + bT) = \sin(bx)$ za vsak $x$ natanko takrat, ko je $bT$ večkratnik $2\pi$, je najmanjši tak $|b|T = 2\pi$, torej $T = \frac{2\pi}{|b|}$.

Vrstni red transformacij šteje. Graf $f(x) = A\sin\big(b(x - c)\big) + d$ dobiš iz grafa $\sin x$ tako:

1. skrčiš v smeri osi $x$ s faktorjem $\frac{1}{|b|}$ (pri $b < 0$ še zrcališ čez os $y$),
2. premakneš za $c$ v smeri osi $x$,
3. raztegneš v smeri osi $y$ s faktorjem $|A|$ (pri $A < 0$ še zrcališ čez os $x$),
4. premakneš za $d$ v smeri osi $y$.

Če bi premik naredil pred krčenjem, bi dobil napačen premik $\frac{c}{b}$ namesto $c$. Zato je pomembno, da $b$ izpostaviš.

## Preveri se

? Katera trditev drži?
- Funkcija $y = \tan 2x$ ima osnovno periodo $\pi$.
~ To je perioda $\tan x$. Število $2$ ob $x$ jo razpolovi: $\frac{\pi}{2}$.
- Graf $y = -2\sin x$ ima amplitudo $-2$.
~ Amplituda je razdalja od srednje črte do vrha, zato je $|A| = 2$. Minus graf le zrcali čez os $x$.
- Graf $y = \sin\left(x + \frac{\pi}{2}\right)$ je graf sinusa, premaknjen za $\frac{\pi}{2}$ v desno.
~ Plus te zavede. Velja $x + \frac{\pi}{2} = x - \left(-\frac{\pi}{2}\right)$, zato gre graf v levo.
+ Graf $y = \cos x$ je graf $y = \sin x$, premaknjen za $\frac{\pi}{2}$ v levo.
> Sinus ima vrh pri $\frac{\pi}{2}$, kosinus pri $0$, sicer sta vala enaka. Zato je $\cos x = \sin\left(x + \frac{\pi}{2}\right)$.

? Kolikšna je osnovna perioda funkcije $f(x) = \sin 4x$?
- $8\pi$
~ Periodo si pomnožil s $4$. Večji $b$ pomeni hitrejše ponavljanje, zato krajšo periodo.
- $\frac{\pi}{4}$
~ Delil si $\pi$ namesto $2\pi$. S $\pi$ začneš pri tangensu, sinus pa ima osnovno periodo $2\pi$.
+ $\frac{\pi}{2}$
- $2\pi$
~ Prezrl si število $4$ ob $x$: to je perioda $\sin x$. Število ob $x$ periodo skrajša na $\frac{2\pi}{4}$.
> $T = \dfrac{2\pi}{|b|} = \dfrac{2\pi}{4} = \dfrac{\pi}{2}$.

? Maja je za $f(x) = \sin\left(2x - \frac{\pi}{3}\right)$ zapisala: »(1) $b = 2$, zato je osnovna perioda $\pi$. (2) Graf je glede na $y = \sin 2x$ premaknjen za $\frac{\pi}{3}$ v desno.« Kaj je narobe?
- Korak (1): perioda je $4\pi$.
~ Periodo si pomnožil z $2$. Korak (1) je pravilen: $T = \frac{2\pi}{2} = \pi$.
+ Korak (2): premik je $\frac{\pi}{6}$ v desno, ker je treba najprej izpostaviti $2$.
- Korak (2): premik je za $\frac{\pi}{3}$ v levo.
~ Minus te zavede. Pri $x - c$ s $c > 0$ gre graf v desno; napaka je v velikosti premika, ne v smeri.
- Napake ni.
~ Premik prebereš šele iz oblike $2(x - c)$. Brez izpostavljanja dobiš $\frac{\pi}{3}$, kar je dvakrat preveč.
> $2x - \frac{\pi}{3} = 2\left(x - \frac{\pi}{6}\right)$, zato je $c = \frac{\pi}{6}$: premik za $\frac{\pi}{6}$ v desno. Korak (1) je pravilen.

? Primerjaj funkciji $f(x) = 2\sin x$ in $g(x) = \sin 2x$. Kaj velja?
+ $f$ ima večjo amplitudo, $g$ krajšo periodo.
- $f$ ima krajšo periodo, $g$ večjo amplitudo.
~ Zamenjal si vlogi števil. Število pred sinusom raztegne val v višino, število ob $x$ ga stisne v širino.
- Obe imata amplitudo $2$ in periodo $\pi$.
~ Vsako število spremeni le eno lastnost: $2$ pred sinusom samo amplitudo, $2$ ob $x$ samo periodo.
- Funkciji sta enaki, ker lahko $2$ prestaviš pred sinus.
~ Sinus ni množenje: $f\left(\frac{\pi}{2}\right) = 2$, a $g\left(\frac{\pi}{2}\right) = \sin\pi = 0$.
> $f$ ima amplitudo $2$ in periodo $2\pi$, $g$ amplitudo $1$ in periodo $\frac{2\pi}{2} = \pi$. Val $f$ je višji, val $g$ gostejši.

? Lučka za obvestila na telefonu »diha«: njena svetlost je $s(t) = 40\cos(\pi t) + 50$ (v odstotkih, $t$ v sekundah). Med katerima vrednostma niha svetlost in koliko traja en utrip?
- Svetlost niha med $-40\,\%$ in $40\,\%$, en utrip traja $2\,\text{s}$.
~ Prezrl si premik $d = 50$: ves val je dvignjen za $50$. Negativne svetlosti tudi ni.
- Svetlost niha med $10\,\%$ in $90\,\%$, en utrip traja $2\pi^2\,\text{s}$.
~ Periodo si pomnožil z $b = \pi$. Pravilno je deliti: $T = \frac{2\pi}{\pi} = 2\,\text{s}$.
+ Svetlost niha med $10\,\%$ in $90\,\%$, en utrip traja $2\,\text{s}$.
- Svetlost niha med $50\,\%$ in $90\,\%$, en utrip traja $2\,\text{s}$.
~ Val niha na obe strani srednje črte $y = 50$: za $40$ nad njo in za $40$ pod njo.
> $|A| = 40$ in $d = 50$, zato svetlost niha od $50 - 40 = 10$ do $50 + 40 = 90$ odstotkov. Perioda je $T = \frac{2\pi}{\pi} = 2\,\text{s}$.

:::simboli
f | sinusna funkcija | f(x) = A\sin\big(b(x - c)\big) + d | |
x | kot v radianih (neodvisna spremenljivka) | | |
A | razteg v smeri osi y | A = \frac{f_{\max} - f_{\min}}{2} | | pri $A > 0$; amplituda je $\lvert A \rvert$
b | koeficient ob x, ki določa periodo | b = \frac{2\pi}{T} | | pri $b > 0$; graf se vodoravno skrči s faktorjem $\frac{1}{\lvert b \rvert}$
c | premik grafa v smeri osi x | | |
d | premik grafa v smeri osi y | d = \frac{f_{\max} + f_{\min}}{2} | | srednja črta je $y = d$
T | osnovna perioda | T = \frac{2\pi}{\lvert b \rvert} | |
Z_f | zaloga vrednosti funkcije | Z_f = [d - \lvert A \rvert,\ d + \lvert A \rvert] | |
u | argument sinusa | | |
k | poljubno celo število | | |
D | dolžina dneva | D(t) = A\sin\big(b(t - c)\big) + d | h |
t | zaporedni dan v letu | | | v kvizu čas v sekundah
D_{\max} | dolžina najdaljšega dneva | | h |
D_{\min} | dolžina najkrajšega dneva | | h |
g | druga funkcija za primerjavo | | |
p | število, odšteto v oklepaju | p = b \cdot c | | premik je $c = \frac{p}{b}$
P | točka na enotski krožnici | | |
s | svetlost lučke | s(t) = A\cos(bt) + d | \% |
f_{\max} | največja vrednost funkcije | | |
f_{\min} | najmanjša vrednost funkcije | | |
:::
