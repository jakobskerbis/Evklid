---
stanje: osnutek
avtor: AI
---

## Zakaj se tega učimo

Tilen igra bobne v bendu in pred vsako vajo kupi plastenko gazirane vode. Ko jo odpre, voda zašumi, po dveh skladbah na toplem odru pa je že povsem »mrtva«. Zaprta plastenka v hladilniku ostane gazirana tedne. Tilen bi rad vedel, ali naj plastenko vmes zapira, ali naj jo hladi, ali oboje. Odgovor ni v tem, koliko plina je v vodi, ampak v **kemijskem ravnotežju** med raztopljenim in plinastim $\mathrm{CO_2}$.

V gimnaziji reakcije pogosto zapišemo s puščico v eno smer, kot da reaktanti povsem preidejo v produkte. Mnogo reakcij pa se ustavi prej: v zaprti posodi nastane zmes reaktantov in produktov, katere sestava se ne spreminja več. Koliko produkta je v ravnotežni zmesi, pove **konstanta ravnotežja**, kako se ravnotežje odzove na spremembe, pa **Le Chatelierovo načelo**.

To znanje potrebuje vsak, ki želi reakcijo voditi: inženir pri sintezi amoniaka, biokemik pri vezavi kisika na hemoglobin, farmacevt pri stabilnosti zdravila, okoljevarstvenik pri raztapljanju $\mathrm{CO_2}$ v morju. Na ravnotežju temeljijo tudi naslednja poglavja: kisline in baze, pufri, topnost in elektrokemija.

Za to potrebuješ štiri orodja:

- zapisati izraz za **konstanto ravnotežja** $K_c$ in $K_p$ ter ju povezati,
- s **kvocientom reakcije** $Q$ napovedati smer reakcije,
- izračunati ravnotežne koncentracije s preglednico »začetek, sprememba, ravnotežje«,
- uporabiti **Le Chatelierovo načelo** pri spremembi koncentracije, tlaka in temperature.

## Razlaga

### Dinamično ravnotežje

Najprej slika. Na vodoravni osi je čas, na navpični hitrost reakcije. Krivulja hitrosti v desno začne visoko in pada, krivulja hitrosti v levo začne pri nič in raste; kjer se srečata, nadaljujeta kot ena sama vodoravna črta.

Reakcija $\mathrm{A + B \rightleftharpoons C + D}$ teče v obe smeri. Na začetku je hitrost reakcije v desno velika, v levo majhna. Ko se koncentracije reaktantov zmanjšujejo in produktov povečujejo, se hitrosti izenačita. Takrat se sestava ne spreminja več, čeprav obe reakciji tečeta naprej: ravnotežje je **dinamično**. **Definicija:** zaprt sistem je v kemijskem ravnotežju, ko sta pri stalni temperaturi hitrosti reakcije v obe smeri enaki in se sestava s časom ne spreminja. Do istega ravnotežja pridemo iz reaktantov ali iz produktov.

:::premisli
V ravnotežno zmes $\mathrm{H_2}$, $\mathrm{I_2}$ in $\mathrm{HI}$ dodaš malo $\mathrm{HI}$ z radioaktivnim jodom. Ali se bo označeni jod čez čas pojavil tudi v molekulah $\mathrm{I_2}$?
---
Da. Ker obe reakciji tečeta naprej, se $\mathrm{HI}$ stalno razkraja v $\mathrm{H_2}$ in $\mathrm{I_2}$ in spet nastaja. Prav takšni poskusi z izotopi dokazujejo, da je ravnotežje dinamično.
:::

### Zakon o vplivu koncentracij

Naj v zaprtem sistemu pri stalni temperaturi poteka povratna reakcija

$$a\,\mathrm{A} + b\,\mathrm{B} \rightleftharpoons c\,\mathrm{C} + d\,\mathrm{D}.$$

Če je sistem v ravnotežju (in so raztopine razredčene), velja

$$K_c = \frac{[\mathrm{C}]^c\,[\mathrm{D}]^d}{[\mathrm{A}]^a\,[\mathrm{B}]^b},$$

kjer oglati oklepaji pomenijo **ravnotežne** množinske koncentracije. Produkti so v števcu, reaktanti v imenovalcu, koeficienti so eksponenti. $K_c$ je odvisna le od temperature, ne od začetnih koncentracij.

**Termodinamična utemeljitev.** Natančno je $K$ definirana z brezdimenzijskimi **aktivnostmi** ($a_i = c_i/c^\circ$ v razredčeni raztopini, $a_i = p_i/p^\circ$ za idealni plin, $a = 1$ za čisto trdno snov ali tekočino). Reakcijska Gibbsova energija pri dani sestavi je $\Delta_\mathrm{r}G = \Delta_\mathrm{r}G^\circ + RT\ln Q$, kjer je $Q$ **kvocient reakcije**: izraz enake oblike kot $K$, a s trenutnimi aktivnostmi (več spodaj). Pri stalnih temperaturi in tlaku teče reakcija spontano v smeri, v kateri je $\Delta_\mathrm{r}G < 0$; v ravnotežju je $\Delta_\mathrm{r}G = 0$ in $Q = K$, zato

$$\Delta_\mathrm{r}G^\circ = -RT\ln K.$$

Ker je $\Delta_\mathrm{r}G^\circ$ odvisna le od temperature, je od nje odvisna le tudi $K$.

### Heterogena ravnotežja

Čiste trdne snovi in čiste tekočine (tudi topilo voda v razredčenih raztopinah) v izrazu za $K$ **ne nastopajo**, ker je njihova aktivnost $1$. Za $\mathrm{CaCO_3(s) \rightleftharpoons CaO(s) + CO_2(g)}$ je $K_c = [\mathrm{CO_2}]$.

### Ravnotežje plinov

