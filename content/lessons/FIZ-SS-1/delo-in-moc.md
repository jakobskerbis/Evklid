---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Konec 18. stoletja je škotski inženir James Watt prodajal parne stroje. Mnogi kupci do takrat sploh niso imeli stroja: črpalke in mline so jim poganjali konji. Zanimalo jih je eno samo: koliko konj nadomesti ta stroj? Watt je zato opazoval konja, ki je v mlinu hodil v krogu in vlekel gred. Iz sile, s katero je vlekel, in poti, ki jo je prehodil v minuti, je določil enoto **konjska moč**. Po Wattu danes imenujemo enoto za moč: **vat**.

Isto vprašanje se pojavi pred vsakim koncertom. Tehnika Miha in Ana dvigneta na oder vsak svoj zvočnik, oba enako težka in na isto višino. Miha to naredi v $2\,\text{s}$, Ana v $4\,\text{s}$. Sta se »enako potrudila«? V nečem sta opravila natanko isto, v nečem pa je bil Miha dvakrat boljši. Ti dve stvari fizika loči z dvema pojmoma: **delo** in **moč**. Iz dela boš v naslednji temi izpeljal energijo.

## Razlaga

**1. En primer do konca.** Mihin zvočnik ima maso $20\,\text{kg}$. Dvigne ga enakomerno za $s = 1{,}5\,\text{m}$, na rob odra. Računajmo z $g = 10\,\text{m/s}^2$. Ker se zvočnik giblje enakomerno, je rezultanta sil nič: Miha ga drži s silo, enako teži, $F = m g = 200\,\text{N}$, usmerjeno navzgor.

Zdaj si zamisli dve spremembi. Dvakrat težji zvočnik na isto višino je kot dva zvočnika: sila mora opraviti dvakrat toliko dviganja. Isti zvočnik dvakrat višje je kot dvakrat po $1{,}5\,\text{m}$, spet dvakrat toliko. Kar sila opravi, torej raste sorazmerno s silo **in** sorazmerno s potjo. Zato to merimo z zmnožkom. Pozor: delo ni isto kot občutek truda (glej točko 3). **Delo** $A$ stalne sile $F$, ki kaže v smeri premika $s$, je

$$A = F \cdot s$$

Za Mihin zvočnik:

$$A = 200\,\text{N} \cdot 1{,}5\,\text{m} = 300\,\text{J}$$

Enota za delo je **joule** ($\text{J}$): $1\,\text{J} = 1\,\text{N} \cdot 1\,\text{m}$. To je delo sile $1\,\text{N}$ na poti $1\,\text{m}$. Ana je zvočnik prav tako dvignila za $1{,}5\,\text{m}$ s silo $200\,\text{N}$, zato je tudi ona opravila $300\,\text{J}$.

Delo lahko tudi narišeš. Na grafu sile v odvisnosti od poti je stalna sila vodoravna črta. Pravokotnik pod njo ima stranici $F$ in $s$, zato je njegova ploščina ravno delo.

:::risba graf
opis: Graf sile v odvisnosti od poti. Sila je stalna, {F} N, na poti od 0 do {s} m, zato je graf vodoravna črta. Pobarvan pravokotnik pod njo ima ploščino {F*s} J, kar je opravljeno delo.
x: 0 .. 3,5 | 0,5 | s [m]
y: 0 .. 450 | 50 | F [N]
drsnik: F | 100 .. 400 | 50 | 200 | sila F v newtonih
drsnik: s | 0,5 .. 3 | 0,5 | 1,5 | pot s v metrih
lik: 0; 0 -> s; 0 -> s; F -> 0; F | oranžna
črta: 0; F -> s; F | modra debelo
napis: s/2; F/2 | A | sredina
podnapis: F = {F} N, s = {s} m: delo A = F · s = {F*s} J
:::

Slika kaže Mihin zvočnik: pravokotnik $200\,\text{N} \times 1{,}5\,\text{m}$ s ploščino $300\,\text{J}$. V aplikaciji premakni drsnik sile na $400\,\text{N}$, nato vrni silo in premakni pot na $3\,\text{m}$. Opazi: obakrat se pravokotnik podvoji in delo naraste na $600\,\text{J}$.

