---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Uganka iz babičine kuhinje. Babica ima za palačinke stalno pravilo: za vsako palačinko vzame $50\,\mathrm{ml}$ mleka, nato doda še $100\,\mathrm{ml}$ »za testo, ki ostane v skledi«. Danes je porabila $600\,\mathrm{ml}$ mleka. Koliko palačink je spekla? Poskusi, preden bereš naprej.

Odgovor je $10$: od $600\,\mathrm{ml}$ odšteješ $100\,\mathrm{ml}$, ostane $500\,\mathrm{ml}$, to je $10$ palačink po $50\,\mathrm{ml}$. Ob tem si naredil dve stvari. Najprej si uporabil pravilo (palačinke → mleko), nato si ga **obrnil** (mleko → palačinke). Uganka skriva še eno vprašanje: ali bi babica lahko porabila $120\,\mathrm{ml}$ mleka? Ne: $120 - 100 = 20$, to je le $0{,}4$ palačinke.

Takemu pravilu rečemo funkcija. Ko veš, katere vrednosti so dovoljene, kje je vrednost enaka nič, ali raste in ali ga lahko obrneš, o funkciji veš skoraj vse, še preden narišeš graf.

## Razlaga

**Funkcija.** Funkcija $f$ vsakemu številu $x$ iz neke množice priredi **natanko eno** število $f(x)$. Babičino pravilo zapišemo $f(x) = 50x + 100$: $x$ je število palačink, $f(x)$ porabljeno mleko v ml. Graf funkcije so vse točke $(x, f(x))$ v koordinatnem sistemu.

**Definicijsko območje** $D_f$ je množica vseh $x$, ki jih smemo vstaviti. Računske omejitve že poznaš: pod sodim korenom ne sme biti negativno število, imenovalec ne sme biti $0$. Pri $\dfrac{1}{x - 2}$ je zato $D_f = \mathbb{R} \setminus \{2\}$. Pri babici je omejitev življenjska: $x$ je naravno število.

**Zaloga vrednosti** $Z_f$ je množica vseh vrednosti $f(x)$, ki jih funkcija res zavzame. Funkcija $f(x) = x^2$ ima $D_f = \mathbb{R}$, a $Z_f = [0, \infty)$, ker kvadrat ni nikoli negativen. Pri babici je $600$ v $Z_f$, $120$ pa ne, kot si videl v uganki.

**Ničla** je tisti $x$, pri katerem je $f(x) = 0$. Tam graf seka os $x$. Ničle iščeš z enačbo $f(x) = 0$.

**Naraščanje in padanje.** Funkcija na intervalu **narašča**, če za vsaka $x_1 < x_2$ iz intervala velja $f(x_1) < f(x_2)$: večji vhod, večja vrednost. **Pada**, če velja $f(x_1) > f(x_2)$. Temperatura juhe, ki stoji na mizi, s časom pada. Babičino mleko s številom palačink narašča.

**Simetrija – poišči vzorec sam.** Primerjaj vrednosti pri $x$ in pri $-x$:

| $x$ | $x^2$ | $x^3$ |
|---|---|---|
| $1$ in $-1$ | $1$ in $1$ | $1$ in $-1$ |
| $2$ in $-2$ | $4$ in $4$ | $8$ in $-8$ |
| $3$ in $-3$ | $9$ in $9$ | $27$ in $-27$ |

Pri $x^2$ sta vrednosti enaki, pri $x^3$ nasprotni. To sta pravili, ki ju poimenujemo. Funkcija je **soda**, če je $f(-x) = f(x)$ za vsak $x \in D_f$; njen graf je simetričen glede na os $y$. Funkcija je **liha**, če je $f(-x) = -f(x)$ za vsak $x \in D_f$; graf je simetričen glede na koordinatno izhodišče. Večina funkcij ni ne soda ne liha, na primer $f(x) = x + 1$.

:::premisli
Napovej brez računanja: je $f(x) = |x|$ soda, liha ali nič od tega? Kaj pa $f(x) = x^4$?
---
Obe sta sodi. $|-x| = |x|$ in $(-x)^4 = x^4$, ker sodo število minusov da plus. Iz tabele vidiš splošno: sode potence so sode funkcije, lihe potence lihe.
:::

