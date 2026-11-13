---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Planinka gre od parkirišča po ravni poti: $5\,\mathrm{km}$ hoje, smer poti pa s smerjo proti severu oklepa kot $60^\circ$. Koča stoji natanko severno. Koliko je napredovala v smeri proti severu? Ne $5\,\mathrm{km}$, ampak samo $2{,}5\,\mathrm{km}$.

Kolesar se pelje proti vzhodu, veter s hitrostjo $20\,\mathrm{km/h}$ pa piha pod kotom $60^\circ$ glede na smer vožnje. Koliko vetra ga zares potiska naprej? Spet le polovica: $10\,\mathrm{km/h}$.

Situaciji sta si na videz tuji, skrivata pa isto vprašanje: **kolikšen del ene puščice kaže v smer druge?** Odgovor da **skalarni produkt**. Z njim izračunaš kot med dvema smerema na zemljevidu in brez kotomera preveriš, ali sta dve cesti pravokotni.

## Razlaga

**Senca puščice.** Nariši vektor $\vec a$ kot vodoravno puščico. Iz istega začetka nariši še vektor $\vec b$, ki z njim oklepa kot $\varphi$. Iz konice $\vec b$ spusti pravokotnico na premico, na kateri leži $\vec a$. Del premice od skupnega začetka do vznožja pravokotnice je **pravokotna projekcija** $\vec b$ na $\vec a$, nekakšna senca, ki bi jo $\vec b$ metal ob soncu točno nad premico.

Dolžina sence je odvisna od kota. Za $\vec b$ dolžine $10$:

| kot $\varphi$ | $\cos\varphi$ | senca | kam pade |
|---|---|---|---|
| $0^\circ$ | $1$ | $10$ | v celoti naprej |
| $60^\circ$ | $0{,}5$ | $5$ | naprej |
| $90^\circ$ | $0$ | $0$ | v točko |
| $120^\circ$ | $-0{,}5$ | $-5$ | nazaj |
| $180^\circ$ | $-1$ | $-10$ | v celoti nazaj |

Senca je torej $|\vec b|\cos\varphi$. Predznak pove smer: pri topem kotu pade senca za začetek, zato jo štejemo negativno.

**Skalarni produkt.** Senco pomnožimo še z dolžino $\vec a$:

$$\vec a \cdot \vec b = |\vec a|\,|\vec b|\cos\varphi$$

Tu je $\varphi$ kot med vektorjema, ko imata **skupen začetek**, $0^\circ \le \varphi \le 180^\circ$. Rezultat ni vektor, ampak število (skalar), od tod ime. Med vektorja zapišemo piko.

:::premisli
Kateri od treh faktorjev v formuli odloča o predznaku $\vec a \cdot \vec b$? Kakšen predznak ima torej produkt, če vektorja oklepata kot $150^\circ$?
---
Negativen. Kosinus topega kota je negativen, zato senca pade nazaj, dolžini pa sta pozitivni.
:::

**Pravokotnost.** Pri $\varphi = 90^\circ$ se senca skrči v točko in $\cos 90^\circ = 0$. Za neničelna vektorja velja:

$$\vec a \perp \vec b \iff \vec a \cdot \vec b = 0$$

Iz predznaka skalarnega produkta torej takoj razbereš vrsto kota: pozitiven pomeni oster kot, nič pravi kot, negativen top kot.

**Računanje s komponentami.** Na zemljevidu običajno poznaš komponente, ne kotov. Potem računaš brez kota:

$$\vec a \cdot \vec b = a_x b_x + a_y b_y + a_z b_z$$

V ravnini zadnji člen odpade. Zakaj to drži? Vektorja dolžine $1$ v smereh osi $x$ in $y$ sta pravokotna. Produkt vsakega s samim seboj je $1$, njun medsebojni produkt pa $0$. Zapiši $\vec a$ in $\vec b$ kot vsoto delov vzdolž osi in zmnoži člen za členom (to smemo, glej pravila spodaj). Ostanejo le pari delov v isti smeri.