**2. Sila pod kotom.** Ana kovček z mešalno mizo vleče po hodniku za ročaj. Ročaj kaže poševno navzgor, kovček pa se pelje vodoravno. Silo razstavimo na dve komponenti (to poznaš iz teme Sile). Vodoravna komponenta $F\cos\alpha$ kaže v smer gibanja in kovček vleče naprej. Navpična komponenta $F\sin\alpha$ le zmanjša pritisk kovčka na tla; v njeni smeri se kovček ne premakne, zato ne prispeva k delu. Pri tem je $\alpha$ kot med silo in smerjo premika.

:::risba graf
opis: Razstavljanje sile 50 N, ki kaže pod kotom {a} stopinj nad vodoravnico. Vodoravna komponenta F cos α je {50*cos(a*pi/180):.1} N, navpična F sin α je {50*sin(a*pi/180):.1} N. Kovček se giblje vodoravno v desno; vodoravna os so tla.
x: 0,5 .. 10 | 1 | 
y: -2 .. 6 | 1 | 
enako: da
oznake: ne
mreža: ne
drsnik: a | 5 .. 80 | 5 | 60 | kot alfa v stopinjah
pravokotnik: 0,6; 0 .. 2,75; 1,2 | siva
napis: 1,68; 0,6 | kovček | sredina
puščica: 6,5; -1,1 -> 9,5; -1,1 | smer gibanja | pod | siva
puščica: 2,8; 0 -> (2.8 + 5*cos(a*pi/180)); 0 | F cos α | pod | modra debelo
puščica: (2.8 + 5*cos(a*pi/180)); 0 -> (2.8 + 5*cos(a*pi/180)); (5*sin(a*pi/180)) | F sin α | nad desno | zelena črtkano
puščica: 2,8; 0 -> (2.8 + 5*cos(a*pi/180)); (5*sin(a*pi/180)) | | | oranžna debelo
napis: (2.8 + 5*cos(a*pi/180)); (5*sin(a*pi/180) + 0.3) | F = 50 N | nad levo
f: sqrt(1.44 - (x - 2.8)^2) * sqrt(x - 2.8 - 1.2*cos(a*pi/180)) / sqrt(x - 2.8 - 1.2*cos(a*pi/180)) | siva | 2,8 .. 4
napis: 2.8 + 1.7*cos(max(a, 30)*pi/360); 1.7*sin(max(a, 30)*pi/360) | α | sredina
podnapis: α = {a}°: F cos α = {50*cos(a*pi/180):.1} N, F sin α = {50*sin(a*pi/180):.1} N; na poti 8 m sila opravi delo {400*cos(a*pi/180):.0} J
:::

Delo opravi le vodoravna komponenta:

$$A = F \cdot s \cdot \cos\alpha$$

Slika kaže $\alpha = 60^\circ$: od sile $50\,\text{N}$ vleče naprej le $25\,\text{N}$, zato je na poti $8\,\text{m}$ delo $200\,\text{J}$ namesto $400\,\text{J}$. V aplikaciji premikaj drsnik kota od $5^\circ$ do $80^\circ$. Opazi: puščica $F\cos\alpha$ se krajša; pri $80^\circ$ vleče naprej le še $8{,}7\,\text{N}$ in delo pade na $69\,\text{J}$. Pri $90^\circ$ bi bilo delo nič.

Trije posebni primeri:

- $\alpha = 0^\circ$: $\cos\alpha = 1$, $A = F s$ (sila v smeri gibanja).
- $\alpha = 90^\circ$: $\cos\alpha = 0$, $A = 0$ (sila pravokotno na gibanje ne opravlja dela).
- Sila kaže ravno nasprotno gibanju (npr. trenje): $A = -F s$. Kot je tedaj $180^\circ$; formula s kosinusom da isto, ker je $\cos 180^\circ = -1$. Kosinus topih kotov boš pri matematiki spoznal pozneje.

:::premisli
Kovček vlečeš s silo $50\,\text{N}$ po isti poti enkrat pod kotom $30^\circ$, drugič pod kotom $60^\circ$ glede na tla. Kdaj opraviš več dela in zakaj?
---
Pod kotom $30^\circ$. Takrat je $\cos 30^\circ \approx 0{,}87$, pri $60^\circ$ pa le $0{,}5$: pri manjšem kotu kaže večji del sile v smer gibanja.
:::