**Injektivnost.** V tabeli imata $2$ in $-2$ pri $x^2$ isto vrednost $4$. Funkcija je **injektivna**, če različnima $x_1 \ne x_2$ vedno pripadata različni vrednosti $f(x_1) \ne f(x_2)$. Na grafu: vsaka vodoravna premica seka graf največ enkrat. Funkcija $x^3$ je injektivna, $x^2$ na $\mathbb{R}$ ni. Funkcija, ki na celem $D_f$ narašča (ali pada), je vedno injektivna.

**Sestavljena funkcija.** Pravili lahko izvedeš eno za drugim. Najprej $f$, potem na rezultatu še $g$:

$$(g \circ f)(x) = g(f(x))$$

Beri »$g$ po $f$«. Vrstni red je pomemben: prva deluje $f$, čeprav stoji desno.

**Inverzna funkcija.** Pri uganki si iz mleka dobil palačinke. Taki obrnjeni funkciji rečemo **inverzna funkcija** $f^{-1}$: če je $f(x) = y$, je $f^{-1}(y) = x$. Obstaja natanko takrat, ko je $f$ injektivna, sicer ne bi vedel, kateri $x$ vrniti. Postopek: zapiši $y = f(x)$, izrazi $x$ in na koncu zamenjaj oznaki $x$ in $y$. Za babico: $y = 50x + 100$, torej $x = \dfrac{y - 100}{50}$, in

$$f^{-1}(x) = \frac{x - 100}{50}$$

Definicijsko območje in zaloga vrednosti se zamenjata: $D_{f^{-1}} = Z_f$ in $Z_{f^{-1}} = D_f$. Graf $f^{-1}$ je zrcalna slika grafa $f$ čez premico $y = x$, ker vsaka točka $(a, b)$ postane $(b, a)$.

:::premisli
Zakaj $f(x) = x^2$ na $\mathbb{R}$ nima inverzne funkcije, na $[0, \infty)$ pa jo ima? Katero funkcijo že poznaš kot njeno inverzno?
---
Na $\mathbb{R}$ vrednost $4$ dobiš iz $2$ in iz $-2$, zato $f^{-1}(4)$ ni enolično. Na $[0, \infty)$ funkcija narašča in je injektivna. Inverzna je $\sqrt{x}$, saj je koren po definiciji nenegativen.
:::

V simulaciji spodaj, »Lastnosti funkcije in inverzna funkcija«, izberi $a(x^2 - 4)$ in nato $a \cdot x^3$. Opazuj, pri kateri se pojavi graf inverzne funkcije in kako leži glede na premico $y = x$.

## Rešeni primeri

### Primer 1 (lažji): območje, ničla in zaloga

Dana je funkcija $f(x) = \sqrt{x + 4} - 2$. Določi definicijsko območje, ničlo in zalogo vrednosti.

**Podatki:** $f(x) = \sqrt{x + 4} - 2$
**Iščemo:** $D_f$, ničlo, $Z_f$

:::formula
Pod kvadratnim korenom: $x + 4 \ge 0$. Ničla: $f(x) = 0$. Koren je vedno $\ge 0$.
:::

**Rešitev:**

1. Pod korenom ne sme biti negativno število: $x + 4 \ge 0$, torej $x \ge -4$ in $D_f = [-4, \infty)$.
2. Ničla iz enačbe $\sqrt{x + 4} = 2$; kvadriramo: $x + 4 = 4$, torej $x = 0$.
3. Preizkus: $f(0) = \sqrt{4} - 2 = 0$.
4. Najmanjša vrednost korena je $0$ (pri $x = -4$), zato je najmanjša vrednost $f$ enaka $0 - 2 = -2$; koren nato raste brez meje.
5. Odgovor: $D_f = [-4, \infty)$, ničla je $x = 0$, $Z_f = [-2, \infty)$.

### Primer 2: soda, liha, injektivna?

Ugotovi, ali sta $f(x) = x^3 - 4x$ in $g(x) = x^2 + 2x$ sodi ali lihi. Ali je $f$ injektivna?

**Podatki:** $f(x) = x^3 - 4x$, $g(x) = x^2 + 2x$, $D_f = D_g = \mathbb{R}$
**Iščemo:** sodost ali lihost obeh, injektivnost $f$

:::formula
Soda: $f(-x) = f(x)$. Liha: $f(-x) = -f(x)$. Injektivna: $x_1 \ne x_2 \Rightarrow f(x_1) \ne f(x_2)$.
:::

