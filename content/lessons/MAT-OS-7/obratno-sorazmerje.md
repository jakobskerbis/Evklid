---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Trije zidarji pozidajo vrtni zid v $8$ dneh. Šolski hišnik vpraša, koliko časa bi potrebovalo $6$ zidarjev. Žan takoj odgovori: »$16$ dni. Dvakrat več zidarjev, dvakrat več dni. To je premo sorazmerje!«

Je to res? Pomisli, kaj bi rekel mojster na gradbišču. Če na isti zid pošlje več ljudi, se delo konča **prej**, ne kasneje. Žan je uporabil pravilo, ki ga pozna iz premega sorazmerja, a tu ne velja.

Pri premem sorazmerju obe količini rasteta skupaj. V delavnici in na gradbišču pa pogosto srečaš nasprotno zvezo: več delavcev pomeni manj dni, širše deske pomenijo manj desk, daljši kosi letve pomenijo manj kosov. Taki zvezi rečemo **obratno sorazmerje**. Ko jo prepoznaš, Žanovo trditev ovržeš v eni vrstici.

## Razlaga

**Korak 1: ena podvojitev.** Tri zidarje zamenja šest zidarjev. Vsak dela enako hitro, zato vsak opravi pol manj dela kot prej. Zid je zato gotov v pol manj dneh: $8 : 2 = 4$ dni. Število zidarjev se je podvojilo, število dni se je razpolovilo.

*Hitri preizkus:* dva mizarja izdelata omaro v $6$ dneh. V koliko dneh jo izdelajo štirje? (Odgovor: v $3$ dneh.)

**Korak 2: ime za to zvezo.** Količini sta **obratno sorazmerni**, če se ob povečanju ene za nekajkrat druga **zmanjša za enakokrat**. Če se ena potroji, je druga trikrat manjša. Če se ena zmanjša na četrtino, je druga štirikrat večja.

:::premisli
Trije zidarji pozidajo zid v $8$ dneh. Koliko dni bi zidal en sam zidar? Napovej, preden bereš naprej.
---
$24$ dni. Zidarjev je trikrat manj, zato traja trikrat dlje: $8 \cdot 3 = 24$.
:::

**Korak 3: kaj ostane enako.** Zapišimo vse možnosti za isti zid v tabelo in dodajmo stolpec z zmnožkom.

| zidarji $x$ | dnevi $y$ | zmnožek $x \cdot y$ |
|---|---|---|
| $1$ | $24$ | $24$ |
| $2$ | $12$ | $24$ |
| $3$ | $8$ | $24$ |
| $4$ | $6$ | $24$ |
| $6$ | $4$ | $24$ |

Zmnožek je v vsaki vrstici enak. To ni naključje: $24$ je količina dela, izražena v »zidar-dnevih«. Toliko dni bi delal en sam zidar.

Pri obratnem sorazmerju je **zmnožek** stalen:

$$x \cdot y = k$$

Število $k$ je **koeficient obratnega sorazmerja**. Pri premem sorazmerju je bil stalen količnik $\dfrac{y}{x}$, tu je stalen zmnožek.

*Hitri preizkus:* ali sodi v tabelo par »$5$ zidarjev, $5$ dni«? (Ne, ker je $5 \cdot 5 = 25$, ne $24$.)

**Korak 4: računanje z dvema paroma.** Če poznaš en par $(x_1, y_1)$ in eno količino drugega para, uporabi enakost zmnožkov:

$$x_1 \cdot y_1 = x_2 \cdot y_2$$

Za Žanovo nalogo: $3 \cdot 8 = 6 \cdot y$, torej $24 = 6 \cdot y$ in $y = 24 : 6 = 4$ dni. Žan se je zmotil: šest zidarjev potrebuje $4$ dni, ne $16$.

*Hitri preizkus:* koliko dni bi potrebovalo $12$ zidarjev? (Odgovor: $24 : 12 = 2$ dni.)