**3. Predznak dela.** Pozitivno delo pomeni, da sila gibanje poganja. Negativno delo pomeni, da ga zavira. Če se telo ne premakne ($s = 0$), je delo nič, pa naj bo sila še tako velika. Tehnik, ki pet minut drži zvočnik nad glavo, se utrudi, delo njegove sile na zvočnik pa je nič.

:::risba skica
opis: Kovček drsi po tleh v desno za 8 m. Sila trenja 15 N kaže v levo, nasprotno premiku, zato je kot med njima 180 stopinj in delo trenja je negativno, −120 J.
območje: 0; -1,8 .. 10; 2,4
enota: 30
črta: 0; 0 -> 10; 0 | siva
pravokotnik: 4,2; 0 .. 6,2; 1,2 | siva
napis: 5,2; 0,6 | kovček | sredina
puščica: 4,2; 0,08 -> 1,4; 0,08 | F_{tr} = 15 N | nad | rdeča debelo
puščica: 4,2; -0,8 -> 9,2; -0,8 | premik s = 8 m | pod | modra
napis: 5; 1,9 | F_{tr} in s nasprotna: α = 180° | sredina
:::

Trenje kaže v levo, kovček se premika v desno. Na poti $8\,\text{m}$ opravi trenje $15\,\text{N}$ delo $A = -15\,\text{N} \cdot 8\,\text{m} = -120\,\text{J}$: gibanje kovčka zavira (kovčku odvzema energijo, več v naslednji temi).

**4. Več sil.** Kadar na telo deluje več sil, izračunamo delo vsake posebej. Skupno delo je vsota teh del, s predznaki. Ana na poti $8\,\text{m}$ vleče kovček pod kotom $60^\circ$ (druga slika): njena sila opravi $+200\,\text{J}$, trenje $-120\,\text{J}$. Skupno delo je $200\,\text{J} - 120\,\text{J} = 80\,\text{J}$.

:::premisli
Klado sunemo, da drsi po mizi, nato se zaradi trenja ustavi. Kakšen predznak ima delo sile trenja? Zakaj?
---
Negativen. Trenje kaže nasprotno smeri gibanja, zato gibanje zavira: $A = -F_\mathrm{tr}\,s$.
:::

**5. Moč.** Vrnimo se k Mihi in Ani. Oba sta opravila $300\,\text{J}$, Miha v $2\,\text{s}$, Ana v $4\,\text{s}$. Miha je vsako sekundo opravil $150\,\text{J}$, Ana le $75\,\text{J}$. **Moč** $P$ pove, koliko dela se opravi v enoti časa:

$$P = \frac{A}{t}$$

Enota za moč je **vat**: $1\,\text{W} = 1\,\text{J/s}$. Pogosto uporabljamo $1\,\text{kW} = 1000\,\text{W}$. Wattova konjska moč meri približno $746\,\text{W}$. Pri nas uporabljamo metrično konjsko moč: $1\,\text{KM} \approx 736\,\text{W}$.

:::risba graf
opis: Opravljeno delo v odvisnosti od časa za dva tehnika. Miha (črtkana črta) doseže 300 J v 2 s, nato delo ostane 300 J. Ana (polna črta) doseže 300 J v {t} s. Strmejša črta pomeni večjo moč.
x: 0 .. 5,5 | 1 | t [s]
y: 0 .. 350 | 50 | A [J]
drsnik: t | 1 .. 5 | 0,5 | 4 | Anin čas dviga v sekundah
črta: 0; 0 -> 2; 300 -> 5; 300 | modra črtkano
črta: 0; 0 -> t; 300 -> 5; 300 | oranžna debelo
napis: 2; 300 | Miha | nad
točka: t; 300 | Ana | pod desno
podnapis: Miha (črtkano): 300 J v 2 s, moč 150 W. Ana (polno): 300 J v {t} s, moč {300/t:.0} W
:::

Obe črti se končata na isti višini, $300\,\text{J}$: delo je enako. Razlikujeta se v strmini. Strmina je delo, deljeno s časom, torej moč. V aplikaciji premakni Anin čas na $2\,\text{s}$, nato na $1\,\text{s}$. Opazi: pri $2\,\text{s}$ se črti prekrijeta (enaka moč), pri $1\,\text{s}$ je Anina črta strmejša in njena moč $300\,\text{W}$.

