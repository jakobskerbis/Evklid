---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Vremenska napoved opozarja: »Možna je toča s premerom do $4\,\text{cm}$.« Zrno s premerom $2\,\text{cm}$ tehta približno $4\,\text{g}$. Koliko tehta zrno, ki je le dvakrat širše? Če rečeš $8\,\text{g}$, se zelo motiš. Pravi odgovor izveš v razlagi, ko spoznaš prostornino krogle.

Ploščine likov in prostornino kocke ter kvadra že znaš. Zdaj to znanje razširimo na prizmo, piramido, valj, stožec in kroglo. Vsako novo telo postavimo ob sorodnika, ki ga že poznaš, in pogledamo, kaj je drugače.

Površina pove, koliko materiala potrebuješ, da telo oblečeš: pločevine za konzervo, platna za šotor, barve za steno. Prostornina pove, koliko telo "drži": koliko vode gre v bazen, koliko sladoleda v kornet. Inženir, arhitekt in kuhar te količine računajo vsak dan.

## Razlaga

**1. Osnovni pojmi.**

- **Površina** $P$ telesa je vsota ploščin vseh mejnih ploskev. Merimo jo na primer v $\text{cm}^2$ ali $\text{m}^2$.
- **Prostornina** $V$ pove, koliko prostora telo zavzema. Merimo jo na primer v $\text{cm}^3$ ali $\text{m}^3$ ($1\,\text{dm}^3 = 1\,\text{l}$).
- Pri prizmi, piramidi, valju in stožcu ločimo **osnovno ploskev** (ploščina $S$), **plašč** (ploščina $S_p$) in **višino** $v$.

**2. Prizma.** Dve skladni vzporedni osnovni ploskvi (mnogokotnika) povezujejo stranski pravokotniki (pri pokončni prizmi).

$$P = 2S + S_p \qquad V = S \cdot v$$

Plašč pokončne prizme je sestavljen iz pravokotnikov, visokih $v$. Njegova ploščina je $S_p = o \cdot v$, kjer je $o$ obseg osnovne ploskve.

**3. Piramida ob prizmi.** Razlika s prizmo je ena sama: namesto druge osnovne ploskve je vrh. Piramida ima eno osnovno ploskev (mnogokotnik), stranske ploskve pa so trikotniki, ki se stikajo v vrhu.

$$P = S + S_p \qquad V = \frac{S \cdot v}{3}$$

Pri pravilni piramidi so stranske ploskve skladni enakokraki trikotniki. Njihova višina je **višina stranske ploskve** $v_s$. Povezuje jo z višino piramide Pitagorov izrek: pri pravilni štiristrani piramidi z osnovnim robom $a$ je $v_s^2 = v^2 + \left(\frac{a}{2}\right)^2$.

**4. Valj ob prizmi.** Valj je »okrogla prizma«: enaka formula $V = S \cdot v$, le da je osnovna ploskev krog s ploščino $S = \pi r^2$. Osnovni ploskvi sta kroga s polmerom $r$. Plašč je, razvit v ravnino, pravokotnik s stranicama $2\pi r$ in $v$.

$$P = 2\pi r^2 + 2\pi r v = 2\pi r(r + v) \qquad V = \pi r^2 v$$

**5. Stožec ob valju.** Stožec je valju to, kar je piramida prizmi: zgornji krog se skrči v vrh. Osnovna ploskev je krog s polmerom $r$. Plašč je, razvit v ravnino, krožni izsek s polmerom $s$ (**stranica stožca**: razdalja od vrha do roba osnovnega kroga). Velja $s^2 = r^2 + v^2$.

$$P = \pi r^2 + \pi r s \qquad V = \frac{\pi r^2 v}{3}$$

V simulaciji spodaj (»Površina in prostornina teles«) izberi stožec in vklopi »pokaži mrežo«. Večaj višino in opazuj, kako se spreminja izsek, ki je plašč.

:::premisli
Zakaj v ploščini plašča stožca nastopa $s$ in ne višina $v$?
---
Plašč leži poševno od vrha do roba. Ko ga razgrneš, je izsek s polmerom $s$. Višina $v$ je razdalja znotraj stožca, na plašču je ni.
:::

