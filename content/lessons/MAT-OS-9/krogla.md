---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poleti po neurju v novicah pogosto piše: »Padala je toča, debela kot oreh, ponekod kot teniška žogica.« Zrno s premerom $1\,\text{cm}$ na avtu komaj pusti sled, zrno s premerom $4\,\text{cm}$ pa naredi globoko vdolbino. Premer je le štirikrat večji. Je tudi ledu v velikem zrnu le štirikrat več?

Zrno toče je skoraj krogla. Krogle so tudi dežne kapljice, milni mehurčki, pomaranče in (približno) planeti. Pri vsaki nas zanima, koliko prostora zavzame (prostornina) in kako velika je njena ploskev (površina).

Pri valju in stožcu si obe količini že računal. Ploščino kroga ($\pi r^2$) in obseg kroga ($2\pi r$) poznaš. Za kroglo potrebuješ le en podatek: polmer. Odgovor na vprašanje o toči pa te bo presenetil.

## Razlaga

**1. Kaj je krogla.** **Krogla** s središčem $S$ in **polmerom** $r$ je telo iz vseh točk prostora, ki so od $S$ oddaljene največ $r$. Krogla je torej polna, kot zrno toče. Njena meja je **kroglina ploskev** (sfera): vse njene točke so od $S$ oddaljene natanko $r$. Premer je dvakrat daljši od polmera: $d = 2r$.

Tako kot valj in stožec je tudi krogla vrtenina. Valj dobiš z vrtenjem pravokotnika, stožec z vrtenjem pravokotnega trikotnika, kroglo pa z vrtenjem polkroga okoli njegovega premera.

**2. Krogla ob valju.** Krogle ne poznaš, valj pa dobro. Zato kroglo vstavimo v najmanjši valj, v katerega gre: polmer valja je $r$, višina $2r$. Krogla se dotika obeh osnovnih ploskev in plašča. Osni presek kaže, kako tesno se prilega:

:::risba skica
opis: Osni presek krogle v valju. Kvadrat s stranico 2r in v njem krog s središčem S in polmerom r, ki se dotika vseh štirih stranic kvadrata.
območje: 0; 0 .. 8; 6
enota: 36
pravokotnik: 2; 1 .. 6; 5 | siva
krog: 4; 3 | 2 | modra | debelo
črta: 4; 3 -> 6; 3 | oranžna
točka: 4; 3 | S | pod
napis: 5; 3 | r | nad
napis: 4; 0,5 | 2r | sredina
napis: 6,8; 3 | 2r | sredina
:::

Razlike so pomembnejše od podobnosti. Krogla nima ne osnovnih ploskev ne robov ne oglišč. Njene ploskve ne moremo razgrniti v ravnino brez trganja ali raztegovanja; zato je vsak zemljevid sveta nekje popačen. Mreže, iz katere smo izračunali površino valja, torej pri krogli ni.

:::premisli
Celotna površina tega valja je $2\pi r^2 + 2\pi r \cdot 2r = 6\pi r^2$. Napovej: je površina krogle v njem večja, enaka ali manjša? In kolikšen del valja zapolni krogla: več ali manj kot polovico?
---
Površina krogle je manjša, saj je krogla v valju in ne seže v njegove »vogale«. Prostornine zapolni več kot polovico: že v osnem preseku krog pokrije približno $79\,\%$ kvadrata, ob dnu in vrhu pa ostane več praznega prostora, zato je delež nekaj manjši. Natančni odgovor ($\frac{2}{3}$) je v tabeli spodaj.
:::

Formule je pred več kot 2000 leti našel grški matematik Arhimed, prav s primerjavo s tem valjem (valj: polmer $r$, višina $2r$, prostornina $\pi r^2 \cdot 2r = 2\pi r^3$):

| | valj | krogla |
|---|---|---|
| osnovni ploskvi | $2\pi r^2$ | nima |
| plašč / kroglina ploskev | $4\pi r^2$ | $4\pi r^2$ |
| površina | $6\pi r^2$ | $4\pi r^2$ |
| prostornina | $2\pi r^3$ | $\frac{4}{3}\pi r^3$ |

