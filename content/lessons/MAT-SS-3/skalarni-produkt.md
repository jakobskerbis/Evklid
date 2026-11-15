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

V prostoru velja isto. Premici sta pravokotni, ko sta pravokotna vektorja v njunih smereh, tudi če sta mimobežni in se ne sekata. Premica je pravokotna na ravnino, ko je vektor v njeni smeri pravokoten na dva nekolinearna vektorja te ravnine.

**Računanje s komponentami.** Na zemljevidu običajno poznaš komponente, ne kotov. Potem računaš brez kota:

$$\vec a \cdot \vec b = a_x b_x + a_y b_y + a_z b_z$$

V ravnini zadnji člen odpade. Zakaj to drži? Vektorja dolžine $1$ v smereh osi $x$ in $y$ sta pravokotna. Produkt vsakega s samim seboj je $1$, njun medsebojni produkt pa $0$. Zapiši $\vec a$ in $\vec b$ kot vsoto delov vzdolž osi in zmnoži člen za členom (to smemo, glej pravila spodaj). Ostanejo le pari delov v isti smeri.

Preizkus: $\vec a = (3, 0)$ in $\vec b = (2, 2)$ oklepata $45^\circ$, $|\vec a| = 3$, $|\vec b| = 2\sqrt 2$. Po definiciji $3 \cdot 2\sqrt2 \cdot \frac{\sqrt2}{2} = 6$, po komponentah $3 \cdot 2 + 0 \cdot 2 = 6$.

**Kot med vektorjema.** Definicijo obrnemo in izrazimo kosinus:

$$\cos\varphi = \frac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}$$

Števec izračunaš s komponentami, imenovalec z dolžinama, kot pa z $\arccos$. Poseben primer: $\vec a \cdot \vec a = |\vec a|^2$, ker vektor s seboj oklepa kot $0^\circ$. Od tod dobiš dolžino iz komponent: $|\vec a| = \sqrt{a_x^2 + a_y^2}$.

Za računanje velja še: $\vec a \cdot \vec b = \vec b \cdot \vec a$, $\vec a \cdot (\vec b + \vec c) = \vec a \cdot \vec b + \vec a \cdot \vec c$ in $(k\vec a) \cdot \vec b = k(\vec a \cdot \vec b)$.

**Kosinusni izrek iz skalarnega produkta.** V trikotniku $ABC$ vzemi vektorja iz oglišča $C$: $\vec a = \overrightarrow{CB}$ in $\vec b = \overrightarrow{CA}$. Njuni dolžini sta stranici $a$ in $b$, oklepata pa kot $\gamma$. Tretja stranica je $\vec a - \vec b = \overrightarrow{AB}$ z dolžino $c$. Kvadrat dolžine je skalarni produkt vektorja s samim seboj:

$$|\vec a - \vec b|^2 = (\vec a - \vec b) \cdot (\vec a - \vec b)$$

$$(\vec a - \vec b) \cdot (\vec a - \vec b) = \vec a \cdot \vec a - 2\,\vec a \cdot \vec b + \vec b \cdot \vec b$$

Vstavimo $\vec a \cdot \vec a = a^2$, $\vec b \cdot \vec b = b^2$ in $\vec a \cdot \vec b = ab\cos\gamma$ ter dobimo kosinusni izrek:

$$c^2 = a^2 + b^2 - 2ab\cos\gamma$$

Pri $\gamma = 90^\circ$ je skalarni produkt $0$ in ostane Pitagorov izrek. Člen $-2ab\cos\gamma$ je torej dvakratni skalarni produkt z minusom.

**Pravokotna projekcija daljice in vektorja.** Pravokotna projekcija točke $T$ na premico $p$ je nožišče pravokotnice iz $T$ na $p$. Projekcija daljice $AB$ na premico je daljica $A'B'$ med projekcijama krajišč. Če daljica s premico oklepa oster kot $\varphi$, je $|A'B'| = |AB|\cos\varphi$. Enako projiciramo na ravnino, le da pravokotnico spustimo na ravnino. Palica dolžine $2\,\mathrm{m}$, ki s tlemi oklepa kot $60^\circ$, ima na tleh projekcijo $2 \cdot 0{,}5 = 1\,\mathrm{m}$.

