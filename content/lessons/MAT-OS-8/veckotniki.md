---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Poglej satovje v čebeljem panju: celice so šestkotniki, ki se tesno stikajo brez vrzeli. Ploščice v kopalnici so pogosto kvadrati ali šestkotniki, prometni znak STOP pa je osemkotnik. Zakaj čebele ne gradijo petkotnih celic? Odgovor se skriva v velikosti kotov.

Trikotnik in štirikotnik že poznaš: vsota notranjih kotov trikotnika je $180^\circ$, štirikotnika $360^\circ$. Zdaj to razširiš na poljubne večkotnike. Izračunal boš vsoto njihovih kotov, število diagonal in velikost kota v pravilnem večkotniku.

## Razlaga

**1. Večkotnik.** **Večkotnik** (tudi mnogokotnik) je lik, ki ga omejuje sklenjena lomljena črta iz daljic. Te daljice so **stranice**, njihova krajišča pa **oglišča**. Večkotnik z $n$ oglišči ima $n$ stranic in $n$ notranjih kotov; imenujemo ga **$n$-kotnik** (petkotnik, šestkotnik …). Ukvarjali se bomo s **konveksnimi** večkotniki: vsak notranji kot je manjši od $180^\circ$, lik nima »vdrtin«.

**2. Diagonale iz enega oglišča.** **Diagonala** je daljica, ki povezuje dve nesosednji oglišči. Iz izbranega oglišča ne gre diagonala do njega samega in ne do obeh sosednjih oglišč, saj tja vodita stranici. Zato iz vsakega oglišča $n$-kotnika izhaja $n - 3$ diagonal.

Nariši šestkotnik in iz oglišča $A$ potegni vse diagonale. Dobiš $6 - 3 = 3$ diagonale, ki šestkotnik razrežejo na $4$ trikotnike, kot pahljača.

:::premisli
Koliko diagonal izhaja iz enega oglišča desetkotnika in na koliko trikotnikov ga razdelijo?
---
$10 - 3 = 7$ diagonal, ki ga razdelijo na $8$ trikotnikov. Trikotnikov je vedno za enega več kot diagonal, torej $n - 2$.
:::

**3. Vsota notranjih kotov.** Koti vseh teh trikotnikov skupaj natanko zapolnijo notranje kote večkotnika. Vsak trikotnik prispeva $180^\circ$:

| $n$ | diagonale iz oglišča | trikotniki | vsota kotov |
|---|---|---|---|
| $3$ | $0$ | $1$ | $180^\circ$ |
| $4$ | $1$ | $2$ | $360^\circ$ |
| $5$ | $2$ | $3$ | $540^\circ$ |
| $6$ | $3$ | $4$ | $720^\circ$ |
| $8$ | $5$ | $6$ | $1080^\circ$ |

Splošno za $n$-kotnik velja:

$$S_n = (n - 2) \cdot 180^\circ$$

Ko dodamo eno oglišče, dobimo en trikotnik več, zato vsota zraste za $180^\circ$.

**4. Vse diagonale.** Iz vsakega od $n$ oglišč izhaja $n - 3$ diagonal, kar je skupaj $n(n - 3)$. Vendar smo tako vsako diagonalo šteli dvakrat: diagonalo $AC$ enkrat iz $A$ in enkrat iz $C$. Zato je število vseh diagonal

$$D_n = \frac{n(n - 3)}{2}$$

Petkotnik: $D_5 = \dfrac{5 \cdot 2}{2} = 5$. Šestkotnik: $D_6 = \dfrac{6 \cdot 3}{2} = 9$.

**5. Preizkusi v simulaciji.** V simulaciji spodaj (»Mnogokotniki: koti in diagonale«) spreminjaj število oglišč od $3$ do $8$. Za vsak večkotnik si zapiši vsoto notranjih kotov in število vseh diagonal. Opazi: vsota kotov vsakič zraste za enako ($180^\circ$), število diagonal pa raste vse hitreje ($0$, $2$, $5$, $9$, $14$, $20$).