Preizkus: $\vec a = (3, 0)$ in $\vec b = (2, 2)$ oklepata $45^\circ$, $|\vec a| = 3$, $|\vec b| = 2\sqrt 2$. Po definiciji $3 \cdot 2\sqrt2 \cdot \frac{\sqrt2}{2} = 6$, po komponentah $3 \cdot 2 + 0 \cdot 2 = 6$.

**Kot med vektorjema.** Definicijo obrnemo in izrazimo kosinus:

$$\cos\varphi = \frac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}$$

Števec izračunaš s komponentami, imenovalec z dolžinama, kot pa z $\arccos$. Poseben primer: $\vec a \cdot \vec a = |\vec a|^2$, ker vektor s seboj oklepa kot $0^\circ$. Od tod dobiš dolžino iz komponent: $|\vec a| = \sqrt{a_x^2 + a_y^2}$.

Za računanje velja še: $\vec a \cdot \vec b = \vec b \cdot \vec a$, $\vec a \cdot (\vec b + \vec c) = \vec a \cdot \vec b + \vec a \cdot \vec c$ in $(k\vec a) \cdot \vec b = k(\vec a \cdot \vec b)$.

V simulaciji spodaj (»Skalarni produkt in projekcija«) postavi $\vec a = (3, 1)$ in vleci konico $\vec b$, dokler skalarni produkt ni $0$. Opazi, da projekcija takrat izgine in da $\vec b$ stoji pravokotno na $\vec a$.

:::premisli
Vektor $\vec b$ podaljšaš na trikratno dolžino, smer ostane. Skalarni produkt se spremeni. Ali se spremeni tudi kot $\varphi$, ki ga iz produkta izračunaš? Napovej s formulo za $\cos\varphi$.
---
Skalarni produkt se potroji, ker se potroji senca. Kot ostane enak: v formuli za $\cos\varphi$ se trojka pojavi v števcu in imenovalcu ter se pokrajša.
:::

## Rešeni primeri

### Primer 1 (lažji): iz dolžin in kota

Vektorja z dolžinama $4$ in $5$ oklepata kot $60^\circ$. Izračunaj njun skalarni produkt.

**Podatki:** $|\vec a| = 4$, $|\vec b| = 5$, $\varphi = 60^\circ$
**Iščemo:** $\vec a \cdot \vec b$

:::formula
$\vec a \cdot \vec b = |\vec a|\,|\vec b|\cos\varphi$
:::

**Rešitev:**

1. Kosinus kota: $\cos 60^\circ = 0{,}5$.
2. Vstavimo, ker poznamo obe dolžini in kot: $\vec a \cdot \vec b = 4 \cdot 5 \cdot 0{,}5 = 10$.
3. Odgovor: skalarni produkt je $10$; pozitiven je, ker je kot oster.

### Primer 2: kot med odsekoma pohoda

Na zemljevidu (koordinate v kilometrih, $x$ proti vzhodu, $y$ proti severu) pohodnik prehodi prvi odsek $\vec a = (3, 4)$, nato drugi odsek $\vec b = (5, -12)$. Za kolikšen kot se je obrnil glede na prejšnjo smer, torej kolikšen je kot med vektorjema?

**Podatki:** $\vec a = (3, 4)$, $\vec b = (5, -12)$
**Iščemo:** kot $\varphi$ med $\vec a$ in $\vec b$

:::formula
$\cos\varphi = \dfrac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}$, $\quad \vec a \cdot \vec b = a_x b_x + a_y b_y$
:::

**Rešitev:**

1. Skalarni produkt po komponentah: $3 \cdot 5 + 4 \cdot (-12) = 15 - 48 = -33$. Že predznak pove, da bo kot top.
2. Dolžini: $|\vec a| = \sqrt{9 + 16} = 5$, $|\vec b| = \sqrt{25 + 144} = 13$.
3. Kosinus: $\cos\varphi = \dfrac{-33}{5 \cdot 13} = \dfrac{-33}{65} \approx -0{,}508$.
4. Kot: $\varphi = \arccos(-0{,}508) \approx 120{,}5^\circ$.
5. Odgovor: smeri odsekov oklepata približno $120{,}5^\circ$, pohodnik je torej ostro zavil skoraj proti jugu.