Vektor $\vec b$ projiciramo na premico, na kateri leži $\vec a$, in dobimo vektor $\vec b_a$. Njegova predznačena dolžina je senca $|\vec b|\cos\varphi = \dfrac{\vec a \cdot \vec b}{|\vec a|}$, smer pa mu da enotski vektor $\dfrac{\vec a}{|\vec a|}$. Zmnožimo:

$$\vec b_a = \frac{\vec a \cdot \vec b}{|\vec a|^2}\,\vec a$$

Pri negativnem produktu kaže $\vec b_a$ nasprotno od $\vec a$. Za $\vec a = (4, 2)$ in $\vec b = (1, 3)$ je $\vec a \cdot \vec b = 4 + 6 = 10$ in $|\vec a|^2 = 20$, zato je $\vec b_a = \frac{10}{20}(4, 2) = (2, 1)$:

:::risba skica
opis: Vektorja a = (4, 2) in b = (1, 3) iz izhodišča O. Siva črtkana premica je nosilka vektorja a. Iz konice vektorja b v točki (1, 3) gre pravokotnica na to premico z nožiščem v točki (2, 1). Zelena puščica od O do (2, 1) je pravokotna projekcija vektorja b na a. Siva puščica od (2, 1) do (1, 3) je ostanek, pravokoten na a.
območje: -1,5; -1 .. 5,5; 4
enota: 40
mreža: da
črta: -1; -0,5 -> 5; 2,5 | siva črtkano
puščica: 0; 0 -> 4; 2 | | | modra
puščica: 0; 0 -> 1; 3 | b | levo | oranžna
puščica: 2; 1 -> 1; 3 | b − b_a | desno | siva
puščica: 0; 0 -> 2; 1 | b_a | pod | zelena
pravikot: 2; 1 | 0; 0 | 1; 3
napis: 3,4; 1,7 | a | pod | modra
točka: 0; 0 | O | levo
:::

Ostanek $\vec b - \vec b_a = (-1, 2)$ je pravokoten na $\vec a$, saj je $4 \cdot (-1) + 2 \cdot 2 = 0$. Vektor $\vec b$ smo tako razstavili na del vzdolž $\vec a$ in del pravokotno nanj. Enako razstavimo silo: del vzdolž poti telo premika, pravokotni del ga ne.

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

### Primer 5: dolžina razlike vektorjev

Vektorja $\vec a$ in $\vec b$ z dolžinama $3$ in $5$ oklepata kot $120^\circ$. Izračunaj dolžino vektorja $\vec a - \vec b$, torej tretjo stranico trikotnika, ki ga vektorja določata.

**Podatki:** $|\vec a| = 3$, $|\vec b| = 5$, $\varphi = 120^\circ$
**Iščemo:** $|\vec a - \vec b|$

:::formula
$|\vec a - \vec b|^2 = |\vec a|^2 - 2\,\vec a \cdot \vec b + |\vec b|^2$, $\quad \vec a \cdot \vec b = |\vec a|\,|\vec b|\cos\varphi$
:::

**Rešitev:**

1. Skalarni produkt: $\vec a \cdot \vec b = 3 \cdot 5 \cdot (-0{,}5) = -7{,}5$. Kot je top: $\cos 120^\circ = -0{,}5$.
2. Kvadrat dolžine: $|\vec a - \vec b|^2 = 9 - 2 \cdot (-7{,}5) + 25 = 49$. Minus krat minus da plus, zato je stranica daljša kot pri pravem kotu.
3. Odgovor: $|\vec a - \vec b| = \sqrt{49} = 7$. Enako da kosinusni izrek pri $\gamma = 120^\circ$.

### Primer 6: vleka čolna ob kanalu

Čoln v kanalu vlečemo z brega z vrvjo. Kanal poteka v smeri $\vec a = (4, 3)$, sila vrvi je $\vec F = (20, 90)\,\mathrm{N}$. Kolikšen del sile vleče čoln vzdolž kanala in kolikšen ga vleče proti bregu?

