---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Lekarna dobi cepiva v škatli iz stiroporja z ledenimi vložki. Na škatli piše, da cepivo ostane pod $8\,^\circ\mathrm{C}$ približno $24$ ur. Druga, na videz enaka škatla z dvakrat debelejšimi stenami zdrži skoraj $48$ ur. Iz termodinamike znaš izračunati, *koliko* toplote potrebuje led, da se stali ($Q = m\,q_t$), ne pa, *kako hitro* ta toplota pride skozi steno. Prvi zakon ničesar ne pove o času. Za čas potrebujemo zakon, ki toplotni tok poveže z debelino stene, snovjo in temperaturno razliko. To je **Fourierov zakon prevoda toplote**. Z njim projektiramo hladilne verige za zdravila in kri, izolacijo parnih cevi za avtoklave, stene inkubatorjev in liofilizatorjev, pa tudi razumemo, zakaj podkožna maščoba telo varuje pred mrazom.

## Razlaga

### Kaj pokažejo meritve

Toplotno prevodnost izolacijskih plošč merijo z napravo z zaščiteno vročo ploščo: ploščo vzorca stisnejo med toplo in hladno kovinsko ploščo in merijo električno moč grelnika, ki je v stacionarnem stanju enaka toplotnemu toku skozi vzorec. Štiri meritve na isti vrsti ekspandiranega polistirena s ploščino $0{,}25\,\mathrm{m^2}$ (debelina $d$ v mm, temperaturna razlika $\Delta T$ v K, toplotni tok $\Phi$ v W):

| $d$ | $\Delta T$ | $\Phi$ |
|---|---|---|
| $20$ | $10$ | $4{,}38$ |
| $20$ | $20$ | $8{,}75$ |
| $40$ | $20$ | $4{,}38$ |
| $40$ | $40$ | $8{,}75$ |

Iz prvih dveh vrstic: dvakratna temperaturna razlika da dvakratni tok. Iz druge in tretje: dvakratna debelina da polovičen tok. Četrta vrstica oboje potrdi: tok je odvisen le od razmerja $\Delta T/d$. Ponovitev z dvakrat večjo ploščo da dvakrat večji tok. Vse meritve torej opiše ena sama snovna konstanta $\lambda$:

$$\Phi = \lambda A \frac{\Delta T}{d}.$$

Iz prve vrstice je $\lambda = \Phi d/(A\,\Delta T) = 4{,}375 \cdot 0{,}020/(0{,}25 \cdot 10) = 0{,}035\,\mathrm{W/(m\,K)}$.

### Pojmi

**Definicija.** **Toplotni tok** $\Phi = \mathrm{d}Q/\mathrm{d}t$ je toplota, ki v enoti časa preide skozi ploskev; enota je $\mathrm{W}$. **Gostota toplotnega toka** $q = \Phi/A$ je toplotni tok skozi enoto ploščine, pravokotne na smer toka; enota $\mathrm{W/m^2}$.

**Definicija.** **Prevod** (kondukcija) je prenos toplote skozi snov brez makroskopskega gibanja snovi: energijo si izmenjujejo sosednji delci (nihanja mreže, trki molekul, v kovinah predvsem prosti elektroni). Prevod je edini način prenosa v trdni neprozorni snovi; v tekočinah in plinih ga spremljata konvekcija in sevanje, ki ju obravnavamo pozneje.

**Definicija.** **Stacionarno stanje** je stanje, v katerem se temperatura v nobeni točki ne spreminja s časom. Tedaj vsa toplota, ki vstopi v plast, iz nje tudi izstopi.

### Fourierov zakon

**Fourierov zakon.** V izotropni snovi je gostota toplotnega toka sorazmerna z gradientom temperature in usmerjena proti nižji temperaturi:

$$\vec{q} = -\lambda\,\nabla T, \qquad q_x = -\lambda\frac{\mathrm{d}T}{\mathrm{d}x}.$$

Sorazmernostni koeficient $\lambda$ je **toplotna prevodnost** z enoto $\mathrm{W/(m\,K)}$. Predznak minus pomeni, da toplota teče v smer padanja temperature: kjer $T$ z $x$ pada ($\mathrm{d}T/\mathrm{d}x < 0$), je $q_x > 0$. Zakon je empiričen, kot Ohmov zakon; velja, dokler $\lambda$ ni odvisna od smeri (les in kompoziti so anizotropni) in so gradienti zmerni.

Velikostni redi pri sobni temperaturi (v $\mathrm{W/(m\,K)}$): baker $400$; aluminij $237$; ogljikovo jeklo $50$; nerjavno jeklo $16$; steklo $1{,}0$; voda $0{,}60$; mišica $0{,}5$; maščevje $0{,}2$; mineralna volna $0{,}040$; polistiren $0{,}035$; poliuretanska pena $0{,}025$; mirujoč zrak $0{,}026$. Dobri izolatorji so večinoma zrak, ujet v majhne celice, da se ne more gibati.

**Izpeljava za ravno steno.** Naj bo stena debeline $d$ iz homogene snovi s stalno $\lambda$, zelo široka v primerjavi z $d$ (tok samo v smeri $x$), v stacionarnem stanju in brez virov toplote v njej. Na površinah sta temperaturi $T_1$ pri $x = 0$ in $T_2$ pri $x = d$.

1. Bilanca za tanko plast med $x$ in $x + \mathrm{d}x$: kar vstopi, mora izstopiti, zato je $q(x) = q(x + \mathrm{d}x)$, torej $\mathrm{d}q/\mathrm{d}x = 0$ in $q$ je stalen.
2. Iz Fourierovega zakona je $\mathrm{d}T/\mathrm{d}x = -q/\lambda$ stalen, zato je temperatura v steni **linearna** funkcija $x$.
3. Integracija od $0$ do $d$: $T_2 - T_1 = -q\,d/\lambda$, torej $q = \lambda(T_1 - T_2)/d$ in

$$\Phi = \frac{\lambda A}{d}\,(T_1 - T_2).$$

To je točno tisto, kar so pokazale meritve, zdaj pa vemo tudi, pod katerimi pogoji velja.

:::premisli
V steni s stalno $\lambda$ je profil temperature premica. Kakšen bi bil, če bi $\lambda$ s temperaturo naraščala (tako je pri mnogih izolacijah)? Kje bi bil strmejši?
---
Ne bi bil več premica. Gostota toka $q = -\lambda\,\mathrm{d}T/\mathrm{d}x$ je še vedno povsod enaka, zato mora biti naklon $|\mathrm{d}T/\mathrm{d}x| = q/\lambda$ večji tam, kjer je $\lambda$ manjša, torej na hladni strani. Profil je na topli strani položnejši, na hladni strmejši.
:::

