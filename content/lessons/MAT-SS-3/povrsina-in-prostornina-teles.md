---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Vremenska napoved opozarja: »Možna je toča s premerom do $4\,\text{cm}$.« Zrno s premerom $2\,\text{cm}$ tehta približno $4\,\text{g}$. Koliko tehta zrno, ki je le dvakrat širše? Če rečeš $8\,\text{g}$, se zelo motiš. Pravi odgovor izveš v razlagi, ko spoznaš prostornino krogle.

Ploščine likov in prostornino kocke ter kvadra že znaš. Zdaj to znanje razširimo na prizmo, piramido, valj, stožec in kroglo. Vsako novo telo postavimo ob sorodnika, ki ga že poznaš, in pogledamo, kaj je drugače.

Površina pove, koliko materiala potrebuješ, da telo oblečeš: pločevine za konzervo, platna za šotor, barve za steno. Prostornina pove, koliko telo »drži«: koliko vode gre v bazen, koliko sladoleda v kornet. Inženir, arhitekt in kuhar te količine računajo vsak dan.

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

1. Najprej stranica: $s = \sqrt{r^2 + v^2} = \sqrt{9 + 16} = 5\,\text{cm}$. Potrebujemo jo za plašč, ker ta leži »poševno«.
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

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Valj ima višino enako premeru osnovne ploskve in prostornino $54\pi\,\text{cm}^3$. Izračunaj njegovo površino.

**Rešitev:**

1. Višina je enaka premeru: $v = 2r$. Zato je $V = \pi r^2 \cdot 2r = 2\pi r^3$.
2. Iz $2\pi r^3 = 54\pi$ sledi $r^3 = 27$, torej $r = 3\,\text{cm}$ in $v = 6\,\text{cm}$.
3. $P = 2\pi r(r + v) = 2\pi \cdot 3 \cdot 9 = 54\pi\,\text{cm}^2$.
4. Odgovor: površina valja je $54\pi\,\text{cm}^2$.

**Točkovanje:** 1 točka za zvezo $V = 2\pi r^3$, 1 točka za $r = 3\,\text{cm}$, 1 točka za $P = 54\pi\,\text{cm}^2$.

### Naloga 2: krajša strukturirana naloga, 7 točk, pola 2 (z računalom)

Silos ima obliko valja s premerom $4\,\text{m}$ in višino $9\,\text{m}$. Pokriva ga streha v obliki stožca z enako osnovno ploskvijo kot valj. Stranica strehe oklepa z ravnino osnovne ploskve kot $35^\circ$.

a) Izračunaj višino strehe in dolžino njene stranice. Zaokroži na centimeter. (2 točki)
b) Izračunaj prostornino celotnega silosa. Zaokroži na desetinko $\text{m}^3$. (2 točki)
c) S pločevino prekrijemo plašč valja in streho, dno je betonsko. Koliko $\text{m}^2$ pločevine potrebujemo? Zaokroži navzgor na cel $\text{m}^2$. (2 točki)
d) Valjasti del silosa je do vrha napolnjen z žitom z gostoto $750\,\text{kg/m}^3$. Koliko ton žita je v silosu? Zaokroži na desetinko tone. (1 točka)

**Rešitev:**

1. a) Polmer je $r = 2\,\text{m}$, višina valja $v_1 = 9\,\text{m}$. Višina strehe $v_2$, polmer $r$ in stranica $s$ tvorijo pravokotni trikotnik s kotom $35^\circ$ ob osnovni ploskvi.
2. a) $v_2 = r\tan 35^\circ = 2\tan 35^\circ \approx 1{,}4004\,\text{m} \approx 1{,}40\,\text{m}$ in $s = \dfrac{r}{\cos 35^\circ} \approx 2{,}4415\,\text{m} \approx 2{,}44\,\text{m}$.
3. b) Valj: $V_1 = \pi r^2 v_1 = \pi \cdot 4 \cdot 9 = 36\pi \approx 113{,}097\,\text{m}^3$.
4. b) Streha: $V_2 = \dfrac{\pi r^2 v_2}{3} \approx \dfrac{\pi \cdot 4 \cdot 1{,}4004}{3} \approx 5{,}866\,\text{m}^3$. Skupaj $V \approx 118{,}963\,\text{m}^3 \approx 119{,}0\,\text{m}^3$.
5. c) Plašč valja: $2\pi r v_1 = 36\pi \approx 113{,}097\,\text{m}^2$. Plašč stožca: $\pi r s \approx \pi \cdot 2 \cdot 2{,}4415 \approx 15{,}341\,\text{m}^2$.
6. c) Skupaj $\approx 128{,}44\,\text{m}^2$; pločevine ne sme zmanjkati, zato zaokrožimo navzgor na $129\,\text{m}^2$.
7. d) Masa žita: $m = 113{,}097\,\text{m}^3 \cdot 750\,\text{kg/m}^3 \approx 84\,823\,\text{kg} \approx 84{,}8\,\text{t}$.
8. Odgovor: a) streha je visoka približno $1{,}40\,\text{m}$, njena stranica meri $2{,}44\,\text{m}$; b) $V \approx 119{,}0\,\text{m}^3$; c) potrebujemo $129\,\text{m}^2$ pločevine; d) v silosu je približno $84{,}8\,\text{t}$ žita.

