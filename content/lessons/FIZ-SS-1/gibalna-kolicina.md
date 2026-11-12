---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Po poletni nevihti so na strehi avtomobila pred blokom vdolbine. Isti avto je prejšnji teden ves dan stal na dežju, pa se mu ni zgodilo nič. Dežna kapljica ima maso okoli $0{,}05\,\mathrm{g}$ in pade s hitrostjo $9\,\mathrm{m/s}$. Debelo zrno toče ima maso $20\,\mathrm{g}$ in prileti s hitrostjo $25\,\mathrm{m/s}$.

Masa toče je $400$-krat večja, hitrost slabo $3$-krat. Kolikokrat močneje torej udari zrno toče? Samo masa ali samo hitrost odgovora ne dasta. Potrebujemo količino, ki združi oboje. Imenuje se **gibalna količina**. Z njo razložiš, zakaj sneg ublaži padec, kako hitro leti sokol, ko ujame goloba, in kako se gibljeta telesi po trku.

## Razlaga

**1. Kaj odloča, kako težko je telo ustaviti.** Po gladkem zaledenelem ribniku drsijo kosi ledu. Trenje zanemarimo. Vsakega ustavimo z roko, ki nanj deluje s stalno silo $3\,\mathrm{N}$. Čas ustavljanja izračunamo iz $a = \dfrac{F}{m}$ in $t = \dfrac{v}{a}$:

| Kos | $m$ [kg] | $v$ [m/s] | $t$ [s] |
|---|---|---|---|
| A | $0{,}5$ | $6$ | $1$ |
| B | $1$ | $3$ | $1$ |
| C | $1{,}5$ | $2$ | $1$ |
| D | $1{,}5$ | $4$ | $2$ |

Kosi A, B in C imajo zelo različne mase in hitrosti, pa se ustavijo v enakem času. Preden bereš naprej, poišči, kaj jim je skupno.

Zmnožek $m \cdot v$ je pri vseh treh enak, $3\,\mathrm{kg\,m/s}$. Kos D ima zmnožek dvakrat večji in potrebuje dvakrat več časa.

:::premisli
Kos ledu z maso $2\,\mathrm{kg}$ drsi s hitrostjo $4{,}5\,\mathrm{m/s}$. Koliko časa ga ustavljamo z isto silo $3\,\mathrm{N}$? Napovej brez formule za pospešek.
---
$3\,\mathrm{s}$. Zmnožek $m \cdot v$ je $9\,\mathrm{kg\,m/s}$, kar je trikrat več kot pri kosih A, B in C, zato traja ustavljanje trikrat dlje.
:::

**2. Gibalna količina.** Zmnožek mase in hitrosti imenujemo **gibalna količina** $\vec p$ (v nekaterih učbenikih $\vec G$):

$$\vec p = m\,\vec v$$

Je vektor in kaže v smer hitrosti. Enota je $\mathrm{kg\,m/s}$, kar je isto kot $\mathrm{N\,s}$. Pri gibanju po premici izberemo pozitivno smer. Gibalna količina v nasprotni smeri je negativna.

**3. Izrek o gibalni količini.** Iz tabele sledi $F \cdot t = m \cdot v$. Ni naključje. Po 2. Newtonovem zakonu je $F = m\,a$, pospešek pa je $a = \dfrac{\Delta v}{\Delta t}$. Torej $F\,\Delta t = m\,\Delta v$. Na desni je sprememba gibalne količine $\Delta p$. Na levi je zmnožek sile in časa delovanja, ki ga imenujemo **sunek sile**. Izrek o gibalni količini pravi:

$$F\,\Delta t = \Delta p$$

Sunek rezultante sil je enak spremembi gibalne količine telesa, $\Delta p = p' - p$ (črtica pomeni »po«).