### Primer 3 (težji): trije kraji na zemljevidu

Kraji ležijo v točkah $A(1, 2)$, $B(5, 4)$ in $C(3, 8)$ (v kilometrih). Ali se cesti $BA$ in $BC$ v kraju $B$ srečata pod pravim kotom? Kolikšen je kot trikotnika pri $A$?

**Podatki:** $A(1, 2)$, $B(5, 4)$, $C(3, 8)$
**Iščemo:** ali je kot pri $B$ pravi; kot $\alpha$ pri $A$

:::formula
Vektorja kota z vrhom $B$ imata začetek v $B$: $\overrightarrow{BA} = A - B$, $\overrightarrow{BC} = C - B$. Kot: $\cos\alpha = \dfrac{\overrightarrow{AB} \cdot \overrightarrow{AC}}{|\overrightarrow{AB}|\,|\overrightarrow{AC}|}$
:::

**Rešitev:**

1. Vektorja iz $B$: $\overrightarrow{BA} = (1 - 5,\ 2 - 4) = (-4, -2)$, $\overrightarrow{BC} = (3 - 5,\ 8 - 4) = (-2, 4)$.
2. Produkt: $(-4) \cdot (-2) + (-2) \cdot 4 = 8 - 8 = 0$. Cesti sta pravokotni, kot pri $B$ je $90^\circ$.
3. Za kot pri $A$ vzamemo vektorja z začetkom v $A$: $\overrightarrow{AB} = (4, 2)$, $\overrightarrow{AC} = (2, 6)$.
4. Produkt: $4 \cdot 2 + 2 \cdot 6 = 8 + 12 = 20$. Dolžini: $|\overrightarrow{AB}| = \sqrt{20}$, $|\overrightarrow{AC}| = \sqrt{40}$.
5. Kosinus: $\cos\alpha = \dfrac{20}{\sqrt{20}\,\sqrt{40}} = \dfrac{20}{\sqrt{800}} \approx 0{,}707$, zato $\alpha = 45^\circ$.
6. Odgovor: cesti v $B$ se srečata pod pravim kotom, kot pri $A$ meri $45^\circ$. Trikotnik je enakokrak pravokoten, saj $|\overrightarrow{BA}| = |\overrightarrow{BC}| = \sqrt{20}$.

### Primer 4 – zdaj ti

Cesta na zemljevidu poteka v smeri $\vec c = (4, 3)$. Od nje želimo speljati ravno pešpot v smeri $\vec p = (6, t)$, ki mora biti na cesto pravokotna. Določi $t$.

**Podatki:** $\vec c = (4, 3)$, $\vec p = (6, t)$, $\vec p \perp \vec c$
**Iščemo:** število $t$

:::formula
$\vec c \perp \vec p \iff \vec c \cdot \vec p = 0$
:::

**Rešitev:**

1. Pravokotnost prevedemo v enačbo: $\vec c \cdot \vec p = 0$.
2. Po komponentah: $4 \cdot 6 + 3t = 0$, torej $24 + 3t = 0$.
3. Enačbo reši sam, nato preveri:

:::premisli
Koliko je $t$? Preveri tudi s produktom.
---
$3t = -24$, zato $t = -8$. Preizkus: $4 \cdot 6 + 3 \cdot (-8) = 24 - 24 = 0$. Pešpot ima smer $(6, -8)$.
:::

## Pogoste napake