V simulaciji spodaj (Delo in moč) nastavi maso $60\,\text{kg}$ in višino $10\,\text{m}$, nato čas najprej $20\,\text{s}$ in potem $10\,\text{s}$. Simulacija delo zapiše kot $A = m g h$: $m g$ je teža, $h$ pa pot. Opazuj: delo ostane $5886\,\text{J}$ (simulacija računa z $g = 9{,}81\,\text{m/s}^2$), moč pa se podvoji (z $294\,\text{W}$ na $589\,\text{W}$).

**6. Moč in hitrost.** Ker je $A = F s$ in $v = s/t$, velja

$$P = F \cdot v$$

To velja za silo v smeri hitrosti. Preizkus z Mihinim zvočnikom: $1{,}5\,\text{m}$ v $2\,\text{s}$ je $v = 0{,}75\,\text{m/s}$, zato $P = 200\,\text{N} \cdot 0{,}75\,\text{m/s} = 150\,\text{W}$, enako kot v točki 5. Pri stalni hitrosti je to moč ves čas gibanja. Če se hitrost spreminja (avto pospešuje), da $F v$ moč v tistem trenutku, **trenutno moč**.

**7. Delo iz moči.** Iz $P = A/t$ sledi $A = P \cdot t$. Zato električno delo merimo tudi v kilovatnih urah: $1\,\text{kWh} = 1000\,\text{W} \cdot 3600\,\text{s} = 3\,600\,000\,\text{J}$.

## Rešeni primeri

### Primer 1: kovček z bobni (lažji)

Bobnar potiska kovček z bobni po hodniku s stalno vodoravno silo $80\,\text{N}$ za $12\,\text{m}$. Koliko dela opravi?

**Podatki:** $F = 80\,\text{N}$ (vodoravna, v smeri gibanja), $s = 12\,\text{m}$
**Iščemo:** delo $A$

:::formula
$A = F \cdot s$ (sila v smeri gibanja, $\alpha = 0^\circ$)
:::

**Rešitev:**

1. Sila kaže v smer gibanja, zato je $\alpha = 0^\circ$ in velja $A = F s$.
2. Vstavimo: $A = 80\,\text{N} \cdot 12\,\text{m} = 960\,\text{J}$.
3. Smiselnost: sila poganja gibanje, zato je delo pozitivno.

**Odgovor:** bobnar opravi $960\,\text{J}$ dela.

### Primer 2: kovček z mešalno mizo

Ana vleče kovček po vodoravnih tleh s silo $50\,\text{N}$, ki je od vodoravnice nagnjena za $60^\circ$. Kovček se premakne za $8{,}0\,\text{m}$. Koliko dela opravi njena sila?

**Podatki:** $F = 50\,\text{N}$, $\alpha = 60^\circ$ (kot med silo in vodoravnico, ki je tudi smer gibanja), $s = 8{,}0\,\text{m}$
**Iščemo:** delo Anine sile $A$

:::formula
$A = F \cdot s \cdot \cos\alpha$
:::

**Rešitev:**

1. Sila ne kaže v smer gibanja, zato uporabimo $A = F s \cos\alpha$.
2. Kot med silo in premikom je $60^\circ$, zato je $\cos 60^\circ = 0{,}5$.
3. Vstavimo: $A = 50\,\text{N} \cdot 8{,}0\,\text{m} \cdot 0{,}5 = 200\,\text{J}$.
4. Smiselnost: pri vodoravnem vlečenju bi opravila $400\,\text{J}$. Del sile vleče navzgor in ne premika kovčka naprej, zato je delo manjše (druga slika v Razlagi).

**Odgovor:** Anina sila opravi $200\,\text{J}$ dela.

### Primer 3: koncertni klavir na dvižnem odru (težji)

Koncertni klavir Steinway D ima maso približno $480\,\text{kg}$. Dvižni oder ga enakomerno dvigne iz skladišča za $1{,}5\,\text{m}$ v $20\,\text{s}$. Kolikšno moč porabi oder samo za dvig klavirja (maso ploščadi in izgube zanemari)? Koliko je to konjskih moči? Računaj z $g = 9{,}81\,\text{m/s}^2$ in $1\,\text{KM} = 735{,}5\,\text{W}$.

**Podatki:** $m = 480\,\text{kg}$, $s = 1{,}5\,\text{m}$, $t = 20\,\text{s}$, $g = 9{,}81\,\text{m/s}^2$, $1\,\text{KM} = 735{,}5\,\text{W}$, dviganje je enakomerno
**Iščemo:** moč $P$ v vatih in v konjskih močeh