**Podatki:** $\vec a = (4, 3)$, $\vec F = (20, 90)\,\mathrm{N}$
**Iščemo:** pravokotno projekcijo $\vec F_a$ sile na smer kanala, njeno dolžino in pravokotni del $\vec F_\perp = \vec F - \vec F_a$

:::formula
$\vec F_a = \dfrac{\vec a \cdot \vec F}{|\vec a|^2}\,\vec a$, $\quad |\vec F_a| = \dfrac{\vec a \cdot \vec F}{|\vec a|}$, $\quad \vec F_\perp = \vec F - \vec F_a$
:::

**Rešitev:**

1. Skalarni produkt: $\vec a \cdot \vec F = 4 \cdot 20 + 3 \cdot 90 = 350$. Pozitiven je, zato vrv vleče naprej vzdolž kanala.
2. Dolžina smeri: $|\vec a|^2 = 4^2 + 3^2 = 25$, torej $|\vec a| = 5$.
3. Projekcija: $\vec F_a = \frac{350}{25}\,(4, 3) = 14 \cdot (4, 3) = (56, 42)\,\mathrm{N}$. Njena dolžina je $\frac{350}{5} = 70\,\mathrm{N}$.
4. Pravokotni del: $\vec F_\perp = (20 - 56,\ 90 - 42) = (-36, 48)\,\mathrm{N}$, njegova dolžina je $\sqrt{36^2 + 48^2} = 60\,\mathrm{N}$.
5. Preizkus: $4 \cdot (-36) + 3 \cdot 48 = 0$, del je res pravokoten na kanal. Tudi $70^2 + 60^2 = 8500 = 20^2 + 90^2$.
6. Odgovor: vzdolž kanala vleče $70\,\mathrm{N}$ sile, $60\,\mathrm{N}$ pa čoln vleče proti bregu. Ta del mora krmar izravnati s krmilom.

## Pogoste napake

- **Rezultat zapišeš kot vektor.** Kdor računa $(3, 4) \cdot (5, -12) = (15, -48)$, je komponente zmnožil, ni pa jih seštel. Skalarni produkt je eno samo število: $15 + (-48) = -33$.
- **Kot iz napačno postavljenih vektorjev.** Pri kotu trikotnika z vrhom $B$ nekdo vzame $\overrightarrow{AB}$ in $\overrightarrow{BC}$, ker »gresta po vrsti«. Ta vektorja nimata skupnega začetka, zato dobiš $180^\circ - \beta$. Oba vektorja naj izhajata iz vrha kota: $\overrightarrow{BA}$ in $\overrightarrow{BC}$.
- **Negativen produkt je napaka.** Negativen rezultat ni znak napačnega računa in ne pomeni negativnega kota. Pomeni top kot, ker je kosinus topega kota negativen.
- **Pozabljeno deljenje z dolžinama.** Če zapišeš $\cos\varphi = \vec a \cdot \vec b$, pogosto dobiš število, večje od $1$, in $\arccos$ ne obstaja. Skalarni produkt vsebuje tudi obe dolžini, zato ju moraš izločiti z deljenjem.
- **Dolžina projekcije z $|\vec a|^2$ v imenovalcu.** Ulomek $\dfrac{\vec a \cdot \vec b}{|\vec a|^2}$ je le koeficient pred $\vec a$. Dolžina projekcije je $\dfrac{\vec a \cdot \vec b}{|\vec a|}$ (v absolutni vrednosti).
- **Produkt nič pomeni ničelni vektor.** Za vektorja, ki nista ničelna, $\vec a \cdot \vec b = 0$ pomeni pravokotnost, ne da je kateri od njiju »nič«.

## Povzetek