**6. Krogla ob valju.** Krogla nima ne osnovne ploskve ne plašča, zato je ne moremo razgrniti v ravnino. Postavimo jo v valj, ki se je ravno dotika (polmer $r$, višina $2r$): krogla zavzame natanko $\frac{2}{3}$ njegove prostornine.

$$P = 4\pi r^2 \qquad V = \frac{4\pi r^3}{3}$$

:::premisli
Vrnimo se k toči. Premer zrna se podvoji. Kolikokrat se poveča prostornina (in s tem masa)?
---
Osemkrat, ker je v prostornini $r^3$ in $2^3 = 8$. Zrno s premerom $4\,\text{cm}$ tehta okoli $8 \cdot 4\,\text{g} = 32\,\text{g}$, ne $8\,\text{g}$. Površina pa se poveča le štirikrat ($2^2 = 4$).
:::

**7. Primerjava v tabeli.** Vsako novo telo se od starega sorodnika razlikuje v eni stvari.

| Telo | Prostornina | Razlika |
|---|---|---|
| piramida | $\frac{1}{3}$ prizme | vrh, ne ploskev |
| stožec | $\frac{1}{3}$ valja | vrh, ne krog |
| krogla | $\frac{2}{3}$ valja | brez plašča |

Pri piramidi in stožcu primerjava velja le pri isti osnovni ploskvi in isti višini. Kroglo primerjamo z valjem, ki ima enak polmer in višino $v = 2r$.

## Rešeni primeri

### Primer 1 (lažji): pravilna štiristrana piramida

Osnovni rob pravilne štiristrane piramide meri $a = 6\,\text{cm}$, višina $v = 4\,\text{cm}$. Izračunaj prostornino in površino.

**Podatki:** osnovni rob $a = 6\,\text{cm}$, višina $v = 4\,\text{cm}$, osnovna ploskev je kvadrat
**Iščemo:** prostornino $V$ in površino $P$

:::formula
$V = \dfrac{S \cdot v}{3}$, $P = S + S_p$, $v_s^2 = v^2 + \left(\dfrac{a}{2}\right)^2$
:::

**Rešitev:**

1. **Osnovna ploskev** je kvadrat: $S = 6^2 = 36\,\text{cm}^2$.
2. **Prostornina:** $V = \dfrac{S \cdot v}{3} = \dfrac{36 \cdot 4}{3} = 48\,\text{cm}^3$.
3. Za površino potrebujemo plašč, torej višino stranske ploskve. Pravokotni trikotnik s katetama $v = 4$ in $\frac{a}{2} = 3$ ima hipotenuzo $v_s$: $v_s = \sqrt{4^2 + 3^2} = \sqrt{25} = 5\,\text{cm}$. Zakaj polovica roba? Višina piramide pade v središče kvadrata, kjer je od sredine roba oddaljena za $\frac{a}{2}$.
4. Ena stranska ploskev je trikotnik: $\dfrac{a \cdot v_s}{2} = \dfrac{6 \cdot 5}{2} = 15\,\text{cm}^2$. Plašč ima 4 takšne ploskve: $S_p = 60\,\text{cm}^2$.
5. **Površina:** $P = S + S_p = 36 + 60 = 96\,\text{cm}^2$.
6. Odgovor: piramida ima prostornino $48\,\text{cm}^3$ in površino $96\,\text{cm}^2$.

### Primer 2: valj in stožec

a) Valj ima polmer $r = 3\,\text{cm}$ in višino $v = 8\,\text{cm}$. Izračunaj $V$ in $P$.

b) Stožec ima $r = 3\,\text{cm}$ in $v = 4\,\text{cm}$. Izračunaj $V$ in $P$.

**Podatki:** valj $r = 3\,\text{cm}$, $v = 8\,\text{cm}$; stožec $r = 3\,\text{cm}$, $v = 4\,\text{cm}$
**Iščemo:** prostornino $V$ in površino $P$ obeh teles

:::formula
Valj: $V = \pi r^2 v$, $P = 2\pi r(r + v)$. Stožec: $s = \sqrt{r^2 + v^2}$, $V = \dfrac{\pi r^2 v}{3}$, $P = \pi r^2 + \pi r s$
:::

