---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Aplikacija za opazovanje neba v telefonu pokaže, da je Sonce ob petih popoldne $25^\circ$ nad obzorjem. Visok si $1{,}75\,\text{m}$. Kako dolga je tvoja senca na ravnem igrišču? Ti, tvoja senca in sončni žarek mimo temena tvorite pravokotni trikotnik. Poznaš eno kateto in en ostri kot. Pitagorov izrek tu ne pomaga, saj v njem kotov sploh ni.

Pri podobnosti si spoznal, da sta trikotnika z dvema enakima kotoma podobna. Vsi pravokotni trikotniki z ostrim kotom $25^\circ$ so torej podobni in imajo enaka razmerja ustreznih stranic. Razmerje dveh stranic je odvisno **samo od kota**. Tem razmerjem rečemo **kotne funkcije**: sinus, kosinus in tangens. Že Galileo Galilei je leta 1610 z geometrijo pravokotnega trikotnika ocenil, kako visoke so gore na Luni. Danes kotne funkcije uporabljajo astronomi, geodeti, gradbeniki in piloti. Preden bereš naprej, oceni: bo tvoja senca daljša ali krajša od tebe? Izračunamo jo v razdelku 2.

## Razlaga

**1. Oznake.** Pravokotni trikotnik $ABC$ ima pravi kot pri oglišču $C$, torej $\gamma = 90^\circ$. Hipotenuza je $c$, kateti sta $a$ (nasproti kota $\alpha$) in $b$ (nasproti kota $\beta$). Ostra kota sta komplementarna: $\alpha + \beta = 90^\circ$.

Glede na ostri kot $\alpha$ imata kateti posebni imeni:

- **nasprotna kateta** kota $\alpha$ leži nasproti kota, to je $a$,
- **priležna kateta** kota $\alpha$ je kateta, ki je krak kota (drugi krak je hipotenuza), to je $b$.

Za kot $\beta$ se vlogi zamenjata: zanj je $b$ nasprotna, $a$ pa priležna kateta. Hipotenuza ni nikoli kateta.

*Preizkus:* katera kateta je priležna kotu $\beta$? (Kateta $a$, ker je krak kota $\beta$.)

**2. Definicije.** Za ostri kot $\alpha$ v pravokotnem trikotniku definiramo:

$$\sin \alpha = \frac{\text{nasprotna kateta}}{\text{hipotenuza}} = \frac{a}{c}$$

$$\cos \alpha = \frac{\text{priležna kateta}}{\text{hipotenuza}} = \frac{b}{c}$$

$$\tan \alpha = \frac{\text{nasprotna kateta}}{\text{priležna kateta}} = \frac{a}{b}$$

Za kot $\beta$ velja $\sin \beta = \dfrac{b}{c}$, $\cos \beta = \dfrac{a}{c}$, $\tan \beta = \dfrac{b}{a}$. Tangens ponekod pišejo tudi $\operatorname{tg} \alpha$. Obratna vrednost tangensa je **kotangens**, $\cot \alpha = \dfrac{b}{a}$.

Senca iz uvoda: sončni žarek oklepa s tlemi kot $25^\circ$ ob konici sence. Tvoja višina je nasprotna kateta tega kota, senca $s$ pa priležna kateta. Zato je $\tan 25^\circ = \dfrac{1{,}75\,\text{m}}{s}$ in $s = \dfrac{1{,}75\,\text{m}}{\tan 25^\circ} \approx 3{,}75\,\text{m}$.

V simulaciji spodaj (»Kotne funkcije v pravokotnem trikotniku«) nastavi kot $\alpha$ na $35^\circ$ in spreminjaj hipotenuzo $c$. Opazuj: stranice se večajo in manjšajo, vrednosti $\sin \alpha$, $\cos \alpha$ in $\tan \alpha$ pa ostanejo enake.

*Preizkus:* trikotnik ima $a = 3$, $b = 4$, $c = 5$. Koliko je $\cos \alpha$? ($\dfrac{4}{5}$.)

