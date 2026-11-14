---
stanje: preverjeno
avtor: AI
---

## Zakaj se tega učimo

Tilen iz lesenih kock zlaga stopnice za maketo hiše. Prva stopnica je ena kocka, druga stolpec iz dveh kock, tretja iz treh … Za $10$ stopnic je porabil $55$ kock. »Za $20$ stopnic bom potreboval dvakrat toliko, torej $110$ kock,« reče sošolki. Ima prav?

Ugibati ni treba. Odgovor dobiš z enim računom, ko spoznaš dve vrsti zaporedij, ki ju srečaš v vsaki delavnici. Pri **aritmetičnem** zaporedju naslednji člen dobiš tako, da prišteješ vedno isto število: vsaka stopnica ima eno kocko več, vsaka vrsta strešnikov dva več. Pri **geometrijskem** vedno množiš z istim številom: deska, ki jo vsakič prežagaš na pol, se vsakič skrajša za polovico. Za obe vrsti boš znal izračunati poljuben člen in vsoto prvih $n$ členov, ne da bi člene seštel enega za drugim.

## Razlaga

**1. Dve zaporedji v tabeli.** Obe zaporedji se začneta z $2$. Prvo vsakič poveča za $3$, drugo vsakič pomnoži s $3$:

| $n$ | prištevamo $3$ | množimo s $3$ |
|---|---|---|
| 1 | $2$ | $2$ |
| 2 | $5$ | $6$ |
| 3 | $8$ | $18$ |
| 4 | $11$ | $54$ |
| 5 | $14$ | $162$ |

Prvo raste enakomerno, drugo vedno hitreje.

*Preveri:* kolikšen je šesti člen v vsakem stolpcu? *(Odgovor: $17$ in $486$.)*

**2. Aritmetično zaporedje.** Zaporedje je **aritmetično**, če je razlika dveh zaporednih členov vedno enaka. To stalno razliko imenujemo **diferenca** in jo označimo z $d$:

$$a_{n+1} - a_n = d.$$

*Preveri:* kolikšna je diferenca zaporedja $10, 7, 4, 1, \ldots$? *(Odgovor: $d = -3$; diferenca je lahko negativna.)*

**3. Splošni člen aritmetičnega zaporedja.** Od $a_1$ do $a_n$ naredimo $n - 1$ korakov, vsak prinese $d$. Zato je splošni člen

$$a_n = a_1 + (n-1)\,d.$$

Če je $d > 0$, je zaporedje strogo naraščajoče, če je $d < 0$, strogo padajoče, pri $d = 0$ pa konstantno.

:::premisli
Zaporedje je $3, 7, 11, \ldots$ Sošolec izračuna $a_{10} = 3 + 10 \cdot 4 = 43$. Kje se zmoti in koliko je $a_{10}$ v resnici?
---
$d = 4$, $a_{10} = 3 + 9 \cdot 4 = 39$. Od prvega do desetega člena je le $9$ korakov: prvi člen že imamo, diferenco prištejemo za vsak naslednji člen.
:::

**4. Vsota aritmetičnega zaporedja.** Z $S_n$ označimo **vsoto prvih $n$ členov**: $S_n = a_1 + a_2 + \ldots + a_n$. Mladi Gauss je baje v nekaj minutah seštel $1 + 2 + \ldots + 100$. Pod vsoto je isto vsoto zapisal še v obratnem vrstnem redu in seštel števili, ki stojita drugo pod drugim: $1 + 100$, $2 + 99$, $3 + 98$ … Vsak par da $101$, parov je $100$. Ker je vsako število v računu dvakrat, je to dvojna vsota. Torej je vsota $\dfrac{100 \cdot 101}{2} = 5050$.

Isti premislek velja za vsako aritmetično zaporedje, ker se od para do para prvi člen poveča za $d$, drugi pa zmanjša za $d$, zato ima vsak od $n$ parov vsoto $a_1 + a_n$:

$$S_n = \frac{n}{2}\,(a_1 + a_n) = \frac{n}{2}\,\bigl(2a_1 + (n-1)\,d\bigr).$$

*Preveri:* koliko kock potrebuje Tilen za $20$ stopnic? *(Odgovor: $\frac{20}{2}(1 + 20) = 210$, skoraj štirikrat toliko kot za $10$ stopnic. Tilen se moti: vsaka od novih stopnic ima več kock kot katera koli od prvih desetih.)*