**6. Pravilni večkotnik.** Večkotnik je **pravilen**, če ima vse stranice enako dolge **in** vse notranje kote enako velike. Primeri so enakostranični trikotnik, kvadrat in pravilni šestkotnik (celica v satovju). Romb ima enake stranice, a ne vseh kotov enakih, zato ni pravilen.

V pravilnem $n$-kotniku je vseh $n$ kotov enakih, zato vsoto razdelimo na $n$ enakih delov:

$$\alpha = \frac{(n - 2) \cdot 180^\circ}{n}$$

Pravilni šestkotnik: $\alpha = \dfrac{720^\circ}{6} = 120^\circ$.

**7. Zunanji kot.** **Zunanji kot** dobiš, če stranico podaljšaš čez oglišče: je kot med tem podaljškom in sosednjo stranico. Notranji in zunanji kot ob istem oglišču skupaj tvorita iztegnjeni kot, zato $\alpha + \alpha' = 180^\circ$. Vsota zunanjih kotov (po en ob vsakem oglišču) je pri vsakem konveksnem večkotniku $360^\circ$. V pravilnem $n$-kotniku so vsi enaki:

$$\alpha' = \frac{360^\circ}{n}$$

Šestkotnik: $\alpha' = 60^\circ$, in res $120^\circ + 60^\circ = 180^\circ$.

:::premisli
Kaj se dogaja z notranjim kotom pravilnega $n$-kotnika, ko $n$ raste? Ali lahko doseže $180^\circ$?
---
Notranji kot raste ($60^\circ$, $90^\circ$, $108^\circ$, $120^\circ$ …), ker se zunanji kot $\dfrac{360^\circ}{n}$ manjša. Kota $180^\circ$ nikoli ne doseže, saj je zunanji kot vedno večji od $0^\circ$. Pravilni večkotnik z zelo veliko oglišči je vse bolj podoben krogu.
:::

**8. Karakteristični trikotnik.** Oglišča pravilnega večkotnika ležijo na krožnici s središčem $S$. Če $S$ povežemo z vsemi oglišči, dobimo $n$ skladnih enakokrakih trikotnikov. Imenujemo jih **karakteristični trikotniki**. Kot ob $S$ je **središčni kot** $\varphi = \dfrac{360^\circ}{n}$, enako velik kot zunanji kot. Kota ob osnovnici sta polovici notranjega kota.

## Rešeni primeri

### Primer 1 (lažji)

Kolikšna je vsota notranjih kotov sedemkotnika?

**Podatki:** sedemkotnik, $n = 7$
**Iščemo:** vsoto notranjih kotov $S_7$

:::formula
$S_n = (n - 2) \cdot 180^\circ$
:::

**Rešitev:**

1. Diagonale iz enega oglišča razdelijo sedemkotnik na $7 - 2 = 5$ trikotnikov. Zakaj: trikotnikov je vedno za $2$ manj kot oglišč.
2. Vsak trikotnik prispeva $180^\circ$: $S_7 = 5 \cdot 180^\circ = 900^\circ$.
3. Odgovor: vsota notranjih kotov sedemkotnika je $900^\circ$.

### Primer 2 (srednji)

Izračunaj velikost notranjega kota pravilnega dvanajstkotnika in število vseh njegovih diagonal.

**Podatki:** pravilni dvanajstkotnik, $n = 12$
**Iščemo:** notranji kot $\alpha$ in število diagonal $D_{12}$

:::formula
$\alpha = \dfrac{(n - 2) \cdot 180^\circ}{n}$ in $D_n = \dfrac{n(n - 3)}{2}$
:::

**Rešitev:**

1. Vsota kotov: $S_{12} = 10 \cdot 180^\circ = 1800^\circ$. Zakaj: dvanajstkotnik razpade na $10$ trikotnikov.
2. Koti so enaki, zato $\alpha = \dfrac{1800^\circ}{12} = 150^\circ$.
3. Kontrola z zunanjim kotom: $\alpha' = \dfrac{360^\circ}{12} = 30^\circ$ in $180^\circ - 30^\circ = 150^\circ$. Drži.
4. Iz vsakega oglišča izhaja $12 - 3 = 9$ diagonal. Ker vsako štejemo dvakrat: $D_{12} = \dfrac{12 \cdot 9}{2} = 54$.
5. Odgovor: notranji kot meri $150^\circ$, dvanajstkotnik ima $54$ diagonal.

