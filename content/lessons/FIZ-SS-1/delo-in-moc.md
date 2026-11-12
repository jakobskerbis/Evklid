---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Iz osnovne šole že poznaš pojma sila (merimo jo v newtonih, $\text{N}$) in pot (merimo jo v metrih, $\text{m}$). Veš tudi, da se pri vsakdanjih opravilih utrudimo: ko nosimo težko torbo po stopnicah, ko porivamo avto ali ko vlečemo voziček.

Fiziki so želeli ta »trud« izraziti s številom. Tako so uvedli **delo**. Z njim lahko primerjamo, koliko napora zahtevata dve različni opravili, in izračunamo, koliko energije je treba dovesti stroju. Ko pa nas zanima, kako **hitro** se delo opravi, uporabimo **moč**. Zato imajo avtomobili, dvigala in žarnice na napisni tablici podano moč.

Delo je tudi uvod v naslednjo temo: delo sile spremeni energijo telesa.

## Razlaga

**1. Delo sile na premem delu poti.** Če na telo deluje stalna sila $F$ v smeri gibanja in se telo premakne za pot $s$, je opravljeno delo

$$A = F \cdot s$$

Enota za delo je **joule**:

$$1\,\text{J} = 1\,\text{N} \cdot 1\,\text{m}$$

Delo $1\,\text{J}$ opravimo, če telo premaknemo za $1\,\text{m}$ s silo $1\,\text{N}$ v smeri gibanja.

**2. Sila pod kotom.** Če sila s smerjo gibanja oklepa kot $\alpha$, k delu prispeva samo njena komponenta v smeri gibanja:

$$A = F \cdot s \cdot \cos\alpha$$

Posebni primeri:

- $\alpha = 0^\circ$: $\cos\alpha = 1$, $A = F s$ (sila v smeri gibanja).
- $\alpha = 90^\circ$: $\cos\alpha = 0$, $A = 0$ (sila pravokotno na gibanje ne opravlja dela).
- $\alpha = 180^\circ$: $\cos\alpha = -1$, $A = -F s$ (sila nasprotuje gibanju, npr. trenje).

:::premisli
Kovček vlečeš s silo $50\,\text{N}$ po isti poti enkrat pod kotom $30^\circ$, drugič pod kotom $60^\circ$ glede na tla. Kdaj opraviš več dela in zakaj?
---
Pod kotom $30^\circ$. Takrat je $\cos 30^\circ \approx 0{,}87$, pri $60^\circ$ pa le $0{,}5$: pri manjšem kotu kaže večji del sile v smer gibanja.
:::

**3. Predznak dela.** Pozitivno delo pomeni, da sila telo »poganja«. Negativno delo pomeni, da sila gibanje zavira. Če telo miruje ali se ne premakne ($s = 0$), je delo enako nič, ne glede na to, kako velika je sila.

**4. Več sil.** Če deluje več sil, lahko izračunamo delo vsake posebej. Skupno delo je njihova vsota (z upoštevanjem predznakov).

:::premisli
Klado sunemo, da drsi po mizi, nato se zaradi trenja ustavi. Kakšen predznak ima delo sile trenja? Zakaj?
---
Negativen. Trenje kaže nasprotno smeri gibanja ($\alpha = 180^\circ$, $\cos\alpha = -1$), zato gibanje zavira.
:::

**5. Moč.** Moč pove, koliko dela se opravi v enoti časa:

$$P = \frac{A}{t}$$

Enota za moč je **vat**:

$$1\,\text{W} = \frac{1\,\text{J}}{1\,\text{s}}$$

Pogosto se uporablja tudi $1\,\text{kW} = 1000\,\text{W}$.

V simulaciji spodaj (Delo in moč) nastavi maso $60\,\text{kg}$ in višino $10\,\text{m}$, nato čas najprej $20\,\text{s}$ in potem $10\,\text{s}$. Opazuj: delo ostane $5886\,\text{J}$ (simulacija računa z $g = 9{,}81\,\text{m/s}^2$), moč pa se podvoji (z $294\,\text{W}$ na $589\,\text{W}$), ker se isto delo opravi v pol krajšem času.

**6. Moč pri stalni hitrosti.** Ker je $A = F s$ in $v = s/t$, velja