:::formula
Pri enakomernem dviganju je $F = m g$; delo $A = F \cdot s$, moč $P = \dfrac{A}{t}$
:::

**Rešitev:**

1. **Sila.** Klavir se giblje enakomerno, zato je rezultanta nič in sila odra je enaka teži: $F = m g = 480\,\text{kg} \cdot 9{,}81\,\text{m/s}^2 = 4708{,}8\,\text{N} \approx 4710\,\text{N}$. Masa je znana le približno, na dve mesti, zato vmesne rezultate zaokrožimo na tri mesta, odgovor pa na dve.
2. **Delo.** Sila in premik kažeta navzgor: $A = F s = 4708{,}8\,\text{N} \cdot 1{,}5\,\text{m} \approx 7060\,\text{J}$ (v kalkulatorju računaj z nezaokroženo silo). Toliko energije dobi klavir z dvigom (natančneje sistem klavir–Zemlja); v naslednji temi jo boš zapisal kot $m g h$.
3. **Moč.** Delo delimo s časom: $P \approx 7060\,\text{J} / 20\,\text{s} \approx 353\,\text{W} \approx 350\,\text{W}$.
4. **V konjskih močeh.** $353\,\text{W} / 735{,}5\,\text{W} \approx 0{,}48$, torej skoraj pol konjske moči.
5. **Preverimo s $P = F v$.** Hitrost je $v = 1{,}5\,\text{m} / 20\,\text{s} = 0{,}075\,\text{m/s}$, zato $P \approx 4710\,\text{N} \cdot 0{,}075\,\text{m/s} \approx 353\,\text{W}$. ✓

**Odgovor:** za dvig klavirja oder porabi približno $350\,\text{W}$, to je skoraj pol konjske moči. Watt bi rekel: moč pol konja.

### Primer 4: zdaj ti (obratna naloga)

Vitel z močjo $300\,\text{W}$ enakomerno dviga nosilec z reflektorji z maso $120\,\text{kg}$ za $6{,}0\,\text{m}$. S kolikšno hitrostjo ga dviga in koliko časa traja dvig? Vzemi $g = 10\,\text{m/s}^2$.

**Podatki:** $P = 300\,\text{W}$, $m = 120\,\text{kg}$, $s = 6{,}0\,\text{m}$, $g = 10\,\text{m/s}^2$, dviganje je enakomerno
**Iščemo:** hitrost $v$ in čas $t$

:::formula
Pri stalni hitrosti je $F = m g$; $P = F \cdot v$, zato $v = \dfrac{P}{F}$; $t = \dfrac{s}{v}$
:::

**Rešitev:**

1. Hitrost je stalna, zato je rezultanta nič in sila vitla enaka teži: $F = 120\,\text{kg} \cdot 10\,\text{m/s}^2 = 1200\,\text{N}$.
2. Obrnemo $P = F v$, ker poznamo moč in silo, iščemo pa hitrost: $v = P/F$.
3. Izračunaj sam $v$ in nato čas $t = s/v$ (hitrost je stalna, zato pot preprosto delimo s hitrostjo). Preveri:

:::premisli
Koliko sta $v$ in $t$?
---
$v = 300\,\text{W} / 1200\,\text{N} = 0{,}25\,\text{m/s}$ in $t = 6{,}0\,\text{m} / 0{,}25\,\text{m/s} = 24\,\text{s}$. Preverba: $A = F s = 1200\,\text{N} \cdot 6{,}0\,\text{m} = 7200\,\text{J}$ in $P t = 300\,\text{W} \cdot 24\,\text{s} = 7200\,\text{J}$.
:::

## Pogoste napake

- **Masa namesto sile.** »Delo je $20\,\text{kg} \cdot 1{,}5\,\text{m} = 30$.« Kilogram ni sila. Pri dviganju vstavi težo $F = m g$, rezultat je v joulih.
- **Sila brez poti.** »Držal sem zvočnik, zato sem opravil delo.« Utrujenost ni delo: brez premika je $s = 0$ in $A = 0$.
- **Napačen kot.** Kot $\alpha$ je kot med silo in smerjo *premika*, ne kot med silo in navpičnico in ne naklonski kot klanca. Najprej nariši skico. Kalkulator naj bo v stopinjah, sicer dobiš npr. $\cos 40 \approx -0{,}67$.
- **Pozabljen predznak.** »Trenje $20\,\text{N}$ na poti $5\,\text{m}$ opravi $100\,\text{J}$.« Trenje in zračni upor kažeta nasproti premiku, zato opravljata negativno delo: $-100\,\text{J}$.
- **Zamenjava dela in moči.** »Hitrejši opravi več dela« je narobe: hitrejši ima pri enakem delu večjo moč. Pazi tudi pri obratu formule: $P = A/t$, ne $P = A \cdot t$.