Posledica je pomembna. Kadar mora telo izgubiti določeno gibalno količino, je sila tem manjša, čim daljši je čas ustavljanja. Kuna z maso $1{,}5\,\mathrm{kg}$ skoči z veje in pristane s hitrostjo $4\,\mathrm{m/s}$. Ustaviti mora gibalno količino $6\,\mathrm{N\,s}$. S togimi nogami se ustavi v $0{,}05\,\mathrm{s}$, z upogibanjem nog v $0{,}2\,\mathrm{s}$. Povprečna rezultanta sil nanjo je $F = \dfrac{\Delta p}{\Delta t}$: s togimi nogami $120\,\mathrm{N}$, z upognjenimi le $30\,\mathrm{N}$.

:::risba graf
opis: Graf sile v odvisnosti od časa pri pristanku kune. Visok ozek pravokotnik: toge noge, sila 120 N, 0,05 s. Nizek širok pravokotnik: upognjene noge, sila 30 N, 0,2 s. Ploščini sta enaki, 6 N s.
x: 0 .. 0,25 | 0,05 | t [s]
y: 0 .. 140 | 20 | F [N]
pravokotnik: 0; 0 .. 0,05; 120 | modra ozadje
pravokotnik: 0; 0 .. 0,2; 30 | oranžna črtkano
napis: 0,05; 120 | toge noge: 120 N | desno
napis: 0,2; 30 | upognjene noge: 30 N | nad
podnapis: Ploščina pod grafom je sunek sile: 0,05 s · 120 N = 0,2 s · 30 N = 6 N s.
:::

Ploščina pravokotnika je sunek sile. Pri obeh pristankih je enaka, sila pa je pri upognjenih nogah štirikrat manjša. Enako deluje debela snežna odeja, kup listja ali čelada.

**4. Trki.** Dva kosa ledu trčita na gladkem ribniku. Izmerimo gibalno količino vsakega pred trkom in po njem (v $\mathrm{kg\,m/s}$, desno je pozitivno):

| Trk | pred: $p_1$; $p_2$ | po: $p_1'$; $p_2'$ |
|---|---|---|
| A: $1\,\mathrm{kg}$ in $1\,\mathrm{kg}$, odskočita | $3$; $-1$ | $-1$; $3$ |
| B: $3\,\mathrm{kg}$ in $1\,\mathrm{kg}$, odskočita | $6$; $0$ | $3$; $3$ |
| C: $2\,\mathrm{kg}$ in $2\,\mathrm{kg}$, sprimeta se | $8$; $-2$ | $3$; $3$ |

Gibalna količina posameznega kosa se pri trku spremeni. Seštej pa obe števili v vsaki celici: v vsaki vrstici je vsota pred trkom enaka vsoti po njem ($2$; $6$; $6$).

Zakaj? Med trkom kosa delujeta drug na drugega z enako velikima, nasprotno usmerjenima silama (3. Newtonov zakon). Sili delujeta enako dolgo, zato sta sunka nasprotno enaka. Kar en kos gibalne količine pridobi, drugi izgubi. To je **zakon o ohranitvi gibalne količine**: če je vsota zunanjih sil na sistem teles nič (to so sile okolice, na primer trenje ali upor), se skupna gibalna količina ne spremeni.

$$p_1 + p_2 = p_1' + p_2'$$

Pri **prožnem trku** se telesi odbijeta. Pri **neprožnem trku** se sprimeta in nadaljujeta s skupno hitrostjo $v'$:

$$m_1 v_1 + m_2 v_2 = (m_1 + m_2)\,v'$$

Resnični trki so večinoma nekje vmes: zrno toče se od strehe odbije, a počasneje, kot je priletelo. Zakon o ohranitvi gibalne količine velja pri vseh.

V simulaciji spodaj nastavi $m_1 = 3\,\mathrm{kg}$, $v_1 = 2\,\mathrm{m/s}$, $m_2 = 1\,\mathrm{kg}$ in $v_2 = 0$. Zaženi prožni trk, nato še neprožnega. Opazuj stolpec »skupaj«: pred trkom in po njem je enako visok, čeprav se stolpca $p_1$ in $p_2$ močno spremenita.