$$P = F \cdot v$$

(sila v smeri hitrosti, stalna hitrost).

**7. Delo iz moči.** Iz $P = A/t$ sledi $A = P \cdot t$. Zato se električna energija meri tudi v kilovatnih urah: $1\,\text{kWh} = 1000\,\text{W} \cdot 3600\,\text{s} = 3\,600\,000\,\text{J}$.

## Rešeni primeri

### Primer 1: vlečenje vozička (lažji)

Voziček vlečemo s stalno vodoravno silo $40\,\text{N}$ po vodoravni poti $15\,\text{m}$. Koliko dela opravimo?

**Podatki:** $F = 40\,\text{N}$ (vodoravna, v smeri gibanja), $s = 15\,\text{m}$
**Iščemo:** delo $A$

:::formula
$A = F \cdot s$ (sila v smeri gibanja, $\alpha = 0^\circ$)
:::

**Rešitev:**

1. Sila je v smeri gibanja, zato je $\alpha = 0^\circ$ in $A = F s$.
2. Vstavimo: $A = 40\,\text{N} \cdot 15\,\text{m} = 600\,\text{J}$.
3. Smiselnost: sila deluje v smeri gibanja, zato je delo pozitivno.

**Odgovor:** opravimo $600\,\text{J}$ dela.

### Primer 2: sila pod kotom

Kovček vlečemo po vodoravnih tleh s silo $50\,\text{N}$, ki je od vodoravnice nagnjena za $60^\circ$. Kovček se premakne za $8{,}0\,\text{m}$. Koliko dela opravi naša sila?

**Podatki:** $F = 50\,\text{N}$, $\alpha = 60^\circ$ (kot med silo in vodoravnico, torej smerjo gibanja), $s = 8{,}0\,\text{m}$
**Iščemo:** delo naše sile $A$

:::formula
$A = F \cdot s \cdot \cos\alpha$
:::

**Rešitev:**

1. Sila ni v smeri gibanja, zato uporabimo $A = F s \cos\alpha$.
2. Kot med silo in smerjo gibanja je $\alpha = 60^\circ$, $\cos 60^\circ = 0{,}5$.
3. Vstavimo: $A = 50\,\text{N} \cdot 8{,}0\,\text{m} \cdot 0{,}5 = 200\,\text{J}$.
4. Smiselnost: če bi vlekli vodoravno, bi opravili $400\,\text{J}$. Ker del sile vleče navzgor in ne prispeva k premikanju, je delo manjše.

**Odgovor:** naša sila opravi $200\,\text{J}$ dela.

### Primer 3: dviganje bremena in moč (težji)

Dvigalo enakomerno dvigne tovor z maso $200\,\text{kg}$ za $12\,\text{m}$ v $8{,}0\,\text{s}$. Vzemi $g = 10\,\text{m/s}^2$. Koliko dela opravi dvigalo in kolikšna je njegova moč?

**Podatki:** $m = 200\,\text{kg}$, $s = 12\,\text{m}$ (višina dviga), $t = 8{,}0\,\text{s}$, $g = 10\,\text{m/s}^2$, dviganje je enakomerno
**Iščemo:** delo dvigala $A$ in njegovo moč $P$

:::formula
Pri enakomernem dviganju je $F = m g$; delo $A = F \cdot s$, moč $P = \dfrac{A}{t}$ (preverimo s $P = F \cdot v$)
:::

**Rešitev:**

1. **Sila dvigala.** Tovor se giblje enakomerno, zato je rezultanta sil nič. Sila dvigala je enaka teži: $F = m g = 200\,\text{kg} \cdot 10\,\text{m/s}^2 = 2000\,\text{N}$.
2. **Delo.** Sila je v smeri gibanja (navzgor): $A = F s = 2000\,\text{N} \cdot 12\,\text{m} = 24\,000\,\text{J}$.
3. **Moč.** $P = \dfrac{A}{t} = \dfrac{24\,000\,\text{J}}{8{,}0\,\text{s}} = 3000\,\text{W} = 3{,}0\,\text{kW}$.
4. **Preverimo z drugo formulo.** Hitrost je $v = 12\,\text{m} / 8{,}0\,\text{s} = 1{,}5\,\text{m/s}$, torej $P = F v = 2000\,\text{N} \cdot 1{,}5\,\text{m/s} = 3000\,\text{W}$. ✓
5. **Delo teže** je enako $-24\,000\,\text{J}$, ker teža kaže navzdol, tovor pa se giblje navzgor. Skupno delo obeh sil je $0$, kar se ujema z enakomernim gibanjem.