Za pline pogosto pišemo konstanto s parcialnimi tlaki, $K_p = \dfrac{p_\mathrm{C}^c\,p_\mathrm{D}^d}{p_\mathrm{A}^a\,p_\mathrm{B}^b}$. Za idealni plin je $p_i V = n_i RT$, torej $p_i = c_i RT$. Ko to vstavimo v $K_p$, dobimo $K_p = \dfrac{[\mathrm{C}]^c[\mathrm{D}]^d}{[\mathrm{A}]^a[\mathrm{B}]^b}\,(RT)^{c + d - a - b}$, torej

$$K_p = K_c\,(RT)^{\Delta n}, \qquad \Delta n = (c + d) - (a + b),$$

kjer $\Delta n$ šteje le plinaste snovi. Če so tlaki v barih in koncentracije v $\mathrm{mol/L}$, je $R = 0{,}083\,14\,\mathrm{L\,bar\,mol^{-1}\,K^{-1}}$.

### Pomen velikosti $K$

Če je $K \gg 1$ (npr. $10^{10}$), je v ravnotežju skoraj vse v obliki produktov in reakcija poteče »do konca«. Če je $K \ll 1$, skoraj ne poteče. Pri $K$ okoli $1$ so v ravnotežju pomembne količine reaktantov in produktov.

### Računanje s konstantami

Konstanta je vezana na zapis enačbe:

- obrnjena reakcija: $K' = 1/K$,
- enačba, pomnožena z $m$: $K' = K^m$ (npr. z $\tfrac12$ dobimo $\sqrt K$),
- vsota dveh reakcij: $K = K_1 \cdot K_2$.

Utemeljitev: pri obratu zamenjata števec in imenovalec; pri množenju z $m$ se vsak eksponent pomnoži z $m$; pri seštevanju zmnožimo izraza in koncentracije vmesnih snovi se okrajšajo. Enako sledi iz $\Delta_\mathrm{r}G^\circ = -RT\ln K$, ker se Gibbsove energije seštevajo.

### Kvocient reakcije

$Q$ ima enako obliko kot $K$, le da vanj vstavimo **trenutne** koncentracije. Predstavljaj si številsko premico z oznako pri vrednosti $K$: trenutni $Q$ leži nekje na njej, sistem pa vedno drsi proti oznaki.

- $Q < K$ (levo od oznake): produktov je premalo, reakcija teče v desno (nastajajo produkti),
- $Q > K$ (desno od oznake): produktov je preveč, reakcija teče v levo,
- $Q = K$: sistem je v ravnotežju.

:::premisli
Ravnotežno zmes $\mathrm{N_2O_4 \rightleftharpoons 2\,NO_2}$ stisneš na polovico prostornine, zato se obe koncentraciji podvojita. Kam se na premici premakne $Q = [\mathrm{NO_2}]^2/[\mathrm{N_2O_4}]$?
---
Števec zraste štirikrat, imenovalec dvakrat, zato se $Q$ podvoji in pristane desno od $K$. Reakcija teče v levo, k manj molekulam plina; to je Le Chatelierovo načelo, izpeljano iz $Q$.
:::

### Preglednica »začetek, sprememba, ravnotežje«

Pri računanju ravnotežnih koncentracij zapišemo za vsako snov začetno koncentracijo, spremembo (z neznanko $x$, pomnoženo s koeficientom) in ravnotežno koncentracijo. Ravnotežne izraze vstavimo v $K$ in rešimo enačbo za $x$. Na koncu preverimo, da nobena koncentracija ni negativna. **Stopnja disociacije** $\alpha$ je razmerje med razpadlo in začetno množino snovi ($0 \le \alpha \le 1$).

### Le Chatelierovo načelo

Če sistem v ravnotežju zmotimo, se ravnotežje premakne v smer, ki motnjo delno izniči.

| Motnja | Premik ravnotežja | $K$ |
|---|---|---|
| dodatek reaktanta ali odstranjevanje produkta | v desno (spremeni se $Q$) | ostane enaka |
| manjša prostornina (večji tlak) | na stran z **manj molekulami plina**; pri $\Delta n = 0$ brez vpliva | ostane enaka |
| inertni plin pri stalni prostornini | ni premika (parcialni tlaki ostanejo enaki) | ostane enaka |
| višja temperatura, **eksotermna** reakcija ($\Delta H < 0$) | v levo | se zmanjša |
| višja temperatura, **endotermna** reakcija | v desno | se poveča |
| katalizator | ni premika, ravnotežje se le doseže hitreje (obe smeri pospeši enako) | ostane enaka |

Temperatura je torej edina sprememba, ki spremeni $K$. Kvantitativno to opisuje **van 't Hoffova enačba**: iz $-RT\ln K = \Delta_\mathrm{r}H^\circ - T\Delta_\mathrm{r}S^\circ$ sledi $\ln K = -\frac{\Delta_\mathrm{r}H^\circ}{RT} + \frac{\Delta_\mathrm{r}S^\circ}{R}$. Če sta $\Delta_\mathrm{r}H^\circ$ in $\Delta_\mathrm{r}S^\circ$ v intervalu od $T_1$ do $T_2$ približno stalni, z odštevanjem enačb za obe temperaturi dobimo

$$\ln\frac{K_2}{K_1} = -\frac{\Delta_\mathrm{r}H^\circ}{R}\left(\frac{1}{T_2} - \frac{1}{T_1}\right).$$

Pri $\Delta_\mathrm{r}H^\circ < 0$ in $T_2 > T_1$ je desna stran negativna, zato $K_2 < K_1$.

## Rešeni primeri

### Primer 1 (lažji)

V zaprti posodi pri stalni temperaturi je v ravnotežju $\mathrm{N_2O_4(g) \rightleftharpoons 2\,NO_2(g)}$. Ravnotežni koncentraciji sta $[\mathrm{N_2O_4}] = 0{,}0400\,\mathrm{mol/L}$ in $[\mathrm{NO_2}] = 0{,}0120\,\mathrm{mol/L}$. Izračunaj $K_c$.

