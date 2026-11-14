---
stanje: osnutek
demo: pitagora
avtor: AI
---

## Zakaj se tega učimo

V Mezopotamiji so pisarji merili polja, računali ploščine in načrtovali gradnje. Ohranile so se glinene tablice, na katerih so vadili. Na eni, stari več kot $3500$ let, je narisan kvadrat z obema diagonalama. Ob diagonali je zapisano, da je približno $1{,}41$-krat daljša od stranice. Danes vemo, da je to $\sqrt{2} \approx 1{,}41$.

Kako so to vedeli brez ravnila, ki bi merilo tako natančno? Diagonala kvadrata je hipotenuza pravokotnega trikotnika, kateti pa sta stranici. Prav tak trikotnik se skriva v marsikateri nalogi, le narisan ni.

Tudi v športu ga iščemo. Kako dolga je pot čez igrišče od kota do kota? Kako visoka je trikotna navijaška zastavica? Koliko prostora potrebuje rampa za rolkanje? Odgovor na vsa tri vprašanja da Pitagorov izrek, ko v liku najprej najdeš pravokotni trikotnik.

## Razlaga

**1. Skušnjava: števila kar vstaviti v izrek.** Enakokraki trikotnik ima osnovnico $10\,\text{cm}$ in kraka po $13\,\text{cm}$. Kolikšna je višina na osnovnico? Hitra misel je: »Imam dve števili, vstavim ju v $a^2 + b^2 = c^2$.« Dobiš $\sqrt{10^2 + 13^2} = \sqrt{269} \approx 16{,}4\,\text{cm}$.

Rezultat ne more biti pravilen. Višina sega od vrha naravnost navzdol, krak pa poševno. Navpična pot do iste osnovnice je krajša od poševne, zato mora biti višina manjša od $13\,\text{cm}$.

**2. Popravek: najprej trikotnik, potem izrek.** Višina razdeli enakokraki trikotnik na dva enaka pravokotna trikotnika. Opiši enega z besedami:

- pravi kot je ob vznožju višine,
- hipotenuza je krak $13\,\text{cm}$ (leži nasproti pravega kota),
- ena kateta je **polovica** osnovnice, $5\,\text{cm}$,
- druga kateta je višina $v$.

Iščemo kateto, zato kvadrata odštejemo: $v^2 = 13^2 - 5^2 = 169 - 25 = 144$, torej $v = 12\,\text{cm}$. Višina je res krajša od kraka.

Pravilo za vsako nalogo: poišči pravi kot, nasproti njega je hipotenuza. Če iščeš hipotenuzo, kvadrata **seštej**. Če iščeš kateto, od kvadrata hipotenuze **odštej** kvadrat znane katete.

**3. Diagonala pravokotnika.** Diagonala razdeli pravokotnik s stranicama $a$ in $b$ na dva pravokotna trikotnika. Pravi kot je v oglišču pravokotnika, diagonala $d$ mu leži nasproti:

$$d = \sqrt{a^2 + b^2}$$

Pri kvadratu je $a = b$, zato $d = \sqrt{a^2 + a^2} = \sqrt{2a^2} = a\sqrt{2}$. To je razmerje s tablice: diagonala je $\sqrt{2} \approx 1{,}41$-krat daljša od stranice.

:::premisli
Igralec mora priti v nasprotni kot igrišča. Zakaj je pot po diagonali vedno krajša od poti ob dveh stranicah, $a + b$?
---
Diagonala in stranici tvorijo trikotnik. V vsakem trikotniku je ena stranica krajša od vsote drugih dveh, zato je $d < a + b$. Ravna pot je najkrajša.
:::

**4. Višina enakokrakega trikotnika.** Naj bo $a$ osnovnica in $b$ krak. Kot v točki 2 je hipotenuza krak, kateti sta $\dfrac{a}{2}$ in $v$:

$$v = \sqrt{b^2 - \left(\frac{a}{2}\right)^2}$$

Enakostranični trikotnik s stranico $a$ je poseben primer: krak je enak osnovnici, zato je $v = \sqrt{a^2 - \left(\frac{a}{2}\right)^2}$.

Tabela pove, kaj je v pogostih likih hipotenuza:

| Lik | Kateti | Hipotenuza |
|---|---|---|
| pravokotnik | stranici $a$, $b$ | diagonala $d$ |
| enakokraki trikotnik | $\frac{a}{2}$ in višina $v$ | krak $b$ |
| lestev ob zidu | višina na zidu, razdalja od zidu | lestev |