- $\vec a \cdot \vec b = |\vec a|\,|\vec b|\cos\varphi$; $\varphi$ je kot med vektorjema s skupnim začetkom, $0^\circ \le \varphi \le 180^\circ$.
- Pomen: dolžina $\vec a$ krat (predznačena) projekcija $\vec b$ na $\vec a$. Rezultat je število.
- Po komponentah: $\vec a \cdot \vec b = a_x b_x + a_y b_y + a_z b_z$.
- Kot: $\cos\varphi = \dfrac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}$, nato $\arccos$.
- Predznak: pozitiven pri ostrem, $0$ pri pravem, negativen pri topem kotu.
- Neničelna vektorja sta pravokotna natanko tedaj, ko je $\vec a \cdot \vec b = 0$. Velja $\vec a \cdot \vec a = |\vec a|^2$.
- Pravokotna projekcija $\vec b$ na $\vec a$: $\vec b_a = \dfrac{\vec a \cdot \vec b}{|\vec a|^2}\,\vec a$, ostanek $\vec b - \vec b_a$ je pravokoten na $\vec a$.
- Kosinusni izrek: iz $|\vec a - \vec b|^2 = |\vec a|^2 - 2\,\vec a \cdot \vec b + |\vec b|^2$ sledi $c^2 = a^2 + b^2 - 2ab\cos\gamma$.

## Ponovitev

**Formule**
- $\vec a \cdot \vec b = |\vec a|\,|\vec b|\cos\varphi$ (na pamet)
- $\vec a \cdot \vec b = a_x b_x + a_y b_y + a_z b_z$ (na pamet)
- $\cos\varphi = \dfrac{\vec a \cdot \vec b}{|\vec a|\,|\vec b|}$ (na pamet)
- $\vec a \perp \vec b \iff \vec a \cdot \vec b = 0$ (na pamet)
- $\vec a \cdot \vec a = |\vec a|^2$ (na pamet)
- projekcija $\vec b$ na $\vec a$: $\vec b_a = \dfrac{\vec a \cdot \vec b}{|\vec a|^2}\,\vec a$ (na pamet)

**Postopek**
1. Zapiši vektorja s skupnim začetkom v vrhu iskanega kota.
2. Izračunaj komponente in skalarni produkt po komponentah.
3. Izračunaj dolžini obeh vektorjev.
4. Deli produkt z dolžinama in dobiš $\cos\varphi$.
5. Kot izračunaj z $\arccos$; pri pravokotnosti preveri $\vec a \cdot \vec b = 0$.

**Pazi na**
- Rezultat je število: komponente zmnoži in seštej.
- Pri kotu z vrhom $B$ vzemi $\overrightarrow{BA}$ in $\overrightarrow{BC}$, ne $\overrightarrow{AB}$.
- Za $\cos\varphi$ produkt deli z obema dolžinama.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Za katera realna števila $n$ sta vektorja $\vec a = (n, 2, -1)$ in $\vec b = (n, n, 8)$ pravokotna?

**Rešitev:**

1. Vektorja nista ničelna (druga komponenta $\vec a$ je $2$, tretja komponenta $\vec b$ je $8$), zato sta pravokotna natanko tedaj, ko je $\vec a \cdot \vec b = 0$.
2. Po komponentah: $n \cdot n + 2 \cdot n + (-1) \cdot 8 = 0$, torej $n^2 + 2n - 8 = 0$.
3. Razcep: $(n + 4)(n - 2) = 0$, zato je $n = -4$ ali $n = 2$.
4. Preizkus: pri $n = 2$ je $\vec a \cdot \vec b = 4 + 4 - 8 = 0$, pri $n = -4$ je $16 - 8 - 8 = 0$.
5. Odgovor: vektorja sta pravokotna za $n = 2$ in za $n = -4$.

**Točkovanje:** 1 točka za enačbo $n^2 + 2n - 8 = 0$ iz pogoja $\vec a \cdot \vec b = 0$, 1 točka za pravilno reševanje kvadratne enačbe, 1 točka za obe rešitvi $n = 2$ in $n = -4$.

### Naloga 2: krajša strukturirana naloga, 8 točk, pola 2 (z računalom)

Dan je trikotnik z oglišči $A(1, -1, 2)$, $B(3, 0, 4)$ in $C(2, 3, 1)$.