**Podatki:** reakcija $\mathrm{N_2O_4 \rightleftharpoons 2\,NO_2}$, $[\mathrm{N_2O_4}] = 0{,}0400\,\mathrm{mol/L}$, $[\mathrm{NO_2}] = 0{,}0120\,\mathrm{mol/L}$ (ravnotežni vrednosti)
**Iščemo:** konstanto $K_c$

:::formula
$K_c = \dfrac{[\mathrm{NO_2}]^2}{[\mathrm{N_2O_4}]}$
:::

**Rešitev:**

1. Izraz: produkt $\mathrm{NO_2}$ ima koeficient $2$, zato je v števcu na kvadrat.
2. Vstavimo: $K_c = \dfrac{(0{,}0120)^2}{0{,}0400} = \dfrac{1{,}44 \cdot 10^{-4}}{0{,}0400} = 3{,}6 \cdot 10^{-3}$.
3. Odgovor: $K_c = 3{,}6 \cdot 10^{-3}$ (izraženo v $\mathrm{mol/L}$, glej »Bolj natančno«); ker je $K_c \ll 1$, je pri tej temperaturi v ravnotežju večinoma $\mathrm{N_2O_4}$.

### Primer 2

V posodo s prostornino $2{,}00\,\mathrm{L}$ damo $1{,}00\,\mathrm{mol}$ vodika in $1{,}00\,\mathrm{mol}$ joda. Pri temperaturi poskusa je za reakcijo $\mathrm{H_2(g) + I_2(g) \rightleftharpoons 2\,HI(g)}$ konstanta $K_c = 49{,}0$. Izračunaj ravnotežne koncentracije.

**Podatki:** $V = 2{,}00\,\mathrm{L}$, $n_0(\mathrm{H_2}) = 1{,}00\,\mathrm{mol}$, $n_0(\mathrm{I_2}) = 1{,}00\,\mathrm{mol}$, $n_0(\mathrm{HI}) = 0$, $K_c = 49{,}0$
**Iščemo:** $[\mathrm{H_2}]$, $[\mathrm{I_2}]$, $[\mathrm{HI}]$ v ravnotežju

:::formula
$K_c = \dfrac{[\mathrm{HI}]^2}{[\mathrm{H_2}][\mathrm{I_2}]}$; preglednica: začetek, sprememba ($-x$, $-x$, $+2x$), ravnotežje
:::

**Rešitev:**

1. Začetne koncentracije (v $K_c$ gredo koncentracije, ne množine): $c_0(\mathrm{H_2}) = c_0(\mathrm{I_2}) = 1{,}00/2{,}00 = 0{,}500\,\mathrm{mol/L}$.
2. Preglednica ($\mathrm{mol/L}$):

| | $\mathrm{H_2}$ | $\mathrm{I_2}$ | $\mathrm{HI}$ |
|---|---|---|---|
| začetek | $0{,}500$ | $0{,}500$ | $0$ |
| sprememba | $-x$ | $-x$ | $+2x$ |
| ravnotežje | $0{,}500 - x$ | $0{,}500 - x$ | $2x$ |

3. Vstavimo: $49{,}0 = \dfrac{(2x)^2}{(0{,}500 - x)^2}$. Obe strani sta kvadrata, zato korenimo: $7{,}00 = \dfrac{2x}{0{,}500 - x}$.
4. $3{,}50 - 7{,}00x = 2x$, $9{,}00x = 3{,}50$, $x = 0{,}389\,\mathrm{mol/L}$.
5. Ravnotežje: $[\mathrm{H_2}] = [\mathrm{I_2}] = 0{,}500 - 0{,}389 = 0{,}111\,\mathrm{mol/L}$, $[\mathrm{HI}] = 2 \cdot 0{,}389 = 0{,}778\,\mathrm{mol/L}$.
6. Preizkus: $0{,}778^2/0{,}111^2 \approx 49{,}0$.
7. Odgovor: v ravnotežju je $[\mathrm{H_2}] = [\mathrm{I_2}] = 0{,}111\,\mathrm{mol/L}$ in $[\mathrm{HI}] = 0{,}778\,\mathrm{mol/L}$; zreagiralo je $78\,\%$ vodika.

### Primer 3 (težji)

Za razpad $\mathrm{PCl_5(g) \rightleftharpoons PCl_3(g) + Cl_2(g)}$ je pri $250\,^\circ\mathrm{C}$ konstanta $K_c = 0{,}0420$. V posodi so trenutno $[\mathrm{PCl_5}] = 0{,}100\,\mathrm{mol/L}$, $[\mathrm{PCl_3}] = 0{,}0500\,\mathrm{mol/L}$ in $[\mathrm{Cl_2}] = 0{,}0500\,\mathrm{mol/L}$. V katero smer bo tekla reakcija? Izračunaj ravnotežne koncentracije, stopnjo disociacije $\mathrm{PCl_5}$ glede na trenutno stanje in $K_p$. Kolikšna bi morala biti trenutna koncentracija $\mathrm{Cl_2}$ (pri enakih ostalih dveh), da bi bil sistem že v ravnotežju? Kam se premakne ravnotežje, če prostornino posode povečamo?

**Podatki:** $K_c = 0{,}0420$, $T = 250\,^\circ\mathrm{C} = 523{,}15\,\mathrm{K}$, $[\mathrm{PCl_5}]_0 = 0{,}100\,\mathrm{mol/L}$, $[\mathrm{PCl_3}]_0 = 0{,}0500\,\mathrm{mol/L}$, $[\mathrm{Cl_2}]_0 = 0{,}0500\,\mathrm{mol/L}$, $R = 0{,}083\,14\,\mathrm{L\,bar\,mol^{-1}\,K^{-1}}$
**Iščemo:** smer reakcije, ravnotežne koncentracije, $\alpha$, $K_p$, $[\mathrm{Cl_2}]$ za $Q = K_c$, vpliv povečanja prostornine

:::formula
$Q = \dfrac{[\mathrm{PCl_3}][\mathrm{Cl_2}]}{[\mathrm{PCl_5}]}$, primerjava $Q$ s $K$; $\quad K_p = K_c\,(RT)^{\Delta n}$
:::