**Korak 5: tudi z ulomki.** Faktor ni vedno naravno število. Štirje tesarji naredijo ostrešje v $9$ dneh. Če pride $6$ tesarjev, se število poveča za faktor $\dfrac{6}{4} = \dfrac{3}{2}$. Število dni se zato pomnoži z obratno vrednostjo $\dfrac{2}{3}$: $9 \cdot \dfrac{2}{3} = 6$ dni. Preverimo z zmnožkom: $4 \cdot 9 = 36$ in $6 \cdot 6 = 36$.

*Hitri preizkus:* število delavcev pomnožimo s $\dfrac{4}{3}$. S čim se pomnoži število dni? (S $\dfrac{3}{4}$.)

**Korak 6: vsako padanje še ni obratno sorazmerje.** Mizar od deske dolžine $100\,\text{cm}$ odreže kos. Dolžina odrezanega kosa naj bo $x$, dolžina ostanka pa $y$. Ko $x$ raste, $y$ pada.

:::premisli
Ali sta $x$ in $y$ obratno sorazmerni? Primerjaj $x = 20\,\text{cm}$ in $x = 40\,\text{cm}$.
---
Nista. Pri $x = 20$ je $y = 80$, pri $x = 40$ je $y = 60$. Kos se je podvojil, ostanek pa se ni razpolovil. Zmnožka $20 \cdot 80 = 1600$ in $40 \cdot 60 = 2400$ nista enaka. Stalna je vsota $x + y = 100$, ne zmnožek.
:::

Zato vedno preveri zmnožke, ne le smeri spremembe.

**Korak 7: v simulaciji.** V simulaciji spodaj (Obratno sorazmerje) nastavi »dni za 1 delavca« na $24$. Nato premikaj drsnik »delavci« od $2$ do $6$. Opazuj pobarvani pravokotnik: postaja širši in nižji, njegova ploščina pa ostane $24$. Točke ne ležijo na premici, ampak na krivulji, ki pada in se osi le približuje.

**Pogoj.** Računamo, kot da vsi delajo enako hitro in se ne ovirajo. Pri zelo velikem številu delavcev to ne drži več: $240$ zidarjev ne pozida zida v desetinki dneva, ker ne morejo vsi hkrati do stene.

## Rešeni primeri

### Primer 1: kosi letve

Mizar razreže letev dolžine $240\,\text{cm}$ na enake kose. Zapisal je, koliko kosov dobi pri različnih dolžinah kosa. Ali sta dolžina kosa in število kosov obratno sorazmerni?

| dolžina kosa [cm] | število kosov |
|---|---|
| $20$ | $12$ |
| $30$ | $8$ |
| $40$ | $6$ |
| $60$ | $4$ |

**Podatki:** dolžina letve $240\,\text{cm}$; pari (dolžina kosa, število kosov): $(20\,\text{cm}, 12)$, $(30\,\text{cm}, 8)$, $(40\,\text{cm}, 6)$, $(60\,\text{cm}, 4)$
**Iščemo:** ali sta količini obratno sorazmerni in koeficient $k$

:::formula
Obratno sorazmerje: zmnožek $x \cdot y = k$ je v vseh parih enak.
:::

**Rešitev:**

1. Izračunamo zmnožke, ker jih obratno sorazmerje zahteva enake: $20 \cdot 12 = 240$, $30 \cdot 8 = 240$, $40 \cdot 6 = 240$, $60 \cdot 4 = 240$.
2. Vsi zmnožki so enaki $240$, zato je $k = 240$. To je kar dolžina letve v centimetrih.
3. Odgovor: dolžina kosa in število kosov sta obratno sorazmerni, koeficient je $k = 240$.

### Primer 2: tesarji

Šest tesarjev postavi ostrešje v $10$ dneh. V koliko dneh ga postavijo štirje tesarji, če delajo enako hitro?

**Podatki:** $x_1 = 6$ tesarjev, $y_1 = 10$ dni, $x_2 = 4$ tesarji
**Iščemo:** število dni $y_2$

:::formula
$x_1 \cdot y_1 = x_2 \cdot y_2$
:::

**Rešitev:**