**Rešitev:**

1. Vstavimo $-x$: $f(-x) = (-x)^3 - 4(-x) = -x^3 + 4x$.
2. To je $-(x^3 - 4x) = -f(x)$, zato je $f$ liha.
3. Za $g$: $g(-x) = (-x)^2 + 2(-x) = x^2 - 2x$. To ni $g(x)$ in ni $-g(x) = -x^2 - 2x$.
4. S števili: $g(1) = 3$, $g(-1) = -1$. Vrednosti nista ne enaki ne nasprotni, zato $g$ ni ne soda ne liha.
5. Injektivnost: $f(0) = 0$ in $f(2) = 8 - 8 = 0$. Dva različna $x$ dasta isto vrednost, zato $f$ ni injektivna.
6. Odgovor: $f$ je liha, a ni injektivna; $g$ ni ne soda ne liha.

### Primer 3 (težji): ameriški recept

Recept za piškote zahteva pečico na $350\,^\circ\mathrm{F}$. Pretvorba iz stopinj Celzija v stopinje Fahrenheita je funkcija $F(C) = 1{,}8\,C + 32$. Na koliko stopinj Celzija nastaviš pečico?

**Podatki:** $F(C) = 1{,}8\,C + 32$, temperatura v receptu $350\,^\circ\mathrm{F}$
**Iščemo:** temperaturo v $^\circ\mathrm{C}$, torej inverzno funkcijo in njeno vrednost

:::formula
$y = F(C)$, iz tega izrazimo $C$: dobimo $F^{-1}$.
:::

**Rešitev:**

1. $F$ je linearna in narašča, zato je injektivna in inverzna funkcija obstaja.
2. Iz $y = 1{,}8\,C + 32$ izrazimo $C$: $C = \dfrac{y - 32}{1{,}8}$. To je inverzna funkcija $F^{-1}$, ki iz Fahrenheita vrne Celzija.
3. Vstavimo $y = 350$: $C = \dfrac{350 - 32}{1{,}8} = \dfrac{318}{1{,}8} \approx 176{,}7$.
4. Preizkus: $1{,}8 \cdot 176{,}7 + 32 \approx 350$.
5. Odgovor: pečico nastaviš na približno $177\,^\circ\mathrm{C}$, v praksi na $180\,^\circ\mathrm{C}$.

### Primer 4: zdaj ti

Babica za $x$ palačink porabi $f(x) = 50x + 100$ mililitrov mleka. Liter mleka stane $1{,}20\,€$, zato $m$ mililitrov stane $g(m) = 0{,}0012\,m$ evrov. Koliko stane mleko za $10$ palačink?

**Podatki:** $f(x) = 50x + 100$ (ml), cena mleka $1{,}20\,€$ na liter, torej $g(m) = 0{,}0012\,m$ (€), $x = 10$
**Iščemo:** $(g \circ f)(10)$

:::formula
$(g \circ f)(x) = g(f(x))$: najprej $f$, nato $g$.
:::

**Rešitev:**

1. Najprej pravilo $f$, ker iz palačink dobimo mleko: $f(10) = 50 \cdot 10 + 100 = 600$, torej $600\,\mathrm{ml}$.
2. Nato $g$ na tem rezultatu. Izračunaj sam in preveri:

:::premisli
Koliko je $g(600)$? Kakšen je predpis za $(g \circ f)(x)$?
---
$g(600) = 0{,}0012 \cdot 600 = 0{,}72$, mleko stane $0{,}72\,€$. Splošno $(g \circ f)(x) = 0{,}0012(50x + 100) = 0{,}06x + 0{,}12$.
:::

## Pogoste napake

- **$f^{-1}$ kot ulomek.** Oznaka $f^{-1}(x)$ ni $\dfrac{1}{f(x)}$. Pri babici je $\dfrac{1}{50x + 100}$ nesmiselna količina, prava inverzna pa je $\dfrac{x - 100}{50}$. Inverzna funkcija »odpravi« $f$, ne obrne ulomka.
- **Zamenjan vrstni red pri sestavljanju.** $(g \circ f)(x)$ ni $f(g(x))$ in ni produkt $g(x) \cdot f(x)$. Najprej deluje funkcija, ki je zapisana desno, torej $f$.
- **»Ni soda, torej je liha.«** Sodost in lihost nista edini možnosti. Pri $g(x) = x^2 + 2x$ ne velja nobena. Preveri obe zahtevi posebej.
- **Zaloga vrednosti = definicijsko območje.** $D_f$ so vhodi, $Z_f$ izhodi. Pri $x^2$ smeš vstaviti vsako število, dobiš pa le nenegativna.
- **Vsaka funkcija ima inverzno.** Le injektivna. Pri $x^2$ na $\mathbb{R}$ ne veš, ali je $4$ prišla iz $2$ ali iz $-2$.