**3. Vrednosti sinusa in kosinusa so med $0$ in $1$.** Kateta je vedno krajša od hipotenuze, zato za ostri kot velja $0 < \sin \alpha < 1$ in $0 < \cos \alpha < 1$. Tangens je lahko poljubno pozitivno število: pri $45^\circ$ sta kateti enaki in je $\tan 45^\circ = 1$, pri kotih blizu $90^\circ$ je tangens zelo velik. Ko se kot veča, sinus in tangens rasteta, kosinus pa pada.

:::premisli
Ali je za kak ostri kot lahko $\sin \alpha = 1{,}2$? Kaj pa $\tan \alpha = 1{,}2$? Razloži s stranicami trikotnika in napovej, ali je tak kot manjši ali večji od $45^\circ$.
---
Sinus ne, ker bi bila kateta daljša od hipotenuze. Tangens pa lahko: nasprotna kateta je lahko daljša od priležne. To se zgodi pri kotih nad $45^\circ$, za $\tan \alpha = 1{,}2$ je $\alpha \approx 50{,}19^\circ$.
:::

**4. Zveze med kotnimi funkcijami istega kota.** Iz definicij in Pitagorovega izreka $a^2 + b^2 = c^2$ sledi:

$$\sin^2 \alpha + \cos^2 \alpha = 1, \qquad \tan \alpha = \frac{\sin \alpha}{\cos \alpha}$$

Zapis $\sin^2 \alpha$ pomeni $(\sin \alpha)^2$. Prvo zvezo dobimo tako, da Pitagorov izrek delimo s $c^2$: $\left(\dfrac{a}{c}\right)^2 + \left(\dfrac{b}{c}\right)^2 = 1$. Drugo dobimo, ko $\dfrac{a}{c}$ delimo z $\dfrac{b}{c}$.

*Preizkus:* ali sta lahko $\sin \alpha$ in $\cos \alpha$ hkrati enaka $0{,}5$? (Ne, ker je $0{,}25 + 0{,}25 = 0{,}5$ in ne $1$.)

**5. Komplementarna kota.** Nasprotna kateta kota $\alpha$ je priležna kateta kota $\beta = 90^\circ - \alpha$. Zato velja

$$\sin \alpha = \cos (90^\circ - \alpha), \qquad \cos \alpha = \sin (90^\circ - \alpha)$$

Na primer $\sin 30^\circ = \cos 60^\circ$.

:::premisli
Brez računala napovej: kateri je večji, $\sin 20^\circ$ ali $\cos 70^\circ$? Odgovor razloži s skico enega samega trikotnika, ne s formulo.
---
Enaka sta. Kota $20^\circ$ in $70^\circ$ sta ostra kota istega pravokotnega trikotnika, saj je $20^\circ + 70^\circ = 90^\circ$. Kateta nasproti kota $20^\circ$ je priležna kotu $70^\circ$, hipotenuza pa je ista.
:::

**6. Posebne vrednosti.** Za kote $30^\circ$, $45^\circ$ in $60^\circ$ poznamo natančne vrednosti (izpeljava je v razdelku »Drugače: Korak za korakom s številkami«):

| $\alpha$ | $30^\circ$ | $45^\circ$ | $60^\circ$ |
|---|---|---|---|
| $\sin \alpha$ | $\frac{1}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{3}}{2}$ |
| $\cos \alpha$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{1}{2}$ |
| $\tan \alpha$ | $\frac{\sqrt{3}}{3}$ | $1$ | $\sqrt{3}$ |

*Preizkus:* koliko je $\tan 30^\circ \cdot \tan 60^\circ$? ($\dfrac{\sqrt{3}}{3} \cdot \sqrt{3} = 1$.)