**5. Geometrijsko zaporedje.** Zaporedje z neničelnimi členi je **geometrijsko**, če je količnik dveh zaporednih členov vedno enak. To stalno število imenujemo **količnik** in ga označimo s $q$:

$$\frac{a_{n+1}}{a_n} = q.$$

*Preveri:* ostanki deske, ki jo vsakič prežagaš na pol, merijo $96$, $48$, $24$ … centimetrov. Kolikšen je $q$? *(Odgovor: $q = \frac{1}{2}$.)*

Od $a_1$ do $a_n$ spet naredimo $n - 1$ korakov, le da vsak korak pomeni množenje s $q$:

$$a_n = a_1 \cdot q^{\,n-1}.$$

Pri $a_1 > 0$ je zaporedje za $q > 1$ strogo naraščajoče, za $0 < q < 1$ strogo padajoče, za $q = 1$ pa konstantno. Za $q < 0$ členi izmenično menjajo predznak, zato zaporedje ni monotono. Takemu zaporedju rečemo **alternirajoče**.

:::premisli
Zaporedji $2, 4, 6, \ldots$ in $2, 4, 8, \ldots$ se začneta enako. Napovej, kolikšen je deseti člen vsakega.
---
Prvo je aritmetično z $d = 2$: $a_{10} = 2 + 9 \cdot 2 = 20$. Drugo je geometrijsko s $q = 2$: $a_{10} = 2 \cdot 2^9 = 1024$. Pri $a_1 > 0$ in $q > 1$ geometrijsko zaporedje prej ali slej prehiti vsako aritmetično.
:::

**6. Vsota geometrijskega zaporedja.** Vsoto $S_n = a_1 + a_1 q + \ldots + a_1 q^{n-1}$ pomnožimo s $q$: $q S_n = a_1 q + a_1 q^2 + \ldots + a_1 q^n$. Obe vsoti imata skupne vse člene razen $a_1$ in $a_1 q^n$, zato pri odštevanju ostane $S_n - q S_n = a_1 - a_1 q^n$. Za $q \ne 1$ izpostavimo $S_n$, delimo z $1 - q$ ter števec in imenovalec pomnožimo z $-1$:

$$S_n = a_1 \cdot \frac{q^n - 1}{q - 1}.$$

Pri $q = 1$ so vsi členi enaki $a_1$, zato je $S_n = n \cdot a_1$.

*Preveri:* koliko je $1 + 2 + 4 + 8 + 16$ po formuli? *(Odgovor: $\frac{2^5 - 1}{2 - 1} = 31$.)*

V simulaciji spodaj (»Aritmetično in geometrijsko zaporedje«) primerjaj grafa obeh vrst zaporedij. Naloga: pri aritmetičnem zaporedju preveri, da točke $(n, a_n)$ ležijo na isti premici; pri geometrijskem zaporedju s količnikom večjim od $1$ opazi, da so razmiki med sosednjimi točkami vedno večji.

**7. Zaporedje po vzorcu.** Pri nalogi »nadaljuj zaporedje« iščemo pravilo, ki ga izpolnjujejo vsi dani členi. Iz nekaj primerov sklepamo na splošno pravilo: temu rečemo **induktivno sklepanje**. Pomagajo vprašanja po vrsti:

1. Ali so razlike sosednjih členov enake (aritmetično zaporedje)? Ali so količniki enaki (geometrijsko)?
2. Če ne, ali razlike same tvorijo preprosto zaporedje? Pri $1, 4, 9, 16, \ldots$ so razlike $3, 5, 7$: vsaka je za $2$ večja, zato je naslednja razlika $9$ in naslednji člen $25$.
3. Ali je člen povezan s svojim indeksom $n$ ali z znanim zaporedjem (kvadrati, potence)? Členi $1, 4, 9, 16$ so kvadrati: $a_n = n^2$. Členi $4, 10, 28, 82$ so za $1$ večji od potenc števila $3$: $a_n = 3^n + 1$, naslednji člen je $244$.
4. Domnevo za splošni člen **preveri pri vseh danih členih**. Šele nato je posplošitev smiselna.

Nekaj danih členov zaporedja ne določa enolično. Zaporedje $1, 2, 4, \ldots$ lahko nadaljuješ z $8$ (podvajanje) ali s $7$ (razlike $1, 2, 3$). Zato zapiši pravilo, ki si ga uporabil. Formula, dobljena z induktivnim sklepanjem, je le domneva. Da velja za vsak $n$, moramo šele dokazati, na primer z matematično indukcijo.