### Toplotni upor

Zapis $\Phi = \lambda A\Delta T/d$ ima enako obliko kot Ohmov zakon $I = U/R$: toplotni tok ustreza električnemu toku, temperaturna razlika napetosti. Zato definiramo:

**Definicija.** **Toplotni upor** plasti je razmerje med temperaturno razliko na njej in toplotnim tokom skoznjo, $R_t = \Delta T/\Phi$; enota $\mathrm{K/W}$. Za ravno steno je

$$R_t = \frac{d}{\lambda A}.$$

**Ploskovni toplotni upor** $R_A = d/\lambda$ (enota $\mathrm{m^2\,K/W}$) je upor enega kvadratnega metra; z njim je $q = \Delta T/R_A$. V gradbeništvu ga imenujejo kar $R$, obratno vrednost celotne stene pa toplotna prehodnost $U$.

**Izrek (zaporedna vezava).** Naj toplota v stacionarnem stanju prehaja skozi $n$ plasti, ki se tesno stikajo in skozi katere teče isti toplotni tok $\Phi$. Potem je skupni upor vsota uporov plasti:

$$R_\mathrm{sk} = R_1 + R_2 + \dots + R_n.$$

**Dokaz.** Na plasti $i$ je padec temperature $\Delta T_i = \Phi R_i$, ker je $\Phi$ za vse plasti enak (stacionarno stanje, ni virov). Celotna razlika je vsota padcev: $\Delta T = \sum\Delta T_i = \Phi\sum R_i$, zato je $\Delta T/\Phi = \sum R_i$. ∎

Dve posledici sta za prakso najpomembnejši. Prvič, padec temperature na plasti je sorazmeren z njenim uporom: $\Delta T_i/\Delta T = R_i/R_\mathrm{sk}$. Skoraj vsa razlika »pade« na izolaciji, kovinski plašč pa ima skoraj enako temperaturo na obeh straneh. Drugič, vmesne temperature izračunamo zaporedoma, $T_{i+1} = T_i - \Phi R_i$.

**Izrek (vzporedna vezava).** Naj toplota med istima temperaturama prehaja po več vzporednih poteh (stena in okno), med katerimi je izmenjava zanemarljiva. Potem se toplotni tokovi seštejejo, zato je $1/R_\mathrm{sk} = \sum 1/R_i$. Dokaz je enak kot pri električnih uporih: $\Phi = \sum\Phi_i = \Delta T\sum 1/R_i$.

Pogoj o tesnem stiku ni samoumeven: med hrapavima ploskvama ostanejo zračne reže, ki dodajo **kontaktni upor**. Pri izolacijah ga zanemarimo, pri hlajenju elektronike in v grelnih ploščah liofilizatorja pa ne (zato tam uporabljajo toplotno prevodne paste).

### Valjasta stena

Cevi, ovoji kablov in stene reaktorjev so valjasti. Toplota teče radialno, ploščina, skozi katero gre, pa se z $r$ veča.

**Izpeljava.** Naj bo valjasta plast z notranjim polmerom $r_1$, zunanjim $r_2$ in dolžino $L$ iz snovi s stalno $\lambda$; stanje je stacionarno, brez virov, temperaturi na površinah sta $T_1$ in $T_2$, tok je samo radialen (zanemarimo konca).

1. Skozi vsak valjasti plašč s polmerom $r$ ($r_1 \le r \le r_2$) teče isti tok $\Phi$, ploščina plašča pa je $A(r) = 2\pi rL$. Zato gostota toka pada kot $1/r$.
2. Fourier: $\Phi = -\lambda\,2\pi rL\,\dfrac{\mathrm{d}T}{\mathrm{d}r}$, torej $\mathrm{d}T = -\dfrac{\Phi}{2\pi\lambda L}\,\dfrac{\mathrm{d}r}{r}$.
3. Integracija od $r_1$ do $r_2$: $T_2 - T_1 = -\dfrac{\Phi}{2\pi\lambda L}\ln\dfrac{r_2}{r_1}$, torej

$$\Phi = \frac{2\pi\lambda L\,(T_1 - T_2)}{\ln(r_2/r_1)}.$$

Toplotni upor valjaste plasti je zato

$$R_c = \frac{\ln(r_2/r_1)}{2\pi\lambda L}.$$

Temperatura v steni pada logaritemsko, ne linearno: blizu notranje površine je profil strm, navzven vse bolj položen. Za tanko steno ($r_2 - r_1 = \delta \ll r_1$) je $\ln(r_2/r_1) \approx \delta/r_1$ in $R_c \approx \delta/(\lambda\,2\pi r_1L)$, kar je upor ravne stene s ploščino plašča. Zato tanko jekleno cev smemo računati kot ravno ploščo, debele izolacije pa ne.

:::premisli
Na cev položimo dve enako debeli plasti izolacije iz iste snovi. Ali sta njuna toplotna upora enaka? Katera ima večjega?
---
Nista enaka. Notranja plast ima večji upor, ker je pri enaki debelini razmerje $r_2/r_1$ večje (manjši notranji polmer), toplota pa mora skozi manjšo ploščino. Vsaka naslednja enako debela plast izolacije prinese manj.
:::

Za votlo kroglo s polmeroma $r_1$ in $r_2$ ista pot (ploščina $4\pi r^2$) da $R_k = \dfrac{1/r_1 - 1/r_2}{4\pi\lambda}$; izpeljava je naloga v razdelku Za izpit.

### Postopek

(1) Skiciraj steno, plasti in znane temperature. (2) Preveri pogoje: stacionarno stanje, tok v eni smeri, ni virov, tesen stik. (3) Za vsako plast izračunaj upor po njeni geometriji (ravna ali valjasta). (4) Upore zaporednih plasti seštej, vzporedne poti združi z obratnimi vrednostmi. (5) $\Phi = \Delta T/R_\mathrm{sk}$, nato vmesne temperature s padci $\Phi R_i$. (6) Preveri, ali padci skupaj dajo celotno razliko.

## Rešeni primeri

### Primer 1 (lažji)

Stena hladilne škatle za cepiva je iz ekspandiranega polistirena s toplotno prevodnostjo $0{,}033\,\mathrm{W/(m\,K)}$ in debeline $3{,}0\,\mathrm{cm}$. Skupna ploščina sten je $0{,}60\,\mathrm{m^2}$. Notranja površina ima $5\,^\circ\mathrm{C}$, zunanja $30\,^\circ\mathrm{C}$. Kolikšen je toplotni tok v škatlo? Koliko časa bi pri tem toku zdržal $1{,}0\,\mathrm{kg}$ ledu, ki se tali (talilna toplota ledu $334\,\mathrm{kJ/kg}$)?