**7. Računalo.** Za druge kote vrednosti izračunamo z računalom, ki mora biti nastavljeno na **stopinje** (način DEG). Če poznamo vrednost kotne funkcije in iščemo kot, uporabimo tipko $\sin^{-1}$, $\cos^{-1}$ ali $\tan^{-1}$ (pogosto s tipko SHIFT). Na primer iz $\sin \alpha = 0{,}5$ dobimo $\alpha = 30^\circ$. Kote zapisujemo v stopinjah in minutah: $1^\circ = 60'$, zato je $22{,}62^\circ \approx 22^\circ 37'$.

*Preizkus:* koliko je $40{,}5^\circ$ v stopinjah in minutah? ($40^\circ 30'$, ker je pol stopinje $30'$.)

**8. Reševanje pravokotnega trikotnika.** Poleg pravega kota je trikotnik določen, če poznamo dve stranici ali eno stranico in en ostri kot. Postopek:

- skiciraj trikotnik in označi dane količine,
- za iskano količino izberi kotno funkcijo, ki povezuje **dano** količino in **iskano** količino,
- izrazi neznanko in izračunaj; drugi ostri kot dobiš iz $\beta = 90^\circ - \alpha$, tretjo stranico tudi s Pitagorovim izrekom.

*Preizkus:* dana sta $c$ in $\alpha$, iščeš $b$. Katero funkcijo izbereš? (Kosinus, ker povezuje priležno kateto in hipotenuzo.)

## Rešeni primeri

### Primer 1 (lažji)

Pravokotni trikotnik ima kateti $a = 5\,\text{cm}$ in $b = 12\,\text{cm}$. Izračunaj hipotenuzo, vrednosti $\sin \alpha$, $\cos \alpha$ in $\tan \alpha$ ter kot $\alpha$ na stotinko stopinje natančno.

**Podatki:** $a = 5\,\text{cm}$, $b = 12\,\text{cm}$, $\gamma = 90^\circ$; kot zaokrožimo na stotinko stopinje
**Iščemo:** hipotenuzo $c$, $\sin \alpha$, $\cos \alpha$, $\tan \alpha$ in kot $\alpha$

:::formula
$c^2 = a^2 + b^2$; $\;\sin \alpha = \dfrac{a}{c}$, $\;\cos \alpha = \dfrac{b}{c}$, $\;\tan \alpha = \dfrac{a}{b}$
:::

**Rešitev:**