**3. Površina krogle.** Kroglina ploskev je enako velika kot plašč valja okoli nje:

$$P = 4\pi r^2$$

Prerez krogle skozi središče je največji krog na krogli, s ploščino $\pi r^2$. Površina krogle je torej štirikratnik tega kroga. Lupina olupljene pomaranče zato pokrije približno štiri kroge s polmerom pomaranče.

**4. Prostornina krogle.** Krogla zapolni dve tretjini valja okoli sebe:

$$V = \frac{4}{3}\pi r^3$$

Primerjaj še s stožcem iz istega valja (polmer $r$, višina $2r$): njegova prostornina je $\frac{1}{3}\pi r^2 \cdot 2r = \frac{2}{3}\pi r^3$. Valj, krogla in stožec z istim polmerom in višino $2r$ imajo prostornine v razmerju $3 : 2 : 1$.

**5. Kvadrat in kub.** V površini je polmer na **drugo** potenco, ker je površina ploskev (meri se v $\text{cm}^2$). V prostornini je na **tretjo**, ker je prostornina prostor (meri se v $\text{cm}^3$). Ko polmer podvojiš, je $(2r)^2 = 4r^2$ in $(2r)^3 = 8r^3$: površina je štirikrat, prostornina pa osemkrat večja. Spomni se še: $1\,\text{dm}^3 = 1\,\text{l}$.

V simulaciji spodaj (Krogla: površina in prostornina) izberi kroglo in ji podvoji polmer. Opazuj, kolikokrat se poveča površina in kolikokrat prostornina. V simulaciji »3D: Krogla (prerez z ravnino)« premikaj ravnino: prerez je vedno krog, največji pa je, ko gre ravnina skozi središče.

:::premisli
Vrni se k toči iz uvoda. Kolikokrat več ledu je v zrnu s premerom $4\,\text{cm}$ kot v zrnu s premerom $1\,\text{cm}$? Kolikokrat večja je njegova površina?
---
Polmer je $4$-krat večji, zato je ledu $4^3 = 64$-krat več, površina pa je $4^2 = 16$-krat večja. Eno veliko zrno ima toliko ledu kot $64$ majhnih.
:::

**6. Kako računamo.**

1. Preveri, ali imaš podan polmer ali premer. Če imaš premer, ga najprej razpolovi: $r = d : 2$.
2. Vstavi $r$ v ustrezno formulo.
3. Najprej izračunaj potenco ($r^2$ ali $r^3$), šele nato množi s $4\pi$ oziroma $\frac{4}{3}\pi$.
4. Rezultat lahko pustiš v obliki z $\pi$ (natančno) ali ga zaokrožiš ($\pi \approx 3{,}14159$).
5. Zapiši pravilno enoto.

**7. Obratna naloga.** Če poznaš površino ali prostornino, iz formule izraziš $r^2$ ali $r^3$ in nato koreniš (kvadratni oziroma kubični koren). Kubični koren iz $216$ je število, ki na tretjo potenco da $216$: to je $6$, ker je $6 \cdot 6 \cdot 6 = 216$.

## Rešeni primeri

### Primer 1 (lažji): polmer je podan

Krogla ima polmer $r = 6\,\text{cm}$. Izračunaj njeno površino in prostornino.

**Podatki:** $r = 6\,\text{cm}$
**Iščemo:** površino $P$ in prostornino $V$

:::formula
$P = 4\pi r^2$ in $V = \dfrac{4}{3}\pi r^3$
:::

**Rešitev:**