a) Izračunaj notranji kot $\alpha$ trikotnika pri oglišču $A$. Rezultat zaokroži na stotinko stopinje. (3 točke)
b) Izračunaj dolžino pravokotne projekcije vektorja $\overrightarrow{AC}$ na vektor $\overrightarrow{AB}$ in zapiši to projekcijo kot vektor s komponentami. (3 točke)
c) Izračunaj višino trikotnika na stranico $AB$ in ploščino trikotnika $ABC$. Rezultata zaokroži na dve decimalni mesti. (2 točki)

**Rešitev:**

1. a) Oba vektorja izhajata iz vrha kota $A$: $\overrightarrow{AB} = (3 - 1,\ 0 + 1,\ 4 - 2) = (2, 1, 2)$ in $\overrightarrow{AC} = (2 - 1,\ 3 + 1,\ 1 - 2) = (1, 4, -1)$.
2. a) Skalarni produkt: $\overrightarrow{AB} \cdot \overrightarrow{AC} = 2 \cdot 1 + 1 \cdot 4 + 2 \cdot (-1) = 4$. Dolžini: $|\overrightarrow{AB}| = \sqrt{4 + 1 + 4} = 3$ in $|\overrightarrow{AC}| = \sqrt{1 + 16 + 1} = \sqrt{18} = 3\sqrt{2}$.
3. a) $\cos\alpha = \dfrac{4}{3 \cdot 3\sqrt{2}} = \dfrac{4}{9\sqrt{2}} \approx 0{,}314270$, zato je $\alpha = \arccos 0{,}314270 \approx 71{,}6833^\circ \approx 71{,}68^\circ$.
4. b) Dolžina projekcije je $|\overrightarrow{AC}|\cos\alpha = \dfrac{\overrightarrow{AB} \cdot \overrightarrow{AC}}{|\overrightarrow{AB}|} = \dfrac{4}{3}$.
5. b) Skalarni produkt je pozitiven, zato projekcija kaže v smer $\overrightarrow{AB}$. Enotski vektor v tej smeri je $\frac{1}{3}(2, 1, 2)$, projekcija pa $\frac{4}{3} \cdot \frac{1}{3}(2, 1, 2) = \frac{4}{9}(2, 1, 2) = \left(\frac{8}{9}, \frac{4}{9}, \frac{8}{9}\right)$.
6. c) Višina $v_c$ na stranico $AB$, projekcija dolžine $\frac{4}{3}$ in stranica $AC$ tvorijo pravokotni trikotnik s hipotenuzo $|\overrightarrow{AC}| = \sqrt{18}$. Zato je $v_c^2 = 18 - \frac{16}{9} = \frac{146}{9}$ in $v_c = \frac{\sqrt{146}}{3} \approx 4{,}0277$, torej $v_c \approx 4{,}03$.
7. c) Ploščina: $S = \dfrac{|\overrightarrow{AB}| \cdot v_c}{2} = \dfrac{\sqrt{146}}{2} \approx 6{,}0415$, torej $S \approx 6{,}04$. Enako dobimo iz $S = \frac{1}{2}\,|\overrightarrow{AB}|\,|\overrightarrow{AC}| \sin\alpha$.
8. Odgovor: a) $\alpha \approx 71{,}68^\circ$; b) dolžina projekcije je $\frac{4}{3}$, projekcija je $\left(\frac{8}{9}, \frac{4}{9}, \frac{8}{9}\right)$; c) $v_c \approx 4{,}03$, $S \approx 6{,}04$.

**Točkovanje:** a) 1 točka za vektorja iz oglišča $A$ in skalarni produkt $4$, 1 točka za dolžini $3$ in $3\sqrt{2}$, 1 točka za $\alpha \approx 71{,}68^\circ$; b) 1 točka za dolžino projekcije $\frac{4}{3}$, 1 točka za smer (enotski vektor ali faktor $\frac{4}{9}$), 1 točka za $\left(\frac{8}{9}, \frac{4}{9}, \frac{8}{9}\right)$; c) 1 točka za $v_c \approx 4{,}03$ in 1 točka za $S \approx 6{,}04$.