**Odgovor:** dvigalo opravi $24\,\text{kJ}$ dela, njegova moč je $3{,}0\,\text{kW}$.

### Primer 4: zdaj ti

Kolesar vozi po vodoravni cesti s stalno hitrostjo $5{,}0\,\text{m/s}$. Zračni upor in trenje skupaj nanj delujeta s silo $40\,\text{N}$. Kolikšno moč razvija kolesar in koliko dela opravi v $10\,\text{min}$?

**Podatki:** $v = 5{,}0\,\text{m/s}$ (stalna), $F_\text{upor} = 40\,\text{N}$, $t = 10\,\text{min}$
**Iščemo:** moč $P$ in delo $A$

:::formula
Pri stalni hitrosti je pogonska sila $F = F_\text{upor}$; $P = F \cdot v$, $A = P \cdot t$
:::

**Rešitev:**

1. Hitrost je stalna, zato je rezultanta nič in pogonska sila je enaka uporu: $F = 40\,\text{N}$.
2. Pogonska sila kaže v smeri hitrosti, zato velja $P = F v$. Čas pretvorimo v sekunde, ker je vat joule na sekundo: $t = 600\,\text{s}$.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko sta $P = 40\,\text{N} \cdot 5{,}0\,\text{m/s}$ in $A = P \cdot 600\,\text{s}$?
---
$P = 200\,\text{W}$ in $A = 200\,\text{W} \cdot 600\,\text{s} = 120\,000\,\text{J} = 120\,\text{kJ}$.
:::

## Pogoste napake

- **Sila brez poti.** Če se telo ne premakne, je delo nič. Držanje težkega predmeta na mestu v fizikalnem smislu ni delo, čeprav se utrudimo.
- **Napačen kot.** Kot $\alpha$ je kot med silo in smerjo *gibanja*, ne med silo in navpičnico ali podlago, razen če se to ujema. Preden vstaviš, nariši skico.
- **Pozabljen predznak.** Trenje in zračni upor običajno opravljata negativno delo. Če dobiš pozitivno delo trenja, si se zmotil.
- **Zamenjava dela in moči.** »Hitrejši opravi več dela« ali »delo v vatih« je narobe. Joule je enota za delo, vat za moč. Moč je delo na časovno enoto, zato pri enakem delu večja moč pomeni krajši čas.
- **Enote.** Pred računom pretvori vse v osnovne enote (m, s, kg, N). Npr. $2\,\text{kW} = 2000\,\text{W}$, $5\,\text{min} = 300\,\text{s}$.

## Povzetek

- Delo stalne sile v smeri gibanja: $A = F s$. Pod kotom: $A = F s \cos\alpha$. Enota: $1\,\text{J} = 1\,\text{N}\,\text{m}$.
- Sila, pravokotna na gibanje, ne opravlja dela. Sila, ki gibanju nasprotuje, opravlja negativno delo.
- Moč je delo na enoto časa: $P = A/t$, enota $1\,\text{W} = 1\,\text{J/s}$.
- Pri stalni hitrosti in sili v smeri gibanja velja $P = F v$.
- Opravljeno delo lahko izračunamo iz moči: $A = P t$.

## Drugače: Na sliki

Predstavljaj si škatlo, ki jo vlečeš po tleh z vrvjo. Silo $F$ narišeš kot puščico pod kotom $\alpha$ glede na tla. To puščico razstaviš na dve komponenti:

- vodoravno komponento $F\cos\alpha$, ki škatlo premika naprej,
- navpično komponento $F\sin\alpha$, ki škatlo rahlo razbremenjuje in ne prispeva k premikanju po tleh.

Delo opravi samo vodoravna komponenta: $A = (F\cos\alpha)\cdot s$. Večji kot je kot $\alpha$, krajša je vodoravna komponenta in manj dela opraviš z enako silo.