1. **Površina:** $P = 4\pi r^2 = 4\pi \cdot 6^2$.
2. Najprej potenca, ker ima prednost pred množenjem: $6^2 = 36$. Torej $P = 4\pi \cdot 36 = 144\pi\,\text{cm}^2$.
3. Zaokrožimo: $P \approx 452{,}39\,\text{cm}^2$.
4. **Prostornina:** $V = \frac{4}{3}\pi r^3 = \frac{4}{3}\pi \cdot 6^3$.
5. $6^3 = 6 \cdot 6 \cdot 6 = 216$. Velja $\frac{4}{3} \cdot 216 = 4 \cdot 72 = 288$. Torej $V = 288\pi\,\text{cm}^3 \approx 904{,}78\,\text{cm}^3$.
6. Preverimo smiselnost: kocka s stranico $12\,\text{cm}$ ($= 2r$), v katero se krogla ravno prilega, ima prostornino $12^3 = 1728\,\text{cm}^3$. Krogla ima manj, $904{,}78\,\text{cm}^3$, kar je nekaj več kot polovica kocke (približno $52\,\%$). Rezultat je smiseln.
7. Odgovor: površina krogle je $144\pi\,\text{cm}^2 \approx 452{,}39\,\text{cm}^2$, prostornina $288\pi\,\text{cm}^3 \approx 904{,}78\,\text{cm}^3$.

### Primer 2: podan je premer

Nogometna žoga ima premer $22\,\text{cm}$. Koliko materiala je potrebnega za njeno prevleko (površina) in koliko zraka gre vanjo (prostornina)? Privzemi, da je žoga popolna krogla.

**Podatki:** premer $d = 22\,\text{cm}$, žoga je krogla
**Iščemo:** površino $P$ in prostornino $V$ (v litrih)

:::formula
$r = d : 2$, nato $P = 4\pi r^2$ in $V = \dfrac{4}{3}\pi r^3$
:::

**Rešitev:**

1. Podan je premer, zato najprej izračunamo polmer: $r = 22 : 2 = 11\,\text{cm}$. To je pogosta past: če bi vstavili $22$, bi dobili napačen rezultat.
2. **Površina:** $P = 4\pi \cdot 11^2 = 4\pi \cdot 121 = 484\pi\,\text{cm}^2 \approx 1520{,}53\,\text{cm}^2$.
3. **Prostornina:** $11^3 = 1331$, zato $V = \frac{4}{3}\pi \cdot 1331 = \frac{5324}{3}\pi\,\text{cm}^3 \approx 5575{,}28\,\text{cm}^3$.
4. Pretvorba: $5575{,}28\,\text{cm}^3 \approx 5{,}58\,\text{dm}^3 \approx 5{,}58\,\text{l}$.
5. **Odgovor.** Za prevleko potrebujemo približno $1520{,}5\,\text{cm}^2$ materiala, v žogo gre približno $5{,}6\,\text{l}$ zraka.

### Primer 3 (težji): iz površine do prostornine

Površina krogle je $100\pi\,\text{cm}^2$. Kolikšna je njena prostornina?

**Podatki:** $P = 100\pi\,\text{cm}^2$
**Iščemo:** prostornino $V$

:::formula
Iz $P = 4\pi r^2$ izrazimo $r^2 = \dfrac{P}{4\pi}$, nato $V = \dfrac{4}{3}\pi r^3$
:::

**Rešitev:**

1. Prostornino lahko izračunamo samo iz polmera, zato ga najprej poiščemo iz površine.
2. Zapišemo: $4\pi r^2 = 100\pi$.
3. Obe strani delimo s $4\pi$: $r^2 = \dfrac{100\pi}{4\pi} = 25$. Število $\pi$ se pokrajša.
4. Korenimo: $r = \sqrt{25} = 5\,\text{cm}$. Polmer je pozitiven, zato negativne rešitve ne upoštevamo.
5. Zdaj izračunamo prostornino: $V = \frac{4}{3}\pi \cdot 5^3 = \frac{4}{3}\pi \cdot 125 = \frac{500}{3}\pi\,\text{cm}^3$.
6. Zaokrožimo: $V \approx 523{,}60\,\text{cm}^3$.
7. Preverimo: $4\pi \cdot 5^2 = 4\pi \cdot 25 = 100\pi$, kar se ujema s podatkom.
8. Odgovor: polmer krogle je $5\,\text{cm}$, prostornina pa $\frac{500}{3}\pi\,\text{cm}^3 \approx 523{,}60\,\text{cm}^3$.

### Primer 4 – zdaj ti: toča

Po neurju so izmerili zrno toče s premerom $4\,\text{cm}$. Koliko ledu je v njem? Koliko takih zrn bi skupaj dalo $1\,\text{l}$ ledu? Privzemi, da je zrno krogla.