**Podatki:** $\lambda = 0{,}033\,\mathrm{W/(m\,K)}$, $d = 3{,}0\,\mathrm{cm} = 0{,}030\,\mathrm{m}$, $A = 0{,}60\,\mathrm{m^2}$, $T_1 = 30\,^\circ\mathrm{C}$, $T_2 = 5\,^\circ\mathrm{C}$, $m = 1{,}0\,\mathrm{kg}$, $q_t = 334\,\mathrm{kJ/kg}$
**Iščemo:** toplotni tok $\Phi$ in čas $t$, v katerem se led stali

:::formula
$\Phi = \dfrac{\lambda A\,(T_1 - T_2)}{d}$, $t = \dfrac{m\,q_t}{\Phi}$
:::

**Rešitev:**

1. Temperaturna razlika je enaka v $^\circ\mathrm{C}$ in v K: $T_1 - T_2 = 25\,\mathrm{K}$.
2. Stena je tanka v primerjavi z velikostjo škatle, zato jo računamo kot ravno: $\Phi = 0{,}033 \cdot 0{,}60 \cdot 25/0{,}030\,\mathrm{W} = 16{,}5\,\mathrm{W}$.
3. Led porabi vso prejeto toploto za taljenje: $m\,q_t = 1{,}0\,\mathrm{kg} \cdot 334\,000\,\mathrm{J/kg} = 334\,000\,\mathrm{J}$.
4. Čas: $t = 334\,000\,\mathrm{J}/16{,}5\,\mathrm{W} \approx 20\,200\,\mathrm{s} \approx 5{,}6\,\mathrm{h}$.
5. Odgovor: v škatlo teče približno $16{,}5\,\mathrm{W}$, kilogram ledu se stali v približno $5{,}6$ ure. Dvakrat debelejša stena bi čas podvojila, kar pojasni podatek s škatle iz uvoda.

### Primer 2

Stena farmacevtske zamrzovalne komore za krvno plazmo je panel iz dveh pločevin nerjavnega jekla debeline $1{,}0\,\mathrm{mm}$ ($\lambda_j = 16\,\mathrm{W/(m\,K)}$) in vmesne poliuretanske pene debeline $100\,\mathrm{mm}$ ($\lambda_p = 0{,}025\,\mathrm{W/(m\,K)}$). Notranja površina ima $-20\,^\circ\mathrm{C}$, zunanja $25\,^\circ\mathrm{C}$, ploščina sten je $60\,\mathrm{m^2}$. Izračunaj gostoto toplotnega toka, celotni tok in temperaturi na obeh straneh pene.

**Podatki:** $d_j = 1{,}0\,\mathrm{mm} = 0{,}0010\,\mathrm{m}$ (dvakrat), $\lambda_j = 16\,\mathrm{W/(m\,K)}$, $d_p = 0{,}100\,\mathrm{m}$, $\lambda_p = 0{,}025\,\mathrm{W/(m\,K)}$, $T_\mathrm{z} = 25\,^\circ\mathrm{C}$, $T_\mathrm{n} = -20\,^\circ\mathrm{C}$, $A = 60\,\mathrm{m^2}$
**Iščemo:** $q$, $\Phi$, temperaturi na stikih jekla in pene

:::formula
$R_A = \dfrac{d_j}{\lambda_j} + \dfrac{d_p}{\lambda_p} + \dfrac{d_j}{\lambda_j}$, $q = \dfrac{T_\mathrm{z} - T_\mathrm{n}}{R_A}$, $\Delta T_i = q\,\dfrac{d_i}{\lambda_i}$
:::

**Rešitev:**

1. Plasti so zaporedne, zato seštejemo ploskovne upore. Vsaka pločevina: $0{,}0010/16\,\mathrm{m^2\,K/W} = 6{,}25 \cdot 10^{-5}\,\mathrm{m^2\,K/W}$.
2. Pena: $0{,}100/0{,}025\,\mathrm{m^2\,K/W} = 4{,}0\,\mathrm{m^2\,K/W}$.
3. Skupaj $R_A \approx 4{,}000\,\mathrm{m^2\,K/W}$; jeklo prispeva le $0{,}003\,\%$.
4. Gostota toka: $q = 45\,\mathrm{K}/4{,}000\,\mathrm{m^2\,K/W} \approx 11{,}25\,\mathrm{W/m^2}$.
5. Celotni tok: $\Phi = qA = 11{,}25 \cdot 60\,\mathrm{W} = 675\,\mathrm{W}$. Toliko toplote mora hladilni agregat neprestano odvajati samo zaradi sten.
6. Padec na pločevini: $\Delta T_j = 11{,}25 \cdot 6{,}25 \cdot 10^{-5}\,\mathrm{K} \approx 7 \cdot 10^{-4}\,\mathrm{K}$. Stika imata zato praktično $25\,^\circ\mathrm{C}$ in $-20\,^\circ\mathrm{C}$.
7. Odgovor: $q \approx 11{,}3\,\mathrm{W/m^2}$, $\Phi \approx 675\,\mathrm{W}$; cela temperaturna razlika pade na peni, pločevini sta skoraj izotermni. Jeklo daje steni trdnost, ne izolacije.

### Primer 3 (težji)

Para za avtoklav teče po jekleni cevi z notranjim polmerom $2{,}5\,\mathrm{cm}$ in zunanjim $3{,}0\,\mathrm{cm}$ ($\lambda_j = 45\,\mathrm{W/(m\,K)}$). Cev je obdana s $4{,}0\,\mathrm{cm}$ mineralne volne ($\lambda_v = 0{,}040\,\mathrm{W/(m\,K)}$). Notranja površina cevi ima $134\,^\circ\mathrm{C}$, zunanja površina izolacije $35\,^\circ\mathrm{C}$.
a) Izračunaj toplotni tok na meter cevi in temperaturo na stiku jekla in volne.
b) Kolikšen tok bi dobil, če bi volno napačno računal kot ravno steno s ploščino notranjega plašča volne?
c) Koliko energije izgubi $25\,\mathrm{m}$ dolg vod v $8$ urah obratovanja?
d) Kako debela bi morala biti volna, da bi bil tok največ $20\,\mathrm{W}$ na meter (temperaturi površin ostaneta enaki)?