*Preveri:* nadaljuj zaporedje $1, 3, 7, 15, 31, \ldots$ in zapiši splošni člen. *(Odgovor: $63$; vsak člen je za $1$ manjši od potence števila $2$, $a_n = 2^n - 1$.)*

## Rešeni primeri

### Primer 1 (lažji)

Aritmetično zaporedje ima prvi člen $a_1 = 5$ in diferenco $d = 3$. Izračunaj dvajseti člen in vsoto prvih dvajsetih členov.

**Podatki:** $a_1 = 5$, $d = 3$, $n = 20$
**Iščemo:** člen $a_{20}$ in vsoto $S_{20}$

:::formula
$a_n = a_1 + (n-1)\,d$, $\quad S_n = \dfrac{n}{2}\,(a_1 + a_n)$
:::

**Rešitev:**

1. Do dvajsetega člena je $19$ korakov: $a_{20} = 5 + 19 \cdot 3 = 62$.
2. Vsota po Gaussovem premisleku, saj poznamo prvi in zadnji člen: $S_{20} = \dfrac{20}{2} \cdot (5 + 62) = 10 \cdot 67 = 670$.
3. Odgovor: dvajseti člen je $62$, vsota prvih dvajsetih členov je $670$.

### Primer 2 (srednji)

Geometrijsko zaporedje ima prvi člen $a_1 = 3$ in količnik $q = 2$. Izračunaj osmi člen in vsoto prvih osmih členov.

**Podatki:** $a_1 = 3$, $q = 2$, $n = 8$
**Iščemo:** člen $a_8$ in vsoto $S_8$

:::formula
$a_n = a_1 \cdot q^{\,n-1}$, $\quad S_n = a_1 \cdot \dfrac{q^n - 1}{q - 1}$
:::

**Rešitev:**

1. Do osmega člena je $7$ množenj z $2$: $a_8 = 3 \cdot 2^7 = 3 \cdot 128 = 384$.
2. Ker je $q \ne 1$, uporabimo formulo za geometrijsko vsoto: $S_8 = 3 \cdot \dfrac{2^8 - 1}{2 - 1} = 3 \cdot 255 = 765$.
3. Preizkus smiselnosti: vsota je malo manj kot dvakratnik zadnjega člena, kar je pri $q = 2$ pričakovano, saj je vsak člen večji od vsote vseh prejšnjih.
4. Odgovor: osmi člen je $384$, vsota prvih osmih členov je $765$.

### Primer 3 (težji)

Krovec polaga strešnike na streho v obliki trapeza. V najvišji vrsti je $18$ strešnikov, v vsaki naslednji vrsti navzdol pa $2$ več kot v prejšnji. Za streho je porabil natanko $740$ strešnikov. Koliko vrst ima streha in koliko strešnikov je v najnižji vrsti?

**Podatki:** $a_1 = 18$, $d = 2$, $S_n = 740$
**Iščemo:** število vrst $n$ in število strešnikov v najnižji vrsti $a_n$

:::formula
$S_n = \dfrac{n}{2}\,\bigl(2a_1 + (n-1)\,d\bigr)$, $\quad a_n = a_1 + (n-1)\,d$
:::

**Rešitev:**

1. Števila strešnikov po vrstah tvorijo aritmetično zaporedje, ker se vsakič povečajo za isto število.
2. Neznan je $n$, zato uporabimo obliko vsote brez $a_n$: $740 = \dfrac{n}{2}\,\bigl(36 + 2(n-1)\bigr) = n\,(n + 17)$.
3. Dobimo kvadratno enačbo $n^2 + 17n - 740 = 0$.
4. Diskriminanta: $D = 17^2 + 4 \cdot 740 = 289 + 2960 = 3249 = 57^2$.
5. Rešitvi sta $n = \dfrac{-17 + 57}{2} = 20$ in $n = \dfrac{-17 - 57}{2} = -37$. Število vrst je naravno število, zato velja $n = 20$.
6. Najnižja vrsta: $a_{20} = 18 + 19 \cdot 2 = 56$. Preizkus: $\dfrac{20}{2} \cdot (18 + 56) = 740$.
7. Odgovor: streha ima $20$ vrst, v najnižji vrsti je $56$ strešnikov.

### Primer 4: nadaljuj in posploši

Zaporedje se začne s členi $2, 6, 12, 20, 30, \ldots$ Nadaljuj ga z dvema členoma, ugani splošni člen in ugotovi, kateri člen zaporedja je enak $420$.