## Povzetek

- Funkcija $f$ vsakemu $x \in D_f$ priredi natanko eno vrednost $f(x)$; $Z_f$ so vse dosežene vrednosti.
- $D_f$: koren sode stopnje zahteva nenegativen izraz, imenovalec mora biti različen od $0$.
- Ničla: rešitev enačbe $f(x) = 0$, tam graf seka os $x$.
- Narašča: iz $x_1 < x_2$ sledi $f(x_1) < f(x_2)$; pada: $f(x_1) > f(x_2)$.
- Soda: $f(-x) = f(x)$, simetrija glede na os $y$. Liha: $f(-x) = -f(x)$, simetrija glede na izhodišče. Večina funkcij ni nič od tega.
- Injektivna: različni $x$ dajo različne vrednosti; vodoravna premica seka graf največ enkrat.
- $(g \circ f)(x) = g(f(x))$, najprej $f$.
- $f^{-1}$ obstaja natanko za injektivno $f$; dobiš jo iz $y = f(x)$ z izražanjem $x$; $D_{f^{-1}} = Z_f$, graf je zrcaljen čez $y = x$.

## Drugače: Korak za korakom s številkami

Vzemi $f(x) = 2x - 6$ in vse lastnosti preveri s števili.

1. **Vhodi.** Vstaviš lahko vsako število, ni korena ne ulomka: $D_f = \mathbb{R}$.
2. **Ničla.** $2x - 6 = 0$ da $x = 3$. Preizkus: $f(3) = 6 - 6 = 0$.
3. **Naraščanje.** $f(1) = -4$, $f(2) = -2$, $f(5) = 4$: večji $x$, večja vrednost, funkcija narašča.
4. **Sodost.** $f(1) = -4$ in $f(-1) = -8$: vrednosti nista enaki ne nasprotni, ni ne soda ne liha.
5. **Inverzna.** Ker narašča, je injektivna. Iz $y = 2x - 6$ dobiš $x = \dfrac{y + 6}{2}$, torej $f^{-1}(x) = \dfrac{x + 6}{2}$.
6. **Preizkus inverzne.** $f(5) = 4$ in $f^{-1}(4) = \dfrac{10}{2} = 5$. Vrnila se je prvotna vrednost.

## Drugače: Kot zgodba

V kuhinji stojita dva stroja. Prvi, mlinček $f$, iz pesti zrnja namelje natanko eno skodelico moke. Nikoli ne da dveh različnih skodelic iz iste pesti, to je pogoj, da je stroj funkcija. Seznam vsega, kar sme v mlinček, je njegovo definicijsko območje. Kamnov ne sprejme. Vse, kar lahko pride ven, je zaloga vrednosti.

Drugi stroj, tehtnica $g$, vzame skodelico moke in izpiše maso. Če skodelico iz mlinčka takoj nesemo na tehtnico, sta stroja sestavljena v $g \circ f$: najprej mlinček, nato tehtnica. Obratno ne gre, tehtnica zrnja ne melje.

Nekega dne kuhar dobi le skodelico moke in vpraša: »Koliko zrnja je bilo?« Odgovoriti zna samo, če mlinček iz različnih pesti vedno namelje različne skodelice. Takrat je stroj injektiven in ima obratni stroj $f^{-1}$, ki vrne izvor.

## Preveri se

? Katera trditev drži?
- Vsaka funkcija, ki ni soda, je liha.
~ Večina funkcij ni ne soda ne liha, na primer $x + 1$: $f(-1) = 0$, $f(1) = 2$.
- Zaloga vrednosti so vsa števila, ki jih smemo vstaviti v funkcijo.
~ To je definicijsko območje. Zaloga vrednosti so izhodi, vrednosti $f(x)$.
+ Funkcija ima inverzno funkcijo natanko takrat, ko je injektivna.
- Vsaka liha funkcija ima inverzno funkcijo.
~ Liha $x^3 - 4x$ ima ničle $-2$, $0$ in $2$, zato ni injektivna in nima inverzne.
> Le injektivna funkcija vsako vrednost doseže največ enkrat, zato $f^{-1}$ ve, kateri $x$ vrniti.