**Podatki:** $r_1 = 0{,}025\,\mathrm{m}$, $r_2 = 0{,}030\,\mathrm{m}$, $r_3 = r_2 + 0{,}040\,\mathrm{m} = 0{,}070\,\mathrm{m}$, $\lambda_j = 45\,\mathrm{W/(m\,K)}$, $\lambda_v = 0{,}040\,\mathrm{W/(m\,K)}$, $T_1 = 134\,^\circ\mathrm{C}$, $T_3 = 35\,^\circ\mathrm{C}$, $L = 1\,\mathrm{m}$ (na meter), dolžina voda $25\,\mathrm{m}$, $t = 8\,\mathrm{h}$, meja $20\,\mathrm{W}$ na meter
**Iščemo:** $\Phi$ na meter, $T_2$, tok po napačnem modelu, energijo $E$, potrebni polmer $r_3$

:::formula
$R_c = \dfrac{\ln(r_\mathrm{zun}/r_\mathrm{not})}{2\pi\lambda L}$, $\Phi = \dfrac{T_1 - T_3}{R_j + R_v}$, $T_2 = T_1 - \Phi R_j$, $E = \Phi t$
:::

**Rešitev:**

1. Upor jekla na meter: $R_j = \ln(1{,}2)/(2\pi \cdot 45)\,\mathrm{K/W} \approx 6{,}45 \cdot 10^{-4}\,\mathrm{K/W}$.
2. Upor volne: $R_v = \ln(0{,}070/0{,}030)/(2\pi \cdot 0{,}040)\,\mathrm{K/W} = 0{,}8473/0{,}2513\,\mathrm{K/W} \approx 3{,}371\,\mathrm{K/W}$.
3. Upora sta zaporedna, skupaj $3{,}372\,\mathrm{K/W}$. Tok: $\Phi = 99\,\mathrm{K}/3{,}372\,\mathrm{K/W} \approx 29{,}4\,\mathrm{W}$ na meter.
4. Stik: $T_2 = 134\,^\circ\mathrm{C} - 29{,}4 \cdot 6{,}45 \cdot 10^{-4}\,\mathrm{K} \approx 133{,}98\,^\circ\mathrm{C}$; jeklo je skoraj izotermno.
5. b) Ravna stena s ploščino $2\pi r_2 L = 0{,}1885\,\mathrm{m^2}$: $R = 0{,}040/(0{,}040 \cdot 0{,}1885)\,\mathrm{K/W} \approx 5{,}31\,\mathrm{K/W}$ in $\Phi \approx 99/5{,}31\,\mathrm{W} \approx 18{,}7\,\mathrm{W}$. Napaka je več kot tretjina, ker se ploščina od notranjega do zunanjega roba volne več kot podvoji.
6. c) Za ves vod: $E = 29{,}36\,\mathrm{W/m} \cdot 25\,\mathrm{m} \cdot 28\,800\,\mathrm{s} \approx 2{,}11 \cdot 10^7\,\mathrm{J} = 21\,\mathrm{MJ}$.
7. d) Potrebni skupni upor: $99/20\,\mathrm{K/W} = 4{,}95\,\mathrm{K/W}$; volna mora dati $4{,}95 - 0{,}000645 \approx 4{,}949\,\mathrm{K/W}$.
8. Iz $\ln(r_3/r_2) = 2\pi\lambda_v R_v = 0{,}2513 \cdot 4{,}949 \approx 1{,}244$ sledi $r_3 = 0{,}030\,\mathrm{m} \cdot \mathrm{e}^{1{,}244} \approx 0{,}104\,\mathrm{m}$.
9. Odgovor: a) približno $29{,}4\,\mathrm{W}$ na meter, stik ima $134\,^\circ\mathrm{C}$; b) ravninski model da napačnih $18{,}7\,\mathrm{W}$; c) vod v izmeni izgubi okoli $21\,\mathrm{MJ}$; d) volna bi morala biti debela okoli $7{,}4\,\mathrm{cm}$ namesto $4{,}0\,\mathrm{cm}$. Ker upor raste le logaritemsko, skoraj dvakrat debelejša izolacija tok zmanjša le za tretjino.

### Primer 4 – zdaj ti

Fizioterapevt na koleno položi hladen obkladek s temperaturo $0\,^\circ\mathrm{C}$, med obkladek in kožo pa brisačo debeline $3{,}0\,\mathrm{mm}$ ($\lambda_b = 0{,}060\,\mathrm{W/(m\,K)}$). Pod kožo je $10\,\mathrm{mm}$ plast kože in podkožja s povprečno $\lambda_k = 0{,}30\,\mathrm{W/(m\,K)}$, pod njo tkivo s $34\,^\circ\mathrm{C}$. Privzemi stacionarno stanje in ravno plast. Kolikšna je temperatura kože pod brisačo?

**Podatki:** $T_o = 0\,^\circ\mathrm{C}$, $d_b = 0{,}0030\,\mathrm{m}$, $\lambda_b = 0{,}060\,\mathrm{W/(m\,K)}$, $d_k = 0{,}010\,\mathrm{m}$, $\lambda_k = 0{,}30\,\mathrm{W/(m\,K)}$, $T_t = 34\,^\circ\mathrm{C}$
**Iščemo:** temperaturo kože $T_s$ na stiku z brisačo

:::formula
$R_A = \dfrac{d_b}{\lambda_b} + \dfrac{d_k}{\lambda_k}$, $q = \dfrac{T_t - T_o}{R_A}$, $T_s = T_o + q\,\dfrac{d_b}{\lambda_b}$
:::

**Rešitev:**

1. Brisača: $0{,}0030/0{,}060\,\mathrm{m^2\,K/W} = 0{,}050\,\mathrm{m^2\,K/W}$.
2. Koža in podkožje: $0{,}010/0{,}30\,\mathrm{m^2\,K/W} \approx 0{,}0333\,\mathrm{m^2\,K/W}$; skupaj $R_A \approx 0{,}0833\,\mathrm{m^2\,K/W}$.
3. Zdaj ti: izračunaj gostoto toka in temperaturo kože.

:::premisli
Kolikšna sta $q$ in $T_s$? Kaj bi se zgodilo brez brisače?
---
$q = 34\,\mathrm{K}/0{,}0833\,\mathrm{m^2\,K/W} \approx 408\,\mathrm{W/m^2}$, $T_s = 0\,^\circ\mathrm{C} + 408 \cdot 0{,}050\,\mathrm{K} \approx 20{,}4\,^\circ\mathrm{C}$. Brisača ima večji upor od kože, zato na njej pade več kot polovica razlike. Brez nje bi koža imela skoraj $0\,^\circ\mathrm{C}$, kar lahko povzroči ozebline; zato obkladka nikoli ne polagamo neposredno na kožo.
:::