1. Hipotenuza: $c = \sqrt{5^2 + 12^2}\,\text{cm} = \sqrt{169}\,\text{cm} = 13\,\text{cm}$.
2. $\sin \alpha = \dfrac{5}{13} \approx 0{,}3846$, $\;\cos \alpha = \dfrac{12}{13} \approx 0{,}9231$, $\;\tan \alpha = \dfrac{5}{12} \approx 0{,}4167$.
3. Kot izračunamo iz tangensa, ker vsebuje dani količini: $\alpha = \tan^{-1} \dfrac{5}{12} \approx 22{,}62^\circ$.
4. Preverjanje: $\sin^2 \alpha + \cos^2 \alpha = \dfrac{25}{169} + \dfrac{144}{169} = 1$. ✓
5. Odgovor: hipotenuza meri $13\,\text{cm}$, $\sin \alpha = \dfrac{5}{13}$, $\cos \alpha = \dfrac{12}{13}$, $\tan \alpha = \dfrac{5}{12}$ in $\alpha \approx 22{,}62^\circ$ (približno $22^\circ 37'$).

### Primer 2 (srednji)

V pravokotnem trikotniku je hipotenuza $c = 8\,\text{cm}$, ostri kot pa $\alpha = 35^\circ$. Izračunaj kateti, drugi ostri kot in ploščino. Dolžini zaokroži na stotinko centimetra.

**Podatki:** $c = 8\,\text{cm}$, $\alpha = 35^\circ$, $\gamma = 90^\circ$; zaokrožimo na stotinke
**Iščemo:** kateti $a$ in $b$, kot $\beta$ in ploščino $S$

:::formula
$a = c \cdot \sin \alpha$, $\;b = c \cdot \cos \alpha$, $\;\beta = 90^\circ - \alpha$, $\;S = \dfrac{a \cdot b}{2}$
:::

**Rešitev:**

1. Kateta $a$ je nasprotna kotu $\alpha$, dana je hipotenuza, zato uporabimo sinus: $\sin \alpha = \dfrac{a}{c}$, torej $a = c \sin \alpha = 8\,\text{cm} \cdot \sin 35^\circ \approx 8\,\text{cm} \cdot 0{,}5736 \approx 4{,}59\,\text{cm}$.
2. Kateta $b$ je priležna, zato kosinus: $b = c \cos \alpha = 8\,\text{cm} \cdot \cos 35^\circ \approx 8\,\text{cm} \cdot 0{,}8192 \approx 6{,}55\,\text{cm}$.
3. Drugi ostri kot: $\beta = 90^\circ - 35^\circ = 55^\circ$.
4. Ploščina (računamo z nezaokroženima katetama): $S = \dfrac{a \cdot b}{2} \approx \dfrac{4{,}5886 \cdot 6{,}5532}{2}\,\text{cm}^2 \approx 15{,}04\,\text{cm}^2$.
5. Preverjanje s Pitagorovim izrekom: $4{,}5886^2 + 6{,}5532^2 \approx 21{,}06 + 42{,}94 = 64 = 8^2$. ✓
6. Odgovor: kateti merita približno $4{,}59\,\text{cm}$ in $6{,}55\,\text{cm}$, drugi ostri kot je $55^\circ$, ploščina pa je približno $15{,}04\,\text{cm}^2$.

### Primer 3 (težji)

Z ravnega terena opazujemo vrh navpičnega stolpa pod kotom $30^\circ$ glede na vodoravnico. Ko se stolpu po ravnem približamo za $20\,\text{m}$, vidimo vrh pod kotom $45^\circ$. Kako visok je stolp? Višino oči zanemari, rezultat zapiši natančno in na centimeter natančno.

**Podatki:** prvi kot $\alpha_1 = 30^\circ$, drugi kot $\alpha_2 = 45^\circ$, premik $20\,\text{m}$ proti stolpu, teren je raven, višino oči zanemarimo; rezultat natančno in na centimeter natančno
**Iščemo:** višino stolpa $h$

:::formula
$\tan \alpha = \dfrac{\text{nasprotna kateta}}{\text{priležna kateta}}$; $\;\tan 45^\circ = 1$, $\;\tan 30^\circ = \dfrac{\sqrt{3}}{3} = \dfrac{1}{\sqrt{3}}$
:::

**Rešitev:**

1. Naj bo $d$ razdalja od bližjega opazovališča do vznožja stolpa. Daljše opazovališče je od vznožja oddaljeno $d + 20\,\text{m}$. Nastaneta dva pravokotna trikotnika s skupno kateto $h$.
2. Iz bližjega mesta: $\tan 45^\circ = \dfrac{h}{d}$, torej $h = d$.
3. Iz daljšega mesta: $\tan 30^\circ = \dfrac{h}{d + 20}$, torej $h = \dfrac{d + 20}{\sqrt{3}}$.
4. Vstavimo $d = h$ in pomnožimo s $\sqrt{3}$: $\sqrt{3}\,h = h + 20$, torej $h(\sqrt{3} - 1) = 20$ in $h = \dfrac{20}{\sqrt{3} - 1}\,\text{m}$.
5. Racionaliziramo imenovalec: $h = \dfrac{20(\sqrt{3} + 1)}{3 - 1}\,\text{m} = 10(\sqrt{3} + 1)\,\text{m} \approx 27{,}32\,\text{m}$.
6. Preverjanje: daljše opazovališče je od vznožja oddaljeno $47{,}32\,\text{m}$; $\;47{,}32 \cdot \tan 30^\circ \approx 47{,}32 \cdot 0{,}5774 \approx 27{,}32$. ✓
7. Odgovor: stolp je visok $10(\sqrt{3} + 1)\,\text{m}$, to je približno $27{,}32\,\text{m}$.

### Primer 4 – zdaj ti: gora na Luni

Na posnetku Lune se na ravnem dnu kraterja vidi senca osamljene gore. Konica sence je $15\,\text{km}$ vodoravno oddaljena od točke tik pod vrhom. Sonce je tam $6^\circ$ nad obzorjem. Kako visoka je gora? Rezultat zaokroži na stotinko kilometra.

**Podatki:** dolžina sence $s = 15\,\text{km}$, višina Sonca nad obzorjem $\alpha = 6^\circ$, tla so ravna; rezultat na stotinko kilometra
**Iščemo:** višino gore $h$

:::formula
$\tan \alpha = \dfrac{h}{s}$, torej $h = s \cdot \tan \alpha$
:::

**Rešitev:**

1. Sončni žarek gre mimo vrha do konice sence. Višina gore, senca in žarek tvorijo pravokotni trikotnik s pravim kotom pod vrhom.
2. Kot $\alpha$ je ob konici sence. Višina $h$ mu leži nasproti, senca $s$ je priležna kateta, zato izberemo tangens.
3. Izračunaj sam, nato preveri:

:::premisli
Koliko je $h = 15\,\text{km} \cdot \tan 6^\circ$?
---
$\tan 6^\circ \approx 0{,}1051$, zato je $h \approx 15\,\text{km} \cdot 0{,}1051 \approx 1{,}58\,\text{km}$. Ker je Sonce nizko, je senca približno desetkrat daljša od višine gore.
:::

## Pogoste napake

- **Zamenjana nasprotna in priležna kateta.** Ime katete je odvisno od kota, ki ga opazuješ. Za kot $\alpha$ je $a$ nasprotna, za kot $\beta$ pa priležna. Pravilno: najprej v skici označi kot, nato poišči kateto, ki **leži nasproti** kota, in kateto, ki je **krak** kota.
- **Računalo v radianih.** Če dobiš $\sin 30^\circ \approx -0{,}988$, je računalo nastavljeno na radiane (RAD). Nastavi ga na stopinje (DEG) in preveri: $\sin 30^\circ = 0{,}5$.
- **$\sin^{-1}$ ni obratna vrednost.** Tipka $\sin^{-1}$ iz vrednosti vrne **kot**, ne pa $\dfrac{1}{\sin \alpha}$. Iz $\sin \alpha = 0{,}5$ dobiš $\alpha = 30^\circ$, medtem ko je $\dfrac{1}{\sin 30^\circ} = 2$.
- **Deljenje namesto množenja.** Iz $\sin \alpha = \dfrac{a}{c}$ sledi $a = c \cdot \sin \alpha$, ne $a = \dfrac{c}{\sin \alpha}$. Preveri smiselnost: kateta mora biti krajša od hipotenuze, pri $c = 8\,\text{cm}$ in $\alpha = 35^\circ$ bi napačna formula dala $13{,}95\,\text{cm}$.
- **Definicije v trikotniku, ki ni pravokoten.** Razmerja $\dfrac{a}{c}$ in $\dfrac{b}{c}$ veljajo le v pravokotnem trikotniku, kjer je $c$ hipotenuza. V drugih trikotnikih najprej poišči ali nariši višino, ki razdeli lik na pravokotne trikotnike.

## Povzetek

- Pravokotni trikotnik: $\gamma = 90^\circ$, hipotenuza $c$, kateti $a$ in $b$, $\alpha + \beta = 90^\circ$.
- $\sin \alpha = \dfrac{a}{c}$ (nasprotna/hipotenuza), $\cos \alpha = \dfrac{b}{c}$ (priležna/hipotenuza), $\tan \alpha = \dfrac{a}{b}$ (nasprotna/priležna).
- $\sin^2 \alpha + \cos^2 \alpha = 1$, $\;\tan \alpha = \dfrac{\sin \alpha}{\cos \alpha}$, $\;\sin \alpha = \cos (90^\circ - \alpha)$.
- Posebne vrednosti: $\sin 30^\circ = \cos 60^\circ = \dfrac{1}{2}$, $\sin 45^\circ = \cos 45^\circ = \dfrac{\sqrt{2}}{2}$, $\tan 45^\circ = 1$, $\tan 60^\circ = \sqrt{3}$.
- Za ostri kot je $0 < \sin \alpha, \cos \alpha < 1$, $\tan \alpha > 0$.
- Iz stranice in kota: $a = c \sin \alpha$, $b = c \cos \alpha$, $a = b \tan \alpha$; kot iz razmerja s $\sin^{-1}$, $\cos^{-1}$, $\tan^{-1}$ (računalo v stopinjah).

## Drugače: Na sliki

Nariši pravokotni trikotnik, katerega hipotenuza meri natanko $1$ (na primer $1\,\text{dm}$). Ostri kot $\alpha$ naj bo v levem spodnjem oglišču, priležna kateta naj leži vodoravno, nasprotna pa navpično. Ker je $c = 1$, velja $\sin \alpha = \dfrac{a}{1} = a$ in $\cos \alpha = b$. Sinus je torej kar **višina** trikotnika, kosinus pa njegova **dolžina** po tleh.

Zdaj si predstavljaj, da hipotenuzo vrtiš okoli levega oglišča kot kazalec. Ko se kot $\alpha$ veča, se višina (sinus) veča, dolžina po tleh (kosinus) pa manjša. Pri $45^\circ$ sta enaki, pri kotu blizu $90^\circ$ je trikotnik skoraj navpična črta: sinus je skoraj $1$, kosinus skoraj $0$. Tangens si predstavljaj kot strmino hipotenuze: za koliko se dvigne, ko gre za $1$ v vodoravni smeri. V interaktivni simulaciji spodaj spreminjaj kot in opazuj, kako se dolžine stranic in vrednosti kotnih funkcij spreminjajo skupaj.

## Drugače: Korak za korakom s številkami

**Od kod vrednosti za $45^\circ$.**

1. Vzemi kvadrat s stranico $1$ in nariši diagonalo. Nastane enakokraki pravokotni trikotnik s kotoma $45^\circ$.
2. Kateti merita $1$, hipotenuza po Pitagorovem izreku $\sqrt{1 + 1} = \sqrt{2}$.
3. $\sin 45^\circ = \dfrac{1}{\sqrt{2}} = \dfrac{\sqrt{2}}{2} \approx 0{,}7071$, enako $\cos 45^\circ$, $\tan 45^\circ = \dfrac{1}{1} = 1$.

**Od kod vrednosti za $30^\circ$ in $60^\circ$.**

1. Vzemi enakostranični trikotnik s stranico $2$. Vsi njegovi koti merijo $60^\circ$.
2. Nariši višino na osnovnico. Razdeli trikotnik na dva pravokotna trikotnika s koti $30^\circ$, $60^\circ$ in $90^\circ$.
3. V vsakem je hipotenuza $2$, krajša kateta (polovica osnovnice) $1$, višina pa $\sqrt{4 - 1} = \sqrt{3}$.
4. Krajša kateta leži nasproti kota $30^\circ$: $\sin 30^\circ = \dfrac{1}{2}$, $\cos 30^\circ = \dfrac{\sqrt{3}}{2} \approx 0{,}8660$, $\tan 30^\circ = \dfrac{1}{\sqrt{3}} = \dfrac{\sqrt{3}}{3} \approx 0{,}5774$.
5. Za kot $60^\circ$ se kateti zamenjata: $\sin 60^\circ = \dfrac{\sqrt{3}}{2}$, $\cos 60^\circ = \dfrac{1}{2}$, $\tan 60^\circ = \sqrt{3} \approx 1{,}7321$.

## Drugače: Bolj natančno

**Zakaj so kotne funkcije sploh funkcije kota.** Naj imata pravokotna trikotnika $ABC$ in $A'B'C'$ enak ostri kot $\alpha$. Ker se ujemata še v pravem kotu, sta po izreku KK podobna, zato je $\dfrac{a'}{a} = \dfrac{c'}{c} = k$. Sledi $\dfrac{a'}{c'} = \dfrac{k a}{k c} = \dfrac{a}{c}$. Razmerje torej ni odvisno od velikosti trikotnika, ampak le od kota, in vsakemu ostremu kotu priredi natanko eno število. Brez podobnosti definicija ne bi bila smiselna.

**Iz ene vrednosti vse ostale.** Če za ostri kot poznamo eno kotno funkcijo, druge izračunamo brez računanja kota. Iz $\sin \alpha = \dfrac{3}{5}$ sledi $\cos \alpha = \sqrt{1 - \dfrac{9}{25}} = \dfrac{4}{5}$ (pozitivni koren, ker je kot oster) in $\tan \alpha = \dfrac{3/5}{4/5} = \dfrac{3}{4}$. Iz zvez sledi še $1 + \tan^2 \alpha = \dfrac{1}{\cos^2 \alpha}$: prvo zvezo delimo s $\cos^2 \alpha$.

**Monotonost.** Pri stalni hipotenuzi se z večanjem kota $\alpha$ nasprotna kateta veča, priležna manjša. Zato na intervalu $(0^\circ, 90^\circ)$ sinus in tangens naraščata, kosinus pa pada. Zaradi tega iz vrednosti kotne funkcije ostri kot določimo enolično.

## Preveri se

? Katera trojica vrednosti ($\sin$, $\cos$, $\tan$ v tem vrstnem redu) spada h kotu $60^\circ$?
- $\dfrac{1}{2}$, $\dfrac{\sqrt{3}}{2}$, $\dfrac{\sqrt{3}}{3}$
~ To so vrednosti za $30^\circ$. Pri $60^\circ$ je nasprotna kateta daljša od priležne, zato je sinus večji od kosinusa.
+ $\dfrac{\sqrt{3}}{2}$, $\dfrac{1}{2}$, $\sqrt{3}$
- $\dfrac{\sqrt{3}}{2}$, $\dfrac{1}{2}$, $\dfrac{\sqrt{3}}{3}$
~ Sinus in kosinus sta prava, tangens pa je obrnjen. Velja $\tan 60^\circ = \dfrac{\sin 60^\circ}{\cos 60^\circ}$, ne obratno.
- $\dfrac{\sqrt{2}}{2}$, $\dfrac{\sqrt{2}}{2}$, $1$
~ To so vrednosti za $45^\circ$, kjer sta kateti enaki.
> Pri $60^\circ$ je $\sin 60^\circ = \dfrac{\sqrt{3}}{2}$, $\cos 60^\circ = \dfrac{1}{2}$ in $\tan 60^\circ = \sqrt{3}$.

? Brez računala oceni $\sin 40^\circ$.
- manj kot $0{,}5$
~ Velja $\sin 30^\circ = 0{,}5$, sinus pa z večanjem ostrega kota raste, zato je $\sin 40^\circ$ večji.
+ med $0{,}5$ in $0{,}71$
- med $0{,}71$ in $0{,}87$
~ Ta interval spada h kotom med $45^\circ$ in $60^\circ$. Kot $40^\circ$ je manjši od $45^\circ$.
- več kot $1$
~ Sinus ostrega kota je vedno manjši od $1$, ker je kateta krajša od hipotenuze.
> Sinus ostrega kota raste: $\sin 30^\circ = 0{,}5$ in $\sin 45^\circ \approx 0{,}71$, vmes je $\sin 40^\circ$. Računalo da $\sin 40^\circ \approx 0{,}643$.

? Zakaj ima $\sin 25^\circ$ v vsakem pravokotnem trikotniku s kotom $25^\circ$ isto vrednost, ne glede na velikost trikotnika?
- Ker imajo vsi pravokotni trikotniki enako dolgo hipotenuzo.
~ Hipotenuza je lahko poljubno dolga. Spremenita se obe stranici, njuno razmerje pa ne.
+ Ker so vsi taki trikotniki podobni (izrek KK), zato imajo enaka razmerja ustreznih stranic.
- Ker po Pitagorovem izreku velja $a^2 + b^2 = c^2$.
~ Pitagorov izrek velja v vsakem pravokotnem trikotniku, o kotih pa ne pove ničesar.
- Ker je sinus vedno manjši od $1$.
~ To drži, a ne pojasni, zakaj je vrednost pri istem kotu vedno ista.
> Trikotnika se ujemata v pravem kotu in v kotu $25^\circ$, zato sta podobna. Vse stranice se pomnožijo z istim $k$, razmerje $\dfrac{a}{c}$ pa ostane enako.

? Navpična palica, visoka $1{,}5\,\text{m}$, meče na ravnih tleh senco, dolgo $2{,}6\,\text{m}$. Kako visoko nad obzorjem je Sonce?
- približno $60^\circ$
~ Zamenjal si kateti. Palica je nasprotna kateta kota ob konici sence, senca je priležna, zato $\tan \alpha = \dfrac{1{,}5}{2{,}6}$.
+ približno $30^\circ$
- približno $0{,}52^\circ$
~ Računalo je bilo nastavljeno na radiane (RAD). V stopinjah (DEG) dobiš približno $30^\circ$.
- približno $1{,}73^\circ$
~ Tipka $\tan^{-1}$ ne pomeni $\dfrac{1}{\tan}$. Obratna vrednost razmerja, $\dfrac{2{,}6}{1{,}5} \approx 1{,}73$, ni kot.
> $\tan \alpha = \dfrac{1{,}5\,\text{m}}{2{,}6\,\text{m}} \approx 0{,}577$, zato je $\alpha = \tan^{-1} 0{,}577 \approx 30^\circ$ (natančneje $29{,}98^\circ$).

? Lestev, dolga $5\,\text{m}$, je naslonjena na steno in s tlemi oklepa kot $70^\circ$. Kako visoko seže?
- približno $1{,}71\,\text{m}$
~ To je $5\,\text{m} \cdot \cos 70^\circ$, razdalja vznožja od stene. Višina je nasprotna kateta kota ob tleh, zato sinus.
+ približno $4{,}70\,\text{m}$
- približno $5{,}32\,\text{m}$
~ Delil si, $\dfrac{5\,\text{m}}{\sin 70^\circ}$. Iz $\sin 70^\circ = \dfrac{h}{5\,\text{m}}$ sledi $h = 5\,\text{m} \cdot \sin 70^\circ$. Višina ne more biti večja od lestve.
- približno $13{,}74\,\text{m}$
~ To je $5\,\text{m} \cdot \tan 70^\circ$. Tangens povezuje kateti, lestev pa je hipotenuza.
> Lestev je hipotenuza, višina je nasprotna kateta kota ob tleh: $h = 5\,\text{m} \cdot \sin 70^\circ \approx 4{,}70\,\text{m}$.

:::simboli
\alpha | ostri kot pravokotnega trikotnika (v primeru 4 višina Sonca nad obzorjem) | | °
\beta | drugi ostri kot | \beta = 90^\circ - \alpha | °
\gamma | pravi kot | \gamma = 90^\circ | °
a | kateta nasproti kota $\alpha$ | a = c \cdot \sin \alpha | cm
b | priležna kateta kota $\alpha$ | b = c \cdot \cos \alpha | cm
c | hipotenuza | c^2 = a^2 + b^2 | cm
S | ploščina trikotnika | S = \frac{a \cdot b}{2} | cm^2
h | višina (v primeru 3 stolpa, v primeru 4 gore) | h = s \cdot \tan \alpha | m | v primeru 4 v km
s | dolžina sence | | m | v primeru 4 v km
:::