:::premisli
Krak ostane $13\,\text{cm}$, osnovnico pa podaljšamo z dolžine $10\,\text{cm}$ na $24\,\text{cm}$. Ali se višina poveča ali zmanjša? Napovej, nato izračunaj.
---
Zmanjša se. Hipotenuza ostane $13$, ena kateta zraste s $5$ na $12$, zato mora druga kateta upasti: $v = \sqrt{13^2 - 12^2} = \sqrt{25} = 5\,\text{cm}$. Trikotnik postane bolj ploščat.
:::

**5. Besedilne naloge.** Postopek je vedno enak:

1. Nariši skico in označi pravi kot (zid in tla, oglišče pravokotnika, vznožje višine).
2. Ugotovi, katera stranica je hipotenuza in kateri sta kateti.
3. Zapiši izrek, vstavi podatke in izračunaj. Na koncu koreni.
4. Preveri: hipotenuza mora biti najdaljša stranica. Odgovori s stavkom in enoto.

V simulaciji spodaj »Pitagorov izrek v uporabi« izberi lestev. Pusti dolžino lestve enako in jo odmikaj od zidu po korakih. Opazuj, da višina na zidu na začetku pada počasi, pri velikem odmiku pa vse hitreje.

## Rešeni primeri

### Primer 1 (lažji): tek čez igrišče

Igrišče za trening je dolgo $40\,\text{m}$ in široko $30\,\text{m}$. Igralec teče naravnost iz enega kota v nasprotnega. Kako dolga je njegova pot?

**Podatki:** dolžina $a = 40\,\text{m}$, širina $b = 30\,\text{m}$, igrišče je pravokotnik
**Iščemo:** diagonalo $d$

:::formula
$d = \sqrt{a^2 + b^2}$
:::

**Rešitev:**

1. Pravi kot je v oglišču igrišča, diagonala mu leži nasproti, zato je hipotenuza.
2. Iščemo hipotenuzo, zato kvadrata seštejemo: $d^2 = 40^2 + 30^2 = 1600 + 900 = 2500$.
3. Korenimo, ker iščemo $d$, ne $d^2$: $d = \sqrt{2500} = 50\,\text{m}$.
4. Preverimo: $50$ je več kot $40$ in manj kot $40 + 30 = 70$.
5. Odgovor: igralec preteče $50\,\text{m}$, kar je $20\,\text{m}$ manj kot ob robu igrišča.

### Primer 2: navijaška zastavica

Zastavica ima obliko enakokrakega trikotnika. Osnovnica (ob palici) meri $30\,\text{cm}$, vsak krak $39\,\text{cm}$. Kolikšna je višina na osnovnico in koliko blaga potrebujemo za eno zastavico?

**Podatki:** osnovnica $a = 30\,\text{cm}$, krak $b = 39\,\text{cm}$
**Iščemo:** višino $v$ in ploščino $S$

:::formula
$v = \sqrt{b^2 - \left(\dfrac{a}{2}\right)^2}$, nato $S = \dfrac{a \cdot v}{2}$
:::

**Rešitev:**

1. Višina razpolovi osnovnico, zato je ena kateta $\dfrac{a}{2} = 15\,\text{cm}$. Hipotenuza je krak $39\,\text{cm}$.
2. Iščemo kateto, zato odštejemo: $v^2 = 39^2 - 15^2 = 1521 - 225 = 1296$.
3. Korenimo: $v = \sqrt{1296} = 36\,\text{cm}$.
4. Ploščina trikotnika je polovica produkta osnovnice in višine: $S = \dfrac{30 \cdot 36}{2} = 540\,\text{cm}^2$.
5. Preverimo: $15^2 + 36^2 = 225 + 1296 = 1521 = 39^2$.
6. Odgovor: višina zastavice je $36\,\text{cm}$, za eno zastavico potrebujemo $540\,\text{cm}^2$ blaga (brez robov).

### Primer 3 (težji): rampa za rolkanje

Ravna poševna ploskev rampe je dolga $2{,}6\,\text{m}$. Zgornji rob rampe je $1\,\text{m}$ nad tlemi. V kotu parka je za rampo na voljo $6\,\text{m}$ dolg pas tal. Koliko tal zavzame rampa in koliko prostora ostane za zalet?