**Rešitev:**

1. $Q = \dfrac{0{,}0500 \cdot 0{,}0500}{0{,}100} = 0{,}0250$. Ker je $Q < K_c$, reakcija teče v desno (razpada $\mathrm{PCl_5}$).
2. Ravnotežje: $[\mathrm{PCl_5}] = 0{,}100 - x$, $[\mathrm{PCl_3}] = [\mathrm{Cl_2}] = 0{,}0500 + x$ (ker reakcija teče v desno, se $\mathrm{PCl_5}$ porabi, produkta pa nastajata).
3. Enačba: $\dfrac{(0{,}0500 + x)^2}{0{,}100 - x} = 0{,}0420$, kar uredimo v $x^2 + 0{,}142\,x - 0{,}001\,70 = 0$.
4. $x = \dfrac{-0{,}142 + \sqrt{0{,}142^2 + 4 \cdot 0{,}001\,70}}{2} = \dfrac{-0{,}142 + 0{,}1642}{2} = 0{,}0111\,\mathrm{mol/L}$ (negativna rešitev nima pomena).
5. Ravnotežje: $[\mathrm{PCl_5}] = 0{,}0889\,\mathrm{mol/L}$, $[\mathrm{PCl_3}] = [\mathrm{Cl_2}] = 0{,}0611\,\mathrm{mol/L}$. Preizkus: $0{,}0611^2/0{,}0889 \approx 0{,}0420$.
6. Stopnja disociacije glede na trenutno stanje: $\alpha = \dfrac{0{,}0111}{0{,}100} = 0{,}111$, torej razpade še $11{,}1\,\%$ $\mathrm{PCl_5}$.
7. $\Delta n = 2 - 1 = 1$, $K_p = 0{,}0420 \cdot 0{,}083\,14 \cdot 523{,}15 \approx 1{,}83$.
8. Obratno vprašanje: ravnotežje velja, ko je $Q = K_c$, torej $[\mathrm{Cl_2}] = \dfrac{K_c[\mathrm{PCl_5}]}{[\mathrm{PCl_3}]} = \dfrac{0{,}0420 \cdot 0{,}100}{0{,}0500} = 0{,}0840\,\mathrm{mol/L}$.
9. Povečanje prostornine zniža tlak; ravnotežje se premakne na stran z več molekulami plina, torej v desno.
10. Odgovor: reakcija teče v desno do $[\mathrm{PCl_5}] = 0{,}0889\,\mathrm{mol/L}$ in $[\mathrm{PCl_3}] = [\mathrm{Cl_2}] = 0{,}0611\,\mathrm{mol/L}$ ($\alpha = 11{,}1\,\%$); $K_p \approx 1{,}83$; pri $[\mathrm{Cl_2}] = 0{,}0840\,\mathrm{mol/L}$ bi bil sistem že v ravnotežju; večja prostornina še poveča razpad $\mathrm{PCl_5}$.

### Primer 4 – zdaj ti

Tilnova plastenka gazirane vode je zaprta in pri $25\,^\circ\mathrm{C}$ v ravnotežju $\mathrm{CO_2(g) \rightleftharpoons CO_2(aq)}$ pri tlaku $\mathrm{CO_2}$ nad vodo $3{,}0\,\mathrm{bar}$. Z aktivnostmi (glej »Bolj natančno«) je konstanta $K = \dfrac{[\mathrm{CO_2(aq)}]/c^\circ}{p_{\mathrm{CO_2}}/p^\circ} = 0{,}034$. Ko plastenko odpre, je nad vodo zrak s $p_{\mathrm{CO_2}} = 4{,}0 \cdot 10^{-4}\,\mathrm{bar}$. Raztapljanje $\mathrm{CO_2}$ v vodi je eksotermno. V katero smer teče proces in kolikšna je raztopljena koncentracija $\mathrm{CO_2}$, ko se vzpostavi novo ravnotežje?

**Podatki:** $K = 0{,}034$ (pri $25\,^\circ\mathrm{C}$), $p_{\mathrm{CO_2}} = 3{,}0\,\mathrm{bar}$ (zaprta), $p_{\mathrm{CO_2}} = 4{,}0 \cdot 10^{-4}\,\mathrm{bar}$ (odprta), $c^\circ = 1\,\mathrm{mol/L}$, $p^\circ = 1\,\mathrm{bar}$, raztapljanje eksotermno ($\Delta H < 0$)
**Iščemo:** $[\mathrm{CO_2(aq)}]$ v zaprti plastenki, smer procesa po odprtju, novo ravnotežno $[\mathrm{CO_2(aq)}]$

:::formula
$K = \dfrac{[\mathrm{CO_2(aq)}]/c^\circ}{p_{\mathrm{CO_2}}/p^\circ}$; $\quad Q > K$: v levo
:::

**Rešitev:**

1. Zaprta plastenka je v ravnotežju, zato velja $[\mathrm{CO_2(aq)}] = K \cdot p_{\mathrm{CO_2}} = 0{,}034 \cdot 3{,}0 = 0{,}102\,\mathrm{mol/L}$.
2. Takoj po odprtju je raztopljenega $\mathrm{CO_2}$ še enako, tlak pa pade, zato $Q = \dfrac{0{,}102}{4{,}0 \cdot 10^{-4}} = 255$. Ker je $Q \gg K$, proces teče v levo: $\mathrm{CO_2}$ uhaja iz vode.
3. Izračunaj novo ravnotežno $[\mathrm{CO_2(aq)}]$ sam in premisli, zakaj Tilnu pomaga hladilnik, nato preveri:

:::premisli
Kolikšna je $[\mathrm{CO_2(aq)}]$ v odprti plastenki po vzpostavitvi ravnotežja? Zakaj hladna voda ostane gazirana dlje?
---
$[\mathrm{CO_2(aq)}] = 0{,}034 \cdot 4{,}0 \cdot 10^{-4} = 1{,}36 \cdot 10^{-5}\,\mathrm{mol/L}$, praktično nič: odprta plastenka slej ko prej izgubi ves plin, zato jo je treba zapirati. Raztapljanje $\mathrm{CO_2}$ je eksotermno, zato je pri nižji temperaturi $K$ večja in voda zadrži več plina; poleg tega je pri nizki temperaturi uhajanje počasnejše.
:::