**Podatki:** premer zrna $d = 4\,\text{cm}$, $1\,\text{l} = 1000\,\text{cm}^3$
**Iščemo:** prostornino zrna $V$ in število zrn za $1\,\text{l}$ ledu

:::formula
$r = d : 2$, $V = \dfrac{4}{3}\pi r^3$, nato število zrn $= 1000\,\text{cm}^3 : V$
:::

**Rešitev:**

1. Najprej polmer, ker formula potrebuje $r$: $r = 4 : 2 = 2\,\text{cm}$.
2. Potenca: $2^3 = 8$, torej $V = \frac{4}{3}\pi \cdot 8\,\text{cm}^3$.
3. Izračunaj $V$ sam (na dve decimalki), nato pa še, koliko zrn da $1\,\text{l}$ ledu.

:::premisli
Kolikšna je prostornina zrna in koliko zrn potrebujemo za $1\,\text{l}$?
---
$V = \frac{32}{3}\pi\,\text{cm}^3 \approx 33{,}51\,\text{cm}^3$. Število zrn: $1000 : 33{,}51 \approx 29{,}8$, torej približno $30$ zrn toče s premerom $4\,\text{cm}$ da liter ledu.
:::

## Pogoste napake

- **Premer namesto polmera.** »V nalogi piše $22\,\text{cm}$, to vstavim za $r$.« Toda $22\,\text{cm}$ je premer, polmer je za polovico manjši. Ker je v prostornini $r^3$, dobiš $2^3 = 8$-krat preveliko prostornino. Popravek: pred računanjem vedno preveri, ali je dan $r$ ali $d$, in izračunaj $r = d : 2$.
- **Zamenjava formul ali enot.** »Površina je $\frac{4}{3}\pi r^3$, saj je to formula za kroglo.« Toda površina je ploskev, zato ima $r^2$ in enoto $\text{cm}^2$; $r^3$ in $\text{cm}^3$ spadata k prostornini. Popravek: enota ti pove, katera formula je prava: $\text{cm}^2$ gre z $r^2$, $\text{cm}^3$ z $r^3$.
- **Pozabljeno deljenje s $3$.** »$V = 4\pi r^3$.« Ulomek $\frac{4}{3}$ je del formule; brez deljenja s $3$ je prostornina $3$-krat prevelika (večja celo od valja okoli krogle, ki ima $2\pi r^3$). Popravek: preveri, ali je krogla manjša od valja okoli sebe.
- **»Dvakrat večji polmer, dvakrat več.«** Učenec misli, da se prostornina poveča toliko kot polmer. Toda $r$ je v prostornini na tretjo potenco: dvakrat večji polmer da $8$-krat večjo prostornino in $4$-krat večjo površino. Popravek: faktor povečave polmera kubiraj za prostornino in kvadriraj za površino.
- **Pozabljen ali napačen koren pri obratni nalogi.** Iz $r^2 = 25$ učenec zapiše $r = 25$, iz $r^3 = 216$ pa $r = \sqrt{216}$. Kvadrat se odpravi s kvadratnim korenom, kub pa s kubičnim: iščeš število, ki na tretjo da $216$, to je $6$. Popravek: rezultat preveri tako, da ga vstaviš nazaj v formulo.

## Povzetek

- Krogla so vse točke prostora, ki so od središča $S$ oddaljene največ $r$; njena meja je kroglina ploskev. Premer $d = 2r$.
- Površina: $P = 4\pi r^2$ (štirikratnik ploščine največjega kroga; enako kot plašč valja s polmerom $r$ in višino $2r$).
- Prostornina: $V = \dfrac{4}{3}\pi r^3$, to je $\frac{2}{3}$ valja s polmerom $r$ in višino $2r$. Valj, krogla in stožec v tem valju: $3 : 2 : 1$.
- Če je podan premer, najprej izračunaj $r = d : 2$.
- Polmer $k$-krat večji: površina $k^2$-krat, prostornina $k^3$-krat večja.
- Pri obratnih nalogah iz $P$ ali $V$ izrazi $r^2$ oziroma $r^3$ in koreni (kvadratni oziroma kubični koren).