## Pogoste napake

- **Toplotni tok sorazmeren z debelino.** Kdor zamenja vlogi, piše $\Phi = \lambda A\Delta T\,d$. Dimenzijska kontrola to razkrije: $\mathrm{W/(m\,K)} \cdot \mathrm{m^2} \cdot \mathrm{K} \cdot \mathrm{m}$ ni W. Debelina je v imenovalcu; debelejša stena prepušča manj.
- **Enak padec temperature na vsaki plasti.** Pri zaporednih plasteh je enak *tok*, ne padec. Padec je sorazmeren z uporom plasti, zato je pri kovini in izolaciji skoraj ves na izolaciji.
- **Seštevanje prevodnosti namesto uporov.** Zaporedne plasti imajo skupni upor $\sum d_i/\lambda_i$, ne skupne prevodnosti $\sum\lambda_i$ ali povprečne $\lambda$, deljene s skupno debelino. Povprečje prevodnosti da napačen, skoraj vedno prevelik tok.
- **Valjasta izolacija kot ravna stena.** Pri debeli izolaciji cevi se ploščina od notranjega do zunanjega roba močno spremeni. Uporabi $R_c = \ln(r_2/r_1)/(2\pi\lambda L)$; ravninski model z notranjo ploščino tok podceni, z zunanjo preceni.
- **Kovinska plast kot izolacija.** »Dvojna jeklena stena bolje izolira.« Jeklo prevaja tisočkrat bolje od pene; njegov upor je zanemarljiv. Izolira mirujoč zrak v porah, ne kovina.
- **Fourierov zakon v nestacionarnem stanju.** $\Phi = \lambda A\Delta T/d$ velja le, ko se temperatura s časom ne spreminja več. Tik po vklopu grelnika toplota segreva steno in tok ni enak na obeh straneh.

## Povzetek

- Fourierov zakon: $\vec{q} = -\lambda\nabla T$; toplota teče proti nižji temperaturi, $\lambda$ v $\mathrm{W/(m\,K)}$.
- Ravna stena (stacionarno, brez virov, stalna $\lambda$): linearen profil, $\Phi = \lambda A\Delta T/d$.
- Toplotni upor $R_t = \Delta T/\Phi$: ravna stena $d/(\lambda A)$, valjasta $\ln(r_2/r_1)/(2\pi\lambda L)$, krogelna $(1/r_1 - 1/r_2)/(4\pi\lambda)$.
- Zaporedne plasti: upori se seštejejo, padci temperature so sorazmerni z upori. Vzporedne poti: seštejejo se tokovi.
- V valjasti steni je profil logaritemski; tanko steno smemo računati kot ravno.
- Izolira ujet mirujoč plin; kovinske plasti so skoraj izotermne.

## Za izpit

Znati moraš povedati:

- definicije toplotnega toka, gostote toplotnega toka, toplotne prevodnosti in toplotnega upora z enotami;
- Fourierov zakon v vektorski in enorazsežni obliki ter pomen predznaka;
- izpeljavo linearnega profila in $\Phi = \lambda A\Delta T/d$ za ravno steno z vsemi pogoji;
- izrek o zaporedni in vzporedni vezavi toplotnih uporov z dokazom;
- izpeljavo toplotnega upora valjaste in krogelne plasti ter zakaj je profil v valjasti steni logaritemski.

### Naloga 1

Inkubator za celične kulture ima notranjo površino sten pri $37\,^\circ\mathrm{C}$, zunanjo pri $22\,^\circ\mathrm{C}$. Stene s ploščino $1{,}30\,\mathrm{m^2}$ so iz dveh jeklenih pločevin po $1{,}0\,\mathrm{mm}$ ($\lambda = 16\,\mathrm{W/(m\,K)}$) in pene debeline $40\,\mathrm{mm}$ ($\lambda = 0{,}030\,\mathrm{W/(m\,K)}$). Vrata s ploščino $0{,}20\,\mathrm{m^2}$ so dvojno steklo: dve stekli po $4{,}0\,\mathrm{mm}$ ($\lambda = 1{,}0\,\mathrm{W/(m\,K)}$) in $10\,\mathrm{mm}$ mirujočega zraka ($\lambda = 0{,}026\,\mathrm{W/(m\,K)}$). Izračunaj moč grelnika, ki pokriva izgube, nadomestni toplotni upor in delež izgub skozi vrata. Kako debela bi morala biti pena, da bi bile skupne izgube $18\,\mathrm{W}$? Robove in toplotne mostove zanemari.

**Rešitev:**

1. Stena (zaporedne plasti): $R_s = \dfrac{2 \cdot 0{,}0010/16 + 0{,}040/0{,}030}{1{,}30}\,\mathrm{K/W} = \dfrac{1{,}3334}{1{,}30}\,\mathrm{K/W} \approx 1{,}026\,\mathrm{K/W}$.
2. Vrata: $R_v = \dfrac{2 \cdot 0{,}0040/1{,}0 + 0{,}010/0{,}026}{0{,}20}\,\mathrm{K/W} = \dfrac{0{,}3926}{0{,}20}\,\mathrm{K/W} \approx 1{,}963\,\mathrm{K/W}$.
3. Steni in vrata so vzporedne poti med istima temperaturama: $\Phi_s = 15/1{,}026\,\mathrm{W} \approx 14{,}62\,\mathrm{W}$, $\Phi_v = 15/1{,}963\,\mathrm{W} \approx 7{,}64\,\mathrm{W}$.
4. Moč grelnika: $\Phi = 14{,}62\,\mathrm{W} + 7{,}64\,\mathrm{W} \approx 22{,}3\,\mathrm{W}$.
5. Nadomestni upor: $R = 15/22{,}26\,\mathrm{K/W} \approx 0{,}674\,\mathrm{K/W}$ (manjši od obeh, kot pri vzporednih električnih uporih).
6. Delež vrat: $7{,}64/22{,}26 \approx 0{,}34$. Vrata so $13\,\%$ ploščine, a dajo $34\,\%$ izgub.
7. Za $18\,\mathrm{W}$ morajo stene prepuščati $18 - 7{,}64 = 10{,}36\,\mathrm{W}$, torej $R_s = 15/10{,}36\,\mathrm{K/W} \approx 1{,}448\,\mathrm{K/W}$ in $R_A = 1{,}448 \cdot 1{,}30\,\mathrm{m^2\,K/W} \approx 1{,}882\,\mathrm{m^2\,K/W}$.
8. Pena: $d = (1{,}882 - 0{,}000125) \cdot 0{,}030\,\mathrm{m} \approx 0{,}0565\,\mathrm{m}$.
9. Odgovor: grelnik mora dajati okoli $22\,\mathrm{W}$, nadomestni upor je $0{,}67\,\mathrm{K/W}$, vrata nosijo tretjino izgub; za $18\,\mathrm{W}$ bi potrebovali okoli $57\,\mathrm{mm}$ pene. Učinkoviteje bi bilo izboljšati vrata, ki so najšibkejša pot.