### Primer 3 (težji)

Notranji kot pravilnega večkotnika meri $140^\circ$. Koliko oglišč ima ta večkotnik in koliko diagonal?

**Podatki:** večkotnik je pravilen, $\alpha = 140^\circ$
**Iščemo:** število oglišč $n$ in število diagonal $D_n$

:::formula
$\alpha + \alpha' = 180^\circ$, $\;\alpha' = \dfrac{360^\circ}{n}$, $\;D_n = \dfrac{n(n - 3)}{2}$
:::

**Rešitev:**

1. Zunanji kot: $\alpha' = 180^\circ - 140^\circ = 40^\circ$. Zakaj: notranji in zunanji kot tvorita iztegnjeni kot.
2. Vsi zunanji koti skupaj merijo $360^\circ$, zato $n = \dfrac{360^\circ}{40^\circ} = 9$.
3. Kontrola z enačbo iz vsote kotov: $(n - 2) \cdot 180 = 140n$, torej $180n - 360 = 140n$, $40n = 360$, $n = 9$. Zakaj: dve različni poti dasta isti rezultat.
4. Diagonale: $D_9 = \dfrac{9 \cdot 6}{2} = 27$.
5. Odgovor: to je pravilni devetkotnik, ki ima $27$ diagonal.

### Primer 4: zdaj ti

Vsota notranjih kotov nekega večkotnika je $1440^\circ$. Koliko oglišč ima?

**Podatki:** $S_n = 1440^\circ$
**Iščemo:** število oglišč $n$

:::formula
$(n - 2) \cdot 180^\circ = S_n$
:::

**Rešitev:**

1. Zapišemo enačbo: $(n - 2) \cdot 180^\circ = 1440^\circ$. Zakaj: vsoto poznamo, neznano je število oglišč.
2. Delimo s $180^\circ$: $n - 2 = 8$.
3. Dokončaj sam in poimenuj večkotnik.

:::premisli
Koliko je $n$ in kako se večkotnik imenuje?
---
$n = 10$, to je desetkotnik. Preizkus: $8 \cdot 180^\circ = 1440^\circ$.
:::

## Pogoste napake

- **Vsota je $n \cdot 180^\circ$.** Za petkotnik bi tako dobil $900^\circ$. Napačno je, ker diagonale iz enega oglišča dajo le $n - 2$ trikotnikov; za trikotnik bi formula dala $540^\circ$, kar očitno ni res. Popravek: $S_n = (n - 2) \cdot 180^\circ$, za petkotnik $540^\circ$.
- **Diagonale brez deljenja z $2$.** Za osemkotnik izračunaš $8 \cdot 5 = 40$. Tako vsako diagonalo šteješ iz obeh krajišč. Popravek: $D_8 = \dfrac{8 \cdot 5}{2} = 20$. Pazi tudi, da $n - 3$ ni število vseh diagonal, ampak le tistih iz enega oglišča.
- **Notranji kot je $\dfrac{360^\circ}{n}$.** Za pravilni šestkotnik dobiš $60^\circ$. To je zunanji (in središčni) kot. Popravek: $\alpha = 180^\circ - \dfrac{360^\circ}{n}$, za šestkotnik $120^\circ$.
- **Pravilen pomeni le enake stranice.** Romb ima enake stranice, a ni pravilen, ker njegovi koti niso vsi enaki. Popravek: pravilni večkotnik ima enake stranice **in** enake kote.
- **Vsak kot je vsota deljena z $n$.** »V vsakem petkotniku meri kot $108^\circ$« velja le za pravilni petkotnik. Popravek: vsota $(n - 2) \cdot 180^\circ$ velja za vse večkotnike, deljenje z $n$ pa le za pravilne.

## Povzetek