**Podatki:** $a_1 = 2$, $a_2 = 6$, $a_3 = 12$, $a_4 = 20$, $a_5 = 30$, $a_n = 420$
**Iščemo:** $a_6$, $a_7$, splošni člen $a_n$ in indeks $n$ člena $420$

:::formula
Razlike sosednjih členov $a_{n+1} - a_n$; domnevo za $a_n$ preveri pri vseh danih členih.
:::

**Rešitev:**

1. Razlike so $4, 6, 8, 10$, zato zaporedje ni aritmetično. Količniki $3$; $2$; $1{,}67$ … niso enaki, zato tudi ni geometrijsko.
2. Razlike se vsakič povečajo za $2$. Naslednji razliki sta $12$ in $14$, zato je $a_6 = 30 + 12 = 42$ in $a_7 = 42 + 14 = 56$.
3. Posplošimo: $2 = 1 \cdot 2$, $6 = 2 \cdot 3$, $12 = 3 \cdot 4$, $20 = 4 \cdot 5$, $30 = 5 \cdot 6$. Vsak člen je produkt indeksa in naslednjega števila, domneva je $a_n = n(n + 1)$.
4. Preizkus na novih členih: $a_6 = 6 \cdot 7 = 42$ in $a_7 = 7 \cdot 8 = 56$, kar se ujema s korakom 2.
5. Člen $420$: enačba $n(n + 1) = 420$ oziroma $n^2 + n - 420 = 0$ ima rešitvi $n = 20$ in $n = -21$. Indeks je naravno število, zato $n = 20$.
6. Odgovor: naslednja člena sta $42$ in $56$, splošni člen je $a_n = n(n + 1)$, število $420$ je dvajseti člen.

### Primer 5: zdaj ti

V geometrijskem zaporedju je $a_2 = 6$ in $a_5 = 48$. Izračunaj vsoto prvih šestih členov.

**Podatki:** $a_2 = 6$, $a_5 = 48$, $n = 6$
**Iščemo:** vsoto $S_6$

:::formula
$a_n = a_1 \cdot q^{\,n-1}$, $\quad S_n = a_1 \cdot \dfrac{q^n - 1}{q - 1}$
:::

**Rešitev:**

1. Od $a_2$ do $a_5$ so trije koraki, zato je $a_5 = a_2 \cdot q^3$ in $q^3 = \dfrac{48}{6} = 8$, torej $q = 2$.
2. Prvi člen je en korak pred drugim: $a_1 = \dfrac{a_2}{q} = \dfrac{6}{2} = 3$.
3. Zdaj izračunaj vsoto sam, nato preveri:

:::premisli
Koliko je $S_6$ pri $a_1 = 3$ in $q = 2$?
---
$S_6 = 3 \cdot \dfrac{2^6 - 1}{2 - 1} = 3 \cdot 63 = 189$. Preizkus: $3 + 6 + 12 + 24 + 48 + 96 = 189$.
:::

## Pogoste napake

- **Korakov je $n$ namesto $n - 1$.** Učenec napačno piše $a_n = a_1 + n\,d$ ali $a_n = a_1 \cdot q^n$, ker misli, da do $n$-tega člena naredi $n$ korakov. Prvi člen pa že ima, prištevanj oziroma množenj je le $n - 1$. Preveri pri $n = 1$: prava formula mora dati $a_1$, saj je $a_1 + 0 \cdot d = a_1$ in $a_1 \cdot q^0 = a_1$.
- **Odstotek namesto količnika.** Če vrednost vsako leto pade za $20\,\%$, ostane $80\,\%$, zato je $q = 0{,}8$, ne $0{,}2$. Pri rasti za $5\,\%$ je $q = 1{,}05$. Količnik pove, kolikšen del prejšnjega člena je naslednji člen.
- **Vrsta zaporedja iz prvih dveh členov.** Iz $2, 4$ ne moreš vedeti, ali je naslednji člen $6$ (aritmetično) ali $8$ (geometrijsko). Prav tako zaporedje $1, 2, 4, 8$ ni aritmetično, čeprav je $2 - 1 = 1$. Razliko oziroma količnik preveri pri vseh danih parih.
- **Gaussova formula za geometrijsko vsoto.** Formula $S_n = \dfrac{n}{2}(a_1 + a_n)$ velja le za aritmetično zaporedje, ker so le tam vsote parov enake. Pri geometrijskem uporabi $S_n = a_1 \cdot \dfrac{q^n - 1}{q - 1}$.
- **»Geometrijsko zaporedje z velikim $|q|$ vedno narašča.«** Pri $q = -2$ členi $5, -10, 20, -40$ menjajo predznak, zato zaporedje ni monotono. Pri $a_1 > 0$ monotonost določata predznak $q$ in to, ali je $|q|$ večji ali manjši od $1$.