**Točkovanje:** a) 1 točka za višino strehe $1{,}40\,\text{m}$ in 1 točka za stranico $2{,}44\,\text{m}$; b) 1 točka za prostornini valja in stožca, 1 točka za $119{,}0\,\text{m}^3$; c) 1 točka za ploščini obeh plaščev (brez dna in brez osnovne ploskve strehe), 1 točka za $129\,\text{m}^2$; d) 1 točka za $84{,}8\,\text{t}$ s pravilno pretvorbo enot.

### Naloga 3 (višja raven): strukturirana naloga, 10 točk, pola 1 (brez računala)

Pokončni stožec ima polmer osnovne ploskve $r = 6\,\text{cm}$ in višino $v = 8\,\text{cm}$.

a) Izračunaj površino in prostornino stožca. (2 točki)
b) V stožec včrtamo kroglo, ki se dotika osnovne ploskve in plašča. Opiši osni prerez, utemelji, kje leži središče krogle, in izračunaj njen polmer $\rho$. (4 točke)
c) Kolikšen delež prostornine stožca zavzame krogla? (2 točki)
d) Vrh stožca premaknemo vzporedno z osnovno ploskvijo, tako da nastane poševni stožec z isto osnovno ploskvijo in isto višino. Kolikšna je njegova prostornina? Utemelji s Cavalierijevim načelom. (2 točki)

**Rešitev:**

1. a) Stranica: $s = \sqrt{6^2 + 8^2} = 10\,\text{cm}$. Površina: $P = \pi r^2 + \pi r s = 36\pi + 60\pi = 96\pi\,\text{cm}^2$.
2. a) Prostornina: $V = \dfrac{\pi r^2 v}{3} = \dfrac{\pi \cdot 36 \cdot 8}{3} = 96\pi\,\text{cm}^3$.
3. b) Osni prerez stožca je enakokraki trikotnik z osnovnico $12\,\text{cm}$, krakoma $10\,\text{cm}$ in višino $8\,\text{cm}$. Prerez krogle je krog, ki se dotika vseh treh stranic, torej trikotniku včrtani krog.
4. b) Krogla je simetrična glede na os stožca, zato njeno središče $O$ leži na višini $TN$, kjer je $T$ vrh in $N$ središče osnovne ploskve. Ker se krogla dotika osnovne ploskve, je $ON = \rho$ in $OT = 8 - \rho$.
5. b) Naj bo $M$ točka na robu osnovne ploskve v osnem prerezu in $D$ dotikališče na stranici $TM$. Trikotnika $TDO$ in $TNM$ sta podobna (skupen kot pri $T$, prav kot pri $D$ in pri $N$), zato $\dfrac{OD}{OT} = \dfrac{NM}{TM}$, torej $\dfrac{\rho}{8 - \rho} = \dfrac{6}{10}$.
6. b) $10\rho = 48 - 6\rho$, $16\rho = 48$, $\rho = 3\,\text{cm}$. (Enako da formula za polmer včrtanega kroga: ploščina $48\,\text{cm}^2$ deljena s polobsegom $16\,\text{cm}$.)
7. c) $V_k = \dfrac{4\pi \rho^3}{3} = \dfrac{4\pi \cdot 27}{3} = 36\pi\,\text{cm}^3$. Delež: $\dfrac{36\pi}{96\pi} = \dfrac{3}{8} = 37{,}5\,\%$.
8. d) Oba stožca ležita med istima vzporednima ravninama (osnovna ploskev in ravnina skozi vrh). Na višini $h$ nad osnovno ploskvijo je prerez pri obeh krog s polmerom $\frac{6(8 - h)}{8}$, ker je prerez osnovna ploskev, pomanjšana v razmerju $\frac{8 - h}{8}$.
9. d) Prereza imata na vsaki višini enako ploščino, zato imata stožca po Cavalierijevem načelu enako prostornino, $96\pi\,\text{cm}^3$.
10. Odgovor: a) $P = 96\pi\,\text{cm}^2$, $V = 96\pi\,\text{cm}^3$; b) $\rho = 3\,\text{cm}$, središče je na osi $3\,\text{cm}$ nad osnovno ploskvijo; c) krogla zavzame $\frac{3}{8}$ prostornine; d) $96\pi\,\text{cm}^3$.

**Točkovanje:** a) 1 točka za $P = 96\pi\,\text{cm}^2$ (s $s = 10\,\text{cm}$), 1 točka za $V = 96\pi\,\text{cm}^3$; b) 1 točka za osni prerez z včrtanim krogom, 1 točka za središče na osi z $ON = \rho$, 1 točka za pravilno nastavljeno enačbo (podobnost ali ploščina in polobseg), 1 točka za $\rho = 3\,\text{cm}$; c) 1 točka za $V_k = 36\pi\,\text{cm}^3$, 1 točka za delež $\frac{3}{8}$; d) 1 točka za utemeljitev z enakimi preseki na vsaki višini, 1 točka za $96\pi\,\text{cm}^3$.