## Povzetek

- Delo stalne sile v smeri gibanja: $A = F s$; pod kotom: $A = F s \cos\alpha$. Enota $1\,\text{J} = 1\,\text{N}\,\text{m}$.
- Delo je ploščina pod grafom sile v odvisnosti od poti.
- Sila, pravokotna na gibanje, ne opravlja dela; sila, ki gibanju nasprotuje, opravlja negativno delo. Brez premika ni dela.
- Moč je delo na enoto časa: $P = A/t$, enota $1\,\text{W} = 1\,\text{J/s}$; $1\,\text{KM} \approx 736\,\text{W}$.
- Pri stalni hitrosti in sili v smeri gibanja: $P = F v$. Iz moči dobimo delo: $A = P t$.

## Drugače: Z analogijo

Delo je kot količina vode, ki jo natočiš v sod. Moč je kot pretok pipe: koliko litrov na sekundo. Isti sod lahko napolniš z močnim curkom v pol minute ali s tankim v petih minutah. Vode je na koncu enako, pretok pa je bil različen. Tako sta Miha in Ana »natočila« enako dela, $300\,\text{J}$, Miha pa z dvakrat večjim »pretokom«, $150\,\text{J}$ vsako sekundo.

Kosinus si predstavljaj kot senco. Silo posveti od zgoraj, pravokotno na tla. Senca puščice na tleh je del sile, ki vleče v smer gibanja. Navpična sila nima sence na tleh, zato ne opravi dela.

## Drugače: Bolj natančno

**Zakaj kosinus?** Silo $\vec F$ razstavimo na komponento vzdolž premika $F_\parallel = F\cos\alpha$ in komponento pravokotno nanj $F_\perp = F\sin\alpha$. V smeri $F_\perp$ ni premika, zato ta komponenta dela ne opravi. Delo je torej $A = F_\parallel s = F s\cos\alpha$. Matematično je to skalarni produkt sile in premika, $A = \vec F \cdot \vec s$ (spoznal ga boš pozneje pri matematiki).

**Iz definicije do $P = Fv$.** Vstavimo $A = F s$ v $P = A/t$:

$$P = \frac{F s}{t} = F \cdot \frac{s}{t} = F v$$

pri čemer je $v = s/t$ hitrost enakomernega gibanja.

**Spremenljiva sila.** Če sila na poti ni stalna, je delo ploščina pod grafom $F_\parallel(s)$, ne več pravokotnik. Pri sili, ki enakomerno narašča od $0$ do $F_0$ na poti $s$, je to trikotnik, zato je $A = \tfrac{1}{2} F_0 s$.

**Povprečna in trenutna moč.** $P = A/t$ je povprečna moč v času $t$. Če se moč spreminja, trenutno moč dobimo, ko vzamemo zelo kratek čas.

## Preveri se

? Tri izmed štirih sil ne opravijo nobenega dela. Katera sila delo **opravi**?
- Sila tal odra, ki podpirajo klavir, medtem ko ga tehniki potisnejo čez oder.
~ Tla podpirajo klavir navpično navzgor, premik je vodoraven: $\alpha = 90^\circ$, zato je delo nič.
- Teža kitare, ki jo kitarist nese vodoravno čez oder.
~ Teža kaže navpično navzdol, premik je vodoraven: $\alpha = 90^\circ$, $\cos 90^\circ = 0$, zato je delo nič.
- Sila tehnika, ki potiska klavir, a se ta ne premakne.
~ Sila je lahko velika, a brez premika ni dela.
+ Sila tehnika, ki dvigne mikrofonsko stojalo na oder.
> Le pri dviganju stojala sta sila in premik v isti smeri ($\alpha = 0^\circ$), zato je $A = F s > 0$. Pri drugih treh premika ni ali pa je sila pravokotna nanj.