## Povzetek

- Aritmetično zaporedje: $a_{n+1} - a_n = d$ (diferenca).
- $a_n = a_1 + (n-1)\,d$ in $S_n = \dfrac{n}{2}(a_1 + a_n) = \dfrac{n}{2}\bigl(2a_1 + (n-1)d\bigr)$.
- Geometrijsko zaporedje: $\dfrac{a_{n+1}}{a_n} = q$ (količnik).
- $a_n = a_1 \cdot q^{\,n-1}$ in za $q \ne 1$: $S_n = a_1 \cdot \dfrac{q^n - 1}{q - 1}$; za $q = 1$: $S_n = n\,a_1$.
- Od $a_1$ do $a_n$ je $n - 1$ korakov; formulo vedno preveri pri $n = 1$.
- Vrsto zaporedja določi šele, ko preveriš razliko oziroma količnik pri vseh danih parih.
- Zaporedje po vzorcu: išči enake razlike, količnike, vzorec v razlikah ali zvezo z indeksom $n$; domnevo za $a_n$ preveri pri vseh danih členih.

## Za maturo

### Naloga 1: kratka naloga, 3 točke, pola 1 (brez računala)

Med števili $7$ in $43$ vstavi osem števil tako, da vseh deset števil v tem vrstnem redu tvori aritmetično zaporedje. Zapiši vstavljena števila in izračunaj vsoto vseh desetih števil.

**Rešitev:**

1. Prvi člen je $a_1 = 7$, deseti $a_{10} = 43$. Iz $a_{10} = a_1 + 9d$ sledi $9d = 36$ in $d = 4$.
2. Vstavljena števila so $11, 15, 19, 23, 27, 31, 35, 39$.
3. Vsota: $S_{10} = \dfrac{10}{2}\,(7 + 43) = 5 \cdot 50 = 250$.
4. Odgovor: vstavimo števila $11, 15, 19, 23, 27, 31, 35, 39$; vsota vseh desetih števil je $250$.

**Točkovanje:** 1 točka za diferenco $d = 4$, 1 točka za vstavljena števila, 1 točka za vsoto $250$.

### Naloga 2: krajša strukturirana naloga, 8 točk, pola 2 (z računalom)

Kolesarka se pripravlja na dirko. V prvem tednu priprav prevozi $120\,\text{km}$, nato vsak teden prevozi $8\,\%$ več kot v prejšnjem tednu.

a) Koliko kilometrov prevozi v šestem tednu? Rezultat zaokroži na desetinko kilometra. (2 točki)
b) Koliko kilometrov skupaj prevozi v prvih desetih tednih? Rezultat zaokroži na desetinko kilometra. (2 točki)
c) V katerem tednu prvič prevozi več kot $250\,\text{km}$? (2 točki)
d) Njen sotekmovalec v prvem tednu prav tako prevozi $120\,\text{km}$, nato pa vsak teden $12\,\text{km}$ več kot v prejšnjem tednu. Kdo v prvih desetih tednih skupaj prevozi več in za koliko? Razliko zaokroži na desetinko kilometra. (2 točki)

**Rešitev:**

1. a) Tedenske razdalje tvorijo geometrijsko zaporedje z $a_1 = 120$ in količnikom $q = 1{,}08$, ker je razdalja vsak teden za $8\,\%$ večja kot prejšnji teden.
2. a) $a_6 = 120 \cdot 1{,}08^5 = 176{,}319\ldots \approx 176{,}3$ (km).
3. b) $S_{10} = 120 \cdot \dfrac{1{,}08^{10} - 1}{1{,}08 - 1} = 1738{,}387\ldots \approx 1738{,}4$ (km).
4. c) Pogoj $120 \cdot 1{,}08^{\,n-1} > 250$ preoblikujemo v $1{,}08^{\,n-1} > \dfrac{25}{12}$ in logaritmiramo: $n - 1 > \dfrac{\log \frac{25}{12}}{\log 1{,}08} \approx 9{,}54$.
5. c) Najmanjše celo število, ki to izpolni, je $n - 1 = 10$, torej $n = 11$. Preizkus: $a_{10} = 120 \cdot 1{,}08^9 \approx 239{,}9$ in $a_{11} = 120 \cdot 1{,}08^{10} \approx 259{,}1$.
6. d) Sotekmovalčeve razdalje tvorijo aritmetično zaporedje s prvim členom $120$ in diferenco $d = 12$. V desetih tednih prevozi $\dfrac{10}{2}\,(2 \cdot 120 + 9 \cdot 12) = 5 \cdot 348 = 1740$ (km).
7. d) Razlika: $1740 - 1738{,}387\ldots \approx 1{,}6$ (km).
8. Odgovor: a) približno $176{,}3\,\text{km}$; b) približno $1738{,}4\,\text{km}$; c) v $11.$ tednu; d) več prevozi sotekmovalec, približno za $1{,}6\,\text{km}$.