**Podatki:** poševna ploskev $c = 2{,}6\,\text{m}$, višina $b = 1\,\text{m}$, pas tal $6\,\text{m}$
**Iščemo:** dolžino rampe na tleh $a$ in preostanek pasu

:::formula
$a = \sqrt{c^2 - b^2}$, preostanek $= 6\,\text{m} - a$
:::

**Rešitev:**

1. Skica: navpična stranica rampe stoji pravokotno na tla. Pravi kot je spodaj pod zgornjim robom, poševna ploskev mu leži nasproti, zato je hipotenuza.
2. Iščemo kateto na tleh, zato odštejemo: $a^2 = 2{,}6^2 - 1^2 = 6{,}76 - 1 = 5{,}76$.
3. Korenimo: $a = \sqrt{5{,}76} = 2{,}4\,\text{m}$ (ker $24^2 = 576$).
4. Drugi korak naloge: $6 - 2{,}4 = 3{,}6\,\text{m}$ ostane za zalet.
5. Preverimo: $2{,}4 < 2{,}6$, kateta je krajša od hipotenuze.
6. Odgovor: rampa zavzame $2{,}4\,\text{m}$ tal, za zalet ostane $3{,}6\,\text{m}$.

### Primer 4 – zdaj ti: nogometno igrišče

Veliko nogometno igrišče je dolgo $105\,\text{m}$ in široko $68\,\text{m}$. Kolikšna je diagonala? Zaokroži na desetinko metra.

**Podatki:** $a = 105\,\text{m}$, $b = 68\,\text{m}$
**Iščemo:** diagonalo $d$

:::formula
$d = \sqrt{a^2 + b^2}$
:::

**Rešitev:**

1. Diagonala je nasproti pravega kota v oglišču, zato je hipotenuza in kvadrata seštejemo.
2. Kvadrata: $105^2 = 11025$ in $68^2 = 4624$.
3. Seštej, koreni in zaokroži sam, nato preveri:

:::premisli
Koliko je $d$?
---
$d^2 = 11025 + 4624 = 15649$, $d = \sqrt{15649} \approx 125{,}1\,\text{m}$. Ker $125^2 = 15625$, je rezultat malo nad $125$, kar se ujema.
:::

## Pogoste napake

- **Števila iz naloge naravnost v izrek.** Pri enakokrakem trikotniku z osnovnico $10$ in krakom $13$ nekdo izračuna $\sqrt{10^2 + 13^2}$. Osnovnica in krak nista kateti istega pravokotnega trikotnika. Najprej nariši višino in poišči pravokotni trikotnik.
- **Cela osnovnica namesto polovice.** Pri višini enakokrakega trikotnika je kateta $\dfrac{a}{2}$, ne $a$. Višina pade v razpolovišče osnovnice, zato pravokotni trikotnik vsebuje le njeno polovico.
- **Seštevanje, ko iščeš kateto.** Pri višini, rampi ali lestvi iščeš kateto, zato kvadrate odšteješ. Če je višina daljša od kraka, si seštel namesto odštel.
- **Odštevanje dolžin namesto kvadratov.** $\sqrt{2{,}6^2 - 1^2}$ ni $2{,}6 - 1 = 1{,}6$. Izrek govori o ploščinah kvadratov, zato najprej kvadriraš, šele na koncu koreniš.
- **Pozabljen koren.** $d^2 = 2500$ še ni diagonala. Na koncu koreni in zapiši enoto: $d = 50\,\text{m}$.

## Povzetek

- V vsaki nalogi najprej poišči ali nariši pravokotni trikotnik in določi hipotenuzo (nasproti pravega kota).
- Diagonala pravokotnika: $d = \sqrt{a^2 + b^2}$; diagonala kvadrata: $d = a\sqrt{2}$.
- Višina enakokrakega trikotnika: $v = \sqrt{b^2 - \left(\frac{a}{2}\right)^2}$ ($a$ osnovnica, $b$ krak).
- Hipotenuzo dobiš s seštevanjem kvadratov, kateto z odštevanjem; na koncu koreniš.
- Preveri, da je hipotenuza najdaljša stranica, in odgovori s stavkom in enoto.

## Drugače: Kot zgodba

Na eni od starih mezopotamskih tablic je naloga o tramu, ki stoji pokonci ob zidu. Tram je dolg $30$ enot. Njegov zgornji konec zdrsne po zidu $6$ enot navzdol. Za koliko se je spodnji konec odmaknil od zidu?