### Ustno vprašanje 1

:::premisli
Izpelji formulo za ploščino plašča stožca s polmerom osnovne ploskve $r$ in stranico $s$.
---
Plašč stožca razrežemo vzdolž stranice in ga razgrnemo v ravnino. Dobimo krožni izsek s polmerom $s$, katerega lok je dolg toliko kot obseg osnovnega kroga, $2\pi r$. Ploščina krožnega izseka je polovica produkta dolžine loka in polmera. Zato je ploščina plašča $\frac{1}{2} \cdot 2\pi r \cdot s = \pi r s$.
:::

### Ustno vprašanje 2

:::premisli
Kako se spremenita površina in prostornina krogle, če njen polmer povečamo $k$-krat? Utemelji.
---
Površina krogle je $P = 4\pi r^2$, zato se pri polmeru $k r$ poveča $k^2$-krat. Prostornina je $V = \frac{4\pi r^3}{3}$, zato se poveča $k^3$-krat. Prostornina torej raste hitreje kot površina. Enako velja za vsa podobna telesa: ploščine se povečajo s kvadratom, prostornine s kubom razmerja dolžin.
:::

### Ustno vprašanje 3

:::premisli
Pokaži na kocki, da je prostornina piramide tretjina prostornine prizme z enako osnovno ploskvijo in enako višino.
---
Kocko z robom $a$ razdelimo na tri skladne štiristrane piramide s skupnim vrhom v enem oglišču kocke. Osnovne ploskve piramid so tri ploskve kocke, ki tega oglišča ne vsebujejo, zato ima vsaka osnovno ploskev $a^2$ in višino $a$. Ker so piramide skladne, ima vsaka tretjino prostornine kocke: $\frac{a^3}{3} = \frac{a^2 \cdot a}{3}$. Enako razmerje velja za vsako piramido in prizmo z enako osnovno ploskvijo in višino, zato je prostornina piramide $V = \frac{S\,v}{3}$, kjer je $S$ ploščina osnovne ploskve in $v$ višina.
:::

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

**Izpeljava prostornine krogle (višja raven).** Primerjaj polkroglo s polmerom $r$ in valj s polmerom $r$ in višino $r$, iz katerega izrezemo stožec (vrh v središču spodnje osnovne ploskve, osnovna ploskev je zgornji krog valja). Na višini $h$ nad osnovno ploskvijo:

- presek polkrogle je krog s polmerom $\sqrt{r^2 - h^2}$, ploščina $\pi(r^2 - h^2)$,
- presek »valja brez stožca« je kolobar: velik krog $\pi r^2$ minus krog stožca s polmerom $h$ (stožec ima enako višino in polmer, zato je na višini $h$ polmer $h$): $\pi r^2 - \pi h^2$.

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

<<RACUN
vrednost: 27^(1/3) | 3
vrednost: 2*pi*3^3 | 54*pi
vrednost: 2*pi*3*(3+6) | 54*pi
vrednost: 2*tan(35°) | 1.40
vrednost: 2/cos(35°) | 2.44
vrednost: pi*2^2*9 | 113.097
vrednost: pi*2^2*2*tan(35°)/3 | 5.866
vrednost: pi*2^2*9 + pi*2^2*2*tan(35°)/3 | 119.0
vrednost: pi*2*2/cos(35°) | 15.341
vrednost: 2*pi*2*9 + pi*2*2/cos(35°) | 128.44
vrednost: pi*2^2*9*0.75 | 84.82
vrednost: sqrt(6^2+8^2) | 10
vrednost: pi*6^2+pi*6*10 | 96*pi
vrednost: pi*6^2*8/3 | 96*pi
resi: 10*x=6*(8-x) | x | 3
vrednost: 4*pi*3^3/3 | 36*pi
vrednost: (36*pi)/(96*pi) | 3/8
vrednost: 48/16 | 3
>>

:::simboli
P | površina telesa | | | vsota ploščin vseh mejnih ploskev
S | ploščina osnovne ploskve | | |
S_p | ploščina plašča | | | pri pokončni prizmi $S_p = o \cdot v$
o | obseg osnovne ploskve | | |
a | osnovni rob piramide | | |
v_s | višina stranske ploskve | v_s^2 = v^2 + \left(\frac{a}{2}\right)^2 | | pri pravilni štiristrani piramidi
V | prostornina telesa | | |
v | višina telesa | | |
r | polmer (osnovne ploskve ali krogle) | | |
s | stranica stožca | s = \sqrt{r^2 + v^2} | |
V_{\text{polkrogle}} | prostornina polkrogle | V_{\text{polkrogle}} = \frac{2\pi r^3}{3} | | valj minus stožec z višino r
:::