:::premisli
Dva enaka kosa ledu drsita drug proti drugemu, vsak s hitrostjo $2\,\mathrm{m/s}$. Ob trku se sprimeta. Kako se gibljeta potem?
---
Obstaneta na mestu. Gibalni količini sta nasprotno enaki, zato je skupna gibalna količina nič že pred trkom. Nič mora ostati tudi po njem, zato je $v' = 0$.
:::

## Rešeni primeri

### Primer 1: kapljica ali toča

Odgovorimo na vprašanje z začetka. Dežna kapljica z maso $0{,}05\,\mathrm{g}$ pade s hitrostjo $9\,\mathrm{m/s}$, zrno toče z maso $20\,\mathrm{g}$ s hitrostjo $25\,\mathrm{m/s}$. Kolikšni sta njuni gibalni količini in kolikokrat večja je gibalna količina toče?

**Podatki:** $m_\mathrm{k} = 0{,}05\,\mathrm{g}$, $v_\mathrm{k} = 9\,\mathrm{m/s}$, $m_\mathrm{t} = 20\,\mathrm{g}$, $v_\mathrm{t} = 25\,\mathrm{m/s}$
**Iščemo:** gibalni količini $p_\mathrm{k}$ in $p_\mathrm{t}$ ter njuno razmerje

:::formula
$p = m\,v$
:::

**Rešitev:**

1. Maso pretvorimo v kilograme, ker je enota $\mathrm{kg\,m/s}$: $m_\mathrm{k} = 0{,}00005\,\mathrm{kg}$, $m_\mathrm{t} = 0{,}02\,\mathrm{kg}$.
2. Kapljica: $p_\mathrm{k} = 0{,}00005 \cdot 9 = 0{,}00045\,\mathrm{kg\,m/s}$.
3. Toča: $p_\mathrm{t} = 0{,}02 \cdot 25 = 0{,}5\,\mathrm{kg\,m/s}$.
4. Razmerje: $\dfrac{0{,}5}{0{,}00045} \approx 1100$.
5. Odgovor: gibalna količina zrna toče je približno $1100$-krat večja od gibalne količine kapljice, zato je pri enako dolgem ustavljanju tudi sila na pločevino toliko večja.

### Primer 2: toča se odbije od strehe

Zrno toče z maso $20\,\mathrm{g}$ pade na streho avtomobila s hitrostjo $25\,\mathrm{m/s}$ in se odbije navzgor s hitrostjo $5\,\mathrm{m/s}$. Trk traja $0{,}002\,\mathrm{s}$. S kolikšno povprečno silo deluje streha na zrno? Težo zrna zanemarimo, ker je le okoli $0{,}2\,\mathrm{N}$.

**Podatki:** $m = 0{,}02\,\mathrm{kg}$, $v = -25\,\mathrm{m/s}$ (navzdol), $v' = 5\,\mathrm{m/s}$ (navzgor), $\Delta t = 0{,}002\,\mathrm{s}$
**Iščemo:** povprečno silo $F$