### Naloga 2

Natančno navedi Fourierov zakon in pogoje, pod katerimi je temperaturni profil v ravni steni linearen. Dokaži, da je pri zaporednih plasteh skupni toplotni upor vsota uporov, in utemelji, ali drži trditev: »Pri dvoslojni steni je temperaturni gradient večji v plasti z manjšo toplotno prevodnostjo.«

**Rešitev:**

1. Zakon: $\vec{q} = -\lambda\nabla T$, v eni razsežnosti $q_x = -\lambda\,\mathrm{d}T/\mathrm{d}x$; $\lambda > 0$ je toplotna prevodnost, minus pomeni tok proti nižji temperaturi.
2. Pogoji za linearni profil: stacionarno stanje, tok le v smeri $x$, v steni ni virov toplote, $\lambda$ je stalna. Tedaj iz bilance sledi $\mathrm{d}q/\mathrm{d}x = 0$, iz zakona pa $\mathrm{d}T/\mathrm{d}x = -q/\lambda = $ konst.
3. Zaporedne plasti: v stacionarnem stanju brez virov skozi vsako plast teče isti $\Phi$, sicer bi se toplota na stiku kopičila in temperatura bi se spreminjala. Padec na plasti $i$ je $\Delta T_i = \Phi R_i$, vsota padcev je celotna razlika, zato $R_\mathrm{sk} = \Delta T/\Phi = \sum R_i$.
4. Trditev drži: gostota toka $q$ je v obeh plasteh enaka (enaka ploščina, isti tok), zato je $|\mathrm{d}T/\mathrm{d}x| = q/\lambda$ obratno sorazmeren s $\lambda$. Plast z manjšo $\lambda$ ima strmejši profil.
5. Pozor: to govori o gradientu, ne o padcu. Padec $q\,d_i/\lambda_i$ je odvisen tudi od debeline; tanka slabo prevodna plast ima lahko manjši padec od debele dobro prevodne.

### Naloga 3

Izpelji toplotni upor krogelne plasti s polmeroma $r_1 < r_2$ in stalno $\lambda$. Pokaži, da je enak uporu ravne stene debeline $r_2 - r_1$ s ploščino $4\pi r_1r_2$. Izračunaj toplotni tok v kroglasto posodo z zamrznjenim pripravkom ($r_1 = 0{,}20\,\mathrm{m}$, $r_2 = 0{,}30\,\mathrm{m}$, poliuretan $\lambda = 0{,}025\,\mathrm{W/(m\,K)}$, površini pri $-20\,^\circ\mathrm{C}$ in $25\,^\circ\mathrm{C}$) in ga primerjaj z ravninskim približkom s ploščino notranje in zunanje površine.

**Rešitev:**

1. V stacionarnem stanju brez virov skozi vsako sferično ploskev s polmerom $r$ teče isti $\Phi$; ploščina je $4\pi r^2$.
2. Fourier: $\Phi = -\lambda\,4\pi r^2\,\mathrm{d}T/\mathrm{d}r$, torej $\mathrm{d}T = -\dfrac{\Phi}{4\pi\lambda}\dfrac{\mathrm{d}r}{r^2}$.
3. Integracija: $T_1 - T_2 = \dfrac{\Phi}{4\pi\lambda}\left(\dfrac{1}{r_1} - \dfrac{1}{r_2}\right)$, torej $R_k = \dfrac{1/r_1 - 1/r_2}{4\pi\lambda}$.
4. Ker je $\dfrac{1}{r_1} - \dfrac{1}{r_2} = \dfrac{r_2 - r_1}{r_1r_2}$, je $R_k = \dfrac{r_2 - r_1}{\lambda\,4\pi r_1r_2}$: ravna stena debeline $r_2 - r_1$ s ploščino $4\pi r_1r_2$ (geometrijska sredina notranje in zunanje ploščine).
5. Številke: $4\pi r_1r_2 = 4\pi \cdot 0{,}20 \cdot 0{,}30\,\mathrm{m^2} \approx 0{,}754\,\mathrm{m^2}$, $R_k = 0{,}10/(0{,}025 \cdot 0{,}754)\,\mathrm{K/W} \approx 5{,}31\,\mathrm{K/W}$, $\Phi = 45/5{,}31\,\mathrm{W} \approx 8{,}48\,\mathrm{W}$.
6. Ravninsko z notranjo ploščino $4\pi r_1^2 \approx 0{,}503\,\mathrm{m^2}$: $\Phi \approx 5{,}65\,\mathrm{W}$; z zunanjo $4\pi r_2^2 \approx 1{,}131\,\mathrm{m^2}$: $\Phi \approx 12{,}7\,\mathrm{W}$.
7. Odgovor: točni tok je $8{,}5\,\mathrm{W}$; približek z notranjo ploščino ga podceni za tretjino, z zunanjo preceni za polovico. Pri debelih plasteh je geometrija bistvena.

## Drugače: Na sliki

Profil temperature v panelu zamrzovalne komore (jeklo – pena – jeklo), toplo zunaj levo:

```
 T
 |##
 |##\
 |## \
 |##  \
 |##   \
 |##    \
 |##     \##
 |##      ##
 +--------------> x
 jeklo pena jeklo
```

V tankih jeklenih plasteh je črta vodoravna, ker imajo zanemarljiv upor. V peni je premica, ker je $\lambda$ stalna in tok povsod enak. V valjasti izolaciji bi se ista črta krivila: strma pri cevi, položna navzven, ker se ploščina z $r$ veča.

Električna analogija za Primer 2:

```
 25 °C (zunaj)
   |
 [jeklo]  R = 0,00006
 [ pena]  R = 4,0
 [jeklo]  R = 0,00006
   |
-20 °C (znotraj)
```

Upori so zaporedni, isti »tok« $q$ teče skozi vse tri, »napetost« (padec temperature) se razdeli v razmerju uporov.

## Drugače: Uporaba v stroki