**Točkovanje:** a) 1 točka za količnik $q = 1{,}08$ in zapis člena $a_6$, 1 točka za rezultat $176{,}3\,\text{km}$; b) 1 točka za pravilno vstavljeno formulo za vsoto geometrijskega zaporedja, 1 točka za rezultat $1738{,}4\,\text{km}$; c) 1 točka za neenačbo (ali za preizkus členov $a_{10}$ in $a_{11}$), 1 točka za odgovor $11.$ teden; d) 1 točka za vsoto $1740\,\text{km}$, 1 točka za sklep, da sotekmovalec prevozi približno $1{,}6\,\text{km}$ več.

### Ustno vprašanje 1

:::premisli
Kdaj je zaporedje aritmetično in kdaj geometrijsko? Zapiši splošni člen vsakega od njiju.
---
Zaporedje je aritmetično, če je razlika zaporednih členov stalna: $a_{n+1} - a_n = d$, kjer je $d$ diferenca. Njegov splošni člen je $a_n = a_1 + (n-1)\,d$. Zaporedje z neničelnimi členi je geometrijsko, če je količnik zaporednih členov stalen: $\dfrac{a_{n+1}}{a_n} = q$. Njegov splošni člen je $a_n = a_1 \cdot q^{\,n-1}$, ker od prvega do $n$-tega člena naredimo $n - 1$ korakov.
:::

### Ustno vprašanje 2

:::premisli
Izpelji formulo za vsoto prvih $n$ členov geometrijskega zaporedja s količnikom $q \ne 1$.
---
Vsoto zapišemo kot $S_n = a_1 + a_1 q + \ldots + a_1 q^{n-1}$ in jo pomnožimo s $q$, da dobimo $q S_n = a_1 q + a_1 q^2 + \ldots + a_1 q^n$. Obe vsoti imata skupne vse člene razen $a_1$ in $a_1 q^n$, zato pri odštevanju ostane $S_n - q S_n = a_1 - a_1 q^n$. Ker je $q \ne 1$, izpostavimo $S_n$ in delimo z $1 - q$. Dobimo $S_n = a_1 \cdot \dfrac{q^n - 1}{q - 1}$.
:::

### Ustno vprašanje 3

:::premisli
Navedi primer zaporedja, ki je hkrati aritmetično in geometrijsko, in pojasni, zakaj so taka le konstantna zaporedja.
---
Primer je konstantno zaporedje $5, 5, 5, \ldots$ z diferenco $d = 0$ in količnikom $q = 1$. Če so $a$, $a + d$ in $a + 2d$ zaporedni členi geometrijskega zaporedja, mora veljati pogoj $\dfrac{a + d}{a} = \dfrac{a + 2d}{a + d}$, torej enačba $(a + d)^2 = a(a + 2d)$. Po poenostavitvi ostane $d^2 = 0$, zato je $d = 0$. Vsako zaporedje, ki je hkrati aritmetično in geometrijsko, je torej konstantno z neničelnimi členi.
:::

## Drugače: Na sliki

Nariši točke $(n, a_n)$. Pri aritmetičnem zaporedju ležijo vse na eni premici: ko se pomakneš za eno mesto desno, se dvigneš za $d$. Diferenca je torej naklon te premice; pri negativnem $d$ premica pada.

Pri geometrijskem zaporedju s $q > 1$ točke ležijo na krivulji, ki se vedno strmeje dviga. Vsak korak v desno ne doda stalne višine, ampak stalni *delež*: višina se pomnoži s $q$.

Gaussovo vsoto si predstavljaj kot Tilnove stopnice iz kock: v prvem stolpcu je $a_1$ kock, v zadnjem $a_n$. Vzemi še ene enake stopnice, jih obrni na glavo in prisloni ob prve. Skupaj tvorijo pravokotnik z $n$ stolpci višine $a_1 + a_n$. Ene stopnice so polovica pravokotnika, zato je $S_n = \dfrac{n}{2}(a_1 + a_n)$.