Predstavljaj si učenca pisarske šole, ki se loti naloge. Najprej si nariše zid, tla in poševni tram. Pravi kot je tam, kjer se zid stika s tlemi. Tram leži nasproti njega, zato je hipotenuza in ostane dolg $30$ enot.

Zgornji konec je zdaj $30 - 6 = 24$ enot visoko. To je ena kateta. Druga kateta je iskani odmik od zidu. Učenec od kvadrata hipotenuze odšteje kvadrat znane katete: $30^2 - 24^2 = 900 - 576 = 324$. Korenjenje da $\sqrt{324} = 18$ enot.

Zdrs za $6$ enot na zidu je spodnji konec odmaknil kar za $18$ enot. Isto vidiš v simulaciji z lestvijo: majhna sprememba na eni kateti lahko pomeni veliko spremembo na drugi.

## Drugače: Korak za korakom s številkami

Naloga: trikotnik za zlaganje biljardnih krogel je enakostraničen s stranico $30\,\text{cm}$. Kako visok je?

1. Nariši trikotnik in višino na eno stranico. Višina jo razpolovi.
2. Pravokotni trikotnik: hipotenuza $30$, kateta $\dfrac{30}{2} = 15$, druga kateta je višina $v$.
3. Iščemo kateto, zato odštejemo: $v^2 = 30^2 - 15^2$.
4. Kvadrata posebej: $30^2 = 900$, $15^2 = 225$.
5. Odštejemo: $900 - 225 = 675$.
6. Ocena: $25^2 = 625$ in $26^2 = 676$, zato je $v$ tik pod $26$. Natančneje $v \approx 25{,}98\,\text{cm}$, zaokroženo $26{,}0\,\text{cm}$.
7. Preverimo: višina je krajša od stranice $30\,\text{cm}$.

Pogoste trojice ti prihranijo račun:

| Kateta | Kateta | Hipotenuza |
|:---:|:---:|:---:|
| $3$ | $4$ | $5$ |
| $5$ | $12$ | $13$ |
| $8$ | $15$ | $17$ |
| $7$ | $24$ | $25$ |

Veljajo tudi njihovi večkratniki: $30$, $40$, $50$ iz primera 1 je $10$-krat $3$, $4$, $5$, zastavica $15$, $36$, $39$ pa $3$-krat $5$, $12$, $13$.

## Drugače: Bolj natančno

Zakaj višina razpolovi osnovnico enakokrakega trikotnika? Naj bo $ABC$ enakokraki trikotnik z osnovnico $AB$ in krakoma $AC = BC$. Višina iz $C$ seka osnovnico v točki $D$. Trikotnika $ADC$ in $BDC$ imata skupno stranico $CD$, enaka kraka $AC = BC$ in pravi kot pri $D$.

Po Pitagorovem izreku je $AD^2 = AC^2 - CD^2$ in $DB^2 = BC^2 - CD^2$. Desni strani sta enaki, zato je $AD = DB$: točka $D$ razpolovi osnovnico.

Za enakostranični trikotnik s stranico $a$ dobimo splošno formulo:

$$v = \sqrt{a^2 - \frac{a^2}{4}} = \sqrt{\frac{3a^2}{4}} = \frac{a\sqrt{3}}{2}$$

Pri $a = 30\,\text{cm}$ je $v = 15\sqrt{3} \approx 25{,}98\,\text{cm}$, kar se ujema z računom zgoraj.

## Preveri se

? Pri treh nalogah iščemo kateto, pri eni pa hipotenuzo. Katera naloga je izjema?
- Višina enakokrakega trikotnika, če poznaš osnovnico in krak.
~ Tu je krak hipotenuza, višina pa kateta, zato kvadrata odšteješ.
+ Diagonala pravokotnika, če poznaš obe stranici.
- Razdalja med lestvijo in zidom, če poznaš dolžino lestve in višino, do katere sega.
~ Lestev leži nasproti pravega kota med zidom in tlemi, zato je ona hipotenuza, razdalja od zidu pa kateta.
- Dolžina rampe na tleh, če poznaš poševno ploskev in višino.
~ Poševna ploskev je hipotenuza, dolžina na tleh pa kateta.
> Diagonala leži nasproti pravega kota v oglišču pravokotnika, zato je hipotenuza in kvadrata stranic seštejemo. V ostalih treh nalogah je hipotenuza znana.