**Rešitev:**

a) Valj:

1. $V = \pi r^2 v = \pi \cdot 9 \cdot 8 = 72\pi \approx 226{,}19\,\text{cm}^3$, ker je osnovna ploskev krog s ploščino $9\pi$.
2. $P = 2\pi r(r + v) = 2\pi \cdot 3 \cdot 11 = 66\pi \approx 207{,}35\,\text{cm}^2$, ker štejemo dva kroga in plašč.

b) Stožec:

1. Najprej stranica: $s = \sqrt{r^2 + v^2} = \sqrt{9 + 16} = 5\,\text{cm}$. Potrebujemo jo za plašč, ker ta leži "poševno".
2. $V = \dfrac{\pi \cdot 9 \cdot 4}{3} = 12\pi \approx 37{,}70\,\text{cm}^3$.
3. $P = \pi r^2 + \pi r s = 9\pi + 15\pi = 24\pi \approx 75{,}40\,\text{cm}^2$.
4. Odgovor: valj ima $V = 72\pi\,\text{cm}^3$ in $P = 66\pi\,\text{cm}^2$, stožec $V = 12\pi\,\text{cm}^3$ in $P = 24\pi\,\text{cm}^2$.

Opazi: stožec ima enak polmer kot valj, a manjšo višino. Zato tu ne moreš neposredno primerjati prostornin $V_{\text{stožca}} = \frac13 V_{\text{valja}}$. To velja šele pri enaki višini.

### Primer 3 (težji): kornet sladoleda

Kornet je stožec s polmerom $r = 3\,\text{cm}$ in višino $v = 4\,\text{cm}$. Na vrhu je polkrogla sladoleda z enakim polmerom. Kolikšna je skupna prostornina in kolikšna je površina, ki jo vidiš od zunaj (plašč stožca in površina polkrogle)?

**Podatki:** stožec $r = 3\,\text{cm}$, $v = 4\,\text{cm}$ (od tod $s = 5\,\text{cm}$ iz primera 2); polkrogla $r = 3\,\text{cm}$
**Iščemo:** skupno prostornino $V$ in zunanjo površino $P$

:::formula
$V = \dfrac{\pi r^2 v}{3} + \dfrac{1}{2} \cdot \dfrac{4\pi r^3}{3}$, $P = \pi r s + \dfrac{1}{2} \cdot 4\pi r^2$
:::

**Rešitev:**

1. **Skica.** Polkrogla leži na krožni osnovni ploskvi stožca, zato se njuna kroga ujemata.
2. **Prostornina stožca:** $12\pi\,\text{cm}^3$ (iz primera 2).
3. **Prostornina polkrogle:** polovica krogle, $\dfrac12 \cdot \dfrac{4\pi \cdot 27}{3} = \dfrac12 \cdot 36\pi = 18\pi\,\text{cm}^3$.
4. **Skupaj:** $V = 12\pi + 18\pi = 30\pi \approx 94{,}25\,\text{cm}^3$.
5. **Površina od zunaj.** Plašč stožca je $\pi r s = \pi \cdot 3 \cdot 5 = 15\pi$. Površina polkrogle (brez kroga spodaj) je polovica površine krogle: $\dfrac12 \cdot 4\pi \cdot 9 = 18\pi$.
6. Skupaj: $15\pi + 18\pi = 33\pi \approx 103{,}67\,\text{cm}^2$. Krožne osnovne ploskve stožca ne štejemo, ker je prekrita s sladoledom.
7. Odgovor: kornet s sladoledom ima prostornino $30\pi \approx 94{,}25\,\text{cm}^3$, od zunaj vidiš $33\pi \approx 103{,}67\,\text{cm}^2$.

### Primer 4 – zdaj ti: dežemer

Dežemer je valjasta posoda z odprtino s polmerom $r = 8\,\text{cm}$. Po nevihti je v njem $0{,}5\,\text{l}$ vode. Koliko milimetrov dežja je padlo, torej kako visoko je voda v posodi?

**Podatki:** $r = 8\,\text{cm}$, $V = 0{,}5\,\text{l}$
**Iščemo:** višino vode $v$ v milimetrih