1. Manj tesarjev pomeni več dni, zato gre za obratno sorazmerje.
2. Količina dela: $6 \cdot 10 = 60$ tesar-dni.
3. Enačba za štiri tesarje: $4 \cdot y_2 = 60$.
4. Delimo s $4$: $y_2 = 60 : 4 = 15$.
5. Smer preverimo: tesarjev je manj, dni je več. ✓
6. Odgovor: štirje tesarji postavijo ostrešje v $15$ dneh.

### Primer 3: pomoč sredi dela (težji)

Osem delavcev bi tlakovalo dvorišče v $15$ dneh. Po $5$ dneh dela se jim pridružita še dva enako hitra delavca. Koliko dni skupaj traja tlakovanje?

**Podatki:** $8$ delavcev, $15$ dni za celo delo; po $5$ dneh pridejo še $2$ delavca
**Iščemo:** skupno število dni

:::formula
Delo v delavec-dnevih: $k = x \cdot y$; preostanek dela $=$ število delavcev $\cdot$ dnevi
:::

**Rešitev:**

1. Celo delo je $8 \cdot 15 = 120$ delavec-dni.
2. V prvih petih dneh opravijo $8 \cdot 5 = 40$ delavec-dni.
3. Ostane $120 - 40 = 80$ delavec-dni.
4. Zdaj dela $8 + 2 = 10$ delavcev, zato potrebujejo še $80 : 10 = 8$ dni.
5. Skupaj: $5 + 8 = 13$ dni.
6. Odgovor: tlakovanje traja $13$ dni, dva dneva manj kot brez pomoči.

Pazi: z deljenjem $120 : 10 = 12$ bi dobil napačen odgovor, ker bi spregledal, da je prvih pet dni delalo le osem delavcev.

### Primer 4: zdaj ti

Za pod v delavnici potrebujemo $48$ desk širine $15\,\text{cm}$. Koliko enako dolgih desk potrebujemo, če so široke $12\,\text{cm}$?

**Podatki:** $48$ desk, širina $15\,\text{cm}$; nova širina $12\,\text{cm}$, dolžina desk enaka
**Iščemo:** število desk širine $12\,\text{cm}$

:::formula
$x_1 \cdot y_1 = x_2 \cdot y_2$ (širina deske $\cdot$ število desk je širina poda)
:::

**Rešitev:**

1. Ožje deske pomenijo več desk, zato gre za obratno sorazmerje.
2. Širina poda: $48 \cdot 15 = 720\,\text{cm}$.
3. Zapiši enačbo za deske širine $12\,\text{cm}$ in jo reši. Nato preveri smer spremembe.

:::premisli
Koliko desk širine $12\,\text{cm}$ potrebujemo?
---
$12 \cdot y = 720$, torej $y = 720 : 12 = 60$ desk. Deske so ožje, zato jih je več. ✓
:::

## Pogoste napake

- **Žanova napaka: premo namesto obratno.** Pri $3$ zidarjih in $8$ dneh računa $6$ zidarjev $\Rightarrow$ $16$ dni. To je pravilo premega sorazmerja. Preden računaš, se vprašaj: ali več delavcev pomeni več ali manj časa? Pri obratnem sorazmerju je odgovor »manj«.
- **Razlika namesto »kolikokrat«.** Nekdo misli: pri $5$ črpalkah traja $12$ minut, pri $10$ črpalkah je črpalk $5$ več, torej $5$ minut manj, $7$ minut. Obratno sorazmerje ne govori o »za koliko«, ampak o »kolikokrat«. Črpalk je dvakrat več, čas je dvakrat krajši: $6$ minut.
- **Vsako padanje razglasiš za obratno sorazmerje.** Pri deski $100\,\text{cm}$ ostanek pada, ko kos raste, a zmnožek ni stalen. Preveri zmnožke v vsaj dveh parih.
- **Enačba iz premega sorazmerja.** Zapis $\dfrac{4}{6} = \dfrac{8}{y}$ ustreza prememu sorazmerju in vodi v $y = 12$. Pri obratnem sorazmerju zapiši enakost zmnožkov: $4 \cdot 6 = 8 \cdot y$, torej $y = 3$.
- **Spregledan že opravljen del.** Pri nalogah, kjer se število delavcev spremeni sredi dela, najprej odštej, kar je že narejeno, kot v primeru 3.