## Pogoste napake

- **Začetne namesto ravnotežnih koncentracij.** V $K$ vstavljamo le ravnotežne vrednosti. Začetne koncentracije vstavimo v $Q$.
- **Trdne snovi in voda v izrazu.** $[\mathrm{CaCO_3(s)}]$ ali $[\mathrm{H_2O(l)}]$ ne pišemo v $K$.
- **Pozabljeni koeficienti.** Pri $\mathrm{2\,NO_2}$ je v izrazu $[\mathrm{NO_2}]^2$, v preglednici pa sprememba $+2x$, ne $+x$.
- **»Dodatek reaktanta spremeni $K$.«** Ne. $K$ se spremeni le s temperaturo. Dodatek snovi spremeni $Q$, sistem pa se vrne k isti $K$.
- **»Višja temperatura vedno poveča $K$.«** Le pri endotermnih reakcijah. Pri eksotermnih se $K$ zmanjša, čeprav reakcija teče hitreje.
- **Katalizator premakne ravnotežje.** Ne, le pospeši doseganje ravnotežja.
- **Tlak in snovi v različnih fazah.** Pri $\Delta n$ štejemo le pline. V reakciji $\mathrm{C(s) + CO_2(g) \rightleftharpoons 2\,CO(g)}$ je $\Delta n = 2 - 1 = 1$.
- **Napačna rešitev kvadratne enačbe.** Rešitev, ki da negativno koncentracijo ali porabi več snovi, kot je je na voljo, zavrzi.

## Povzetek

- Ravnotežje je dinamično: hitrosti v obe smeri sta enaki, sestava se ne spreminja.
- $K_c = \prod[\text{produkti}]^{\nu} / \prod[\text{reaktanti}]^{\nu}$ z ravnotežnimi koncentracijami; trdnih snovi in čistih tekočin ne pišemo.
- $K_p = K_c\,(RT)^{\Delta n}$; obrnjena reakcija $1/K$, pomnožena z $m$: $K^m$, vsota reakcij: $K_1K_2$.
- $Q < K$: v desno, $Q > K$: v levo, $Q = K$: ravnotežje.
- Ravnotežne koncentracije iz preglednice »začetek, sprememba, ravnotežje«.
- Le Chatelier: sistem delno izniči motnjo; manjša prostornina premakne k manj molekulam plina; višja temperatura premakne v endotermno smer in je edina sprememba, ki spremeni $K$.
- $\Delta_\mathrm{r}G^\circ = -RT\ln K$; van 't Hoff: $\ln\frac{K_2}{K_1} = -\frac{\Delta_\mathrm{r}H^\circ}{R}\left(\frac{1}{T_2} - \frac{1}{T_1}\right)$.

## Za izpit

Znati moraš povedati:

- definicijo dinamičnega ravnotežja in zakon o vplivu koncentracij s pogoji (zaprt sistem, stalna temperatura; trdnih snovi in topila ne pišemo);
- izpeljavo $K_p = K_c(RT)^{\Delta n}$ iz enačbe idealnega plina;
- zvezo $\Delta_\mathrm{r}G = \Delta_\mathrm{r}G^\circ + RT\ln Q$, izpeljavo $\Delta_\mathrm{r}G^\circ = -RT\ln K$ in iz nje pravilo za smer reakcije;
- pravila za konstanto obrnjene, pomnožene in seštete reakcije z utemeljitvijo;
- Le Chatelierovo načelo in izpeljavo van 't Hoffove enačbe s predpostavko o stalni $\Delta_\mathrm{r}H^\circ$.

### Naloga 1

Za reakcijo $\mathrm{N_2O_4(g) \rightleftharpoons 2\,NO_2(g)}$ je pri $298\,\mathrm{K}$ konstanta $K_p = 0{,}148$ (tlaki v barih), $\Delta_\mathrm{r}H^\circ = +57{,}2\,\mathrm{kJ/mol}$. V prazno posodo s prostornino $1{,}00\,\mathrm{L}$ damo $0{,}0200\,\mathrm{mol}$ $\mathrm{N_2O_4}$ in jo segrejemo na $350\,\mathrm{K}$. Izračunaj stopnjo disociacije $\mathrm{N_2O_4}$ in skupni tlak v ravnotežju. $\Delta_\mathrm{r}H^\circ$ je v tem intervalu stalna, $R = 8{,}314\,\mathrm{J\,mol^{-1}\,K^{-1}} = 0{,}083\,14\,\mathrm{L\,bar\,mol^{-1}\,K^{-1}}$.

**Rešitev:**