## Drugače: Na sliki

**Površina: štirje krogi.** Pomarančo prereži skozi sredino in na papir štirikrat obriši njen prerez. Dobiš štiri kroge s polmerom pomaranče. Ko pomarančo olupiš in koščke lupine polagaš v kroge, lupina zapolni približno vse štiri.

:::risba skica
opis: Štirje enako veliki krogi s polmerom r, vsak s ploščino π r². Skupaj imajo ploščino 4 π r², toliko kot površina krogle s polmerom r.
območje: 0; 0 .. 10; 3
enota: 30
krog: 1,6; 1,5 | 1 | oranžna
krog: 3,8; 1,5 | 1 | oranžna
krog: 6; 1,5 | 1 | oranžna
krog: 8,2; 1,5 | 1 | oranžna
napis: 1,6; 1,5 | π r^2 | sredina
napis: 3,8; 1,5 | π r^2 | sredina
napis: 6; 1,5 | π r^2 | sredina
napis: 8,2; 1,5 | π r^2 | sredina
:::

**Prostornina: krogla iz piramid.** Kroglino ploskev razreži na zelo veliko drobnih koščkov in vsak košček poveži s središčem. Krogla razpade na tanke »piramide« z vrhom v središču. Višina vsake je polmer $r$, njihove osnovne ploskve pa skupaj pokrijejo površino krogle $4\pi r^2$. Piramida ima prostornino $\frac{1}{3} \cdot O \cdot v$, zato imajo vse skupaj

$$V = \frac{1}{3} \cdot 4\pi r^2 \cdot r = \frac{4}{3}\pi r^3.$$

Tako iz površine dobiš prostornino: tretjina od »površina krat polmer«.

## Drugače: Iz vsakdanjega življenja

**Konzerva s tremi teniškimi žogicami** je znan primer: žogice se prilegajo valju, ki ima polmer enak polmeru žogice. Ena žogica zavzame $\frac{2}{3}$ prostornine valja z višino $2r$. Račun za $r = 3\,\text{cm}$: valj ima $V = \pi \cdot 3^2 \cdot 6 = 54\pi\,\text{cm}^3$, krogla $V = \frac{4}{3}\pi \cdot 27 = 36\pi\,\text{cm}^3$, in res $\dfrac{36\pi}{54\pi} = \dfrac{2}{3}$.

**Milni mehurček** je skoraj popolna krogla. To ni naključje: od vseh teles z isto prostornino ima krogla najmanjšo površino, zato napeta opna, ki teži k čim manjši površini, mehurček oblikuje v kroglo.

**Dežne kapljice.** Dežna kapljica s premerom $2\,\text{mm}$ nastane, ko se v oblaku zlije zelo veliko drobnih kapljic. Kapljica s stokrat manjšim premerom ima $100^3 = 1\,000\,000$-krat manjšo prostornino, zato jih je za eno dežno kapljico potrebnih okoli milijon.

## Drugače: Korak za korakom s številkami

Kako se spreminjata površina in prostornina, ko polmer povečujemo:

| $r$ | $P = 4\pi r^2$ | $V = \frac{4}{3}\pi r^3$ |
|---|---|---|
| $1\,\text{cm}$ | $4\pi \approx 12{,}57\,\text{cm}^2$ | $\frac{4}{3}\pi \approx 4{,}19\,\text{cm}^3$ |
| $2\,\text{cm}$ | $16\pi \approx 50{,}27\,\text{cm}^2$ | $\frac{32}{3}\pi \approx 33{,}51\,\text{cm}^3$ |
| $4\,\text{cm}$ | $64\pi \approx 201{,}06\,\text{cm}^2$ | $\frac{256}{3}\pi \approx 268{,}08\,\text{cm}^3$ |

Opazuj: ko polmer podvojimo ($1 \to 2$), se površina poveča $4$-krat ($4\pi \to 16\pi$), prostornina pa $8$-krat ($\frac{4}{3}\pi \to \frac{32}{3}\pi$). To sledi iz formul: $(2r)^2 = 4r^2$ in $(2r)^3 = 8r^3$.