**Hladilna veriga zdravil.** Cepiva, inzulin in biološka zdravila morajo ostati med $2\,^\circ\mathrm{C}$ in $8\,^\circ\mathrm{C}$. Proizvajalci transportnih škatel izračunajo čas zdržnosti iz $\Phi = \Delta T/R_\mathrm{sk}$ in talilne toplote hladilnih vložkov, nato ga preverijo v komori z vnaprej določenim potekom zunanje temperature. Vakuumski izolacijski paneli imajo $\lambda$ okoli $0{,}004\,\mathrm{W/(m\,K)}$, kar pri enaki debelini podaljša zdržnost skoraj desetkrat glede na polistiren.

**Liofilizacija.** Pri sušenju z zamrzovanjem viale stojijo na ogrevanih policah. Toplota mora skozi dno viale, tanko plast zraka pod njim in zamrznjeni produkt do fronte sublimacije. Kontaktni upor med polico in ukrivljenim dnom viale je pogosto največji člen v verigi uporov; zato proizvajalci opreme določajo koeficient prenosa toplote za vsak tip viale posebej.

**Toplotna izolacija telesa.** Podkožno maščevje ima $\lambda$ okoli $0{,}2\,\mathrm{W/(m\,K)}$, mišica okoli $0{,}5\,\mathrm{W/(m\,K)}$. Pri mrazu telo zoži žile v koži, s čimer zmanjša prenos s krvjo in plast kože deluje kot čisti prevodnik z večjim uporom. Pri terapevtski hipotermiji po zastoju srca blazine z ohlajeno vodo odvajajo toploto skozi kožo; hitrost hlajenja omejuje prav upor kože in maščevja.

**Merjenje prevodnosti.** Prevodnost materialov merijo z zaščiteno vročo ploščo (standard ISO 8302), kjer grelni obroč okoli merilne plošče prepreči tok vstran, da velja enorazsežni model, ali z metodo vroče žice, ki iz hitrosti segrevanja žice v snovi določi $\lambda$ v nekaj sekundah.

## Drugače: Korak za korakom s številkami

Koliko toplote na uro izgubi steklo okna v laboratoriju s ploščino $1{,}5\,\mathrm{m^2}$ in debelino $4{,}0\,\mathrm{mm}$, če je razlika med površinama stekla $2{,}0\,\mathrm{K}$?

1. **Upor:** $R_t = d/(\lambda A) = 0{,}0040/(1{,}0 \cdot 1{,}5)\,\mathrm{K/W} \approx 0{,}00267\,\mathrm{K/W}$.
2. **Tok:** $\Phi = \Delta T/R_t = 2{,}0/0{,}00267\,\mathrm{W} = 750\,\mathrm{W}$.
3. **Na uro:** $Q = 750\,\mathrm{W} \cdot 3600\,\mathrm{s} = 2{,}7 \cdot 10^6\,\mathrm{J} = 2{,}7\,\mathrm{MJ}$.
4. **Pomen:** steklo samo skoraj ne izolira; razlika med površinama stekla je zato v resnici majhna, večina upora okna je v zračnih plasteh ob steklu in med stekli. To je snov naslednje lekcije o prestopu toplote.

## Drugače: Bolj natančno

**Toplotna enačba.** Če stanje ni stacionarno, bilanca za majhen volumen da $\rho c_p\,\partial T/\partial t = -\nabla\cdot\vec{q} + \dot{q}_V$, kjer je $\dot{q}_V$ moč virov na enoto prostornine. S Fourierovim zakonom in stalno $\lambda$ dobimo $\partial T/\partial t = a\nabla^2T + \dot{q}_V/(\rho c_p)$, kjer je $a = \lambda/(\rho c_p)$ **temperaturna prevodnost** v $\mathrm{m^2/s}$. Čas, v katerem toplota prodre v globino $d$, je reda $d^2/a$: za $1\,\mathrm{cm}$ mesa ($a \approx 1{,}4 \cdot 10^{-7}\,\mathrm{m^2/s}$) je to okoli $12$ minut, za $2\,\mathrm{cm}$ štirikrat več. Zato se debelejši kos tako počasneje segreje.

**Viri v steni.** Pri enakomernih virih (Joulova toplota v vodniku, presnova v tkivu) iz $\lambda\,\mathrm{d}^2T/\mathrm{d}x^2 = -\dot{q}_V$ sledi paraboličen profil; najvišja temperatura je v notranjosti. Bioinženirji tako modelirajo temperaturo tkiva s Pennesovo enačbo, ki doda še prenos s krvjo.

**Analogija z difuzijo.** Fickov zakon $J = -D\,\mathrm{d}c/\mathrm{d}x$ ima enako obliko kot Fourierov. Upori za prehod snovi skozi membrane, kožo ali sloje tablete se seštevajo enako kot toplotni; transdermalni obliži so načrtovani s takim modelom.

## Preveri se

? Panel iz jeklene pločevine ($1\,\mathrm{mm}$) in poliuretanske pene ($100\,\mathrm{mm}$) je na zunanji strani jekla pri $25\,^\circ\mathrm{C}$, na notranji strani pene pri $-20\,^\circ\mathrm{C}$. Kateri opis profila temperature ustreza stacionarnemu stanju?
- V obeh plasteh pade temperatura za polovico razlike, za $22{,}5\,\mathrm{K}$.
~ Enak je toplotni tok skozi plasti, ne padec temperature. Padec je sorazmeren z uporom plasti, ta pa je pri jeklu zanemarljiv.
- Večji del razlike pade v jeklu, ker jeklo toploto bolje prevaja.
~ Dobro prevodna plast ima majhen upor, zato je na njej padec majhen. Jeklo prevaja dobro in zato ostane skoraj izotermno.
+ V jeklu je profil skoraj vodoraven, v peni je premica, ki pade za skoraj vseh $45\,\mathrm{K}$.
> Skozi obe plasti teče isti $q$, padec na plasti pa je $q\,d/\lambda$. Upor jekla je okoli $6 \cdot 10^{-5}\,\mathrm{m^2\,K/W}$, pene $4\,\mathrm{m^2\,K/W}$, zato skoraj vsa razlika pade v peni, kjer je profil linearen.