### Ustno vprašanje 1

:::premisli
Kako je definiran skalarni produkt dveh vektorjev in kaj njegov predznak pove o kotu med njima?
---
Skalarni produkt vektorjev $\vec a$ in $\vec b$ je število $\vec a \cdot \vec b = |\vec a|\,|\vec b|\cos\varphi$, kjer je $\varphi$ kot med vektorjema s skupnim začetkom in $0^\circ \le \varphi \le 180^\circ$. Geometrijsko je to dolžina vektorja $\vec a$, pomnožena s predznačeno dolžino pravokotne projekcije vektorja $\vec b$ na $\vec a$. Za neničelna vektorja sta dolžini pozitivni, zato o predznaku odloča $\cos\varphi$. Pozitiven produkt torej pomeni oster kot, produkt $0$ pravi kot in negativen produkt top kot.
:::

### Ustno vprašanje 2

:::premisli
Izpelji kosinusni izrek za trikotnik s pomočjo skalarnega produkta vektorjev.
---
V trikotniku $ABC$ vzamemo vektorja $\vec a = \overrightarrow{CB}$ in $\vec b = \overrightarrow{CA}$, ki imata dolžini $a$ in $b$ ter oklepata kot $\gamma$. Tretja stranica je vektor $\overrightarrow{AB} = \vec a - \vec b$ z dolžino $c$. Kvadrat dolžine vektorja je skalarni produkt vektorja s samim seboj, zato je $c^2 = (\vec a - \vec b) \cdot (\vec a - \vec b) = \vec a \cdot \vec a - 2\,\vec a \cdot \vec b + \vec b \cdot \vec b$. Ko vstavimo $\vec a \cdot \vec a = a^2$, $\vec b \cdot \vec b = b^2$ in $\vec a \cdot \vec b = ab\cos\gamma$, dobimo $c^2 = a^2 + b^2 - 2ab\cos\gamma$. Pri $\gamma = 90^\circ$ je $\cos\gamma = 0$ in izrek preide v Pitagorov izrek.
:::

### Ustno vprašanje 3

:::premisli
Navedi primer dveh neničelnih pravokotnih vektorjev v prostoru in pojasni, kako pravokotnost preveriš brez merjenja kota.
---
Primer sta vektorja $\vec a = (1, 2, 2)$ in $\vec b = (2, 1, -2)$. Njun skalarni produkt po komponentah je $1 \cdot 2 + 2 \cdot 1 + 2 \cdot (-2) = 0$. Ker sta vektorja neničelna, iz $|\vec a|\,|\vec b|\cos\varphi = 0$ sledi $\cos\varphi = 0$ in zato $\varphi = 90^\circ$. Neničelna vektorja sta torej pravokotna natanko tedaj, ko je njun skalarni produkt enak $0$.
:::

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

? (brez računala) Kolikšna je dolžina pravokotne projekcije vektorja $\vec b = (7, 1)$ na vektor $\vec a = (3, 4)$?
= 5
~ 25 | To je skalarni produkt $\vec a \cdot \vec b$. Dolžino projekcije dobiš, ko ga deliš z $|\vec a| = 5$.
~ 1 | Delil si z $|\vec a|^2 = 25$. Tako dobiš koeficient pred $\vec a$ v vektorju projekcije, ne dolžine.
~ 7,07 | To je dolžina vektorja $\vec b$. Projekcija je krajša, ker $\vec b$ ni vzporeden z $\vec a$.
> $\vec a \cdot \vec b = 21 + 4 = 25$ in $|\vec a| = 5$, zato je dolžina projekcije $\frac{25}{5} = 5$. Projekcija je $\frac{25}{25}\vec a = (3, 4)$.