- $n$-kotnik ima $n$ oglišč, $n$ stranic in $n$ notranjih kotov.
- Iz enega oglišča izhaja $n - 3$ diagonal, ki lik razdelijo na $n - 2$ trikotnikov.
- Vsota notranjih kotov: $S_n = (n - 2) \cdot 180^\circ$.
- Število vseh diagonal: $D_n = \dfrac{n(n - 3)}{2}$.
- Pravilni večkotnik ima enake stranice in enake kote.
- Notranji kot pravilnega $n$-kotnika: $\alpha = \dfrac{(n - 2) \cdot 180^\circ}{n}$.
- Zunanji in središčni kot: $\dfrac{360^\circ}{n}$; $\alpha + \alpha' = 180^\circ$.

## Drugače: Na sliki

Nariši petkotnik $ABCDE$ in iz oglišča $A$ potegni diagonali $AC$ in $AD$. Petkotnik razpade na tri trikotnike:

| trikotnik | koti, ki jih prispeva |
|---|---|
| $ABC$ | kot ob $B$, del kotov ob $A$ in $C$ |
| $ACD$ | del kotov ob $A$, $C$ in $D$ |
| $ADE$ | kot ob $E$, del kotov ob $A$ in $D$ |

Kot ob $A$ je razdeljen na tri dele, kota ob $C$ in $D$ pa na dva dela. Ko vse te dele seštejemo, dobimo natanko vse notranje kote petkotnika, nič ne manjka in nič ni odveč. Zato je vsota $3 \cdot 180^\circ = 540^\circ$. Pri šestkotniku bi pahljača imela štiri trikotnike, pri sedemkotniku pet.

## Drugače: Iz vsakdanjega življenja

**Sprehod okoli igrišča.** Predstavljaj si, da hodiš ob robu igrišča v obliki petkotnika. V vsakem oglišču se zasukaš za zunanji kot. Ko prideš na začetek, gledaš v isto smer kot na začetku, torej si se zasukal za cel krog, $360^\circ$. Zato je vsota zunanjih kotov vedno $360^\circ$, ne glede na število oglišč.

**Tlakovanje.** Ploščice se okoli ene točke stikajo brez vrzeli, če njihovi koti skupaj dajo $360^\circ$. Kvadrat ($90^\circ$) gre štirikrat, enakostranični trikotnik ($60^\circ$) šestkrat, pravilni šestkotnik ($120^\circ$) trikrat. Pravilni petkotnik ima kot $108^\circ$, in $360 : 108$ ni celo število, zato ostanejo vrzeli. Čebele s šestkotniki zapolnijo ploskev brez lukenj in porabijo malo voska.

## Drugače: Korak za korakom s številkami

Izračunajmo vse podatke za pravilni petkotnik, korak za korakom:

1. Število oglišč: $n = 5$.
2. Trikotniki iz enega oglišča: $5 - 2 = 3$.
3. Vsota kotov: $3 \cdot 180^\circ = 540^\circ$.
4. En notranji kot: $540^\circ : 5 = 108^\circ$.
5. Zunanji kot: $360^\circ : 5 = 72^\circ$; preveri $108^\circ + 72^\circ = 180^\circ$.
6. Diagonale iz oglišča: $5 - 3 = 2$; vseh diagonal $\dfrac{5 \cdot 2}{2} = 5$.

Na enak način dobiš tabelo pravilnih večkotnikov:

| $n$ | $\alpha$ | $\alpha'$ |
|---|---|---|
| $3$ | $60^\circ$ | $120^\circ$ |
| $4$ | $90^\circ$ | $90^\circ$ |
| $6$ | $120^\circ$ | $60^\circ$ |
| $8$ | $135^\circ$ | $45^\circ$ |
| $10$ | $144^\circ$ | $36^\circ$ |

Opazi, da sta v vsaki vrstici kota skupaj $180^\circ$.

## Drugače: Bolj natančno

**Vsota zunanjih kotov.** Ob vsakem oglišču je $\alpha + \alpha' = 180^\circ$. Seštejemo po vseh $n$ ogliščih: vsota notranjih in zunanjih kotov je $n \cdot 180^\circ$. Od tega odštejemo vsoto notranjih kotov:

$$n \cdot 180^\circ - (n - 2) \cdot 180^\circ = 2 \cdot 180^\circ = 360^\circ$$

Pri tem smo uporabili množenje izrazov; spremenljivka $n$ se odšteje in ostane število, ki ni odvisno od $n$.