:::formula
$V = \pi r^2 v$, zato $v = \dfrac{V}{\pi r^2}$
:::

**Rešitev:**

1. Pretvorimo prostornino v $\text{cm}^3$, da se ujema s polmerom: $0{,}5\,\text{l} = 0{,}5\,\text{dm}^3 = 500\,\text{cm}^3$.
2. Ploščina odprtine: $S = \pi r^2 = 64\pi \approx 201{,}1\,\text{cm}^2$.
3. Izračunaj sam višino $v$ in jo pretvori v milimetre.

:::premisli
Koliko je $v$?
---
$v = \dfrac{500}{201{,}1} \approx 2{,}49\,\text{cm} \approx 25\,\text{mm}$. Padlo je okoli $25\,\text{mm}$ dežja. Voda v pokončnem valju stoji enako visoko kot plast dežja na ravnih tleh, zato dež merimo v milimetrih.
:::

## Pogoste napake

- **Pozabljen faktor $\frac13$.** Učenec za stožec z $r = 3\,\text{cm}$, $v = 4\,\text{cm}$ računa $\pi \cdot 9 \cdot 4 = 36\pi$, kot pri valju. To je prostornina valja, stožec pa se proti vrhu oži in zavzame le tretjino. Popravek: pri piramidi in stožcu deli s $3$.
- **Višina namesto stranice.** »Plašč stožca je $\pi r v$, saj je $v$ višina.« Plašč pa leži poševno in razgrnjen je izsek s polmerom $s$. Popravek: najprej $s = \sqrt{r^2 + v^2}$; pri piramidi enako $v_s$ namesto $v$.
- **Premer namesto polmera.** Pri toči s premerom $4\,\text{cm}$ učenec vstavi $r = 4$ in dobi osemkrat preveliko prostornino. Popravek: premer najprej razpolovi.
- **Napačna potenca.** »Krogla je okrogla kot krog, torej $r^2$.« A prostornina ima tri razsežnosti, zato $r^3$. Pri $r = 6$ je $r^3 = 216$, ne $36$. Popravek: v površini je $r^2$, v prostornini $r^3$.
- **Pozabljena osnovna ploskev.** Površino valja učenec računa samo kot plašč $2\pi r v$. Pločevinka pa ima tudi dno in pokrov. Popravek: valj in prizma imata dve osnovni ploskvi, stožec in piramida eno; izpusti jo le, če to zahteva naloga (šotor, kornet).

## Povzetek

- Površina je vsota ploščin mejnih ploskev, prostornina pove, koliko prostora telo zavzema.
- Prizma: $P = 2S + S_p$, $V = S\,v$.
- Piramida: $P = S + S_p$, $V = \dfrac{S\,v}{3}$.
- Valj: $P = 2\pi r(r+v)$, $V = \pi r^2 v$.
- Stožec: $P = \pi r(r+s)$, $V = \dfrac{\pi r^2 v}{3}$, $s = \sqrt{r^2+v^2}$.
- Krogla: $P = 4\pi r^2$, $V = \dfrac{4\pi r^3}{3}$.
- Pri sestavljenih telesih računaj posebej vsak del in pazi, katere ploskve so res zunaj.

## Drugače: Na sliki

Razreži telo in ga razgrni v ravnino, dobiš **mrežo**.

- **Valj:** dva kroga in pravokotnik. Eno stranico pravokotnika ($2\pi r$) dobiš tako, da ovijaš plašč okoli roba kroga, druga stranica je višina $v$. Zato je ploščina plašča $2\pi r \cdot v$.
- **Stožec:** en krog in krožni izsek s polmerom $s$. Lok izseka ima dolžino $2\pi r$ (obseg osnovnega kroga). Ploščina izseka je $\dfrac12 \cdot s \cdot 2\pi r = \pi r s$.
- **Prizma in piramida:** mnogokotniki in pravokotniki oziroma trikotniki. Ploščine preprosto seštej.

Prostornino si predstavljaj kot plasti: prizma in valj sta zloženi iz enakih plasti ($S$) do višine $v$, zato $V = S\,v$. Pri piramidi in stožcu se plasti proti vrhu manjšajo, zato je prostornina manjša, natanko tretjina.