1. Van 't Hoff: $\ln\dfrac{K_2}{K_1} = -\dfrac{57\,200}{8{,}314}\left(\dfrac{1}{350} - \dfrac{1}{298}\right) = 3{,}430$, torej $\dfrac{K_2}{K_1} = 30{,}9$ in $K_p(350\,\mathrm{K}) = 0{,}148 \cdot 30{,}9 \approx 4{,}57$. Reakcija je endotermna, zato $K$ s temperaturo raste.
2. Pretvorba v $K_c$ ($\Delta n = 1$): $RT = 0{,}083\,14 \cdot 350 = 29{,}10$, $K_c = \dfrac{4{,}57}{29{,}10} = 0{,}157$.
3. Preglednica: $c_0(\mathrm{N_2O_4}) = 0{,}0200\,\mathrm{mol/L}$; v ravnotežju $[\mathrm{N_2O_4}] = 0{,}0200 - x$, $[\mathrm{NO_2}] = 2x$.
4. Enačba: $\dfrac{4x^2}{0{,}0200 - x} = 0{,}157$, urejeno $4x^2 + 0{,}157\,x - 0{,}003\,14 = 0$.
5. $x = \dfrac{-0{,}157 + \sqrt{0{,}157^2 + 16 \cdot 0{,}003\,14}}{8} = \dfrac{-0{,}157 + 0{,}2737}{8} = 0{,}01458\,\mathrm{mol/L}$; negativna rešitev nima pomena.
6. Stopnja disociacije: $\alpha = \dfrac{0{,}01458}{0{,}0200} = 0{,}729$.
7. Skupna koncentracija plina: $0{,}0200 - x + 2x = 0{,}0346\,\mathrm{mol/L}$, skupni tlak $p = cRT = 0{,}0346 \cdot 29{,}10 = 1{,}01\,\mathrm{bar}$.
8. Preizkus s parcialnimi tlaki: $p(\mathrm{NO_2}) = 0{,}0292 \cdot 29{,}10 = 0{,}849\,\mathrm{bar}$, $p(\mathrm{N_2O_4}) = 0{,}005\,42 \cdot 29{,}10 = 0{,}158\,\mathrm{bar}$, $0{,}849^2/0{,}158 \approx 4{,}56 \approx K_p$.
9. Odgovor: pri $350\,\mathrm{K}$ razpade $72{,}9\,\%$ $\mathrm{N_2O_4}$, skupni tlak v ravnotežju je približno $1{,}01\,\mathrm{bar}$.

### Naloga 2

Iz zveze $\Delta_\mathrm{r}G = \Delta_\mathrm{r}G^\circ + RT\ln Q$ izpelji povezavo med $\Delta_\mathrm{r}G^\circ$ in $K$ ter z njo utemelji pravilo za smer reakcije in pravilo $K = K_1 K_2$ za vsoto dveh reakcij. Nato izpelji van 't Hoffovo enačbo in utemelji, ali višja temperatura vedno poveča ravnotežni izkoristek.

**Rešitev:**

1. V ravnotežju je $\Delta_\mathrm{r}G = 0$ in $Q = K$: $0 = \Delta_\mathrm{r}G^\circ + RT\ln K$, torej $\Delta_\mathrm{r}G^\circ = -RT\ln K$.
2. Vstavimo nazaj: $\Delta_\mathrm{r}G = RT\ln Q - RT\ln K = RT\ln\dfrac{Q}{K}$. Pri $Q < K$ je $\Delta_\mathrm{r}G < 0$ in reakcija spontano teče v desno; pri $Q > K$ je $\Delta_\mathrm{r}G > 0$, spontano teče obratna reakcija, torej v levo.
3. Vsota reakcij: $G$ je funkcija stanja, zato $\Delta_\mathrm{r}G^\circ_3 = \Delta_\mathrm{r}G^\circ_1 + \Delta_\mathrm{r}G^\circ_2$. Z $\Delta_\mathrm{r}G^\circ = -RT\ln K$ dobimo $\ln K_3 = \ln K_1 + \ln K_2$, torej $K_3 = K_1 K_2$.
4. Van 't Hoff: $-RT\ln K = \Delta_\mathrm{r}H^\circ - T\Delta_\mathrm{r}S^\circ$ da $\ln K = -\dfrac{\Delta_\mathrm{r}H^\circ}{RT} + \dfrac{\Delta_\mathrm{r}S^\circ}{R}$. Zapišemo za $T_1$ in $T_2$ in odštejemo; pri stalnih $\Delta_\mathrm{r}H^\circ$ in $\Delta_\mathrm{r}S^\circ$ se člen z entropijo odšteje: $\ln\dfrac{K_2}{K_1} = -\dfrac{\Delta_\mathrm{r}H^\circ}{R}\left(\dfrac{1}{T_2} - \dfrac{1}{T_1}\right)$.
5. Pri $T_2 > T_1$ je $\frac{1}{T_2} - \frac{1}{T_1} < 0$. Za $\Delta_\mathrm{r}H^\circ > 0$ je desna stran pozitivna in $K_2 > K_1$; za $\Delta_\mathrm{r}H^\circ < 0$ je negativna in $K_2 < K_1$.
6. Odgovor: $\Delta_\mathrm{r}G^\circ = -RT\ln K$; višja temperatura poveča ravnotežni izkoristek le pri endotermnih reakcijah, pri eksotermnih ga zmanjša (hitrost pa se poveča v obeh primerih).

## Drugače: Na sliki

Predstavljaj si graf koncentracij v odvisnosti od časa za Primer 2:

```
 c [mol/L]
 0,8 |               .................  HI (0,778)
     |          ..''
 0,5 |*      .''
     |  *  .'
     |   .*
     |  .   *
 0,1 | .       **********************  H2 = I2 (0,111)
   0 |'_______________________________ čas
      ^ začetek      ^ ravnotežje (vodoravne črte)
```

Krivulje se po določenem času zravnajo. To ne pomeni, da se reakcija ustavi, ampak da sta hitrosti v obe smeri enaki.

Le Chatelierovo načelo si predstavljaj kot tehtnico z vzmetjo: če na eno stran dodaš utež (reaktant), se tehtnica nagne, sistem pa del uteži »prestavi« na drugo stran (nastane nekaj produkta). Popolnoma se ne vrne v prvotno lego, saj je nova ravnotežna zmes drugačna, razmerje v izrazu za $K$ pa spet enako.

## Drugače: Uporaba v stroki

**Sinteza amoniaka.** Reakcija $\mathrm{N_2 + 3\,H_2 \rightleftharpoons 2\,NH_3}$ je eksotermna in zmanjša število molekul plina ($\Delta n = -2$). Po Le Chatelierju bi bili ugodni nizka temperatura in visok tlak, pri nizki temperaturi pa je reakcija prepočasna. Zato v industriji delajo pri okoli $450\,^\circ\mathrm{C}$ s katalizatorjem na osnovi železa in pri $150$ do $300\,\mathrm{bar}$, amoniak pa sproti utekočinjajo in odstranjujejo, kar ravnotežje vleče v desno.