## Povzetek

- Količini sta obratno sorazmerni, če se ob povečanju ene za nekajkrat druga zmanjša za enakokrat.
- Stalen je **zmnožek**: $x \cdot y = k$; $k$ je koeficient obratnega sorazmerja.
- Za dva para velja $x_1 \cdot y_1 = x_2 \cdot y_2$.
- Če eno količino pomnožimo z ulomkom $\dfrac{p}{q}$, se druga pomnoži z $\dfrac{q}{p}$.
- Pri premem sorazmerju je stalen količnik, pri obratnem zmnožek. Padanje samo še ni dokaz.
- Tipični primeri: delavci in dnevi, širina in število desk, dolžina in število kosov.
- Rezultat preveri s smerjo: več delavcev, manj dni.

## Drugače: Na sliki

Na karirast papir nariši vse pravokotnike, sestavljene iz $24$ kvadratkov:

- $1$ krat $24$: zelo ozek in visok,
- $2$ krat $12$,
- $3$ krat $8$,
- $4$ krat $6$,
- $6$ krat $4$,
- $8$ krat $3$,
- $12$ krat $2$,
- $24$ krat $1$: zelo širok in nizek.

Širina je število zidarjev, višina število dni. Vsi pravokotniki imajo enako ploščino, $24$ kvadratkov: to je stalni zmnožek $k$. Ko pravokotnik razširiš, se mora znižati, sicer kvadratkov ne bi bilo več $24$.

Zgornja desna oglišča teh pravokotnikov vriši v koordinatni sistem: $(1, 24)$, $(2, 12)$, $(3, 8)$, $(4, 6)$, $(6, 4)$, $(8, 3)$, $(12, 2)$, $(24, 1)$. Ne ležijo na premici, kot pri premem sorazmerju, ampak na krivulji, ki najprej strmo, nato vse bolj položno pada. Osi se nikoli ne dotakne, ker noben zmnožek z ničlo ni $24$.

## Drugače: Bolj natančno

Iz $x \cdot y = k$ izrazimo $y$:

$$y = \frac{k}{x}$$

Zato $x$ ne sme biti $0$: deliti z nič ne moremo. Tudi $k$ ni $0$.

Zakaj stalni zmnožek pomeni »$n$-krat več, $n$-krat manj«? Naj bo $x_1 \cdot y_1 = k$ in $x_2 = n \cdot x_1$. Potem:

$$y_2 = \frac{k}{n \cdot x_1} = \frac{1}{n} \cdot \frac{k}{x_1} = \frac{y_1}{n}$$

Velja tudi za ulomke. Če $x$ pomnožimo s $\dfrac{3}{2}$, se $y$ pomnoži z $\dfrac{2}{3}$, saj je $\dfrac{3}{2} \cdot \dfrac{2}{3} = 1$ in zmnožek ostane $k$.

Primerjava obeh sorazmerij:

| | premo | obratno |
|---|---|---|
| $x$ se podvoji, $y$ se | podvoji | razpolovi |
| stalno je | $\dfrac{y}{x} = k$ | $x \cdot y = k$ |
| zapis | $y = k \cdot x$ | $y = \dfrac{k}{x}$ |
| graf | premica skozi $(0, 0)$ | krivulja, ki pada |

Zveza $x + y = 100$ pri deski je tretja vrsta: stalna je vsota. Ko $x$ raste, $y$ pada vedno za enako število centimetrov, ne pa enakokrat.

## Preveri se

? Katera trditev o obratno sorazmernih količinah drži?
- Njun količnik je vedno enak.
~ Stalen količnik ima premo sorazmerje. Pri obratnem je stalen zmnožek.
+ Njun zmnožek je vedno enak.
- Vsaki zvezi, kjer ena količina raste in druga pada, rečemo obratno sorazmerje.
~ Pri deski $100\,\text{cm}$ ostanek pada, a zmnožek ni stalen. Padati mora enakokrat.
- Ko se ena podvoji, se druga zmanjša za $2$.
~ Ne »za $2$«, ampak »na polovico«: obratno sorazmerje govori o kolikokratnikih.
> Pri obratnem sorazmerju velja $x \cdot y = k$ za vse pare.