## Drugače: Iz vsakdanjega življenja

- **Pločevinka** je valj. Površina pove, koliko pločevine potrebuješ (dva pokrova in ovoj), prostornina pa, koliko pijače gre vanjo. Pločevinka z $r = 3\,\text{cm}$ in $v = 8\,\text{cm}$ ima $V \approx 226\,\text{cm}^3$, torej okoli $0{,}23\,\text{l}$.
- **Šotor** v obliki stožca ali piramide: platno pokriva samo plašč, saj tal ne prekrivamo. Zato pri šotoru računaš samo $S_p$.
- **Žoga** je krogla. Če ji polmer podvojiš, se površina poveča $4$-krat ($r^2$), prostornina pa $8$-krat ($r^3$). Zato je velika žoga veliko težja od male, čeprav je le dvakrat širša.
- **Silos, rezervoar, strešnik:** vedno vprašanje, koliko vsebuje (prostornina) in koliko materiala je potrebnega (površina).

## Drugače: Bolj natančno

**Zakaj tretjina?** Kocka z robom $a$ se da razdeliti na tri skladne štiristrane piramide, katerih vrh je v enem oglišču kocke. Vsaka ima osnovno ploskev $a^2$ in višino $a$. Torej je $V_{\text{piramide}} = \dfrac{a^3}{3} = \dfrac{a^2 \cdot a}{3}$. Splošen dokaz za poljubno piramido temelji na Cavalierijevem načelu.

**Cavalierijevo načelo (višja raven):** če imata dve telesi enako višino in so vsi vzporedni preseki na isti višini enako veliki, imata enaki prostornini.

**Prostornina krogle (višja raven).** Primerjaj polkroglo s polmerom $r$ in valj s polmerom $r$ in višino $r$, iz katerega izrezemo stožec (vrh v središču spodnje osnovne ploskve, osnovna ploskev je zgornji krog valja). Na višini $h$ nad osnovno ploskvijo:

- presek polkrogle je krog s polmerom $\sqrt{r^2 - h^2}$, ploščina $\pi(r^2 - h^2)$,
- presek "valja brez stožca" je kolobar: velik krog $\pi r^2$ minus krog stožca s polmerom $h$ (stožec ima enako višino in polmer, zato je na višini $h$ polmer $h$): $\pi r^2 - \pi h^2$.

Preseka sta enaka, zato sta enaki tudi prostornini:

$$V_{\text{polkrogle}} = \pi r^2 \cdot r - \frac{\pi r^2 \cdot r}{3} = \frac{2\pi r^3}{3}$$

Krogla je dvakrat tolikšna: $V = \dfrac{4\pi r^3}{3}$.

## Preveri se

? Kateri liki sestavljajo mrežo (razgrnjeno površino) stožca?
- dva kroga in pravokotnik
~ To je mreža valja. Stožec ima le en krog, zgoraj je vrh.
+ en krog in krožni izsek
- en krog in enakokraki trikotnik
~ Plašč stožca je ukrivljen: razgrnjen da izsek z lokom, ne trikotnika z ravno osnovnico. Trikotniki so pri piramidi.
- en krog in pravokotnik
~ Pravokotnik je plašč valja, kjer sta oba roba enako dolga. Plašč stožca se proti vrhu zoži v točko.
> Osnovna ploskev je krog, plašč pa razgrnemo v krožni izsek s polmerom $s$ in lokom $2\pi r$.

? Valj in stožec imata enak polmer in enako višino. Zakaj ima stožec le tretjino prostornine valja?
- ker ima stožec le eno osnovno ploskev, valj pa dve
~ Število osnovnih ploskev vpliva na površino, ne na prostornino. Prostornina je odvisna od tega, koliko prostora je znotraj.
- ker je plašč stožca krajši od plašča valja
~ Plašč je del površine, prostornine z njim ne izračunamo.
+ ker se preseki stožca proti vrhu manjšajo, pri valju pa so vsi enako veliki
- ker je stranica stožca $s$ daljša od višine $v$
~ Stranica nastopa v plašču, ne v prostornini. Tretjina pride iz oženja proti vrhu.
> Valj je zložen iz enakih plasti $\pi r^2$ do višine $v$. Pri stožcu se plasti proti vrhu manjšajo, skupaj dajo natanko tretjino.