Še ena slika: graf sile v odvisnosti od poti ($F$ proti $s$). Pri stalni sili je graf vodoravna črta, delo $A = F s$ pa je **ploščina pravokotnika** pod njo. Ta ideja velja splošneje: delo je ploščina pod grafom $F(s)$.

## Drugače: Iz vsakdanjega življenja

Dva učenca neseta vsak svojo vrečo z maso $20\,\text{kg}$ na isto polico, $3\,\text{m}$ visoko. Delo je pri obeh enako, saj sta dvignila enako težo za enako višino. Prvi je to opravil v $5\,\text{s}$, drugi v $20\,\text{s}$. Prvi je imel štirikrat večjo moč, ker je isto delo opravil v štirikrat krajšem času.

Podobno pri avtomobilih: motor z večjo močjo lahko isto delo (npr. pospešitev do določene hitrosti) opravi hitreje. Zato se avtomobili z močnejšim motorjem hitreje pospešijo.

Za žarnice velja isto: žarnica z močjo $60\,\text{W}$ vsako sekundo porabi $60\,\text{J}$ električne energije, žarnica z $10\,\text{W}$ pa samo $10\,\text{J}$.

Računi za elektriko so v kilovatnih urah. Če grelnik z močjo $2\,\text{kW}$ deluje $3\,\text{h}$, porabi $2\,\text{kW} \cdot 3\,\text{h} = 6\,\text{kWh}$.

## Drugače: Korak za korakom s številkami

Recept za naloge z delom in močjo:

1. Nariši skico in označi silo ter smer gibanja.
2. Ugotovi kot $\alpha$ med silo in smerjo gibanja.
3. Vse podatke pretvori v osnovne enote.
4. Izračunaj delo: $A = F s \cos\alpha$.
5. Če je podan čas, izračunaj moč: $P = A/t$.
6. Preveri enote in predznak.

**Številčni primer.** Sila $30\,\text{N}$ pod kotom $0^\circ$ premakne telo za $4{,}0\,\text{m}$ v $2{,}0\,\text{s}$.

| Korak | Račun | Rezultat |
|---|---|---|
| Kot | $\cos 0^\circ$ | $1$ |
| Delo | $30 \cdot 4{,}0 \cdot 1$ | $120\,\text{J}$ |
| Moč | $120 / 2{,}0$ | $60\,\text{W}$ |
| Hitrost | $4{,}0 / 2{,}0$ | $2{,}0\,\text{m/s}$ |
| Preverjanje $P = F v$ | $30 \cdot 2{,}0$ | $60\,\text{W}$ ✓ |

## Drugače: Bolj natančno

**Iz definicije dela do $P = Fv$.** Delo stalne sile je $A = F s$. Moč je $P = A/t$. Vstavimo delo:

$$P = \frac{F s}{t} = F \cdot \frac{s}{t} = F v$$

pri čemer smo uporabili $v = s/t$ za enakomerno gibanje.

**Zakaj kosinus?** Silo $\vec F$ razstavimo na komponento vzdolž gibanja $F_\parallel = F\cos\alpha$ in komponento pravokotno nanj $F_\perp = F\sin\alpha$. Komponenta $F_\perp$ ne povzroča premika v smeri poti, zato ne prispeva k delu. Delo je torej $A = F_\parallel s = F s\cos\alpha$. V matematičnem zapisu je to skalarni produkt vektorja sile in vektorja premika: $A = \vec F \cdot \vec s$.

**Spremenljiva sila.** Če sila na poti ni stalna, delo ni preprost produkt. Takrat je delo enako ploščini pod grafom $F_\parallel(s)$. Pri sili, ki enakomerno narašča od $0$ do $F_0$ na poti $s$, je graf trikotnik, zato je $A = \tfrac{1}{2} F_0 s$.

**Povprečna in trenutna moč.** Formula $P = A/t$ daje povprečno moč v času $t$. Če se moč spreminja, je trenutna moč določena na zelo kratkem časovnem intervalu.

## Preveri se