? Naj bo $f(x) = 2x - 1$ in $g(x) = x^2$. Koliko je $(g \circ f)(3)$?
- $17$
~ To je $f(g(3)) = f(9)$. Pri $g \circ f$ najprej deluje $f$.
+ $25$
- $45$
~ To je produkt $g(3) \cdot f(3) = 9 \cdot 5$. Krogec pomeni zaporedno izvajanje, ne množenja.
> $f(3) = 5$, nato $g(5) = 25$.

? Jan je iskal inverzno funkcijo $f(x) = 3x + 6$. Pisal je: (1) $y = 3x + 6$; (2) $x = \dfrac{y - 6}{3}$; (3) $f^{-1}(x) = \dfrac{x}{3} - 6$. Kje je napaka?
- V koraku (1), ker bi moral pisati $\dfrac{1}{3x + 6}$.
~ Inverzna funkcija ni obratna vrednost. $\dfrac{1}{f(x)}$ ne vrne prvotnega $x$.
- V koraku (2), ker bi moral šestico prišteti.
~ Ko na desni prištejemo $6$, jo na drugi strani odštejemo. Korak (2) je pravilen.
+ V koraku (3), ker je $\dfrac{x - 6}{3} = \dfrac{x}{3} - 2$.
> Deliti s $3$ moraš oba člena. Preizkus: $f(1) = 9$ in pravilna $f^{-1}(9) = 3 - 2 = 1$.

? Primerjaj $f(x) = x^2$ in $g(x) = x^3$ na $\mathbb{R}$. Kaj velja?
- Obe sta injektivni, ker obe za $x > 0$ naraščata.
~ Injektivnost mora veljati na celem $\mathbb{R}$, a $x^2$ za $x < 0$ pada: $(-2)^2 = 2^2$.
- Injektivna je le $f$, ker je soda.
~ Soda funkcija ima $f(-x) = f(x)$, torej ravno dva različna $x$ z isto vrednostjo.
+ Injektivna je le $g$, zato ima le $g$ inverzno funkcijo na $\mathbb{R}$.
> $x^3$ narašča na vsem $\mathbb{R}$ in je injektivna; inverzna je $\sqrt[3]{x}$. Pri $x^2$ je $f(-2) = f(2) = 4$.

? Juha se po kuhanju na mizi ves čas ohlaja. Temperatura je funkcija časa $T(t)$. Ali lahko iz izmerjene temperature $40\,^\circ\mathrm{C}$ enolično ugotoviš, koliko časa je juha že stala?
- Ne, ker se temperatura s časom spreminja.
~ Spreminjanje ne moti. Pomembno je, ali isto temperaturo doseže več kot enkrat.
+ Da, ker $T$ pada, je injektivna in ima inverzno funkcijo.
- Da, ker je vsaka funkcija časa injektivna.
~ Temperatura pečice, ki se vklaplja in izklaplja, isto vrednost doseže večkrat.
> Funkcija, ki ves čas pada, vsako vrednost doseže le enkrat. $T^{-1}(40)$ je iskani čas.

:::simboli
f | funkcija (pravilo, ki vsakemu $x$ priredi natanko eno vrednost) | | | pri babici $f(x) = 50x + 100$ (palačinke → mleko)
x | neodvisna spremenljivka (vhod) | | | pri babici število palačink
g | druga funkcija | | | v primeru 4 cena mleka, $g(m) = 0{,}0012\,m$
m | prostornina mleka v ml | | ml
y | vrednost funkcije | y = f(x) |
F | temperatura v stopinjah Fahrenheita | F = 1{,}8\,C + 32 | ^\circ\mathrm{F}
C | temperatura v stopinjah Celzija | C = \frac{F - 32}{1{,}8} | ^\circ\mathrm{C}
D_f | definicijsko območje funkcije $f$ | |
Z_f | zaloga vrednosti funkcije $f$ | |
x_1, x_2 | dva vhoda iz definicijskega območja | |
:::