- **Rezultat zapišeš kot vektor.** Kdor računa $(3, 4) \cdot (5, -12) = (15, -48)$, je komponente zmnožil, ni pa jih seštel. Skalarni produkt je eno samo število: $15 + (-48) = -33$.
- **Kot iz napačno postavljenih vektorjev.** Pri kotu trikotnika z vrhom $B$ nekdo vzame $\overrightarrow{AB}$ in $\overrightarrow{BC}$, ker »gresta po vrsti«. Ta vektorja nimata skupnega začetka, zato dobiš $180^\circ - \beta$. Oba vektorja naj izhajata iz vrha kota: $\overrightarrow{BA}$ in $\overrightarrow{BC}$.
- **Negativen produkt je napaka.** Negativen rezultat ni znak napačnega računa in ne pomeni negativnega kota. Pomeni top kot, ker je kosinus topega kota negativen.
- **Pozabljeno deljenje z dolžinama.** Če zapišeš $\cos\varphi = \vec a \cdot \vec b$, pogosto dobiš število, večje od $1$, in $\arccos$ ne obstaja. Skalarni produkt vsebuje tudi obe dolžini, zato ju moraš izločiti z deljenjem.
- **Produkt nič pomeni ničelni vektor.** Za vektorja, ki nista ničelna, $\vec a \cdot \vec b = 0$ pomeni pravokotnost, ne da je kateri od njiju »nič«.

## Povzetek

- $\vec a \cdot \vec b = |\vec a|\,|\vec b|\cos\varphi$; $\varphi$ je kot med vektorjema s skupnim začetkom, $0^\circ \le \varphi \le 180^\circ$.
- Pomen: dolžina $\vec a$ krat (predznačena) projekcija $\vec b$ na $\vec a$. Rezultat je število.
- Po komponentah: $\vec a \cdot \vec b = a_x b_x + a_y b_y + a_z b_z$.
- Kot: $\cos\varphi = \dfrac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}$, nato $\arccos$.
- Predznak: pozitiven pri ostrem, $0$ pri pravem, negativen pri topem kotu.
- Neničelna vektorja sta pravokotna natanko tedaj, ko je $\vec a \cdot \vec b = 0$. Velja $\vec a \cdot \vec a = |\vec a|^2$.

## Drugače: Z analogijo

Predstavljaj si, da je $\vec a$ tekoči trak na letališču, $\vec b$ pa tvoj korak. Trak »šteje« samo del koraka, ki kaže vzdolž njega. Korak naravnost po traku šteje v celoti, korak čez trak (pravokotno) ne šteje nič, korak nazaj šteje negativno. Skalarni produkt je ta šteti del, pomnožen še z dolžino traku: dolg trak naredi isti šteti del pomembnejši.

Analogija ima mejo: pri traku je vloga $\vec a$ in $\vec b$ različna, skalarni produkt pa je simetričen. Isto število dobiš, če senco $\vec a$ vržeš na $\vec b$ in jo pomnožiš z $|\vec b|$.

## Drugače: Iz vsakdanjega življenja

Na železniški postaji vlečeš kovček za ročaj, ki je nagnjen navzgor pod kotom $30^\circ$ glede na tla. Vlečeš s silo $\vec F$, kovček pa se premakne za $\vec s$ vodoravno naprej. Del sile, ki kaže navzgor, kovčka ne premika naprej, le malo ga razbremeni. Naprej deluje samo del $|\vec F|\cos 30^\circ$.

Fiziki temu rečejo **delo** sile: $\vec F \cdot \vec s = |\vec F|\,|\vec s|\cos\varphi$. Če bi vlekel pravokotno navzgor, bi bilo delo za premik naprej enako $0$. Če bi kovček zadrževal, ko se kotali po klancu navzdol, bi bilo delo negativno: tvoja sila kaže nazaj glede na premik.

## Preveri se