? Kocka ima oglišča $A(0, 0, 0)$, $B(4, 0, 0)$, $D(0, 4, 0)$ in $G(4, 4, 4)$. Telesna diagonala $AG$ in ploskovna diagonala $BD$ nimata skupne točke. Koliko je $\overrightarrow{AG} \cdot \overrightarrow{BD}$?
= 0
~ 32 | Za $\overrightarrow{BD}$ si sešel koordinati točk. Vektor od $B$ do $D$ je $D - B = (-4, 4, 0)$.
> $\overrightarrow{AG} = (4, 4, 4)$ in $\overrightarrow{BD} = (-4, 4, 0)$, produkt je $-16 + 16 + 0 = 0$. Diagonali sta pravokotni mimobežnici.

<<RACUN
vrednost: 3*5*cos(120°) | -7.5
vrednost: 9-2*(-7.5)+25 | 49
vrednost: sqrt(3^2+5^2-2*3*5*cos(120°)) | 7
resi: n^2+2*n-8=0 | n | -4, 2
vrednost: 2*1+1*4+2*(-1) | 4
vrednost: sqrt(1^2+4^2+(-1)^2) | 3*sqrt(2)
vrednost: 4/(9*sqrt(2)) | 0.314270
vrednost: acos(4/(9*sqrt(2)))*180/pi | 71.68
vrednost: 4/3*1/3*2 | 8/9
vrednost: 18-16/9 | 146/9
vrednost: sqrt(146)/3 | 4.03
vrednost: sqrt(146)/2 | 6.04
vrednost: 1/2*3*sqrt(18)*sin(acos(4/(9*sqrt(2)))) | 6.04
vrednost: 1*2+2*1+2*(-2) | 0
vrednost: 2*cos(60°) | 1
vrednost: 4*1+2*3 | 10
vrednost: 10/20*4 | 2
vrednost: 10/20*2 | 1
vrednost: 4*(1-2)+2*(3-1) | 0
vrednost: 4*20+3*90 | 350
vrednost: 350/25 | 14
vrednost: 14*4 | 56
vrednost: 14*3 | 42
vrednost: sqrt(56^2+42^2) | 70
vrednost: 350/5 | 70
vrednost: sqrt((20-56)^2+(90-42)^2) | 60
vrednost: 4*(-36)+3*48 | 0
vrednost: 20^2+90^2 | 8500
vrednost: 70^2+60^2 | 8500
vrednost: (3*7+4*1)/sqrt(3^2+4^2) | 5
vrednost: 4*(-4)+4*4+4*0 | 0
>>

:::simboli
\vec a, \vec b | vektorja (v primeru 6 je $\vec a$ smer kanala) | |
\vec c | smer ceste (primer 4); v pravilih računanja poljuben tretji vektor | |
\vec p | smer pešpoti | |
\varphi | kot med vektorjema | | | med $0^\circ$ in $180^\circ$, skupen začetek
\alpha | kot trikotnika pri $A$ | |
\beta | kot trikotnika pri $B$ | |
\vec F | sila (vrv pri vleki čolna v primeru 6; vlečenje kovčka) | | N
\vec b_a | pravokotna projekcija vektorja $\vec b$ na $\vec a$ | \vec b_a = \frac{\vec a \cdot \vec b}{\lvert\vec a\rvert^2}\,\vec a |
\vec F_a | pravokotna projekcija sile na smer kanala | \vec F_a = \frac{\vec a \cdot \vec F}{\lvert\vec a\rvert^2}\,\vec a | N
\vec F_\perp | del sile, pravokoten na kanal | \vec F_\perp = \vec F - \vec F_a | N
\vec s | premik kovčka | | m
a_x, a_y, a_z | komponente vektorja $\vec a$ | |
b_x, b_y, b_z | komponente vektorja $\vec b$ | |
A, B, C | točke: v primeru 3 kraji na zemljevidu (v km), v vprašanju oglišča kocke | |
t | neznana komponenta smeri pešpoti | |
a, b | dolžini vektorjev $\vec a$ in $\vec b$ (stranici trikotnika) | | | v kosinusnem izreku
c | tretja stranica trikotnika, dolžina $\vec a - \vec b$ | c^2 = a^2 + b^2 - 2ab\cos\gamma |
\gamma | kot trikotnika pri $C$, med $\vec a$ in $\vec b$ | |
:::