Splošno pravilo: če polmer pomnožimo s $k$, se površina pomnoži s $k^2$, prostornina pa s $k^3$.

## Drugače: Bolj natančno

Zakaj je prostornina krogle $\frac{4}{3}\pi r^3$? Pokažimo to s primerjavo presekov, in sicer za **polkroglo**.

Vzemimo tri telesa, vsa z višino $r$ in polmerom osnovne ploskve $r$:

- polkroglo s polmerom $r$ (ravna ploskev leži na tleh),
- valj s polmerom $r$ in višino $r$,
- stožec (s konico navzdol, vrhom v središču spodnje ploskve valja), ki ima polmer $r$ in višino $r$. Izdolben je iz valja.

Na višini $h$ od tal presekamo vsa telesa z vodoravno ravnino in primerjamo ploščini presekov.

- Presek polkrogle je krog s polmerom $\sqrt{r^2 - h^2}$ (Pitagorov izrek v pravokotnem trikotniku s hipotenuzo $r$ od središča do roba preseka in kateto $h$), torej s ploščino $\pi(r^2 - h^2)$.
- Presek valja brez stožca je kolobar (krog, iz katerega je izrezan manjši krog z istim središčem). Zunanji krog ima ploščino $\pi r^2$. Notranji krog je presek stožca; ker ima stožec enak polmer in višino, ima na višini $h$ polmer $h$ in ploščino $\pi h^2$. Ploščina kolobarja je $\pi r^2 - \pi h^2 = \pi(r^2 - h^2)$.

Na **vsaki višini** sta preseka enako velika. Telesi, ki imata na vsaki višini enako velika preseka, imata enako prostornino (Cavalierijevo načelo). Zato imata polkrogla in »valj minus stožec« enako prostornino:

$$V_{\text{polkrogle}} = \pi r^2 \cdot r - \frac{1}{3}\pi r^2 \cdot r$$

$$V_{\text{polkrogle}} = \pi r^3 - \frac{1}{3}\pi r^3 = \frac{2}{3}\pi r^3.$$

Cela krogla je dvakratnik: $V = 2 \cdot \frac{2}{3}\pi r^3 = \frac{4}{3}\pi r^3$.

Formula za površino ne sledi tako preprosto, zato jo v osnovni šoli sprejmemo kot znan rezultat.

## Preveri se

? Kateri par (površina; prostornina) velja za kroglo s polmerom $3\,\text{cm}$?
- $P = 36\pi\,\text{cm}^2$; $V = 108\pi\,\text{cm}^3$
~ Pri prostornini si pozabil deliti s $3$: $4\pi \cdot 27 = 108\pi$. Formula je $V = \frac{4}{3}\pi r^3$.
- $P = 12\pi\,\text{cm}^2$; $V = 36\pi\,\text{cm}^3$
~ $12\pi$ je $4\pi \cdot 3$: pozabil si kvadrirati polmer. Površina je $4\pi r^2$.
+ $P = 36\pi\,\text{cm}^2$; $V = 36\pi\,\text{cm}^3$
- $P = 144\pi\,\text{cm}^2$; $V = 288\pi\,\text{cm}^3$
~ To sta površina in prostornina krogle s polmerom $6\,\text{cm}$: za $r$ si vstavil premer $6\,\text{cm}$.
> $P = 4\pi \cdot 3^2 = 36\pi\,\text{cm}^2$ in $V = \frac{4}{3}\pi \cdot 3^3 = \frac{4}{3}\pi \cdot 27 = 36\pi\,\text{cm}^3$. Števili sta enaki le pri $r = 3$, enoti pa ne: površina je v $\text{cm}^2$, prostornina v $\text{cm}^3$.