? Letalo leti proti cilju, veter piha s hitrostjo $40\,\mathrm{km/h}$. Skalarni produkt vektorja smeri letenja in vektorja vetra je $0$. Kaj to pomeni?
- Veter piha letalu naravnost v hrbet.
~ Takrat sta vektorja enako usmerjena in produkt je največji, ne $0$.
+ Veter piha pravokotno na smer letenja, zato letala ne pospešuje in ne zavira.
- Veter piha letalu naravnost v nos.
~ Pri nasprotni smeri je kot $180^\circ$ in produkt negativen, ne $0$.
> Oba vektorja nista ničelna, zato produkt $0$ pomeni $\cos\varphi = 0$, torej $\varphi = 90^\circ$.

? Vsi vektorji v treh parih so enako dolgi, v parih pa oklepajo kote $20^\circ$, $90^\circ$ in $135^\circ$. Razvrsti skalarne produkte od največjega do najmanjšega.
- $135^\circ$, $90^\circ$, $20^\circ$
~ Večji kot ne pomeni večjega produkta. Kosinus s kotom pada, pri $135^\circ$ je celo negativen.
+ $20^\circ$, $90^\circ$, $135^\circ$
- $90^\circ$, $20^\circ$, $135^\circ$
~ Pri pravem kotu je produkt $0$, pri ostrem kotu pa pozitiven, torej večji.
> Pri enakih dolžinah odloča $\cos\varphi$: $\cos 20^\circ \approx 0{,}94$, $\cos 90^\circ = 0$, $\cos 135^\circ \approx -0{,}71$.

? Kaj se zgodi s skalarnim produktom $\vec a \cdot \vec b$, če dolžino $\vec b$ podvojiš, smer pa ostane?
- Ostane enak, ker se kot ne spremeni.
~ Kot res ostane, a produkt vsebuje tudi dolžino $|\vec b|$, ki se je podvojila.
- Poveča se štirikrat.
~ Štirikrat bi se povečal le, če bi podvojil oba vektorja. Tu je podvojen samo eden.
+ Podvoji se.
> $(2\vec b)$ ima dvakrat daljšo senco, zato $\vec a \cdot (2\vec b) = 2(\vec a \cdot \vec b)$.

? Izračunaj $\vec a \cdot \vec b$ za $\vec a = (2, -1, 3)$ in $\vec b = (1, 4, 2)$.
- $(2, -4, 6)$
~ To so le zmnožene komponente. Skalarni produkt je njihova vsota, eno število.
- $12$
~ Tako dobiš, če izpustiš predznak pri $(-1) \cdot 4$. Ta člen je $-4$, ne $4$.
+ $4$
> $2 \cdot 1 + (-1) \cdot 4 + 3 \cdot 2 = 2 - 4 + 6 = 4$.

? Ladja pluje v smeri $\vec a = (2, 2)$, tok morja kaže v smeri $\vec b = (-3, 0)$. Kolikšen je kot med smerema?
- $45^\circ$
~ Tako dobiš, če izpustiš minus v $\vec a \cdot \vec b = -6$. Negativen produkt pomeni top kot.
- $-6^\circ$
~ $-6$ je skalarni produkt, ne kot. Deliti ga moraš z dolžinama in uporabiti $\arccos$.
+ $135^\circ$
> $\vec a \cdot \vec b = -6$, $|\vec a| = 2\sqrt2$, $|\vec b| = 3$, $\cos\varphi = \dfrac{-6}{6\sqrt2} \approx -0{,}707$, zato $\varphi = 135^\circ$.

:::simboli
\vec a, \vec b | vektorja | |
\vec c | smer ceste (primer 4); v pravilih računanja poljuben tretji vektor | |
\vec p | smer pešpoti | |
\varphi | kot med vektorjema | | | med $0^\circ$ in $180^\circ$, skupen začetek
\alpha | kot trikotnika pri $A$ | |
\beta | kot trikotnika pri $B$ | |
\vec F | sila, s katero vlečeš kovček | | N
\vec s | premik kovčka | | m
a_x, a_y, a_z | komponente vektorja $\vec a$ | |
b_x, b_y, b_z | komponente vektorja $\vec b$ | |
A, B, C | kraji (točke) na zemljevidu | | km
t | neznana komponenta smeri pešpoti | |
:::