**Diagonale drugače.** Vsaki dve oglišči povezuje daljica. Parov oglišč je $\dfrac{n(n - 1)}{2}$, saj vsako oglišče povežemo z $n - 1$ drugimi in vsak par štejemo dvakrat. Med temi daljicami je $n$ stranic, ostale so diagonale:

$$\frac{n(n - 1)}{2} - n = \frac{n^2 - 3n}{2} = \frac{n(n - 3)}{2}$$

Formula za vsoto notranjih kotov velja tudi za nekonveksne večkotnike, le pahljače iz enega oglišča tam ne moremo vedno narisati.

## Preveri se

? Koliko meri vsota notranjih kotov $n$-kotnika?
- $n \cdot 180^\circ$
~ Tako bi bilo, če bi lik razpadel na $n$ trikotnikov. Diagonale iz enega oglišča dajo le $n - 2$ trikotnikov.
+ $(n - 2) \cdot 180^\circ$
- $360^\circ$
~ To je vsota notranjih kotov le pri štirikotniku, pri vsakem večkotniku pa vsota zunanjih kotov.
> Diagonale iz enega oglišča razdelijo $n$-kotnik na $n - 2$ trikotnikov, vsak prispeva $180^\circ$.

? Romb ima vse stranice dolge $5\,\text{cm}$ in en kot $70^\circ$. Ali je pravilen večkotnik?
- Da, ker ima vse stranice enako dolge.
~ Enake stranice niso dovolj. Pravilni večkotnik mora imeti tudi vse kote enake.
- Da, ker ima nasprotne kote enake.
~ Nasprotna kota sta enaka v vsakem paralelogramu. Pravilni štirikotnik mora imeti vse štiri kote enake.
+ Ne, ker njegovi koti niso vsi enaki.
> Romb s kotom $70^\circ$ ima kote $70^\circ$ in $110^\circ$. Edini pravilni štirikotnik je kvadrat.

? Zakaj pri štetju vseh diagonal delimo z $2$?
- Ker diagonala razdeli večkotnik na dva dela.
~ Diagonala res razreže lik, a to s štetjem nima zveze. Deljenje odpravi dvojno štetje.
+ Ker vsako diagonalo štejemo iz obeh njenih krajišč.
- Ker ima vsako oglišče dve sosednji oglišči.
~ Sosednji oglišči (in oglišče samo) so razlog za $n - 3$, ne za deljenje z $2$.
> Diagonalo $AC$ štejemo pri $A$ in pri $C$, zato je produkt $n(n - 3)$ dvakrat prevelik.

? Koliko meri notranji kot pravilnega osemkotnika?
- $45^\circ$
~ To je zunanji (in središčni) kot $\dfrac{360^\circ}{8}$. Notranji kot je $180^\circ - 45^\circ$.
- $1080^\circ$
~ To je vsota vseh notranjih kotov. Ker so enaki, jo deli z $8$.
- $180^\circ$
~ Računal si $\dfrac{8 \cdot 180^\circ}{8}$ in pozabil $-2$. Kot v konveksnem večkotniku je manjši od $180^\circ$.
+ $135^\circ$
> $\alpha = \dfrac{6 \cdot 180^\circ}{8} = \dfrac{1080^\circ}{8} = 135^\circ$.

? Koliko diagonal ima sedemkotnik?
- $28$
~ To je $7 \cdot 4$ brez deljenja z $2$. Tako vsako diagonalo šteješ dvakrat.
- $4$
~ To je število diagonal iz enega oglišča, ne vseh.
+ $14$
> $D_7 = \dfrac{7 \cdot 4}{2} = 14$.

:::simboli
n | število oglišč (in stranic) večkotnika | | | n ≥ 3
S_n | vsota notranjih kotov n-kotnika | S_n = (n - 2) \cdot 180^\circ | °
D_n | število diagonal n-kotnika | D_n = \frac{n(n - 3)}{2} |
\alpha | notranji kot pravilnega n-kotnika | \alpha = \frac{(n - 2) \cdot 180^\circ}{n} | ° | α + α' = 180°
\alpha' | zunanji kot pravilnega n-kotnika | \alpha' = \dfrac{360^\circ}{n} | °
:::