## Drugače: Bolj natančno

Pri aritmetičnem zaporedju je vsak člen (razen prvega) **aritmetična sredina** sosedov: $a_n = \dfrac{a_{n-1} + a_{n+1}}{2}$, ker je $a_{n-1} = a_n - d$ in $a_{n+1} = a_n + d$. Pri geometrijskem zaporedju s pozitivnimi členi je vsak člen **geometrijska sredina** sosedov: $a_n = \sqrt{a_{n-1}\,a_{n+1}}$, ker je $a_{n-1}\,a_{n+1} = \dfrac{a_n}{q} \cdot a_n q = a_n^2$. Od tod imeni zaporedij.

Splošni člen $a_n = a_1 + (n-1)d = d\,n + (a_1 - d)$ je linearna funkcija spremenljivke $n$, zato točke ležijo na premici. Splošni člen $a_n = a_1 q^{\,n-1} = \dfrac{a_1}{q} \cdot q^n$ je pri $q > 0$, $q \ne 1$ eksponentna funkcija, zožena na naravna števila.

Formulo za vsoto dokažemo tudi z matematično indukcijo. Za $q \ne 1$ velja pri $n = 1$: $a_1 \frac{q - 1}{q - 1} = a_1$. Iz $S_n$ dobimo $S_{n+1} = S_n + a_1 q^n = a_1 \frac{q^n - 1 + q^{n+1} - q^n}{q - 1} = a_1 \frac{q^{n+1} - 1}{q - 1}$.

## Preveri se

? Katera trditev je pravilna?
- Zaporedje $1, 2, 4, 8$ je aritmetično, ker je $2 - 1 = 1$.
~ Razliko moraš preveriti pri vseh parih: $4 - 2 = 2$ in $8 - 4 = 4$. Zaporedje je geometrijsko s $q = 2$.
+ Splošni člen geometrijskega zaporedja je $a_n = a_1 \cdot q^{\,n-1}$.
- Geometrijsko zaporedje z $a_1 = 5$ in $q = -2$ strogo narašča, ker je $|q| > 1$.
~ Absolutne vrednosti res rastejo, sami členi pa ne: $5, -10, 20, -40$. Zaporedje je alternirajoče.
> Od $a_1$ do $a_n$ je $n - 1$ množenj s $q$; pri $n = 1$ formula da $a_1 \cdot q^0 = a_1$.

? Aritmetično zaporedje ima $a_1 = 4$ in $d = 3$. Koliko je $a_{15}$?
- $49$
~ To je $4 + 15 \cdot 3$. Korakov je le $14$, ker prvi člen že imaš.
+ $46$
- $4 \cdot 3^{14}$
~ Tako računaš pri geometrijskem zaporedju. Pri aritmetičnem diferenco prišteješ.
> $a_{15} = 4 + 14 \cdot 3 = 46$.

? Maja je vsoto $1 + 3 + 9 + 27 + 81$ izračunala takole: $\dfrac{5}{2} \cdot (1 + 81) = 205$. Kje je napaka?
- Členi so štirje, ne pet, zato bi morala pisati $\dfrac{4}{2}$.
~ Členov je pet: $1, 3, 9, 27, 81$. Število členov je pravo.
- Zadnji člen bi moral biti $3^5 = 243$.
~ Peti člen je $a_1 q^4 = 81$, ker je množenj eno manj kot členov.
+ Gaussova formula velja le za aritmetična zaporedja; to je geometrijsko, prava vsota je $121$.
> Pari $1 + 81$ in $3 + 27$ nimajo enake vsote, zato Gaussov premislek tu ne deluje. Pravilno: $S_5 = \dfrac{3^5 - 1}{3 - 1} = 121$.

? Zaporedji imata isti prvi člen $a_1 = 1$: aritmetično z $d = 10$ in geometrijsko s $q = 2$. Katero ima večjo vsoto prvih $8$ členov?
- Geometrijsko, ker geometrijska rast vedno prehiti aritmetično.
~ Prehiti šele prej ali slej. Pri $8$ členih še ne, pri $9$ pa že: $511 > 369$.
- Geometrijsko, ker je njegov osmi člen $128$ večji od $71$.
~ Večji zadnji člen še ne pomeni večje vsote. Prvi členi geometrijskega so majhni: $1, 2, 4, 8, \ldots$
+ Aritmetično: $288$ proti $255$.
> Aritmetično: $S_8 = \dfrac{8}{2} \cdot (1 + 71) = 288$. Geometrijsko: $S_8 = \dfrac{2^8 - 1}{2 - 1} = 255$.