? Tina je rešila nalogo: »$4$ zidarji pozidajo zid v $6$ dneh. V koliko dneh ga pozida $8$ zidarjev?« Zapisala je $\dfrac{4}{6} = \dfrac{8}{y}$ in dobila $y = 12$ dni. Kje je napaka?
- Napaka je v računanju; $y$ bi moral biti $16$.
~ Račun iz njene enačbe je pravilen. Napačna je že enačba.
+ Uporabila je premo sorazmerje; pravilno je $4 \cdot 6 = 8 \cdot y$, torej $y = 3$.
- Ni napake: več zidarjev pomeni več dela, zato več dni.
~ Zid je isti, delo je enako. Več zidarjev ga opravi prej.
> Več zidarjev pomeni manj dni, zato gre za obratno sorazmerje: $24 = 8 \cdot y$, $y = 3$ dni.

? Mizarstvo A: $3$ mizarji izdelajo kuhinjo v $12$ dneh. Mizarstvo B: $4$ mizarji izdelajo drugo kuhinjo v $10$ dneh. Za katero kuhinjo je bilo treba opraviti več dela (vsi mizarji delajo enako hitro)?
- Za kuhinjo A, ker je trajala več dni.
~ Število dni samo ne pove velikosti dela; pomembno je tudi, koliko mizarjev je delalo.
+ Za kuhinjo B, ker je $4 \cdot 10 = 40$ več kot $3 \cdot 12 = 36$ mizar-dni.
- Za obe enako, ker sta obe delali približno dva tedna.
~ Delo primerjamo z zmnožkom mizarji $\cdot$ dnevi: $36$ in $40$ nista enaka.
> Velikost dela je zmnožek števila mizarjev in dni: A $36$, B $40$ mizar-dni.

? Pet enakih črpalk izčrpa vodo iz gradbene jame v $12$ minutah. V koliko minutah jo izčrpa $10$ takih črpalk?
- $24$ minut
~ To je premo sorazmerje. Več črpalk mora delati krajši čas.
- $7$ minut
~ Črpalk ni »$5$ več«, ampak dvakrat več; čas je dvakrat krajši, ne za $5$ minut krajši.
+ $6$ minut
- $60$ minut
~ $60$ je koeficient $5 \cdot 12$, ki ga moraš še deliti z $10$.
> $5 \cdot 12 = 60$, nato $10 \cdot t = 60$ in $t = 6$ minut.

? Šest učencev bi izdelalo kulise za predstavo v $10$ urah. Po $4$ urah se jim pridružijo še trije enako hitri učenci. Koliko ur skupaj traja izdelava?
- $15$ ur
~ To je premo sorazmerje ($10 \cdot 9 : 6$). Več učencev pomeni manj ur.
- $4$ ure
~ Toliko traja le preostanek. Prištej še prve $4$ ure.
+ $8$ ur
- Približno $6{,}7$ ure
~ Tako bi bilo, če bi devet učencev delalo od začetka. Prve $4$ ure jih je delalo šest.
> Delo: $6 \cdot 10 = 60$. V $4$ urah opravijo $24$, ostane $36$. Devet učencev potrebuje $36 : 9 = 4$ ure. Skupaj $4 + 4 = 8$ ur.

:::simboli
x | prva količina, na primer število zidarjev | |
y | druga količina, na primer število dni | y = \frac{k}{x} |
k | koeficient obratnega sorazmerja | k = x \cdot y | | stalni zmnožek količin
x_1, y_1 | prvi par vrednosti | |
x_2, y_2 | drugi par vrednosti | | | x₁ · y₁ = x₂ · y₂
n | kolikokrat se poveča prva količina | | | če je x₂ = n · x₁, je y₂ = y₁ : n
:::