? Tehnik potisne kovček s kabli $5\,\text{m}$ po odru. Sila trenja na kovček je $20\,\text{N}$. Koliko dela opravi sila trenja?
= -100 J | 1
~ 100 | Pozabil si predznak. Trenje kaže nasproti premiku, zato je delo negativno.
~ 0 | Trenje ni pravokotno na premik, temveč mu nasprotuje, zato opravi delo.
> Sila trenja kaže nasproti premiku: $A = -F_\mathrm{tr}\,s = -20\,\text{N} \cdot 5\,\text{m} = -100\,\text{J}$.

? Tehnik potiska kovček vodoravno s silo $70\,\text{N}$ za $6\,\text{m}$. Trenje na kovček je $25\,\text{N}$. Koliko je skupno delo obeh sil?
= 270 J | 1
~ 570 | Delo trenja si prištel. Trenje kaže nasproti premiku, zato je njegovo delo negativno: $-150\,\text{J}$.
~ 420 | To je le delo tehnikove sile. Skupno delo je vsota del vseh sil.
~ -150 | To je le delo trenja.
> Tehnik: $70\,\text{N} \cdot 6\,\text{m} = 420\,\text{J}$. Trenje: $-25\,\text{N} \cdot 6\,\text{m} = -150\,\text{J}$. Skupaj $420\,\text{J} - 150\,\text{J} = 270\,\text{J}$.

? Tehnik vleče kovček s silo $60\,\text{N}$ pod kotom $40^\circ$ glede na vodoravna tla. Kovček se premakne za $10\,\text{m}$. Koliko dela opravi njegova sila? (Na celo število.)
= 460 J | 2
~ 600 | To bi veljalo za vodoravno silo. Pozabil si na $\cos 40^\circ$.
~ 386 | Uporabil si $\sin 40^\circ$. Smer gibanja je vodoravna, zato šteje $F\cos\alpha$.
~ -400 | Kalkulator je bil v radianih. Preklopi na stopinje: $\cos 40^\circ \approx 0{,}77$.
> $A = F s \cos\alpha = 60\,\text{N} \cdot 10\,\text{m} \cdot \cos 40^\circ \approx 460\,\text{J}$.

? Tehnik dvigne zvočnik na oder enkrat v $4\,\text{s}$, drugič enak zvočnik na isti oder v $2\,\text{s}$. Kaj velja za drugi dvig?
+ Delo ostane enako, moč se podvoji.
- Delo in moč se podvojita.
~ Sila in pot sta enaki, zato je delo enako. Čas vpliva le na moč.
- Delo ostane enako, moč se razpolovi.
~ Pri krajšem času je $P = A/t$ večja, ne manjša.
- Delo se podvoji, moč ostane enaka.
~ Hitrejši ne opravi več dela. Delo je odvisno od sile in poti, ne od časa.
> $A = F s$ je neodvisno od časa. Pri polovičnem času je $P = A/t$ dvakrat večja.

? Maja računa moč, ki jo dvižni oder porabi za dvig klavirja: oder enakomerno dvigne klavir z maso $500\,\text{kg}$ za $1{,}5\,\text{m}$ v $30\,\text{s}$ ($g = 10\,\text{m/s}^2$). Njen račun: 1. korak $F = m g = 5000\,\text{N}$; 2. korak $A = F s = 7500\,\text{J}$; 3. korak $P = A \cdot t = 225\,000\,\text{W}$. Kateri korak je napačen?
- 1. korak
~ Pri enakomernem dviganju je sila enaka teži $m g$, ne masi. $5000\,\text{N}$ je prav.
- 2. korak
~ Sila in premik kažeta navpično navzgor, $\alpha = 0^\circ$, zato je $A = F s$ prav.
+ 3. korak
- Noben, vse je prav.
~ $225\,\text{kW}$ je nesmiselno veliko za dvižni oder. Preveri formulo: moč je delo, deljeno s časom.
> Moč je $P = A/t = 7500\,\text{J} / 30\,\text{s} = 250\,\text{W}$. Zmnožek moči in časa je delo, ne moč.