? Vrtalnik stane $500\,\text{€}$ in vsako leto izgubi $20\,\%$ vrednosti, ki jo ima na začetku tega leta. Koliko je vreden po $3$ letih?
- $200\,\text{€}$
~ Tako računaš, če vsako leto odšteješ $100\,\text{€}$ (aritmetično). Odstotek se računa od vedno manjše vrednosti.
- $320\,\text{€}$
~ To je vrednost po $2$ letih. Ker je $a_1 = 500$ cena ob nakupu, je vrednost po $3$ letih šele $a_4 = 500 \cdot 0{,}8^3$.
+ $256\,\text{€}$
- $4\,\text{€}$
~ To je $500 \cdot 0{,}2^3$. Ostane $80\,\%$ vrednosti, zato je $q = 0{,}8$, ne $0{,}2$.
> Vrednosti tvorijo geometrijsko zaporedje s $q = 0{,}8$: po $3$ letih je vrtalnik vreden $500 \cdot 0{,}8^3 = 256\,\text{€}$.

? (brez računala) Nadaljuj zaporedje $1, 5, 11, 19, 29, \ldots$ po vzorcu. Koliko je šesti člen?
= 41
~ 39 | Razlike niso enake: $4, 6, 8, 10$. Vsaka je za $2$ večja od prejšnje, zato je naslednja $12$, ne $10$.
~ 58 | Zaporedje ni geometrijsko: $\frac{5}{1} \ne \frac{11}{5}$. Poglej razlike sosednjih členov.
> Razlike so $4, 6, 8, 10$, naslednja je $12$: $a_6 = 29 + 12 = 41$. Splošni člen je $a_n = n^2 + n - 1$.

? Kateri splošni člen ustreza zaporedju $3, 8, 15, 24, \ldots$?
- $a_n = 5n - 2$
~ Ta formula da $3$ in $8$, tretji člen pa bi bil $13$, ne $15$. Domnevo preveri pri vseh danih členih.
- $a_n = n^2 + 2$
~ Ta da $3, 6, 11, \ldots$: ujema se le prvi člen.
+ $a_n = n(n + 2)$
- $a_n = 3n$
~ Ta da $3, 6, 9, \ldots$: drugi člen ni $8$.
> $1 \cdot 3 = 3$, $2 \cdot 4 = 8$, $3 \cdot 5 = 15$, $4 \cdot 6 = 24$. Vsak člen je za $1$ manjši od kvadrata: $a_n = (n + 1)^2 - 1 = n(n + 2)$.

<<RACUN
vrednost: (43-7)/9 | 4
vrednost: 10/2*(7+43) | 250
vrednost: 7+8*4 | 39
vrednost: 120*1.08^5 | 176.3
vrednost: 120*(1.08^10-1)/(1.08-1) | 1738.4
vrednost: log(25/12)/log(1.08) | 9.54
vrednost: 120*1.08^9 | 239.9
vrednost: 120*1.08^10 | 259.1
vrednost: 10/2*(2*120+9*12) | 1740
vrednost: 1740-120*(1.08^10-1)/(1.08-1) | 1.6
enako: (a+d)^2-a*(a+2*d) | d^2
vrednost: 3^5+1 | 244
vrednost: 2^6-1 | 63
vrednost: 6*7 | 42
vrednost: 7*8 | 56
resi: n^2+n-420=0 | n | -21, 20
vrednost: 6^2+6-1 | 41
enako: (n+1)^2-1 | n*(n+2)
>>

:::simboli
a_n | splošni ($n$-ti) člen zaporedja | a_n = a_1 + (n-1)\,d | | geometrijsko: $a_n = a_1 q^{n-1}$; pri zaporedju po vzorcu ga uganemo iz danih členov
a_{n+1} | člen, ki sledi členu $a_n$ | | |
a_1 | prvi člen zaporedja | | |
d | diferenca aritmetičnega zaporedja | d = a_{n+1} - a_n | |
q | količnik geometrijskega zaporedja | q = \frac{a_{n+1}}{a_n} | | v formuli za vsoto $q \ne 1$
n | zaporedna številka člena (število členov) | | |
S_n | vsota prvih $n$ členov | S_n = \frac{n}{2}\,(a_1 + a_n) | | geometrijsko: $S_n = a_1 \frac{q^n - 1}{q - 1}$
:::