:::formula
$F\,\Delta t = \Delta p$, kjer je $\Delta p = m\,(v' - v)$
:::

**Rešitev:**

1. Pozitivno smer izberemo navzgor, zato ima hitrost pred trkom negativen predznak.
2. Sprememba gibalne količine: $\Delta p = 0{,}02 \cdot (5 - (-25)) = 0{,}02 \cdot 30 = 0{,}6\,\mathrm{N\,s}$.
3. Sila iz izreka: $F = \dfrac{0{,}6}{0{,}002} = 300\,\mathrm{N}$.
4. Primerjava: če bi zrno obstalo na strehi, bi bila sprememba le $0{,}5\,\mathrm{N\,s}$ in sila $250\,\mathrm{N}$. Odboj pomeni večjo spremembo gibalne količine, ker mora streha zrno ustaviti in ga še pognati nazaj.
5. Odgovor: streha deluje na zrno s povprečno silo $300\,\mathrm{N}$ navzgor. Po 3. Newtonovem zakonu enako velika sila deluje na pločevino navzdol, zato nastane vdolbina.

### Primer 3: sokol ujame goloba

Sokol z maso $1\,\mathrm{kg}$ leti vodoravno s hitrostjo $30\,\mathrm{m/s}$. Dohiti goloba z maso $0{,}5\,\mathrm{kg}$, ki leti v isti smeri s hitrostjo $6\,\mathrm{m/s}$, in ga zgrabi. Kolikšna je njuna skupna hitrost tik po tem? S kolikšno povprečno silo deluje sokol na goloba, če prijem traja $0{,}1\,\mathrm{s}$?

**Podatki:** $m_1 = 1\,\mathrm{kg}$, $v_1 = 30\,\mathrm{m/s}$, $m_2 = 0{,}5\,\mathrm{kg}$, $v_2 = 6\,\mathrm{m/s}$, $\Delta t = 0{,}1\,\mathrm{s}$
**Iščemo:** skupno hitrost $v'$ in silo $F$ na goloba

:::formula
$m_1 v_1 + m_2 v_2 = (m_1 + m_2)\,v'$, nato $F\,\Delta t = \Delta p_2$
:::

**Rešitev:**

1. To je neprožni trk: ptiča se po prijemu gibljeta skupaj. Zračni upor v tem kratkem času zanemarimo.
2. Skupna gibalna količina pred prijemom: $1 \cdot 30 + 0{,}5 \cdot 6 = 33\,\mathrm{kg\,m/s}$.
3. Skupna hitrost: $v' = \dfrac{33}{1{,}5} = 22\,\mathrm{m/s}$.
4. Golobu se gibalna količina poveča: $\Delta p_2 = 0{,}5 \cdot (22 - 6) = 8\,\mathrm{N\,s}$. Sokolu se za enako zmanjša: $1 \cdot (22 - 30) = -8\,\mathrm{N\,s}$.
5. Sila na goloba: $F = \dfrac{8}{0{,}1} = 80\,\mathrm{N}$.
6. Odgovor: tik po prijemu letita s hitrostjo $22\,\mathrm{m/s}$, sokol pa deluje na goloba s povprečno silo $80\,\mathrm{N}$. Ker sokol leti v isti smeri kot golob, je sunek manjši, kot bi bil pri čelnem trku.

### Primer 4: zdaj ti

Kepa snega z maso $0{,}15\,\mathrm{kg}$ prileti vodoravno v mirujoče sani z maso $2{,}85\,\mathrm{kg}$ na zaledenelem ribniku in se prilepi nanje. Sani se odpeljejo s hitrostjo $0{,}6\,\mathrm{m/s}$. Kolikšna je bila hitrost kepe?

**Podatki:** $m_1 = 0{,}15\,\mathrm{kg}$, $m_2 = 2{,}85\,\mathrm{kg}$, $v_2 = 0$, $v' = 0{,}6\,\mathrm{m/s}$
**Iščemo:** hitrost kepe $v_1$

:::formula
$m_1 v_1 + m_2 v_2 = (m_1 + m_2)\,v'$
:::

**Rešitev:**

1. Sani mirujejo, zato je pred trkom gibalna količina samo kepina, $m_1 v_1$.
2. Po trku: $(m_1 + m_2)\,v' = 3 \cdot 0{,}6 = 1{,}8\,\mathrm{kg\,m/s}$.
3. Izenači obe strani in izračunaj $v_1$ sam, nato preveri:

:::premisli
Koliko je $v_1$?
---
$0{,}15 \cdot v_1 = 1{,}8$, torej $v_1 = \dfrac{1{,}8}{0{,}15} = 12\,\mathrm{m/s}$. Hitrost kepe je $20$-krat večja od hitrosti sani, ker je masa sani s kepo $20$-krat večja od mase kepe.
:::

## Pogoste napake

- **Seštevanje brez predznakov.** Kosa ledu s $8\,\mathrm{kg\,m/s}$ v desno in $2\,\mathrm{kg\,m/s}$ v levo nimata skupaj $10\,\mathrm{kg\,m/s}$. Gibalna količina je vektor. Najprej izberi pozitivno smer, potem seštej: $8 - 2 = 6\,\mathrm{kg\,m/s}$.
- **»Odboj je mehkejši kot zaustavitev.«** Zdi se, da se pri odboju del gibalne količine »vrne«. V resnici je sprememba večja: pri toči $0{,}6$ namesto $0{,}5\,\mathrm{N\,s}$. Pri $\Delta p = m\,(v' - v)$ obe hitrosti vstavi s predznakom.
- **»Težje telo dobi pri trku večji sunek.«** Sunka sta vedno nasprotno enaka, ker sta sili enaki po 3. Newtonovem zakonu. Lažje telo samo bolj spremeni hitrost, ker ima manjšo maso.
- **»Snežna odeja zmanjša spremembo gibalne količine.«** Sprememba je enaka, saj se telo v vsakem primeru ustavi. Mehka podlaga podaljša čas $\Delta t$, zato je sila manjša.
- **Ohranitev za vsako telo posebej.** Ohranja se le *vsota* gibalnih količin vseh teles v sistemu. Posamezno telo jo pri trku vedno spremeni.

## Povzetek

- Gibalna količina: $\vec p = m\,\vec v$, vektor v smeri hitrosti, enota $\mathrm{kg\,m/s} = \mathrm{N\,s}$.
- Izrek o gibalni količini: $F\,\Delta t = \Delta p$; sunek rezultante sil je enak spremembi gibalne količine.
- Pri enaki $\Delta p$ daljši čas pomeni manjšo silo (upognjene noge, sneg, čelada).
- Pri odboju je $\Delta p$ večja kot pri zaustavitvi; hitrosti vstavljamo s predznakom.
- Ohranitev: če je vsota zunanjih sil nič, je $p_1 + p_2 = p_1' + p_2'$; posamezna telesa si gibalno količino izmenjajo.
- Neprožni trk (telesi se sprimeta): $m_1 v_1 + m_2 v_2 = (m_1 + m_2)\,v'$. Prožni trk: telesi se odbijeta.

## Drugače: Korak za korakom s številkami

Ledena plošča z maso $300\,\mathrm{kg}$ plava po reki s hitrostjo $2\,\mathrm{m/s}$. Zadene ploščo z maso $200\,\mathrm{kg}$, ki jo veter potiska nasproti s hitrostjo $1\,\mathrm{m/s}$. Plošči zmrzneta skupaj. Recept za vsak trk:

1. **Skica in smer.** Nariši obe telesi s puščicama hitrosti. Pozitivna smer naj bo smer gibanja večje plošče.
2. **Predznaki.** $v_1 = 2\,\mathrm{m/s}$, $v_2 = -1\,\mathrm{m/s}$.
3. **Gibalna količina vsakega telesa.** $p_1 = 300 \cdot 2 = 600\,\mathrm{kg\,m/s}$, $p_2 = 200 \cdot (-1) = -200\,\mathrm{kg\,m/s}$.
4. **Vsota pred trkom.** $600 - 200 = 400\,\mathrm{kg\,m/s}$.
5. **Po trku** se plošči gibljeta skupaj, masa je $500\,\mathrm{kg}$.
6. **Izenači.** $500 \cdot v' = 400$, torej $v' = \dfrac{400}{500} = 0{,}8\,\mathrm{m/s}$.
7. **Preveri.** Predznak je pozitiven, plošči plavata v smeri večje. Hitrost je manjša od $2\,\mathrm{m/s}$, kot pričakujemo, ker je manjša plošča zavirala.

## Drugače: Kot zgodba

Januarja je ribnik za vasjo zamrznil. Tina je sedla na sani in čakala, da jo kdo porine. Njen pes Fido z maso $20\,\mathrm{kg}$ je pritekel po ledu s hitrostjo $6\,\mathrm{m/s}$ in skočil k njej. Tina in sani imata skupaj $40\,\mathrm{kg}$.

Fido je prinesel gibalno količino $120\,\mathrm{kg\,m/s}$. Ko je pristal na saneh, si jo je razdelil z njimi. Zdaj se je gibalo $60\,\mathrm{kg}$, zato je bila hitrost le $2\,\mathrm{m/s}$. Fido je izgubil hitrost, sani so jo pridobile. Skupna gibalna količina je ostala enaka, ker led skoraj ne zavira.

Na koncu ribnika je bil kup snega. Tina se je odločila: ne bo se zaletela v deblo, ampak v sneg. Sani so se v snegu ustavljale približno sekundo, ob deblu bi se v stotinki sekunde. Gibalna količina, ki jo je morala izgubiti, je bila v obeh primerih enaka. Ker je sneg ustavljanje raztegnil, je bila sila približno stokrat manjša. Tina se je smejala, Fido je lajal, fizika pa je delala natančno tako, kot pravita izrek o gibalni količini in zakon o njeni ohranitvi.

## Preveri se

? Približno kolikšna je gibalna količina zrna toče z maso $10\,\mathrm{g}$, ki pada s hitrostjo $30\,\mathrm{m/s}$?
- $300\,\mathrm{kg\,m/s}$
~ Maso si vstavil v gramih. Najprej pretvori: $10\,\mathrm{g} = 0{,}01\,\mathrm{kg}$.
+ $0{,}3\,\mathrm{kg\,m/s}$
- $3\,\mathrm{kg\,m/s}$
~ Tako dobiš, če maso pretvoriš za faktor $10$ narobe ($0{,}1\,\mathrm{kg}$). Gram je tisočinka kilograma.
- $0{,}03\,\mathrm{kg\,m/s}$
~ Tako dobiš, če $10\,\mathrm{g}$ pretvoriš v $0{,}001\,\mathrm{kg}$. Gram je tisočinka kilograma, zato je $10\,\mathrm{g} = 0{,}01\,\mathrm{kg}$.
> $p = m\,v = 0{,}01\,\mathrm{kg} \cdot 30\,\mathrm{m/s} = 0{,}3\,\mathrm{kg\,m/s}$.

? Zakaj divja mačka pri doskoku z drevesa upogne noge?
- Ker tako zmanjša spremembo svoje gibalne količine.
~ Sprememba je enaka, saj se mačka v vsakem primeru ustavi. Spremeni se čas ustavljanja.
+ Ker podaljša čas ustavljanja, zato je pri enakem sunku sila tal manjša.
- Ker tako zmanjša svojo težo.
~ Teža je $m\,g$ in se z držo ne spremeni. Pomemben je čas, v katerem se ustavi.
> Izrek $F\,\Delta t = \Delta p$: pri enaki $\Delta p$ večji $\Delta t$ pomeni manjšo silo $F$.

? Dva kosa ledu trčita na gladkem ribniku. Pred trkom sta njuni gibalni količini $5\,\mathrm{kg\,m/s}$ in $-2\,\mathrm{kg\,m/s}$. Kateri par vrednosti po trku je mogoč?
- $3$ in $4\,\mathrm{kg\,m/s}$
~ Vsota je $7$: tako dobiš, če sešteješ velikosti brez predznaka. Pravilna vsota pred trkom je $5 - 2 = 3$.
+ $-1$ in $4\,\mathrm{kg\,m/s}$
- $-5$ in $2\,\mathrm{kg\,m/s}$
~ Pri trku se ne obrne vsa gibalna količina. Vsota $-3$ ni enaka vsoti pred trkom, $3$.
- $0$ in $0\,\mathrm{kg\,m/s}$
~ Kosa se ne moreta oba ustaviti, ker je bila skupna gibalna količina pred trkom $3$, ne $0$.
> Ohranja se vsota: pred trkom $5 + (-2) = 3$, po trku $-1 + 4 = 3\,\mathrm{kg\,m/s}$.

? Kamen z maso $0{,}5\,\mathrm{kg}$ pade v sneg in se ustavi v $0{,}1\,\mathrm{s}$. Povprečna rezultanta sil nanj je $40\,\mathrm{N}$. S kolikšno hitrostjo je padel v sneg?
- $2\,\mathrm{m/s}$
~ To je $40 \cdot 0{,}1 \cdot 0{,}5$. Sunek je enak $m\,v$, zato z maso deliš, ne množiš.
+ $8\,\mathrm{m/s}$
- $80\,\mathrm{m/s}$
~ To je samo $\dfrac{F}{m}$, torej pospešek. Pozabil si na čas, v katerem sila deluje.
- $800\,\mathrm{m/s}$
~ To je $\dfrac{F}{m\,\Delta t}$. S časom ne deliš, ampak množiš: sunek je $F\,\Delta t$.
> Sunek $F\,\Delta t = 40 \cdot 0{,}1 = 4\,\mathrm{N\,s}$ je enak gibalni količini kamna, zato $v = \dfrac{4}{0{,}5} = 8\,\mathrm{m/s}$.

? Ribič z maso $70\,\mathrm{kg}$ skoči iz mirujočega čolna z maso $50\,\mathrm{kg}$ na breg z vodoravno hitrostjo $2\,\mathrm{m/s}$. Kako se tik po skoku giblje čoln? Upor vode zanemari.
- Čoln ostane na mestu, ker je pretežak.
~ Pred skokom je skupna gibalna količina nič. Ribič dobi gibalno količino proti bregu, zato jo mora čoln dobiti v nasprotno smer.
- S hitrostjo $2\,\mathrm{m/s}$ stran od brega.
~ Enaki morata biti gibalni količini, ne hitrosti. Čoln ima manjšo maso, zato večjo hitrost.
+ S hitrostjo $2{,}8\,\mathrm{m/s}$ stran od brega.
- S hitrostjo $2{,}8\,\mathrm{m/s}$ proti bregu.
~ Velikost je prava, smer ne: skupna gibalna količina mora ostati nič, zato se čoln giblje nasprotno od ribiča.
> $0 = 70 \cdot 2 + 50 \cdot v'$, torej $v' = -2{,}8\,\mathrm{m/s}$: čoln odplava stran od brega. Zato je skok iz majhnega čolna tako težaven.

:::simboli
\vec p, p | gibalna količina | p = m\,v | kg\,m/s | vektor v smeri hitrosti
\vec G | gibalna količina (oznaka v nekaterih učbenikih) | G = m\,v | kg\,m/s |
m | masa | | kg |
\vec v, v | hitrost | | m/s | s predznakom glede na izbrano smer
v' | hitrost po trku (pri neprožnem trku skupna) | | m/s |
F | povprečna rezultanta sil | F = \frac{\Delta p}{\Delta t} | N |
\Delta t | čas delovanja sile | | s |
\Delta p | sprememba gibalne količine | \Delta p = p' - p | N\,s | enaka sunku sile
p' | gibalna količina po trku | | kg\,m/s |
p_1, p_2 | gibalni količini teles pred trkom | | kg\,m/s |
p_1', p_2' | gibalni količini teles po trku | | kg\,m/s |
m_1, m_2 | masi teles | | kg |
v_1, v_2 | hitrosti teles pred trkom | | m/s |
p_\mathrm{k}, p_\mathrm{t} | gibalna količina kapljice, toče | | kg\,m/s |
\Delta p_2 | sprememba gibalne količine goloba | \Delta p_2 = m_2\,(v' - v_2) | N\,s |
:::