? Približno kolikšen toplotni tok teče skozi $1\,\mathrm{m^2}$ stekla debeline $4\,\mathrm{mm}$ ($\lambda \approx 1\,\mathrm{W/(m\,K)}$), če se temperaturi njegovih površin razlikujeta za $1\,\mathrm{K}$?
- okoli $0{,}25\,\mathrm{W}$
~ Debelino si vstavil v milimetrih ($1/4$), ne v metrih. V Fourierovem zakonu morajo biti vse dolžine v metrih.
- okoli $4\,\mathrm{W}$
~ Debelino si množil namesto delil (in jo vstavil v milimetrih). Debelejša stena prepušča manj, zato je debelina v imenovalcu.
+ okoli $250\,\mathrm{W}$
> $\Phi = \lambda A\Delta T/d = 1 \cdot 1 \cdot 1/0{,}004\,\mathrm{W} = 250\,\mathrm{W}$. Že razlika enega kelvina žene skozi tanko steklo velik tok, zato steklo samo ne izolira.

? Zakaj v debeli izolaciji okoli cevi temperatura ne pada linearno s polmerom?
- Ker toplotna prevodnost izolacije narašča s polmerom.
~ Profil je logaritemski tudi pri povsem stalni $\lambda$; vzrok je geometrija, ne snov.
+ Ker isti toplotni tok teče skozi vse večje ploščine, zato gostota toka in gradient temperature padata kot $1/r$.
- Ker stanje v cevi ni stacionarno.
~ Logaritemski profil je prav stacionarna rešitev. Nestacionarnost bi profil spreminjala s časom, ne naredila logaritma.
> V stacionarnem stanju je $\Phi$ skozi vsak plašč enak, ploščina $2\pi rL$ pa raste z $r$. Zato je $|\mathrm{d}T/\mathrm{d}r| = \Phi/(2\pi\lambda rL)$ sorazmeren z $1/r$, integral pa da $\ln r$.

? Stena hladilne škatle iz polistirena ($\lambda = 0{,}035\,\mathrm{W/(m\,K)}$) naj pri temperaturni razliki $30\,\mathrm{K}$ prepušča največ $10\,\mathrm{W/m^2}$. Kako debela mora biti najmanj?
- $1{,}2\,\mathrm{cm}$
~ Izračunal si $\lambda q/\Delta T$ ali podobno napačno kombinacijo. Iz $q = \lambda\Delta T/d$ sledi $d = \lambda\Delta T/q$.
+ $10{,}5\,\mathrm{cm}$
- $9{,}5\,\mathrm{m}$
~ Delil si v napačni smeri: $q/(\lambda\Delta T)$ ima enoto $1/\mathrm{m}$, ne m. Kontroliraj enote.
> $d = \lambda\Delta T/q = 0{,}035 \cdot 30/10\,\mathrm{m} = 0{,}105\,\mathrm{m} = 10{,}5\,\mathrm{cm}$.

? Transdermalni obliž sprošča zdravilno učinkovino, ki difundira skozi plast kože po Fickovem zakonu $J = -D\,\mathrm{d}c/\mathrm{d}x$ (enaka oblika kot Fourierov zakon). Kako se v stacionarnem stanju spremeni tok učinkovine, če je zaščitna membrana obliža dvakrat debelejša, koža pa ima zanemarljiv upor?
- Ostane enak, ker se koncentracija v obližu ne spremeni.
~ Pri enaki razliki koncentracij je tok obratno sorazmeren z debelino plasti, tako kot je toplotni tok obratno sorazmeren z debelino stene.
- Podvoji se, ker je v debelejši membrani več snovi.
~ Količina snovi v membrani ne določa toka. Tok določa gradient koncentracije, ki se pri debelejši plasti zmanjša.
+ Razpolovi se, ker se gradient koncentracije pri isti razliki razpolovi.
> Po analogiji s $q = \lambda\Delta T/d$ je $J = D\Delta c/d$. Dvakratna debelina pomeni dvakratni »upor« $d/D$ in polovični tok.

:::simboli
\Phi | toplotni tok | \Phi = \frac{\mathrm{d}Q}{\mathrm{d}t} | W
q | gostota toplotnega toka | q = \frac{\Phi}{A} | W/m^2
q_x | komponenta gostote toplotnega toka v smeri $x$ | q_x = -\lambda\frac{\mathrm{d}T}{\mathrm{d}x} | W/m^2
\vec{q} | vektor gostote toplotnega toka | \vec{q} = -\lambda\nabla T | W/m^2
\lambda | toplotna prevodnost | | W/(m\,K) | snovna lastnost
\lambda_j | toplotna prevodnost jekla | | W/(m\,K)
\lambda_p | toplotna prevodnost poliuretanske pene | | W/(m\,K)
\lambda_v | toplotna prevodnost mineralne volne | | W/(m\,K)
\lambda_b | toplotna prevodnost brisače | | W/(m\,K)
\lambda_k | toplotna prevodnost kože in podkožja | | W/(m\,K)
T | temperatura | | K
T_1, T_2, T_3 | temperature na površinah plasti | | K | tudi v °C
T_\mathrm{z}, T_\mathrm{n} | temperatura zunanje in notranje površine | | K
T_o | temperatura obkladka | | K
T_t | temperatura tkiva pod kožo | | K
T_s | temperatura kože pod brisačo | | K
\Delta T | temperaturna razlika | | K
\Delta T_i | padec temperature na plasti $i$ | \Delta T_i = \Phi R_i | K
x | lega v smeri toka | | m
d | debelina plasti | | m
d_j, d_p, d_b, d_k | debeline plasti | | m
d_i | debelina plasti $i$ | | m
\lambda_i | toplotna prevodnost plasti $i$ | | W/(m\,K)
A | ploščina | | m^2 | pravokotna na smer toka
R_t | toplotni upor | R_t = \frac{\Delta T}{\Phi} | K/W | ravna stena: d/(λA)
R_A | ploskovni toplotni upor | R_A = \frac{d}{\lambda} | m^2\,K/W
R_i, R_1, R_2, R_n | toplotni upori posameznih plasti | | K/W
R_\mathrm{sk} | skupni toplotni upor | R_\mathrm{sk} = \sum R_i | K/W | zaporedne plasti
R_c | toplotni upor valjaste plasti | R_c = \frac{\ln(r_2/r_1)}{2\pi\lambda L} | K/W
R_k | toplotni upor krogelne plasti | R_k = \frac{1/r_1 - 1/r_2}{4\pi\lambda} | K/W
R_j, R_v | toplotna upora jekla in volne | | K/W
r | polmer | | m
r_1, r_2, r_3 | polmeri mej plasti | | m
r_\mathrm{not}, r_\mathrm{zun} | notranji in zunanji polmer plasti | | m
L | dolžina cevi | | m
n | število plasti | | –
i | zaporedna številka plasti | | –
t | čas | | s
m | masa ledu | | kg
q_t | specifična talilna toplota | | J/kg | led: 334 kJ/kg
Q | toplota | | J
E | izgubljena energija | E = \Phi t | J
:::