? Košarkarsko igrišče meri $28\,\text{m} \times 15\,\text{m}$. Kolikšna je diagonala, zaokrožena na desetinko?
- $43\,\text{m}$
~ To je vsota stranic, pot ob robu. Ravna pot je krajša: seštej kvadrata in koreni.
- $1009\,\text{m}$
~ To je $d^2$. Na koncu moraš še koreniti.
+ $31{,}8\,\text{m}$
- $23{,}6\,\text{m}$
~ Kvadrata si odštel. Diagonala je hipotenuza, zato kvadrata seštejemo; tudi mora biti daljša od $28\,\text{m}$.
> $d = \sqrt{28^2 + 15^2} = \sqrt{784 + 225} = \sqrt{1009} \approx 31{,}8\,\text{m}$.

? Enakokrakemu trikotniku povečamo osnovnico, kraka ostaneta enaka. Kaj se zgodi z višino na osnovnico?
- Poveča se, ker je trikotnik večji.
~ Večja osnovnica ne pomeni višjega trikotnika. Ker kraka ostaneta enaka, se vrh spusti.
- Ostane enaka, ker se kraka nista spremenila.
~ Krak je hipotenuza. Če hipotenuza ostane, ena kateta pa zraste, se druga kateta spremeni.
+ Zmanjša se, ker pri enaki hipotenuzi (krak) ena kateta zraste, zato mora druga kateta upasti.
> $v^2 = b^2 - \left(\frac{a}{2}\right)^2$: ko se $\frac{a}{2}$ poveča, odštejemo več, zato je $v$ manjša.

? Luka računa višino enakokrakega trikotnika z osnovnico $16\,\text{cm}$ in krakom $10\,\text{cm}$. (1) Hipotenuza je krak, $10\,\text{cm}$. (2) Ena kateta je polovica osnovnice, $8\,\text{cm}$. (3) $v^2 = 10^2 + 8^2 = 164$. (4) $v = \sqrt{164} \approx 12{,}8\,\text{cm}$. V katerem koraku je napaka?
- V koraku (1).
~ Krak res leži nasproti pravega kota ob vznožju višine, zato je hipotenuza.
- V koraku (2).
~ Višina razpolovi osnovnico, zato je kateta res $8\,\text{cm}$.
+ V koraku (3).
- V koraku (4).
~ Korenjenje je pravilno izvedeno; napačna je že vrednost pod korenom.
> Iščemo kateto, zato bi moral odšteti: $v^2 = 100 - 64 = 36$, $v = 6\,\text{cm}$. Višina $12{,}8\,\text{cm}$ bi bila daljša od kraka, kar ni mogoče.

? Ravna drsna ploskev tobogana je dolga $3{,}4\,\text{m}$, navpična lestev do vrha pa $1{,}6\,\text{m}$. Tla so vodoravna. Kako daleč od vznožja lestve se tobogan konča?
- $1{,}8\,\text{m}$
~ Odštel si dolžini. Izrek velja za kvadrate: najprej kvadriraj, nato odštej in koreni.
- $3{,}8\,\text{m}$
~ Kvadrata si seštel, zato je rezultat daljši od drsne ploskve. Ta je hipotenuza, iščeš kateto.
+ $3\,\text{m}$
- $9\,\text{m}$
~ To je kvadrat iskane razdalje. Koreni še: $\sqrt{9} = 3$.
> Drsna ploskev je hipotenuza: $\sqrt{3{,}4^2 - 1{,}6^2} = \sqrt{11{,}56 - 2{,}56} = \sqrt{9} = 3\,\text{m}$.

:::simboli
a | stranica pravokotnika; osnovnica enakokrakega trikotnika; v primeru 3 kateta na tleh | | | pomen je odvisen od lika
b | druga stranica pravokotnika; krak enakokrakega trikotnika; v primeru 3 višina | | |
c | hipotenuza | c^2 = a^2 + b^2 | | leži nasproti pravega kota
d | diagonala pravokotnika | d = \sqrt{a^2 + b^2} | | hipotenuza v pravokotniku
v | višina na osnovnico | v = \sqrt{b^2 - \left(\frac{a}{2}\right)^2} | | kateta pravokotnega trikotnika
S | ploščina trikotnika | S = \frac{a \cdot v}{2} | |
:::