**Kontaktni postopek za žveplovo kislino.** Oksidacija $\mathrm{2\,SO_2 + O_2 \rightleftharpoons 2\,SO_3}$ ($\Delta_\mathrm{r}H^\circ \approx -198\,\mathrm{kJ/mol}$) teče na katalizatorju $\mathrm{V_2O_5}$ v več zaporednih plasteh. Plin med plastmi hladijo, ker pri nižji temperaturi $K$ naraste, uporabljajo presežek zraka (več $\mathrm{O_2}$), vmesna absorpcija $\mathrm{SO_3}$ pa odstrani produkt; tako presežejo $99\,\%$ pretvorbe.

**Gravimetrija.** Oborino kalcijevega oksalata $\mathrm{CaC_2O_4}$ spiramo z razredčeno raztopino amonijevega oksalata, ne s čisto vodo: oksalatni ion $\mathrm{C_2O_4^{2-}}$ je skupen oborini in raztopini, zato poveča $Q$ za raztapljanje $\mathrm{CaC_2O_4(s) \rightleftharpoons Ca^{2+} + C_2O_4^{2-}}$ in premakne ravnotežje v levo in zmanjša izgube, amonijev oksalat pa pri žarjenju razpade.

## Drugače: Korak za korakom s številkami

Ravnotežno zmes iz Primera 1 ($[\mathrm{N_2O_4}] = 0{,}0400\,\mathrm{mol/L}$, $[\mathrm{NO_2}] = 0{,}0120\,\mathrm{mol/L}$, $K_c = 3{,}6 \cdot 10^{-3}$) pri stalni temperaturi stisnemo na polovico prostornine. Kaj se zgodi?

1. **Takoj po stiskanju** se koncentraciji podvojita: $[\mathrm{N_2O_4}] = 0{,}0800\,\mathrm{mol/L}$, $[\mathrm{NO_2}] = 0{,}0240\,\mathrm{mol/L}$.
2. **Kvocient:** $Q = 0{,}0240^2/0{,}0800 = 7{,}2 \cdot 10^{-3} = 2K_c$. Ker je $Q > K_c$, teče reakcija v levo (k manj molekulam plina), kot napove Le Chatelier.
3. **Preglednica:** $[\mathrm{NO_2}] = 0{,}0240 - 2z$, $[\mathrm{N_2O_4}] = 0{,}0800 + z$.
4. **Enačba:** $(0{,}0240 - 2z)^2 = 3{,}6 \cdot 10^{-3}\,(0{,}0800 + z)$ oziroma $4z^2 - 0{,}0996\,z + 2{,}88 \cdot 10^{-4} = 0$.
5. **Rešitev:** $z = 0{,}003\,34\,\mathrm{mol/L}$ (druga rešitev, $z \approx 0{,}0215$, bi dala negativno $[\mathrm{NO_2}]$).
6. **Novo ravnotežje:** $[\mathrm{NO_2}] = 0{,}0173\,\mathrm{mol/L}$, $[\mathrm{N_2O_4}] = 0{,}0833\,\mathrm{mol/L}$. Preizkus: $0{,}0173^2/0{,}0833 \approx 3{,}6 \cdot 10^{-3}$.
7. **Stopnja disociacije** $\mathrm{N_2O_4}$: pred stiskanjem je razpadlo $0{,}0120/2 = 0{,}006\,\mathrm{mol/L}$ od skupaj $0{,}0400 + 0{,}006 = 0{,}046\,\mathrm{mol/L}$, po stiskanju sta obe vrednosti dvakratni ($0{,}0120$ od $0{,}092\,\mathrm{mol/L}$), v novem ravnotežju pa je razpadlo le še $0{,}0120 - 0{,}003\,34 = 0{,}008\,66\,\mathrm{mol/L}$. Stopnja pade s $0{,}006/0{,}046 = 13{,}0\,\%$ na približno $9{,}4\,\%$. Koncentracija $\mathrm{NO_2}$ je sicer večja kot pred stiskanjem ($0{,}0173 > 0{,}0120$), a manjša kot takoj po njem ($0{,}0240$): motnja je le delno izničena.

## Drugače: Bolj natančno

**Termodinamična konstanta.** S stehiometričnimi števili $\nu_i$ (pri produktih pozitivnimi, pri reaktantih negativnimi) je $K = \prod_i a_i^{\nu_i}$ brez enote; $K_c$ iz Primera 1 je številsko enaka konstanti s koncentracijami, deljenimi s $c^\circ = 1\,\mathrm{mol/L}$. Pri večjih koncentracijah namesto $c_i/c^\circ$ pišemo $\gamma_i c_i/c^\circ$ z aktivnostnim koeficientom $\gamma_i$, ki v razredčenih raztopinah gre proti $1$.

**Graf $\ln K$ proti $1/T$.** Iz $\ln K = -\frac{\Delta_\mathrm{r}H^\circ}{RT} + \frac{\Delta_\mathrm{r}S^\circ}{R}$ sledi, da je graf premica z naklonom $-\Delta_\mathrm{r}H^\circ/R$ in odsekom $\Delta_\mathrm{r}S^\circ/R$. Tako iz meritev $K$ pri več temperaturah v laboratoriju določimo reakcijsko entalpijo in entropijo.

**Kinetični pogled.** Za elementarno reakcijo v obe smeri je $v_\to = k_\to[\mathrm{A}][\mathrm{B}]$ in $v_\leftarrow = k_\leftarrow[\mathrm{C}][\mathrm{D}]$. V ravnotežju je $v_\to = v_\leftarrow$, torej $K_c = k_\to/k_\leftarrow$. Katalizator zniža aktivacijsko energijo v obe smeri enako, zato se razmerje $k_\to/k_\leftarrow$ ne spremeni.

## Preveri se