? Zrno toče ima premer $2\,\text{cm}$. Oceni brez računala: približno koliko ledu je v njem?
- približno $34\,\text{cm}^3$
~ Za polmer si vzel premer $2\,\text{cm}$. Polmer je $1\,\text{cm}$, zato je prostornina $8$-krat manjša.
+ približno $4\,\text{cm}^3$
- približno $13\,\text{cm}^3$
~ To je površina $4\pi r^2 \approx 12{,}6$, ne prostornina, pa še enota bi bila $\text{cm}^2$.
- približno $8\,\text{cm}^3$
~ To je kocka $2 \times 2 \times 2$, v katero se zrno prilega. Krogla zapolni le nekaj več kot polovico te kocke.
> Polmer je $1\,\text{cm}$. Z $\pi \approx 3$: $V \approx \frac{4}{3} \cdot 3 \cdot 1^3 = 4\,\text{cm}^3$. Natančneje $\frac{4}{3}\pi\,\text{cm}^3 \approx 4{,}19\,\text{cm}^3$.

? Zakaj se pri dvakrat večjem polmeru prostornina krogle poveča $8$-krat, površina pa le $4$-krat?
+ Ker je polmer v prostornini na tretjo potenco, v površini pa na drugo: $2^3 = 8$ in $2^2 = 4$.
- Ker faktor $\frac{4}{3}$ v formuli za prostornino rezultat še poveča.
~ Faktor $\frac{4}{3}$ imata obe krogli, zato se pri primerjavi pokrajša; razliko naredi potenca.
- Ker prostornina vedno raste dvakrat hitreje kot površina: $2 \cdot 4 = 8$.
~ To se ujema le slučajno. Pri trikrat večjem polmeru je površina $9$-krat, prostornina pa $27$-krat večja, ne $18$-krat.
- Trditev ne drži: tudi prostornina se poveča le $2$-krat, toliko kot polmer.
~ Prostornina ni sorazmerna s polmerom, ampak z $r^3$: $(2r)^3 = 8r^3$.
> Faktor povečave polmera se v površini kvadrira, v prostornini pa kubira. Zato velika krogla vsebuje veliko več snovi, kot bi sklepali po njeni površini.

? Krogla ima prostornino $288\pi\,\text{cm}^3$. Kolikšen je njen polmer?
- $216\,\text{cm}$
~ $216$ je $r^3$, ne $r$. Poiskati moraš še število, ki na tretjo da $216$.
- približno $14{,}7\,\text{cm}$
~ To je $\sqrt{216}$, kvadratni koren. Kub odpraviš s kubičnim korenom: $6 \cdot 6 \cdot 6 = 216$.
+ $6\,\text{cm}$
- približno $7{,}3\,\text{cm}$
~ Pomnožil si s $\frac{4}{3}$ namesto delil: $288 \cdot \frac{4}{3} = 384$. Pravilno je $r^3 = 288 \cdot \frac{3}{4}$.
> $\frac{4}{3}\pi r^3 = 288\pi$, zato $r^3 = 288 \cdot \frac{3}{4} = 216$ in $r = 6\,\text{cm}$, ker $6^3 = 216$. Preizkus: $\frac{4}{3}\pi \cdot 216 = 288\pi$.

? Polmer Zemlje je približno $3{,}7$-krat večji od polmera Lune. Približno koliko Lun bi po prostornini šlo v Zemljo?
- približno $4$
~ Prostornina ne raste enako kot polmer; razmerje polmerov moraš kubirati.
- približno $14$
~ $3{,}7^2 \approx 13{,}7$ je razmerje površin. Za prostornino potrebuješ tretjo potenco.
+ približno $50$
- približno $11$
~ Razmerje si pomnožil s $3$ ($3 \cdot 3{,}7 = 11{,}1$), namesto da bi ga potenciral na tretjo.
> Obe telesi sta približno krogli, zato je razmerje prostornin $3{,}7^3 \approx 50{,}7$. V Zemljo bi po prostornini šlo okoli $50$ Lun.

:::simboli
P | površina krogle | P = 4\pi r^2 | |
r | polmer krogle | r = \frac{d}{2} | |
d | premer krogle | d = 2r | |
V | prostornina krogle | V = \frac{4}{3}\pi r^3 | |
V_{\text{polkrogle}} | prostornina polkrogle | V_{\text{polkrogle}} = \frac{2}{3}\pi r^3 | | valj minus stožec z isto osnovno ploskvijo in višino r
:::