? Graf kaže, kako raste delo dveh vitlov s časom med dviganjem enakega bremena. Z grafa odčitaj moč vitla K.
:::risba graf
opis: Graf dela v odvisnosti od časa za dva vitla. Polna črta K gre od izhodišča do točke 4 s in 6000 J. Črtkana črta L gre od izhodišča do točke 8 s in 6000 J.
x: 0 .. 9 | 1 | t [s]
y: 0 .. 7000 | 1000 | A [J]
črta: 0; 0 -> 4; 6000 | modra debelo
črta: 0; 0 -> 8; 6000 | oranžna črtkano
točka: 4; 6000 | K | nad
točka: 8; 6000 | L | nad
:::
= 1500 W | 10
~ 6000 | To je delo, ne moč. Delo moraš deliti s časom.
~ 750 | To je moč vitla L. Vitel K doseže $6000\,\text{J}$ že v $4\,\text{s}$.
~ 24000 | Delo si pomnožil s časom. Moč je $A/t$.
> Vitel K opravi $6000\,\text{J}$ v $4\,\text{s}$: $P = 6000\,\text{J} / 4\,\text{s} = 1500\,\text{W}$. Strmejša črta pomeni večjo moč.

? Vitel z močjo $1{,}2\,\text{kW}$ enakomerno dviga omaro z ozvočenjem z maso $300\,\text{kg}$. S kolikšno hitrostjo jo dviga? Vzemi $g = 10\,\text{m/s}^2$.
= 0,4 m/s | 0,01
~ 4 | Moč si delil z maso. Deliti moraš s silo, ki je enaka teži $m g = 3000\,\text{N}$.
~ 2,5 | Formulo si obrnil: $v = P/F$, ne $F/P$.
~ 0,0004 | Kilovatov nisi pretvoril v vate: $1{,}2\,\text{kW} = 1200\,\text{W}$.
> Pri stalni hitrosti je $F = m g = 3000\,\text{N}$. Iz $P = F v$ sledi $v = P/F = 1200\,\text{W} / 3000\,\text{N} = 0{,}4\,\text{m/s}$.

? Razvrsti korake reševanja naloge, v kateri iščeš moč sile, ki vleče telo pod kotom.
1. Nariši skico s silo in smerjo premika.
2. S skice določi kot $\alpha$ med silo in premikom.
3. Izračunaj delo $A = F s \cos\alpha$.
4. Delo deli s časom v sekundah: $P = A/t$.
5. Preveri predznak in enoto rezultata (W).
> Brez skice ne poznaš kota, brez kota ne dela, brez dela ne moči. Na koncu preveriš, ali je rezultat smiseln.

<<RACUN
vrednost: 200*1.5 | 300
vrednost: 300/2 | 150
vrednost: 300/4 | 75
vrednost: 50*8*cos(60°) | 200
vrednost: 80*12 | 960
vrednost: 480*9.81 | 4708.8
vrednost: 4708.8*1.5 | 7063.2
vrednost: 480*9.81*1.5/20 | 353.16
vrednost: 353/735.5 | 0.48
vrednost: 4708.8*0.075 | 353.16
vrednost: 200*0.75 | 150
vrednost: 70*6-25*6 | 270
vrednost: 300/1200 | 0.25
vrednost: 6/0.25 | 24
vrednost: -15*8 | -120
vrednost: 200-120 | 80
vrednost: -20*5 | -100
vrednost: 1200/(300*10) | 0.4
vrednost: 1200*0.25 | 300
vrednost: 300*24 | 7200
vrednost: 600*cos(40*pi/180) | 459.63
vrednost: 6000/4 | 1500
vrednost: 7500/30 | 250
enote: 1*kW*h | 3600000*J
>>

:::simboli
A | delo | A = F \cdot s \cdot \cos\alpha | J | sila v smeri gibanja: $A = F s$
F | sila | | N | pri enakomernem dviganju $F = m g$
s | pot (premik) | | m
\alpha | kot med silo in smerjo premika | | ^\circ
P | moč | P = \frac{A}{t} | W | pri stalni hitrosti $P = F v$
t | čas | | s
v | hitrost | v = \frac{s}{t} | m/s
m | masa | | kg
g | težni pospešek | | m/s^2 | $9{,}81$ ali približno $10\,\mathrm{m/s^2}$
F_\parallel | komponenta sile v smeri premika | F_\parallel = F\cos\alpha | N
F_\perp | komponenta sile pravokotno na premik | F_\perp = F\sin\alpha | N
F_\mathrm{tr} | sila trenja | | N
F_0 | končna sila pri enakomerno naraščajoči sili | | N
:::