? Krogla ima prostornino $288\pi\,\text{cm}^3$. Kolikšen je njen polmer?
- $\sqrt[3]{288} \approx 6{,}6\,\text{cm}$
~ Pozabljen je faktor $\frac{4}{3}$: iz $\frac{4\pi r^3}{3} = 288\pi$ najprej dobiš $r^3 = 216$.
+ $6\,\text{cm}$
- $\sqrt{216} \approx 14{,}7\,\text{cm}$
~ Prostornina krogle vsebuje $r^3$, ne $r^2$, zato koreniš s tretjim korenom.
- $216\,\text{cm}$
~ To je $r^3$. Iz njega moraš še izračunati tretji koren.
> Iz $\dfrac{4\pi r^3}{3} = 288\pi$ sledi $r^3 = \dfrac{3 \cdot 288}{4} = 216$, torej $r = \sqrt[3]{216} = 6\,\text{cm}$.

? Ob cesti je za zimo nasut kup soli v obliki stožca s polmerom $2\,\text{m}$ in višino $1{,}5\,\text{m}$. Približno koliko soli je v kupu?
- približno $19\,\text{m}^3$
~ To je $\pi \cdot 4 \cdot 1{,}5 \approx 18{,}8$: prostornina valja. Pozabljen je faktor $\frac{1}{3}$.
+ približno $6\,\text{m}^3$
- približno $3\,\text{m}^3$
~ Polmer ni kvadriran: $\frac{\pi \cdot 2 \cdot 1{,}5}{3} \approx 3{,}1$. Ploščina osnovne ploskve je $\pi r^2$.
- približno $25\,\text{m}^3$
~ Premer $4\,\text{m}$ je vstavljen namesto polmera: $\frac{\pi \cdot 16 \cdot 1{,}5}{3} \approx 25{,}1$. Najprej razpolovi premer.
> $V = \dfrac{\pi r^2 v}{3} = \dfrac{\pi \cdot 4 \cdot 1{,}5}{3} = 2\pi \approx 6{,}3\,\text{m}^3$.

? Stožec ima polmer $5\,\text{cm}$ in višino $12\,\text{cm}$. Kolikšna je njegova površina?
- $85\pi\,\text{cm}^2$
~ Namesto stranice $s$ je vzeta višina: $25\pi + 5 \cdot 12\pi$. Plašč leži poševno, zato potrebuješ $s$.
- $65\pi\,\text{cm}^2$
~ To je samo plašč $\pi r s$. Površina vključuje še osnovni krog $25\pi$.
+ $90\pi\,\text{cm}^2$
- $100\pi\,\text{cm}^2$
~ To je prostornina $\frac{\pi \cdot 25 \cdot 12}{3}$, ne površina. Površina je v $\text{cm}^2$ in se računa s ploščinami.
> Stranica je $s = \sqrt{25 + 144} = 13\,\text{cm}$. Potem $P = \pi r^2 + \pi r s = 25\pi + 65\pi = 90\pi$. Odgovor $85\pi$ uporabi $v$ namesto $s$, $65\pi$ je samo plašč, $100\pi$ pa je prostornina.

:::simboli
P | površina telesa | | | vsota ploščin vseh mejnih ploskev
S | ploščina osnovne ploskve | | |
S_p | ploščina plašča | | | pri pokončni prizmi $S_p = o \cdot v$
a | osnovni rob piramide | | |
v_s | višina stranske ploskve | v_s^2 = v^2 + \left(\frac{a}{2}\right)^2 | | pri pravilni štiristrani piramidi
V | prostornina telesa | | |
v | višina telesa | | |
r | polmer (osnovne ploskve ali krogle) | | |
s | stranica stožca | s = \sqrt{r^2 + v^2} | |
V_{\text{polkrogle}} | prostornina polkrogle | V_{\text{polkrogle}} = \frac{2\pi r^3}{3} | | valj minus stožec z višino r
:::