? Kateri je pravilni izraz za konstanto ravnotežja reakcije $\mathrm{CaCO_3(s) \rightleftharpoons CaO(s) + CO_2(g)}$?
- $K_c = \dfrac{[\mathrm{CaO}][\mathrm{CO_2}]}{[\mathrm{CaCO_3}]}$
~ Zapisal si vse snovi kot pri homogeni reakciji; trdni snovi imata aktivnost $1$ in v izrazu ne nastopata.
+ $K_c = [\mathrm{CO_2}]$
- $K_c = \dfrac{1}{[\mathrm{CO_2}]}$
~ Ulomek si obrnil: $\mathrm{CO_2}$ je produkt, zato je v števcu.
> Trdni snovi $\mathrm{CaCO_3}$ in $\mathrm{CaO}$ imata aktivnost $1$ in ju ne pišemo. Ostane le produkt $\mathrm{CO_2}$ v števcu.

? Za reakcijo je kvocient $Q$ večji od konstante $K$. Kaj se zgodi?
- reakcija teče v desno, nastajajo produkti
~ Pravilo si obrnil: v desno teče pri $Q < K$, ko je produktov premalo.
+ reakcija teče v levo, nastajajo reaktanti
- sistem je že v ravnotežju
~ Ravnotežje velja le pri $Q = K$; $Q > K$ pomeni, da je produktov preveč.
> Pri $Q > K$ je produktov preveč glede na ravnotežje, zato se del produktov pretvori nazaj v reaktante, dokler ni $Q = K$.

? Reakcija je eksotermna. Kaj se zgodi s konstanto ravnotežja, če temperaturo povišamo?
- poveča se
~ Višja temperatura res pospeši reakcijo, a lega eksotermnega ravnotežja se premakne v levo, k reaktantom.
+ zmanjša se
- ostane enaka
~ Zamenjaš temperaturo s koncentracijo ali katalizatorjem, ki $K$ ne spremenita; temperatura je edina sprememba, ki $K$ spremeni.
> Pri eksotermni reakciji se toplota sprošča; višja temperatura premakne ravnotežje v endotermno smer (v levo) in $K$ se zmanjša. Temperatura je edina sprememba, ki spremeni $K$.

? Za reakcijo $\mathrm{A \rightleftharpoons B}$ je $K = 4{,}0 \cdot 10^2$. Kolikšna je konstanta za reakcijo $\mathrm{B \rightleftharpoons A}$?
- $-4{,}0 \cdot 10^2$
~ Obrnjeno reakcijo si obravnaval kot $\Delta H$, ki zamenja predznak; konstanta se obrne v recipročno vrednost in je vedno pozitivna.
- $4{,}0 \cdot 10^{-2}$
~ Le eksponent si spremenil v negativnega, mantise pa nisi obrnil; $4{,}0 \cdot 10^{-2}$ je $1/25$, ne $1/400$.
+ $2{,}5 \cdot 10^{-3}$
> Za obrnjeno reakcijo je $K' = 1/K = 1/400 = 2{,}5 \cdot 10^{-3}$. Konstanta ravnotežja ni nikoli negativna.

? Študentka za $\mathrm{N_2O_4 \rightleftharpoons 2\,NO_2}$ z $[\mathrm{N_2O_4}] = 0{,}0400\,\mathrm{mol/L}$ in $[\mathrm{NO_2}] = 0{,}0120\,\mathrm{mol/L}$ zapiše: $K_c = 0{,}0120/0{,}0400 = 0{,}300$. Kateri korak je napačen?
- ulomek je obrnjen, $\mathrm{N_2O_4}$ spada v števec
~ $\mathrm{N_2O_4}$ je reaktant in spada v imenovalec, kot ga je zapisala; ulomek je pravilen.
+ $[\mathrm{NO_2}]$ ni kvadrirala, koeficient $2$ je eksponent
- vstavila bi morala začetne koncentracije
~ V $K$ gredo prav ravnotežne koncentracije; začetne bi vstavila v $Q$.
> Pravilno je $K_c = 0{,}0120^2/0{,}0400 = 3{,}6 \cdot 10^{-3}$ (Primer 1). Brez kvadrata dobi vrednost, ki je več kot osemdesetkrat prevelika.

:::simboli
a, b | stehiometrična koeficienta reaktantov A in B | | –
c, d | stehiometrična koeficienta produktov C in D | | – | c je drugje tudi množinska koncentracija
K_c | konstanta ravnotežja s koncentracijami | K_c = \frac{[\mathrm{C}]^c\,[\mathrm{D}]^d}{[\mathrm{A}]^a\,[\mathrm{B}]^b} | | odvisna le od temperature
K_p | konstanta ravnotežja s parcialnimi tlaki | K_p = K_c\,(RT)^{\Delta n} | | tlaki v barih
K | konstanta ravnotežja (termodinamična) | \Delta_\mathrm{r}G^\circ = -RT\ln K | – | z aktivnostmi je brez enote
K_1 | konstanta ravnotežja pri temperaturi T₁ | | –
K_2 | konstanta ravnotežja pri temperaturi T₂ | | –
Q | kvocient reakcije | | – | enaka oblika kot K, a s trenutnimi koncentracijami
R | splošna plinska konstanta | | J/(mol K) | s tlaki v barih 0,083 14 L bar/(mol K)
T | absolutna temperatura | | K
T_1, T_2 | temperaturi, pri katerih primerjamo konstanti | | K
\Delta n | razlika množin plinastih produktov in reaktantov | \Delta n = (c + d) - (a + b) | – | šteje le plinaste snovi
\Delta_\mathrm{r} | sprememba pri reakciji (reakcijska količina) | | | ΔᵣG: reakcijska Gibbsova energija, ΔᵣH°: reakcijska entalpija
G | Gibbsova energija | | kJ/mol | ΔᵣG: reakcijska Gibbsova energija; spontano, ko je negativna
H | entalpija | | kJ/mol | ΔᵣH°: standardna reakcijska entalpija
x | sprememba koncentracije v tabeli ravnotežja | | mol/L | neznanka, pomnožena s koeficientom snovi
p | parcialni tlak plina | p = cRT | bar
:::