? Fant porine omaro s stalno vodoravno silo $120\,\text{N}$ po tleh za $5{,}0\,\text{m}$ v smeri sile. Koliko dela opravi?
- $24\,\text{J}$
~ To je $120 : 5{,}0$. Delo je zmnožek sile in poti, ne količnik.
- $125\,\text{J}$
~ To je $120 + 5{,}0$. Sile in poti ne seštevamo, ker sta različni količini; delo je njun zmnožek.
+ $600\,\text{J}$
- $600\,\text{W}$
~ Število je pravo, enota pa ne: vat je enota za moč, delo merimo v joulih.
> Sila je v smeri gibanja, zato je $A = F s = 120\,\text{N} \cdot 5{,}0\,\text{m} = 600\,\text{J}$.

? Nosač nosi težak nahrbtnik vodoravno po ravni poti z enakomerno hitrostjo. Teža nahrbtnika kaže navpično navzdol. Koliko dela opravi teža nahrbtnika?
- Pozitivno delo, ker je nahrbtnik težak.
~ Velikost sile ni dovolj. Šteje le komponenta sile v smeri gibanja, ta pa je pri navpični teži in vodoravnem premiku enaka nič.
- Negativno delo, ker teža nasprotuje gibanju.
~ Teža kaže navzdol, gibanje je vodoravno. Teža gibanju ne nasprotuje, ker ni usmerjena nazaj ($\alpha = 90^\circ$, ne $180^\circ$).
+ Nič, ker je teža pravokotna na smer gibanja.
> Kot med težo (navpično navzdol) in premikom (vodoravno) je $90^\circ$, $\cos 90^\circ = 0$, zato je delo teže enako $0$.

? Stroj opravi $1800\,\text{J}$ dela v $30\,\text{s}$. Kolikšna je njegova moč?
- $54\,000\,\text{W}$
~ To je $1800 \cdot 30$. Zmnožek moči in časa je delo ($A = P t$); moč dobimo z deljenjem dela s časom.
- $0{,}017\,\text{W}$
~ To je $30 : 1800$, obrnjeno deljenje. Moč je delo, deljeno s časom, ne čas, deljen z delom.
+ $60\,\text{W}$
- $1770\,\text{W}$
~ To je $1800 - 30$. Joulov in sekund ne odštevamo; moč je količnik dela in časa.
> Moč je delo na enoto časa: $P = A/t = 1800\,\text{J} / 30\,\text{s} = 60\,\text{W}$.

? Kaj je kot $\alpha$ v enačbi $A = F s \cos\alpha$?
+ Kot med silo in smerjo gibanja telesa.
- Kot med silo in navpičnico.
~ Šteje kot glede na smer gibanja. Navpičnica je smer gibanja le pri dviganju ali spuščanju.
- Kot nagiba podlage (klanca) glede na vodoravnico.
~ Naklon klanca je drug kot. V enačbo gre kot med puščico sile in puščico premika.
> Delo opravi le komponenta sile v smeri gibanja, $F\cos\alpha$, zato je $\alpha$ kot med silo in smerjo gibanja.

? Dve enaki dvigali dvigneta enak tovor na isto višino. Prvo potrebuje $10\,\text{s}$, drugo $20\,\text{s}$. Kaj drži?
- Prvo opravi dvakrat več dela, ker je hitrejše.
~ Delo je odvisno od sile in poti, ki sta pri obeh enaki. Hitrost vpliva na moč, ne na delo.
- Drugo ima večjo moč, ker dela dlje časa.
~ Moč je delo, deljeno s časom: pri enakem delu daljši čas pomeni manjšo moč.
+ Delo je enako, moč prvega je dvakrat večja.
- Delo in moč sta pri obeh enaka.
~ Delo je res enako, moč pa ne: prvo opravi isto delo v pol krajšem času.
> Pri enaki sili in enaki poti je delo enako. Ker prvo dvigalo to delo opravi v pol krajšem času, je njegova moč $P = A/t$ dvakrat večja.

:::simboli
A | delo | A = F \cdot s \cdot \cos\alpha | J | sila v smeri gibanja: A = F · s
F | sila | | N | pri enakomernem dviganju F = m g
s | pot | | m
\alpha | kot med silo in smerjo gibanja | | ^\circ
P | moč | P = \dfrac{A}{t} | W | pri stalni hitrosti P = F · v
t | čas | | s
v | hitrost | | m/s
m | masa | | kg
g | težni pospešek | | m/s^2 | približno 10 m/s²
F_{\text{upor}} | sila upora | | N | pri stalni hitrosti enaka pogonski sili
:::
